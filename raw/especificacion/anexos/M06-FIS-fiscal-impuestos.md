# M06 FIS — Fiscal e impuestos (ARCA, IVA, percepciones, retenciones, regímenes, terceros, reguladores)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Impuestos (solución 7 "Liquidación de impuestos") |
| Olas | O4 (ARCA WSAA/WSFEv1, CAE, CAEA de contingencia, padrón, condición IVA, alícuotas IVA, percepciones básicas IVA/IIBB Córdoba, CVP, padrones LUA, conceptos por cuenta de terceros, tablas normativas), O5 (rendición de terceros, retenciones sufridas, asientos fiscales, comprobantes de administración pública), O7 (CESP/LQSP, RG 5746/2025, informes a reguladores ERSeP, ENARGAS, ENACOM, Secretaría de Energía), O8 (regímenes informativos, Libro IVA Digital, Mis Comprobantes, retenciones como agente, SICORE, SIRE, SIRCAR, otras provincias, FECESCOR), O11 (modo pasarela de autorización para sistemas externos) |
| Dueño de datos | Tablas normativas fiscales versionadas y su adopción por tenant; perfil fiscal del tenant y condiciones de agente; obligaciones y exenciones propias del tenant como contribuyente (`ownTaxObligations`, DEC-095); credenciales ARCA (metadatos; el secreto vive en la bóveda T01/T08); tickets WSAA; puntos de venta fiscales y modalidades de autorización; cola y lotes de autorización ARCA; CAEA, CESP y CAI; CVP; padrones de contribuyentes y de alícuotas; exclusiones y certificados de no retención; definiciones de tributos, percepciones y retenciones; retenciones practicadas y sus certificados; libros IVA (corridas y cierres); importaciones de Mis Comprobantes y conciliaciones; declaraciones/archivos de regímenes informativos y su presentación; convenios por cuenta de terceros y sus rendiciones; catálogo e informes a reguladores; selecciones de comprobantes de administración pública; comprobantes del modo pasarela |
| Fuentes consolidadas | BASE §52 (52.1–52.4), §56 [AR1–AR9], §57, §61 (FIS-001, CU-FIS-01), §62 [FIS-F1–F4], §63, §69 (validación fiscal de la factura A, CU-LOT-01), §70 [LOT-F1–F3], §85, §97.2, §97.4, §98, MER-001 (RG 5746/2025), MER-002, MER-014, §101 [MER18], §103.3, §104 (SUE-006, SUE-007 por referencia), §105 (solución 7), §106; AGR-010, AGR-016, AGR-021 (y por referencia AGR-011, AGR-022, AGR-023); DFA tablas fiscales (líneas 144–149) y módulo Facturación (ARCA, CVP, anulación, bloqueo, terceros, relación de comprobantes, Libro IVA, EPEC, ENACOM); FIC 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 7, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3; RN-03 §1–§12 completo, recomendaciones 1–13 y dudas 1–10; RN-02 §11 (11.1–11.4), §13 (13.1–13.3.1); RN-01 §17 (17.1–17.2), §18 (lo fiscal); RN-08 §3 (3.1–3.5); RN-11 §4; RN-09 parámetros fiscales (líneas 657–1244 y 1495–1728, más 205–335); CAT §5 (todas las tablas); INV `ProMod_Facturacion` (frmFacturacionElectronica, frmConsultaNumComAFIP, abm_CespAfip, abm_Cvpiibb, abm_Electronica_Iva, abm_Impuesto, frmLibroIvaVenta, frmEnacom, frmEnargasPEN2067, frmComprobnatesAdministracionPublicaRAW, frmEnvioPmovil), `Configuracion` (abm_sit_iva, abm_ali_iva, abm_ali_Ibr, abm_ali_ibr_comp, abm_Sit_Ibr, abm_PtoVenta, abm_comprob, abm_Rets_Tipo, frmLiquidacionPercepciones, frmLiquidacionPercepciones_BsAs, frmAlicuotaDeterminada, frmEnargasConceptos, frmEnargasConceptos_Config, frmEnargasTablas, frmProcesoAutomatico, frmResultadosCuotaTerceros), `ProMod_Contabilidad` (frmExportarSIRCAR), `ProMod_Tesoreria` (frmCargaRetenciones), `ProMod_Cobranzas` (abm_Terceros, frmCobranzaTerceros, frmComprobantesAdministracionPublicaRAWConsulta), `ProMod_Titulares` (abm_ActAfip), `ProMod_Consumos` (frmInformeSecretariaElectrica); CNX (layouts, DataTable, ExcelImportWizard, bóveda de credenciales por tenant) |

> **Principio rector del módulo (BASE §105, solución 7):** el sistema **calcula, prepara, valida, registra y concilia**; la **presentación** de declaraciones y la **responsabilidad** fiscal son del contribuyente (la cooperativa) y de su contador. Toda pantalla de declaración y todo archivo generado muestran la leyenda `dict:fis.disclaimer.responsabilidad`. Las tablas normativas se versionan con **fuente y vigencia**, las mantiene la plataforma y cada tenant las **adopta**.


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Proveer a cada cooperativa (tenant) un módulo fiscal único que:

1. Autorice ante ARCA (ex AFIP) los comprobantes que emite el módulo de facturación (M05) y otros módulos emisores (M07, M11, M18), con autenticación WSAA, autorización WSFEv1 por CAE, CAEA para contingencia o modalidad habilitada, CAI para talonarios y CESP para liquidaciones de servicios públicos cuando corresponda, de forma masiva, resiliente, idempotente y conciliable (BASE §97.2, FIC 2.1, RN-03 §2–§4).
2. Determine la condición frente al IVA de emisor y receptor, valide la clase de comprobante (en particular la factura A, BASE §69) y calcule IVA, percepciones de IVA e Ingresos Brutos, tributos provinciales y municipales y conceptos por cuenta de terceros, con explicación reproducible de cada cálculo (RN-01 §17, AGR-010).
3. Opere como **agente de retención y percepción** (BASE §61, FIS-001): catálogo de organismos, regímenes y condición de agente; motor de retenciones a proveedores (invocado por M12/M14); certificados; obligaciones; preparación de declaraciones; registro de presentación, acuse y rectificación; conciliación con tesorería y contabilidad.
4. Prepare libros de IVA ventas y compras, el Libro IVA Digital, la conciliación contra "Mis Comprobantes" y los regímenes informativos (RG 3685/CITI histórico, RG 1361, RG 3349, RG 3571/RCSP y su versión RG 5746/2025, Circular 70/2021 ERSeP, SICORE, SIRE F2004/F2005, SIRCAR y exportadores provinciales) (MER-002, FIC 2.3).
5. Gestione convenios de cobro por cuenta y orden de terceros (tasas municipales, alumbrado público, fondos), su exhibición separada, el pasivo con el tercero y su rendición (BASE §97.4, FIC 9.2).
6. Genere los informes a entes reguladores (ERSeP, ENARGAS/ENReGE, ENACOM, Secretaría de Energía) y a la federación FECESCOR (MER-014, FIC 8, FIC 9.1).
7. Mantenga todas las tablas normativas (alícuotas, condiciones, códigos ARCA, regímenes, formatos, vencimientos, padrones) **versionadas con fuente y vigencia**, mantenidas por la plataforma y adoptadas por cada tenant, sin valores fiscales fijos en el código (BASE §52.1, §52.2, §61).

## 2. Límite y responsabilidades

### 2.1 Qué hace M06 FIS

- Es dueño de la **autorización fiscal** del comprobante: cola ARCA, armado del request, envío, respuesta, reintentos, estados fiscales, consulta y conciliación con ARCA, CAEA, CESP, CAI, CVP.
- Es dueño de los **datos fiscales** que viajan en un comprobante: códigos ARCA (tipo de comprobante, documento, condición IVA del receptor, alícuotas, tributos, opcionales, concepto), importes fiscales (neto, exento, no gravado, IVA, tributos), comprobantes asociados y datos para QR, código de barras fiscal y transparencia fiscal.
- Es dueño del **motor de impuestos**: determina alícuotas, IVA, percepciones, IIBB, tributos y conceptos de terceros aplicables a cada ítem/comprobante, y lo devuelve a M04/M05 como líneas impositivas con traza.
- Es dueño del **motor de retenciones** (como servicio): base, escala, mínimos, acumulación, certificados y obligaciones; lo invocan M12/M14 al preparar órdenes de pago.
- Es dueño de **libros IVA**, **regímenes informativos**, **informes regulatorios**, **rendiciones de terceros** y del **registro de presentaciones** (estados generado → validado → presentado → aceptado/rechazado → rectificado).
- Es dueño de **padrones** (ARCA A13/constancia, padrón offline de condición tributaria, padrones de alícuotas IIBB por jurisdicción, exclusiones).

### 2.2 Qué NO hace M06 FIS (y a quién delega)

| Tema | Responsable | Qué aporta M06 |
|---|---|---|
| Emisión, numeración local, tipos internos de comprobante, selección del comprobante por servicio/condición/MiPyME, lotes de facturación, PDF, impresión, distribución | **M05 FAC** | Autorización, datos fiscales, validación de clase de comprobante, cola ARCA, datos del QR y del código de barras, CVP vigente, leyendas fiscales |
| Cálculo P×Q, cargos adicionales y fórmulas, subsidios y bloques de consumo bonificado (incluido el cálculo de bloques ENARGAS `ENGAS_CANTMESES`) | **M04 TAR** (y M03 MED para consumos) | Líneas impositivas sobre el neto que calcula M04; tablas normativas de subsidios solo como referencia regulatoria |
| Registro de cobros, retenciones **sufridas** en cobros (medio de pago "Retenciones"), imputación, cuenta corriente, cobro en caja de comprobantes de administración pública | **M07 COB** | Catálogo de tipos de retenciones sufridas y reglas de validación; consolidación para informes; selección de comprobantes de administración pública; percepción IIBB en intereses entre vencimientos |
| Recargos, intereses por mora, financiación (incluido IVA de refinanciaciones) | **M08 MOR** | Tratamiento fiscal de intereses (documento posterior, IVA, percepción) |
| Órdenes de pago, pago neto al proveedor, comprobantes de compra (`IVACOM`, `FPALIC_IVA`), validación de CAE/CAI del proveedor al cargar facturas | **M12 CMP** / **M14 TES** | Motor de retenciones, certificados, obligación fiscal, verificación de comprobantes recibidos contra ARCA |
| Ingreso de fondos al organismo y pago de rendiciones a terceros | **M14 TES** | Obligación a pagar, importe, vencimiento, referencia; conciliación |
| Asientos contables (IVA débito/crédito, percepciones, retenciones, pasivo con terceros) | **M15 CON** | Eventos con importes y clasificación fiscal; mapa de cuentas por alícuota/impuesto |
| Capital social: base de capital por entidad jurídica y fecha para las contribuciones propias que se calculan sobre él (DEC-095; antes "por servicio o por evento") | **M17 INS** | M06 guarda la obligación o exención propia (`ownTaxObligations`, RF-FIS-169) y pide a M17 la base con `ins.capitalBase.get({ legalEntityId, asOf })` o la recibe en `ins.capitalBase.closed` / `.reopened` (EVT-INS-22) para crear, anular o recalcular la obligación a pagar (RN-FIS-133) |
| Ganancias de 4.ª categoría, F.931, Libro de Sueldos Digital, SUSS de nómina (SUE-006, SUE-007) | **M16 SUE** | Solo referencia: SICORE de sueldos recibe los datos que calcula M16; el calendario fiscal incluye sus vencimientos |
| Datos de personas, CUIT/DNI, domicilios, condición fiscal declarada | **M01 PER** (titulares) / **M12 CMP** (proveedores) | Catálogo de condiciones, validación de CUIT, consulta de padrón y propuesta de actualización |
| Contratos de generación distribuida, lecturas de inyección, cuenta de créditos del usuario-generador (MER-001) | **M03 MED** / **M04 TAR** / **M02 CAT** | Conjunto de datos fiscales RG 5746/2025 para la LQSP y para la rendición |
| Compra de energía a EPEC y cálculo de pérdidas (FIC 9.3, `FACT_EPEC`) | **M12 CMP** (factura de compra `supplierInvoices.wholesaleSupply`, RF-CMP-149, y balance aprobado EVT-CMP-16; CTR-DAT-75) / **M03 MED** (informe de pérdidas RF-MED-101) | El informe ERSeP de pérdidas consume ese balance (REP-BIA-018) |
| Marco genérico de integraciones (conectores, reintentos, bandeja de operaciones detenidas, catálogo de fichas) | **T06 INT** | Particularidades ARCA y de organismos fiscales/regulatorios (sección 13) |
| Bóveda de secretos por tenant, rotación de claves, cifrado | **T01 PLA** / **T08 NFR** | Metadatos del certificado y referencia al secreto |
| Configuración versionada genérica, publicación y parámetros | **T04 CFG** | Tablas normativas fiscales como especialización con fuente y vigencia |
| Reportes avanzados y BI | **T10 BIA** | Datasets fiscales con contrato semántico (AGR-022) |
| Expediente documental (acuses, constancias, convenios) | **T11 WFL** | Vínculos de evidencia de cada presentación y convenio |

### 2.3 Responsabilidad legal

- El sistema **no presenta** declaraciones en nombre de la cooperativa salvo que exista un web service oficial habilitado y el tenant lo active expresamente; en ese caso registra el envío y la respuesta. En el resto de los casos genera el archivo y el **responsable fiscal** lo presenta en el sitio del organismo y adjunta el acuse.
- Generar un archivo **no** equivale a presentado; emitir una instrucción de pago **no** equivale a pagado (BASE §61, control de CU-FIS-01).
- El tenant puede configurar sus condiciones autorizadas, pero **no puede desactivar restricciones normativas** por ser administrador (BASE §52.4).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| ARCA | Agencia de Recaudación y Control Aduanero (ex AFIP, Decreto 953/2024). Los web services siguen bajo dominios `afip.gov.ar`. | `dict:fis.arca` | AFIP / ARCA |
| WSAA | Web service de autenticación y autorización de ARCA; entrega el ticket de acceso (TA). | `dict:fis.wsaa` | `LoginCMSService` |
| TA (ticket de acceso) | Token + firma con vencimiento (~12 h) para un servicio ARCA y un CUIT. | `dict:fis.ticketAcceso` | `TA<servicio>.xml` |
| WSFEv1 | Web service de factura electrónica (mercado interno) para CAE y CAEA. | `dict:fis.wsfev1` | `WSFEV1.Service` |
| CAE | Código de Autorización Electrónico, por comprobante. | `dict:fis.cae` | `FACTURAS.CAE`, `TP_CODIGO = 2` |
| CAEA | Código de Autorización Electrónico Anticipado, por quincena, con informe posterior. | `dict:fis.caea` | `CESPAFIP` con `CAEA = 1`, `TP_CODIGO = 4` |
| CAI | Código de Autorización de Impresión de talonarios preimpresos. | `dict:fis.cai` | `COMPPOS.CAI_ACTUAL`, `VTO_CAI`, `TP_CODIGO = 1` |
| CESP | Código de autorización por período para liquidaciones de servicios públicos. | `dict:fis.cesp` | `CESPAFIP` con `CAEA = 0`, `TP_CODIGO = 3` |
| LQSP | Liquidación de Servicios Públicos (tipos ARCA 17/18, clase A/B). Se autoriza con CESP, separado del CAEA (DEC-094; PA-FIS-02, PA-FIS-24). No se mezcla con servicios de factura común; solo admite los conceptos accesorios declarados por el tenant (DEC-093; PA-FIS-23). | `dict:fis.lqsp` | `SITIVA.CSP_DEF`/`SPU_DEF`, `SERVICIO.LIQ_AFIP` |
| Punto de venta fiscal | Número habilitado en ARCA con su sistema de emisión. | `dict:fis.puntoVenta` | `PTOVENTA`, `COMPPOS` |
| Cola de autorización | Conjunto ordenado de comprobantes pendientes de autorizar por (CUIT, punto de venta, tipo). | `dict:fis.colaAutorizacion` | `FACTURAS.ID_BLO = -1` |
| Autorización incierta | Envío cuya respuesta no se conoce (timeout, corte); debe conciliarse antes de reintentar. | `dict:fis.estado.incierto` | — (no existía) |
| Condición frente al IVA | Responsable inscripto, exento, consumidor final, monotributo, monotributo social, no categorizado, IVA no alcanzado, IVA liberado, sujeto del exterior; la lista vigente la fija la tabla normativa ARCA. | `dict:fis.condicionIva` | `SITIVA` |
| Condición IVA del receptor | Código ARCA obligatorio (RG 5616) en el request. | `dict:fis.condicionIvaReceptor` | `SITIVA.AFIP_SIT` |
| Alícuota de IVA | Porcentaje y código ARCA (Id 3, 4, 5, 6, 8, 9). | `dict:fis.alicuotaIva` | `ALI_IVA`, `ALI_IVA_CF` |
| Tributo | Otro impuesto informado a ARCA (nacional, provincial, municipal, interno, percepciones). | `dict:fis.tributo` | `IMPUESTO` (`ORIGEN`, subtipo) |
| Percepción | Importe que la cooperativa cobra al receptor como agente de percepción (IVA, IIBB, municipal). | `dict:fis.percepcion` | `PER_IVA`, `ALI_IBR` "rendir en facturación" |
| Retención | Importe que la cooperativa detrae al pagar a un proveedor como agente de retención. | `dict:fis.retencion` | `RET_COM`, `RETE_TIPO` |
| Retención sufrida | Retención que un cliente/organismo practica a la cooperativa al pagarle. | `dict:fis.retencionSufrida` | `RETS_TIPO` |
| Situación de IIBB | Condición del sujeto frente a Ingresos Brutos (exento, base mínima). | `dict:fis.situacionIibb` | `SITIBR` |
| Padrón de alícuotas | Archivo de la jurisdicción con alícuota por CUIT y régimen, con vigencia. | `dict:fis.padronAlicuotas` | `IIBB_LUA` |
| CVP | Código de Validación Provincial que se imprime en el comprobante. | `dict:fis.cvp` | `CVPIIBB` |
| SIRCAR | Sistema de recaudación de Convenio Multilateral para agentes de IIBB. | `dict:fis.sircar` | `SIRCAR` |
| SICORE | Sistema de Control de Retenciones de ARCA (aplicativo). | `dict:fis.sicore` | `PercepcionSICORE` |
| SIRE | Sistema Integral de Retenciones Electrónicas de ARCA (F2004/F2005). | `dict:fis.sire` | `clsSIRE` |
| Libro IVA Digital | Régimen RG 4597 que reemplazó al CITI (RG 3685) y conserva su diseño de importación. | `dict:fis.libroIvaDigital` | `RG3685` |
| Mis Comprobantes | Servicio de ARCA con los comprobantes emitidos y recibidos registrados. | `dict:fis.misComprobantes` | `clsLibroIVAdigital` |
| Régimen informativo | Obligación periódica de informar datos (RG 3685/CITI, RG 1361, RG 3349, RG 3571, RG 5746/2025, SICORE, SIRE, SIRCAR, Circular ERSeP 70/2021, protocolos ENARGAS). | `dict:fis.regimenInformativo` | `TipoArchivos` |
| Presentación | Registro de que una declaración se presentó, con acuse y resultado. | `dict:fis.presentacion` | — (no existía) |
| Tabla normativa | Tabla fiscal versionada con fuente (norma, URL, fecha de consulta) y vigencia. | `dict:fis.tablaNormativa` | Tablas fiscales [T] sin versión |
| Adopción | Acto del tenant que acepta una versión publicada de tabla normativa desde una fecha efectiva. | `dict:fis.adopcion` | — |
| Convenio por cuenta de terceros | Acuerdo con un organismo para cobrar una tasa/fondo en la factura y rendirlo. | `dict:fis.convenioTerceros` | `TERCEROS`, `FACTURAS_TERCEROS` |
| Rendición | Liquidación periódica de lo cobrado por cuenta de un tercero. | `dict:fis.rendicion` | Rendición FECESCOR / terceros |
| Informe regulatorio | Informe periódico a un ente regulador con formato y vencimiento. | `dict:fis.informeRegulatorio` | `clsEnargas`, `clsEnacom`, `CIR7021`, ERSeP |
| Comprobantes de administración pública | Selección de facturas de organismos públicos para cobro en bloque. | `dict:fis.admPublica` | `COMPROBANTES_ADM` |
| Modo pasarela | Autorización de comprobantes generados por un sistema externo. | `dict:fis.modoPasarela` | "Solo factura electrónica", `ELECTRONICA_FC` |
| Transparencia fiscal | Exhibición del IVA contenido y otros impuestos nacionales indirectos (Ley 27.743, RG 5614/2024). | `dict:fis.transparenciaFiscal` | — |
| FCE MiPyME | Factura de Crédito Electrónica (códigos 201–213). | `dict:fis.fceMipyme` | `SITIVA.COM_*_MIPYME` |
| Responsable fiscal | Usuario del tenant (contador o delegado) que aprueba configuración y presentaciones. | `dict:fis.rol.responsableFiscal` | — |

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Equipo normativo de plataforma (tenant `PLATFORM`) | `fis.tablasNormativas.ver/crear/editar/aprobar/publicar/retirar`, `fis.regimenes.configurar` (catálogo y formatos), `fis.reguladores.configurar` (catálogo), `fis.arcaParametros.sincronizar` | Catálogo global; **no** accede a datos de tenants salvo soporte temporal auditado (T01) |
| Soporte de plataforma (acceso temporal) | `fis.autorizaciones.ver`, `fis.conector.ver`, `fis.conector.diagnosticar` | Tenant asignado, ventana temporal, sin ver secretos |
| Responsable fiscal del tenant (contador o delegado) | `fis.perfil.ver/editar/aprobar`, `fis.tablasNormativas.adoptar`, `fis.arca.configurar` (certificado, ambiente), `fis.puntosVenta.configurar`, `fis.caea.solicitar/informar`, `fis.cesp.configurar`, `fis.impuestos.configurar/aprobar`, `fis.padrones.importar/aprobar`, `fis.retenciones.configurar/aprobar`, `fis.libroIva.ver/generar/cerrar/reabrir`, `fis.regimenes.generar/validar/presentar/rectificar`, `fis.terceros.configurar/aprobar`, `fis.rendiciones.generar/aprobar`, `fis.reguladores.generar/presentar`, `fis.conciliacion.aprobar` | Tenant completo |
| Administrador del tenant | `fis.perfil.ver`, `fis.arca.ver`, `fis.conector.ver`, `fis.autorizaciones.ver`, asignar roles fiscales (T02) | Tenant; **no** puede aprobar tablas ni presentaciones si no tiene el rol de responsable fiscal |
| Operador de facturación | `fis.autorizaciones.ver/enviar/reintentar/consultar`, `fis.autorizaciones.previsualizar`, `fis.bandeja.ver/derivar`, `fis.ultimoComprobante.consultar` | Puntos de venta, servicios y sucursales asignados |
| Analista de datos de clientes | `fis.padron.consultar`, `fis.bandeja.ver` (excepciones de datos fiscales) | Sucursales/zonas asignadas |
| Analista de compras y pagos | `fis.retenciones.calcular/ver`, `fis.certificadosRetencion.ver/emitir`, `fis.padron.consultar`, `fis.exclusiones.editar` | Tenant (proveedores) |
| Tesorero | `fis.obligaciones.ver/pagar` (registro de pago, vía M14), `fis.rendiciones.ver` | Tenant |
| Operador de caja | Solo lectura indirecta: estado fiscal del comprobante al cobrar (M07); `fis.admPublica.ver` | Caja/sucursal asignada |
| Auditor / consejo | `fis.*.ver` (comodín de visibilidad, regla AL-08 de T03), `fis.reportes.exportar` (antes `fis.*.exportar`; PA-FIS-19), `fis.auditoria.ver` | Tenant, solo lectura |
| Responsable regulatorio (técnico/comercial) | `fis.reguladores.ver/generar/presentar`, `fis.reguladores.configurar` (conceptos del tenant) | Servicios asignados |
| Sistema (workers) | Identidad técnica por tenant: `fis:*` jobs | Tenant del job; nunca cruza tenants |
| API externa (modo pasarela) | Token de cliente con `fis.pasarela.enviar/consultar` | Tenant del token, puntos de venta habilitados al cliente |
| Socio (PWA) | Ninguna capability FIS; ve CAE, vencimiento de CAE y QR de sus comprobantes vía M19 | Propios |

**Reglas de permisos:** las acciones `aprobar`, `presentar`, `rectificar`, `reabrir` y `adoptar` exigen MFA reforzado (T02) y quedan auditadas con antes/después. La segregación mínima impide que el mismo usuario **genere y apruebe** una declaración o una adopción de tabla si el tenant activa `PRM-FIS-060` (doble control).

## 5. Requisitos funcionales

Convención de columnas: **Prioridad** N = Núcleo, E = Estándar, X = Extensión.

### 5.1 Tablas normativas, relevamiento fiscal y gobierno

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-001 | Catálogo de **tablas normativas fiscales** mantenido por la plataforma (tenant `PLATFORM`): cada versión con fuente (norma, organismo, URL, fecha de consulta), vigencia desde/hasta, estado (borrador, en revisión, publicada, retirada) y notas. | BASE §105-7, §52.1, §52.2, §61; AGR-010 | N | O4 | Adoptado | No existe ningún porcentaje, mínimo, código ni vencimiento fiscal en el código fuente; todos se leen de una versión publicada con fuente cargada. |
| RF-FIS-002 | **Adopción por tenant** de cada versión publicada con fecha efectiva y aprobación del responsable fiscal; sin adopción la versión no se aplica en producción. Notificación al tenant cuando la plataforma publica una nueva versión. | BASE §105-7, §52.4 | N | O4 | A validar (PA-FIS-12) | Un comprobante solo usa versiones adoptadas y vigentes a su fecha; la adopción queda auditada con usuario, fecha y versión anterior. |
| RF-FIS-003 | Tablas **extensibles** por tenant (tributos municipales, convenios, conceptos regulatorios, alícuotas determinadas): el tenant agrega filas con fundamento obligatorio; no puede editar filas de plataforma ni desactivar restricciones. | BASE §52.2, §52.4, §97.4 | N | O4 | Adoptado | Intentar editar una fila de plataforma devuelve 403; agregar una fila sin fundamento devuelve error de validación. |
| RF-FIS-004 | **Sincronización de tablas paramétricas ARCA** (`FEParamGetTiposCbte`, `TiposMonedas`, `TiposIva`, `TiposConcepto`, `TiposTributos`, `TiposDoc`, `TiposOpcional`, `TiposPaises`, `CondicionIvaReceptor`, `Actividades`, `Cotizacion`) por job de plataforma en homologación y producción, con diferencias y alerta de cambio. | RN-03 §3.6, §12.4; FIC 2.1 | N | O4 | Adoptado | Un cambio en la tabla de ARCA genera una versión borrador con el diff y una alerta al equipo normativo; nada cambia en producción sin publicación. |
| RF-FIS-005 | **Historia bitemporal**: fecha efectiva y fecha de registro de cada versión y adopción; reconstrucción de qué tablas, reglas y versiones se usaron en cada comprobante, retención o declaración. | AGR-010 | N | O4 | Adoptado | Dado un comprobante, la traza muestra versión de alícuota, padrón, convenio y mapeo usados; una corrección posterior no reescribe el original. |
| RF-FIS-006 | **Relevamiento fiscal del tenant** versionado (BASE §52.4): CUIT y condición del prestador, provincia, localidad, concesión, autoridad aplicable, servicios, tributos (impuesto, fundamento, base, alícuota, excepciones, tratamiento documental), modalidad de emisión y responsables de configurar, revisar y aprobar. Es requisito para habilitar facturación productiva. | BASE §52.4, §57, §63, §98 | N | O4 | Adoptado | Sin relevamiento aprobado, el ambiente de producción del conector ARCA no puede activarse. |
| RF-FIS-007 | **Calendario fiscal** por tenant generado desde la tabla normativa de vencimientos (por régimen, terminación de CUIT, jurisdicción) con alertas a responsables. | BASE §61 (vencimientos); FIC 2.3 | E | O8 | Adoptado | Cada obligación activa del tenant aparece con fecha de vencimiento y alerta a 7, 3 y 1 días (configurable). |
| RF-FIS-008 | Leyenda de responsabilidad en pantallas y archivos de declaraciones: "el sistema calcula y prepara; la presentación y responsabilidad son del contribuyente y su contador". | BASE §105-7 | N | O4 | Informado | La leyenda aparece en todas las pantallas PAN-FIS de declaraciones y en la cabecera del resumen de cada archivo. |
| RF-FIS-009 | **Simulación** de una nueva versión de tabla normativa sobre los comprobantes de un período (sin efectos) antes de adoptarla, con diferencias por comprobante. | BASE §52.1; AGR-010 | E | O4 | Adoptado | La simulación no crea documentos ni modifica totales; muestra totales antes/después y casos afectados. |
| RF-FIS-010 | **Auditoría** de toda configuración fiscal, adopción, cálculo, envío a ARCA, presentación y conciliación, por tenant, con antes/después y `requestId`. | BASE §61; AGR-016 | N | O4 | Informado | Toda acción con capability `configurar`, `aprobar`, `presentar` o `enviar` produce un registro de auditoría consultable. |
| RF-FIS-011 | La configuración de un **cargo/tributo** no habilita por sí cualquier concepto: catálogo aprobado con fundamento, servicio, jurisdicción y documento permitido; no se trasladan al socio tributos propios de la cooperativa. | BASE §52.2 (Res. SIyC 267/2024), §85 (Ley 10739) | N | O4 | Informado | El motor rechaza aplicar un tributo sin fundamento o fuera de su servicio/jurisdicción, con motivo explicado. |
| RF-FIS-012 | Reglas de **contenido permitido en facturas** por jurisdicción (ej. Ley provincial 10739 de Córdoba para energía, agua y saneamiento) como tabla normativa que bloquea rubros no permitidos. | BASE §85 [ESP5] | E | O7 | Adoptado | Un rubro no permitido para el servicio y jurisdicción queda bloqueado al configurar el concepto y al emitir. |

### 5.2 Perfil fiscal del tenant, condición de agente y padrón

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-013 | **Perfil fiscal** del tenant: razón social, CUIT, condición IVA, número y régimen de IIBB (local o Convenio Multilateral con jurisdicciones y coeficientes), inicio de actividades, domicilio fiscal, actividades ARCA, logo fiscal, versionado. | RN-09 V2 518–527, 706, 709; DFA | N | O4 | Adoptado | Los comprobantes toman los datos del emisor del perfil vigente a la fecha de emisión. |
| RF-FIS-014 | **Condiciones de agente**: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. | BASE §61 (FIS-001); RN-09 V2 2008–2011 | N | O4 | Informado | Un régimen solo se calcula si existe condición de agente vigente a la fecha de la operación. |
| RF-FIS-015 | **Validación de CUIT/CUIL** (11 dígitos y dígito verificador) en personas y proveedores; alerta configurable al confirmar el ABM. | RN-03 §5; RN-09 V2 2979 | N | O4 | Adoptado | Un CUIT con dígito verificador inválido no puede guardarse como CUIT; se muestra la causa. |
| RF-FIS-016 | **Consulta de padrón ARCA** (A13 y constancia de inscripción) para autocompletar razón social, domicilio fiscal, condición IVA, monotributo, actividades y estado de la clave, conservando fecha y resultado de la consulta como evidencia. | FIC 2.2; RN-03 §5, rec. 10 | N | O4 | A validar (PA-FIS-10) | Al ingresar un CUIT en alta de titular o proveedor, se proponen los datos de ARCA; el usuario confirma; la evidencia queda vinculada. |
| RF-FIS-017 | **CUIT a partir del DNI** (`getIdPersonaListByDocumento`): propone los CUIT/CUIL asociados al documento para que el usuario elija; la generación por algoritmo DNI+sexo queda solo como sugerencia no confirmada. | RN-03 §3.4, §5 | E | O4 | Adoptado | Nunca se informa a ARCA un CUIT generado por algoritmo sin confirmación de padrón o del usuario. |
| RF-FIS-018 | **Revalidación masiva periódica** de condición IVA y monotributo de titulares y proveedores contra padrón, con informe de diferencias y actualización con aprobación. | FIC 2.2; RN-03 §5 | E | O8 | A validar (PA-FIS-17) | El job produce un informe de diferencias; ninguna condición se cambia sin aprobación (si la PA se resuelve como recomendada). |
| RF-FIS-019 | **Padrón offline** de condición tributaria (archivo masivo de ARCA de ancho fijo: CUIT, razón social, IVA, monotributo) importable, con conversión a códigos (`MT`, `EX`, `NA`, `AC`, `NI`) y cruce con titulares y proveedores. | RN-03 §5 (`EMPAFIP`); CAT §5 | E | O8 | Adoptado | Importar el archivo crea una versión de padrón con fecha de publicación; el cruce lista diferencias por persona. |
| RF-FIS-020 | **Control de proveedores** contra padrón ARCA al darlos de alta/modificarlos y aviso si su certificado/constancia está fuera de fecha. | RN-09 V2 217, 218 | E | O8 | Adoptado | Con el control activo, un proveedor con condición distinta a la del padrón genera advertencia u obligación de corregir según configuración. |
| RF-FIS-021 | **Defaults fiscales de personas**: situación IVA por defecto (V2 2086) y situación IIBB por defecto (V2 2312) por tenant. | RN-09 | E | O4 | Adoptado | Un alta sin condición explícita toma el default del tenant y queda marcada "a validar". |
| RF-FIS-022 | **Receptor MiPyME**: marca de obligado a recibir FCE, umbral de importe para FCE (V2 2515) y consulta a ARCA de obligados, para que M05 elija FCE. | RN-03 §12.1 | E | O8 | A validar | Con receptor MiPyME y importe sobre el umbral vigente, la selección de comprobante propone FCE. |
| RF-FIS-023 | **Actividades ARCA** (nomenclador) asignables al servicio del titular, con filtro en cargos adicionales y posibilidad de informarlas en `Actividades` del request cuando ARCA lo exija. | RN-03 §5 (`ACTAFIP`), §3.6; CAT §5 | E | O4 | Adoptado | El catálogo de actividades sale de la tabla normativa sincronizada; la asignación a servicio se audita. |
| RF-FIS-169 | **Registro de obligaciones y exenciones propias del tenant como contribuyente** (no como agente; DEC-095): por entidad jurídica, cada registro indica impuesto o contribución, jurisdicción, actividad o sección alcanzada (actividad ARCA o provincial, servicios del tenant), tipo (`exemption`, `partialExemption`, `contribution`, `specialRegime`, `otherObligation`), fundamento normativo (norma, artículo, organismo, fecha de consulta y dictamen del contador), vigencia y adjunto de respaldo (`ownTaxObligations`, §7.39; RN-FIS-133). **El sistema no precarga normas:** cada registro lo da de alta el tenant cuando el contador lo confirma. Cuando una contribución se calcula sobre el capital, la base la provee M17 por entidad jurídica y fecha (`ins.capitalBase.get({ legalEntityId, asOf })`, RF-INS-109): el registro indica qué componente de la base usa (por ejemplo, capital integrado) y, si el contador lo indica, qué rubros de capital (`capitalItemId`); M06 crea la obligación al recibir el cierre de capital (`ins.capitalBase.closed`, EVT-INS-22) y la anula y recalcula si el cierre se reabre (`ins.capitalBase.reopened`) (*Reemplazado (10-11-2026, alineación con M17): "la base la provee M17 por servicio o por evento de capital"*); el registro alimenta el calendario fiscal (RF-FIS-007) y genera la obligación a pagar en `taxObligations`. Los casos citados en el contraste (exención de Ingresos Brutos de Córdoba para cooperativas eléctricas, Contribución Especial sobre el Capital Cooperativo, reforma de Ganancias 2026) quedan pendientes del contador (PA-FIS-25). | DEC-095; contraste `NucleoTransversal-Modelo` aporte A3 (§8.9) | E | O8 | A validar (PA-FIS-25) | Sin registros cargados, el tenant no tiene ninguna exención ni contribución propia activa. Un registro sin fundamento, sin dictamen del contador o sin adjunto no puede activarse. Una contribución sobre el capital integrado toma de M17 la base congelada del cierre (`final = true`) y crea la obligación con su vencimiento; si el cierre se reabre, la obligación no pagada se anula (`fis.obligation.cancelled`) y se recalcula con la base nueva; ningún registro modifica los tributos facturados al socio. *Reemplazado (10-11-2026): "Una contribución con base de capital por servicio toma de M17 la base del período".* |

### 5.3 Credenciales ARCA y autenticación WSAA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-024 | **Certificados por tenant y ambiente** (homologación/producción) en la bóveda de credenciales del tenant; en la base solo metadatos: CUIT, alias, emisor, número de serie, NotBefore/NotAfter, servicios autorizados (`wsfe`, `ws_sr_padron_a13`, `ws_sr_constancia_inscripcion`, otros), estado. | BASE §97.2; RN-03 §2.1, rec. 1; FIC 2.1; CNX bóveda | N | O4 | Informado | La clave privada nunca se guarda en la base ni en disco compartido; un usuario sin `fis.arca.configurar` no ve ni descarga el certificado. |
| RF-FIS-025 | **Generación de clave y CSR** dentro de la plataforma para que el tenant obtenga el certificado en ARCA, o carga de un PFX existente. | RN-03 rec. 1; DEC-053 | N | O4 | Adoptado (DEC-053; antes A validar PA-FIS-03) | El flujo completo (generar CSR → subir certificado emitido por ARCA → probar en homologación) se puede hacer sin exponer la clave privada. |
| RF-FIS-026 | **Alertas de vencimiento** de certificado a 30, 14, 7 y 3 días y vencido, a usuarios con capability; bloqueo preventivo de envíos con certificado vencido y mensaje accionable. | RN-03 §2.3, rec. 1; RN-09 V2 2925 | N | O4 | Adoptado | Con certificado vencido, la cola queda en "detenida por credencial" y el tablero muestra la causa, sin marcar errónea cada factura. |
| RF-FIS-027 | **WSAA**: obtención del TA por (tenant, CUIT representado, servicio, ambiente) con caché compartido entre workers, lock distribuido, `uniqueId` único, reutilización hasta su vencimiento, renovación anticipada y manejo del rechazo "ya posee un TA válido". | RN-03 §2.2, rec. 2 | N | O4 | Adoptado | Dos workers simultáneos producen una sola llamada a `loginCms`; un reinicio no pide un TA nuevo si el vigente está en caché. |
| RF-FIS-028 | **Ambientes separados** con URLs administradas por la plataforma (no por tenant); los tenants de demostración o sandbox solo operan en homologación; padrón también por ambiente. | RN-03 §2.1, rec. 1; FIC 2.1 | N | O4 | Adoptado | Un tenant demo no puede activar producción; las URLs de padrón no están fijas en producción. |
| RF-FIS-029 | **CUIT representado explícito** en la configuración (incluido el caso de delegación de un representante), nunca inferido del orden de relaciones del TA. | RN-03 §2.2, duda 9 | N | O4 | Adoptado | Con un TA de varias relaciones, el sistema usa el CUIT configurado y valida que esté entre las relaciones. |
| RF-FIS-030 | **Cliente técnico**: TLS 1.2 o superior, timeout configurable (90 s por defecto), `FEDummy`/`dummy` como verificación de salud del conector. | RN-03 §2.2, §3.6, §12.4 | N | O4 | Adoptado | El estado del conector muestra el resultado del último `FEDummy` por ambiente. |
| RF-FIS-031 | **Estado observable del conector** por tenant (AGR-021): último éxito, último error, certificado, TA vigente, cola pendiente, servicios de ARCA caídos. | AGR-021; FIC 2.1 | N | O4 | Adoptado | Ante una caída de ARCA, el tablero identifica la integración afectada sin marcar como erróneos a los socios. |
| RF-FIS-032 | Las credenciales fiscales están separadas de los tokens de BI/APIs; nunca se exponen por API ni en logs; rotación sin interrupción. | BASE §61 (organización e interfaces) | N | O4 | Informado | Búsqueda de secretos en logs y respuestas de API da cero resultados en las pruebas de seguridad. |

### 5.4 Puntos de venta y modalidades de autorización

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-033 | **Puntos de venta fiscales**: número, descripción, sistema de emisión ARCA (web service CAE, CAEA, CAI talonario), sucursal, servicio/canal, domicilio, estado (activo, pausado, baja); sincronización con `FEParamGetPtosVenta` (no bloqueados y sin fecha de baja). | BASE §97.2; RN-03 §3.6; CAT `PTOVENTA`; FIC 2.1 (0022, 0028, 0097) | N | O4 | Informado | Un punto de venta que ARCA informa bloqueado o dado de baja no puede usarse para autorizar. |
| RF-FIS-034 | **Modalidad por (tipo de comprobante × punto de venta)**: CAE, CAEA, CAI o CESP, con prioridad de asignación CAEA (si hay vigente y la modalidad está activa) → CAE → CAI → CESP. | RN-03 §4.1; CAT `COMPPOS` | N | O4 | Adoptado | La modalidad aplicada se registra en el comprobante (`authorizationKind`); un par sin modalidad no puede emitirse como fiscal. |
| RF-FIS-035 | **Pausar** un punto de venta: la cola no envía comprobantes de ese punto; alerta y auditoría. | RN-03 §3.1 (`PTOVENTA.PAUSAR`) | E | O4 | Adoptado | Comprobantes de un punto pausado quedan "pendiente — punto pausado". |
| RF-FIS-036 | **CAI**: registro del CAI vigente y su vencimiento por talonario/punto; bloqueo de emisión con CAI vencido. | RN-03 §4.4 | E | O4 | Adoptado | Con CAI vencido el comprobante no se emite y se informa el motivo. |
| RF-FIS-037 | **Consulta de último comprobante autorizado** (`FECompUltimoAutorizado`) y de un comprobante (`FECompConsultar`) a demanda. | RN-03 §3.5, §3.6; INV frmConsultaNumComAFIP | N | O4 | Adoptado | La pantalla devuelve número, fecha, importe, CAE y vencimiento informados por ARCA. |
| RF-FIS-038 | **Contraste de numeración** local contra ARCA antes de cada tanda: si ARCA tiene un número mayor al último autorizado localmente, la cola se detiene y se concilia. | FIC 2.1; RN-03 rec. 3 | N | O4 | Adoptado | Nunca se envía un número ya autorizado ni se saltea numeración. |

### 5.5 Cola de autorización CAE (WSFEv1)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-039 | **Cola de autorización** con estados explícitos (pendiente, validando, enviando, autorizado, autorizado con observaciones, rechazado, incierto, a conciliar, detenido) en lugar de bloqueo por bandera y *polling*. | RN-03 §3.1, rec. 3; FIC 2.1 | N | O4 | Adoptado | Cada comprobante fiscal tiene una única autorización con estado y su historial. |
| RF-FIS-040 | **Serialización** por (tenant, CUIT, punto de venta, tipo ARCA), en orden de número, con tandas de hasta el máximo de registros por request vigente (`FECompTotXRequest`). | RN-03 §3.1, rec. 3 | N | O4 | Adoptado | Dos workers no envían el mismo par en paralelo; la tanda no supera el máximo informado por ARCA. |
| RF-FIS-041 | **Validaciones previas**: código ARCA del tipo configurado y numérico; sin comprobante anterior pendiente del mismo par; numeración correlativa sin huecos; TA y certificado vigentes; punto no pausado; receptor completo; condición IVA del receptor mapeada; concepto y fechas de servicio; importes que cierran. | RN-03 §3.2 | N | O4 | Adoptado | Ante una falla previa el comprobante queda "detenido" con motivo exacto (ej. "hay un comprobante anterior pendiente: N"). |
| RF-FIS-042 | **Prevalidación fiscal en lote** (BASE §69): un caso configurado como factura A sin CUIT se identifica como `dict:fis.motivo.facturaASinCuit` ("No apto para emisión: falta CUIT del receptor") y se deriva a corrección; no se inventa el dato ni se cambia a B sin validación y trazabilidad. | BASE §69, §70 | N | O4 | Informado | En CU-LOT-01, las 2 excepciones quedan pendientes y las 98 aptas se autorizan; después de corregir, 100 emitidas y 0 duplicadas. |
| RF-FIS-043 | **Receptor**: `DocTipo` 80 con CUIT para comprobantes que exigen CUIT; tipo de documento mapeado (DNI 96, LE 89, LC 90, pasaporte 94, cédula 91, CUIL 86, CUIT 80, sin identificar 99); `DocTipo 99/DocNro 0` solo para consumidor final por debajo del umbral vigente de identificación. Sin CUIT genérico. Un receptor con identificación `documentPending` de M01 (persona migrada sin documento, DEC-099; M06 lee `identificationStatus` del `holderIdentifierSnapshot` que M05 copia de M01 en el comprobante, sin consultar a M01 por su cuenta) solo se informa como 99/0 en ese caso; en cualquier otro el comprobante se detiene, y M06 responde a M05 si el tipo de comprobante o un régimen de información que lo alcanza exige el documento (RN-FAC-162 de M05; la LQSP se trata como que lo exige mientras PA-FIS-24 siga pendiente). Al regularizarse la identificación en M01 (`per.person.identificationRegularized`, EVT-PER-27), M06 revalida los comprobantes `detained` por ese motivo (10-11-2026). | RN-03 §3.4, §12.1; RN-09 V2 2780; DEC-099 | N | O4 | Adoptado | Un consumidor final sobre el umbral sin documento queda detenido; nunca se envía 23333333333. Al llegar EVT-PER-27 de esa persona, el comprobante detenido se revalida y, con el documento cargado, pasa a `pending`. |
| RF-FIS-044 | **Concepto y fechas**: concepto 1 (productos), 2 (servicios) o 3 (ambos) según ítems; `FchServDesde/Hasta` = período facturado (o mes de emisión si no hay período); `FchVtoPago` = primer vencimiento cuando el concepto es 2 o 3. | RN-03 §3.4 | N | O4 | Adoptado | Una factura mensual de Internet de octubre informa servicio 01-10 a 31-10 y vencimiento de pago igual al primer vencimiento. |
| RF-FIS-045 | **Importes fiscales** (`ImpNeto`, `ImpOpEx`, `ImpTotConc`, `ImpIVA`, `ImpTrib`, `ImpTotal`) calculados en decimal desde las líneas del comprobante; reglas de clase C (sin IVA discriminado; exento al neto y `ImpOpEx = 0`); ajustes de cierre documentados (diferencia positiva menor al umbral al exento) sin violar reglas de clase. | RN-03 §3.4, §12.3, rec. 6 | N | O4 | Adoptado | `ImpTotal = ImpNeto + ImpOpEx + ImpTotConc + ImpIVA + ImpTrib` siempre; una factura C nunca sale con `ImpOpEx ≠ 0`. |
| RF-FIS-046 | **Alícuotas IVA** mapeadas por tabla normativa (0 % → Id 3, 2,5 % → 9, 5 % → 8, 10,5 % → 4, 21 % → 5, 27 % → 6); un porcentaje sin mapeo **detiene** el comprobante en lugar de descartarse en silencio. | RN-03 §3.4, §12.1 | N | O4 | Adoptado | Una alícuota 19 % configurada por error detiene el comprobante con "alícuota sin código ARCA". |
| RF-FIS-047 | **Tributos** mapeados explícitamente al Id ARCA (`FEParamGetTiposTributos`): 1 nacionales, 2 provinciales, 3 municipales, 4 internos, 5 IIBB, 6 percepción de IVA, 7 percepción de IIBB, 8 percepciones municipales, 9 otras percepciones, 13 percepción de IVA a no categorizado, 99 otros; sin fusionar tributos distintos en un mismo Id/descripción. | RN-03 §3.4, §12.2, rec. 7, duda 1 | N | O4 | Adoptado | Una tasa municipal se informa con Id 3 y una percepción de IVA con Id 6; ambos aparecen separados en Mis Comprobantes. |
| RF-FIS-048 | **Comprobantes asociados**: `CbtesAsoc` (tipo, punto, número, CUIT, fecha) para ND/NC y FCE; `PeriodoAsoc` cuando ningún asociado fue autorizado con CAE; ND/NC A y B sin asociados informan siempre `PeriodoAsoc`. | RN-03 §3.4, §12.1; CAT `RELACION_COMP` | N | O4 | Adoptado | Una NC por una factura autorizada informa el asociado; una NC por un período informa `PeriodoAsoc`. |
| RF-FIS-049 | **FCE MiPyME**: `FchVtoPago` (salvo NC y 202); opcionales 2101 (CBU, V2 2431), 2102 (alias, V2 2432) solo con valor; 27 (transferencia SCA/ADC según opción vigente) para 201/206/211; 22 (anulación S/N) en NC 203/208/213; CUIT asociado del emisor en 202 o anulación. | RN-03 §3.4, §12.1 | E | O8 | Adoptado | Una FCE 201 sale con CBU y alias de la cooperativa y con opcional 27 válido. |
| RF-FIS-050 | El modelo soporta `Actividades`, `Compradores`, `Opcionales`, moneda extranjera (`MonId`, `MonCotiz`, `CanMisMonExt`) y `CbteFchHsGen` aunque el piloto no los use. | RN-03 §3.6, §12.4 | E | O4 | Adoptado | El request se arma desde el modelo; agregar un opcional no requiere cambiar el código del conector. |
| RF-FIS-051 | **Respuesta**: con resultado `A` se graba CAE, vencimiento y observaciones **del detalle que corresponde** a cada comprobante; con `R`, códigos y mensajes; con `P`, se procesa por detalle. | RN-03 §3.5, §12.3 | N | O4 | Adoptado | Las observaciones de un comprobante nunca se toman de otro detalle. |
| RF-FIS-052 | **Tratamiento de errores ARCA**: 10016 → consultar `FECompConsultar` antes de reintentar y tomar el CAE si importe coincide; timeout o respuesta perdida → "incierto" y conciliación; 10040 → marcar asociados observados, reintentar con trazabilidad y aviso; 10242/10243 → detener y derivar a corrección del dato fiscal del receptor (sin forzar consumidor final). | RN-03 §3.5, rec. 3, rec. 5, duda 8; BASE §69 | N | O4 | Adoptado | Ningún comprobante cambia la condición IVA del receptor por un reintento; un incierto nunca se reenvía sin consultar. |
| RF-FIS-053 | **Idempotencia y reintentos** con *backoff* por (tenant, tipo, punto, número): un reintento nunca genera otro número ni otro CAE; tras un rechazo agrupado se reintenta individualmente. Ante un resultado `R`, FIS clasifica el rechazo en `rejectionKind` = `dataError` (error propio del comprobante) o `sequenceOnly` (rechazado solo porque un anterior del mismo punto y tipo no se autorizó) y lo informa a M05, que devuelve el comprobante a borrador o a la cola, libera el número y renumera desde el último autorizado (DEC-107; RN-FAC-164 de M05). El reenvío de un comprobante renumerado es una solicitud nueva con su `issueAttempt`, no un reintento. | AGR-016; RN-03 §3.5; DEC-035; DEC-107 | N | O4 | Adoptado | Repetir el job no produce efectos duplicados (prueba de reintento); un comprobante rechazado por un dato vuelve a borrador en M05 y libera su número, y los posteriores sin CAE se reenvían con números nuevos correlativos al último autorizado; ningún autorizado cambia (DEC-107). *Reemplazado (10-11-2026, DEC-107): "un comprobante rechazado se corrige y se reenvía con el mismo número asignado por M05 al emitir (DEC-035)".* |
| RF-FIS-054 | **Agrupación en rango** (`CbteDesde..CbteHasta`, receptor 99/0) de comprobantes B/C a consumidor final solo si el tenant la habilita y por debajo del tope vigente. | RN-03 §3.3, rec. 4; RN-09 V2 2712 | X | O4 | A validar (PA-FIS-04) | Con la opción apagada (por defecto) cada comprobante tiene su detalle y su CAE individual. |
| RF-FIS-055 | **Vista previa del request** que aplica todas las reglas según el código ARCA real (C, FCE, asociados), sin enviarlo. | RN-03 §3.4, §12.3; INV frmFacturacionElectronica (consultaPreviaAutorizar) | E | O4 | Adoptado | La vista previa coincide campo a campo con el request que luego se envía. |
| RF-FIS-056 | **Disparo**: automático (activable por tenant y por punto, V2 726) con auditoría de cada encendido/apagado; manual por selección; **espera sincrónica** breve para venta mostrador y cobranza con factura (V2 727). | RN-03 §3.1; RN-09 V2 726, 727; DEC-018 | N | O4 | A validar (PA-FIS-11) | En mostrador, si ARCA no responde dentro del tiempo máximo de espera, el comprobante pasa a contingencia CAEA o queda pendiente y no se entrega como fiscal (DEC-018). El apagado automático de la autorización nunca ocurre en silencio (ProCoop lo apagaba al quedar facturas bloqueadas). |
| RF-FIS-057 | **Alertas de pendientes** con más de N días (3 por defecto) y de rechazados sin tratar, en el tablero y al iniciar sesión de roles fiscales. | RN-03 §3.1; DFA (alerta "Hay facturas electrónicas pendientes de autorizar") | N | O4 | Adoptado | Un pendiente de 4 días aparece destacado en PAN-FIS-10 y en la campana del usuario fiscal. |
| RF-FIS-058 | Regla configurable de **comprobantes no cobrables** mientras haya otros comprobantes no autorizados de la misma cuenta (equivalente a V2 2769), publicada a M07/M19. | RN-03 §3.5 (`GetIdBloqueo`); RN-09 V2 2769 | E | O4 | Adoptado | Con la regla activa, M07 no permite cobrar el comprobante autorizado mientras exista otro pendiente de la cuenta, y lo explica. |
| RF-FIS-059 | **Conciliación con ARCA** (inconsistencias) por rango, período o punto: CAE distinto, importe distinto (tolerancia 0,02), inexistente en ARCA; propuesta de reparación con aprobación, informe de individuales y rangos. | RN-03 §3.7, §12.3 | N | O4 | Adoptado | La reparación nunca es silenciosa: cada cambio de CAE queda con evidencia de ARCA y aprobación. |
| RF-FIS-060 | **Tablero de autorizaciones** por estado, punto, tipo y fecha, con motivo de ARCA, acciones masivas (reintentar, consultar, derivar) y exportación. | FIC 2.1; INV frmFacturacionElectronica, frmProcesoAutomatico, frmEnvioPmovil | N | O4 | Adoptado | Los totales del tablero cuadran con los comprobantes fiscales del período. |
| RF-FIS-061 | **Datos de QR fiscal** (RG 4892: versión, fecha, CUIT, punto, tipo, número, importe, moneda, cotización, tipo y número de documento del receptor, `tipoCodAut` A para CAEA y E para CAE, código) y del **código de barras** ARCA, entregados a M05. | RN-03 §4.1, §7, rec. 13 | N | O4 | Adoptado | El QR de un comprobante CAEA lleva `tipoCodAut = A`; el de CAE, `E`. |
| RF-FIS-062 | **Transparencia fiscal** (Ley 27.743, RG 5614/2024): cálculo del IVA contenido y otros impuestos nacionales indirectos para comprobantes a consumidor final, con la exhibición que defina la tabla normativa. | BASE §52.2 [AR4] | N | O4 | Informado | Una factura B a consumidor final muestra "IVA contenido" igual a la suma del IVA de sus líneas. |
| RF-FIS-063 | **Eventos de resultado** a M05, M07, M15 y M19 (autorizado, rechazado, observado, incierto) para marcar emitido, habilitar cobro, contabilizar y publicar al socio. El lote no se marca emitido sin autorización confirmada. | BASE §97.2; AGR-016 | N | O4 | Informado | Un lote con 2 rechazos muestra 98 emitidos y 2 pendientes; M19 no publica los rechazados. |
| RF-FIS-064 | **Conservación de evidencia** de cada request/response ARCA (sin token, firma ni clave) por el plazo que defina T08. | AGR-023; RN-03 §3.5 | N | O4 | Adoptado | Para cualquier comprobante se puede descargar el XML de request y response enmascarados. |

### 5.6 CAEA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-065 | **Solicitud y consulta de CAEA** por período `yyyyMM` y quincena (`FECAEASolicitar` / `FECAEAConsultar`), anticipada por job dentro de la ventana de solicitud vigente. | RN-03 §4.3; BASE §97.2; FIC 2.1 | N | O4 | A validar (PA-FIS-01) | Antes del inicio de cada quincena el tenant con CAEA habilitado tiene su CAEA registrado. |
| RF-FIS-066 | **Asignación de CAEA** a comprobantes de puntos CAEA o en contingencia, vigencia por fechas desde/hasta y fecha tope de informe (corrige la inversión de criterio de ProCoop). | RN-03 §4.1, duda 3 | N | O4 | Adoptado | Un comprobante fuera del rango del CAEA no lo recibe. |
| RF-FIS-067 | **Informe CAEA** (`FECAEARegInformativo`) en tandas, con `CbteFchHsGen`, estado informado/rechazado por comprobante y totales informados. Un rechazo del informe no renumera el comprobante ni lo devuelve a borrador: se corrige y reinforma o se emite nota de crédito según la norma ([VERIFICAR] con el contador; DEC-107). | RN-03 §4.3, §12.3; DEC-107 | N | O4 | Adoptado | Todos los comprobantes CAEA quedan "informado" antes del plazo; los rechazados quedan en bandeja con su número original. |
| RF-FIS-068 | **CAEA sin movimiento** (`FECAEASinMovimientoInformar`) por punto de venta sin uso en la quincena. | RN-03 §4.3, rec. 8 | N | O4 | Adoptado | Un punto CAEA sin comprobantes queda informado sin movimiento. |
| RF-FIS-069 | **Contingencia**: activación manual o automática de CAEA ante caída prolongada de WSFE (umbral configurable), con evento y aviso. | BASE §97.2; RN-03 rec. 8; DEC-038 | E | O4 | A validar (PA-FIS-01) | En facturación masiva se emite y encola, se pausa solo la autorización y se usa CAEA si el tenant lo tiene habilitado (DEC-038). Con WSFE caído más de N minutos, el responsable recibe la propuesta de activar contingencia. |
| RF-FIS-070 | **Alertas de plazos** de informe CAEA y de comprobantes CAEA no informados. | RN-03 §4.3 | N | O4 | Adoptado | Un CAEA con comprobantes no informados a 2 días del plazo genera alerta. |

### 5.7 CESP, LQSP y RG 5746/2025

> **Vía de autorización de la LQSP (DEC-094, 10-11-2026):** la liquidación de servicios públicos se autoriza con **CESP**, separado del CAEA (PA-FIS-02, RF-FIS-071 a RF-FIS-074, RN-FIS-053, RN-FIS-056). La propuesta del documento externo `NucleoTransversal-Modelo` de autorizarla con CAE o CAEA no se adopta. Quedan pendientes del contador la norma que obliga a usar la LQSP, la vía de autorización vigente y el efecto de las RG 5003 y 5866/2026 (PA-FIS-24); si su respuesta cambia la vía, se registra una DEC nueva que reemplace a DEC-094. La RG 3571/2013 se sigue tratando como **régimen de información** (RCSP, RF-FIS-128), no como vía de autorización.

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-071 | **CESP** por rango de fechas y punto de venta, separado de CAEA, con validación de superposición correcta (incluida la contención total) y vencimiento. | RN-03 §4.2, rec. 9; CAT `CESPAFIP`; INV abm_CespAfip; DEC-094 | E | O7 | A validar (PA-FIS-02); DEC-094 mantiene el CESP como vía de la LQSP hasta la respuesta del contador (PA-FIS-24) | Un CESP nuevo contenido dentro de otro existente es rechazado. |
| RF-FIS-072 | **LQSP**: validación de autorización vigente con el **mismo criterio** en emisión, facturación masiva y anulación, para servicios marcados como LQSP y condiciones que la usan. Un servicio está marcado como LQSP cuando su versión de configuración publicada y vigente en M02 tiene `tenantServices.profile.billing.publicServiceSettlement = true` (RF-CAT-117; ex `SERVICIO.LIQ_AFIP`; DEC-093); M06 lee la marca y no la duplica. La vía de autorización es CESP (DEC-094). | RN-03 §4.2; RN-02 | E | O7 | Adoptado | Masiva, anulación y emisión rechazan por igual una LQSP sin autorización vigente. |
| RF-FIS-073 | **RG 5746/2025**: conjunto de datos fiscales de energía inyectada en la LQSP (clasificación del usuario-generador, potencia, kWh inyectados, precio, IVA, balance neto, crédito anterior, cesión, retribución y crédito final), que calculan M03/M04 y exhibe M05. | BASE MER-001, MER-002, §103.3 [MER18] | E | O7 | Informado | Una LQSP de un usuario-generador contiene los diez datos exigidos y se trazan a la cuenta de créditos. |
| RF-FIS-074 | Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. | RN-03 §4.2 | E | O7 | Adoptado | Sin CESP vigente aparece el aviso en el tablero fiscal. |

### 5.8 Condición IVA, clase de comprobante y alícuotas de IVA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-075 | **Catálogo de condiciones frente al IVA** sincronizado con `FEParamGetCondicionIvaReceptor` (código ARCA oficial), más configuración del tenant por condición: percibido (libro IVA), mínimo y base de percepción, código de padrón offline, código SIRE, comprobante sugerido. | RN-03 §7, §12.1; CAT `SITIVA`; INV abm_sit_iva | N | O4 | Adoptado | La condición "consumidor final" se informa con el código ARCA vigente (5), no con el semilla de ProCoop. |
| RF-FIS-076 | **Determinación de la clase** de comprobante por condición del emisor y del receptor y normativa (A, B, C, M, LQSP A/B, FCE), como servicio consumido por M05. La clase se resuelve **por renglón**: LQSP para los conceptos tarifarios de servicios que liquidan como servicio público (marca `tenantServices.profile.billing.publicServiceSettlement` de M02, RF-CAT-117, en la versión de configuración publicada y vigente del servicio) y para los conceptos con `conceptFiscalCases.publicServiceAccessory = true`; factura común para el resto. El servicio devuelve a M05 la clase de cada renglón para que el agrupador emita un comprobante por clase y nunca uno mixto (DEC-093; RN-FIS-122; PA-FIS-23). | BASE §69 [LOT-F1, LOT-F2]; DEC-093 | N | O4 | Informado | Emisor RI y receptor RI → A; emisor RI y receptor CF → B; emisor monotributo → C. Un candidato con energía (LQSP), tasa de alumbrado declarada accesoria e internet devuelve LQSP para energía y tasa y factura común para internet (DEC-093). |
| RF-FIS-077 | **Validación de factura A**: CUIT válido y consistente con padrón, condición del receptor compatible, emisor habilitado para A (o régimen A con leyenda/M según corresponda). Estados distinguibles: prevalidación bloqueada, rechazo, autorizada con observaciones, incierta. | BASE §69, §70 [LOT-F3] | N | O4 | Informado | La interfaz muestra los cuatro estados por separado; una observación no permite reemitir. |
| RF-FIS-078 | **Alícuotas de IVA** (0, 2,5, 5, 10,5, 21, 27; exento, no gravado, no alcanzado) con código ARCA y cuentas contables de ventas, compras y percepción. | CAT `ALI_IVA`; RN-01 §17.1; INV abm_ali_iva | N | O4 | Adoptado | Cada alícuota tiene código ARCA y mapeo contable antes de usarse. |
| RF-FIS-079 | **Matriz alícuota × condición**: porcentaje de IVA, segunda tasa (IVA 2) y percepción de IVA. **Condición opcional por uso del suministro (DEC-102):** una fila puede limitarse a una o más clases de uso (`vatRateMatrix.supplyUsageClasses[]`: `residential`, `commercial`, `industrial`, `rural`, `other`, la clase normalizada `premiseUsages.usageClass` de M01 §7.18 del uso que indica `premises.usageId` del inmueble del suministro; *antes `supplyUsageIds[]` con IDs del catálogo del tenant*); la condición está **desactivada por defecto** (PRM-FIS-125) y solo se activa por tenant y servicio cuando el contador confirme si corresponde el 27 % a responsables inscriptos según el uso (PA-FIS-26). Con la condición apagada, las filas con uso no se aplican (RN-FIS-073). | CAT `ALI_IVA_CF`; RN-01 §17.2; DEC-102 | N | O4 | Adoptado; la condición por uso queda A validar (PA-FIS-26) | Para cada par (condición, alícuota) se obtiene IVA1, IVA2 y percepción vigentes. Con PRM-FIS-125 activo para energía y una fila "RI + uso comercial" vigente, un RI con inmueble de uso comercial toma esa fila y uno de uso residencial toma la fila sin uso; con el parámetro apagado ambos toman la fila sin uso (valores de demostración, DEC-102). |
| RF-FIS-080 | **Asignación de alícuota al ítem**: tarifa → categoría → servicio (servicios) y producto (productos), con validación de existencia y vigencia en FIS. | RN-01 §17.1 | N | O4 | Adoptado | Un ítem sin alícuota resoluble detiene el cálculo con motivo. |
| RF-FIS-081 | **Cálculo de IVA y percepción de IVA**: IVA1 = neto × tasa; IVA2 si corresponde; percepción = (neto + IVA1) × tasa, o neto × tasa si la condición lo indica; percepción de producto solo a RI cuando la matriz no define percepción; exclusión por cuenta; mínimo de percepción por comprobante. | RN-01 §17.2 | N | O4 | Adoptado | Con neto ARS 10.000, IVA 21 % y percepción ficticia 3 % sobre neto+IVA, la percepción es ARS 363,00. |
| RF-FIS-082 | **IVA fijo** de ítems que conservan su IVA original (cuotas de financiación), IVA de refinanciaciones (devengamiento) y crédito fiscal en factura en cuotas (V2 2930). | RN-01 §17.2; RN-09 V2 2125, 2930 | E | O5 | Adoptado | Una cuota de financiación conserva la alícuota de la venta original aunque la tabla haya cambiado. |
| RF-FIS-083 | **Traza de cálculo** por comprobante: reglas, versiones, bases, alícuotas, mínimos y exclusiones aplicadas. | AGR-010 | N | O4 | Adoptado | Desde el comprobante se abre la explicación completa de cada línea impositiva. |
| RF-FIS-084 | **Código de impuesto IVA** para informes de composición de deuda y asientos (V2 543) como mapeo del catálogo de tributos. | RN-09 V2 543 | E | O5 | Adoptado | Los informes de composición de deuda separan IVA usando el mapeo. |
| RF-FIS-161 | **Clase fiscal "aporte de capital"** (cuota o integración de capital social facturada junto al servicio): concepto **no gravado** que no integra el neto del servicio, ni la base de IVA, percepciones de IVA, IIBB ni tributos municipales calculados sobre el neto; se expone en el comprobante en una sección propia "Aporte de capital" con leyenda configurable y ante ARCA (WSFE) se informa en `ImpTotConc` (no gravado), fuera de `ImpNeto`, `ImpOpEx` e `ImpTrib`; en el Libro IVA Digital va a la columna de conceptos no gravados. El registro del capital es de M17 y el asiento de M15 (RN-FIS-124; `conceptFiscalCases`). | HUECO-CAP-04; BASE §52.2; RN-FIS-032, RN-FIS-036 | N | O4 | Adoptado: el encuadre queda parametrizado en PRM-FIS-122 con default `untaxedInInvoice`; **requiere validación legal** con el contador de la cooperativa (HUECO-CAP-04) | Un comprobante con servicio ARS 10.000 + IVA 21 % y aporte de capital ARS 1.500 informa `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 1.500 y total 13.600; la percepción de IVA y el IIBB se calculan sobre 10.000. |
| RF-FIS-162 | **Caso fiscal de derechos de sepultura** (perfil CEM): tratamiento de IVA definido **por concepto** en `conceptFiscalCases` — (a) adquisición del derecho de uso; (b) mantenimiento periódico; (c) actos (inhumación, exhumación, reducción, traslado); cada uno con su clase (`gravado` con alícuota, `exento`, `noGravado`, `noAlcanzado`), fundamento y vigencia adoptados desde la tabla normativa; momento fiscal configurable para la adquisición financiada (cada cuota facturada con su IVA, por defecto, o factura total al adquirir con cuotas de financiación que conservan el IVA original, RF-FIS-082). El tratamiento fiscal es independiente del reconocimiento contable del ingreso (PA-CON-17, RN-CON-124 de M15) (RN-FIS-125). | HUECO-CEM-01; T12 ficha CEM; RF-SOC-055; PA-CON-17 | E | O10 | Adoptado ([VERIFICAR] encuadre de cada concepto con el contador) | Sin caso fiscal adoptado para los conceptos CEM del tenant, M04 no puede publicar la versión tarifaria del derecho (bloqueo con motivo); con el caso adoptado, un derecho en 24 cuotas factura cada cuota con la clase del concepto "adquisición" y el mantenimiento con la suya. |

### 5.9 Ingresos Brutos, padrones, CVP y jurisdicciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-085 | **Situaciones frente a IIBB** (exento, base mínima), **alícuotas IIBB** (rendir en facturación, impuesto, grupo), **matriz** situación × alícuota y **alícuota por comprobante** (con cálculo sobre IVA). | CAT `SITIBR`, `ALI_IBR`, `ALI_IBR_CF`, `ALI_IBR_COMP`; INV abm_Sit_Ibr, abm_ali_Ibr, abm_ali_ibr_comp | N | O4 | Adoptado | Las cuatro tablas se configuran con vigencia y se aplican en el cálculo. |
| RF-FIS-086 | **Percepción de IIBB en factura**: aplica si la alícuota es de "rendir en facturación" y la situación no es exenta; se cobra si la suma de netos alcanzados llega a la base mínima (situación) o al mínimo imponible (V2 758); sobre IVA si el comprobante lo indica. | RN-01 §17.2; RN-09 V2 758 | N | O4 | Adoptado | Una factura con neto alcanzado menor a la base mínima no lleva percepción; la traza lo explica. |
| RF-FIS-087 | **Padrones de alícuotas por CUIT** (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios públicos, V2 760 otros servicios) y **alícuota determinada** manual por cuenta. | RN-01 §17.2; RN-09; FIC 3.1, 3.2; CAT `IIBB_LUA`; INV frmLiquidacionPercepciones, frmLiquidacionPercepciones_BsAs, frmAlicuotaDeterminada | N | O4 | A validar (PA-FIS-09) | Una cuenta incluida en el padrón vigente percibe con su alícuota; una no incluida, con la alícuota de no incluidos. Córdoba en O4 y el resto de jurisdicciones como configuración en O8 (DEC-054). |
| RF-FIS-088 | **Validación de vigencia del padrón** antes de facturar y aviso al iniciar sesión (V2 2699). | FIC 3.1 (`ValidarLUA`); RN-09 V2 2699 | N | O4 | Adoptado | Con padrón vencido, la masiva queda bloqueada para los servicios alcanzados hasta importar uno vigente o aprobar excepción. |
| RF-FIS-089 | **Percepción IIBB en intereses entre vencimientos y recargos en caja** (V2 2826, concepto V2 2080) calculada por FIS para M07/M08. | RN-09 V2 2826, 2080 | E | O5 | Adoptado | El recargo cobrado en caja discrimina IIBB cuando el parámetro está activo. |
| RF-FIS-090 | **CVP** (Código de Validación Provincial) por punto de venta, comprobante y período, con leyenda, para imprimir en el comprobante. | DFA; FIC 3.1; CAT `CVPIIBB`; INV abm_Cvpiibb; BASE §97.2 | E | O4 | Adoptado | Un comprobante del punto y período con CVP vigente lleva el código y la leyenda. |
| RF-FIS-091 | **Convenio Multilateral**: jurisdicciones y coeficientes en el perfil, informe de bases imponibles y percepciones por jurisdicción como insumo de la declaración del contribuyente. | FIC 3.1 | E | O8 | Adoptado | El informe por jurisdicción cuadra con el libro IVA y las percepciones del período. |
| RF-FIS-092 | **Motor por jurisdicción configurable**: cada provincia es una configuración (padrón, régimen, formato de exportación), no un desarrollo. | FIC 3.2 | N | O4 | Adoptado | Agregar una jurisdicción nueva no requiere código si el formato existe en el catálogo. |

### 5.10 Percepciones nacionales y SICORE

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-093 | **Regímenes de percepción de IVA** aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales en el Libro IVA Digital. | RN-01 §17.2; RN-03 §8.3, §12.2; RN-09 V2 544 | N | O4 | A validar | Una percepción a no categorizado figura con su Id correcto en ARCA y en el libro. |
| RF-FIS-094 | **Exportación SICORE** de percepciones de ventas, retenciones a proveedores (impuesto y régimen configurables, ej. Ganancias) y datos de sueldos provistos por M16; formato decimal (V2 2991) e internacional (V2 2539); sin CUIT genérico. | RN-02 §13.3.1; RN-08 §3.5; FIC 2.3 | E | O8 | Adoptado | Un sujeto sin CUIT válido queda en el informe de errores del archivo, no con un CUIT inventado. |
| RF-FIS-095 | **Libro/informe de percepciones** que incluye todas las percepciones (IVA, IIBB, municipales y otras) por cuenta, CUIT, domicilio y comprobante. | RN-03 §12.5 | E | O4 | Adoptado | La suma del informe coincide con `ImpTrib` de percepciones de los comprobantes del período. |
| RF-FIS-096 | Opción "no incluir percepciones" en el comprobante CVLP (V2 141) como parámetro de exhibición. | RN-09 V2 141 | X | O8 | A validar | Con el parámetro activo, el CVLP no muestra percepciones. |

### 5.11 Retenciones como agente (motor invocado por M12/M14)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-097 | **Tipos de retención** configurables (IIBB, IVA, Ganancias, Seguridad Social) con régimen, mínimo imponible, mínimo de retención, valores fijos, banderas de suma/resta de componentes, factor, solo pago total, cálculo por ítem, acumulación (meses móviles o calendario), descuento anual del mínimo, numeración propia; **escalas** por tramo; habilitación global por impuesto (V2 2037, 2039, 2041, 2043). | RN-08 §3.1–3.3; CAT `RETE_TIPO`, `RETE_TIPO_BASE`, `CAT_RETG`; BASE §61 | N | O8 | Informado | La configuración reproduce cada ejemplo de RN-08 §3.3 con valores ficticios. |
| RF-FIS-098 | **Asignación** de tipos de retención a proveedores, productos y conceptos de compra. | RN-08 §3.1–3.2; CAT `PROD_SER_RET` | N | O8 | Adoptado | Solo se calculan los tipos asignados al proveedor y habilitados. |
| RF-FIS-099 | **Cálculo de base imponible** por factura a pagar: prorrateo en pago parcial, base por ítems vinculados o totales de cabecera, IVA presunto en comprobantes no discriminados y anticipos (V2 2310), no retener en comprobantes no formales (V2 410), acumulación de pagos y retenciones de la ventana. | RN-08 §3.2 | N | O8 | Adoptado | Un anticipo de ARS 121 con IVA presunto 21 % tiene base ARS 100. |
| RF-FIS-100 | **Cálculo del importe**: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención negativa) cuando corresponda. | RN-08 §3.3 | N | O8 | Adoptado | CU-FIS-01: base ARS 100.000 y retención ficticia ARS 2.000 producen pago neto ARS 98.000. |
| RF-FIS-101 | **Sin escala válida → error** explícito; el motor no crea ni persiste escalas implícitas. | RN-08 §3.3 (`ObtenerTrama`) | N | O8 | Adoptado | Un tipo sin escala devuelve "no se encontró una escala válida" y no modifica la configuración. |
| RF-FIS-102 | **Exclusiones, certificados de no retención y reducciones** por proveedor, régimen y vigencia, con respaldo y consulta de padrones de exclusión cuando existan. La identidad fiscal del sujeto retenido (CUIT y condición IVA) se lee de la persona de M01 del proveedor (`suppliers.personId`, obligatorio; DEC-097) o de su copia `suppliers.identitySnapshot`, y con esa CUIT se consultan padrones y exclusiones y se emite el certificado (`withholdingsApplied.supplierCuit` y `supplierPersonId`; 10-11-2026). | BASE §61; DEC-097 | N | O8 | Informado | Un proveedor con certificado de exclusión vigente no sufre retención; la traza cita el certificado. Si la CUIT de la persona cambia en M01, las retenciones nuevas usan la nueva y las ya confirmadas conservan la de su fecha. |
| RF-FIS-103 | **Período de información**: día límite configurable (V2 2045); después de ese día la retención se informa en el período siguiente. | RN-08 §3.3 | E | O8 | Adoptado | Con día límite 10, una retención del 12 se asigna al período siguiente. |
| RF-FIS-104 | **Certificados de retención**: numeración por tipo y punto de venta que reinicia cada año (punto de IIBB V2 2012), PDF, impresión automática por impuesto (V2 2038, 2040, 2042); distinción entre certificado interno y certificado oficial (ej. SIRE) con su código. | RN-08 §3.4; BASE §61; RN-09 | N | O8 | Informado | El certificado oficial registra su número/código de ARCA cuando se obtiene; el interno se identifica como tal. |
| RF-FIS-105 | **Anulación de OP**: retenciones anuladas (conservadas, importes en cero) y, si estaban declaradas, rectificativa. | RN-08 §3.4; BASE §61 | N | O8 | Adoptado | Anular una OP con retención ya presentada abre un borrador de rectificativa. |
| RF-FIS-106 | Controles: modificación manual de retenciones solo con permiso y motivo (V2 2836); código de régimen obligatorio (V2 2813); no permitir anticipos en retenciones (V2 409); importación de retenciones de proveedores con base mínima (V2 2542); informe particularizado de retenciones (V2 406). | RN-09 | E | O8 | Adoptado | Un cambio manual queda con motivo y valor calculado original. |
| RF-FIS-107 | **SIRE** F2004/F2005 (Seguridad Social y regímenes alcanzados) con código SIRE de la condición IVA del proveedor; exportación de seguridad social. | RN-08 §3.5; FIC 2.3; BASE §61 [FIS-F2] | E | O8 | Adoptado | El archivo SIRE del período cuadra con las retenciones SUSS practicadas. |
| RF-FIS-108 | **Obligación fiscal** por régimen y período: importe, vencimiento, estado (pendiente, pagada, conciliada), pago vía M14 y conciliación con M15. | BASE §61 | N | O8 | Informado | Pagar en M14 cambia la obligación a pagada solo con el movimiento confirmado. |
| RF-FIS-109 | "Presentación automática al agregar retenciones" (V2 2952) se reemplaza por creación automática del **borrador de declaración** del período. | RN-09 V2 2952 | E | O8 | Adoptado | Al confirmar una retención se actualiza el borrador; nunca se marca presentado. |
| RF-FIS-110 | **Retenciones sufridas**: catálogo de tipos con cuenta contable, validación (régimen, certificado, CUIT del agente) para que M07 las registre en cobros, y consolidación para informes y crédito. | CAT `RETS_TIPO`; INV abm_Rets_Tipo, frmCargaRetenciones; BASE §61 | E | O5 | Adoptado | Un cobro con retención sufrida sin tipo válido es rechazado por M07 con el motivo provisto por FIS. |
| RF-FIS-111 | **Ganancias 4.ª categoría, F.931 y LSD** se liquidan en M16; FIS solo recibe los datos para SICORE de sueldos y muestra las obligaciones en el calendario. | BASE §104 (SUE-006, SUE-007); RN-02 §13.3.1 | E | O9 | Adoptado | El SICORE de sueldos usa los importes de M16 sin recalcularlos. |

### 5.12 Libros IVA, Libro IVA Digital y Mis Comprobantes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-112 | **Libro IVA Ventas** por período con criterios: facturado; percibido (para condiciones con percibido, por cobros y refinanciaciones); facturado y percibido (prorrateo por saldo); cuotas facturadas vencidas; por fecha de emisión o vencimiento (V2 2476). | RN-03 §8.1 | N | O4 (facturado) / O8 (resto) | A validar (PA-FIS-06) | El total de IVA débito del libro coincide con los comprobantes autorizados del período en el criterio elegido. |
| RF-FIS-113 | **Tipos de informe**: tradicional (con variante rubricado), IVA por alícuota, neto por alícuota, neto e IVA por alícuota, agrupado por tipo de factura (grupo IVA), por actividad, percepciones, consumos relevantes. | RN-03 §8.1, §12.5 | E | O8 | Adoptado | Cada tipo cuadra en totales con el tradicional para el mismo filtro. |
| RF-FIS-114 | **Filtros**: tipo de factura, comprobante, situación IVA, servicio, sucursal, interno/fiscal, solo créditos, localidad, grupo contable, titular activo, facturación mensual/diaria (V2 2605). | RN-03 §8.2; RN-09 | E | O8 | Adoptado | Los filtros se combinan y se guardan como vista. |
| RF-FIS-115 | **Reglas de armado**: solo comprobantes fiscales; exclusión de prescripción de deuda; signo por débito/crédito; separar ítems financiados (V2 2972); en percibido informar total del IVA (V2 3110); carátula separada (V2 2325); valor por defecto de separar comprobantes (V2 832); columnas 10,5/21/27/otros y todas las alícuotas en los archivos. | RN-03 §8.2, §12.5; RN-09 | N | O4 | Adoptado | Un comprobante con 2,5 % aparece en "otros" en el informe y con su código propio en el archivo digital. |
| RF-FIS-116 | **Carátula**: totales de débito y crédito, gravado e IVA por condición y alícuota, LQSP aparte. | RN-03 §8.2, §12.5 | E | O4 | Adoptado | La carátula suma igual que el detalle. |
| RF-FIS-117 | **Cierre del período** del libro: snapshot inmutable; reapertura con autorización y motivo; rectificación vinculada. | AGR-010, AGR-015 | N | O8 | Adoptado | Un comprobante autorizado después del cierre aparece como "posterior al cierre" y no altera el snapshot. |
| RF-FIS-118 | **Libro IVA Compras** desde los comprobantes de M12, con informe personalizado (V2 382), IVA no tomado como gasto (V2 2890), porcentaje de IVA por sección del plan (V2 2902). | RN-03 §9; RN-09 | E | O8 | Adoptado | El crédito fiscal del libro coincide con los comprobantes de compra del período. |
| RF-FIS-119 | **Libro IVA Digital** (RG 4597): archivos de ventas (comprobantes y alícuotas) y compras (comprobantes y alícuotas) con las reglas de formato heredadas de RG 3685. | RN-03 §8.3, §9; FIC 2.3 | N | O8 | Adoptado | El archivo pasa la validación propia (RF-FIS-121) y se importa en el aplicativo de ARCA en la prueba de homologación del tenant piloto. |
| RF-FIS-120 | **Reglas de formato LID/RG 3685**: tipo 3 dígitos; punto 5 (00000 para 33, 99, 331, 332); número 20; comprador 80 con CUIT si tiene 11 dígitos y la condición no es CF ni no categorizado; 99 con número 0 hasta el umbral; nombre 30; moneda PES y cambio 0001000000; vencimiento de pago en ceros para 60, 61, 81, 82, 83, 201, 203, 206, 208; negativos en créditos 17, 18, 60, 61, 99; percepciones de no categorizados como nacionales; código de operación N/E/espacio; alícuota 0003 si IVA 0 y base menor a 3; fecha de vencimiento si V2 2692 (corregido para que funcione). | RN-03 §8.3, §12.5; RN-09 V2 2692 | N | O8 | Adoptado | Cada regla tiene un caso de prueba con línea esperada. |
| RF-FIS-121 | **Validación de archivos** generados: análisis por línea (largo fijo, 266 caracteres en RG 3685) y por correlatividad, informando el **rango faltante completo**. | RN-02 §13.3.1 | E | O8 | Adoptado | Un salto de 3 números informa los tres faltantes. |
| RF-FIS-122 | **Mis Comprobantes**: importar CSV actual de ARCA (y Excel heredado) de emitidos y recibidos; comparar con libros de ventas y compras por código, punto y rango de número. | RN-03 §9, §12.6, rec. 11; FIC 2.4 | E | O8 | Adoptado | El import acepta ambos formatos y rechaza filas mal formadas con su número de fila. |
| RF-FIS-123 | **Resultados de la conciliación**: inexistente en CoopApps, inexistente en ARCA, diferencias mayores a la tolerancia (ARS 1 por defecto) en neto, no gravado, exento, IVA (todas las alícuotas), percepciones y total; signos correctos en notas de crédito de compras. | RN-03 §9, §12.6 | E | O8 | Adoptado | Un comprobante con dos alícuotas no genera diferencia falsa de IVA. |
| RF-FIS-124 | **Comprobantes recibidos**: verificación de CAE/CAI de proveedores al cargar facturas de compra (V2 2977), advertencia de comprobantes no autorizados según situación IVA (V2 2365). | RN-09 V2 2977, 2365 | E | O8 | Adoptado | Una factura de compra con CAE inexistente en ARCA genera advertencia en M12. |

### 5.13 Regímenes informativos y presentaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-125 | **Catálogo de regímenes** (tabla normativa con formato y versión): Libro IVA Digital RG 4597; RG 3685 (CITI, histórico); RG 1361 duplicados electrónicos; RG 3349 consumos relevantes; RG 3571 RCSP y variante RG 46/2019 con generadores; RG 5746/2025 (aplicativo RCSP 2.0); Circular 70/2021 ERSeP; SICORE; SIRE F2004/F2005; SIRCAR; ARBA; Santa Fe; La Pampa; Río Negro; DGR Córdoba/SILARPIB; retenciones municipales; RG 2177 (sin implementación en ProCoop). | RN-03 §8.3; RN-02 §13.3; FIC 2.3; MER-002; RN-08 §3.5 | N | O8 | Adoptado | Cada régimen activo del tenant tiene formato, versión, período y vencimiento. |
| RF-FIS-126 | **Generación de declaración** por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. | BASE §61; MER-002 | N | O8 | Informado | Regenerar el mismo período sin cambios produce el mismo hash. |
| RF-FIS-127 | **Registro de presentación**: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. | BASE §61, MER-002 | N | O8 | Informado | Exportar no marca presentado; presentar exige acuse o número de transacción. |
| RF-FIS-128 | **RG 3571 RCSP / RG 5746/2025**: rendición de comprobantes de servicios públicos con detalle de generadores, análisis por línea y correlatividad. | RN-03 §8.3; RN-02 §13.3.1; MER-001, MER-002 | E | O7 | A validar (PA-FIS-07) | El archivo incluye los datos de energía inyectada para los usuarios-generadores. |
| RF-FIS-129 | **RG 3349 consumos relevantes** con opción de incluir conceptos asociados al servicio (V2 2358). | RN-03 §8.3; RN-09 V2 2358 | E | O8 | Adoptado | El archivo lista los consumos sobre el umbral vigente de la tabla normativa. |
| RF-FIS-130 | **RG 1361** duplicados electrónicos. | RN-03 §8.3 | E | O8 | Adoptado | El archivo incluye todos los comprobantes del período con sus tributos bien clasificados. |
| RF-FIS-131 | **SIRCAR**: percepciones y retenciones de IIBB por jurisdicción (Córdoba, Río Negro; 904 con constancia), versión de formato (v12 o anterior), validación de CUIT con lista de errores. | RN-02 §13.3.1; FIC 3.1; INV frmExportarSIRCAR | E | O8 | Adoptado | Un CUIT inválido aparece en la lista de errores y no aborta en silencio. |
| RF-FIS-132 | **Exportadores provinciales y municipales**: ARBA (nombre `AR-<cuit>-AAAAMM<quincena>-6-LOTE1`), A122R (`ER-…-LOTE00001`), Santa Fe, La Pampa (todo del mismo mes), Río Negro, DGR (V2 2445, 2935) y SILARPIB, retenciones municipales (registros C/D/P), percepciones BsAs (V2 2924), FEDECOBA como exportación contable (M15). | RN-02 §13.3.1; FIC 3.2; RN-09; DEC-054 | E | O8 | Adoptado (DEC-054; antes A validar PA-FIS-09) | Cada exportador se activa por configuración de jurisdicción. |
| RF-FIS-133 | **Alertas de vencimiento** de cada declaración y de rechazos sin rectificar. | BASE §61 | E | O8 | Adoptado | Una declaración rechazada sin rectificativa a 2 días del vencimiento alerta al responsable. |

### 5.14 Conceptos por cuenta y orden de terceros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-134 | **Convenios** con el organismo beneficiario: CUIT, fundamento normativo, vigencia, base, alícuota o importe, servicio y documento en que puede incluirse, forma de exhibición, comisión de cobranza si existe, cuenta de pasivo; sin convenio y fundamento cargados el motor bloquea el concepto. | BASE §97.4; FIC 9.2; INV abm_Terceros | N | O4 | Informado | Un concepto de alumbrado público sin convenio vigente no puede facturarse. |
| RF-FIS-135 | **Exhibición separada** en el comprobante del cargo propio y del concepto de terceros; tratamiento fiscal del concepto de terceros (no gravado/no ingreso propio, según convenio). | BASE §97.4, §52.2 | N | O4 | Informado | El PDF muestra la sección "por cuenta y orden de terceros" con cada organismo. |
| RF-FIS-136 | **Pasivo con el tercero**, no ingreso propio (evento a M15). | BASE §97.4 | N | O5 | Informado | El asiento de emisión acredita el pasivo del convenio. |
| RF-FIS-137 | **Importaciones de terceros** que realiza M05 (alumbrado público IAL, Excel EMA, tasa verde SAM, emergencias EME, A.M.A. CT1 con concepto V2 2284, farmacia FAR con titular V2 2721, celulares CEL, gas importado, telefonía revendida PR1, datos extra OSSE V2 2081) validan convenio y fiscalidad en FIS. | RN-02 §11.2–11.4; FIC 9.2; RN-09 | E | O4 | Adoptado | Una importación con un concepto de terceros sin convenio rechaza esas filas con motivo. |
| RF-FIS-138 | **Imputación de pagos parciales** entre conceptos propios y de terceros según la política aprobada. | BASE §97.4 | N | O5 | A validar (PA-FIS-05) | Un pago parcial de ARS 5.000 sobre una factura de ARS 10.000 con ARS 1.000 de terceros imputa ARS 500 al tercero (prorrata). |
| RF-FIS-139 | **Rendición periódica**: liquidación de lo cobrado por convenio y período (base, comisión, neto a rendir), reporte para el organismo, orden de pago en M14 y conciliación. | BASE §97.4; FIC 9.2; INV frmResultadosCuotaTerceros; T10 REP-BIA-023 (rendición de alumbrado al municipio) | N | O5 | Informado | La rendición cuadra con los cobros imputados al tercero en el período. |
| RF-FIS-140 | **FECESCOR**: rendición de facturas de terceros y de tarjeta (número de sucursal V2 68, lote V2 3039, pago de resumen en canal web V2 3096, entidad de terceros V2 3114, correos V2 3158, código de propiedad V2 3190). | FIC 9.1; RN-11 §4; RN-09 | E | O8 | A validar (PA-FIS-16) | El archivo FECESCOR del período cuadra con los cobros de la entidad configurada. |
| RF-FIS-141 | **Tributos municipales**: catálogo que distingue tasas por cuenta del municipio (terceros) de tributos propios de la cooperativa (que no se trasladan al socio sin fundamento). | BASE §52.2, §97.4 | N | O4 | Informado | Un tributo propio marcado como no trasladable no puede asignarse como cargo al socio. |
| RF-FIS-142 | **Informe de impuestos facturados por categoría** con selección guardada de productos y servicios por servicio e impuesto. | RN-03 §12.7 (`IMPUESTOS_X_CAT`) | X | O8 | Adoptado | La selección guardada se recupera exactamente (corrige el cruce de listas de ProCoop). |
| RF-FIS-163 | **Regla de clasificación tributo propio / tributo de terceros / concepto de terceros** para cada definición del catálogo (`taxDefinitions.nature`) y para la migración de `IMPUESTO`/`CLASESER` (T07, M02; `CON_TASAS` solo si el perfilado de T07 encuentra una fila usada en facturación, porque la tabla es de Compras y va a `purchaseConcepts` de M12, HUECO-TAS-03; antes "`IMPUESTO`/`CON_TASAS`/`CLASESER`"): se decide por el organismo de `IMPUESTO.ORIGEN` (`level`) y por la existencia de convenio vigente (`thirdPartyAgreements`) según RN-FIS-126; las filas que no resuelven quedan en una bandeja de clasificación pendiente y no se publican. | HUECO-TAS-03; RF-FIS-134, RF-FIS-141; BASE §52.2, §97.4 | N | O7 (DEC-089; antes O11) | Adoptado | La tasa hospital (organismo municipal/hospital con convenio) se clasifica como concepto de terceros; un tributo provincial que la cooperativa percibe como agente queda `perception`; una fila de `IMPUESTO` sin organismo ni convenio queda pendiente con motivo (antes el ejemplo citaba una fila de `CON_TASAS`, que ahora va a Compras). |
| RF-FIS-164 | **Clasificación del saldo de conceptos de terceros para mora**: el saldo impago de cada concepto de terceros se identifica como tal (por `thirdPartyAgreementId`) y **se excluye por defecto del saldo elegible de mora** de M08 (RF-MOR-068); solo se incluye si el convenio lo autoriza (`moraPolicy.includeInEligibleBalance = true`); recargos e intereses sobre ese saldo solo si el convenio los define (`moraPolicy.surcharge`), y lo cobrado por ellos se rinde o queda según el convenio (RN-FIS-127). | HUECO-TAS-02; BASE §97.4; RF-FIS-138 | N | O6 | Adoptado | Una cuenta con ARS 9.000 propios y ARS 1.000 de alumbrado vencidos tiene saldo elegible de mora ARS 9.000 con el convenio por defecto; con `includeInEligibleBalance = true`, ARS 10.000; sin `surcharge` en el convenio, el interés de mora no se calcula sobre los ARS 1.000. La marca de corte (`moraPolicy.allowServiceCut` con norma validada) es independiente y la regula RN-FIS-129. |
| RF-FIS-165 | **Clase fiscal "depósito en garantía"** (por ejemplo, el del préstamo ortopédico de M18 o la garantía de M08): concepto fuera de la base imponible y no gravado (`conceptFiscalCases.caseCode = guaranteeDeposit`, `fiscalClass = outsideTaxBase`), excluido de IVA, percepciones, IIBB y tributos sobre el neto; se informa como no gravado o fuera del comprobante fiscal según PRM-FIS-124 (RN-FIS-128). | HUECO-OTR-04; RN-CON-123; RF-FAC-176 | N | O10 | Adoptado ([VERIFICAR] con el contador de la cooperativa piloto) | Un comprobante con servicio ARS 10.000 + IVA 21 % y depósito en garantía ARS 50.000 (valores ficticios) informa `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 50.000 y total 62.100; la percepción se calcula sobre 10.000. |
| RF-FIS-166 | **Marca de corte en el convenio de terceros**: `thirdPartyAgreements.moraPolicy.allowServiceCut` (default `false`) con norma habilitante `cutNormativeRef` validada; se publica a M08 junto con las marcas de saldo elegible y recargo (RN-FIS-129). | HUECO-ALU-01; RN-MOR-141; RN-MOR-142 | N | O6 | Adoptado | Con convenio de alumbrado sin marca de corte, una cuenta que solo debe alumbrado no entra en la lista de corte de M08; con `allowServiceCut = true` pero norma `pending`, tampoco; con norma `validated`, M08 puede considerarla. |
| RF-FIS-167 | **Emisión fiscal por entidad jurídica** (DEC-064): perfil fiscal, CUIT, credencial ARCA, puntos de venta, CAEA/CESP, libros IVA, regímenes y obligaciones por `legalEntityId` (RN-FIS-130). T04 guarda solo los datos legales básicos de la entidad; el perfil fiscal completo es de M06 y se construye en O4 (RF-CFG-138 de T04); M06 consume EVT-CFG-19 para mantenerlos alineados (RN-FIS-131). | DEC-064; T05 RN-DAT-008; RF-CFG-138 | N | O4 | Adoptado | Un tenant con LE-01 y LE-02 tiene dos perfiles fiscales, dos certificados y el punto de venta 0001 en ambas; un comprobante de LE-02 se autoriza con el certificado y CUIT de LE-02 y figura solo en el Libro IVA de LE-02. |
| RF-FIS-168 | **Mantenimiento mixto de padrones** (ex PA-CFG-05 de T04, trasladada con CTR-DAT-13): los padrones públicos (padrón offline ARCA, padrones provinciales de descarga libre) los ingesta la plataforma y los adoptan los tenants; los que solo se descargan con la credencial del agente de recaudación los importa o integra cada tenant (`taxpayerRegistries.maintainedBy`, RN-FIS-132; PA-FIS-18). | PA-CFG-05; RF-CFG-102 (reemplazado por M06); CAT `IIBB_LUA`, `EMPAFIP` | N | O4 | Adoptado (PA-FIS-18) | El padrón offline ARCA cargado por la plataforma queda disponible para LE-01 de TEN-001 y TEN-002 sin reimportar; el padrón de Córdoba que exige la clave del agente solo lo importa cada tenant y no es visible para otro. |

### 5.15 Informes a entes reguladores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-143 | **Catálogo de informes regulatorios** por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. | MER-014; FIC 8 | E | O7 | Informado | Cada informe activo tiene organismo, servicio, formato y vencimiento. |
| RF-FIS-144 | **ERSeP**: Circular 70/2021 (régimen de ventas, código de empresa V2 737), archivo de consumos, informe de pérdidas por servicio, informe de servicios (titulares), DNU 311/2020 riesgo de corte (instancias V2 2203/2204), tarifa social 166/16, 296/16 y 617. | RN-11 §4; FIC 8.1; RN-03 §8.3; RN-09; T10 REP-BIA-018 (energía), REP-BIA-020 (agua), REP-BIA-021 (saneamiento, cuando el regulador es ERSeP) | E | O7 | A validar (PA-FIS-14) | Los archivos ERSeP del período se generan con el código de empresa configurado. |
| RF-FIS-145 | **ENARGAS/ENReGE**: protocolo SARI (FDU, DET, CMD, USR, RAU, FDC, FDD, RZF-DS, SUP) y FCU-DS (FaC, Sub, FaD, CoC, Usr, FaV, SICC), tablas maestras por protocolo (V2 2603), matrícula como identificador (V2 3174), concepto de percepción (V2 2256), entidad, contrato y comisión (V2 2257–2260), excedentes (V2 2728), subdistribuidor (V2 2254), Excel de morosidad y facturas, mapeo de categorías y segmentación. | RN-02 §13.1; FIC 8.2; RN-11 §4; INV frmEnargasPEN2067, frmEnargasConceptos, frmEnargasTablas; T10 REP-BIA-022 | E | O7 | A validar (PA-FIS-14) | El paquete FCU-DS del período se genera con nombres y separadores del protocolo. |
| RF-FIS-146 | **ENACOM**: configuración, por servicio TIC (fija, móvil, Internet, TV), de servicios principales, servicios, productos e impuestos que componen cada informe, guardada en CoopApps (no en archivo del servidor); informes vigentes que defina la tabla normativa. | RN-02 §13.2; FIC 8.3; DFA; INV frmEnacom; T10 REP-BIA-015 (Internet), REP-BIA-016 (telefonía), REP-BIA-017 (televisión) | E | O7 | A validar (PA-FIS-13) | La configuración se versiona por tenant y alimenta el informe. |
| RF-FIS-147 | **Secretaría de Energía**: informe de energía y de usuarios-generadores (energía inyectada). | FIC 8.4; RN-11 §4; INV frmInformeSecretariaElectrica; T10 REP-BIA-019 | E | O7 | Adoptado | El informe de generadores cuadra con las lecturas de inyección del período. |
| RF-FIS-148 | **Indicadores de calidad** de servicio y de atención (de M09/M10) incluibles en informes regulatorios cuando el regulador los exija. | MER-014; T10 REP-BIA-015 a REP-BIA-018, REP-BIA-020 a REP-BIA-022, REP-BIA-024 (calidad del agua) | X | O7 | Adoptado | Un informe puede incluir un indicador del catálogo T10 con su fórmula. |
| RF-FIS-149 | **Presentación y acuse** de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. | MER-014; T10 REP-BIA-015 a REP-BIA-024 | E | O7 | Informado | Un informe regulatorio no figura presentado sin acuse. |
| RF-FIS-150 | Mapa de **responsabilidad regulatoria** por servicio (regulador vs prestador vs autoridad tarifaria; ERSeP no rige todo el gas; ENReGE asume funciones federales antes de ENARGAS/ENRE) en el perfil del tenant. | BASE §85; T10 REP-BIA-015 a REP-BIA-024 (un código por organismo y servicio, §15.5.1) | E | O7 | Informado | Cada servicio del tenant indica su regulador y autoridad vigentes. |

### 5.16 Comprobantes de administración pública

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-151 | **Selección** de facturas impagas de cuentas de organismos públicos (u otras liquidadas en bloque) por período o fecha de emisión, con filtros (empresa postal, cuenta, titular, tipo de factura, servicio, rango de vencimiento) y datos de consumo, medidor y domicilio del suministro. | RN-03 §10; INV frmComprobnatesAdministracionPublicaRAW | E | O5 | Adoptado | La selección muestra consumo total por factura y servicio. |
| RF-FIS-152 | **Guardar selección** con reemplazo controlado del período/fecha (sin duplicados), aviso si ya existe una selección y eliminación de comprobantes elegidos. | RN-03 §10, §12.7 | E | O5 | Adoptado | Guardar dos veces la misma fecha no duplica registros. |
| RF-FIS-153 | **Vista para cobro en caja** (M07) filtrable por período, grupo contable y "recibos de empleados" (cuentas asociadas a legajos para descuento por recibo de sueldo, M16). | RN-03 §10; INV frmComprobantesAdministracionPublicaRAWConsulta | E | O5 | Adoptado | M07 cobra la selección y M16 recibe los descuentos de empleados. |

### 5.17 Modo pasarela (autorización para sistemas externos)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-154 | **Modo pasarela**: autorizar comprobantes generados por sistemas externos mediante API (`/api/v1/ext/fis/...`) e importación CSV (diseño de 46 columnas posicionales con separador configurable V2 2497), sin carpetas compartidas. | RN-03 §1, §6, rec. 12 | X | O11 | A validar (PA-FIS-08) | Un sistema externo envía un comprobante por API y consulta su CAE con idempotencia. |
| RF-FIS-155 | **Validaciones del modo pasarela**: duplicados, reemplazo de pendientes no procesados, comprobante relacionado de 16 caracteres (tipo, punto, número) con CUIT del emisor para 203 y 208, hasta 3 alícuotas y 3 tributos en CSV (sin límite en API), anulado. | RN-03 §6, §12.3 | X | O11 | A validar (PA-FIS-08) | Un comprobante ya autorizado no se reemplaza; solo se actualiza su origen. |
| RF-FIS-156 | **Resultado del modo pasarela**: por API o archivo de salida con tipo, punto, número, fecha, importe, CAE, vencimiento y error; marcas de exportado/error que se reexportan al autorizar. | RN-03 §6 | X | O11 | A validar (PA-FIS-08) | Un comprobante con error que luego se autoriza vuelve a informarse con su CAE. |

### 5.18 Contabilidad, BI y conservación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FIS-157 | **Eventos contables**: IVA débito por alícuota, percepciones (productos, no categorizados), IIBB, retenciones practicadas y sufridas, pasivo con terceros, IVA crédito, devengamiento de IVA en refinanciaciones; mapeo de cuentas por tenant (V2 2104–2107, 2113, 2125, 2136, 2160). | DEC-009; RN-09 | N | O5 | Adoptado | Todo evento fiscal económico tiene cuenta mapeada; sin mapeo, M15 lo retiene en bandeja. |
| RF-FIS-158 | **Datasets fiscales** para BI con contrato semántico (facturado fiscal, IVA débito, percepciones, retenciones, terceros), fecha de corte y granularidad. | AGR-022; T10 | E | O11 | Adoptado | El tablero fiscal y el libro IVA reconcilian para el mismo período. |
| RF-FIS-159 | **Expediente** de cada presentación, convenio, certificado y conciliación (acuses, constancias, archivos) con conservación por el plazo legal que defina T08. | AGR-023; T11 | N | O4 | Adoptado | Cada presentación tiene sus archivos y acuses descargables con URL firmada. |
| RF-FIS-160 | **Aislamiento por tenant** de credenciales, colas, padrones y declaraciones; un job nunca procesa datos de dos tenants. | DEC-002; BASE §61 | N | O4 | Informado | Pruebas de aislamiento: consultar con token de otro tenant devuelve 404. |

## 6. Reglas de negocio

Columnas: **Decisión** R = Replicar, M = Mejorar, Z = Reemplazar, D = Descartar.

### 6.1 Modos, autenticación y credenciales (RN-03 §1–§2)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-001 | Existen dos modos frente a ARCA: comprobantes propios y pasarela para sistemas externos. | Modo completo vs "solo factura electrónica" con tablas `ELECTRONICA*` y solo parámetros 519, 2082, 2083 (RN-03 §1) | M — el modo pasarela es una capacidad adicional del mismo tenant (API/CSV), no otra instalación | PRM-FIS-040 | — |
| RN-FIS-002 | Un comprobante que requiere CAE nace "emitido pendiente de autorización" y no es fiscalmente válido hasta autorizarse. | `FACTURAS.ID_BLO = -1` (RN-03 §1) | Z — estado explícito en `fiscalAuthorizations` | — | — |
| RN-FIS-003 | Los tenants de demostración no pueden autorizar en producción. | Base DEMO no factura electrónicamente (RN-03 §2.1) | M — tenants demo/sandbox solo homologación | PRM-FIS-002 | — |
| RN-FIS-004 | Para autenticar se exige certificado vigente y URLs del ambiente. | Exige archivo 2071 y URLs 2072/2073 (incluso para padrón) (RN-03 §2.1) | M — URLs por ambiente administradas por la plataforma; certificado en bóveda | PRM-FIS-001, 003 | — |
| RN-FIS-005 | El TA se reutiliza mientras no venza; caché compartido. | Caché en memoria y archivo `TA<servicio>.xml` (RN-03 §2.2) | M — caché por (tenant, CUIT, servicio, ambiente) en almacén compartido cifrado con lock distribuido | PRM-FIS-004 | — |
| RN-FIS-006 | El `uniqueId` del pedido de TA debe ser único. | Contador estático que vuelve a 0 por proceso (RN-03 §2.2) | Z — basado en tiempo + secuencia | — | — |
| RN-FIS-007 | Ventana del loginTicketRequest: generación −10 min, expiración +10 min. | Igual (RN-03 §2.2) | R — configurable | PRM-FIS-005 | — |
| RN-FIS-008 | El vencimiento del certificado se registra al firmar y se alerta. | Actualiza V2 2925 con `NotAfter`; aviso 14/7/3 días solo a un permiso (RN-03 §2.1, §2.3) | M — metadato del certificado; alertas 30/14/7/3/vencido a roles con capability | PRM-FIS-006 | — |
| RN-FIS-009 | Certificado vencido: ARCA no autoriza más comprobantes. | Mensaje si la excepción contiene "expirado" (RN-03 §2.2) | M — validación previa por fecha y estado "detenida por credencial" | — | — |
| RN-FIS-010 | El certificado debe contener la clave privada. | PFX sin contraseña leído de disco (RN-03 §2.2) | Z — clave en bóveda; nunca en disco ni sin protección | — | — |
| RN-FIS-011 | El CUIT representado es el configurado. | Toma la segunda relación si hay varias; fallback al subject del certificado (RN-03 §2.2) | Z — CUIT explícito y validado contra relaciones del TA | — | — |
| RN-FIS-012 | Cliente con TLS 1.2+ y timeout. | TLS 1.2 forzado; timeout 90 s en WSFE; WSPN3 sin timeout (RN-03 §2.2, §12.4) | M — timeout configurable en todos los clientes | PRM-FIS-007 | — |
| RN-FIS-013 | Ningún secreto (token, sign, clave) se muestra en errores ni logs. | Excepciones con ruta del archivo y traza (RN-03 §12.3) | M — errores RFC 9457 sin detalles internos (AGR-021) | — | — |

### 6.2 Cola y autorización CAE (RN-03 §3)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-014 | Pendiente = comprobante de un par (tipo × punto) con modalidad CAE y punto no pausado, sin CAE. | `COMPPOS.CAE`, `PTOVENTA.PAUSAR`, `ID_BLO = -1` (RN-03 §3.1) | Z — consulta de estados de la cola | — | — |
| RN-FIS-015 | El importe total informado incluye anticipos. | `TOTAL1 + IMP_ANTI` (RN-03 §3.1) | R — `ImpTotal` = total fiscal del comprobante, incluidos anticipos aplicados según M05 | — | — |
| RN-FIS-016 | Se envía en tandas ordenadas por número, agrupadas por tipo y punto. | Tandas de 100; corta al primer error (RN-03 §3.1) | M — tamaño = mínimo entre parámetro y `FECompTotXRequest`; un error de un comprobante no frena a los demás de otros pares | PRM-FIS-008 | — |
| RN-FIS-017 | La autorización automática se activa/desactiva por tenant y punto con auditoría. | V2 726 desde el ícono; la masiva lo apaga si quedan bloqueadas (RN-03 §3.1) | M — nunca se apaga en silencio | PRM-FIS-009 | — |
| RN-FIS-018 | Espera sincrónica para ventas/cobranzas que generan factura. | V2 727: 15 consultas de 1 s; si no llega, aviso "no se pudo autorizar en ARCA" (RN-03 §3.1) | M — espera configurable y notificación posterior | PRM-FIS-010 | — |
| RN-FIS-019 | Alerta de pendientes con antigüedad mayor a N días. | Más de 3 días al iniciar (RN-03 §3.1) | R — tablero y notificación | PRM-FIS-011 | — |
| RN-FIS-020 | Exclusión mutua por par para que dos procesos no autoricen lo mismo. | Bloqueo de filas con timeout 15; si no lo logra, sale "OK" sin hacer nada (RN-03 §3.2) | M — lock por par con estado "en proceso por otro worker" visible | — | — |
| RN-FIS-021 | No se autoriza si hay un comprobante anterior pendiente del mismo par. | Mensaje "hay una factura anterior pendiente" (RN-03 §3.2) | R | — | — |
| RN-FIS-022 | Numeración correlativa: un hueco detiene la tanda informando el primer faltante. | (RN-03 §3.2) | M — informa todos los faltantes | — | — |
| RN-FIS-023 | El código ARCA del tipo debe estar configurado y ser numérico. | "Debe configurar el código ARCA del Comprobante" (RN-03 §3.2) | R — validado al configurar el tipo (M05) y al enviar | — | — |
| RN-FIS-024 | Agrupación en rango solo para códigos 6, 7, 8, 9, 10, 11, 12, 13, 15, 35, 40, 49, 61, 64, consecutivos y bajo el tope; receptor 99/0; importes sumados y alícuotas/tributos fusionados por código. | Tope V2 2712 = 5000 por defecto; fijo 5000 en pasarela; V2 2427 sin uso (RN-03 §3.3) | M — opcional, apagada por defecto, tope de tabla normativa | PRM-FIS-012 | Tope vigente de ARCA |
| RN-FIS-025 | Receptor: CUIT (80) si el comprobante es para RI (clase A); si no, código del tipo de documento. | `COMPROB.TIPO_SIT = 1` → 80; `DOCUMENT.COD_AFIP` (RN-03 §3.4) | M — según tabla de clase del comprobante y condición | — | — |
| RN-FIS-026 | Documento no convertible a número. | CUIT genérico 23333333333 salvo V2 2780 (RN-03 §3.4) | Z — nunca CUIT genérico; 99/0 bajo umbral; detener sobre umbral (BASE §69) | PRM-FIS-013 | Umbral vigente de identificación de consumidor final |
| RN-FIS-027 | CUIT con 8 dígitos (DNI). | Genera el CUIT por algoritmo DNI+sexo (RN-03 §3.4) | Z — consulta de padrón o confirmación del usuario | — | — |
| RN-FIS-028 | `CondicionIVAReceptorId` desde la condición del receptor. | `SITIVA.AFIP_SIT` si ≠ 0 (RN-03 §3.4) | M — obligatorio (RG 5616) con mapeo a tabla ARCA; sin mapeo detiene | — | — |
| RN-FIS-029 | Concepto: 1 si hay ítems de producto, 2 si solo servicios, 3 si ambos, 1 si no hay ítems; en lote mezclado, 3. | (RN-03 §3.4) | R | — | — |
| RN-FIS-030 | Fechas de servicio = primer y último día del período facturado; si no se puede convertir, mes de emisión; vencimiento de pago = primer vencimiento si concepto > 1. | (RN-03 §3.4) | R — período tomado del documento M05 (`servicePeriodFrom/To`) | — | — |
| RN-FIS-031 | Moneda PES con cotización 1 salvo moneda extranjera. | Siempre PES (RN-03 §3.4) | M — soporta moneda extranjera y `CanMisMonExt` | — | — |
| RN-FIS-032 | `ImpNeto` = Σ neto de ítems gravados (alícuota ≠ 0, sin impuesto asociado); `ImpOpEx` = Σ ítems con alícuota 0 (excluye tipo 5); `ImpTotConc` = no gravados (impuestos de origen 0, subtipo 0); `ImpIVA` = Σ alícuotas; `ImpTrib` = Σ tributos. Se excluyen ítems de producto subtipo 5. | (RN-03 §3.4) | M — clasificación explícita por línea: `gravado`, `exento`, `noGravado`, `noAlcanzado`, `iva`, `tributo` | — | Equivalencia del "subtipo 5" en M05 |
| RN-FIS-033 | Clase C: el exento se suma al neto y `ImpOpEx = 0`. | Solo modo completo; los ajustes posteriores pueden dejar `ImpOpEx ≠ 0` (RN-03 §3.4, §12.3) | M — regla aplicada al final, después de ajustes | — | Si el tenant emite C |
| RN-FIS-034 | Alícuotas: agrupar ítems de IVA por porcentaje y cruzar con la tabla; descartar base e importe < 0,01; redondeo a 3 decimales al agrupar y 2 al enviar. | Porcentaje no mapeado se descarta en silencio (RN-03 §3.4, §12.1) | M — no mapeado detiene; redondeo según AGR-011 | PRM-FIS-014 | Que todos los porcentajes estén en la tabla |
| RN-FIS-035 | Tributos: Id por tabla de mapeo explícita; agrupación por (Id, alícuota, descripción). | `Tributo.Id = IMPUESTO.ORIGEN`; percepciones subtipo 4 → Id 3; fusión solo por Id (RN-03 §3.4, §12.2) | Z — defecto de ProCoop (CTR-FIS-01) | — | Orígenes cargados en Laguna Larga |
| RN-FIS-036 | Impuesto "otros" no gravado. | Origen 0 subtipo 0 → `ImpTotConc`; origen 0 subtipo 4 → no se informa (RN-03 §12.2) | M — "otros" se informa como tributo 99 o no gravado según la clasificación aprobada de cada impuesto | — | — |
| RN-FIS-037 | Todos los importes a 2 decimales; si `ImpTotal ≤ 0,03` todo exento sin IVA; diferencia positiva < 0,03 se suma al exento. | (RN-03 §3.4) | M — se conservan como ajuste explícito y trazado; en clase C, al neto; también se anulan `ImpTrib`/`ImpTotConc` cuando corresponda | PRM-FIS-015 | — |
| RN-FIS-038 | FCE MiPyME: vencimiento de pago (anulado en NC y 202); 2101/2102 salvo ND/NC; 27 en 201/206/211; 22 en 203/208/213 según la relación. | En modo completo 2101/2102 viajan vacíos (RN-03 §3.4, §12.1) | M — solo con valor | PRM-FIS-016, 017 | Valor vigente del opcional 27 (SCA/ADC) |
| RN-FIS-039 | Asociados: relacionados con código ARCA, no internos, fiscales, autorizados con CAE y no marcados "no mostrar"; CUIT del emisor si la relación lo pide, o del receptor si tiene 11 dígitos. | Códigos 2, 3, 7, 8, 11, 12, 13, 202, 203, 207, 208, 212, 213 (RN-03 §3.4) | R | — | — |
| RN-FIS-040 | `PeriodoAsoc` si hay relaciones pero ninguna autorizada con CAE: desde el período mínimo (no antes de 02-01-2006) hasta fin de ese mes, recortado a la emisión; ND/NC A y B sin asociados: período de la nota. | (RN-03 §3.4, §12.1) | R | — | — |
| RN-FIS-041 | Vista previa del request. | `ConsultaPreviaAutorizar` con código 0 (no aplica reglas por código) (RN-03 §12.3) | M — aplica el código real | — | — |
| RN-FIS-042 | Resultado `A`: CAE, vencimiento `yyyyMMdd`, observaciones. | Observaciones del primer detalle (RN-03 §3.5) | M — observaciones del detalle correcto | — | — |
| RN-FIS-043 | Error 10016 (número/fecha no es el próximo): consultar si ya está autorizado; si coincide el importe, tomarlo; si no, informar el último autorizado. | (RN-03 §3.5) | R | — | Texto vigente del código |
| RN-FIS-044 | Error 10040 (asociados): no reenviar los asociados problemáticos. | Marca `NOMOSTRAR` en silencio; en pasarela borra relaciones sin error (RN-03 §3.5, §12.3) | M — marca observada visible y aviso al operador | — | Texto vigente |
| RN-FIS-045 | Errores 10242/10243 (condición IVA del receptor). | Reintento individual con condición 5 (consumidor final) (RN-03 §3.5) | Z — detener y corregir el dato (BASE §69; CTR-FIS-04) | — | Texto vigente |
| RN-FIS-046 | Resultado parcial `P` se procesa por detalle; rechazo agrupado → reintento individual. | `P` cuenta como OK global (RN-03 §3.5) | M — estado por comprobante | — | — |
| RN-FIS-047 | Desbloqueo condicionado a otras facturas bloqueadas de la cuenta con saldo. | V2 2769 (RN-03 §3.5) | M — regla de cobrabilidad publicada a M07 | PRM-FIS-018 | — |
| RN-FIS-048 | Conciliación: por cada comprobante consultar ARCA; CAE distinto; total distinto con tolerancia 0,02 (sumando el rango si fue lote); reparar copiando CAE y vencimiento de ARCA. | Repara automáticamente; mensajes que se pisan; de a 2000 (RN-03 §3.7, §12.3) | M — propuesta de reparación con aprobación; mensajes acumulados | PRM-FIS-019 | — |
| RN-FIS-049 | Consultar CAE de un comprobante CAEA lo marca informado. | `COD_FAC = "P"` (RN-03 §3.7) | R — estado `caeaReported` | — | — |
| RN-FIS-050 | Un comprobante del modo pasarela solo se elimina si no tiene CAE. | `EliminarFcElectronica` (RN-03 §3.7) | R | — | — |
| RN-FIS-051 | Puntos de venta válidos de ARCA: no bloqueados y sin fecha de baja. | `FEParamGetPtosVenta` (RN-03 §3.6) | R | — | — |
| RN-FIS-052 | Las tablas paramétricas de ARCA se descargan y describen comprobantes y asociados. | `ObtenerTabla`, `lstComprobantes` en memoria (RN-03 §3.6) | M — tabla normativa sincronizada y versionada | PRM-FIS-020 | — |

### 6.3 CAEA, CAI y CESP (RN-03 §4)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-053 | Prioridad de autorización al numerar: CAEA vigente (si el par es CAEA) → CAE → CAI → CESP (servicios públicos). | (RN-03 §4.1) | R | — | — |
| RN-FIS-054 | Tipo de autorización en el comprobante: CAI 1, CAE 2, CESP 3, CAEA 4. | `FACTURAS.TP_CODIGO` (RN-03 §4.1) | R — enum `authorizationKind` (`cai`, `cae`, `cesp`, `caea`) | — | — |
| RN-FIS-055 | CAEA aplicable: rango de fechas que contiene la fecha del comprobante. | Exige `VTO_CESP <= hoy` (invertido) (RN-03 §4.1, duda 3) | M — rango vigente y fecha tope de informe no vencida | — | Significado de `VTO_CESP` en CAEA |
| RN-FIS-056 | CESP aplicable: rango que contiene la fecha y vencimiento ≥ hoy, con el mismo criterio en emisión, masiva y anulación. | Masiva y anulación solo miran fechas; `SysAdmin` lo saltea (RN-03 §4.2) | M — criterio único; sin bypass por usuario | — | — |
| RN-FIS-057 | Superposición de CESP: detecta también contención total y distingue CESP de CAEA. | No detecta contención ni distingue (RN-03 §4.2) | M | — | — |
| RN-FIS-058 | CAEA se consulta primero y, si no existe, se solicita, por período y orden (1/2). | (RN-03 §4.3) | R — por job anticipado | PRM-FIS-021 | Ventana vigente de solicitud |
| RN-FIS-059 | Informe CAEA en tandas de comprobantes no informados, agrupados por tipo y punto; queda informado. | Sin `CbteFchHsGen` (RN-03 §4.3, §12.3) | M — incluye `CbteFchHsGen` | PRM-FIS-008 | — |
| RN-FIS-060 | CAEA sin movimiento se informa. | No implementado (RN-03 §4.3) | M — implementado | — | — |
| RN-FIS-061 | Uso del CAEA limitado según normativa (contingencia u otras restricciones). | Sin control (RN-03 rec. 8) | M — tabla normativa de restricciones | PRM-FIS-022 | Restricción vigente |
| RN-FIS-062 | CAI: comprobante toma CAI actual y vencimiento; sin web service. | (RN-03 §4.4) | R — con bloqueo por vencido | — | — |
| RN-FIS-063 | QR: `tipoCodAut` A para CAEA, E en los demás. | (RN-03 §4.1, §7) | R | — | — |
| RN-FIS-064 | Código de barras: CUIT + tipo (2) + punto (4) + CAE + vencimiento (+ dígito). | (RN-03 §7) | R — dato provisto a M05 | — | Vigencia del código de barras |

### 6.4 Padrón y condición IVA (RN-03 §5, §7, §12.1)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-065 | Consulta A13: CUIT por documento y datos de persona (apellido, nombre, razón social, domicilios, actividad principal, forma jurídica, estado de clave). | Métodos sin llamadas visibles (RN-03 §5, duda 5) | M — integrado en altas de M01/M12 | — | — |
| RN-FIS-066 | Validación de CUIT contra padrón al dar de alta personas. | WSPN3 (PUC nivel 3, servicio heredado, texto sin tipar, sin CUIT representado) (RN-03 §5, §12.4) | Z — constancia de inscripción + A13 (PA-FIS-10) | — | Disponibilidad de WSPN3 |
| RN-FIS-067 | Padrón offline: CUIT (11), razón social (30), IVA pos. 44–45, monotributo pos. 46–47; si monotributo ≠ "NI" → "MT"; IVA "XN"→"EX", "AN"→"NA", vacío→"", otro se copia; condición = la que tiene ese código de padrón. | `EMPAFIP` (RN-03 §5) | R — como formato de la tabla normativa del archivo | — | Diseño vigente del archivo |
| RN-FIS-068 | Cruce del padrón offline con proveedores (con opción de actualizar) y titulares; búsqueda de CUIT. | (RN-03 §5) | M — actualización con aprobación | PRM-FIS-023 | — |
| RN-FIS-069 | Actividad ARCA del servicio del titular usada como filtro en cargos; no se informa a WSFE. | `ACTAFIP`, `SERSOC.COD_ACT` (RN-03 §5) | M — informable en `Actividades` si ARCA lo exige | — | Obligatoriedad de actividades en WSFE |
| RN-FIS-070 | Condición IVA del receptor se mapea a la tabla ARCA vigente (1 RI, 4 exento, 5 CF, 6 monotributo, 7 no categorizado, 8 proveedor del exterior, 9 cliente del exterior, 10 IVA liberado Ley 19.640, 13 monotributista social, 15 IVA no alcanzado, 16 monotributo trabajador independiente promovido; la tabla vigente de ARCA prevalece). | Semilla 4 = CF y 5 = exento, inconsistente con ARCA y con su propio RG 3685 (RN-03 §12.1) | Z — códigos de la tabla ARCA (CTR-FIS-02) | — | `AFIP_SIT` en Laguna Larga (para migración) |
| RN-FIS-071 | Tipos de documento: desconocido 99, DNI 96, LE 89, LC 90, pasaporte 94, cédula 91, CUIL 86, interno 99, CUIT 80. | Semilla `clsDefault` (RN-03 §12.1) | R — desde tabla ARCA sincronizada | — | — |
| RN-FIS-072 | El comprobante interno de cada operación se elige por servicio LQSP → comprobante del servicio → tipo de factura → FCE MiPyME (si supera V2 2515) → default de la condición. | `GetComprobanteOperacion` (RN-03 §12.1) | R — en M05, con la clase validada por FIS; la elección "servicio LQSP" rige solo para los renglones de clase LQSP y nunca arrastra a la LQSP los servicios de factura común (DEC-093, RN-FIS-122, RN-FAC-040 de M05) | PRM-FIS-024 | — |

### 6.5 IVA, percepciones e IIBB en el cálculo (RN-01 §17)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-073 | Alícuota de IVA del ítem de servicio: tarifa → categoría → servicio; IIBB: categoría → servicio; producto: propia del producto más percepción del producto. Uso del suministro (DEC-102): (1) solo si PRM-FIS-125 está activo para el tenant y el servicio del ítem, la matriz busca primero la fila vigente de (alícuota, condición) cuyo `supplyUsageClasses[]` contiene la clase del uso del inmueble del suministro (`premises.usageId` → `premiseUsages.usageClass` de M01; antes "cuyo `supplyUsageIds[]` contiene el uso del inmueble") y, si no hay, la fila sin uso; (2) con el parámetro apagado (default) se ignoran las filas con uso; (3) un inmueble sin uso cargado, o con un uso sin `usageClass`, toma la fila sin uso; (4) no puede haber dos filas vigentes de la misma (alícuota, condición) con clases superpuestas; (5) la traza del cálculo guarda el uso y la clase aplicados (`taxCalculationTraces.lines[].supplyUsageId` y `supplyUsageClass`). | (RN-01 §17.1) | R — referencias en M02/M04, validación en FIS; M — condición por uso desactivada por defecto (DEC-102) | PRM-FIS-125 | Regla del 27 % según el uso (PA-FIS-26) |
| RN-FIS-074 | IVA1 = neto × POR_IVA; IVA2 = neto × POR_IVA2 si > 0. | `ALI_IVA_CF` (RN-01 §17.2) | R | — | — |
| RN-FIS-075 | Percepción de IVA = (neto + IVA1) × PER_IVA, o neto × PER_IVA si la condición indica "percepción sobre neto". | (RN-01 §17.2) | R | — | — |
| RN-FIS-076 | Si la matriz no define percepción, se usa la del producto solo para responsables inscriptos. | (RN-01 §17.2) | R | — | — |
| RN-FIS-077 | Nunca se percibe a cuentas marcadas "no cobrar percepción". | `SUMSOC.NO_COBRAR_PERCEPCION` (RN-01 §17.2) | M — exclusión con respaldo y vigencia | — | — |
| RN-FIS-078 | La percepción de la factura se aplica solo si la suma alcanza el mínimo de la condición. | `SITIVA.MIN_PERCEPCION` (RN-01 §17.2) | R | — | — |
| RN-FIS-079 | Ítems con IVA fijo conservan su IVA (cuotas de financiación). | `PrecioIVA_Fijo` (RN-01 §17.2) | R | — | — |
| RN-FIS-080 | Percepción de IIBB: alícuota "rendir en facturación", situación no exenta, porcentaje de la matriz, solo si netos alcanzados ≥ base mínima; variante con padrón por cuenta; con cálculo 2 se calcula también sobre el IVA. | `Calcular_IBR`, `IIBB_LUA`, `ALI_IBR_COMP` (RN-01 §17.2) | R — generalizado por jurisdicción | PRM-FIS-030 a 034 | — |
| RN-FIS-081 | Otros impuestos (tasas municipales, fondos provinciales) se modelan como cargos adicionales de tipo impuesto con fórmula y base. | Sin algoritmo propio (RN-01 §17.2) | M — tributo del catálogo con fundamento; fórmula en M04 solo para la base | — | — |
| RN-FIS-082 | Total de la factura = Σ neto + IVA1 + IVA2 + percepción IVA + otros impuestos + IIBB. | (RN-01 §17.2) | R — más conceptos de terceros como sección propia | — | — |
| RN-FIS-083 | Subsidios y bonificaciones reducen el componente bonificado antes de impuestos; su tratamiento fiscal (IVA sobre lo bonificado) sale de la tabla normativa del régimen. | Columnas de subsidio leídas por fórmulas (RN-01 §18) | M — base imponible explícita por componente | — | Tratamiento IVA de bonificaciones SEF |
| RN-FIS-084 | Cuota de venta: IVA y percepción de la cuota; IIBB solo si la base supera el mínimo. | `GetPercepcionCuota` (RN-02 §11.1) | R | — | — |
| RN-FIS-085 | Liquidación de percepciones IIBB según RN 01/2017 Córdoba. | V2 757 (RN-09) | R — plantilla de jurisdicción Córdoba | PRM-FIS-030 | Vigencia de RN 01/2017 |

### 6.6 Libro IVA, Libro IVA Digital y Mis Comprobantes (RN-03 §8–§9, §12.5–§12.6)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-086 | Criterio percibido: para condiciones con percibido se toma lo cobrado y refinanciado del período; el resto por facturado. | (RN-03 §8.1) | R | PRM-FIS-050 | — |
| RN-FIS-087 | Criterio facturado y percibido: no cobrado por facturado; cobrado parcial prorrateado por saldo/total; se suman cobros del período de facturas del período y del mes siguiente. | (RN-03 §8.1) | R | — | Validación con el contador |
| RN-FIS-088 | Criterio cuotas facturadas vencidas: prorratea cada factura por las cuotas que vencen en el período. | (RN-03 §8.1) | R | — | — |
| RN-FIS-089 | Solo comprobantes fiscales; excluye prescripción de deuda; mensual = fecha ≠ primer vencimiento, diaria = fecha = primer vencimiento. | (RN-03 §8.2) | M — tipo de facturación explícito en el documento | PRM-FIS-051 | — |
| RN-FIS-090 | Signo positivo en débitos y negativo en créditos. | (RN-03 §8.2) | R | — | — |
| RN-FIS-091 | Columnas por subtipo de impuesto: no gravado/otros por origen; IVA 1, IVA 2, IVA 3/percepción. | (RN-03 §8.2) | Z — columnas por clasificación fiscal de la línea | — | — |
| RN-FIS-092 | Fila de cabecera con estado "A" sin importes. | `ESTADO = "A"` (RN-03 §8.2, duda 7) | M — los anulados se exhiben con su estado explícito | — | Significado de "A" |
| RN-FIS-093 | Carátula: alícuotas en 0 y filas sin gravado se omiten; LQSP aparte. | (RN-03 §8.2) | R | — | — |
| RN-FIS-094 | Percepciones del informe = solo IVA 3. | (RN-03 §12.5) | M — todas las percepciones (CTR-FIS-09) | — | — |
| RN-FIS-095 | Agrupado por tipo reasigna el tipo según grupo IVA. | `COD_TPFC_GRUPO_IVA` (RN-03 §12.5) | R | — | — |
| RN-FIS-096 | Por actividad: rubro del producto/servicio, "OTROS" si no tiene. | (RN-03 §12.5) | R | — | — |
| RN-FIS-097 | Fecha de vencimiento en RG 3685 si V2 2692 y filtro por vencimiento. | Nunca se marca `FiltradoXVto` (sin efecto) (RN-03 §12.5) | M — funciona realmente | PRM-FIS-052 | Si 2692 está activo |
| RN-FIS-098 | Reglas de formato RG 3685/LID (detalle RF-FIS-120). | (RN-03 §8.3, §9) | R | — | — |
| RN-FIS-099 | Lista de comprobantes B y C para RG 3685 por ítems (sin el 109 en una de las listas). | (RN-02 §13.3.1) | M — desde tabla de clases ARCA | — | — |
| RN-FIS-100 | Total de ventas en la comparación = exento + gravado + no gravado + IVA1 + percepción, sin IVA2; falla todo el lote si un código no es numérico. | (RN-03 §12.6) | M — incluye todas las alícuotas; errores por fila | — | — |
| RN-FIS-101 | IVA de compras sin signo en notas de crédito. | (RN-03 §12.6) | M — con signo | — | — |
| RN-FIS-102 | Mis Comprobantes: desde la tercera fila del Excel; si el tipo contiene "Crédito" se niegan importes; tipo de cambio en formato en-US; diferencia > ARS 1; total ≤ 0,03 → todo exento antes de comparar; rango con `Range(desde, hasta)` defectuoso. | (RN-03 §9, duda 9) | M — CSV actual + Excel; rango correcto | PRM-FIS-053 | Formato actual de descarga |

### 6.7 Regímenes, exportadores, terceros, reguladores y otros

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FIS-103 | Archivos de texto en Windows-1252, ancho fijo, ceros a la izquierda, lugar para signo en negativos; CSV con ";". | `ExportBase` (cabecera sin ";" y otra codificación) (RN-02 §13.3.1) | M — codificación y separadores por formato del catálogo | — | — |
| RN-FIS-104 | RG 3571: análisis por línea (signo "0" positivo) y por correlatividad (informa solo número − 1). | Punto de venta leído distinto en cada análisis (RN-02 §13.3.1) | M — rango completo; posiciones del formato vigente | — | Posición del punto de venta |
| RN-FIS-105 | RG 3571 variante 49/2019 (RN 46/2019) con generadores; nombres `rg_3571_ddMMyyyy_hhmmss.txt` / `rg_46_2019_ddMMyyyy.txt`. | (RN-03 §8.3) | M — versión RG 5746/2025 (aplicativo 2.0) | — | Diseño del aplicativo 2.0 |
| RN-FIS-106 | RG 2177 sin implementar. | `NotImplementedException` (RN-03 §8.3) | D — salvo que el relevamiento indique que el tenant está alcanzado | — | Alcance de RG 2177 |
| RN-FIS-107 | SICORE: ventas con coma decimal (V2 2991); proveedores formato internacional (V2 2539); sin CUIT → 23333333333; proveedores impuesto 0217 régimen 078, o 0767 con 214 para Buenos Aires; sueldos con concepto de Ganancias. | (RN-02 §13.3.1) | M — códigos de impuesto/régimen en tabla normativa; sin CUIT genérico | PRM-FIS-070, 071 | Códigos vigentes |
| RN-FIS-108 | Retenciones municipales: registros C/D/P con CUIT y razón social de la empresa; IIBB artículo 020 para RUF y 001 para el resto; Santa Fe con campos más anchos; La Pampa todo del mismo mes y CUIT fijo; ARBA y A122R con nombre normado; seguridad social con códigos fijos. | (RN-02 §13.3.1) | M — sin CUIT fijo en código; formatos versionados | — | — |
| RN-FIS-109 | SIRCAR: Córdoba y Río Negro, percepciones; 904 agrega constancia; Buenos Aires valida CUIT y aborta con lista; nombre depende de versión. | (RN-02 §13.3.1) | M — no aborta: lista errores y permite corregir | PRM-FIS-072 | Versión vigente |
| RN-FIS-110 | FEDECOBA: saldos contables por cuenta FEDECOBA partidos en N archivos; CUIT fijo en código; contador no reinicia. | (RN-02 §13.3.1) | M — se delega a M15 como exportación contable; sin CUIT fijo | — | Si el tenant la usa |
| RN-FIS-111 | Retenciones: habilitación global y por proveedor; base con banderas y factor; acumulación; mínimo; escala; retenido previo; devolución. | (RN-08 §3.1–3.3) | R | PRM-FIS-080 a 089 | — |
| RN-FIS-112 | Sin tramo con valores fijos → crea escala 0–999.999.999 persistida. | `ObtenerTrama` (RN-08 §3.3) | Z — error explícito | — | — |
| RN-FIS-113 | Numeración anual de certificados por tipo y punto; anulación con estado "A" e importes en cero. | (RN-08 §3.4) | M — conserva importes originales y marca anulada | — | — |
| RN-FIS-114 | Facturación de terceros: Excel/ancho fijo/DBF con clave de cuenta; marca "CUENTA INEXISTENTE", "CONCEPTO INEXISTENTE"; IVA por concepto y condición; grabación como comprobantes con cuotas o facturas directas; gas importado rechaza números repetidos. | (RN-02 §11.2) | M — importación vía ExcelImportWizard en M05 con validación fiscal FIS | — | — |
| RN-FIS-115 | ENARGAS: nombre `<distribuidor 5 dígitos>_<número>_<archivo>_<AAAA-MM>_<fecha>.TXT`, tabulado (SUP con coma); archivo de tablas maestras según V2 2603 en la carpeta del ejecutable; categorías P/S/H/Z/T como "a"; SUP solo para una cooperativa. | (RN-02 §13.1) | M — tablas maestras como tabla normativa por protocolo; sin ramas por cooperativa | PRM-FIS-100 a 109 | Protocolo de Laguna Larga |
| RN-FIS-116 | ENACOM: configuración serializada en archivo del servidor; informe DNU 311/2020 (Res. 367/2020) histórico. | (RN-02 §13.2) | M — configuración versionada en base; informe histórico descartado (PA-FIS-13) | — | — |
| RN-FIS-117 | Comprobantes de administración pública: facturas impagas con consumos de tipo de energía vacío o "A"; reemplazo de selección por período o fecha; borrado defectuoso por fecha sin comillas. | (RN-03 §10, §12.7) | M — reemplazo transaccional sin duplicados | — | — |
| RN-FIS-118 | Talones sumados: eliminación conserva historia (no borra definitivamente). | (RN-03 §12.7) | R — en M07 (referencia) | — | — |
| RN-FIS-119 | Modo pasarela: CSV sin cabecera con separador V2 2497 (";"), 46 columnas; relacionado de 16 caracteres; CUIT del relacionado de la empresa en 203/208; reemplazo de pendientes; borrado de CSV si todo se graba; salida `<nombre>_CAE.<ext>` con 8 columnas y marcas `EXP_`/`ERR_`; sin tratamiento de 10242/10243; comparación de duplicados con `!=` defectuosa; conversión a Int16 del número. | (RN-03 §6, §12.3, duda 9) | M — API + CSV con mismas reglas fiscales del modo completo y defectos corregidos | PRM-FIS-040 a 042 | Quién disparaba IN/OUT |
| RN-FIS-120 | Ninguna exportación marca presentado; ningún pago marca pagada la obligación sin movimiento confirmado. | BASE §61 (control) | R (requisito informado) | — | — |
| RN-FIS-121 | Un concepto por cuenta de terceros solo se habilita con convenio y fundamento cargados. | BASE §97.4 | R (requisito informado) | — | — |
| RN-FIS-122 | El grupo de facturación no agrupa servicios que una norma, el regulador o el servicio exigen en documento independiente, ni de distintos CUIT/titulares/tenants; la validez fiscal se confirma con el contador. | BASE §103.3 | R — FIS provee la regla de compatibilidad fiscal por servicio a M05. M — compatibilidad de clase (DEC-093): (1) ningún comprobante mezcla renglones de clase LQSP con renglones de factura común (internet, telefonía, TV, sepelio y similares); M05 emite un documento por clase (RN-FAC-040); (2) dentro de la LQSP, además de los conceptos tarifarios del servicio público, solo entran los conceptos con `conceptFiscalCases.publicServiceAccessory = true`, que el tenant declara con respaldo del contador (fundamento y aprobación en `accessoryApproval`); (3) el sistema no precarga ningún concepto como accesorio; sin marca, el concepto va a la factura común; (4) la lista de accesorios admitidos queda pendiente del contador (PA-FIS-23) | — | Combinaciones de la piloto; conceptos accesorios (PA-FIS-23) |
| RN-FIS-123 | Los intereses devengados se facturan en un documento posterior cuando el régimen fiscal lo exige, sin modificar la factura original. | BASE §97.3 | R — regla fiscal consumida por M08/M05 | — | — |
| RN-FIS-124 | Aporte de capital (HUECO-CAP-04): un renglón cuyo concepto tiene `conceptFiscalCases.fiscalClass = capitalContribution` (1) no integra `ImpNeto`, `ImpOpEx`, `ImpIVA` ni `ImpTrib`; (2) se informa en `ImpTotConc` (o, con PRM-FIS-122 = `outsideFiscalDocument`, se emite fuera del comprobante fiscal en un documento no fiscal de M05/M17); (3) se excluye de la base de percepción de IVA, IIBB, tributos municipales sobre el neto y de toda base "neto del servicio"; (4) se muestra en una sección propia con leyenda configurable; (5) genera evento contable al capital social (M15/M17), no al ingreso del servicio. | Sin tratamiento explícito en ProCoop (el aporte se suma como renglón más) | M — clase fiscal explícita | PRM-FIS-122 | Encuadre parametrizado en PRM-FIS-122 (default `untaxedInInvoice`); requiere validación legal |
| RN-FIS-125 | Derechos de sepultura (HUECO-CEM-01, ficha CEM): (1) cada concepto CEM (adquisición, mantenimiento, cada tipo de acto) debe tener un `conceptFiscalCases` adoptado; sin él, la versión tarifaria de M04 no se publica y el renglón no se factura; (2) la clase y la alícuota se toman a la fecha del comprobante; (3) adquisición financiada: con `fiscalMoment = perInstallment` (por defecto) cada cuota facturada lleva la clase del concepto "adquisición"; con `fiscalMoment = atAcquisition` se emite el comprobante por el total al otorgar el derecho y las cuotas son financiación de M08 con IVA fijo de RF-FIS-082; (4) el diferimiento contable del ingreso (PA-CON-17, PRM-CON-193 de M15) no cambia el momento fiscal; (5) el catálogo precarga los tres conceptos sin clase por defecto, con nota [VERIFICAR] para que el tenant adopte la clase con su contador. | Sin caso en ProCoop | M — caso fiscal por concepto | PRM-FIS-123 | Encuadre IVA de derecho de uso, mantenimiento y actos |
| RN-FIS-126 | Clasificación de tributos y conceptos (HUECO-TAS-03), en este orden: (1) si el beneficiario del importe es la cooperativa (`level = internal`, o tributo que la cooperativa paga como contribuyente y no traslada) ⇒ `ownTax` (no trasladable sin fundamento, RF-FIS-141); (2) si la cooperativa actúa como agente de percepción de un organismo nacional o provincial con régimen (`level` `national`/`provincial` y régimen de percepción en `taxAgentRegistrations`) ⇒ `perception`; (3) si el organismo de `IMPUESTO.ORIGEN` es un tercero (municipio, provincia, hospital, federación u otro) y la cooperativa lo informa en ARCA como tributo (`ImpTrib`) ⇒ `thirdPartyTax`; (4) si existe convenio vigente en `thirdPartyAgreements` con ese organismo y el importe se cobra por cuenta y orden sin informarse como tributo propio ⇒ `thirdPartyCharge` (exhibición separada, pasivo, RF-FIS-135/136); (5) si no hay organismo identificable ni convenio ⇒ `pendingClassification` y no se publica. La misma regla aplica a la tasa hospital que M02 §19.1 convierte desde `CLASESER`. | `IMPUESTO.ORIGEN` mezcla orígenes; `CON_TASAS` sin distinción (es una tabla de Compras: va a `purchaseConcepts` de M12 y no entra en esta regla salvo filas usadas en facturación, HUECO-TAS-03) | M — regla explícita y bandeja de pendientes | — | Organismos de `ORIGEN` en Laguna Larga |
| RN-FIS-127 | Saldo de terceros y mora (HUECO-TAS-02): (1) el saldo impago de renglones `thirdPartyCharge`/`thirdPartyTax` se publica a M07/M08 con `thirdPartyAgreementId` y clase; (2) por defecto (`moraPolicy.includeInEligibleBalance = false`) M08 lo excluye del saldo elegible para avisos, suspensión y corte (RF-MOR-068); (3) solo con convenio que lo autorice expresamente se incluye; (4) recargos, intereses o actualización sobre ese saldo solo si `moraPolicy.surcharge` lo define (tipo, tasa o índice, a favor de quién); sin definición no se calculan; (5) lo cobrado por recargos de terceros se rinde al tercero o queda como ingreso propio según `moraPolicy.surcharge.beneficiary`; (6) la imputación de pagos parciales sigue `partialPaymentPolicy` (RF-FIS-138). | Sin regla en ProCoop | M | — | Convenios de la piloto |
| RN-FIS-128 | Depósito en garantía (HUECO-OTR-04; RN-CON-123 de M15): un renglón con `conceptFiscalCases.caseCode = guaranteeDeposit` tiene `fiscalClass = outsideTaxBase`: (1) no es contraprestación de una venta ni de un servicio, por lo que no integra `ImpNeto`, `ImpOpEx`, `ImpIVA` ni `ImpTrib` ni ninguna base de percepciones, IIBB o tributos municipales; (2) se informa a ARCA dentro de `ImpTotConc` (no gravado) cuando se factura en el mismo comprobante, o fuera del comprobante fiscal en un documento no fiscal si PRM-FIS-124 = `outsideFiscalDocument`; (3) en el Libro IVA Digital va a conceptos no gravados; (4) su devolución no es nota de crédito fiscal (es reintegro del pasivo en M07) y su aplicación a daños o faltantes, si corresponde, se factura como concepto nuevo con su propia clase fiscal. | Sin clase propia en ProCoop | M — clase fiscal explícita | PRM-FIS-124 | Encuadre con el contador (no gravado en el comprobante vs documento no fiscal) |
| RN-FIS-129 | Corte por deuda de terceros (HUECO-ALU-01; RN-MOR-141 y RN-MOR-142 de M08): (1) `moraPolicy.allowServiceCut = false` (default): la deuda de conceptos de terceros nunca habilita suspensión ni corte del servicio principal; (2) `allowServiceCut = true` solo surte efecto si `cutNormativeRef` tiene norma cargada con `validationStatus = validated`; M06 publica ambas marcas a M08 en `fis.thirdPartyAgreement.published` (EVT-FIS-24); (3) sin norma validada M08 aplica la restricción `thirdPartyDebtNoCut`; (4) incluir el saldo en el saldo elegible (`includeInEligibleBalance`) no implica autorizar el corte: son marcas independientes; (5) la deuda se identifica por el contrato accesorio "convenio de terceros" del socio y su `thirdPartyAgreementId` (DEC-083). | ProCoop evalúa la deuda total | M | — | Norma local y texto del convenio |
| RN-FIS-130 | Emisión por entidad jurídica (DEC-064): el CUIT emisor, el perfil fiscal, la credencial ARCA, el punto de venta, el CESP/CAEA, los libros IVA, las declaraciones y las obligaciones fiscales se resuelven por `legalEntityId` del comprobante; un comprobante con punto de venta de otra entidad o sin perfil fiscal vigente de su entidad no se envía a ARCA (prevalidación con motivo `legalEntityMismatch`); la caché de TA es por (tenant, entidad, CUIT, servicio, ambiente). | ProCoop por `COD_EMP` de `EMPRESAS` | M — entidad explícita | — | — |
| RN-FIS-131 | Alineación con T04 (RF-CFG-138; EVT-CFG-19): (1) `fiscalProfiles.legalName` y `cuit` deben coincidir con los datos legales de `legalEntities` de T04 a la fecha de vigencia; (2) `cfg.legalEntity.created` crea un perfil fiscal en `draft` para completar en PAN-FIS (no autoriza comprobantes hasta aprobarse); (3) `cfg.legalEntity.updated` con cambio de CUIT o razón social pone el perfil en revisión y detiene la autorización de comprobantes nuevos de esa entidad con motivo `legalEntityProfileReview` hasta aprobar una nueva versión; un cambio de domicilio legal crea versión sin detener; (4) `cfg.legalEntity.deactivated` cierra la vigencia del perfil y rechaza nuevas autorizaciones, sin afectar reprocesos ni conciliaciones de comprobantes ya emitidos; (5) cada autorización guarda la copia de los datos del emisor usados (`issuerSnapshot`: CUIT, razón social, condición IVA, IIBB, domicilio fiscal, inicio de actividades), de modo que un cambio posterior no altera lo emitido. | ProCoop toma `EMPRESAS` en el momento de imprimir | M — entidad versionada y copia al emitir | — | — |
| RN-FIS-132 | Padrones mixtos (PA-FIS-18): (1) `maintainedBy = platform` solo para padrones de acceso público, con versión visible para todos los tenants que los adopten (RN de tablas normativas, RF-FIS-004); (2) `maintainedBy = tenant` para padrones que requieren credencial del agente, con alcance al tenant y a la entidad jurídica (`legalEntityId`) que es agente; (3) si existen ambos para la misma jurisdicción y régimen, prevalece el del tenant para sus CUIT; (4) la credencial del agente se guarda en `integrationSecrets` de T06 y nunca se comparte entre tenants. | `IIBB_LUA` por tenant sin distinción de fuente | M — fuente explícita | — | Padrón del tenant ausente ⇒ RF-FIS-088 bloquea la masiva de los servicios alcanzados |
| RN-FIS-133 | Obligaciones y exenciones propias (DEC-095; RF-FIS-169): (1) `ownTaxObligations` no trae filas precargadas por la plataforma ni por la demo productiva; (2) un registro pasa de `draft` a `active` solo con fundamento normativo, dictamen del contador (`basis.accountantOpinion`), adjunto de respaldo y aprobación del responsable fiscal con MFA; (3) no puede haber dos registros activos del mismo tipo para (entidad jurídica, impuesto, jurisdicción, actividad o servicio) con vigencias superpuestas; (4) el registro describe la posición propia de la cooperativa como contribuyente: no altera tributos, percepciones ni retenciones calculados a terceros, no se traslada al socio (RF-FIS-011, RF-FIS-141) y no reemplaza a `taxExemptions` (exclusiones de terceros); (5) una contribución con `capitalBase.source = m17CapitalBase` toma la base de M17 por entidad jurídica y fecha (`ins.capitalBase.get({ legalEntityId, asOf })` con `asOf` = fin del período del registro; RF-INS-109, RN-INS-054): usa el componente `capitalBase.component` (`subscribed`, `paid`, `pendingToPay`, `reserved`, `refundsApprovedUnpaid`) sumado sobre todos los rubros o solo sobre `capitalBase.capitalItemIds[]`; crea en `taxObligations` la obligación con `ownTaxObligationId`, `legalEntityId`, importe calculado con la alícuota del registro y vencimiento de `fiscalDeadlines`, y publica `fis.obligation.created`; con `capitalBase.requireFinal = true` (default) espera la base congelada (`final = true`) del evento `ins.capitalBase.closed` (EVT-INS-22); sin base de M17 la obligación queda `pending` sin importe y alerta al responsable (*Reemplazado (10-11-2026, alineación con M17 RF-INS-109): "(5) una contribución con `capitalBase.source` `perService` o `perEvent` pide la base a M17 al cierre del período o al ocurrir el evento de capital, y crea en `taxObligations` la obligación…"*); (6) al vencer `validTo` el registro pasa a `expired` y deja de generar obligaciones; un cambio normativo se registra como registro nuevo, no editando el anterior; (7) al recibir `ins.capitalBase.reopened` M06 marca para revisión las obligaciones que usaron esa base (`capitalClosingId`): las `pending` y las `ordered` sin pago ejecutado se anulan con motivo `capitalBaseReopened` (EVT-FIS-26, que M15 usa para el contraasiento) y se recalculan al llegar el nuevo `ins.capitalBase.closed` (`fis.obligation.created` con `replacesObligationId`); las `paid` no se tocan: la diferencia se registra como obligación complementaria o como saldo a favor con dictamen del contador; una `ordered` cuyo pago M14 ya entregó o envió al banco (`paymentExecutions.status` `delivered` o `sentToBank`, que M14 no anula sola: M14 §8.9) no se anula directamente, sigue el punto 9; (8) revocar un registro anula con EVT-FIS-26 sus obligaciones `pending` (motivo `ownObligationRevoked`) y lleva las `ordered` al punto 9; (9) **anulación con el pago en curso** (DEC-095, 10-11-2026): toda anulación o recálculo de una obligación `ordered` (motivo `manual`, `ownObligationRevoked`, `capitalBaseReopened` o `recalculated`) la pasa a `cancellationPending` ("anulación pendiente de conciliación del pago"), guarda `paymentConflict` y publica EVT-FIS-26 con `cancellationStatus = pendingPaymentReconciliation`, para que M14 anule la ejecución si todavía no salió dinero o avise al tesorero si está `delivered` o `sentToBank`; la obligación queda en la bandeja fiscal con alerta al responsable fiscal hasta que M14 confirme el resultado: (a) con `tes.paymentExecution.voided` (EVT-TES-15) la ejecución se anuló o el banco devolvió el pago, y la obligación pasa a `cancelled` (`paymentConflict.resolution = paymentVoided`); (b) con `tes.paymentExecution.executed` el pago salió, y la obligación pasa a `cancelled` con `creditBalanceAmount` = importe pagado, que queda como **saldo a favor ante el organismo** de esa entidad jurídica, impuesto y jurisdicción (`paymentConflict.resolution = paymentExecuted`), a compensar con la obligación recalculada o a reclamar según dictamen del contador [VERIFICAR con el contador si el organismo admite la compensación o exige pedido de devolución]; en ambos casos M06 vuelve a publicar EVT-FIS-26 con `cancellationStatus = final` (y `creditBalanceAmount` si lo hay), que es el que M15 usa para el contraasiento de M-137. Una `tes.paymentExecution.rejected` no resuelve: la obligación sigue `cancellationPending` y el tesorero anula la ejecución en lugar de reinstrumentarla. La obligación recalculada (`replacesObligationId`) se crea sin esperar la resolución y muestra el conflicto de la anterior. Una obligación `pending` se anula directamente (`cancelled`, EVT-FIS-26 con `cancellationStatus = final`). | Sin equivalente en ProCoop (se lleva en planillas) | Nueva (DEC-095) | — | Cada norma la confirma el contador (PA-FIS-25) |

## 7. Modelo de datos

Todas las colecciones llevan los campos comunes de la guía (`tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`) y, cuando aplica, `status`, `validFrom`/`validTo`, `recordedAt` y `deletedAt`. Los importes son `Decimal128`. Los documentos fiscales y económicos **no se borran**: se anulan, se rectifican o se revierten. Todos los índices comienzan por `tenantId`. Las colecciones de plataforma usan `tenantId = PLATFORM`.

### 7.1 `normativeTables` (plataforma) — catálogo de tablas normativas

Propósito: identifica cada tabla normativa fiscal o regulatoria.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Ej. `vatRates`, `vatConditionsArca`, `arcaDocTypes`, `arcaCbteTypes`, `arcaTaxTypes`, `arcaOptionals`, `arcaCurrencies`, `arcaCountries`, `arcaActivities`, `iibbRegimes.cba`, `regimeFormats.lid`, `taxDeadlines`, `cfIdentificationThreshold`, `caeaRules`, `invoiceContentRules.cba10739`, `enargasMasterTables.fcuds` |
| `name` | dictKey | Sí | `dict:fis.tabla.<code>` |
| `scope` | enum | Sí | `national`, `provincial`, `municipal`, `regulator`, `arcaParam` |
| `jurisdiction` | string | No | Código de provincia/municipio u organismo |
| `extensibleByTenant` | bool | Sí | Si el tenant puede agregar filas propias (RF-FIS-003) |
| `schemaRef` | string | Sí | Esquema Zod de las filas |
| `syncSource` | enum | No | `wsfeParam`, `padronFile`, `manual` |

Índices: `{tenantId, code}` único.

### 7.2 `normativeTableVersions` (plataforma)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `tableCode` | string | Sí | FK lógica a `normativeTables.code` |
| `versionNumber` | int | Sí | Correlativo por tabla |
| `status` | enum | Sí | `draft`, `inReview`, `published`, `retired` |
| `validFrom` / `validTo` | date | Sí / No | Vigencia normativa |
| `source` | object | Sí | `{ normType, normNumber, year, organism, url, consultedAt, notes }` (ej. RG ARCA 5746/2025 [MER18]) |
| `rows` | array | Sí | Filas validadas por el esquema |
| `diffFromPrevious` | object | No | Altas/bajas/cambios |
| `publishedBy` / `publishedAt` | ObjectId / date | No | Publicación |
| `environment` | enum | No | `homologation`, `production` (tablas `arcaParam`) |

Índices: `{tenantId, tableCode, versionNumber}` único; `{tenantId, tableCode, status, validFrom}`.

### 7.3 `normativeAdoptions` (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `tableCode` | string | Sí | Tabla adoptada |
| `platformVersionId` | ObjectId | Sí | Versión publicada adoptada Referencia: `normativeTableVersions` (M06). |
| `effectiveFrom` | date | Sí | Fecha efectiva para el tenant |
| `recordedAt` | date | Sí | Fecha de registro (AGR-010) |
| `status` | enum | Sí | `proposed`, `approved`, `superseded`, `rejected` |
| `tenantRows` | array | No | Filas propias (solo tablas extensibles), cada una con `basis` (fundamento) obligatorio |
| `approvedBy` / `approvedAt` | ObjectId / date | No | Responsable fiscal |
| `simulationId` | ObjectId | No | Simulación previa (RF-FIS-009) Referencia: simulación de M04, asumida en PA-FIS-20 (DEC-072; T05 debe declarar la colección); antes [VERIFICAR] simulación de adopción. |

Índices: `{tenantId, tableCode, effectiveFrom}`; `{tenantId, status}`.

### 7.4 `fiscalProfiles` (tenant) — perfil fiscal del emisor

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 `legalEntities` | Sí | Entidad jurídica emisora (DEC-064): un perfil fiscal vigente por entidad; razón social, CUIT y condiciones son de esa entidad (ProCoop `EMPRESAS`/`COD_EMP`). |
| `legalName` | string | Sí | Razón social (V2 518) |
| `cuit` | string(11) | Sí | CUIT (V2 519) |
| `vatConditionCode` | int | Sí | Código ARCA de la condición IVA (V2 527) |
| `grossIncome` | object | Sí | `{ number, regime: local\|convenioMultilateral, conditionCode (V2 706), jurisdictions:[{code, coefficient, validFrom}] }` (V2 526) |
| `activityStartDate` | date | Sí | Inicio de actividades |
| `fiscalAddress` | object | Sí | Domicilio fiscal (referencia M01 geografía) |
| `arcaActivities` | array | No | Códigos de actividad |
| `fiscalLogoStoredFileId` | ObjectId → `storedFiles` | No | Logo fiscal (V2 709; T05 §7.2 — antes ~~`fiscalLogoAssetId`~~) |
| `mipymeStatus` | object | No | `{ isMipyme, category, validFrom }`. No es un campo de estado: objeto de condición MiPyME sin máquina (§8.11; PA-FIS-22). |
| `regulatoryMap` | array | No | `{ serviceId, regulator, tariffAuthority, concession, validFrom }` (RF-FIS-150) |
| `surveyId` | ObjectId | Sí | Relevamiento fiscal aprobado vigente (RF-FIS-006) |
| `validFrom` / `validTo` | date | Sí / No | Versionado |

Índices: `{tenantId, legalEntityId, validFrom}` (DEC-064; COL-FIS-04; antes `{tenantId, validFrom}`).

El perfil se crea en `draft` al recibir `cfg.legalEntity.created` y se mantiene alineado con los datos legales de T04 según RN-FIS-131 (RF-CFG-138). `fiscalAuthorizations` guarda `issuerSnapshot` con los datos del emisor usados.

### 7.5 `fiscalSurveys` (tenant) — relevamiento fiscal (BASE §52.4)

Campos: `legalEntityId` (DEC-064), `items[]` `{ topic: ambito|prestaciones|tarifas|beneficios|tributos|cargos|bajas|documentos|responsables, evidence, decision, attachments[], status }`, `status` (`draft`, `inReview`, `approved`, `superseded`), `approvedBy`, `approvedAt`. Índice `{tenantId, status}`.

Campos de `fiscalSurveys` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |
| `items[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `draft`, `inReview`, `approved`, `superseded` | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `approvedAt` | datetime | [VERIFICAR] | — | — |

### 7.6 `taxAgentRegistrations` (tenant) — condiciones de agente

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica que es agente (DEC-064) |
| `organism` | enum | Sí | `ARCA`, `RentasCordoba`, `ARBA`, `ATER`, `APISantaFe`, `DGRLaPampa`, `ARTRioNegro`, `ComisionArbitral`, `municipio:<code>`, otros del catálogo |
| `tax` | enum | Sí | `IVA`, `Ganancias`, `IIBB`, `SUSS`, `Municipal` |
| `regime` | string | Sí | Código del régimen (ej. RG 830, RN 01/2017) |
| `role` | enum | Sí | `withholding`, `perception`, `both` |
| `agentNumber` | string | No | Número de agente (V2 2010) |
| `agentName` / `agentAddress` / `agentLocality` | string | No | V2 2008, 2009, 2011 |
| `filingSystem` | enum | Sí | `SICORE`, `SIRE`, `SIRCAR`, `provincialApp`, `webService`, `manual` |
| `validFrom` / `validTo` | date | Sí / No | Vigencia |
| `evidenceIds` | array | Sí | Respaldo documental (T11) |
| `responsibleUserIds` | array | Sí | Responsables |

Índices: `{tenantId, legalEntityId, organism, tax, regime, validFrom}` (DEC-064; antes sin entidad).

### 7.7 `arcaCredentials` (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica titular del certificado (DEC-064); `representedCuit` debe ser el CUIT de su perfil fiscal |
| `environment` | enum | Sí | `homologation`, `production` |
| `representedCuit` | string(11) | Sí | CUIT representado (RF-FIS-029) |
| `certificateCuit` | string(11) | Sí | CUIT del certificado (puede diferir si hay delegación) |
| `alias` | string | Sí | Alias del certificado en ARCA |
| `credentialRef` | ObjectId → `integrationSecrets` (T06) | Sí | Referencia al secreto en la bóveda de T06 (DEC-074; CTR-DAT-72), nunca el secreto. Contiene certificado y clave privada; si la clave y el CSR se generaron en la plataforma la clave privada nunca sale de la bóveda, y también se admite importar un PFX existente (DEC-053). Antes ~~`vaultRef`~~ y ~~`csrVaultRef`~~ (absorbidos en esta referencia). |
| `issuer`, `serialNumber` | string | Sí | Metadatos |
| `notBefore` / `notAfter` | date | Sí | Vigencia (equivale a V2 2925) |
| `authorizedServices` | array | Sí | `wsfe`, `ws_sr_padron_a13`, `ws_sr_constancia_inscripcion`, otros |
| `status` | enum | Sí | `pendingCertificate`, `testing`, `active`, `expiring`, `expired`, `revoked`, `replaced` |
| `lastHealthCheck` | object | No | `{ at, service, ok, message }` |

Índices: `{tenantId, legalEntityId, environment, alias}` único (COL-FIS-07); `{tenantId, environment, status}`; `{tenantId, notAfter}`.

### 7.8 `arcaAccessTickets` (tenant, cifrado)

Campos: `arcaCredentialId` (antes `credentialId`; nombre de T05), `service`, `environment`, `representedCuit`, `uniqueId`, `generationTime`, `expirationTime`, `tokenEnc`, `signEnc` (cifrados con clave del tenant; nunca expuestos por API), `obtainedAt`. Índices: `{tenantId, arcaCredentialId, service, environment}` único; TTL sobre `expirationTime`.

Campos de `arcaAccessTickets` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `arcaCredentialId` | ObjectId | Sí | Antes `credentialId`; nombre de T05 | `arcaCredentials` (M06) |
| `service` | [VERIFICAR] | Sí | — | — |
| `environment` | [VERIFICAR] | Sí | — | — |
| `representedCuit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `uniqueId` | ObjectId | [VERIFICAR] | — | no es referencia: `uniqueId` del ticket WSAA |
| `generationTime` | [VERIFICAR] | [VERIFICAR] | — | — |
| `expirationTime` | [VERIFICAR] | [VERIFICAR] | — | — |
| `tokenEnc` | [VERIFICAR] | [VERIFICAR] | — | — |
| `signEnc` | [VERIFICAR] | [VERIFICAR] | Cifrados con clave del tenant; nunca expuestos por API | — |
| `obtainedAt` | datetime | [VERIFICAR] | — | — |

### 7.9 `pointsOfSale` (tenant) — antes ~~`fiscalPointsOfSale`~~ (CTR-DAT-17)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica del punto de venta (DEC-064); el mismo número puede existir en dos entidades |
| `number` | int (1–99999) | Sí | Número ARCA (ProCoop `PTOVENTA.SUC_COM`) |
| `description` | string | Sí | `DES_POS` |
| `emissionSystem` | enum | Sí | `webServiceCae`, `webServiceCaea`, `cai`, `cesp` |
| `branchId`, `serviceIds`, `channel` | refs | No | Sucursal, servicios, canal |
| `status` | enum | Sí | `active`, `paused`, `retired` (ProCoop `PAUSAR`) |
| `arcaStatus` | object | No | `{ blocked, retiredAt, syncedAt }` de `FEParamGetPtosVenta` |
| `documentModes` | array | Sí | `{ voucherTypeId (M05 `voucherTypes`; CTR-DAT-14 — antes ~~`documentTypeId`~~), arcaCbteType, cae: bool, caea: bool, cai: bool, cesp: bool, caiCurrent, caiExpiresAt }` (ProCoop `COMPPOS`) |
| `autoAuthorize` | bool | Sí | V2 726 por punto |
| `channels[]`, `address`, `validFrom` / `validTo`, `arcaEnabledAt` | — | No | Uso operativo que antes declaraba M05 en su propia colección `pointsOfSale` (canales `batch`, `counter`, `portal`, `field`, `prepaid`); se absorben aquí (CTR-DAT-17; COL-FIS-09) |

Índices: `{tenantId, legalEntityId, number}` único (DEC-064; antes `{tenantId, number}`); `{tenantId, status}`. Colección única de punto de venta, fiscal y operativo (CTR-DAT-17): M05 la lee y no tiene colección propia. La **numeración** (último número, secuencias) es de M05 (`numberSequences`; CTR-DAT-16 — antes ~~`documentSequences`~~, que no existe).

### 7.10 `fiscalAuthorizations` (tenant) — cola de autorización

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica emisora, copiada del comprobante (DEC-064); determina CUIT y credencial ARCA |
| `documentRef` | ObjectId | Sí | Comprobante M05/M07/M11/M18 (o `gatewayDocuments`) Antes `documentId` (nombre de T05). |
| `sourceModule` | enum | Sí | `fac`, `cob`, `ven`, `soc`, `gateway` |
| `pointOfSale` / `arcaCbteType` / `number` | int | Sí | Clave fiscal |
| `issueDate` | date | Sí | `CbteFch` |
| `authorizationKind` | enum | Sí | `cae`, `caea`, `cai`, `cesp` |
| `status` | enum | Sí | Ver §8.1 |
| `payload` | object | Sí | Datos fiscales del request: `concept`, `docType`, `docNumber`, `receiverVatConditionId`, `amounts{net, exempt, untaxed, vat, taxes, total}`, `vat[]{id, base, amount}`, `taxes[]{id, description, base, rate, amount}`, `associated[]{type, pos, number, cuit, date}`, `associatedPeriod{from,to}`, `optionals[]{id, value}`, `activities[]`, `buyers[]`, `currency`, `exchangeRate`, `sameCurrencyPayment`, `serviceFrom`, `serviceTo`, `paymentDueDate`, `generatedAt` |
| `payloadHash` | string | Sí | Detecta cambios entre intentos |
| `prevalidation` | object | Sí | `{ ok, reasons[]: {code, dictKey, field} }` |
| `attempts` | array | Sí | `{ at, submissionId, result: A\|R\|P\|timeout\|error, errors[], observations[] }` |
| `cae` / `caeExpiresAt` | string / date | No | Resultado (o CAEA/CAI/CESP) |
| `observations` | array | No | Observaciones ARCA del detalle correcto |
| `qrData` | object | No | Datos del QR (RF-FIS-061) |
| `barcodeData` | string | No | Código de barras |
| `caeaReported` | object | No | `{ at, submissionId, result }` |
| `reconciliation` | object | No | `{ at, arcaCae, arcaTotal, diff, proposal, approvedBy }` |
| `idempotencyKey` | string | Sí | `tenantId:cuit:pos:type:number` |
| `pointOfSaleId` | ObjectId | Sí | Punto de venta (T05); `pointOfSale` conserva el número ARCA. Referencia: `pointsOfSale` (M06). |
| `issueAttempt` | int | Sí | Intento de emisión del comprobante en M05 (`invoices.issueAttempt`); cada número asignado al mismo comprobante genera una autorización nueva (DEC-107) |
| `rejectionKind` | enum | Cond. | `dataError`, `sequenceOnly`; obligatorio en `rejected` (DEC-107, RF-FIS-053) |
| `cancelReason` | enum | Cond. | `annulledBeforeSend`, `numberReleased`; obligatorio en `cancelled` (DEC-107) |

Índices: `{tenantId, idempotencyKey}` único parcial sobre los estados distintos de `rejected` y `cancelled`, porque con DEC-107 un número liberado puede reasignarse a otro comprobante y la autorización anterior queda como evidencia (*Reemplazado (10-11-2026, DEC-107): "`{tenantId, idempotencyKey}` único" sin filtro*); `{tenantId, documentRef, issueAttempt}` único (DEC-107); `{tenantId, legalEntityId, pointOfSale, arcaCbteType, number}` (DEC-064; antes sin entidad); `{tenantId, status, issueDate}`; `{tenantId, documentRef}`.

### 7.11 `arcaSubmissions` (tenant) — envíos a ARCA

Campos: `operation` (`FECAESolicitar`, `FECAEARegInformativo`, `FECAEASinMovimientoInformar`, `FECompConsultar`, `FECompUltimoAutorizado`, `FECAEASolicitar`, `FECAEAConsultar`, `getPersona`, `getIdPersonaListByDocumento`, `getPersona_v2 constancia`, `FEParamGet*`), `environment`, `pointOfSale`, `arcaCbteType`, `rangeFrom`, `rangeTo`, `count`, `authorizationIds[]`, `requestMaskedRef` y `responseMaskedRef` (almacenamiento privado, sin token/sign), `headerResult`, `errors[]`, `durationMs`, `status` (`sending`, `answered`, `timeout`, `transportError`), `jobId`, `correlationId`, `legalEntityId` (DEC-064). Índices: `{tenantId, createdAt}`, `{tenantId, legalEntityId, pointOfSale, arcaCbteType, rangeFrom}`.

Campos de `arcaSubmissions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operation` | [VERIFICAR] | [VERIFICAR] | `FECAESolicitar`, `FECAEARegInformativo`, `FECAEASinMovimientoInformar`, `FECompConsultar`, `FECompUltimoAutorizado`, `FECAEASolicitar`, `FECAEAConsultar`, `getPersona`, `getIdPersonaListByDocumento`, `getPersona_v2 constancia`, `FEParamGet*` | — |
| `environment` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pointOfSale` | [VERIFICAR] | [VERIFICAR] | — | — |
| `arcaCbteType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `rangeFrom` | date | [VERIFICAR] | — | — |
| `rangeTo` | date | [VERIFICAR] | — | — |
| `count` | int | [VERIFICAR] | — | — |
| `authorizationIds[]` | ObjectId[] | [VERIFICAR] | — | `fiscalAuthorizations` (M06) |
| `requestMaskedRef` | [VERIFICAR] | [VERIFICAR] | — | — |
| `responseMaskedRef` | [VERIFICAR] | [VERIFICAR] | Almacenamiento privado, sin token/sign | — |
| `headerResult` | [VERIFICAR] | [VERIFICAR] | — | — |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `durationMs` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `sending`, `answered`, `timeout`, `transportError` | — |
| `jobId` | ObjectId | [VERIFICAR] | — | `jobRuns` (T01) |
| `correlationId` | ObjectId | [VERIFICAR] | — | no es referencia: id de correlación |
| `legalEntityId` | ObjectId | [VERIFICAR] | DEC-064 | `legalEntities` (T04) |
| `integrationOperationId` | ObjectId | [VERIFICAR] | Operación de integración (T05 lo declara en claves). | `integrationOperations` (T06) |

### 7.12 `caeaPeriods` (tenant)

Campos: `legalEntityId` (DEC-064), `period` (`YYYY-MM`, convención de T05; ARCA usa `yyyyMM` y se convierte en la integración), `order` (1/2), `caea`, `validFrom`, `validTo`, `reportDeadline`, `pointsOfSale[]` `{ number, used: bool, reportedWithoutMovementAt }`, `status` (`requested`, `active`, `reporting`, `reported`, `expiredWithPending`), `obtainedVia` (`consult`, `request`). Índices: `{tenantId, legalEntityId, period, order}` único (COL-FIS-12; antes sin entidad).

Campos de `caeaPeriods` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |
| `period` | string | Sí | `YYYY-MM`, convención de T05; ARCA usa `yyyyMM` y se convierte en la integración | — |
| `order` | int | Sí | 1/2 | — |
| `caea` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `reportDeadline` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pointsOfSale[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `requested`, `active`, `reporting`, `reported`, `expiredWithPending` | — |
| `obtainedVia` | enum | [VERIFICAR] | `consult`, `request` | — |

### 7.13 `cespAuthorizations` (tenant)

Campos: `legalEntityId` (DEC-064), `description`, `cesp`, `validFrom`, `validTo`, `expiresAt`, `pointOfSale`, `voucherTypeIds[]`, `status` (`active`, `expired`, `cancelled`). Validación de no superposición por punto (incluida contención). Índice `{tenantId, legalEntityId, pointOfSale, validFrom, validTo}`. Origen ProCoop: `CESPAFIP` con `CAEA = 0`.

Campos de `cespAuthorizations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | [VERIFICAR] | DEC-064 | `legalEntities` (T04) |
| `description` | string | [VERIFICAR] | — | — |
| `cesp` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `expiresAt` | datetime | [VERIFICAR] | — | — |
| `pointOfSale` | [VERIFICAR] | [VERIFICAR] | — | — |
| `voucherTypeIds[]` | ObjectId[] | [VERIFICAR] | — | `voucherTypes` (M05) |
| `status` | enum | Sí | `active`, `expired`, `cancelled` | — |
| `pointOfSaleId` | ObjectId | Sí | Punto de venta (T05); `pointOfSale` conserva el número ARCA. | `pointsOfSale` (M06) |

### 7.14 `provincialValidationCodes` (tenant) — CVP

Campos: `jurisdiction`, `pointOfSale`, `voucherTypeId`, `validFrom`, `validTo`, `code`, `legend`, `status`. Índice `{tenantId, pointOfSale, voucherTypeId, validFrom}` (CTR-DAT-14). Origen `CVPIIBB`.

Campos de `provincialValidationCodes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pointOfSale` | [VERIFICAR] | [VERIFICAR] | — | — |
| `voucherTypeId` | ObjectId | Sí | — | `voucherTypes` (M05) |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | — | — |
| `legend` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `active`, `expired` (§8.11; PA-FIS-21). | — |
| `pointOfSaleId` | ObjectId | Sí | Punto de venta; único con `voucherTypeId` y `validFrom` (T05). | `pointsOfSale` (M06) |

### 7.15 `vatConditionSettings` (tenant) — configuración por condición IVA

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `arcaConditionId` | int | Sí | Código ARCA vigente (tabla normativa) Referencia: no es referencia interna: código ARCA de la tabla normativa (`normativeTables`, M06). |
| `internalCode` | string | Sí | Código del tenant (migrado de `SITIVA.COD_SIT`) |
| `label` | dictKey | Sí | Descripción |
| `isRegistered` | bool | Sí | Equivale a `IVARI` |
| `vatLedgerCriterion` | enum | Sí | `invoiced`, `collected` (ProCoop `PERCIBIDO`) |
| `perceptionMinimum` | Decimal128 | No | `MIN_PERCEPCION` |
| `perceptionOnNet` | bool | Sí | `PERCEPCION_SOBRE_NETO` |
| `isUncategorized` | bool | Sí | Equivale a V2 544 |
| `offlineRegistryCode` | string | No | `COD_EMPAFIP` |
| `sireCode` | string | No | Código SIRE |
| `ledgerCode` | string | No | `SITIVA.COD_AFIP` para carátula/RG 3349/compras |
| `defaultDocumentTypes` | object | No | Sugerencia a M05: `{ invoice, credit, debit, lqsp, mipymeInvoice, mipymeCredit, mipymeDebit }` |
| `validFrom` / `validTo` | date | Sí / No | Vigencia |

Índice `{tenantId, arcaConditionId, validFrom}`.

### 7.16 `vatRates` y `vatRateMatrix` (tenant, sobre tabla normativa)

`vatRates`: `rate` (Decimal128), `kind` (`taxed`, `exempt`, `untaxed`, `notSubject`), `arcaVatId` (3, 4, 5, 6, 8, 9), `validFrom/validTo`. Origen `ALI_IVA`. Sin cuentas contables: van en `entityAccountAssignments` de M15 (`entityType = vatRate`, `usage` `sales`, `purchases`, `salesPerception`; antes `accounts{ sales, purchases, salesPerception }` (M15) en esta colección).

Campos de `vatRates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `rate` | decimal | [VERIFICAR] | Decimal128 | — |
| `kind` | enum | [VERIFICAR] | `taxed`, `exempt`, `untaxed`, `notSubject` | — |
| `arcaVatId` | int (antes ObjectId) | Sí | (3, 4, 5, 6, 8, 9) (antes la celda incluía `accounts{ sales, purchases, salesPerception }` (M15), que pasan a `entityAccountAssignments`) | no es referencia: código ARCA de alícuota de la tabla normativa (`normativeTables`, M06); por eso el tipo es entero |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

> **Alineación con T05 (05-11-2026):** `vatRates` no guarda cuentas contables; las cuentas de ventas, compras y percepción de cada alícuota viven en `entityAccountAssignments` (COL-CON-38, M15, `entityType = vatRate`; PA-FIS-22, T05 PA-DAT-04). Antes: "T05 usa `ledgerAccountIds`; la ficha lo modela como `accounts{ sales, purchases, salesPerception }` (`ledgerAccounts`, M15)".

`vatRateMatrix`: `vatRateId`, `vatConditionSettingId`, `supplyUsageClasses[]` (opcional; DEC-102; antes `supplyUsageIds[]`), `vatPct`, `vatPct2`, `perceptionPct`, `perceptionTaxId`, `validFrom/validTo`. Índice `{tenantId, vatRateId, vatConditionSettingId, supplyUsageKey, validFrom}` único, donde `supplyUsageKey` es la lista ordenada de `supplyUsageClasses[]` (vacía en la fila sin uso; antes, de `supplyUsageIds[]`); la superposición de usos entre filas vigentes se valida al guardar (RN-FIS-073). Índice anterior: `{tenantId, vatRateId, vatConditionSettingId, validFrom}` único. Origen `ALI_IVA_CF`.

**`vatRateMatrix`** — tabla de campos.

Campos de `vatRateMatrix` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `vatRateId` | ObjectId | Sí | — | `vatRates` (M06) |
| `vatConditionSettingId` | ObjectId | Sí | — | `vatConditionSettings` (M06) |
| `vatPct` | decimal | [VERIFICAR] | — | — |
| `vatPct2` | [VERIFICAR] | [VERIFICAR] | — | — |
| `perceptionPct` | decimal | [VERIFICAR] | — | — |
| `perceptionTaxId` | ObjectId | No | Tributo de percepción aplicable a la combinación. | → `taxDefinitions` (M06) |
| `supplyUsageClasses[]` | enum[] | No | Condición opcional por clase de uso del suministro: `residential`, `commercial`, `industrial`, `rural`, `other` (clase normalizada `premiseUsages.usageClass` de M01, RF-PER-089); vacío = la fila vale para cualquier uso. Solo se evalúa si PRM-FIS-125 está activo para el tenant y el servicio (default desactivado; DEC-102, PA-FIS-26). La clase se obtiene de `premises.usageId` del inmueble del suministro (M01 §7.7) → `premiseUsages.usageClass` (M01 §7.18). Al ser un enum de plataforma, una fila de la tabla normativa vale para todos los tenants aunque cada uno tenga sus propios usos. *Reemplazado (10-11-2026, alineación con M01): "`supplyUsageIds[]` \| ObjectId[] \| … uso del catálogo … \| `enumerationItems` (T04), catálogo `premiseUsages`", que dependía de IDs del tenant.* | `premiseUsages.usageClass` (M01 §7.18) |
| `supplyUsageKey` | string | Sí | Derivado: `supplyUsageClasses[]` ordenado y concatenado (vacío si no hay uso); solo existe para el índice único (DEC-102; antes derivado de `supplyUsageIds[]`). | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.17 `taxDefinitions` (tenant) — catálogo de tributos, percepciones y conceptos fiscales

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` / `label` | string / dictKey | Sí | Identificación |
| `level` | enum | Sí | `national`, `provincial`, `municipal`, `internal`, `other` (ProCoop `ORIGEN`) |
| `nature` | enum | Sí | `ownTax`, `perception`, `thirdPartyCharge`, `untaxedConcept`, `thirdPartyTax` (tributo de un organismo tercero informado en `ImpTrib`; HUECO-TAS-03), `pendingClassification` (no publicable; RN-FIS-126) |
| `classification` | object | Sí | Traza de RN-FIS-126: `{ ruleStep, organismLevel (de `IMPUESTO.ORIGEN`), thirdPartyAgreementId, source (`migration`, `manual`), decidedBy, decidedAt }` (HUECO-TAS-03) |
| `arcaTaxId` | int | Sí (si informable) | Id de `FEParamGetTiposTributos` (mapeo explícito, RF-FIS-047) Referencia: no es referencia interna: código ARCA de tributo (`normativeTables`, M06). |
| `ledgerColumn` | enum | Sí | Columna en libro IVA y archivos |
| `sicoreCodes` | object | No | `{ tax, regime }` |
| `jurisdiction` | string | No | Provincia/municipio |
| `basis` | object | Sí | Fundamento normativo (norma, URL, fecha) |
| `transferableToMember` | bool | Sí | Si puede trasladarse al socio (BASE §52.2) |
| `allowedServices` / `allowedDocumentTypes` | array | Sí | Dónde puede aplicarse |
| `calculation` | object | Sí | `{ base: net\|netPlusVat\|fixed\|formulaRef, rateSource: matrix\|registry\|fixed, minimumBase, minimumAmount, roundingRule }` |
| `accountMap` | object | — | **Reemplazado por `entityAccountAssignments`** (COL-CON-38, M15, `entityType = taxDefinition`): `taxDefinitions` no guarda cuentas contables (PA-FIS-22, T05 PA-DAT-04). Antes obligatorio, "Cuentas contables" |
| `validFrom` / `validTo` | date | Sí / No | Vigencia |

Índices: `{tenantId, code}` único; `{tenantId, nature, level}`. Origen `IMPUESTO`, `ALI_IBR`.

> **Alineación con T05 (05-11-2026):** las cuentas contables del tributo viven en `entityAccountAssignments` (COL-CON-38, M15, `entityType = taxDefinition`); M06 no guarda `ledgerAccountId` (PA-FIS-22, T05 PA-DAT-04). Antes: "T05 usa `ledgerAccountIds`; la ficha lo modela como `accountMap` (`ledgerAccounts`, M15)".

### 7.18 `grossIncomeSettings` (tenant)

Subdocumentos versionados: `conditions[]` (`code`, `label`, `exempt`, `minimumBase`) — `SITIBR`; `rates[]` (`code`, `label`, `collectInInvoicing` = `RENDIR`, `taxDefinitionId` = `COD_IMP`, `group` = `GRUPO_IMP`) — `ALI_IBR`; `matrix[]` (`rateCode`, `vatConditionCode`, `grossIncomeConditionCode`, `pct`) — `ALI_IBR_CF`; `byDocument[]` (`rateCode`, `voucherTypeId`, `grossIncomeConditionCode`, `calculation: onNet|onNetPlusVat`) — `ALI_IBR_COMP`; `minimumTaxable` (V2 758); `uncategorizedRates{ publicServices (V2 759), otherServices (V2 760) }`; `validFrom/validTo`. Índice `{tenantId, jurisdiction, validFrom}`.

Campos de `grossIncomeSettings` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `conditions[]` | array [VERIFICAR] | [VERIFICAR] | (`code`, `label`, `exempt`, `minimumBase`) — `SITIBR` | — |
| `rates[]` | array [VERIFICAR] | [VERIFICAR] | (`code`, `label`, `collectInInvoicing` = `RENDIR`, `taxDefinitionId` = `COD_IMP`, `group` = `GRUPO_IMP`) — `ALI_IBR` | — |
| `matrix[]` | array [VERIFICAR] | [VERIFICAR] | (`rateCode`, `vatConditionCode`, `grossIncomeConditionCode`, `pct`) — `ALI_IBR_CF` | — |
| `byDocument[]` | array [VERIFICAR] | [VERIFICAR] | (`rateCode`, `voucherTypeId`, `grossIncomeConditionCode`, `calculation: onNet/onNetPlusVat`) — `ALI_IBR_COMP` | — |
| `minimumTaxable` | [VERIFICAR] | [VERIFICAR] | (V2 758); `uncategorizedRates{ publicServices (V2 759), otherServices (V2 760) }` | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `jurisdiction` | string | Sí | Jurisdicción; único con `validFrom` (T05). | — |

### 7.19 `taxpayerRegistries` y `taxpayerRegistryEntries` (tenant; padrones)

`taxpayerRegistries`: `kind` (`arcaOfflineCondition`, `iibbRates`, `exclusions`), `maintainedBy` (`platform`, `tenant`; RN-FIS-132, PA-FIS-18), `legalEntityId` (obligatorio si `maintainedBy = tenant`; entidad agente, DEC-064), `jurisdiction`, `regime` (ej. `RN-01-2017-CBA`, `ARBA`, `ATER-RN-208-24`), `publishedAt`, `validFrom`, `validTo`, `storedFileId` (T05 §7.2; antes ~~`fileAssetId`~~), `fileHash`, `rowCount`, `errors[]`, `status` (`importing`, `validated`, `active`, `superseded`, `failed`), `approvedBy`.

Campos de `taxpayerRegistries` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | Sí | `arcaOfflineCondition`, `iibbRates`, `exclusions` | — |
| `maintainedBy` | enum | [VERIFICAR] | `platform`, `tenant`; RN-FIS-132, PA-FIS-18 | — |
| `legalEntityId` | ObjectId | [VERIFICAR] | Obligatorio si `maintainedBy = tenant`; entidad agente, DEC-064 | `legalEntities` (T04) |
| `jurisdiction` | [VERIFICAR] | Sí | — | — |
| `regime` | [VERIFICAR] | Sí | Ej. `RN-01-2017-CBA`, `ARBA`, `ATER-RN-208-24` | — |
| `publishedAt` | datetime | [VERIFICAR] | — | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `storedFileId` | ObjectId | Sí | T05 §7.2; antes ~~`fileAssetId`~~ | `storedFiles` (T01) |
| `fileHash` | string | [VERIFICAR] | — | — |
| `rowCount` | int | [VERIFICAR] | — | — |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `importing`, `validated`, `active`, `superseded`, `failed` | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |

`taxpayerRegistryEntries`: `registryId`, `cuit`, `cuit2`, `name`, `accountId` (si se vinculó, ProCoop `COD_SUM`), `vatCode`, `monotributoCode`, `grossIncomeConditionCode` (`COD_SIB`), `rate` (`ALICUOTA`), `groupOrType` (`TIPOC`, `IBR`), `validFrom`, `validTo`. Índices: `{tenantId, registryId, cuit}`; `{tenantId, cuit, validFrom}`. Origen `IIBB_LUA`, `EMPAFIP`.

**`taxpayerRegistryEntries`** — tabla de campos.

Campos de `taxpayerRegistryEntries` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `registryId` | ObjectId | Sí | — | `taxpayerRegistries` (M06) |
| `cuit` | string | Sí | — | — |
| `cuit2` | [VERIFICAR] | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `accountId` | ObjectId | Sí | Si se vinculó, ProCoop `COD_SUM` | `accounts` (M01) |
| `vatCode` | string | [VERIFICAR] | — | — |
| `monotributoCode` | string | [VERIFICAR] | — | — |
| `grossIncomeConditionCode` | string | [VERIFICAR] | `COD_SIB` | — |
| `rate` | decimal | [VERIFICAR] | `ALICUOTA` | — |
| `groupOrType` | enum | [VERIFICAR] | `TIPOC`, `IBR` | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.20 `determinedRates` (tenant) — alícuota determinada por cuenta

Campos: `accountId`, `jurisdiction`, `regime`, `rate`, `reason`, `evidenceId`, `validFrom/validTo`, `approvedBy`. Origen `frmAlicuotaDeterminada`.

Campos de `determinedRates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | ObjectId | Sí | — | `accounts` (M01) |
| `jurisdiction` | [VERIFICAR] | Sí | — | — |
| `regime` | [VERIFICAR] | Sí | — | — |
| `rate` | decimal | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `evidenceId` | ObjectId | [VERIFICAR] | — | `documents` (T11) |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `approvedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |

### 7.21 `taxExemptions` (tenant) — exclusiones y certificados de no retención/percepción

Campos: `partyType` (`account`, `person`, `supplier`), `partyId`, `cuit`, `tax`, `regime`, `kind` (`exclusion`, `nonWithholdingCertificate`, `reduction`, `noPerception`), `pct`, `certificateNumber`, `validFrom/validTo`, `evidenceId`, `source` (`manual`, `registry`). Índice `{tenantId, partyId, tax, validFrom}`. Reemplaza `SUMSOC.NO_COBRAR_PERCEPCION` con respaldo.

Campos de `taxExemptions` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `partyType` | enum | [VERIFICAR] | `account`, `person`, `supplier` | — |
| `partyId` | ObjectId | Sí | — | polimórfica según `partyType`: `accounts` (M01), `persons` (M01) o `suppliers` (M12) |
| `cuit` | string | [VERIFICAR] | — | — |
| `tax` | [VERIFICAR] | Sí | — | — |
| `regime` | [VERIFICAR] | Sí | — | — |
| `kind` | enum | [VERIFICAR] | `exclusion`, `nonWithholdingCertificate`, `reduction`, `noPerception` | — |
| `pct` | decimal | [VERIFICAR] | — | — |
| `certificateNumber` | int | [VERIFICAR] | — | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `evidenceId` | ObjectId | [VERIFICAR] | — | `documents` (T11) |
| `source` | enum | [VERIFICAR] | `manual`, `registry` | — |

### 7.22 `taxCalculationTraces` (tenant)

Campos: `documentRef` (antes `documentId`; nombre de T05), `lines[]` `{ itemRef, taxDefinitionId, base, rate, amount, rule, normativeVersionIds[], registryEntryId, exemptionId, supplyUsageId, supplyUsageClass, skippedReason }` (`supplyUsageId`: uso del suministro aplicado por la matriz de IVA, nulo si la condición está apagada o la fila no tiene uso; `supplyUsageClass`: su clase `premiseUsages.usageClass`, agregada el 10-11-2026; DEC-102), `totals`, `computedAt`, `engineVersion`. Índice `{tenantId, documentRef}`.

Campos de `taxCalculationTraces` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `documentRef` | [VERIFICAR] | Sí | Antes `documentId`; nombre de T05 | polimórfica: comprobante de M05/M07/M11/M18 o `gatewayDocuments` (M06) |
| `lines[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `totals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `computedAt` | datetime | [VERIFICAR] | — | — |
| `engineVersion` | int | [VERIFICAR] | — | — |

### 7.23 `withholdingTypes`, `withholdingScales`, `withholdingAssignments` (tenant)

`withholdingTypes`: `code`, `tax` (`IB`, `IV`, `GN`, `SS`), `label`, `regimeCode` (`COD_REG`), `minWithholding` (`MIN_RET`), `minTaxable` (`MIN_IMP`), `fixedAmount` (`RET_PES`), `fixedPct` (`RET_POR`), `fixedExcess` (`RET_EXE`), `baseFlags{ addNet, addTaxes, addExempt, addVat, addPerceptions, subNet, subTaxes, subExempt, subVat, subPerceptions }`, `factor` (`M_FACTOR`), `onlyFullPayment` (`TOT_PRO`), `byItem` (`CALCULAXITEM`), `accumulationMonths` (`ACUM_MES`), `calendarAccumulation` (`ACUM_CALE`), `annualMinimumDiscount` (`DESC_ANUAL`), `ownNumbering` (`NUMERO`), `baseTypeCode` (`RETE_TIPO_BASE`), `taxAgentRegistrationId` (antes `agentRegistrationId`; nombre de T05), `ledgerAccountId` (antes `accountId`; nombre de T05), `validFrom/validTo`.

Campos de `withholdingTypes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `tax` | [VERIFICAR] | [VERIFICAR] | `IB`, `IV`, `GN`, `SS` | — |
| `label` | string | [VERIFICAR] | — | — |
| `regimeCode` | string | [VERIFICAR] | `COD_REG` | — |
| `minWithholding` | [VERIFICAR] | [VERIFICAR] | `MIN_RET` | — |
| `minTaxable` | [VERIFICAR] | [VERIFICAR] | `MIN_IMP` | — |
| `fixedAmount` | decimal | [VERIFICAR] | `RET_PES` | — |
| `fixedPct` | decimal | [VERIFICAR] | `RET_POR` | — |
| `fixedExcess` | [VERIFICAR] | [VERIFICAR] | (`RET_EXE`), `baseFlags{ addNet, addTaxes, addExempt, addVat, addPerceptions, subNet, subTaxes, subExempt, subVat, subPerceptions }` | — |
| `factor` | decimal | [VERIFICAR] | `M_FACTOR` | — |
| `onlyFullPayment` | [VERIFICAR] | [VERIFICAR] | `TOT_PRO` | — |
| `byItem` | [VERIFICAR] | [VERIFICAR] | `CALCULAXITEM` | — |
| `accumulationMonths` | int | [VERIFICAR] | `ACUM_MES` | — |
| `calendarAccumulation` | [VERIFICAR] | [VERIFICAR] | `ACUM_CALE` | — |
| `annualMinimumDiscount` | int | [VERIFICAR] | `DESC_ANUAL` | — |
| `ownNumbering` | [VERIFICAR] | [VERIFICAR] | `NUMERO` | — |
| `baseTypeCode` | string | [VERIFICAR] | `RETE_TIPO_BASE` | — |
| `taxAgentRegistrationId` | ObjectId | Sí | Antes `agentRegistrationId`; nombre de T05 | `taxAgentRegistrations` (M06) |
| `ledgerAccountId` | ObjectId | Sí | Antes `accountId`; nombre de T05 | `ledgerAccounts` (M15) |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

`withholdingScales`: `withholdingTypeId`, `from` (`IMP_MIN`), `to` (`IMP_MAX`), `fixedAmount` (`RET_PES`), `pct` (`RET_POR`), `excess` (`EXCEDENTE`), `validFrom/validTo`. Origen `CAT_RETG`.

**`withholdingScales`** — tabla de campos.

Campos de `withholdingScales` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `withholdingTypeId` | ObjectId | Sí | — | `withholdingTypes` (M06) |
| `from` | [VERIFICAR] | Sí | `IMP_MIN` | — |
| `to` | [VERIFICAR] | [VERIFICAR] | `IMP_MAX` | — |
| `fixedAmount` | decimal | [VERIFICAR] | `RET_PES` | — |
| `pct` | decimal | [VERIFICAR] | `RET_POR` | — |
| `excess` | [VERIFICAR] | [VERIFICAR] | `EXCEDENTE` | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

`withholdingAssignments`: `targetType` (`supplier`, `product`, `purchaseConcept`), `targetId`, `withholdingTypeId`, `validFrom/validTo`. Origen `PROVEED_RET`, `PROD_SER_RET`, `CON_COM_RET`.

**`withholdingAssignments`** — tabla de campos.

Campos de `withholdingAssignments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `targetType` | enum | Sí | `supplier`, `product`, `purchaseConcept` | — |
| `targetId` | ObjectId | Sí | — | polimórfica según `targetType` |
| `withholdingTypeId` | ObjectId | Sí | — | `withholdingTypes` (M06) |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.24 `withholdingsApplied` (tenant) — retenciones practicadas

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica agente de retención (DEC-064) |
| `paymentOrderId` | ObjectId | Sí | OP de M12/M14. Referencia: → `paymentOrders` (M12). |
| `supplierId` / `supplierCuit` | ObjectId / string | Sí | Sujeto retenido. Referencia: `supplierId` → `suppliers` (M12); `supplierCuit` no es referencia (CUIT del sujeto a la fecha de la retención). La CUIT se toma de la persona de M01 del proveedor (`suppliers.personId`, obligatorio por DEC-097; identificación CUIT de `persons.identifiers`) o, si M01 no responde, de la copia `suppliers.identitySnapshot.taxId`; nunca de un campo propio del proveedor, que dejó de existir (10-11-2026, DEC-097; antes sin fuente declarada). |
| `supplierPersonId` | ObjectId | Sí | Persona de M01 del sujeto retenido, copiada de `suppliers.personId` al confirmar la retención (DEC-097, 10-11-2026); clave para el certificado, el padrón y las exclusiones (`taxExemptions` con `partyType = person`) | `persons` (M01) |
| `withholdingTypeId` | ObjectId | Sí | Tipo. Referencia: → `withholdingTypes` (M06). |
| `date` | date | Sí | Fecha de la retención |
| `reportingPeriod` | string | Sí | Período de información (`FEC_INF`, V2 2045) |
| `base`, `fixedAmount`, `pct`, `excess`, `amount` | Decimal128 | Sí | Cálculo (`BASE_IMP`, `RET_PES`, `RET_POR`, `RET_EXE`, `RETENCION`) |
| `accumulation` | object | No | `{ windowFrom, windowTo, paidInWindow, withheldInWindow }` |
| `certificate` | object | Sí | `{ internalNumber (NROEMI), pointOfSale, year, storedFileId (antes ~~`pdfAssetId`~~), officialCode, officialObtainedAt }` |
| `manualOverride` | object | No | `{ originalAmount, reason, by }` (V2 2836) |
| `status` | enum | Sí | Ver §8.6 |
| `filingId` | ObjectId | No | Declaración donde se informó. Referencia: → `regimeFilings` (M06). |
| `obligationId` | ObjectId | No | Obligación fiscal. Referencia: → `taxObligations` (M06). |

Índices: `{tenantId, legalEntityId, withholdingTypeId, "certificate.internalNumber"}` único (COL-FIS-28); `{tenantId, supplierId, date}`; `{tenantId, reportingPeriod, withholdingTypeId}`; `{tenantId, paymentOrderId}`. Origen `RET_COM`.

### 7.25 `withholdingSufferedTypes` (tenant)

Campos: `code`, `label`, `tax`, `regime`, `ledgerAccountId` (`CTA_CONT`; T05 §7.2 — antes ~~`accountId`~~), `requiresCertificate`, `validFrom/validTo`. Origen `RETS_TIPO`. El registro de la retención sufrida es de M07.

Campos de `withholdingSufferedTypes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `label` | string | [VERIFICAR] | — | — |
| `tax` | [VERIFICAR] | [VERIFICAR] | — | — |
| `regime` | [VERIFICAR] | [VERIFICAR] | — | — |
| `ledgerAccountId` | ObjectId | Sí | `CTA_CONT`; T05 §7.2 — antes ~~`accountId`~~ | `ledgerAccounts` (M15) |
| `requiresCertificate` | bool | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

### 7.26 `taxObligations` (tenant)

Campos: `legalEntityId` (DEC-064), `taxAgentRegistrationId` (obligaciones como agente), `ownTaxObligationId` (obligaciones propias como contribuyente, DEC-095; exactamente uno de los dos), `tax`, `regime`, `period`, `dueDate`, `amount`, `sourceRefs[]` (retenciones/percepciones/declaración), `status` (`pending`, `ordered`, `cancellationPending`, `paid`, `reconciled`, `cancelled`; `cancellationPending` agregado el 10-11-2026, RN-FIS-133 punto 9), `paymentConflict`, `creditBalanceAmount`, `treasuryMovementId` (M14), `journalEntryId` (M15). Índice `{tenantId, legalEntityId, regime, period}` (COL-FIS-30; antes `{tenantId, period, regime}`).

Campos de `taxObligations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |
| `taxAgentRegistrationId` | ObjectId | Cond. | Obligatorio si la obligación nace como agente (retenciones, percepciones, regímenes); nulo si nace de `ownTaxObligationId` (DEC-095; antes "Sí") | `taxAgentRegistrations` (M06) |
| `ownTaxObligationId` | ObjectId | Cond. | Obligatorio si la obligación es propia de la cooperativa como contribuyente (RN-FIS-133); excluyente con `taxAgentRegistrationId` (DEC-095) | `ownTaxObligations` (M06) |
| `tax` | [VERIFICAR] | [VERIFICAR] | — | — |
| `regime` | [VERIFICAR] | Sí | — | — |
| `period` | string | Sí | — | — |
| `dueDate` | date | [VERIFICAR] | — | — |
| `amount` | decimal | [VERIFICAR] | — | — |
| `sourceRefs[]` | array [VERIFICAR] | [VERIFICAR] | Retenciones/percepciones/declaración | — |
| `status` | enum | Sí | `pending`, `ordered`, `cancellationPending`, `paid`, `reconciled`, `cancelled` (`cancellationPending`: anulación o recálculo pedido con el pago en curso en M14, RN-FIS-133 punto 9; 10-11-2026, DEC-095; antes sin ese valor) | — |
| `paymentConflict` | object | Cond. | Obligatorio con `cancellationPending` y conservado al resolverse: `{ requestedReason, requestedAt, requestedBy, paymentExecutionId, resolution (paymentVoided, paymentExecuted), resolvedAt, resolvedByEventId }` (RN-FIS-133 punto 9; DEC-095, 10-11-2026) | `paymentExecutions` (M14) |
| `creditBalanceAmount` | decimal | Cond. | Importe pagado de una obligación anulada cuyo pago M14 ejecutó igual (`paymentConflict.resolution = paymentExecuted`): saldo a favor ante el organismo, a compensar o reclamar según dictamen del contador (RN-FIS-133 punto 9; DEC-095, 10-11-2026) | — |
| `capitalBaseRef` | object | Cond. | Para obligaciones propias sobre el capital: `{ capitalClosingId, asOf, component, baseAmount, final }` copiado de la respuesta de M17 (RN-FIS-133 puntos 5 y 7; 10-11-2026) | `capitalClosings` (M17) |
| `cancelReason` / `replacesObligationId` / `replacedByObligationId` | enum / ObjectId / ObjectId | Cond. | Motivo de anulación (`manual`, `ownObligationRevoked`, `capitalBaseReopened`, `recalculated`) y enlace entre la obligación anulada y la recalculada (EVT-FIS-26; 10-11-2026) | `taxObligations` (M06) |
| `treasuryMovementId` | ObjectId | Sí | M14 | `treasuryMovements` (M14) |
| `journalEntryId` | ObjectId | Sí | M15 | `journalEntries` (M15) |

### 7.27 `vatLedgers` y `vatLedgerLines` (tenant)

`vatLedgers`: `legalEntityId` (DEC-064: un libro por entidad jurídica; índice `{tenantId, legalEntityId, kind, period, rectificationNo}`, COL-FIS-31), `kind` (`sales`, `purchases`), `period`, `criterion` (`invoiced`, `collected`, `invoicedAndCollected`, `installmentsDue`), `dateBasis` (`issue`, `due`), `filters`, `reportType`, `status` (`draft`, `closed`, `reopened`, `rectified`), `snapshotHash`, `totals{ byCondition[], byRate[], lqsp }`, `closedBy/At`, `reopenReason`.

Campos de `vatLedgers` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064: un libro por entidad jurídica; índice `{tenantId, legalEntityId, kind, period, rectificationNo}`, COL-FIS-31 | `legalEntities` (T04) |
| `kind` | enum | Sí | `sales`, `purchases` | — |
| `period` | string | Sí | — | — |
| `criterion` | enum | [VERIFICAR] | `invoiced`, `collected`, `invoicedAndCollected`, `installmentsDue` | — |
| `dateBasis` | enum | [VERIFICAR] | `issue`, `due` | — |
| `filters` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reportType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `draft`, `closed`, `reopened`, `rectified` | — |
| `snapshotHash` | string | [VERIFICAR] | — | — |
| `closedBy` | [VERIFICAR] | [VERIFICAR] | — | `memberships` (T02) |
| `closedAt` | datetime | [VERIFICAR] | — | — |
| `reopenReason` | string | [VERIFICAR] | — | — |
| `rectificationNo` | int | Sí | Número de rectificación (0 = original); único con `legalEntityId`, `kind`, `period` (T05). | — |

`vatLedgerLines`: `ledgerId`, `documentRef` (antes `documentId`; nombre de T05), `date`, `arcaCbteType`, `pointOfSale`, `number`, `counterpartyDocType`, `counterpartyDocNumber`, `counterpartyName`, `vatConditionCode`, `sign`, `untaxed`, `exempt`, `taxedByRate[]{rate, arcaVatId, base, vat}`, `perceptions[]{taxDefinitionId, amount}`, `otherTaxes[]`, `total`, `activityCode`, `serviceId`, `branchId`, `installmentFinanced`, `lqsp`. Índices: `{tenantId, ledgerId}`; `{tenantId, documentRef}`. Equivale a `IVAVTA` (vista materializada en el cierre).

**`vatLedgerLines`** — tabla de campos.

Campos de `vatLedgerLines` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `ledgerId` | ObjectId | Sí | — | `vatLedgers` (M06) |
| `documentRef` | [VERIFICAR] | Sí | Antes `documentId`; nombre de T05 | polimórfica: comprobante de M05/M07/M11/M18 o `gatewayDocuments` (M06) |
| `date` | date | [VERIFICAR] | — | — |
| `arcaCbteType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pointOfSale` | [VERIFICAR] | [VERIFICAR] | — | — |
| `number` | int | [VERIFICAR] | — | — |
| `counterpartyDocType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `counterpartyDocNumber` | int | [VERIFICAR] | — | — |
| `counterpartyName` | string | [VERIFICAR] | — | — |
| `vatConditionCode` | string | [VERIFICAR] | — | — |
| `sign` | [VERIFICAR] | [VERIFICAR] | — | — |
| `untaxed` | [VERIFICAR] | [VERIFICAR] | — | — |
| `exempt` | [VERIFICAR] | [VERIFICAR] | `taxedByRate[]{rate, arcaVatId, base, vat}`, `perceptions[]{taxDefinitionId, amount}` | — |
| `otherTaxes[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `total` | decimal | [VERIFICAR] | — | — |
| `activityCode` | string | [VERIFICAR] | — | — |
| `serviceId` | ObjectId | [VERIFICAR] | — | `tenantServices` (M02) |
| `branchId` | ObjectId | [VERIFICAR] | — | `branches` (T04) |
| `installmentFinanced` | [VERIFICAR] | [VERIFICAR] | — | — |
| `lqsp` | [VERIFICAR] | [VERIFICAR] | — | — |

### 7.28 `arcaReceivedImports` y `vatReconciliations` (tenant) — Mis Comprobantes

`arcaReceivedImports`: `legalEntityId` (DEC-064), `kind` (`issued`, `received`), `period`, `format` (`csv`, `xlsxLegacy`), `storedFileId` (antes ~~`fileAssetId`~~), `rows[]` `{ date, arcaCbteType, pointOfSale, numberFrom, numberTo, docType, docNumber, name, exchangeRate, currency, net, untaxed, exempt, vat, total }`, `errors[]`.

Campos de `arcaReceivedImports` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |
| `kind` | enum | Sí | `issued`, `received` | — |
| `period` | string | Sí | — | — |
| `format` | enum | [VERIFICAR] | `csv`, `xlsxLegacy` | — |
| `storedFileId` | ObjectId | Sí | Antes ~~`fileAssetId`~~ | `storedFiles` (T01) |
| `rows[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `fileHash` | string | Sí | Hash del archivo; único con `legalEntityId`, `kind`, `period` (T05). | — |

`vatReconciliations`: `importId`, `ledgerId`, `tolerance`, `results[]` `{ kind: missingInCoopApps|missingInArca|amountDiff, documentRef, field, goodAppsValue, arcaValue }`, `status` (`open`, `reviewed`, `closed`).

**`vatReconciliations`** — tabla de campos.

Campos de `vatReconciliations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `importId` | ObjectId | Sí | — | `arcaReceivedImports` (M06) |
| `ledgerId` | ObjectId | Sí | — | `vatLedgers` (M06) |
| `tolerance` | [VERIFICAR] | [VERIFICAR] | — | — |
| `results[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `open`, `reviewed`, `closed` | — |

### 7.29 `informationRegimes` (plataforma) y `regimeFilings` (tenant)

`informationRegimes`: `code` (`LID-RG4597`, `RG3685`, `RG1361`, `RG3349`, `RG3571`, `RG46-2019`, `RG5746-2025`, `CIR70-2021-ERSEP`, `SICORE`, `SIRE-F2004`, `SIRE-F2005`, `SIRCAR`, `ARBA`, `A122R`, `SANTAFE`, `LAPAMPA`, `RIONEGRO`, `DGR-CBA`, `SILARPIB`, `MUNICIPAL`, `FEDECOBA`, `FECESCOR`, `RG2177`), `organism`, `formatVersion`, `fileNamePattern`, `encoding`, `periodicity`, `fileLayoutId` (antes `layoutRef`; nombre de T05), `validFrom/validTo`, `source`.

Campos de `informationRegimes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | `LID-RG4597`, `RG3685`, `RG1361`, `RG3349`, `RG3571`, `RG46-2019`, `RG5746-2025`, `CIR70-2021-ERSEP`, `SICORE`, `SIRE-F2004`, `SIRE-F2005`, `SIRCAR`, `ARBA`, `A122R`, `SANTAFE`, `LAPAMPA`, `RIONEGRO`, `DGR-CBA`, `SILARPIB`, `MUNICIPAL`, `FEDECOBA`, `FECESCOR`, `RG2177` | — |
| `organism` | [VERIFICAR] | [VERIFICAR] | — | — |
| `formatVersion` | int | Sí | — | — |
| `fileNamePattern` | [VERIFICAR] | [VERIFICAR] | — | — |
| `encoding` | [VERIFICAR] | [VERIFICAR] | — | — |
| `periodicity` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fileLayoutId` | ObjectId | Sí | Antes `layoutRef`; nombre de T05 | `fileLayouts` (T06) |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |
| `source` | [VERIFICAR] | [VERIFICAR] | — | — |

`regimeFilings`: `legalEntityId` (DEC-064), `regimeCode`, `formatVersion`, `period`, `jurisdiction`, `originalFilingId` (rectificativas), `rectificationNumber`, `universe` (criterio y conteos), `files[]` `{ storedFileId (antes ~~`assetId`~~), name, hash, lines }`, `validation{ ok, errors[] }`, `controlTotals`, `status` (§8.7), `submittedAt`, `submittedBy`, `acknowledgment{ number, storedFileId (antes ~~`fileAssetId`~~), receivedAt }`, `result{ accepted, rejectionReasons[] }`. Índice `{tenantId, legalEntityId, regimeCode, period, rectificationNumber}` único (DEC-064; antes sin entidad).

**`regimeFilings`** — tabla de campos.

Campos de `regimeFilings` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |
| `regimeCode` | string | Sí | — | — |
| `formatVersion` | int | [VERIFICAR] | — | — |
| `period` | string | Sí | — | — |
| `jurisdiction` | [VERIFICAR] | [VERIFICAR] | — | — |
| `originalFilingId` | ObjectId | [VERIFICAR] | Rectificativas | `regimeFilings` (M06) |
| `rectificationNumber` | int | Sí | — | — |
| `universe` | [VERIFICAR] | [VERIFICAR] | Criterio y conteos | — |
| `files[]` | array [VERIFICAR] | [VERIFICAR] | `{ storedFileId (antes ~~`assetId`~~), name, hash, lines }`, `validation{ ok, errors[] }` | — |
| `controlTotals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | §8.7 | — |
| `submittedAt` | datetime | [VERIFICAR] | — | — |
| `submittedBy` | [VERIFICAR] | [VERIFICAR] | `acknowledgment{ number, storedFileId (antes ~~`fileAssetId`~~), receivedAt }`, `result{ accepted, rejectionReasons[] }` | `memberships` (T02) |

> **Alineación con T05 (05-11-2026):** T05 usa `storedFileIds[]`; la ficha lo modela como `files[].storedFileId` (`storedFiles`, T01).

### 7.30 `thirdPartyAgreements` (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `beneficiary` | object | Sí | `{ name, cuit, organismType: municipio\|provincia\|hospital\|federacion\|otro }` (ProCoop `TERCEROS`) |
| `basis` | object | Sí | Ordenanza, decreto o convenio (norma, número, URL/archivo) |
| `concepts[]` | array | Sí | `{ taxDefinitionId, label, calcBase: fixed\|pctOfNet\|perConsumption\|imported, value, serviceIds[], voucherTypeIds[], display }` |
| `collectionFee` | object | No | Comisión de cobranza (pct o fijo) y tratamiento fiscal |
| `partialPaymentPolicy` | enum | Sí | `prorata`, `thirdPartyFirst`, `ownFirst` (PA-FIS-05) |
| `remittance` | object | Sí | `{ periodicity, dayOfMonth, format, recipientEmails[], treasuryAccountId (M14 `treasuryAccounts`; T05 §7.2 — antes ~~`bankAccountRef`~~) }` |
| `liabilityLedgerAccountId` | ObjectId | Sí | Cuenta de pasivo (M15) Antes `liabilityAccountId` (nombre de T05). Referencia: `ledgerAccounts` (M15). |
| `moraPolicy` | object | Sí | Saldo de terceros en mora (RF-FIS-164, RN-FIS-127; HUECO-TAS-02): `{ includeInEligibleBalance: bool (default false), surcharge: null \| { kind: fixedPct\|dailyPct\|index\|fixedAmount, value, indexRef, beneficiary: thirdParty\|cooperative, basis }, allowServiceCut: bool (default false), cutNormativeRef: null \| { norm, number, validationStatus: pending\|validated } }`. `allowServiceCut = true` solo autoriza a M08 a considerar esa deuda para suspensión o corte del servicio principal si además `cutNormativeRef.validationStatus = validated` (RN-FIS-128; RN-MOR-141 de M08); sin ambas, M08 aplica `thirdPartyDebtNoCut`. El contrato con perfil "convenio de terceros" del socio es accesorio y propio (DEC-083). |
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica que recauda por cuenta del tercero (DEC-064) |
| `validFrom` / `validTo` | date | Sí / No | Vigencia |
| `status` | enum | Sí | `draft`, `active`, `suspended`, `expired` |
| `code` | string | Sí | Código del convenio (único en T05). |

### 7.31 `thirdPartyCharges` y `thirdPartyRemittances` (tenant)

`thirdPartyCharges` (equivale a `FACTURAS_TERCEROS`): `agreementId`, `conceptIndex`, `invoiceId` (antes `documentId`; nombre de T05), `accountId`, `period`, `amount`, `collectedAmount`, `collections[]{ paymentId, amount, date }`, `status` (`billed`, `partiallyCollected`, `collected`, `cancelled`), `remittanceId`. Índices `{tenantId, agreementId, period}`, `{tenantId, invoiceId}`.

Campos de `thirdPartyCharges` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agreementId` | ObjectId | Sí | — | `thirdPartyAgreements` (M06) |
| `conceptIndex` | [VERIFICAR] | Sí | — | — |
| `invoiceId` | ObjectId | Sí | Antes `documentId`; nombre de T05 | `invoices` (M05) |
| `accountId` | ObjectId | [VERIFICAR] | — | `accounts` (M01) |
| `period` | string | [VERIFICAR] | — | — |
| `amount` | decimal | [VERIFICAR] | — | — |
| `collectedAmount` | decimal | [VERIFICAR] | — | — |
| `status` | enum | Sí | `billed`, `partiallyCollected`, `collected`, `cancelled` | — |
| `remittanceId` | ObjectId | [VERIFICAR] | — | `thirdPartyRemittances` (M06) |

`thirdPartyRemittances`: `agreementId`, `periodFrom/To`, `billedTotal`, `collectedTotal`, `fee`, `netToRemit`, `reportStoredFileId` (T05 §7.2; antes ~~`reportAssetId`~~), `paymentOrderId` (M14), `status` (§8.8), `reconciledAt`.

**`thirdPartyRemittances`** — tabla de campos.

Campos de `thirdPartyRemittances` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agreementId` | ObjectId | Sí | — | `thirdPartyAgreements` (M06) |
| `periodFrom` | date | Sí | — | — |
| `periodTo` | date | [VERIFICAR] | — | — |
| `billedTotal` | decimal | [VERIFICAR] | — | — |
| `collectedTotal` | decimal | [VERIFICAR] | — | — |
| `fee` | [VERIFICAR] | [VERIFICAR] | — | — |
| `netToRemit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reportStoredFileId` | ObjectId | [VERIFICAR] | T05 §7.2; antes ~~`reportAssetId`~~ | `storedFiles` (T01) |
| `paymentOrderId` | ObjectId | Sí | M14 | `paymentOrders` (M12; pago por M14) |
| `status` | enum | Sí | §8.8 | — |
| `reconciledAt` | datetime | [VERIFICAR] | — | — |

### 7.32 `regulatoryReports` (plataforma) y `regulatoryReportRuns`, `regulatoryConceptMaps` (tenant)

`regulatoryReports`: `code` (`ERSEP-CIR70-2021`, `ERSEP-CONSUMOS`, `ERSEP-PERDIDAS`, `ERSEP-SERVICIOS`, `ERSEP-DNU311-2020`, `ERSEP-TS-166-16`, `ERSEP-TS-296-16`, `ERSEP-TS-617`, `ENARGAS-SARI`, `ENARGAS-FCUDS`, `ENARGAS-MOROSIDAD-XLS`, `ENARGAS-FACTURAS-XLS`, `ENACOM-*`, `SE-ENERGIA`, `SE-GENERADORES`, `FECESCOR-RENDICION`), `organism`, `services[]`, `files[]` (ej. FaC, Sub, FaD, CoC, Usr, FaV, SICC), `formatVersion`, `periodicity`, `deadlineRule`, `masterTablesRef`, `source`, `validFrom/validTo`.

Campos de `regulatoryReports` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | `ERSEP-CIR70-2021`, `ERSEP-CONSUMOS`, `ERSEP-PERDIDAS`, `ERSEP-SERVICIOS`, `ERSEP-DNU311-2020`, `ERSEP-TS-166-16`, `ERSEP-TS-296-16`, `ERSEP-TS-617`, `ENARGAS-SARI`, `ENARGAS-FCUDS`, `ENARGAS-MOROSIDAD-XLS`, `ENARGAS-FACTURAS-XLS`, `ENACOM-*`, `SE-ENERGIA`, `SE-GENERADORES`, `FECESCOR-RENDICION` | — |
| `organism` | [VERIFICAR] | [VERIFICAR] | — | — |
| `services[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `files[]` | array [VERIFICAR] | [VERIFICAR] | Ej. FaC, Sub, FaD, CoC, Usr, FaV, SICC | — |
| `formatVersion` | int | [VERIFICAR] | — | — |
| `periodicity` | [VERIFICAR] | [VERIFICAR] | — | — |
| `deadlineRule` | [VERIFICAR] | [VERIFICAR] | — | — |
| `masterTablesRef` | [VERIFICAR] | [VERIFICAR] | — | — |
| `source` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

`regulatoryConceptMaps`: `reportCode`, `serviceKind` (`fixedPhone`, `mobile`, `internet`, `tv`, `gas`, `electricity`), `mainServices[]`, `services[]`, `products[]`, `taxes[]`, `categoryMap[]{ categoryId, regulatorCode }` (ej. `COD_ENGAS`), `entityCodes{ entity (V2 2257), contract (V2 2258), commissionMode (V2 2259), commissionValue (V2 2260), perceptionConcept (V2 2256), excessConsumptionCode (V2 2728), subdistributor (V2 2254), companyCode (V2 737) }`, `useMeterRegistration` (V2 3174), `validFrom/validTo`. Equivale a `ENACOM_Config.txt`, `frmEnargasConceptos`.

**`regulatoryConceptMaps`** — tabla de campos.

Campos de `regulatoryConceptMaps` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `reportCode` | string | Sí | — | — |
| `serviceKind` | enum | Sí | `fixedPhone`, `mobile`, `internet`, `tv`, `gas`, `electricity` | — |
| `mainServices[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `services[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `products[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `taxes[]` | array [VERIFICAR] | [VERIFICAR] | `categoryMap[]{ categoryId, regulatorCode }` (ej. `COD_ENGAS`), `entityCodes{ entity (V2 2257), contract (V2 2258), commissionMode (V2 2259), commissionValue (V2 2260), perceptionConcept (V2 2256), excessConsumptionCode (V2 2728), subdistributor (V2 2254), companyCode (V2 737) }` | — |
| `useMeterRegistration` | bool | [VERIFICAR] | V2 3174 | — |
| `validFrom` | date | Sí | — | — |
| `validTo` | date | [VERIFICAR] | — | — |

`regulatoryReportRuns`: `reportCode`, `period`, `files[]`, `validation`, `status` (igual a §8.7), `acknowledgment`.

**`regulatoryReportRuns`** — tabla de campos.

Campos de `regulatoryReportRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `reportCode` | string | Sí | — | — |
| `period` | string | Sí | — | — |
| `files[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `validation` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `draft`, `generated`, `validated`, `validationFailed`, `approved`, `submitted`, `accepted`, `rejected`, `rectified` (los de `regimeFilings`, §8.7; inicial `draft`, §8.12; PA-FIS-22). Antes: «Igual a §8.7». | — |
| `acknowledgment` | [VERIFICAR] | [VERIFICAR] | — | — |
| `rectificationNo` | int | Sí | Número de rectificación; único con `reportCode` y `period` (T05). | — |

### 7.33 `publicAdminSelections` (tenant)

Campos: `selectionKey` (`period` o `issueDate`), `period`, `issueDate`, `items[]` `{ documentId, serviceId, consumption, meterId, supplyAddress }`, `filters`, `status` (`active`, `replaced`), `replacedById`. Índice `{tenantId, selectionKey, period, issueDate, status}`. Origen `COMPROBANTES_ADM` (`ID_FAC`, `COD_SER`, `PERIODO`, `FECHA`, `USU_REG`).

Campos de `publicAdminSelections` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `selectionKey` | string | Sí | `period` o `issueDate` | — |
| `period` | string | Sí | — | — |
| `issueDate` | date | Sí | — | — |
| `items[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `filters` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `active`, `replaced` | — |
| `replacedById` | ObjectId | [VERIFICAR] | — | `publicAdminSelections` (M06) |

### 7.34 `gatewayDocuments` (tenant) — modo pasarela

Campos: `externalSystemId`, `sourceFileName` o `apiClientId`, `arcaCbteType`, `pointOfSale`, `number`, `issueDate`, `total`, `docType`, `docNumber`, `name`, `concept`, `serviceFrom/To`, `currency`, `exchangeRate`, `untaxed`, `net`, `exempt`, `vat`, `taxesTotal`, `paymentDueDate`, `vat[]`, `taxes[]`, `cancelled` (S/N), `related[]` `{ type, pos, number, cuit, date }`, `fiscalAuthorizationId` (antes `authorizationId`; nombre de T05), `exportStatus` (`pending`, `exportedOk`, `exportedError`). Índice `{tenantId, arcaCbteType, pointOfSale, number}` único. Origen `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP`.

Campos de `gatewayDocuments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `externalSystemId` | ObjectId | [VERIFICAR] | — | `apiClients` (T02), asumido en PA-FIS-20 (DEC-072); antes [VERIFICAR] sistema externo (posible `integrationConnections`, T06) |
| `sourceFileName` | string | [VERIFICAR] | — | — |
| `apiClientId` | ObjectId | [VERIFICAR] | — | `apiClients` (T02) |
| `arcaCbteType` | [VERIFICAR] | Sí | — | — |
| `pointOfSale` | [VERIFICAR] | Sí | — | — |
| `number` | int | Sí | — | — |
| `issueDate` | date | [VERIFICAR] | — | — |
| `total` | decimal | [VERIFICAR] | — | — |
| `docType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `docNumber` | int | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `concept` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceFrom` | date | [VERIFICAR] | — | — |
| `serviceTo` | date | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `exchangeRate` | decimal | [VERIFICAR] | — | — |
| `untaxed` | [VERIFICAR] | [VERIFICAR] | — | — |
| `net` | [VERIFICAR] | [VERIFICAR] | — | — |
| `exempt` | [VERIFICAR] | [VERIFICAR] | — | — |
| `vat` | [VERIFICAR] | [VERIFICAR] | — | — |
| `taxesTotal` | decimal | [VERIFICAR] | — | — |
| `paymentDueDate` | date | [VERIFICAR] | — | — |
| `vat[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `taxes[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `cancelled` | [VERIFICAR] | [VERIFICAR] | S/N | — |
| `related[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `fiscalAuthorizationId` | ObjectId | Sí | Antes `authorizationId`; nombre de T05 | `fiscalAuthorizations` (M06) |
| `exportStatus` | enum | [VERIFICAR] | `pending`, `exportedOk`, `exportedError` | — |

### 7.35 `fiscalDeadlines` (tenant)

Campos: `regimeCode`/`reportCode`, `period`, `dueDate`, `source` (tabla normativa de vencimientos y terminación de CUIT), `status` (`upcoming`, `due`, `filed`, `overdue`), `filingId`. Índice `{tenantId, dueDate}`.

Campos de `fiscalDeadlines` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `regimeCode` | string | Sí | — | — |
| `period` | string | Sí | — | — |
| `dueDate` | date | [VERIFICAR] | — | — |
| `source` | [VERIFICAR] | [VERIFICAR] | Tabla normativa de vencimientos y terminación de CUIT | — |
| `status` | enum | Sí | `upcoming`, `due`, `filed`, `overdue` | — |
| `filingId` | ObjectId | [VERIFICAR] | — | `regimeFilings` (M06) |

### 7.36 Mapeo a tablas ProCoop (CAT §5 completo)

| Tabla ProCoop | Destino CoopApps | Observación |
|---|---|---|
| `ACTAFIP` | `normativeTables` `arcaActivities` + asignación en M02 (servicio) | Catálogo ARCA sincronizado |
| `ALI_IBR` | `grossIncomeSettings.rates` | `RENDIR` → `collectInInvoicing` |
| `ALI_IBR_CF` | `grossIncomeSettings.matrix` | — |
| `ALI_IBR_COMP` | `grossIncomeSettings.byDocument` | `CALCULO` → `calculation` |
| `ALI_IVA` | `vatRates` | Cuentas a M15 |
| `ALI_IVA_CF` | `vatRateMatrix` | — |
| `CAT_RETG` | `withholdingScales` | — |
| `CESPAFIP` | `caeaPeriods` (`CAEA = 1`) y `cespAuthorizations` (`CAEA = 0`) | Separados (RN-FIS-057) |
| `COMPPOS` | `pointsOfSale.documentModes` (flags; antes ~~`fiscalPointsOfSale`~~) + M05 `numberSequences` (`ULT_NUM`; CTR-DAT-16 — antes ~~`documentSequences`~~) | Numeración en M05 |
| `CVPIIBB` | `provincialValidationCodes` | — |
| `ELECTRONICA_FC` / `_IVA` / `_TRIB` / `_RELCOMP` | `gatewayDocuments` | Modo pasarela |
| `EMPAFIP` | `taxpayerRegistries` (`arcaOfflineCondition`) + entries | — |
| `ENGAS_CANTMESES` | Tabla normativa regulatoria de M04 (bloques) referenciada por `regulatoryConceptMaps` | Cálculo en M04 |
| `IIBB_LUA` | `taxpayerRegistries` (`iibbRates`) + entries | — |
| `IVAVTA` | `vatLedgerLines` (snapshot en cierre) | — |
| `PROD_SER_RET` | `withholdingAssignments` (`product`) | — |
| `PTOVENTA` | `pointsOfSale` (CTR-DAT-17; `legalEntityId` desde `COD_EMP`, DEC-064) | `PAUSAR` → `status = paused` |
| `RETE_TIPO` | `withholdingTypes` | 35 columnas mapeadas |
| `RETE_TIPO_BASE` | `withholdingTypes.baseTypeCode` (catálogo) | — |
| `RETS_TIPO` | `withholdingSufferedTypes` | — |
| `RET_COM` | `withholdingsApplied` | — |
| `SITIBR` | `grossIncomeSettings.conditions` | — |
| `SITIVA` | `vatConditionSettings` | `AFIP_SIT` remapeado (CTR-FIS-02) |
| Otras de DFA: `IMPUESTO` | `taxDefinitions` | `ORIGEN` → `level`; Id ARCA por mapeo; `nature` por la regla RN-FIS-126 (organismo de `ORIGEN` + convenio; HUECO-TAS-03); sin resolver → `pendingClassification` |
| `CON_TASAS` | **No es de M06:** `purchaseConcepts` de M12 (T05 COL-CMP-05; T07 §19.2). Reemplaza el destino anterior "`taxDefinitions` (o `thirdPartyAgreements.concepts[]` si RN-FIS-126 lo clasifica como concepto de terceros)" | En ProCoop la tabla solo se administra desde Compras ("Administración de conceptos asociados a tasas": descripción, tasa y columna del libro de compras) y ninguna regla de facturación la lee (HUECO-TAS-03). Solo si el perfilado de T07 encuentra una fila usada en facturación, esa fila se clasifica con RN-FIS-126 (RN-MIG-051) y se informa. Transformación anterior: "Clasificación RN-FIS-126 (HUECO-TAS-03); coherente con la conversión de la tasa hospital de `CLASESER` en M02 §19.1" |
| `FACTURAS_TERCEROS`, `TERCEROS` | `thirdPartyCharges`, `thirdPartyAgreements` | — |
| `COMPROBANTES_ADM` | `publicAdminSelections` | — |
| `IMPUESTOS_X_CAT` | Vista guardada del reporte (T10) | RF-FIS-142 |
| `PROVEED_RET`, `CON_COM_RET` | `withholdingAssignments` | — |
| `IVACOM`, `FPALIC_IVA` | Propiedad de M12; FIS los lee | Libro compras |
| `FACT_EPEC` | M12 `supplierInvoices.wholesaleSupply` (RF-CMP-149; CTR-DAT-75) y balance `supplyBalances` (M12) que usa el informe de pérdidas de M03 | Referencia (FIC 9.3); no se crea `energyPurchaseBills` |
| `RELACION_COMP` | M05 (relaciones) + `fiscalAuthorizations.payload.associated` | — |

### 7.37 `conceptFiscalCases` (tenant) — casos fiscales por concepto

Tratamiento fiscal explícito de conceptos que no se resuelven solo con la alícuota del ítem (RF-FIS-161, RF-FIS-162; HUECO-CAP-04, HUECO-CEM-01). Es también donde vive la **marca de concepto accesorio de la LQSP** (`publicServiceAccessory`, DEC-093; PA-FIS-23) que usa M05 para separar los comprobantes por clase.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `conceptId` | ObjectId → M02 | Sí | Concepto facturable (ej. "Aporte de capital", "Derecho de sepultura — adquisición", "Mantenimiento de sepultura", "Inhumación") |
| `caseCode` | enum | Sí | `capitalContribution`, `burialRightAcquisition`, `burialRightMaintenance`, `burialAct`, `guaranteeDeposit` (RF-FIS-165), `subsidyFundContribution`, `publicServiceAccessoryOnly` (el caso solo registra la marca de accesorio de la LQSP y no cambia la clase ni la alícuota, que siguen la cascada de RF-FIS-080; DEC-093), `other` |
| `fiscalClass` | enum | Sí (salvo `publicServiceAccessoryOnly`) | `gravado`, `exento`, `noGravado`, `noAlcanzado`, `capitalContribution`, `outsideTaxBase` (depósito en garantía: fuera de la base imponible y no gravado; RN-FIS-128) |
| `vatRateId` | ObjectId | Cond. | Obligatorio si `fiscalClass = gravado` |
| `wsfeBucket` | enum | Sí (salvo `publicServiceAccessoryOnly`) | `ImpNeto`, `ImpOpEx`, `ImpTotConc`, `outsideFiscalDocument` |
| `publicServiceAccessory` | bool | Sí | Concepto accesorio admitido dentro de la liquidación de servicios públicos (tasas, contribuciones y cargos regulados que acompañan al servicio público). Default `false`: sin marca, el concepto va a la factura común y nunca a la LQSP (DEC-093; RN-FIS-122; RN-FAC-040 de M05). Internet, telefonía, TV, sepelio y servicios sociales no se marcan (recomendación de PA-FIS-23). Vale para cualquier `caseCode` (por ejemplo, un aporte de capital puede declararse accesorio si el contador lo admite). |
| `accessoryApproval` | object | Cond. | Obligatorio si `publicServiceAccessory = true`: `{ basis (norma o dictamen del contador), approvedBy, approvedAt, evidenceId }`; sin aprobación la marca no rige (PA-FIS-23). Referencia: `approvedBy` → `memberships` (T02); `evidenceId` → `documents` (T11). |
| `excludedFromBases[]` | array | Sí | Bases de las que se excluye: `vatPerception`, `grossIncome`, `municipalOnNet`, `serviceNet` |
| `fiscalMoment` | enum | Cond. | Para `burialRightAcquisition`: `perInstallment` (default, PRM-FIS-123) o `atAcquisition` |
| `invoiceSection` / `legendKey` | string / dictKey | No | Sección y leyenda en el comprobante |
| `basis` | object | Sí | Fundamento (norma, dictamen del contador, fecha) |
| `normativeVersionId` | ObjectId | No | Versión de tabla normativa adoptada Referencia: `normativeTableVersions` (M06). |
| `validFrom` / `validTo` | date | Sí / No | Vigencia |
| `status` | enum | Sí | `draft`, `active`, `superseded` |

Índices: `{tenantId, conceptId, validFrom}` único. Sin equivalente en ProCoop.

### 7.38 `fiscalClasses` (tenant) — clases fiscales (PA-FIS-21)

Colección declarada el 05-11-2026 (PA-FIS-21): catálogo de clases fiscales referenciado por `billableConcepts.fiscalClassId` de M02. El `code` toma los valores de `conceptFiscalCases.fiscalClass` (§7.37). Sin equivalente directo en ProCoop.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | `gravado`, `exento`, `noGravado`, `noAlcanzado`, `capitalContribution`, `outsideTaxBase`. | — |
| `name` | string | Sí | Nombre visible. | — |
| `status` | enum | Sí | `active`, `inactive`. | — |
| `validFrom` / `validTo` | date | Sí / No | Vigencia. | — |

Índice `{tenantId, code, validFrom}` único.

### 7.39 `ownTaxObligations` (tenant) — obligaciones y exenciones propias del contribuyente (DEC-095)

Colección nueva (10-11-2026, DEC-095; RF-FIS-169, RN-FIS-133): posición de la propia cooperativa como contribuyente. No equivale a `taxExemptions` (§7.21: exclusiones y certificados de terceros) ni a `taxAgentRegistrations` (§7.6: condiciones de agente); las obligaciones a pagar que genera se registran en `taxObligations` (§7.26) con `ownTaxObligationId`. Sin filas precargadas: cada registro se da de alta cuando el contador lo confirma (PA-FIS-25). Sin equivalente en ProCoop.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad jurídica contribuyente (DEC-064). | `legalEntities` (T04) |
| `code` / `name` | string | Sí | Identificación visible del registro. | — |
| `tax` | object | Sí | Impuesto o contribución: `{ label, taxDefinitionId }`; `taxDefinitionId` opcional, solo si existe una definición con `nature = ownTax`. | `taxDefinitionId` → `taxDefinitions` (M06) |
| `jurisdiction` | object | Sí | `{ level: national/provincial/municipal, code }` (nación, provincia o municipio). | — |
| `activityScope` | object | Sí | Actividad o sección alcanzada: `{ arcaActivityCodes[], provincialActivityCodes[], serviceIds[], section }`; al menos uno no vacío o `section = wholeEntity`. | `arcaActivityCodes[]` → `normativeTables` (`arcaActivities`, M06); `serviceIds[]` → `tenantServices` (M02) |
| `kind` | enum | Sí | `exemption`, `partialExemption`, `contribution`, `specialRegime`, `otherObligation`. | — |
| `effect` | object | Cond. | Para `partialExemption`: `{ pct }`; para `contribution`: `{ rate, minimumAmount }` (Decimal128). | — |
| `capitalBase` | object | Cond. | Para contribuciones sobre el capital: `{ source: none/m17CapitalBase, component: subscribed/paid/pendingToPay/reserved/refundsApprovedUnpaid, capitalItemIds[], requireFinal }`; la base la provee M17 por entidad jurídica y fecha con `ins.capitalBase.get({ legalEntityId, asOf })` y EVT-INS-22 (RF-INS-109; RN-FIS-133). M17 no abre la base por servicio ni por evento, por lo que se quitan `serviceIds[]` y `capitalEventTypes[]` y se resuelve el [VERIFICAR] anterior (10-11-2026). *Reemplazado: "`{ source: none/perService/perEvent, serviceIds[], capitalEventTypes[] }`" con referencia "`capitalEventTypes[]` → catálogo de eventos de capital de M17 [VERIFICAR]".* El componente que corresponde a cada contribución lo confirma el contador (PA-FIS-25). | `capitalItemIds[]` → `capitalItems` (M17) |
| `basis` | object | Sí | Fundamento normativo: `{ norm, article, issuer, url, consultedAt, accountantOpinion }`. | — |
| `evidenceIds[]` | ObjectId[] | Sí (para activar) | Adjuntos de respaldo (norma, dictamen, constancia de exención). | `documents` (T11) |
| `deadlineRule` | object | No | Periodicidad y regla de vencimiento para `fiscalDeadlines` (RF-FIS-007). | — |
| `validFrom` / `validTo` | date | Sí / No | Vigencia. | — |
| `status` | enum | Sí | `draft`, `active`, `expired`, `revoked` (§8.13). | — |
| `approvedBy` / `approvedAt` | ObjectId / datetime | Cond. | Obligatorios para `active` (aprobación con MFA). | `approvedBy` → `memberships` (T02) |

Índices: `{tenantId, legalEntityId, kind, "jurisdiction.code", validFrom}`; `{tenantId, status, validTo}`. La no superposición de registros activos del mismo tipo y alcance se valida al activar (RN-FIS-133).

## 8. Estados y transiciones

### 8.1 `fiscalAuthorizations.status`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `pending` | Sistema (evento `fac.invoice.issued`, `fac.creditNote.issued` o `fac.debitNote.issued`) | Comprobante fiscal con modalidad CAE/CAEA | Se calcula `payload` y `idempotencyKey` | — |
| `pending` | `detained` | Sistema | Prevalidación falla (sin CUIT, alícuota sin mapeo, anterior pendiente, hueco, credencial vencida, punto pausado) | Bandeja de excepciones con motivo; evento `fis.authorization.detained` | Al corregir → `pending` |
| `pending` | `sending` | Worker `fis:autorizar-cola` | Lock del par obtenido; TA vigente | `arcaSubmissions` en `sending` | Timeout → `uncertain` |
| `sending` | `authorized` | Sistema | Resultado `A` sin observaciones | CAE, vencimiento, QR; evento `fis.invoice.authorized` | No se revierte; se corrige con NC (M05) |
| `sending` | `authorizedWithObservations` | Sistema | Resultado `A` con observaciones | Igual que autorizado + observaciones visibles | No reemitir |
| `sending` | `rejected` | Sistema | Resultado `R` | Errores y `rejectionKind` (`dataError`, `sequenceOnly`); evento `fis.authorization.rejected`; M05 devuelve el comprobante a borrador o a la cola y libera el número (DEC-107; RN-FAC-164) | Terminal para ese número: la solicitud queda como evidencia y, al reemitirse el comprobante con otro número (`issueAttempt` + 1), M05 publica `fac.invoice.issued` y FIS crea una autorización nueva en `pending`. *Reemplazado (10-11-2026, DEC-107): "Corrección del dato → `pending` (mismo número)".* |
| `pending` / `detained` | `cancelled` | Sistema (evento `fac.invoice.returnedToDraft`, EVT-FAC-22) | Un anterior del mismo punto y tipo fue rechazado y el comprobante, que no fue enviado, vuelve a la cola de M05 para renumerarse (DEC-107) | `cancelReason = numberReleased`; ningún envío a ARCA con ese número | — (la reemisión crea una autorización nueva) |
| `sending` | `uncertain` | Sistema | Timeout, error de transporte o respuesta ilegible | Job `fis:conciliar-incierto` inmediato | → `authorized` (si ARCA lo tiene y el total coincide) o `pending` (si no existe) |
| `rejected` (10016) | `toReconcile` | Sistema | Número ya autorizado en ARCA o fecha fuera de secuencia | Consulta `FECompConsultar` | → `authorized` o `detained` |
| `authorized` | `toReconcile` | Job de inconsistencias | CAE o total distinto en ARCA | Propuesta de reparación | Aprobación → `authorized` (CAE de ARCA); rechazo → bandeja |
| `pending` | `cancelled` | M05 | El comprobante no llegó a enviarse y M05 anula la emisión (solo si nunca hubo envío) | Libera el número según regla M05 (RN-FAC-164, DEC-107) | — |

Regla: un comprobante solo vuelve de `uncertain` a `pending` si `FECompConsultar` confirma que ARCA no lo tiene (AGR-016, ESC-04).

Regla (DEC-107): un comprobante `rejected` no se reenvía con el mismo número; el número vuelve a M05, que lo reasigna en orden (RN-FAC-164). Los comprobantes `authorized` y `authorizedWithObservations` nunca cambian de número. Un `uncertain` que ARCA no tiene no es un rechazo: conserva su número porque sigue siendo el próximo del par.

### 8.2 `arcaCredentials.status`

`pendingCertificate` → `testing` (certificado cargado; prueba en homologación) → `active` (prueba OK y relevamiento aprobado) → `expiring` (≤ 30 días) → `expired` (vencido; cola detenida) ; `active`/`expiring` → `replaced` (nuevo certificado activo, sin interrupción); cualquier estado → `revoked` (acción del responsable fiscal con MFA). Reversión: un `revoked` no vuelve; se carga otro.

### 8.3 `caeaPeriods.status`

`requested` → `active` (CAEA obtenido) → `reporting` (fin de quincena) → `reported` (todos los comprobantes y puntos sin movimiento informados); `reporting` → `expiredWithPending` (pasó el plazo con pendientes: alerta crítica). Reversión: no aplica; se informa tarde con evidencia.

### 8.4 `normativeTableVersions.status` y `normativeAdoptions.status`

Versión: `draft` → `inReview` → `published` → `retired` (reemplazada por otra). Solo `published` puede adoptarse. Adopción: `proposed` (el tenant o un job la prepara) → `approved` (responsable fiscal, con simulación opcional) → `superseded` (nueva adopción); `proposed` → `rejected`.

### 8.5 `taxpayerRegistries.status`

`importing` → `validated` (errores listados) → `active` (aprobado; reemplaza al anterior para su vigencia) → `superseded`; `importing` → `failed`.

### 8.6 `withholdingsApplied.status`

`calculated` (OP en preparación) → `confirmed` (OP aprobada; certificado numerado) → `reported` (incluida en declaración presentada) → `paid` (obligación pagada) ; `calculated`/`confirmed` → `cancelled` (OP anulada; importes conservados) ; `reported` → `rectified` (anulada después de presentada; requiere rectificativa).

### 8.7 `regimeFilings.status` y `regulatoryReportRuns.status`

`draft` → `generated` → `validated` (o `validationFailed` → `draft`) → `approved` (responsable fiscal) → `submitted` (acuse cargado) → `accepted` | `rejected` ; `rejected` → nueva `regimeFilings` rectificativa vinculada; `accepted` → `rectified` (si se presenta una rectificativa posterior). Un estado `submitted` exige acuse o número de transacción.

### 8.8 `thirdPartyRemittances.status`

`draft` → `calculated` → `approved` → `ordered` (OP en M14) → `paid` (movimiento confirmado) → `reconciled`; `approved`/`ordered` → `cancelled` con motivo.

### 8.9 `vatLedgers.status`

`draft` → `closed` (snapshot) → `reopened` (con motivo y autorización) → `closed`; `closed` → `rectified` (nueva versión vinculada cuando ya se presentó la declaración).

### 8.10 `thirdPartyAgreements.status`

`draft` → `active` (fundamento y aprobación) → `suspended` (no se factura; se sigue rindiendo lo cobrado) → `active`; `active` → `expired` por `validTo`.

### 8.11 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5).

**Valores declarados:** `provincialValidationCodes.status`: `active`, `expired` (confirmados en PA-FIS-21, DEC-072; antes [VERIFICAR]) (inicial `active`; vence por `validTo`). `fiscalClasses.status`: `active` → `inactive` (baja del catálogo; los conceptos que la usan conservan la referencia histórica). `regulatoryReportRuns.status` usa los valores de `regimeFilings.status` (§8.7). `fiscalProfiles.mipymeStatus` no es un campo de estado: es un objeto `{ isMipyme, category, validFrom }`, sin máquina.

**Transiciones agregadas:**

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `fiscalSurveys` | — | `draft` | Alta del relevamiento | — | — |
| `fiscalSurveys` | `draft` | `inReview` | Envío a revisión | — | — |
| `fiscalSurveys` | `inReview` | `approved` | Aprobación (`approvedBy`) | — | — |
| `fiscalSurveys` | `approved` | `superseded` | Nuevo relevamiento aprobado | — | — |
| `pointsOfSale` | — | `active` | Alta y habilitación ARCA | — | — |
| `pointsOfSale` | `active` | `paused` | Pausa (ProCoop `PAUSAR`) | — | — |
| `pointsOfSale` | `paused` | `active` | Reanudación | — | — |
| `pointsOfSale` | `active`/`paused` | `retired` | Baja del punto de venta | Sin comprobantes pendientes de autorización | — |
| `arcaSubmissions` | — | `sending` | Envío a ARCA | — | — |
| `arcaSubmissions` | `sending` | `answered`/`timeout`/`transportError` | Respuesta, vencimiento o error de transporte | — | `fis.authorization.uncertain` (EVT-FIS-04) si `timeout` |
| `cespAuthorizations` | — | `active` | Alta del CESP | — | — |
| `cespAuthorizations` | `active` | `expired` | Vence `validTo` | — | — |
| `cespAuthorizations` | `active` | `cancelled` | Anulación | — | — |
| `taxObligations` | — | `pending` | Cierre del período del régimen, o cierre de la base de capital de M17 para una contribución propia (RN-FIS-133) | — | `fis.obligation.created` (EVT-FIS-13; antes sin evento en esta tabla) |
| `taxObligations` | `pending` | `ordered` | Orden de pago en M14 | — | — |
| `taxObligations` | `ordered` | `paid` | Pago confirmado (`treasuryMovementId`) | — | — |
| `taxObligations` | `paid` | `reconciled` | Conciliación con asiento (`journalEntryId`) | — | — |
| `taxObligations` | `pending` | `cancelled` | Anulación con motivo, revocación del registro propio o recálculo (RN-FIS-133 puntos 7 y 8) | — | `fis.obligation.cancelled` (EVT-FIS-26, `cancellationStatus = final`; DEC-095, 10-11-2026; antes sin evento). *Reemplazado (10-11-2026, cierre): "`pending`/`ordered` → `cancelled` · Una `ordered` solo si M14 no ejecutó el pago"; la `ordered` pasa por `cancellationPending`.* |
| `taxObligations` | `ordered` | `cancellationPending` | Anulación con motivo, revocación del registro propio o recálculo con el pago en M14 (RN-FIS-133 punto 9) | Registra `paymentConflict` | `fis.obligation.cancelled` (EVT-FIS-26, `cancellationStatus = pendingPaymentReconciliation`): M14 anula la ejecución si no salió dinero o avisa al tesorero si está `delivered` o `sentToBank` (DEC-095, 10-11-2026) |
| `taxObligations` | `cancellationPending` | `cancelled` | `tes.paymentExecution.voided` (EVT-TES-15): ejecución anulada o pago devuelto | `paymentConflict.resolution = paymentVoided` | `fis.obligation.cancelled` (EVT-FIS-26, `cancellationStatus = final`; DEC-095, 10-11-2026) |
| `taxObligations` | `cancellationPending` | `cancelled` | `tes.paymentExecution.executed` (EVT-TES-15): el pago salió igual | `paymentConflict.resolution = paymentExecuted`; `creditBalanceAmount` = importe pagado (saldo a favor ante el organismo) | `fis.obligation.cancelled` (EVT-FIS-26, `cancellationStatus = final`, con `creditBalanceAmount`; DEC-095, 10-11-2026) |
| `vatReconciliations` | — | `open` | Importación de ARCA (API-FIS-61) | — | — |
| `vatReconciliations` | `open` | `reviewed` | Revisión de diferencias | — | — |
| `vatReconciliations` | `reviewed` | `closed` | Cierre | — | — |
| `thirdPartyCharges` | — | `billed` | Comprobante con cargo de tercero | — | — |
| `thirdPartyCharges` | `billed` | `partiallyCollected`/`collected` | Cobros (M07) | — | — |
| `thirdPartyCharges` | `partiallyCollected` | `collected` | Cobro del remanente | — | — |
| `thirdPartyCharges` | `billed`/`partiallyCollected` | `cancelled` | Anulación del comprobante | — | — |
| `publicAdminSelections` | — | `active` | Selección guardada | — | — |
| `publicAdminSelections` | `active` | `replaced` | Nueva selección de la misma clave (`replacedById`) | — | — |
| `gatewayDocuments` (`exportStatus`) | — | `pending` | Recepción del comprobante de la pasarela | — | — |
| `gatewayDocuments` (`exportStatus`) | `pending` | `exportedOk`/`exportedError` | Exportación al sistema externo | — | — |
| `gatewayDocuments` (`exportStatus`) | `exportedError` | `pending` | Reintento | — | — |
| `fiscalDeadlines` | — | `upcoming` | Generación del calendario | — | — |
| `fiscalDeadlines` | `upcoming` | `due` | Llega la fecha de vencimiento | — | — |
| `fiscalDeadlines` | `due`/`upcoming` | `filed` | Presentación (`filingId`) | — | — |
| `fiscalDeadlines` | `due` | `overdue` | Vence sin presentación | — | — |

### 8.12 Estados iniciales y transiciones completadas (residuales del 05-11-2026)

Ronda de residuales del 05-11-2026 (PA-FIS-22, DEC-072): estado de alta explícito de las máquinas de §8.2 a §8.10 y §8.11 que no lo indicaban, transición `active` → `expired` de `provincialValidationCodes` por vencimiento de `validTo`, baja de `fiscalClasses` y máquina de `regulatoryReportRuns` (los valores de `regimeFilings`, §8.7). Las transiciones de §8.2 a §8.10 no cambian.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `normativeTableVersions` | — | `draft` | Alta de una versión de tabla normativa (plataforma) | — | — |
| `normativeAdoptions` | — | `proposed` | El tenant o un job prepara la adopción | — | — |
| `arcaCredentials` | — | `pendingCertificate` | Alta de la credencial (CSR generado) | — | — |
| `caeaPeriods` | — | `requested` | Solicitud del CAEA de la quincena | — | — |
| `provincialValidationCodes` | — | `active` | Alta del CVP con vigencia (`validFrom`/`validTo`) | — | — |
| `provincialValidationCodes` | `active` | `expired` | Job diario de vigencias: vence `validTo` | `validTo` anterior a la fecha; desde entonces no se imprime en comprobantes (RF-FIS-090) | — |
| `taxpayerRegistries` | — | `importing` | Carga o descarga del padrón (JOB-FIS-08) | — | — |
| `withholdingsApplied` | — | `calculated` | Cálculo en la OP en preparación (`fis.service.calculateWithholdings`) | — | — |
| `vatLedgers` | — | `draft` | Apertura del libro del período | — | — |
| `regimeFilings` | — | `draft` | Generación de la presentación del período | — | — |
| `regulatoryReportRuns` | — | `draft` | Inicio del informe al regulador del período | — | — |
| `regulatoryReportRuns` | `draft` | `generated` | Generación de archivos | — | — |
| `regulatoryReportRuns` | `generated` | `validated` | Validación de formato superada | — | — |
| `regulatoryReportRuns` | `generated` | `validationFailed` | Validación de formato con errores | — | — |
| `regulatoryReportRuns` | `validationFailed` | `draft` | Corrección de datos | — | — |
| `regulatoryReportRuns` | `validated` | `approved` | Aprobación del responsable fiscal | — | — |
| `regulatoryReportRuns` | `approved` | `submitted` | Carga del acuse (`acknowledgment`) | Exige acuse o número de transacción | — |
| `regulatoryReportRuns` | `submitted` | `accepted` | El regulador acepta | — | — |
| `regulatoryReportRuns` | `submitted` | `rejected` | El regulador rechaza | — | — |
| `regulatoryReportRuns` | `accepted` | `rectified` | Se presenta una rectificativa posterior (`rectificationNo` + 1) | — | — |
| `thirdPartyAgreements` | — | `draft` | Alta del convenio con tercero | — | — |
| `thirdPartyRemittances` | — | `draft` | Inicio de la rendición del período | — | — |
| `fiscalClasses` | — | `active` | Alta de la clase fiscal | — | — |
| `fiscalClasses` | `active` | `inactive` | Baja del catálogo | Los conceptos que la usan conservan la referencia histórica | — |

### 8.13 `ownTaxObligations.status` (DEC-095, 10-11-2026)

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `ownTaxObligations` | — | `draft` | Alta del registro por el responsable fiscal | — | — |
| `ownTaxObligations` | `draft` | `active` | Aprobación con MFA | Fundamento, dictamen del contador, adjunto y sin superposición (RN-FIS-133) | — |
| `ownTaxObligations` | `active` | `expired` | Job diario de vigencias: vence `validTo` | Deja de generar obligaciones; las ya creadas en `taxObligations` siguen su ciclo | — |
| `ownTaxObligations` | `active` | `revoked` | Revocación con motivo (norma derogada o dictamen revisado) | Las obligaciones `pending` sin pagar se cancelan con motivo; las pagadas no se tocan | — |

## 9. Procesos y flujos

### 9.1 Habilitación fiscal del tenant (alta en ARCA)

1. El responsable fiscal completa el **relevamiento fiscal** (RF-FIS-006) y el **perfil fiscal** (RF-FIS-013, RF-FIS-014).
2. Genera clave y CSR en la plataforma (o carga PFX según PA-FIS-03); da de alta el certificado en ARCA con el alias y delega los servicios `wsfe` y padrón al computador fiscal.
3. Carga el certificado emitido; el sistema extrae metadatos y lo deja en `testing` en homologación.
4. Job `fis:probar-conector` ejecuta `FEDummy`, `loginCms`, `FEParamGetPtosVenta` y un `FECompUltimoAutorizado`; registra resultado.
5. Se configuran puntos de venta y modalidades (RF-FIS-033, RF-FIS-034) y se adoptan las tablas normativas iniciales (condiciones, alícuotas, tributos, jurisdicción Córdoba).
6. Con relevamiento aprobado y pruebas OK, el responsable activa producción (MFA). Se repite el paso 4 en producción.

### 9.2 Autorización CAE (JOB-FIS-01 `fis:autorizar-cola`)

1. **Disparo**: evento `fac.invoice.issued`, `fac.creditNote.issued` o `fac.debitNote.issued` (o de M07/M11/M18) con `documentId`; también disparo manual o periódico (cada minuto) si `autoAuthorize`.
2. FIS arma `payload` (RN-FIS-025 a RN-FIS-040) y corre la **prevalidación** (RF-FIS-041, RF-FIS-042). Si falla → `detained` + bandeja.
3. El worker toma el **lock** del par (tenant, CUIT, punto, tipo). Si no lo obtiene, reprograma.
4. Obtiene/renueva el **TA** (JOB-FIS-02).
5. **Contraste**: `FECompUltimoAutorizado`; si el último de ARCA ≥ primer número pendiente, ejecuta 9.4 antes de seguir.
6. Arma la **tanda**: pendientes correlativos desde último + 1, hasta el máximo de registros; si `PRM-FIS-012` está activo, agrupa B/C según RN-FIS-024.
7. Persiste `arcaSubmissions` en `sending` y envía `FECAESolicitar`.
8. **Respuesta**: procesa cada detalle (RF-FIS-051, RF-FIS-052). Emite eventos por comprobante. Ante un rechazo, clasifica `rejectionKind`, publica `fis.authorization.rejected` y **detiene la tanda del par**: no envía los pendientes posteriores con su número actual, porque M05 los devuelve a la cola y los renumera desde el último autorizado (DEC-107; RN-FAC-164). Al recibir `fac.invoice.returnedToDraft` pasa sus autorizaciones a `cancelled` (`numberReleased`) y las reemisiones llegan como `fac.invoice.issued` nuevos. *Antes: "Emite eventos por comprobante" y el par seguía con el mismo número corregido (DEC-035).*
9. **Timeout**: marca `uncertain` y encola JOB-FIS-04 de inmediato. No reenvía.
10. **Rechazo agrupado**: reintenta individualmente (RN-FIS-046).
11. Libera el lock; si quedan pendientes, reencola.
12. **Reintentos**: errores transitorios con *backoff* exponencial (1, 2, 4, 8, 16 min; máximo `PRM-FIS-027`), luego `detained` con causa "ARCA no disponible" y propuesta de contingencia (9.5).

### 9.3 Espera sincrónica (venta mostrador y cobranza con factura)

1. M11/M07 crea el comprobante y solicita `POST /api/admin/fis/authorizations/{id}/await` con timeout `PRM-FIS-010` (por defecto 15 s).
2. FIS prioriza ese comprobante en la cola de su par.
3. Si se autoriza a tiempo, devuelve CAE y QR; si no, devuelve `202 pending` y M11/M07 registran la operación con el aviso `dict:fis.aviso.pendienteArca`, y el comprobante se entrega cuando llegue el evento `fis.invoice.authorized` (PA-FIS-11).

### 9.4 Conciliación de incierto e inconsistencias (JOB-FIS-04 `fis:conciliar-incierto`, JOB-FIS-05 `fis:conciliar-arca`)

1. Para cada comprobante `uncertain` o rango a conciliar: `FECompConsultar`.
2. Si ARCA lo tiene con resultado `A` y el total coincide (tolerancia `PRM-FIS-019`) → `authorized` con CAE de ARCA y evidencia.
3. Si ARCA no lo tiene → `pending` (se reenvía con el mismo número, porque no fue rechazado y sigue siendo el próximo del par; DEC-107 solo libera números de comprobantes rechazados).
4. Si ARCA lo tiene con otro total o CAE → `toReconcile` + propuesta; un humano aprueba (RF-FIS-059).
5. El job periódico (diario) recorre comprobantes autorizados del día anterior por muestreo completo o total (`PRM-FIS-025`) e informa individuales y rangos.

### 9.5 CAEA y contingencia (JOB-FIS-06 `fis:solicitar-caea`, JOB-FIS-07 `fis:informar-caea`)

1. JOB-FIS-06 corre antes de cada quincena (`PRM-FIS-021` días antes): `FECAEAConsultar`; si no existe, `FECAEASolicitar`; registra `caeaPeriods`.
2. Contingencia: el responsable activa CAEA en los puntos habilitados (o el sistema propone tras `PRM-FIS-026` minutos de caída). M05 asigna el CAEA al numerar (RN-FIS-053).
3. JOB-FIS-07 diario y al cierre de quincena: informa con `FECAEARegInformativo` en tandas los comprobantes CAEA no informados (con `CbteFchHsGen`), e informa `FECAEASinMovimientoInformar` para los puntos sin uso.
4. Rechazos del informe → bandeja; alerta si se acerca `reportDeadline` (RF-FIS-070). El comprobante CAEA ya fue emitido y entregado con su número: no se renumera ni vuelve a borrador; se corrige y reinforma o se emite nota de crédito según la norma ([VERIFICAR] con el contador; DEC-107; RN-FAC-164 punto 9).

### 9.6 Cálculo de impuestos de un comprobante (servicio síncrono `fis.service.calculateTaxes`, antes `fis.taxEngine.calculate`)

1. M04/M05 envían: emisor (perfil vigente), receptor (condición IVA, situación IIBB, CUIT, exclusiones), fecha, servicio, documento y líneas con neto, alícuota de IVA referenciada y componentes.
2. FIS resuelve versiones adoptadas vigentes a la fecha (AGR-010).
3. Por cada línea: valida alícuota (RF-FIS-080); calcula IVA1/IVA2 (RN-FIS-074); acumula bases.
4. Percepción de IVA (RN-FIS-075 a 078); percepción IIBB por jurisdicción (padrón → alícuota determinada → alícuota de no incluidos → matriz), base mínima y mínimo imponible (RN-FIS-080).
5. Tributos y conceptos de terceros: solo los del catálogo con fundamento y servicio/documento permitido (RF-FIS-011, RF-FIS-134).
6. Transparencia fiscal (RF-FIS-062) y CVP vigente (RF-FIS-090).
7. Devuelve líneas impositivas con clasificación ARCA y `taxCalculationTraces`. Es determinista: misma entrada y versiones → mismo resultado.

### 9.7 Padrones de alícuotas IIBB (JOB-FIS-08 `fis:importar-padron`)

1. El responsable sube el archivo de la jurisdicción (ExcelImportWizard o TXT) con su régimen y vigencia; o un job lo descarga si existe canal oficial automatizable.
2. Validación de formato (tabla normativa del padrón), CUIT, alícuotas y vigencia; vista previa de errores.
3. Vinculación con cuentas por CUIT (y CUIT2); informe de no vinculados.
4. Aprobación → `active`; el anterior pasa a `superseded` para su vigencia.
5. Antes de cada masiva, M05 consulta `fis.service.checkRegistryCoverage` (antes `fis.registries.validateCoverage`; RF-FIS-088).

### 9.8 Retenciones en órdenes de pago (servicio `fis.service.calculateWithholdings`, antes `fis.withholding.calculate`)

1. M12/M14 envían OP en preparación: proveedor, facturas a pagar (con importes por componente, discriminación, formalidad), anticipos, fecha.
2. FIS filtra tipos habilitados globalmente y asignados al proveedor; excluye por certificados vigentes.
3. Calcula base por factura (RN-08 §3.2), acumulación, mínimo, escala, importe (RN-08 §3.3).
4. Devuelve retenciones propuestas con traza; M12/M14 muestran el neto.
5. Al confirmar la OP: `withholdingsApplied` → `confirmed`, numeración de certificados (por tipo, punto y año), PDF, actualización del borrador de declaración y de la obligación del período (RF-FIS-109, RF-FIS-108).
6. Al anular la OP: `cancelled` o `rectified` según estado (RF-FIS-105).

### 9.9 Libro IVA y Libro IVA Digital (JOB-FIS-10 `fis:generar-libro-iva`, JOB-FIS-11 `fis:generar-lid`)

1. El responsable elige período, criterio, fecha y filtros; el job arma `vatLedgerLines` desde comprobantes autorizados (M05/M07), cobros (M07) para el percibido, y compras (M12).
2. Muestra informe y carátula; permite comparar con Mis Comprobantes (9.10).
3. Cierre: snapshot inmutable con hash (RF-FIS-117).
4. JOB-FIS-11 genera los archivos LID (ventas CBTE + ALICUOTAS; compras CBTE + ALICUOTAS), valida por línea y correlatividad y crea la `regimeFilings` en `validated`.
5. El responsable presenta en ARCA y carga el acuse → `submitted` → `accepted`/`rejected`.

### 9.10 Conciliación con Mis Comprobantes (JOB-FIS-12 `fis:conciliar-mis-comprobantes`)

1. Importación del CSV/Excel de emitidos o recibidos del período.
2. Cruce por tipo, punto y número dentro del rango.
3. Resultados: inexistente en CoopApps, inexistente en ARCA, diferencia mayor a `PRM-FIS-053` por campo.
4. Revisión y cierre de la conciliación con comentarios.

### 9.11 Regímenes informativos (JOB-FIS-13 `fis:generar-regimen`)

1. El calendario (JOB-FIS-14 `fis:calendario-fiscal`, diario) crea borradores de cada obligación del período.
2. Generación: universo, validaciones y archivo con nombre normativo, hash y totales.
3. Aprobación (doble control si `PRM-FIS-060`), presentación humana o por web service si existe y está habilitado, acuse, resultado.
4. Rechazo → rectificativa vinculada (CU-FIS-10).

### 9.12 Conceptos de terceros y rendición (JOB-FIS-15 `fis:rendicion-terceros`)

1. Convenio activo con fundamento (RF-FIS-134).
2. M05 factura los conceptos (incluidas importaciones de terceros, RF-FIS-137); FIS registra `thirdPartyCharges`.
3. M07 imputa cobros; FIS distribuye cobros parciales según la política del convenio (RF-FIS-138) y emite eventos contables de pasivo.
4. Al cierre del período del convenio, JOB-FIS-15 calcula cobrado, comisión y neto; genera reporte/archivo; aprobación; M14 emite la OP; al confirmarse el pago, conciliación.

### 9.13 Informes regulatorios (JOB-FIS-16 `fis:generar-informe-regulatorio`)

1. Por informe del catálogo y período, toma datos de M01, M03, M04, M05, M07, M08 y M10 según `regulatoryConceptMaps`.
2. Genera archivos del protocolo (ej. FCU-DS: FaC, Sub, FaD, CoC, Usr, FaV, SICC) con nombres y separadores normados.
3. Valida, aprueba, presenta y registra acuse.

### 9.14 Sincronización de tablas ARCA (JOB-FIS-17 `fis:sincronizar-parametros-arca`, plataforma)

Semanal y a demanda: llama a los `FEParamGet*` con un certificado técnico de plataforma (o del primer tenant que lo autorice), compara con la versión publicada y crea `draft` con diff y alerta.

### 9.15 Alertas de vencimientos (JOB-FIS-18 `fis:alertas-credenciales`, JOB-FIS-14)

Diario: certificados (30/14/7/3/vencido), CAEA (plazo de informe), padrones (vigencia), CESP/CAI (vencimiento), declaraciones (calendario), pendientes de autorización (> N días).

### 9.16 Revalidación de padrón (JOB-FIS-19 `fis:revalidar-condicion`)

Mensual (configurable): consulta padrón por lotes con límite de tasa, compara condición IVA/monotributo con M01/M12, genera informe de diferencias y propuestas; nada cambia sin aprobación (PA-FIS-17).

### 9.17 Modo pasarela (JOB-FIS-20 `fis:pasarela-importar`)

1. Entrada por API (`POST /api/v1/ext/fis/documents`, idempotente) o carga CSV desde la pantalla.
2. Validación (RF-FIS-155) y alta en `gatewayDocuments` + `fiscalAuthorizations` (`sourceModule = gateway`).
3. Autorización por la misma cola (9.2) con todas las reglas del modo completo, incluido el tratamiento de 10242/10243.
4. Resultado por API (`GET .../documents/{id}`) o archivo de salida descargable.

### 9.18 Recuperación (ESC-04)

Tras una restauración, JOB-FIS-05 recorre los números de cada par desde el último autorizado conocido hasta el último de ARCA y recupera CAE y totales; nunca reenvía un número que ARCA ya tiene (AGR-019).

## 10. Pantallas

Todas las pantallas admin usan AdminShell, `AdminStickyHeader`, `ScreenHelp`, `DataTable` con exportación y vistas guardadas, modales `sm/md/lg/xl`, toasts y `ConfirmDialog` (CNX). Etiquetas por diccionario `dict:fis.*`. Las pantallas de declaraciones muestran la leyenda de responsabilidad (RF-FIS-008).

| PAN-ID | App | Ruta | Capability | Propósito | Layout, filtros, columnas, acciones y modales | Estados vacíos y ayuda | Equivalencia INV |
|---|---|---|---|---|---|---|---|
| PAN-FIS-01 | plataforma | `/platform/fis/normative-tables` | `fis.tablasNormativas.ver` | Catálogo de tablas normativas | DataTable: tabla, ámbito, jurisdicción, versión vigente, estado, próxima vigencia. Acciones: nueva versión, importar filas (ExcelImportWizard), enviar a revisión, publicar, retirar. Modal xl de versión con fuente obligatoria y diff | "Sin versiones publicadas"; ayuda: qué es fuente y vigencia | — (nuevo) |
| PAN-FIS-02 | plataforma | `/platform/fis/arca-params` | `fis.arcaParametros.sincronizar` | Sincronización de tablas ARCA | Por ambiente: tabla, última sincronización, diferencias. Acción: sincronizar ahora | Ayuda: no impacta tenants hasta publicar | `ObtenerTabla` (sin pantalla) |
| PAN-FIS-03 | admin | `/admin/fis/normative-adoptions` | `fis.tablasNormativas.adoptar` | Adopción de versiones por el tenant | Tabs: pendientes, adoptadas, historial. Acciones: simular (modal lg con totales antes/después), adoptar con fecha efectiva (MFA), rechazar | "No hay versiones nuevas" | — |
| PAN-FIS-04 | admin | `/admin/fis/profile` | `fis.perfil.ver` | Perfil fiscal del tenant | Formulario por secciones: identidad, IVA, IIBB/CM con jurisdicciones, actividades, MiPyME, mapa regulatorio por servicio. Pestaña "Obligaciones y exenciones propias" (DEC-095; `ownTaxObligations`, RF-FIS-169): DataTable por entidad jurídica con impuesto, jurisdicción, alcance, tipo, vigencia y estado; modal md de alta con fundamento, dictamen y adjuntos; aprobar con MFA (`fis.perfil.editar`); estado vacío "Sin obligaciones ni exenciones propias registradas: se cargan cuando el contador las confirma". Historial de versiones | Ayuda: datos que salen en el comprobante | Variables 518–527, 706, 709 |
| PAN-FIS-05 | admin | `/admin/fis/survey` | `fis.perfil.editar` | Relevamiento fiscal (BASE §52.4) | Checklist por tema con evidencia y responsable; enviar a aprobación | Ayuda: bloquea producción hasta aprobar | — |
| PAN-FIS-06 | admin | `/admin/fis/agent-registrations` | `fis.retenciones.configurar` | Condiciones de agente | DataTable: organismo, impuesto, régimen, rol, número, vigencia, sistema. Modal md alta/edición con adjuntos | "Sin regímenes registrados" | Variables 2008–2011 |
| PAN-FIS-07 | admin | `/admin/fis/arca/credentials` | `fis.arca.configurar` | Certificados y conector ARCA | Cards por ambiente: estado, vence en, servicios, último health check. Acciones: generar CSR, subir certificado, probar, activar producción (MFA), revocar | Ayuda paso a paso del alta en ARCA | Variables 2071–2073, 2925 |
| PAN-FIS-08 | admin | `/admin/fis/points-of-sale` | `fis.puntosVenta.configurar` | Puntos de venta y modalidades | DataTable: entidad jurídica (DEC-064; filtro obligatorio si el tenant tiene más de una), número, descripción, sistema, sucursal, estado ARCA, autoautorizar. Detalle con matriz tipo × modalidad (CAE/CAEA/CAI/CESP), CAI vigente. Acciones: sincronizar con ARCA, pausar/reanudar | "Sincronice con ARCA" | abm_PtoVenta, abm_comprob (flags CAI) |
| PAN-FIS-09 | admin | `/admin/fis/authorizations` | `fis.autorizaciones.ver` | Tablero de la cola de autorización | KPIs por estado; DataTable: fecha, punto, tipo, número, receptor, total, estado, intentos, motivo ARCA. Filtros: estado, punto, tipo, fecha, módulo origen. Acciones masivas: enviar, reintentar, consultar en ARCA, derivar a corrección; detalle xl con payload, intentos, request/response enmascarados, traza de impuestos | "No hay comprobantes pendientes"; ayuda de cada estado | frmFacturacionElectronica, frmProcesoAutomatico, frmEnvioPmovil, alerta "Hay facturas electrónicas pendientes de autorizar!" |
| PAN-FIS-10 | admin | `/admin/fis/authorizations/exceptions` | `fis.bandeja.ver` | Bandeja de excepciones fiscales | Casos `detained`, `rejected`, `toReconcile`: problema, estado, responsable, siguiente acción (como la tabla de BASE §69). Acciones: derivar, revalidar | "Sin excepciones" | — |
| PAN-FIS-11 | admin | `/admin/fis/authorizations/preview` | `fis.autorizaciones.previsualizar` | Vista previa del request | Modal xl con el request campo a campo y validaciones | — | consultaPreviaAutorizar |
| PAN-FIS-12 | admin | `/admin/fis/arca/query` | `fis.ultimoComprobante.consultar` | Consultas a ARCA | Tabs: último autorizado (punto, tipo), comprobante (punto, tipo, número), CAEA (período, orden), puntos de venta | — | frmConsultaNumComAFIP, btnUltimoComprobante, consultaCAE |
| PAN-FIS-13 | admin | `/admin/fis/reconciliation/arca` | `fis.conciliacion.aprobar` | Inconsistencias con ARCA | Rango/período/punto; resultado: CAE distinto, importe distinto, inexistente; propuesta de reparación con aprobación | "Sin inconsistencias" | ConsultaInconsistencias |
| PAN-FIS-14 | admin | `/admin/fis/caea` | `fis.caea.solicitar` | CAEA por quincena | DataTable: período, orden, CAEA, vigencia, plazo de informe, comprobantes, informados, puntos sin movimiento, estado. Acciones: solicitar/consultar, informar, informar sin movimiento, activar contingencia | Ayuda: restricciones vigentes de CAEA | abm_CespAfip (btnCAEA) |
| PAN-FIS-15 | admin | `/admin/fis/cesp` | `fis.cesp.configurar` | CESP de LQSP | DataTable: descripción, CESP, desde, hasta, vencimiento, punto, estado. Validación de superposición | Aviso si no hay CESP activos | abm_CespAfip |
| PAN-FIS-16 | admin | `/admin/fis/cvp` | `fis.impuestos.configurar` | Código de Validación Provincial | DataTable: jurisdicción, punto, comprobante, desde, hasta, código, leyenda | — | abm_Cvpiibb |
| PAN-FIS-17 | admin | `/admin/fis/vat/conditions` | `fis.impuestos.configurar` | Condiciones frente al IVA | DataTable: código ARCA, descripción, percibido, mínimo percepción, sobre neto, no categorizado, código padrón, SIRE, comprobantes sugeridos | — | abm_sit_iva |
| PAN-FIS-18 | admin | `/admin/fis/vat/rates` | `fis.impuestos.configurar` | Alícuotas y matriz IVA | Tabs: alícuotas (código ARCA, cuentas), matriz condición × alícuota (IVA, IVA2, percepción) en grilla editable con vigencia | — | abm_ali_iva |
| PAN-FIS-19 | admin | `/admin/fis/taxes` | `fis.impuestos.configurar` | Catálogo de tributos y percepciones | DataTable: código, nivel, naturaleza, Id ARCA, jurisdicción, trasladable, servicios, vigencia. Modal xl con fundamento obligatorio y cálculo | Ayuda: mapeo a Id ARCA | abm_Impuesto, abm_Electronica_Iva |
| PAN-FIS-20 | admin | `/admin/fis/gross-income` | `fis.impuestos.configurar` | Ingresos Brutos | Tabs: situaciones, alícuotas, matriz, por comprobante, mínimos y no incluidos | — | abm_Sit_Ibr, abm_ali_Ibr, abm_ali_ibr_comp |
| PAN-FIS-21 | admin | `/admin/fis/registries` | `fis.padrones.importar` | Padrones (IIBB, condición ARCA, exclusiones) | DataTable de importaciones; ExcelImportWizard (subir → preview con errores → confirmar); detalle con no vinculados; aprobar | Aviso de padrón vencido | frmLiquidacionPercepciones, frmLiquidacionPercepciones_BsAs, importación `EMPAFIP` |
| PAN-FIS-22 | admin | `/admin/fis/determined-rates` | `fis.impuestos.configurar` | Alícuotas determinadas y exclusiones | DataTable por cuenta/persona: régimen, alícuota o exclusión, vigencia, respaldo | — | frmAlicuotaDeterminada |
| PAN-FIS-23 | admin | `/admin/fis/padron/lookup` (también como componente embebido en M01/M12) | `fis.padron.consultar` | Consulta de padrón ARCA | Ingreso de CUIT o DNI; resultado con datos y botón "usar estos datos" | Mensaje si ARCA no responde | abm_Personas (validación CUIT) |
| PAN-FIS-24 | admin | `/admin/fis/withholding/types` | `fis.retenciones.configurar` | Tipos de retención y escalas | DataTable de tipos; detalle xl con banderas, mínimos, acumulación y escalas por tramo | — | `RETE_TIPO`, `CAT_RETG` (ABM de compras) |
| PAN-FIS-25 | admin | `/admin/fis/withholding/assignments` | `fis.retenciones.configurar` | Asignaciones a proveedores/productos/conceptos | DataTable con filtros por tipo y sujeto; carga masiva | — | `PROVEED_RET`, `PROD_SER_RET` |
| PAN-FIS-26 | admin | `/admin/fis/withholding/applied` | `fis.retenciones.ver` | Retenciones practicadas y certificados | DataTable: fecha, proveedor, CUIT, tipo, base, importe, certificado, período, estado. Acciones: ver/emitir certificado, cargar código oficial | — | frmCargaRetenciones (cobros), informes de retenciones |
| PAN-FIS-27 | admin | `/admin/fis/withholding/suffered-types` | `fis.retenciones.configurar` | Tipos de retenciones sufridas | DataTable con cuenta contable | — | abm_Rets_Tipo |
| PAN-FIS-28 | admin | `/admin/fis/obligations` | `fis.obligaciones.ver` | Obligaciones fiscales y calendario | Calendario + DataTable: régimen, período, vencimiento, importe, estado, OP/movimiento | "Sin vencimientos próximos" | — |
| PAN-FIS-29 | admin | `/admin/fis/vat-ledger` | `fis.libroIva.ver` | Libro IVA ventas y compras | Filtros (RF-FIS-114), criterio, fecha, tipo de informe; resultado con carátula; acciones: cerrar, reabrir, exportar PDF/XLSX, generar LID | Leyenda de responsabilidad | frmLibroIvaVenta, libro IVA compras |
| PAN-FIS-30 | admin | `/admin/fis/mis-comprobantes` | `fis.libroIva.generar` | Conciliación con Mis Comprobantes | Importar archivo; tres pestañas de resultados; marcar revisado | — | frmLibroIvaVenta (chCompararAFIP, Imprimir_Comprobantes*) |
| PAN-FIS-31 | admin | `/admin/fis/filings` | `fis.regimenes.generar` | Declaraciones y regímenes informativos | DataTable: régimen, período, versión, rectificativa, estado, vencimiento, acuse. Acciones: generar, validar, aprobar, cargar acuse, rectificar, descargar | Leyenda de responsabilidad | frmLibroIvaVenta (chRG1361, chRG2177, chRG3349, chRG3571, chRG3685, chRG462019, chSicore), frmExportarSIRCAR |
| PAN-FIS-32 | admin | `/admin/fis/filings/validate` | `fis.regimenes.validar` | Validador de archivos | Subir o elegir archivo; análisis por línea y correlatividad | — | btnBuscarLinea (frmLibroIvaVenta), `Get_InfoLinea` |
| PAN-FIS-33 | admin | `/admin/fis/third-parties/agreements` | `fis.terceros.configurar` | Convenios por cuenta de terceros | DataTable: beneficiario, CUIT, conceptos, vigencia, estado. Modal xl con fundamento, conceptos, comisión, política de pagos parciales, rendición | Ayuda: sin convenio no se factura | abm_Terceros |
| PAN-FIS-34 | admin | `/admin/fis/third-parties/remittances` | `fis.rendiciones.generar` | Rendiciones a terceros | DataTable: convenio, período, facturado, cobrado, comisión, neto, estado. Acciones: calcular, aprobar, enviar a OP, conciliar | — | frmResultadosCuotaTerceros, rendición FECESCOR |
| PAN-FIS-35 | admin | `/admin/fis/regulatory` | `fis.reguladores.ver` | Informes a reguladores | DataTable por organismo/informe/período/estado; acciones: generar, validar, presentar, acuse | — | frmEnargasPEN2067, frmEnacom, frmInformeSecretariaElectrica, exportaciones ERSeP |
| PAN-FIS-36 | admin | `/admin/fis/regulatory/concept-maps` | `fis.reguladores.configurar` | Configuración de conceptos regulatorios | Por informe y tipo de servicio: servicios, productos, impuestos, categorías y códigos de entidad | — | frmEnacom (configuración), frmEnargasConceptos, frmEnargasConceptos_Config, frmEnargasTablas |
| PAN-FIS-37 | admin | `/admin/fis/public-admin` | `fis.admPublica.ver` | Comprobantes de administración pública | Filtros (RF-FIS-151); grilla agrupada por factura y servicio con totales; acciones: cargar, guardar selección, quitar, imprimir | Aviso si ya existe selección | frmComprobnatesAdministracionPublicaRAW, frmComprobantesAdministracionPublicaRAWConsulta |
| PAN-FIS-38 | admin | `/admin/fis/gateway` | `fis.pasarela.enviar` | Modo pasarela | Importar CSV, listado de comprobantes externos con estado y CAE, descarga de resultados, clientes API habilitados | — | Modo "solo factura electrónica" (carpetas IN/OUT) |
| PAN-FIS-39 | admin | `/admin/fis/connector` | `fis.conector.ver` | Estado del conector fiscal | Por servicio ARCA y organismo: último éxito/error, TA vigente, cola, health check; historial de incidentes | — | Avisos de inicio de ProCoop |
| PAN-FIS-40 | admin | `/admin/fis/reports` | `fis.*.ver` (comodín de visibilidad: alcanza cualquier capability `fis.<recurso>.ver`, regla AL-08 de T03; cada reporte exige la `ver` de su dominio) | Reportes fiscales | Lista de reportes de la sección 15 con filtros y exportación | — | Informes de facturación por impuesto, IMPUESTOS_X_CAT |
| PAN-FIS-41 | pwa-socio | (componente en M19) | `por.facturas.ver` (M19; solo comprobantes de cuentas propias; antes: «—») | Datos fiscales del comprobante | CAE, vencimiento de CAE, QR, leyendas fiscales y transparencia fiscal | — | — |

## 11. API

> **Nota de rutas:** Rutas normalizadas el 05-11-2026 a la convención de la maestra (§13: endpoints en inglés): API-FIS-49, 50, 61 y 62 conservan su ruta anterior en la descripción.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FIS-01 | GET | `/api/platform/fis/normative-tables` | `fis.tablasNormativas.ver` | Lista tablas y versiones | Sí |
| API-FIS-02 | POST | `/api/platform/fis/normative-tables/{code}/versions` | `fis.tablasNormativas.crear` | Crea versión borrador con fuente | Sí (`Idempotency-Key`) |
| API-FIS-03 | POST | `/api/platform/fis/normative-tables/{code}/versions/{id}/publish` | `fis.tablasNormativas.publicar` | Publica versión | Sí |
| API-FIS-04 | POST | `/api/platform/fis/arca-params/sync` | `fis.arcaParametros.sincronizar` | Sincroniza tablas ARCA | Sí |
| API-FIS-05 | GET | `/api/admin/fis/normative-adoptions` | `fis.tablasNormativas.adoptar` | Versiones pendientes y adoptadas | Sí |
| API-FIS-06 | POST | `/api/admin/fis/normative-adoptions/{versionId}/simulate` | `fis.tablasNormativas.adoptar` | Simula impacto | Sí |
| API-FIS-07 | POST | `/api/admin/fis/normative-adoptions` | `fis.tablasNormativas.adoptar` | Adopta con fecha efectiva | Sí |
| API-FIS-08 | GET/PUT | `/api/admin/fis/profile` | `fis.perfil.ver` / `fis.perfil.editar` | Perfil fiscal (nueva versión en PUT) | PUT con `version` |
| API-FIS-09 | GET/POST/PUT | `/api/admin/fis/surveys` | `fis.perfil.editar` | Relevamiento fiscal | Sí |
| API-FIS-10 | GET/POST/PUT | `/api/admin/fis/agent-registrations` | `fis.retenciones.configurar` | Condiciones de agente | Sí |
| API-FIS-11 | POST | `/api/admin/fis/arca/credentials/csr` | `fis.arca.configurar` | Genera clave y CSR en bóveda | Sí |
| API-FIS-12 | POST | `/api/admin/fis/arca/credentials` | `fis.arca.configurar` | Sube certificado (multipart) | Sí |
| API-FIS-13 | POST | `/api/admin/fis/arca/credentials/{id}/test` | `fis.arca.configurar` | Prueba el conector | Sí |
| API-FIS-14 | POST | `/api/admin/fis/arca/credentials/{id}/activate` | `fis.arca.configurar` (MFA) | Activa producción | Sí |
| API-FIS-15 | POST | `/api/admin/fis/arca/credentials/{id}/revoke` | `fis.arca.configurar` (MFA) | Revoca | Sí |
| API-FIS-16 | GET | `/api/admin/fis/connector/status` | `fis.conector.ver` | Estado observable | Sí |
| API-FIS-17 | GET/POST/PUT | `/api/admin/fis/points-of-sale` | `fis.puntosVenta.configurar` | Puntos de venta y modalidades | Sí |
| API-FIS-18 | POST | `/api/admin/fis/points-of-sale/sync` | `fis.puntosVenta.configurar` | Sincroniza con `FEParamGetPtosVenta` | Sí |
| API-FIS-19 | POST | `/api/admin/fis/points-of-sale/{id}/pause` / `resume` | `fis.puntosVenta.configurar` | Pausa o reanuda | Sí |
| API-FIS-20 | GET | `/api/admin/fis/authorizations` | `fis.autorizaciones.ver` | Lista paginada con filtros | Sí |
| API-FIS-21 | GET | `/api/admin/fis/authorizations/{id}` | `fis.autorizaciones.ver` | Detalle, intentos, traza | Sí |
| API-FIS-22 | POST | `/api/admin/fis/authorizations/submit` | `fis.autorizaciones.enviar` | Encola selección (ids o filtros) | Sí (`Idempotency-Key`) |
| API-FIS-23 | POST | `/api/admin/fis/authorizations/{id}/retry` | `fis.autorizaciones.reintentar` | Reintenta (consulta previa si incierto) | Sí |
| API-FIS-24 | POST | `/api/admin/fis/authorizations/{id}/await` | `fis.autorizaciones.enviar` | Espera sincrónica con timeout | Sí |
| API-FIS-25 | GET | `/api/admin/fis/authorizations/{id}/preview` | `fis.autorizaciones.previsualizar` | Vista previa del request | Sí |
| API-FIS-26 | POST | `/api/admin/fis/authorizations/{id}/derive` | `fis.bandeja.derivar` | Deriva a corrección (responsable) | Sí |
| API-FIS-27 | PUT | `/api/admin/fis/authorizations/auto` | `fis.puntosVenta.configurar` | Enciende/apaga autorización automática | Sí |
| API-FIS-28 | GET | `/api/admin/fis/arca/last-authorized?pos=&type=` | `fis.ultimoComprobante.consultar` | `FECompUltimoAutorizado` | Sí |
| API-FIS-29 | GET | `/api/admin/fis/arca/document?pos=&type=&number=` | `fis.ultimoComprobante.consultar` | `FECompConsultar` | Sí |
| API-FIS-30 | POST | `/api/admin/fis/reconciliations/arca` | `fis.conciliacion.aprobar` | Ejecuta conciliación de inconsistencias | Sí |
| API-FIS-31 | POST | `/api/admin/fis/reconciliations/arca/{id}/approve` | `fis.conciliacion.aprobar` | Aprueba reparación | Sí |
| API-FIS-32 | GET/POST | `/api/admin/fis/caea` | `fis.caea.solicitar` | Lista / solicita o consulta CAEA | Sí |
| API-FIS-33 | POST | `/api/admin/fis/caea/{id}/report` | `fis.caea.informar` | Informa comprobantes CAEA | Sí |
| API-FIS-34 | POST | `/api/admin/fis/caea/{id}/report-no-movement` | `fis.caea.informar` | Informa sin movimiento | Sí |
| API-FIS-35 | POST | `/api/admin/fis/contingency` | `fis.caea.solicitar` (MFA) | Activa/desactiva contingencia | Sí |
| API-FIS-36 | GET/POST/PUT | `/api/admin/fis/cesp` | `fis.cesp.configurar` | CESP | Sí |
| API-FIS-37 | GET/POST/PUT | `/api/admin/fis/cvp` | `fis.impuestos.configurar` | CVP | Sí |
| API-FIS-38 | GET/PUT | `/api/admin/fis/vat/conditions` | `fis.impuestos.configurar` | Configuración por condición IVA | Sí |
| API-FIS-39 | GET/PUT | `/api/admin/fis/vat/rates` y `/matrix` | `fis.impuestos.configurar` | Alícuotas y matriz | Sí |
| API-FIS-40 | GET/POST/PUT | `/api/admin/fis/taxes` | `fis.impuestos.configurar` | Catálogo de tributos | Sí |
| API-FIS-41 | GET/PUT | `/api/admin/fis/gross-income` | `fis.impuestos.configurar` | Configuración IIBB | Sí |
| API-FIS-42 | POST | `/api/admin/fis/tax-engine/calculate` | `fis.impuestos.ver` (simulación; el cálculo de documentos lo hace el servicio interno `fis.service.calculateTaxes`; antes: «Interno (servicio) + `fis.impuestos.ver` para simulación») | Calcula impuestos de un documento | Sí |
| API-FIS-43 | GET | `/api/admin/fis/tax-engine/traces/{documentId}` | `fis.impuestos.ver` | Traza de cálculo | Sí |
| API-FIS-44 | — | — | — | Reemplazado por servicio interno `fis.service.resolveDocumentClass` (§11.1). | — |
| API-FIS-45 | GET/POST | `/api/admin/fis/registries` | `fis.padrones.importar` | Lista / importa padrón | Sí |
| API-FIS-46 | POST | `/api/admin/fis/registries/{id}/approve` | `fis.padrones.aprobar` | Activa padrón | Sí |
| API-FIS-47 | — | — | — | Reemplazado por servicio interno `fis.service.checkRegistryCoverage` (§11.1). | — |
| API-FIS-48 | GET/POST/PUT | `/api/admin/fis/determined-rates`, `/exemptions` | `fis.impuestos.configurar` / `fis.exclusiones.editar` | Alícuotas determinadas y exclusiones | Sí |
| API-FIS-49 | GET | `/api/admin/fis/taxpayer-lookup?cuit=` / `?dni=` | `fis.padron.consultar` | Consulta A13/constancia Ruta anterior: `/api/admin/fis/padron?cuit=` (convención de rutas en inglés, maestra §13). | Sí |
| API-FIS-50 | POST | `/api/admin/fis/taxpayer-lookup/revalidations` | `fis.padrones.importar` | Lanza revalidación masiva Ruta anterior: `/api/admin/fis/padron/revalidations` (convención de rutas en inglés, maestra §13). | Sí |
| API-FIS-51 | GET/POST/PUT | `/api/admin/fis/withholding/types`, `/scales`, `/assignments` | `fis.retenciones.configurar` | Configuración de retenciones | Sí |
| API-FIS-52 | POST | `/api/admin/fis/withholding/calculate` | `fis.retenciones.calcular` (M12/M14 usan además el servicio interno `fis.service.calculateWithholdings`; antes: «Interno (M12/M14) + `fis.retenciones.calcular`») | Calcula retenciones de una OP | Sí |
| API-FIS-53 | — | — | — | Reemplazado por servicio interno `fis.service.confirmWithholdings` (§11.1). | — |
| API-FIS-54 | — | — | — | Reemplazado por servicio interno `fis.service.cancelWithholdings` (§11.1). | — |
| API-FIS-55 | GET | `/api/admin/fis/withholding/applied` | `fis.retenciones.ver` | Retenciones practicadas | Sí |
| API-FIS-56 | GET | `/api/admin/fis/withholding/{id}/certificate.pdf` | `fis.certificadosRetencion.ver` | Certificado (URL firmada) | Sí |
| API-FIS-57 | GET/POST/PUT | `/api/admin/fis/withholding/suffered-types` | `fis.retenciones.configurar` | Tipos de retenciones sufridas | Sí |
| API-FIS-58 | GET | `/api/admin/fis/obligations` | `fis.obligaciones.ver` | Obligaciones y calendario | Sí |
| API-FIS-59 | POST | `/api/admin/fis/vat-ledgers` | `fis.libroIva.generar` | Genera libro (job) | Sí |
| API-FIS-60 | POST | `/api/admin/fis/vat-ledgers/{id}/close` / `reopen` | `fis.libroIva.cerrar` / `fis.libroIva.reabrir` (MFA) | Cierra/reabre | Sí |
| API-FIS-61 | POST | `/api/admin/fis/arca-received/imports` | `fis.libroIva.generar` | Importa archivo de ARCA Ruta anterior: `/api/admin/fis/mis-comprobantes/imports` (convención de rutas en inglés, maestra §13). | Sí |
| API-FIS-62 | GET | `/api/admin/fis/arca-received/reconciliations/{id}` | `fis.libroIva.ver` | Resultado de conciliación Ruta anterior: `/api/admin/fis/mis-comprobantes/reconciliations/{id}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FIS-63 | GET/POST | `/api/admin/fis/filings` | `fis.regimenes.generar` | Lista / genera declaración | Sí |
| API-FIS-64 | POST | `/api/admin/fis/filings/{id}/validate` | `fis.regimenes.validar` | Valida archivos | Sí |
| API-FIS-65 | POST | `/api/admin/fis/filings/{id}/approve` | `fis.regimenes.presentar` (MFA) | Aprueba | Sí |
| API-FIS-66 | POST | `/api/admin/fis/filings/{id}/submission` | `fis.regimenes.presentar` | Registra presentación y acuse | Sí |
| API-FIS-67 | POST | `/api/admin/fis/filings/{id}/result` | `fis.regimenes.presentar` | Registra aceptación/rechazo | Sí |
| API-FIS-68 | POST | `/api/admin/fis/filings/{id}/rectify` | `fis.regimenes.rectificar` | Crea rectificativa | Sí |
| API-FIS-69 | POST | `/api/admin/fis/files/analyze` | `fis.regimenes.validar` | Analiza archivo por línea/correlatividad | Sí |
| API-FIS-70 | GET/POST/PUT | `/api/admin/fis/third-parties/agreements` | `fis.terceros.configurar` | Convenios | Sí |
| API-FIS-71 | GET/POST | `/api/admin/fis/third-parties/remittances` | `fis.rendiciones.generar` | Rendiciones | Sí |
| API-FIS-72 | POST | `/api/admin/fis/third-parties/remittances/{id}/approve` | `fis.rendiciones.aprobar` | Aprueba y solicita OP a M14 | Sí |
| API-FIS-73 | GET/POST | `/api/admin/fis/regulatory/runs` | `fis.reguladores.generar` | Informes regulatorios | Sí |
| API-FIS-74 | POST | `/api/admin/fis/regulatory/runs/{id}/submission` | `fis.reguladores.presentar` | Presentación y acuse | Sí |
| API-FIS-75 | GET/PUT | `/api/admin/fis/regulatory/concept-maps` | `fis.reguladores.configurar` | Mapas de conceptos | Sí |
| API-FIS-76 | GET/POST/DELETE | `/api/admin/fis/public-admin/selections` | `fis.admPublica.ver` / `fis.admPublica.editar` | Selección de administración pública (DELETE quita ítems, no borra comprobantes) | Sí |
| API-FIS-77 | POST | `/api/v1/ext/fis/documents` | `fis.pasarela.enviar` (token de cliente API; antes: «Token cliente `fis.pasarela.enviar`») | Envía comprobante externo | Sí (`Idempotency-Key` obligatorio) |
| API-FIS-78 | GET | `/api/v1/ext/fis/documents/{id}` | `fis.pasarela.consultar` (token de cliente API; antes: «Token cliente `fis.pasarela.consultar`») | Estado y CAE | Sí |
| API-FIS-79 | POST | `/api/admin/fis/gateway/imports` | `fis.pasarela.enviar` | Importa CSV del modo pasarela | Sí |
| API-FIS-80 | GET | `/api/admin/fis/reports/{code}` | `fis.*.ver` / `fis.reportes.exportar` (comodín de visibilidad, regla AL-08 de T03: cada reporte exige la capability `fis.<recurso>.ver` de su dominio; exportar exige `fis.reportes.exportar` según PA-FIS-19; antes `exportar` sin recurso) | Reportes de la sección 15 | Sí |
| API-FIS-81 | GET | `/api/fis/documents/{documentId}/fiscal-data` | `por.facturas.ver` (M19; solo comprobantes de cuentas propias; antes: «Socio dueño (M19)») | CAE, vencimiento, QR y leyendas del propio comprobante | Sí |
| API-FIS-82 | GET/POST/PATCH | `/api/admin/fis/own-tax-obligations[/{id}]` y `POST …/{id}/approve` | `fis.perfil.ver` / `fis.perfil.editar` | Registro de obligaciones y exenciones propias (DEC-095; RF-FIS-169, RN-FIS-133); aprobar exige MFA | Sí (`Idempotency-Key` en POST) |

Errores con `application/problem+json` y `requestId`; los errores de ARCA se traducen a `type` estables (`fis/arca-rejected`, `fis/arca-unavailable`, `fis/credential-expired`, `fis/prevalidation-failed`) con el código ARCA en `extensions`, sin token ni firma.

### 11.1 Servicios internos expuestos a otros módulos (no HTTP)

Funciones del monolito que otros módulos invocan en proceso; no tienen ruta ni capability propia (la autorización la resuelve el módulo que llama). Se movieron aquí desde la tabla de API el 05-11-2026; la fila original queda como "Reemplazado por servicio interno". Los consumidores de `confirmWithholdings`, `cancelWithholdings` y `calculateWithholdings` (M12/M14) vienen de la fila original; los de `resolveDocumentClass`, `checkRegistryCoverage` y `calculateTaxes` se confirmaron en la ronda de residuales del 05-11-2026 (PA-FIS-22) con las invocaciones que declaran los anexos consumidores (antes [VERIFICAR], porque la fila original decía solo "Interno").

| Servicio | Firma | Consumidores | Descripción | Idempotente | Antes |
|---|---|---|---|---|---|
| `fis.service.resolveDocumentClass` | `fis.service.resolveDocumentClass(request)` | M05 (emisión de comprobantes), M11 (ventas y punto de venta) | Determina clase de comprobante y valida factura A. Ruta anterior: POST `/api/admin/fis/document-class/resolve` (capability anterior: «Interno»). | Sí | API-FIS-44 |
| `fis.service.checkRegistryCoverage` | `fis.service.checkRegistryCoverage({ serviceIds, date })` | M05 (antes de la facturación masiva, §9.7 paso 5) | Valida vigencia de padrones antes de masiva. Ruta anterior: GET `/api/admin/fis/registries/coverage?serviceIds=&date=` (capability anterior: «Interno»). | Sí | API-FIS-47 |
| `fis.service.confirmWithholdings` | `fis.service.confirmWithholdings(paymentOrder)` | M12, M14 | Confirma retenciones de OP aprobada. Ruta anterior: POST `/api/admin/fis/withholding/confirm` (capability anterior: «Interno (M12/M14)»). | Sí (`Idempotency-Key` = OP) | API-FIS-53 |
| `fis.service.cancelWithholdings` | `fis.service.cancelWithholdings(withholdingId)` | M12, M14 | Anula por anulación de OP. Ruta anterior: POST `/api/admin/fis/withholding/{id}/cancel` (capability anterior: «Interno»). | Sí | API-FIS-54 |
| `fis.service.calculateTaxes` | `fis.service.calculateTaxes(document)` | M04 (paso fiscal del motor, RN-TAR-167), M05 (emisión y recargos, RN-FAC-066), M11 (ventas, RN-VEN-025). Antes también M07: M07 no lo invoca; informa las retenciones sufridas con `cob.retention.received` (EVT-COB-10) | Cálculo de impuestos de un documento; API-FIS-42 queda como endpoint HTTP solo para simulación con `fis.impuestos.ver`. | Sí | API-FIS-42 (parte interna) |
| `fis.service.calculateWithholdings` | `fis.service.calculateWithholdings(paymentOrder)` | M12, M14 | Cálculo de retenciones de una OP; API-FIS-52 queda como endpoint HTTP con `fis.retenciones.calcular`. | Sí | API-FIS-52 (parte interna) |

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox)

| EVT-ID | Evento | Payload principal | Consumidores |
|---|---|---|---|
| EVT-FIS-01 | `fis.invoice.authorized` | `documentId`, `authorizationKind` (`cae`, `caea`, `cai`, `cesp`), `authorizationCode`, `caeExpiresAt`, `observations[]`, `qrData`, `barcodeData` (antes: `documentId`, kind, CAE/CAEA/CAI/CESP, vencimiento, observaciones, `qrData`, `barcodeData`; campos nombrados el 05-11-2026) | M05 (marca emitido, PDF, distribución), M07 (cobrable), M15 (asiento), M19 (publica), T10 |
| EVT-FIS-02 | `fis.authorization.rejected` | `documentId`, `errors[]{ code, message }`, `rejectionKind` (`dataError`, `sequenceOnly`), `pointOfSaleId`, `arcaCbteType`, `number`, `issueAttempt`, `lastAuthorizedNumber` (DEC-107; antes: `documentId`, `errors[]`; y antes de eso: `documentId`, códigos y mensajes; campos nombrados el 05-11-2026) | M05 (vuelve a borrador o a la cola, libera y renumera: RN-FAC-164; bandeja de lote), T09 (notificación a responsables) |
| EVT-FIS-03 | `fis.authorization.detained` | `documentId`, `prevalidationReasons[]` (antes: `documentId`, motivos de prevalidación; campos nombrados el 05-11-2026) | M05, M01 (corrección de datos), T09 |
| EVT-FIS-04 | `fis.authorization.uncertain` | `documentId`, `submissionId` | T06 (bandeja de operaciones), FIS JOB-FIS-04 |
| EVT-FIS-05 | `fis.authorization.reconciled` | `documentId`, `appliedChange`, `approvedBy` (antes: `documentId`, cambio aplicado, aprobador; campos nombrados el 05-11-2026) | M05, M15, auditoría |
| EVT-FIS-06 | `fis.caea.obtained` / `fis.caea.reported` | `period`, `order` (quincena 1 o 2), `pointOfSaleIds[]` (antes `pointsOfSale[]`; nombres de T11. Texto original: período, orden, puntos) | M05 (numeración en contingencia) |
| EVT-FIS-07 | `fis.contingency.activated` / `deactivated` | `pointOfSaleIds[]`, `reason` (antes `pointsOfSale[]`; nombres de T11. Texto original: puntos, motivo) | M05, T09 |
| EVT-FIS-08 | `fis.credential.expiring` / `expired` | `environment` (`homologation`, `production`), `daysLeft` (antes `daysToExpiry`; nombres de T11. Texto original: ambiente, días) | T09, T01 (salud del tenant) |
| EVT-FIS-09 | `fis.normativeVersion.published` | `tableCode`, `version`, `validFrom` (antes: tabla, versión, vigencia; campos nombrados el 05-11-2026) | Todos los tenants (bandeja de adopción) |
| EVT-FIS-10 | `fis.normativeAdoption.approved` | `tableCode`, `version`, `effectiveDate` (antes: tabla, versión, fecha efectiva; campos nombrados el 05-11-2026) | M04, M05, M12 (invalidan cachés) |
| EVT-FIS-11 | `fis.registry.activated` | `jurisdiction`, `regimeCode`, `validFrom`, `validTo` (antes `regime`; nombres de T11, que no lista `validTo`. Texto original: jurisdicción, régimen, vigencia) | M05 (validación de masiva) |
| EVT-FIS-12 | `fis.withholding.confirmed` / `cancelled` | `withholdingId`, `paymentOrderId`, `supplierId`, `withholdingTypeId`, `amount`, `currency`, `certificateNumber` (se agregan `withholdingId` y `currency` de T11; se conserva `withholdingTypeId`, nombre de T05, donde T11 dice `withholdingType`. Texto original: OP, proveedor, tipo, importe, certificado) | M12/M14 (neto), M15 (obligación) |
| EVT-FIS-13 | `fis.obligation.created` | `obligationId`, `legalEntityId`, `ownTaxObligationId` o `taxAgentRegistrationId` (exactamente uno), `regimeCode`, `period`, `amount`, `currency`, `dueDate`, `replacesObligationId` (si nace de un recálculo) (10-11-2026, DEC-095: se agregan `legalEntityId`, `ownTaxObligationId`, `taxAgentRegistrationId` y `replacesObligationId`, que M14 RF-TES-122 y M15 RN-CON-128 ya leían. Antes `obligationId`, `regimeCode`, `period`, `amount`, `currency`, `dueDate`; y antes `regime`; se agregaron `obligationId` y `currency`; nombres de T11. Texto original: régimen, período, importe, vencimiento) | M14 (pago), M15 (provisión M-137 si es propia), T09 |
| EVT-FIS-26 | `fis.obligation.cancelled` | `obligationId`, `legalEntityId`, `ownTaxObligationId` o `taxAgentRegistrationId`, `period`, `amount`, `currency`, `reason` (`manual`, `ownObligationRevoked`, `capitalBaseReopened`, `recalculated`), `replacedByObligationId` (si se recalculó), `cancellationStatus` (`pendingPaymentReconciliation` si la obligación estaba `ordered` y queda `cancellationPending`; `final` cuando queda `cancelled`), `creditBalanceAmount` (con `final`, si el pago se ejecutó igual) (nuevo 10-11-2026, DEC-095; RN-FIS-133 puntos 7, 8 y 9; `cancellationStatus` y `creditBalanceAmount` agregados en la ronda de cierre). Una obligación `ordered` publica el evento dos veces: con `pendingPaymentReconciliation` al pedirse la anulación y con `final` al resolverse; idempotencia por `{obligationId, cancellationStatus}`. M15 contabiliza solo el `final`. Un recálculo se publica como `fis.obligation.cancelled` de la anterior seguido de `fis.obligation.created` de la nueva con `replacesObligationId` | M15 (contraasiento de la provisión M-137, RN-CON-128), M14 (anula la ejecución de pago no ejecutada de la obligación), T09 |
| EVT-FIS-14 | `fis.filing.generated` / `submitted` / `accepted` / `rejected` | `filingId`, `regimeCode`, `period`, `isRectification` (antes `rectificationNumber`; se agrega `filingId`; nombres de T11. Texto original: régimen, período, rectificativa) | T09, auditoría, T10 |
| EVT-FIS-15 | `fis.vatLedger.closed` / `reopened` | `period`, `hash` (antes `snapshotHash`; nombres de T11. Texto original: período, hash) | M15, T10 |
| EVT-FIS-16 | `fis.thirdPartyCharge.collected` | `thirdPartyAgreementId`, `documentId`, `allocatedAmount`, `currency` (antes `agreementId`, `invoiceId`; nombres de T11. Texto original: convenio, documento, importe imputado) | M15 (pasivo) |
| EVT-FIS-17 | `fis.remittance.approved` / `paid` | `thirdPartyAgreementId`, `period`, `netAmount`, `currency` (antes `agreementId`, `netToRemit`; nombres de T11. Texto original: convenio, período, neto) | M14 (OP), M15 |
| EVT-FIS-18 | `fis.regulatoryReport.generated` / `submitted` | `regulatoryReportId`, `period` (antes `reportCode`; nombres de T11. Texto original: informe, período) | T09 |
| EVT-FIS-19 | `fis.padron.differenceDetected` | `personId`, `currentCondition`, `padronCondition` (antes `registryCondition`; nombres de T11. Texto original: persona, condición actual y de padrón) | M01, M12 |
| EVT-FIS-20 | `fis.taxCalculation.blocked` | `documentId`, `reasonCode` (`unmappedRate`, `taxWithoutBasis`, `expiredRegistry`) (antes `reason`; nombres de T11. Texto original: documento, motivo (alícuota sin mapeo, tributo sin fundamento, padrón vencido)) | M04, M05 |
| EVT-FIS-21 | `fis.authorization.globalFailure` / `globalRecovered` | `cause` (`credentialExpired`, `serviceUnavailable`, `pointOfSaleDisabled`), `scope` (`pointOfSaleIds[]` o `all`, como T11) (antes: causa (credencial vencida, servicio no disponible, punto de venta inhabilitado), alcance; campos nombrados el 05-11-2026) | M05 (pausa y reanuda lotes en fase de autorización), T09 |
| EVT-FIS-22 | `fis.misComprobantes.reconciled` | `period`, `supplierTaxId`, `reconciledCount`, `differenceCount` (antes `supplierCuit`, `matchedCount`, `diffCount`; nombres de T11. Texto original: período, CUIT del proveedor, comprobantes conciliados y con diferencia) | M12 (marca facturas de proveedor conciliadas con Mis Comprobantes de ARCA) |
| EVT-FIS-23 | `fis.withholdingComputation.updated` | `paymentOrderId` o `paymentExecutionId`, `withholdingsByRegime[]` (`regimeCode`, `base`, `amount`) (antes `executionId` y `regime`; nombres de T11. Texto original: orden de pago o ejecución, retenciones calculadas por régimen, base, importe) | M14 (actualiza `fiscalComputation` de la ejecución de pago) |
| EVT-FIS-24 | `fis.thirdPartyAgreement.published` | `agreementId`, `legalEntityId`, vigencia, `moraPolicy` (`includeInEligibleBalance`, `surcharge`, `allowServiceCut`, `cutNormativeRef.validationStatus`), conceptos | M08 (RN-MOR-141, RN-MOR-142: saldo elegible, recargos y restricción de corte), M05 (RF-FAC-120: convenio vigente), M15 (pasivo) |
| EVT-FIS-25 | `fis.regimeFile.requested` | `filingId`, `legalEntityId`, `regimeCode`, `period`, `storedFileIds[]` (se publica cuando una `regimeFilings` pasa a `approved` y el régimen se entrega por conector, §8.7; ronda de residuales 05-11-2026, PA-FIS-22) | T06 (entrega el archivo al organismo y registra el acuse; antes solo lo nombraba T06 como `fis.regime-file.requested`) |

### 12.2 Eventos consumidos

| Evento | Productor | Acción en FIS |
|---|---|---|
| `fac.invoice.issued`, `fac.creditNote.issued`, `fac.debitNote.issued` | M05 | Crea `fiscalAuthorizations` y encola; si el comprobante contiene conceptos por cuenta de terceros, registra `thirdPartyCharges` |
| `fac.invoice.annulled` | M05 | Pasa a `cancelled` si nunca se envió a ARCA; si ya se envió, rechaza la anulación y exige NC (RN de M05) |
| `fac.billingRun.issued` | M05 | Habilita el tablero de autorización del lote |
| `fac.invoice.returnedToDraft` (EVT-FAC-22) | M05 | Pasa a `cancelled` (`numberReleased`) las autorizaciones no enviadas del comprobante devuelto a la cola o a borrador; nunca toca una autorizada (DEC-107) |
| `fac.invoice.renumbered` (EVT-FAC-23) | M05 | Informativo: la reemisión llega como `fac.invoice.issued` con `issueAttempt` nuevo y crea otra autorización (DEC-107) |
| `cob.payment.confirmed` (EVT-COB-04) / `cob.allocation.reversed` (EVT-COB-06) | M07 | Libro IVA percibido; distribución a terceros; percepción en recargos |
| `cob.allocation.reversed` | M07 | Revierte distribución a terceros |
| `cmp.paymentOrder.prepared` / `.approved` / `.cancelled` (EVT-CMP-15/11/12) | M12 | Calcula, confirma o anula retenciones |
| `tes.paymentExecution.executed` (EVT-TES-15) / `tes.operation.posted` (EVT-TES-01) | M14 | Obligación o rendición pagada. Si la obligación está `cancellationPending`, pasa a `cancelled` con `creditBalanceAmount` = importe pagado (saldo a favor ante el organismo) y publica EVT-FIS-26 `final` (RN-FIS-133 punto 9; DEC-095, 10-11-2026) |
| `tes.paymentExecution.voided` (EVT-TES-15) | M14 | Si la obligación está `cancellationPending`, pasa a `cancelled` (`paymentConflict.resolution = paymentVoided`) y publica EVT-FIS-26 `final` (RN-FIS-133 punto 9; DEC-095, 10-11-2026) |
| `per.person.updated` / `per.taxId.verified` / `.mismatch` (EVT-PER-02/08), `cmp.supplier.updated` (EVT-CMP-01) | M01/M12 | Revalida comprobantes detenidos por datos fiscales |
| `per.person.identificationRegularized` (EVT-PER-27) | M01 | Revalida los comprobantes `detained` cuyo receptor tenía `identificationStatus = documentPending` (RF-FIS-043; DEC-099, 10-11-2026) |
| `con.entry.posted` (EVT-CON-01) | M15 | Conciliación de obligaciones |
| `ins.capitalBase.closed` / `ins.capitalBase.reopened` (EVT-INS-22) | M17 | Con `closed`, crea las obligaciones propias sobre el capital del período (o recalcula las anuladas por reapertura); con `reopened`, anula las no pagadas que usaron esa base (EVT-FIS-26) y las marca para revisión (RN-FIS-133 puntos 5 y 7; DEC-095, 10-11-2026) |
| `sue.payrollRun.closed` (EVT-SUE-13) | M16 | Datos para SICORE de sueldos y calendario |
| `pla.restore.completed` (EVT-PLA-14) | T01 | JOB-FIS-05 de recuperación (ESC-04) |
| `cfg.legalEntity.created` / `.updated` / `.deactivated` (EVT-CFG-19) | T04 | Crea el perfil fiscal en `draft`, pone en revisión ante cambio de CUIT o razón social, o cierra la vigencia (RN-FIS-131) |
| `cfg.branch.created` / `.updated` / `.deactivated` (EVT-CFG-20) | T04 | Revalida los puntos de venta de la sucursal; una sucursal inactiva no puede tener puntos de venta `active` sin reasignación (aviso en PAN-FIS-08) |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-FIS-01 | `fis:autorizar-cola` | Por evento y cada 1 min | Autorización CAE por par serializado (§9.2) |
| JOB-FIS-02 | `fis:renovar-ticket` | A demanda y preventivo cada 30 min | WSAA con lock distribuido |
| JOB-FIS-03 | `fis:probar-conector` | A demanda y cada 15 min (health) | `FEDummy`, TA y puntos |
| JOB-FIS-04 | `fis:conciliar-incierto` | Inmediato tras timeout y cada 5 min | `FECompConsultar` de inciertos |
| JOB-FIS-05 | `fis:conciliar-arca` | Diario 02:00 (zona del tenant) y tras restauración | Inconsistencias CAE/importe |
| JOB-FIS-06 | `fis:solicitar-caea` | N días antes de cada quincena | `FECAEAConsultar`/`Solicitar` |
| JOB-FIS-07 | `fis:informar-caea` | Diario y al cierre de quincena | `FECAEARegInformativo` y sin movimiento |
| JOB-FIS-08 | `fis:importar-padron` | — | **Retirado.** T04 guarda el padrón y T06 lo descarga (JOB-INT-25/26); M06 revalida con JOB-FIS-19. Ver JOB-CFG-08 (dueño). |
| JOB-FIS-09 | `fis:sincronizar-puntos-venta` | Diario | `FEParamGetPtosVenta` por tenant |
| JOB-FIS-10 | `fis:generar-libro-iva` | A demanda | Libro IVA ventas/compras |
| JOB-FIS-11 | `fis:generar-lid` | A demanda / mensual | Archivos Libro IVA Digital |
| JOB-FIS-12 | `fis:conciliar-mis-comprobantes` | A demanda | Cruce con ARCA |
| JOB-FIS-13 | `fis:generar-regimen` | A demanda / según calendario | Regímenes informativos |
| JOB-FIS-14 | `fis:calendario-fiscal` | Diario | Borradores y alertas de vencimientos |
| JOB-FIS-15 | `fis:rendicion-terceros` | Según convenio | Cálculo de rendiciones |
| JOB-FIS-16 | `fis:generar-informe-regulatorio` | A demanda / según calendario | Reguladores |
| JOB-FIS-17 | `fis:sincronizar-parametros-arca` | Evento EVT-INT-06 `int.arca.paramsSynced` (antes `int.arca.params-synced`) | Reacción: adopta las tablas `FEParamGet*` que trae T06. Ver JOB-INT-18 (dueño). |
| JOB-FIS-18 | `fis:alertas-credenciales` | Diario | Certificados, CAI, CESP, CAEA, padrones |
| JOB-FIS-19 | `fis:revalidar-condicion` | Mensual | Revalidación de padrón |
| JOB-FIS-20 | `fis:pasarela-importar` | Por carga / API | Modo pasarela |

Todos los jobs son idempotentes, reanudables, registran progreso por tenant y respetan límites de tasa por tenant y por servicio ARCA (AGR-020).

## 13. Integraciones

Marco general en **T06 INT** (conectores, reintentos, bandeja de operaciones detenidas, estado por conector y tenant, catálogo de fichas). Particularidades de M06:

| Ficha | Integración | Dirección / medio | Particularidades FIS | Ola |
|---|---|---|---|---|
| FIC 2.1 | ARCA WSAA + WSFEv1 | Saliente, SOAP/HTTPS | Certificado por tenant en bóveda; TA ~12 h con caché y lock; operaciones `FECAESolicitar`, `FECompUltimoAutorizado`, `FECompConsultar`, `FECompTotXRequest`, `FEDummy`, `FECAEASolicitar`, `FECAEAConsultar`, `FECAEARegInformativo`, `FECAEASinMovimientoInformar`, `FECAEASinMovimientoConsultar`, `FEParamGet*`; volumen de referencia ~12.500 comprobantes/mes por cooperativa; homologación y producción separadas | O4 |
| FIC 2.2 | ARCA padrón A13 y constancia de inscripción | Saliente, SOAP | Mismo TA por servicio; límite de tasa; WSPN3 reemplazado (PA-FIS-10) | O4 |
| FIC 2.3 | Regímenes informativos y libros digitales | Saliente, archivos TXT | Generación y registro de presentación humana; web service solo si existe y está habilitado | O8 (RG 3571 en O7 según PA-FIS-07) |
| FIC 2.4 | Mis Comprobantes | Entrante, CSV/Excel | Import con ExcelImportWizard | O8 |
| FIC 3.1 | Rentas Córdoba (IIBB, CVP, SIRCAR, padrón) | Entrante (padrones) y saliente (declaraciones) | Padrón mensual; CVP por punto y período; SIRCAR | O4 (padrón, CVP, percepción) / O8 (SIRCAR) |
| FIC 3.2 | Otras provincias (ARBA, ATER, Santa Fe, La Pampa, Río Negro) | Archivos | Cada jurisdicción es configuración (RF-FIS-092) | O8 (PA-FIS-09) |
| FIC 7 | Subsidios y tarifa social | Entrante/saliente | Cálculo y padrones de beneficiarios en M04; FIS solo informes ERSeP de tarifa social y RG 5746 | O7 |
| FIC 8.1 | ERSeP | Saliente, Excel/TXT | Circular 70/2021, consumos, pérdidas, servicios, DNU 311/2020, tarifa social | O7 |
| FIC 8.2 | ENARGAS / ENReGE | Saliente, TXT | SARI y FCU-DS; tablas maestras versionadas | O7 |
| FIC 8.3 | ENACOM | Saliente | Configuración de conceptos; informes vigentes | O7 |
| FIC 8.4 | Secretaría de Energía | Saliente | Energía y usuarios-generadores | O7 |
| FIC 9.1 | FECESCOR | Saliente, archivos de rendición | Rendición de terceros y tarjeta | O8 (PA-FIS-16) |
| FIC 9.2 | Rendición de tasas de terceros | Entrante (padrón de lo que hay que facturar) y saliente (rendición) | Convenios, importaciones de M05, rendición | O4/O5 |
| FIC 9.3 | EPEC (compra de energía) | — | Referencia a M12/M03; FIS consume el balance para el informe de pérdidas ERSeP | O7 |

Reglas operativas (AGR-021): estado observable por conector y tenant; causa accionable; errores públicos sin secretos; revocación y rotación de credenciales; cambios de formato detectados como nueva versión de tabla normativa; no se automatizan pantallas autenticadas de organismos ni se omiten controles oficiales (BASE §61).

## 14. Parámetros de configuración

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-FIS-001 | `fis.arca.endpoints` | objeto por ambiente | plataforma | URLs oficiales homologación/producción | URLs WSAA, WSFEv1, padrón | 2072, 2073 (Reemplazado: ya no por tenant) |
| PRM-FIS-002 | `fis.arca.demoHomologationOnly` | bool | plataforma | `true` | Tenants demo solo homologación | — (regla RN-03 §2.1) |
| PRM-FIS-003 | `fis.arca.credentialRef` | referencia | tenant | — | Certificado en bóveda | 2071 (Reemplazado: ruta de archivo) |
| PRM-FIS-004 | `fis.wsaa.renewBeforeMinutes` | int | plataforma | 30 | Renovación anticipada del TA | — |
| PRM-FIS-005 | `fis.wsaa.ticketWindowMinutes` | objeto | plataforma | `{gen: -10, exp: +10}` | Ventana del loginTicketRequest | — |
| PRM-FIS-006 | `fis.credential.alertDays` | lista int | tenant | `[30,14,7,3]` | Alertas de vencimiento | 2925 (automático) |
| PRM-FIS-007 | `fis.arca.timeoutSeconds` | int | plataforma | 90 | Timeout de clientes | — |
| PRM-FIS-008 | `fis.cae.batchSize` | int | plataforma/tenant | 100 (tope `FECompTotXRequest`) | Registros por request | — |
| PRM-FIS-009 | `fis.cae.autoAuthorize` | bool | tenant/punto | `true` | Autorizar automáticamente | 726 |
| PRM-FIS-010 | `fis.cae.syncWait` | objeto | tenant | `{enabled: true, seconds: 15}` | Espera sincrónica en venta/cobranza | 727 |
| PRM-FIS-011 | `fis.cae.pendingAlertDays` | int | tenant | 3 | Antigüedad de pendientes para alertar | — |
| PRM-FIS-012 | `fis.cae.rangeGrouping` | objeto | tenant | `{enabled: false, maxAmount: tabla normativa}` | Agrupación B/C en rango | 2712; 2427 (sin uso, Descartado) |
| PRM-FIS-013 | `fis.cf.identificationThreshold` | tabla normativa | plataforma | Valor vigente ARCA | Monto desde el cual se identifica al consumidor final | 2780 (Reemplazado: no hay CUIT genérico) |
| PRM-FIS-014 | `fis.cae.vatGroupingDecimals` | objeto | plataforma | `{group: 3, send: 2}` | Redondeo de alícuotas | — |
| PRM-FIS-015 | `fis.cae.closingAdjustmentMax` | decimal | plataforma | 0,03 | Ajuste de cierre al exento/neto | — |
| PRM-FIS-016 | `fis.fce.cbu` | texto | tenant | — | CBU para FCE (opcional 2101) | 2431 |
| PRM-FIS-017 | `fis.fce.alias` | texto | tenant | — | Alias para FCE (opcional 2102) | 2432 |
| PRM-FIS-018 | `fis.collectibility.blockIfOtherPending` | bool | tenant | `false` | No cobrable si la cuenta tiene otros pendientes de autorizar | 2769 |
| PRM-FIS-019 | `fis.reconciliation.arcaTolerance` | decimal | tenant | 0,02 | Tolerancia de importe contra ARCA | — |
| PRM-FIS-020 | `fis.arcaParams.syncFrequency` | cron | plataforma | semanal | Sincronización `FEParamGet*` | — |
| PRM-FIS-021 | `fis.caea.requestDaysBefore` | int | tenant | 5 | Anticipación de la solicitud | — |
| PRM-FIS-022 | `fis.caea.usage` | enum | tenant (acotado por tabla normativa) | `contingencyOnly` | Uso de CAEA | — (A validar PA-FIS-01) |
| PRM-FIS-023 | `fis.registry.offlineUpdateMode` | enum | tenant | `propose` | Actualización desde padrón offline | — |
| PRM-FIS-024 | `fis.fce.amountThreshold` | tabla normativa | plataforma | Valor vigente | Umbral FCE MiPyME | 2515 |
| PRM-FIS-025 | `fis.reconciliation.dailyScope` | enum | tenant | `all` | Conciliación diaria total o muestreo | — |
| PRM-FIS-026 | `fis.contingency.proposeAfterMinutes` | int | tenant | 30 | Caída de WSFE para proponer CAEA | — |
| PRM-FIS-027 | `fis.retry.backoff` | objeto | plataforma | `{minutes: [1,2,4,8,16]}` | Reintentos transitorios | — |
| PRM-FIS-028 | `fis.profile.*` | objeto | tenant | — | Datos de empresa (razón social, CUIT, domicilio, IIBB, situación IVA, condición IIBB, inicio de actividades, logo) | 518–527, 706, 709 |
| PRM-FIS-029 | `fis.person.defaultVatCondition` | ref | tenant | CF | Situación IVA por defecto de personas | 2086 |
| PRM-FIS-030 | `fis.iibb.cba.rn012017` | bool | tenant | según relevamiento | Liquidar percepciones IIBB según RN 01/2017 (Córdoba) | 757 |
| PRM-FIS-031 | `fis.iibb.minimumTaxable` | decimal | tenant/jurisdicción | tabla normativa | Mínimo imponible IIBB | 758 |
| PRM-FIS-032 | `fis.iibb.uncategorizedRate.publicServices` | decimal | tenant/jurisdicción | tabla normativa | Alícuota para no incluidos en el padrón de servicios públicos | 759 |
| PRM-FIS-033 | `fis.iibb.uncategorizedRate.otherServices` | decimal | tenant/jurisdicción | tabla normativa | Alícuota para no incluidos en el padrón de otros servicios | 760 |
| PRM-FIS-034 | `fis.iibb.ater.useArbaImporter` | bool | tenant | `false` | Importador ARBA para ATER (RN 208/24 y 234/24) | 2923 |
| PRM-FIS-035 | `fis.iibb.validateRegistryExpiry` | bool | tenant | `true` | Validar vencimiento del padrón (LUA) | 2699 |
| PRM-FIS-036 | `fis.person.defaultGrossIncomeCondition` | ref | tenant | — | Situación IIBB por defecto en cuentas | 2312 |
| PRM-FIS-037 | `fis.iibb.onLatePaymentInterest` | bool | tenant | `false` | Discriminar IIBB en interés entre vencimientos y recargo en caja | 2826 |
| PRM-FIS-038 | `fis.iibb.latePaymentConcept` | ref | tenant | — | Concepto de interés entre vencimientos (dueño M08) | 2080 |
| PRM-FIS-039 | `fis.person.alertInvalidCuit` | bool | tenant | `true` | Alertar CUIT incorrecto al confirmar ABM | 2979 |
| PRM-FIS-040 | `fis.gateway.enabled` | bool | tenant | `false` | Modo pasarela | — (modo "solo electrónica") |
| PRM-FIS-041 | `fis.gateway.csvSeparator` | texto | tenant | `;` | Separador CSV | 2497 |
| PRM-FIS-042 | `fis.gateway.folders` | — | — | — | Carpetas IN/OUT | 2082, 2083 (Reemplazado por API/carga) |
| PRM-FIS-043 | `fis.cvlp.excludePerceptions` | bool | tenant | `false` | No incluir percepciones en CVLP | 141 |
| PRM-FIS-044 | `fis.tax.vatTaxCode` | ref | tenant | — | Código de impuesto para IVA en informes y asientos | 543 |
| PRM-FIS-045 | `fis.vat.uncategorizedCondition` | ref | tenant | No categorizado ARCA (7) | Condición "no categorizado" | 544 |
| PRM-FIS-046 | `fis.suppliers.checkArca` | bool | tenant | `true` | Controlar proveedores con ARCA | 218 |
| PRM-FIS-047 | `fis.suppliers.openArcaIfExpired` | bool | tenant | `false` | Aviso/enlace a ARCA si la constancia del proveedor está vencida | 217 |
| PRM-FIS-048 | `fis.purchases.verifyCaeCai` | bool | tenant | `true` | Consultar CAE/CAI al cargar factura de compra | 2977 |
| PRM-FIS-049 | `fis.purchases.warnUnauthorizedByVat` | bool | tenant | `true` | Advertir comprobantes no autorizados según situación IVA | 2365 |
| PRM-FIS-050 | `fis.vatLedger.defaultCriterion` | enum | tenant | `invoiced` | Criterio por defecto | — |
| PRM-FIS-051 | `fis.vatLedger.billingFilter` | enum | tenant | `all` | Todos / solo mensual / solo diaria | 2605 |
| PRM-FIS-052 | `fis.lid.useFilterDate` | bool | tenant | `false` | Exportar LID según fecha del filtro | 2692 |
| PRM-FIS-053 | `fis.misComprobantes.tolerance` | decimal | tenant | 1,00 | Tolerancia de diferencias | — |
| PRM-FIS-054 | `fis.vatLedger.splitFinancedItems` | bool | tenant | `false` | Separar ítems financiados | 2972 |
| PRM-FIS-055 | `fis.vatLedger.collectedFullVat` | bool | tenant | `false` | En percibido informar total del IVA | 3110 |
| PRM-FIS-056 | `fis.vatLedger.separateCover` | bool | tenant | `false` | Carátula por separado | 2325 |
| PRM-FIS-057 | `fis.vatLedger.splitDocumentsDefault` | mixto | tenant | — | Valor por defecto para separar comprobantes | 832 |
| PRM-FIS-058 | `fis.vatLedger.dateType` | enum | tenant | `issue` | Tipo de fecha a mostrar (también en movimiento de conceptos y cuentas por cobrar) | 2476 |
| PRM-FIS-059 | `fis.vatLedger.purchasesCustomReport` | ref | tenant | — | Informe de libro IVA compras personalizado | 382 |
| PRM-FIS-060 | `fis.approval.dualControl` | bool | tenant | `true` | Doble control para adopciones y declaraciones | — |
| PRM-FIS-061 | `fis.purchases.untakenVatAsExpense` | bool | tenant | `false` | Registrar como gasto el IVA no tomado | 2890 |
| PRM-FIS-062 | `fis.purchases.vatPctBySection` | bool | tenant | `false` | Porcentaje de IVA en compras por sección del plan | 2902 |
| PRM-FIS-063 | `fis.installments.fiscalCredit` | bool | tenant | `false` | Generar crédito fiscal en factura en cuotas | 2930 |
| PRM-FIS-064 | `fis.rg3349.includeServiceConcepts` | bool | tenant | `false` | Incluir conceptos asociados en consumos relevantes | 2358 |
| PRM-FIS-065 | `fis.iibb.bsas.perceptionTaxCodes` | lista | tenant | — | Códigos de impuesto en archivo de percepciones BsAs | 2924 |
| PRM-FIS-066 | `fis.dgr.baseTaxCode` | ref | tenant | — | Código de impuesto para base imponible en archivo DGR | 2935 |
| PRM-FIS-067 | `fis.dgr.perceptionConcept` | ref | tenant | — | Concepto de percepción IIBB del archivo DGR | 2445 |
| PRM-FIS-070 | `fis.sicore.decimalComma` | bool | tenant | `false` | SICORE con coma decimal | 2991 |
| PRM-FIS-071 | `fis.sicore.internationalFormat` | bool | tenant | `false` | Formato internacional en retenciones de Ganancias | 2539 |
| PRM-FIS-072 | `fis.sircar.formatVersion` | ref | tenant | Versión vigente (tabla normativa) | Versión del diseño SIRCAR | — |
| PRM-FIS-080 | `fis.withholding.iibb.enabled` | bool | tenant | `false` | Aplica retención de IIBB | 2037 |
| PRM-FIS-081 | `fis.withholding.iibb.autoPrint` | bool | tenant | `false` | Imprimir retención IIBB automáticamente | 2038 |
| PRM-FIS-082 | `fis.withholding.vat.enabled` | bool | tenant | `false` | Aplica retención de IVA | 2039 |
| PRM-FIS-083 | `fis.withholding.vat.autoPrint` | bool | tenant | `false` | Imprimir retención de IVA | 2040 |
| PRM-FIS-084 | `fis.withholding.income.enabled` | bool | tenant | `false` | Aplica retención de Ganancias | 2041 |
| PRM-FIS-085 | `fis.withholding.income.autoPrint` | bool | tenant | `false` | Imprimir retención de Ganancias | 2042 |
| PRM-FIS-086 | `fis.withholding.socialSecurity.enabled` | bool | tenant | `false` | Aplica retención de Seguridad Social | 2043 |
| PRM-FIS-087 | `fis.withholding.reportingCutoffDay` | int | tenant | — | Día límite de presentación de retenciones | 2045 |
| PRM-FIS-088 | `fis.withholding.presumedVatPct` | decimal | tenant | 21 | IVA presunto en anticipos y no discriminados | 2310 |
| PRM-FIS-089 | `fis.withholding.skipInformalDocs` | bool | tenant | `false` | No retener en comprobantes no formales | 410 |
| PRM-FIS-090 | `fis.withholding.noAdvances` | bool | tenant | `false` | No permitir anticipos en retenciones | 409 |
| PRM-FIS-091 | `fis.withholding.importMinimumBase` | decimal | tenant | — | Base imponible mínima al importar retenciones de proveedores | 2542 |
| PRM-FIS-092 | `fis.withholding.regimeRequired` | bool | tenant | `true` | Código de régimen obligatorio en retenciones y percepciones | 2813 |
| PRM-FIS-093 | `fis.withholding.allowManualEdit` | bool | tenant | `false` | Permitir modificar manualmente las retenciones | 2836 |
| PRM-FIS-094 | `fis.withholding.customReport` | ref | tenant | — | Informe particularizado de retenciones (IVA compras) | 406 |
| PRM-FIS-095 | `fis.withholding.autoDraftFiling` | bool | tenant | `true` | Borrador automático de declaración al agregar retenciones | 2952 (Reemplazado: no presenta) |
| PRM-FIS-096 | `fis.withholding.iibb.certificatePos` | int | tenant | — | Punto de venta de certificados de retención IIBB | 2012 |
| PRM-FIS-097 | `fis.agent.*` | — | tenant | — | Nombre, domicilio, número y localidad del agente | 2008–2011 (en `taxAgentRegistrations`) |
| PRM-FIS-100 | `fis.ersep.companyCode` | texto | tenant | — | Código de empresa en ERSeP | 737 |
| PRM-FIS-101 | `fis.enargas.protocol` | enum | tenant | según relevamiento | Protocolo original (SARI) o FCU-DS | 2603 |
| PRM-FIS-102 | `fis.enargas.useMeterRegistration` | bool | tenant | `false` | Matrícula del servicio de gas como Id de usuario | 3174 |
| PRM-FIS-103 | `fis.enargas.perceptionConcept` | ref | tenant | — | Código de concepto de percepción | 2256 |
| PRM-FIS-104 | `fis.enargas.entityCode` | texto | tenant | — | Código de entidad | 2257 |
| PRM-FIS-105 | `fis.enargas.contractCode` | texto | tenant | — | Código de contrato de entidad | 2258 |
| PRM-FIS-106 | `fis.enargas.commissionMode` | texto | tenant | — | Modalidad de emisión de comisión | 2259 |
| PRM-FIS-107 | `fis.enargas.commissionValue` | decimal | tenant | — | Porcentaje/importe de comisión | 2260 |
| PRM-FIS-108 | `fis.enargas.excessConsumptionCode` | int | tenant | — | Código para diferenciar consumos excedentes | 2728 |
| PRM-FIS-109 | `fis.enargas.subdistributor` | int | tenant | — | Subdistribuidor de gas natural | 2254 |
| PRM-FIS-110 | `fis.ersep.dnu311.instances` | refs | tenant | — | Instancias inicial y final de mora para el informe DNU 311/2020 (dueño M08) | 2203, 2204 |
| PRM-FIS-111 | `fis.fecescor.branchNumber` | int | tenant | — | Número de sucursal FECESCOR | 68 |
| PRM-FIS-112 | `fis.fecescor.batchNumber` | int | tenant | — | Número de lote del archivo | 3039 |
| PRM-FIS-113 | `fis.fecescor.cardPaymentOnline` | bool | tenant | `false` | Pago de resumen de tarjeta FECESCOR en canal web (M19/M07) | 3096 |
| PRM-FIS-114 | `fis.fecescor.thirdPartyEntity` | ref | tenant | — | Entidad de terceros FECESCOR | 3114 |
| PRM-FIS-115 | `fis.fecescor.emails` | lista | tenant | — | Correos para archivos de cobranza de tarjeta | 3158 |
| PRM-FIS-116 | `fis.fecescor.propertyCode` | int | tenant | — | Código de propiedad de cobranza de tarjeta | 3190 |
| PRM-FIS-117 | `fis.thirdParty.printModel` | enum | tenant | — | Modelo de impresión de facturas de terceros (ej. datos extra OSSE; dueño M05) | 2081 |
| PRM-FIS-118 | `fis.thirdParty.amaConcept` | ref | tenant | — | Concepto para cuotas por cuenta y orden de A.M.A. | 2284 |
| PRM-FIS-119 | `fis.thirdParty.pharmacyHolder` | ref | tenant | — | Titular para facturas de farmacia a consumidor final | 2721 |
| PRM-FIS-120 | `fis.accounts.*` | refs a plan de cuentas | tenant | — | IVA inscripto (2104), IVA no inscripto (2105), percepciones en productos (2106), percepciones no categorizados (2107), IVA crédito fiscal (2113), devengamiento de IVA en refinanciaciones (2125), retenciones en tesorería (2136), ventas – cuentas de percepción de productos (2160) | 2104–2107, 2113, 2125, 2136, 2160 |
| PRM-FIS-121 | `fis.einvoice.sendFlagDefault` | bool | tenant | `false` | Permitir marcar "enviar factura electrónica" en cuentas (dueño M05/M19) | 2642 |
| PRM-FIS-122 | `fis.capitalContribution.exposure` | enum (`untaxedInInvoice`, `outsideFiscalDocument`) | tenant | `untaxedInInvoice` | Exposición del aporte de capital: no gravado en el comprobante (`ImpTotConc`) o fuera del comprobante fiscal (RN-FIS-124; HUECO-CAP-04). Default propuesto; **requiere validación legal** antes de habilitar en producción. | — |
| PRM-FIS-123 | `fis.burialRight.defaultFiscalMoment` | enum (`perInstallment`, `atAcquisition`) | tenant | `perInstallment` | Momento fiscal por defecto de la adquisición financiada del derecho de sepultura (RN-FIS-125) | — |
| PRM-FIS-124 | `fis.guaranteeDeposit.exposure` | enum (`untaxedInInvoice`, `outsideFiscalDocument`) | tenant | `untaxedInInvoice` | Exposición del depósito en garantía: no gravado en el comprobante (`ImpTotConc`) o fuera del comprobante fiscal (RN-FIS-128; HUECO-OTR-04) | — |
| PRM-FIS-125 | `fis.vat.supplyUsageCondition.enabled` | bool | tenant y servicio | `false` | Activa la condición por uso del suministro en `vatRateMatrix` (`supplyUsageClasses[]`, antes `supplyUsageIds[]`; RF-FIS-079, RN-FIS-073). Se enciende solo con la confirmación del contador sobre el 27 % a responsables inscriptos según el uso (DEC-102; PA-FIS-26) | — |

**Parámetros revisados y asignados a otros anexos (no fiscales):** 700, 701, 704, 705, 711, 712, 1024, 2210, 2245, 2413, 2414 ("retención" de prepaga = porción de compra prepaga aplicada a deuda → M03/M07); 650 (medio de pago "Retenciones" → M07); 2611 (año calendario de Ganancias de sueldos → M16); 1010 y 2915 (precio con IVA en ventas/presupuestos → M11); 813 (comisiones IVA diferencial de tarjetas → M14); 2549 (punto de venta 0 → M05); 2343, 2421, 2529 (certificado de instalación → M10); 2931 (certificados de firma digital → T11); 3160 (certificado SMTP → T08); 2362 (firma de OP por caja → M14); 2296, 2798, 2804 (CUIT de SIRO/Roela → M07); 510 (prefijo de cuentas de ganancias contables → M15); 2019, 2791 (compras → M12); 2089 (concepto de interés de venta → M08).

## 15. Reportes, indicadores y exportaciones

| Reporte / indicador | Fórmula y contenido | Universo | Fecha de corte |
|---|---|---|---|
| Libro IVA Ventas (todos los tipos de RF-FIS-113) | Por comprobante: no gravado, exento, gravado por alícuota, IVA por alícuota, percepciones, otros tributos, total; signo según débito/crédito | Comprobantes fiscales autorizados (y cobros para percibido) del tenant | Período fiscal; fecha de emisión o vencimiento según filtro; snapshot al cierre |
| Carátula del libro | Σ débito/crédito, gravado e IVA por condición y alícuota; LQSP aparte | Ídem | Ídem |
| Libro IVA Compras | Gravado, no gravado, exento, IVA por alícuota, percepciones sufridas | Comprobantes de compra de M12 | Fecha de registro contable del período |
| Posición mensual de IVA (insumo para el contador) | IVA débito − IVA crédito − percepciones/retenciones de IVA sufridas | Libros cerrados | Fin del período |
| Percepciones practicadas | Σ por régimen, jurisdicción, cuenta, CUIT y comprobante | Líneas de percepción de comprobantes autorizados | Período |
| Retenciones practicadas | Σ por tipo, régimen, proveedor, período de información | `withholdingsApplied` confirmadas | Período de información |
| Retenciones sufridas | Σ por tipo y agente | Registros de M07 | Fecha del cobro |
| Bases por jurisdicción (Convenio Multilateral) | Σ bases imponibles y percepciones por jurisdicción | Comprobantes autorizados | Período |
| Tablero de autorizaciones | Cantidad e importe por estado, punto y tipo; tiempo medio de autorización; % rechazo; inciertos abiertos | `fiscalAuthorizations` | Tiempo real; corte diario |
| Conciliación ARCA | Comprobantes con CAE/importe distinto o inexistente | Rango o período | Fecha de ejecución |
| Conciliación Mis Comprobantes | Tres listados (inexistente en CoopApps, inexistente en ARCA, diferencias) | Período | Archivo importado |
| Rendición por convenio | Facturado, cobrado, comisión, neto a rendir, pendiente de cobro | `thirdPartyCharges` | Período del convenio |
| Impuestos facturados por categoría | Σ por servicio, categoría e impuesto con selección guardada | Comprobantes autorizados | Período |
| Calendario y cumplimiento | Declaraciones por estado (a tiempo, vencidas, rechazadas, rectificadas) | `regimeFilings`, `regulatoryReportRuns` | Fecha de vencimiento |
| Vencimientos de credenciales y autorizaciones | Certificados, CAI, CESP, CAEA y padrones por días a vencer | Tenant | Diario |
| Informe de padrón | Diferencias de condición IVA/monotributo/IIBB | Personas activas | Fecha del padrón |

Exportaciones: XLSX/CSV/PDF desde DataTable; archivos normados de la sección 5.13 y 5.15. Contrato semántico (AGR-022): "facturado fiscal" = comprobantes autorizados (no incluye detenidos ni inciertos); "percibido" = cobros imputados del período.

## 16. Casos de uso

### CU-FIS-01 — Retención en un pago a proveedor (BASE §61, original)

**Actor:** responsable de pagos (M14) y responsable fiscal del tenant.
**Precondición:** TEN-001 con condición de agente de retención registrada (`taxAgentRegistrations`) y el régimen REG-DEMO configurado como "pendiente de configuración real" (solo homologación/demo); proveedor PROV-DEMO-001 sin exclusión vigente.

1. M12 registra la obligación con PROV-DEMO-001 y M14 prepara la OP por ARS 100.000.
2. M14 invoca `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`; §9.8); FIS aplica la configuración validada y determina ARS 2.000 (RET-DEMO-001, estado `calculated`) con traza en `taxCalculationTraces`.
3. Al aprobarse la OP, FIS confirma la retención (`confirmed`), emite el certificado interno con numeración propia (sin inventar número oficial) y publica `fis.withholding.confirmed`; M14 registra pago neto ARS 98.000; FIS crea `taxObligations` por ARS 2.000 con vencimiento según `fiscalDeadlines`.
4. Si el régimen tiene mecanismo oficial de certificado, se tramita por ese medio y se guarda la referencia oficial cuando se obtiene.
5. Al cierre del período, JOB-FIS-13 incluye RET-DEMO-001 en DDJJ-DEMO-001; el responsable valida, aprueba (MFA), presenta fuera del sistema y adjunta el acuse; el estado pasa a `submitted` y luego `accepted` o `rejected`.
6. M14 paga ARS 2.000 al organismo; M15 concilia la cancelación; la obligación queda `paid`.

**Control:** exportar el archivo no marca `submitted`; emitir la instrucción de pago no marca `paid`; reintentar la OP no genera otra retención (idempotencia por OP + tipo + régimen); un rechazo conserva la evidencia y habilita la rectificativa (CU-FIS-10).

### CU-LOT-01 — Validación fiscal de la factura A en un lote (BASE §69, original; parte fiscal)

- **Definición:** el CU-LOT-01 se define en M05 §16 (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición.

**Actor:** responsable de facturación (M05) y corrector de datos de clientes (M01).

1. M05 prefactura LOTE-AG-DEMO-001 (100 casos) e invoca la prevalidación fiscal de FIS (RF-FIS-041/043) para cada caso.
2. FIS devuelve `FISCAL_TAXID_MISSING` para ITEM-099 (Factura A sin CUIT válido): no autoriza, no cambia la clase del comprobante y no fuerza consumidor final (CTR-FIS-04).
3. Se emiten 98; FIS autoriza 98 en `FECAESolicitar` (tandas por par tipo/punto); si alguna vuelve con observación, queda `authorizedWithObservations` y M05 la discrimina.
4. El corrector carga el CUIT; FIS lo valida contra padrón (RF-FIS-016) y la condición IVA queda con evidencia.
5. M05 reprocesa ITEM-099 en `LOTE-AG-DEMO-001-R1`; FIS lo autoriza con su propio `idempotencyKey`; el total queda en 99 autorizados y 0 duplicados (ITEM-100 es técnico y no pasa por FIS).

### CU-10 — Emisión y autorización de una factura (BASE §10, original; parte fiscal)

- **Definición:** el CU-10 se define en M05 §16 (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición.

FAC-DEMO-001 por ARS 13.000 se emite en M05; FIS la autoriza con CAE, publica `fis.invoice.authorized` con QR y vencimiento del CAE; M05 genera el PDF y la pone a disposición del titular. Si la respuesta es incierta, FIS consulta (`FECompConsultar`) antes de reintentar (RN-FIS-040).

### CU-MER-01 — Usuario-generador con energía inyectada (BASE MER-001/MER-002, original; parte fiscal)

- **Definición:** el CU-MER-01 se define en M03 §16; M03 lo marca "MER-001, original" (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición.

Un asociado ficticio demanda 300 kWh e inyecta 120 kWh. M04 liquida demanda e inyección; FIS arma la LQSP con los datos fiscales de energía inyectada de RG 5746/2025 (RF-FIS-073), valida el CESP vigente (RF-FIS-071/072) y los incluye en RG 3571/RCSP (RF-FIS-128) y en el informe a la Secretaría de Energía (RF-FIS-147). El crédito del período siguiente lo administra M07.

### CU-FIS-02 — Habilitación fiscal de un tenant nuevo

**Actor:** responsable fiscal del tenant; soporte de plataforma (sin ver secretos).
1. Completa el relevamiento fiscal (PAN-FIS-03, BASE §52.4) y el perfil del emisor (PAN-FIS-04).
2. Genera la clave y el CSR dentro de la plataforma (RF-FIS-025), obtiene el certificado en ARCA fuera del sistema, lo sube y asocia el servicio `wsfe` y el padrón.
3. Prueba en homologación con JOB-FIS-03 (`FEDummy`, TA, último autorizado) y adopta las tablas normativas iniciales (RF-FIS-002).
4. Sincroniza los puntos de venta habilitados (JOB-FIS-09) y configura modalidad por punto (CAE, CAEA, CAI, CESP).
5. Solicita el pase a producción; requiere aprobación con doble control (`PRM-FIS-060`).
**Resultado:** el tenant queda habilitado fiscalmente solo en el ambiente probado (credencial `active` y punto de venta con modalidad configurada); otro tenant no ve sus credenciales ni su estado.

### CU-FIS-03 — Respuesta incierta durante la autorización

Durante el envío de 50 comprobantes de Factura B 0002 se corta la conexión tras el envío. La tanda queda `uncertain`; JOB-FIS-04 ejecuta `FECompUltimoAutorizado` y `FECompConsultar` por cada número; 50 resultan autorizados en ARCA y se registran con su CAE sin segundo `FECAESolicitar`. Si alguno no existe en ARCA y el último autorizado es menor, se reintenta con la misma numeración; nunca se renumera.

### CU-FIS-04 — Contingencia con CAEA

WSFE no responde durante más de `PRM-FIS-026` minutos. FIS propone activar contingencia; el responsable la aprueba; M05 emite con el CAEA vigente de la quincena; al restablecerse, JOB-FIS-07 informa los comprobantes con `FECAEARegInformativo` y, para los puntos sin movimiento, `FECAEASinMovimientoInformar`; los rechazos del informe abren excepción y alerta.

### CU-FIS-05 — Adopción de una nueva versión de tabla normativa

La plataforma publica la versión 2 de la tabla de alícuotas de IVA con fuente y vigencia. TEN-001 recibe la notificación, revisa diferencias (PAN-FIS-02), el responsable fiscal la adopta con fecha efectiva 01/12/2026 y un segundo usuario la aprueba. Los comprobantes con fecha anterior siguen usando la versión 1; los posteriores, la 2; las cachés de M04, M05 y M12 se invalidan por `fis.normativeAdoption.approved`.

### CU-FIS-06 — Percepción de IIBB con padrón por CUIT

Se importa el padrón ficticio de noviembre de 2026 de Rentas Córdoba con 3 registros (formato validado, vigencia del mes). Una factura a un responsable inscripto incluido en el padrón con alícuota ficticia 2,5 % sobre neto ARS 40.000 percibe ARS 1.000; otra a un no incluido aplica la alícuota de no incluidos (`PRM-FIS-032`); un exento con certificado vigente no percibe. Cada cálculo deja traza con versión del padrón.

### CU-FIS-07 — Comprobante detenido por alícuota sin mapeo

Un producto con IVA 19 % (porcentaje no existente) llega a la cola. FIS no descarta la alícuota (CTR-FIS-07): detiene el comprobante con `fis/prevalidation-failed`, publica `fis.taxCalculation.blocked` y M05 lo muestra en su bandeja; corregido el producto, se emite NC/refacturación en M05 según su estado.

### CU-FIS-08 — Libro IVA Ventas y Libro IVA Digital del período

El contador genera el Libro IVA Ventas de octubre de 2026 (criterio facturado), revisa la carátula, genera los archivos LID, ejecuta el análisis por línea y correlatividad (RF-FIS-121) que informa el rango faltante `B 0002 00001099–00001100`, corrige (eran comprobantes `uncertain` ya conciliados), regenera, cierra el período con snapshot y presenta fuera del sistema; adjunta el acuse.

### CU-FIS-09 — Conciliación con Mis Comprobantes

Importa el CSV de emitidos de ARCA del período. Resultado: 0 inexistentes en CoopApps, 1 inexistente en ARCA (comprobante `uncertain` pendiente) y 1 con diferencia de ARS 3 en neto (sobre la tolerancia de ARS 1). El usuario abre la diferencia, identifica el redondeo y la documenta; la conciliación queda `reviewed`.

### CU-FIS-10 — Rectificación de una declaración rechazada (RG 3571)

DDJJ RG 3571 de septiembre de 2026 queda `rejected` con el acuse adjunto. El responsable genera una rectificativa vinculada (versión 2), corrige los registros observados, la valida, aprueba con MFA y registra la presentación. La original se conserva `rectified`; ambas quedan en el expediente del período.

### CU-FIS-11 — Rendición de una tasa por cuenta de terceros

Convenio CONV-DEMO-001 con el municipio ficticio "Municipalidad Demo" por tasa de alumbrado (ARS 500 por factura) y comisión ficticia 3 %. En octubre se facturan 1.000 cargos (ARS 500.000) y se cobran 900 (ARS 450.000). La rendición calcula comisión ARS 13.500 y neto ARS 436.500; se aprueba, M14 genera la OP y, al pagarse, la rendición pasa a `paid`. Un pago parcial de una factura con tasa se imputa según la política (PA-FIS-05).

### CU-FIS-12 — Informe ERSeP del período

El responsable regulatorio genera el archivo de la Circular 70/2021 de octubre de 2026 con el código de empresa configurado (`PRM-FIS-100`), valida totales contra el Libro IVA del mismo período, aprueba y registra la presentación con acuse.

### CU-FIS-13 — Paquete ENARGAS FCU-DS

Para un tenant con gas, el responsable genera el paquete FCU-DS del mes: FIS usa las tablas maestras de la versión adoptada, mapea categorías con `regulatoryConceptMaps`, genera los archivos con los nombres del protocolo y el reporte de control (cantidad de usuarios, m³ y facturado) que debe coincidir con M05.

### CU-FIS-14 — Comprobantes de administración pública

Se seleccionan las facturas impagas del período de las cuentas de un organismo público ficticio, se guarda la selección (reemplazando la anterior del mismo período sin duplicar) y M07 las cobra en bloque desde la vista para caja.

### CU-FIS-15 — Autorización en modo pasarela

Un sistema externo del tenant envía por `POST /api/v1/ext/fis/documents` un comprobante con `Idempotency-Key`; FIS valida duplicados y datos fiscales con las mismas reglas del modo completo, lo autoriza y devuelve el CAE; el reenvío con la misma clave devuelve el mismo resultado sin nuevo CAE.

### CU-FIS-16 — Revalidación periódica de padrón

JOB-FIS-19 revalida 1.200 personas; detecta 4 cambios de condición IVA (2 a monotributo, 2 a responsable inscripto). Genera el informe de diferencias; el responsable aprueba 3 y rechaza 1 con motivo; M01/M12 actualizan; los comprobantes futuros usan la condición nueva; ningún comprobante emitido cambia.

### CU-FIS-17 — Recuperación tras restauración (ESC-04)

Se restaura una copia de las 10:00; ARCA tiene comprobantes autorizados a las 10:30. Al reanudar, JOB-FIS-05 consulta el último autorizado por par y recupera los CAE posteriores sin reenviar; los comprobantes que ya no existen localmente se marcan como incidente para reconstrucción con M05 y no se renumeran.

## 17. Criterios de aceptación y escenarios de prueba

Los escenarios de esta sección se numeraban 1 a 48 sin ID. Desde la corrección del 05-11-2026 llevan el ID `ESC-FIS-nn` con el mismo número (escenario *n* = `ESC-FIS-nn`); las citas externas por número (por ejemplo, AC-06 de `docs/entregables-analisis-diseno/07-estrategia-pruebas.md`, que cita el "Escenario 32") corresponden a `ESC-FIS-32`.

### 17.1 Funcionales

| ESC-ID | Escenario | Resultado esperado | Requisitos |
|---|---|---|---|
| ESC-FIS-01 (antes escenario 1) | Autorizar 100 comprobantes B del mismo par | 100 CAE; numeración correlativa; 1 request si `FECompTotXRequest` ≥ 100 | RF-FIS-039 a 050 |
| ESC-FIS-02 (antes escenario 2) | Factura A a receptor sin CUIT | Detenida en prevalidación; no se cambia a B ni a CF; excepción en M05 | RF-FIS-041, RN-FIS-045, CTR-FIS-04 |
| ESC-FIS-03 (antes escenario 3) | Comprobante B a CF sobre el umbral de identificación sin documento | Detenido; mensaje accionable | RN-FIS-026, CTR-FIS-03 |
| ESC-FIS-04 (antes escenario 4) | Receptor con condición IVA no válida para la clase (error 10242/10243 simulado) | Rechazado y detenido para corrección; sin reintento con CF | RN-FIS-045 |
| ESC-FIS-05 (antes escenario 5) | Alícuota no mapeada | Detenido, nunca descartada | RN-FIS-034, CTR-FIS-07 |
| ESC-FIS-06 (antes escenario 6) | Tributo IIBB con Id de mapeo explícito | `Tributo.Id = 7` (percepción IIBB) independientemente del código interno | RN-FIS-035, CTR-FIS-01 |
| ESC-FIS-07 (antes escenario 7) | Observaciones de ARCA en un comprobante de una tanda | Observaciones asignadas a ese comprobante y no a la tanda | CTR-FIS-08 |
| ESC-FIS-08 (antes escenario 8) | CAEA vencido el día de su vencimiento | Utilizable hasta el fin del día de vencimiento; al día siguiente no | CTR-FIS-05 |
| ESC-FIS-09 (antes escenario 9) | CESP nuevo contenido dentro de otro | Rechazado | RF-FIS-071, CTR-FIS-06 |
| ESC-FIS-10 (antes escenario 10) | Total de comprobante ARS 0,02 | Todo exento; ajuste trazado | RN-FIS-037 |
| ESC-FIS-11 (antes escenario 11) | Retención con mínimo no superado | Retención cero con traza del motivo | RF-FIS-100 |
| ESC-FIS-12 (antes escenario 12) | Libro IVA con NC del período | NC con signo negativo; totales cuadran con autorizados | RF-FIS-115 |
| ESC-FIS-13 (antes escenario 13) | Percepciones en informe del libro | Incluye todas las percepciones, no solo IVA | RN-FIS-094, CTR-FIS-09 |
| ESC-FIS-14 (antes escenario 14) | Archivo LID con hueco de numeración | Informe de rango faltante completo | RF-FIS-121 |
| ESC-FIS-15 (antes escenario 15) | Conciliación ARCA con alícuota 10,5 % y 21 % | Compara todas las alícuotas | CTR-FIS-13 |
| ESC-FIS-16 (antes escenario 16) | Rendición de terceros con pago parcial | Imputación según política vigente; el tercero recibe solo lo cobrado | RF-FIS-138, RF-FIS-139 |
| ESC-FIS-17 (antes escenario 17) | Declaración generada sin acuse | Estado `generated`/`approved`; nunca `submitted` | RF-FIS-127 |
| ESC-FIS-18 (antes escenario 18) | Tabla normativa publicada no adoptada | No se aplica en producción; aviso en tablero | RF-FIS-002 |
| ESC-FIS-19 (antes escenario 19) | Padrón IIBB vencido con `PRM-FIS-035` activo | Cálculo bloqueado con `fis.taxCalculation.blocked` | RN-FIS-080 |
| ESC-FIS-20 (antes escenario 20) | Modo pasarela con comprobante ya autorizado reenviado | Devuelve el CAE existente; no reemplaza | RF-FIS-155 |

### 17.2 Permisos negativos

| ESC-ID | Escenario | Resultado |
|---|---|---|
| ESC-FIS-21 (antes escenario 21) | Operador de facturación sin `fis.arca.configurar` intenta subir certificado | 403 `fis/forbidden`; auditoría del intento |
| ESC-FIS-22 (antes escenario 22) | Usuario que generó una declaración intenta aprobarla con doble control activo | Rechazado: segregación de funciones |
| ESC-FIS-23 (antes escenario 23) | Aprobar o presentar sin MFA reforzado | Solicita MFA; sin él, no avanza |
| ESC-FIS-24 (antes escenario 24) | Soporte de plataforma intenta ver la clave privada o el TA | No existe endpoint que la devuelva; solo metadatos (huella, vencimiento) |
| ESC-FIS-25 (antes escenario 25) | Tenant intenta editar una tabla normativa de plataforma | 403; solo puede adoptar o pedir revisión |
| ESC-FIS-26 (antes escenario 26) | Auditor intenta reabrir un Libro IVA cerrado | 403 |

### 17.3 Aislamiento de tenant

| ESC-ID | Escenario | Resultado |
|---|---|---|
| ESC-FIS-27 (antes escenario 27) | TEN-002 consulta un `fiscalAuthorizations` de TEN-001 por id | 404 (no revela existencia) |
| ESC-FIS-28 (antes escenario 28) | Caché de TA | Clave por (tenant, CUIT, servicio, ambiente); TEN-002 nunca usa el TA de TEN-001 |
| ESC-FIS-29 (antes escenario 29) | Job de autorización con dos tenants | Colas y límites de tasa separados; la caída de uno no frena al otro |
| ESC-FIS-30 (antes escenario 30) | Exportación de libro IVA | Solo datos del tenant; archivo en almacenamiento privado con URL firmada de corta duración |
| ESC-FIS-31 (antes escenario 31) | Tenant demo intenta producción | Bloqueado por `PRM-FIS-002` |

### 17.4 Reintentos, idempotencia y conciliación

| ESC-ID | Escenario | Resultado |
|---|---|---|
| ESC-FIS-32 (antes escenario 32) | Timeout tras enviar | `uncertain`; consulta antes de reintentar; 0 duplicados (CU-FIS-03) |
| ESC-FIS-33 (antes escenario 33) | ARCA no disponible (error transitorio) | Reintentos con backoff `PRM-FIS-027`; al agotarlos, `fis.authorization.globalFailure` y pausa de lotes en M05 |
| ESC-FIS-34 (antes escenario 34) | Certificado vencido | Sin envíos; `fis.credential.expired`; tablero rojo; ningún comprobante cambia de estado |
| ESC-FIS-35 (antes escenario 35) | Dos workers toman el mismo par | Lock por (tenant, punto, tipo); el segundo espera |
| ESC-FIS-36 (antes escenario 36) | Reintento de `POST` con mismo `Idempotency-Key` | Misma respuesta |
| ESC-FIS-37 (antes escenario 37) | Conciliación diaria con CAE distinto en ARCA | Incidencia `toReconcile`; resolución con aprobación y evento `fis.authorization.reconciled` |
| ESC-FIS-38 (antes escenario 38) | Retención: OP reintentada | Una sola retención |
| ESC-FIS-39 (antes escenario 39) | Rendición recalculada | Misma rendición en borrador; una aprobada no se recalcula (se ajusta en la siguiente) |
| ESC-FIS-40 (antes escenario 40) | Aporte de capital en el comprobante (HUECO-CAP-04) | Servicio ARS 10.000 + IVA 21 % + aporte ARS 1.500 (ficticios): `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 1.500, total 13.600; percepciones e IIBB sobre 10.000; con PRM-FIS-122 = `outsideFiscalDocument` el aporte no viaja a ARCA (RN-FIS-124) |
| ESC-FIS-41 (antes escenario 41) | Derecho de sepultura sin caso fiscal (HUECO-CEM-01) | M04 no puede publicar la versión del derecho; con el caso adoptado, cada cuota lleva la clase del concepto "adquisición" y el diferimiento contable de M15 no cambia el comprobante (RN-FIS-125) |
| ESC-FIS-42 (antes escenario 42) | Clasificación en migración (HUECO-TAS-03) | Fila de `IMPUESTO` con `ORIGEN` municipal y convenio vigente ⇒ `thirdPartyCharge`; con régimen de percepción provincial ⇒ `perception`; sin organismo ni convenio ⇒ `pendingClassification`, no publicable (RN-FIS-126) |
| ESC-FIS-43 (antes escenario 43) | Saldo de terceros en mora (HUECO-TAS-02) | ARS 9.000 propios + ARS 1.000 de alumbrado vencidos: saldo elegible de mora 9.000 por defecto; 10.000 con `includeInEligibleBalance = true`; sin `surcharge` no hay interés sobre los 1.000 (RN-FIS-127) |
| ESC-FIS-44 (antes escenario 44) | Depósito en garantía (HUECO-OTR-04) | Servicio ARS 10.000 + IVA 21 % + depósito ARS 50.000 (ficticios): `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 50.000, total 62.100; percepciones sobre 10.000; la devolución del depósito no genera NC fiscal (RN-FIS-128) |
| ESC-FIS-45 (antes escenario 45) | Corte por deuda de terceros (HUECO-ALU-01) | Cuenta que solo debe ARS 1.000 de alumbrado: con `allowServiceCut = false` o norma `pending` no entra en la lista de corte de M08; con `allowServiceCut = true` y norma `validated`, M08 puede considerarla; EVT-FIS-24 lleva ambas marcas (RN-FIS-129) |
| ESC-FIS-46 (antes escenario 46) | Dos entidades jurídicas (DEC-064) | LE-01 y LE-02 con PV 0001 cada una: un comprobante de LE-02 se autoriza con certificado y CUIT de LE-02, la caché de TA es separada y el Libro IVA de LE-01 no lo incluye; un comprobante de LE-02 con PV de LE-01 queda detenido con `legalEntityMismatch` (RN-FIS-130) |
| ESC-FIS-47 (antes escenario 47) | Cambio de razón social en T04 (RN-FIS-131) | `cfg.legalEntity.updated` cambia la razón social de LE-02: el perfil queda en revisión, los comprobantes nuevos de LE-02 quedan detenidos con `legalEntityProfileReview` y los ya autorizados conservan su `issuerSnapshot`; al aprobar la versión nueva se reanudan |
| ESC-FIS-48 (antes escenario 48) | Padrón de plataforma y de tenant (RN-FIS-132) | Padrón provincial público cargado por la plataforma y padrón del agente importado por TEN-001 para la misma jurisdicción: un CUIT ficticio presente en ambos usa la alícuota del padrón de TEN-001; TEN-002 solo ve el de plataforma |

### 17.5 Escenarios BASE

| ESC | Aplicación en M06 | Resultado esperado |
|---|---|---|
| ESC-01 | El excedente de ARS 2.000 de A no genera NC ni comprobante fiscal; si luego se aplica a una factura, el Libro IVA percibido toma el cobro en la fecha de imputación | Sin documento fiscal por un saldo a favor |
| ESC-02 | La corrección de ARS 12.000 a ARS 15.000 se emite como ND de ARS 3.000 vinculada; FIS la autoriza con comprobante asociado y la informa en el libro del período de la ND | Original intacto; ND con `CbtesAsoc` |
| ESC-04 | CU-FIS-17 | Sin reenvío ni renumeración |
| ESC-05 | Una adopción de alícuota con fecha efectiva en medio del período aplica a los comprobantes pendientes con fecha ≥ efectiva; los emitidos no se recalculan | Explicación del ajuste en la traza |
| ESC-03 | No aplica a M06 (instalación offline) | — |

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son inventados. No se usan CUIT reales, certificados reales, números oficiales de certificados de retención ni datos personales de la base DEMO de ProCoop. Los tenants demo operan solo en homologación (`PRM-FIS-002`); las CUIT de ejemplo se identifican con el texto `CUIT-DEMO-<n>` y el motor de validación las acepta solo en tenants demo.

| Elemento | Datos de precarga |
|---|---|
| Tablas normativas (plataforma) | Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios, productos y servicios), umbral de identificación de consumidor final (valor ficticio ARS 10.000.000 marcado "demo"), umbral FCE (valor ficticio), catálogo de regímenes informativos y de informes regulatorios; todas con fuente "demo", vigencia desde 01/01/2026 |
| Tenants | TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de demostración); TEN-002 "Cooperativa Demo Gas" (responsable inscripto, LQSP no aplicable); ambos con adopción aprobada de la versión 1 |
| Perfil fiscal | TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002` |
| Credenciales | TEN-001 con credencial `testing` en homologación (certificado de prueba autogenerado sin validez); TEN-002 con `pendingCertificate` para mostrar el asistente |
| Puntos de venta | TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) |
| Condiciones IVA y matriz | RI → A; exento, CF, monotributo y no categorizado → B; percepción IVA a no categorizado activa en TEN-001 |
| Impuestos | IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de terceros ARS 500; fondo provincial ficticio 1 % por cuenta de terceros |
| Padrón IIBB | REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) |
| Comprobantes en cola | FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero |
| CAEA | Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` |
| CESP | CESP-DEMO-001 para punto 0009 desde 01/11/2026 hasta 30/11/2026 |
| Retenciones | PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de Ganancias con 3 tramos |
| Declaraciones | DDJJ-DEMO-001 (retenciones, `approved`), DDJJ-RG3571-DEMO-2026-09 `rejected` con su rectificativa en `draft` (CU-FIS-10) |
| Libro IVA | Octubre 2026 cerrado con snapshot; noviembre 2026 abierto |
| Terceros | CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) |
| Reguladores | Configuración ERSeP con código de empresa `ERSEP-DEMO`; ENARGAS FCU-DS para TEN-002 con tablas maestras demo; ENACOM con un servicio de Internet configurado |
| Administración pública | Cuenta ficticia "Organismo Público Demo" con 3 facturas impagas de octubre |
| Calendario | Vencimientos ficticios de IVA, IIBB, SICORE, SIRCAR, RG 3571 y ERSeP del mes en curso |

## 19. Migración desde ProCoop

Ejecuta **T07 MIG** con herramientas repetibles; M06 define el destino, la transformación y la validación. Los secretos (certificados, claves y contraseñas de ProCoop) **no** se migran: cada tenant genera o carga su certificado en la bóveda (RF-FIS-025).

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| Variables 518–527, 706, 709 (datos de empresa) | `fiscalProfiles` | Normalización de CUIT y domicilio; validación contra padrón | CUIT válido; constancia consultada |
| Variables 2071–2073, 2925 | `arcaCredentials` (solo metadatos: ambiente y vencimiento informativo) | Ruta y URLs descartadas; se exige carga del certificado | Credencial `pendingCertificate` hasta cargar |
| Variables 2008–2011 | `taxAgentRegistrations` | Agrupación por régimen y jurisdicción | Revisión del responsable fiscal |
| Resto de variables de la sección 14 | `PRM-FIS-*` | Mapeo según columna "Origen V2" | Informe de parámetros sin destino = 0 |
| `PTOVENTA`, `COMPPOS` (flags) | `pointsOfSale` | `PAUSAR` → `paused`; modalidad por flags CAI/CAE/CAEA/CESP | Cruce con `FEParamGetPtosVenta` |
| `CESPAFIP` | `caeaPeriods` (CAEA = 1) y `cespAuthorizations` (CAEA = 0) | Separación; corrección de superposiciones con informe | Ninguna superposición tras migrar |
| `CVPIIBB` | `provincialValidationCodes` | Directo | Conteo por punto y período |
| `SITIVA` | `vatConditionSettings` | `AFIP_SIT` remapeado a la tabla ARCA (4 ↔ 5 corregido, CTR-FIS-02) | Cada condición con código ARCA válido; muestra de 20 comprobantes migrados con condición coincidente |
| `ALI_IVA`, `ALI_IVA_CF` | `vatRates`, `vatRateMatrix` | Porcentaje → Id ARCA por tabla normativa; cuentas contables a M15 | Ningún porcentaje sin Id |
| `IMPUESTO` | `taxDefinitions` | `ORIGEN` → nivel; Id de tributo ARCA por mapeo explícito validado (CTR-FIS-01) | Cada tributo con Id y fundamento |
| `CON_TASAS` | No migra a M06: `purchaseConcepts` de M12 (concepto de compra con tasa y columna del libro de compras; T05 COL-CMP-05, T07 §19.2, HUECO-TAS-03) | Solo una fila que el perfilado de T07 encuentre usada en facturación pasa por RN-FIS-126 / RN-MIG-051 y se informa | Informe de filas de `CON_TASAS` referenciadas desde facturación = 0 o clasificadas |
| `SITIBR`, `ALI_IBR`, `ALI_IBR_CF`, `ALI_IBR_COMP` | `grossIncomeSettings` | `RENDIR` → `collectInInvoicing`; `CALCULO` → `calculation` | Recalcular percepciones de un período cerrado: diferencia 0 |
| `IIBB_LUA`, `EMPAFIP` | `taxpayerRegistries` + entries | Solo el último padrón vigente y su historial de 12 meses | Conteo de registros por padrón |
| Alícuotas determinadas (`frmAlicuotaDeterminada`) | `determinedRates` | Con vigencia y motivo "migrado" | Conteo por cuenta |
| `RETE_TIPO`, `RETE_TIPO_BASE`, `CAT_RETG` | `withholdingTypes`, `withholdingScales` | 35 columnas mapeadas; banderas a booleanos | Recalcular retenciones de 3 OP históricas: misma retención |
| `PROVEED_RET`, `PROD_SER_RET`, `CON_COM_RET` | `withholdingAssignments` | Directo | Conteo por proveedor |
| `RET_COM` | `withholdingsApplied` (histórico, `confirmed`) | Certificados como documentos históricos | Σ por período = Σ ProCoop |
| `RETS_TIPO` | `withholdingSufferedTypes` | Directo | Conteo |
| Comprobantes autorizados (`FACTURAS` con CAE, `CAE_VTO`, observaciones) | `fiscalAuthorizations` (histórico `authorized`) | Solo metadatos fiscales; el comprobante lo migra M05 | Σ por tipo/punto/mes = Σ ProCoop; muestra de 50 con `FECompConsultar` |
| Pendientes de autorizar al momento del corte | `fiscalAuthorizations` `pending` | Se encolan tras validar último autorizado en ARCA | 0 pendientes sin resolver antes del by-pass |
| `IVAVTA` | `vatLedgerLines` (períodos cerrados como snapshot) | Snapshot inmutable por período | Totales de IVA por período = ProCoop |
| `ELECTRONICA_FC`, `_IVA`, `_TRIB`, `_RELCOMP` | `gatewayDocuments` (histórico) | Solo si el tenant usaba el modo "solo factura electrónica" | Conteo y CAE |
| `TERCEROS`, `FACTURAS_TERCEROS` | `thirdPartyAgreements`, `thirdPartyCharges` | Convenios a completar con fundamento normativo | Saldo a rendir por convenio = ProCoop |
| `COMPROBANTES_ADM` | `publicAdminSelections` | Solo selecciones abiertas | Conteo |
| `IMPUESTOS_X_CAT` | Vista guardada (T10) | — | — |
| `ACTAFIP` | Asignación de actividad en M02 | Código ARCA vigente | Ninguna actividad sin código |
| Configuración ENACOM (archivo del servidor) | `regulatoryConceptMaps` | Importación manual asistida | Revisión del responsable regulatorio |
| Tablas ENARGAS de la carpeta del ejecutable | `normativeTableVersions` regulatoria | Publicación de plataforma | Formato validado |
| `ENGAS_CANTMESES` | Tabla regulatoria de M04 | — | — |
| Registro de presentaciones (no existe en ProCoop) | `regimeFilings` | Solo períodos abiertos: se crean como `generated` sin acuse; el tenant adjunta acuses si los tiene | Revisión |
| Carpetas IN/OUT y archivos `TA*.xml` | No se migran | Descartado: reemplazado por API y caché cifrado | — |

Paralelo (T07, BASE §106): durante el paralelo factura por factura, M06 de CoopApps opera en **homologación** o sobre un punto de venta distinto; nunca autoriza en producción el mismo comprobante que ProCoop. El by-pass exige: último autorizado por par en ARCA = último migrado; 0 pendientes; certificado propio activo.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-FIS-01 | RN-03 §3.4, §12.2 vs BASE §57, §69 y especificación ARCA (FIC 2.1) | ProCoop envía `Tributo.Id = IMPUESTO.ORIGEN` y mapea percepciones de subtipo 4 a Id 3 (tributo municipal), fusionando tributos distintos con igual Id | Tabla de mapeo explícita código interno → Id de tributo ARCA, validada por el responsable fiscal; agrupación por (Id, alícuota, descripción) | BASE > RN (corrección de defecto) |
| CTR-FIS-02 | RN-03 §12.1 (semilla `AFIP_SIT`) vs RN-03 §8 (RG 3685 de ProCoop) y tabla ARCA | La semilla usa 4 = consumidor final y 5 = exento, invertido respecto de ARCA y de su propio informe | Se usa la tabla ARCA vigente como tabla normativa; la migración remapea | Fuente oficial (BASE §57) > RN |
| CTR-FIS-03 | RN-03 §3.4 vs BASE §69 | ProCoop envía CUIT genérico 23333333333 cuando el documento no es numérico | Nunca CUIT genérico: receptor 99/0 bajo el umbral de identificación; por encima, se detiene en prevalidación | BASE > RN |
| CTR-FIS-04 | RN-03 §3.5 vs BASE §69 (CU-LOT-01) | Ante 10242/10243 ProCoop reintenta forzando condición 5 (CF), alterando el comprobante | Se detiene y se corrige el dato del receptor; no se cambia la condición ni la clase | BASE > RN |
| CTR-FIS-05 | RN-03 §4.3, §12 vs BASE §97.2 | ProCoop considera un CAEA vencido cuando `VTO <= hoy` (el último día no se puede usar) y no controla el uso restringido | Vigencia hasta el fin del día de vencimiento; uso limitado por tabla normativa y `PRM-FIS-022` | BASE > RN |
| CTR-FIS-06 | RN-03 §4.2 vs CAT `CESPAFIP` y RN-03 rec. 9 | La validación de superposición de CESP no detecta un rango contenido en otro | Validación de intervalos completa (incluida contención) y CESP separado de CAEA | RN (recomendación) corrige RN (comportamiento); sin conflicto con BASE |
| CTR-FIS-07 | RN-03 §3.4, §12.1 vs BASE §69 | Un porcentaje de IVA sin mapeo se descarta en silencio y el comprobante se autoriza con IVA incompleto | Se detiene en prevalidación con motivo accionable | BASE > RN |
| CTR-FIS-08 | RN-03 §3.5, §12.3 vs AGR-016 | Las observaciones se toman del primer detalle de la respuesta y se asignan a toda la tanda; el número se convierte a Int16 en la pasarela | Observaciones por comprobante; números enteros de 8 dígitos sin truncar | AGR > RN |
| CTR-FIS-09 | RN-03 §12.5 vs BASE §61 (conciliación) | El informe de percepciones del Libro IVA toma solo IVA código 3 | Se informan todas las percepciones por tipo y jurisdicción | BASE > RN |
| CTR-FIS-10 | RN-03 §3.1 vs AGR-021 | La autorización masiva apaga la autorización automática en silencio cuando quedan facturas bloqueadas | Nunca se apaga en silencio: cada encendido/apagado se audita y notifica; la cola sigue con los pares no afectados | AGR > RN |
| CTR-FIS-11 | RN-03 §1, §6 (carpetas IN/OUT, archivos en el servidor) vs DEC-001, DEC-003 | El modo "solo factura electrónica" lee y escribe archivos en carpetas compartidas | API `/api/v1/ext/fis` y carga CSV a almacenamiento privado; sin carpetas compartidas | DEC > RN |
| CTR-FIS-12 | RN-03 §2.1 (certificado en ruta de archivo y URLs por instalación, V2 2071–2073) vs DEC-001 (bóveda por tenant) y BASE §61 | Credenciales en disco y URLs configurables por cada cooperativa | Certificado en bóveda por tenant; URLs por ambiente administradas por la plataforma | DEC > BASE > RN |
| CTR-FIS-13 | RN-03 §9, §12.6 vs RF de conciliación (BASE §61) | La comparación con ARCA omite la segunda alícuota de IVA (IVA2) | Se comparan todas las alícuotas, tributos y totales | BASE > RN |
| CTR-FIS-14 | RN-02 §13.1 (SUP solo para una cooperativa, tablas en la carpeta del ejecutable) vs DEC-002 | Ramas de código y archivos por cooperativa | Tablas maestras como tablas normativas versionadas por protocolo y configuración por tenant | DEC > RN |
| CTR-FIS-15 | RN-09 V2 2952 ("presentación automática" de retenciones) y DFA (verbo "presentar") vs BASE §61 y §105-7 | ProCoop y el DFA hablan de presentar automáticamente; BASE exige que generar un archivo no equivalga a presentado y no automatizar pantallas autenticadas | El sistema genera, valida y registra; la presentación es humana o por web service oficial habilitado, con acuse adjunto | BASE > DFA/RN |
| CTR-FIS-16 | RN-03 §5 (WSPN3) vs FIC 2.2 (A13 y constancia de inscripción) | Servicio de padrón heredado vs servicios vigentes | A13 + constancia de inscripción; WSPN3 reemplazado (confirmación en PA-FIS-10) | FIC (vigente) > RN (comportamiento heredado) |
| CTR-FIS-17 | DFA (retenciones dentro del módulo Compras) vs BASE §105 (solución 7 "Liquidación de impuestos") | Dónde vive la regla de retención | Motor y reglas en M06; ejecución en la OP en M12/M14; registro de retenciones sufridas en M07 | BASE > DFA |
| CTR-FIS-18 | RN-08 §3 y RN-09 (V2 2413, 2414: "retención" de compras prepagas) vs terminología fiscal | "Retención" designa la porción de una compra prepaga aplicada a deuda, no un tributo | Se asigna a M03/M07; no es una retención fiscal | BASE (§105 alcance de impuestos) > RN |
| CTR-FIS-19 | Guía §7 (regímenes informativos y libros IVA digitales en O8) vs BASE §70/§105 (impuestos básicos en O4) y MER-001/MER-002 | Si el Libro IVA y RG 3571/RG 5746 esperan a O8, una cooperativa no podría operar en producción ni informar generadores | Libro IVA Ventas criterio facturado en O4 (PA-FIS-06); RG 3571/RG 5746 en O7 junto con los servicios medidos (PA-FIS-07); el resto en O8 | Guía §7 (prerrequisito de ola anterior se adelanta) |
| CTR-FIS-20 | RN-09 V2 2780 y V2 2712 (umbrales fijos por instalación) vs BASE §52.4 (tablas normativas con fuente y vigencia) | Umbrales normativos cargados como parámetros sueltos por cooperativa | Umbrales como tablas normativas de plataforma adoptadas por tenant (`PRM-FIS-012`, `PRM-FIS-013`, `PRM-FIS-024`) | BASE > RN |
| CTR-FIS-21 | DEC-035 y RF-FIS-053 (reenvío del mismo número) vs documento externo `NucleoTransversal-Modelo` cap. 7.2 | El comprobante rechazado por ARCA se corregía y reenviaba con el mismo número, bloqueando el par hasta entonces | Vuelve a borrador en M05 y libera el número; los posteriores sin CAE se renumeran desde el último autorizado; FIS clasifica `rejectionKind`, cancela las autorizaciones no enviadas (`numberReleased`) y crea una nueva por reemisión; un CAEA rechazado al informar no se renumera ([VERIFICAR] con el contador) | DEC-107 > DEC-035 |

## 21. Preguntas abiertas

### PA-FIS-01 — Uso del CAEA
- **Pregunta:** ¿El CAEA se usa solo como contingencia o también como modalidad habitual para la facturación masiva?
- **Contexto:** ProCoop lo solicita por quincena sin controlar el uso; la normativa vigente restringe su uso según el sujeto y el caso (BASE §97.2). Afecta la operación de lotes grandes.
- **Opciones:**
  - A) Solo contingencia por defecto, y habilitable por punto de venta para facturación masiva cuando la tabla normativa lo permita al tenant **(Recomendada)** — cumple la normativa y mantiene flexibilidad.
  - B) Siempre CAEA para facturación masiva — menos llamadas a ARCA, pero riesgo de uso no admitido.
  - C) No ofrecer CAEA — simplifica, pero sin respaldo ante caídas de WSFE.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-065, RF-FIS-069, `PRM-FIS-022`; O4.

### PA-FIS-02 — Alcance del CESP para LQSP
- **Pregunta:** ¿Se implementa el CESP para liquidaciones de servicios públicos en O7?
- **Contexto:** RN-03 §4.2 lo documenta con defectos; solo aplica a tenants con servicios LQSP.
- **Opciones:**
  - A) Sí, en O7, separado de CAEA y con validación de superposición correcta **(Recomendada)** — cubre electricidad y agua.
  - B) Solo si un tenant piloto lo usa — reduce trabajo, pero bloquea tenants futuros.
  - C) Descartar — riesgo de no poder emitir LQSP.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-071 a RF-FIS-074; O7.
- **Actualización (10-11-2026, DEC-094):** se mantiene la opción A: la LQSP se autoriza con CESP separado del CAEA; la propuesta externa de CAE o CAEA no se adopta. La norma, la vía vigente y el efecto de las RG 5003 y 5866/2026 se consultan al contador en PA-FIS-24; si cambian la vía, una DEC nueva reemplaza a DEC-094.

### PA-FIS-03 — Obtención del certificado ARCA
- **Pregunta:** ¿La plataforma genera la clave privada y el CSR, o el tenant solo carga un certificado PFX ya obtenido?
- **Contexto:** RN-03 rec. 1; generar en la plataforma evita que la clave salga de la bóveda.
- **Opciones:**
  - A) Ambas, con la generación en la plataforma como camino principal **(Recomendada)** — la clave nunca sale de la bóveda; se admite la importación para quien ya tiene certificado.
  - B) Solo carga de PFX — más simple, pero la clave pasa por equipos del usuario.
  - C) Solo generación en plataforma — más seguro, pero obliga a renovar certificados vigentes.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-053): la plataforma genera clave y CSR con la clave privada en la bóveda de T06 (`integrationSecrets`, DEC-074) y admite PFX existente.
- **Bloquea:** RF-FIS-025; O4.

### PA-FIS-04 — Agrupación en rango de comprobantes B/C
- **Pregunta:** ¿Se ofrece la autorización agrupada en rango de comprobantes a consumidor final?
- **Contexto:** RN-03 §3.3 (V2 2712); reduce llamadas pero pierde el detalle por comprobante en ARCA.
- **Opciones:**
  - A) Opcional, apagada por defecto y limitada por el tope normativo **(Recomendada)** — disponible para tenants de gran volumen.
  - B) Siempre activa bajo el tope — menos llamadas, menos trazabilidad.
  - C) No ofrecerla — máxima trazabilidad; más llamadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-054, `PRM-FIS-012`; O4.

### PA-FIS-05 — Imputación de pagos parciales con conceptos de terceros
- **Pregunta:** ¿Cómo se reparte un pago parcial entre conceptos propios y conceptos por cuenta de terceros?
- **Contexto:** BASE §97.4 exige una política aprobada; impacta la rendición y el pasivo.
- **Opciones:**
  - A) Prorrata entre propio y terceros **(Recomendada)** — neutral y explicable; el ejemplo de RF-FIS-138 lo usa.
  - B) Primero terceros — protege al organismo; la cooperativa cobra último.
  - C) Primero propios — protege la caja de la cooperativa; puede incumplir convenios.
- **Impacto si no se responde:** se asume A, configurable por convenio si el convenio lo exige.
- **Bloquea:** RF-FIS-138, RF-FIS-139; O5.

### PA-FIS-06 — Ola del Libro IVA
- **Pregunta:** ¿El Libro IVA Ventas con criterio facturado entra en O4 o espera a O8?
- **Contexto:** la guía ubica los libros digitales en O8, pero el tenant piloto factura en producción desde O4/O6 y necesita su libro mensual.
- **Opciones:**
  - A) Libro IVA Ventas criterio facturado y carátula en O4; criterios percibido, LID, Mis Comprobantes y libro compras en O8 **(Recomendada)** — el piloto cumple desde el inicio.
  - B) Todo en O8 — el piloto exporta datos y arma el libro fuera.
  - C) Todo en O4 — adelanta trabajo que depende de compras (M12, O8).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-112 a RF-FIS-117; O4/O8.

### PA-FIS-07 — Ola de RG 3571 y RG 5746/2025
- **Pregunta:** ¿El régimen de servicios públicos (RG 3571) y los datos de energía inyectada (RG 5746/2025) se entregan en O7 con servicios medidos?
- **Contexto:** MER-001/MER-002; los generadores aparecen con electricidad en O7.
- **Opciones:**
  - A) O7 **(Recomendada)** — coincide con la habilitación de electricidad y generación distribuida.
  - B) O8 con el resto de regímenes — riesgo de no informar en el primer período con generadores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-073, RF-FIS-128; O7.

### PA-FIS-08 — Ola del modo pasarela
- **Pregunta:** ¿El modo pasarela (autorización para sistemas externos) se ofrece en O11 o antes?
- **Contexto:** RN-03 §1, §6: algunas cooperativas usan ProCoop solo para factura electrónica de otros sistemas.
- **Opciones:**
  - A) O11 con las APIs para terceros **(Recomendada)** — no distrae el núcleo.
  - B) O4 junto con ARCA — habilita tenants que solo quieren factura electrónica.
- **Impacto si no se responde:** se asume A; si un tenant lo requiere antes, se replanifica.
- **Bloquea:** RF-FIS-154 a RF-FIS-156; O11.

### PA-FIS-09 — Jurisdicciones de IIBB en la primera entrega
- **Pregunta:** ¿Qué jurisdicciones de IIBB se implementan primero?
- **Contexto:** RN-01 §17.2 y RN-02 §13.3.1 relevan Córdoba, Buenos Aires, Entre Ríos, Santa Fe, La Pampa y Río Negro.
- **Opciones:**
  - A) Córdoba completa en O4 (padrón, percepción, CVP) y el resto como configuración en O8, adelantando la de un tenant piloto que la necesite **(Recomendada)**.
  - B) Todas en O4 — mayor esfuerzo inicial.
  - C) Solo Córdoba — riesgo con tenants de otras provincias o Convenio Multilateral.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-054): Córdoba en O4; el resto como configuración en O8.
- **Bloquea:** RF-FIS-087, RF-FIS-132; O4/O8.

### PA-FIS-10 — Servicio de padrón
- **Pregunta:** ¿Se reemplaza WSPN3 por padrón A13 y constancia de inscripción?
- **Contexto:** RN-03 §5, §12.4; FIC 2.2.
- **Opciones:**
  - A) A13 + constancia de inscripción **(Recomendada)** — servicios vigentes con datos tipados.
  - B) Mantener WSPN3 mientras exista — compatibilidad, riesgo de baja del servicio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-016, RN-FIS-066; O4.

### PA-FIS-11 — Espera sincrónica de CAE en mostrador y cobranza
- **Pregunta:** ¿Qué ocurre si el CAE no llega dentro de la espera en una venta de mostrador o cobranza con factura?
- **Contexto:** RN-03 §3.1 (V2 727: 15 s y aviso).
- **Opciones:**
  - A) Esperar hasta 15 s (configurable); si no llega, registrar la operación, avisar "pendiente de ARCA" y entregar el comprobante al autorizarse **(Recomendada)** — no frena la caja.
  - B) Bloquear la operación hasta obtener el CAE — fila en caja ante caídas.
  - C) No esperar nunca — el cliente siempre se va sin comprobante autorizado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-056, `PRM-FIS-010`; O4/O5.

### PA-FIS-12 — Adopción de tablas normativas por el tenant
- **Pregunta:** ¿La adopción de una versión publicada por la plataforma es explícita o automática?
- **Contexto:** BASE §52.4 y §105-7: tablas mantenidas por la plataforma y adoptadas por el tenant.
- **Opciones:**
  - A) Explícita, con aprobación del responsable fiscal (doble control opcional), aviso de vencimiento de adopción y alerta si se acerca la vigencia **(Recomendada)** — el tenant asume la decisión.
  - B) Automática en la fecha de vigencia con opción de rechazo en N días — menor riesgo de olvido; el tenant pierde control.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-002; O4.

### PA-FIS-13 — Informes ENACOM
- **Pregunta:** ¿Se descarta el informe histórico DNU 311/2020 (Res. 367/2020) de ENACOM y se mueve la configuración a la base?
- **Contexto:** RN-02 §13.2.
- **Opciones:**
  - A) Sí: configuración versionada en base y solo informes vigentes **(Recomendada)**.
  - B) Mantener el histórico como consulta — más trabajo sin uso actual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-146, RN-FIS-116; O7.

### PA-FIS-14 — Alcance de informes ERSeP y ENARGAS
- **Pregunta:** ¿Se implementan todos los informes regulatorios relevados o solo los que usan los tenants piloto?
- **Contexto:** RN-11 §4, RN-02 §13.1, FIC 8.1, 8.2.
- **Opciones:**
  - A) Todos los relevados, como catálogo configurable por tenant, priorizando los del tenant piloto **(Recomendada)**.
  - B) Solo los del piloto — riesgo para cooperativas siguientes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-144, RF-FIS-145; O7.

### PA-FIS-15 — SICORE de retenciones de Ganancias de sueldos
- **Pregunta:** ¿Quién genera la declaración SICORE de las retenciones de Ganancias de cuarta categoría?
- **Contexto:** BASE §104 (SUE-006, SUE-007) asigna el cálculo a M16; el agente presenta un único SICORE con retenciones a proveedores y a empleados.
- **Opciones:**
  - A) M16 calcula y publica las retenciones; M06 genera el archivo SICORE único del agente **(Recomendada)** — una sola declaración y un solo calendario.
  - B) M16 genera su propio archivo — dos archivos que el contador debe unir.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF de 5.10 (SICORE), JOB-FIS-13; O8/O9.

### PA-FIS-16 — Ola de FECESCOR
- **Pregunta:** ¿La rendición FECESCOR (terceros y tarjeta) se entrega en O8 o junto con la rendición de terceros en O5?
- **Contexto:** FIC 9.1, RN-11 §4.
- **Opciones:**
  - A) O8 **(Recomendada)** — depende de tesorería completa.
  - B) O5 — si un tenant piloto es socio de FECESCOR.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-140; O8.

### PA-FIS-17 — Revalidación periódica de padrón
- **Pregunta:** ¿La revalidación masiva actualiza la condición IVA automáticamente o propone cambios para aprobación?
- **Contexto:** RN-03 §5; un cambio de condición afecta la clase de los comprobantes futuros.
- **Opciones:**
  - A) Propone y requiere aprobación **(Recomendada)** — control humano y evidencia.
  - B) Actualiza automáticamente y notifica — menos trabajo, riesgo de errores de padrón.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-018, JOB-FIS-19; O8.

### PA-FIS-18 — Mantenimiento de padrones de IIBB (ex PA-CFG-05)
- **Pregunta:** ¿Los padrones fiscales los mantiene la plataforma o cada tenant?
- **Contexto:** Trasladada desde T04 con los padrones (CTR-DAT-13). Algunos padrones son públicos; otros solo se descargan con las credenciales del agente de recaudación (la cooperativa).
- **Opciones:**
  - A) Mixto: los públicos los ingesta la plataforma; los que requieren credenciales del agente los importa o integra cada tenant **(Recomendada)** - evita duplicar cargas y respeta credenciales.
  - B) Todo lo importa cada tenant - simple; trabajo repetido en cada cooperativa.
  - C) Todo en plataforma con credenciales delegadas - centralizado; problemático legalmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-168, RN-FIS-132; O4.
- **Estado:** Asumida la recomendada (DEC-072): opción A, aplicada en RF-FIS-168 y RN-FIS-132.

### PA-FIS-19 - Capability de exportación de reportes fiscales
- **Pregunta:** ¿qué capability exige exportar un reporte fiscal (API-FIS-80, PAN-FIS-40)?
- **Contexto:** API-FIS-80 declara `fis.*.ver` / `exportar`; el comodín es solo de visibilidad (AL-08 de T03) y `exportar` no tiene recurso. T02 no tiene una capability `fis.*.exportar`.
- **Opciones:**
  - A) **(Recomendada)** `fis.reportes.exportar`, única para todos los reportes, además de la `fis.<recurso>.ver` del dominio.
  - B) Exportar con la misma `fis.<recurso>.ver` del dominio del reporte.
  - C) Una `fis.<recurso>.exportar` por dominio.
- **Impacto si no se responde:** se aplica B por defecto (quien ve, exporta), con auditoría de la exportación.
- **Bloquea:** T02 (catálogo), API-FIS-80.
- **Estado:** Asumida (DEC-072): opción A. Exportar un reporte fiscal exige `fis.reportes.exportar`, además de la `fis.<recurso>.ver` del dominio; aplicado en API-FIS-80 y en el rol Auditor del §4. T02 debe registrar `fis.reportes.exportar`.

### PA-FIS-20 - Destino de referencias sin colección dueña conocida
- **Pregunta:** ¿a qué colección apuntan `normativeAdoptions.simulationId` y `gatewayDocuments.externalSystemId`?
- **Contexto:** al completar las tablas del §7 (05-11-2026) estos destinos no se pudieron deducir de T05 ni del anexo.
- **Opciones:**
  - A) **(Recomendada)** `simulationId` → simulaciones de M04 (`tar` simulador) y `externalSystemId` → clientes API de T02 (`api-clients`).
  - B) Quitar los campos si ningún RF ni RN los usa.
- **Impacto si no se responde:** quedan `[VERIFICAR]` y sin validación de integridad.
- **Bloquea:** T05 §7.2.
- **Estado:** Asumida (DEC-072): opción A. `normativeAdoptions.simulationId` → simulaciones de M04 y `gatewayDocuments.externalSystemId` → `apiClients` de T02; aplicado en las tablas del §7. T05 debe agregar las referencias.

### PA-FIS-21 - Colección `fiscalClasses`, catálogo de actividades y estados de `provincialValidationCodes` (cierre, segunda ronda)
- **Pregunta:** ¿M06 declara la colección de clases fiscales que usa `billableConcepts.fiscalClassId` (M02)? ¿Dónde vive el catálogo de actividades ARCA que usa `serviceContracts.activityId`? ¿Se confirman los estados `active` y `expired` de `provincialValidationCodes`?
- **Contexto:** PA-CAT-21 de M02 mandó `fiscalClassId` a «clase fiscal de M06», pero M06 solo tenía el enum `conceptFiscalCases.fiscalClass`; `activityId` se había mandado a T04, que no tiene el catálogo; los estados de `provincialValidationCodes` estaban propuestos con `[VERIFICAR]`.
- **Opciones:**
  - A) **(Recomendada)** Declarar `fiscalClasses` en M06 (§7.38: `code`, `name`, `status`, `validFrom`/`validTo`); `activityId` → `normativeTables` con `code = arcaActivities` (§7.1); confirmar `active` y `expired`.
  - B) Mantener la clase fiscal como enum sin colección y quitar la referencia de M02.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T05 §7.2 (`fiscalClassId`, `activityId`); M02 `billableConcepts` y `serviceContracts`.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.14, §7.38 y §8.11; M02 cita el destino (PA-CAT-22). T05 debe agregar `fiscalClasses`.

### PA-FIS-22 — Residuales de estados, servicios internos y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones que faltaban (incluida `active` → `expired` de `provincialValidationCodes`), los valores de `regulatoryReportRuns.status`, los consumidores de los servicios internos de §11.1 y los destinos de las referencias que no lo indicaban?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 12 máquinas sin estado inicial, `provincialValidationCodes` con estados sin transiciones, `regulatoryReportRuns` sin valores y `fiscalProfiles.mipymeStatus` como estado sin valores; 18 §11 marcó [VERIFICAR] los consumidores de tres servicios; 06w marcó `fis.taxEngine.calculate` y `fis.withholding.calculate` sin invocador (son los nombres anteriores de `fis.service.calculateTaxes` y `fis.service.calculateWithholdings`); 03-er marcó referencias sin destino.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.12 el estado de alta de cada máquina, `provincialValidationCodes` `active` → `expired` por vencimiento de `validTo` y la máquina de `regulatoryReportRuns` con los valores de `regimeFilings`; aclarar que `mipymeStatus` no es estado; usar en §9 los nombres de §11.1; fijar consumidores según las invocaciones de los anexos (M04, M05 y M11 para `calculateTaxes`; M05 y M11 para `resolveDocumentClass`; M05 para `checkRegistryCoverage`); declarar destinos (`paymentOrders` y `suppliers` de M12; `withholdingTypes`, `regimeFilings`, `taxObligations`, `taxDefinitions` de M06) y tipar `arcaVatId` como código ARCA.
  - B) Dejar los estados iniciales implícitos (primer valor) y los consumidores como [VERIFICAR].
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados y servicios), 18 (contratos internos), T05 §7.2.1 y §8.1.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.4, §7.14, §7.16, §7.24, §7.32, §8.12, §9.6 a §9.8, §11.1 y §12 (JOB-FIS-17 consume `int.arca.paramsSynced`, antes `int.arca.params-synced`). T11 debe registrar el alias en §12.4; T05 debe reflejar los destinos y los valores de `regulatoryReportRuns.status`; M04, M12 y M14 deben citar `fis.service.calculateTaxes` y `fis.service.calculateWithholdings`.
- **Sincronización (5-11-2026), Asumida (DEC-072):** las cuentas contables de `vatRates` (antes `accounts{ sales, purchases, salesPerception }`) y de `taxDefinitions` (antes `accountMap`) se retiran de M06 y pasan a `entityAccountAssignments` de M15 (`entityType` `vatRate` y `taxDefinition`), como T05 COL-FIS-16 y COL-FIS-18 (PA-DAT-04).
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M06 declara en §12.1 EVT-FIS-25 `fis.regimeFile.requested` (antes `fis.regime-file.requested`, nombre que solo figuraba en T06 §12), publicado al aprobar una `regimeFilings` que se entrega por conector; payload `filingId`, `legalEntityId`, `regimeCode`, `period`, `storedFileIds[]`; consumidor T06. T11 §12.4 registra el alias.

### PA-FIS-23 — Conceptos accesorios admitidos dentro de la LQSP (DEC-093)
- **Pregunta:** ¿Qué conceptos pueden ir dentro de la liquidación de servicios públicos cuando la factura agrupada reúne servicios públicos y servicios de factura común?
- **Contexto:** DEC-093 prohíbe mezclar en un comprobante servicios de LQSP con servicios de factura común y admite en la LQSP solo los conceptos que el tenant declare accesorios con respaldo del contador. La marca es `conceptFiscalCases.publicServiceAccessory` con `accessoryApproval` (§7.37; RN-FIS-122; RN-FAC-040 de M05). Origen: contraste del documento externo `NucleoTransversal-Modelo`, aporte A1.
- **Opciones:**
  - A) **(Recomendada)** Solo tasas, contribuciones y cargos regulados que acompañan al servicio público y que el contador declare accesorios; internet, telefonía, TV, sepelio y servicios sociales siempre en factura común.
  - B) Lista cerrada precargada por la plataforma — riesgo de admitir conceptos sin respaldo del contador del tenant.
- **Impacto si no se responde:** ningún concepto queda marcado como accesorio y todo lo que no es tarifa del servicio público va a la factura común.
- **Bloquea:** carga de `conceptFiscalCases.publicServiceAccessory` en producción; RN-FAC-040 de M05.
- **Estado:** Pendiente (contador).

### PA-FIS-24 — Norma, vía de autorización de la LQSP y RG 5003 y 5866/2026 (DEC-094)
- **Pregunta:** ¿Qué norma obliga a usar la LQSP, cuál es la vía de autorización vigente (CESP, CAE o CAEA) y qué efecto tienen las RG 5003 y 5866/2026?
- **Contexto:** M06 autoriza la LQSP con CESP separado del CAEA (PA-FIS-02, RF-FIS-071 a RF-FIS-074); el documento externo habla de CAE o CAEA y cita normas que la especificación no trataba. M05 también trata la LQSP como comprobante que exige documento del receptor mientras esto no se confirme (RN-FAC-162).
- **Opciones:**
  - A) **(Recomendada)** Mantener CESP separado del CAEA hasta que el contador confirme; la RG 3571/2013 se sigue tratando como régimen de información (RF-FIS-128).
  - B) Cambiar a CAE o CAEA — requiere DEC nueva que reemplace a DEC-094 y revisar RF-FIS-034, RF-FIS-071 a RF-FIS-074 y `numberSequences.authorizationType` de M05.
- **Impacto si no se responde:** se mantiene A; el riesgo es bloquear la facturación de servicios medidos en O7 si la vía no fuera la vigente.
- **Bloquea:** RF-FIS-071 a RF-FIS-074 (O7); RN-FAC-162 punto 4 de M05.
- **Estado:** Pendiente (contador).

### PA-FIS-25 — Obligaciones y exenciones propias de la cooperativa (DEC-095)
- **Pregunta:** ¿Qué obligaciones y exenciones propias tiene cada cooperativa como contribuyente, con qué fundamento y vigencia? En particular: exención de Ingresos Brutos de Córdoba para cooperativas eléctricas, Contribución Especial sobre el Capital Cooperativo y reforma de Ganancias 2026.
- **Contexto:** M06 incorpora el registro genérico `ownTaxObligations` (§7.39; RF-FIS-169, RN-FIS-133) sin normas precargadas; M17 provee la base de capital por servicio o evento.
- **Opciones:**
  - A) **(Recomendada)** No precargar ninguna; el contador confirma cada una con su fundamento y vigencia y el tenant la da de alta en el registro.
  - B) Precargar las tres como plantillas de plataforma — riesgo de aplicar normas no confirmadas.
- **Impacto si no se responde:** el registro queda vacío y esas posiciones se siguen llevando fuera del sistema.
- **Bloquea:** carga productiva de `ownTaxObligations`; contrato de base de capital con M17.
- **Estado:** Pendiente (contador).

### PA-FIS-26 — IVA del 27 % a responsables inscriptos según el uso del suministro (DEC-102)
- **Pregunta:** ¿Corresponde aplicar el 27 % a responsables inscriptos según el uso del inmueble (residencial, comercial, industrial, rural), y para qué servicios?
- **Contexto:** `vatRateMatrix` admite la condición opcional `supplyUsageClasses[]` (clase `premiseUsages.usageClass` de M01; antes `supplyUsageIds[]` del catálogo `premiseUsages`), desactivada por defecto con PRM-FIS-125 (RF-FIS-079, RN-FIS-073). Hoy el 27 % solo figura como dato de demostración (§18).
- **Opciones:**
  - A) **(Recomendada)** Condición por uso desactivada por defecto; se activa por tenant y servicio solo con la confirmación del contador.
  - B) Activarla por defecto para energía — riesgo de liquidar mal el IVA sin respaldo.
- **Impacto si no se responde:** la alícuota se resuelve sin considerar el uso del suministro.
- **Bloquea:** activación de PRM-FIS-125 en producción.
- **Estado:** Pendiente (contador).

## 22. Trazabilidad de fuentes

### 22.1 BASE (PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL)

| Fuente | Destino en M06 |
|---|---|
| §10, CU-10 (emisión y autorización; parte fiscal) | RF-FIS-039 a 053; CU-10; RN-FIS-040 |
| §52.1 Marco normativo y vigencias | RF-FIS-001, RF-FIS-009 |
| §52.2 Cargos, tributos y contenido permitido (Res. SIyC 267/2024) | RF-FIS-003, RF-FIS-011, RF-FIS-062, RF-FIS-135, RF-FIS-141 |
| §52.3 Responsabilidad sobre la configuración | §2.3; RF-FIS-008 |
| §52.4 Relevamiento fiscal del tenant | RF-FIS-002, RF-FIS-003, RF-FIS-006; colección `fiscalSurveys`; PAN-FIS-03; CTR-FIS-20 |
| §56 Fuentes ARCA [AR1–AR9] | Fuente de las tablas normativas (sección 7.1–7.2) y de RF-FIS-004, 024, 062, 065, 073; §13 |
| §57 Factura electrónica y datos fiscales | RF-FIS-006, RF-FIS-039 a 064; CTR-FIS-01, CTR-FIS-02 |
| §61 Liquidación de impuestos (FIS-001, organización e interfaces, credenciales, CU-FIS-01) | RF-FIS-007, 010, 014, 032, 097 a 110, 126, 127, 133, 160; RN-FIS-120; CU-FIS-01; CTR-FIS-15; §17.2 |
| §62 Fuentes fiscales [FIS-F1–F4] | RF-FIS-107 [FIS-F2]; catálogo de regímenes (RF-FIS-125) |
| §63 Fuentes de regímenes y reguladores | RF-FIS-006, RF-FIS-143 a 150 |
| §69 Lotes: validación fiscal de factura A, CU-LOT-01, bandeja de excepciones | RF-FIS-041, 042, 052, 076, 077; RN-FIS-026, 045; CU-LOT-01; CTR-FIS-03, 04, 07 |
| §70 [LOT-F1–F3] Precisiones normativas | RF-FIS-042, RF-FIS-076, RF-FIS-077 |
| §85 Regulación sectorial [ESP5] y Ley 10739 | RF-FIS-011, RF-FIS-012, RF-FIS-150 |
| §97.2 CAE, CAEA, puntos de venta, contingencia | RF-FIS-024, 033, 063, 065, 069, 090; CTR-FIS-05; PA-FIS-01 |
| §97.3 Datos fiscales del comprobante | RN-FIS-123 |
| §97.4 Conceptos por cuenta de terceros | RF-FIS-003, 134 a 141; RN-FIS-121; PA-FIS-05 |
| §98 Datos del prestador | RF-FIS-006 |
| MER-001 Generación distribuida (CU-MER-01) | RF-FIS-073, RF-FIS-128; CU-MER-01; PA-FIS-07 |
| MER-002 RG 5746/2025 | RF-FIS-073, 125 a 128; PA-FIS-07 |
| MER-014 Informes a reguladores | RF-FIS-143, 148, 149 |
| §101 [MER18] | RF-FIS-073 |
| §103.3 Factura agrupada: datos fiscales | RN-FIS-122 |
| §104 SUE-006, SUE-007 (Ganancias 4ta y F.931, referencia) | RF-FIS-111; PA-FIS-15; §2.2 (M16) |
| §105 Solución 7 "Liquidación de impuestos" | Encabezado; §1; §2; RF-FIS-001, 002, 008 |
| §106 Migración, paralelo y by-pass | §19 |
| ESC-01, ESC-02, ESC-04, ESC-05 | §17.5; CU-FIS-17 |
| ESC-03 | Descartado: no aplica a M06 (instalación offline) |

### 22.2 AGR (complemento)

| Fuente | Destino |
|---|---|
| AGR-010 Versionado y vigencias | RF-FIS-001, 005, 009, 083, 117 |
| AGR-011 Dinero y redondeo (referencia) | RN-FIS-034, RN-FIS-037 |
| AGR-015 Universo congelado (referencia) | RF-FIS-117 |
| AGR-016 Idempotencia | RF-FIS-010, 053, 063; §17.4; CTR-FIS-08 |
| AGR-020 Límites y colas (referencia) | §12.3 |
| AGR-021 Integraciones observables | RF-FIS-031; RN-FIS-013; §13; CTR-FIS-10 |
| AGR-022 Contrato semántico (referencia) | RF-FIS-158; §15 |
| AGR-023 Expediente y conservación (referencia) | RF-FIS-064, RF-FIS-159 |
| AGR-012, AGR-013, AGR-014, AGR-017, AGR-018, AGR-019 | Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los consume por referencia (ESC-01, ESC-02, §19) |

### 22.3 DFA (definición funcional de alcance)

| Fuente | Destino |
|---|---|
| Tablas fiscales (líneas 144–149): situaciones IVA e IIBB, alícuotas, impuestos, CESP, CVP, puntos de venta | §7.9, 7.13 a 7.18; PAN-FIS-08, 14 a 20 |
| Facturación: autorización ARCA | §5.5; PAN-FIS-09 |
| Facturación: CVP | RF-FIS-090 |
| Facturación: anulación | Descartado en M06: M05 (FIS solo informa estado, §12.2) |
| Facturación: bloqueo de comprobantes | RF-FIS-058 |
| Facturación: terceros | §5.14 |
| Facturación: relación de comprobantes | RF-FIS-048 |
| Facturación: Libro IVA | §5.12 |
| Facturación: EPEC | FIC 9.3 en §13 (referencia M12/M03) |
| Facturación: ENACOM | RF-FIS-146 |
| Datos de la empresa | RF-FIS-013 |
| Alerta de pendientes de autorizar | RF-FIS-057; PAN-FIS-39 |
| Retenciones en compras | §5.11; CTR-FIS-17 |

### 22.4 FIC (fichas de integración)

| Ficha | Destino |
|---|---|
| FIC 2.1 WSAA/WSFEv1 | §5.3 a 5.6; §13; RF-FIS-004, 024, 028, 031, 033, 038, 039, 060, 065 |
| FIC 2.2 Padrón | RF-FIS-016, 018; PA-FIS-10 |
| FIC 2.3 Regímenes y libros digitales | RF-FIS-007, 094, 107, 119, 125 |
| FIC 2.4 Mis Comprobantes | RF-FIS-122 |
| FIC 3.1 Rentas Córdoba | RF-FIS-087, 088, 090, 091, 131 |
| FIC 3.2 Otras provincias | RF-FIS-087, 092, 132; PA-FIS-09 |
| FIC 7 Subsidios y tarifa social | §13 (cálculo en M04; informes en RF-FIS-144) |
| FIC 8.1 ERSeP | RF-FIS-144 |
| FIC 8.2 ENARGAS | RF-FIS-145 |
| FIC 8.3 ENACOM | RF-FIS-146 |
| FIC 8.4 Secretaría de Energía | RF-FIS-147 |
| FIC 9.1 FECESCOR | RF-FIS-140; PA-FIS-16 |
| FIC 9.2 Tasas de terceros | RF-FIS-134, 137, 139 |
| FIC 9.3 EPEC | Referencia a M12/M03 (§13) |

### 22.5 RN-03 Facturación electrónica e IVA (completo)

| Sección | Destino |
|---|---|
| Fuentes revisadas | Encabezado (fuentes consolidadas) |
| §1 Dos modos | RN-FIS-001, 002; RF-FIS-154; CTR-FIS-11 |
| §2.1 Configuración | RF-FIS-024, 028; RN-FIS-003, 004, 008; CTR-FIS-12 |
| §2.2 Ticket y caché | RF-FIS-027, 029, 030; RN-FIS-005 a 012 |
| §2.3 Avisos de vencimiento | RF-FIS-026; RN-FIS-008 |
| §3.1 Cola y disparadores | RF-FIS-035, 039, 040, 056, 057; RN-FIS-014 a 019; CTR-FIS-10 |
| §3.2 Bloqueo y validaciones previas | RF-FIS-041; RN-FIS-020 a 023 |
| §3.3 Agrupación en lotes | RF-FIS-054; RN-FIS-024; PA-FIS-04 |
| §3.4 Armado del detalle | RF-FIS-017, 043 a 049, 055; RN-FIS-025 a 040; CTR-FIS-01, 03, 07 |
| §3.5 Respuesta, errores y reintentos | RF-FIS-037, 051 a 053, 058, 064; RN-FIS-042 a 047; CTR-FIS-04 |
| §3.6 Consultas auxiliares | RF-FIS-004, 023, 030, 033, 037, 050; RN-FIS-051, 052 |
| §3.7 Inconsistencias | RF-FIS-059; RN-FIS-048 a 050 |
| §4.1 Autorización por comprobante | RF-FIS-034, 061, 066; RN-FIS-053 a 055, 063 |
| §4.2 CESP | RF-FIS-071, 072, 074; RN-FIS-056, 057; CTR-FIS-06; PA-FIS-02 |
| §4.3 CAEA | RF-FIS-065, 067, 068, 070; RN-FIS-058 a 060; CTR-FIS-05 |
| §4.4 CAI | RF-FIS-036; RN-FIS-062 |
| §5 Padrón | RF-FIS-015 a 019, 023; RN-FIS-065 a 069; PA-FIS-10, 17 |
| §6 Carpetas IN/OUT | RF-FIS-154 a 156; RN-FIS-119; CTR-FIS-11 |
| §7 Mapeos a códigos | RF-FIS-061, 075; RN-FIS-063, 064 |
| §8.1 Criterios y tipos | RF-FIS-112, 113; RN-FIS-086 a 088; PA-FIS-06 |
| §8.2 Reglas de armado | RF-FIS-114 a 116; RN-FIS-089 a 093 |
| §8.3 Exportaciones | RF-FIS-093, 119, 120, 125, 128 a 130, 144; RN-FIS-098, 105, 106 |
| §9 Libro IVA Compras y LID | RF-FIS-118, 119, 122, 123; RN-FIS-098, 102 |
| §10 Administración pública | RF-FIS-151 a 153; RN-FIS-117 |
| §11 Resumen de parámetros | §14 |
| §12.1 Mapeo tal como lo implementa el código | RF-FIS-022, 043, 046, 048, 049, 075; RN-FIS-034, 038, 040, 070 a 072; CTR-FIS-02 |
| §12.2 Tributos | RF-FIS-047, 093; RN-FIS-035, 036; CTR-FIS-01 |
| §12.3 Métodos no documentados | RF-FIS-045, 051, 055, 059, 067, 155; RN-FIS-013, 033, 041, 044, 048, 059, 119; CTR-FIS-08 |
| §12.4 Proxies SOAP | RF-FIS-004, 030, 050; RN-FIS-012, 066; CTR-FIS-16 |
| §12.5 `clsLibroIVA` | RF-FIS-095, 113, 115, 116, 120; RN-FIS-094 a 097; CTR-FIS-09 |
| §12.6 `clsLibroIVAdigital` | RF-FIS-122, 123; RN-FIS-100, 101; CTR-FIS-13 |
| §12.7 `clsFacturacionVarios` | RF-FIS-142, 152; RN-FIS-117, 118 |
| Implicancias para CoopApps | §1; §2 |
| Recomendación 1 Certificados por tenant | RF-FIS-024 a 026, 028; PA-FIS-03 |
| Recomendación 2 Caché del ticket | RF-FIS-027 |
| Recomendación 3 Cola de autorización | RF-FIS-038 a 040, 052 |
| Recomendación 4 Lotes B/C | RF-FIS-054; PA-FIS-04 |
| Recomendación 5 Condición IVA del receptor (RG 5616) | RF-FIS-052, 075 |
| Recomendación 6 Importes en decimal | RF-FIS-045; RN-FIS-037 |
| Recomendación 7 Tributos con mapeo explícito | RF-FIS-047; CTR-FIS-01 |
| Recomendación 8 CAEA completo | RF-FIS-068, 069; RN-FIS-061; PA-FIS-01 |
| Recomendación 9 CESP/LQSP | RF-FIS-071; PA-FIS-02 |
| Recomendación 10 Padrón | RF-FIS-016 |
| Recomendación 11 Libro IVA | RF-FIS-112, 122 |
| Recomendación 12 Modo pasarela | RF-FIS-154; PA-FIS-08 |
| Recomendación 13 QR y código de barras | RF-FIS-061 |
| Duda 1 Mapeo de tributos | Resuelta: CTR-FIS-01 |
| Duda 2 CESP vigente | PA-FIS-02 |
| Duda 3 CAEA al emitir | RF-FIS-066; RN-FIS-055; CTR-FIS-05 |
| Duda 4 Parámetro 2427 | Descartado: sin uso (§14, `PRM-FIS-012`) |
| Duda 5 Padrón A13 sin llamadas | RN-FIS-065; PA-FIS-10 |
| Duda 6 Llamadas a carpetas IN/OUT | Descartado: carpetas reemplazadas por API (CTR-FIS-11) |
| Duda 7 Fila con `ESTADO = "A"` | RN-FIS-092 |
| Duda 8 Errores 10040/10242/10243 | RF-FIS-052; tabla normativa de errores con texto vigente |
| Duda 9 Defectos a no replicar | RF-FIS-029; RN-FIS-102, 119; CTR-FIS-01 a 13 |
| Duda 10 Topes y fechas de ARCA | Tablas normativas (`PRM-FIS-012`, `PRM-FIS-013`, `PRM-FIS-024`); CTR-FIS-20 |

### 22.6 Otras RN

| Fuente | Destino |
|---|---|
| RN-01 §17.1 IVA en el cálculo | RF-FIS-078, 080; RN-FIS-073 |
| RN-01 §17.2 Percepciones e IIBB | RF-FIS-079, 081, 082, 086, 087, 093; RN-FIS-074 a 082 |
| RN-01 §18 (lo fiscal) | RN-FIS-083 |
| RN-02 §11.1 | RN-FIS-084 |
| RN-02 §11.2 a §11.4 Terceros e importaciones | RF-FIS-137; RN-FIS-114 |
| RN-02 §13.1 ENARGAS | RF-FIS-145; RN-FIS-115; CTR-FIS-14 |
| RN-02 §13.2 ENACOM | RF-FIS-146; RN-FIS-116; PA-FIS-13 |
| RN-02 §13.3 y §13.3.1 Exportadores y regímenes | RF-FIS-094, 111, 121, 125, 128, 131, 132; RN-FIS-099, 103, 104, 107 a 110 |
| RN-08 §3.1 a §3.3 Retenciones | RF-FIS-097 a 101, 103; RN-FIS-111, 112 |
| RN-08 §3.4 Certificados y presentación | RF-FIS-104, 105; RN-FIS-113 |
| RN-08 §3.5 Exportación de retenciones | RF-FIS-094, 107, 125 |
| RN-08 §3 ("retención" de prepagas) | Descartado en M06: M03/M07 (CTR-FIS-18) |
| RN-11 §4 Reguladores y FECESCOR | RF-FIS-140, 144, 145, 147; PA-FIS-14, 16 |
| RN-09 Parámetros fiscales | §14 (PRM-FIS-001 a 121, cada uno con su V2); parámetros no fiscales listados al final de §14 con su anexo dueño |
| DEC-018 (ARCA sin respuesta en mostrador) | RF-FIS-056 |
| DEC-035 (número fiscal al emitir; reenvío del mismo número) | RF-FIS-053 (**reemplazado por DEC-107** en el reenvío del mismo número) |
| DEC-107 (rechazado por ARCA vuelve a borrador; renumeración desde el último autorizado) | RF-FIS-053, RF-FIS-067; `fiscalAuthorizations.issueAttempt`, `rejectionKind`, `cancelReason` e índices; §8.1; 9.2 paso 8; 9.4 paso 3; 9.5 paso 4; EVT-FIS-02; §12.2 (EVT-FAC-22, EVT-FAC-23); CTR-FIS-21 |
| Alineación con M14, M15 y M17 de las obligaciones propias (DEC-095, 10-11-2026) | EVT-FIS-13 (`legalEntityId`, `ownTaxObligationId`, `taxAgentRegistrationId`, `replacesObligationId`); EVT-FIS-26 `fis.obligation.cancelled` (nuevo); `taxObligations.capitalBaseRef`, `cancelReason`, `replacesObligationId`, `replacedByObligationId`; §8 `taxObligations`; RF-FIS-169; RN-FIS-133 puntos 5, 7 y 8; `ownTaxObligations.capitalBase` (resuelto el [VERIFICAR] de `capitalEventTypes[]`); §2.2 frontera con M17; §12.2 EVT-INS-22. Ronda de cierre (10-11-2026; M14 §8.9 ya no anula sola una ejecución `delivered` o `sentToBank`): RN-FIS-133 punto 9 (anulación con el pago en curso); estado `cancellationPending` y campos `paymentConflict` y `creditBalanceAmount` de `taxObligations`; §8 `taxObligations` (`ordered` → `cancellationPending` → `cancelled`); EVT-FIS-26 suma `cancellationStatus` y `creditBalanceAmount`; §12.2 `tes.paymentExecution.executed` y `.voided` |
| Alineación con M01 y M12 (DEC-097, DEC-099, DEC-102; 10-11-2026) | `vatRateMatrix.supplyUsageClasses[]` y RF-FIS-079, RN-FIS-073 (DEC-102, `premiseUsages.usageClass`); `withholdingsApplied.supplierCuit` y `supplierPersonId`, RF-FIS-102 (DEC-097); RF-FIS-043 y §12.2 EVT-PER-27 (DEC-099) |
| DEC-038 (caída de ARCA en masiva) | RF-FIS-069 |
| DEC-053 (certificado ARCA: CSR en plataforma o PFX) | RF-FIS-025; PA-FIS-03 (Respondida); `arcaCredentials.credentialRef` |
| DEC-054 (IIBB: Córdoba en O4, resto en O8) | RF-FIS-087, RF-FIS-132; PA-FIS-09 (Respondida) |
| DEC-064 (entidades jurídicas) | RF-FIS-167; RN-FIS-130; `legalEntityId` en `fiscalProfiles`, `fiscalSurveys`, `taxAgentRegistrations`, `arcaCredentials`, `pointsOfSale`, `fiscalAuthorizations`, `arcaSubmissions`, `caeaPeriods`, `cespAuthorizations`, `withholdingsApplied`, `taxObligations`, `vatLedgers`, `arcaReceivedImports`, `regimeFilings`, `thirdPartyAgreements`; RN-FIS-131 (EVT-CFG-19/20, RF-CFG-138); escenarios 46 y 47 |
| DEC-074 (bóveda `integrationSecrets` de T06) | `arcaCredentials.credentialRef` |
| DEC-083 (convenio de terceros como contrato accesorio) | RN-FIS-129; `thirdPartyAgreements.moraPolicy` |
| DEC-093 (factura agrupada sin mezclar LQSP y factura común; aporte A1) | Glosario LQSP; RF-FIS-072 y RF-FIS-076 (leen la marca `tenantServices.profile.billing.publicServiceSettlement` de M02, RF-CAT-117); RN-FIS-072; RN-FIS-122; `conceptFiscalCases.publicServiceAccessory`, `accessoryApproval` y `caseCode = publicServiceAccessoryOnly`; PA-FIS-23; RN-FAC-040 de M05 |
| DEC-094 (LQSP con CESP; aporte A2) | Nota de §5.7; RF-FIS-071; glosario LQSP; PA-FIS-02 (actualización); PA-FIS-24; RG 3571/2013 como régimen de información (RF-FIS-128) |
| DEC-095 (obligaciones y exenciones propias; aporte A3) | RF-FIS-169; RN-FIS-133; `ownTaxObligations` (§7.39); `taxObligations.ownTaxObligationId`; §8.13; PAN-FIS-04 (pestaña); API-FIS-82; §2.2 (M17); PA-FIS-25 |
| DEC-102 (uso del suministro en la alícuota de IVA; aporte A10) | RF-FIS-079; RN-FIS-073; `vatRateMatrix.supplyUsageClasses[]` (antes `supplyUsageIds[]`; alineado con `premiseUsages.usageClass` de M01 RF-PER-089 el 10-11-2026) y `supplyUsageKey`; `taxCalculationTraces.lines[].supplyUsageId` y `supplyUsageClass`; PRM-FIS-125; PA-FIS-26 |
| HUECO-OTR-04 (depósito en garantía; RN-CON-123) | RF-FIS-165; RN-FIS-128; PRM-FIS-124; `conceptFiscalCases`; ESC-FIS-44 (antes escenario 44) |
| HUECO-ALU-01 (corte por deuda de terceros; RN-MOR-141/142) | RF-FIS-166; RN-FIS-129; EVT-FIS-24; ESC-FIS-45 (antes escenario 45) |
| PA-CFG-05 de T04 (padrones; trasladada con CTR-DAT-13) | PA-FIS-18 (asumida la recomendada, DEC-072); RF-FIS-168; RN-FIS-132; `taxpayerRegistries.maintainedBy`; ESC-FIS-48 (antes escenario 48) |
| HUECO-CAP-04 (aporte de capital; resolución final) | RF-FIS-161; RN-FIS-124; PRM-FIS-122 con default `untaxedInInvoice` y validación legal pendiente |
| T10 REP-BIA-015 a REP-BIA-024 (informes regulatorios) | RF-FIS-139, RF-FIS-144 a RF-FIS-150 |
| T05 §20 (CTR-DAT-14, 16, 17, 72, 75 y §7.2) | `voucherTypeId`; `numberSequences` de M05; `pointsOfSale` (antes `fiscalPointsOfSale`); `credentialRef` (antes `vaultRef`, `csrVaultRef`); `storedFileId` (antes `fileAssetId`, `pdfAssetId`, `assetId`, `reportAssetId`, `fiscalLogoAssetId`); `treasuryAccountId` (antes `bankAccountRef`); `ledgerAccountId`; `FACT_EPEC` → M12 |

### 22.7 CAT (§5 completo)

Todas las tablas de CAT §5 y las tablas fiscales del DFA quedan en §7.36: `ACTAFIP`, `ALI_IBR`, `ALI_IBR_CF`, `ALI_IBR_COMP`, `ALI_IVA`, `ALI_IVA_CF`, `CAT_RETG`, `CESPAFIP`, `COMPPOS`, `CVPIIBB`, `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP`, `EMPAFIP`, `ENGAS_CANTMESES`, `IIBB_LUA`, `IVAVTA`, `PROD_SER_RET`, `PTOVENTA`, `RETE_TIPO`, `RETE_TIPO_BASE`, `RETS_TIPO`, `RET_COM`, `SITIBR`, `SITIVA`, `IMPUESTO`, `TERCEROS`, `FACTURAS_TERCEROS`, `COMPROBANTES_ADM`, `IMPUESTOS_X_CAT`, `PROVEED_RET`, `CON_COM_RET`; `IVACOM` y `FPALIC_IVA` (propiedad de M12), `FACT_EPEC` (M12 `supplierInvoices.wholesaleSupply`, CTR-DAT-75), `RELACION_COMP` (M05). Migración de cada una en §19.

### 22.8 INV (formularios ProCoop)

| Formulario | Destino |
|---|---|
| frmFacturacionElectronica | PAN-FIS-09, PAN-FIS-11; RF-FIS-055, 060 |
| frmProcesoAutomatico | PAN-FIS-09; RF-FIS-060 |
| frmEnvioPmovil | PAN-FIS-09 |
| frmConsultaNumComAFIP | PAN-FIS-12; RF-FIS-037 |
| abm_CespAfip | PAN-FIS-14, PAN-FIS-15; RF-FIS-071 |
| abm_Cvpiibb | PAN-FIS-16; RF-FIS-090 |
| abm_sit_iva | PAN-FIS-17; RF-FIS-075 |
| abm_ali_iva | PAN-FIS-18; RF-FIS-078 |
| abm_Impuesto, abm_Electronica_Iva | PAN-FIS-19 |
| abm_Sit_Ibr, abm_ali_Ibr, abm_ali_ibr_comp | PAN-FIS-20; RF-FIS-085 |
| frmLiquidacionPercepciones, frmLiquidacionPercepciones_BsAs | PAN-FIS-21; RF-FIS-087 |
| frmAlicuotaDeterminada | PAN-FIS-22; RF-FIS-087 |
| abm_Personas (validación de CUIT) | PAN-FIS-23; RF-FIS-015 |
| abm_PtoVenta, abm_comprob (flags CAI) | PAN-FIS-08; RF-FIS-033 a 036 |
| abm_ActAfip | RF-FIS-023 (catálogo sincronizado; asignación en M02) |
| abm_Rets_Tipo | PAN-FIS-27; RF-FIS-110 |
| frmCargaRetenciones | PAN-FIS-26; RF-FIS-110 (registro en M07) |
| frmLibroIvaVenta | PAN-FIS-29 a 32; §5.12 y §5.13 |
| frmExportarSIRCAR | PAN-FIS-31; RF-FIS-131 |
| abm_Terceros | PAN-FIS-33; RF-FIS-134 |
| frmResultadosCuotaTerceros | PAN-FIS-34; RF-FIS-139 |
| frmCobranzaTerceros | Cobro en M07; rendición en RF-FIS-139 |
| frmEnargasPEN2067 | PAN-FIS-35; RF-FIS-145 |
| frmEnargasConceptos, frmEnargasConceptos_Config, frmEnargasTablas | PAN-FIS-36; RF-FIS-145 |
| frmEnacom | PAN-FIS-35, PAN-FIS-36; RF-FIS-146 |
| frmInformeSecretariaElectrica | PAN-FIS-35; RF-FIS-147 |
| frmComprobnatesAdministracionPublicaRAW, frmComprobantesAdministracionPublicaRAWConsulta | PAN-FIS-37; RF-FIS-151 a 153 |
| Modo "solo factura electrónica" (sin formulario; carpetas IN/OUT) | PAN-FIS-38; RF-FIS-154 a 156 |
| Avisos de inicio (pendientes, CESP, certificado) | PAN-FIS-39; RF-FIS-026, 057, 074 |
