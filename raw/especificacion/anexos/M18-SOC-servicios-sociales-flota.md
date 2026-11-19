# M18 SOC — Servicios sociales, otros servicios y flota

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (servicios sociales, cementerio, vivienda, flota); Landing-autogestión (grupo familiar, solicitudes, estado de vivienda); APIs (GPS/AVL, prestadores) |
| Olas | **O4** (registro de adherentes y beneficiarios y sus `billing-inputs` — DEC-071, antes "solo si la cooperativa piloto factura servicios con tarifa por adherente — PA-SOC-14"); **O10** (resto: planes de cobertura, sepelio, subsidio, cementerio parque, banco de sangre, salud y ambulancias, planes de vivienda, otros servicios, flota, traslados y GPS). El catálogo mínimo de vehículos y choferes pasa a **O8** si M10 TEC necesita asignar móviles a órdenes de trabajo. |
| Dueño de datos | `serviceDependents`, `serviceBeneficiaries`, `dependentEvents`, `coveragePlans`, `careProviders`, `providerAgreements`, `medicalSpecialties`, `medicalProfessionals`, `benefitRequests`, `burialServiceCases`, `deathSubsidyCases`, `cemeteries`, `cemeteryRegulations`, `burialUnits`, `burialRights`, `burialRightEvents`, `burialOccupancies`, `cemeteryActs`, `bloodCoverageRequests`, `donationCampaigns`, `donationAppointments`, `healthAuthorizations`, `transportTrips`, `tripLegs`, `tripCharacteristics`, `orthopedicItems`, `orthopedicLoans`, `dispenserWithdrawals`, `contractRegistrations` (HUECO-OTR-05), `housingPlans`, `housingPrices`, `housingUnits`, `housingContributions`, `housingStages`, `housingActivities`, `housingActivityMaterials`, `housingProgress`, `housingProgressMaterials`, `housingMaterialAllocations`, `housingMaterialWithdrawals`, `housingCertificates`, `housingPlanChanges`, `housingTerminations`, `fleetVehicles`, `drivers`, `vehicleDocuments`, `vehicleMaintenances`, `vehicleUsages`, `fuelTypes`, `fuelLoads`, `tripSettlements`, `gpsDevices`, `gpsPositions` |
| Fuentes consolidadas | BASE §24 (CU-24 y precarga GRU-001/SOC-FAM), §33 (entidades Unidad y derecho de sepultura, Convenio de cobertura, Beneficio y regla tarifaria), §90 (cementerio parque, CU-ESP-CEM), §91 (banco de sangre, CU-ESP-SAN), §92 (otros servicios), §93 (reglas transversales, ESP-001 a ESP-006), §95 (insumos y pendientes de cementerio y banco de sangre), §97.1 (datos sensibles), §100 (matriz: planes de vivienda MER-009, flota MER-015), MER-009, MER-015, §101, §104.3 (SUE-003 novedades desde flota), §105, §106; criterios de aceptación 93 y 94; catálogo de precarga (SOC-FAM, CEM-PAR, SAN-CONV); AGR-007, AGR-008, AGR-030, AGR-033; DFA M23 (traslados y flota), M25 (vivienda y salud) y línea 1269 (validar uso); RN-06 §3.3, §3.5, §4, §5, §7, §10 y reglas de vivienda (`clsViviendas`); RN-01 §7 (cuota de vivienda) y §9 (servicios con adherentes, tipos 9 a 13); RN-02 (anulación de cuotas de vivienda); RN-05 (cobranza de cuota de vivienda); RN-07 (reconexión con titular fallecido y planes de vivienda); RN-08 (vales y rubros de vivienda, carga de combustible por factura, actualización masiva de precios de vivienda); RN-09 TITULARES (75, 109, 413, 414, 415, 417, 418, 419, 2291, 2301, 2400, 2401, 2521, 2527, 2545, 2571, 2581, 2582, 2583, 2584, 3058, 3186, 3187) y VIVIENDA (634, 635, 636, 637, 638, 639, 755, 2276, 2502, 2503, 2569, 2628, 2670, 3137); RN-10 (AVL Discar modo 5, `clsInformes_Traslados`, `clsTraslados`); CAT §1 (`ADHSOC`, `BENSOC`, `VINCULOS`, `TAR_ADHE`, `HIS_TAR_ADHE`, `CATE_SER_EXTRAS`), §10 (`AVL_REG`, `CHOFERES`, `MOVIL`), §12 (`INTERNAC`), §13 (`COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS`, `MAQUINAS`), §14 (`COMBUSTIBLES`, `IVACOM_COMBUSTIBLES`), §19 (tablas de vivienda), §20 (`AMBUCARACTE`, `AMBULANC`, `AMBUMED`, `ESPE_MED`, `MEDICOS`); INV ProMod_Titulares (adherentes, beneficiarios, vivienda, fallecimiento), ProMod_Cobranzas (cobranza de vivienda), ProMod_Facturacion (rendiciones), Configuracion (`abm_Combustible`, `abm_Movil`, `frmRequisito_Adherentes`), ReglasNegocio (`clsViviendas`, `clsInformes_Vivienda`, `clsCombustible`, `clsComprobanteRendicion`, clases de adherentes); README de menús (Operaciones > Planes de Vivienda; Herramientas > Traslados; Rendiciones de Viajes); CNX |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Gestionar los **servicios cooperativos no medidos** y los recursos móviles de la cooperativa, cada uno con reglas propias (BASE §93, ESP-001), y no como un abono mensual genérico (BASE §24):

- **grupos de cobertura**: adherentes y beneficiarios de un servicio (familiares, convivientes, personas a cargo), con altas, bajas, vínculos, edades, mayoría de edad y fallecimiento;
- **sepelio** y **subsidio por fallecimiento**: planes, carencias, solicitudes, prestador, expediente y pago;
- **cementerio parque**: establecimiento, reglamento, unidades de sepultura, derechos, titulares y autorizados, ocupaciones permanentes y actos (inhumación, exhumación, reducción, traslado) (BASE §90);
- **banco de sangre por convenio**: adhesión, cobertura, solicitudes administrativas canalizadas al prestador, campañas de donación como coordinación administrativa, con los límites sanitarios de BASE §91;
- **salud administrativa**: prestadores, profesionales, ambulancias y traslados, autorizaciones de internación por convenio, sin historia clínica;
- **planes de vivienda**: planes y tipologías, precios, inscripción, adjudicación, aportes, construcción por etapas y actividades, materiales, retiros, certificados, cambios de plan, transferencias y rescisión;
- **otros servicios** (BASE §92): banco ortopédico, dispenser de agua, registración de vehículo eléctrico, seguros y extensiones por tenant;
- **flota y traslados**: vehículos, choferes, documentación y vencimientos, mantenimiento, uso por orden de trabajo, combustibles, viajes, rendiciones y seguimiento satelital (GPS/AVL) (MER-015).

El módulo registra hechos administrativos y deja evidencia. **No toma decisiones clínicas** ni de aptitud (AGR-030), **no despacha emergencias** y **no dispone de restos ni de derechos de sepultura por mora** (BASE §90).

## 2. Límite y responsabilidades

### 2.1 Qué hace

| Responsabilidad | Detalle |
|---|---|
| Grupos de cobertura | Adherentes y beneficiarios por contrato de servicio; requisitos por servicio (edad, vínculo, ocupación, discapacidad); cambios de categoría; mayoría de edad; cascadas por desconexión, reconexión, transferencia y fallecimiento. |
| Planes de cobertura | Condiciones de acceso, carencias, edades, vínculos admitidos, topes, alcance territorial, prestadores y convenios. |
| Solicitudes de prestación | Registro único de solicitudes (sepelio, subsidio, banco de sangre, traslado, internación, ortopedia), verificación de cobertura a la fecha del evento, autorización o rechazo con motivo, derivación de excepciones. |
| Cementerio parque | Catálogo físico, derechos y titulares, ocupaciones, actos con permisos y turnos, historial permanente. |
| Banco de sangre | Convenios, cobertura, solicitudes administrativas, campañas y turnos, costos del convenio. |
| Salud y ambulancias | Prestadores, nosocomios, profesionales, especialidades, viajes de ambulancia con tramos, autorizaciones administrativas. |
| Vivienda | Ciclo completo del plan, aportes esperados vs facturados, construcción, materiales, certificados y liquidación a constructores. |
| Otros servicios | Préstamo de elementos ortopédicos, retiros de agua de dispenser, registración de vehículos eléctricos. |
| Flota | Vehículos, choferes, documentación, mantenimiento, uso, combustible, viajes, rendiciones, posiciones GPS. |

### 2.2 Qué NO hace

- No es dueño de la **persona**, sus documentos ni vínculos personales (M01 PER) ni del **contrato de servicio** (M02 CAT, DEC-011/012): el adherente es una persona de M01 vinculada a un contrato de M02 (HUECO-TRV-06; antes decía "contrato de M01").
- **Es dueño único de adherentes y beneficiarios** (`serviceDependents`, `serviceBeneficiaries`, DEC-071, HUECO-TRV-01): M02 solo declara en la ficha del servicio si admite adherentes o beneficiarios; M01 los muestra en la ficha de la persona consultando API-SOC-007 y no los registra. Los requisitos RF-PER-109 a RF-PER-117, EVT-PER-19 y PRM-PER-064 a PRM-PER-072 de M01 quedan reemplazados por los de §5.2 y §14 de este anexo.
- No define la **ficha de dominio** del servicio (tipo de registración, categorías): M02 CAT la resume; M18 aporta el detalle operativo.
- No **calcula** importes facturables (cuota por adherentes, cuota de vivienda, derecho y mantenimiento de sepultura): M04 TAR; no **emite** comprobantes: M05 FAC.
- No **cobra**: M07 COB. No **paga** subsidios, prestadores ni certificados: M14 TES. No **contabiliza**: M15 CON.
- No gestiona **órdenes de trabajo** técnicas ni cuadrillas: M10 TEC (consume vehículos y choferes de M18).
- No **compra** ni gestiona **stock** de materiales: M12 CMP y M13 STK (M18 reserva, asigna y retira contra stock de M13). Los vehículos como **bienes de uso** (amortización) son de M13/M15.
- No liquida **sueldos** de choferes: M16 SUE (recibe novedades de flota, SUE-003).
- No registra **historia clínica**, diagnósticos, grupo sanguíneo, compatibilidad ni aptitud de donantes (BASE §24, §91).
- No es **despacho de emergencias** médicas ni muestra la ubicación en vivo de móviles al asociado (MER-015).
- No define la **condición de asociado**: M17 INS.

### 2.3 Qué delega y a quién

| Necesidad | Módulo | Mecanismo |
|---|---|---|
| Persona, vínculo, fecha de fallecimiento, discapacidad declarada | M01 PER | Servicio `per.persons.get`; eventos `per.person.deceased`, `per.relationship.granted` / `.revoked` / `.expired` (EVT-PER-18) |
| Contrato de servicio (alta, desconexión, reconexión, transferencia, baja) | M02 CAT | Eventos `cat.contract.activated`, `.suspended`, `.reactivated`, `.transferred`, `.terminated` (EVT-CAT-09/10/12/17/15) |
| Tipo de registración y categorías del servicio social | M02 CAT | Ficha de dominio (`registrationType`: adherentes, adherentes según tarifas, dispositivos y adherentes, plan de vivienda, seguro, vehículo eléctrico) |
| Importe por cantidad de adherentes / cuota de vivienda / derecho de sepultura | M04 TAR | Consulta `GET /api/admin/soc/contracts/:id/billing-inputs` (cantidad y perfil de adherentes, % de aporte de vivienda, precio vigente) |
| Emisión de cuotas, comprobantes exclusivos de vivienda, anulaciones | M05 FAC | Eventos `fac.invoice.issued`, `fac.invoice.annulled` |
| Cobranza de cuotas de vivienda y derechos | M07 COB | Evento `cob.payment.confirmed` |
| Deuda para controles de adherentes y mora de vivienda | M08 MOR | Servicio `mor.debt.summary` |
| Uso de vehículos por orden de trabajo | M10 TEC | Eventos `tec.workOrder.statusChanged` (asignación), `tec.workOrder.closed` |
| Fletes de ventas con rendición | M11 VEN | Evento `ven.salesOrder.confirmed` (con flete) |
| Facturas de combustible y de proveedores de vivienda | M12 CMP | Evento `cmp.supplierInvoice.registered` (líneas de combustible y de rubro vivienda) |
| Reserva, retiro y devolución de materiales | M13 STK | Comandos `stk.reservations.create`, `stk.movements.create` (operación vivienda) |
| Pago de subsidios, prestadores, certificados | M14 TES | Comando `tes.paymentOrders.create` |
| Asientos (vales de vivienda, costos de flota, convenios) | M15 CON | Eventos `soc.*` con imputación a obra o centro de costo |
| Novedades de choferes (horas, viáticos) | M16 SUE | Evento `soc.driver.timeReported` |
| Notificaciones (mayoría de edad, vencimientos, turnos) | T09 COM | Comando `com.communications.emit` (API-COM-75) |
| Aprobaciones y expedientes (rescisión, cesión de derecho, subsidio) | T11 WFL | Motor de autorizaciones |
| Adaptadores GPS/AVL y prestadores externos | T06 INT | Conectores |

## 3. Glosario del módulo

| Término | Definición | Clave `dict:` | Término ProCoop |
|---|---|---|---|
| Adherente | Persona incorporada a la cobertura de un contrato de servicio de un titular (por ejemplo, un familiar en el servicio de sepelio). | `dict:soc.dependent` | Adherente (`ADHSOC`) |
| Beneficiario | Persona que recibe una prestación o beneficio vinculado a un contrato, sin necesariamente ser adherente del grupo (por ejemplo, beneficiario de un subsidio). | `dict:soc.beneficiary` | Beneficiario (`BENSOC`) |
| Grupo de cobertura | Conjunto formado por el titular del contrato y sus adherentes vigentes a una fecha. | `dict:soc.coverageGroup` | Grupo familiar |
| Vínculo | Relación del adherente con el titular (cónyuge, hijo, padre, conviviente). Catálogo de M01. | `dict:per.relationship` | `VINCULOS` |
| Plan de cobertura | Conjunto de condiciones de acceso y prestaciones de un servicio social. | `dict:soc.coveragePlan` | Categoría de servicio (`CATE_SER`) |
| Carencia | Plazo desde el alta durante el cual una prestación no está cubierta. | `dict:soc.waitingPeriod` | Sin término |
| Prestación | Servicio efectivamente brindado al amparo de una cobertura. | `dict:soc.benefit` | — |
| Solicitud de prestación | Pedido administrativo de una prestación, con verificación de cobertura y resolución. | `dict:soc.benefitRequest` | — |
| Prestador | Persona u organización que brinda la prestación (empresa fúnebre, red de bancos de sangre, nosocomio, empresa de ambulancias). | `dict:soc.provider` | Empresa, nosocomio |
| Convenio | Acuerdo con un prestador que define cobertura, ámbito, vigencia, costo y modalidad de financiamiento. | `dict:soc.agreement` | — |
| Sepelio | Servicio fúnebre cubierto por un plan. | `dict:soc.burialService` | Servicio de sepelio |
| Subsidio por fallecimiento | Pago a beneficiarios ante un fallecimiento, según reglamento; no es automáticamente un seguro. | `dict:soc.deathSubsidy` | — |
| Cementerio parque | Establecimiento de sepultura gestionado por la cooperativa bajo un régimen jurídico verificado. | `dict:soc.cemetery` | Cementerio parque |
| Unidad de sepultura | Parcela, nicho, urnario u otra unidad física identificada. | `dict:soc.burialUnit` | Parcela |
| Derecho de sepultura | Derecho adquirido sobre una unidad, con titular, modalidad y vigencia. | `dict:soc.burialRight` | — |
| Ocupación | Registro permanente de restos en una unidad, con fecha y acto de origen. | `dict:soc.occupancy` | — |
| Acto de cementerio | Inhumación, exhumación, reducción o traslado de restos. | `dict:soc.cemeteryAct` | — |
| Banco de sangre por convenio | Cobertura administrativa para obtener sangre o hemocomponentes mediante una red habilitada. | `dict:soc.bloodBank` | Banco de sangre |
| Traslado / viaje | Movimiento de una persona en un móvil de la cooperativa o contratado, con origen, destino y tramos. | `dict:soc.trip` | Viaje de ambulancia (`AMBULANC`) |
| Tramo | Segmento de un viaje con varios destinos. | `dict:soc.tripLeg` | `COD_AMB_ORIG` |
| Característica del viaje | Clasificación del traslado (programado, alta, diálisis, derivación, no sanitario: RF-SOC-147). | `dict:soc.tripCharacteristic` | `AMBUCARACTE` |
| Nosocomio | Establecimiento de salud de origen o destino. | `dict:soc.healthFacility` | Nosocomio |
| Plan de vivienda | Programa con tipologías, precio, reglas de aporte y construcción. | `dict:soc.housingPlan` | Plan de vivienda (`PLANESVIV`, tipo de registración 11) |
| Tipología | Modelo de vivienda dentro de un plan, con precio y composición de materiales. | `dict:soc.housingTypology` | Categoría del plan (`COD_CATSER`) |
| Aporte | Porcentaje del valor de la vivienda que el adherente al plan integra en cada cuota. | `dict:soc.housingContribution` | `MINIMO_AA` / `MINIMO_DA` |
| Adjudicación | Asignación de una vivienda a un inscripto, por sorteo, licitación u otra forma. | `dict:soc.allocation` | `FECADJU`, `FORMADJU` |
| Etapa / actividad | Fases y tareas de construcción con orden, horas y costo. | `dict:soc.housingStage` / `dict:soc.housingActivity` | `VIV_ETAPA` / `VIV_ACTIVIDAD` |
| Progreso | Avance registrado de una actividad en una vivienda (porcentaje, horas). | `dict:soc.housingProgress` | `VIV_PROGRESO` |
| Certificado de obra | Documento que mide el avance de un período para liquidar al constructor. | `dict:soc.housingCertificate` | Certificado (`ID_CERT`) |
| Retiro de materiales | Entrega física de materiales para una vivienda con vale. | `dict:soc.materialWithdrawal` | `VIV_RETM` / vale de vivienda |
| Rescisión | Baja del plan antes de la entrega, con comisión y diferencias. | `dict:soc.housingTermination` | Baja de plan |
| Móvil / vehículo | Vehículo propio o contratado de la flota. | `dict:soc.vehicle` | `MOVIL` |
| Chofer | Rol de una persona de M01 habilitada para conducir móviles; la identidad es de la persona y la ficha guarda solo los datos del rol (DEC-097). | `dict:soc.driver` | `CHOFERES` |
| Profesional de salud | Rol de una persona de M01 (médico u otro profesional) vinculado a prestadores y viajes; la ficha guarda especialidad, matrícula y prestador (DEC-097). | `dict:soc.medicalProfessional` | `MEDICOS` |
| Carga de combustible | Litros cargados a un móvil con kilometraje y factura de origen. | `dict:soc.fuelLoad` | `IVACOM_COMBUSTIBLES` |
| Rendición de viaje | Liquidación de un viaje con kilómetros reales, flete, peajes, viáticos y combustible. | `dict:soc.tripSettlement` | `COMP_VEN_RENDICION` |
| Posición GPS | Registro de ubicación y estado de un móvil informado por un dispositivo. | `dict:soc.gpsPosition` | `AVL_REG` |

Nota terminológica: ProCoop usa `INTERNAC` para **llamadas internacionales** (telefonía) y `MAQUINAS` para **equipos vendidos o en reparación**; ninguna de las dos pertenece a salud ni a flota (CTR-SOC-01, CTR-SOC-02).

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Operador de servicios sociales | `soc.adherentes.ver/gestionar`, `soc.beneficiarios.ver/gestionar`, `soc.solicitudes.ver/crear/resolver`, `soc.sepelio.gestionar`, `soc.subsidios.crear` | Sucursales asignadas; sin datos sanitarios salvo permiso |
| Responsable de servicios sociales | `soc.planes.configurar`, `soc.solicitudes.excepcionar`, `soc.subsidios.aprobar`, `soc.prestadores.gestionar`, `soc.convenios.gestionar`, `soc.reportes.ver` | Tenant |
| Operador de banco de sangre | `soc.sangre.ver/gestionar`, `soc.campanas.gestionar` | Solo expedientes de banco de sangre (AGR-008) |
| Operador de salud / traslados | `soc.traslados.ver/gestionar`, `soc.autorizaciones.gestionar`, `soc.profesionales.gestionar` | Solo traslados y autorizaciones; motivo del traslado con permiso `soc.datosSensibles.ver` |
| Administrador de cementerio | `soc.cementerio.ver/gestionar`, `soc.derechos.gestionar`, `soc.actos.programar/registrar`, `soc.cementerio.configurar` | Establecimientos asignados |
| Responsable jurídico de cementerio | `soc.derechos.aprobarCesion`, `soc.derechos.aprobarExtincion` | Tenant |
| Operador de vivienda | `soc.vivienda.ver/gestionar`, `soc.vivienda.gestionarCobranza` (antes `soc.vivienda.cobranza`) | Planes asignados |
| Responsable técnico de obra | `soc.obra.gestionar` (etapas, actividades, progreso, certificados), `soc.materiales.gestionar` | Planes asignados |
| Responsable de planes de vivienda | `soc.vivienda.configurar`, `soc.vivienda.adjudicar`, `soc.vivienda.rescindir`, `soc.certificados.aprobar`, `soc.precios.actualizar` | Tenant |
| Responsable de flota | `soc.flota.ver/gestionar/configurar`, `soc.combustible.gestionar`, `soc.rendiciones.gestionar/aprobar`, `soc.gps.ver` | Tenant |
| Chofer (PWA campo) | `soc.mi.viajes.ver`, `soc.viajes.registrarKm`, `soc.combustible.registrar` | Viajes y vehículos asignados |
| Personal de ortopedia / dispenser | `soc.ortopedia.gestionar`, `soc.dispenser.registrar` | Sucursal |
| Asociado (PWA socio) | `soc.mi.ver` (grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda), `soc.mi.solicitar` (alta/baja de adherente, solicitud de prestación, turno de donación) | Propios y de su grupo |
| Auditor | `soc.*.ver`, `soc.reportes.ver` | Tenant, sin datos sensibles salvo autorización |
| Administrador del tenant | `soc.config.configurar` | Tenant |
| Soporte de plataforma | Sin acceso por defecto; acceso temporal auditado (AGR-034) | Tenant autorizado |

Separación (AGR-008): un supervisor de agua no ve expedientes de banco de sangre; quien registra un subsidio no lo aprueba; quien certifica avance de obra no aprueba el certificado; quien carga una rendición no la aprueba.

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Planes de cobertura y prestadores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-001 | Definir **planes de cobertura** por servicio social: prestaciones incluidas, vínculos admitidos, edades mínima y máxima por vínculo, ocupación, discapacidad, cantidad máxima de adherentes, carencias, alcance territorial, exclusiones y vigencia. | BASE §24, §92, RN-06 §10 (`Get_Cod_Adh_Condicion`), INV `frmRequisito_Adherentes` | Núcleo | O10 | Adoptado | Un plan con edad máxima 21 para hijos rechaza el alta de un hijo de 25 con motivo "edad fuera de rango". |
| RF-SOC-002 | Distinguir **tipos de servicio social** con reglas propias: sepelio, subsidio por fallecimiento, cementerio parque, banco de sangre, ambulancia/traslados, salud por convenio, banco ortopédico, seguro, plan de vivienda, dispenser, vehículo eléctrico. | BASE §24, §92, §93, ESP-001, ESP-002, RN-06 §3.3 | Núcleo | O10 | Adoptado | Cementerio parque no se configura como plan de cobertura familiar (BASE §24). |
| RF-SOC-003 | Registrar **prestadores** (empresa fúnebre, red de sangre, nosocomio, empresa de ambulancias, constructor) vinculados al proveedor de M12 cuando se les paga. | BASE §24, RN-10 (`GetNosocomios`, empresas), CAT `AMBULANC` | Núcleo | O10 | Adoptado | Un prestador con convenio vencido no aparece como opción en solicitudes nuevas. |
| RF-SOC-004 | Registrar **convenios** con prestadores: ámbito, vigencia, condiciones, modalidad de financiamiento (cooperativa, aporte del asociado, gratuito), costo y rendición. | BASE §91, CU-ESP-SAN | Núcleo | O10 | Adoptado | La cobertura a una fecha usa el convenio vigente a esa fecha. |
| RF-SOC-005 | **Carencias** configurables por plan y por adherente (desde su alta), con excepciones autorizadas. | BASE §92 (sepelio: carencias) | Estándar | O10 | A validar (PA-SOC-11) | Una solicitud de sepelio dentro de la carencia se rechaza o deriva a excepción. |
| RF-SOC-006 | **Requisitos documentales** por plan y vínculo (partida, constancia de convivencia, certificado de discapacidad) con vencimiento. | INV `frmRequisito_Adherentes`, BASE §24 | Estándar | O10 | Adoptado | Un adherente con requisito vencido queda observado y se alerta al operador. |
| RF-SOC-007 | Catálogo de **especialidades** y **profesionales** (médicos) vinculados a prestadores y viajes. Cada profesional es un rol de una persona de M01 (DEC-097): `personId` obligatorio, alta asistida de M01 con control de duplicados (RF-PER-174); nombre, documento y contactos se leen de la persona; la ficha guarda especialidad, matrícula, prestador y estado. | CAT `ESPE_MED`, `MEDICOS`, `AMBUMED`; DEC-097 | Estándar | O10 | Adoptado | Un viaje puede registrar uno o varios profesionales acompañantes. Un médico que además es socio tiene una sola persona; no se guarda un profesional sin `personId`. |
| RF-SOC-008 | Catálogo de **nosocomios** y **localidades** de origen/destino (localidades de M01/T04). | RN-10 (`GetNosocomios`) | Estándar | O10 | Adoptado | Un viaje solo admite como origen o destino localidades del catálogo de M01/T04 y como nosocomio uno activo del catálogo; un nosocomio dado de baja no aparece en viajes nuevos y los viajes anteriores lo conservan. |
| RF-SOC-009 | **Diccionario** de términos por tenant (adherente, beneficiario, grupo familiar, parcela). | BASE §65 | Núcleo | O10 | Adoptado | Cambiar `dict:soc.dependent` a "Familiar" se refleja en admin y PWA. |
| RF-SOC-010 | Distinguir **servicio confirmado** por el tenant de servicio candidato; los candidatos no se habilitan sin ficha completa. | BASE §92, §93 | Núcleo | O10 | Adoptado | Un servicio candidato no puede tener contratos. |

### 5.2 Adherentes y beneficiarios

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-011 | **Alta de adherente** a un contrato de servicio: persona de M01, vínculo, fecha de alta, titular del grupo (sí/no), tarifa asignada si corresponde, validación de requisitos del plan. | CAT `ADHSOC` (`COD_SOC`, `COD_SUM`, `COD_SER`, `COD_PER`, `COD_VIN`, `TITULAR`, `FEC_ALT`, `COD_TAD`), RN-06 §10, INV `Adheretes`, `AdherenteRequest` | Núcleo | O4 | Adoptado (DEC-071; antes A validar PA-SOC-14) | El alta registra fecha efectiva y queda en la historia del grupo. |
| RF-SOC-012 | **Adherente titular**: exigir que el titular del contrato figure como adherente salvo configuración. | V2 109 | Estándar | O4 | Adoptado | Con PRM-SOC-001 = false, un grupo sin adherente titular se rechaza. |
| RF-SOC-013 | **Duplicados**: impedir que una persona sea adherente dos veces del mismo servicio salvo configuración; ofrecer dar de baja el vínculo anterior si ya está en otro titular. | V2 2400, V2 2521 | Estándar | O4 | Adoptado | Con PRM-SOC-003 = true, al cargar un adherente existente en otro grupo se pregunta si darlo de baja allí. |
| RF-SOC-014 | **Baja de adherente** con fecha, causa (voluntaria, edad, fallecimiento, desconexión, condición, transferencia) y notificación imprimible; nunca borrado. | CAT `ADHSOC.FEC_BAJ`, INV `Datos_Adherentes_Baja`, `Notificacion_Adherente`, `NotificacionesAdherentes` | Núcleo | O4 | Adoptado | La baja conserva el registro con `endDate` y causa. |
| RF-SOC-015 | **Baja masiva por condición**: dar de baja adherentes que dejaron de cumplir edad, ocupación o vínculo a una fecha, con previsualización e impresión. | RN-06 §10 (`DarBaja_Adherentes_Condicion`), INV `frmBajaAdherentesCondicion`, `Imprimir_BajaAdherentes_Condicion` | Estándar | O10 | Adoptado | La previsualización lista cada adherente con la condición incumplida; nada se aplica sin confirmación. |
| RF-SOC-016 | **Cambio masivo de categoría** de adherentes (recategorización por edad u otra condición). | RN-06 §10 (`CambiarCategoria_Adherentes`), RN-01 §9 (`CAT_AUTO`) | Estándar | O10 | Adoptado | El cambio queda versionado y M04 usa la categoría vigente al período. |
| RF-SOC-017 | **Mayoría de edad**: detectar adherentes que cumplen la edad de corte, avisar por correo/T09 y proponer baja o cambio de categoría. | RN-06 §10 (`Get_Adherentes_MayoriaEdad`, 21 años), V2 3186, V2 3187 | Estándar | O10 | A validar (PA-SOC-04) | JOB-SOC-01 genera la lista diaria y envía el aviso a la casilla configurada. |
| RF-SOC-018 | **Exclusión de discapacidad**: los adherentes con discapacidad acreditada no se dan de baja por edad. | RN-06 §10 (excluye `DISCA`), RN-01 §9 (`DISCAPA`) | Núcleo | O10 | Adoptado | Un adherente con discapacidad de 30 años no aparece en la baja por edad. |
| RF-SOC-019 | **Cascada por desconexión y reconexión** del contrato: baja o suspensión de adherentes y beneficiarios; al reconectar, consultar o restaurar. | RN-06 §4, V2 2401 | Núcleo | O10 | Adoptado | Con PRM-SOC-005 = true, al reconectar se pide confirmar el alta de cada adherente previo. |
| RF-SOC-020 | **Cascada por fallecimiento**: al registrarse el fallecimiento de un adherente se da de baja con causa; si fallece el titular, se alerta para resolver continuidad del grupo y se impide la reconexión salvo configuración. | RN-06 §10 (`SetFechaFallecimiento`), RN-07, V2 2301, INV `frmTitular_Fallecimiento`, `Persona_Fallecidos` | Núcleo | O10 | Adoptado | El titular fallecido genera una tarea; sus adherentes no se dan de baja automáticamente. |
| RF-SOC-021 | Filtrar en la ficha los adherentes **dados de baja por fallecimiento**. | V2 3058 | Extensión | O10 | Adoptado | Con PRM-SOC-007 = true, la ficha oculta por defecto esos adherentes con opción "mostrar". |
| RF-SOC-022 | **Transferencia de servicio**: tratamiento de adherentes y beneficiarios según configuración (dar de baja, mantener). | RN-06 §7, V2 2291 | Estándar | O10 | Adoptado | Con "dar de baja", los adherentes quedan con causa `transfer` en el contrato de origen. |
| RF-SOC-023 | **Control de deuda de adherentes**: advertir o bloquear altas cuando el titular tiene deuda vencida en el servicio. | V2 2545 | Estándar | O10 | Adoptado | Con PRM-SOC-008 activo, el alta muestra la deuda consultada a M08 y exige confirmación. |
| RF-SOC-024 | **Beneficiarios** por contrato: persona, vínculo, fecha de alta y baja, causa de cierre (propia de CoopApps), observaciones, estado, contrato social vinculado. M18 es el destino único de `BENSOC` (HUECO-SEP-02, DEC-086). | CAT `BENSOC` (`COD_VIN`, `FEC_ALT`, `FEC_BAJ`, `COD_CSE` = código compuesto del servicio, no causa; `OBSERVA`, `ACTIVO`, `ID_SERSOC`), RN-06 §10, INV `Beneficiario` | Núcleo | O10 | Adoptado | Un beneficiario dado de baja conserva su historia; un contrato cuyo servicio no admite beneficiarios en la ficha de M02 rechaza el alta. |
| RF-SOC-025 | **Ficha de adherentes** imprimible por contrato. | INV `Imprimir_FichaAdherentes`, `abm_Socios.ImprimirFichaAdherentes` | Estándar | O10 | Adoptado | La ficha imprimible de un contrato lista los adherentes vigentes a la fecha de emisión con vínculo, fecha de alta y marca de titular del grupo, y coincide con la grilla de adherentes de la ficha en pantalla. |
| RF-SOC-026 | **Datos de facturación** para M04: cantidad de adherentes vigentes en el período, por vínculo, ocupación, edad al último día del período, categoría y tarifa asignada; excedentes sobre los primeros N. | RN-01 §9 (tipos 9 a 13, `TAR_ADHE`, `COBRAEXCEDENTE`, `CAN_ADH`), CAT `TAR_ADHE`, `HIS_TAR_ADHE` | Núcleo | O4 | Adoptado (DEC-071; antes A validar PA-SOC-14) | Para el período 10-2026, la cantidad informada coincide con los adherentes vigentes al 31-10-2026. |
| RF-SOC-027 | **Informe de adherentes** por servicio, plan, vínculo, edad y estado. | INV `Informe_Adherentes`, `AdherentesServicio`, `GetCantidad_Adherentes` | Estándar | O10 | Adoptado | El informe filtrado por servicio, plan, vínculo, rango de edad y estado devuelve los mismos adherentes que la grilla con esos filtros, y el total informado es igual a la cantidad de filas listadas. |
| RF-SOC-028 | **Alerta de titular sin servicios** que sigue siendo adherente, beneficiario o garante. | V2 2571 | Estándar | O10 | Adoptado | M18 responde a M17/M01 si la persona es adherente o beneficiaria vigente. |
| RF-SOC-029 | **Alta automática** de adherentes al conectar un servicio base (por ejemplo, sepelio al conectar energía) según la ficha de M02. | RN-06 §3.5 (`ALTASEAU`) | Estándar | O10 | Adoptado | Al recibir `cat.contract.activated` de energía con regla de alta automática, se crea el contrato de sepelio y su adherente titular. |
| RF-SOC-030 | **Autogestión del grupo** en PWA: ver integrantes, solicitar altas y bajas con documentación (efectivas tras validación). | BASE §25, §24 | Estándar | O10 | Adoptado | Una solicitud de alta desde la PWA queda pendiente hasta que el operador la valide. |
| RF-SOC-149 | **Importar adherentes desde archivo** por contrato o en lote con `ExcelImportWizard` (persona por documento, vínculo, fecha de alta, titular del grupo), con vista previa de errores y las mismas validaciones del alta individual (RF-SOC-011 a RF-SOC-013). Reemplaza a RF-PER-114 de M01 (HUECO-TRV-01). | INV `abm_SerSoc.btnImportarAdh`; DEC-071 | Extensión | O10 | Adoptado | Una fila con una persona ya adherente activa del mismo servicio se muestra como error en la vista previa y no se carga. |

