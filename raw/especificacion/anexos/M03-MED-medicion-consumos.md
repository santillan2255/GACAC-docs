# M03 MED — Medidores, lecturas, consumos, telemedición y prepago

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (operación de servicios medidos) / Landing-autogestión (autolectura, consumos, prepago del socio) / APIs (conectores AMI/MDM y prepago, vía T06) |
| Olas | **O7** (todo el módulo). Ningún requisito es prerrequisito del piloto Internet (O0–O6). Reutiliza de O3 el motor offline de la app de campo y de O1 la configuración versionada; los reportes avanzados y la migración repetible quedan en **O11**. |
| Dueño de datos | Catálogos de medición (marcas, tipos/modelos de medidor, códigos de observación y resultado de lectura), ficha metrológica del medidor (`meters`), puntos de medición y canales, instalaciones (colocación/retiro), precintos y ensayos del medidor, rutas, cronogramas, lotes y tareas de lectura, lecturas capturadas, consumos (calculados, estimados, divididos, distribuidos, aprobados), excepciones de consumo, ajustes de estimados, distribuciones padre-hijos, medidores testigo, demanda declarada y transgresiones, coeficiente corrector de gas del punto (los factores son de M04 y la corrección la aplica M04: HUE-GAS-03, DEC-085), medición propia (compra/frontera), perfiles de importación, sistemas de telemedición y su mapeo de registros, operaciones remotas sobre medidores, cuentas y recargas prepagas (estado técnico), contratos de generación distribuida y balances de energía inyectada. |
| Fuentes consolidadas | BASE §7 (CU-07), §8 (CU-08), §9 (CU-09), §68 (referencia de circuito de corte), §87 (medición eléctrica), §88 (medición de agua), §89 (medición de gas), §97.5, §102 (AGR), MER-001, MER-003 (lecturas por franja), MER-004 (detección), MER-007 (punto de venta prepago, referencia), MER-018, pendientes §37, §41, §98, §101, §106; AGR-010, AGR-017, AGR-025; DFA Módulo 5, Módulo 6 y ciclo mensual (§ "Rutas de lectura… validación de consumos"); REL §3 (registro manual de lecturas); RN-06 §12 a §19, §20 (parámetros de medición), §21 (implicancias 6–11 y 14), §22 (dudas 2, 3, 5, 9–13, 15, 16, 23), §23.1 (MEDSOC, recorridos, cambio de clase), §23.6 (división), §23.7 (registración, testigos, medición propia, controles, informes), §23.9; RN-01 §4 (datos de lectura que consume el cálculo) y §16 (medidor testigo); FIC 10.1, 10.2, 10.3; RN-10 §4, §9, §16.2 (adjuntos de lectura), §16.5 (informes de telemedición/consumos); CAT §3 (24 tablas); V2 módulo CONSUMOS (4) y TELEMED (45) más los V2 de medición de RN-06 §20 y RN-01 §4; INV `ProMod_Consumos` (19 formularios + control `listTramas` + fuentes `DatosConsumo*`), INV `ProMod_Titulares` (`frmComandosTelemedicion`, `frmOperacionesTelemedicion`), INV `ProMod_Cobranzas` (`frmVentaPrepaga`, `frmVentaPrepagaRapida`, `frmConfiguracionPrepaga*`, referencia), INV `ProMod_Tecnica` (`frmTecnica_CambioMedidor`, referencia); CNX §3.7 (offline) y §7.8 (relevamientos/asignaciones). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Transformar la medición física y remota de los servicios medidos (electricidad, agua, gas y cualquier otro servicio con unidad medible que el tenant habilite) en **cantidades aprobadas para liquidar**, con trazabilidad completa desde el instrumento hasta la factura. El módulo:

1. Mantiene la **ficha metrológica** de cada medidor y su **trayectoria** de instalaciones en puntos de medición, con lecturas de colocación y retiro, precintos, ensayos y evidencia (BASE §7).
2. Planifica y ejecuta la **toma de lecturas** por rutas, cronogramas y lotes, en campo y sin conexión, por carga manual, archivos de terceros, telemedición o autolectura del socio, convergiendo en **un único flujo de lote de lectura** (BASE §8, RN-06 §21.6).
3. Distingue siempre **lectura capturada → lectura validada → consumo aprobado para liquidar**, y nunca borra el dato original ni quién lo relevó (BASE §8, regla de diseño).
4. Calcula, valida, estima, divide, prorratea, distribuye y regulariza **consumos**, detectando inconsistencias sin tratar toda anomalía como error (BASE §9).
5. Gestiona **demanda contratada y transgresiones**, **energía inyectada** de usuarios-generadores (Ley 27.424, MER-001), **medición propia** (compra/frontera) y balances de pérdidas.
6. Define el **contrato funcional** con los sistemas de **telemedición AMI/MDM** y **prepago** (toma de estado, operaciones de ciclo del medidor, corte/reconexión remota, carga de crédito/token), cuya implementación técnica está en T06.
7. Expone a la factura (M04/M05) un **contrato de datos de consumo** estable y explicable: qué cantidad, de qué canal, con qué fechas, días, origen y reglas.

## 2. Límite y responsabilidades

### 2.1 Qué hace

- Catálogos de medición, ficha del medidor como instrumento (número, marca, modelo/tipo, dígitos, constante/factor, registros, indicado, lectura con factor, telemedido, prepago, sistema de telemedición, identificador remoto).
- Puntos de medición asociados al servicio contratado del socio (`serviceContracts` de M02; CTR-DAT-71) y sus canales de medición (energía activa entregada/recibida, reactiva, demanda por banda, energía por franja, volumen de agua, volumen de gas, generación).
- Instalación, retiro y cambio de medidor como **hechos de medición** con fecha efectiva, lecturas de colocación/retiro y continuidad de consumo; registro de precintos y ensayos.
- Rutas, cronogramas de lectura, lotes y tareas, asignación a lecturistas, descarga al dispositivo, operación offline, sincronización idempotente, conflictos, supervisión de avance, reasignación y cierre.
- Captura de lecturas por todos los medios (manual, app offline, archivo, telemedición, autolectura, OT), validación en origen y en servidor.
- Cálculo de consumo (incluida vuelta de medidor con confirmación, medidores indicados, factor, corrección de volumen de gas), validación contra comportamiento esperado, bandeja de excepciones, aprobación y bloqueo.
- Estimación con método y base guardados, autorización, regularización cuando llega la lectura real.
- División por período, prorrateo por días, cambio de medidor en el período, distribución padre-hijos, medidor testigo.
- Demanda contratada por período, detección de transgresiones y su tratamiento.
- Generación distribuida: contrato técnico del usuario-generador, medidor bidireccional, balance de energía por período.
- Medición propia de la cooperativa (compra a EPEC u otro proveedor, puntos de frontera) e informe de pérdidas/balance energético.
- Telemedición: configuración de sistemas por tenant, mapeo de registros, toma de estado masiva y puntual, operaciones de ciclo del medidor, contrato de comandos de corte/reconexión, auditoría de llamadas; curvas de carga como extensión.
- Prepago: estado técnico de la cuenta prepaga del medidor, solicitudes de crédito/token al proveedor, historial de cargas, avisos de saldo bajo.
- Autolectura del socio con foto, sujeta a validación.
- Detección de patrones de consumo no registrado (alertas) que M10 convierte en inspecciones.
- Informes de consumos, controles de lectura, medidores sin leer, grandes consumos, pérdidas, productividad de lecturistas.

### 2.2 Qué NO hace y a quién delega

| Tema | Responsable | Qué recibe o entrega MED |
|---|---|---|
| Precio, tramos, escalones, cargo fijo, consumo mínimo, bonificación de unidades en la factura, factor de potencia, cargos por demanda, tarifa de inyección, recargo por cambio de trama prepaga, prorrateo entre cuadros tarifarios | **M04 TAR** | MED entrega cantidades aprobadas por canal, días, fechas, consumo del testigo, demanda registrada y contratada, consumo bruto y sin inyectada, unidades a compensar (ajuste de estimados). |
| Emisión de comprobantes (incluida "Liquidación de Servicios Públicos" y facturación in situ), lotes, cierre de ciclo | **M05 FAC** | MED marca consumos como facturados al recibir `fac.invoice.issued` y bloquea su edición. |
| IVA de la energía inyectada, rendición ARCA del usuario-generador (RG 5746/2025), informes a reguladores (OCEBA 544, compensación Res. 431/24 y 65/25, Secretaría de Energía, ERSeP, ENARGAS SARI/FDU) | **M06 FIS** | MED publica conjuntos de datos de consumo por categoría, tramo y período. |
| Cobro de recargas prepagas, punto de venta remoto (R-Pos), cuenta de créditos monetarios del usuario-generador (crédito anterior, generado, aplicado, cedido, retribuido, final), saldos a favor | **M07 COB** (y M11 VEN para POS) | MED solicita el token/crédito al proveedor **después** de la confirmación del cobro y entrega el resultado. |
| Decisión de suspender, cortar o reconectar | **M08 MOR** (y M09/M10 para circuitos técnicos) | MED ejecuta el comando remoto cuando lo pide el circuito autorizado y devuelve el resultado confirmado. |
| Órdenes de trabajo de cambio de medidor, instalación, retiro, inspección, relectura, verificación; actas y procedimiento de consumo no registrado, cálculo del recupero y multa; aprovisionamiento ISP/TV (MikroTik, Radius, SmartOLT, Wispro, Sopnet, Sensa, AION) y telefonía (CDR, agrupación de llamadas) | **M10 TEC** | MED recibe al cierre de la OT las lecturas de retiro/colocación y precintos; emite eventos que M10 convierte en OT (medidor roto, inaccesible reiterado, sospecha de fraude). |
| Stock de medidores como ítem serializado, depósitos, movimientos, valorización, reparación/RMA, baja técnica | **M13 STK** | MED referencia `serialUnitId`; consume eventos de estado del activo; emite `med.meter.installed/removed` para el movimiento de stock. |
| Persona, titular, cuenta, inmueble, domicilio, servicio contratado (suministro), estado del servicio, cambio de titular | **M01 PER** | MED cuelga el punto de medición del servicio contratado y consume sus cambios de estado y de titular. |
| Tipo de servicio (medido/no medido/prepago), categorías, conceptos del servicio | **M02 CAT** | MED lee si la categoría es medida, prepaga o de grandes usuarios y qué conceptos de canal requiere. |
| Contabilización de la compra de energía, centros de costo de pérdidas | **M15 CON** / **M12 CMP** | MED entrega las cantidades medidas de compra. |
| Conectores técnicos, protocolos (REST, SOAP, TCP, SQL, archivos), bóveda de credenciales, reintentos genéricos, monitoreo de conectores | **T06 INT** (bóveda `integrationSecrets` en T06, DEC-074; CTR-DAT-72 de T05 — antes "bóveda en T01") | MED define operaciones, datos y semántica de resultado. |
| Motor offline, cola IndexedDB, `/sync` | **T03 UXD** / O3 app de campo | MED define los tipos de mutación de lectura y la resolución de conflictos de su dominio. |
| Portal y app del socio (contenedor, navegación) | **M19 POR** | MED define contenido funcional, reglas y API de "Mis consumos", "Autolectura" y "Mi prepago". |
| Notificaciones (saldo bajo, aviso de visita del lecturista, autolectura habilitada) | **T09 COM** | MED emite eventos. |
| Workflow de autorizaciones (estimaciones, ajustes, reset de demanda) | **T11 WFL** | MED declara las operaciones que requieren aprobación. |
| Reportes avanzados, BI, cubos | **T10 BIA** | MED publica indicadores con fórmula, universo y fecha de corte. |
| Migración desde ProCoop | **T07 MIG** | MED define el mapeo de sus tablas (sección 19). |

### 2.3 Principios del límite

- Un **equipo no es un contrato**: el medidor se instala temporalmente en un punto de medición; el contrato (servicio del socio) es de M01 (BASE §7).
- Una **lectura no es un consumo liquidable**: la validación definitiva corresponde al control de consumos, no al dispositivo (BASE §8).
- Una **alerta no es un fraude**: MED detecta, M10 inspecciona y el régimen del servicio decide (BASE §9, MER-004).
- Un **reemplazo de medidor no aprueba automáticamente** el consumo derivado (BASE §7).
- **kWh no es kW**: energía y demanda son magnitudes distintas en canales distintos (BASE §87).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Medidor | Instrumento físico de medición, identificado por número y marca, con ficha metrológica propia. | `dict:med.meter` | Medidor (`NUM_MED`, `DISPOSI`) |
| Tipo de medidor | Modelo/clase con sus registros, dígitos, si es prepago, telemedido y su sistema. | `dict:med.meterType` | `TIPMED`, `ESPE_MED` |
| Marca | Fabricante del medidor, por servicio. | `dict:med.meterBrand` | `MARMED` |
| Registro | Magnitud que el medidor acumula o indica (ej. activa T1, reactiva, demanda máxima). | `dict:med.register` | Registro de telemedición (`COD_LEC`) |
| Punto de medición | Lugar lógico donde se mide un servicio contratado; puede cambiar de medidor sin cambiar de punto. | `dict:med.meteringPoint` | Servicio con medidor (`SERSOC`) |
| Canal de medición | Magnitud que se liquida en un punto: energía activa entregada, recibida, reactiva, demanda en punta, etc. | `dict:med.channel` | Medición (`MEDSOC`, `TIP_ENE`: A, R, DP, DFP, DV) |
| Instalación | Período durante el cual un medidor estuvo colocado en un punto, con lecturas inicial y final. | `dict:med.installation` | Colocación/retiro (`HIS_MEDSOC`) |
| Factor multiplicador (constante) | Multiplicador del medidor (TI/TV, constante); el consumo es diferencia × factor. | `dict:med.multiplier` | `FAC_MED` |
| Dígitos | Cantidad de dígitos enteros del totalizador; determina la vuelta. | `dict:med.digits` | `DIG_MED` |
| Medidor indicado | El medidor muestra el consumo del período, no un acumulado. | `dict:med.indicated` | `INDICADO` |
| Lectura con factor | El estado leído ya viene multiplicado. | `dict:med.readingWithFactor` | `LECTURA_CON_FACTOR` |
| Vuelta de medidor | Paso del totalizador por su máximo y reinicio en cero. | `dict:med.rollover` | Vuelta (`GetMaxConsumo`) |
| Precinto | Sello numerado que garantiza la inviolabilidad del medidor. | `dict:med.seal` | (sin tabla; observaciones) |
| Ensayo | Contraste o verificación metrológica del medidor con resultado. | `dict:med.meterTest` | (sin tabla) |
| Ruta de lectura | Definición de qué puntos se leen juntos y en qué orden. | `dict:med.route` | Ruta (`CONNRUTA`, `CONNZONA`) |
| Zona / sector / recorrido de lectura | Ubicación del punto en la logística de lectura. | `dict:med.readingZone` / `dict:med.readingSector` / `dict:med.readingSequence` | Zona, Sector, Recorrido (ZSR) |
| Cronograma de lectura | Calendario con la fecha prevista de lectura de cada ruta por período. | `dict:med.readingCalendar` | (no existe) |
| Lote de lectura | Ejecución de una ruta para un período: el conjunto de tareas generadas, enviadas, recibidas y confirmadas. | `dict:med.readingBatch` | Ruta generada (`IMP_WORK`) |
| Tarea de lectura | Lo que el lecturista debe leer en un punto/canal, con la lectura anterior y el rango esperado. | `dict:med.readingTask` | Registro de `IMP_WORK` |
| Lecturista | Operador de campo que toma lecturas. | `dict:med.reader` | Lector |
| Lectura capturada | Estado registrado por cualquier medio, todavía no validado. | `dict:med.capturedReading` | Lectura importada (`IMP_WORK` en I) |
| Lectura validada | Lectura aceptada como base de cálculo. | `dict:med.validatedReading` | Lectura confirmada (`CONS_SER`) |
| Consumo | Cantidad calculada para un canal y un intervalo. | `dict:med.consumption` | Consumo (`CONS_SER.CONSUMO`) |
| Consumo aprobado | Consumo habilitado para liquidar. | `dict:med.approvedConsumption` | (implícito: `CONS_SER` no facturado) |
| Consumo estimado | Consumo sin lectura real, con método y base declarados. | `dict:med.estimatedConsumption` | `ESTIMADO = 1` |
| Regularización de estimados | Ajuste cuando llega una lectura real después de estimaciones. | `dict:med.estimateSettlement` | Bonificación de estimados (`CONS_BONIF`) |
| Rango esperado | Intervalo plausible de lectura o consumo para advertir y validar. | `dict:med.expectedRange` | Umbrales `UMB_MIN`/`UMB_MAX` (`LECMIN`/`LECMAX`) |
| Excepción de consumo | Alerta sobre un consumo que requiere evaluación. | `dict:med.consumptionException` | Control de consumo fuera de rango (`CTRLCNC`) |
| Observación de lectura | Novedad codificada en campo (medidor roto, inaccesible, perro, etc.). | `dict:med.readingObservation` | `OBSESTAD` |
| Resultado de lectura | Resultado codificado de la visita (leído, no leído, confirma). | `dict:med.readingResult` | `RESESTAD` |
| Consumo adicional | Lectura extra registrada para cargar un consumo adicional al período. | `dict:med.additionalConsumption` | "Consumo Adicional" |
| División de consumo | Partición de una lectura que abarca más de un período. | `dict:med.consumptionSplit` | `GRUPO`, `SEG_TOT` |
| Distribución de consumo | Reparto del consumo de un punto padre entre puntos hijos. | `dict:med.consumptionDistribution` | `DST_CONSUMO` |
| Medidor testigo | Medidor de referencia cuyo consumo se usa para elegir tramo o para servicios sin medición propia. | `dict:med.witnessMeter` | `MED_TESTIGO`, `CONS_SER_TESTIGO` |
| Demanda contratada | Potencia comprometida por período. | `dict:med.contractedDemand` | `CON_BASE`, `SERSOC_DEMANDASXPERIODO` |
| Demanda declarada | Demanda vigente tras una transgresión. | `dict:med.declaredDemand` | `DEC_CON` |
| Transgresión | Demanda registrada mayor que la contratada. | `dict:med.demandTransgression` | Transgresión (`PRIMER_TRANSGRESION`) |
| Factor de corrección de gas | Presión, temperatura, factor calórico y coeficiente que convierten volumen leído en cantidad facturable. | `dict:med.gasCorrectionFactor` | `FACTOR_CAL`, `COEF_CORRECTOR` |
| Usuario-generador | Socio que genera energía renovable e inyecta excedentes (Ley 27.424). | `dict:med.prosumer` | (consumo negativo, factor negativo) |
| Energía inyectada | Energía entregada por el usuario-generador a la red. | `dict:med.injectedEnergy` | Inyectada (`GetTotalConsumoInyectada`) |
| Medición propia | Medición de la energía que compra la cooperativa o de puntos internos. | `dict:med.ownMetering` | `MEDIDORP`, `CONSUMOP` |
| Sistema de telemedición | Plataforma AMI/MDM o prepago de un fabricante configurada por tenant. | `dict:med.meteringSystem` | `TELEMEDICION`, `SIS_TEL` |
| Toma de estado | Lectura remota de registros de un medidor. | `dict:med.remoteReading` | `TomaEstado` |
| Operación remota | Comando al medidor: alta, asignación, retiro, cambio de categoría, corte, reconexión. | `dict:med.remoteOperation` | `TELEMED_COMM` |
| Cuenta prepaga | Estado técnico de un medidor prepago: proveedor, saldo informado, cargas. | `dict:med.prepaidAccount` | Categoría prepaga (`CATE_SER.PREPAGA`) |
| Recarga / token | Crédito cargado o código entregado al socio para el medidor prepago. | `dict:med.prepaidTopUp` | `CargaCreditoPrepago`, token |
| Autolectura | Lectura informada por el socio desde la app con foto. | `dict:med.selfReading` | (no existe; "Mi Medidor" de Mr. Dims, V2 PMovil 55) |
| Curva de carga | Serie de lecturas por intervalo (15/30/60 min). | `dict:med.loadProfile` | (no existe) |

## 4. Actores, permisos y alcance

| Rol (perfil sugerido) | Capabilities | Alcance de datos |
|---|---|---|
| Administrador de medición | `med.catalogos.ver`, `med.catalogos.configurar`, `med.parametros.configurar`, `med.perfilesImportacion.configurar`, `med.telemedicion.configurar`, `med.rutas.configurar`, `med.gas.configurar` | Tenant / servicios |
| Encargado técnico de medidores | `med.medidores.ver`, `med.medidores.crear`, `med.medidores.editar`, `med.medidores.anular`, `med.instalaciones.crear`, `med.instalaciones.anular`, `med.precintos.crear`, `med.ensayos.crear`, `med.puntos.ver`, `med.puntos.editar` | Servicios / zonas |
| Supervisor de lecturas | `med.rutas.ver`, `med.rutas.crear`, `med.rutas.editar`, `med.cronograma.ver`, `med.cronograma.editar`, `med.lotes.ver`, `med.lotes.crear`, `med.lotes.asignar`, `med.lotes.exportar`, `med.lotes.confirmar`, `med.lotes.cerrar`, `med.lotes.reabrir`, `med.lotes.cancelar`, `med.conflictos.resolver`, `med.lecturistas.ver` | Servicios / zonas / cuadrillas |
| Lecturista (pwa-campo) | `med.campo.leer`, `med.campo.sincronizar`, `med.campo.observar` | Propios (tareas asignadas) |
| Operador de lecturas (oficina) | `med.lecturas.ver`, `med.lecturas.crear`, `med.lecturas.corregir`, `med.lecturas.importar`, `med.lotes.ver` | Servicios / zonas |
| Analista de consumos | `med.consumos.ver`, `med.consumos.estimar`, `med.consumos.dividir`, `med.consumos.distribuir`, `med.excepciones.ver`, `med.excepciones.resolver`, `med.testigos.ver` | Servicios / zonas |
| Supervisor de consumos | Todo lo del analista + `med.consumos.aprobar`, `med.consumos.bloquear`, `med.consumos.anular`, `med.ajustes.crear`, `med.ajustes.aprobar`, `med.demanda.editar`, `med.demanda.resetear`, `med.lecturas.anular` | Servicios |
| Operador de telemedición | `med.telemedicion.ver`, `med.telemedicion.tomarEstado`, `med.telemedicion.operar`, `med.telemedicion.reintentar` | Servicios |
| Ejecutor de comandos de corte/reconexión (solo sistema o rol técnico autorizado) | `med.telemedicion.comandoCorte`, `med.telemedicion.comandoReconexion` | Servicios (solo con orden de M08/M10 vigente) |
| Operador prepago | `med.prepago.ver`, `med.prepago.reintentar`, `med.prepago.anular` (la venta usa `cob.*` de M07) | Servicios / sucursales |
| Responsable de generación distribuida | `med.gd.ver`, `med.gd.crear`, `med.gd.editar`, `med.gd.aprobar` | Servicios |
| Responsable de compra de energía | `med.medicionPropia.ver`, `med.medicionPropia.crear`, `med.perdidas.ver` | Tenant |
| Consulta / auditor | `med.*.ver`, `med.informes.ver`, `med.informes.exportar` | Tenant (solo lectura) |
| Socio (pwa-socio) | `med.misConsumos.ver`, `med.autolectura.crear`, `med.miPrepago.ver` | Propios (servicios autorizados de sus cuentas) |
| Sistema (jobs, conectores) | Identidad técnica por tenant con capabilities de job (`med.jobs.ejecutar`) | Tenant |
| Soporte de plataforma | Lectura con acceso temporal concedido (T01/T02) | Tenant asignado, temporal y auditado |

Reglas de permisos: la capability no basta; se aplica el alcance (zona, servicio, cuadrilla). Un lecturista solo ve y sincroniza tareas de lotes asignados a él. Los comandos de corte/reconexión no se pueden invocar manualmente sin una orden vigente de M08/M10 (RN-MED-104). La aprobación de un ajuste o reset de demanda no puede hacerla quien lo creó cuando el workflow (T11) exige doble control.

## 5. Requisitos funcionales

### 5.1 Catálogos y medidores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-001 | Administrar marcas de medidor por servicio. | CAT `MARMED`; DFA M5 | Estándar | O7 | Adoptado | Alta, edición y baja lógica; una marca en uso no se elimina. |
| RF-MED-002 | Administrar tipos/modelos de medidor con servicio, marca, fase (monofásico/trifásico), multitarifa, registros, dígitos por defecto, prepago, telemedido, sistema de telemedición, disponible, "no indicado" y redondeo de prepaga. | CAT `TIPMED`, `ESPE_MED`, `DISPOSI`; DFA M5 | Núcleo | O7 | Adoptado | No se puede instalar un medidor cuyo tipo no corresponda al servicio del punto. |
| RF-MED-003 | Registrar la ficha del medidor: número, matrícula/serie de fábrica, marca, modelo, tipo, año, clase de exactitud, dígitos, factor multiplicador, HP (cantidad de hilos/fases), indicado, lectura con factor, unidades bonificadas, testigo, observaciones, telemedido con identificador remoto, prepago, propiedad (propio de la cooperativa, del socio, comunitario) e ítem serializado de stock. | BASE §7; DFA M5; RN-06 §12.1; CAT `DISPOSI` | Núcleo | O7 | Adoptado | Todo medidor tiene número, tipo, dígitos > 0 y factor ≠ 0; el número es único por tenant, servicio y marca. |
| RF-MED-004 | Definir los registros del medidor (código, magnitud, unidad, dígitos y factor propios, indicado) para medidores multirregistro y multitarifa. | RN-06 §12.2, §19.2 (T0..T6); MER-003 | Núcleo | O7 | Adoptado | Un medidor de grandes usuarios puede tener registros de activa por franja, reactiva y demanda máxima por banda. |
| RF-MED-005 | Consultar la trayectoria completa del medidor: instalaciones, retiros, lecturas de colocación/retiro, ensayos, precintos, reparaciones (desde M13), fotografías y certificados. | BASE §7 | Núcleo | O7 | Adoptado | La trayectoria muestra cada punto donde estuvo con fechas efectivas y de registro. |
| RF-MED-006 | Adjuntar fotografías y certificados al medidor, a la instalación y a los ensayos mediante el expediente documental. | BASE §7; AGR-023 (vía T11) | Estándar | O7 | Adoptado | Los adjuntos se ven con URL firmada y quedan versionados. |
| RF-MED-007 | Registrar ensayos/contrastes del medidor con fecha, laboratorio o responsable, resultado (aprobado, rechazado, con observaciones), error medido y certificado. | BASE §7 | Estándar | O7 | Adoptado | Un medidor con último ensayo rechazado no puede instalarse (RN-MED-021). |
| RF-MED-008 | Registrar precintos (número, tipo, color, posición) colocados, retirados o violados, vinculados a la instalación y a la OT que los registró. | BASE §7 | Estándar | O7 | Adoptado | Un número de precinto no puede estar colocado en dos medidores a la vez. |
| RF-MED-009 | Registrar observaciones de medidor codificadas (catálogo) con fecha y autor. | CAT `OBSMED`; DFA M5 | Estándar | O7 | Adoptado | Las observaciones quedan en la ficha y en el historial. |
| RF-MED-010 | Importar medidores en forma masiva por planilla (rango de números de serie o lista) validando duplicados y existencia del ítem serializado en M13. | RN-06 §23.5 (`Cargar_GrillaDispositivos`); CNX ExcelImportWizard | Estándar | O7 | Adoptado | Las filas duplicadas o inexistentes en stock se rechazan con motivo en el preview. |
| RF-MED-011 | Mostrar en la ficha del medidor su estado de activo (disponible, instalado, retirado, en reparación, descartado) sincronizado con M13 y su estado de medición. | BASE §7 | Núcleo | O7 | Adoptado | Un medidor "en reparación" o "descartado" en M13 no aparece como seleccionable para instalar. |

### 5.2 Puntos de medición, canales e instalaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-012 | Crear el punto de medición al habilitar un servicio contratado medido (M01/M02), con tipo de punto (cliente, testigo, compra/frontera, interno, padre de distribución), ubicación geográfica, datos de acceso y zona/sector/recorrido de lectura. | BASE §7, §87, §88; DFA M6 (ZSR) | Núcleo | O7 | Adoptado | Un servicio de categoría medida no puede pasar a "conectado" sin punto con medidor instalado, salvo configuración de régimen no medido (BASE §88). Los puntos de compra/frontera exponen el volumen comprado a M12 (RF-MED-129; HUE-ELE-01, HUE-GAS-04); el alta por cambio de régimen llega por EVT-CAT-28 (RF-MED-128). Gas: se crea punto para gas natural y propano por red; el gas envasado no tiene punto ni medidor (DEC-030, DEC-082). |
| RF-MED-013 | Definir los canales del punto (energía activa entregada, activa recibida, reactiva entregada/recibida, demanda en punta, fuera de punta, en valle, energía por franja pico/resto/valle, volumen de agua, volumen de gas, generación) con unidad, concepto facturable asociado (M04), banda horaria y valor contratado. | RN-06 §12.2, §21.10; MER-001, MER-003; BASE §87 | Núcleo | O7 | Adoptado | kWh y kW nunca comparten canal; cada canal tiene unidad obligatoria. |
| RF-MED-014 | Proponer automáticamente los canales del punto según los conceptos de la categoría tarifaria vigente (grandes usuarios) y pedir confirmación. | RN-06 §12.2 (`ActualizarMedSoc`), §23.6 | Estándar | O7 | Adoptado | Al cambiar la categoría a una de grandes usuarios se proponen los canales faltantes; no se borran canales con lecturas. |
| RF-MED-015 | Ordenar los canales de un punto por concepto facturable para su visualización y carga. | V2 2520 | Estándar | O7 | Adoptado | Orden configurable; por defecto, el orden del concepto en M04. |
| RF-MED-016 | Registrar la instalación de un medidor en un punto con fecha y hora efectivas, lecturas iniciales por registro, factor vigente, mapeo registro → canal, motivo y OT de origen. | BASE §7; RN-06 §12.3 | Núcleo | O7 | Adoptado | La instalación queda activa y el estado del activo pasa a "instalado" vía evento a M13. |
| RF-MED-017 | Registrar el retiro de un medidor con fecha efectiva, lecturas finales por registro, motivo (cambio, desconexión con retiro, baja, robo, rotura) y OT de origen. | BASE §7; RN-06 §12.3 | Núcleo | O7 | Adoptado | El retiro genera las lecturas finales como lecturas validables y cierra la instalación sin borrarla. |
| RF-MED-018 | Ejecutar el cambio de medidor como una operación atómica (retiro + instalación) con continuidad de consumo en el período, aplicando opcionalmente la categoría nueva informada por la OT. | BASE §7 (CU-07); RN-06 §12.3, §23.1; DFA M5 mejora | Núcleo | O7 | Adoptado | El consumo del período suma ambos tramos (RN-MED-090) y no se superponen instalaciones. |
| RF-MED-019 | Impedir instalaciones incompatibles o simultáneas: mismo medidor en dos puntos, dos medidores principales en el mismo canal y fecha, tipo de medidor de otro servicio, medidor no bidireccional en punto con generación distribuida, medidor no prepago en categoría prepaga. | BASE §7; RN-06 §12.3, §23.1 (`ValidarMedidor`) | Núcleo | O7 | Adoptado | Cada caso se rechaza con un error RFC 9457 con código propio. |
| RF-MED-020 | Recibir del cierre de OT (M10) las lecturas de retiro/colocación, precintos, fotos y el medidor nuevo, de manera idempotente y asíncrona. | RN-06 §12.3; AGR-016 | Núcleo | O7 | Adoptado | Reenviar el mismo cierre no duplica instalaciones ni lecturas. |
| RF-MED-021 | Anular una instalación o retiro cargado por error con reversión de sus lecturas y consumos no facturados, y con motivo. | V2 2658; BASE §8 | Estándar | O7 | Adoptado | No se puede anular si alguno de sus consumos está facturado; en ese caso se exige ajuste. |
| RF-MED-022 | Registrar el retiro por desconexión sin borrar el número del medidor ni su historia. | RN-06 §12.3; V2 2399 | Núcleo | O7 | Adoptado (Reemplaza V2 2399) | El punto queda sin medidor activo y la ficha conserva la instalación cerrada. |
| RF-MED-023 | Consultar el punto de medición: canales, medidor vigente, historial de instalaciones, ruta, último estado y fecha por canal, último consumo, testigo, GD, prepago y telemetría. | DFA M6 (datos del servicio); REL §3 | Núcleo | O7 | Adoptado | Todos los "últimos valores" se derivan de lecturas validadas, no se editan a mano. |
| RF-MED-024 | Registrar la propiedad del medidor (cooperativa, socio, comunitario) y su efecto en cargos (M04) e inventario (M13). | RN-06 §12.1 (`COD_PROP`) | Estándar | O7 | Adoptado | La propiedad viaja en el contrato de datos a M04. |
| RF-MED-128 | Reaccionar al cambio de régimen de medición del contrato (`cat.contract.meteringRegimeChanged`, EVT-CAT-28 de M02): a `metered` crea el punto de medición (RF-MED-012) y pide la instalación del medidor con fecha efectiva; a `unmetered` registra el retiro con lectura final a la fecha efectiva (RF-MED-022) sin borrar el punto ni su historia. Idempotente por `commandId`. | HUE-AG-03; RF-CAT-114, RN-CAT-078 | Estándar | O7 | Adoptado | Un contrato AG que pasa a `metered` el 01/12/2026 tiene punto creado y orden de instalación; hasta que haya medidor instalado y primera lectura válida no se generan consumos medidos (M02 sigue con cuota fija). Pasar a `unmetered` deja el punto sin medidor activo con lectura final; el mismo evento reenviado no duplica punto ni retiro. |
| RF-MED-129 | Exponer el volumen comprado por período de los puntos de compra/frontera (RF-MED-012; `meteringPoints.pointType` = `purchase` o `boundary`; RF-MED-100) por servicio (energía, gas), proveedor mayorista, punto y registro (pico, resto, valle, reactiva, demanda; m³ medidos para gas, sin corregir — ~~m³ corregidos~~, DEC-085), con origen (lectura, telemedición, dato del proveedor) y estado de validación, para que M12 controle la factura del mayorista (EPEC, distribuidora de gas) y para el balance comprado vs. facturado (RF-MED-101) (API-MED-78). | HUE-ELE-01; HUE-GAS-04; BASE §87; RN-06 §23.7 | Estándar | O8 | Adoptado | Para el período 11/2026 la API devuelve, por punto de frontera, kWh por franja y kW de demanda iguales a los del informe de pérdidas; los volúmenes no validados se marcan como tales y no se ocultan. |

### 5.3 Rutas, cronogramas y lotes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-025 | Administrar rutas de lectura con uno o más servicios, criterio de selección (por zona/sector/recorrido, por calle y rangos de numeración con pares/impares, por rango de cuentas, por polígono en mapa), zonas, categorías opcionales, inclusión de desconectados no retirados y filtro de telemedidos (solo, excluidos, todos). | RN-06 §13.1; CAT `CONNRUTA`, `CONNZONA`; DFA M6 | Núcleo | O7 | Adoptado | La vista previa de la ruta muestra cuántos puntos entran y por qué criterio. |
| RF-MED-026 | Definir el orden de recorrido: predeterminado, por titular, por calle y número, por zona y recorrido, por última toma del lecturista, o manual en mapa. | RN-06 §13.1, V2 2098, V2 2590 | Estándar | O7 | Adoptado | El orden se aplica a la descarga y a la impresión. |
| RF-MED-027 | Renumerar el recorrido de lectura según el orden real de la última toma (por zona y sector, de 5 en 5, desde 0), como propuesta aprobable. | RN-06 §23.7 (`ActualizarRecorrido`) | Estándar | O7 | Adoptado | La renumeración no se aplica sin confirmación y queda auditada. |
| RF-MED-028 | Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. | MER-018; AGR-017 | Estándar | O7 | Adoptado | El job crea los lotes en la fecha configurada y avisa si falta asignación. |
| RF-MED-029 | Generar un lote de lectura de una ruta para un período: una tarea por punto y canal leíble con la lectura anterior validada, fecha anterior, consumo anterior, rango esperado, datos de ubicación y datos opcionales configurables. | RN-06 §13.2 paso 1 | Núcleo | O7 | Adoptado | La generación es idempotente por ruta y período; regenerar solo agrega puntos nuevos. |
| RF-MED-030 | Bloquear que un punto esté en dos lotes abiertos del mismo período e informar el lote donde está. | RN-06 §13.2 paso 2 | Núcleo | O7 | Adoptado | El intento de agregarlo se rechaza con el código del lote existente. |
| RF-MED-031 | Marcar la tarea como "lectura real prioritaria" cuando el último consumo fue estimado. | V2 2559 | Estándar | O7 | Adoptado | El lecturista ve la marca y no puede cerrar la tarea con "estimar" sin observación. |
| RF-MED-032 | Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. | BASE §8; CNX §7.8 | Núcleo | O7 | Adoptado | Una tarea solo tiene un asignado vigente; la reasignación queda en el historial. |
| RF-MED-033 | Descargar el lote al dispositivo del lecturista (PWA) con versión de cada tarea, o exportarlo a archivo para colectoras de terceros (CSV/Excel, uno por ruta o todos juntos). | RN-06 §13.3; V2 2334; FIC 10.1 | Núcleo | O7 | Adoptado | La descarga registra versión y momento; la exportación incluye solo los campos habilitados. |
| RF-MED-034 | Supervisar el avance del lote en tiempo casi real: tareas pendientes, leídas, con observación, fuera de rango, con foto, sincronizadas, en conflicto, por lecturista, en lista y en mapa. | BASE §8; DFA M6 | Núcleo | O7 | Adoptado | El tablero se actualiza tras cada sincronización. |
| RF-MED-035 | Revisar el lote con filtros: consumo mayor/menor que un valor, con observación, con foto, por lecturista, por fechas, solo fuera de rango, solo estimadas, solo con error. | RN-06 §13.2 paso 5 | Núcleo | O7 | Adoptado | Los filtros combinan con AND y se pueden guardar como vista. |
| RF-MED-036 | Confirmar el lote: convertir las lecturas capturadas válidas en lecturas validadas y consumos calculados, con las verificaciones de continuidad del RN-MED-034, dejando con error las rechazadas. | RN-06 §13.2 paso 6 | Núcleo | O7 | Adoptado | La confirmación es idempotente y reanudable; un registro rechazado informa su causa. |
| RF-MED-037 | Cerrar el lote cuando no queden tareas pendientes o cuando el supervisor acepte los pendientes como "no leídos" con motivo, generando estimación o relectura según política. | BASE §8 | Núcleo | O7 | Adoptado | El acta de cierre informa totales leídos, estimados, no leídos y excepciones. |
| RF-MED-038 | Reabrir un lote cerrado mientras ninguno de sus consumos esté facturado, con motivo y auditoría. | BASE §8; AGR-015 | Estándar | O7 | Adoptado | Si hay consumos facturados, la reapertura solo afecta a los no facturados. |
| RF-MED-039 | Cancelar un lote sin lecturas procesadas; impedir la cancelación si tiene lecturas sin procesar salvo confirmación expresa del supervisor. | RN-06 §13.3 (`ValidarBorrarRuta`); V2 2345 | Estándar | O7 | Adoptado | La cancelación no borra datos: deja el lote en "cancelado". |
| RF-MED-040 | Conservar el historial de lotes y tareas (lo que hoy es `HISWORK`) para consulta y para ordenar futuras rutas. | RN-06 §13.2 paso 7 | Estándar | O7 | Adoptado | Ninguna tarea confirmada se borra; se archiva. |
| RF-MED-041 | Imprimir la planilla de ruta (orden de recorrido) para lectura en papel y cargar luego por PAN-MED-09. | DFA M6; V2 2590 | Estándar | O7 | Adoptado | PDF con datos habilitados y espacio para estado y observación. |
| RF-MED-042 | Registrar horas de trabajo y productividad del lecturista derivadas de la app (inicio/fin de jornada, tareas por hora, distancia) y permitir carga manual. | DFA M6 (`SU_HORAS_LECTOR`) | Estándar | O7 | Adoptado | El informe de productividad suma tareas y horas por lecturista y período. |

### 5.4 Captura de lecturas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-043 | App de lecturas offline (pwa-campo): ver tareas en orden, verificar suministro y medidor, capturar estado por registro, observación codificada, resultado, foto(s), GPS y hora; guardar localmente sin conexión. | BASE §8 (CU-08); DFA M6 mejora; FIC 10.1; CNX §3.7 | Núcleo | O7 | Adoptado | Sin red se puede completar una ruta entera y sincronizar después sin pérdidas. |
| RF-MED-044 | Advertir en el dispositivo antes de guardar: estado fuera del rango esperado, menor que el anterior, más dígitos que el medidor, consumo cero en servicio conectado; pedir reingreso del valor en los casos fuera de rango. | BASE §8; RN-06 §13.2 paso 5, §13.3 (`LECMIN`/`LECMAX`) | Núcleo | O7 | Adoptado | La advertencia no bloquea el guardado; el reingreso debe coincidir. |
| RF-MED-045 | Exigir foto cuando el consumo está fuera de rango, cuando la observación lo requiere o cuando el parámetro lo exige para todo el servicio. | DFA M6 mejora; CAT `OBSESTAD.FOTO` | Núcleo | O7 | Adoptado | No se puede cerrar la tarea sin la foto exigida. |
| RF-MED-046 | Registrar el motivo de no lectura (inaccesible, medidor roto, perro, sin acceso, domicilio cerrado, medidor no encontrado, otros del catálogo) sin introducir cero. | BASE §8 (CU-08) | Núcleo | O7 | Adoptado | Una tarea "no leída" nunca genera un consumo 0 real. |
| RF-MED-047 | Sincronizar con `clientMutationId` por lectura y por foto; confirmar recepción por ítem; reintentar automáticamente; nunca duplicar capturas. | BASE §8; CNX §3.7; AGR-016 | Núcleo | O7 | Adoptado | Enviar dos veces la misma mutación produce un único registro. |
| RF-MED-048 | Detectar y resolver conflictos entre dispositivo y servidor: tarea reasignada, lote cancelado, medidor cambiado, lectura anterior modificada, lectura ya cargada por otro medio. Conservar ambas evidencias y asignar responsable de resolución. | BASE §8; AGR-025 | Núcleo | O7 | Adoptado | Ningún conflicto sobrescribe silenciosamente; queda en PAN-MED-34. |
| RF-MED-049 | Permitir al lecturista crear novedades que generen OT (medidor roto, conexión directa, pérdida) cuando el parámetro lo habilita. | V2 PMovil 2, 30; RN-06 §13.2 paso 6 | Estándar | O7 | Adoptado | La novedad viaja como evento a M10 con foto y GPS. |
| RF-MED-050 | Permitir al lecturista corregir su propia captura antes de sincronizar y, después, solo como nueva versión con motivo. | BASE §8 | Núcleo | O7 | Adoptado | La versión anterior queda visible para el supervisor. |
| RF-MED-051 | Registro manual de lecturas en oficina por cuenta o por servicio: encabezado (fecha, período, servicio, titular, cuenta, observación, marca de consumo estimado), grilla por canal (fecha anterior, lectura anterior, consumo anterior, lectura actual, consumo actual, tipo de energía, concepto), datos del servicio (categoría, característica, medidor, dígitos, domicilio, factor, cos φ, indicado) e historial; botón "Correcto" que confirma. | REL §3; DFA M6; INV `frmRegistroLecturas` | Núcleo | O7 | Adoptado | La carga manual aplica las mismas validaciones del RN-MED-047 a 052 y genera lectura con origen "manual". |
| RF-MED-052 | Registrar un consumo adicional (lectura extra estimada con descripción "Consumo adicional") con motivo y autorización. | RN-06 §13.3; INV `frmConsultaConsumoMedido.Agregar_ConsumoAdicional` | Estándar | O7 | Adoptado | El consumo adicional se distingue del regular en la factura (M04) y requiere aprobación. |
| RF-MED-053 | Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o por cuenta, mapeo de conceptos por nombre, servicio por defecto). | RN-06 §13.3 (archivos de terceros); FIC 10.1; RN-06 §21.6 | Núcleo | O7 | Adoptado | Un perfil nuevo se crea sin desarrollo; el preview muestra errores por fila. |
| RF-MED-054 | Proveer perfiles precargados equivalentes a los formatos de ProCoop: Aguas Cordobesas, CEMDO, Ordóñez, Oncativo, Brinkmann, Oliva, San José, 15 de Mayo, Caucete, Temetra, Nexus, Thinking, Bovetech, Hexing, Rainbow, Huinca, Trelew, Excel genérico, texto genérico y DBF genérico. | RN-06 §13.3 | Estándar | O7 | A validar (PA-MED-12) | Cada perfil precargado se prueba con un archivo de ejemplo ficticio. |
| RF-MED-055 | Importar consumos directos (sin lectura ni ruta) desde archivos de terceros (ej. cloacas ARR, Nexus Electric) con aprobación previa. | RN-06 §13.3 (importación directa) | Estándar | O7 | Adoptado | Los consumos importados quedan con origen "importación directa" y pasan por validación. |
| RF-MED-056 | Recibir lecturas de colectoras portátiles conectadas a PC (PSION/Android por cable) por archivo exportado del dispositivo. | RN-06 §13.3 (captor USB); FIC 10.1 | Extensión | O7 | A validar (PA-MED-11) | El archivo del captor se importa por un perfil; no hay conexión USB directa desde el navegador. |
| RF-MED-057 | Autolectura del socio desde la app con foto del visor, dentro de una ventana de días configurada por ruta/período, sujeta a validación como cualquier lectura. | MER-018; BASE §8 | Estándar | O7 | A validar (PA-MED-06) | Una autolectura sin foto o fuera de ventana se rechaza; dentro de rango puede resolver la tarea de ruta según política. |
| RF-MED-058 | Avisar al socio la ventana de autolectura y el resultado (aceptada, en revisión, rechazada con motivo). | MER-018; T09 | Estándar | O7 | Adoptado | La notificación se emite por evento y respeta preferencias del socio. |
| RF-MED-059 | Adjuntar automáticamente las fotos de la lectura al consumo resultante, con metadatos (cuenta, medidor, concepto, fecha-hora, GPS). | V2 2595, V2 2332; RN-10 §16.2 | Núcleo | O7 | Adoptado | Desde el consumo se ven sus fotos sin buscar en otra pantalla. |
| RF-MED-060 | Registrar lecturas de OT (retiro, colocación, verificación, inspección) con origen y OT vinculada. | RN-06 §12.3 (`Guardar_CONS_SER` desde OT) | Núcleo | O7 | Adoptado | La lectura de OT se valida igual y queda vinculada a la OT. |

### 5.5 Cálculo, validación y aprobación de consumos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-061 | Calcular el consumo de cada canal entre dos lecturas validadas consecutivas del mismo medidor y registro, aplicando factor, indicado, lectura con factor y vuelta confirmada. | BASE §9 (CU-09); RN-06 §14.1 | Núcleo | O7 | Adoptado | Lectura anterior 1.250 m³ y actual 1.270 m³ con factor 1 dan 20 m³ trazables a ambas lecturas. |
| RF-MED-062 | Detectar la lectura menor que la anterior y exigir su clasificación explícita: vuelta de medidor, error de captura o cambio de medidor no registrado. | BASE §9; RN-06 §14.1, §21.7, Duda 3 | Núcleo | O7 | Adoptado | Ninguna vuelta se aplica sin confirmación de un usuario con `med.consumos.aprobar`. |
| RF-MED-063 | Corregir el volumen de gas medido a cantidad facturable con presión, temperatura, factor calórico por período y categoría, coeficiente corrector del servicio y factor calórico óptimo; guardar volumen neto, factores usados y cantidad resultante; permitir recorrer desde el neto. **Reemplazado por RN-TAR-035 (DEC-085):** la corrección la aplica M04 al calcular; M03 entrega el volumen medido validado (neto, sin corregir) y el coeficiente corrector del punto en el contrato de datos (§13.3) y no calcula la cantidad corregida. | BASE §89; RN-06 §16.2; RN-01 §4.4; DEC-085 | Núcleo | O7 | Reemplazado (DEC-085) | ~~Sin factor para el período se bloquea el consumo con excepción "falta factor de gas".~~ Sin factor para el período, M04 excluye la cuenta con `TAR-E-GAS-FACTOR`; el consumo de M03 queda aprobado con su volumen medido. |
| RF-MED-064 | Validar cada consumo calculado contra reglas configurables: cero en servicio conectado, negativo sin canal de inyección, fuera del rango esperado (promedio móvil, estacionalidad, % por categoría), variación porcentual contra el período anterior, desvío de días de lectura, lectura repetida, salto de dígitos, consumo en servicio desconectado, demanda mayor que la contratada, inyección sin contrato GD, estimaciones consecutivas. | BASE §9; RN-06 §14.3, §21.7, §23.7; DFA M6 mejora | Núcleo | O7 | Adoptado | Cada regla tiene severidad (informativa, revisión, bloqueante) configurable por servicio y categoría. |
| RF-MED-065 | Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar, derivar a inspección (M10), bloquear, desbloquear. | BASE §9; DFA M6 mejora; CAT `CTRLCNC` | Núcleo | O7 | Adoptado | Ninguna excepción bloqueante queda sin decisión al cerrar el período; las justificaciones son codificadas (vivienda desocupada, pérdida, estacional, cambio de uso, otra). |
| RF-MED-066 | Aprobar consumos en forma individual y masiva; aprobar automáticamente los que no tienen excepciones si el parámetro lo permite. | BASE §9 (CU-09) | Núcleo | O7 | Adoptado | Los consumos aprobados quedan disponibles para M04/M05 con su origen. |
| RF-MED-067 | Bloquear la liquidación de un servicio con inconsistencias relevantes y informarlo al lote de facturación como "observado" con causa. | BASE §9; BASE §69 (excepciones de lote) vía M05 | Núcleo | O7 | Adoptado | M05 recibe la causa y el lote lo muestra; el resto se factura. |
| RF-MED-068 | Mostrar el origen de cada cantidad liquidada: lecturas usadas (con foto y lecturista), estimación (método y base), división, distribución, ajuste, corrección de gas. | BASE §9 | Núcleo | O7 | Adoptado | Desde un ítem de factura se navega hasta las lecturas o la estimación que lo originaron. |
| RF-MED-069 | Corregir una lectura o consumo no facturado creando una versión nueva con motivo; la versión anterior queda consultable. | BASE §8 (regla de diseño); INV `abm_Cons_Ser` | Núcleo | O7 | Adoptado | No existe borrado físico de lecturas; la corrección recalcula consumos dependientes. |
| RF-MED-070 | Impedir modificar o anular un consumo facturado; exigir ajuste (RF-MED-079) que M05 convierte en NC/ND. | RN-06 §23.7 (`ConsumoFacturado`); AGR-010 | Núcleo | O7 | Adoptado | El intento devuelve error con el comprobante que lo contiene. |
| RF-MED-071 | Actualizar la categoría asociada a un consumo no facturado cuando la categoría del servicio cambió con fecha efectiva anterior. | RN-06 §23.1 (`Actualizar_CategoriaConsumo`); V2 2682; INV `frmConsultaConsumoMedido.ActualizarCategoria` | Estándar | O7 | Adoptado | Se rechaza si el consumo está facturado. |
| RF-MED-072 | Consultar los consumos de un servicio: historial por canal (categoría, medidor, fechas y lecturas, días, consumo, período, factura), gráfico, comparación interanual, adjuntos, filtros por fecha y por propiedad; imprimir con o sin gráfico y resumen con subtotales. | REL §3; DFA M6; INV `frmConsultaConsumoMedido` | Núcleo | O7 | Adoptado | La consulta muestra estimados y reales diferenciados. |
| RF-MED-073 | Detectar servicios conectados sin lectura en el período (medidores sin leer). | RN-06 §23.7 (`Get_ControlMedidores`) | Núcleo | O7 | Adoptado | El informe lista con 0 a los que no tienen lectura, separado de los leídos con consumo 0. |

### 5.6 Estimaciones y regularización

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-074 | Estimar consumos individual o masivamente con método configurable (promedio de los últimos N períodos válidos hasta 12, mismo período del año anterior, promedio de la categoría, consumo mínimo del régimen), con o sin decimales, guardando método, base y período de referencia. | BASE §9; RN-06 §15; DFA M6 mejora; V2 2466 | Núcleo | O7 | A validar (PA-MED-02) | Un servicio sin historia no produce división por cero: usa el siguiente método de la cadena. |
| RF-MED-075 | Exigir motivo y, según parámetro, autorización para cada estimación. | BASE §9 | Núcleo | O7 | Adoptado | La estimación sin motivo se rechaza; con autorización pendiente no está disponible para liquidar. |
| RF-MED-076 | Estimar dentro del lote de lectura para tareas no leídas, y estimar automáticamente las lecturas con observación que lo indique. | RN-06 §15; V2 PMovil 29; CAT `OBSESTAD.MARCAR_ESTIMADO` | Núcleo | O7 | Adoptado | La tarea queda "estimada" con la observación de campo como motivo. |
| RF-MED-077 | Estimar sobre el medidor testigo partiendo de su última lectura. | RN-06 §23.7 (`GuardarConsumosEstimadosTestigo`); INV `frmInformesConsumos.EstimarConsumosTestigo` | Estándar | O7 | Adoptado | La estimación del testigo no afecta consumos de los servicios que lo usan hasta su aprobación. |
| RF-MED-078 | Estimar con propiedad adicional (sumar propiedades) y con opción "agregar días" (fecha estimada = última lectura + 1 mes). | RN-06 §15; INV `frmInformesConsumos.btnEstimarConPropiedad`, `frmConsumosEstimacion.chkSumarMes` | Estándar | O7 | Adoptado | La fecha estimada queda marcada como estimada, no como fecha de lectura real. |
| RF-MED-079 | Regularizar estimaciones al llegar una lectura real: calcular la diferencia entre lo estimado facturado y lo real, y generar un ajuste según la política del servicio (compensación de unidades en la próxima liquidación o refacturación de los períodos estimados). | BASE §9; RN-06 §15, §21.8, Duda 12; INV `frmBonificacionEstimados` | Núcleo | O7 | A validar (PA-MED-01) | El ajuste muestra períodos estimados, unidades estimadas, unidades reales y diferencia; requiere aprobación. |
| RF-MED-080 | Filtrar la regularización por solo lecturas telemedidas y solo medidor actual. | RN-06 §23.7 (`GetConsumosBonificar`) | Estándar | O7 | Adoptado | Los filtros reducen el universo propuesto sin cambiar la fórmula. |
| RF-MED-081 | Limitar la cantidad de estimaciones consecutivas y, al superarla, generar automáticamente una solicitud de inspección o relectura obligatoria. | BASE §9 ("casos pendientes de inspección") | Estándar | O7 | A validar (PA-MED-07) | Al tercer período estimado consecutivo (default) se emite `med.point.inspectionRequested`. |

### 5.7 División, prorrateo, distribución y testigos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-082 | Dividir un consumo que abarca más días que el período en dos o más tramos con los modos: mitades, por días máximos (primer tramo exacto marcado estimado), limitar consumo (descartar el excedente), cambio de medidor (dos medidores en el período) y prorrateo por días. | RN-06 §16.1, §23.6; INV `frmAgrupaDivideConsumos` | Núcleo | O7 | Adoptado | La suma de los tramos es igual al consumo original salvo el modo "limitar", que deja el excedente registrado como no facturable con motivo. |
| RF-MED-083 | Agrupar consumos de lecturas múltiples del mismo período y canal en un solo consumo liquidable cuando corresponde. | RN-06 §16.1 (`GetConsumos_AgrupadosDivididos`, `Procesar_Consumos`) | Estándar | O7 | Adoptado | El agrupado conserva la referencia a cada lectura. |
| RF-MED-084 | Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. | INV `frmAgrupaDivideConsumos` (`chkVerExcluidos`, `cmdImprimir1`) | Estándar | O7 | Adoptado | El preview lista excluidos con su causa (ej. servicio con múltiples medidores). |
| RF-MED-085 | Distribuir el consumo de un punto padre (medidor general de consorcio o barrio) entre puntos hijos por porcentaje, en partes iguales o combinada con tope por hijo. | RN-06 §16.3, §23.7; INV `abm_DstConsumos`, `frmDistribucionConsumos` | Estándar | O7 | Adoptado | Cada hijo recibe un consumo "Redistribución de consumo" y el padre un consumo compensatorio negativo. |
| RF-MED-086 | Revertir una distribución ejecutada mientras sus consumos no estén facturados. | RN-06 §23.7 (`EliminarDistribucion`) | Estándar | O7 | Adoptado | La reversión anula los consumos de hijos y padre de esa ejecución, identificados por su número de distribución. |
| RF-MED-087 | Administrar medidores testigo: definición, servicios asociados, exclusión ("no incluir"), lecturas propias y consulta de sus consumos. | RN-06 §12.2; RN-01 §16; CAT `MED_TESTIGO`, `CONS_SER_TESTIGO`; INV `frmConsultaConsumoMedidoTestigo` | Estándar | O7 | Adoptado | El consumo del testigo en un intervalo se entrega a M04 junto con el del servicio. |
| RF-MED-088 | Aplicar el último consumo del testigo a la carga manual de un servicio asociado cuando el operador lo pide. | INV `frmRegistroLecturas.AplicarUltimoConsumoTestigo` | Estándar | O7 | Adoptado | El consumo así cargado queda con origen "testigo" y es estimado. |

### 5.8 Demanda y transgresiones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-089 | Registrar la demanda contratada por punto y canal de demanda (punta, fuera de punta, valle) con vigencia por período. | RN-06 §17; CAT `SERSOC_DEMANDASXPERIODO`; MER-003 | Núcleo | O7 | Adoptado | Para cada período existe un valor contratado vigente o se usa el último. |
| RF-MED-090 | Registrar la demanda máxima medida por período desde lectura o telemedición. | RN-06 §17, §19.2 (DemandaMax) | Núcleo | O7 | Adoptado | La demanda se guarda en kW en su canal, nunca en kWh. |
| RF-MED-091 | Detectar transgresiones (demanda registrada > contratada), calcular el % y registrar primera transgresión, demanda declarada y fecha. | RN-06 §17, §23.7; INV `frmTransgresiones` | Núcleo | O7 | Adoptado | % de transgresión = demanda × 100 / contratada − 100. |
| RF-MED-092 | Revisar transgresiones de los últimos 6 períodos (configurable) por fecha de primera o última transgresión, y resetear la demanda declarada a la contratada con aprobación y auditoría. | RN-06 §23.7 | Estándar | O7 | Adoptado | El reset deja el valor anterior en la auditoría. |
| RF-MED-093 | Emitir aviso al socio y a atención comercial cuando haya transgresión, para gestionar aumento de potencia (M09/M10). | BASE §87 (aumento de potencia) | Estándar | O7 | Adoptado | El evento `med.demand.transgressionDetected` llega a M09. |

### 5.9 Energía inyectada y generación distribuida

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-094 | Registrar el contrato técnico de generación distribuida: clasificación del usuario-generador, potencia instalada y autorizada, tecnología, equipo/inversor, fecha de conexión, instalador habilitado, régimen y jurisdicción, documentación. | MER-001 | Núcleo | O7 | Adoptado | Sin contrato aprobado no se liquida inyección. |
| RF-MED-095 | Exigir medidor bidireccional con canales separados de energía demandada e inyectada (y por franja o potencia cuando corresponda). | MER-001; RN-06 §21.10 | Núcleo | O7 | Adoptado | No se modela la inyección como factor negativo. |
| RF-MED-096 | Registrar opcionalmente la generación total del equipo (registro del generador). | RN-06 §18 (`LEC_MEDTEL.GENERADOR`) | Extensión | O7 | Adoptado | El canal de generación es informativo; no se liquida. |
| RF-MED-097 | Calcular el balance de energía por período: demandada, inyectada, neto, y entregarlo a M04/M05 para la liquidación separada y a M07 para la cuenta de créditos. | MER-001; RN-01 §4.6 | Núcleo | O7 | Adoptado (DEC-060; antes A validar PA-MED-08) | El balance se recalcula si cambia una lectura no facturada. Un neto negativo se entrega como tal: M05 lo trata como crédito a futuro según la política del servicio (DEC-036). |
| RF-MED-098 | Vincular el cambio de titular y la baja del contrato de GD con los del suministro. | MER-001 | Estándar | O7 | Adoptado | Al dar de baja el suministro, el contrato GD pasa a "baja" con lectura final de ambos canales. |
| RF-MED-099 | Alertar inyección registrada en un punto sin contrato GD vigente. | MER-001 | Estándar | O7 | Adoptado | Excepción bloqueante para el canal de inyección. |

### 5.10 Medición propia, pérdidas y cambio de clase

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-100 | Registrar puntos de medición propia (compra de energía, frontera, alimentadores, internos) con registros pico, resto, valle, punta, fuera de punta y reactiva, y sus lecturas/consumos por período. | RN-06 §23.7; CAT `MEDIDORP`, `CONSUMOP`; INV `frmRegistroConsumoPropio`, `frmRegistroMedidoPropio`; BASE §87 | Estándar | O7 | Adoptado | El servicio se indica explícitamente (no se asume energía = servicio 1). |
| RF-MED-101 | Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado (`cmp.supplyBalance.approved`, EVT-CMP-16) el informe incorpora para ese período y zona la cantidad comprada según factura del mayorista (`purchasedQty`), la medida en frontera y la pérdida del balance, y marca diferencias contra la medición propia. | RN-06 §23.7 (`Get_Informe_Perdidas`); INV `frmPerdidasServiciosMedidos`; RF-CMP-151 | Estándar | O7 | Adoptado | Las cifras se reconcilian con los consumos facturados del mismo período; con EVT-CMP-16 del período 11/2026 el informe muestra comprado 100.000 kWh, facturado 91.000 kWh y pérdida 9 % (valores ficticios), igual que el balance de M12. |
| RF-MED-102 | Proponer cambios de clase/categoría por rango de consumo con reglas declarativas y aprobación, sin aplicarlos automáticamente. | RN-06 §23.1 (`Get_ServiciosClase`), Duda 21 | Extensión | O7 | A validar (PA-MED-10) | La propuesta lista servicios y motivo; M02/M01 aplica el cambio aprobado. |

### 5.11 Telemedición AMI/MDM

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-103 | Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). | RN-06 §19.1; CAT `TELEMEDICION`; DFA M6 (Telemed > Configuración) | Núcleo | O7 | Adoptado | Las credenciales nunca se muestran ni se guardan en texto plano. |
| RF-MED-104 | Mapear por sistema, tipo de medidor y categoría qué registros remotos alimentan cada canal (hasta 3 registros por canal con regla "máximo", factor de escala como ÷1000, registro de generador). | RN-06 §19.2; CAT `LEC_MEDTEL` | Núcleo | O7 | Adoptado | Una toma de estado sin mapeo para un canal genera excepción, no un consumo 0. |
| RF-MED-105 | Toma de estado masiva por lote (tareas telemedidas) y puntual por servicio u OT; en puntos multicanal pedir confirmación antes de reemplazar lecturas. | RN-06 §13.3 (telemedición), §19.1 | Núcleo | O7 | Adoptado | La toma masiva es asíncrona, reanudable y muestra progreso por punto. |
| RF-MED-106 | Importación estándar de lecturas desde AMI/MDM (archivo o API) con origen identificado, sin duplicar lecturas manuales del mismo medidor, registro e instante. | BASE §97.5; DFA M6 mejora; FIC 10.2 | Núcleo | O7 | Adoptado | Una lectura repetida del mismo registro e instante se descarta como duplicada informándolo. |
| RF-MED-107 | Ejecutar operaciones del ciclo del medidor en el sistema remoto: alta, asignación de medidor, retiro, cambio de medidor, cambio de categoría, confirmación de OT, en forma asíncrona tras el hecho en CoopApps. | RN-06 §19.1; FIC 10.2 | Estándar | O7 | Adoptado | Si el proveedor falla, la operación queda pendiente con reintentos y no bloquea el cierre de la OT. |
| RF-MED-108 | Contrato de comandos de corte y reconexión remota: solo a pedido de una orden vigente de M08/M10, con `Idempotency-Key`, resultado confirmado (ejecutado, rechazado, sin respuesta) y evento de resultado. | BASE §97.5, §68; FIC 10.2; CAT `TELEMED_COMM` | Núcleo | O7 | Adoptado | Un comando repetido con la misma clave no se envía dos veces; sin confirmación el servicio no cambia de estado en M01. |
| RF-MED-109 | Auditar cada llamada a un sistema remoto: operación, medidor, punto, solicitud y respuesta saneadas, duración, resultado y correlación. | CAT `AUDITORIA_TELEMEDICION`; AGR-021 | Núcleo | O7 | Adoptado | La auditoría no contiene secretos y es consultable por punto y por medidor. |
| RF-MED-110 | Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. | INV `frmComandosTelemedicion`, `frmOperacionesTelemedicion` | Estándar | O7 | Adoptado | El historial muestra comando, respuesta y usuario/orden de origen. |
| RF-MED-111 | Almacenar curvas de carga (lecturas por intervalo) importadas de AMI/MDM para grandes usuarios y análisis. | RN-06 §19.2, §21.11, Duda 15 | Extensión | O7 | A validar (PA-MED-03) | Las curvas se guardan en una colección de series temporales separada y no alimentan la liquidación salvo configuración. |
| RF-MED-112 | Mostrar el estado de cada conector por tenant (activo, degradado, caído, credencial vencida) con la cantidad de operaciones pendientes. | AGR-021; T06 | Estándar | O7 | Adoptado | Una caída del conector no marca como erróneos a todos los socios. |

### 5.12 Prepago

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-113 | Mantener la cuenta prepaga técnica del punto: sistema prepago, identificador del medidor en el proveedor, modalidad (token/código o carga remota en línea), saldo informado por el proveedor, umbral de saldo bajo. | BASE §97.5; FIC 10.3 | Núcleo | O7 | A validar (PA-MED-04) | Un punto prepago no entra en el ciclo pospago de lectura para facturar (RN-MED-110). |
| RF-MED-114 | Validar la preventa en el proveedor (medidor habilitado, límite, deuda) antes de que M07 cobre la recarga. | RN-06 §19.1 (`ValidarPreVenta`, `ValidarPrepaga`); V2 2594 | Núcleo | O7 | Adoptado | Una preventa rechazada impide el cobro con mensaje del motivo. |
| RF-MED-115 | Solicitar el crédito o token al proveedor tras la confirmación del cobro (`cob.payment.confirmed` de la recarga), entregar el token al canal (caja, POS, portal, app) y registrar el estado de la carga. | RN-06 §19.1 (`CargaCreditoPrepago`, `EstadoCargaCredito`), §19.2; FIC 10.3 | Núcleo | O7 | Adoptado | Un reintento no genera un segundo token; una carga fallida tras cobrar queda en bandeja con opción de reintento o devolución (M07). |
| RF-MED-116 | Consultar el historial de cargas del proveedor y conciliarlo diariamente con las recargas cobradas. | RN-06 §19.1 (`HistorialCargas`) | Estándar | O7 | Adoptado | Las diferencias aparecen en un reporte de conciliación con responsable. |
| RF-MED-117 | Recibir consumos/lecturas de medidores prepagos (cuando el sistema lo permite) para control y para el escalón mensual de la tarifa prepaga (M04). | FIC 10.3; RN-01 §4.8 | Estándar | O7 | Adoptado | M04 obtiene el consumo ya facturado en el mes del punto prepago. |
| RF-MED-118 | Avisar saldo bajo al socio cuando el proveedor informe saldo o cuando la estimación de días restantes caiga bajo el umbral. | BASE §97.5 | Estándar | O7 | Adoptado | El aviso respeta el canal preferido del socio (T09). |
| RF-MED-119 | Reimprimir/reenviar el comprobante de recarga y el token desde la ficha de consumos. | INV `frmConsultaConsumoMedido.ImprimirComprobanteRecarga` | Estándar | O7 | Adoptado | La reimpresión indica "duplicado" y queda auditada. |

### 5.13 Portal del socio, facturación in situ e informes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MED-120 | "Mis consumos" en la app del socio: historial por servicio y canal, gráfico, comparación interanual, estimados marcados, fotos de la lectura si el tenant lo habilita. | BASE §8, §9; V2 PMovil 55 ("Mi Medidor"); MER-018 | Estándar | O7 | Adoptado | El socio solo ve servicios de cuentas autorizadas. |
| RF-MED-121 | "Mi prepago" en la app del socio: saldo informado, últimas recargas, tokens, avisos. La compra se hace por M07/M19. | BASE §97.5; FIC 10.3 (`AutorizarPrepaga`) | Estándar | O7 | Adoptado | El token se muestra solo al titular o autorizado. |
| RF-MED-122 | Facturación in situ: entregar a M05, en el momento de confirmar la lectura en campo, el consumo aprobado automáticamente cuando el régimen y la cooperativa lo permitan. | MER-018 | Extensión | O7 | A validar (PA-MED-05) | Solo para servicios sin excepciones y con aprobación automática habilitada. |
| RF-MED-123 | Informes de consumo: consumos por categoría, agrupados por tramas, control de medidores sin leer, variación porcentual, desvío de días, grandes consumos, consumos con o sin consumo, estimados, medidores indicados, períodos mayores, con orden y filtros. | RN-06 §23.7; INV `frmInformesConsumos`, `frmImpresiones`; V2 2568 | Estándar | O7 | Adoptado | Cada informe declara fórmula, universo y fecha de corte (sección 15). |
| RF-MED-124 | Tablero de lecturas y consumos: avance de lotes, % leído, % estimado, excepciones abiertas, productividad, telemedición (éxito de toma de estado), prepago (recargas y fallas). | BASE §8; AGR-022 | Estándar | O7 | Adoptado | Los totales coinciden con los informes para el mismo corte. |
| RF-MED-125 | Exportar los conjuntos de datos de consumo que M06 necesita para informes a reguladores (por categoría, tramo, período, tipo de fecha: emisión, vencimiento o lectura). | RN-06 §23.7 (informes a entes); INV `frmConsumosExportar`, `abm_InfoCtd`, `frmInformeSecretariaElectrica`, `frmInformeConsumoTramasCuedro` | Estándar | O7 | Adoptado (formato en M06) | M06 consume el dataset vía servicio; MED no arma la planilla regulatoria. |
| RF-MED-126 | Alertas de patrones de consumo no registrado (caída abrupta sostenida, consumo cero con servicio activo, inversión de giro, manipulación detectada por telemedición, precinto violado) que M10 convierte en inspección. | MER-004 | Estándar | O7 | Adoptado | La alerta nunca genera recupero ni multa; solo `med.point.suspicionRaised`. |
| RF-MED-127 | Exponer a M10 el historial de consumos y lecturas de un punto para el cálculo del recupero según método aprobado. | MER-004 | Estándar | O7 | Adoptado | API de historial con períodos, canales y origen. |

## 6. Reglas de negocio

Decisión: **Replicar** (igual que ProCoop), **Mejorar** (misma intención con más control), **Reemplazar** (otra solución), **Descartar** (no se implementa, con motivo).

### 6.1 Medidores e instalaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-001 | Un medidor no puede tener dos instalaciones activas simultáneas. El número de medidor es único por tenant, servicio y marca. | `ValidarMedidor` busca el número activo en cualquier servicio; `Existe_MedidorEnSersoc` solo dentro del mismo servicio (RN-06 §12.3, §23.1). | Mejorar: unicidad por `meterId` (no por texto) con índice único parcial sobre instalaciones activas; unicidad de número por tenant+servicio+marca configurable a tenant+servicio. | PRM-MED-001 | — |
| RN-MED-002 | Los dígitos del medidor determinan el máximo del totalizador (10^dígitos − 1). | Si `DIG_MED` = 0 se asume 5 (RN-06 §12.1). | Mejorar: dígitos obligatorio > 0 en el alta; en migración, 0 → 5 con observación "dígitos asumidos" y excepción de revisión. | PRM-MED-002 | — |
| RN-MED-003 | El factor multiplicador multiplica la diferencia de estados. | Factor 0 → 1; factor negativo permite consumo negativo (inyección) (RN-06 §12.1, §18). | Mejorar: factor obligatorio > 0; la inyección usa canal propio (RN-MED-096). En migración, factor negativo → canal de energía recibida. | — | — |
| RN-MED-004 | Medidor indicado: el estado leído es el consumo del período. | `INDICADO` (RN-06 §12.1, §14.1). | Replicar, por registro. | — | — |
| RN-MED-005 | Lectura con factor: el estado recibido ya está multiplicado y se divide por el factor al registrarlo. | `LECTURA_CON_FACTOR` (RN-06 §12.1, §13.3). | Replicar, guardando valor recibido y valor normalizado. | — | — |
| RN-MED-006 | El tipo de medidor determina servicio, sistema de telemedición, si es prepago, si está disponible para nuevas instalaciones, si admite "indicado" y el redondeo de prepaga. | `TIPMED` (CAT §3; RN-06 §12.1). | Replicar. | — | — |
| RN-MED-007 | La propiedad del medidor (cooperativa, socio, comunitario) se registra y viaja a M04 y M13. | `COD_PROP` / `PROPIESER` (RN-06 §12.1). | Replicar. | — | — |
| RN-MED-008 | Último estado, fecha de última lectura y último consumo del punto son valores derivados de las lecturas validadas. | Campos editables `EST_LEC`, `FEC_LEC`, `CON_ANT`; `EditarSersoc` los edita a mano (RN-06 §12.1, §23.2). | Reemplazar: vista materializada recalculada; la edición manual no existe (se corrige la lectura). | — | — |
| RN-MED-009 | Si el servicio registra stock, el medidor debe existir como ítem serializado y la instalación genera el movimiento de stock. | `MoverStock`, `PROD_TRH`; V2 2416 (precio y depósito) (RN-06 §12.3, §20). | Replicar por evento: MED emite `med.meter.installed/removed`, M13 mueve stock y valoriza (V2 2416 → M13). | PRM-MED-003 | — |
| RN-MED-010 | El retiro nunca borra el número del medidor ni la matrícula del servicio. | `RETIRADO`; V2 2399 vacía `NUM_MED` y la matrícula; también se vacía si el medidor es trazable (RN-06 §12.3, §20). | Reemplazar: se cierra la instalación; V2 2399 no se replica. | — | — |
| RN-MED-011 | El medidor telemedido guarda su identificador en el sistema remoto. | `ID_SYS_TEL` (RN-06 §12.1). | Replicar en `meters.remoteIds[]` por sistema. | — | — |
| RN-MED-012 | En grandes usuarios, los canales del punto se derivan de los pares tipo de energía–concepto de la categoría tarifaria. | `ActualizarMedSoc` crea una `MEDSOC` por par con la fecha de lectura del servicio (RN-06 §12.2, §23.6). | Mejorar: propuesta con confirmación; no se borran canales con historia. | — | — |
| RN-MED-013 | Los canales se ordenan por concepto. | V2 2520 (RN-06 §12.2). | Replicar como preferencia de visualización. | PRM-MED-004 | — |
| RN-MED-014 | Toda instalación exige fecha efectiva; si la OT no la trae, se propone la fecha de cierre de la OT con advertencia. | Si `MEDSOC` no trae `FEC_LEC` toma `ALTA_ADM`; el cambio por OT pone `FEC_LEC` = hoy (RN-06 §12.3, §23.1). | Mejorar: fecha efectiva + fecha de registro (AGR-010). | — | — |
| RN-MED-015 | Cambio de medidor: lectura final del viejo (estado de retiro de la OT, período por fecha efectiva), alta del nuevo con número, dígitos, factor, tipo y estado inicial, categoría nueva opcional de la OT, canales nuevos si es GC, período con dos tramos. | `PreSave_CONS_SER`, `Actualizar_NuevoMedidor_SERSOC` (aplica `N_COD_CAT` y limpia `CAT_SOC`) (RN-06 §12.3, §23.1). | Replicar como operación atómica; el cambio de categoría lo aplica M01/M02 por evento con la misma fecha efectiva. | — | — |
| RN-MED-016 | Toda modificación de un canal o instalación deja historial completo. | Solo guarda historial si cambia potencia contratada, estado o consumo total (`CargarMedsocNuevo`) (RN-06 §23.7). | Mejorar: historial funcional de cada cambio + auditoría genérica. | — | — |
| RN-MED-017 | Compatibilidad de instalación: el tipo de medidor pertenece al servicio del punto; prepago solo en categoría prepaga; bidireccional en punto con GD; telemedido requiere sistema configurado. | Parcial en `TIPMED.COD_SER` (CAT §3). | Mejorar con validaciones explícitas. | — | — |
| RN-MED-018 | Las instalaciones de un mismo punto y canal principal no se superponen en el tiempo; un medidor en paralelo solo se admite con rol "control/testigo". En servicios medidos hay **un contrato por punto de medición de cliente**: un segundo contrato igual en la misma cuenta exige otro punto de suministro; en servicios no medidos no se crea punto y se admiten contratos iguales (DEC-028). | No existe control explícito (BASE §7 lo exige). | Mejorar. | — | — |
| RN-MED-019 | El último consumo cargado por cambio de medidor puede anularse si no está facturado. | V2 2658 "Permitir eliminar último consumo cargado por cambio de medidor" (RN-09 CONSUMOS). | Replicar como anulación con reversión (no borrado), con permiso `med.instalaciones.anular`. | PRM-MED-005 | V2 2658 sin uso directo en código: confirmar semántica. |
| RN-MED-020 | Un precinto numerado solo puede estar colocado en un medidor a la vez; su retiro o violación se registra con OT o acta. | No existe tabla (BASE §7). | Nuevo (Adoptado). | — | — |
| RN-MED-021 | Un medidor con último ensayo rechazado no se instala hasta un ensayo aprobado posterior. | No existe (BASE §7). | Nuevo (Adoptado). | PRM-MED-006 | — |
| RN-MED-022 | Un número de servicio de telefonía móvil guardado como "número de medidor" debe ser único entre servicios conectados. | `Validar_TelefonoMovil` usa `NUM_MED` (RN-06 §23.1). | Descartar en MED: la línea telefónica no es un medidor; M10 la modela como recurso de numeración. | — | — |

### 6.2 Rutas, lotes y tareas

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-023 | Una ruta incluye uno o más servicios, un criterio de selección (0 zona/sector/recorrido, 1 ruta de calle con rangos y pares/impares, 2 rango de cuentas), zonas y categorías opcionales. | `CONNRUTA` con `COD_SER1..4`, `REC_CAL`, `ORD_CAL` (RN-06 §13.1). | Mejorar: sin tope de 4 servicios; se agrega criterio por polígono. | — | — |
| RN-MED-024 | Orden de recorrido: 0 predeterminado, 1 por titular, 2 por calle y número, 3 por zona y recorrido; opcionalmente por última toma del lecturista. | `ORDEN`; V2 2098 (RN-06 §13.1, §13.3). | Replicar + orden manual en mapa. | PRM-MED-010, PRM-MED-011 | — |
| RN-MED-025 | Inclusión en la ruta: servicios conectados y pendientes de baja; los de baja solo si no están retirados y la ruta incluye desconectados o el punto es testigo. Se excluyen las categorías prepagas. | Condiciones 2 y 3; 4 con `SERV_DESC` o testigo; exclusión fija de prepagas (RN-06 §13.1). | Mejorar: exclusión de prepagos configurable por ruta para lecturas de control (CTR-MED-11). | PRM-MED-012 | — |
| RN-MED-026 | Filtro de telemedidos: incluir solo, excluir o todos. | `TELEMED` (RN-06 §13.1). | Replicar; por defecto se excluyen telemedidos de rutas de campo. | PRM-MED-013 | — |
| RN-MED-027 | Solo se generan tareas para puntos con medidor instalado. Los servicios sin medidor no generan tarea de lectura (pueden generar tarea de relevamiento). | Pseudo-medidor "sd" + `ID_SERSOC` (RN-06 §13.2). | Reemplazar. | — | — |
| RN-MED-028 | Un punto no puede estar en dos lotes abiertos del mismo período; el intento bloquea. | Cuenta en otra ruta abierta bloquea; V2 3063 activa log detallado de duplicados (RN-06 §13.2). | Replicar; el log detallado es estándar. | — | V2 3063 tiene dos usos (corrección de fecha txt y log). |
| RN-MED-029 | El rango esperado de la lectura se calcula al generar la tarea: mín = estado anterior + consumo anterior − consumo anterior × p; máx = estado anterior + consumo anterior + consumo anterior × p. | `UMB_MIN`/`UMB_MAX` con p = V2 dec 439 global (RN-06 §13.2). | Mejorar: p por servicio/categoría, base = consumo esperado (promedio móvil o estacional) en lugar del último consumo; mínimo absoluto configurable para consumos bajos. | PRM-MED-020 a PRM-MED-024 | — |
| RN-MED-030 | Si el último consumo fue estimado, la tarea se marca como lectura real prioritaria. | V2 2559 marca el registro `ESTIMADO` (RN-06 §13.2). | Mejorar: marca "lectura real prioritaria" y no se permite estimar sin observación. | PRM-MED-014 | — |
| RN-MED-031 | Las observaciones postales enviadas al dispositivo son las de la cuenta o las del servicio. | V2 2809 (RN-06 §13.2). | Replicar (acceso/ubicación del punto). | PRM-MED-015 | — |
| RN-MED-032 | Se pueden filtrar por fecha de alta los servicios a incluir al generar. | V2 720 (RN-09 TELEMED). | Replicar: excluye puntos con instalación posterior a la fecha de corte del período. | PRM-MED-016 | V2 720 sin uso directo en código. |
| RN-MED-033 | Los datos enviados al dispositivo son configurables: observación postal, lectura anterior, consumo anterior, ZSR, categoría, estado, matrícula, manzana/lote, propiedad, nomenclatura catastral, descripción de ruta. | V2 458, 468, 469, 2293, 2297, 2298, 2331, 748, 3197, PMovil 28, 47, 69 (RN-06 §13.3; RN-09 TELEMED). | Replicar como conjunto de campos visibles por servicio. | PRM-MED-030 a PRM-MED-041 | — |
| RN-MED-034 | Ciclo del lote: generado → asignado → descargado/exportado → en curso → recibido → en revisión → confirmado → cerrado; con error por registro; cancelado. | `IMP_WORK.CONFIRMADO`: G → E → I → C, R con error (RN-06 §13.2). | Mejorar (sección 8.3). | — | — |
| RN-MED-035 | Confirmación de una lectura: se rechaza si el servicio no tiene fecha de alta, si el medidor cambió desde la generación, si el canal ya no existe, si la fecha anterior no coincide o si el estado anterior difiere en más de ±0,01 del último validado. | `ConfirmarRuta` (RN-06 §13.2 paso 6). | Replicar con verificación de versión de la última lectura validada (control optimista); la tolerancia ±0,01 es parámetro. | PRM-MED-025 | — |
| RN-MED-036 | Una observación de lectura puede generar OT automática (por código de transacción), forzar estimado o exigir foto. | `OBSESTAD.GENERA_OT`, `COD_TRAN`, `MARCAR_ESTIMADO`, `FOTO` (RN-06 §13.2; CAT §3). | Replicar: la OT se pide a M10 por evento. | — | — |
| RN-MED-037 | El consumo se asocia a la categoría vigente del servicio en la fecha de la lectura (historia de M01/M02). | V2 2682: categoría actual vs. la de la ruta (RN-06 §13.2). | Mejorar: siempre por fecha efectiva; V2 2682 se reemplaza (CTR-MED-15). | — | — |
| RN-MED-038 | El período de un consumo lo define el cronograma/ciclo de lectura del servicio, no solo el mes de la fecha de lectura. | `PERIODO` = MM/aaaa de `FEC_ACT` (RN-06 §13.2). | Mejorar (AGR-017): período por calendario; si no hay cronograma, MM/aaaa de la fecha efectiva en zona horaria del tenant. | PRM-MED-026 | — |
| RN-MED-039 | Las fotos de la lectura se vinculan al consumo y se nombran con metadatos. | V2 2595 adjunta fotos; V2 2332 nombra con cuenta/medidor/concepto/fecha (RN-06 §13.2; RN-10 §16.2). | Replicar como metadatos (no nombre de archivo). | PRM-MED-042 | — |
| RN-MED-040 | Las lecturas del testigo se confirman en el historial del punto testigo. | Inserta en `CONS_SER_TESTIGO` (RN-06 §13.2). | Replicar (el testigo es un punto con rol `witness`). | — | — |
| RN-MED-041 | Al confirmar se actualizan los valores derivados del punto (último estado, fecha, consumo, GPS). | Actualiza `SERSOC`/`MEDSOC` (RN-06 §13.2). | Replicar por proyección. | — | — |
| RN-MED-042 | Los lotes confirmados se archivan; nunca se borran. Un lote con lecturas sin procesar no se cancela sin confirmación expresa. | `GuardarEnHistorico` → `HISWORK`; `LimpiarRutas` borra; `ValidarBorrarRuta`; V2 2345 limpia sin alertas (RN-06 §13.2–13.3). | Mejorar: archivo; V2 2345 se reemplaza por confirmación masiva auditada. | — | — |
| RN-MED-043 | Al exportar un lote, opcionalmente se confirma masivamente su envío. | V2 2340 "Confirma masivamente Rutas al exportarlas" (RN-09). | Replicar como opción "marcar como descargado al exportar". | PRM-MED-017 | Semántica exacta sin uso directo en código. |
| RN-MED-044 | La exportación a archivo puede ser una por ruta o consolidada. | V2 2334 (RN-09). | Replicar. | PRM-MED-018 | — |
| RN-MED-045 | La renumeración del recorrido según el orden real de toma es de 5 en 5, desde 0, por zona y sector. | `ActualizarRecorrido` (RN-06 §23.7). | Replicar como propuesta aprobable. | PRM-MED-019 | — |
| RN-MED-046 | Una tarea tiene un solo lecturista vigente; reasignar una tarea ya descargada invalida la copia del dispositivo anterior y genera conflicto si este la sincroniza. | No hay regla explícita (AGR-025). | Nuevo (Adoptado). | — | — |

### 6.3 Captura y validación de lecturas

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-047 | La fecha de lectura es obligatoria y posterior a la última lectura validada del mismo registro. | `CheckearLectura` y `ValidarLecturasAnteriores` rechazan nula, anterior o igual (RN-06 §13.3, §14.2). | Replicar. | — | — |
| RN-MED-048 | No se registra lectura en un servicio sin medidor ni en un servicio inexistente o de valor 0. | `CheckearLectura` (RN-06 §14.2). | Replicar. | — | — |
| RN-MED-049 | Ningún estado (anterior o actual) puede ser negativo. | `CheckearLectura` (RN-06 §14.2). | Replicar. | — | — |
| RN-MED-050 | Un consumo negativo solo se acepta en un canal de energía recibida (inyección). | Se acepta solo con `FAC_MED` < 0 (RN-06 §14.2, §18). | Reemplazar por tipo de canal. | — | — |
| RN-MED-051 | El estado no puede exceder la cantidad de dígitos del registro. | Solo con V2 2088 (RN-06 §14.2). | Mejorar: siempre validado; V2 2088 queda como interruptor para datos migrados. | PRM-MED-027 | — |
| RN-MED-052 | Una lectura imposible se registra con motivo codificado; nunca con cero. | No hay regla; los umbrales son informativos (BASE §8, CU-08). | Nuevo (Informado). | — | — |
| RN-MED-053 | En el dispositivo, un estado fuera del rango esperado muestra advertencia y pide reingreso; no bloquea. | `LECMIN`/`LECMAX` en captor como aviso (RN-06 §13.2–13.3). | Mejorar (reingreso + foto obligatoria). | PRM-MED-043, PRM-MED-044 | — |
| RN-MED-054 | Toda lectura de campo registra GPS, hora del dispositivo, hora de recepción, lecturista y dispositivo; si la distancia al punto supera el umbral, se advierte. | GPS en `CONS_SER_TESTIGO` y actualización de GPS al confirmar (RN-06 §13.2; CAT §3). | Mejorar con geocerca (CNX §7.8). | PRM-MED-045 | — |
| RN-MED-055 | Una corrección crea una versión nueva y conserva la original con autor, motivo y fecha. | `EliminarConsumo` borra y restaura `EST_LEC`/`FEC_LEC`; `abm_Cons_Ser` modifica/elimina (RN-06 §14.1; INV). | Reemplazar (CTR-MED-05). | — | — |
| RN-MED-056 | La autolectura exige foto, ventana vigente, acceso del socio al servicio, no ser menor que la última validada y máximo de autolecturas por período; siempre pasa por validación. | No existe (MER-018). | Nuevo (Adoptado, A validar PA-MED-06). | PRM-MED-050 a PRM-MED-054 | — |
| RN-MED-057 | Las lecturas de OT (retiro, colocación, verificación) toman la fecha efectiva de la OT o, si falta, la de confirmación; la observación se conserva completa. | `Guardar_CONS_SER` desde OT recorta la observación a 40 caracteres (RN-06 §23.7). | Mejorar: sin recorte. | — | — |
| RN-MED-058 | La fecha anterior de una lectura es la de la última lectura validada o, si no hay, la fecha de instalación. | `Crear_CONS_SER`: última lectura o fecha de alta; descripción recortada a 80 (RN-06 §23.7). | Replicar (sin recortes). | — | — |
| RN-MED-059 | El consumo adicional es una lectura extra estimada con descripción "Consumo adicional" y requiere motivo y aprobación. | Carga manual "cargo adicional" con `ESTIMADO = 1` (RN-06 §13.3). | Mejorar (aprobación). | PRM-MED-046 | — |
| RN-MED-060 | La importación directa de consumos (sin lectura) requiere perfil de tipo "consumos" y aprobación del lote importado. | `clsImportador` graba directo en `CONS_SER` (RN-06 §13.3). | Mejorar. | — | — |
| RN-MED-061 | Perfiles de importación: emparejamiento por número de medidor (con relleno a 10 dígitos configurable) o por cuenta; mapeo de conceptos por nombre de producto; formato de decimales; columnas por posición; servicio por defecto; columna de observación postal no obligatoria; corrección de fecha y cabecera para txt. | Formatos por cooperativa/fabricante en código; V2 2087, 3074/3075, 2054, 455, 3140, 3063, 2307 (RN-06 §13.3; RN-09). | Reemplazar por perfiles configurables (CTR-MED-09). | PRM-MED-060 a PRM-MED-066 | — |
| RN-MED-062 | Toma de estado remota: se consulta al proveedor por cada tarea telemedida o por servicio puntual; en puntos multicanal se pide confirmación; se toma el máximo de hasta 3 registros configurados; la demanda se escala (÷1000 en Discar). | `TomarEstadoTelemedicion`, `ObtenerMediciones`, `LEC_MEDTEL.COD_LEC/2/3` (RN-06 §13.3, §19.2). | Replicar por mapeo configurable. | — | — |
| RN-MED-063 | Las lecturas de telemedición no duplican lecturas manuales: si existe lectura validada del mismo registro en la misma fecha, prevalece la de mayor prioridad de origen y la otra queda como "redundante". | No hay regla (BASE §97.5). | Nuevo (Informado). | PRM-MED-067 | — |
| RN-MED-064 | Cada lectura guarda su origen: manual, app de campo, colectora/archivo, importación de terceros, telemedición, autolectura, OT, migración. | Origen implícito por proceso (RN-06 §13.3). | Mejorar (campo obligatorio). | — | — |

### 6.4 Cálculo, validación y aprobación de consumos

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-065 | Fórmula: f = factor del registro; si estado actual = anterior y no indicado → 0; si indicado o consumo adicional → actual × f; si anterior < actual → (actual − anterior) × f; si actual < anterior y la vuelta está confirmada → (máx − anterior + 1 + actual) × f. | `CalcularConsumo` (RN-06 §14.1). | Replicar con la condición de vuelta confirmada (RN-MED-066). | — | — |
| RN-MED-066 | Una lectura menor que la anterior genera excepción bloqueante "lectura menor"; se resuelve como vuelta (si el consumo resultante es plausible), error de captura (corrección) o cambio de medidor no registrado (OT). | Toda lectura menor se interpreta como vuelta sin confirmación (RN-06 §14.1, Duda 3). | Mejorar (CTR-MED-02). | PRM-MED-028 | — |
| RN-MED-067 | La inversa (estado = anterior + consumo / f) se usa para estimar; el estado resultante se marca "estado estimado" y no reemplaza a la última lectura real como base de validación. | `CalcularEstadoActual`, `RegistrarConsumo` (RN-06 §14.1). | Mejorar. | — | — |
| RN-MED-068 | Precisión de consumo por servicio y canal: 2 decimales, enteros (también los estados) o 6 decimales; redondeo explícito. | `Valores` 0 = 2 decimales, 2 = enteros, 4 = 6 decimales (RN-06 §23.6). | Replicar como parámetro (AGR-011). | PRM-MED-029 | — |
| RN-MED-069 | Corrección de gas: volumen = neto (o consumo si no hay neto); si hay presión y temperatura, volumen = red4(volumen × presión × temperatura); cantidad = volumen × factor calórico del período × coeficiente corrector (1 si ≤ 0) / factor calórico óptimo; redondeo según política (truncar a entero, redondear a 0 decimales, o sin redondeo). | `CorregirConsumoGAS`, `clsConsumosAFacturar`; V2 14 y 119 (RN-06 §16.2; RN-01 §4.4). | ~~Replicar en MED con trazabilidad (CTR-MED-06).~~ **Reemplazado por RN-TAR-035 (DEC-085):** la fórmula la aplica M04; M03 solo valida la lectura y entrega el volumen medido. | ~~PRM-MED-070 a PRM-MED-072~~ PRM-TAR-050, PRM-TAR-051, PRM-TAR-168 (M04, lectura; HUE-GAS-03). Los factores del período se leen de `gasCalorificFactors` de M04 (API-TAR-030). | — |
| RN-MED-070 | El factor de gas se busca por mes/año del período: primero por categoría y si no el general; sin factor el consumo queda bloqueado. | Error "No existe Factor para el periodo indicado" (RN-01 §4.4). | ~~Replicar (excepción en vez de error del lote).~~ **Reemplazado por RN-TAR-035 (DEC-085):** la búsqueda del factor y el error `TAR-E-GAS-FACTOR` son de M04. | — | — |
| RN-MED-071 | Días de consumo = fecha efectiva actual − fecha efectiva anterior en días calendario de la zona horaria del tenant; el día de la lectura anterior se excluye y el de la actual se incluye. | `fecha actual − fecha anterior` (RN-01 §4.3). | Mejorar (AGR-017: frontera explícita). | PRM-MED-026 | — |
| RN-MED-072 | El consumo del testigo para un intervalo es la suma de sus lecturas con fecha en (desde, hasta], mismo tipo de energía (activa y vacío equivalentes) y concepto; si el testigo no tiene lecturas se usa el consumo propio; solo sirve para elegir tramo (M04). | `ObtenerConsumoMedidorTestigo` (RN-01 §16). | Replicar; MED entrega ambos valores. | — | — |
| RN-MED-073 | Rango esperado de consumo = consumo de referencia ± tolerancia %, con referencia configurable (promedio móvil de N períodos válidos, mismo mes del año anterior, el mayor de ambos) y tolerancia por servicio/categoría; con mínimo absoluto para consumos chicos. | % global V2 439, referencia = último consumo (RN-06 §14.3, §21.7, Duda 11). | Mejorar (CTR-MED-12). | PRM-MED-020 a PRM-MED-024 | — |
| RN-MED-074 | Variación porcentual contra el período anterior = (actual / anterior − 1) × 100, con anterior 0 tomado como 1; el filtro "mayor", "menor" o "entre" se aplica sobre el valor absoluto salvo límite negativo; se descartan servicios con ambos consumos en 0. | `CalcularDiferenciaPorcentualConsumo` (RN-06 §23.7). | Replicar como regla de validación y como informe. | PRM-MED-047 | — |
| RN-MED-075 | Desvío de días: se marca si los días de lectura se desvían más de un % de los días esperados del ciclo. | `CalcularDiferenciaPorcentualDias` (RN-06 §23.7). | Replicar como regla. | PRM-MED-048 | — |
| RN-MED-076 | Reglas de validación con severidad configurable: consumo cero en conectado; negativo sin canal de inyección; fuera de rango; variación %; desvío de días; lectura repetida N períodos; dígitos; consumo en servicio desconectado; demanda > contratada; inyección sin GD; estimaciones consecutivas > N; falta factor de gas. | Solo umbrales informativos y filtros visuales (RN-06 §14.2–14.3); `Validar_ConsumoDesconectado` (INV). | Mejorar (CTR-MED-01). | PRM-MED-080 a PRM-MED-091 | — |
| RN-MED-077 | Una anomalía no es un error: toda excepción se resuelve con una decisión codificada (aprobar como real con justificación, corregir, relectura, estimar, inspección, bloquear) y queda auditada. | No existe flujo (BASE §9 criterio). | Nuevo (Informado). | — | — |
| RN-MED-078 | Un consumo con excepción bloqueante abierta no está disponible para liquidar; el servicio aparece "observado" en el lote de M05 con la causa. | No existe (BASE §9). | Nuevo (Informado). | — | — |
| RN-MED-079 | Aprobación automática de consumos sin excepciones (configurable); aprobación manual en los demás; doble control para ajustes por encima de un umbral de unidades. | No existe aprobación (BASE §9). | Nuevo (Adoptado). | PRM-MED-092, PRM-MED-093 | — |
| RN-MED-080 | Un consumo facturado es inmutable; cualquier cambio posterior se hace por ajuste que M05 documenta con NC/ND. | `ConsumoFacturado`: facturada = tiene factura o `FACTURADO = "F"`; `GetUltimoConsumoNoFacturado` (RN-06 §23.7). | Replicar + AGR-010. | — | — |
| RN-MED-081 | MED no registra consumos "ya facturados" fuera de M05. | `RegistrarConsumo` con tipo de comprobante asigna punto de venta y número (RN-06 §23.7). | Reemplazar: solo en migración, como consumo histórico vinculado a factura migrada. | — | — |
| RN-MED-082 | El cambio de categoría de un consumo solo se permite si no está facturado. | `Actualizar_CategoriaConsumo` (RN-06 §23.1). | Replicar. | — | — |
| RN-MED-083 | El informe de medidores sin leer agrega en 0 a los servicios conectados sin lectura del período, diferenciados de lecturas con consumo 0. | `Get_ControlMedidores` (RN-06 §23.7). | Replicar con marca explícita "sin lectura". | — | — |

### 6.5 Estimación y regularización

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-084 | Estimación por defecto = promedio simple de los últimos N períodos con consumo real (N ≤ 12), con o sin decimales; cadena de respaldo si no hay historia: mismo período del año anterior → promedio de la categoría → consumo mínimo del régimen → excepción "no estimable". | Promedio de N elegidos por el usuario; sin períodos divide por cero (RN-06 §15, Duda 2); V2 2466. | Mejorar (PA-MED-02). | PRM-MED-100 a PRM-MED-104 | — |
| RN-MED-085 | Toda estimación guarda método, base (períodos usados), motivo y autor; según parámetro requiere autorización. | Solo `ESTIMADO = 1` (RN-06 §15, §21.8). | Mejorar. | PRM-MED-105 | — |
| RN-MED-086 | Con "agregar días", la fecha estimada es la última lectura + 1 mes; las propiedades adicionales se suman. | `GuardarConsumosEstimados` (RN-06 §15). | Replicar. | — | — |
| RN-MED-087 | Se puede estimar dentro del lote y marcar registros como erróneos. | `GuardarEstimadoImpWork`, `SetearConErrorImpWork` (RN-06 §15). | Replicar. | — | — |
| RN-MED-088 | Quedan estimados: lecturas con observación que marca estimado, consumos adicionales, redistribuciones y primeros tramos de división por días máximos. | RN-06 §15, §16.3, §23.6; V2 PMovil 29. | Replicar; cada uno con su subtipo de origen. | PRM-MED-106 | V2 PMovil 29 sin uso directo en código. |
| RN-MED-089 | Regularización de estimados: se buscan los puntos cuya última lectura del rango fue estimada y que luego tuvieron lectura real; períodos a regularizar = meses entre el último período real y el último estimado; unidades = unidades por mes × períodos / (2 si el consumo estaba dividido, si no 1); redondeo alejándose de cero si no estaba dividido y bancario si lo estaba; filtros opcionales: solo telemedidas y solo medidor actual. El resultado es un ajuste en unidades que M04 aplica en la próxima liquidación ("Bonificación de N unidades"). | `clsBonificacionEstimados.Procesar` → `SERSOC.CONS_BONIF` y nota (RN-06 §15, §23.7). | Mejorar: ajuste aprobado y trazable; método configurable por servicio (compensación de unidades o refacturación) (PA-MED-01). | PRM-MED-107 | Uso en energía (Duda 12). |
| RN-MED-090 | Un punto con más de N estimaciones consecutivas genera solicitud de inspección/relectura obligatoria a M10. | No existe. | Nuevo (A validar PA-MED-07). | PRM-MED-108 | — |

### 6.6 División, prorrateo, distribución

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-091 | Se divide en dos períodos una lectura que abarca más del 110 % y menos del 300 % de los días del período; los tramos se agrupan (grupo y segmento 1/2). | `DividirConsumos` (RN-06 §16.1). | Replicar con umbrales parametrizables. | PRM-MED-110, PRM-MED-111 | — |
| RN-MED-092 | Modo mitades: el consumo se divide en dos partes iguales. | `DividirConsumoMitad` (RN-06 §16.1). | Replicar. | — | — |
| RN-MED-093 | Modo días máximos: consumo diario = total / días; primer tramo = días del período (marcado estimado); segundo tramo = resto; con "limitar consumo" se descarta el segundo tramo; el estado intermedio = anterior + tramo / factor. | `DividirXdiasMaximo` (RN-06 §23.6). | Replicar; el excedente descartado queda registrado como "no liquidado" con motivo. | PRM-MED-112 | — |
| RN-MED-094 | Cambio de medidor en el período: se completa el período con el consumo diario del medidor nuevo (o se recorta el del viejo si se pasó de días) y el resto pasa al período siguiente; el período suma ambos tramos. | `DividirXdiasMaximoCambioMedidor` (RN-06 §12.3, §23.6). | Replicar. | — | — |
| RN-MED-095 | Prorrateo: consumo = consumo × porcentaje / días de la lectura, redondeado hacia abajo a 3 decimales; el original queda como neto. | `RealizarProrrateo` (RN-06 §23.6). | Replicar. | — | — |
| RN-MED-096 | Los puntos con múltiples canales/medidores (grandes usuarios) quedan excluidos de la división automática y se tratan manualmente. | Exclusión (RN-06 §16.1). | Replicar con exclusión visible. | — | — |
| RN-MED-097 | Distribución padre-hijos: por porcentaje (redondeado a 2 decimales, suma 100 %), igualada (el último hijo absorbe la diferencia) o combinada con tope por hijo; cada hijo recibe consumo estimado "Redistribución de consumo" y el padre un consumo negativo compensatorio con el mismo número de distribución; no se graba el padre si su consumo es 0. | `DST_CONSUMO`, `Guardar_ConsumosDistribuidos`, `Get_ConsumosDistribuidos` (RN-06 §16.3, §23.7). | Replicar. | — | — |
| RN-MED-098 | En la combinada, si el consumo del padre supera el tope, la distribución no se ejecuta en silencio: se genera excepción para decisión del analista. | Si supera `TOPE`, no reparte (RN-06 §16.3). | Mejorar (CTR-MED-16). | — | — |
| RN-MED-099 | No se distribuye a grandes usuarios, a servicios no conectados ni a servicios de otro tipo; un hijo no puede pertenecer a dos distribuciones; no se distribuye dos veces en el mismo período (o mes, según parámetro, validando por fechas de lectura). | RN-06 §16.3, §23.7; V2 2618. | Replicar. | PRM-MED-113 | — |
| RN-MED-100 | La reversión de una distribución anula los consumos de hijos y padre de esa ejecución sin tocar el último estado de lectura. | `EliminarDistribucion` borra hijos con el mismo número grabados con un minuto de diferencia (RN-06 §23.7). | Mejorar: identificación por `distributionRunId`, no por minuto. | — | — |

### 6.7 Demanda y transgresiones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-101 | La demanda contratada se guarda por punto, canal y período; M04 factura la mayor entre contratada y registrada según la tarifa. | `CON_BASE`, `SERSOC_DEMANDASXPERIODO` (RN-06 §17). | Replicar (el criterio de facturación es M04). | — | — |
| RN-MED-102 | % de transgresión = demanda × 100 / contratada − 100; se registra primera transgresión, demanda declarada y fecha; la revisión toma los consumos facturados de conceptos de demanda (DP, DV, DFP) de los últimos 6 meses de servicios con primera transgresión registrada. | `clsTransgresiones` (RN-06 §17, §23.7). | Replicar; ventana parametrizable. | PRM-MED-120, PRM-MED-121 | — |
| RN-MED-103 | El reset de la demanda declarada a la contratada requiere aprobación y deja auditoría "RESET_DEM" con el valor anterior. | `Procesar` resetea `DEC_CON = CON_BASE` (RN-06 §23.7). | Mejorar (aprobación T11). | — | — |

### 6.8 Telemedición, prepago y generación distribuida

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-104 | Los comandos de corte y reconexión remota solo se ejecutan a pedido de una orden vigente de M08 (mora) o M10/M09 (técnica/atención) tras el circuito de BASE §68; el estado del servicio cambia solo con confirmación del resultado. | `CorteServicio`/`ReconexionServicio`; `TELEMED_COMM` (RN-06 §19.1; BASE §97.5). | Replicar con contrato asíncrono (CTR-MED-08). | PRM-MED-130 | — |
| RN-MED-105 | Las llamadas al proveedor son asíncronas con reintentos e idempotencia; una falla no deja abierta la OT ni una transacción: la operación queda "pendiente en proveedor". | Al cerrar una OT se llama al proveedor antes de confirmar; si falla, la OT queda abierta (RN-06 §19.1). | Reemplazar (DEC-003, AGR-016). | PRM-MED-131, PRM-MED-132 | — |
| RN-MED-106 | Tres familias separadas: medición (toma de estado y ciclo del medidor), prepago (crédito/token) y aprovisionamiento ISP/TV. MED gestiona las dos primeras; la tercera es de M10. | Una sola fábrica `SistemaTelemedicion` para todo (RN-06 §19.1–19.2, §21.11). | Reemplazar (CTR-MED-14). | — | — |
| RN-MED-107 | Catálogo de operaciones del contrato de conector: configuración, alta, cambio de categoría, asignación de medidor, retiro, cambio de medidor, confirmación de OT, corte, reconexión, toma de estado (por servicio, por OT, por lista), propiedades de lectura, validar preventa, carga de crédito, estado de carga, historial de cargas, generar OT, auditoría. Cada conector declara cuáles soporta. | `SistemaTelemedicion` (RN-06 §19.1). | Replicar (contrato en T06). | — | — |
| RN-MED-108 | Cada llamada se audita con solicitud y respuesta saneadas (sin credenciales ni datos personales innecesarios). | `AUDITORIA_TELEMEDICION` (CAT §3). | Mejorar (saneado). | PRM-MED-133 | — |
| RN-MED-109 | Las credenciales de los sistemas se guardan en la bóveda del tenant. | `TELEMEDICION.USER_TEL/PASS_TEL` en la base (CAT §3; RN-10 §9). | Reemplazar (CTR-MED-10). | — | — |
| RN-MED-110 | Un punto prepago no se lee para facturar en el ciclo pospago ni se incluye en el lote de facturación; su facturación ocurre por recarga (M04 §4.8). | `EsServicioPrepago`; rutas excluyen prepagas (RN-06 §13.1, §23.7; RN-01 §4.8). | Replicar. | — | — |
| RN-MED-111 | Flujo de recarga: validar preventa → M07 cobra → MED solicita crédito/token → entrega → confirma estado; si falla tras cobrar, queda en bandeja con reintento idempotente o devolución (M07, AGR-013). | `ValidarPrepaga`, `RegistroVentaPrepagaTelemed`, `CargaCreditoPrepago`, `EstadoCargaCredito` (RN-06 §19.1–19.2; FIC 10.3). | Mejorar. | PRM-MED-134, PRM-MED-135 | — |
| RN-MED-112 | El redondeo de unidades de la recarga lo define el tipo de medidor. | `TIPMED.REDONDEO_PREPAGA` (CAT §3). | Replicar. | — | — |
| RN-MED-113 | Aviso de saldo bajo cuando el saldo informado o los días estimados restantes caen bajo el umbral. | No hay regla en código (BASE §97.5). | Nuevo (Informado). | PRM-MED-136 | — |
| RN-MED-114 | Particularidades Discar: número de contrato = cuenta (V2 2504) o "Id cliente" (V2 2336); validación de preventa (V2 2594); reglas al confirmar ciertas OT (V2 3116); registros activa/reactiva T0..T6 y demanda máxima ÷1000; máximo de hasta 3 registros. | RN-06 §19.2, §20. | Replicar como configuración del conector Discar (T06). | PRM-MED-140 a PRM-MED-143 | V2 3116 semántica (Duda 10). |
| RN-MED-115 | Particularidades NEXO: reconexión forzada del socket (V2 2491), segundos entre reintentos con 5 intentos (V2 2370). | RN-06 §19.2, §20. | Reemplazar por política de reintentos genérica del conector (T06) con valores por defecto equivalentes. | PRM-MED-131, PRM-MED-132 | — |
| RN-MED-116 | El sistema "Partner" no está implementado. | La fábrica devuelve null (RN-06 §19.2, Duda 5). | Descartar (no se desarrolla sin un cliente que lo use). | — | Duda 5. |
| RN-MED-117 | La inyección se mide en canal propio de energía recibida con contrato GD vigente; neto = demandada − inyectada por período; MED entrega ambos y el bruto "sin inyectada" para consumo mínimo, cargo fijo por trama y coseno fi (M04). | Inyección = lectura activa con consumo negativo y factor negativo o indicado; V2 3094 concepto de crédito; V2 2737 coseno fi; V2 3103 cargo fijo (RN-06 §18; RN-01 §4.6). | Reemplazar el modelo (CTR-MED-04); V2 3094, 2737, 3103 pasan a M04/M05. | — | Duda 9. |
| RN-MED-118 | El contrato GD sigue al suministro: cambio de titular y baja se aplican juntos; la baja exige lectura final de ambos canales. | No existe (MER-001). | Nuevo (Informado). | — | — |

### 6.9 Medición propia, cambio de clase y transversales

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MED-119 | La medición propia registra seis registros fijos (pico, resto, valle, punta, fuera de punta, reactiva); compra activa = pico + resto + valle; cos φ = cos(atan(reactiva / activa)); pérdida = compra − consumo facturado del servicio en el período; % pérdida = pérdida × 100 / compra; variantes anual (13 períodos) y por zonas. | `MEDIDORP`, `CONSUMOP`, `Get_Informe_Perdidas` (RN-06 §23.7). | Replicar; los registros son canales configurables. | — | — |
| RN-MED-120 | El servicio de la medición propia se declara explícitamente. | `GuardarMedidorP` supone energía = servicio 1 (RN-06 §23.7, Duda 23). | Reemplazar. | — | Duda 23. |
| RN-MED-121 | La compra de energía no se convierte en recargo al usuario. | BASE §87. | Informado. | — | — |
| RN-MED-122 | Propuesta de cambio de clase por consumo: solo socios activos sin otro servicio conectado del mismo tipo; tipo 1 excluye si el último consumo no facturado o 4 meses superan el máximo; tipo 2 exige domicilio del servicio igual al de la cuenta y excluye si el último mes supera el máximo; ambos excluyen 4 meses seguidos en 0. | `Get_ServiciosClase`, `CambiarClaseServicio` (RN-06 §23.1, Duda 21). | Mejorar: reglas declarativas y aprobación (PA-MED-10). | — | Duda 21. |
| RN-MED-123 | Toda lectura, instalación, consumo y ajuste guarda fecha efectiva, fecha de registro y origen; las consultas históricas declaran qué fecha interpretan. | No existe distinción (AGR-010). | Adoptado. | — | — |
| RN-MED-124 | Calendarios distintos para lectura, liquidación, emisión y vencimiento; fronteras de días y zona horaria del tenant; meses cortos y años bisiestos con resultado reproducible. | No existe (AGR-017). | Adoptado. | PRM-MED-026 | — |
| RN-MED-125 | Las tareas descargadas están versionadas; al sincronizar, si la versión del servidor cambió, la lectura se recibe igual y se genera conflicto con ambas evidencias y responsable; no se sobrescriben medidores ni titulares modificados. | No existe (AGR-025). | Adoptado. | — | — |
| RN-MED-126 | El aislamiento entre tenants es total: lecturas, fotos y GPS llevan `tenantId`; no existe base compartida entre cooperativas. | Base MySQL de la app compartida entre cooperativas separada por `COD_SUM` (RN-06 §13.3, Duda 13). | Reemplazar (DEC-002, CTR-MED-07). | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


**Campos comunes** a todas las colecciones de negocio (no se repiten): `TenantId` (uniqueidentifier, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista), `deletedAt` (solo catálogos y configuración; lecturas, consumos, instalaciones y ajustes **nunca** se borran: se anulan o se reemplazan por versión). Cuando un documento representa un hecho, lleva `effectiveAt` (fecha efectiva del hecho) y `recordedAt` (fecha de registro en el sistema) (AGR-010). Las cantidades físicas (estados, consumos, demanda, factores) se guardan como `DECIMAL(18,4)` y se operan con `decimal.js` igual que el dinero, para evitar errores de coma flotante en acumulados y factores. Los importes (prepago) siguen la convención de dinero.

### 7.1 Catálogos

**`meterBrands`** — marcas de medidor. Origen: `MARMED`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código interno. |
| `name` | String | Sí | Nombre (`DES_MAR`). |
| `serviceIds` | [uniqueidentifier] | Sí | Servicios a los que aplica (`COD_SER`). Antes `utilityCodes` (nombre de T05). |
| `status` | enum `active`/`inactive` | Sí | — |

Índices: `{tenantId, code}` único.

**`meterTypes`** — tipos/modelos de medidor. Origen: `TIPMED`, `ESPE_MED`, columnas de modelo de `DISPOSI`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código (`COD_TIP`). |
| `name` | String | Sí | Descripción (`DES_TIP`). |
| `serviceId` | uniqueidentifier | Sí | Servicio (`COD_SER`). Antes `utilityCode` (nombre de T05). |
| `brandId` | uniqueidentifier → `meterBrands` | No | Marca (`COD_MAR`). |
| `model` | String | No | Modelo (ej. "Galileo"). |
| `phases` | enum `single`/`three`/`na` | No | Monofásico/trifásico (`MONOTRI`). |
| `multiTariff` | Boolean | No | Multitarifa (`MULTITA`). |
| `accuracyClass` | String | No | Clase de exactitud. |
| `defaultDigits` | Int | Sí | Dígitos por defecto. |
| `defaultMultiplier` | DECIMAL(18,4) | Sí | Factor por defecto (> 0). |
| `registers` | [{`code`, `quantity` enum (ver `meteringChannels.channelType`), `unit`, `touBand`, `digits`, `multiplier`, `indicated`}] | Sí | Registros que el modelo expone. |
| `isPrepaid` | Boolean | Sí | Prepago (`PREPAGO`). |
| `prepaidRounding` | {`mode` enum `none`/`floor`/`round`/`ceil`, `decimals` Int} | No | `REDONDEO_PREPAGA`. |
| `isTelemetered` | Boolean | Sí | — |
| `meteringSystemId` | uniqueidentifier → `meteringSystems` | Cond. | Obligatorio si telemedido o prepago remoto (`SIS_TEL`, `CONEX_SIST`). |
| `isBidirectional` | Boolean | Sí | Apto para generación distribuida. |
| `allowsIndicated` | Boolean | Sí | Inverso de `NOINDICADO`. |
| `availableForInstall` | Boolean | Sí | `DISPONIBLE`. |
| `supplyType` | String | No | `TIPO_SUM`. |
| `inventoryItemId` | uniqueidentifier (M13) | No | Producto de stock asociado (`COD_PRO`). Antes `stockProductRef` (nombre de T05). |
| `status` | enum `active`/`inactive` | Sí | — |

Índices: `{tenantId, code}` único; `{tenantId, serviceId, status}`.

**`readingObservationCodes`** — observaciones de lectura. Origen: `OBSESTAD`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | `COD_OBS`. |
| `name` | String (clave `dict:`) | Sí | `DES_OBS`. |
| `helpText` | String | No | `TEXTO`. |
| `serviceIds` | [String] | Sí | `COD_SER`. |
| `effect` | enum `none`/`markEstimated`/`notRead`/`requestWorkOrder`/`suspicion` | Sí | Efecto al confirmar. |
| `workOrderTransactionCode` | String | Cond. | Tipo de OT a pedir a M10 (`GENERA_OT`, `COD_TRAN`). |
| `markEstimated` | Boolean | Sí | `MARCAR_ESTIMADO`. |
| `photoRequired` | Boolean | Sí | `FOTO`. |
| `blocksReading` | Boolean | Sí | Si es verdadero, la tarea no admite estado (ej. inaccesible). |
| `status` | enum | Sí | — |

**`readingResultCodes`** — resultados de lectura. Origen: `RESESTAD` (`DES_RSU`, `CONFIRMA`). Campos: `code`, `name`, `confirms` (Boolean: la lectura con este resultado es confirmable), `status`.

Campos de `readingResultCodes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `confirms` | bool | [VERIFICAR] | Boolean: la lectura con este resultado es confirmable | — |
| `status` | enum | Sí | — | — |

**`readingConditionCodes`** — certificados/estados de lectura. Origen: `CERESTAD` (`COD_CER`, `DES_CER`). Campos: `code`, `name`, `status`. **[VERIFICAR]** uso exacto de `CERESTAD` en una base real; se conserva como catálogo auxiliar de condición de la lectura (ej. "lectura certificada por el socio", "lectura con testigo").

Campos de `readingConditionCodes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `status` | enum | Sí | **[VERIFICAR]** uso exacto de `CERESTAD` en una base real; se conserva como catálogo auxiliar de condición de la lectura (ej. "lectura certificada por el socio", "lectura con testigo") | — |

**`meterObservationCodes`** — observaciones de medidor. Origen: `OBSMED` (`DES_OBS`, `TIP_OBS`). Campos: `code`, `name`, `category` (texto de `TIP_OBS`), `status`.

Campos de `meterObservationCodes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `category` | [VERIFICAR] | [VERIFICAR] | Texto de `TIP_OBS` | — |
| `status` | enum | Sí | — | — |

### 7.2 Medidores e instalaciones

**`meters`** — ficha metrológica del medidor. Origen: `DISPOSI`, campos de medidor de `SERSOC` (`NUM_MED`, `DIG_MED`, `FAC_MED`, `INDICADO`, `LECTURA_CON_FACTOR`, `TIP_MED`, `COD_PROP`, `COD_PTH`, `ID_SYS_TEL`), `DatosDeMedidor`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | String | Sí | Número de medidor (`NUM_MED`); se conserva texto original (con ceros). |
| `factorySerial` | String | No | Matrícula/serie de fábrica (`MAT_MED`). |
| `serviceId` | String | Sí | Servicio. |
| `meterTypeId` | uniqueidentifier → `meterTypes` | Sí | — |
| `brandId` | uniqueidentifier → `meterBrands` | Sí | — |
| `manufactureYear` | Int | No | `ANO_MED`. |
| `class` | String | No | `CLA_MED`. |
| `digits` | Int | Sí | > 0. |
| `multiplier` | DECIMAL(18,4) | Sí | > 0. |
| `indicated` | Boolean | Sí | — |
| `readingIncludesMultiplier` | Boolean | Sí | — |
| `hp` | String | No | Dato "HP" de la ficha ProCoop (hilos/fases) **[VERIFICAR]** significado. |
| `bonusUnits` | DECIMAL(18,4) | No | Unidades bonificadas de la ficha (DFA M5); M04 decide su efecto. |
| `registers` | [{`code`, `channelType`, `unit`, `touBand`, `digits`, `multiplier`, `indicated`}] | Sí | Copia de los registros del tipo, editable. |
| `ownership` | enum `cooperative`/`member`/`communal` | Sí | `COD_PROP`. |
| `isPrepaid` | Boolean | Sí | — |
| `isTelemetered` | Boolean | Sí | — |
| `remoteIds` | [{`meteringSystemId`, `externalId`}] | No | `ID_SYS_TEL`. |
| `serialUnitId` | uniqueidentifier (M13 `serialUnits`; T05 §7.2) | Cond. | Obligatorio si el servicio registra stock. |
| `assetStatus` | enum `available`/`installed`/`removed`/`inRepair`/`discarded` | Sí | Proyección de M13 + instalación. |
| `currentInstallationId` | uniqueidentifier → `meterInstallations` | No | Derivado. |
| `observations` | [{`codeId`, `text`, `at`, `by`}] | No | `OBSMED`. |
| `lastTest` | {`testId`, `result`, `at`} | No | Derivado de `meterTests`. |
| `documents` | [uniqueidentifier] (expediente T11) | No | Fotos, certificados. Referencia: → `documents` (T11). |

Índices: `{tenantId, serviceId, brandId, number}` único (configurable a `{tenantId, serviceId, number}`, PRM-MED-001); `{tenantId, serialUnitId}` único parcial; `{tenantId, assetStatus}`.

**`meteringPoints`** — punto de medición. Origen: `SERSOC` (servicio con medidor: zona/sector/recorrido de lectura, GPS, observación postal, `CON_ANT`, `EST_LEC`, `FEC_LEC`), `MED_TESTIGO`, `MEDIDORP`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código visible del punto. |
| `pointType` | enum `customer`/`witness`/`purchase`/`boundary`/`internal`/`distributionParent` | Sí | Rol del punto. |
| `serviceId` | String | Sí | Servicio. |
| `contractId` | uniqueidentifier (M02 `serviceContracts`; CTR-DAT-71) | Cond. | Obligatorio en `customer` y `distributionParent` de cliente. |
| `accountId` | uniqueidentifier (M01) | Cond. | Desnormalizado para búsquedas. |
| `premiseId` | uniqueidentifier (M01) | No | Inmueble. |
| `location` | GeoJSON Point | No | GPS. |
| `accessNotes` | String | No | Observación postal / acceso. |
| `reading` | {`zone` String, `sector` String, `sequence` Int, `routeIds` [uniqueidentifier]} | Cond. | ZSR (ej. zona 30, sector 1, recorrido 250). Referencia: `routeIds` → `readingRoutes` (M03); el resto no es referencia. |
| `consumptionMode` | enum `accumulated`/`indicated` | Sí | — |
| `isPrepaid` | Boolean | Sí | Derivado de la categoría (M02). |
| `isTelemetered` | Boolean | Sí | Derivado del medidor instalado. |
| `hasDistributedGeneration` | Boolean | Sí | Derivado de `distributedGenerationContracts`. |
| `witnessPointId` | uniqueidentifier → `meteringPoints` | No | Testigo asignado (`SERSOC_EXTRAS.COD_TES`). |
| `witnessExcluded` | Boolean | No | `MED_TESTIGO.NO_INCLUIR`. |
| `description` | String | No | `MED_TESTIGO.DESCRIPCION`. |
| `status` | enum `pending`/`active`/`withoutMeter`/`suspended`/`closed` | Sí | — |
| `lastValues` | [{`channelId`, `readingId`, `value`, `effectiveAt`, `consumption`}] | No | Proyección (no editable). |
| `consecutiveEstimates` | Int | No | Proyección. |
| `servicePointId` | uniqueidentifier | [VERIFICAR] | Punto de prestación (T05 lo declara en claves; la ficha no lo tenía). Referencia: `servicePoints` (M01). |

Índices: `{tenantId, code}` único; `{tenantId, contractId}`; `{tenantId, serviceId, reading.zone, reading.sector, reading.sequence}`; `{tenantId, location}` 2dsphere; `{tenantId, pointType}`.

**`meteringChannels`** — canales de medición del punto. Origen: `MEDSOC` (`TIP_ENE`, `COD_CON`, `CONTRATADO`, `CON_TOT`, `FAC_MED`, `INDICADO`), `HIS_MEDSOC`, `LEC_MEDTEL.TIP_ENE`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` | uniqueidentifier | Sí | — |
| `channelType` | enum `activeImport`/`activeExport`/`reactiveImport`/`reactiveExport`/`demandPeak`/`demandOffPeak`/`demandValley`/`demandMax`/`energyPeak`/`energyRest`/`energyValley`/`energyPunta`/`energyFueraPunta`/`waterVolume`/`gasVolume`/`generation`/`other` | Sí | `TIP_ENE`: A → `activeImport` (o `activeExport` si factor negativo en migración), R → `reactiveImport`, DP → `demandPeak`, DFP → `demandOffPeak`, DV → `demandValley`. |
| `unit` | enum `kWh`/`kVArh`/`kW`/`m3`/`unit` | Sí | — |
| `touBand` | String | No | Banda/franja (T0..T6, pico/resto/valle). |
| `conceptId` | uniqueidentifier (M02 `billableConcepts`; T05 §7.2) | Cond. | `COD_CON`. |
| `contractedValue` | DECIMAL(18,4) | No | `CONTRATADO` (demanda contratada vigente; la historia está en `demandDeclarations`). |
| `order` | Int | Sí | Orden por concepto (V2 2520). |
| `isBillable` | Boolean | Sí | Falso para `generation` informativa. |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia del canal. |
| `status` | enum `active`/`closed` | Sí | — |

Índices: `{tenantId, meteringPointId, channelType, touBand, validFrom}` único.

**`meterInstallations`** — instalaciones (colocación/retiro). Origen: `HIS_MEDSOC`, `MEDSOC` (`FEC_LEC` inicial), `SERSOC.RETIRADO`, OT de cambio.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meterId` | uniqueidentifier | Sí | — |
| `meteringPointId` | uniqueidentifier | Sí | — |
| `role` | enum `main`/`control` | Sí | `control` permite paralelo (RN-MED-018). |
| `installedAt` | Date | Sí | Fecha efectiva de colocación. |
| `removedAt` | Date | No | Fecha efectiva de retiro. |
| `recordedAt` / `removalRecordedAt` | Date | Sí / No | Fechas de registro. |
| `registerMapping` | [{`registerCode`, `channelId`, `digits`, `multiplier`, `indicated`, `readingIncludesMultiplier`}] | Sí | Registro → canal. |
| `initialReadingIds` / `finalReadingIds` | [uniqueidentifier → `meterReadings`] | Sí / Cond. | Lecturas de colocación y retiro. |
| `installReason` | enum `newService`/`replacement`/`reconnection`/`migration`/`other` | Sí | — |
| `removalReason` | enum `replacement`/`disconnection`/`termination`/`theft`/`damage`/`test`/`other` | Cond. | — |
| `workOrderRefs` | {`installWorkOrderId`, `removalWorkOrderId`} (M10) | No | OT de origen. |
| `categoryChangeRef` | {`categoryId`, `effectiveAt`} | No | Categoría nueva informada por la OT (`N_COD_CAT`). |
| `status` | enum `active`/`closed`/`voided` | Sí | — |
| `voidReason` | String | Cond. | — |

Índices: `{tenantId, meterId, status}` con único parcial `status = active`; `{tenantId, meteringPointId, installedAt}`.

> **Alineación con T05 (05-11-2026):** T05 usa `workOrderId`; la ficha lo desdobla en `installWorkOrderId` y `removalWorkOrderId` (`workOrders`, M10). Se informa a T05.

**`meterSeals`** — precintos. Origen: nuevo (BASE §7). **Reemplazado por `seals` de M10 (CTR-DAT-60 de T05):** la colección de precintos es del trabajo de campo; M03 la referencia por `sealId` desde la instalación y no crea `meterSeals`. Se conserva la definición original como referencia de campos.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `sealNumber` | String | Sí | — |
| `sealType` / `color` / `position` | String | No | — |
| `meterId` / `installationId` | uniqueidentifier | Sí | — |
| `placedAt` / `removedAt` | Date | Sí / No | — |
| `status` | enum `placed`/`removed`/`broken`/`missing` | Sí | — |
| `workOrderId` / `inspectionActId` | uniqueidentifier (M10) | No | — |
| `photoIds` | [uniqueidentifier] | No | — |

Índices: `{tenantId, sealNumber}` con único parcial `status = placed`.

**`meterTests`** — ensayos/contrastes. Origen: nuevo (BASE §7).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meterId` | uniqueidentifier | Sí | — |
| `testedAt` | Date | Sí | — |
| `testType` | enum `factory`/`periodic`/`onClaim`/`afterRepair`/`other` | Sí | — |
| `laboratory` / `responsible` | String | No | — |
| `result` | enum `approved`/`rejected`/`withObservations` | Sí | — |
| `measuredError` | [{`loadPoint`, `errorPercent` DECIMAL(18,4)}] | No | — |
| `certificateDocId` | uniqueidentifier | No | — |
| `crmCaseId` | uniqueidentifier (M09) | No | Reclamo que motivó el ensayo. Antes `claimRef` (nombre de T05). |

### 7.3 Rutas, cronogramas, lotes y tareas

**`readingRoutes`** — rutas de lectura. Origen: `CONNRUTA` (`RUTA`, `DES_RUTA`, `COD_SER1..4`, `REC_CAL`, `ZONAS`, `ZONA`, `SECTOR`, `ZON_DES`, `SEC_DES`, `REC_DES` y 17 columnas más), `CONNZONA`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` / `name` | String | Sí | — |
| `serviceIds` | [String] | Sí | Servicios. |
| `selection` | {`mode` enum `zoneSectorSequence`/`street`/`accountRange`/`polygon`, `zones` [String], `sectorFrom`, `sectorTo`, `sequenceFrom`, `sequenceTo`, `streets` [{`streetId`, `numberFrom`, `numberTo`, `parity` enum `all`/`even`/`odd`}], `accountFrom`, `accountTo`, `polygon` GeoJSON} | Sí | `REC_CAL`, `ORD_CAL`. |
| `categoryIds` | [uniqueidentifier] (M02) | No | Filtro opcional. |
| `order` | enum `default`/`holder`/`streetNumber`/`zoneSequence`/`lastReaderOrder`/`manual` | Sí | `ORDEN`. |
| `includeDisconnectedNotRemoved` | Boolean | Sí | `SERV_DESC`. |
| `telemeteredFilter` | enum `only`/`exclude`/`all` | Sí | `TELEMED`. |
| `includePrepaidForControl` | Boolean | Sí | Default falso. |
| `defaultReaderIds` | [uniqueidentifier] | No | — Referencia: → `memberships` (T02): usuario de la app de campo del lecturista, confirmado en PA-MED-15 (DEC-072; antes [VERIFICAR]). |
| `deviceFields` | [String] | No | Campos que se envían al dispositivo (sobrescribe el default del servicio). |
| `status` | enum | Sí | — |

**`readingCalendars`** — cronograma. Origen: nuevo (MER-018).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `serviceId` | String | Sí | — |
| `cycleCode` | String | Sí | Ciclo (vincula con calendario de facturación de M05). |
| `period` | String `YYYY-MM` | Sí | Período de consumo. |
| `entries` | [{`routeId`, `plannedDate`, `windowFrom`, `windowTo`, `selfReadingFrom`, `selfReadingTo`, `readerIds`}] | Sí | — |
| `autoGenerateBatches` | Boolean | Sí | — |
| `status` | enum `draft`/`published`/`closed` | Sí | — |

**`readingBatches`** — lotes de lectura. Origen: agrupación de `IMP_WORK` por `RUTA` y período; `IMP_WORK.CONFIRMADO`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | — |
| `routeId` | uniqueidentifier | Cond. | Nulo en lotes de importación de archivo o telemedición puntual. |
| `period` | String | Sí | — |
| `source` | enum `fieldApp`/`fileExport`/`fileImport`/`telemetry`/`manual`/`selfReadingWindow` | Sí | — |
| `assignments` | [{`readerId`, `taskCount`, `assignedAt`}] | No | — |
| `counters` | {`total`, `pending`, `read`, `notRead`, `outOfRange`, `withPhoto`, `conflicts`, `confirmed`, `rejected`, `estimated`} | Sí | Proyección. |
| `status` | enum `generated`/`assigned`/`downloaded`/`inProgress`/`received`/`inReview`/`confirmed`/`closed`/`cancelled` | Sí | — |
| `closingReport` | {`closedAt`, `closedBy`, `summary`, `pendingDecision` enum `estimate`/`reread`/`leaveUnread`} | No | Acta de cierre. |
| `jobRefs` | [uniqueidentifier] | No | Jobs ejecutados. |

Índices: `{tenantId, routeId, period}` único parcial para `status ≠ cancelled`.

**`readingTasks`** — tareas de lectura. Origen: `IMP_WORK` (37+ columnas: `COD_SUM`, `COD_SER`, `EST_ACT`, `FEC_ACT`, `CONSUMO`, `EST_ANT`, `FEC_ANT`, `CONSANT`, `RUTA`, `DIG_MED`, `INDICADO`, `NUM_MED`, umbrales, `ESTIMADO`, GPS), `HISWORK` (histórico).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `batchId` | uniqueidentifier | Sí | — |
| `meteringPointId` / `channelId` / `meterId` / `installationId` | uniqueidentifier | Sí | Snapshot al generar. |
| `sequence` | Int | Sí | Orden en la ruta. |
| `snapshot` | {`previousReadingId`, `previousValue`, `previousAt`, `previousConsumption`, `digits`, `multiplier`, `indicated`, `meterNumber`, `categoryCode`, `address`, `accessNotes`, `zone`, `sector`, `readingSequence`, `cadastral`, `blockLot`, `ownership`, `serviceStatus`, `registration`} | Sí | Datos enviados al dispositivo (según campos habilitados). |
| `expectedRange` | {`min`, `max`, `basis` enum, `tolerancePercent`} | Sí | `UMB_MIN`/`UMB_MAX`. |
| `flags` | {`realReadingPriority`, `photoRequired`, `isWitness`} | Sí | V2 2559. |
| `assigneeId` | uniqueidentifier | No | Lecturista. |
| `taskVersion` | Int | Sí | Versión para conflictos (AGR-025). |
| `downloadedAt` / `deviceId` | Date / uniqueidentifier (antes String) | No | Referencia: `deviceId` → `fieldDevices` (M10), PA-MED-15 (DEC-072). |
| `status` | enum `pending`/`assigned`/`downloaded`/`captured`/`notRead`/`estimated`/`confirmed`/`rejected`/`conflict`/`cancelled` | Sí | — |
| `capturedReadingId` | uniqueidentifier | No | — Referencia: `meterReadings` (M03). |
| `rejectionReason` | String | Cond. | Causa de R. |

Índices: `{tenantId, batchId, sequence}`; `{tenantId, assigneeId, status}`; `{tenantId, meteringPointId, batchId}` único.

**`readerWorkSessions`** — jornadas y productividad del lecturista. Origen: `SU_HORAS_LECTOR`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `readerId` | uniqueidentifier (persona/empleado) | Sí | — Referencia: → `memberships` (T02): usuario de la app de campo del lecturista; el legajo, si es empleado, se obtiene de la membresía (PA-MED-15, DEC-072; antes [VERIFICAR]). |
| `date` | Date | Sí | — |
| `startedAt` / `endedAt` | Date | Sí / No | — |
| `batchIds` | [uniqueidentifier] | No | — |
| `tasksDone` / `distanceKm` | Int / DECIMAL(18,4) | No | Derivados. |
| `source` | enum `app`/`manual` | Sí | — |

### 7.4 Lecturas y consumos

**`meterReadings`** — lecturas capturadas y validadas. Origen: `CONS_SER` (`FEC_ANT`, `EST_ANT`, `FEC_ACT`, `EST_ACT`, `COD_MED`, observación, GPS, fotos), `CONS_SER_TESTIGO`, `IMP_WORK` (`EST_ACT`, `FEC_ACT`), lecturas de OT, `HIS_MEDSOC.EST_LEC`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` / `channelId` / `meterId` / `installationId` | uniqueidentifier | Sí | — |
| `registerCode` | String | Sí | — |
| `rawValue` | DECIMAL(18,4) | Cond. | Valor recibido (puede venir con factor). |
| `value` | DECIMAL(18,4) | Cond. | Valor normalizado (rawValue ÷ factor si lectura con factor). Nulo si no leído. |
| `effectiveAt` | Date | Sí | Fecha y hora de la lectura. |
| `recordedAt` | Date | Sí | Recepción en servidor. |
| `deviceAt` | Date | No | Hora del dispositivo. |
| `source` | enum `manual`/`fieldApp`/`collectorFile`/`thirdPartyFile`/`telemetry`/`selfReading`/`workOrder`/`migration` | Sí | — |
| `purpose` | enum `periodic`/`installation`/`removal`/`verification`/`additional`/`control` | Sí | — |
| `readingTaskId` / `batchId` / `importJobId` / `workOrderId` | uniqueidentifier | No | — |
| `readerId` / `memberUserId` | uniqueidentifier | No | Quién relevó. |
| `notRead` | {`observationCodeId`, `text`} | Cond. | Motivo si no hubo lectura. |
| `observationCodeIds` | [uniqueidentifier] | No | — |
| `resultCodeId` / `conditionCodeId` | uniqueidentifier | No | `RESESTAD`, `CERESTAD`. |
| `gps` | {`location` GeoJSON, `accuracyM`, `distanceToPointM`} | No | — |
| `photoIds` | [uniqueidentifier] | No | Expediente (fotos). Referencia: → `storedFiles` (T01). |
| `deviceWarnings` | [String] | No | Advertencias mostradas al lecturista. |
| `reentryConfirmed` | Boolean | No | — |
| `status` | enum `captured`/`validated`/`rejected`/`superseded`/`redundant`/`voided` | Sí | — |
| `rejectionReasons` | [String] | No | — |
| `supersedesId` / `supersededById` | uniqueidentifier | No | Cadena de versiones. |
| `correctionReason` | String | Cond. | — |
| `rolloverConfirmed` | {`by`, `at`} | No | — |
| `clientMutationId` | String | Cond. | Idempotencia offline. |
| `externalRef` | {`meteringSystemId`, `externalReadingId`} | No | Telemedición. |

Índices: `{tenantId, clientMutationId}` único parcial; `{tenantId, channelId, effectiveAt, status}`; `{tenantId, meterId, registerCode, effectiveAt, source}` (deduplicación); `{tenantId, batchId}`.

**`consumptions`** — consumos por canal e intervalo. Origen: `CONS_SER` (`COD_CONS`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_SER`, `COD_SUM`, `COD_CAT`, `CONSUMO`, `NETO`, `ESTIMADO`, `GRUPO`, `SEG_TOT`, `FACTURADO`, `PERIODO`), `CONSUMOP`, `CONS_SER_TESTIGO`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` / `channelId` | uniqueidentifier | Sí | — |
| `contractId` | uniqueidentifier | Cond. | — |
| `period` | String `YYYY-MM` | Sí | — |
| `categoryId` | uniqueidentifier (M02) | Cond. | Categoría vigente a la fecha (M02). |
| `fromAt` / `toAt` | Date | Sí | Intervalo. |
| `days` | Int | Sí | RN-MED-071. |
| `fromReadingId` / `toReadingId` | uniqueidentifier | Cond. | Lecturas base. Referencia: `meterReadings` (M03). |
| `quantity` | DECIMAL(18,4) | Sí | Cantidad resultante. |
| `netQuantity` | DECIMAL(18,4) | No | Original antes de corrección o prorrateo (`NETO`). |
| `unit` | enum | Sí | — |
| `origin` | enum `real`/`estimated`/`split`/`distributed`/`distributionCompensation`/`additional`/`witness`/`directImport`/`prepaid`/`adjustment`/`migration` | Sí | — |
| `estimation` | {`method`, `basisPeriods` [String], `basisQuantity`, `reason`, `authorizedBy`} | Cond. | — |
| `split` | {`groupId`, `segment` Int, `segments` Int, `mode` enum `half`/`maxDays`/`limited`/`meterChange`/`prorate`} | Cond. | `GRUPO`, `SEG_TOT`. |
| `distribution` | {`distributionId`, `runId`} | Cond. | — |
| `gasCorrection` | {`measuredVolume`, `pressure`, `temperature`, `calorificFactor`, `correctionCoefficient`, `optimalCalorificFactor`, `rounding`, `factorRecordId`} | Cond. | **Reemplazado (DEC-085):** M03 guarda solo `measuredVolume` y `correctionCoefficient` (copia de `meteringPoints.gasCorrectionCoefficient`); factores, redondeo y cantidad corregida los guarda M04 en la traza del cálculo (RN-TAR-035). |
| `rolloverApplied` | Boolean | No | — |
| `exceptionIds` | [uniqueidentifier] | No | — |
| `status` | enum `calculated`/`inReview`/`blocked`/`approved`/`billed`/`adjusted`/`voided` | Sí | — |
| `approvedBy` / `approvedAt` | uniqueidentifier / Date | Cond. | — |
| `billingRef` | {`invoiceId`, `itemIds`, `billedAt`} (M05) | Cond. | Facturado (`COD_COM`/`SUC_COM`/`NUM_COM`). |
| `notBillableReason` | String | Cond. | Para excedentes "limitados". |

Índices: `{tenantId, contractId, period, channelId}`; `{tenantId, status, period}`; `{tenantId, meteringPointId, toAt}`.

**`consumptionExceptions`** — excepciones de consumo. Origen: `CTRLCNC` y filtros de revisión de ProCoop.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `consumptionId` / `readingId` / `meteringPointId` | uniqueidentifier | Sí (al menos uno) | Referencia: → `consumptions`, → `meterReadings` y → `meteringPoints` (M03). |
| `rule` | enum `zeroOnConnected`/`negative`/`outOfRange`/`percentVariation`/`daysDeviation`/`repeatedReading`/`digitsOverflow`/`lowerThanPrevious`/`consumptionWhileDisconnected`/`demandOverContracted`/`injectionWithoutContract`/`consecutiveEstimates`/`missingGasFactor`/`missingTelemetryMapping`/`distributionCapExceeded`/`duplicateSource`/`suspectedNonRegistered`/`geofence` | Sí | — |
| `severity` | enum `info`/`review`/`blocking` | Sí | — |
| `details` | Object | Sí | Valores que dispararon la regla. |
| `status` | enum `open`/`resolved`/`dismissed` | Sí | — |
| `resolution` | {`action` enum `approveAsReal`/`correctReading`/`reread`/`estimate`/`inspection`/`block`/`rolloverConfirmed`/`meterChange`, `justification` enum `vacantHome`/`leak`/`seasonal`/`useChange`/`other`, `text`, `by`, `at`, `workOrderRequestId`} | Cond. | — |

Índices: `{tenantId, status, severity, rule}`; `{tenantId, meteringPointId, status}`.

**`consumptionAdjustments`** — ajustes y regularizaciones. Origen: `SERSOC.CONS_BONIF`, nota "Bonificación de N M3", `clsBonificacionEstimados`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` / `meteringPointId` / `channelId` | uniqueidentifier | Sí | — |
| `type` | enum `estimateSettlement`/`correction`/`claimResolution`/`other` | Sí | — |
| `method` | enum `unitCompensation`/`rebill` | Sí | PA-MED-01. |
| `periods` | [String] | Sí | Períodos afectados. |
| `estimatedQuantity` / `realQuantity` / `differenceQuantity` | DECIMAL(18,4) | Sí | — |
| `rounding` | enum `awayFromZero`/`bankers` | Sí | — |
| `consumptionIds` | [uniqueidentifier] | Sí | — |
| `status` | enum `proposed`/`approved`/`applied`/`rejected`/`voided` | Sí | — |
| `appliedRef` | {`invoiceId`, `itemId`} (M05) | Cond. | — |
| `approval` | {`requestId` (T11), `by`, `at`} | Cond. | — |

**`consumptionDistributions`** — distribuciones padre-hijos. Origen: `DST_CONSUMO` (`SERSOC_ORI`, `SERSOC_DES`, `PORCENTAJE`, `COMBINADA`, `IGUALADA`, `TOPE`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `parentPointId` | uniqueidentifier | Sí | — Referencia: `meteringPoints` (M03). |
| `mode` | enum `percentage`/`equal`/`combined` | Sí | — |
| `children` | [{`pointId`, `percentage` DECIMAL(18,4) (2 dec)}] | Sí | — |
| `capPerChild` | DECIMAL(18,4) | Cond. | `TOPE` (combinada). |
| `controlBy` | enum `period`/`month` | Sí | V2 2618. |
| `runs` | [{`runId`, `period`, `parentConsumptionId`, `childConsumptionIds`, `status` enum `executed`/`reverted`, `at`, `by`}] | No | — |
| `validFrom` / `validTo` | Date | Sí / No | — |

Índices: `{tenantId, children.pointId}` con validación de unicidad de hijo vigente.

**`demandDeclarations`** — demanda contratada y declarada. Origen: `SERSOC.CON_BASE`, `SERSOC.DEC_CON`, `FEC_DECCON`, `PRIMER_TRANSGRESION`, `SERSOC_DEMANDASXPERIODO` (`ID_SERSOC`, `DEMANDA`, `TIP_MED`, `PERIODO`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` / `channelId` | uniqueidentifier | Sí | — |
| `period` | String | Sí | — |
| `contractedKw` | DECIMAL(18,4) | Sí | — |
| `declaredKw` | DECIMAL(18,4) | No | — |
| `registeredKw` | DECIMAL(18,4) | No | Demanda máxima medida. |
| `source` | enum `contract`/`transgression`/`reset`/`migration` | Sí | — |

**`demandTransgressions`** — transgresiones. Origen: `clsTransgresiones`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` / `channelId` | uniqueidentifier | Sí | — |
| `period` | String | Sí | — |
| `registeredKw` / `contractedKw` / `transgressionPercent` | DECIMAL(18,4) | Sí | — |
| `firstTransgressionAt` | Date | Sí | — |
| `status` | enum `detected`/`notified`/`resolved`/`reset` | Sí | — |
| `resetAudit` | {`previousDeclaredKw`, `by`, `at`, `approvalRequestId`} | Cond. | "RESET_DEM". |

**`gasCorrectionFactors`** — factores de corrección de gas. Origen: `FACTOR_CAL` (por período y categoría; `PRESION`, `TEMPERATURA`, `FACTOR`), `SERSOC.COEF_CORRECTOR`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `period` | String | Sí | — |
| `categoryCode` | String | No | Nulo = general. |
| `pressure` / `temperature` | DECIMAL(18,4) | No | — |
| `calorificFactor` | DECIMAL(18,4) | Sí | — |
| `source` | String | Sí | Documento/distribuidora de origen (BASE §89). |
| `status` | enum `draft`/`approved` | Sí | — |

Índices: `{tenantId, period, categoryCode}` único. El coeficiente corrector por servicio se guarda en `meteringPoints.gasCorrectionCoefficient` (DECIMAL(18,4), default 1).

> **Reemplazado por `gasCalorificFactors` de M04 (HUE-GAS-03; PA-TAR-19 opción A):** la colección `gasCorrectionFactors` no se crea. Factor calórico, presión, temperatura y su aprobación por período/categoría viven en M04 (PAN-TAR-09, API-TAR-030); M03 los lee para estimar y validar ~~y calcular la cantidad corregida~~ (la corrección la aplica M04, DEC-085). Se conserva en M03 solo `meteringPoints.gasCorrectionCoefficient` (coeficiente corrector del punto, `SERSOC.COEF_CORRECTOR`), que es dato del punto de medición.

### 7.5 Importación y telemedición

**`readingImportProfiles`** — perfiles de importación configurables. Origen: formatos de `clsDetalleRuta.ImportarLecturas`, `clsImportacion_AC`, `clsImportador`, V2 452, 2307.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` / `name` | String | Sí | Ej. `AGUAS_CORDOBESAS`, `RAINBOW`. |
| `kind` | enum `readings`/`consumptions`/`collectorExport` | Sí | — |
| `fileFormat` | enum `xlsx`/`csv`/`fixedWidth`/`dbf`/`txt` | Sí | — |
| `columns` | [{`field`, `position` o `header`, `width`, `format`}] | Sí | V2 3074/3075 (Rainbow). |
| `matchBy` | enum `meterNumber`/`account`/`pointCode` | Sí | — |
| `meterNumberPadding` | Int | No | Default 10. |
| `decimalSeparator` / `allowDecimals` | String / Boolean | Sí | V2 2087. |
| `dateFormat` | String | Sí | — |
| `headerFix` | Boolean | No | V2 3063. |
| `conceptMapping` | [{`sourceName`, `channelType`, `touBand`}] | No | "ENERGIA ACTIVA PUNTA", "POTENCIA VALLE". |
| `defaultServiceId` | String | No | V2 2054, 455. Antes `defaultUtilityCode` (nombre de T05). |
| `accessNotesRequired` | Boolean | Sí | Inverso de V2 3140. |
| `status` | enum | Sí | — |

**`readingImportJobs`** — archivos importados. Campos: `profileId`, `storedFileId` (antes `fileDocId`; nombre de T05), `period`, `rows` (total, válidas, con error, duplicadas), `errors` [{`row`, `message`}], `batchId`, `status` enum `uploaded`/`previewed`/`confirmed`/`processed`/`failed`/`cancelled`, `approvedBy` (importación directa de consumos).

Campos de `readingImportJobs` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `profileId` | uniqueidentifier | Sí | — | `readingImportProfiles` (M03) |
| `storedFileId` | uniqueidentifier | Sí | Antes `fileDocId`; nombre de T05 | `storedFiles` (T01) |
| `period` | string | [VERIFICAR] | — | — |
| `rows` | [VERIFICAR] | [VERIFICAR] | Total, válidas, con error, duplicadas | — |
| `errors` | [VERIFICAR] | [VERIFICAR] | [{`row`, `message`}] | — |
| `batchId` | uniqueidentifier | [VERIFICAR] | — | `readingBatches` (M03) |
| `status` | enum | Sí | Enum `uploaded`/`previewed`/`confirmed`/`processed`/`failed`/`cancelled` | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | Importación directa de consumos | `memberships` (T02) |
| `fileHash` | string | Sí | Hash del archivo; único con `profileId` (T05). | — |

**`meteringSystems`** — sistemas de telemedición/prepago. Origen: `TELEMEDICION` (`DES_TEL`, `USER_TEL`, `PASS_TEL`, `URL_TEL`, `PATH`, `SISTEMA`, `DATO_EXTRA1`, `DATO_EXTRA2`), enum `Sistemas_Telemedicion`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` / `name` | String | Sí | — |
| `provider` | enum `discar`/`boiero`/`boieroTsm`/`nexo`/`nexoSql`/`nexoTcp2`/`nexoPlus`/`cashPower`/`cashPowerMws`/`batcom`/`cToken`/`hexing`/`rainbow`/`quo`/`silexis`/`kaptor`/`genericRest`/`genericFile` | Sí | Proveedores de medición/prepago (los ISP van a M10). |
| `families` | [enum `metering`/`prepaid`] | Sí | — |
| `endpoint` | String | Cond. | `URL_TEL`/`PATH`. |
| `credentialRef` | uniqueidentifier → `integrationSecrets` (T06, DEC-074; CTR-DAT-72) | Cond. | Nunca el secreto. |
| `extra` | Object | No | `DATO_EXTRA1/2` y opciones del proveedor (V2 2504, 2336, 2594, 3116). |
| `supportedOperations` | [String] | Sí | RN-MED-107. |
| `retryPolicy` | {`maxAttempts`, `delaySeconds`, `forceReconnect`} | Sí | V2 2370, 2491. |
| `serviceIds` | [String] | Sí | — |
| `health` | {`status` enum `ok`/`degraded`/`down`/`credentialExpired`, `checkedAt`, `pendingOps`} | No | — |
| `status` | enum | Sí | — |
| `connectionId` | uniqueidentifier | [VERIFICAR] | Conexión de integración del sistema (T05 lo declara en claves). Referencia: `integrationConnections` (T06). |

**`telemetryRegisterMappings`** — mapeo de registros remotos. Origen: `LEC_MEDTEL` (`SIS_TEL`, `TIP_MED`, `COD_CATSER`, `TIP_ENE`, `COD_CON`, `COD_LEC`, `COD_LEC2`, `COD_LEC3`, `GENERADOR`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringSystemId` | uniqueidentifier | Sí | — |
| `meterTypeId` | uniqueidentifier | Sí | — |
| `categoryId` | uniqueidentifier (M02) | No | — |
| `channelType` / `touBand` | enum / String | Sí | — |
| `conceptId` | uniqueidentifier (M02) | No | — |
| `remoteRegisterCodes` | [String] (máx. 3) | Sí | — |
| `aggregation` | enum `max`/`sum`/`first` | Sí | Default `max`. |
| `scale` | DECIMAL(18,4) | Sí | Ej. 0,001 para demanda. |
| `isGenerator` | Boolean | Sí | — |

**`remoteMeterOperations`** — operaciones/comandos remotos. Origen: `TELEMED_COMM` (`FECHA`, `OPERACION`, `COMANDO`, `RESPUESTA`, `ID_SERSOC`, `SUMINISTRO`, `OBSERVACION`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringSystemId` / `meterId` / `meteringPointId` | uniqueidentifier | Sí | — |
| `operation` | enum `register`/`changeCategory`/`assignMeter`/`removeMeter`/`replaceMeter`/`confirmWorkOrder`/`disconnect`/`reconnect`/`readNow`/`validatePreSale`/`topUp`/`topUpStatus`/`topUpHistory` | Sí | — |
| `requestedBy` | {`module` enum `MOR`/`TEC`/`CRM`/`MED`/`COB`, `orderId`, `userId`} | Sí | — |
| `idempotencyKey` | String | Sí | — |
| `payload` / `responseSummary` | Object | Sí / No | Saneados. |
| `attempts` | [{`at`, `result`, `errorCode`}] | No | — |
| `status` | enum `queued`/`sent`/`pendingProvider`/`succeeded`/`failed`/`rejected`/`cancelled`/`unknown` | Sí | — |
| `confirmedAt` | Date | No | — |
| `integrationOperationId` | uniqueidentifier | [VERIFICAR] | Operación de integración que la ejecuta (T05 lo declara en claves). Referencia: `integrationOperations` (T06). |

Índices: `{tenantId, idempotencyKey}` único; `{tenantId, meteringPointId, createdAt}`; `{tenantId, status}`.

**`meteringConnectorLogs`** — auditoría de llamadas. **Reemplazado por `integrationMessages` de T06 (CTR-DAT-61 de T05):** las llamadas a sistemas de telemedición se registran en la bitácora de integraciones con `meteringSystemId`, `operationId` y `meteringPointId` como referencias de negocio; se conserva la definición original. Origen: `AUDITORIA_TELEMEDICION` (`IDAPI`, `REQUEST`, `SIS_TEL`, `ID_SERSOC`, `COD_SOL`, `FEC_REG`, `NUM_MED`, `RESPONSE`). Campos: `meteringSystemId`, `operationId`, `meterNumber`, `meteringPointId`, `workOrderId`, `requestSanitized`, `responseSanitized`, `httpStatus`, `durationMs`, `correlationId`, `at`. TTL configurable (PRM-MED-133).

**`intervalReadings`** — curvas de carga (Extensión, PA-MED-03). Colección de series temporales (`timeseries`, `timeField: intervalStart`, `metaField: {tenantId, channelId}`): `intervalStart`, `intervalMinutes`, `value`, `quality` enum `actual`/`estimated`/`missing`, `source`.

Campos de `intervalReadings` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `intervalStart` | [VERIFICAR] | [VERIFICAR] | — | — |
| `intervalMinutes` | [VERIFICAR] | [VERIFICAR] | — | — |
| `value` | decimal | [VERIFICAR] | — | — |
| `quality` | enum | [VERIFICAR] | Enum `actual`/`estimated`/`missing` | — |
| `source` | [VERIFICAR] | [VERIFICAR] | — | — |

### 7.6 Prepago y generación distribuida

**`prepaidAccounts`** — cuenta prepaga técnica del punto. Origen: `CATE_SER.PREPAGA`, `TIPMED.PREPAGO`, configuración de `frmConfiguracionPrepaga` (referencia M07).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `meteringPointId` / `contractId` / `meterId` | uniqueidentifier | Sí | — |
| `meteringSystemId` | uniqueidentifier | Sí | — |
| `vendorMeterId` | String | Sí | Identificador en el proveedor. |
| `mode` | enum `token`/`onlineCredit` | Sí | PA-MED-04. |
| `reportedBalance` | {`quantity` DECIMAL(18,4), `unit`, `amount` DECIMAL(18,4), `currency`, `reportedAt`} | No | — |
| `lowBalanceThreshold` | {`quantity`, `days`} | No | — |
| `status` | enum `active`/`suspended`/`closed` | Sí | — |

**`prepaidTopUps`** — recargas. Origen: `CargaCreditoPrepago`, `RegistroVentaPrepagaTelemed`, venta prepaga (M07).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `prepaidAccountId` | uniqueidentifier | Sí | — |
| `channel` | enum `cashDesk`/`pos`/`portal`/`app`/`remotePos` | Sí | — |
| `paymentRef` | {`paymentId`, `receiptId`} (M07) | Cond. | — |
| `invoiceId` | uniqueidentifier (M05) | Cond. | — Antes `invoiceRef` (nombre de T05). |
| `amount` | DECIMAL(18,4) | Sí | ARS. |
| `quantity` | DECIMAL(18,4) | Sí | Unidades (kWh) tras redondeo del tipo. |
| `preSaleCheck` | {`result`, `at`, `message`} | Sí | — |
| `token` | String (cifrado) | Cond. | Solo modo token. |
| `vendorTransactionId` | String | No | — Referencia: externa: identificador del proveedor de prepago (sin colección); no es referencia interna. |
| `idempotencyKey` | String | Sí | — |
| `status` | enum `preSaleOk`/`preSaleRejected`/`paid`/`requested`/`tokenIssued`/`delivered`/`applied`/`failed`/`refundRequested`/`voided` | Sí | — |
| `reconciliation` | {`status` enum `pending`/`matched`/`mismatch`, `at`} | No | — |

**`distributedGenerationContracts`** — contrato técnico del usuario-generador. Origen: nuevo (MER-001).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` / `meteringPointId` | uniqueidentifier | Sí | — |
| `prosumerClass` | String (catálogo del régimen) | Sí | Clasificación del usuario-generador. |
| `technology` | enum `solar`/`wind`/`hydro`/`biomass`/`other` | Sí | — |
| `installedKw` / `authorizedKw` | DECIMAL(18,4) | Sí | — |
| `equipment` | {`inverterBrand`, `inverterModel`, `serials` [String]} | No | — |
| `connectedAt` | Date | Cond. | — |
| `installer` | {`name`, `license`, `personId`} | Sí | Instalador habilitado. |
| `regime` | {`code`, `jurisdiction`, `compensationMode` enum `monetaryNetBilling`/`energyNetMetering`} | Sí | PA-MED-08; default `monetaryNetBilling` (DEC-060). |
| `documents` | [uniqueidentifier] | No | Referencia: → `documents` (T11). |
| `status` | enum `requested`/`underReview`/`approved`/`connected`/`suspended`/`terminated` | Sí | — |
| `validFrom` / `validTo` | Date | Sí / No | — |

**`injectionBalances`** — balance de energía por período. Origen: `GetTotalConsumoInyectada`, consumo neto (RN-01 §4.6).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `contractId` / `meteringPointId` | uniqueidentifier | Sí | — |
| `period` | String | Sí | — |
| `importedKwh` / `exportedKwh` / `netKwh` | DECIMAL(18,4) | Sí | — |
| `byBand` | [{`touBand`, `importedKwh`, `exportedKwh`}] | No | — |
| `generationKwh` | DECIMAL(18,4) | No | — |
| `consumptionIds` | [uniqueidentifier] | Sí | — |
| `status` | enum `calculated`/`approved`/`billed` | Sí | — |
| `distributedGenerationContractId` | uniqueidentifier | [VERIFICAR] | Contrato de generación distribuida (T05 lo declara en claves). Referencia: `distributedGenerationContracts` (M03). |

### 7.7 Otros

**`consumptionClassReviews`** — propuestas de cambio de clase por consumo (PA-MED-10). Campos: `ruleSet` {`type` enum `type1`/`type2`, `minQuantity`, `maxQuantity`, `months`}, `period`, `candidates` [{`contractId`, `currentCategory`, `proposedCategory`, `reason`}], `status` enum `draft`/`approved`/`applied`/`discarded`, `approvalRequestId` (T11).

Campos de `consumptionClassReviews` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ruleSet` | [VERIFICAR] | [VERIFICAR] | {`type` enum `type1`/`type2`, `minQuantity`, `maxQuantity`, `months`} | — |
| `period` | string | [VERIFICAR] | — | — |
| `candidates` | [VERIFICAR] | [VERIFICAR] | [{`contractId`, `currentCategory`, `proposedCategory`, `reason`}] | — |
| `status` | enum | Sí | Enum `draft`/`approved`/`applied`/`discarded` | — |
| `approvalRequestId` | uniqueidentifier | [VERIFICAR] | T11 | `approvalRequests` (T11) |

### 7.8 Relaciones principales

`meters` 1—N `meterInstallations` N—1 `meteringPoints` 1—N `meteringChannels` 1—N `meterReadings` → `consumptions` (N lecturas → 1 consumo por intervalo) → `consumptionExceptions`, `consumptionAdjustments`. `readingRoutes` 1—N `readingBatches` 1—N `readingTasks` 1—0..1 `meterReadings`. `meteringPoints` (customer) N—1 `meteringPoints` (witness). `consumptionDistributions` vincula 1 padre con N hijos. `meteringSystems` 1—N `telemetryRegisterMappings`, `remoteMeterOperations`, `integrationMessages` (T06, antes `meteringConnectorLogs`), `prepaidAccounts`. `prepaidAccounts` 1—N `prepaidTopUps`. `distributedGenerationContracts` 1—N `injectionBalances`. Referencias externas: `contractId` y `categoryId` (M02, CTR-DAT-71), `accountId`/`premiseId` (M01), `conceptId` (M02 `billableConcepts`), `invoiceId` (M05), `paymentId` (M07), `workOrderId` (M10), `serialUnitId` (M13 `serialUnits`), documentos (T11). Nombres canónicos según T05 §7.2 (CTR-DAT-30).

## 8. Estados y transiciones

### 8.1 Medidor (`meters.assetStatus`, proyección)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `available` | M13 (alta de ítem) / encargado | Ítem serializado disponible | Ficha creada | Baja lógica de la ficha si nunca se instaló. |
| `available` | `installed` | Encargado / cierre OT M10 | Sin instalación activa, sin ensayo rechazado, tipo compatible | Crea `meterInstallations` activa; `med.meter.installed` (M13 mueve stock) | Anular instalación (RF-MED-021). |
| `installed` | `removed` | Encargado / cierre OT | Lecturas finales registradas | Cierra instalación; `med.meter.removed` | Anular retiro si no hay consumos facturados posteriores. |
| `removed` | `available` | M13 | Revisión/ensayo aprobado | — | — |
| `removed`/`available` | `inRepair` | M13 | — | No seleccionable | M13 devuelve a `available`. |
| cualquiera salvo `installed` | `discarded` | M13 | — | No seleccionable | No. |

### 8.2 Instalación (`meterInstallations.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `active` | Encargado / M10 | RN-MED-001, 017, 018 | Lecturas iniciales validadas; canal mapeado | `voided` |
| `active` | `closed` | Encargado / M10 | Lectura final o motivo de retiro sin lectura (robo) con estimación aprobada | Consumo final calculado | Reabrir (`active`) si se anula el retiro. |
| `active`/`closed` | `voided` | Supervisor de consumos | Ningún consumo dependiente facturado | Lecturas y consumos dependientes `voided` | No (se carga de nuevo). |

### 8.3 Lote de lectura (`readingBatches.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `generated` | Supervisor / JOB-MED-01 | Ruta activa; punto no está en otro lote abierto | Tareas creadas con snapshot y rango | `cancelled` |
| `generated` | `assigned` | Supervisor | Lecturista(s) asignado(s) | Notificación al lecturista | Volver a `generated` desasignando. |
| `assigned` | `downloaded` | Dispositivo / exportación | — | `taskVersion` registrada | — |
| `downloaded` | `inProgress` | Primera sincronización con capturas | — | Contadores | — |
| `inProgress` | `received` | Todas las tareas capturadas/no leídas o cierre de campo | — | — | Reabrir campo (`inProgress`). |
| `received` | `inReview` | Sistema | Validaciones ejecutadas | Excepciones creadas | — |
| `inReview` | `confirmed` | Supervisor / JOB-MED-03 | Sin tareas en `captured` sin decidir | Lecturas `validated`, consumos `calculated`; rechazadas con causa | — |
| `confirmed` | `closed` | Supervisor | Pendientes decididos (estimar, releer, no leído) | Acta; `med.readingBatch.closed` | `confirmed` (reabrir) si ningún consumo facturado. |
| `generated`/`assigned`/`downloaded` | `cancelled` | Supervisor | Sin lecturas sin procesar o confirmación expresa | Tareas `cancelled`; dispositivos reciben invalidación | No. |

### 8.4 Tarea de lectura (`readingTasks.status`)

`pending` → `assigned` → `downloaded` → `captured` | `notRead` | `estimated` → `confirmed` | `rejected`; cualquier estado no final → `conflict` (al sincronizar con versión distinta) → resuelta a `captured`/`cancelled`; `pending`/`assigned`/`downloaded` → `cancelled`. Un `rejected` puede volver a `assigned` para relectura.

### 8.5 Lectura (`meterReadings.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `captured` | Lecturista / operador / conector / socio | Validación de forma (RN-MED-047 a 050) | — | — |
| `captured` | `validated` | Confirmación de lote / operador | RN-MED-035 | Cálculo de consumo | `superseded` por corrección |
| `captured` | `rejected` | Sistema / supervisor | Falla validación | Tarea `rejected` | Nueva captura. |
| `captured`/`validated` | `redundant` | Sistema | Duplicada de otra fuente de mayor prioridad | — | Reactivar si se anula la otra. |
| `validated` | `superseded` | Operador con `med.lecturas.corregir` | Consumo dependiente no facturado | Nueva versión; recálculo | No (la nueva versión puede corregirse). |
| `captured`/`validated` | `voided` | Supervisor | Consumo dependiente no facturado | Consumos dependientes `voided` | No. |

### 8.6 Consumo (`consumptions.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `calculated` | Sistema | Lecturas validadas o estimación | Reglas de validación | — |
| `calculated` | `inReview` | Sistema | Excepción de severidad `review` | En bandeja | — |
| `calculated`/`inReview` | `blocked` | Sistema / supervisor | Excepción `blocking` | M05 lo ve observado | `inReview`/`approved` al resolver. |
| `calculated`/`inReview` | `approved` | Sistema (auto) / supervisor | Sin excepciones abiertas bloqueantes | `med.consumption.approved` | `calculated` (desaprobar) si no facturado. |
| `approved` | `billed` | M05 (`fac.invoice.issued`) | — | Inmutable | Solo `adjusted` mediante ajuste. |
| `billed` | `adjusted` | Supervisor | Ajuste aprobado | M05 NC/ND o compensación | No. |
| no facturado | `voided` | Supervisor | Motivo | Proyecciones recalculadas | No. |

### 8.7 Excepción (`consumptionExceptions.status`)

`open` → `resolved` (con acción y justificación) | `dismissed` (solo severidad `info`/`review`, con motivo). Un `resolved` con acción `reread` o `inspection` mantiene el consumo bloqueado hasta que llegue la nueva lectura o el resultado de M10.

### 8.8 Ajuste (`consumptionAdjustments.status`)

`proposed` → `approved` → `applied` (M05 lo incluyó) ; `proposed` → `rejected`; `approved` → `voided` antes de aplicarse.

### 8.9 Operación remota (`remoteMeterOperations.status`)

`queued` → `sent` → `pendingProvider` → `succeeded` | `failed` | `rejected`; `sent` sin respuesta en el plazo → `unknown` (requiere consulta de estado antes de reintentar); `queued` → `cancelled` (si la orden de origen se anuló). Un `failed` reintenta según la política hasta el máximo y luego pasa a la bandeja técnica (T06). Solo `succeeded` emite `med.remoteOperation.succeeded`, que M01/M08/M10 usan para cambiar el estado del servicio.

### 8.10 Recarga prepaga (`prepaidTopUps.status`)

`preSaleOk` | `preSaleRejected` → (M07 cobra) `paid` → `requested` → `tokenIssued` (token) | `applied` (crédito en línea) → `delivered`; `requested` → `failed` → reintento (`requested`) o `refundRequested` (M07 devuelve) ; `paid` → `voided` solo con devolución confirmada por M07.

### 8.11 Contrato GD (`distributedGenerationContracts.status`)

`requested` → `underReview` → `approved` → `connected` (medidor bidireccional instalado) → `suspended` ↔ `connected` → `terminated`; `underReview` → `requested` (observado). La baja del suministro fuerza `terminated`.

### 8.12 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5).

**Valores declarados** (catálogos y configuraciones de §7 con `status` sin valores; se aplica el patrón de `meterBrands` y `meterTypes`):

| Entidad | Campo | Valores | Estado inicial | Fuente |
|---|---|---|---|---|
| `readingObservationCodes`, `readingResultCodes`, `readingConditionCodes`, `meterObservationCodes` | `status` | `active`, `inactive` | `active` | Patrón de catálogos de §7.1. |
| `readingRoutes`, `readingImportProfiles` | `status` | `active`, `inactive` | `active` | Configuración reutilizable; `inactive` impide generar lotes o importar con ella. |
| `meteringSystems` | `status` | `active`, `inactive` (confirmados en PA-MED-14, DEC-072; antes [VERIFICAR]) | `active` | Distinto de `health.status` (`ok`, `degraded`, `down`, `credentialExpired`), que es salud técnica. |

**Transiciones agregadas:**

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `meteringPoints` | — | `pending` | Alta del punto (contrato en alta) | — | — |
| `meteringPoints` | `pending` | `active` | Instalación activa (§8.2) | RN-MED-001 | `med.meter.installed` |
| `meteringPoints` | `pending`/`active` | `withoutMeter` | Retiro sin reemplazo o servicio no medido | — | `med.meter.removed` |
| `meteringPoints` | `withoutMeter` | `active` | Nueva instalación | RN-MED-001 | `med.meter.installed` |
| `meteringPoints` | `active` | `suspended` | Suspensión del contrato (M02) | — | — |
| `meteringPoints` | `suspended` | `active` | Reactivación del contrato | — | — |
| `meteringPoints` | cualquiera | `closed` | Baja del contrato con lectura final | Sin tareas de lectura abiertas | — |
| `meteringChannels` | — | `active` | Alta del canal con la instalación | — | — |
| `meteringChannels` | `active` | `closed` | Retiro del medidor o cambio de mapeo | Lectura final del canal | — |
| `readingCalendars` | — | `draft` | Generación del cronograma | — | — |
| `readingCalendars` | `draft` | `published` | Publicación por el supervisor | Sin solapamiento de ventanas | — |
| `readingCalendars` | `published` | `closed` | Fin del período | Lotes del período cerrados | — |
| `demandTransgressions` | — | `detected` | Aprobación de consumo de demanda (§9) | Registrada mayor que contratada | `med.demand.transgressionDetected` |
| `demandTransgressions` | `detected` | `notified` | Aviso al socio (T09) | — | — |
| `demandTransgressions` | `detected`/`notified` | `resolved` | Nueva declaración o recargo aplicado | — | — |
| `demandTransgressions` | `resolved` | `reset` | Inicio de un período sin transgresión | — | — |
| `prepaidAccounts` | — | `active` | Alta del punto prepago | — | — |
| `prepaidAccounts` | `active` | `suspended` | Suspensión del contrato o del sistema de prepago | — | — |
| `prepaidAccounts` | `suspended` | `active` | Reactivación | — | — |
| `prepaidAccounts` | `active`/`suspended` | `closed` | Baja del contrato o cambio a pospago | Saldo informado conciliado | — |
| `injectionBalances` | — | `calculated` | Cálculo del período (GD) | — | — |
| `injectionBalances` | `calculated` | `approved` | Aprobación del supervisor | — | — |
| `injectionBalances` | `approved` | `billed` | Comprobante emitido por M05 | — | `fac.invoice.issued` |
| `consumptions` | `calculated`/`inReview`/`blocked`/`approved` | `voided` | Anulación por el supervisor (fila "no facturado" de §8.6) | Consumo no facturado | — |
| `remoteMeterOperations` | — | `queued` | Pedido del módulo dueño | `idempotencyKey` | — |
| `remoteMeterOperations` | `queued` | `sent` | Envío al proveedor | — | — |
| `remoteMeterOperations` | `sent` | `pendingProvider` | Acuse del proveedor | — | — |
| `remoteMeterOperations` | `sent` | `unknown` | Sin respuesta en el plazo | Consultar estado antes de reintentar | — |
| `remoteMeterOperations` | `unknown` | `pendingProvider`/`succeeded`/`failed` | Resultado de la consulta de estado | — | — |
| `remoteMeterOperations` | `pendingProvider` | `succeeded`/`failed`/`rejected` | Respuesta del proveedor | — | `med.remoteOperation.succeeded` (solo `succeeded`) |
| `remoteMeterOperations` | `queued` | `cancelled` | Orden de origen anulada | — | — |
| `prepaidTopUps` | — | `preSaleOk`/`preSaleRejected` | Validación previa a la venta | — | — |
| `prepaidTopUps` | `preSaleOk` | `paid` | Cobro confirmado por M07 | — | — |
| `prepaidTopUps` | `paid` | `requested` | Pedido al proveedor | `idempotencyKey` | — |
| `prepaidTopUps` | `requested` | `tokenIssued`/`applied` | Token emitido o crédito en línea | — | — |
| `prepaidTopUps` | `tokenIssued`/`applied` | `delivered` | Entrega al socio | — | — |
| `prepaidTopUps` | `requested` | `failed` | Error del proveedor | — | — |
| `prepaidTopUps` | `failed` | `requested` | Reintento | — | — |
| `prepaidTopUps` | `failed` | `refundRequested` | Agotados los reintentos | M07 devuelve el pago | — |
| `prepaidTopUps` | `paid` | `voided` | Devolución confirmada por M07 | — | — |

`preSaleRejected` es terminal (la venta no se cobra).

### 8.13 Estados iniciales y transiciones completadas (residuales del 05-11-2026)

Ronda de residuales del 05-11-2026 (PA-MED-15, DEC-072): estado de alta explícito de las máquinas de §8.4, §8.7, §8.8 y §8.11, y transiciones de `readingImportJobs` y `consumptionClassReviews`, que solo enumeraban estados en §7. Las cadenas de §8.4 a §8.11 no cambian.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `readingTasks` | — | `pending` | Generación del lote de lectura (§8.3) | — | — |
| `consumptionExceptions` | — | `open` | Regla de validación de consumo con hallazgo | — | — |
| `consumptionAdjustments` | — | `proposed` | Propuesta de ajuste o regularización | — | — |
| `distributedGenerationContracts` | — | `requested` | Solicitud del usuario-generador (MER-001) | — | — |
| `readingImportJobs` | — | `uploaded` | Carga del archivo con un perfil de importación | Perfil `active`; `fileHash` no repetido para el perfil | — |
| `readingImportJobs` | `uploaded` | `previewed` | Vista previa con filas válidas, con error y duplicadas | — | — |
| `readingImportJobs` | `previewed` | `confirmed` | Confirmación del operador (`approvedBy` en importación directa de consumos) | — | — |
| `readingImportJobs` | `confirmed` | `processed` | Lecturas o consumos registrados en el lote (`batchId`) | — | — |
| `readingImportJobs` | `uploaded`/`previewed`/`confirmed` | `failed` | Error de formato o de procesamiento | — | — |
| `readingImportJobs` | `uploaded`/`previewed` | `cancelled` | Cancelación por el operador | — | — |
| `consumptionClassReviews` | — | `draft` | Revisión periódica que genera candidatos (PA-MED-10) | — | — |
| `consumptionClassReviews` | `draft` | `approved` | Aprobación (`approvalRequestId`, T11) | — | — |
| `consumptionClassReviews` | `approved` | `applied` | Cambio de categoría aplicado en los contratos (M02) | — | — |
| `consumptionClassReviews` | `draft` | `discarded` | Descarte de la propuesta | — | — |

## 9. Procesos y flujos

### 9.1 Ciclo mensual de medición (vista general)

Encaja en el ciclo mensual de DFA ("rutas de lectura (app o telemedición) → validación de consumos → pre-facturación → revisión de excepciones → emisión"):

1. **Cronograma** publicado por servicio y ciclo (PAN-MED-06).
2. **JOB-MED-01 `med:generar-lotes`** crea los lotes de cada ruta en la fecha planificada.
3. **Asignación** y **descarga** a la app o **exportación** a archivo.
4. **Captura** en campo/telemedición/autolectura/carga manual/importación.
5. **Sincronización** (`/sync`) con idempotencia y conflictos.
6. **Validación y confirmación** del lote (JOB-MED-03): lecturas validadas, consumos calculados, excepciones.
7. **Bandeja de excepciones**: decisión de cada caso; estimaciones (JOB-MED-05) para no leídos.
8. **División/agrupación** (JOB-MED-06) y **distribución** (JOB-MED-07) cuando corresponda.
9. **Aprobación** (automática o manual) → `med.consumption.approved`.
10. **Cierre del lote** con acta.
11. M04/M05 toman los consumos aprobados del período (API-MED-60); los observados quedan fuera con causa.
12. Al emitir, M05 publica `fac.invoice.issued` → MED marca `billed`.
13. **Regularización de estimados** (JOB-MED-08) al recibir lecturas reales posteriores.

### 9.2 Generación de lote (JOB-MED-01 `med:generar-lotes`)

1. Entrada: ruta, período (o cronograma). Idempotente por `{routeId, period}`.
2. Selecciona puntos según criterio (RN-MED-023), inclusión (RN-MED-025), filtro de telemedidos (RN-MED-026), fecha de alta (RN-MED-032).
3. Excluye puntos que ya están en otro lote abierto del período y los informa (RN-MED-028).
4. Por cada punto con medidor activo y cada canal leíble: toma la última lectura validada, calcula consumo de referencia y rango esperado (RN-MED-029/073), arma el snapshot con los campos habilitados (RN-MED-033), marca prioridad si el último fue estimado (RN-MED-030).
5. Ordena según la ruta (RN-MED-024).
6. Registra progreso cada 500 puntos; si se interrumpe, reanuda desde el último punto procesado.
7. Emite `med.readingBatch.generated`.

### 9.3 Lectura en campo offline (pwa-campo)

1. El lecturista abre "Mis rutas" (PAN-MED-28) y descarga el lote: tareas, fotos de referencia opcionales, catálogo de observaciones; se guarda en IndexedDB con `taskVersion`.
2. En cada tarea (PAN-MED-29): verifica dirección, número de medidor (lectura de código de barras/QR si existe), captura estado por registro, observación, resultado, fotos y GPS.
3. Validaciones locales: RN-MED-047, 049, 051, 053; si fuera de rango pide reingreso y foto; si la observación bloquea lectura, registra "no leído".
4. Cada captura se encola con `clientMutationId` (una mutación por lectura y una por foto).
5. Con red, la cola se envía a `POST /api/med/field/sync` por lotes; el servidor responde por ítem (`accepted`, `duplicate`, `conflict`, `rejected` con causa).
6. En conflicto (RN-MED-125) la lectura se guarda igual con estado `captured` y la tarea `conflict`; el supervisor decide en PAN-MED-34.
7. Banner único de estado de sincronización con "Reintentar"; no se encolan login ni operaciones administrativas (CNX §3.7).
8. Al terminar, el lecturista cierra la jornada (alimenta `readerWorkSessions`).

### 9.4 Confirmación de lote (JOB-MED-03 `med:confirmar-lote`)

1. Bloquea el lote en `inReview` (lock por lote; otro intento devuelve 409).
2. Por cada lectura `captured`: verificaciones RN-MED-035 (alta del servicio, medidor y canal vigentes, fecha y estado anterior coinciden con la última validada, versión). Si falla → `rejected` con causa y tarea `rejected`.
3. Aplica observaciones (RN-MED-036): pide OT a M10 (`med.readingObservation.workOrderRequested`), marca estimado o exige foto.
4. Calcula consumo (RN-MED-065 a 071), ~~corrección de gas si aplica~~ (la corrección de gas la aplica M04, DEC-085), testigo si aplica.
5. Ejecuta reglas de validación (RN-MED-076) y crea excepciones.
6. Pasa lecturas a `validated`, consumos a `calculated`/`inReview`/`blocked`, y aprueba automáticamente los que correspondan (RN-MED-079).
7. Adjunta fotos al consumo (RN-MED-039) y actualiza proyecciones del punto (RN-MED-041).
8. Idempotente: una lectura ya `validated` no se reprocesa; reanudable por cursor.
9. Emite `med.readingBatch.confirmed` con contadores.

### 9.5 Registro manual (PAN-MED-09)

1. El operador elige cuenta o servicio; el sistema muestra los canales con lectura anterior, consumo anterior y datos del servicio.
2. Ingresa fecha, período, estado actual por canal, observación y marca de estimado si corresponde.
3. Al presionar "Correcto" se crea la lectura `captured` con origen `manual` y se ejecutan los pasos 2 a 7 de 9.4 para ese punto.

### 9.6 Importación de archivo (PAN-MED-10, JOB-MED-04 `med:importar-lecturas`)

1. Subir archivo y elegir perfil → preview con errores por fila (ExcelImportWizard).
2. Confirmar: se crea `readingImportJobs` y un lote de origen `fileImport` (o se asocia al lote exportado del período).
3. Cada fila válida crea una lectura `captured` (o un consumo `directImport` si el perfil es de consumos, que exige aprobación previa).
4. Deduplicación por medidor, registro e instante (RN-MED-063).
5. Continúa con 9.4.

### 9.7 Telemedición: toma de estado (JOB-MED-10 `med:toma-estado`)

1. Entrada: lote telemedido, lista de puntos o un punto; agrupa por `meteringSystemId`.
2. Por sistema, divide en páginas según límites del proveedor; por cada medidor crea `remoteMeterOperations` (`readNow`) con `idempotencyKey = tenant+point+period+attempt`.
3. El conector (T06) ejecuta y devuelve registros; MED aplica `telemetryRegisterMappings` (máximo de hasta 3 registros, escala).
4. Crea lecturas `captured` origen `telemetry`; si el punto es multicanal y ya existe lectura del período, pide confirmación (queda `captured` con advertencia).
5. Reintentos según política; tras agotar, excepción `missingTelemetryReading` y la tarea pasa a estimación o lectura de campo según parámetro.
6. Continúa con 9.4. También corre periódicamente (JOB-MED-11 `med:importar-ami`) para sistemas que publican lecturas por archivo o API de lote.

### 9.8 Comando remoto de corte/reconexión

1. M08 (mora) o M10 emite la orden; invoca `POST /api/admin/med/remote-operations` (API-MED-50) con `Idempotency-Key` y la orden de origen.
2. MED valida que el medidor admite la operación y que la orden está vigente; crea `remoteMeterOperations` `queued`.
3. JOB-MED-12 `med:ejecutar-operaciones-remotas` envía al conector; registra intentos y log saneado.
4. Resultado `succeeded` → `med.remoteOperation.succeeded` (M08/M10/M01 cambian el estado del servicio con la fecha confirmada); `failed`/`rejected` → `med.remoteOperation.failed` con causa (M10 puede emitir OT de corte físico); `unknown` → consulta de estado antes de reintentar.
5. Cancelación: si la orden de origen se anula antes del envío, la operación pasa a `cancelled`.

### 9.9 Recarga prepaga

1. Caja/POS/portal pide `POST /api/med/prepaid/{accountId}/pre-sale` (API-MED-55): MED llama `validatePreSale` y devuelve resultado (y unidades estimadas por importe según M04).
2. M07 cobra y publica `cob.payment.confirmed` con referencia a la recarga.
3. JOB-MED-13 `med:solicitar-credito-prepago` crea/actualiza `prepaidTopUps` (`requested`) y llama `topUp` con `idempotencyKey`.
4. Token emitido → se cifra, se entrega al canal (impresión/visualización/notificación) → `delivered`. Crédito en línea → `applied` tras `topUpStatus`.
5. Falla → reintentos; agotados → bandeja de recargas fallidas (PAN-MED-25): reintentar o pedir devolución (M07).
6. JOB-MED-14 `med:conciliar-prepago` diario compara `topUpHistory` del proveedor con recargas cobradas.

### 9.10 Estimación (JOB-MED-05 `med:estimar`)

1. Universo: tareas no leídas del lote, consumos marcados, o selección masiva (PAN-MED-14).
2. Para cada punto/canal aplica la cadena de métodos (RN-MED-084) y guarda método y base.
3. Calcula estado estimado (RN-MED-067) y crea consumo `estimated`.
4. Si el parámetro exige autorización, crea solicitud en T11 y deja el consumo `inReview`.
5. Actualiza `consecutiveEstimates`; si supera el tope, emite `med.point.inspectionRequested` (RN-MED-090).

### 9.11 Regularización de estimados (JOB-MED-08 `med:regularizar-estimados`)

1. Busca puntos cuya última lectura del rango fue estimada y que luego recibieron lectura real (filtros opcionales: solo telemedidas, solo medidor actual).
2. Calcula períodos y unidades a regularizar (RN-MED-089).
3. Crea `consumptionAdjustments` `proposed` con método según el servicio (PA-MED-01).
4. Aprobación (PAN-MED-15); al aprobar, `med.consumptionAdjustment.approved` → M04/M05 lo aplica en la próxima liquidación (compensación) o refactura (NC/ND).

### 9.12 División, agrupación y distribución (JOB-MED-06 `med:dividir-consumos`, JOB-MED-07 `med:distribuir-consumos`)

- División: universo por servicio y período, excluye multimedidor (RN-MED-096), aplica el modo (RN-MED-091 a 095), conserva el original como `netQuantity`, preview e impresión antes de confirmar.
- Distribución: por cada distribución vigente con padre aprobado en el período, valida no duplicación (RN-MED-099) y tope (RN-MED-098), crea consumos de hijos y compensatorio del padre con `runId`; reversión por `runId`.

### 9.13 Demanda y transgresiones (JOB-MED-09 `med:detectar-transgresiones`)

Al aprobar consumos de canales de demanda: compara registrada vs. contratada del período, crea `demandTransgressions`, actualiza declarada, emite `med.demand.transgressionDetected`. Revisión periódica de 6 meses (RN-MED-102). Reset con aprobación (RN-MED-103).

### 9.14 Generación distribuida (JOB-MED-15 `med:balance-inyeccion`)

Al aprobar los consumos de un punto con contrato GD conectado: calcula `injectionBalances` (demanda, inyección, neto, por banda) y emite `med.injectionBalance.approved` para M04/M05/M07.

### 9.15 Autolectura

1. JOB-MED-16 `med:abrir-ventanas-autolectura` abre la ventana según cronograma y emite `med.selfReadingWindow.opened` (T09 notifica).
2. El socio envía estado y foto (API-MED-72); validaciones RN-MED-056.
3. La lectura entra como `captured` origen `selfReading` y sigue 9.4. Si la política lo permite y queda dentro de rango, la tarea de la ruta se marca "resuelta por autolectura" (PA-MED-06).
4. Resultado al socio: `med.selfReading.accepted` / `med.selfReading.rejected`.

### 9.16 Cambio de medidor desde OT (M10)

1. M10 cierra la OT y publica `tec.workOrder.closed` con lecturas de retiro y colocación, medidor nuevo, precintos y fotos.
2. MED (consumidor idempotente por `workOrderId`) ejecuta retiro + instalación (RF-MED-018) en una transacción, crea lecturas `captured` purpose `removal`/`installation` y las valida.
3. Calcula el consumo del medidor retirado hasta el retiro y deja preparado el tramo del nuevo (RN-MED-094).
4. Si la OT trae categoría nueva, emite `med.installation.categoryChangeRequested` (M01/M02 aplica).
5. Si el medidor es telemedido, encola `replaceMeter` en el sistema remoto (no bloquea la OT).
6. Emite `med.meter.removed` y `med.meter.installed` (M13 mueve stock).

### 9.17 Recuperación y reintentos

Todos los jobs son idempotentes, registran progreso y se reanudan; los consumidores de eventos usan el `eventId` para no reaplicar; las operaciones remotas usan `idempotencyKey`; las fallas no reparables van a la bandeja técnica de T06 con responsable (AGR-016).

## 10. Pantallas

Todas las pantallas admin usan AdminShell, `AdminStickyHeader`, `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` (columnas configurables, filtros, vistas guardadas, exportar XLSX/CSV/PDF, selección masiva), modales `sm/md/lg/xl`, toasts y `ConfirmDialog`. Lecturas, estados e importes en IBM Plex Mono. La PWA usa AppShell `.pwa-mod`, cards de anatomía fija, alta en modal desde FAB, 3 skeleton cards, errores inline y cola offline única. Etiquetas por `dict:`.

| PAN-ID | App | Ruta | Capability | Propósito | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|
| PAN-MED-01 | admin | `/med/config/catalogos` | `med.catalogos.ver` / `med.catalogos.configurar` | Marcas, tipos/modelos, observaciones de lectura y de medidor, resultados, condiciones. | ABM de `MARMED`, `TIPMED`, `OBSESTAD`, `OBSMED`, `RESESTAD`, `CERESTAD` (Configuración) |
| PAN-MED-02 | admin | `/med/medidores` y `/med/medidores/:id` | `med.medidores.ver` | Listado y ficha del medidor con trayectoria, ensayos, precintos, adjuntos. | Ficha del medidor (DFA M5) |
| PAN-MED-03 | admin | `/med/puntos` y `/med/puntos/:id` | `med.puntos.ver` | Punto de medición: canales, medidor vigente, instalaciones, ruta, testigo, GD, prepago, telemetría. | Datos del servicio medido (`SERSOC`/`MEDSOC`) |
| PAN-MED-04 | admin (modal xl) | desde PAN-MED-02/03 | `med.instalaciones.crear` | Asistente de instalación, retiro y cambio de medidor. | `frmTecnica_CambioMedidor` (M10, referencia) |
| PAN-MED-05 | admin | `/med/rutas` | `med.rutas.ver` | ABM de rutas con vista previa en mapa. | Administración de rutas (Telemed > Administración) |
| PAN-MED-06 | admin | `/med/cronograma` | `med.cronograma.ver` | Calendario de lectura por servicio/ciclo/ruta y ventanas de autolectura. | (nuevo, MER-018) |
| PAN-MED-07 | admin | `/med/lotes` | `med.lotes.ver` | Lotes: generar, asignar, exportar, seguimiento de avance en lista y mapa. | Generar/exportar rutas (`clsTelemed`, `clsPMovil`) |
| PAN-MED-08 | admin | `/med/lotes/:id` | `med.lotes.ver` | Detalle y revisión del lote con filtros, confirmación, cierre. | Detalle de ruta (`clsDetalleRuta`) |
| PAN-MED-09 | admin | `/med/lecturas/registro` | `med.lecturas.crear` | Registro manual de lecturas. | `frmRegistroLecturas` |
| PAN-MED-10 | admin | `/med/lecturas/importar` y `/med/config/perfiles-importacion` | `med.lecturas.importar` | Importación de archivos y perfiles de mapeo. | Importación de archivos de terceros (Telemed) |
| PAN-MED-11 | admin | `/med/excepciones` | `med.excepciones.ver` | Bandeja de excepciones de consumo. | Filtro "fuera de rango" + `CTRLCNC` |
| PAN-MED-12 | admin | `/med/consumos/servicio/:contractId` | `med.consumos.ver` | Consumos del servicio: historial, gráfico, acciones. | `frmConsultaConsumoMedido` (+ `DatosConsumo`, `DatosConsumo_Medidos`) |
| PAN-MED-13 | admin (modal lg) | desde PAN-MED-12 | `med.lecturas.corregir` | Corrección de lectura/consumo con versión. | `abm_Cons_Ser` |
| PAN-MED-14 | admin | `/med/consumos/estimacion` | `med.consumos.estimar` | Estimación masiva con recálculo, inversión de selección y "sumar mes". | `frmConsumosEstimacion`, `frmInformesConsumos` (estimar) |
| PAN-MED-15 | admin | `/med/consumos/regularizacion` | `med.ajustes.crear` | Regularización de estimados. | `frmBonificacionEstimados` |
| PAN-MED-16 | admin | `/med/consumos/division` | `med.consumos.dividir` | División/agrupación/prorrateo masivo. | `frmAgrupaDivideConsumos` |
| PAN-MED-17 | admin | `/med/consumos/distribuciones` | `med.consumos.distribuir` | ABM y ejecución de distribuciones. | `abm_DstConsumos`, `frmDistribucionConsumos` |
| PAN-MED-18 | admin | `/med/testigos` | `med.testigos.ver` | Medidores testigo y sus consumos. | `frmConsultaConsumoMedidoTestigo` |
| PAN-MED-19 | admin | `/med/demanda` | `med.demanda.ver` | Demanda contratada por período y transgresiones. | `frmTransgresiones` |
| PAN-MED-20 | admin | `/med/config/factores-gas` | `med.gas.configurar` | Factores de corrección de gas por período/categoría. **Reemplazado por PAN-TAR-09 (HUE-GAS-03):** la carga se hace en M04; M03 solo muestra los factores vigentes en la ficha del punto (solo lectura). | ABM `FACTOR_CAL` (Facturación) |
| PAN-MED-21 | admin | `/med/medicion-propia` | `med.medicionPropia.ver` | Medición propia y pérdidas. | `frmRegistroConsumoPropio`, `frmRegistroMedidoPropio`, `frmPerdidasServiciosMedidos` |
| PAN-MED-22 | admin | `/med/informes` | `med.informes.ver` | Informes y controles de consumo. | `frmInformesConsumos`, `frmImpresiones` |
| PAN-MED-23 | admin | `/med/config/telemedicion` | `med.telemedicion.configurar` | Sistemas de telemedición/prepago y mapeo de registros. | Telemed > Configuración (`TELEMEDICION`, `LEC_MEDTEL`) |
| PAN-MED-24 | admin | `/med/telemedicion/operaciones` | `med.telemedicion.ver` | Operaciones y comandos remotos, toma de estado puntual, auditoría. | `frmComandosTelemedicion`, `frmOperacionesTelemedicion`, Telemed > Informes |
| PAN-MED-25 | admin | `/med/prepago` | `med.prepago.ver` | Cuentas prepagas, recargas, tokens, fallidas, conciliación. | Recarga en `frmVentaPrepaga` (M07) — aquí la parte técnica |
| PAN-MED-26 | admin | `/med/generacion-distribuida` | `med.gd.ver` | Contratos GD y balances. | (nuevo, MER-001) |
| PAN-MED-27 | admin | `/med/tablero` | `med.informes.ver` | Tablero de lecturas y consumos. | (nuevo) |
| PAN-MED-28 | pwa-campo | `/campo/lecturas` | `med.campo.leer` | Mis rutas/lotes asignados, descarga, avance. | App PMovil / Captor |
| PAN-MED-29 | pwa-campo | `/campo/lecturas/:batchId/:taskId` | `med.campo.leer` | Captura de lectura. | App PMovil / Captor |
| PAN-MED-30 | pwa-campo | banner + `/campo/sincronizacion` | `med.campo.sincronizar` | Estado de la cola, reintentos, ítems en conflicto. | (nuevo) |
| PAN-MED-31 | pwa-socio | `/mis-servicios/:id/consumos` | `med.misConsumos.ver` | Mis consumos. **Componente embebido en PAN-POR-47 (HUE-SRV-04):** la ruta y el permiso de pantalla son de M19 (`/app/consumos`, `por.consumos.ver`); M03 aporta el componente y API-MED-70..73. | "Mi Medidor" (V2 PMovil 55) |
| PAN-MED-32 | pwa-socio | `/mis-servicios/:id/autolectura` | `med.autolectura.crear` | Autolectura. **Componente embebido en PAN-POR-48 (HUE-SRV-04):** ruta `/app/autolectura/:contractId` de M19; M03 conserva sus APIs y reglas. | (nuevo, MER-018) |
| PAN-MED-33 | pwa-socio | `/mis-servicios/:id/prepago` | `med.miPrepago.ver` | Mi prepago. **Componente embebido en PAN-POR-49 (HUE-SRV-04):** ruta `/app/prepaga` de M19; M03 conserva sus APIs. | Recarga desde portal (`AutorizarPrepaga`) |
| PAN-MED-34 | admin | `/med/conflictos` | `med.conflictos.resolver` | Conflictos de sincronización offline. | (nuevo, AGR-025) |
| PAN-MED-35 | admin | `/med/consumos/cambio-clase` | `med.consumos.aprobar` | Propuestas de cambio de clase por consumo. | `Get_ServiciosClase` (proceso masivo de Titulares) |

### 10.1 Detalle de pantallas

**PAN-MED-01 Catálogos de medición.** Layout: pestañas por catálogo, cada una con DataTable y alta/edición en modal `md`. Filtros: servicio, estado. Columnas por catálogo según §7.1. Acciones: crear, editar, desactivar, exportar. En observaciones de lectura: selector de efecto, tipo de OT a pedir (catálogo de M10), check de foto obligatoria y "bloquea lectura". Vacío: "Todavía no cargaste {catálogo}". Ayuda: para qué sirve cada efecto y ejemplo "Medidor roto → pedir OT de cambio".

**PAN-MED-02 Medidores.** Listado: filtros servicio, marca, tipo, estado de activo, telemedido, prepago, instalado en zona; columnas número, marca, tipo, dígitos, factor, estado, punto actual, último ensayo. Acciones: nuevo (modal `lg`), importar (ExcelImportWizard), exportar. Ficha: cabecera con número y estado; pestañas Datos metrológicos (con registros), Trayectoria (línea de tiempo de instalaciones con lecturas inicial/final), Ensayos (alta en modal), Precintos, Observaciones, Adjuntos, Auditoría. Acciones: editar (solo campos no metrológicos si está instalado; cambios metrológicos exigen retiro o nueva versión), registrar ensayo, registrar precinto. Vacío: "No hay medidores: importalos desde stock".

**PAN-MED-03 Punto de medición.** Listado: filtros servicio, tipo de punto, zona/sector, ruta, estado, prepago, telemedido, GD, con/sin medidor. Ficha: cabecera (titular, cuenta, servicio, categoría vigente, domicilio con mapa), pestañas Canales (orden por concepto, valor contratado), Medidor e instalaciones, Lecturas, Consumos (vínculo a PAN-MED-12), Ruta y acceso, Testigo, Demanda, GD, Prepago, Telemetría (operaciones), Excepciones. Acciones: instalar/retirar/cambiar (PAN-MED-04), proponer canales por categoría, asignar testigo, editar ZSR.

**PAN-MED-04 Asistente de instalación/retiro/cambio (modal xl).** Pasos: 1) operación (instalar, retirar, cambiar); 2) medidor nuevo (búsqueda solo de disponibles compatibles, muestra motivo de incompatibilidad); 3) fecha efectiva y OT de origen; 4) lecturas de retiro y colocación por registro con validación de dígitos; 5) mapeo registro → canal (propuesto); 6) precintos y fotos; 7) resumen con impacto en consumo del período. Confirmar ejecuta atómicamente.

**PAN-MED-05 Rutas.** DataTable (código, nombre, servicios, criterio, puntos incluidos, orden, último lote). Modal `xl` de edición con constructor de criterio (zona/sector/recorrido, calles con rango y paridad, rango de cuentas, polígono en mapa), categorías, inclusión de desconectados, filtro de telemedidos, prepagos para control, campos al dispositivo, lecturistas por defecto; vista previa con conteo y mapa. Acción "Renumerar recorrido por última toma" (RF-MED-027) con diff antes/después.

**PAN-MED-06 Cronograma.** Vista calendario mensual y vista tabla por ruta; edición de fechas y ventanas (lectura y autolectura); publicar; alerta de rutas sin fecha o sin lecturista.

**PAN-MED-07 Lotes.** DataTable (código, ruta, período, origen, estado, % avance, lecturistas, excepciones). Acciones: generar (modal: ruta(s), período), asignar (modal: dividir por lecturista o por rango de secuencia), exportar a archivo (perfil, uno por ruta o consolidado), imprimir planilla, cancelar. Vista mapa con tareas coloreadas por estado.

**PAN-MED-08 Detalle del lote.** Cabecera con contadores. DataTable de tareas: secuencia, cuenta, titular, domicilio, medidor, canal, lectura anterior, actual, consumo, rango, observación, foto, lecturista, estado. Filtros: consumo mayor/menor que, con observación, con foto, por lecturista, por fechas, solo fuera de rango, solo estimadas, solo rechazadas, en conflicto. Acciones por fila: ver fotos, corregir, estimar, marcar error, pedir relectura; masivas: estimar no leídos, confirmar lote, cerrar lote (modal con decisión de pendientes), reabrir.

**PAN-MED-09 Registro manual de lecturas.** Encabezado: fecha, período (mes/año), servicio, buscador de titular/cuenta, observación (catálogo), check "Consumo estimado", botón "Consulta de consumos" (abre PAN-MED-12). Grilla por canal: servicio, fecha anterior, lectura anterior, consumo anterior, lectura actual (editable), consumo actual (calculado), tipo de energía, concepto. Panel lateral de datos del servicio: categoría, característica, medidor, dígitos, domicilio, factor, cos φ, indicado. Grilla inferior de consumos anteriores: categoría, medidor, fecha y lectura anterior, fecha y lectura actual, días, consumo, período, factura. Botones: "Correcto" (confirma), "Aplicar último consumo del testigo", "Limpiar". Advertencias en línea (rango, vuelta, dígitos).

**PAN-MED-10 Importación.** ExcelImportWizard: subir → elegir perfil → preview (filas válidas, con error, duplicadas, no emparejadas) → confirmar → resultado con vínculo al lote. Sub-pantalla de perfiles: DataTable + editor (formato, columnas por posición/encabezado, emparejamiento, relleno, decimales, fecha, mapeo de conceptos, servicio por defecto, observación postal obligatoria, corrección de cabecera) con prueba sobre archivo de ejemplo.

**PAN-MED-11 Bandeja de excepciones.** DataTable: regla, severidad, servicio, cuenta, titular, período, consumo, referencia, variación, antigüedad, lote, lecturista. Filtros: regla, severidad, zona, ruta, categoría, lecturista, estado, antigüedad. Panel lateral con historial de 13 períodos y fotos. Acciones: aprobar como real (exige justificación codificada), corregir lectura (PAN-MED-13), pedir relectura (crea tarea en lote de relectura), estimar, derivar a inspección (M10), confirmar vuelta, bloquear/desbloquear; masivas con la misma justificación.

**PAN-MED-12 Consumos del servicio.** Buscador de cuenta y servicio (opción "fijar servicio"), selector de medidor/canal, rango de fechas y de propiedades. Grilla de consumos con origen y estado; gráfico de barras (real vs estimado) con interanual. Acciones (según capability): agregar consumo, agregar consumo adicional, modificar (no facturado / sin estado), eliminar no facturado (anular), actualizar categoría, carga técnica (vínculo a OT), ver adjuntos, imprimir (con/sin gráfico, resumen, resumen con subtotales, agrupado), imprimir factura (M05), imprimir cuenta corriente de energía (M07), imprimir comprobante de recarga (prepago), guardar/restablecer vista. El detalle de llamadas telefónicas (`ImprimirDetalleLlamadas`, `DatosConsumo_Telefonico*`) se reemplaza por la pantalla de M10.

**PAN-MED-13 Corrección (modal lg).** Muestra versión vigente y anteriores; campos editables: estado, fecha, observación, categoría (si no facturado); motivo obligatorio; preview del recálculo de consumos dependientes.

**PAN-MED-14 Estimación masiva.** Filtros: servicio, período, zona, ruta, categoría, sin lectura, con observación. Grilla con selección (invertir selección), método propuesto, base, consumo estimado editable con justificación, opción "sumar mes", "sin decimales", "con propiedad adicional", "testigo". Botones: recalcular, guardar (crea estimaciones; solicitud de autorización si corresponde).

**PAN-MED-15 Regularización.** Filtros: servicio, rango de períodos, solo telemedidas, solo medidor actual. Grilla: servicio, períodos estimados, unidades estimadas, unidades reales, diferencia, método, redondeo. Acciones: proponer, aprobar, rechazar, imprimir.

**PAN-MED-16 División.** Filtros: servicio, período, tipo de proceso (mitades, días máximos, limitar, cambio de medidor, prorrateo), redondeo, ver excluidos. Grilla de preview con tramos resultantes; mostrar testigo; imprimir; aceptar.

**PAN-MED-17 Distribuciones.** DataTable de distribuciones (padre, modo, hijos, % total, tope). Modal de edición: agregar/quitar hijos, calcular porcentaje, igualar, combinada con tope; validación de suma 100 % y de hijo único. Pestaña Ejecuciones: buscar por período, generar consumos, revertir, imprimir detalle.

**PAN-MED-18 Testigos.** Listado de puntos testigo con servicios asociados; ficha con lecturas y consumos (agregar, modificar no facturado, anular, estimar), gráfico e impresión.

**PAN-MED-19 Demanda y transgresiones.** Pestaña Demanda contratada (por punto/período, edición con vigencia); pestaña Transgresiones (filtros servicio, fecha de primera o última transgresión; columnas contratada, registrada, %, primera transgresión, declarada); acción "Resetear demanda declarada" (aprobación).

**PAN-MED-20 Factores de gas.** (Reemplazado por PAN-TAR-09, HUE-GAS-03; se conserva la descripción original.) DataTable por período y categoría (presión, temperatura, factor calórico, fuente, estado); alta en modal; aprobar; importar desde planilla de la distribuidora.

**PAN-MED-21 Medición propia y pérdidas.** Pestaña Puntos propios; pestaña Registro de lecturas/consumos propios (grilla de 6 registros, "Correcto", "Inicializar"); pestaña Pérdidas (filtros servicio, período, anual 13 períodos, por zonas; columnas compra activa, reactiva, cos φ, facturado, pérdida, %); exportar.

**PAN-MED-22 Informes.** Selector de informe (consumos por categoría, agrupados por tramas, control de medidores sin leer, variación porcentual, desvío de días, grandes consumos, con/sin consumo, estimados, medidores indicados, períodos mayores, productividad de lecturistas), filtros dinámicos (servicio, período desde/hasta, tipo de fecha, orden, propiedad adicional), salida PDF/XLSX/CSV. Cada informe muestra en ayuda su fórmula y universo (sección 15).

**PAN-MED-23 Telemedición — configuración.** DataTable de sistemas (proveedor, familias, servicios, salud, operaciones soportadas). Modal: datos del proveedor, referencia a credencial en bóveda (botón "Actualizar credencial" que abre el flujo de la bóveda de T06, DEC-074), opciones específicas (Discar: número de contrato, preventa, reglas OT), política de reintentos, prueba de conexión. Pestaña Mapeo de registros por tipo de medidor y categoría.

**PAN-MED-24 Operaciones remotas.** DataTable: fecha, punto, medidor, sistema, operación, origen (módulo/orden/usuario), estado, intentos. Filtros por estado, operación, sistema, fechas. Detalle con log saneado. Acciones: toma de estado puntual, reintentar (si `failed`/`unknown` tras consulta), cancelar (si `queued`). Los comandos de corte/reconexión no se pueden iniciar desde aquí sin orden de origen.

**PAN-MED-25 Prepago.** Pestañas Cuentas prepagas (punto, medidor, proveedor, modo, saldo informado, umbral), Recargas (estado, canal, importe, unidades, token enmascarado), Fallidas (reintentar, pedir devolución), Conciliación diaria (diferencias). Reimprimir comprobante/token.

**PAN-MED-26 Generación distribuida.** DataTable de contratos (titular, punto, clase, potencias, estado, régimen); ficha con documentación, equipo, instalador, balances por período (demandada, inyectada, neto, por banda); acciones: crear, observar, aprobar, conectar, suspender, dar de baja.

**PAN-MED-27 Tablero.** Tarjetas: % leído del período, % estimado, excepciones abiertas por severidad, lotes atrasados, éxito de toma de estado, recargas fallidas; gráficos por zona/ruta/lecturista; enlaces a las bandejas.

**PAN-MED-28 Mis rutas (pwa-campo).** Cards por lote (ruta, período, tareas pendientes/total, estado de descarga). Botón descargar/actualizar. Mapa con tareas. Skeleton al cargar.

**PAN-MED-29 Tarea de lectura (pwa-campo).** Card del punto (dirección, acceso, número de medidor, registros a leer, lectura anterior y rango si están habilitados); teclado numérico por registro; selector de observación; resultado; cámara (foto obligatoria si corresponde); GPS automático; botones Guardar, No leído, Siguiente. Advertencias inline (fuera de rango con reingreso, menor que anterior, dígitos). Funciona sin red.

**PAN-MED-30 Sincronización (pwa-campo).** Banner único con contadores (pendientes, enviados, conflictos) y "Reintentar"; lista de ítems con estado por ítem.

**PAN-MED-31 Mis consumos (pwa-socio).** (Componente embebido en PAN-POR-47; HUE-SRV-04.) Card por servicio medido con último consumo y gráfico de 13 períodos; estimados marcados; detalle por período (fechas, lecturas, días, origen, foto si habilitado).

**PAN-MED-32 Autolectura (pwa-socio).** (Componente embebido en PAN-POR-48; HUE-SRV-04.) Disponible solo con ventana abierta; muestra número de medidor y foto de referencia; captura de foto del visor + estado; confirmación; resultado con estado (en revisión, aceptada, rechazada con motivo).

**PAN-MED-33 Mi prepago (pwa-socio).** (Componente embebido en PAN-POR-49; HUE-SRV-04.) Saldo informado y fecha; últimas recargas con token (mostrar/ocultar); botón "Recargar" que abre el flujo de pago de M19/M07; avisos de saldo bajo.

**PAN-MED-34 Conflictos.** DataTable: tarea, lecturista, tipo de conflicto (reasignada, cancelada, medidor cambiado, anterior modificada, duplicada), evidencias lado a lado; acciones: aceptar lectura del dispositivo, descartar con motivo, reasignar, crear relectura.

**PAN-MED-35 Cambio de clase por consumo.** Parámetros de la regla (tipo 1/2, rango, meses), ejecutar propuesta, grilla de candidatos con motivo, aprobar (envía a M01/M02) o descartar.

### 10.2 Formularios ProCoop sin pantalla propia en MED

| Formulario/elemento INV | Destino |
|---|---|
| `abm_InfoCtd` (configuración de informes por tramos/categorías: `INFOCTD`, `INFOCTG`, `INFOCTN`) | Reemplazado por M06 (configuración de informes regulatorios); MED aporta datasets (RF-MED-125). |
| `frmConsumosExportar` (configuración OCEBA 544, filas/columnas de informe, grandes consumos) | Reemplazado por M06; la impresión de grandes consumos queda en PAN-MED-22. |
| `frmInformeSecretariaElectrica` | Reemplazado por M06 (informe a Secretaría de Energía) con dataset de MED. |
| `frmInformeConsumoTramasCuedro` | Reemplazado por M04/M06 (consumos por tramas y cuadro tarifario); la versión de consumos agrupados por tramas está en PAN-MED-22. |
| Control `listTramas` | Reemplazado por M04 (editor de tramas). |
| `DatosConsumo_Telefonico`, `DatosConsumo_Telefonico_Fact`, `frmConsultaConsumoMedido.ImprimirDetalleLlamadas` / `chLlamadasFacturadas` | Reemplazado por M10 (telefonía). |
| `frmVentaPrepaga`, `frmVentaPrepagaRapida`, `frmConfiguracionPrepaga`, `frmConfiguracionPrepaga_TipoFac` (ProMod_Cobranzas) | M07/M11 (venta y cobro); MED provee API-MED-55/56. |
| `frmTecnica_CambioMedidor` (ProMod_Tecnica) | M10 (OT); MED provee PAN-MED-04 y el consumidor de cierre de OT. |

## 11. API

Paginación `?page=&size=` → `{ items, total, page, size }`; errores RFC 9457 con `requestId`; validación Zod compartida.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-MED-01 | GET | `/api/admin/med/catalogs/:catalog` | `med.catalogos.ver` | Lista un catálogo (`brands`, `meter-types`, `reading-observations`, `reading-results`, `reading-conditions`, `meter-observations`). | Sí (lectura) |
| API-MED-02 | POST/PATCH | `/api/admin/med/catalogs/:catalog[/:id]` | `med.catalogos.configurar` | Alta/edición de ítem de catálogo. | PATCH con `version` |
| API-MED-03 | GET | `/api/admin/med/meters` | `med.medidores.ver` | Listado de medidores con filtros. | Sí |
| API-MED-04 | GET | `/api/admin/med/meters/:id` | `med.medidores.ver` | Ficha + trayectoria. | Sí |
| API-MED-05 | POST | `/api/admin/med/meters` | `med.medidores.crear` | Alta de medidor. | `Idempotency-Key` |
| API-MED-06 | PATCH | `/api/admin/med/meters/:id` | `med.medidores.editar` | Edición (restricciones si instalado). | `version` |
| API-MED-07 | POST | `/api/admin/med/meters/import` | `med.medidores.crear` | Importación masiva (preview/confirm). | `Idempotency-Key` |
| API-MED-08 | POST | `/api/admin/med/meters/:id/tests` | `med.ensayos.crear` | Registrar ensayo. | `Idempotency-Key` |
| API-MED-09 | POST | `/api/admin/med/meters/:id/seals` | `med.precintos.crear` | Registrar precinto (colocar/retirar/violado). | `Idempotency-Key` |
| API-MED-10 | GET | `/api/admin/med/points` | `med.puntos.ver` | Listado de puntos. | Sí |
| API-MED-11 | GET | `/api/admin/med/points/:id` | `med.puntos.ver` | Ficha del punto. | Sí |
| API-MED-12 | POST/PATCH | `/api/admin/med/points[/:id]` | `med.puntos.editar` | Alta/edición de punto (ZSR, acceso, testigo). | `Idempotency-Key` / `version` |
| API-MED-13 | POST | `/api/admin/med/points/:id/channels` | `med.puntos.editar` | Alta/cierre de canal; `?propose=category` propone por categoría. | `Idempotency-Key` |
| API-MED-14 | POST | `/api/admin/med/installations` | `med.instalaciones.crear` | Instalar / retirar / cambiar (operación atómica). | `Idempotency-Key` |
| API-MED-15 | POST | `/api/admin/med/installations/:id/void` | `med.instalaciones.anular` | Anular instalación/retiro. | `Idempotency-Key` |
| API-MED-16 | GET/POST/PATCH | `/api/admin/med/routes[/:id]` | `med.rutas.ver` / `med.rutas.editar` (antes `med.rutas.*`; comodín solo admitido en plantillas de plataforma, T02) | ABM de rutas; `GET /:id/preview`. | `version` |
| API-MED-17 | POST | `/api/admin/med/routes/:id/renumber-proposal` | `med.rutas.editar` | Propuesta de renumeración (y `/apply`). | `Idempotency-Key` |
| API-MED-18 | GET/POST/PATCH | `/api/admin/med/calendars[/:id]` | `med.cronograma.ver` / `med.cronograma.editar` (antes `med.cronograma.*`; comodín solo admitido en plantillas de plataforma, T02) | Cronogramas; `POST /:id/publish`. | `version` |
| API-MED-19 | POST | `/api/admin/med/batches` | `med.lotes.crear` | Generar lote(s) (encola JOB-MED-01). | `Idempotency-Key` |
| API-MED-20 | GET | `/api/admin/med/batches[/:id]` | `med.lotes.ver` | Listado/detalle con contadores. | Sí |
| API-MED-21 | POST | `/api/admin/med/batches/:id/assign` | `med.lotes.asignar` | Asignar/reasignar tareas. | `Idempotency-Key` |
| API-MED-22 | POST | `/api/admin/med/batches/:id/export` | `med.lotes.exportar` | Exportar a archivo (perfil). | `Idempotency-Key` |
| API-MED-23 | GET | `/api/admin/med/batches/:id/tasks` | `med.lotes.ver` | Tareas con filtros de revisión. | Sí |
| API-MED-24 | POST | `/api/admin/med/batches/:id/confirm` | `med.lotes.confirmar` | Confirmar (encola JOB-MED-03). | `Idempotency-Key` |
| API-MED-25 | POST | `/api/admin/med/batches/:id/close` | `med.lotes.cerrar` | Cerrar con decisión de pendientes. | `Idempotency-Key` |
| API-MED-26 | POST | `/api/admin/med/batches/:id/reopen` | `med.lotes.reabrir` | Reabrir. | `Idempotency-Key` |
| API-MED-27 | POST | `/api/admin/med/batches/:id/cancel` | `med.lotes.cancelar` | Cancelar. | `Idempotency-Key` |
| API-MED-28 | GET | `/api/admin/med/batches/:id/print` | `med.lotes.ver` | Planilla de ruta PDF. | Sí |
| API-MED-29 | GET | `/api/med/field/batches` | `med.campo.leer` | Lotes asignados al lecturista. | Sí |
| API-MED-30 | GET | `/api/med/field/batches/:id/download` | `med.campo.leer` | Paquete de descarga con versiones. | Sí |
| API-MED-31 | POST | `/api/med/field/sync` | `med.campo.sincronizar` | Lote de mutaciones offline (`clientMutationId` por ítem); resultado por ítem. | Sí (`clientMutationId`) |
| API-MED-32 | POST | `/api/med/field/photos` | `med.campo.sincronizar` | Subida de foto (URL firmada) con `clientMutationId`. | Sí |
| API-MED-33 | POST | `/api/med/field/sessions` | `med.campo.leer` | Inicio/fin de jornada. | Sí (`clientMutationId`) |
| API-MED-34 | POST | `/api/admin/med/readings` | `med.lecturas.crear` | Lectura manual (uno o varios canales). | `Idempotency-Key` |
| API-MED-35 | POST | `/api/admin/med/readings/:id/correct` | `med.lecturas.corregir` | Nueva versión con motivo. | `Idempotency-Key` |
| API-MED-36 | POST | `/api/admin/med/readings/:id/void` | `med.lecturas.anular` | Anular. | `Idempotency-Key` |
| API-MED-37 | GET | `/api/admin/med/readings` | `med.lecturas.ver` | Consulta de lecturas por punto/canal/período/origen. | Sí |
| API-MED-38 | POST | `/api/admin/med/imports` | `med.lecturas.importar` | Subir archivo + perfil → preview. | `Idempotency-Key` |
| API-MED-39 | POST | `/api/admin/med/imports/:id/confirm` | `med.lecturas.importar` | Confirmar importación. | `Idempotency-Key` |
| API-MED-40 | GET/POST/PATCH | `/api/admin/med/import-profiles[/:id]` | `med.perfilesImportacion.configurar` | Perfiles de importación; `POST /:id/test`. | `version` |
| API-MED-41 | GET | `/api/admin/med/consumptions` | `med.consumos.ver` | Consumos con filtros (servicio, período, estado, origen). | Sí |
| API-MED-42 | POST | `/api/admin/med/consumptions/approve` | `med.consumos.aprobar` | Aprobación individual/masiva. | `Idempotency-Key` |
| API-MED-43 | POST | `/api/admin/med/consumptions/:id/block` y `/unblock` | `med.consumos.bloquear` | Bloquear/desbloquear. | `Idempotency-Key` |
| API-MED-44 | POST | `/api/admin/med/consumptions/additional` | `med.lecturas.crear` | Consumo adicional. | `Idempotency-Key` |
| API-MED-45 | PATCH | `/api/admin/med/consumptions/:id/category` | `med.consumos.aprobar` | Actualizar categoría de consumo no facturado. | `version` |
| API-MED-46 | GET | `/api/admin/med/exceptions` | `med.excepciones.ver` | Bandeja de excepciones. | Sí |
| API-MED-47 | POST | `/api/admin/med/exceptions/resolve` | `med.excepciones.resolver` | Resolver una o varias (acción + justificación). | `Idempotency-Key` |
| API-MED-48 | POST | `/api/admin/med/estimations` | `med.consumos.estimar` | Estimar (preview con `?dryRun=true` / confirmar). | `Idempotency-Key` |
| API-MED-49 | POST | `/api/admin/med/adjustments` | `med.ajustes.crear` | Proponer regularización/ajuste; `POST /:id/approve`, `/reject`. | `Idempotency-Key` |
| API-MED-50 | POST | `/api/admin/med/remote-operations` | `med.telemedicion.operar` / `med.telemedicion.comandoCorte` / `med.telemedicion.comandoReconexion` | Encolar operación remota (exige `originOrderId` para corte/reconexión). | `Idempotency-Key` obligatorio |
| API-MED-51 | GET | `/api/admin/med/remote-operations[/:id]` | `med.telemedicion.ver` | Consulta con log saneado. | Sí |
| API-MED-52 | POST | `/api/admin/med/remote-operations/:id/retry` y `/cancel` | `med.telemedicion.reintentar` | Reintentar/cancelar. | `Idempotency-Key` |
| API-MED-53 | POST | `/api/admin/med/telemetry/read` | `med.telemedicion.tomarEstado` | Toma de estado puntual o por lote. | `Idempotency-Key` |
| API-MED-54 | GET/POST/PATCH | `/api/admin/med/metering-systems[/:id]` | `med.telemedicion.configurar` | Sistemas y mapeos; `POST /:id/test-connection`. | `version` |
| API-MED-55 | POST | `/api/med/prepaid/:accountId/pre-sale` (también `/api/admin/...`) | `med.miPrepago.ver` (PWA, solo cuentas propias) / `med.prepago.ver` (admin) | Validar preventa y unidades estimadas. | `Idempotency-Key` |
| API-MED-56 | GET | `/api/admin/med/prepaid/accounts[/:id]` | `med.prepago.ver` | Cuentas prepagas y recargas. | Sí |
| API-MED-57 | POST | `/api/admin/med/prepaid/top-ups/:id/retry` y `/refund-request` | `med.prepago.reintentar` | Reintentar recarga fallida o pedir devolución a M07. | `Idempotency-Key` |
| API-MED-58 | GET | `/api/admin/med/prepaid/reconciliation` | `med.prepago.ver` | Conciliación diaria. | Sí |
| API-MED-59 | GET/POST/PATCH | `/api/admin/med/dg-contracts[/:id]` | `med.gd.ver` / `med.gd.editar` (antes `med.gd.*`; comodín solo admitido en plantillas de plataforma, T02) | Contratos GD; transiciones `/approve`, `/connect`, `/suspend`, `/terminate`. | `Idempotency-Key` |
| API-MED-60 | GET | `/api/admin/med/billing-feed` (servicio interno para M04/M05) | `med.jobs.ejecutar` | Contrato de datos de consumo aprobado por servicio y período (ver 13.3). | Sí |
| API-MED-61 | GET | `/api/admin/med/points/:id/history` | `med.consumos.ver` | Historial de consumos y lecturas para M10 (recupero) y M09 (reclamos). | Sí |
| API-MED-62 | POST | `/api/admin/med/splits` | `med.consumos.dividir` | División/agrupación (dryRun/confirmar). | `Idempotency-Key` |
| API-MED-63 | GET/POST/PATCH | `/api/admin/med/distributions[/:id]` | `med.consumos.distribuir` | ABM; `POST /:id/run`, `/runs/:runId/revert`. | `Idempotency-Key` |
| API-MED-64 | GET/POST | `/api/admin/med/witness` | `med.testigos.ver` | Testigos y consumos. | `Idempotency-Key` |
| API-MED-65 | GET/POST/PATCH | `/api/admin/med/demand` | `med.demanda.ver` / `med.demanda.editar` (antes `med.demanda.*`; comodín solo admitido en plantillas de plataforma, T02) | Demanda contratada; transgresiones; `POST /transgressions/:id/reset`. | `Idempotency-Key` |
| API-MED-66 | GET/POST/PATCH | `/api/admin/med/gas-factors[/:id]` | `med.gas.configurar` | Factores de gas; `POST /:id/approve`. **Reemplazado por API-TAR-030 (HUE-GAS-03):** M03 consume la API de M04 en lectura. | `version` |
| API-MED-67 | GET/POST | `/api/admin/med/own-metering` | `med.medicionPropia.ver` / `med.medicionPropia.editar` (antes `med.medicionPropia.*`; comodín solo admitido en plantillas de plataforma, T02) | Puntos y lecturas propias; `GET /losses`. | `Idempotency-Key` |
| API-MED-68 | GET | `/api/admin/med/reports/:report` | `med.informes.ver` / `med.informes.exportar` | Informes (sección 15); `?format=pdf\|xlsx\|csv`. | Sí |
| API-MED-69 | GET | `/api/admin/med/conflicts` y `POST /:id/resolve` | `med.conflictos.resolver` | Conflictos offline. | `Idempotency-Key` |
| API-MED-70 | GET | `/api/med/services/:contractId/consumptions` | `med.misConsumos.ver` | Mis consumos (solo servicios autorizados). | Sí |
| API-MED-71 | GET | `/api/med/services/:contractId/self-reading` | `med.autolectura.crear` | Estado de ventana de autolectura. | Sí |
| API-MED-72 | POST | `/api/med/services/:contractId/self-reading` | `med.autolectura.crear` | Enviar autolectura con foto. | `Idempotency-Key` |
| API-MED-73 | GET | `/api/med/services/:contractId/prepaid` | `med.miPrepago.ver` | Mi prepago. | Sí |
| API-MED-74 | GET | `/api/admin/med/class-reviews` y `POST` | `med.consumos.aprobar` | Propuestas de cambio de clase (A validar). | `Idempotency-Key` |
| API-MED-75 | GET | `/api/v1/ext/med/consumptions` | `bia.med.consumos.ver` (token de terceros; antes `ext.med.consumos.ver`, originalmente «token de terceros con scope `med.read`») | Consumos aprobados para BI del tenant (T10). | Sí |
| API-MED-76 | POST | `/api/v1/ext/med/readings` | `bia.med.lecturas.crear` (token de integración; antes `ext.med.lecturas.crear`, originalmente «token de integración con scope `med.readings.write`») | Ingreso de lecturas desde MDM/AMI del tenant (push). | `Idempotency-Key` |
| API-MED-77 | GET | `/api/admin/med/dashboard` | `med.informes.ver` | Indicadores del tablero. | Sí |
| API-MED-78 | GET | `/api/admin/med/purchase-volumes?serviceId=&period=&supplierId=` | `med.medicionPropia.ver` (y servicio interno para M12) | Volumen comprado por período de los puntos `purchase`/`boundary`, por punto, registro y franja, con origen y estado de validación (RF-MED-129; HUE-ELE-01, HUE-GAS-04). Solo lectura; la consume M12 para el control de la factura del mayorista. | Sí |

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox, en la misma transacción del cambio)

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-MED-01 | `med.meter.installed` | Instalación activa creada | M13 (salida de stock), M01 (punto con medidor), T06 (alta en sistema remoto) |
| EVT-MED-02 | `med.meter.removed` | Instalación cerrada | M13 (entrada/estado), M01 |
| EVT-MED-03 | `med.installation.voided` | Anulación | M13, M01 |
| EVT-MED-04 | `med.installation.categoryChangeRequested` | OT trae categoría nueva | M01/M02 |
| EVT-MED-05 | `med.readingBatch.generated` | Lote generado | T09 (aviso al lecturista) |
| EVT-MED-06 | `med.readingBatch.confirmed` | Lote confirmado | Tablero, M05 (avance de pre-facturación) |
| EVT-MED-07 | `med.readingBatch.closed` | Lote cerrado | M05 (ciclo), T10 |
| EVT-MED-08 | `med.reading.captured` | Lectura recibida | Tablero |
| EVT-MED-09 | `med.reading.corrected` | Nueva versión | M04/M05 (recalcular si en simulación), auditoría |
| EVT-MED-10 | `med.readingObservation.workOrderRequested` | Observación que pide OT | M10 |
| EVT-MED-11 | `med.consumption.approved` | Consumo aprobado | M04/M05 |
| EVT-MED-12 | `med.consumption.blocked` | Consumo bloqueado | M05 (observado en lote) |
| EVT-MED-13 | `med.consumption.voided` | Anulado | M04/M05 |
| EVT-MED-14 | `med.consumptionException.raised` | Excepción creada | Tablero, T09 (alerta interna) |
| EVT-MED-15 | `med.consumptionAdjustment.approved` | Ajuste aprobado | M04/M05 |
| EVT-MED-16 | `med.point.inspectionRequested` | Estimaciones consecutivas / no leído reiterado | M10 |
| EVT-MED-17 | `med.point.suspicionRaised` | Patrón de consumo no registrado | M10 (inspección), M09 |
| EVT-MED-18 | `med.demand.transgressionDetected` | Transgresión | M09 (aviso), M04 |
| EVT-MED-19 | `med.injectionBalance.approved` | Balance GD aprobado | M04, M05, M07, M06 |
| EVT-MED-20 | `med.dgContract.statusChanged` | Cambio de estado GD | M01, M06 |
| EVT-MED-21 | `med.remoteOperation.succeeded` | Operación remota confirmada | M08, M10, M01 |
| EVT-MED-22 | `med.remoteOperation.failed` | Operación remota fallida | M08, M10, T06 (bandeja) |
| EVT-MED-23 | `med.prepaidTopUp.delivered` | Token/crédito entregado | M07, M19, T09 |
| EVT-MED-24 | `med.prepaidTopUp.failed` | Recarga fallida tras cobro | M07 (devolución), T09 |
| EVT-MED-25 | `med.prepaidAccount.lowBalance` | Saldo bajo | T09 |
| EVT-MED-26 | `med.selfReadingWindow.opened` | Ventana abierta | T09 |
| EVT-MED-27 | `med.selfReading.accepted` / `med.selfReading.rejected` | Resultado | T09, M19 |
| EVT-MED-28 | `med.syncConflict.raised` | Conflicto offline | Supervisor (T09 interno) |
| EVT-MED-29 | `med.meteringSystem.healthChanged` | Salud de conector | T06, plataforma |
| EVT-MED-30 | `med.readingRoute.published` | Lote de una ruta exportado a un sistema de telemedición o colectora de terceros conectado por T06 (`assigned` → `downloaded` por exportación, §8.3; payload: `readingRouteId`, `readingBatchId`, `meteringSystemId`, `period`) | T06 (entrega la ruta al sistema remoto o colectora) |

### 12.2 Eventos consumidos

| Evento | Origen | Efecto en MED |
|---|---|---|
| `cat.contract.activated` (EVT-CAT-09) / `cat.contract.suspended` (EVT-CAT-10) / `cat.contract.terminated` (EVT-CAT-15) / `cat.contract.transferred` (EVT-CAT-17, cambio de titular) | M02 | Crea/actualiza punto; marca estado; GD sigue al suministro. |
| `cat.contract.categoryChanged` (EVT-CAT-19) | M02 | Nueva categoría vigente con fecha efectiva; propuesta de canales (GC); prepago. |
| `cat.contract.meteringRegimeChanged` (EVT-CAT-28) | M02 | A `metered`: crea el punto de medición y pide la instalación (RF-MED-012); a `unmetered`: retiro con lectura final a `effectiveAt` (RF-MED-022). Idempotente por `commandId` (RF-MED-128; HUE-AG-03). |
| `cmp.supplyBalance.approved` (EVT-CMP-16) | M12 | Incorpora comprado, medido en frontera y pérdida del balance aprobado al informe de pérdidas del período y zona (RF-MED-101); idempotente por `balanceId`. |
| `tec.workOrder.closed` | M10 | Instalación/retiro/cambio, lecturas de OT, precintos (9.16). |
| `tec.workOrder.cancelled` | M10 | Cancela operaciones remotas encoladas de esa OT. |
| `stk.equipment.applied` / `stk.equipment.retrieved` / `stk.equipment.swapped` (EVT-STK-04/05/06) | M13 | Proyección de `assetStatus`. M03 consume EVT-STK-04 aunque T11 no lo lista como consumidor (se informa a T11, 05-11-2026). |
| `fac.invoice.issued` (EVT-FAC-07) / `fac.invoice.annulled` (EVT-FAC-08) | M05 | Consumos `billed` / vuelta a `approved` según anulación. Con DEC-107 un comprobante con CAE que ARCA rechaza vuelve a borrador o a la cola y cambia de número, pero conserva su `invoiceId` y los períodos reservados (RN-FAC-164 de M05): M03 referencia siempre por `invoiceId` (`billingRef.invoiceId`, nunca por número), no revierte `billed` ante `fac.invoice.returnedToDraft` (EVT-FAC-22) y trata la reemisión (`fac.invoice.issued` con `issueAttempt` mayor) como idempotente sobre el mismo `invoiceId`. No muestra el número del comprobante, así que no consume `fac.invoice.renumbered` (EVT-FAC-23) (10-11-2026). |
| `cob.payment.confirmed` (recarga prepaga) | M07 | Solicitud de crédito/token. |
| `cob.refund.executed` | M07 | Recarga `voided`. |
| `mor.interruption.approved` (EVT-MOR-12; tipo corte o reconexión en el payload) | M08 | Operación remota si el medidor lo admite (o informa "no remoto"). |
| `wfl.approval.decided` | T11 | Aplica/rechaza estimaciones, ajustes, resets de demanda. |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia / disparo | Descripción |
|---|---|---|---|
| JOB-MED-01 | `med:generar-lotes` | Diario (según cronograma) y a pedido | 9.2. |
| JOB-MED-02 | `med:asignar-automatica` | A pedido | Divide tareas entre lecturistas por secuencia/zona. |
| JOB-MED-03 | `med:confirmar-lote` | A pedido / al completar recepción | 9.4. |
| JOB-MED-04 | `med:importar-lecturas` | A pedido | 9.6. |
| JOB-MED-05 | `med:estimar` | A pedido / al cerrar lote | 9.10. |
| JOB-MED-06 | `med:dividir-consumos` | A pedido / al confirmar lote | 9.12. |
| JOB-MED-07 | `med:distribuir-consumos` | Al aprobar padre / a pedido | 9.12. |
| JOB-MED-08 | `med:regularizar-estimados` | Al validar lectura real posterior a estimado; diario | 9.11. |
| JOB-MED-09 | `med:detectar-transgresiones` | Al aprobar demanda; mensual | 9.13. |
| JOB-MED-10 | `med:toma-estado` | Según cronograma / a pedido | 9.7. |
| JOB-MED-11 | `med:importar-ami` | Configurable por sistema (horario/diario) | 9.7. |
| JOB-MED-12 | `med:ejecutar-operaciones-remotas` | Continuo (cola) | 9.8. |
| JOB-MED-13 | `med:solicitar-credito-prepago` | Continuo (cola) | 9.9. |
| JOB-MED-14 | `med:conciliar-prepago` | Diario (hora PRM-MED-135) | 9.9. |
| JOB-MED-15 | `med:balance-inyeccion` | Al aprobar consumos GD | 9.14. |
| JOB-MED-16 | `med:abrir-ventanas-autolectura` | Diario | 9.15. |
| JOB-MED-17 | `med:detectar-sin-lectura` | Al cerrar ventana del cronograma | Informa medidores sin leer (RN-MED-083) y crea excepciones. |
| JOB-MED-18 | `med:detectar-consumo-no-registrado` | Mensual tras aprobación | Patrones de RF-MED-126. |
| JOB-MED-19 | `med:verificar-salud-conectores` | Cada 15 min | Salud de `meteringSystems`. |
| JOB-MED-20 | `med:depurar-logs-conector` | Diario | Aplica retención PRM-MED-133. |
| JOB-MED-21 | `med:archivar-fotos` | Mensual | Aplica PA-MED-09 (archivo frío). |
| JOB-MED-22 | `med:importar-curvas` | Diario (Extensión) | Curvas de carga (PA-MED-03). |

## 13. Integraciones

Marco general, contrato de conector, bóveda, reintentos, bandeja técnica y monitoreo en **T06 INT**. Particularidades de MED:

### 13.1 Conectores de medición y prepago (FIC 10.2, 10.3; RN-06 §19; RN-10 §9)

| Proveedor (ProCoop `SIS_TEL`) | Familia | Operaciones a soportar | Transporte de referencia | Decisión |
|---|---|---|---|---|
| Discar (1) | Medición + prepago | Alta, cambio de categoría, asignación, retiro, toma de estado (activa/reactiva T0..T6, demanda máx.), corte, reconexión, validar preventa, carga de crédito, estado de carga, historial | HTTP con comandos de ancho fijo | Adoptado (bajo demanda, PA-MED-12) |
| Partner (3) | — | — | No implementado | Descartado |
| Boiero, Boiero TSM (4, 12) | Prepago | Preventa, carga de crédito, estado | Según proveedor | Adoptado bajo demanda |
| AION (5) | Sincronización de servicios y transferencias | — | — | Reemplazado por M10/T06 (no es medición) **[VERIFICAR]** |
| NEXO, NEXO SQL, NEXO TCP2, NEXO PLUS (6, 7, 10, 13) | Medición/prepago | Toma de estado, carga de crédito | TCP propio / SQL | Adoptado bajo demanda; SQL directo solo vía agente o archivo (T06) |
| MikroTik (8), Radius Gretix (11), Radius (16), Sensa (15), SmartOLT (17), Sopnet (23), Wispro (26), Ispfull | ISP/TV | — | — | **Fuera de MED** → M10 (aprovisionamiento, O3) |
| CashPower, CashPower MWS (9, 18), C_Token (19) | Prepago por tokens | Preventa, token, estado, historial | Web service | Adoptado bajo demanda |
| BATCOM (14) | Prepago | Carga de crédito | Solo con V2 2713 + car 2264 = "BAT" | Adoptado bajo demanda; la condición V2 se reemplaza por configuración explícita |
| Hexing (20) | Medición inteligente y prepago | Toma de estado, comandos, prepago | REST | Adoptado bajo demanda |
| Rainbow (21) | Medición | Toma de estado / archivo | Archivo con columnas (V2 3074/3075) | Perfil de importación + conector |
| QUO, Silexis, Kaptor (22, 24, 25) | Toma de estado | Toma de estado | HTTP | Adoptado bajo demanda |
| Central telefónica (2) | Telefonía | — | XML | Fuera de MED → M10 |
| DEMI-AMI (Demitec, mercado) | AMI | Toma de estado | API o vistas SQL | Referencia de mercado (BASE §99) |
| Genérico REST / archivo | Medición | Toma de estado, ingreso push (API-MED-76) | REST / archivo | Núcleo |

### 13.2 Colectoras y app

- La app de lecturas es la PWA propia (pwa-campo), offline (CNX §3.7). Se reemplaza la base MySQL compartida entre cooperativas y el bucket común de fotos (`prccooponline`) por almacenamiento privado por tenant con URL firmadas (CTR-MED-07).
- Colectoras portátiles (PSION/Android por cable, protocolo de dispositivos portátiles de Windows, base SQLite `RUTA`): por archivo exportado/importado con perfil (PA-MED-11). El agente de hardware local (DEC-007, O10) puede automatizar la copia si una cooperativa lo exige.
- "ProCoop Connector" para aplicaciones de terceros (V2 451–455): se reemplaza por perfiles de importación y API-MED-76.

### 13.3 Contrato de datos hacia M04/M05 (`billing-feed`)

Por servicio contratado y período: lista de canales con `quantity` aprobada, `unit`, `channelType`, `touBand`, `conceptId`, `fromAt`, `toAt`, `days`, `origin`, `isEstimated`, `split` (grupo/segmento y modo), `categoryId` por tramo (si cambió en el período), `witnessQuantity` del intervalo, `registeredDemandKw` y `contractedDemandKw` por canal de demanda, `importedKwh`/`exportedKwh`/`netKwh` y `grossWithoutInjection`, ~~`gasCorrection` (volumen medido, factores y cantidad)~~ `gasMeasuredVolume` (volumen medido validado, sin corregir, y coeficiente corrector del punto; la corrección la aplica M04, DEC-085), `pendingAdjustments` (unidades a compensar), `ownership`, `prepaidMonthBilledQuantity` (prepago) y referencias a lecturas para explicar la factura. Los servicios con consumos bloqueados se informan con causa.

### 13.4 Otros

- Notificaciones (T09): eventos de 12.1.
- Mapas: Google Maps para rutas y geocerca (T03/T04); exportación KML de rutas (RN-10 §10, `clsDetalleRuta`).
- Reguladores (M06): datasets por categoría/tramo/período.

## 14. Parámetros de configuración

Ámbitos: **plataforma**, **tenant**, **servicio** (utility), **categoría**, **ruta**, **sistema** (conector). La configuración es versionada (T04).

### 14.1 Parámetros de CoopApps

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-MED-001 | `med.meter.numberUniqueness` | enum `utilityBrand`/`utility` | tenant | `utilityBrand` | Ámbito de unicidad del número de medidor. | — (RN-06 §23.1) |
| PRM-MED-002 | `med.meter.migrationDefaultDigits` | Int | tenant | 5 | Dígitos asumidos en migración cuando vienen en 0. | — (RN-06 §12.1) |
| PRM-MED-003 | `med.meter.requireStockItem` | Boolean | servicio | true | La instalación exige ítem serializado en M13. | V2 2416 (efecto de stock → M13) |
| PRM-MED-004 | `med.channel.orderByConcept` | Boolean | tenant | true | Ordenar canales por concepto. | V2 2520 |
| PRM-MED-005 | `med.installation.allowVoidLastMeterChange` | Boolean | tenant | true | Permitir anular el último consumo cargado por cambio de medidor. | V2 2658 |
| PRM-MED-006 | `med.meter.blockInstallOnRejectedTest` | Boolean | tenant | true | Bloquear instalación con ensayo rechazado. | — |
| PRM-MED-010 | `med.route.defaultOrder` | enum | ruta | `zoneSequence` | Orden de recorrido por defecto. | — (`ORDEN`) |
| PRM-MED-011 | `med.route.orderByLastReaderTake` | Boolean | ruta | false | Ordenar por la última toma del lecturista. | V2 2098 |
| PRM-MED-012 | `med.route.excludePrepaid` | Boolean | servicio | true | Excluir prepagos de rutas de facturación. | — (RN-06 §13.1) |
| PRM-MED-013 | `med.route.telemeteredDefault` | enum `exclude`/`only`/`all` | servicio | `exclude` | Filtro de telemedidos por defecto. | — (`TELEMED`) |
| PRM-MED-014 | `med.batch.flagRealReadingPriority` | Boolean | servicio | true | Marcar prioridad si el último consumo fue estimado. | V2 2559 |
| PRM-MED-015 | `med.batch.accessNotesSource` | enum `account`/`service` | tenant | `service` | Origen de observaciones postales. | V2 2809 |
| PRM-MED-016 | `med.batch.filterByInstallDate` | Boolean | servicio | true | Filtrar por fecha de alta al generar. | V2 720 |
| PRM-MED-017 | `med.batch.markDownloadedOnExport` | Boolean | tenant | false | Marcar descargado al exportar. | V2 2340 |
| PRM-MED-018 | `med.batch.exportOneFilePerRoute` | Boolean | tenant | false | Un archivo por ruta. | V2 2334 |
| PRM-MED-019 | `med.route.renumberStep` | Int | tenant | 5 | Paso de renumeración del recorrido. | — (`ActualizarRecorrido`) |
| PRM-MED-020 | `med.range.tolerancePercent` | Decimal | servicio/categoría | 50 | Tolerancia del rango esperado. | V2 439 |
| PRM-MED-021 | `med.range.referenceMethod` | enum `lastConsumption`/`movingAverage`/`seasonal`/`maxOfAverageAndSeasonal` | servicio/categoría | `maxOfAverageAndSeasonal` | Base del rango. | — (implicancia 7) |
| PRM-MED-022 | `med.range.movingAveragePeriods` | Int (1–12) | servicio | 6 | N períodos del promedio. | — |
| PRM-MED-023 | `med.range.absoluteMinimum` | Decimal | servicio/categoría | 0 | Mínimo absoluto de tolerancia (unidades). | — |
| PRM-MED-024 | `med.range.useSeasonality` | Boolean | servicio | true | Considerar mismo mes del año anterior. | — |
| PRM-MED-025 | `med.confirm.previousValueTolerance` | Decimal | tenant | 0,01 | Tolerancia del estado anterior al confirmar. | — (`ConfirmarRuta`) |
| PRM-MED-026 | `med.period.assignment` | enum `calendar`/`readingMonth` | servicio | `calendar` | Cómo se asigna el período (con zona horaria del tenant). | — (AGR-017) |
| PRM-MED-027 | `med.validation.digitsCheck` | Boolean | servicio | true | Validar estado contra dígitos. | V2 2088 |
| PRM-MED-028 | `med.rollover.maxPlausiblePercentOfMax` | Decimal | servicio | 20 | Si la vuelta implica consumo > % del máximo, se sugiere error de captura. | — |
| PRM-MED-029 | `med.consumption.precision` | enum `int`/`dec2`/`dec6` | servicio/canal | `dec2` | Precisión del consumo. | — (`Valores` 0/2/4) |
| PRM-MED-030 | `med.device.showAccessNotes` | Boolean | servicio/ruta | true | Enviar observación postal. | V2 458 |
| PRM-MED-031 | `med.device.showPreviousReading` | Boolean | servicio/ruta | false | Mostrar lectura anterior al lecturista. | V2 468 |
| PRM-MED-032 | `med.device.showPreviousConsumption` | Boolean | servicio/ruta | false | Mostrar consumo anterior. | V2 469 |
| PRM-MED-033 | `med.device.showZoneSectorSequence` | Boolean | servicio/ruta | true | Mostrar ZSR (y observación postal en la ruta). | V2 2293; PMovil 47 |
| PRM-MED-034 | `med.device.showCategory` | Boolean | servicio/ruta | false | Enviar categoría. | V2 2297 |
| PRM-MED-035 | `med.device.showServiceStatus` | Boolean | servicio/ruta | true | Enviar estado del servicio. | V2 2298 |
| PRM-MED-036 | `med.device.showRegistration` | Boolean | servicio/ruta | false | Enviar matrícula del servicio. | V2 2331 |
| PRM-MED-037 | `med.device.showBlockLot` | Boolean | servicio/ruta | false | Mostrar manzana y lote. | V2 748 |
| PRM-MED-038 | `med.device.showOwnership` | Boolean | servicio/ruta | false | Mostrar propiedad del servicio. | V2 3197 |
| PRM-MED-039 | `med.device.showCadastral` | Boolean | servicio/ruta | false | Enviar nomenclatura catastral. | PMovil 28 |
| PRM-MED-040 | `med.device.showRouteDescription` | Boolean | servicio/ruta | true | Mostrar descripción de la ruta en el detalle. | PMovil 69 |
| PRM-MED-041 | `med.device.showExpectedRange` | Boolean | servicio | false | Mostrar el rango al lecturista (solo se usa para advertir). | — (`LECMIN`/`LECMAX`) |
| PRM-MED-042 | `med.photos.linkToConsumption` | Boolean | tenant | true | Vincular fotos al consumo con metadatos (cuenta/medidor/concepto/fecha). | V2 2595; V2 2332 |
| PRM-MED-043 | `med.device.reentryOnOutOfRange` | Boolean | servicio | true | Reingreso fuera de rango. | — |
| PRM-MED-044 | `med.device.photoPolicy` | enum `always`/`outOfRangeOrObservation`/`observationOnly` | servicio | `outOfRangeOrObservation` | Foto obligatoria. | — (DFA mejora; `OBSESTAD.FOTO`) |
| PRM-MED-045 | `med.device.geofenceMeters` | Int | servicio | 150 | Distancia para advertencia de geocerca (0 = sin control). | — (CNX §7.8) |
| PRM-MED-046 | `med.additional.requiresApproval` | Boolean | tenant | true | Consumo adicional con aprobación. | — |
| PRM-MED-047 | `med.validation.percentVariationLimit` | Decimal | servicio/categoría | 100 | Límite de variación % contra período anterior. | — (`CalcularDiferenciaPorcentualConsumo`) |
| PRM-MED-048 | `med.validation.daysDeviationPercent` | Decimal | servicio | 20 | Desvío % de días de lectura. | — (`CalcularDiferenciaPorcentualDias`) |
| PRM-MED-050 | `med.selfReading.enabled` | Boolean | servicio | false | Habilitar autolectura. | PMovil 55 (Mi Medidor, referencia) |
| PRM-MED-051 | `med.selfReading.windowDays` | Int | servicio | 3 | Días de ventana antes de la fecha de lectura. | — |
| PRM-MED-052 | `med.selfReading.photoRequired` | Boolean | servicio | true | Foto obligatoria. | — (MER-018) |
| PRM-MED-053 | `med.selfReading.maxPerPeriod` | Int | servicio | 2 | Máximo de envíos por período. | — |
| PRM-MED-054 | `med.selfReading.resolvesRouteTask` | enum `never`/`ifInRange`/`always` | servicio | `never` | Si la autolectura resuelve la tarea de ruta. | — (PA-MED-06) |
| PRM-MED-055 | `med.selfReading.realReadingEveryNPeriods` | Int | servicio | 3 | Lectura de campo obligatoria cada N períodos aunque haya autolectura. | — (PA-MED-06) |
| PRM-MED-060 | `med.import.meterNumberPadding` | Int | perfil | 10 | Relleno del número de medidor. | — (RN-06 §13.3) |
| PRM-MED-061 | `med.import.allowDecimals` | Boolean | perfil | true | Decimales en importación/exportación. | V2 2087 |
| PRM-MED-062 | `med.import.fixedColumns` | Object | perfil | — | Columnas de formatos de ancho/posición fija (Rainbow). | V2 3074, 3075 |
| PRM-MED-063 | `med.import.defaultUtility` | String | perfil | — | Servicio por defecto en archivos de terceros. | V2 2054; V2 455 |
| PRM-MED-064 | `med.import.accessNotesRequired` | Boolean | perfil | false | Observación postal obligatoria. | V2 3140 (inverso) |
| PRM-MED-065 | `med.import.fixTxtHeaderAndDate` | Boolean | perfil | false | Corregir fecha y cabecera en txt. | V2 3063 |
| PRM-MED-066 | `med.import.defaultProfile` | ObjectId | servicio | — | Modelo de importación por defecto (y de intercambio con terceros). | V2 2307; V2 452; V2 451 |
| PRM-MED-067 | `med.reading.sourcePriority` | [enum] | servicio | `[workOrder, manual, fieldApp, telemetry, collectorFile, thirdPartyFile, selfReading]` | Prioridad ante lecturas duplicadas. | — (BASE §97.5) |
| PRM-MED-070 | `med.gas.optimalCalorificFactor` | Decimal | servicio | — (obligatorio si gas) | Factor calórico óptimo. **Reemplazado por PRM-TAR-050 (HUE-GAS-03); M03 lo lee.** | V2 14 (RN-01 §4.4) |
| PRM-MED-071 | `med.gas.rounding` | enum `truncInt`/`round0`/`none` | servicio | `round0` | Redondeo de la corrección. **Reemplazado por PRM-TAR-051 (HUE-GAS-03); M03 lo lee.** | V2 119 (RN-01 §4.4) |
| PRM-MED-072 | `med.gas.requirePressureTemperature` | Boolean | servicio | false | Exigir presión y temperatura en el factor. **Reemplazado por PRM-TAR-168 (HUE-GAS-03); M03 lo lee.** | — |
| PRM-MED-080 | `med.rule.zeroOnConnected.severity` | enum `off`/`info`/`review`/`blocking` | servicio/categoría | `review` | Severidad consumo cero. | — |
| PRM-MED-081 | `med.rule.negative.severity` | enum | servicio | `blocking` | Negativo sin canal de inyección. | — |
| PRM-MED-082 | `med.rule.outOfRange.severity` | enum | servicio/categoría | `review` | Fuera de rango. | — |
| PRM-MED-083 | `med.rule.percentVariation.severity` | enum | servicio/categoría | `info` | Variación %. | — |
| PRM-MED-084 | `med.rule.daysDeviation.severity` | enum | servicio | `info` | Desvío de días. | — |
| PRM-MED-085 | `med.rule.repeatedReading.periods` | Int | servicio | 3 | Lectura repetida N períodos (0 = sin control). | — |
| PRM-MED-086 | `med.rule.lowerThanPrevious.severity` | enum | servicio | `blocking` | Lectura menor que la anterior. | — |
| PRM-MED-087 | `med.rule.consumptionWhileDisconnected.severity` | enum | servicio | `blocking` | Consumo en servicio desconectado. | — (`Validar_ConsumoDesconectado`) |
| PRM-MED-088 | `med.rule.demandOverContracted.severity` | enum | servicio | `info` | Demanda > contratada (además de transgresión). | — |
| PRM-MED-089 | `med.rule.injectionWithoutContract.severity` | enum | servicio | `blocking` | Inyección sin GD. | — |
| PRM-MED-090 | `med.rule.consecutiveEstimates.severity` | enum | servicio | `review` | Estimaciones consecutivas. | — |
| PRM-MED-091 | `med.rule.missingGasFactor.severity` | enum | servicio | `blocking` | Falta factor de gas. | — |
| PRM-MED-092 | `med.approval.autoApproveClean` | Boolean | servicio | true | Aprobar automáticamente consumos sin excepciones. | — |
| PRM-MED-093 | `med.approval.dualControlUnits` | Decimal | servicio | 0 (desactivado) | Umbral de unidades de ajuste con doble control. | — |
| PRM-MED-100 | `med.estimate.defaultMethod` | enum `average`/`samePeriodLastYear`/`categoryAverage`/`regulatoryMinimum` | servicio | `average` | Método por defecto. | — (RN-06 §15; PA-MED-02) |
| PRM-MED-101 | `med.estimate.periods` | Int (1–12) | servicio | 6 | N períodos del promedio. | — (máx. 12) |
| PRM-MED-102 | `med.estimate.noDecimals` | Boolean | servicio | false | No usar decimales al estimar. | V2 2466 |
| PRM-MED-103 | `med.estimate.fallbackChain` | [enum] | servicio | `[samePeriodLastYear, categoryAverage, regulatoryMinimum]` | Cadena si no hay historia. | — (Duda 2) |
| PRM-MED-104 | `med.estimate.excludeEstimatedFromBasis` | Boolean | servicio | true | Excluir estimados de la base. | — |
| PRM-MED-105 | `med.estimate.requiresAuthorization` | enum `never`/`manualOnly`/`always` | servicio | `manualOnly` | Autorización de estimaciones. | — (BASE §9) |
| PRM-MED-106 | `med.estimate.onFieldObservation` | Boolean | servicio | true | Estimar automáticamente lecturas con observación que lo indique. | PMovil 29 |
| PRM-MED-107 | `med.estimateSettlement.method` | enum `unitCompensation`/`rebill` | servicio | `unitCompensation` | Método de regularización. | — (PA-MED-01) |
| PRM-MED-108 | `med.estimate.maxConsecutive` | Int | servicio | 2 | Estimaciones consecutivas antes de pedir inspección. | — (PA-MED-07) |
| PRM-MED-110 | `med.split.minDaysRatio` | Decimal | servicio | 1,10 | Desde qué proporción de días se divide. | — (RN-06 §16.1) |
| PRM-MED-111 | `med.split.maxDaysRatio` | Decimal | servicio | 3,00 | Hasta qué proporción se divide automáticamente. | — (RN-06 §16.1) |
| PRM-MED-112 | `med.split.defaultMode` | enum | servicio | `maxDays` | Modo por defecto. | — |
| PRM-MED-113 | `med.distribution.duplicateControl` | enum `period`/`month` | servicio | `period` | Control de redistribución duplicada (validando fechas de lectura). | V2 2618 |
| PRM-MED-120 | `med.demand.reviewMonths` | Int | servicio | 6 | Ventana de revisión de transgresiones. | — (`GetTransgresiones`) |
| PRM-MED-121 | `med.demand.notifyMember` | Boolean | servicio | true | Avisar al socio la transgresión. | — |
| PRM-MED-130 | `med.remote.commandsEnabled` | Boolean | sistema | false | Habilitar corte/reconexión remota. | — (BASE §97.5) |
| PRM-MED-131 | `med.remote.maxAttempts` | Int | sistema | 5 | Intentos máximos. | V2 2370 (NEXO SQL: 5 intentos) |
| PRM-MED-132 | `med.remote.retryDelaySeconds` | Int | sistema | 30 | Espera entre reintentos (y forzar reconexión de socket). | V2 2370; V2 2491 |
| PRM-MED-133 | `med.connectorLog.retentionDays` | Int | tenant | 365 | Retención de logs de conector. | — |
| PRM-MED-134 | `med.prepaid.tokenRequestTimeoutSeconds` | Int | sistema | 60 | Tiempo máximo antes de pasar a `unknown`. | — |
| PRM-MED-135 | `med.prepaid.reconciliationHour` | String `HH:mm` | tenant | `03:00` | Hora de conciliación diaria. | — |
| PRM-MED-136 | `med.prepaid.lowBalanceThreshold` | {quantity, days} | servicio | {quantity: 20, days: 3} | Umbral de saldo bajo. | — |
| PRM-MED-140 | `med.discar.contractNumberSource` | enum `account`/`clientId` | sistema | `account` | Número de contrato Discar. | V2 2504; V2 2336 |
| PRM-MED-141 | `med.discar.validatePreSale` | Boolean | sistema | true | Validar preventa. | V2 2594 |
| PRM-MED-142 | `med.discar.workOrderRules` | Object | sistema | — | Reglas al confirmar ciertas OT. | V2 3116 **[VERIFICAR]** |
| PRM-MED-143 | `med.discar.showConnectButton` | Boolean | sistema | false | Acción "Conectar servicio" de Discar visible en M10. | V2 3175 (TECNICA, referencia) |
| PRM-MED-150 | `med.field.syncMandatoryBeforeNewBatch` | Boolean | tenant | true | Obligar sincronización antes de descargar un lote nuevo. | PMovil 38 (inverso) |
| PRM-MED-151 | `med.field.captureChannel` | enum `pwa`/`file` | servicio | `pwa` | Medio de toma por defecto. | V2 2475 |
| PRM-MED-152 | `med.ui.routesServiceFilter` | Boolean | tenant | true | Mostrar filtro de servicios en administración de rutas. | V2 2992 |
| PRM-MED-153 | `med.reports.largeConsumersOrder` | enum `printOrder`/`productCode` | tenant | `printOrder` | Orden de grandes consumos. | V2 2590 **[VERIFICAR]** |
| PRM-MED-154 | `med.reports.largeConsumersEnabled` | Boolean | tenant | true | Habilitar impresión de grandes consumos. | V2 2568 |
| PRM-MED-155 | `med.portal.myConsumptionsEnabled` | Boolean | servicio | true | "Mis consumos" en la app del socio. | PMovil 55 |
| PRM-MED-156 | `med.portal.showReadingPhotos` | Boolean | servicio | false | Mostrar fotos de lectura al socio. | — |
| PRM-MED-157 | `med.photos.hotRetentionMonths` | Int | tenant | 24 | Meses en almacenamiento caliente antes de archivar. | — (PA-MED-09) |
| PRM-MED-158 | `med.inSituBilling.enabled` | Boolean | servicio | false | Facturación in situ. | — (PA-MED-05) |
| PRM-MED-159 | `med.loadProfiles.enabled` | Boolean | servicio | false | Curvas de carga. | — (PA-MED-03) |

### 14.2 Parámetros V2 sin parámetro propio en CoopApps

| V2 | Tabla/tipo | Descripción ProCoop | Destino |
|---|---|---|---|
| 72 (PMovil) | Lógico | Usar S3 para imágenes de lectura | Descartado: el almacenamiento privado por tenant es único (DEC-001). |
| 30 (PMovil) | Lógico | Crear OT desde PMovil | M10 (capability de la app de campo); MED usa RF-MED-049. |
| 2 (PMovil, módulo TECNICA) | Lógico | Agregar OT desde el captor | M10 (referencia). |
| 10 (PMovil, módulo TECNICA) | Lógico | Sincronización automática de lecturas | Descartado: la sincronización es siempre automática al haber red (CNX §3.7). |
| 451 | Lógico | Permitir importar desde aplicaciones de terceros (ProCoop Connector) | Reemplazado por PRM-MED-066 + API-MED-76 (se lee en `GuardarRutas` pero no se usa: Duda 10). |
| 452 | Lista | Modelo de intercambio de aplicaciones de terceros | Reemplazado por perfil (PRM-MED-066). |
| 453 / 454 | Texto | Rutas de carpeta por defecto para importar/exportar (`C:\`) | Descartado: no hay carpetas locales en SaaS. |
| 2241 | Texto | Ruta de búsqueda de la base en el teléfono | Descartado: sin captor USB directo (PA-MED-11). |
| 2345 | Lógico | Limpiar masivamente rutas sin alertas | Reemplazado por cancelación masiva auditada (RN-MED-042). |
| 518 / 519 | Carácter | Identificación de la cooperativa como cliente en la nube compartida | Descartado: `tenantId` (DEC-002). |
| 2399 | Lógico | Al retirar, borrar número de medidor y matrícula | Reemplazado (RN-MED-010). |
| 2682 | Lógico | Tomar categoría actual al confirmar | Reemplazado por categoría vigente por fecha efectiva (RN-MED-037). |
| 2416 | Lógico | Precio y depósito del stock trazable al mover el medidor | M13. |
| 2330 / 2455 | Entero / lógico | Transacción de cambio de categoría / aplicar al cerrar OT | M10/M02. |
| 3094 | Entero | Concepto de crédito por energía inyectada | M04/M05. |
| 2737 | Lógico | Inyección en la base del coseno fi / factura | M04. |
| 3103 | Lógico | Cargo fijo por trama ignorando inyectada | M04. |
| 2283 | — | Recargo por cambio de trama prepaga | M04. |
| 2491 / 2370 | Lógico / decimal | NEXO: reconexión de socket / segundos entre reintentos | PRM-MED-131/132 (política genérica). |
| 2713 + car 2264 | Lógico + carácter | Integración BATCOM | Configuración del conector BATCOM (T06); Duda 19 (doble significado) se resuelve en M10. |
| 2393 / 2897 | Carácter / lógico | MikroTik | M10. |
| 3011, 3012, 2962, 2963, 2832–2849, 2868, 2898, 3017, 3130, 3149–3151, 3180–3183, 2948 | Varios | OCEBA 544 y controles previos | M06 (informes regulatorios). |

## 15. Reportes, indicadores y exportaciones

Cada indicador declara fórmula, universo y fecha de corte (AGR-022). "Período" = período de consumo asignado (RN-MED-038).

| Reporte / indicador | Fórmula | Universo | Fecha de corte | Origen |
|---|---|---|---|---|
| % de lectura del período | puntos con lectura real validada / puntos en rutas del período × 100 | Puntos `customer` activos de servicios medidos, excluidos prepagos y telemedidos si se consulta campo | Cierre del cronograma | DFA M6 |
| % estimado | consumos `estimated` aprobados / consumos aprobados × 100 | Igual | Aprobación | BASE §9 |
| Medidores sin leer | puntos conectados sin lectura del período (se listan con 0 y marca "sin lectura") | Conectados (condición 2) | Fecha de consulta | RN-06 §23.7 |
| Variación porcentual | (actual / anterior − 1) × 100; anterior 0 → 1; filtro sobre valor absoluto salvo límite negativo; excluye ambos 0 | Por servicio y concepto | Período elegido vs anterior | RN-06 §23.7 |
| Desvío de días | \|días − días esperados\| / días esperados × 100 > límite | Consumos del período | Período | RN-06 §23.7 |
| Consumos por categoría | Σ cantidad aprobada por categoría y canal; cantidad de servicios | Por tipo de fecha: lectura, emisión o vencimiento | Elegida | RN-06 §23.7 (`Get_ConsumosPorCategoriaFiltros`) |
| Agrupados por tramas | Σ cantidad por tramo de la categoría (tramos de M04) | Consumos aprobados | Período | INV `frmInformesConsumos.Imprimir_AgrupadosTramas` |
| Grandes consumos | Puntos GC con todos sus canales, ordenados por orden de impresión o código de producto (PRM-MED-153) | Categorías GC | Período | V2 2568, 2590 |
| Con/sin consumo, estimados, indicados, períodos mayores | Filtros de `frmInformesConsumos` (`chkConSinCons`, `chkConsEst`, `chkMedInd`, `chkPerMay`, `chkDescConCons`) | Consumos | Período | INV |
| Pérdidas | pérdida = compra − facturado; % = pérdida × 100 / compra; cos φ = cos(atan(R/A)); anual 13 períodos; por zona | Medición propia y consumos facturados del servicio | Período | RN-06 §23.7 |
| Excepciones abiertas | conteo por regla y severidad; antigüedad media | `consumptionExceptions` `open` | Fecha de consulta | BASE §9 |
| Productividad de lecturistas | tareas cerradas / horas de jornada; % con foto; % fuera de rango; conflictos | `readerWorkSessions`, `readingTasks` | Período | DFA M6 (`SU_HORAS_LECTOR`) |
| Éxito de telemedición | operaciones `readNow` `succeeded` / enviadas × 100 por sistema | `remoteMeterOperations` | Período | RN-06 §19 |
| Comandos remotos | por tipo y resultado, tiempo medio de confirmación | `remoteMeterOperations` corte/reconexión | Período | FIC 10.2 |
| Recargas prepagas | cantidad, unidades, importe, fallidas, conciliación | `prepaidTopUps` | Día/mes | FIC 10.3 |
| Balance GD | Σ demandada, Σ inyectada, Σ neto por clase de usuario-generador | `injectionBalances` aprobados | Período | MER-001 |
| Transgresiones | cantidad, % promedio, primeras transgresiones del período | `demandTransgressions` | Período | RN-06 §17 |
| Regularizaciones | unidades compensadas o refacturadas por servicio | `consumptionAdjustments` aplicados | Período | RN-06 §15 |
| Datasets regulatorios | consumos aprobados/facturados por categoría, tramo, período y tipo de fecha | Para M06 | Elegida | RN-06 §23.7 |

Exportaciones: XLSX/CSV/PDF desde DataTable; KML de rutas; dataset por API-MED-75 para BI del tenant.

## 16. Casos de uso

### CU-07 — Reemplazo de medidor (BASE §7, original)

- **Actor:** Encargado técnico (o cierre de OT de M10).
- **Situación inicial:** una orden autoriza reemplazar el medidor de SUM-AG-001; MED-002 está disponible.
- **Desarrollo:** 1) registrar retiro de MED-001 con lectura final 1.270 m³; 2) instalar MED-002 con lectura inicial 0 m³ y fecha efectiva; 3) conservar ambas instalaciones y enviar los registros a control de consumos.
- **Resultado:** trayectoria de los dos equipos conservada y sin superposición; MED-002 pasa de "disponible" a "instalado"; el consumo del período suma el tramo de MED-001 (hasta el retiro) y el de MED-002.
- **Excepción:** si MED-002 ya está instalado en otro suministro, se rechaza la asignación (RN-MED-001) hasta resolver la inconsistencia.
- **Requisitos:** RF-MED-016 a 020; RN-MED-001, 015, 018, 094.

### CU-08 — Lectura en campo sin conexión (BASE §8, original)

- **Actor:** Lecturista.
- **Situación inicial:** ruta R-01 descargada; MED-001 asociado a SUM-AG-001; lectura anterior 1.250 m³.
- **Desarrollo:** 1) abrir la tarea y verificar suministro y equipo; 2) registrar 1.270 m³, fotografía y observación; guardar localmente sin conexión; 3) sincronizar y confirmar la recepción sin duplicar.
- **Resultado:** lectura capturada pendiente de validación con operador, momento, GPS y evidencia.
- **Excepción:** si el medidor es inaccesible, se registra el motivo; nunca cero (RN-MED-052).
- **Requisitos:** RF-MED-043 a 048; RN-MED-047 a 054, 125.

### CU-09 — Validación y aprobación de consumo (BASE §9, original)

- **Actor:** Supervisor de consumos.
- **Situación inicial:** lecturas validadas 1.250 m³ y 1.270 m³ del mismo equipo y período.
- **Desarrollo:** 1) calcular 20 m³; 2) revisar continuidad del equipo, fechas y alertas; 3) aprobar para el ciclo 2026-11.
- **Resultado:** consumo validado de 20 m³ trazable a ambas lecturas, origen "lecturas reales".
- **Excepción:** si aparece 12.700 m³ como estado capturado, la regla de rango crea excepción bloqueante y el caso queda en revisión (RN-MED-076, 078).

### CU-ESP-ELE — Suministro eléctrico (BASE §87, parte de medición)

- **Definición:** el CU-ESP-ELE se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición.

Tras la factibilidad (M10), se instala el medidor autorizado y se confirma fecha y lectura inicial; el ciclo toma lecturas de energía (kWh) y, si corresponde, demanda (kW), franjas y reactiva en canales distintos; valida y entrega a M04. Controles: no equiparar kWh con kW (RF-MED-013); estimación solo autorizada.

### CU-ESP-AG — Agua medida y no medida (BASE §88, parte de medición)

- **Definición:** el CU-ESP-AG se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición.

Un cliente de régimen medido con lectura observada queda pendiente hasta validar cantidad real o estimación permitida (RN-MED-078). Un cliente de régimen no medido no tiene punto de medición ni se le exige medidor ficticio (RN-MED-027).

### CU-ESP-GAS — Gas por red (BASE §89, parte de medición)

- **Definición:** el CU-ESP-GAS se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición.

Tras la habilitación técnica (M10) se coloca/activa el medidor y se registra el inicio; el ciclo conserva volumen leído, factores de corrección (presión, temperatura, factor calórico, coeficiente) y cantidad resultante versionados (RF-MED-063).

### CU-MER-01 — Usuario-generador (MER-001, original)

Un asociado con paneles solares demanda 300 kWh e inyecta 120 kWh en el mes. MED registra ambos canales del medidor bidireccional, calcula el balance (300 / 120 / neto 180) y lo entrega; M04 valoriza cada uno con su tarifa, M05 liquida en el mismo comprobante y M07 lleva el crédito si el valor inyectado supera lo que paga. Valores ficticios.

### CU-MED-01 — Generar, asignar y confirmar una ruta

Supervisor genera el lote de R-01 para 2026-11 desde el cronograma; asigna 2 lecturistas por rango de secuencia; los lecturistas descargan; al recibir todo, el supervisor filtra "solo fuera de rango", revisa 3 casos y confirma; 1 tarea queda rechazada porque el medidor cambió desde la generación (RN-MED-035) y se relee con la nueva instalación. Cierre con acta.

### CU-MED-02 — Importación desde colectora de terceros

Operador sube un archivo con formato de perfil "Rainbow" (columnas 3 y 7); el preview muestra 2 filas sin emparejar (número de medidor no encontrado tras relleno a 10 dígitos) y 1 duplicada con lectura de app; confirma las válidas; continúan por confirmación de lote.

### CU-MED-03 — Medidor inaccesible dos períodos seguidos

El lecturista registra "domicilio cerrado"; el job estima con promedio de 6 períodos; al período siguiente se repite; al superar el tope (PRM-MED-108 = 2) se emite `med.point.inspectionRequested` y M10 crea una OT de relectura con aviso al socio.

### CU-MED-04 — Regularización de estimados

Dos períodos estimados de 15 m³ cada uno; la lectura real del tercer período muestra un acumulado que implica 10 m³/mes; el job propone compensar 10 m³ (2 × 15 − 2 × 10) en la próxima liquidación; el supervisor aprueba; M04 aplica "Compensación de 10 m³".

### CU-MED-05 — Vuelta de medidor

Medidor de 5 dígitos con lectura anterior 99.950 y actual 00.030; se crea excepción "lectura menor"; el analista verifica la foto, confirma vuelta; consumo = (99.999 − 99.950 + 1 + 30) × 1 = 80 unidades.

### CU-MED-06 — Distribución en consorcio

Medidor general de un consorcio con 4 departamentos en modo "igualada": consumo del padre 101 m³; cada hijo recibe 25,25 m³ salvo el último que absorbe el redondeo; el padre recibe −101 m³ compensatorio; un error de configuración se revierte por `runId` antes de facturar.

### CU-MED-07 — Transgresión de demanda

Gran usuario con 50 kW contratados registra 62 kW en punta: % = 62 × 100 / 50 − 100 = 24 %; se registra primera transgresión y demanda declarada 62 kW; aviso a atención comercial para aumento de potencia; meses después, con aprobación, se resetea la declarada a 50 kW.

### CU-MED-08 — Toma de estado por telemedición y corte remoto

El job de toma de estado consulta 300 medidores de un sistema AMI; 295 responden; 5 quedan con excepción y van a ruta de campo. Días después, M08 ordena un corte por mora: MED envía el comando con `Idempotency-Key`, el proveedor confirma, se emite `med.remoteOperation.succeeded` y M01 cambia el estado del servicio con la fecha confirmada. Un reintento por timeout no genera un segundo corte.

### CU-MED-09 — Recarga prepaga con token

Un socio recarga ARS 10.000 en la app: preventa OK; M07 confirma el pago; MED solicita el token; el proveedor no responde (timeout); estado `unknown`, se consulta el estado y se obtiene el token emitido; se entrega por la app y por correo; la conciliación nocturna lo empareja.

### CU-MED-10 — Autolectura del socio

Con ventana abierta, el socio envía estado y foto; la lectura queda en rango y se acepta; con política `ifInRange`, la tarea de ruta se marca "resuelta por autolectura" y el lecturista no la visita; al tercer período se exige lectura de campo (PRM-MED-055).

### CU-MED-11 — Conflicto offline

Un lecturista captura sin red una tarea que el supervisor reasignó; al sincronizar, el servidor acepta la lectura, marca conflicto y lo muestra en PAN-MED-34 con ambas evidencias; el supervisor acepta la lectura del dispositivo y cancela la tarea del otro lecturista.

### CU-MED-12 — Corrección de gas

Volumen leído 100 m³; factor del período: presión 1,02, temperatura 0,98, factor calórico 9.300; coeficiente 1; óptimo 9.300; volumen corregido = red4(100 × 1,02 × 0,98) = 99,96; cantidad = 99,96 × 9.300 × 1 / 9.300 = 99,96 → redondeo a 0 decimales = 100. Se guardan neto, factores y resultado. Valores ficticios.

> **Reemplazado por RN-TAR-035 (DEC-085):** este cálculo lo ejecuta M04 al liquidar. M03 solo valida la lectura y entrega a M04 el volumen medido (100 m³) y `meteringPoints.gasCorrectionCoefficient` (1); el ejemplo numérico se conserva como caso de prueba de M04.

### CU-MED-13 — Medición propia y pérdidas

El responsable carga la lectura del medidor de compra: pico 40.000, resto 50.000, valle 30.000 kWh, reactiva 36.000 kVArh; compra activa 120.000 kWh; cos φ = cos(atan(0,3)) ≈ 0,958; facturado del período 104.400 kWh; pérdida 15.600 kWh = 13 %.

### CU-MED-14 — Cambio de medidor desde OT de M10 con medidor telemedido

El técnico cierra la OT offline; al sincronizar, M10 publica el cierre; MED ejecuta retiro/instalación, encola `replaceMeter` en el sistema remoto, que falla dos veces y queda en bandeja técnica; la OT ya está cerrada y el consumo del período se calcula con ambos tramos.

## 17. Criterios de aceptación y escenarios de prueba

| ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-MED-01 | Instalar un medidor ya instalado en otro punto | 409 con código `med.meter.alreadyInstalled`; sin cambios. |
| ESC-MED-02 | Instalar en el mismo punto y canal con instalación activa superpuesta | Rechazo (RN-MED-018). |
| ESC-MED-03 | Lectura con fecha igual a la última validada | Rechazo (RN-MED-047). |
| ESC-MED-04 | Lectura con más dígitos que el medidor | Rechazo/advertencia según PRM-MED-027. |
| ESC-MED-05 | Lectura menor que la anterior | Excepción bloqueante "lectura menor"; sin consumo enorme automático. |
| ESC-MED-06 | Medidor inaccesible | Tarea "no leído" con motivo; ningún consumo real 0. |
| ESC-MED-07 | Doble envío de la misma mutación offline | Un solo registro; respuesta `duplicate` en el segundo. |
| ESC-MED-08 | Sincronizar tarea reasignada | Conflicto con ambas evidencias; nada sobrescrito. |
| ESC-MED-09 | Confirmar lote dos veces en paralelo | Uno procesa; el otro recibe 409; resultado idéntico al de una sola ejecución. |
| ESC-MED-10 | Confirmar lectura con medidor cambiado desde la generación | Registro rechazado con causa. |
| ESC-MED-11 | Punto en dos lotes abiertos del período | Rechazo al generar el segundo; informa lote existente. |
| ESC-MED-12 | Estimar servicio sin historia | Usa la cadena de respaldo; nunca divide por cero; si nada aplica, excepción "no estimable". |
| ESC-MED-13 | Modificar consumo facturado | 409 con referencia al comprobante; solo ajuste. |
| ESC-MED-14 | Distribución con suma de porcentajes ≠ 100 | Rechazo de configuración. |
| ESC-MED-15 | Hijo en dos distribuciones | Rechazo. |
| ESC-MED-16 | Distribución combinada con padre sobre tope | Excepción; no se distribuye en silencio. |
| ESC-MED-17 | Gas sin factor del período | ~~Consumo bloqueado "falta factor de gas".~~ Reemplazado por RN-TAR-035 (DEC-085): el consumo queda aprobado con su volumen medido; M04 excluye la cuenta con `TAR-E-GAS-FACTOR`. |
| ESC-MED-18 | Inyección sin contrato GD | Excepción bloqueante sobre el canal de inyección. |
| ESC-MED-19 | Comando de corte sin orden de origen | 403/422; no se envía. |
| ESC-MED-20 | Comando de corte repetido con la misma `Idempotency-Key` | Un solo envío al proveedor; misma respuesta. |
| ESC-MED-21 | Proveedor caído durante cierre de OT | Con PRM-CAT-041 = `true` (default) la OT no cierra y queda la operación remota pendiente con reintentos, como en ESC-SRV-ELE-07; con `false`, la OT cierra y la operación sigue pendiente (antes "OT cerrada; operación remota pendiente con reintentos", sin distinguir el parámetro); salud del conector "down"; socios no marcados con error. |
| ESC-MED-22 | Recarga cobrada con proveedor fallando | Recarga en bandeja; reintento sin segundo token; devolución opcional por M07. |
| ESC-MED-23 | Lecturista intenta ver tareas de otro | 403 (alcance propios). |
| ESC-MED-24 | Usuario del tenant A consulta lecturas del tenant B | 404; ninguna consulta sin `tenantId` (plugin). |
| ESC-MED-25 | Socio consulta consumos de un servicio no autorizado | 403. |
| ESC-MED-26 | Operador sin `med.consumos.aprobar` intenta aprobar | 403. |
| ESC-MED-27 | Quien creó un ajuste intenta aprobarlo con doble control activo | 403 (T11). |
| ESC-MED-28 | Lectura de telemedición duplicada de lectura manual | Una queda `redundant` según prioridad; un solo consumo. |
| ESC-MED-29 | Consumo en servicio desconectado | Excepción bloqueante por defecto. |
| ESC-MED-30 | División con lectura de 45 días en período de 30 (modo días máximos) | Tramo 1 = 30 días estimado; tramo 2 = 15 días; suma = original. |
| ESC-MED-31 | Período con fin de mes, año bisiesto y zona horaria | Días calculados según RN-MED-071, reproducibles independientemente del horario del servidor. |
| ESC-MED-32 | Reapertura de lote con consumos facturados | Solo se reabren los no facturados. |
| ESC-MED-33 | Conciliación: lecturas validadas = consumos calculados + no leídos + rechazadas por lote | Cuadra; el acta lo muestra. |
| ESC-MED-34 | Conciliación con M05: consumos `approved` del período = consumos facturados + observados + excluidos con causa | Cuadra (AGR-015). |
| ESC-MED-35 | Autolectura fuera de ventana o sin foto | Rechazo con motivo. |
| ESC-MED-36 | Cambio de régimen AG a medido (HUE-AG-03) | EVT-CAT-28 `unmetered` → `metered` con fecha 01/12/2026 crea el punto y la orden de instalación; reenviar el evento no duplica; sin medidor instalado no hay consumo medido (RF-MED-128). |
| ESC-MED-37 | Volumen comprado para control de factura del mayorista (HUE-ELE-01, HUE-GAS-04) | API-MED-78 del período 11/2026 devuelve por punto de frontera los kWh por franja y kW de demanda del informe de pérdidas, con estado de validación (RF-MED-129). |

Escenarios transversales ESC-01 a ESC-05 de BASE §102 que aplican: los relativos al ciclo de facturación (la cantidad aprobada alimenta el lote; un caso bloqueado no impide cerrar el resto y queda con seguimiento) y a la operación offline con conflicto (AGR-025). Los propios del piloto Internet no aplican a MED.

## 18. Datos de precarga de demostración (ficticios)

| Entidad | Datos |
|---|---|
| Marcas | MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). |
| Tipos de medidor | MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos, m³); PREPAGO-TK (token). |
| Medidores | MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01 (BIDIR-GD), MED-PP-01 (PREPAGO-TK), MED-G-01 (GAS-5D), MED-T-01 (testigo de barrio). |
| Puntos | SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW solar), SUM-ELE-PP-01 (prepago), SUM-GAS-001, CONS-PADRE-01 con 4 hijos. |
| Rutas | R-01 — Centro (zona 30), R-02 — Norte (por calle), R-TEL (solo telemedidos). |
| Cronograma | 2026-11: R-01 el 05-11-2026, R-02 el 06-11-2026; ventana de autolectura 02 al 04-11-2026. |
| Lecturas | SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. |
| Observaciones | Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha). |
| Factores de gas | 2026-11 general: presión 1,02, temperatura 0,98, factor calórico 9.300; óptimo 9.300. |
| Telemedición | Sistema DEMO-AMI (genérico REST, sin credenciales reales), mapeo activa T1→`activeImport`. |
| Prepago | Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04). |
| Medición propia | Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. |

Ningún dato corresponde a personas reales; los valores no son tarifas ni coeficientes vigentes.

## 19. Migración desde ProCoop

| Tabla origen (CAT §3 u otras) | Colección destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `MARMED` | `meterBrands` | Directa; `COD_SER` → `serviceIds`. | Conteo. |
| `TIPMED` | `meterTypes` | `SIS_TEL` → `meteringSystemId`; `PREPAGO`, `DISPONIBLE`, `NOINDICADO`, `REDONDEO_PREPAGA`, `CONEX_SIST`, `TIPO_SUM`, `COD_MED`, `COD_PRO` mapeados. | Conteo; tipos usados por medidores existen. |
| `ESPE_MED` | `meterTypes` (especificaciones) | Fusión por tipo. | Todas las especificaciones asignadas. |
| `DISPOSI` | `meters` | `NUM_MED`, `MAT_MED`, `COD_TIP`, `CLA_MED`, `MAR_MED`, `MOD_MED`, `ANO_MED`, `MONOTRI`, `MULTITA`, `PREPAGO` y 14 columnas más; `COD_PRO` → `serialUnitId` vía M13. | Cada medidor con número único por servicio y marca; duplicados a informe. |
| `SERSOC` (campos de medidor) | `meters` + `meteringPoints` + `meterInstallations` activa | `DIG_MED` 0 → 5 con observación; `FAC_MED` 0 → 1; `FAC_MED` < 0 → canal `activeExport` (Duda 9); `INDICADO`, `LECTURA_CON_FACTOR`, `COD_PROP`, `ID_SYS_TEL`, `RETIRADO`; ZSR; GPS; fechas 1901-01-01 → nulo. | Servicios medidos conectados = puntos con instalación activa. |
| `MEDSOC` | `meteringChannels` | `TIP_ENE`/`COD_CON`/`CONTRATADO`/`FAC_MED`/`INDICADO`; `CON_ORIGINAL`, `FEC_ACTUALIZA*` como historia. | Canales por punto = filas `MEDSOC`. |
| `HIS_MEDSOC` | `meterInstallations` (cerradas) + historia de canales | Reconstruir intervalos de colocación/retiro por fechas. | Sin superposiciones; las que se superponen van a informe de revisión. |
| `MED_TESTIGO` | `meteringPoints` (`witness`) | `NO_INCLUIR` → `witnessExcluded`; `SERSOC_EXTRAS.COD_TES` → `witnessPointId`. | Conteo. |
| `CONS_SER_TESTIGO` | `meterReadings` + `consumptions` del punto testigo | GPS y observaciones conservados. | Suma de consumos por testigo y período. |
| `MEDIDORP` | `meteringPoints` (`purchase`) + canales de 6 registros | `COD_SER` explícito (Duda 23). | Conteo. |
| `CONSUMOP` | `meterReadings` + `consumptions` del punto propio | `TIP_ENE` → canal. | Suma por período. |
| `CONS_SER` | `meterReadings` (estados anterior/actual) + `consumptions` | `ESTIMADO` → `origin estimated`; `GRUPO`/`SEG_TOT` → `split`; `NETO` → `netQuantity`; `FACTURADO`/`COD_COM`/`SUC_COM`/`NUM_COM` → `billingRef` (factura migrada) y `billed`; `PERIODO` → `period`; consumos "Redistribución" y "Consumo Adicional" con su origen; lecturas origen `migration`. | Por servicio y período: Σ consumo migrado = Σ `CONS_SER.CONSUMO`; consumos facturados vinculados a factura existente. |
| `IMP_WORK` | `readingBatches` + `readingTasks` (solo abiertos al corte) | Estado G/E/I/C/R → estados nuevos; umbrales → `expectedRange`. | Lotes abiertos al corte cuadran. |
| `HISWORK` | `readingTasks` archivadas (solo consulta) | Histórico. | Conteo por ruta. |
| `CONNRUTA` / `CONNZONA` | `readingRoutes` | `COD_SER1..4` → `serviceIds`; `REC_CAL`, `ORDEN`, `SERV_DESC`, `TELEMED` y 17 columnas más. | Puntos por ruta = servicios por ruta. |
| `DST_CONSUMO` | `consumptionDistributions` | `COMBINADA`/`IGUALADA` → `mode`; `TOPE`. | Hijos únicos. |
| `SERSOC_DEMANDASXPERIODO` + `CON_BASE`/`DEC_CON`/`FEC_DECCON`/`PRIMER_TRANSGRESION` | `demandDeclarations` + `demandTransgressions` | Por período. | Conteo. |
| `FACTOR_CAL` + `COEF_CORRECTOR` | `gasCorrectionFactors` + `meteringPoints.gasCorrectionCoefficient` (**`FACTOR_CAL` reemplazado por la migración de M04 a `gasCalorificFactors`, HUE-GAS-03**; M03 migra solo `COEF_CORRECTOR`) | Por período/categoría. | Períodos con factor = períodos con consumo de gas. |
| `SERSOC.CONS_BONIF` pendiente | `consumptionAdjustments` (`approved`, no aplicado) | Unidades pendientes de compensar. | Σ pendiente por servicio. |
| `OBSESTAD`, `OBSMED`, `RESESTAD`, `CERESTAD` | Catálogos | Directa. | Conteo. |
| `TELEMEDICION` | `meteringSystems` | Credenciales a la bóveda (nunca a la colección); sistemas ISP → M10. | Sistemas activos configurados. |
| `LEC_MEDTEL` | `telemetryRegisterMappings` | `COD_LEC`, `COD_LEC2`, `COD_LEC3`, `GENERADOR`. | Conteo. |
| `TELEMED_COMM` | `remoteMeterOperations` (histórico `succeeded`/`failed`) | Solo consulta. | Conteo. |
| `AUDITORIA_TELEMEDICION` | ~~`meteringConnectorLogs`~~ `integrationMessages` de T06 (CTR-DAT-61) (opcional, últimos 12 meses) | Saneado (sin credenciales). | — |
| `SU_HORAS_LECTOR` | `readerWorkSessions` (`manual`) | — | — |
| `CTRLCNC` | `consumptionExceptions` (abiertas al corte) | Regla `outOfRange`. | — |
| Fotos de lectura (adjuntos tipo 7 y 15; base MySQL compartida / S3) | Expediente documental del tenant | Según PA-MED-09 y PA-MED-13 (períodos a migrar). | Fotos vinculadas a consumos migrados. |
| `IMP_WORK`/`CONS_SER` de servicios prepagos, ventas prepagas | `prepaidAccounts`, `prepaidTopUps` (históricas) | Con M07. | Σ recargas por mes. |

Reglas generales: la migración es repetible (T07, O11); fechas centinela 1901-01-01 → nulo; los números MAX+1 duplicados se informan (Duda 7 de RN-06); se ejecuta en paralelo una liquidación de control comparando consumos por servicio y período.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-MED-01 | RN-06 §13.2 paso 5 y §14.2–14.3 vs. BASE §9 (CU-09) y RN-06 §21.7 | En ProCoop los umbrales solo informan y ningún consumo anómalo se bloquea. La BASE exige que una inconsistencia relevante no se liquide. | Reglas de validación con severidad configurable (información, advertencia, bloqueante) y bandeja de excepciones; por defecto, lectura menor, falta de factor de gas e inyección sin contrato son bloqueantes (RN-MED-076 a 078). | BASE (requisito informado) prevalece sobre benchmark. |
| CTR-MED-02 | RN-06 §14.1 y Duda 3 vs. BASE §9 y RN-06 §21.7 | ProCoop toma toda lectura menor como vuelta del medidor sin preguntar. | Excepción "lectura menor" con clasificación explícita: vuelta, error de captura o cambio de medidor no registrado (RF-MED-062, RN-MED-066). | BASE prevalece; la fórmula de vuelta se conserva. |
| CTR-MED-03 | RN-06 §12.1 (medidor como campos de `SERSOC`) vs. BASE §7 (CU-07) y RN-06 §21.9 | ProCoop guarda el medidor dentro del servicio; la BASE pide trayectoria del equipo y continuidad de consumo. | Entidad propia `meters`, punto de medición e historial de instalaciones (RF-MED-003, 016 a 019; RN-MED-001, 018). | BASE prevalece; deuda técnica de ProCoop. |
| CTR-MED-04 | RN-06 §18 y Duda 9 (inyección como factor negativo) vs. MER-001 y RN-06 §21.10 | La inyección es un consumo negativo de un `MEDSOC` activo. | Canales separados de energía demandada e inyectada con contrato GD; el factor negativo solo se interpreta al migrar (RN-MED-050, 117). | Requisito informado MER-001 prevalece. |
| CTR-MED-05 | RN-06 §14.1 (`EliminarConsumo`), §23.7 (`EliminarDistribucion`) vs. AGR-010 | ProCoop borra lecturas y distribuciones físicamente. | Anulación y versionado; nunca borrado; las correcciones son versiones nuevas (RN-MED-055, 080, 100). | AGR adoptado prevalece sobre benchmark. |
| CTR-MED-06 | RN-01 §4.4 (gas corregido en el cálculo) vs. RN-06 §16.2 (`CorregirConsumoGAS` en consumos) | No está claro si la corrección es de facturación o de medición. | MED calcula y guarda neto, factores y cantidad corregida; M04 solo valoriza la cantidad corregida (RF-MED-063, RN-MED-069, 070). Los factores y parámetros de gas son de M04 (HUE-GAS-03): MED los lee de `gasCalorificFactors` y guarda en el consumo la versión del factor usada. **Reemplazada por RN-TAR-035 (DEC-085):** M04 aplica la corrección con sus factores; MED entrega el volumen medido validado y no corrige. | Delimitación de módulos del maestro; se evita doble corrección. DEC-085 prevalece. |
| CTR-MED-07 | RN-06 §13.3 (base MySQL compartida entre cooperativas) vs. DEC-002 | Lecturas, fotos y GPS de todas las cooperativas en una base separada solo por `COD_SUM`. | Aislamiento total por `tenantId` y expediente documental del tenant (RN-MED-126). | DEC-002 prevalece; deuda de seguridad de ProCoop (`Reemplazado`). |
| CTR-MED-08 | RN-06 §19.1 (llamada al proveedor antes de cerrar la OT) vs. RN-06 §21.11 y DEC-003 | Si el proveedor falla, la OT queda abierta. | La OT se cierra; la operación remota se encola con reintentos, idempotencia y bandeja técnica (RN-MED-105, CU-MED-14). | DEC-003 prevalece. |
| CTR-MED-09 | RN-06 §13.3 (importadores por cooperativa/fabricante en código) vs. RN-06 §21.6 | Cada formato es código. | Perfiles de importación configurables con perfiles precargados equivalentes (RF-MED-053, 054; RN-MED-061). | Implicancia adoptada; ProCoop se conserva como contenido de los perfiles. |
| CTR-MED-10 | CAT `TELEMEDICION` (`USER_TEL`, `PASS_TEL`) vs. guía §2 y T09 | Credenciales en texto en una tabla. | Bóveda del tenant; la colección solo guarda la referencia (RN-MED-109). | Seguridad (DEC y guía) prevalece. |
| CTR-MED-11 | RN-06 §13.1 ("siempre se excluyen las categorías prepagas") vs. FIC 10.3 y BASE §97.5 | El prepago nunca entra en ruta, pero hay prepagos sin telemedición que requieren control de lectura. | El punto prepago no se liquida en el ciclo pospago, pero puede incluirse en rutas de control si el parámetro lo habilita (RN-MED-110). | BASE prevalece; el comportamiento ProCoop es el valor por defecto. |
| CTR-MED-12 | RN-06 §14.3 y Duda 11 (V2 439 % global) vs. RN-06 §21.7 | Un único % de tolerancia para todo el sistema. | Rango esperado por servicio, categoría y estacionalidad; V2 439 migra como valor por defecto (RN-MED-073). | Implicancia adoptada; benchmark como default. |
| CTR-MED-13 | RN-06 §15 y Duda 12 (bonificación solo en m³) vs. RN-06 §21.8 | El ajuste de estimados solo es bonificación en metros sobre la factura siguiente. | Regularización configurable por servicio: compensación en unidades o refacturación por ajuste (RF-MED-079, RN-MED-089). Se decide en PA-MED-01. | Implicancia adoptada; resolución final en PA. |
| CTR-MED-14 | RN-06 §19.2 (una fábrica mezcla medición, prepago e ISP/TV) vs. RN-06 §21.11 | MikroTik, Radius, SmartOLT, Sensa, Sopnet y Wispro comparten el contrato con los medidores. | Tres familias separadas; el aprovisionamiento ISP/TV pasa a M10/T06 (RN-MED-106). | Implicancia adoptada y delimitación de módulos. |
| CTR-MED-15 | RN-06 §13.2 (`PERIODO = MM/aaaa` de la fecha de lectura; V2 2682 categoría actual) vs. AGR-017 | El período sale del mes de la fecha y la categoría depende de un flag. | El período lo define el cronograma del ciclo; la categoría es la vigente en la fecha efectiva de la lectura (RN-MED-037, 038, 124). | AGR adoptado prevalece. |
| CTR-MED-16 | RN-06 §16.3 (combinada sobre el tope no se reparte) vs. BASE §9 | El padre sobre el tope queda sin distribuir sin aviso. | Se genera excepción y el operador decide (RN-MED-098, ESC-MED-16). | BASE prevalece (no hay consumo sin seguimiento). |
| CTR-MED-17 | BASE §7 (estados de activo del medidor: disponible, instalado, retirado) vs. delimitación con M13 | La BASE pone el ciclo del activo dentro del cambio de medidor; el stock serializado es de M13. | M13 es dueño del estado de stock y depósito; MED es dueño de la instalación, retiro y lecturas y muestra el estado del activo leído de M13 (RF-MED-011, RN-MED-009). | Delimitación de módulos del maestro; BASE se cumple sin duplicar datos. |
| CTR-MED-18 | RN-06 §20 (V2 2590 tipo entero, "orden de impresión de ruta") vs. RN-09 (V2 2590 tipo lógico, orden de grandes consumos) | Mismo parámetro con tipo y semántica distintos en dos fuentes. | Se modelan dos parámetros: orden de recorrido de ruta (RF-MED-026) y orden de grandes consumos (PRM-MED-153); queda **[VERIFICAR]** contra la tabla `V2` de una base real. | RN-09 (catálogo) para el tipo; se conserva la función de RN-06; verificación pendiente sin decisión del solicitante. |

## 21. Preguntas abiertas

### PA-MED-01 — Regularización de consumos estimados
- **Pregunta:** cuando llega la lectura real después de uno o más estimados, ¿cómo se corrige lo facturado de más o de menos?
- **Contexto:** ProCoop solo bonifica metros en la factura siguiente (RN-06 §15). La implicancia RN-06 §21.8 pide poder refacturar. Los entes provinciales (ERSEP, EPRE, OCEBA) pueden exigir uno u otro (Duda 12).
- **Opciones:**
  - A) Configurable por servicio, con compensación en unidades por defecto **(Recomendada)** — replica ProCoop y deja refacturar donde el regulador lo pida.
  - B) Solo compensación en unidades — más simple; no cubre a los entes que exigen refacturación.
  - C) Siempre refacturación por NC/ND — más exacta; genera muchos comprobantes y trabajo para M05.
- **Impacto si no se responde:** se asume A con compensación por defecto.
- **Bloquea:** RF-MED-079, RN-MED-089, PRM-MED-107 (O7).

### PA-MED-02 — Método de estimación por defecto
- **Pregunta:** ¿qué método de estimación se usa por defecto y cuál es la cadena de respaldo cuando falta historia?
- **Contexto:** ProCoop usa el promedio simple de N períodos y puede dividir por cero si no hay historia (Duda 2).
- **Opciones:**
  - A) Promedio de los últimos 6 períodos reales; si no hay, el mismo mes del año anterior; si no hay, el promedio de la categoría; si no hay, consumo declarado o mínimo de la categoría **(Recomendada)** — siempre tiene un valor trazable.
  - B) Promedio de 12 períodos sin respaldo — igual a ProCoop; deja casos sin estimar.
  - C) Siempre promedio de la categoría — simple, pero poco fiel al usuario.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-074, RN-MED-084, PRM-MED-100 (O7).

### PA-MED-03 — Curvas de carga
- **Pregunta:** ¿se almacenan curvas de carga (lecturas por intervalo) de grandes usuarios en la primera entrega?
- **Contexto:** ProCoop no tiene curvas de carga (RN-06 §19.2, Duda 15). La implicancia §21.11 pide planificarlas.
- **Opciones:**
  - A) Dejar el modelo preparado (`intervalReadings`) y construir la importación como Extensión **(Recomendada)** — sin costo inicial y sin rehacer el modelo.
  - B) Construirlas en O7 — solo vale si la cooperativa piloto tiene grandes usuarios con AMI.
  - C) No contemplarlas — obliga a rediseñar más adelante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-111, PRM-MED-159.

### PA-MED-04 — Modalidad de prepago
- **Pregunta:** ¿qué modalidades de prepago se implementan: token (STS) o crédito en línea, y con qué proveedor primero?
- **Contexto:** ProCoop integra Discar, Boiero, CashPower, C_Token y Hexing (RN-06 §19.2). La BASE §98 deja pendiente si la cooperativa piloto usa prepago.
- **Opciones:**
  - A) Ambas modalidades mediante el contrato de conector; se construye primero el proveedor de la cooperativa piloto **(Recomendada)**.
  - B) Solo token — cubre la mayoría de los medidores prepagos, pero no el crédito en línea.
  - C) Diferir el prepago completo — deja sin reemplazo a las cooperativas que lo usan hoy.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-113 a 121, RN-MED-110 a 115 (O7).

### PA-MED-05 — Facturación in situ
- **Pregunta:** ¿se emite la factura en el momento de leer, en el domicilio?
- **Contexto:** MER-018 la menciona como práctica del mercado; ProCoop no la tiene. Requiere impresora portátil y emisión electrónica en línea con M05.
- **Opciones:**
  - A) Extensión posterior a O7 **(Recomendada)** — no frena el ciclo estándar.
  - B) Incluirla en O7 — suma riesgo de emisión offline.
  - C) Descartarla.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-122, PRM-MED-158.

### PA-MED-06 — Alcance de la autolectura
- **Pregunta:** ¿la autolectura del socio reemplaza la visita del lecturista o solo la complementa?
- **Contexto:** MER-018 la propone; reemplazar visitas ahorra costos pero aumenta el riesgo de fraude.
- **Opciones:**
  - A) Complementa; por defecto nunca reemplaza la visita (`never`) y, si el tenant habilita el reemplazo, se exige lectura de campo cada N períodos **(Recomendada)**.
  - B) Reemplaza cuando la lectura está en rango (`ifInRange`) desde el inicio.
  - C) No implementar la autolectura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-057, RN-MED-056, PRM-MED-054, PRM-MED-055.

### PA-MED-07 — Tope de estimaciones consecutivas
- **Pregunta:** ¿cuántas estimaciones consecutivas se admiten antes de exigir inspección o relectura?
- **Contexto:** ProCoop no tiene tope; los reglamentos de los entes suelen limitar los estimados sucesivos.
- **Opciones:**
  - A) 2 períodos, configurable por servicio **(Recomendada)**.
  - B) 3 períodos.
  - C) Sin tope (como ProCoop).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-081, RN-MED-090, PRM-MED-108.

### PA-MED-08 — Régimen de compensación de generación distribuida
- **Pregunta:** ¿la energía inyectada se compensa en dinero (Ley 27.424, tarifa de inyección) o en kWh (balance neto)?
- **Contexto:** depende de la adhesión de cada provincia (BASE §101). MED entrega el balance; M04 valoriza; M07 lleva el crédito.
- **Opciones:**
  - A) Configurable por régimen; por defecto, compensación monetaria (Ley 27.424) **(Recomendada)**.
  - B) Solo monetaria.
  - C) Solo balance neto en kWh.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-060): configurable por régimen; por defecto compensación monetaria (Ley 27.424); balance neto como opción del régimen (coherente con PA-TAR-14 de M04).
- **Bloquea:** RF-MED-097, RN-MED-117.

### PA-MED-09 — Conservación de fotos de lectura
- **Pregunta:** ¿cuánto tiempo se conservan las fotos y los datos GPS de las lecturas?
- **Contexto:** son evidencia ante reclamos y datos personales (Ley 25.326). ProCoop no define plazo (Duda 13).
- **Opciones:**
  - A) 24 meses en almacenamiento en línea y luego archivo frío; no se borran hasta que el tenant defina su política **(Recomendada)**.
  - B) Borrado a los 24 meses.
  - C) Conservación indefinida en línea.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MED-157, migración de fotos (§19).

### PA-MED-10 — Cambio de clase por consumo
- **Pregunta:** ¿el cambio de clase o categoría por rango de consumo se aplica automáticamente o como propuesta?
- **Contexto:** `Get_ServiciosClase` parece regla de un cliente puntual (Duda 21); afecta tarifas (M04) y el contrato (M02).
- **Opciones:**
  - A) Propuesta con aprobación **(Recomendada)**.
  - B) Aplicación automática.
  - C) No implementar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-102, RN-MED-122.

### PA-MED-11 — Colectoras USB (PSION/Android por cable)
- **Pregunta:** ¿se da soporte directo a colectoras conectadas por USB?
- **Contexto:** ProCoop usa Windows Portable Device y SQLite (RN-06 §13.3). Una aplicación web no accede al USB sin agente local.
- **Opciones:**
  - A) Sin USB directo: intercambio por archivo; agente local solo a pedido de una cooperativa **(Recomendada)**.
  - B) Agente local desde O7.
  - C) Discontinuar las colectoras y usar solo la PWA.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-056.

### PA-MED-12 — Conectores y formatos a construir primero
- **Pregunta:** ¿qué conectores de telemedición/prepago y qué perfiles de importación se construyen en O7?
- **Contexto:** ProCoop tiene 26 sistemas y unos 20 formatos de archivo. La BASE §98 deja pendiente si la cooperativa piloto usa telemedición.
- **Opciones:**
  - A) Contrato genérico, importación por archivo y uno o dos conectores de la cooperativa piloto; el resto a pedido **(Recomendada)**.
  - B) Todos los conectores de ProCoop en O7 — mucho esfuerzo sin clientes confirmados.
  - C) Solo importación por archivo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-054, RF-MED-103 a 112.

### PA-MED-13 — Profundidad histórica a migrar
- **Pregunta:** ¿cuántos períodos de lecturas, consumos y fotos se migran desde ProCoop y desde la base de la app móvil?
- **Contexto:** la estimación y el rango esperado necesitan al menos 12 períodos; las fotos están en una base compartida entre cooperativas (Duda 13).
- **Opciones:**
  - A) Lecturas y consumos completos; fotos de los últimos 24 meses **(Recomendada)** — cubre estimación, interanual y reclamos.
  - B) Solo los últimos 24 meses de todo.
  - C) Solo el último estado por medidor — pierde la base de estimación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §19 (migración), RF-MED-074.

### PA-MED-14 — Estados de `meteringSystems` (cierre, segunda ronda)
- **Pregunta:** ¿se confirman los valores `active` e `inactive` de `meteringSystems.status`, propuestos en §8 con `[VERIFICAR]`?
- **Contexto:** la corrección de inconsistencias del 05-11-2026 declaró esos valores sin una RN que los respalde; la salud técnica va aparte, en `health.status`.
- **Opciones:**
  - A) **(Recomendada)** Confirmar `active` e `inactive` (estado inicial `active`); `health.status` sigue siendo independiente.
  - B) Unificar estado y salud en un solo campo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §8 (estados completados), T05.
- **Estado:** Asumida (DEC-072): opción A, aplicada en §8.

### PA-MED-15 — Residuales de estados y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones de `readingImportJobs` y `consumptionClassReviews`, y los destinos de las referencias del lecturista, del dispositivo y de los expedientes?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 6 máquinas de M03 sin estado inicial y 2 colecciones con estados sin transiciones; 03-er marcó sin destino `meters.documents`, `meteringPoints.reading`, `defaultReaderIds`, `readerId`, `photoIds`, `readingId`, `vendorTransactionId` y `distributedGenerationContracts.documents`; T05 §7.2.1 tiene `deviceId` de M03 con [VERIFICAR].
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.13 el estado de alta y las transiciones; lecturista → `memberships` (T02); `deviceId` → `fieldDevices` (M10, tipo ObjectId); expedientes → `documents` (T11); fotos → `storedFiles` (T01); `routeIds` → `readingRoutes`; `vendorTransactionId` es un identificador externo.
  - B) Lecturista → `employees` (M16), que excluye lecturistas tercerizados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), T05 §7.2.1 (`deviceId`).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.2 a §7.6 y §8.13. T05 debe cerrar el [VERIFICAR] de `deviceId` (M03 → `fieldDevices`).
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M03 declara en §12.1 EVT-MED-30 `med.readingRoute.published` (antes `med.reading-route.published`, nombre que solo figuraba en T06 §12), publicado al exportar el lote de una ruta a un sistema conectado por T06; payload `readingRouteId`, `readingBatchId`, `meteringSystemId`, `period`; consumidor T06. T11 §12.4 registra el alias.

## 22. Trazabilidad de fuentes

### 22.1 BASE, MER y AGR

| Fuente | Destino en M03 |
|---|---|
| BASE §7 (CU-07, MED-001/MED-002, estados del activo) | CU-07; RF-MED-003, 005 a 008, 011, 016 a 019; RN-MED-001, 015, 018, 020, 021; CTR-MED-03, CTR-MED-17 |
| BASE §8 (CU-08, R-01, 1.250 → 1.270 m³, offline) | CU-08; RF-MED-043 a 048, 050; RN-MED-052, 054, 125; §18 |
| BASE §9 (CU-09, 20 m³, caso 12.700) | CU-09; RF-MED-061, 062, 064 a 068, 074, 075, 079, 081; RN-MED-076 a 079; CTR-MED-01, 02, 16 |
| BASE §37 (historial de versiones 0.15 y 0.16: prepago, telemedición, autolectura, facturación in situ, usuario-generador) | Informativo; los requisitos citados se trazan en §97.5, MER-001, MER-018 |
| BASE §41 (pendientes sobre límites, roles y datos ficticios) | Límites en §2–§4; datos ficticios en §18; sin requisito propio |
| BASE §68 (circuito de corte, referencia) | RF-MED-108; RN-MED-104 (MED solo ejecuta el comando; M08 decide) |
| BASE §87 (medición eléctrica) | CU-ESP-ELE; RF-MED-012, 013, 093, 100; RN-MED-121 |
| BASE §88 (agua medida y no medida) | CU-ESP-AG; RF-MED-012; RN-MED-027, 078 |
| BASE §89 (gas por red) | CU-ESP-GAS; RF-MED-063; RN-MED-069, 070 |
| BASE §97.5 (prepago y telemedición) | RF-MED-106, 108, 113, 118, 121; RN-MED-063, 104, 113; PRM-MED-067, 130; CTR-MED-11 |
| BASE §98 (si la piloto usa prepago y telemedición) | PA-MED-04, PA-MED-12 |
| BASE §101 (adhesión GD por provincia; consumo no registrado) | PA-MED-08; RF-MED-126, 127 (MED provee datos; el procedimiento es de M10) |
| BASE §102 (AGR, ESC-01 a ESC-05) | §17 (escenarios transversales) |
| BASE §106 (pendientes 0.17: AGR, comprobantes, imputación, periodicidad, RRHH, arquitectura) | Sin impacto en MED salvo la periodicidad distinta (RN-MED-124, calendarios por servicio) |
| MER-001 (usuario-generador, 300/120 kWh) | CU-MER-01; RF-MED-013, 094 a 099; RN-MED-117, 118; PAN-MED-26; PA-MED-08; CTR-MED-04 |
| DEC-028 (contratos iguales en una cuenta) | RN-MED-018 |
| DEC-030 / DEC-082 (modalidades de gas; envasado sin medidor) | RF-MED-012 |
| DEC-036 (factura con total negativo; GD como crédito a futuro) | RF-MED-097 |
| DEC-060 (generación distribuida) | PA-MED-08 (Respondida); RF-MED-097; `distributedGenerationContracts.regime` |
| DEC-074 (bóveda `integrationSecrets` de T06) | §2; `meteringSystems.credentialRef`; PAN-MED-23 |
| DEC-085 (corrección de gas en M04) | RF-MED-063, RN-MED-069, RN-MED-070, CTR-MED-06, CU-MED-12, ESC-MED-17, `consumptions.gasCorrection`, §13.3 (reemplazados por RN-TAR-035) |
| T05 §20 (CTR-DAT-30, 60, 61, 71, 72) | Nombres canónicos `contractId`, `categoryId`, `conceptId`, `serialUnitId`, `approvalRequestId`; `meterSeals` → `seals` (M10); `meteringConnectorLogs` → `integrationMessages` (T06); dueño de `serviceContracts` M02; bóveda T06 |
| EVT-CMP-16 (balance comprado vs. facturado, M12) | RF-MED-101; §12.2 |
| MER-003 (grandes usuarios, franjas, demanda) | RF-MED-004, 013, 089; CU-MED-07 |
| MER-004 (consumo no registrado) | RF-MED-126, 127 |
| MER-007 (punto de venta prepago, referencia) | RF-MED-114, 115 (la venta es de M07) |
| MER-018 (autolectura, facturación in situ) | RF-MED-028, 057, 058, 120, 122; RN-MED-056; PAN-MED-06, 32; PRM-MED-052; PA-MED-05, PA-MED-06 |
| AGR-010 (fecha efectiva y de registro) | RF-MED-070; RN-MED-014, 080, 123; CTR-MED-05 |
| AGR-017 (calendarios y zona horaria) | RF-MED-028; RN-MED-038, 071, 124; PRM-MED-026; CTR-MED-15; ESC-MED-31 |
| AGR-025 (conflictos offline) | RF-MED-048; RN-MED-046, 125; PAN-MED-34; CU-MED-11; ESC-MED-08 |

### 22.2 DFA, REL, FIC, CNX y otras RN

| Fuente | Destino en M03 |
|---|---|
| DFA Módulo 5 (medidores: marcas, tipos, ficha, cambio) | RF-MED-001 a 003, 009, 018; PAN-MED-01, 02, 04 |
| DFA Módulo 6 (rutas, lecturas, consumos, telemedición) | RF-MED-012, 023, 025, 034, 041 a 043, 045, 051, 064, 065, 072, 074, 103, 106 |
| DFA ciclo mensual (rutas de lectura → validación de consumos → liquidación) | §9 (procesos 9.1 a 9.17); RF-MED-029 a 037, 066, 067; contrato `billing-feed` (§13) |
| REL §3 (registro manual de lecturas y consumos) | RF-MED-023, 037, 051, 053, 054, 065, 067, 072, 081, 109; RN-MED-027, 061, 077, 090; PRM-MED-060 |
| FIC 10.1 (lecturas y app de campo) | RF-MED-033, 043, 053, 056 |
| FIC 10.2 (telemedición) | RF-MED-106 a 108 |
| FIC 10.3 (prepago) | RF-MED-113, 115, 117, 121; RN-MED-111 |
| RN-01 §4 (datos de lectura que usa el cálculo: tramos, factor por días, gas, mínimo, inyección, `CONS_BONIF`, prepagas) | RN-MED-069 a 071, 110, 117; RF-MED-063, 097, 117; PRM-MED-070, 071; tarifación en M04 |
| RN-01 §16 (medidor testigo) | RF-MED-087; RN-MED-072 |
| RN-10 §4 (PMovil/Captor) | RF-MED-033, 043, 047, 056; PA-MED-11 |
| RN-10 §9 (telemedición, prepago, aprovisionamiento ISP) | RN-MED-106, 109; ISP en M10/T06 (CTR-MED-14) |
| RN-10 §16 (adjuntos de lectura e informes de telemedición/consumos) | RF-MED-059; RN-MED-039; PAN-MED-24 |
| CNX §3.7 (sincronización con `clientMutationId`) | RF-MED-043, 047 |
| CNX §7.8 (app de campo, asignación y GPS) | RF-MED-032; RN-MED-054; PRM-MED-045 |

### 22.3 RN-06 §12 a §23

| Ítem de RN-06 | Destino en M03 |
|---|---|
| §12.1 `NUM_MED` | RF-MED-003; RN-MED-001 |
| §12.1 `DIG_MED` (0 → 5) | RN-MED-002; §19 (`SERSOC`) |
| §12.1 `FAC_MED` (0 → 1; negativo) | RN-MED-003, 050; CTR-MED-04 |
| §12.1 `INDICADO` | RN-MED-004 |
| §12.1 `LECTURA_CON_FACTOR` | RN-MED-005 |
| §12.1 `TIP_MED` / `SIS_TEL` | RN-MED-006; RF-MED-002 |
| §12.1 `COD_PROP` | RF-MED-024; RN-MED-007 |
| §12.1 `EST_LEC`, `FEC_LEC`, `CON_ANT` | RN-MED-008 (valores derivados) |
| §12.1 `COD_PTH` | RN-MED-009 (M13) |
| §12.1 `RETIRADO` | RF-MED-022; RN-MED-010 |
| §12.1 `ID_SYS_TEL` | RN-MED-011 |
| §12.1 `DatosDeMedidor` (DTO) | Descartado: detalle de implementación; reemplazado por el modelo §7 |
| §12.2 mediciones múltiples `MEDSOC` (A, R, DP, DFP, DV) | RF-MED-004, 013, 014; RN-MED-012 |
| §12.2 `ActualizarMedSoc`, `RecuperarConsumo` | RF-MED-014; RN-MED-012 |
| §12.2 consultas de GC como N lecturas; V2 2520 orden por concepto | RF-MED-015; RN-MED-013 |
| §12.2 medidor testigo | RF-MED-087, 088; RN-MED-040, 072 |
| §12.3 alta (`ValidarMedidor`, `Existe_MedidorEnSersoc`, `MoverStock`) | RF-MED-016, 019; RN-MED-001, 009 |
| §12.3 cambio por OT, pasos 1 a 4 | RF-MED-018, 020, 060; RN-MED-015, 094; CU-07; CU-MED-14 |
| §12.3 retiro (`Actualizar_Medidor_SERSOC`, V2 2399, `Es_Trazable`) | RF-MED-017, 022; RN-MED-010 |
| §13.1 servicios `COD_SER1..4` | RF-MED-025; RN-MED-023 |
| §13.1 criterio `REC_CAL` 0/1/2 y `ORD_CAL` | RF-MED-025; RN-MED-023 |
| §13.1 zonas `CONNZONA` y categorías | RF-MED-025; RN-MED-023 |
| §13.1 orden `ORDEN` 0 a 3; V2 2590 | RF-MED-026; RN-MED-024; CTR-MED-18 |
| §13.1 `SERV_DESC` | RN-MED-025 |
| §13.1 `TELEMED` | RN-MED-026 |
| §13.1 exclusión de prepagas; condiciones 2, 3 y 4 | RN-MED-025, 110; CTR-MED-11 |
| §13.2 estados G → E → I → C / R | RN-MED-034; §8 |
| §13.2 paso 1 generar (umbrales, V2 439, pseudo-medidor "sd", V2 2809) | RF-MED-029; RN-MED-027, 029, 031 |
| §13.2 paso 2 guardar (duplicados, V2 3063, bloqueo por otra ruta, V2 2559) | RF-MED-030, 031; RN-MED-028, 030 |
| §13.2 paso 3 exportar | RF-MED-033; RN-MED-043, 044 |
| §13.2 paso 4 importar (`SetConsumo`, `CheckearLectura`, estado R) | RF-MED-036; RN-MED-047 a 051 |
| §13.2 paso 5 revisar (filtros, "solo fuera de rango", umbrales no bloquean) | RF-MED-035; RN-MED-053; CTR-MED-01 |
| §13.2 paso 6 confirmar (rechazos, observación → OT o estimado, V2 2682, `CONS_SER`/testigo, actualización, fotos V2 2595) | RF-MED-036, 049, 059; RN-MED-035 a 041; CTR-MED-15 |
| §13.2 paso 7 histórico y limpieza (`HISWORK`, `LimpiarRutas`) | RF-MED-039, 040; RN-MED-042 |
| §13.3 carga manual (cargo adicional, testigo, con factor) | RF-MED-051, 052, 088; RN-MED-059 |
| §13.3 captor USB (PSION/Android; datos V2 458, 468, 469, 2293, 2297, 2298, 2331, 748, 3197, PMovil 28; V2 2098; `ValidarLecturasAnteriores`; V2 2345) | RF-MED-033, 056; RN-MED-033, 047; PA-MED-11 |
| §13.3 app móvil en la nube (MySQL compartida, `CUENTAS_MODULOS`, `Sincronizar_Rutas`, estados 1/2, S3 PMovil 72, `ValidarBorrarRuta`) | RF-MED-043, 047, 039; RN-MED-126; CTR-MED-07 |
| §13.3 archivos de terceros: genéricos (Excel, texto, dbf) | RF-MED-053; RN-MED-061 |
| §13.3 formatos por cooperativa: Aguas Cordobesas (`clsImportacion_AC`, V2 2054), CEMDO, Ordóñez, Oncativo, Brinkmann, Oliva, San José, 15 de Mayo | RF-MED-054 (perfiles precargados); PA-MED-12 |
| §13.3 formatos por fabricante: Caucete, Temetra, Nexus, Thinking, Bovetech, Hexing, Rainbow (V2 3074/3075), Huinca, Trelew | RF-MED-054; PA-MED-12 |
| §13.3 emparejamiento por medidor (relleno a 10) o cuenta; mapeo por nombre de producto; V2 2087 | RN-MED-061; PRM-MED-060 a 066 |
| §13.3 importación directa de consumos (ARR, Nexus Electric) | RF-MED-055; RN-MED-060 |
| §13.3 telemedición (`TomarEstadoTelemedicion`, `ObtenerMediciones`, `RecibirTelemediciones`) | RF-MED-105; RN-MED-062, 063 |
| §14.1 fórmula (igual, indicado/adicional, diferencia, vuelta, `GetMaxConsumo`) | RF-MED-061; RN-MED-065 |
| §14.1 inversa `CalcularEstadoActual`, `RegistrarConsumo` | RN-MED-067 |
| §14.1 "ojo" vuelta implícita | RF-MED-062; RN-MED-066; CTR-MED-02 |
| §14.1 `EliminarConsumo` | RF-MED-069; RN-MED-055; CTR-MED-05 |
| §14.2 fecha nula o anterior | RN-MED-047 |
| §14.2 servicio sin medidor; servicio 0 o inexistente | RN-MED-048 |
| §14.2 estados negativos | RN-MED-049 |
| §14.2 consumo negativo con factor positivo | RN-MED-050 |
| §14.2 dígitos (V2 2088) | RN-MED-051; PRM-MED-027 |
| §14.2 sin validación de mínimo, máximo ni promedio | RN-MED-076; CTR-MED-01 |
| §14.3 detección visual; variación % y desvío de días | RF-MED-064; RN-MED-073 a 075 |
| §14.3 promedio de N períodos y % global V2 439 | RN-MED-073; CTR-MED-12 |
| §15 estimación por promedio (N ≤ 12, decimales, división por cero) | RF-MED-074; RN-MED-084; PA-MED-02 |
| §15 `GuardarConsumosEstimados` ("agregar días", propiedades) | RF-MED-078; RN-MED-086 |
| §15 estimar en ruta (`GuardarEstimadoImpWork`) y marcar erróneos (`SetearConErrorImpWork`) | RF-MED-076; RN-MED-087 |
| §15 otros estimados (observación, adicional, redistribución) | RN-MED-088 |
| §15 bonificación de estimados (fórmula, `CONS_BONIF`, `NOTA_SUM`) | RF-MED-079; RN-MED-089; CTR-MED-13; PA-MED-01 |
| §16.1 división por período (110 % a 300 %, `GRUPO`, `SEG_TOT`, `Valores`) | RF-MED-082; RN-MED-091, 068 |
| §16.1 mitades, días máximos, cambio de medidor, prorrateo | RN-MED-092 a 095 |
| §16.1 exclusión de servicios con múltiples medidores; proceso masivo | RF-MED-084; RN-MED-096 |
| §16.2 corrección de gas (neto, presión, temperatura, factor calórico, coeficiente, óptimo, redondeo, recorrección) | RF-MED-063; RN-MED-069, 070; CTR-MED-06; CU-MED-12 |
| §16.3 distribución (porcentaje, igualada, combinada con tope, negativo del padre, exclusiones, V2 2618) | RF-MED-085, 086; RN-MED-097 a 100; CTR-MED-16; PRM-MED-113 |
| §17 potencia contratada vs. registrada | RF-MED-089; RN-MED-101 |
| §17 `clsTransgresiones` (% de transgresión, `PRIMER_TRANSGRESION`, `DEC_CON`, `FEC_DECCON`, reset) | RF-MED-091, 092; RN-MED-102, 103; CU-MED-07 |
| §17 `SERSOC_DEMANDASXPERIODO`, `GetTotalContratado` | RF-MED-089, 090; RN-MED-101 |
| §18 inyección como `MEDSOC` activo negativo; `GetTotalConsumoInyectada` | RF-MED-095, 097; RN-MED-117; CTR-MED-04 |
| §18 `CheckearLectura` acepta negativo con factor negativo | RN-MED-050 |
| §18 V2 3094 y V2 2737 (crédito por inyección en factura) | M04/M05/M07 (fuera de MED); MED entrega el balance (RF-MED-097) |
| §18 registro del generador Discar (`LEC_MEDTEL.GENERADOR`) | RF-MED-096 |
| §19.1 `SistemaTelemedicion`: configuración | RF-MED-103; RN-MED-107 |
| §19.1 ciclo del medidor (alta, cambio de categoría, asignación, retiro, cambio, confirmar OT) | RF-MED-107; RN-MED-107 |
| §19.1 corte y reconexión | RF-MED-108; RN-MED-104 |
| §19.1 lecturas (`TomaEstado`, `Get_PropiedadesLectura`, `TomarLectura`) | RF-MED-105; RN-MED-062 |
| §19.1 prepago (`ValidarPreVenta`, `CargaCreditoPrepago`, `EstadoCargaCredito`, `HistorialCargas`) | RF-MED-114 a 116; RN-MED-111 |
| §19.1 varios (`GenerarOT`, `RegistrarAuditoriaTelemedicion`, `Save_Operacion`) | RF-MED-049, 109; RN-MED-108 |
| §19.1 fábrica `GetSistema` y tabla `TELEMEDICION` | RF-MED-103; RN-MED-109; CTR-MED-10 |
| §19.1 OT abierta si el proveedor falla | RN-MED-105; CTR-MED-08 |
| §19.2 Discar (1): comandos, registros T0..T6, máximo de 3 registros, V2 2504/2336/2594/3116 | RF-MED-104; RN-MED-114; PRM-MED-140 a 142 |
| §19.2 Partner (3) | RN-MED-116 (no implementado; se verifica si hay clientes) |
| §19.2 Boiero, Boiero TSM (4, 12); CashPower, CashPower MWS (9, 18); C_Token (19) | RF-MED-113 a 116 (familia prepago); PA-MED-04 |
| §19.2 AION (5) | Reemplazado por M10/T06 **[VERIFICAR]** (§13) |
| §19.2 NEXO, NEXO SQL, NEXO TCP2, NEXO PLUS (6, 7, 10, 13); V2 2491, 2370 | RN-MED-115; PRM-MED-132 |
| §19.2 MikroTik (8), Radius Gretix y Radius (11, 16), Sensa (15), SmartOLT (17), Sopnet y Wispro (23, 26) | Reemplazado por M10/T06 (CTR-MED-14) |
| §19.2 BATCOM (14) | M01/M10 (integración de padrón; no es medición) |
| §19.2 Hexing (20), Rainbow (21) | RF-MED-104, 105 (familia medición) y prepago Hexing |
| §19.2 QUO, Silexis, Kaptor (22, 24, 25) | RF-MED-105 (toma de estado por HTTP) |
| §19.2 central telefónica (2) | M10 |
| §19.2 `ValidarPrepaga`, `RegistroVentaPrepagaTelemed` | RF-MED-114, 115 |
| §19.2 sin curvas de carga | RF-MED-111; PA-MED-03 |
| §20 parámetros V2 de medición | §14.1 y §14.2 (detalle en 22.5) |
| §21.6 un solo pipeline de lecturas | RF-MED-053; §9; CTR-MED-09 |
| §21.7 validación más fuerte | RF-MED-062, 064; RN-MED-073, 076; CTR-MED-01, 02, 12 |
| §21.8 estimados con trazabilidad | RF-MED-079; RN-MED-085; CTR-MED-13 |
| §21.9 medidores como activo | RF-MED-003, 016 a 019; CTR-MED-03 |
| §21.10 canales e inyección | RF-MED-013, 095; CTR-MED-04 |
| §21.11 adaptadores, familias, asincronía, curvas | RN-MED-105, 106; RF-MED-111; CTR-MED-08, 14 |
| §21.14 migración | §19 |
| §21.1 a 21.5, 21.12, 21.13 | Fuera de MED (M01, M02, M04, M11) |
| §22 Duda 2 | RN-MED-084; PA-MED-02 |
| §22 Duda 3 | RN-MED-066; CTR-MED-02 |
| §22 Duda 5 | RN-MED-116 |
| §22 Duda 7 | §19 (reglas generales) |
| §22 Duda 9 | RN-MED-117; §19 (`SERSOC`) |
| §22 Duda 10 | RN-MED-114; PRM-MED-063, 064, 066, 142 **[VERIFICAR]** |
| §22 Duda 11 | RN-MED-073; CTR-MED-12 |
| §22 Duda 12 | RN-MED-089; PA-MED-01 |
| §22 Duda 13 | RN-MED-126; PA-MED-09, PA-MED-13 |
| §22 Duda 15 | RF-MED-111; PA-MED-03 |
| §22 Duda 16 (`Retirar_Medidor` sin efecto) | RN-MED-010 (el retiro siempre persiste); **[VERIFICAR]** en migración |
| §22 Duda 21 | RN-MED-122; PA-MED-10 |
| §22 Duda 23 | RN-MED-120 |
| §22 Dudas 1, 4, 6, 8, 14, 17 a 20, 22 | Fuera de MED (M01, M02, M04, M06) |
| §23.1 `MEDSOC`, recorridos, cambio de clase, `Actualizar_CategoriaConsumo`, teléfono móvil como medidor | RF-MED-010, 018, 071, 102; RN-MED-001, 015, 022, 082, 122 |
| §23.2 operaciones especiales de corrección | RN-MED-008 (recálculo de derivados) |
| §23.6 `ActualizarMedSoc`; división (días máximos, cambio de medidor, prorrateo, `Valores`) | RF-MED-014, 082; RN-MED-012, 068, 093 a 095 |
| §23.7 `RegistrarConsumo` ya facturado | RN-MED-081 (no se replica fuera de M05) |
| §23.7 `Crear_CONS_SER`, `Guardar_CONS_SER` desde OT | RN-MED-057, 058 |
| §23.7 `CargarMedsocNuevo`, `CargarMedsocPNuevo` | RN-MED-016 |
| §23.7 `GuardarConsumosEstimadosTestigo` | RF-MED-077 |
| §23.7 `GetUltimoConsumoNoFacturado`, `ConsumoFacturado` | RF-MED-070; RN-MED-080 |
| §23.7 `EsServicioPrepago` | RN-MED-110 |
| §23.7 `Existe_DST_CONSUMO`, `Guardar_DST_CONSUMO`, `Guardar_ConsumosDistribuidos`, `EliminarDistribucion` | RF-MED-085, 086; RN-MED-097, 099, 100 |
| §23.7 medidores propios y pérdidas | RF-MED-100, 101; RN-MED-119 a 121; CU-MED-13 |
| §23.7 `CalcularDiferenciaPorcentualConsumo`, `CalcularDiferenciaPorcentualDias` | RN-MED-074, 075 |
| §23.7 `Get_ControlMedidores` | RF-MED-073; RN-MED-083 |
| §23.7 `ActualizarRecorrido` | RF-MED-027; RN-MED-045 |
| §23.7 informes a reguladores (`INFOCTD/G/N`, OCEBA 544, Res. 431/24 y 65/25) | RF-MED-125 (dataset); informes en M06 |
| §23.7 `clsTransgresiones.GetTransgresiones`, `Procesar` | RF-MED-092; RN-MED-103 |
| §23.7 `GetConsumosBonificar` (telemedidas, medidor actual, redondeo) | RF-MED-080; RN-MED-089 |
| §23.7 `clsLlamadas` (telefonía) | M10 |
| §23.7 métodos sin regla | Cubiertos por las consultas de PAN-MED-12, 18, 22 y API-MED; sin regla propia |
| §23.9 lo que quedó fuera de la pasada | Sin requisito; se revisa en la verificación con base real |

### 22.4 CAT §3 (24 tablas) y tablas relacionadas

| Tabla | Destino |
|---|---|
| `AUDITORIA_TELEMEDICION` | `integrationMessages` (T06; antes `meteringConnectorLogs`, CTR-DAT-61) |
| `CERESTAD` | `readingConditionCodes` **[VERIFICAR]** |
| `CONNRUTA` | `readingRoutes` |
| `CONNZONA` | `readingRoutes.zones` |
| `CONSUMOP` | `meterReadings` / `consumptions` (punto propio) |
| `CONS_SER` | `meterReadings`, `consumptions`, `consumptionAdjustments` |
| `CONS_SER_TESTIGO` | `meterReadings` / `consumptions` (testigo) |
| `DISPOSI` | `meters` |
| `DST_CONSUMO` | `consumptionDistributions` |
| `HISWORK` | `readingTasks` archivadas |
| `HIS_MEDSOC` | `meterInstallations` y historia de `meteringChannels` |
| `IMP_WORK` | `readingBatches`, `readingTasks` |
| `LEC_MEDTEL` | `telemetryRegisterMappings` |
| `MARMED` | `meterBrands` |
| `MEDIDORP` | `meteringPoints` (`purchase`) y `meteringChannels` |
| `MEDSOC` | `meteringChannels` |
| `MED_TESTIGO` | `meteringPoints` (`witness`) |
| `OBSESTAD` | `readingObservationCodes` |
| `OBSMED` | `meterObservationCodes` |
| `RESESTAD` | `readingResultCodes` |
| `SERSOC_DEMANDASXPERIODO` | `demandDeclarations` |
| `TELEMEDICION` | `meteringSystems` (credenciales en bóveda) |
| `TELEMED_COMM` | `remoteMeterOperations` |
| `TIPMED` | `meterTypes` |
| Relacionadas (otras secciones de CAT o DFA): `ESPE_MED`, `FACTOR_CAL`, `CORREGAS`, `CTRLCNC`, `SU_HORAS_LECTOR`, `SERSOC` (campos de medidor y `CONS_BONIF`), `SERSOC_EXTRAS` (`ALTA_GENERA`, `POTENCIA_GENERA`, `COD_TES`) | `meterTypes`, `gasCorrectionFactors`, `consumptionExceptions`, `readerWorkSessions`, `meteringPoints`, `consumptionAdjustments`, `distributedGenerationContracts` (§19) |
| Relacionadas de otros módulos: `PRCAGAS`, `INFOCTD`, `INFOCTG`, `INFOCTN`, `BANDAS`, `MOVIL`, `VARIABLE_PMOVIL` | `PRCAGAS` y `BANDAS` → M04; `INFOCT*` → M06; `MOVIL` y `VARIABLE_PMOVIL` → configuración de la app de campo (PRM-MED-030 a 045) |

### 22.5 Parámetros V2 (CONSUMOS y TELEMED)

| V2 | Destino |
|---|---|
| CONSUMOS 55 | PRM-MED-050, PRM-MED-155 |
| CONSUMOS 2568 | PRM-MED-154 |
| CONSUMOS 2618 | PRM-MED-113 |
| CONSUMOS 2658 | PRM-MED-005 |
| PMovil 28 | PRM-MED-039 |
| PMovil 29 | PRM-MED-106 |
| PMovil 30 | Tabla 14.2 → M10; RF-MED-049 |
| PMovil 38 | PRM-MED-150 |
| PMovil 47 | PRM-MED-033 |
| PMovil 69 | PRM-MED-040 |
| PMovil 72 | Tabla 14.2: Descartado (almacenamiento privado por tenant) |
| 439 | PRM-MED-020 |
| 451, 452 | PRM-MED-066 |
| 453, 454 | Tabla 14.2: Descartado (sin carpetas locales) |
| 455 | PRM-MED-063 |
| 458 | PRM-MED-030 |
| 468 | PRM-MED-031 |
| 469 | PRM-MED-032 |
| 720 | PRM-MED-016 |
| 748 | PRM-MED-037 |
| 2054 | PRM-MED-063 |
| 2087 | PRM-MED-061 |
| 2088 | PRM-MED-027 |
| 2098 | PRM-MED-011 |
| 2241 | Tabla 14.2: Descartado (sin captor USB directo, PA-MED-11) |
| 2293 | PRM-MED-033 |
| 2297 | PRM-MED-034 |
| 2298 | PRM-MED-035 |
| 2307 | PRM-MED-066 |
| 2331 | PRM-MED-036 |
| 2332 | PRM-MED-042 |
| 2334 | PRM-MED-018 |
| 2336 | PRM-MED-140 |
| 2340 | PRM-MED-017 |
| 2345 | Tabla 14.2: Reemplazado por cancelación auditada (RN-MED-042) |
| 2466 | PRM-MED-102 |
| 2475 | PRM-MED-151 |
| 2504 | PRM-MED-140 |
| 2559 | PRM-MED-014 |
| 2590 | PRM-MED-153; RF-MED-026; CTR-MED-18 |
| 2595 | PRM-MED-042 |
| 2682 | Tabla 14.2: Reemplazado (RN-MED-037, CTR-MED-15) |
| 2809 | PRM-MED-015 |
| 2992 | PRM-MED-152 |
| 3063 | PRM-MED-065 |
| 3140 | PRM-MED-064 |
| 3197 | PRM-MED-038 |
| Citados en RN-06 fuera de los módulos CONSUMOS/TELEMED: 2370, 2399, 2491, 2520, 2594, 2737, 3074, 3075, 3094, 3116 | PRM-MED-132 (2370, 2491); RN-MED-010 (2399); RF-MED-015 (2520); PRM-MED-141 (2594); PRM-MED-142 (3116); RN-MED-061 (3074/3075); M04/M05 (2737, 3094) |

### 22.6 Inventario de formularios y clases

| Formulario o clase | Destino |
|---|---|
| `abm_Cons_Ser` | PAN-MED-13 |
| `abm_DstConsumos` | PAN-MED-17 |
| `abm_InfoCtd` | Reemplazado por M06 (§10.2) |
| `frmAgrupaDivideConsumos` | PAN-MED-16 |
| `frmBonificacionEstimados` | PAN-MED-15 |
| `frmConsultaConsumoMedido` | PAN-MED-12 |
| `frmConsultaConsumoMedidoTestigo` | PAN-MED-18 |
| `frmConsumosEstimacion` | PAN-MED-14 |
| `frmConsumosExportar` | Reemplazado por M06 (§10.2) |
| `frmDistribucionConsumos` | PAN-MED-17 |
| `frmImpresiones` | PAN-MED-22 |
| `frmInformeConsumoTramasCuedro` | M04/M06 y PAN-MED-22 (§10.2) |
| `frmInformeSecretariaElectrica` | Reemplazado por M06 (§10.2) |
| `frmInformesConsumos` | PAN-MED-22 |
| `frmPerdidasServiciosMedidos` | PAN-MED-21 |
| `frmRegistroConsumoPropio` | PAN-MED-21 |
| `frmRegistroLecturas` | PAN-MED-09 |
| `frmRegistroMedidoPropio` | PAN-MED-21 |
| `frmTransgresiones` | PAN-MED-19 |
| Control `listTramas` | Reemplazado por M04 (§10.2) |
| `DatosConsumo`, `DatosConsumo_Medidos` | PAN-MED-12 |
| `DatosConsumo_Telefonico`, `DatosConsumo_Telefonico_Fact` | Reemplazado por M10 (§10.2) |
| `frmComandosTelemedicion`, `frmOperacionesTelemedicion` (ProMod_Titulares) | PAN-MED-24 |
| Telemed > Administración de rutas, Generar/Detalle de ruta, Informes | PAN-MED-05, 07, 08, 24 |
| `frmVentaPrepaga`, `frmVentaPrepagaRapida`, `frmConfiguracionPrepaga`, `frmConfiguracionPrepaga_TipoFac` (ProMod_Cobranzas) | M07/M11; MED provee PAN-MED-25 |
| `frmTecnica_CambioMedidor` (ProMod_Tecnica) | M10; MED provee PAN-MED-04 |
| App PMovil / Captor; "Mi Medidor" (PMovil 55) | PAN-MED-28 a 31 |
