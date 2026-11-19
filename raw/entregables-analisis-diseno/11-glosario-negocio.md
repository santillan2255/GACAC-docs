# Glosario de negocio unificado — GoodApps Cooperativas

Artefacto 1.2 del índice de entregables ([`00-INDICE.md`](00-INDICE.md)). Versión 1.0 (05-11-2026). Estado: borrador para revisión.

Unifica en un solo lugar los términos de negocio y del producto que usan la maestra (§20 y demás secciones), el catálogo base del diccionario de T03 (§10.7.1) y los glosarios de la sección 3 de cada anexo. No reemplaza a esas fuentes: ante cualquier diferencia prevalece la especificación (maestra §2.2) y, para nombres de colecciones, el catálogo de T05 §7 (maestra §12).

## Cómo leer este glosario

- **Término**: nombre en español de uso en la especificación. Los textos visibles al usuario no son fijos: cada cooperativa los adapta en su diccionario (principio P3, maestra §1.3; T03 §10.7). Por ejemplo, una cooperativa puede decir "Socio" y otra "Asociado" para el mismo concepto.
- **Sinónimos / término ProCoop**: variantes de vocabulario que admite el diccionario y el nombre o la tabla equivalente en ProCoop, cuando la especificación lo registra.
- **Nombre técnico**: colección canónica de T05 §7 (y campo, si aplica). Si la colección se crea con otro nombre por choque, se indica "se crea como". "—" significa que el término no tiene colección propia.
- **Fuente**: sección de la maestra, anexo (sección 3 salvo indicación) y decisión DEC-xxx que lo respalda.
- Cuando un término tiene **más de un sentido** en la especificación, se aclara en la definición con (1), (2)… y se remite a la fuente de cada uno.
- Orden alfabético sin considerar tildes.

---

## 1. Glosario