### 5.3 Solicitudes de prestación y cobertura

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-031 | **Solicitud de prestación** única con tipo, beneficiario, fecha del evento, prestador, canal y documentación. | BASE §24 (CU-24) | Núcleo | O10 | Adoptado | Toda prestación de sepelio, sangre, traslado, internación, ortopedia o subsidio nace de una solicitud. |
| RF-SOC-032 | **Verificar cobertura a la fecha del evento**: contrato vigente, adherente vigente, carencia cumplida, prestación incluida, topes. Se agrega (HUECO-SEP-01): cobertura no suspendida por mora a la fecha del evento según la condición que M08 publica con el evento de cobertura social de M08 (RN-MOR-143, RF-MOR-224; M18 guarda la condición con fecha de suspensión y de rehabilitación) y, si fue rehabilitada, **carencia de rehabilitación** cumplida (RN-SOC-054, PRM-SOC-052). Urgencias y prestaciones sanitarias no se evalúan contra esas dos condiciones (RN-SOC-022). | BASE §24; HUECO-SEP-01 | Núcleo | O10 | Adoptado | Si el beneficiario no estaba incorporado a la fecha del evento, la solicitud pasa a revisión sin alterar la cobertura retroactivamente. Con PRM-SOC-052 = 30 y cobertura rehabilitada el 01-10-2026, una solicitud de sepelio por un evento del 15-10-2026 queda `inReview` con motivo "carencia de rehabilitación" (ESC-SOC-24). |
| RF-SOC-033 | **Autorizar o rechazar** con motivo; **derivar excepciones** a un responsable con plazo. | BASE §24 | Núcleo | O10 | Adoptado | Un rechazo sin motivo no se puede guardar. |
| RF-SOC-034 | Registrar **costos y autorizaciones** del prestador (número de autorización, importe convenido, factura del prestador vinculada en M12). | BASE §24 | Estándar | O10 | Adoptado | El costo de la prestación se concilia con la factura del prestador. |
| RF-SOC-035 | **Consultar prestaciones utilizadas** por grupo, beneficiario, plan y período, contra topes. | BASE §24 | Estándar | O10 | Adoptado | Un tope anual de 2 traslados muestra 1 disponible tras el primero. |
| RF-SOC-036 | La **deuda** del titular no rechaza automáticamente una prestación urgente; solo genera advertencia y la decisión la toma un responsable. | BASE §91 (límites), AGR-030 | Núcleo | O10 | Adoptado | Una solicitud de sangre con deuda queda "en gestión" con advertencia, no rechazada. |
| RF-SOC-037 | **Documentación sensible** con permisos específicos; nunca visible en muro, BI general ni bot. | BASE §24, §91, §97.1, AGR-033 | Núcleo | O10 | Adoptado | Un rol sin `soc.datosSensibles.ver` ve "documento restringido". |
| RF-SOC-038 | **Solicitud desde la PWA** del asociado con seguimiento de estado. | BASE §25 | Estándar | O10 | Adoptado | El asociado ve el estado y la respuesta sin datos clínicos. |

### 5.4 Sepelio y subsidio por fallecimiento

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-039 | **Caso de sepelio**: fallecido (persona M01), solicitante, contrato y plan, prestador, servicios brindados (velatorio, traslado, inhumación/cremación), lugar, fecha, documentación (certificado de defunción). | BASE §92 (sepelio: cobertura, grupo, prestador, evento, documentación) | Estándar | O10 | Adoptado | El caso registra el fallecimiento en M01 si aún no existe. |
| RF-SOC-040 | Verificar **cobertura territorial y exclusiones** del plan de sepelio. | BASE §92 | Estándar | O10 | Adoptado | Un fallecimiento fuera del alcance territorial se deriva a excepción. |
| RF-SOC-041 | **Coordinación del evento** con el prestador: estado, horarios, traslado vinculado (`transportTrips`) y cierre. | BASE §92 | Estándar | O10 | Adoptado | El caso cerrado tiene la conformidad del prestador. |
| RF-SOC-042 | **Costo** del sepelio: cubierto por el plan, adicional a cargo del solicitante (facturable vía M05) y factura del prestador (M12). | BASE §24, §92 | Estándar | O10 | Adoptado | Un adicional genera una solicitud de facturación con concepto del catálogo. |
| RF-SOC-043 | Vincular el caso con **cementerio parque** si la inhumación es en el cementerio de la cooperativa (crea un acto de inhumación). | BASE §90 (controles) | Estándar | O10 | Adoptado | La inhumación se agenda en el cementerio con el derecho del titular. |
| RF-SOC-044 | **Subsidio por fallecimiento**: reglamento y fondo, requisitos, beneficiarios con porcentaje, expediente, aprobación y pago (M14). | BASE §92 (subsidio) | Estándar | O10 | A validar (PA-SOC-10) | Sin aprobación no se emite la orden de pago. |
| RF-SOC-045 | **Importe** del subsidio por reglamento versionado (fijo o según plan) a la fecha del fallecimiento. | BASE §92 | Estándar | O10 | Adoptado | El importe usa la versión vigente a la fecha del fallecimiento. |
| RF-SOC-046 | **Plazo de reclamo** y prescripción configurables. | BASE §92 (controles) | Extensión | O10 | Adoptado | Una solicitud fuera de plazo se deriva a excepción. |
| RF-SOC-047 | Distinguir **sepelio, subsidio y cementerio**: un asociado puede tener alguno y no los otros. | BASE §90 (controles) | Núcleo | O10 | Adoptado | Un asociado con cementerio y sin sepelio no obtiene cobertura de sepelio. |
| RF-SOC-048 | **Seguros por cuenta de terceros** (sepelio o vida) como cobertura con aseguradora prestadora y número de póliza, sin cálculo actuarial. | RN-06 §3.3 (tipo Seguro) | Extensión | O10 | Adoptado | Una cobertura de seguro sin aseguradora prestadora o sin número de póliza no se puede guardar; el sistema no calcula primas ni reservas actuariales. |

### 5.5 Cementerio parque

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-049 | **Establecimiento**: nombre, habilitación, modalidad jurídica (CCyC arts. 2103 a 2113 u otra concesión), autoridad de policía mortuoria, reglamento versionado. | BASE §90 | Núcleo | O10 | A validar (PA-SOC-05) | Un derecho nuevo referencia la versión de reglamento vigente. |
| RF-SOC-050 | **Catálogo físico** jerárquico de sectores, manzanas, filas y unidades (parcela, nicho, urnario, otras) con capacidad por niveles. | BASE §90 | Núcleo | O10 | Adoptado | Cada unidad tiene código único en el establecimiento. |
| RF-SOC-051 | **Estados separados** de disponibilidad, reserva, derecho adjudicado y ocupación; impedir reserva o venta duplicada. | BASE §90 | Núcleo | O10 | Adoptado | Dos reservas simultáneas de la misma unidad: la segunda se rechaza. |
| RF-SOC-052 | **Reserva** con vencimiento y liberación automática si no se formaliza. | BASE §90, CU-ESP-CEM | Estándar | O10 | Adoptado | Una reserva vencida libera la unidad y deja evento. |
| RF-SOC-053 | **Derecho de sepultura**: titular identificado, cotitulares, modalidad (perpetuo, temporario, uso), instrumento y documentación, fecha, vigencia, responsables y autorizados. | BASE §90 | Núcleo | O10 | Adoptado | Sin instrumento adjunto el derecho queda `pendingDocumentation`. |
| RF-SOC-054 | Separar **contratante, titular, pagador, fallecido y autorizados** para actuar. | BASE §90, AGR-007 | Núcleo | O10 | Adoptado | Cambiar el pagador no cambia titular ni ocupación (criterio de aceptación 93). |
| RF-SOC-055 | **Obligaciones económicas** por derecho: adquisición (contado o financiada), mantenimiento periódico y actos, cada una con tratamiento propio en M04/M05; M18 informa la clase de ítem `burialRightAcquisition` o `burialRightMaintenance` (RN-SOC-056). | BASE §90, catálogo de precarga CEM-PAR | Núcleo | O10 | Adoptado | La baja del abono de mantenimiento no elimina la ocupación. |
| RF-SOC-056 | **Actos**: inhumación, exhumación, reducción, traslado (interno o externo), con permiso municipal, identificación, fecha, origen y destino, responsables, autorizante y documentación. | BASE §90 | Núcleo | O10 | Adoptado | Un acto sin autorización del titular o autorizado válido no se puede registrar como realizado. |
| RF-SOC-057 | **Turnos** de actos con agenda del establecimiento y control documental previo; la solicitud del portal no ejecuta el acto. | BASE §90 | Estándar | O10 | Adoptado | Una solicitud web queda `requested` hasta validación documental. |
| RF-SOC-058 | **Registro permanente** de ocupaciones e inhumaciones; nunca se borra ni se libera una unidad ocupada por falta de pago. | BASE §90, AGR-033 | Núcleo | O10 | Adoptado | No existe acción "liberar por mora". |
| RF-SOC-059 | **Cesión, transferencia, sucesión y extinción** de derechos con trámite, revisión jurídica y respaldo. | BASE §90 | Estándar | O10 | A validar (PA-SOC-06) | Una cesión sin aprobación del responsable jurídico no cambia el titular. |
| RF-SOC-060 | **Cuenta por derecho/acto** visible en el resumen del asociado. | BASE §90 | Estándar | O10 | Adoptado | El resumen del asociado muestra, por cada derecho de sepultura, las obligaciones de adquisición, mantenimiento y actos con su saldo, y ese saldo coincide con la cuenta corriente de M07. |
| RF-SOC-061 | **Mantenimiento** del parque (tareas, proveedores, materiales) sin tratar restos como stock. | BASE §90 | Extensión | O10 | Adoptado | Las tareas se registran como órdenes internas vinculadas a sectores. |
| RF-SOC-062 | **Mora de cementerio**: no corta otros servicios ni dispone del derecho; habilita gestión de cobranza y, eventualmente, trámite jurídico. | BASE §90 (controles), BASE (deuda de cementerio no corta electricidad) | Núcleo | O10 | Adoptado | Una deuda de mantenimiento no genera orden de corte de electricidad. |
| RF-SOC-063 | **Plano/mapa** del parque con estado por unidad y búsqueda de difuntos para atención al público (solo nombre y ubicación, si el tenant lo habilita). | BASE §90 | Extensión | O10 | Adoptado | La búsqueda pública no muestra titulares ni deudas. |
| RF-SOC-064 | **Libros/registros** de inhumaciones y de titulares exportables. | BASE §90 (CCyC registros) | Estándar | O10 | Adoptado | El registro de inhumaciones a una fecha lista todos los actos realizados en orden. |

### 5.6 Banco de sangre por convenio

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-065 | **Convenio** con red o banco habilitado: ámbito, vigencia, condiciones de atención, modalidad (financiado por la cooperativa, aporte del socio, gratuito). El banco de sangre es solo administrativo por convenio, sin datos clínicos (DEC-024). | BASE §91; DEC-024 | Núcleo | O10 | Adoptado | Un convenio sin vigencia o sin modalidad de financiamiento no se puede activar, y ni el convenio ni sus solicitudes tienen campos clínicos (DEC-024). |
| RF-SOC-066 | **Adhesión y cobertura** del titular, grupo y beneficiarios a la fecha solicitada. | BASE §91 | Núcleo | O10 | Adoptado | La consulta de cobertura de BEN-DEMO-001 a una fecha devuelve vigente/no vigente con motivo. |
| RF-SOC-067 | **Sin precio por unidad de sangre**: no existe concepto facturable por sangre o transfusión al paciente. | BASE §91, Ley 22990, criterio de aceptación 94 | Núcleo | O10 | Adoptado | El catálogo de M02 rechaza un concepto de tipo "unidad de sangre" vinculado a M18. |
| RF-SOC-068 | **Solicitud administrativa** de cobertura canalizada al prestador: referencia, estado, respuesta y seguimiento. | BASE §91, CU-ESP-SAN | Núcleo | O10 | Adoptado | SAN-DEM-001 pasa por `requested` → `inProgressWithProvider` → `answered`. |
| RF-SOC-069 | **Datos mínimos**: contactos y documentación estrictamente necesaria, con acceso restringido; sin diagnóstico, grupo sanguíneo ni indicaciones (DEC-024). | BASE §91, §97.1; DEC-024 | Núcleo | O10 | A validar (PA-SOC-03; el principio "sin datos clínicos" ya está fijado por DEC-024, queda abierto solo el detalle de los datos administrativos) | El formulario no tiene campos clínicos. |
| RF-SOC-070 | **Campañas y turnos de donación** como coordinación administrativa, sin decidir aptitud; edades de donante como filtro informativo. | BASE §91, V2 2527 | Estándar | O10 | Adoptado | El turno no registra resultado de aptitud. |
| RF-SOC-071 | **Costo del convenio** y obligaciones con la red registrados como gasto (M12/M15), separados de cualquier cobro al socio. | BASE §91 | Estándar | O10 | Adoptado | El costo de un convenio de sangre se registra como gasto del proveedor en M12 y M15 y no genera ningún cargo en la cuenta del socio. |
| RF-SOC-072 | **Indicadores**: solicitudes, tiempos de gestión, costos y cobertura, sin datos clínicos. | BASE §91 | Estándar | O10 | Adoptado | El tablero muestra por período cantidad de solicitudes, tiempo medio de gestión, costo y porcentaje con cobertura, y ninguna columna ni filtro expone datos clínicos. |
| RF-SOC-073 | El **bot** y las reglas de deuda no resuelven solicitudes de sangre (AGR-030). | BASE §91, AGR-030 | Núcleo | O10 | Adoptado | El bot solo informa cómo iniciar la solicitud y deriva a un operador. |
| RF-SOC-146 | **Aporte del socio impago** (convenio con `fundingMode = memberContribution`): la tarea de revisión que crea M08 (RN-MOR-144, T11 tipo `review`) llega a la bandeja del **Responsable de servicios sociales** con la cuenta, el convenio, la deuda y la antigüedad. Desde la tarea el responsable resuelve: mantener la cobertura, derivar a gestión de deuda (M08) o abrir la revisión del convenio (RF-SOC-065). **Nunca** se suspende la cobertura de forma automática ni se rechaza una solicitud de sangre por ese aporte (RN-SOC-055). | HUECO-SAN-02; BASE §91; RN-MOR-088, RN-MOR-144 | Núcleo | O10 | Adoptado | Un aporte impago con la antigüedad de PRM-MOR-205 genera una sola tarea por contrato y período y la consulta de cobertura de ese socio sigue devolviendo "vigente" (ESC-SOC-25). |

### 5.7 Salud: ambulancias, traslados sanitarios, profesionales e internaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-074 | **Viaje de ambulancia / traslado sanitario**: persona trasladada (asociado, beneficiario o no asociado), fecha del traslado y de la solicitud, origen, destino, nosocomio, empresa, móvil, chofer, profesionales, característica, kilómetros, importe. | CAT `AMBULANC` (`COD_PER`, `COD_BEN`, `APELLIDOS`, `SEXO`, `FEC_TRA`, `FEC_PRE`, `COD_ORI`, `COD_DES`, `CANT_KM`, `IMPORTE`, `COD_MED`, `CAUSA`), DFA M23, M25 | Estándar | O10 | A validar (PA-SOC-02) | Un viaje de un no asociado se factura según lista de no asociados. |
| RF-SOC-075 | **Viajes de varios tramos** vinculados a un viaje original. | RN-10 (`GetViaje` por `COD_AMB_ORIG`) | Estándar | O10 | Adoptado | El informe de un viaje multitramo suma kilómetros e importes de todos los tramos. |
| RF-SOC-076 | **Características** de viaje configurables (programado, alta, derivación, diálisis) y su efecto en tarifa. | CAT `AMBUCARACTE`, RN-10 (`GetCaracteristicas`) | Estándar | O10 | Adoptado | Una característica nueva con modificador de tarifa queda disponible en viajes nuevos y el importe del viaje aplica ese modificador; desactivarla no altera los viajes ya registrados. |
| RF-SOC-147 | **Traslado no médico** de personas (M02 §6.C.17): se registra como viaje de RF-SOC-074 con la característica precargada "no sanitario" (RF-SOC-076, `tripCharacteristics.code = NON_MEDICAL`), con origen, destino, persona trasladada, móvil y chofer, kilómetros e importe. Con esa característica el viaje no admite nosocomio, profesionales acompañantes (RF-SOC-077) ni motivo con texto libre (RF-SOC-078), y no se marca como dato sensible. No es un uso de vehículo de flota (RF-SOC-128 a RF-SOC-131), que sigue siendo el registro interno del vehículo. | HUECO-OTR-02; M02 §6.C.17 | Estándar | O10 | Adoptado | Un viaje con característica "no sanitario" que intenta cargar un profesional acompañante se rechaza, y lo ve un operador sin `soc.datosSensibles.ver`. |
| RF-SOC-077 | **Profesionales acompañantes** por viaje. | CAT `AMBUMED` | Estándar | O10 | Adoptado | Un viaje admite cero, uno o varios profesionales activos del catálogo (RF-SOC-007); un profesional inactivo no se puede agregar. |
| RF-SOC-078 | **Motivo del traslado** como categoría administrativa (no diagnóstico), con texto libre restringido. | CAT `AMBULANC.CAUSA`, BASE §24 | Núcleo | O10 | Adoptado | El texto libre solo lo ve `soc.datosSensibles.ver`. |
| RF-SOC-079 | **Informe general de traslados** con filtros: socio/no socio, persona, documento, sexo, localidades, nosocomio, empresa, chofer, profesional, móvil, característica, edad a la fecha del viaje, kilómetros. | RN-10 (`GetTraslado_General`), README Herramientas > Traslados > Informes | Estándar | O10 | Adoptado | El subtítulo del informe lista los filtros aplicados. |
| RF-SOC-080 | **Facturación del traslado**: cubierto por plan o facturable (km × tarifa o importe fijo) vía M04/M05. | CAT `AMBULANC.IMPORTE`, `MOVIL.PRE_VIAJESCORTOS` | Estándar | O10 | Adoptado | Un viaje de 120 km con tarifa ARS 900/km genera ARS 108.000 a facturar si no está cubierto. |
| RF-SOC-081 | **Autorización administrativa de internación o práctica** por convenio: prestador, fechas, número de autorización, cobertura y costo; sin datos clínicos. | DFA M25 (internaciones), BASE §24 | Extensión | O10 | A validar (PA-SOC-01) | Una autorización sin prestador, número de autorización o fecha de ingreso no se puede guardar, y el formulario no tiene campos de diagnóstico ni de indicaciones. |
| RF-SOC-082 | **No despachar emergencias**: el sistema registra traslados programados o derivados y deriva emergencias al prestador habilitado. | BASE §92 (no asumir urgencias), AGR-030 | Núcleo | O10 | Adoptado | Una solicitud marcada "emergencia" muestra el número del prestador y no se agenda. |
| RF-SOC-083 | **Viaje desde fallecimiento**: el trámite de fallecimiento puede crear un traslado vinculado. | INV `frmTitular_Fallecimiento.btnAddViaje` | Extensión | O10 | Adoptado | Desde el trámite de fallecimiento se crea un traslado con la persona fallecida precargada y vinculado al caso; el traslado aparece en el caso de sepelio y en la agenda de traslados. |
| RF-SOC-084 | **Agenda de traslados programados** con asignación de móvil y chofer y conflicto de disponibilidad. | BASE §92 (traslados: agenda, recursos, constancia) | Estándar | O10 | Adoptado | Un móvil asignado a dos viajes superpuestos genera advertencia. |

### 5.8 Planes de vivienda

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-085 | **Plan de vivienda** y **tipologías**: descripción, producto asociado, aportes mínimos antes/después de adjudicar y en entrega, máximo de aporte anual, fecha de nuevo valor, fecha de aporte teórico, uso de fecha de entrega. | CAT `PLANESVIV` (`COD_CATSER`, `DES_VIV`, `OBSERVA`, `MINIMO_AA`, `MINIMO_DA`, `COD_PRO`, `MINIMO_AE`, `MINIMO_DE`, `MAXIMO_APA`, `FECHA_NVO`, `FECHA_APORTE_TEORICO`, `UTILIZAR_FECHA_ENTREGA`), `CATE_SER_EXTRAS` (`VIV_*`), DFA M25 | Estándar | O10 | A validar (PA-SOC-15) | Habilitar un plan sin producto asociado o con la configuración de RN-SOC-041 incompleta se rechaza indicando el dato faltante; los porcentajes mínimos y el máximo anual quedan guardados por tipología. |
| RF-SOC-086 | **Precios por tipología** con vigencia; el precio vigente es el último con fecha ≤ fecha de cálculo. | CAT `PRECIOSVIV`, RN-01 §7 (`GetPreciosVivienda`) | Estándar | O10 | Adoptado | Con precios del 01-03 y 01-09, una cuota de julio usa el de marzo. |
| RF-SOC-087 | **Actualización masiva de precios** por plan/etapa con aprobación. | RN-08 (actualización masiva de precios de vivienda) | Estándar | O10 | A validar (PA-SOC-09) | Sin aprobación el nuevo precio queda `draft`. |
| RF-SOC-088 | **Inscripción** al plan (contrato tipo plan de vivienda en M02; HUECO-TRV-06, antes "en M01") con fecha, tipología y lote/terreno propio. | CAT `VIVIENDAS` (`FECINSC`, `TPROPIO`, `CODPLAN`), RN-06 §3.3 | Estándar | O10 | Adoptado | Inscribir una cuenta crea un contrato de tipo plan de vivienda en M02 con fecha de inscripción, tipología y lote o terreno propio; una inscripción sin tipología se rechaza. |
| RF-SOC-089 | Una cuenta **no puede tener dos planes** de vivienda. | RN-06 (`Validar_Transferncia`, `TIP_REG = 11`) | Núcleo | O10 | Adoptado | La segunda inscripción en la misma cuenta se rechaza. |
| RF-SOC-090 | **Adjudicación** con fecha, forma (sorteo, licitación, antigüedad, otra) y validación de fecha. | CAT `VIVIENDAS` (`FECADJU`, `FORMADJU`, `ADJUDICA`), RN-06 (`ValidarViviendaFecAdj`) | Estándar | O10 | Adoptado | La fecha de adjudicación no puede ser anterior a la inscripción. |
| RF-SOC-091 | **Aporte por cuota**: % = mínimo después de adjudicar si está adjudicada, si no mínimo antes; fallback a parámetros generales; tope = % a facturar − % facturado; importe = % × precio vigente. M18 informa los datos y M04 calcula. | RN-01 §7 (`MINIMO_DA`/`MINIMO_AA`, V2 635/634, `PORC_AFACTURAR − PORC_FACTURADO`, subtipo 27), V2 636 | Estándar | O10 | Adoptado | Con precio ARS 40.000.000 y aporte 1 %, la cuota es ARS 400.000; nunca supera el 100 % acumulado. |
| RF-SOC-092 | **Aportes superiores al máximo** solo con configuración. | V2 2569 (`Validar_Guardar`) | Estándar | O10 | Adoptado | Con PRM-SOC-024 = false, un adelanto que supera el máximo anual se rechaza. |
| RF-SOC-093 | **Facturación eventual** de aportes con mínimo y concepto configurables. | V2 634, V2 638 | Extensión | O10 | Adoptado | Con la facturación eventual habilitada, un aporte eventual menor al mínimo configurado se rechaza y uno válido genera una entrada a facturar con el concepto configurado. |
| RF-SOC-094 | **Comprobante exclusivo** para cuotas de vivienda: no se mezcla con otros productos. | V2 639, RN-06 (`ValidarComprobanteNoVivienda`) | Estándar | O10 | A validar (PA-SOC-13) | Un comprobante de vivienda con un producto ajeno se rechaza. |
| RF-SOC-095 | **Cobranza** de cuotas de vivienda con permiso específico. | RN-05 (`CobranzaCuotaVivienda`), INV `frmCobranza_Vivienda`, `frmCobranza.FacturarCuotaVivienda` | Estándar | O10 | Adoptado | Un cajero sin `soc.vivienda.gestionarCobranza` no ve la opción. (antes `soc.vivienda.cobranza`) |
| RF-SOC-096 | **Anulación** de una cuota descuenta el % facturado. | RN-02 (anulación de vivienda), V2 639 | Núcleo | O10 | Adoptado | Tras anular la cuota de 1 %, el % facturado vuelve al valor previo. |
| RF-SOC-097 | **Etapas y actividades** de construcción con orden, horas y precio hora; reordenamiento; costo de actividad. | CAT `VIV_ETAPA`, `VIV_ACTIVIDAD` (`CAN_HORA`, `PRE_HORA`, `ORDEN`), INV `frmViviendaActividad`, `clsViviendas` (`ActualizarOrden_*`, `ActualizarCostoActividad`, `PreSave_Actividad`, `Get_NextOrden*`) | Estándar | O10 | Adoptado | Reordenar las actividades de una etapa deja un orden correlativo sin repetidos, y el costo de cada actividad es igual a horas por precio hora. |
| RF-SOC-098 | **Composición de materiales** por actividad (tipología) y reparto en la vivienda. | CAT `VIV_MATACT`, `clsViviendas.RepartirMaterialesActividades`, `ComposicionTipologia` | Estándar | O10 | Adoptado | Al asignar una tipología a una vivienda, los materiales de cada actividad se reparten según la composición de la tipología y el total por material es igual a la suma de las actividades. |
| RF-SOC-099 | **Progreso** de actividades por vivienda: período, horas, porcentaje, proveedor, materiales consumidos, factura del proveedor y certificado. | CAT `VIV_PROGRESO` (`FECHA_DESDE`, `FECHA_HASTA`, `HORAS`, `PORCENT`, `COD_PROV`, `ID_IVACOM`, `ID_CERT`), `VIV_PROGMAT`, `clsViviendas.Save_Progreso`, `Delete_Progreso` | Estándar | O10 | Adoptado | El porcentaje acumulado de una actividad no supera 100. |
| RF-SOC-100 | **Materiales asignados, reservados, liberados y utilizados** por vivienda contra stock (M13). | CAT `VIV_MAT`, `clsViviendas` (`Get_MaterialesAsignados/Cantidades/Liberados/Reservados`, `LiberarProductosVivienda`) | Estándar | O10 | Adoptado | Liberar material devuelve la reserva en M13. |
| RF-SOC-101 | **Retiro de materiales** con vale (comprobante configurable), etapa, depósito y responsable; devolución y reasignación entre viviendas. | CAT `VIV_RETM`, `VIV_RET_IT`, V2 755, V2 2670, `clsViviendas` (`RegistrarRetMaterialViv`, `EliminarRetMaterialVivi`, `CrearItemRetMat_Movimiento`, `Registrar_ReasignacionMovimientoMaterial`, `LiberarProductosViviendaRetirados`), RN-08 (operación Vivienda) | Estándar | O10 | Adoptado | El vale genera un movimiento de stock M13 con operación "vivienda" y costo imputado a la obra por defecto. |
| RF-SOC-102 | **Rubro de proveedor y de productos** de vivienda: facturas de proveedores del rubro vivienda exigen productos del rubro de construcción. | V2 2502, V2 2503, RN-08 | Estándar | O10 | Adoptado | M12 rechaza una factura de proveedor de vivienda con productos de otro rubro. |
| RF-SOC-103 | **Certificados de obra**: crear, guardar, liquidar, cancelar, eliminar (solo borrador), imprimir; certificado de mano de obra; liquidación al constructor con concepto configurable. | INV `frmConstruccionVivienda`, `clsViviendas.GetCertificado(s)`, `Save_Comprobante`, V2 2276 | Estándar | O10 | Adoptado | Un certificado liquidado genera la obligación al proveedor en M12/M14. |
| RF-SOC-104 | **Resumen y estado de construcción**: progreso esperado vs real, desviación, materiales utilizados. | `clsViviendas` (`GetResumenConstruccion`, `Get_PorcentajeActividad/Esperado`, `Get_InfoProgresoConstruccion`, `GetProgresoCargaMateriales`), `clsInformes_Vivienda` (`ResumenConstruccion`, `Desviacion`, `MaterialesUtilizados`, `Materiales`) | Estándar | O10 | Adoptado | El resumen de construcción muestra por actividad el porcentaje esperado a la fecha, el real (RF-SOC-099) y la desviación entre ambos, y los materiales utilizados coinciden con los retiros registrados (RF-SOC-101). |
| RF-SOC-105 | **Entrega** de la vivienda con comprobante configurable, fechas de inicio y fin de construcción y entrega parcial. | CAT `VIVIENDAS` (`ENTREGAP`, `ENTREGA`, `INICONST`, `FINCONST`), V2 2628 | Estándar | O10 | Adoptado | Registrar la entrega emite el comprobante configurado y guarda las fechas de inicio y fin de construcción; una entrega parcial deja la vivienda en `partiallyDelivered` hasta registrar la entrega final. |
| RF-SOC-106 | **Cambio de plan/tipología** con texto de plantilla, informe y recálculo de aportes. | V2 419, INV `frmConsultaCambioPlanVivienda`, `abm_Socios.ImprimirConsultaCambioPlanVivienda`, `clsViviendas.Get_TipologiasParaCambio`, `clsInformes_Vivienda.Get_InformeCambioPlan` | Estándar | O10 | Adoptado | El informe muestra aporte facturado, aporte en la nueva tipología y diferencia. |
| RF-SOC-107 | **Transferencia** de la vivienda, de sus cuotas y de la construcción a otra cuenta, con texto de plantilla y caja abierta si se transfieren cuotas. | RN-06 §7, `clsViviendas` (`Transferir_Vivienda`, `Transferir_CuotasVivienda`, `Transferir_ConstruccionVivienda`, `Validar_Transferncia`), V2 417 | Estándar | O10 | Adoptado | Transferir cuotas sin caja abierta se rechaza. |
| RF-SOC-108 | **Rescisión / baja del plan** solo de planes conectados: comisión (% y concepto), concepto por diferencia, texto de plantilla, comprobante, opción de rescisión. | `clsViviendas` (`Baja_Plan`, `Validar_BajaPlan`), INV `frmBajaVivienda` (`grpChkRescision`), V2 413, 414, 415, 418, 3137 | Estándar | O10 | Adoptado | Con aportes de ARS 4.000.000 y comisión 10 %, la rescisión calcula ARS 400.000 de comisión y el saldo a devolver o compensar. |
| RF-SOC-109 | Los planes de vivienda **no se reconectan** como un servicio de red. | RN-07 (no reconexión de `TIP_REG = 11`) | Núcleo | O10 | Adoptado | La acción de reconexión no se ofrece para un contrato de plan de vivienda y la API la rechaza con error de regla (RN-SOC-047). |
| RF-SOC-110 | **Informes de vivienda**: aporte teórico, estado de aportes, estado del plan (completo y simple), composición de tipología, desviación, materiales, distritos, cambio de plan. | `clsInformes_Vivienda` (`Get_AporteTeorico`, `Get_Informe_AporteTeorico`, `EstadoAportes`, `EstadoPlan`, `EstadoPlanSimple`, `ComposicionTipologia`, `Get_Distritos`, `Get_InfoPlan`, `Add_ParametrosVivienda`), INV `frmInformesVivienda`, `FiltrosVivienda`, `InfoMaterialVivienda` | Estándar | O10 | Adoptado | Cada informe de vivienda se genera con filtros de plan, tipología y distrito, y el aporte teórico de un plan coincide con el cálculo de RF-SOC-091 para las mismas fechas. |
| RF-SOC-111 | **Mora del plan** configurable (meses adeudados para fondo fiduciario). | V2 637 | Extensión | O10 | A validar (PA-SOC-08) | Con PRM-SOC-030 = 3 en el plan, una vivienda con 3 cuotas adeudadas queda marcada para el fondo fiduciario y una con 2 no; sin valor en el parámetro no se marca ninguna (PA-SOC-08). |
| RF-SOC-112 | **Datos del plan** visibles en ficha y PWA: tipología, % aportado, cuotas, estado de construcción. | INV `Datos_Vivienda`, `clsViviendas.Get_InfoPlan`, `getAporteFacturado` | Estándar | O10 | Adoptado | La ficha y la PWA muestran tipología, porcentaje aportado, cuotas facturadas y estado de construcción, y el porcentaje aportado coincide con el aporte facturado del plan. |

