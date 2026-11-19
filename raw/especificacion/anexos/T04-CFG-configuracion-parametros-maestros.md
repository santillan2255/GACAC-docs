# T04 CFG — Configuración versionada, parámetros, tablas maestras y geografía

| Campo | Valor |
|---|---|
| Versión | 1.0 (lógico); alineación destino **1.1-impacto** 19-11-2026 (§7.0; **DEC-114**) |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma (motor transversal consumido por ERP, CRM, Landing-autogestión, Cobranza, Pasarelas, Impuestos y APIs) |
| Olas | O0 (registro de parámetros y lector tipado como librería compartida; `legalEntities` y `branches` con `legalEntityId` obligatorio en los documentos económicos, DEC-064 / REQ-DEC-064), **O1** (motor completo: publicación versionada, tablas maestras, geografía/calles, calendarios, enumeraciones, vistas guardadas), O2 (campos extra y personalización de formularios para Personas/Cuentas, precarga demo), O4 (tablas fiscales de referencia y padrones), O5–O6 (índices de mora y cotizaciones para cobranza/mora), O11 (migración repetible del catálogo `VARIABLE`) |
| Dueño de datos | `parameterDefinitions`, `parameterValues`, `configVersions`, `masterTableDefinitions`, `enumerations`, `enumerationItems`, `countries`, `provinces`, `departments`, `localities`, `postalCodes`, `streets`, `streetAliases`, `streetProposals`, `neighborhoods`, `zones`, `cadastralDistricts`, `geocodeRequests`, `calendars`, `holidays`, `economicIndexSeries`, `economicIndexValues`, `currencies`, `vatConditions`, `vatRates`, `grossIncomeConditions`, `grossIncomeRates`, `identityDocumentTypes`, `taxRegistries`, `taxRegistryEntries`, `platformTableReleases`, `platformTableAdoptions`, `customFieldDefinitions`, `formCustomizations`, `savedViews`, `masterImportJobs`, `seedPacks`, `seedApplications`, `legacyParameterMappings`, `legalEntities` (COL-CFG-41), `branches` (COL-CFG-42), `workstations` (COL-CFG-43) y las tablas legales de sueldos de plataforma `payrollOfficialCodes` … `laborLawParameters` (COL-CFG-44 a 53, §7.17; CTR-DAT-73). Absorciones de T05: `vatConditions`, `vatRates`, `grossIncomeConditions`, `grossIncomeRates`, `taxRegistries` y `taxRegistryEntries` pasan a M06 (COL-FIS-15 a 21, CTR-DAT-13); `savedViews` pasa a `dataTableViews` de T03 (CTR-DAT-11); `sequences` pasa a `numberingSequences` de T11 y `numberSequences` de M05 (CTR-DAT-16). Esquema compartido `geoReference` (subdocumento embebido por M01/M10/M09). |
| Fuentes consolidadas | BASE §39 (39.1–39.6 completa), §41, §71, §77 (GEO-001..003, CU-GEO-01), §79 (GEO-F1..F6), §80, §81 (mecanismo de publicación/versión; COP-001..003 en lo que toca al motor), §84 (perfil de configuración por servicio), §93 (ESP-001..006), §98, §106; AGR-009, AGR-010, AGR-017; DFA M2 (§3 Parámetros y tablas maestras) y DFA §32 (patrones del modelo); REL §5 (Tablas del sistema y Tablas de Facturación); RN-09 §1, §2.1–2.4, §3, §5.3–5.5, §6.1–6.3, §7, §8; CAT §28, §29, §30 completas, más las tablas referidas por DFA M2 ubicadas en CAT §1, §2, §4, §5, §8, §15, §16, §17, §23, §25, §27, §31; INV `Configuracion.md` completo; CNX §2.3, §2.4, §2.6, §4.2, §4.4, §4.6 |

> **Anexos complementarios:** `T04b-CFG-catalogo-parametros-procoop-parte1.md` … `parte4.md` contienen el catálogo exhaustivo de los 1.536 parámetros de ProCoop (uno por fila, con su `PRM-<COD>-NNN`, clave semántica y destino). Este anexo define el **modelo** de ese catálogo, la **convención de claves**, los **ámbitos**, el **motor** y los **maestros comunes**. Los parámetros funcionales de cada módulo se especifican (o referencian desde T04b) en la sección 14 del anexo de ese módulo. **DEC-114:** se conservan T04 (motor) y T04b (catálogo central); el stack físico es Azure SQL esquema `cfg` + servicios .NET, sin disolver el motor en los Mxx.


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Proveer a CoopApps un **motor de configuración único, tipado, versionado y auditable por tenant** que:

1. Reemplace la tabla clave/valor `VARIABLE` (y `VARIABLE_PMOVIL`) de ProCoop —1.536 parámetros identificados con números sin orden, tres columnas de valor en paralelo, autoalta silenciosa y sin validación de rangos, dependencias ni historia— por **parámetros declarados en código** con clave semántica (`fac.vencimientos.cantidadMaxima`), tipo, validación, dependencias, valor por defecto, ámbito (plataforma / tenant / sucursal / servicio / categoría / usuario), vigencia y versionado.
2. Garantice que cada cambio de configuración se **publique como una versión coherente** (AGR-009): con sus dependencias, validación, simulación, revisión y fecha efectiva; separando cambios comerciales, fiscales, operativos, de presentación, de seguridad y técnicos, y sin dejar nunca un plan sin precio o una referencia rota por una actualización parcial.
3. Conserve **historia bitemporal** (AGR-010): fecha efectiva del valor y fecha en que el sistema lo registró, para poder explicar qué configuración usó cada documento y reconstruir lo conocido en cualquier fecha.
4. Ofrezca un **editor uniforme de tablas maestras** (búsqueda, vigencias, "en uso por", unificación de duplicados, importación/exportación), con **importación de padrones** y **precarga de catálogos de ejemplo** (BASE §39 completa).
5. Mantenga los **maestros comunes de plataforma** —geografía argentina completa con catálogo nacional de calles (BASE §77, fuentes §79), calendarios/feriados/días hábiles (AGR-017), índices económicos (inflación, cotizaciones, tasas para mora) y tablas fiscales comunes (condiciones y alícuotas de IVA e Ingresos Brutos, tipos de documento, padrones)— **mantenidos por plataforma con fuente y vigencia y adoptables por cada tenant**.
6. Convierta las **tablas genéricas y los mecanismos de extensión** de ProCoop (`DATOSEXT`/`DATOSETB`, `PROPIEITEMS*`, `*_EXTRAS`, `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES`, motor de pantallas `ENTIDADES`/`frmTransicion`) en **enumeraciones configurables, campos extra tipados, personalización acotada de formularios y vistas guardadas**.
7. Saque de la base y de archivos locales toda la **configuración técnica** (lo que ProCoop guarda en `Configuracion*.pro` con ofuscación reversible) y la lleve a **variables de entorno** (infraestructura) y **bóveda de secretos por tenant** (credenciales).

## 2. Límite y responsabilidades

### 2.1 Qué hace CFG

| # | Responsabilidad |
|---|---|
| 1 | Registro declarativo de definiciones de parámetros (`parameterDefinitions`) sincronizado desde el código en cada despliegue; equivalencias `COD_VAR → clave`. |
| 2 | Almacenamiento de valores por ámbito con vigencia y fecha de registro (`parameterValues`). |
| 3 | Función única de lectura `config.get(clave, contexto)` con precedencia documentada de ámbitos, fecha de interpretación y caché invalidada por evento. |
| 4 | Ciclo de vida de **versiones de configuración** (`configVersions`): borrador → validación → simulación → revisión → aprobación → programación → publicación → reemplazo/reversión. Es el mecanismo que usan todos los módulos para publicar su configuración (tarifas, planes, formularios, tablas). |
| 5 | Motor genérico de **tablas maestras**: registro de tablas (`masterTableDefinitions`), editor uniforme, vigencias, "en uso por", unificación, importación/exportación, auditoría. |
| 6 | **Enumeraciones configurables** (reemplazo de listas cerradas `TIP_CTRL = 2`, estados genéricos de presentación, ocupaciones, estado civil, etc.). |
| 7 | **Geografía**: países, provincias, departamentos/partidos, localidades, códigos postales, calles nacionales (plataforma); barrios, zonas, distritos y secciones catastrales, calles locales y alias (tenant); servicio de búsqueda/normalización y de geocodificación con Google Maps; esquema `geoReference` con estados de precisión. |
| 8 | **Calendarios y feriados**; servicio de días hábiles con zona horaria del tenant. |
| 9 | **Índices económicos**: series y valores (inflación, cotizaciones, tasas/índices de mora), plataforma y tenant, con adopción. **Monedas**. |
| 10 | **Tablas fiscales de referencia** (condiciones de IVA, alícuotas de IVA, condiciones de IIBB, alícuotas de IIBB por jurisdicción, tipos de documento con códigos ARCA/INAES/ENARGAS/OCEBA) y **padrones** (ingesta, vigencia, consulta por CUIT). **Reemplazado por M06 (CTR-DAT-13)** salvo los tipos de documento (`identityDocumentTypes`) y el mecanismo de publicación y adopción de tablas de plataforma (§7.10), que siguen en CFG. |
| 11 | **Campos extra tipados** por entidad (definición y validación; los valores viven en el documento dueño). |
| 12 | **Personalización acotada de formularios** y **vistas guardadas** de grillas (reemplazo del motor de pantallas configurable de ProCoop). Las vistas guardadas: **Reemplazado por `dataTableViews` de T03 (CTR-DAT-11)**. |
| 13 | **Precarga de catálogos de ejemplo** (paquetes semilla, BASE §39) en tenants demo. |
| 14 | Clasificación de la **configuración técnica** (entorno vs bóveda vs parámetro) y tipo de parámetro `secretRef` (referencia, nunca valor). |
| 15 | Vista de **completitud del perfil de configuración por servicio** (BASE §84, §93) a partir de las dependencias declaradas por cada módulo. |
| 16 | **Entidades jurídicas y sucursales del tenant** (DEC-064, O0): `legalEntities` con los datos legales y fiscales básicos de cada entidad emisora, la entidad por defecto creada con el tenant y el subdocumento `employer` que completa M16; `branches` con su entidad jurídica; `workstations` (puestos físicos, O1); resolución de la entidad de un documento económico (§5.18, §7.14 a §7.16). |
| 17 | **Tablas legales de sueldos de plataforma** (códigos oficiales, alícuotas, topes, SMVM, Ganancias, embargabilidad, LCT) con fuente, vigencia y adopción por tenant (§7.17, CTR-DAT-73, O9). |

### 2.2 Qué NO hace CFG

| No hace | Lo hace |
|---|---|
| Ciclo de vida del tenant, licencias, módulos contratados/activados, perfil legal de la cooperativa (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo — variables 518–527 y 709), sucursales como estructura organizacional, anuncios del proveedor. **Perfil legal y sucursales: Reemplazado por RF-CFG-134 y RF-CFG-140 (DEC-064)**: viven en `legalEntities` y `branches` de este anexo; T01 conserva el alta del tenant y sus datos de contratación, con los que se crea la entidad por defecto (§9.16); el logo es marca de T03 | T01 PLA |
| Usuarios, roles, perfiles, capabilities, alcance de datos, autorización en el momento, auditoría de login | T02 IAM |
| Diccionario de etiquetas por tenant (`dict:`), branding, design system, `DataTable`, `ExcelImportWizard`, mapa del sitio y menú `siteMapGroups` | T03 UXD (CFG consume `DataTable` y `ExcelImportWizard` y aporta las vistas guardadas y las definiciones de importación de maestros) |
| Modelo canónico de cada entidad de negocio y sus campos de primera clase (incluidas las columnas fijas de las tablas `*_EXTRAS` que se convierten en campos reales) | T05 DAT y el anexo dueño de cada entidad |
| Bóveda de credenciales por tenant, "probar conexión", fichas de integración, layouts de archivos de intercambio (`MODEINT`, `FORMAINT`, `EXPORTADOR*`, `ARCHIVOS`, `TIPOMOD`, `SERVINT`, `DATOSINT`, `TIP_ARC`) | T06 INT |
| Migración de datos y paralelo con ProCoop (ejecución); CFG define las equivalencias y transformaciones de su dominio | T07 MIG |
| Infraestructura, variables de entorno, observabilidad, migraciones de esquema en el pipeline, retención legal | T08 NFR |
| Plantillas de mensajes y variables de combinación (`PLANTILLA`, `VARIABLEPLANT`), correo interno, SMS, WhatsApp | T09 COM |
| Reportes, editor de reportes, tablero de indicadores (`TIPO_TAB`, `GRUTAB`, `GRUPTAB`, `ESTATAB`, `TABLAS_POWERBI`), listados personalizados | T10 BIA |
| Motor de workflow y autorizaciones (CFG lo invoca para la revisión de versiones), estados de negocio por entidad (`ENTIDA_ESTADOS`, `ESTADOS`), adjuntos, expediente documental, firma digital, jobs programados genéricos | T11 WFL |
| Domicilios de personas, inmuebles, punto de prestación, catastro del inmueble (Cod/Sec/Man/Par/PH/Lote) | M01 PER (usa geografía y `geoReference` de CFG) |
| Copia de servicios entre tenants (selección de componentes, mapeos, lanzamiento) | M02 CAT (genera una `configVersion` en borrador del destino mediante la API de CFG) |
| Rutas de lectura y orden de recorrido (`CALLES.RUTA/ORDEN/SECTOR`, `RNQCALL`) | M03 MED |
| Tarifas, cuadros tarifarios, cargos por zona (`ZONAS.IMPORTE`, `REC_BALDIO`), editor de fórmulas | M04 TAR |
| Aplicación de IVA/IIBB/percepciones, porcentajes por condición (`ALI_IVA_CF`, `ALI_IBR_CF`, `ALI_IBR_COMP`), CVP por punto de venta (`CVPIIBB`), puntos de venta ARCA (`PTOVENTA`, con `legalEntityId`), perfil fiscal completo de cada entidad jurídica (agente de percepción/retención, credenciales ARCA), tablas fiscales de referencia y padrones (CTR-DAT-13) | M06 FIS |
| Distribución postal de facturas (`POSTALES` = empresas de distribución) y operaciones por comprobante (`OPERACIONES`, `OPE_COM`) | M05 FAC |
| Cálculo de intereses/recargos por mora con los índices | M08 MOR |
| Agenda y calendario de usuarios (`CALENDARIO`, `CALENDARIO_TIPO`), actividades internas, requisitos de trámites, agente de hardware local y terminales (`EQUIPOS`) | M09 CRM |
| GIS de redes, importación KML, puntos de red | M10 TEC |
| Combos de productos (`COMBOS`) | M11 VEN / M13 STK |
| Cuentas contables de alícuotas (`ALI_IVA.CTA_*`), secciones/centros de costo (`SECCION`), ajuste por inflación contable | M15 CON |

### 2.3 Qué delega y a quién

- **A T11 WFL**: la revisión y aprobación de una `configVersion` (instancia de workflow con política según clase de cambio), y la ejecución programada de la publicación como job.
- **A T06 INT**: la custodia de secretos referenciados por parámetros `secretRef` y por la configuración técnica; las integraciones con Georef, Google Maps, BCRA, INDEC, ARCA y fiscos provinciales (fichas), que CFG invoca para ingestas y geocodificación.
- **A T03 UXD**: las etiquetas visibles (`labelKey`, `descriptionKey`, `helpKey`) de parámetros, enumeraciones, campos extra y tablas.
- **A cada módulo**: la declaración de sus parámetros (en su paquete de dominio), sus validadores cruzados y sus simuladores (por ejemplo, M05 simula la primera factura de un plan al publicar una tarifa).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Parámetro | Valor de configuración que cambia el comportamiento del sistema sin cambiar código. | `dict:cfg.glosario.parametro` | Variable (`VARIABLE`, `Busca_V2_*`) |
| Definición de parámetro | Declaración en código de un parámetro: clave, tipo, validación, ámbitos permitidos, default, clase de cambio, dependencias, equivalencias legacy. | `dict:cfg.glosario.definicionParametro` | Declaración en `clsVariables.GetChequeoVariables` + `ChequearVariable` |
| Clave semántica | Identificador textual estable `<mod>.<recurso>.<atributo>` de un parámetro. | `dict:cfg.glosario.clave` | `COD_VAR` (número) |
| Ámbito | Nivel al que se asigna un valor: plataforma, tenant, entidad jurídica (DEC-096), sucursal, servicio, categoría o usuario. | `dict:cfg.glosario.ambito` | Implícito entre `VARIABLE`, `USERS`, `EQUIPOS` y `.pro` |
| Valor efectivo | Valor que resulta de aplicar la precedencia de ámbitos y la fecha de interpretación. | `dict:cfg.glosario.valorEfectivo` | Valor de la fila `VARIABLE` |
| Versión de configuración | Conjunto coherente de cambios (parámetros, registros maestros, enumeraciones, campos extra, personalizaciones, configuración de módulos) que se valida, simula, revisa y publica junto, con fecha efectiva. | `dict:cfg.glosario.versionConfiguracion` | No existe (se pisa el valor) |
| Publicación | Acto que vuelve vigente una versión aprobada a partir de su fecha efectiva. | `dict:cfg.glosario.publicacion` | `Actu_V2` (escritura directa) |
| Fecha efectiva | Desde cuándo rige un valor (`validFrom`) y hasta cuándo (`validTo`). | `dict:cfg.glosario.fechaEfectiva` | Solo en cuadros tarifarios (vigencia desde/hasta) |
| Fecha de registro | Cuándo el sistema conoció el valor (`recordedAt`). | `dict:cfg.glosario.fechaRegistro` | `AUDITORIA.FECHA` (solo sentencia) |
| Clase de cambio | Clasificación de un cambio: comercial, fiscal, operativo, presentación, seguridad, técnico. Determina revisión y simulación. | `dict:cfg.glosario.claseCambio` | No existe |
| Dependencia | Relación declarada entre parámetros/registros (A exige B, A excluye B, A habilita B). | `dict:cfg.glosario.dependencia` | Texto en `NOM_VAR` ("es necesario tener habilitada la variable 3064") |
| Simulación | Ejecución sin efectos de los simuladores de los módulos afectados con la configuración propuesta. | `dict:cfg.glosario.simulacion` | No existe |
| Tabla maestra | Catálogo de valores de referencia con editor uniforme (geografía, feriados, enumeraciones, tablas fiscales, etc.). | `dict:cfg.glosario.tablaMaestra` | "Tablas del sistema" (`Tab_<n>`, `abm_Base_Simple`) |
| Tabla de plataforma | Tabla maestra mantenida por la plataforma (tenant `PLATFORM`), con fuente y vigencia, visible para todos los tenants. | `dict:cfg.glosario.tablaPlataforma` | No existe (cada base tiene su copia) |
| Adopción | Decisión del tenant de usar una tabla o serie de plataforma en modo seguir / fijar versión / copiar. | `dict:cfg.glosario.adopcion` | No existe |
| Enumeración | Lista cerrada configurable de valores con código estable, etiqueta, orden, vigencia y códigos externos. | `dict:cfg.glosario.enumeracion` | `TIP_CTRL = 2` + `CONF_CTRL`; tablas simples (`EST_CIVIL`, `OCUPACIO`, `ESTADOS`) |
| Campo extra | Atributo adicional tipado definido por el tenant para una entidad. | `dict:cfg.glosario.campoExtra` | `DATOSEXT`/`DATOSETB`, `PROPIEITEMS*` |
| Personalización de formulario | Ajuste declarativo de un formulario (ocultar, obligatorio, solo lectura, default, etiqueta, orden, valores permitidos). | `dict:cfg.glosario.personalizacionFormulario` | `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES` |
| Vista guardada | Configuración guardada de una grilla: columnas, filtros, orden, agrupación, formato condicional; privada o compartida. | `dict:cfg.glosario.vistaGuardada` | `ENTIDACOU`, `frmTransicion_Vistas`, `Save_GridLayout` |
| Padrón | Lista oficial de sujetos (por CUIT) con régimen, alícuota y vigencia. | `dict:cfg.glosario.padron` | `IIBB_LUA`, importación AFIP |
| Serie de índice | Secuencia temporal de valores de un índice (IPC, cotización, tasa). | `dict:cfg.glosario.serieIndice` | `TABINFL`+`INFLACIO`, `COT_DOL`, `TABMORA`+`INDICESMORA` |
| Calendario | Conjunto de días no hábiles aplicable (nacional, provincial, municipal, del tenant). | `dict:cfg.glosario.calendario` | `FERIADOS` |
| Día hábil | Día que no es fin de semana configurado ni feriado del calendario aplicable. | `dict:cfg.glosario.diaHabil` | Cálculo con `FERIADOS` |
| Georreferencia | Ubicación de una dirección: punto, fuente, precisión y estado (confirmado, aproximado, pendiente de revisión). | `dict:cfg.glosario.georreferencia` | Latitud/longitud del servicio |
| Calle local | Calle cargada por un tenant que no existe (aún) en el catálogo nacional. | `dict:cfg.glosario.calleLocal` | `CALLES` (siempre local) |
| Unificación | Fusión de dos registros maestros duplicados redirigiendo sus referencias. | `dict:cfg.glosario.unificacion` | `btnUinificar_Click` en barrios, localidades y calles; `frmUnificarDomicilio` |
| Paquete semilla | Conjunto de catálogos y datos ficticios para demostración. | `dict:cfg.glosario.paqueteSemilla` | Base `PR_LAG_DEMO` |
| Referencia a secreto | Parámetro que apunta a un secreto en la bóveda; nunca contiene el valor. | `dict:cfg.glosario.referenciaSecreto` | Contraseñas en `.pro` o en `VARIABLE` |
| Equivalencia legacy | Correspondencia `tabla + COD_VAR (+ MOD_VAR)` → clave CoopApps con regla de transformación. | `dict:cfg.glosario.equivalenciaLegacy` | — |
| Entidad jurídica | Persona jurídica del tenant que emite documentos económicos, lleva contabilidad y emplea personal (cooperativa, mutual o sociedad vinculada). Un tenant tiene una o más (DEC-064). | `dict:cfg.glosario.entidadJuridica` | `EMPRESAS`; `SU_EMPRESAS` (empleador) |
| Entidad por defecto | Entidad jurídica marcada `isDefault`, creada con el tenant; se usa cuando ninguna regla resuelve otra. | `dict:cfg.glosario.entidadPorDefecto` | Empresa única del `.pro` |
| Sucursal | Lugar físico de la cooperativa (atención, caja, depósito, puntos de venta) que pertenece a una entidad jurídica. | `dict:cfg.glosario.sucursal` | Valores de `PTOVENTA.SUC_COM` (no hay tabla de sucursales en ProCoop; DEC-098; antes "Sucursal de `EMPRESAS`/`CAJASJP` [VERIFICAR]") |
| Puesto | Equipo o posición física de trabajo dentro de una sucursal (mostrador, caja, oficina) al que se asocian dispositivos y el agente local. | `dict:cfg.glosario.puesto` | `EQUIPOS` |

## 4. Actores, permisos y alcance

| Rol | Capabilities (`cod.recurso.accion`) | Alcance de datos |
|---|---|---|
| Superadministrador de plataforma | `pla.cfg.registro.ver`, `pla.cfg.defaults.editar`, `pla.cfg.tablasPlataforma.publicar`, `pla.cfg.equivalencias.editar`, `pla.cfg.semillas.administrar`, `cfg.*` sobre tenant `PLATFORM` | Plataforma; nunca datos de tenants salvo acceso de soporte temporal (T01/T02) |
| Curador de datos de plataforma | `pla.cfg.tablasPlataforma.editar`, `pla.cfg.tablasPlataforma.importar`, `pla.cfg.tablasPlataforma.publicar` (si es el segundo par de ojos), `cfg.geo.aprobarCalle` (propuestas de tenants) | Tablas de plataforma (geo, feriados nacionales/provinciales, índices oficiales, tablas fiscales, padrones públicos) |
| Soporte de plataforma (acceso temporal) | `cfg.parametros.ver`, `cfg.versiones.ver`; edición solo si el tenant lo concede en la sesión de soporte | Un tenant, durante la ventana autorizada, auditado |
| Administrador del tenant | `cfg.parametros.ver/editar`, `cfg.versiones.ver/crear/validar/simular/enviarRevision/programar/cancelar`, `cfg.maestros.*`, `cfg.enumeraciones.configurar`, `cfg.camposExtra.configurar`, `cfg.formularios.configurar`, `cfg.vistas.compartir`, `cfg.tecnica.ver`, `cfg.adopciones.configurar`, `cfg.entidadesJuridicas.ver/editar`, `cfg.sucursales.ver/editar`, `cfg.puestos.editar` (DEC-064) | Tenant completo |
| Configurador funcional de módulo | `cfg.parametros.ver`, `<mod>.configuracion.configurar` (edita solo claves cuyo `module` coincide), `cfg.versiones.crear/validar/simular/enviarRevision` | Su módulo; sucursales/servicios de su alcance (scope) |
| Revisor/aprobador de configuración | `cfg.versiones.aprobar`, `cfg.versiones.publicar`, `cfg.versiones.revertir` (más la capability del módulo para cambios comerciales/fiscales) | Tenant o módulos asignados; no puede aprobar versiones propias (PA-CFG-01) |
| Responsable fiscal del tenant | `cfg.fiscal.ver`, `cfg.fiscal.configurar` (adopciones, alícuotas propias), `cfg.padrones.importar`, `cfg.entidadesJuridicas.ver` | Tenant |
| Responsable de sueldos (M16) | `sue.estructura.configurar` para editar solo el subdocumento `employer` de `legalEntities` (API-CFG-55); `cfg.entidadesJuridicas.ver` | Entidades jurídicas que emplean personal |
| Operador de maestros | `cfg.maestros.ver/crear/editar/importar/exportar`, `cfg.geo.editar`, `cfg.geo.proponerCalle`, `cfg.maestros.unificar` (si se le otorga) | Tenant; sucursales/zonas de su alcance |
| Operador de atención / técnico | `cfg.geo.ver`, `cfg.geo.confirmarPunto`, lectura de maestros vía lookups | Su alcance (sucursal, zona, cuadrilla) |
| Usuario operativo | Lectura de maestros y enumeraciones a través de selectores; `cfg.vistas.crear` (vistas privadas) | Su alcance |
| Socio (PWA/landing) | Sin capabilities de CFG; usa el selector de dirección y mapa en flujos de M19/M01 | Sus propias solicitudes |
| Auditor | `cfg.parametros.ver`, `cfg.versiones.ver`, `cfg.historia.ver`, `cfg.historia.exportar` | Tenant (solo lectura) |
| Sistema (workers) | Identidad de servicio con `cfg.versiones.publicar` restringida a versiones `scheduled` y aprobadas; `pla.cfg.tablasPlataforma.importar` para ingestas | Según job |

**Regla de permisos de parámetros:** editar el valor de un parámetro exige `cfg.parametros.editar` **y** la capability de configuración del módulo dueño de la clave (`fac.configuracion.configurar` para `fac.*`). Los parámetros con `visibility = platformOnly` solo los ve y edita la plataforma. Los parámetros de un módulo no licenciado/activado (T01) no se muestran ni se pueden leer como habilitados.

## 5. Requisitos funcionales

### 5.1 Registro y modelo de parámetros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-001 | Cada parámetro se declara en código (paquete del módulo dueño) con: clave semántica, módulo, grupo, tipo, validación, ámbitos permitidos, default, clase de cambio, modo de vigencia, dependencias, visibilidad, sensibilidad, canal consumidor y equivalencias legacy. | RN-09 §7.1; DFA M2 mejora | Núcleo | O0 | Adoptado | Un test de CI falla si una clave usada en código no está declarada o si una declaración no tiene tipo, default o clase de cambio. |
| RF-CFG-002 | En cada despliegue un job idempotente sincroniza el registro de código con `parameterDefinitions` (alta, actualización de metadatos, deprecación) **sin pisar valores** del tenant. | RN-09 §2.3, §7.9 | Núcleo | O0 | Adoptado | Correr dos veces la sincronización no genera cambios; un valor configurado sobrevive a un cambio de descripción. |
| RF-CFG-003 | Una clave inexistente es un error de desarrollo: la lectura lanza excepción y registra alerta; nunca crea un registro "Sin Utilizar". | RN-09 §2.2, §7.3 | Núcleo | O0 | Reemplazado por mejora (deuda ProCoop) | `config.get('x.y.inexistente')` lanza `ConfigKeyNotDeclared`; no aparece fila nueva. |
| RF-CFG-004 | Tipos soportados: `boolean`, `integer`, `decimal`, `money`, `percentage`, `string`, `text`, `date`, `time`, `dateTime`, `duration`, `enum`, `multiEnum`, `reference` (FK a colección con filtro), `accountRef` (cuenta contable), `templateRef`, `email`, `url`, `phone`, `cuit`, `geoPoint`, `color`, `json` (con esquema Zod), `list<T>`, `secretRef`. | RN-09 §2.1 (`TIP_VAR` C/N/L/E/F/P, `TIP_CTRL` 1/2/5/6) | Núcleo | O0 | Adoptado | Cada tipo tiene validador, editor en PAN-CFG-03 y serialización probada. |
| RF-CFG-005 | Validaciones declarables: requerido, mínimo, máximo, paso, decimales, largo máximo, expresión regular, valores permitidos, referencia existente y activa, validador cruzado (función del módulo). | RN-09 §2.4 (no hay validación) | Núcleo | O0 | Adoptado | Guardar un valor fuera de rango devuelve 422 con el detalle por campo. |
| RF-CFG-006 | Dependencias declarables entre parámetros: `requires` (A habilitado exige B con valor válido), `excludes`, `enables` (B solo visible si A), `derivedDefault`. Se evalúan al validar una versión. | RN-09 §2.4; V2 #67 (turnero: "es necesario tener habilitada la variable 3064") | Núcleo | O1 | Adoptado | Publicar `crm.turnero.webHabilitado = true` sin `crm.turnero.habilitado = true` falla en validación con mensaje que nombra la dependencia. |
| RF-CFG-007 | El tipo mixto `P` de ProCoop (tres columnas a la vez) se descompone en parámetros tipados separados con una clave por significado. | RN-09 §2.1 (variable −1) | Núcleo | O0 | Adoptado | Ninguna definición tiene más de un tipo; T04b registra la descomposición. |
| RF-CFG-008 | Las fechas no se guardan como texto; `date` y `dateTime` se validan y se guardan en UTC con interpretación en la zona horaria del tenant. | RN-09 §2.1 (`F` como texto) | Núcleo | O0 | Adoptado | Un valor `31-02-2026` se rechaza. |
| RF-CFG-009 | Las claves siguen la convención de §14.2 y son únicas en la plataforma; una clave publicada nunca se reutiliza con otro significado (se depreca y se crea otra). | Instrucción del solicitante; RN-09 §7.1 | Núcleo | O0 | Adoptado | Linter de registro valida patrón y unicidad. |
| RF-CFG-010 | Cada definición declara su clase de cambio: `commercial`, `fiscal`, `operational`, `presentation`, `security`, `technical`. | AGR-009 | Núcleo | O1 | Adoptado | La clase aparece en ficha y determina revisión/simulación. |
| RF-CFG-011 | Cada definición declara modo de vigencia: `immediate` (rige al publicar), `effectiveDate` (con fecha efectiva elegida), `periodBoundary` (solo desde el inicio de un período del módulo, por ejemplo ciclo de facturación). | AGR-009, AGR-010, AGR-017 | Núcleo | O1 | Adoptado | Un cambio `periodBoundary` con fecha a mitad de ciclo se rechaza o se corre al inicio del próximo ciclo con aviso. |
| RF-CFG-012 | Los parámetros de un módulo no licenciado o no activado no se muestran ni se leen como habilitados (se devuelve el default "apagado"). | CNX §2.4; T01 | Núcleo | O1 | Adoptado | Tenant sin `tec` licenciado no ve claves `tec.*`. |
| RF-CFG-013 | Una definición puede declararse `sensitive` (cambio exige revisión con independencia de la clase) y `visibility` (`platformOnly`, `tenantAdmin`, `moduleConfigurator`). | BASE §39.1 ("una configuración sensible requiere aprobación") | Núcleo | O1 | Adoptado | Un parámetro sensible no puede publicarse por quien lo editó (PA-CFG-01). |
| RF-CFG-014 | Prohibido guardar secretos en parámetros: el tipo `secretRef` almacena solo el identificador del secreto de la bóveda (T06) y su estado (configurado / faltante / vencido). | RN-09 §1, §5.3, §7.6; CNX §4.6 | Núcleo | O1 | Adoptado | Un escáner de CI y un validador de runtime rechazan valores con patrón de contraseña/token en parámetros `string`. |
| RF-CFG-015 | Deprecación controlada: una definición `deprecated` sigue leyéndose, muestra aviso y su reemplazo (`replacedBy`); `removed` deja de leerse tras migrar valores. | RN-09 §2.3 (`FinalizarChequeos` traslada 21/383 → 742) | Estándar | O1 | Adoptado | Migración de valor de clave deprecada a reemplazo registrada en auditoría. |
| RF-CFG-016 | Cada definición registra equivalencias legacy (`VARIABLE`/`VARIABLE_PMOVIL`, `COD_VAR`, `MOD_VAR`, `TIP_VAR`, `TIP_CTRL`, `CONF_CTRL`) y la regla de transformación del valor (incluida inversión de booleanos negativos). | RN-09 §7.1 | Núcleo | O1 | Adoptado | La migración de una base ProCoop produce el valor equivalente para cada clave con equivalencia. |
| RF-CFG-017 | Los textos de personalización del portal que ProCoop guardaba como parámetros (`VARIABLE_PMOVIL` canal CoopOnline) pasan a claves del diccionario por tenant (T03) o a parámetros `presentation` de M19, según sean etiqueta o comportamiento. | RN-09 §7.4 | Estándar | O2 | Adoptado | Ningún texto visible del portal se lee desde un parámetro `string` sin pasar por diccionario. |

### 5.2 Ámbitos y lectura

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-018 | Ámbitos soportados: `platform`, `tenant`, `legalEntity` (entidad jurídica del tenant, `legalEntities` §7.14; DEC-096), `branch` (sucursal), `service`, `category` (categoría tarifaria del servicio), `user`. Cada definición declara cuáles admite. El ámbito `legalEntity` sirve para políticas que difieren entre la cooperativa y la mutual u otra entidad del mismo tenant (textos legales de comprobantes, cuentas contables por defecto, políticas fiscales y de sueldos de la entidad); un valor en ese ámbito exige `scope.refId` de una entidad activa del mismo tenant. Con PRM-CFG-039 = `false` (una sola entidad) el editor no ofrece el ámbito, pero la resolución lo sigue evaluando con la entidad por defecto. (Antes: "`platform`, `tenant`, `branch` (sucursal), `service`, `category` (categoría tarifaria del servicio), `user`".) | Instrucción del solicitante; RN-09 §7.2; DEC-096 | Núcleo | O1 | Adoptado | Guardar un valor en un ámbito no admitido devuelve 422; un valor `legalEntity` con la entidad de otro tenant o inactiva devuelve 422. |
| RF-CFG-019 | Precedencia de resolución, de más específico a más general: `user` → `category` → `service` → `branch` → `legalEntity` → `tenant` → `platform` (default de plataforma configurable) → default de la definición (DEC-096; antes sin `legalEntity` entre `branch` y `tenant`). El ámbito `legalEntity` se evalúa con la entidad del contexto (RF-CFG-020); un valor `branch` solo se considera si la sucursal pertenece a esa misma entidad a la fecha `at` (`branches.legalEntityId` o `legalEntityHistory`), de modo que una sucursal de la cooperativa nunca impone su valor a un documento de la mutual. | RN-09 §7.2; DEC-096 | Núcleo | O1 | Adoptado | Test de matriz de precedencia con todos los ámbitos; con valor en `tenant` = A, en `legalEntity` MUTUAL = B y en la sucursal SUC-01 (de COOP) = C, un documento de MUTUAL emitido en SUC-01 resuelve B y uno de COOP resuelve C. |
| RF-CFG-020 | Lectura única `config.get(clave, { tenantId, legalEntityId, branchId, serviceId, categoryId, userId, at, knownAt })`: `at` = fecha efectiva a interpretar (default: ahora en zona del tenant); `knownAt` = fecha de registro para reconstrucción histórica (default: ahora). `legalEntityId` es la entidad del documento u operación (DEC-096); si el llamador no la indica, se obtiene con `legalEntities.resolve({ branchId, serviceId, at })` (RF-CFG-137), que termina en la entidad por defecto. (Antes el contexto no incluía `legalEntityId`.) | AGR-010; RN-09 §7.2; DEC-096 | Núcleo | O1 | Adoptado | `config.get` con `at` pasado devuelve el valor vigente entonces; con `knownAt` pasado devuelve lo que se sabía entonces; sin `legalEntityId` ni `branchId` ni `serviceId` usa la entidad por defecto. |
| RF-CFG-021 | La respuesta de lectura incluye `value`, `scopeResolved`, `valueId`, `configVersionId`, `validFrom`, `validTo`, para que cada documento registre qué configuración usó. | AGR-010 criterio ("explicar una factura con los datos y reglas que utilizó") | Núcleo | O1 | Adoptado | Un documento emitido guarda la lista de `valueId`/`configVersionId` relevantes (huella de configuración). |
| RF-CFG-022 | Caché en memoria por proceso con invalidación por evento `cfg.configVersion.published` y por vencimiento de vigencia; nunca sirve un valor de otro tenant. | RN-09 §2.2 (caché `lstVariables`) | Núcleo | O1 | Adoptado | Tras publicar, todos los procesos leen el valor nuevo en < 5 s (RNF-CFG-002). |
| RF-CFG-023 | Lectura masiva por módulo/grupo para pantallas y apps (`/api/admin/cfg/effective?module=`) y lectura pública acotada para PWA/landing solo de claves con `channel` público. | RN-09 §2.1 (`VARIABLE_PMOVIL`, `MOD_VAR`) | Núcleo | O1 | Adoptado | La landing no puede leer claves no marcadas `public`. |
| RF-CFG-024 | Los parámetros de ámbito `user` son solo preferencias sin efecto económico; ninguna clave `commercial`, `fiscal` o `security` admite ámbito `user`. | RN-09 §2.2 (`GetSetBooleanProperty` "recordar opción") | Núcleo | O1 | Adoptado | El linter de registro rechaza la combinación. |
| RF-CFG-025 | El usuario puede ver el **valor efectivo** de cualquier clave para un contexto (sucursal/servicio/categoría) y de qué ámbito proviene. | RN-09 §7.2 | Estándar | O1 | Adoptado | PAN-CFG-03 muestra la cadena de resolución. |

### 5.3 Versiones de configuración, publicación e historia

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-026 | Todo cambio de configuración (parámetros, registros maestros del tenant, enumeraciones, campos extra, personalizaciones de formularios y configuraciones de módulo que se registren en el motor) se hace dentro de una `configVersion` en borrador; no existe edición directa de un valor vigente. | AGR-009; DFA M2 mejora; BASE §39.1 | Núcleo | O1 | Adoptado | No hay endpoint que modifique un `parameterValue` publicado. |
| RF-CFG-027 | Un borrador puede contener cambios de varios módulos y clases; muestra el **diff** contra la configuración vigente a la fecha efectiva elegida (antes/después por ítem). | AGR-009 ("copiar a borrador y mostrar diferencias"); INV `frmComparadorCambios` | Núcleo | O1 | Adoptado | PAN-CFG-05 lista cada ítem con valor anterior, nuevo y ámbito. |
| RF-CFG-028 | **Validación** de la versión: tipos y rangos, dependencias, referencias existentes y vigentes en el tenant, validadores cruzados de los módulos, completitud de los perfiles de servicio afectados, y ausencia de referencias a otro tenant. | AGR-009; BASE §81 | Núcleo | O1 | Adoptado | Una versión con un plan visible sin precio vigente o con referencia a un impuesto/cuenta de otro tenant no pasa validación. |
| RF-CFG-029 | **Simulación**: el motor invoca los simuladores registrados por los módulos afectados (ej.: M05 primera factura de un plan; M08 interés de una deuda de ejemplo; M04 tarifa de una categoría) sin generar efectos; guarda el reporte en la versión. | AGR-009; BASE §81 CU-COP-01 paso 5 | Núcleo | O1 | Adoptado | La simulación no crea documentos ni eventos de negocio; su reporte queda adjunto y es reproducible. |
| RF-CFG-030 | Separación por clase de cambio: una versión solo de `presentation` no dispara simulación tarifaria ni revisión comercial. | AGR-009 ("una corrección de label no debe generar una revisión tarifaria innecesaria") | Núcleo | O1 | Adoptado | Cambiar una etiqueta publica sin pasos comerciales. |
| RF-CFG-031 | **Revisión**: según política del tenant (PRM-CFG-001..003) una versión requiere aprobación por un usuario distinto del autor, mediante workflow de T11. | AGR-009; BASE §39.1 | Núcleo | O1 | A validar (PA-CFG-01) | El autor no puede aprobar su propia versión sensible. |
| RF-CFG-032 | **Fecha efectiva** por versión (y opcionalmente por ítem cuando el modo de vigencia lo permite); la publicación puede programarse para una fecha/hora futura. | AGR-009; AGR-017 | Núcleo | O1 | Adoptado | Una versión programada para 01-06-2026 00:00 (zona del tenant) rige desde entonces y no antes. |
| RF-CFG-033 | **Publicación íntegra y atómica**: todos los ítems de la versión se vuelven vigentes en una sola transacción; si un ítem falla, no se publica ninguno. | AGR-009 criterio | Núcleo | O1 | Adoptado | Fallo inyectado en un ítem deja la configuración vigente intacta. |
| RF-CFG-034 | Una publicación no reescribe contratos ni documentos vigentes ni emitidos; si un cambio afecta contratos vigentes, la versión declara la política (aplicar a nuevos / aplicar desde fecha a todos / requerir acción) y la publicación emite eventos para que el módulo dueño actúe. | AGR-009 ("no sobrescribir contratos vigentes sin política") | Núcleo | O1 | Adoptado | Publicar un nuevo precio no modifica facturas emitidas. |
| RF-CFG-035 | **Retroactividad**: una versión con fecha efectiva pasada solo se admite según PRM-CFG-005/006, requiere aprobación, y su efecto sobre operaciones ya emitidas/cerradas se resuelve con ajustes del módulo dueño, nunca reescribiendo el original. | AGR-010 | Núcleo | O1 | A validar (PA-CFG-08) | Tarifa cargada el 15 con vigencia desde el 1: queda registrada con `validFrom = 01` y `recordedAt = 15`; las facturas emitidas entre el 1 y el 15 no cambian y M05 recibe evento para ajustes. |
| RF-CFG-036 | **Historia bitemporal** de cada valor: `validFrom`/`validTo` (efectiva) y `recordedAt`/`supersededAt` (registro), origen (`manual`, `import`, `copy`, `seed`, `migration`, `platform`), versión y actor. | AGR-010 | Núcleo | O1 | Adoptado | PAN-CFG-06 responde "qué valor regía el 10-03 según lo conocido el 12-03". |
| RF-CFG-037 | Las consultas históricas declaran qué fecha interpretan (efectiva o de registro) en la pantalla y en la exportación. | AGR-010 ("las consultas históricas deben declarar qué fecha interpretan") | Núcleo | O1 | Adoptado | Cabecera de exportación indica `at` y `knownAt`. |
| RF-CFG-038 | **Reversión**: una versión publicada puede revertirse creando una versión nueva que restituye los valores anteriores (con su propia fecha efectiva y aprobación); nunca se borra la versión revertida. | AGR-009, AGR-010 | Estándar | O1 | Adoptado | Revertir genera `configVersion` con `origin = rollback` y referencia a la original. |
| RF-CFG-039 | Cancelación de una versión programada antes de su fecha efectiva, con motivo. | AGR-009 | Estándar | O1 | Adoptado | Versión `scheduled` pasa a `cancelled`; no deja valores. |
| RF-CFG-040 | Conflictos: dos borradores que tocan el mismo ítem se detectan; al publicar el segundo se exige rebase (recalcular diff contra lo vigente). | AGR-009 | Estándar | O1 | Adoptado | No se publica una versión cuyo "antes" ya no coincide con lo vigente. |
| RF-CFG-041 | Origen de versiones: manual, importación, copia entre tenants (M02, BASE §81), semilla, migración, plataforma (actualización de tablas adoptadas), reversión. La copia llega siempre como **borrador del destino** con dependencias pendientes. | BASE §81 (COP-002, "no sobrescribir en silencio") | Núcleo | O2 | Adoptado | Una copia nunca se publica sin validación y aprobación en el destino. |
| RF-CFG-042 | Auditoría completa de cada transición de versión y de cada ítem (antes/después), con usuario, IP, sesión de soporte si aplica, y motivo. | RN-09 §2.2 (`Actu_V2` audita solo sentencia), §7.8 | Núcleo | O1 | Adoptado | Auditoría exportable con valores antes/después. |
| RF-CFG-043 | Una versión puede incluir configuración propia de un módulo (tarifas, planes, formularios, tipos de gestión) a través de la interfaz `ConfigContributor` que cada módulo implementa (validar, aplicar, simular, diff). | AGR-009; BASE §81, §84 | Núcleo | O1 | Adoptado | M02/M04 registran su contributor y sus ítems aparecen en el diff de la versión. |
| RF-CFG-044 | Registro de cada configuración regulada con fuente (norma/resolución), jurisdicción y vigencia. | BASE §93 ESP-005; REL §5 (cuadros nombrados por norma) | Núcleo | O1 | Adoptado | Un ítem `fiscal` o de tarifa regulada sin `sourceRef` no pasa validación. |

### 5.4 Tablas maestras (editor uniforme)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-045 | Registro de tablas maestras (`masterTableDefinitions`) con código, módulo dueño, ámbito (`platform`, `tenant`, `platformAdoptable`), esquema de campos, clave natural, si es vigenciada, si es importable, si admite unificación y si sus cambios pasan por versión. | DFA M2 mejora ("editor de tablas maestras uniforme"); REL §5 | Núcleo | O1 | Adoptado | Agregar una tabla nueva no requiere pantalla nueva. |
| RF-CFG-046 | Editor uniforme (PAN-CFG-08) con `DataTable`: búsqueda por texto y por campos, filtros, orden, columnas configurables, vistas guardadas, exportar XLSX/CSV/PDF, alta/edición en modal, baja lógica, historial por registro. | DFA M2; INV `abm_Base`, `abm_Base_Simple`, `abm_Base_SoloDetalle`, `Botones_Abm` | Núcleo | O1 | Adoptado | Las tablas de §7 se administran con el mismo componente. |
| RF-CFG-047 | Vigencias por registro (`validFrom`/`validTo`); la grilla muestra por defecto los vigentes a hoy y permite consultar a una fecha. | DFA M2 mejora; DFA §32 ("vigencias en el mismo modelo" en lugar de `HIS_*`) | Núcleo | O1 | Adoptado | Consultar a fecha pasada muestra la versión vigente entonces. |
| RF-CFG-048 | "En uso por": antes de inactivar o unificar un registro, el sistema muestra cuántas referencias tiene por colección/módulo; un registro referenciado no se borra, se inactiva. | INV `frm_Consulta_Referencias`; CAT `INTEGRIDAD` | Núcleo | O1 | Adoptado | Intentar borrar una localidad con domicilios muestra conteo y ofrece inactivar. |
| RF-CFG-049 | Unificación de duplicados (barrios, calles locales, localidades del tenant, enumeraciones): elige registro sobreviviente, redirige referencias por job idempotente, conserva el duplicado como `merged` con puntero. | INV `abm_barrios.btnUinificar_Click`, `abm_localidad.btnUinificar_Click`, `abm_Calle.btnUinificar_Click`, `frmUnificarDomicilio` | Estándar | O1 | Adoptado | Tras unificar, ninguna referencia apunta al duplicado; auditoría con conteos. |
| RF-CFG-050 | Códigos externos por registro (ARCA, INAES, ENARGAS, OCEBA, ERSeP, ENACOM, SENASA/`COD_SEN`, Georef, INDEC) en un mapa `externalCodes`. | CAT `PROVINC`, `LOCALIDA`, `DEPTO`, `DOCUMENT` | Núcleo | O1 | Adoptado | Exportar a ENARGAS usa `externalCodes.enargas` de la localidad. |
| RF-CFG-051 | Las tablas de plataforma se ven en el tenant en solo lectura; el tenant puede agregar **registros propios** (overlay) solo en las tablas que lo admiten (ej.: feriados municipales, localidades rurales no listadas) y **atributos propios** sobre registros de plataforma (ej.: kilómetros a la sede de `LOCALIDA.KILOMETROS`). | DFA M2; CAT `LOCALIDA` | Núcleo | O1 | Adoptado | Un tenant no puede editar el nombre de una provincia; sí agregar su atributo `km`. |
| RF-CFG-052 | Selectores (lookups) uniformes para todos los módulos: búsqueda incremental, filtro por padre (provincia → localidad → calle), solo vigentes, paginados. | INV `ConsultaGenerica`, `ConsultaGenerica_MultiColumna`, `ConsultaGenerica_Varios`, `frmConsultaGenerica`, `frmConsultaGenerica_Varios`, `txtCalles`, `txtModulos` | Núcleo | O1 | Adoptado | Un selector de calles filtra por localidad y responde < 300 ms p95. |
| RF-CFG-053 | Los cambios a tablas maestras del tenant marcadas `versioned` pasan por `configVersion`; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. | AGR-009 | Estándar | O1 | Adoptado | La política por tabla está en su definición. |

### 5.5 Importación de padrones y maestros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-054 | Importación por archivo (XLSX/CSV/TXT de ancho fijo) de cualquier tabla maestra importable con `ExcelImportWizard`: subir → mapear columnas → vista previa con errores por fila → confirmar → job → resultado descargable. | DFA M2 mejora ("importación de padrones (calles, IIBB) por archivo"); INV `frmImportadorAbm`, `frmImportacionMasiva`, `frmResultadoImportacion`, `abm_Base.btnImportar_Click`; CNX §4.6 | Núcleo | O1 | Adoptado | Importar 50.000 calles con 30 errores muestra los 30 sin importar parcialmente sin confirmación. |
| RF-CFG-055 | Modos de importación: alta solamente, alta y actualización por clave natural, reemplazo de vigencia (cierra vigentes y abre nuevos). | INV `frmImportacionArchivos` | Núcleo | O1 | Adoptado | Reimportar el mismo archivo es idempotente. |
| RF-CFG-056 | Ingesta de padrones fiscales (ARCA, IIBB provinciales) por archivo o por integración, con jurisdicción, régimen, fecha de publicación, vigencia desde/hasta, alícuota y grupo; consulta por CUIT a fecha. | CAT `IIBB_LUA`; INV `frmImportacionArchivos.Importar_IngresosBrutos`, `Importar_AFIP`, `frmDefinirIngresoBruto` | Núcleo | O4 | A validar (PA-CFG-05) | Consultar CUIT ficticio 30-00000000-0 al 15-05-2026 devuelve la alícuota del padrón vigente. |
| RF-CFG-057 | Las importaciones grandes corren como job (`cfg:importar-maestro`) reanudable, con progreso, cancelación y archivo de errores; quedan asociadas a la `configVersion` o a la `platformTableRelease` que generan. | Guía §5 Jobs | Núcleo | O1 | Adoptado | Cancelar a mitad deja el estado anterior intacto. |
| RF-CFG-058 | Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). | INV `frmImportadorAbm.CrearExcel` | Estándar | O1 | Adoptado | El archivo exportado se reimporta sin cambios. |

### 5.6 Precarga de catálogos de ejemplo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-059 | Paquetes semilla versionados por plataforma; el paquete `demo-base-s39` contiene **toda** la BASE §39 (servicios/planes, conceptos de liquidación, medios de cobro, estados seleccionables y roles con valores sugeridos) más geografía y feriados de ejemplo. | BASE §39.1–39.6 | Núcleo | O2 | Adoptado | Aplicar el paquete a un tenant demo deja recorribles los flujos de §39 sin inventar datos. |
| RF-CFG-060 | Los datos de demostración se identifican (`demoData: true` y `seedApplicationId`) y se mantienen separados de los operativos; pueden retirarse en bloque. | BASE §39.1 | Núcleo | O2 | Adoptado | Retirar la semilla borra solo registros marcados y no toca datos creados por usuarios. |
| RF-CFG-061 | Un valor sugerido nunca se acepta silenciosamente para configuración sensible: la semilla genera una `configVersion` en borrador que requiere aprobación. | BASE §39.1 | Núcleo | O2 | Adoptado | La semilla no publica por sí misma tarifas ni recargos. |
| RF-CFG-062 | Un dato desconocido queda vacío o pendiente: la semilla no completa con cero, fechas inventadas ni autorizaciones supuestas (ej.: tributos `TRIB-PEND` y recargo `REC-PEND` quedan sin valor/deshabilitados). | BASE §39.1, §39.3 | Núcleo | O2 | Adoptado | `TRIB-PEND` queda en estado pendiente de validación fiscal. |
| RF-CFG-063 | Los valores sugeridos al operar (servicio → unidad/periodicidad/requisitos; contrato → titular/inmueble/tarifa vigente; comprobante a cobrar → saldo pendiente con pago parcial si tiene permiso) se configuran como defaults declarados en los módulos, no como datos fijos. | BASE §39.1 | Estándar | O2 | Adoptado | M07 propone el saldo pendiente y permite parcial solo con permiso. |
| RF-CFG-064 | Solo se aplican semillas en tenants marcados demo/sandbox, salvo plantillas sin importes. | BASE §39.1 | Núcleo | O2 | A validar (PA-CFG-11) | Un tenant productivo no ofrece "aplicar semilla demo". |

### 5.7 Geografía, calles y mapas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-065 | Catálogo de plataforma de países, provincias (24 jurisdicciones), departamentos/partidos, municipios/gobiernos locales y localidades/asentamientos de Argentina, con códigos INDEC/Georef y códigos externos (ARCA, INAES, ENARGAS, OCEBA). | DFA M2; CAT `PAISES`, `PROVINC`, `DEPARTA`, `DEPTO`, `LOCALIDA`; BASE §77 | Núcleo | O1 | Adoptado | Las 24 provincias y sus departamentos están cargados con código INDEC. |
| RF-CFG-066 | Códigos postales: CP numérico de 4 dígitos por localidad y CPA (alfanumérico de 8) cuando la fuente lo provea, con relación muchos-a-muchos localidad ↔ CP. | DFA M2 ("códigos postales"); CAT `LOCALIDA.COD_POS` | Estándar | O1 | Adoptado | Buscar por CP 5000 devuelve las localidades asociadas. |
| RF-CFG-067 | **GEO-001** Catálogo nacional de calles: calles de Argentina por localidad/departamento con nombre, tipo, alturas inicio/fin por lado cuando existan, identificador y fuente; búsqueda por nombre y contexto territorial; homónimos distinguidos por localidad/departamento. | BASE §77 GEO-001; §79 GEO-F2; DEC-046 | Núcleo | O1 | Adoptado (DEC-046) | Buscar "San Martín" en Córdoba devuelve candidatos por localidad, nunca uno solo sin contexto. |
| RF-CFG-068 | El catálogo nacional se ingesta en plataforma desde la fuente oficial elegida con frecuencia configurable, conservando identificador de fuente, fecha de ingesta, atribución y licencia. | BASE §77, §79 GEO-F1, GEO-F5; DEC-046 | Núcleo | O1 | Adoptado (DEC-046) | Cada calle muestra fuente y fecha de actualización. |
| RF-CFG-069 | Calles locales del tenant: si la calle no aparece (loteo nuevo, rural), el operador la carga localmente con estado `pendingValidation`; puede proponerse a plataforma (`streetProposals`). | BASE §77 ("calles nuevas", "dirección no encontrada no es prueba de domicilio inexistente") | Núcleo | O1 | A validar (PA-CFG-13) | La calle local solo la ve su tenant hasta aprobarse. |
| RF-CFG-070 | Alias de calles por tenant (nombre histórico/popular → calle del catálogo) para búsqueda y migración. | CAT `CALLES` (nombres locales); BASE §77 | Estándar | O1 | Adoptado | Buscar el nombre viejo devuelve la calle actual. |
| RF-CFG-071 | Barrios por localidad (tenant, con posibilidad de plataforma si la fuente los publica), zonas del tenant (organización territorial para lectura y operación, con polígono opcional), distritos y secciones catastrales del tenant. | DFA M2; CAT `BARRIOS`, `ZONAS`, `DISTRITO_SECCION` | Núcleo | O1 | Adoptado | Un barrio pertenece a una localidad; una zona puede abarcar varias localidades. |
| RF-CFG-072 | Esquema compartido `geoReference` (embebido en direcciones de M01 y en otras entidades): texto original, dirección normalizada, componentes (provincia, departamento, localidad, calle, altura, piso, unidad, entrecalles, barrio, referencias, datos rurales), punto (`GeoJSON Point`), fuente, precisión, estado (`pending`, `candidate`, `confirmed`, `approximate`, `inReview`, `failed`, `manualPoint`), momento, actor y motivo. | BASE §77 alcance | Núcleo | O1 | Adoptado | No existe un punto sin fuente ni estado. |
| RF-CFG-073 | **GEO-002** Normalización y geocodificación: a partir de la dirección, el servicio devuelve candidatos con precisión declarada; nunca presenta precisión no disponible. Georef normaliza y geocodifica; Google Maps se usa para el mapa y el autocompletado (corregido por DEC-046; antes "Georef normalización + Google geocodificación"). | BASE §77 GEO-002, §79 GEO-F3, GEO-F4; DEC-046 | Núcleo | O1 | Adoptado | Si solo hay coincidencia a nivel localidad, el estado es `approximate` con precisión `locality`. |
| RF-CFG-074 | **GEO-003** Componente de mapa (Google Maps) para mostrar y confirmar/corregir el punto de prestación por usuario autorizado (arrastrar marcador, coordenadas), registrando fuente, momento y motivo. | BASE §77 GEO-003; INV `ctrlMapa`, `ctrlMapaBase`, `frmVisorMapa`; DEC-046 | Núcleo | O1 | Adoptado | Mover el marcador cambia estado a `confirmed` con `source = manual-assisted` y motivo obligatorio. |
| RF-CFG-075 | Ubicación por coordenadas o referencias cuando no hay coincidencia calle/altura, con revisión (cola PAN-CFG-15). | BASE §77 | Núcleo | O1 | Adoptado | Un punto manual sin calle queda `inReview`. |
| RF-CFG-076 | Uso de la ubicación del dispositivo solo con permiso explícito y siempre con alternativa manual; la posición del dispositivo no se toma como domicilio contratado. | BASE §77, §79 GEO-F6 | Núcleo | O1 | Adoptado | Denegar permiso de ubicación no impide completar el formulario. |
| RF-CFG-077 | Tolerancia a caídas o límites de las fuentes: el formulario se guarda con estado `pending` y un job reintenta el enriquecimiento (`cfg:geocodificar-pendientes`). | BASE §77 | Núcleo | O1 | Adoptado | Con Google caído, la solicitud se guarda y luego se geocodifica. |
| RF-CFG-078 | Separación del catálogo geográfico compartido (plataforma) de los domicilios y datos privados del tenant; las geocodificaciones de un tenant no son visibles para otro. | BASE §77 | Núcleo | O1 | Adoptado | Test de aislamiento sobre `geocodeRequests`. |
| RF-CFG-079 | Control de acceso al mapa, exportaciones y API de domicilios por tenant, capability y relación autorizada. | BASE §77 | Núcleo | O1 | Adoptado | Un operador sin alcance sobre la zona no ve los puntos de esa zona. |
| RF-CFG-080 | Persistencia de resultados de proveedores según sus condiciones de uso; no se usa Google como descarga indiscriminada de calles. | BASE §77, §79 GEO-F4, GEO-F5 | Núcleo | O1 | A validar (PA-CFG-03) | No existe job que descargue calles desde Google. |
| RF-CFG-081 | Configuración de mapa por tenant y por módulo (centro, zoom, capa base, marcadores) en reemplazo de la tabla `MAPA`. | CAT `MAPA` | Estándar | O1 | Adoptado | PRM-CFG-019/020 por módulo. |
| RF-CFG-082 | Cuota y clave de Google Maps: uso con clave de plataforma con cuota por tenant o clave propia en bóveda; métricas de consumo por tenant. | BASE §77 ("sin presuponer consultas ilimitadas"), §80; DEC-020 | Núcleo | O1 | Adoptado (DEC-020) | Al superar la cuota el componente degrada a búsqueda sin mapa y avisa. |
| RF-CFG-083 | Historia de cambios de la georreferencia y relación con inmueble, contrato, ticket y orden técnica (la relación la mantiene el dueño; CFG provee el historial del subdocumento). | BASE §77 | Estándar | O1 | Adoptado | Ver historia del punto desde la ficha del inmueble. |

### 5.8 Calendarios, feriados y días hábiles

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-084 | Calendarios jerárquicos: nacional (plataforma), provincial (plataforma), municipal (tenant), del tenant (días no laborables propios, asuetos) y opcionalmente por servicio. Un tenant/sucursal/servicio declara qué calendarios aplica. | DFA M2 (`FERIADOS`); AGR-017 | Núcleo | O1 | Adoptado | Un servicio en una localidad con feriado municipal suma ese día como no hábil. |
| RF-CFG-085 | Feriados con fecha, tipo (inamovible, trasladable, puente/no laborable, local, asueto), descripción, fuente/norma, año; recurrentes por día/mes cuando corresponda. | CAT `FERIADOS` (DIA, MES, AÑO, DES_FER); INV `abm_Feriados` | Núcleo | O1 | Adoptado | Cargar un feriado sin año lo marca recurrente. |
| RF-CFG-086 | Servicio de días hábiles: `isBusinessDay`, `nextBusinessDay`, `addBusinessDays`, `businessDaysBetween`, con zona horaria del tenant y fines de semana configurables. | AGR-017; DFA M2 ("vencimientos y días hábiles") | Núcleo | O1 | Adoptado | Vencimiento que cae domingo con regla "siguiente hábil" pasa a lunes, o a martes si el lunes es feriado. |
| RF-CFG-087 | Diferenciación de calendarios de lectura, liquidación, emisión y vencimiento: CFG provee días hábiles; los cronogramas los define M05/M03 usando este servicio. | AGR-017 | Núcleo | O1 | Adoptado | M05 no implementa cálculo de feriados propio. |
| RF-CFG-088 | Fronteras temporales reproducibles: zona horaria del tenant, inclusión de días, meses cortos y años bisiestos; los resultados no dependen del horario del servidor. | AGR-017 criterio | Núcleo | O1 | Adoptado | Suite de pruebas con 29-02-2028, 31-01 + 1 mes, cambio a las 23:59 en la zona del tenant. |
| RF-CFG-089 | Publicar o corregir un feriado emite `cfg.holiday.changed` para que los módulos recalculen vencimientos **no emitidos**; los emitidos no cambian. | AGR-010 | Estándar | O1 | Adoptado | Un feriado agregado tarde no modifica facturas ya emitidas. |

### 5.9 Índices económicos y monedas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-090 | Series de índices (`economicIndexSeries`): inflación (IPC nacional/regional INDEC, índices propios), cotizaciones de moneda (comprador/vendedor, por fecha y hora), tasas e índices para mora (diarios/mensuales), y otras (CER, UVA, ICL) con frecuencia, unidad, fuente y ámbito. | DFA M2 (`INFLACIO`, `TABINFL`, `COT_DOL`, `TABMORA`, `INDICESMORA`) | Núcleo | O5 | Adoptado | Cada serie muestra fuente y última publicación. |
| RF-CFG-091 | Series de plataforma adoptables: el tenant elige qué serie oficial usa para cada propósito (PRM-CFG-024/025) o crea series propias (ej.: tabla de recargo propia de la cooperativa). | Instrucción del solicitante; CAT `TABMORA.TIPO_FAC` | Núcleo | O5 | Adoptado | M08 lee la serie por propósito, no un código fijo. |
| RF-CFG-092 | Valores con `Decimal128`, período o fecha, `publishedAt`, `recordedAt`, estado (`provisional`, `definitive`), revisión de un valor anterior sin borrarlo. | AGR-010; Guía §5 Dinero | Núcleo | O5 | Adoptado | Revisar el IPC de un mes deja el valor anterior consultable con `knownAt`. |
| RF-CFG-093 | Ingesta automática de series oficiales (cotizaciones diarias, tasas, IPC mensual) por job con reintentos y alerta si falta un valor esperado. | DFA M2; CNX §2.6 (jobs) | Estándar | O5 | Adoptado | Si a las 18:00 no hay cotización del día, se alerta al curador. |
| RF-CFG-094 | Carga manual e importación de valores de series propias del tenant con auditoría. | INV `abm_Tip_Mon_Cot` | Núcleo | O5 | Adoptado | Cargar cotización manual exige fecha, hora y fuente. |
| RF-CFG-095 | Catálogo de monedas (plataforma: ISO 4217 + código ARCA) con atributos del tenant: símbolo, divisible, redondeo, porcentaje de percepción, vuelto, permitido para cobro. | CAT `TIP_MON`; INV `abm_Tip_Mon` | Núcleo | O4 | Adoptado | ARS (`PES`) y USD (`DOL`) precargadas. |
| RF-CFG-096 | Consulta de valor de una serie a una fecha con regla de ausencia declarada (último publicado anterior / exacto o error). | AGR-017 | Núcleo | O5 | Adoptado | Pedir cotización de un sábado con regla "último anterior" devuelve la del viernes. |

### 5.10 Tablas fiscales comunes y padrones

> **Reemplazado por M06 (CTR-DAT-13).** Las tablas fiscales de referencia y los padrones son de M06 (`vatConditionSettings`, `vatRates`, `grossIncomeSettings`, `taxpayerRegistries`, `taxpayerRegistryEntries`, COL-FIS-15 a 21). Se conservan las filas como origen. Siguen en CFG RF-CFG-100 (tipos de documento), RF-CFG-101 (mecanismo de publicación de tablas de plataforma, que M06 usa) y RF-CFG-103 (enumeraciones de entes reguladores).

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-097 | Tabla de plataforma de condiciones frente al IVA con código ARCA de condición del receptor, comprobante por defecto (A/B/C) como atributo sugerido, y vigencia. | CAT `SITIVA`; INV `abm_sit_iva` | Núcleo | O2 | Reemplazado por M06 `vatConditionSettings` (COL-FIS-15, CTR-DAT-13) | M01 asigna condición IVA a una persona desde esta tabla. |
| RF-CFG-098 | Tabla de plataforma de alícuotas de IVA con código ARCA, porcentaje y vigencia; las cuentas contables por alícuota son atributo del tenant (M15) y los porcentajes por condición son reglas de M06. | CAT `ALI_IVA`, `ALI_IVA_CF`; INV `abm_ali_iva`, `AliIva_SitIva` | Núcleo | O4 | Reemplazado por M06 `vatRates` (COL-FIS-16, CTR-DAT-13) | 21 % (código 5) y 10,5 % (código 4) vigentes. |
| RF-CFG-099 | Tabla de plataforma de situaciones frente a IIBB (local, Convenio Multilateral, exento, no inscripto, régimen simplificado) y de alícuotas de IIBB por jurisdicción y actividad con vigencia y norma. | CAT `SITIBR`, `ALI_IBR`, `ALI_IBR_CF`, `ALI_IBR_COMP`; INV `abm_ali_Ibr`, `abm_Sit_Ibr`, `abm_ali_ibr_comp`, `AliIbr_SitIbr` | Núcleo | O4 | Reemplazado por M06 `grossIncomeSettings` (COL-FIS-19, CTR-DAT-13) | Alícuota de una actividad en Córdoba consultable a fecha. |
| RF-CFG-100 | Tipos de documento de identidad (plataforma) con códigos ARCA, INAES, ENARGAS y `COD_SEN`. | CAT `DOCUMENT` | Núcleo | O1 | Adoptado | DNI = 96, CUIT = 80 en ARCA [VERIFICAR contra tabla ARCA vigente]. |
| RF-CFG-101 | Toda tabla fiscal de plataforma se publica por `platformTableRelease` con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. | Instrucción del solicitante; BASE §93 ESP-005 | Núcleo | O4 | A validar (PA-CFG-10) | Una alícuota nueva no impacta cálculos del tenant antes de su vigencia. |
| RF-CFG-102 | Padrones por CUIT (ARCA y fiscos provinciales) con régimen, alícuota, grupo, vigencia y fecha de publicación; consulta por CUIT y fecha; mantenimiento por plataforma o por tenant según la fuente. | CAT `IIBB_LUA` | Núcleo | O4 | Reemplazado por M06 `taxpayerRegistries`/`taxpayerRegistryEntries` (COL-FIS-20/21, CTR-DAT-13); PA-CFG-05 pasa a M06 | Un CUIT con dos vigencias devuelve la correcta para cada fecha. |
| RF-CFG-103 | Tablas de códigos de entes reguladores (ENARGAS, OCEBA, ERSeP, ENACOM) como enumeraciones de plataforma con códigos externos, consumidas por reportes regulatorios. | INV `ctrlEnargasTablas`, `frmEnargasTablas` | Estándar | O7 | Adoptado | Las tablas ENARGAS se ven en PAN-CFG-20 como enumeraciones de plataforma. |

### 5.11 Enumeraciones configurables

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-104 | Toda lista cerrada se modela como enumeración con código estable (inmutable), etiqueta por diccionario, orden, color/ícono opcional, activo, vigencia, padre opcional, atributos tipados y códigos externos. | RN-09 §2.1 (`TIP_CTRL = 2`); DFA M2 (tablas genéricas) | Núcleo | O1 | Adoptado | Cambiar la etiqueta no cambia el código guardado en documentos. |
| RF-CFG-105 | Tipos de enumeración: `system` (valores fijos del código, el tenant solo cambia etiqueta/orden/activo), `extensible` (el tenant agrega valores), `tenant` (totalmente del tenant), `platform` (mantenida por plataforma). | DFA M2 | Núcleo | O1 | Adoptado | Un valor `system` no puede eliminarse. |
| RF-CFG-106 | Enumeraciones comunes precargadas: estado civil, ocupación/profesión, sexo/género registral (F, M, X), tipos de documento, canales de contacto, vías de ingreso de gestiones, motivos genéricos de baja/inactivación. | CAT `EST_CIVIL`, `OCUPACIO`, `DOCUMENT`, `ESTADOS`; INV `SelectorSexo`, `abm_Viaingte` | Núcleo | O1 | Adoptado | Disponibles en el tenant demo. |
| RF-CFG-107 | Los estados de negocio con transiciones no son enumeraciones de CFG: los define T11 WFL / el módulo dueño; CFG solo provee etiquetas y orden de presentación. | CAT `ESTADOS`, `ENTIDA_ESTADOS`; BASE §39.5 | Núcleo | O1 | Adoptado | Ningún estado de comprobante se edita desde PAN-CFG-20. |

### 5.12 Campos extra tipados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-108 | El tenant define campos extra por entidad habilitada (persona, cuenta, contrato de servicio, inmueble, categoría, orden de trabajo, ticket/solicitud, producto, proveedor, empleado, bien de uso): clave, etiqueta, tipo, obligatoriedad, unicidad, validaciones, default, orden, sección, visibilidad por canal, capability de edición, búsqueda/exportación, historia. | DFA §32 ("campos configurables tipados"); CAT `DATOSEXT`, `DATOSETB`, `PROPIEITEMS`, `PROPIEITEMS_VALORES`, `PROPIEITEMS_ASIGNACIONES`; INV `abm_DatosExtra`, `abm_propieItems`, `abm_propieitems_valores`, `PropiedadesPersonalizadas`, `SelectorPropiedadObjeto` | Núcleo | O2 | Adoptado | Crear "Número de medidor anterior" (texto, único) en contrato lo muestra en ficha y lo valida. |
| RF-CFG-109 | Tipos de campo extra: texto, texto largo, entero, decimal, importe, porcentaje, fecha, fecha-hora, booleano, enumeración, multi-enumeración, referencia a entidad, archivo (T11), punto geográfico, email, teléfono, URL, CUIT. | CAT `DATOSEXT.TIP_DATO/LAR_DATO/DEC_DATO`, `PROPIEITEMS.TIPO_VALOR` | Núcleo | O2 | Adoptado | Un decimal respeta los decimales declarados. |
| RF-CFG-110 | Los valores se guardan en el documento dueño (`customFields.<clave>`) y los valida el servicio de CFG invocado por el módulo; los campos con historia guardan vigencias. | DFA §32 | Núcleo | O2 | Adoptado | Un valor inválido rechaza el guardado del documento dueño. |
| RF-CFG-111 | Las columnas fijas de las tablas `*_EXTRAS` de ProCoop **no** se convierten en campos extra: pasan a campos de primera clase del modelo del módulo dueño (§19.4). Solo `DATOSEXT`/`PROPIEITEMS` (definidos por la cooperativa) migran a campos extra. | DFA §32; CAT `*_EXTRAS` | Núcleo | O2 | Adoptado | `SUMSOC_EXTRAS.CORREO_WEB` es campo real de cuenta en M01, no campo extra. |
| RF-CFG-112 | Límite de cantidad de campos extra por entidad (PRM-CFG-027) e índices de búsqueda solo sobre campos marcados `searchable`. | RNF | Estándar | O2 | A validar (PA-CFG-12) | Superar el límite muestra mensaje claro. |
| RF-CFG-113 | Los campos extra aparecen en `DataTable` (columnas opcionales), exportaciones, importaciones, API admin y, si la visibilidad lo permite, en PWA/landing. | CNX §4.6 | Estándar | O2 | Adoptado | Columna seleccionable en la grilla de cuentas. |

### 5.13 Reemplazo del motor de pantallas configurable

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-114 | Las grillas/consultas dinámicas definidas por metadatos SQL (`ENTIDADES`, `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ENTIDACON`, `ENTIDACRIT`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN`; `frmTransicion`) se reemplazan por pantallas declaradas en código con `DataTable` y endpoints paginados; **no** se permite SQL/consultas libres definidas por el tenant. | RN-09 §5.5; CAT §28 | Núcleo | O1 | Reemplazado por RF-CFG-115/116 | No existe colección con fragmentos de consulta ejecutables. |
| RF-CFG-115 | Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. | CAT `ENTIDACOU`, `ENTIDACRIT`, `ENTIDAEST`; INV `frmTransicion_Vistas`, `frmTransicion_Vistas_Detalle`, `FormBase.Save_GridLayout/Load_GridLayout/Reset_GridLayout`, `Columna_Grilla`, `FormatoCondicional_Columna` | Núcleo | O1 | Reemplazado por `dataTableViews` de T03 (CTR-DAT-11); el requisito se conserva como criterio para T03 | Compartir una vista por rol la ofrece a todos los usuarios del rol. |
| RF-CFG-116 | Árbol de navegación por estados/grupos (`ENTIDAEST`, `ENTIDAGRUP`) se reemplaza por filtros rápidos con contadores definidos en código por cada pantalla y vistas guardadas. | CAT `ENTIDAEST`, `ENTIDAGRUP` | Estándar | O1 | Adoptado | La pantalla de reclamos muestra chips por estado con conteo. |
| RF-CFG-117 | Acciones por entidad (`ENTIDAMEN`) pasan al menú declarativo y a las acciones del `AdminStickyHeader` con capability (T03/T02). | CAT `ENTIDAMEN`; CNX §4.2 | Núcleo | O1 | Reemplazado por T03 | Ninguna acción de entidad se define en una tabla `ENTIDAMEN`; cada acción del `AdminStickyHeader` declara capability y se oculta sin ella (se verifica con los criterios de T03). |
| RF-CFG-118 | Personalización acotada de formularios por el tenant sobre un registro de formularios personalizables: ocultar campo opcional, volver obligatorio un campo opcional, solo lectura, default, etiqueta alternativa (clave de diccionario), orden dentro de sección, ayuda, valores permitidos de una enumeración; publicada por versión. | CAT `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES` (VALORES_SI/VALORES_NO); INV `FormBase.ConfigurarControlesPersonalizados` | Núcleo | O2 | A validar (PA-CFG-09) | Un campo obligatorio por ley/negocio no puede ocultarse ni volverse opcional. |
| RF-CFG-119 | La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). | Guía §5 (Zod compartido) | Núcleo | O2 | Adoptado | Un request por API que omite un campo vuelto obligatorio devuelve 422. |

### 5.14 Configuración técnica, bóveda y entorno

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-120 | La configuración técnica de ProCoop (`Configuracion*.pro`) se clasifica campo por campo (§19.3): infraestructura → variables de entorno del despliegue; credenciales → bóveda por tenant (T06); comportamiento → parámetros; obsoleto → descartado. | RN-09 §1, §5.3, §5.4 | Núcleo | O1 | Reemplazado por mejora | Ningún archivo local ni documento de tenant contiene credenciales. |
| RF-CFG-121 | Vista de configuración técnica del tenant (PAN-CFG-28): lista los `secretRef` requeridos por los módulos activos con estado (configurado, faltante, por vencer), sin mostrar valores; enlace a la bóveda (T06). | CNX §4.6; INV `frmRecuperaConfiguracion` | Núcleo | O1 | Adoptado | Un secreto faltante bloquea la validación de la versión que habilita la integración. |
| RF-CFG-122 | No existen contraseñas maestras, credenciales por defecto ni conexión compartida a base: la identidad del usuario llega a la auditoría. | RN-09 §4.1, §5.3, §7.6 | Núcleo | O0 | Reemplazado por T02/T08 | Revisión de seguridad sin hallazgos de credenciales fijas. |
| RF-CFG-123 | Las migraciones de esquema y del catálogo de parámetros se ejecutan en el pipeline de despliegue, nunca al iniciar sesión el primer usuario. | RN-09 §5.7, §7.9 | Núcleo | O0 | Reemplazado por T08 | El login no dispara migraciones. |

### 5.15 Perfil de configuración por servicio y reglas transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-124 | Configuración propia e independiente por tenant y servicio (COP-001): cada valor de ámbito `service`/`category` pertenece a un tenant; editar el origen no afecta copias. | BASE §81 COP-001, §84 | Núcleo | O1 | Adoptado | Cambiar la promoción de Internet en TEN-001 no cambia TEN-002. |
| RF-CFG-125 | Perfil de configuración por servicio con las 15 dimensiones de BASE §84 (prestador y jurisdicción, titularidad, unidad de prestación, oferta, cantidad, excepciones, facturación, cuenta y pago, ciclo comercial, operación, cambios y salida, atención, control); cada módulo declara qué claves/ítems completan cada dimensión. | BASE §84 | Núcleo | O2 | Adoptado | PAN-CFG-29 muestra porcentaje de completitud por dimensión. |
| RF-CFG-126 | Donde un concepto no corresponde a un servicio se marca **No aplica** explícitamente en lugar de forzar un cargo o proceso ficticio. | BASE §93 | Núcleo | O2 | Adoptado | Dimensión "Cantidad" de Cementerio parque puede quedar "No aplica" con motivo. |
| RF-CFG-127 | Las fichas por servicio (Internet, Electricidad, Agua, Gas, Cementerio parque, Banco de sangre) se completan con lista de precios y versión, bonificaciones, descuentos, recargos e intereses habilitados, facturación y auxiliares, flujo de solicitud/alta/cambios/baja, procesos internos, roles, formularios, evidencia, reportes y API (ESP-001..ESP-006). | BASE §93 | Núcleo | O2 | Adoptado | Publicar un servicio exige su ficha sin dimensiones vacías no justificadas. |
| RF-CFG-128 | Diferencias entre servicios se representan con configuraciones y componentes de dominio explícitos; no se convierte toda particularidad en texto libre ni se fuerza una fórmula universal. | BASE §84 regla de arquitectura | Núcleo | O1 | Adoptado | Linter: ningún parámetro `text` con clase `commercial` sin esquema. |
| RF-CFG-129 | Prestaciones complementarias se habilitan como extensiones explícitas, no indiscriminadamente (ESP-006). | BASE §93 ESP-006 | Estándar | O2 | Adoptado | Una extensión no habilitada no expone parámetros. |

### 5.16 Migración y equivalencias

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-130 | Tabla de equivalencias `legacyParameterMappings`: (`VARIABLE` o `VARIABLE_PMOVIL` + `MOD_VAR`) + `COD_VAR` → clave(s) + transformación + destino (`parameter`, `dictionary`, `tenantProfile`, `secret`, `env`, `discarded`, `replacedBy`). Cubre los 1.536 parámetros (T04b). | RN-09 §6, §7.1 | Núcleo | O1 | Adoptado | Cada uno de los 1.536 tiene exactamente un destino. |
| RF-CFG-131 | Los números de `VARIABLE` y `VARIABLE_PMOVIL` se tratan como espacios distintos (hay números repetidos entre ambas, ej. 1 y 2). | RN-09 §6.4 | Núcleo | O1 | Adoptado | La clave natural de la equivalencia incluye la tabla. |
| RF-CFG-132 | La migración de valores de un tenant genera una `configVersion` `origin = migration` en borrador con reporte de valores no migrables (sin equivalencia, fuera de rango, referencias faltantes). | AGR-018; RN-09 §7.1 | Núcleo | O7 (DEC-089; antes O11) | Adoptado | El reporte lista cada valor descartado con motivo. |
| RF-CFG-133 | Clasificación de los 622 parámetros sin uso directo comprobado: quedan en T04b con estado `A validar (PA-CFG-07)` y destino propuesto. | RN-09 §1, §7.4, §8.1–8.3; DEC-007 | Núcleo | O1 | A validar (PA-CFG-07) | Ninguno se descarta sin registro. |

### 5.17 Requisitos no funcionales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RNF-CFG-001 | `config.get` desde caché p99 < 1 ms; sin caché p95 < 20 ms. | RN-09 §2.2 | Núcleo | O1 | Adoptado | Prueba de carga. |
| RNF-CFG-002 | Propagación de una publicación a todos los procesos (API y workers) < 5 s; al inicio de la fecha efectiva programada < 60 s. | AGR-009 | Núcleo | O1 | Adoptado | Prueba con 3 réplicas. |
| RNF-CFG-003 | Aislamiento: toda entidad de tenant con `TenantId` y filtro global EF; las tablas de plataforma usan `TenantId = PLATFORM` y se leen por unión explícita (plataforma + tenant), nunca por omisión de filtro. | DEC-110 | Núcleo | O1 | Adoptado | Test de fuga entre tenants en cada endpoint de CFG. |
| RNF-CFG-004 | Retención de historia de configuración y auditoría según PRM-CFG-007 (default 10 años) y política de T08. | AGR-010; BASE §98 | Núcleo | O1 | Adoptado | — |
| RNF-CFG-005 | Selector de calles: p95 < 300 ms con catálogo nacional completo; búsqueda tolerante a acentos, mayúsculas y abreviaturas ("Av.", "Gral."). | BASE §77 | Núcleo | O1 | Adoptado | Prueba con "gral paz" encuentra "General Paz". |
| RNF-CFG-006 | Importación de 1.000.000 de filas de padrón en < 15 min por job reanudable. | DFA M2 | Estándar | O4 | Adoptado | Prueba de volumen. |
| RNF-CFG-007 | Toda escritura de CFG lleva `Idempotency-Key` cuando proviene de integración o job; los jobs de ingesta son idempotentes por (fuente, período). | Guía §5 | Núcleo | O1 | Adoptado | Reejecutar ingesta del mismo día no duplica. |
| RNF-CFG-008 | Accesibilidad y diccionario: ninguna etiqueta fija en pantallas de CFG; todas por `dict:`. | BASE §65 | Núcleo | O1 | Adoptado | Linter de i18n. |

### 5.18 Entidades jurídicas, sucursales y puestos (DEC-064)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CFG-134 | **Entidades jurídicas del tenant** (`legalEntities`, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de actividades, estado, entidad por defecto y vigencia. El CUIT es único dentro del tenant. ABM en PAN-CFG-33 con `cfg.entidadesJuridicas.ver/editar`. | DEC-064; REQ-DEC-064 (PRO-O0-13); CTR-DAT-06, CTR-DAT-48; T05 COL-CFG-41; HUE fase 2 G6 | Núcleo | O0 | Adoptado | Un segundo alta con el mismo CUIT en el tenant se rechaza; el mismo CUIT en otro tenant se acepta. |
| RF-CFG-135 | **Entidad por defecto**: al consumir `pla.tenant.created` se crea en la misma unidad idempotente la entidad jurídica por defecto (`isDefault = true`) con los datos fiscales de `tenants` (razón social, CUIT, forma jurídica, matrícula INAES, domicilio). Hay exactamente una entidad por defecto activa por tenant; cambiarla es una operación explícita que desmarca la anterior. | DEC-064; REQ-DEC-064 | Núcleo | O0 | Adoptado | TEN-001 tiene su entidad por defecto apenas se crea y no ve la de TEN-002; reprocesar el evento no crea una segunda. |
| RF-CFG-136 | **`legalEntityId` obligatorio** en el esquema base de los documentos económicos (paquete compartido de esquemas Zod, `packages/shared`) desde O0: `pointsOfSale`, `numberSequences`, `fiscalProfiles`, `arcaCredentials`, `invoices`, `invoiceDrafts`, `paymentSlips`, `receipts`, `obligations`, `ledgerEntries`, `currentAccounts`, `fiscalAuthorizations`, `withholdingsApplied`, `vatLedgers`, `regimeFilings`, `taxObligations`, `journalEntries`, `chartOfAccounts`, `fiscalYears`, `treasuryAccounts`, `treasuryMovements`, `supplierInvoices`, `paymentOrders`, `purchaseOrders`, `salesOrders`, `payrollRuns`, `payslips`, `employees` (como empleador), `statutoryFilings`, `capitalMovements` (lista de T05 §7.1). El validador comprueba que la entidad exista, sea del mismo tenant y esté activa a la fecha del documento. Un documento económico emitido no cambia de entidad: se corrige con documento vinculado. **Nota sobre `chartOfAccounts`** (M15 §7, CTR-CON-21): el plan de cuentas no es un documento emitido sino un catálogo que puede compartirse; `legalEntityId` es la **entidad dueña** del plan (obligatoria, validada igual que el resto) y el plan admite además `sharedWithLegalEntityIds` [ObjectId → `legalEntities`] con las demás entidades del tenant que lo usan (vacío = solo la dueña). El validador comprueba también que cada entidad de `sharedWithLegalEntityIds` exista, sea del mismo tenant, esté activa y no repita la dueña; un asiento (`journalEntries`) solo puede usar un plan cuya dueña o lista compartida incluya su `legalEntityId`. | DEC-064; REQ-DEC-064; T05 §7.1; M15 CTR-CON-21 | Núcleo | O0 | Adoptado | Un documento económico sin `legalEntityId` no valida; uno con la entidad de otro tenant devuelve 422; un plan de cuentas de LE-01 compartido con LE-02 valida, y uno compartido con una entidad de otro tenant devuelve 422. |
| RF-CFG-137 | **Resolución de la entidad** de un documento nuevo (servicio interno `legalEntities.resolve({ branchId, serviceId, at })`, API-CFG-58): 1) la indicada explícitamente por el usuario con permiso; 2) la emisora del servicio (PRM-CFG-040, ámbito `service`); 3) la de la sucursal (`branches.legalEntityId`); 4) la entidad por defecto. Con PRM-CFG-039 = false (una sola entidad) los selectores se ocultan y siempre se usa la por defecto. | DEC-064 | Núcleo | O0 | Adoptado | Un servicio de la mutual configurado con su entidad emite con ella aunque la sucursal sea de la cooperativa. |
| RF-CFG-138 | **Datos fiscales por entidad**: T04 guarda solo los datos legales básicos de REQ-DEC-064. El perfil fiscal completo (agente de percepción o retención, puntos de venta ARCA, credenciales, CAEA) es de M06 por `legalEntityId` y se construye en O4; la contabilidad (M15), la tesorería (M14) y los sueldos (M16) se segmentan por la misma entidad. Los documentos guardan una copia de los datos de la entidad al emitirse. | DEC-064; REQ-DEC-064 ("NO CONSTRUIR TODAVÍA: datos fiscales completos, M06 en O4") | Núcleo | O0 | Adoptado | Cambiar el domicilio legal no altera las facturas ya emitidas. |
| RF-CFG-139 | **Subdocumento `employer`** de `legalEntities` para sueldos (tipo de empleador, actividad principal, zona, régimen de contribuciones, ART, seguro de vida, agente de retención de Ganancias, recibos y firma, convenios bancarios, LSD), que define y edita M16 con `sue.estructura.configurar` por API-CFG-55. Absorbe `employers` de M16 (CTR-DAT-06); `employerId` se reemplaza por `legalEntityId`. | CTR-DAT-06; DEC-064; M16 RF-SUE-022 | Núcleo | O9 | Adoptado | Dos entidades del tenant generan LSD, SICOSS y asientos de sueldos por separado. |
| RF-CFG-140 | **Sucursales** (`branches`, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea la sucursal "Casa central" de la entidad por defecto. Es la referencia del ámbito `branch` de parámetros (§14.3) y de la dimensión de alcance por sucursal de T02. | DEC-064; T05 COL-CFG-42; T01 §2 (sucursales → T04) | Núcleo | O0 | Adoptado | Una sucursal no puede apuntar a una entidad inactiva; inactivar una sucursal con cajas abiertas se rechaza. |
| RF-CFG-141 | **Puestos** (`workstations`, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con `cfg.puestos.editar`. | T05 COL-CFG-43; T02 §4.4 `cfg.puestos.editar` | Estándar | O1 | Adoptado | Un puesto pertenece a una sola sucursal y su código es único en el tenant. |
| RF-CFG-142 | **Migración**: `EMPRESAS` → `legalEntities` (la empresa principal queda `isDefault`); `SU_EMPRESAS` → subdocumento `employer` de la entidad con el mismo CUIT, o entidad nueva si no existe; `EQUIPOS`/puestos → `workstations` [VERIFICAR]. **Sucursales (DEC-098):** ProCoop no tiene tabla de sucursales; `branches` se deriva de los valores distintos de `PTOVENTA.SUC_COM` (CAT: `PTOVENTA` con `COD_POS`, `SUC_COM`, `DES_POS`, `PAUSAR`). El proceso de migración arma una **propuesta de sucursales**: una sucursal candidata por cada valor de `SUC_COM`, con los puntos de venta (`COD_POS`, `DES_POS`) que la usan, el indicador `PAUSAR` y la cantidad de comprobantes que la citan en `FACTURAS`, `ANUFAC`, `COMP_COM`, `IVACOM` y `SU_SUELDOS` (los valores de `SUC_COM` que aparecen en esas tablas y no en `PTOVENTA` se listan aparte como observaciones). La cooperativa **revisa y confirma** la propuesta: nombre, domicilio y localidad de cada sucursal, entidad jurídica a la que pertenece (por defecto, la entidad por defecto, porque `PTOVENTA` no tiene empresa), usos, fusión de varios valores de `SUC_COM` en una misma sucursal física y descarte de valores sin uso; también asigna cada caja de `CAJASJP` (solo `COD_CAJ`, `DES_CAJ`, sin sucursal) a una sucursal confirmada. La confirmación queda registrada (quién, cuándo, versión de la propuesta) y es **precondición** para migrar puntos de venta (`pointsOfSale` de M06) y cajas (`cashRegisters` de M07): sin propuesta confirmada esos pasos de T07 no se ejecutan. Cada sucursal migrada guarda `legacy = { table: 'PTOVENTA', key: 'SUC_COM', values: [...] }`. (Antes: "sucursales de `EMPRESAS`/`CAJASJP` → `branches` [VERIFICAR origen]"; `EMPRESAS` (`COD_EMP`, `DES_EMP`) y `CAJASJP` (`COD_CAJ`, `DES_CAJ`) no tienen columna de sucursal.) Lo ejecuta T07. | DEC-064; DEC-098; CTR-DAT-48; CTR-CFG-25; T05 COL-CFG-41 a 43; CAT `PTOVENTA`, `CAJASJP`, `EMPRESAS` | Núcleo | O7 (DEC-089; antes O11) | Adoptado | Cada fila de `EMPRESAS` y `SU_EMPRESAS` tiene destino; ningún CUIT queda duplicado; cada valor distinto de `PTOVENTA.SUC_COM` termina en una sucursal confirmada o descartado con motivo; cada punto de venta y cada caja migrados apuntan a una sucursal confirmada; intentar migrar puntos de venta o cajas sin propuesta confirmada se rechaza. |
| RF-CFG-143 | **Tablas legales de sueldos de plataforma** (§7.17): códigos oficiales, alícuotas de aportes y contribuciones, bases mínima y máxima, SMVM, deducciones y escalas de Ganancias, reglas de Ganancias, escala cedular, escala de embargabilidad y parámetros de la LCT, con fuente, vigencia y publicación por `platformTableRelease`; el tenant las adopta por `platformTableAdoptions` (absorbe `officialTableAdoptions` de M16). | CTR-DAT-73; T05 COL-CFG-44 a 53; M16 §7.45 | Núcleo | O9 | Adoptado | Un cambio de SMVM con vigencia futura no afecta liquidaciones de períodos anteriores. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CFG-001 | Un parámetro tiene un único tipo y un único significado. | Tres columnas de valor (`CARACTER`, `NUMERICA`, `LOGICA`) y tipo `P` que usa las tres (RN-09 §2.1). | Reemplazar: descomponer en claves tipadas. | — | — |
| RN-CFG-002 | Leer una clave no declarada es un error. | `BuscaVariable` inserta "Sin Utilizar" (RN-09 §2.2). | Reemplazar (deuda técnica). | — | — |
| RN-CFG-003 | El valor efectivo se resuelve con precedencia usuario → categoría → servicio → sucursal → entidad jurídica → tenant → plataforma → default (DEC-096; antes sin entidad jurídica). La sucursal solo aplica si pertenece a la entidad del contexto (RF-CFG-019). | Jerarquía implícita repartida entre `VARIABLE`, `USERS`, `EQUIPOS` y `.pro`; punto de venta por capas (RN-09 §3). | Mejorar: precedencia única documentada. | — | — |
| RN-CFG-004 | Ningún parámetro `commercial`, `fiscal` o `security` admite ámbito `user`. | Variables lógicas de UI como "recordar opción" (`GetSetBooleanProperty`). | Mejorar. | — | — |
| RN-CFG-005 | Todo cambio de configuración vigente se hace por versión; no hay edición directa. | `frmVariables` guarda con `Actu_V2` inmediatamente; sin historial (RN-09 §2.4). | Reemplazar (AGR-009). | PRM-CFG-001..006 | — |
| RN-CFG-006 | La publicación es atómica: todos los ítems o ninguno. | No existe concepto. | Adoptar (AGR-009). | — | — |
| RN-CFG-007 | Una versión no pasa validación si deja un plan/servicio visible sin precio vigente, una referencia a entidad inexistente/inactiva/de otro tenant, un `secretRef` faltante para una integración habilitada, o una dependencia incumplida. | `Valida_V2` solo avisa si una FK/lista no está configurada. | Mejorar. | — | — |
| RN-CFG-008 | El autor de una versión sensible no puede aprobarla. | No existe. | Adoptar (BASE §39.1). | PRM-CFG-001..003 | A validar (PA-CFG-01) |
| RN-CFG-009 | Una versión `presentation` pura no exige simulación ni revisión comercial; una `commercial` o `fiscal` exige simulación de los contributors afectados. | No existe. | Adoptar (AGR-009). | PRM-CFG-002 | — |
| RN-CFG-010 | Fecha efectiva en el pasado: solo con aprobación y dentro de PRM-CFG-006 días; nunca reescribe documentos emitidos/cerrados; el módulo dueño genera ajustes. | Pisado sin historia. | Adoptar (AGR-010). | PRM-CFG-005, 006 | A validar (PA-CFG-08) |
| RN-CFG-011 | Las claves `periodBoundary` solo rigen desde el inicio del período del módulo (ciclo de facturación, período de lectura). | Cuadros tarifarios por vigencia mensual (REL §5). | Adoptar (AGR-017). | — | — |
| RN-CFG-012 | Cada documento económico registra la huella de configuración usada (`valueId`/`configVersionId`). | No existe; solo `ITEMSFAC_EXTRAS.COD_CUA` (cuadro aplicado). | Mejorar (AGR-010). | — | — |
| RN-CFG-013 | La reversión crea una versión nueva; nunca se borra historia. | No existe. | Adoptar. | — | — |
| RN-CFG-014 | Dos versiones que modifican el mismo ítem: la segunda debe recalcular diff antes de publicar. | No existe. | Adoptar. | — | — |
| RN-CFG-015 | La copia de configuración entre tenants llega como borrador del destino; no copia comunidad, operación ni secretos; no crea vínculo de actualización con el origen. | — (BASE §81) | Adoptar (BASE §81). | — | — |
| RN-CFG-016 | Una configuración regulada exige fuente, jurisdicción y vigencia. | Cuadros nombrados por norma ("196/2023 GAS") en texto libre (REL §5). | Mejorar (ESP-005). | — | — |
| RN-CFG-017 | No se guardan secretos en parámetros ni en documentos de tenant; solo `secretRef`. | Credenciales en `.pro` (reversible) y en variables (ej. 801–811 credenciales base web) (RN-09 §5.3, §6.3). | Reemplazar. | — | — |
| RN-CFG-018 | Parámetros de módulos no licenciados se comportan como apagados. | `Modulos` del `.pro` controla habilitación (RN-09 §5.4). | Reemplazar por licencias T01. | — | — |
| RN-CFG-019 | Booleanos con semántica negativa se invierten al migrar ("No mostrar X" → `mostrarX`). | Ej. 2895 "No mostrar iconos al cargar archivos adjuntos". | Mejorar. | — | — |
| RN-CFG-020 | Registros maestros referenciados no se borran: se inactivan o se unifican. | `INTEGRIDAD` con `ELIMINA`; `btnUinificar`. | Replicar/mejorar. | — | — |
| RN-CFG-021 | La unificación redirige todas las referencias antes de marcar el duplicado `merged`; es reanudable. | `btnUinificar_Click` (sin detalle de reversibilidad). | Mejorar. | — | [VERIFICAR] si ProCoop borraba el duplicado |
| RN-CFG-022 | Un registro de plataforma no lo modifica un tenant; puede agregar atributos propios u overlay donde la tabla lo admita. | Cada base tiene su copia editable. | Reemplazar. | — | — |
| RN-CFG-023 | Una actualización de tabla de plataforma que afecta cálculos (fiscal, índices) se aplica según el modo de adopción del tenant; las de referencia (geo, documentos) se aplican siempre. | No existe. | Adoptar. | PRM-CFG-026, 033 | A validar (PA-CFG-10) |
| RN-CFG-024 | Domicilio de prestación ≠ domicilio personal/fiscal/correspondencia; una persona puede tener varios servicios en una ubicación y prestaciones en ubicaciones diferentes. | Domicilio en la ficha del titular y coordenadas del servicio (DFA M2). | Adoptar (BASE §77); modelo en M01. | — | — |
| RN-CFG-025 | Geocodificar no certifica cobertura, existencia del inmueble, titularidad ni disponibilidad; la posición del dispositivo no es el domicilio contratado. | — | Adoptar (BASE §77). | — | — |
| RN-CFG-026 | No se presenta precisión no disponible; un punto sin coincidencia calle/altura es `approximate` o `inReview`. | Lat/long sin precisión. | Adoptar (BASE §77). | PRM-CFG-021 | — |
| RN-CFG-027 | Si la calle no aparece, no se completa con otra calle homónima ni con coordenadas inventadas. | — | Adoptar (BASE §77 CU-GEO-01). | — | — |
| RN-CFG-028 | Confirmar o corregir el punto exige capability `cfg.geo.confirmarPunto` y motivo; queda historia. | — | Adoptar. | — | — |
| RN-CFG-029 | El catálogo nacional de calles se obtiene de fuente oficial abierta; Google se usa para geocodificar y visualizar bajo demanda, sin descarga masiva. | `CALLES` local cargada a mano. | Adoptar (BASE §77). | PRM-CFG-016..018 | A validar (PA-CFG-02, PA-CFG-03) |
| RN-CFG-030 | Un día es hábil si no es fin de semana configurado ni feriado de algún calendario aplicable al contexto (tenant/sucursal/servicio/localidad). | `FERIADOS` único por base. | Mejorar (AGR-017). | PRM-CFG-013, 014 | — |
| RN-CFG-031 | Vencimiento en día inhábil: se aplica la regla del módulo/servicio (siguiente hábil por defecto). | Implícito en facturación. | Adoptar; regla parametrizable. | PRM-CFG-015 | [VERIFICAR] regla ProCoop por servicio en RN-04 |
| RN-CFG-032 | Agregar o corregir un feriado no cambia vencimientos de documentos ya emitidos. | — | Adoptar (AGR-010). | — | — |
| RN-CFG-033 | Los cálculos temporales usan la zona horaria del tenant, nunca la del servidor. | Control de desfase de reloj de 60 min contra SQL (RN-09 §5.2); variables 224/225 (hora del servidor). | Reemplazar. | PRM-CFG-008 | — |
| RN-CFG-034 | Valor de serie ausente: se aplica la regla declarada por el consumidor (último anterior o exacto); nunca cero. | — | Adoptar (BASE §39.1 "no reemplazar por cero"). | — | — |
| RN-CFG-035 | La revisión de un valor de índice no borra el anterior; los cálculos ya emitidos no cambian. | — | Adoptar (AGR-010). | — | — |
| RN-CFG-036 | Importes de índices y cotizaciones en `Decimal128`; prohibido `Number`. | — | Adoptar (Guía §5). | — | — |
| RN-CFG-037 | Padrón: para un CUIT y fecha se usa la entrada vigente de mayor fecha de publicación; sin entrada → regla del régimen (M06). | `IIBB_LUA` con `FECHA_PUB/DES/HAS`. | Replicar/mejorar. | — | — |
| RN-CFG-038 | Código de enumeración inmutable; cambios de etiqueta no afectan datos. | Códigos numéricos en `CONF_CTRL`. | Mejorar. | — | — |
| RN-CFG-039 | Campo extra obligatorio nuevo no invalida registros existentes: se exige al editar el registro o se pide valor por defecto para completar en bloque. | `DATOSEXT` sin regla. | Adoptar. | — | — |
| RN-CFG-040 | Un campo extra no puede duplicar un campo de primera clase del modelo. | `*_EXTRAS` como parche de esquema. | Adoptar. | — | — |
| RN-CFG-041 | La personalización de formulario nunca vuelve opcional ni oculta un campo requerido por el negocio o la ley; solo endurece o presenta. | `FORMULARIOS_PERSONALIZACIONES` (propiedad libre de cualquier control). | Mejorar. | PRM-CFG-030 | A validar (PA-CFG-09) |
| RN-CFG-042 | Las vistas guardadas no amplían permisos: solo filtran/presentan datos que el usuario ya puede ver. | `ENTIDACOU` por usuario con SQL. | Mejorar. | PRM-CFG-031 | — |
| RN-CFG-043 | Semillas solo en tenants demo/sandbox; datos marcados y separables. | Base demo separada `PR_LAG_DEMO`. | Adoptar (BASE §39.1). | PRM-CFG-032 | A validar (PA-CFG-11) |
| RN-CFG-044 | Los importes de la semilla son ficticios y se rotulan "ilustrativos"; no constituyen condiciones comerciales aprobadas. | — | Adoptar (BASE §39.2, §41). | — | — |
| RN-CFG-045 | La identidad de la cooperativa (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) no es parámetro: es perfil del tenant. | Variables 518–527, 709 (RN-09 §3, §6.3). | Reemplazar por T01. **Corregido (DEC-064):** la identidad legal y fiscal vive en `legalEntities` de este anexo (RF-CFG-134); T01 conserva los datos de contratación del tenant y T03 el logo. | — | — |
| RN-CFG-046 | No se envían errores ni datos a casillas externas desde configuración; la observabilidad es de plataforma. | Variable −1 y dirección personal hardcodeada (RN-09 §4.3). | Descartar (privacidad). | — | — |
| RN-CFG-047 | Toda tabla CAT de dominio de CFG tiene destino de migración; toda tabla CAT fuera de dominio se delega con nombre de anexo. | — | Regla de exhaustividad (Guía §1). | — | — |
| RN-CFG-048 | Los PRM-IDs del catálogo T04b se asignan con el código del módulo destino y son los que citan los anexos de módulo; un anexo de módulo que necesite un parámetro sin origen ProCoop lo agrega con su propio ID y declara `legacy: none`. | — | Regla de documentación. | — | — |
| RN-CFG-049 | La configuración de cada servicio es independiente por tenant; no hay herencia viva entre tenants. | Una base por cooperativa (aislamiento físico). | Adoptar (BASE §81 COP-001). | — | — |
| RN-CFG-050 | Zonas, barrios y distritos son maestros territoriales sin importes; los cargos por zona se configuran en tarifas (M04). | `ZONAS.IMPORTE`, `REC_BALDIO`. | Reemplazar. | — | — |
| RN-CFG-051 | Siempre existe exactamente una entidad jurídica activa con `isDefault = true` por tenant; no se puede inactivar la entidad por defecto sin marcar antes otra. | Empresa única por `.pro`. | Mejorar (DEC-064). | PRM-CFG-039 | — |
| RN-CFG-052 | El CUIT de una entidad no se edita después de que la entidad tenga documentos económicos: un CUIT distinto es una entidad nueva (PA-CFG-14). Razón social, domicilio y condición fiscal cambian con vigencia y quedan en la historia. | `EMPRESAS` editable sin control. | Mejorar (DEC-064, AGR-010). | — | — |
| RN-CFG-053 | Una entidad jurídica o una sucursal referenciada por documentos no se borra: se inactiva; inactiva no se puede asignar a documentos nuevos. | Borrado físico. | Mejorar. | — | — |
| RN-CFG-054 | Una sucursal pertenece a una sola entidad jurídica a la vez; cambiarla tiene fecha efectiva y no altera documentos emitidos. | — | Adoptar (DEC-064). | — | — |
| RN-CFG-055 | La entidad jurídica no es un ámbito del motor de parámetros: lo que varía por entidad se configura en el dueño (M06 perfil fiscal, M15 planes, M16 `employer`) o por servicio (PRM-CFG-040). | — | Adoptar. | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.0 Mapeo lógico → físico y motor (DEC-111, DEC-114, DEC-110)

| Rol | Vigente (build GoodApps) | Notas |
|---|---|---|
| **Alcance funcional** | Motor T04 + catálogo T04b central (**DEC-114**) | Parámetros por módulo en §14 de cada Mxx; publicación/versionado sigue en CFG |
| **Persistencia** | Esquema **`cfg`** en Azure SQL (`cfg.ParameterDefinitions`, `cfg.ParameterValues`, `cfg.ConfigVersions`, geografía, maestros…) | Inventario y DDL en `07-catalogo-tablas-sql.md`, `07-ddl/sql/cfg/` |
| **Lectura** | Servicio .NET `IConfigReader` / `config.get(clave, ctx)` en el monolito modular | Misma semántica RF-CFG-020; validación Zod en API/React se mantiene |
| **Caché** | Por proceso + invalidación por evento `cfg.configVersion.published`; **Redis** opcional entre réplicas (DEC-111) | RNF-CFG-001 / RF-CFG-022 |
| **Publicación / jobs** | Transacción SQL + `OutboxEvents` / **Azure Queue** (`cfg:activar-vigencias`, cargas masivas) | Equivalente lógico a jobs históricos BullMQ |
| **Definiciones desde código** | Sincronización en cada despliegue (ensamblados de dominio → `cfg.ParameterDefinitions`) | Sustituye autoalta silenciosa ProCoop |
| **Tablas adoptables** | Consulta con `TenantId ∈ {PLATFORM, <tenant>}` en SQL explícito | RN-CFG-049; nunca omitir filtro de tenant |
| **Secreos** | `secretRef` → **Key Vault** por tenant (T06) | Sin valores en filas de parámetro |
| **Geografía embebida** | Subdocumento lógico `geoReference` → columnas normalizadas + JSON complementario según `07` | Consumido por M01/M09/M10 |

Traducción lógica → física (misma tabla que T05 §7.0): colección → tabla `cfg.*`; `TenantId` uniqueidentifier → `TenantId`; FK → constraints en `07-ddl`; índices parciales `isDeleted` → índices filtrados SQL.

Convenciones comunes (**vigente**): `TenantId`, auditoría, `version` (concurrencia optimista), vigencias bitemporales cuando aplique. **Histórico en §7.1–7.18:** tipos `uniqueidentifier`, «plugin de tenancy» y nombres de colección = contrato lógico sin cambiar RF/RN.

### 7.1 `parameterDefinitions` (plataforma; sincronizada desde código)

Propósito: catálogo de definiciones. Reemplaza la declaración de `clsVariables.GetChequeoVariables` y los metadatos de `VARIABLE` (`NOM_VAR`, `DES_VAR`, `COD_MOD`, `TIP_VAR`, `TIP_CTRL`, `CONF_CTRL`, `OBS_VAR`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | Siempre `PLATFORM`. |
| `key` | String | Sí | Clave semántica (§14.2). Única. |
| `module` | String | Sí | Código de anexo dueño en minúsculas (`fac`, `cob`, …). |
| `group` | String | Sí | Agrupador funcional dentro del módulo (`vencimientos`, `pagos360`). |
| `labelKey`, `descriptionKey`, `helpKey` | String | Sí/Sí/No | Claves de diccionario (T03). |
| `type` | Enum | Sí | `boolean`, `integer`, `decimal`, `money`, `percentage`, `string`, `text`, `date`, `time`, `dateTime`, `duration`, `enum`, `multiEnum`, `reference`, `accountRef`, `templateRef`, `email`, `url`, `phone`, `cuit`, `geoPoint`, `color`, `json`, `list`, `secretRef`. |
| `itemType` | Enum | Si `list` | Tipo de elemento. |
| `jsonSchemaRef` | String | Si `json` | Nombre del esquema Zod compartido. |
| `enumCode` | String | Si `enum`/`multiEnum` | Código de `enumerations`. |
| `reference` | Object | Si `reference` | `{ collection, labelField, filter, onlyActive }` (reemplaza `CONF_CTRL = "Tabla|CampoID|CampoDescripción|Where"`). |
| `unit` | String | No | `days`, `hours`, `ARS`, `%`, `kWh`, `m3`, … |
| `validation` | Object | No | `{ required, min, max, step, decimals, maxLength, regex, allowedValues }`. |
| `crossValidator` | String | No | Nombre del validador cruzado registrado por el módulo. |
| `allowedScopes` | [Enum] | Sí | Subconjunto de `platform`, `tenant`, `legalEntity`, `branch`, `service`, `category`, `user` (`legalEntity` agregado por DEC-096). |
| `defaultValue` | Mixed | Sí | Default de la definición (validado contra el tipo). |
| `changeClass` | Enum | Sí | `commercial`, `fiscal`, `operational`, `presentation`, `security`, `technical`. |
| `effectiveMode` | Enum | Sí | `immediate`, `effectiveDate`, `periodBoundary`. |
| `periodRef` | String | Si `periodBoundary` | Período del módulo (`fac.cicloFacturacion`, `med.periodoLectura`). |
| `dependencies` | [Object] | No | `{ kind: requires|excludes|enables|derivedDefault, key, condition }`. |
| `sensitive` | Boolean | Sí | Si `true`, siempre requiere revisión. |
| `visibility` | Enum | Sí | `platformOnly`, `tenantAdmin`, `moduleConfigurator`. |
| `channels` | [Enum] | Sí | `admin`, `pwa`, `landing`, `worker`, `publicApi`; `public: true` solo si se expone sin login. |
| `licenseCapability` | String | No | Capability de licencia que la habilita (T01). |
| `legacy` | [Object] | No | `{ table: VARIABLE|VARIABLE_PMOVIL, codVar, modVar, tipVar, tipCtrl, confCtrl, transform }`. |
| `status` | Enum | Sí | `active`, `deprecated`, `removed`. |
| `replacedBy` | String | No | Clave de reemplazo. |
| `introducedIn`, `deprecatedIn` | String | Sí/No | Versión del producto. |
| `prmId` | String | Sí | `PRM-<COD>-NNN` documental. |

Índices: `{ tenantId, key }` único; `{ tenantId, module, group }`; `{ tenantId, 'legacy.table', 'legacy.codVar', 'legacy.modVar' }`.

### 7.2 `parameterValues` (plataforma y tenant)

Propósito: valores por ámbito con historia bitemporal. Reemplaza las columnas de valor de `VARIABLE`/`VARIABLE_PMOVIL` y los valores implícitos en `USERS`, `EQUIPOS` y `.pro`.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `TenantId` | uniqueidentifier | Sí | Tenant o `PLATFORM` (defaults de plataforma). |
| `key` | String | Sí | Clave. |
| `scope` | Object | Sí | `{ type: platform|tenant|legalEntity|branch|service|category|user, refId: uniqueidentifier|null }`. Con `legalEntity`, `refId` → `legalEntities` (DEC-096). |
| `value` | Mixed | Sí | Validado contra la definición; importes como `DECIMAL(18,4)`; `secretRef` como `{ vaultId, secretName }`. |
| `validFrom` | Date | Sí | Fecha efectiva desde (UTC, interpretada en zona del tenant). |
| `validTo` | Date | No | Fecha efectiva hasta (exclusiva). |
| `recordedAt` | Date | Sí | Cuándo se registró (publicación). |
| `supersededAt` | Date | No | Cuándo fue reemplazado como conocimiento (corrección). |
| `configVersionId` | uniqueidentifier | Sí | Versión que lo publicó. |
| `origin` | Enum | Sí | `manual`, `import`, `copy`, `seed`, `migration`, `platform`, `rollback`. |
| `reason` | String | No | Motivo. |
| `status` | Enum | Sí | `published`, `superseded`, `closed`. |

Índices: `{ tenantId, key, 'scope.type', 'scope.refId', validFrom }`; `{ tenantId, configVersionId }`. Los valores en borrador **no** viven aquí sino en los ítems de `configVersions`.

### 7.3 `configVersions`

Propósito: conjunto coherente de cambios con ciclo de vida de publicación (AGR-009).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | Int | Sí | Correlativo por tenant. |
| `title`, `description` | String | Sí/No | — |
| `origin` | Enum | Sí | `manual`, `import`, `copy`, `seed`, `migration`, `platform`, `rollback`. |
| `sourceRef` | Object | No | Copia: `{ sourceTenantId, sourceVersionId, copyRunId }` (M02); importación: `importJobId`; reversión: `rolledBackVersionId`; plataforma: `platformTableReleaseId`. |
| `changeClasses` | [Enum] | Sí | Derivado de los ítems. |
| `status` | Enum | Sí | Ver §8.1. |
| `effectiveAt` | Date | Sí | Fecha efectiva por defecto de los ítems. |
| `scheduledAt` | Date | No | Momento programado de publicación. |
| `contractPolicy` | Enum | Si afecta contratos | `newOnly`, `allFromEffectiveDate`, `requireAction`. |
| `items` | [Object] | Sí | `{ itemId, kind: parameter|masterRecord|enumerationItem|customFieldDefinition|formCustomization|moduleConfig, contributor, target: { key|collection+id }, scope, op: create|update|close|delete|merge, before, after, effectiveFrom, sourceRef (norma) }`. |
| `dependencyReport` | Object | No | Resultado de dependencias. |
| `validationReport` | Object | No | Errores/avisos por ítem. |
| `simulationReport` | Object | No | Resultados por contributor (sin efectos). |
| `diffBaseAt` | Date | No | Momento contra el que se calculó el diff (rebase). |
| `workflowInstanceId` | uniqueidentifier | No | Revisión en T11. |
| `approvals` | [Object] | No | `{ userId, decision, at, comment }`. |
| `publishedAt`, `publishedBy` | Date/uniqueidentifier | No | — |
| `cancelReason`, `rejectReason` | String | No | — |

Índices: `{ tenantId, number }` único; `{ tenantId, status, scheduledAt }`; `{ tenantId, 'items.target.key' }`.

### 7.4 `masterTableDefinitions` (plataforma)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | `geo.localities`, `fis.vatRates`, `cfg.enum.maritalStatus`… |
| `collection` | String | Sí | Colección física. |
| `ownerModule` | String | Sí | — |
| `scope` | Enum | Sí | `platform`, `tenant`, `platformAdoptable`. |
| `allowTenantRecords` | Boolean | Sí | Overlay de registros del tenant. |
| `tenantAttributes` | [FieldDef] | No | Atributos propios del tenant sobre registros de plataforma. |
| `fields` | [FieldDef] | Sí | Esquema para el editor (`name`, `type`, `labelKey`, `required`, `searchable`, `listColumn`). |
| `naturalKey` | [String] | Sí | Clave natural para importación/unificación. |
| `validityMode` | Enum | Sí | `none`, `validity`. |
| `versioned` | Boolean | Sí | Cambios por `configVersion` o publicación inmediata auditada. |
| `importable`, `exportable`, `mergeable` | Boolean | Sí | — |
| `referencedBy` | [Object] | Sí | `{ collection, path }` para "en uso por". |
| `legacyTables` | [String] | No | Tablas CAT origen. |

### 7.5 Enumeraciones: `enumerations` y `enumerationItems`

`enumerations`: `code` (único), `ownerModule`, `kind` (`system`, `extensible`, `tenant`, `platform`), `labelKey`, `itemAttributes` ([FieldDef]), `hierarchical` (Boolean), `legacy` (`{ table | confCtrl }`).

`enumerationItems`: `TenantId` (PLATFORM o tenant), `enumCode`, `code` (String inmutable), `labelKey` o `label` (si es del tenant, se registra en diccionario), `order`, `color`, `icon`, `parentCode`, `active`, `validFrom`, `validTo`, `attributes` (Mixed validado), `externalCodes` (`{ arca, inaes, enargas, oceba, ersep, enacom, sen }`), `isSystem`. Índice único `{ tenantId, enumCode, code }`.

### 7.6 Geografía

| Colección | Ámbito | Campos principales | Índices | Origen CAT |
|---|---|---|---|---|
| `countries` | Plataforma | `iso2`, `iso3`, `name`, `externalCodes.arca`, `active` | `{tenantId, iso2}` único | `PAISES` |
| `provinces` | Plataforma | `countryIso2`, `code` (INDEC 2 díg.), `name`, `isoCode` (AR-X), `externalCodes` (`arca`, `inaes`, `enargas`, `sen`), `centroid` | `{tenantId, countryIso2, code}` único | `PROVINC` |
| `departments` | Plataforma | `provinceCode`, `code` (INDEC 5 díg.), `name`, `kind` (departamento/partido/comuna), `externalCodes` (`inaes`, `enargas`, `oceba`), `geometryRef` | `{tenantId, provinceCode, code}` | `DEPTO`, `DEPARTA` |
| `localities` | Plataforma + overlay tenant | `provinceCode`, `departmentCode`, `municipalityCode`, `code` (Georef/BAHRA), `name`, `kind` (localidad censal, asentamiento, paraje), `postalCodes` [String], `externalCodes` (`arca`, `inaes`, `enargas`, `enargasZone`, `oceba`), `centroid`, `source`, `tenantAttributes` (`kmToHeadquarters`, …), `isTenantOwned`, `status` | `{tenantId, provinceCode, code}`; texto `name` | `LOCALIDA` |
| `postalCodes` | Plataforma | `code` (4 díg.), `cpa` (8 alfanum., opcional), `localityCodes` [String], `provinceCode`, `source` | `{tenantId, code}` | `LOCALIDA.COD_POS` |
| `streets` | Plataforma + tenant (locales) | `localityCode`, `departmentCode`, `provinceCode`, `sourceId`, `name`, `normalizedName`, `kind` (calle, avenida, pasaje, ruta, camino), `heights` (`{ startLeft, endLeft, startRight, endRight }`), `source` (`georef`, `tenant`, `migration`), `sourceUpdatedAt`, `isTenantOwned`, `status` (`active`, `pendingValidation`, `merged`, `inactive`), `mergedInto`, `geometryRef` | `{tenantId, localityCode, normalizedName}`; texto | `CALLES`, `RNQCALL` (sin `RUTA/ORDEN/SECTOR`) |
| `streetAliases` | Tenant | `streetId`, `alias`, `normalizedAlias`, `kind` (histórico, popular, legacy), `legacy` | `{tenantId, normalizedAlias}` | `CALLES` |
| `streetProposals` | Tenant → plataforma | `streetId` (local), `proposedBy`, `evidence` (adjuntos T11), `status` (`proposed`, `approved`, `rejected`, `merged`), `decisionBy`, `decisionAt`, `platformStreetId` | `{tenantId, status}` | — |
| `neighborhoods` | Tenant (y plataforma si hay fuente) | `localityCode`, `code`, `name`, `polygon` (GeoJSON, opcional), `status`, `legacy` | `{tenantId, localityCode, code}` | `BARRIOS` |
| `zones` | Tenant | `code`, `name`, `kind` (lectura, operación, cobranza, comercial), `localityCodes` [String], `polygon`, `branchId`, `status`, `legacy` | `{tenantId, code}` | `ZONAS` (sin `IMPORTE`, `REC_BALDIO`) |
| `cadastralDistricts` | Tenant | `localityCode`, `district`, `section`, `description`, `externalCodes`, `legacy` | `{tenantId, district, section}` | `DISTRITO_SECCION` |
| `geocodeRequests` | Tenant | `subjectType`, `subjectId`, `inputText`, `provider` (`georef`, `google`), `candidates` [Object], `status`, `attempts`, `lastError`, `quotaPeriod`, `expiresAt` (TTL según PA-CFG-03) | `{tenantId, status, nextAttemptAt}`; TTL | — |

**Subdocumento compartido `geoReference`** (esquema en `packages/shared/geo`, embebido por M01 en direcciones e inmuebles, por M10 en órdenes y por M09 en tickets):

| Campo | Tipo | Descripción |
|---|---|---|
| `originalText` | String | Texto tal como se ingresó. |
| `components` | Object | `countryIso2`, `provinceCode`, `departmentCode`, `localityCode`, `streetId`, `streetName`, `number`, `floor`, `unit`, `building`, `betweenStreets` [streetId/Name], `neighborhoodCode`, `zoneCode`, `postalCode`, `accessReferences`, `rural` (`{ route, km, paraje, lot, field }`), `noNumber` (Boolean). |
| `normalized` | Object | Dirección normalizada y su `source`. |
| `point` | GeoJSON Point | `[lng, lat]`. Índice `2dsphere` en la colección dueña. |
| `precision` | Enum | `rooftop`, `interpolated`, `street`, `locality`, `manual`, `none`. |
| `status` | Enum | `pending`, `candidate`, `confirmed`, `approximate`, `inReview`, `failed`, `manualPoint`. |
| `source` | Enum | `georef`, `google`, `manual-assisted`, `device`, `migration`, `field-survey`. |
| `confirmedBy`, `confirmedAt`, `reason` | — | Quién, cuándo y por qué se confirmó/corrigió. |
| `history` | [Object] | Cambios anteriores (punto, estado, fuente, actor, fecha, motivo). |
| `providerRefs` | Object | `googlePlaceId` (si se permite persistir), `georefId`. |

### 7.7 Calendarios

| Colección | Campos principales | Índices | Origen |
|---|---|---|---|
| `calendars` | `TenantId` (PLATFORM o tenant), `code`, `name`, `kind` (`national`, `provincial`, `municipal`, `tenant`, `service`), `provinceCode`, `localityCode`, `parentCalendarCodes` [String], `weekendDays` [0–6], `timezone` | `{tenantId, code}` único | — |
| `holidays` | `calendarCode`, `date` (fecha civil), `recurring` (`{ day, month }` si sin año), `year`, `kind` (`fixed`, `movable`, `bridge`, `nonWorking`, `local`, `leave`), `name`/`labelKey`, `sourceRef` (norma), `status`, `recordedAt` | `{tenantId, calendarCode, date}` | `FERIADOS` |
| `calendarAssignments` (en `parameterValues`) | Clave `cfg.calendario.calendariosAplicables` por ámbito tenant/sucursal/servicio | — | — |

### 7.8 Índices económicos y monedas

| Colección | Campos principales | Índices | Origen |
|---|---|---|---|
| `economicIndexSeries` | `TenantId` (PLATFORM o tenant), `code`, `name`/`labelKey`, `kind` (`inflation`, `exchangeRate`, `interestRate`, `lateFeeIndex`, `other`), `frequency` (`daily`, `monthly`, `intraday`), `unit` (`index`, `percentMonthly`, `percentAnnual`, `percentDaily`, `ARSperUnit`), `currencyCode`, `rateSide` (`buy`, `sell`, `mid`), `source` (`{ name, url, integrationId }`), `adoptable`, `status`, `legacy` (`TABINFL.COD_TAB`, `TABMORA.COD_TAB` o `TIPO_FAC`; antes `legacyRefs`) | `{tenantId, code}` único | `TABINFL`, `TABMORA`, `COT_DOL` |
| `economicIndexValues` | `seriesId` (antes `seriesCode`; nombre de T05 COL-CFG-22), `date` o `period` (`YYYY-MM`), `time` (intradía), `value` (DECIMAL(18,4)), `status` (`provisional`, `definitive`), `publishedAt`, `recordedAt`, `supersededAt`, `revisionOf`, `source` | `{tenantId, seriesId, date, recordedAt}` | `INFLACIO`, `INDICESMORA`, `COT_DOL` |
| `currencies` | `isoCode`, `arcaCode`, `name`, `symbol`, `decimals`; atributos de tenant: `divisible`, `rounding`, `perceptionPercent`, `allowChange`, `allowedForCollection`, `isSystem` | `{tenantId, isoCode}` | `TIP_MON` |

### 7.9 Tablas fiscales y padrones

> **Reemplazado por M06 (CTR-DAT-13):** `vatConditions` → `vatConditionSettings` (COL-FIS-15), `vatRates` → `vatRates` de M06 (COL-FIS-16), `grossIncomeConditions` y `grossIncomeRates` → `grossIncomeSettings` (COL-FIS-19), `taxRegistries` → `taxpayerRegistries` (COL-FIS-20), `taxRegistryEntries` → `taxpayerRegistryEntries` (COL-FIS-21). La tabla se conserva como referencia de origen; `identityDocumentTypes` sigue en T04.

| Colección | Campos principales | Índices | Origen |
|---|---|---|---|
| `vatConditions` | `code`, `labelKey`, `arcaReceiverConditionId`, `suggestedVoucherLetter` (A/B/C/E/M), `isRegistered`, `isExempt`, `isFinalConsumer`, `validFrom`, `validTo`, `sourceRef`, `legacy` (`SITIVA.COD_SIT`) | `{tenantId, code, validFrom}` | `SITIVA` |
| `vatRates` | `code`, `percent` (DECIMAL(18,4)), `arcaId`, `validFrom`, `validTo`, `sourceRef`; atributos tenant (M15): `salesAccountId`, `purchaseAccountId`, `perceptionSalesAccountId` | `{tenantId, code, validFrom}` | `ALI_IVA` |
| `grossIncomeConditions` | `code`, `labelKey`, `isExempt`, `taxBaseRule`, `regime` (`local`, `multilateral`, `simplified`), `validFrom`, `validTo`, `legacy` | `{tenantId, code}` | `SITIBR` |
| `grossIncomeRates` | `jurisdictionCode` (provincia), `activityCode` (NAES/actividad provincial), `percent`, `mustRemit`, `taxCode`, `taxGroup`, `validFrom`, `validTo`, `sourceRef`, `legacy` | `{tenantId, jurisdictionCode, activityCode, validFrom}` | `ALI_IBR` |
| `identityDocumentTypes` | `code`, `labelKey`, `arcaCode`, `inaesCode`, `enargasCode`, `senCode`, `validation` (regex, dígito verificador), `appliesTo` (`person`, `company`) | `{tenantId, code}` | `DOCUMENT` |
| `taxRegistries` | `TenantId` (PLATFORM o tenant), `code` (`arca-padron`, `iibb-cba`, `iibb-arba`, `iibb-agip`, `sircreb`…), `jurisdictionCode`, `regimes` [String], `source`, `requiresTenantCredentials`, `lastImportAt`, `status` | `{tenantId, code}` | — |
| `taxRegistryEntries` | `registryCode`, `cuit`, `regime`, `rate` (DECIMAL(18,4)), `group`, `publishedAt`, `validFrom`, `validTo`, `importJobId`, `raw` (campos del archivo) | `{tenantId, registryCode, cuit, validFrom}` | `IIBB_LUA` |

### 7.10 Tablas de plataforma: publicaciones y adopciones

`platformTableReleases`: `tableCode` o `seriesId` (antes `seriesCode`), `releaseNumber`, `summary`, `items` (altas, cambios, bajas con antes/después), `sourceRef` (norma/URL/fecha), `effectiveAt`, `affectsCalculation` (Boolean), `status` (`draft`, `published`, `superseded`), `publishedBy`, `publishedAt`.

`platformTableAdoptions`: `TenantId`, `tableCode`/`seriesId` (antes `seriesCode`), `mode` (`follow`, `pinned`, `copy`), `pinnedReleaseNumber`, `pendingReleases` [Number], `acknowledgedBy`, `acknowledgedAt`, `purpose` (para series: `inflation`, `exchangeRateUSD`, `lateFee`).

### 7.11 Campos extra, formularios y vistas

`customFieldDefinitions`: `entity` (enum de entidades habilitadas por los módulos: `person`, `account`, `serviceContract`, `property`, `category`, `workOrder`, `ticket`, `product`, `supplier`, `employee`, `fixedAsset`), `key` (camelCase, única por entidad), `labelKey`, `type` (§5.12), `enumCode`, `reference`, `validation` (`required`, `unique`, `min`, `max`, `decimals`, `maxLength`, `regex`), `defaultValue`, `section`, `order`, `visibility` [`admin`, `pwaSocio`, `pwaEmpleado`, `landing`], `editCapability`, `searchable`, `exportable`, `historized`, `status` (`draft`, `active`, `deprecated`), `legacy` (`{ table: DATOSEXT|PROPIEITEMS, code }`). Índice único `{ tenantId, entity, key }`. Valores: en el documento dueño, `customFields: { <key>: value }`; si `historized`, `customFieldHistory: [{ key, value, validFrom, validTo, recordedAt, by }]`.

Entidades con campos extra (valores del enum `entity`) y anexo dueño de cada una; el dueño consume EVT-CFG-16:

| `entity` | Anexo dueño |
|---|---|
| `person`, `account`, `property` | M01 |
| `serviceContract`, `category`, `product` (producto comercial) | M02 |
| `ticket` | M09 |
| `workOrder` | M10 |
| `supplier` | M12 |
| `product` (artículo de stock), `fixedAsset` | M13 |
| `employee` | M16 |

`formCustomizations`: `formKey` (de un registro de formularios personalizables publicado por cada módulo), `fieldKey`, `hidden`, `required`, `readOnly`, `defaultValue`, `labelKey`, `helpKey`, `order`, `allowedEnumCodes` [String], `status` (`active`, `superseded`; §8.10; antes sin valores), `configVersionId`, `legacy` (`FORMULARIOS_PERSONALIZACIONES.ID_FORM`, `ABM_VALIDACIONES.COD_ABM`). Índice `{ tenantId, formKey, fieldKey }` único por vigente.

**Reemplazado por `dataTableViews` de T03 (CTR-DAT-11).** `savedViews`: `screenKey`, `ownerUserId` (null si compartida), `shareScope` (`private`, `role`, `tenant`), `roleIds` [uniqueidentifier], `name`, `columns` [{ key, width, visible, order }], `filters` (estructura validada por la pantalla), `sort`, `groupBy`, `totals`, `conditionalFormats` [{ column, condition, style }], `pageSize`, `isDefault`, `legacy` (`ENTIDACOU.COD_CON`, `ENTIDADES.COD_ENT`). Índice `{ tenantId, screenKey, ownerUserId }`.

### 7.12 Importaciones, semillas y equivalencias

`masterImportJobs`: `targetTableCode`, `fileRef` (almacenamiento privado), `format` (`xlsx`, `csv`, `fixedWidth`), `layoutRef` (T06 si es ancho fijo), `mapping`, `mode` (`insertOnly`, `upsert`, `replaceValidity`), `status` (§8.6), `counters` (`total`, `valid`, `errors`, `inserted`, `updated`, `closed`), `errorFileRef`, `configVersionId` o `platformTableReleaseId`, `idempotencyKey`.

`seedPacks` (plataforma): `code` (`demo-base-s39`), `version`, `description`, `contents` (lista de bloques por colección/contributor), `demoOnly`. `seedApplications`: `TenantId`, `seedPackCode`, `version`, `appliedAt`, `appliedBy`, `configVersionId`, `createdRecordRefs` (para retiro), `status` (`applied`, `removed`).

`legacyParameterMappings` (plataforma): `legacyTable` (`VARIABLE`, `VARIABLE_PMOVIL`), `modVar` (1 CoopOnline, 2 PMovil/Captor, 3 PWeb), `codVar`, `legacyName` (`NOM_VAR`), `legacyModule` (`COD_MOD`), `legacyType`, `directUse` (Boolean, de RN-09), `destinationKind` (`parameter`, `dictionary`, `tenantProfile`, `secret`, `env`, `discarded`, `replacedBy`, `toValidate`), `keys` [String], `transform` (`identity`, `invertBoolean`, `fkMap:<tabla>`, `enumMap`, `split`, `textDate→date`), `prmId`, `notes`. Índice único `{ legacyTable, modVar, codVar }`.

### 7.13 Mapeo de tablas ProCoop a colecciones

| Tabla ProCoop (CAT) | Colección CoopApps | Transformación |
|---|---|---|
| `VARIABLE` | `parameterDefinitions` + `parameterValues` + `legacyParameterMappings` | Por equivalencia T04b. |
| `VARIABLE_PMOVIL` | Ídem; textos → diccionario (T03) | Separar por `MOD_VAR`. |
| `MODULOS` | Código de módulo en definiciones; catálogo de módulos en T01 | — |
| `PAISES`, `PROVINC`, `DEPARTA`, `DEPTO`, `LOCALIDA` | `countries`, `provinces`, `departments`, `localities` | Conciliación por nombre/código contra Georef; códigos externos conservados. |
| `BARRIOS` | `neighborhoods` | Directo con `legacy.key`. |
| `CALLES`, `RNQCALL` | `streets` (locales vinculadas a nacionales) + `streetAliases`; `RUTA/ORDEN/SECTOR` → M03 | Matching por nombre normalizado y localidad. |
| `ZONAS` | `zones`; `IMPORTE`, `REC_BALDIO` → M04 | — |
| `DISTRITO_SECCION` | `cadastralDistricts` | — |
| `FERIADOS` | `holidays` del calendario del tenant (los nacionales se descartan a favor de plataforma) | Comparar contra plataforma. |
| `TABINFL`+`INFLACIO` | `economicIndexSeries`+`economicIndexValues` | Serie del tenant o adopción si coincide con oficial. |
| `COT_DOL` | Ídem (`exchangeRate`) | `COT_DOLAR` → comprador; `COTIZACION_VENTA` → vendedor. |
| `TABMORA`+`INDICESMORA` | Ídem (`lateFeeIndex`) | `TIPO_FAC` → propósito/servicio en M08. |
| `TIP_MON` | `currencies` | — |
| `SITIVA` | `vatConditions` (plataforma) + atributos tenant (comprobantes por defecto) en M06 | — |
| `ALI_IVA` | `vatRates` + cuentas en M15 | — |
| `SITIBR`, `ALI_IBR` | `grossIncomeConditions`, `grossIncomeRates` | — |
| `IIBB_LUA` | `taxRegistryEntries` | — |
| `DOCUMENT` | `identityDocumentTypes` | — |
| `EST_CIVIL`, `OCUPACIO`, `ESTADOS` (etiquetas) | `enumerationItems` | — |
| `DATOSEXT`, `DATOSETB`, `PROPIEITEMS`, `PROPIEITEMS_VALORES`, `PROPIEITEMS_ASIGNACIONES` | `customFieldDefinitions` + `customFields` en documentos dueños + enumeración por propiedad con valores | — |
| `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES` | `formCustomizations` | Solo propiedades soportadas; resto descartado con reporte. |
| `ENTIDACOU`, `ENTIDADES` (vistas) | `savedViews` | Solo columnas/filtros representables. |
| `MAPA` | `parameterValues` (`cfg.geo.centroMapa`, `cfg.geo.zoomInicial` por módulo) | — |
| `EMPRESAS` | `legalEntities` (§7.14) | La principal queda `isDefault`; CUIT único (RF-CFG-142). |
| `SU_EMPRESAS`, `SU_TIPOEMPLEADOR` | `legalEntities.employer` (match por CUIT) | CTR-DAT-06. |
| Valores distintos de `PTOVENTA.SUC_COM` (DEC-098; antes "Sucursales de `EMPRESAS`/`CAJASJP` [VERIFICAR]") | `branches` (§7.15) | Propuesta revisada y confirmada por la cooperativa antes de migrar puntos de venta y cajas (RF-CFG-142). |
| `EQUIPOS` / puestos [VERIFICAR] | `workstations` (§7.16) | Dispositivos y agente local en M09. |
| `SU_ACTIVIDADES`, `SU_CONDICION`, `SU_CONTRATACION`, `SU_SITUACION_REVISTA`, `SU_SINIESTRADO`, `SU_BENEFICIOS_SICOSS`, `SU_OBRA`, `SU_SALARIO_MINIMO`, `SU_DEDUCCIONES*`, `SU_TRAMAS*` | Tablas legales de sueldos (§7.17) | CTR-DAT-73. |

### 7.14 `legalEntities` (tenant; COL-CFG-41; DEC-064; O0)

Entidades jurídicas emisoras del tenant. Campos comunes de T05 (`TenantId`, auditoría, `version`).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string (`^[A-Z0-9-]{2,12}$`) | Sí | Código corto único en el tenant (ej. `COOP`, `MUTUAL`). |
| `legalName` | string | Sí | Razón social. |
| `tradeName` | string | No | Nombre de fantasía para documentos. |
| `legalForm` | enum `cooperativa`, `mutual`, `asociacionCivil`, `sociedad`, `otra` | Sí | Forma jurídica (mismos valores que `tenants.legalForm` de T01). |
| `inaesRegistration` | string | No | Matrícula INAES (cooperativas y mutuales). |
| `fiscal` | objeto | Sí | `cuit` (11 dígitos con dígito verificador), `ivaConditionCode` (código ARCA de condición frente al IVA; desde O4 validado contra `vatConditionSettings` de M06), `iibbRegime` (`local`, `multilateral`, `simplified`, `exempt`, `notRegistered`), `iibbNumber`, `activityStartDate` (date). |
| `address` | subdocumento domicilio con `geoReference` (§7.6) | Sí | Domicilio legal y fiscal. |
| `contact` | `{ email, phone }` | No | Contacto institucional para documentos. |
| `brandingVariantKey` | string (`^[a-z0-9-]{2,32}$`) | No | Variante de marca de `tenantBrandings` (T03) para los documentos de esta entidad; sin valor usa la del tenant. **Validación:** al guardar (alta, edición o publicación de la configuración) la clave debe existir en `tenantBrandings.variants[].variantKey` de la publicación de marca vigente del tenant (T03 §7.B, campo `variants`); si no existe, el guardado se rechaza con `422 cfg.legalEntity.brandingVariantNotFound`. Si una publicación posterior de T03 elimina la variante, T03 exige confirmación (T03 §7.B) y, mientras tanto, el documento se emite con la marca base y una advertencia (no bloquea la emisión). |
| `isDefault` | boolean | Sí | Entidad por defecto (RN-CFG-051). |
| `status` | enum `active`, `inactive` | Sí | §8.9. |
| `validFrom`, `validTo` | date | Sí / No | Vigencia de la entidad. |
| `changeHistory[]` | `{ field, oldValue, newValue, validFrom, recordedAt, by, reason }` | No | Historia bitemporal de razón social, domicilio y datos fiscales (RN-CFG-052, AGR-010). |
| `employer` | objeto | No (lo completa M16 en O9) | Absorbe `employers` de M16 (CTR-DAT-06): `employerTypeCode`, `mainActivityCode`, `zoneCode`, `contributionRegime`, `workplaceAddresses[]`, `workRiskInsurance`, `lifeInsurance`, `incomeTaxAgent`, `payslipVoucherTypeId`, `payslipNumbering`, `payslipSigner` (firmante habilitado en T11, DEC-078), `bankAgreements[]` (con `treasuryAccountId` de M14), `lsdSettings`, `status`. El esquema del subdocumento lo define M16 §7.1. |
| `legacy` | `{ table: EMPRESAS\|SU_EMPRESAS, code }` | No | Origen de migración. |

Índices: `{ tenantId, code }` único; `{ tenantId, 'fiscal.cuit' }` único; `{ tenantId, isDefault }` único parcial (`isDefault: true, status: 'active'`); `{ tenantId, status }`.

Los nombres de REQ-DEC-064 (`cuit`, `ivaCondition`, `iibbRegime`, `activityStartDate`, `address`) corresponden a `fiscal.cuit`, `fiscal.ivaConditionCode`, `fiscal.iibbRegime`, `fiscal.activityStartDate` y `address` (CTR-CFG-19).

### 7.15 `branches` (tenant; COL-CFG-42; DEC-064; O0)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código único en el tenant (ej. `SUC-01`). |
| `name` | string | Sí | Nombre visible (por diccionario si el tenant lo traduce). |
| `legalEntityId` | uniqueidentifier → `legalEntities` | Sí | Entidad jurídica de la sucursal (RN-CFG-054). |
| `localityId` | uniqueidentifier → `localities` | Sí | Localidad. |
| `address` | subdocumento domicilio con `geoReference` | Sí | Domicilio de la sucursal. |
| `uses` | array enum `attention`, `cashier`, `warehouse`, `pointOfSale`, `technicalBase` | Sí | Usos habilitados; los dueños (M07 cajas, M13 depósitos, M06 puntos de venta, M09 turnero) validan contra estos usos. |
| `isHeadquarters` | boolean | Sí | Casa central (una por entidad). |
| `openingHours[]` | `{ weekday, from, to }` | No | Horario de atención. |
| `calendarCode` | string → `calendars` | No | Calendario local para días hábiles; sin valor usa el del tenant. |
| `contact` | `{ email, phone }` | No | — |
| `status` | enum `active`, `inactive` | Sí | §8.9. |
| `validFrom`, `validTo` | date | Sí / No | Vigencia. |
| `legalEntityHistory[]` | `{ legalEntityId, validFrom, validTo, recordedAt, by }` | No | Cambios de entidad con fecha efectiva. |
| `legacy` | `{ table: 'PTOVENTA', key: 'SUC_COM', values: [String] }` | No | Origen de migración: valores de `PTOVENTA.SUC_COM` fusionados en la sucursal (DEC-098, RF-CFG-142; antes `{ table, code }` [VERIFICAR]). |

Índices: `{ tenantId, code }` único; `{ tenantId, legalEntityId, status }`; `{ tenantId, localityId }`.

### 7.16 `workstations` (tenant; COL-CFG-43; O1)

Campos: `code` (único en el tenant), `name`, `branchId` → `branches`, `kind` (`counter`, `cashier`, `office`, `kiosk`, `field`), `localAgentId` (agente local de M09, opcional), `devices[]` `{ kind (printer, fiscalPrinter, reader, scanner, cardTerminal), name, localAgentDeviceKey }`, `status` (`active`, `inactive`), `legacy` (`EQUIPOS`). Índices `{ tenantId, code }` único; `{ tenantId, branchId }`. Las cajas (M07) y el turnero (M09) referencian `workstationId`; los atributos técnicos del dispositivo los mantiene M09.

### 7.17 Tablas legales de sueldos de plataforma (COL-CFG-44 a 53; CTR-DAT-73; O9)

Tenant `PLATFORM`, con `source` (norma, resolución, URL), `validFrom`, `validTo`, `publishedAt`; publicadas por `platformTableReleases` y adoptadas por `platformTableAdoptions` (§7.10), que absorbe `officialTableAdoptions` de M16. Los feriados que M16 listaba en su §7.45 son los `holidays` de §7.7. El contenido funcional de cada tabla lo define M16 §7.45.

| COL | Colección | Contenido | Índice | Origen ProCoop |
|---|---|---|---|---|
| COL-CFG-44 | `payrollOfficialCodes` | Códigos oficiales por `type` (actividad, condición, modalidad de contratación, situación de revista, siniestrado, beneficio SICOSS, tipo de empleador, zona, obra social RNOS, concepto ARCA, motivo de egreso, tipo de liquidación) | `{ type, code, validFrom }` | `SU_ACTIVIDADES`, `SU_CONDICION`, `SU_CONTRATACION`, `SU_SITUACION_REVISTA`, `SU_SINIESTRADO`, `SU_BENEFICIOS_SICOSS`, `SU_TIPOEMPLEADOR`, `SU_OBRA` |
| COL-CFG-45 | `contributionRates` | Alícuotas de aportes y contribuciones por subsistema, régimen y tipo de empleador | `{ subsystem, regime, employerType, validFrom }` | Clasificaciones SICOSS |
| COL-CFG-46 | `contributionBaseLimits` | Bases imponibles mínima y máxima por período | `{ period }` | P2437, P2438 |
| COL-CFG-47 | `minimumWages` | SMVM mensual, diario y por hora | `{ validFrom }` | `SU_SALARIO_MINIMO` |
| COL-CFG-48 | `incomeTaxDeductionTables` | Deducciones de Ganancias por tipo, año y mes | `{ type, year, month }` | `SU_DEDUCCIONES*` |
| COL-CFG-49 | `incomeTaxScales` | Escalas de Ganancias por tipo, año, mes y tramo | `{ type, year, month, from }` | `SU_TRAMAS*` |
| COL-CFG-50 | `incomeTaxRules` | Reglas generales de Ganancias | `{ validFrom }` | `clsGanancias` |
| COL-CFG-51 | `cedularTaxScales` | Escala de impuesto cedular | `{ validFrom }` | `Impuesto_Cedular` |
| COL-CFG-52 | `garnishmentScales` | Escala de embargabilidad | `{ validFrom }` | — |
| COL-CFG-53 | `laborLawParameters` | Vacaciones art. 150, licencias art. 158, topes de horas extra, plazos de pago, límite art. 133 | `{ validFrom }` | — |

### 7.18 Tablas de campos de las colecciones definidas en texto

Tabla agregada en el cierre de residuales (05-11-2026) para las colecciones de este anexo que solo tenían la definición en texto. Los campos salen del texto del §7 y de las referencias y claves únicas de T05; la definición en texto sigue vigente y prevalece si hay diferencia. Los campos comunes (`_id`, `TenantId`, auditoría, `version`) no se repiten. La obligatoriedad se asume por regla (clave única, `status`, `code`, `name` y referencias de T05 = Sí; resto = No) y queda como PA-CFG-15 (Asumida, DEC-072).

**`enumerationItems`** — Ítems de enumeraciones y tablas maestras simples (COL-CFG-06; definición en texto en §7.5)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `enumCode` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | String inmutable |
| `labelKey` | string | No | — | Según la definición en texto del §7 |
| `label` | string | No | — | si es del tenant, se registra en diccionario |
| `order` | int | No | — | Según la definición en texto del §7 |
| `color` | string | No | — | Según la definición en texto del §7 |
| `icon` | string | No | — | Según la definición en texto del §7 |
| `parentCode` | string | No | — | Según la definición en texto del §7 |
| `active` | bool | No | — | Según la definición en texto del §7 |
| `validFrom` | Date | No | — | Según la definición en texto del §7 |
| `validTo` | Date | No | — | Según la definición en texto del §7 |
| `attributes` | array | No | — | Mixed validado |
| `externalCodes` | object | No | — | `{ arca, inaes, enargas, oceba, ersep, enacom, sen }` |
| `isSystem` | bool | No | — | Según la definición en texto del §7 |
| `enumerationId` | uniqueidentifier | Sí | `enumerations` (T04) | destino → `enumerations` |

**`countries`** — Países (COL-CFG-07; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `iso2` | string | No | — | Según la definición en texto del §7 |
| `iso3` | string | No | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `externalCodes.arca` | string | No | — | Según la definición en texto del §7 |
| `active` | bool | No | — | Según la definición en texto del §7 |
| `isoCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`provinces`** — Provincias (COL-CFG-08; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `countryIso2` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `isoCode` | string | No | — | AR-X |
| `externalCodes` | enum | No | — | `arca`, `inaes`, `enargas`, `sen` |
| `centroid` | string | No | — | Según la definición en texto del §7 |
| `countryId` | uniqueidentifier | Sí | `countries` (T04) | destino → `countries` |

**`departments`** — Departamentos/partidos (COL-CFG-09; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `provinceCode` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | departamento/partido/comuna |
| `externalCodes` | enum | No | — | `inaes`, `enargas`, `oceba` |
| `geometryRef` | string | No | — | Según la definición en texto del §7 |
| `provinceId` | uniqueidentifier | Sí | `provinces` (T04) | destino → `provinces` |

**`localities`** — Localidades (COL-CFG-10; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `provinceCode` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `departmentCode` | string | No | — | Según la definición en texto del §7 |
| `municipalityCode` | string | No | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | localidad censal, asentamiento, paraje |
| `postalCodes` | array de string | No | — | Según la definición en texto del §7 |
| `externalCodes` | enum | No | — | `arca`, `inaes`, `enargas`, `enargasZone`, `oceba` |
| `centroid` | string | No | — | Según la definición en texto del §7 |
| `source` | string | No | — | Según la definición en texto del §7 |
| `tenantAttributes` | array | No | — | `kmToHeadquarters`, … |
| `isTenantOwned` | bool | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `departmentId` | uniqueidentifier | Sí | `departments` (T04) | destino → `departments` |

**`postalCodes`** — Códigos postales (COL-CFG-11; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `cpa` | string | No | — | 8 alfanum., opcional |
| `localityCodes` | array de string | No | — | Según la definición en texto del §7 |
| `provinceCode` | string | No | — | Según la definición en texto del §7 |
| `source` | string | No | — | Según la definición en texto del §7 |
| `localityId` | uniqueidentifier | Sí | `localities` (T04) | destino → `localities` |

**`streets`** — Calles con tramos (COL-CFG-12; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `localityCode` | string | No | — | Según la definición en texto del §7 |
| `normalizedName` | string | No | — | Según la definición en texto del §7 |
| `departmentCode` | string | No | — | Según la definición en texto del §7 |
| `provinceCode` | string | No | — | Según la definición en texto del §7 |
| `sourceId` | uniqueidentifier | No | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | calle, avenida, pasaje, ruta, camino |
| `heights` | array | No | — | `{ startLeft, endLeft, startRight, endRight }` |
| `source` | enum | No | — | `georef`, `tenant`, `migration` |
| `sourceUpdatedAt` | Date | No | — | Según la definición en texto del §7 |
| `isTenantOwned` | bool | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `active`, `pendingValidation`, `merged`, `inactive` |
| `mergedInto` | string | No | — | Según la definición en texto del §7 |
| `geometryRef` | string | No | — | Según la definición en texto del §7 |
| `localityId` | uniqueidentifier | Sí | `localities` (T04) | destino → `localities` |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`streetAliases`** — Alias de calles (COL-CFG-13; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `normalizedAlias` | array | No | — | Según la definición en texto del §7 |
| `streetId` | uniqueidentifier | Sí | `streets` (T04) | destino → `streets` |
| `alias` | array | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | histórico, popular, legacy |

**`streetProposals`** — Propuestas de calles nuevas (COL-CFG-14; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `streetId` | uniqueidentifier | No | `streets` (T04) | local; destino → `streets` |
| `proposedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `evidence` | string | No | — | adjuntos T11 |
| `decisionBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `decisionAt` | Date | No | — | Según la definición en texto del §7 |
| `platformStreetId` | uniqueidentifier | No | `streets` (T04) | destino → `streets` |
| `localityId` | uniqueidentifier | Sí | `localities` (T04) | destino → `localities` |

**`neighborhoods`** — Barrios (COL-CFG-15; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `localityCode` | string | No | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `polygon` | string | No | — | GeoJSON, opcional |
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `localityId` | uniqueidentifier | Sí | `localities` (T04) | destino → `localities` |

**`zones`** — Zonas operativas y geográficas (COL-CFG-16; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | lectura, operación, cobranza, comercial |
| `localityCodes` | array de string | No | — | Según la definición en texto del §7 |
| `polygon` | string | No | — | Según la definición en texto del §7 |
| `branchId` | uniqueidentifier | No | `branches` (T04) | destino → `branches` |
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `geometry` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`cadastralDistricts`** — Distritos y secciones catastrales (absorbe districtSections de M01) (COL-CFG-17; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `district` | string | No | — | Según la definición en texto del §7 |
| `section` | string | No | — | Según la definición en texto del §7 |
| `localityCode` | string | No | — | Según la definición en texto del §7 |
| `description` | string | No | — | Según la definición en texto del §7 |
| `externalCodes` | array | No | — | Según la definición en texto del §7 |
| `localityId` | uniqueidentifier | Sí | `localities` (T04) | destino → `localities` |
| `code` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`geocodeRequests`** — Pedidos de geocodificación; TTL (COL-CFG-18; definición en texto en §7.6)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `nextAttemptAt` | Date | No | — | Según la definición en texto del §7 |
| `subjectType` | string | No | — | Según la definición en texto del §7 |
| `subjectId` | uniqueidentifier | No | — | Según la definición en texto del §7 |
| `inputText` | string | No | — | Según la definición en texto del §7 |
| `provider` | enum | Sí | — | `georef`, `google` |
| `candidates.Object` | string | No | — | Según la definición en texto del §7 |
| `attempts` | int | No | — | Según la definición en texto del §7 |
| `lastError` | string | No | — | Según la definición en texto del §7 |
| `quotaPeriod` | string | No | — | Según la definición en texto del §7 |
| `expiresAt` | Date | No | — | TTL según PA-CFG-03 |
| `queryHash` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`calendars`** — Calendarios de días hábiles (canónico para businessCalendars) (COL-CFG-19; definición en texto en §7.7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | `national`, `provincial`, `municipal`, `tenant`, `service` |
| `provinceCode` | string | No | — | Según la definición en texto del §7 |
| `localityCode` | string | No | — | Según la definición en texto del §7 |
| `parentCalendarCodes` | array de string | No | — | Según la definición en texto del §7 |
| `weekendDays.0.6` | string | No | — | Según la definición en texto del §7 |
| `timezone` | string | No | — | Según la definición en texto del §7 |

**`holidays`** — Feriados nacionales, provinciales y propios (absorbe holidays de M16 §7.45) (COL-CFG-20; definición en texto en §7.7)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `calendarCode` | string | No | — | Según la definición en texto del §7 |
| `date` | Date | Sí | — | Según la definición en texto del §7 |
| `recurring` | string | No | — | `{ day, month }` si sin año |
| `year` | string | No | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | `fixed`, `movable`, `bridge`, `nonWorking`, `local`, `leave` |
| `name.labelKey` | string | No | — | Según la definición en texto del §7 |
| `sourceRef` | string | No | — | norma |
| `status` | enum | Sí | — | Según la definición en texto del §7 |
| `recordedAt` | Date | No | — | Según la definición en texto del §7 |
| `calendarId` | uniqueidentifier | Sí | `calendars` (T04) | destino → `calendars` |

**`economicIndexSeries`** — Series de índices (IPC, CER, UVA, tasas BCRA, inflación contable) (COL-CFG-21; definición en texto en §7.8)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `name.labelKey` | string | No | — | Según la definición en texto del §7 |
| `kind` | enum | No | — | `inflation`, `exchangeRate`, `interestRate`, `lateFeeIndex`, `other` |
| `frequency` | enum | No | — | `daily`, `monthly`, `intraday` |
| `unit` | enum | No | — | `index`, `percentMonthly`, `percentAnnual`, `percentDaily`, `ARSperUnit` |
| `currencyCode` | string | No | — | Según la definición en texto del §7 |
| `rateSide` | enum | No | — | `buy`, `sell`, `mid` |
| `source` | string | No | — | `{ name, url, integrationId }` |
| `adoptable` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | Según la definición en texto del §7 |

**`economicIndexValues`** — Valores por fecha o período (COL-CFG-22; definición en texto en §7.8)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `seriesId` | uniqueidentifier | Sí | `economicIndexSeries` (T04) | destino → `economicIndexSeries` |
| `date` | Date | Sí | — | Según la definición en texto del §7 |
| `recordedAt` | Date | No | — | Según la definición en texto del §7 |
| `date.o.period` | string | No | — | Según la definición en texto del §7 |
| `time` | string | No | — | intradía |
| `value` | string | No | — | DECIMAL(18,4) |
| `status` | enum | Sí | — | `provisional`, `definitive` |
| `publishedAt` | Date | No | — | Según la definición en texto del §7 |
| `supersededAt` | Date | No | — | Según la definición en texto del §7 |
| `revisionOf` | string | No | — | Según la definición en texto del §7 |
| `source` | string | No | — | Según la definición en texto del §7 |

**`currencies`** — Monedas ISO (COL-CFG-23; definición en texto en §7.8)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `isoCode` | string | Sí | — | Según la definición en texto del §7 |
| `arcaCode` | string | No | — | Según la definición en texto del §7 |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `symbol` | string | No | — | Según la definición en texto del §7 |
| `decimals.atributos.de.tenant.divisible` | string | No | — | Según la definición en texto del §7 |
| `rounding` | string | No | — | Según la definición en texto del §7 |
| `perceptionPercent` | string | No | — | Según la definición en texto del §7 |
| `allowChange` | string | No | — | Según la definición en texto del §7 |
| `allowedForCollection` | string | No | — | Según la definición en texto del §7 |
| `isSystem` | bool | No | — | Según la definición en texto del §7 |

**`identityDocumentTypes`** — Tipos de documento de identidad (canónica para la clave documentTypes de M01) (COL-CFG-28; definición en texto en §7.9)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `labelKey` | string | No | — | Según la definición en texto del §7 |
| `arcaCode` | string | No | — | Según la definición en texto del §7 |
| `inaesCode` | string | No | — | Según la definición en texto del §7 |
| `enargasCode` | string | No | — | Según la definición en texto del §7 |
| `senCode` | string | No | — | Según la definición en texto del §7 |
| `validation` | string | No | — | regex, dígito verificador |
| `appliesTo` | enum | No | — | `person`, `company` |

**`platformTableReleases`** — Versiones publicadas de tablas de plataforma no fiscales (COL-CFG-31; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tableCode` | string | Sí | — | Según la definición en texto del §7 |
| `seriesId` | uniqueidentifier | No | `economicIndexSeries` (T04) | antes `seriesCode`; destino → `economicIndexSeries` |
| `releaseNumber` | int | No | — | Según la definición en texto del §7 |
| `summary` | string | No | — | Según la definición en texto del §7 |
| `items` | array | No | — | altas, cambios, bajas con antes/después |
| `sourceRef` | string | No | — | norma/URL/fecha |
| `effectiveAt` | Date | No | — | Según la definición en texto del §7 |
| `affectsCalculation` | bool | No | — | Boolean |
| `status` | enum | Sí | — | `draft`, `published`, `superseded` |
| `publishedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `publishedAt` | Date | No | — | Según la definición en texto del §7 |

**`platformTableAdoptions`** — Adopción por tenant (absorbe officialTableAdoptions de M16) (COL-CFG-32; definición en texto en §7.10)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `tableCode` | string | Sí | — | Según la definición en texto del §7 |
| `seriesId` | uniqueidentifier | No | `economicIndexSeries` (T04) | antes `seriesCode`; destino → `economicIndexSeries` |
| `mode` | enum | No | — | `follow`, `pinned`, `copy` |
| `pinnedReleaseNumber` | int | No | — | Según la definición en texto del §7 |
| `pendingReleases` | array | No | — | Según la definición en texto del §7 |
| `acknowledgedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `acknowledgedAt` | Date | No | — | Según la definición en texto del §7 |
| `purpose` | string | No | — | para series: `inflation`, `exchangeRateUSD`, `lateFee` |
| `releaseId` | uniqueidentifier | Sí | `platformTableReleases` (T04) | destino → `platformTableReleases` |
| `effectiveFrom` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`customFieldDefinitions`** — Campos extra por entidad (COL-CFG-33; definición en texto en §7.11)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `entity` | enum | Sí | — | enum de entidades habilitadas por los módulos: `person`, `account`, `serviceContract`, `property`, `category`, `workOrder`, `ticket`, `product`, `supplier`, `employee`, `fixedAsset` |
| `key` | string | Sí | — | camelCase, única por entidad |
| `labelKey` | string | No | — | Según la definición en texto del §7 |
| `type` | enum | No | — | §5.12 |
| `enumCode` | string | No | — | Según la definición en texto del §7 |
| `reference` | string | No | — | Según la definición en texto del §7 |
| `validation` | enum | No | — | `required`, `unique`, `min`, `max`, `decimals`, `maxLength`, `regex` |
| `defaultValue` | string | No | — | Según la definición en texto del §7 |
| `section` | string | No | — | Según la definición en texto del §7 |
| `order` | int | No | — | Según la definición en texto del §7 |
| `visibility` | string | No | — | Según la definición en texto del §7 |
| `editCapability` | string | No | — | Según la definición en texto del §7 |
| `searchable` | string | No | — | Según la definición en texto del §7 |
| `exportable` | string | No | — | Según la definición en texto del §7 |
| `historized` | string | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `draft`, `active`, `deprecated` |

**`formCustomizations`** — Personalización de formularios (COL-CFG-34; definición en texto en §7.11)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `formKey` | string | Sí | — | de un registro de formularios personalizables publicado por cada módulo |
| `fieldKey` | string | Sí | — | Según la definición en texto del §7 |
| `hidden` | string | No | — | Según la definición en texto del §7 |
| `required` | string | No | — | Según la definición en texto del §7 |
| `readOnly` | string | No | — | Según la definición en texto del §7 |
| `defaultValue` | string | No | — | Según la definición en texto del §7 |
| `labelKey` | string | No | — | Según la definición en texto del §7 |
| `helpKey` | string | No | — | Según la definición en texto del §7 |
| `order` | int | No | — | Según la definición en texto del §7 |
| `allowedEnumCodes` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `active`, `superseded`; §8.10; antes sin valores |
| `configVersionId` | uniqueidentifier | No | `configVersions` (T04) | destino → `configVersions` |
| `screenCode` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`masterImportJobs`** — Importaciones de maestros desde Excel (COL-CFG-36; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `targetTableCode` | string | No | — | Según la definición en texto del §7 |
| `fileRef` | string | No | — | almacenamiento privado |
| `format` | enum | No | — | `xlsx`, `csv`, `fixedWidth` |
| `layoutRef` | string | No | — | T06 si es ancho fijo |
| `mapping` | string | No | — | Según la definición en texto del §7 |
| `mode` | enum | No | — | `insertOnly`, `upsert`, `replaceValidity` |
| `status` | enum | Sí | — | §8.6 |
| `counters` | enum | No | — | `total`, `valid`, `errors`, `inserted`, `updated`, `closed` |
| `errorFileRef` | string | No | — | Según la definición en texto del §7 |
| `configVersionId` | uniqueidentifier | No | `configVersions` (T04) | destino → `configVersions` |
| `platformTableReleaseId` | uniqueidentifier | No | `platformTableReleases` (T04) | destino → `platformTableReleases` |
| `idempotencyKey` | string | No | — | Según la definición en texto del §7 |
| `storedFileId` | uniqueidentifier | Sí | `storedFiles` (T01) | destino → `storedFiles` |

**`seedPacks`** — Paquetes de precarga de demostración (COL-CFG-37; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | `demo-base-s39` |
| `description` | string | No | — | Según la definición en texto del §7 |
| `contents` | array | No | — | lista de bloques por colección/contributor |
| `demoOnly` | string | No | — | Según la definición en texto del §7 |

**`seedApplications`** — Paquetes aplicados por tenant (COL-CFG-38; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `seedPackCode` | string | No | — | Según la definición en texto del §7 |
| `appliedAt` | Date | No | — | Según la definición en texto del §7 |
| `appliedBy` | uniqueidentifier | No | `memberships` (T02) | destino → `memberships` |
| `configVersionId` | uniqueidentifier | No | `configVersions` (T04) | destino → `configVersions` |
| `createdRecordRefs` | array | No | — | para retiro |
| `status` | enum | Sí | — | `applied`, `removed` |
| `seedPackId` | uniqueidentifier | Sí | `seedPacks` (T04) | destino → `seedPacks` |

**`legacyParameterMappings`** — Mapa VARIABLE/V2 → PRM (COL-CFG-39; definición en texto en §7.12)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `legacyTable` | enum | No | — | `VARIABLE`, `VARIABLE_PMOVIL` |
| `modVar` | string | No | — | 1 CoopOnline, 2 PMovil/Captor, 3 PWeb |
| `codVar` | string | No | — | Según la definición en texto del §7 |
| `legacyName` | string | No | — | `NOM_VAR` |
| `legacyModule` | string | No | — | `COD_MOD` |
| `legacyType` | string | No | — | Según la definición en texto del §7 |
| `directUse` | bool | No | — | Boolean, de RN-09 |
| `destinationKind` | enum | No | — | `parameter`, `dictionary`, `tenantProfile`, `secret`, `env`, `discarded`, `replacedBy`, `toValidate` |
| `keys` | array | No | — | Según la definición en texto del §7 |
| `transform` | enum | No | — | `identity`, `invertBoolean`, `fkMap:<tabla>`, `enumMap`, `split`, `textDate→date` |
| `prmId` | string | No | — | Según la definición en texto del §7 |
| `parameterKey` | string | Sí | — | Campo citado por T05 (referencias o clave única) |
| `legacyKey` | string | Sí | — | Campo citado por T05 (referencias o clave única) |

**`workstations`** — Puestos físicos, definida en T04 §7.16: code, name, branchId, kind (counter, cashier, office, kiosk, field), localAgentId, devices[], status; las cajas de M07 y el turnero de M09 referencian workstationId. **Reemplaza** el Est. N (COL-CFG-43; definición en texto en §7.16)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `code` | string | Sí | — | único en el tenant |
| `name` | string | Sí | — | Según la definición en texto del §7 |
| `branchId` | uniqueidentifier | No | `branches` (T04) | → `branches` |
| `kind` | enum | No | — | `counter`, `cashier`, `office`, `kiosk`, `field` |
| `localAgentId` | uniqueidentifier | No | `localAgents` (T06) | agente local de M09, opcional; destino → `localAgents` |
| `devices` | array | No | — | Según la definición en texto del §7 |
| `status` | enum | Sí | — | `active`, `inactive` |

**`payrollOfficialCodes`** — Códigos oficiales de sueldos (actividad, condición, revista, siniestro, RNOS…) (COL-CFG-44; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `type` | enum | Sí | — | Según la definición en texto del §7 |
| `code` | string | Sí | — | Según la definición en texto del §7 |
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`contributionRates`** — Alícuotas de aportes y contribuciones (COL-CFG-45; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `subsystem` | string | Sí | — | Según la definición en texto del §7 |
| `regime` | string | Sí | — | Según la definición en texto del §7 |
| `employerType` | string | Sí | — | Según la definición en texto del §7 |
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`contributionBaseLimits`** — Bases imponibles mínima y máxima (COL-CFG-46; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `period` | string | Sí | — | Según la definición en texto del §7 |

**`minimumWages`** — Salario mínimo vital y móvil (COL-CFG-47; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`incomeTaxDeductionTables`** — Deducciones de Ganancias (COL-CFG-48; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `type` | enum | Sí | — | Según la definición en texto del §7 |
| `year` | string | Sí | — | Según la definición en texto del §7 |
| `month` | string | Sí | — | Según la definición en texto del §7 |

**`incomeTaxScales`** — Escalas de Ganancias (COL-CFG-49; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `type` | enum | Sí | — | Según la definición en texto del §7 |
| `year` | string | Sí | — | Según la definición en texto del §7 |
| `month` | string | Sí | — | Según la definición en texto del §7 |
| `from` | string | Sí | — | Según la definición en texto del §7 |

**`incomeTaxRules`** — Reglas generales de Ganancias (COL-CFG-50; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`cedularTaxScales`** — Escala de impuesto cedular (COL-CFG-51; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`garnishmentScales`** — Escala de embargabilidad (COL-CFG-52; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |

**`laborLawParameters`** — Parámetros de la ley de contrato de trabajo (COL-CFG-53; definición en texto en §7.17)

| Campo | Tipo | Obligatorio | Referencia | Descripción |
|---|---|---|---|---|
| `validFrom` | Date | Sí | — | Según la definición en texto del §7 |


## 8. Estados y transiciones

### 8.1 `configVersions`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Configurador, M02 (copia), importación, semilla, migración, plataforma | Capability de crear | Se calcula diff contra vigente | Cancelar |
| `draft` | `validating` | Autor / sistema | Al menos un ítem | Corre validación y dependencias | Vuelve a `draft` con reporte |
| `validating` | `draft` | Sistema | Errores | Reporte con errores por ítem | — |
| `validating` | `validated` | Sistema | Sin errores bloqueantes | Si hay clases `commercial`/`fiscal`, corre simulación | — |
| `validated` | `inReview` | Autor | Política exige revisión | Instancia de workflow (T11); evento `cfg.configVersion.submitted` | Retirar → `draft` |
| `validated` | `approved` | Sistema | Política no exige revisión | — | — |
| `inReview` | `approved` | Revisor ≠ autor | Capabilities del módulo; simulación vigente | Registro de aprobación | — |
| `inReview` | `rejected` | Revisor | Motivo obligatorio | Evento `cfg.configVersion.rejected` | Autor clona a nuevo borrador |
| `approved` | `scheduled` | Autor/revisor | `effectiveAt` futura | Job `cfg:publicar-version-programada` | Cancelar → `cancelled` |
| `approved`/`scheduled` | `published` | Revisor/sistema | Rebase sin conflicto; revalidación OK al momento de publicar | Transacción atómica: valores a `parameterValues`, ítems aplicados por contributors, outbox `cfg.configVersion.published` + `cfg.parameter.changed` por clave | Reversión por nueva versión `rollback` |
| `scheduled` | `failed` | Sistema | Revalidación falla al publicar | Alerta; nada se aplica | Corregir en nueva versión |
| `draft`/`validated`/`approved`/`scheduled` | `cancelled` | Autor/administrador | Motivo | — | — |
| `published` | `superseded` | Sistema | Otra versión reemplaza todos sus ítems | Solo informativo | — |
| `published` | `rolledBack` | Sistema | Versión de reversión publicada | Se referencia | — |

### 8.2 `parameterDefinitions`

`active` → `deprecated` (despliegue; aviso en pantallas, `replacedBy`) → `removed` (despliegue posterior, tras migrar valores). No hay reversión de `removed`; se crea una clave nueva.

### 8.3 Registros maestros y enumeraciones

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `active` | Operador / importación / plataforma | Validación del esquema | Disponible en selectores desde `validFrom` |
| `active` | `inactive` | Operador | Motivo; si referenciado, se informa conteo | Deja de ofrecerse en selectores; referencias existentes intactas |
| `inactive` | `active` | Operador | — | — |
| `active`/`inactive` | `merged` | Operador con `cfg.maestros.unificar` | Sobreviviente elegido | Job redirige referencias; `mergedInto` |
| `active` | `closed` (vigencia) | Versión/plataforma | `validTo` alcanzada | Consultable a fecha |

### 8.4 Calles locales y propuestas

`pendingValidation` (alta local) → `active` (validada por el tenant) → (opcional) propuesta `proposed` → `approved` (plataforma crea/vincula calle nacional; la local pasa a `merged` con alias) | `rejected` (queda local activa con motivo) | `merged` (ya existía).

### 8.5 `geoReference.status`

| Origen | Destino | Actor | Precondición |
|---|---|---|---|
| — | `pending` | Sistema | Dirección guardada sin geocodificar o proveedor caído |
| `pending` | `candidate` | Sistema | Proveedor devolvió candidatos |
| `pending` | `failed` | Sistema | Reintentos agotados |
| `candidate` | `confirmed` | Usuario con `cfg.geo.confirmarPunto` o socio en su solicitud (queda `inReview` si la política lo exige) | Selección de candidato con precisión ≥ calle |
| `candidate` | `approximate` | Sistema/usuario | Precisión solo localidad o calle sin altura |
| cualquiera | `manualPoint` → `inReview` | Usuario | Punto marcado sin coincidencia; motivo |
| `inReview` | `confirmed` / `approximate` | Revisor | Revisión |
| `confirmed` | `confirmed` (corrección) | Usuario autorizado | Motivo; se agrega a `history` |
| `failed` | `pending` | Usuario/sistema | Reintento manual |

### 8.6 `masterImportJobs`

`uploaded` → `validating` → `previewReady` (con errores por fila) → `confirmed` → `processing` → `completed` | `completedWithErrors` | `failed`; desde `previewReady` o `processing`: `cancelled` (en `processing` deshace por transacción por lote y deja estado previo).

### 8.7 `platformTableReleases` y adopciones

Release: `draft` → `published` → `superseded`. Adopción por tenant: release publicado → si `follow` y no afecta cálculo: aplicado; si afecta cálculo o `pinned`: `pendingAcknowledgement` → `acknowledged` (genera `configVersion` `origin = platform` en el tenant que pasa por su política) | `deferred`.

### 8.8 `customFieldDefinitions`, `seedApplications`

Campo extra: `draft` → `active` (por versión) → `deprecated` (deja de pedirse; valores conservados). Semilla: `applied` → `removed` (retiro en bloque de lo creado por la semilla).

### 8.9 `legalEntities`, `branches` y `workstations`

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `active` | Sistema (alta del tenant) o administrador (`cfg.entidadesJuridicas.editar`) | CUIT válido y no repetido en el tenant | EVT-CFG-19 `cfg.legalEntity.created` | Inactivar |
| `active` | `inactive` | Administrador | No es la entidad por defecto (RN-CFG-051); sin sucursales activas ni documentos abiertos que la requieran | EVT-CFG-19 `cfg.legalEntity.deactivated`; no se asigna a documentos nuevos | Reactivar |
| `inactive` | `active` | Administrador | — | EVT-CFG-19 `cfg.legalEntity.updated` | — |
| Sucursal `active` | `inactive` | Administrador (`cfg.sucursales.editar`) | Sin cajas abiertas (M07) ni depósitos con stock (M13) | EVT-CFG-20 `cfg.branch.deactivated` | Reactivar |

Los puestos (`workstations`) siguen el mismo par `active`/`inactive` sin evento propio (EVT-CFG-08 `cfg.masterRecord.changed`).

### 8.10 `parameterValues`, `formCustomizations` y `economicIndexValues`

Corrección del 05-11-2026: §7 declaraba estos estados sin transiciones (y `formCustomizations.status` sin valores). Estado inicial: el de la fila "—".

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `parameterValues` | — | `published` | Publicación de la `configVersion` que lo contiene (§8.1) | Revalidación OK al publicar | EVT-CFG-05 `cfg.configVersion.published` y `cfg.parameter.changed` |
| `parameterValues` | `published` | `superseded` | Corrección del mismo ámbito y vigencia por una versión posterior (se completa `supersededAt`) | — | `cfg.parameter.changed` |
| `parameterValues` | `published` | `closed` | Otra versión fija `validTo` (nuevo valor desde una fecha) | — | `cfg.parameter.changed` |
| `formCustomizations` | — | `active` | Publicación de la `configVersion` que la contiene | El `fieldKey` existe en el registro de formularios del módulo | EVT-CFG-05 |
| `formCustomizations` | `active` | `superseded` | Otra versión publicada cambia o quita la personalización del campo | — | EVT-CFG-05 |
| `economicIndexValues` | — | `provisional` | Ingesta o carga de un valor marcado provisorio por la fuente | — | EVT-CFG-12 `cfg.economicIndex.valuePublished` |
| `economicIndexValues` | — | `definitive` | Ingesta o carga de un valor definitivo | — | EVT-CFG-12 `cfg.economicIndex.valuePublished` |
| `economicIndexValues` | `provisional` | `definitive` | La fuente publica el valor definitivo: se crea un registro nuevo con `revisionOf` y el anterior recibe `supersededAt` | — | EVT-CFG-12 `cfg.economicIndex.valueRevised` |

Referencias: `parameterValues.configVersionId` y `formCustomizations.configVersionId` → `configVersions` (T04); `economicIndexValues.seriesId` → `economicIndexSeries` (T04; el mismo campo usan `platformTableReleases` y `platformTableAdoptions` para las series; nombre de T05 COL-CFG-22, que prevalece; antes `seriesCode` → `economicIndexSeries.code` como clave natural); `economicIndexValues.revisionOf` → `economicIndexValues` (T04).

### 8.11 Estados iniciales de las máquinas de §8.2, §8.4, §8.6, §8.7 y §8.8

Corrección del cierre de residuales (05-11-2026; PA-CFG-15): explicita el estado de alta de las máquinas descritas en texto. Las transiciones siguen en cada subsección.

| Colección | Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|---|
| `parameterDefinitions` | — | `active` | Despliegue del manifiesto del módulo que declara la clave | — | — |
| `streets` | — | `pendingValidation` | Alta local de la calle por el tenant | — | — |
| `streets` | — | `active` | Carga desde Georef o migración validada | — | — |
| `masterImportJobs` | — | `uploaded` | Carga del archivo de importación | Formato admitido | — |
| `platformTableReleases` | — | `draft` | Plataforma prepara un release de tabla oficial | — | — |
| `customFieldDefinitions` | — | `draft` | Alta del campo extra en una `configVersion` | — | — |
| `seedApplications` | — | `applied` | Aplicación de la semilla al tenant | — | — |

## 9. Procesos y flujos

### 9.1 Sincronización del registro de parámetros (JOB-CFG-01 `cfg:sincronizar-registro`)

1. En el despliegue, el pipeline ejecuta el job con la lista de definiciones de todos los paquetes de dominio.
2. Para cada definición: si no existe, alta; si existe, actualiza metadatos (etiquetas, validaciones, dependencias, estado) **sin tocar `parameterValues`**.
3. Si una validación se endurece y un valor vigente de algún tenant queda inválido, el job no lo modifica: lo marca en un reporte y genera alerta a plataforma y aviso al tenant (borrador sugerido de corrección).
4. Definiciones ausentes en código pasan a `deprecated` (nunca se borran en el mismo despliegue).
5. Idempotente; registra resumen (altas, cambios, deprecaciones) en auditoría de plataforma.

### 9.2 Lectura de configuración

1. El módulo llama `config.get(key, ctx)`.
2. Verifica declaración (error si no existe) y licencia del módulo (T01).
3. Determina `at` (fecha efectiva) y `knownAt` (fecha de registro), y la entidad jurídica del contexto: la indicada en `ctx.legalEntityId` o, si falta, `legalEntities.resolve({ branchId, serviceId, at })` (RF-CFG-020; DEC-096).
4. Recorre la precedencia `user → category → service → branch → legalEntity → tenant → platform` (DEC-096; antes sin `legalEntity`) filtrando por `allowedScopes` y por vigencia a `at` y `recordedAt ≤ knownAt < supersededAt`; descarta el valor `branch` si la sucursal no pertenece a la entidad del contexto a la fecha `at`.
5. Si no hay valor, usa el default de la definición.
6. Devuelve valor y huella (`valueId`, `configVersionId`, `scopeResolved`).
7. La caché se invalida por `cfg.configVersion.published` y por expiración de vigencia programada.

### 9.3 Publicación de una versión (CU-CFG-01)

1. El configurador abre un borrador (o lo recibe de copia/importación/semilla/migración/plataforma).
2. Edita ítems: parámetros por ámbito, registros maestros, enumeraciones, campos extra, personalizaciones o configuración de módulo vía contributors.
3. Elige fecha efectiva (y por ítem si corresponde) y, si afecta contratos, la política (`newOnly`, `allFromEffectiveDate`, `requireAction`).
4. **Validar**: tipos, rangos, dependencias, referencias del tenant, secretos requeridos, validadores cruzados, completitud de perfiles de servicio (§9.12).
5. **Simular** (si hay clases `commercial`/`fiscal`): cada contributor ejecuta su simulador; el reporte queda en la versión.
6. **Revisar**: si la política lo exige, workflow T11 con revisor distinto del autor; el revisor ve diff, reportes y simulación.
7. **Programar o publicar**: si `effectiveAt` es futura, queda `scheduled`; al momento JOB-CFG-02 revalida y publica.
8. Publicación en una transacción: escribe valores, aplica ítems de contributors, cierra vigencias anteriores (`validTo`), registra outbox.
9. Eventos: `cfg.configVersion.published`, `cfg.parameter.changed` por clave, `cfg.masterRecord.changed` por tabla; los módulos reaccionan (ej. M05 recalcula proyecciones no emitidas).
10. Fallo en cualquier paso de 8: rollback completo, versión `failed`, alerta.

### 9.4 Cambio retroactivo (AGR-010)

1. El borrador tiene `effectiveAt` anterior a hoy.
2. Validación verifica PRM-CFG-005 (permitido) y PRM-CFG-006 (máximo de días).
3. Se exige revisión aunque la clase no lo pida.
4. Al publicar: `validFrom` pasado, `recordedAt` = ahora. No se reescribe ningún documento.
5. Se emite `cfg.parameter.changed` con `retroactive: true` y rango afectado; el módulo dueño decide ajustes (ej.: M05 genera ND/NC por diferencia, con su propio circuito de aprobación).
6. Las consultas `config.get` con `knownAt` anterior siguen devolviendo el valor viejo (explicabilidad del documento emitido).

### 9.5 Copia de configuración desde otro tenant (consumido por M02, BASE §81)

1. M02 ejecuta la copia autorizada y llama `POST /api/admin/cfg/versions` con `origin = copy` en el **tenant destino**.
2. CFG crea el borrador con los ítems recibidos, sin secretos, comunidad ni datos operativos.
3. La validación marca dependencias pendientes (área, centro de costo, cuentas, depósito, tributos, calendario) como errores bloqueantes hasta que el destino los mapee.
4. El resto sigue §9.3; la marca y el diccionario del destino se conservan.
5. La copia es idempotente por `copyRunId`.

### 9.6 Edición de tabla maestra e importación (CU-CFG-03, CU-CFG-04)

1. El operador abre la tabla en PAN-CFG-08; busca, filtra, edita en modal.
2. Si la tabla es `versioned`, los cambios se agregan a un borrador; si no, se publican con auditoría inmediata.
3. Importación: PAN-CFG-09 → sube archivo → mapea columnas (o usa plantilla exportada) → JOB-CFG-03 valida y produce vista previa con errores por fila → confirma → JOB-CFG-03 procesa por lotes con transacción por lote → resultado con archivo de errores.
4. Reintento idempotente por `idempotencyKey`; cancelación devuelve el estado previo.

### 9.7 Unificación de duplicados (CU-CFG-05)

1. El operador selecciona dos o más registros y el sobreviviente.
2. El sistema muestra "en uso por" de cada uno.
3. Confirma; JOB-CFG-04 `cfg:unificar-maestro` redirige referencias por colección (usando `referencedBy` de la definición de tabla) en lotes reanudables.
4. Marca los duplicados `merged` con `mergedInto`; agrega alias si es calle.
5. Auditoría con conteo por colección. Reversión: no automática; se crea registro nuevo si fue error (documentado en el motivo).

### 9.8 Actualización y adopción de tablas de plataforma (CU-CFG-06)

1. El curador prepara un `platformTableRelease` (manual o por ingesta JOB-CFG-05..08) con fuente y vigencia.
2. Segundo curador publica (cuatro ojos en plataforma).
3. Por cada tenant con adopción: si `follow` y `affectsCalculation = false`, se aplica (lectura por unión); si afecta cálculo o `pinned`, se genera aviso y borrador `origin = platform` en el tenant.
4. El tenant revisa y publica por su política, o difiere (queda `pendingAcknowledgement` con alerta).
5. Evento `cfg.platformTable.updated`.

### 9.9 Geocodificación de una dirección (CU-GEO-01)

1. El usuario selecciona provincia → departamento/municipio → localidad (selectores con catálogo de plataforma).
2. Busca la calle por nombre en la localidad; elige entre homónimos por contexto; si no aparece, elige "calle no encontrada" y la carga como local (`pendingValidation`) o deja texto y referencias.
3. Completa altura, piso, unidad, entrecalles, barrio, referencias de acceso o datos rurales; puede marcar "sin numeración".
4. El servicio normaliza (Georef) y geocodifica (Google, si hay cuota) → `candidate` con precisión.
5. El mapa muestra el punto candidato; el usuario autorizado confirma o arrastra el marcador (motivo) → `confirmed`; sin coincidencia → `manualPoint`/`inReview`.
6. Si el proveedor falla o no hay cuota: se guarda `pending`; JOB-CFG-09 reintenta con backoff; tras N intentos `failed` y aparece en la cola de revisión (PAN-CFG-15).
7. M01 guarda la dirección con `geoReference`; el contrato y la visita la usan; el domicilio fiscal permanece separado.

### 9.10 Ingesta de calendarios, índices y padrones

| Job | Frecuencia | Pasos | Reintento / recuperación |
|---|---|---|---|
| JOB-CFG-05 `cfg:ingesta-georef` | Mensual (configurable) + manual | Descarga por provincia de unidades territoriales y calles; diff contra vigente; release en borrador para curador | Reanudable por provincia; no publica si la variación supera umbral sin revisión |
| JOB-CFG-06 `cfg:ingesta-feriados` | Anual (noviembre/diciembre) + manual ante decreto | Carga calendario nacional del año siguiente desde fuente oficial o carga asistida; release | Manual si la fuente no es legible por máquina |
| JOB-CFG-07 `cfg:ingesta-indices` | Diaria 18:00 (cotizaciones/tasas); mensual (IPC) | Consulta integración (T06), inserta valores `provisional`/`definitive`; detecta revisiones | Reintento cada hora hasta 23:00; alerta si falta |
| JOB-CFG-08 `cfg:ingesta-padron:<registro>` | Según fuente (mensual/quincenal) | Descarga o recibe archivo; valida; carga por lotes con vigencia; cierra entradas anteriores | Reanudable por lote; idempotente por (registro, período) |

### 9.11 Migración del catálogo `VARIABLE` (JOB-CFG-10 `cfg:migrar-variables`)

1. T07 entrega el volcado de `VARIABLE` y `VARIABLE_PMOVIL` del tenant.
2. Para cada fila: busca equivalencia (`legacyTable`, `modVar`, `codVar`).
3. Aplica transformación (`invertBoolean`, `fkMap`, `textDate→date`, `split`); valida contra la definición.
4. Destinos: `parameter` → ítem del borrador; `dictionary` → T03; `tenantProfile` → T01; `secret` → solicitud de carga en bóveda (no se migra el valor si estaba en claro: se pide recargar); `env`/`discarded` → reporte.
5. Filas sin equivalencia o `toValidate` → reporte para PA-CFG-07.
6. Resultado: `configVersion` `origin = migration` en borrador + reporte de conciliación (conteos por destino que suman el total de filas).

### 9.12 Completitud del perfil de servicio (BASE §84, §93)

1. Cada módulo declara, por servicio/dominio, qué claves e ítems completan cada una de las 15 dimensiones de §84 y cuáles son obligatorias para publicar la oferta.
2. CFG calcula el estado por dimensión: completo, incompleto, **No aplica** (con motivo) — nunca se fuerza un cargo ficticio.
3. La validación de una versión que habilita/publica un servicio falla si alguna dimensión obligatoria está incompleta.
4. PAN-CFG-29 muestra la ficha por servicio (Internet, Electricidad, Agua, Gas, Cementerio parque, Banco de sangre y los que se agreguen).

### 9.13 Aplicación de semilla demo (JOB-CFG-11 `cfg:aplicar-semilla`)

1. Plataforma marca el tenant como demo/sandbox.
2. Elige paquete y versión; el job crea registros marcados `demoData` y un borrador de `configVersion` para la configuración sensible (tarifas, recargos).
3. Publica lo no sensible; lo sensible queda para aprobación (BASE §39.1).
4. Registro en `seedApplications` para retiro en bloque.

### 9.14 Invalidación de caché y vigencias programadas (JOB-CFG-12 `cfg:activar-vigencias`)

Cada minuto: detecta valores cuyo `validFrom`/`validTo` cruza el instante actual en algún tenant y emite invalidación de caché y `cfg.parameter.changed` (efectivo) para que los consumidores reaccionen.

### 9.15 Control nocturno de integridad (JOB-CFG-13 `cfg:verificar-integridad`)

Diario: verifica que los valores vigentes cumplan validaciones actuales, que las referencias existan y estén activas, que los `secretRef` requeridos existan y no venzan en 30 días; produce reporte por tenant y alertas.

### 9.16 Alta de la entidad jurídica por defecto (consumo de `pla.tenant.created`)

1. CFG recibe `pla.tenant.created` (EVT-PLA-01) y lee el tenant con sus datos fiscales (`legalName`, `cuit`, `legalForm`, `inaesRegistration`, `fiscalAddress`).
2. En una transacción idempotente por `tenantId` crea la entidad `isDefault = true`, `status = active`, `validFrom` = fecha de alta, y la sucursal `SUC-01` "Casa central" (`isHeadquarters = true`, usos `attention` y `cashier`).
3. Publica EVT-CFG-19 y EVT-CFG-20 por outbox. Si el tenant es `platform`, no crea entidad. Si falta el CUIT (tenant `demo`), usa los datos ficticios de la semilla (§18.7).
4. Reprocesar el evento no duplica: la clave natural es `{ tenantId, isDefault: true }`.

### 9.17 Resolución de la entidad jurídica de un documento (RF-CFG-137)

El módulo que crea un documento económico llama a `legalEntities.resolve({ branchId, serviceId, at })`; el resultado se guarda en `legalEntityId` y en la copia de datos del emisor del documento. El validador del esquema base (RF-CFG-136) rechaza el documento si la entidad falta, es de otro tenant o está inactiva a la fecha `at`.

## 10. Pantallas

Patrón común (Guía §8, CNX §4.2): `AdminShell`, `AdminStickyHeader` con título/subtítulo/acciones, `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` con vistas guardadas y exportación, altas/ediciones en modal (`sm/md/lg/xl`), `ConfirmDialog` y toasts, etiquetas por `dict:`. Cluster del mapa del sitio: **Configuración** (tenant) y **Plataforma → Datos de referencia** (plataforma, `meta.platformOnly`). Estados vacíos honestos ("Todavía no hay versiones publicadas", "No hay feriados cargados para 2027").

| PAN-ID | App / ruta | Capability | Propósito | Layout, filtros y columnas | Acciones y modales | Reemplaza (INV) |
|---|---|---|---|---|---|---|
| PAN-CFG-01 | admin `/admin/cfg` | `cfg.parametros.ver` | Centro de configuración: estado general del tenant. | Tarjetas: versiones en borrador/en revisión/programadas, alertas de integridad (JOB-CFG-13), adopciones pendientes de plataforma, secretos faltantes, perfiles de servicio incompletos; accesos a cada módulo. | Nueva versión; ir a pendientes. Vacío: "Sin pendientes de configuración". | `frmOpcionesEspeciales` (parte funcional), menú `Tab_<n>` |
| PAN-CFG-02 | admin `/admin/cfg/parametros` | `cfg.parametros.ver` | Explorador de parámetros por módulo y grupo con búsqueda por clave, etiqueta, `PRM-ID` o número V2 legacy. | Árbol módulo → grupo a la izquierda; grilla: etiqueta, clave, tipo, valor efectivo (tenant), ámbitos con valor, clase, última modificación, estado. Filtros: módulo, clase, "con valor propio", "deprecados", "sensibles", "V2 #". Selector de contexto (sucursal/servicio/categoría) para ver valor efectivo. | Editar (agrega al borrador abierto o crea uno), ver ficha, exportar. | `frmVariables` (`AgregarClave`, `ConfigurarCombo`, `txtBuscar_ButtonClick`), `frmVariables_PMovil`, `txtModulos`, `GenericGridCollectionEditor`, `FrmGridCollectionEditor`, `CollectionEditorTitleContext` |
| PAN-CFG-03 | admin `/admin/cfg/parametros/:key` | `cfg.parametros.ver` (+ editar con capability del módulo) | Ficha de parámetro. | Pestañas: Definición (tipo, validación, default, dependencias, clase, vigencia, canales, equivalencia V2), Valores por ámbito (con vigencias), Cadena de resolución para un contexto, Historia (bitemporal), Usado por (claves dependientes). Editor según tipo (booleano, numérico con unidad, enumeración, referencia con selector, cuenta contable con `SelectorCuenta` de M15, plantilla, lista editable, `secretRef` con estado sin valor). | Agregar valor por ámbito al borrador, cerrar vigencia, ver en versión. Modal `md` de edición. | `frmVariables__ModificoRegistro_CargarControles`, `EditarVariable`, `frmVisorPropiedades` |
| PAN-CFG-04 | admin `/admin/cfg/versiones` | `cfg.versiones.ver` | Listado de versiones. | Columnas: número, título, origen, clases, estado, fecha efectiva, programada, autor, revisor, publicada. Filtros: estado, origen, módulo, rango de fechas. | Nueva, clonar, cancelar, revertir (publicadas). | — (no existe en ProCoop) |
| PAN-CFG-05 | admin `/admin/cfg/versiones/:id` | `cfg.versiones.ver` / `cfg.versiones.crear` / `cfg.versiones.aprobar` / `cfg.versiones.publicar` | Detalle de versión: diff, validación, simulación, revisión y programación. | Cabecera con estado y línea de tiempo; pestañas: Cambios (diff antes/después por ítem, agrupado por módulo y clase), Dependencias, Validación (errores/avisos por ítem con enlace), Simulación (reportes por contributor), Contratos afectados y política, Revisión (comentarios, aprobaciones), Auditoría. | Validar, simular, enviar a revisión, aprobar/rechazar (motivo), programar (fecha/hora en zona del tenant), publicar, cancelar, rebase. `ConfirmDialog` con resumen de efectos al publicar. | `frmComparadorCambios`, `frmActualizar` |
| PAN-CFG-06 | admin `/admin/cfg/historia` | `cfg.historia.ver` | Consulta "como era": valor de claves y registros a una fecha efectiva y a una fecha de registro. | Selectores `at` y `knownAt` (visibles en la cabecera y en la exportación); grilla de claves con valor, ámbito, versión. | Exportar con fechas declaradas; comparar dos fechas. | `frm_Consulta_Referencias` (parcial), auditoría genérica |
| PAN-CFG-07 | admin `/admin/cfg/tablas` | `cfg.maestros.ver` | Catálogo de tablas maestras por módulo/dominio (Generales, Titulares, Cobranzas, Técnica, Facturación, Gestión de mora, Telefonía, Viviendas, Sueldos, Tesorería, Contabilidad, Compras, SMS, Actividades, Herramientas — agrupación de REL §5). | Tarjetas o grilla: tabla, módulo, ámbito (plataforma/tenant/adoptable), registros, última actualización, fuente. | Abrir editor. | Menú "Tablas del sistema" por dominio, `Tab_<n>`, `abm_Base_Simple` |
| PAN-CFG-08 | admin `/admin/cfg/tablas/:code` | `cfg.maestros.ver` / `cfg.maestros.crear` / `cfg.maestros.editar` / `cfg.maestros.anular` / `cfg.maestros.unificar` / `cfg.maestros.importar` / `cfg.maestros.exportar` | Editor uniforme de tabla maestra. | `DataTable` con columnas del esquema, búsqueda, filtros por campos y "vigente a fecha", indicador plataforma/propio, contador "en uso por". | Nuevo/editar (modal), inactivar, cerrar vigencia, unificar (modal `lg` con sobreviviente y conteos), importar (PAN-CFG-09), exportar, historial del registro. | `abm_Base`, `abm_Base_SoloDetalle`, `Botones_Abm`, `Ok_Cancel`, `frmSeleccionElementos`, `frm_Consulta_Referencias`, `abm_Provinc`, `abm_deptos`, `abm_localidad`, `abm_barrios`, `abm_Calle` |
| PAN-CFG-09 | admin `/admin/cfg/importaciones` | `cfg.maestros.importar` | Asistente e historial de importaciones de maestros y padrones. | Pasos `ExcelImportWizard`: tabla destino y modo → archivo → mapeo (guardable como perfil) → vista previa con errores por fila → confirmar. Historial: archivo, tabla, modo, estado, contadores, usuario. | Descargar plantilla, descargar errores, cancelar job, reintentar. | `frmImportadorAbm`, `frmImportacionMasiva`, `frmImportacionArchivos` (importadores de maestros), `frmResultadoImportacion`, `frmResultadoExportacion` |
| PAN-CFG-10 | admin `/admin/cfg/padrones` | `cfg.fiscal.ver`, `cfg.padrones.importar` | Padrones fiscales disponibles y su estado; consulta por CUIT. | Grilla de registros (`taxRegistries`): jurisdicción, régimen, fuente, mantenido por (plataforma/tenant), último período, filas. Consulta: CUIT + fecha → entradas vigentes. | Importar período (si es del tenant), ver errores, exportar consulta. | `frmDefinirIngresoBruto`, importadores `Importar_IngresosBrutos`, `Importar_AFIP` |
| PAN-CFG-11 | admin `/admin/cfg/geografia` | `cfg.geo.ver` | Unidades territoriales: país → provincia → departamento → localidad, con códigos externos y CP. | Árbol + grilla; mapa con centroide. Atributos propios del tenant editables (km a sede, códigos regulatorios propios). | Agregar localidad propia (overlay), editar atributos propios, ver fuente. | `abm_Provinc`, `abm_deptos`, `abm_localidad` |
| PAN-CFG-12 | admin `/admin/cfg/calles` | `cfg.geo.ver`, `cfg.calles.crear`, `cfg.geo.proponerCalle` | Calles: catálogo nacional + locales + alias. | Filtros: provincia, localidad, origen (nacional/local), estado. Columnas: nombre, tipo, localidad, alturas, origen, estado, en uso. | Crear calle local, alias, proponer a plataforma, unificar, ver en mapa. | `abm_Calle`, `txtCalles`, `RNQCALL` (sin rutas) |
| PAN-CFG-13 | admin `/admin/cfg/territorio` | `cfg.maestros.editar` | Barrios, zonas y distritos/secciones catastrales del tenant. | Pestañas por tabla; polígono opcional dibujable en mapa para barrios y zonas. | ABM, unificar barrios, importar polígonos (GeoJSON/KML vía T06). | `abm_barrios`, ABM de zonas y `DISTRITO_SECCION` (vía `abm_Base_Simple`) |
| PAN-CFG-14 | componente admin/pwa `GeoAddressPicker` + pantalla `/admin/cfg/mapa` | `cfg.geo.ver`; confirmar con `cfg.geo.confirmarPunto` | Selector de dirección y punto en Google Maps (usado por M01, M09, M10, M19) y visor de mapa. | Cascada provincia → departamento → localidad → calle (homónimos con contexto) → altura/piso/unidad/entrecalles/barrio/referencias/datos rurales; mapa con candidato, precisión y estado; "usar mi ubicación" con permiso. | Confirmar punto, arrastrar marcador (motivo), marcar sin numeración, calle no encontrada. Degradación sin mapa si no hay cuota. | `Domicilio`, `ctrlMapa`, `ctrlMapaBase`, `ctrlMapaBing`, `MapScripting`, `frmVisorMapa`, `ConsultaDomicilio` (parte geográfica) |
| PAN-CFG-15 | admin `/admin/cfg/georreferencias/revision` | `cfg.geo.confirmarPunto` | Cola de georreferencias `pending`, `failed`, `inReview`, `approximate`. | Columnas: entidad, dirección original, estado, precisión, intentos, zona, antigüedad. Filtros por zona/sucursal (alcance). | Reintentar, abrir mapa y confirmar, marcar aproximado con motivo. | — |
| PAN-CFG-16 | admin `/admin/cfg/calendarios` | `cfg.calendarios.ver` / `cfg.calendarios.editar` | Calendarios aplicables y feriados. | Vista anual tipo calendario + grilla: fecha, nombre, tipo, calendario, fuente. Asignación de calendarios a tenant/sucursal/servicio. Simulador de días hábiles ("vencimiento 10 días hábiles desde…"). | Agregar feriado propio/municipal, importar, ver feriados de plataforma (solo lectura). | `abm_Feriados` (`cbMes`, `chkAño`), `ctrlFechaDinamica`, `txtFecha_Popup` (fechas dinámicas) |
| PAN-CFG-17 | admin `/admin/cfg/indices` | `cfg.indices.ver` / `cfg.indices.editar`, `cfg.adopciones.configurar` | Series de índices y sus valores; adopción de series de plataforma por propósito. | Grilla de series (plataforma/propias), gráfico de valores, último valor y estado. Asignación por propósito (inflación, dólar, mora). | Cargar valor manual, importar, revisar valor (queda historia), adoptar/fijar. | ABM de `TABINFL`/`INFLACIO`, `TABMORA`/`INDICESMORA`, `COT_DOL` |
| PAN-CFG-18 | admin `/admin/cfg/monedas` | `cfg.maestros.editar` | Monedas y cotizaciones. | Grilla: moneda, ISO, código ARCA, símbolo, permitida para cobro, redondeo; cotizaciones por fecha/hora. | Editar atributos del tenant, cargar cotización. | `abm_Tip_Mon`, `abm_Tip_Mon_Cot` |
| PAN-CFG-19 | admin `/admin/cfg/fiscal` | `cfg.fiscal.ver` / `cfg.fiscal.configurar` | Tablas fiscales de referencia. | Pestañas: condiciones IVA, alícuotas IVA, condiciones IIBB, alícuotas IIBB por jurisdicción, tipos de documento, tablas de reguladores. Indicador plataforma/propio, vigencia, fuente. | Adoptar release, ver diferencias de release, agregar atributos del tenant (cuentas por alícuota enlaza a M15; porcentajes por condición enlaza a M06). | `abm_sit_iva`, `abm_ali_iva`, `abm_Sit_Ibr`, `abm_ali_Ibr`, `abm_ali_ibr_comp`, `AliIva_SitIva`, `AliIbr_SitIbr`, `ctrlEnargasTablas`, `frmEnargasTablas` |
| PAN-CFG-20 | admin `/admin/cfg/enumeraciones` | `cfg.enumeraciones.configurar` | Enumeraciones configurables. | Grilla de enumeraciones (tipo system/extensible/tenant/platform); detalle con valores: código, etiqueta, orden, color, activo, vigencia, códigos externos. | Agregar valor (si extensible/tenant), reordenar, inactivar, editar etiqueta (diccionario). | `TIP_CTRL = 2`, `ComboBoxEdit_DataSource`, `frmSelectCombo`, `SelectorSexo`, ABM de `EST_CIVIL`, `OCUPACIO`, `abm_Viaingte` |
| PAN-CFG-21 | admin `/admin/cfg/campos-extra` | `cfg.camposExtra.configurar` | Definición de campos extra por entidad. | Selector de entidad; grilla: clave, etiqueta, tipo, obligatorio, único, sección, visibilidad, estado. Vista previa del formulario (incluida vista "celular" para PWA). | Nuevo (modal `lg` con validaciones por tipo), activar por versión, deprecar, valores de lista. | `abm_DatosExtra`, `abm_propieItems`, `abm_propieitems_valores`, `PropiedadesPersonalizadas`, `SelectorPropiedadObjeto` |
| PAN-CFG-22 | admin `/admin/cfg/formularios` | `cfg.formularios.configurar` | Personalización de formularios del registro de formularios personalizables. | Lista de formularios por módulo; editor por campo: oculto, obligatorio, solo lectura, default, etiqueta, ayuda, orden, valores permitidos. Campos bloqueados marcados con candado y motivo. Vista previa. | Agregar a versión, restablecer. | `FormBase.ConfigurarControlesPersonalizados`, `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES` |
| PAN-CFG-23 | admin (panel en cada `DataTable`) + `/admin/cfg/vistas` | `cfg.vistas.crear` (privadas), `cfg.vistas.compartir` | Gestión de vistas guardadas. | Panel: columnas, filtros, orden, agrupación, totales, formato condicional, tamaño de página; administración central de vistas compartidas por pantalla/rol. | Guardar, guardar como, compartir con rol/tenant, marcar por defecto, eliminar. | `frmTransicion_Vistas`, `frmTransicion_Vistas_Detalle`, `FormBase.Save/Load/Reset_GridLayout`, `Columna_Grilla`, `FormatoCondicional_Columna`, `frmVistaResultados`, `ENTIDACOU` |
| PAN-CFG-24 | plataforma `/platform/cfg/semillas` y admin demo `/admin/cfg/semillas` | `pla.cfg.semillas.administrar`, `cfg.semillas.aplicar` (solo demo) | Paquetes semilla y su aplicación. | Paquetes, versión, contenido por bloque; aplicaciones por tenant con estado. | Aplicar, retirar en bloque. | Base `PR_LAG_DEMO`, `frmOpcionesEspeciales.ActualizaDemo` |
| PAN-CFG-25 | plataforma `/platform/cfg/registro` | `pla.cfg.registro.ver`, `pla.cfg.defaults.editar` | Registro de definiciones (solo lectura desde código) y defaults de plataforma. | Grilla de definiciones con PRM-ID, clave, módulo, estado, equivalencias V2; reporte del último `cfg:sincronizar-registro`. | Editar default de plataforma (por versión de plataforma), ver tenants con valor inválido. | `clsVariables` (declaración), `frmProcesos.ChequearEstructura` (parte parámetros) |
| PAN-CFG-26 | plataforma `/platform/cfg/tablas` | `pla.cfg.tablasPlataforma.editar` / `pla.cfg.tablasPlataforma.publicar` / `pla.cfg.tablasPlataforma.importar` | Tablas de plataforma y releases (geo, feriados nacionales/provinciales, índices oficiales, tablas fiscales, padrones públicos, reguladores). | Por tabla: releases, estado de ingestas, tenants con adopción pendiente. | Preparar release, publicar (segundo curador), lanzar ingesta, aprobar propuestas de calles. | — |
| PAN-CFG-27 | plataforma `/platform/cfg/equivalencias` | `pla.cfg.equivalencias.editar` | Equivalencias V2 → clave (T04b) para migración. | Grilla: tabla, `MOD_VAR`, `COD_VAR`, nombre legacy, uso directo, destino, claves, transformación, PRM-ID. | Editar, exportar, ver reporte de migración por tenant. | — |
| PAN-CFG-28 | admin `/admin/cfg/tecnica` | `cfg.tecnica.ver` | Estado de configuración técnica del tenant: secretos requeridos por módulos activos y su estado; variables no sensibles informativas (zona horaria, dominio, almacenamiento). | Grilla: integración, secreto, estado (configurado/faltante/por vencer), última verificación. Nunca muestra valores. | Ir a bóveda (T06), probar conexión (T06). | `frmRecuperaConfiguracion`, `frmCuentaCorreo` (credenciales), `frmParam_SMS` (credenciales), `.pro` |
| PAN-CFG-29 | admin `/admin/cfg/perfiles-servicio` | `cfg.parametros.ver` | Perfil de configuración por servicio (BASE §84) y ficha por dominio (BASE §93). | Matriz servicio × 15 dimensiones con estado (completo/incompleto/No aplica + motivo) y enlaces a la pantalla del módulo que completa cada dimensión. | Marcar No aplica (motivo), abrir borrador con faltantes. | — |
| PAN-CFG-30 | admin, modal sin ruta propia: se abre desde el contador "en uso por" de PAN-CFG-08 (`/admin/cfg/tablas/:code`) y de la ficha de cualquier registro maestro; datos de API-CFG-24 (antes "modal admin (todas las tablas)") | `cfg.maestros.ver` | "En uso por": referencias de un registro por colección/módulo. | Lista de colecciones con conteo y enlace filtrado. | — | `frm_Consulta_Referencias` |
| PAN-CFG-31 | pwa-socio y landing, componente sin ruta propia que se monta en las rutas de los flujos anfitriones: `/app/tramites/nuevo/:formCode` (PAN-POR-32) y `/app/contratar` (PAN-POR-31) de M19, y el alta o cambio de domicilio de M01; se abre al tocar el campo "Dirección" de los flujos de M19 y M01 que piden domicilio (solicitud de servicio, alta de titular, cambio de domicilio; antes sin ruta citada); usa API-CFG-29, API-CFG-30, API-CFG-33 y API-CFG-34 (antes "pwa-socio y landing (componente)") | Regla de acceso del flujo anfitrión: pública con verificación en la landing y sesión del socio en la PWA; el componente no exige capability propia (antes "Sin capability (flujo de solicitud M19/M01)") | Selector de dirección simplificado para el socio (CU-GEO-01). | Mismo `GeoAddressPicker` en piel `.pwa-mod`, cards, errores inline, permiso de ubicación opcional. | Confirmar punto propuesto (queda `inReview` si la política lo exige). | — |
| PAN-CFG-32 | pwa-campo, componente sin ruta propia: botón "Confirmar ubicación" de la ficha de OT PAN-TEC-51 (`/app/campo/work-orders/:id`, regla AL-05 de T03); usa API-CFG-35 (antes "pwa-campo (componente)") | `cfg.geo.confirmarPunto` | Confirmación/corrección del punto en terreno por el técnico (usado por M10), con funcionamiento offline (cola única con `clientMutationId`). | Mapa, punto actual, "usar mi ubicación", motivo. | Confirmar, corregir. | — |
| PAN-CFG-33 | admin `/admin/cfg/entidades-juridicas` | `cfg.entidadesJuridicas.ver` / `cfg.entidadesJuridicas.editar` | Entidades jurídicas del tenant (RF-CFG-134 a 139). | Grilla: código, razón social, CUIT, condición IVA, régimen IIBB, por defecto, sucursales, estado. Filtro por estado. | Nueva/editar (modal lg con pestañas Datos legales, Domicilio, Historia; pestaña Empleador de solo lectura con enlace a PAN-SUE-05); marcar por defecto (confirmación); inactivar. | — (`EMPRESAS` sin ABM relevado [VERIFICAR]) |
| PAN-CFG-34 | admin `/admin/cfg/sucursales` | `cfg.sucursales.ver` / `cfg.sucursales.editar` | Sucursales (RF-CFG-140). | Grilla: código, nombre, entidad jurídica, localidad, usos, casa central, estado. Filtros: entidad, localidad, uso. | Nueva/editar (modal md con `GeoAddressPicker`); cambiar entidad con fecha efectiva; inactivar. | — |
| PAN-CFG-35 | admin `/admin/cfg/puestos` | `cfg.puestos.editar` | Puestos por sucursal (RF-CFG-141). | Grilla: código, nombre, sucursal, tipo, agente local, dispositivos, estado. | Nuevo/editar (modal md); inactivar. | `abm_Equipos` (parte de puesto) |

## 11. API

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CFG-01 | GET | `/api/admin/cfg/definitions` | `cfg.parametros.ver` | Definiciones visibles (filtros módulo, grupo, clase, legacy `codVar`). | Sí |
| API-CFG-02 | GET | `/api/admin/cfg/definitions/:key` | `cfg.parametros.ver` | Ficha de definición con dependencias y equivalencias. | Sí |
| API-CFG-03 | GET | `/api/admin/cfg/effective` | `cfg.parametros.ver` | Valores efectivos por módulo/grupo para un contexto (`branchId`, `serviceId`, `categoryId`, `at`, `knownAt`). | Sí |
| API-CFG-04 | GET | `/api/admin/cfg/values/:key` | `cfg.parametros.ver` | Valores por ámbito con historia. | Sí |
| API-CFG-05 | GET | `/api/cfg/effective` | `iam.sesion.autenticada` (antes "Usuario autenticado") | Claves con canal `pwa` del contexto del usuario. | Sí |
| API-CFG-06 | GET | `/api/public/:tenantSlug/cfg/effective` | `public: true` (antes "Público") | Claves con `public: true` (landing). | Sí |
| API-CFG-07 | GET/POST | `/api/admin/cfg/versions` | `cfg.versiones.ver` / `cfg.versiones.crear` | Listar / crear borrador (origen manual, import, copy, seed, migration, platform). | POST con `Idempotency-Key` |
| API-CFG-08 | GET/PATCH | `/api/admin/cfg/versions/:id` | `cfg.versiones.ver` / `cfg.versiones.crear` | Detalle / editar cabecera. | PATCH con `version` |
| API-CFG-09 | POST/PATCH/DELETE | `/api/admin/cfg/versions/:id/items[/:itemId]` | `cfg.versiones.crear` + capability del módulo | Agregar/editar/quitar ítems. | Sí (por `itemId`) |
| API-CFG-10 | GET | `/api/admin/cfg/versions/:id/diff` | `cfg.versiones.ver` | Diff contra vigente (o contra `diffBaseAt`). | Sí |
| API-CFG-11 | POST | `/api/admin/cfg/versions/:id/validate` | `cfg.versiones.validar` | Validación y dependencias. | Sí |
| API-CFG-12 | POST | `/api/admin/cfg/versions/:id/simulate` | `cfg.versiones.simular` | Simulación por contributors (job si es larga). | Sí |
| API-CFG-13 | POST | `/api/admin/cfg/versions/:id/submit` | `cfg.versiones.enviarRevision` | Enviar a revisión (T11). | Sí |
| API-CFG-14 | POST | `/api/admin/cfg/versions/:id/approve` · `/reject` | `cfg.versiones.aprobar` | Aprobar/rechazar con comentario. | Sí |
| API-CFG-15 | POST | `/api/admin/cfg/versions/:id/schedule` | `cfg.versiones.programar` | Programar publicación. | Sí |
| API-CFG-16 | POST | `/api/admin/cfg/versions/:id/publish` | `cfg.versiones.publicar` | Publicar ahora (atómico). | Sí (`Idempotency-Key`) |
| API-CFG-17 | POST | `/api/admin/cfg/versions/:id/cancel` | `cfg.versiones.cancelar` | Cancelar con motivo. | Sí |
| API-CFG-18 | POST | `/api/admin/cfg/versions/:id/rollback` | `cfg.versiones.revertir` | Crear versión de reversión. | Sí |
| API-CFG-19 | POST | `/api/admin/cfg/versions/:id/rebase` | `cfg.versiones.crear` | Recalcular diff contra vigente. | Sí |
| API-CFG-20 | GET | `/api/admin/cfg/history` | `cfg.historia.ver` | Valores a `at`/`knownAt`; exportable. | Sí |
| API-CFG-21 | GET | `/api/admin/cfg/tables` | `cfg.maestros.ver` | Catálogo de tablas maestras. | Sí |
| API-CFG-22 | GET/POST | `/api/admin/cfg/tables/:code/records` | `cfg.maestros.ver` / `cfg.maestros.crear` | Listar (paginado, `at`) / crear registro. | POST con `Idempotency-Key` |
| API-CFG-23 | PATCH/POST | `/api/admin/cfg/tables/:code/records/:id` · `/:id/deactivate` | `cfg.maestros.editar` / `cfg.maestros.anular` | Editar / inactivar. | Sí |
| API-CFG-24 | GET | `/api/admin/cfg/tables/:code/records/:id/usage` | `cfg.maestros.ver` | "En uso por". | Sí |
| API-CFG-25 | POST | `/api/admin/cfg/tables/:code/merge` | `cfg.maestros.unificar` | Unificar (job). | Sí |
| API-CFG-26 | POST/GET | `/api/admin/cfg/imports` · `/:id` · `/:id/confirm` · `/:id/cancel` | `cfg.maestros.importar` | Importación de maestros y padrones. | Sí |
| API-CFG-27 | GET | `/api/admin/cfg/tables/:code/export` | `cfg.maestros.exportar` | Exportación XLSX/CSV. | Sí |
| API-CFG-28 | GET | `/api/cfg/lookup/:code` | `iam.sesion.autenticada` (antes "Usuario autenticado") | Selector paginado (búsqueda, padre, vigentes). | Sí |
| API-CFG-29 | GET | `/api/cfg/geo/provinces` · `/departments` · `/localities` · `/postal-codes` | `iam.sesion.autenticada`; `public: true` acotado para la landing (antes "Usuario autenticado / público acotado") | Unidades territoriales. | Sí |
| API-CFG-30 | GET | `/api/cfg/geo/streets` | `iam.sesion.autenticada`; `public: true` acotado para la landing (antes "Usuario autenticado / público acotado") | Búsqueda de calles por localidad y texto (incluye locales y alias del tenant). | Sí |
| API-CFG-31 | POST | `/api/admin/cfg/geo/streets` | `cfg.calles.crear` | Alta de calle local. | Sí |
| API-CFG-32 | POST | `/api/admin/cfg/geo/street-proposals` · `/api/platform/cfg/street-proposals/:id/decide` | `cfg.geo.proponerCalle` / `cfg.geo.aprobarCalle` | Propuesta y decisión. | Sí |
| API-CFG-33 | POST | `/api/cfg/geo/normalize` | `iam.sesion.autenticada` (antes "Usuario autenticado") | Normalizar dirección (Georef). | Sí |
| API-CFG-34 | POST | `/api/cfg/geo/geocode` | `iam.sesion.autenticada` con cuota (antes "Usuario autenticado (cuota)") | Candidatos de geocodificación (Google) con precisión. | Sí (por hash de entrada) |
| API-CFG-35 | POST | `/api/admin/cfg/geo/references/confirm` | `cfg.geo.confirmarPunto` | Confirmar/corregir punto de una entidad (llama al dueño). | Sí |
| API-CFG-36 | GET | `/api/admin/cfg/geo/review-queue` | `cfg.geo.confirmarPunto` | Cola de revisión. | Sí |
| API-CFG-37 | GET/POST | `/api/admin/cfg/calendars` · `/holidays` | `cfg.calendarios.ver` / `cfg.calendarios.editar` | Calendarios y feriados. | Sí |
| API-CFG-38 | GET | `/api/cfg/business-days` | `iam.sesion.autenticada` (los módulos del backend usan el servicio interno de días hábiles, ver abajo; antes "Usuario autenticado") | `isBusinessDay`, `next`, `add`, `between` con contexto. | Sí |
| API-CFG-39 | GET/POST | `/api/admin/cfg/index-series` · `/:code/values` | `cfg.indices.ver` / `cfg.indices.editar` | Series y valores. | POST con `Idempotency-Key` |
| API-CFG-40 | GET | `/api/cfg/index-series/:code/value` | `iam.sesion.autenticada` (los módulos del backend usan `economicIndexes.valueAt`, ver abajo; antes "Usuario autenticado") | Valor a fecha con regla de ausencia. | Sí |
| API-CFG-41 | GET/PATCH | `/api/admin/cfg/adoptions` | `cfg.adopciones.configurar` | Adopciones y propósitos. | Sí |
| API-CFG-42 | GET | `/api/admin/cfg/tax-registries/:code/lookup?cuit=&at=` | `cfg.fiscal.ver` | Consulta de padrón. | Sí |
| API-CFG-43 | GET/POST | `/api/admin/cfg/enumerations` · `/:code/items` | `cfg.enumeraciones.configurar` | Enumeraciones. | Sí |
| API-CFG-44 | GET/POST/PATCH | `/api/admin/cfg/custom-fields` | `cfg.camposExtra.configurar` | Definiciones de campos extra. | Sí |
| API-CFG-45 | GET | `/api/cfg/forms/:formKey/schema` | `iam.sesion.autenticada` (antes "Usuario autenticado") | Esquema efectivo del formulario (base + personalización + campos extra). | Sí |
| API-CFG-46 | GET/POST/PATCH | `/api/admin/cfg/form-customizations` | `cfg.formularios.configurar` | Personalizaciones. | Sí |
| API-CFG-47 | GET/POST/PATCH/DELETE | `/api/cfg/saved-views` | `cfg.vistas.crear` / `cfg.vistas.compartir` | Vistas guardadas. | Sí |
| API-CFG-48 | GET | `/api/admin/cfg/service-profiles` | `cfg.parametros.ver` | Completitud del perfil por servicio. | Sí |
| API-CFG-49 | GET | `/api/admin/cfg/technical` | `cfg.tecnica.ver` | Estado de secretos requeridos. | Sí |
| API-CFG-50 | POST | `/api/platform/cfg/seed-packs/:code/apply` · `/api/platform/cfg/seed-applications/:id/remove` | `pla.cfg.semillas.administrar` | Aplicar/retirar semilla. | Sí |
| API-CFG-51 | GET/POST | `/api/platform/cfg/table-releases` · `/:id/publish` | `pla.cfg.tablasPlataforma.editar` (GET y POST de releases), `pla.cfg.tablasPlataforma.publicar` (`/:id/publish`) (antes `pla.cfg.tablasPlataforma.*`, comodín; T02 §4.4.3) | Releases de tablas de plataforma. | Sí |
| API-CFG-52 | GET/PATCH | `/api/platform/cfg/legacy-mappings` | `pla.cfg.equivalencias.editar` | Equivalencias V2. | Sí |
| API-CFG-53 | GET | `/api/v1/ext/cfg/geo/*` · `/api/v1/ext/cfg/index-series/*` | `bia.apis.consumir` (cliente API de tercero con scope de T10; antes "Token de tercero con scope") | Lectura de maestros públicos para APIs de terceros (T10). | Sí |
| API-CFG-54 | GET/POST | `/api/admin/cfg/sequences` | `cfg.secuencias.configurar` | Definición de secuencias y contadores (§14.7). Reemplazado por API-WFL-71 (y API-WFL-72, API-WFL-73), la API de `numberingSequences` de T11 (CTR-DAT-16; antes "Reemplazado por la API de `numberingSequences` de T11"). | Sí |
| API-CFG-55 | GET/POST/PATCH | `/api/admin/cfg/legal-entities[/:id]` · `/:id/set-default` · `/:id/deactivate` · `PATCH /:id/employer` | `cfg.entidadesJuridicas.ver` / `cfg.entidadesJuridicas.editar`; `PATCH /employer` con `sue.estructura.configurar` | Entidades jurídicas (RF-CFG-134 a 139). | Sí (`Idempotency-Key` en POST; `If-Match`) |
| API-CFG-56 | GET/POST/PATCH | `/api/admin/cfg/branches[/:id]` · `/:id/change-legal-entity` · `/:id/deactivate` | `cfg.sucursales.ver` / `cfg.sucursales.editar` | Sucursales (RF-CFG-140). | Sí |
| API-CFG-57 | GET/POST/PATCH | `/api/admin/cfg/workstations[/:id]` | `cfg.puestos.editar` | Puestos (RF-CFG-141). | Sí |
| API-CFG-58 | GET | `/api/internal/cfg/legal-entities/resolve?branchId&serviceId&at` | — | **Reemplazado por servicio interno `legalEntities.resolve({ branchId, serviceId, at })`** (RF-CFG-137, §9.17). Motivo: lo consumen solo los módulos del backend, no es un endpoint HTTP de usuario. No hay API destino: el reemplazo es el servicio interno de la tabla de servicios de esta sección (PA-CFG-15). | Sí |

**Servicios internos (no HTTP) que T04 expone a los módulos:**

| Servicio | Uso | Origen |
|---|---|---|
| `legalEntities.resolve({ branchId, serviceId, at })` | Entidad jurídica de un documento nuevo (antes API-CFG-58) | RF-CFG-137, §9.17 |
| `isBusinessDay`, `nextBusinessDay`, `addBusinessDays`, `businessDaysBetween` | Días hábiles con zona horaria del tenant; mismo cálculo que API-CFG-38 | RF-CFG-086 |
| `economicIndexes.valueAt({ seriesId, at })` | Valor de índice a fecha con regla de ausencia (antes fila sin nombre técnico); mismo cálculo que API-CFG-40 | §7 `economicIndexValues` |

Errores RFC 9457 con `requestId`; validaciones Zod compartidas; paginación `{ items, total, page, size }`.

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox)

| EVT-ID | Evento | Cuándo | Payload principal | Consumidores |
|---|---|---|---|---|
| EVT-CFG-01 | `cfg.configVersion.created` | Alta de borrador | `versionId`, `origin` | T10 (auditoría) |
| EVT-CFG-02 | `cfg.configVersion.submitted` | Envío a revisión | `versionId`, clases | T11 |
| EVT-CFG-03 | `cfg.configVersion.approved` / `.rejected` | Decisión | `versionId`, decisor | T09 (aviso al autor) |
| EVT-CFG-04 | `cfg.configVersion.scheduled` | Programación | `versionId`, `scheduledAt` | — |
| EVT-CFG-05 | `cfg.configVersion.published` | Publicación | `versionId`, ítems, `effectiveAt`, `contractPolicy` | Todos los módulos (invalidación de caché), M02, M04, M05 |
| EVT-CFG-06 | `cfg.configVersion.failed` / `.cancelled` / `.rolledBack` | Ídem | `versionId`, motivo | T09 |
| EVT-CFG-07 | `cfg.parameter.changed` | Por clave publicada o al iniciar/terminar vigencia | `key`, `scope`, `validFrom`, `retroactive` | Módulo dueño de la clave |
| EVT-CFG-08 | `cfg.masterRecord.changed` | Alta/edición/inactivación/cierre | `tableCode`, `recordId`, `op` | Consumidores de la tabla |
| EVT-CFG-09 | `cfg.masterRecord.merged` | Fin de unificación | `tableCode`, `survivorId`, `mergedIds` | M01, M03, M10 |
| EVT-CFG-10 | `cfg.platformTable.updated` | Release publicado | `tableCode`, `releaseNumber`, `affectsCalculation` | Tenants (aviso), M06, M08 |
| EVT-CFG-11 | `cfg.holiday.changed` | Alta/corrección de feriado | `calendarCode`, `date` | M05, M08, M09, M10 (SLA) |
| EVT-CFG-12 | `cfg.economicIndex.valuePublished` / `.valueRevised` | Ingesta o carga | `seriesId` (antes `seriesCode`), `date`, `value` | M08, M15, M05, M14 |
| EVT-CFG-13 | `cfg.taxRegistry.imported` | Fin de ingesta de padrón | `registryCode`, período, filas | M06 |
| EVT-CFG-14 | `cfg.geo.streetProposed` / `.streetDecided` | Propuesta/decisión | `streetId` | Plataforma / tenant |
| EVT-CFG-15 | `cfg.geoReference.updated` | Confirmación/corrección de punto | `subjectType`, `subjectId`, `status` | M01, M10, T10 |
| EVT-CFG-16 | `cfg.customField.defined` / `.deprecated` | Publicación | `entity`, `key` | Dueño de la entidad extendida según §7.11: M01 (`person`, `account`, `property`), M02 (`serviceContract`, `category`, `product` comercial), M09 (`ticket`), M10 (`workOrder`), M12 (`supplier`), M13 (`product` de stock, `fixedAsset`), M16 (`employee`); T10; T11 (formularios) (antes "Módulo dueño de la entidad, T10") |
| EVT-CFG-17 | `cfg.seedPack.applied` / `.removed` | Semilla | `tenantId`, paquete | T01 |
| EVT-CFG-18 | `cfg.integrity.issueDetected` | JOB-CFG-13 | `tenantId`, hallazgos | T01, T09 |
| EVT-CFG-19 | `cfg.legalEntity.created` / `.updated` / `.deactivated` | Alta, cambio de datos (incluido marcar por defecto o cambiar `employer`) o inactivación | `legalEntityId`, `code`, `cuit`, `legalName`, `isDefault`, `status`, `changedFields`, `validFrom` | M06 (perfil fiscal y puntos de venta), M05, M15, M14, M16, T03 (pie de documentos), T10 |
| EVT-CFG-20 | `cfg.branch.created` / `.updated` / `.deactivated` | Alta, cambio (incluido cambio de entidad) o inactivación de sucursal | `branchId`, `code`, `name`, `legalEntityId`, `uses`, `status` | T02 (alcance por sucursal), T03 (slots de marca por sucursal), M06, M07, M09, M13 |

### 12.2 Eventos consumidos

| Evento | Origen | Reacción |
|---|---|---|
| `pla.tenant.created` (EVT-PLA-01) | T01 | Crear adopciones por defecto, calendario del tenant, defaults; si demo, ofrecer semilla. Crear la entidad jurídica por defecto y la sucursal casa central (§9.16, RF-CFG-135, DEC-064). |
| `pla.capability.activated` / `.deactivated` (EVT-PLA-06/07) | T01 | Mostrar/ocultar claves del módulo; validar secretos requeridos. |
| `wfl.instance.completed` | T11 | Aprobar/rechazar `configVersion`. |
| `int.credential.rotated` / `.expiring` (EVT-INT-05) | T06 | Actualizar estado de `secretRef`. |
| `cat.serviceCopy.prepared` (EVT-CAT-26) | M02 | Crear borrador de destino (si M02 no llama a la API directamente). |
| `mig.snapshot.ready` (EVT-MIG-01) | T07 | Disparar JOB-CFG-10. |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-CFG-01 | `cfg:sincronizar-registro` | En cada despliegue | §9.1. |
| JOB-CFG-02 | `cfg:publicar-version-programada` | Cada minuto | Revalida y publica versiones `scheduled` vencidas. |
| JOB-CFG-03 | `cfg:importar-maestro` | Bajo demanda | Validación y carga por lotes (§9.6). |
| JOB-CFG-04 | `cfg:unificar-maestro` | Bajo demanda | Redirección de referencias (§9.7). |
| JOB-CFG-05 | `cfg:ingesta-georef` | Mensual + manual | §9.10. |
| JOB-CFG-06 | `cfg:ingesta-feriados` | Anual + manual | §9.10. |
| JOB-CFG-07 | `cfg:ingesta-indices` | Diaria / mensual | §9.10. |
| JOB-CFG-08 | `cfg:ingesta-padron:<registro>` | Según fuente | §9.10. |
| JOB-CFG-09 | `cfg:geocodificar-pendientes` | Cada 15 min | Reintenta `pending` con backoff y respeta cuota. |
| JOB-CFG-10 | `cfg:migrar-variables` | Bajo demanda (T07) | §9.11. |
| JOB-CFG-11 | `cfg:aplicar-semilla` | Bajo demanda | §9.13. |
| JOB-CFG-12 | `cfg:activar-vigencias` | Cada minuto | §9.14. |
| JOB-CFG-13 | `cfg:verificar-integridad` | Diario 03:00 (zona del tenant) | §9.15. |
| JOB-CFG-14 | `cfg:purgar-geocache` | Diario | Elimina `geocodeRequests` vencidos según política de PA-CFG-03. |

Todos los jobs son idempotentes, reanudables, registran progreso y respetan `tenantId`.

## 13. Integraciones

Las fichas técnicas viven en T06 INT; CFG es consumidor:

| Integración | Uso en CFG | Particularidades |
|---|---|---|
| Georef (datos.gob.ar) [GEO-F1, F2, F3, F5] | Ingesta de unidades territoriales y calles; normalización de direcciones. | Atribución y licencia; coordenadas aproximadas o ausentes; cobertura variable por región; límites de uso → ingesta masiva por descarga oficial, consultas puntuales con tope. |
| Google Maps Platform (Geocoding, Maps JavaScript, Geolocation) [GEO-F4, F6] | Geocodificación bajo demanda y visualización; ubicación del dispositivo con permiso. | Condiciones de uso, facturación y persistencia (PA-CFG-03, PA-CFG-04); sin descarga masiva; clave en bóveda. |
| BCRA (cotizaciones y tasas) | Series de cotización y tasas de referencia. | Ficha T06; valores en `Decimal128`. |
| BNA (tasas activa/pasiva) | Series para mora si el tenant las adopta. | Publicación no siempre estructurada → carga asistida por curador. |
| INDEC (IPC) | Serie de inflación mensual. | Revisiones de valores publicados. |
| Calendario oficial de feriados (Ministerio del Interior / decretos) | Feriados nacionales; provinciales por normas locales. | Carga asistida si no hay formato legible por máquina. |
| ARCA (padrón, tablas de parámetros WSFE: condiciones IVA receptor, alícuotas, monedas, tipos de documento) | Tablas fiscales de referencia y padrón. | Las tablas `FEParamGet*` de WSFE se usan como fuente de verdad de códigos [VERIFICAR vigentes al implementar]. |
| Fiscos provinciales (DGR Córdoba, ARBA, AGIP, API Santa Fe, ATER y otros; SIRCREB/COMARB) | Padrones de IIBB y alícuotas. | Algunos exigen credenciales del agente → padrón del tenant (PA-CFG-05). |
| Bóveda de secretos (T06) | Resolución de `secretRef`. | CFG nunca lee el valor, solo el estado. |
| Almacenamiento de objetos privado | Archivos de importación y errores. | URLs firmadas. |

## 14. Parámetros de configuración

### 14.1 Modelo del catálogo de parámetros (aplica a T04b y a la sección 14 de cada anexo)

Cada fila del catálogo (T04b partes 1–4 y anexos de módulo) documenta:

| Columna | Contenido |
|---|---|
| PRM-ID | `PRM-<COD>-NNN`; en T04b con segmento de parte: `PRM-<COD>-P<n>-NNN` (ej. `PRM-FAC-P2-014`). El `<COD>` es el del anexo destino (dueño de la semántica). Nunca se reutiliza. |
| Clave | Clave semántica (§14.2). |
| Tipo | Uno de los tipos de RF-CFG-004, con unidad y validación. |
| Ámbito | Ámbitos permitidos (§14.3) y el ámbito por defecto donde se carga. |
| Default | Valor por defecto de la definición; "sin default (obligatorio al activar)" cuando corresponda. |
| Descripción | Comportamiento en español, sin jerga de ProCoop. |
| Origen V2 # | `COD_VAR` y tabla (`VAR`/`VAR_PMOVIL` + canal); "—" si no tiene origen ProCoop. |
| Decisión | `Migrar`, `Migrar-servicio` (pasa a ámbito servicio/categoría), `Migrar-ente` (pasa a configuración del ente/pasarela), `Cuenta contable` (`accountRef`), `Diccionario` (T03), `Marca` (branding T03), `Plataforma` (default/operación de plataforma T01), `Bóveda` (`secretRef`), `Reemplazado` (por mecanismo nombrado), `Descartar` (motivo). |
| Anexo destino | Código del anexo que especifica la regla. |
| Clase de cambio / vigencia | `commercial`…`technical` / `immediate`…`periodBoundary` (cuando la fila lo determina; si no, lo fija el anexo dueño). |

### 14.2 Convención de claves

- Formato: `<mod>.<recurso>.<atributo>[.<subatributo>]`, de 3 a 5 segmentos, en **español camelCase**, ASCII sin tildes ni `ñ` (`anio`, `senia`), sin números al inicio de un segmento.
- `<mod>`: código del anexo dueño en minúsculas: `pla`, `iam`, `uxd`, `cfg`, `dat`, `int`, `mig`, `nfr`, `com`, `bia`, `wfl`, `per`, `cat`, `med`, `tar`, `fac`, `fis`, `cob`, `mor`, `crm`, `tec`, `ven`, `cmp`, `stk`, `tes`, `con`, `sue`, `ins`, `soc`, `por`.
- `<recurso>`: sustantivo del dominio (`vencimientos`, `pagos360`, `turnero`, `lecturas`, `recibos`).
- `<atributo>`: qué se configura (`cantidadMaxima`, `habilitado`, `diasGracia`, `cuentaVentas`, `plantillaAviso`).
- Booleanos en forma afirmativa (`habilitado`, `permitirX`, `exigirX`, `mostrarX`); nunca `noX` (RN-CFG-019).
- Unidades en el nombre cuando no son obvias (`diasGracia`, `minutosEspera`, `porcentajeTope`).
- Referencias terminan en el tipo de objeto (`depositoPorDefecto`, `plantillaCierreTicket`, `cuentaComision`).
- Secretos: `<mod>.<integracion>.<credencial>Ref` (ej. `cob.pagos360.apiKeyRef`), siempre `secretRef`.
- Ejemplos: `fac.vencimientos.cantidadMaxima`, `mor.interes.tipoCalculo`, `cob.caja.permitirPagoParcial`, `crm.turnero.webHabilitado`, `stk.depositos.porDefectoVentas`, `cfg.calendario.reglaVencimientoInhabil`, `uxd.adjuntos.mostrarIconos`.
- Los nombres de **campos y colecciones** siguen en inglés camelCase (Guía §5); las **claves** son identificadores de negocio alineados con las capabilities (`fac.lotes.aprobar`), por eso van en español (CTR-CFG-05).

### 14.3 Ámbitos

| Ámbito | `scope.type` | Referencia | Quién edita | Uso típico | Restricciones |
|---|---|---|---|---|---|
| Plataforma | `platform` | — (tenant `PLATFORM`) | Superadministrador | Defaults globales, límites técnicos de producto, cuotas | Nunca datos de un tenant |
| Tenant | `tenant` | — | Administrador / configurador del módulo | Políticas de la cooperativa | — |
| Entidad jurídica | `legalEntity` | `legalEntityId` → `legalEntities` de T04 (RF-CFG-134; DEC-096) | Configurador del módulo con alcance sobre la entidad (dimensión "entidad jurídica" de T02) | Políticas distintas entre la cooperativa y la mutual del mismo tenant: leyendas legales de comprobantes, cuentas contables por defecto, políticas fiscales y de sueldos propias de la entidad | Entidad activa del mismo tenant; oculto en el editor con PRM-CFG-039 = `false`; se ubica entre `tenant` y `branch` en la precedencia (RF-CFG-019) |
| Sucursal | `branch` | `branchId` → `branches` de T04 (RF-CFG-140; corregido por DEC-064, antes "T01") | Configurador con alcance sobre la sucursal | Punto de venta por defecto, caja, horarios, depósitos | Reemplaza el punto de venta del `.pro`/`USERS`/`EQUIPOS` |
| Servicio | `service` | `serviceId` (M02) | Configurador del módulo con alcance sobre el servicio | Reglas propias por servicio (BASE §84) | — |
| Categoría | `category` | `categoryId` (M02/M04) | Ídem | Diferencias por categoría tarifaria (residencial, comercial) | Debe pertenecer al servicio |
| Usuario | `user` | `userId` | El propio usuario | Preferencias de UI ("cerrar reporte al imprimir") | Prohibido para `commercial`, `fiscal`, `security` (RN-CFG-004) |

El puesto/terminal no es ámbito del motor (PA-CFG-06): impresoras, lectores y dispositivos son atributos del dispositivo registrado (M09 agente local / M07 cajas).

### 14.4 Resumen por módulo ProCoop (1.536 parámetros)

Fuente: RN-09 §6.2 (declarados y con uso directo) y resúmenes de T04b (distribución y destinos).

| Módulo ProCoop | Declarados | Con uso directo | Catálogo | Destino principal (anexos) | Prefijos de clave principales | Observaciones |
|---|---:|---:|---|---|---|---|
| SISTEMA | 8 | 8 | T04b parte 1 §5 | T01, T08, T03, bóveda (T06) | `pla.`, `uxd.` | 2085 → migraciones en pipeline; −1 descartado (envío de errores a casilla externa); 2617 → almacenamiento de objetos; 2931 → bóveda. |
| CONFIGURACION | 107 | 65 | T04b parte 1 §6 | T01 (perfil del tenant 518–527, 709), T03 (textos del portal), M19, T09, T02, T06 | `pla.`, `uxd.`, `por.`, `com.`, `iam.` | Muchas `VARIABLE_PMOVIL` CoopOnline → diccionario o `por.*`. |
| TITULARES | 312 | 193 | T04b parte 1 §7 | M01 (67 filas), M02 (48), M06 (45), M19 (35), M04 (27), T01 (25), M17 (18), T03 (17) y otros | `per.`, `cat.`, `fis.`, `por.`, `tar.`, `ins.` | 49 filas `Migrar-servicio`. |
| VENTAS_Y_FACTURACION | 313 | 199 | T04b parte 2 | M05 (99), M11 (67), M04 (41), M06 (32), M07 (11), M08 (10), M19, T01, T06 | `fac.`, `ven.`, `tar.`, `fis.` | 256 PRM; 33 `Migrar-servicio`. |
| COBRANZA | 265 | 186 | T04b parte 3 §5 | M07 (mayoría), T06 (entes y pasarelas), M08, M19 | `cob.`, `int.`, `mor.` | 25 credenciales de pasarelas → bóveda; 19 URLs/webhooks calculados por plataforma. |
| GESTION_DE_MORA | 23 | 13 | T04b parte 3 §6 | M08 | `mor.` | — |
| FINANCIACIONES | 21 | 12 | T04b parte 3 §7 | M08 | `mor.` | Plantillas de convenio → `templateRef` (T09). |
| CONSUMOS | 4 | 1 | T04b parte 3 §8 | M03, M19 | `med.` | — |
| TECNICA | 95 | 36 | T04b parte 4 §5.1 | M10 | `tec.` | — |
| TELEMED (telemedición/lecturas) | 45 | 31 | T04b parte 4 §5.2 | M03 | `med.` | Parámetros de la app de lecturas (PMovil) → PWA de campo. |
| TELEFONIA | 16 | 13 | T04b parte 4 §5.3 | M10 | `tec.` | — |
| SMS | 11 | 7 | T04b parte 4 §5.4 | T09, T06 | `com.` | Módem GSM local en PA-CFG-P4-01. |
| COMPRAS | 109 | 46 | T04b parte 4 §5.5 | M12 | `cmp.` | — |
| STOCK | 14 | 5 | T04b parte 4 §5.6 | M13 | `stk.` | Depósitos por defecto 161/164/165/166 → ámbito sucursal/usuario-operación. |
| FABRICACION | 4 | 1 | T04b parte 4 §5.7 | M13 | `stk.` | — |
| CONTABILIDAD | 87 | 37 | T04b parte 4 §5.8 | M15 | `con.` | 54 filas `Cuenta contable` (`accountRef`) en la parte 4. |
| TESORERIA | 33 | 16 | T04b parte 4 §5.9 | M14 | `tes.` | — |
| SUELDOS | 28 | 18 | T04b parte 4 §5.10 | M16 | `sue.` | — |
| VIVIENDA | 14 | 9 | T04b parte 4 §5.11 | M18 | `soc.` | — |
| TURNERO | 11 | 7 | T04b parte 4 §5.12 | M09 | `crm.` | Dependencia 67 ↔ 3064 (RF-CFG-006). |
| TICKETS | 3 | 1 | T04b parte 4 §5.13 | M09 | `crm.` | — |
| MESA_DE_ENTRADAS | 3 | 0 | T04b parte 4 §5.14 | M09 | `crm.` | Sin uso en escritorio (RN-09 §8.8). |
| ACTIVIDADES | 1 | 1 | T04b parte 4 §5.15 | M09 | `crm.` | — |
| No catalogados (leídos por el código) | 9 | 9 | T04b parte 4 §5.16 | Varios (M05 #74, M07 #473, #2996, #2803, #3142, M19 #1 PMovil) | — | 383 descartada (migración interna ya aplicada). |
| **Total** | **1.536** | **914** | Partes 1–4 | — | — | 622 sin lectura directa → PA-CFG-07. |

Filas de T04b asignadas a este anexo (T04 CFG): V2 #2309 (validar permiso de carga de calle → capability `cfg.calles.crear`), #2673 (numeración de titulares → secuencias configurables §14.7, PA-CFG-P1-01), #3039 (contador de lote FECESCOR → secuencia transaccional §14.7), #383 (descartada), y una fila de la parte 2 que T04b remite a T04 como mecanismo de secuencias.

### 14.5 Parámetros propios de CFG

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-CFG-001 | `cfg.publicacion.requiereRevision` | boolean | tenant | `true` | Si las versiones con clases sensibles requieren revisión. | — |
| PRM-CFG-002 | `cfg.publicacion.clasesConRevision` | multiEnum (`changeClass`) | tenant | `commercial`, `fiscal`, `security` | Clases que exigen revisión por otro usuario. | — |
| PRM-CFG-003 | `cfg.publicacion.permitirAutoaprobacion` | boolean | tenant | `false` | Permite que el autor publique sus propias versiones no sensibles. | — |
| PRM-CFG-004 | `cfg.publicacion.anticipacionMinimaHoras` | integer (h, 0–720) | tenant, service | `0` | Anticipación mínima entre aprobación y fecha efectiva para clase `commercial`. | — |
| PRM-CFG-005 | `cfg.publicacion.retroactividad` | enum (`nunca`, `conAprobacion`) | tenant | `conAprobacion` | Política de fechas efectivas pasadas. | — |
| PRM-CFG-006 | `cfg.publicacion.maxDiasRetroactivo` | integer (días, 0–366) | tenant | `31` | Máximo retroactivo admitido. | — |
| PRM-CFG-007 | `cfg.historia.retencionAnios` | integer (años, 5–30) | platform | `10` | Retención de historia y auditoría de configuración. | — |
| PRM-CFG-008 | `cfg.general.zonaHoraria` | enum (IANA) | tenant | `America/Argentina/Cordoba` | Zona horaria del tenant (AGR-017). | 224, 225 (Reemplazado) |
| PRM-CFG-009 | `cfg.general.monedaPorDefecto` | reference (`currencies`) | tenant | `ARS` | Moneda por defecto. | — |
| PRM-CFG-010 | `cfg.general.paisPorDefecto` | reference (`countries`) | tenant | `AR` | País por defecto en domicilios. | — |
| PRM-CFG-011 | `cfg.general.provinciaPorDefecto` | reference (`provinces`) | tenant, branch | sin default (obligatorio al activar) | Provincia propuesta en domicilios. | — |
| PRM-CFG-012 | `cfg.general.localidadPorDefecto` | reference (`localities`) | tenant, branch | sin default | Localidad propuesta en domicilios. | — |
| PRM-CFG-013 | `cfg.calendario.calendariosAplicables` | list<reference `calendars`> | tenant, branch, service | nacional + provincia del tenant | Calendarios para días hábiles. | — |
| PRM-CFG-014 | `cfg.calendario.diasNoHabilesSemana` | multiEnum (0–6) | tenant, branch | sábado, domingo | Fines de semana. | — |
| PRM-CFG-015 | `cfg.calendario.reglaVencimientoInhabil` | enum (`siguienteHabil`, `anteriorHabil`, `sinAjuste`) | tenant, service | `siguienteHabil` | Regla por defecto que usan los módulos. | [VERIFICAR] RN-04 |
| PRM-CFG-016 | `cfg.geo.proveedorMapa` | enum (`google`) | platform | `google` | Proveedor de mapas y geocodificación. | — |
| PRM-CFG-017 | `cfg.geo.origenClaveMapa` | enum (`plataforma`, `propia`) | tenant | `plataforma` | Origen de la clave (con `cfg.geo.claveMapaRef` si es propia). | PA-CFG-P1-03 |
| PRM-CFG-018 | `cfg.geo.cuotaMensualGeocodificaciones` | integer | platform (por tenant) | `5000` | Tope mensual de geocodificaciones con clave de plataforma. | — |
| PRM-CFG-019 | `cfg.geo.centroMapa` | geoPoint | tenant, branch | centroide de `cfg.general.localidadPorDefecto` | Centro inicial de mapas (reemplaza `MAPA.LATITUD/LONGITUD`). | — |
| PRM-CFG-020 | `cfg.geo.zoomInicial` | integer (1–20) | tenant, branch | `13` | Zoom inicial (reemplaza `MAPA.ZOOM`). | — |
| PRM-CFG-021 | `cfg.geo.exigirConfirmacionPunto` | boolean | tenant, service | `true` | El punto de prestación debe quedar `confirmed` antes de agendar instalación. | — |
| PRM-CFG-022 | `cfg.geo.permitirCallesLocales` | boolean | tenant | `true` | Permite crear calles locales. | 2309 (Reemplazado por capability) |
| PRM-CFG-023 | `cfg.geo.ofrecerUbicacionDispositivo` | boolean | tenant | `true` | Ofrece "usar mi ubicación" con permiso. | — |
| PRM-CFG-024 | `cfg.indices.serieCotizacionDolar` | reference (`economicIndexSeries`) | tenant | serie oficial vendedor | Serie para conversiones USD. | — |
| PRM-CFG-025 | `cfg.indices.serieInflacion` | reference (`economicIndexSeries`) | tenant | IPC nacional | Serie para ajustes por inflación. | — |
| PRM-CFG-026 | `cfg.adopcion.modoTablasCalculo` | enum (`seguirConAviso`, `fijar`) | tenant | `seguirConAviso` | Modo de adopción de tablas que afectan cálculos. | — |
| PRM-CFG-027 | `cfg.camposExtra.maxPorEntidad` | integer | platform | `50` | Límite de campos extra por entidad. | — |
| PRM-CFG-028 | `cfg.importacion.maxFilas` | integer | platform | `1000000` | Máximo de filas por importación. | — |
| PRM-CFG-029 | `cfg.importacion.tamanoMaximoMb` | integer | platform | `50` | Tamaño máximo de archivo. | — |
| PRM-CFG-030 | `cfg.formularios.permitirPersonalizacion` | boolean | tenant | `true` | Habilita PAN-CFG-22. | — |
| PRM-CFG-031 | `cfg.vistas.permitirCompartirTenant` | boolean | tenant | `true` | Permite vistas compartidas con todo el tenant. | — |
| PRM-CFG-032 | `cfg.demo.permitirSemillas` | boolean | platform (por tenant) | `false` (`true` en demo/sandbox) | Habilita aplicar semillas. | — |
| PRM-CFG-033 | `cfg.fiscal.modoAdopcionPadrones` | enum (`plataforma`, `tenant`, `mixto`) | tenant | `mixto` | Origen de padrones por registro. | — |
| PRM-CFG-034 | `uxd.reportes.cerrarAlImprimir` | boolean | user | `false` | Cierra la vista previa al imprimir. | 2459 |
| PRM-CFG-035 | `uxd.adjuntos.mostrarIconos` | boolean | tenant, user | `true` | Muestra íconos al cargar adjuntos (inversión de "No mostrar"). | 2895 |
| PRM-CFG-036 | `cfg.geo.diasRetencionGeocache` | integer (días) | platform | `30` | Retención de resultados crudos del proveedor. | — |
| PRM-CFG-037 | `cfg.geo.reintentosGeocodificacion` | integer (1–20) | platform | `5` | Reintentos antes de `failed`. | — |
| PRM-CFG-038 | `cfg.indices.reglaValorAusente` | enum (`ultimoAnterior`, `exacto`) | tenant, service | `ultimoAnterior` | Regla por defecto si falta valor de la serie. | — |
| PRM-CFG-039 | `cfg.entidadesJuridicas.multiplesHabilitado` | boolean | tenant | `false` | Habilita operar con más de una entidad jurídica; con `false` se ocultan los selectores y se usa la entidad por defecto (RF-CFG-137). | — |
| PRM-CFG-040 | `cfg.entidadesJuridicas.emisoraPorServicio` | reference (`legalEntities`) | service | sin valor (usa sucursal o por defecto) | Entidad que emite los documentos del servicio (RF-CFG-137). | — |

### 14.6 Configuración técnica (no son parámetros)

Ver §19.3: variables de entorno del despliegue (T08) y secretos en bóveda (T06). Ningún parámetro del motor contiene servidores, puertos, rutas de disco, usuarios ni contraseñas.

### 14.7 Secuencias y contadores (complemento del modelo de datos)

**Reemplazado por `numberingSequences` de T11 (numeración no fiscal) y `numberSequences` de M05 (numeración fiscal, por `legalEntityId` y punto de venta) (CTR-DAT-16).** El texto siguiente se conserva como requisito que deben cumplir esas colecciones. T04b remite a CFG la numeración configurable (titulares, lotes de archivos de integración). Colección `sequences`: `tenantId`, `code` (ej. `per.titulares.numero`, `int.fecescor.lote`), `scope` (`tenant`, `branch`, `service`, `pointOfSale`), `scopeRefId`, `format` (prefijo, relleno, sufijo, reinicio anual/nunca), `nextValue` (Int64), `step`, `validFrom`, `allowManualOverride`, `status`. El incremento es atómico (`findOneAndUpdate` dentro de la transacción del documento que lo consume); un número asignado no se reutiliza aunque el documento se anule. La definición de la secuencia se publica por `configVersion`; el valor corriente es transaccional (no versionado). Las numeraciones fiscales (puntos de venta ARCA) siguen siendo de M06/M05 y solo usan este servicio si su anexo lo indica. Capability `cfg.secuencias.configurar`.

## 15. Reportes, indicadores y exportaciones

| Reporte | Fórmula / contenido | Universo | Fecha de corte |
|---|---|---|---|
| Registro de cambios de configuración | Ítems publicados con antes/después, versión, autor, revisor, fecha efectiva y de registro | Tenant (filtrable por módulo/clase) | Rango de `recordedAt` declarado |
| Configuración vigente a fecha | Valor efectivo por clave y ámbito | Claves activas del tenant | `at` y `knownAt` declarados en la cabecera |
| Tiempo de ciclo de versiones | Promedio (`publishedAt − createdAt`) y (`approvedAt − submittedAt`) | Versiones publicadas en el período | Período por `publishedAt` |
| Versiones rechazadas/fallidas | Conteo y motivos | Versiones del período | Período por fecha de transición |
| Integridad de configuración | Valores inválidos, referencias rotas, secretos faltantes/por vencer | Tenant | Ejecución de JOB-CFG-13 |
| Completitud de perfiles de servicio | Dimensiones completas / dimensiones obligatorias × 100 por servicio | Servicios habilitados | Al momento de la consulta |
| Calidad de georreferenciación | % `confirmed`, % `approximate`, % `pending/failed/inReview` | Direcciones de prestación del tenant (M01) | Al momento; tendencia mensual |
| Consumo de geocodificación | Llamadas por mes vs cuota | Tenant | Mes calendario en zona del tenant |
| Calles locales y propuestas | Locales activas, propuestas por estado | Tenant / plataforma | Al momento |
| Cobertura de padrones | CUIT de titulares con entrada vigente / CUIT totales × 100 | Titulares con CUIT del tenant | Fecha consultada |
| Valores de índices | Serie con valores, revisiones y fuente | Series adoptadas | Rango de fechas |
| Adopciones pendientes | Releases de plataforma sin reconocer y antigüedad | Tenant | Al momento |
| Importaciones | Archivos, filas, errores, duración | Tenant | Rango |
| Uso de campos extra | Registros con valor / registros de la entidad por campo | Entidad | Al momento |
| Reporte de migración de `VARIABLE` | Filas por destino (deben sumar el total) | Volcado del tenant | Fecha del volcado |

Exportaciones XLSX/CSV/PDF desde `DataTable`, con fecha de corte en la cabecera.

## 16. Casos de uso

### CU-GEO-01 — Dirección de prestación georreferenciada (BASE §77, original)

Ana solicita un servicio para un nuevo domicilio. Selecciona Córdoba y su localidad, busca la calle y completa la altura y unidad. El sistema muestra la dirección normalizada y un punto candidato en Google Maps. Ana o un operador autorizado confirma el acceso correcto al inmueble. El contrato y la visita utilizan esa dirección, mientras el domicilio fiscal permanece separado. Si no aparece la calle de un loteo nuevo, se conserva el texto y las referencias y se permite indicar el punto para revisión; no se completa con otra calle homónima ni con coordenadas inventadas. Datos: DIR-DEMO-001; INM-001; provincia Córdoba; Calle Ejemplo 100 (ficticio); estado Pendiente de georreferenciación; sin coordenadas reales para un domicilio inventado. Implementación: §9.9, PAN-CFG-14/31, RF-CFG-065..083.

### CU-COP-01 — Copia de Internet entre tenants (BASE §81, original; dueño M02)

CFG aporta los pasos 3, 5 y 6: el destino recibe una `configVersion` en borrador con dependencias pendientes; se simula contratación y primera factura sin deuda real; se publica por el circuito del destino. Datos: origen TEN-001/INT/versión 1; destino TEN-002/INT/versión 1; COP-DEMO-001; estado inicial Borrador con dependencias pendientes.

### CU-CFG-01 — Publicar un cambio de vencimientos con fecha efectiva

Actor: configurador de facturación de TEN-001; revisor: jefe de administración. 1) Crea borrador "Vencimientos junio". 2) Cambia `fac.vencimientos.cantidadMaxima` de 2 a 3 en el servicio Agua. 3) Fecha efectiva 01-06-2026 (modo `periodBoundary`: coincide con inicio de ciclo). 4) Valida (sin errores), simula (M05 muestra una factura ficticia con tres vencimientos). 5) Envía a revisión; el revisor aprueba. 6) Queda programada; el 01-06-2026 00:00 se publica. Resultado: facturas de mayo no cambian; las del ciclo de junio usan 3 vencimientos y guardan la huella de configuración.

### CU-CFG-02 — Rechazo por dependencia y plan sin precio

El configurador publica un plan de Internet visible en la landing sin tarifa vigente para TEN-002 y habilita `crm.turnero.webHabilitado` sin `crm.turnero.habilitado`. La validación falla con dos errores enlazados; la versión vuelve a borrador. Nada se publica parcialmente.

### CU-CFG-03 — Editar una tabla maestra con "en uso por"

El operador intenta eliminar el barrio "Barrio Demo Norte"; el sistema informa 120 domicilios y 3 zonas que lo referencian y ofrece inactivar o unificar.

### CU-CFG-04 — Importar el padrón de IIBB del período

El responsable fiscal sube el archivo del período 05-2026 de la jurisdicción (ficticio). Vista previa: 250.000 filas, 12 con CUIT inválido. Confirma; el job carga 249.988 entradas con vigencia 01-05-2026 a 31-05-2026 y cierra las anteriores. Consulta CUIT 30-00000000-0 al 15-05-2026: alícuota 2,5 % (ficticia).

### CU-CFG-05 — Unificar calles duplicadas migradas

Tras migrar ProCoop hay "Bv. San Juan" y "Boulevard San Juan" en la misma localidad. El operador unifica en la calle nacional; el job redirige 3.400 domicilios; la local queda `merged` y "Bv. San Juan" pasa a alias.

### CU-CFG-06 — Adoptar una actualización fiscal de plataforma

Plataforma publica un release de alícuotas de IIBB con vigencia futura y fuente normativa. TEN-001 (modo `seguirConAviso`) recibe aviso y borrador `origin = platform`; el responsable fiscal revisa simulación (M06) y aprueba; rige desde la fecha de vigencia.

### CU-CFG-07 — Cargar un feriado municipal tardío

El 05-08-2026 la municipalidad declara asueto el 07-08-2026. El operador lo agrega al calendario municipal; `cfg.holiday.changed` hace que M05 recalcule vencimientos de documentos no emitidos; las facturas ya emitidas conservan su vencimiento.

### CU-CFG-08 — Corregir retroactivamente una tasa de mora propia

La cooperativa detecta el 15-07 que su tasa de recargo de julio debía ser 3,5 % y no 4 % desde el 01-07. Crea versión retroactiva (dentro de 31 días), con aprobación; `config.get` con `knownAt` 10-07 sigue devolviendo 4 %; M08 recibe evento y genera los ajustes de los recargos ya liquidados por su circuito.

### CU-CFG-09 — Definir un campo extra de cuenta

El administrador define en "cuenta" el campo `nroFichaPapel` (texto, único, sección "Legado", visible solo en admin). Se publica; aparece en la ficha, la grilla de cuentas (columna opcional), la importación y la exportación.

### CU-CFG-10 — Vista guardada compartida

Una supervisora de cobranza arma en la grilla de cuentas una vista "Mora > 60 días — Zona Norte", con columnas y formato condicional rojo para saldo > ARS 100.000, y la comparte con el rol "Gestor de mora". Un gestor sin alcance sobre la zona Norte la abre y ve cero registros (RN-CFG-042).

### CU-CFG-11 — Migrar la configuración de una cooperativa desde ProCoop

T07 entrega el volcado de `VARIABLE` (1.240 filas) y `VARIABLE_PMOVIL` (180). JOB-CFG-10 genera borrador con 1.010 ítems, 95 textos a diccionario, 40 solicitudes de carga de secretos (sin migrar valores en claro), 275 filas en reporte (descartadas, a validar o sin equivalencia). La suma de destinos coincide con 1.420.

### CU-CFG-12 — Aplicar la semilla demo

Plataforma crea TEN-DEMO y aplica `demo-base-s39`. Se crean servicios, conceptos, medios de cobro, estados y roles de §18; tarifas y recargos quedan en un borrador pendiente de aprobación; `TRIB-PEND` queda pendiente de validación fiscal; `REC-PEND` deshabilitado.

### CU-CFG-13 — Confirmar el punto en campo

El técnico llega a una dirección `approximate`; en la PWA de campo, sin señal, marca el acceso real y escribe "entrada por calle lateral". Al recuperar conexión la mutación se sincroniza; el punto queda `confirmed` con fuente `field-survey`.

## 17. Criterios de aceptación y escenarios de prueba

| ESC-ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-CFG-01 | Publicación atómica con fallo inyectado en el ítem 7 de 10 | Ningún ítem vigente; versión `failed`; alerta. |
| ESC-CFG-02 | Precedencia: valor en tenant 2, servicio 3, categoría 4; consulta con categoría | 4; sin categoría → 3; otro servicio → 2. |
| ESC-CFG-03 | Bitemporal: valor A desde 01-03 registrado 01-03; corrección B desde 01-03 registrada 12-03 | `at=10-03,knownAt=11-03` → A; `knownAt=13-03` → B. |
| ESC-CFG-04 | Autor intenta aprobar su versión `commercial` | 403 (permiso negativo). |
| ESC-CFG-05 | Usuario sin `fac.configuracion.configurar` edita `fac.*` | 403. |
| ESC-CFG-06 | Aislamiento: usuario de TEN-002 consulta `parameterValues`, `geocodeRequests`, `savedViews` y calles locales de TEN-001 | Sin resultados; test automatizado en cada endpoint. |
| ESC-CFG-07 | Clave no declarada leída en código | Excepción; no se crea registro. |
| ESC-CFG-08 | Versión programada y luego otra versión publicada sobre la misma clave | Al llegar la hora, revalidación detecta conflicto; `failed` con pedido de rebase. |
| ESC-CFG-09 | Reintento de `publish` con la misma `Idempotency-Key` | Una única publicación. |
| ESC-CFG-10 | Retroactivo de 40 días con PRM-CFG-006 = 31 | Validación rechaza. |
| ESC-CFG-11 | Vencimiento domingo 06-09-2026 con lunes feriado ficticio | `nextBusinessDay` = martes 08-09-2026. |
| ESC-CFG-12 | Año bisiesto: sumar 1 mes a 31-01-2028 y 1 año a 29-02-2028 | Resultado según regla documentada del módulo, idéntico en servidores con distinta TZ. |
| ESC-CFG-13 | Google caído al guardar una solicitud | Solicitud guardada `pending`; JOB-CFG-09 la geocodifica luego. |
| ESC-CFG-14 | Calle homónima en dos localidades | El selector exige localidad; nunca autocompleta otra. |
| ESC-CFG-15 | Cuota de geocodificación agotada | Componente sin mapa con búsqueda de catálogo y aviso; no falla el formulario. |
| ESC-CFG-16 | Importación de 50.000 filas con 30 errores; cancelación a mitad de proceso | Vista previa con 30 errores; tras cancelar, estado previo intacto. |
| ESC-CFG-17 | Reimportar el mismo archivo en modo `upsert` | Cero cambios. |
| ESC-CFG-18 | Unificar barrio con 120 referencias; reiniciar worker a mitad | Job reanuda; 0 referencias al duplicado al terminar. |
| ESC-CFG-19 | Release fiscal de plataforma con vigencia futura, tenant `fijar` | Sin impacto hasta que el tenant adopte; aviso pendiente. |
| ESC-CFG-20 | Revisión de un valor de IPC | Valor anterior consultable con `knownAt`; documentos emitidos sin cambios. |
| ESC-CFG-21 | Personalización intenta ocultar un campo obligatorio de negocio | Rechazo con motivo. |
| ESC-CFG-22 | API omite un campo vuelto obligatorio por personalización | 422. |
| ESC-CFG-23 | Parámetro `string` con valor con forma de token | Rechazo (RF-CFG-014). |
| ESC-CFG-24 | Migración de `VARIABLE`: suma de destinos | Igual al total de filas del volcado. |
| ESC-CFG-25 | Semilla en tenant productivo | Acción no disponible (403). |
| ESC-CFG-26 | Retirar semilla con datos creados por usuarios en el demo | Solo se retiran registros de la semilla. |
| ESC-CFG-27 | Módulo no licenciado | Sus claves no se listan y `config.get` devuelve "apagado". |
| ESC-CFG-28 | Copia entre tenants sin mapeo de cuenta contable | Validación del destino bloquea publicación (AGR-009 ejemplo). |
| ESC-CFG-29 | Propagación de publicación en 3 réplicas | Todas leen el valor nuevo en < 5 s. |
| ESC-CFG-30 | Vista compartida usada por usuario sin alcance | No amplía datos visibles. |
| ESC-CFG-31 | Alta de TEN-001 (`pla.tenant.created`) y reproceso del mismo evento | Una sola entidad `isDefault` y una sola casa central. |
| ESC-CFG-32 | Factura sin `legalEntityId` o con la entidad de TEN-002 | No valida (422); nada se persiste. |
| ESC-CFG-33 | Usuario de TEN-001 lista entidades jurídicas | Solo ve las de TEN-001. |
| ESC-CFG-34 | Segunda entidad con el CUIT de la primera; inactivar la entidad por defecto | Ambas operaciones se rechazan con motivo. |
| ESC-CFG-35 | Servicio SOC con PRM-CFG-040 = entidad "MUTUAL" en sucursal de "COOP" | El documento resuelve "MUTUAL". |
| ESC-CFG-36 | Clave con valor `tenant` = A, `legalEntity` "MUTUAL" = B y `branch` SUC-01 (de "COOP") = C; `config.get` para un documento de "MUTUAL" y otro de "COOP", ambos en SUC-01 (DEC-096) | "MUTUAL" resuelve B (`scopeResolved = legalEntity`); "COOP" resuelve C; sin valor en SUC-01, "COOP" resuelve A. |
| ESC-CFG-37 | Migración con `PTOVENTA.SUC_COM` = 1, 2 y 5, donde la cooperativa fusiona 1 y 2 en "Casa central" y descarta 5 (DEC-098) | Se crea una sola sucursal, "Casa central", con `legacy.values = ['1','2']`; el valor 5 queda descartado con motivo; antes de la confirmación, el paso de puntos de venta y cajas de T07 se rechaza. |

ESC-01..05 del documento maestro aplican en lo que dependan de configuración publicada (tarifas, vencimientos, mora): sus datos de configuración se cargan por `configVersion` y se verifica la huella de configuración en los documentos.

## 18. Datos de precarga de demostración (ficticios)

Paquete `demo-base-s39` (BASE §39 completa). **Todos los importes y fórmulas son inventados**; el gas y la electricidad pueden necesitar reglas mucho más complejas; coberturas sociales y condiciones de telecomunicaciones deben relevarse específicamente. Los datos se marcan `demoData` y se mantienen separados de los operativos.

### 18.1 Reglas de precarga (BASE §39.1)

- Seleccionar un servicio puede sugerir unidad, periodicidad y requisitos del plan.
- Seleccionar un contrato propone titular, inmueble y tarifa vigente, sin sobrescribir cambios históricos.
- Seleccionar un comprobante para cobrar propone su saldo pendiente; el operador puede registrar un pago parcial si tiene permiso.
- Una configuración sensible requiere aprobación; no se acepta silenciosamente un valor sugerido.
- Un dato desconocido queda vacío o pendiente; no se reemplaza por cero, fecha inventada o autorización supuesta.
- Los datos de demostración se identifican y se mantienen separados de los operativos.

### 18.2 Servicios, unidades y formas de liquidación (BASE §39.2)

| Código | Servicio | Plan | Unidad o base | Modalidad ilustrativa | Cargo de ejemplo | Requisito de ejemplo |
|---|---|---|---|---|---|---|
| ELE | Electricidad | ELE-RES — Residencial | kWh | Medido | ARS 4.000 fijos + ARS 100/kWh | Factibilidad y medidor instalado |
| AG | Agua | AG-RES — Residencial | m³ | Medido | ARS 3.000 fijos + ARS 500/m³ | Conexión y medidor instalado |
| GAS | Gas | GAS-RES — Residencial | m³ | Medido; fórmula simplificada | ARS 3.500 fijos + ARS 200/m³ | Aprobación técnica y medición |
| INT | Internet | INT-100 — Fibra 100 | Contrato/mes | Abono no medido | ARS 25.000/mes | Cobertura y equipo instalado |
| TEL | Telefonía | TEL-BAS — Básico | Contrato/mes y minutos | Abono con uso adicional | ARS 6.000/mes + ARS 20/minuto adicional | Línea activa; reglas de uso a definir |
| TV | Televisión | TV-BAS — Básico | Contrato/mes | Abono | ARS 15.000/mes | Cobertura y activación |
| SOC | Servicios sociales | SOC-FAM — Familiar | Grupo/mes | Cobertura familiar ficticia | ARS 8.000/mes | Beneficiarios registrados y cobertura aprobada |
| CEM | Cementerio parque | CEM-PAR — Parcela | Derecho/unidad y mantenimiento | Derecho adquirido más mantenimiento periódico | Sin importe precargado | Unidad disponible, instrumento firmado y reglamento vigente (BASE §90) |
| SAN | Banco de sangre | SAN-CONV — Cobertura por convenio | Grupo/beneficiario | Cobertura administrativa por convenio | ARS 0 al socio en la modalidad financiada por la cooperativa | Convenio vigente y beneficiarios registrados (BASE §91) |

### 18.3 Conceptos de liquidación (BASE §39.3)

| Código | Concepto | Ejemplo de dato | Origen del valor | Validación o decisión pendiente |
|---|---|---|---|---|
| CF-AG | Cargo fijo de agua | ARS 3.000 | Versión de tarifa | Vigencia y aplicabilidad |
| CV-AG | Consumo de agua | 20 m³ × ARS 500 | Consumo aprobado y tarifa | No usar lectura capturada sin validar |
| AB-INT | Abono de internet | ARS 25.000/mes | Plan y tarifa | Prorrateo y fecha de inicio a definir |
| BON-PROM | Bonificación promocional | 10 % sobre abono de internet | Promoción autorizada | Base, duración y compatibilidad |
| INS-INT | Instalación de internet | ARS 30.000 por única vez | Cargo aprobado | Cuándo se devenga y si puede financiarse |
| CUO-VEN | Cuota de venta adicional | ARS 30.000; cuota 1 de 3 | Venta financiada | No duplicar con otra obligación |
| AJU-COM | Ajuste comercial | Importe sujeto a aprobación | Expediente autorizado | Motivo y documentación correctiva |
| TRIB-PEND | Tributos aplicables | Sin valor precargado | Configuración específica | Relevamiento y validación fiscal antes de operar |
| REC-PEND | Recargo por mora | Deshabilitado en la demostración | Política autorizada | Base, tasa, períodos y excepciones a definir |

Ejemplo de promoción: abono ARS 25.000 − bonificación ARS 2.500 = ARS 22.500, sin modelar otros conceptos. La instalación de ARS 30.000 es un cargo distinto; no se suma todos los meses. (Importes del ejemplo de BASE §39.3; el *seed* demo vigente es el de M02 §18: abono ARS 15.000 e instalación ARS 20.000, HUE-SRV-05.)

### 18.4 Medios de cobro y confirmación (BASE §39.4)

| Código | Medio | Valor sugerido al cobrar | Cuándo se registra como confirmado | Control |
|---|---|---|---|---|
| EFE | Efectivo | Saldo pendiente del documento | Cuando el cajero registra y confirma la recepción | Caja abierta y recibo |
| TRA | Transferencia | Saldo pendiente | Cuando se verifica la operación según el circuito acordado | Una imagen de comprobante no confirma por sí sola |
| QR | Pago QR | Saldo pendiente | Confirmación verificable del proveedor | Identificador único y prevención de duplicados |
| TAR | Tarjeta por proveedor integrado | Saldo pendiente | Estado autorizado/confirmado definido para la integración | Rechazos, devoluciones y contracargos |
| DEB | Débito automático | Obligaciones elegibles | Resultado confirmado de la presentación | Rechazos y reintentos controlados |
| REC | Entidad recaudadora externa | Según documento o rendición | Rendición validada según el contrato operativo | Conciliación de bruto, cargos y neto |

La habilitación de cada medio y la contratación de proveedores quedan pendientes; la tabla no afirma integraciones disponibles.

### 18.5 Estados seleccionables de ejemplo (BASE §39.5)

| Entidad | Estados ilustrativos | Control principal |
|---|---|---|
| Solicitud | Borrador; Pendiente de documentación; En evaluación; Aprobada; Rechazada; Cancelada | Aprobar una solicitud no implica servicio instalado |
| Contrato | Solicitado; Pendiente de instalación; Activo; Suspendido; Cerrado | Fechas efectivas y condiciones de cada cambio |
| Lectura | Capturada; Observada; Validada; Reemplazada por corrección trazable | Conservar el registro original |
| Liquidación | Borrador; Con observaciones; Aprobada; Emitida | Evitar modificar el cálculo que respalda un documento definitivo |
| Comprobante | Borrador; Pendiente de emisión; Emitido; Corregido mediante documento vinculado | Separar estado documental de saldo |
| Saldo de obligación | Pendiente; Parcialmente cancelado; Cancelado | Se deriva de movimientos e imputaciones, no de edición libre |
| Pago externo | Iniciado; Pendiente; Confirmado; Rechazado; Devuelto; Con contracargo | Transiciones permitidas según proveedor |
| Orden técnica | Pendiente; Asignada; En ejecución; Visita fallida; Ejecutada; Revisada; Cancelada | Ejecución y revisión son hitos distintos |
| Reclamo | Abierto; Asignado; En tratamiento; Resuelto; Cerrado; Reabierto | Registrar motivo, responsable y cambios |

Los estados definitivos y sus transiciones los fijan T11 y los módulos dueños; la semilla solo carga etiquetas.

### 18.6 Roles y valores sugeridos (BASE §39.6)

| Rol | Acceso de ejemplo | Valores propuestos al operar | Restricción relevante |
|---|---|---|---|
| Atención | Personas, solicitudes y consultas | Canal Presencial; sucursal del operador | No modifica importes emitidos |
| Lecturista | Rutas asignadas y capturas | Ruta asignada; equipo esperado | No cambia tarifas ni aprueba consumos observados |
| Supervisor de consumos | Control de cantidades | Período abierto | Debe justificar correcciones |
| Facturación | Simulación, revisión y emisión | Período abierto y tarifa vigente | No reemite sin controlar el estado previo |
| Cajero | Cobros y cierre de su caja | Caja del turno; saldo pendiente | Anulación con aprobación según reglas |
| Técnico | Órdenes asignadas | Cuadrilla y trabajos asignados | No activa condiciones comerciales excepcionales |
| Tesorería | Conciliación y fondos | Cuenta seleccionada explícitamente | No confunde bruto cobrado con neto acreditado |
| Contabilidad | Asientos e informes | Ejercicio y período habilitados | Bloqueo de períodos cerrados |
| Asociado | Sus cuentas autorizadas | Contrato seleccionado | Sin acceso a terceros no autorizados |

### 18.7 Datos de CFG adicionales para la demo

| Bloque | Datos |
|---|---|
| Geografía | Catálogo de plataforma real (dato público); tenant demo con provincia por defecto Córdoba. Barrios ficticios: "Barrio Demo Norte", "Barrio Demo Sur". Zonas: Z-01 "Zona Norte" (lectura), Z-02 "Zona Sur" (lectura). Calle local: "Calle Ejemplo" (`pendingValidation`). Dirección DIR-DEMO-001 / INM-001, Calle Ejemplo 100, estado `pending` (sin coordenadas reales). |
| Calendario | Calendario nacional de plataforma; feriados ilustrativos recurrentes: 01-01 Año Nuevo, 24-03 Día Nacional de la Memoria por la Verdad y la Justicia, 02-04 Día del Veterano y de los Caídos en la Guerra de Malvinas, 01-05 Día del Trabajador, 25-05 Revolución de Mayo, 20-06 Paso a la Inmortalidad del Gral. Manuel Belgrano, 09-07 Día de la Independencia, 08-12 Inmaculada Concepción de María, 25-12 Navidad (los trasladables y puentes de cada año se cargan desde la fuente oficial). Feriado municipal ficticio: 15-09 "Fiesta Patronal Demo". |
| Índices | Serie propia ficticia "MORA-DEMO" mensual 3,0 %; serie "USD-DEMO" vendedor ARS 1.000,00 al 02-11-2026 (ficticia); "IPC-DEMO" base 100 en 01-2026 con +2 % mensual ficticio. |
| Monedas | ARS (`PES`), USD (`DOL`) [VERIFICAR códigos ARCA]. |
| Fiscal | Condiciones IVA del receptor (ARCA): 1 IVA Responsable Inscripto, 4 Sujeto Exento, 5 Consumidor Final, 6 Responsable Monotributo, 7 Sujeto No Categorizado, 8 Proveedor del Exterior, 9 Cliente del Exterior, 10 IVA Liberado – Ley 19.640, 13 Monotributista Social, 15 IVA No Alcanzado, 16 Monotributo Trabajador Independiente Promovido. Alícuotas IVA (id ARCA): 0 % (3), 2,5 % (9), 5 % (8), 10,5 % (4), 21 % (5), 27 % (6). Tipos de documento (ARCA): 80 CUIT, 86 CUIL, 87 CDI, 89 LE, 90 LC, 94 Pasaporte, 96 DNI, 99 Sin identificar. Todos [VERIFICAR contra `FEParamGet*` vigente al implementar]. Padrón IIBB ficticio con 3 CUIT de prueba. |
| Enumeraciones | Estado civil (soltero/a, casado/a, divorciado/a, viudo/a, unión convivencial); sexo registral (F, M, X); ocupaciones de ejemplo (empleado/a, jubilado/a, comerciante, docente, productor/a agropecuario); vías de ingreso (presencial, teléfono, WhatsApp, portal, app, correo). |
| Campos extra | Cuenta: `nroFichaPapel` (texto). Persona: `lugarTrabajo` (texto) como ejemplo de campo extra del tenant. |
| Vistas | "Mora > 60 días" (cuentas) compartida con rol Gestor de mora. |
| Entidades y sucursales | `COOP` "Cooperativa Demo Ltda." (por defecto) y `MUTUAL` "Mutual Demo", con CUIT ficticios generados por la semilla (no corresponden a contribuyentes reales); sucursales `SUC-01` "Casa central" (COOP) y `SUC-02` "Sucursal Norte" (COOP); puesto `CAJA-01` en SUC-01. |
| Versiones | V1 "Configuración inicial demo" publicada; V2 "Tarifas demo" en revisión (sensible). |

## 19. Migración desde ProCoop

### 19.1 Tablas de configuración y maestros

| Tabla origen (CAT) | Colección destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `VARIABLE` | `parameterValues` (vía `legacyParameterMappings`) | JOB-CFG-10 §9.11; transformación por fila; secretos no se migran en claro | Filas origen = Σ filas por destino |
| `VARIABLE_PMOVIL` | Ídem; textos a diccionario | Separar por `MOD_VAR` | Ídem |
| `MODULOS` | — (códigos de módulo; menú T03; versión T01) | Tabla de correspondencia `COD_MOD` → código de anexo | Todo `COD_MOD` con destino |
| `PAISES` | `countries` (plataforma) | Match por nombre/ISO | Sin países huérfanos referenciados |
| `PROVINC` | `provinces` (plataforma) + `externalCodes` | Match por nombre; conservar `COD_AFIP`, `COD_INAES`, `COD_ENGAS`, `COD_SEN` si difieren | 24 provincias mapeadas |
| `DEPARTA`, `DEPTO` | `departments` | Unificar ambas por nombre + provincia; conservar `COD_INAES`, `COD_ENGAS`, `COD_OCEBA` | Cada `COD_DPT`/`COD_DPTO` con destino |
| `LOCALIDA` | `localities` (plataforma) + overlay del tenant si no existe; `KILOMETROS` → atributo del tenant; `COD_POS` → `postalCodes` | Match nombre + departamento + provincia; no coincidentes → localidad propia `pendingValidation` | % match reportado; ningún domicilio sin localidad |
| `BARRIOS` | `neighborhoods` | Directo | Conteo |
| `CALLES`, `RNQCALL` | `streets` locales → vinculadas/unificadas con nacionales; `streetAliases`; `RUTA`, `ORDEN`, `SECTOR` → M03 | Matching normalizado por localidad; no coincidentes → locales | Domicilios con calle resuelta = total |
| `ZONAS` | `zones`; `IMPORTE`, `REC_BALDIO` → M04 | — | Conteo |
| `DISTRITO_SECCION` | `cadastralDistricts` | — | Conteo |
| `FERIADOS` | `holidays` (calendario del tenant) | Descartar los ya presentes en plataforma; conservar locales | Ningún feriado local perdido |
| `TABINFL`, `INFLACIO` | `economicIndexSeries`/`Values` | Serie propia; sugerir adopción si coincide con IPC oficial | Valores por período iguales |
| `COT_DOL` | Ídem (`exchangeRate`) | `COT_DOLAR`, `COTIZACION_VENTA`, `HOR_COT` | Ídem |
| `TABMORA`, `INDICESMORA` | Ídem (`lateFeeIndex`); `TIPO_FAC` → propósito M08 | `DIA_TAB`/`MES_TAB`/`ANO_TAB` → fecha | Ídem |
| `TIP_MON` | `currencies` + atributos tenant | — | Conteo |
| `SITIVA` | `vatConditions` (plataforma) + atributos de comprobante por defecto (M06) | Match por código ARCA (`AFIP_SIT`, `COD_AFIP`) | Toda persona con condición |
| `ALI_IVA` | `vatRates` + cuentas (M15) | Match por porcentaje | — |
| `ALI_IVA_CF`, `ALI_IBR_CF`, `ALI_IBR_COMP` | M06 | — | — |
| `SITIBR`, `ALI_IBR` | `grossIncomeConditions`, `grossIncomeRates` | — | — |
| `IIBB_LUA` | `taxRegistryEntries` (solo vigentes y período anterior) | — | Conteo por régimen |
| `CVPIIBB` | M06 | — | — |
| `DOCUMENT` | `identityDocumentTypes` | Match por código ARCA | — |
| `EST_CIVIL`, `OCUPACIO` | `enumerationItems` | — | — |
| `ESTADOS` | Etiquetas en `enumerationItems`; semántica en T11 | — | — |
| `DATOSEXT` | `customFieldDefinitions` | `TIP_DATO/LAR_DATO/DEC_DATO/ORD_DATO/UNICO` → tipo y validación; `ELT_DATO/ELE_DATO` → entidad | — |
| `DATOSETB` | `customFields` en documentos dueños | `REF_ELE` → id del documento migrado | Valores = filas |
| `PROPIEITEMS`, `PROPIEITEMS_VALORES`, `PROPIEITEMS_ASIGNACIONES` | `customFieldDefinitions` (enum por propiedad) + `customFields` | `MOSTRAREN`/`USO` → entidad y visibilidad | Ídem |
| `FORMULARIOS_PERSONALIZACIONES` | `formCustomizations` | Solo propiedades `Visible`, `Enabled`, `Text`, `Required` mapeables a campos registrados; resto al reporte | Reporte de no migradas |
| `ABM_VALIDACIONES` | `formCustomizations.allowedEnumCodes`/`required` | `VALORES_SI`/`VALORES_NO` → valores permitidos | Ídem |
| `ENTIDADES`, `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ENTIDACON`, `ENTIDACOU`, `ENTIDACRIT`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN` | No se migran como datos; inventario para verificar que cada grilla tenga pantalla equivalente; `ENTIDACOU` → `savedViews` cuando sea representable | — | Cada `COD_ENT` con pantalla destino |
| `MAPA` | `parameterValues` `cfg.geo.centroMapa`/`zoomInicial` por módulo | — | — |
| `EMPRESAS` | `legalEntities` (RF-CFG-142; antes "T01 (entidades legales del tenant)", corregido por DEC-064 y CTR-DAT-48) | La principal queda `isDefault` | Filas origen = entidades; CUIT sin duplicados |
| `SU_EMPRESAS`, `SU_TIPOEMPLEADOR` | `legalEntities.employer` | Match por CUIT; sin match, entidad nueva | Toda empresa empleadora con entidad |
| `PTOVENTA.SUC_COM` (valores distintos; DEC-098; antes "Sucursales (`EMPRESAS`/`CAJASJP`) [VERIFICAR]") | `branches` | Una candidata por valor; la cooperativa confirma nombre, domicilio, entidad, usos y fusiones; `CAJASJP` se asigna a una sucursal confirmada en la misma revisión (RF-CFG-142) | Cada valor de `SUC_COM` en sucursal confirmada o descartado con motivo; valores de `SUC_COM` en comprobantes ausentes de `PTOVENTA` reportados; puntos de venta y cajas no se migran sin confirmación |
| Tablas oficiales de sueldos (`SU_ACTIVIDADES` … `SU_TRAMAS*`) | §7.17 (plataforma) | Se cargan desde fuente oficial; las de ProCoop solo se comparan | Diferencias reportadas |
| `INTEGRIDAD`, `BLOQUEO_FILAS` | No se migran (reemplazadas por `referencedBy` y control optimista) | — | — |

### 19.2 Coordenadas y domicilios

Las coordenadas existentes (ej. −31.769237, −63.790995) migran a `geoReference.point` con `source = migration`, `precision = manual`, `status = approximate` (no se presume confirmación); quedan en la cola de revisión según política. La relación domicilio ↔ inmueble ↔ contrato la migra M01.

### 19.3 Configuración técnica del `.pro`

| Campo del `.pro` (RN-09 §5.3) | Destino | Motivo |
|---|---|---|
| Servidor SQL, base, puerto | Descartado | Base única compartida (**DEC-110**); conexión por variables de entorno de plataforma (T08). |
| Usuario y contraseña SQL | Descartado | Identidades de servicio; sin usuario compartido (RN-09 §7.6). |
| Punto de venta del puesto | `parameterValues` ámbito `branch` + atributo del dispositivo (M07/M09) | PA-CFG-06. |
| Rutas (DBF heredado, backup, servidor de archivos) | Descartado / almacenamiento de objetos (T08) | — |
| Datos SMTP | Bóveda (T06) + parámetros `com.correo.*` (T09) | Credenciales fuera de archivos. |
| Licencia | T01 (licencias por tenant) | Licenciamiento en servidor, no en cliente. |
| Módulos habilitados | T01 (`licensedCapabilities`/`capabilities`) | — |
| `WEB_*` (FTP o S3, usuario, clave, ruta, horarios, comando P6) | Descartado | Portal sobre el mismo backend (M19); sin sincronización. |
| Prepaga CoopOnline | M07/M19 parámetros + bóveda | — |
| Varios `.pro` por puesto (`frmSelectConfiguracion`) | Descartado | Multitenant real; el tenant sale del token. |

### 19.4 Tablas `*_EXTRAS` (campos de primera clase, no campos extra)

| Tabla | Destino | Anexo |
|---|---|---|
| `PERSONAS_EXTRAS` (lugar, domicilio y teléfono de trabajo, fecha/usuario de control) | Datos laborales y control de datos de la persona | M01 |
| `SERSOC_EXTRAS` (cuotas, unidades, generación distribuida, porcentajes de instalaciones, GIS, plantilla) | Atributos del contrato de servicio | M01 / M02 / M03 |
| `SUMSOC_EXTRAS` (correo/teléfono web, débito Pagos360, n.º de ficha, excluir redondeo) | Atributos de la cuenta | M01 / M07 |
| `CATE_SER_EXTRAS`, `HIS_CATE_SER_EXTRAS` (perfil MikroTik, generador, mínimos de vivienda, código de tarifa, presentación ARBA…) | Atributos de categoría con vigencia | M02 / M04 / M10 / M18 |
| `SERVICIO_EXTRAS`, `HIS_SERVICIO_EXTRAS` (estados por defecto de alta/baja/reconexión/transferencia, carencia, división de consumo…) | Configuración del servicio (vía contributor M02) | M02 |
| `FACTURAS_EXTRAS`, `FAC_EXTRAS`, `ITEMSFAC_EXTRAS`, `ANUITEMSFAC_EXTRAS` | Campos del comprobante y renglón (moneda, cotización, códigos de barra, cos φ, cuadro aplicado) | M05 |
| `PAGOS360_EXTRAS` | Metadata de la transacción de pasarela | M07 / T06 |
| `TECNICA_EXTRAS` | Reclamos por daños, OCEBA | M10 |
| `MOV_PRO_EXTRAS` | Recepción de movimientos de stock | M13 |
| `SU_DESVIC_EXTRAS`, `SU_EMP_EXTRAS`, `SU_EMP_FAMILIARES_EXTRAS`, `SU_EXTRAS`, `SU_TAREAS_EXTRAS` | Conceptos y datos de dominio de sueldos (no son extensiones) | M16 |
| `TICKETS_EXTRAS` | Atributos del ticket | M09 |
| `USERS_EXTRAS` (tipo de diferimiento, no imprimir recibo, prepaga automática) | Preferencias/permisos del usuario | T02 / M07 |
| `ENTIDACOL_EXTRA` | Descartado (columnas SQL del motor de pantallas) | — |

### 19.5 Conciliación

Reporte por tenant: conteos origen/destino por tabla, registros no migrados con motivo, % de match geográfico, filas de `VARIABLE` por destino. La migración es repetible (O11) e idempotente por (tenant, tabla, clave de origen).

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-CFG-01 | DFA M2 "Tablas genéricas" vs CAT | DFA lista `TABLAS`, `TIPO_TAB`, `GRUTAB`, `GRUPTAB`, `ESTATAB`, `COMBOS` como tablas genéricas; en el CAT `TABLAS` no existe (solo `TABLAS_POWERBI`, `PERFILES_TABLAS`), `TIPO_TAB`/`GRUTAB`/`GRUPTAB`/`ESTATAB` pertenecen al tablero (s25) y `COMBOS` a combos de productos (s15). | No hay "tablas genéricas" en CFG: tablero → T10; `COMBOS` → M11; `TABLAS_POWERBI`/`PERFILES_TABLAS` → T10. Las listas genéricas reales se modelan como enumeraciones (RF-CFG-104..107). | CAT (evidencia de esquema) > DFA en estructura. |
| CTR-CFG-02 | DFA M2 vs CAT s4 | `POSTALES` figura como "códigos postales" (DFA) pero en el CAT son empresas de distribución postal. | Códigos postales → `postalCodes` desde `LOCALIDA.COD_POS` (RF-CFG-066); `POSTALES` → M05 (distribución de comprobantes). | CAT > DFA. |
| CTR-CFG-03 | DFA M2 vs CAT s17 | `SECCION` figura como organización territorial (DFA) y en el CAT es sección contable. | `SECCION` → M15; territorio con `ZONAS`/`DISTRITO_SECCION` (RF-CFG-071). | CAT > DFA. |
| CTR-CFG-04 | DFA M2 vs CAT s23 | `CALENDARIO`/`CALENDARIO_TIPO` figuran como días hábiles (DFA) y en el CAT son agenda de usuarios. | Agenda → M09; días hábiles desde `FERIADOS` + calendarios jerárquicos (RF-CFG-084..089). | CAT > DFA. |
| CTR-CFG-05 | Instrucción del solicitante vs Guía §5 | Claves de parámetros en español vs nombres de campos y colecciones en inglés. | Claves semánticas en español camelCase (§14.2); colecciones y campos técnicos en inglés. Son espacios distintos. | Instrucción del solicitante para claves; Guía para el modelo. |
| CTR-CFG-06 | RN-09 §7.4 vs DEC-007 | RN-09 propone migrar solo los parámetros con uso comprobado; DEC-007 deja todo ProCoop en alcance. | Los 1.536 tienen destino en T04b; los 622 sin uso directo quedan "A validar" con equivalencia (RF-CFG-133, PA-CFG-07). | DEC > RN. |
| CTR-CFG-07 | RN-09 / CNX §2.3 vs DEC-110 | Una base por cooperativa (aislamiento físico) vs base compartida con `TenantId`. | Base única con `TenantId` en tablas de negocio y tenant `PLATFORM` (RN-CFG-049, ESC-CFG-06). | DEC > RN/CNX. |
| CTR-CFG-08 | CNX §2.6 vs AGR-009/010 | CNX guarda la configuración como documento `Mixed` editable en el lugar; AGR exige versiones, diff, validación e historia bitemporal. | `parameterDefinitions` tipadas + `parameterValues` bitemporales dentro de `configVersion` (RF-CFG-026..044). | AGR > CNX. |
| CTR-CFG-09 | RN-09 §2.2 vs mejora | `BuscaVariable` da de alta automáticamente la variable "Sin Utilizar" cuando no existe. | Clave no declarada = error de desarrollo (RF-CFG-003, RN-CFG-002). | Mejora de deuda técnica (Guía §1). |
| CTR-CFG-10 | BASE §77 GEO-001 vs disponibilidad de fuentes | Se pide un catálogo nacional completo de calles; las fuentes abiertas son incompletas y los términos de Google impiden la descarga masiva. | Catálogo oficial abierto en plataforma + calles locales del tenant + Google solo para geocodificar y mostrar (RF-CFG-067..080, PA-CFG-02/03/13). | BASE (objetivo) acotado por condiciones legales de proveedores. |
| CTR-CFG-11 | INV `frmVariables` (edición directa) vs BASE §39.1 | En ProCoop el valor se guarda y rige al instante; BASE exige aprobación para la configuración sensible. | Todo cambio por versión; revisión obligatoria según clase (RF-CFG-031, RN-CFG-005/008, PA-CFG-01). | BASE > INV. |
| CTR-CFG-12 | CAT `DEPARTA` vs CAT `DEPTO` | Dos tablas de departamentos con columnas distintas (una con provincia y códigos regulatorios). | Se unifican en `departments` con `externalCodes` (§19.1). | Modelo único (Guía §1, no duplicar). |
| CTR-CFG-13 | CAT `ZONAS` vs BASE §84 | La zona tiene importe y recargo por baldío; BASE separa los maestros territoriales de las reglas económicas. | Zona sin importes; cargos por zona en M04 (RN-CFG-050). | BASE > CAT. |
| CTR-CFG-14 | T04b vs este anexo | T04b nombra `tenantParameters` la colección de valores; este anexo usa `parameterValues`. | Nombre canónico `parameterValues`; `tenantParameters` se lee como sinónimo en T04b. | Anexo dueño del modelo (T04) > catálogo derivado. |
| CTR-CFG-15 | T04b V2 #2309 vs §4 | T04b propone la capability `cfg.calles.crear` para el alta de calles. | Adoptada tal cual en §4 y PAN-CFG-12. | Coherencia entre anexos (sin conflicto real). |
| CTR-CFG-16 | CAT `FORMULARIOS_PERSONALIZACIONES` vs seguridad del modelo | ProCoop permite cambiar cualquier propiedad de cualquier control. | Personalización acotada sobre un registro de formularios; nunca relaja obligatorios (RF-CFG-118/119, RN-CFG-041, PA-CFG-09). | Mejora (BASE §39.1, Guía §5 Zod). |
| CTR-CFG-18 | §2.2, RN-CFG-045 y §19.1 de este anexo vs DEC-064 | El perfil legal y las sucursales se asignaban a T01. | `legalEntities` y `branches` en T04 desde O0 (RF-CFG-134 a 142); T01 conserva los datos de contratación del tenant. | DEC > anexo. |
| CTR-CFG-19 | REQ-DEC-064 (`03-plan-de-olas`) vs T05 COL-CFG-41 | El plan nombra `cuit`, `ivaCondition`, `iibbRegime`, `activityStartDate` en la raíz; T05 referencia `fiscal.cuit`. | Se adopta el subdocumento `fiscal` de T05; los nombres del plan son equivalentes (§7.14). | T05 (modelo canónico) > plan. |
| CTR-CFG-20 | §5.10, §7.9 de este anexo vs M06 | Tablas fiscales y padrones duplicados. | M06 (COL-FIS-15 a 21). | CTR-DAT-13. |
| CTR-CFG-21 | `savedViews` y `sequences` de este anexo vs T03, T11 y M05 | Vistas de grilla y numeración duplicadas. | `dataTableViews` (T03); `numberingSequences` (T11) y `numberSequences` (M05). | CTR-DAT-11, CTR-DAT-16. |
| CTR-CFG-22 | T01 EVT-PLA-21 `pla.branch.created` vs dueño de `branches` | T01 publicaba los eventos de sucursal sin ser dueño. | Los publica T04 (EVT-CFG-20); EVT-PLA-21 queda reemplazado. | DEC-064; dueño del dato. |
| CTR-CFG-23 | RF-CFG-073 vs DEC-046 | Google figuraba como geocodificador. | Georef normaliza y geocodifica; Google para mapa y autocompletado. | DEC > anexo. |
| CTR-CFG-24 | Campos de origen de T04 (`legacyCode` en geografía y tablas fiscales, `legacyRefs` en `economicIndexSeries`) vs T05 §19.1 | Campos de migración ad hoc. | Subdocumento `legacy` (`table`, `key`) en todas las colecciones de T04; `legacyIdMap` de T07 traduce claves. | CTR-DAT-32 |
| CTR-CFG-25 | RF-CFG-142, glosario y §7.13/§19.1 de este anexo vs CAT (DEC-098) | El anexo derivaba las sucursales de `EMPRESAS`/`CAJASJP` [VERIFICAR]; en el CAT `EMPRESAS` solo tiene `COD_EMP`, `DES_EMP` y `CAJASJP` solo `COD_CAJ`, `DES_CAJ`; la única referencia de sucursal es `SUC_COM`, presente en `PTOVENTA` y en los comprobantes. | `branches` se deriva de los valores distintos de `PTOVENTA.SUC_COM` con propuesta revisada y confirmada por la cooperativa (nombres, domicilios, entidad, fusiones) antes de migrar puntos de venta y cajas; las cajas se asignan a sucursal en esa revisión (RF-CFG-142). | DEC > anexo; CAT (evidencia de esquema). |
| CTR-CFG-26 | RF-CFG-018/019, RN-CFG-003 y §14.3 de este anexo vs DEC-096 | Los parámetros no tenían ámbito por entidad jurídica: una política propia de la mutual solo podía cargarse por sucursal o por servicio. | Ámbito `legalEntity` entre `branch` y `tenant`; la entidad sale del contexto o de `legalEntities.resolve`; el valor de sucursal solo aplica si la sucursal es de la entidad del contexto (RF-CFG-018 a 020, §9.2, §14.3). | DEC > anexo. |
| CTR-CFG-17 | CAT `ENTIDADES`/`ENTIDACON`/`ENTIDACOL_EXTRA` vs T08 | Grillas definidas con fragmentos SQL guardados en datos. | Pantallas declaradas en código + vistas guardadas sin consultas libres (RF-CFG-114..117). | T08 (seguridad) > réplica de ProCoop. |

## 21. Preguntas abiertas

### PA-CFG-01 — Revisión obligatoria por clase de cambio
- **Pregunta:** ¿Qué cambios de configuración deben ser aprobados por un usuario distinto del autor antes de publicarse?
- **Contexto:** BASE §39.1 exige aprobación para la configuración sensible, pero no la define. Exigir revisión en todo frena la operación diaria; no exigirla en nada contradice AGR-009.
- **Opciones:**
  - A) Revisión obligatoria por otro usuario para las clases `commercial`, `fiscal` y `security` y para las claves marcadas `sensitive`; `operational`, `presentation` y `technical` se autopublican con auditoría **(Recomendada)** — equilibra control y agilidad.
  - B) Revisión para todo cambio — máxima seguridad; las cooperativas chicas con un solo administrador quedan bloqueadas.
  - C) Revisión opcional, configurable por tenant sin mínimo — flexible, pero permite publicar tarifas sin control.
- **Impacto si no se responde:** se asume A; PRM-CFG-001..003 con esos defaults.
- **Bloquea:** RF-CFG-013, RF-CFG-031, RN-CFG-008, O1.

### PA-CFG-02 — Fuente del catálogo nacional de calles
- **Pregunta:** ¿De qué fuente se arma el catálogo nacional de calles?
- **Contexto:** BASE §77 pide calles de todo el país. Georef (API abierta del Estado) publica calles con alturas, pero con faltantes; Google no permite almacenar su base.
- **Opciones:**
  - A) Georef/BAHRA ingestado en plataforma + calles locales del tenant; Google solo para geocodificar y mostrar **(Recomendada)** — legal, sin costo de licencia; requiere carga local de faltantes.
  - B) Proveedor comercial de cartografía con licencia de almacenamiento — más completo; costo recurrente.
  - C) Solo calles cargadas por cada tenant (como ProCoop) — sin catálogo nacional; no cumple GEO-001.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-067, RF-CFG-068, RN-CFG-029, JOB-CFG-05, O1.
- **Estado:** Respondida por DEC-046 (Georef para normalizar y geocodificar; Google Maps para mapa y autocompletado), coherente con la opción A.

### PA-CFG-03 — Persistencia de resultados de Google
- **Pregunta:** ¿Qué se guarda de cada geocodificación hecha con Google?
- **Contexto:** Las condiciones de Google Maps Platform restringen el almacenamiento de coordenadas y contenido; la operación necesita el punto confirmado del acceso.
- **Opciones:**
  - A) Guardar el punto confirmado por el operador (dato propio) y el `place_id`; caché cruda de respuestas por 30 días; validación con el área legal **(Recomendada)** — cumple condiciones y conserva lo necesario.
  - B) Guardar todas las respuestas sin vencimiento — simple; riesgo de incumplimiento.
  - C) No guardar nada de Google, solo el texto — sin riesgo; obliga a re-geocodificar siempre.
- **Impacto si no se responde:** se asume A; JOB-CFG-14 purga a los 30 días.
- **Bloquea:** RF-CFG-080, JOB-CFG-14, O1.

### PA-CFG-04 — Clave y cuota de Google Maps
- **Pregunta:** ¿Quién paga y administra la clave de Google Maps?
- **Contexto:** BASE §77 indica no presuponer consultas ilimitadas; se relaciona con PA-CFG-P1-03 de T04b.
- **Opciones:**
  - A) Clave de plataforma con cuota por tenant incluida en la licencia, con opción de que el tenant cargue su propia clave en la bóveda **(Recomendada)** — funciona desde el día uno y permite escalar.
  - B) Cada tenant debe cargar su propia clave — sin costo para la plataforma; fricción en el alta.
  - C) Solo clave de plataforma sin límite — simple; costo no acotado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-082, PRM-CFG-017/018, O1.
- **Estado:** Respondida por DEC-020 (clave de plataforma con opción de clave propia del tenant), coherente con la opción A.

### PA-CFG-05 — Mantenimiento de padrones de IIBB
- **Pregunta:** ¿Los padrones fiscales los mantiene la plataforma o cada tenant?
- **Contexto:** Algunos padrones son públicos; otros solo se descargan con las credenciales del agente de recaudación (la cooperativa).
- **Opciones:**
  - A) Mixto: los públicos los ingesta la plataforma; los que requieren credenciales del agente los importa o integra cada tenant **(Recomendada)** — evita duplicar cargas y respeta credenciales.
  - B) Todo lo importa cada tenant — simple; trabajo repetido en cada cooperativa.
  - C) Todo en plataforma con credenciales delegadas — centralizado; problemático legalmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-056, RF-CFG-102, JOB-CFG-08, O4.
- **Estado:** Trasladada a M06 junto con los padrones (CTR-DAT-13).

### PA-CFG-06 — Puesto/terminal como ámbito de configuración
- **Pregunta:** ¿El puesto de trabajo (equipo/terminal) debe ser un ámbito de parámetros?
- **Contexto:** ProCoop resuelve punto de venta, impresora y lectores por `EQUIPOS` y por `.pro` de cada PC; en la web el "puesto" es un navegador.
- **Opciones:**
  - A) No es ámbito: punto de venta por sucursal/caja y periféricos como atributos del dispositivo registrado en M07/M09 **(Recomendada)** — simplifica la precedencia.
  - B) Agregar ámbito `device` entre `user` y `branch` — fiel a ProCoop; complica la resolución y el soporte.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-018, §19.3, O1.

### PA-CFG-07 — Parámetros sin uso directo comprobado
- **Pregunta:** ¿Qué se hace con los 622 parámetros de ProCoop sin uso directo comprobado en el código analizado?
- **Contexto:** RN-09 sugiere no migrarlos; DEC-007 deja todo en alcance.
- **Opciones:**
  - A) Clasificarlos con la cooperativa piloto; mientras tanto quedan "A validar" en T04b con su equivalencia propuesta, y se crean en el registro solo cuando se confirma su uso **(Recomendada)** — no se pierde nada ni se infla el registro.
  - B) Crear todos en el registro desde O1 — cobertura total; ruido y mantenimiento.
  - C) Descartarlos — menos trabajo; contradice DEC-007.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-133, T04b, O11.

### PA-CFG-08 — Límite de retroactividad
- **Pregunta:** ¿Hasta cuántos días hacia atrás puede regir un cambio de configuración?
- **Contexto:** AGR-010 admite cambios con fecha efectiva pasada; sin límite se reabren períodos ya cerrados.
- **Opciones:**
  - A) Con aprobación, hasta 31 días (PRM-CFG-006), sin reescribir documentos; los efectos se corrigen con ajustes del módulo dueño **(Recomendada)**.
  - B) Sin retroactividad — más simple; obliga a ajustes manuales.
  - C) Sin límite con aprobación — flexible; riesgo contable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-035, RN-CFG-010, O1.

### PA-CFG-09 — Alcance de la personalización de formularios
- **Pregunta:** ¿Qué puede cambiar el tenant en los formularios?
- **Contexto:** ProCoop permite modificar cualquier propiedad de cualquier control (`FORMULARIOS_PERSONALIZACIONES`).
- **Opciones:**
  - A) Ocultar campos opcionales, volver obligatorio, solo lectura, default, etiqueta, ayuda, orden y valores permitidos; sin lógica ni scripts **(Recomendada)**.
  - B) Además reglas condicionales simples (mostrar si…) — más potencia; más pruebas.
  - C) Sin personalización — mínimo esfuerzo; pierde una función de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-118, RN-CFG-041, PAN-CFG-22, O2.

### PA-CFG-10 — Modo de adopción de tablas de plataforma
- **Pregunta:** ¿Cómo recibe el tenant las actualizaciones de tablas de plataforma?
- **Contexto:** Las de referencia (geografía, documentos) no deberían requerir acción; las que afectan cálculos (fiscales, índices) sí.
- **Opciones:**
  - A) Tablas de referencia: siempre al día; tablas que afectan cálculos: "seguir con aviso", con aceptación del tenant antes de la vigencia y opción de fijar **(Recomendada)**.
  - B) Todo se aplica automáticamente — sin fricción; cambios fiscales sin revisión del tenant.
  - C) Todo requiere adopción manual — control total; riesgo de quedar desactualizado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-101, RN-CFG-023, PRM-CFG-026/033, O4.

### PA-CFG-11 — Semillas en tenants productivos
- **Pregunta:** ¿Puede aplicarse un paquete semilla a un tenant productivo?
- **Contexto:** BASE §39.1 separa los datos de demostración de los operativos.
- **Opciones:**
  - A) Semillas completas solo en demo/sandbox; en productivo, copia de servicios (M02) o plantillas sin importes **(Recomendada)**.
  - B) Permitir semillas en productivo con confirmación — rápido; riesgo de importes ficticios en operación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-064, RN-CFG-043, PRM-CFG-032, O2.

### PA-CFG-12 — Límite de campos extra
- **Pregunta:** ¿Cuántos campos extra puede definir un tenant por entidad?
- **Contexto:** Sin límite se degradan los índices y las pantallas.
- **Opciones:**
  - A) 50 por entidad incluidos en la licencia **(Recomendada)**.
  - B) 20 por entidad, ampliables con costo.
  - C) Sin límite.
- **Impacto si no se responde:** se asume A (PRM-CFG-027 = 50).
- **Bloquea:** RF-CFG-112, O2.

### PA-CFG-13 — Calles creadas por el tenant
- **Pregunta:** ¿Cómo se tratan las calles que el tenant crea porque no están en el catálogo nacional?
- **Contexto:** Loteos nuevos y zonas rurales no figuran en la fuente; BASE §77 prohíbe sustituirlas por homónimas.
- **Opciones:**
  - A) Locales del tenant en estado "pendiente de validación", utilizables de inmediato, con propuesta opcional a plataforma **(Recomendada)**.
  - B) Requieren aprobación de plataforma antes de usarse — catálogo limpio; bloquea altas.
  - C) Locales sin validación — rápido; duplicados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-069, PAN-CFG-12, O1.

### PA-CFG-14 — Cambio de CUIT o de entidad emisora con documentos emitidos
- **Pregunta:** ¿Qué pasa cuando una entidad jurídica cambia de CUIT o un servicio pasa a ser emitido por otra entidad del tenant?
- **Contexto:** DEC-064 exige `legalEntityId` en todos los documentos económicos; los documentos emitidos no cambian de emisor y la cuenta corriente es por entidad (DEC-087).
- **Opciones:**
  - A) El CUIT no se edita: un CUIT nuevo es una entidad nueva; el cambio de emisora de un servicio tiene fecha efectiva y los saldos anteriores quedan en la entidad original **(Recomendada)** — trazable y sin reescribir documentos.
  - B) Permitir editar el CUIT y reasignar documentos abiertos — menos altas; rompe la trazabilidad fiscal.
  - C) Prohibir cambiar la emisora de un servicio — simple; no cubre escisiones ni fusiones.
- **Impacto si no se responde:** se asume A (RN-CFG-052).
- **Bloquea:** RF-CFG-137, RN-CFG-052, O0.
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante.

### PA-CFG-15 — Cierre de residuales del anexo (pantalla sin ruta, servicios, API, estados y tablas de campos)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** PAN-CFG-31 no citaba ninguna ruta; una fila de servicios internos no tenía nombre técnico; 11 filas de §11 citaban "Usuario autenticado", "Público" o "Token de tercero"; API-CFG-54 no citaba la API destino por ID y API-CFG-58 no tiene API destino; 6 máquinas no declaraban el estado de alta; 38 colecciones del §7 no tenían tabla de campos.
- **Opciones:**
  - A) Citar en PAN-CFG-31 las rutas de los flujos anfitriones de M19; nombrar el servicio `economicIndexes.valueAt({ seriesId, at })`; usar `iam.sesion.autenticada`, `public: true` y `bia.apis.consumir` (T02 PA-IAM-18); citar API-WFL-71 a 73 en API-CFG-54 y declarar que API-CFG-58 se reemplaza por un servicio interno sin API; agregar §8.11 y las tablas de campos de §7.18 (derivadas del texto y de T05, obligatoriedad por regla). **(Recomendada)**.
  - B) Dar a PAN-CFG-31 una ruta propia de modal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** catálogo de pantallas, contratos OpenAPI y diagramas de estados de T04.
- **Estado:** Asumida (DEC-072): opción A.

## 22. Trazabilidad de fuentes

### 22.1 Documento maestro (BASE)

| Fuente | Destino en este anexo |
|---|---|
| §39.1 Reglas de precarga | RF-CFG-059..064, RN-CFG-043/044, §18.1, CU-CFG-12 |
| §39.2 Servicios, unidades y formas de liquidación | RF-CFG-059, §18.2 |
| §39.3 Conceptos de liquidación | RF-CFG-059, RF-CFG-062, §18.3 |
| §39.4 Medios de cobro | RF-CFG-059, §18.4 (habilitación en M07) |
| §39.5 Estados seleccionables | RF-CFG-107, §18.5 (semántica en T11) |
| §39.6 Roles y valores sugeridos | RF-CFG-063, §18.6 (roles en T02) |
| §41 Definiciones pendientes sobre límites y ejemplos | PA-CFG-01, PA-CFG-11; resto delegado: tarifas M04, cobros M07, roles T02 |
| §66 Catálogo de servicios y habilitación por cooperativa | RF-CFG-012, RF-CFG-124/125 (catálogo y habilitación en M02/T01) |
| §71 Pendientes de catálogo, cuentas y lotes | Calendarios y universos: RF-CFG-084..087; resto delegado a M02, M05, M08 |
| §77 Calles y Google Maps (GEO-001..003, CU-GEO-01) | RF-CFG-065..083, RN-CFG-024..029, PAN-CFG-11..15/31/32, CU-GEO-01, CU-CFG-13 |
| §79 Fuentes geográficas (GEO-F1..F6) | RF-CFG-067/068/073/076/080, §13, PA-CFG-02/03 |
| §80 Pendientes de geografía | PA-CFG-02, 03, 04, 13; relación inmueble ↔ dirección en M01; compras por servicio en M12 |
| §81 Configuración independiente y copia entre tenants (COP-001/002, CU-COP-01) | RF-CFG-041, RF-CFG-124, RN-CFG-015/049, CU-COP-01 (dueño M02) |
| §84 Núcleo común y reglas propias de cada servicio | RF-CFG-125, RF-CFG-128, RN-CFG-050, PAN-CFG-29 |
| §93 Reglas transversales por servicio (ESP-001..006) | RF-CFG-044, RF-CFG-101, RF-CFG-126/127/129 |
| §98 Pendientes 0.15 (conservación) | RNF-CFG-004; resto delegado (ARCA M06, cobros M07, capital M17) |
| §106 Pendientes 0.17 (revisión AGR) | AGR-009/010/017 adoptadas en §5; resto delegado a M05/M16 |

### 22.2 Propuestas AGR

| Fuente | Destino |
|---|---|
| AGR-009 Configuración versionada | RF-CFG-026..034, 038..043, 053; RN-CFG-005..009, 013, 014; PAN-CFG-04/05 |
| AGR-010 Historia bitemporal | RF-CFG-020/021, 035..037, 089, 092; RN-CFG-010, 012, 032, 035; PAN-CFG-06 |
| AGR-017 Calendarios y fronteras temporales | RF-CFG-011, 032, 084..088, 096; RN-CFG-011, 030, 031, 033 |
| AGR-018 Migración repetible | RF-CFG-132, §19.5 |

### 22.3 DFA módulo 2 (Parámetros y tablas maestras)

| Ítem | Destino |
|---|---|
| "Tablas del sistema" por dominio (Generales … Herramientas) | PAN-CFG-07 |
| Parámetros del Sistema / Parámetros Externos | RF-CFG-001..025, T04b |
| `PAISES`, `PROVINC`, `LOCALIDA`, `DEPARTA`, `DISTRITO_SECCION` | RF-CFG-065, 071; §19.1 |
| `POSTALES` | CTR-CFG-02 → M05; CP en RF-CFG-066 |
| `CALLES`, `BARRIOS` | RF-CFG-067..071 |
| `ZONAS`, `SECCION` | RF-CFG-071, RN-CFG-050; `SECCION` → M15 (CTR-CFG-03) |
| Catastro Cod/Sec/Man/Par/PH/Lote | Inmueble en M01; distritos en RF-CFG-071 |
| Coordenadas del servicio | RF-CFG-072, §19.2 |
| `CALENDARIO`, `CALENDARIO_TIPO`, `FERIADOS` | RF-CFG-084..089; agenda → M09 (CTR-CFG-04) |
| `INFLACIO`, `TABINFL`, `COT_DOL`, `TABMORA`, `INDICESMORA` | RF-CFG-090..096 |
| `SITIVA`, `ALI_IVA*`, `SITIBR`, `ALI_IBR*`, `IIBB_LUA`, `CVPIIBB` | RF-CFG-097..102; `CVPIIBB` → M06 |
| `TABLAS`, `TIPO_TAB`, `GRUTAB`, `GRUPTAB`, `ESTATAB`, `COMBOS` | CTR-CFG-01 (T10, M11) |
| Mejora: editor uniforme con búsqueda y vigencias | RF-CFG-045..053, PAN-CFG-08 |
| Mejora: importación de padrones por archivo | RF-CFG-054..058, PAN-CFG-09/10 |
| Mejora: versionado con fecha de vigencia | RF-CFG-026..044 |
| DFA §32 campos configurables tipados y vigencias | RF-CFG-047, 108..113 |

### 22.4 REL §5 y RN-09

| Fuente | Destino |
|---|---|
| REL §5 (tablas por dominio, cuadros nombrados por norma) | PAN-CFG-07, RF-CFG-044, RN-CFG-016 |
| RN-09 §1 Resumen | RF-CFG-014, 120, 133 |
| RN-09 §2.1 Modelo `VARIABLE` (`TIP_VAR`, `TIP_CTRL`, `CONF_CTRL`, tipo `P`) | RF-CFG-004, 007, 008, 104; RN-CFG-001 |
| RN-09 §2.2 Lectura (`BuscaVariable`, caché, `GetSetBooleanProperty`) | RF-CFG-003, 022, 024; RN-CFG-002, 004; CTR-CFG-09 |
| RN-09 §2.3 Alta y migración del catálogo | RF-CFG-002, 015 |
| RN-09 §2.4 Edición por el usuario | RF-CFG-005, 006, 026; RN-CFG-005; CTR-CFG-11 |
| RN-09 §3 Jerarquía de valores | RF-CFG-018/019, RN-CFG-003, 045 |
| RN-09 §4.1 Contraseñas maestras | RF-CFG-122 |
| RN-09 §4.2 Perfiles y permisos | §4 (capabilities); T02 |
| RN-09 §4.3 Auditoría / envío a casillas externas | RF-CFG-042, RN-CFG-046 |
| RN-09 §5.2 Desfase de reloj | RN-CFG-033 |
| RN-09 §5.3 `.pro` | RF-CFG-120, §19.3 |
| RN-09 §5.4 Módulos habilitados | RF-CFG-012, RN-CFG-018 |
| RN-09 §5.5 Motor de pantallas | RF-CFG-114..117 |
| RN-09 §5.7 Migraciones al iniciar sesión | RF-CFG-123 |
| RN-09 §6.1..6.4 Catálogo por módulo | §14.4, T04b partes 1–4, RF-CFG-130/131 |
| RN-09 §7.1..7.9 Recomendaciones | RF-CFG-001, 009, 016..019, 122, 123, 130; RN-CFG-017 |
| RN-09 §8 Pendientes | PA-CFG-07; [VERIFICAR] en RN-CFG-021, 031 |

### 22.5 Catálogo de tablas (CAT §28, §29, §30)

| Tabla | Destino |
|---|---|
| `ABM_VALIDACIONES` | RF-CFG-118, §19.1 |
| `ARCHIVOS`, `TIP_ARC` | T06 (definiciones de archivos de intercambio) |
| `DATOSETB`, `DATOSEXT` | RF-CFG-108..110, §19.1 |
| `DATOSINT`, `FORMAINT`, `MODEINT`, `SERVINT`, `TIPOMOD` | T06 (modelos de interfaz de archivos) |
| `EMPRESAS` | RF-CFG-134, RF-CFG-142, §7.14, §19.1 (antes T01; DEC-064) |
| `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ENTIDACON`, `ENTIDACRIT`, `ENTIDADES`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN` | RF-CFG-114..117, CTR-CFG-17 |
| `ENTIDACOU` | RF-CFG-115, RN-CFG-042 |
| `ENTIDADCIR` | T11 (documentos circulados) |
| `ENTIDA_ESTADOS` | RF-CFG-107 (etiquetas); semántica en T11 |
| `EXPORTADOR`, `EXPORTADOR_COLUMNAS` | T10/T06 (exportaciones configurables) |
| `FORMULARIOS_PERSONALIZACIONES` | RF-CFG-118, CTR-CFG-16 |
| `PROPIEITEMS`, `PROPIEITEMS_ASIGNACIONES`, `PROPIEITEMS_VALORES` | RF-CFG-108/109, §19.1 |
| `REPORTES` | T10 (reemplazo de reportes por equipo) |
| `VARIABLE`, `VARIABLE_PMOVIL` | RF-CFG-001..017, 130..133; JOB-CFG-10; T04b |
| `ADJUNTOS`, `PROCOOPAR_ADJUNTOS` | T11; T01 (novedades del proveedor) |
| `BLOQUEO_FILAS`, `INTEGRIDAD` | RF-CFG-048, §19.1 (reemplazo) |
| `EQUIPOS` | M07/M09 (PA-CFG-06) |
| `PTOVENTA` (columna `SUC_COM`) | RF-CFG-142, §7.15 `legacy`, §19.1, CTR-CFG-25 (origen de `branches`, DEC-098); el resto de la tabla, M06 (`pointsOfSale`) |
| `CAJASJP` | M07 (`cashRegisters`); asignación a sucursal en la revisión de RF-CFG-142 (DEC-098) |
| `ESTADOS` | RF-CFG-106/107 |
| `MODULOS` | T01/T03, §19.1 |
| `OPERACIONES`, `OPE_COM` | M05 |
| `RELACION_ENTIDADES` | T11 |
| `BARRIOS`, `CALLES`, `RNQCALL`, `DEPARTA`, `DEPTO`, `DISTRITO_SECCION`, `LOCALIDA`, `PAISES`, `PROVINC`, `ZONAS` | RF-CFG-065..071, RN-CFG-050, §19.1 |
| `DOCUMENT`, `EST_CIVIL`, `OCUPACIO` | RF-CFG-100, 106 |
| `FERIADOS` | RF-CFG-085 |
| `MAPA` | RF-CFG-081 |
| Otras tablas del CAT usadas: `TIP_MON` (RF-CFG-095), `SITIVA`/`ALI_IVA`/`ALI_IVA_CF`/`SITIBR`/`ALI_IBR`/`ALI_IBR_CF`/`ALI_IBR_COMP`/`IIBB_LUA` (RF-CFG-097..102), `*_EXTRAS` (§19.4) | Ver filas indicadas |

### 22.6 Inventario de formularios (`Configuracion.md`)

| Formularios | Destino |
|---|---|
| `abm_Base`, `abm_Base_Simple`, `abm_Base_SoloDetalle` | RF-CFG-046, PAN-CFG-08 |
| `frmVariables`, `frmVariables_PMovil`, `txtModulos` | PAN-CFG-02/03 |
| `frmComparadorCambios`, `frmActualizar` | PAN-CFG-05 |
| `frmImportadorAbm`, `frmImportacionMasiva`, `frmResultadoImportacion`, `frmResultadoExportacion` | RF-CFG-054..058, PAN-CFG-09 |
| `abm_Provinc`, `abm_deptos`, `abm_localidad`, `abm_barrios`, `abm_Calle`, `txtCalles` | PAN-CFG-11..13 |
| `Domicilio` (parte geográfica), `ctrlMapa`, `ctrlMapaBase`, `ctrlMapaBing`, `MapScripting`, `frmVisorMapa` | PAN-CFG-14 |
| `abm_Feriados`, `ctrlFechaDinamica`, `txtFecha_Popup` | PAN-CFG-16 |
| `abm_Tip_Mon`, `abm_Tip_Mon_Cot` | PAN-CFG-18 |
| `abm_sit_iva`, `abm_ali_iva`, `abm_Sit_Ibr`, `abm_ali_Ibr`, `abm_ali_ibr_comp`, `AliIva_SitIva`, `AliIbr_SitIbr`, `ctrlEnargasTablas`, `frmEnargasTablas` | PAN-CFG-19 |
| `abm_DatosExtra`, `abm_propieItems`, `abm_propieitems_valores`, `PropiedadesPersonalizadas`, `SelectorPropiedadObjeto` | PAN-CFG-21 |
| `frmTransicion_Vistas`, `frmTransicion_Vistas_Detalle`, `Columna_Grilla`, `FormatoCondicional_Columna`, `frmVistaResultados` | PAN-CFG-23 |
| `frm_Consulta_Referencias` | PAN-CFG-30 |
| `frmUnificarDomicilio` | RF-CFG-049 |
| `GenericGridCollectionEditor`, `FrmGridCollectionEditor`, `CollectionEditorTitleContext` | PAN-CFG-02 (editor de listas) |
| `frmRecuperaConfiguracion` | PAN-CFG-28 |
| `frmVisorPropiedades` | PAN-CFG-03 |
| `SelectorSexo`, `frmSelectCombo`, `abm_Viaingte` | PAN-CFG-20 |
| `frmSelectorCadenaFormato` | RF-CFG-004 (tipo con formato) |
| `Botones_Abm`, `Ok_Cancel`, controles `txt*`, `ConsultaGenerica*`, `frmSeleccionElementos*`, `frmSelectFecha*`, `frmText*`, `WaitForm`, `GroupBox*`, `SpinEdit`, `TextEdit`, `Calc_Touch`, `Iconos` | T03 (componentes); `grdGrilla_old` descartado (obsoleto) |
| `abm_Perfiles`, `abm_Users`, `frmAuditoriaLogin`, `frmChangePass`, `frmBuscaBotones` | T02 |
| `abm_Plantillas`, `abm_Plantillas_WhatsApp`, `abm_VariablePlant`, `frmPlantillaEditor`, `frmCorreo*`, `abm_CorreoInterno`, `frmNotificacion`, `frm_VisorMensajes`, `frmEnvioMail`, `frmEnviar_SMS`, `frmEnvioWhatsApp`, `frmEnvioWhatsAppTrii`, `frmAvisosTelefonos`, `frmAvisosTelefonosContactos`, `abm_Web_Novedades`, `ctrlRichEdit`, `frmParam_SMS` | T09 |
| `frmEditorReportes`, `frmListadosPersonalizados`, `frmListadosPersonalizadosParametros`, `frmInformeSimple`, `frmProcesosPersonalizados`, `abm_Reportes`, `Tablas_PowerBi`, `PrintPreview`, `frmPrintPreview` | T10 |
| `frmAdjuntos*`, `frmEliminarAdjuntos`, `frmAdjuntarPdfs`, firmas, `frmAutorizaciones`, `abm_TareasProgramadas*`, `frmProcesoAutomatico`, `frmProgressBar`, `frmProgressBarWithLog` | T11 |
| `frmProcesos`, `frmChequearVersion`, `frmLoNuevo`, `frmSoporteIP`, `frmAdjuntoProcoopar`, `frmBaseDatos`, `frmOpcionesEspeciales`, `abm_PtoVenta` | T01/T08 (`abm_PtoVenta` también M06); parte funcional de `frmOpcionesEspeciales` en PAN-CFG-01/24 |
| `abm_Personas`, `BuscadorInfoSocio*`, `Consulta_InfoSocios*`, `ConsultaPersonas`, `frmSeleccionarPersona*`, `frmSeleccionarInmueble`, `frmSeleccionar_InfoSocios*`, `ctrlDomicilios`, `DatosDomicilio`, `ConsultaDomicilio`, `ctrlCuentaTitular`, `txtPersonas`, `FiltraCuentas`, `frmFiltrosCuentas`, `frmEscanerCodigoDNI`, `WebCam*`, `frmWebcamFoto`, `ctrCuit`, `listMails` | M01 (usa PAN-CFG-14) |
| `abm_Servicio`, `abm_Servicio_Propiedad`, `abm_Servicio_OT`, `abm_Servicio_TarAdhe`, `abm_AltasEau`, `ComboBox_PropieSer`, `ctrlFiltraSersoc`, `abm_responsa`, `abm_Propieda` [VERIFICAR] | M02 |
| `abm_Servicio_Categorias`, `abm_Servicio_Cattarif`, `abm_Cuadros`, `abm_CargosAdicionales`, `abm_CateSer_Coeficientes`, `frm_Tarifas_Masiva`, `frmImportarTarifas`, `frmActualizarTarifaConOtra`, `frmModificarTarifaServicio`, `frmEditorFormulas`, `ctrlExpressionPanel`, `ctrlUnboundColumnExpressionEditorForm`, `frmAsistenteFormulas`, `abm_Factor_Cal` | M04 |
| `abm_Telemedicion`, `abm_Captores`, `Recorridos`, `frmBusquedaRecorridos`, `frmResultadosConsumos`, `listDemandas` | M03 |
| `abm_comprob`, `abm_ItemsOrd`, `abm_Operaciones`, `ctrlSelectorComprobante`, `frmConsultaComprobantes` | M05 |
| `abm_conceptos_tasas`, `frmDefinirIngresoBruto` (padrón en PAN-CFG-10), `frmAlicuotaDeterminada`, `frmLiquidacionPercepciones`, `frmLiquidacionPercepcionesBsAs`, `frmResultadosCuotaTerceros`, `frmResultadosConceptosPRCAGAS`, `frmEnargasConceptos`, `frmEnargasConceptosConfig` | M06 |
| `ctrlLectora`, `txtLectora`, `CR55API`, `ExcellaFunctions`, `CEIIMAGE*`, `abm_Equipos` | M07 (`abm_Equipos` también M09) |
| `frmAgenda`, `frmCalendario`, `abm_Requisitos`, `abm_RequisitosItems`, `frmRequisitos`, `frmRequisito_*`, `frmPTramites`, `frmDatosTicketsSimple`, `WIA` | M09 |
| `Consulta_PuntoRed*`, `DatosInternet`, `Grilla_OT_Reporte`, `frmResultadoImportacionTelMovil` | M10 |
| `abm_prod_ser`, `abm_prod_ser_combos`, `abm_prod_ser_rec_des`, `ConsultaProducto`, `SeleccionarProducto`, `frm_ActualizarPrecios`, `frmSeleccionar_Presupuesto`, `frmUbicacionesStock*`, `frmProd_Ser_Trazabilidad`, `frmIngresoTraza`, `abm_Bienes_Uso`, `abm_bienes_uso_deduc`, `frmProdSerUbicacion_Item`, `DisponibilidadProducto`, `abm_ProdPues` [VERIFICAR] | M11/M13 |
| `abm_Proveed`, `abm_ProveedAut`, `abm_Proveed_cbu`, `SelectorProveedor`, `ConsultaProveedores`, `frmSeleccionarProveedores`, `frmProveed_Valoraciones`, `abm_Rets_Tipo` | M12; `frmProveedorPassGenerica` descartado (contraseña genérica, seguridad) |
| `abm_bankos`, `abm_bankos_Chequeras`, `frmImportarMovTesoreria` | M14 |
| `ConsultaCuentas`, `SelectorCuenta`, `grdSecciones`, `abm_rps` [VERIFICAR] | M15 |
| `frmCapitalManual`, `frmSelectFechaCapital`, `frmMigracionCapital` | M17 (`frmMigracionCapital` también T07) |
| `abm_Movil`, `abm_Combustible`, `frm_PreciosViv` | M18 |
| `WaitForm_AutoGestion` | M19 |
| `frmExportacionArchivos`, `frmImportacionArchivos` | T06 (importadores de maestros en PAN-CFG-09/10) |
| Tipos auxiliares (delegados, eventargs, clases generadas por el compilador) | Descartado: no son funcionales |
| Cadenas SQL embebidas: reseteo de `COMPPOS`/`PTOVENTA`, tablas ad hoc `_ApExtraord2021`/`_bonifTemp`, listado de `sysdatabases` | Descartado: mantenimiento ad hoc sin requisito funcional |
| Cadenas SQL: `DELETE` de `CAPITAL`; `UPDATE` de `SERSOC`; fragmentos HTML | M17; M02; M19 |

### 22.7 Referencia Connectia (CNX)

| Fuente | Destino |
|---|---|
| §2.3 Multiempresa | CTR-CFG-07 (DEC-110) |
| §2.4 Licenciamiento y permisos en tres capas | RF-CFG-012, RN-CFG-018 (T01/T02) |
| §2.6 Patrones de backend (config `Mixed`, jobs) | CTR-CFG-08, RF-CFG-093 |
| §4.2 Layout y patrones | §10 (PAN-CFG-01..32), RF-CFG-117 |
| §4.3 Dos niveles (plataforma/tenant) | PAN-CFG-24..27, §14.3 |
| §4.4 Pantallas del admin | PAN-CFG-01..30 |
| §4.5 BI | §15 (T10) |
| §4.6 Lo que el admin hace mal | RF-CFG-014, 054, 113, 121 |

### 22.8 Catálogo de parámetros (T04b)

| Fuente | Destino |
|---|---|
| T04b partes 1–4 (1.536 parámetros) | §14.4, RF-CFG-130..133 |
| V2 #2309 `cfg.calles.crear` | §4, PAN-CFG-12, CTR-CFG-15 |
| V2 #2673 secuencias de titulares (PA-CFG-P1-01) | §14.7 |
| V2 #3039 contador de lote FECESCOR | §14.7 (`sequences`) |
| V2 #383 | Descartado (reemplazado por 742, RF-CFG-015) |

### 22.9 Decisiones y contraposiciones del modelo de datos

| Fuente | Destino |
|---|---|
| DEC-064 (varias entidades jurídicas por tenant) y REQ-DEC-064 / PRO-O0-13 del plan de olas | RF-CFG-134 a 142, RN-CFG-051 a 055, §7.14 a §7.16, §8.9, §9.16, §9.17, PAN-CFG-33 a 35, API-CFG-55 a 58, EVT-CFG-19/20, PRM-CFG-039/040, ESC-CFG-31 a 35, CTR-CFG-18/19/22, PA-CFG-14 |
| DEC-046 (Georef y Google Maps) | RF-CFG-067, 068, 073, 074; CTR-CFG-23; PA-CFG-02 |
| DEC-020 (claves de mapas por plataforma con opción propia) | RF-CFG-082; PA-CFG-04 |
| CTR-DAT-06 (`employers` → `legalEntities.employer`) | RF-CFG-139, §7.14 |
| CTR-DAT-11 (`savedViews` → `dataTableViews` T03) | §2.1 fila 12, RF-CFG-115, §7.11 |
| CTR-DAT-13 (tablas fiscales → M06) | §2.1 fila 10, §5.10, §7.9, CTR-CFG-20 |
| CTR-DAT-16 (`sequences` → T11/M05) | §14.7, API-CFG-54 |
| CTR-DAT-48 (`legalEntities` es de T04) | RF-CFG-142, §19.1 |
| CTR-DAT-73 (tablas legales de M16 §7.45) | RF-CFG-143, §7.17 |