| Término | Definición | Sinónimos / término ProCoop | Nombre técnico (T05) | Fuente |
|---|---|---|---|---|
| Activación (capa 2) | Indica qué módulo licenciado está encendido hoy en el tenant y en qué modo (prueba, producción, solo historia). Es el segundo de los cuatro filtros del acceso efectivo. | — | `tenantModuleActivations` | T01; maestra §6, §7.1 |
| Acta | Documento numerado que registra lo tratado y resuelto en una reunión de un órgano o asamblea, con firmantes. Se firma con firma digital (DEC-078). | `ACTAS` | `minutes` | M17; DEC-078 |
| Adherente | (1) Persona incorporada a la cobertura de un contrato de un titular, que cuenta para la categoría o la tarifa (por ejemplo, un familiar en sepelio o salud). M18 es su dueño único. (2) En planes de vivienda, persona inscripta en el plan que integra aportes. | Grupo familiar; `ADHSOC` | `serviceDependents` (sentido 1) | M18; M02; M01; DEC-071 |
| Adhesión (mandato) | Autorización del titular para debitar un medio de pago (CBU o tarjeta) por cuenta o servicio. | Adhesión a débito automático | `directDebitMandates` | M07; M19 |
| Agente local | Programa instalado en una PC de la cooperativa que conecta dispositivos (impresoras fiscales y térmicas, turnero, lectores, balanzas) con GoodApps por un canal saliente. | `Agente Procoop.exe` | `localAgents` | T06; M09; maestra §8 |
| Alcance de datos | Subconjunto de datos sobre el que vale una asignación de rol: tenant, sucursales, puntos de venta, zonas, servicios, cuadrillas, depósitos, cajas, propios. Cuarto filtro del acceso efectivo. | Scope; `USERS_AREA`, `USERS_DEPOSITO`, `PTO_VTA` | `roleAssignments` (alcance) | T02; maestra §7.1 |
| Alias de clave externa | Equivalencia entre una clave de un sistema anterior o de un tercero (código de barras, identificador Red Link o SIRO) y la cuenta o servicio de GoodApps. Permite cobrar facturas de ProCoop hasta su vencimiento. | `FACTURAS.USUARIO` | `externalKeyAliases` (M07); `legacyKeyAliases` (T07) | M07; T07; DEC-050 |
| Alta administrativa / alta técnica | Fecha en que se carga el contrato / fecha efectiva de conexión del servicio. | `ALTA_ADM` / `FEC_ALTA` | `serviceContracts` | M02 |
| Ámbito | (1) Par tenant y contexto (staff, portal, plataforma) que el usuario elige explícitamente y que determina su token. (2) En configuración, nivel al que se asigna un valor de parámetro: plataforma, tenant, sucursal, servicio, categoría o usuario. | — | `memberships` (1); `parameterValues` (2) | T02; T04; M19 |
| Anulación | Baja lógica de un comprobante no autorizado y sin pagos. Los documentos económicos nunca se borran: se anulan o se revierten. | `ESTADO = 'A'`, `ANUFAC` | `invoiceAnnulmentRequests` | M05; maestra §1.3 (P5) |
| Aprovisionamiento | Ejecución en la red (MikroTik, Radius, OLT) de altas, cortes y cambios de plan de servicios TIC mediante un comando durable e idempotente, asíncrono y con respaldo manual. | `TELEMED_COMM` | `provisioningCommands` | M10; T06; DEC-041; DEC-042 |
| Arqueo | Conteo declarado por medio de pago y moneda en una caja, comparado con el teórico; la diferencia genera quebranto. | Datos de cierre | Parte de la sesión de caja (`cashSessions`) | M07 |
| Asamblea | Reunión del órgano máximo de la cooperativa, con padrón, orden del día, votación formal y acta. Distinta de una encuesta de comunidad. | — | `meetings` | M17; T03 |
| Asiento | Registro contable en partida doble con cabecera y renglones; nunca se elimina, se revierte con un contraasiento. | `CTASIEN` + `CTITASIE` | `journalEntries`, `journalLines` | M15; DEC-009 |
| Asociado | Persona física o jurídica con relación institucional vigente con la cooperativa (capital, voto), aprobada por el consejo. M17 es su dueño; M01 solo muestra el vínculo. No equivale a titular. | Socio (variante de diccionario); `SOCIOS.ACTIVO = 1`, `NUM_SOC` | `memberships` de M17, se crea como `associateMemberships` | M17; M01; T03 §10.7.1; maestra §20 |
| Auditoría | Registro inmutable de cambios, accesos, lecturas sensibles, mensajes enviados e invocaciones de IA. | `AUDITORIA`, `AUDITO`, `INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA` | `auditLogs`, `auditAccess`, `auditReads`, `auditMessages`, `auditAi` | T02; maestra §12 |
| Autolectura | Lectura del medidor informada por el socio desde la app, con foto. | — | `meterReadings` (origen autolectura) | M03; M19 |
| Autorización de supervisor | Aprobación puntual y de un solo uso de una acción concreta por un usuario con capability superior, en el momento o diferida. | `AUTORIZACIONES` | `authorizationRequests` | T02; maestra §7.1 |
| Autorizado / representante | Persona habilitada por el titular para acciones concretas sobre su cuenta (consultar, pagar, gestionar), o que actúa por otra (apoderado, representante legal, tutor), con vigencia. | — | `relationships`; acceso en `portalAccountAccess` | M01; M19; T02 |
| Baja | Fin del contrato de servicio. Se distingue la baja administrativa (solicitud o decisión) de la efectiva (desconexión). La baja definitiva no es suspensión ni corte. | `BAJA_ADM` / `FEC_BAJA` | `serviceContracts` | M02; T03 §10.7.1; DEC-057 |
| Banco de sangre por convenio | Cobertura administrativa para obtener sangre o hemocomponentes mediante una red habilitada; sin datos clínicos. | Banco de sangre | `bloodCoverageRequests` | M18; DEC-024 |
| Bandeja de tareas | Bandeja unificada del empleado con tareas, aprobaciones, casos, órdenes y excepciones; la bandeja operativa muestra además eventos y jobs detenidos con impacto de negocio. | `frmAutorizaciones`, `IconoNotificacion` | `workItems`; `operationalInboxItems` | T11; maestra §9.1 |
| Beneficiario | Persona cubierta por una prestación de un contrato (por ejemplo, de sepelio o banco de sangre). No es tarifa social ni beneficio comercial. | `BENSOC` | `serviceBeneficiaries` | M18; DEC-086; DEC-071 |
| Beneficio | (1) En tarifas, reducción del importe con origen: subsidio, tarifa social, bonificación, promoción. (2) En comunidad, ventaja para socios (descuento en comercio adherido, sorteo) con canje. (3) En servicios sociales, prestación efectivamente brindada. | `CONS_BONIF` (1) | `benefitGroups`, `subsidyRegimes`, `promotions` (1); `benefits` (2) | M04; T09; M18 |
| Bloqueo | Restricción tipada con causa, vigencia y mensaje que impide o condiciona operaciones sobre una persona, cuenta o contrato. El bloqueo de cobro o de comprobante impide cobrar un documento. | `NOTA_SUM.BLO_CAJ`, `HISBLOQ`, `CAUBLOQ`, `ID_BLO` | `blocks` (M01); `documentHolds` (M08) | M01; M05; M07; M08 |
| Bóveda de secretos | Almacén cifrado por tenant de credenciales (ARCA, pasarelas, bancos, mensajería), con cifrado por sobre y clave maestra en AWS KMS; los valores nunca se transcriben. | Parámetros en `VARIABLE` y `.pro` (reemplazado) | `integrationSecrets` | T06; DEC-074 |
| By-pass | Traspaso de la operación de un módulo de ProCoop a GoodApps mientras otros siguen en ProCoop. | "By pass de Procoop" | `bypassPlans` | T07; DEC-068 |
| CAE | Código de Autorización Electrónico que ARCA otorga a cada comprobante. Ante caída de ARCA se emite y encola, o se usa CAEA si está habilitado. | `FACTURAS.CAE` | `fiscalAuthorizations` | M06; DEC-018; DEC-035; DEC-038 |
| CAEA | Código de Autorización Electrónico Anticipado, por quincena, con informe posterior; contingencia ante caída de ARCA. | `CESPAFIP` con `CAEA = 1` | `caeaPeriods` | M06; DEC-018; DEC-038 |
| Caja (puesto de cobro) | Punto de cobro: ventanilla, caja virtual de un ente, cobrador o canal digital. Su turno abierto es la sesión de caja. | `CAJASJP` | `cashRegisters` | M07; T03 §10.7.1 |
| Caja de tesorería / caja de pagos | Cuenta de efectivo central donde ingresa la recaudación rendida / caja diaria de pagos a proveedores en efectivo. No es la caja de cobranza de M07. | `BANKOS` con `BIC = 3` / `CAJAPAGO` | `treasuryAccounts`; `paymentCashSessions` | M14 |
| Cambio de titularidad | Transferencia de un contrato a otro titular con fecha efectiva; la deuda queda en el titular saliente salvo convenio. | Transferencia de servicio | `transfers` | M01; DEC-045 |
| Capability | Permiso atómico con la forma `modulo.recurso.accion` (ver, crear, editar, anular, aprobar, exportar, configurar y propias). | Permiso por formulario; `MENUSYS`/`MENUVAL` | `capabilityCatalog` | T02; maestra §7.1, §20 |
| Capacidad de servicio | Dominio funcional que la plataforma sabe gestionar (Internet, Agua, Cementerio parque…), con su perfil de registración y tipos de cálculo. | — (ProCoop instala todo) | `serviceCapabilities` | M02 |
| Capital social | Aportes de los asociados representados en cuotas sociales; se suscribe, factura, integra, transfiere, reserva y rescata. En M17, `capital*` significa exclusivamente capital social. Mínimo en O5 y resto en O10. | Cuotas sociales; `CAPITAL`, `CAPITAL_RES`, `RUBCAPI` | `capitalMovements`, `capitalBalances`, `capitalItems` | M17; DEC-019; DEC-061 |
| Capital suscripto / facturado / integrado | Compromiso de aporte asumido / porción incluida en un comprobante / capital efectivamente pagado. El renglón de capital viaja en la factura del servicio con auxiliar separado y leyenda. | `SUSCRIPTO` / `FACTURADO` / `PAGADO` | `capitalMovements` | M17; DEC-061 |
| Carencia | Período desde el alta durante el cual una cobertura o prestación no rige. | `SERVICIO_EXTRAS.CARENCIA` | `serviceContracts` (condiciones del plan) | M02; M18 |
| Cargo fijo | Importe por período independiente de la cantidad consumida. | `IMP_CF`, `COD_CF` | `tariffCategoryRates` | M04 |
| Cargo por evento | Concepto que se devenga ante un hito estructural: alta, conexión, reconexión, transferencia, instalación, visita o cambio de medidor. | Concepto por evento; `CONEXION` | `eventChargeRules` (M02); `eventCharges` (M04) | M02; M04 |
| Cargo por operación | Concepto de única vez que nace de un hito operativo con un titular (conexión, instalación, cambio de titular, traslado), cobrado con el servicio, al contado o en cuotas. La instalación del piloto va en la primera factura tras la OT confirmada. | "Conceptos por cobrar en operaciones con titulares" | `operationCharges` | M11; DEC-016 |
| Caso CRM | Unidad única de gestión con número de seguimiento, contexto, conversación, historial y resultado; puede ser solicitud, reclamo, consulta, pedido o mesa de entradas. | Gestión, expediente, ticket; `TICKETS`, `RECLAMOS`, `PTRAMITES` | `crmCases` | M09; T03 §10.7.1 |
| Caso de interrupción | Expediente de suspensión, corte, baja por mora, suspensión voluntaria, reactivación o reconexión de un servicio. | OT de desconexión/reconexión con `GEST_MORA` | `interruptionCases` | M08 |
| Categoría | (1) Clasificación estructural del contrato o suministro (Residencial, Comercial, Alumbrado público), dueño M02. (2) Categoría tarifaria: la misma clase con su juego de precios por versión, dueño M04. (3) Categoría salarial de un convenio (M16). (4) Categoría INAES (M15, M17). | `CATE_SER` (1 y 2); `SU_CATE` (3); `CAT_INAES` (4) | `serviceCategories` (1); `tariffCategoryRates` (2); `salaryCategories` (3); `inaesCategories` (4) | M02; M04; M16; M17; T03 §10.7.1 |
| Ciclo de facturación | Configuración que fija, para un servicio y un universo, la periodicidad y el calendario de corte, emisión y vencimientos. | Período (variante de diccionario); `PERIODOS`/`LOTES` | `billingCycles` | M05; maestra §20; T03 §10.7.1 |
| Cierre de ciclo | Acto que da por terminado el período de un ciclo con un reporte de control aprobado. | — | `billingCycleClosures` | M05 |
| Cliente no asociado | Titular con servicios contratados sin relación institucional vigente. | Titular "no activo"; `SOCIOS.ACTIVO = 0` | `holders` | M01; M17 |
| Cobrador | Persona que cobra fuera de oficina con una lista de cobro y luego rinde. | — | `collectors`; `collectorSettlements` | M07; maestra §7.2 (T-CBR) |
| Código de pago / identificador de pago | Código autocontenido y estable (barras o QR) que identifica la obligación, cupón o intención publicada para las redes de cobro. | Prefijos 40/41/42/43/99 | `paymentReferences` (M07); `barcodeAssignments` (M05) | M05; M07; DEC-050 |
| Comodato | Préstamo de uso gratuito de un equipo propio de la cooperativa al socio mientras dura el servicio, con devolución; valorizado en stock. Por defecto en Internet y TV. | Equipo en comodato; `SERSOC_PRODUCTOS` | `contractEquipmentAssignments` | M13; M02; M10; DEC-013 |
| Componente embebido | Bloque de pantalla de otro módulo que M19 compone dentro de una ruta propia; el módulo dueño aporta datos y reglas por API. | — | — | M19 |
| Comprobante | Documento económico emitido: factura, nota de débito, nota de crédito, liquidación de servicios públicos, ticket, interno, CVLP. | `FACTURAS` | `invoices` (renglones embebidos) | M05; T03 §10.7.1 |
| Concepto facturable | Elemento económico individualizable (abono, instalación, cargo por evento, cuota, ajuste, tasa de tercero, capital); su precio vive en M04. Último nivel de la jerarquía del catálogo. | Concepto; `PROD_SER`, `CONCEPTOS` | `billableConcepts` | M02; M04; DEC-012; maestra §20 |
| Conciliación | (1) Bancaria: explica la diferencia entre extracto y libro a una fecha. (2) De cobranzas: compara pagado, rendido y acreditado por canal. (3) Contable: auxiliar contra cuenta de control. (4) De migración: conteos y sumas entre origen y destino. (5) Técnica con proveedores externos. | `CONCILIAC` (1) | `reconciliations` (1); `collectionReconciliations` (2); `reconciliationRuns` (3); `migrationReconciliations` (4); `integrationReconciliations` (5) | M14; M07; M15; T07; T06 |
| Conector | Adaptador que implementa el contrato técnico de un tipo de proveedor externo y declara sus capacidades; la conexión es su instancia configurada en un tenant. | Clases `clsPagos360`, `SistemaTelemedicion` | `integrationProviders`; `integrationConnections` | T06; maestra §5.3 (ARQ-06) |
| Conformidad | Constancia de aceptación o disconformidad del receptor sobre un trabajo técnico, con firma manuscrita en pantalla u otro mecanismo. | `RESP_ENC`, firma PMovil | `serviceConformities` | M10; T11 |
| Consumo | Cantidad calculada para un canal y un intervalo a partir de lecturas, estimación o distribución; el consumo aprobado es el habilitado para liquidar. | `CONS_SER.CONSUMO` | `consumptions` | M03; T03 §10.7.1 |
| Consumo estimado | Consumo sin lectura real, con método y base declarados; se regulariza cuando llega la lectura real. | `ESTIMADO = 1` | `consumptions` | M03 |
| Contexto | Modo de actuar dentro de un tenant: `staff` (personal), `portal` (socio y comunidad) o `platform` (operador SaaS). | Procoop.exe vs CoopOnline | `memberships` | T02 |
| Contraasiento | Asiento que revierte otro y queda vinculado a él. | — (ProCoop elimina) | `journalEntries` | M15 |
| Contracargo | Reversión de un pago iniciada por el emisor del medio de pago. | Reversión | `chargebacks` | M07 |
| Contrato de servicio | Vínculo entre un titular (DNI/CUIT), una cuenta, un servicio y plan y un punto de prestación, con estado y condiciones. Se crea al admitir la solicitud en CRM, en estado Solicitado. | Servicio contratado, conexión, suministro; `SERSOC` | `serviceContracts` | M02; M01; T03 §10.7.1; DEC-011; DEC-028 |
| Contrato SaaS | Acuerdo comercial plataforma–cooperativa: plan, módulos, cupos, vigencia, SLA, región y condiciones de salida. | — | `saasContracts` | T01; DEC-065 |
| Contribución por mejoras | Distribución aprobada del costo de una obra entre frentistas o beneficiarios, cobrada en cuotas de obra. | MER-009 | `works`; `workBeneficiaries`; `worksInstallmentPlans` | M10; M04 |
| Convenio (de pago) | Acuerdo de regularización de una deuda existente con obligaciones incluidas, cuotas y firmantes; se arma con un plan de pagos como plantilla. Otros sentidos de "convenio" en las filas de convenio colectivo, convenio de terceros y convenio con prestador. | Plan de pagos (variante de diccionario); `REC_CON` + `IT_RECCO` | `agreements` | M08; T03 §10.7.1 |
| Convenio colectivo de trabajo | Acuerdo laboral que fija categorías, escalas y adicionales; lo parametriza y valida el responsable laboral. | CCT | `laborAgreements` | M16 |
| Convenio con prestador | Acuerdo con un prestador de servicios sociales (empresa fúnebre, red de bancos de sangre, ambulancias) que define cobertura, vigencia y costo. | — | `providerAgreements` | M18 |
| Convenio de terceros | (1) Acuerdo con un organismo para cobrar una tasa o fondo en la factura y rendirlo. (2) Perfil de servicio accesorio de M02 del que siempre cuelgan los conceptos de terceros: no se facturan por inmueble sin contrato del socio. | Convenio por cuenta de terceros; `TERCEROS`, `FACTURAS_TERCEROS` | `thirdPartyAgreements`; `thirdPartyCharges` | M06; M02; DEC-083 |
| Convivencia | Período en que ProCoop y GoodApps operan a la vez con una frontera de responsabilidad por módulo; la contabilidad oficial sigue en ProCoop hasta el corte administrativo. | "Período de convivencia" | `coexistenceSyncs` | T07; DEC-068; DEC-069 |
| Cooperativa piloto | Cooperativa comercial y de migración de referencia: **Laguna Larga** (`LAG`). Su base `PR_LAG_DEMO` es además la base relevada; de ella solo se toma configuración. Su primera migración real es posterior a O7. No confundir con el servicio piloto (Internet). | LAG | `tenants` | DEC-088 (reemplaza DEC-081); maestra §1.4; índice de entregables |
| Corrida paralela | Período en que GoodApps calcula los mismos ciclos que ProCoop, sin efecto fiscal, para comparar factura por factura. | "Paralelo" | `parallelRuns`; `parallelComparisons` | T07 |
| Corte | (1) En facturación, cierre de medición o de período a efectos de facturar; **no** es suspensión por impago. (2) En mora, ejecución física de la interrupción del servicio (ver Suspensión). (3) En migración, corte definitivo (cutover): momento en que ProCoop deja de ser sistema de registro para un alcance; es comercial primero y administrativo después. | Fecha de toma de estado (1); `cutover` (3) | `billingCycles` (1); `interruptionCases` (2); `cutoverPlans` (3) | M05; M08; T03 §10.7.1; T07; DEC-068 |
| Cuadrilla | Equipo de trabajo técnico con integrantes, zona, capacidad y depósito a cargo (stock rodante). | `CUADRI` + `PARTICUA` | `crews` | M10; M13 |
| Cuadro tarifario | Conjunto aprobado y versionado de precios, parámetros de cálculo y reglas de un tenant, con vigencia desde/hasta y respaldo normativo; una versión usada en comprobantes no se edita. | Versión tarifaria; `CUADROS` + `HIS_*` | `tariffSchedules` | M04; T03 §10.7.1 |
| Cuenta | Agrupación estructural de contratos de un titular, con domicilio postal, condición IVA y datos de entrega. No es la cuenta corriente, ni la contable, ni la bancaria. | `SUMSOC` ("Cuenta", "suministro") | `accounts` | M01; T03 §10.7.1; maestra §20 |
| Cuenta contable | Clasificación imputable o agrupadora dentro de un plan de cuentas; su identidad incluye el plan. | `COD_CTA` | `ledgerAccounts` | M15 |
| Cuenta corriente | Auxiliar de obligaciones y cancelaciones de un titular, una por titular y entidad jurídica; un cobro de caja puede cubrir varias entidades y emite un recibo por entidad. Presentación separada por servicio o unificada. | Auxiliar comercial; `FACTURAS.SALDO` + `IT_PAGSO` | `currentAccounts`; movimientos en `ledgerEntries` | M07; DEC-087 |
| Cuenta financiera | Lugar donde la cooperativa tiene o mueve fondos: cuenta bancaria propia, caja de tesorería, caja de pagos, cuenta de movimientos o de tránsito. | `BANKOS` | `treasuryAccounts` | M14 |
| Cuota social | (1) Unidad de capital social, de igual valor nominal e indivisible, representada en acciones o certificados. (2) La maestra §4.2 también llama "cuotas sociales" a un servicio fijo o abono (cuota social en O2–O4). | Acción; `SOCIOS.ACCIONES` | `capitalShareValues`; `shareCertificates` (1) | M17; maestra §4.2 |
| Cupo | Límite de uso por dimensión (por ejemplo, contratos activos); el blando avisa y el duro aplica la política acordada. | — | `tenantLicenses` | T01; DEC-065 |
| Cupón | (1) Cupón de pago único: código que cancela varias facturas en un acto. (2) Cupón de tarjeta: comprobante de un cobro con tarjeta en caja. (3) Talón o documento de pago de M05 que agrupa comprobantes. | Talón sumado (1, 3); `CUPONTAR` (2) | `paymentCoupons` (1); `cardVouchers` (2); `paymentSlips` (3) | M07; M14; M05; M19 |
| DDJJ de artefactos | Declaración jurada de artefactos del suministro por servicio (gas en kcal/h, artefactos y vehículos eléctricos), con la plantilla que define M02. | `ARTEFSUMS` | `contractDeclaredAppliances` | M19; M02 |
| Débito automático | Cobro automático por CBU o tarjeta según la adhesión del titular; se presenta al ente en lotes. | `SUMSOC.DEB_TARJ` | `directDebitMandates`; `directDebitBatches` | M07; M19 |
| Demanda contratada | Potencia comprometida por período (electricidad, grandes usuarios); la demanda registrada mayor genera transgresión. | `CON_BASE`, `DEC_CON` | `demandDeclarations`; `demandTransgressions` | M03; M04 |
| Derecho de sepultura | Derecho adquirido sobre una unidad de sepultura del cementerio parque, con titular, modalidad y vigencia. | — | `burialRights` | M18 |
| Diccionario de términos | Conjunto de textos visibles por tenant para las claves estables `dict:<clave>`, con fallback de plataforma, variantes por canal y publicación versionada. Ninguna etiqueta es fija. | `VAR_PMOVIL` (reemplazado) | `dictionaryKeys`; `tenantDictionaryEntries`; `dictionaryReleases` | T03; maestra §11; maestra §5.3 (ARQ-07) |
| Diferimiento de interés | Decisión de cobrar el recargo por mora en el acto o trasladarlo a la próxima factura; en pago online de factura vencida se difiere por defecto. | `DiferirInteres`, `INT_DIFE` | `deferredInterests` | M08; M07; DEC-051 |
| Documento económico | Documento con efecto patrimonial o fiscal (factura, recibo, movimiento, asiento, recibo de sueldo, retención). Nunca se borra ni se edita tras emitirse; lleva `legalEntityId`. | — | (varias; sin `deletedAt`) | T05; maestra §13; DEC-064 |
| Domicilio | Dirección normalizada con texto original, procedencia y georreferencia. Puede ser postal, fiscal o de prestación. | `PERSONAS.COD_CAL/NUMERO…` | `addresses` | M01; DEC-046 |
| Dominio de servicio | Clasificación funcional de la capacidad: INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR (ver sección 3.2). Cada uno tiene su ficha vertical en T12. | `TIP_SERVI` (aproximado) | `serviceCapabilities` | M02; T12; DEC-073 |
| Egreso (institucional) | Fin de la relación institucional por renuncia, exclusión, fallecimiento o extinción de la persona jurídica. | Baja de socio | `membershipEvents` | M17 |
| Emisión | Numeración y persistencia definitiva del comprobante; el número fiscal se asigna al emitir, en orden del lote. | Generación real | `invoices`; `numberSequences` | M05; DEC-035 |
| Empleado / legajo | Relación laboral de una persona con una empresa empleadora. No equivale a usuario ni a asociado. | Colaborador; `SU_EMPLEADOS` | `employees` | M16; T03 §10.7.1 |
| Ente recaudador | Entidad externa que cobra por cuenta de la cooperativa (Red Link, SIRO, Pago Fácil, Rapipago, bancos, tarjetas), con caja virtual propia. | Entidad de cobro; `BANCOS` | `collectionAgencies` | M07; maestra §20 |
| Entidad jurídica | Persona jurídica del tenant que emite documentos económicos, lleva contabilidad y emplea personal (cooperativa, mutual o sociedad vinculada). Un tenant tiene una o más; una es la entidad por defecto. | Empresa; `EMPRESAS`, `SU_EMPRESAS` | `legalEntities` (`legalEntityId` en documentos económicos) | T04; T05; DEC-064 |
| Escalón / tramo | Tramo: rango de consumo total que elige qué tabla de escalones aplica. Escalón: bloque progresivo dentro de un tramo con su precio. | `CON_TMIN/CON_TMAX` / `CON_MIN/CON_MAX` | `tariffRows` | M04 |
| Estado canónico / estado operativo | Estado controlado por el sistema (Solicitado, Activo, Suspendido, Baja…) / estado configurable por el tenant que se muestra y opera, mapeado a uno canónico. | `CONDICION` / `ESTASER` | `serviceStatuses`; `stateMachineRegistry` | M02; T11; T03 §10.9.12 |
| Evento de dominio | Hecho de negocio confirmado e inmutable, nombrado `<mod>.<entidad>.<pasado>`, publicado por outbox en la misma transacción que el cambio. El nombre canónico es el del productor. | — | `eventTypes`; `outboxEvents` | T11; T01; maestra §13 |
| Excedente repartible / retorno | Resultado positivo del ejercicio por operaciones con asociados, sujeto a distribución por asamblea / parte asignada a cada asociado en proporción al uso de los servicios. | — | `surplusDistributions`; `surplusAllocations` | M17 |
| Expediente | (1) En atención, caso CRM o registro de mesa de entradas con número y pases internos. (2) Expediente digital: conjunto ordenado de documentos, eventos y decisiones de un sujeto; el expediente formal tiene número, carátula y estado. | `EXPEDIENTES` | `crmCases` (1); `dossiers` (2) | M09; T11 |
| Factibilidad | Evaluación técnica previa de si es posible conectar, trasladar o reconectar un servicio en un domicilio, con dictamen y vigencia. Obligatoria por defecto en Internet y servicios con red. | `FACTIBIL` | `feasibilityRequests` | M10; DEC-040 |
| Factura | Comprobante fiscal emitido por la cooperativa. Por defecto es separada por servicio; la agrupada multiservicio se activa por grupo de facturación. Si da cero no se emite ("sin cargo"); si da negativa, por defecto se emite NC. | Comprobante | `invoices` | M05; T03 §10.7.1; DEC-034; DEC-036; DEC-037 |
| Ficha 360 | Vista integral de la persona o titular con cuentas, contratos, saldos, facturas, pagos, gestiones, comunicaciones y documentos. | Ficha del titular | — (vista) | M01 |
| Ficha de servicio | (1) Ficha vertical: recorrido de punta a punta de un dominio de servicio (contrato, medición, tarifa, facturación, cobro, mora, técnica, atención, portal, migración) con los IDs de cada anexo; sirve de control de cobertura. (2) En M02, perfil del servicio que declara su configuración (por ejemplo, si admite adherentes). (3) En T06, ficha de integración `FI-INT-NN`. | — | — (documental); `tenantServices` (2) | T12; DEC-073; M02; T06 |
| Firma electrónica / firma digital | Firma electrónica con OTP por defecto para instalación, convenios y trámites; firma digital con certificador licenciado solo para recibos de sueldo y actas. La firma manuscrita digitalizada es conformidad, no firma digital. | `FIRMASELECTRONICAS*`, `FIRMADIGITAL*` | `signatureRequests`; `signatureProfiles` | T11; DEC-078 |
| Fórmula | Expresión del lenguaje GoodApps (GFL) que calcula filtro, cantidad, importe unitario o base imponible de una regla de cargo; usa un catálogo cerrado de funciones. | `FORMULA_FIL/CAN/IMP/BI` | `chargeRules`; `formulaFunctions` | M04 |
| Garantía | Garante, depósito en garantía, aval u otro instrumento que respalda obligaciones de un titular, cuenta, contrato o convenio. | `COD_GAR` | `guarantees` | M08; M01 |
| Generación distribuida | Régimen del usuario-generador que inyecta energía renovable a la red (Ley 27.424); por defecto se compensa en forma monetaria y el saldo negativo queda como crédito a futuro. | Usuario-generador, prosumidor | `distributedGenerationContracts`; `injectionBalances` | M03; M04; DEC-060; DEC-036 |
| Grupo de cobertura | Conjunto formado por el titular del contrato y sus adherentes vigentes a una fecha. | Grupo familiar | `serviceDependents` | M18 |
| Grupo de facturación | Conjunto de contratos o servicios de un titular que se emiten en un mismo comprobante (modalidad agrupada). | G.F.; `SERSOC.GRUPO_FACTURA`, `GRUPOS_FACTURA` | `billingGroups` | M05; M01; T03 §10.7.1 |
| Guardia | (1) En técnica, turno de guardia por servicio y zona con titular, suplente, jefe y teléfono publicado. (2) En sueldos, disponibilidad o prestación fuera del horario normal remunerada según convenio (pasiva o activa), que se liquida como novedad. | Novedad de guardia (2) | `onCallShifts` (1); `novelties` (2) | M10; M16 |
| Identidad de acceso | Credencial global única de una persona humana (correo, teléfono, contraseña, factores, vínculos federados), sin datos de negocio de ningún tenant. | `USERS`, `WS_USERS` | `identities` | T02 |
| Imputación | (1) Aplicación de un crédito (pago, NC, anticipo) a una obligación por un importe y componente; por defecto por antigüedad, recargos e intereses primero, salvo elección explícita. (2) En contabilidad y sueldos, regla que asigna cuenta y centro de costo a un importe. | `IT_PAGSO` (1); `CTCUENTA_ASIGNA`, `SU_ASIENTOS` (2) | `allocations`; `allocationPolicies` (1); `postingRules`; `payrollAccountingRules` (2) | M07; M15; M16; DEC-048; DEC-049 |
| Incidente | (1) Incidente común: evento que afecta a varios socios (falla zonal) con una sola gestión técnica y casos vinculados. (2) Incidente de plataforma que afecta a uno o más tenants. (3) Incidente de seguridad. | `CLAS_INC`, `PARTIINC` (1) | `crmIncidents` (1); `platformIncidents` (2); `securityIncidents` (3) | M09; T01; T08 |
| Incobrable | Deuda declarada de cobro improbable, con aprobación y efecto contable, sin borrar el historial. | MER-006 | `writeOffs` | M08 |
| Inmueble | Lugar físico (parcela, edificio, unidad funcional) con nomenclatura catastral, donde se presta uno o varios servicios. | Propiedad; `PROPIEDA` | `premises` | M01; T03 §10.7.1 |
| Instancia de mora | Etapa configurable del circuito de mora (candidatos, 1.ª, 2.ª, sensible, corte y otras), con notificaciones y vencimiento propio. | Aviso; `INSTANCI` | `delinquencyStages`; `delinquencyNotices` | M08; T03 §10.7.1 |
| Intención de pago | Solicitud de pago identificable ante una pasarela, con ítems, importes por vencimiento y estado; en el portal se presenta como checkout. | Checkout; `PAGOS360` | `paymentIntents` | M07; M19 |
| Interés por mora | Recargo por pago posterior al último vencimiento, calculado a la fecha de pago o consulta según una política versionada por servicio, categoría y tipo de documento. | Recargo por mora, punitorio | `interestPolicies`; `interestCalculations` | M08 |
| Ítem facturable | Cargo pendiente de incluir en la próxima facturación (cargo por evento, cuota, interés diferido, entradas de otros módulos). No es el concepto facturable del catálogo. Las entradas a facturar de servicios sociales (`billing-inputs`) llegan como ítems. | `PRCAGAS` | `billableItems` | M05; DEC-071 |
| Landing | Sitio público de la cooperativa con su marca, noticias, servicios habilitados y accesos (registro, pagar, reclamos, baja pública). | Página de CoopOnline | `landingPages` | M19; maestra §8, §10 |
| Lectura | Estado registrado de un medidor en una fecha por cualquier medio (campo, telemedición, autolectura); capturada hasta que se valida como base de cálculo. | `IMP_WORK`, `CONS_SER` | `meterReadings` | M03; T03 §10.7.1 |
| Lecturista | Operador de campo que toma lecturas siguiendo rutas, con la PWA de campo offline. | Lector | `fieldResources` | M03; M10; maestra §7.2 (T-LEC) |
| Legacy | Traza del registro de ProCoop de origen en un documento migrado; el histórico fuera del período tipado queda consultable en registros legacy. | Clave primaria ProCoop | `legacyIdMap`; `legacyRecords` | T07; T05; DEC-070 |
| Licencia (capa 1) | Qué módulos contrató el tenant, con qué vigencia y cupos. Primer filtro del acceso efectivo. | Licencia del `.pro` | `tenantLicenses` | T01; maestra §6 |
| Lote | (1) Lote de facturación: ejecución operativa de facturación sobre un universo (no es una factura ni una transacción indivisible). (2) Lote de lectura: ejecución de una ruta en un período. (3) Lote de notificaciones de mora. (4) Lote de stock: unidades con origen y vencimiento comunes. | `LOTES`, `FACTMES` (1); `NOTIFICA.LOTE` (3); `TIPOLOTE` (4) | `billingRuns` (1); `readingBatches` (2); `delinquencyBatches` (3); `lots` (4) | M05; M03; M08; M13; maestra §20 |
| Matrícula | Identificador del punto de suministro del servicio, único por servicio salvo parámetro. | `SERSOC.MATRICULA` | `serviceContracts.supplyCode` | M02 |
| Medidor | Instrumento físico de medición con ficha metrológica; puede cambiar sin que cambie el punto de medición. | Contador; `NUM_MED` | `meters` | M03; T03 §10.7.1 |
| Mesa de entradas | Registro de documentación recibida o emitida con número de expediente y pases internos; se gestiona como un tipo de caso CRM. | `EXPEDIENTES` | `crmCases` (`deskEntry`) | M09; T11 |
| Módulo vendible | Producto del catálogo de la plataforma que se licencia; las pantallas que dependen de él no se cobran aparte. | `MODULOS` | `moduleCatalog` | T01 |
| Mora | Situación de deuda vencida impaga de una cuenta, gestionada por una política por servicio y categoría (plazos, montos mínimos, instancias, canales, excepciones y protecciones). | Deuda; morosidad | `delinquencyPolicies`; `delinquencyEvaluations` | M08; T03 §10.7.1 |
| Muro | Feed editorial de publicaciones de la cooperativa visible según audiencia y canal; los socios reaccionan y comentan con moderación, pero no publican. | Noticias; `WEB_NOVEDADES` | `posts`; `comments` | T09; DEC-008 |
| Nota de crédito / nota de débito | Comprobante que disminuye / aumenta una obligación y referencia al original; la reversión de un comprobante se hace con ellas. | NC / ND | `invoices` (por tipo); `invoiceRelations` | M05; T03 §10.7.1; DEC-036 |
| Novedad | (1) En sueldos, hecho del período que alimenta la liquidación (horas, ausencias, adelantos, embargos). (2) En comunicación, T03 usa "novedad" para el boletín de publicaciones. (3) En cobranza, archivo de novedades del ente con altas y bajas de adhesiones. | `SU_EMP_NOVEDADES` (1) | `novelties` (1); `newsletters` (2); `agencyNoveltyFiles` (3) | M16; T03 §10.7.1; T09; M07 |
| Número de titular | Número visible y único en el tenant que identifica al titular; secuencia única por tenant con atributo de tipo, manual solo en migración. | "Titular N°"; `SOCIOS.COD_SOC` | `holders.number` | M01; DEC-017 |
| Obligación | Importe exigible con vencimientos, originado por un documento (factura, ND, cuota, cargo); hay una por servicio dentro de cada comprobante agrupado. | `FACTURAS`, `DEUDAVTA` | `obligations` | M07 |
| Obra | Proyecto de infraestructura con presupuesto, avance y costeo; puede distribuir su costo entre beneficiarios (contribución por mejoras). | `OBRAS` | `works` | M10 |
| Ola | Incremento de desarrollo ordenado y sin fecha (O0 a O11), con contenido, dependencias y hito de salida. | Etapa | — | Maestra §15, §20; `03`; DEC-006 |
| Operación | (1) En workflow, solicitud registrada de una acción sensible con aprobación, ejecución idempotente y resultado observable. (2) Operación de tesorería, de caja, técnica (qué se hace en una OT) o de integración. | `OPERACIONES` (1); `TRANSAC` (técnica) | `operations` (1); `treasuryOperations`; `cashOperations`; `operationTypes` de M10, se crea como `workOrderOperationTypes`; `integrationOperations` | T11; M14; M07; M10; T06 |
| Orden de compra | Compromiso de compra aprobado con un proveedor. | OC; `OCOMPRA` | `purchaseOrders` | M12 |
| Orden de pago | Documento que aplica comprobantes y anticipos de proveedor, retenciones y neto a pagar; tesorería la ejecuta. | OP; `PPAGOS`/`PPITEMS` | `paymentOrders`; `paymentExecutions` | M12; M14 |
| Orden de trabajo | Instrucción de trabajo técnico sobre un servicio, un activo u obra, o derivada de un reclamo; por defecto se cierra en dos pasos en altas, desconexiones, reconexiones y cambios de medidor. | OT; orden de servicio; `TECNICA` | `workOrders` | M10; T03 §10.7.1; DEC-039 |
| Outbox | Colección donde cada cambio registra, en la misma transacción, los eventos a publicar; garantiza consistencia entre cambio y evento. | — | `outboxEvents` | T01; maestra §5.1; DEC-003 |
| Pack | Conjunto predefinido de módulos con cupos por defecto con que se comercializa el SaaS; se complementa con agregados. | Plan de plataforma | `platformPlans` | T01; DEC-065 |
| Padrón | (1) Padrón de asamblea: lista versionada de asociados habilitados con criterios y fecha de corte. (2) Padrón fiscal: lista oficial de sujetos por CUIT con régimen, alícuota y vigencia. (3) Padrón de subsidios: archivo de beneficiarios publicado por la autoridad. | `clsPadronTitular` (1); `IIBB_LUA` (2); importaciones RASE (3) | `rosters` (1); `taxpayerRegistries` (2); `subsidyRollImports` (3) | M17; M06; T04; M04 |
| Pagador | Quien paga una obligación sin ser titular, sin adquirir derechos; el pagador eventual paga un comprobante ajeno por código de pago sin ver datos de la cuenta. | — | — | M01; M19 |
| Parámetro | Valor de configuración tipado, semántico y versionado que cambia el comportamiento sin cambiar código, con clave `<mod>.<recurso>.<atributo>`, ámbito y vigencia. Reemplaza los 1.536 parámetros numéricos de ProCoop. | Variable; `VARIABLE` | `parameterDefinitions`; `parameterValues` | T04; T04b; maestra §5.3 (ARQ-05) |
| Pasarela de pago | Proveedor de pagos online (Pagos360, Mercado Pago, SIRO, Red Link en O5; el resto en O11) integrado por conector. | Entidad digital | `gatewayConnectors`; `gatewayTransactions` | M07; T06; DEC-015 |
| Percepción | Importe que la cooperativa cobra al receptor como agente de percepción (IVA, IIBB, municipal) y luego ingresa al fisco. | `PER_IVA` | `taxDefinitions` | M06 |
| Perfil de pantallas | Conjunto nombrado de pantallas navegables con franja horaria y apps habilitadas; determina la navegación, mientras el rol determina las acciones. | `PERFILES` + `MENUVAL` | `screenProfiles` | T02; maestra §7.1 |
| Período | (1) De facturación o consumo: intervalo que se factura en un ciclo; el período facturado registra que un contrato se facturó en un período y secuencia. (2) Contable: mes dentro del ejercicio con bloqueos por módulo. (3) De sueldos: mes o quincena de una empresa empleadora. | `SEC_PER`, `ULT_FAC` (1) | `billedPeriods` (1); `accountingPeriods` (2); `payPeriods` (3) | M05; M04; M15; M16 |
| Persona | Persona humana o jurídica con identidad fiscal (DNI/CUIT) registrada en el ámbito de una cooperativa, única por tenant salvo excepción aprobada. No es lo mismo que titular ni que asociado. | `PERSONAS` | `persons` | M01; maestra §20; DEC-044 |
| Pertenencia | Relación privada entre una identidad de acceso y un tenant, con uno o dos contextos (staff, portal). El usuario del personal es una pertenencia; no existe colección de usuarios. | Membership | `memberships` (T02) | T02; maestra §6, §12 |
| Plan | (1) Plan comercial: combinación versionada de producto, componentes y condiciones dentro de un servicio (jerarquía servicio → producto → plan → conceptos). (2) Otros usos: plan de pagos, plan de cuentas, plan de cobertura, plan de vivienda, pack de plataforma (ver sus filas). | Oferta; categoría + productos en ProCoop | `servicePlans`; `servicePlanVersions` | M02; T03 §10.7.1; DEC-012; DEC-032 |
| Plan de cobertura | Conjunto de condiciones de acceso y prestaciones de un servicio social (sepelio, salud). | Categoría de servicio | `coveragePlans` | M18 |
| Plan de cuentas | Estructura de clasificación contable; admite plan operativo (oficial), alternativos, de simulación y regulatorios. Durante la convivencia GoodApps contabiliza en un plan marcado no oficial. | `CTPLAN` | `chartOfAccounts` | M15; DEC-009; DEC-069 |
| Plan de pagos | Plantilla de condiciones de financiación (cuotas, tasa, método de amortización, mínimos, quitas) sobre la que se arma un convenio. | Financiación; `PLAN_CUO` | `paymentPlans` | M08; T03 §10.7.1 |
| Plan de vivienda | Programa con tipologías, precio, reglas de aporte, adjudicación y construcción por etapas. | `PLANESVIV` | `housingPlans`; `housingPrices` | M18 |
| Prefacturación | Cálculo de comprobantes candidatos sin numerar ni afectar saldos, para revisar antes de emitir. | Simulación | `billingRunItems` | M05 |
| Prepago | Modalidad de servicio medido en la que el socio compra crédito por anticipado; la cuenta prepaga es el estado técnico del medidor (proveedor, saldo, cargas). Debe estar disponible al migrar la cooperativa piloto. | Categoría prepaga; recarga, token | `prepaidAccounts`; `prepaidTopUps` | M03; M19; DEC-088 |
| Prescripción | Extinción de la exigibilidad de una deuda por el plazo legal según el tipo de obligación: 24 meses para facturas periódicas de servicios y 60 meses para el resto, editable y sujeta a validación legal. | "Deuda a Prescribir" | `prescriptionRules`; `prescriptionRuns` | M08; DEC-052 |
| Producto / subservicio | Oferta identificable dentro de un servicio (Fibra hogar, Línea fija); un subservicio es un producto adicional o componente (IP fija, decodificador adicional). | `PROD_SER`, `TEL_SERVICIO` | `serviceProducts` | M02; T03 §10.7.1; DEC-012 |
| Promesa de pago | Compromiso del deudor de pagar en una fecha, que suspende el avance de la mora mientras está vigente. | `NOTIFICA.PROMESA` | `delinquencyNotices` | M08 |
| Prompt | Instrucción de trabajo para Cursor IA que implementa un bloque coherente de requisitos de una ola; el plan tiene 172 prompts más 3 generales, y cada RF y RNF está asignado a exactamente uno. | — | — | `03`; maestra §15, §16 |
| Prorrateo | (1) Reparto del período de consumo entre dos o tres versiones tarifarias cuando el precio cambia dentro del período. (2) Proporcional de alta o baja dentro del mes. (3) Cambio de plan inmediato con prorrateo, si el tenant lo habilita (por defecto rige el próximo período). (4) En ventas, reparto del flete o molde entre los ítems. | `PRORRATEO_*` (1); `PROPORCION` (2) | `tariffSchedules`; `calculations` | M04; M11; DEC-032 |
| Protección normativa | Condición acreditada que impide o condiciona la suspensión de un servicio (electrodependencia, entidad pública, salud, educación, emergencia). | Excepciones de mora | `serviceProtections` | M08 |
| Proveedor | (1) Tercero que vende bienes o servicios a la cooperativa; accede al portal solo por invitación. (2) Organismo o empresa externa con la que se integra GoodApps (ARCA, SIRO, Meta…). (3) Prestador de servicios sociales. | `PROVEED` (1) | `suppliers` (1); `integrationProviders` (2); `careProviders` (3) | M12; T06; M18; maestra §7.2 (C-PRV) |
| Provisorio | Suministro transitorio con vencimiento obligatorio, facturable en esa condición. | Marca "Provisorio" | `serviceContracts` | M02; DEC-027 |
| Puesto | Equipo o posición física de trabajo dentro de una sucursal (mostrador, caja, oficina, kiosco, campo) al que se asocian dispositivos y el agente local. | `EQUIPOS` | `workstations` | T04; maestra §15 (O0) |
| Punto de medición | Lugar lógico donde se mide un servicio contratado; puede cambiar de medidor sin cambiar de punto. | Servicio con medidor (`SERSOC`) | `meteringPoints` | M03 |
| Punto de prestación | Dirección georreferenciada donde se brinda uno o varios contratos, distinta del domicilio personal, fiscal o postal. En servicios medidos hay un contrato igual por punto de suministro. | Punto de suministro; domicilio de `SERSOC` | `servicePoints` | M01; M10; DEC-028 |
| Punto de venta | Punto de emisión habilitado ante ARCA o interno; es único (fiscal y operativo). | `PTOVENTA`, `COMPPOS` | `pointsOfSale` (dueño M06) | M05; M06 |
| Recargo entre vencimientos | Diferencia entre el importe del vencimiento 2, 3 o 4 y el del primero; se calcula al emitir y se informa en la factura. | `TOTAL2..TOTAL4`, `TRAMASREC` | `dueDateSurchargeSchemes` | M08; M05 |
| Recibo | (1) Comprobante de cobro con el detalle de imputaciones y medios de pago; uno por entidad jurídica. (2) Recibo de sueldo o de haberes de un empleado. | `PAG_SOC` + `IT_PAGSO` (1); `SU_SUELDOS` (2) | `receipts` (1); `payslips` (2) | M07; M16; T03 §10.7.1; DEC-087 |
| Reclamo | Caso CRM por falla o disconformidad; distinto de la solicitud comercial. Puede derivar en una orden de trabajo. | `RECLAMOS` | `crmCases` (tipo reclamo) | M09; T03 §10.7.1 |
| Reconexión | Restitución del servicio interrumpido. En servicios remotos es automática al confirmarse el pago y sin deuda vencida del servicio; si requiere técnico se genera OT automática. | Rehabilitación | `interruptionCases`; `provisioningCommands` | M08; M10; DEC-014 |
| Refacturación | Nueva emisión de un servicio y período fuera del lote, vinculada a la corrección del original. | Refacturación por secuencia | `invoices`; `invoiceRelations` | M05 |
| Régimen de medición | Indica si el contrato se factura con medidor o sin medidor; solo cambia por un comando específico. | — | `serviceContracts.meteringRegime` | M02 |
| Régimen informativo | Obligación periódica de informar datos a un organismo (Libro IVA Digital, SICORE, SIRE, SIRCAR, ERSeP, ENARGAS), con presentación y acuse. | `TipoArchivos` | `informationRegimes`; `regimeFilings` | M06 |
| Rendición | (1) Rendición del ente: informe de pagos que devuelve una red o ente recaudador. (2) Rendición de caja o de cobrador: entrega de fondos y valores a tesorería. (3) Rendición a terceros: liquidación de lo cobrado por cuenta de un tercero. (4) Rendición de cuadrilla: conciliación de materiales en custodia. (5) Rendición de viaje. | `CerrarCaja` (2) | `agencySettlements` (1); `treasuryHandovers`, `collectorSettlements` (2); `thirdPartyRemittances` (3); `crewSettlements` (4); `freightSettlements`, `tripSettlements` (5) | M07; M14; M06; M13; M11; M18 |
| Rendición de caja | Entrega de los fondos y valores de una sesión de caja cerrada a tesorería: M07 registra la entrega y M14 la recibe. | Presentación de caja a tesorería | `treasuryHandovers` (M07); `cashRemittances` (M14) | M07; M14; DEC-059 |
| Renglón | Línea de un comprobante (concepto, cantidad, precio, impuestos, neto) o de un asiento (debe o haber). | `ITEMSFAC` / `CTITASIE` | `invoices` (embebidos); `journalLines` | M05; M15 |
| Restricción de suspensión | Regla de la matriz de restricciones que limita cuándo se puede suspender o cortar un servicio (preaviso, días y horarios, protecciones, reclamos en trámite) por servicio y jurisdicción. | — (mejora) | `suspensionRestrictionRules` | M08 |
| Resumen de cuenta | Documento de presentación de obligaciones existentes de un titular; no es deuda nueva ni factura. | Estado de cuenta; talón sumado | `accountStatements` | M07; T03 §10.7.1 |
| Retención | Importe que la cooperativa detrae al pagar a un proveedor como agente de retención, con certificado. | Retención practicada; `RET_COM` | `withholdingsApplied` | M06; M12 |
| Retención sufrida | Retención que un cliente, organismo o procesador practica a la cooperativa al pagarle; cancela parte de la deuda y se computa fiscalmente. | Retención recibida; `RETENCIO` | `receivedWithholdings` | M06; M07; M14 |
| Reversión | Emisión de un comprobante inverso (NC o ND) asociado al original; los documentos económicos no se editan. | Revertir factura | `invoiceRelations` | M05; maestra §1.3 (P5) |
| Rol funcional | Conjunto nombrado de capabilities y denegaciones que determina las acciones; los roles son plantillas de plataforma versionadas que cada cooperativa instancia y ajusta. | Flags `US_*`, `PERFILES` (parte) | `roles`; `roleAssignments` | T02; maestra §7.2 |
| Ruta de lectura | Definición de qué puntos de medición se leen juntos y en qué orden (zona, sector, recorrido). | Recorrido; ZSR; `CONNRUTA` | `readingRoutes` | M03; T03 §10.7.1 |
| Saldo | Importe pendiente derivado de una obligación menos sus imputaciones vigentes; nunca se edita a mano. | `FACTURAS.SALDO` (editable en ProCoop) | Derivado de `obligations` y `allocations` | M07 |
| Saldo a favor | Crédito disponible del titular (anticipo, excedente, NC), con origen y regla de aplicación; se aplica automáticamente solo dentro del mismo servicio. | Anticipo; `ANTICIPOS` | `creditBalances` | M07; T03 §10.7.1; DEC-049 |
| Sepelio | Servicio fúnebre cubierto por un plan, con adherentes, carencias y prestador; el subsidio por fallecimiento es una prestación distinta. | Servicio de sepelio | `burialServiceCases`; `deathSubsidyCases` | M18; T12 parte 2 (SEP) |
| Servicio | (1) Servicio del tenant: habilitación y configuración de una capacidad que la cooperativa ofrece (Energía, Agua, Internet); la plataforma lo habilita según licencia y el tenant lo publica con aprobación. (2) En lenguaje corriente, también el servicio contratado por un titular (ver Contrato de servicio). | Prestación; `SERVICIO` | `tenantServices` (1) | M02; T03 §10.7.1; DEC-021; DEC-022 |
| Sesión de caja | Turno abierto por un cajero en una caja con fondo inicial, hasta su cierre con arqueo. | Turno de caja; `CAJAS` | `cashSessions` | M07; M14 |
| Simulación | Ejecución sin efectos para revisar resultados: de tarifas (comparativa masiva), de configuración antes de publicar, de sueldos y escenarios contables. | — | `simulationRuns` (M04); `simulationScenarios` (M15) | M04; T04; M15; M16 |
| SLA | (1) Compromiso contractual de nivel de servicio de la plataforma con la cooperativa (disponibilidad 99,5 % mensual). (2) Plazo objetivo de atención de un caso, tarea o aprobación, con calendario y escalamiento. | — | `saasContracts` (1); `crmSlaPolicies`, `slaPolicies` (2) | T08; DEC-063; M09; T11 |
| Socio | (1) Variante de diccionario de "Asociado": persona con vínculo institucional. (2) En roles y apps, "socio titular" es el titular con acceso al portal (rol C-SOC) y "PWA socio" es la app de autogestión, que también usan representantes y adherentes. | Asociado, usuario (variantes) | `memberships` de M17, se crea como `associateMemberships` (1); `memberships` de T02 (2) | Maestra §1.3 (P3), §7.2, §8, §20; T03 §10.7.1 |
| Solicitud | Caso CRM de pedido comercial (alta, baja, suspensión, cambio); al admitirse una solicitud de alta se crea el contrato en estado Solicitado. | Trámite; `SOLICITUDES` | `crmCases` (tipo solicitud) | M09; T03 §10.7.1; DEC-011 |
| Subsidio | Esquema público versionado (régimen de subsidio) con componentes, bloques, porcentajes y cronograma, aplicado sobre padrones de beneficiarios. | `clsSegmentacion` | `subsidyRegimes`; `subsidyEnrollments` | M04 |
| Sucursal | Lugar físico de la cooperativa (atención, caja, depósito, puntos de venta, base técnica) que pertenece a una entidad jurídica. | Agencia | `branches` | T04; T03 §10.7.1; maestra §15 (O0) |
| Suministro | (1) Maestra §20: instancia de un servicio en un inmueble para una cuenta (equivale a conexión y a contrato). (2) T03: punto físico de prestación (medidor, conexión), distinto de cuenta y de contrato. (3) En ProCoop el término se aplica tanto a la cuenta (`SUMSOC`) como al servicio de la cuenta (`SERSOC`). | Conexión; `SUMINISTROS`, `SERVICIOS_CUENTA`, `SUMSOC`, `SERSOC` | `serviceContracts` (1); `servicePoints` (2) | Maestra §20; T03 §10.7.1; M01 |
| Suspensión | Interrupción temporal del servicio por mora, distinta del corte físico y de la baja definitiva. La suspensión voluntaria a pedido del socio es configurable por servicio y está deshabilitada por defecto. | — | `interruptionCases` | M08; T03 §10.7.1; DEC-031 |
| Tarifa social | Precio diferencial que surge de la categoría social (M02) y de la segmentación (M04); no se registra como beneficiario. | — | `serviceCategories`; `subsidyRegimes` | DEC-086; M02; M04 |
| Tasación | Valorización de una llamada telefónica (CDR) por plan, banda horaria, clave y fracciones. | `Tasacion_LLAMADAS` | `phoneRates`; `callRecords` | M04; M10; DEC-007 |
| Telemedición | Toma remota de lecturas y operaciones remotas sobre medidores mediante un sistema AMI/MDM o prepago configurado por tenant. | `TELEMEDICION`, `SIS_TEL` | `meteringSystems`; `remoteMeterOperations` | M03; T06 |
| Tenant | Cooperativa cliente de la plataforma, con ámbito propio de datos y administración; todo documento lleva `tenantId`. El tenant especial `PLATFORM` corresponde al operador SaaS. | Empresa / base de datos | `tenants` | T01; maestra §6, §20; DEC-002 |
| Titular | Persona responsable comercial (y de pago) de una o más cuentas y de sus contratos, identificada por DNI o CUIT. No implica ser asociado. | `SOCIOS` ("Titular N°"), `TITULARES` | `holders` | M01; T03 §10.7.1; maestra §20 |
| Trámite | (1) En el portal, caso CRM originado por el socio (alta, baja, suspensión, cambio, DDJJ). (2) Trámite presentado: documento con vencimiento ligado a socio, cuenta o servicio. (3) En workflow, definición versionada de un proceso; el tenant solo crea trámites de tipo "solicitud genérica". | `REQUISITOS` (1); `PTRAMITES` (2); `TRAMITES` (3) | `crmCases` (1); `crmProcedureRecords` (2); `workflowDefinitions` (3) | M19; M09; T11; DEC-079 |
| Transferencia | Operación que mueve una cuenta, un contrato o capital de un titular a otro, con fecha efectiva y sin reescribir el pasado. | `TRANSFER` (tipos 1, 2, 3) | `transfers`; `capitalTransfers` | M01; M17; DEC-045 |
| Turno | (1) Turno de atención presencial o virtual en un área (turnero). (2) Turno horario de trabajo del empleado. (3) Turno de caja (ver Sesión de caja). (4) Turno de guardia técnica (ver Guardia). | `TURNOS` (1); `SU_TURNOS` (2) | `crmQueueTickets`, `crmQueueAppointments` (1); `shifts` (2); `cashSessions` (3); `onCallShifts` (4) | M09; M16; M07; M10 |
| Universo | Criterio que determina qué contratos o cuentas pertenecen a un ciclo o lote; al aprobar un lote se congela con versión y huella. | Conjunto de facturación | `billingUniverses` | M05; T10 |
| Usuario registrado | Persona con identidad de acceso y pertenencia al tenant, sin cuentas vinculadas; para vincular una cuenta debe verificar el vínculo (código de factura y documento, código al contacto o validación presencial). | Visitante registrado; `WS_USERS` | `memberships` (contexto portal); `portalLinkAttempts` | M19; T02; DEC-043; DEC-066 |
| Vencimiento | Fecha de pago con su importe; hasta cuatro por comprobante, según la trama de vencimientos. | `VTO1..VTO4` | `dueDateSchemes` | M05; T03 §10.7.1 |
| Versión de configuración | Paquete coherente de cambios (parámetros, maestros, configuración de un servicio) que se valida, simula, revisa y publica junto, con fecha efectiva. | — (ProCoop pisa el valor) | `configVersions` (T04); `serviceConfigVersions` (M02) | T04; M02; maestra §1.3 (P2) |
| Vínculo | Tipo de relación familiar u organizacional entre personas (cónyuge, hijo, conviviente), usado también para adherentes. | `VINCULOS` | `relationships` | M01; M18 |
| Visita | Presencia programada en el domicilio con franja horaria, recurso y resultado; puede ser fallida. | — | `visits`; `visitBookings` | M10 |