### 5.9 Otros servicios

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-113 | **Banco ortopédico**: elementos identificados (código, tipo, estado), préstamo con plazo, devolución, limpieza/mantenimiento, garantía o depósito; no es venta. El depósito se registra como garantía de M08 (`guarantees`, RF-MOR-179): M18 guarda solo la referencia (`orthopedicLoans.deposit.guaranteeRef`); su cobro es pasivo y nunca ingreso (RN-CON-123 de M15) y su aplicación o devolución en la baja del préstamo la liquida M08 (crédito a la cuenta del socio por defecto). La entrada a facturar del depósito lleva `itemClass = guaranteeDeposit` (RN-SOC-056). | BASE §92; HUECO-OTR-04 | Extensión | O10 | Adoptado | Un elemento en mantenimiento no se presta; la devolución del elemento en buen estado dispara la devolución del depósito por M08 sin asiento de ingreso. |
| RF-SOC-114 | **Dispenser de agua**: servicio configurable, límite diario de litros, litros por atención, días para cálculo de deuda, registro de retiros y excedente mensual. | V2 2581, 2582, 2583, 2584 (`clsDispenser`) | Extensión | O10 | Adoptado | Un retiro que supera el límite diario se rechaza. |
| RF-SOC-115 | **Registración de vehículo eléctrico** como tipo de registración de un contrato (dato del vehículo vinculado a la carga), guardada en `contractRegistrations` de M18 con `type = electricVehicle` (RF-SOC-148; HUECO-OTR-05). | RN-06 §3.3, V2 75 | Extensión | O10 | Adoptado | Una registración de tipo `electricVehicle` sin dominio no se puede guardar y, una vez guardada, queda en `contractRegistrations` vinculada al contrato (criterio de RF-SOC-148). |
| RF-SOC-116 | **Reemplazado por RF-SOC-148** (HUECO-OTR-05). Texto original: "**Dispositivos y adherentes** (tipo de registración combinado) soportado por adherentes + dispositivos de M01." | RN-06 §3.3 | Extensión | O10 | Reemplazado por RF-SOC-148 (HUECO-OTR-05) | No aplica: requisito reemplazado; se verifica con el criterio de RF-SOC-148. |
| RF-SOC-148 | **Registraciones del contrato**: M18 es dueño de la entidad `contractRegistrations` (§7.5), que registra sobre un contrato de M02 los objetos que el servicio necesita identificar: vehículo eléctrico (dominio, marca, modelo, potencia de carga), equipo o dispositivo (tipo, marca, modelo, número de serie) u otro tipo configurable, con vigencia y estado. El tipo combinado "dispositivos y adherentes" se compone con `serviceDependents` del mismo contrato; no depende de M01, que no define dispositivos registrables. El tipo de registración que admite cada servicio lo declara la ficha de M02 en `tenantServices.registrations`; M18 valida cada alta contra esa lista del servicio del contrato. | HUECO-OTR-05; RN-06 §3.3 | Extensión | O10 | Adoptado | Un contrato cuyo servicio solo admite `electricVehicle` rechaza una registración de tipo `device`; dar de baja una registración conserva su historia con `endDate`. |
| RF-SOC-117 | **Extensibilidad**: nuevos servicios sociales se configuran como tipo + plan + formulario de solicitud sin desarrollo cuando encajan en el modelo de solicitud de prestación. | BASE §92, ESP-001 | Estándar | O10 | Adoptado | Un servicio social nuevo configurado como tipo, plan y formulario de solicitud admite solicitudes y verificación de cobertura sin cambios de código. |

### 5.10 Flota, combustibles, viajes, rendiciones y GPS

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-118 | **Vehículos**: descripción, dominio, tipo, propio/contratado, proveedor, kilometraje inicial, rendimiento, capacidad de carga, costo por km, precio de viajes cortos, identificador AVL, bien de uso vinculado (M13). | CAT `MOVIL` (`DES_MOV`, `DOMINIO`, `NOM_AVL`, `KM_INICIAL`, `RENDIMIENTO`, `KG`, `COSTO`, `PROPIO`, `COD_PROV`, `TIPO_VEHICULO`, `PRE_VIAJESCORTOS`), INV `abm_Movil` (`chkVehiculo`), MER-015 | Estándar | O8 | Adoptado | Un dominio no se repite en el tenant. |
| RF-SOC-119 | **Choferes** vinculados a empleado (M16) o externo, con licencia y vencimiento. Cada chofer es un rol de una persona de M01 (DEC-097): `personId` obligatorio, alta asistida de M01 con control de duplicados (RF-PER-174); nombre, documento y contactos se leen de la persona; la ficha guarda código, empleado (si lo es), licencia y estado. | CAT `CHOFERES`, MER-015; DEC-097 | Estándar | O8 | Adoptado | Un chofer con licencia vencida no puede asignarse. Un empleado que se da de alta como chofer reutiliza la persona de su legajo; no se guarda un chofer sin `personId`. |
| RF-SOC-120 | **Asignación de conductor** a vehículo con vigencia. | MER-015 | Estándar | O10 | Adoptado | Un viaje del vehículo propone el conductor con asignación vigente a la fecha del viaje; una asignación vencida no se propone. |
| RF-SOC-121 | **Documentación y vencimientos** del vehículo (seguro, VTV/ITV, habilitación sanitaria de ambulancia, patente) con alertas. | MER-015 | Estándar | O10 | Adoptado | Un vehículo con seguro vencido queda "no apto" y no se asigna. |
| RF-SOC-122 | **Mantenimiento** preventivo (por km o tiempo) y correctivo, con proveedor, costo y orden de compra (M12). | MER-015 | Estándar | O10 | Adoptado | Al superar el km de service se genera alerta. |
| RF-SOC-123 | **Uso por orden de trabajo** (M10) y por viaje, con kilómetros y horas; costo imputable a la OT o al centro de costos. | MER-015 | Estándar | O10 | Adoptado | El costo de uso = km × costo/km del vehículo se publica a M15 con la OT. |
| RF-SOC-124 | **Combustibles**: catálogo con alícuota de IVA y su ajuste. | CAT `COMBUSTIBLES`, `clsCombustible.Modificar_ALI_IVA_CF`, INV `abm_Combustible` | Estándar | O10 | Adoptado | Cambiar la alícuota de IVA de un combustible aplica a las cargas posteriores al cambio y no modifica las cargas ya registradas. |
| RF-SOC-125 | **Cargas de combustible** por móvil con litros, kilómetros y factura de compra de origen; carga manual y desde factura; anulación de la factura libera las cargas. | CAT `IVACOM_COMBUSTIBLES` (`COD_MOV`, `ID_COMBUST`, `LTS`, `KM`), `clsCombustible` (`CargarCombustible`, `CargarIvaComCombustible`, `Eliminar`), RN-08 | Estándar | O10 | Adoptado | Anular la factura en M12 anula las cargas vinculadas. |
| RF-SOC-126 | **Rendimiento real** (km/l) vs teórico por vehículo y alerta de desvío. | CAT `MOVIL.RENDIMIENTO`, `IVACOM_COMBUSTIBLES.KM` | Estándar | O10 | Adoptado | Con 500 km y 60 l, el rendimiento es 8,33 km/l. |
| RF-SOC-127 | **Viajes** generales (no sanitarios): solicitud, origen/destino, agenda, recursos, constancia. | BASE §92 (traslados), DFA M23 (Viajes) | Estándar | O10 | Adoptado | Un viaje general sin origen, destino o fecha no se agenda, y al completarlo se emite la constancia con los recursos asignados. |
| RF-SOC-128 | **Rendición de viaje**: fecha, kilómetros reales, flete real, tipo de flete, peajes, viáticos, ítems de combustible (puesto, comprobante, litros, precio por litro, cargado en viaje). Una sola rendición por viaje en `tripSettlements`; la rendición de una venta con flete de M11 se registra con `source.kind = salesDocument` (CTR-DAT-53). | CAT `COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS`, INV `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`, `clsComprobanteRendicion` (`crearDetalle`, `EliminarItemsDetalle`, `GetDatosInformeRendicion`), README "Rendiciones de Viajes" | Estándar | O10 | A validar (PA-SOC-12) | El total de la rendición = flete + peajes + viáticos + Σ litros × precio. |
| RF-SOC-129 | **Cálculo de kilómetros** estimados de la rendición y comparación con kilómetros reales y GPS. | INV `abm_ComprobanteRendicion.btnCalcularKm` | Estándar | O10 | Adoptado | Un desvío mayor al umbral marca la rendición para revisión. |
| RF-SOC-130 | **Estados de la rendición** con aprobación. | INV `Estado_AbmRendicion` | Estándar | O10 | Adoptado | Una rendición sigue `draft` → `submitted` → `approved` → `posted` o `submitted` → `rejected` → `draft` (§8); quien la cargó no puede aprobarla y una rendición aprobada no se edita. |
| RF-SOC-131 | Vincular la rendición a la **venta con flete** (M11), al viaje o a la OT. | INV `abm_ComprobanteRendicion` (remito), CAT `COMP_VEN_RENDICION.ID_COMPV` | Estándar | O10 | A validar (PA-SOC-12) | Una rendición queda vinculada a un único origen (`source.kind`: venta con flete de M11, viaje u orden de trabajo) y desde ese origen se puede abrir la rendición. |
| RF-SOC-132 | **Dispositivos GPS/AVL** por vehículo con proveedor y adaptador. | RN-10 (AVL Discar modo 5), CAT `MOVIL.NOM_AVL` | Extensión | O10 | A validar (PA-SOC-07) | Un vehículo tiene a lo sumo un dispositivo GPS activo, y las posiciones de una unidad externa sin vehículo asociado se rechazan y quedan registradas como error de ingestión. |
| RF-SOC-133 | **Posiciones GPS**: unidad, fecha y hora, estado, evento, latitud, longitud; ingestión por lote o streaming; retención configurable. | CAT `AVL_REG` (`COD_MOV`, `UNIT`, `FECHA`, `IDSTATUS`, `DSTATUS`, `EVENTO`, `LATITUD`, `LONGITUD`) | Extensión | O10 | Adoptado | Posiciones duplicadas (misma unidad y hora) se descartan. |
| RF-SOC-134 | **Recorridos y kilometraje** derivados de GPS por día, viaje y OT. | MER-015 | Extensión | O10 | Adoptado | El kilometraje diario derivado de GPS de un vehículo es la suma de las distancias entre posiciones consecutivas del día, y el de un viaje u orden de trabajo usa solo las posiciones dentro de su franja horaria. |
| RF-SOC-135 | La ubicación del móvil **no se muestra en vivo** al asociado ni reemplaza el estado "En camino" de M10. | MER-015, BASE §73 | Núcleo | O10 | Adoptado | La PWA del socio no tiene mapa de móviles. |
| RF-SOC-136 | **Novedades para sueldos** desde flota (horas de chofer, viáticos, guardias). | BASE §104.3 (SUE-003) | Estándar | O10 | Adoptado | Una rendición aprobada con viáticos genera novedad para M16. |
| RF-SOC-137 | **PWA de campo** del chofer: viajes asignados, registro de km inicial/final, carga de combustible con foto del ticket, checklist del vehículo. | MER-015, CNX | Estándar | O10 | Adoptado | Funciona sin conexión y sincroniza. |
| RF-SOC-138 | **Costos de flota** por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). | MER-015 | Estándar | O10 | Adoptado | El costo de flota de un vehículo en un período es igual a combustible más mantenimiento más seguros más la amortización informada por M13, y cada componente se puede abrir hasta sus comprobantes. |

