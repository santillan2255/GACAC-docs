# T04b CFG — Catálogo de parámetros ProCoop → CoopApps (Parte 1: SISTEMA, CONFIGURACION y TITULARES)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Anexo padre | T04 CFG — Configuración versionada, parámetros, tablas maestras, geografía (`anexos/T04-CFG-configuracion-parametros-maestros.md`) |
| Alcance de esta parte | Módulos ProCoop `SISTEMA` (8), `CONFIGURACION` (107) y `TITULARES` (312): **427 parámetros** |
| Fuente | RN-09 `procoop-relevamiento/reglas-negocio/09-parametros-y-configuracion.md` §2 (almacenamiento y lectura) y §6.4 (listado por módulo, tablas `VARIABLE` y `VARIABLE_PMOVIL`) |
| Olas | O0–O1 (motor de parámetros, diccionario, marca, bóveda); cada parámetro se activa en la ola del anexo destino |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Propósito

Convertir **cada** parámetro `Busca_V2_*` de ProCoop de los módulos SISTEMA, CONFIGURACION y TITULARES en su destino en CoopApps, de modo que:

1. Ningún comportamiento parametrizable de ProCoop se pierda (DEC-007, regla de oro de la guía).
2. Los parámetros que siguen siendo del tenant se crean como **parámetros tipados con clave semántica** (`PRM-*`) en el motor de configuración versionada de T04 (con `validFrom`, auditoría, validación Zod, valor por defecto y ámbito), en lugar de códigos numéricos en una tabla clave/valor.
3. Los que no deben ser parámetros (textos de UI, marca, credenciales, infraestructura, deuda técnica de escritorio) se derivan al mecanismo correcto o se descartan con motivo.
4. Los anexos de módulo (M01, M02, M04, M05, M06, M07, M08, M17, M19, T02, T03, T06, T09…) incorporen en su sección 14 los PRM aquí asignados y en su sección 6 las reglas de negocio que revelan.

## 2. Cómo funcionaba en ProCoop (resumen de RN-09 §2–§4 relevante para la conversión)