---

## 2. Siglas

| Sigla | Significado | Uso en la especificación |
|---|---|---|
| AAIP | Agencia de Acceso a la Información Pública | Transferencia internacional de datos (DEC-062) |
| AFIP / ARCA | Administración Federal de Ingresos Públicos, hoy Agencia de Recaudación y Control Aduanero (Decreto 953/2024) | Factura electrónica, regímenes, F.931 (M06, M16) |
| AMI / MDM | Infraestructura de medición avanzada / gestión de datos de medición | Telemedición (M03, T06) |
| ART | Aseguradora de riesgos del trabajo | M16 |
| ASVS | Application Security Verification Standard de OWASP (nivel 2) | Meta de seguridad (T08) |
| BCRA | Banco Central de la República Argentina | eCheq, tasas e índices (M14, T04) |
| BOM | Lista de materiales de un producto fabricable | Fabricación (M13) |
| CAE / CAEA | Código de Autorización Electrónico / Código de Autorización Electrónico Anticipado | M06; DEC-018, DEC-038 |
| CAI | Código de Autorización de Impresión | Talonarios preimpresos (M06) |
| CBU / CVU | Clave Bancaria Uniforme / Clave Virtual Uniforme | Débitos y acreditación de haberes (M07, M16) |
| CCT | Convenio colectivo de trabajo | M16 |
| CCyC | Código Civil y Comercial de la Nación | Prescripción (DEC-052) |
| CDI | Clave de Identificación | Identificación de personas (M01) |
| CDR | Registro de detalle de llamada | Tasación de telefonía (M10, M04) |
| CESP | Código de autorización por período para liquidaciones de servicios públicos | M06 |
| CFT | Costo financiero total | Convenios (M08) |
| CiDi | Ciudadano Digital de Córdoba | Ingreso federado del socio (DEC-067) |
| CNX | Connectia, referencia técnica y de UI/UX | Maestra §2.1; DEC-001 |
| CPP | Calling Party Pays: llamada a celular con importe fijado por la operadora móvil | M10 |
| CUIL / CUIT | Código Único de Identificación Laboral / Clave Única de Identificación Tributaria | M01, M06, M16 |
| CVLP | Cuenta de venta y líquido producto | Servicios de terceros con comisión (M05) |
| CVP | Código de Validación Provincial | IIBB (M06) |
| DDJJ | Declaración jurada | Artefactos del suministro (M19) |
| DEK / KEK | Clave de cifrado de datos / clave maestra que la envuelve | Cifrado por sobre (T05, T08; DEC-074) |
| DNI | Documento Nacional de Identidad | M01 |
| eCheq | Cheque electrónico | M14 |
| ENACOM | Ente Nacional de Comunicaciones | Informes regulatorios, plan de numeración, botón de baja (M06, M10, M19) |
| ENARGAS | Ente Nacional Regulador del Gas | Categorías y protocolos de gas (M02, M06) |
| ERSeP | Ente Regulador de los Servicios Públicos de Córdoba | Régimen informativo (M06) |
| F.572 / SIRADIG | Formulario de deducciones del empleado / sistema de ARCA para presentarlo | Ganancias de 4.ª categoría (M16) |
| F.931 | Declaración jurada de cargas sociales | M16; maestra §15 (O9) |
| FCE MiPyME | Factura de Crédito Electrónica MiPyME | M06 |
| GFL | Lenguaje de fórmulas de GoodApps | Reglas tarifarias (M04) |
| GIS | Sistema de información geográfica | Redes (M10) |
| IIBB | Impuesto sobre los Ingresos Brutos | Córdoba en O4, resto en O8 (DEC-054) |
| INAES | Instituto Nacional de Asociativismo y Economía Social | Institucional y contabilidad (M15, M17) |
| IVA | Impuesto al Valor Agregado | M06 |
| KMS | Servicio de gestión de claves (AWS KMS) | Bóveda (DEC-074) |
| LCT | Ley de Contrato de Trabajo | Recibos y libro de sueldos (M16) |
| LQSP | Liquidación de Servicios Públicos | Tipos de comprobante ARCA 17/18 (M06) |
| LSD | Libro de Sueldos Digital | M16; maestra §15 (O9) |
| MFA / 2FA | Autenticación multifactor / de dos factores | T02; maestra §7.2 |
| MRP | Planificación de necesidades de materiales | Fabricación (M13) |
| NC / ND | Nota de crédito / nota de débito | M05 |
| OC / OP | Orden de compra / orden de pago | M12, M14 |
| OLT / ONU | Terminal de línea óptica / unidad de red óptica | Internet por fibra (M10, M13) |
| OT | Orden de trabajo | M10 |
| OTP | Código de un solo uso | Ingreso del socio y firma electrónica (DEC-066, DEC-078) |
| PITR | Restauración a un punto en el tiempo | Respaldo (T08) |
| POS | Puesto de venta de mostrador; también terminal de cobro con tarjeta | M11, M07 |
| PPPoE | Protocolo de acceso de los abonados de Internet | Perfil técnico (M10) |
| PWA | Aplicación web progresiva | Apps de socio, empleado y campo (maestra §8) |
| RBAC | Control de acceso basado en roles | T02 |
| RECPAM | Resultado por exposición al cambio del poder adquisitivo de la moneda | Ajuste por inflación (M15) |
| RG | Resolución General (de ARCA) | M06, M16 |
| RMA | Autorización de devolución de mercadería | Garantía de equipos (M13) |
| RPO / RTO | Pérdida máxima de datos tolerada / tiempo objetivo de recuperación | DEC-063 |
| SaaS | Software como servicio | Maestra §1.2 |
| SAC | Sueldo anual complementario (aguinaldo) | M16 |
| SEF / ReSEF / RASE | Regímenes públicos de subsidio a la energía y el gas citados en M04 (SEF según Decreto 943/2025; RASE: Registro de Acceso a los Subsidios a la Energía, con niveles N1, N2 y N3) | `subsidyRegimes` (M04) |
| SICORE / SIRE / SIRCAR | Sistemas de control de retenciones y percepciones de ARCA / de retenciones electrónicas de ARCA / de recaudación de IIBB del Convenio Multilateral | M06, M16 |
| SICOSS | Sistema de ARCA que recibe la nómina para generar el F.931 | M16 |
| SLA / SLO / SLI | Compromiso / objetivo / indicador de nivel de servicio | T08; DEC-063 |
| SMVM | Salario mínimo, vital y móvil | M16 |
| SoD | Separación de funciones | T02, T11 |
| TA | Ticket de acceso de WSAA (ARCA) | M06, T06 |
| VAD | Valor agregado de distribución | Tarifas eléctricas (M04) |
| VEP | Volante electrónico de pago | M14 |
| WCAG | Pautas de accesibilidad para el contenido web (2.2 AA) | Maestra §11, §14 |
| WSAA / WSFEv1 | Web services de autenticación y de factura electrónica de ARCA | M06 |
| ZSR | Zona, sector y recorrido | Rutas de lectura y reparto (M02, M03) |