### 5.11 Transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio |
|---|---|---|---|---|---|---|
| RF-SOC-139 | **Privacidad**: inventario de datos sensibles (salud, fallecimiento, ubicación), finalidad, conservación y acceso mínimo; exportaciones con permiso. | BASE §97.1, AGR-033 | Núcleo | O10 | Adoptado | Una exportación de traslados excluye el motivo salvo permiso. |
| RF-SOC-140 | **Auditoría** de altas, bajas, solicitudes, decisiones, actos de cementerio, certificados y rendiciones. | T02, AGR-010 | Núcleo | O4 | Adoptado | Cada alta, baja, decisión de solicitud, acto de cementerio, certificado y rendición deja un registro de auditoría con usuario, fecha y valores anteriores y nuevos, consultable en T02. |
| RF-SOC-141 | **Aislamiento por tenant**. | DEC-002 | Núcleo | O4 | Adoptado | Un usuario del tenant A que consulta el identificador de un adherente del tenant B recibe 404 y la respuesta no revela si el registro existe. |
| RF-SOC-142 | **Historia sin borrado** de grupos, ocupaciones y solicitudes (vigencias, AGR-003). | BASE §91, §90, AGR-003 | Núcleo | O4 | Adoptado | No existe operación de borrado físico de grupos, ocupaciones ni solicitudes; una baja deja el registro con fecha de fin y la consulta a una fecha anterior lo muestra vigente. |
| RF-SOC-143 | **Portal del asociado** (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. | BASE §25 | Estándar | O10 | Adoptado | El asociado ve en la PWA su grupo, coberturas, solicitudes, derechos de sepultura y plan de vivienda solo de las cuentas vinculadas y sin datos sensibles. |
| RF-SOC-144 | **IA**: el asistente puede resumir y guiar, nunca decide coberturas sanitarias, aptitud ni disposición de restos. | AGR-030 | Núcleo | O10 | Adoptado | Ninguna aprobación, rechazo o resolución de cobertura sanitaria, aptitud o disposición de restos se ejecuta desde el asistente; el asistente solo resume, guía y deriva a un operador. |
| RF-SOC-145 | **Importes** en `Decimal128` y ARS salvo configuración. | Convenciones | Núcleo | O4 | Adoptado | Todos los importes se guardan como `Decimal128` en ARS salvo moneda configurada, y la suma de 0,10 y 0,20 da exactamente 0,30. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-SOC-001 | Condición del adherente según requisitos del servicio (edad, ocupación, vínculo). | `Get_Cod_Adh_Condicion` devuelve "edad fuera de rango", "ocupación" o "vínculo" (RN-06 §10). | **Replicar** con motivo catalogado. | — | — |
| RN-SOC-002 | Adherentes con discapacidad quedan fuera de la baja por condición. | Se excluye `DISCA`. | **Replicar**. | — | — |
| RN-SOC-003 | Edad del adherente para tarifa al último día del período. | RN-01 §9 (`EDA_INI`–`EDA_FIN`). | **Replicar** como dato para M04. | — | — |
| RN-SOC-004 | Mayoría de edad. | `Get_Adherentes_MayoriaEdad` usa 21 años; aviso por mail (V2 3186/3187). | **Mejorar**: edad configurable por plan y vínculo; aviso T09. | PRM-SOC-009, PRM-SOC-010, PRM-SOC-011 | PA-SOC-04 |
| RN-SOC-005 | Adherente titular obligatorio. | V2 109 lo desactiva. | **Replicar**. | PRM-SOC-001 | — |
| RN-SOC-006 | Adherente repetido en el mismo servicio. | V2 2400 lo permite. | **Replicar** (default no). | PRM-SOC-002 | — |
| RN-SOC-007 | Adherente vinculado a otro titular. | V2 2521 consulta si dar de baja el vínculo anterior. | **Replicar**. | PRM-SOC-003 | — |
| RN-SOC-008 | Cascada por desconexión no técnica. | Desconectar el servicio da de baja adherentes y beneficiarios (RN-06 §4). | **Replicar** como suspensión con fecha; baja definitiva al dar de baja el contrato. | PRM-SOC-004 | — |
| RN-SOC-009 | Reconexión y adherentes. | V2 2401 consulta el alta al reconectar. | **Replicar**. | PRM-SOC-005 | — |
| RN-SOC-010 | Titular fallecido y reconexión. | No se reconecta salvo V2 2301 (RN-07). | **Replicar**. | PRM-SOC-006 | — |
| RN-SOC-011 | Fallecimiento de una persona. | `SetFechaFallecimiento` da de baja sus vínculos. | **Replicar** por evento `per.person.deceased`, con causa `death`. | — | — |
| RN-SOC-012 | Ocultar adherentes fallecidos en la ficha. | V2 3058. | **Replicar**. | PRM-SOC-007 | — |
| RN-SOC-013 | Transferencia de servicio y adherentes. | V2 2291: 1 dar de baja, 2 mantener, 3 eliminar. | **Mejorar**: opción 3 se reemplaza por baja con causa `transfer` (sin borrado). | PRM-SOC-012 | — |
| RN-SOC-014 | Control de deuda en adherentes. | V2 2545 (sin lectura relevada). | **Replicar** como advertencia configurable. | PRM-SOC-008 | Uso real en CoopOnline |
| RN-SOC-015 | Titular sin servicios que es adherente/beneficiario/garante. | V2 2571 informa al desconectar. | **Replicar** (M18 responde la consulta). | — (PRM-INS-013) | — |
| RN-SOC-016 | Alta automática de servicios con adherentes al conectar otro servicio. | `ALTASEAU` agrega sepelio al conectar energía (RN-06 §3.5). | **Replicar** como regla de M02 ejecutada por M18 para el contrato social. | — | — |
| RN-SOC-017 | Cantidad de adherentes y categoría. | Tipos 9/10: categoría por cantidad; error si no existe categoría para N adherentes (RN-01 §9). | **Replicar** en M04 con datos de M18; error explícito en la validación del plan. | — | — |
| RN-SOC-018 | Excedente de adherentes. | `COBRAEXCEDENTE`: los primeros N no se cobran. | **Replicar** en M04. | — | — |
| RN-SOC-019 | Recategorización automática por edad del titular. | `CAT_AUTO`. | **Replicar** (RF-SOC-016). | — | — |
| RN-SOC-020 | Cobertura a la fecha del evento. | No relevado. | **Adoptar** (BASE §24). | — | — |
| RN-SOC-021 | Carencia. | No relevado. | **Adoptar** por plan; desde el alta de cada adherente. | PRM-SOC-013 | PA-SOC-11 |
| RN-SOC-022 | La deuda no decide prestaciones sanitarias. | — | **Adoptar** (BASE §91, AGR-030). | — | — |
| RN-SOC-023 | Unidad de sepultura: un solo derecho vigente; ocupación permanente. | — | **Adoptar** (BASE §90). | — | — |
| RN-SOC-024 | Cambiar pagador no transfiere derecho ni elimina ocupación. | — | **Adoptar** (criterio de aceptación 93). | — | — |
| RN-SOC-025 | La mora de cementerio no cancela derechos ni corta otros servicios. | — | **Adoptar** (BASE §90). | — | — |
| RN-SOC-026 | Actos de cementerio requieren autorización y documentación. | — | **Adoptar**. | PRM-SOC-016 | Normativa municipal |
| RN-SOC-027 | Capacidad de la unidad. | — | **Adoptar**: inhumaciones ≤ capacidad de niveles; reducción libera nivel. | — | — |
| RN-SOC-028 | Sin precio por unidad de sangre. | — | **Adoptar** (Ley 22990, criterio 94). | — | — |
| RN-SOC-029 | Sin aptitud clínica de donantes; edades de donante informativas. | V2 2527 valida edades de donante en `abm_Personas`. | **Mejorar**: filtro informativo en campañas; la validación en M01 se elimina. | PRM-SOC-017 | — |
| RN-SOC-030 | Viaje multitramo. | `COD_AMB_ORIG`. | **Replicar**. | — | — |
| RN-SOC-031 | Edad del trasladado a la fecha del viaje. | `GetTraslado_General`. | **Replicar** en informes. | — | — |
| RN-SOC-032 | Precio vigente de vivienda. | Último `PRECIOSVIV` con fecha ≤ hoy. | **Mejorar**: ≤ fecha del período facturado. | — | — |
| RN-SOC-033 | % de aporte por cuota. | `MINIMO_DA` si adjudicada, `MINIMO_AA` si no; fallback V2 635/634; tope `PORC_AFACTURAR − PORC_FACTURADO`; ítem subtipo 27, cantidad %/100. | **Replicar** (cálculo en M04). | PRM-SOC-018, PRM-SOC-019 | — |
| RN-SOC-034 | Máximo de aporte anual. | V2 636 (sin lectura relevada), `MAXIMO_APA`. | **Replicar** por plan. | PRM-SOC-020 | — |
| RN-SOC-035 | Aporte superior al máximo. | V2 2569. | **Replicar**. | PRM-SOC-024 | — |
| RN-SOC-036 | Comprobante exclusivo de vivienda. | V2 639 y `ValidarComprobanteNoVivienda` (productos exclusivos). | **Replicar**. | PRM-SOC-021 | PA-SOC-13 |
| RN-SOC-037 | Un plan por cuenta. | `Validar_Transferncia` (`TIP_REG = 11`). | **Replicar**. | — | — |
| RN-SOC-038 | Transferencia de cuotas exige caja abierta. | `Validar_Transferncia`. | **Replicar** como precondición de M07. | — | — |
| RN-SOC-039 | Baja solo de planes conectados. | `Validar_BajaPlan`. | **Replicar**. | — | — |
| RN-SOC-040 | Comisión y diferencia por rescisión. | V2 413/414/3137 en `Baja_Plan`. | **Replicar**. | PRM-SOC-025, PRM-SOC-026, PRM-SOC-027 | — |
| RN-SOC-041 | Validación de configuración de vivienda. | `Validar_Configuracion` exige 413, 414, 634, 635. | **Replicar** al habilitar el plan. | — | — |
| RN-SOC-042 | Anulación de cuota descuenta % facturado. | RN-02. | **Replicar** por evento `fac.invoice.annulled`. | — | — |
| RN-SOC-043 | Vales de vivienda y contabilización a obra por defecto. | V2 755, V2 2670 (`Stock_Vales`). | **Replicar** (M13/M15). | PRM-SOC-022, PRM-SOC-023 | — |
| RN-SOC-044 | Rubro de proveedor de vivienda exige rubro de productos de construcción. | V2 2502/2503 (`frmComprobantes_Handler.Validar`). | **Replicar** en M12 con parámetros de M18. | PRM-SOC-028, PRM-SOC-029 | — |
| RN-SOC-045 | Progreso no supera 100 %; materiales no superan asignados salvo autorización. | `validarPreMov`, `validarPreMov_VIVMAT`. | **Replicar**. | — | — |
| RN-SOC-046 | Fondo fiduciario por meses adeudados. | V2 637 (sin lectura relevada). | **A validar**. | PRM-SOC-030 | PA-SOC-08 |
| RN-SOC-047 | Planes de vivienda no se reconectan. | RN-07. | **Replicar**. | — | — |
| RN-SOC-048 | Carga de combustible desde factura; anulación libera. | RN-08 (`IVACOM_COMBUSTIBLES`). | **Replicar** por eventos de M12. | — | — |
| RN-SOC-049 | Posición GPS idempotente por unidad y hora. | AVL Discar (modo 5, proceso batch). | **Reemplazar** por adaptador T06 con deduplicación. | PRM-SOC-035 | — |
| RN-SOC-050 | Vehículo no apto (documentación vencida, mantenimiento vencido) no se asigna. | — | **Adoptar** (MER-015). | PRM-SOC-033 | — |
| RN-SOC-051 | Dispenser: límite diario y litros por atención; deuda a N días bloquea. | `clsDispenser.Get_Sersoc`, `Exedente_ConsumoMensual`. | **Replicar**. | PRM-SOC-036 a PRM-SOC-039 | — |
| RN-SOC-052 | Servicios candidatos no admiten contratos. | — | **Adoptar** (BASE §92). | — | — |
| RN-SOC-053 | Historia sin borrado. | `ADHSOC`/`BENSOC` con fechas; opción "eliminar" en V2 2291. | **Mejorar**: nunca borrar. | — | — |
| RN-SOC-054 | **Carencia de rehabilitación** (HUECO-SEP-01): cuando la cobertura de un contrato estuvo suspendida por mora (condición informada por M08, RN-MOR-143) y se regulariza, las prestaciones no urgentes solo se cubren para eventos ocurridos después de la fecha de rehabilitación más los días de PRM-SOC-052. La carencia de rehabilitación no reinicia la carencia original del plan (PRM-SOC-013) ni la antigüedad del adherente, y no aplica a urgencias ni prestaciones sanitarias (RN-SOC-022). Un evento ocurrido durante la suspensión o dentro de la carencia de rehabilitación deja la solicitud en `inReview` con el motivo; el responsable puede excepcionarla con `soc.solicitudes.excepcionar`. | No existe en ProCoop. | **Nuevo**. | PRM-SOC-052 | Sí: el reglamento del servicio social del tenant debe fijar la carencia. |
| RN-SOC-055 | **Aporte del socio impago en banco de sangre** (HUECO-SAN-02): un aporte impago de un convenio con `fundingMode = memberContribution` solo genera la tarea de revisión de RN-MOR-144 (RF-SOC-146); nunca suspende la cobertura, nunca rechaza ni demora una solicitud de sangre y no pasa por RN-SOC-054. El resultado de la tarea se registra en el convenio (`providerAgreements`) cuando se decide revisarlo. | No existe en ProCoop. | **Nuevo**; refuerza RN-SOC-022 y RN-MOR-088. | — | — |
| RN-SOC-056 | **Clase de ítem facturable que origina M18** (RN-FAC-156, RF-FAC-176 de M05): cada entrada a facturar que M18 informa (API-SOC-006 `billing-inputs` o el evento que dispara el cargo) lleva `itemClass`: (1) depósito del préstamo ortopédico (RF-SOC-113) → `guaranteeDeposit` (pasivo reintegrable; garantía de M08 RF-MOR-179; RN-CON-123); (2) aporte del asociado al fondo de subsidio por fallecimiento cuando el plan se financia con fondo propio (RF-SOC-044) → `subsidyFundContribution` (M15 lo acredita al fondo `socialSubsidyFund`, RN-CON-122); (3) adquisición del derecho de sepultura (contado o cuota n/N) → `burialRightAcquisition` y mantenimiento periódico → `burialRightMaintenance` (RF-SOC-055 y EVT-SOC-05; RN-CON-124). El resto de las entradas (cuotas de servicio, adherentes, vivienda, traslados, actos) van con `standard`. M18 no decide el tratamiento fiscal ni contable: solo informa la clase. | No existe en ProCoop (el depósito, el aporte y el derecho se facturan como conceptos comunes). | **Nuevo** (pendiente de G2 fase 2; HUECO-OTR-04, HUECO-SEP-03, HUECO-CEM-04). | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Todas las colecciones llevan `TenantId` (primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` y, cuando aplica, `validFrom`/`validTo`, `recordedAt`, `deletedAt`. Ocupaciones, actos de cementerio, solicitudes, certificados y rendiciones **nunca se borran**. Importes `DECIMAL(18,4)`. Los campos marcados **(S)** son sensibles: cifrado en reposo a nivel de campo y lectura solo con `soc.datosSensibles.ver`.

> **Corrección 05-11-2026 (tablas de campos):** las colecciones que este §7 describía solo en texto corrido o en tablas resumen tienen ahora su tabla de campos (Campo, Tipo, Oblig., Descripción, Referencia), debajo de su descripción original, que se conserva. Tipos y obligatoriedad se deducen del texto del anexo y de T05 §7.7; donde no se pueden deducir figura `[VERIFICAR]`. La columna Referencia declara la colección destino y su anexo dueño. Cuando T05 usa otro nombre para el campo, la tabla usa el de T05 y anota "Antes `x`". Las tablas de campos que ya existían incorporan también la columna Referencia.

### 7.1 Grupos de cobertura

#### `serviceDependents` — adherentes

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier → M02 | Sí | Contrato del servicio (`ID_SERSOC`, `COD_SUM`, `COD_SER`). Dueño M02 (HUECO-TRV-06; antes → M01). | `serviceContracts` (M02) |
| `holderId` | uniqueidentifier → M01 `holders` | Sí | Titular del contrato (`COD_SOC`). Nombre canónico de T05 (CTR-DAT-67; antes `holderPersonId`); la persona del titular se obtiene del titular en M01. | `holders` (M01) |
| `personId` | uniqueidentifier → M01 | Sí | Adherente (`COD_PER`). | `persons` (M01) |
| `relationshipTypeId` | uniqueidentifier → M01 | Sí | Vínculo (`COD_VIN` → `VINCULOS`). | `enumerationItems` (T04) (vínculos, CTR-DAT-12; antes `[VERIFICAR]`) |
| `isHolder` | Bool | Sí | Adherente titular (`TITULAR`). | — |
| `coveragePlanId` | uniqueidentifier | Sí | Plan vigente. | `coveragePlans` (M18) |
| `categoryId` | uniqueidentifier → M02 | No | Categoría (recategorización). | `serviceCategories` (M02) |
| `assignedTariffId` | uniqueidentifier → M04 | No | Tarifa asignada (`COD_TAD`). | `tariffCategoryRates` (M04) (tarifa por categoría; antes `[VERIFICAR]`; PA-SOC-19) |
| `occupation` | Enum | No | `none`, `student`, `retired`, `employed`, `other` (filtros `TAR_ADHE`). | — |
| `disabilityCertified` | Bool **(S)** | No | Excluye bajas por edad (`DISCA`). | — |
| `startDate` / `endDate` | Date | Sí / No | `FEC_ALT` / `FEC_BAJ`. | — |
| `waitingPeriodEndsAt` | Date | No | Fin de carencia. | — |
| `status` | Enum | Sí | `pendingValidation`, `active`, `observed`, `suspended`, `ended`. | — |
| `endCause` | Enum | Cond. | `voluntary`, `age`, `condition`, `death`, `disconnection`, `transfer`, `contractEnded`, `duplicate`. | — |
| `printedAt` / `printMark` | Date / Bool | No | `FEC_IMP` / `MAR_IMP`. | — |
| `recoverable` | Bool | No | `RECUPERA`: restaurable al reconectar. | — |
| `requirements` | [{ `requirementId`, `documentId`, `expiresAt`, `status` }] | No | Requisitos documentales. | — |
| `legacy.codAdh` | Int | No | — | — |

Índices: `{tenantId, contractId, status}`; `{tenantId, personId, status}`; `{tenantId, contractId, personId}` único parcial (`status ≠ ended`) salvo PRM-SOC-002. Origen: `ADHSOC` (más 6 columnas no detalladas [VERIFICAR]).

#### `serviceBeneficiaries`

Campos: `contractId` (`ID_SERSOC`), `holderId` (CTR-DAT-67; antes `holderPersonId`), `personId`, `relationshipTypeId` (`COD_VIN`), `benefitType` (`subsidy`, `insurance`, `other`; el valor `socialTariff` se retira: la tarifa social no es un beneficiario, HUECO-SEP-02), `sharePct`, `startDate` (`FEC_ALT`), `endDate` (`FEC_BAJ`), `endCause` (enum de cierre propio de CoopApps: `death`, `request`, `contractEnded`, `other`; ProCoop no registra causa en `BENSOC`), `notes` (`OBSERVA`), `status` (`ACTIVO` → `active`/`ended`), `legacy.codBen`, `legacy.codCse` (código compuesto del servicio de ProCoop, solo trazabilidad; HUECO-SEP-02: antes se mapeaba `COD_CSE` como causa). Índices `{tenantId, contractId, status}`, `{tenantId, personId}`. Origen: `BENSOC`, destino único (CTR-SOC-03, RN-MIG-054 de T07).

Campos de `serviceBeneficiaries`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | `ID_SERSOC`. | `serviceContracts` (M02) |
| `holderId` | uniqueidentifier | [VERIFICAR] | CTR-DAT-67; antes `holderPersonId`. | `holders` (M01) |
| `personId` | uniqueidentifier | [VERIFICAR] | — | `persons` (M01) |
| `relationshipTypeId` | uniqueidentifier | [VERIFICAR] | `COD_VIN`. | `enumerationItems` (T04) (vínculos `VINCULOS`, CTR-DAT-12; antes "M01, colección [VERIFICAR]") |
| `benefitType` | Enum | [VERIFICAR] | `subsidy`, `insurance`, `other`; el valor `socialTariff` se retira: la tarifa social no es un beneficiario, HUECO-SEP-02. | — |
| `sharePct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `startDate` | Date | [VERIFICAR] | `FEC_ALT`. | — |
| `endDate` | Date | [VERIFICAR] | `FEC_BAJ`. | — |
| `endCause` | Enum | [VERIFICAR] | De cierre propio de CoopApps: `death`, `request`, `contractEnded`, `other`; ProCoop no registra causa en `BENSOC`. | — |
| `notes` | String | [VERIFICAR] | `OBSERVA`. | — |
| `status` | Enum | Sí | `ACTIVO` → `active`/`ended`. | — |
| `legacy.codBen` | String | No | — | — |
| `legacy.codCse` | String | No | Código compuesto del servicio de ProCoop, solo trazabilidad; HUECO-SEP-02: antes se mapeaba `COD_CSE` como causa. | — |

#### `dependentEvents`

Campos: `dependentId` o `beneficiaryId`, `type` (`added`, `validated`, `observed`, `categoryChanged`, `suspended`, `restored`, `ended`, `transferred`, `majorityReached`), `effectiveAt`, `recordedAt`, `actorUserId`, `cause`, `batchId`, `payload`. Índice `{tenantId, dependentId, effectiveAt}`.

Campos de `dependentEvents`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `dependentId` | uniqueidentifier | Sí | — | `serviceDependents` (M18) |
| `beneficiaryId` | uniqueidentifier | [VERIFICAR] | — | `serviceBeneficiaries` (M18) |
| `type` | Enum | [VERIFICAR] | `added`, `validated`, `observed`, `categoryChanged`, `suspended`, `restored`, `ended`, `transferred`, `majorityReached`. | — |
| `effectiveAt` | Date (fecha y hora) | Cond. | — | — |
| `recordedAt` | Date (fecha y hora) | Cond. | — | — |
| `actorUserId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `cause` | String | Cond. | [VERIFICAR] si es texto o catálogo. | — |
| `batchId` | uniqueidentifier | [VERIFICAR] | Lote de la operación masiva que generó el evento. | — (identificador del lote que agrupa eventos de esta colección; no es referencia; antes `[VERIFICAR]`) |
| `payload` | Object | [VERIFICAR] | — | — |

### 7.2 Planes, prestadores y convenios

#### `coveragePlans`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` / `categoryId` | uniqueidentifier → M02 | Sí | Servicio y categoría. | `tenantServices` (M02) / `serviceCategories` (M02) |
| `kind` | Enum | Sí | `burial`, `deathSubsidy`, `bloodBank`, `ambulance`, `healthAgreement`, `orthopedic`, `insurance`, `dispenser`, `electricVehicle`, `other`. | — |
| `benefits` | [{ `code`, `labelKey`, `included`, `limitPerPeriod`, `period`, `limitAmount` }] | Sí | Prestaciones. | — |
| `eligibility` | [{ `relationshipTypeId`, `minAge`, `maxAge`, `occupations`, `disabilityOverridesAge` }] | Sí | Reglas por vínculo. | — |
| `maxDependents` | Int | No | — | — |
| `majorityAge` | Int | No | Default PRM-SOC-009. | — |
| `waitingPeriodDays` | Int | No | Default PRM-SOC-013. | — |
| `territorialScope` | [uniqueidentifier] localidades/provincias | No | — | — |
| `exclusions` | [String] | No | — | — |
| `requirements` | [{ `code`, `labelKey`, `relationshipTypeIds`, `validityMonths` }] | No | `frmRequisito_Adherentes`. | — |
| `agreementIds` | [uniqueidentifier] | No | Convenios. | `agreements` (M08) |
| `regulationDocumentId` | uniqueidentifier | No | Reglamento. | `documents` (T11) |
| `validFrom` / `validTo` | Date | Sí | — | — |
| `status` | Enum | Sí | `draft`, `active`, `closedToNew`, `retired`. | — |

Índice `{tenantId, serviceId, validFrom}`.

#### `careProviders`

Campos: `type` (`funeralHome`, `bloodNetwork`, `healthFacility`, `ambulanceCompany`, `builder`, `insurer`, `other`), `name`, `supplierId` (M12), `habilitation` { `number`, `authority`, `expiresAt` }, `contacts`, `localityId`, `active`. Índice `{tenantId, type, active}`. Origen: nosocomios y empresas de `AMBULANC`.

Campos de `careProviders`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `type` | Enum | [VERIFICAR] | `funeralHome`, `bloodNetwork`, `healthFacility`, `ambulanceCompany`, `builder`, `insurer`, `other`. | — |
| `name` | String | Sí | — | — |
| `supplierId` | uniqueidentifier | Sí | M12. | `suppliers` (M12) |
| `habilitation` | Object | [VERIFICAR] | Subcampos: `number`, `authority`, `expiresAt`. | — |
| `contacts` | Object | [VERIFICAR] | — | — |
| `localityId` | uniqueidentifier | Sí | — | `localities` (T04) |
| `active` | Bool | [VERIFICAR] | — | — |

#### `providerAgreements`

Campos: `providerId`, `planIds`, `scope`, `conditions`, `fundingMode` (`cooperativeFunded`, `memberContribution`, `freeToMember`), `costModel` { `type`: `fixedMonthly`/`perCase`/`perCapita`, `amount` }, `validFrom`, `validTo`, `documentId`, `status`. Índice `{tenantId, providerId, validFrom}`.

Campos de `providerAgreements`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `providerId` | uniqueidentifier | Sí | — | `careProviders` (M18) |
| `documentRefId` | uniqueidentifier | [VERIFICAR] | Expediente documental en T11 (clave de T05; PA-SOC-19). | `documents` (T11) |
| `planIds` | [uniqueidentifier] | [VERIFICAR] | — | `servicePlans` (M02) |
| `scope` | Enum | [VERIFICAR] | — | — |
| `conditions` | Object | [VERIFICAR] | — | — |
| `fundingMode` | Enum | [VERIFICAR] | `cooperativeFunded`, `memberContribution`, `freeToMember`. | — |
| `costModel` | Object | [VERIFICAR] | Subcampos: `type`: `fixedMonthly`/`perCase`/`perCapita`, `amount`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `documentId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `status` | Enum | Sí | `draft`, `active`, `ended` (valores de §8.1.6, asumidos en PA-SOC-18; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |

#### `medicalSpecialties` y `medicalProfessionals`

`medicalSpecialties`: `code` (`COD_ESP`), `name` (`DES_ESP`). `medicalProfessionals`: `personId` (M01, obligatorio, DEC-097), `specialtyId` (`COD_ESP`), `licenseNumber`, `providerId`, `active`; el nombre (`DES_MED`) se lee de la persona de M01. *Reemplazado (10-11-2026): "`medicalProfessionals`: `personId` (M01, opcional), `name` (`DES_MED`), `specialtyId` (`COD_ESP`), `licenseNumber`, `providerId`, `active`."* Índices `{tenantId, code}` único; `{tenantId, specialtyId}`; `{tenantId, personId}` único en `medicalProfessionals` (una ficha por persona).

Campos de `medicalSpecialties`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `COD_ESP`. | — |
| `name` | String | Sí | `DES_ESP` . | — |

**`medicalProfessionals`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Persona del profesional; alta asistida de M01 con control de duplicados (DEC-097). Antes: "M01, opcional." | `persons` (M01) |
| `name` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.displayName` (M01); `DES_MED` solo alimenta la búsqueda o creación de la persona en la migración. Fila anterior: "`name` · String · Sí · `DES_MED`." | — |
| `specialtyId` | uniqueidentifier | Sí | `COD_ESP`. | `medicalSpecialties` (M18) |
| `licenseNumber` | String | [VERIFICAR] | — | — |
| `providerId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.3 Solicitudes y prestaciones

#### `benefitRequests`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | Serie por tipo. | — |
| `kind` | Enum | Sí | Igual a `coveragePlans.kind` más `transport`, `hospitalization`. | — |
| `contractId` | uniqueidentifier | Cond. | — | `serviceContracts` (M02) |
| `beneficiaryPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `requesterPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `eventDate` | Date | Sí | Fecha del evento. | — |
| `channel` | Enum | Sí | `desk`, `phone`, `pwa`, `bot`, `provider`. | — |
| `coverageCheck` | { `checkedAt`, `result`: `covered`/`notCovered`/`review`, `reasons` [Enum], `planId`, `agreementId` } | Sí | Verificación a la fecha del evento. | — |
| `providerId` | uniqueidentifier | No | — | `careProviders` (M18) |
| `providerReference` | String | No | Número de autorización o referencia. | — |
| `costs` | { `covered`, `memberCharge`, `providerCost` } DECIMAL(18,4) | No | — | — |
| `memberChargeBillingRef` / `providerInvoiceRef` | uniqueidentifier | No | M05 / M12. | `billableItems` (M05) [VERIFICAR] / `supplierInvoices` (M12) [VERIFICAR] |
| `status` | Enum | Sí | `requested`, `inReview`, `approved`, `rejected`, `inProgressWithProvider`, `answered`, `completed`, `cancelled`. | — |
| `decision` | { `by`, `at`, `reason`, `exceptionApprovalId` } | Cond. | — | — |
| `documents` | [uniqueidentifier] **(S)** | No | — | `documents` (T11) [VERIFICAR] |
| `sensitiveNotes` | String **(S)** | No | — | — |

Índices `{tenantId, kind, status, eventDate}`, `{tenantId, beneficiaryPersonId}`, `{tenantId, number}` único.

#### `burialServiceCases`

Campos: `requestId`, `deceasedPersonId`, `deathDate`, `place`, `providerId`, `services` [{ `code` (`wake`, `transfer`, `burial`, `cremation`, `other`), `covered`, `amount` }], `cemeteryActId`, `tripId`, `deathCertificateDocumentId` **(S)**, `status` (`open`, `coordinated`, `completed`, `cancelled`), `providerConformityAt`. Índice `{tenantId, deceasedPersonId}`.

Campos de `burialServiceCases`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `requestId` | uniqueidentifier | Sí | — | `benefitRequests` (M18) |
| `deceasedPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `deathDate` | Date | [VERIFICAR] | — | — |
| `place` | String | [VERIFICAR] | — | — |
| `providerId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) |
| `services` | [Object] | [VERIFICAR] | Lista; subcampos: `code` (`wake`, `transfer`, `burial`, `cremation`, `other`), `covered`, `amount`. | — |
| `cemeteryActId` | uniqueidentifier | [VERIFICAR] | — | `cemeteryActs` (M18) |
| `tripId` | uniqueidentifier | [VERIFICAR] | — | `transportTrips` (M18) |
| `deathCertificateDocumentId` | uniqueidentifier | [VERIFICAR] | **(S)**. | `storedFiles` (T01) |
| `status` | Enum | Sí | `open`, `coordinated`, `completed`, `cancelled`. | — |
| `providerConformityAt` | Date (fecha y hora) | Cond. | — | — |

#### `deathSubsidyCases`

Campos: `requestId`, `deceasedPersonId`, `regulationVersion`, `fund` (`ownFund`, `thirdPartyInsurer`), `amount`, `beneficiaries` [{ `personId`, `sharePct`, `amount`, `paymentOrderRef`, `status` }], `claimDeadline`, `approvalId`, `status` (`draft`, `pendingApproval`, `approved`, `paid`, `rejected`, `expired`). Índice `{tenantId, status}`.

Campos de `deathSubsidyCases`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `requestId` | uniqueidentifier | Sí | — | `benefitRequests` (M18) |
| `deceasedPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `regulationVersion` | String | [VERIFICAR] | — | — |
| `fund` | Enum | [VERIFICAR] | `ownFund`, `thirdPartyInsurer`. | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `beneficiaries` | [Object] | [VERIFICAR] | Lista; subcampos: `personId`, `sharePct`, `amount`, `paymentOrderRef`, `status`. | — |
| `claimDeadline` | Date | [VERIFICAR] | — | — |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |
| `status` | Enum | Sí | `draft`, `pendingApproval`, `approved`, `paid`, `rejected`, `expired`. | — |

#### `bloodCoverageRequests`

Campos: `requestId`, `agreementId`, `facilityId`, `providerReference`, `requestedUnitsNote` (texto administrativo, sin datos clínicos), `responseAt`, `responseSummary`, `status` (`requested`, `inProgressWithProvider`, `answered`, `closed`). Índice `{tenantId, status}`. Sin campos de grupo sanguíneo, diagnóstico ni compatibilidad (RN-SOC-028, PA-SOC-03).

Campos de `bloodCoverageRequests`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `requestId` | uniqueidentifier | Sí | — | `benefitRequests` (M18) |
| `agreementId` | uniqueidentifier | Sí | — | `providerAgreements` (M18) |
| `facilityId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) [VERIFICAR] |
| `providerReference` | String | [VERIFICAR] | — | — |
| `requestedUnitsNote` | String | [VERIFICAR] | Texto administrativo, sin datos clínicos. | — |
| `responseAt` | Date (fecha y hora) | Cond. | — | — |
| `responseSummary` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `requested`, `inProgressWithProvider`, `answered`, `closed`. | — |

#### `donationCampaigns` y `donationAppointments`

`donationCampaigns`: `name`, `agreementId`, `dates`, `place`, `capacity`, `status`. `donationAppointments`: `campaignId`, `personId`, `slotAt`, `status` (`booked`, `attended`, `noShow`, `cancelled`). No registran aptitud ni resultados.

Campos de `donationCampaigns`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `agreementId` | uniqueidentifier | Sí | — | `providerAgreements` (M18) |
| `dates` | Date | [VERIFICAR] | — | — |
| `place` | String | [VERIFICAR] | — | — |
| `capacity` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `planned`, `open`, `closed`, `cancelled` (valores de §8.1.7, asumidos en PA-SOC-18; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |

**`donationAppointments`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `campaignId` | uniqueidentifier | Sí | — | `donationCampaigns` (M18) |
| `personId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `slotAt` | Date (fecha y hora) | Cond. | — | — |
| `status` | Enum | Sí | `booked`, `attended`, `noShow`, `cancelled`. | — |

#### `healthAuthorizations`

Campos: `requestId`, `type` (`hospitalization`, `practice`, `other`), `providerId`, `admissionDate`, `dischargeDate`, `authorizationNumber`, `coveredDays`, `cost`, `status` (`requested`, `authorized`, `rejected`, `closed`). Sin diagnóstico.

Campos de `healthAuthorizations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `requestId` | uniqueidentifier | Sí | — | `benefitRequests` (M18) |
| `type` | Enum | [VERIFICAR] | `hospitalization`, `practice`, `other`. | — |
| `providerId` | uniqueidentifier | Sí | — | `careProviders` (M18) |
| `admissionDate` | Date | [VERIFICAR] | — | — |
| `dischargeDate` | Date | [VERIFICAR] | — | — |
| `authorizationNumber` | String | [VERIFICAR] | — | — |
| `coveredDays` | Int | [VERIFICAR] | — | — |
| `cost` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `requested`, `authorized`, `rejected`, `closed`. | — |

#### `transportTrips` y `tripLegs`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | `COD_AMB`. | — |
| `kind` | Enum | Sí | `sanitary`, `general`, `freight`. | — |
| `requestId` | uniqueidentifier | No | Solicitud de prestación. | `benefitRequests` (M18) |
| `passengerPersonId` / `beneficiaryId` | uniqueidentifier | Cond. | `COD_PER` / `COD_BEN`. | `persons` (M01) / `serviceBeneficiaries` (M18) |
| `passengerSnapshot` | { `name`, `sex`, `ageAtTrip`, `isMember` } | Sí | `APELLIDOS`, `SEXO`. | — |
| `requestedAt` / `tripDate` | Date | Sí | `FEC_PRE` / `FEC_TRA`. | — |
| `origin` / `destination` | { `localityId`, `facilityId`, `address` } | Sí | `COD_ORI` / `COD_DES`, nosocomio. | — |
| `companyProviderId` | uniqueidentifier | No | Empresa. | `careProviders` (M18) [VERIFICAR] |
| `vehicleId` / `driverId` | uniqueidentifier | No | Móvil / chofer. | `fleetVehicles` (M18) / `drivers` (M18) |
| `professionalIds` | [uniqueidentifier] | No | `AMBUMED`. | `medicalProfessionals` (M18) |
| `characteristicId` | uniqueidentifier | No | `AMBUCARACTE`. | `tripCharacteristics` (M18) |
| `reasonCategory` | Enum | No | Categoría administrativa. | — |
| `reasonText` | String **(S)** | No | `CAUSA`. | — |
| `km` | DECIMAL(18,4) | No | `CANT_KM`. | — |
| `amount` | DECIMAL(18,4) | No | `IMPORTE`. | — |
| `billingRef` | uniqueidentifier | No | M05. | `billableItems` (M05) [VERIFICAR] |
| `parentTripId` | uniqueidentifier | No | `COD_AMB_ORIG`. | `transportTrips` (M18) |
| `schedule` | { `pickupAt`, `returnAt` } | No | — | — |
| `status` | Enum | Sí | `requested`, `scheduled`, `inProgress`, `completed`, `cancelled`, `derived`. | — |

`tripLegs`: `tripId`, `order`, `origin`, `destination`, `km`, `startedAt`, `endedAt`. Índices `{tenantId, tripDate}`, `{tenantId, vehicleId, tripDate}`, `{tenantId, passengerPersonId}`. Origen: `AMBULANC` (+21 columnas no detalladas [VERIFICAR]).

**`tripLegs`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `tripId` | uniqueidentifier | Sí | — | `transportTrips` (M18) |
| `order` | Int | Sí | — | — |
| `origin` | Object | [VERIFICAR] | — | — |
| `destination` | Object | [VERIFICAR] | — | — |
| `km` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `startedAt` | Date (fecha y hora) | Cond. | — | — |
| `endedAt` | Date (fecha y hora) | Cond. | — | — |

#### `tripCharacteristics`

Campos: `code` (`COD_CAR`), `name` (`DES_CAR`), `tariffModifier`. Origen `AMBUCARACTE`.

Campos de `tripCharacteristics`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `COD_CAR`. | — |
| `name` | String | Sí | `DES_CAR`. | — |
| `tariffModifier` | DECIMAL(18,4) | [VERIFICAR] | — | — |

### 7.4 Cementerio parque

| Colección | Campos principales | Índices |
|---|---|---|
| `cemeteries` | `name`, `habilitation` { `number`, `authority`, `date` }, `legalRegime` (`ccycPrivateCemetery`, `municipalConcession`, `other`), `mortuaryAuthority`, `address`, `active` | `{tenantId, name}` |
| `cemeteryRegulations` | `cemeteryId`, `version`, `documentId`, `validFrom`, `validTo`, `approvalRef` | `{tenantId, cemeteryId, validFrom}` |
| `burialUnits` | `cemeteryId`, `code`, `hierarchy` { `sector`, `block`, `row`, `number` }, `type` (`plot`, `niche`, `urnNiche`, `ossuary`, `other`), `levels` (capacidad), `geo` (GeoJSON opcional), `availability` (`available`, `reserved`, `assigned`, `blocked`), `occupiedLevels`, `currentRightId` | `{tenantId, cemeteryId, code}` único; `{tenantId, cemeteryId, availability}` |
| `burialRights` | `number`, `unitId`, `regulationVersion`, `modality` (`perpetual`, `temporary`, `use`), `holders` [{ `personId`, `sharePct`, `role`: `holder`/`coHolder` }], `contractorPersonId`, `payerAccountId`, `authorizedPersons` [{ `personId`, `scope`, `validTo` }], `instrumentDocumentId`, `acquisition` { `mode`: `cash`/`financed`, `billingRef` }, `maintenanceContractId` (M02; HUECO-TRV-06, antes M01), `startDate`, `endDate`, `status` (`reserved`, `pendingDocumentation`, `active`, `inTransfer`, `extinguished`, `cancelledReservation`), `reservationExpiresAt` | `{tenantId, unitId, status}`; `{tenantId, "holders.personId"}` |
| `burialRightEvents` | `rightId`, `type` (`reserved`, `formalized`, `holderChanged`, `ceded`, `inherited`, `payerChanged`, `authorizedChanged`, `extinguished`), `effectiveAt`, `approvalId`, `documentIds`, `payload` | `{tenantId, rightId, effectiveAt}` |
| `burialOccupancies` | `unitId`, `level`, `deceasedPersonId`, `deceasedSnapshot` { `name`, `deathDate` }, `intermentActId`, `startDate`, `endDate` (por exhumación/traslado), `endActId`, `status` (`occupied`, `reduced`, `transferredOut`) | `{tenantId, unitId, status}`; `{tenantId, deceasedPersonId}` |
| `cemeteryActs` | `number`, `type` (`interment`, `exhumation`, `reduction`, `internalTransfer`, `externalTransferIn`, `externalTransferOut`), `unitId`, `targetUnitId`, `rightId`, `deceasedPersonId`, `authorizedBy` { `personId`, `basis` }, `permit` { `number`, `authority`, `documentId` }, `scheduledAt`, `performedAt`, `responsibleEmployeeId`, `origin`, `destination`, `billingRef`, `status` (`requested`, `documentationPending`, `scheduled`, `performed`, `cancelled`) | `{tenantId, cemeteryId, scheduledAt}`; `{tenantId, number}` único |

**`cemeteries`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `habilitation` | Object | [VERIFICAR] | Subcampos: `number`, `authority`, `date`. | — |
| `legalRegime` | Enum | [VERIFICAR] | `ccycPrivateCemetery`, `municipalConcession`, `other`. | — |
| `mortuaryAuthority` | String | [VERIFICAR] | — | — |
| `address` | Object | [VERIFICAR] | — | — |
| `active` | Bool | [VERIFICAR] | — | — |

**`cemeteryRegulations`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cemeteryId` | uniqueidentifier | Sí | — | `cemeteries` (M18) |
| `version` | Int | [VERIFICAR] | — | — |
| `documentId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `documentRefId` | uniqueidentifier | [VERIFICAR] | Expediente documental en T11 (clave de T05; PA-SOC-19). | `documents` (T11) |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `approvalRef` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |

**`burialUnits`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cemeteryId` | uniqueidentifier | Sí | — | `cemeteries` (M18) |
| `code` | String | Sí | — | — |
| `hierarchy` | Object | [VERIFICAR] | Subcampos: `sector`, `block`, `row`, `number`. | — |
| `type` | Enum | [VERIFICAR] | `plot`, `niche`, `urnNiche`, `ossuary`, `other`. | — |
| `levels` | Int | [VERIFICAR] | Capacidad. | — |
| `geo` | GeoJSON | No | GeoJSON opcional. | — |
| `availability` | Enum | [VERIFICAR] | `available`, `reserved`, `assigned`, `blocked`. | — |
| `occupiedLevels` | Int | [VERIFICAR] | — | — |
| `currentRightId` | uniqueidentifier | Sí | — | `burialRights` (M18) |

**`burialRights`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | — | — |
| `unitId` | uniqueidentifier | Sí | — | `burialUnits` (M18) |
| `regulationVersion` | String | [VERIFICAR] | — | — |
| `modality` | Enum | [VERIFICAR] | `perpetual`, `temporary`, `use`. | — |
| `holders` | [Object] | [VERIFICAR] | Lista; subcampos: `personId`, `sharePct`, `role`: `holder`/`coHolder`. | — |
| `contractorPersonId` | uniqueidentifier | [VERIFICAR] | — | `persons` (M01) |
| `payerAccountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `authorizedPersons` | [Object] | [VERIFICAR] | Lista; subcampos: `personId`, `scope`, `validTo`. | — |
| `instrumentDocumentId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `acquisition` | Object | [VERIFICAR] | Subcampos: `mode`: `cash`/`financed`, `billingRef`. | — |
| `maintenanceContractId` | uniqueidentifier | Sí | M02; HUECO-TRV-06, antes M01. | `serviceContracts` (M02) |
| `startDate` | Date | [VERIFICAR] | — | — |
| `endDate` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `reserved`, `pendingDocumentation`, `active`, `inTransfer`, `extinguished`, `cancelledReservation`. | — |
| `reservationExpiresAt` | Date (fecha y hora) | Cond. | — | — |

**`burialRightEvents`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `rightId` | uniqueidentifier | Sí | — | `burialRights` (M18) |
| `type` | Enum | [VERIFICAR] | `reserved`, `formalized`, `holderChanged`, `ceded`, `inherited`, `payerChanged`, `authorizedChanged`, `extinguished`. | — |
| `effectiveAt` | Date (fecha y hora) | Cond. | — | — |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |
| `documentIds` | [uniqueidentifier] | [VERIFICAR] | — | `storedFiles` (T01) |
| `payload` | Object | [VERIFICAR] | — | — |

**`burialOccupancies`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `burialUnits` (M18) |
| `level` | Enum | [VERIFICAR] | — | — |
| `deceasedPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `deceasedSnapshot` | Object | [VERIFICAR] | Subcampos: `name`, `deathDate`. | — |
| `intermentActId` | uniqueidentifier | [VERIFICAR] | — | `cemeteryActs` (M18) |
| `startDate` | Date | [VERIFICAR] | — | — |
| `endDate` | Date | [VERIFICAR] | Por exhumación/traslado. | — |
| `endActId` | uniqueidentifier | [VERIFICAR] | — | `cemeteryActs` (M18) |
| `status` | Enum | Sí | `occupied`, `reduced`, `transferredOut`. | — |

**`cemeteryActs`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | — | — |
| `type` | Enum | [VERIFICAR] | `interment`, `exhumation`, `reduction`, `internalTransfer`, `externalTransferIn`, `externalTransferOut`. | — |
| `unitId` | uniqueidentifier | Sí | — | `burialUnits` (M18) |
| `targetUnitId` | uniqueidentifier | [VERIFICAR] | — | `burialUnits` (M18) |
| `rightId` | uniqueidentifier | Sí | — | `burialRights` (M18) |
| `deceasedPersonId` | uniqueidentifier | [VERIFICAR] | — | `persons` (M01) |
| `authorizedBy` | Object | Cond. | Subcampos: `personId`, `basis`. | — |
| `permit` | Object | [VERIFICAR] | Subcampos: `number`, `authority`, `documentId`. | — |
| `scheduledAt` | Date (fecha y hora) | Cond. | — | — |
| `performedAt` | Date (fecha y hora) | Cond. | — | — |
| `responsibleEmployeeId` | uniqueidentifier | [VERIFICAR] | — | `employees` (M16) |
| `origin` | Object | [VERIFICAR] | — | — |
| `destination` | [VERIFICAR] | [VERIFICAR] | — | — |
| `billingRef` | uniqueidentifier | [VERIFICAR] | — | `billableItems` (M05) [VERIFICAR] |
| `status` | Enum | Sí | `requested`, `documentationPending`, `scheduled`, `performed`, `cancelled`. | — |

### 7.5 Otros servicios

| Colección | Campos principales | Índices |
|---|---|---|
| `orthopedicItems` | `code`, `type`, `description`, `condition` (`available`, `onLoan`, `maintenance`, `retired`), `fixedAssetId` (M13), `branchId` | `{tenantId, code}` único |
| `orthopedicLoans` | `itemId`, `requestId`, `borrowerPersonId`, `startDate`, `dueDate`, `returnedAt`, `deposit` { `amount`, `receiptRef`, `guaranteeRef` (→ M08 `guarantees`, RF-MOR-179) }, `returnCondition`, `status` (`active`, `overdue`, `returned`, `lost`) | `{tenantId, itemId, status}` |
| `dispenserWithdrawals` | `contractId`, `personId`, `liters`, `withdrawnAt`, `branchId`, `operatorId`, `monthlyAccumulated` | `{tenantId, contractId, withdrawnAt}` |
| `contractRegistrations` | `contractId` (→ M02), `type` (`electricVehicle`, `device`, `other`), `vehicle` { `plate`, `make`, `model`, `chargingPowerKw` } (si `electricVehicle`), `device` { `kind`, `make`, `model`, `serialNumber` } (si `device`), `description` (si `other`), `startDate`, `endDate`, `status` (`active`, `ended`), `legacy` (RF-SOC-148, HUECO-OTR-05) | `{tenantId, contractId, status}`; `{tenantId, type, "vehicle.plate"}`; `{tenantId, "device.serialNumber"}` |

**`orthopedicItems`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `type` | Enum | [VERIFICAR] | — | — |
| `description` | String | [VERIFICAR] | — | — |
| `condition` | Enum | [VERIFICAR] | `available`, `onLoan`, `maintenance`, `retired`. | — |
| `fixedAssetId` | uniqueidentifier | Sí | M13. | `fixedAssets` (M13) |
| `branchId` | uniqueidentifier | Sí | — | `branches` (T04) |

**`orthopedicLoans`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `itemId` | uniqueidentifier | Sí | — | `orthopedicItems` (M18) |
| `requestId` | uniqueidentifier | [VERIFICAR] | — | `benefitRequests` (M18) |
| `borrowerPersonId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `startDate` | Date | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `returnedAt` | Date (fecha y hora) | Cond. | — | — |
| `deposit` | Object | [VERIFICAR] | Subcampos: `amount`, `receiptRef`, `guaranteeRef` (→ M08 `guarantees`, RF-MOR-179). | — |
| `returnCondition` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `overdue`, `returned`, `lost`. | — |

**`dispenserWithdrawals`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `personId` | uniqueidentifier | Sí | — | `persons` (M01) |
| `liters` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `withdrawnAt` | Date (fecha y hora) | Cond. | — | — |
| `branchId` | uniqueidentifier | [VERIFICAR] | — | `branches` (T04) |
| `operatorId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `monthlyAccumulated` | DECIMAL(18,4) | [VERIFICAR] | — | — |

**`contractRegistrations`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | → M02. | `serviceContracts` (M02) |
| `type` | Enum | Sí | `electricVehicle`, `device`, `other`. | — |
| `vehicle` | Object | Cond. | Subcampos: `plate`, `make`, `model`, `chargingPowerKw`. si `electricVehicle`. | — |
| `device` | Object | Cond. | Subcampos: `kind`, `make`, `model`, `serialNumber`. si `device`. | — |
| `description` | String | Cond. | Si `other`. | — |
| `startDate` | Date | [VERIFICAR] | — | — |
| `endDate` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `ended`. | — |
| `legacy` | Object | No | RF-SOC-148, HUECO-OTR-05. | — |

**Reemplazado por `contractRegistrations`** (HUECO-OTR-05). Texto original: "La registración de vehículo eléctrico se guarda como dispositivo del contrato en M01 (tipo `electricVehicle`, con dominio y potencia de carga) y no requiere colección propia."

### 7.6 Planes de vivienda

| Colección | Campos principales | Origen | Índices |
|---|---|---|---|
| `housingPlans` | `serviceId`, `name`, `typologies` [{ `categoryId` (`COD_CATSER`), `name` (`DES_VIV`), `notes` (`OBSERVA`), `inventoryItemId` (antes `productId`; PA-SOC-16) (`COD_PRO`), `minContributionBeforeAllocationPct` (`MINIMO_AA`), `minContributionAfterAllocationPct` (`MINIMO_DA`), `minContributionBeforeDeliveryPct` (`MINIMO_AE`), `minContributionAfterDeliveryPct` (`MINIMO_DE`), `maxAnnualAdvancePct` (`MAXIMO_APA`), `newValueDate` (`FECHA_NVO`), `theoreticalContributionDate` (`FECHA_APORTE_TEORICO`), `useDeliveryDate` (`UTILIZAR_FECHA_ENTREGA`) }], `settings` (parámetros §14 por plan), `status` | `PLANESVIV`, `CATE_SER_EXTRAS` (`VIV_*`) | `{tenantId, serviceId}` |
| `housingPrices` | `planId`, `categoryId`, `date`, `amount`, `status` (`draft`, `approved`), `approvalId`, `batchId` | `PRECIOSVIV` (`COD_PRV`, `COD_CATSER`, `FECHA`, `IMPORTE`) | `{tenantId, categoryId, date}` |
| `housingUnits` | `contractId` (`ID_SERSOC`), `holderId` (`COD_SOC`; CTR-DAT-67, antes `holderPersonId`), `accountId` (`COD_SUM`), `planId` (`CODPLAN`), `categoryId`, `enrollmentDate` (`FECINSC`), `allocationDate` (`FECADJU`), `allocationMethod` (`FORMADJU`), `allocated` (`ADJUDICA`), `ownLand` (`TPROPIO`), `partialDeliveryDate` (`ENTREGAP`), `deliveryDate` (`ENTREGA`), `constructionStart` (`INICONST`), `constructionEnd` (`FINCONST`), `pctToBill`, `pctBilled`, `pctPaid`, `lot` { `localityId`, `districtId`, `address` }, `status` | `VIVIENDAS` (+2 columnas [VERIFICAR]) | `{tenantId, contractId}` único; `{tenantId, planId, status}` |
| `housingContributions` | `unitId`, `period`, `pct`, `priceUsed`, `amount`, `invoiceRef`, `status` (`billed`, `paid`, `voided`), `source` (`regular`, `eventual`, `advance`) | Ítems subtipo 27 de facturas | `{tenantId, unitId, period}` |
| `housingStages` | `planId`, `categoryId`, `code` (`COD_ETA`), `name` (`DES_ETA`), `order` (`ORDEN`) | `VIV_ETAPA` | `{tenantId, categoryId, order}` |
| `housingActivities` | `stageId`, `code` (`COD_ACT`), `name` (`DES_ACT`), `hours` (`CAN_HORA`), `hourPrice` (`PRE_HORA`), `cost`, `order` | `VIV_ACTIVIDAD` | `{tenantId, stageId, order}` |
| `housingActivityMaterials` | `activityId`, `inventoryItemId` (antes `productId`; PA-SOC-16) (M02/M13), `quantity` | `VIV_MATACT` | `{tenantId, activityId, inventoryItemId}` único |
| `housingProgress` | `unitId`, `activityId`, `dateFrom`, `dateTo`, `hours`, `pct`, `notes`, `providerId` (`COD_PROV`), `purchaseInvoiceRef` (`ID_IVACOM`), `certificateId` (`ID_CERT`), `recordedBy` | `VIV_PROGRESO` | `{tenantId, unitId, activityId}` |
| `housingProgressMaterials` | `progressId`, `allocationId` (`COD_VMAT`), `inventoryItemId` (antes `productId`; PA-SOC-16), `quantity` | `VIV_PROGMAT` | `{tenantId, progressId}` |
| `housingMaterialAllocations` | `unitId`, `inventoryItemId` (antes `productId`; PA-SOC-16), `description`, `quantity`, `unitCost` (`PRE_CSI`), `stockMovementRef` (`COD_MOV`, `FEC_MOV`), `state` (`assigned`, `reserved`, `withdrawn`, `used`, `released`) | `VIV_MAT` | `{tenantId, unitId, inventoryItemId}` |
| `housingMaterialWithdrawals` | `unitId`, `providerId`, `date`, `voucherRef` { `docTypeId` (V2 755), `pointOfSale`, `number` }, `stageId`, `warehouseId` (`COD_DPS`), `responsibleId` (`COD_RES`), `items` [{ `inventoryItemId` (antes `productId`; PA-SOC-16), `quantity` (`CAN_PRO`), `unitCost` (`PRE_CSI`) }], `stockMovementRef`, `status` (`issued`, `returnedPartial`, `returned`, `voided`) | `VIV_RETM`, `VIV_RET_IT` | `{tenantId, unitId, date}` |
| `housingCertificates` | `number`, `unitId`, `providerId`, `periodFrom`, `periodTo`, `type` (`progress`, `labor`), `lines` [{ `progressId`, `pct`, `amount` }], `total`, `conceptId` (V2 2276), `purchaseRef`, `status` (`draft`, `saved`, `approved`, `liquidated`, `cancelled`) | `GetCertificado(s)` | `{tenantId, number}` único |
| `housingPlanChanges` | `unitId`, `fromCategoryId`, `toCategoryId`, `billedPctBefore`, `recalculatedPct`, `difference`, `templateId` (V2 419), `approvalId`, `effectiveAt` | `Get_InformeCambioPlan` | `{tenantId, unitId}` |
| `housingTerminations` | `unitId`, `type` (`voluntary`, `rescission`), `contributedAmount`, `commissionPct`, `commissionAmount`, `differenceAmount`, `refundAmount`, `documentRef` (V2 415), `templateId` (V2 418), `approvalId`, `status` (`draft`, `approved`, `executed`, `cancelled`) | `Baja_Plan` | `{tenantId, unitId}` |

**`housingPlans`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `name` | String | Sí | — | — |
| `typologies` | [Object] | [VERIFICAR] | Lista; subcampos: `categoryId` (`COD_CATSER`), `name` (`DES_VIV`), `notes` (`OBSERVA`), `inventoryItemId` (antes `productId`; PA-SOC-16) (`COD_PRO`), `minContributionBeforeAllocationPct` (`MINIMO_AA`), `minContributionAfterAllocationPct` (`MINIMO_DA`), `minContributionBeforeDeliveryPct` (`MINIMO_AE`), `minContributionAfterDeliveryPct` (`MINIMO_DE`), `maxAnnualAdvancePct` (`MAXIMO_APA`), `newValueDate` (`FECHA_NVO`), `theoreticalContributionDate` (`FECHA_APORTE_TEORICO`), `useDeliveryDate` (`UTILIZAR_FECHA_ENTREGA`). | — |
| `settings` | Object | [VERIFICAR] | Parámetros §14 por plan. | — |
| `status` | Enum | Sí | `draft`, `active`, `closed` (§8.1.8; PA-SOC-18; antes "Valores `[VERIFICAR]`: el anexo no los enumera ni define su máquina en el §8"). | — |

**`housingPrices`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `planId` | uniqueidentifier | Sí | — | `servicePlans` (M02) |
| `categoryId` | uniqueidentifier | Sí | — | `serviceCategories` (M02) |
| `date` | Date | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `approved`. | — |
| `approvalId` | uniqueidentifier | Sí | — | `approvalRequests` (T11) |
| `batchId` | uniqueidentifier | Sí | Lote de actualización de precios. | — (identificador del lote que agrupa precios de esta colección; no es referencia; antes `[VERIFICAR]`) |

**`housingUnits`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | `ID_SERSOC`. | `serviceContracts` (M02) |
| `holderId` | uniqueidentifier | Sí | `COD_SOC`; CTR-DAT-67, antes `holderPersonId`. | `holders` (M01) |
| `accountId` | uniqueidentifier | Sí | `COD_SUM`. | `accounts` (M01) |
| `planId` | uniqueidentifier | Sí | `CODPLAN`. | `servicePlans` (M02) |
| `categoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `enrollmentDate` | Date | [VERIFICAR] | `FECINSC`. | — |
| `allocationDate` | Date | [VERIFICAR] | `FECADJU`. | — |
| `allocationMethod` | Enum | [VERIFICAR] | `FORMADJU`. | — |
| `allocated` | Bool | [VERIFICAR] | `ADJUDICA`. | — |
| `ownLand` | Bool | [VERIFICAR] | `TPROPIO`. | — |
| `partialDeliveryDate` | Date | [VERIFICAR] | `ENTREGAP`. | — |
| `deliveryDate` | Date | [VERIFICAR] | `ENTREGA`. | — |
| `constructionStart` | Date | [VERIFICAR] | `INICONST`. | — |
| `constructionEnd` | Date | [VERIFICAR] | `FINCONST`. | — |
| `pctToBill` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `pctBilled` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `pctPaid` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `lot` | Object | [VERIFICAR] | Subcampos: `localityId`, `districtId`, `address`. | — |
| `status` | Enum | Sí | `enrolled`, `allocated`, `underConstruction`, `partiallyDelivered`, `delivered`, `terminated`, `transferred` (fila Vivienda del §8; antes sin valores). | — |

**`housingContributions`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `period` | String | Sí | — | — |
| `pct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `priceUsed` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `invoiceId` | uniqueidentifier | [VERIFICAR] | Antes `invoiceRef` (nombre de T05; PA-SOC-19). | `invoices` (M05) |
| `status` | Enum | Sí | `billed`, `paid`, `voided`. | — |
| `source` | Enum | Sí | `regular`, `eventual`, `advance`. | — |

**`housingStages`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `planId` | uniqueidentifier | Sí | — | `servicePlans` (M02) |
| `categoryId` | uniqueidentifier | Sí | — | `serviceCategories` (M02) |
| `code` | String | Sí | `COD_ETA`. | — |
| `name` | String | Sí | `DES_ETA`. | — |
| `order` | Int | Sí | `ORDEN`. | — |

**`housingActivities`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `stageId` | uniqueidentifier | Sí | — | `housingStages` (M18) |
| `code` | String | Sí | `COD_ACT`. | — |
| `name` | String | Sí | `DES_ACT`. | — |
| `hours` | DECIMAL(18,4) | [VERIFICAR] | `CAN_HORA`. | — |
| `hourPrice` | DECIMAL(18,4) | [VERIFICAR] | `PRE_HORA`. | — |
| `cost` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `order` | Int | Sí | — | — |

**`housingActivityMaterials`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `activityId` | uniqueidentifier | Sí | — | `housingActivities` (M18) |
| `inventoryItemId` | uniqueidentifier | [VERIFICAR] | M02/M13. Antes `productId` (PA-SOC-16). | `inventoryItems` (M13) (antes con `[VERIFICAR]`; T05 ya la nombraba `inventoryItemId`) |
| `quantity` | DECIMAL(18,4) | [VERIFICAR] | — | — |

**`housingProgress`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `activityId` | uniqueidentifier | Sí | — | `housingActivities` (M18) |
| `supplierId` | uniqueidentifier | [VERIFICAR] | Proveedor de la obra o del servicio (clave de T05; PA-SOC-19). | `suppliers` (M12) |
| `dateFrom` | Date | [VERIFICAR] | — | — |
| `dateTo` | Date | [VERIFICAR] | — | — |
| `hours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `pct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `notes` | String | [VERIFICAR] | — | — |
| `providerId` | uniqueidentifier | [VERIFICAR] | `COD_PROV`. | `careProviders` (M18) |
| `purchaseInvoiceRef` | uniqueidentifier | [VERIFICAR] | `ID_IVACOM`. | `invoices` (M05) |
| `certificateId` | uniqueidentifier | [VERIFICAR] | `ID_CERT`. | `housingCertificates` (M18) |
| `recordedBy` | uniqueidentifier | Cond. | — | `memberships` (T02) |

**`housingProgressMaterials`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `progressId` | uniqueidentifier | Sí | — | `housingProgress` (M18) |
| `allocationId` | uniqueidentifier | [VERIFICAR] | `COD_VMAT`. | `housingMaterialAllocations` (M18) |
| `inventoryItemId` | uniqueidentifier | [VERIFICAR] | Antes `productId` (PA-SOC-16). | `inventoryItems` (M13) (antes con `[VERIFICAR]`; T05 ya la nombraba `inventoryItemId`) |
| `quantity` | DECIMAL(18,4) | [VERIFICAR] | — | — |

**`housingMaterialAllocations`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `inventoryItemId` | uniqueidentifier | [VERIFICAR] | Antes `productId` (PA-SOC-16). | `inventoryItems` (M13) (antes con `[VERIFICAR]`; T05 ya la nombraba `inventoryItemId`) |
| `description` | String | [VERIFICAR] | — | — |
| `quantity` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `unitCost` | DECIMAL(18,4) | [VERIFICAR] | `PRE_CSI`. | — |
| `stockMovementRef` | uniqueidentifier | Sí | `COD_MOV`, `FEC_MOV`. | `stockMovements` (M13) |
| `state` | Enum | Sí | `assigned`, `reserved`, `withdrawn`, `used`, `released`. | — |

**`housingMaterialWithdrawals`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `providerId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) |
| `date` | Date | [VERIFICAR] | — | — |
| `voucherRef` | Object | [VERIFICAR] | Subcampos: `docTypeId` (V2 755), `pointOfSale`, `number`. | `voucherTypes` (M05) (solo `docTypeId`; `pointOfSale` y `number` son numeración) |
| `stageId` | uniqueidentifier | [VERIFICAR] | — | `housingStages` (M18) |
| `warehouseId` | uniqueidentifier | Sí | `COD_DPS`. | `warehouses` (M13) |
| `responsibleId` | uniqueidentifier | [VERIFICAR] | `COD_RES`. | `memberships` (T02) |
| `items` | [Object] | [VERIFICAR] | Lista; subcampos: `inventoryItemId` (antes `productId`; PA-SOC-16), `quantity` (`CAN_PRO`), `unitCost` (`PRE_CSI`). | — |
| `stockMovementRef` | uniqueidentifier | [VERIFICAR] | — | `stockMovements` (M13) |
| `status` | Enum | Sí | `issued`, `returnedPartial`, `returned`, `voided`. | — |

**`housingCertificates`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | — | — |
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `providerId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) |
| `supplierId` | uniqueidentifier | [VERIFICAR] | Proveedor de la obra o del servicio (clave de T05; PA-SOC-19). | `suppliers` (M12) |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `type` | Enum | [VERIFICAR] | `progress`, `labor`. | — |
| `lines` | [Object] | [VERIFICAR] | Lista; subcampos: `progressId`, `pct`, `amount`. | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | V2 2276. | `billableConcepts` (M02) |
| `purchaseRef` | uniqueidentifier | [VERIFICAR] | — | `supplierInvoices` (M12) [VERIFICAR] |
| `status` | Enum | Sí | `draft`, `saved`, `approved`, `liquidated`, `cancelled`. | — |

**`housingPlanChanges`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `fromCategoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `toCategoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `billedPctBefore` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `recalculatedPct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `difference` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `templateId` | uniqueidentifier | [VERIFICAR] | V2 419. | `documentTemplates` (T11) (antes `[VERIFICAR]`) |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |
| `effectiveAt` | Date (fecha y hora) | Cond. | — | — |

**`housingTerminations`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `unitId` | uniqueidentifier | Sí | — | `housingUnits` (M18) |
| `type` | Enum | [VERIFICAR] | `voluntary`, `rescission`. | — |
| `contributedAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `commissionPct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `commissionAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `differenceAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `refundAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `documentRef` | uniqueidentifier | [VERIFICAR] | V2 415. | `storedFiles` (T01) |
| `templateId` | uniqueidentifier | [VERIFICAR] | V2 418. | `documentTemplates` (T11) (antes `[VERIFICAR]`) |
| `approvalId` | uniqueidentifier | [VERIFICAR] | — | `approvalRequests` (T11) |
| `status` | Enum | Sí | `draft`, `approved`, `executed`, `cancelled`. | — |

### 7.7 Flota y GPS

| Colección | Campos principales | Origen | Índices |
|---|---|---|---|
| `fleetVehicles` | `name` (`DES_MOV`), `plate` (`DOMINIO`), `type` (`TIPO_VEHICULO`: `ambulance`, `truck`, `pickup`, `car`, `crane`, `motorcycle`, `other`), `owned` (`PROPIO`), `providerId` (`COD_PROV`), `initialKm` (`KM_INICIAL`), `currentKm`, `expectedKmPerLiter` (`RENDIMIENTO`), `payloadKg` (`KG`), `costPerKm` (`COSTO`), `shortTripPrice` (`PRE_VIAJESCORTOS`), `fuelTypeId`, `fixedAssetId` (M13), `costCenterId` (M15), `gpsDeviceId` (`NOM_AVL`), `status` (`available`, `inUse`, `maintenance`, `unfit`, `retired`) | `MOVIL` | `{tenantId, plate}` único |
| `drivers` | `code` (`COD_CHO`), `personId` (M01, obligatorio, DEC-097), `employeeId` (M16), `license` { `number`, `classes`, `expiresAt` }, `active`; el nombre (`DES_CHO`) se lee de la persona de M01. *Reemplazado (10-11-2026): "`code` (`COD_CHO`), `name` (`DES_CHO`), `personId`, `employeeId` (M16), `license` { `number`, `classes`, `expiresAt` }, `active`"* | `CHOFERES` | `{tenantId, code}` único; `{tenantId, personId}` único |
| `vehicleDocuments` | `vehicleId`, `type` (`insurance`, `technicalInspection`, `sanitaryHabilitation`, `registration`, `other`), `number`, `issuer`, `validFrom`, `validTo`, `documentId` | MER-015 | `{tenantId, vehicleId, type, validTo}` |
| `vehicleMaintenances` | `vehicleId`, `type` (`preventive`, `corrective`), `trigger` { `km`, `date` }, `performedAt`, `km`, `providerId`, `cost`, `purchaseRef`, `status` (`planned`, `inProgress`, `done`, `cancelled`) | MER-015 | `{tenantId, vehicleId, status}` |
| `vehicleUsages` | `vehicleId`, `driverId`, `source` { `kind`: `workOrder`/`trip`/`internal`, `id` }, `startAt`, `endAt`, `startKm`, `endKm`, `km`, `hours`, `cost`, `costCenterId` | MER-015 | `{tenantId, vehicleId, startAt}` |
| `fuelTypes` | `code`, `name`, `vatRateId` (antes `vatRate`) (canónica; absorbe el tipo `fuel` de `purchaseLookups` de M12, CTR-DAT-54) | `COMBUSTIBLES` | `{tenantId, code}` único |
| `fuelLoads` | `vehicleId` (`COD_MOV`), `fuelTypeId` (`ID_COMBUST`), `liters` (`LTS`), `km` (`KM`), `loadedAt`, `amount`, `purchaseInvoiceRef` (`ID_IVACOM`), `tripSettlementId`, `source` (`purchaseInvoice`, `manual`, `fieldApp`), `ticketStoredFileId` (→ `storedFiles` de T01; antes `ticketPhotoId`), `status` (`active`, `voided`) | `IVACOM_COMBUSTIBLES` | `{tenantId, vehicleId, loadedAt}` |
| `tripSettlements` | `number`, `source` { `kind`: `salesDocument`/`trip`/`workOrder`, `id` } (`ID_COMPV` → comprobante de venta de M11 con `kind = salesDocument`; canónica, absorbe `freightSettlements` de M11, CTR-DAT-53), `date` (`FECHA`), `estimatedKm`, `actualKm` (`KM_REALES`), `actualFreight` (`FLETE_REAL`), `freightType` (`TIPO_FLETE`), `tolls` (`PEAJES`), `perDiem` (`VIATICOS`), `items` [{ `stationNumber` (`NUM_PUESTO`), `voucherNumber` (`NUM_COM`), `liters` (`LITROS`), `pricePerLiter` (`PRELITRO`), `loadedDuringTrip` (`CARGADOENVIAJE`) }], `total`, `vehicleId`, `driverId`, `status` (`draft`, `submitted`, `approved`, `rejected`, `posted`) | `COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS` | `{tenantId, "source.kind", "source.id"}` |
| `gpsDevices` | `vehicleId`, `providerAdapter` (`discar`, `generic`), `externalUnitId` (`UNIT`), `active` | `MOVIL.NOM_AVL` | `{tenantId, providerAdapter, externalUnitId}` único |
| `gpsPositions` | Colección *time series* (`timeField: at`, `metaField: { tenantId, vehicleId }`): `at` (`FECHA`), `statusId` (`IDSTATUS`), `statusText` (`DSTATUS`), `event` (`EVENTO`), `location` GeoJSON (`LATITUD`, `LONGITUD`), `speed`, `odometer` | `AVL_REG` | `{meta.tenantId, meta.vehicleId, at}` único (deduplicación); TTL de colección = máximo de plataforma y purga por tenant según PRM-SOC-035 (CTR-DAT-55) |

**`fleetVehicles`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | `DES_MOV`. | — |
| `plate` | String | Sí | `DOMINIO`. | — |
| `type` | Enum | [VERIFICAR] | `TIPO_VEHICULO`: `ambulance`, `truck`, `pickup`, `car`, `crane`, `motorcycle`, `other`. | — |
| `owned` | Bool | [VERIFICAR] | `PROPIO`. | — |
| `providerId` | uniqueidentifier | [VERIFICAR] | `COD_PROV`. | `careProviders` (M18) |
| `initialKm` | DECIMAL(18,4) | [VERIFICAR] | `KM_INICIAL`. | — |
| `currentKm` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `expectedKmPerLiter` | DECIMAL(18,4) | [VERIFICAR] | `RENDIMIENTO`. | — |
| `payloadKg` | DECIMAL(18,4) | [VERIFICAR] | `KG`. | — |
| `costPerKm` | DECIMAL(18,4) | [VERIFICAR] | `COSTO`. | — |
| `shortTripPrice` | DECIMAL(18,4) | [VERIFICAR] | `PRE_VIAJESCORTOS`. | — |
| `fuelTypeId` | uniqueidentifier | [VERIFICAR] | — | `fuelTypes` (M18) |
| `fixedAssetId` | uniqueidentifier | Sí | M13. | `fixedAssets` (M13) |
| `costCenterId` | uniqueidentifier | Sí | M15. | `costCenters` (M15) |
| `gpsDeviceId` | uniqueidentifier | Sí | `NOM_AVL`. | `gpsDevices` (M18) |
| `status` | Enum | Sí | `available`, `inUse`, `maintenance`, `unfit`, `retired`. | — |

**`drivers`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `COD_CHO`. | — |
| `name` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.displayName` (M01); `DES_CHO` solo alimenta la búsqueda o creación de la persona en la migración. Fila anterior: "`name` · String · Sí · `DES_CHO`." | — |
| `personId` | uniqueidentifier | Sí | Persona del chofer; alta asistida de M01 con control de duplicados (DEC-097). | `persons` (M01) |
| `employeeId` | uniqueidentifier | No | M16; obligatorio solo si el chofer es empleado (RF-SOC-119 admite choferes externos). Antes: "Sí". | `employees` (M16) |
| `license` | Object | [VERIFICAR] | Subcampos: `number`, `classes`, `expiresAt`. | — |
| `active` | Bool | [VERIFICAR] | — | — |

**`vehicleDocuments`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vehicleId` | uniqueidentifier | Sí | — | `fleetVehicles` (M18) |
| `documentRefId` | uniqueidentifier | [VERIFICAR] | Expediente documental en T11 (clave de T05; PA-SOC-19). | `documents` (T11) |
| `type` | Enum | [VERIFICAR] | `insurance`, `technicalInspection`, `sanitaryHabilitation`, `registration`, `other`. | — |
| `number` | String | Sí | — | — |
| `issuer` | String | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `documentId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |

**`vehicleMaintenances`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vehicleId` | uniqueidentifier | Sí | — | `fleetVehicles` (M18) |
| `supplierId` | uniqueidentifier | [VERIFICAR] | Proveedor de la obra o del servicio (clave de T05; PA-SOC-19). | `suppliers` (M12) |
| `type` | Enum | [VERIFICAR] | `preventive`, `corrective`. | — |
| `trigger` | Object | [VERIFICAR] | Subcampos: `km`, `date`. | — |
| `performedAt` | Date (fecha y hora) | Cond. | — | — |
| `km` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `providerId` | uniqueidentifier | [VERIFICAR] | — | `careProviders` (M18) |
| `cost` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `purchaseRef` | uniqueidentifier | [VERIFICAR] | — | `supplierInvoices` (M12) [VERIFICAR] |
| `status` | Enum | Sí | `planned`, `inProgress`, `done`, `cancelled`. | — |

**`vehicleUsages`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vehicleId` | uniqueidentifier | Sí | — | `fleetVehicles` (M18) |
| `driverId` | uniqueidentifier | Sí | — | `drivers` (M18) |
| `source` | Object | [VERIFICAR] | Subcampos: `kind`: `workOrder`/`trip`/`internal`, `id`. | — |
| `startAt` | Date (fecha y hora) | Cond. | — | — |
| `endAt` | Date (fecha y hora) | Cond. | — | — |
| `startKm` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `endKm` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `km` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `hours` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `cost` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `costCenterId` | uniqueidentifier | [VERIFICAR] | — | `costCenters` (M15) |

**`fuelTypes`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `vatRateId` | uniqueidentifier (antes Enum) | Sí (antes [VERIFICAR]; todo combustible liquida IVA, T05 PA-DAT-05) | Antes `vatRate` (Enum); referencia a la alícuota con el nombre de T05 (PA-SOC-19). Canónica; absorbe el tipo `fuel` de `purchaseLookups` de M12, CTR-DAT-54. | `vatRates` (M06) |

**`fuelLoads`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vehicleId` | uniqueidentifier | Sí | `COD_MOV`. | `fleetVehicles` (M18) |
| `fuelTypeId` | uniqueidentifier | Sí | `ID_COMBUST`. | `fuelTypes` (M18) |
| `liters` | DECIMAL(18,4) | [VERIFICAR] | `LTS`. | — |
| `km` | DECIMAL(18,4) | [VERIFICAR] | `KM`. | — |
| `loadedAt` | Date (fecha y hora) | Cond. | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `supplierInvoiceId` | uniqueidentifier | [VERIFICAR] | `ID_IVACOM`. Antes `purchaseInvoiceRef` → `invoices` (M05); la factura de combustible es de compra (nombre de T05; PA-SOC-19). | `supplierInvoices` (M12) |
| `tripSettlementId` | uniqueidentifier | [VERIFICAR] | — | `tripSettlements` (M18) |
| `source` | Enum | [VERIFICAR] | `purchaseInvoice`, `manual`, `fieldApp`. | — |
| `ticketStoredFileId` | uniqueidentifier | [VERIFICAR] | → `storedFiles` de T01; antes `ticketPhotoId`. | `storedFiles` (T01) |
| `status` | Enum | Sí | `active`, `voided`. | — |

**`tripSettlements`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | — | — |
| `source` | Object | [VERIFICAR] | Subcampos: `kind`: `salesDocument`/`trip`/`workOrder`, `id`. `ID_COMPV` → comprobante de venta de M11 con `kind = salesDocument`; canónica, absorbe `freightSettlements` de M11, CTR-DAT-53. | — |
| `date` | Date | [VERIFICAR] | `FECHA`. | — |
| `estimatedKm` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `actualKm` | DECIMAL(18,4) | [VERIFICAR] | `KM_REALES`. | — |
| `actualFreight` | DECIMAL(18,4) | [VERIFICAR] | `FLETE_REAL`. | — |
| `freightType` | Enum | [VERIFICAR] | `TIPO_FLETE`. | — |
| `tolls` | DECIMAL(18,4) | [VERIFICAR] | `PEAJES`. | — |
| `perDiem` | DECIMAL(18,4) | [VERIFICAR] | `VIATICOS`. | — |
| `items` | [Object] | [VERIFICAR] | Lista; subcampos: `stationNumber` (`NUM_PUESTO`), `voucherNumber` (`NUM_COM`), `liters` (`LITROS`), `pricePerLiter` (`PRELITRO`), `loadedDuringTrip` (`CARGADOENVIAJE`). | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `vehicleId` | uniqueidentifier | Sí | — | `fleetVehicles` (M18) |
| `driverId` | uniqueidentifier | Sí | — | `drivers` (M18) |
| `status` | Enum | Sí | `draft`, `submitted`, `approved`, `rejected`, `posted`. | — |

**`gpsDevices`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vehicleId` | uniqueidentifier | Sí | — | `fleetVehicles` (M18) |
| `providerAdapter` | Enum | Sí | `discar`, `generic`. | — |
| `externalUnitId` | String | Sí | `UNIT`. Identificador de la unidad en el proveedor GPS (externo). | — (identificador externo del proveedor GPS; no es referencia) |
| `active` | Bool | [VERIFICAR] | — | — |

**`gpsPositions`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `statusId` | String | [VERIFICAR] | `IDSTATUS`. Código de estado del proveedor GPS (externo). | — (código externo del proveedor GPS; no es referencia) |
| `meta` | Object | Sí | `{ tenantId, vehicleId }`: metaField de la serie temporal (claves de T05; PA-SOC-19). | `fleetVehicles` (M18) (solo `meta.vehicleId`) |
| `statusText` | String | [VERIFICAR] | `DSTATUS`. | — |
| `event` | String | [VERIFICAR] | `EVENTO`. | — |
| `location` | GeoJSON | [VERIFICAR] | GeoJSON (`LATITUD`, `LONGITUD`). | — |
| `speed` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `odometer` | DECIMAL(18,4) | [VERIFICAR] | — | — |

## 8. Estados y transiciones

| Entidad | Transiciones | Actor / precondición | Efectos | Reversión (AGR-003) |
|---|---|---|---|---|
| Adherente | `pendingValidation` → `active` → (`observed` ↔ `active`) → `suspended` → `active` / `ended` | Operador; requisitos del plan; desconexión (sistema) | Evento `soc.dependent.*`; M04 recalcula al período siguiente | Baja errónea: restauración con nuevo evento `restored` (no se borra la baja) |
| Beneficiario | `active` → `ended` | Operador / sistema | — | Nuevo registro |
| Solicitud de prestación | `requested` → `inReview` → `approved` / `rejected`; `approved` → `inProgressWithProvider` → `answered` → `completed`; cualquiera no terminal → `cancelled` | Operador; excepción con responsable | Costos, facturación de cargos al socio | Reapertura con permiso `soc.solicitudes.excepcionar` |
| Subsidio | `draft` → `pendingApproval` → `approved` → `paid`; `pendingApproval` → `rejected`; `draft` → `expired` (plazo) | Responsable; reglamento | Orden de pago M14 | Anulación de la orden vuelve a `approved` |
| Unidad de sepultura | `available` → `reserved` → `assigned`; `reserved` → `available` (vencimiento); `assigned` → `blocked` (orden judicial) | Sistema / administrador | — | — |
| Derecho de sepultura | `reserved` → `pendingDocumentation` → `active` → `inTransfer` → `active` (nuevo titular) / `extinguished`; `reserved` → `cancelledReservation` | Administrador; cesión y extinción con aprobación jurídica | Eventos `burialRightEvents` | Extinción solo revertible por resolución documentada |
| Ocupación | `occupied` → `reduced` / `transferredOut` | Acto realizado | Libera niveles si corresponde | Nunca se borra |
| Acto de cementerio | `requested` → `documentationPending` → `scheduled` → `performed`; → `cancelled` | Autorizado válido + permiso | Crea o cierra ocupaciones | Acto realizado no se revierte; se registra acto inverso |
| Viaje | `requested` → `scheduled` → `inProgress` → `completed`; `requested` → `derived` (emergencia); → `cancelled` | Operador de traslados; chofer en PWA | Uso de vehículo, facturación | — |
| Vivienda | `enrolled` → `allocated` → `underConstruction` → `partiallyDelivered` → `delivered`; cualquiera previo a `delivered` → `terminated` (rescisión) o `transferred` | Responsable de planes | Cambia % mínimo de aporte | Rescisión aprobada no se revierte; reinscripción nueva |
| Certificado | `draft` → `saved` → `approved` → `liquidated`; `draft`/`saved` → `cancelled` | Técnico / responsable (distinto) | Obligación al proveedor | Liquidado: nota de crédito del proveedor en M12 |
| Retiro de materiales | `issued` → `returnedPartial` → `returned`; `issued` → `voided` | Operador de vivienda | Movimiento M13 | Contramovimiento |
| Vehículo | `available` ↔ `inUse`; `available` → `maintenance` → `available`; → `unfit` (documento vencido) → `available`; → `retired` | Sistema / responsable | Bloquea asignación | — |
| Rendición | `draft` → `submitted` → `approved` → `posted`; `submitted` → `rejected` → `draft` | Chofer / responsable (distinto) | Novedades M16, costos M15 | Anulación con contrapartida |
| Préstamo ortopédico | `active` → `overdue` → `returned` / `lost` | Sistema / operador | Elemento a mantenimiento al devolver | — |

### 8.1 Tablas de transiciones agregadas (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** se agregan tablas de transiciones para las colecciones cuyo §7 enumeraba estados sin transiciones (`burialServiceCases`, `bloodCoverageRequests`, `donationAppointments`, `healthAuthorizations`), se explicita el origen de `cancelled` en Viaje (`transportTrips`), que la tabla anterior dejaba sin estado de origen, y se proponen valores para `providerAgreements.status` y `donationCampaigns.status`, que el §7 declaraba sin valores. `housingUnits.status` toma los valores de la fila Vivienda de la tabla anterior. La tabla anterior se conserva. "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso; las transiciones sin respaldo explícito llevan `[VERIFICAR]`.

#### 8.1.1 Viaje (`transportTrips.status`)

Estado inicial: `requested`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `requested` | Solicitud de traslado | — | — |
| `requested` | `scheduled` | Programación por el operador de traslados | — | — |
| `scheduled` | `inProgress` | Inicio del viaje por el chofer (PWA) | — | — |
| `inProgress` | `completed` | Fin del viaje | — | EVT-SOC-07 `soc.trip.completed` |
| `requested` | `derived` | Derivación por emergencia | — | — |
| `requested`, `scheduled` | `cancelled` | Cancelación del viaje `[VERIFICAR]` (la tabla anterior no declaraba el origen) | — | — |

#### 8.1.2 Caso de sepelio (`burialServiceCases.status`)

Estado inicial: `open`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Aprobación de la solicitud de prestación de sepelio | — | EVT-SOC-03 `soc.benefitRequest.decided` |
| `open` | `coordinated` | Servicios coordinados con el prestador | — | — |
| `coordinated` | `completed` | Prestación realizada | — | — |
| `open`, `coordinated` | `cancelled` | Cancelación `[VERIFICAR]` | — | — |

#### 8.1.3 Cobertura de sangre (`bloodCoverageRequests.status`)

Estado inicial: `requested`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `requested` | Solicitud de cobertura | RN-SOC-028, RN-SOC-055 (un aporte impago nunca rechaza ni demora la solicitud) | — |
| `requested` | `inProgressWithProvider` | Derivación al prestador del convenio | — | — |
| `inProgressWithProvider` | `answered` | Respuesta del prestador (`responseAt`) | — | — |
| `answered` | `closed` | Cierre del caso | — | — |

#### 8.1.4 Turno de donación (`donationAppointments.status`)

Estado inicial: `booked`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `booked` | Reserva del turno en la campaña | — | — |
| `booked` | `attended` | Asistencia registrada (sin aptitud ni resultados) | — | — |
| `booked` | `noShow` | Inasistencia al cierre de la jornada `[VERIFICAR]` | — | — |
| `booked` | `cancelled` | Cancelación del turno | — | — |

#### 8.1.5 Autorización sanitaria (`healthAuthorizations.status`)

Estado inicial: `requested`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `requested` | Solicitud de autorización | — | — |
| `requested` | `authorized` | Autorización del responsable | — | — |
| `requested` | `rejected` | Rechazo | — | — |
| `authorized` | `closed` | Cierre tras la prestación `[VERIFICAR]` | — | — |

#### 8.1.6 Convenio con prestador (`providerAgreements.status`)

Valores (asumidos en PA-SOC-18, DEC-072; antes "valores propuestos `[VERIFICAR]`"): `draft`, `active`, `ended` (el §7 declaraba `status` sin valores; la vigencia la dan `validFrom` y `validTo`). Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Carga del convenio | — | — |
| `draft` | `active` | Aprobación del convenio | — | — |
| `active` | `ended` | Fin de vigencia (`validTo`) o rescisión | — | — |

#### 8.1.7 Campaña de donación (`donationCampaigns.status`)

Valores (asumidos en PA-SOC-18, DEC-072; antes "valores propuestos `[VERIFICAR]`"): `planned`, `open`, `closed`, `cancelled` (el §7 declaraba `status` sin valores). Estado inicial: `planned`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `planned` | Alta de la campaña | — | — |
| `planned` | `open` | Apertura de turnos | — | — |
| `open` | `closed` | Fin de la campaña | — | — |
| `planned`, `open` | `cancelled` | Cancelación | — | — |

#### 8.1.8 Plan de vivienda (`housingPlans.status`)

Valores: `draft`, `active`, `closed` (PA-SOC-18; antes el §7 no los enumeraba). Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Carga del plan y sus tipologías | — | — |
| `draft` | `active` | Habilitación del plan para nuevas adhesiones | Al menos una tipología con precio vigente (`housingPrices`) | — |
| `active` | `closed` | Cierre del plan a nuevas adhesiones | — | — |

Un plan `closed` no admite adhesiones nuevas, pero conserva las unidades, aportes y adjudicaciones existentes hasta su entrega.

### 8.2 Estados iniciales, máquinas faltantes y estados sin origen (corrección 05-11-2026)

Corrección del 05-11-2026 (PA-SOC-19): la tabla general del §8 no declara el estado inicial de sus máquinas, deja sin origen `extinguished` (derecho de sepultura), `cancelled` (acto de cementerio), `transferred` (vivienda) y `retired` (vehículo), y el §7 enumera valores sin transiciones para siete colecciones. Esta tabla lo explicita sin cambiar la tabla general. Estado inicial: ver las filas `(alta)`.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `serviceDependents` | (alta) | `pendingValidation` | Alta del adherente | — | — |
| `serviceBeneficiaries` | (alta) | `active` | Alta del beneficiario | — | — |
| `benefitRequests` | (alta) | `requested` | Solicitud de prestación | — | — |
| `deathSubsidyCases` | (alta) | `draft` | Carga del subsidio | — | — |
| `burialUnits` | (alta) | `available` | Alta de la unidad | — | — |
| `burialRights` | (alta) | `reserved` | Reserva del derecho | — | — |
| `burialRights` | `active`, `inTransfer` | `extinguished` | Extinción con aprobación jurídica | — | — |
| `burialOccupancies` | (alta) | `occupied` | Acto de inhumación realizado | — | — |
| `cemeteryActs` | (alta) | `requested` | Solicitud del acto | — | — |
| `cemeteryActs` | `requested`, `documentationPending`, `scheduled` | `cancelled` | Cancelación antes de realizarse | — | — |
| `orthopedicLoans` | (alta) | `active` | Entrega del elemento | — | — |
| `housingUnits` | (alta) | `enrolled` | Inscripción en el plan | — | — |
| `housingUnits` | `enrolled`, `allocated`, `underConstruction`, `partiallyDelivered` | `transferred` | Cesión aprobada a otro asociado | — | — |
| `housingUnits` | `enrolled`, `allocated`, `underConstruction`, `partiallyDelivered` | `terminated` | Rescisión aprobada (`housingTerminations` `executed`) | — | — |
| `housingMaterialWithdrawals` | (alta) | `issued` | Emisión del retiro | — | — |
| `housingCertificates` | (alta) | `draft` | Carga del certificado | — | — |
| `fleetVehicles` | (alta) | `available` | Alta del vehículo | — | — |
| `fleetVehicles` | `available`, `maintenance`, `unfit` | `retired` | Baja definitiva | — | — |
| `tripSettlements` | (alta) | `draft` | Carga de la rendición | — | — |
| `housingPrices` | (alta) | `draft` | Carga del precio de la tipología | — | — |
| `housingPrices` | `draft` | `approved` | Aprobación (`approvalId`, T11) | — | — |
| `housingContributions` | (alta) | `billed` | Facturación del aporte (M05) | — | — |
| `housingContributions` | `billed` | `paid` | Cobro del aporte (M07) | — | — |
| `housingContributions` | `billed` | `voided` | Anulación de la factura | — | — |
| `housingMaterialAllocations.state` | (alta) | `assigned` | Asignación del material a la unidad | — | — |
| `housingMaterialAllocations.state` | `assigned` | `reserved` | Reserva en M13 | — | — |
| `housingMaterialAllocations.state` | `reserved` | `withdrawn` | Retiro de materiales (`housingMaterialWithdrawals`) | — | — |
| `housingMaterialAllocations.state` | `withdrawn` | `used` | Certificación del avance que lo consume | — | — |
| `housingMaterialAllocations.state` | `assigned`, `reserved` | `released` | Liberación (cambio de plan o rescisión) | — | — |
| `housingTerminations` | (alta) | `draft` | Carga de la baja o rescisión | — | — |
| `housingTerminations` | `draft` | `approved` | Aprobación (`approvalId`, T11) | — | — |
| `housingTerminations` | `approved` | `executed` | Liquidación de la devolución y baja de la unidad | — | — |
| `housingTerminations` | `draft`, `approved` | `cancelled` | Desistimiento | — | — |
| `vehicleMaintenances` | (alta) | `planned` | Programación por km o fecha | — | — |
| `vehicleMaintenances` | `planned` | `inProgress` | Ingreso del vehículo al taller | — | — |
| `vehicleMaintenances` | `inProgress` | `done` | Fin del mantenimiento | — | — |
| `vehicleMaintenances` | `planned` | `cancelled` | Cancelación | — | — |
| `fuelLoads` | (alta) | `active` | Registro de la carga | — | — |
| `fuelLoads` | `active` | `voided` | Anulación por carga errónea | — | EVT-SOC-17 `soc.vehicle.usageVoided` |
| `contractRegistrations` | (alta) | `active` | Registro asociado al contrato | — | — |
| `contractRegistrations` | `active` | `ended` | Baja del contrato o del registro | — | — |

## 9. Procesos y flujos

### 9.1 Alta y mantenimiento del grupo

1. Contrato de servicio social activo en M02 (HUECO-TRV-06; antes "en M01") (o creado por regla de alta automática, RF-SOC-029).
2. Operador o asociado (PWA) agrega adherentes: persona en M01, vínculo, requisitos; validaciones RN-SOC-001, 005, 006, 007, 014.
3. Alta efectiva → evento `soc.dependent.added` → M04 toma la cantidad para el próximo período.
4. JOB-SOC-01 `soc:mayoria-edad` (diario): detecta mayoría de edad, notifica y propone baja o recategorización.
5. JOB-SOC-02 `soc:revision-condiciones` (manual/mensual): previsualiza bajas por condición o recategorización masiva; aplica con confirmación por lote (reanudable, idempotente por `batchId + dependentId`).
6. Desconexión/reconexión/transferencia/fallecimiento: consumidores de eventos de M02 (contrato) y M01 (fallecimiento) aplican RN-SOC-008 a 013.

### 9.2 Solicitud de prestación (CU-24)

1. Registro de la solicitud con beneficiario y fecha del evento.
2. Verificación automática de cobertura (contrato, adherente, carencia, plan, topes, convenio) → `covered`/`notCovered`/`review`.
3. `review` o excepción → responsable con plazo (T11).
4. Autorización: referencia del prestador, costos; cargos al socio → M04/M05; factura del prestador → M12.
5. Cierre con conformidad.

### 9.3 Sepelio y subsidio

1. Aviso de fallecimiento → caso de sepelio vinculado a solicitud; si la persona no tiene fallecimiento en M01, se registra (M01 publica `per.person.deceased`).
2. Coordinación con prestador; traslado y acto de cementerio vinculados si corresponde.
3. Subsidio: expediente con beneficiarios, requisitos, aprobación, orden de pago M14; JOB-SOC-03 `soc:vencimiento-subsidios` marca `expired` fuera de plazo.

### 9.4 Cementerio parque (CU-ESP-CEM)

1. Reserva de unidad (bloqueo optimista; vencimiento por JOB-SOC-04 `soc:vencer-reservas`).
2. Formalización: instrumento, titulares, pagador, obligaciones (derecho y mantenimiento como conceptos de M02/M04).
3. Solicitud de acto: validación de autorizante y documentación → turno → realización → ocupación creada o cerrada.
4. Cesión/sucesión/extinción: expediente T11 con aprobación jurídica.
5. Mora: solo cobranza M07/M08; nunca libera ocupación ni cancela derecho.

### 9.5 Banco de sangre (CU-ESP-SAN)

Solicitud → validación de convenio y vigencia → referencia al prestador → registro de respuesta → seguimiento → cierre; costo del convenio registrado como gasto (M12/M15).

### 9.6 Traslados y ambulancias

1. Solicitud (programado) o derivación (emergencia: se informa el prestador, estado `derived`).
2. Agenda: asignación de móvil apto y chofer habilitado; control de superposición.
3. Ejecución en PWA de campo: km inicial/final, tramos.
4. Cierre: cálculo de importe (cubierto o facturable), uso de vehículo, novedad de horas al chofer.

### 9.7 Plan de vivienda

1. Configuración del plan, tipologías, precios, etapas, actividades, composición de materiales; validación de configuración (RN-SOC-041).
2. Inscripción (contrato M02; HUECO-TRV-06, antes "contrato M01") → aportes mensuales: M04 consulta `billing-inputs` (% y precio) y M05 emite en comprobante exclusivo; `fac.invoice.issued` actualiza `pctBilled`; `cob.payment.confirmed` actualiza `pctPaid`; anulación revierte.
3. Adjudicación → cambia el % mínimo.
4. Construcción: asignación y reserva de materiales (M13), retiros con vale, progreso por actividad, certificados por período, aprobación y liquidación al constructor (M12/M14).
5. Entrega (comprobante configurable).
6. Cambio de plan, transferencia (caja abierta si se transfieren cuotas) o rescisión (comisión, diferencia, devolución o compensación).
7. JOB-SOC-05 `soc:actualizar-precios-vivienda`: actualización masiva con aprobación.

### 9.8 Flota

1. Alta de vehículo y chofer; documentos con vencimiento; JOB-SOC-06 `soc:vencimientos-flota` (diario) alerta y marca `unfit`.
2. Uso por OT (eventos M10) o viaje; costo por km a M15.
3. Combustible: consumidor de `cmp.supplierInvoice.registered` crea `fuelLoads` desde líneas de combustible con móvil; carga manual o desde PWA de campo; anulación libera.
4. Rendición: el chofer carga, el responsable aprueba; viáticos → M16; costos → M15.
5. JOB-SOC-07 `soc:mantenimiento-preventivo` (diario): alerta por km o fecha.

### 9.9 GPS/AVL

JOB-SOC-08 `soc:ingestar-gps` (consumidor de `int.fleet.positionsReceived` (antes `int.fleet.positions-received`), EVT-INT-17; la recepción y el sondeo del proveedor los hace T06, T11 §12.9): toma el lote de posiciones, normaliza, deduplica por unidad y hora, guarda en serie temporal; JOB-SOC-09 `soc:resumir-recorridos` (nocturno) calcula km por vehículo, día, viaje y OT y compara con km declarados. Recuperación: el adaptador de T06 reanuda desde la última marca de tiempo recibida. Si un uso de vehículo ya registrado se anula o se corrige (carga errónea, viaje u OT de origen cancelados), M18 publica `soc.vehicle.usageVoided` (EVT-SOC-17) para que M15 revierta el costo y M16 retire la novedad propuesta.

### 9.10 Otros servicios

Préstamos ortopédicos con JOB-SOC-10 `soc:vencimiento-prestamos`; retiros de dispenser validados en línea (límite diario, litros por atención, deuda a N días consultada a M08).

## 10. Pantallas

Convenciones comunes (CNX): `DataTable` con filtros, columnas configurables y exportación según permiso; fichas con pestañas; modales con motivo obligatorio para bajas, rechazos, cancelaciones y anulaciones; estados vacíos con acción sugerida; ayuda contextual enlazada al glosario; campos sensibles enmascarados sin `soc.datosSensibles.ver`. Fechas `dd-mm-yyyy`.

| ID | App | Ruta | Capability | Propósito | Layout / filtros / columnas | Acciones y modales | Estado vacío / ayuda | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|---|---|
| PAN-SOC-01 | admin | `/soc/contratos/:id/grupo` | `soc.adherentes.ver` | Grupo de cobertura de un contrato | Cabecera: titular, servicio, plan, estado. Pestañas: Adherentes (vigentes / históricos, ocultar fallecidos), Beneficiarios, Requisitos, Prestaciones usadas, Historia. Columnas: persona, vínculo, edad, alta, baja, causa, carencia, estado. | Agregar adherente (modal con validación de plan), dar de baja (causa), restaurar, cambiar categoría, imprimir ficha y notificación | "Este contrato no tiene adherentes" + "Agregar" | `Adheretes`, `Beneficiario`, `Datos_Adherentes_Baja`, `Notificacion_Adherente`, `Imprimir_FichaAdherentes` |
| PAN-SOC-02 | admin | `/soc/adherentes/revision` | `soc.adherentes.gestionar` | Bajas por condición, mayoría de edad y recategorización masiva | Filtros: servicio, plan, condición (edad, ocupación, vínculo), fecha de corte. Previsualización con motivo por adherente. | Aplicar lote, imprimir, exportar | "Ningún adherente incumple condiciones a la fecha" | `frmBajaAdherentesCondicion`, `Imprimir_BajaAdherentes_Condicion` |
| PAN-SOC-03 | admin | `/soc/config/planes` | `soc.planes.configurar` | Planes de cobertura | Lista por servicio y tipo; editor: prestaciones, elegibilidad por vínculo, carencias, topes, territorio, requisitos, convenios, vigencia. | Crear, versionar, cerrar a nuevas altas | Ayuda: "Cementerio parque no se configura aquí" | `frmRequisito_Adherentes`, categorías de servicio |
| PAN-SOC-04 | admin | `/soc/prestadores` | `soc.prestadores.gestionar` | Prestadores y convenios | Pestañas: Prestadores (tipo, habilitación, vencimiento), Convenios (vigencia, financiamiento, costo), Profesionales y especialidades, Nosocomios. En Profesionales, el nombre y el documento se leen de la persona de M01 (solo lectura, enlace a la ficha) y el alta pasa por el alta asistida de M01 (PAN-PER-04 en modo búsqueda, RF-PER-174; DEC-097). | Alta, edición, inactivación | — | `MEDICOS`, `ESPE_MED`, `GetNosocomios` |
| PAN-SOC-05 | admin | `/soc/solicitudes` | `soc.solicitudes.ver` | Bandeja de solicitudes de prestación | Filtros: tipo, estado, fecha del evento, prestador, sucursal. Columnas: número, tipo, beneficiario, fecha del evento, resultado de cobertura, estado, vencimiento. | Nueva solicitud, abrir | "Sin solicitudes pendientes" | Sin equivalente (BASE §24) |
| PAN-SOC-06 | admin | `/soc/solicitudes/:id` | `soc.solicitudes.ver` | Detalle de solicitud | Verificación de cobertura con motivos, documentación (restringida), prestador y referencia, costos, decisión, línea de tiempo. | Aprobar, rechazar (motivo), derivar excepción, registrar respuesta del prestador, cerrar | — | — |
| PAN-SOC-07 | admin | `/soc/sepelios/:id` | `soc.sepelio.gestionar` | Caso de sepelio | Fallecido, plan, prestador, servicios cubiertos y adicionales, traslado y acto de cementerio vinculados. | Coordinar, vincular traslado, crear acto, cerrar | — | `frmTitular_Fallecimiento` |
| PAN-SOC-08 | admin | `/soc/subsidios` | `soc.subsidios.crear` | Subsidios por fallecimiento | Columnas: fallecido, fecha, importe, beneficiarios, plazo, estado. | Crear, enviar a aprobación, aprobar (otro usuario), emitir pago | — | Sin equivalente |
| PAN-SOC-09 | admin | `/soc/cementerio/:cemeteryId/plano` | `soc.cementerio.ver` | Plano y catálogo de unidades | Mapa o grilla jerárquica con estado por unidad (disponible, reservada, asignada, bloqueada, niveles ocupados); búsqueda por código o difunto. | Reservar, ver derecho, ver ocupaciones | "Configure sectores y unidades" | Sin equivalente |
| PAN-SOC-10 | admin | `/soc/cementerio/derechos/:id` | `soc.derechos.gestionar` | Ficha del derecho de sepultura | Unidad, modalidad, titulares, pagador, autorizados, instrumento, obligaciones y cuenta, ocupaciones, eventos. | Formalizar, cambiar pagador, gestionar autorizados, iniciar cesión/sucesión/extinción (T11), imprimir título | — | Sin equivalente |
| PAN-SOC-11 | admin | `/soc/cementerio/actos` | `soc.actos.programar` | Agenda de actos | Calendario y lista: tipo, unidad, difunto, autorizante, permiso, estado. | Solicitar, validar documentación, programar, registrar realizado, cancelar | "Sin actos programados" | Sin equivalente |
| PAN-SOC-12 | admin | `/soc/cementerio/config` | `soc.cementerio.configurar` | Establecimientos, reglamentos, sectores y tipos de unidad | Formularios jerárquicos con importación de unidades. | Alta, versionar reglamento, importar | — | Sin equivalente |
| PAN-SOC-13 | admin | `/soc/sangre` | `soc.sangre.ver` | Banco de sangre | Pestañas: Solicitudes (estado, prestador, tiempos), Convenios, Campañas y turnos, Indicadores. Sin campos clínicos. | Nueva solicitud, registrar respuesta, crear campaña | — | Sin equivalente |
| PAN-SOC-14 | admin | `/soc/traslados` | `soc.traslados.ver` | Agenda y registro de traslados | Vista agenda por móvil; lista con filtros de RF-SOC-079. Columnas: número, fecha, pasajero (socio/no socio), origen, destino, nosocomio, móvil, chofer, km, importe, estado. | Nuevo viaje, agregar tramo, asignar móvil y chofer, cerrar, facturar, derivar | "Sin traslados en la fecha" | Herramientas > Traslados > Viajes, `clsTraslados` |
| PAN-SOC-15 | admin | `/soc/traslados/informes` | `soc.reportes.ver` | Informe general de traslados | Filtros completos y subtítulo con filtros aplicados. | Exportar | — | Traslados > Informes, `GetTraslado_General` |
| PAN-SOC-16 | admin | `/soc/autorizaciones` | `soc.autorizaciones.gestionar` | Autorizaciones de internación y prácticas | Columnas: beneficiario, prestador, ingreso, egreso, número, días, costo, estado. | Registrar, cerrar | — | Sin equivalente (DFA M25) |
| PAN-SOC-17 | admin | `/soc/vivienda/planes` | `soc.vivienda.configurar` | Planes, tipologías, precios, etapas y actividades | Árbol plan → tipología → etapas → actividades → materiales; precios con vigencia. | Crear, reordenar, actualizar precios (masivo con aprobación), validar configuración | "Configure el plan antes de inscribir" | Tablas del sistema > Viviendas, `frmViviendaActividad` |
| PAN-SOC-18 | admin | `/soc/vivienda/unidades` | `soc.vivienda.ver` | Viviendas inscriptas | Filtros: plan, tipología, estado, distrito, adjudicada. Columnas: titular, cuenta, tipología, inscripción, adjudicación, % facturado, % pagado, % avance, estado. | Abrir, adjudicar, exportar | — | `FiltrosVivienda` |
| PAN-SOC-19 | admin | `/soc/vivienda/unidades/:id` | `soc.vivienda.ver` | Ficha de la vivienda | Pestañas: Datos, Aportes, Construcción (progreso por actividad, esperado vs real), Materiales (asignados, reservados, retirados, utilizados), Certificados, Cambios y transferencias. | Registrar progreso, retirar materiales, devolver, reasignar, crear certificado, cambio de plan, transferir, rescindir, entregar | — | `Datos_Vivienda`, `frmConstruccionVivienda`, `frmBajaVivienda`, `frmConsultaCambioPlanVivienda` |
| PAN-SOC-20 | admin | `/soc/vivienda/certificados` | `soc.obra.gestionar` | Certificados de obra | Columnas: número, vivienda, proveedor, período, tipo, total, estado. | Crear, guardar, aprobar (otro usuario), liquidar, cancelar, imprimir | — | `frmConstruccionVivienda` (certificados) |
| PAN-SOC-21 | admin | `/soc/vivienda/informes` | `soc.reportes.ver` | Informes de vivienda | Selector de informe (§15) y filtros. | Generar, exportar | — | `frmInformesVivienda`, `clsInformes_Vivienda` |
| PAN-SOC-22 | admin | `/soc/flota/vehiculos` | `soc.flota.ver` | Vehículos | Columnas: dominio, descripción, tipo, propio, km actual, rendimiento real/teórico, documentos por vencer, estado. Ficha: documentos, mantenimiento, usos, combustible, GPS. | Alta, documento, mantenimiento, marcar no apto | — | `abm_Movil` |
| PAN-SOC-23 | admin | `/soc/flota/choferes` | `soc.flota.gestionar` | Choferes | Columnas: código, nombre, empleado, licencia, vencimiento. El nombre se lee de la persona de M01; el alta pasa por el alta asistida de M01 (PAN-PER-04 en modo búsqueda, RF-PER-174) y después se cargan solo los datos del rol (DEC-097). | Alta, asignar a vehículo | — | `CHOFERES` |
| PAN-SOC-24 | admin | `/soc/flota/combustible` | `soc.combustible.gestionar` | Combustibles y cargas | Pestañas: Tipos (alícuota), Cargas (vehículo, litros, km, factura, origen). | Carga manual, vincular a factura, anular | — | `abm_Combustible`, `clsCombustible` |
| PAN-SOC-25 | admin | `/soc/flota/rendiciones` | `soc.rendiciones.gestionar` | Rendiciones de viaje | Columnas: número, origen (venta, viaje, OT), fecha, km estimados/reales/GPS, flete, peajes, viáticos, total, estado. Detalle de ítems de combustible. | Crear, calcular km, enviar, aprobar (otro usuario), rechazar | — | `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`, `Estado_AbmRendicion` |
| PAN-SOC-26 | admin | `/soc/flota/gps` | `soc.gps.ver` | Recorridos GPS | Mapa de recorrido por vehículo y día; km GPS vs declarados. Sin vista pública. | Filtrar, exportar | "Sin dispositivo GPS asociado" | AVL Discar |
| PAN-SOC-27 | admin | `/soc/otros/ortopedia` | `soc.ortopedia.gestionar` | Banco ortopédico | Elementos y préstamos (vencidos resaltados). | Prestar, devolver, enviar a mantenimiento | — | Sin equivalente |
| PAN-SOC-28 | admin | `/soc/otros/dispenser` | `soc.dispenser.registrar` | Retiros de dispenser | Búsqueda de contrato; litros disponibles hoy y del mes. | Registrar retiro | — | `clsDispenser` |
| PAN-SOC-29 | admin | `/soc/config` | `soc.config.configurar` | Parámetros del módulo | Formularios por grupo de §14. | Guardar con auditoría | — | Parámetros TITULARES y VIVIENDA |
| PAN-SOC-30 | pwa-socio | `/app/mi-grupo` | `soc.mi.ver` | Mi grupo y coberturas — **Componente embebido en PAN-POR-98** de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el componente y la API; HUE-SRV-04) | Integrantes por servicio, carencias, prestaciones usadas. | Solicitar alta/baja de integrante | "No tenés servicios sociales" | Sin equivalente |
| PAN-SOC-31 | pwa-socio | `/app/solicitudes-sociales` | `soc.mi.solicitar` | Solicitudes de prestación — **Componente embebido en PAN-POR-99** de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el componente y la API; HUE-SRV-04) | Formulario por tipo (sin datos clínicos) y seguimiento de estado. Emergencias: muestra número del prestador. | Enviar solicitud, adjuntar documentos | — | Sin equivalente |
| PAN-SOC-32 | pwa-socio | `/app/cementerio` | `soc.mi.ver` | Mis derechos de sepultura — **Componente embebido en PAN-POR-100** de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el componente y la API; HUE-SRV-04) | Unidad, modalidad, obligaciones, actos programados. | Solicitar acto (queda pendiente de validación) | — | Sin equivalente |
| PAN-SOC-33 | pwa-socio | `/app/vivienda` | `soc.mi.ver` | Mi plan de vivienda — **Componente embebido en PAN-POR-101** de M19 (M19 es dueño de la ruta y la tarjeta; M18 aporta el componente y la API; HUE-SRV-04) | Tipología, % aportado, cuotas, avance de obra. | Descargar estado | — | Sin equivalente |
| PAN-SOC-34 | pwa-campo | `/app/campo/viajes` | `soc.mi.viajes.ver` | Viajes del chofer | Viajes asignados del día; checklist del vehículo; km inicial/final; carga de combustible con foto. Funciona sin conexión. | Iniciar, registrar tramo, finalizar, cargar combustible, cargar rendición | "Sin viajes asignados" | Sin equivalente |
| PAN-SOC-35 | pwa-empleado | `/app/soc/cementerio/actos` | `soc.actos.registrar` | Registro de actos en el parque | Actos del día con unidad y documentación validada. | Registrar realizado con foto de evidencia | — | Sin equivalente |

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …".

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-SOC-001 | GET | `/api/admin/soc/contracts/:id/dependents` | `soc.adherentes.ver` | Adherentes del contrato (`?asOf=`, `?includeEnded=`) | Sí |
| API-SOC-002 | POST | `/api/admin/soc/contracts/:id/dependents` | `soc.adherentes.gestionar` | Alta de adherente | Sí (Idempotency-Key) |
| API-SOC-003 | POST | `/api/admin/soc/dependents/:id/transitions` | `soc.adherentes.gestionar` | Baja, suspensión, restauración, cambio de categoría | Sí |
| API-SOC-004 | POST | `/api/admin/soc/dependents/batches` | `soc.adherentes.gestionar` | Previsualizar y aplicar lote (condición, mayoría, recategorización) | Sí (`batchId`) |
| API-SOC-005 | GET/POST/PATCH | `/api/admin/soc/contracts/:id/beneficiaries` | `soc.beneficiarios.gestionar` | Beneficiarios | Sí |
| API-SOC-006 | GET | `/api/admin/soc/contracts/:id/billing-inputs` | `soc.adherentes.ver` (antes: `soc.adherentes.ver` (servicio interno para M04)) | Endpoint HTTP que consume M04 para el cálculo; no es un servicio interno (M04 y T12 lo citan como API-SOC-006). Cantidad y perfil de adherentes, % y precio de vivienda para el período; cada entrada lleva `itemClass` (RN-SOC-056: `standard`, `guaranteeDeposit`, `subsidyFundContribution`, `burialRightAcquisition`, `burialRightMaintenance`) | Sí |
| API-SOC-007 | GET | `/api/admin/soc/persons/:personId/roles` | `soc.adherentes.ver` | ¿Es adherente o beneficiario vigente? (M01/M17) | Sí |
| API-SOC-008 | GET/POST/PATCH | `/api/admin/soc/coverage-plans` | `soc.planes.configurar` | Planes | Sí |
| API-SOC-009 | GET/POST/PATCH | `/api/admin/soc/providers` | `soc.prestadores.gestionar` | Prestadores | Sí |
| API-SOC-010 | GET/POST/PATCH | `/api/admin/soc/agreements` | `soc.convenios.gestionar` | Convenios | Sí |
| API-SOC-011 | GET/POST/PATCH | `/api/admin/soc/professionals` | `soc.profesionales.gestionar` | Profesionales y especialidades | Sí |
| API-SOC-012 | GET/POST | `/api/admin/soc/benefit-requests` | `soc.solicitudes.crear` | Solicitudes | Sí (Idempotency-Key) |
| API-SOC-013 | POST | `/api/admin/soc/benefit-requests/:id/coverage-check` | `soc.solicitudes.ver` | Verificar cobertura a la fecha del evento | Sí |
| API-SOC-014 | POST | `/api/admin/soc/benefit-requests/:id/transitions` | `soc.solicitudes.resolver` | Aprobar, rechazar, derivar, registrar respuesta, cerrar | Sí |
| API-SOC-015 | GET/POST/PATCH | `/api/admin/soc/burial-cases` | `soc.sepelio.gestionar` | Casos de sepelio | Sí |
| API-SOC-016 | GET/POST | `/api/admin/soc/death-subsidies` | `soc.subsidios.crear` | Subsidios | Sí |
| API-SOC-017 | POST | `/api/admin/soc/death-subsidies/:id/transitions` | `soc.subsidios.aprobar` | Aprobar, rechazar, pagar | Sí |
| API-SOC-018 | GET/POST/PATCH | `/api/admin/soc/cemeteries` | `soc.cementerio.configurar` | Establecimientos y reglamentos | Sí |
| API-SOC-019 | GET/POST/PATCH | `/api/admin/soc/burial-units` | `soc.cementerio.configurar` / `soc.cementerio.ver` | Unidades (importación masiva) | Sí |
| API-SOC-020 | POST | `/api/admin/soc/burial-units/:id/reserve` | `soc.derechos.gestionar` | Reservar (control de concurrencia por `version`) | Sí (Idempotency-Key) |
| API-SOC-021 | GET/POST/PATCH | `/api/admin/soc/burial-rights` | `soc.derechos.gestionar` | Derechos | Sí |
| API-SOC-022 | POST | `/api/admin/soc/burial-rights/:id/transitions` | `soc.derechos.gestionar` / `soc.derechos.aprobarCesion` / `soc.derechos.aprobarExtincion` | Formalizar, ceder, suceder, extinguir | Sí |
| API-SOC-023 | GET/POST | `/api/admin/soc/cemetery-acts` | `soc.actos.programar` | Actos | Sí |
| API-SOC-024 | POST | `/api/admin/soc/cemetery-acts/:id/transitions` | `soc.actos.registrar` | Programar, realizar, cancelar | Sí |
| API-SOC-025 | GET | `/api/admin/soc/occupancies` | `soc.cementerio.ver` | Ocupaciones y registro de inhumaciones | Sí |
| API-SOC-026 | GET/POST/PATCH | `/api/admin/soc/blood-requests` | `soc.sangre.gestionar` | Solicitudes de banco de sangre | Sí |
| API-SOC-027 | GET/POST/PATCH | `/api/admin/soc/donation-campaigns` | `soc.campanas.gestionar` | Campañas y turnos | Sí |
| API-SOC-028 | GET/POST/PATCH | `/api/admin/soc/health-authorizations` | `soc.autorizaciones.gestionar` | Autorizaciones de internación y prácticas | Sí |
| API-SOC-029 | GET/POST/PATCH | `/api/admin/soc/trips` | `soc.traslados.gestionar` | Viajes y tramos | Sí |
| API-SOC-030 | POST | `/api/admin/soc/trips/:id/transitions` | `soc.traslados.gestionar` | Programar, iniciar, completar, derivar, cancelar | Sí |
| API-SOC-031 | GET/POST/PATCH | `/api/admin/soc/trip-characteristics` | `soc.config.configurar` | Características de viaje | Sí |
| API-SOC-032 | GET/POST/PATCH | `/api/admin/soc/housing-plans` | `soc.vivienda.configurar` | Planes, tipologías, etapas, actividades, materiales | Sí |
| API-SOC-033 | POST | `/api/admin/soc/housing-plans/:id/validate` | `soc.vivienda.configurar` | Validar configuración | Sí |
| API-SOC-034 | GET/POST | `/api/admin/soc/housing-prices` | `soc.precios.actualizar` | Precios y actualización masiva (job) | Sí |
| API-SOC-035 | GET/PATCH | `/api/admin/soc/housing-units` | `soc.vivienda.gestionar` | Viviendas | Sí |
| API-SOC-036 | POST | `/api/admin/soc/housing-units/:id/transitions` | `soc.vivienda.adjudicar` / `soc.vivienda.rescindir` / `soc.vivienda.gestionar` | Adjudicar, iniciar obra, entregar, transferir, rescindir, cambiar plan | Sí |
| API-SOC-037 | GET/POST/DELETE | `/api/admin/soc/housing-units/:id/progress` | `soc.obra.gestionar` | Progreso (DELETE solo si no está certificado) | Sí |
| API-SOC-038 | GET/POST | `/api/admin/soc/housing-units/:id/materials` | `soc.materiales.gestionar` | Asignar, reservar, liberar, reasignar | Sí |
| API-SOC-039 | POST | `/api/admin/soc/housing-units/:id/withdrawals` | `soc.materiales.gestionar` | Retiro con vale y devolución | Sí (Idempotency-Key) |
| API-SOC-040 | GET/POST | `/api/admin/soc/housing-certificates` | `soc.obra.gestionar` | Certificados | Sí |
| API-SOC-041 | POST | `/api/admin/soc/housing-certificates/:id/transitions` | `soc.certificados.aprobar` | Aprobar, liquidar, cancelar | Sí |
| API-SOC-042 | GET/POST/PATCH | `/api/admin/soc/vehicles` | `soc.flota.gestionar` | Vehículos, documentos, mantenimiento | Sí |
| API-SOC-043 | GET/POST/PATCH | `/api/admin/soc/drivers` | `soc.flota.gestionar` | Choferes y asignaciones | Sí |
| API-SOC-044 | GET | `/api/admin/soc/vehicles/availability` | `soc.flota.ver` | Vehículos aptos y libres en un rango (para M10 y traslados) | Sí |
| API-SOC-045 | GET/POST | `/api/admin/soc/vehicle-usages` | `soc.flota.gestionar` | Usos | Sí |
| API-SOC-046 | GET/POST/PATCH | `/api/admin/soc/fuel-types` | `soc.combustible.gestionar` | Combustibles | Sí |
| API-SOC-047 | GET/POST | `/api/admin/soc/fuel-loads` | `soc.combustible.gestionar` | Cargas | Sí (Idempotency-Key) |
| API-SOC-048 | GET/POST/PATCH | `/api/admin/soc/trip-settlements` | `soc.rendiciones.gestionar` | Rendiciones | Sí |
| API-SOC-049 | POST | `/api/admin/soc/trip-settlements/:id/transitions` | `soc.rendiciones.aprobar` | Enviar, aprobar, rechazar | Sí |
| API-SOC-050 | GET | `/api/admin/soc/vehicles/:id/track` | `soc.gps.ver` | Recorrido (`?from=&to=`) | Sí |
| API-SOC-051 | POST | `/api/v1/ext/soc/gps/positions` | API key con scope `soc.gps.registrar` (antes `soc.gps.write`) | Ingesta de posiciones por lote (adaptador) | Sí (deduplicación unidad + hora) |
| API-SOC-052 | GET/POST | `/api/admin/soc/orthopedic-loans` | `soc.ortopedia.gestionar` | Elementos y préstamos | Sí |
| API-SOC-053 | POST | `/api/admin/soc/dispenser-withdrawals` | `soc.dispenser.registrar` | Registrar retiro con validación de límites | Sí (Idempotency-Key) |
| API-SOC-054 | GET/PUT | `/api/admin/soc/settings` | `soc.config.configurar` | Parámetros | Sí (version) |
| API-SOC-055 | GET | `/api/admin/soc/reports/:reportId` | `soc.reportes.ver` | Reportes de §15 | Sí |
| API-SOC-056 | GET | `/api/soc/me/groups` | `soc.mi.ver` | Mi grupo y coberturas | Sí |
| API-SOC-057 | POST | `/api/soc/me/requests` | `soc.mi.solicitar` | Solicitud de alta/baja de integrante, prestación o acto | Sí (Idempotency-Key) |
| API-SOC-058 | GET | `/api/soc/me/burial-rights` | `soc.mi.ver` | Mis derechos | Sí |
| API-SOC-059 | GET | `/api/soc/me/housing` | `soc.mi.ver` | Mi plan de vivienda | Sí |
| API-SOC-060 | GET/POST | `/api/soc/field/trips` | `soc.mi.viajes.ver` / `soc.viajes.registrarKm` | Viajes del chofer y registros offline | Sí (dispositivo + secuencia) |
| API-SOC-061 | GET | `/api/public/<tenantSlug>/soc/cemetery/search` | `public: true` (RF-IAM-061) (antes: público (si PRM-SOC-050 lo habilita)) | Búsqueda de difuntos: nombre y ubicación. Consumida por PAN-POR-104 de M19 (`/cementerio/buscar`, landing pública). | Sí |
| API-SOC-062 | GET/POST/PATCH | `/api/admin/soc/contracts/:id/registrations` | `soc.adherentes.ver` / `soc.adherentes.gestionar` | Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es `PATCH` con `endDate`, nunca borrado | Sí (Idempotency-Key) |