- Tabla `VARIABLE` (global de la cooperativa: una base = una cooperativa) y `VARIABLE_PMOVIL` (parámetros de las apps externas, con canal `MOD_VAR`: 1 CoopOnline, 2 PMovil/Captor, 3 PWeb). El mismo número puede existir en ambas tablas con significados distintos (ej. V2 #27, #32, #73): en este catálogo se tratan como filas distintas.
- Tres columnas de valor en paralelo (`CARACTER`, `NUMERICA`, `LOGICA`) y `TIP_VAR` (C, N, L, E, F —fecha guardada como texto—, P mixto). El editor (`TIP_CTRL`) puede ser FK a tabla (1), lista cerrada (2), ruta (5) o cuenta contable (6).
- Lectura con caché por proceso; **si la variable no existe se inserta sola** ("Sin Utilizar"): un número mal tipeado crea basura. Escritura con `Actu_V2` y auditoría genérica (`AUDITORIA`), sin historial de valores, sin rangos ni dependencias (solo `Valida_V2`).
- Alta/migración del catálogo en cada actualización de versión (`GetChequeoVariables` → `ChequearVariable`), sin pisar el valor configurado.
- De los 427 parámetros de esta parte, 266 tienen lectura directa en el código descompilado; el resto lo usan CoopOnline/PMovil/PWeb, el Agente, enums o están obsoletos.

**Mejoras obligatorias en CoopApps (aplican a todos los PRM de este catálogo):**

| ProCoop | CoopApps (T04) |
|---|---|
| Código numérico sin semántica | Clave semántica `modulo.recurso.atributo` (camelCase), única por tenant |
| Tres columnas de valor + `TIP_VAR` | Un valor tipado validado con esquema Zod compartido (`boolean`, `integer`, `decimal`, `percent`, `money`, `string`, `enum`, `date`, `url`, `email[]`, `ref:<colección>`, `dictKey`, `secretRef`, `geoPoint`, `object`) |
| Autoinserción de variables inexistentes | Lectura de clave no declarada = error de programación (falla en CI); catálogo declarativo versionado en código |
| Sin historial | Versionado con `validFrom`/`validTo`, `recordedAt`, autor, motivo; publicación de configuración (borrador → publicado) |
| Sin rangos ni dependencias | `min`/`max`, `dependsOn` (ej. 3103 requiere 2821), reglas de coherencia |
| Global por base | Ámbito explícito: `plataforma`, `tenant`, `servicio`, `categoría`, `producto`, `ente`, `sucursal`, `usuario`, con herencia (el más específico prevalece) |
| Credenciales en la tabla o en el `.pro` | Bóveda de credenciales por tenant (T06); el parámetro solo guarda `secretRef` |

## 3. Criterios de decisión

| Decisión | Significado | Qué se crea |
|---|---|---|
| **Migrar** | Parámetro funcional del tenant que conserva sentido. | PRM con clave semántica tipada en el anexo destino (sección 14 del anexo). |
| **Migrar-servicio** | El comportamiento depende del servicio, la categoría, el cuadro tarifario o el producto: deja de ser global. | Atributo de configuración en la entidad de catálogo (M02) o tarifa (M04); el PRM documenta el atributo y su default. |
| **Diccionario** | Texto personalizable de UI (etiqueta, título, leyenda). | Clave de diccionario `dict:<clave>` sobrescribible por tenant (T03). PRM-UXD. |
| **Marca** | Logo, colores, identidad visual. | Branding runtime del tenant (T03). |
| **Plataforma** | Lo administra la plataforma SaaS, no el tenant (infraestructura, backups, observabilidad, identidad legal ligada a licencia). | PRM-PLA de ámbito plataforma o atributo del tenant gestionado por plataforma (T01). |
| **Bóveda** | Credencial, clave de API, certificado o PIN. | Ranura de secreto en la bóveda de integraciones (T06); el parámetro guarda solo `secretRef`. **Los valores no se transcriben ni se migran en claro.** |
| **Reemplazado** | El comportamiento lo resuelve un mecanismo nuevo (se indica cuál). | Ningún PRM; se referencia el mecanismo y su anexo. |
| **Descartar** | Técnico de escritorio, obsoleto, inseguro o sin uso (se indica motivo). | Nada; queda registrado para trazabilidad. |

## 4. Leyenda de columnas

- **V2 #**: `COD_VAR` de ProCoop. **Tabla/canal**: `VAR` = `VARIABLE`; `VAR_PMOVIL/<canal>` = `VARIABLE_PMOVIL` con canal CoopOnline, PMovil o PWeb.
- **Tipo**: tipo ProCoop (Lógico, Entero, Numérico, Texto, Fecha texto, Mixto, Lista, FK `TABLA.CAMPO`).
- **Uso en código (resumido)**: clase.método principal; "sin lectura" = no se lee por número literal en RN/Cfg/PN (lo usan apps externas, Agente, enums o está obsoleto).
- **PRM-ID**: `PRM-<COD anexo destino>-P1-NNN`, numerado por código en orden de aparición dentro de esta parte. "(= V2 #n)" indica que la fila se fusiona en el PRM de otra fila. "—" para Reemplazado/Descartar.
- **Clave nueva**: clave semántica camelCase con prefijo del módulo dueño (`per.`, `cat.`, `tar.`, `fac.`, `fis.`, `cob.`, `mor.`, `crm.`, `tec.`, `med.`, `ven.`, `stk.`, `tes.`, `con.`, `sue.`, `ins.`, `soc.`, `por.`, `pla.`, `iam.`, `com.`, `int.`, `bia.`, `mig.`). Las de diccionario llevan prefijo `dict:`.
- **Tipo nuevo**: tipo del esquema Zod (ver §2). **Ámbito**: nivel donde se configura (con herencia). **Default sugerido**: valor inicial para un tenant nuevo (los valores reales del tenant migrado se cargan por T07).
- **Anexo destino**: código de anexo de la guía (M01…M19, T01…T11).

## 5. Módulo SISTEMA (8 parámetros)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| -1 | VAR | Mixto (Lógico + Texto destinatario) | Enviar errores por mail | Excepcion.GrabarExcepcion / EnviarMailError | Plataforma: observabilidad centralizada (errores con `requestId`, alertas a guardia de plataforma) | PRM-PLA-P1-001 | pla.observabilidad.alertasErrores | object {habilitado: boolean, destinatarios: email[]} | plataforma | habilitado=true; destinatarios=guardia plataforma | T01 / T08 |
| 1 | VAR | Lógico | Utilizar Venta de Prepaga en otro dominio | clsPMovil_Base.Sincroniza_Tablas | Reemplazado: portal/PWA del socio en el mismo backend con dominio propio del tenant (custom domain T01); no hay base web separada que sincronizar | — | — | — | — | — | M19 / T01 |
| 2 | VAR | Lógico | CheckForIllegalCrossThreadCalls | Inicio_ProCoop (hilos WinForms) | Descartar: técnico de escritorio WinForms | — | — | — | — | — | — |
| 2085 | VAR | Mixto: Texto | Versión de la Capa de Datos | clsChequeos_Estructura.RequiereChequearEstructura | Reemplazado: migraciones de esquema versionadas ejecutadas por el pipeline de despliegue de plataforma | — | — | — | — | — | T01 / T08 |
| 2459 | VAR | Lógico | Cerrar formulario de reporte al imprimir | frmPrintPreview.Cerrar_PrintPreview | Descartar: comportamiento de visor de escritorio; en web el PDF se abre en pestaña/descarga | — | — | — | — | — | — |
| 2617 | VAR | Texto (ruta) | Ruta para archivos adjuntos | Nucleo.GetPathAdjuntos | Reemplazado: almacenamiento de objetos privado con URL firmadas y expediente documental | — | — | — | — | — | T11 |
| 2895 | VAR | Lógico | No mostrar íconos al cargar adjuntos | clsAdjuntos.GetFileInfo | Descartar: optimización de rendimiento de escritorio | — | — | — | — | — | — |
| 2931 | VAR | Texto (ruta) | Ruta para certificados de firma digital | clsFirmaDigital.ProcesarLote_FirmaInterna; clsCertificados | Bóveda: certificado de firma digital del tenant en bóveda; no transcribir | PRM-INT-P1-001 | int.firmaDigital.certificado | secretRef | tenant | — (carga del tenant) | T06 |

## 6. Módulo CONFIGURACION (107 parámetros)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 5 | VAR_PMOVIL/CoopOnline | Texto | Personalizar texto del botón agregar cuentas | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-001 | dict:por.vincularCuenta.botonAgregar | dictKey | tenant | "Agregar cuenta" | T03 / M19 |
| 6 | VAR_PMOVIL/CoopOnline | Texto | Personalizar título de la vista agregar cuenta | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-002 | dict:por.vincularCuenta.titulo | dictKey | tenant | "Vincular una cuenta" | T03 / M19 |
| 7 | VAR_PMOVIL/CoopOnline | Texto | Personalizar texto del input código socio | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-003 | dict:por.vincularCuenta.campoNumeroSocio | dictKey | tenant | "Número de asociado" | T03 / M19 |
| 8 | VAR_PMOVIL/CoopOnline | Texto | Personalizar texto del input clave/suministro | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-004 | dict:por.vincularCuenta.campoClaveSuministro | dictKey | tenant | "Número de suministro" | T03 / M19 |
| 9 | VAR_PMOVIL/CoopOnline | Texto | Personalizar texto de la observación en agregar cuenta | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-005 | dict:por.vincularCuenta.ayuda | dictKey | tenant | Texto de ayuda estándar | T03 / M19 |
| 34 | VAR_PMOVIL/CoopOnline | Texto | Link de referencia en el Login Web | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-001 | por.login.linkReferenciaUrl | url | tenant | vacío (no se muestra) | M19 |
| 35 | VAR_PMOVIL/CoopOnline | Texto | Personalizar texto de la observación en facturas | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-006 | dict:por.comprobantes.leyendaListado | dictKey | tenant | vacío | T03 / M19 |
| 40 | VAR_PMOVIL/CoopOnline | Lógico | Habilitar CIDI en la Web | sin lectura (CoopOnline) | Migrar: login del socio con identidad digital provincial (CiDi Córdoba) como proveedor federado | PRM-IAM-P1-001 | iam.socios.loginCidiHabilitado | boolean | tenant | false | T02 / T06 |
| 41 | VAR_PMOVIL/PWeb | Entero | Perfil para empleados NO usuarios del sistema | clsProcoop_Integra.GetUserCoop / GetUserCoopDirecto | Migrar: rol por defecto asignado a empleados que solo usan la PWA de empleado (sin acceso admin) | PRM-IAM-P1-002 | iam.empleados.rolPorDefectoPwa | ref:roles | tenant | rol "Empleado (portal)" | T02 |
| 42 | VAR_PMOVIL/CoopOnline | Texto | Descripción del concepto al generar solicitud de prepaga en SIRO | clsHelipagos/clsSiPago/clsSIRO.Crear_PAGOS360 | Migrar: plantilla de descripción del concepto en solicitudes de pago a pasarelas | PRM-COB-P1-001 | cob.pasarelas.descripcionConceptoPago | string (plantilla con variables {cuenta},{periodo}) | tenant (override por pasarela) | "Pago cuenta {cuenta}" | M07 |
| 43 | VAR_PMOVIL/CoopOnline | Texto | Id de convenio para generar solicitudes de SIRO | clsSIRO.Registrar_Solicitudes | Migrar: identificador de convenio (no secreto) en la conexión SIRO | PRM-INT-P1-002 | int.siro.convenioId | string | tenant | — (dato del convenio) | T06 / M07 |
| 44 | VAR_PMOVIL/CoopOnline | Entero | Validar requerir datos en DDJJ de artefactos | sin lectura (CoopOnline) | Migrar: nivel de exigencia de datos del trámite web de DDJJ de artefactos (gas) | PRM-CRM-P1-001 | crm.tramites.ddjjArtefactos.validacionDatos | enum(noExigir, advertir, exigir) | tenant | advertir | M09 |
| 49 | VAR_PMOVIL/CoopOnline | Texto | Mail para recibir avisos de registros de trámites web | sin lectura (CoopOnline) | Migrar: destinatarios adicionales del aviso de trámite nuevo (además de la bandeja por rol) | PRM-CRM-P1-002 | crm.tramites.emailsAvisoNuevoTramite | email[] | tenant | [] | M09 / T09 |
| 56 | VAR_PMOVIL/PMovil | Texto | Correo electrónico para enviar mail de datos | sin lectura (PMovil) | Reemplazado: la app de campo/lecturas sincroniza por API con cola offline (`clientMutationId`); no hay envío de datos por mail | — | — | — | — | — | M03 / M10 |
| 65 | VAR_PMOVIL/CoopOnline | Texto largo | Texto para mostrar en la cabecera de la página | sin lectura (CoopOnline) | Diccionario (los avisos temporales van a banners de T09) | PRM-UXD-P1-007 | dict:por.cabecera.texto | dictKey | tenant | vacío | T03 / M19 |
| 68 | VAR_PMOVIL/CoopOnline | Numérico | Número de sucursal de Fecescor | sin lectura (CoopOnline) | Migrar: dato del convenio con la tarjeta regional Fecescor | PRM-COB-P1-002 | cob.fecescor.numeroSucursal | string | ente | — | M07 |
| 103 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Contrato de Fianza Titular | sin lectura | Migrar | PRM-MOR-P1-001 | mor.garantias.plantillaFianzaTitular | ref:documentTemplates | tenant | plantilla estándar de fianza | M08 / T11 |
| 205 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Contrato de Fianza Cuenta | sin lectura | Migrar | PRM-MOR-P1-002 | mor.garantias.plantillaFianzaCuenta | ref:documentTemplates | tenant | plantilla estándar de fianza | M08 / T11 |
| 206 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Contrato de Fianza Servicio | sin lectura | Migrar (con override por servicio) | PRM-MOR-P1-003 | mor.garantias.plantillaFianzaServicio | ref:documentTemplates | tenant / servicio | plantilla estándar de fianza | M08 / T11 |
| 224 | VAR | Lógico | Tomar hora desde el servidor (requiere privilegios) | Nucleo.ChequeoGenerales | Descartar: la hora la da el servidor (UTC + zona del tenant, AGR-017); sincronización NTP es infraestructura | — | — | — | — | — | — |
| 225 | VAR | Texto | Nombre para el servidor de horas | Nucleo.ChequeoGenerales | Descartar: ídem 224 | — | — | — | — | — | — |
| 335 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Contrato asociado a solicitud de ingreso de titular | sin lectura | Migrar | PRM-PER-P1-001 | per.titulares.plantillaSolicitudIngreso | ref:documentTemplates | tenant | plantilla estándar de solicitud de ingreso | M01 / M17 |
| 501 | VAR | Fecha (texto) | Fecha de cierre de facturación | Nucleo.GetFechaCierre | Reemplazado: cierre de período de facturación como entidad con estado y auditoría que bloquea altas/modificaciones con fecha anterior | — | — | — | — | — | M05 |
| 518 | VAR | Texto | Datos Empresa - Razón Social | clsWeb_CoopOnline (+44 usos), Empresa.CrearEmpresa | Migrar: perfil legal del tenant (editable por el admin del tenant con auditoría) | PRM-PLA-P1-002 | pla.tenant.razonSocial | string | tenant | dato de alta del tenant | T01 → T04 `legalEntities.legalName` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 519 | VAR | Texto | Datos Empresa - CUIT | clsWeb_CoopOnline (+65 usos); licencia (`ValidarVersion`) | Plataforma: lo fija la plataforma al crear el tenant (ligado a licencia y ARCA); el tenant no lo edita | PRM-PLA-P1-003 | pla.tenant.cuit | string (CUIT validado) | plataforma | dato de alta del tenant | T01 / M06 → T04 `legalEntities.fiscal.cuit` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 520 | VAR | Texto | Datos Empresa - Calle | Empresa.CrearEmpresa; clsComprobanteVenta.CargarComprobante | Migrar | PRM-PLA-P1-004 | pla.tenant.domicilioFiscal.calle | string | tenant | dato de alta | T01 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 521 | VAR | Texto | Datos Empresa - Número | Empresa.CrearEmpresa; clsComprobanteVenta | Migrar | PRM-PLA-P1-005 | pla.tenant.domicilioFiscal.numero | string | tenant | dato de alta | T01 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 522 | VAR | Texto | Datos Empresa - Barrio | Empresa.CrearEmpresa; clsComprobanteVenta | Migrar | PRM-PLA-P1-006 | pla.tenant.domicilioFiscal.barrio | string | tenant | vacío | T01 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 523 | VAR | Texto | Datos Empresa - Localidad | Empresa.CrearEmpresa; clsInformes_Caja.Guardar_Archivo | Migrar | PRM-PLA-P1-007 | pla.tenant.domicilioFiscal.localidad | ref:localities | tenant | dato de alta | T01 / T04 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 524 | VAR | Texto | Datos Empresa - Código Postal | Empresa.CrearEmpresa; abm_Personas_Load (CP por defecto) | Migrar | PRM-PLA-P1-008 | pla.tenant.domicilioFiscal.codigoPostal | string | tenant | dato de alta | T01 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 525 | VAR | Texto | Datos Empresa - Teléfono | Empresa.CrearEmpresa | Migrar | PRM-PLA-P1-009 | pla.tenant.telefono | string (E.164) | tenant | dato de alta | T01 → T04 `legalEntities.address` / `contact` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 526 | VAR | Texto | Datos Empresa - Ingresos Brutos | Empresa.CrearEmpresa | Migrar | PRM-FIS-P1-001 | fis.tenant.numeroIibb | string | tenant | dato de alta | M06 → T04 `legalEntities.fiscal.iibbNumber` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 527 | VAR | Entero (FK `SITIVA.COD_SIT`) | Datos Empresa - Situación IVA | Empresa.CrearEmpresa; Impuestos.GetAlicuota / GetAlicuota_Percepcion | Migrar | PRM-FIS-P1-002 | fis.tenant.condicionIva | ref:ivaConditions | tenant | Responsable Inscripto | M06 → T04 `legalEntities.fiscal.ivaConditionCode` de la entidad por defecto (RF-CFG-134/135, DEC-064) |
| 706 | VAR | Entero (FK `SITIBR.COD_SIT`) | Datos Empresa - Condición de Ingresos Brutos | sin lectura | Migrar | PRM-FIS-P1-003 | fis.tenant.condicionIibb | ref:iibbConditions | tenant | Convenio local | M06 |
| 707 | VAR | Texto | Datos Empresa - Código de Validación Provincial | sin lectura | Migrar | PRM-FIS-P1-004 | fis.tenant.codigoValidacionProvincial | string | tenant | vacío | M06 |
| 709 | VAR | Texto | Datos Empresa - Razón Social para Email | Empresa.CrearEmpresa | Migrar: nombre visible del remitente de correos | PRM-COM-P1-001 | com.email.nombreRemitente | string | tenant | = razón social | T09 |
| 2008 | VAR | Texto | Datos Empresa - Nombre Agente de Retención | clsProveedor.GetProveedores_Transporte; Exportar_ArchivoDGR / Silarpib | Migrar | PRM-FIS-P1-005 | fis.agenteRetencion.nombre | string | tenant | = razón social | M06 |
| 2009 | VAR | Texto | Datos Empresa - Domicilio Agente de Retención | sin lectura | Migrar | PRM-FIS-P1-006 | fis.agenteRetencion.domicilio | string | tenant | = domicilio fiscal | M06 |
| 2010 | VAR | Texto | Datos Empresa - Número Agente de Retención | Exportar_ArchivoDGR; Exportar_Silarpib_Alem | Migrar | PRM-FIS-P1-007 | fis.agenteRetencion.numero | string | tenant | vacío | M06 |
| 2011 | VAR | Texto | Datos Empresa - Localidad Agente de Retención | sin lectura | Migrar | PRM-FIS-P1-008 | fis.agenteRetencion.localidad | ref:localities | tenant | = localidad fiscal | M06 |
| 2012 | VAR | Texto | Datos Empresa - Punto de Venta para Ret. IIBB | Retenciones.ObtenerRetencion; SIRCAR | Migrar | PRM-FIS-P1-009 | fis.agenteRetencion.puntoVentaRetencionesIibb | ref:pointsOfSale | tenant | vacío | M06 |
| 2013 | VAR | Lógico | Marcar automáticamente valores para pago a proveedores | sin lectura | Migrar | PRM-TES-P1-001 | tes.pagosProveedores.autoseleccionarValores | boolean | tenant | false | M14 |
| 2027 | VAR | Texto | Coordenadas de inicio del mapa | AtributosMapa (clsMapa) | Migrar | PRM-TEC-P1-001 | tec.mapa.centroInicial | geoPoint | tenant | centro de la localidad fiscal del tenant | M10 |
| 2028 | VAR | Entero | Zoom de inicio del mapa | AtributosMapa (clsMapa) | Migrar | PRM-TEC-P1-002 | tec.mapa.zoomInicial | integer (1–20) | tenant | 13 | M10 |
| 2029 | VAR | Lista (RoadMap; Satellite; Hybrid; Terrain) | Tipo de mapa | AtributosMapa (clsMapa) | Migrar | PRM-TEC-P1-003 | tec.mapa.tipoCapaInicial | enum(callejero, satelital, hibrido, relieve) | tenant / usuario | callejero | M10 |
| 2051 | VAR | Lista (No chequear; Al ingresar; Al salir; Servicio Procoop) | Backup - Configuración | Nucleo.GenerarBackupAutomatico; clsServicio_Procoop.ChequearBackup | Plataforma: backups gestionados por la plataforma (política, frecuencia, retención, restauración por tenant) | PRM-PLA-P1-010 | pla.backups.politica | object {frecuencia, retencionDias} | plataforma | diario, 35 días | T01 |
| 2052 | VAR | Mixto: Entero | Backup - Hora desde la cual generarlo | Nucleo.GenerarBackupAutomatico; clsServicio_Procoop | Plataforma (ventana de backup) | PRM-PLA-P1-011 | pla.backups.ventanaHoraria | string (HH:mm UTC) | plataforma | 03:00 | T01 |
| 2053 | VAR | Mixto: Texto (ruta) | Backup - Ruta de destino en servidor | Nucleo.GenerarBackup; ActualizarBaseDemo | Plataforma (destino de backups en almacenamiento de objetos de plataforma) | PRM-PLA-P1-012 | pla.backups.destino | string (bucket/prefijo) | plataforma | definido por despliegue | T01 |
| 2086 | VAR | Entero (FK `SITIVA.COD_SIT`) | Situación IVA por defecto de la persona | InfoCobranza.Get_Recargo; clsCobranzas.Get_ConceptosCobrar; abm_Personas (alta) | Migrar | PRM-PER-P1-002 | per.personas.condicionIvaPorDefecto | ref:ivaConditions | tenant | Consumidor Final | M01 / M06 |
| 2090 | VAR | Lista (Google; Bing) | Proveedor de mapa | Nucleo.abrirMapa_Navegador; frmVisorMapa | Plataforma: el proveedor de mapas lo define la plataforma para todos los tenants | PRM-PLA-P1-013 | pla.mapas.proveedor | enum(google, osm, …) | plataforma | definido por plataforma | T01 / M10 |
| 2242 | VAR | Texto | Clave de Mapa Bing | clsRecategorizacion; ctrlMapaBing | Bóveda (si el tenant usa clave propia; si no, clave de plataforma); no transcribir | PRM-INT-P1-003 | int.mapas.bing.apiKey | secretRef | plataforma / tenant | — | T06 |
| 2251 | VAR | Texto | Clave de Mapa Google | clsMapa.GetImageFromWeb; ctrlMapaBase | Bóveda (ídem 2242); no transcribir | PRM-INT-P1-004 | int.mapas.google.apiKey | secretRef | plataforma / tenant | — | T06 |
| 2264 | VAR | Texto | Sigla del nombre del cliente | InfoCobranza.Cargar; archivos de entes (Tarjeta Naranja…) (+129 usos) | Migrar: sigla corta del tenant usada en archivos de intercambio y leyendas | PRM-PLA-P1-014 | pla.tenant.sigla | string (máx. 10, mayúsculas) | tenant | dato de alta | T01 / M07 |
| 2275 | VAR | Lógico | No iniciar calendario ni correo al iniciar | Inicio_ProCoop_Load; timerNoticias_Tick | Descartar: optimización de arranque de escritorio | — | — | — | — | — | — |
| 2280 | VAR | Numérico | Minutos de inactividad para bloqueo de sesión | Inicio_ProCoop (timer) | Migrar (con máximo de plataforma) | PRM-IAM-P1-003 | iam.sesion.minutosInactividad | integer (5–480) | tenant | 30 | T02 |
| 2294 | VAR | Lista (Excel DevExpress; Excel anterior; CSV) | Tipo de exportación de Excel | Excel_Class.Exportar_* | Reemplazado: DataTable genérico exporta XLSX/CSV/PDF a elección del usuario | — | — | — | — | — | T03 |
| 2326 | VAR | Lógico | Mostrar advertencia al vincular ZSR (zona/sector/recorrido) ya asignadas a una cuenta | sin lectura | Migrar | PRM-PER-P1-003 | per.cuentas.advertirRecorridoYaAsignado | boolean | tenant | true | M01 |
| 2333 | VAR | Mixto: Texto/Lógico | Bloquear backup demo | frmOpcionesEspeciales | Descartar: los ambientes demo/sandbox los gestiona la plataforma (T01) | — | — | — | — | — | — |
| 2347 | VAR | Entero | Clave de cierre de módulo de autogestión | sin lectura | Bóveda: PIN de cierre de terminales de autogestión (kiosco) gestionado por el agente de hardware local; no transcribir | PRM-INT-P1-005 | int.terminalesAutogestion.pinCierre | secretRef | tenant / dispositivo | — | T06 / M19 |
| 2351 | VAR | Texto | Dirección IP para el lector de billetes | clsLectorBilletes | Reemplazado: configuración por dispositivo en el registro de dispositivos del agente de hardware local | — | — | — | — | — | T06 / M07 |
| 2352 | VAR | Entero | Puerto para el lector de billetes | clsLectorBilletes | Reemplazado: ídem 2351 | — | — | — | — | — | T06 / M07 |
| 2353 | VAR | Entero | Localidad por defecto para el alta de persona | abm_Personas_Load; Exportar_ArchivoDGR / Silarpib_Alem | Migrar | PRM-PER-P1-004 | per.personas.localidadPorDefecto | ref:localities | tenant / sucursal | localidad fiscal del tenant | M01 / T04 |
| 2549 | VAR | Lógico | Permite utilizar punto de venta 0 en comprobantes | clsPrepaga.GetCreditoPorRecargo / GetDebitoPorRecargo; clsComprobante.GetPuntoVenta | Migrar (requiere además marca en el tipo de comprobante) | PRM-FAC-P1-001 | fac.numeracion.permitirPuntoVentaCero | boolean | tenant | false | M05 |
| 2551 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Plantilla de mail para comprobantes para pago de Pagos360 | sin lectura | Migrar: plantilla de notificación del evento de link de pago generado | PRM-COM-P1-002 | com.plantillas.linkPagoGenerado | ref:notificationTemplates | tenant | plantilla estándar | T09 / M07 |
| 2622 | VAR | Lógico | Activar Pagos Online | sin lectura | Migrar | PRM-POR-P1-002 | por.pagos.pagoOnlineHabilitado | boolean | tenant | true (si hay pasarela activa) | M19 / M07 |
| 2683 | VAR | Lógico | Activar botón de chat online con soporte | sin lectura | Plataforma: el canal de soporte al tenant lo provee la plataforma | PRM-PLA-P1-015 | pla.soporte.chatHabilitado | boolean | plataforma (por plan) | true | T01 |
| 2706 | VAR | Lógico | Generar remito por reimpresión con el mismo tipo del comprobante | sin lectura | Migrar | PRM-VEN-P1-001 | ven.remitos.reimpresionMismoTipo | boolean | tenant | false | M11 |
| 2721 | VAR | Entero (FK `SOCIOS.COD_SOC`) | Titular para registrar facturas de farmacia de consumidor final | clsFacturacionCuotasTerceros.Importar_FacturaFarmacia | Migrar | PRM-SOC-P1-001 | soc.farmacia.cuentaConsumidorFinal | ref:accounts | tenant | cuenta genérica "Consumidor final" | M18 |
| 2729 | VAR | Mixto: Lógico | Guardar nuevos correos internos | abm_CorreoInterno._ValidFields | Reemplazado: mensajería interna del centro de comunicaciones (T09) | — | — | — | — | — | T09 |
| 2730 | VAR | Lógico | No levantar Agente si se encuentra cerrado (modo 11) | Program.Main | Reemplazado: workers BullMQ supervisados por el orquestador de contenedores (reinicio automático) | — | — | — | — | — | T01 / T08 |
| 2731 | VAR | Texto | Mails para autorecuperación del agente (modo 11) | Program.Main | Reemplazado: alertas de salud de workers de plataforma | — | — | — | — | — | T01 / T08 |
| 2733 | VAR | Lógico | Permitir cargar Novedades Web | frmRequisitos.Novedades_ItemClick | Reemplazado: capability `com.novedades.crear` por rol | — | — | — | — | — | T09 / T02 |
| 2742 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Plantilla para trámite de DDJJ de artefactos | frmRequisitos.GetPlantillaDDJJ | Migrar | PRM-CRM-P1-003 | crm.tramites.ddjjArtefactos.plantilla | ref:documentTemplates | tenant / servicio | plantilla estándar | M09 / T11 |
| 2786 | VAR | Mixto: Fecha (texto) | Backup - Última fecha que se realizó | Nucleo.GenerarBackup; Inicio_ProCoop_Load (aviso) | Plataforma: dato operativo del registro de backups (no es parámetro); visible en tablero de salud | — | — | — | — | — | T01 |
| 2790 | VAR | Lista (Asociado; Cuenta; Documento; Código QR) | Autogestión - opción de búsqueda de cuenta por defecto en cobranzas/prepaga | sin lectura | Migrar | PRM-POR-P1-003 | por.autogestion.busquedaCuentaPorDefecto | enum(asociado, cuenta, documento, qr) | tenant / dispositivo | documento | M19 |
| 2812 | VAR | Texto | Datos Empresa - Razón Social Corta (SMS) | clsProcoop_Integra.EnvioNotificacionSms / EnvioOrdenTrabajoSms | Migrar | PRM-COM-P1-003 | com.sms.nombreRemitente | string (máx. 11) | tenant | = sigla | T09 |
| 2831 | VAR | Lógico | Usar entorno de pruebas para firma digital | clsFirmaDigital (constructor) | Migrar: ambiente de la integración (sandbox/producción) | PRM-INT-P1-006 | int.firmaDigital.ambiente | enum(sandbox, produccion) | tenant | produccion | T06 |
| 2857 | VAR | Lógico | Imprimir alta/baja del débito automático al guardar | sin lectura | Migrar: generar constancia PDF de adhesión/baja al expediente | PRM-COB-P1-003 | cob.debitoAutomatico.generarConstancia | boolean | tenant | true | M07 / T11 |
| 2860 | VAR | Mixto | Línea 1 hojas para rubricar | sin lectura | Migrar | PRM-CON-P1-001 | con.librosRubricados.encabezadoLinea1 | string | tenant | razón social | M15 |
| 2861 | VAR | Mixto | Línea 2 hojas para rubricar | sin lectura | Migrar | PRM-CON-P1-002 | con.librosRubricados.encabezadoLinea2 | string | tenant | CUIT | M15 |
| 2862 | VAR | Mixto | Línea 3 hojas para rubricar | sin lectura | Migrar | PRM-CON-P1-003 | con.librosRubricados.encabezadoLinea3 | string | tenant | domicilio | M15 |
| 2863 | VAR | Mixto | Línea 4 hojas para rubricar | sin lectura | Migrar | PRM-CON-P1-004 | con.librosRubricados.encabezadoLinea4 | string | tenant | matrícula INAES | M15 |
| 2866 | VAR | Lógico | Código de barras SIRO - informar empresa de servicio 044 | TIR_Roela.Get_CodigoBarras | Migrar | PRM-COB-P1-004 | cob.siro.codigoBarras.informarEmpresa044 | boolean | ente | false | M07 |
| 2903 | VAR | Numérico | Margen por defecto para actualizar precio en presupuestos | sin lectura | Migrar | PRM-VEN-P1-002 | ven.presupuestos.margenActualizacionPorDefecto | percent | tenant | 0 | M11 |
| 2966 | VAR | Entero | Valor por defecto para comenzar el índice de registros a exportar | Exportador_Base.Indexar_Registro | Migrar | PRM-COB-P1-005 | cob.entes.exportacion.indiceInicial | integer | ente | 1 | M07 |
| 2987 | VAR | Texto | Dato fijo que Rapipago informa a cada cooperativa | E_RapiPago.Exportar; E_Rapipago_SinFactura | Migrar: código de empresa asignado por Rapipago | PRM-COB-P1-006 | cob.entes.rapipago.codigoEmpresa | string | ente | — | M07 / T06 |
| 2990 | VAR | Texto (ruta) | Ruta del Integra | clsVersion.HayVersionIntegra / ActualizarVersionIntegra | Reemplazado: el Integra (API local) desaparece; la API es el backend SaaS | — | — | — | — | — | T01 |
| 2993 | VAR | Texto | URL del Integra local | clsFirmaDigital; clsProcoop_Integra.PreRegistrarUsuario; clsVersion | Reemplazado: ídem 2990 | — | — | — | — | — | T01 |
| 3024 | VAR | Lógico | Mostrar datos del producto en página extra al imprimir presupuesto | sin lectura | Migrar | PRM-VEN-P1-003 | ven.presupuestos.pdf.paginaDetalleProducto | boolean | tenant | false | M11 |
| 3029 | VAR | Lógico | Mostrar grilla con imágenes en el turnero | sin lectura | Migrar | PRM-CRM-P1-004 | crm.turnero.pantalla.mostrarImagenes | boolean | sucursal | false | M09 |
| 3048 | VAR | Texto largo | Api Key de OpenAI | clsChatGPT.ObtenerApiKey / EnviarComandoConMultiplesImagenes | Bóveda (clave propia del tenant o de plataforma para IA); no transcribir | PRM-INT-P1-007 | int.ia.openai.apiKey | secretRef | plataforma / tenant | — | T06 |
| 3093 | VAR | Lógico | Permitir guardar copia del adjunto en carpeta seleccionada | frmAdjuntos_Load | Reemplazado: descarga de documentos controlada por capability `wfl.documentos.descargar` | — | — | — | — | — | T11 / T02 |
| 3097 | VAR | Lógico | No eliminar AUDIT_MAIL; pasar a históricos vía agente | clsServicio_Procoop.AgregarTareasDinamicas | Plataforma: política de retención del registro de envíos | PRM-PLA-P1-016 | pla.retencion.registroEnviosDias | integer | plataforma | 730 | T01 / T08 |
| 3098 | VAR | Entero | Agente - hora de eliminación de registros de AUDIT_MAIL | clsServicio_Procoop.AgregarTareasDinamicas | Plataforma: horario del job de purga | PRM-PLA-P1-017 | pla.retencion.horaJobPurga | string (HH:mm UTC) | plataforma | 04:00 | T01 |
| 3104 | VAR | Texto | URL externa para botón Herramientas en Procoop.ar | clsProcoop_Integra.ValidacionVariable | Migrar: enlace externo configurable del menú del portal | PRM-POR-P1-004 | por.menu.enlaceHerramientasUrl | url | tenant | vacío (oculto) | M19 |
| 3114 | VAR | Entero (FK `TERCEROS.COD_TER`) | FECESCOR - Entidad de terceros | clsWeb_CoopOnline.CrearCobranzaResumenTarjeta / GenerarFacturaTerceros; clsWEB.SincronizarParametros | Migrar | PRM-COB-P1-007 | cob.fecescor.entidadTercero | ref:thirdParties | tenant | — | M07 / M06 |
| 3115 | VAR | Lógico | Controlar backup automático y avisar a desarrollo si no se hace | clsServicio_Procoop.EliminarAuditMail | Plataforma: monitoreo de backups | — | — | — | — | — | T01 |
| 3116 | VAR | Lógico | Impactar cambios de estado (desconexión/reconexión) en Discar | Discar.ConfirmarOT | Migrar: al confirmar OT de corte/reconexión, enviar la orden al medidor telegestionado | PRM-MED-P1-001 | med.telemedicion.discar.impactarCorteReconexion | boolean | tenant / servicio | false | M03 / M08 |
| 3122 | VAR | Lógico | No permitir descarga de recibos de sueldo antes de firmar | sin lectura | Migrar | PRM-SUE-P1-001 | sue.recibos.exigirFirmaAntesDeDescarga | boolean | tenant | true | M16 |
| 3125 | VAR | Texto largo (ruta) | Ruta de backup diario para avisar por mail si está atrasado | clsServicio_Procoop.ControlUltimoBackup | Plataforma: monitoreo de backups | — | — | — | — | — | T01 |
| 3131 | VAR | Lista (No chequear; Solicitar; Obligar) | Forzar cambio de contraseña con clave por defecto | sin lectura | Reemplazado: no existen claves por defecto; alta por invitación con enlace de un solo uso y contraseña definida por el usuario | — | — | — | — | — | T02 |
| 3132 | VAR | Lista (Sin; Baja; Media; Alta) | Nivel de complejidad de contraseñas de usuarios | sin lectura | Migrar (el tenant solo puede endurecer sobre el mínimo de plataforma) | PRM-IAM-P1-004 | iam.passwords.nivelComplejidad | enum(estandar, alta, muyAlta) | tenant | estandar (mínimo plataforma) | T02 / T08 |
| 3157 | VAR | Texto | Permitir modificar el nombre del formulario de transición y ABM de incidentes | clsDefault.AgregarChequeoEntidades | Diccionario: los títulos de pantalla se personalizan por clave | PRM-UXD-P1-008 | dict:crm.incidentes.tituloPantalla | dictKey | tenant | "Incidentes" | T03 / M09 |
| 3160 | VAR | Lógico | No validar certificado en la configuración del correo | Mails/Manager | Descartar: inseguro; T08 exige TLS con certificado válido | — | — | — | — | — | — |
| 3166 | VAR | Lógico | No permitir recibo del mes actual si no se firmó el anterior | sin lectura | Migrar | PRM-SUE-P1-002 | sue.recibos.exigirFirmaMesAnterior | boolean | tenant | true | M16 |
| 3168 | VAR | Fecha (texto) | Fecha de facturas de Procoop | sin lectura | Migrar: fecha de corte desde la cual las facturas provienen de ProCoop (convivencia/paralelo) | PRM-MIG-P1-001 | mig.procoop.fechaCorteFacturas | date | tenant | vacío | T07 |
| 3170 | VAR | Lógico | Permitir desconexión desde el Integra sin confirmar la OT | clsProcoop_Integra_Tecnica.Desconectar | Migrar: permitir corte remoto (aprovisionamiento/telegestión) sin OT confirmada | PRM-TEC-P1-004 | tec.corte.permitirRemotoSinConfirmarOt | boolean | tenant / servicio | false | M10 / M08 |

## 7. Módulo TITULARES (312 parámetros)
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 3 | VAR_PMOVIL/CoopOnline | Lógico | Sincronizar detalle de pagos de comprobantes | clsWEB.SincronizarPagos | Reemplazado: el portal lee en línea la cuenta corriente (M07); no hay sincronización a MySQL externa | — | — | — | — | — | M19 / M07 |
| 4 | VAR_PMOVIL/CoopOnline | Lógico | Sincronizar detalle de refinanciación | clsWEB.SincronizarPagos | Reemplazado: ídem 3 (planes de pago leídos en línea desde M08) | — | — | — | — | — | M19 / M08 |
| 12 | VAR_PMOVIL/CoopOnline | Lógico | Diferir intereses al realizar cobranzas | clsWeb_CoopOnline.crearCobranza / GenerarSolicitud / GetInfoCobranza | Migrar: en pagos online, el interés por mora no se cobra en el momento sino que se factura en el período siguiente | PRM-MOR-P1-004 | mor.intereses.diferirEnPagoOnline | boolean | tenant / canal | true | M08 / M07 |
| 13 | VAR_PMOVIL/CoopOnline | Lógico | Obtener todas las facturas de un talón al realizar cobranzas | clsWeb_CoopOnline.crearCobranza / GetInfoCobranza | Migrar: el pago online de un comprobante agrupado (talón) arrastra todas sus facturas | PRM-COB-P1-008 | cob.portal.cobrarTalonCompleto | boolean | tenant | true | M07 / M19 |
| 14 | VAR_PMOVIL/CoopOnline | Texto | Texto en vista previa de facturas seleccionadas | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-009 | dict:por.pagos.leyendaVistaPrevia | dictKey | tenant | vacío | T03 / M19 |
| 15 | VAR_PMOVIL/CoopOnline | Lógico | Exigir teléfono en titular | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-005 | por.registro.exigirTelefono | boolean | tenant | true | M19 |
| 17 | VAR_PMOVIL/CoopOnline | Lógico | No subir PDF de los comprobantes bloqueados | clsWEB.GetlstFacturas | Migrar: los comprobantes bloqueados (en revisión/reclamo) no se publican en el portal | PRM-POR-P1-006 | por.comprobantes.ocultarBloqueados | boolean | tenant | true | M19 / M05 |
| 18 | VAR_PMOVIL/CoopOnline | Lógico | Exigir mail de titular | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-007 | por.registro.exigirEmail | boolean | tenant | true | M19 |
| 19 | VAR_PMOVIL/CoopOnline | Lógico | Confirmar teléfono/e-mail SIEMPRE al ingresar (si 15/18 activas) | sin lectura (CoopOnline) | Migrar (depende de 15 y 18) | PRM-POR-P1-008 | por.perfil.confirmarContactoAlIngresar | boolean | tenant | false | M19 |
| 20 | VAR_PMOVIL/CoopOnline | Fecha (texto) | No subir facturas posteriores a una fecha específica | clsWEB.AgregarFiltrosFacturas | Migrar: fecha tope de publicación de comprobantes en el portal (útil en paralelo/corte) | PRM-POR-P1-009 | por.comprobantes.fechaTopePublicacion | date | tenant | vacío (sin tope) | M19 / T07 |
| 21 | VAR_PMOVIL/CoopOnline | Lógico | Permitir descargar PDF para pago en efectivo | clsWeb_CoopOnline.crearCobranza | Migrar: cupón con código de barras para pagar en entes | PRM-POR-P1-010 | por.pagos.permitirCuponEfectivo | boolean | tenant | true | M19 / M07 |
| 27 | VAR | Numérico (FK `COMPROB.COD_COM`) | Crédito para anticipo | sin lectura | Migrar | PRM-COB-P1-009 | cob.anticipos.tipoComprobanteCredito | ref:voucherTypes | tenant | NC Anticipo | M07 |
| 27 | VAR_PMOVIL/CoopOnline | Texto | URL para adhesión a débito automático | clsWEB.SincronizarCuentas | Migrar: URL externa de adhesión (vacío = formulario propio del portal) | PRM-POR-P1-011 | por.debitoAutomatico.urlAdhesionExterna | url | tenant | vacío | M19 / M07 |
| 28 | VAR | Numérico (FK `COMPROB.COD_COM`) | Débito para anticipo | sin lectura | Migrar | PRM-COB-P1-010 | cob.anticipos.tipoComprobanteDebito | ref:voucherTypes | tenant | ND Anticipo | M07 |
| 31 | VAR_PMOVIL/CoopOnline | Lógico | Deshabilitar pestaña de consumos | sin lectura (CoopOnline) | Migrar (semántica invertida) | PRM-POR-P1-012 | por.secciones.consumosHabilitada | boolean | tenant / servicio | true | M19 |
| 32 | VAR | Lógico | Diferenciar socios y clientes por código | clsSocios.GetIdSocio | Migrar: rangos/series de numeración distintos para asociados y clientes no asociados (A validar PA-CFG-P1-01) | PRM-PER-P1-005 | per.titulares.numeracionDiferenciadaSocioCliente | boolean | tenant | false | M01 / T04 |
| 32 | VAR_PMOVIL/CoopOnline | Lista (No permitir; Solo mail; Mail y WhatsApp) | Habilitar adhesión a facturación electrónica | sin lectura (CoopOnline) | Migrar: canales de adhesión a factura digital desde el portal | PRM-POR-P1-013 | por.facturaDigital.canalesAdhesion | enum(ninguno, email, emailWhatsapp) | tenant | emailWhatsapp | M19 / M05 |
| 36 | VAR_PMOVIL/CoopOnline | Entero | Meses de antigüedad de PDF para borrar | clsServicio_Procoop.BorrarPDF_Antiguos | Migrar (nueva semántica): meses de comprobantes visibles en el portal; los PDF fiscales se conservan según política de retención T08 | PRM-POR-P1-014 | por.comprobantes.mesesVisibles | integer | tenant | 24 | M19 / T08 |
| 46 | VAR_PMOVIL/CoopOnline | Lógico | No subir cuentas sin servicios y sin deuda | clsWEB.SincronizarCuentas | Migrar | PRM-POR-P1-015 | por.cuentas.ocultarSinServiciosNiDeuda | boolean | tenant | true | M19 |
| 50 | VAR | Texto | Parámetros para padrón de titulares (filtros guardados) | clsPadronTitular.GuardarFiltros | Reemplazado: vistas guardadas del DataTable / filtros guardados del reporte de padrón | — | — | — | — | — | T03 / M17 |
| 54 | VAR | Lógico | Requerir garantía al ingresar titulares | sin lectura | Migrar (se unifica con 2469 en un enum) | PRM-PER-P1-006 | per.titulares.controlGarantiaAlta | enum(noControlar, advertir, exigir) | tenant | noControlar | M01 / M08 |
| 59 | VAR_PMOVIL/CoopOnline | Lógico | Advertencia de no presentación de DDJJ en las cuentas | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-016 | por.cuentas.advertirDdjjPendiente | boolean | tenant | true | M19 / M09 |
| 71 | VAR_PMOVIL/CoopOnline | Lógico | Agrupar y ordenar facturas en la web por vencimiento | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-017 | por.comprobantes.agruparPorVencimiento | boolean | tenant | true | M19 |
| 73 | VAR | Lógico | El capital se suscribe al facturar | clsCierreDiario.Capital / CapitalReserva | Migrar: momento de suscripción del capital social (se unifica con 2636) | PRM-INS-P1-001 | ins.capital.momentoSuscripcion | enum(alFacturar, enAfiliacion, alCobrar) | tenant | alFacturar | M17 / M15 |
| 73 | VAR_PMOVIL/CoopOnline | Lógico | Ocultar observaciones en las órdenes de la web | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-018 | por.ordenes.ocultarObservaciones | boolean | tenant | true | M19 / M10 |
| 74 | VAR_PMOVIL/CoopOnline | Fecha (texto) | Permitir descargar PDF con el Integra a partir de una fecha | sin lectura (CoopOnline) | Reemplazado: no hay Integra; la disponibilidad la definen por.comprobantes.mesesVisibles (V2 #36) y fechaTopePublicacion (V2 #20) | — | — | — | — | — | M19 |
| 75 | VAR_PMOVIL/CoopOnline | Lógico | Habilitar la carga de vehículos eléctricos | sin lectura (CoopOnline) | Migrar: declaración de vehículo eléctrico por el socio (impacta categoría/consumo eléctrico) | PRM-POR-P1-019 | por.declaraciones.vehiculoElectricoHabilitada | boolean | tenant / servicio | false | M19 / M04 |
| 109 | VAR | Lógico | No exigir adherente titular | sin lectura | Migrar-servicio: en servicios con adherentes (sepelio, salud), si el titular debe figurar como adherente | PRM-CAT-P1-001 | cat.servicio.adherentes.exigirTitularComoAdherente | boolean | servicio | true | M02 / M18 |
| 213 | VAR | Lógico | Exigir zona en alta de suministro | sin lectura | Migrar | PRM-PER-P1-007 | per.suministros.exigirZona | boolean | tenant | true | M01 |
| 240 | VAR | Numérico | Capital procesado por fecha de vencimiento | sin lectura | Migrar: el capital facturado se considera por fecha de vencimiento (no de emisión) en cierres y padrón | PRM-INS-P1-002 | ins.capital.procesarPorFechaVencimiento | boolean | tenant | false | M17 |
| 319 | VAR | Lógico | Controlar catastro en alta de servicios que informan a técnica | sin lectura | Migrar-servicio | PRM-CAT-P1-002 | cat.servicio.alta.exigirCatastro | boolean | servicio | false | M02 / M10 |
| 337 | VAR | Lógico | No permitir titulares dados de baja con capital | clsSocios.PermiteDardeBaja | Migrar | PRM-PER-P1-008 | per.titulares.bajaBloqueadaConCapital | boolean | tenant | true | M01 / M17 |
| 340 | VAR | Lógico | Permitir titulares dados de baja con servicios | clsSocios.PermiteDardeBaja; clsPMovil_Base | Migrar | PRM-PER-P1-009 | per.titulares.bajaPermitidaConServicios | boolean | tenant | false | M01 |
| 343 | VAR | Lógico | Exigir referencia en alta de servicios | sin lectura | Migrar-servicio | PRM-CAT-P1-003 | cat.servicio.alta.exigirReferencia | boolean | servicio | false | M02 |
| 413 | VAR | Numérico (FK `PROD_SER.COD_PRO`) | Concepto para comisión por baja de plan (viviendas) | clsViviendas.Validar_Configuracion / Baja_Plan | Migrar | PRM-SOC-P1-002 | soc.vivienda.conceptoComisionBaja | ref:products | tenant | — | M18 |
| 414 | VAR | Numérico | Porcentaje de comisión por baja de plan (viviendas) | clsViviendas.Validar_Configuracion / Get_InfoPlan | Migrar | PRM-SOC-P1-003 | soc.vivienda.porcentajeComisionBaja | percent | tenant / plan | 0 | M18 |
| 415 | VAR | Numérico (FK `COMPROB.COD_COM`) | Comprobante a generar (viviendas) | sin lectura | Migrar | PRM-SOC-P1-004 | soc.vivienda.tipoComprobante | ref:voucherTypes | tenant | — | M18 |
| 417 | VAR | Numérico (FK `PLANTILLA.COD_PLA`) | Texto para transferencias de viviendas | sin lectura | Migrar | PRM-SOC-P1-005 | soc.vivienda.plantillaTransferencia | ref:documentTemplates | tenant | plantilla estándar | M18 / T11 |
| 418 | VAR | Numérico (FK `PLANTILLA.COD_PLA`) | Texto para bajas de viviendas | sin lectura | Migrar | PRM-SOC-P1-006 | soc.vivienda.plantillaBaja | ref:documentTemplates | tenant | plantilla estándar | M18 / T11 |
| 419 | VAR | Numérico (FK `PLANTILLA.COD_PLA`) | Texto para cambios de planes de vivienda | sin lectura | Migrar | PRM-SOC-P1-007 | soc.vivienda.plantillaCambioPlan | ref:documentTemplates | tenant | plantilla estándar | M18 / T11 |
| 422 | VAR | Mixto | Al transferir elimina servicio en cuenta de origen | sin lectura | Reemplazado: la transferencia cierra el contrato de origen (`validTo`, estado no vigente) y crea uno nuevo; nunca se elimina (historial inmutable) | — | — | — | — | — | M01 |
| 427 | VAR | Lógico | No permitir transferir cuenta con deuda | sin lectura | Migrar | PRM-PER-P1-010 | per.transferencias.bloquearConDeuda | boolean | tenant | true | M01 / M07 |
| 573 | VAR | Entero (FK `SERVICIO.COD_SER`) | Servicio principal | sin lectura | Migrar: servicio que define la "cuenta principal" y el orden por defecto | PRM-CAT-P1-004 | cat.servicios.servicioPrincipal | ref:services | tenant | el primero habilitado | M02 |
| 591 | VAR | Numérico | Tipo de documento para personas jurídicas | abm_Personas (constructor) | Migrar | PRM-PER-P1-011 | per.personas.tipoDocumentoJuridica | ref:documentTypes | tenant | CUIT | M01 |
| 592 | VAR | Numérico | Tipo de documento para personas físicas | abm_Personas (constructor) | Migrar | PRM-PER-P1-012 | per.personas.tipoDocumentoFisica | ref:documentTypes | tenant | DNI | M01 |
| 703 | VAR | Lógico | Exigir conjunto en alta de cuenta | sin lectura | Migrar | PRM-PER-P1-013 | per.cuentas.exigirConjunto | boolean | tenant | false | M01 |
| 734 | VAR | Lógico | NO permitir servicios en titulares NO activos | sin lectura | Migrar | PRM-PER-P1-014 | per.contratos.bloquearEnTitularNoActivo | boolean | tenant | true | M01 |
| 737 | VAR | Texto | Código de empresa en ERSeP | Exportar_Archivo_ERSep; InformeSecretariaEnergia; CIR7021 (+10) | Migrar | PRM-FIS-P1-010 | fis.reguladores.ersep.codigoEmpresa | string | tenant | — | M06 |
| 741 | VAR | Lógico | No permitir facturar a titulares dados de baja | sin lectura | Migrar | PRM-FAC-P1-002 | fac.facturacion.excluirTitularesBaja | boolean | tenant | true | M05 |
| 744 | VAR | Lista (No controlar; Controlar; Exigir) | Controlar teléfono en administración de cuentas y personas | clsSocios.ValidarDatosCuenta; abm_Personas.ValidarControles | Migrar | PRM-PER-P1-015 | per.personas.validacionTelefono | enum(noControlar, advertir, exigir) | tenant | advertir | M01 |
| 745 | VAR | Lista (No controlar; Controlar; Exigir) | Controlar e-mail en administración de cuentas y personas | clsSocios.ValidarDatosCuenta; abm_Personas.ValidarControles | Migrar | PRM-PER-P1-016 | per.personas.validacionEmail | enum(noControlar, advertir, exigir) | tenant | advertir | M01 |
| 753 | VAR | Numérico (FK `PROD_SER.COD_PRO`) | Concepto asociado a reserva de capital | sin lectura | Migrar | PRM-INS-P1-003 | ins.capital.conceptoReserva | ref:products | tenant | — | M17 |
| 754 | VAR | Numérico (FK `COMPROB.COD_COM`) | Comprobante para reserva de capital | sin lectura | Migrar | PRM-INS-P1-004 | ins.capital.tipoComprobanteReserva | ref:voucherTypes | tenant | — | M17 |
| 757 | VAR | Lógico | Liquidar percepciones de IIBB según RN 01/2017 (Córdoba) | Nucleo.lstVariables; clsFinanciacion.GetCuotas_SitIvaDistinto; frmLiquidacionPercepciones | Migrar: activa el régimen de percepción IIBB Córdoba por padrón de servicios públicos | PRM-FIS-P1-011 | fis.iibb.cordoba.rn012017Habilitado | boolean | tenant | false | M06 |
| 758 | VAR | Numérico | Mínimo imponible IIBB | clsWeb_CoopOnline / clsProcoop_Integra.ValidarImpuestos | Migrar (versionado por vigencia) | PRM-FIS-P1-012 | fis.iibb.minimoImponible | money | tenant (con `validFrom`) | 0 | M06 |
| 759 | VAR | Numérico | Alícuota para no incluidos en el archivo de servicios públicos | clsCuentas.ImportarIIBB_RN_012017 / ImportarIIBB_BsAs; frmAlicuotaDeterminada | Migrar (versionado) | PRM-FIS-P1-013 | fis.iibb.alicuotaNoIncluidosServiciosPublicos | percent | tenant (con `validFrom`) | según normativa vigente | M06 |
| 760 | VAR | Numérico | Alícuota para no incluidos en el archivo de otros servicios | clsCuentas.ImportarIIBB_RN_012017; frmAlicuotaDeterminada | Migrar (versionado) | PRM-FIS-P1-014 | fis.iibb.alicuotaNoIncluidosOtrosServicios | percent | tenant (con `validFrom`) | según normativa vigente | M06 |
| 800 | VAR | Mixto: Entero | WEB - Tipo clave | Get_Usuario_CoopOnline; clsClientes_Externos.RegistrarTitular | Reemplazado: métodos de registro/autenticación del socio en IAM (email, Google, CiDi, 2FA) | — | — | — | — | — | T02 / M19 |
| 801 | VAR | Mixto: Lógico | WEB - Enviar órdenes de trabajo | clsWEB.Parametros | Migrar (nueva semántica): mostrar órdenes de trabajo en el portal (lectura en línea) | PRM-POR-P1-020 | por.secciones.ordenesTrabajoHabilitada | boolean | tenant | true | M19 / M10 |
| 802 | VAR | Mixto: Lógico | WEB - Enviar deuda | clsWEB.Parametros | Migrar (nueva semántica): mostrar deuda en el portal | PRM-POR-P1-021 | por.secciones.deudaHabilitada | boolean | tenant | true | M19 / M07 |
| 803 | VAR | Mixto | WEB - Fecha último envío | sin lectura | Descartar: dato operativo de una sincronización que deja de existir | — | — | — | — | — | — |
| 804 | VAR | Mixto | WEB - Mail para reclamos | sin lectura | Migrar: destinatarios adicionales del aviso de reclamo ingresado por el portal | PRM-CRM-P1-005 | crm.reclamos.emailsAvisoPortal | email[] | tenant | [] | M09 / T09 |
| 805 | VAR | Mixto: Texto/Entero | WEB - Hora y días de envío | clsWEB.ValidarWebComputos; clsServicio_Procoop.SincronizarPWeb | Descartar: sin sincronización (portal en tiempo real) | — | — | — | — | — | — |
| 808 | VAR | Mixto: Texto | WEB - Server | clsWEB.Parametros; SincronizarPWeb | Reemplazado: portal en el mismo backend; no hay servidor web externo | — | — | — | — | — | M19 |
| 809 | VAR | Mixto: Texto | WEB - Usuario | clsWEB.Parametros; SincronizarPWeb | Reemplazado: ídem 808 (credencial de base externa, no se migra) | — | — | — | — | — | M19 |
| 810 | VAR | Mixto: Texto | WEB - Clave | clsWEB.Parametros; SincronizarPWeb | Descartar: credencial de base MySQL externa que deja de existir; no se transcribe ni migra | — | — | — | — | — | — |
| 811 | VAR | Mixto: Texto | WEB - Base de datos | clsWEB.Parametros | Reemplazado: ídem 808 | — | — | — | — | — | M19 |
| 812 | VAR | Mixto | WEB - Mail para contactos | sin lectura | Migrar: destinatarios del formulario de contacto de landing/portal | PRM-CRM-P1-006 | crm.contacto.emailsAvisoFormulario | email[] | tenant | [] | M09 / M19 |
| 829 | VAR | Lógico | Permite seleccionar los comprobantes para exportar a la web | clsWEB.AgregarFiltrosFacturas; abm_comprob.ValidarExportarWebComprob | Migrar: publicar en el portal solo los tipos de comprobante marcados como publicables | PRM-POR-P1-022 | por.comprobantes.publicarSoloTiposMarcados | boolean | tenant | false (todos los fiscales) | M19 / M05 |
| 912 | VAR_PMOVIL/CoopOnline | Texto | Texto para mostrar en la web | sin lectura (CoopOnline) | Diccionario | PRM-UXD-P1-010 | dict:por.inicio.textoBienvenida | dictKey | tenant | vacío | T03 / M19 |
| 913 | VAR_PMOVIL/CoopOnline | Lógico | Mostrar solo comprobantes adeudados | sin lectura (CoopOnline) | Migrar | PRM-POR-P1-023 | por.comprobantes.soloAdeudados | boolean | tenant | false | M19 |
| 2030 | VAR | Entero | Distrito (por defecto en alta) | sin lectura | Migrar | PRM-PER-P1-017 | per.cuentas.distritoPorDefecto | ref:districts | tenant / sucursal | vacío | M01 / T04 |
| 2031 | VAR | Entero | Zona de facturación (por defecto en alta) | sin lectura | Migrar | PRM-PER-P1-018 | per.cuentas.zonaFacturacionPorDefecto | ref:billingZones | tenant / sucursal | vacío | M01 / M05 |
| 2032 | VAR | Entero | Sector de facturación (por defecto en alta) | sin lectura | Migrar | PRM-PER-P1-019 | per.cuentas.sectorFacturacionPorDefecto | ref:billingSectors | tenant / sucursal | vacío | M01 / M05 |
| 2033 | VAR | Entero | Recorrido de facturación (por defecto en alta) | sin lectura | Migrar | PRM-PER-P1-020 | per.cuentas.recorridoFacturacionPorDefecto | ref:billingRoutes | tenant / sucursal | vacío | M01 / M05 |
| 2050 | VAR | Lógico | Servicio valida factibilidad existente | sin lectura | Migrar-servicio: el alta exige una factibilidad aprobada vigente | PRM-CAT-P1-005 | cat.servicio.alta.exigirFactibilidad | boolean | servicio | true para Internet (piloto) | M02 / M10 |
| 2077 | VAR | Lógico | Permite duplicar documento en personas | clsSocios.Existe_TitularDocumento / PermiteDNIDuplicado; abm_Personas.txtCuit_Leave | Migrar (ver 3196) | PRM-PER-P1-021 | per.personas.permitirDocumentoDuplicado | boolean | tenant | false | M01 |
| 2250 | VAR | Lógico | Permitir servicios con matrícula duplicada | clsSocios.ValidarServicio / Existe_MatriculaEnSersoc | Migrar-servicio | PRM-CAT-P1-006 | cat.servicio.permitirMatriculaDuplicada | boolean | servicio | false | M02 |
| 2269 | VAR | Lógico | Permitir cargar servicios medidos iguales en una misma cuenta | sin lectura | Migrar-servicio (se unifica con 2715) | PRM-CAT-P1-007 | cat.servicio.permitirVariosPorCuenta | boolean | servicio | false (medidos) / true (no medidos) | M02 |
| 2281 | VAR | Texto | Descripciones de la nomenclatura catastral (Cod\|Sec\|Man\|Par\|PH\|Lote) | clsInformes_Titulares.DatosCatastrales; BuscadorInfoSocio; abm_Propieda (+3) | Migrar: estructura de segmentos de la nomenclatura catastral con etiqueta por clave de diccionario | PRM-PER-P1-022 | per.inmuebles.nomenclaturaCatastral.segmentos | object[] {codigo, dictKey, numerico} | tenant | Circ./Sec./Manz./Parc./PH/Lote | M01 / T04 |
| 2285 | VAR | Lógico | Exigir distrito y sección en cuenta principal | sin lectura | Migrar | PRM-PER-P1-023 | per.cuentas.exigirDistritoSeccionEnPrincipal | boolean | tenant | false | M01 |
| 2286 | VAR | Lógico | No utilizar guardado rápido | clsSocios.Guardar_SUMSOC / Guardar_SERSOC | Descartar: optimización de persistencia de escritorio | — | — | — | — | — | — |
| 2290 | VAR | Lógico | Permitir asignar bonificación de consumo por suministro | sin lectura | Migrar | PRM-TAR-P1-001 | tar.bonificaciones.permitirPorSuministro | boolean | tenant | false | M04 |
| 2291 | VAR | Lista (Dar de baja; Mantener estado; Eliminar) | Modo de transferencia de adherentes y beneficiarios al transferir servicio | clsSocios.Transferir_Adherentes / Transferir_Beneficiarios | Migrar ("Eliminar" se convierte en baja lógica) | PRM-PER-P1-024 | per.transferencias.modoAdherentes | enum(darDeBaja, mantenerEstado) | tenant / servicio | darDeBaja | M01 / M18 |
| 2301 | VAR | Lógico | Permitir reconexión de servicios a titulares fallecidos | clsTecnica.Validar_OrdenTrabajo_Reconexion | Migrar | PRM-MOR-P1-005 | mor.reconexion.permitirTitularFallecido | boolean | tenant | false | M08 / M10 |
| 2303 | VAR | Lógico | Permitir marcar servicios para no facturar | sin lectura | Migrar (la marca exige capability `fac.contratos.excluir`) | PRM-FAC-P1-003 | fac.contratos.permitirMarcaNoFacturar | boolean | tenant | false | M05 |
| 2309 | VAR | Lógico | Validar permiso de carga de calle | txtCalles.txtCalles_Leave | Reemplazado: capability `cfg.calles.crear` en la tabla maestra de calles | — | — | — | — | — | T04 / T02 |
| 2312 | VAR | Entero (FK `SITIBR.COD_SIT`) | Situación de IIBB por defecto en cuentas | sin lectura | Migrar | PRM-FIS-P1-015 | fis.cuentas.condicionIibbPorDefecto | ref:iibbConditions | tenant | No inscripto | M06 / M01 |
| 2314 | VAR | Texto | Descripciones de movimientos de capital (Vendido\|Facturado\|Pagado) | sin lectura | Diccionario | PRM-UXD-P1-011 | dict:ins.capital.estadosMovimiento | dictKey (3 claves: suscripto, facturado, integrado) | tenant | Suscripto / Facturado / Integrado | T03 / M17 |
| 2316 | VAR | Lógico | Permite dar de baja servicios con cuotas relacionadas | sin lectura | Migrar | PRM-PER-P1-025 | per.contratos.bajaConCuotasPendientes | enum(bloquear, permitirYAcelerar, permitirYMantener) | tenant | bloquear | M01 / M08 |
| 2320 | VAR | Lógico | Utilizar nomenclatura catastral numérica | abm_Propieda; frmSeleccionarInmueble | Migrar | PRM-PER-P1-026 | per.inmuebles.nomenclaturaNumerica | boolean | tenant | false | M01 |
| 2321 | VAR | Lógico | Mostrar por defecto solo servicios activos en administración de titulares | sin lectura | Reemplazado: filtro por defecto de la vista guardada del DataTable | — | — | — | — | — | T03 / M01 |
| 2324 | VAR | Lógico | Impedir cargar socios sin cuentas asociadas | clsSocios.TransferirCuenta | Migrar | PRM-PER-P1-027 | per.titulares.exigirCuenta | boolean | tenant | false | M01 |
| 2329 | VAR | Lógico | Permite ingresar la vía de ingreso en altas y retiro de medidor | sin lectura | Reemplazado: todo trámite registra siempre el canal de ingreso (M09) | — | — | — | — | — | M09 |
| 2330 | VAR | Entero (FK `TRANSAC.COD_TRAN`) | Operación técnica por cambio de categoría en servicio | clsFacturacionServicio.CargarCacheOtsCambioCategoria; clsTecnica.PreSave_TECNICA (+13) | Migrar-servicio: tipo de OT que materializa el cambio de categoría (y dispara prorrateo) | PRM-CAT-P1-008 | cat.servicio.tipoOrdenCambioCategoria | ref:workOrderTypes | servicio | OT "Cambio de categoría" | M02 / M10 |
| 2343 | VAR | Lista (No exigir; Advertir; Exigir) | Validar número de certificado en la carga de un nuevo servicio | sin lectura | Migrar-servicio: certificado de instalación (instalador matriculado) | PRM-CAT-P1-009 | cat.servicio.alta.certificadoInstalacion | enum(noExigir, advertir, exigir) | servicio | noExigir | M02 / M10 |
| 2373 | VAR | Lógico | Autocompletar distrito al ingresar sección | sin lectura | Migrar | PRM-PER-P1-028 | per.cuentas.autocompletarDistritoDesdeSeccion | boolean | tenant | true | M01 / T04 |
| 2374 | VAR | Lógico | Exigir que los titulares tengan cuenta principal | sin lectura | Migrar | PRM-PER-P1-029 | per.titulares.exigirCuentaPrincipal | boolean | tenant | false | M01 |
| 2396 | VAR | Mixto: Texto | WEB - Zona para subir | clsCirculares.GetDatosCuentasSinDatos; clsWEB.SincronizarTitulares / SincronizarCuentas (+8) | Migrar: zonas habilitadas para el portal (despliegue gradual); vacío = todas | PRM-POR-P1-024 | por.habilitacion.zonasPermitidas | ref:billingZones[] | tenant | [] (todas) | M19 |
| 2397 | VAR | Mixto: Texto | WEB - Email aviso sincronización | clsWEB.IniciarProceso | Descartar: no hay sincronización | — | — | — | — | — | — |
| 2400 | VAR | Lógico | Permite dar de alta adherente que ya existe en un mismo servicio | clsWeb_CoopOnline.GetInfoAdherente | Migrar-servicio | PRM-CAT-P1-010 | cat.servicio.adherentes.permitirRepetido | boolean | servicio | false | M02 / M18 |
| 2401 | VAR | Lógico | Consultar el alta de los adherentes al reconectar un servicio | sin lectura | Migrar | PRM-PER-P1-030 | per.adherentes.consultarReactivacionAlReconectar | boolean | tenant | true | M01 / M08 |
| 2408 | VAR | Entero | Código de partido para exportador de tarifa social OCEBA | ExportarOCEBA_Facturacion; clsTarifaSocial.Export_OCEBA265 / OCEBA_NIS | Migrar | PRM-FIS-P1-016 | fis.reguladores.oceba.codigoPartido | string | tenant | — | M06 |
| 2428 | VAR | Texto | Fecha límite de alta de titular para asistencia a la asamblea | Imprimir_AsistenciaAsamblea; clsPadronTitular.Get_Padron | Reemplazado: atributo `fechaCortePadron` de la entidad Asamblea | — | — | — | — | — | M17 |
| 2429 | VAR | Texto | Fecha de la próxima asamblea | Imprimir_AsistenciaAsamblea; clsPadronTitular.Get_Padron (+2) | Reemplazado: entidad Asamblea con fecha y estado | — | — | — | — | — | M17 |
| 2430 | VAR | Lógico | Permitir solo titulares para la asistencia a la asamblea | sin lectura | Migrar (default de la asamblea, editable por asamblea) | PRM-INS-P1-005 | ins.asambleas.soloTitulares | boolean | tenant | true | M17 |
| 2434 | VAR | Lógico | No mostrar vista previa de comprobantes generados en caja | sin lectura | Migrar | PRM-COB-P1-011 | cob.caja.mostrarVistaPreviaComprobante | boolean | tenant / usuario | true | M07 |
| 2435 | VAR | Lógico | Seleccionar automáticamente el estado principal del servicio al dar de alta | sin lectura | Reemplazado: el estado inicial del contrato lo define la máquina de estados | — | — | — | — | — | T11 / M01 |
| 2455 | VAR | Lógico | Realizar cambio de categoría desde administración de titulares | clsSocios.AltasAutomaticas | Migrar: permitir cambio de categoría directo sin OT | PRM-PER-P1-031 | per.contratos.cambioCategoriaDirecto | boolean | tenant / servicio | false | M01 / M10 |
| 2460 | VAR | Mixto: Lógico | WEB - Mantener teléfono y correo web | clsWEB.SincronizarCuentas | Reemplazado: datos de contacto únicos con origen (portal/admin) y fecha; no hay dos copias | — | — | — | — | — | M01 |
| 2461 | VAR | Lógico | Actualizar domicilio de los servicios al modificar el domicilio de la cuenta | sin lectura | Migrar | PRM-PER-P1-032 | per.cuentas.propagarDomicilioAServicios | enum(no, preguntar, si) | tenant | preguntar | M01 |
| 2462 | VAR | Lógico | Solicitar siempre propiedades en el alta (no modificable en la OT) | sin lectura | Migrar-servicio | PRM-CAT-P1-011 | cat.servicio.alta.exigirInmueble | boolean | servicio | true | M02 / M01 |
| 2463 | VAR | Mixto: Lógico | WEB - Ruta accesible desde el servidor | frm_VisorMensajes.EnviarMail | Reemplazado: almacenamiento de objetos con URL firmadas | — | — | — | — | — | T11 |
| 2464 | VAR | Entero | Zona de lectura por defecto en alta de servicios medidos | sin lectura | Migrar | PRM-MED-P1-002 | med.rutas.zonaLecturaPorDefecto | ref:readingZones | tenant / servicio | vacío | M03 |
| 2469 | VAR | Lógico | Validar garantía al ingresar socios | sin lectura | Migrar (fusionado con 54: valor "advertir") | (= V2 #54) | per.titulares.controlGarantiaAlta | enum | tenant | — | M01 |
| 2477 | VAR | Lista (HP; kVA) | Descripción de lectura para administración de servicio | sin lectura | Migrar-servicio: unidad de potencia contratada | PRM-CAT-P1-012 | cat.servicio.unidadPotenciaContratada | enum(kW, kVA, HP) | servicio | kW | M02 / M04 |
| 2482 | VAR | Lógico | Validar deuda del domicilio y propiedad catastral | sin lectura | Migrar: control de deuda asociada al inmueble en el alta (se unifica con 2668) | PRM-PER-P1-033 | per.inmuebles.controlDeudaEnAlta | enum(noControlar, preguntar, bloquear) | tenant | preguntar | M01 / M07 |
| 2490 | VAR | Lista (No exigir; En alta; Siempre) | Exigir teléfono y mail en administración de cuentas y persona | clsSocios.ValidarDatosCuenta; abm_Personas.ValidarControles | Migrar: momento en que aplican 744/745 | PRM-PER-P1-034 | per.personas.momentoExigenciaContacto | enum(noExigir, enAlta, siempre) | tenant | enAlta | M01 |
| 2506 | VAR | Lista (No preguntar; Preguntar; Exigir) | Control de empresa postal en administración de cuentas | sin lectura | Migrar | PRM-PER-P1-035 | per.cuentas.controlEmpresaPostal | enum(noControlar, advertir, exigir) | tenant | noControlar | M01 / M05 |
| 2507 | VAR | Lógico | Exigir vía de ingreso al generar órdenes de trabajo | sin lectura | Reemplazado: canal de origen obligatorio en toda OT/trámite | — | — | — | — | — | M10 / M09 |
| 2509 | VAR | Lógico | Asignar acción a ejecutar en trámites | clsServicio_Procoop.AgregarTareasDinamicas; frmPTramites | Reemplazado: acciones automáticas por tipo de trámite en el motor de workflow | — | — | — | — | — | T11 / M09 |
| 2521 | VAR | Lógico | Permitir dar de baja adherentes repetidos (ofrecer baja del vínculo anterior) | sin lectura | Migrar | PRM-PER-P1-036 | per.adherentes.ofrecerBajaVinculoAnterior | boolean | tenant | true | M01 / M18 |
| 2522 | VAR | Lógico | Controlar impresión del formulario en la desconexión | sin lectura | Reemplazado: acta digital de corte firmada en la app de campo | — | — | — | — | — | M10 / M08 |
| 2527 | VAR | Texto | Edades mínima y máxima para un donante ("min;max") | abm_Personas2._ValidFields | Migrar | PRM-SOC-P1-008 | soc.bancoSangre.rangoEdadDonante | object {min: integer, max: integer} | tenant | {18, 65} | M18 |
| 2529 | VAR | Lógico | No exigir profesional y fecha de certificado en alta de servicios | sin lectura | Migrar-servicio (aplica si hay certificado; ver 2343) | PRM-CAT-P1-013 | cat.servicio.alta.certificadoExigeProfesionalYFecha | boolean | servicio | true | M02 |
| 2532 | VAR | Lógico | Consultar si desea imprimir contrato de alta de servicio | sin lectura | Reemplazado: contrato generado en PDF al expediente y enviado para firma | — | — | — | — | — | T11 / M01 |
| 2534 | VAR_PMOVIL/CoopOnline | Lógico | Sincronizar facturas adeudadas subidas al MySQL | clsWEB.SincronizarPagos | Reemplazado: lectura en línea (sin MySQL externa) | — | — | — | — | — | M19 |
| 2535 | VAR | Lógico | Consultar si desea imprimir informe de baja de servicio | sin lectura | Reemplazado: constancia de baja PDF automática al expediente | — | — | — | — | — | T11 / M01 |
| 2540 | VAR | Entero | Dígitos de medidor por defecto en alta | sin lectura | Migrar | PRM-MED-P1-003 | med.medidores.digitosPorDefecto | integer | tenant / servicio | 5 | M03 |
| 2541 | VAR | Lógico | Marcar servicio histórico como "No Vigente" al transferir | clsSocios.TransferirServicio | Reemplazado: siempre ocurre (ver 422) | — | — | — | — | — | M01 |
| 2544 | VAR | Lista (No controlar; Controlar; Exigir) | Control de garante en administración de cuenta | sin lectura | Migrar | PRM-PER-P1-037 | per.cuentas.controlGarante | enum(noControlar, advertir, exigir) | tenant / servicio | noControlar | M01 / M08 |
| 2545 | VAR | Lógico | Controlar deuda de adherentes | sin lectura | Migrar | PRM-PER-P1-038 | per.adherentes.controlarDeuda | boolean | tenant | false | M01 / M07 |
| 2550 | VAR | Lista (No permitir; Controlar; Permitir) | Administrar consumos de servicios dados de baja | sin lectura | Migrar | PRM-MED-P1-004 | med.consumos.serviciosDadosDeBaja | enum(noPermitir, advertir, permitir) | tenant | noPermitir | M03 |
| 2552 | VAR | Lógico | Permitir transferencias de cuenta a socios dados de baja | sin lectura | Migrar | PRM-PER-P1-039 | per.transferencias.permitirDestinoDadoDeBaja | boolean | tenant | false | M01 |
| 2556 | VAR | Lógico | Mostrar número de comprobante con formato simple en consulta de consumo | sin lectura | Descartar: formato visual; el número de comprobante usa el formato estándar único (T03) | — | — | — | — | — | — |
| 2557 | VAR | Lógico | Mostrar observación del servicio en administración de titulares | DetalleServicio; clsConsultaInfoSocio.GetDatosSersoc | Reemplazado: columna configurable en DataTable/ficha | — | — | — | — | — | T03 / M01 |
| 2558 | VAR | Lista (No controlar; Controlar; Exigir) | Control de la fecha en movimientos de tesorería y bancos con la fecha del servidor | sin lectura | Migrar | PRM-TES-P1-002 | tes.movimientos.controlFechaVsServidor | enum(noControlar, advertir, exigir) | tenant | advertir | M14 |
| 2563 | VAR | Lista (No; Sí; Solo recorrido factura; Solo recorrido lectura) | Mostrar localidad en el formulario de búsqueda de recorrido | frmBusquedaRecorridos.LoadGrid | Reemplazado: columnas configurables del DataTable | — | — | — | — | — | T03 |
| 2571 | VAR | Lógico | Informar si el titular sin servicios es adherente, beneficiario o garante (al desconectar) | sin lectura | Migrar | PRM-PER-P1-040 | per.contratos.baja.alertarRolesVigentes | boolean | tenant | true | M01 |
| 2575 | VAR | Numérico (FK `PROD_SER.COD_PRO`) | Concepto asociado a rescate de acciones | sin lectura | Migrar | PRM-INS-P1-006 | ins.capital.conceptoRescate | ref:products | tenant | — | M17 |
| 2576 | VAR | Numérico (FK `COMPROB.COD_COM`) | Comprobante para rescate de acciones | sin lectura | Migrar | PRM-INS-P1-007 | ins.capital.tipoComprobanteRescate | ref:voucherTypes | tenant | — | M17 |
| 2580 | VAR | Entero (FK `PLANTILLA.COD_PLA`) | Contrato asociado a solicitud de baja de titular | sin lectura | Migrar | PRM-PER-P1-041 | per.titulares.plantillaSolicitudBaja | ref:documentTemplates | tenant | plantilla estándar | M01 / T11 |
| 2581 | VAR | Entero (FK `SERVICIO.COD_SER`) | Servicio correspondiente a dispenser | sin lectura | Migrar-servicio: marca de servicio "dispenser de agua" (habilita reglas 2582–2584) | PRM-CAT-P1-014 | cat.servicio.dispenser.habilitado | boolean | servicio | false | M02 |
| 2582 | VAR | Numérico | Límite diario para retirar agua del dispenser (litros) | clsDispenser.Get_Sersoc | Migrar-servicio | PRM-CAT-P1-015 | cat.servicio.dispenser.limiteDiarioLitros | decimal | servicio | — | M02 |
| 2583 | VAR | Entero | Días para cálculo de deuda (dispenser) | clsDispenser.Get_Sersoc | Migrar-servicio: antigüedad de deuda que bloquea el retiro | PRM-CAT-P1-016 | cat.servicio.dispenser.diasDeudaBloqueo | integer | servicio | 30 | M02 / M08 |
| 2584 | VAR | Numérico | Cantidad de litros por atención (dispenser) | clsDispenser.Get_Sersoc / Exedente_ConsumoMensual | Migrar-servicio | PRM-CAT-P1-017 | cat.servicio.dispenser.litrosPorAtencion | decimal | servicio | — | M02 |
| 2588 | VAR | Lógico | Solicitar cambio de contraseña con clave genérica | frmLogin.cmdAceptar_Click | Reemplazado: sin claves genéricas; alta por invitación (ver 3131) | — | — | — | — | — | T02 |
| 2591 | VAR | Lógico | Cargar nuevos socios como NO ACTIVOS por defecto | sin lectura | Migrar | PRM-PER-P1-042 | per.titulares.estadoInicial | enum(activo, noActivo) | tenant | noActivo hasta aprobación (si hay workflow) | M01 / M17 |
| 2599 | VAR | Lógico | Permitir transferir servicios dados de baja | sin lectura | Migrar | PRM-PER-P1-043 | per.transferencias.permitirServiciosDadosDeBaja | boolean | tenant | false | M01 |
| 2602 | VAR | Entero | Código de localidad para exportador de facturación OCEBA | ExportarOCEBA_Facturacion | Migrar | PRM-FIS-P1-017 | fis.reguladores.oceba.codigoLocalidad | string | tenant | — | M06 |
| 2606 | VAR | Numérico | Valor a partir del cual se considera deuda de capital | clsPadronTitular.Get_Padron; clsSocios_Capital.TieneDeudaCapital | Migrar: umbral de tolerancia de deuda de capital (padrón y derechos de asamblea) | PRM-INS-P1-008 | ins.capital.umbralDeudaCapital | money | tenant | 0 | M17 |
| 2608 | VAR | Lógico | Obtener el padrón de titulares con la versión anterior | sin lectura | Descartar: compatibilidad con versión anterior de ProCoop | — | — | — | — | — | — |
| 2610 | VAR | Lógico | Cargar vista simple en formulario de titulares | sin lectura | Descartar: variante de layout de escritorio (la ficha web tiene diseño único responsive) | — | — | — | — | — | — |
| 2616 | VAR | Texto | Fecha de la próxima asamblea para el título del padrón | sin lectura | Reemplazado: el padrón toma la fecha de la entidad Asamblea | — | — | — | — | — | M17 |
| 2623 | VAR | Lógico | Permitir cargar débito automático sin exigir los demás datos | sin lectura | Migrar | PRM-COB-P1-012 | cob.debitoAutomatico.permitirAltaIncompleta | boolean | tenant | false | M07 |
| 2633 | VAR | Lógico | Permitir dar de baja a socios sin cuenta | sin lectura | Migrar | PRM-PER-P1-044 | per.titulares.permitirBajaSinCuenta | boolean | tenant | true | M01 |
| 2636 | VAR | Lógico | El capital se suscribe en la afiliación | clsCierreDiario.GenerarAsientoCapital / Capital / CapitalReserva | Migrar (fusionado con 73: valor "enAfiliacion") | (= V2 #73) | ins.capital.momentoSuscripcion | enum | tenant | — | M17 / M15 |
| 2642 | VAR | Lógico | Permitir marcar "Enviar factura electrónica" automáticamente en las cuentas | abm_Servicio.ConfigurarForm | Migrar | PRM-FAC-P1-004 | fac.distribucion.adhesionDigitalAutomatica | boolean | tenant | false (requiere email válido y consentimiento) | M05 |
| 2660 | VAR | Lógico | Permitir indicar número de titular manualmente para titulares activos | sin lectura | Migrar (A validar PA-CFG-P1-01) | PRM-PER-P1-045 | per.titulares.numeroManualPermitido | boolean | tenant | false | M01 / T04 |
| 2668 | VAR | Lógico | Validar deuda del domicilio y propiedad catastral (pregunta) | sin lectura | Migrar (fusionado con 2482: valor "preguntar") | (= V2 #2482) | per.inmuebles.controlDeudaEnAlta | enum | tenant | — | M01 |
| 2669 | VAR | Lógico | Validar deuda VENCIDA del domicilio y propiedad catastral | clsSocios_Capital.Validar_DeudaDomicilio | Migrar: el control de 2482 considera solo deuda vencida | PRM-PER-P1-046 | per.inmuebles.controlDeudaSoloVencida | boolean | tenant | true | M01 / M07 |
| 2673 | VAR | Lógico | Tener en cuenta campo ACTIVOBAJA para el alta de socios | clsSocios.GetIdSocio | Reemplazado: numeración de titulares por secuencias configurables de T04 (A validar PA-CFG-P1-01) | — | — | — | — | — | T04 / M01 |
| 2675 | VAR | Lógico | WEB - No sincronizar PDF de guía telefónica | clsWEB.SincronizarPdfGuiaTelefonica | Migrar (semántica invertida) | PRM-POR-P1-025 | por.secciones.guiaTelefonicaHabilitada | boolean | tenant | false | M19 / M10 |
| 2676 | VAR | Texto | Separador de datos en el lector de DNI | frmEscanerCodigoDNI | Migrar: separador del código PDF417 del DNI leído por escáner/cámara | PRM-PER-P1-047 | per.personas.lectorDni.separador | string (1 carácter) | tenant | "@" | M01 |
| 2689 | VAR | Fecha (texto) | Utilizar sincronización por webservice (desde fecha) | clsWEB.IniciarProceso / SincronizarFacturas | Reemplazado: sin sincronización | — | — | — | — | — | M19 |
| 2693 | VAR | Lógico | Enviar SMS con el sistema P10 SMS | clsRegistracionCobranza.RegistrarPago; clsTecnica.SendSMS; clsMensaje (+8) | Migrar: canal SMS habilitado para el tenant | PRM-COM-P1-004 | com.canales.smsHabilitado | boolean | tenant | false | T09 |
| 2696 | VAR | Texto | URL del webservice para envío de SMS | clsServicio_Procoop.EnviarSMS / RegistrarWSP_WS | Migrar: endpoint del proveedor de SMS en la conexión de integración (no secreto) | PRM-INT-P1-008 | int.sms.endpointUrl | url | tenant | definido por proveedor | T06 |
| 2707 | VAR | Lógico | Actualizar fecha de alta al reconectar un servicio no medido en el mismo mes de la desconexión | clsSocios.Reconectar_SERSOC | Migrar | PRM-MOR-P1-006 | mor.reconexion.mismoMesReiniciaFechaAlta | boolean | tenant / servicio | false | M08 / M04 |
| 2710 | VAR | Lógico | Validar mismo domicilio para el servicio | sin lectura | Migrar | PRM-PER-P1-048 | per.contratos.validarDomicilioIgualCuenta | boolean | tenant | false | M01 |
| 2711 | VAR | Entero | Identificador de empresa eléctrica | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar | PRM-FIS-P1-018 | fis.reguladores.secretariaEnergia.idEmpresaElectrica | string | tenant | — | M06 |
| 2715 | VAR | Lógico | Permitir cargar servicios no medidos iguales en una misma cuenta | sin lectura | Migrar-servicio (fusionado con 2269) | (= V2 #2269) | cat.servicio.permitirVariosPorCuenta | boolean | servicio | — | M02 |
| 2716 | VAR | Lógico | Permitir reservar capital mayor al importe pagado (integrado) | sin lectura | Migrar | PRM-INS-P1-009 | ins.capital.permitirReservaMayorIntegrado | boolean | tenant | false | M17 |
| 2717 | VAR | Entero | Columna de categoría en archivo de segmentación de energía | clsSegmentacion.Importar_Energia / RASE / BSAS | Reemplazado: perfiles de importación guardados del ExcelImportWizard (mapeo de columnas y clave de cruce) | — | — | — | — | — | M04 / T03 |
| 2718 | VAR | Lista (General; Córdoba; EPRE; BS AS - NIS) | Formato de exportación de archivo de usuarios de energía | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar | PRM-FIS-P1-019 | fis.reguladores.archivoUsuariosEnergia.formato | enum(general, cordoba, epre, bsAsNis) | tenant | general | M06 |
| 2724 | VAR | Entero | Columna de categoría en archivo de segmentación de gas | clsSegmentacion.Importar_Gas | Reemplazado: perfil de importación (ver 2717) | — | — | — | — | — | M04 / T03 |
| 2738 | VAR | Lógico | Exigir grupo contable en alta de cuenta | sin lectura | Migrar | PRM-PER-P1-049 | per.cuentas.exigirGrupoContable | boolean | tenant | false | M01 / M15 |
| 2740 | VAR | Lógico | No permitir dos conexiones con categorías sociales de un mismo servicio en un asociado | clsSegmentacion.Recategorizar; clsSocios.ValidarServicio | Migrar | PRM-TAR-P1-002 | tar.tarifaSocial.unaConexionSocialPorAsociadoYServicio | boolean | tenant | true | M04 / M01 |
| 2744 | VAR | Lógico | Mostrar observaciones de cuenta en la búsqueda de titulares | clsSocios.GetGridView_Consulta; frmSeleccionar_InfoSocios | Reemplazado: columnas configurables del buscador | — | — | — | — | — | T03 / M01 |
| 2745 | VAR | Lógico | Máximo de caracteres permitidos para envíos de SMS | frmPlantillaEditor (contador) | Migrar: limitar longitud del SMS en el editor de plantillas | PRM-COM-P1-005 | com.sms.limiteCaracteres | integer (0 = sin límite) | tenant | 160 | T09 |
| 2748 | VAR | Lista (EPRE; EPRE 06 y 07 MEyM) | Formato de exportación de archivo EPRE | clsTarifaSocial.Export_EPRE | Migrar | PRM-FIS-P1-020 | fis.reguladores.epre.formatoArchivo | enum(epre, epreMeym0607) | tenant | epre | M06 |
| 2749 | VAR | Lógico | Permitir columnas repetidas en informe de consumos agrupados por tramos y categorías | clsInformes_Consumos.Validar_Informe | Migrar | PRM-BIA-P1-001 | bia.informes.consumosTramosCategorias.permitirColumnasRepetidas | boolean | tenant | false | T10 |
| 2753 | VAR | Lógico | Asignar estado no vigente al eliminar OT de alta | clsTecnica.PreDelete_TECNICA | Reemplazado: la OT de alta se anula (no se elimina) y el contrato pasa a "no vigente" por la máquina de estados | — | — | — | — | — | T11 / M10 |
| 2755 | VAR | Numérico | Día límite de facturación para cobrar proporcional por cambio de categoría | clsTecnica.PreSave_TECNICA | Migrar | PRM-TAR-P1-003 | tar.prorrateo.diaLimiteCambioCategoria | integer (1–31) | tenant / servicio | 15 | M04 |
| 2781 | VAR | Lógico | Permitir seleccionar contratos para imprimir | sin lectura | Reemplazado: selección libre de documentos del expediente | — | — | — | — | — | T11 |
| 2782 | VAR | Lógico | Conceptos a cobrar por transferencia de servicio a cuenta destino | sin lectura | Migrar-servicio: cargos de transferencia se facturan a la cuenta destino | PRM-CAT-P1-018 | cat.servicio.transferencia.cobrarCargosEnDestino | boolean | servicio | true | M02 / M04 |
| 2785 | VAR | Fecha (texto) | Fecha de cierre de capital | Nucleo.GetFechaCierre; frmOpcionesEspeciales | Reemplazado: cierre de período de capital con estado y bloqueo | — | — | — | — | — | M17 / M15 |
| 2792 | VAR | Entero (FK `TIPO_FAC.COD_TPFC`) | Tipo de factura para el rescate de acciones | clsSocios_Capital.Rescate_Acciones | Migrar | PRM-INS-P1-010 | ins.capital.tipoFacturaRescate | ref:voucherTypes | tenant | — | M17 |
| 2797 | VAR | Numérico | Consumo medio para recategorización | clsSegmentacion.Importar_Energia | Migrar (versionado) | PRM-TAR-P1-004 | tar.segmentacion.consumoMedioRecategorizacion | decimal (kWh) | tenant / servicio | — | M04 |
| 2817 | VAR | Entero | WEB - Eliminar archivos antiguos en carpeta subidos | clsWEB.EliminarSubidasAnteriores | Descartar: sin carpeta de intercambio web | — | — | — | — | — | — |
| 2821 | VAR | Lógico | Permitir establecer cargos fijos por tramo desde tarifas | clsFacturacionServicio.GetImporteCF; abm_Servicio_Cattarif | Migrar-servicio: atributo del cuadro tarifario | PRM-TAR-P1-005 | tar.cuadro.cargoFijoPorTramo | boolean | categoría / cuadro tarifario | false | M04 |
| 2823 | VAR | Texto | Código de distribuidora OCEBA | EditarExcelPlanillaDDJJ_Oceba; ExportarCSV_OCEBA (+5) | Migrar | PRM-FIS-P1-021 | fis.reguladores.oceba.codigoDistribuidora | string | tenant | — | M06 |
| 2824 | VAR | Lista (Registrados CoopOnline; Del titular; Ambos) | Número destino de SMS/WhatsApp | Correspondencia.GetDestino_NumeroDestinoSMS (+6) | Migrar | PRM-COM-P1-006 | com.mensajeria.telefonoDestino | enum(portal, titular, ambos) | tenant | portal | T09 |
| 2825 | VAR | Lógico | Incluir servicios desconectados en importación de segmentación | clsSegmentacion.Importar / Importar_Energia (+4) | Migrar | PRM-TAR-P1-006 | tar.segmentacion.importacion.incluirDesconectados | boolean | tenant | false | M04 |
| 2830 | VAR | Lógico | Informar COD_SOC en archivo de segmentación | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar | PRM-FIS-P1-022 | fis.reguladores.archivoUsuariosEnergia.incluirNumeroTitular | boolean | tenant | false | M06 |
| 2832 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto cargo fijo - OCEBA | clsInformes_Consumos.GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio: mapeo regulatorio en el producto | PRM-CAT-P1-019 | cat.productos.mapeoRegulatorio.oceba544.cargoFijo | ref:products[] (marca en producto) | producto | — | M02 / M06 |
| 2833 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto subsidio - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-020 | cat.productos.mapeoRegulatorio.oceba544.subsidio | ref:products[] | producto | — | M02 / M06 |
| 2834 | VAR | Texto (lista) | Productos impuestos - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-021 | cat.productos.mapeoRegulatorio.oceba544.impuestos | ref:products[] | producto | — | M02 / M06 |
| 2835 | VAR | Texto | Código OCEBA distribuidora, declaración jurada mensual | clsInformes_Consumos.Editar_ExcelOCEBA | Migrar | PRM-FIS-P1-023 | fis.reguladores.oceba.codigoDdjjMensual | string | tenant | — | M06 |
| 2837 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto potencia pico - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-022 | cat.productos.mapeoRegulatorio.oceba544.potenciaPico | ref:products[] | producto | — | M02 / M06 |
| 2838 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto potencia fuera de pico - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-023 | cat.productos.mapeoRegulatorio.oceba544.potenciaFueraPico | ref:products[] | producto | — | M02 / M06 |
| 2839 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto demanda pico - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-024 | cat.productos.mapeoRegulatorio.oceba544.demandaPico | ref:products[] | producto | — | M02 / M06 |
| 2840 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto demanda resto - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-025 | cat.productos.mapeoRegulatorio.oceba544.demandaResto | ref:products[] | producto | — | M02 / M06 |
| 2841 | VAR | Texto (lista) | Productos energía valle - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-026 | cat.productos.mapeoRegulatorio.oceba544.energiaValle | ref:products[] | producto | — | M02 / M06 |
| 2842 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto demanda fuera de pico - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-027 | cat.productos.mapeoRegulatorio.oceba544.demandaFueraPico | ref:products[] | producto | — | M02 / M06 |
| 2843 | VAR | Lista (Ninguno; COD_SUM; ID_SERSOC) | Campo a buscar en archivo de segmentación | clsSegmentacion.Importar_Energia | Reemplazado: clave de cruce del perfil de importación (ver 2717) | — | — | — | — | — | M04 / T03 |
| 2844 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto pérdida por transformador - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-028 | cat.productos.mapeoRegulatorio.oceba544.perdidaTransformador | ref:products[] | producto | — | M02 / M06 |
| 2845 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto coseno de fi - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-029 | cat.productos.mapeoRegulatorio.oceba544.cosenoFi | ref:products[] | producto | — | M02 / M06 |
| 2846 | VAR | Texto (lista) | Productos bonificación - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-030 | cat.productos.mapeoRegulatorio.oceba544.bonificacion | ref:products[] | producto | — | M02 / M06 |
| 2847 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto exceso potencia fuera de pico - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-031 | cat.productos.mapeoRegulatorio.oceba544.excesoPotenciaFueraPico | ref:products[] | producto | — | M02 / M06 |
| 2848 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto exceso potencia pico - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-032 | cat.productos.mapeoRegulatorio.oceba544.excesoPotenciaPico | ref:products[] | producto | — | M02 / M06 |
| 2849 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto exceso energía reactiva - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-033 | cat.productos.mapeoRegulatorio.oceba544.excesoEnergiaReactiva | ref:products[] | producto | — | M02 / M06 |
| 2850 | VAR | Numérico | Porcentaje a destinar al cargo fijo - OCEBA | EditarExcelPlanillaDDJJ_Oceba | Migrar | PRM-FIS-P1-024 | fis.reguladores.oceba.porcentajeCargoFijo | percent | tenant | — | M06 |
| 2851 | VAR | Numérico (FK `CATE_SER.COD_CATSER`) | Categoría de servicio para generar archivo de cuadro tarifario - RASE | clsCirculares.Get_CuadroTarifario_Rase | Migrar-servicio: marca en la categoría | PRM-CAT-P1-034 | cat.categorias.mapeoRegulatorio.rase.cuadroTarifario | boolean (marca en categoría) | categoría | false | M02 / M06 |
| 2852 | VAR | Lógico | Generar archivo de cuadro tarifario - RASE | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar | PRM-FIS-P1-025 | fis.reguladores.rase.generarCuadroTarifario | boolean | tenant | false | M06 |
| 2853 | VAR | Entero | Cantidad de líneas en archivo de CT - RASE | clsCirculares.GenerarCuadroTarifario / Get_CuadroTarifario_Rase | Migrar | PRM-FIS-P1-026 | fis.reguladores.rase.lineasCuadroTarifario | integer | tenant | — | M06 |
| 2855 | VAR | Lógico | Registrar capital a través del agente | clsFacturacionMasiva.GenerarFacturacion; clsSocios_Capital.Guardar_CAPITAL (+5) | Reemplazado: la registración de capital se procesa siempre de forma asíncrona por evento/outbox y job `ins:registrar-capital` | — | — | — | — | — | M17 / T11 |
| 2858 | VAR | Lógico | Búsqueda por COD_SUM y DNI en importación de tarifa social | clsTarifaSocial.Importar_Energia_LIA | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 2859 | VAR | Lógico | Generar archivos de Secretaría de Energía en formato .xlsx | sin lectura | Migrar | PRM-FIS-P1-027 | fis.reguladores.secretariaEnergia.formatoArchivo | enum(xlsx, txt) | tenant | xlsx | M06 |
| 2868 | VAR | Entero (FK `PROD_SER.COD_PRO`) | Producto energía inyectada - OCEBA | GetProductosConfigurados544; GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-035 | cat.productos.mapeoRegulatorio.oceba544.energiaInyectada | ref:products[] | producto | — | M02 / M06 |
| 2875 | VAR | Lógico | Informe de consumos agrupados por tramos y categorías - coincidir total con detalle | clsConsumosTramasCategorias.Get_Informe_DetallesFilas / ExportarExcel_DetalleConceptos | Migrar | PRM-BIA-P1-002 | bia.informes.consumosTramosCategorias.totalIgualDetalle | boolean | tenant | true | T10 |
| 2884 | VAR | Lógico | Permitir editar contenido de plantillas en envíos unitarios | frm_VisorMensajes_Load | Migrar | PRM-COM-P1-007 | com.envios.permitirEditarPlantillaEnvioUnitario | boolean | tenant | true | T09 |
| 2887 | VAR | Lógico | Archivo subsidio VAD OCEBA - informar período distinto al de facturación | sin lectura | Migrar: período informado en el archivo VAD (se unifica con 2889) | PRM-FIS-P1-028 | fis.reguladores.oceba.vad.periodoInformado | enum(periodoFacturacion, periodoDistinto, mesEmision) | tenant | periodoFacturacion | M06 |
| 2889 | VAR | Lógico | Archivo subsidio VAD OCEBA - informar mes de fecha de emisión como período | clsCirculares.GenerarArchivoFacturacionOCEBA_NuevaCircular | Migrar (fusionado con 2887: valor "mesEmision") | (= V2 #2887) | fis.reguladores.oceba.vad.periodoInformado | enum | tenant | — | M06 |
| 2892 | VAR | Lógico | Permitir calcular/actualizar precio de producto en el presupuesto | sin lectura | Migrar | PRM-VEN-P1-004 | ven.presupuestos.permitirActualizarPrecio | boolean | tenant | true | M11 |
| 2894 | VAR | Entero | Persona por defecto al crear un nuevo presupuesto | sin lectura | Migrar | PRM-VEN-P1-005 | ven.presupuestos.personaPorDefecto | ref:persons | tenant | persona genérica "Consumidor final" | M11 |
| 2898 | VAR | Texto (lista) | Productos bonificación electrodependiente - OCEBA | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-036 | cat.productos.mapeoRegulatorio.oceba544.bonificacionElectrodependiente | ref:products[] | producto | — | M02 / M06 |
| 2900 | VAR | Lógico | Selecciona grupo de obra | sin lectura | Migrar: exigir/seleccionar grupo de obra al registrar obras | PRM-TEC-P1-005 | tec.obras.exigirGrupoObra | boolean | tenant | false | M10 |
| 2904 | VAR | Texto | Mail por defecto para copia oculta en envíos masivos | frm_VisorMensajes_Load | Migrar | PRM-COM-P1-008 | com.envios.emailCopiaOcultaMasivos | email[] | tenant | [] | T09 |
| 2918 | VAR | Lógico | Visualizar dirección postal y domicilio completo en ABM de titulares | clsCuentas.GetDescripcion | Reemplazado: la ficha de cuenta muestra siempre domicilio de suministro y postal | — | — | — | — | — | M01 |
| 2923 | VAR | Lógico | Utilizar importador ARBA para percepciones y retenciones de ATER (RN 208/24 y 234/24) | clsCuentas.ImportarIIBB_BsAs; frmLiquidacionPercepciones_BsAs | Migrar: el padrón de Entre Ríos (ATER) se importa con el formato ARBA | PRM-FIS-P1-029 | fis.iibb.entreRios.padronFormatoArba | boolean | tenant | false | M06 |
| 2927 | VAR | Lógico | Utilizar N° NIS como identificador en archivos de tarifa social y segmentación | sin lectura | Migrar | PRM-TAR-P1-007 | tar.segmentacion.identificadorSuministro | enum(numeroSuministro, nis, numeroMedidor) | tenant | numeroSuministro | M04 |
| 2934 | VAR | Lógico | Formato solo números para los teléfonos en titulares | sin lectura | Reemplazado: teléfonos normalizados a E.164 con validación | — | — | — | — | — | M01 |
| 2937 | VAR | Texto | Razón social de distribuidora para archivo Res SE N° 431/24 | EditarPlanillaRes_431_24 / Res_65_25; GenerarXlsxCompensacion (+1) | Migrar | PRM-FIS-P1-030 | fis.reguladores.secretariaEnergia.razonSocialDistribuidora | string | tenant | = razón social | M06 |
| 2938 | VAR | Lógico | Generar archivo de consumos - RASE | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar | PRM-FIS-P1-031 | fis.reguladores.rase.generarArchivoConsumos | boolean | tenant | false | M06 |
| 2941 | VAR | Lógico | Exigir fecha de nacimiento o fecha de alta en ABM de personas | abm_Personas.ValidarControles | Migrar | PRM-PER-P1-050 | per.personas.exigirFechaNacimientoOAlta | boolean | tenant | false | M01 |
| 2945 | VAR | Lógico | OCEBA - utilizar NIS como identificador de suministros | clsCirculares.GenerarArchivoClientesOceba / FacturacionOCEBA (+1) | Migrar | PRM-FIS-P1-032 | fis.reguladores.oceba.identificadorSuministro | enum(numeroSuministro, nis) | tenant | numeroSuministro | M06 |
| 2946 | VAR | Lógico | Búsqueda por número de medidor y DNI en importación de tarifa social | clsTarifaSocial.Importar_Energia_LIA | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 2948 | VAR | Lógico | 544 OCEBA - (NO DESARROLLADO) informar consumos bimestrales | clsInformes_Consumos.CompletarPlanillaDDJJ | Reemplazado: la periodicidad del informe se deriva del ciclo de facturación del servicio | — | — | — | — | — | M06 / M05 |
| 2950 | VAR | Lógico | MIS PAGOS - no exportar archivo de alta de CBU | E_Credicoop.Exportar | Migrar | PRM-COB-P1-013 | cob.entes.credicoopMisPagos.exportarAltaCbu | boolean | ente | true | M07 |
| 2961 | VAR | Numérico | Tarifa social - columna NIS en modelo de importación OCEBA (NIS) | clsTarifaSocial.Importar_Energia_OCEBA_NIS | Reemplazado: perfil de importación | — | — | — | — | — | M04 / T03 |
| 2962 | VAR | Numérico | OCEBA - porcentaje coseno de fi T2 | GetConceptosFacturadosYCalculados; EditarExcelPlanillaDDJJ_Oceba | Migrar | PRM-FIS-P1-033 | fis.reguladores.oceba.porcentajeCosenoFiT2 | percent | tenant | — | M06 |
| 2963 | VAR | Numérico | OCEBA - porcentaje coseno de fi T3 | GetConceptosFacturadosYCalculados; EditarExcelPlanillaDDJJ_Oceba | Migrar | PRM-FIS-P1-034 | fis.reguladores.oceba.porcentajeCosenoFiT3 | percent | tenant | — | M06 |
| 2964 | VAR | Lógico | Tarifa social - búsqueda por NIS en modelo Energía OCEBA segmentado | clsTarifaSocial.Importar_Energia_OCEBA_Segmentado | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 2965 | VAR | Entero | Tarifa social - columna NIS en modelo Energía OCEBA segmentado | clsTarifaSocial.Importar_Energia_OCEBA_Segmentado | Reemplazado: perfil de importación | — | — | — | — | — | M04 / T03 |
| 2968 | VAR | Lógico | Agrupar por TIP_ENE en informe de consumos agrupados por tramos y categorías | sin lectura | Migrar | PRM-BIA-P1-003 | bia.informes.consumosTramosCategorias.agruparPorTipoEnergia | boolean | tenant | false | T10 |
| 2974 | VAR | Lógico | Informar consumos mensuales en archivo Res SE N° 431/24 | clsInformes_Consumos.EditarPlanillaRes_431_24 | Migrar | PRM-FIS-P1-035 | fis.reguladores.secretariaEnergia.res43124ConsumosMensuales | boolean | tenant | false | M06 |
| 2976 | VAR | Entero | Columna de número de medidor en archivo de segmentación de energía Bs. As. | clsSegmentacion.ImportarEnergia_BSAS | Reemplazado: perfil de importación | — | — | — | — | — | M04 / T03 |
| 2979 | VAR | Lógico | Alertar si el CUIT de la persona no es correcto al confirmar ABM de titulares | sin lectura | Migrar | PRM-PER-P1-051 | per.titulares.validarCuit | enum(noValidar, advertir, bloquear) | tenant | advertir | M01 |
| 2986 | VAR | Texto (lista) | Archivo de consumos RASE - productos para el cálculo del subsidio | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales_Xlsx / EscribirLineaConsumo | Migrar-servicio | PRM-CAT-P1-037 | cat.productos.mapeoRegulatorio.rase.subsidio | ref:products[] | producto | — | M02 / M06 |
| 3011 | VAR | Numérico (FK `IMPUESTO.COD_IMP`) | OCEBA control 544 - concepto de Ley 5,5 % | ChequeosPrevios544; GetConceptosFacturadosYCalculados | Migrar: mapeo regulatorio en el impuesto | PRM-FIS-P1-036 | fis.impuestos.mapeoRegulatorio.oceba544.ley55 | ref:taxes | tenant | — | M06 |
| 3012 | VAR | Numérico (FK `IMPUESTO.COD_IMP`) | OCEBA control 544 - concepto de Ley 3,5 | ChequeosPrevios544; GetConceptosFacturadosYCalculados | Migrar | PRM-FIS-P1-037 | fis.impuestos.mapeoRegulatorio.oceba544.ley35 | ref:taxes | tenant | — | M06 |
| 3013 | VAR | Texto (lista) | Archivo de usuarios y suministros eléctricos - productos a informar en columna sin impuestos | clsCirculares.ExportarArchivoSumyUsu_ElectricosResidenciales | Migrar-servicio | PRM-CAT-P1-038 | cat.productos.mapeoRegulatorio.secretariaEnergia.sinImpuestos | ref:products[] | producto | — | M02 / M06 |
| 3014 | VAR | Entero | Archivo clientes y facturación OCEBA: caracteres de la columna identificador | GenerarArchivoClientesOceba / FacturacionOCEBA | Migrar | PRM-FIS-P1-038 | fis.reguladores.oceba.longitudIdentificador | integer | tenant | — | M06 |
| 3017 | VAR | Texto (lista) | OCEBA 544 - códigos de impuestos de leyes a facturar | Get_Filtros544 | Migrar | PRM-FIS-P1-039 | fis.impuestos.mapeoRegulatorio.oceba544.leyesAFacturar | ref:taxes[] | tenant | [] | M06 |
| 3022 | VAR | Lógico | Consumos agrupados por tramos y categorías - agrupar por período | sin lectura | Migrar | PRM-BIA-P1-004 | bia.informes.consumosTramosCategorias.agruparPorPeriodo | boolean | tenant | false | T10 |
| 3027 | VAR | Lógico | Informar capital anterior en registro de asociados | clsPadronTitular.Get_Informe_RegistroAsociados; frmSelectFechaCapital | Migrar | PRM-INS-P1-011 | ins.registroAsociados.informarCapitalAnterior | boolean | tenant | true | M17 |
| 3045 | VAR | Entero | OCEBA archivo FDU - longitud de campo identificador | GenerarArchivoFacturacionOCEBA_NuevaCircular | Migrar | PRM-FIS-P1-040 | fis.reguladores.oceba.fdu.longitudIdentificador | integer | tenant | — | M06 |
| 3058 | VAR | Lógico | Filtrar quitando adherentes dados de baja por fallecimiento en la ficha | clsServicio.GetDatosFicha | Reemplazado: filtro de estado en la sección adherentes de la ficha (por defecto solo vigentes) | — | — | — | — | — | M01 / M18 |
| 3066 | VAR | Lógico | Incluir columna TOTAL FACTURADO en Excel con detalle de cuentas | clsConsumosTramasCategorias.ExportarExcel_DetalleCuentasExcel | Migrar | PRM-BIA-P1-005 | bia.informes.consumosTramosCategorias.incluirTotalFacturado | boolean | tenant | true | T10 |
| 3074 | VAR | Lista (ID Telemedición; N° Medidor) | Identificador de lecturas para medidores Rainbow | clsDetalleRuta.ImportarLecturas | Migrar | PRM-MED-P1-005 | med.telemedicion.rainbow.identificador | enum(idTelemedicion, numeroMedidor) | tenant | idTelemedicion | M03 |
| 3075 | VAR | Entero | Columna de consumo convencional en archivo de lecturas Rainbow | clsDetalleRuta.ImportarLecturas | Reemplazado: perfil de importación de lecturas | — | — | — | — | — | M03 / T03 |
| 3088 | VAR | Lista (WhatsApp; Email; SMS) | Notificar a responsables al enviar/generar OT vía | clsTecnica.EnviarMensajes | Migrar | PRM-TEC-P1-006 | tec.ordenes.canalNotificacionResponsables | enum(whatsapp, email, sms, push) | tenant | push | M10 / T09 |
| 3090 | VAR | Texto | OCEBA - productos a excluir en archivo de facturación columna 22 | clsCirculares.GetDatosOceba_Facturacion | Migrar-servicio | PRM-CAT-P1-039 | cat.productos.mapeoRegulatorio.ocebaFacturacion.excluirColumna22 | ref:products[] | producto | — | M02 / M06 |
| 3091 | VAR | Entero | INAES - cantidad de registros por lote | ExportarAltasYBajas_INAES | Migrar | PRM-INS-P1-012 | ins.inaes.registrosPorLote | integer | tenant | — | M17 |
| 3096 | VAR | Lógico | Permitir pago de resumen de tarjeta Fecescor en CoopOnline | clsWEB.SincronizarParametros | Migrar | PRM-POR-P1-026 | por.pagos.resumenFecescorHabilitado | boolean | tenant | false | M19 / M07 |
| 3099 | VAR | Lógico | Aplicar tope de consumo en importación de tarifa social | sin lectura | Migrar | PRM-TAR-P1-008 | tar.tarifaSocial.importacion.aplicarTopeConsumo | boolean | tenant | true | M04 |
| 3103 | VAR | Lógico | No utilizar energía inyectada para cargos fijos por tramos (requiere 2821) | clsFacturacionServicio.GetImporteCF | Migrar-servicio (dependsOn tar.cuadro.cargoFijoPorTramo) | PRM-TAR-P1-009 | tar.cuadro.cargoFijoPorTramoExcluyeInyectada | boolean | categoría / cuadro tarifario | false | M04 / M03 |
| 3105 | VAR | Lógico | Utiliza API WhatsApp oficial | clsRegistracionCobranza.RegistrarPago; clsTecnica.GenerarMensajes / SendSMS (+4) | Migrar | PRM-COM-P1-009 | com.canales.whatsapp.tipoApi | enum(oficialMeta, proveedorTercero) | tenant | oficialMeta | T09 / T06 |
| 3108 | VAR | Lógico | Búsqueda en titulares por matrícula de servicio no exacta | clsBuscaInfoSocio.GetIQSocios | Reemplazado: buscador global con coincidencia parcial e índices de texto | — | — | — | — | — | M01 / T03 |
| 3112 | VAR | Lógico | Permitir reconexión automática de servicios que no requieren técnica al pagar deuda | clsRegistracionCobranza.RegistrarPago / ReconectarServicioSinTecnica | Migrar | PRM-MOR-P1-007 | mor.reconexion.automaticaAlPagar | boolean | tenant / servicio | true | M08 / M07 |
| 3113 | VAR | Lógico | Tomar deuda por tipo de servicio para reconexiones automáticas | clsCobranzaCaja.Get_SersocCambioEstado; GetServiciosDesconectadosSinDeuda | Migrar | PRM-MOR-P1-008 | mor.reconexion.evaluarDeudaPorServicio | boolean | tenant | true | M08 |
| 3117 | VAR | Lista (Punto y coma; Tabulación; Espacio) | OCEBA archivo FDU - separador de columnas | GenerarArchivoFacturacionOCEBA_NuevaCircular | Migrar | PRM-FIS-P1-041 | fis.reguladores.oceba.fdu.separador | enum(puntoYComa, tabulacion, espacio) | tenant | puntoYComa | M06 |
| 3118 | VAR | Lógico | Ordenar comprobantes por período en formulario de cobranza | sin lectura | Migrar | PRM-COB-P1-014 | cob.caja.ordenComprobantes | enum(vencimiento, periodo) | tenant | vencimiento | M07 |
| 3121 | VAR | Lógico | Usar móvil de la cuenta al enviar facturas por WhatsApp (solo electrónicas) | Facturacion_Electronica.GetDestino_NumeroDestinoSMS; clsPlantillasWhatsApp.GetNumeroDestino | Migrar | PRM-COM-P1-010 | com.facturaDigital.whatsapp.usarMovilCuenta | boolean | tenant | true | T09 / M05 |
| 3123 | VAR | Entero | Columna de identificador en archivo de segmentación SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25; clsTarifaSocial.ImportarEnergia_493_25 | Reemplazado: perfil de importación | — | — | — | — | — | M04 / T03 |
| 3124 | VAR | Entero | Columna de categoría en archivo de segmentación SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25; clsTarifaSocial.ImportarEnergia_493_25 | Reemplazado: perfil de importación | — | — | — | — | — | M04 / T03 |
| 3126 | VAR | Lógico | No buscar por número de medidor en archivos de segmentación y TS SEF y Decreto 493/25 | clsSegmentacion.GetEnergia_493_25; clsTarifaSocial.ImportarEnergia_493_25 | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 3127 | VAR | Lista (Punto y coma; Tabulación; Espacio) | Archivo de tarifa social SEF y Decreto 493/25 - separador de columnas | clsTarifaSocial.ImportarEnergia_493_25 | Reemplazado: perfil de importación (detección/selección de separador) | — | — | — | — | — | M04 / T03 |
| 3128 | VAR | Lógico | Segmentación Decreto 493/25 - búsqueda por número de NIS | clsSegmentacion.GetEnergia_493_25; clsTarifaSocial.ImportarEnergia_493_25 | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 3130 | VAR | Texto (lista) | OCEBA 544 - conceptos de categorías de múltiples mediciones | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-040 | cat.productos.mapeoRegulatorio.oceba544.multiplesMediciones | ref:products[] | producto | — | M02 / M06 |
| 3135 | VAR | Lógico | Permitir no cobrar recargo a una cuenta | clsCobranzas.Get_Datos_Factura | Migrar: exención de recargo/interés por cuenta (con motivo y vigencia) | PRM-MOR-P1-009 | mor.recargos.permitirExencionPorCuenta | boolean | tenant | false | M08 |
| 3136 | VAR | Lógico | Incluir cuentas con tarifa social vigente en la importación de tarifa social | clsTarifaSocial.ImportarEnergia_493_25 | Migrar | PRM-TAR-P1-010 | tar.tarifaSocial.importacion.incluirConTarifaVigente | boolean | tenant | false | M04 |
| 3145 | VAR | Lista | TRII - versión a utilizar para el envío de WhatsApp | sin lectura | Migrar | PRM-INT-P1-009 | int.whatsapp.trii.version | enum(según proveedor) | tenant | última soportada | T06 |
| 3146 | VAR | Texto | TRII - Channel ID | sin lectura | Migrar: identificador de canal (no secreto) de la conexión TRII | PRM-INT-P1-010 | int.whatsapp.trii.channelId | string | tenant | — | T06 |
| 3148 | VAR | Lógico | Permitir asignar estado del medidor | sin lectura | Migrar: cambio manual de estado del medidor (fuera de la máquina de estados), con auditoría | PRM-MED-P1-006 | med.medidores.permitirCambioEstadoManual | boolean | tenant | false | M03 |
| 3149 | VAR | Texto (lista) | OCEBA 544 - conceptos de energía generada pico (usuarios generadores) | Get_Datos_FacturacionOceba; CompletarInfoUsuariosGeneradores544 | Migrar-servicio | PRM-CAT-P1-041 | cat.productos.mapeoRegulatorio.oceba544.generadaPico | ref:products[] | producto | — | M02 / M06 |
| 3150 | VAR | Texto (lista) | OCEBA 544 - conceptos de energía generada resto (usuarios generadores) | Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-042 | cat.productos.mapeoRegulatorio.oceba544.generadaResto | ref:products[] | producto | — | M02 / M06 |
| 3151 | VAR | Texto (lista) | OCEBA 544 - conceptos de energía generada valle (usuarios generadores) | Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-043 | cat.productos.mapeoRegulatorio.oceba544.generadaValle | ref:products[] | producto | — | M02 / M06 |
| 3152 | VAR | Lógico | Permitir desagrupar servicios en consulta de cuenta | frmSeleccionar_InfoSocios_Load | Reemplazado: agrupación/desagrupación como opción de vista de la ficha | — | — | — | — | — | M01 / T03 |
| 3154 | VAR | Lógico | Mostrar cuota del período en consulta de deuda y caja | sin lectura | Migrar | PRM-COB-P1-015 | cob.consultaDeuda.mostrarCuotaPeriodo | boolean | tenant | true | M07 / M08 |
| 3155 | VAR | Lógico | Volver a categoría base al restablecer categorías (segmentación) | clsSegmentacion.GetQueryRestablecerSEFyDecreto | Migrar | PRM-TAR-P1-011 | tar.segmentacion.restablecerACategoriaBase | boolean | tenant | true | M04 |
| 3156 | VAR | Lógico | Archivo FDU - informar período de la factura | GenerarArchivoFacturacionOCEBA_NuevaCircular | Migrar | PRM-FIS-P1-042 | fis.reguladores.oceba.fdu.informarPeriodoFactura | boolean | tenant | true | M06 |
| 3159 | VAR | Lógico | Archivos FDU y DET - excluir NC y facturas originales de refacturación | clsCirculares.GetDatosOceba_Facturacion | Migrar | PRM-FIS-P1-043 | fis.reguladores.oceba.fdu.excluirRefacturacion | boolean | tenant | true | M06 / M05 |
| 3161 | VAR | Lógico | Forzar descarga del SDK de Pagos360 para pago con tarjeta en ATM | sin lectura | Descartar: detalle técnico del cliente de escritorio/kiosco; la integración la resuelve el conector T06 | — | — | — | — | — | — |
| 3162 | VAR | Lógico | Solicitar autorización para no cobrar recargo en caja local | sin lectura | Migrar: la exención de recargo en caja exige autorización (workflow de autorizaciones T11) | PRM-MOR-P1-010 | mor.recargos.exencionEnCajaRequiereAutorizacion | boolean | tenant | true | M08 / T11 |
| 3164 | VAR | Lógico | No exigir cuenta principal al agregar titular durante una transferencia de cuenta | sin lectura | Migrar | PRM-PER-P1-052 | per.transferencias.eximirCuentaPrincipal | boolean | tenant | false | M01 |
| 3172 | VAR | Lógico | Exportar a XLSX el informe de consumos agrupados por tramos y categorías | clsConsumosTramasCategorias.ExportarExcel_DetalleCuentasExcel | Reemplazado: exportación estándar XLSX/CSV/PDF de reportes | — | — | — | — | — | T10 |
| 3180 | VAR | Texto (lista) | OCEBA 544 - conceptos de energía activa para usuarios generadores | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-044 | cat.productos.mapeoRegulatorio.oceba544.energiaActivaGeneradores | ref:products[] | producto | — | M02 / M06 |
| 3181 | VAR | Texto (lista) | OCEBA 544 - conceptos extras cargo fijo | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-045 | cat.productos.mapeoRegulatorio.oceba544.extrasCargoFijo | ref:products[] | producto | — | M02 / M06 |
| 3182 | VAR | Texto (lista) | OCEBA 544 - conceptos extras exceso energía reactiva | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-046 | cat.productos.mapeoRegulatorio.oceba544.extrasExcesoReactiva | ref:products[] | producto | — | M02 / M06 |
| 3183 | VAR | Texto (lista) | OCEBA 544 - conceptos extras coseno de fi | GetProductosConfigurados544 / Get_Filtros544 | Migrar-servicio | PRM-CAT-P1-047 | cat.productos.mapeoRegulatorio.oceba544.extrasCosenoFi | ref:products[] | producto | — | M02 / M06 |
| 3184 | VAR | Lógico | Utilizar columna ORDEN en recategorización de gas | clsRecategorizacion.Get_Recategorizacion_Gas; clsTarifaSocial.Importar_Gas_M3 | Migrar | PRM-TAR-P1-012 | tar.segmentacion.gas.usarOrdenCategoria | boolean | tenant / servicio | false | M04 |
| 3185 | VAR | Mixto: Lógico | Permitir definición de ubicaciones de productos | abm_prod_ser; FormBase.ValidarUbicaciones; frmUbicacionesStock | Migrar | PRM-STK-P1-001 | stk.ubicaciones.habilitado | boolean | tenant | false | M13 |
| 3186 | VAR | Lógico | Enviar mail cuando un adherente cumple mayoría de edad | clsServicio_Procoop.AgregarTareasDinamicas | Migrar: job diario `per:aviso-mayoria-edad` | PRM-PER-P1-053 | per.adherentes.avisoMayoriaEdad.habilitado | boolean | tenant | false | M01 / M18 |
| 3187 | VAR | Texto | Mail para aviso de adherentes que cumplen mayoría de edad | clsServicio_Procoop.EnviarMailAdherenteMayorEdad | Migrar | PRM-PER-P1-054 | per.adherentes.avisoMayoriaEdad.destinatarios | email[] | tenant | [] | M01 / T09 |
| 3190 | VAR | Numérico | Código de propiedad cobranza tarjeta FECESCOR | sin lectura | Migrar | PRM-COB-P1-016 | cob.fecescor.codigoPropiedadCobranza | string | ente | — | M07 |
| 3193 | VAR | Lógico | No exigir cuenta principal, distrito y sección a socio no activo | sin lectura | Migrar | PRM-PER-P1-055 | per.titulares.eximirExigenciasSiNoActivo | boolean | tenant | true | M01 |
| 3194 | VAR | Texto (lista) | Operaciones técnicas por cambio de estado en servicio | clsProcoop_Integra_Tecnica.ValidarTransaccionReclamo | Migrar: tipos de OT que cambian el estado del contrato (no se admiten como reclamo simple) | PRM-TEC-P1-007 | tec.tiposOrden.cambianEstadoServicio | ref:workOrderTypes[] | tenant | corte, reconexión, alta, baja | M10 |
| 3195 | VAR | Lógico | Permitir cambiar suministro a principal al transferirlo a un socio nuevo | sin lectura | Migrar | PRM-PER-P1-056 | per.transferencias.permitirMarcarPrincipalEnDestino | boolean | tenant | true | M01 |
| 3196 | VAR | Lógico | Permitir DNI duplicado solo cuando el socio relacionado está de baja o inactivo | clsSocios.PermiteDNIDuplicado | Migrar (refina 2077) | PRM-PER-P1-057 | per.personas.documentoDuplicadoSoloSiInactivo | boolean | tenant | true | M01 |
| 3198 | VAR | Lógico | Segmentación gas - importador SEF - búsqueda por número de matrícula | clsSegmentacion.ImportarGas_SEF | Reemplazado: clave de cruce del perfil de importación | — | — | — | — | — | M04 / T03 |
| 3200 | VAR | Lógico | Agrupar advertencia de comprobante repetido al importar archivo de rendición | Importador_Base.Validar_Duplicados | Migrar | PRM-COB-P1-017 | cob.rendiciones.agruparAdvertenciasDuplicados | boolean | tenant | true | M07 |

## 8. Resumen

### 8.1 Verificación de exhaustividad

| Módulo ProCoop | Declarados en RN-09 §6.2 | Filas en este catálogo |
|---|---:|---:|
| SISTEMA | 8 | 8 |
| CONFIGURACION | 107 | 107 |
| TITULARES | 312 | 312 |
| **Total** | **427** | **427** |

Se crean **327 PRM distintos**. Cinco filas se fusionan en el PRM de otra fila (2469 → 54, 2636 → 73, 2668 → 2482, 2715 → 2269, 2889 → 2887). Las 95 filas restantes no generan PRM: 74 Reemplazado, 18 Descartar y 3 Plataforma de tipo operativo/monitoreo (2786, 3115, 3125).

### 8.2 Conteo por decisión

| Decisión | SISTEMA | CONFIGURACION | TITULARES | Total |
|---|---:|---:|---:|---:|
| Migrar | 0 | 66 | 192 | **258** |
| Migrar-servicio | 0 | 0 | 49 | **49** |
| Diccionario | 0 | 8 | 3 | **11** |
| Marca | 0 | 0 | 0 | **0** |
| Plataforma | 1 | 11 | 0 | **12** |
| Bóveda | 1 | 4 | 0 | **5** |
| Reemplazado | 3 | 13 | 58 | **74** |
| Descartar | 3 | 5 | 10 | **18** |
| **Total** | **8** | **107** | **312** | **427** |

Nota: el logo de la empresa (citado en RN-09 §3 junto a 518–527 y 709) no figura como variable en estos tres módulos; la decisión **Marca** queda sin filas en esta parte, y el logo y los colores se tratan en T03 como branding del tenant.

### 8.3 Conteo de PRM por código (anexo destino)

| Código PRM | Anexo | PRM creados |
|---|---|---:|
| PER | M01 Personas, titulares, cuentas | 57 |
| CAT | M02 Catálogo de servicios y productos | 47 |
| FIS | M06 Fiscal e impuestos (incluye reguladores) | 43 |
| POR | M19 Portal y app del socio | 26 |
| COB | M07 Cuenta corriente y cobranza | 17 |
| PLA | T01 Plataforma SaaS y perfil del tenant | 17 |
| INS | M17 Institucional (capital, asambleas, INAES) | 12 |
| TAR | M04 Tarifas y motor de cálculo | 12 |
| UXD | T03 Diccionario | 11 |
| COM | T09 Comunidad y comunicaciones | 10 |
| INT | T06 Integraciones (incluye 5 `secretRef` de bóveda) | 10 |
| MOR | M08 Mora, reconexión, recargos, garantías | 10 |
| SOC | M18 Servicios sociales (vivienda, farmacia, banco de sangre) | 8 |
| TEC | M10 Técnica, mapas, obras, OT | 7 |
| CRM | M09 CRM y atención | 6 |
| MED | M03 Medición | 6 |
| BIA | T10 Reportes | 5 |
| VEN | M11 Ventas y presupuestos | 5 |
| CON | M15 Contabilidad | 4 |
| FAC | M05 Facturación | 4 |
| IAM | T02 Identidad y acceso | 4 |
| SUE | M16 Sueldos | 2 |
| TES | M14 Tesorería | 2 |
| MIG | T07 Migración | 1 |
| STK | M13 Stock | 1 |
| **Total** | | **327** |

### 8.4 Conteo de filas por anexo destino principal (primer anexo de la columna; incluye Reemplazado)

| Anexo | Filas | Anexo | Filas | Anexo | Filas |
|---|---:|---|---:|---|---:|
| M01 | 67 | M09 | 7 | T01 | 25 |
| M02 | 48 | M10 | 9 | T02 | 7 |
| M03 | 8 | M11 | 5 | T03 | 17 |
| M04 | 27 | M13 | 1 | T04 | 2 |
| M05 | 5 | M14 | 2 | T06 | 12 |
| M06 | 45 | M15 | 4 | T07 | 1 |
| M07 | 17 | M16 | 2 | T09 | 12 |
| M08 | 10 | M17 | 18 | T10 | 6 |
| M18 | 8 | M19 | 35 | T11 | 9 |
| — (Descartar) | 18 | | | **Total** | **427** |

### 8.5 Mecanismos que reemplazan parámetros (para los anexos dueños)

| Mecanismo nuevo | V2 # reemplazados | Anexo |
|---|---|---|
| Portal en línea sobre el mismo backend (sin MySQL externa ni sincronización) | 1, 3, 4, 74, 808, 809, 811, 2460, 2534, 2689 (y Descartar 803, 805, 810, 2397, 2817) | M19 |
| Perfiles de importación guardados en ExcelImportWizard (mapeo de columnas, separador, clave de cruce) | 2717, 2724, 2843, 2858, 2946, 2961, 2964, 2965, 2976, 3075, 3123, 3124, 3126, 3127, 3128, 3198 | M04 / M03 / T03 |
| DataTable genérico (columnas, filtros por defecto, vistas guardadas, exportación) | 50, 2294, 2321, 2557, 2563, 2744, 3172 | T03 / T10 |
| Entidad Asamblea y cierres de período con estado | 501, 2428, 2429, 2616, 2785 | M17 / M05 / M15 |
| Historial inmutable de contratos (transferencia = cierre + alta) | 422, 2541 | M01 |
| Máquina de estados y workflow (anular en vez de borrar, estado inicial, acciones por trámite) | 2435, 2509, 2753 | T11 |
| Expediente documental y PDF automáticos | 2532, 2535, 2617, 2781, 3093, 2463 | T11 |
| Canal de ingreso obligatorio en trámites y OT | 2329, 2507 | M09 / M10 |
| Acta digital en app de campo | 2522 | M10 |
| IAM moderno (invitación, sin claves genéricas, capabilities) | 800, 2309, 2588, 2733, 3131 | T02 |
| Infraestructura de plataforma (migraciones de esquema, workers supervisados, sin Integra local) | 2085, 2730, 2731, 2990, 2993 | T01 / T08 |
| Agente de hardware local con registro de dispositivos | 2351, 2352 | T06 |
| Otros puntuales | 56 (app de campo con cola offline), 2729 (mensajería interna), 2673 (secuencias de T04), 2855 (job asíncrono de capital), 2918, 2934, 3058, 3108, 3152 (ficha y buscador), 2948 (periodicidad según ciclo) | varios |

### 8.6 Parámetros que revelan reglas de negocio no obvias (para la sección 6 de los anexos de módulo)

| V2 # | Anexo | Regla revelada |
|---|---|---|
| 12 | M08 / M07 | En el pago online, el interés por mora puede **no cobrarse en el acto** y facturarse en el período siguiente (las pasarelas cobran el importe nominal). |
| 13 | M07 | Un "talón" agrupa varias facturas: pagar uno online obliga a imputar todas sus facturas juntas. |
| 17 | M19 / M05 | Existen comprobantes **bloqueados** (en revisión o reclamo) que no deben publicarse al socio. |
| 32, 2660, 2673 | M01 / T04 | La numeración de titulares distingue **asociados y clientes no asociados** y puede depender del estado activo/baja; hay casos de número manual. |
| 73, 2636, 240 | M17 / M15 | El capital social puede suscribirse **al facturar o en la afiliación**, y procesarse por fecha de vencimiento; esto cambia los asientos de capital del cierre diario. |
| 2606, 2716 | M17 | Hay un **umbral de tolerancia** para considerar deuda de capital (afecta padrón/derecho de voto) y la reserva de capital no puede superar lo integrado salvo que se habilite. |
| 337, 340, 2633 | M01 | La baja de un titular puede bloquearse si tiene capital o servicios activos; la baja sin cuenta es configurable. |
| 527, 2086 | M06 / M07 | La condición de IVA de la cooperativa determina alícuotas y percepciones; la condición de IVA por defecto de la persona **interviene en el cálculo del recargo en cobranza**. |
| 2353 | M01 / M06 | La localidad por defecto de personas también se usa en exportaciones a DGR (Silarpib); en CoopApps esas exportaciones deben usar `fis.agenteRetencion.localidad`, no un dato de UI. |
| 2264 | T01 / M07 | La sigla del tenant se embebe en más de 130 archivos de intercambio con entes (Tarjeta Naranja, otros): es un dato de integración, no cosmético. |
| 2482, 2668, 2669 | M01 / M07 | **La deuda sigue al inmueble**: al dar un alta se controla la deuda (opcionalmente solo vencida) del domicilio o propiedad catastral, aunque sea de otro titular. |
| 2301 | M08 | No se reconectan servicios de titulares fallecidos salvo habilitación expresa. |
| 2330, 2455, 2755 | M04 / M10 | El cambio de categoría se materializa con una OT de tipo específico y se **prorratea** según un día límite del período de facturación. |
| 2707 | M08 / M04 | Al reconectar un servicio no medido en el mismo mes de la desconexión se puede reiniciar la fecha de alta (impacta prorrateo y cargo fijo). |
| 2740 | M04 | Un asociado no puede tener dos conexiones con categoría social (tarifa social) del mismo servicio. |
| 3112, 3113 | M08 / M07 | El pago de la deuda puede disparar la **reconexión automática** de servicios que no requieren técnica, evaluando la deuda por servicio y no por cuenta. |
| 3135, 3162 | M08 / T11 | La exención de recargo por cuenta existe y, en caja, puede exigir autorización de un supervisor. |
| 3116, 3170 | M03 / M10 | El corte o reconexión puede impactarse en el medidor telegestionado (Discar) al confirmar la OT, o incluso sin confirmarla. |
| 3194 | M10 / M09 | Ciertos tipos de OT cambian el estado del servicio y no pueden cargarse como reclamo simple. |
| 2291, 2401, 2521, 3186 | M01 / M18 | Los adherentes (sepelio, salud) se dan de baja o se mantienen al transferir el servicio, se consultan al reconectar, se detectan duplicados entre titulares y se avisa cuando cumplen la mayoría de edad. |
| 2316 | M01 / M08 | La baja de un servicio con cuotas de financiación pendientes está bloqueada por defecto. |
| 2821, 3103 | M04 / M03 | El cargo fijo puede depender del tramo de consumo y, para generación distribuida, puede excluir la energía inyectada del cálculo del tramo. |
| 3159 | M06 / M05 | En archivos regulatorios (OCEBA FDU/DET) se excluyen las notas de crédito y facturas originales de una refacturación, para no duplicar. |
| 2923, 757 | M06 | Entre Ríos (ATER) usa el formato de padrón de ARBA; Córdoba tiene un régimen específico de percepción IIBB (RN 01/2017) con mínimo imponible y alícuotas para no incluidos (758–760). |
| 2549 | M05 | Algunos comprobantes pueden emitirse con punto de venta 0 (marca por tipo de comprobante). |
| 741, 2303 | M05 | No se factura a titulares de baja y existe una marca "no facturar" por servicio. |
| 2581–2584 | M02 / M08 | Servicio de **dispenser de agua** con límite diario, litros por atención y bloqueo por días de deuda. |
| 2527 | M18 | El banco de sangre valida un rango de edad del donante. |
| 3122, 3166 | M16 | El recibo de sueldo no se descarga sin firmar, y no se accede al del mes actual sin haber firmado el anterior. |
| 2050, 2343, 2529, 2462 | M02 / M10 | El alta de servicio puede exigir factibilidad vigente, certificado de instalación (con profesional y fecha) e inmueble no modificable desde la OT. |
| 2832–2849, 2868, 2898, 2986, 3011–3017, 3090, 3130, 3149–3151, 3180–3183 | M02 / M06 | Los informes regulatorios (OCEBA 544, RASE, Secretaría de Energía) se arman clasificando **productos e impuestos por rubro regulatorio**; en CoopApps se requiere un atributo `regulatoryMappings` en productos/impuestos en vez de listas de códigos en parámetros. |

## 9. Preguntas abiertas

### PA-CFG-P1-01 — Numeración de titulares: asociados y clientes
- **Pregunta:** ¿Cómo se numeran los titulares en CoopApps?
- **Contexto:** ProCoop permite series diferenciadas para asociados y clientes (V2 #32), número manual para activos (2660) y numeración que considera activo/baja (2673). En la migración (T07) hay que conservar los números existentes.
- **Opciones:**
  - A) Una sola secuencia por tenant, con atributo `tipoTitular` (asociado/cliente); número manual solo en la migración **(Recomendada)** — es simple, sin colisiones, y conserva los números históricos.
  - B) Dos series configurables (asociados y clientes), replicando 32 — mantiene la costumbre pero obliga a gestionar rangos.
  - C) Permitir número manual en cualquier alta — es flexible pero arriesga duplicados y huecos.
- **Impacto si no se responde:** se asume A; 32 y 2660 quedan `A validar (PA-CFG-P1-01)`.
- **Bloquea:** PRM-PER-P1 de 32 y 2660; numeración de M01 y T04 (O2); T07.

### PA-CFG-P1-02 — Quién edita los datos legales del tenant
- **Pregunta:** ¿Puede el administrador del tenant modificar razón social y domicilio fiscal, o lo hace solo la plataforma?
- **Contexto:** V2 #518–525 eran editables por la cooperativa; el CUIT (519) controla licencia y ARCA. Un error en estos datos impacta comprobantes fiscales.
- **Opciones:**
  - A) El tenant edita razón social, domicilio y teléfono con auditoría y vigencia; el CUIT solo lo cambia la plataforma **(Recomendada)** — da autonomía y protege la licencia y ARCA.
  - B) Todo lo edita la plataforma a pedido del tenant — máximo control, pero más carga de soporte.
  - C) Todo lo edita el tenant, incluido el CUIT — riesgo fiscal y de licenciamiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-PLA-P1 (perfil del tenant), T01 (O1), M05/M06 (leyendas fiscales).
- **Estado:** Respondida en parte por DEC-064: los datos legales y fiscales básicos viven en `legalEntities` de T04 (RF-CFG-134), no en el perfil del tenant de T01. Para quién edita se asume la opción A (DEC-072) salvo respuesta del solicitante, con la regla de T04 RN-CFG-052: el CUIT no se edita una vez que la entidad tiene documentos; un CUIT distinto es una entidad nueva (PA-CFG-14).

### PA-CFG-P1-03 — Claves de mapas e IA: de la plataforma o del tenant
- **Pregunta:** ¿Las claves de Google/Bing Maps y OpenAI las provee la plataforma o cada cooperativa?
- **Contexto:** En ProCoop cada cooperativa cargaba sus propias claves (2242, 2251, 3048). En SaaS conviene centralizarlas, pero el costo de uso varía por tenant.
- **Opciones:**
  - A) Las provee la plataforma (costo incluido o medido por licencia), con opción de que el tenant use su propia clave **(Recomendada)** — la puesta en marcha es simple y el costo queda controlado.
  - B) Cada tenant debe cargar su clave en la bóveda — sin costo para la plataforma, pero agrega fricción al alta del tenant.
  - C) Solo la plataforma, sin opción de clave propia — es lo más simple, pero no permite que el tenant pague su propio consumo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-INT-P1 (claves de mapas e IA), PRM-PLA-P1 de 2090, T06 (O1), M10 (mapas, O3).

