# M10 TEC — Técnica, campo, agenda, instalación, GIS/redes, obras, aprovisionamiento TIC y telefonía

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (operación técnica, redes, obras) / CRM (OT derivada de reclamos, visitas) / Landing-autogestión (reserva y seguimiento de visita) / APIs (aprovisionamiento e importación de CDR) |
| Olas | **O3** (factibilidad, presupuesto de conexión, agenda y visitas, OT núcleo, instalación integral, cuadrillas y recursos, app de campo offline, aprovisionamiento de Internet, geolocalización operativa, inventario mínimo de nodos/equipos ISP) · **O6** (ejecución de cortes y reconexiones integrados con mora y aprovisionamiento) · **O7** (GIS de red eléctrica y genérica, mantenimiento e infraestructura, análisis de impacto, obras y contribución por mejoras, inspecciones y consumo no registrado, necesidades de materiales de mantenimiento, exportaciones GIS) · **O10** (telefonía: red física, numeración, líneas, importación de CDR de 20+ centrales, CPP de operadoras, telefonía móvil; TV/otros TIC; correo provisto) · **O11** (informes avanzados y estadísticas técnicas en BI) |
| Dueño de datos | `feasibilityRequests`, `connectionEstimates`, `technicalNotes`, `workOrderOperationTypes`, `workTypes`, `incidentCategories`, `resolutionCodes`, `taskCatalog`, `taskGroups`, `workOrderPrintTemplates`, `chainedOrderRules`, `workOrders`, `workOrderMaterials`, `fieldEvidence`, `serviceConformities`, `damageAssessments`, `technicalProcedures`, `visitTypes`, `schedulingZones`, `resourceCalendars`, `visitBookings`, `visits`, `crews`, `fieldResources`, `responsibleNotificationRules`, `certifiedInstallers`, `fieldForms`, `fieldDevices`, `syncMutations`, `syncConflicts`, `maintenancePlans`, `outagePlans`, `networks`, `networkLayers`, `networkComponentTypes`, `networkComponentRelations`, `networkAttributeDefs`, `networkElements`, `serviceNetworkConnections`, `gisExportTemplates`, `networkDevices`, `provisioningSystems`, `provisioningProfiles`, `serviceTechnicalProfiles`, `provisioningCommands`, `works`, `workGroups`, `workBeneficiaries`, `inspectionCases`, `seals`, `phoneExchanges`, `phoneFrames`, `phoneFrameGroups`, `phoneStrips`, `phoneStripPositions`, `phoneBoxes`, `dslams`, `phonePorts`, `phonePrefixes`, `phoneNumbers`, `phoneLines`, `numberingPlan`, `telecomOperators`, `telecomServiceTypes`, `telecomModalities`, `cdrImports`, `callRecords`, `mobileUsageImports`, `providedMailboxes` |
| Fuentes consolidadas | BASE §17, §18, §50 (AUT-003, AUT-004, agenda y visitas, CU-AUT-01), §73 (INS-001 a INS-007), §74, §77 (GEO-001 a GEO-003, operativo), §79, §80, §86, §37, §98, §101, §106 (pendientes técnicos), MER-004, MER-009, MER-015 (ref.), MER-017, MER-019 (ref.), MER-020 (ref.); AGR-003, AGR-010, AGR-016, AGR-023, AGR-025, AGR-026, ESC-03; DFA M14 (§15), M15 (§16), telefonía/internet (§27 M26), M27 (§28), §31 proceso 1; FIC 4 (PMovil), 9 (telemedición y aprovisionamiento), 10 (mapas/GIS), 14.2, 16, 17; RN-07 §0 a §11 completo; RN-10 §4, §9, §10; RN-09 TECNICA (95 parámetros) y TELEFONIA (16 parámetros), más parámetros de RN-07 §9; CAT §10, §11, §12 completas (y tablas citadas de otras secciones: `CONEXION`, `ALTASEAU`, `VIAINGTE`, `ESTASER`, `SERVICIO_EXTRAS`, `OBSESTAD`, `ITEMSORD`, `PROD_TRH`, `RETI_MAT`, `UBICACIONES`, `CAT_INCI_CTSEC`, `CTSECCION`, `MAPA`, `EQUIPOS`, `MODEMS`, `SERVINT`, `CUADRI`, `TELEMEDICION`, `TELEMED_COMM`, `PRESUPU`, `SERSOC_EXTRAS`); INV `ProMod_Tecnica.md` (142 tipos, 61 formularios, 3 controles); CNX §3.7, §3.8, §4.4, §7.7, §7.8 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Especificar de forma completa y desarrollable la **operación técnica** de la cooperativa en CoopApps: desde que una solicitud de servicio necesita evaluarse en terreno hasta que el trabajo está ejecutado, revisado, con evidencia y con su efecto contractual autorizado. El módulo cubre:

1. **Factibilidad técnica** de nuevas conexiones, traslados y reconexiones, con inspección, dictamen, vigencia y vínculo con el alta.
2. **Estimación técnica y presupuesto de conexión** (cómputo de materiales, mano de obra y obra necesaria) que alimenta el presupuesto comercial.
3. **Órdenes de trabajo (OT)** de todos los tipos (trabajo sobre servicio, mantenimiento sobre activo/obra, OT derivada de reclamo, inspección), con catálogo de operaciones de efecto declarativo, tareas, participantes y horas, vehículos, necesidades y consumo de materiales, resolución, notas, datos extra, reportes de impresión, numeración visible, órdenes encadenadas y operaciones masivas.
4. **Agenda y visitas**: zonas, tipos de visita, franjas, capacidad por recurso, reserva temporal y confirmada sin doble asignación, reprogramación, cancelación, resultado de visita y estado visible al socio ("En camino" sin GPS en vivo).
5. **Instalación integral** (BASE §73): cita, equipo identificado en custodia del instalador, prueba, conformidad/firma, aplicación única del movimiento de stock, encuesta posterior independiente y **hito de activación con fecha efectiva** para el contrato y la facturación.
6. **Cuadrillas, recursos de campo, profesionales matriculados, tipos de trabajo** y reglas de notificación por horario/feriado.
7. **App de campo única offline-first** (perfiles técnico, lecturista, cobrador) con cola única, fotos, GPS, firma, materiales que descuentan stock, idempotencia y **tratamiento de conflictos de sincronización** (AGR-025, ESC-03).
8. **Cortes y reconexiones** ejecutados en terreno o en forma remota, decididos por el módulo de mora o por el CRM.
9. **Mantenimiento e infraestructura y mapas** (BASE §18): inventario técnico por ubicación, planes preventivos, averías, interrupciones planificadas, contratos afectados, historial y costo por activo.
10. **Red / GIS** genérica configurable (red eléctrica, agua, gas, telecomunicaciones): componentes, atributos tipados, capas, relaciones permitidas, red instalada georreferenciada, vínculo servicio-red con historial y **análisis de impacto** ante el corte de un elemento (por ejemplo un transformador) con aviso masivo.
11. **Equipos de red y centrales** (OLT, routers, NAS/Radius, centrales telefónicas, DSLAM).
12. **Obras, loteos y contribución por mejoras** (MER-009): obra, presupuesto, avance, costeo, padrón de beneficiarios y prorrateo.
13. **Inspecciones y consumo no registrado/fraude** (MER-004): caso, inspección con acta y fotos, precintos, descargo, propuesta de recupero aprobada y derivación a facturación.
14. **Aprovisionamiento de Internet/TV** (MikroTik, Wispro, Radius, SmartOlt, Ispfull, Sensa, Sopnet, SITSA y otros): alta, corte, reconexión, cambio de plan y baja con confirmación del resultado (BASE §86, MER-017).
15. **Telefonía**: red física (centrales, repartidores, regletas, cajas, DSLAM), prefijos, pool de números, líneas del abonado, plan de numeración ENACOM, **importación de CDR** de 20+ modelos de central, CPP de operadoras y telefonía móvil (Claro/Personal). La **tasación** se especifica en M04 TAR.
16. **Geolocalización operativa del servicio** con Google Maps (BASE §77): punto de prestación confirmado/aproximado/pendiente usado por factibilidad, agenda, OT, mapa y red.

Es el corazón operativo del **piloto Internet (DEC-005)**: contratación → **factibilidad → visita/instalación → equipo en comodato → activación/aprovisionamiento** → facturación → pago → reclamo → **mora/suspensión** → baja.

## 2. Límite y responsabilidades

### 2.1 Qué hace este módulo

- Es **dueño** de factibilidades, estimaciones técnicas, OT y su catálogo, agenda y visitas, evidencias de campo, conformidades, cuadrillas y recursos, sincronización offline y conflictos, red/GIS, equipos de red, aprovisionamiento técnico (comandos y su resultado), obras técnicas, inspecciones, red e infraestructura telefónica, numeración y mediación de CDR (importación, normalización, atribución de origen y destino, duplicados).
- Emite **hechos técnicos** con fecha efectiva y fecha de registro (AGR-010): factibilidad dictaminada, visita realizada/fallida, OT ejecutada/cerrada/anulada, equipo aplicado/retirado, instalación probada, aprovisionamiento confirmado, servicio conectado/desconectado físicamente, inspección con irregularidad, llamada importada y atribuida.
- Ejecuta las órdenes de corte y reconexión que **otros módulos deciden** y confirma su resultado.

### 2.2 Qué NO hace

- **No** decide condiciones comerciales, precios, cobros ni cambios de titularidad (BASE §17 límite). No activa el contrato por sí mismo: entrega el **hito técnico** y el módulo dueño del contrato registra la activación con su fecha efectiva (BASE §73, CTR-TEC-18).
- **No** calcula cargos, proporcionales de reconexión o cambio de categoría, prorrateos ni promociones (CTR-TEC-10): los pide a M04/M05 mediante eventos.
- **No** tasa llamadas (M04), **no** emite CVLP (M05/M06), **no** decide la suspensión por mora (M08), **no** administra stock general ni equipos serializados (M13), **no** gestiona el reclamo del socio (M09), **no** construye conectores técnicos genéricos (T06).
- **No** muestra la ubicación en vivo del técnico al socio (BASE §73, §77, MER-015).
- **No** realiza simulación eléctrica avanzada (flujo de carga, caída de tensión) salvo acuerdo expreso (BASE §18; PA-TEC-11).
- **No** inventa consumos de Internet: solo presenta uso si existe una fuente de medición definida (BASE §50 control, §86).

### 2.3 Qué delega y a quién

| Tema | Responsable | Interfaz con TEC |
|---|---|---|
| Solicitudes de alta/baja, reclamos, tickets del socio, SLA de atención, mesa de entradas, actividades internas recurrentes | **M09 CRM** | M09 crea el caso; TEC recibe `crm.commandRequest.requested` (EVT-CRM-13, comando `tec.workOrder.request` (antes `tec.workOrder.create`, que es alias de la capability `tec.ordenes.crear` en T02)) y crea la **OT derivada**; TEC publica avances (`tec.workOrder.*`, `tec.visit.*`) que M09 muestra. Reclamos `RECLAMOS*`, `RUB_REC`, `FALLAS`, tickets (`TICKETS*`) y actividades (`ACT_*`) se especifican en M09 (ver §22). |
| Stock, depósitos, reservas, custodia por persona, equipos serializados, RMA, bienes de uso, valorización | **M13 STK** | TEC solicita reserva/entrega a custodia/aplicación/devolución desde la OT (`stk` service API); M13 registra los movimientos y garantiza aplicación única (BASE §73 tabla, AGR-026). |
| Medidores, lecturas, rutas de lectura, telemedición, prepago, observaciones de lectura | **M03 MED** | La OT de cambio/retiro de medidor invoca a M03; la observación de lectura con `generaOt` crea OT en TEC; el perfil lecturista de la app de campo usa pantallas de M03 sobre el shell común de TEC. |
| Conceptos a cobrar por evento técnico (`CONEXION`), proporcionales, tasación telefónica (`TARTEL`, `TARESP`, `TARCLA`, `BANDAS`, `TIPOBAN`, `BANCLA`, `CLAVES`, `TIPOLLAM`, `PLANDES`, `GRATIS`, `SERTEL`), clearing móvil | **M04 TAR** | TEC emite eventos; M04 evalúa reglas y calcula. |
| Cargos, primera factura, prorrateo de activación, cargos de próxima facturación, CVLP | **M05 FAC** (+ M06 FIS) | Consume `tec.installation.activationConfirmed`, `tec.workOrder.closed`. |
| Decisión de corte/suspensión/reconexión por mora, convenios | **M08 MOR** | M08 emite `mor.interruption.approved` (EVT-MOR-12; tipo suspensión, corte o reconexión); TEC crea OT o comando de red y responde `tec.disconnection.executed` / `tec.reconnection.executed`. |
| Cobro en campo (perfil cobrador) | **M07 COB** | Pantallas y reglas propias sobre el shell de campo y la cola offline común. |
| Presupuesto comercial al socio (`PRESUPU`), venta de equipo | **M11 VEN** | TEC entrega la estimación técnica; M11 emite presupuesto y registra aceptación. |
| Compras de materiales para obras | **M12 CMP** | Necesidades de obra pueden generar requerimiento de compra. |
| Costos por OT/obra, centros de costo, asiento de consumo | **M15 CON** | Eventos de consumo valorizado por M13; TEC informa horas (`PARTIORD`) y centro de costo. |
| Vehículos, choferes, AVL (`MOVIL`, `CHOFERES`, `AVL_REG`) | **M18 SOC** (flota, MER-015) | TEC referencia vehículos asignados a la OT. |
| Personal y valor hora | **M16 SUE** | Participantes de OT referencian legajo cuando corresponde. |
| Encuestas (motor), notificaciones, plantillas y canales (SMS, WhatsApp, mail, push), avisos masivos | **T09 COM** | TEC dispara invitación de encuesta y avisos; T09 entrega y registra constancias (AGR-024). |
| Conectores, bóveda de credenciales, reintentos, monitoreo de integraciones | **T06 INT** | TEC define comandos de dominio; T06 provee adaptadores (MikroTik, Radius, SmartOlt, Wispro, Ispfull, Sensa, Sopnet, SITSA, AION, Discar, Gretix, Tecnored, Google Maps, Georef). |
| Catálogo geográfico (provincias, localidades, calles), feriados, numeradores, parámetros versionados | **T04 CFG** | TEC consume; la georreferenciación operativa del punto de prestación es de TEC + M01. |
| Inmueble, domicilio de prestación, cuentas, titulares | **M01 PER** | TEC lee y propone corrección de punto; M01 guarda el domicilio. |
| Contrato de servicio y su estado | M02 CAT (colección `serviceContracts`) | TEC envía hito técnico; el contrato registra activación, suspensión y baja. |
| Expediente documental, retención y acceso a evidencias | **T11 WFL** | TEC registra evidencias como documentos del expediente de la OT/caso (AGR-023). |
| Informes regulatorios (OCEBA, ENRE, ENACOM, ERSeP) | **T10 BIA** + M06 | TEC provee datos de interrupciones, reclamos por daños y tráfico. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop |
|---|---|---|---|
| Factibilidad | Evaluación técnica previa de si es posible conectar/trasladar/reconectar un servicio en un domicilio, con dictamen Factible / No factible y vigencia. | `dict:tec.feasibility` | Factibilidad (`FACTIBIL`) |
| Dictamen técnico | Resultado de la factibilidad con observación técnica, responsable y estado provisorio/definitivo. | `dict:tec.feasibility.verdict` | `FACTIBLE`, `OBS_TEC`, `ESTADO_TEC` |
| Estimación técnica | Cómputo de materiales, mano de obra, obra civil/red necesaria para conectar; base del presupuesto de conexión. | `dict:tec.estimate` | Presupuesto de conexión (`PRESUPU` vinculado, estado Facturado) |
| Orden de trabajo (OT) | Instrucción de trabajo técnico sobre un servicio, un activo/obra o derivada de un reclamo. | `dict:tec.workOrder` | `TECNICA` (`TIP_INCI=2` OT, `=3` OM) |
| Clase de OT | `service` (trabajo sobre servicio), `maintenance` (sobre activo/obra), `claim` (derivada de reclamo), `inspection` (inspección/fraude), `network` (trabajo de red sin servicio). | `dict:tec.workOrder.kind` | `TipoOrden`, `RECLAMO` |
| Operación técnica | Qué se hace en la OT y con qué efecto declarativo sobre el servicio (conectar, desconectar, trasladar, etc.). | `dict:tec.operationType` | Operación / Transacción (`TRANSAC`) |
| Tipo de trabajo | Clasificación del trabajo realizado (instalación, reparación, poda…), con reporte asociado. | `dict:tec.workType` | `TPTRAB` |
| Categoría de incidente | Tipificación técnica de la causa (para reclamos y mantenimiento) con distribución % por sección/centro de costo. | `dict:tec.incidentCategory` | `CAT_INCI`, `CAT_INCI_CTSEC` |
| Resolución | Cómo se resolvió la OT; catálogo por servicio + operación. | `dict:tec.resolution` | `RESOL_OT` |
| Tarea | Actividad elemental registrada en la OT, agrupable. | `dict:tec.task` | `TAREAS`, `TAREASOM`, `GRPTAREA`, `TAROTM` |
| Participante | Persona que intervino en la OT con horas normales y extras. | `dict:tec.participant` | `PARTIORD`, `PARTIINC` |
| Cuadrilla | Equipo de trabajo con integrantes, zona, capacidad y depósito/custodia. | `dict:tec.crew` | `CUADRI` + `PARTICUA` |
| Recurso de campo / responsable | Persona operativa (técnico, instalador, lecturista, cobrador) con depósito propio y canales de aviso. `RESPONSA` migra solo aquí (`fieldResources`); no es fuente de garantes ni de relaciones de M01 (DEC-104 punto 2; M01 CTR-PER-22). | `dict:tec.fieldResource` | `RESPONSA` |
| Profesional matriculado | Instalador externo con matrícula y certificado (electricidad, gas). | `dict:tec.certifiedInstaller` | `PROFESIO`, `NRO_CERT`, `VTO_CERT` |
| Necesidad de materiales | Circuito solicitado → autorizado → retirado → utilizado por producto y depósito. | `dict:tec.materialNeed` | `TECNICA_NECESIDAD` |
| Material de la OT | Línea propia de material previsto/usado/devuelto que genera movimientos en M13. | `dict:tec.workOrderMaterial` | `MOV_PRO` op. 3/5/6/8, `RETI_MAT` (vales) |
| Vale de retiro | Comprobante de retiro de materiales de depósito para una OT u obra. | `dict:tec.withdrawalSlip` | `RETI_MAT` |
| Visita | Presencia programada en el domicilio con franja, recurso y resultado. | `dict:tec.visit` | — (no existe en ProCoop) |
| Reserva temporal | Bloqueo de capacidad por tiempo limitado mientras el socio/operador confirma. | `dict:tec.booking.hold` | — |
| Reserva confirmada | Turno asignado al caso/servicio, notificado al socio. | `dict:tec.booking.confirmed` | — |
| En camino | Estado de avance informado por el técnico; no implica GPS en vivo. | `dict:tec.visit.enRoute` | — |
| Visita fallida | Visita sin poder realizar el trabajo (sin acceso, ausente, falta material, condición técnica). | `dict:tec.visit.failed` | — |
| Conformidad | Constancia de aceptación/disconformidad del receptor sobre el detalle presentado, con firma manuscrita en pantalla u otro mecanismo. | `dict:tec.conformity` | `RESP_ENC`, `MOTIVO_DISCONFORME`, firma PMovil (V2 #50) |
| Hito de activación | Hecho técnico (instalación probada y confirmada) que habilita al contrato a activarse desde una fecha efectiva. | `dict:tec.activationMilestone` | Cierre OT de Alta (`Conectar_SERSOC(FEC_CONFIR)`) |
| Custodia | Responsable físico actual de un equipo/material (depósito, técnico, domicilio). | `dict:tec.custody` | `RESPONSA.COD_DPS` |
| Comodato | Modalidad de entrega de equipo propiedad de la cooperativa al socio. | `dict:tec.equipment.loan` | — |
| App de campo | PWA única offline-first con landing por perfil técnico, lecturista y cobrador. | `dict:tec.fieldApp` | PMovil / Captor / Procoop Integra |
| Mutación de campo | Operación registrada sin conexión con `clientMutationId` para envío idempotente. | `dict:tec.sync.mutation` | Sincronización por tablas MySQL |
| Conflicto de sincronización | Diferencia entre lo hecho en campo y el estado del servidor que requiere decisión. | `dict:tec.sync.conflict` | `BLOQUEAR`, parámetro V2 #57 |
| Red | Conjunto de infraestructura de un servicio (eléctrica, agua, telecom). | `dict:tec.network` | `REDES` (v2), `NIV_*` (v1) |
| Capa | Subdivisión de la red (MT, BT, troncal, distribución). | `dict:tec.network.layer` | `REDES_CAPAS`, `NIV_CAPA` |
| Componente | Tipo de elemento de red (subestación, alimentador, transformador, poste, caja, OLT, splitter). | `dict:tec.network.componentType` | `REDES_COMPONENTES`, `NIV_SERV` |
| Elemento de red | Instancia instalada de un componente, con padre, ubicación, atributos y estado. | `dict:tec.network.element` | `REDES_RED_INSTALADA`, `NIV_REDES` |
| Punto de conexión | Elemento que admite conectar servicios (uno o varios, rango de bornes/pares/puertos). | `dict:tec.network.connectionPoint` | `PERMITE_CONECTAR`, `MULTIPLES_CONEXIONES`, `ELEMENTO_INICIAL..FINAL` |
| Análisis de impacto | Cálculo de servicios y contratos aguas abajo de un elemento afectado. | `dict:tec.network.impact` | — (mejora DFA M15) |
| Interrupción planificada | Corte programado de un tramo de red con aviso a afectados. | `dict:tec.outagePlan` | — |
| Equipo de red | OLT, router/BRAS MikroTik, NAS/Radius, central telefónica, DSLAM. | `dict:tec.networkDevice` | `MIKROTIK`, `TEL_CENTRAL`, `CENTRALT`, `TEL_DSLAM` |
| Sistema de aprovisionamiento | Plataforma externa que ejecuta altas/cortes/cambios de plan. | `dict:tec.provisioningSystem` | `Sistemas_Telemedicion` (ISP/TV) |
| Comando de aprovisionamiento | Solicitud durable e idempotente de acción en red con resultado confirmado. | `dict:tec.provisioningCommand` | `TELEMED_COMM` |
| Perfil técnico del servicio | Datos técnicos de la conexión (usuario PPPoE, MAC, IP, OLT/slot/puerto/vport, ONU, perfil de velocidad). | `dict:tec.serviceTechnicalProfile` | `INTERNET`, `SERSOC.INT_RED/INT_TEL/ID_SYS_TEL` |
| Obra | Proyecto de infraestructura con presupuesto, avance y costeo; puede distribuir su costo entre beneficiarios. | `dict:tec.work` | `OBRAS`, `GRPOBRA` |
| Contribución por mejoras | Distribución aprobada del costo de una obra entre frentistas/beneficiarios. | `dict:tec.improvementLevy` | — (MER-009) |
| Caso de inspección | Expediente de sospecha de consumo no registrado/fraude con inspección, acta, descargo y recupero. | `dict:tec.inspectionCase` | `TECNICA_EXTRAS` (parcial) |
| Precinto | Sello numerado colocado/retirado en medidor o caja. | `dict:tec.seal` | — |
| Central telefónica | Equipo de conmutación con modalidad de CDR, prefijo y moneda. | `dict:tec.phoneExchange` | `TEL_CENTRAL`, `CENTRALT` |
| Repartidor / regleta / caja | Elementos de la red física telefónica con posiciones de conexión. | `dict:tec.phoneFrame` | `TEL_REPARTIDOR`, `TEL_REGLETAS_*`, `TEL_CAJAS`, `TEL_POS_REG_*` |
| Pool de números | Números telefónicos disponibles/asignados por prefijo. | `dict:tec.phoneNumber` | `TEL_NUMEROS`, `TEL_PREFIJO` |
| Línea telefónica | Vínculo vigente entre servicio, número y plan tarifario. | `dict:tec.phoneLine` | `TEL_SERSOC` |
| Plan de numeración | Prefijos de destino ENACOM con operador, modalidad y clave. | `dict:tec.numberingPlan` | `CARACTER` |
| CDR | Registro de detalle de llamada importado de una central u operadora. | `dict:tec.cdr` | `LLAMADAS`, `ENTRANTE`, `INTERNAC`, `LLA_CEL`, `RECHAZOS` |
| CPP | Llamada a celular donde el importe lo fija la operadora móvil (Calling Party Pays). | `dict:tec.cdr.cpp` | `LLA_CEL` |
| Numeración visible | Número legible de OT por año/servicio/operación. | `dict:tec.workOrder.visibleNumber` | `COD_SLS` |
| Orden encadenada | OT creada automáticamente a partir de otra por regla. | `dict:tec.chainedOrder` | `ALTASEAU` (`TIPO_AS=6`), `OT_RELACION` |
| Punto de prestación | Ubicación georreferenciada donde se presta el servicio (≠ domicilio fiscal/postal). | `dict:tec.servicePoint` | `SERSOC` GPS, `MAPA` |

## 4. Actores, permisos y alcance

| Rol | Capabilities principales | Alcance de datos |
|---|---|---|
| Administrador técnico del tenant | `tec.*.configurar`, `tec.operaciones.configurar`, `tec.agenda.configurar`, `tec.redes.configurar`, `tec.aprovisionamiento.configurar`, `tec.telefonia.configurar`, `tec.parametros.configurar` | tenant |
| Supervisor técnico | `tec.factibilidad.ver/crear/editar/evaluar/cancelar/reabrir`, `tec.ordenes.ver/crear/editar/asignar/cerrar/cancelar/reabrir/imprimir`, `tec.reportes.ver`, `tec.ordenes.cerrarMasivo`, `tec.agenda.ver/editar/forzar`, `tec.conflictos.resolver`, `tec.materiales.autorizar`, `tec.instalaciones.confirmar` (antes `tec.factibilidades.ver/crear/editar/aprobar/anular`, `tec.ot.ver/crear/editar/asignar/confirmar/anular/reabrir/exportar`, `tec.ot.cierreMasivo`) | sucursales / zonas / servicios / cuadrillas asignadas |
| Despachante / operador técnico | `tec.ordenes.ver/crear/editar/asignar`, `tec.agenda.ver/reservar/reprogramar/cancelar`, `tec.visitas.ver/editar`, `tec.factibilidad.ver/crear/editar` (antes `tec.factibilidades.ver/crear/editar`, `tec.ot.ver/crear/editar/asignar`) | zonas / servicios |
| Técnico / instalador (app de campo) | `tec.campo.ver`, `tec.campo.ejecutar`, `tec.campo.marcarEnCamino`, `tec.campo.evidencia`, `tec.campo.registrarConformidad`, `tec.campo.registrarMateriales`, `tec.campo.crearOrden` (si V2 #2/#30), `tec.campo.cerrar` (si V2 #48), `stk.custodia.ver` (antes `tec.campo.enCamino`, `tec.campo.conformidad`, `tec.campo.materiales`, `tec.campo.crearOt`) | propios + cuadrilla |
| Líder de cuadrilla | lo del técnico + `tec.ordenes.asignar` dentro de su cuadrilla, `tec.campo.cerrarCuadrilla` (antes `tec.ot.asignar`) | cuadrilla |
| Lecturista (app de campo) | `tec.campo.ver` + capabilities de M03 (`med.lecturas.*`) + `tec.campo.crearOrden` desde observación de lectura (antes `tec.campo.crearOt`) | rutas asignadas |
| Cobrador (app de campo) | `tec.campo.ver` + capabilities de M07 (`cob.campo.*`) | listas de cobro asignadas |
| Responsable de mantenimiento | `tec.activos.ver/editar`, `tec.mantenimiento.ver/crear/editar`, `tec.interrupciones.ver/crear/aprobar`, `tec.materiales.solicitar` | servicios / zonas |
| Responsable de red / GIS | `tec.redes.ver/editar/configurar/exportar`, `tec.conexionesRed.editar`, `tec.impacto.ver`, `tec.gis.exportar` | servicio / red |
| Operador NOC / aprovisionamiento | `tec.aprovisionamiento.ver/ejecutar/reintentar/marcarManual`, `tec.equiposRed.ver/editar`, `tec.perfilTecnico.ver/editar`, `tec.perfilTecnico.verSecretos` (ver secretos con auditoría) (antes `tec.perfilTecnico.secretos`) | servicios TIC |
| Responsable de obras | `tec.obras.ver/crear/editar/aprobar`, `tec.obras.padron.editar`, `tec.obras.prorrateo.proponer` | servicios / obras |
| Inspector | `tec.inspecciones.ver/crear/editar`, `tec.precintos.editar`, `tec.campo.*` para inspección | zonas |
| Jefe de guardia (HUE-GAS-05) | `tec.guardias.gestionar` (turnos y escalamiento, PAN-TEC-61), `tec.ordenes.asignar` sobre OT de emergencia (antes `tec.onCall.manage`, `tec.ot.asignar`) | servicios / zonas de la guardia |
| Responsable de calidad del agua (PA-TEC-20) | `tec.calidadAgua.gestionar` (puntos, muestras, resultados, PAN-TEC-64) (antes `tec.waterQuality.manage`) | servicio agua / concesión |
| Comité/responsable de recupero | `tec.inspecciones.aprobarRecupero`, `tec.inspecciones.anular` | tenant |
| Operador de telefonía | `tec.telefonia.redFisica.ver`, `tec.telefonia.redFisica.editar`, `tec.telefonia.numeracion.ver`, `tec.telefonia.numeracion.editar`, `tec.telefonia.numeracion.configurar`, `tec.telefonia.lineas.ver`, `tec.telefonia.lineas.editar`, `tec.telefonia.cdr.importar/asignar/revertir` (antes `tec.telefonia.redFisica.*`, `tec.telefonia.numeracion.*`, `tec.telefonia.lineas.*`) | servicio telefonía |
| Atención (CRM) | `tec.ordenes.ver`, `tec.ordenes.crear`, `tec.agenda.reservar`, `tec.visitas.ver` (antes `tec.ot.crearDerivada`, `tec.ot.ver`) | según M09 |
| Socio (PWA) | `por.visitas.reservar`, `por.visitas.ver`, `por.visitas.reprogramar`, `por.visitas.cancelar` (según reglas) | propios (contratos/casos del titular o relación autorizada) |
| Integración (cuenta de servicio) | `tec.ext.aprovisionamiento.callback`, `tec.ext.cdr.importar` | tenant, token de T06 |
| Soporte plataforma | lectura temporal auditada (T01) | tenant con acceso temporal |

> **Corrección de cierre 05-11-2026 (PA-TEC-21; PA 4 y 7 del pendiente de cierre):** las capabilities de este anexo con acción en inglés o fuera de la convención de T02 (`tec.workOrder.*`, `tec.feasibility.*`, `tec.schedule.*`, `tec.network.*`, `tec.provisioning.*`, acciones `manage`, `read`, `configure`, `import`, `review`, y `tec.phone.plant`, `tec.phone.numbering`, `tec.phone.lines`) y el vocabulario `tec.ot.*` / `tec.factibilidades.*` de esta tabla se renombran a la canónica de T02 §4.4.3 (`tec.ordenes.*`, `tec.factibilidad.*`, `tec.agenda.*`, `tec.redes.*`, `tec.aprovisionamiento.*`, acciones `gestionar`, `ver`, `configurar`, `importar`, `revisar`, y `tec.telefonia.*`). Cada celda conserva el nombre anterior como alias "antes `x`" en §4, §10, §11 y ESC-TEC-24. Las que T02 registra con acción en inglés sin canónica propuesta pasan a `tec.materiales.autorizar` (antes `tec.material.authorize`), `tec.materiales.solicitar` (antes `tec.material.request`), `tec.conflictos.resolver` (antes `tec.syncConflict.resolve`), `tec.guardias.gestionar` (antes `tec.onCall.manage`) y `tec.calidadAgua.gestionar` (antes `tec.waterQuality.manage`). Los códigos de error (`tec.workOrder.duplicate`…), los nombres de evento y los comandos que recibe M10 (`tec.workOrder.create`, `tec.feasibility.request` de EVT-CRM-13) no son capabilities y no cambian.

Permisos negativos relevantes: el técnico no ve OT fuera de su alcance ni los secretos de red; un supervisor no puede confirmar una OT cuya instalación tiene conflicto abierto; nadie edita libremente estados (`Activo`, `Cerrada`) sin transición (AGR-003).

## 5. Requisitos funcionales

### 5.1 Factibilidad

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-001 | Registrar solicitudes de factibilidad por servicio y operación (alta, traslado, reconexión, aumento de potencia/plan) desde CRM, admin o portal, con comprobante/numeración propia por punto de venta o secuencia del tenant. | BASE §17; RN-07 §3.1; DFA M14 | Núcleo | O3 | Informado | Se crea con número único; sin punto de venta o secuencia válida se rechaza con error explícito. |
| RF-TEC-002 | Cargar persona existente o crear persona provisoria en M01 (prospecto) al registrar la factibilidad; si es nueva, copiar el domicilio de conexión como domicilio de contacto solo si el usuario lo confirma. | RN-07 §3.1 (`CargarDatosPersona`) | Núcleo | O3 | Adoptado | No se crean personas duplicadas por documento; se valida DNI/CUIT. |
| RF-TEC-003 | Registrar domicilio de conexión georreferenciado (punto de prestación), catastro (circunscripción, sección, manzana, parcela, PH, lote), calles linderas (derecha, izquierda, atrás con números), barrio, zona-sector-recorrido de lectura y referencias de acceso. | RN-07 §3.1; BASE §77 | Núcleo | O3 | Informado | La factibilidad muestra punto en mapa con su estado (confirmado/aproximado/pendiente). |
| RF-TEC-004 | Registrar observaciones administrativa, comercial y operativa y notas de seguimiento con título, texto, fecha, usuario y responsable. | RN-07 §3.1; CAT `FACTIBIL_NOTA` | Estándar | O3 | Adoptado | Las notas son de solo agregado; no se editan ni borran. |
| RF-TEC-005 | Registrar propiedades adicionales configurables de la factibilidad (por servicio): potencia solicitada, tipo de inmueble, tecnología, distancia al nodo, etc. | RN-07 §3.1 (`clsPropiedadesItems`) | Estándar | O3 | Adoptado | Atributos tipados validados por esquema del tenant. |
| RF-TEC-006 | Programar inspección de factibilidad como visita/OT de clase `inspection` y registrar condiciones encontradas con fotos y GPS. | BASE §17 ("Registrar inspecciones y condiciones") | Núcleo | O3 | Informado | La inspección queda vinculada y su resultado alimenta el dictamen. |
| RF-TEC-007 | Consultar automáticamente cobertura y disponibilidad del recurso de conexión (zona, nodo, puertos/bornes libres en red GIS, capacidad de OLT/splitter) y proponerla al evaluador. | BASE §86 (cobertura y recurso); RN-07 §5.1/5.2 disponibilidad | Núcleo | O3 | Adoptado | Si no hay recurso libre, la propuesta es "No factible: sin capacidad" y el evaluador puede justificar excepción. |
| RF-TEC-008 | Dictaminar factibilidad Factible/No factible con motivo obligatorio, observación técnica, responsable técnico y estado técnico provisorio/definitivo; estado administrativo provisorio/definitivo separado. | BASE §17; RN-07 §3.1 | Núcleo | O3 | Informado | No se puede dictaminar sin motivo; el cambio queda auditado. |
| RF-TEC-009 | Anular factibilidad con motivo; una factibilidad anulada nunca es utilizable para un alta. | RN-07 §3.1 (bug corregido) | Núcleo | O3 | Adoptado | Intentar usar una anulada devuelve error 409. |
| RF-TEC-010 | Vigencia configurable de la factibilidad para su uso en un alta (default 90 días) y uso único (sin servicio asociado previo). | RN-07 §3.1 (`Get_FACTIBIL_Solicitud`) | Núcleo | O3 | A validar (PA-TEC-05) | Factibilidad vencida o ya usada no aparece como seleccionable. |
| RF-TEC-011 | Exigir factibilidad vigente y factible en altas y reconexiones de servicios que la requieran (configurable por servicio/operación). PRM-TEC-024 es el **único dueño** del requisito, con valor explícito por servicio (incluido CLO); M02 PRM-CAT-013 pasa a ser lectura derivada de este parámetro en la ficha del servicio (HUE-SRV-07, DEC-040). | V2 #388; DFA M14 mejora; HUE-SRV-07 | Núcleo | O3 | A validar (PA-TEC-04) | Si el parámetro está activo, no se crea OT de alta sin factibilidad válida. M02 no exige factibilidad por un parámetro propio: consulta PRM-TEC-024 del servicio. |
| RF-TEC-012 | Guardar en el contrato/servicio el identificador de la factibilidad que lo originó. | DFA M14 [P] | Núcleo | O3 | Informado | Trazabilidad factibilidad → contrato → OT. |
| RF-TEC-013 | Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. | V2 #2654, #3082 | Estándar | O3 | Adoptado | La versión dictaminada original se conserva (AGR-023). |
| RF-TEC-014 | Auditoría de acciones de factibilidad (alta, modificación, cierre, anulación) con diferencias. | RN-07 §3.1 | Núcleo | O3 | Adoptado | Pantalla de cambios muestra antes/después por campo. |
| RF-TEC-015 | Enviar la factibilidad por mail al solicitante y generar su PDF (con mapa estático opcional). | INV `frm_Factibilidad.EnviarPorMail`, `frmImpresiones.GetPdfFactibilidad` | Estándar | O3 | Adoptado | Envío registra constancia en T09. |
| RF-TEC-016 | Informe de factibilidades con estado (Pendiente/Cerrado/Anulado/Facturado), Factible, días entre fecha y confirmación (u hoy), agrupable por barrio. | RN-07 §1.11 (`clsInformes_Factibilidad`) | Estándar | O3 | Adoptado | Los días se calculan en zona horaria del tenant. |
| RF-TEC-017 | Notificar al socio el resultado de la factibilidad por su canal y reflejarlo en el caso del CRM. | BASE §50 AUT-002 | Núcleo | O3 | Adoptado | El socio ve "Factible"/"No factible" con motivo público. |

### 5.2 Estimación técnica y presupuesto de conexión

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-018 | Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. | BASE §17 ("Preparar presupuestos"); DFA §31 paso 3 | Núcleo | O3 | Informado | La estimación calcula cantidades; los precios los aporta M04/M11. |
| RF-TEC-019 | Enviar la estimación a M11 para emitir el presupuesto comercial al socio; reflejar aceptado/rechazado/vencido en la factibilidad. | RN-07 §3.1 (estado Facturado ↔ `PRESUPU`) | Núcleo | O3 | Adoptado | Con presupuesto aceptado, la factibilidad pasa a `quoted→accepted` y habilita la OT. |
| RF-TEC-020 | Plantillas de estimación por servicio/tecnología (por ejemplo, "Conexión FTTH aérea hasta 100 m") reutilizables. | Benchmark | Estándar | O3 | Adoptado | Al aplicar la plantilla se copian líneas editables. |
| RF-TEC-021 | Convertir los materiales de la estimación aceptada en materiales previstos y reserva de stock de la OT de conexión. | BASE §17 ("Reservar materiales") | Núcleo | O3 | Informado | Al crear la OT se generan `workOrderMaterials` en estado `requested`. |

### 5.3 Órdenes de trabajo: núcleo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-022 | Modelo único de OT con clase `service`, `maintenance`, `claim`, `inspection`, `network` y enums únicos coherentes. | RN-07 §1.1, §10.1; CTR-TEC-08 | Núcleo | O3 | Adoptado | No existen dos enums para el mismo concepto. |
| RF-TEC-023 | Catálogo configurable de operaciones técnicas por servicio con **efecto declarativo**: `connect`, `move`, `disconnect`, `meterChange`, `reconnect`, `incident`, `statusChange`, `meterRemoval`, `categoryChange`, `planChange`, `prepaidTopUp`, `equipmentSwap`, `equipmentRetrieval`, `inspection`, `flowRestriction` y `flowRestore` (reducción de caudal por mora y su rehabilitación, RF-TEC-238), `bottledGasDelivery` (entrega de gas envasado, RF-TEC-239), `none`. | RN-07 §1.2, §10.2 | Núcleo | O3 | Adoptado | Los 8 efectos cableados de ProCoop y los de parámetros 2330/238 están disponibles como tipos de efecto. |
| RF-TEC-024 | Atributos por operación: servicio, es reclamo, modifica matrícula, estado de servicio resultante, agregar nota visible en caja, registrar estado/lectura, envío al socio (nunca/al generar/al confirmar/siempre) y canal, plantillas de alta/confirmación, excluir de la web, disponible en app de campo, requiere factibilidad, requiere punto de red, requiere dispositivo, requiere equipo serializado, genera aprovisionamiento, reporte de impresión. | RN-07 §1.2; CAT `TRANSAC` | Núcleo | O3 | Adoptado | Cada flag se valida al crear/cerrar. |
| RF-TEC-025 | Crear OT desde: administración, ficha del titular/servicio, CRM (OT derivada), mora (corte/reconexión), API de integración, app de campo, observación de lectura (M03) y reglas encadenadas; registrar origen y vía de ingreso. | RN-07 §1.3 (`OrigenOrden`, `COD_VIA`), §Reglas adicionales (`GenerarOrden`) | Núcleo | O3 | Adoptado | Cada OT tiene `origin` y `intakeChannel`. |
| RF-TEC-026 | Al crear la OT, copiar instantánea del servicio: domicilio, punto GPS, medidor (número, dígitos, última lectura y fecha), catastro, certificado de instalador, teléfono del titular, línea telefónica activa, condición de moroso y origen gestión de mora; opcionalmente la observación del servicio como observación administrativa. | RN-07 §1.3 (`Crear_OT`); V2 #2339 | Núcleo | O3 | Adoptado | La instantánea no cambia si luego cambia el servicio; el GPS no se trunca. |
| RF-TEC-027 | Validaciones previas por operación: no sobre servicio inexistente; no sobre servicio dado de baja salvo incidente/reconexión; no sobre pendiente de conectar salvo parámetro; reconexión solo sobre servicio desconectado, no con titular fallecido salvo parámetro, no en planes de vivienda; cambio/retiro de medidor exigen medidor y no retirado; retiro solo sobre desconectado (telefonía: línea abierta); alta no si hay alta o reconexión pendiente. | RN-07 §1.4 validaciones; V2 #2655, #2301 | Núcleo | O3 | Adoptado | Cada rechazo devuelve código de regla (`RN-TEC-0xx`). |
| RF-TEC-028 | Impedir OT pendiente duplicada de la misma operación para el mismo servicio (ventana configurable; default sin límite temporal). | RN-07 §1.3 (`Existe_OT_Pendiente`, 90 días) | Núcleo | O3 | Adoptado | Segundo intento devuelve 409 con enlace a la existente. |
| RF-TEC-029 | Numeración interna inmutable (ObjectId) + número de comprobante por talonario/operación + **numeración visible** configurable: no usar, por año separando reclamos, por año y operación, por año + reclamo + operación, y secuencia continua de reclamos por servicio; asignada al crear o al cerrar según parámetro. | RN-07 §1.1, §1.6; V2 #344, #2998, #3031 | Núcleo | O3 | Adoptado | Secuencias atómicas sin huecos por concurrencia (CTR-TEC-19). |
| RF-TEC-030 | Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. | RN-07 §1.7 | Núcleo | O3 | Informado | La cuadrilla precarga sus integrantes editables. |
| RF-TEC-031 | Registrar tareas realizadas (catálogo por grupo y servicio) en OT de trabajo y de mantenimiento. | RN-07 §1.7 (`TAROTM`); CAT `TAREAS`, `TAREASOM`, `GRPTAREA` | Estándar | O3 | Adoptado | Tareas obligatorias por operación configurables. |
| RF-TEC-032 | Registrar horas normales y extras por participante, si es contratado y valor hora (default parámetro). | CAT `PARTIORD`; V2 #2354, #3085 | Estándar | O3 | Adoptado | Si V2 #2354 activo, no se cierra sin horas. |
| RF-TEC-033 | Notas de OT de solo agregado (título, texto, fecha, usuario, responsable), visibles internamente; opción de nota pública al socio. | CAT `TECNICA_NOTA` | Núcleo | O3 | Adoptado | Notas públicas se reflejan en M09/portal. |
| RF-TEC-034 | Descripción de la OT acumulativa (agregar texto, no reemplazar). | RN-07 §Reglas adicionales (`Guardar_OT_Descripcion`) | Estándar | O3 | Adoptado | Historial de descripciones con autor. |
| RF-TEC-035 | Datos extra de la OT por tipo (formulario configurable): reclamos por daños a artefactos (fecha de pago, transferencia, libro/folio, monto reclamado/aprobado, daños anteriores, aceptado, reclamo ante el regulador, causa, artefactos dañados). | CAT `TECNICA_EXTRAS`; V2 #3120 | Estándar | O7 | Adoptado | Se modela en `damageAssessments` vinculada a la OT y al caso M09. |
| RF-TEC-036 | Cierre de la OT con fecha real de ejecución, responsable, categoría de incidente, resolución, tipo de trabajo, cuadrilla, horas, personas, observaciones técnicas; exigencias configurables (responsable, categorías, resolución, personas, observaciones administrativas, certificado, número de dispositivo, móvil). | RN-07 §1.3, §1.4; V2 #342, #474, #497, #2084, #174, #2421, #2470, #2505 | Núcleo | O3 | Adoptado | Faltantes listados todos juntos antes de cerrar. |
| RF-TEC-037 | Doble paso opcional por operación: **Ejecutada** (campo) y **Cerrada/Confirmada** (revisión administrativa/supervisión); no mezclar ambos conceptos. | RN-07 §1.3 (DTO vs enum), §10.1; BASE §17 ("Revisar el cierre") | Núcleo | O3 | A validar (PA-TEC-01) | Los efectos contractuales se aplican solo en Confirmada. |
| RF-TEC-038 | Efectos al confirmar según efecto declarativo: conectar servicio (hito), trasladar domicilio (y opcionalmente adherentes), desconectar servicio + adherentes + beneficiarios con retiro de medidor opcional, cambio de medidor (M03), reconexión, cambio de estado de servicio, retiro de medidor, cambio de categoría, punto de red, matrícula, lectura inicial/final (M03), nota visible en caja. Todos vía servicios de los módulos dueños, en una transacción con outbox. | RN-07 §1.4 | Núcleo | O3 | Adoptado | Un fallo de un efecto deja la OT en `closing` con paso pendiente reparable (AGR-016), nunca a medio aplicar sin registro. |
| RF-TEC-039 | Datos opcionales actualizables al cerrar: recorrido de lectura/factura, cantidad, domicilio, teléfonos y mails de persona y cuenta, catastro, certificado, observación de medidor; con aviso si en traslado no cambió el recorrido y pregunta de modificar domicilio postal/recorrido postal. | RN-07 §1.4 (`DatosExtraTecnica`); V2 #2480, #2637, #2638 | Estándar | O3 | Adoptado | Cada actualización genera propuesta a M01/M03 con auditoría. |
| RF-TEC-040 | Registrar lectura/consumo al cerrar cuando la operación lo pide y siempre en alta y reconexión (servicios medidos), encadenando con el consumo anterior; preguntar si agregar consumo calculado. | RN-07 §Reglas adicionales (`Registra_EstadoMedidor`, `CargarConsumoAnterior`); V2 #254 | Estándar | O7 | Adoptado | Lectura se envía a M03 con origen OT. |
| RF-TEC-041 | Retiro de medidor en desconexión: marcar retirado por defecto, preguntar si retirar, limpiar número y matrícula si parámetro. | RN-07 §1.4; V2 #2399, #2440, #2531 | Estándar | O7 | Adoptado | Efecto aplicado en M03. |
| RF-TEC-042 | Confirmar órdenes con fecha anterior al alta del servicio o fecha posterior a hoy solo si parámetros lo permiten; permitir cambiar fecha de ingreso/solicitud con capability y parámetro. | V2 #441, #752, #2268, #2439 | Estándar | O3 | Adoptado | Fecha efectiva y fecha de registro se guardan separadas (AGR-010). |
| RF-TEC-043 | Verificar pagos pendientes al confirmar (por ejemplo, cargo de conexión no pagado) salvo parámetro; el bloqueo es configurable por operación. | V2 #2891; INV `abm_Tecnica.ExistenPagosPendientes` | Estándar | O3 | Adoptado | Mensaje indica comprobantes pendientes según M07. |
| RF-TEC-044 | Anulación de OT con motivo y **reversión por compensación** de efectos ya aplicados (reconexión anulada → restaurar baja; alta anulada → baja/“No vigente” si factura cargo fijo en la baja; desconexión anulada → limpiar baja y moroso); devolver materiales con movimientos inversos (nunca borrado físico); nota en la cuenta. | RN-07 §1.3 (`PreDelete_TECNICA`); V2 #2753 | Núcleo | O3 | Adoptado | La anulación genera movimientos compensatorios en M13 y eventos de reversión. |
| RF-TEC-045 | Restablecer (reabrir) una OT anulada o cerrada con capability, motivo y reglas de reversión. | RN-07 §1.3 ("Restablecer vuelve a 1") | Estándar | O3 | Adoptado | La reapertura conserva historial y no duplica efectos. |
| RF-TEC-046 | Cambio de subestado/estadio libre configurable por tenant (por ejemplo "Esperando permiso municipal"). | RN-07 §1.3 (`SUBESTADO`, `Cambiar_Estadio`) | Estándar | O3 | Adoptado | Subestados no alteran el estado principal. |
| RF-TEC-047 | Órdenes encadenadas por reglas: al crear OT de operación X sobre servicio S (filtros: categoría, localidad, referencia, zona de lectura, actividad, clase, propiedad, tipo de medidor, operación) crear OT de operación Y sobre servicio S' con otra vía; dependencia de confirmación (origen primero o destino primero); error si 0 o más de una regla aplicable al confirmar. | RN-07 §1.5 (`ALTASEAU` tipo 6) | Estándar | O3 | Adoptado | Creación idempotente; numeración atómica (no `COD_SOL+1`). |
| RF-TEC-048 | Bajas automáticas de servicios dependientes: si el dependiente usa técnica se genera OT de desconexión; si no, se solicita la baja directa al dueño del contrato. | RN-07 §1.5 (`AltasBajasAutomaticas`) | Estándar | O3 | Adoptado | Evento `tec.dependentDisconnection.requested`. |
| RF-TEC-049 | Servicios que no usan técnica: la operación se aplica sin OT (desconexión directa) mediante solicitud al dueño del contrato, registrando el hecho técnico "sin intervención". | RN-07 §4 (`DesconectarServicio`) | Núcleo | O3 | Adoptado | Configuración por servicio `usesTechnicalOrders`. |
| RF-TEC-050 | Generación masiva de OT por filtros (servicio, operación, estado, días, morosos, fecha de estado) con selección parcial/cantidad y vista previa, mostrando la última OT pendiente/en proceso por servicio para evitar duplicados. | INV `frmOT_Notificaciones`; RN-07 §Reglas adicionales (`Get_ServiciosNotificados`) | Estándar | O3 | Adoptado | Job `tec:generar-ot-masivas` idempotente por lote. |
| RF-TEC-051 | Cambio de estado masivo de servicios por OT (con nota visible en caja) y en transacción. | INV `frmTecnica_CambioEstadoMasivo`; RN-07 §Reglas adicionales | Estándar | O3 | Adoptado | Resultado por ítem. |
| RF-TEC-052 | Confirmación/cierre masivo de OT con los mismos datos (fecha, responsable, incidente, resolución, tipo de trabajo, móviles, cuadrilla, horas, personas, observaciones) y notificación opcional al socio; excluye las bloqueadas por campo o sistema externo. | RN-07 §1.3 (cierre masivo), §1.7 (`BLOQUEAR`) | Núcleo | O3 | Adoptado | Las OT con ejecución en campo pendiente de sincronizar no se cierran masivamente. |
| RF-TEC-053 | Eliminación/anulación masiva de OT seleccionadas con reversión por ítem. | INV `frmBajaMasivaOrdenes.btnEliminarSeleccionados` | Estándar | O3 | Adoptado | Reporte de resultado por OT. |
| RF-TEC-054 | Asistentes de generación por operación: traslado (domicilio nuevo, adherentes), desconexión (baja por mora, contrato de baja imprimible), reconexión (mora saldada, factibilidad), cambio de medidor (nuevo tipo/número, materiales, con/sin técnica), cambio de categoría (solicitud imprimible), cambio de estado, OT especial. | INV `frmTecnica_*`, `frmOT_Especial` | Núcleo | O3 | Adoptado | Cada asistente aplica validaciones RF-TEC-027. |
| RF-TEC-055 | Formularios de solicitud para firma del socio por operación (traslado con diseño propio y domicilio nuevo, cambio de medidor, reconexión, desconexión, alta, cambio de categoría). | RN-07 §1.11 (`Get_Reporte_Solicitud_OT`) | Estándar | O3 | Adoptado | PDF con versión y firma capturable en mostrador o campo. |
| RF-TEC-056 | Modelos de impresión de OT por servicio + operación (único por combinación), informe por defecto, con mapa estático opcional del punto, materiales (con vales opcionales), informe de incidentes; la impresión no cambia el estado salvo configuración. | RN-07 §1.10, §1.11; V2 #180, #358, #465, #2808, #2819, #3173; CAT `OT_REPORTE` | Estándar | O3 | Adoptado | Imprimir pasa a `dispatched` solo si V2 #2808 = falso y la operación lo indica. |
| RF-TEC-057 | Antigüedad visual de la OT (≤10, 11–20, 21–30, >30 días) y estado de envío a campo. | RN-07 §Reglas adicionales (`ObtenerDetalleOrden`) | Estándar | O3 | Adoptado | Badges por rango en tablero. |
| RF-TEC-058 | Aviso en tiempo real a usuarios técnicos cuando se crean OT pendientes nuevas en su alcance (reemplaza sondeo). | RN-07 §Reglas adicionales (`NotificarNuevaOrden`) | Estándar | O3 | Adoptado | Notificación in-app vía T09. |
| RF-TEC-059 | Tablero de órdenes en kanban, lista y mapa, con asignación por arrastre a cuadrillas/recursos y filtros por estado, operación, zona, servicio, antigüedad, prioridad. | DFA M14 mejora; CNX §4.4 | Núcleo | O3 | Adoptado | Arrastrar a otra cuadrilla valida capacidad y conflicto de agenda. |
| RF-TEC-060 | Prioridad y vencimiento (fecha objetivo) en la OT, con SLA heredado del caso M09 cuando es derivada. | RN-07 §2 (sin prioridad), §10.6; CAT `TECNICA.VENCE` | Núcleo | O3 | Adoptado | Alertas de OT por vencer y vencidas. |
| RF-TEC-061 | Tipificación de causa con categoría de incidente y distribución % por sección/centro de costo que debe sumar 100 %. | RN-07 §2, §Reglas adicionales (no valida 100 %) | Estándar | O7 | Adoptado | No se guarda una distribución distinta de 100 %. |
| RF-TEC-062 | Cargos asociados a la OT: al generar ("antes", cobro en mostrador) y al cerrar ("luego"), por regla de M04 según servicio, socio activo, moroso, prepago, referencia, localidad, categoría, clase, retirado, provisorio, propiedad, estado del servicio, operación, solo reclamo (ej. visita improcedente), una vez; precio editable o no por parámetro. TEC solo dispara el evento y muestra la propuesta. El cargo aceptado se materializa en `billableItems` de M05 con `fac.service.upsertBillableItem` (`sourceModule = TEC`, `sourceType = technicalCharge`, `sourceRef = { type: 'workOrderCharge', id: '<workOrderId>:<regla>:<momento>' }`, con `<momento>` = `antes` o `luego` (antes el código mostraba las dos opciones separadas por una barra vertical escapada), importe cotizado por M04; CTR-DAT-38), nunca en una cola propia ni en `preloadedCharges` (absorbida por `billableItems`); la anulación de la OT lo cancela con `fac.service.cancelBillableItem` o, si ya se facturó, pide NC a M05 (RF-TEC-044). | RN-07 §1.9; V2 #443, #448, #65 | Núcleo | O3 | Adoptado | Sin doble cargo por resincronización (idempotencia por OT + regla, garantizada por `{sourceModule, sourceRef.id}` de M05). |
| RF-TEC-063 | Proporcionales por reconexión (crédito por días desconectados o débito por días restantes si el período no se facturó) y por cambio de categoría (diferencia de precio por días, con tope de día y sin negativos opcional): solicitados a M04/M05; opción de cerrar sin generar comprobante. | RN-07 §1.9; V2 #2483, #2485, #2661, #2907, #2570, #2587, #2625, #2755, #3111 | Estándar | O4 | Adoptado | Evento `tec.workOrder.closed` con `effect=reconnect\|categoryChange`; M05 decide documento inmediato o próxima factura. |

### 5.4 Materiales de la OT

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-064 | Entidad propia de material de la OT (producto, cantidad prevista/usada/devuelta, depósito o custodia de origen, serie si corresponde, precio de referencia, facturable sí/no) que solicita a M13 los movimientos. | RN-07 §1.8, §10.5; DFA M14 (`ITEMSORD` → CTR-TEC-01) | Núcleo | O3 | Adoptado | Cada movimiento M13 referencia `workOrderMaterialId`. |
| RF-TEC-065 | Origen del descuento: depósito indicado, custodia del técnico/responsable (depósito propio) o depósito por defecto configurado. | RN-07 §1.8 (`RESPONSA.COD_DPS`, depósito 1) | Núcleo | O3 | Adoptado | Sin depósito resuelto no se confirma el consumo. |
| RF-TEC-066 | Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados pendientes de uso. | RN-07 §1.8 (`TECNICA_NECESIDAD`); V2 #2997 | Estándar | O7 | Adoptado | El filtro de estado corrige el bug `(≠3)\|(≠4)`. |
| RF-TEC-067 | Vales de retiro de depósito vinculados a la OT/obra y su consulta; importar productos de presupuesto en vales. | RN-07 §1.8 (`RETI_MAT`); INV `frmConsultar_Vales`; V2 #2899 | Estándar | O3 | Adoptado | El vale es un movimiento M13 a custodia, no consumo. |
| RF-TEC-068 | Materiales en productos sin stock solo si parámetro lo permite; advertencia al cerrar OT sin materiales; mostrar detalle de materiales en el registro. | V2 #2627, #3201, #2657 | Estándar | O3 | Adoptado | Mensajes configurables. |
| RF-TEC-069 | Bloqueo de edición de materiales en OT cerradas (parámetro); corrección posterior solo por ajuste trazado. | V2 #2667 | Estándar | O3 | Adoptado | Ajuste genera movimiento compensatorio. |
| RF-TEC-070 | Validación de cierre de stock: no registrar materiales con fecha de un período de stock cerrado. | INV `abm_Tecnica_Partiord.ValidarCierreStock` | Estándar | O8 | Adoptado | Error si período cerrado en M13. |
| RF-TEC-071 | Facturación de materiales al socio solo si la operación/presupuesto lo define; por defecto los materiales no se facturan automáticamente. | RN-07 §1.8, §11 duda 4 | Estándar | O3 | A validar (PA-TEC-03) | Línea `billable=true` genera solicitud a M05. |
| RF-TEC-072 | Costeo de la OT: materiales valorizados (M13) + horas normales/extras (valor hora parámetro o legajo) + vehículos; concepto de horas hombre. | V2 #460, #2722, #2723, #3085; RN-07 §1.11 recursos | Estándar | O7 | Adoptado | El informe no sobrescribe parámetros (CTR-TEC-26). |

### 5.5 Agenda y visitas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-073 | Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. | BASE §50 agenda | Núcleo | O3 | Informado | Tipo "Instalación Internet" con franja de 2 h precargado. |
| RF-TEC-074 | Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). | BASE §50; AGR-025 | Núcleo | O3 | Informado | La capacidad disponible se calcula por zona/tipo/franja. |
| RF-TEC-075 | Ofrecer turnos compatibles con servicio, domicilio (zona por punto de prestación), requisitos del caso y factibilidad aprobada. | BASE §50 AUT-003 | Núcleo | O3 | Informado | Solo se ofrecen franjas con capacidad > 0. |
| RF-TEC-076 | **Reserva temporal** con expiración configurable al elegir franja y **reserva confirmada** al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). | AGR-025 | Núcleo | O3 | Adoptado | Dos solicitudes simultáneas por el último cupo: una confirma, la otra recibe 409 con alternativas. |
| RF-TEC-077 | Confirmar fecha/franja al socio por su canal con constancia y recordatorio previo configurable. | BASE §50; AGR-024 | Núcleo | O3 | Informado | Constancia en T09 con estado de entrega. |
| RF-TEC-078 | Reprogramar y cancelar visitas por socio (portal, con reglas de anticipación) u operador, con motivo y trazabilidad; cancelar visita no cancela la contratación. | BASE §50; AGR-003 ejemplo | Núcleo | O3 | Informado | Se liberan cupos y se conserva la reserva anterior en historial. |
| RF-TEC-079 | Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. | BASE §50 | Núcleo | O3 | Informado | Reasignación notifica al técnico y actualiza su "Mi día". |
| RF-TEC-080 | Resultado de visita: realizada, fallida (sin acceso, ausente, falta material, condición técnica, clima, rechazo del socio), reprogramada, cancelada u otro definido por tenant; visita no terminada genera otra visita. | BASE §50; BASE §17 excepción | Núcleo | O3 | Informado | Visita fallida no activa contrato ni descuenta equipo. |
| RF-TEC-081 | Estado real visible al socio (Confirmada, Asignada, En camino, En sitio, Realizada, Fallida, Reprogramada) vinculado a la OT y a la activación. | BASE §50; INS-002 | Núcleo | O3 | Informado | El socio no ve datos internos ni ubicación del técnico. |
| RF-TEC-082 | Costo de visita fallida/improcedente configurable por prestación (concepto M04), nunca automático sin regla. | BASE §50 ("eventual costo"); RN-07 §2 (`CONEXION.RECLAMO`) | Estándar | O3 | A validar (PA-TEC-06) | Cargo solo con regla activa y motivo imputable. |
| RF-TEC-083 | Forzar sobrecupo con capability y motivo (urgencias), marcado en agenda. | Benchmark | Estándar | O3 | Adoptado | Auditoría de sobrecupo. |
| RF-TEC-084 | Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. | BASE §50; CNX §3.8 `/agenda` | Núcleo | O3 | Adoptado | Drag & drop respeta reglas de capacidad. |

### 5.6 Instalación integral (BASE §73)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-085 | Concertar cita de instalación (visita confirmada) con asignación operativa. | INS-001 | Núcleo | O3 | Informado | OT de instalación con visita `confirmed` y recurso. |
| RF-TEC-086 | Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. | INS-004; BASE §73 tabla stock | Núcleo | O3 | Informado | Reserva reduce disponible; entrega mueve custodia una sola vez. |
| RF-TEC-087 | El instalador informa **En camino**; la app del socio muestra la novedad y la cita. | INS-002 | Núcleo | O3 | Informado | Notificación al socio; sin coordenadas. |
| RF-TEC-088 | Registrar llegada e inicio; verificar orden, domicilio y equipo (escaneo de serie/QR). | BASE §73 paso 5 | Núcleo | O3 | Informado | Serie no coincidente exige registrar sustitución. |
| RF-TEC-089 | Instalar, realizar pruebas (checklist por tecnología: potencia óptica, velocidad, señal Wi-Fi, ping) y registrar resultado, materiales y serie efectiva. | BASE §73 paso 6; INS-003 | Núcleo | O3 | Informado | Prueba fallida impide cerrar como instalada. |
| RF-TEC-090 | Sustitución de equipo: si el efectivo difiere del reservado, registrar y validar la sustitución sin adjudicar dos equipos. | BASE §73 controles | Núcleo | O3 | Informado | El reservado vuelve a disponible/custodia; solo el efectivo se aplica. |
| RF-TEC-091 | Mostrar el detalle de instalación (versión) y capturar firma/conformidad del receptor identificado (nombre, documento, relación con el titular), fecha/hora, instalador, equipo, trabajos, conformidad/disconformidad, observaciones, adjuntos; o registrar disconformidad/ausencia de firma con su procedimiento. | INS-003; BASE §73 firma | Núcleo | O3 | A validar (PA-TEC-07) | El documento aceptado queda inmutable con hash; modificación posterior genera nueva versión. |
| RF-TEC-092 | Aplicar el equipo desde la custodia del instalador a la prestación (salida a domicilio) y vincularlo al contrato/suministro con modalidad (comodato, venta, alquiler); la modalidad sale del plan, con comodato por defecto en Internet y TV (DEC-013). | INS-004; BASE §73 paso 8; DEC-013 | Núcleo | O3 | Informado | Aplicación única por `clientMutationId` y por OT. |
| RF-TEC-093 | Confirmar el **hito de activación** con fecha efectiva (día/hora y zona horaria) mediante el mecanismo autorizado por servicio (instalación probada + aprovisionamiento confirmado + revisión si aplica). | INS-006; BASE §17 regla; §73 paso 9 | Núcleo | O3 | A validar (PA-TEC-02) | Sin activación por mera agenda; evento `tec.installation.activationConfirmed`. |
| RF-TEC-094 | Disparar a M05/M04 la generación del cargo de instalación y el primer abono según reglas de devengamiento, promoción, prorrateo y modalidad anticipada/vencida. | INS-007; BASE §73 paso 10 | Núcleo | O4 | Informado | TEC no calcula importes; los ejemplos de §73 se validan en M05. |
| RF-TEC-095 | Enviar o disponibilizar la encuesta de satisfacción (T09) vinculada a visita, OT y servicio, posterior e independiente de la activación. | INS-005; BASE §73 paso 11 | Núcleo | O3 | Informado | La ausencia de respuesta no bloquea activación. |
| RF-TEC-096 | Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. | BASE §73 paso 12 | Estándar | O3 | A validar (PA-TEC-08) | Respuesta ≤ umbral crea caso de seguimiento. |
| RF-TEC-097 | Estados propios para ausencia de firma, falla de prueba e incidencia; prohibido marcar todo como realizado para cerrar la agenda. | BASE §73 | Núcleo | O3 | Informado | Transiciones explícitas en §8. |
| RF-TEC-098 | Visita fallida: el equipo se mantiene en custodia o se devuelve; no se registra instalado ni se vuelve a descontar. | BASE §73 tabla | Núcleo | O3 | Informado | Prueba ESC "visita fallida" verde. |
| RF-TEC-099 | Retiro posterior del equipo (baja, cambio, falla) con OT de retiro, condición del equipo y devolución a depósito/RMA; devolver el router no equivale a baja comercial. | BASE §73 tabla; §86 baja | Núcleo | O3 | Informado | Retiro genera movimiento domicilio → custodia → depósito. |
| RF-TEC-100 | Bandeja de instalaciones: pendientes de cita, citadas, en curso, ejecutadas sin activación, con conflicto, activadas, con encuesta pendiente. | BASE §86 indicadores | Núcleo | O3 | Adoptado | Contadores por estado y antigüedad. |
| RF-TEC-101 | Una sincronización repetida no genera otro cargo, otra instalación ni otra encuesta. | BASE §73 controles; AGR-016 | Núcleo | O3 | Informado | Reenvío del mismo lote devuelve `duplicate` por ítem. |

### 5.7 Cuadrillas, recursos y tipos de trabajo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-102 | ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. | RN-07 §1.7; CAT `CUADRI`, `PARTICUA`; INV `abm_Cuadri`, `abm_Cuadri_Particua` | Núcleo | O3 | Adoptado | Un integrante puede estar en varias cuadrillas con vigencia. |
| RF-TEC-103 | ABM de recursos de campo/responsables: nombre, actividad (técnico, lecturista, cobrador, inspector), mail, teléfono, usuario IAM vinculado, depósito/custodia propia, asigna OT a app, inactivo. Sin contraseñas propias (IAM T02). | CAT `RESPONSA`; RN-07 §1.7 | Núcleo | O3 | Adoptado | `PAS_RES` no se migra (CTR-TEC-27). |
| RF-TEC-104 | Responsables por servicio y operación (relación servicio-responsable) para sugerencia de asignación. | RN-07 §1.7 (`RELACION_ENTIDADES`); V2 #3084 | Estándar | O3 | Adoptado | Sugerencia ordenada por regla. |
| RF-TEC-105 | Reglas de notificación a responsables por servicio, tipo de orden, operaciones, días de semana, franja horaria, feriados y momento (al generar / al enviar a campo), con canal (WhatsApp, mail, SMS, push) y plantilla oficial. | RN-07 §1.7 (`RESPONSA_NOTIFICA`); V2 #3088, #3105 | Estándar | O3 | Adoptado | Guardia fuera de horario recibe aviso. |
| RF-TEC-106 | Profesionales/instaladores matriculados: matrícula, documento, servicio, categoría de instalador, contacto, domicilio; certificado y vencimiento en la OT con validación configurable (no exigir / advertir / exigir). La validación la gobierna un único parámetro, PRM-TEC-043, por servicio y jurisdicción; M02 lo lee en el alta del contrato (HUE-ELE-04, RN-TEC-114). | CAT `PROFESIO`; RN-07 §1.3; V2 #2421; HUE-ELE-04 | Estándar | O7 | Adoptado | Certificado vencido se advierte o bloquea. En ELE con jurisdicción Córdoba (Ley 10281) el default bloquea el cierre sin certificado vigente. |
| RF-TEC-107 | Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. | CAT `TPTRAB`; INV `abm_Tptrab` | Núcleo | O3 | Adoptado | Enum único `kind`. |
| RF-TEC-108 | Categorías de incidente con rubro, servicio, operación por defecto y cuentas contables (debe/haber), con distribución por sección. | CAT `CAT_INCI`; INV `abm_Cat_Insi` | Estándar | O3 | Adoptado | Cuentas referencian plan de M15. |
| RF-TEC-109 | Resoluciones por servicio + operación más genéricas (sin servicio). | CAT `RESOL_OT`; RN-07 §Reglas adicionales | Núcleo | O3 | Adoptado | Selector muestra específicas + genéricas. |
| RF-TEC-110 | Catálogo de tareas y grupos de tareas por servicio. | CAT `TAREAS`, `TAREASOM`, `GRPTAREA`; INV `abm_TareasOm` | Estándar | O3 | Adoptado | Unifica `TAREAS` y `TAREASOM` (CTR-TEC-28). |
| RF-TEC-111 | Vías de ingreso de OT (teléfono, mostrador, web, app, WhatsApp, API) con validación de celular/mail y vía por defecto; solicitar vía al crear según parámetro. | CAT `VIAINGTE`; V2 #333, #2629 | Estándar | O3 | Adoptado | Usa el catálogo `crmChannels` de M09 (CTR-DAT-77); M10 no mantiene uno propio. |

### 5.8 App de campo offline-first (perfiles técnico / lecturista / cobrador)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-112 | Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. | DFA M27 mejora; BASE §73 límite; CNX §3.8 | Núcleo | O3 | Informado | Un usuario con dos perfiles elige perfil activo. |
| RF-TEC-113 | Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. | AGR-025; CNX §3.8 `/mi-dia` | Núcleo | O3 | Adoptado | Cada paquete descargado lleva `serverVersion`. |
| RF-TEC-114 | Cola única de mutaciones en IndexedDB con `clientMutationId`, fotos/evidencias en IndexedDB, envío por lotes a `/sync` con resultado por ítem, reintento automático y botón "Reintentar" en banner único. | CNX §3.7 [COPIAR][MEJORAR] | Núcleo | O3 | Adoptado | Cortes de red no pierden datos; reenvío no duplica. |
| RF-TEC-115 | No encolar login, administración ni operaciones con riesgo de duplicado no idempotente. | CNX §3.7 | Núcleo | O3 | Adoptado | Esas acciones se deshabilitan offline con mensaje. |
| RF-TEC-116 | Fotos con marca de fecha/hora, GPS y orientación; foto obligatoria por paso configurable; compresión y límite de tamaño. | DFA M14 mejora; BASE §17 ("Capturar fotografías") | Núcleo | O3 | Informado | Paso obligatorio sin foto no permite avanzar. |
| RF-TEC-117 | Captura de GPS del dispositivo con permiso explícito y alternativa manual; precisión registrada. | BASE §77 (GEO-F6) | Núcleo | O3 | Informado | Sin permiso se registra "sin GPS" y se permite continuar si la regla lo admite. |
| RF-TEC-118 | Firma del receptor en pantalla y datos de identificación (RF-TEC-091) offline, con hash del detalle presentado. | INS-003; V2 #50 | Núcleo | O3 | Informado | La firma se asocia a la versión del detalle. |
| RF-TEC-119 | Registro de materiales usados desde la custodia del técnico (lista de su stock) que descuentan stock al sincronizar en M13. | DFA M14 mejora; BASE §73 | Núcleo | O3 | Informado | Material no disponible en custodia se marca para revisión, no se bloquea el trabajo. |
| RF-TEC-120 | Cierre con lectura de medidor cuando aplica (servicios medidos) usando el componente de lectura de M03. | DFA M14 mejora | Estándar | O7 | Adoptado | Lectura validada por reglas de M03. |
| RF-TEC-121 | Crear OT desde campo (anomalía, reclamo en sitio, cambio de medidor de servicio no medido) si parámetros lo permiten. | V2 #2, #30, #70 | Estándar | O3 | Adoptado | OT creada offline obtiene número al sincronizar. |
| RF-TEC-122 | Cerrar OT desde la app (si V2 #48), cerrar operaciones seleccionadas en lote (V2 #54), confirmación al cancelar (V2 #62), mostrar número de medidor en lista (V2 #64). | V2 #48, #54, #62, #64 | Estándar | O3 | Adoptado | Comportamientos configurables por tenant. |
| RF-TEC-123 | Encuesta/conformidad al cierre en sitio (V2 #51) limitada a la conformidad del receptor; la encuesta de satisfacción es posterior por canal del socio. | V2 #51; BASE §73 (CTR-TEC-15) | Núcleo | O3 | Adoptado | Ver CTR-TEC-15. |
| RF-TEC-124 | **Conflictos de sincronización**: versionar la tarea descargada; al recibir una mutación sobre versión desactualizada (OT cancelada, reasignada, equipo cambiado, titular modificado) conservar ambas evidencias, crear conflicto con responsable y no sobrescribir sin revisión. | AGR-025; ESC-03 | Núcleo | O3 | Adoptado | ESC-03 superado (§17). |
| RF-TEC-125 | Registrar fecha real de intervención (dispositivo) y fecha de recepción (servidor); validar desvío de reloj. | AGR-010; AGR-025 | Núcleo | O3 | Adoptado | Desvío > umbral marca la mutación para revisión. |
| RF-TEC-126 | Bloqueo de OT enviadas a campo o a sistema externo (AION/otros) para evitar doble cierre; desbloqueo con capability. | RN-07 §1.7 (`BLOQUEAR`); V2 #2811, #3086 | Núcleo | O3 | Adoptado | OT bloqueada no se confirma masivamente en admin. |
| RF-TEC-127 | No sincronizar órdenes modificadas en servidor sin aviso al técnico (V2 #57 reemplazado por conflicto/actualización con aviso). | V2 #57 | Estándar | O3 | Adoptado | El técnico ve "Orden actualizada" antes de ejecutar. |
| RF-TEC-128 | Registro de dispositivos de campo (modelo, versión de app, último sync, usuario) y revocación remota que purga datos locales. | FIC 4 (`GetVersionCode`); T08 | Estándar | O3 | Adoptado | Dispositivo revocado no puede sincronizar. |
| RF-TEC-129 | Formularios/checklists de campo configurables (motor de relevamientos CNX) embebidos en la OT (hasta 3 formularios por visita), con check-in GPS y geocerca opcional. | CNX §7.7, §7.8 | Estándar | O3 | Adoptado | Respuestas versionadas por formulario. |
| RF-TEC-130 | Mapa del técnico con sus visitas del día, red cercana y navegación externa (abrir en Google Maps). | CNX §3.8; BASE §77 | Estándar | O3 | Adoptado | Sin conexión muestra lista y último mapa cacheado permitido. |
| RF-TEC-131 | Sistema de AVL/flota opcional para recorridos y kilometraje del vehículo, sin exponer ubicación al socio. | MER-015; V2 #341, #430 | Extensión | O10 | Adoptado | Integración en M18. |

### 5.9 Cortes y reconexiones ejecutados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-132 | Recibir órdenes de corte/suspensión/reconexión de M08 (mora) y de M09 (solicitud del socio) y crear OT (`disconnect`/`reconnect`) con marca moroso y origen gestión de mora, o comando remoto si el servicio admite corte remoto. | RN-07 §4; MER-019; MER-017 | Núcleo | O6 | Informado | Ninguna acción de red sin origen CRM/mora autorizado. |
| RF-TEC-133 | Generar OT de corte por mora sin observación técnica completa si el parámetro lo permite. | V2 #2694 | Estándar | O6 | Adoptado | Con el parámetro activo, una OT de corte por mora se genera aunque falte la observación técnica y queda marcada como tal; con el parámetro inactivo la generación se rechaza indicando el dato faltante. |
| RF-TEC-134 | Reconexión automática tras regularización: cerrar y reconectar en un paso (`reconnect`) con comando remoto; si no hay sistema remoto vigente, la OT queda pendiente para cuadrilla (DEC-014: automática en servicios remotos al confirmarse el pago; OT automática si requiere técnico). | RN-07 §4 (`Confirmar_OT_Reconectar`), §4 (vuelve a Pendiente); DEC-014 | Núcleo | O6 | Adoptado | Evento `tec.reconnection.executed` con fecha efectiva. |
| RF-TEC-135 | Informar a M08 el resultado de cada corte/reconexión (ejecutado, no ejecutado con motivo: sin acceso, medidor inaccesible, socio pagó en sitio, error de sistema remoto). | MER-019; BASE §68 (controles, M08) | Núcleo | O6 | Adoptado | M08 recibe evento por cada orden. |
| RF-TEC-136 | Notificar al socio el cierre de OT de desconexión por SMS/WhatsApp/mail según configuración. | RN-07 §1.7 (`NotificarCierreOt`) | Estándar | O6 | Adoptado | Constancia en T09. |
| RF-TEC-137 | Cortes masivos con vista de a quién ya se generó la orden y exclusión de servicios con orden en curso. | RN-07 §Reglas adicionales (`Get_ServiciosNotificados`) | Estándar | O6 | Adoptado | Sin duplicados. |
| RF-TEC-238 | **Suspensión restringida por mora** (modo `restricted` de M08): cuando `mor.interruption.approved` (EVT-MOR-12) llega con `serviceMode = restricted`, TEC ejecuta el perfil de restricción en lugar del corte: AG **reducción de caudal** (`reducedFlow`, RN-MOR-139) con OT de efecto `flowRestriction` (colocación de limitador o regulación de válvula, caudal resultante medido, precinto en `seals` y evidencia), sin bajar del caudal mínimo vital de PRM-MOR-201; TEL bloqueo de llamadas salientes y TV grilla mínima por comando de aprovisionamiento (RN-MOR-137, RN-MOR-138). La rehabilitación es la operación inversa (`flowRestore` o comando `resume`) al llegar la reconexión. El resultado vuelve a M08 con `tec.disconnection.executed` indicando `mode = restricted` y el caudal o perfil aplicado. | RN-MOR-139; RF-MOR-222; HUE-AG-02 | Estándar | O7 (AG) / O10 (TEL, TV) | Adoptado | Una OT de reducción de caudal no se cierra sin el caudal resultante medido ni con un valor menor al mínimo vital; una orden `restricted` de un servicio sin perfil configurado queda en `pending` con `tec.workOrder.closeRequirementsMissing` y M08 recibe "no ejecutada" con motivo. |
| RF-TEC-239 | **Entrega de gas envasado** (variante "envasado" del servicio GAS, DEC-082; solo si PRM-CAT-112 está habilitado): la venta de garrafas o cilindros (M13 stock, M05 comprobante) genera una OT de tipo operación `bottledGasDelivery` con domicilio de entrega, cantidad por tipo de envase y franja; el técnico o repartidor registra en campo los envases entregados (`serialUnitId` si el envase es serializado) y los vacíos retirados, firma o constancia de recepción y evidencia. Sin medidor, sin factibilidad de red, sin DDJJ de artefactos ni corrección de volumen. El cierre informa a M13 el egreso del depósito o vehículo (`warehouseId`, `vehicleId`) y el retorno de vacíos. | DEC-082; HUE-GAS-02; M02 6.C.7; PRM-CAT-112 | Estándar | O8 | Adoptado | Una entrega de 2 garrafas de 10 kg con 2 vacíos retirados cierra la OT con egreso de 2 llenas y alta de 2 vacías en M13; con PRM-CAT-112 en `false` el tipo de operación no está disponible. |

### 5.10 Mantenimiento, infraestructura y mapas (BASE §18)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-138 | Inventariar infraestructura por ubicación como elementos de red (válvulas, transformadores, nodos, postes, cámaras) con marca, modelo, serie, características técnicas, fecha de instalación y sustitución. | BASE §18; CAT `NIV_REDES` | Núcleo | O7 | Informado | Precarga VAL-001. |
| RF-TEC-139 | Relacionar activos y componentes (jerarquía y relaciones permitidas). | BASE §18 | Núcleo | O7 | Informado | Ver RF-TEC-148. |
| RF-TEC-140 | Planes de mantenimiento preventivo por activo o tipo de componente con frecuencia (semanal, mensual, bimestral, trimestral, cuatrimestral, semestral, anual o cada N días), margen anterior/posterior y generación automática de OT de mantenimiento. | BASE §18 CU-18; RN-07 §7 (patrón de frecuencias) | Núcleo | O7 | Informado | Job `tec:generar-mantenimiento` crea la próxima OT al alcanzarse fecha − margen. |
| RF-TEC-141 | Gestionar averías como OT correctivas vinculadas a incidentes/reclamos sin ocultar el preventivo programado original. | BASE §18 CU-18 excepción | Núcleo | O7 | Informado | Preventivo y correctivo coexisten. |
| RF-TEC-142 | Registrar intervenciones, tareas, materiales y resultado por activo; programar el próximo control. | BASE §18 | Núcleo | O7 | Informado | Historial por activo. |
| RF-TEC-143 | Consultar historial y costo por activo (materiales, horas, vehículos). | BASE §18 | Estándar | O7 | Informado | Informe de costo acumulado por período. |
| RF-TEC-144 | Planificar interrupciones (tramo, elemento, fecha/hora inicio/fin, motivo), con aprobación y aviso masivo a contratos afectados. | BASE §18; DFA M15 mejora | Núcleo | O7 | Informado | Aviso vía T09 con constancia. |
| RF-TEC-145 | Identificar contratos potencialmente afectados por un elemento o zona (análisis de impacto aguas abajo). | BASE §18; DFA M15 mejora | Núcleo | O7 | Informado | Ver RF-TEC-156. |
| RF-TEC-146 | Visualizar infraestructura, suministros, OT, reclamos y visitas en mapa web con capas activables. | BASE §18; DFA M15 mejora | Núcleo | O7 | Informado | Capa de OT disponible desde O3. |
| RF-TEC-147 | Documentación técnica adjunta por activo (planos, manuales, fotos) y control de garantías y vencimientos (con M13 para RMA). | BASE §18; MER-020 | Estándar | O7 | Informado | Alertas de vencimiento. |

### 5.11 Red / GIS

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-148 | Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. | RN-07 §5.2; CAT `REDES`, `REDES_SERVICIOS` | Núcleo | O7 | Adoptado | Una red puede servir a varios servicios. |
| RF-TEC-149 | Capas por red (MT, BT, troncal, distribución); componentes y relaciones sin capa son comunes a todas las capas. | RN-07 §5.2; CAT `REDES_CAPAS` | Núcleo | O7 | Adoptado | Consulta por capa incluye comunes. |
| RF-TEC-150 | Tipos de componente con ícono, permite conectar servicios, múltiples conexiones, múltiples elementos (rango), nombre de los elementos (bornes/pares/puertos), distribuye en hijos. | CAT `REDES_COMPONENTES`; RN-07 §5.2 | Núcleo | O7 | Adoptado | "Transformador" es un componente configurado (no entidad fija). |
| RF-TEC-151 | Relaciones permitidas padre → hijo entre componentes por red/capa; la red instalada solo admite relaciones permitidas. | CAT `REDES_RELACIONES_COMPONENTES` | Núcleo | O7 | Adoptado | Alta de nodo con padre no permitido se rechaza. |
| RF-TEC-152 | Atributos tipados por componente: texto (largo), entero, decimal (N decimales), fecha, booleano, lista, referencia a catálogo del sistema (lista blanca, no reflexión), visible sí/no. | CAT `REDES_ATRIBUTOS_COMPONENTES`, `REDES_ATRIBUTOS`; RN-07 §5.2 | Núcleo | O7 | Adoptado | Potencia kVA, tensión, fases como atributos. |
| RF-TEC-153 | Red instalada: elementos con padre, componente, capa, descripción, número, rango inicial–final, geometría (punto/línea/polígono GeoJSON), domicilio, estado (Disponible, Utilizado, Dañado, No aplica, Planificado, Retirado), activo. Alta simple y múltiple. | CAT `REDES_RED_INSTALADA`; INV `frmRedes_RedInstalada_*` | Núcleo | O7 | Adoptado | Coordenadas numéricas (no texto con coma). |
| RF-TEC-154 | No borrar elementos con servicios conectados o hijos; retirar con fecha y motivo. | RN-07 §5.2 (borrado sin verificar) | Núcleo | O7 | Adoptado | 409 si tiene conexiones vigentes. |
| RF-TEC-155 | Vínculo servicio-red con historial (fecha de conexión/desconexión, estado, observaciones), validando que el punto admita conexión, tenga capacidad (rango/múltiple), esté en estado utilizable y que el servicio no esté conectado a otro punto de la misma red/capa. | RN-07 §5.1, §5.2; CAT `SERSOC_REDES`; V2 #401 | Núcleo | O3 (Internet) / O7 | Adoptado | Exigir punto de conexión en OT según V2 #401. |
| RF-TEC-156 | Análisis de impacto: dado un elemento (p. ej. transformador) o un conjunto, listar servicios, contratos, titulares y servicios críticos (electrodependientes, grandes usuarios) aguas abajo, con conteo y exportación, y lanzar aviso masivo. | DFA M15 mejora; BASE §18 | Núcleo | O7 | Adoptado | Resultado en < 5 s para 50.000 suministros. |
| RF-TEC-157 | Descripción del punto de conexión del servicio recorriendo ancestros ("Red \| Capa \| Nodo → Padre → …"). | RN-07 §5.2 | Estándar | O7 | Adoptado | Visible en ficha del servicio. |
| RF-TEC-158 | Informes de red: estructura, red instalada, red conectada por servicio (incluye ancestros), cuentas sin conexión a red física (corrigiendo el bug de reconexión a otro nodo), cuentas conectadas por punto (con filtro de rango de consumos y suma), conexiones disponibles (considerando estado y capacidad). | RN-07 §5.2 informes | Estándar | O7 | Adoptado | Corrección de bugs verificada en pruebas. |
| RF-TEC-159 | Migrar la red v1 (niveles por capa, nodos con padre, disponibilidad) a la red genérica. | RN-07 §5.1; CAT `NIV_*` | Estándar | O7 | Adoptado | Ver §19. |
| RF-TEC-160 | Exportar red y elementos a KML y GeoJSON (puntos con ícono por componente, líneas padre→hijo); importar parcelas/capas GIS (shapefile/GeoJSON/KML). | RN-07 §5.3; FIC 16; RN-10 §10 | Estándar | O7 | Adoptado | Coordenadas con punto decimal. |
| RF-TEC-161 | Exportaciones GIS a sistemas externos y reguladores como **plantillas configurables** (usuarios, consumos, movimientos altas/bajas, activos, RTI OCEBA), sin códigos de concepto/categoría fijos: mapeos por tenant. | RN-07 §5.4; V2 #2933, #2823 | Estándar | O7 | Adoptado | Las 10 variantes de ProCoop se reproducen como plantillas de ejemplo. |
| RF-TEC-162 | Marca "con dato GIS" por servicio y servicios a usar en mapas GIS. | CAT `SERSOC_EXTRAS.GIS`; V2 #2425 | Estándar | O7 | Adoptado | Filtro en mapa. |
| RF-TEC-163 | Edición de red en mapa (dibujar elemento, mover, conectar) además de árbol jerárquico. | DFA M15 mejora | Estándar | O7 | Adoptado | Cambios versionados con autor. |

### 5.12 Equipos de red y centrales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-164 | Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema de aprovisionamiento asociado. | DFA M15 (`EQUIPOS`, `CENTRALT`); CAT `MIKROTIK`; BASE §86 | Núcleo | O3 | Adoptado | Credenciales solo en bóveda T06 (CTR-TEC-29). |
| RF-TEC-165 | Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. | RN-10 §9; BASE §86 ("no exponer secretos") | Núcleo | O3 | Adoptado | Acceso a secretos auditado. |
| RF-TEC-166 | Monitoreo de nodos y equipos (estado arriba/abajo vía integración) asociado a incidentes de zona en M09. | MER-017 | Estándar | O3 | Adoptado | Caída de OLT crea/propone incidente de zona con impacto. |
| RF-TEC-167 | Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. | BASE §86 (recurso de conexión); RN-07 §1.11 (OLT, SLOT, PORT, VPORT) | Núcleo | O3 | Adoptado | Asignación de puerto en la OT de instalación. |

### 5.13 Obras, loteos y contribución por mejoras (MER-009)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-168 | Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. | CAT `OBRAS`; MER-009; INV `abm_Obras` | Núcleo | O7 | Informado | Desvío presupuesto vs real visible. |
| RF-TEC-169 | Grupos de obra con cuentas contables y distribución % por sección (suma 100 %). | CAT `GRPOBRA`; RN-07 §2 (`clsGrpObra`) | Estándar | O7 | Adoptado | Validación de 100 %. |
| RF-TEC-170 | Órdenes de mantenimiento sobre obra (`maintenance`) con materiales imputados a la obra y vales. | RN-07 §1.1, §1.8 | Núcleo | O7 | Adoptado | Informe de recursos asignados a obras. |
| RF-TEC-171 | Base de aprobación obligatoria para cobrar (ordenanza, convenio, asamblea) adjunta y vigente. | MER-009 límite | Núcleo | O7 | Informado | Sin base aprobada no se habilita el prorrateo. |
| RF-TEC-172 | Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. | MER-009 | Núcleo | O7 | Informado | ExcelImportWizard con validación de inmueble. |
| RF-TEC-173 | Prorrateo por metros de frente, superficie, partes iguales, unidades u otro criterio explícito; simulación y aprobación; envío a M05/M08 para facturar en cuotas o plan de pago. **Precisión (HUECO-OBR-01):** al aprobar, TEC publica EVT-TEC-25 `tec.levy.approved` con un renglón por beneficiario (inmueble, cuenta, titular, importe, cantidad de cuotas). Lo consumen **M02**, que crea un contrato tipo 17 (contribución por obra) por beneficiario (API-CAT-33; JOB-CAT-13 `cat:crear-contratos-obra`, RF-CAT-115, idempotente por obra + inmueble), y **M04**, que crea el `worksInstallmentPlans` de cada contrato; M05 factura las cuotas por el contrato y T09 avisa al frentista. M08 no consume el evento: el convenio de M08 solo refinancia cuotas vencidas (RN-TEC-115, HUECO-OBR-02). | MER-009; HUECO-OBR-01 | Núcleo | O7 | A validar (PA-TEC-16) | Suma de cuotas = costo a distribuir (redondeo explícito). Reenviar el mismo evento no duplica contratos ni planes (clave obra + inmueble). |
| RF-TEC-174 | Loteos: alta de red y puntos de conexión del loteo antes de existir las calles en catálogo (texto + punto para revisión). | MER-009; BASE §77 CU-GEO-01 | Estándar | O7 | Adoptado | Calle pendiente queda en revisión de T04. |
| RF-TEC-175 | Expedientes de trámites técnicos (presentación de planos, certificado de instalador, habilitaciones) con etapas, resolución, adjuntos y fechas. | CAT `EXPEDIENTES`, `EXPEDIENTES_TRAM` | Estándar | O7 | Adoptado | Etapas con estado y resolución. |

### 5.14 Inspecciones y consumo no registrado (MER-004)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-176 | Casos de inspección por alerta de patrón de consumo (M03), denuncia, hallazgo de lecturista o plan de control; una sospecha no es infracción. | MER-004 | Núcleo | O7 | Informado | Estado inicial `suspected`. |
| RF-TEC-177 | OT de inspección con acta (checklist configurable por servicio), fotos, GPS, testigos, firma del usuario o constancia de negativa. | MER-004 | Núcleo | O7 | Informado | Acta inmutable con hash. |
| RF-TEC-178 | Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. | MER-004 | Estándar | O7 | Informado | Un precinto no se coloca dos veces. |
| RF-TEC-179 | Notificación al usuario y registro de descargo dentro del plazo configurable. | MER-004 | Núcleo | O7 | Informado | Sin descargo vencido el plazo se habilita propuesta. |
| RF-TEC-180 | Propuesta de recupero según método aprobado (versionado por régimen del servicio) calculada por M04, con aprobación obligatoria; facturación separada por M05; nunca automática. | MER-004 límite | Núcleo | O7 | A validar (PA-TEC-15) | Sin aprobación no hay documento. |
| RF-TEC-181 | Seguimiento del caso hasta regularización, con reincidencias y estadística por zona. | MER-004 | Estándar | O7 | Informado | Indicadores en §15. |

### 5.15 Aprovisionamiento de Internet/TV (BASE §86, MER-017)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-182 | Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo consultas, eliminar usuario al dar de baja, perfil de desconectado. | RN-10 §9; FIC 17; V2 #2393, #2897, #3165, #3189, #3034, #3035 | Núcleo | O3 | Adoptado | Prueba de conexión desde la pantalla. |
| RF-TEC-183 | Perfiles de aprovisionamiento: mapeo plan comercial (M02) → perfil técnico por sistema (velocidad subida/bajada, VLAN, pool IP, perfil PPPoE/queue, perfil ONU). **Perfiles técnicos de TV (HUE-TV-04):** para planes de TV el perfil declara el paquete técnico (`tvPackageCode`), las señales o grilla que incluye (`channelLineupRef`), la cantidad de decodificadores incluidos y el máximo admitido (`includedDecoders`, `maxDecoders`) y el **mapeo plan → paquete CAS** (`casPackageIds[]` por sistema de acceso condicional); los adicionales (paquetes premium, decodificador adicional) se mapean como perfiles complementarios del mismo plan. El comando hacia el CAS sigue el contrato de T06 FI-INT-86. | BASE §86 (plan con tecnología y velocidades); HUE-TV-04 | Núcleo | O3 (TV: O10) | Adoptado | Cambio de plan resuelve perfil destino. En TV, un plan sin `casPackageIds` para el sistema configurado no se puede activar (error `tec.provisioning.profileMissing`); pedir un decodificador por encima de `maxDecoders` se rechaza. |
| RF-TEC-184 | Perfil técnico del servicio: identificador de acceso (usuario PPPoE, generado), clave en bóveda, MAC, IP fija/dinámica, AP/nodo, OLT/slot/puerto/vport, serie ONU/CPE, terminal, posición, datos de partner, fecha y usuario de registro. | CAT `INTERNET`; RN-07 §1.11; V2 #2422 | Núcleo | O3 | Adoptado | Secretos nunca en BI ni API pública. |
| RF-TEC-185 | Comandos de aprovisionamiento durables e idempotentes: `activate`, `changePlan`, `suspend`, `reactivate`, `deactivate`, `delete`, `query`, `resetCredentials`, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). | AGR-016; MER-017; CAT `TELEMED_COMM` | Núcleo | O3 | Adoptado | Reintento no duplica; resultado confirmado o pendiente manual. |
| RF-TEC-186 | Alta: al confirmar instalación se emite `activate`; el hito de activación espera confirmación del sistema (o registro manual autorizado). | BASE §86; §73 | Núcleo | O3 | A validar (PA-TEC-02, PA-TEC-09) | Sin confirmación la instalación queda `executed` pendiente de aprovisionar. |
| RF-TEC-187 | Corte/suspensión por mora y reactivación (desde M08), cambio de plan con fecha efectiva (desde M09/contrato), baja con desconexión y retiro de equipo. | BASE §86 casos; MER-017 | Núcleo | O6 | Informado | Evento por resultado al módulo origen. |
| RF-TEC-188 | Fallback manual: cuando no hay integración o falla definitivamente, generar tarea al NOC con datos y registrar ejecución manual con evidencia. | BASE §86 ("integración autorizada o registro técnico") | Núcleo | O3 | Adoptado | Tarea manual con SLA y confirmación. |
| RF-TEC-189 | Exportación masiva para OLT (CSV con OLT, SLOT, PORT, VPORT y acción 0 desconexión / 1 alta-otros) como plantilla. | RN-07 §1.11 (`ExportarArchivo`) | Estándar | O3 | Adoptado | Archivo `Alta_Desconexion_ddMMyyyy.csv`, separador `;`. |
| RF-TEC-190 | Sincronización con sistemas externos de clientes y servicios (AION y equivalentes): clientes, servicios, servicios de socio, con conciliación de diferencias. | INV `frmSincronizacionAION` | Estándar | O3 | Adoptado | Reporte de diferencias sin sobrescritura automática. |
| RF-TEC-191 | Identificador externo por contrato/conexión (no por cuenta) y tabla de correspondencia por sistema. | RN-07 §4 (SITSA usa cuenta); BASE §86 ejemplo hermanos | Núcleo | O3 | Adoptado | Baja de B no apaga A (BASE §86 ejemplo). |
| RF-TEC-192 | Diagnóstico desde la ficha (consultar estado de sesión, señal ONU, último login) vía `query`, visible a NOC y atención con permiso. | BASE §86 (diagnóstico) | Estándar | O3 | Adoptado | Resultado no se persiste como medición facturable. |
| RF-TEC-193 | Medición de tráfico/uso solo si existe fuente definida; no convierte GB en cargo sin regla. | BASE §86; §50 control | Estándar | O3 | Informado | Sin fuente, la app del socio no muestra consumo. |
| RF-TEC-194 | Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos `activate`, `changePlan`, `suspend`, `reactivate` y `deactivate` operan por decodificador y paquete CAS según el perfil técnico de TV de RF-TEC-183 (HUE-TV-04). | FIC 17; HUE-TV-04 | Estándar | O10 | Adoptado | Mismo modelo de comandos. Suspender una cuenta de TV con dos decodificadores genera un comando por decodificador con el mismo `commandId` de origen. |
| RF-TEC-195 | Casillas de correo provistas como servicio (usuario, dominio, otros) con clave en bóveda. El correo electrónico y el pack SMS son servicios del catálogo M02 con aprovisionamiento por T06 y control de cupo y consumo en M04 (DEC-084); M10 solo registra los datos técnicos de la casilla. **Contrato de consumo hacia M04 (RN-TAR-251):** M10 consume EVT-INT-24 `int.serviceUsage.received` de T06 (o una importación manual por archivo con el mismo formato), atribuye cada línea al contrato por la referencia externa de la casilla o del pack (`serviceTechnicalProfiles`), la registra en `mobileUsageImports` con `kind = ticQuota` (§7.20) y publica EVT-TEC-38 `tec.quotaUsage.reported`; M04 lee el consumo del período con API-TEC-56. Líneas sin contrato quedan `unattributed` en la bandeja de técnica y no llegan a M04. | CAT `CORREOSINT`; DEC-084; RN-TAR-251 | Extensión | O10 | Adoptado | Claves no se migran en claro. Un informe de 260 SMS del período 10/2026 para la línea del pack de un contrato llega a M04 como un único consumo (`unit = sms`, `quantity = 260`); un reenvío del mismo archivo no duplica el consumo; una corrección del proveedor para el mismo período reemplaza la cantidad con `revision` + 1 mientras el período no esté facturado. |
| RF-TEC-196 | Comandos de telemedición/medición inteligente desde la OT (conectar, desconectar, tomar lectura, vincular/desvincular medidor, alta de cuenta, cambio de categoría, carga de crédito, consulta de datos, cambio de usuario/clave del portal externo) delegados a M03 con resultado explícito. | RN-07 §4 (Discar, telemetría); INV `ComandosDiscar`, `ComandosNexo`, `ComandosTelemedicion`; V2 #3175 | Estándar | O7 | Adoptado | "Operación cancelada por el usuario" no es éxito (CTR-TEC-25). |

### 5.16 Telefonía (MER-017; tasación en M04)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-197 | Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición anterior, puerto DSLAM, puerto central), cajas (GPS), regletas de caja, posiciones de caja, DSLAM (marca, modelo, serie) y puertos; estados Disponible / No disponible / Inactivo; conexiones entrante/saliente y conexión masiva. | RN-07 §8.1; CAT §12 `TEL_*` | Núcleo | O10 | Adoptado | No se conecta una posición inactiva. |
| RF-TEC-198 | Servicio conectado a una posición de caja seleccionable al crear la OT entre puntos disponibles. | RN-07 §8.1 (`Get_PuntoConexionDisponibles`) | Núcleo | O10 | Adoptado | Posición ocupada no se ofrece. |
| RF-TEC-199 | KML de central, repartidor y cajas. | RN-07 §5.3 | Estándar | O10 | Adoptado | La exportación KML de una central contiene una marca por central, repartidor y caja con su identificador y coordenadas; los elementos sin coordenadas se informan aparte y no se exportan. |
| RF-TEC-200 | Prefijos locales y pool de números con alta/baja por rango, validación de superposición, estados disponible/reservado/asignado/cuarentena/retirado; baja solo de no asignados (lógica, no física). | RN-07 §8.1, §8.10 | Núcleo | O10 | Adoptado | Rango superpuesto rechazado. |
| RF-TEC-201 | Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea conservando el plan. | RN-07 §8.1, §8.10 | Núcleo | O10 | Adoptado | Validación por intervalo de fechas (no solo línea abierta). |
| RF-TEC-202 | Reserva de números propuestos en OT abiertas. | RN-07 §8.10 (`GetNumerosEnOT`) | Estándar | O10 | Adoptado | Número reservado no se ofrece a otra OT. |
| RF-TEC-203 | Telefonía prepaga: categoría prepaga y recarga mediante OT/operación de recarga y concepto de crédito. | RN-07 §8.1; V2 #236, #238, #332, #2099 | Estándar | O10 | Adoptado | Recarga como operación `prepaidTopUp`. |
| RF-TEC-204 | Plan de numeración ENACOM (número completo, localidad, provincia, indicativo, bloque, operador, servicio, modalidad con flag móvil, clave, local) importable desde planilla, creando operadores/servicios/modalidades nuevos sin distinguir mayúsculas; número = 0+indicativo+bloque o 0+indicativo+15+bloque si móvil. | RN-07 §8.2, §8.10; CAT `CARACTER`, `OPERADOR`, `TEL_SERVICIO`, `TEL_MODALIDAD` | Núcleo | O10 | Adoptado | Búsqueda por prefijo más largo con índice (no stored procedures). |
| RF-TEC-205 | Importación de CDR por central según modalidad (≈35 formatos y descargas online sin archivo): lectores como plugins; salientes y entrantes; lote por central (cabecera o último + 1); origen con "0"; segundos/clave del archivo según central; error de fila aborta el archivo con número de fila. | RN-07 §8.3, §8.10; FIC 17 | Núcleo | O10 | A validar (PA-TEC-13) | Cada formato habilitado tiene archivo de prueba. |
| RF-TEC-206 | Detección de duplicados por (origen, destino, fecha, segundos) con decisión de reprocesar; reutilizar identidad de las ya existentes. | RN-07 §8.3; V2 #2302 | Núcleo | O10 | Adoptado | Reimportar el mismo archivo no duplica. |
| RF-TEC-207 | Atribución de origen al número vigente a la fecha (0 → "origen no encontrado"; >1 → "duplicado") y de entrantes al destinatario (con y sin prefijo); asignación manual de no atribuidas; borrado/reversión de lote solo si no está agrupado/facturado. | RN-07 §8.3 | Núcleo | O10 | Adoptado | Reversión bloqueada tras agrupación en M05. |
| RF-TEC-208 | Exclusión de números en importadores (Lucent) e importe 0 para Telco IP clave 99 como reglas configurables por lector. | V2 #2444, #2346 | Estándar | O10 | Adoptado | Con la regla de exclusión configurada en el lector, los números excluidos no generan registros importados y los de Telco IP clave 99 se importan con importe 0; sin la regla se importan normalmente. |
| RF-TEC-209 | Importación de archivos CPP de operadoras (CPP, CP2, CP4, CP5, CP6) e internacionales de carrier (TRL, carga manual con control de repetidos) con operador por defecto. | RN-07 §8.5, §8.6; V2 #2295 | Estándar | O10 | Adoptado | Liquidación CVLP en M05/M06. |
| RF-TEC-210 | Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. | RN-07 §8.8; FIC 17; V2 #301, #2253, #13 | Extensión | O10 | A validar (PA-TEC-14) | Línea sin servicio queda en pendientes de asignar. |
| RF-TEC-211 | Envío de llamadas atribuidas a tasación (M04) y recepción del resultado; retasación solo de no agrupadas. | RN-07 §8.4, §8.10 | Núcleo | O10 | Adoptado | Evento `tec.cdr.attributed`. |
| RF-TEC-212 | Guía telefónica (tradicional, compacta A/B, Excel) de titulares que desean figurar. | RN-07 §8.1 | Estándar | O10 | Adoptado | Respeta consentimiento. |
| RF-TEC-237 | **Consulta de llamadas atribuidas por contrato y período** (para el detalle de llamadas del portal, M19 API-POR-122 y PAN-POR-103, y para la atención en M09): API interna de solo lectura (API-TEC-55) que devuelve las `callRecords` con `attributionStatus = attributed` del contrato en el período facturado (`period` `YYYY-MM` según T05) con fecha y hora, destino **enmascarado** (últimos 4 dígitos visibles salvo permiso interno), tipo (`regular`, `international`, `cpp`), duración en segundos y `ratingRef`. El importe tasado lo agrega M19 desde M04 (`phoneRates`); TEC no calcula importes. Paginada, con totales por tipo. | HUE-TEL-02; M19 API-POR-122; RN-07 §8.1 | Estándar | O10 | Adoptado | Para el contrato TEL-DEMO-01 y el período 2026-10 la API devuelve solo llamadas atribuidas a ese contrato, con destino enmascarado para el socio; un contrato de otro titular responde 404 aunque el ID exista. |
| RF-TEC-213 | Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. | RN-07 §8.7 | Estándar | O10 | Adoptado | Exportables XLSX/CSV. |
| RF-TEC-214 | Llamadas rechazadas (público, abonado, duración) importadas cuando el formato las trae. | CAT `RECHAZOS` | Extensión | O10 | Adoptado | Si el archivo trae llamadas rechazadas, se importan con público, abonado y duración y quedan marcadas como rechazadas; si el formato no las trae, la importación no falla. |
| RF-TEC-234 | **Portabilidad numérica** (PA-TEC-19): por defecto **No aplica** (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con estados: entrante (`requested → submitted → accepted / rejected → scheduled → executed / cancelled`) y saliente (`received → validated → accepted / rejected → executed`), con número, operador donante o receptor, fecha y ventana de ejecución, constancias del intercambio y efecto sobre `phoneNumbers` y `phoneLines` (RN-TEC-097). El identificador de la portabilidad viaja como `portId` en EVT-TEC-31. | HUE-TEL-05; PA-TEC-19 | Extensión | O10 | A validar (PA-TEC-19) | Con PRM-TEC-156 = false no se ofrece la operación y EVT-TEC-31 viaja con `portId` nulo. Con el parámetro activo, una portabilidad entrante ejecutada deja el número `assigned` a la línea con la fecha efectiva de ejecución y una saliente lo pasa a `retired` sin borrarlo. |

### 5.17 Geolocalización operativa (BASE §77)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-215 | Mostrar el punto de prestación en Google Maps en factibilidad, OT, visita, ficha del servicio y mapa operativo. | GEO-003 | Núcleo | O3 | Informado | Marcador con estado confirmado/aproximado/pendiente. |
| RF-TEC-216 | Confirmar o corregir el punto por usuario autorizado (operador, técnico en sitio) registrando fuente, momento y motivo; historial de cambios. | BASE §77 | Núcleo | O3 | Informado | Corrección del técnico queda "propuesta" hasta aprobación si la regla lo exige. |
| RF-TEC-217 | Distinguir punto confirmado, aproximado y pendiente; no presentar precisión no disponible; no inventar coordenadas. | BASE §77 | Núcleo | O3 | Informado | Pendiente no muestra marcador falso. |
| RF-TEC-218 | Ubicación por coordenadas o referencias cuando no exista coincidencia de calle/altura (rural, loteo nuevo), con revisión. | BASE §77 | Núcleo | O3 | Informado | Bandeja de revisión PAN-TEC-48. |
| RF-TEC-219 | Manejo de caída o límite de cuota de Google/Georef sin perder el formulario; enriquecimiento posterior por job. | BASE §77 | Núcleo | O3 | Informado | Job `tec:geocodificar-pendientes`. |
| RF-TEC-220 | Usar ubicación del dispositivo solo con permiso y como ayuda; la posición del dispositivo no es automáticamente el domicilio contratado. | BASE §77; GEO-F6 | Núcleo | O3 | Informado | Sin permiso de ubicación la app funciona y no registra posición; con permiso, la posición se guarda como dato auxiliar y nunca modifica el domicilio contratado sin una acción explícita del usuario. |
| RF-TEC-221 | Control de acceso a mapa, exportaciones y API de domicilios por tenant y relación autorizada. | BASE §77 | Núcleo | O3 | Informado | Prueba de aislamiento de tenant. |
| RF-TEC-222 | Mapa estático opcional en la impresión de OT y factibilidad con la clave del tenant (bóveda), nunca una clave fija. | RN-10 §10 (clave hardcodeada); V2 #358 | Estándar | O3 | Adoptado | Sin clave configurada no se imprime mapa. |
| RF-TEC-223 | Zona de agenda y elemento de red sugerido a partir del punto de prestación. | BASE §50; §86 | Estándar | O3 | Adoptado | Sugerencia editable. |

### 5.18 Informes, notificaciones y otros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-224 | Informes técnicos: planilla de control, planilla de relevamiento, detalle de orden, auditoría, reclamos (con numeración por servicio), reincidencias (cuenta / cuenta+servicio / cuenta+servicio+operación), estadísticas de demora, altas y desconexiones, trabajos pendientes, recursos asignados a obras, parte diario, estado de órdenes enviadas a campo; filtros por fecha de emisión, resolución o nota; orden por defecto, domicilio o zona-sector-recorrido; ocultar informes de socio para OM. | RN-07 §1.10, §1.11; INV `frmInformesTecnica` | Estándar | O3 | Adoptado | Ver §15. |
| RF-TEC-225 | Vista previa de resultados con marcado de registros y exportación a mapa (KML/Google Earth). | INV `frmInformes_Preview` | Estándar | O3 | Adoptado | La vista previa permite marcar registros y exportar a KML solo los marcados (o todos si no hay marca); el archivo abre en Google Earth con una marca por registro con coordenadas. |
| RF-TEC-226 | Notificación al socio al generar/confirmar OT según operación y canal (SMS, WhatsApp con plantilla `generacion_ot`, mail, push), con texto que incluye retiro/no retiro de medidor en desconexión/reconexión y teléfono destino según preferencia. | RN-07 §1.7, §Reglas adicionales; V2 #2693 | Estándar | O3 | Adoptado | Constancia de entrega en T09. |
| RF-TEC-227 | Publicación de OT al portal del socio (estado y notas públicas) sin sincronización a base externa. | RN-07 §1.7 (CoopOnline); FIC 14.1 | Núcleo | O3 | Adoptado | Lectura directa de la misma base. |
| RF-TEC-228 | Generar OT de reclamo desde la web/portal (vía M09) según parámetro. | V2 #58 | Estándar | O3 | Adoptado | Caso M09 → OT derivada. |
| RF-TEC-229 | Carga rápida de OT derivada desde la ficha de atención (servicio, descripción) para operadores. | INV `frmCargaRapidaReclamo` | Estándar | O3 | Reemplazado por RF-TEC-025 vía M09 | El reclamo nace en M09. |
| RF-TEC-230 | API para terceros de consulta de estado de OT y visitas del tenant (T10), sin secretos. | BASE §105 APIs | Extensión | O11 | Adoptado | Token con scope. |

### 5.19 Guardias técnicas y protocolo de emergencias (HUE-GAS-05)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-231 | **Turnos de guardia** por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno vigente), cambios de turno con auditoría y vista "quién está de guardia ahora". Las horas de guardia se informan a M16 en el parte de cuadrilla (EVT-TEC-32). | HUE-GAS-05; RF-TEC-105; BASE §47 (casos urgentes) | Núcleo | O7 (GAS, ELE); O3 para el resto de los servicios con red | Adoptado | Para cualquier fecha y hora el sistema resuelve un único titular de guardia por servicio y zona; un turno sin titular se marca como hueco de cobertura en el tablero. |
| RF-TEC-232 | **Escalamiento de guardia**: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel registra hora de aviso, aceptación o vencimiento. | HUE-GAS-05; RF-CRM-104 | Núcleo | O7 | Adoptado | Sin aceptación en el plazo, el siguiente nivel recibe el aviso y el evento EVT-TEC-36 queda registrado; la aceptación detiene el escalamiento. |
| RF-TEC-233 | **Protocolo de emergencia por servicio** (fuga de gas, riesgo eléctrico, cable caído, pérdida grave de agua): el caso de M09 marcado `urgentSafety` (RF-CRM-122) llega como comando `tec.workOrder.request` (antes `tec.workOrder.create`, que es alias de la capability `tec.ordenes.crear` en T02) con prioridad crítica y crea una OT de clase `claim` con `emergency=true`, asignada directo a la guardia sin pasar por despacho; el protocolo (PRM-TEC-154) define pasos obligatorios en la app de campo (arribo, verificación, corte preventivo del suministro o de la zona, normalización, acta), el aviso de emergencia al socio y a los afectados (T09 `tec.emergency.notice`) y los tiempos objetivo que M09 controla como SLA de seguridad (RF-CRM-260). | HUE-GAS-05; RF-CRM-122 | Núcleo | O7 | Adoptado | Una OT de emergencia no queda en `pending` sin recurso: si no hay guardia resuelta se asigna al jefe de guardia y se alerta al supervisor. El corte preventivo genera la interrupción y el aviso por T09 sin esperar aprobación (RN-TEC-116). |

### 5.20 Controles de calidad del agua (HUE-AG-01, PA-TEC-20)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TEC-235 | **Puntos y plan de muestreo** (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto (físico-químicos y bacteriológicos) con límites vigentes por norma o concesión y frecuencia (reutiliza el motor de frecuencias de RF-TEC-140, que genera OT de toma de muestra). | HUE-AG-01; M02 6.C.5 (prohíbe certificar la calidad con datos libres) | Estándar | O7 | A validar (PA-TEC-20) | Con PRM-TEC-157 = false no se muestran puntos ni OT de muestreo; activo, cada punto tiene al menos un parámetro con límite y frecuencia. |
| RF-TEC-236 | **Muestras, análisis y resultados**: muestra tomada por OT (fecha, hora, punto, responsable, cadena de custodia), laboratorio (propio o externo, con matrícula o habilitación), protocolo de resultados adjunto como documento en T11 con hash, resultado por parámetro contra su límite, marca "fuera de límite" con acción correctiva (OT de purga, cloración, aviso preventivo por T09) y cierre. Los resultados alimentan el informe al regulador vía M06 RF-FIS-148 y T10 REP-BIA-024, y REP-TEC-29. | HUE-AG-01; PA-TEC-20 | Estándar | O7 | A validar (PA-TEC-20) | Un resultado no se registra sin protocolo del laboratorio adjunto; un resultado fuera de límite exige acción correctiva y no se puede cerrar sin ella; nadie edita un resultado registrado (corrección = nuevo resultado que reemplaza con motivo). |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TEC-001 | Factibilidad usable en un alta: confirmada, factible, no anulada, dentro de vigencia y sin servicio asociado. | Confirmada + factible + ≤90 días + sin servicio; no filtra anuladas (RN-07 §3.1) | **Mejorar**: excluir anuladas y vencidas; vigencia por servicio. | PRM-TEC-130 | — |
| RN-TEC-002 | Anular factibilidad cambia estado a `cancelled` y limpia uso posible; no altera dictamen histórico. | Anular pone `CONFIRMADO=true` y no toca `FACTIBLE` (bug) | **Reemplazar** | — | — |
| RN-TEC-003 | Al editar factibilidad sin imagen de mapa no se borra el punto ni archivos; el punto se versiona. | Edición sin imagen borra `MAPA` y archivo (RN-07 §3.1) | **Reemplazar** | — | — |
| RN-TEC-004 | Dictamen exige motivo, responsable técnico y estado técnico; el estado técnico solo se informa si hay confirmación. | `ESTADO_TEC` solo si confirmado (RN-07 §3.1) | **Replicar** | — | — |
| RN-TEC-005 | Exigencia de factibilidad para alta/reconexión según servicio. PRM-TEC-024 es el único parámetro que la gobierna; M02 (PRM-CAT-013) la lee como dato derivado y no la redefine (HUE-SRV-07). | V2 #388 | **Replicar** configurable por servicio/operación | PRM-TEC-024 | — |
| RN-TEC-006 | Factibilidad cerrada solo editable con permiso y parámetro, con versión. | V2 #2654, #3082 | **Mejorar** (versión) | PRM-TEC-064, PRM-TEC-086 | — |
| RN-TEC-007 | Teléfono y celular se validan por formato E.164 (no truncado). | Truncado a 20/40 caracteres | **Mejorar** | — | — |
| RN-TEC-008 | Factibilidad no crea catastro de facturación (`GRU_FAC=0`); grupo de factura lo define el contrato. | `CargarDatosCatastro` fija `GRU_FAC=0` | **Descartar** (no aplica) | — | — |
| RN-TEC-009 | Una OT pertenece a una clase única; mantenimiento no exige titular (sí activo/obra). | `TIP_INCI` 2/3 + `TipoOrd` 1/2 inconsistentes | **Mejorar** (enum único) | — | ¿`TIP_INCI=1` histórico? (RN-07 §11.2) → migración lo mapea a `service` con observación |
| RN-TEC-010 | Estados de OT unificados (§8); "cerrada" y "confirmada" no se mezclan; doble paso opcional. | Enum 1/2/3/4 vs DTO web 1/2/3 | **Reemplazar** | PRM-TEC-132 | Significado real de `COD_EST=2` por cooperativa (RN-07 §11.1) → regla de migración en §19 |
| RN-TEC-011 | Pasaje a "Enviada a campo" al imprimir solo si la configuración lo indica. | Imprimir pasa a En proceso salvo V2 #2808 | **Replicar** configurable | PRM-TEC-072 | — |
| RN-TEC-012 | Validación general de creación: servicio existente, no dado de baja (salvo incidente y reconexión), no pendiente de conectar salvo parámetro. | `Validar_OrdenTrabajo_General` | **Replicar** | PRM-TEC-065 | — |
| RN-TEC-013 | Incidente/reclamo solo exige servicio existente (admite servicios dados de baja o pendientes). | `Validar_OrdenTrabajo_Incidente` | **Replicar** | — | — |
| RN-TEC-014 | Traslado y desconexión: validación general + sin otra OT pendiente de la misma operación. | `Validar_OrdenTrabajo_Traslado/Desconexion` | **Replicar** | — | — |
| RN-TEC-015 | Reconexión: solo servicio desconectado; no titular fallecido salvo parámetro; no planes de vivienda; sin otra reconexión pendiente. | `Validar_OrdenTrabajo_Reconexion` | **Replicar** | PRM-TEC-114 | — |
| RN-TEC-016 | Cambio de medidor: requiere medidor o datos de guía, no retirado, sin otra OT pendiente. | `Validar_OrdenTrabajo_CambioMedidor` | **Replicar** | — | — |
| RN-TEC-017 | Retiro de medidor: requiere medidor o guía, servicio desconectado; en telefonía, última línea abierta; para todos los servicios se controla además el flag retirado. | No controla `RETIRADO` salvo telefonía | **Mejorar** (controlar siempre) | — | — |
| RN-TEC-018 | Alta: no si el servicio está dado de baja ni con alta/reconexión pendiente; admite pendiente de conectar. | `Validar_OrdenTrabajo_Alta` | **Replicar** | — | — |
| RN-TEC-019 | No dos OT abiertas de la misma operación para el mismo servicio. | `Existe_OT_Pendiente` (variante 90 días) | **Mejorar**: ventana configurable, default sin límite | PRM-TEC-131 | — |
| RN-TEC-020 | OT pendiente = no cerrada ni anulada; por cuenta excluye también cerradas. | `Existe_OrdenesTrabajoPendientes` | **Replicar** | — | — |
| RN-TEC-021 | Instantánea del servicio al crear (domicilio, medidor, catastro concatenado, GPS, certificado, teléfono, línea, moroso, gestión de mora). | `Crear_OT` (GPS truncado a 20, "0" si vacío) | **Mejorar** (sin truncado; GPS numérico) | PRM-TEC-038 | — |
| RN-TEC-022 | Observación del servicio se precarga como observación administrativa si parámetro. | V2 #2339 | **Replicar** | PRM-TEC-038 | — |
| RN-TEC-023 | La OT hereda la factibilidad del servicio si existe. | `COD_FACTIBIL` | **Replicar** | — | — |
| RN-TEC-024 | Efectos por operación al confirmar (§1.4 RN-07): alta → hito de conexión con fecha efectiva; traslado → domicilio (+ adherentes si corresponde); desconexión → desconexión servicio + adherentes + beneficiarios, moroso según OT, retiro de medidor opcional; cambio de medidor → M03; reconexión → reconectar, limpiar moroso, solicitar proporcional; cambio de estado → estado de servicio resultante; retiro de medidor → retirado y limpieza opcional; cambio de categoría → aviso de consumos pendientes con categoría vieja, proporcional, nueva categoría. | Cableado por código 1..8 + parámetros 2330/238 | **Mejorar**: efecto declarativo en catálogo; ejecución vía servicios de módulos dueños | PRM-TEC-115, PRM-TEC-102 | — |
| RN-TEC-025 | Condición resultante del servicio: desconexión → desconectado; alta/reconexión → conectado; lo registra el dueño del contrato. | `CONDICION` 4/2 al cerrar | **Replicar** por evento | — | — |
| RN-TEC-026 | Estado de servicio automático por operación o por default del servicio (alta, baja, reconexión, cambio de medidor, transferencia). | `Guardar_CambioEstadoAutomatico`; `SERVICIO_EXTRAS.ESTASER*` | **Replicar** | — | — |
| RN-TEC-027 | Nota visible en caja/atención si la operación lo indica. | `TRANSAC.AGREGAR_OBSERVACION` | **Replicar** (nota en cuenta M01/M07) | — | — |
| RN-TEC-028 | Lectura obligatoria al cerrar si la operación registra estado y siempre en alta y reconexión de servicios medidos. | `Registra_EstadoMedidor` | **Replicar** | PRM-TEC-018 | — |
| RN-TEC-029 | Retiro de medidor limpia número y matrícula si parámetro; marcado por defecto y pregunta configurables. | V2 #2399, #2440, #2531 | **Replicar** | PRM-TEC-042, PRM-TEC-047, PRM-TEC-055 | — |
| RN-TEC-030 | Traslado: alertar si no cambió zona-sector-recorrido y preguntar por domicilio postal/recorrido postal. | `EsIgualRecorrido`; V2 #2637, #2638 | **Replicar** | PRM-TEC-061, PRM-TEC-062 | — |
| RN-TEC-031 | Catastro de la OT se descompone en circunscripción, lote, manzana, parcela, PH, LT; teléfono actualizado en el campo correcto (no `FAX`). | `ActualizarDatosOpcionales` (guarda teléfono en `FAX`) | **Mejorar** | — | — |
| RN-TEC-032 | Numeración visible: tipos 0–3 y secuencia continua de reclamos por servicio; asignación atómica. | `Get_New_CODSLS` con max+1 | **Mejorar** (secuencia atómica T04) | PRM-TEC-022, PRM-TEC-082, PRM-TEC-083 | — |
| RN-TEC-033 | Número de comprobante de OT por talonario de la operación (OT/OM) o secuencia del tenant. | `COD_COM/SUC_COM/NUM_COM` | **Replicar** opcional | — | — |
| RN-TEC-034 | Órdenes encadenadas: regla aplicable por servicio + filtros; clona OT con otra operación/servicio/vía; orden de confirmación origen/destino; error si 0 o >1 regla al confirmar. | `ALTASEAU` tipo 6, `ConfirmarOrdenSiRelacion` | **Replicar** | — | — |
| RN-TEC-035 | Numeración de órdenes automáticas con secuencia atómica (no `COD_SOL+1`). | `GenerarOrdenAutomatica` sin bloqueo | **Reemplazar** | — | — |
| RN-TEC-036 | Anulación revierte efectos por compensación y materiales por movimientos inversos; nota "Orden de X anulada" en la cuenta. | `PreDelete_TECNICA`, borrado físico `MOV_PRO` | **Mejorar** | — | — |
| RN-TEC-037 | Anular alta de servicio que factura cargo fijo en la baja deja el servicio "No vigente" previa confirmación. | V2 #2753, `CATE_SER.COBRAR_CF_BAJA` | **Replicar** | PRM-TEC-116 | — |
| RN-TEC-038 | Cierre masivo aplica mismos datos, concatena observaciones (sin truncar a 300; límite 4000) y registra "Confirmada por X mediante confirmación masiva". | RN-07 §1.3 (trunca a 300) | **Mejorar** | — | — |
| RN-TEC-039 | Cierre desde campo guarda GPS, fecha de cierre del dispositivo, receptor/conformidad y motivo de disconformidad. | PMovil `RESP_ENC`, `MOTIVO_DISCONFORME` | **Replicar** | — | — |
| RN-TEC-040 | Cargos "antes" se ofrecen al generar (OT pendiente); "luego" al cerrar; filtrados por cambio de estado que desconecta. | `TIPO_CON` 5/6; `CAMBIO_EST` | **Replicar** vía M04 | PRM-TEC-028, PRM-TEC-029 | — |
| RN-TEC-041 | En cierres masivos/campo, los cargos "luego" se generan como comprobante a "próxima facturación" con fecha según regla. | `Validar_ConceptosCobrar_Confirmacion`; V2 #65 | **Replicar** vía M05 (cargo pendiente en `billableItems`, creado con `fac.service.upsertBillableItem`, `sourceModule = TEC`; CTR-DAT-38) | PRM-TEC-113 | — |
| RN-TEC-042 | Proporcional por cambio de categoría: mismo mes, días restantes (adelantado) o transcurridos con signo inverso (vencido); sin negativos opcional; tope de día; comprobante inmediato o próxima factura. | `Generar_ProporcionalCambioCategoria` | **Reemplazar** por función de M04/M05 invocada por evento | PRM-TEC-056, 057, 058, 117, 118 | — |
| RN-TEC-043 | Proporcional por reconexión: crédito por días desconectados del mes o débito por días restantes si no facturado; opción cerrar sin comprobante. | `Generar_DescuentoReconexion` | **Reemplazar** por M04/M05 | PRM-TEC-051, 052, 067, 078 | — |
| RN-TEC-044 | Materiales: entidad propia; descuento desde depósito indicado, custodia del responsable o depósito por defecto; precio de referencia `precioVentaSinImpuestos` del producto. | `MOV_PRO` op. 3/5/6/8, depósito 1 | **Mejorar** | PRM-TEC-151 | — |
| RN-TEC-045 | Necesidades: cuatro cantidades con usuario y fecha; listados de autorizados pendientes de retiro y retirados pendientes de uso solo para OT abiertas. | `TECNICA_NECESIDAD` con bug de filtro | **Mejorar** | PRM-TEC-081 | — |
| RN-TEC-046 | Los materiales no se facturan automáticamente salvo línea facturable por regla/presupuesto. | Sin facturación automática (RN-07 §1.8) | **Replicar** + opción | PRM-TEC-028, 029 | Duda 4 RN-07 → PA-TEC-03 |
| RN-TEC-047 | Impresión de OT: hasta N renglones de materiales (sin límite fijo de 16 en PDF), con vales opcionales. | 16 renglones; V2 #2819 | **Mejorar** | PRM-TEC-074 | — |
| RN-TEC-048 | Un único modelo de impresión por servicio + operación. | `Existe_OT_REPORTE` | **Replicar** | — | — |
| RN-TEC-049 | Sincronización de participantes, cuadrilla y tareas por diferencia sin borrado de historial (se registra baja lógica). | `Save_PARTICUA/PARTIORD/TAROTM` borran e insertan | **Mejorar** | — | — |
| RN-TEC-050 | Notificación a responsables según reglas de servicio + tipo de orden + operaciones + días + franja + feriados + momento; canal y plantilla. | `NotificarResponsables`; V2 #3088, #3105 | **Replicar** | PRM-TEC-119, 120 | — |
| RN-TEC-051 | Notificación al socio por operación: nunca / al generar / al confirmar / siempre; teléfono destino móvil → teléfono → teléfono web. | `TRANSAC.ENVIO_SMS`, `SendSMS`; V2 #2693 | **Replicar** con preferencias de T09 | PRM-TEC-121 | — |
| RN-TEC-052 | Bloqueo por campo/sistema externo: OT enviada a campo o a sistema externo no se confirma masivamente en administración. | `BLOQUEAR` 0/1/2 | **Replicar** | PRM-TEC-073, 089 | — |
| RN-TEC-053 | Envío automático a campo al guardar según parámetro (reemplaza envío a base MySQL). | V2 #2913 | **Reemplazar** (asignación publica a app) | PRM-TEC-079 | — |
| RN-TEC-054 | Estado de la OT respecto de campo: sin acción, pendiente de envío, enviada, recibida, en dispositivo. | `EstadoOrdenCaptor` | **Replicar** | — | — |
| RN-TEC-055 | Reserva temporal expira y libera capacidad; confirmación atómica por cupo. | — (AGR-025) | **Nuevo** | PRM-TEC-133, 134 | — |
| RN-TEC-056 | Capacidad de franja = capacidad del recurso − reservas confirmadas − reservas temporales vigentes; sobrecupo solo con capability. | — | **Nuevo** | PRM-TEC-135 | — |
| RN-TEC-057 | Reprogramación/cancelación por el socio solo con anticipación mínima configurable; luego vía atención. | BASE §50 | **Nuevo** | PRM-TEC-136 | — |
| RN-TEC-058 | Visita fallida no activa contrato ni consume equipo; genera nueva visita o cierre según motivo. | BASE §17, §50, §73 | **Nuevo** | — | — |
| RN-TEC-059 | "En camino" no publica coordenadas; solo estado y hora. | BASE §73, §77 | **Nuevo** | — | — |
| RN-TEC-060 | Stock del equipo: reserva (disponible −1), entrega a custodia (sale de depósito), aplicación (sale de custodia, queda en domicilio/contrato), fallida (sin cambio o devolución), retiro (vuelve). No se descuenta dos veces del depósito central un equipo ya transferido. | BASE §73 tabla; CU-OPE-01 | **Nuevo** (delegado a M13) | — | — |
| RN-TEC-061 | Sustitución de equipo efectivo vs reservado: libera el reservado y aplica el efectivo; nunca dos equipos aplicados por una instalación. | BASE §73 | **Nuevo** | — | — |
| RN-TEC-062 | Conformidad: documento con versión y hash; modificación sustantiva posterior genera nueva versión; no sustitución silenciosa. | BASE §73 firma; AGR-023 | **Nuevo** | — | — |
| RN-TEC-063 | Encuesta posterior e independiente; no bloquea activación; respuestas repetidas/corregidas versionadas. | BASE §73 | **Nuevo** | PRM-TEC-137 | — |
| RN-TEC-064 | Hito de activación = instalación probada y confirmada + (si aplica) aprovisionamiento confirmado + (si aplica) revisión supervisora; nunca la fecha de reserva. | BASE §73 parámetros | **Nuevo** | PRM-TEC-138 | PA-TEC-02 |
| RN-TEC-065 | Fecha efectiva de activación = fecha/hora real de prueba exitosa en zona horaria del tenant, salvo corrección autorizada. | BASE §73; AGR-010 | **Nuevo** | — | — |
| RN-TEC-066 | Idempotencia: cada mutación de campo y cada comando externo tiene identidad única por tenant; repetir devuelve el resultado original. | AGR-016 | **Nuevo** | — | — |
| RN-TEC-067 | Conflicto: si la versión base de la mutación ≠ versión actual y el cambio afecta estado, asignación, equipo, titular o servicio, se crea conflicto; se aplica la evidencia (fotos, firma, materiales usados) pero no los efectos contractuales hasta resolver. | AGR-025; ESC-03 | **Nuevo** | — | — |
| RN-TEC-068 | Responsable de resolución del conflicto: supervisor de la zona/cuadrilla; vencido el plazo, escala al administrador técnico. | AGR-025 ("responsable de resolución") | **Nuevo** | PRM-TEC-139 | PA-TEC-17 |
| RN-TEC-069 | Desvío de reloj del dispositivo > umbral marca la mutación para revisión sin rechazarla. | AGR-010 | **Nuevo** | PRM-TEC-140 | — |
| RN-TEC-070 | Corte/reconexión solo con orden de M08 o M09 válida; el comando registra su origen. | MER-017 | **Nuevo** | — | — |
| RN-TEC-071 | Corte remoto en confirmación de desconexión (MikroTik y otros) se ejecuta como comando asíncrono; falla del sistema externo no aborta silenciosamente: deja la OT en `closing` con paso pendiente o pendiente manual. | Error de telemedición aborta cierre; MikroTik en cierre masivo | **Mejorar** | — | — |
| RN-TEC-072 | Reconexión automática sin sistema remoto vigente: la OT queda pendiente para cuadrilla (no se marca reconectada). | Vuelve a Pendiente sin fecha | **Replicar** | — | — |
| RN-TEC-073 | MikroTik: al cortar se asigna el perfil de desconectado o se elimina el usuario según parámetro; al reconectar se restaura perfil del plan. | V2 #2393, #2897 | **Replicar** | PRM-TEC-041, PRM-TEC-076 | — |
| RN-TEC-074 | SITSA: alta → alta/modificación de contrato; desconexión → suspendido; reconexión → habilitado; cambio de categoría → modificación; identificador por contrato CoopApps (no cuenta); nombre/apellido reales; API key en encabezado. | `clsSitsa` (cuenta como contrato, nombre vacío, key en query string) | **Mejorar** | PRM-TEC-084, 085 | ¿SITSA solo un servicio por cuenta? → mapeo por contrato resuelve |
| RN-TEC-075 | Discar/telemedición: operaciones que requieren fecha la exigen; cancelación del usuario es "no ejecutado", nunca éxito. | Devuelve éxito "Operación cancelada" | **Reemplazar** | PRM-TEC-093 | — |
| RN-TEC-076 | Perfil de aprovisionamiento resuelto por plan vigente a la fecha efectiva del cambio. | — (BASE §86) | **Nuevo** | — | — |
| RN-TEC-077 | Secretos técnicos (claves PPPoE, credenciales de equipos, casillas) nunca se exponen en catálogo público, BI o API; ver secreto requiere capability y deja auditoría. | Claves en claro (`INTERNET.USER_PASS`, `MIKROTIK`, `CORREOSINT`) | **Reemplazar** | — | — |
| RN-TEC-078 | Contratos independientes por conexión en un mismo domicilio: comandos y OT se dirigen al contrato, no a la cuenta. | BASE §86 ejemplo | **Nuevo** | — | — |
| RN-TEC-079 | Disponibilidad de un punto de red: componente admite conexión; si múltiple, conexiones vigentes < capacidad (rango); si único, sin conexión vigente ni OT abierta que lo use; estado Disponible/Utilizado (no Dañado/Retirado). | v1 `Ge_NIV_REDES_Disponibles`; v2 no valida | **Mejorar** (validar siempre) | PRM-TEC-025 | — |
| RN-TEC-080 | Componentes y relaciones sin capa son comunes a todas las capas; los elementos se filtran estrictamente por capa. | `Get_Componentes` | **Replicar** | — | — |
| RN-TEC-081 | Guardado de estructura de red por diferencia sin borrado físico de relaciones/capas usadas. | `Presave_Red` borra lo que no viene | **Mejorar** | — | — |
| RN-TEC-082 | Elementos nuevos reciben ID definitivo y los hijos se reapuntan en la misma transacción. | IDs negativos + max+1 | **Mejorar** (ObjectId) | — | — |
| RN-TEC-083 | Conexión de servicio: nace `connected`; al informar fecha de desconexión pasa a `disconnected`; validaciones RN-TEC-079. | `Save_SERSOC_REDES` sin validar | **Mejorar** | — | — |
| RN-TEC-084 | Atributos tipo "referencia" solo contra catálogos en lista blanca; se guarda ID y texto visible. | Reflexión sobre todas las entidades | **Mejorar** | — | — |
| RN-TEC-085 | Análisis de impacto recorre descendientes del elemento por la jerarquía y relaciones `distribuyeEnHijos`, incluye conexiones vigentes. | — (mejora DFA) | **Nuevo** | — | — |
| RN-TEC-086 | Exportaciones GIS: mapeos por plantilla (conceptos/categorías por banda, formato de cuenta, ruta, fase real del dato — nunca aleatoria), servicio parametrizable (no fijo 1). | 10 clases con códigos fijos; fase al azar; servicio 1 fijo; bug CUIT | **Reemplazar** | PRM-TEC-080, PRM-TEC-122 | Bandas por coop (RN-07 §5.4) → mapeo por tenant |
| RN-TEC-087 | KML con coordenadas de punto decimal invariante. | Cultura es-ES con coma | **Mejorar** | — | — |
| RN-TEC-088 | Distribución por sección de categoría de incidente y grupo de obra suma exactamente 100 %. | No se valida | **Mejorar** | — | — |
| RN-TEC-089 | Informe de recursos por obra valoriza horas con valores vigentes sin sobrescribir parámetros desde el informe. | El informe sobrescribe V2 #2722/2723 | **Reemplazar** | PRM-TEC-070, 071 | ¿El reporte multiplica por esos valores? → se calcula en el servicio |
| RN-TEC-090 | Estadísticas: cantidad y demora promedio (días) de pendientes, resueltas, con/sin reclamo, resueltas dentro y después del período, no resueltas; demora desde fecha de orden y desde fecha de ingreso hasta confirmación o ahora, piso 0; período anterior = todo lo previo a fecha desde. | `Get_Reporte_Estadisticas` | **Replicar** | — | — |
| RN-TEC-091 | Reincidencias: grupos con más de una orden por cuenta / cuenta+servicio / cuenta+servicio+operación en el rango. | `Get_Reporte_Reincidencias` | **Replicar** | — | — |
| RN-TEC-092 | Parte diario: una fila por nota en el rango con responsable, participante, título y texto; sin rango no devuelve nada (exigir rango). | `Get_ParteDiario` (1900) | **Mejorar** (rango obligatorio) | — | — |
| RN-TEC-093 | Obras: cobro solo con base aprobada y criterio de prorrateo explícito. | MER-009 | **Nuevo** | — | — |
| RN-TEC-094 | Inspección: sospecha ≠ infracción; recupero y multa solo con procedimiento, evidencia, descargo y aprobación; nunca automático. | MER-004 | **Nuevo** | PRM-TEC-143 | PA-TEC-15 |
| RN-TEC-095 | Precinto numerado único por tenant; estados disponible/asignado/colocado/retirado/roto/anulado. | — | **Nuevo** | — | — |
| RN-TEC-096 | Pool telefónico: alta de rango crea números disponibles saltando existentes; baja solo de no asignados (lógica). | Borrado físico | **Mejorar** | — | — |
| RN-TEC-097 | Número en uso: ninguna línea de otro servicio con intervalo de vigencia superpuesto. | Cualquier línea abierta bloquea sin importar fecha | **Mejorar** | — | — |
| RN-TEC-098 | Desvincular número: cierra la línea con fecha efectiva, limpia número del servicio y crea línea sin número con el mismo plan ("Desvinculación sin OT"). | `DesvincularMedidor` | **Replicar** | — | — |
| RN-TEC-099 | Plan de numeración: búsqueda por prefijo más largo; número de móvil con "15". | Stored procedure creado en runtime | **Mejorar** (índice) | — | — |
| RN-TEC-100 | Importación CDR: lector por modalidad; error de fila aborta archivo con número de fila; lote de cabecera o último + 1; duplicados por clave compuesta. | `clsImportacion` | **Replicar** | PRM-TEC-108 | Formatos activos por cooperativa (RN-07 §11.15) → PA-TEC-13 |
| RN-TEC-101 | Atribución de origen por número normalizado `0+prefijo+número` vigente a la fecha; 0 → no encontrado; >1 → duplicado. | `Tasacion_Set_OrigenLlamada` | **Replicar** | — | — |
| RN-TEC-102 | Entrantes: destinatario buscado con y sin prefijo; 0 o >1 coincidencias = observación. | `SetDestino_ENTRANTE` | **Replicar** | — | — |
| RN-TEC-103 | Lote de llamadas reversible solo si ninguna llamada está agrupada/facturada. | `EliminarLlamadasLlamadas` (`GRUPO=0`) | **Replicar** | — | — |
| RN-TEC-104 | Retasación reutiliza identidad de la llamada (no borra y reinserta con nuevo ID). | Borra y reinserta con nuevo `COD_LLA` | **Mejorar** (M04) | — | — |
| RN-TEC-105 | Recarga prepaga telefónica genera operación `prepaidTopUp` con importe. | Parámetro 238 | **Replicar** | PRM-TEC-102 | — |
| RN-TEC-106 | Punto de prestación: confirmado / aproximado / pendiente; no se completa con calle homónima ni coordenadas inventadas. | BASE §77 | **Nuevo** | — | — |
| RN-TEC-107 | Clave de mapas del tenant obligatoria; sin clave no hay mapa estático (nunca clave fija). | Clave hardcodeada si vacía | **Reemplazar** | PRM-TEC-123 | — |
| RN-TEC-108 | Integra/app: no hay API key fija en código; tokens por dispositivo/usuario (T02/T06). | API_KEY hardcodeada | **Reemplazar** | — | — |
| RN-TEC-109 | Tickets del proveedor (horas facturables, bolsas de soporte) no son atención al socio. | `ReglasNegocio.Varios.Tickets` | **Descartar** del ámbito TEC (soporte de plataforma T01; atención M09) | — | — |
| RN-TEC-110 | Actividades internas recurrentes se especifican en M09 (incluye corrección de filtros "en término/fuera de término" invertidos); los planes preventivos de TEC reutilizan el motor de frecuencias. | `ReglasNegocio.Actividades` | **Ver M09**; reutilizar motor | — | — |
| RN-TEC-111 | Cambio de categoría al cambiar medidor solo si parámetro. | V2 #2474 | **Replicar** | PRM-TEC-049 | — |
| RN-TEC-112 | Exigir modelo de medidor/dispositivo en servicios que lo requieren en alta. | V2 #2470, #2652 | **Replicar** | PRM-TEC-048, PRM-TEC-063 | — |
| RN-TEC-113 | Telefonía: operación `move`/`disconnect` cierra/abre `phoneLines` coherentes con la fecha efectiva de la OT. | RN-07 §8.1 | **Nuevo** | — | — |
| RN-TEC-114 | Certificado de instalador: un solo control, PRM-TEC-043, resuelto por servicio y jurisdicción del suministro (y por operación si se configura). Default `require` en ELE con jurisdicción Córdoba (Ley 10281, instalador electricista habilitado) y en GAS (matriculado gasista); `warn` en el resto. M02 consulta el valor resuelto en el alta del contrato; PRM-CAT-015 queda como lectura derivada (HUE-ELE-04). | V2 #2421 (`warn`) y V2 #2343 (M02, `none` en ELE): dos parámetros para el mismo control | **Mejorar**: parámetro único con default por jurisdicción | PRM-TEC-043 | Otras jurisdicciones con registro obligatorio de instaladores se agregan como default regional sin cambiar el parámetro |
| RN-TEC-115 | Cobro de la contribución por mejoras: por defecto cada beneficiario paga por un **plan de cuotas tipo 17** (contrato de M02 + `worksInstallmentPlans` de M04, facturado por M05). El convenio de M08 solo se usa para **refinanciar cuotas vencidas** de ese plan; no se crea un convenio de M08 al aprobar la contribución (HUECO-OBR-02). | — (MER-009 no lo define) | **Nuevo** | PRM-TEC-155 | — |
| RN-TEC-116 | Emergencia de seguridad: la OT de emergencia se asigna a la guardia vigente sin despacho ni supervisión previa; el corte preventivo del suministro o de la zona se ejecuta sin aprobación y genera interrupción no programada con aviso por T09; la normalización exige acta y prueba en sitio antes de restablecer. | — (BASE §47 casos urgentes; RF-CRM-122) | **Nuevo** (HUE-GAS-05) | PRM-TEC-152, PRM-TEC-153, PRM-TEC-154 | Tiempos objetivo a validar con la distribuidora de referencia y el regulador |

## 7. Modelo de datos

**Campos comunes** (no se repiten en cada colección): `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (entero, control optimista), `deletedAt` (borrado lógico solo en catálogos; OT, evidencias, conformidades, comandos y CDR nunca se borran). Fechas en UTC; `effectiveAt` (fecha efectiva del hecho) y `recordedAt` (fecha de recepción en el servidor) donde se indica (AGR-010). Importes `Decimal128`. Coordenadas como GeoJSON (`{ type: 'Point', coordinates: [lng, lat] }`) con índice `2dsphere` (CTR-TEC-09). Textos de UI por `dict:`.

### 7.1 `feasibilityRequests` — factibilidades

Propósito: solicitud y dictamen de factibilidad técnica. Origen: `FACTIBIL`, `FACTIBIL_NOTA` (→ `technicalNotes`), `MAPA` (→ `servicePoint`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | sí | Número visible (secuencia T04 o talonario del punto de venta). |
| `documentRef` | `{ typeCode, branch, number }` | no | Comprobante ProCoop/talonario (`COD_COM/SUC_COM/NUM_COM`). |
| `serviceId` | ObjectId → servicio M02 | sí | Servicio solicitado. |
| `operationTypeId` | ObjectId → `workOrderOperationTypes` | sí | Alta, traslado, reconexión, aumento de potencia/plan. |
| `requestedAt` | Date | sí | Fecha de la solicitud (`FECHA`). |
| `personId` / `prospect` | ObjectId → M01 / objeto | sí (uno) | Persona existente (→ M01 `persons`) o datos de prospecto (`COD_PER`); `prospect` es un objeto embebido, no es referencia (PA-TEC-23). |
| `accountId` | ObjectId → M01 | no | Cuenta si existe. |
| `crmCaseId` | ObjectId → M09 | no | Caso CRM origen. |
| `address` | objeto (M01 `addressSnapshot`): calle (id catálogo + texto original), altura, piso, dpto, torre, barrio, localidad, provincia, CP, entrecalles, referencias | sí | Domicilio de conexión (`COD_CAL, NUM_CAL, PISO, DPTO, COD_BAR`…). |
| `servicePoint` | `{ geo: Point, status: confirmed\|approximate\|pending, source: google\|georef\|device\|manual, confirmedBy, confirmedAt, reason }` | sí | Punto de prestación (BASE §77). |
| `cadastre` | `{ circunscription, section, block, parcel, ph, lot }` | no | Catastro. |
| `adjacentStreets` | `{ right:{streetId,number}, left:{…}, back:{…} }` | no | Calles linderas. |
| `readingRoute` | `{ zone, sector, route }` | no | Zona-sector-recorrido. |
| `properties` | objeto tipado según esquema del servicio | no | Propiedades adicionales (`clsPropiedadesItems`). |
| `observations` | `{ administrative, commercial, operational }` | no | Observaciones. |
| `status` | enum (§8.1) | sí | `draft, pending, inEvaluation, closed, cancelled, used, expired`. |
| `adminStatus` | enum `provisional\|definitive` | sí | `ESTADO_ADM`. |
| `techStatus` | enum `provisional\|definitive` | no | `ESTADO_TEC` (solo si cerrada). |
| `verdict` | enum `feasible\|notFeasible` | no | `FACTIBLE`. |
| `verdictReasonCode` / `technicalObservation` | string | si verdict | Motivo y `OBS_TEC`. |
| `technicalResponsibleId` | ObjectId → `fieldResources` | si verdict | Responsable técnico. |
| `substatus` | string (catálogo tenant) | no | `SUBESTADO`. |
| `inspectionWorkOrderIds` | ObjectId[] | no | OT de inspección. |
| `resourceProposal` | `{ networkElementId, port, capacityOk, distanceM }` | no | Recurso de conexión propuesto. |
| `estimateId` / `quoteRef` | ObjectId / `{ module:'ven', id, status }` | no | Estimación (→ M10 `connectionEstimates`) y presupuesto M11 (`quoteRef.id` → M11 `salesQuotes`; PA-TEC-23). |
| `validUntil` | Date | si feasible | Vigencia para alta (PRM-TEC-130). |
| `usedByContractId` | ObjectId | no | Contrato que la consumió (uso único). |
| `closedAt`, `closedBy`, `cancelledAt`, `cancelledBy`, `cancelReason` | Date/ObjectId/string | según estado | `closedBy` y `cancelledBy` → T02 `memberships`; `cancelReason` es texto libre, no es referencia (PA-TEC-23). |
| `attachments` | `documentRef[]` (T11) | no | Adjuntos. |

Índices: `{tenantId, number}` único; `{tenantId, status, serviceId, requestedAt}`; `{tenantId, personId}`; `{tenantId, 'servicePoint.geo'}` 2dsphere; `{tenantId, usedByContractId}`.

### 7.2 `connectionEstimates` — estimación técnica de conexión

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `feasibilityRequestId` | ObjectId | sí | Factibilidad. |
| `templateId` | ObjectId | no | Plantilla aplicada. |
| `lines` | `[{ kind: material\|labor\|networkWork\|other, productId?, description, quantity: Decimal128, unit, laborRole?, hours? }]` | sí | Cómputo. |
| `status` | enum: `draft`, `submitted`, `accepted`, `rejected`, `expired` (§8.16; PA-TEC-23) | sí | Refleja el presupuesto M11. |
| `quoteRef` | `{ id, number, status, acceptedAt }` | no | Presupuesto comercial. |
| `notes` | string | no | — |

Índices: `{tenantId, feasibilityRequestId}`.
Colección auxiliar `connectionEstimateTemplates` (mismos `lines`, `serviceId`, `technology`, `name`).

### 7.3 `technicalNotes` — notas de solo agregado

Origen: `FACTIBIL_NOTA`, `TECNICA_NOTA`. Campos: `entityType` (`feasibility|workOrder|work|inspectionCase|networkElement`), `entityId`, `title`, `text`, `occurredAt`, `authorUserId`, `responsibleId`, `visibility` (`internal|public`), `source` (`admin|field|integration|system`). Índices: `{tenantId, entityType, entityId, occurredAt}`. Sin edición ni borrado.

### 7.4 Catálogos de OT

**`workOrderOperationTypes`** (origen `TRANSAC`, enum `Transaccion`, parámetros 2330/238; antes `operationTypes`, renombrada porque ese nombre es de T11, CTR-DAT-15 de T05; `operationTypeId` conserva el nombre de rol):

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `name` (`dict:`) | string | sí | `COD_TRAN`, `DES_TRAN`. |
| `serviceId` | ObjectId | sí | `COD_SER`. |
| `effect` | enum `connect, move, disconnect, meterChange, reconnect, incident, statusChange, meterRemoval, categoryChange, planChange, prepaidTopUp, equipmentSwap, equipmentRetrieval, inspection, none` | sí | Efecto declarativo. |
| `kind` | enum `service\|maintenance\|claim\|inspection\|network` | sí | Clase de OT por defecto. |
| `isClaim` | bool | sí | `TRANSAC_RECLAMO`. |
| `modifiesRegistration` | bool | sí | `MODIFICA_MATRICULA`. |
| `resultingServiceStatusId` | ObjectId → M02 `serviceStatuses` (antes "ObjectId → estado de servicio"; PA-TEC-23) | no | `COD_EST`/`ESTASER`. |
| `addCashierNote` | bool | sí | `AGREGAR_OBSERVACION`. |
| `recordsReading` | bool | sí | `REG_EST`. |
| `memberNotification` | `{ when: never\|onCreate\|onClose\|always, channels[], templateCreate, templateClose }` | sí | `ENVIO_SMS`, `METODO_ENVIO`, `COD_PLA_ALTA`, `COD_PLA_CONFIRM`. |
| `excludeFromWeb` | bool | sí | `EXCLUIR_WEB`. |
| `availableInFieldApp` | bool | sí | `ALTA_PMOVIL`. |
| `requiresFeasibility`, `requiresNetworkPoint`, `requiresDevice`, `requiresSerializedEquipment`, `triggersProvisioning` (`provisioningAction`) | bool / enum | sí | Nuevas exigencias. |
| `twoStepClose` | bool | sí | Ejecutada + Confirmada (PA-TEC-01). |
| `defaultWorkTypeId`, `defaultResolutionIds[]`, `requiredTaskIds[]`, `checklistFormIds[]`, `visitTypeId` | ObjectId | no | En ese orden: → M10 `workTypes`, `resolutionCodes`, `taskCatalog`, `fieldForms`, `visitTypes` (PA-TEC-23). |
| `closeRequirements` | `{ responsible, categories, resolution, peopleCount, adminObservation, certificate: none\|warn\|require, deviceNumber, vehicle: none\|ask\|require, participantHours, materials: none\|warn }` | sí | Parámetros 342/474/497/2084/174/2421/2470/2505/2354/3201 por operación (override del global). |
| `active` | bool | sí | — |

Índices: `{tenantId, serviceId, code}` único; `{tenantId, effect}`.

**`workTypes`** (`TPTRAB`): `code`, `name`, `kind` (`service|maintenance`; reemplaza `TIP_ORD` 1/2), `printTemplateId`, `active`.
**`incidentCategories`** (`CAT_INCI`, `CAT_INCI_CTSEC`, `CLAS_INC`): `code`, `name`, `rubric`, `serviceId`, `defaultOperationTypeId`, `debitAccountId`, `creditAccountId` (M15), `sectionAllocations [{ costCenterId, percent: Decimal128 }]` (suma 100), `classCode` (clase con numerador propio, de `CLAS_INC`), `regulatorCode` (para informes de calidad), `active`.
**`resolutionCodes`** (`RESOL_OT`, `abm_Resestad`): `code`, `name`, `serviceId?` (nulo = genérica), `operationTypeId?`, `outcome` (`resolved|notResolved|improcedent|referred`), `active`.
**`taskCatalog`** (`TAREAS`, `TAREASOM`): `code`, `name`, `groupId`, `serviceId?`, `standardMinutes`, `active`. **`taskGroups`** (`GRPTAREA`): `code`, `name`.
**`workOrderPrintTemplates`** (`OT_REPORTE`, V2 #180/#465): `serviceId`, `operationTypeId`, `templateKey` (plantilla PDF), `includeMap`, `includeWithdrawalSlips`, `includeIncidentReport`, `maxMaterialLines`; índice único `{tenantId, serviceId, operationTypeId}`.
**`chainedOrderRules`** (`ALTASEAU` con `TIPO_AS=6`, `OT_RELACION`): `name`, `sourceServiceId`, `sourceOperationTypeId?`, filtros `{ categoryIds, localityIds, referenceIds, readingZones, activityIds, classIds, propertyTypeIds, meterTypeIds }`, `targetServiceId`, `targetOperationTypeId`, `targetIntakeChannelId`, `confirmOrder` (`sourceFirst|targetFirst`; `CONFIRMAR_ULTIMA`), `active`.
**`intakeChannels`** — **Reemplazado por `crmChannels` de M09 (CTR-DAT-77 de T05).** M10 no tiene catálogo propio de vías de ingreso: las OT referencian `crmChannels` (vías de ingreso con `validatePhone`/`validateEmail`, M09 §7.23) y la vía por defecto se toma de PRM-TEC-019. Esquema anterior, solo como referencia: `code`, `name`, `validateMobile`, `validateEmail`, `isDefault` (`VIAINGTE`).

### 7.5 `workOrders` — órdenes de trabajo

Origen: `TECNICA` (+117 columnas), `TECNICA_MOVIL`, `PARTIORD`, `PARTIINC`, `TAROTM`, `TECNOTEXP`/`TECNGREXP`/`TECNSEEXP` (exportaciones → `dispatch`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `kind` | enum `service\|maintenance\|claim\|inspection\|network` | sí | Reemplaza `TIP_INCI` + `RECLAMO`. |
| `number` | string | sí | Número interno legible (secuencia tenant). |
| `visibleNumber` | `{ year, scope, seq, display }` | no | `COD_SLS` (PRM-TEC-022/082). |
| `documentRef` | `{ typeCode, branch, number }` | no | Talonario OT/OM. |
| `operationTypeId` | ObjectId | sí | `COD_TRAN`. |
| `serviceId` | ObjectId | sí | `COD_SER`. |
| `contractId` / `accountId` / `personId` | ObjectId | si `service`/`claim` | `ID_SERSOC`/`COD_SUM`/`COD_PER`. |
| `assetRef` | `{ networkElementId?, workId? }` | si `maintenance`/`network` | Obra (`OBRAS`) o activo. |
| `crmCaseId` | ObjectId → M09 | si `claim` | Caso del reclamo. |
| `feasibilityRequestId` | ObjectId | no | `COD_FACTIBIL`. |
| `inspectionCaseId` | ObjectId | si `inspection` | — |
| `origin` | enum `admin, memberRecord, crm, dunning, integration, fieldApp, meterReading, chainedRule, maintenancePlan, outagePlan, bulk` | sí | `OrigenOrden`. |
| `intakeChannelId` | ObjectId → `crmChannels` (M09, CTR-DAT-77) | según PRM-TEC-060 | `COD_VIA`. |
| `dunningOrigin` | `{ orderedBy:'mor', orderId, isDelinquent: bool }` | no | `GEST_MORA`, `MOROSO`. |
| `snapshot` | `{ address, servicePoint, meter:{number,digits,lastReading,lastReadingAt}, cadastre, installerCertificate:{number, expiresAt, installerId}, holderPhone, activePhoneLine, serviceObservation }` | sí | Copia al crear (RN-TEC-021). |
| `newData` | `{ address?, meter?{typeId, number}, categoryId?, phoneNumberId?, statusId?, planId? }` | según efecto | `NEW_*`, `N_COD_MED`, `N_TIP_MED`, `N_COD_CAT`, `N_COD_NUM`, `COD_ESTASER`. |
| `description` | `[{ text, at, by }]` | sí | `DES_SOL` acumulativa. |
| `observations` | `{ administrative, technical }` | no | `OBS_ADM`, `OBS_TEC`. |
| `priority` | enum `critical\|high\|normal\|low` | sí | Nuevo (RN-07 §2 sin prioridad). |
| `emergency` | `{ protocolId, kind: gasLeak\|electricHazard\|fallenCable\|severeLeak\|other, declaredAt, onCallShiftId, escalationLog[{ level, notifiedAt, acceptedAt?, expiredAt? }], arrivedAt?, safeAt?, preventiveCutoff?: { outagePlanId, at } }` | no | Solo OT de emergencia (RF-TEC-233, HUE-GAS-05). |
| `dueAt` | Date | no | `VENCE` / SLA heredado. |
| `status` | enum (§8.4) | sí | `pending, scheduled, assigned, dispatched, inProgress, onHold, executed, closing, closed, cancelled`. |
| `substatus` | string | no | `SUBESTADO`. |
| `conflictOpen` | bool | sí | Hay `syncConflicts` abierto. |
| `dispatch` | `{ state: none\|pendingSend\|sent\|received\|onDevice, lockedBy: none\|fieldApp\|external, externalSystem?, sentAt, receivedAt }` | sí | `BLOQUEAR`, `EstadoOrdenCaptor`. |
| `assignment` | `{ responsibleId, crewId, participantIds[], peopleCount, vehicleIds[] }` | no | `COD_RES`, `COD_CUA`, `PARTIORD`, `PERSONAS`, `TECNICA_MOVIL`. |
| `visitIds` | ObjectId[] | no | Visitas. |
| `participants` | `[{ fieldResourceId, employeeId?, normalHours: Decimal128, overtimeHours: Decimal128, contracted: bool, hourRate: Decimal128, recordedAt }]` | según PRM-TEC-039 | `PARTIORD` (`HORAS_N`, `HORAS_E`, `CONTRATADA`, `VALOR_HORA`). |
| `tasks` | `[{ taskId, done: bool, notes }]` | no | `TAROTM`. |
| `closing` | `{ executedAt (effective), executedBy, confirmedAt, confirmedBy, incidentCategoryId, resolutionId, workTypeId, hours, peopleCount, technicalObservation, fieldGeo, fieldClosedAt, receiverConformityId, dissatisfactionReason, pendingSteps:[{step, status, error}] }` | al ejecutar/cerrar | `FEC_CONFIR`, `USER_CON`, `COD_CIN`, `ID_RLT`, `COD_TIP`, `HORAS`, `RESP_ENC`, `MOTIVO_DISCONFORME`. |
| `effectsApplied` | `[{ effect, targetModule, commandId, appliedAt, reversedAt? }]` | sí | Para reversión por compensación. |
| `chained` | `{ parentWorkOrderId?, ruleId?, childWorkOrderIds[] }` | no | `OT_RELACION`. |
| `charges` | `[{ ruleRef, moment: before\|after, status: proposed\|accepted\|declined\|billed, billingRef }]` | no | Propuestas de M04 (`CONEXION` 5/6). |
| `provisioningCommandIds` | ObjectId[] | no | Comandos emitidos. |
| `installation` | subdocumento §7.6 | si efecto `connect` en servicio con instalación integral | — |
| `extraFields` | objeto tipado por operación | no | `DatosExtraTecnica`, `TECNICA_EXTRAS`. |
| `networkPoint` | `{ networkElementId, position?, phoneBoxPositionId? }` | según PRM-TEC-025 | `INT_RED`, `TEL_POS_REG_CAJA`. |
| `provisional` | bool | no | `PROVI`. |
| `registration` | string | no | `MATRICULA` si cambia. |
| `requestedAt` | Date | sí | `FECHA`/`FEC_OPE`. |
| `recordedAt` | Date | sí | `FEC_REG`. |
| `cancelledAt`, `cancelledBy`, `cancelReason` | — | si `cancelled` | `FECHA_BAJA`, `USUARIO_BAJA`. |
| `reopenHistory` | `[{ at, by, reason, fromStatus }]` | no | Restablecer. |

Índices: `{tenantId, number}` único; `{tenantId, status, serviceId, operationTypeId}`; `{tenantId, contractId, operationTypeId, status}` (duplicados); `{tenantId, 'assignment.crewId', status}`; `{tenantId, 'assignment.responsibleId', status}`; `{tenantId, crmCaseId}`; `{tenantId, kind, requestedAt}`; `{tenantId, 'snapshot.servicePoint.geo'}` 2dsphere; `{tenantId, dueAt}` parcial `status ∉ {closed, cancelled}`.

### 7.6 Subdocumento `workOrders.installation` — instalación integral

| Campo | Tipo | Descripción |
|---|---|---|
| `stage` | enum `pendingAppointment, appointed, equipmentReserved, equipmentInCustody, enRoute, onSite, installing, testing, testFailed, awaitingConformity, conformityRefused, executed, awaitingProvisioning, awaitingReview, activationConfirmed, failedVisit` | Etapa (§8.5). |
| `reservedEquipment` | `[{ inventoryItemId (M13), serialUnitId (M13 `serialUnits`), serial, model, reservationId }]` | Reservado. |
| `effectiveEquipment` | `[{ inventoryItemId, serialUnitId, serial, model, applicationMovementId, modality: loan\|sale\|rent }]` | Aplicado. La modalidad por defecto es comodato (`loan`) en Internet y TV, configurable por plan (DEC-013); el vínculo con el contrato lo registra M02 en `contractEquipmentAssignments` (CTR-DAT-28). |
| `substitution` | `{ fromSerial, toSerial, reason, validatedBy, validatedAt }` | Sustitución. |
| `tests` | `[{ testCode, value, unit, passed, at }]` | Pruebas (potencia óptica dBm, velocidad Mbps, señal). |
| `conformityId` | ObjectId → `serviceConformities` | Firma/conformidad. |
| `activation` | `{ milestoneRule, effectiveAt, timezone, confirmedBy, provisioningConfirmedAt, reviewConfirmedAt, eventId }` | Hito. |
| `surveyInvitationRef` | `{ module:'com', id, status }` | Encuesta T09. |

### 7.7 `workOrderMaterials` — materiales y necesidades

Origen: `MOV_PRO` (op. 3, 5, 6, 8) por inferencia, `TECNICA_NECESIDAD`, `RETI_MAT`, `PROD_TRH`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `workOrderId` / `workId` | ObjectId | uno | OT u obra. |
| `inventoryItemId` | ObjectId → M13 `inventoryItems` | sí | `COD_PRO` (antes `productId`; T05 §7.2). |
| `serial` / `serialUnitId` | string / ObjectId → M13 `serialUnits` | si serializado | `PROD_TRH`. |
| `source` | `{ kind: warehouse\|custody, warehouseId?, custodianId? }` | sí | `COD_DEP`, `RESPONSA.COD_DPS`. |
| `status` | enum `requested, authorized, reserved, withdrawn, used, returned, cancelled` | sí | §8.6. |
| `quantities` | `{ requested, authorized, withdrawn, used, returned }` Decimal128 | sí | Cuatro cantidades + devolución. |
| `steps` | `[{ step, quantity, userId, at }]` | sí | Usuario y fecha por paso (`USUARIO_SOLICITO`, `USUARIO_AUTORIZO`, `FECHA_AUTORIZO`, `USUARIO_RETIRO`, `USUARIO_UTILIZO`). |
| `withdrawalSlipRef` | `{ id, number }` | no | Vale (`RETI_MAT`). |
| `stockMovementIds` | ObjectId[] → M13 | no | Movimientos generados. |
| `referencePrice` | Decimal128 | no | `PROD_SER.PRE_VSI`. |
| `billable` | bool | sí | PA-TEC-03. |
| `clientMutationId` | string | si campo | Idempotencia. |
| `reviewFlag` | enum `none\|notInCustody\|periodClosed\|other` | sí | Revisión. |

Índices: `{tenantId, workOrderId}`; `{tenantId, workId}`; `{tenantId, status, 'source.custodianId'}`; `{tenantId, clientMutationId}` único parcial.

### 7.8 `fieldEvidence` — evidencias de campo

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `entityType` / `entityId` | string / ObjectId | sí | OT, visita, inspección, elemento de red, factibilidad. `entityType` no es referencia: discriminador de `entityId`, polimórfica (→ M10 `workOrders` · `visits` · `inspectionCases` · `networkElements` · `feasibilityRequests`); T05 lo nombra `entityRef` (PA-TEC-23). |
| `kind` | enum `photo\|signature\|document\|audio\|checklist\|geoCheckIn` | sí | — |
| `stepCode` | string | no | Paso del checklist. |
| `storedFileId` | ObjectId → `storedFiles` (T01) | sí | Objeto privado (URL firmada, DEC-001). Antes `storageKey` (T05 §7.2, COL-TEC-14). |
| `sha256` | string | sí | Integridad. |
| `capturedAt` / `recordedAt` | Date | sí | Dispositivo / servidor. |
| `geo` | Point + `accuracyM` | no | GPS. |
| `capturedBy` / `deviceId` | ObjectId | sí | — |
| `clientMutationId` | string | si campo | — |
| `documentId` | ObjectId → T11 | sí | Expediente documental (AGR-023). |
| `supersededBy` | ObjectId | no | Sustitución trazada (nunca silenciosa). |

Índices: `{tenantId, entityType, entityId}`; `{tenantId, clientMutationId}` único parcial.

### 7.9 `serviceConformities` — conformidad y firma

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `workOrderId`, `visitId` | ObjectId | sí | — |
| `detailVersion` / `detailHash` | int / string | sí | Versión del detalle presentado. |
| `detailSnapshot` | objeto (equipos, trabajos, materiales, pruebas) | sí | Lo aceptado. |
| `receiver` | `{ fullName, documentType, documentNumber, relation: holder\|authorized\|family\|tenant\|other, authorizationRef? }` | sí | Receptor. |
| `result` | enum `accepted\|acceptedWithObservations\|refused\|absent\|notSigned` | sí | Conformidad. |
| `mechanism` | enum `handwrittenOnScreen\|otp\|digitalSignature\|paper` | sí | PA-TEC-07. |
| `signatureEvidenceId` | ObjectId → `fieldEvidence` | si handwritten | — |
| `signatureRequestId` | ObjectId → T11 `signatureRequests` | si digitalSignature | Pedido de firma digital del receptor. Declarado en T05 (COL-TEC-15); no figuraba en el anexo (PA-TEC-23). |
| `otpRef` | `{ channel, sentTo, verifiedAt }` | si otp | — |
| `observations` | string | no | — |
| `signedAt` / `recordedAt` | Date | sí | — |
| `installerId` | ObjectId | sí | — |
| `supersedesId` | ObjectId | no | Nueva versión. |

### 7.10 `damageAssessments` — reclamos por daños (`TECNICA_EXTRAS`)

Campos: `workOrderId`, `crmCaseId` (M09), `paymentDate`, `transferCenter`, `bookNumber`, `folioNumber`, `claimedAmount` (Decimal128), `approvedAmount` (Decimal128), `previousDamages` (bool/texto), `accepted` (bool), `regulatorClaim` (`{ regulator: 'OCEBA'|..., number, filedAt }`), `cause`, `damagedAppliances [{ type, brand, model, serial, description }]`, más los 11 campos restantes de `TECNICA_EXTRAS` en `extra` tipado [VERIFICAR nombres en base real], `status` (`open|inReview|approved|rejected|paid`), `settlementRef` (M05/M14).

### 7.11 `technicalProcedures` — expedientes técnicos (`EXPEDIENTES`, `EXPEDIENTES_TRAM`)

Campos: `number`, `installerId` (`COD_PROF`), `address` (calle, número, barrio, localidad, provincia, CP, piso, torre, dpto), `contact`, `serviceId`, `openedAt`, `status` (`open`, `inReview`, `observed`, `approved`, `rejected`, `cancelled`; §8.15, PA-TEC-22), `stages [{ previousStageId, submittedAt, at, stage, resolution, observation, attachmentDocId, resolvedAt }]`, `externalUserRef` (`COD_USER_MYSQL` → portal, se migra como referencia de usuario del portal M19).

### 7.12 Agenda

**`visitTypes`**: `code`, `name`, `serviceIds[]`, `durationMinutes`, `slotTemplate` (franjas, ej. 09–11, 11–13, 14–16, 16–18), `requiredSkills[]`, `requiresCrew` (bool), `requiresVehicle`, `requiresEquipment`, `memberBookable` (bool), `minLeadHours`, `maxHorizonDays`, `failedVisitChargeRuleRef?`, `active`.
**`schedulingZones`**: `code`, `name`, `geometry` (Polygon/MultiPolygon) o `localityIds[]`/`neighborhoodIds[]`, `crewIds[]`, `active`. Índice 2dsphere.
**`resourceCalendars`**: `resourceType` (`crew|fieldResource`), `resourceId`, `weeklyPattern [{ dow, from, to, capacityUnits }]`, `exceptions [{ date, from?, to?, capacityUnits, reason (feriado/ausencia/capacitación) }]`, `zoneIds[]`, `visitTypeIds[]`, `validFrom`, `validTo`.
**`visitBookings`** (reservas de cupo):

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `slotKey` | string | sí | `zoneId\|visitTypeId\|date\|from` (unidad de capacidad). |
| `resourceId` | ObjectId | no | Si se reserva recurso concreto. |
| `capacityUnits` | int | sí | Consumo de capacidad. |
| `status` | enum `held\|confirmed\|released\|expired\|cancelled` | sí | §8.2. |
| `holdExpiresAt` | Date | si held | PRM-TEC-133. |
| `ownerRef` | `{ kind: member\|operator, userId }` | sí | Quién reserva. |
| `targetRef` | `{ workOrderId?, crmCaseId?, contractId?, feasibilityRequestId? }` | sí | — |
| `idempotencyKey` | string | sí | — |

Índices: `{tenantId, slotKey, status}`; `{tenantId, holdExpiresAt}` TTL lógico (job libera); contador atómico en `slotCounters` (`{tenantId, slotKey}` único, `capacity`, `used`) actualizado con `findOneAndUpdate` condicional `used + units <= capacity`.

**`visits`**:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | sí | VIS-… |
| `workOrderId` | ObjectId | sí | — |
| `bookingId` | ObjectId | sí | — |
| `visitTypeId`, `zoneId` | ObjectId | sí | — |
| `window` | `{ date, from, to, timezone }` | sí | Franja. |
| `assignedCrewId` / `assignedResourceIds[]` | ObjectId | no | → M10 `crews` / → M10 `fieldResources`; T05 nombra `crewId` a `assignedCrewId` (PA-TEC-23). |
| `status` | enum §8.3 | sí | `confirmed, assigned, enRoute, onSite, completed, failed, rescheduled, cancelled`. |
| `timeline` | `[{ status, at (effective), recordedAt, by, deviceId? }]` | sí | Historial. |
| `failure` | `{ reasonCode: noAccess\|customerAbsent\|missingMaterial\|technicalCondition\|weather\|customerRefused\|other, notes, evidenceIds[] }` | si failed | — |
| `rescheduledToVisitId` / `rescheduledFromVisitId` | ObjectId | no | Cadena. |
| `memberVisible` | bool | sí | — |
| `reminders` | `[{ channel, scheduledAt, sentRef }]` | no | — |

Índices: `{tenantId, workOrderId}`; `{tenantId, 'window.date', assignedCrewId}`; `{tenantId, status, 'window.date'}`.

### 7.13 Recursos

**`crews`** (`CUADRI`, `PARTICUA`): `code`, `name`, `leaderId`, `members [{ fieldResourceId, role, validFrom, validTo }]`, `zoneIds[]`, `serviceIds[]`, `skills[]`, `defaultVehicleId` (M18), `custodyWarehouseId` (M13), `dailyCapacityUnits`, `active`.
**`fieldResources`** (`RESPONSA`): `code`, `name`, `activity` (`technician|installer|meterReader|collector|inspector|supervisor|other`), `userId` (T02; sin contraseña propia), `email`, `phone`, `custodyWarehouseId` (`COD_DPS`), `assignToFieldApp` (`ASIGNAOT_PMOVIL`), `serviceIds[]`, `operationTypeIds[]` (responsables por servicio/operación, `RELACION_ENTIDADES`), `skills[]`, `employeeId?` (M16), `defaultHourRate` (Decimal128), `inactive`.
**`responsibleNotificationRules`** (`RESPONSA_NOTIFICA`): `serviceId`, `orderKind`, `operationTypeIds[]` (reemplaza `COD_OPER` con `|`), `fieldResourceId`, `daysOfWeek[]` (1–7 ISO), `from`, `to`, `includeHolidays` (bool), `notifyAt` (`onCreate|onDispatch`), `channel` (`whatsapp|email|sms|push`), `templateKey`, `active`.
**`certifiedInstallers`** (`PROFESIO`): `personId` obligatorio (persona única, DEC-097; nombre, documento, contactos y domicilio se leen de M01 y ya no se guardan en la ficha), `registrationNumber` (matrícula), `serviceIds[]`, `installerCategory`, `phone`, `email`, `whatsapp`, `address`, `active`; certificados `[{ number, issuedAt, expiresAt, scope }]`; `jurisdiction` (provincia del registro de instaladores, por ejemplo Córdoba, Ley 10281) para la validación de PRM-TEC-043.
**`onCallShifts`** (HUE-GAS-05, RF-TEC-231): `serviceIds[]`, `zoneIds[]`, `date`, `from`, `to`, `holidayRule` (`include|exclude|only`), `primaryResourceId`, `backupResourceId`, `chiefResourceId`, `publicPhone` (teléfono de guardia publicado), `status` (`planned|active|closed`), `changes [{ at, by, field, from, to, reason }]`. Índice `{tenantId, serviceIds, zoneIds, date}`.
**`emergencyProtocols`** (RF-TEC-233): `code`, `kind` (`gasLeak|electricHazard|fallenCable|severeLeak|other`), `serviceIds[]`, `steps [{ key, label, required, evidence: photo|signature|reading|none }]`, `preventiveCutoff` (`never|optional|required`), `noticeTemplateKey` (T09 `tec.emergency.notice`), `targets` (`{ acceptMinutes, arriveMinutes, safeMinutes }` que replica M09 RF-CRM-260), `version`, `active`.

### 7.14 App de campo y sincronización

**`fieldForms`** (motor de relevamientos CNX §7.8): `code`, `name`, `version`, `questions [{ key, type: text|number|select|multi|photo|signature|geo|date|boolean|meterReading, required, options, validation }]`, `serviceIds[]`, `operationTypeIds[]`, `geofenceMeters?`, `status` (`draft|published|retired`).
**`fieldDevices`**: `deviceId` (UUID), `userId`, `model`, `os`, `appVersion`, `lastSyncAt`, `status` (`active|revoked`), `revokedAt`, `revokedBy`, `pushToken?`.
**`syncMutations`**:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `clientMutationId` | string (UUID v7) | sí | Idempotencia. |
| `deviceId`, `userId`, `profile` | — | sí | — |
| `domain` | enum `workOrder\|visit\|material\|evidence\|conformity\|inspection\|reading\|collection\|networkPoint\|servicePoint` | sí | Lecturas y cobros se derivan a M03/M07. |
| `action` | string | sí | `enRoute`, `arrive`, `saveChecklist`, `useMaterial`, `captureSignature`, `execute`, `fail`, etc. |
| `entityId` | ObjectId | no | — |
| `baseVersion` | int | sí | Versión descargada. |
| `payload` | objeto | sí | — |
| `occurredAt` / `recordedAt` | Date | sí | AGR-010. |
| `clockSkewMs` | int | sí | — |
| `result` | enum `applied\|duplicate\|conflict\|rejected\|deferred` | sí | Por ítem. |
| `resultDetail` | `{ code, message, conflictId? }` | no | — |

Índice único `{tenantId, clientMutationId}`; `{tenantId, deviceId, recordedAt}`.

**`syncConflicts`**: `workOrderId`/`entityRef`, `mutationIds[]`, `type` (`orderCancelled|orderReassigned|orderModified|equipmentChanged|holderChanged|serviceChanged|duplicateExecution|stockMismatch`), `serverStateSnapshot`, `fieldStateSnapshot`, `evidenceIds[]`, `status` (`open|inReview|resolved|dismissed`), `assigneeId`, `dueAt` (PRM-TEC-139), `resolution` (`acceptField|acceptServer|merge|compensate|newWorkOrder`), `resolutionNotes`, `resolvedBy`, `resolvedAt`, `followUpWorkOrderId?`. Índices: `{tenantId, status, assigneeId}`.

### 7.15 Mantenimiento e interrupciones

**`maintenancePlans`**: `name`, `target` (`{ networkElementId? , componentTypeId?, workId? }`), `operationTypeId`, `frequency` (`weekly|monthly|bimonthly|quarterly|fourMonthly|semiannual|annual|everyNDays`), `everyNDays?`, `marginBeforeDays`, `marginAfterDays`, `nextDueAt`, `lastGeneratedWorkOrderId`, `checklistFormIds[]`, `responsibleId`/`crewId`, `validUntil`, `active`. Índice `{tenantId, active, nextDueAt}`.
**`outagePlans`**: `number`, `networkElementIds[]`, `zoneGeometry?`, `reason`, `plannedStart`, `plannedEnd`, `actualStart`, `actualEnd`, `status` (§8.10), `impactSnapshot` (`{ computedAt, serviceCount, contractIds[] (o ref a export), criticalCount }`), `notificationCampaignRef` (T09), `approvedBy`, `workOrderIds[]`, `regulatorReportRefs[]`.

### 7.16 Red / GIS

Origen v2: `REDES`, `REDES_SERVICIOS`, `REDES_CAPAS`, `REDES_COMPONENTES`, `REDES_RELACIONES_COMPONENTES`, `REDES_ATRIBUTOS_COMPONENTES`, `REDES_ATRIBUTOS`, `REDES_RED_INSTALADA`, `SERSOC_REDES`; v1: `NIV_CAPA`, `NIV_SERV`, `NIV_REDES`, `SERSOC.INT_RED`.

| Colección | Campos |
|---|---|
| `networks` | `code`, `name` (`DES_RED`), `observations` (`OBS_RED`), `networkKind` (`electric\|water\|gas\|sewer\|telecom\|generic`), `serviceIds[]` (`REDES_SERVICIOS`), `active`. |
| `networkLayers` | `networkId`, `name` (`DES_CAPA`), `order`, `style`. |
| `networkComponentTypes` | `networkId`, `layerId?` (nulo = común), `name` (`DES_COMPONENTE`), `icon` (`ICON`), `allowsServiceConnection` (`PERMITE_CONECTAR`), `multipleConnections` (`MULTIPLES_CONEXIONES`), `multipleElements` (`MULTIPLES_ELEMENTOS`), `elementsName` (`NOMBRE_ELEMENTOS`), `distributesToChildren` (`DISTRIBUYE_EN_HIJOS`), `geometryType` (`point\|line\|polygon`), `isCritical` (para impacto). |
| `networkComponentRelations` | `networkId`, `layerId?`, `parentTypeId`, `childTypeId` (`ID_PADRE`, `ID_HIJO`). Único `{tenantId, networkId, layerId, parentTypeId, childTypeId}`. |
| `networkAttributeDefs` | `componentTypeId`, `label` (`DESCRIPCION`), `type` (`text\|integer\|decimal\|date\|boolean\|list\|catalogRef`), `maxLength` (`LARGO`), `decimals` (`DECIMALES`), `catalogRef` (`{ catalog: whitelist, idField, labelField }` ← `TABLA/ID_TABLA/DES_TABLA`), `options[]`, `visible` (`VISIBLE`), `required`. |
| `networkElements` | `networkId`, `layerId`, `componentTypeId`, `parentId` (`ID_PADRE_RED_INSTALADA`), `ancestorIds[]` (materializado para impacto), `code`, `description`, `number`, `rangeStart`/`rangeEnd` (`ELEMENTO_INICIAL/FINAL`), `geometry` (GeoJSON), `address` (`COD_CAL`, número), `status` (`planned\|available\|used\|damaged\|notApplicable\|retired`; `Estado_NodoRed`), `active` (`ACTIVO`), `attributes` (`{ [attributeDefId]: { value, displayText } }` ← `REDES_ATRIBUTOS`: `VALOR_CARACTER/FECHA/NUMERICO/ID_TABLA`), `equipment` (`{ brand, model, serial, technicalCharacteristics, installedAt, replacedAt }` ← `NIV_REDES.MARCA/MODELO/SERIE/CAR_TEC/FEC_INST/FEC_SUST`), `reference`, `networkDeviceId?`, `documents[]`, `warrantyUntil?`, `legacy` (subdocumento de T05 §19.1; la red de origen v1 o v2 queda en `legacy.table`: `NIV_REDES` o `REDES_RED_INSTALADA`; antes `legacyRef`, CTR-DAT-32). Índices: `{tenantId, networkId, layerId, parentId}`; `{tenantId, ancestorIds}`; `{tenantId, geometry}` 2dsphere; `{tenantId, code}` único. |
| `serviceNetworkConnections` | `contractId` (`ID_SERSOC`), `networkElementId` (`ID_RED_INSTALADA`), `position?` (borne/par/puerto dentro del rango), `connectedAt` (`FECHA_CONEXION`), `disconnectedAt` (`FECHA_DESCONEXION`), `status` (`connected\|disconnected`; 1/2), `observations`, `workOrderId`. Índices: `{tenantId, contractId, status}`; `{tenantId, networkElementId, status}`; único parcial `{tenantId, networkElementId, position}` con `status=connected`. |
| `gisExportTemplates` | `name`, `target` (`externalGis\|regulator`), `files [{ fileName, format: fixedWidth\|csv\|txt, separator, encoding, dateFormat, header, fields [{ source, transform, width, pad }] }]`, `mappings` (`{ energyBands: { peak:[conceptIds], offPeak:[...], rest:[...], valley:[...] }, power:{...}, accountFormat, routeFormat, phaseSource }`), `serviceId`, `dateMode` (`readingDate\|invoiceDate`), `distributorCode` (V2 #2823). |

### 7.17 Equipos de red y aprovisionamiento

| Colección | Campos |
|---|---|
| `networkDevices` | `kind` (`olt\|router\|bras\|nas\|switch\|accessPoint\|phoneExchange\|dslam\|tvHeadend\|other`), `name`, `brand`, `model`, `serial`, `firmware`, `managementIp`, `port`, `networkElementId`, `provisioningSystemId?`, `credentialRef` (bóveda T06; reemplaza `MIKROTIK.USUARIO/CONTRASEÑA/IP/PUERTO/BMU`), `bmu` (bool, de `MIKROTIK.BMU`), `monitoring` (`{ enabled, lastStatus: up\|down\|unknown, lastCheckAt }`), `active`. |
| `provisioningSystems` | `type` (`mikrotik\|radius\|radiusGretix\|smartOlt\|wispro\|sopnet\|silexis\|ispfull\|sensa\|sitsa\|aion\|manual`), `name`, `serviceIds[]`, `endpoint`, `credentialRef`, `options` (`{ queryOnly, deleteUserOnDeactivate, disconnectedProfile, timeoutMs, rateLimit }`), `connectorId` (T06), `status` (`active\|disabled`), `lastHealthAt`. |
| `provisioningProfiles` | `provisioningSystemId`, `planId` (M02), `externalProfile` (nombre de perfil/queue/plan externo), `downMbps`, `upMbps`, `vlan`, `ipPool`, `onuProfile`, `validFrom`, `validTo`; perfil de TV (RF-TEC-183, HUE-TV-04): `tvPackageCode`, `channelLineupRef` (grilla de señales versionada), `casPackageIds[]`, `includedDecoders`, `maxDecoders`, `complementary` (bool: paquete premium o decodificador adicional del mismo plan). Único `{tenantId, provisioningSystemId, planId, validFrom}`. |
| `serviceTechnicalProfiles` | `contractId`, `serviceId`, `technology` (`ftth\|wireless\|dsl\|cable\|tv\|phone`), `accessUser` (`USER_ID`), `credentialRef` (bóveda; `USER_PASS`), `mac` (`MAC_ADR`), `ip` (`IP_ADR`), `ipMode` (`static\|dynamic`), `accessPoint` (`AP_CON`), `ldCon` (`LD_CON` [VERIFICAR significado]), `olt`, `slot`, `port`, `vport`, `onuSerial`, `cpeSerial`, `terminal` (`TERMINAL`), `position` (`POSIC`), `partnerData` (V2 #2422), `others` (`OTROS`), `externalIds [{ provisioningSystemId, externalCustomerId, externalContractId }]`, `decoders [{ serial, smartCardId?, casStatus: active\|suspended\|deactivated, packageIds[] }]` (solo TV, HUE-TV-04), `provisioningStatus` (`notProvisioned\|active\|suspended\|deactivated\|error`), `lastCommandId`, `registeredAt`, `registeredBy`. Único `{tenantId, contractId}`. |
| `provisioningCommands` | `commandId` (UUID; idempotencia), `provisioningSystemId`, `contractId`, `action` (`activate\|changePlan\|suspend\|reactivate\|deactivate\|delete\|query\|resetCredentials\|telemetryCommand`), `payload` (sin secretos en claro), `origin` (`{ module: tec\|mor\|crm\|contract, refId, reason }`), `workOrderId?`, `status` (§8.9), `attempts`, `nextAttemptAt`, `lastError`, `response` (normalizada), `confirmedAt`, `effectiveAt`, `manualTaskRef?`, `compensatesCommandId?`. Índices: `{tenantId, commandId}` único; `{tenantId, status, nextAttemptAt}`; `{tenantId, contractId, createdAt}`. Origen `TELEMED_COMM` (`OPERACION`, `COMANDO`, `RESPUESTA`, `SUMINISTRO`, `OBSERVACION`). |
| `providedMailboxes` | `contractId`, `userId` (`USER_ID`), `domain` (`DOMINIO`), `credentialRef` (no se migra `USER_PASS`), `others`, `status`, `registeredAt` (`FEC_REG`), `registeredBy` (`USU_REG`). |

### 7.18 Obras y contribución por mejoras

| Colección | Campos |
|---|---|
| `works` | `code`, `name` (`DES_OBR`), `serviceId` (`COD_SER`), `type` (`COD_TIP`), `groupId` (`COD_GRP`), `startAt` (`FEC_INI`), `endAt` (`FEC_FIN`), `hidden` (`OCULTAR`), `budget` (`{ total: Decimal128, lines[] }`), `progress` (`{ percent, milestones[{ name, plannedAt, doneAt }] }`), `costCenterId`, `approvalBasis` (`{ kind: ordinance\|agreement\|assembly, reference, documentId, approvedAt }`), `levy` (`{ enabled, criterion: frontMeters\|surface\|equalShares\|units\|custom, amountToDistribute: Decimal128, rounding, installments, financingPlanRef, status }`; `financingPlanRef` referencia el plan de cuotas tipo 17 de M04 por defecto, PRM-TEC-155 y RN-TEC-115), `status` (§8.11). |
| `workGroups` | `code`, `name` (`DES_GRP`), `debitAccountId`, `creditAccountId` (`COD_CTA`, `COD_CTH`), `sectionAllocations [{ costCenterId, percent }]`. |
| `workBeneficiaries` | `workId`, `premiseId` (M01), `accountId`, `holderId`, `frontMeters` (Decimal128), `surfaceM2`, `units`, `share` (Decimal128 calculado), `amount` (Decimal128), `exempt` (bool + motivo), `billingRef` (contrato tipo 17 que crea M02 al consumir EVT-TEC-25, clave obra + inmueble; TEC lo consulta para el seguimiento de cobro, HUECO-OBR-01). Índice `{tenantId, workId, premiseId}` único. |

### 7.19 Inspecciones

| Colección | Campos |
|---|---|
| `inspectionCases` | `number`, `contractId`, `serviceId`, `origin` (`consumptionAlert\|complaint\|meterReader\|controlPlan\|other`), `alertRef` (M03), `status` (§8.12), `workOrderIds[]`, `act` (`{ formResponseId, findings[], irregularityType, witnesses[{name, document}], signedByUser: bool, refusalNote, evidenceIds[], actHash, actAt }`), `sealIds[]`, `notification` (`{ sentAt, channel, deliveryRef, defenseDeadline }`), `defense` (`{ receivedAt, text, documentIds[] }`), `recoveryProposal` (`{ methodVersionRef (M04), periodFrom, periodTo, estimatedConsumption, amount: Decimal128, computedAt }`), `approval` (`{ approvedBy, approvedAt, resolutionDocId }`), `billingRef` (M05), `closedAt`, `outcome`. |
| `seals` | `number` (único), `batch`, `status` (`available\|assigned\|placed\|removed\|broken\|voided`), `assignedTo` (inspector), `placement` (`{ meterId, contractId, at, workOrderId, evidenceId }`), `removal` (`{ at, reason, workOrderId }`). |

### 7.20 Telefonía (red, numeración, líneas, CDR)

| Colección | Campos (origen) |
|---|---|
| `phoneExchanges` | `code`, `name` (`DES_CEN`/`NOM_CEN`), `cdrModality` (`MODALIDAD`, enum de ≈35 formatos), `importSeconds` (`IMP_SEGUNDOS`), `importKey` (`IMP_CLAVE`), `lastDisk` (`ULTIMO_DISCO`/`ULT_DSK`), `geo` (`GPS_LATITUD/LONGITUD`), `prefixId` (`COD_PRE`), `currency` (`COD_MON`), `externalId` (`ID_TEL`), `networkDeviceId`, `onlineSource?` (Gretix, Tecnored Sunsip, AION, Central Online), `readerOptions` (`{ excludedNumbers[] (V2 #2444), zeroAmountForKey99 (V2 #2346) }`). Unifica `TEL_CENTRAL` y `CENTRALT`. |
| `phonePorts` | `ownerType` (`exchange\|dslam`), `ownerId`, `number`/`name` (`NUMERO`, `DES_PTO_DSLAM`), `linkedDslamPortId` (`COD_PTO_DSLAM`), `outgoingConnected` (`CON_SAL`), `incomingConnected` (`CON_ENT`), `status` (`available\|unavailable\|inactive`; `INACTIVO`). |
| `phoneFrames` | `name` (`DES_REP`), `exchangeId` (`COD_CEN`), `geo`. |
| `phoneFrameGroups` | `frameId`, `name` (`DES_GRU`), `direction` (`TIPO`: entrada/salida). |
| `phoneStrips` | `ownerType` (`frameGroup\|box`), `ownerId`, `name` (`DES_REG`). |
| `phoneStripPositions` | `stripId`, `ownerType`, `name` (`DES_POS`), `number`, `terminal` (`TER`), `trm` (`TRM`), `color`, `previousPositionId` (`COD_POS_ANT`), `dslamPortId`, `exchangePortId`, `groupPositionId` (`COD_POS_REG_GRU`), `outgoingConnected`, `incomingConnected`, `status`, `contractId?` (servicio conectado). |
| `phoneBoxes` | `name` (`DES_CAJA`), `frameId` (`COD_REP`), `address`, `geo`. |
| `dslams` | `name` (`DES_DESLAM`), `brand`, `model`, `serial`, `observations`, `networkDeviceId`. |
| `phonePrefixes` | `code`, `name` (`DES_PRE`). |
| `phoneNumbers` | `prefixId`, `number`, `status` (`available\|reserved\|assigned\|quarantine\|retired`; `ESTADO`), `createdOn` (`FEC_ALTA`), `reservedByWorkOrderId?`. Único `{tenantId, prefixId, number}`. |
| `phoneLines` | `contractId` (`ID_SERSOC`), `phoneNumberId?` (`COD_NUM`), `tariffPlanId` (M04, `COD_TAR`), `validFrom` (`FEC_ALTA`), `validTo` (`FEC_BAJA`), `observation`, `workOrderId?`. Índice `{tenantId, phoneNumberId, validFrom, validTo}`. |
| `numberingPlan` | `fullNumber` (`NUMERO`), `description` (`DES_CAR`), `provinceId` (`COD_PRV`), `locality`, `indicative`, `block`, `operatorId` (`COD_OPE`), `serviceTypeId` (`COD_SERV`), `modalityId` (`COD_MOD`), `tariffKey` (`CLAVE`, M04), `isLocal` (`LOCAL`), `source` (`{ file, importedAt }`). Índice `{tenantId, fullNumber}` y búsqueda por prefijo más largo (prefijos expandidos `prefixes[]`). |
| `telecomOperators` | `name` (`DES_OPE`), `accountId?` (`COD_SUM`, para liquidar CPP), `generic` (`GENERICO`). |
| `telecomServiceTypes` / `telecomModalities` | `name` (`DES_SERV`) / `name` (`DES_MOD`), `isMobile` (`MOVIL`). |
| `cdrImports` | `exchangeId?`, `operatorId?`, `kind` (`outgoing\|incoming\|international\|cpp\|rejected\|mobileInvoice`), `fileName`, `fileHash`, `lot` (`LOTE`), `status` (§8.14), `rows` (`{ total, imported, duplicates, errors, unattributed }`), `errors [{ row, message }]`, `ratingRequestedAt`, `rolledBackAt`. Índice único `{tenantId, fileHash}`. |
| `callRecords` | `cdrImportId`, `direction` (`outgoing\|incoming`), `kind` (`regular\|international\|cpp\|rejected`), `origin` (`NRO_ORI`/`ORIGEN`), `destination` (`NRO_DES`/`DESTINO`), `destinationDescription` (`DES_DES`), `startedAt` (`FECHA`/`FEC_LLA`), `seconds` (`SEGUNDOS`/`SEC_LLA`), `roundedSeconds` (`SEC_CPP`), `trunk` (`TRONCAL`), `ncnt`/`ndisk` (`NCNT`, `NDISK`), `sourceKey` (`IMP_CLAVE`), `sourceAmount` (Decimal128; `IMP_CPP` o importe del CDR), `operatorId` (`COD_OPE`), `operatorLot` (`LOT_OPE`), `attributedLineId` (`COD_TSE`), `attributedContractId`, `attributionStatus` (`attributed\|originNotFound\|duplicate\|manual\|destinationNotFound`), `dedupeKey` (origen+destino+fecha+segundos), `ratingRef` (tasación de M04 con `phoneRates`/`phoneRatePlans`; M04 no tiene `callRatings`, CTR-DAT-70), `grouped` (bool; `GRUPO≠0`), `rejected` (`{ publicNumber, subscriber, calledNo, calledYa, amount, cppDuration, realDuration, previousCall, previousCallNo, at }` ← `RECHAZOS`). Índices: `{tenantId, dedupeKey}` único; `{tenantId, attributedContractId, startedAt}`; `{tenantId, attributionStatus}`. Retención: los registros de más de 36 meses se archivan con consulta diferida (DEC-087); API-TEC-55 sobre un período archivado responde con consulta diferida en lugar del detalle en línea. |
| `mobileUsageImports` | `kind` (`mobileResale` por defecto: consumos de telefonía móvil revendida; `ticQuota`: consumo de correo o pack SMS con cupo, DEC-084, RF-TEC-195), `provider` (`claro\|personal` en `mobileResale`; código del proveedor de la conexión de T06 en `ticQuota`), `period`, `fileName`, `lines [{ lineNumber, contractId?, concepts[{ type, quantity, amount }] }]`, `status`. Campos adicionales para `kind = ticQuota`: `connectionId` y `sourceMessageId` (EVT-INT-24 de T06) o `importedBy` (carga manual), y en cada línea `externalRef` (casilla o línea del pack), `serviceId`, `unit` (`sms\|mailbox\|gb`), `quantity` (Decimal128 ≥ 0), `measuredFrom`, `measuredTo`, `attributionStatus` (`attributed\|unattributed\|rejected`), `revision` (Int; una corrección reemplaza la anterior mientras el período no esté facturado, `fac.service.isPeriodBilled`), `reportedAt`. Índices: `{tenantId, kind, provider, period, fileHash}` único (idempotencia del archivo o mensaje); `{tenantId, 'lines.contractId', period, kind}`. Texto anterior: "`provider` (`claro\|personal`), `period`, `fileName`, `lines [{ lineNumber, contractId?, concepts[{ type, quantity, amount }] }]`, `status`." |
| `numberPortings` | Solo si PRM-TEC-156 = true (RF-TEC-234, PA-TEC-19): `portId`, `direction` (`incoming\|outgoing`), `phoneNumberId?`, `fullNumber`, `contractId`, `counterpartOperatorId` (donante o receptor), `requestedAt`, `scheduledWindow` (`{ from, to }`), `executedAt?`, `status` (entrante `requested\|submitted\|accepted\|rejected\|scheduled\|executed\|cancelled`; saliente `received\|validated\|accepted\|rejected\|executed`), `rejectionReason?`, `documentIds[]` (constancias, T11), `workOrderId?`. Índice único `{tenantId, portId}`. |

Calidad del agua (RF-TEC-235, RF-TEC-236; solo si PRM-TEC-157 = true): **`waterSamplingPoints`**: `code`, `name`, `networkElementId?`, `geometry` (punto GeoJSON), `pointKind` (`well|tank|plant|network|serviceConnection`), `parameters [{ parameterCode, unit, lowerLimit?, upperLimit?, normRef, frequency, everyNDays? }]`, `concessionRef`, `active`. **`waterSamples`**: `samplingPointId`, `workOrderId`, `takenAt`, `takenBy`, `custodyChain [{ at, by, step }]`, `laboratory` (`{ name, registration, external: bool }`), `labReportDocumentId` (T11, con hash), `results [{ parameterCode, value: Decimal128, unit, withinLimit: bool }]`, `outOfLimit` (bool), `correctiveActions [{ kind: purge|chlorination|preventiveNotice|other, workOrderId?, communicationRef?, doneAt? }]`, `status` (`taken|inLab|resulted|actionPending|closed`), `supersedesSampleResultId?`. Índices `{tenantId, samplingPointId, takenAt}`; `{tenantId, outOfLimit, status}`.

### 7.21 Colecciones referenciadas (no propias)

`serviceContracts` (M02, dueño único, CTR-DAT-71), `persons`/`holders`/`accounts`/`premises`/`servicePoints` (M01), `tenantServices`/`servicePlans` (M02), `meters` (M03), `phoneRates`/`phoneRatePlans`, `chargeRules` (M04), `inventoryItems`, `serialUnits`, `warehouses`, `stockMovements`, `custodies` (M13), `quotes` (M11), `fleetVehicles` (M18), `surveys` (T09), `documents` y `numberingSequences` (T11), `streets`/`localities`/`holidays` (T04), `crmCases` (M09). Nombres de campo según T05 §7.2: `holderId`, `premiseId`, `servicePointId`, `serviceId`, `contractId`, `inventoryItemId`, `serialUnitId`, `warehouseId`, `vehicleId`, `crmCaseId`, `credentialRef` (CTR-DAT-30).

### 7.22 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.22.1 `feasibilityRequests` (COL-TEC-01) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `prospect` | object | No es referencia: datos embebidos del prospecto (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `estimateId` | ObjectId | `connectionEstimates` (M10); antes implícita por el nombre |
| `quoteRef` | object | → M11 `salesQuotes` (`quoteRef.id`) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `cancelReason` | string | No es referencia: motivo en texto libre (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.22.2 `connectionEstimates` (COL-TEC-02) — referencias declaradas

| Campo | Referencia |
|---|---|
| `feasibilityRequestId` | `feasibilityRequests` (M10); antes implícita por el nombre |
| `templateId` | → T11 `documentTemplates` (T05 §7.2.1) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.22.3 `technicalNotes` (COL-TEC-03)

Lista original: §7.3.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `entityType` | enum | [VERIFICAR] | `feasibility\|workOrder\|work\|inspectionCase\|networkElement` | — |
| `entityId` | ObjectId | [VERIFICAR] | — | Polimórfica según `entityType`: → M10 `feasibilityRequests` · `workOrders` · `works` · `inspectionCases` · `networkElements` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `title` | [VERIFICAR] | [VERIFICAR] | — | — |
| `text` | string | [VERIFICAR] | — | — |
| `occurredAt` | Date | [VERIFICAR] | — | — |
| `authorUserId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `responsibleId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `visibility` | enum | [VERIFICAR] | `internal\|public` | — |
| `source` | enum | [VERIFICAR] | `admin\|field\|integration\|system` | — |
| `subjectRef` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.4 `workOrderOperationTypes` (COL-TEC-04) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `resultingServiceStatusId` | ObjectId | → M02 `serviceStatuses` (`ESTASER`) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `defaultWorkTypeId` | ObjectId | `workTypes` (M10); antes implícita por el nombre |
| `defaultResolutionIds` | ObjectId[] | → M10 `resolutionCodes` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `requiredTaskIds` | ObjectId[] | → M10 `taskCatalog` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `checklistFormIds` | ObjectId[] | `fieldForms` (M10); antes implícita por el nombre |
| `visitTypeId` | ObjectId | `visitTypes` (M10); antes implícita por el nombre |

#### 7.22.5 `workTypes` (COL-TEC-05)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | `service\|maintenance`; reemplaza `TIP_ORD` 1/2 | — |
| `printTemplateId` | ObjectId | [VERIFICAR] | — | `workOrderPrintTemplates` (M10); antes implícita por el nombre |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.6 `incidentCategories` (COL-TEC-06)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `rubric` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `defaultOperationTypeId` | ObjectId | [VERIFICAR] | — | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `debitAccountId` | ObjectId | [VERIFICAR] | — | → M15 `ledgerAccounts` (T05 §7.2) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `creditAccountId` | ObjectId | [VERIFICAR] | M15 | → M15 `ledgerAccounts` (T05 §7.2) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `classCode` | string | [VERIFICAR] | clase con numerador propio, de `CLAS_INC` | — |
| `regulatorCode` | string | [VERIFICAR] | para informes de calidad | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.7 `resolutionCodes` (COL-TEC-07)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceId` | ObjectId | No | nulo = genérica | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `operationTypeId` | ObjectId | No | — | `operationTypes` (T11); antes implícita por el nombre |
| `outcome` | enum | [VERIFICAR] | `resolved\|notResolved\|improcedent\|referred` | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.8 `taskCatalog` (COL-TEC-08)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `taskGroupId` | ObjectId | [VERIFICAR] | Nombre de T05; antes `groupId` en este anexo. | `taskGroups` (M10); antes implícita por el nombre |
| `serviceId` | ObjectId | No | — | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `standardMinutes` | int | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.9 `taskGroups` (COL-TEC-09)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |

#### 7.22.10 `workOrderPrintTemplates` (COL-TEC-10)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `operationTypeId` | ObjectId | [VERIFICAR] | — | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `templateKey` | string | [VERIFICAR] | plantilla PDF | — |
| `includeMap` | bool | [VERIFICAR] | — | — |
| `includeWithdrawalSlips` | bool | [VERIFICAR] | — | — |
| `includeIncidentReport` | bool | [VERIFICAR] | — | — |
| `maxMaterialLines` | [VERIFICAR] | [VERIFICAR] | — | — |
| `templateVersionId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `templateVersions` (T11); antes implícita por el nombre |

#### 7.22.11 `chainedOrderRules` (COL-TEC-11)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | — | — |
| `sourceServiceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `sourceOperationTypeId` | ObjectId | No | — | → M10 `workOrderOperationTypes` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `targetServiceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `targetOperationTypeId` | ObjectId | [VERIFICAR] | — | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `targetIntakeChannelId` | ObjectId | [VERIFICAR] | — | → M09 `crmChannels` (vía de ingreso `VIAINGTE`, CTR-DAT-77) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `confirmOrder` | enum | [VERIFICAR] | `sourceFirst\|targetFirst`; `CONFIRMAR_ULTIMA` | — |
| `active` | bool | [VERIFICAR] | — | — |
| `operationTypeId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.12 `workOrders` (COL-TEC-12) — referencias declaradas

| Campo | Referencia |
|---|---|
| `operationTypeId` | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `feasibilityRequestId` | `feasibilityRequests` (M10); antes implícita por el nombre |
| `inspectionCaseId` | `inspectionCases` (M10); antes implícita por el nombre |
| `visitIds` | `visits` (M10); antes implícita por el nombre |

#### 7.22.13 `workOrderMaterials` (COL-TEC-13) — referencias declaradas

| Campo | Referencia |
|---|---|
| `workId` | `works` (M10); antes implícita por el nombre |
| `stockMovementIds` | `stockMovements` (M13); antes implícita por el nombre |
| `clientMutationId` | `syncMutations` (M10); antes implícita por el nombre |

#### 7.22.14 `fieldEvidence` (COL-TEC-14) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `entityType` | enum | No es referencia: discriminador de `entityId` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `entityId` | ObjectId | Polimórfica según `entityType`: → M10 `workOrders` · `visits` · `inspectionCases` · `networkElements` · `feasibilityRequests` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `deviceId` | ObjectId | `fieldDevices` (M10); antes implícita por el nombre |
| `clientMutationId` | UUID | `syncMutations` (M10); antes implícita por el nombre |

#### 7.22.15 `serviceConformities` (COL-TEC-15) — referencias declaradas

| Campo | Referencia |
|---|---|
| `visitId` | `visits` (M10); antes implícita por el nombre |
| `installerId` | `certifiedInstallers` (M10); antes implícita por el nombre |

#### 7.22.16 `damageAssessments` (COL-TEC-16)

Lista original: §7.10.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `workOrderId` | ObjectId | [VERIFICAR] | — | `workOrders` (M10) |
| `crmCaseId` | ObjectId | [VERIFICAR] | M09 | `crmCases` (M09) |
| `paymentDate` | Date | [VERIFICAR] | — | — |
| `transferCenter` | [VERIFICAR] | [VERIFICAR] | — | — |
| `bookNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `folioNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `claimedAmount` | Decimal128 | [VERIFICAR] | — | — |
| `approvedAmount` | Decimal128 | [VERIFICAR] | — | — |
| `previousDamages` | bool | [VERIFICAR] | bool/texto | — |
| `accepted` | bool | [VERIFICAR] | — | — |
| `regulatorClaim` | object | [VERIFICAR] | `{ regulator: 'OCEBA'\|..., number, filedAt }` | — |
| `cause` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `open`, `inReview`, `approved`, `rejected`, `paid` (§8.16; PA-TEC-23); antes "`open\|inReview\|approved\|rejected\|paid`" | — |
| `settlementRef` | string | [VERIFICAR] | M05/M14 | — |

#### 7.22.17 `technicalProcedures` (COL-TEC-17)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `installerId` | ObjectId | [VERIFICAR] | `COD_PROF` | `certifiedInstallers` (M10); antes implícita por el nombre |
| `address` | [VERIFICAR] | [VERIFICAR] | calle, número, barrio, localidad, provincia, CP, piso, torre, dpto | — |
| `contact` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `openedAt` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `open`, `inReview`, `observed`, `approved`, `rejected`, `cancelled` (§8.15; PA-TEC-22; antes sin valores ni máquina). | — |
| `externalUserRef` | string | [VERIFICAR] | `COD_USER_MYSQL` → portal, se migra como referencia de usuario del portal M19 | — (identificador del sistema externo; no es referencia interna) |
| `dossierId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `dossiers` (T11); antes implícita por el nombre |

#### 7.22.18 `visitTypes` (COL-TEC-18)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `durationMinutes` | int | [VERIFICAR] | — | — |
| `slotTemplate` | [VERIFICAR] | [VERIFICAR] | franjas, ej. 09–11, 11–13, 14–16, 16–18 | — |
| `requiredSkills` | array | [VERIFICAR] | — | — |
| `requiresCrew` | bool | [VERIFICAR] | — | — |
| `requiresVehicle` | bool | [VERIFICAR] | — | — |
| `requiresEquipment` | bool | [VERIFICAR] | — | — |
| `memberBookable` | bool | [VERIFICAR] | — | — |
| `minLeadHours` | int | [VERIFICAR] | — | — |
| `maxHorizonDays` | int | [VERIFICAR] | — | — |
| `failedVisitChargeRuleRef` | string | No | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.19 `schedulingZones` (COL-TEC-19)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `geometry` | [VERIFICAR] | [VERIFICAR] | (Polygon/MultiPolygon) o `localityIds[]`/`neighborhoodIds[]` | — |
| `crewIds` | array | [VERIFICAR] | — | `crews` (M10); antes implícita por el nombre |
| `active` | bool | [VERIFICAR] | . Índice 2dsphere | — |
| `zoneIds` | ObjectId[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `zones` (T04); antes implícita por el nombre |

#### 7.22.20 `resourceCalendars` (COL-TEC-20) — referencias declaradas

| Campo | Referencia |
|---|---|
| `resourceId` | `fieldResources` (M10); antes implícita por el nombre |
| `zoneIds` | `schedulingZones` (M10); antes implícita por el nombre |
| `visitTypeIds` | `visitTypes` (M10); antes implícita por el nombre |

#### 7.22.21 `visitBookings` (COL-TEC-21) — referencias declaradas

| Campo | Referencia |
|---|---|
| `resourceId` | `fieldResources` (M10); antes implícita por el nombre |

#### 7.22.22 `slotCounters` (COL-TEC-70)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `slotKey` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.23 `visits` (COL-TEC-22) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `bookingId` | ObjectId | `visitBookings` (M10); antes implícita por el nombre |
| `visitTypeId` | ObjectId | `visitTypes` (M10); antes implícita por el nombre |
| `zoneId` | ObjectId | `schedulingZones` (M10); antes implícita por el nombre |
| `assignedCrewId` | ObjectId | `crews` (M10); antes implícita por el nombre |
| `assignedResourceIds` | ObjectId[] | → M10 `fieldResources` (PA-TEC-23; antes "`fieldResources` (M10); antes implícita por el nombre") |
| `rescheduledToVisitId` | ObjectId | `visits` (M10); antes implícita por el nombre |
| `rescheduledFromVisitId` | ObjectId | `visits` (M10); antes implícita por el nombre |

#### 7.22.24 `crews` (COL-TEC-23)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `leaderId` | ObjectId | [VERIFICAR] | — | → M10 `fieldResources` (jefe de cuadrilla) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `zoneIds` | array | [VERIFICAR] | — | `schedulingZones` (M10); antes implícita por el nombre |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `skills` | array | [VERIFICAR] | — | — |
| `defaultVehicleId` | ObjectId | [VERIFICAR] | M18 | `fleetVehicles` (M18) |
| `custodyWarehouseId` | ObjectId | [VERIFICAR] | M13 | `warehouses` (M13) |
| `dailyCapacityUnits` | [VERIFICAR] | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |
| `employeeIds` | ObjectId[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `employees` (M16) |
| `warehouseId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `warehouses` (M13) |

#### 7.22.25 `fieldResources` (COL-TEC-24)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `activity` | enum | [VERIFICAR] | `technician\|installer\|meterReader\|collector\|inspector\|supervisor\|other` | — |
| `userId` | ObjectId | [VERIFICAR] | T02; sin contraseña propia | `memberships` (T02) |
| `email` | [VERIFICAR] | [VERIFICAR] | — | — |
| `phone` | [VERIFICAR] | [VERIFICAR] | — | — |
| `custodyWarehouseId` | ObjectId | [VERIFICAR] | `COD_DPS` | `warehouses` (M13) |
| `assignToFieldApp` | [VERIFICAR] | [VERIFICAR] | `ASIGNAOT_PMOVIL` | — |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `operationTypeIds` | array | [VERIFICAR] | responsables por servicio/operación, `RELACION_ENTIDADES` | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `skills` | array | [VERIFICAR] | — | — |
| `employeeId` | ObjectId | No | M16 | `employees` (M16) |
| `defaultHourRate` | Decimal128 | [VERIFICAR] | — | — |
| `inactive` | [VERIFICAR] | [VERIFICAR] | — | — |
| `vehicleId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `fleetVehicles` (M18) |

#### 7.22.26 `responsibleNotificationRules` (COL-TEC-25)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `orderKind` | [VERIFICAR] | [VERIFICAR] | — | — |
| `operationTypeIds` | array | [VERIFICAR] | reemplaza `COD_OPER` con `\|` | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `fieldResourceId` | ObjectId | [VERIFICAR] | — | `fieldResources` (M10); antes implícita por el nombre |
| `daysOfWeek` | array | [VERIFICAR] | 1–7 ISO | — |
| `from` | Date | [VERIFICAR] | — | — |
| `to` | Date | [VERIFICAR] | — | — |
| `includeHolidays` | bool | [VERIFICAR] | — | — |
| `notifyAt` | enum | [VERIFICAR] | `onCreate\|onDispatch` | — |
| `channel` | enum | [VERIFICAR] | `whatsapp\|email\|sms\|push` | — |
| `templateKey` | string | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.27 `certifiedInstallers` (COL-TEC-26)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097): dato propio de la ficha.* El nombre se lee de la persona (M01 `per.getPersonIdentity`) | — |
| `registrationNumber` | int / string [VERIFICAR] | [VERIFICAR] | matrícula | — |
| `documentNumber` | int / string [VERIFICAR] | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097).* El documento se lee de la persona (M01) | — |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `installerCategory` | [VERIFICAR] | [VERIFICAR] | — | — |
| `phone` | [VERIFICAR] | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097).* Contactos de la persona (M01) | — |
| `email` | [VERIFICAR] | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097).* Contactos de la persona (M01) | — |
| `whatsapp` | [VERIFICAR] | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097).* Contactos de la persona (M01) | — |
| `address` | [VERIFICAR] | No (Reemplazado) | *Reemplazado (10-11-2026, DEC-097).* Domicilios de la persona (M01) | — |
| `active` | bool | [VERIFICAR] | — | — |
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | (provincia del registro de instaladores, por ejemplo Córdoba, Ley 10281) para la validación de PRM-TEC-043 | — |
| `personId` | ObjectId | Sí | Persona única del instalador (DEC-097, M01 RN-PER-135): alta asistida de M01 RF-PER-174 con control de duplicados; único por `{tenantId, personId}`. *Reemplazado (10-11-2026): "Oblig. [VERIFICAR]; declarado en T05; no figuraba en la lista del anexo."* | `persons` (M01) |
| `licenseNumber` | int / string [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.28 `onCallShifts` (COL-TEC-71)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `zoneIds` | array | [VERIFICAR] | — | `schedulingZones` (M10); antes implícita por el nombre |
| `date` | Date | [VERIFICAR] | — | — |
| `from` | Date | [VERIFICAR] | — | — |
| `to` | Date | [VERIFICAR] | — | — |
| `holidayRule` | enum | [VERIFICAR] | `include\|exclude\|only` | — |
| `primaryResourceId` | ObjectId | [VERIFICAR] | — | `fieldResources` (M10); antes implícita por el nombre |
| `backupResourceId` | ObjectId | [VERIFICAR] | — | `fieldResources` (M10); antes implícita por el nombre |
| `chiefResourceId` | ObjectId | [VERIFICAR] | — | `fieldResources` (M10); antes implícita por el nombre |
| `publicPhone` | [VERIFICAR] | [VERIFICAR] | teléfono de guardia publicado | — |
| `status` | enum | Sí | Valores: `planned`, `active`, `closed` (§8.16; PA-TEC-23); antes "`planned\|active\|closed`" | — |
| `serviceCodes` | array[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.29 `emergencyProtocols` (COL-TEC-72)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | `gasLeak\|electricHazard\|fallenCable\|severeLeak\|other` | — |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `preventiveCutoff` | enum | [VERIFICAR] | `never\|optional\|required` | — |
| `noticeTemplateKey` | string | [VERIFICAR] | T09 `tec.emergency.notice` | — |
| `targets` | object | [VERIFICAR] | `{ acceptMinutes, arriveMinutes, safeMinutes }` que replica M09 RF-CRM-260 | — |
| `version` | [VERIFICAR] | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |
| `serviceCodes` | array[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.30 `fieldForms` (COL-TEC-27)

Lista original: §7.14.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `version` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceIds` | array | [VERIFICAR] | — | `tenantServices` (M02) |
| `operationTypeIds` | array | [VERIFICAR] | — | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `geofenceMeters` | [VERIFICAR] | No | — | — |
| `status` | enum | Sí | Valores: `draft`, `published`, `retired` (§8.16; PA-TEC-23); antes "`draft\|published\|retired`" | — |
| `formVersionId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `formVersions` (T11); antes implícita por el nombre |

#### 7.22.31 `fieldDevices` (COL-TEC-28) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `deviceId` | UUID | No es referencia: UUID del dispositivo móvil (no es un equipo de red) (PA-TEC-23; antes "`networkDevices` (M10); antes implícita por el nombre") |
| `userId` | ObjectId | → T02 `memberships`. T05 lo nombra `membershipId` (COL-TEC-28); se conserva `userId` (PA-TEC-23). |

#### 7.22.32 `syncMutations` (COL-TEC-29) — referencias declaradas

| Campo | Referencia |
|---|---|
| `clientMutationId` | `syncMutations` (M10); antes implícita por el nombre |
| `deviceId` | → M10 `fieldDevices` (por su `deviceId` UUID; T05 §7.2.1) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `entityId` | Polimórfica según `domain`: → M10 `workOrders` · `visits` · `workOrderMaterials` · `fieldEvidence` · `serviceConformities` · `inspectionCases` · `networkElements` (las de `reading` y `collection` se derivan a M03 y M07) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.22.33 `syncConflicts` (COL-TEC-30)

Lista original: §7.14.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `workOrderId` | ObjectId | [VERIFICAR] | /`entityRef` | `workOrders` (M10) |
| `mutationIds` | array | [VERIFICAR] | — | `syncMutations` (M10); antes implícita por el nombre |
| `type` | enum | [VERIFICAR] | `orderCancelled\|orderReassigned\|orderModified\|equipmentChanged\|holderChanged\|serviceChanged\|duplicateExecution\|stockMismatch` | — |
| `serverStateSnapshot` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fieldStateSnapshot` | [VERIFICAR] | [VERIFICAR] | — | — |
| `evidenceIds` | array | [VERIFICAR] | — | `fieldEvidence` (M10); antes implícita por el nombre |
| `status` | enum | Sí | Valores: `open`, `inReview`, `resolved`, `dismissed` (§8.16; PA-TEC-23); antes "`open\|inReview\|resolved\|dismissed`" | — |
| `assigneeId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `dueAt` | Date | [VERIFICAR] | PRM-TEC-139 | — |
| `resolution` | enum | [VERIFICAR] | `acceptField\|acceptServer\|merge\|compensate\|newWorkOrder` | — |
| `resolutionNotes` | [VERIFICAR] | [VERIFICAR] | — | — |
| `resolvedBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `resolvedAt` | Date | [VERIFICAR] | — | — |
| `followUpWorkOrderId` | ObjectId | No | — | `workOrders` (M10); antes implícita por el nombre |
| `syncMutationId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `syncMutations` (M10); antes implícita por el nombre |

#### 7.22.34 `maintenancePlans` (COL-TEC-31)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | — | — |
| `target` | object | [VERIFICAR] | `{ networkElementId? , componentTypeId?, workId? }` | — |
| `operationTypeId` | ObjectId | [VERIFICAR] | — | `workOrderOperationTypes` (M10); antes implícita por el nombre |
| `frequency` | enum | [VERIFICAR] | `weekly\|monthly\|bimonthly\|quarterly\|fourMonthly\|semiannual\|annual\|everyNDays` | — |
| `everyNDays` | int | No | — | — |
| `marginBeforeDays` | int | [VERIFICAR] | — | — |
| `marginAfterDays` | int | [VERIFICAR] | — | — |
| `nextDueAt` | Date | [VERIFICAR] | — | — |
| `lastGeneratedWorkOrderId` | ObjectId | [VERIFICAR] | — | `workOrders` (M10) |
| `checklistFormIds` | array | [VERIFICAR] | — | `fieldForms` (M10); antes implícita por el nombre |
| `responsibleId` | ObjectId | [VERIFICAR] | /`crewId` | `memberships` (T02) |
| `validUntil` | [VERIFICAR] | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |
| `networkElementIds` | ObjectId[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `networkElements` (M10); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.35 `outagePlans` (COL-TEC-32)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `networkElementIds` | array | [VERIFICAR] | — | `networkElements` (M10); antes implícita por el nombre |
| `zoneGeometry` | [VERIFICAR] | No | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `plannedStart` | Date | [VERIFICAR] | — | — |
| `plannedEnd` | Date | [VERIFICAR] | — | — |
| `actualStart` | Date | [VERIFICAR] | — | — |
| `actualEnd` | Date | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `draft`, `approved`, `notified`, `inProgress`, `completed`, `cancelled` (§8.16; PA-TEC-23); antes "§8.10" | — |
| `impactSnapshot` | object | [VERIFICAR] | `{ computedAt, serviceCount, contractIds[] (o ref a export), criticalCount }` | — |
| `notificationCampaignRef` | string | [VERIFICAR] | T09 | — |
| `approvedBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `workOrderIds` | array | [VERIFICAR] | — | `workOrders` (M10) |
| `regulatorReportRefs` | array | [VERIFICAR] | — | — |
| `outageNoticeId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `outageNotices` (T09); antes implícita por el nombre |

#### 7.22.36 `networks` (COL-TEC-33)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_RED` | — |
| `observations` | string | [VERIFICAR] | `OBS_RED` | — |
| `networkKind` | enum | [VERIFICAR] | `electric\|water\|gas\|sewer\|telecom\|generic` | — |
| `serviceIds` | array | [VERIFICAR] | `REDES_SERVICIOS` | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `active` | bool | [VERIFICAR] | — | — |
| `serviceId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `tenantServices` (M02) |

#### 7.22.37 `networkLayers` (COL-TEC-34)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `networkId` | ObjectId | [VERIFICAR] | — | `networks` (M10); antes implícita por el nombre |
| `name` | string | [VERIFICAR] | `DES_CAPA` | — |
| `order` | int | [VERIFICAR] | — | — |
| `style` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.38 `networkComponentTypes` (COL-TEC-35)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `networkId` | ObjectId | [VERIFICAR] | — | `networks` (M10); antes implícita por el nombre |
| `layerId` | ObjectId | No | nulo = común | `networkLayers` (M10); antes implícita por el nombre |
| `name` | string | [VERIFICAR] | `DES_COMPONENTE` | — |
| `icon` | [VERIFICAR] | [VERIFICAR] | `ICON` | — |
| `allowsServiceConnection` | bool | [VERIFICAR] | `PERMITE_CONECTAR` | — |
| `multipleConnections` | [VERIFICAR] | [VERIFICAR] | `MULTIPLES_CONEXIONES` | — |
| `multipleElements` | [VERIFICAR] | [VERIFICAR] | `MULTIPLES_ELEMENTOS` | — |
| `elementsName` | string | [VERIFICAR] | `NOMBRE_ELEMENTOS` | — |
| `distributesToChildren` | [VERIFICAR] | [VERIFICAR] | `DISTRIBUYE_EN_HIJOS` | — |
| `geometryType` | enum | [VERIFICAR] | `point\|line\|polygon` | — |
| `isCritical` | bool | [VERIFICAR] | para impacto | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.39 `networkComponentRelations` (COL-TEC-36)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `networkId` | ObjectId | [VERIFICAR] | — | `networks` (M10); antes implícita por el nombre |
| `layerId` | ObjectId | No | — | `networkLayers` (M10); antes implícita por el nombre |
| `parentTypeId` | ObjectId | [VERIFICAR] | — | → M10 `networkComponentTypes` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `childTypeId` | ObjectId | [VERIFICAR] | `ID_PADRE`, `ID_HIJO` | → M10 `networkComponentTypes` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.22.40 `networkAttributeDefs` (COL-TEC-37)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `componentTypeId` | ObjectId | [VERIFICAR] | — | `networkComponentTypes` (M10); antes implícita por el nombre |
| `label` | string | [VERIFICAR] | `DESCRIPCION` | — |
| `type` | enum | [VERIFICAR] | `text\|integer\|decimal\|date\|boolean\|list\|catalogRef` | — |
| `maxLength` | [VERIFICAR] | [VERIFICAR] | `LARGO` | — |
| `decimals` | [VERIFICAR] | [VERIFICAR] | `DECIMALES` | — |
| `catalogRef` | object | [VERIFICAR] | `{ catalog: whitelist, idField, labelField }` ← `TABLA/ID_TABLA/DES_TABLA` | — |
| `options` | array | [VERIFICAR] | — | — |
| `visible` | [VERIFICAR] | [VERIFICAR] | `VISIBLE` | — |
| `required` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.41 `networkElements` (COL-TEC-38)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `networkId` | ObjectId | [VERIFICAR] | — | `networks` (M10); antes implícita por el nombre |
| `layerId` | ObjectId | [VERIFICAR] | — | `networkLayers` (M10); antes implícita por el nombre |
| `componentTypeId` | ObjectId | [VERIFICAR] | — | `networkComponentTypes` (M10); antes implícita por el nombre |
| `parentId` | ObjectId | [VERIFICAR] | `ID_PADRE_RED_INSTALADA` | `networkElements` (M10) |
| `ancestorIds` | array | [VERIFICAR] | materializado para impacto | → M10 `networkElements` (ancestros materializados) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `code` | string | [VERIFICAR] | — | — |
| `description` | string | [VERIFICAR] | — | — |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `rangeStart` | Date | [VERIFICAR] | /`rangeEnd` (`ELEMENTO_INICIAL/FINAL`) | — |
| `geometry` | GeoJSON | [VERIFICAR] | GeoJSON | — |
| `address` | [VERIFICAR] | [VERIFICAR] | `COD_CAL`, número | — |
| `status` | enum | Sí | Valores: `planned`, `available`, `used`, `damaged`, `notApplicable`, `retired` (§8.16; PA-TEC-23); antes "`planned\|available\|used\|damaged\|notApplicable\|retired`; `Estado_NodoRed`" | — |
| `active` | bool | [VERIFICAR] | `ACTIVO` | — |
| `attributes` | object | [VERIFICAR] | `{ [attributeDefId]: { value, displayText } }` ← `REDES_ATRIBUTOS`: `VALOR_CARACTER/FECHA/NUMERICO/ID_TABLA` | — |
| `equipment` | object | [VERIFICAR] | `{ brand, model, serial, technicalCharacteristics, installedAt, replacedAt }` ← `NIV_REDES.MARCA/MODELO/SERIE/CAR_TEC/FEC_INST/FEC_SUST` | — |
| `reference` | [VERIFICAR] | [VERIFICAR] | — | — |
| `networkDeviceId` | ObjectId | No | — | `networkDevices` (M10); antes implícita por el nombre |
| `documents` | array | [VERIFICAR] | — | — |
| `warrantyUntil` | [VERIFICAR] | No | — | — |
| `legacy` | [VERIFICAR] | [VERIFICAR] | subdocumento de T05 §19.1; la red de origen v1 o v2 queda en `legacy.table`: `NIV_REDES` o `REDES_RED_INSTALADA`; antes `legacyRef`, CTR-DAT-32 | — (identificador del sistema externo; no es referencia interna) |

#### 7.22.42 `serviceNetworkConnections` (COL-TEC-39)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | ObjectId | [VERIFICAR] | `ID_SERSOC` | `serviceContracts` (M02) |
| `networkElementId` | ObjectId | [VERIFICAR] | `ID_RED_INSTALADA` | `networkElements` (M10); antes implícita por el nombre |
| `position` | [VERIFICAR] | No | borne/par/puerto dentro del rango | — |
| `connectedAt` | Date | [VERIFICAR] | `FECHA_CONEXION` | — |
| `disconnectedAt` | Date | [VERIFICAR] | `FECHA_DESCONEXION` | — |
| `status` | enum | Sí | Valores: `connected`, `disconnected` (§8.16; PA-TEC-23); antes "`connected\|disconnected`; 1/2" | — |
| `observations` | string | [VERIFICAR] | — | — |
| `workOrderId` | ObjectId | [VERIFICAR] | — | `workOrders` (M10); antes implícita por el nombre |
| `connected` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.43 `gisExportTemplates` (COL-TEC-40)

Lista original: §7.16.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | — | — |
| `target` | enum | [VERIFICAR] | `externalGis\|regulator` | — |
| `mappings` | object | [VERIFICAR] | `{ energyBands: { peak:[conceptIds], offPeak:[...], rest:[...], valley:[...] }, power:{...}, accountFormat, routeFormat, phaseSource }` | — |
| `serviceId` | ObjectId | [VERIFICAR] | — | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `dateMode` | enum | [VERIFICAR] | `readingDate\|invoiceDate` | — |
| `distributorCode` | string | [VERIFICAR] | V2 #2823 | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.44 `networkDevices` (COL-TEC-41)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | `olt\|router\|bras\|nas\|switch\|accessPoint\|phoneExchange\|dslam\|tvHeadend\|other` | — |
| `name` | string | [VERIFICAR] | — | — |
| `brand` | [VERIFICAR] | [VERIFICAR] | — | — |
| `model` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serial` | [VERIFICAR] | [VERIFICAR] | — | — |
| `firmware` | [VERIFICAR] | [VERIFICAR] | — | — |
| `managementIp` | [VERIFICAR] | [VERIFICAR] | — | — |
| `port` | [VERIFICAR] | [VERIFICAR] | — | — |
| `networkElementId` | ObjectId | [VERIFICAR] | — | `networkElements` (M10); antes implícita por el nombre |
| `provisioningSystemId` | ObjectId | No | — | `provisioningSystems` (M10); antes implícita por el nombre |
| `credentialRef` | string | [VERIFICAR] | bóveda T06; reemplaza `MIKROTIK.USUARIO/CONTRASEÑA/IP/PUERTO/BMU` | — |
| `bmu` | bool | [VERIFICAR] | bool, de `MIKROTIK.BMU` | — |
| `monitoring` | object | [VERIFICAR] | `{ enabled, lastStatus: up\|down\|unknown, lastCheckAt }` | — |
| `active` | bool | [VERIFICAR] | — | — |
| `serialUnitId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `serialUnits` (M13) |

#### 7.22.45 `provisioningSystems` (COL-TEC-42)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `type` | enum | [VERIFICAR] | `mikrotik\|radius\|radiusGretix\|smartOlt\|wispro\|sopnet\|silexis\|ispfull\|sensa\|sitsa\|aion\|manual` | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceIds` | array | [VERIFICAR] | — | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `endpoint` | [VERIFICAR] | [VERIFICAR] | — | — |
| `credentialRef` | string | [VERIFICAR] | — | `integrationSecrets` (T06) |
| `options` | object | [VERIFICAR] | `{ queryOnly, deleteUserOnDeactivate, disconnectedProfile, timeoutMs, rateLimit }` | — |
| `connectorId` | ObjectId | [VERIFICAR] | T06 | → T06 `integrationConnections` (conexión del conector, COL-INT-02) (PA-TEC-23; antes "[VERIFICAR] conector de T06 (colección no identificada en T05)") |
| `status` | enum | Sí | Valores: `active`, `disabled` (§8.16; PA-TEC-23); antes "`active\|disabled`" | — |
| `lastHealthAt` | Date | [VERIFICAR] | — | — |
| `connectionId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | Mismo dato que `connectorId` (nombre de T05); → T06 `integrationConnections`. Se usa `connectorId` (PA-TEC-23; antes "`serviceNetworkConnections` (M10); antes implícita por el nombre") |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.46 `provisioningProfiles` (COL-TEC-43)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `provisioningSystemId` | ObjectId | [VERIFICAR] | — | `provisioningSystems` (M10); antes implícita por el nombre |
| `planId` | ObjectId | [VERIFICAR] | M02 | `servicePlans` (M02) |
| `externalProfile` | [VERIFICAR] | [VERIFICAR] | nombre de perfil/queue/plan externo | — (identificador del sistema externo; no es referencia interna) |
| `downMbps` | [VERIFICAR] | [VERIFICAR] | — | — |
| `upMbps` | [VERIFICAR] | [VERIFICAR] | — | — |
| `vlan` | [VERIFICAR] | [VERIFICAR] | — | — |
| `ipPool` | [VERIFICAR] | [VERIFICAR] | — | — |
| `onuProfile` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `channelLineupRef` | string | [VERIFICAR] | grilla de señales versionada | — |
| `casPackageIds` | array | [VERIFICAR] | — | No es referencia: códigos de paquete del sistema de acceso condicional externo (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `includedDecoders` | [VERIFICAR] | [VERIFICAR] | — | — |
| `maxDecoders` | [VERIFICAR] | [VERIFICAR] | — | — |
| `complementary` | bool | [VERIFICAR] | bool: paquete premium o decodificador adicional del mismo plan | — |

#### 7.22.47 `serviceTechnicalProfiles` (COL-TEC-44)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `technology` | enum | [VERIFICAR] | `ftth\|wireless\|dsl\|cable\|tv\|phone` | — |
| `accessUser` | [VERIFICAR] | [VERIFICAR] | `USER_ID` | — |
| `credentialRef` | string | [VERIFICAR] | bóveda; `USER_PASS` | `integrationSecrets` (T06) |
| `mac` | [VERIFICAR] | [VERIFICAR] | `MAC_ADR` | — |
| `ip` | [VERIFICAR] | [VERIFICAR] | `IP_ADR` | — |
| `ipMode` | enum | [VERIFICAR] | `static\|dynamic` | — |
| `accessPoint` | [VERIFICAR] | [VERIFICAR] | `AP_CON` | — |
| `ldCon` | [VERIFICAR] | [VERIFICAR] | `LD_CON` [VERIFICAR significado] | — |
| `olt` | [VERIFICAR] | [VERIFICAR] | — | — |
| `slot` | [VERIFICAR] | [VERIFICAR] | — | — |
| `port` | [VERIFICAR] | [VERIFICAR] | — | — |
| `vport` | [VERIFICAR] | [VERIFICAR] | — | — |
| `onuSerial` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cpeSerial` | [VERIFICAR] | [VERIFICAR] | — | — |
| `terminal` | [VERIFICAR] | [VERIFICAR] | `TERMINAL` | — |
| `position` | [VERIFICAR] | [VERIFICAR] | `POSIC` | — |
| `partnerData` | [VERIFICAR] | [VERIFICAR] | V2 #2422 | — |
| `others` | [VERIFICAR] | [VERIFICAR] | `OTROS` | — |
| `provisioningStatus` | enum | Sí | Valores: `notProvisioned`, `active`, `suspended`, `deactivated`, `error` (§8.16; PA-TEC-23); antes "`notProvisioned\|active\|suspended\|deactivated\|error`" | — |
| `lastCommandId` | ObjectId | [VERIFICAR] | — | `provisioningCommands` (M10); antes implícita por el nombre |
| `registeredAt` | Date | [VERIFICAR] | — | — |
| `registeredBy` | ObjectId | [VERIFICAR] | — | — |

#### 7.22.48 `provisioningCommands` (COL-TEC-45)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `commandId` | UUID | [VERIFICAR] | UUID; idempotencia | `provisioningCommands` (M10); antes implícita por el nombre |
| `provisioningSystemId` | ObjectId | [VERIFICAR] | — | `provisioningSystems` (M10); antes implícita por el nombre |
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `action` | enum | [VERIFICAR] | `activate\|changePlan\|suspend\|reactivate\|deactivate\|delete\|query\|resetCredentials\|telemetryCommand` | — |
| `payload` | [VERIFICAR] | [VERIFICAR] | sin secretos en claro | — |
| `origin` | object | [VERIFICAR] | `{ module: tec\|mor\|crm\|contract, refId, reason }` | — |
| `workOrderId` | ObjectId | No | — | `workOrders` (M10) |
| `status` | enum | Sí | Valores: `queued`, `sending`, `retrying`, `confirmed`, `failed`, `manualPending`, `manualDone`, `cancelled`, `compensated`, `unknown` (§8.16; PA-TEC-23); antes "§8.9" | — |
| `attempts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `nextAttemptAt` | Date | [VERIFICAR] | — | — |
| `lastError` | [VERIFICAR] | [VERIFICAR] | — | — |
| `response` | [VERIFICAR] | [VERIFICAR] | normalizada | — |
| `confirmedAt` | Date | [VERIFICAR] | — | — |
| `effectiveAt` | Date | [VERIFICAR] | — | — |
| `manualTaskRef` | string | No | — | — |
| `compensatesCommandId` | ObjectId | No | — | → M10 `provisioningCommands` (comando que compensa) (PA-TEC-23; antes "`provisioningCommands` (M10); antes implícita por el nombre") |

#### 7.22.49 `providedMailboxes` (COL-TEC-69)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `userId` | ObjectId | [VERIFICAR] | `USER_ID` | `memberships` (T02) |
| `domain` | [VERIFICAR] | [VERIFICAR] | `DOMINIO` | — |
| `credentialRef` | string | [VERIFICAR] | no se migra `USER_PASS` | `integrationSecrets` (T06) |
| `others` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `active`, `suspended`, `deleted` (§8.16; PA-TEC-23); antes "—" | — |
| `registeredAt` | Date | [VERIFICAR] | `FEC_REG` | — |
| `registeredBy` | ObjectId | [VERIFICAR] | `USU_REG` | — |
| `address` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.50 `works` (COL-TEC-46)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_OBR` | — |
| `serviceId` | ObjectId | [VERIFICAR] | `COD_SER` | `tenantServices` (M02) |
| `type` | [VERIFICAR] | [VERIFICAR] | `COD_TIP` | — |
| `groupId` | ObjectId | [VERIFICAR] | `COD_GRP` | `workGroups` (M10); antes implícita por el nombre |
| `startAt` | Date | [VERIFICAR] | `FEC_INI` | — |
| `endAt` | Date | [VERIFICAR] | `FEC_FIN` | — |
| `hidden` | bool | [VERIFICAR] | `OCULTAR` | — |
| `budget` | object | [VERIFICAR] | `{ total: Decimal128, lines[] }` | — |
| `progress` | object | [VERIFICAR] | `{ percent, milestones[{ name, plannedAt, doneAt }] }` | — |
| `costCenterId` | ObjectId | [VERIFICAR] | — | `costCenters` (M15) |
| `approvalBasis` | object | [VERIFICAR] | `{ kind: ordinance\|agreement\|assembly, reference, documentId, approvedAt }` | — |
| `levy` | object | [VERIFICAR] | `{ enabled, criterion: frontMeters\|surface\|equalShares\|units\|custom, amountToDistribute: Decimal128, rounding, installments, financingPlanRef, status }`;… | — |
| `status` | enum | Sí | Valores: `draft`, `budgeted`, `approved`, `inProgress`, `finished`, `levyProposed`, `levyApproved`, `billing`, `closed`, `cancelled` (§8.16; PA-TEC-23); antes "§8.11" | — |

#### 7.22.51 `workGroups` (COL-TEC-47)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_GRP` | — |
| `debitAccountId` | ObjectId | [VERIFICAR] | — | → M15 `ledgerAccounts` (T05 §7.2) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `creditAccountId` | ObjectId | [VERIFICAR] | `COD_CTA`, `COD_CTH` | → M15 `ledgerAccounts` (T05 §7.2) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `workId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `works` (M10); antes implícita por el nombre |

#### 7.22.52 `workBeneficiaries` (COL-TEC-48)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `workId` | ObjectId | [VERIFICAR] | — | `works` (M10); antes implícita por el nombre |
| `premiseId` | ObjectId | [VERIFICAR] | M01 | `premises` (M01) |
| `accountId` | ObjectId | [VERIFICAR] | — | `accounts` (M01) |
| `holderId` | ObjectId | [VERIFICAR] | — | `holders` (M01) |
| `frontMeters` | Decimal128 | [VERIFICAR] | — | — |
| `surfaceM2` | [VERIFICAR] | [VERIFICAR] | — | — |
| `units` | [VERIFICAR] | [VERIFICAR] | — | — |
| `share` | Decimal128 | [VERIFICAR] | Decimal128 calculado | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `exempt` | bool | [VERIFICAR] | bool + motivo | — |
| `billingRef` | string | [VERIFICAR] | contrato tipo 17 que crea M02 al consumir EVT-TEC-25, clave obra + inmueble; TEC lo consulta para el seguimiento de cobro, HUECO-OBR-01 | — |

#### 7.22.53 `inspectionCases` (COL-TEC-49)

Lista original: §7.19.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `origin` | enum | [VERIFICAR] | `consumptionAlert\|complaint\|meterReader\|controlPlan\|other` | — |
| `alertRef` | string | [VERIFICAR] | M03 | — |
| `status` | enum | Sí | Valores: `suspected`, `inspectionOrdered`, `inspected`, `noIrregularity`, `irregularityConfirmed`, `userNotified`, `defenseReceived`, `defenseExpired`, `recoveryProposed`, `recoveryApproved`, `recoveryRejected`, `billed`, `regularized`, `closed`, `annulled` (§8.16; PA-TEC-23); antes "§8.12" | — |
| `workOrderIds` | array | [VERIFICAR] | — | `workOrders` (M10); antes implícita por el nombre |
| `act` | object | [VERIFICAR] | `{ formResponseId, findings[], irregularityType, witnesses[{name, document}], signedByUser: bool, refusalNote, evidenceIds[], actHash, actAt }` | — |
| `sealIds` | array | [VERIFICAR] | — | `seals` (M10); antes implícita por el nombre |
| `notification` | object | [VERIFICAR] | `{ sentAt, channel, deliveryRef, defenseDeadline }` | — |
| `defense` | object | [VERIFICAR] | `{ receivedAt, text, documentIds[] }` | — |
| `recoveryProposal` | object | [VERIFICAR] | `{ methodVersionRef (M04), periodFrom, periodTo, estimatedConsumption, amount: Decimal128, computedAt }` | — |
| `approval` | object | [VERIFICAR] | `{ approvedBy, approvedAt, resolutionDocId }` | — |
| `billingRef` | string | [VERIFICAR] | M05 | — |
| `closedAt` | Date | [VERIFICAR] | — | — |
| `outcome` | [VERIFICAR] | [VERIFICAR] | — | — |
| `meteringPointId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `meteringPoints` (M03) |

#### 7.22.54 `seals` (COL-TEC-50)

Lista original: §7.19.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | único | — |
| `batch` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `available`, `assigned`, `placed`, `removed`, `broken`, `voided` (§8.16; PA-TEC-23); antes "`available\|assigned\|placed\|removed\|broken\|voided`" | — |
| `assignedTo` | [VERIFICAR] | [VERIFICAR] | inspector | — |
| `placement` | object | [VERIFICAR] | `{ meterId, contractId, at, workOrderId, evidenceId }` | — |
| `removal` | object | [VERIFICAR] | `{ at, reason, workOrderId }` | — |

#### 7.22.55 `phoneExchanges` (COL-TEC-51)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_CEN`/`NOM_CEN` | — |
| `cdrModality` | [VERIFICAR] | [VERIFICAR] | `MODALIDAD`, enum de ≈35 formatos | — |
| `importSeconds` | int | [VERIFICAR] | `IMP_SEGUNDOS` | — |
| `importKey` | string | [VERIFICAR] | `IMP_CLAVE` | — |
| `lastDisk` | [VERIFICAR] | [VERIFICAR] | `ULTIMO_DISCO`/`ULT_DSK` | — |
| `geo` | [VERIFICAR] | [VERIFICAR] | `GPS_LATITUD/LONGITUD` | — |
| `prefixId` | ObjectId | [VERIFICAR] | `COD_PRE` | `phonePrefixes` (M10); antes implícita por el nombre |
| `currency` | [VERIFICAR] | [VERIFICAR] | `COD_MON` | — |
| `externalId` | ObjectId | [VERIFICAR] | `ID_TEL` | — (identificador del sistema externo; no es referencia interna) |
| `networkDeviceId` | ObjectId | [VERIFICAR] | — | `networkDevices` (M10); antes implícita por el nombre |
| `onlineSource` | [VERIFICAR] | No | Gretix, Tecnored Sunsip, AION, Central Online | — |
| `readerOptions` | object | [VERIFICAR] | (`{ excludedNumbers[] (V2 #2444), zeroAmountForKey99 (V2 #2346) }`). Unifica `TEL_CENTRAL` y `CENTRALT` | — |

#### 7.22.56 `phonePorts` (COL-TEC-58)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ownerType` | enum | [VERIFICAR] | `exchange\|dslam` | — |
| `ownerId` | ObjectId | [VERIFICAR] | — | Polimórfica según `ownerType`: → M10 `phoneExchanges` · `dslams` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | /`name` (`NUMERO`, `DES_PTO_DSLAM`) | — |
| `linkedDslamPortId` | ObjectId | [VERIFICAR] | `COD_PTO_DSLAM` | → M10 `phonePorts` (puerto del DSLAM vinculado) (PA-TEC-23; antes "`phonePorts` (M10); antes implícita por el nombre") |
| `outgoingConnected` | [VERIFICAR] | [VERIFICAR] | `CON_SAL` | — |
| `incomingConnected` | [VERIFICAR] | [VERIFICAR] | `CON_ENT` | — |
| `status` | enum | Sí | Valores: `available`, `unavailable`, `inactive` (§8.16; PA-TEC-23); antes "`available\|unavailable\|inactive`; `INACTIVO`" | — |
| `dslamId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `dslams` (M10); antes implícita por el nombre |
| `port` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.57 `phoneFrames` (COL-TEC-52)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_REP` | — |
| `exchangeId` | ObjectId | [VERIFICAR] | `COD_CEN` | `phoneExchanges` (M10); antes implícita por el nombre |
| `geo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.58 `phoneFrameGroups` (COL-TEC-53)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `frameId` | ObjectId | [VERIFICAR] | — | `phoneFrames` (M10); antes implícita por el nombre |
| `name` | string | [VERIFICAR] | `DES_GRU` | — |
| `direction` | [VERIFICAR] | [VERIFICAR] | `TIPO`: entrada/salida | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.59 `phoneStrips` (COL-TEC-54)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ownerType` | enum | [VERIFICAR] | `frameGroup\|box` | — |
| `ownerId` | ObjectId | [VERIFICAR] | — | Polimórfica según `ownerType`: → M10 `phoneFrameGroups` · `phoneBoxes` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `name` | string | [VERIFICAR] | `DES_REG` | — |
| `frameGroupId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `phoneFrameGroups` (M10); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.60 `phoneStripPositions` (COL-TEC-55)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `stripId` | ObjectId | [VERIFICAR] | — | `phoneStrips` (M10); antes implícita por el nombre |
| `ownerType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_POS` | — |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `terminal` | [VERIFICAR] | [VERIFICAR] | `TER` | — |
| `trm` | [VERIFICAR] | [VERIFICAR] | `TRM` | — |
| `color` | [VERIFICAR] | [VERIFICAR] | — | — |
| `previousPositionId` | ObjectId | [VERIFICAR] | `COD_POS_ANT` | → M10 `phoneStripPositions` (posición anterior) (PA-TEC-23; antes "`phoneStripPositions` (M10); antes implícita por el nombre") |
| `dslamPortId` | ObjectId | [VERIFICAR] | — | `phonePorts` (M10); antes implícita por el nombre |
| `exchangePortId` | ObjectId | [VERIFICAR] | — | `phonePorts` (M10); antes implícita por el nombre |
| `groupPositionId` | ObjectId | [VERIFICAR] | `COD_POS_REG_GRU` | → M10 `phoneStripPositions` (posición del grupo) (PA-TEC-23; antes "`phoneStripPositions` (M10); antes implícita por el nombre") |
| `outgoingConnected` | [VERIFICAR] | [VERIFICAR] | — | — |
| `incomingConnected` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `available`, `reserved`, `connected`, `damaged` (§8.16; PA-TEC-23); antes "—" | — |
| `contractId` | ObjectId | No | servicio conectado | → M02 `serviceContracts` (servicio conectado) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `position` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.61 `phoneBoxes` (COL-TEC-56)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_CAJA` | — |
| `frameId` | ObjectId | [VERIFICAR] | `COD_REP` | `phoneFrames` (M10); antes implícita por el nombre |
| `address` | [VERIFICAR] | [VERIFICAR] | — | — |
| `geo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `networkElementId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `networkElements` (M10); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.62 `dslams` (COL-TEC-57)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_DESLAM` | — |
| `brand` | [VERIFICAR] | [VERIFICAR] | — | — |
| `model` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serial` | [VERIFICAR] | [VERIFICAR] | — | — |
| `observations` | string | [VERIFICAR] | — | — |
| `networkDeviceId` | ObjectId | [VERIFICAR] | — | `networkDevices` (M10); antes implícita por el nombre |
| `exchangeId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `phoneExchanges` (M10); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.63 `phonePrefixes` (COL-TEC-59)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | `DES_PRE` | — |

#### 7.22.64 `phoneNumbers` (COL-TEC-60)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `prefixId` | ObjectId | [VERIFICAR] | — | `phonePrefixes` (M10); antes implícita por el nombre |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `available`, `reserved`, `assigned`, `quarantine`, `retired` (§8.16; PA-TEC-23); antes "`available\|reserved\|assigned\|quarantine\|retired`; `ESTADO`" | — |
| `createdOn` | [VERIFICAR] | [VERIFICAR] | `FEC_ALTA` | — |
| `reservedByWorkOrderId` | ObjectId | No | — | `workOrders` (M10); antes implícita por el nombre |

#### 7.22.65 `phoneLines` (COL-TEC-61)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | ObjectId | [VERIFICAR] | `ID_SERSOC` | `serviceContracts` (M02) |
| `phoneNumberId` | ObjectId | No | `COD_NUM` | `phoneNumbers` (M10); antes implícita por el nombre |
| `tariffPlanId` | ObjectId | [VERIFICAR] | M04, `COD_TAR` | `servicePlans` (M02) |
| `validFrom` | Date | [VERIFICAR] | `FEC_ALTA` | — |
| `validTo` | Date | [VERIFICAR] | `FEC_BAJA` | — |
| `observation` | [VERIFICAR] | [VERIFICAR] | — | — |
| `workOrderId` | ObjectId | No | — | `workOrders` (M10); antes implícita por el nombre |
| `active` | bool | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.66 `numberingPlan` (COL-TEC-62)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fullNumber` | int / string [VERIFICAR] | [VERIFICAR] | `NUMERO` | — |
| `description` | string | [VERIFICAR] | `DES_CAR` | — |
| `provinceId` | ObjectId | [VERIFICAR] | `COD_PRV` | `provinces` (T04); antes implícita por el nombre |
| `locality` | [VERIFICAR] | [VERIFICAR] | — | — |
| `indicative` | [VERIFICAR] | [VERIFICAR] | — | — |
| `block` | [VERIFICAR] | [VERIFICAR] | — | — |
| `operatorId` | ObjectId | [VERIFICAR] | `COD_OPE` | `memberships` (T02) |
| `serviceTypeId` | ObjectId | [VERIFICAR] | `COD_SERV` | `telecomServiceTypes` (M10); antes implícita por el nombre |
| `modalityId` | ObjectId | [VERIFICAR] | `COD_MOD` | `telecomModalities` (M10); antes implícita por el nombre |
| `tariffKey` | string | [VERIFICAR] | `CLAVE`, M04 | — |
| `isLocal` | bool | [VERIFICAR] | `LOCAL` | — |
| `source` | object | [VERIFICAR] | `{ file, importedAt }` | — |
| `destinationKey` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.67 `telecomOperators` (COL-TEC-63)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_OPE` | — |
| `accountId` | ObjectId | No | `COD_SUM`, para liquidar CPP | `accounts` (M01) |
| `generic` | bool | [VERIFICAR] | `GENERICO` | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.68 `telecomServiceTypes` (COL-TEC-64)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_SERV`) / `name` (`DES_MOD` | — |
| `isMobile` | bool | [VERIFICAR] | `MOVIL` | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.69 `telecomModalities` (COL-TEC-65)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_SERV`) / `name` (`DES_MOD` | — |
| `isMobile` | bool | [VERIFICAR] | `MOVIL` | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.70 `cdrImports` (COL-TEC-66)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `exchangeId` | ObjectId | No | — | `phoneExchanges` (M10); antes implícita por el nombre |
| `operatorId` | ObjectId | No | — | `memberships` (T02) |
| `kind` | enum | [VERIFICAR] | `outgoing\|incoming\|international\|cpp\|rejected\|mobileInvoice` | — |
| `fileName` | string | [VERIFICAR] | — | — |
| `fileHash` | [VERIFICAR] | [VERIFICAR] | — | — |
| `lot` | [VERIFICAR] | [VERIFICAR] | `LOTE` | — |
| `status` | enum | Sí | Valores: `uploaded`, `parsing`, `parsed`, `withErrors`, `attributed`, `sentToRating`, `rated`, `grouped`, `rolledBack` (§8.16; PA-TEC-23); antes "§8.14" | — |
| `rows` | object | [VERIFICAR] | `{ total, imported, duplicates, errors, unattributed }` | — |
| `ratingRequestedAt` | Date | [VERIFICAR] | — | — |
| `rolledBackAt` | Date | [VERIFICAR] | . Índice único `{tenantId, fileHash}` | — |

#### 7.22.71 `callRecords` (COL-TEC-67)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cdrImportId` | ObjectId | [VERIFICAR] | — | `cdrImports` (M10); antes implícita por el nombre |
| `direction` | enum | [VERIFICAR] | `outgoing\|incoming` | — |
| `kind` | enum | [VERIFICAR] | `regular\|international\|cpp\|rejected` | — |
| `origin` | [VERIFICAR] | [VERIFICAR] | `NRO_ORI`/`ORIGEN` | — |
| `destination` | [VERIFICAR] | [VERIFICAR] | `NRO_DES`/`DESTINO` | — |
| `destinationDescription` | [VERIFICAR] | [VERIFICAR] | `DES_DES` | — |
| `startedAt` | Date | [VERIFICAR] | `FECHA`/`FEC_LLA` | — |
| `seconds` | [VERIFICAR] | [VERIFICAR] | `SEGUNDOS`/`SEC_LLA` | — |
| `roundedSeconds` | int | [VERIFICAR] | `SEC_CPP` | — |
| `trunk` | [VERIFICAR] | [VERIFICAR] | `TRONCAL` | — |
| `ncnt` | [VERIFICAR] | [VERIFICAR] | /`ndisk` (`NCNT`, `NDISK`) | — |
| `sourceKey` | string | [VERIFICAR] | `IMP_CLAVE` | — |
| `sourceAmount` | Decimal128 | [VERIFICAR] | Decimal128; `IMP_CPP` o importe del CDR | — |
| `operatorId` | ObjectId | [VERIFICAR] | `COD_OPE` | `telecomOperators` (M10); antes implícita por el nombre |
| `operatorLot` | [VERIFICAR] | [VERIFICAR] | `LOT_OPE` | — |
| `attributedLineId` | ObjectId | [VERIFICAR] | `COD_TSE` | `phoneLines` (M10); antes implícita por el nombre |
| `attributedContractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `attributionStatus` | enum | Sí | Valores: `attributed`, `originNotFound`, `destinationNotFound`, `duplicate`, `manual` (§8.16; PA-TEC-23); antes "`attributed\|originNotFound\|duplicate\|manual\|destinationNotFound`" | — |
| `dedupeKey` | Date | [VERIFICAR] | origen+destino+fecha+segundos | — |
| `ratingRef` | string | [VERIFICAR] | tasación de M04 con `phoneRates`/`phoneRatePlans`; M04 no tiene `callRatings`, CTR-DAT-70 | — |
| `grouped` | bool | [VERIFICAR] | bool; `GRUPO≠0` | — |
| `rejected` | object | [VERIFICAR] | `{ publicNumber, subscriber, calledNo, calledYa, amount, cppDuration, realDuration, previousCall, previousCallNo, at }` ← `RECHAZOS` | — |

#### 7.22.72 `mobileUsageImports` (COL-TEC-68)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | [VERIFICAR] | [VERIFICAR] | `mobileResale` por defecto: consumos de telefonía móvil revendida; `ticQuota`: consumo de correo o pack SMS con cupo, DEC-084, RF-TEC-195 | — |
| `provider` | enum | [VERIFICAR] | `claro\|personal` en `mobileResale`; código del proveedor de la conexión de T06 en `ticQuota` | — |
| `period` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fileName` | string | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `received`, `parsed`, `withErrors`, `attributed`, `applied`, `rolledBack` (§8.16; PA-TEC-23). Antes la celda tenía, fuera de lugar, el texto de los campos de `kind = ticQuota` (`connectionId`, `sourceMessageId`, `importedBy`), que siguen descritos en §7.20. | — |
| `serviceId` | ObjectId | [VERIFICAR] | — | → M02 `tenantServices` (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `unit` | enum | [VERIFICAR] | `sms\|mailbox\|gb` | — |
| `quantity` | Decimal128 | [VERIFICAR] | Decimal128 ≥ 0 | — |
| `measuredFrom` | [VERIFICAR] | [VERIFICAR] | — | — |
| `measuredTo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `attributionStatus` | enum | [VERIFICAR] | `attributed\|unattributed\|rejected` | — |
| `revision` | int | [VERIFICAR] | Int; una corrección reemplaza la anterior mientras el período no esté facturado, `fac.service.isPeriodBilled` | — |
| `reportedAt` | Date | [VERIFICAR] | — | — |
| `contractId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `serviceContracts` (M02) |
| `operatorId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `memberships` (T02) |
| `fileHash` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.22.73 `numberPortings` (COL-TEC-73)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `direction` | enum | [VERIFICAR] | `incoming\|outgoing` | — |
| `phoneNumberId` | ObjectId | No | — | `phoneNumbers` (M10); antes implícita por el nombre |
| `fullNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `contractId` | ObjectId | [VERIFICAR] | — | `serviceContracts` (M02) |
| `counterpartOperatorId` | ObjectId | [VERIFICAR] | donante o receptor | `telecomOperators` (M10); antes implícita por el nombre |
| `requestedAt` | Date | [VERIFICAR] | — | — |
| `scheduledWindow` | object | [VERIFICAR] | `{ from, to }` | — |
| `executedAt` | Date | No | — | — |
| `status` | enum | Sí | Valores: `requested`, `submitted`, `accepted`, `rejected`, `scheduled`, `executed`, `cancelled`, `received`, `validated` (§8.16; PA-TEC-23); antes "entrante `requested\|submitted\|accepted\|rejected\|scheduled\|executed\|cancelled`; saliente `received\|validated\|accepted\|rejected\|executed`" | — |
| `rejectionReason` | string | No | — | — |
| `documentIds` | array | [VERIFICAR] | constancias, T11 | `documents` (T11) |
| `workOrderId` | ObjectId | No | . Índice único `{tenantId, portId}` | `workOrders` (M10) |
| `portId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `phonePorts` (M10); antes implícita por el nombre |

#### 7.22.74 `waterSamplingPoints` (COL-TEC-74)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `networkElementId` | ObjectId | No | — | `networkElements` (M10); antes implícita por el nombre |
| `geometry` | GeoJSON | [VERIFICAR] | punto GeoJSON | — |
| `pointKind` | enum | [VERIFICAR] | `well\|tank\|plant\|network\|serviceConnection` | — |
| `concessionRef` | string | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.22.75 `waterSamples` (COL-TEC-75)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `samplingPointId` | ObjectId | [VERIFICAR] | — | `waterSamplingPoints` (M10); antes implícita por el nombre |
| `workOrderId` | ObjectId | [VERIFICAR] | — | `workOrders` (M10) |
| `takenAt` | Date | [VERIFICAR] | — | — |
| `takenBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `laboratory` | object | [VERIFICAR] | `{ name, registration, external: bool }` | — |
| `labReportDocumentId` | ObjectId | [VERIFICAR] | T11, con hash | `documents` (T11) |
| `outOfLimit` | bool | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `taken`, `inLab`, `resulted`, `actionPending`, `closed` (§8.16; PA-TEC-23); antes "`taken\|inLab\|resulted\|actionPending\|closed`" | — |
| `supersedesSampleResultId` | ObjectId | No | — | → M10 `waterSamples` (muestra reemplazada) (PA-TEC-23; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

### 7.23 Residuales del 5-11-2026: referencias, nombres de T05 y valores de estado (PA-TEC-23)

Ronda de residuales detectados al regenerar los entregables (categorías 1 y 2 de `_trabajo/residuales-instrucciones.md`). Las filas de §7.1 a §7.12 y de §7.22 quedaron corregidas en su lugar con "antes"; las de estado de §7.22 reemplazan la lista separada por barras (que los entregables no leían como valores) por valores explícitos. Resumen de referencias:

| Colección | Campo | Tipo | Referencia | Antes |
|---|---|---|---|---|
| `feasibilityRequests` | `prospect` / `cancelReason` | object / string | No es referencia | sin destino |
| `feasibilityRequests` | `quoteRef` | object | → M11 `salesQuotes` (`quoteRef.id`) | sin destino |
| `workOrderOperationTypes` | `resultingServiceStatusId` | ObjectId | → M02 `serviceStatuses` | "estado de servicio" |
| `workOrderOperationTypes` | `defaultResolutionIds` / `requiredTaskIds` | ObjectId[] | → M10 `resolutionCodes` / `taskCatalog` | sin destino |
| `chainedOrderRules` | `sourceOperationTypeId` | ObjectId | → M10 `workOrderOperationTypes` | sin destino |
| `chainedOrderRules` | `targetIntakeChannelId` | ObjectId | → M09 `crmChannels` | sin destino |
| `fieldEvidence` | `entityType` / `entityId` | enum / ObjectId | Discriminador / polimórfica | sin destino |
| `serviceConformities` | `signatureRequestId` | ObjectId | → T11 `signatureRequests` | solo en T05 |
| `visits` | `assignedResourceIds` | ObjectId[] | → M10 `fieldResources` | sin destino |
| `crews` | `leaderId` | ObjectId | → M10 `fieldResources` | sin destino |
| `fieldDevices` | `deviceId` | UUID | No es referencia | `networkDevices` (erróneo) |
| `networkComponentRelations` | `parentTypeId` / `childTypeId` | ObjectId | → M10 `networkComponentTypes` | sin destino |
| `provisioningSystems` | `serviceIds` | ObjectId[] | → M02 `tenantServices` | sin destino |
| `provisioningSystems` | `connectorId` (T05: `connectionId`) | ObjectId | → T06 `integrationConnections` | sin destino / `serviceNetworkConnections` |
| `provisioningProfiles` | `casPackageIds` | string[] | No es referencia (códigos del CAS externo) | sin destino |
| `provisioningCommands` | `compensatesCommandId` | ObjectId | → M10 `provisioningCommands` | implícita |
| `phonePorts` | `ownerId` / `linkedDslamPortId` | ObjectId | Polimórfica (`phoneExchanges` · `dslams`) / → M10 `phonePorts` | sin destino / implícita |
| `phoneStrips` | `ownerId` | ObjectId | Polimórfica (`phoneFrameGroups` · `phoneBoxes`) | sin destino |
| `phoneStripPositions` | `previousPositionId` / `groupPositionId` / `contractId` | ObjectId | → M10 `phoneStripPositions` / → M02 `serviceContracts` | implícita / sin destino |

Campos que T05 cita con otro nombre (prevalece el anexo; T05 debe reflejarlo): `workOrders.crewId` = `assignment.crewId`; `visits.crewId` = `assignedCrewId`; `resourceCalendars.crewId` = `resourceId` con `resourceType` = `crew`, y `calendarId` no existe (las excepciones se cargan en `exceptions[]`), por lo que T05 debe quitarlo; `visitBookings.workOrderId` = `targetRef.workOrderId`; `fieldEvidence.entityRef` = `entityType` + `entityId`; `fieldDevices.membershipId` = `userId`; `provisioningSystems.connectionId` = `connectorId`.

## 8. Estados y transiciones

Regla general (AGR-003): toda transición tiene actor, precondición, efectos y reversión; no existe edición libre de estados. El estado del trámite (OT, visita) es distinto del estado real del contrato, del equipo y del pago.

### 8.1 Factibilidad (`feasibilityRequests.status`)

Estado inicial: `draft`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `draft` | Operador, socio (portal), CRM | — | Número reservado | Descartar borrador |
| `draft` → `pending` | Operador | Datos mínimos (servicio, persona, domicilio) | Evento `tec.feasibility.requested`; aviso al socio | — |
| `pending` → `inEvaluation` | Supervisor/evaluador | — | Propuesta de recurso (RF-TEC-007); opcional OT de inspección | Volver a `pending` |
| `inEvaluation` → `closed` (verdict) | Supervisor | Motivo, responsable técnico, estado técnico | `tec.feasibility.verdictIssued`; `validUntil` si factible | Reabrir con permiso (PRM-TEC-064) creando versión |
| `pending`/`inEvaluation`/`closed` → `cancelled` | Supervisor | Motivo; no usada | `tec.feasibility.cancelled`; nunca usable | No reversible (nueva factibilidad) |
| `closed (feasible)` → `used` | Sistema (alta de contrato) | Vigente, no usada | Vincula contrato | Si el contrato se anula antes de instalar, vuelve a `closed` |
| `closed (feasible)` → `expired` | Job | `validUntil` < hoy | — | Renovar con nueva evaluación |

Estado de presupuesto (`estimate.status`) en paralelo: `draft → submitted → accepted|rejected|expired` (equivale a "Facturado" de ProCoop cuando se acepta y factura).

### 8.2 Reserva de cupo (`visitBookings.status`)

Estado inicial: `held`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `held` | Socio/operador | Capacidad disponible (contador atómico) | Reduce capacidad; `holdExpiresAt` | — |
| `held` → `confirmed` | Socio/operador | No expirada | Crea `visit` `confirmed`; constancia al socio | Cancelar |
| `held` → `expired` | Job `tec:liberar-reservas` | `holdExpiresAt` vencido | Libera capacidad | — |
| `held` → `released` | Socio/operador | — | Libera capacidad | — |
| `confirmed` → `cancelled` | Socio (con anticipación) / operador | Reglas PRM-TEC-136 | Libera capacidad; visita `cancelled` | — |

### 8.3 Visita (`visits.status`)

Estado inicial: `confirmed`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `confirmed` | Sistema | Reserva confirmada | Aviso + recordatorio | — |
| `confirmed` → `assigned` | Despachante/supervisor | Recurso con capacidad | OT `assigned`; publica en "Mi día" | Reasignar |
| `assigned` → `enRoute` | Técnico | — | Aviso "En camino" al socio (sin GPS) | Volver a `assigned` (error del técnico) |
| `enRoute` → `onSite` | Técnico | — | Marca llegada | — |
| `onSite` → `completed` | Técnico | Trabajo de la visita registrado | OT → `executed` si era la última visita necesaria | Solo vía conflicto/supervisor |
| `assigned`/`enRoute`/`onSite` → `failed` | Técnico | Motivo y evidencia | No activa; equipo sin aplicar; propuesta de nueva visita; cargo solo si regla (PA-TEC-06) | — |
| `confirmed`/`assigned` → `rescheduled` | Socio/operador | Nueva reserva confirmada | Libera cupo anterior; enlaza nueva visita | — |
| cualquiera no final → `cancelled` | Operador/socio | Motivo | Libera cupo; no cancela la contratación | — |

### 8.4 OT (`workOrders.status`)

Estado inicial: `pending`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `pending` | Admin, CRM, mora, campo, regla, plan | Validaciones RF-TEC-027/028 | Número; nota en cuenta; órdenes encadenadas; cargos "antes" propuestos; notificaciones (RN-TEC-050/051); `tec.workOrder.created` | Anular |
| `pending` → `scheduled` | Despachante/socio | Visita confirmada | — | Cancelar visita → `pending` |
| `pending`/`scheduled` → `assigned` | Despachante | Recurso/cuadrilla | — | Desasignar |
| `assigned` → `dispatched` | Sistema / impresión (RN-TEC-011) / envío automático (PRM-TEC-079) | — | `dispatch.state=sent`; bloqueo campo | Recuperar (desbloquear con capability) |
| `dispatched` → `inProgress` | Técnico (llegada/inicio) | — | — | — |
| `inProgress` → `onHold` | Técnico/supervisor | Motivo (falta material, permiso, acceso) | Subestado | `onHold` → `inProgress`/`scheduled` |
| `inProgress` → `executed` | Técnico (campo) o administrativo | Requisitos de cierre de campo | Evidencia, materiales usados, conformidad; si `twoStepClose=false` pasa directo a `closing` | Supervisor puede devolver a `inProgress` con motivo |
| `executed` → `closing` | Supervisor (confirmar) / automático | Requisitos de confirmación (RF-TEC-036); sin conflicto abierto | Aplica efectos (RF-TEC-038) con outbox, paso a paso | — |
| `closing` → `closed` | Sistema | Todos los pasos `done` | `tec.workOrder.closed`; cargos "luego"; numeración visible si corresponde | Reabrir (RF-TEC-045) con compensación |
| `closing` → `closing` (paso fallido) | Sistema | Error en un efecto | Registra `pendingSteps`; reintento; bandeja operativa (AGR-016) | Reparación |
| `pending`…`executed` → `cancelled` | Supervisor | Motivo; si hay evidencia de ejecución en campo, se exige resolver conflicto | Reversión por compensación (RN-TEC-036); materiales devueltos | Restablecer → `pending` |
| `closed` → `pending` (reabrir) | Supervisor con capability | Motivo | Compensa efectos; historial | — |

### 8.5 Instalación (`workOrders.installation.stage`)

Estado inicial: `pendingAppointment`.

`pendingAppointment → appointed` (visita confirmada) `→ equipmentReserved` (M13 reserva) `→ equipmentInCustody` (entrega al instalador) `→ enRoute → onSite → installing → testing → (testFailed → installing | failedVisit) → awaitingConformity → (conformityRefused → decisión supervisor: reintentar, cerrar como fallida, activar con disconformidad registrada) → executed → awaitingProvisioning` (si `triggersProvisioning`) `→ awaitingReview` (si revisión supervisora) `→ activationConfirmed`.
`failedVisit`: equipo permanece en custodia o se devuelve; nueva cita → `appointed`. Reversión de `activationConfirmed`: solo por OT de desactivación/retiro o anulación con compensación coordinada con el contrato (no edición).

### 8.6 Material (`workOrderMaterials.status`)

Estado inicial: `requested`.

`requested → authorized` (supervisor; cantidad autorizada ≤ solicitada) `→ reserved` (M13) `→ withdrawn` (vale/entrega a custodia) `→ used` (aplicación en sitio; descuenta de custodia) `→ returned` (devolución parcial/total del no usado). `requested|authorized|reserved → cancelled` libera reserva. `used` solo se corrige por ajuste compensatorio (RF-TEC-069).

### 8.7 Mutación de sincronización (`syncMutations.result`)

Estado inicial: `received`.

`received → applied` | `duplicate` (mismo `clientMutationId`, devuelve resultado original) | `conflict` (versión base desactualizada con impacto; crea `syncConflicts`) | `rejected` (permiso, validación dura) | `deferred` (dependencia aún no recibida en el lote; se reintenta en el mismo lote).

### 8.8 Conflicto (`syncConflicts.status`)

Estado inicial: `open`.

`open → inReview` (asignado al supervisor) `→ resolved` con resolución `acceptField` (aplicar efectos de campo), `acceptServer` (conservar evidencia, no aplicar efectos; si hubo instalación real se genera OT de regularización), `merge`, `compensate` (revertir movimientos de stock ya aplicados), `newWorkOrder`; o `dismissed` (sin impacto). Vencido `dueAt` escala (RN-TEC-068). Nunca se borra la evidencia (ESC-03).

### 8.9 Comando de aprovisionamiento (`provisioningCommands.status`)

Estado inicial: `queued`.

| Origen → Destino | Actor | Efectos |
|---|---|---|
| — → `queued` | TEC (desde OT, M08, M09) | Outbox |
| `queued` → `sending` | Worker | Llamada al conector T06 |
| `sending` → `confirmed` | Worker | Respuesta OK verificada (o consulta posterior); `tec.provisioning.confirmed` |
| `sending` → `retrying` | Worker | Error transitorio; `nextAttemptAt` con backoff (PRM-TEC-142) |
| `retrying` → `sending` | Worker | — |
| `sending\|retrying` → `failed` | Worker | Agotados reintentos o error definitivo; `tec.provisioning.failed` |
| `failed` → `manualPending` | Sistema | Tarea NOC |
| `manualPending` → `manualDone` | Operador NOC | Evidencia de ejecución manual; equivale a confirmado |
| `queued\|retrying` → `cancelled` | Sistema/NOC | Orden origen revocada (p. ej., pagó antes del corte) |
| `confirmed` → `compensated` | Sistema | Comando inverso confirmado (rollback) |
| `sending` (resultado incierto) → `unknown` → `confirmed\|failed` | Worker con `query` | No se reenvía sin conciliar (ESC-04) |

### 8.10 Interrupción planificada (`outagePlans.status`)

Estado inicial: `draft`.

`draft → approved` (responsable) `→ notified` (aviso masivo con constancia) `→ inProgress` (inicio real) `→ completed` (fin real, informe); `draft|approved|notified → cancelled` (aviso de cancelación si ya notificada).

### 8.11 Obra (`works.status`)

Estado inicial: `draft`.

`draft → budgeted → approved` (base de aprobación cargada) `→ inProgress → finished`; con contribución: `finished|inProgress → levyProposed → levyApproved → billing` (M05/M08) `→ closed`; `draft|budgeted → cancelled`.

### 8.12 Caso de inspección (`inspectionCases.status`)

Estado inicial: `suspected`.

`suspected → inspectionOrdered` (OT) `→ inspected → (noIrregularity → closed) | irregularityConfirmed → userNotified → (defenseReceived | defenseExpired) → recoveryProposed → (recoveryApproved → billed → regularized → closed) | recoveryRejected → closed`; cualquier estado → `annulled` con motivo y aprobación.

### 8.13 Elemento de red y conexión

Estado inicial: elemento `planned`; conexión servicio-red `connected`.

Elemento: `planned → available ↔ used` (por conexiones) `→ damaged → available` (reparación) `→ retired` (sin conexiones vigentes ni hijos activos). Conexión servicio-red: `connected → disconnected` (fecha de desconexión); reconexión crea nueva conexión (historial).

### 8.14 Número, línea e importación de CDR

Estado inicial: número `available`; línea `active`; importación `uploaded`.

Número: `available → reserved` (OT) `→ assigned` (línea) `→ quarantine` (tras baja, plazo configurable) `→ available`; `available → retired`. Línea: `active → closed`. Importación: `uploaded → parsing → parsed | withErrors` (archivo abortado con fila) `→ attributed → sentToRating → rated → grouped` (por M05) ; `parsed|attributed|rated → rolledBack` solo si ninguna llamada agrupada.

### 8.15 Expediente técnico (`technicalProcedures.status`)

Corrección de cierre 05-11-2026 (PA-TEC-22, PA 8 del pendiente de cierre): el §7 declaraba `status` sin valores ni transiciones. Estado inicial: `open`. Las etapas (`stages[]`) se agregan sin borrar las anteriores; la resolución de cada etapa define la transición.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Alta del expediente (presentación del profesional certificado o carga interna) | `installerId` vigente en `certifiedInstallers` | — |
| `open`, `observed` | `inReview` | Presentación de una etapa (`stages[].submittedAt`) | — | — |
| `inReview` | `observed` | Resolución de la etapa con observación | Observación obligatoria | — |
| `inReview` | `approved` | Resolución aprobatoria de la última etapa | — | — |
| `inReview` | `rejected` | Resolución de rechazo | Motivo obligatorio | — |
| `open`, `inReview`, `observed` | `cancelled` | Anulación del expediente | Motivo obligatorio; auditoría (AGR-003) | — |

`approved`, `rejected` y `cancelled` son finales; un nuevo trámite abre otro expediente vinculado al mismo `dossierId` de T11.

### 8.16 Máquinas completadas y altas explícitas (residuales del 5-11-2026, PA-TEC-23)

Completa las colecciones que los entregables excluyeron por no tener valores legibles en §7.22 (INC-06-01), las que tenían estados sin transiciones (INC-06-02) y las máquinas que daban el estado inicial solo en texto (INC-06-08). Traslada a tabla, sin cambiar su contenido, las máquinas en texto de §8.6 a §8.8 y §8.10 a §8.14. Las filas `(nuevo)` fijan el estado inicial. Valores asumidos en PA-TEC-23 (DEC-072); coinciden con §7.22. Prevalece esta tabla sobre el texto de las secciones citadas cuando difieran.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `feasibilityRequests` | (nuevo) | `draft` | Operador, socio (portal) o CRM inicia la factibilidad | — | — |
| `workOrders` | (nuevo) | `pending` | Alta por administración, CRM (comando `tec.workOrder.request`), mora, campo, regla o plan | RF-TEC-027/028 | `tec.workOrder.created` |
| `connectionEstimates` | (nuevo) | `draft` | Evaluador arma el cómputo | — | — |
| `connectionEstimates` | `draft` | `submitted` | Envío del presupuesto a M11 | — | — |
| `connectionEstimates` | `submitted` | `accepted` · `rejected` · `expired` | Respuesta o vencimiento del presupuesto de M11 | Refleja el estado del presupuesto | — |
| `workOrderMaterials` | (nuevo) | `requested` | Técnico o supervisor pide material para la OT | — | — |
| `workOrderMaterials` | `requested` | `authorized` | Supervisor autoriza | Cantidad autorizada menor o igual a la solicitada | — |
| `workOrderMaterials` | `authorized` | `reserved` | Reserva en M13 | — | — |
| `workOrderMaterials` | `reserved` | `withdrawn` | Vale o entrega a custodia | — | — |
| `workOrderMaterials` | `withdrawn` | `used` | Aplicación en sitio | Descuenta de custodia | — |
| `workOrderMaterials` | `withdrawn` · `used` | `returned` | Devolución parcial o total del no usado | — | — |
| `workOrderMaterials` | `requested` · `authorized` · `reserved` | `cancelled` | Cancelación | Libera la reserva | — |
| `damageAssessments` | (nuevo) | `open` | Alta del reclamo por daños | — | — |
| `damageAssessments` | `open` | `inReview` | Evaluación técnica o inspección | — | — |
| `damageAssessments` | `inReview` | `approved` | Resolución favorable | Responsable con permiso | — |
| `damageAssessments` | `inReview` | `rejected` | Resolución desfavorable | Motivo obligatorio | — |
| `damageAssessments` | `approved` | `paid` | Registro del pago o crédito al socio | — | — |
| `onCallShifts` | (nuevo) | `planned` | Alta del turno de guardia | — | — |
| `onCallShifts` | `planned` | `active` | Inicio del turno | — | — |
| `onCallShifts` | `planned` · `active` | `closed` | Fin o cancelación del turno | Cambios registrados en `changes[]` | — |
| `fieldForms` | (nuevo) | `draft` | Alta del formulario | — | — |
| `fieldForms` | `draft` | `published` | Publicación | La versión publicada no se edita | — |
| `fieldForms` | `published` | `retired` | Publicación de la versión sucesora o retiro | — | — |
| `fieldDevices` | (nuevo) | `active` | Enrolamiento del dispositivo del técnico | — | — |
| `fieldDevices` | `active` | `revoked` | Revocación por el supervisor | Registra `revokedAt` y `revokedBy`; las mutaciones posteriores se rechazan | — |
| `syncMutations.result` | (nuevo) | `received` | Llega la mutación del lote offline | — | — |
| `syncMutations.result` | `received` | `applied` | Aplicación sin conflicto | — | — |
| `syncMutations.result` | `received` | `duplicate` | Mismo `clientMutationId` | Devuelve el resultado original | — |
| `syncMutations.result` | `received` | `conflict` | Versión base desactualizada con impacto | Crea `syncConflicts` | — |
| `syncMutations.result` | `received` | `rejected` | Permiso o validación dura | — | — |
| `syncMutations.result` | `received` | `deferred` | Dependencia aún no recibida en el lote | — | — |
| `syncMutations.result` | `deferred` | `applied` · `conflict` · `rejected` | Reintento en el mismo lote | — | — |
| `syncConflicts` | (nuevo) | `open` | Mutación en conflicto | — | — |
| `syncConflicts` | `open` | `inReview` | Asignación al supervisor | — | — |
| `syncConflicts` | `inReview` | `resolved` | Resolución (`acceptField`, `acceptServer`, `merge`, `compensate`, `newWorkOrder`) | Nunca se borra la evidencia | — |
| `syncConflicts` | `open` · `inReview` | `dismissed` | Descarte sin impacto | — | — |
| `outagePlans` | (nuevo) | `draft` | Alta de la interrupción planificada | — | — |
| `outagePlans` | `draft` | `approved` | Aprobación del responsable | — | — |
| `outagePlans` | `approved` | `notified` | Aviso masivo con constancia | — | — |
| `outagePlans` | `notified` | `inProgress` | Inicio real | — | — |
| `outagePlans` | `inProgress` | `completed` | Fin real con informe | — | — |
| `outagePlans` | `draft` · `approved` · `notified` | `cancelled` | Cancelación | Aviso de cancelación si ya estaba notificada | — |
| `networkElements` | (nuevo) | `planned` | Alta del elemento proyectado | — | — |
| `networkElements` | (nuevo) | `notApplicable` | Alta de un elemento sin disponibilidad propia (tipo sin conexiones de servicio) | — | — |
| `networkElements` | `planned` | `available` | Habilitación del elemento | — | — |
| `networkElements` | `available` | `used` | Primera conexión vigente | — | — |
| `networkElements` | `used` | `available` | Baja de la última conexión | — | — |
| `networkElements` | `available` · `used` | `damaged` | Registro de daño | — | — |
| `networkElements` | `damaged` | `available` | Reparación | — | — |
| `networkElements` | `available` · `damaged` · `notApplicable` | `retired` | Retiro | Sin conexiones vigentes ni hijos activos | — |
| `serviceNetworkConnections` | (nuevo) | `connected` | Conexión del servicio a la red | — | — |
| `serviceNetworkConnections` | `connected` | `disconnected` | Desconexión con fecha | La reconexión crea una conexión nueva (historial) | — |
| `provisioningSystems` | (nuevo) | `active` | Alta del sistema de aprovisionamiento | — | — |
| `provisioningSystems` | `active` | `disabled` | Deshabilitación | Sin comandos en `queued` o `sending` | — |
| `provisioningSystems` | `disabled` | `active` | Rehabilitación | Prueba del conector exitosa (T06) | — |
| `serviceTechnicalProfiles.provisioningStatus` | (nuevo) | `notProvisioned` | Alta del perfil técnico del servicio | — | — |
| `serviceTechnicalProfiles.provisioningStatus` | `notProvisioned` · `suspended` · `error` | `active` | Comando de alta o reconexión confirmado | — | `tec.provisioning.confirmed` |
| `serviceTechnicalProfiles.provisioningStatus` | `active` | `suspended` | Comando de suspensión confirmado | — | `tec.provisioning.confirmed` |
| `serviceTechnicalProfiles.provisioningStatus` | `active` · `suspended` | `deactivated` | Comando de baja confirmado | — | `tec.provisioning.confirmed` |
| `serviceTechnicalProfiles.provisioningStatus` | `notProvisioned` · `active` · `suspended` | `error` | Comando fallido | — | `tec.provisioning.failed` |
| `providedMailboxes` | (nuevo) | `active` | Alta de la casilla con el servicio | — | — |
| `providedMailboxes` | `active` | `suspended` | Suspensión (por ejemplo, orden de M08) | — | — |
| `providedMailboxes` | `suspended` | `active` | Reconexión | — | — |
| `providedMailboxes` | `active` · `suspended` | `deleted` | Baja del servicio | Las credenciales no se conservan | — |
| `works` | (nuevo) | `draft` | Alta de la obra | — | — |
| `works` | `draft` | `budgeted` | Presupuesto cargado | — | — |
| `works` | `budgeted` | `approved` | Aprobación | Base de aprobación cargada | — |
| `works` | `approved` | `inProgress` | Inicio de la obra | — | — |
| `works` | `inProgress` | `finished` | Fin de la obra | — | — |
| `works` | `inProgress` · `finished` | `levyProposed` | Propuesta de contribución por mejoras | Obra con contribución | — |
| `works` | `levyProposed` | `levyApproved` | Aprobación de la contribución | — | — |
| `works` | `levyApproved` | `billing` | Envío a facturación (M05/M08) | — | — |
| `works` | `billing` · `finished` | `closed` | Cierre | Con contribución, facturación terminada | — |
| `works` | `draft` · `budgeted` | `cancelled` | Cancelación | — | — |
| `inspectionCases` | (nuevo) | `suspected` | Alta del caso por sospecha | — | — |
| `inspectionCases` | `suspected` | `inspectionOrdered` | OT de inspección | — | — |
| `inspectionCases` | `inspectionOrdered` | `inspected` | Cierre de la OT de inspección | — | — |
| `inspectionCases` | `inspected` | `noIrregularity` | Sin irregularidad | — | — |
| `inspectionCases` | `noIrregularity` | `closed` | Cierre | — | — |
| `inspectionCases` | `inspected` | `irregularityConfirmed` | Irregularidad confirmada | — | — |
| `inspectionCases` | `irregularityConfirmed` | `userNotified` | Notificación al usuario | — | — |
| `inspectionCases` | `userNotified` | `defenseReceived` · `defenseExpired` | Descargo recibido o plazo vencido | — | — |
| `inspectionCases` | `defenseReceived` · `defenseExpired` | `recoveryProposed` | Propuesta de recupero | — | — |
| `inspectionCases` | `recoveryProposed` | `recoveryApproved` · `recoveryRejected` | Decisión sobre el recupero | — | — |
| `inspectionCases` | `recoveryApproved` | `billed` | Facturación del recupero | — | — |
| `inspectionCases` | `billed` | `regularized` | Regularización | — | — |
| `inspectionCases` | `regularized` · `recoveryRejected` | `closed` | Cierre | — | — |
| `inspectionCases` | cualquiera no final | `annulled` | Anulación | Motivo y aprobación | — |
| `seals` | (nuevo) | `available` | Alta del lote de precintos | — | — |
| `seals` | `available` | `assigned` | Entrega al inspector (`assignedTo`) | — | — |
| `seals` | `assigned` | `placed` | Colocación (`placement`) | — | — |
| `seals` | `placed` | `removed` | Retiro con motivo (`removal`) | — | — |
| `seals` | `placed` | `broken` | Hallado violado en inspección | — | — |
| `seals` | `available` · `assigned` | `voided` | Anulación o extravío | Motivo obligatorio | — |
| `phonePorts` | (nuevo) | `available` | Alta del puerto | — | — |
| `phonePorts` | `available` | `unavailable` | Conexión del puerto | — | — |
| `phonePorts` | `unavailable` | `available` | Liberación del puerto | — | — |
| `phonePorts` | `available` · `unavailable` | `inactive` | Baja (`INACTIVO`) | — | — |
| `phonePorts` | `inactive` | `available` | Rehabilitación | — | — |
| `phoneStripPositions` | (nuevo) | `available` | Alta de la posición | — | — |
| `phoneStripPositions` | `available` | `reserved` | OT de instalación | — | — |
| `phoneStripPositions` | `reserved` | `connected` | Cierre de la OT | Registra `contractId` | — |
| `phoneStripPositions` | `reserved` | `available` | OT cancelada | — | — |
| `phoneStripPositions` | `connected` | `available` | Desconexión o traslado | La posición nueva guarda `previousPositionId` | — |
| `phoneStripPositions` | `available` · `connected` | `damaged` | Registro de daño | — | — |
| `phoneStripPositions` | `damaged` | `available` | Reparación | — | — |
| `phoneNumbers` | (nuevo) | `available` | Alta del número en la numeración | — | — |
| `phoneNumbers` | `available` | `reserved` | OT | — | — |
| `phoneNumbers` | `reserved` | `assigned` | Asignación a una línea | — | — |
| `phoneNumbers` | `assigned` | `quarantine` | Baja de la línea | Plazo configurable | — |
| `phoneNumbers` | `quarantine` | `available` | Fin de la cuarentena | — | — |
| `phoneNumbers` | `available` | `retired` | Retiro | — | — |
| `phoneLines` | (nuevo) | `active` | Alta de la línea | — | — |
| `phoneLines` | `active` | `closed` | Baja de la línea | — | — |
| `cdrImports` | (nuevo) | `uploaded` | Subida del archivo o `int.cdr.batchReceived` (EVT-INT-16) | `fileHash` no repetido | — |
| `cdrImports` | `uploaded` | `parsing` | Inicio de JOB-TEC-09 | — | — |
| `cdrImports` | `parsing` | `parsed` · `withErrors` | Fin del parseo | Con fila de error se aborta el archivo | — |
| `cdrImports` | `parsed` | `attributed` | Atribución de llamadas | — | — |
| `cdrImports` | `attributed` | `sentToRating` | Pedido de tasación | — | — |
| `cdrImports` | `sentToRating` | `rated` | Tasación terminada | — | — |
| `cdrImports` | `rated` | `grouped` | Agrupación por M05 | — | — |
| `cdrImports` | `parsed` · `attributed` · `rated` | `rolledBack` | Reversión | Ninguna llamada agrupada | — |
| `callRecords.attributionStatus` | (nuevo) | `attributed` · `originNotFound` · `destinationNotFound` · `duplicate` | Atribución en la importación | — | — |
| `callRecords.attributionStatus` | `originNotFound` · `destinationNotFound` | `attributed` | Reintento de atribución tras dar de alta el número | — | — |
| `callRecords.attributionStatus` | `originNotFound` · `destinationNotFound` | `manual` | Atribución manual por el operador | — | — |
| `mobileUsageImports` | (nuevo) | `received` | Carga manual (`importedBy`) o EVT-INT-24 de T06 (`kind = ticQuota`) | — | — |
| `mobileUsageImports` | `received` | `parsed` · `withErrors` | Fin del parseo | — | — |
| `mobileUsageImports` | `parsed` | `attributed` | Atribución de líneas a contratos | — | — |
| `mobileUsageImports` | `attributed` | `applied` | Consumos enviados a M04/M05 | — | — |
| `mobileUsageImports` | `parsed` · `attributed` | `rolledBack` | Reversión | Sin consumos aplicados | — |
| `numberPortings` | (nuevo) | `requested` | Portación entrante pedida por el socio | Dirección entrante | — |
| `numberPortings` | `requested` | `submitted` | Envío al operador donante | — | — |
| `numberPortings` | `submitted` | `accepted` · `rejected` | Respuesta del operador donante | `rejectionReason` si se rechaza | — |
| `numberPortings` | `accepted` | `scheduled` | Ventana acordada (`scheduledWindow`) | — | — |
| `numberPortings` | `scheduled` | `executed` | Portación ejecutada (`executedAt`) | — | — |
| `numberPortings` | `requested` · `submitted` · `accepted` · `scheduled` | `cancelled` | Cancelación | Dirección entrante | — |
| `numberPortings` | (nuevo) | `received` | Pedido de portación saliente del operador receptor | Dirección saliente | — |
| `numberPortings` | `received` | `validated` | Validación del titular y la línea | — | — |
| `numberPortings` | `received` · `validated` | `rejected` | Validación fallida | `rejectionReason` | — |
| `numberPortings` | `validated` | `accepted` | Aceptación | — | — |
| `numberPortings` | `accepted` | `executed` | Portación ejecutada | Dirección saliente | — |
| `waterSamples` | (nuevo) | `taken` | Toma de la muestra | — | — |
| `waterSamples` | `taken` | `inLab` | Ingreso al laboratorio | — | — |
| `waterSamples` | `inLab` | `resulted` | Carga del resultado | — | — |
| `waterSamples` | `resulted` | `actionPending` | Resultado fuera de límite | `outOfLimit` = true | — |
| `waterSamples` | `resulted` | `closed` | Resultado dentro de límite | — | — |
| `waterSamples` | `actionPending` | `closed` | Acciones correctivas hechas | Todas las `correctiveActions` con `doneAt` | — |

## 9. Procesos y flujos

### 9.1 Alta de Internet de punta a punta (piloto DEC-005, CU-AUT-01, CU-INS-01)

1. M09 recibe la solicitud (landing/app) y valida requisitos; si el servicio exige factibilidad (PRM-TEC-024), emite `crm.commandRequest.requested` (EVT-CRM-13, comando `tec.feasibility.request`).
2. TEC crea `feasibilityRequests` con el punto de prestación (BASE §77); propone recurso (OLT/puerto/splitter libre en la red) y, si hace falta, agenda inspección.
3. El evaluador dictamina; si requiere obra o materiales extraordinarios, prepara `connectionEstimates` y M11 emite presupuesto; al aceptarse, la factibilidad queda apta.
4. El contrato se crea en el módulo dueño (pendiente de conectar) con `feasibilityRequestId`; M09 solicita OT de alta (`connect`).
5. TEC crea la OT con instalación integral (`pendingAppointment`), materiales previstos desde la estimación y reglas encadenadas.
6. El socio elige franja en la app: reserva temporal → confirmada (RF-TEC-076); OT `scheduled`.
7. El despachante asigna cuadrilla; TEC solicita a M13 reservar ONT/módem serializado y transferirlo a custodia del instalador (vale) — `equipmentInCustody`.
8. El técnico descarga "Mi día"; el día de la visita informa **En camino** (aviso al socio), llega, verifica equipo (escaneo), instala, prueba, registra materiales usados desde su custodia y fotos.
9. Presenta el detalle de instalación (versión + hash), captura conformidad/firma del receptor identificado.
10. Al sincronizar: mutaciones aplicadas idempotentemente; M13 aplica el equipo (custodia → domicilio/contrato, modalidad comodato); OT `executed`.
11. TEC emite `provisioningCommands.activate` con perfil del plan; al confirmarse, `installation.stage=activationConfirmed` (o `awaitingReview` si hay revisión).
12. TEC publica `tec.installation.activationConfirmed { contractId, effectiveAt, workOrderId }`; el contrato se activa desde `effectiveAt`; M05 genera cargo de instalación y primer abono (prorrateo y modalidad según reglas; ejemplo §73 se valida en M05).
13. TEC solicita a T09 la invitación de encuesta; respuesta ≤ umbral crea caso en M09 (PA-TEC-08). La encuesta no afecta la activación.
14. Excepciones: visita fallida (8.3) → nueva cita, equipo sigue en custodia; prueba fallida → `testFailed`; disconformidad → decisión supervisor; aprovisionamiento fallido → `manualPending` y activación diferida; conflicto offline → §9.4.

### 9.2 OT genérica de trabajo (creación → cierre)

1. Validaciones por operación y duplicados → creación con instantánea, numeración y nota en cuenta.
2. Reglas encadenadas (`chainedOrderRules`) → OT hijas idempotentes por `(parentId, ruleId)`.
3. Propuesta de cargos "antes" (M04) mostrada al operador; aceptación genera cargo en `billableItems` de M05 con `fac.service.upsertBillableItem` (`sourceModule = TEC`, idempotente por OT + regla + momento; RF-TEC-062) o cobro en mostrador (M07).
4. Notificaciones a responsables según reglas y al socio según operación.
5. Asignación/visita/despacho → ejecución (campo o administrativa) → confirmación.
6. Confirmación: validar requisitos (PRM globales + `closeRequirements` de la operación), pagos pendientes (PRM-TEC-075), cadena (orden origen/destino), conflicto abierto.
7. Aplicación de efectos por pasos (servicio de cada módulo dueño) dentro de transacción + outbox; si un paso externo (aprovisionamiento/telemedición) es asíncrono, la OT queda `closing` hasta confirmar o pasar a manual.
8. Cierre: numeración visible (si se asigna al cerrar), cargos "luego" (aceptados → `fac.service.upsertBillableItem` de M05, RF-TEC-062), proporcionales (evento a M04/M05), lectura (M03), notificación de cierre, evento `tec.workOrder.closed` (con el detalle de envases si la operación es `bottledGasDelivery`, RF-TEC-239).

### 9.3 Cierre masivo (JOB-TEC-03)

Selección por filtros → excluye bloqueadas por campo/sistema externo y con conflicto → aplica datos comunes → por cada OT ejecuta 9.2 paso 6–8 de forma independiente (resultado por ítem, idempotente por `(batchId, workOrderId)`) → informe imprimible y notificación opcional → reanudable.

### 9.4 Sincronización offline y conflictos (AGR-025, ESC-03)

1. Descarga: `GET /api/field/my-day` devuelve paquetes con `serverVersion` por entidad y la lista de custodia del técnico.
2. Offline: cada acción genera una mutación en la cola única IndexedDB (`clientMutationId`, `baseVersion`, `occurredAt`); fotos/firmas como blobs en IndexedDB.
3. Al volver la red: `POST /api/field/sync` por lotes (PRM-TEC-145) con evidencias subidas previamente por URL firmada.
4. Servidor por ítem: si `clientMutationId` existe → `duplicate` con resultado original; si permiso inválido → `rejected`; si `baseVersion` = actual o el cambio no afecta campos sensibles → `applied`; si la OT fue cancelada/reasignada/modificada o el equipo/titular cambió → **guardar evidencias y materiales como "hechos de campo"**, crear `syncConflicts`, marcar `workOrders.conflictOpen=true` y responder `conflict`.
5. Desvío de reloj > PRM-TEC-140 → aplica pero marca revisión.
6. El supervisor resuelve (8.8). Ejemplo ESC-03: OT cancelada en admin mientras el técnico instaló offline con firma y equipo: se conserva evidencia, M13 registra que el equipo salió de custodia (hecho físico), y el supervisor decide `acceptField` (reabrir y activar con fecha real) o `acceptServer` (crear OT de retiro y devolver equipo). No hay doble salida de equipo ni borrado.
7. El dispositivo recibe el resultado por ítem y actualiza estado local; banner único con pendientes y "Reintentar".

### 9.5 Corte y reconexión por mora (O6)

1. M08 emite `mor.interruption.approved` (EVT-MOR-12, tipo suspensión) `{ contractId, orderId, mode }`.
2. TEC decide modo por servicio: remoto (comando `suspend`) o en terreno (OT `disconnect` con `dunningOrigin`, `isDelinquent=true`), o directo sin técnica (RF-TEC-049). Si la orden llega con `serviceMode = restricted`, se aplica el perfil de restricción en lugar del corte: OT `flowRestriction` en agua, bloqueo saliente en telefonía o grilla mínima en TV (RF-TEC-238, RN-MOR-137 a RN-MOR-139 de M08).
3. Remoto: comando idempotente por `orderId`; confirmado → `tec.disconnection.executed`; fallido → OT en terreno o manual.
4. En terreno: se agenda/asigna; si el socio paga antes de ejecutar, M08 emite `mor.interruption.cancelled` (EVT-MOR-13) → TEC cancela OT/comando pendiente (`cancelled`) e informa.
5. Reconexión: `mor.interruption.approved` (EVT-MOR-12, tipo reconexión) → comando `reactivate` o OT `reconnect` (cierre y reconexión en un paso si remoto confirmado); sin sistema remoto, OT pendiente para cuadrilla (RN-TEC-072). Proporcionales por evento a M04/M05.

### 9.6 Interrupción planificada y análisis de impacto (O7)

1. El responsable selecciona elementos (p. ej., transformador TR-DEMO-01) → `GET impact` recorre descendientes (`ancestorIds`) y conexiones vigentes → lista de contratos, críticos (electrodependientes) y conteos.
2. Crea `outagePlans` con ventana y motivo → aprobación → T09 envía aviso masivo (constancia por destinatario) → OT de mantenimiento asociadas.
3. Inicio/fin reales registrados → informe de interrupción para regulador (T10) → avisos de restablecimiento.

### 9.7 Mantenimiento preventivo (JOB-TEC-05)

Diario: para cada plan activo con `nextDueAt − marginBeforeDays ≤ hoy` y `nextDueAt ≤ validUntil`, crear OT `maintenance` (idempotente por `(planId, nextDueAt)`), recalcular `nextDueAt` por frecuencia. Avería detectada durante el preventivo → OT correctiva vinculada sin cerrar el preventivo.

### 9.8 Importación de CDR (O10)

1. Subida de archivo o descarga online (Gretix, Tecnored Sunsip, AION, Central Online) por central/fechas → `cdrImports` (`uploaded`), rechazo por `fileHash` repetido.
2. JOB-TEC-09 parsea con el lector de la modalidad; error de fila aborta con número de fila (`withErrors`).
3. Normaliza (origen con "0"), aplica opciones de lector (exclusiones, clave 99), deduplica por `dedupeKey` (PRM-TEC-108).
4. Atribuye origen (línea vigente a la fecha) y destino de entrantes; marca no atribuidas para asignación manual.
5. Envía a M04 (`tec.cdr.attributed`) para tasación; recibe `tar.calls.rated` (EVT-TAR-019).
6. M05 agrupa en consumos al facturar; desde entonces el lote no se revierte.

### 9.9 Aprovisionamiento: reintentos y recuperación (AGR-016, ESC-04)

Worker `tec:aprovisionar` toma comandos `queued|retrying` por `nextAttemptAt`, aplica rate limit por sistema, envía con `commandId` como clave de idempotencia cuando el sistema la soporta; ante timeout consulta estado (`query`) antes de reenviar; tras restauración de backup, JOB-TEC-11 concilia comandos `sending/unknown` con el estado real del sistema externo antes de reanudar.

### 9.10 Contribución por mejoras (O7)

Obra aprobada con base legal → importación del padrón (ExcelImportWizard) → elección de criterio → simulación (`share = medida / Σ medidas`, importe con redondeo explícito y ajuste de centavos al último beneficiario) → aprobación → envío a M05/M08 (cuotas o plan) → seguimiento de cobro por beneficiario.

Precisión del envío (HUECO-OBR-01 y HUECO-OBR-02): la aprobación publica EVT-TEC-25 `tec.levy.approved` (un renglón por beneficiario). M02 crea un contrato tipo 17 por beneficiario (JOB-CAT-13 `cat:crear-contratos-obra`, RF-CAT-115, idempotente por obra + inmueble) y M04 crea su `worksInstallmentPlans` con la cantidad de cuotas aprobada; M05 factura cada cuota por el contrato; T09 envía al frentista el aviso `tec.levy.approved` con el importe y el plan. Por defecto no interviene M08 (PRM-TEC-155 = `installmentPlan17`): si el frentista deja cuotas vencidas, M08 puede refinanciarlas con un convenio sobre esas cuotas (RN-TEC-115).

### 9.11 Inspección y recupero (O7)

Alerta M03 o denuncia → caso `suspected` → OT de inspección (acta, fotos, precintos) → irregularidad confirmada → notificación con plazo (PRM-TEC-143) → descargo → propuesta de recupero (M04, método versionado) → aprobación del comité → M05 emite documento separado → regularización (OT de normalización/precinto) → cierre.

### 9.11.1 Emergencia de seguridad con guardia (HUE-GAS-05)

1. M09 registra un reclamo con subtipo `urgentSafety` (por ejemplo, fuga de gas) y emite el comando `tec.workOrder.request` (antes `tec.workOrder.create`, que es alias de la capability `tec.ordenes.crear` en T02) con prioridad crítica y el protocolo del subtipo (RF-CRM-122).
2. TEC crea la OT de emergencia (RF-TEC-233), resuelve el turno de guardia vigente por servicio y zona (`onCallShifts`) y publica EVT-TEC-35 `tec.emergency.declared`; T09 envía al socio el aviso de emergencia `tec.emergency.notice` (instrucciones de seguridad y teléfono de guardia) y a la guardia la alerta interna.
3. Escalamiento (RF-TEC-232): sin aceptación en PRM-TEC-152 minutos se avisa al suplente y luego al jefe de guardia (EVT-TEC-36 `tec.onCall.escalated` por nivel).
4. En sitio: pasos obligatorios del protocolo (PRM-TEC-154); si corresponde, corte preventivo del suministro o de la zona como interrupción no programada (`outagePlans`, aviso a afectados por T09) sin aprobación previa (RN-TEC-116).
5. Normalización con acta y prueba; la OT pasa a `closed` y se publica `tec.emergency.closed` (EVT-TEC-35); M09 cierra el SLA de seguridad (RF-CRM-260) con las marcas `arrivedAt` y `safeAt`.

### 9.12 Jobs

| Job | Nombre | Frecuencia | Descripción | Idempotencia / recuperación |
|---|---|---|---|---|
| JOB-TEC-01 | `tec:liberar-reservas` | cada minuto | Expira reservas `held` vencidas y devuelve capacidad. | Condicional por estado. |
| JOB-TEC-02 | `tec:generar-ot-masivas` | a demanda | Generación masiva por filtros. | `(batchId, contractId, operationTypeId)`. |
| JOB-TEC-03 | `tec:cerrar-ot-masivas` | a demanda | Cierre/confirmación masiva. | `(batchId, workOrderId)`; reanudable. |
| JOB-TEC-04 | `tec:reparar-efectos` | cada 5 min | Reintenta `pendingSteps` de OT en `closing`; tras N fallos, bandeja operativa. | Paso con id. |
| JOB-TEC-05 | `tec:generar-mantenimiento` | diario 02:00 TZ tenant | Planes preventivos. | `(planId, dueAt)`. |
| JOB-TEC-06 | `tec:aprovisionar` | continuo (cola BullMQ) | Ejecuta comandos de aprovisionamiento. | `commandId`. |
| JOB-TEC-07 | `tec:monitorear-equipos` | cada 5 min | Estado de equipos de red; caída → propuesta de incidente de zona. | Por `deviceId` y ventana. |
| JOB-TEC-08 | `tec:recordatorios-visitas` | — | **Retirado.** M10 solo publica la visita (EVT-TEC-13); el recordatorio lo envía T09. Ver JOB-COM-13 `com:recordatorios-agenda` (dueño). | — |
| JOB-TEC-09 | `tec:importar-cdr` | Evento EVT-INT-16 `int.cdr.batchReceived` (antes `int.cdr.batch-received`); a demanda | Parseo, deduplicación y atribución de CDR (dueño); publica EVT-TEC-27. T06 solo recibe el archivo (JOB-INT-23 `int:recibir-cdr`). | `fileHash`, `dedupeKey`. |
| JOB-TEC-10 | `tec:geocodificar-pendientes` | Evento EVT-CFG-15 | Reacción: pide la geocodificación a T04 por API y actualiza los puntos al recibir EVT-CFG-15 `cfg.geoReference.updated`. Ver JOB-CFG-09 (dueño). | Por domicilio. |
| JOB-TEC-11 | `tec:conciliar-aprovisionamiento` | diario + tras restauración | Concilia estado local vs sistemas externos. | Sin reenvíos ciegos. |
| JOB-TEC-12 | `tec:escalar-conflictos` | cada hora | Escala conflictos vencidos. | Por conflicto. |
| JOB-TEC-13 | `tec:exportar-gis` | a demanda / programado | Ejecuta plantillas de exportación GIS/regulatorias. | `(templateId, period)`. |
| JOB-TEC-14 | `tec:vencer-factibilidades` | diario | Marca `expired`. | Condicional. |
| JOB-TEC-15 | `tec:impacto-interrupcion` | a demanda | Cálculo de impacto para planes grandes. | `(outagePlanId, version)`. |
| JOB-TEC-16 | `tec:alertas-ot-vencidas` | cada 30 min | Alertas de OT por vencer/vencidas. | `(workOrderId, level)`. |
| JOB-TEC-17 | `tec:escalar-guardia` | cada minuto | Escala OT de emergencia sin aceptación al siguiente nivel de guardia (RF-TEC-232, HUE-GAS-05); publica EVT-TEC-36. | `(workOrderId, level)`; condicional por `escalationLog`. |

## 10. Pantallas

Patrón común (CNX §4): `AdminShell` + `AdminStickyHeader` (título `dict:`, acciones primarias, ayuda `ScreenHelp`), `DataTable` con filtros persistentes, paginación servidor, selección múltiple y exportación; modales `sm/md/lg/xl`; importación con `ExcelImportWizard` (plantilla, validación por fila, previsualización, confirmación). La PWA de campo es **una sola** app con landing por rol (AGR-025). Todas las acciones están condicionadas por capability; los botones no permitidos no se muestran.

### 10.1 Administración (web)

| ID | Pantalla | Ruta | Propósito / componentes | Capabilities | Formularios ProCoop reemplazados | Ola |
|---|---|---|---|---|---|---|
| PAN-TEC-01 | Bandeja de factibilidades | `/admin/tec/feasibility` | DataTable por estado, servicio, zona, vigencia; buscador por persona/domicilio/número; acciones evaluar/anular. | `tec.factibilidad.ver` (antes `tec.feasibility.read`) | `frm_Factibilidad` (lista), `frmBuscadorFactibilidad` | O3 |
| PAN-TEC-02 | Ficha de factibilidad | `/admin/tec/feasibility/:id` | Datos, punto en mapa, recurso propuesto, dictamen, notas, historial de cambios, vínculo a contrato/estimación. | `tec.factibilidad.evaluar` (antes `tec.feasibility.evaluate`) | `frm_Factibilidad`, `abm_Factibil_Notas`, `frm_CambiosFactibilidad` | O3 |
| PAN-TEC-03 | Estimación técnica | `/admin/tec/estimates/:id` | Ítems de mano de obra/material/obra desde plantilla, totales, envío a M11 para presupuesto. | `tec.estimaciones.gestionar` (antes `tec.estimate.gestionar`; `tec.estimate.manage`) | (cálculo de presupuesto de factibilidad) | O3 |
| PAN-TEC-04 | Tablero de OT | `/admin/tec/work-orders` | DataTable con filtros (estado, operación, tipo de trabajo, zona, cuadrilla, fechas, vencimiento, morosidad, conflicto); vistas guardadas; KPI en encabezado; impresión de selección. | `tec.ordenes.ver` (antes `tec.workOrder.read`) | `frmInformes_Preview` (consulta) | O3 |
| PAN-TEC-05 | Ficha de OT | `/admin/tec/work-orders/:id` | Pestañas: datos, tareas, materiales, visitas, evidencias, conformidad, notas, datos extra, efectos (pasos), auditoría; acciones según estado (8.4). | `tec.ordenes.ver/editar/cerrar` (antes `tec.workOrder.read/update/close`) | `abm_Tecnica`, `abm_Tecnica_Notas`, `abm_Tecnica_Partiord`, `abm_Tecnica_Tareas` | O3 |
| PAN-TEC-06 | Asistentes de operación | modal `xl` desde cuenta/contrato | Asistente por efecto: desconexión, reconexión, traslado (domicilio nuevo + factibilidad), cambio de medidor, categoría, estado, plan; OT especial. | `tec.ordenes.crear` (antes `tec.workOrder.create`) | `frmOT_Especial`, `frmTecnica_Desconexion`, `frmTecnica_Reconexion`, `frmTecnica_Translado`, `frmTecnica_CambioMedidor`, `frmTecnica_CambioCategoria`, `frmTecnica_CambioEstado` | O3 |
| PAN-TEC-07 | Generación masiva | `/admin/tec/work-orders/bulk-create` | Filtros de contratos, operación, previsualización de cantidad, ejecución como job con progreso. | `tec.ordenes.crearMasivo` (antes `tec.workOrder.bulkCreate`) | `frmOT_Notificaciones`, `frmTecnica_CambioEstadoMasivo` | O3 |
| PAN-TEC-08 | Cierre masivo | `/admin/tec/work-orders/bulk-close` | Selección, datos comunes de cierre, resultado por ítem, informe. | `tec.ordenes.cerrarMasivo` (antes `tec.workOrder.bulkClose`) | `frmBajaMasivaOrdenes`, `frmBajaMasivaOrdenes_Confirmar` | O3 |
| PAN-TEC-09 | Necesidades de materiales | `/admin/tec/materials` | Solicitudes por OT, autorización, estado de reserva/vale (consulta a M13). | `tec.materiales.autorizar` (antes `tec.material.authorize`) | `frmTecnica_AutorizarNecesidad`, `frmConsultar_Vales` | O3 |
| PAN-TEC-10 | Despacho | `/admin/tec/dispatch` | Tablero por recurso/día (carriles), arrastrar OT a recurso, capacidad, mapa lateral, estado de envío al dispositivo, recuperación. | `tec.despacho.gestionar` (antes `tec.dispatch.gestionar`; `tec.dispatch.manage`) | `frmSincronizarCaptor` (reemplazado) | O3 |
| PAN-TEC-11 | Agenda | `/admin/tec/schedule` | Calendario por zona/tipo de visita, cupos, reservas, reprogramación, bloqueos. | `tec.agenda.gestionar` (antes `tec.schedule.manage`) | — (nuevo, BASE §73) | O3 |
| PAN-TEC-12 | Configuración de agenda | `/admin/tec/schedule/config` | Tipos de visita, zonas, franjas, calendarios de recursos, feriados, sobrecupo. | `tec.agenda.configurar` (antes `tec.schedule.configure`) | — | O3 |
| PAN-TEC-13 | Cuadrillas | `/admin/tec/crews` | ABM, integrantes con vigencia, zonas, tipos de trabajo, depósito/custodia asociada. | `tec.cuadrillas.gestionar` (antes `tec.crew.gestionar`; `tec.crew.manage`) | `abm_Cuadri`, `abm_Cuadri_Particua` | O3 |
| PAN-TEC-14 | Recursos de campo | `/admin/tec/resources` | Técnicos/contratistas, habilidades, vehículo, dispositivo asignado. | `tec.cuadrillas.gestionar` (antes `tec.crew.gestionar`; `tec.crew.manage`) | — | O3 |
| PAN-TEC-15 | Responsables a notificar | `/admin/tec/notification-rules` | Reglas por operación/tipo/zona/evento. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_ResponsaNotifica` | O3 |
| PAN-TEC-16 | Profesionales certificados | `/admin/tec/installers` | Electricistas/instaladores habilitados, matrícula, vigencia. | `tec.config.gestionar` (antes `tec.config.manage`) | — | O7 |
| PAN-TEC-17 | Tipos de operación | `/admin/tec/catalog/operations` | ABM con efecto, requisitos de cierre, cargos antes/después, numeración, reglas. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_Transac` | O3 |
| PAN-TEC-18 | Tipos de trabajo | `/admin/tec/catalog/work-types` | ABM, SLA, vencimiento. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_Tptrab` | O3 |
| PAN-TEC-19 | Categorías de incidencia | `/admin/tec/catalog/incident-categories` | ABM jerárquico. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_Cat_Insi` | O3 |
| PAN-TEC-20 | Resoluciones | `/admin/tec/catalog/resolutions` | Códigos de resolución y estados resultantes. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_ResolOt`, `abm_Resestad` | O3 |
| PAN-TEC-21 | Tareas y grupos | `/admin/tec/catalog/tasks` | Catálogo de tareas, duración estándar, grupos. | `tec.config.gestionar` (antes `tec.config.manage`) | `abm_TareasOm` | O3 |
| PAN-TEC-22 | Plantillas de impresión | `/admin/tec/catalog/print-templates` | Diseño de comprobante de OT por operación (variables). | `tec.config.gestionar` (antes `tec.config.manage`) | OT_REPORTE | O3 |
| PAN-TEC-23 | Reglas de OT encadenadas | `/admin/tec/catalog/chained-rules` | Origen → destino, condición, demora. | `tec.config.gestionar` (antes `tec.config.manage`) | ALTASEAU | O3 |
| PAN-TEC-24 | Conflictos de sincronización | `/admin/tec/sync-conflicts` | Bandeja, comparación lado a lado (servidor vs campo con evidencias), resolución. | `tec.conflictos.resolver` (antes `tec.syncConflict.resolve`) | — (nuevo, ESC-03) | O3 |
| PAN-TEC-25 | Bandeja de instalaciones | `/admin/tec/installations` | Vista por etapa (8.5), bloqueos, pendientes de aprovisionamiento/revisión. | `tec.instalaciones.ver` (antes `tec.installation.read`) | — (nuevo, BASE §73) | O3 |
| PAN-TEC-26 | Formularios de campo | `/admin/tec/field-forms` | Diseñador versionado (CNX §7.8): campos, validaciones, obligatoriedad por operación. | `tec.formulariosCampo.gestionar` (antes `tec.fieldForm.gestionar`; `tec.fieldForm.manage`) | — | O3 |
| PAN-TEC-27 | Activos y mantenimiento | `/admin/tec/maintenance` | Planes preventivos, historial por activo, OT generadas. | `tec.mantenimiento.gestionar` (antes `tec.maintenance.manage`) | — (BASE §18) | O7 |
| PAN-TEC-28 | Interrupciones e impacto | `/admin/tec/outages` | Selección en mapa/árbol, impacto, críticos, aviso, seguimiento. | `tec.cortes.gestionar` (antes `tec.outage.manage`) | — (BASE §18) | O7 |
| PAN-TEC-29 | Mapa operativo | `/admin/tec/map` | Capas: OT por estado, recursos (última posición informada), red, contratos, reclamos derivados; filtros y selección por polígono. | `tec.mapa.ver` (antes `tec.map.read`) | (mapas Bing/Google Earth) | O3 (OT) / O7 (red) |
| PAN-TEC-30 | Estructura de redes | `/admin/tec/networks/structure` | Redes, capas, tipos de componente, atributos, relaciones permitidas. | `tec.redes.configurar` (antes `tec.network.configure`) | `abm_Redes`, `abm_Redes_Capas`, `abm_Redes_Componentes`, `abm_Redes_Atributos_Componentes`, `frmRedes_Relaciones`, `frmRedes_Relaciones_Add` | O7 (O3 para FTTH) |
| PAN-TEC-31 | Red instalada | `/admin/tec/networks/elements` | Árbol + mapa, alta individual/múltiple, edición de atributos, estado. | `tec.redes.gestionar` (antes `tec.network.manage`) | `frmRedes_RedInstalada`, `_Add`, `_AddMultiple`, `_EditAtributo` | O7 (O3 FTTH) |
| PAN-TEC-32 | Conexiones servicio–red | `/admin/tec/networks/connections` | Conexión vigente e historial por contrato/elemento, nueva conexión. | `tec.redes.gestionar` (antes `tec.network.manage`) | `frmRedes_Conexiones`, `frmRedes_ConexionNueva` | O3/O7 |
| PAN-TEC-33 | Red v1 (absorbida) | Sin ruta: no se publica (absorbida en PAN-TEC-30/31) | No existe como pantalla; se migra a PAN-TEC-30/31. | No aplica: sin pantalla propia; el acceso es el de PAN-TEC-30 (`tec.redes.configurar`) y PAN-TEC-31 (`tec.redes.gestionar`) (antes `tec.network.configure`, `tec.network.manage`) | `abm_Niv_Capa`, `abm_Niv_Redes`, `abm_Niv_Serv` | — |
| PAN-TEC-34 | Exportación GIS | `/admin/tec/networks/exports` | Plantillas, ejecución, descargas. | `tec.redes.exportar` (antes `tec.network.export`) | `frmActualizarGis` | O7 |
| PAN-TEC-35 | Equipos de red | `/admin/tec/network-devices` | Inventario lógico (routers, OLT, NAS, centrales), estado de monitoreo, credenciales en bóveda (solo referencia). | `tec.equiposRed.gestionar` (antes `tec.networkDevice.gestionar`; `tec.networkDevice.manage`) | `abm_Mikrotik` | O3 |
| PAN-TEC-36 | Sistemas de aprovisionamiento | `/admin/tec/provisioning/systems` | Alta de sistema (tipo, endpoint, credencial en bóveda, perfiles), prueba de conexión, sincronización de catálogos. | `tec.aprovisionamiento.configurar` (antes `tec.provisioning.configure`) | `frmSincronizacionAION` | O3 |
| PAN-TEC-37 | Datos técnicos del servicio | pestaña en contrato | IP/PPPoE/ONT/VLAN/plan técnico/casillas, historial. | `tec.servicioTecnico.ver/editar` (antes `tec.serviceTechnical.ver/editar`; `tec.serviceTechnical.read/update`) | `frmDatosInternet` | O3 |
| PAN-TEC-38 | Consola de comandos | `/admin/tec/provisioning/commands` | Bandeja por estado (8.9), reintentar, marcar manual, ver solicitud/respuesta (sanitizada). | `tec.aprovisionamiento.operar` (antes `tec.provisioning.operate`) | `ComandosDiscar`, `ComandosNexo`, `ComandosTelemedicion`, `frmTecnica_Nexo` | O3 |
| PAN-TEC-39 | Obras y loteos | `/admin/tec/works` | ABM de obras, grupos, presupuesto, avance, OT asociadas. | `tec.obras.gestionar` (antes `tec.work.manage`) | `abm_Obras`, `abm_GrpObra` | O7 |
| PAN-TEC-40 | Contribución por mejoras | `/admin/tec/works/:id/levy` | Padrón (importación), criterio, simulación, aprobación, envío a facturación. | `tec.contribucionesObra.gestionar` (antes `tec.levy.gestionar`; `tec.levy.manage`) | — (MER-009) | O7 |
| PAN-TEC-41 | Inspecciones y fraude | `/admin/tec/inspections` | Casos, acta, precintos, descargos, recupero. | `tec.inspecciones.gestionar` (antes `tec.inspection.manage`) | — (MER-004) | O7 |
| PAN-TEC-42 | Red telefónica física | `/admin/tec/phone/plant` | Centrales, puertos, repartidores, grupos, regletas/posiciones, cajas, DSLAM. | `tec.telefonia.redFisica.ver`, `tec.telefonia.redFisica.editar` (antes `tec.phone.plant`) | (ABM de centrales/regletas, ver §22.4) | O10 |
| PAN-TEC-43 | Numeración | `/admin/tec/phone/numbering` | Prefijos, plan de numeración, números y estados. | `tec.telefonia.numeracion.ver`, `tec.telefonia.numeracion.editar` (antes `tec.phone.numbering`) | (ABM prefijos/números) | O10 |
| PAN-TEC-44 | Líneas | `/admin/tec/phone/lines` | Línea por contrato, puerto/posición/número, historial. | `tec.telefonia.lineas.ver`, `tec.telefonia.lineas.editar` (antes `tec.phone.lines`) | — | O10 |
| PAN-TEC-45 | Importación de CDR | `/admin/tec/phone/cdr` | Importaciones, errores, no atribuidas, reversión. | `tec.cdr.importar` (antes `tec.cdr.import`) | (importadores por central) | O10 |
| PAN-TEC-46 | Telefonía móvil | `/admin/tec/phone/mobile` | Importación de consumos Claro/Personal, conciliación por línea. | `tec.mobile.importar` (antes `tec.mobile.import`) | — (MER-017) | O10 |
| PAN-TEC-47 | Informes técnicos | `/admin/tec/reports` | Catálogo de informes (§15), parámetros, exportación. | `tec.reportes.ver` (antes `tec.report.read`) | `frmInformesTecnica`, `frmInformesFactibilidad`, `frmInformes_Redes`, `frmImpresiones` | O3/O7/O10 |
| PAN-TEC-48 | Revisión de geolocalización | `/admin/tec/geo-review` | Puntos dudosos/sin ubicar, corrección en mapa, confianza. | `tec.geo.revisar` (antes `tec.geo.review`) | — (BASE §77) | O3 |
| PAN-TEC-49 | Carga rápida de reclamo | Sin ruta en M10: se abre la carga de caso de M09 | **Reemplazada por PAN-CRM-04** (M09: modal global "Nuevo caso" y `/crm/carga-rapida`) + derivación a OT (antes "Reemplazada por M09 (caso) + derivación a OT."). | No aplica en M10: el acceso es el de la carga de caso de M09 (`crm.casos.crear`) y la derivación a OT (`tec.ordenes.crear`) (antes `tec.ot.crearDerivada`) | `frmCargaRapidaReclamo` | — |
| PAN-TEC-61 | Guardias | `/admin/tec/on-call` | Calendario de turnos por servicio y zona (titular, suplente, jefe), "de guardia ahora", huecos de cobertura, historial de cambios; OT de emergencia abiertas con su nivel de escalamiento. | `tec.guardias.gestionar` (antes `tec.onCall.manage`) | — (HUE-GAS-05) | O7 |
| PAN-TEC-62 | Protocolos de emergencia | `/admin/tec/emergency-protocols` | ABM versionado por tipo de emergencia y servicio: pasos obligatorios, corte preventivo, plantilla de aviso, tiempos objetivo. | `tec.config.gestionar` (antes `tec.config.manage`) | — (HUE-GAS-05) | O7 |
| PAN-TEC-63 | Portabilidad numérica | `/admin/tec/phone/portings` | Solicitudes entrantes y salientes por estado, ventana, constancias. Visible solo si PRM-TEC-156 = true (PA-TEC-19). | `tec.telefonia.numeracion.ver`, `tec.telefonia.numeracion.editar` (antes `tec.phone.numbering`) | — (HUE-TEL-05) | O10 |
| PAN-TEC-64 | Calidad del agua | `/admin/tec/water-quality` | Puntos de muestreo en mapa, plan de muestreo, muestras por estado, resultados por parámetro con semáforo de límite, acciones correctivas, protocolo del laboratorio. Visible solo si PRM-TEC-157 = true (PA-TEC-20). | `tec.calidadAgua.gestionar` (antes `tec.waterQuality.manage`) | — (HUE-AG-01) | O7 |

### 10.2 App de campo (PWA única)

| ID | Pantalla | Ruta | Propósito / componentes | Perfil | Capability | Ola |
|---|---|---|---|---|---|---|
| PAN-TEC-60 | Shell de campo | `/field` | Landing por rol, banner único de sincronización, estado de red, cambio de perfil si tiene varios, bloqueo por PIN/biometría del dispositivo. | Todos | `tec.campo.ver` | O3 |
| PAN-TEC-50 | Mi día | `/field/today` | Lista ordenada de visitas/OT con franja, dirección, botón navegar (app de mapas del dispositivo), estado. | Técnico | `tec.campo.ver` | O3 |
| PAN-TEC-51 | Ejecución de OT | `/field/work-orders/:id` | Pasos: En camino → Llegué → checklist/formulario → escaneo de equipo → materiales → fotos → prueba → conformidad/firma → cerrar. Funciona sin red. | Técnico | `tec.campo.ejecutar` (con `tec.campo.marcarEnCamino`, `tec.campo.evidencia`, `tec.campo.registrarMateriales`, `tec.campo.registrarConformidad` y `tec.campo.cerrar` por paso) (antes `tec.campo.enCamino`, `tec.campo.conformidad`, `tec.campo.materiales`) | O3 |
| PAN-TEC-52 | Mi stock | `/field/stock` | Custodia del técnico (consulta de M13 en caché), devolución, diferencias. | Técnico | `stk.custodia.ver`; devolución con `tec.campo.registrarMateriales` (antes `tec.campo.materiales`) | O3 |
| PAN-TEC-53 | Cola de sincronización | `/field/sync` | Mutaciones pendientes, resultado por ítem, conflictos, reintentar; nunca permite descartar evidencia sin supervisor. | Todos | `tec.campo.ver`; descartar evidencia exige supervisor | O3 |
| PAN-TEC-54 | Inspección | `/field/inspections/:id` | Acta guiada, precintos, fotos, firma o negativa a firmar. | Técnico/inspector | `tec.inspecciones.editar` y `tec.campo.ejecutar` | O7 |
| PAN-TEC-55 | Crear OT en campo | `/field/work-orders/new` | Alta desde campo por tipos permitidos (PRM-TEC-112). | Técnico/lecturista | `tec.campo.crearOrden` (si V2 #2/#30) (antes `tec.campo.crearOt`) | O3 |
| PAN-TEC-56 | Mapa del técnico | `/field/map` | OT del día, red cercana (capas cacheadas), ubicación propia (no se transmite en continuo). | Técnico | `tec.campo.ver` | O3/O7 |

Los perfiles lecturista (M03) y cobrador (M07) reutilizan PAN-TEC-60 y PAN-TEC-53; sus pantallas específicas se especifican en sus anexos.

### 10.3 Portal del socio

| ID | Pantalla | Ruta | Propósito | Capability | Ola |
|---|---|---|---|---|---|
| PAN-TEC-57 | Reservar visita — **componente embebido en PAN-POR-34** (HUE-SRV-04) | Ruta de M19: `/app/visitas/coordinar/:caseId` (la ruta `/portal/visits/book` no se publica) | Elegir franja disponible, reserva temporal con cuenta regresiva, confirmación y constancia. M10 aporta el componente y la API (API-TEC-40). | `por.visitas.reservar` (sesión de socio, contratos o casos propios o con relación autorizada) | O3 |
| PAN-TEC-58 | Seguimiento de visita — **componente embebido en PAN-POR-35** (HUE-SRV-04) | Ruta de M19: `/app/visitas/:visitId` (la ruta `/portal/visits/:id` no se publica) | Estado (confirmada, asignada, en camino, en sitio, completada), reprogramar/cancelar dentro de reglas, detalle de instalación y conformidad. M10 aporta el componente y la API (API-TEC-41). | `por.visitas.ver`; `por.visitas.reprogramar` y `por.visitas.cancelar` para las acciones (sesión de socio, datos propios) | O3 |
| PAN-TEC-59 | Estado de factibilidad — **componente embebido en PAN-POR-34/35** y en la línea de tiempo de la gestión PAN-POR-33 (HUE-SRV-04) | Ruta de M19 (la ruta `/portal/feasibility/:id` no se publica) | Estado y dictamen visibles al socio (sin datos internos de red). M10 aporta el componente y la API (API-TEC-41, `GET /api/portal/tec/feasibility/:id`). | `por.visitas.ver` (sesión de socio, gestiones propias; sin datos internos de red) | O3 |

**Regla de composición (HUE-SRV-04):** M19 es dueño de la ruta y de la composición en `pwa-socio` y `landing`; PAN-TEC-57, 58 y 59 no son pantallas propias sino componentes de M10 que M19 monta en PAN-POR-34 y PAN-POR-35 (y el estado de factibilidad, además, en PAN-POR-33). Las API del portal de M10 (API-TEC-40 y API-TEC-41) se conservan sin cambios.

Enumeraciones globales de ProCoop absorbidas en los enums del §7: `EstadoTecnica`, `ModoFormulario` (descartado, propio de VB6), `OpcionesDesconexion`, `Estado_AbmTecnica`, `Estados_Factibilidad`, `Origen`.

## 11. API

Convenciones: JSON, `tenantId` derivado de la sesión (nunca del cuerpo), paginación `{items,total,page,size}`, errores RFC 9457 (`type`, `title`, `status`, `detail`, `code`, `errors[]`), `Idempotency-Key` obligatorio en todo POST que crea o aplica efectos, `If-Match`/`version` en PATCH (concurrencia optimista; 409 si no coincide), validación con Zod compartida con el front. Rutas `/api/admin/tec/...` (back office), `/api/field/...` (PWA), `/api/portal/tec/...` (socio), `/api/v1/ext/tec/...` (integraciones con token de servicio).

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-TEC-01 | GET/POST | `/api/admin/tec/feasibility` | `tec.factibilidad.ver` (GET), `tec.factibilidad.crear` (POST) (antes `tec.feasibility.read`, `tec.feasibility.create`) | Listar / crear factibilidad. Filtros estado, servicio, zona, vigencia. | Sí (POST con `Idempotency-Key`) |
| API-TEC-02 | GET/PATCH | `/api/admin/tec/feasibility/:id` | `tec.factibilidad.ver` (GET), `tec.factibilidad.editar` (PATCH) (antes `tec.feasibility.read`, `tec.feasibility.update`) | Ficha / editar. Cambios versionados. | Sí (PATCH con `If-Match`/`version`) |
| API-TEC-03 | POST | `/api/admin/tec/feasibility/:id/verdict` | `tec.factibilidad.evaluar` (antes `tec.feasibility.evaluate`) | Dictaminar. Motivo y responsable obligatorios. | Sí (POST con `Idempotency-Key`) |
| API-TEC-04 | POST | `/api/admin/tec/feasibility/:id/cancel` · `/reopen` | `tec.factibilidad.cancelar` (`/cancel`), `tec.factibilidad.reabrir` (`/reopen`) (antes `tec.feasibility.cancel`, `tec.feasibility.reopen`) | Anular / reabrir. Reapertura según PRM-TEC-064. | Sí (POST con `Idempotency-Key`) |
| API-TEC-05 | GET | `/api/admin/tec/feasibility/:id/resource-proposal` | `tec.factibilidad.evaluar` (antes `tec.feasibility.evaluate`) | Proponer recurso de red. Consulta GIS de capacidad. | Sí (lectura) |
| API-TEC-06 | GET/POST/PATCH · POST | `/api/admin/tec/estimates[/:id]` · `/:id/submit` | `tec.estimaciones.gestionar` (antes `tec.estimate.gestionar`; `tec.estimate.manage`) | Estimación y envío a M11. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`) |
| API-TEC-07 | GET/POST | `/api/admin/tec/work-orders` | `tec.ordenes.ver` (GET), `tec.ordenes.crear` (POST) (antes `tec.workOrder.read`, `tec.workOrder.create`) | Listar / crear OT. Creación valida duplicados (409 `tec.workOrder.duplicate`). | Sí (POST con `Idempotency-Key`) |
| API-TEC-08 | GET/PATCH | `/api/admin/tec/work-orders/:id` | `tec.ordenes.ver` (GET), `tec.ordenes.editar` (PATCH) (antes `tec.workOrder.read`, `tec.workOrder.update`) | Ficha / editar. Bloqueada si `dispatch.locked` (423). | Sí (PATCH con `If-Match`/`version`) |
| API-TEC-09 | POST | `/api/admin/tec/work-orders/:id/{schedule,assign,dispatch,recall,hold,resume}` | `tec.despacho.gestionar` (antes `tec.dispatch.gestionar`; `tec.dispatch.manage`) | Transiciones operativas. | Sí (POST con `Idempotency-Key`) |
| API-TEC-10 | POST | `/api/admin/tec/work-orders/:id/execute` | `tec.ordenes.ejecutar` (antes `tec.workOrder.execute`) | Marcar ejecutada (administrativa). | Sí (POST con `Idempotency-Key`) |
| API-TEC-11 | POST | `/api/admin/tec/work-orders/:id/close` | `tec.ordenes.cerrar` (antes `tec.workOrder.close`) | Confirmar / cerrar. Devuelve 202 si quedan pasos asíncronos. | Sí (POST con `Idempotency-Key`) |
| API-TEC-12 | POST | `/api/admin/tec/work-orders/:id/{cancel,reopen,restore}` | `tec.ordenes.cancelar` (`cancel`), `tec.ordenes.reabrir` (`reopen`, `restore`) (antes `tec.workOrder.cancel`, `tec.workOrder.reopen`) | Anular / reabrir / restablecer. Compensación. | Sí (POST con `Idempotency-Key`) |
| API-TEC-13 | GET/POST | `/api/admin/tec/work-orders/:id/{tasks,notes,extra-data,evidence}` | `tec.ordenes.editar` (antes `tec.workOrder.update`) | Subrecursos. Evidencias: URL firmada de subida. | Sí (POST con `Idempotency-Key`) |
| API-TEC-14 | GET/POST · POST | `/api/admin/tec/work-orders/:id/materials` · `/materials/:mid/{authorize,cancel,return}` | `tec.materiales.solicitar` (GET/POST, `cancel`, `return`), `tec.materiales.autorizar` (`authorize`) (antes `tec.material.authorize`, `tec.material.request`) | Materiales. Delegan reserva/vale a M13. | Sí (POST con `Idempotency-Key`) |
| API-TEC-15 | POST · GET | `/api/admin/tec/work-orders/bulk-create` · `bulk-close` · `/api/admin/tec/jobs/:id` | `tec.ordenes.crearMasivo` (`bulk-create`), `tec.ordenes.cerrarMasivo` (`bulk-close`); el estado del job lo ve quien lo lanzó (antes `tec.workOrder.bulkCreate`, `tec.workOrder.bulkClose`) | Masivos. Job con resultado por ítem. | Sí (POST con `Idempotency-Key`) |
| API-TEC-16 | GET | `/api/admin/tec/work-orders/:id/print` | `tec.ordenes.imprimir` (antes `tec.workOrder.print`) | Comprobante PDF. Marca despacho (RN-TEC-011). | Sí (lectura) |
| API-TEC-17 | GET | `/api/admin/tec/schedule/availability` | `tec.agenda.ver` (antes `tec.schedule.read`) | Disponibilidad por zona/tipo/fecha. También en portal (API-TEC-40). | Sí (lectura) |
| API-TEC-18 | POST | `/api/admin/tec/bookings` · `/:id/{confirm,release,cancel}` | `tec.agenda.gestionar` (antes `tec.schedule.manage`) | Reservas. Contador atómico; 409 `tec.booking.noCapacity`. | Sí (POST con `Idempotency-Key`) |
| API-TEC-19 | GET/POST/PATCH | `/api/admin/tec/visits[/:id]` · `/:id/{reschedule,assign,cancel}` | `tec.agenda.gestionar` (antes `tec.schedule.manage`) | Visitas. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`) |
| API-TEC-20 | CRUD | `/api/admin/tec/schedule/{visit-types,zones,calendars}` | `tec.agenda.configurar` (antes `tec.schedule.configure`) | Configuración de agenda. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-21 | CRUD | `/api/admin/tec/{crews,resources,installers,notification-rules}` | `tec.cuadrillas.gestionar`, `tec.config.gestionar` (antes `tec.crew.gestionar`; `tec.crew.manage`, `tec.config.manage`) | Recursos. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-22 | CRUD | `/api/admin/tec/catalog/{operations,work-types,incident-categories,resolutions,tasks,task-groups,print-templates,chained-rules,intake-channels}` | `tec.config.gestionar` (antes `tec.config.manage`) | Catálogos. Importación Excel. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-23 | GET · POST | `/api/admin/tec/installations` · `/:workOrderId/{confirm-activation,review}` | `tec.instalaciones.ver` (GET), `tec.instalaciones.revisar` (POST) (antes `tec.installation.read`, `tec.installation.review`) | Instalaciones. | Sí (POST con `Idempotency-Key`) |
| API-TEC-24 | GET · POST | `/api/admin/tec/sync-conflicts` · `/:id/resolve` | `tec.conflictos.resolver` (antes `tec.syncConflict.resolve`) | Conflictos. Resolución con motivo. | Sí (POST con `Idempotency-Key`) |
| API-TEC-25 | CRUD · POST | `/api/admin/tec/field-forms` · `/:id/publish` | `tec.formulariosCampo.gestionar` (antes `tec.fieldForm.gestionar`; `tec.fieldForm.manage`) | Formularios de campo. Versionado inmutable al publicar. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-26 | CRUD · CRUD · POST | `/api/admin/tec/maintenance-plans` · `/outages` · `/outages/:id/{approve,notify,start,finish,cancel}` | `tec.mantenimiento.gestionar`, `tec.cortes.gestionar` (antes `tec.maintenance.manage`, `tec.outage.manage`) | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes `CRUD · POST`; PA-TEC-23). | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-27 | GET | `/api/admin/tec/networks/impact?elementIds=` | `tec.redes.ver` (antes `tec.network.read`) | Análisis de impacto. Async (JOB-TEC-15) si supera umbral. | Sí (lectura) |
| API-TEC-28 | CRUD | `/api/admin/tec/networks/{networks,layers,component-types,relations,attributes}` | `tec.redes.configurar` (antes `tec.network.configure`) | Estructura de red. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-29 | CRUD · POST · GET · GET | `/api/admin/tec/networks/elements` · `/elements/bulk` · `/elements/tree` · `/elements/geo?bbox=` | `tec.redes.gestionar` (escritura), `tec.redes.ver` (GET `tree`, `geo`) (antes `tec.network.manage`, `tec.network.read`) | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes `CRUD · POST · GET`; PA-TEC-23). | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-30 | GET/POST · POST | `/api/admin/tec/networks/connections` · `/:id/disconnect` | `tec.redes.gestionar` (antes `tec.network.manage`) | Conexiones. | Sí (POST con `Idempotency-Key`) |
| API-TEC-31 | CRUD · POST | `/api/admin/tec/networks/export-templates` · `/:id/run` | `tec.redes.exportar` (antes `tec.network.export`) | Exportación GIS. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-32 | CRUD · GET | `/api/admin/tec/network-devices` · `/:id/status` | `tec.equiposRed.gestionar` (antes `tec.networkDevice.gestionar`; `tec.networkDevice.manage`) | Equipos de red. Credencial solo como `credentialRef`. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-33 | CRUD · POST | `/api/admin/tec/provisioning/{systems,profiles}` · `/systems/:id/{test,sync-catalog}` | `tec.aprovisionamiento.configurar` (antes `tec.provisioning.configure`) | Sistemas de aprovisionamiento. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-34 | GET · POST | `/api/admin/tec/provisioning/commands` · `/:id/{retry,mark-manual,cancel}` | `tec.aprovisionamiento.operar` (antes `tec.provisioning.operate`) | Consola. | Sí (POST con `Idempotency-Key`) |
| API-TEC-35 | GET/PATCH | `/api/admin/tec/service-technical/:contractId` | `tec.servicioTecnico.ver` (GET), `tec.servicioTecnico.editar` (PATCH) (antes `tec.serviceTechnical.ver`, `tec.serviceTechnical.editar`; `tec.serviceTechnical.read`, `tec.serviceTechnical.update`) | Datos técnicos del servicio. Cambios generan comando. | Sí (PATCH con `If-Match`/`version`) |
| API-TEC-36 | CRUD | `/api/admin/tec/works` · `/works/:id/{beneficiaries,levy/simulate,levy/approve,levy/send}` | `tec.obras.gestionar`, `tec.contribucionesObra.gestionar` (antes `tec.levy.gestionar`; `tec.work.manage`, `tec.levy.manage`) | Obras y contribución. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-37 | CRUD | `/api/admin/tec/inspections` · `/:id/{order,notify,defense,propose-recovery,approve,annul}` · `/seals` | `tec.inspecciones.gestionar` (CRUD y acciones), `tec.inspecciones.aprobar` (`approve`, `annul`) (antes `tec.inspection.manage`, `tec.inspection.approve`) | Inspecciones. Separación de funciones (RN). | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-38 | CRUD | `/api/admin/tec/phone/{exchanges,ports,frames,frame-groups,strips,positions,boxes,dslams,prefixes,numbers,lines,operators,service-types,modalities}` | `tec.telefonia.redFisica.ver` / `tec.telefonia.redFisica.editar` (exchanges, ports, frames, frame-groups, strips, positions, boxes, dslams), `tec.telefonia.numeracion.ver` / `tec.telefonia.numeracion.editar` (prefixes, numbers), `tec.telefonia.lineas.ver` / `tec.telefonia.lineas.editar` (lines), `tec.telefonia.configurar` (operators, service-types, modalities) (antes `tec.phone.*`) | Telefonía. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-39 | POST · GET · POST · POST | `/api/admin/tec/phone/cdr-imports` · `/:id` · `/:id/{attribute,rollback}` · `/mobile-imports` | `tec.cdr.importar`, `tec.mobile.importar` (antes `tec.cdr.import`, `tec.mobile.import`) | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes `POST · GET · POST`; PA-TEC-23). | Sí (POST con `Idempotency-Key`) |
| API-TEC-40 | GET · POST · POST | `/api/portal/tec/availability` · `/api/portal/tec/bookings` · `/:id/confirm` | `por.visitas.reservar` (sesión de socio titular o autorizado; antes "sesión de socio (titular/autorizado)") | Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes `GET · POST`; PA-TEC-23). | Sí (POST con `Idempotency-Key`) |
| API-TEC-41 | GET · POST · GET | `/api/portal/tec/visits/:id` · `/:id/{reschedule,cancel}` · `/api/portal/tec/feasibility/:id` | `por.visitas.ver` (GET), `por.visitas.reprogramar` (`reschedule`), `por.visitas.cancelar` (`cancel`) (sesión de socio; antes "sesión de socio") | Seguimiento. Solo datos propios. | Sí (POST con `Idempotency-Key`) |
| API-TEC-42 | GET | `/api/field/my-day` | `tec.campo.ver` (perfil técnico de la app de campo; antes "perfil técnico") | Paquete del día. ETag; delta desde `since`. | Sí (lectura) |
| API-TEC-43 | POST | `/api/field/sync` | `tec.campo.ejecutar` (perfil de campo; antes "perfil de campo") | Lote de mutaciones. Resultado por ítem (`applied\|duplicate\|conflict\|rejected\|deferred`). | Sí (POST con `Idempotency-Key`) |
| API-TEC-44 | POST | `/api/field/evidence/upload-url` | `tec.campo.evidencia` (perfil de campo; antes "perfil de campo") | URL firmada para foto/firma. Tamaño máx. PRM-TEC-144. | Sí (POST con `Idempotency-Key`) |
| API-TEC-45 | GET | `/api/field/custody` | `stk.custodia.ver` (perfil técnico; antes "perfil técnico") | Custodia del técnico (proxy a M13). | Sí (lectura) |
| API-TEC-46 | POST | `/api/field/devices/register` · `/revoke` | `tec.campo.ver` (`register`, perfil de campo), `tec.dispositivos.gestionar` (`revoke`) (antes `tec.device.gestionar`; `tec.device.manage`) | Dispositivos. Revocación borra caché local al próximo contacto. | Sí (POST con `Idempotency-Key`) |
| API-TEC-47 | GET · PATCH · POST | `/api/admin/tec/geo/review` · `/geo/points/:id` · `/geo/geocode` | `tec.geo.revisar` (antes `tec.geo.review`) | Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes `GET · POST`; PA-TEC-23). | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`) |
| API-TEC-48 | GET | `/api/admin/tec/reports/:reportId` | `tec.reportes.ver` (antes `tec.report.read`) | Informes. Exportación CSV/XLSX/PDF. | Sí (lectura) |
| API-TEC-49 | POST | `/api/v1/ext/tec/work-orders` | `tec.ext.ordenes.crear` (scope del cliente API de T02 por token de servicio; antes "token de servicio con scope `tec.ext.workOrder`") | Alta externa de OT (contratistas, sistemas). Idempotente. | Sí (POST con `Idempotency-Key`) |
| API-TEC-50 | POST | `/api/v1/ext/tec/provisioning/callback/:systemId` | `tec.ext.aprovisionamiento.callback` (cuenta técnica del sistema de red; la llamada se autentica con firma HMAC del sistema) | Callback de sistemas externos. Verifica firma y replay. | Sí (POST con `Idempotency-Key`) |
| API-TEC-51 | CRUD · GET · POST | `/api/admin/tec/on-call/shifts` · `/on-call/current?serviceId=&zoneId=` · `/work-orders/:id/emergency/{accept,arrive,safe}` | `tec.guardias.gestionar` (turnos y `current`), `tec.campo.ejecutar` (`accept`, `arrive`, `safe`; antes "perfil de campo") (antes `tec.onCall.manage`) | Guardias y emergencias (HUE-GAS-05). `current` lo consume M09 para el teléfono de guardia (PRM-CRM-019). | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-52 | CRUD | `/api/admin/tec/emergency-protocols` | `tec.config.gestionar` (antes `tec.config.manage`) | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-53 | GET/POST · POST | `/api/admin/tec/phone/portings` · `/:id/{submit,accept,reject,schedule,execute,cancel}` | `tec.telefonia.numeracion.ver`, `tec.telefonia.numeracion.editar` (antes `tec.phone.numbering`) | Portabilidad numérica (PA-TEC-19). 404 `tec.feature.disabled` si PRM-TEC-156 = false. | Sí (POST con `Idempotency-Key`) |
| API-TEC-54 | CRUD · GET/POST · POST | `/api/admin/tec/water-quality/points` · `/water-quality/samples` · `/samples/:id/{results,corrective-action,close}` | `tec.calidadAgua.gestionar` (antes `tec.waterQuality.manage`) | Calidad del agua (PA-TEC-20). Resultados solo con `labReportDocumentId` (T11); 404 si PRM-TEC-157 = false. | Sí (POST con `Idempotency-Key`; PATCH con `If-Match`/`version`; DELETE por `version`) |
| API-TEC-55 | GET | `/api/internal/tec/contracts/:contractId/calls?period=YYYY-MM&kind=&page=` | `tec.telefonia.llamadas.ver` (cuenta técnica de servicio de M19, con `por.consumos.ver` resuelto, o de M09, con `crm.casos.ver`; antes "Token interno de servicio") | Llamadas atribuidas por contrato y período (RF-TEC-237). Solo lectura; destino enmascarado salvo `tec.telefonia.lineas.ver`, `tec.telefonia.lineas.editar`; incluye `ratingRef` para que M19 una el importe de M04. (antes `tec.telefonia.lineas.*`) | Sí (lectura) |
| API-TEC-56 | — | — | — | **Reemplazado por servicio interno `tec.getQuotaUsage`** (ver §11.1): no es una ruta HTTP. Descripción original: "Consumo del período de correo o pack SMS por contrato (RF-TEC-195; DEC-084)". | — |

Errores de dominio (campo `code`): `tec.feasibility.required`, `tec.feasibility.expired`, `tec.feasibility.alreadyUsed`, `tec.workOrder.duplicate`, `tec.workOrder.locked`, `tec.workOrder.invalidTransition`, `tec.workOrder.closeRequirementsMissing`, `tec.workOrder.pendingPayment`, `tec.workOrder.conflictOpen`, `tec.booking.noCapacity`, `tec.booking.expired`, `tec.reschedule.tooLate`, `tec.material.notInCustody`, `tec.material.exceedsAuthorized`, `tec.equipment.serialMismatch`, `tec.provisioning.systemUnavailable`, `tec.network.relationNotAllowed`, `tec.network.elementInUse`, `tec.phone.numberUnavailable`, `tec.cdr.duplicateFile`, `tec.cdr.parseError`, `tec.inspection.segregationOfDuties`, `tec.version.mismatch`, `tec.provisioning.profileMissing` (plan sin perfil técnico o sin paquete CAS, HUE-TV-04), `tec.onCall.noShift` (sin guardia resuelta; se asigna al jefe de guardia), `tec.waterQuality.labReportMissing`.

### 11.1 Servicios internos (no HTTP)

Llamadas en proceso entre módulos del monolito modular (DEC-003); no se publican como rutas. Cada servicio declara módulo invocante, entrada, salida y errores.

| Servicio | Invocante | Entrada | Salida | Errores | Origen |
|---|---|---|---|---|---|
| `tec.getQuotaUsage` | M04 (cuenta técnica de servicio; antes "Token interno de servicio (M04)") | `{ contractId, period }` | `{ unit, quantity, revision, reportedAt }` de la última revisión atribuida, o `null` si no hay consumo informado (M04 aplica RN-TAR-251 punto 5). Solo lectura. | No declarados en el anexo [VERIFICAR] | Antes fila API-TEC-56. Consumo del período de correo o pack SMS por contrato (RF-TEC-195; DEC-084) |

## 12. Eventos y jobs

### 12.1 Eventos publicados (outbox)

| ID | Evento | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-TEC-01 | `tec.feasibility.requested` | feasibilityId, serviceType, personId, addressId | M09 (seguimiento), T09 |
| EVT-TEC-02 | `tec.feasibility.verdictIssued` | feasibilityId, verdict, validUntil, estimateId? | M09, M11, T09 |
| EVT-TEC-03 | `tec.feasibility.cancelled` | feasibilityId, reason | M09 |
| EVT-TEC-04 | `tec.workOrder.created` | workOrderId, operationTypeId, contractId?, origin, crmCaseId? | M09, M15, T09 |
| EVT-TEC-05 | `tec.workOrder.statusChanged` | workOrderId, from, to, at | M09 (estado del caso), portal |
| EVT-TEC-06 | `tec.workOrder.executed` | workOrderId, executedAt, resourceId | M09, M13 |
| EVT-TEC-07 | `tec.workOrder.closed` | workOrderId, effect, contractId?, closedAt, resolutionCodeId, billableItemIds[]? (cargos "luego" ya creados con `fac.service.upsertBillableItem`, RF-TEC-062); si `effect = bottledGasDelivery` (RF-TEC-239): `bottledGas { deliveryId, warehouseId?, vehicleId?, delivered[{ inventoryItemId, serialUnitId?, containerType, quantity }], retrievedEmpties[{ inventoryItemId, serialUnitId?, containerType, quantity, condition (ok\|damaged\|foreign) }], receiptDocumentId (constancia de T11), deliveredAt }` | M09, M05 (cargos "luego": ya no los crea desde el evento, los recibe por `fac.service.upsertBillableItem`; el evento solo confirma), M03 (lectura), M15, M13 (gas envasado: egreso de llenos del depósito o vehículo y alta de vacíos retirados, idempotente por `workOrderId`) |
| EVT-TEC-08 | `tec.workOrder.cancelled` | workOrderId, reason | M09, M13 (liberar reservas) |
| EVT-TEC-09 | `tec.workOrder.reopened` | workOrderId, reason | M09, M05 |
| EVT-TEC-10 | `tec.charge.proposed` | workOrderId, contractId, conceptId, moment (before/after), quantity | M04 (cotiza según regla). M05 no crea el ítem desde este evento: el cargo aceptado lo crea M10 con `fac.service.upsertBillableItem` (RF-TEC-062; antes "M04/M05") |
| EVT-TEC-11 | `tec.material.requested` / `tec.material.returned` / `tec.material.used` | workOrderId, itemId, serial?, qty | M13 |
| EVT-TEC-12 | `tec.equipment.installed` / `tec.equipment.retrieved` | workOrderId, serial, contractId, premiseId, modality | M13, contrato |
| EVT-TEC-13 | `tec.visit.statusChanged` | visitId, status, eta? | T09 (aviso "En camino", recordatorio), portal |
| EVT-TEC-14 | `tec.visit.failed` | visitId, reason, chargeable | M09, M04/M05 (si regla de cobro) |
| EVT-TEC-15 | `tec.conformity.signed` / `tec.conformity.refused` | workOrderId, documentHash | M09, contrato |
| EVT-TEC-16 | `tec.installation.activationConfirmed` | contractId, workOrderId, effectiveAt | M02 (contrato), M05, M09, T09 (encuesta), M04 |
| EVT-TEC-17 | `tec.survey.requested` | workOrderId, personId, channel | T09 |
| EVT-TEC-18 | `tec.disconnection.executed` | contractId, orderId (M08), mode (`interrupted` \| `restricted`), restrictionProfile? (`reducedFlow` con caudal resultante medido, `outgoingBar`, `minimumLineup`; solo si `mode = restricted`, RF-TEC-238), at | M08, M05/M04 (proporcional), contrato |
| EVT-TEC-19 | `tec.reconnection.executed` | contractId, orderId, mode, at | M08, M05/M04, contrato |
| EVT-TEC-20 | `tec.dependentDisconnection.requested` | parentContractId, dependentContractIds | M08/contrato |
| EVT-TEC-21 | `tec.provisioning.confirmed` / `tec.provisioning.failed` | commandId, contractId, action, systemId | M08, M09, contrato |
| EVT-TEC-22 | `tec.meter.changed` | contractId, oldMeterId, newMeterId, readings, at | M03, M13 |
| EVT-TEC-23 | `tec.outage.notified` / `tec.outage.finished` | outagePlanId, affectedCount, window | T09, T10, M09 |
| EVT-TEC-24 | `tec.networkDevice.down` | deviceId, since, affectedCount | M09 (incidente de zona), T09 |
| EVT-TEC-25 | `tec.levy.approved` | workId, levyVersion, installments, firstDueDate?, beneficiaries[{beneficiaryId, premiseId, accountId, holderId, amount}] (el contrato aún no existe: lo crea M02; HUECO-OBR-01) | M02 (crea un contrato tipo 17 por beneficiario, JOB-CAT-13 `cat:crear-contratos-obra`, RF-CAT-115), M04 (crea `worksInstallmentPlans`), T09 (aviso al frentista `tec.levy.approved`). M05 factura las cuotas por el contrato; M08 no consume (RN-TEC-115) |
| EVT-TEC-26 | `tec.inspection.recoveryApproved` | crmCaseId, contractId, method, period | M04 (cálculo), M05 |
| EVT-TEC-27 | `tec.cdr.attributed` | importId, count, period | M04 |
| EVT-TEC-28 | `tec.mobileUsage.imported` | importId, operator, period | M04/M05 |
| EVT-TEC-29 | `tec.syncConflict.opened` / `tec.syncConflict.resolved` | conflictId, workOrderId, resolution? | M09, supervisor (T09) |
| EVT-TEC-30 | `tec.geo.pointUpdated` | addressId, location, confidence | M01, M03 (rutas) |
| EVT-TEC-31 | `tec.phoneLine.changed` | contractId, number, portId (nulo salvo portabilidad habilitada, RF-TEC-234), at | M04 |
| EVT-TEC-32 | `tec.crewTimesheet.approved` | timesheetId, crewId, workOrderIds, integrantes, fechas, horas normales, extra y guardias | M16 (novedades propuestas, JOB-SUE-07) |
| EVT-TEC-33 | `tec.provisioning.requested` | commandId, contractId, action, systemId, profile | T06 (ejecuta el comando en el sistema de red); la respuesta vuelve como EVT-INT-15 y M10 publica EVT-TEC-21 |
| EVT-TEC-34 | `tec.work.completed` | workId, completedAt, costTotal, destino (bien de uso o gasto) | M15 (obra en curso a bien de uso o gasto, M-79), M13 (alta de bien de uso si corresponde) |
| EVT-TEC-35 | `tec.emergency.declared` / `tec.emergency.closed` | workOrderId, crmCaseId?, kind, serviceId, contractId?, zoneId?, onCallResourceId, protocolVersion, declaredAt; al cerrar: arrivedAt, safeAt, preventiveCutoff? | T09 (aviso de emergencia al socio y afectados `tec.emergency.notice`; alerta a guardia `tec.emergency.onCallAlert`), M09 (SLA de seguridad RF-CRM-260), T10 (informes regulatorios de reclamos de seguridad) |
| EVT-TEC-36 | `tec.onCall.escalated` | workOrderId, level (`backup\|chief`), notifiedResourceId, at | T09 (alerta al nuevo nivel), M09 (escalamiento visible en el caso) |
| EVT-TEC-37 | `tec.waterSample.outOfLimit` | sampleId, samplingPointId, parameters[{code, value, limit}], takenAt | M09 (incidente preventivo si corresponde), T09 (aviso preventivo a la zona según acción correctiva), M06 (informe al regulador) — solo si PRM-TEC-157 = true |
| EVT-TEC-38 | `tec.quotaUsage.reported` | importId, contractId, serviceId, period, unit (`sms\|mailbox\|gb`), quantity, revision, reportedAt (RF-TEC-195; DEC-084) | M04 (exceso sobre el cupo, RN-TAR-251; descarta revisiones de períodos ya facturados y lo registra en la traza) |

### 12.2 Eventos consumidos

| Evento | Origen | Acción en TEC |
|---|---|---|
| `crm.commandRequest.requested` (EVT-CRM-13; comando `tec.workOrder.request` (antes `tec.workOrder.create`, que es alias de la capability `tec.ordenes.crear` en T02)) | M09 | Crear OT derivada con `crmCaseId` y categoría. |
| `crm.commandRequest.requested` (EVT-CRM-13; comando `tec.feasibility.request`) | M09 | Crear factibilidad. |
| `crm.commandRequest.requested` (EVT-CRM-13; comando `tec.workOrder.request` (antes `tec.workOrder.create`, que es alias de la capability `tec.ordenes.crear` en T02) con `priority=critical` y `urgentSafety=true`) | M09 | Crear OT de emergencia y asignarla a la guardia vigente (RF-TEC-233, §9.11.1). |
| `crm.case.closed` | M09 | Si la OT sigue abierta, alerta (no cierra automáticamente). |
| `mor.interruption.approved` / `mor.interruption.cancelled` (EVT-MOR-12/13; tipo suspensión o corte) | M08 | Ejecutar o cancelar corte (9.5); con `serviceMode = restricted`, perfil de restricción (RF-TEC-238). |
| `mor.interruption.approved` (EVT-MOR-12; tipo reconexión) | M08 | Ejecutar reconexión; si el servicio estaba restringido, `flowRestore` o comando `resume`. Automática en servicios remotos al confirmarse el pago y sin deuda vencida del servicio; si requiere técnico, OT automática (DEC-014). |
| `cat.contract.installationRequested` / `cat.contract.planChanged` / `cat.contract.terminationRequested` (EVT-CAT-08/18/13) | M02 | OT de alta / comando de cambio de plan / OT de retiro. |
| `ven.quote.accepted` (EVT-VEN-05) | M11 | Marcar estimación aceptada; liberar factibilidad. |
| `cob.payment.confirmed` (EVT-COB-04) | M07 | Reevaluar bloqueo por pagos pendientes (PRM-TEC-075). |
| `med.point.suspicionRaised` / `med.point.inspectionRequested` (EVT-MED-17/16) | M03 | Proponer caso de inspección. |
| `stk.custody.transferred` (EVT-STK-03) / `stk.reservation.failed` (EVT-STK-23) | M13 | Actualizar custodia en caché / bloquear etapa. |
| `tar.calls.rated` (EVT-TAR-019) | M04 | Marcar CDR tasado. |
| `int.serviceUsage.received` (EVT-INT-24) | T06 | Registrar el consumo de correo o pack SMS en `mobileUsageImports` (`kind = ticQuota`), atribuirlo al contrato por la referencia externa y publicar EVT-TEC-38 por contrato (RF-TEC-195; DEC-084). Idempotente por `messageId`/`fileHash`. |
| `iam.membership.suspended` / `.revoked` (EVT-IAM-03) | T02 | Revocar dispositivos y desasignar recursos. |

### 12.3 Jobs

Ver §9.12 (JOB-TEC-01 a JOB-TEC-17). Todos corren en workers BullMQ con `tenantId` en el job, reintentos con backoff exponencial, dead-letter visible en la bandeja operativa (AGR-016) y métricas de duración/fallos.

## 13. Integraciones

Todas a través de conectores T06 (contrato común: `capabilities()`, `test()`, `execute(command)`, `query(ref)`, mapeo de errores a transitorio/definitivo, credenciales por `credentialRef` en bóveda del tenant, registro sanitizado de solicitud/respuesta, rate limit y circuit breaker). TEC define **qué** se pide y **cuándo**; T06 define **cómo**.

| Sistema | Tipo | Acciones requeridas por TEC | Ola | Notas |
|---|---|---|---|---|
| MikroTik (RouterOS API) | Router/NAS | alta/baja de cliente (PPPoE secret, colas, address-list), suspensión/reactivación, cambio de plan, estado | O3 | Corte directo de ProCoop reemplazado por comando (CTR-TEC-11). |
| Radius (FreeRADIUS u otro) | AAA | alta/baja de usuario, atributos de plan, desconexión de sesión (CoA) | O3 | — |
| SmartOLT | Gestión OLT/ONT | autorizar ONT por serie, perfil de velocidad, suspender, consultar señal | O3 | Serie de ONT validada contra M13. |
| Wispro | Plataforma ISP | alta/baja/suspensión de cliente y plan | O3 si alguna cooperativa a migrar lo usa (PA-TEC-10) | — |
| Ispfull | Plataforma ISP | ídem | O3/O10 | — |
| Sensa | Plataforma ISP/TV | ídem; tickets del proveedor (CTR-TEC-16) | O10 | — |
| Sopnet | Plataforma ISP | ídem | O10 | — |
| Sitsa | Plataforma TV | alta/baja/suspensión por cuenta (CTR-TEC-24) | O10 | Identifica por cuenta, no por contrato. |
| Discar / Nexo | Conmutación telefónica / IVR | comandos de línea | O10 | "Cancelada" como éxito (CTR-TEC-25) se normaliza. |
| Centrales telefónicas (Gretix, Tecnored Sunsip, AION, Central Online y más de 20 formatos de archivo) | CDR | descarga/lectura de CDR, sincronización de catálogos (AION) | O10 | Lectores como plugins (PA-TEC-13). |
| Claro / Personal | Telefonía móvil | importación de consumos | O10 | PA-TEC-14. |
| Telemedición (M03/T06) | Medición remota | corte/reconexión remota de medidores inteligentes | O7 | Comando originado por TEC o M08. |
| Google Maps (Geocoding, Maps JS) | Mapas | geocodificación, mapa base, navegación por deep link | O3 | Proveedor abstraído (PA-TEC-12); clave por tenant en bóveda (PRM-TEC-123). |
| T09 Notificaciones | Interno | aviso de visita, "En camino", recordatorio, interrupción, encuesta | O3 | Constancia de envío. |
| Correo provisto (casillas) | Hosting de correo | alta/baja de casillas `providedMailboxes` | O10 | Credenciales nunca en claro (CTR-TEC-29). |

## 14. Parámetros

Todos los parámetros se gestionan en T04 (`parameterValues`, con alcance tenant / servicio / operación cuando se indica), versionados y auditados. Decisión: **R** replicar, **M** mejorar, **Rz** reemplazar (otra mecánica), **D** descartar (con motivo), **Ref** propiedad de otro anexo (solo se consume). Ninguna credencial es parámetro: las claves se guardan en la bóveda y el parámetro solo lleva `credentialRef`.

### 14.1 Parámetros de origen ProCoop — sección TECNICA (V2)

| ID | V2 | Clave CoopApps | Tipo / default | Alcance | Descripción | Decisión |
|---|---|---|---|---|---|---|
| PRM-TEC-001 | #2 | `field.allowCreateWorkOrders` | bool / true | tenant, perfil | Permite crear OT desde la app de campo. | R (unificado con PRM-TEC-112) |
| PRM-TEC-002 | #10 | — | — | — | Sincronización automática de lecturas desde el colector. | Ref M03 (la cola offline es única, AGR-025) |
| PRM-TEC-003 | #11 | — | — | — | Registrar pagos a través del portal/app. | Ref M07 |
| PRM-TEC-004 | #16 | — | — | — | Foto obligatoria del medidor al leer. | Ref M03 |
| PRM-TEC-005 | #33 | — | — | — | URL de servicio web para generar OT desde el colector. | D: la app es propia y usa la API (CTR-TEC-13) |
| PRM-TEC-006 | #48 | `field.allowCloseWorkOrders` | bool / true | tenant, operación | Permitir ejecutar/cerrar OT desde campo. | M: por operación |
| PRM-TEC-007 | #50 | `field.requireSignatureOnClose` | bool / true para alta/instalación | operación | Firma del receptor al cerrar. | M (PA-TEC-07) |
| PRM-TEC-008 | #51 | `survey.afterClose` | enum `none\|afterClose\|afterActivation` / `afterActivation` | operación | Encuesta de conformidad. | Rz: posterior e independiente (CTR-TEC-15) |
| PRM-TEC-009 | #53 | — | — | — | Mensaje automático al registrar ventas. | Ref M07/T09 |
| PRM-TEC-010 | #54 | `field.allowCloseSelectedOperations` | lista de operaciones | tenant | Operaciones cerrables desde campo. | M: integrado a PRM-TEC-006 por operación |
| PRM-TEC-011 | #57 | `field.skipModifiedOrders` | — | — | No sincronizar OT modificadas. | Rz: conflicto explícito (§9.4), nunca descarte silencioso |
| PRM-TEC-012 | #58 | `portal.claimCreatesWorkOrder` | — | — | Generar OT de reclamo desde la web. | Ref M09 (el caso deriva OT por regla) |
| PRM-TEC-013 | #62 | `field.confirmOnCancel` | bool / true | tenant | Pedir confirmación al cancelar en campo. | R (patrón de UI estándar) |
| PRM-TEC-014 | #64 | `field.showMeterInList` | bool / true | tenant | Mostrar medidor en la lista de OT de campo. | R |
| PRM-TEC-015 | #70 | `field.allowMeterChangeOnUnmetered` | bool / false | servicio | Crear OT de cambio de medidor en servicio no medido desde campo. | R |
| PRM-TEC-016 | #174 | `workOrder.requireAdminNotes` | bool / false | operación | Exigir observación administrativa. | R |
| PRM-TEC-017 | #180 | `workOrder.defaultPrintTemplate` | ref `workOrderPrintTemplates` | operación | Comprobante de OT por defecto. | M: plantilla por operación |
| PRM-TEC-018 | #254 | `workOrder.offerCalculatedConsumption` | bool / false | operación | Ofrecer consumo calculado al cerrar (servicio sin lectura). | R vía evento a M03 |
| PRM-TEC-019 | #333 | `workOrder.defaultIntakeChannel` | ref `crmChannels` (M09; CTR-DAT-77) | tenant | Vía de ingreso por defecto. | R |
| PRM-TEC-020 | #341 | — | — | — | Usuario para ProCoop AVL. | D: sin AVL propietario (CTR-TEC-12) |
| PRM-TEC-021 | #342 | `workOrder.close.requireResponsible` | bool / true | operación | Exigir responsable al confirmar. | R |
| PRM-TEC-022 | #344 | `workOrder.numbering.scheme` | enum `continuous\|byService\|byServiceYear\|byWorkType\|byWorkTypeAndClaim` / `byServiceYear` | tenant | Numeración visible de OT. | M: contador atómico (CTR-TEC-19) |
| PRM-TEC-023 | #358 | `workOrder.print.includeMap` | bool / true | operación | Imprimir OT con mapa. | R (mapa estático con clave del tenant) |
| PRM-TEC-024 | #388 | `feasibility.required` | enum `never\|optional\|required` / `required` para Internet y servicios con red. **Valores por servicio (HUE-SRV-07, DEC-040):** INT `required`, TV `required`, TEL `required`, ELE `required`, AG `required`, GAS `required`, **CLO `required`** (conexión a la red colectora), ALU `never`, servicios sin red (sociales, sepelio, cementerio, vivienda y otros) `never` | servicio, operación (alta, reconexión, traslado) | Exigir factibilidad. **Dueño único** del requisito: M02 PRM-CAT-013 `cat.req.feasibility` es lectura derivada de este valor en la ficha del servicio (true si `required`) y no se edita en M02. | M (PA-TEC-04, CTR-TEC-33, HUE-SRV-07) |
| PRM-TEC-025 | #401 | `workOrder.close.requireNetworkPoint` | bool / true si el servicio usa red | servicio | Exigir punto de conexión a la red física. | R |
| PRM-TEC-026 | #430 | — | — | — | Integración AVL Plus. | D (CTR-TEC-12) |
| PRM-TEC-027 | #441 | `workOrder.close.allowDateBeforeCreation` | bool / false | tenant | Cierre con fecha anterior al alta de la OT. | R (con capability y motivo) |
| PRM-TEC-028 | #443 | `workOrder.materials.lockBillingPrice` | bool / true | tenant | No permitir cambiar precio de materiales a facturar. | R (unifica #448) |
| PRM-TEC-029 | #448 | (= PRM-TEC-028) | — | — | Duplicado del anterior en ProCoop. | M: unificado |
| PRM-TEC-030 | #460 | `workOrder.laborConceptId` | ref concepto M02 | tenant | Concepto de horas hombre para costeo. | R (costeo; informes) |
| PRM-TEC-031 | #465 | `workOrder.printTemplateByOperation` | bool / true | tenant | Modelo de comprobante según operación. | M: siempre posible; parámetro queda como default |
| PRM-TEC-032 | #474 | `workOrder.close.requireCategory` | bool / false | operación | Exigir categoría de incidencia. | R |
| PRM-TEC-033 | #497 | `workOrder.close.requireResolution` | bool / true | operación | Exigir resolución. | R |
| PRM-TEC-034 | #752 | `workOrder.close.allowFutureDate` | bool / false | tenant | Cierre con fecha posterior a hoy. | R (default no) |
| PRM-TEC-035 | #911 | — | — | — | Adhesión a factura web. | Ref M05/T09 |
| PRM-TEC-036 | #2084 | `workOrder.close.requireCrewSize` | bool / false | operación | Exigir cantidad de personas. | R |
| PRM-TEC-037 | #2268 | `workOrder.allowEditIntakeDate` | bool / false | tenant | Cambiar fecha de ingreso. | R (con auditoría) |
| PRM-TEC-038 | #2339 | `workOrder.prefillAdminNotesFromService` | bool / false | servicio | Precargar observación desde el servicio. | R |
| PRM-TEC-039 | #2354 | `workOrder.close.requireParticipantHours` | bool / false | operación | Exigir horas de participantes. | R |
| PRM-TEC-040 | #2370 | `provisioning.nexo.responseTimeoutSeconds` | int / 30 | sistema | Espera de respuesta de Nexo. | Rz: configuración del conector T06 |
| PRM-TEC-041 | #2393 | `provisioning.mikrotik.suspendedProfile` | texto | sistema | Perfil MikroTik de servicio suspendido. | Rz: en `provisioningProfiles` (`suspend`) |
| PRM-TEC-042 | #2399 | `meter.clearOnRemoval` | bool / false | servicio | Borrar datos del medidor al marcar retirado. | M: se cierra la vinculación con fecha (no se borra el historial; M03/M13) |
| PRM-TEC-043 | #2421 (y #2343 de M02) | `workOrder.close.installerCertificate` | enum `none\|warn\|require` / `warn`. **Defaults (HUE-ELE-04):** ELE con jurisdicción Córdoba `require` (Ley 10281, instalador electricista habilitado); GAS `require` (matriculado gasista; conserva el default que tenía M02 PRM-CAT-015); `warn` en el resto | servicio, jurisdicción del suministro, operación | Validar número de certificado del instalador en el alta del contrato (M02 lo lee) y en el cierre de la OT. **Único parámetro** del control: M02 PRM-CAT-015 `cat.req.installerCertificate` pasa a lectura derivada (RN-TEC-114). | R (con `certifiedInstallers`); M (HUE-ELE-04) |
| PRM-TEC-044 | #2422 | `serviceTechnical.usePartnerData` | bool / false | servicio | Datos técnicos de Internet del partner. | Rz: perfiles por sistema |
| PRM-TEC-045 | #2425 | `gis.serviceTypes` | lista de servicios | tenant | Servicios incluidos en GIS. | R |
| PRM-TEC-046 | #2439 | `workOrder.allowEditRequestDate` | bool / false | tenant | Cambiar fecha de solicitud. | R |
| PRM-TEC-047 | #2440 | `disconnection.defaultMeterRemoved` | bool / false | operación | Medidor retirado por defecto en desconexión. | R |
| PRM-TEC-048 | #2470 | `workOrder.close.requireDeviceSerial` | bool / true | operación | Exigir número de dispositivo en altas que lo requieren. | R (validado contra M13) |
| PRM-TEC-049 | #2474 | `meterChange.allowCategoryChange` | bool / false | servicio | Cambio de categoría junto al cambio de medidor. | R |
| PRM-TEC-050 | #2480 | `workOrder.allowContactUpdate` | bool / true | tenant | Actualizar teléfono y correo desde la OT. | M: propone cambio a M01 con confirmación |
| PRM-TEC-051 | #2483 | `reconnection.creditDisconnectedDays` | — | — | Crédito por días desconectado al reconectar. | Ref M04/M05 (TEC emite evento, CTR-TEC-10) |
| PRM-TEC-052 | #2485 | `reconnection.creditConceptId` | — | — | Concepto para ese crédito. | Ref M04/M05 |
| PRM-TEC-053 | #2491 | `provisioning.nexo.loginPerPrepaidSale` | bool | sistema | Login por venta prepaga en Nexo. | Rz: conector T06 |
| PRM-TEC-054 | #2505 | `workOrder.vehicleControl` | enum `none\|ask\|require` / `none` | tenant | Control de móvil (vehículo) en la OT. | R |
| PRM-TEC-055 | #2531 | `disconnection.askMeterRemoval` | bool / true | operación | Preguntar retiro de medidor en desconexión. | R |
| PRM-TEC-056 | #2570 | `categoryChange.proportionalConceptId` | — | — | Concepto de proporcional por cambio de categoría. | Ref M04/M05 |
| PRM-TEC-057 | #2587 | `categoryChange.proportionalPositiveOnly` | — | — | Proporcional solo positivo. | Ref M04 |
| PRM-TEC-058 | #2625 | `categoryChange.chargeImmediately` | — | — | Cobrar el proporcional en el momento. | Ref M05/M07 |
| PRM-TEC-059 | #2627 | `workOrder.materials.allowNonStockProducts` | bool / true | tenant | Registrar materiales sin stock (servicios, mano de obra). | R |
| PRM-TEC-060 | #2629 | `workOrder.requireIntakeChannel` | bool / true | tenant | Exigir vía de ingreso. | R |
| PRM-TEC-061 | #2637 | `move.warnIfRouteUnchanged` | bool / true | servicio | Alertar si no se cambió el recorrido en traslado. | R (ruta en M03) |
| PRM-TEC-062 | #2638 | `move.askUpdatePostalAddress` | bool / true | servicio | Preguntar si se actualiza domicilio postal y recorrido. | R |
| PRM-TEC-063 | #2652 | `workOrder.close.requireMeterModel` | bool / true | servicio | Exigir modelo de medidor en altas con dispositivo. | R |
| PRM-TEC-064 | #2654 | `feasibility.allowEditClosed` | bool / false | tenant | Modificar factibilidades cerradas. | M: reapertura con versión |
| PRM-TEC-065 | #2655 | `workOrder.allowOnPendingConnection` | bool / false | operación | OT sobre servicios pendientes de conexión. | R |
| PRM-TEC-066 | #2657 | `workOrder.materials.showDetail` | bool / true | tenant | Mostrar detalle en el registro de materiales. | D: siempre visible (UI) |
| PRM-TEC-067 | #2661 | `reconnection.debitIfNotBilled` | — | — | Débito al reconectar servicio no facturado en el período. | Ref M04/M05 |
| PRM-TEC-068 | #2667 | `workOrder.materials.lockOnClosed` | bool / true | tenant | Bloquear materiales en OT cerradas. | R (corrección solo compensatoria) |
| PRM-TEC-069 | #2694 | `dunning.allowWithoutTechnicalNotes` | bool / true | tenant | OT por mora sin observación técnica. | R |
| PRM-TEC-070 | #2722 | `labor.normalHourRate` | decimal | tenant | Importe de hora normal (costeo). | M: tarifa con vigencia; el informe no la sobrescribe (CTR-TEC-26) |
| PRM-TEC-071 | #2723 | `labor.overtimeHourRate` | decimal | tenant | Importe de hora extra. | M (ídem) |
| PRM-TEC-072 | #2808 | `workOrder.print.marksDispatched` | bool / true | operación | Imprimir cambia estado a despachada (inverso de V2 "no modificar"). | R |
| PRM-TEC-073 | #2811 | `workOrder.allowDispatchLock` | bool / true | tenant | Bloquear OT enviada a campo. | R |
| PRM-TEC-074 | #2819 | `workOrder.print.includeVouchers` | bool / true | operación | Mostrar vales en el comprobante. | R |
| PRM-TEC-075 | #2891 | `workOrder.close.checkPendingPayments` | bool / true | operación | Verificar pagos pendientes al cerrar (inverso de V2). | R |
| PRM-TEC-076 | #2897 | `provisioning.deleteUserOnTermination` | bool / false | sistema | Eliminar usuario en el sistema de red al dar de baja. | Rz: en `provisioningProfiles` (`terminate`) |
| PRM-TEC-077 | #2899 | `materials.allowImportFromEstimate` | bool / true | tenant | Importar productos del presupuesto a los vales. | R (estimación → materiales previstos; vale en M13) |
| PRM-TEC-078 | #2907 | `reconnection.allowCloseWithoutDocuments` | — | — | Cerrar sin comprobantes de reconexión. | Ref M05 |
| PRM-TEC-079 | #2913 | `field.autoDispatchOnCreate` | bool / false | operación | Enviar automáticamente a campo al crear. | Rz: despacho a la app propia (sin MySQL intermedia, CTR-TEC-13) |
| PRM-TEC-080 | #2933 | `gis.exportTemplateId` | ref `gisExportTemplates` | tenant | Exportador GIS. | Rz: plantillas (CTR-TEC-32) |
| PRM-TEC-081 | #2997 | `maintenance.useDepotAuthorization` | bool / true | tenant | Autorización de materiales en mantenimiento. | R |
| PRM-TEC-082 | #2998 | `claims.numbering.continuous` | — | — | Numeración continua de reclamos. | Ref M09 |
| PRM-TEC-083 | #3031 | `claims.report.numberingByService` | — | — | Numeración por servicio en informe de reclamos. | Ref M09 |
| PRM-TEC-084 | #3034 | (sistema `sitsa`) | `endpoint` en `provisioningSystems` | sistema | URL del servicio web Sitsa. | Rz: configuración de conector |
| PRM-TEC-085 | #3035 | (sistema `sitsa`) | `credentialRef` | sistema | Clave API Sitsa. | Rz: bóveda (CTR-TEC-29) |
| PRM-TEC-086 | #3082 | `feasibility.allowAttachmentsWhenClosed` | bool / true | tenant | Adjuntos en factibilidad cerrada. | R (agregar sin modificar dictamen) |
| PRM-TEC-087 | #3084 | `notifications.responsiblesByServiceAndOperation` | bool / true | tenant | Responsables por servicio y operación. | R (reglas) |
| PRM-TEC-088 | #3085 | `labor.defaultParticipantHourRate` | decimal | tenant | Valor de hora por defecto por participante. | R |
| PRM-TEC-089 | #3086 | `workOrder.dispatch.requireResponsible` | bool / true | tenant | Exigir responsable al despachar a campo. | R |
| PRM-TEC-090 | #3120 | `regulatory.showOcebaTab` | — | — | Pestaña de reclamos OCEBA. | Ref M09/T10 |
| PRM-TEC-091 | #3165 | (sistema `wispro`) | `credentialRef` | sistema | Clave API Wispro. | Rz: bóveda |
| PRM-TEC-092 | #3173 | `workOrder.print.includeIncidentReport` | bool / false | operación | Incluir informe de incidentes en el comprobante. | R |
| PRM-TEC-093 | #3175 | `provisioning.discar.showConnectAction` | bool | sistema | Botón "Conectar servicio" de Discar. | Rz: acción de la consola según capacidades del conector |
| PRM-TEC-094 | #3189 | `provisioning.radius.queryOnly` | bool / false | sistema | Radius solo para consultas. | Rz: `capabilities` del sistema |
| PRM-TEC-095 | #3201 | `workOrder.warnWithoutMaterials` | bool / false | operación | Advertir al cerrar sin materiales. | R |

### 14.2 Parámetros de origen ProCoop — sección TELEFONIA (V2)

| ID | V2 | Clave CoopApps | Descripción | Decisión |
|---|---|---|---|---|
| PRM-TEC-096 | #13 | — | Tarifa de celulares. | Ref M04 |
| PRM-TEC-097 | #18 | `phone.callDetailServiceId` | Servicio del detalle de llamadas. | Ref M04/M05 (TEC solo atribuye) |
| PRM-TEC-098 | #62 | — | Tasar automáticamente internacionales. | Ref M04 (CTR-TEC-17) |
| PRM-TEC-099 | #64 | — | Importe mínimo de llamadas no gratuitas. | Ref M04 |
| PRM-TEC-100 | #82 | `phone.virtualExchangeServiceId` | Servicio para central virtual. | R (atribución de llamadas a central virtual) |
| PRM-TEC-101 | #236 | `phone.prepaidEnabled` | Habilita telefonía prepaga. | R (TEC: OT de recarga; tasación M04) |
| PRM-TEC-102 | #238 | `phone.prepaidTopUpOperationTypeId` | Operación de OT para compra de minutos. | R (efecto `prepaidTopUp`) |
| PRM-TEC-103 | #301 | `mobile.personal.importConfig` | Configuración de datos de Personal. | M: plantilla de importador (PA-TEC-14) |
| PRM-TEC-104 | #332 | `phone.prepaidServiceId` | Servicio de telefonía prepaga. | R |
| PRM-TEC-105 | #471 | — | No aplicar consumo mínimo en claves 0 y 1. | Ref M04 |
| PRM-TEC-106 | #2099 | — | Concepto de crédito prepago. | Ref M04/M05 |
| PRM-TEC-107 | #2295 | `cdr.cppOperatorForNextel` | Operador para importador CPP Nextel. | M: opción del lector |
| PRM-TEC-108 | #2302 | `cdr.dedupeOnImport` | Validar llamadas existentes al importar. | M: siempre activo con `dedupeKey`; parámetro define la clave |
| PRM-TEC-109 | #2344 | — | Tarifa de telefonía por defecto en alta. | Ref M04 |
| PRM-TEC-110 | #2346 | `cdr.telcoIpKey99ZeroAmount` | Importe 0 a llamadas Telco IP clave 99. | M: opción del lector; el importe lo fija M04 |
| PRM-TEC-111 | #2444 | `cdr.lucent.excludedNumbers` | Números a excluir en importador Lucent. | M: opción del lector |

### 14.3 Otros parámetros de origen ProCoop consumidos por TEC

| ID | V2 | Clave CoopApps | Descripción | Decisión |
|---|---|---|---|---|
| PRM-TEC-112 | #30 (TELEMED) | `field.allowCreateWorkOrderTypes` | Crear OT desde la app de campo; lista de operaciones permitidas. | M (unifica #2) |
| PRM-TEC-113 | #65 | `workOrder.deferredChargeInstallmentType` | Tipo de cuota por defecto de cargos "luego". | Ref M05 (TEC solo lo pasa) |
| PRM-TEC-114 | #2301 | `reconnection.allowDeceasedHolder` | Reconectar a titular fallecido. | R |
| PRM-TEC-115 | #2330 | `operations.categoryChangeOperationTypeId` | Operación de cambio de categoría. | M: el efecto vive en el catálogo; parámetro para compatibilidad de M05 |
| PRM-TEC-116 | #2753 | `workOrder.cancelConnection.setNotCurrent` | Estado "No vigente" al anular OT de alta. | R |
| PRM-TEC-117 | #2755 | — | Día límite de facturación para proporcional por cambio de categoría. | Ref M04/M05 |
| PRM-TEC-118 | #3111 | — | Categoría histórica para fijos por mes vencido. | Ref M05 (TEC publica fecha efectiva del cambio) |
| PRM-TEC-119 | #3088 | `notifications.responsibleChannel` | Canal de aviso a responsables (WhatsApp/Email/SMS). | R vía T09 |
| PRM-TEC-120 | #3105 | — | Usar API oficial de WhatsApp. | Ref T09 |
| PRM-TEC-121 | #2693 | — | Proveedor SMS propio de ProCoop. | Ref T09 |
| PRM-TEC-122 | #2823 | — | Código de distribuidora OCEBA (exportaciones). | Ref T10 (usado por plantillas GIS regulatorias) |
| PRM-TEC-123 | #2251 | `maps.apiKeyRef` | Clave del proveedor de mapas (en bóveda). | M: obligatoria por tenant, sin clave fija |
| PRM-TEC-124 | #2027–#2029 | `maps.initialCenter`, `maps.initialZoom`, `maps.baseLayer` | Centro, zoom y tipo de mapa inicial. | R |
| PRM-TEC-125 | #19, #24, #70, #79, #353, #543 (CVLP) | — | Parámetros CVLP usados en validaciones de alta/categoría. | Ref M05/M06/M04 |
| PRM-TEC-126 | #2253 | — | Servicio de Pack SMS (telefonía móvil). | Ref M04/M05 |
| PRM-TEC-127 | #518/#519, #2824/#3051/#3121, #2870/#2873/#2874 | — | Mensajería y conectores varios. | Ref T09/T06 |
| PRM-TEC-128 | #681, #2488, #210 | — | Reclamos y seguridad relacionados. | Ref M09/T01 |

### 14.4 Parámetros nuevos de CoopApps

| ID | Clave | Tipo / default | Alcance | Descripción |
|---|---|---|---|---|
| PRM-TEC-130 | `feasibility.validityDays` | int / 90 | servicio | Vigencia de la factibilidad para un alta (PA-TEC-05). |
| PRM-TEC-131 | `workOrder.duplicateWindowDays` | int / 0 (sin límite) | operación | Ventana para detectar OT duplicadas. |
| PRM-TEC-132 | `workOrder.twoStepClose` | bool por operación / true para alta, desconexión, reconexión, cambio de medidor | operación | Doble paso ejecutada/confirmada (PA-TEC-01). |
| PRM-TEC-133 | `booking.holdMinutes` | int / 15 | tenant | Duración de la reserva temporal. |
| PRM-TEC-134 | `booking.reminderHours` | int / 24 | tipo de visita | Anticipación del recordatorio. |
| PRM-TEC-135 | `booking.overbookingAllowed` | bool / false | zona | Sobrecupo con capability. |
| PRM-TEC-136 | `booking.memberRescheduleMinHours` | int / 24 | tipo de visita | Anticipación mínima para que el socio reprograme o cancele. |
| PRM-TEC-137 | `survey.dissatisfactionThreshold` | int / 2 (escala 1–5) | tenant | Puntaje que crea seguimiento en M09 (PA-TEC-08). |
| PRM-TEC-138 | `installation.activationMilestone` | enum `tested\|testedAndProvisioned\|testedProvisionedAndReviewed` / `testedAndProvisioned` | servicio | Hito de activación (PA-TEC-02). |
| PRM-TEC-139 | `sync.conflictResolutionSlaHours` | int / 24 | tenant | Plazo de resolución antes de escalar (PA-TEC-17). |
| PRM-TEC-140 | `sync.clockSkewToleranceMinutes` | int / 10 | tenant | Tolerancia de reloj del dispositivo. |
| PRM-TEC-141 | `provisioning.maxRetries` | int / 5 | sistema | Reintentos antes de pasar a manual. |
| PRM-TEC-142 | `provisioning.retryBackoff` | lista de segundos / `[30,120,600,1800,3600]` | sistema | Backoff de reintentos. |
| PRM-TEC-143 | `inspection.defenseDays` | int / 10 | tenant | Plazo de descargo (validar con normativa local). |
| PRM-TEC-144 | `evidence.photoMaxMb` | int / 5 | tenant | Tamaño máximo por foto (se comprime en el dispositivo). |
| PRM-TEC-145 | `sync.batchSize` | int / 50 | tenant | Mutaciones por lote. |
| PRM-TEC-146 | `visit.failedVisitChargeRule` | ref regla M04 / ninguna | tipo de visita | Cobro por visita fallida (PA-TEC-06). |
| PRM-TEC-147 | `service.usesTechnicalOrders` | bool / true | servicio | El servicio informa a técnica (altas/bajas generan OT). |
| PRM-TEC-148 | `provisioning.requireConfirmationForActivation` | bool / true | servicio | La activación espera la confirmación del sistema de red. |
| PRM-TEC-149 | `geo.geocodingProvider` | enum `google\|none` / `google` | tenant | Proveedor de geocodificación (abstraído). |
| PRM-TEC-150 | `impact.criticalServiceFlags` | lista / `electroDependent` | tenant | Marcas que destacan contratos críticos en el impacto. |
| PRM-TEC-151 | `materials.defaultWarehouseId` | ref depósito M13 | tenant, cuadrilla | Depósito por defecto cuando no hay custodia. |
| PRM-TEC-152 | `onCall.acceptanceMinutes` | int / 10 | servicio, tipo de emergencia | Minutos para que el nivel de guardia acepte una OT de emergencia antes de escalar (RF-TEC-232, HUE-GAS-05). Default propuesto; **requiere validación legal** con la distribuidora de referencia y el regulador. |
| PRM-TEC-153 | `onCall.escalation` | lista de niveles / `[primary: push+SMS+llamada IVR si existe; backup: push+SMS; chief: push+SMS+WhatsApp]` | servicio | Niveles y canales de aviso de guardia (vía T09). |
| PRM-TEC-154 | `emergency.protocols` | ref `emergencyProtocols` / precarga de plataforma `gasLeak` (GAS), `electricHazard` y `fallenCable` (ELE), `severeLeak` (AG) | servicio | Protocolo aplicado a cada subtipo urgente de M09 (RF-TEC-233). |
| PRM-TEC-155 | `levy.defaultFinancing` | enum `installmentPlan17\|singleCharge` / `installmentPlan17` | tenant, obra | Forma de cobro por defecto de la contribución por mejoras; el convenio de M08 solo refinancia cuotas vencidas (RN-TEC-115, HUECO-OBR-02). |
| PRM-TEC-156 | `phone.numberPortability.enabled` | bool / false | tenant | Habilita la portabilidad numérica (RF-TEC-234) solo para tenants con numeración propia (PA-TEC-19, HUE-TEL-05). |
| PRM-TEC-157 | `water.qualityControl.enabled` | bool / false | servicio AG, concesión | Habilita los controles de calidad del agua en M10 (RF-TEC-235, RF-TEC-236) y el informe REP-BIA-024 (PA-TEC-20, HUE-AG-01). |

PRM-TEC-129 queda reservado (sin asignar) para mantener los bloques.

## 15. Reportes, indicadores y exportaciones

Regla AGR-022: cada indicador declara fórmula, universo, fecha de corte y zona horaria del tenant; los cálculos se hacen sobre datos confirmados salvo que se indique "operativo". Exportación CSV/XLSX/PDF desde PAN-TEC-47; los indicadores avanzados pasan a BI en O11.

| ID | Reporte / indicador | Fórmula | Universo | Fecha de corte | Reemplaza (ProCoop) | Ola |
|---|---|---|---|---|---|---|
| REP-TEC-01 | OT por estado | Conteo por `status` | OT del tenant filtradas por servicio, operación, zona, cuadrilla | Instantánea al momento de la consulta | `frmInformesTecnica` (listado de OT) | O3 |
| REP-TEC-02 | Backlog y antigüedad | OT no finales agrupadas por días desde `requestedAt` (0–2, 3–7, 8–15, >15) | OT no `closed`/`cancelled` | Fecha de consulta | `frmInformesTecnica` (pendientes) | O3 |
| REP-TEC-03 | Cumplimiento de SLA | OT cerradas con `closedAt ≤ dueAt` / OT cerradas | OT cerradas en el período con tipo de trabajo con SLA | `closedAt` en el período | — (nuevo) | O3 |
| REP-TEC-04 | Tiempo medio de resolución | Promedio de `closedAt − requestedAt` (horas hábiles opcional) | OT cerradas del período | `closedAt` | `frmInformesTecnica` | O3 |
| REP-TEC-05 | Primera visita exitosa | Instalaciones activadas con una sola visita / instalaciones activadas | Instalaciones con `activationConfirmed` en el período | Fecha de activación | — (BASE §73) | O3 |
| REP-TEC-06 | Visitas fallidas por motivo | Conteo de `visits.failed` por `failureReason` | Visitas del período | `scheduledStart` | — | O3 |
| REP-TEC-07 | Puntualidad | Visitas con llegada dentro de la franja / visitas completadas | Visitas completadas del período | `scheduledStart` | — | O3 |
| REP-TEC-08 | Ocupación de agenda | Reservas confirmadas / capacidad ofrecida, por zona y día | Franjas del período | Día de la franja | — | O3 |
| REP-TEC-09 | Productividad por recurso | OT ejecutadas, horas registradas y OT por jornada, por técnico/cuadrilla | OT ejecutadas del período | `executedAt` | `frmInformesTecnica` (por cuadrilla) | O3 |
| REP-TEC-10 | Costo de OT | Materiales usados × costo (de M13) + horas normales/extras × tarifa vigente a la fecha de la OT | OT cerradas del período | `closedAt` | `GetCosto_OT` / `GetCosto_OM` (CTR-TEC-26) | O3 |
| REP-TEC-11 | Consumo de materiales | Cantidad usada y devuelta por ítem, servicio, cuadrilla | `workOrderMaterials` `used`/`returned` | Fecha del movimiento | `frmConsultar_Vales`, informe de materiales | O3 |
| REP-TEC-12 | Factibilidades | Conteo por resultado y servicio; tasa factible = factibles / dictaminadas; tiempo medio de dictamen | Factibilidades dictaminadas del período | `verdictAt` | `frmInformesFactibilidad` | O3 |
| REP-TEC-13 | Satisfacción post instalación | Promedio de encuesta y % ≤ umbral (PRM-TEC-137) | Encuestas respondidas | Fecha de respuesta | — (BASE §73) | O3 |
| REP-TEC-14 | Sincronización y conflictos | Mutaciones por resultado; conflictos abiertos y vencidos; tiempo medio de resolución | `syncMutations`, `syncConflicts` | Fecha de recepción | — (AGR-025) | O3 |
| REP-TEC-15 | Aprovisionamiento | Comandos por estado y sistema; tasa de éxito al primer intento; manuales pendientes | `provisioningCommands` del período | `createdAt` | — | O3 |
| REP-TEC-16 | Cortes y reconexiones ejecutados | Conteo por modo (remoto/terreno), tiempo orden→ejecución | Órdenes de M08 del período | `executedAt` | informes de cortes | O6 |
| REP-TEC-17 | Interrupciones | Cantidad, duración real, contratos afectados, críticos; insumo regulatorio (T10) | `outagePlans` completadas | `actualEnd` | — (BASE §18) | O7 |
| REP-TEC-18 | Red instalada | Elementos por tipo, estado y capa; ocupación = conexiones vigentes / capacidad | `networkElements` | Instantánea | `frmInformes_Redes` | O7 |
| REP-TEC-19 | Mantenimiento preventivo | Cumplimiento = preventivos ejecutados en término / programados | Planes activos | `nextDueAt` del período | — | O7 |
| REP-TEC-20 | Obras y contribución | Avance de obra; recaudación de contribución = cobrado / emitido por obra | Obras con contribución | Fecha de corte elegida | — (MER-009) | O7 |
| REP-TEC-21 | Inspecciones | Casos por estado, irregularidades confirmadas / inspeccionadas, recupero aprobado | `inspectionCases` | Fecha de cambio de estado | — (MER-004) | O7 |
| REP-TEC-22 | Importación de CDR | Llamadas importadas, duplicadas, no atribuidas, por central y período | `cdrImports`, `callRecords` | Fecha de la llamada | informes de importación de llamadas | O10 |
| REP-TEC-23 | Comprobante de OT | Documento imprimible por plantilla (con mapa, vales e informe de incidentes según parámetros) | Una OT o selección | — | OT_REPORTE, `frmImpresiones` | O3 |
| REP-TEC-24 | Exportaciones GIS/regulatorias | Según plantilla (`gisExportTemplates`) | Red y contratos | Período de la plantilla | `frmActualizarGis`, 10 exportadores | O7 |
| REP-TEC-29 | Controles de calidad del agua (HUE-AG-01) | Muestras por punto y parámetro; tasa fuera de límite = resultados fuera de límite / resultados registrados; acciones correctivas abiertas y cerradas | `waterSamples` del período (solo si PRM-TEC-157 = true) | `takenAt` en el período | — (nuevo) | O7 |
| REP-TEC-30 | Guardias y emergencias (HUE-GAS-05) | Por tipo de emergencia: tiempo de aceptación, de arribo y hasta zona segura (mediana y p90); escalamientos por nivel; huecos de cobertura de guardia | OT de emergencia y `onCallShifts` del período | `emergency.declaredAt` | — (nuevo) | O7 |

REP-TEC-25 a REP-TEC-28 están asignados en el catálogo consolidado de T10 (§15.4.5) a reportes heredados que M10 incorporará; por eso los nuevos reportes de M10 siguen desde REP-TEC-29.

## 16. Casos de uso

### CU-17 (BASE §17) — Conectar Internet con OT

- **Actor:** supervisor y cuadrilla técnica.
- **Precondición:** SOL-001 con documentación completa (M09) y factibilidad favorable.
- **Flujo:** 1) El supervisor aprueba la cobertura y crea OT-001 (`connect`). 2) TEC pide a M13 reservar el equipo; el despachante asigna CUA-01. 3) La cuadrilla registra instalación, prueba y conformidad; TEC envía la fecha efectiva al contrato.
- **Resultado:** OT revisada, contrato habilitable desde la fecha confirmada, materiales y evidencias vinculados.
- **Trazabilidad:** RF-TEC-022 a 063, 085 a 101; §9.1.

### CU-18 (BASE §18) — Mantenimiento preventivo de un activo

- **Actor:** responsable de mantenimiento.
- **Precondición:** la válvula VAL-001 tiene un plan preventivo.
- **Flujo:** 1) Consulta ubicación e historial en PAN-TEC-27/29. 2) Crea la intervención y marca la zona afectada (análisis de impacto, PAN-TEC-28). 3) Registra tareas, materiales y resultado; el plan recalcula el próximo control.
- **Resultado:** historial técnico actualizado y trazable por activo.
- **Trazabilidad:** RF-TEC-138 a 147; §9.6, §9.7.

### CU-AUT-01 (BASE §50, parte técnica) — Contratación con turno desde la app

- **Definición dueña:** M19 «CU-AUT-01 — Ciclo completo de Internet». Aquí solo el tramo técnico (factibilidad, reserva, visita e instalación).
- **Actor:** socia ASO-001 (ficticia) y cooperativa TEN-001.
- **Flujo técnico:** M09 crea el caso → TEC dictamina factibilidad → la socia elige la franja VIS-DEMO-001 (10/11/2026, 09:00 a 11:00) en PAN-TEC-57 → TEC confirma la reserva → asignación y visita → instalación → activación desde la fecha efectiva.
- **Control:** una visita fallida no activa el contrato (RN de visitas; §8.3).
- **Trazabilidad:** RF-TEC-073 a 084; API-TEC-40/41; EVT-TEC-13/16.

### CU-INS-01 (BASE §73, parte técnica) — Instalación integral

- **Definición dueña:** este anexo. M11 (primer cobro), M13 (stock) y T09 (encuesta) citan su tramo.
- **Actor:** instalador EMP-INS-001 y socia.
- **Flujo:** cita VIS-DEMO-002 el 10/11/2026; MOD-DEMO-001 en custodia del instalador; informa **En camino**; instala y prueba; registra la serie; captura la conformidad. La confirmación vincula el equipo al contrato (M13), actualiza la custodia y publica la activación del 10/11/2026. Se genera ENC-DEMO-001 y la respuesta 4/5 va al tablero, sin modificar el precio ni la fecha.
- **Fuera de TEC:** el primer cobro (prorrateo de 21/30 días, ARS 21.000 de abono más ARS 20.000 de instalación en la hipótesis de BASE) lo calculan M04/M05/M11.
- **Trazabilidad:** RF-TEC-085 a 101; §8.5; §9.1.

### CU-GEO-01 (BASE §77, parte operativa) — Punto de prestación

- **Definición dueña:** T04 «CU-GEO-01 — Dirección de prestación georreferenciada (BASE §77, original)». Aquí solo el uso operativo del punto.
- **Flujo:** M01/T04 normalizan la dirección DIR-DEMO-001. TEC usa el punto confirmado para la factibilidad, la agenda y la ruta. Si el punto está "pendiente de georreferenciación", la OT se crea igual con la marca y entra a la cola de PAN-TEC-48. Nunca se inventan coordenadas.
- **Trazabilidad:** RF-TEC-215 a 223.

### CU-OPE-01 (BASE §78, referencia) — Módem comprado y aplicado

TEC solo interviene en la aplicación del equipo a una OT de Internet: lo consume desde la custodia del instalador una sola vez (sin doble descuento) y no genera cargo al socio por el costo del equipo. La compra y el pago se describen en M12 (definición dueña: «CU-OPE-01 — Compra de módems por servicio»), M13, M14 y M15.

### CU-TEC-01 — Visita fallida y reprogramación

- **Actor:** técnico, socio y despachante.
- **Flujo:** el técnico llega y no hay acceso → marca `failed` con motivo y foto → la OT vuelve a `pending` y la instalación a `failedVisit` → el socio recibe la propuesta de nueva franja → reserva → nueva visita confirmada. El equipo sigue en custodia.
- **Control:** no hay activación ni movimiento de stock al domicilio. El cargo solo existe si lo define una regla (PA-TEC-06).

### CU-TEC-02 — Instalación offline con conflicto (ESC-03)

- **Flujo:** el técnico ejecuta sin red y captura firma, fotos y la serie. Mientras tanto, un operador cancela la OT en la administración. Al sincronizar, el servidor responde `conflict`, conserva las evidencias y abre el conflicto. El supervisor elige `acceptField`: reabre la OT, aplica el equipo y activa con la fecha real.
- **Control:** sin doble salida de equipo, sin borrado de evidencias y con auditoría completa.

### CU-TEC-03 — Corte por mora remoto con pago previo

- **Flujo:** M08 ordena la suspensión → TEC encola `suspend` en MikroTik. El socio paga antes del envío → M08 revoca → el comando pasa a `cancelled`. No hay corte ni proporcionales.

### CU-TEC-04 — Aprovisionamiento con caída del sistema de red

- **Flujo:** la OT de alta se ejecuta y el comando `activate` falla 5 veces → `failed` → `manualPending`. El NOC activa a mano y registra la evidencia → `manualDone` → activación confirmada con la fecha de la evidencia.

### CU-TEC-05 — Interrupción planificada

- **Flujo:** el responsable selecciona el transformador TR-DEMO-01 → el impacto muestra 120 contratos ficticios, 2 de ellos críticos → aprueba → T09 avisa con constancia → OT de mantenimiento → cierre e informe.

### CU-TEC-06 — Traslado de servicio

- **Flujo:** la socia pide el traslado → factibilidad en el nuevo domicilio → OT `move` con la visita → al confirmar: cambio de domicilio del contrato, nueva conexión de red, retiro de la conexión anterior y aviso para revisar el recorrido (PRM-TEC-061/062).

### CU-TEC-07 — Cambio de medidor

- **Flujo:** OT `meterChange` → el técnico registra la lectura de retiro, la serie y la lectura de instalación → evento `tec.meter.changed` a M03 y M13.

### CU-TEC-08 — Inspección con irregularidad

- **Flujo:** alerta de consumo de M03 → caso → OT de inspección con acta, precintos y fotos → irregularidad → notificación con 10 días de descargo → propuesta de recupero (M04) → aprobación por un rol distinto al del inspector → documento separado (M05).

### CU-TEC-09 — Contribución por mejoras

- **Flujo:** obra OBR-DEMO-01 de ARS 1.000.000 (ficticio) con 4 frentistas de 10, 20, 30 y 40 m → shares 10 %, 20 %, 30 % y 40 % → importes ARS 100.000, 200.000, 300.000 y 400.000 → aprobación → envío a M05/M08.

### CU-TEC-10 — Importación de CDR

- **Flujo:** se sube el archivo de una central → se rechaza si su hash ya existe → se parsea; un error en la fila 152 aborta con el número de fila → se corrige y se reimporta → deduplicación → atribución → M04 tasa la llamada.

### CU-TEC-11 — Cierre masivo con OT bloqueadas

- **Flujo:** se seleccionan 50 OT; 3 están despachadas a campo y 1 tiene un conflicto. El job cierra 46 y devuelve las 4 restantes con su motivo, por ítem. Se puede reanudar si se interrumpe.

### CU-TEC-12 — Reclamo que deriva en OT

- **Flujo:** M09 registra el reclamo y lo clasifica → `crm.commandRequest.requested` (EVT-CRM-13) → TEC crea la OT con `crmCaseId` → los estados de la OT se reflejan en el caso → el cierre de la OT no cierra el caso automáticamente (lo cierra M09).

## 17. Criterios de aceptación y escenarios de prueba

| ID | Escenario | Dado / Cuando / Entonces | Requisitos |
|---|---|---|---|
| ESC-TEC-01 | Factibilidad vencida | **Dado** una factibilidad favorable con `validUntil` vencido, **cuando** se intenta un alta, **entonces** se rechaza con `tec.feasibility.expired`. | RN-TEC-001 |
| ESC-TEC-02 | Factibilidad anulada | **Dado** una factibilidad anulada, **cuando** se usa en un alta, **entonces** se rechaza (corrige el comportamiento de ProCoop, CTR-TEC-14). | RN-TEC-001 |
| ESC-TEC-03 | OT duplicada | **Dado** una OT `disconnect` abierta para el contrato, **cuando** se crea otra igual, **entonces** responde 409 `tec.workOrder.duplicate`. | RN-TEC-019 |
| ESC-TEC-04 | Idempotencia de alta | **Cuando** se repite POST con la misma `Idempotency-Key`, **entonces** se devuelve la misma OT, sin crear otra. | API-TEC-07 |
| ESC-TEC-05 | Reserva concurrente | **Dado** un cupo con capacidad 1 y dos socios que confirman a la vez, **entonces** uno obtiene `confirmed` y el otro `tec.booking.noCapacity`. | RN-TEC-055/056 |
| ESC-TEC-06 | Expiración de reserva | **Dado** una reserva `held` de 15 min, **cuando** pasan 16 min sin confirmar, **entonces** queda `expired` y libera el cupo. | JOB-TEC-01 |
| ESC-TEC-07 | Visita fallida no activa | **Cuando** la visita se marca `failed`, **entonces** no hay evento de activación ni movimiento de equipo a domicilio. | BASE §50 control |
| ESC-TEC-08 (ESC-03) | Conflicto offline | El escenario de CU-TEC-02: evidencia conservada, conflicto abierto, sin doble movimiento de stock, resolución auditada. | RF-TEC-112 a 131 |
| ESC-TEC-09 | Mutación duplicada | **Cuando** el dispositivo reenvía un lote con el mismo `clientMutationId`, **entonces** el resultado es `duplicate` y no hay efectos repetidos. | API-TEC-43 |
| ESC-TEC-10 | Reintentos de aprovisionamiento | **Dado** un sistema que falla de forma transitoria 2 veces, **entonces** el tercer intento confirma y no se crean usuarios duplicados (clave de idempotencia). | §9.9 |
| ESC-TEC-11 (ESC-04) | Resultado incierto | **Dado** un timeout después del envío, **entonces** el worker consulta el estado antes de reenviar; tras restaurar un backup, JOB-TEC-11 concilia sin reenviar a ciegas. | §8.9 |
| ESC-TEC-12 | Corte revocado | Escenario de CU-TEC-03: el comando queda `cancelled` y M08 recibe el resultado. | §9.5 |
| ESC-TEC-13 | Cierre con requisitos | **Dado** `requireResolution=true`, **cuando** se cierra sin resolución, **entonces** se rechaza con `tec.workOrder.closeRequirementsMissing` y la lista de campos. | RN de cierre |
| ESC-TEC-14 | Paso de efecto fallido | **Dado** que M03 no responde al cerrar un cambio de medidor, **entonces** la OT queda `closing` con el paso pendiente, JOB-TEC-04 reintenta y no se duplica el efecto. | §8.4 |
| ESC-TEC-15 | Anulación con compensación | **Dado** una OT de alta cerrada, **cuando** se anula, **entonces** se generan las compensaciones (contrato, equipo, cargos) y no hay borrado físico (CTR-TEC-20). | RN-TEC-036 |
| ESC-TEC-16 | Material sin custodia | **Cuando** el técnico registra una serie que no está en su custodia, **entonces** se rechaza con `tec.material.notInCustody` (o se marca la diferencia para revisar, según la operación). | RF-TEC-064 a 072 |
| ESC-TEC-17 | Impacto de red | **Dado** un árbol de 3 niveles con 120 conexiones bajo TR-DEMO-01, **entonces** el impacto devuelve 120 contratos y marca los críticos. | RF-TEC-148 a 163 |
| ESC-TEC-18 | Relación de red inválida | **Cuando** se conecta un tipo de componente no permitido, **entonces** el error es `tec.network.relationNotAllowed`. | RN de red |
| ESC-TEC-19 | Contribución con redondeo | **Dado** ARS 100.000 entre 3 frentistas iguales, **entonces** 33.333,33 + 33.333,33 + 33.333,34 = 100.000,00. | §9.10 |
| ESC-TEC-20 | Separación de funciones | **Cuando** el inspector intenta aprobar su propio recupero, **entonces** recibe `tec.inspection.segregationOfDuties`. | RN-TEC-094 |
| ESC-TEC-21 | CDR duplicado | **Cuando** se reimporta el mismo archivo, **entonces** se rechaza por hash; si una llamada se repite en otro archivo, se descarta por `dedupeKey`. | §9.8 |
| ESC-TEC-22 | Permiso negativo (técnico) | Un técnico no puede ver OT de otra cuadrilla ni autorizar materiales: 403 y sin datos en la respuesta. | §4 |
| ESC-TEC-23 | Permiso negativo (socio) | Un socio no puede consultar la visita de otra cuenta: 404, sin revelar que existe. | API-TEC-41 |
| ESC-TEC-24 | Permiso negativo (configuración) | Un operador sin `tec.config.gestionar` no ve el menú de catálogos y la API responde 403. (antes `tec.config.manage`) | §4 |
| ESC-TEC-25 | Aislamiento de tenant | Con un usuario de TEN-001, toda consulta por un ID de TEN-002 devuelve 404. Los índices empiezan por `tenantId`, los jobs llevan `tenantId` y los archivos se guardan con prefijo por tenant. | DEC-002 |
| ESC-TEC-26 | Credenciales | Ninguna respuesta de la API ni ningún log contiene contraseñas o claves de sistemas de red: solo `credentialRef`. | CTR-TEC-29 |
| ESC-TEC-27 | Dispositivo revocado | **Cuando** se revoca un dispositivo, **entonces** su próxima sincronización se rechaza y su caché local se borra. | API-TEC-46 |
| ESC-TEC-28 | Desvío de reloj | **Cuando** llega una mutación con 30 min de desvío, **entonces** se aplica y queda marcada para revisión. | RN-TEC-069 |
| ESC-TEC-29 | Conciliación de custodia | Al cierre del día, la suma de los movimientos de la OT es igual a las variaciones de la custodia del técnico en M13 (conciliación diaria sin diferencias). | M13 |
| ESC-TEC-30 | Activación con fecha efectiva | **Dado** una instalación probada el 10/11 y un aprovisionamiento confirmado el 11/11 con `activationMilestone=testedAndProvisioned`, **entonces** `effectiveAt` es el 11/11 y se registran ambos hechos (PA-TEC-02). | RN-TEC-064 |

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son inventados. Ningún nombre, documento, domicilio, coordenada real ni credencial proviene de cooperativas reales. Las coordenadas de demo se generan dentro de un polígono genérico configurado por el tenant demo y se marcan con `demo=true`. Importes en ARS.

| Colección | Registros de demo |
|---|---|
| `workOrderOperationTypes` | `ALTA-INT` (connect, doble paso, aprovisiona), `BAJA-INT` (disconnect + retiro de equipo), `CORTE-MORA` (disconnect, origen mora), `RECON` (reconnect), `TRASLADO` (move), `CAMBIO-MED` (meterChange), `CAMBIO-PLAN` (planChange), `RECLAMO-TEC` (incident), `INSPECCION` (inspection), `MANT-PREV` (none, mantenimiento). |
| `workTypes` | `INST` (SLA de 72 h), `REP` (SLA de 24 h), `MANT` (sin SLA), `INSP` (SLA de 120 h). |
| `resolutionCodes` | `RES-OK` (resuelto), `RES-SIN-ACC` (sin acceso), `RES-MAT` (falta material), `RES-DERIV` (derivado a otra área). |
| `taskCatalog` / `taskGroups` | Grupo `FTTH`: tendido de drop (45 min), fusión (20 min), instalación de ONT (15 min), prueba de potencia (10 min). |
| `schedulingZones` / `visitTypes` | Z-01 "Centro", Z-02 "Norte"; visita `INSTALACION` de 120 min y franjas 09:00–11:00, 11:00–13:00, 14:00–16:00, 16:00–18:00 con capacidad 2 por cuadrilla. |
| `crews` / `fieldResources` | CUA-01 (Z-01) con EMP-INS-001 y EMP-INS-002; CUA-02 (Z-02) con EMP-INS-003; supervisor SUP-DEMO-01. |
| `feasibilityRequests` | FAC-DEMO-001 (Internet, DIR-DEMO-001, favorable, vigente 90 días), FAC-DEMO-002 (no factible: sin puerto libre). |
| `connectionEstimates` | EST-DEMO-001: drop de 150 m, mano de obra de 2 h; total ARS 45.000 (ficticio). |
| `visitBookings` / `visits` | VIS-DEMO-001 (10/11/2026 09:00–11:00, confirmada), VIS-DEMO-002 (10/11/2026, asignada a EMP-INS-001). |
| `workOrders` | OT-001 (CU-17), OT-INT-DEMO-001 (CU-AUT-01, cerrada con activación), OT-DEMO-003 (reclamo derivado de un caso de M09), OT-DEMO-004 (corte por mora remoto), OT-DEMO-005 (visita fallida). |
| `workOrderMaterials` | MOD-DEMO-001 (módem en custodia de EMP-INS-001, usado en OT-INT-DEMO-001), 150 m de drop, 2 conectores SC/APC. |
| `serviceConformities` | Conformidad de OT-INT-DEMO-001, firmada por "Ana Demo" (ficticia) con hash del documento. |
| Encuesta | ENC-DEMO-001, respuesta 4/5. |
| `networks` / `networkElements` | Red `FTTH-DEMO`: OLT-DEMO-01 → PON 1/1 → splitter SPL-DEMO-01 (1:8) → NAP-DEMO-01; red `ELEC-DEMO`: SET-DEMO → alimentador AL-01 → TR-DEMO-01 → 120 conexiones ficticias (2 críticas). |
| `networkDevices` | ONT-DEMO-001, OLT-DEMO-01, router RTR-DEMO-01 (credencial solo como `credentialRef` de demo). |
| `provisioningSystems` / `provisioningProfiles` | `mikrotik-demo` y `smartolt-demo` en modo simulador (sin endpoints reales); perfiles INT-100 e INT-300. |
| `serviceTechnicalProfiles` | INT-H-A-001: PPPoE `demo-ana`, IP 10.0.0.10 (rango privado), ONT ONT-DEMO-001. |
| `maintenancePlans` | VAL-001 (válvula, inspección trimestral), TR-DEMO-01 (termografía semestral). |
| `outagePlans` | INT-PLAN-DEMO-01 sobre TR-DEMO-01, ventana de 2 h. |
| `works` / `workBeneficiaries` | OBR-DEMO-01 (cordón cuneta, ARS 1.000.000, 4 frentistas de 10/20/30/40 m). |
| `inspectionCases` / `seals` | INSP-DEMO-01 (sospecha por consumo cero); precintos PRE-DEMO-0001 a 0010. |
| Telefonía | Central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000 (ficticio), números 0000-400100 a 0000-400199, CDR de demo `cdr-demo.csv` con 50 llamadas sintéticas. |
| `syncConflicts` | CNF-DEMO-01 (OT cancelada vs instalación offline, ESC-03). |

## 19. Migración desde ProCoop

Principios (T07): migración repetible e idempotente por el subdocumento `legacy` de T05 §19.1 (`{system, table, key, displayKey, runId, hash, readOnly}`; reemplaza `legacyRef`, CTR-DAT-32) y el mapa `legacyIdMap` de T07; conversión de fechas a la zona horaria del tenant; importes a Decimal128; credenciales a la bóveda (nunca a colecciones); conciliación por conteos y sumas antes de habilitar el paralelo. Las tablas que pertenecen a otros anexos se migran allí.

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `FACTIBIL`, `FACTIBIL_NOTA` | `feasibilityRequests`, `technicalNotes` | `Estados_Factibilidad` al enum del §8.1; anuladas → `cancelled` (nunca usables); vencidas → `expired`; vínculo a contrato si `SERSOC` la usó → `used`. | Conteo por estado; ninguna `cancelled` vinculada a altas posteriores a la migración. |
| `PRESUPU` (los de factibilidad) | `connectionEstimates` | Ítems copiados; vínculo a M11. | Total por presupuesto igual al de origen. |
| `TECNICA` | `workOrders` | `COD_EST` → estado (CTR-TEC-07; la regla del valor 2 se fija por cooperativa en el mapeo, RN-07 §11.1); `COD_TRAN` → `operationTypeId`; `NEW_*` → `operationPayload`; `OBS_ADM`/`OBS_TEC` → notas; numeración visible conservada en `number` y en `legacy.displayKey` (subdocumento `legacy` de T05 §19.1 con `table` = `TECNICA`; antes `legacyNumber`, CTR-DAT-32). | Conteo por estado y operación; OT abiertas = OT abiertas de origen. |
| `TECNICA_NOTA` | `technicalNotes` | Con autor y fecha. | Conteo. |
| `TECNICA_EXTRAS` | `damageAssessments` / `workOrders.extraData` | Reclamos por daños: montos a Decimal128. | Suma de reclamado y aprobado. |
| `TECNICA_NECESIDAD`, `MOV_PRO` (operaciones 3/5/6/8 de OT) | `workOrderMaterials` | Solicitado/autorizado/retirado/utilizado → estados del §8.6; los movimientos de stock se migran en M13. | Cantidad utilizada por OT = salidas de stock de origen. |
| `PARTIORD`, `PARTIINC` | `workOrders.participants` | Horas normales y extras; valor de hora histórico. | Horas totales por OT. |
| `TAROTM` | `workOrders.tasks` | — | Conteo. |
| `TECNICA_MOVIL` | `workOrders.vehicleIds` (referencia a M18) | — | Conteo. |
| `TECNOTEXP`, `TECNGREXP`, `TECNSEEXP` | `workOrders.dispatch` (histórico) | Solo el último estado exportado. | — |
| `TRANSAC` | `workOrderOperationTypes` | `TIP_TRAN` → efecto; `REG_EST`/`COD_EST` → estado resultante; `ENVIO_SMS` → regla de notificación; `ALTA_PMOVIL` → permitida en campo; `EXCLUIR_WEB` → canal. | Una operación por `COD_TRAN` y servicio. |
| `TPTRAB` | `workTypes` | `REPORTE` → plantilla. | Conteo. |
| `CAT_INCI`, `CAT_INCI_CTSEC`, `CLAS_INC` | `incidentCategories` | Porcentajes por sección que sumen 100 (si no suman, se informa el error). | Suma de porcentajes. |
| `RESOL_OT` (+ estados de resolución) | `resolutionCodes` | — | Conteo. |
| `TAREAS`, `TAREASOM`, `GRPTAREA` | `taskCatalog`, `taskGroups` | Unificación de `TAREAS`/`TAREASOM` (CTR-TEC-28) con deduplicación por descripción y servicio. | Ninguna tarea referenciada sin destino. |
| `OT_REPORTE` | `workOrderPrintTemplates` | El diseño se rehace; se migra solo la asignación por operación. | — |
| `ALTASEAU` | `chainedOrderRules` | — | Conteo. |
| `VIAINGTE` | `crmChannels` de M09 (se migra allí; M10 solo resuelve `intakeChannelId`, CTR-DAT-77) | — | — |
| `CUADRI`, `PARTICUA` | `crews` | Integrantes con vigencia desde la fecha de migración. | Conteo. |
| `RESPONSA` | `fieldResources` + usuarios de T01 | **Destino único** (DEC-104 punto 2; M01 CTR-PER-22): cada fila es un técnico, instalador, lecturista, cobrador o inspector de campo (`ACTIVIDAD` → `activity`, `NOM_RES` → `name`, `ASIGNAOT_PMOVIL` → `assignToFieldApp`, `COD_DPS` → `custodyWarehouseId`); no genera garantes ni relaciones de M01 (`relationships`). `PAS_RES` **no se migra** (CTR-TEC-27): el usuario se invita y crea su credencial. | Ningún hash ni contraseña en destino; cantidad de `fieldResources` migrados igual a la de filas de `RESPONSA`; ninguna `relationships` de M01 con origen `RESPONSA`. |
| `RESPONSA_NOTIFICA` | `responsibleNotificationRules` | — | Conteo. |
| `PROFESIO` | `certifiedInstallers` | Datos de contacto con consentimiento (M01). | Conteo. |
| `EXPEDIENTES`, `EXPEDIENTES_TRAM` | `technicalProcedures` | Adjuntos al almacenamiento privado. | Conteo de etapas. |
| `OBRAS`, `GRPOBRA` | `works`, `workGroups` | Cuentas contables → referencia a M15. | Conteo. |
| `REDES`, `REDES_CAPAS`, `REDES_COMPONENTES`, `REDES_ATRIBUTOS_COMPONENTES`, `REDES_RELACIONES_COMPONENTES`, `REDES_SERVICIOS` | `networks`, `networkLayers`, `networkComponentTypes`, `networkAttributeDefs`, `networkComponentRelations` | — | Conteo por red. |
| `REDES_RED_INSTALADA`, `REDES_ATRIBUTOS` | `networkElements` | Latitud/longitud → GeoJSON (las coordenadas inválidas o en 0,0 se marcan "pendiente"); se calcula `ancestorIds`. | Conteo de elementos; árbol sin ciclos. |
| `NIV_CAPA`, `NIV_REDES`, `NIV_SERV` (red v1) | Misma estructura de red v2 (CTR-TEC-21) | Se crea una red por servicio y los niveles pasan a ser capas; `legacy.table='NIV_REDES'`. | Conteo. |
| `SERSOC_REDES` | `serviceNetworkConnections` | — | Conexiones vigentes = servicios conectados. |
| `MAPA` (puntos de domicilio) | Punto de prestación en M01/T04 | Confianza "migrado". | — |
| `MIKROTIK` | `networkDevices` + bóveda | Contraseña → bóveda (CTR-TEC-29). | Ninguna credencial en claro. |
| `INTERNET` | `serviceTechnicalProfiles` | `USER_PASS` → bóveda; MAC, IP, nodo y OLT a los campos. | Un perfil por servicio de Internet activo. |
| `CORREOSINT` | `providedMailboxes` | Contraseña → bóveda o reinicio obligatorio. | Conteo. |
| `TELEMEDICION`, `TELEMED_COMM` (configuración de sistemas) | `provisioningSystems` | Credenciales → bóveda. | Prueba de conexión antes de habilitar. |
| `SERVINT` | `provisioningProfiles` | — | — |
| `CENTRALT`, `TEL_CENTRAL` | `phoneExchanges` | Unificación (CTR-TEC-30). | Conteo. |
| `TEL_PUERTOS_CENTRAL`, `TEL_PUERTOS_DSLAM`, `TEL_DSLAM` | `phonePorts`, `dslams` | — | Conteo. |
| `TEL_REPARTIDOR`, `TEL_GRUPOS_REPARTIDOR`, `TEL_REGLETAS_GRUPOS`, `TEL_POS_REG_GRUPOS`, `TEL_CAJAS`, `TEL_REGLETAS_CAJAS`, `TEL_POS_REG_CAJA` | `phoneFrames`, `phoneFrameGroups`, `phoneStrips`, `phoneStripPositions`, `phoneBoxes` | Las posiciones conservan la conexión de entrada y salida. | Conteo por regleta. |
| `TEL_PREFIJO`, `TEL_NUMEROS` | `phonePrefixes`, `phoneNumbers` | Estado → enum del §8.14. | Números asignados = líneas vigentes. |
| `TEL_SERSOC` | `phoneLines` | Tarifa → referencia a M04. | Conteo. |
| `CARACTER`, `OPERADOR`, `TEL_SERVICIO`, `TEL_MODALIDAD` | `numberingPlan`, `telecomOperators`, `telecomServiceTypes`, `telecomModalities` | — | Conteo. |
| `LLAMADAS`, `ENTRANTE`, `INTERNAC`, `LLA_CEL`, `RECHAZOS` | `callRecords` | Solo el período abierto (no facturado) y 13 meses de histórico para consulta; la tasación histórica queda como `sourceAmount`. | Conteo y segundos totales por período. |
| `EQUIPOS`, `MODEMS`, `UBICACIONES` | No se migran en M10 (CTR-TEC-04/05/06) | `EQUIPOS` (terminales y kioscos) va al agente de hardware local (T06); `MODEMS` (módems GSM para SMS) va a T09; `UBICACIONES` (ubicaciones dentro de depósitos) va a M13. | — |
| `RECLAMOS*`, `RUB_REC`, `FALLAS` | M09 | OT vinculadas por `legacy` y `legacyIdMap` (T07). | — |
| `MOVIL`, `CHOFERES`, `AVL_REG` | M18 | — | — |

## 20. Contraposiciones resueltas

Regla de prevalencia (guía §3): 1 = DEC, 2 = BASE, 3 = AGR, 4 = CNX, 5 = benchmark ProCoop (DFA, FIC, RN, CAT, INV, REL), con reemplazo cuando hay deuda técnica o de seguridad.

| ID | Fuentes | Conflicto | Resolución | Prevalencia |
|---|---|---|---|---|
| CTR-TEC-01 | DFA M14 vs CAT, RN-07 §1.8 | DFA trata `ITEMSORD` como los materiales de la OT; CAT lo describe como el orden de impresión de los ítems de factura, y RN-07 muestra que los materiales se registran en `MOV_PRO` y `TECNICA_NECESIDAD`. | `ITEMSORD` pasa a M05. Los materiales de la OT son una entidad propia (`workOrderMaterials`). | 5 (código y catálogo sobre la descripción funcional) |
| CTR-TEC-02 | CAT vs RN-07 | CAT describe `CUADRI` como "cuadros"; el código lo usa como cuadrillas (con `PARTICUA`). | Cuadrillas (`crews`). | 5 (comportamiento del código) |
| CTR-TEC-03 | DFA M14 vs CAT | DFA ubica `OPERADOR` en cuadrillas; CAT lo define como operador telefónico. | `telecomOperators` (telefonía). | 5 |
| CTR-TEC-04 | DFA M15 vs CAT | DFA dice que `EQUIPOS` son equipos de red; CAT dice que son terminales y kioscos. | Los equipos de red son `networkDevices` (nuevo, a partir de `MIKROTIK`, `CENTRALT` y BASE §86). `EQUIPOS` va al agente de hardware local (T06). | 2 + 5 |
| CTR-TEC-05 | DFA vs CAT | `MODEMS` parecía ser módems de clientes; en realidad son módems GSM para enviar SMS. | Va a T09. Los módems y ONT de clientes son equipos serializados de M13. | 5 |
| CTR-TEC-06 | DFA vs CAT | `UBICACIONES` parecía ser ubicaciones geográficas de red; son ubicaciones dentro de los depósitos. | Va a M13. | 5 |
| CTR-TEC-07 | RN-07 §1.1, §11.1 | Los estados de la OT tienen valores distintos en el enum del escritorio (1/2/3/4) y en el DTO web (1/2/3). | Enum único del §8.4; mapeo por cooperativa en la migración. | 4 (CNX: enums únicos) |
| CTR-TEC-08 | RN-07 §10.1 | Hay dos enums para el tipo de orden (`TipoOrden` y `TipoOrd`). | Una sola `class` de OT (RF-TEC-022). | 4 |
| CTR-TEC-09 | RN-07 (recomienda PostGIS) vs DEC-001 | RN-07 sugiere PostGIS para el GIS; DEC-001 fija MongoDB. | GeoJSON con índice 2dsphere y `ancestorIds` materializados. Un motor GIS externo solo como posible exportación (T10). | 1 |
| CTR-TEC-10 | RN-07 §1.4 vs BASE §17 límite | ProCoop calcula en el módulo técnico los proporcionales y créditos de reconexión y cambio de categoría. | TEC publica el hecho con su fecha efectiva; M04/M05 calculan. | 2 |
| CTR-TEC-11 | RN-07 §4 (MikroTik) vs AGR-016 | ProCoop corta directo en MikroTik de forma síncrona, sin trazabilidad del origen. | Comando asíncrono, idempotente, con origen (OT o mora) y reintentos. | 3 |
| CTR-TEC-12 | BASE §73 ("En camino") vs AVL de ProCoop | ProCoop integra AVL o GPS en vivo; BASE pide solo el aviso "En camino". | Aviso de estado sin seguimiento continuo. El GPS de flota queda en M18 (O10). | 2 |
| CTR-TEC-13 | FIC 4 (PMovil con MySQL intermedia) vs AGR-025, CNX §3.7 | La app móvil de ProCoop sincroniza mediante una base MySQL externa. | PWA propia con cola única en IndexedDB y `/sync` por lotes. | 3 + 4 (y deuda técnica) |
| CTR-TEC-14 | RN-07 §3.1 | ProCoop no filtra las factibilidades anuladas al validar un alta. | Las anuladas y vencidas nunca son usables. | 5 corregido (defecto) |
| CTR-TEC-15 | V2 #51 vs BASE §73 | ProCoop hace la encuesta al cerrar en sitio; BASE pide una encuesta posterior e independiente. | En sitio solo se registra la conformidad; la encuesta es posterior y no bloquea. | 2 |
| CTR-TEC-16 | RN-10 (tickets de Sensa) vs M09 | Los tickets del proveedor de red se confundían con la atención al socio. | Son tickets técnicos con el proveedor (consola TEC). La atención al socio queda en M09. | 2 |
| CTR-TEC-17 | DFA (telefonía) vs alcance | La tasación aparece dentro del módulo de telefonía. | TEC importa y atribuye los CDR; M04 tasa. | 1 (asignación de anexos del maestro) |
| CTR-TEC-18 | RN-07 (activa al cerrar la OT) vs BASE §73 | ProCoop activa el servicio al confirmar la OT. | Hito de activación con fecha efectiva configurable (PA-TEC-02). | 2 |
| CTR-TEC-19 | RN-07 §1.6 | La numeración usa `max+1`, con riesgo de duplicados por concurrencia. | Contador atómico por esquema y período. | 4 |
| CTR-TEC-20 | RN-07 §1.10 | ProCoop borra físicamente las OT y revierte efectos a mano. | Anulación con compensación y sin borrado físico. | 3 (AGR-003) |
| CTR-TEC-21 | RN-07 §5 | Conviven dos modelos de red (v1 `NIV_*` y v2 `REDES_*`). | Un solo modelo (v2 generalizado); v1 se migra. | 5 + 4 |
| CTR-TEC-22 | BASE §18 ("simulación") vs RN-07 | BASE habla de simular impactos; ProCoop no tiene cálculo eléctrico. | Análisis topológico de impacto sin cálculo eléctrico (PA-TEC-11). | 2 interpretado |
| CTR-TEC-23 | RN-07 §1.8 | Los materiales no tienen entidad propia (son movimientos de stock sueltos). | Entidad `workOrderMaterials` con ciclo de vida propio. | 4 |
| CTR-TEC-24 | RN-10 (Sitsa) | Sitsa identifica al cliente por cuenta y no por servicio. | El conector mapea cuenta ↔ contrato; TEC opera por contrato. | 5 adaptado |
| CTR-TEC-25 | RN-07 §4 (Discar) | La respuesta "operación cancelada por el usuario" se trata como éxito. | Se mapea a `failed`; el éxito solo es explícito. | 5 corregido (defecto) |
| CTR-TEC-26 | RN-08 / RN-07 (informe de costos) | El informe de costo de OT sobrescribe los parámetros #2722 y #2723. | Tarifas con vigencia; los informes solo leen. | 5 corregido (defecto) |
| CTR-TEC-27 | CAT `RESPONSA.PAS_RES` | Los responsables tienen contraseñas propias guardadas en la tabla. | Identidad única en IAM (T01/T02); no se migran contraseñas. | 1 + deuda de seguridad |
| CTR-TEC-28 | CAT `TAREAS` vs `TAREASOM` | Hay dos catálogos de tareas superpuestos. | Catálogo único con grupos. | 4 |
| CTR-TEC-29 | CAT `MIKROTIK`, `INTERNET`, `CORREOSINT`, `TELEMEDICION` | Credenciales guardadas en claro. | Bóveda por tenant con `credentialRef`. | 1 (DEC-001) + deuda de seguridad |
| CTR-TEC-30 | CAT `CENTRALT` vs `TEL_CENTRAL` | Hay dos tablas de centrales telefónicas. | `phoneExchanges` única. | 4 |
| CTR-TEC-31 | CAT `RECLAMOS` / RN-07 ("reclamo = OT") vs maestro | En ProCoop el reclamo es a la vez una OT y una tabla propia. | El reclamo es un caso de M09; la OT derivada es de TEC. | 1 (asignación) + 2 |
| CTR-TEC-32 | RN-07 §5.4 | Hay 10 exportadores GIS con códigos fijos por cooperativa. | Plantillas de exportación configurables por tenant. | 4 + deuda técnica |
| CTR-TEC-33 | DFA M14 vs V2 #388 | DFA pide factibilidad obligatoria; ProCoop la tiene como opcional. | Configurable por servicio y operación, obligatoria por defecto en Internet (PA-TEC-04). | 5 (DFA y V2 son benchmark; decide el solicitante) |
| CTR-TEC-34 | FIC 10 (Bing, Google Earth) vs BASE §77 | ProCoop usa mapas de Bing y exportaciones a Google Earth. | Google Maps con el proveedor abstraído (PA-TEC-12); exportación KML opcional. | 2 |

## 21. Preguntas abiertas

### PA-TEC-01 — Doble paso "ejecutada" y "confirmada"
- **Pregunta:** ¿Las OT deben pasar por dos pasos de cierre (el técnico la ejecuta y un supervisor la confirma) o alcanza con uno?
- **Contexto:** ProCoop distingue estados según la cooperativa (RN-07 §11.1). El doble paso agrega control, pero también demora.
- **Opciones:**
  - A) Configurable por tipo de operación, con doble paso por defecto en altas, desconexiones, reconexiones y cambios de medidor **(Recomendada)**: control donde hay efectos sobre el contrato y agilidad en el resto.
  - B) Doble paso siempre: más control y más trabajo para los supervisores.
  - C) Un solo paso siempre: más rápido, pero sin revisión.
- **Impacto si no se responde:** se asume A (PRM-TEC-132).
- **Bloquea:** RF-TEC-035 a 038, §8.4, O3.
- **Estado:** Respondida (DEC-039): opción A.

### PA-TEC-02 — Hito de activación del servicio
- **Pregunta:** ¿Qué hecho fija la fecha desde la que el contrato queda activo (y se empieza a facturar)?
- **Contexto:** BASE §73 pide una fecha efectiva confirmada. ProCoop activa al cerrar la OT (CTR-TEC-18).
- **Opciones:**
  - A) Instalación probada más aprovisionamiento confirmado **(Recomendada)**: el socio paga desde que tiene servicio real.
  - B) Solo la instalación probada: más simple, pero puede facturar sin servicio si falla el aprovisionamiento.
  - C) Instalación, aprovisionamiento y revisión del supervisor: más control, con demora en la facturación.
- **Impacto si no se responde:** se asume A (PRM-TEC-138).
- **Bloquea:** RF-TEC-085 a 101, RN-TEC-064, EVT-TEC-16, O3 y O4.
- **Estado:** Respondida (DEC-033, PA-CAT-16 de M02): opción A; la revisión del supervisor es posterior y no demora la activación.

### PA-TEC-03 — Facturación de materiales usados en la OT
- **Pregunta:** ¿Los materiales usados en una OT se le facturan al socio?
- **Contexto:** ProCoop permite facturar materiales con precio editable (V2 #443/#448). BASE §78 dice que el costo del equipo no se convierte automáticamente en un cargo.
- **Opciones:**
  - A) No por defecto; solo si lo define una regla de la operación o un presupuesto aceptado **(Recomendada)**: evita cobros no pactados.
  - B) Sí, todos los materiales marcados como facturables.
  - C) Nunca: todo cobro va por presupuesto de M11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-064 a 072, EVT-TEC-10.

### PA-TEC-04 — Factibilidad obligatoria
- **Pregunta:** ¿La factibilidad es obligatoria para dar un alta?
- **Contexto:** DFA la pide siempre; ProCoop la tiene como opcional (V2 #388, CTR-TEC-33).
- **Opciones:**
  - A) Configurable por servicio y operación, obligatoria por defecto en Internet y en servicios con red **(Recomendada)**.
  - B) Obligatoria siempre: más control, pero frena altas simples (por ejemplo, servicios sociales).
  - C) Opcional siempre.
- **Impacto si no se responde:** se asume A (PRM-TEC-024).
- **Bloquea:** RF-TEC-001 a 017, O3.
- **Estado:** Respondida (DEC-040): opción A; valores por servicio en PRM-TEC-024 (HUE-SRV-07).

### PA-TEC-05 — Vigencia de la factibilidad
- **Pregunta:** ¿Por cuánto tiempo vale una factibilidad favorable para dar el alta?
- **Contexto:** ProCoop usa 90 días fijos. La capacidad de la red cambia con el tiempo.
- **Opciones:**
  - A) Parámetro por servicio, con 90 días por defecto **(Recomendada)**.
  - B) 90 días fijos para todos los servicios.
  - C) Sin vencimiento.
- **Impacto si no se responde:** se asume A (PRM-TEC-130).
- **Bloquea:** RN-TEC-001.

### PA-TEC-06 — Costo de la visita fallida
- **Pregunta:** ¿Se le cobra al socio una visita fallida por causas atribuibles a él (por ejemplo, ausencia)?
- **Contexto:** BASE §73 menciona la visita fallida, pero no define el cargo.
- **Opciones:**
  - A) Sin costo por defecto, con una regla configurable por tipo de visita **(Recomendada)**.
  - B) Siempre se cobra a partir de la segunda visita fallida.
  - C) Nunca se cobra.
- **Impacto si no se responde:** se asume A (PRM-TEC-146).
- **Bloquea:** EVT-TEC-14, CU-TEC-01.

### PA-TEC-07 — Mecanismo de la firma de conformidad
- **Pregunta:** ¿Qué validez debe tener la firma de conformidad en el domicilio?
- **Contexto:** BASE §73 pide la conformidad; ProCoop captura una firma en el colector (V2 #50).
- **Opciones:**
  - A) Firma manuscrita en pantalla + identificación del receptor (nombre y documento) + hash del documento, con fecha y hora **(Recomendada)**: suficiente como evidencia operativa.
  - B) Firma con validación por código enviado al teléfono del titular: más fuerte, pero depende de cobertura.
  - C) Solo una foto del remito firmado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-085 a 101, `serviceConformities`.

### PA-TEC-08 — Umbral de insatisfacción
- **Pregunta:** ¿Desde qué puntaje de la encuesta post instalación se abre un seguimiento?
- **Contexto:** BASE §73 incorpora la encuesta al tablero, pero no define la acción.
- **Opciones:**
  - A) Un puntaje de 2 o menos (en escala de 1 a 5) crea un caso de seguimiento en M09 **(Recomendada)**.
  - B) Un puntaje de 3 o menos.
  - C) Solo se informa en el tablero, sin seguimiento.
- **Impacto si no se responde:** se asume A (PRM-TEC-137).
- **Bloquea:** EVT-TEC-17, REP-TEC-13.

### PA-TEC-09 — Modo de aprovisionamiento
- **Pregunta:** ¿El aprovisionamiento en los sistemas de red debe ser automático o manual?
- **Contexto:** ProCoop combina corte directo y acciones manuales. AGR-016 pide reintentos y trazabilidad.
- **Opciones:**
  - A) Automático y asíncrono, con respaldo manual cuando se agotan los reintentos **(Recomendada)**.
  - B) Solo manual, con una tarea para el NOC.
  - C) Automático sin respaldo manual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-182 a 196, §9.9, O3.
- **Estado:** Respondida (DEC-041): opción A.

### PA-TEC-10 — Sistemas de red del piloto
- **Pregunta:** ¿Qué sistemas de red deben estar integrados para el piloto de Internet (O3)?
- **Contexto:** ProCoop integra MikroTik, Wispro, Radius, SmartOlt, Ispfull, Sensa, Sopnet y Sitsa. Integrar todos en O3 no es viable.
- **Opciones:**
  - A) MikroTik + Radius + SmartOLT en O3 y el resto por demanda de las cooperativas a migrar **(Recomendada)**.
  - B) Solo MikroTik en O3.
  - C) Todos en O3.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §13, O3.
- **Estado:** Respondida (DEC-042): opción A.

### PA-TEC-11 — Alcance del análisis de red
- **Pregunta:** ¿El análisis de red debe incluir cálculo eléctrico (caídas de tensión, cargas) o solo topología e impacto?
- **Contexto:** BASE §18 habla de "simulación"; ProCoop no tiene cálculo eléctrico (CTR-TEC-22).
- **Opciones:**
  - A) Topología e impacto (qué contratos quedan afectados), sin cálculo eléctrico **(Recomendada)**.
  - B) Incluir cálculo eléctrico básico.
  - C) Integrarse con un software eléctrico externo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-148 a 163, O7.

### PA-TEC-12 — Mapa base
- **Pregunta:** ¿Qué proveedor de mapas se usa?
- **Contexto:** BASE §77 nombra Google Maps. ProCoop usa Bing y Google Earth (CTR-TEC-34). Google Maps tiene costo por uso.
- **Opciones:**
  - A) Google Maps con el proveedor abstraído, para poder cambiarlo más adelante **(Recomendada)**.
  - B) OpenStreetMap, sin costo de licencia.
  - C) Google Maps sin abstracción.
- **Impacto si no se responde:** se asume A (PRM-TEC-149).
- **Bloquea:** RF-TEC-215 a 223.

### PA-TEC-13 — Formatos de CDR prioritarios
- **Pregunta:** ¿Qué formatos de CDR se implementan primero?
- **Contexto:** ProCoop tiene lectores para más de 20 centrales. Implementarlos todos de una vez es costoso.
- **Opciones:**
  - A) Los formatos de las cooperativas que se migran primero, con lectores como plugins **(Recomendada)**.
  - B) Todos los formatos en O10.
  - C) Solo un formato estándar (CSV) y conversión fuera del sistema.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-197 a 214, O10.

### PA-TEC-14 — Telefonía móvil (Claro y Personal)
- **Pregunta:** ¿Cómo se integran los consumos de telefonía móvil?
- **Contexto:** MER-017 los incluye; ProCoop tiene configuración propia para Personal (V2 #301).
- **Opciones:**
  - A) Importador configurable por operadora en O10 **(Recomendada)**.
  - B) Integración por API con cada operadora.
  - C) Fuera de alcance.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PAN-TEC-46, EVT-TEC-28.

### PA-TEC-15 — Procedimiento de recupero por fraude
- **Pregunta:** ¿Cómo se define el procedimiento de recupero de consumo no registrado?
- **Contexto:** MER-004 pide el debido proceso; la normativa varía según el regulador.
- **Opciones:**
  - A) Flujo configurable con aprobación obligatoria por un rol distinto del inspector y método de cálculo versionado **(Recomendada)**.
  - B) Flujo fijo según una normativa de referencia.
  - C) Solo registro de la inspección, con el recupero fuera del sistema.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-176 a 181, RN-TEC-094, O7.

### PA-TEC-16 — Criterio de prorrateo de la contribución por mejoras
- **Pregunta:** ¿Con qué criterio se reparte el costo de una obra entre los beneficiarios?
- **Contexto:** MER-009 lo deja abierto; cada ordenanza puede definir uno distinto.
- **Opciones:**
  - A) Metros de frente por defecto, con el criterio configurable por obra (superficie, partes iguales, valuación) **(Recomendada)**.
  - B) Siempre en partes iguales.
  - C) Importe cargado a mano por beneficiario.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-168 a 175, §9.10.

### PA-TEC-17 — Responsable de resolver conflictos de sincronización
- **Pregunta:** ¿Quién resuelve los conflictos entre lo hecho en campo y lo cambiado en la administración?
- **Contexto:** AGR-025 exige un responsable definido.
- **Opciones:**
  - A) El supervisor de la zona o cuadrilla, con escalamiento al administrador técnico al vencer el plazo **(Recomendada)**.
  - B) Siempre el administrador técnico.
  - C) Quien haya hecho el cambio en la administración.
- **Impacto si no se responde:** se asume A (PRM-TEC-139).
- **Bloquea:** RN-TEC-068, PAN-TEC-24.

### PA-TEC-18 — Retención de evidencias de campo
- **Pregunta:** ¿Cuánto tiempo se guardan las fotos y firmas de las OT?
- **Contexto:** Las evidencias ocupan espacio y pueden tener datos personales. T11 define la retención documental.
- **Opciones:**
  - A) 10 años para conformidades e inspecciones; 2 años para el resto de las fotos operativas, configurable por tenant **(Recomendada)**.
  - B) Todo por 10 años.
  - C) Según la política general de T11, sin distinción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** `fieldEvidence`, T11.

### PA-TEC-19 — Portabilidad numérica en telefonía (HUE-TEL-05)
- **Pregunta:** ¿CoopApps debe gestionar la portabilidad numérica de las líneas telefónicas de la cooperativa?
- **Contexto:** La portabilidad solo es posible para cooperativas que tienen numeración asignada como prestador. La mayoría revende servicio o no opera telefonía, y el proceso regulatorio de portabilidad (administrador de la base, ventanas, plazos) no está relevado en ProCoop. El campo `portId` de EVT-TEC-31 ya estaba previsto sin proceso que lo alimentara.
- **Opciones:**
  - A) "No aplica" por defecto; la portabilidad queda como operación técnica con estados (solicitada, presentada, aceptada, programada, ejecutada, rechazada, cancelada), habilitable por tenant con numeración propia mediante PRM-TEC-156 (RF-TEC-234, `numberPortings`, PAN-TEC-63, API-TEC-53) **(Recomendada)**.
  - B) Portabilidad completa desde O10: integración con el administrador de la base de portabilidad, ventanas automáticas y conciliación (requiere una ficha nueva en T06).
- **Impacto si no se responde:** se asume A; PRM-TEC-156 = false y las pantallas no se muestran.
- **Bloquea:** RF-TEC-234; EVT-TEC-31 (`portId`).
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante.

### PA-TEC-20 — Controles de calidad del agua (HUE-AG-01)
- **Pregunta:** ¿La cooperativa registra en CoopApps los controles de calidad del agua (muestras, análisis de laboratorio y resultados) o los lleva en un sistema externo?
- **Contexto:** Las concesiones de agua potable exigen controles periódicos de calidad e informes al regulador. ProCoop no tiene funcionalidad específica. Sin registro en el sistema, el informe regulatorio debe armarse fuera de CoopApps.
- **Opciones:**
  - A) Controles en M10: punto de muestreo, plan, muestra, análisis, resultado por parámetro con límite, laboratorio con protocolo como documento T11 y acciones correctivas; el informe al regulador se emite por M06 con el código REP-BIA-024 de T10. Habilitable por servicio o concesión con PRM-TEC-157 (RF-TEC-235, RF-TEC-236, PAN-TEC-64, API-TEC-54, EVT-TEC-37, REP-TEC-29) **(Recomendada)**.
  - B) "No aplica": la calidad del agua se gestiona en un sistema externo y CoopApps solo adjunta el informe del laboratorio como documento.
- **Impacto si no se responde:** se asume A con PRM-TEC-157 = false hasta que el tenant lo active.
- **Bloquea:** RF-TEC-235, RF-TEC-236; REP-BIA-020 (sección de calidad), REP-BIA-024.
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante.

### PA-TEC-21 — Vocabulario de capabilities de M10 (PA 4 y 7 del pendiente de cierre)
- **Pregunta:** ¿Las capabilities de M10 con acción en inglés (`tec.workOrder.read`, `tec.network.manage`, `tec.schedule.configure`…) se mantienen como excepción o se renombran al español?
- **Contexto:** la guía §62 fija acciones en español. T02 §4.4.3 lista los nombres de M10 fuera de convención con su canónica propuesta y, hasta que se corrijan, el chequeo de permisos no los reconoce. El §4 de este anexo usaba además un vocabulario propio (`tec.ot.*`, `tec.factibilidades.*`) que T02 no registra.
- **Opciones:**
  - A) Renombrar al español con la canónica de T02 (`tec.ordenes.ver/editar/cerrar`, `tec.serviceTechnical.ver/editar`, `tec.redes.*`, `tec.agenda.*`…) y conservar el nombre anterior como alias "antes `x`" en cada celda **(Recomendada)**.
  - B) Mantener los nombres en inglés como excepción registrada en T02.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §4, §10, §11 y ESC-TEC-24; catálogo de T02 §4.4.
- **Estado:** Asumida la recomendada (DEC-072). Aplicada en la corrección de cierre del 05-11-2026. El pendiente proponía `tec.ot.*` y `tec.servicioTecnico.*`; se usan `tec.ordenes.*` y `tec.serviceTechnical.*` porque son los nombres que registra T02. T02 debe registrar `tec.materiales.autorizar`, `tec.materiales.solicitar`, `tec.conflictos.resolver`, `tec.guardias.gestionar` y `tec.calidadAgua.gestionar` (reemplazan a `tec.material.authorize`, `tec.material.request`, `tec.syncConflict.resolve`, `tec.onCall.manage` y `tec.waterQuality.manage`, que T02 registraba con acción en inglés). Barrido final de T02 (§4.4.1 y §4.4.3): T02 fijó como canónicas `tec.servicioTecnico.*` (antes en este anexo `tec.serviceTechnical.*`), `tec.estimaciones.gestionar`, `tec.despacho.gestionar`, `tec.cuadrillas.gestionar`, `tec.formulariosCampo.gestionar`, `tec.equiposRed.gestionar`, `tec.contribucionesObra.gestionar`, `tec.dispositivos.gestionar`, `tec.perfilTecnico.verSecretos` y las acciones de campo `tec.campo.marcarEnCamino`, `tec.campo.registrarConformidad`, `tec.campo.registrarMateriales`, `tec.campo.crearOrden`; se renombraron en §4 y §10–§11 con "antes". Los comandos (`tec.workOrder.create`) no son capabilities y no cambian.

### PA-TEC-22 — Estados de `technicalProcedures` (PA 8 del pendiente de cierre)
- **Pregunta:** ¿El expediente técnico (`EXPEDIENTES`, `EXPEDIENTES_TRAM`) tiene máquina de estados propia o solo un código de estado libre?
- **Contexto:** el §7.11 declaraba `status` sin valores y el §8 no tenía su máquina; las etapas (`stages[]`) ya registran presentación y resolución.
- **Opciones:**
  - A) Máquina propia con `open`, `inReview`, `observed`, `approved`, `rejected` y `cancelled` (§8.15), dirigida por la resolución de cada etapa **(Recomendada)**.
  - B) Sin máquina: `status` como texto libre migrado de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.11, §8.15; migración de `EXPEDIENTES` (§19).
- **Estado:** Asumida la recomendada (DEC-072). T05 (COL-TEC-17) toma los valores de §8.15.

### PA-TEC-23 — Residuales de los entregables: referencias, estados, rutas de API, comando de OT y alias (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M10 (§7.23), qué valores y transiciones tienen las colecciones excluidas o sin estado inicial explícito, cómo se alinean los grupos de método de API-TEC-26, 29, 39, 40 y 47 con sus rutas, qué nombre tiene el comando con que M09 pide una OT y cómo se nombra el evento `int.cdr.batch-received`?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M10-TEC-tecnica-campo-redes-parte2.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 08, 11) y de `18-openapi/_inconsistencias.md` (grupos de método). El comando `tec.workOrder.create` coincidía con un alias de la capability `tec.ordenes.crear` de T02.
- **Opciones**: A) **(Recomendada)** Destinos de §7.23, máquinas de §8.16, un grupo de método por ruta en el mismo orden, comando `tec.workOrder.request` (el que M09 ya emite y paralelo a `tec.feasibility.request`) y evento `int.cdr.batchReceived` (regla de guiones a camelCase; alias `int.cdr.batch-received`). B) Mantener `[VERIFICAR]`, los grupos de método anteriores y `tec.workOrder.create`.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER, diagramas de estados y contrato OpenAPI de M10; T05 COL-TEC-12, 14, 15, 20, 21, 22, 28 y 42 y §7.2.1; alias de T11 §12.4.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §2, §5 (RF-TEC-233), §7.1 a §7.12, §7.22, §7.23, §8.16, §9.11.1, §11 y §12. T05 debe reflejar las equivalencias de §7.23 y en §7.2.1 `prospect`, `cancelReason`, `entityType`, `casPackageIds` y `fieldDevices.deviceId` como "no es referencia". T11 debe registrar el alias `int.cdr.batch-received` → `int.cdr.batchReceived` en §12.4 y el comando `tec.workOrder.request` en el payload de EVT-CRM-13. También se cierran en §7.22 las referencias restantes: `debitAccountId`/`creditAccountId` → M15 `ledgerAccounts`, `serviceId`/`serviceIds` → M02 `tenantServices`, `connectionEstimates.templateId` → T11 `documentTemplates`, `syncMutations.deviceId` → M10 `fieldDevices`, `ancestorIds` → M10 `networkElements`, `supersedesSampleResultId` → M10 `waterSamples` y los `entityId` polimórficos de `technicalNotes` y `syncMutations`.


## 22. Trazabilidad de fuentes

### 22.1 BASE

| Fuente | Destino en este anexo |
|---|---|
| §17 Técnica y OT (objetivo, límite, alcance, CU-17, precarga) | §1, §2.2; RF-TEC-022 a 063, 085 a 101; RN-TEC-058; CU-17; §18 (OT-001, CUA-01) |
| §18 Mantenimiento, infraestructura y mapas (CU-18) | RF-TEC-138 a 163; RN-TEC-085; §9.6, §9.7; CU-18; CTR-TEC-22; PA-TEC-11; §18 (VAL-001) |
| §50 AUT-003, AUT-004, agenda y visitas, CU-AUT-01 | RF-TEC-073 a 084; RN-TEC-055 a 058; §8.2, §8.3; PAN-TEC-11, 12, 57, 58; CU-AUT-01; ESC-TEC-05 a 07 |
| §73 Instalación integral INS-001 a INS-007 (tabla de stock, firma, encuesta, parámetros, CU-INS-01, controles) | RF-TEC-085 a 101; RN-TEC-059 a 065; §7.6; §8.5; §9.1; CU-INS-01; CTR-TEC-15, 18; PA-TEC-02, 07, 08 |
| §74 Pendientes de instalación | §21 (PA-TEC-02, 06, 07, 08) |
| §77 Geolocalización GEO-001 a GEO-003 (operativo), CU-GEO-01 | RF-TEC-215 a 223; RN-TEC-059, 106, 107; PAN-TEC-48; CU-GEO-01; PA-TEC-12 |
| §79 Fuentes geográficas GEO-F1 a GEO-F6 | §13 (Google Maps; Georef en T04/T06); PRM-TEC-149 |
| §80 Pendientes geográficos | PA-TEC-12; §2.3 (T04, M01) |
| §86 Particularidades de Internet | RF-TEC-164 a 167, 182 a 196; RN-TEC-076 a 078; §13; PA-TEC-09, 10 |
| §37 (glosario y entidades técnicas) | §3 |
| §98 (matriz de módulos) | Encabezado (olas); §2.3 |
| §101 (requisitos transversales) | §11 (convenciones), §17 (ESC-TEC-25, 26) |
| §105 (soluciones) | Encabezado |
| §106 Pendientes técnicos | §21 |
| MER-004 Inspecciones y fraude | RF-TEC-176 a 181; RN-TEC-094, 095; §8.12; §9.11; CU-TEC-08; PA-TEC-15 |
| MER-009 Obras y contribución por mejoras | RF-TEC-168 a 175; RN-TEC-093; §8.11; §9.10; CU-TEC-09; PA-TEC-16 |
| MER-015 Flota (referencia) | §2.3 (M18); CTR-TEC-12 |
| MER-017 Telecomunicaciones (Internet, TV, telefonía, móvil) | RF-TEC-182 a 214; RN-TEC-070, 096 a 105, 113; PA-TEC-13, 14 |
| MER-019, MER-020 (referencia) | §2.3 (M13, T09) |

### 22.2 AGR, DFA, FIC, RN-10 y CNX

| Fuente | Destino |
|---|---|
| AGR-003 Transiciones con actor y reversión | §8 completo |
| AGR-010 Fechas efectivas y de registro | §7 (campos comunes); RN-TEC-065, 069 |
| AGR-016 Reintentos e idempotencia en integraciones | RN-TEC-066; §8.9; §9.9; JOB-TEC-04, 06, 11; ESC-TEC-10, 11 |
| AGR-023 Evidencias documentales | `fieldEvidence`, `serviceConformities`; RN-TEC-062; PA-TEC-18 |
| AGR-024 Constancia de notificaciones | §2.3 (T09); EVT-TEC-13, 23 |
| AGR-025 App de campo offline única | RF-TEC-112 a 131; RN-TEC-055, 067, 068; §9.4; PAN-TEC-50 a 56, 60; PA-TEC-17 |
| AGR-026 Aplicación única del stock | RN-TEC-060; §2.3 (M13); ESC-TEC-29 |
| ESC-01, ESC-02 | No aplican a M10 (escenarios de facturación y cobranza) |
| ESC-03 Conflicto offline | §9.4; CU-TEC-02; ESC-TEC-08 |
| ESC-04 Restauración y reintentos | §8.9; JOB-TEC-11; ESC-TEC-11 |
| DFA M14 (técnica y OT) | RF-TEC-001 a 147; CTR-TEC-01, 03, 33 |
| DFA M15 (redes y equipos) | RF-TEC-148 a 167; CTR-TEC-04 a 06 |
| DFA telefonía e Internet (M26) | RF-TEC-182 a 214; CTR-TEC-17 |
| DFA M27 | RF-TEC-224 a 230 (informes y otros) |
| DFA §31 proceso 1 (alta de suministro) | §9.1 |
| FIC 4 (PMovil) | RF-TEC-112 a 131; CTR-TEC-13 |
| FIC 9 (telemedición y aprovisionamiento) | RF-TEC-182 a 196; §13 |
| FIC 10 (mapas y GIS) | RF-TEC-148 a 163, 215 a 223; CTR-TEC-34 |
| FIC 14.1, 14.2, 15, 16, 17 | §5.3, §5.11, §5.15, §5.16; §13 |
| RN-10 §3.6 a §11 (integraciones externas: MikroTik, Wispro, Radius, SmartOlt, Ispfull, Sensa, Sopnet, Sitsa, AION, Discar, Nexo, centrales, mapas) | §13; RN-TEC-073 a 075; CTR-TEC-16, 24, 25 |
| CNX §3.7 Offline | §9.4; API-TEC-42, 43 |
| CNX §3.8 PWA | §10.2 |
| CNX §4.1 a §4.4 Admin | §10.1 |
| CNX §7.7, §7.8 Relevamientos (`FieldForm`, `FieldAssignment`, `FieldSubmission`) | `fieldForms`; PAN-TEC-26; RF-TEC-112 a 131 |

### 22.3 RN-07 (técnica, reclamos, GIS y telefonía)

| Sección | Destino |
|---|---|
| §0 Mapa de fuentes | Encabezado |
| §1.1 Concepto y tipos | RF-TEC-022; RN-TEC-009; CTR-TEC-08 |
| §1.2 Operaciones (`TRANSAC`) | `workOrderOperationTypes`; PAN-TEC-17; RN-TEC-024 a 027 |
| §1.3 Estados y circuito | §8.4; RN-TEC-010, 038; CTR-TEC-07 |
| §1.4 Efectos del cierre | RN-TEC-024 a 031; §9.2; CTR-TEC-10 |
| §1.5 Órdenes encadenadas (`ALTASEAU`) | `chainedOrderRules`; RN-TEC-034, 035; PAN-TEC-23 |
| §1.6 Numeración visible | RN-TEC-032, 033; PRM-TEC-022; CTR-TEC-19 |
| §1.7 Asignación (responsables, cuadrillas, móviles, captores) | RF-TEC-102 a 111; RN-TEC-049 a 054 |
| §1.8 Materiales e impacto en stock | RF-TEC-064 a 072; RN-TEC-044 a 047; CTR-TEC-01, 23 |
| §1.9 Cargos asociados (`CONEXION`) | RN-TEC-040 a 043; EVT-TEC-10; §2.3 (M04) |
| §1.10, §1.11 Informes técnicos | §15; RN-TEC-089 a 092; CTR-TEC-26 |
| §2 Reclamos | M09 (CTR-TEC-31); CU-TEC-12; §12.2 |
| §3.1 Factibilidad | RF-TEC-001 a 017; RN-TEC-001 a 008; §8.1; CTR-TEC-14 |
| §3.2 Conexión nueva | §9.1; RN-TEC-018 |
| §4 Cortes y reconexiones | RF-TEC-132 a 137; RN-TEC-070 a 075; §9.5; CTR-TEC-11, 25 |
| §5.1 Red v1 | RN-TEC-079; PAN-TEC-33; CTR-TEC-21 |
| §5.2 Red genérica v2 | RF-TEC-148 a 163; RN-TEC-079 a 085 |
| §5.3 KML y Google Earth | RN-TEC-087; CTR-TEC-34 |
| §5.4 Exportaciones GIS por cooperativa | RN-TEC-086; `gisExportTemplates`; CTR-TEC-32 |
| §6, §6.1 Tickets y mesa de ayuda | RN-TEC-109 (tickets del proveedor); el resto en M09 |
| §7, §7.1 Actividades internas | RN-TEC-110; M09 |
| §8.1 Abonados, numeración y líneas | RF-TEC-197 a 203; RN-TEC-096 a 098, 113 |
| §8.2 Plan de numeración y claves | RF-TEC-204; RN-TEC-099 |
| §8.3 Importación de CDR | RF-TEC-205 a 212; RN-TEC-100 a 103; §9.8 |
| §8.4 Tasación | M04 (CTR-TEC-17); RN-TEC-104 (identidad de la llamada) |
| §8.5 CPP y CVLP | Importación en RF-TEC-205 a 212; cálculo en M04; PRM-TEC-125 |
| §8.6 Internacionales y larga distancia | Importación en TEC; tasación en M04 |
| §8.7 Interconexión | M04 |
| §8.8 Telefonía móvil Claro/Personal | RF-TEC-213; PA-TEC-14; PAN-TEC-46 |
| §8.9 Mensajería (SMS, WhatsApp, IVR) | T09 (PRM-TEC-119 a 121) |
| §8.10 Tasación y facturación telefónica (segunda pasada) | M04/M05; RN-TEC-105 (recarga prepaga) |
| Reglas adicionales (segunda pasada) | RN-TEC-011 a 049 según el tema |
| §9 Parámetros | §14 |
| §10 Implicancias para CoopApps | §7 (modelo), §20 |
| §11 Dudas abiertas | §21 (PA-TEC-01, 02, 04, 05); §19 (mapeo de `COD_EST`, RN-07 §11.1) |

### 22.4 CAT §10 Técnica, reclamos y obras

| Tabla | Destino | Tabla | Destino |
|---|---|---|---|
| `AVL_REG` | M18 (CTR-TEC-12) | `PROFESIO` | `certifiedInstallers` |
| `CAT_INCI` | `incidentCategories` | `RECLAMOS` | M09 (CTR-TEC-31) |
| `CHOFERES` | M18 | `RECLAMOS_HIST` | M09 |
| `CLAS_INC` | `incidentCategories.classCode` | `RECLAMOS_NOTAS` | M09 |
| `EXPEDIENTES` | `technicalProcedures` | `RESOL_OT` | `resolutionCodes` |
| `EXPEDIENTES_TRAM` | `technicalProcedures.steps` | `RESPONSA` | `fieldResources` + T01 (CTR-TEC-27) |
| `FACTIBIL` | `feasibilityRequests` | `RESPONSA_NOTIFICA` | `responsibleNotificationRules` |
| `FACTIBIL_NOTA` | `technicalNotes` | `RUB_REC` | M09 |
| `FALLAS` | M09 | `TAREAS` | `taskCatalog` (CTR-TEC-28) |
| `GRPOBRA` | `workGroups` | `TAREASOM` | `taskCatalog` |
| `GRPTAREA` | `taskGroups` | `TAROTM` | `workOrders.tasks` |
| `MOVIL` | M18 | `TECNGREXP` | `workOrders.dispatch` |
| `OBRAS` | `works` | `TECNICA` | `workOrders` |
| `OT_REPORTE` | `workOrderPrintTemplates` | `TECNICA_EXTRAS` | `damageAssessments` |
| `PARTICUA` | `crews.members` | `TECNICA_MOVIL` | `workOrders.vehicleIds` (M18) |
| `PARTIINC` | `workOrders.participants` | `TECNICA_NECESIDAD` | `workOrderMaterials` |
| `PARTIORD` | `workOrders.participants` | `TECNICA_NOTA` | `technicalNotes` |
| `TECNOTEXP` | `workOrders.dispatch` | `TECNSEEXP` | `workOrders.dispatch` |
| `TPTRAB` | `workTypes` | `TRANSAC` | `workOrderOperationTypes` |

Tablas de otras secciones citadas: `CONEXION` → M04 (RN-TEC-040); `ALTASEAU` → `chainedOrderRules`; `VIAINGTE` → `crmChannels` de M09 (CTR-DAT-77); `ESTASER`, `OBSESTAD`, `SERVICIO_EXTRAS`, `SERSOC_EXTRAS` → estado y datos del contrato (M02) leídos por RN-TEC-025/026; `ITEMSORD` → M05 (CTR-TEC-01); `PROD_TRH` → precio de referencia del producto (M02/M13); `RETI_MAT`, `UBICACIONES` → M13 (CTR-TEC-06); `CAT_INCI_CTSEC`, `CTSECCION` → `incidentCategories.sectionAllocations` y M15; `MAPA` → punto de prestación (M01); `EQUIPOS` → agente de hardware local en T06 (CTR-TEC-04); `MODEMS` → T09 (CTR-TEC-05); `SERVINT` → `provisioningProfiles`; `CUADRI` → `crews` (CTR-TEC-02); `TELEMEDICION`, `TELEMED_COMM` → `provisioningSystems` y M03; `PRESUPU` → M11 con `connectionEstimates`.

### 22.5 CAT §11 Redes (GIS)

| Tabla | Destino |
|---|---|
| `NIV_CAPA`, `NIV_REDES`, `NIV_SERV` | Red v2 (CTR-TEC-21) |
| `REDES` | `networks` |
| `REDES_ATRIBUTOS` | `networkElements.attributes` |
| `REDES_ATRIBUTOS_COMPONENTES` | `networkAttributeDefs` |
| `REDES_CAPAS` | `networkLayers` |
| `REDES_COMPONENTES` | `networkComponentTypes` |
| `REDES_RED_INSTALADA` | `networkElements` |
| `REDES_RELACIONES_COMPONENTES` | `networkComponentRelations` |
| `REDES_SERVICIOS` | `networks.serviceTypes` |
| `SERSOC_REDES` | `serviceNetworkConnections` |

### 22.6 CAT §12 Telefonía e Internet

| Tabla | Destino | Tabla | Destino |
|---|---|---|---|
| `BANCLA` | M04 | `TARCLA` | M04 |
| `BANDAS` | M04 | `TARESP` | M04 |
| `CARACTER` | `numberingPlan` | `TARTEL` | M04 |
| `CENTRALT` | `phoneExchanges` (CTR-TEC-30) | `TEL_CAJAS` | `phoneBoxes` |
| `CLAVES` | M04 (la clave queda como dato del CDR) | `TEL_CENTRAL` | `phoneExchanges` |
| `CORREOSINT` | `providedMailboxes` | `TEL_DSLAM` | `dslams` |
| `ENTRANTE` | `callRecords` (`incoming`) | `TEL_FRACCIONES` | M04 |
| `GRATIS` | M04 | `TEL_GRUPOS_REPARTIDOR` | `phoneFrameGroups` |
| `INTERNAC` | `callRecords` (`international`) | `TEL_MODALIDAD` | `telecomModalities` |
| `INTERNET` | `serviceTechnicalProfiles` | `TEL_NUMEROS` | `phoneNumbers` |
| `LLAMADAS` | `callRecords` | `TEL_POS_REG_CAJA` | `phoneStripPositions` |
| `LLA_CEL` | `callRecords` (`cpp`) | `TEL_POS_REG_GRUPOS` | `phoneStripPositions` |
| `MIKROTIK` | `networkDevices` + bóveda | `TEL_PREFIJO` | `phonePrefixes` |
| `OPERADOR` | `telecomOperators` (CTR-TEC-03) | `TEL_PUERTOS_CENTRAL` | `phonePorts` |
| `PLANDES` | M04 | `TEL_PUERTOS_DSLAM` | `phonePorts` |
| `RECHAZOS` | `callRecords.rejected` | `TEL_REGLETAS_CAJAS` | `phoneStrips` |
| `SERTEL` | M04 | `TEL_REGLETAS_GRUPOS` | `phoneStrips` |
| `TEL_REPARTIDOR` | `phoneFrames` | `TEL_SERSOC` | `phoneLines` |
| `TEL_SERVICIO` | `telecomServiceTypes` | `TIPOBAN` | M04 |
| `TIPOLLAM` | M04 (el tipo queda como dato del CDR) | | |

### 22.7 Parámetros RN-09

- **TECNICA (95):** cada número V2 tiene su fila en §14.1. #2→PRM-TEC-001, #10→002, #11→003, #16→004, #33→005, #48→006, #50→007, #51→008, #53→009, #54→010, #57→011, #58→012, #62→013, #64→014, #70→015, #174→016, #180→017, #254→018, #333→019, #341→020, #342→021, #344→022, #358→023, #388→024, #401→025, #430→026, #441→027, #443→028, #448→029, #460→030, #465→031, #474→032, #497→033, #752→034, #911→035, #2084→036, #2268→037, #2339→038, #2354→039, #2370→040, #2393→041, #2399→042, #2421→043, #2422→044, #2425→045, #2439→046, #2440→047, #2470→048, #2474→049, #2480→050, #2483→051, #2485→052, #2491→053, #2505→054, #2531→055, #2570→056, #2587→057, #2625→058, #2627→059, #2629→060, #2637→061, #2638→062, #2652→063, #2654→064, #2655→065, #2657→066, #2661→067, #2667→068, #2694→069, #2722→070, #2723→071, #2808→072, #2811→073, #2819→074, #2891→075, #2897→076, #2899→077, #2907→078, #2913→079, #2933→080, #2997→081, #2998→082, #3031→083, #3034→084, #3035→085, #3082→086, #3084→087, #3085→088, #3086→089, #3120→090, #3165→091, #3173→092, #3175→093, #3189→094, #3201→095.
- **TELEFONIA (16):** #13→096, #18→097, #62→098, #64→099, #82→100, #236→101, #238→102, #301→103, #332→104, #471→105, #2099→106, #2295→107, #2302→108, #2344→109, #2346→110, #2444→111.
- **Otros consumidos:** TELEMED #30→112; #65→113; #2301→114; #2330→115; #2753→116; #2755→117; #3111→118; #3088→119; #3105→120; #2693→121; #2823→122; #2251→123; #2027 a #2029→124; CVLP (#19, #24, #70, #79, #353, #543)→125; #2253→126; mensajería y conectores (#518, #519, #2824, #3051, #3121, #2870, #2873, #2874)→127; reclamos y seguridad (#681, #2488, #210)→128.
- **Resto de TELEMED (45):** son de M03 (medición y telemedición); TEC solo consume el resultado de los comandos (RF-TEC-196).

### 22.8 INV `ProMod_Tecnica` (61 tipos en `Forms`: 58 formularios y 3 enums; más `frmTecnica_CambioEstadoMasivo`, 3 controles y enums globales)

| Formulario | Destino | Formulario | Destino |
|---|---|---|---|
| `abm_Cat_Insi` | PAN-TEC-19 | `frmInformesFactibilidad` | PAN-TEC-47 (REP-TEC-12) |
| `abm_Cuadri` | PAN-TEC-13 | `frmInformesTecnica` | PAN-TEC-47 |
| `abm_Cuadri_Particua` | PAN-TEC-13 | `frmInformes_Preview` | PAN-TEC-04 (Google Earth reemplazado, CTR-TEC-34) |
| `abm_Factibil_Notas` | PAN-TEC-02 | `frmInformes_Redes` | PAN-TEC-47 (REP-TEC-18) |
| `abm_GrpObra` | PAN-TEC-39 | `frmOT_Especial` | PAN-TEC-06 |
| `abm_Mikrotik` | PAN-TEC-35 | `frmOT_Notificaciones` | PAN-TEC-07 |
| `abm_Niv_Capa` | PAN-TEC-33 → 30 | `frmRedes_RedInstalada` | PAN-TEC-31 |
| `abm_Niv_Redes` | PAN-TEC-33 → 31 | `frmRedes_RedInstalada_Add` | PAN-TEC-31 |
| `abm_Niv_Serv` | PAN-TEC-33 → 30 | `frmRedes_RedInstalada_AddMultiple` | PAN-TEC-31 |
| `abm_Obras` | PAN-TEC-39 | `frmRedes_RedInstalada_ConexionNueva` | PAN-TEC-32 |
| `abm_Redes` | PAN-TEC-30 | `frmRedes_RedInstalada_Conexiones` | PAN-TEC-32 |
| `abm_Redes_Atributos_Componentes` | PAN-TEC-30 | `frmRedes_RedInstalada_EditAtributo` | PAN-TEC-31 |
| `abm_Redes_Capas` | PAN-TEC-30 | `frmRedes_Relaciones` | PAN-TEC-30 |
| `abm_Redes_Componentes` | PAN-TEC-30 | `frmRedes_Relaciones_Add` | PAN-TEC-30 |
| `abm_Resestad` | PAN-TEC-20 | `frmSincronizacionAION` | PAN-TEC-36 |
| `abm_ResolOt` | PAN-TEC-20 | `frmSincronizarCaptor` | PAN-TEC-10 (CTR-TEC-13) |
| `abm_ResponsaNotifica` | PAN-TEC-15 | `frmTecnica_AutorizarNecesidad` | PAN-TEC-09 |
| `abm_TareasOm` | PAN-TEC-21 | `frmTecnica_CambioCategoria` | PAN-TEC-06 |
| `abm_Tecnica` | PAN-TEC-05 | `frmTecnica_CambioEstado` | PAN-TEC-06 |
| `abm_Tecnica_Notas` | PAN-TEC-05 | `frmTecnica_CambioEstadoMasivo` | PAN-TEC-07 |
| `abm_Tecnica_Partiord` | PAN-TEC-05 | `frmTecnica_CambioMedidor` | PAN-TEC-06 |
| `abm_Tecnica_Tareas` | PAN-TEC-05 | `frmTecnica_Desconexion` | PAN-TEC-06 |
| `abm_Tptrab` | PAN-TEC-18 | `frmTecnica_Nexo` | PAN-TEC-38 |
| `abm_Transac` | PAN-TEC-17 | `frmTecnica_Reconexion` | PAN-TEC-06 |
| `frmActualizarGis` | PAN-TEC-34 | `frmTecnica_Translado` | PAN-TEC-06 |
| `frmBajaMasivaOrdenes` | PAN-TEC-08 | `frm_CambiosFactibilidad` | PAN-TEC-02 |
| `frmBajaMasivaOrdenes_Confirmar` | PAN-TEC-08 | `frm_Factibilidad` | PAN-TEC-01, 02 |
| `frmBuscadorFactibilidad` | PAN-TEC-01 | `frmImpresiones` | PAN-TEC-47, REP-TEC-23 |
| `frmCargaRapidaReclamo` | PAN-TEC-49 (reemplazado por PAN-CRM-04 de M09; antes "reemplazado por M09") | `frmDatosInternet` | PAN-TEC-37 |
| `frmConsultar_Vales` | PAN-TEC-09 | | |

Controles: `ComandosDiscar`, `ComandosNexo` y `ComandosTelemedicion` → PAN-TEC-38 y RF-TEC-196. Enums: `EstadoTecnica`, `Estado_AbmTecnica` → §8.4; `Estados_Factibilidad` → §8.1; `OpcionesDesconexion` → `workOrderOperationTypes` (efecto `disconnect` con opciones); `Origen` → `workOrders.origin`; `ModoFormulario` → descartado (mecánica de formularios de escritorio).

### 22.9 Huecos de cobertura corregidos

| Hueco | Destino en este anexo |
|---|---|
| HUE-SRV-04 Pantallas de portal duplicadas con M19 | PAN-TEC-57, 58, 59 como componentes embebidos en PAN-POR-34, 35 y 33; API-TEC-40, 41 sin cambios |
| HUE-SRV-07 Dueño del requisito de factibilidad | RF-TEC-011; RN-TEC-005; PRM-TEC-024 (valores por servicio, CLO explícito) |
| HUE-ELE-04 Certificado de instalador | RF-TEC-106; RN-TEC-114; PRM-TEC-043 |
| HUE-TV-04 Aprovisionamiento de TV | RF-TEC-183, 194; `provisioningProfiles`, `serviceTechnicalProfiles.decoders`; T06 FI-INT-86 |
| HUE-GAS-05 Guardias y emergencias | §5.19 (RF-TEC-231 a 233); RN-TEC-116; §9.11.1; PRM-TEC-152 a 154; PAN-TEC-61, 62; API-TEC-51, 52; EVT-TEC-35, 36; JOB-TEC-17; REP-TEC-30 |
| HUECO-OBR-01 Contratos y cuotas de obra | RF-TEC-173; EVT-TEC-25 (payload y consumidores); §9.10 |
| HUECO-OBR-02 Plan de cuotas frente a convenio | RN-TEC-115; PRM-TEC-155; §9.10 |
| HUE-TEL-05 Portabilidad numérica | RF-TEC-234; `numberPortings`; PRM-TEC-156; PAN-TEC-63; API-TEC-53; PA-TEC-19 |
| HUE-AG-01 Calidad del agua | §5.20 (RF-TEC-235, 236); PRM-TEC-157; PAN-TEC-64; API-TEC-54; EVT-TEC-37; REP-TEC-29; PA-TEC-20 |
| HUE-TEL-02 Detalle de llamadas en el portal | RF-TEC-237; API-TEC-55 (consumida por M19 API-POR-122) |
| HUE-AG-02 Mora de agua con reducción de caudal | RF-TEC-023 (efectos `flowRestriction`, `flowRestore`), RF-TEC-238; §9.5; §12.2 |

### 22.10 Decisiones y modelo de datos

| Fuente | Destino en este anexo |
|---|---|
| DEC-013 Modalidad de equipos | RF-TEC-092; `workOrders.installation.effectiveEquipment` (§7.6) |
| DEC-014 Reconexión al pagar | RF-TEC-134; §12.2 |
| DEC-033 Hecho de activación | PA-TEC-02 (Respondida) |
| DEC-039 Cierre de OT | PA-TEC-01 (Respondida) |
| DEC-040 Factibilidad obligatoria | RF-TEC-011; PRM-TEC-024; PA-TEC-04 (Respondida) |
| DEC-041 Aprovisionamiento | PA-TEC-09 (Respondida) |
| DEC-042 Sistemas de red del piloto | PA-TEC-10 (Respondida) |
| DEC-082 Gas envasado | RF-TEC-239 (OT `bottledGasDelivery`) |
| DEC-084 Correo y pack SMS | RF-TEC-195 |
| DEC-087 Archivo de detalle histórico | `callRecords` (retención); API-TEC-55 |
| DEC-104 punto 2 Destino único de `RESPONSA` (técnicos de campo) | Glosario "Recurso de campo / responsable"; RF-TEC-103; `fieldResources` (§7.13, COL-TEC-24); §19 fila `RESPONSA`; M01 CTR-PER-22 |
| T05 CTR-DAT-15 | `workOrderOperationTypes` (antes `operationTypes`) |
| T05 CTR-DAT-30 (§7.2) | `holderId`, `premiseId`, `serviceId`/`serviceIds`, `crmCaseId`, `inventoryItemId`, `serialUnitId`, `warehouseId`, `credentialRef`, `parameterValues`; §7.21 |
| T05 CTR-DAT-32 | Subdocumento `legacy` en lugar de `legacyRef` (`networkElements`, §19) |
| T05 CTR-DAT-67 | `workBeneficiaries.holderId`; payload de EVT-TEC-25 |
| T05 CTR-DAT-70 | `callRecords.ratingRef` con `phoneRates`/`phoneRatePlans` |
| T05 CTR-DAT-71 | `serviceContracts` de M02 (§2.3 y §7.21) |
| RN-07 §0 Mapa de fuentes | Descartada: metadato de la fuente |
| RN-07 §3.2 Conexión nueva | §9.1; RF-TEC-001 a 017 |
| RN-10 §10 Mapas y GIS | RF-TEC-148 a 163; §13; CTR-TEC-34 |