Errores RFC 9457 propios: `soc.dependent.ineligible`, `soc.dependent.duplicated`, `soc.plan.categoryNotFound`, `soc.coverage.notCovered`, `soc.coverage.waitingPeriod`, `soc.unit.notAvailable`, `soc.right.documentationPending`, `soc.act.unauthorized`, `soc.blood.pricingForbidden`, `soc.housing.secondPlan`, `soc.housing.maxContributionExceeded`, `soc.housing.exclusiveDocument`, `soc.housing.cashRegisterClosed`, `soc.housing.notConnected`, `soc.progress.over100`, `soc.vehicle.unfit`, `soc.driver.licenseExpired`, `soc.dispenser.dailyLimit`.

## 12. Eventos y jobs

### 12.1 Eventos emitidos

> **Corrección 05-11-2026 (payloads):** la columna Payload mínimo usa ahora nombres de campo en lugar de texto libre (por ejemplo `reason` en lugar de "motivo"), con los mismos nombres que la tabla de eventos de T11.

| ID | Evento | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-SOC-01 | `soc.dependent.added` / `.ended` / `.categoryChanged` / `.restored` | `dependentId`, `contractId`, `date`, `cause` | M04, M19, M17 (alerta sin servicios) |
| EVT-SOC-02 | `soc.dependent.majorityReached` | `dependentId` | T09 |
| EVT-SOC-03 | `soc.benefitRequest.decided` | `requestId`, `outcome`, `costs` | M04/M05 (cargo al socio), T09, M19 |
| EVT-SOC-04 | `soc.deathSubsidy.approved` | `caseId`, `beneficiaries`, `amounts` | M14, M15 (asiento del subsidio) |
| EVT-SOC-05 | `soc.burialRight.formalized` / `.holderChanged` / `.extinguished` | `rightId` | M02 (contrato de mantenimiento; HUECO-TRV-06, antes M01), M04, M15 (ingreso por el derecho, RN-CON-124), M19 |
| EVT-SOC-06 | `soc.cemeteryAct.performed` | `actId`, `type`, `unit` | M05 (cargo del acto), M19, M04 (cargo por acto, disparador `social_act`, RF-TAR-117), T09 (aviso) |
| EVT-SOC-07 | `soc.trip.completed` | tripId, km, importe, cubierto, `characteristicCode`, `memberStatus` (asociado / no asociado), `originalTripId` (viaje multitramo, RF-SOC-075) — campos agregados para el cargo por traslado de M04 (RN-TAR-249) | M04/M05, M15 |
| EVT-SOC-08 | `soc.housing.allocated` / `.delivered` / `.terminated` / `.transferred` / `.planChanged` | `unitId` | M04, M05, M07, M19 |
| EVT-SOC-09 | `soc.housing.materialWithdrawn` / `.materialReturned` | `withdrawalId`, `items` | M13, M15 |
| EVT-SOC-10 | `soc.housing.certificateLiquidated` | `certificateId`, `supplierId`, `total` | M12, M14, M15 |
| EVT-SOC-11 | `soc.housing.priceUpdated` | `planId`, `category`, `date` | M04 |
| EVT-SOC-12 | `soc.vehicle.usageRecorded` | `usageId`, `vehicleId`, `driverId`, `km`, `hours`, `cost`, `workOrderId` | M15, M10, M16 (novedades de flota) |
| EVT-SOC-13 | `soc.vehicle.unfit` / `.fit` | `vehicleId`, `reason` | M10 |
| EVT-SOC-14 | `soc.tripSettlement.approved` | `settlementId`, `allowances`, `costs` | M16, M15 |
| EVT-SOC-15 | `soc.driver.timeReported` | `driverId`, `hours`, `period` | M16 |
| EVT-SOC-16 | `soc.agreementCost.recorded` | `agreementId`, `period`, `amount` | M12, M15 |
| EVT-SOC-17 | `soc.vehicle.usageVoided` | `usageId`, `vehicleId`, `reason`, `voidedBy`, `replacedByUsageId` (opcional) | M15 (reversa de costo), M16 (retira la novedad de flota propuesta), M10 |