### PA-CFG-P1-04 — Intereses por mora en pagos online
- **Pregunta:** Cuando un socio paga online una factura vencida, ¿el interés se cobra en el momento o se difiere a la próxima factura?
- **Contexto:** V2 #12 (CoopOnline) permite diferirlo; afecta la conciliación con pasarelas que cobran importes fijos (QR, link, cupón).
- **Opciones:**
  - A) Diferir el interés a la próxima factura por defecto, configurable por canal **(Recomendada)** — es compatible con todas las pasarelas y replica ProCoop.
  - B) Recalcular y cobrar el interés en el momento del pago — más exacto, pero exige importes dinámicos en cada pasarela.
  - C) No cobrar interés en pagos online — incentiva el canal, pero implica pérdida financiera.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 12, M08 y M07 (O5–O6).

### PA-CFG-P1-05 — Reconexión automática al pagar
- **Pregunta:** ¿Se reconectan automáticamente los servicios suspendidos por deuda cuando se confirma el pago?
- **Contexto:** V2 #3112/3113 lo permiten para servicios sin técnica. En el piloto Internet la reconexión es remota (aprovisionamiento), lo que habilita automatizarla.
- **Opciones:**
  - A) Automática para servicios con reconexión remota o sin técnica, evaluando la deuda por servicio, al confirmarse el pago (no al iniciarlo) **(Recomendada)** — mejor experiencia y menos llamados.
  - B) Siempre con aprobación manual de un operador — más control, pero más demora.
  - C) Automática también para servicios con técnica (genera la OT sola) — máxima automatización, con riesgo de visitas por pagos luego revertidos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 3112 y 3113, M08 (O6), cierre del piloto Internet.