### 2.1 Siglas de la documentación y de las fuentes

| Sigla | Significado |
|---|---|
| BASE, AGR, CNX, DFA, FIC, RN-01..13, CAT, INV, REL | Fuentes consolidadas: relevamiento y base funcional, complemento de análisis, referencia Connectia, definición funcional de ProCoop, fichas de integraciones, reglas de negocio extraídas del código, catálogo de tablas, inventarios de formularios y relevamiento del menú (maestra §2.1) |
| DEC | Decisión del solicitante (`01`) |
| PA | Pregunta abierta (`02`) |
| CTR | Contraposición resuelta entre fuentes (maestra §17 y sección 20 de cada anexo) |
| HUE / HUECO | Hueco de cobertura (`05`) |
| RF / RN / RNF | Requisito funcional / regla de negocio / requisito no funcional |
| CU / ESC | Caso de uso / escenario |
| PAN / API / EVT / JOB / PRM | Pantalla / endpoint / evento / job / parámetro |
| COL | Colección del catálogo de T05 |
| PRO-Ox-NN | Prompt del plan de olas (`03`) |
| FI-INT-NN | Ficha de integración (T06) |
| LAG / `PR_LAG_DEMO` | Cooperativa piloto Laguna Larga / su base ProCoop relevada (DEC-088) |