### 12.2 Eventos consumidos

| Evento | Origen | Efecto |
|---|---|---|
| `cat.contract.activated` (EVT-CAT-09) | M02 | Alta automática (RF-SOC-029), adherente titular. |
| `cat.contract.suspended` / `.reactivated` / `.transferred` / `.terminated` (EVT-CAT-10/12/17/15) | M02 | RN-SOC-008 a RN-SOC-013 (la desconexión por mora llega como `cat.contract.suspended`; M18 usa `contractId`, `reason`, `mode` y `effectiveAt` del payload, y el motivo de mora se lee de `reason`). |
| `per.person.deceased` | M01 | Baja de adherente con causa `death`; tarea si es titular; alerta en planes de vivienda y derechos de sepultura. |
| Evento de cobertura social de M08 (RN-MOR-143; suspensión y restablecimiento de la cobertura por mora, nombre e ID a cargo de M08) | M08 | Registra la condición con fecha en el contrato; RF-SOC-032 la evalúa y, al restablecerse, inicia la carencia de rehabilitación (RN-SOC-054, PRM-SOC-052). |
| `fac.invoice.issued` / `fac.invoice.annulled` (EVT-FAC-07/08) | M05 | `pctBilled` de vivienda; aportes. |
| `cob.payment.confirmed` (EVT-COB-04) / `cob.receipt.voided` (EVT-COB-05) | M07 | `pctPaid` de vivienda. |
| `cmp.supplierInvoice.registered` / `.voided` (EVT-CMP-08/09) | M12 | Cargas de combustible; progreso con factura del proveedor de vivienda. |
| `stk.materials.consumed` / `stk.goods.received` (EVT-STK-02/01) | M13 | Confirma retiros (consumo) y liberaciones (reingreso). |
| `tec.workOrder.statusChanged` / `tec.workOrder.closed` (EVT-TEC-05/07) | M10 | Usos de vehículo (asignación y cierre de la OT). |
| `ven.salesOrder.confirmed` (EVT-VEN-07, con flete) | M11 | Rendición en borrador. |
| `tes.paymentExecution.executed` (EVT-TES-15) | M14 | Subsidio/certificado pagado. |
| `int.fleet.positionsReceived` (antes `int.fleet.positions-received`) (EVT-INT-17) | T06 | JOB-SOC-08 normaliza y guarda las posiciones GPS. |
| `wfl.approval.decided` | T11 | Avanza transiciones con aprobación. |
| `ins.membership.exited` (EVT-INS-06) | M17 | Con `associateMembershipId`, `cause` y `effectiveDate` del payload (antes `membershipId`), registra con fecha efectiva que el titular dejó de ser asociado y abre una tarea de revisión de elegibilidad para los beneficios que exigen esa condición (coberturas, convenios con aporte del asociado, `memberStatus` de traslados); no da de baja adherentes, derechos de sepultura ni planes de vivienda en forma automática. Consumo declarado en T11 §12 (corrección de cierre 05-11-2026, Asumida DEC-072). |