### PA-CFG-P1-06 — Antigüedad de comprobantes visibles en el portal
- **Pregunta:** ¿Cuántos meses de comprobantes ve el socio en el portal?
- **Contexto:** V2 #36 borraba PDF antiguos de la web. En CoopApps los PDF fiscales se conservan según la retención legal (T08); solo se decide qué ve el socio.
- **Opciones:**
  - A) 24 meses visibles; los anteriores se piden desde el portal y se generan bajo demanda **(Recomendada)** — equilibra utilidad y rendimiento.
  - B) Todo el historial siempre visible — es lo más transparente, pero las listas se vuelven largas.
  - C) 12 meses — listas cortas, pero genera más consultas al soporte.
- **Impacto si no se responde:** se asume A (`por.comprobantes.mesesVisibles = 24`).
- **Bloquea:** PRM-POR-P1 de 36, M19 (O2).

### PA-CFG-P1-07 — Prioridad de los parámetros regulatorios de otras provincias (OCEBA, RASE, EPRE, ATER)
- **Pregunta:** ¿En qué ola se implementan los parámetros y archivos de reguladores de Buenos Aires (OCEBA), RASE, EPRE y ATER?
- **Contexto:** Unas 80 filas de esta parte (casi todas de TITULARES) son parámetros de segmentación, tarifa social y archivos o mapeos regulatorios de energía eléctrica de otras jurisdicciones. El piloto es Internet en Córdoba (ERSeP). DEC-007 los deja en alcance.
- **Opciones:**
  - A) En O7, como mecanismo genérico de mapeo regulatorio (atributos en productos, categorías e impuestos más plantillas de archivo por regulador), cargando primero los reguladores de los tenants activos **(Recomendada)** — cumple DEC-007 sin bloquear el piloto.
  - B) Implementar solo los reguladores de los tenants que se contraten — menos trabajo inicial, pero lleva a desarrollos a pedido.
  - C) Pasarlos a prioridad Extensión (O11) — libera capacidad, con riesgo para la venta en Buenos Aires.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-FIS-P1 de reguladores y PRM-CAT-P1 de mapeo regulatorio; M06 y M02 (O7).

### PA-CFG-P1-08 — Exención de recargo por cuenta
- **Pregunta:** ¿Se permite eximir de recargo o interés por mora a una cuenta específica?
- **Contexto:** V2 #3135 lo permite y 3162 exige autorización en caja. Afecta la equidad entre asociados y los controles internos.
- **Opciones:**
  - A) Permitida con motivo, vigencia y autorización (workflow T11), con reporte de exenciones vigentes **(Recomendada)** — da flexibilidad con trazabilidad.
  - B) No permitida — máximo control, pero no cubre casos sociales.
  - C) Permitida sin autorización — más ágil, pero con riesgo de abuso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 3135 y 3162, M08 (O6), T11.