---

## 3. Códigos de módulos y anexos

### 3.1 Anexos de la especificación

| Código | Sigla | Nombre |
|---|---|---|
| M01 | PER | Personas, titulares, asociados, cuentas, inmuebles y domicilios |
| M02 | CAT | Catálogo de servicios, productos, planes, categorías y contrato de servicio |
| M03 | MED | Medidores, lecturas, consumos, telemedición y prepago |
| M04 | TAR | Tarifas y motor de cálculo |
| M05 | FAC | Facturación: ciclos, lotes y comprobantes |
| M06 | FIS | Fiscal e impuestos |
| M07 | COB | Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas y conciliación |
| M08 | MOR | Mora, intereses, suspensión, corte, reconexión, financiación y convenios |
| M09 | CRM | CRM y atención |
| M10 | TEC | Técnica, campo, GIS/redes, obras, aprovisionamiento y telefonía |
| M11 | VEN | Ventas, presupuestos y punto de venta |
| M12 | CMP | Compras y proveedores |
| M13 | STK | Stock, equipos serializados, bienes de uso, RMA y fabricación |
| M14 | TES | Tesorería y bancos |
| M15 | CON | Contabilidad |
| M16 | SUE | Personal y sueldos |
| M17 | INS | Gestión institucional (asociados, capital, asambleas, consejo, INAES) |
| M18 | SOC | Servicios sociales, otros servicios y flota |
| M19 | POR | Landing, portal y app del socio |
| T01 | PLA | Plataforma SaaS |
| T02 | IAM | Identidad, roles, perfiles, alcance y auditoría |
| T03 | UXD | Experiencia, design system, marca, diccionario y mapa del sitio |
| T04 | CFG | Configuración versionada, parámetros, tablas maestras y geografía |
| T04b | CFG | Catálogo de parámetros de ProCoop (partes 1 a 4) |
| T05 | DAT | Modelo de datos canónico |
| T06 | INT | Integraciones externas |
| T07 | MIG | Migración desde ProCoop, convivencia, corrida paralela y by-pass |
| T08 | NFR | Requisitos no funcionales y seguridad |
| T09 | COM | Comunidad y comunicaciones |
| T10 | BIA | Reportes, BI, tableros y APIs |
| T11 | WFL | Workflow, eventos, tareas, aprobaciones y documentos |
| T12 | SRV | Fichas verticales por servicio (partes 1 y 2) |