Nota de alias (T11 §12.4 y §12.4.1): los nombres usados antes en este anexo quedan como alias en `eventTypes.aliases` y no se usan en suscripciones nuevas: `per.serviceContract.*` → `cat.contract.*` (productor M02; `disconnected` → `suspended`, `reconnected` → `reactivated`); `per.relationship.changed` → `per.relationship.granted` / `.revoked` / `.expired` (EVT-PER-18; CNC-WFL-127, el candidato sugerido por T11 no aplica porque el vínculo familiar es una relación de M01); `fac.invoice.voided` → `fac.invoice.annulled`; `cob.payment.reversed` → `cob.receipt.voided`; `cmp.purchaseInvoice.posted` → `cmp.supplierInvoice.registered`; `stk.movement.posted` → `stk.materials.consumed` / `stk.goods.received`; `tec.workOrder.assigned` → `tec.workOrder.statusChanged`; `ven.salesDocument.issued` → `ven.salesOrder.confirmed`; `tes.paymentOrder.paid` → `tes.paymentExecution.executed`. Nombres que otros anexos usan para eventos de M18: `soc.dependent.cameOfAge` → `soc.dependent.majorityReached` (EVT-SOC-02); `soc.vehicleUsage.closed` → `soc.vehicle.usageRecorded` (EVT-SOC-12); `soc.vehicleUsage.voided` → `soc.vehicle.usageVoided` (EVT-SOC-17, agregado para cerrar la brecha de T11 §12.4). El comando de envío a T09 es `com.communications.emit` (API-COM-75); `com.messages.send` es alias del mismo endpoint (CTR-COM-10).

Los identificadores `soc.act.unauthorized`, `soc.housing.cashRegisterClosed` y `soc.driver.licenseExpired` son **códigos de error RFC 9457** de §11, no tipos de evento; las entradas CNC-WFL-128 a CNC-WFL-130 de T11 §12.4.1 no requieren alias ni evento nuevo.

### 12.3 Jobs

| ID | Cola / nombre | Disparo | Reintentos | Cancelación / recuperación |
|---|---|---|---|---|
| JOB-SOC-01 | `soc:mayoria-edad` | Cron diario 05:00 (America/Argentina/Cordoba) | 3 | Idempotente por adherente y fecha. Dueño único de la detección de mayoría de edad (T11 §12.9): reemplaza a JOB-PER-05 y JOB-CAT-07; publica EVT-SOC-02 y T09 envía el aviso. |
| JOB-SOC-02 | `soc:revision-condiciones` | Manual / mensual | 3 | Lote reanudable por `batchId`. |
| JOB-SOC-03 | `soc:vencimiento-subsidios` | Cron diario | 3 | Sin efecto económico. |
| JOB-SOC-04 | `soc:vencer-reservas` | Cron horario | 3 | Libera solo reservas vencidas. |
| JOB-SOC-05 | `soc:actualizar-precios-vivienda` | API-SOC-034 tras aprobación | 3 | Por tipología; idempotente por `batchId`. |
| JOB-SOC-06 | `soc:vencimientos-flota` | Cron diario | 3 | Marca `unfit` y notifica. |
| JOB-SOC-07 | `soc:mantenimiento-preventivo` | Cron diario | 3 | Solo alerta. |
| JOB-SOC-08 | `soc:ingestar-gps` | Por evento `int.fleet.positionsReceived` (antes `int.fleet.positions-received`) (EVT-INT-17) | 5 con backoff | Convertido en consumidor (T11 §12.9): el sondeo cada PRM-SOC-051 minutos y el webhook los ejecuta T06 (JOB-INT-24); idempotente por dispositivo y marca de tiempo. |
| JOB-SOC-09 | `soc:resumir-recorridos` | Cron nocturno | 3 | Recalculable por día. |
| JOB-SOC-10 | `soc:vencimiento-prestamos` | Cron diario | 3 | Marca `overdue` y notifica. |
| JOB-SOC-11 | `soc:costo-convenios` | Cron mensual | 3 | Genera registro de costo por convenio y período; idempotente. |

## 13. Integraciones

| Integración | Tipo (T06) | Uso | Notas |
|---|---|---|---|
| Proveedor GPS/AVL | Adaptador (pull REST o webhook) | Posiciones de móviles | Primer adaptador según piloto (Discar como candidato, PA-SOC-07); credenciales en bóveda de T06, nunca en parámetros. |
| Red de banco de sangre | Manual / correo / adaptador futuro | Derivación y respuesta de solicitudes | Sin intercambio de datos clínicos. |
| Prestadores (empresas fúnebres, ambulancias, nosocomios) | Manual / portal / correo | Referencias y conformidades | Registro de referencia externa. |
| Autoridad de policía mortuoria | Manual | Permisos de actos | Número y documento de permiso. |
| Mensajería T09 | Interna | Mayoría de edad, turnos, vencimientos, estados de solicitudes | Plantillas por tenant. |
| Mapas | Interna (componente CNX) | Plano del parque y recorridos | Teselas configurables por tenant. |
| Ítems facturables (M05) | Interna | `fac.service.upsertBillableItem` en `billableItems` | Los cargos que origina M18 (traslados RF-SOC-080, actos de cementerio, derechos de sepultura RF-SOC-055 con la clase de RN-SOC-056, cargos al socio de beneficios, cuotas de vivienda) se crean como ítems facturables de M05, idempotentes por id de origen; M04 solo valoriza cuando corresponde. No se usan `preloadedCharges` de M04 (antes "vía M04/M05"). |

## 14. Parámetros

Ámbitos: `tenant`, `servicio` (por servicio del catálogo M02), `plan` (plan de cobertura o de vivienda), `establecimiento` (cementerio). Todos versionados con auditoría (T04).

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-SOC-001 | `soc.dependents.requireHolder` | Bool | servicio | true | Exigir adherente titular. | 109 (inverso) |
| PRM-SOC-002 | `soc.dependents.allowDuplicateInService` | Bool | servicio | false | Permitir el mismo adherente dos veces en un servicio. | 2400 |
| PRM-SOC-003 | `soc.dependents.offerRemoveFromOtherHolder` | Bool | servicio | true | Ofrecer baja del vínculo en otro titular. | 2521 |
| PRM-SOC-004 | `soc.dependents.onDisconnection` | Enum `suspend`/`end` | servicio | `suspend` | Efecto de la desconexión del contrato. | — (RN-06 §4) |
| PRM-SOC-005 | `soc.dependents.askOnReconnection` | Bool | servicio | true | Consultar alta de adherentes al reconectar. | 2401 |
| PRM-SOC-006 | `soc.reconnection.allowDeceasedHolder` | Bool | tenant | false | Reconexión con titular fallecido (consultado por M01/M10). | 2301 |
| PRM-SOC-007 | `soc.dependents.hideDeceasedInFile` | Bool | tenant | true | Ocultar adherentes fallecidos en la ficha. | 3058 |
| PRM-SOC-008 | `soc.dependents.debtControl` | Enum `off`/`warn`/`block` | servicio | `warn` | Control de deuda al dar altas. | 2545 |
| PRM-SOC-009 | `soc.dependents.majorityAge` | Int | plan | 21 | Edad de corte (PA-SOC-04). | — (`Get_Adherentes_MayoriaEdad`) |
| PRM-SOC-010 | `soc.dependents.majorityNotify` | Bool | tenant | true | Avisar mayoría de edad. | 3186 |
| PRM-SOC-011 | `soc.dependents.majorityNotifyRecipients` | Lista de correos/roles | tenant | rol responsable | Destinatarios del aviso. | 3187 |
| PRM-SOC-012 | `soc.dependents.onServiceTransfer` | Enum `end`/`keep` | servicio | `end` | Tratamiento en transferencia (la opción "eliminar" no existe). | 2291 |
| PRM-SOC-013 | `soc.coverage.defaultWaitingPeriodDays` | Int | plan | 0 | Carencia por defecto (PA-SOC-11). | — |
| PRM-SOC-014 | `soc.cemetery.reservationDays` | Int | establecimiento | 7 | Vencimiento de reservas. | — |
| PRM-SOC-015 | `soc.subsidy.claimDeadlineDays` | Int | plan | 180 | Plazo de reclamo del subsidio. | — |
| PRM-SOC-016 | `soc.cemetery.actRequiredDocuments` | Lista por tipo de acto | establecimiento | permiso municipal + certificado de defunción (inhumación) | Documentación previa obligatoria. | — |
| PRM-SOC-017 | `soc.donation.donorAgeRange` | Objeto { min, max } | tenant | { 18, 65 } | Filtro informativo de campañas. | 2527 |
| PRM-SOC-018 | `soc.housing.minContributionAfterAllocationPct` | Decimal | tenant | — | Fallback general del % mínimo después de adjudicar. | 635 |
| PRM-SOC-019 | `soc.housing.minEventualPayment` | Decimal | tenant | — | Mínimo en factura eventual y fallback antes de adjudicar. | 634 |
| PRM-SOC-020 | `soc.housing.maxAnnualAdvance` | Decimal | plan | — | Máximo a adelantar por año. | 636 |
| PRM-SOC-021 | `soc.housing.installmentDocumentTypeId` | Ref M05 | tenant | — | Tipo de comprobante exclusivo de cuotas. | 639 |
| PRM-SOC-022 | `soc.housing.withdrawalVoucherTypeId` | Ref M05/M13 | tenant | — | Comprobante de retiro de materiales. | 755 |
| PRM-SOC-023 | `soc.housing.defaultWorkId` | Ref obra M15 | tenant | — | Obra por defecto para contabilizar vales. | 2670 |
| PRM-SOC-024 | `soc.housing.allowAboveMaxContribution` | Bool | plan | false | Aporte superior al máximo. | 2569 |
| PRM-SOC-025 | `soc.housing.terminationCommissionConceptId` | Ref M02 | tenant | — | Concepto de comisión por baja. | 413 |
| PRM-SOC-026 | `soc.housing.terminationCommissionPct` | Decimal | plan | — | % de comisión por baja. | 414 |
| PRM-SOC-027 | `soc.housing.terminationDifferenceConceptId` | Ref M02 | tenant | — | Concepto por diferencia en rescisión. | 3137 |
| PRM-SOC-028 | `soc.housing.supplierCategoryId` | Ref M12 | tenant | — | Rubro de proveedores de vivienda. | 2502 |
| PRM-SOC-029 | `soc.housing.constructionProductCategoryId` | Ref M02 | tenant | — | Rubro de productos de construcción. | 2503 |
| PRM-SOC-030 | `soc.housing.trustFundOverdueMonths` | Int | plan | — | Meses adeudados para fondo fiduciario (PA-SOC-08). | 637 |
| PRM-SOC-031 | `soc.housing.eventualBillingConceptId` | Ref M02 | tenant | — | Concepto de facturación eventual. | 638 |
| PRM-SOC-032 | `soc.housing.constructionSettlementConceptId` | Ref M02 | tenant | — | Concepto de liquidación por construcción. | 2276 |
| PRM-SOC-033 | `soc.fleet.documentExpiryAlertDays` | Int | tenant | 30 | Anticipación de alertas; al vencer, vehículo `unfit`. | — |
| PRM-SOC-034 | `soc.housing.deliveryDocumentTypeId` | Ref M05 | tenant | — | Comprobante de entrega. | 2628 |
| PRM-SOC-035 | `soc.gps.retentionDays` | Int | tenant | 365 | Retención de posiciones GPS. El TTL de la colección *time series* es único (`expireAfterSeconds` = máximo de plataforma); un plazo menor por tenant lo aplica un job de purga por `meta.tenantId` (CTR-DAT-55 de T05). | — |
| PRM-SOC-036 | `soc.dispenser.serviceId` | Ref M02 | tenant | — | Servicio del dispenser. | 2581 |
| PRM-SOC-037 | `soc.dispenser.dailyLimitLiters` | Decimal | servicio | — | Límite diario. | 2582 |
| PRM-SOC-038 | `soc.dispenser.debtDays` | Int | servicio | — | Días para cálculo de deuda. | 2583 |
| PRM-SOC-039 | `soc.dispenser.litersPerAttention` | Decimal | servicio | — | Litros por atención. | 2584 |
| PRM-SOC-040 | `soc.housing.terminationDocumentTypeId` | Ref M05 | tenant | — | Comprobante a generar en bajas. | 415 |
| PRM-SOC-041 | `soc.housing.transferTemplateId` | Ref plantilla | tenant | — | Texto de transferencias. | 417 |
| PRM-SOC-042 | `soc.housing.terminationTemplateId` | Ref plantilla | tenant | — | Texto de bajas. | 418 |
| PRM-SOC-043 | `soc.housing.planChangeTemplateId` | Ref plantilla | tenant | — | Texto de cambios de plan. | 419 |
| PRM-SOC-044 | `soc.electricVehicle.enabled` | Bool | tenant | false | Registración de vehículos eléctricos. | 75 (VAR_PMOVIL) |
| PRM-SOC-045 | `soc.settlement.kmDeviationPct` | Decimal | tenant | 15 | Desvío km reales vs estimados/GPS para revisión. | — |
| PRM-SOC-046 | `soc.fleet.fuelEfficiencyDeviationPct` | Decimal | tenant | 20 | Desvío de rendimiento real vs teórico. | — |
| PRM-SOC-047 | `soc.fleet.preventiveServiceKm` | Int | tenant | 10000 | Intervalo de service por defecto. | — |
| PRM-SOC-048 | `soc.transport.emergencyReferral` | Objeto { prestador, teléfono, texto } | tenant | — | Derivación de emergencias. | — |
| PRM-SOC-049 | `soc.transport.overlapPolicy` | Enum `warn`/`block` | tenant | `warn` | Superposición de móvil o chofer. | — |
| PRM-SOC-050 | `soc.cemetery.publicSearchEnabled` | Bool | establecimiento | false | Búsqueda pública de difuntos. | — |
| PRM-SOC-051 | `soc.gps.pollMinutes` | Int | tenant | 5 | Frecuencia de ingesta GPS. | — |
| PRM-SOC-052 | `soc.coverage.rehabilitationWaitingDays` | Int | plan | 30 (default propuesto; antes 0) | Carencia de rehabilitación (días) tras regularizar una cobertura suspendida por mora; evaluada en RF-SOC-032 (RN-SOC-054, HUECO-SEP-01). 0 = sin carencia. **Requiere validación legal** contra el reglamento del servicio social de cada cooperativa (resolución final de HUECO-SEP-01; los meses impagos para suspender son PRM-MOR-204 de M08). | — |

## 15. Reportes

Todos con fecha de corte (AGR-022), universo declarado y sin datos sensibles salvo permiso.

| ID | Reporte | Universo | Fórmula / contenido | Fecha de corte |
|---|---|---|---|---|
| REP-SOC-01 | Adherentes por servicio | Adherentes vigentes | Conteo por servicio, plan, vínculo, tramo de edad y estado. | `asOf` |
| REP-SOC-02 | Mayoría de edad y bajas por condición | Adherentes vigentes | Lista con fecha en que cumplen la edad o incumplen condición. | `asOf` |
| REP-SOC-03 | Cantidades para facturación | Contratos con adherentes | Por contrato: adherentes facturables = vigentes al último día − exentos (primeros N). | Período |
| REP-SOC-04 | Solicitudes y tiempos | Solicitudes del período | Por tipo y estado; tiempo de gestión = cierre − solicitud (mediana y percentil 90). | Período |
| REP-SOC-05 | Prestaciones utilizadas vs topes | Grupos | Usadas / tope por prestación. | Período |
| REP-SOC-06 | Costos de convenios y prestadores | Convenios | Σ costos por convenio y período; costo por beneficiario = costo / beneficiarios vigentes. | Período |
| REP-SOC-07 | Disponibilidad del cementerio | Unidades | Por tipo: disponibles, reservadas, asignadas, niveles ocupados / capacidad. | `asOf` |
| REP-SOC-08 | Registro de inhumaciones | Actos realizados | En orden cronológico con unidad y permiso. | Período |
| REP-SOC-09 | Registro de titulares | Derechos activos | Titular, unidad, modalidad, vigencia. | `asOf` |
| REP-SOC-10 | Deuda de cementerio | Derechos con obligaciones | Saldo por derecho (M07); no implica acción sobre el derecho. | `asOf` |
| REP-SOC-11 | Informe general de traslados | Viajes | Filtros de RF-SOC-079; km y importes; viajes multitramo consolidados. | Período |
| REP-SOC-12 | Aporte teórico vs facturado (vivienda) | Viviendas | Aporte teórico = meses desde `theoreticalContributionDate` × % mínimo; desvío = teórico − facturado. | `asOf` |
| REP-SOC-13 | Estado de aportes y del plan (completo y simple) | Viviendas | % facturado, % pagado, deuda, estado. | `asOf` |
| REP-SOC-14 | Composición de tipología | Tipología | Materiales por actividad y costo. | Fecha |
| REP-SOC-15 | Resumen de construcción y desviación | Viviendas en obra | % real ponderado por costo de actividad vs % esperado a la fecha. | `asOf` |
| REP-SOC-16 | Materiales asignados, retirados y utilizados | Viviendas | Por producto; costo de vales por obra. | Período |
| REP-SOC-17 | Cambio de plan | Vivienda | Aporte facturado, nuevo aporte, diferencia. | Fecha |
| REP-SOC-18 | Costos de flota | Vehículos | Combustible + mantenimiento + seguros + amortización (M13) por vehículo; costo/km. | Período |
| REP-SOC-19 | Rendimiento de combustible | Vehículos | km recorridos / litros cargados vs `expectedKmPerLiter`. | Período |
| REP-SOC-20 | Vencimientos de flota | Documentos y licencias | Vencidos y por vencer. | `asOf` |
| REP-SOC-21 | Rendiciones | Rendiciones | Totales por tipo, km estimados/reales/GPS, desvíos. | Período |
| REP-SOC-22 | Préstamos ortopédicos | Préstamos | Activos, vencidos, perdidos. | `asOf` |
| REP-SOC-23 | Retiros de dispenser | Retiros | Litros por contrato, excedente mensual = Σ litros − (litros por atención × atenciones permitidas). | Período |

## 16. Casos de uso

| ID | Nombre | Actor | Flujo principal | Alternativos / excepciones | RF |
|---|---|---|---|---|---|
| CU-24 (BASE) | Autorizar prestación social | Operador de servicios sociales | Identifica beneficiario y fecha → verifica cobertura → registra autorización y prestador o deriva excepción. | Beneficiario no incorporado a la fecha del evento: revisión, sin cambio retroactivo. | RF-SOC-031 a RF-SOC-037 |
| CU-ESP-CEM (BASE) | Reservar parcela e inhumar | Administrador de cementerio | Reserva PAR-DEMO-001 → instrumento → obligaciones → solicitud de inhumación de un fallecido distinto del titular → validación → turno → registro. | Cambio de pagador: no elimina ocupación ni transfiere derecho. | RF-SOC-049 a RF-SOC-058 |
| CU-ESP-SAN (BASE) | Acreditar cobertura de banco de sangre | Operador de banco de sangre | Valida convenio y vigencia → tramita referencia → registra respuesta y seguimiento. | Convenio financiado por la cooperativa: no se factura al paciente. | RF-SOC-065 a RF-SOC-073 |
| CU-SOC-01 | Agregar un hijo al grupo de sepelio | Operador / asociado PWA | Carga persona y vínculo → valida edad y requisitos → alta con carencia → M04 suma un adherente en el próximo período. | Edad fuera de rango: rechazo con motivo; ya adherente en otro titular: ofrece baja allí. | RF-SOC-011 a RF-SOC-013 |
| CU-SOC-02 | Procesar mayoría de edad | Sistema + responsable | JOB-SOC-01 detecta → aviso → previsualización → baja o recategorización por lote. | Adherente con discapacidad: excluido. | RF-SOC-015 a RF-SOC-018 |
| CU-SOC-03 | Desconexión y reconexión con adherentes | Sistema | Desconexión suspende adherentes → reconexión consulta restauración. | Titular fallecido: no reconecta salvo PRM-SOC-006. | RF-SOC-019, RF-SOC-020 |
| CU-SOC-04 | Gestionar sepelio con inhumación en el parque | Operador | Caso → prestador → traslado → acto de inhumación → cierre → adicionales facturados. | Fallecimiento fuera de alcance territorial: excepción. | RF-SOC-039 a RF-SOC-043 |
| CU-SOC-05 | Pagar subsidio por fallecimiento | Operador + responsable | Expediente → beneficiarios → aprobación → orden de pago. | Fuera de plazo: `expired`. | RF-SOC-044 a RF-SOC-046 |
| CU-SOC-06 | Ceder un derecho de sepultura | Administrador + jurídico | Solicitud → documentación → aprobación jurídica → nuevo titular. | Sin aprobación: sin cambios. | RF-SOC-059 |
| CU-SOC-07 | Programar un traslado a diálisis | Operador de traslados | Solicitud → verificación de cobertura y tope → asignación de móvil apto y chofer → ejecución en PWA → cierre e importe. | Emergencia: derivación al prestador. | RF-SOC-074 a RF-SOC-084 |
| CU-SOC-08 | Facturar cuota de vivienda | Sistema (M04/M05) | M04 consulta % y precio → M05 emite comprobante exclusivo → M18 actualiza % facturado → pago actualiza % pagado. | Aporte superior al máximo: rechazo salvo PRM-SOC-024. | RF-SOC-086, RF-SOC-091 a RF-SOC-096 |
| CU-SOC-09 | Certificar avance de obra | Técnico + responsable | Progreso por actividades → certificado → aprobación por otro usuario → liquidación al constructor. | Progreso > 100 %: rechazo. | RF-SOC-097 a RF-SOC-104 |
| CU-SOC-10 | Retirar materiales para una vivienda | Operador de vivienda | Vale con ítems → movimiento de stock → costo a la obra. | Cantidad mayor a asignada: requiere autorización. | RF-SOC-100 a RF-SOC-102 |
| CU-SOC-11 | Rescindir un plan de vivienda | Responsable de planes | Valida plan conectado → calcula comisión y diferencia → aprobación → comprobante → devolución o compensación. | Plan no conectado: rechazo. | RF-SOC-108 |
| CU-SOC-12 | Registrar carga de combustible desde factura | Sistema / compras | Factura con líneas de combustible y móvil → `fuelLoads` → rendimiento. | Anulación de factura: libera cargas. | RF-SOC-124 a RF-SOC-126 |
| CU-SOC-13 | Rendir un viaje de flete | Chofer + responsable | Carga km reales, peajes, viáticos y combustible → envía → aprobación → novedades M16 y costos M15. | Desvío de km: revisión. | RF-SOC-128 a RF-SOC-131, RF-SOC-136 |
| CU-SOC-14 | Consultar recorrido GPS de una OT | Responsable de flota | Selecciona vehículo y fecha → recorrido y km GPS vs declarados. | Sin dispositivo: aviso. | RF-SOC-132 a RF-SOC-135 |
| CU-SOC-15 | Prestar una silla de ruedas | Personal de ortopedia | Préstamo con plazo y depósito → devolución → mantenimiento. | Vencido: aviso al asociado. | RF-SOC-113 |

## 17. Criterios de aceptación y escenarios

| ID | Escenario | Dado / Cuando / Entonces |
|---|---|---|
| ESC-SOC-01 | Cobertura a la fecha del evento | Dado un adherente con alta 10-10-2026 y evento 05-10-2026, cuando se verifica, entonces el resultado es `review` con motivo "no incorporado a la fecha del evento". |
| ESC-SOC-02 | Carencia | Dada carencia de 90 días y alta 01-09-2026, cuando hay un sepelio el 15-10-2026, entonces el resultado es `notCovered` con motivo carencia y opción de excepción. |
| ESC-SOC-03 | Baja por edad con discapacidad | Dado un hijo de 22 años con discapacidad acreditada, cuando corre la revisión de condiciones, entonces no aparece en la lista. |
| ESC-SOC-04 | Transferencia sin borrado | Dado PRM-SOC-012 = `end`, cuando se transfiere el servicio, entonces los adherentes quedan `ended` con causa `transfer` y siguen consultables. |
| ESC-SOC-05 | Mora de cementerio | Dado un derecho con mantenimiento impago, cuando se ejecuta la mora, entonces no se crea orden de corte de otros servicios ni cambia el derecho o la ocupación. |
| ESC-SOC-06 | Cambio de pagador | Dado un derecho con ocupación, cuando cambia el pagador, entonces titular y ocupación no cambian (criterio de aceptación 93). |
| ESC-SOC-07 | Reserva concurrente | Dadas dos reservas simultáneas de la misma parcela, cuando se confirman, entonces una se rechaza con `soc.unit.notAvailable`. |
| ESC-SOC-08 | Acto sin autorización | Dada una inhumación solicitada por un tercero no autorizado, cuando se intenta registrar como realizada, entonces se rechaza con `soc.act.unauthorized`. |
| ESC-SOC-09 | Banco de sangre sin precio | Dado un convenio financiado por la cooperativa, cuando se cierra una solicitud, entonces no se genera comprobante al paciente y se registra el costo del convenio (criterio de aceptación 94). |
| ESC-SOC-10 | Sin datos clínicos | Dado el formulario de solicitud de sangre, cuando se inspecciona el modelo, entonces no existen campos de grupo sanguíneo, diagnóstico ni compatibilidad. |
| ESC-SOC-11 | Permiso negativo por área | Dado un supervisor de agua, cuando consulta solicitudes de banco de sangre, entonces recibe 403 y no aparecen en búsquedas (AGR-008). |
| ESC-SOC-12 | Permiso negativo sensible | Dado un operador sin `soc.datosSensibles.ver`, cuando abre un traslado, entonces el motivo aparece enmascarado y no se exporta. |
| ESC-SOC-13 | Separación de tareas | Dado el técnico que cargó el progreso, cuando intenta aprobar el certificado, entonces se rechaza. |
| ESC-SOC-14 | Aislamiento de tenant | Dado un usuario del tenant A, cuando consulta un viaje del tenant B, entonces recibe 404. |
| ESC-SOC-15 | Cuota de vivienda | Dado precio ARS 40.000.000, adjudicada, `MINIMO_DA` 1 % y 99,5 % facturado, cuando M04 calcula, entonces el aporte es 0,5 % = ARS 200.000. |
| ESC-SOC-16 | Anulación de cuota | Dada una cuota de 1 % anulada, cuando M05 publica `fac.invoice.annulled`, entonces `pctBilled` baja 1 punto. |
| ESC-SOC-17 | Segundo plan | Dada una cuenta con plan de vivienda, cuando se inscribe otro, entonces se rechaza con `soc.housing.secondPlan`. |
| ESC-SOC-18 | Vehículo no apto | Dado un vehículo con seguro vencido, cuando M10 lo asigna a una OT, entonces recibe `soc.vehicle.unfit`. |
| ESC-SOC-19 | GPS idempotente | Dadas posiciones repetidas por el adaptador, cuando se ingieren, entonces se guarda una por unidad y hora. |
| ESC-SOC-20 | Reintento de lote | Dado JOB-SOC-02 interrumpido, cuando se reanuda, entonces no repite bajas ya aplicadas. |
| ESC-SOC-21 | Conciliación de combustible | Dada una factura de combustible anulada en M12, cuando llega el evento, entonces las cargas vinculadas quedan `voided` y el rendimiento se recalcula. |
| ESC-SOC-22 | Emergencia | Dada una solicitud de traslado marcada emergencia, cuando se registra, entonces queda `derived` y muestra la derivación de PRM-SOC-048, sin agenda. |
| ESC-SOC-23 | ESC-01 a ESC-05 (BASE §102.6) | Reintentos y duplicados de pago (ESC-01, ESC-04) no duplican el % pagado de vivienda ni las obligaciones de cementerio; los demás escenarios aplican en lo que afecten eventos consumidos por M18. |
| ESC-SOC-24 | Carencia de rehabilitación (HUECO-SEP-01) | Dado un contrato de sepelio con cobertura suspendida por mora y rehabilitada el 01-10-2026, con PRM-SOC-052 = 30, cuando se solicita el sepelio por un evento del 15-10-2026, entonces la solicitud queda `inReview` con motivo "carencia de rehabilitación"; para un evento del 05-11-2026 la cobertura se verifica normalmente; un traslado urgente del 15-10-2026 no se evalúa contra la carencia. |
| ESC-SOC-25 | Aporte de sangre impago (HUECO-SAN-02) | Dado un convenio de banco de sangre con modalidad aporte del socio y un aporte impago con la antigüedad de PRM-MOR-205, cuando corre la evaluación de mora, entonces se crea una única tarea de revisión para el Responsable de servicios sociales, la cobertura sigue vigente y una solicitud de sangre de ese socio se tramita sin bloqueo. |

## 18. Precarga ficticia

Datos inventados; ningún dato real de la DEMO.

| Elemento | Datos |
|---|---|
| Servicio social y plan | SOC-FAM "Familiar" (BASE §24): sepelio y traslados programados; abono ilustrativo ARS 8.000 por grupo y mes (cálculo en M04); hijos hasta 21 años; carencia 90 días; 2 traslados por año. |
| Grupo | GRU-001 / FAM-DEMO-001: titular "Ana Demo" y dos beneficiarios ficticios (hijo de 12 años e hija de 20 años, esta última próxima a mayoría de edad). |
| Cementerio | Establecimiento "Parque Demo" con reglamento v1; sector A, manzana 1, filas 1–3, 30 parcelas de 3 niveles; parcela PAR-DEMO-001 reservada; tipo de unidad Parcela; conceptos CEM-PAR de derecho, mantenimiento e inhumación **sin importe** precargado. |
| Banco de sangre | Convenio CONV-SAN-DEMO con red ficticia, financiado por la cooperativa (concepto SAN-CONV ARS 0); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001 en estado "En gestión con prestador". Sin datos clínicos. |
| Traslados | Nosocomios "Hospital Demo Norte" y "Clínica Demo Sur"; características Programado, Alta, Diálisis y No sanitario (`NON_MEDICAL`, RF-SOC-147); ambulancia AMB-01 dominio ficticio AA000AA; chofer CHO-01 "Chofer Demo"; 2 viajes completados (uno multitramo). |
| Vivienda | Plan "Plan Demo 2026", tipología "Dúplex 2D" precio ARS 40.000.000 desde 01-03-2026; 3 etapas (Fundaciones, Mampostería, Techos) con 6 actividades; 2 viviendas inscriptas (una adjudicada con 12 % aportado y 20 % de avance). |
| Flota | 3 vehículos (ambulancia, camioneta, camión grúa), 2 choferes, cargas de combustible del último mes, 1 rendición aprobada, posiciones GPS ficticias de un día. |
| Otros | 2 sillas de ruedas y 1 andador en el banco ortopédico, 1 préstamo vigente. |

## 19. Migración