Un código de anexo siempre va con su sigla (`M14 TES`), porque la numeración "DFA M1..M29" de los módulos de ProCoop no coincide con los anexos (maestra §20, nota sobre numeraciones).

### 3.2 Dominios de servicio (M02 §6.C, fichas de T12)

| Código | Dominio | Ficha |
|---|---|---|
| INT | Internet (servicio piloto) | T12 parte 1 |
| TEL | Telefonía (fija, móvil revendida, pack SMS, prepaga) | T12 parte 1 |
| TV | Televisión / cable | T12 parte 1 |
| ELE | Energía eléctrica (incluye generación distribuida y grandes usuarios) | T12 parte 1 |
| AG | Agua potable | T12 parte 1 |
| CLO | Cloacas / saneamiento | T12 parte 1 |
| GAS | Gas natural por red, propano por red y envasado | T12 parte 1 |
| ALU | Alumbrado público | T12 parte 1 |
| OBR | Pavimento y obras, cuotas de obra, contribución por mejoras | T12 parte 2 |
| SEP | Sepelio y subsidio por fallecimiento | T12 parte 2 |
| CEM | Cementerio parque | T12 parte 2 |
| SAN | Banco de sangre por convenio | T12 parte 2 |
| SAL | Ambulancias y salud | T12 parte 2 |
| VIV | Planes de vivienda | T12 parte 2 |
| TAS | Tasas y conceptos por cuenta de terceros | T12 parte 2 |
| CAP | Capital social como concepto | T12 parte 2 |
| OTR | Otras prestaciones | T12 parte 2 |

---

## 4. Observaciones de terminología

Diferencias detectadas al unificar el glosario. Se registran para tratarlas con el procedimiento de control de cambios ([`10-caratula-control-versiones.md`](10-caratula-control-versiones.md), sección 5); este documento no las corrige.

1. **Suministro** tiene tres sentidos: instancia de servicio para una cuenta (maestra §20), punto físico de prestación (T03 §10.7.1) y, en ProCoop, tanto la cuenta como el servicio de la cuenta (M01).
2. **Claves de diccionario** con convenciones distintas para el mismo concepto: la maestra §20 usa claves sin prefijo (`dict:socio`, `dict:titular`, `dict:suministro`); T03 §10.7.1 usa `per.asociado`, `per.titular`, `per.contrato`; los anexos usan claves en inglés (`dict:per.holder`, `dict:per.member`, `dict:ins.associate`, `dict:cat.contract` y `dict:cat.serviceContract`).
3. **Cuenta corriente**: M01 la asocia a `dict:cob.ledger`, mientras que M07 reserva `dict:cob.ledger` para el auxiliar comercial y usa `dict:cob.currentAccount` para la cuenta corriente.
4. **Plan de pagos y convenio**: T03 ofrece "Convenio" como variante de diccionario de "Plan de pagos", pero M08 los define como cosas distintas (plantilla de condiciones y acuerdo concreto).
5. **Cuota social**: en M17 es una unidad de capital; en la maestra §4.2 "cuotas sociales" figura como un servicio fijo o abono.
6. **Corte** se usa para el cierre de período de facturación (M05), para la interrupción física por mora (M08, T03) y para el corte de migración (T07, DEC-068).
7. **Piloto** se usa para el servicio piloto (Internet, DEC-005) y para la cooperativa piloto (LAG, DEC-088).
8. **Nombres de colecciones de la maestra §12 que no coinciden con T05 §7**, que prevalece según la propia maestra: `members` (T05: `associateMemberships`), `cashboxes` (`cashRegisters`), `collectionAgents` (`collectionAgencies`), `readings` (`meterReadings`), `properties` (`premises`), `tariffs` y `tariffVersions` (`tariffSchedules`), `taxPadrons` (`taxpayerRegistries`), `claims` y `tickets` (`crmCases`), `dictionaryEntries` (`tenantDictionaryEntries`).
9. **Colisión de nombre `memberships`** entre T02 (pertenencia de una identidad) y M17 (relación institucional del asociado), resuelta en T05 con `associateMemberships`.
10. **Adherente** se define de forma distinta según el anexo: integrante del grupo familiar (T03, T02), persona beneficiaria agregada a un servicio (M19) o persona incorporada a la cobertura de un contrato (M18). Además, M18 usa "adherente" para el inscripto en un plan de vivienda.
11. **Beneficiario**: la definición de M18 cita como ejemplo al "beneficiario de un subsidio", mientras que DEC-086 restringe el término a las personas cubiertas por un contrato, sin incluir la tarifa social.
12. **Incidente**: T03 (`crm.incidente`) lo describe como "incidente de mesa de entradas", mientras que M09 lo define como una falla que afecta a varios socios.
13. **Novedad**: T03 usa `com.novedad` con el texto "Boletín", y M16 llama "novedad" al hecho que alimenta la liquidación de sueldos.