| Origen ProCoop | Destino | Transformación | Conciliación |
|---|---|---|---|
| `ADHSOC` | `serviceDependents` + `dependentEvents` | `FEC_BAJ` nulo → `active`; con fecha → `ended` (causa inferida o `unknown`); personas → M01; `COD_VIN` → vínculo de M01. | Adherentes vigentes por contrato = ProCoop al corte; cantidad facturable del último período coincide. |
| `BENSOC` | `serviceBeneficiaries` (destino único, HUECO-SEP-02) | `ACTIVO` → estado; `COD_CSE` → `legacy.codCse` (código compuesto del servicio, no causa); `COD_PER` → persona de M01; `COD_VIN` → vínculo de M01; `ID_SERSOC` → contrato de M02. Ninguna fila se deriva a M04: la tarifa social migra desde la categoría social y la segmentación (RN-MIG-054 de T07). Texto original reemplazado: "`COD_CSE` → causa. Los registros usados como 'tarifa social' se derivan a M04 (CTR-SOC-03)". | Beneficiarios vigentes por contrato = ProCoop al corte. |
| `TAR_ADHE`, `HIS_TAR_ADHE` | M04 | Tarifas por adherente; M18 solo valida coherencia de categorías. | — |
| `AMBULANC`, `AMBUMED`, `AMBUCARACTE`, `MEDICOS`, `ESPE_MED` | `transportTrips`, `tripLegs`, `tripCharacteristics`, `medicalProfessionals`, `medicalSpecialties` | `COD_AMB_ORIG` → `parentTripId`; `CAUSA` → `reasonText` cifrado; nosocomios y empresas → `careProviders`. `MEDICOS`: T07 vincula cada profesional a una persona existente o la crea con las reglas de unificación del padrón (DEC-097); `DES_MED` no se copia a la ficha. Como `MEDICOS` no trae documento, la persona nueva queda `documentPending` (DEC-099, M01). | Viajes y km por año; profesionales sin `personId` = 0. |
| `PLANESVIV`, `CATE_SER_EXTRAS` (`VIV_*`), `PRECIOSVIV` | `housingPlans`, `housingPrices` | Tipologías por categoría. | Precio vigente por tipología. |
| `VIVIENDAS` | `housingUnits` | Fechas y flags; `pctBilled` recalculado desde ítems subtipo 27 de facturas migradas. | % facturado por vivienda = ProCoop. |
| `VIV_ETAPA`, `VIV_ACTIVIDAD`, `VIV_MATACT` | `housingStages`, `housingActivities`, `housingActivityMaterials` | Directo. | — |
| `VIV_PROGRESO`, `VIV_PROGMAT` | `housingProgress`, `housingProgressMaterials` | `ID_IVACOM` → factura migrada en M12; `ID_CERT` → certificado. | % de avance por vivienda. |
| `VIV_MAT`, `VIV_RETM`, `VIV_RET_IT` | `housingMaterialAllocations`, `housingMaterialWithdrawals` | `COD_MOV` → movimiento migrado en M13. | Cantidades retiradas por producto = stock histórico. |
| `MOVIL`, `CHOFERES` | `fleetVehicles`, `drivers` | `NOM_AVL` → `gpsDevices`. `CHOFERES`: T07 vincula cada chofer a una persona existente (por ejemplo, el empleado de `SU_EMPLEADOS`) o la crea con las reglas de unificación del padrón (DEC-097); `DES_CHO` no se copia a la ficha. Como `CHOFERES` no trae documento, la persona nueva queda `documentPending` (DEC-099, M01). | Conteo; choferes sin `personId` = 0. |
| `COMBUSTIBLES`, `IVACOM_COMBUSTIBLES` | `fuelTypes`, `fuelLoads` | `ID_IVACOM` → factura M12. | Litros por vehículo y año. |
| `COMP_VEN_RENDICION`, `_ITEMS` | `tripSettlements` | `ID_COMPV` → venta M11 (`source.kind = salesDocument`, CTR-DAT-53). | Totales por año. |
| `AVL_REG` | `gpsPositions` | Solo los últimos PRM-SOC-035 días. | Conteo por día. |
| `INTERNAC` | No migra a M18 (telefonía, M10/M04) | — | — |
| `MAQUINAS` | No migra a M18 (equipos vendidos/reparación, M11/M13) | — | — |
| Cementerio | Plantillas TPL-MIG-CEM-01 a TPL-MIG-CEM-05 de T07 §19.33 vía `ExcelImportWizard` (RF-MIG-099, HUECO-CEM-03) | Unidades, derechos, titulares, autorizados y ocupaciones, en ese orden (no hay tablas ProCoop relevadas). | Conciliación por unidad de T07 §19.33: niveles ocupados ≤ capacidad, un derecho vigente por unidad, ocupación sin derecho → incidencia; validación con el registro físico del parque. |
| Ortopedia y dispenser | `SERSOC_PRODUCTOS` (préstamos registrados como productos del servicio, T07 §19.1) y plantillas TPL-MIG-OTR-01 a TPL-MIG-OTR-03 de T07 §19.33 (HUECO-OTR-01) | Elementos y préstamos activos; retiros de dispenser solo del mes en curso, desde `CONS_SER` del servicio de dispenser (PRM-SOC-036, V2 2581): ProCoop registra cada retiro como consumo del `SERSOC` (fecha y litros), resuelto con el relevamiento de `clsDispenser` (HUECO-OTR-01). | Elementos prestados = préstamos activos; litros del mes por contrato. |
| Registraciones del contrato | `contractRegistrations` desde los `SERSOC` de servicios con tipo de registración "vehículo eléctrico" (RN-06 §3.3; V2 75) o planilla del tenant (HUECO-OTR-05) | Resuelto con el relevamiento del código: ProCoop no tiene tabla propia; ese tipo de registración solo habilita el campo de medidor del servicio, así que el identificador del vehículo está en `SERSOC.NUM_MED`. Se carga en `vehicle.plate` con `type = electricVehicle` y marca, modelo y potencia vacíos para completar en la ficha; si el valor no tiene formato de dominio, va a `description` con advertencia. Texto anterior: "[VERIFICAR] en el diccionario dónde guarda ProCoop el dato del vehículo; si no hay tabla, se usa planilla." | Registraciones activas por contrato. |

## 20. Contraposiciones

| ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-SOC-01 | DFA M25 vs CAT §12 | DFA lista `INTERNAC` como internaciones; CAT la define como llamadas internacionales. | `INTERNAC` va a telefonía; las internaciones se modelan nuevas (`healthAuthorizations`). | CAT > DFA en estructura |
| CTR-SOC-02 | DFA M23 vs CAT §13 | DFA ubica `MAQUINAS` en flota; CAT la describe como equipos vendidos o en reparación. | Vehículos = `MOVIL`; `MAQUINAS` a M11/M13. | CAT > DFA |
| CTR-SOC-03 | CAT `BENSOC` ("beneficios, ej. tarifa social") vs RN-06 §10 (beneficiarios) | Doble uso de la tabla. | **Corregida por HUECO-SEP-02**: el diccionario de la tabla (persona, vínculo, servicio, fechas, `ACTIVO`) y el código relevado (`BENSOC` se graba y se desconecta junto con `ADHSOC`; `AMBULANC.COD_BEN` la referencia) muestran que solo registra beneficiarios-persona. Destino único: `serviceBeneficiaries` de M18. La tarifa social no sale de `BENSOC` sino de la categoría social y la segmentación (M02/M04). Resolución original reemplazada: "Beneficiarios en M18; beneficios tarifarios en M04". | Código y diccionario > descripción del catálogo |
| CTR-SOC-04 | DFA M23 (traslados) vs RN-10 (viajes de ambulancia) | Dos nombres para el mismo registro. | Una sola colección `transportTrips` con `kind`. | Unificación |
| CTR-SOC-05 | BASE §24 (sin historia clínica) vs CAT `AMBULANC.CAUSA`, `MEDICOS` | ProCoop guarda motivo libre y médico. | Motivo como categoría + texto restringido y cifrado; profesional como dato administrativo. | BASE > CAT |
| CTR-SOC-06 | BASE §92 (no asumir urgencias) vs DFA (ambulancias) | Ambulancias sugieren emergencias. | Traslados programados y derivación de emergencias (PA-SOC-02). | BASE > DFA |
| CTR-SOC-07 | BASE §24 vs modelo de cobertura | Cementerio no es plan familiar. | Dominio propio de cementerio. | BASE |
| CTR-SOC-08 | RN-06 §7 (V2 2291 "Eliminar al transferir") vs AGR-003 | Borrado de adherentes. | Baja con causa `transfer`. | AGR > RN |
| CTR-SOC-09 | MER-015 (flota por OT y costo) vs ProCoop (flota de ambulancia y fletes) | Alcances distintos. | Modelo de flota unificado para OT, traslados y fletes. | BASE > RN |
| CTR-SOC-10 | RN-01 tipo 17 (obras incluye vivienda) vs RN-06 `TIP_REG = 11` | Vivienda como obra o como plan. | Planes de vivienda en M18; obras y contribución por mejoras (MER-009) en M10/M04. | Separación de dominios |
| CTR-SOC-11 | V2 2527 (edades de donante en `abm_Personas`) vs BASE §91 | Validación de aptitud en la ficha de persona. | Solo filtro informativo de campañas en M18. | BASE > RN |
| CTR-SOC-12 | Terminología ProCoop (adherente/beneficiario) vs BASE §24 (beneficiarios) | BASE usa "beneficiario" para todo integrante. | Dos términos con diccionario (§3). | BASE §65 (diccionario) |
| CTR-SOC-13 | M18 (vehículos) vs M13 (bienes de uso) | Propiedad del vehículo. | M18 dueño operativo; M13/M15 dueño patrimonial (`fixedAssetId`). | Separación de dominios |
| CTR-SOC-14 | AVL Discar (proceso batch modo 5) vs T06/T08 | Integración por línea de comandos. | Adaptador T06 (recepción y EVT-INT-17); JOB-SOC-08 consume el evento. | Convenciones > RN |
| CTR-SOC-15 | RN-01 §7 (precio vigente a hoy) vs AGR-022 (fecha de corte) | Precio tomado a la fecha de ejecución. | Precio vigente a la fecha del período facturado. | AGR > RN |
| CTR-SOC-16 | CAT `CHOFERES` y `MEDICOS` (nombre propio) y §7 anterior (`medicalProfessionals.personId` opcional, `name` en ambas fichas) vs RN-PER-001 (M01) y DEC-097 | Choferes y médicos tenían identidad propia; un empleado chofer o un médico socio quedaba en dos fichas. | `personId` obligatorio con alta asistida de M01; nombre y documento se leen de la persona; las fichas guardan solo datos del rol (RF-SOC-007, RF-SOC-119, §7.2, §7.7, PAN-SOC-04, PAN-SOC-23, §19). | DEC-097 > CAT |

## 21. Preguntas abiertas

### PA-SOC-01 — Alcance de internaciones y salud

**Pregunta:** ¿La cooperativa gestiona internaciones o prácticas médicas por convenio?
**Contexto:** DFA M25 menciona internaciones, pero `INTERNAC` es telefonía; BASE §24 excluye la historia clínica.
**Opciones:**
- A) **(Recomendada)** Registro administrativo de autorizaciones por convenio (prestador, fechas, número, costo), sin datos clínicos.
- B) No incluir internaciones.
- C) Módulo clínico separado con revisión especializada.
**Impacto si no se responde:** se aplica A como extensión deshabilitada.
**Bloquea:** RF-SOC-081, PAN-SOC-16.

### PA-SOC-02 — Ambulancias: emergencias o traslados programados

**Pregunta:** ¿El servicio de ambulancia cubre emergencias o solo traslados programados?
**Contexto:** BASE §92 indica no asumir urgencias; ProCoop registra viajes de ambulancia.
**Opciones:**
- A) **(Recomendada)** Traslados programados y registro administrativo de viajes; emergencias derivadas al prestador habilitado (`derived`).
- B) Despacho de emergencias propio: requiere habilitación y otro sistema.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-074, RF-SOC-082.

### PA-SOC-03 — Datos del banco de sangre

**Pregunta:** ¿Qué datos de donantes o pacientes se guardan?
**Contexto:** BASE §91 limita a datos estrictamente necesarios; V2 2527 valida edades de donante.
**Opciones:**
- A) **(Recomendada)** Solo datos administrativos (persona, contacto, referencia del prestador); sin grupo sanguíneo, diagnóstico ni aptitud.
- B) Guardar grupo sanguíneo con consentimiento: aumenta riesgo y obligaciones.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-069, RF-SOC-070.

### PA-SOC-04 — Edad de corte de adherentes

**Pregunta:** ¿Qué edad de corte rige para hijos y otros vínculos?
**Contexto:** ProCoop usa 21 años fijos.
**Opciones:**
- A) **(Recomendada)** Configurable por plan y vínculo, con 21 por defecto y extensión por estudio o discapacidad.
- B) 18 años para todos.
- C) 21 fijo como ProCoop.
**Impacto si no se responde:** se aplica A con 21.
**Bloquea:** RF-SOC-017, JOB-SOC-01.

### PA-SOC-05 — Modalidad jurídica del cementerio

**Pregunta:** ¿El cementerio encuadra en los arts. 2103 a 2113 del CCyC o en una concesión municipal u otra modalidad?
**Contexto:** BASE §90 exige verificarlo.
**Opciones:**
- A) **(Recomendada)** Configurable por establecimiento; los derechos referencian el reglamento vigente.
- B) Asumir cementerio privado del CCyC.
**Impacto si no se responde:** se aplica A con revisión legal pendiente.
**Bloquea:** RF-SOC-049, RF-SOC-053.

### PA-SOC-06 — Cesión, devolución y extinción de derechos de sepultura

**Pregunta:** ¿Qué operaciones admite el reglamento: cesión, sucesión, devolución, extinción por abandono?
**Contexto:** BASE §90: no prometer baja por botón; la mora no autoriza disponer de restos.
**Opciones:**
- A) **(Recomendada)** Trámites con workflow T11 y aprobación jurídica; nunca automáticos por mora.
- B) Solo cesión y sucesión.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-059, CU-SOC-06.

### PA-SOC-07 — Proveedor GPS/AVL

**Pregunta:** ¿Qué proveedor de seguimiento satelital usa el piloto?
**Contexto:** ProCoop integra AVL de Discar por proceso batch.
**Opciones:**
- A) **(Recomendada)** Adaptador genérico T06 (webhook o pull) con Discar como primer adaptador si el piloto lo usa.
- B) Sin GPS en el alcance inicial.
**Impacto si no se responde:** se entrega el adaptador genérico sin conector concreto.
**Bloquea:** RF-SOC-132 a RF-SOC-134.

### PA-SOC-08 — Fondo fiduciario de vivienda

**Pregunta:** ¿Se usa el control de meses adeudados para fondo fiduciario (V2 637)?
**Contexto:** Parámetro sin lectura relevada en el código.
**Opciones:**
- A) **(Recomendada)** Regla de mora configurable por plan, desactivada por defecto.
- B) Descartar.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-111.

### PA-SOC-09 — Actualización del precio de la vivienda

**Pregunta:** ¿Cómo se actualiza el valor de la tipología?
**Contexto:** ProCoop usa precios con fecha y actualización masiva por plan/etapa.
**Opciones:**
- A) **(Recomendada)** Precio vigente por tipología con actualización masiva manual o por índice (por ejemplo, costo de la construcción) con aprobación.
- B) Solo carga manual.
**Impacto si no se responde:** se aplica A sin índice automático.
**Bloquea:** RF-SOC-087.

### PA-SOC-10 — Subsidio por fallecimiento

**Pregunta:** ¿El subsidio se paga con fondo propio o por un seguro de terceros?
**Contexto:** BASE §92: no es automáticamente un seguro.
**Opciones:**
- A) **(Recomendada)** Configurable por plan; por defecto fondo propio por reglamento aprobado con pago por M14.
- B) Siempre seguro de terceros (M18 solo registra el siniestro).
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-044.

### PA-SOC-11 — Carencias de sepelio

**Pregunta:** ¿Qué carencias aplican y desde cuándo se cuentan?
**Contexto:** BASE §92 pide relevar carencias.
**Opciones:**
- A) **(Recomendada)** Carencia configurable por plan, contada desde el alta de cada adherente, con excepción autorizada.
- B) Sin carencias.
**Impacto si no se responde:** se aplica A con 0 días.
**Bloquea:** RF-SOC-005.

### PA-SOC-12 — Rendiciones de viaje

**Pregunta:** ¿Las rendiciones se usan solo para fletes de ventas o también para traslados y OT?
**Contexto:** ProCoop vincula la rendición a un comprobante de venta.
**Opciones:**
- A) **(Recomendada)** Rendición genérica de M18 vinculable a venta, viaje u OT.
- B) Solo fletes de ventas (M11).
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-128, RF-SOC-131.

### PA-SOC-13 — Comprobante exclusivo de vivienda

**Pregunta:** ¿Las cuotas de vivienda van en comprobante propio?
**Contexto:** ProCoop lo impone (V2 639); MER-010 favorece documentos propios para conceptos ajenos al servicio.
**Opciones:**
- A) **(Recomendada)** Replicar comprobante exclusivo configurable.
- B) Incluir en la factura de servicios.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-094.

### PA-SOC-14 — Ola de adherentes

**Pregunta:** ¿La cooperativa piloto factura servicios con tarifa por cantidad de adherentes desde el inicio?
**Contexto:** M04 (O4) necesita la cantidad de adherentes para los tipos de cálculo 9 a 13.
**Opciones:**
- A) **(Recomendada)** Registro de adherentes y `billing-inputs` en O4; el resto de M18 en O10.
- B) Todo en O10 con cantidades migradas como dato fijo hasta entonces.
**Impacto si no se responde:** se planifica A.
**Bloquea:** RF-SOC-011, RF-SOC-026, plan de olas.
**Estado:** Respondida (DEC-071): opción A. Adherentes y sus entradas a facturar (`billing-inputs`) en O4; el resto de M18 en O10.

### PA-SOC-15 — Uso real de planes de vivienda y ambulancias

**Pregunta:** ¿El piloto usa planes de vivienda y traslados de ambulancia?
**Contexto:** DFA (línea 1269) y RN-10 (§16.5) piden validar uso; DEC-007 los mantiene en alcance.
**Opciones:**
- A) **(Recomendada)** Especificar completo y habilitar por tenant; priorizar dentro de O10 según uso real.
- B) Diferir a una ola posterior a O10.
**Impacto si no se responde:** se aplica A.
**Bloquea:** Priorización de §5.7 y §5.8.

### PA-SOC-16 — Referencia al artículo de stock en vivienda (PA 20 del pendiente de cierre)

**Pregunta:** ¿Cómo se llama el campo que referencia al artículo de M13 en tipologías y materiales de vivienda?
**Contexto:** el anexo usaba `productId` (de `COD_PRO`) y T05 lo nombra `inventoryItemId`, apuntando a `inventoryItems` (M13).
**Opciones:**
- A) **(Recomendada)** `inventoryItemId`, como T05 y M13.
- B) Mantener `productId`.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7 (`housingPlans`, `housingActivityMaterials`, `housingProgressMaterials`, `housingMaterialAllocations`, `housingMaterialWithdrawals`).
**Estado:** Asumida la recomendada (DEC-072). Renombrado con la nota "antes `productId`".

### PA-SOC-17 — API-SOC-006: endpoint HTTP o servicio interno (PA 21 del pendiente de cierre)

**Pregunta:** ¿Los insumos de facturación de servicios sociales (API-SOC-006) son un endpoint HTTP o un servicio interno?
**Contexto:** M04 y T12 la citan como API-SOC-006; el anexo la describía como servicio interno para M04.
**Opciones:**
- A) **(Recomendada)** Endpoint HTTP `GET /api/admin/soc/contracts/:id/billing-inputs` que consume M04, con capability `soc.adherentes.ver`.
- B) Servicio interno sin ruta HTTP.
**Impacto si no se responde:** se aplica A.
**Bloquea:** API-SOC-006; cálculo de M04.
**Estado:** Asumida la recomendada (DEC-072); API-SOC-006 ya figura como endpoint HTTP en §11.

### PA-SOC-18 — Estados de convenios, campañas de donación y planes de vivienda (PA 19 del pendiente de cierre)

**Pregunta:** ¿Se confirman los estados de `providerAgreements`, `donationCampaigns` y `housingPlans`?
**Contexto:** el §7 declaraba `status` sin valores; la corrección del 05-11-2026 propuso valores con `[VERIFICAR]` para convenios y campañas (§8.1.6, §8.1.7), y `housingPlans` no tenía valores.
**Opciones:**
- A) **(Recomendada)** Confirmar §8.1.6 y §8.1.7 y agregar §8.1.8 (`draft`, `active`, `closed`) para planes de vivienda.
- B) Derivar el estado de las fechas de vigencia sin campo `status`.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §8.1.6 a §8.1.8.
**Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de esas secciones.

### PA-SOC-19 - Residuales del 05-11-2026 (estados, referencias, nombres de campo y evento GPS)

**Pregunta:** ¿Cómo se cierran los residuales de M18 que detectaron los entregables regenerados?
**Contexto:** el índice de estados marcó sin estado inicial a la mayoría de las máquinas de la tabla general del §8, cuatro estados sin origen y siete colecciones con valores sin transiciones; el modelo entidad-relación dejó referencias sin destino; T05 declara campos clave (`documentRefId`, `supplierId`, `invoiceId`, `vatRateId`, `supplierInvoiceId`, `meta`) que este §7 no tenía o llamaba distinto; el evento GPS de T06 tenía guion.
**Opciones:**
- A) **(Recomendada)** §8.2 con estado inicial, orígenes y transiciones faltantes; vínculos → `enumerationItems` (T04); tarifa asignada → `tariffCategoryRates` (M04); plantillas → `documentTemplates` (T11); lotes y códigos externos marcados como "no es referencia"; nombres de T05 con "antes"; consumir `int.fleet.positionsReceived` (EVT-INT-17; alias en T11 §12.4).
- B) Mantener el texto y resolver en los entregables.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7, §8, §12.
**Estado:** Asumida la recomendada (DEC-072). Las transiciones nuevas de `housingMaterialAllocations` y `housingContributions` deben validarse con el responsable de planes de vivienda; T06 §12 todavía publica `int.fleet.positions-received` y debe adoptar el nombre nuevo.
**Sincronización (5-11-2026), Asumida (DEC-072):** `fuelTypes.vatRateId` se tipa ObjectId (antes Enum) y el resumen del §7 usa el nombre de T05 (PA-DAT-04); T06 §12 ya publica `int.fleet.positionsReceived` (EVT-INT-17).

## 22. Trazabilidad

### 22.1 BASE y acuerdos

| Fuente | Cobertura |
|---|---|
| BASE §24 + CU-24 + precarga GRU-001/SOC-FAM | RF-SOC-001 a RF-SOC-038; CU-24; §18 |
| BASE §25 (portal) | RF-SOC-030, RF-SOC-038, RF-SOC-143; PAN-SOC-30 a PAN-SOC-33 |
| BASE §33 (Unidad y derecho de sepultura, Convenio de cobertura, Beneficio y regla tarifaria) | §7.2, §7.4; CTR-SOC-03 |
| BASE §65 (diccionario) | RF-SOC-009; §3 |
| BASE §73 ("En camino") | RF-SOC-135 |
| BASE §90 + CU-ESP-CEM | RF-SOC-049 a RF-SOC-064; RN-SOC-023 a RN-SOC-027; PA-SOC-05, PA-SOC-06 |
| BASE §91 + CU-ESP-SAN + Ley 22990 | RF-SOC-065 a RF-SOC-073; RN-SOC-028, RN-SOC-029; PA-SOC-03 |
| BASE §92 (otros servicios: sepelio, subsidio, traslados, banco ortopédico; confirmados) | RF-SOC-002, RF-SOC-010, RF-SOC-039 a RF-SOC-048, RF-SOC-082, RF-SOC-084, RF-SOC-113, RF-SOC-117, RF-SOC-127 |
| BASE §93 (reglas transversales) y ESP-001 a ESP-006 | RF-SOC-002, RF-SOC-010, RF-SOC-117; §14 |
| BASE §95 (insumos y pendientes de cementerio y banco de sangre) | PA-SOC-03, PA-SOC-05, PA-SOC-06 |
| BASE §97.1 (datos sensibles) | RF-SOC-037, RF-SOC-069, RF-SOC-139 |
| BASE §100 (matriz) / MER-009 | §5.8; CTR-SOC-10 |
| BASE §100 / MER-015 | §5.10; CTR-SOC-09 |
| MER-010 | PA-SOC-13 |
| BASE §101 (pendientes) | §21 |
| BASE §102.6 (ESC-01 a ESC-05) | ESC-SOC-23 |
| BASE §104.3 (SUE-003) | RF-SOC-136 |
| BASE §105 / §106 | Encabezado |
| Criterios de aceptación 93 y 94 | ESC-SOC-06, ESC-SOC-09 |
| Catálogo de precarga (SOC-FAM, CEM-PAR, SAN-CONV) | §18 |
| AGR-003, AGR-010, AGR-022 | §8, RF-SOC-140, RF-SOC-142, §15, CTR-SOC-15 |
| AGR-007 (representaciones, fallecimiento, grupo familiar) | RF-SOC-020, RF-SOC-054 |
| AGR-008 (separación; supervisor de agua) | §4, ESC-SOC-11 |
| AGR-030 (IA sin decisiones clínicas) | RF-SOC-073, RF-SOC-082, RF-SOC-144 |
| AGR-033 (privacidad; registro de inhumación) | RF-SOC-058, RF-SOC-139 |
| DEC-007 | PA-SOC-15 |
| DFA M23 (traslados y flota) | §5.7, §5.10; CTR-SOC-02, CTR-SOC-04 |
| DFA M25 (vivienda, ambulancias, médicos, internaciones) y línea 1269 | §5.7, §5.8; CTR-SOC-01; PA-SOC-01, PA-SOC-15 |

### 22.2 Reglas de negocio ProCoop

| Fuente | Cobertura |
|---|---|
| RN-06 §3.3 (tipos de registración) | RF-SOC-002, RF-SOC-048, RF-SOC-088, RF-SOC-115, RF-SOC-116 |
| RN-06 §3.5 (`ALTASEAU`) | RF-SOC-029, RN-SOC-016 |
| RN-06 §4 (desconexión) | RF-SOC-019, RN-SOC-008 |
| RN-06 §5 (bajas) | RF-SOC-014 |
| RN-06 §7 (transferencias, adherentes, vivienda) | RF-SOC-022, RF-SOC-107, RN-SOC-013; CTR-SOC-08 |
| RN-06 §10 (adherentes: condición, bajas, recategorización, mayoría, fallecimiento) | RF-SOC-011 a RF-SOC-021; RN-SOC-001 a RN-SOC-012 |
| RN-06 vivienda (`ValidarViviendaFecAdj`, `ValidarComprobanteNoVivienda`, `Validar_Transferncia`, `Validar_BajaPlan`) | RF-SOC-089, RF-SOC-090, RF-SOC-094, RF-SOC-107, RF-SOC-108; RN-SOC-036 a RN-SOC-039 |
| RN-01 §7 (cuota de vivienda, `GetPreciosVivienda`) | RF-SOC-086, RF-SOC-091; RN-SOC-032, RN-SOC-033; CTR-SOC-15 |
| RN-01 §9 (servicios con adherentes, tipos 9 a 13, `TAR_ADHE`, `COBRAEXCEDENTE`, `CAT_AUTO`) | RF-SOC-016, RF-SOC-026; RN-SOC-003, RN-SOC-017 a RN-SOC-019 |
| RN-01 tipo 17 (obras) | CTR-SOC-10 |
| RN-02 (anulación de vivienda) | RF-SOC-096, RN-SOC-042 |
| RN-05 (`CobranzaCuotaVivienda`) | RF-SOC-095 |
| RN-07 (reconexión con titular fallecido; vivienda) | RF-SOC-020, RF-SOC-109; RN-SOC-010, RN-SOC-047 |
| RN-08 (vales, rubros, operación vivienda, combustible por factura, actualización masiva de precios) | RF-SOC-087, RF-SOC-101, RF-SOC-102, RF-SOC-125; RN-SOC-043, RN-SOC-044, RN-SOC-048 |
| RN-10 (AVL Discar modo 5; `GetTraslado_General`; `GetViaje`; `clsTraslados`) | RF-SOC-075, RF-SOC-076, RF-SOC-079, RF-SOC-132; RN-SOC-030, RN-SOC-031, RN-SOC-049; CTR-SOC-14 |

### 22.3 Tablas CAT

| Tabla | Destino |
|---|---|
| `ADHSOC` | `serviceDependents` |
| `BENSOC` | `serviceBeneficiaries` (CTR-SOC-03) |
| `VINCULOS` | M01 (referenciada) |
| `TAR_ADHE`, `HIS_TAR_ADHE` | M04 (datos desde API-SOC-006) |
| `CATE_SER_EXTRAS` (`VIV_*`) | `housingPlans.typologies` |
| `PLANESVIV` | `housingPlans` |
| `PRECIOSVIV` | `housingPrices` |
| `VIVIENDAS` | `housingUnits` |
| `VIV_ETAPA` | `housingStages` |
| `VIV_ACTIVIDAD` | `housingActivities` |
| `VIV_MATACT` | `housingActivityMaterials` |
| `VIV_PROGRESO` | `housingProgress` |
| `VIV_PROGMAT` | `housingProgressMaterials` |
| `VIV_MAT` | `housingMaterialAllocations` |
| `VIV_RETM`, `VIV_RET_IT` | `housingMaterialWithdrawals` |
| `AMBULANC` | `transportTrips`, `tripLegs` |
| `AMBUMED` | `transportTrips.professionalIds` |
| `AMBUCARACTE` | `tripCharacteristics` |
| `MEDICOS`, `ESPE_MED` | `medicalProfessionals` (con `personId` obligatorio en M01, DEC-097; CTR-SOC-16), `medicalSpecialties` |
| `INTERNAC` | No asignada a M18: telefonía (CTR-SOC-01) |
| `MOVIL` | `fleetVehicles`, `gpsDevices` |
| `CHOFERES` | `drivers` (con `personId` obligatorio en M01, DEC-097; CTR-SOC-16) |
| `AVL_REG` | `gpsPositions` |
| `COMBUSTIBLES` | `fuelTypes` |
| `IVACOM_COMBUSTIBLES` | `fuelLoads` |
| `COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS` | `tripSettlements` |
| `MAQUINAS` | No asignada a M18: M11/M13 (CTR-SOC-02) |

### 22.4 Parámetros V2

| V2 | Destino | V2 | Destino |
|---|---|---|---|
| 75 (VAR_PMOVIL) | PRM-SOC-044 | 2401 | PRM-SOC-005 |
| 109 | PRM-SOC-001 | 2502 | PRM-SOC-028 |
| 413 | PRM-SOC-025 | 2503 | PRM-SOC-029 |
| 414 | PRM-SOC-026 | 2521 | PRM-SOC-003 |
| 415 | PRM-SOC-040 | 2527 | PRM-SOC-017 |
| 417 | PRM-SOC-041 | 2545 | PRM-SOC-008 |
| 418 | PRM-SOC-042 | 2569 | PRM-SOC-024 |
| 419 | PRM-SOC-043 | 2571 | RN-SOC-015 (PRM-INS-013 en M17) |
| 634 | PRM-SOC-019 | 2581 | PRM-SOC-036 |
| 635 | PRM-SOC-018 | 2582 | PRM-SOC-037 |
| 636 | PRM-SOC-020 | 2583 | PRM-SOC-038 |
| 637 | PRM-SOC-030 | 2584 | PRM-SOC-039 |
| 638 | PRM-SOC-031 | 2628 | PRM-SOC-034 |
| 639 | PRM-SOC-021 | 2670 | PRM-SOC-023 |
| 755 | PRM-SOC-022 | 3058 | PRM-SOC-007 |
| 2276 | PRM-SOC-032 | 3137 | PRM-SOC-027 |
| 2291 | PRM-SOC-012 | 3186 | PRM-SOC-010 |
| 2301 | PRM-SOC-006 | 3187 | PRM-SOC-011 |
| 2400 | PRM-SOC-002 | — | — |

### 22.5 Inventario de pantallas y clases ProCoop

| Elemento INV | Destino |
|---|---|
| `Adheretes`, `Beneficiario`, `Datos_Adherentes_Baja`, `Notificacion_Adherente`, `NotificacionesAdherentes`, `AdherenteRequest`, `Adherentes`, `AdherentesServicio`, `Imprimir_FichaAdherentes`, `abm_Socios.ImprimirFichaAdherentes` | PAN-SOC-01 |
| `frmBajaAdherentesCondicion`, `Imprimir_BajaAdherentes_Condicion` | PAN-SOC-02 |
| `frmRequisito_Adherentes` | PAN-SOC-03 |
| `Informe_Adherentes`, `GetCantidad_Adherentes` | REP-SOC-01, REP-SOC-03 |
| `frmTitular_Fallecimiento` (`btnAddViaje`), `Persona_Fallecidos` | PAN-SOC-07, RF-SOC-020, RF-SOC-083 |
| `Datos_Vivienda`, `frmConstruccionVivienda`, `frmBajaVivienda`, `frmConsultaCambioPlanVivienda`, `abm_Socios.ImprimirConsultaCambioPlanVivienda` | PAN-SOC-19, PAN-SOC-20 |
| `frmViviendaActividad`, Tablas del sistema > Viviendas | PAN-SOC-17 |
| `frmInformesVivienda`, `clsInformes_Vivienda`, `FiltrosVivienda`, `InfoMaterialVivienda` | PAN-SOC-21, REP-SOC-12 a REP-SOC-17 |
| `clsViviendas` (todos los métodos relevados) | RF-SOC-085 a RF-SOC-112 |
| `frmCobranza_Vivienda`, `frmCobranza.FacturarCuotaVivienda` | RF-SOC-095 |
| `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`, `Estado_AbmRendicion`, `clsComprobanteRendicion` | PAN-SOC-25 |
| `abm_Combustible`, `clsCombustible` | PAN-SOC-24 |
| `abm_Movil`, `InfoVehiculo` | PAN-SOC-22 |
| Herramientas > Traslados (Viajes, Informes), `clsTraslados`, `clsInformes_Traslados` | PAN-SOC-14, PAN-SOC-15 |
| `clsDispenser` | PAN-SOC-28 |

### 22.6 Checklist

- [x] 22 secciones de la plantilla.
- [x] Todas las tablas CAT asignadas mapeadas o derivadas con justificación (22.3).
- [x] Todos los parámetros asignados con destino (22.4).
- [x] Todas las reglas RN asignadas con decisión (§6, 22.2).
- [x] Requisitos BASE con RF o PA (22.1).
- [x] Contraposiciones con regla de prevalencia (§20).
- [x] Preguntas abiertas con opción recomendada (§21).
- [x] Sin código ni datos personales reales.
