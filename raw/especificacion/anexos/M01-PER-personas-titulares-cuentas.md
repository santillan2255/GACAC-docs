# M01 PER — Personas, titulares, asociados, cuentas, inmuebles y domicilios

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (padrón comercial) / CRM (ficha 360, gestiones en nombre de terceros) / Landing-autogestión (Mis datos, vinculación, autorizados) / APIs |
| Olas | O2 (núcleo del módulo), O4 (verificación ARCA, señales a facturación), O5 (señales a caja y cobranza), O6 (transferencias con efectos económicos completos), O10 (vista de adherentes y beneficiarios de M18, vínculo con institucional; HUECO-TRV-01), O11 (migración repetible, informes avanzados) |
| Dueño de datos | `persons`, `personSensitiveData`, `holders`, `accounts`, `addresses`, `addressGeoEvents`, `premises`, `servicePoints`, `relationships`, ~~`adherents`~~ (Reemplazado por `serviceDependents` y `serviceBeneficiaries` de M18, dueño único; DEC-071, HUECO-TRV-01), `notes`, `blocks`, `documentRequirementTypes`, `documentSubmissions`, `transfers`, `duplicateCases`, `perRevisions`; ~~`consents`, `dataSubjectRequests`, `personUserLinks`~~ (Reemplazadas por `consentRecords` y `dataSubjectRequests` de T08 y `memberships` de T02; CTR-DAT-18, §7.17) |
| Prioridad export GoodApps (D-10) | Primer módulo de dominio del paquete portable. Implementación: entidades lógicas → esquema `per` en `07-modelo-relacional-azure-sql.md` (DEC-117). Identidad de acceso: **T02**. Inventario ayuda: `_trabajo/inventario-screenhelp-m01-t02.md` |
| Fuentes consolidadas | BASE §3, §4, §33, §37, §39.6, §41, §57, §63, §67 (REG-001, CU-REG-01), §68 (CTA-001, solo referencia), §71, §77 (GEO-001..003, CU-GEO-01; solo domicilio del titular/servicio), §83 (TIT-001..003, CU-TIT-01), §97.1, §98, §101, §103 (FAC-006, FAC-012, solo referencia), §106 · AGR-002, AGR-006, AGR-007, AGR-010, AGR-033, ESC-01 (más AGR-003 y AGR-029 por referencia) · DFA M3 (líneas 160–240) y §31.1 (alta de suministro) · REL §2 (titulares, ficha, cuentas y servicios) · RN-06 §1–§11, §20 (parámetros que tocan titulares), §21–§23 (lo relativo a titulares/cuentas) · CAT §1 (24 tablas) y §30 (maestros de personas y domicilios) · RN-09 TITULARES (líneas 340–656, parámetros que gobiernan este módulo) · INV `ProMod_Titulares.md` (104 formularios y 6 controles) más formularios de `Configuracion` usados por el módulo (`abm_Personas`, `abm_Propieda`, `frmSeleccionarInmueble`, `DatosDomicilio`, `txtCalles`, `BuscadorInfoSocio`, `frmSeleccionar_InfoSocios`, `frmEscanerCodigoDNI`) · CNX §2.4, §3.5, §4.2 |

> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Mantener, dentro de cada cooperativa (tenant), una **identidad de negocio única y consistente** de cada persona física o jurídica y de todas sus relaciones con esa cooperativa: titularidad comercial, condición de asociado (solo el vínculo; el detalle institucional es de M17), cuentas, domicilios, inmuebles, puntos de prestación, representaciones, garantías, adherencias, documentación, observaciones y bloqueos. El módulo ofrece la **ficha 360** desde la que se consulta todo lo que la persona tiene con la cooperativa y es la fuente de verdad que consumen contratos (M02), facturación (M05), fiscal (M06), cobranza (M07), mora (M08), CRM (M09), técnica (M10), institucional (M17) y el portal del socio (M19).

Debe resolver, sin perder ninguna capacidad de ProCoop:

- La jerarquía ProCoop **Persona → Titular → Cuenta → Grupo de facturación → Servicio contratado** y el modelo BASE **persona → rol en el tenant → contrato por servicio con titular DNI/CUIT**, admitiendo varios contratos del mismo servicio en un domicilio con titulares distintos (TIT-001..003).
- Que una persona contrate varios servicios en distintos inmuebles **sin duplicarse**, y que membresía, titularidad comercial y ocupación de una vivienda sean **relaciones diferentes** (BASE §3).
- Que cambiar el titular **no reescriba el pasado**: cada cargo conserva quién era titular cuando se generó (BASE §4).

## 2. Límite y responsabilidades

### 2.1 Qué hace este módulo

| Responsabilidad | Detalle |
|---|---|
| Personas | Alta, modificación, fallecimiento, archivo, identificaciones (DNI, CUIT, CUIL y otros), verificación CUIT/CUIL con dígito y padrón ARCA, contactos, preferencias, consentimientos, datos laborales, datos extra tipados, datos sensibles restringidos. |
| Titulares | Titular comercial (equivalente a `SOCIOS` de ProCoop): número de titular, estado, alta, baja, causa, reactivación, garante, indicadores que llegan de otros módulos (asociado, gestión judicial, representante de asamblea). |
| Cuentas | Cuenta de servicios del titular (equivalente a `SUMSOC`): número, principal, domicilio postal, condición IVA, datos IIBB de la cuenta, contactos de la cuenta, entrega de factura, distrito/sección, grupo contable, zona/sector/recorrido de reparto, ficha, indicadores y estructura (grupos de facturación y contratos) para mostrarla. |
| Domicilios | Domicilios normalizados contra el catálogo geográfico de T04, texto original, geocodificación, punto confirmado/aproximado/pendiente, historial de ubicación. |
| Inmuebles | Inmueble y catastro (equivalente a `PROPIEDA` con todas sus columnas), unidades funcionales, uso, estado, ítems con valores, relaciones persona–inmueble. |
| Puntos de prestación | Dirección donde se presta uno o varios contratos (incluso del mismo servicio y de titulares distintos), con su inmueble y ubicación. |
| Relaciones | Vínculos persona–persona, representaciones, autorizaciones, apoderamientos, garantías y responsables, con vigencia, alcance por acción y evidencia (AGR-007). |
| Adherentes y beneficiarios | **Reemplazado por M18 SOC** (dueño único, DEC-071, HUECO-TRV-01): M01 solo muestra en la ficha de la persona y del contrato los adherentes y beneficiarios que informa M18 (API-SOC-001, API-SOC-005, API-SOC-007). Texto original: "Personas vinculadas a un contrato (sepelio, salud, tarifa social) con vínculo, vigencia y reglas de condición (`ADHSOC`/`BENSOC`)." |
| Notas, bloqueos y documentación | Observaciones con historial, bloqueos tipados con efectos explícitos, requisitos documentales y documentación presentada con vencimiento; adjuntos vinculados (almacenados en T11). |
| Transferencias | Transferencia de cuenta, cambio de titularidad de contrato (orquestado con M02), inicio de transferencia de capital (ejecuta M17), mudanzas; simulación, aprobación, ejecución idempotente y reversión. |
| Duplicados | Detección de posibles duplicados, bandeja de decisión y fusión solo con acción autorizada. |
| Historia | Historia bitemporal (fecha efectiva y fecha de registro) de todas sus entidades, reemplazando `*_HST`. |
| Privacidad | Inventario de datos personales del módulo, consentimientos, solicitudes de derechos (acceso, rectificación, actualización, supresión), anonimización compatible con conservación obligatoria. |
| Vínculo usuario–persona | Vinculación verificada entre la identidad de acceso (T02) y la persona de negocio del tenant, y el alcance de cuentas que ese usuario puede ver. |
| Ficha 360 y padrón | Búsqueda, ficha integral, padrón de titulares, informes, etiquetas, exportaciones. |

### 2.2 Qué NO hace y a quién delega

| Tema | Dueño | Qué hace PER |
|---|---|---|
| Identidad de acceso, credenciales, Google, 2FA, roles, perfiles, pertenencia a tenants, auditoría genérica | T02 IAM | Mantiene `personUserLinks` (qué persona del tenant es ese usuario) y consume la auditoría. |
| Catálogo geográfico (provincias, departamentos, localidades, calles, barrios, códigos postales), tablas maestras genéricas, secuencias, motor de campos extra | T04 CFG | Usa el catálogo; declara sus catálogos y conjuntos de campos extra; solicita alta de calles no encontradas. |
| Expediente documental y almacenamiento de archivos | T11 WFL | Vincula adjuntos a sus entidades y define requisitos documentales; los archivos viven en T11. |
| Workflow de aprobaciones | T11 WFL | Declara qué operaciones requieren aprobación y consume el resultado. |
| Notificaciones y envío por canal | T09 COM | Entrega contactos verificados, preferencias y la regla de destino por canal. |
| Catálogo de servicios y **contrato de servicio** (estado, categoría, medidor, matrícula, factibilidad, altas automáticas, cargos de conexión) | M02 CAT | Aporta titular, cuenta, punto de prestación e inmueble del contrato; orquesta el cambio de titularidad y la mudanza pidiéndole a M02 las acciones sobre el contrato. |
| Grupo de facturación (FAC-006) y modalidad separada/agrupada | M05 FAC | Muestra los grupos como parte de la estructura de la cuenta y valida que no agrupen titulares distintos. |
| Condición IVA, IIBB, padrones fiscales, percepciones, alícuotas | M06 FIS | Guarda en la cuenta los valores seleccionados de los catálogos de M06 y la verificación CUIT de la persona. |
| Cuenta corriente, saldo, imputación, débito automático, CBU, pagos de terceros | M07 COB | Muestra saldo y movimientos en la ficha; nunca guarda saldos propios; expone bloqueos de cobro. |
| Mora, suspensión, gestión judicial, convenios de asunción de deuda | M08 MOR | Muestra indicadores; la deuda nunca se traslada desde PER. |
| Solicitudes, reclamos, trámites de atención, vías de ingreso, turnero | M09 CRM | Muestra gestiones en la ficha; recibe tareas derivadas (fallecimiento, transferencia). |
| Factibilidad, órdenes de trabajo, traslados técnicos, GIS | M10 TEC | Recibe el cierre de OT de traslado y actualiza el punto de prestación. |
| Capital social, suscripción, integración, reserva, rescate, asambleas, consejo, número y estado de asociado, padrón de asamblea, INAES | M17 INS | Muestra el vínculo de asociado y lanza la transferencia de capital; consulta si hay capital antes de una baja. |
| Servicios sociales, planes de vivienda, banco de sangre, sepelio, cementerio parque | M18 SOC | Aporta personas y datos sensibles restringidos; M18 es dueño de adherentes y beneficiarios (DEC-071, HUECO-TRV-01; antes "aporta personas, adherentes"). |
| Landing, portal y app del socio | M19 POR | Expone las API de "Mis datos", vinculación y autorizados que el portal consume. |
| Migración de datos | T07 MIG | Define el mapeo y la conciliación de sus tablas (sección 19). |

### 2.3 Jerarquía resuelta (CTR-PER-01)

```
Persona (persons)  ─ física o jurídica, identificaciones DNI/CUIT/CUIL, contactos, domicilios propios
 ├─ Roles en el tenant (derivados): titular, asociado [M17], solicitante, adherente, beneficiario,
 │    garante, representante, autorizado, propietario, ocupante, profesional, empleado [M16], proveedor [M12],
 │    vendedor [M11], chofer [M18], profesional de salud [M18] (los maestros de rol llevan personId obligatorio, DEC-097)
 ├─ Relaciones (relationships) ─ con vigencia, alcance por acción y evidencia
 └─ Titular (holders) ─ N° de titular, estado; 0..1 por persona y tenant
      └─ Cuenta (accounts) ─ N° de cuenta, principal (exactamente una), domicilio postal, condición IVA
           └─ Grupo de facturación (billingGroups) [dueño M05] ─ qué contratos salen en un comprobante
                └─ Contrato de servicio (serviceContracts) [dueño M02] ─ titular = titular de la cuenta (DNI/CUIT)
                     ├─ Punto de prestación (servicePoints) ─ dirección normalizada + ubicación
                     │     └─ Inmueble (premises) ─ catastro, unidades, propietarios, ocupantes
                     └─ Adherentes / beneficiarios (M18 serviceDependents / serviceBeneficiaries; solo lectura en M01)
```

Invariantes de la jerarquía:

1. Una cuenta pertenece a **un solo titular**; todos los contratos de la cuenta tienen ese titular y su identificación DNI/CUIT (TIT-001, TIT-003, BASE §103.3).
2. Un punto de prestación y un inmueble pueden alojar **muchos contratos**, incluso del mismo servicio y de titulares distintos; no existe unicidad por domicilio + servicio (TIT-002).
3. El grupo de facturación vive dentro de una cuenta; no agrupa contratos de cuentas o titulares distintos (BASE §103.3).
4. La membresía cooperativa (M17), la titularidad comercial (`holders`) y la ocupación o propiedad de un inmueble (`relationships`) son relaciones distintas (BASE §3).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Persona | Individuo (persona humana) u organización (persona jurídica) registrado en el ámbito de una cooperativa. | `dict:per.person` | `PERSONAS` |
| Persona humana / física | Persona con apellidos, nombres, sexo registral, nacimiento y eventual fallecimiento. | `dict:per.person.natural` | `PERSONAS` con tipo documento de persona física (V2 592) |
| Persona jurídica | Organización (sociedad, cooperativa, asociación, municipio, organismo público) que actúa por representantes. | `dict:per.person.legal` | `PERSONAS` con tipo documento de persona jurídica (V2 591) |
| Identificación | Documento o clave que identifica a la persona: DNI, CUIT, CUIL, CDI, LE, LC, pasaporte, cédula extranjera; con estado de verificación. | `dict:per.identifier` | `PERSONAS.TIP_DNI/NUM_DNI`, `PERSONAS.CDI`, `SOCIOS.CUIT`, `DOCUMENT` |
| Titular | Persona responsable comercial de una o más cuentas y de los contratos que contienen; identificada por DNI o CUIT. | `dict:per.holder` | `SOCIOS` ("Titular N°") |
| Número de titular | Número visible, único en el tenant, que identifica al titular. | `dict:per.holder.number` | `SOCIOS.COD_SOC` ("Titular N°") |
| Asociado | Relación institucional con la cooperativa; la gestiona M17. PER solo muestra el vínculo. | `dict:per.member` | `SOCIOS.ACTIVO = 1`, `SOCIOS.NUM_SOC` |
| Cliente no asociado | Titular sin membresía cooperativa vigente. | `dict:per.holder.nonMember` | `SOCIOS.ACTIVO = 0` ("no activo") |
| Solicitante | Persona que inició una solicitud (registro o contratación) y aún no tiene contrato. | `dict:per.applicant` | — (registro web CoopOnline) |
| Cuenta | Agrupación estructural de contratos de un titular con domicilio postal, condición IVA y datos de entrega. No es la cuenta corriente. | `dict:per.account` | `SUMSOC` ("Cuenta", "suministro") |
| Cuenta principal | La cuenta del titular marcada como principal; exactamente una. | `dict:per.account.principal` | `SUMSOC.PRINCIPAL` |
| Cuenta corriente | Registro de obligaciones y cancelaciones (M07). No se confunde con la cuenta de PER. | `dict:cob.ledger` | `FACTURAS`/`COBRANZA` (M07) |
| Grupo de facturación | Conjunto de contratos de una cuenta que se emiten en un mismo comprobante (M05). | `dict:fac.billingGroup` | `SERSOC.GRUPO_FACTURA` ("G.F.") |
| Contrato de servicio | Prestación contratada para un punto de prestación, con titular DNI/CUIT (M02). | `dict:cat.serviceContract` | `SERSOC` ("servicio", "suministro") |
| Domicilio | Dirección normalizada con texto original, procedencia y ubicación. | `dict:per.address` | `PERSONAS.COD_CAL/NUMERO/PISO/DPTO/COD_BAR/COD_LOC`, `SUMSOC`, `SERSOC` |
| Domicilio postal / de correspondencia | Donde se envía la documentación de la cuenta. | `dict:per.address.postal` | Domicilio de `SUMSOC` |
| Domicilio fiscal | El informado por ARCA para la CUIT. | `dict:per.address.fiscal` | — |
| Punto de prestación | Dirección donde se brinda uno o varios contratos; distinta del domicilio personal, fiscal o postal. | `dict:per.servicePoint` | Domicilio de `SERSOC` (calle, número, piso, dpto, barrio, localidad, catastro, GPS) |
| Inmueble | Lugar físico (parcela, edificio, unidad) con catastro. | `dict:per.premises` | `PROPIEDA` ("Inmueble") |
| Nomenclatura catastral | Designación de seis partes (por defecto Cod/Sec/Man/Par/PH/Lote) configurable por tenant. | `dict:per.premises.cadastre` | `PROPIEDA.CAT_CIR/CAT_LOT/CAT_MAN/CAT_PAR/CAT_PH/INT_LOT`, V2 2281 |
| Unidad funcional | Departamento o unidad dentro de un inmueble en propiedad horizontal. | `dict:per.premises.unit` | `PROPIEDA.UNIDAD_FUNCIONAL`, `CAT_PH` |
| Relación | Vínculo con vigencia entre una persona y otra persona, un titular, una cuenta, un contrato o un inmueble. | `dict:per.relationship` | `VINCULOS`, `RELACION_ENTIDADES`, `SOCIOS.COD_GAR`. *Reemplazado (10-11-2026, DEC-104): "`VINCULOS`, `RESPONSA`, `RELACION_ENTIDADES`"; `RESPONSA` son técnicos, responsables y cobradores, no relaciones (CTR-PER-22).* |
| Representante | Persona que actúa por otra (apoderado, representante legal de una organización, tutor/curador). | `dict:per.representative` | — (no modelado en ProCoop) |
| Autorizado | Persona habilitada por el titular para acciones concretas (consultar, pagar, gestionar). | `dict:per.authorized` | — |
| Garante | Persona que garantiza obligaciones de un titular, cuenta o contrato. | `dict:per.guarantor` | `SOCIOS.COD_GAR`, garante del `SERSOC` **[VERIFICAR]** la columna contra el esquema real (no figura entre las columnas visibles del catálogo). *Reemplazado (10-11-2026, DEC-104): "`SOCIOS.COD_GAR`, garante del `SERSOC`, `RESPONSA`"; `RESPONSA` no es fuente de garantes (CTR-PER-22).* |
| Rol de persona en otro módulo | Función que una persona de M01 cumple en un maestro de otro módulo: proveedor (M12 `suppliers`), vendedor (M11 `salesReps`), chofer (M18 `drivers`), profesional de salud (M18 `medicalProfessionals`), empleado (M16 `employees`). El maestro guarda `personId` obligatorio y solo los datos del rol; la identidad vive en la persona (DEC-097). | `dict:per.personRole` | `PROVEED`, `VENDEDOR`, `CHOFERES`, `MEDICOS`, `SU_EMPLEADOS` |
| Estado de identificación | Situación de la persona respecto de sus documentos: identificada, con excepción aprobada o con documento pendiente (`documentPending`, persona migrada sin ningún documento; DEC-099). | `dict:per.identificationStatus` | — (en ProCoop la persona se graba sin documento) |
| Pagador | Quien paga una obligación sin ser titular; no adquiere derechos (ESC-01). | `dict:per.payer` | — |
| Adherente | Persona vinculada a un contrato (sepelio, salud) con vínculo y tarifa de adherente. Término de M18 (`dict:soc.dependent`; HUECO-TRV-01). | `dict:per.adherent` (reemplazado) | `ADHSOC` |
| Beneficiario | Persona beneficiaria de una prestación del contrato. Término de M18 (`dict:soc.beneficiary`; HUECO-TRV-01, HUECO-SEP-02; el ejemplo original "tarifa social" se retira: la tarifa social no se registra en `BENSOC`). | `dict:per.beneficiary` (reemplazado) | `BENSOC` |
| Vínculo | Tipo de relación familiar u organizacional (titular, cónyuge, hijo, discapacitado). | `dict:per.relationshipType` | `VINCULOS.DES_VIN/TIPO_VIN` |
| Nota / observación | Texto fechado con título sobre persona, titular, cuenta o contrato, con historial. | `dict:per.note` | `NOTA_SUM` |
| Bloqueo | Restricción tipada que impide o condiciona operaciones concretas, con causa, vigencia y mensaje. | `dict:per.block` | `NOTA_SUM.BLO_CAJ/MSG_CAJ`, `SUMSOC.BLOQUEAR_FAC_WEB`, `SUMNOFAC`, `HISBLOQ`, `CAUBLOQ` |
| Requisito documental | Tipo de documento o trámite exigible, con días de vigencia y plantilla. | `dict:per.documentRequirement` | `TRAMITES` |
| Documentación presentada | Presentación de un requisito por un titular, cuenta o contrato, con vencimiento. | `dict:per.documentSubmission` | `PTRAMITES` |
| Transferencia | Operación que mueve una cuenta, un contrato o capital de un titular a otro. | `dict:per.transfer` | `TRANSFER` (tipo 1 cuenta, 2 servicio, 3 capital) |
| Cambio de titularidad | Transferencia de un contrato a otro titular con fecha efectiva, conservando deuda e historia en el titular anterior. | `dict:per.ownershipChange` | Transferencia de servicio (`TransferirServicio`) |
| Mudanza | El titular deja un punto de prestación y contrata o traslada el servicio a otro. | `dict:per.relocation` | Cambio de domicilio por OT (`CambioDomicilio`) |
| Ficha 360 | Vista integral de la persona/titular con cuentas, contratos, saldos, facturas, pagos, gestiones, comunicaciones y documentos. | `dict:per.profile360` | Ficha del titular (pestañas Datos Persona, Titular, Cuentas y Servicios) |
| Duplicado | Dos registros de persona que podrían ser la misma. | `dict:per.duplicate` | — (`UnificarEntidades` para otras entidades) |
| Fecha efectiva | Fecha desde la que un hecho rige en la realidad. | `dict:common.effectiveDate` | — |
| Fecha de registro | Fecha en que el sistema conoció el hecho. | `dict:common.recordedAt` | `FEC_REG` |
| Vinculación de usuario | Relación verificada entre un usuario de acceso y una persona del tenant. | `dict:per.userLink` | Clave web de CoopOnline (`GenerarClaveWeb`) |
| Consentimiento | Base y finalidad con que se tratan los datos de la persona, con versión del texto aceptado. | `dict:per.consent` | — |
| Número de ficha | Correlativo administrativo de la cuenta. | `dict:per.account.fileNumber` | `SUMSOC_EXTRAS.NROFICHA` |
| Distrito y sección | División catastral/administrativa asignada a la cuenta. | `dict:per.account.districtSection` | `DISTRITO_SECCION` |
| NIP | Columna de la grilla de titulares de ProCoop. Se interpreta como número de asociado. **[VERIFICAR]** | `dict:per.holder.nip` | Grilla "NIP" (REL §2) |

## 4. Actores, permisos y alcance

Las capabilities siguen `per.<recurso>.<accion>`. El permiso efectivo y el alcance se calculan según T02 (AGR-008): denegación por defecto, unión de alcances de roles y usuario, aprobación independiente para operaciones sensibles. Los roles son ejemplos de precarga; cada tenant arma los suyos.

| Rol (ejemplo) | Capabilities | Alcance de datos |
|---|---|---|
| Atención al público (BASE §39.6 "Atención") | `per.personas.ver/crear/editar`, `per.titulares.ver/crear/editar`, `per.cuentas.ver/crear/editar`, `per.domicilios.ver/editar`, `per.inmuebles.ver`, `per.puntosPrestacion.ver/crear`, `per.relaciones.ver/crear`, `soc.adherentes.ver/gestionar` (de M18; antes `per.adherentes.ver/crear/editar`, HUECO-TRV-01), `per.notas.ver/crear`, `per.bloqueos.ver`, `per.documentacion.ver/registrar`, `per.transferencias.ver/crear`, `per.duplicados.ver`, `per.historial.ver`, `per.padron.ver` | Sucursales asignadas; canal Presencial y sucursal del operador como valores propuestos. No modifica importes emitidos. |
| Supervisor de atención | Todo lo anterior + `per.titulares.baja/reactivar`, `per.cuentas.cerrar`, `per.relaciones.verificar/revocar`, `per.bloqueos.aplicar/levantar`, `per.documentacion.validar`, `per.transferencias.aprobar/ejecutar`, `per.duplicados.resolver`, `per.personas.registrarFallecimiento`, `per.identificaciones.verificar`, `per.domicilios.confirmarUbicacion`, `per.notas.eliminar` | Sucursales o zonas asignadas. |
| Administrativo comercial | `per.*.ver`, `per.cuentas.editar`, `per.inmuebles.crear/editar`, `per.puntosPrestacion.editar`, `per.transferencias.crear`, `per.importaciones.crear` | Tenant o servicios asignados. |
| Catastro / inmuebles | `per.inmuebles.ver/crear/editar`, `per.domicilios.ver/editar/confirmarUbicacion`, `per.puntosPrestacion.ver/editar` | Zonas asignadas. |
| Facturación | `per.titulares.ver`, `per.cuentas.ver`, `per.bloqueos.ver`, `per.historial.ver` | Tenant. |
| Cajero | `per.titulares.ver`, `per.cuentas.ver`, `per.bloqueos.ver` (incluye el mensaje para caja) | Caja del turno. No ve datos sensibles. |
| Técnico de campo | `per.puntosPrestacion.ver`, `per.domicilios.ver`, `per.domicilios.proponerUbicacion` | Órdenes asignadas (propios). |
| Responsable de privacidad | `per.privacidad.ver/gestionar`, `per.personas.datosSensibles.ver` (antes `per.personas.verSensibles`), `per.personas.exportar`, `per.personas.anonimizar` | Tenant. |
| Administrador del tenant | `per.configuracion.configurar`, `per.operacionesEspeciales.ejecutar`, `per.titulares.renumerar`, `per.personas.unificar` (antes `per.personas.fusionar`) (como aprobador) | Tenant. |
| Auditor | `per.*.ver`, `per.historial.ver` (solo lectura) | Tenant; sin datos sensibles salvo permiso expreso. |
| Asociado / titular (PWA socio) | `per.me.ver`, `per.me.editarContactos`, `per.me.vincular`, `per.me.autorizados.gestionar` | Sus titularidades y cuentas vinculadas y verificadas (BASE §39.6 "Asociado": sin acceso a terceros no autorizados). |
| Autorizado / representante (PWA socio) | `per.me.ver` más las acciones de la relación vigente | Solo cuentas/contratos de la relación y para las acciones concedidas. |
| Soporte de plataforma (T01) | Lectura temporal concedida por el tenant | Acceso temporal auditado (AGR-034). |
| Cliente de API (T10) | `per.titulares.ver` (antes `per.api.titulares.ver`), `per.cuentas.ver` (antes `per.api.cuentas.ver`), con la marca X de canal externo de T02 | Campos minimizados por contrato de API; sin datos sensibles. |

Capabilities completas del módulo: `per.personas.{ver,crear,editar,exportar,registrarFallecimiento,anonimizar,unificar}`, `per.personas.datosSensibles.ver` (antes `per.personas.{ver,crear,editar,exportar,verSensibles,registrarFallecimiento,anonimizar,fusionar}`), `per.identificaciones.verificar`, `per.titulares.{ver,crear,editar,baja,reactivar,renumerar}`, `per.cuentas.{ver,crear,editar,cerrar}`, `per.domicilios.{ver,editar,confirmarUbicacion,proponerUbicacion}`, `per.inmuebles.{ver,crear,editar}`, `per.puntosPrestacion.{ver,crear,editar}`, `per.relaciones.{ver,crear,verificar,revocar}`, ~~`per.adherentes.{ver,crear,editar,baja}`~~ (Reemplazado por `soc.adherentes.ver/gestionar` y `soc.beneficiarios.ver/gestionar` de M18; HUECO-TRV-01), `per.notas.{ver,crear,editar,eliminar}`, `per.bloqueos.{ver,aplicar,levantar}`, `per.documentacion.{ver,registrar,validar,configurar}`, `per.transferencias.{ver,crear,aprobar,ejecutar,revertir}`, `per.duplicados.{ver,resolver}`, `per.historial.ver`, `per.padron.{ver,exportar}`, `per.privacidad.{ver,gestionar}`, `per.vinculosUsuario.{ver,verificar,revocar}`, `per.importaciones.crear`, `per.operacionesEspeciales.ejecutar`, `per.configuracion.configurar`, `per.me.*` (portal).

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Personas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-001 | Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. | BASE §3; DFA M3 [M]; CAT `PERSONAS` | Núcleo | O2 | Informado | Se crean una persona física y una jurídica; los obligatorios dependen del tipo; el `tenantId` sale del token. |
| RF-PER-002 | Buscar coincidencias antes de crear una persona (documento, CUIT/CUIL, nombre aproximado, fecha de nacimiento, contacto, domicilio). | BASE §3 CU-03 paso 1; AGR-006 | Núcleo | O2 | Informado | El alta muestra candidatos con puntaje; si hay candidatos de puntaje alto, crear exige declarar "no es la misma persona" con motivo. |
| RF-PER-003 | Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. | BASE §3 regla de diseño | Núcleo | O2 | Informado | Contratar un segundo servicio en otro inmueble reutiliza la misma persona; la ficha muestra ambos. |
| RF-PER-004 | Datos de persona física: apellidos, nombres, sexo registral, fecha de nacimiento, estado civil (`EST_CIVIL`), ocupación (`OCUPACIO`), nacionalidad (`PAISES`), fecha de fallecimiento. | CAT `PERSONAS`, §30 | Núcleo | O2 | Adoptado | Los catálogos son del tenant (T04); la edad se calcula a la fecha consultada. |
| RF-PER-005 | Datos de persona jurídica: razón social, nombre de fantasía, tipo de organización (sociedad, cooperativa, asociación, municipio, organismo público, otro), fecha de constitución, representantes vía relaciones. | DFA M3 (ejemplo Municipalidad); BASE §3 | Núcleo | O2 | Adoptado | Una municipalidad ficticia con varias cuentas actúa solo por representantes vigentes. |
| RF-PER-006 | Datos laborales de la persona: lugar de trabajo, domicilio y teléfono laboral, fecha y usuario de control. | CAT `PERSONAS_EXTRAS` | Estándar | O2 | Adoptado | Se cargan como conjunto de campos extra precargado "Datos laborales". |
| RF-PER-007 | Datos extra configurables y tipados por entidad (persona, titular, cuenta, inmueble, punto de prestación) que reemplazan las tablas `*_EXTRAS`. | DFA M3 `PERSONAS_EXTRAS`; CAT `SUMSOC_EXTRAS`, `SERSOC_EXTRAS` | Estándar | O2 | Adoptado | El administrador define un campo fecha obligatorio; el alta lo valida; el campo es filtrable y exportable. |
| RF-PER-008 | Asociar documentación a la persona y controlar su vencimiento. | BASE §3; CAT `ADJUNTOS` tipo 14 | Núcleo | O2 | Informado | Un documento con vencimiento aparece en "por vencer" N días antes y en "vencido" después. |
| RF-PER-009 | Registrar el fallecimiento con fecha, evidencia, efectos sobre adhesiones y beneficios y tareas pendientes. | RN-06 §10, §23.2 `Registrar_Fallecimiento`; INV `frmTitular_Fallecimiento`, `abm_adhsoc.btnRegistrarFallecimiento` | Núcleo | O2 | A validar (PA-PER-08) | Se registra la fecha; se dan de baja adhesiones y beneficios de la persona; se crean tareas de baja del titular, transferencia y cambio de garante en M09; no se corta ningún servicio. |
| RF-PER-010 | Revertir un fallecimiento registrado por error, con aprobación y reversión documentada de sus efectos. | AGR-003 (reversión) | Estándar | O2 | Adoptado | La reversión reactiva las adhesiones dadas de baja por ese evento y deja ambos hechos en la historia. |
| RF-PER-011 | Estados de la persona: activa, fallecida, fusionada, archivada (anonimizada). | AGR-003 | Núcleo | O2 | Adoptado | Una persona fusionada no admite operaciones y redirige a la persona que la absorbió. |
| RF-PER-012 | Política "exigir fecha de nacimiento o fecha de alta" en personas. | V2 2941 | Estándar | O2 | Adoptado | Con la política activa el alta sin ambas fechas se rechaza con error en línea. |
| RF-PER-013 | Captura asistida del DNI por lector de código de barras o cámara, con separador configurable. | V2 2676; INV `frmEscanerCodigoDNI` | Extensión | O2 | Adoptado | Leer el código del DNI completa apellido, nombres, sexo, número y nacimiento, que el operador confirma. |
| RF-PER-014 | Datos sensibles (electrodependencia, datos de salud, aptitud de donante) en una colección restringida con permiso propio. | BASE §97.1; V2 2527 | Núcleo | O2 | Informado | Sin `per.personas.datosSensibles.ver` (antes `per.personas.verSensibles`) la API no devuelve esos datos ni aparecen en exportaciones ni BI. |
| RF-PER-015 | Mostrar en la ficha los roles de la persona en el tenant: titular, asociado, cliente no asociado, solicitante, adherente, beneficiario, garante, representante, autorizado, propietario, ocupante, profesional, empleado, proveedor, vendedor, chofer, profesional de salud. Los roles de proveedor (M12), vendedor (M11), chofer y profesional de salud (M18) y empleado (M16) se derivan de los maestros que referencian la persona con `personId` obligatorio (DEC-097) y cada uno enlaza a su ficha en el módulo dueño. *Reemplazado (10-11-2026): "... profesional, empleado, proveedor." (sin vendedor, chofer ni profesional de salud).* | BASE §3, §83; DFA M3 "Administración de Personas"; DEC-097 | Núcleo | O2 | Informado | Una persona garante de otra cuenta y titular de la suya muestra los dos roles con enlaces. Un socio que además es proveedor y chofer muestra los tres roles en una sola ficha. |
| RF-PER-016 | Registrar profesionales (instaladores matriculados) como rol de persona con matrícula, certificado y vencimiento, para que M02/M10 los asignen. | INV `abm_Profesio`; REL §2 "Profesional (instalador), Certificado Nro/Vto" | Estándar | O3 | Adoptado | Un profesional con matrícula vencida no se puede asignar a un contrato nuevo. |
| RF-PER-017 | Administración de personas separada de titulares: alta, edición y consulta de personas que no son titulares. | DFA M3 [M]; INV `abm_Personas` (Configuración) | Núcleo | O2 | Adoptado | Se puede crear un garante que no es titular. |
| RF-PER-174 | **Alta asistida de persona desde los maestros de rol** (DEC-097): M12 (proveedores), M11 (vendedores), M18 (choferes y profesionales de salud) y M16 (empleados) no cargan identidad propia; para crear la ficha del rol invocan el alta asistida de M01 (PAN-PER-04 embebido en modo búsqueda y el servicio `per.findOrCreatePerson`), que busca coincidencias con el motor de RF-PER-002 y RN-PER-011 (CUIT, documento, DNI dentro de la CUIT, nombre fonético, contacto, domicilio), ofrece reutilizar la persona existente o crearla con las validaciones del alta normal y devuelve el `personId`. El maestro guarda solo los datos del rol; nombre o razón social, identificaciones, condición fiscal, domicilios y contactos se editan en M01 y se leen desde allí. | DEC-097; BASE §3 regla de diseño; contraste NucleoTransversal aporte A5 | Núcleo | O2 | Adoptado | Dar de alta como proveedor a un socio existente propone su persona con puntaje 100 por CUIT y crea la ficha de proveedor con ese `personId` sin duplicar datos; crear un chofer con un nombre parecido al de un empleado muestra el candidato y exige declarar "es otra persona" con motivo; ningún maestro de rol acepta guardar sin `personId`. |

### 5.2 Identificación y verificación fiscal

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-018 | Varias identificaciones por persona (DNI, CUIT, CUIL, CDI, LE, LC, pasaporte, cédula extranjera, otro), una principal, según catálogo de tipos con códigos ARCA, INAES, ENARGAS y SENASA. | CAT `DOCUMENT`; RN-06 §23.5 `EsDni`/`GetDocument` | Núcleo | O2 | Adoptado | Una persona humana tiene DNI principal y CUIL relacionado; el tipo DNI tiene código ARCA 96, CUIL 86 y CUIT 80. |
| RF-PER-019 | Validar formato y dígito verificador de CUIT/CUIL en el momento de la carga. | DFA M3 mejora "Validaciones"; RN-06 §3.1 `ValidaCuit` | Núcleo | O2 | Informado | Un CUIT con dígito incorrecto muestra error en línea; uno correcto queda en estado "dígito válido". |
| RF-PER-020 | Verificar la CUIT/CUIL contra el padrón de ARCA, guardar la constancia (denominación, estado de la clave, condición frente al IVA, domicilio fiscal, actividades) y el resultado. | DFA M3 mejora; RN-06 §3.1 (`clsInformes_Titulares` contrasta con ARCA) | Estándar | O4 | A validar (PA-PER-05) | Con el servicio disponible se guarda la constancia; si no responde, queda "pendiente de verificación" y el job reintenta. |
| RF-PER-021 | Relacionar DNI y CUIT/CUIL de la misma persona solo cuando la relación está verificada. | BASE §83 | Núcleo | O2 | Informado | Un CUIT cuyo número de documento interno no coincide con el DNI queda como discrepancia y no se relaciona. |
| RF-PER-022 | Proponer el CUIL calculado a partir de DNI y sexo como identificación "no verificada", sin usarlo fiscalmente hasta verificarlo. | RN-06 §2 `CrearPersona`/`GenerarCuit` | Estándar | O2 | A validar (PA-PER-04) | El CUIL propuesto aparece con marca "calculado, sin verificar" y la emisión que exige CUIT no lo acepta. |
| RF-PER-023 | Alertar al confirmar la ficha si la CUIT de la persona no es correcta. | V2 2979 | Estándar | O2 | Adoptado | Con la política activa, guardar una ficha con CUIT inválida muestra advertencia o error según el nivel configurado. |
| RF-PER-024 | Exigir CUIT cuando la condición IVA de la cuenta lo requiere, en el momento de habilitar la contratación o la emisión, no en el registro. | RN-06 §3.1 `SITIVA.REQ_CUIT`; BASE §67, §83 | Núcleo | O2 | Informado | Una cuenta Responsable Inscripto sin CUIT verificada no puede activar contratos; un usuario registrado sin CUIT sí puede iniciar solicitudes. |
| RF-PER-025 | Unicidad de identificación (tipo + número) por tenant, con excepciones por política registradas y aprobadas. | RN-06 §3.1; V2 2077, V2 3196 | Núcleo | O2 | Adoptado (DEC-044; antes A validar PA-PER-02) | Crear una segunda persona con el mismo DNI se rechaza salvo excepción aprobada con motivo. |
| RF-PER-026 | Excepción de identificación (persona sin DNI ni CUIT en supuestos definidos) con documento alternativo, aprobación y sin inventar números. | BASE §83 | Estándar | O2 | Informado | Un extranjero con pasaporte se registra con pasaporte; el sistema nunca genera un DNI ficticio. |
| RF-PER-027 | Tipo de documento por defecto para personas físicas y jurídicas configurable. | V2 591, V2 592 | Estándar | O2 | Adoptado | Al elegir persona jurídica el tipo propuesto es CUIT. |
| RF-PER-028 | Historial de verificaciones de cada identificación (fuente, fecha, actor, resultado, evidencia). | AGR-010; BASE §97.1 | Estándar | O2 | Adoptado | La ficha muestra todas las verificaciones con su resultado y quién las hizo. |
| RF-PER-029 | Revalidación periódica configurable de la condición fiscal contra el padrón de ARCA, con informe de diferencias. | DFA M3 mejora; BASE §98 | Extensión | O4 | A validar (PA-PER-05) | El job mensual lista las cuentas cuya condición IVA difiere de la constancia vigente sin cambiarla automáticamente. |
| RF-PER-175 | **Personas migradas sin ningún documento** (DEC-099): la persona que llega de ProCoop sin ninguna identificación se crea con `identificationStatus = documentPending` (no se inventa un número, RF-PER-026); queda fuera del control de duplicados por documento y se compara por nombre y domicilio con aviso (RN-PER-136); entra en el informe de migración; genera una tarea de regularización en M09 con responsable; y, mientras siga pendiente, no puede recibir comprobantes fiscales que exijan identificar al receptor por documento (la validación al emitir es de M05). La regularización carga y valida el documento, ejecuta el control de duplicados por documento y pasa la persona a `identified`. Bandeja y filtro "documento pendiente" en PAN-PER-03. | DEC-099; contraste NucleoTransversal aporte A7; T07 (migración de LAG) | Núcleo | O2 | Adoptado | Una persona migrada sin documento aparece con chip "Documento pendiente", en el informe de migración y con una tarea abierta en M09; una segunda persona con el mismo nombre y domicilio genera aviso pero no bloquea; al cargarle un DNI ya usado por otra persona se abre un caso de duplicado; la emisión de un comprobante que exige documento del receptor para esa persona es rechazada por M05 con el motivo. |

### 5.3 Contactos, preferencias y consentimientos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-030 | Varios contactos tipados por persona (correo, celular, fijo, WhatsApp, fax), con principal, etiqueta, fuente (backoffice, portal, importación, legado web) y estado de verificación. | BASE §3; CAT `SUMSOC.EMAIL/MOVIL`, `SUMSOC_EXTRAS.CORREO_WEB/TELE_WEB` | Núcleo | O2 | Adoptado | Un celular cargado por el socio en el portal queda con fuente "portal" y no pisa el del backoffice. |
| RF-PER-031 | Verificar correo y celular por código de un solo uso cuando lo exija la política o la vía de ingreso. | CAT `VIAINGTE.VALIDAR_CELULAR/VALIDAR_MAIL`; PMovil 19 | Estándar | O2 | Adoptado | Si la vía "Portal" exige validar celular, el contacto queda "verificado" solo tras ingresar el código. |
| RF-PER-032 | Política de contactos con niveles no controlar / advertir / exigir, en el alta o siempre, para celular y correo, en personas y cuentas. | V2 2490, V2 744, V2 745; PMovil 15, 18; RN-06 §3.1 `ValidarDatosCuenta` | Núcleo | O2 | Adoptado | Con "exigir correo siempre", modificar una cuenta sin correo se rechaza; con "advertir" se pide confirmación. |
| RF-PER-033 | Normalizar teléfonos a formato E.164 y mostrarlos según formato local; opción de solo dígitos. | V2 2934 | Estándar | O2 | Adoptado | "0351 15-555-0000" se guarda normalizado y se muestra formateado. |
| RF-PER-034 | Regla de selección del destino de avisos por canal (prioridad portal/titular/ambos, uso del celular de la cuenta para facturas por WhatsApp), entregada a T09. | V2 2824, V2 3051, V2 3121; RN-06 §23.1 `GetNumeroDestino` | Estándar | O2 | Adoptado | Con prioridad "portal primero", T09 recibe el celular verificado del portal; si no existe, el de la cuenta. |
| RF-PER-035 | Contactos propios de la cuenta (correo y celular para facturas y avisos de esa cuenta), distintos de los de la persona. | CAT `SUMSOC` (EMAIL, MOVIL); RN-06 §2 | Núcleo | O2 | Adoptado | Dos cuentas del mismo titular envían la factura a correos distintos. |
| RF-PER-036 | Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. | V2 2460 | Estándar | O2 | Adoptado | Con la política activa, editar el correo de backoffice no borra el correo del portal. |
| RF-PER-037 | Preferencias de comunicación por canal y finalidad (factura electrónica, avisos de deuda y corte, novedades, encuestas, muro). | BASE §3; BASE §97.1 | Núcleo | O2 | Informado | Un socio que rechaza novedades por WhatsApp no recibe campañas por ese canal, pero sí avisos obligatorios. |
| RF-PER-038 | Contacto directo por WhatsApp y correo desde la ficha, registrado en el centro de comunicaciones. | DFA M3; REL §2 | Estándar | O2 | Informado | Enviar un correo desde la ficha deja la comunicación en la pestaña Comunicaciones. |
| RF-PER-039 | Registrar consentimientos con finalidad, base de tratamiento, versión del texto aceptado, canal, fecha y revocación. | BASE §33 "Consentimiento y finalidad"; §97.1 | Núcleo | O2 | Informado | Revocar el consentimiento de marketing deja constancia y deshabilita esa finalidad. |

### 5.4 Titulares

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-040 | Alta de titular sobre una persona existente o nueva, con número de titular secuencial único sin colisiones concurrentes. | CAT `SOCIOS`; RN-06 §2 `GetIdSocio`; Duda 22.7; INV `abm_Socios` | Núcleo | O2 | Adoptado | Dos altas simultáneas obtienen números distintos y consecutivos de la secuencia del tenant. |
| RF-PER-041 | Número de titular manual opcional, controlando unicidad. | V2 2660; RN-06 §2 `ValidarNumeroAsociado`, §3.1 `Existe_TitularConCodigo` | Estándar | O2 | Ajustado (DEC-017): el número manual se admite solo en la migración (T07 conserva `COD_SOC`); en la operación el número sale siempre de la secuencia | Un número manual repetido se rechaza; fuera de una corrida de migración el ingreso manual no está disponible. |
| RF-PER-042 | Series de numeración del titular (única, o separada por asociados y no asociados). | V2 32, V2 2673 | Estándar | O2 | Adoptado (DEC-017: secuencia única por tenant con atributo de tipo; antes A validar PA-PER-15) | Con serie única, el número no cambia cuando la persona se asocia o deja de ser asociada. |
| RF-PER-043 | Estados del titular (solicitante, activo, dado de baja), fecha de alta, fecha de baja, causa de baja de catálogo y detalle. | CAT `SOCIOS` (ALTA, BAJA, CAUSA, CAU_BAJA); RN-06 §5; INV `abmCausas` | Núcleo | O2 | Adoptado | La baja exige causa del catálogo y queda en la historia con fecha efectiva. |
| RF-PER-044 | Mostrar los vínculos de asociado desde M17, **uno por entidad jurídica** (DEC-096): por cada membresía de la persona, entidad jurídica (`legalEntityId`, nombre corto de `legalEntities` de T04), número de asociado, estado y fecha de ingreso, sin gestionar capital ni asamblea. Una persona socia de la cooperativa y afiliada de la mutual muestra dos vínculos. Con una sola entidad jurídica (PRM-CFG-039 = `false`) se muestra un único vínculo sin el nombre de la entidad. Los vínculos se filtran por la dimensión entidad jurídica del alcance del usuario (T02 RF-IAM-065; M17 RF-INS-015). *Reemplazado (10-11-2026, DEC-096): "Mostrar el vínculo de asociado (número de asociado, estado, fecha de ingreso) desde M17, sin gestionar capital ni asamblea."* | BASE §3; AGR-029; CAT `SOCIOS` (ACTIVO, NUM_SOC, ACCIONES, ACTA); DEC-096 | Núcleo | O2 | Informado | La ficha muestra "Asociado N° 1234, activo" leído de M17; editarlo abre M17. Una persona con membresía en COOP (N° 1001) y en MUTUAL (N° 1001) muestra "COOP — Asociado N° 1001, activo" y "MUTUAL — Afiliado N° 1001, activo"; un usuario con alcance `[MUTUAL]` ve solo el segundo. |
| RF-PER-045 | Dar de baja al titular con controles: servicios activos, capital integrado (consulta a M17), titular sin cuentas, relaciones en otras cuentas; con solicitud de baja imprimible. | RN-06 §5 `PermiteDardeBaja`; V2 340, V2 337, V2 2633, V2 2571, V2 2580; INV `abm_Socios.DarDeBaja`, `frmTitulares.Imprimir_SolicitudBaja` | Núcleo | O2 | Adoptado | Con un contrato activo y la política por defecto, la baja se rechaza con la lista de contratos; la constancia se genera con la plantilla configurada. |
| RF-PER-046 | Reactivar un titular dado de baja con motivo, aprobación y nueva fecha efectiva. | RN-06 §5 `ModificacionEspecial_Socio` ("recupera al socio"); INV `abm_Socios.LiberarSocio`, `frmMods_Especiales.btnRecuperar` | Estándar | O2 | Adoptado | La reactivación no borra la baja anterior: agrega un período nuevo en la historia. |
| RF-PER-047 | Conservar el número de titular al dar de baja, cuando así se indique. | CAT `SOCIOS`; RN-06 §5 `ACTIVOBAJA` | Estándar | O2 | Adoptado | El número de un titular dado de baja con "conserva número" no se reasigna. |
| RF-PER-048 | Política que permite o impide contratos en titulares que no son asociados. | V2 734 | Estándar | O2 | Adoptado | Con la política "impedir", M02 rechaza el alta de contrato para un cliente no asociado con el motivo. |
| RF-PER-049 | Señal "titular dado de baja" disponible para que M05 no facture a titulares de baja según política. | V2 741 | Estándar | O4 | Adoptado | El lote de facturación excluye y reporta los contratos de titulares dados de baja si la política está activa. |
| RF-PER-050 | Política de alta de titulares como no asociados por defecto (la asociación se tramita en M17). | V2 2591 | Estándar | O2 | Adoptado | Con la política activa, un titular nuevo queda "cliente no asociado" hasta que M17 informa la asociación. |
| RF-PER-051 | Indicador de gestión judicial del titular, informado por M08 (solo lectura en PER). | CAT `SOCIOS.JURIDICO` | Estándar | O6 | Adoptado | La ficha muestra la marca y enlaza al expediente de M08. |
| RF-PER-052 | Garante del titular mediante relación de garantía con vigencia; exigencia según política. | CAT `SOCIOS.COD_GAR`; V2 54, V2 2469 | Estándar | O2 | Adoptado | Con "exigir garantía al ingresar titulares", el alta sin garante vigente se rechaza. |
| RF-PER-053 | Indicador "representante en asamblea" leído de M17. | RN-06 §23.1 `EsRepresentante` (`REP_ASAMBLEA`) | Extensión | O10 | Adoptado | La marca aparece en la ficha cuando M17 la informa. |
| RF-PER-054 | Impresiones desde la ficha: ficha del titular, ficha de cuenta, ficha de adherentes, contrato, fianza de cuenta y de servicio, solicitud de alta/baja, deuda y deuda vencida (datos de M07), detalle de llamadas (datos de M10), consulta de cambio de plan de vivienda (M18), reportes marcados. | INV `abm_Socios` (`ImprimirFichaCuenta`, `ImprimirFichaAdherentes`, `ImprimirContrato`, `ImprimirFianzaCuenta`, `ImprimirFianzaServicio`, `ImprimirSolicitudAltaBaja`, `ImprimirDeuda`, `ImprimirDeudaVencida`, `ImprimirDetalleLlamadas`, `ImprimirConsultaCambioPlanVivienda`, `ImprimirReportesMarcados`, `Imprimir_Plantillas`), `frmImpresiones`, `frmTitulares.barButtonImpFicha` | Estándar | O2 | Adoptado | Cada impresión usa una plantilla versionada del tenant y genera PDF guardado en T11 cuando corresponde. |

### 5.5 Cuentas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-055 | Alta de cuenta para un titular con número único, fecha de alta, domicilio postal, condición IVA, contactos y entrega de factura. | CAT `SUMSOC`; RN-06 §2 `Guardar_SUMSOC`, §23.1 `Completar_Sumsoc`; INV `abm_SumSoc` | Núcleo | O2 | Adoptado | La cuenta nueva toma la fecha de hoy como alta y deja el evento "Cuenta creada" en la historia. |
| RF-PER-056 | Exactamente una cuenta principal por titular con cuentas; cambiar la principal en una sola transacción. | RN-06 §2 `Validar_Titular`; V2 2374, V2 3164, V2 3193; INV `abm_SumSoc.chPrincipal` | Núcleo | O2 | A validar (PA-PER-09) | Marcar otra cuenta como principal desmarca la anterior; nunca quedan cero ni dos principales. |
| RF-PER-057 | Cerrar una cuenta sin contratos vigentes, con motivo; reabrirla con aprobación. El saldo pendiente se informa desde M07 y no impide cerrar la estructura si la política lo permite. | AGR-003; RN-06 §23.2 | Núcleo | O2 | Adoptado | Cerrar una cuenta con contratos activos se rechaza con la lista; una cerrada con saldo sigue visible en cobranza. |
| RF-PER-058 | Condición IVA por cuenta (catálogo de M06) con valor propuesto desde el perfil fiscal del titular y advertencia si difiere de la constancia de ARCA. | RN-06 §2 (`COD_SIT` → `SITIVA`), §23.5 `GetSituacionImpositiva`; DFA M3 "Datos de cada cuenta" | Núcleo | O2 | Adoptado | Sin cuenta, la condición propuesta es Consumidor Final; una cuenta Exento con constancia Responsable Inscripto muestra advertencia. |
| RF-PER-059 | Datos de Ingresos Brutos de la cuenta (situación, número de inscripción, "no resetear", "no cobrar percepción", alícuota determinada), cuyos catálogos y cálculo son de M06. | RN-06 §23.6 `ReasignarIngresoBrutos`, `RegistrarIi_BB`; V2 2312; INV `abm_SumSoc.chkNo_REset`, `chkNocobrarPercepcion`, `btnAlicuota` | Estándar | O4 | Adoptado | Una cuenta marcada "no resetear" no cambia en la reasignación masiva de M06. |
| RF-PER-060 | Domicilio postal de la cuenta, empresa postal de reparto y zona/sector/recorrido de reparto de facturas. | CAT `SUMSOC` (domicilio, COD_POS, zona/sector/recorrido); V2 2506, V2 2031, V2 2032, V2 2033; RN-06 §23.1 `GetGridView_RecorridosFactura`; INV `abm_SumSoc.oEmpresaPostal` | Núcleo | O2 | Adoptado | Con "exigir empresa postal", la cuenta sin empresa postal no se guarda; el recorrido de reparto se lista por zona. |
| RF-PER-061 | Distrito y sección de la cuenta, con autocompletado del distrito al ingresar la sección y exigencia configurable en la cuenta principal (excepto titulares no asociados). | CAT `DISTRITO_SECCION`; V2 2285, V2 2373, V2 3193; INV `abm_SumSoc.Cargar_Distrito`, `txtSeccion_Leave`, `btnAddSeccion`; `amb_DistritoSeccion` | Estándar | O2 | Adoptado | Ingresar una sección existente completa su distrito. |
| RF-PER-062 | Grupo contable de la cuenta (catálogo de M15), exigible por política. | V2 2738; INV `abm_Gru_Con` | Estándar | O5 | Adoptado | Con la política activa, la cuenta sin grupo contable no se guarda. |
| RF-PER-063 | Atributo "conjunto" de la cuenta, exigible por política. | V2 703 **[VERIFICAR]** significado | Extensión | O2 | A validar | Se implementa como campo extra precargado hasta confirmar su semántica. |
| RF-PER-064 | Entrega de factura de la cuenta: factura electrónica (correo, WhatsApp), no enviar papel, marca automática según política y confirmación para desmarcar la factura electrónica. | RN-06 §23.1 `Requiere_Confirmacion_Desmarcar_FacturaE`; V2 2642; PMovil 32; INV `abm_SumSoc.chFacturaElectronica`, `chNoEnviarFactura` | Núcleo | O2 | Adoptado | Desmarcar la factura electrónica de un servicio que lo exige pide confirmación explícita y queda auditado. |
| RF-PER-065 | Ver y gestionar desde la cuenta la adhesión a débito automático (tarjeta, CBU, titular de la tarjeta, estado en la pasarela, exclusiones por tipo de comprobante), delegando la operación a M07. | CAT `SUMSOC_EXTRAS.DEBITO_360_ID/ESTADO`; RN-06 §23.1 `Guardar_DebitosExcluidos`, `Crear_SU_EMP_CBU`; V2 2623; INV `abm_SumSoc.chDebitoAutomatico`, `btnAltaDebAuto`, `btnBajaDebAuto`, `Set_TitularTarjeta`, `btnBuscarTitularTarjeta`, `cmdExcluirDebitos`, `txtNumeroTarjeta_*` | Estándar | O5 | Adoptado | La pestaña muestra la adhesión vigente de M07; el alta se ejecuta en M07 y vuelve con estado. |
| RF-PER-066 | Marca "excluir redondeo" de la cuenta, consumida por M05. | CAT `SUMSOC_EXTRAS.EXCLUIR_REDONDEO` | Extensión | O4 | Adoptado | Una cuenta marcada no recibe el ajuste de redondeo en su comprobante. |
| RF-PER-067 | Marca "no cobrar recargo" de la cuenta con autorización según política; el efecto lo aplica M08/M07. | V2 3135, V2 3162 | Estándar | O6 | Adoptado | La marca exige aprobación cuando la política lo indica y figura en la historia. |
| RF-PER-068 | Número de ficha correlativo de la cuenta. | RN-06 §23.1 `getSetNroFicha`; CAT `SUMSOC_EXTRAS.NROFICHA` | Extensión | O2 | Adoptado | El número sale de una secuencia del tenant, no de MAX+1. |
| RF-PER-069 | Estructura de la cuenta en árbol: cuenta → grupos de facturación (M05) → contratos (M02) con servicio, identificador de medidor o conexión, estado y categoría; indicador "posee varios grupos". | DFA M3 ficha; REL §2 jerarquía; RN-06 §8 `PoseeGrupos`, §11 | Núcleo | O2 | Informado | La ficha de la Municipalidad ficticia muestra Energía (conectado, alumbrado público) y Gas (baja) en su grupo. |
| RF-PER-070 | Orden y presentación de los contratos de la cuenta: por grupo e identificador; mostrar observación del contrato; desagrupar; mostrar por defecto solo contratos activos. | RN-06 §23.6 `DetalleCuenta`; V2 2557, V2 3152, V2 2321 | Estándar | O2 | Adoptado | Con "solo activos" por defecto, el filtro puede desactivarse y se recuerda por usuario. |
| RF-PER-071 | La cuenta de PER es la unidad estructural; la modalidad de cuenta corriente separada o unificada es política de M07 y nunca mezcla titulares. | BASE §68 CTA-001; §83 TIT-003 | Núcleo | O2 | Informado | Una cuenta unificada del titular A no incorpora contratos de B aunque compartan domicilio. |
| RF-PER-072 | Validaciones del alta de cuenta: domicilio completo, contactos, zona (si se exige), distrito/sección, grupo contable, conjunto, empresa postal y deuda en el domicilio, cada una con su política. | RN-06 §3.1; V2 213, V2 703, V2 2285, V2 2506, V2 2738, V2 2669; INV `abm_SumSoc.frm_Sumsoc__ValidFields`, `Validar_DeudaDomicilio`, `ValidarDatosInforme` | Núcleo | O2 | Adoptado | Cada validación fallida indica el campo y la política que la exige. |

### 5.6 Domicilios y geolocalización

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-073 | Domicilio normalizado con el catálogo geográfico (país, provincia, departamento/municipio, localidad, código postal, calle, barrio) más altura o "sin número", piso, departamento, edificio/torre, entrecalles, referencias de acceso y datos rurales (ruta, kilómetro, paraje, lote, campo). | BASE §4, §77 GEO-001; CAT §30 `CALLES`, `BARRIOS`, `LOCALIDA`, `PROVINC`, `DEPTO`, `PAISES` | Núcleo | O2 | Informado | Se carga un domicilio rural sin altura con referencias y queda válido. |
| RF-PER-074 | Conservar el texto original y la versión normalizada con su procedencia (fuente, identificador en la fuente, versión del catálogo, fecha). | BASE §77 | Núcleo | O2 | Informado | Re-normalizar no pierde el texto original. |
| RF-PER-075 | Domicilios de la persona por rol: real/personal, fiscal (desde ARCA), postal/correspondencia, laboral; con vigencia. | BASE §3, §77 | Núcleo | O2 | Informado | El domicilio fiscal de ARCA convive con el real y el postal sin pisarlos. |
| RF-PER-076 | Obtener candidatos de ubicación, mostrar el punto en Google Maps y permitir confirmarlo o corregirlo. | BASE §77 GEO-002, GEO-003; DFA M3 mejora "Domicilios normalizados" | Núcleo | O2 | Informado | El operador ve el candidato y confirma; queda "confirmado" con autor y fecha. |
| RF-PER-077 | Estado y precisión del punto: confirmado, aproximado, pendiente, para revisar, no disponible; sin mostrar precisión inexistente. | BASE §77 | Núcleo | O2 | Informado | Un punto por centroide de localidad se muestra "aproximado". |
| RF-PER-078 | Historial de ubicación de cada domicilio (fuente, momento, actor, motivo). | BASE §77 | Núcleo | O2 | Informado | Corregir el punto deja la versión anterior consultable. |
| RF-PER-079 | Ubicación por coordenadas o referencias cuando no hay coincidencia de calle y altura, con revisión. | BASE §77; CU-GEO-01 | Núcleo | O2 | Informado | Un loteo nuevo sin calle en catálogo se guarda con texto y punto marcado "para revisar". |
| RF-PER-080 | Ante caída o límite del proveedor, guardar el formulario y dejar pendiente el enriquecimiento geográfico. | BASE §77 | Núcleo | O2 | Informado | Con el geocodificador caído, la cuenta se guarda y el job la completa después. |
| RF-PER-081 | Usar la ubicación del dispositivo solo con permiso y ofreciendo alternativa. | BASE §77 [GEO-F6] | Estándar | O2 | Informado | Si el socio niega el permiso, puede marcar el punto en el mapa o escribir referencias. |
| RF-PER-082 | Controlar acceso al mapa, exportaciones y API de domicilios por tenant, permiso y relación autorizada. | BASE §77 | Núcleo | O2 | Informado | Un usuario sin `per.domicilios.ver` no ve el mapa ni exporta direcciones. |
| RF-PER-083 | Formato de impresión del domicilio configurable (con o sin piso, departamento, barrio y código postal). | RN-06 §8 `GetDomicilio`, §23.6 `GetDescripcion`; V2 2918 | Estándar | O2 | Adoptado | El tenant elige el formato y la factura lo usa. |
| RF-PER-084 | Solicitar el alta de una calle no encontrada al catálogo de T04 según permiso de carga de calles. | V2 2309; INV `txtCalles` (Configuración) | Estándar | O2 | Adoptado | Sin permiso, el operador deja la solicitud y el domicilio queda con texto original. |
| RF-PER-085 | Alternativa accesible al mapa en todos los recorridos (texto, referencias, teclado). | AGR-032 | Núcleo | O2 | Adoptado | Un recorrido de alta se completa con teclado y sin operar el mapa. |

### 5.7 Inmuebles y puntos de prestación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-086 | Registrar inmuebles con domicilio, nomenclatura catastral de seis partes configurable (numérica o alfanumérica), partida, chacra, quinta, fracción, parcela y subparcela, y todos los atributos de `PROPIEDA`. | BASE §4; DFA M3 `PROPIEDA`; CAT `PROPIEDA` (+89); V2 2281, V2 2320; INV `abm_Propieda` | Núcleo | O2 | Informado | El tenant cambia las etiquetas Cod/Sec/Man/Par/PH/Lote y el formulario las usa. |
| RF-PER-087 | Unidades funcionales dentro de un inmueble (propiedad horizontal), con cantidad de departamentos y tipo de edificio. | CAT `PROPIEDA` (UNIDAD_FUNCIONAL, CANTIDAD_DE_DPTOS, TIPO_EDIF, CAT_PH); BASE §4 | Núcleo | O2 | Adoptado | Un edificio con 8 unidades permite un punto de prestación por unidad. |
| RF-PER-088 | Relaciones persona–inmueble con vigencia: propietario, copropietario, ocupante, inquilino, poseedor, administrador de consorcio, responsable de pago. | BASE §4 "Relacionar propietario, ocupante, titular y responsable de pago"; CAT `PROPIEDA.COD_PER` | Núcleo | O2 | Informado | El propietario puede no ser titular de ningún contrato del inmueble. |
| RF-PER-089 | Uso y estado del inmueble con catálogos del tenant (por ejemplo vivienda, comercio, baldío; habitado, deshabitado, en construcción). El catálogo de usos (`premiseUsages`, §7.18) es también el **uso del suministro** que M06 puede usar como condición opcional de la alícuota de IVA en `vatRateMatrix`, desactivada por defecto hasta que el contador confirme la regla (DEC-102, PA-FIS-26); M06 lo lee por contrato → punto de prestación → inmueble (`premises.usageId`). Cada valor del catálogo lleva una clase normalizada (residencial, comercial, industrial, rural, otro) para que M06 la use sin depender de los nombres propios del tenant. | DFA M3 `USOINM`, `ESTINM`; DEC-102 | Estándar | O2 | Adoptado | Un inmueble baldío se filtra en el padrón de inmuebles. Un uso "Local comercial" del tenant tiene clase `commercial` y M06 lo recibe al calcular la alícuota solo si activó la condición. |
| RF-PER-090 | Ítems de propiedad con valores (atributos tipados del inmueble). | DFA M3 `PROPIEITEMS*` | Estándar | O2 | Adoptado | Se agrega el ítem "superficie de pileta" numérico y se informa en el inmueble. |
| RF-PER-091 | Buscar inmuebles por nomenclatura (por partes), nomenclatura completa, partida, domicilio y persona, y seleccionarlos desde el alta de contrato. | INV `abm_Propieda` (búsqueda por Cir/Sec/Man/Par/PH/Lote/Nomenclatura), `frmSeleccionarInmueble`, `abm_SumSoc.oInmueble_*`, `abm_SerSoc.Control_GetInmueble`, `PrecargarDesdeInmueble` | Núcleo | O2 | Adoptado | Buscar por manzana y parcela devuelve los inmuebles coincidentes con igualdad normalizada. |
| RF-PER-092 | Impedir duplicar la misma parcela catastral y avisar coincidencias parciales. | RN-06 §3.2 punto 4, §23.1 `ValidarPropiedadCatastral` | Núcleo | O2 | Adoptado | Dar de alta una nomenclatura ya existente se rechaza y ofrece el inmueble existente. |
| RF-PER-093 | Puntos de prestación: dirección normalizada, inmueble, unidad, ubicación, datos de acceso y referencias; uno o varios contratos, incluso del mismo servicio y de titulares distintos. | BASE §4, §33 "Dirección de prestación", §77, §83 TIT-002 | Núcleo | O2 | Informado | En DIR-CASA-001 existen dos contratos de Internet de dos titulares distintos. |
| RF-PER-094 | Consultar contratos de un punto o inmueble respetando privacidad: quien no tiene relación con un contrato ve solo que existe, sin titular ni deuda. | BASE §83 | Núcleo | O2 | Informado | El hermano A no ve en el portal los datos del contrato de B en el mismo domicilio. |
| RF-PER-095 | Atributos del inmueble para cuotas de obra (frentes, ancho de calle por frente, zonas por frente, longitud y porcentaje de bocacalle, superficie, superficie edificada, coeficientes zonal y de edificación, TBM, metros de alumbrado y cloaca) disponibles para M02/M04. | CAT `PROPIEDA`; RN-06 §23.6 `Cuotas_Obra` | Estándar | O7 | Adoptado | M04 lee frente × ancho de calle del inmueble para calcular la cuota de pavimento. |
| RF-PER-096 | Precargar un contrato desde un inmueble o una factibilidad, y actualizar el inmueble desde el contrato con permiso. | INV `abm_SerSoc.PrecargarDesdeInmueble`, `PrecargarDesdeFactibilidad`, `ActualizarPropiedad`, `btnActualizaPropiedad` | Estándar | O3 | Adoptado | Elegir el inmueble completa domicilio y catastro del contrato. |
| RF-PER-097 | Identificador GIS del inmueble y del punto, enlazado con M10. | CAT `PROPIEDA.COD_CNT`, `SERSOC_EXTRAS.GIS`; REL §2 "GIS" | Extensión | O7 | Adoptado | Desde el punto se abre el elemento de red en M10. |
| RF-PER-098 | Mudanza del titular: cierre del contrato en el punto de origen y alta en destino, o traslado técnico por OT, orquestado con M02 y M10, sin trasladar deuda. | BASE §4 "Gestionar mudanzas y transferencias"; RN-06 §8; INV `abm_Socios.CambioDomicilio` | Núcleo | O3 | Informado | La mudanza deja el contrato de origen con su deuda y fecha de cierre, y el de destino con su fecha de activación. |

### 5.8 Relaciones, representaciones y garantías

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-099 | Relaciones persona–persona tipadas (cónyuge, hijo, padre/madre, hermano, conviviente, grupo familiar, discapacitado a cargo, representante legal, apoderado, tutor/curador, miembro de organización) con vigencia y evidencia. | CAT `VINCULOS`; DFA M3 `VINCULOS`, `RELACION_ENTIDADES`; INV `abm_Vinculos`; AGR-007 | Núcleo | O2 | Adoptado | La relación "cónyuge" tiene inicio y fin; terminada, deja de habilitar acciones. |
| RF-PER-100 | Representaciones y autorizaciones sobre titular, cuenta o contrato, con alcance por acción (consultar, pagar, solicitar gestiones, solicitar baja, firmar conformidad, recibir notificaciones, actualizar datos), vigencia y evidencia. | AGR-007; BASE §3 "Registrar representantes y personas autorizadas" | Núcleo | O2 | Informado | Un autorizado para "pagar" no puede solicitar la baja. |
| RF-PER-101 | Garantes y responsables de titular, cuenta o contrato, con vigencia y exigencia según política del servicio y de la cuenta. Fuente legacy de garantes: `SOCIOS.COD_GAR` (garante del titular, CAT) y el garante del servicio en `SERSOC` (REL §2; columna **[VERIFICAR]** contra el esquema real). | CAT `SOCIOS.COD_GAR`; RN-06 §3.2 punto 8; V2 2544; REL §2 "Garante". *Reemplazado (10-11-2026, DEC-104): "DFA M3 `RESPONSA`; RN-06 §3.2 punto 8; V2 2544; REL §2 "Garante""; `RESPONSA` son técnicos y cobradores de campo y su destino es M10 (T07), CTR-PER-22.* | Núcleo | O2 | Adoptado | Un contrato de un servicio que exige garante no se activa sin garantía vigente. |
| RF-PER-102 | Verificar y aprobar relaciones según su tipo (doble control para poderes y representación de organizaciones). | AGR-007; AGR-008 | Núcleo | O2 | Adoptado | Un poder cargado por un operador queda "pendiente" hasta que un supervisor lo verifica. |
| RF-PER-103 | Revocación manual y vencimiento automático de relaciones, con aviso previo. | AGR-007 | Núcleo | O2 | Informado | Al vencer, el autorizado pierde acceso a la cuenta desde ese día. |
| RF-PER-104 | Registrar en cada operación hecha en nombre de un tercero quién actuó, por quién y con qué relación. | AGR-007 criterio | Núcleo | O2 | Informado | La auditoría de un pago hecho por un apoderado guarda actor, representado y relación. |
| RF-PER-105 | Autorizados gestionados por el titular desde el portal, con alcance limitado. | AGR-007; BASE §3 | Estándar | O2 | A validar (PA-PER-12) | El titular agrega un autorizado para consultar y pagar; los alcances mayores piden validación. |
| RF-PER-106 | Representación de personas jurídicas: la organización actúa solo por representantes vigentes con su alcance. | AGR-007 | Núcleo | O2 | Informado | Si el representante cesa, deja de ver las cuentas de la organización. |
| RF-PER-107 | El pago de un tercero se registra en M07 como pagador sin crear relación ni derechos. | BASE §83; AGR-007; ESC-01 | Núcleo | O5 | Informado | El hermano que pagó no obtiene acceso a los contratos del otro. |
| RF-PER-108 | Antes de una baja o transferencia, informar si la persona es adherente, beneficiaria, garante de un contrato conectado, garante de una cuenta o garante de un titular en otra cuenta. | RN-06 §23.1 `Get_Relacion_OtraCuenta`; V2 2571 | Estándar | O2 | Adoptado | La baja muestra "es garante de la cuenta 1002" antes de confirmar. |

### 5.9 Adherentes y beneficiarios

**Sección reemplazada por M18 SOC §5.2** (DEC-071, HUECO-TRV-01): M18 es dueño único de adherentes y beneficiarios; M01 solo los muestra. Los requisitos se conservan con su texto original y el ID que los reemplaza.

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-109 | **Reemplazado por RF-SOC-011, RF-SOC-014 y RF-SOC-024** (M18, dueño único; HUECO-TRV-01). Texto original: Adherentes y beneficiarios por contrato con persona, vínculo, titular del grupo, fechas de alta y baja, tarifa de adherente (M04), impresión (fecha y marca), recupero y observación. | CAT `ADHSOC`, `BENSOC`; RN-06 §10; INV `abm_adhsoc`, `abm_SerSoc.btnAgregarAdh`, `btnAgregarBenef` | Núcleo | O10 | Reemplazado por RF-SOC-011, RF-SOC-014 y RF-SOC-024 (HUECO-TRV-01) | Un contrato de sepelio con cuatro adherentes muestra vínculo y vigencia de cada uno. |
| RF-PER-110 | **Reemplazado por RF-SOC-013** (M18, dueño único; HUECO-TRV-01). Texto original: Impedir que una persona sea adherente activa del mismo servicio en dos contratos, salvo política; ofrecer dar de baja la adhesión anterior. | RN-06 §23.1 `PersonaEsAdherente`; V2 2400, V2 2521 | Núcleo | O10 | Reemplazado por RF-SOC-013 (HUECO-TRV-01) | Cargar un adherente ya activo en otro contrato de sepelio informa la cuenta y ofrece la baja anterior. |
| RF-PER-111 | **Reemplazado por RF-SOC-015 y RF-SOC-016** (M18, dueño único; HUECO-TRV-01). Texto original: Condiciones del adherente por categoría (rango de edad, ocupaciones y vínculos admitidos) y bajas o cambios de categoría en lote, con notificación imprimible o por canal. | RN-06 §10, §23.1 `Get_Cod_Adh_Condicion`, `DarBaja_Adherentes_Condicion`, `CambiarCategoria_Adherentes`; INV `frmBajaAdherentesCondicion` | Estándar | O10 | Reemplazado por RF-SOC-015 y RF-SOC-016 (HUECO-TRV-01) | El proceso lista adherentes fuera de rango, el operador confirma y se generan notificaciones. |
| RF-PER-112 | **Reemplazado por RF-SOC-017** (M18, dueño único; HUECO-TRV-01). Texto original: Aviso de adherentes que cumplen la mayoría de edad configurada (21 años por defecto) a un correo configurable. | RN-06 §10 `Get_Adherentes_MayoriaEdad`; V2 3186, V2 3187 | Estándar | O10 | Reemplazado por RF-SOC-017 (HUECO-TRV-01) | El job diario avisa los adherentes que cumplen la edad ese día. |
| RF-PER-113 | **Reemplazado por RF-SOC-019** (M18, dueño único; HUECO-TRV-01). Texto original: Los adherentes y beneficiarios siguen la desconexión y reconexión del contrato, excepto los fallecidos; consulta opcional al reconectar. | RN-06 §10, §23.1 `Reconectar_Adherentes`; V2 2401 | Estándar | O10 | Reemplazado por RF-SOC-019 (HUECO-TRV-01) | Reconectar un contrato no reconecta a un adherente fallecido. |
| RF-PER-114 | **Reemplazado por RF-SOC-149** (M18, dueño único; HUECO-TRV-01). Texto original: Importar adherentes desde archivo. | INV `abm_SerSoc.btnImportarAdh` | Extensión | O10 | Reemplazado por RF-SOC-149 (HUECO-TRV-01) | La importación usa ExcelImportWizard con vista previa de errores. |
| RF-PER-115 | **Reemplazado por RF-SOC-023** (M18, dueño único; HUECO-TRV-01). Texto original: Consultar la deuda del adherente (cuentas donde es titular o persona de la cuenta) al agregarlo, según política. | RN-06 §23.1 `Get_DeudaAdherente`; V2 2545 | Estándar | O10 | Reemplazado por RF-SOC-023 (HUECO-TRV-01) | Con la política activa, un adherente con deuda propia muestra advertencia. |
| RF-PER-116 | **Reemplazado por RF-SOC-012** (M18, dueño único; HUECO-TRV-01). Texto original: Política "no exigir adherente titular". | V2 109 | Extensión | O10 | Reemplazado por RF-SOC-012 (HUECO-TRV-01) | Con la política desactivada, el contrato exige que el titular figure como adherente. |
| RF-PER-117 | **Reemplazado por RF-SOC-021** (M18, dueño único; HUECO-TRV-01). Texto original: Ocultar por defecto en la ficha a los adherentes dados de baja por fallecimiento. | V2 3058 | Extensión | O10 | Reemplazado por RF-SOC-021 (HUECO-TRV-01) | Un filtro permite mostrarlos. |

### 5.10 Notas, bloqueos, documentación y adjuntos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-118 | Notas con fecha, título, texto, autor, destino (persona, titular, cuenta, contrato), categoría y visibilidad (interna, caja, portal). | DFA M3 ficha; CAT `NOTA_SUM`; INV `frmNota_Sum`, `abm_Socios.Modificar_ObsTitular`, `Modificar_Obs_Cuenta`, `ModObsSer`, `Elimina_Obs_Cuenta`, `Elimina_Obs_Servicio` | Núcleo | O2 | Informado | Una nota de visibilidad "caja" se muestra al cajero al seleccionar la cuenta. |
| RF-PER-119 | Historial de modificaciones de cada nota y borrado lógico con motivo, conservando la evidencia. | RN-06 §23.1 `Crear_NOTA_SUM`, `Get_NOTA_SUM_Historial`, `GuardarHistorialNotas`; CAT `NOT_ELIMINADAS_HST`; INV `frmNota_Sum.CargarHistorial`, `lklModificaciones` | Núcleo | O2 | Adoptado | Eliminar una nota la oculta y la conserva con autor, fecha y motivo para auditoría. |
| RF-PER-120 | Notas automáticas del sistema no editables (cuenta creada, alta/desconexión del contrato, OT y transacción, recategorización, modificación especial, transferencia). | RN-06 §6, §23.1 `Guardar_NOTA_SUM*`, `Guardar_NOTA_SUM_SIN_OT`, `Completar_Sumsoc`, §23.2 | Estándar | O2 | Adoptado | La nota "Recategorización" generada por M04 aparece con marca de sistema. |
| RF-PER-121 | Importar notas desde archivo (fecha `dd-mm-yyyy` u otros formatos declarados). | RN-06 §23.1 `ImportarNotas_Cuentas` | Extensión | O2 | Adoptado | La importación valida la fecha y rechaza filas con cuenta inexistente. |
| RF-PER-122 | Mostrar observaciones de la cuenta en la búsqueda de titulares y la observación del contrato en la grilla. | V2 2744, V2 2557 | Estándar | O2 | Adoptado | Con la opción activa, la grilla de búsqueda muestra la última nota destacada. |
| RF-PER-123 | Bloqueos tipados sobre persona, titular, cuenta o contrato, con efectos explícitos (cobro en caja, pago web, facturación, emisión de deuda en web, baja, transferencia, nuevas contrataciones, reconexión, modificación de datos), causa de catálogo, mensaje para caja, vigencia y autor. | DFA M3 mejora "Bloqueos tipados"; CAT `NOTA_SUM.BLO_CAJ/MSG_CAJ`, `SUMSOC.BLOQUEAR_FAC_WEB`; DFA `HISBLOQ`, `CAUBLOQ`; RN-06 §23.1 `Cuenta_CajaBloqueada`, `BloquearPagoWeb` | Núcleo | O2 | A validar (PA-PER-16) | Un bloqueo "transferencia" impide transferir la cuenta y muestra la causa; el resto de operaciones sigue. |
| RF-PER-124 | Servicio de consulta de bloqueos vigentes por destino y efecto, que consumen M05, M07, M08, M02 y M19 antes de operar. | DFA M3 mejora; AGR-002 | Núcleo | O2 | Adoptado | La caja consulta "cobro en caja" y recibe el bloqueo con su mensaje. |
| RF-PER-125 | Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo). | DFA M3 `HISBLOQ` | Núcleo | O2 | Adoptado | La ficha lista bloqueos vigentes e históricos. |
| RF-PER-126 | Marca "no facturar" como bloqueo tipado sobre cuenta o contrato, con historial de marca y desmarca e importación desde archivo. | RN-06 §23.1 `Guardar_SUMNOFAC`, `Marcar_NoFacturarServicio`, `Marcar_Facturar`, `CambiarEstado_SUMNOFAC`, `ImportarCuentas_MarcaFacturar`; V2 2303; INV `frmNoFacturarServicios`, `frmTitulares.btnFacturarNoFac` | Estándar | O4 | Adoptado | Un contrato marcado "no facturar" queda fuera del lote con el motivo informado. |
| RF-PER-127 | Bloqueo de pago web y de publicación de comprobantes en el portal, consumido por M19/M07. | CAT `SUMSOC.BLOQUEAR_FAC_WEB`; PMovil 17 | Estándar | O5 | Adoptado | Con el bloqueo, el portal muestra la deuda sin botón de pago y con el mensaje configurado. |
| RF-PER-128 | Adjuntos de persona, titular, cuenta, contrato e inmueble almacenados en T11 con permisos heredados; contador en la ficha. | CAT `ADJUNTOS` (tipos 2 socio, 14 persona, 1 cuenta, 12 servicio); RN-06 §23.1 `Get_InfoAdjuntos`; INV `abm_Socios.CargarInfoAdjuntos`, `abm_SumSoc.ok_Cancel_ClickAdjuntos` | Núcleo | O2 | Informado | Un adjunto de la cuenta solo lo ve quien puede ver la cuenta. |
| RF-PER-129 | Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. | CAT `TRAMITES`, `PTRAMITES`; DFA M3 `REQUISITOS`, `REQUISITOS_ITEMS`; RN-06 §23.1 `PTRAMITES`; INV `abm_Tramites`, `frmPTramites`, `abm_Socios.Elimina_TMT_Cuenta`, `Elimina_TMT_Titular` | Núcleo | O2 | Adoptado | Un certificado de discapacidad con vigencia de 365 días vence al día 366 si no hay otro vigente. |
| RF-PER-130 | Consultas de presentados, no presentados y vencidos con filtros por titular, contrato, fechas, estado del titular y tipo; y acciones tipadas al alta o al vencimiento (por ejemplo, quitar beneficio, crear tarea, aplicar bloqueo). | RN-06 §23.3 `Get_TramitesPresentados`, `Get_TramitesNOPresentados`, `VerificaryEjecutar_AccionesAltaVto`; V2 2509; INV `frmTramite` | Estándar | O2 | Adoptado | Al vencer el certificado se ejecuta la acción tipada configurada y queda registrada; un error en una acción no frena las demás. |
| RF-PER-131 | Panel de trámites y gestiones de la cuenta en la ficha (documentación de PER más solicitudes y reclamos de M09). | DFA M3 "Panel de Trámites de la Cuenta"; REL §2 | Núcleo | O2 | Informado | El panel muestra la documentación vencida y las solicitudes abiertas. |

### 5.11 Transferencias, cambio de titularidad y mudanzas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-132 | Transferir una cuenta completa a otro titular (existente o nuevo) con validaciones (deuda, titular destino de baja, bloqueos) y efectos (contratos, grupos, débitos, IIBB, adherentes). | RN-06 §7 `TransferirCuenta`; V2 427, V2 2552; INV `frmTranferenciaCuenta`, `abm_Socios.transferirToolStripMenuItem` | Núcleo | O2 | Adoptado | La cuenta pasa al titular B con fecha efectiva; los comprobantes previos siguen a nombre de A. |
| RF-PER-133 | Cambio de titularidad de un contrato con fecha efectiva, preservando deuda e historia en el titular anterior; M02 ejecuta sobre el contrato. | BASE §4; DFA M3 mejora "Cambio de titularidad"; RN-06 §7 `TransferirServicio`; INV `frmTranferenciaServicio` | Núcleo | O4 | A validar (PA-PER-06, PA-PER-07) | Tras el cambio, el período anterior factura a A y el siguiente a B; la deuda de A queda en A. |
| RF-PER-134 | Iniciar desde la ficha la transferencia de capital entre titulares; la ejecuta M17. | RN-06 §7 `TransferirCapital`; INV `frmTranferenciaCapital` | Estándar | O10 | Adoptado | La operación aparece en el registro de transferencias con el resultado de M17. |
| RF-PER-135 | Simular los efectos antes de confirmar: deuda que queda en origen, conceptos a cobrar por transferencia (M04), cambios de IIBB, débitos automáticos, adherentes, grupo de facturación, relaciones y bloqueos. | RN-06 §7, §23.6 `ValidacionAdvertencia_IIBB`; V2 2782 | Núcleo | O2 | Adoptado | La simulación lista cada efecto; confirmar sin simular no es posible. |
| RF-PER-136 | Aprobación según política y ejecución idempotente con reversión controlada. | AGR-003, AGR-016 | Núcleo | O2 | Adoptado | Repetir la ejecución con la misma `Idempotency-Key` no duplica efectos; revertir deja ambos hechos en la historia. |
| RF-PER-137 | Registro de transferencias consultable y reimprimible (constancia con plantilla). | CAT `TRANSFER`; RN-06 §23.1 `Guardar_TRANSFER*`, `Get_TRANSFER_*`; INV `frmTransferenciasCuenta`, `frmReimpresionTrans` | Estándar | O2 | Adoptado | Se reimprime la constancia de una transferencia de hace un año. |
| RF-PER-138 | Crear el titular destino dentro de la transferencia, con opciones de no exigir cuenta principal y de marcar la cuenta transferida como principal. | INV `frmTranferenciaCuenta.NuevoTitular`, `btnNuevo`; V2 3164, V2 3195 | Estándar | O2 | Adoptado | La cuenta transferida a un titular nuevo queda como su principal. |
| RF-PER-139 | Al quedar el titular origen sin cuentas, proponer su baja (no ejecutarla automáticamente). | RN-06 §7; V2 2324 | Estándar | O2 | Adoptado | La confirmación ofrece "dar de baja al titular origen" como acción separada. |
| RF-PER-140 | Cambio de pagador o responsable de pago sin cambiar al titular. | AGR-007 | Estándar | O5 | Adoptado | El nuevo responsable de pago recibe las facturas por su canal sin acceder a otros contratos. |
| RF-PER-141 | Transferencia por fallecimiento o sucesión a herederos con evidencia documental. | AGR-007; RN-06 §23.2 (tareas tras fallecimiento) | Estándar | O4 | Adoptado | La transferencia exige adjuntar la documentación configurada para el tipo "sucesión". |

### 5.12 Ficha 360, búsqueda y padrón

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-142 | Búsqueda multicriterio de titulares por persona, calle, documento, CUIT, número de titular, rango "entre/y", cuenta, domicilio de servicios, solo cuentas con servicios activos, matrícula (exacta o parcial), medidor, teléfono y correo; con al menos un criterio. | DFA M3; REL §2; V2 3108; INV `frmTitulares`, `BuscadorInfoSocio`, `frmSeleccionar_InfoSocios`, `GridControl_Socios` | Núcleo | O2 | Informado | Buscar sin criterios no ejecuta la consulta y explica por qué. |
| RF-PER-143 | Grilla de resultados con N° de titular, nombre, documento, NIP (número de asociado), activo, más columnas configurables y vistas guardadas. | REL §2; DFA M3 | Núcleo | O2 | Informado | El usuario agrega la columna "localidad" y guarda la vista. |
| RF-PER-144 | Acciones sobre el resultado: Agregar, Modificar, Baja, Consultar, Imprimir y Operación. | REL §2; DFA M3 | Núcleo | O2 | Informado | Cada acción respeta la capability correspondiente; sin permiso el botón no aparece. |
| RF-PER-145 | Ficha 360 con pestañas Persona, Titular, Cuentas y servicios (árbol), Saldo y movimientos, Facturas, Pagos, Gestiones y trámites, Reclamos, Comunicaciones, Documentos, Notas y bloqueos, Relaciones, Inmuebles, Historia; se abre en solo lectura. | DFA M3 mejora "Ficha 360°"; REL §2 ("Sólo LECTURA"); BASE §3 | Núcleo | O2 | Informado | La ficha carga el resumen en menos de 2 s y cada pestaña bajo demanda. |
| RF-PER-146 | Vista simple de la ficha para operadores. | V2 2610 | Extensión | O2 | Adoptado | El usuario alterna vista simple y completa. |
| RF-PER-147 | Accesos directos desde la ficha: cuenta corriente, movimientos de capital, factibilidad, orden de trabajo, presupuesto, solicitud de ingreso, fianza, incidentes, cuenta de correo, consumo compartido y alta/baja de servicio (cada uno en su módulo). | INV `frmTitulares` (`barBtnCuentaCorriente`, `barBtnMovCapital`, `barBtnFactibilidad`, `barBtnOrdenTrabajo`, `barBtnPresupuesto`, `barBtnSolIngreso`, `barBtnFianza`, `btnAltaBajaServicio`), `frmConsultaIncidentes`, `frmCuentaCorreo`, `abm_Socios.IncidenteTecnicoToolStripMenuItem` | Estándar | O2 | Adoptado | Cada acceso abre la pantalla del módulo dueño con el contexto del titular. |
| RF-PER-148 | Padrón de titulares con filtros (estado, fechas de alta, deuda, servicios, facturas, distrito), columnas elegibles, credenciales, filtros guardados y exportación. | INV `frmPadronTitulares`, `frmPadronTitulares_Columnas`, `frmPadronTitulares_Credenciales`, `frmPadronTitulares_Filtros`, `Filtros_Padron`, `Fecha_Padron`; V2 50 | Estándar | O2 | Adoptado | El padrón filtrado se exporta a XLSX con las columnas elegidas, registrando la exportación. |
| RF-PER-149 | Informes y etiquetas de titulares, cuentas y servicios para correspondencia. | INV `frmCirculares` (`Imprimir_EtiquetasTitular`, `Imprimir_EtiquetasCuenta`, `Imprimir_EtiquetasServicio`, `Imprimir_Cuentas`) | Estándar | O2 | Adoptado | Las etiquetas usan el domicilio postal vigente con el formato del tenant. |
| RF-PER-150 | Exportaciones con permiso, minimización de campos y registro de quién exportó qué. | BASE §97.1; AGR-033 | Núcleo | O2 | Informado | Exportar el padrón sin `per.padron.exportar` es rechazado; cada exportación queda auditada. |

### 5.13 Historia, auditoría y datos extra

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-151 | Historia con fecha efectiva y fecha de registro de persona, titular, cuenta, domicilio, inmueble, punto de prestación y relaciones, que reemplaza `SUMSOC_HST`/`SERSOC_HST`. | AGR-010; BASE §3 "Conservar historial de cambios"; CAT `SUMSOC_HST`, `SERSOC_HST`; RN-06 §2 `GuardarHistorial` | Núcleo | O2 | Informado | Un cambio de domicilio con vigencia desde el 1 cargado el 15 muestra ambas fechas. |
| RF-PER-152 | Consulta "a una fecha" por fecha efectiva o por fecha de registro, declarando cuál interpreta. | AGR-010 | Núcleo | O2 | Informado | Consultar la cuenta al 31/10 devuelve el domicilio vigente ese día. |
| RF-PER-153 | Auditoría de cada cambio con actor, origen (pantalla, API, job, importación), tenant y motivo (T02). | BASE §54; AGR-007 | Núcleo | O2 | Informado | Cada edición tiene su evento de auditoría. |
| RF-PER-154 | Historial integrado en la ficha (cuenta, contrato, factibilidad, OT, presupuesto) con detalle de cambios. | RN-06 §23.1 `GetResumenHistorial`, `GetDatosHistorial`; INV `frmHistorial_SerSum`, `frmConsultaHistoriales`, tipos `Historial`, `Historial_Factibilidad`, `Historial_OrdenTrabajo`, `Historial_Presupuesto`; `frmTitulares.MostrarHistorial` | Estándar | O2 | Adoptado | La línea de tiempo mezcla los eventos de PER con los de M02, M10 y M11 filtrables por tipo. |

### 5.14 Duplicados y fusión

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-155 | Detectar posibles duplicados al alta y en un proceso periódico, con puntaje por documento, CUIT/CUIL (incluido DNI extraído del CUIL), nombre fonético, fecha de nacimiento, contacto y domicilio. Las personas `documentPending` no participan del puntaje por documento ni por CUIT/CUIL; se comparan por nombre fonético y domicilio y la coincidencia se informa como aviso (RN-PER-136, DEC-099). El mismo motor atiende el alta asistida desde los maestros de rol (RF-PER-174, DEC-097). | BASE §3 "Detectar posibles duplicados"; RN-06 §23.5 `Verificar_Persona_Cargada`; DEC-097; DEC-099 | Núcleo | O2 | Informado | Dos personas con igual DNI y apellido similar generan un caso de duplicado. |
| RF-PER-156 | Bandeja de duplicados con decisión registrada: "no es la misma persona" o "es la misma persona". | BASE §3 CU-03 excepción | Núcleo | O2 | Informado | Descartar un caso evita que vuelva a proponerse salvo nuevo dato. |
| RF-PER-157 | Fusión solo con acción autorizada y aprobación, reasignando referencias por eventos, dejando la persona absorbida como "fusionada" y permitiendo reversión. | BASE §3; AGR-006 apéndice 5.2 | Núcleo | O2 | A validar (PA-PER-10) | Tras la fusión, la búsqueda del DNI lleva a la persona sobreviviente y la ficha muestra la fusión en la historia. |
| RF-PER-158 | Nunca fusionar ni mostrar coincidencias entre tenants, ni fusionar por coincidencia de correo o DNI sin acción autorizada. | BASE §3 requisito multitenant; AGR-006 | Núcleo | O2 | Informado | La detección nunca consulta datos de otro tenant (prueba de aislamiento). |

### 5.15 Privacidad y vínculo usuario–persona

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-159 | Vincular un usuario de acceso (T02) con la persona del tenant mediante verificación, sin conceder acceso por coincidencia de nombre, documento o correo. | BASE §67 REG-001; AGR-006 | Núcleo | O2 | Adoptado (DEC-043; antes A validar PA-PER-01) | Un usuario con el mismo correo que un titular no ve sus cuentas hasta completar la verificación. |
| RF-PER-160 | Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. | AGR-006 | Núcleo | O2 | Adoptado | Revocar el vínculo cierra el acceso a esas cuentas en la sesión siguiente y en caché. |
| RF-PER-161 | "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. | BASE §50, §67; AGR-032 | Núcleo | O2 | Adoptado | El socio cambia su celular con verificación; un cambio de apellido genera una solicitud. |
| RF-PER-162 | En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. | BASE §39.6 "Asociado"; §83 | Núcleo | O2 | Informado | Un autorizado para consultar no ve el botón de baja. |
| RF-PER-163 | Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. | BASE §97.1; AGR-033 | Núcleo | O2 | Informado | Una solicitud de acceso genera la exportación de datos personales y se cierra con constancia. |
| RF-PER-164 | Exportación de los datos personales de una persona (derecho de acceso) en formato legible. | BASE §97.1 | Estándar | O2 | Informado | La exportación incluye datos, relaciones, consentimientos y contactos, sin datos de terceros. |
| RF-PER-165 | Anonimización o supresión de una persona compatible con la conservación fiscal y contable: los documentos económicos se conservan y los datos no necesarios se anonimizan. | BASE §97.1; AGR-033 | Estándar | O2 | A validar (PA-PER-14) | Anonimizar una persona sin obligaciones vigentes conserva sus facturas con la identificación fiscal exigida y borra contactos y preferencias. |
| RF-PER-166 | Inventario de datos del módulo por entidad: finalidad, base de tratamiento, sensibilidad, plazo de conservación. | BASE §97.1; AGR-033 | Núcleo | O2 | Informado | La sección 7 marca la categoría de cada campo personal. |
| RF-PER-167 | Minimización en API, exportaciones, bot e IA: no enviar datos personales a proveedores de IA sin acuerdo y evaluación previa. | BASE §97.1 | Núcleo | O2 | Informado | Las API externas devuelven solo los campos del contrato del cliente de API. |

### 5.16 Importación, operaciones especiales y configuración

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-PER-168 | Importación masiva de personas, titulares, cuentas, inmuebles y relaciones con ExcelImportWizard (subir, vista previa con errores, confirmar). | CNX §4.2; DFA §3 "Importación de padrones"; CAT/T07 | Estándar | O2 | Adoptado | Un archivo con 3 filas inválidas muestra los errores y confirma solo las válidas si el usuario lo elige. |
| RF-PER-169 | Operaciones especiales de corrección: cambiar el número visible del titular o de la cuenta, corregir fecha de alta del titular, recuperar titular; con permiso propio, motivo, aprobación y auditoría. | RN-06 §5 `ModificacionEspecial_Socio`, §23.2 `CambiarCuenta`; INV `frmMods_Especiales`, `frmCambioCuenta`, `frmTitulares.btnRenumeracion`, `btnCambiarNumeroCuenta` | Estándar | O2 | Adoptado | Renumerar cambia solo el número visible; los identificadores internos y referencias no cambian. |
| RF-PER-170 | Configuración del módulo: políticas (tres niveles), numeración, catálogos, conjuntos de campos extra, formatos de domicilio y nomenclatura, plantillas de impresión. | RN-06 §21.4; BASE §65 | Núcleo | O2 | Adoptado | Cada cambio de configuración se versiona con vigencia (T04). |
| RF-PER-171 | Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de requisito documental. | CAT §1 `VINCULOS`, `TRAMITES`; §30 `DOCUMENT`, `EST_CIVIL`, `OCUPACIO`; DFA M3 `USOINM`, `ESTINM`, `CAUBLOQ`; INV `abmCausas`, `abm_Vinculos`, `abm_Ocupacio`, `abm_Document` | Núcleo | O2 | Adoptado | Un valor de catálogo en uso no se borra: se desactiva. |
| RF-PER-172 | Publicar eventos de dominio de todas sus entidades para que los consuman los demás módulos (sección 12). | DEC-003; AGR-002 | Núcleo | O2 | Adoptado | Crear una cuenta publica `per.account.created` en la misma transacción (outbox). |
| RF-PER-173 | Enviar el código de vinculación al contacto verificado del titular (DEC-043, método `otpToRegisteredContact`) a pedido de M19 (RF-POR-179): dada la cuenta o el suministro, M01 resuelve el titular, elige su correo o celular **verificado**, genera un código de 6 dígitos de un solo uso con vencimiento (PRM-PER-102), lo envía por T09 y devuelve a M19 solo el contacto enmascarado y el identificador del intento; valida el código al ingresarlo, crea el vínculo `verified` y avisa al titular. Si la cuenta no existe o no tiene contacto verificado, responde lo mismo que en el caso exitoso (respuesta genérica, sin revelar existencia). | DEC-043; RF-POR-179 (M19); RF-POR-039 | Núcleo | O2 | Adoptado | Con el código correcto dentro de los 10 minutos el vínculo queda `verified` y el titular recibe el aviso; al sexto intento fallido la vinculación se bloquea 15 minutos; una cuenta inexistente recibe la misma respuesta que una existente. |

## 6. Reglas de negocio

Convención de la columna Decisión: **Replicar** (igual que ProCoop), **Mejorar** (misma intención, mejor implementación), **Reemplazar** (otro mecanismo), **Descartar** (no se replica, con motivo), **Delegar** (la regla es de otro módulo; aquí solo se aporta el dato o la señal).

### 6.1 Identidad y personas

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-001 | Dentro de un tenant, una persona se registra una sola vez y se reutiliza en todos sus roles, servicios, cuentas e inmuebles. | `PERSONAS` separada de `SOCIOS`; una persona puede ser titular, garante, profesional o responsable (DFA M3). | Replicar. | — | — |
| RN-PER-002 | Cada cooperativa tiene su padrón propio; una coincidencia de nombre, documento o correo entre cooperativas no autoriza consultar ni fusionar registros. | Una base por cooperativa (deuda técnica). | Reemplazar: base compartida con `tenantId` obligatorio y plugin que impide consultas sin tenant (DEC-002); la detección de duplicados nunca cruza tenants. | — | — |
| RN-PER-003 | Persona, titular, asociado, empleado, usuario de acceso, pagador, ocupante, propietario, representante, beneficiario y adherente son roles distintos; ninguno implica otro. | `SOCIOS` mezcla titular comercial y asociado (`ACTIVO`, `NUM_SOC`). | Mejorar: titular en `holders`, asociado en M17, ocupación/propiedad en `relationships` (CTR-PER-02). | — | — |
| RN-PER-004 | Ser asociado no activa una prestación; dar de baja un servicio no produce egreso de asociado ni devolución de capital. | No explícito. | Adoptar (BASE §3 límite; AGR-029). | — | — |
| RN-PER-005 | Unicidad de identificación por tipo y número dentro del tenant, con excepción solo por política y aprobación. | `Existe_TitularDocumento` (`clsSocios.cs:874`): no se admite el mismo tipo y número; V2 2077 lo permite; V2 3196 solo si el socio anterior está de baja o inactivo. | Mejorar: índice único parcial sobre identificaciones activas; excepción registrada con motivo y aprobador (PA-PER-02). Las personas `documentPending` no tienen identificación y quedan fuera del índice hasta regularizarse (RN-PER-136, DEC-099). | PRM-PER-010, PRM-PER-011 | — |
| RN-PER-006 | DNI y CUIT/CUIL de una misma persona se relacionan solo con verificación; no se presume equivalencia. | `CrearPersona` genera el CUIT desde DNI y sexo (`Impuestos.GenerarCuit`) y lo guarda en `PERSONAS.CDI`. | Mejorar: el valor calculado se propone como "no verificado" (PA-PER-04). | PRM-PER-012 | Algoritmo de `GenerarCuit` (Duda 22.1). |
| RN-PER-007 | El CUIT/CUIL debe tener 11 dígitos, prefijo válido (20, 23, 24, 27 para personas humanas; 30, 33, 34 para jurídicas) y dígito verificador módulo 11 con pesos 5-4-3-2-7-6-5-4-3-2; si el resto da 10 se usa el prefijo 23 (o 33) con el dígito que corresponda. | `Impuestos.ValidaCuit` en `CapaNucleo` (no revisado). | Mejorar: validador compartido en `packages/shared/fiscal` con pruebas por prefijo y caso del dígito 10. | — | Comparar con `ValidaCuit` (Duda 22.1). |
| RN-PER-008 | La CUIT es obligatoria cuando la condición IVA de la cuenta la requiere; se exige al habilitar la contratación efectiva o la emisión, no al registrarse. | `Validar_Titular` (`:917`): si `SITIVA.REQ_CUIT`, la cuenta exige CUIT. | Replicar en el momento correcto (BASE §67, §83; CTR-PER-19). | — | — |
| RN-PER-009 | La verificación contra el padrón de ARCA produce un resultado tipado (coincide, discrepa, inexistente, no disponible) y no cambia datos automáticamente; una discrepancia advierte o bloquea según política. | `clsInformes_Titulares.cs:1189-1211` contrasta con ARCA en un informe; V2 2979 alerta al confirmar. | Mejorar. | PRM-PER-013, PRM-PER-014 | — |
| RN-PER-010 | El tipo de documento se interpreta por su código ARCA: 96 DNI, 86 CUIL, 80 CUIT. | `EsDni` (`clsPersonas.cs:234`), `GetDocument` (`:366`). | Replicar mediante el catálogo de tipos de documento. | — | — |
| RN-PER-011 | Buscar por DNI también encuentra a quien tiene ese DNI dentro de su CUIL/CUIT (posiciones 3 a 10). | `Verificar_Persona_Cargada` (`clsPersonas.cs:316`). | Replicar en el motor de coincidencias. | — | — |
| RN-PER-012 | El tipo de documento propuesto depende de si la persona es física o jurídica. | V2 591 / V2 592 en `abm_Personas`. | Replicar. | PRM-PER-015, PRM-PER-016 | — |
| RN-PER-013 | Si la política lo exige, una persona debe tener fecha de nacimiento o fecha de alta. | V2 2941 en `abm_Personas.ValidarControles`. | Replicar. | PRM-PER-017 | — |
| RN-PER-014 | Registrar el fallecimiento fija la fecha, da de baja las adhesiones y beneficios de la persona (y la adhesión completa del contrato si era su único adherente), lo anota y genera tareas: baja del titular, transferencia de contratos y cambio de garante. No corta ni da de baja contratos del titular fallecido. | `SetFechaFallecimiento` (`clsPersonas.cs:281`) y `Registrar_Fallecimiento` (`OpcionesEspeciales.cs:338`): registra `FEC_FAL`, da de baja adhesiones y beneficios, anota y avisa tareas. | Mejorar: las tareas se crean en M09 con responsable; reversión posible (PA-PER-08). La baja de adhesiones y beneficios la aplica M18 al consumir `per.person.deceased` (RN-SOC-011; HUECO-TRV-01). | — | — |
| RN-PER-015 | Los adherentes y beneficiarios fallecidos no se reconectan. | `Reconectar_Adherentes`/`Reconectar_Beneficiarios` (`:2120`, `:2131`). | Replicar. | — | — |
| RN-PER-016 | Reconectar servicios de un titular fallecido requiere política habilitante. | V2 2301 (`clsTecnica.Validar_OrdenTrabajo_Reconexion`). | Delegar a M08/M10; PER expone `persons.status = deceased`. | PRM-PER-018 | — |
| RN-PER-017 | Los datos sensibles (salud, electrodependencia, aptitud de donante) se guardan aparte, con acceso restringido, sin uso en BI general ni en el muro. | V2 2527 edades de donante en `abm_Personas` (banco de sangre). | Mejorar: colección `personSensitiveData` con permiso propio (BASE §97.1). | PRM-PER-019 | — |
| RN-PER-018 | La edad se calcula a la fecha de referencia de cada regla (hoy, fecha de lectura, fecha de proceso); sin fecha de nacimiento la regla de edad no se evalúa y se informa. | `Get_Cod_Adh_Condicion`: edad 0 no se evalúa. | Mejorar: "sin fecha" es un resultado explícito. | — | — |
| RN-PER-135 | **Persona única en todos los maestros** (DEC-097): todo maestro de otro módulo que represente a una persona (proveedores de M12, vendedores de M11, choferes y profesionales de salud de M18, empleados de M16, instaladores matriculados de M10 `certifiedInstallers`, sumados el 10-11-2026) referencia una persona de M01 con `personId` obligatorio. **La ficha del rol es única por persona y rol y, cuando el rol depende de una entidad jurídica o empleador, por esa entidad:** un empleado (M16) puede tener un legajo con cada empresa empleadora del tenant (`employees.legalEntityId`, RN-SUE-001) y un asociado (M17) una membresía por entidad jurídica (RN-INS-053, DEC-096); los roles que no dependen de una entidad (proveedor, vendedor, chofer, profesional de salud, instalador matriculado) tienen una sola ficha por persona. En todos los casos es la misma persona de M01 (DEC-097). *Reemplazado (10-11-2026, DEC-097): "como máximo una ficha por persona y rol"*. La identidad (nombre o razón social, identificaciones, condición fiscal, domicilios, contactos) se lee de M01 y no se duplica en el maestro; el alta pasa por el alta asistida con control de duplicados (RF-PER-174). Una fusión de personas (RF-PER-157) reasigna también esos `personId`. En la migración, T07 vincula o crea la persona con sus reglas de unificación del padrón. | `PROVEED`, `VENDEDOR`, `CHOFERES`, `MEDICOS`, `PROFESIO` y `CONSEJO` guardan nombre o documento propios, aislados de `PERSONAS`; un socio contratista se carga dos veces. | Reemplazar (DEC-097). | — | — |
| RN-PER-136 | **Estado de identificación `documentPending`** (DEC-099): (1) solo lo asigna la migración (T07) a una persona de ProCoop sin ningún documento; el alta manual sin documento sigue el camino de la excepción aprobada (RF-PER-026); (2) la persona queda fuera del índice de unicidad por documento (RN-PER-005) y del puntaje por identificación del motor de coincidencias; se la compara por nombre fonético y domicilio y una coincidencia produce **aviso**, no bloqueo ni fusión; (3) genera una tarea de regularización en M09 y figura en el informe de migración; (4) mientras siga `documentPending`, `per.getHolderSnapshot` la informa así y M05 no le emite comprobantes que exijan identificar al receptor por documento; (5) al cargar un documento válido pasa a `identified`, se ejecuta el control de duplicados por documento (puede abrir un caso en `duplicateCases`) y se cierra la tarea. | ProCoop graba personas sin documento (`PERSONAS.NUM_DNI` vacío o cero) sin marca ni control. | Mejorar (DEC-099). | PRM-PER-082 (umbral de coincidencia) | — |

### 6.2 Contactos

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-019 | La exigencia de celular y correo tiene tres niveles (no controlar, advertir, exigir) y dos momentos (en el alta, siempre), por persona y por cuenta. | `ValidarDatosCuenta` (`:1461`): V2 int 2490 = 2 activa; V2 744 (celular) y 745 (correo): 1 pregunta y deja seguir, 2 bloquea. | Replicar como política. | PRM-PER-020..PRM-PER-022 | — |
| RN-PER-020 | Si la cuenta no tiene teléfono o correo, se usan los de la persona y luego los cargados en el portal, según el orden de prioridad configurado. | `Get_Telefono` (`:837`), `Get_Mail` (`:855`): usan `SUMSOC_EXTRAS.TELE_WEB` y `CORREO_WEB`. | Mejorar: cada contacto tiene fuente y verificación; la prioridad es configurable. | PRM-PER-023 | — |
| RN-PER-021 | El destino de SMS/WhatsApp se elige así: con "usar celular de la cuenta", el celular de la cuenta; si no, prioridad 0 = portal, luego celular, luego fax; 1 = fax y luego celular; 2 = ambos. Para facturas por WhatsApp puede forzarse el celular de la cuenta y solo para facturas electrónicas. | `GetNumeroDestino` (`:5900`); V2 2824, V2 3051, V2 3121. | Replicar como regla de selección que PER entrega a T09 (el "fax" se migra como teléfono fijo). | PRM-PER-024..PRM-PER-026 | — |
| RN-PER-022 | Los teléfonos se guardan normalizados (E.164) y se validan como móviles o fijos. | V2 2934 "formato solo números". | Mejorar. | PRM-PER-027 | — |
| RN-PER-023 | Un contacto cargado desde el portal no se sobrescribe con uno del backoffice si la política de conservación está activa. | V2 2460 "WEB - Mantener teléfono y correo web" (`clsWEB.SincronizarCuentas`). | Replicar sin sincronización con MySQL externa. | PRM-PER-028 | — |
| RN-PER-024 | Si la vía de ingreso exige validar celular o correo, el contacto queda verificado solo tras el código. | `VIAINGTE.VALIDAR_CELULAR/VALIDAR_MAIL`. | Replicar (canales `crmChannels` de M09, CTR-DAT-77; antes "catálogo de vías de M09"). | — | — |
| RN-PER-025 | En el portal puede exigirse teléfono y correo al titular y pedir confirmarlos en cada ingreso. | PMovil 15, 18, 19 (sin lectura directa en el código). | Replicar como política consumida por M19. | PRM-PER-029, PRM-PER-030 | — |

### 6.3 Titulares

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-026 | El número de titular sale de una secuencia transaccional del tenant; nunca de MAX+1. | `GetIdSocio` (`:703`) con MAX+1; riesgo de colisión (Duda 22.7). | Reemplazar (secuencias de T04). | PRM-PER-001 | Huecos y duplicados históricos para la migración. |
| RN-PER-027 | Con series separadas, asociados y no asociados numeran en series distintas; el dado de baja que conserva número cuenta como activo. | V2 32 (dos numeraciones), V2 2673 (`ACTIVOBAJA` cuenta como activo); `Get_NumeroSiguiente` (`:963`) para `NUM_SOC`. | Adoptar (DEC-017; antes A validar PA-PER-15): secuencia única de titulares por tenant con atributo de tipo; número de asociado en M17. **Reemplazado por DEC-017** el escenario de series separadas, que se conserva solo como texto de origen. | PRM-PER-002, PRM-PER-003 | — |
| RN-PER-028 | El número visible del titular es único; puede cargarse a mano si la política lo permite. | `ValidarNumeroAsociado` (`:2558`), `Existe_TitularConCodigo` (`:2446`), V2 2660. | Replicar. | PRM-PER-004 | — |
| RN-PER-029 | Un titular con cuentas tiene exactamente una cuenta principal. Excepciones configurables: durante una transferencia al agregar titular, y para titulares no asociados (sin cuenta principal, distrito ni sección). | `Validar_Titular` (`:917`); V2 2374, V2 3164, V2 3193. | Replicar. | PRM-PER-005..PRM-PER-007 | — |
| RN-PER-030 | Un titular activo debe tener al menos una cuenta, salvo en estado "solicitante". | V2 2324 "Impedir cargar socios sin cuentas asociadas" (leído en `TransferirCuenta`). | Replicar con el estado solicitante (PA-PER-09). | PRM-PER-008 | Semántica exacta de V2 2324 (la descripción del catálogo y RN-06 §7 difieren). |
| RN-PER-031 | No se da de baja a un titular con contratos activos, salvo política. | `PermiteDardeBaja` (`:931`); V2 340. | Replicar. | PRM-PER-031 | — |
| RN-PER-032 | No se da de baja a un titular con capital integrado si la política lo impide; PER consulta a M17. | V2 337 (`:956`). | Delegar el cálculo a M17; replicar el control. | PRM-PER-032 | — |
| RN-PER-033 | La baja registra fecha efectiva, causa del catálogo, detalle y si conserva el número. | Baja guarda `BAJA`, `CAU_BAJA`, `ACTIVO = 0`; `ACTIVOBAJA`. | Replicar con historia. | — | — |
| RN-PER-034 | Puede darse de baja a un titular sin cuentas si la política lo permite. | V2 2633. | Replicar. | PRM-PER-033 | — |
| RN-PER-035 | Antes de una baja o transferencia se informa si la persona es adherente, beneficiaria o garante en otras cuentas. | `Get_Relacion_OtraCuenta` (`:1000`); V2 2571 (al desconectar, si el socio queda sin servicios). | Replicar. | PRM-PER-034 | — |
| RN-PER-036 | Según política, un titular no asociado no puede tener contratos. | V2 734. | Replicar; M02 consulta la señal. | PRM-PER-035 | — |
| RN-PER-037 | Según política, a un titular dado de baja no se le factura. | V2 741. | Delegar a M05 con la señal de PER. | PRM-PER-036 | — |
| RN-PER-038 | Según política, los titulares nuevos se cargan como no asociados por defecto. | V2 2591. | Replicar; la asociación la registra M17. | PRM-PER-037 | — |
| RN-PER-039 | Recuperar un titular dado de baja es una reactivación explícita con motivo, que agrega un período nuevo; no borra la baja. | `ModificacionEspecial_Socio` (`:601`): borrar la fecha de baja "recupera" al socio (borra `BAJA`, `CAU_BAJA`). | Reemplazar. | — | — |
| RN-PER-040 | Las observaciones del titular son notas con historial; no un campo de texto que se recorta. | `SOCIOS.OBSERVA` recortada a 1000 caracteres. | Descartar el recorte; reemplazar por `notes`. | — | — |
| RN-PER-041 | Cambiar el número visible de un titular o cuenta no cambia identificadores internos ni referencias; queda auditado y aprobado. | `ModificacionEspecial_Socio` renumera `COD_SOC` en todas las tablas con SQL dinámico; `CambiarCuenta` renumera `COD_SUM` en unas 60 tablas. | Reemplazar (CTR-PER-10). | PRM-PER-004 | — |

### 6.4 Cuentas

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-042 | Una cuenta pertenece a un único titular; no agrupa contratos de distintos titulares, CUIT o DNI. | `SUMSOC.COD_SOC` único. | Replicar (TIT-003, BASE §103.3). | — | — |
| RN-PER-043 | Una cuenta nueva toma la fecha de hoy como alta (o la fecha efectiva indicada) y deja el evento en la historia. | `Completar_Sumsoc` (`:1120`): `ALTA = hoy` y nota "Nueva Cuenta". | Mejorar: evento + nota de sistema. | — | — |
| RN-PER-044 | La condición IVA de una operación es la de la cuenta; sin cuenta, Consumidor Final. | `GetSituacionImpositiva` (`clsPersonas.cs:271-279`), código 4. | Replicar. | — | — |
| RN-PER-045 | El número de cuenta sale de una secuencia del tenant. | `Guardar_SUMSOC` `COD_SUM = MAX + 1` (`:1142`). | Reemplazar. | PRM-PER-009 | — |
| RN-PER-046 | Al transferir una cuenta se advierte si cambia la situación de IIBB. | `ValidacionAdvertencia_IIBB` (`clsCuentas.cs:1129`), `Get_CuentaDestino` (`:1118`). | Replicar con datos de M06. | — | — |
| RN-PER-047 | La situación de IIBB por defecto de una cuenta nueva sale de la configuración; las cuentas "no resetear" no cambian en la reasignación masiva. | V2 2312; `ReasignarIngresoBrutos` (`clsCuentas.cs:1078`). | Delegar el cálculo a M06; PER guarda los campos. | PRM-PER-038 | — |
| RN-PER-048 | Quitar la factura electrónica de una cuenta cuyo servicio lo exige requiere confirmación; puede marcarse automáticamente al alta. | `Requiere_Confirmacion_Desmarcar_FacturaE` (`:911`); V2 2642. | Replicar. | PRM-PER-039 | — |
| RN-PER-049 | La exclusión de débito automático por tipo de comprobante es de M07. | `Guardar_DebitosExcluidos` (`:1632`, `DEBITO_EXCLUSION`). | Delegar. | — | — |
| RN-PER-050 | La marca "no facturar" puede aplicarse a la cuenta o a un contrato; marcar un contrato desmarca la marca de cuenta; cada marca y desmarca guarda usuario y fecha. Solo un contrato por cuenta puede quedar marcado en ProCoop. | `Marcar_NoFacturarServicio` (`:1770`), `Guardar_SUMNOFAC` (`:1606`), V2 2303. | Mejorar: bloqueo tipado con efecto `billing` sin el límite de un contrato por cuenta. | PRM-PER-040 | Confirmar si el límite de un contrato por cuenta es intencional. |
| RN-PER-051 | La importación de marcas de facturación interpreta "SI" como facturar. | `ImportarCuentas_MarcaFacturar` (`:1685`). | Replicar en la plantilla de importación. | — | — |
| RN-PER-052 | El alta de cuenta puede exigir zona, conjunto, distrito y sección (en la principal), grupo contable y empresa postal. | V2 213, V2 703, V2 2285, V2 2738, V2 2506. | Replicar como políticas. | PRM-PER-041..PRM-PER-045 | V2 703 "conjunto". |
| RN-PER-053 | Al ingresar una sección, el distrito puede completarse automáticamente. | V2 2373. | Replicar. | PRM-PER-046 | — |
| RN-PER-054 | El número de ficha es correlativo por tenant. | `getSetNroFicha` (`:1571`) MAX+1. | Reemplazar por secuencia. | — | — |
| RN-PER-055 | Los contratos de la cuenta se ordenan por grupo de facturación e identificador; puede mostrarse la observación del contrato y desagruparse. | `DetalleCuenta` (`clsCuentas.cs:186-235`); V2 2557, V2 3152. | Replicar. | PRM-PER-047, PRM-PER-048 | — |
| RN-PER-056 | La ficha indica si la cuenta tiene contratos en más de un grupo de facturación. | `PoseeGrupos` (`clsCuentas.cs:599`). | Replicar. | — | — |
| RN-PER-057 | Todo contrato pertenece a un grupo de facturación válido de su propia cuenta; el grupo por defecto sale de la configuración del servicio; la emisión masiva produce un comprobante por cuenta y grupo. | `SERSOC.GRUPO_FACTURA`, `GF_DEFECTO`, -1 inválido (RN-06 §3.2, §11). | Delegar a M05 (FAC-006); PER valida que el grupo pertenezca a la misma cuenta. | — | — |
| RN-PER-058 | La marca "no cobrar recargo" de una cuenta puede requerir autorización. | V2 3135, V2 3162. | Delegar el efecto a M08; PER guarda la marca con aprobación. | PRM-PER-049, PRM-PER-050 | — |

### 6.5 Domicilios, inmuebles y puntos de prestación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-059 | Un domicilio completo tiene calle, número, localidad, provincia y código postal; se admiten "sin número" y domicilios rurales con referencias, marcados como tales. | `Validar_Domicilio` (`:1450`). | Mejorar (BASE §77). | — | — |
| RN-PER-060 | No existe unicidad por domicilio + servicio; un domicilio puede tener varios contratos del mismo servicio con titulares distintos. | No hay unicidad; V2 2710 "Validar mismo domicilio para el servicio" (sin lectura directa). | Replicar sin unicidad (TIT-002); V2 2710 se interpreta como advertencia. | PRM-PER-051 | V2 2710. |
| RN-PER-061 | Compartir domicilio no autoriza mostrar facturas ni gestiones ajenas, agrupar deuda entre personas ni cortar otra conexión. | No aplica. | Adoptar (BASE §83). | — | — |
| RN-PER-062 | Al dar de alta o cambiar de titular en un domicilio o inmueble con deuda de otras cuentas (mismo domicilio o misma nomenclatura catastral), se advierte sin revelar a terceros el detalle; el bloqueo es opcional por política validada. | `Validar_DeudaDomicilio` (`clsSocios_Capital.cs:227-279`) avisa si otra cuenta con el mismo domicilio o catastro tiene deuda; V2 2669 solo deuda vencida; V2 2482 y 2668 (pregunta). | Mejorar (PA-PER-03; CTR-PER-04). | PRM-PER-052..PRM-PER-054 | — |
| RN-PER-063 | El punto de prestación es distinto del domicilio personal, fiscal y postal. Copiar el domicilio de la cuenta a sus contratos solo ocurre por acción explícita o política. | `Act_Domicilio_Sersoc` (`:3001`) copia a pedido; V2 2461 actualiza los servicios al modificar la cuenta. | Replicar como acción explícita; la política propone la copia y pide confirmación. | PRM-PER-055 | — |
| RN-PER-064 | El traslado técnico se ejecuta al cerrar la OT: el punto toma el domicilio nuevo de la OT; si la OT lo indica, también cambia el domicilio de las personas adherentes. | `Actualizar_Domicilio_SERSOC` (`:2197`); `DOM_PER` (`clsTecnica.cs:1347-1360`); `Actualizar_Domicilio_PERSONAS` (`clsPersonas.cs:242`). | Replicar consumiendo `tec.workOrder.closed`. | — | — |
| RN-PER-065 | El domicilio de impresión se arma con el formato configurado (piso, departamento, barrio, código postal). | `GetDomicilio`, `GetDescripcion` (`clsCuentas.cs:721`); V2 2918. | Replicar. | PRM-PER-056 | — |
| RN-PER-066 | Geocodificar no certifica cobertura técnica, existencia del inmueble, titularidad ni disponibilidad; la posición del dispositivo no es automáticamente el domicilio contratado. | No aplica (solo latitud/longitud en `SERSOC`). | Adoptar (BASE §77). | — | — |
| RN-PER-067 | El punto tiene estado confirmado, aproximado, pendiente, para revisar o no disponible; no se muestra precisión que no existe ni se inventan coordenadas. | No aplica. | Adoptar. | — | — |
| RN-PER-068 | Confirmar o corregir el punto requiere permiso y registra fuente, momento, actor y motivo; la versión anterior se conserva. | No aplica. | Adoptar. | — | — |
| RN-PER-069 | Si no aparece la calle, se conserva el texto y las referencias y se permite marcar el punto para revisión; nunca se completa con una calle homónima ni con coordenadas inventadas. | No aplica. | Adoptar (CU-GEO-01). | — | — |
| RN-PER-070 | Ante caída o límite del proveedor geográfico, el formulario se guarda y el enriquecimiento queda pendiente. | No aplica. | Adoptar. | — | — |
| RN-PER-071 | No se descarga masivamente la base de calles de Google ni se guarda cualquier resultado sin revisar los términos; el catálogo geográfico compartido está separado de los domicilios privados del tenant. | No aplica. | Adoptar (BASE §77). | — | — |
| RN-PER-072 | La nomenclatura catastral tiene seis partes; cada parte vacía vale "0"; las etiquetas por defecto son Cod/Sec/Man/Par/PH/Lote y pueden configurarse, igual que el modo numérico. | `Get_Propieda_Nomenclatura` (`:4670`); V2 2281, V2 2320. | Replicar. | PRM-PER-057, PRM-PER-058 | — |
| RN-PER-073 | La designación catastral de un contrato debe existir en inmuebles; la búsqueda de coincidencia es por igualdad normalizada (la búsqueda parcial queda solo para el buscador). | `ValidarPropiedadCatastral` (`:2716`) busca por "contiene". | Mejorar. | — | — |
| RN-PER-074 | El inmueble es obligatorio para los servicios que lo exigen; con la política "solicitar siempre propiedades en el alta", el inmueble se pide al alta y no se cambia en la OT. | `REG_CATASTRO`/`REG_INMUEBLE` (RN-06 §3.2 punto 4); V2 2462; V2 319. | Delegar la exigencia a M02 (configuración del servicio); PER valida existencia. | PRM-PER-059, PRM-PER-060 | — |
| RN-PER-075 | Editar la nomenclatura de un inmueble no exige copiarla a los contratos: los contratos referencian el inmueble y su historia. | `abm_Propieda.Guardar` actualiza `CAT_*` de los `SERSOC` del inmueble. | Reemplazar (referencia por identificador). | — | — |
| RN-PER-076 | Un inmueble puede alojar varios contratos del mismo servicio; la autorización técnica (acometidas, unidades funcionales, medidores) se valida por servicio. | No hay unicidad. | Delegar a M02/M10 (BASE §83). | — | — |
| RN-PER-077 | El servicio puede restringirse a localidades habilitadas; la localidad del punto debe estar entre ellas. | `ValidarLocalidadHabilitada` (`clsServicio.cs:738`). | Delegar a M02; PER provee la localidad normalizada. | — | — |

### 6.6 Relaciones, garantías y adherentes

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-078 | Toda gestión en nombre de un tercero exige una relación vigente que habilite esa acción, y registra quién actuó y por quién. | No modelado. | Adoptar (AGR-007). | — | — |
| RN-PER-079 | Un pago de tercero no transfiere titularidad ni da acceso a otros contratos del titular. | No aplica. | Adoptar (BASE §83; ESC-01). | — | — |
| RN-PER-080 | Revocar o vencer una relación retira el acceso futuro sin afectar lo ya actuado. | No aplica. | Adoptar (AGR-007). | — | — |
| RN-PER-081 | El garante se exige según el servicio (siempre bloquea en ProCoop), la cuenta (controlar o exigir) y el titular (exigir o validar). | `REG_GARANTE` siempre bloquea (RN-06 §3.2 punto 8; Duda 22.4); V2 2544; V2 54; V2 2469. | Mejorar: tres niveles por política. | PRM-PER-061..PRM-PER-063 | Duda 22.4. |
| RN-PER-082 | **Reemplazado por RN-SOC-006 y RN-SOC-007** (M18, dueño único; HUECO-TRV-01). Texto original: Una persona no puede ser adherente activa del mismo servicio en dos contratos, salvo política; si la política lo indica se ofrece dar de baja la adhesión anterior. | `PersonaEsAdherente` (`:125`); V2 2400; V2 2521. | Reemplazado por RN-SOC-006 y RN-SOC-007 (HUECO-TRV-01). Decisión original: Replicar. | PRM-PER-064, PRM-PER-065 | — |
| RN-PER-083 | **Reemplazado por RN-SOC-001 y RN-SOC-002** (M18, dueño único; HUECO-TRV-01). Texto original: La condición del adherente se evalúa contra la categoría: rango de edad, ocupaciones y vínculos admitidos; los vínculos marcados como exentos (por defecto "discapacitado") se excluyen; la misma regla se aplica en el cambio de categoría. | `Get_Cod_Adh_Condicion` (`:140`) excluye "DISCA"; `Get_Cod_Adh_Condicion_CambioCat` (`:169`) no lo excluye. | Reemplazado por RN-SOC-001 y RN-SOC-002 (HUECO-TRV-01). Decisión original: Mejorar: una sola regla con vínculos exentos configurables. | — | Confirmar si la diferencia en el cambio de categoría es intencional. |
| RN-PER-084 | **Reemplazado por RN-SOC-001 y RN-SOC-053 (lotes RF-SOC-015/016)** (M18, dueño único; HUECO-TRV-01). Texto original: La baja y el cambio de categoría de adherentes en lote quedan anotados con el usuario y eliminan la tarifa de adherente afectada. | `DarBaja_Adherentes_Condicion` (`:204`), `CambiarCategoria_Adherentes` (`:239`). | Reemplazado por RN-SOC-001 y RN-SOC-053 (lotes RF-SOC-015/016) (HUECO-TRV-01). Decisión original: Replicar con historia. | — | — |
| RN-PER-085 | **Reemplazado por RN-SOC-004** (M18, dueño único; HUECO-TRV-01). Texto original: Los adherentes que cumplen la mayoría de edad configurada (21 años por defecto) se listan y se avisan. | `Get_Adherentes_MayoriaEdad` (`:356`); V2 3186, V2 3187. | Reemplazado por RN-SOC-004 (HUECO-TRV-01). Decisión original: Replicar con edad configurable. | PRM-PER-066, PRM-PER-067 | — |
| RN-PER-086 | **Reemplazado por RN-SOC-008 y RN-SOC-009** (M18, dueño único; HUECO-TRV-01). Texto original: Al desconectar o reconectar el contrato, sus adherentes y beneficiarios siguen el mismo estado (salvo fallecidos); puede consultarse al reconectar. | `Desconectar_*`, `Reconectar_*` (`:2121-2185`); V2 2401. | Reemplazado por RN-SOC-008 y RN-SOC-009 (HUECO-TRV-01). Decisión original: Replicar consumiendo eventos de M02. | PRM-PER-068 | — |
| RN-PER-087 | **Reemplazado por RN-SOC-012** (M18, dueño único; HUECO-TRV-01). Texto original: En la ficha se ocultan por defecto los adherentes dados de baja por fallecimiento. | V2 3058 (`GetDatosFicha`). | Reemplazado por RN-SOC-012 (HUECO-TRV-01). Decisión original: Replicar. | PRM-PER-069 | — |
| RN-PER-088 | **Reemplazado por RN-SOC-014** (M18, dueño único; HUECO-TRV-01). Texto original: La deuda de un adherente es la suma de saldos de las cuentas donde es titular o persona de la cuenta; puede controlarse al agregarlo. | `Get_DeudaAdherente` (`:283`); V2 2545. | Reemplazado por RN-SOC-014 (HUECO-TRV-01). Decisión original: Replicar consultando M07. | PRM-PER-070 | — |
| RN-PER-089 | **Reemplazado por RN-SOC-003 (dato de edad para M04; el importe lo calcula M04)** (M18, dueño único; HUECO-TRV-01). Texto original: El importe de la tarifa del adherente se busca por ocupación y rango de edad. | `Get_TAR_ADHE_Importe` (`:4807`) con condición invertida (Duda 22.17). | Reemplazado por RN-SOC-003 (dato de edad para M04; el importe lo calcula M04) (HUECO-TRV-01). Decisión original: Delegar a M04 con la condición correcta (edad entre inicio y fin). | — | Duda 22.17. |
| RN-PER-090 | **Reemplazado por RN-SOC-005** (M18, dueño único; HUECO-TRV-01). Texto original: Según política, el titular no necesita figurar como adherente. | V2 109. | Reemplazado por RN-SOC-005 (HUECO-TRV-01). Decisión original: Replicar. | PRM-PER-071 | — |
| RN-PER-091 | **Reemplazado por RN-SOC-013** (M18, dueño único; HUECO-TRV-01). Texto original: Al transferir un contrato, los adherentes y beneficiarios se copian dados de baja (histórico), se copian activos o se dan de baja en origen; nunca se eliminan físicamente. | V2 2291 (1 copia dados de baja, 2 copia activos, 3 elimina). | Reemplazado por RN-SOC-013 (HUECO-TRV-01). Decisión original: Mejorar: la opción 3 da de baja con historia. | PRM-PER-072 | — |
| RN-PER-092 | Un garante, adherente o beneficiario que queda vinculado a una cuenta de baja se informa. | V2 2571; `Get_Relacion_OtraCuenta`. | Replicar. | PRM-PER-034 | — |

### 6.7 Notas, bloqueos y documentación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-093 | Las notas se numeran sin colisiones y cada modificación conserva la versión anterior; el borrado es lógico con motivo. | `Crear_NOTA_SUM` (`:3802`) con bloqueo de tabla y encadenamiento (`NOTA_SUM1`, `COD_NOT_ORI`); borradas en `NOT_ELIMINADAS_HST`. | Mejorar. | — | — |
| RN-PER-094 | Las notas automáticas del sistema no son editables ni borrables por el operador. | `Guardar_NOTA_SUM*` escriben "OT: transacción", "Alta del servicio", "Desconexión del servicio", "Recategorización", "Modificación especial", "Operación especial", "Nueva Cuenta". | Mejorar. | — | — |
| RN-PER-095 | Un bloqueo declara uno o más efectos de una lista cerrada; cada módulo consulta el efecto que le importa antes de operar; un bloqueo sin efecto no es válido (es una nota). | `NOTA_SUM.BLO_CAJ` bloquea el cobro en caja y `MSG_CAJ` muestra un mensaje; `SUMSOC.BLOQUEAR_FAC_WEB` bloquea el pago web (`Cuenta_CajaBloqueada` `:1136`, `BloquearPagoWeb` `:980`). | Mejorar (CTR-PER-07; PA-PER-16). | PRM-PER-073 | — |
| RN-PER-096 | Aplicar y levantar bloqueos registra causa de catálogo, autor, vigencia y motivo de levantamiento; vencido el plazo, se levanta solo. | `HISBLOQ`, `CAUBLOQ` (DFA M3). | Replicar con vencimiento automático. | — | — |
| RN-PER-097 | Un documento presentado está vencido si pasó su fecha de vencimiento o, sin ella, si fecha + días del requisito es anterior a hoy, y no existe otro vigente del mismo tipo para la misma entidad. | `Get_TramitesPresentados` (`clsTramites.cs:176`). | Replicar. | — | — |
| RN-PER-098 | Las acciones al alta o al vencimiento de un documento son acciones tipadas del catálogo (crear tarea, aplicar o levantar bloqueo, quitar o dar beneficio, notificar); un error en una acción se registra y no frena las demás. | `TRAMITES_ACCIONES.SCRIPT_ACCION` con SQL libre reemplazando `{0}` y `{1}`; `ACCION_ALTA`, `ACCION_VTO`; `ACCIONADO`; V2 2509. | Reemplazar (CTR-PER-18). | PRM-PER-074 | Inventario de scripts configurados en cada cooperativa (Duda 22.22). |
| RN-PER-099 | Un adjunto hereda los permisos de la entidad a la que se vincula; adjuntos de socio, persona, cuenta y servicio se migran con su tipo. | `Get_InfoAdjuntos` (`:5211`): tipos 2 socio, 14 persona, 1 cuenta, 12 servicio. | Replicar en T11. | — | — |

### 6.8 Transferencias y cambio de titularidad

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-100 | Cambiar el titular no reescribe el pasado: cada cargo y documento conserva el titular vigente cuando se generó. | No explícito (copia del `SERSOC`). | Adoptar (BASE §4). | — | — |
| RN-PER-101 | La deuda del titular anterior no se reasigna automáticamente; solo se asume por convenio expreso de M08 con consentimiento del nuevo responsable. | No traslada deuda; frena con aviso de deuda en el domicilio. | Adoptar (BASE §4; DEC-045). | — | — |
| RN-PER-102 | Transferir una cuenta la mueve con sus contratos al titular destino con fecha efectiva; si el origen tiene capital, se pregunta si se conserva (lo resuelve M17); si el origen queda sin cuentas, se propone su baja. | `TransferirCuenta` (`:1268`), `ConservarCapital` (`:1332`), V2 2324. | Mejorar (simulación y aprobación). | PRM-PER-008 | — |
| RN-PER-103 | Según política, no se transfiere una cuenta con deuda, ni a titulares dados de baja. | V2 427, V2 2552. | Replicar. | PRM-PER-075, PRM-PER-076 | — |
| RN-PER-104 | Transferir un contrato (cambio de titularidad) crea por defecto un contrato nuevo en la cuenta destino con fecha de alta = fecha efectiva (o la original si se pide "mantener fecha"); el contrato de origen se cierra y queda "no vigente". La alternativa "mover" se descarta. | `TransferirServicio` (`:3312`): modo clonado por defecto, modo "eliminar" mueve; V2 2541 deja el viejo en condición 5; V2 422. | Mejorar (PA-PER-07); la ejecución sobre el contrato es de M02. | PRM-PER-077, PRM-PER-078 | — |
| RN-PER-105 | En el cambio de titularidad se transfieren línea telefónica, beneficiarios, vivienda, mediciones múltiples y propiedades; los equipos y aprovisionamiento se sincronizan con M10/M13. | `TransferirServicio` transfiere teléfono, beneficiarios, vivienda, `MEDSOC` y propiedades; sincroniza AION. | Delegar a M02/M10; PER orquesta. | — | — |
| RN-PER-106 | Según política, pueden transferirse contratos dados de baja. | V2 2599. | Replicar. | PRM-PER-079 | — |
| RN-PER-107 | Las transferencias pueden generar cargos de transferencia (tipo 7) que define M04. | `TipoConceptoCobrar` 7; V2 2782. | Delegar a M04 por el evento `per.transfer.executed`. | PRM-PER-080 | — |
| RN-PER-108 | Cada transferencia guarda sus ítems (cuenta y contratos incluidos) con identificador común y observación completa. | `Guardar_TRANSFER*`: observación recortada a 1000/200 caracteres; servicios con `ID_TRANS_CUENTA`. | Mejorar (sin recorte). | — | — |
| RN-PER-109 | La transferencia de capital la ejecuta M17 con movimientos espejo. | `TransferirCapital` (`:1421`). | Delegar. | — | — |
| RN-PER-110 | Toda transferencia se simula, se aprueba según política, se ejecuta de forma idempotente y puede revertirse con un hecho nuevo (nunca borrando). | Diálogos `MessageBox` dentro de la regla (Duda 22.14). | Reemplazar por opciones explícitas en la API. | PRM-PER-081 | Relevar las decisiones que hoy toma el operador en esos diálogos (Duda 22.14). |

### 6.9 Historia, duplicados, corrección y eliminación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-111 | Cada cambio conserva fecha efectiva, fecha de registro, origen y motivo; las consultas históricas declaran qué fecha interpretan. | `SUMSOC_HST`/`SERSOC_HST` guardan copias completas (`GuardarHistorial`). | Reemplazar por `perRevisions` bitemporal (CTR-PER-09). | — | — |
| RN-PER-112 | Corregir un dato que se usó en un documento emitido no modifica ese documento. | No explícito. | Adoptar (AGR-010). | — | — |
| RN-PER-113 | Nunca se fusionan personas automáticamente; la fusión requiere caso de duplicado, decisión "misma persona", propuesta y aprobación. | `UnificarEntidades` (`:5496`) unifica localidades, calles, barrios, cuentas contables y contactos conservando el identificador menor y borrando los demás. | Reemplazar para personas (CTR-PER-11); la unificación de calles/barrios/localidades es de T04 y la de cuentas contables de M15. | PRM-PER-082 | — |
| RN-PER-114 | La persona absorbida queda "fusionada" con puntero a la sobreviviente; las referencias se reasignan por eventos; la reversión restaura las referencias registradas. | Borrado físico de duplicados. | Reemplazar. | — | — |
| RN-PER-115 | No hay borrado físico de cuentas, titulares ni personas con historia; solo se elimina un borrador sin movimientos. | `EliminarCuenta` (`OpcionesEspeciales.cs:183`) borra en cascada cuenta, facturas, consumos y capital. | Descartar (seguridad e integridad). | — | — |
| RN-PER-116 | Eliminar una cuenta de acceso no destruye datos de negocio; la supresión se compatibiliza con la conservación fiscal y contable. | No aplica. | Adoptar (AGR-033). | — | — |
| RN-PER-117 | La copia de configuración entre tenants nunca traslada datos personales; los ambientes de prueba usan datos ficticios. | No aplica. | Adoptar (BASE §97.1). | — | — |

### 6.10 Vínculo usuario–persona y portal

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-118 | El registro crea una identidad de acceso; no aprueba asociación, representación, factibilidad, condición fiscal ni activación. | CoopOnline con clave por socio. | Adoptar (REG-001). | — | — |
| RN-PER-119 | Un usuario accede a una titularidad solo con vínculo verificado; la coincidencia de nombre, DNI o correo no concede acceso. | `GenerarClaveWeb` (`:5125`): clave aleatoria de 10 caracteres o el DNI según V2 914; V2 800 "WEB - Tipo Clave". | Reemplazar (CTR-PER-12); la clave web se descarta. | PRM-PER-083 | V2 914 (semántica dudosa). |
| RN-PER-120 | Cambiar de tenant en la sesión recalcula los vínculos y las cuentas visibles (también descargas, caché y trabajos de fondo). | No aplica. | Adoptar (AGR-006). | — | — |
| RN-PER-121 | Pedir CUIT para una emisión que lo requiere no implica exigirlo a toda persona antes de registrarse. | No aplica. | Adoptar (BASE §67). | — | — |

### 6.11 Reglas de otros módulos que PER solo alimenta (referencia RN-06 §3–§9)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-PER-122 | La validación del alta de contrato (servicio y domicilio informados, fecha de alta salvo servicio técnico, categoría y cantidad, matrícula única, catastro e inmueble, grupo de facturación, actividad, clase, zona/sector/recorrido, dispositivo, factibilidad, garante, tarifa social única) es de M02; PER aporta titular, cuenta, punto, inmueble, garante y señales de política. | `ValidarServicio` (`clsSocios.cs:2576-2681`); V2 2250, V2 2740. | Delegar a M02. | — | — |
| RN-PER-123 | El comportamiento por tipo de servicio (`TipoRegistracion`, `TipoCalculo`, flags `REG_*`, `Tecnica`, `GENERAR_OT`, `CONSULTA_BAJA`, `GF_DEFECTO`, `REG_STO`, `MATRICULA_AUTO`, `FACTI_ALTA`, `CONSUMO_ALTA`) es de M02. | `ConfiguracionServicios` (RN-06 §3.3). | Delegar a M02. | — | — |
| RN-PER-124 | El guardado transaccional de cuenta y contrato (stock trazable, OT de conexión, telemedición, SITSA) se divide: PER guarda la cuenta; M02 (contrato), M10 (OT y aprovisionamiento), M13 (stock trazable) y M03 (telemedición) hacen lo suyo por comandos y eventos con outbox. | `Guardar_SUMSOC`/`Guardar_SERSOC` en una transacción (RN-06 §3.4); V2 2286 "no utilizar guardado rápido"; V2 3034 SITSA. | Reemplazar (DEC-003); V2 2286 se descarta. | — | — |
| RN-PER-125 | Las altas automáticas de servicios por evento (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtro por condición de socio (todos, solo asociados, solo no asociados) son de M02 y siguen DEC-023 (directas solo las obligatorias con fundamento normativo; las opcionales se proponen con consentimiento del titular); PER publica `per.account.created` y `per.servicePoint.relocated` y expone la condición de asociado. | `ALTASEAU`, `OperacionServicioAutomatico` 1–7, `TIT_SOC` (RN-06 §3.5). | Delegar a M02. | — | — |
| RN-PER-126 | Los cargos por alta de titular (tipo 3), alta de cuenta (tipo 2) y transferencia (tipo 7), con filtro de localidad y condición de socio, son de M04; PER publica los eventos. | `TipoConceptoCobrar`, `Get_CONEXION` (RN-06 §3.6, §23.1). | Delegar a M04. | — | — |
| RN-PER-127 | Estados del contrato (pendiente de conexión, conectado, pendiente de desconexión, baja, no vigente), conexión, desconexión, reconexión y trámites masivos son de M02/M10; la ficha los muestra. | `CondicionServicio` derivada de fechas; centinela 1901-01-01 (RN-06 §4). | Delegar a M02 (máquina de estados explícita). | — | — |
| RN-PER-128 | Cambios de categoría y clase, segmentación de subsidios y tarifa social son de M02/M04; generan notas automáticas en PER. | RN-06 §6. | Delegar. | — | — |
| RN-PER-129 | Capital social, reservas, rescates, deuda de capital para votar son de M17. | RN-06 §9. | Delegar. | — | — |
| RN-PER-130 | La unicidad del número de línea móvil entre contratos conectados del mismo servicio es de M02/M10. | `Validar_TelefonoMovil` (`:923`). | Delegar. | — | — |
| RN-PER-131 | El CBU del titular para débito es de M07. | `Crear_SU_EMP_CBU` (`:4133`). | Delegar. | — | — |
| RN-PER-132 | La alerta de presupuestos pendientes del titular la provee M11 y se muestra en la ficha. | `Get_Presupuestos` (`:2747`, `PRESUPU.ALERTAR`). | Delegar; PER muestra. | — | — |
| RN-PER-133 | La declaración jurada de artefactos de gas por cuenta (`ARTEFSUMS`) es de M02 (gas). | RN-06 §23.1 `ARTEFSUMS`. | Delegar. | — | — |
| RN-PER-134 | Los candidatos de sorteo entre socios cumplidores y el cruce de padrones externos por CUIT, CDI o DNI extraído del CUIT usan el motor de coincidencia de identificaciones de PER. | `Get_CandidatosSorteo` (`:5672`), `ImportarRG60` (`:5823`). | Delegar el proceso (M17/T09/M06); PER provee RN-PER-011. | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.0 Convenciones del módulo

- Todo documento lleva `TenantId` (uniqueidentifier, obligatorio, primer campo de todos los índices), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista) y, donde se indica, `status`, `validFrom`/`validTo`, `recordedAt` y `deletedAt` (borrado lógico). No se repiten en cada tabla.
- Los identificadores internos (`_id`) son inmutables. Los números visibles (`holderNumber`, `accountNumber`, `fileNumber`) salen de secuencias transaccionales de T04 (`sequences`) y pueden corregirse solo por operación especial (RN-PER-041).
- Las etiquetas de enums se muestran por clave de diccionario `dict:per.enum.<enum>.<valor>`.
- Columna **Priv.** (inventario de datos, RF-PER-166): `ID` identificatorio, `CT` contacto, `FI` fiscal, `SE` sensible, `UB` ubicación, `OP` operativo no personal. Finalidad por defecto: gestión de la relación comercial y de servicios con la cooperativa; base: ejecución del contrato y obligación legal; plazo de conservación: el que fije T08 por categoría (PA-PER-14).
- Columna **Origen ProCoop** indica tabla.columna de origen para la migración (sección 19).
- Los campos de catálogo (`...Id`) referencian tablas maestras de T04 (`masterTables`, clave de catálogo indicada) o colecciones de otro módulo (indicado entre corchetes).

### 7.1 `persons` — Persona

Propósito: identidad de negocio única de cada persona física o jurídica en el tenant.

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `personType` | enum `natural`, `legal` | Sí | Persona humana o jurídica. | OP | `PERSONAS.TIP_DNI` (V2 591/592) |
| `legacy` | object (T05 §19.1) | No | Código origen para migración. (subdocumento `legacy` con `table` y `key`; CTR-DAT-32, antes campo `legacyCode`). | OP | `PERSONAS.COD_PER` |
| `lastName` | string | Sí (natural) | Apellidos. | ID | `PERSONAS.APELLIDOS` |
| `firstNames` | string | Sí (natural) | Nombres. | ID | `PERSONAS.NOMBRES` |
| `legalName` | string | Sí (legal) | Razón social. | ID | `PERSONAS.APELLIDOS` (jurídicas) |
| `tradeName` | string | No | Nombre de fantasía. | ID | — |
| `organizationType` | enum `company`, `cooperative`, `association`, `municipality`, `publicAgency`, `consortium`, `other` | Sí (legal) | Tipo de organización. | OP | — |
| `incorporationDate` | date | No | Fecha de constitución. | ID | — |
| `displayName` | string (calculado) | Sí | "Apellidos, Nombres" o razón social; indexado para búsqueda. | ID | — |
| `searchKeys` | object `{ normalizedName, phoneticName, tokens[] }` | Sí (calculado) | Claves de búsqueda y coincidencia. | ID | — |
| `registeredSex` | enum `F`, `M`, `X` | No | Sexo registral (para CUIL y adherentes). | ID | `PERSONAS.SEXO` |
| `birthDate` | date | Según PRM-PER-017 | Fecha de nacimiento. | ID | `PERSONAS` (fecha de nacimiento) |
| `deathDate` | date | No | Fecha de fallecimiento. | ID | `PERSONAS.FEC_FAL` (RN-06 §23.2) |
| `deathRecord` | object `{ recordedAt, recordedBy, evidenceDocumentId, reversedAt, reversedBy, reversalReason }` | No | Evidencia y reversión del fallecimiento. | ID | — |
| `maritalStatusId` | uniqueidentifier (`maritalStatuses`) | No | Estado civil. Referencia: `enumerationItems` (T04), catálogo `maritalStatuses` (§7.18). | ID | `PERSONAS.CIVIL` → `EST_CIVIL` |
| `occupationId` | uniqueidentifier (`occupations`) | No | Ocupación/profesión (usada por tarifas de adherente). Referencia: `enumerationItems` (T04), catálogo `occupations` (§7.18). | ID | `PERSONAS` → `OCUPACIO` |
| `nationalityCountryId` | uniqueidentifier (T04 `countries`) | No | Nacionalidad. | ID | `PAISES` |
| `personRegistrationDate` | date | Según PRM-PER-017 | Fecha de alta de la persona en la cooperativa. | OP | `PERSONAS` (fecha de alta) |
| `identifiers` | array de `identifier` | Sí (≥1 salvo `identificationStatus` = `approvedException` o `documentPending`) | Ver 7.1.1. *Reemplazado (10-11-2026, DEC-099): "Sí (≥1 salvo excepción)".* | ID/FI | `PERSONAS.TIP_DNI/NUM_DNI/CDI`, `SOCIOS.CUIT` |
| `identifierException` | object `{ reasonCode, detail, approvedBy, approvedAt, evidenceDocumentId }` | No | Excepción aprobada de identificación (RF-PER-026). | ID | — |
| `identificationStatus` | enum `identified`, `approvedException`, `documentPending` | Sí | Estado de identificación a nivel persona, complementario del estado de verificación de cada identificación (7.1.1 `verification.status`, que no puede expresar la ausencia de documento). `documentPending` solo lo asigna la migración (RN-PER-136, RF-PER-175, DEC-099); transiciones en 8.15. Indexado para la bandeja de regularización. | ID | — (persona de ProCoop sin `TIP_DNI/NUM_DNI`, CDI ni CUIT) |
| `identificationRegularization` | object `{ taskId [M09], migrationBatchId, regularizedAt, regularizedBy }` | No | Seguimiento de la regularización de una persona `documentPending` (RF-PER-175). | OP | — |
| `contacts` | array de `contact` | No | Ver 7.1.2. | CT | `PERSONAS` (teléfonos, correo) |
| `addresses` | array `{ role: real/fiscal/postal/work/commercial, addressId, validFrom, validTo, isPrimary }` | No | Domicilios por rol. `commercial` es el domicilio comercial de un proveedor u otra persona jurídica, que M12 lee desde M01 (DEC-097). *Reemplazado (10-11-2026): "role: real/fiscal/postal/work".* | UB | `PERSONAS.COD_CAL/NUMERO/PISO/DPTO/COD_BAR/COD_LOC`; `PROVEED.DOM_*` |
| `fiscalProfile` | object `{ ivaConditionId [M06], arcaSnapshot { fetchedAt, taxIdNumber, denomination, keyStatus, ivaCondition, taxes[], activities[], fiscalAddressText, source }, lastVerificationStatus }` | No | Perfil fiscal y constancia de ARCA. | FI | — (consulta ARCA de `clsInformes_Titulares`) |
| `workInfo` | object `{ workplace, workAddressText, workPhone, controlDate, controlUserId }` | No | Datos laborales. | CT | `PERSONAS_EXTRAS` (LUGAR_TRABAJO, DOMI_TRABAJO, TEL_TRABAJO, FECHA_CONTROL, USUARIO_CONTROL) |
| `professional` | object `{ isProfessional, licenseNumber, licenseBody, certificateNumber, certificateExpiresAt, specialties[] }` | No | Rol de profesional/instalador. | ID | `PROFESIO`; `SERSOC` (profesional, certificado Nro/Vto) |
| `communicationPreferences` | array `{ purpose: invoices/debtNotices/serviceNotices/news/surveys/wall, channel: email/sms/whatsapp/push/paper, optIn, updatedAt, source }` | No | Preferencias (RF-PER-037). | CT | PMovil 32 (adhesión factura electrónica) |
| `extra` | object (validado por definición de T04) | No | Datos extra tipados de persona. | según campo | `PERSONAS_EXTRAS` y columnas no mapeadas |
| `status` | enum `active`, `deceased`, `merged`, `archived` | Sí | Estado (sección 8.1). | OP | — |
| `mergedIntoPersonId` | uniqueidentifier | No | Persona sobreviviente si `merged`. | OP | — |
| `anonymizedAt` | date | No | Fecha de anonimización. | OP | — |

#### 7.1.1 Subdocumento `identifier`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `_id` | uniqueidentifier | Sí | Identificador del subdocumento. |
| `documentTypeId` | uniqueidentifier (`identityDocumentTypes` de T04) | Sí | Referencia a la colección canónica de tipos de documento de identidad (CTR-DAT-14; antes catálogo `documentTypes` de M01, nombre que en T05 designa los tipos de expediente de T11; el nombre del campo sigue COL-PER-02 de T05). Tipo (DNI, CUIT, CUIL, CDI, LE, LC, pasaporte, cédula extranjera, otro) con códigos ARCA/INAES/ENARGAS/SENASA. |
| `number` | string normalizado (solo dígitos para DNI/CUIT/CUIL) | Sí | Número. |
| `issuingCountryId` | uniqueidentifier | No | País emisor (pasaporte, cédula extranjera). |
| `isPrimary` | bool | Sí | Una principal por persona. |
| `derivedFrom` | enum `none`, `calculatedFromDni` | Sí | `calculatedFromDni` para el CUIL propuesto (RN-PER-006). |
| `verification` | object `{ status: unverified/checkDigitOk/arcaVerified/arcaMismatch/arcaNotFound/manualVerified/rejected, source: checkDigit/arca/document/manual, verifiedAt, verifiedBy, evidenceDocumentId, detail }` | Sí | Estado de verificación (RF-PER-019..021, 028). |
| `linkedIdentifierId` | uniqueidentifier | No | Relación verificada DNI↔CUIT/CUIL. |
| `validFrom` / `validTo` | date | No | Vigencia (por ejemplo DNI reemplazado). |

Índice único parcial: `{ tenantId, "identifiers.documentTypeId", "identifiers.number" }` sobre identificadores vigentes de personas no `merged`, salvo excepción aprobada (RN-PER-005). Implementación: colección auxiliar `personIdentifierIndex` `{ tenantId, documentTypeId, number, personId, exceptionId }` con índice único `{ tenantId, documentTypeId, number, exceptionId }`, mantenida en la misma transacción.

**`personIdentifierIndex`** — tabla de campos.

Campos de `personIdentifierIndex` (COL-PER-02; ficha agregada el 05-11-2026 a partir del párrafo anterior y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `documentTypeId` | uniqueidentifier | Sí | Tipo de documento del identificador. | `identityDocumentTypes` (T04) |
| `number` | string | Sí | Número normalizado del identificador. | — |
| `personId` | uniqueidentifier | Sí | Persona dueña del identificador. | `persons` (M01) |
| `exceptionId` | uniqueidentifier | No | Excepción aprobada que permite repetir el identificador (RN-PER-005); nulo en el caso general. | `approvalRequests` (T11): aprobación de la excepción de unicidad de RN-PER-005, asumida en PA-PER-18 (DEC-072); antes «excepción de unicidad aprobada de RN-PER-005 (M01)» (PA-PER-17) y [VERIFICAR] (posible `duplicateCases`, M01) |

Índice único `{ tenantId, documentTypeId, number, exceptionId }` (párrafo anterior).

#### 7.1.2 Subdocumento `contact`

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `_id` | uniqueidentifier | Sí | — |
| `type` | enum `email`, `mobile`, `landline`, `whatsapp`, `fax` | Sí | Tipo. |
| `value` | string | Sí | Valor tal como se cargó. |
| `normalized` | string | Sí | Correo en minúsculas; teléfono E.164 (RN-PER-022). |
| `label` | string | No | Etiqueta ("trabajo", "hija"). |
| `isPrimary` | bool | Sí | Principal por tipo. |
| `source` | enum `backoffice`, `portal`, `import`, `legacyWeb`, `arca` | Sí | Fuente (RN-PER-020, RN-PER-023). |
| `verification` | object `{ status: unverified/pending/verified/failed, method: otp/link/manual, verifiedAt }` | Sí | Verificación (RF-PER-031). |
| `validFrom` / `validTo` | date | No | Vigencia. |

Índices de `persons`: `{ tenantId, displayName }`, `{ tenantId, "searchKeys.phoneticName" }`, `{ tenantId, "contacts.normalized" }`, `{ tenantId, status }`, `{ tenantId, "legacy.table", "legacy.key" }` (disperso; CTR-DAT-32, antes `{ tenantId, "legacy.table", "legacy.key" }` (CTR-DAT-32) único parcial), texto completo `{ tenantId, "searchKeys.tokens" }`.

### 7.2 `personSensitiveData` — Datos sensibles

Propósito: datos de tratamiento reforzado separados (BASE §97.1). Lectura y escritura solo con `per.personas.datosSensibles.ver` (antes `per.personas.verSensibles`); excluida de exportaciones, BI y API externas.

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Persona. | SE | — |
| `category` | enum `electrodependency`, `health`, `disability`, `bloodDonor`, `other` | Sí | Categoría. | SE | — |
| `data` | object (esquema por categoría) | Sí | Contenido (por ejemplo, electrodependencia: certificado, vencimiento, equipo; donante: grupo y aptitud). | SE | V2 2527 (edades de donante) |
| `evidenceDocumentId` | uniqueidentifier [T11] | No | Respaldo. | SE | — |
| `validFrom` / `validTo` | date | No | Vigencia. | SE | — |
| `consentId` | uniqueidentifier (`consentRecords` de T08; CTR-DAT-18, antes `consents`) | Sí | Consentimiento o base específica. | SE | — |
| `accessLog` | — | — | Cada lectura se audita en T02 (no se guarda aquí). | — | — |

Índices: `{ tenantId, personId, category }`.

### 7.3 `holders` — Titular

Propósito: titular comercial de cuentas y contratos (equivalente a `SOCIOS` sin la parte institucional).

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Persona titular. | ID | `SOCIOS.COD_PER` |
| `holderNumber` | string (secuencia) | Sí | Número de titular visible, único en el tenant. | OP | `SOCIOS.COD_SOC` |
| `numberSeries` | string | No | Reemplazado por el atributo de tipo de la secuencia única (DEC-017: tipo, no serie). Texto original: serie si se usan series separadas (PA-PER-15). | OP | V2 32 |
| `legacy` | object (T05 §19.1) | No | Código origen. (subdocumento `legacy` con `table` y `key`; CTR-DAT-32, antes campo `legacyCode`). | OP | `SOCIOS.COD_SOC` |
| `status` | enum `applicant`, `active`, `closed` | Sí | Estado (sección 8.2). | OP | `SOCIOS.BAJA`, `ACTIVO` |
| `openedAt` | date | Sí (`active`) | Fecha de alta como titular. | OP | `SOCIOS.ALTA` |
| `closedAt` | date | No | Fecha efectiva de baja. | OP | `SOCIOS.BAJA` |
| `closeReasonId` | uniqueidentifier (`holderCloseReasons`) | Sí si `closed` | Causa de baja. Referencia: `enumerationItems` (T04), catálogo `holderCloseReasons` (§7.18). | OP | `SOCIOS.CAU_BAJA` (`abmCausas`) |
| `closeReasonDetail` | string | No | Detalle de la causa. | OP | `SOCIOS.CAUSA` |
| `keepNumberOnClose` | bool | Sí | Conserva el número al darse de baja. | OP | `SOCIOS.ACTIVOBAJA` |
| `periods` | array `{ openedAt, closedAt, closeReasonId, reactivatedBy, reactivationReason }` | Sí | Períodos de titularidad (reactivaciones). | OP | — |
| `memberships` | array de `{ associateMembershipId [M17] (antes `membershipId`), legalEntityId [T04], memberNumber, status, since }` (proyección de lectura) | No | Vínculos de asociado informados por M17, **uno por entidad jurídica** (DEC-096): una persona puede ser socia de la cooperativa y afiliada de la mutual a la vez, con un elemento por cada `associateMemberships` de la persona (M17 §7.1, clave `{tenantId, legalEntityId, personId}`); `memberNumber` es único dentro de la entidad, no en el tenant. Como máximo un elemento no terminal por `legalEntityId`. `associateMembershipId` → `associateMemberships` (M17, COL-INS-01; PA-INS-12); `legalEntityId` → `legalEntities` (T04). *Reemplazado (10-11-2026, DEC-096): "`membership` \| object `{ associateMembershipId [M17] (antes `membershipId`), memberNumber, status, since }` (proyección de lectura) \| No \| Vínculo de asociado informado por M17".* | ID | `SOCIOS.ACTIVO`, `SOCIOS.NUM_SOC`, `ACCIONES`, `ACTA` |
| `indicators` | object `{ inLegalProceedings [M08], assemblyRepresentative [M17], hasActiveContracts [M02], hasPendingQuotes [M11] }` (proyecciones) | No | Indicadores leídos de otros módulos. | OP | `SOCIOS.JURIDICO`, `SOCIOS.REP_ASAMBLEA`, `PRESUPU.ALERTAR` |
| `principalAccountId` | uniqueidentifier | Sí si tiene cuentas | Cuenta principal (RN-PER-029). | OP | `SUMSOC.PRINCIPAL` |
| `extra` | object | No | Datos extra de titular. | según campo | Columnas restantes de `SOCIOS` (+17) |

Índices: `{ tenantId, holderNumber }` único; `{ tenantId, personId }` único parcial sobre `status ≠ closed` (una titularidad abierta por persona; ver CTR-PER-01); `{ tenantId, status }`; `{ tenantId, "legacy.table", "legacy.key" }` (CTR-DAT-32).

Columnas de `SOCIOS` relevadas: `ALTA`, `CUIT`, `IBRUTOS`, `COD_PER`, `COD_GAR`, `ACCIONES`, `BAJA`, `CAUSA`, `ACTIVO`, `CAU_BAJA`, `ACTA`, `JURIDICO`, `NUM_SOC`, `ACTIVOBAJA`, `REP_ASAMBLEA`, `OBSERVA` y otras no visibles en el catálogo (**[VERIFICAR]** contra el esquema real). Destino: `CUIT` → `persons.identifiers`; `IBRUTOS` → `accounts.iibb` (M06); `COD_GAR` → `relationships` tipo `guarantor`; `ACCIONES`, `ACTA`, `NUM_SOC`, `ACTIVO`, `REP_ASAMBLEA` → M17; `OBSERVA` → `notes`.

### 7.4 `accounts` — Cuenta

Propósito: cuenta de servicios del titular (equivalente a `SUMSOC`).

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `holderId` | uniqueidentifier | Sí | Titular. | OP | `SUMSOC.COD_SOC` |
| `accountNumber` | string (secuencia) | Sí | Número visible único en el tenant. | OP | `SUMSOC.COD_SUM`, `NUM_SUM` |
| `legacy` | object (T05 §19.1) | No | Código origen. (subdocumento `legacy` con `table` y `key`; CTR-DAT-32, antes campo `legacyCode`). | OP | `SUMSOC.COD_SUM` |
| `description` | string | No | Descripción de la cuenta. | OP | DFA M3 "descripción" |
| `isPrincipal` | bool | Sí | Cuenta principal. | OP | `SUMSOC.PRINCIPAL` |
| `status` | enum `active`, `closed` | Sí | Estado (sección 8.3). | OP | — |
| `openedAt` / `closedAt` | date | Sí / No | Alta y cierre. | OP | `SUMSOC.ALTA` |
| `closeReason` | string | No | Motivo de cierre. | OP | — |
| `postalAddressId` | uniqueidentifier (`addresses`) | Sí | Domicilio postal/correspondencia. | UB | `SUMSOC.COD_CAL/NUMERO/PISO/DPTO/COD_BAR/COD_LOC/COD_POS` |
| `deliveryTo` | string | No | "Entregar a" (destinatario postal). | ID | `PROPIEDA.ENTREGAR_A` |
| `postalCompanyId` | uniqueidentifier (T04 `postalCompanies`) | Según PRM-PER-045 | Empresa postal. Referencia: `postalCarriers` (M05; antes catálogo `postalCompanies`, §7.18). | OP | `abm_Postales`; V2 2506 |
| `deliveryRoute` | object `{ zoneId, sectorId, routeOrder }` | No | Zona, sector y recorrido de reparto de facturas. | OP | `SUMSOC` (zona/sector/recorrido de facturación); V2 2031–2033 |
| `districtSectionId` | uniqueidentifier (T04 `districtSections`) | Según PRM-PER-043 | Distrito y sección. Referencia: `cadastralDistricts` (T04; antes catálogo `districtSections`, §7.18). | OP | `DISTRITO_SECCION`; V2 2285 |
| `accountingGroupId` | uniqueidentifier [M07] (antes [M15]) | Según PRM-PER-044 | Grupo contable. Referencia: `collectionAccountingGroups` (M07, PA-COB-20); antes «catálogo de grupos contables de M15» (PA-PER-17) y [VERIFICAR] colección de M15 (grupo contable; T05 no la declara). | OP | `SUMSOC.COD_GRU`; V2 2738 |
| `setCode` | string | Según PRM-PER-042 | "Conjunto" **[VERIFICAR]**. | OP | V2 703 |
| `fiscal` | object `{ ivaConditionId [M06], requiresTaxId (derivado), iibb { conditionId [M06], registrationNumber, noReset, noPerception, determinedRate } }` | Sí (`ivaConditionId`) | Condición IVA e IIBB de la cuenta. | FI | `SUMSOC.COD_SIT` (`SITIVA`), `COD_SIB`, `NO_RESET`; `IIBB_LUA` |
| `contacts` | array de `contact` (7.1.2) | Según política | Contactos propios de la cuenta. | CT | `SUMSOC.EMAIL`, `MOVIL`, teléfonos, fax; `SUMSOC_EXTRAS.CORREO_WEB`, `TELE_WEB` (fuente `legacyWeb`) |
| `invoiceDelivery` | object `{ electronic: bool, channels: [email, whatsapp], noPaper: bool, requiresConfirmationToDisable: bool }` | Sí | Entrega de factura. | CT | `chFacturaElectronica`, `chNoEnviarFactura` |
| `autoDebit` | object (proyección de M07) `{ mandateId, method, status }` | No | Adhesión a débito automático. | FI | `SUMSOC_EXTRAS.DEBITO_360_ID/ESTADO`; `SU_EMP_CBU`; `DEBITO_EXCLUSION` |
| `billingFlags` | object `{ excludeRounding, noLateFee { active, approvedBy, approvedAt } }` | No | Marcas consumidas por M05/M08. | OP | `SUMSOC_EXTRAS.EXCLUIR_REDONDEO`; V2 3135/3162 |
| `fileNumber` | string (secuencia) | No | Número de ficha. | OP | `SUMSOC_EXTRAS.NROFICHA` |
| `structureSummary` | object (proyección) `{ billingGroups: [{ billingGroupId [M05], name, contracts: [{ contractId [M02], serviceName, connectionRef, status, category }] }], hasMultipleGroups }` | No | Árbol para la ficha (lectura). | OP | `SERSOC.GRUPO_FACTURA`; `PoseeGrupos` |
| `extra` | object | No | Datos extra de cuenta. | según campo | `SUMSOC` (+59), `SUMSOC_EXTRAS` |

Índices: `{ tenantId, accountNumber }` único; `{ tenantId, holderId, status }`; `{ tenantId, holderId, isPrincipal }` único parcial sobre `isPrincipal = true AND status = active` (garantiza una principal); `{ tenantId, districtSectionId }`; `{ tenantId, "deliveryRoute.zoneId", "deliveryRoute.sectorId", "deliveryRoute.routeOrder" }`.

Columnas de `SUMSOC` relevadas: `COD_SOC`, `NUM_SUM`, `COD_SIT`, `COD_CAL`, `NUMERO`, `PISO`, `DPTO`, `COD_BAR`, `COD_LOC`, `COD_POS`, `CLIENTE`, `COD_GRU`, `NOF_SUM`, `PRINCIPAL`, `EMAIL`, `MOVIL`, `BLOQUEAR_FAC_WEB`, `ALTA`, `COD_SIB`, `NO_RESET` y otras (+59) **[VERIFICAR]**. `NOF_SUM` → `blocks` efecto `billing`; `BLOQUEAR_FAC_WEB` → `blocks` efecto `webPayment`; `CLIENTE` → **[VERIFICAR]** (posible marca de cliente no socio).

### 7.5 `addresses` — Domicilio normalizado

Propósito: dirección reutilizable por personas, cuentas, inmuebles y puntos de prestación. Es privada del tenant; el catálogo geográfico es de T04.

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `countryId`, `provinceId`, `departmentId`, `localityId` | uniqueidentifier (T04) | Sí (país, provincia, localidad) | Contexto territorial. | UB | `PAISES`, `PROVINC`, `DEPTO`/`DEPARTA`, `LOCALIDA` |
| `postalCode` | string | Sí (urbano) | Código postal. | UB | `LOCALIDA.COD_POS`, `DOM_COD` |
| `streetId` | uniqueidentifier (T04 `streets`) | No | Calle del catálogo. | UB | `CALLES.COD_CAL` |
| `streetNameRaw` | string | Sí si no hay `streetId` | Calle como se escribió. | UB | — |
| `number` | string | No | Altura. | UB | `NUMERO`, `DOM_NUM` |
| `noNumber` | bool | Sí | "Sin número". | UB | — |
| `floor`, `unit`, `building`, `tower`, `block` | string | No | Piso, departamento, edificio, torre, manzana. | UB | `PISO`, `DPTO`, `EDIFICIO` |
| `neighborhoodId` | uniqueidentifier (T04 `neighborhoods`) | No | Barrio. | UB | `BARRIOS.COD_BAR` |
| `betweenStreets` | array[2] `{ streetId, streetNameRaw }` | No | Entrecalles. | UB | — |
| `accessReferences` | string | No | Referencias de acceso. | UB | `SERSOC` "Referencia" |
| `rural` | object `{ route, km, place, lot, field }` | No | Datos rurales. | UB | — |
| `originalText` | string | Sí | Texto original. | UB | — |
| `normalizedText` | string | Sí (calculado) | Texto normalizado con el formato del tenant (PRM-PER-056). | UB | `GetDomicilio`, `GetDescripcion` |
| `normalization` | object `{ status: normalized/partial/notFound/pending, source: georef/google/catalog/manual, sourceId, catalogVersion, at }` | Sí | Procedencia. | OP | — |
| `geo` | object `{ lat, lng, source: geocoder/mapPin/device/fieldApp/import/manual, precision: rooftop/interpolated/street/centroid/none, status: pending/candidate/confirmed/approximate/needsReview/unavailable, confirmedBy, confirmedAt, reason }` | Sí (`status`) | Ubicación actual (RN-PER-067). | UB | `SERSOC` Latitud/Longitud (REL §2), GPS |
| `streetRequestId` | uniqueidentifier (T04) | No | Solicitud de alta de calle pendiente (RF-PER-084). Referencia: → `streetProposals` (T04, COL-CFG-14). | OP | — |

Índices: `{ tenantId, localityId, streetId, number }`; `{ tenantId, "geo.status" }`; geoespacial 2dsphere `{ tenantId, geoPoint }` (campo derivado GeoJSON); `{ tenantId, normalizedText }` texto.

### 7.6 `addressGeoEvents` — Historial de ubicación

| Campo | Tipo | Oblig. | Descripción | Priv. |
|---|---|---|---|---|
| `addressId` | uniqueidentifier | Sí | Domicilio. | UB |
| `eventType` | enum `candidateFound`, `confirmed`, `corrected`, `markedApproximate`, `markedForReview`, `providerUnavailable`, `normalized` | Sí | Hecho. | OP |
| `before` / `after` | object (`geo` o `normalization`) | Sí | Valores anteriores y nuevos. | UB |
| `source` | enum (igual a `geo.source`) | Sí | Fuente. | OP |
| `actorId` | uniqueidentifier | No | Usuario o job. | OP |
| `reason` | string | Sí en `corrected` | Motivo. | OP |
| `relatedRef` | object `{ type: contract/ticket/workOrder, id }` | No | Relación con contrato, ticket u orden (BASE §77). | OP |
| `occurredAt` | date | Sí | Momento. | OP |

Índices: `{ tenantId, addressId, occurredAt }`.

### 7.7 `premises` — Inmueble

Propósito: lugar físico con catastro (equivalente a `PROPIEDA`).

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop (`PROPIEDA`) |
|---|---|---|---|---|---|
| `premisesCode` | string (secuencia) | Sí | Código visible. | OP | `COD_CTA` |
| `addressId` | uniqueidentifier (`addresses`) | Sí | Domicilio del inmueble. | UB | `DOM_CAL`, `DOM_NUM`, `DOM_PIS`, `DOM_DPT`, `DOM_BAR`, `DOM_LOC`, `DOM_COD`, `COD_PRO`, `COD_DPTO`, `EDIFICIO` |
| `ownerPostalAddressId` | uniqueidentifier (`addresses`) | No | Domicilio postal del propietario. | UB | `PDOM_CAL`, `PDOM_NUM`, `PDOM_PIS`, `PDOM_DPT`, `PDOM_BAR`, `PDOM_LOC`, `PDOM_COD` |
| `deliveryTo` | string | No | Entregar a. | ID | `ENTREGAR_A` |
| `legacyAccountRef` | string | No | Cuenta asociada en ProCoop (solo migración; la relación real va por `servicePoints`). | OP | `COD_SUM` |
| `cadastre` | object `{ part1..part6 (etiquetas PRM-PER-057), fullDesignation, normalizedKey }` | Sí si el servicio lo exige | Nomenclatura de seis partes; partes vacías = "0" (RN-PER-072). | OP | `CAT_CIR`, `CAT_LOT`, `CAT_MAN`, `CAT_PAR`, `CAT_PH`, `INT_LOT`, `CATASTRO` |
| `cadastreExtra` | object `{ internalBlock, farm, farmLetter, parcelLetter, subParcel, quinta, fraction, districtDecree }` | No | Manzana interna, chacra, letra de chacra, letra de parcela, subparcela, quinta, fracción, decreto/distrito. | OP | `INT_MAN`, `CHACRA`, `LETRA_CHACRA`, `LETRA_PARCELA`, `SUB_PARCELA`, `QUINTA`, `FRACCION`, `DECRETO_DS` |
| `taxParcelNumber` | string | No | Partida inmobiliaria. | OP | `PARTIDA` |
| `construction` | object `{ year, type, buildingType, valuation (DECIMAL(18,4)) }` | No | Año y tipo de construcción, tipo de edificio, valuación. | OP | `ANIOCON`, `TIPOCON`, `TIPO_EDIF`, `VALUACION` |
| `surfaces` | object `{ landM2 (DECIMAL(18,4)), builtM2 (DECIMAL(18,4)) }` | No | Superficie del terreno y edificada. | OP | `SUPERFICIE`, `SUPEDIF` |
| `frontages` | array[≤4] `{ order, lengthM (DECIMAL(18,4)), streetWidthM (DECIMAL(18,4)), zoneId }` | No | Frentes con ancho de calle y zona por frente (cuotas de obra). | OP | `FRENTE1..4`, `FRENTE1..4_ANCHOCALLE`, `COD_ZON1..4` |
| `cornerData` | object `{ lengthM, percentage }` (DECIMAL(18,4)) | No | Longitud y porcentaje de bocacalle. | OP | `LONG_BOCACALLE`, `PORC_BOCACALLE` |
| `coefficients` | object `{ zonal, building, tbm }` (DECIMAL(18,4)) | No | Coeficientes zonal, de edificación y TBM. | OP | `COE_ZONAL`, `COE_EDIF`, `TBM` |
| `networkMeters` | object `{ publicLightingM, sewerM }` (DECIMAL(18,4)) | No | Metros de alumbrado y cloaca. | OP | `METROS_ALUMBRADO`, `METROS_CLOACA` |
| `units` | array `{ _id, unitCode, floor, unit, functionalUnitNumber, phDesignation, status }` | No | Unidades funcionales. | OP | `UNIDAD_FUNCIONAL`, `CANTIDAD_DE_DPTOS`, `CAT_PH` |
| `usageId` | uniqueidentifier (`premiseUsages`) | No | Uso del inmueble. Referencia: `enumerationItems` (T04), catálogo `premiseUsages` (§7.18). M06 lo usa como condición opcional de alícuota de IVA en `vatRateMatrix`, desactivada por defecto (DEC-102, PA-FIS-26). | OP | `USOINM` |
| `stateId` | uniqueidentifier (`premiseStates`) | No | Estado del inmueble. Referencia: `enumerationItems` (T04), catálogo `premiseStates` (§7.18). | OP | `ESTINM` |
| `items` | array `{ itemTypeId, value, unit, validFrom }` | No | Ítems de propiedad con valores. | OP | `PROPIEITEMS*` (DFA M3) |
| `gisRef` | string | No | Identificador GIS (M10). | OP | `COD_CNT` |
| `observations` | — | — | Se migra a `notes` sobre el inmueble. | — | `OBSERVA` |
| `legacyAttributes` | object | No | Columnas de `PROPIEDA` no identificadas en el relevamiento (resto de las +89). | OP | **[VERIFICAR]** contra esquema real |
| `registrationAudit` | — | — | `FEC_REG`, `HOR_REG`, `USU_REG` se migran a `createdAt`/`createdBy`. | — | `FEC_REG`, `HOR_REG`, `USU_REG` |
| `extra` | object | No | Datos extra del inmueble. | según campo | — |
| `status` | enum `active`, `merged`, `archived` | Sí | Estado. | OP | — |

Índices: `{ tenantId, "cadastre.normalizedKey" }` único parcial sobre `status = active` (RN-PER-073); `{ tenantId, taxParcelNumber }`; `{ tenantId, addressId }`; `{ tenantId, premisesCode }` único.

Las personas vinculadas al inmueble (propietario `PROPIEDA.COD_PER`, ocupantes) se modelan en `relationships` (7.9).

> **Alineación con T05 (05-11-2026):** T05 nombra `cadastralKey` (único) y `cadastralDistrictId`; en esta ficha equivalen a `cadastre.normalizedKey` y a la sección catastral de `cadastralDistricts` (T04). Se informa a T05 para que use los nombres de la ficha o se agreguen los campos [VERIFICAR].

### 7.8 `servicePoints` — Punto de prestación

Propósito: dirección donde se presta uno o varios contratos (M02 referencia `servicePointId`).

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `code` | string (secuencia) | Sí | Código visible. Antes `pointCode` (nombre de T05). | OP | — |
| `addressId` | uniqueidentifier (`addresses`) | Sí | Dirección de prestación. | UB | `SERSOC` (calle, número, piso, departamento, barrio, localidad) |
| `premiseId` | uniqueidentifier (`premises`) | Según servicio | Inmueble. Antes `premisesId` (nombre de T05). | OP | `SERSOC.CAT_CIR/CAT_LOT/CAT_MAN/CAT_PAR/CAT_PH/CAT_LT`, `PROPIESER` |
| `unitId` | uniqueidentifier (`premises.units`) | No | Unidad funcional. Referencia: subdocumento `premises.units` (M01). | OP | — |
| `accessNotes` | string | No | Datos de acceso para técnica y lectura. | UB | `SERSOC` "Referencia" |
| `gisRef` | string | No | Identificador GIS del punto. | OP | `SERSOC_EXTRAS.GIS` |
| `status` | enum `active`, `inactive` | Sí | Inactivo si no tiene contratos vigentes y se retiró. | OP | — |
| `contractCount` | int (proyección) | No | Cantidad de contratos vigentes (lectura). | OP | — |

Índices: `{ tenantId, addressId }`; `{ tenantId, premiseId }`; `{ tenantId, code }` único. No hay índice único por dirección + servicio (RN-PER-060).

Campos que PER exige del contrato de M02 (contrato de interfaz): `holderId`, `accountId`, `billingGroupId`, `servicePointId`, `premiseId` (opcional), `holderIdentifierSnapshot { documentTypeId, number, verificationStatus, identificationStatus }` al activar (`identificationStatus` agregado el 10-11-2026 por DEC-099; con `documentPending`, `documentTypeId` y `number` van vacíos). Zona, sector y recorrido de **lectura** y matrícula son de M02/M03.

### 7.9 `relationships` — Relaciones con vigencia

Propósito: vínculos persona–persona, representaciones, autorizaciones, garantías, responsables de pago y relaciones con inmuebles (AGR-007).

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `relationshipTypeId` | uniqueidentifier (`relationshipTypes`) | Sí | Tipo (sección 7.17). Referencia: `enumerationItems` (T04), catálogo `relationshipTypes` (§7.18). | OP | `VINCULOS.COD_VIN`, `TIPO_VIN` |
| `category` | enum `family`, `representation`, `authorization`, `guarantee`, `paymentResponsibility`, `premisesRole`, `organization` | Sí | Familia del tipo. | OP | — |
| `subjectPersonId` | uniqueidentifier | Sí | Persona que tiene el rol (el garante, el apoderado, el hijo, el propietario). | ID | `SOCIOS.COD_GAR`, `PROPIEDA.COD_PER`. *Reemplazado (10-11-2026, DEC-104): "`RESPONSA`, `SOCIOS.COD_GAR`, `PROPIEDA.COD_PER`".* |
| `target` | object `{ type: person/holder/account/serviceContract/premises/servicePoint, id }` | Sí | Sobre qué recae. | OP | `RELACION_ENTIDADES.TIPO_DESTINO/ID_DESTINO` |
| `scopeActions` | array enum `view`, `pay`, `requestServices`, `requestCancellation`, `signConformity`, `receiveNotices`, `updateData`, `actInAssembly` | Sí en `authorization`/`representation` | Alcance por acción (RF-PER-100). | OP | — |
| `validFrom` / `validTo` | date | Sí / No | Vigencia. | OP | `RELACION_ENTIDADES.FECHA` |
| `status` | enum `pending`, `active`, `expired`, `revoked`, `rejected` | Sí | Estado (sección 8.6). | OP | — |
| `evidenceDocumentIds` | array uniqueidentifier [T11] | Según tipo | Poder, acta, DNI, contrato de alquiler. | ID | — |
| `verification` | object `{ verifiedBy, verifiedAt, method }` | Si el tipo lo exige | Verificación. | OP | — |
| `revocation` | object `{ revokedBy, revokedAt, reason, channel }` | No | Revocación. | OP | — |
| `origin` | enum `backoffice`, `portal`, `import`, `migration` | Sí | Origen. | OP | `RELACION_ENTIDADES.USUARIO` |
| `notes` | string | No | Observación. | OP | — |

Índices: `{ tenantId, subjectPersonId, status }`; `{ tenantId, "target.type", "target.id", status }`; `{ tenantId, validTo, status }` (vencimientos).

> **Alineación con T05 (05-11-2026):** T05 usa `fromPersonId`/`toPersonId`; la ficha modela `subjectPersonId` (persona que actúa) y `target` (destino tipado, que puede ser persona, titular o cuenta). No es un renombre 1 a 1: se informa a T05.
>
> **Actualización (ronda de residuales del 05-11-2026, PA-PER-19):** T05 COL-PER-10 ya unificó los nombres de esta ficha: `subjectPersonId` y `target` (`{type, id}`) en claves y en el único `{subjectPersonId, target.type, target.id, relationshipTypeId, validFrom}` (antes `fromPersonId`/`toPersonId`). M01 no cambia; el payload de EVT-PER-18 usa los mismos nombres.

### 7.10 `adherents` — Adherentes y beneficiarios

**Colección reemplazada por `serviceDependents` y `serviceBeneficiaries` de M18 §7.1** (DEC-071, HUECO-TRV-01). M01 no persiste esta colección; la tabla siguiente se conserva como referencia del diseño original y del mapeo de columnas ProCoop, que M18 absorbe.

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `kind` | enum `adherent`, `beneficiary` | Sí | Adherente o beneficiario. | OP | `ADHSOC` / `BENSOC` |
| `contractId` | uniqueidentifier [M02] | Sí | Contrato. | OP | `ADHSOC.COD_CSE`/`ID_SERSOC`, `BENSOC.ID_SERSOC` |
| `serviceId` | uniqueidentifier [M02] | Sí (desnormalizado) | Servicio, para la regla de unicidad (RN-PER-082). | OP | `ADHSOC.COD_SER` |
| `accountId`, `holderId` | uniqueidentifier | Sí | Desnormalizados para consulta. | OP | `COD_SUM`, `COD_SOC` |
| `personId` | uniqueidentifier | Sí | Persona adherente. | ID | `COD_PER` |
| `relationshipTypeId` | uniqueidentifier (`relationshipTypes`) | Sí | Vínculo con el titular. | ID | `COD_VIN` |
| `isHolderAdherent` | bool | Sí | El titular figura como adherente. | OP | `ADHSOC.TITULAR` |
| `adherentTariffId` | uniqueidentifier [M04] | No | Tarifa de adherente. | OP | `ADHSOC.COD_TAD` |
| `startDate` / `endDate` | date | Sí / No | Alta y baja. | OP | `FEC_ALT`, `FEC_BAJ` |
| `endReason` | enum `request`, `condition`, `deceased`, `transfer`, `contractClosed`, `other` | Si `endDate` | Motivo de baja. | OP | `OBSERVA` |
| `printing` | object `{ printedAt, printMark }` | No | Impresión de credencial/ficha. | OP | `FEC_IMP`, `MAR_IMP` |
| `recovery` | bool | No | Marca "recupera" **[VERIFICAR]** semántica. | OP | `ADHSOC.RECUPERA` |
| `status` | enum `active`, `inactive` | Sí | Estado (sección 8.7). | OP | `BENSOC.ACTIVO` |
| `observations` | string | No | Observación. | OP | `BENSOC.OBSERVA` |
| `extra` | object | No | Columnas restantes de `ADHSOC` (+6). | OP | `ADHSOC` (+6) **[VERIFICAR]** |

Índices: `{ tenantId, contractId, status }`; `{ tenantId, personId, serviceId, status }` (unicidad lógica aplicada en servicio con PRM-PER-064).

### 7.11 `notes` — Notas y observaciones

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `subjectRef` | object `{ type: person/holder/account/serviceContract/premises, id }` | Sí | Destino. Antes `target` (nombre de T05). | OP | `NOTA_SUM.COD_PER/COD_SOC/COD_SUM/COD_SER/ID_SERSOC` |
| `noteNumber` | string (secuencia) | Sí | Número. | OP | `NOTA_SUM.COD_NOT` |
| `noteDate` | date | Sí | Fecha de la nota (efectiva). | OP | `NOTA_SUM.FECHA` |
| `title` | string | Sí | Título. | OP | `NOTA_SUM.TITULO` |
| `text` | string | Sí | Texto (sin límite de 1000). | OP | `NOTA_SUM.TEXTO`, `SOCIOS.OBSERVA`, `PROPIEDA.OBSERVA` |
| `noteTypeId` | uniqueidentifier (`noteTypes`) | No | Categoría. Referencia: `enumerationItems` (T04), catálogo `noteTypes` (§7.18). | OP | — |
| `visibility` | enum `internal`, `cashier`, `portal` | Sí | Visibilidad; `cashier` reemplaza `MSG_CAJ`. | OP | `NOTA_SUM.MSG_CAJ` |
| `isSystem` | bool | Sí | Nota automática (RN-PER-094). | OP | Notas automáticas |
| `systemEvent` | string | No | Evento que la originó (`per.account.created`, `cat.contract.categoryChanged`, `tec.workOrder.closed`). | OP | — |
| `pinned` | bool | No | Destacada en búsqueda (PRM-PER-086). | OP | V2 2744 |
| `revisions` | array `{ version, title, text, editedBy, editedAt }` | No | Versiones anteriores. | OP | `NOTA_SUM1`, `COD_NOT_ORI` |
| `deletion` | object `{ deletedBy, deletedAt, reason }` | No | Borrado lógico. | OP | `NOT_ELIMINADAS_HST` |
| `legacyBlockFlag` | bool | No | Solo migración: la nota tenía `BLO_CAJ` (se crea además un bloqueo). | OP | `NOTA_SUM.BLO_CAJ` |

Índices: `{ tenantId, "subjectRef.type", "subjectRef.id", noteDate }`; `{ tenantId, noteNumber }` único.

### 7.12 `blocks` — Bloqueos tipados

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `subjectRef` | object `{ type: person/holder/account/serviceContract, id }` | Sí | Destino. Antes `target` (nombre de T05). | OP | `NOTA_SUM` (cuenta/servicio), `SUMSOC`, `SUMNOFAC` |
| `effects` | array enum `cashPayment`, `webPayment`, `webDebtPublication`, `billing`, `cancellation`, `transfer`, `newContracts`, `reconnection`, `dataChanges`, `cashierMessageOnly` | Sí (≥1) | Efectos (RN-PER-095). | OP | `BLO_CAJ`, `BLOQUEAR_FAC_WEB`, `NOF_SUM`, PMovil 17 |
| `effectMode` | enum `deny`, `requireApproval`, `warn` | Sí | Para `cashPayment` el valor por defecto lo fija PA-PER-16. | OP | — |
| `holdReasonId` | uniqueidentifier (`blockReasons`) | Sí | Causa del catálogo. Antes `reasonId` (nombre de T05). Referencia: `holdReasons` (M08; antes catálogo `blockReasons`, CTR-DAT-36). | OP | `CAUBLOQ` |
| `detail` | string | No | Detalle. | OP | `NOTA_SUM.TEXTO` |
| `cashierMessage` | string | No | Mensaje para caja/atención. | OP | `NOTA_SUM.MSG_CAJ` |
| `portalMessage` | string | No | Mensaje en el portal. | OP | — |
| `validFrom` / `validTo` | date | Sí / No | Vigencia. | OP | `SUMNOFAC` (fecha marca/desmarca) |
| `status` | enum `active`, `lifted`, `expired` | Sí | Estado (sección 8.8). | OP | `SUMNOFAC.ACTIVO` |
| `appliedBy` / `appliedAt` | uniqueidentifier / date | Sí | Quién y cuándo. | OP | `SUMNOFAC` (usuario y fecha de marca) |
| `lift` | object `{ liftedBy, liftedAt, reason }` | No | Levantamiento. | OP | `SUMNOFAC` (usuario y fecha de desmarca) |
| `sourceRef` | object `{ type: manual/documentAction/import/migration/module, id }` | Sí | Origen (por ejemplo, acción de vencimiento documental). | OP | — |

Índices: `{ tenantId, "subjectRef.type", "subjectRef.id", status }`; `{ tenantId, effects, status }`; `{ tenantId, validTo, status }`.

### 7.13 `documentRequirementTypes` y `documentSubmissions` — Requisitos y documentación presentada

`documentRequirementTypes` (equivalente a `TRAMITES`, `REQUISITOS`, `REQUISITOS_ITEMS`):

| Campo | Tipo | Oblig. | Descripción | Origen ProCoop |
|---|---|---|---|---|
| `code`, `name` | string | Sí | Código y nombre (`dict:`). | `TRAMITES.COD_TMT`, `DES_TMT` |
| `appliesTo` | array enum `person`, `holder`, `account`, `serviceContract` | Sí | Entidades a las que aplica (proveedores y empleados los usa M12/M16 con el mismo motor de T11). | `TRAMITES.TIPO_TMT`; `Tipo_Acciones` 1 cuenta, 2 servicio, 3 proveedores, 4 empleados |
| `validityDays` | int | No | Días de vigencia. | `TRAMITES.DIAS_VENCE` |
| `templateId` | uniqueidentifier [T11] | No | Plantilla asociada. | `TRAMITES.COD_PLA` |
| `isDefault` | bool | Sí | Requisito por defecto. | `TRAMITES.TRAMITE_DEFAULT` |
| `items` | array `{ code, name, mandatory }` | No | Ítems del requisito. | `REQUISITOS_ITEMS` |
| `requiredFor` | array `{ serviceId [M02], event: contractActivation/beneficiaryGrant/transfer/succession }` | No | Cuándo es exigible. | `REQUISITOS` |
| `actionsOnSubmit` / `actionsOnExpiry` | array `{ actionType: createTask/applyBlock/liftBlock/grantBenefit/revokeBenefit/notify, params }` | No | Acciones tipadas (RN-PER-098). | `TRAMITES_ACCIONES.ACCION_ALTA/ACCION_VTO` |
| `publishedOnPortal` | bool | Sí | Visible en "Requisitos y trámites" del portal (M19). | "Procoop WEB > Requisitos y Trámites" |
| `status` | enum `active`, `inactive` | Sí | — | — |

**`documentSubmissions`** (equivalente a `PTRAMITES`):

> **Alineación con T05 (05-11-2026):** T05 usa `personId` y `documentId`; la ficha usa `target` (destino tipado) y `documentIds[]` (`documents`, T11). Se informa a T05.

| Campo | Tipo | Oblig. | Descripción | Priv. | Origen ProCoop |
|---|---|---|---|---|---|
| `requirementTypeId` | uniqueidentifier | Sí | Requisito. | OP | `PTRAMITES.COD_TMT` |
| `target` | object `{ type, id }` | Sí | Persona, titular, cuenta o contrato. | OP | `COD_SOC`, `COD_SUM`, `ID_SERSOC` |
| `submissionDate` | date | Sí | Fecha de presentación. | OP | `FECHA` |
| `expiresAt` | date | No | Vencimiento explícito o calculado. | OP | `FECHA_VTO` |
| `presented` | bool | Sí | Presentado. | OP | `PRESENTADO` |
| `status` | enum `pending`, `presented`, `validated`, `rejected`, `expired`, `superseded` | Sí | Estado (sección 8.9). | OP | — |
| `documentIds` | array uniqueidentifier [T11] | No | Archivos. | ID | `ADJUNTOS` |
| `observations` | string | No | Observación. | OP | `OBSERVA` |
| `actionsExecuted` | array `{ phase: submit/expiry, actionType, executedAt, result, error }` | No | Resultado de acciones. | OP | `ACCIONADO`, `ID_AC_TRA` |
| `legacy` | object | No | Columnas restantes (+3), proveedor (`COD_PROV`). | OP | `PTRAMITES` (+3) |

Índices: `{ tenantId, "target.type", "target.id", requirementTypeId, status }`; `{ tenantId, expiresAt, status }`.

### 7.14 `transfers` — Transferencias y cambios de titularidad

| Campo | Tipo | Oblig. | Descripción | Origen ProCoop |
|---|---|---|---|---|
| `number` | string (secuencia) | Sí | Número de operación. Antes `transferNumber` (nombre de T05). | `TRANSFER.ID_TRANS` |
| `type` | enum `accountTransfer`, `ownershipChange`, `capitalTransfer`, `relocation`, `payerChange`, `succession` | Sí | Tipo. | `TRANSFER.TIPO_TRA` (1 cuenta, 2 servicio, 3 capital) |
| `origin` | object `{ holderId, accountId, servicePointId }` | Sí | Origen. | `TRANSFER.ORIGEN` |
| `destination` | object `{ holderId, accountId, servicePointId, newHolderDraft }` | Sí | Destino (puede crear titular nuevo). | `TRANSFER.DESTINO` |
| `items` | array `{ kind: account/serviceContract/capital, refId, newRefId, keepOriginalStartDate, adherentsMode, result }` | Sí | Elementos transferidos y resultado. | `TRANSFER.SERVICIO`, `ID_TRANS_CUENTA` |
| `effectiveDate` | date | Sí | Fecha efectiva. | `TRANSFER.FECHA` |
| `options` | object `{ keepCapital, closeOriginHolder, makePrincipal, chargeTransferConcepts, contractMode: clone }` | Sí | Opciones explícitas (reemplazan diálogos). | Diálogos de `TransferirCuenta`/`TransferirServicio` |
| `simulation` | object `{ simulatedAt, pendingDebtAtOrigin (DECIMAL(18,4), informativo de M07), conceptsToCharge[], iibbChange, autoDebitImpact, adherentsImpact, billingGroupImpact, blocksFound[], relationshipsFound[], warnings[] }` | Sí antes de enviar | Efectos simulados (RF-PER-135). | — |
| `status` | enum `draft`, `pendingApproval`, `approved`, `executing`, `executed`, `failed`, `cancelled`, `reverted` | Sí | Estado (sección 8.10). | — |
| `approval` | object `{ workflowInstanceId [T11], approvedBy, approvedAt, rejectedReason }` | Según política | Aprobación. | — |
| `execution` | object `{ idempotencyKey, startedAt, finishedAt, steps[{ name, status, at, error }] }` | No | Pasos de ejecución. | — |
| `reversal` | object `{ revertedBy, revertedAt, reason, reversalTransferId }` | No | Reversión. | — |
| `observations` | string | No | Observación completa. | `TRANSFER.OBSERVAC` |
| `evidenceDocumentIds` | array uniqueidentifier [T11] | Según tipo | Respaldos. | — |
| `certificateDocumentId` | uniqueidentifier [T11] | No | Constancia generada (reimprimible). | `frmReimpresionTrans` |

Índices: `{ tenantId, number }` único; `{ tenantId, "origin.holderId" }`; `{ tenantId, "destination.holderId" }`; `{ tenantId, status }`; `{ tenantId, "execution.idempotencyKey" }` único parcial.

> **Alineación con T05 (05-11-2026):** T05 usa `fromHolderId`/`toHolderId`; equivalen a `origin.holderId` y `destination.holderId` de la ficha. Se informa a T05.

### 7.15 `duplicateCases` — Casos de duplicado y fusión

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `personIds` | array[2] uniqueidentifier | Sí | Par candidato (ordenado). |
| `score` | int 0–100 | Sí | Puntaje. |
| `matchedOn` | array enum `identifier`, `taxIdDni`, `phoneticName`, `birthDate`, `contact`, `address` | Sí | Criterios coincidentes. |
| `detectedBy` | enum `onCreate`, `batch`, `import`, `manual` | Sí | Origen. |
| `status` | enum `open`, `dismissed`, `confirmedSame`, `mergeRequested`, `merged`, `mergeRejected`, `mergeReverted` | Sí | Estado (sección 8.11). |
| `decision` | object `{ decidedBy, decidedAt, reason }` | No | Decisión. |
| `merge` | object `{ survivorPersonId, absorbedPersonId, fieldChoices{}, requestedBy, approvedBy, executedAt, reassignedRefs[{ module, collection, id }], revertibleUntil }` | No | Datos de la fusión. |

Índices: `{ tenantId, personIds }` único; `{ tenantId, status, score }`.

### 7.16 `perRevisions` — Historia bitemporal

Propósito: reemplazar `SUMSOC_HST`, `SERSOC_HST` (en lo que toca a PER) y `HIS_*` con una historia que distingue fecha efectiva y fecha de registro (AGR-010).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `entityType` | enum `person`, `holder`, `account`, `address`, `premises`, `servicePoint`, `relationship`, `adherent`, `block` | Sí | Entidad. |
| `entityId` | uniqueidentifier | Sí | Identificador. |
| `revision` | int | Sí | Número de revisión. |
| `validFrom` / `validTo` | date | Sí / No | Vigencia efectiva del estado. |
| `recordedAt` | date | Sí | Cuándo lo conoció el sistema. |
| `recordedBy` | uniqueidentifier | Sí | Actor (usuario, job, integración). |
| `source` | enum `screen`, `portal`, `api`, `job`, `import`, `migration`, `event` | Sí | Origen. |
| `reason` | string | No | Motivo. |
| `changedFields` | array string | Sí | Campos cambiados. |
| `snapshot` | object | Sí | Estado completo de la entidad en esa revisión (sin datos sensibles). |
| `onBehalfOf` | object `{ personId, relationshipId }` | No | Si actuó un representante (RF-PER-104). |

Índices: `{ tenantId, entityType, entityId, revision }` único; `{ tenantId, entityType, entityId, validFrom }`; `{ tenantId, entityType, entityId, recordedAt }`.

> **Alineación con T05 (05-11-2026):** T05 usa `subjectRef`; equivale al par `entityType` + `entityId` de la ficha (índice único `{subjectRef, revision}` = `{entityType, entityId, revision}`).

### 7.17 `consents`, `dataSubjectRequests` y `personUserLinks`

**Reemplazadas por las colecciones canónicas de T05**: `consents` → `consentRecords` de T08 (CTR-DAT-18); `dataSubjectRequests` → la de T08 (COL-NFR-05); `personUserLinks` → `memberships.personId` de T02 con evidencia de la verificación (COL-IAM-04). M01 define el contenido funcional (finalidades, vínculo verificado por DEC-043) y no persiste estas colecciones. Diseño original:

`consents`:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Persona. |
| `purpose` | enum `serviceManagement`, `marketing`, `wallParticipation`, `surveys`, `sensitiveData`, `thirdPartySharing`, `aiProcessing` | Sí | Finalidad. |
| `legalBasis` | enum `contract`, `legalObligation`, `consent`, `legitimateInterest` | Sí | Base. |
| `textVersionId` | uniqueidentifier (T04/T08 textos legales) | Sí | Versión del texto aceptado. |
| `channel` | enum `backoffice`, `portal`, `app`, `paper` | Sí | Canal. |
| `grantedAt` / `revokedAt` | date | Sí / No | Otorgamiento y revocación. |
| `evidenceDocumentId` | uniqueidentifier [T11] | No | Constancia. |
| `status` | enum `granted`, `revoked` | Sí | Estado. |

`dataSubjectRequests`:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `personId` | uniqueidentifier | Sí | Titular de los datos. |
| `requestType` | enum `access`, `rectification`, `update`, `deletion`, `objection` | Sí | Derecho ejercido. |
| `receivedAt` / `dueAt` | date | Sí | Recepción y plazo (según T08). |
| `channel` | enum `backoffice`, `portal`, `email`, `paper` | Sí | Canal. |
| `identityVerified` | object `{ by, at, method }` | Sí antes de resolver | Verificación de identidad del solicitante. |
| `status` | enum `received`, `inProgress`, `resolved`, `rejected` | Sí | Estado (sección 8.12). |
| `resolution` | object `{ resolvedBy, resolvedAt, outcome, exportDocumentId, retainedCategories[], legalGround }` | No | Resultado y evidencia. |

`personUserLinks`:

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `userId` | uniqueidentifier [T02] | Sí | Usuario de acceso. |
| `personId` | uniqueidentifier | Sí | Persona del tenant. |
| `status` | enum `requested`, `pendingVerification`, `verified`, `rejected`, `revoked`, `expired` | Sí | Estado (sección 8.13). |
| `method` | enum `invoiceCode`, `documentAndAccount`, `inPerson`, `otpToRegisteredContact`, `identityProvider` | Sí | Método (DEC-043: código de factura + documento, código de un solo uso al contacto registrado o validación presencial; `documentAndAccount` sin segundo factor y `identityProvider` solo como complemento). |
| `attempts` | array `{ at, result, ip }` | Sí | Intentos (con límite y bloqueo temporal). |
| `verifiedAt` / `verifiedBy` | date / uniqueidentifier | No | Verificación. |
| `revokedAt` / `revokedBy` / `revokeReason` | — | No | Revocación. |

Índices: `consents { tenantId, personId, purpose, status }`; `dataSubjectRequests { tenantId, status, dueAt }`; `personUserLinks { tenantId, userId, personId }` único y `{ tenantId, personId, status }`.

### 7.18 Catálogos del módulo (tablas maestras de T04)

Ubicación canónica (CTR-DAT-12 de T05): estos catálogos **no son colecciones de M01**; viven en `enumerations`/`enumerationItems` de T04 con la clave indicada, salvo cuatro: `documentTypes` → `identityDocumentTypes` (T04; el campo de referencia en `persons.identifiers` sigue siendo `documentTypeId`, CTR-DAT-14), `districtSections` → `cadastralDistricts` (T04), `postalCompanies` → `postalCarriers` (M05) y `blockReasons` → `holdReasons` (M08, CTR-DAT-36). M01 consume y no administra los cuatro.

| Clave de catálogo | Contenido | Campos propios | Origen ProCoop |
|---|---|---|---|
| `documentTypes` | Tipos de documento | `code`, `name`, `arcaCode`, `inaesCode`, `enargasCode`, `senasaCode`, `appliesTo` (natural/legal), `format` (regex), `isTaxId` | `DOCUMENT` (COD_DOC, DES_DOC, COD_SEN, COD_INA, COD_AFIP, COD_ENGAS) |
| `maritalStatuses` | Estados civiles | `code`, `name` | `EST_CIVIL` |
| `occupations` | Ocupaciones/profesiones | `code`, `name`, `type` | `OCUPACIO` (COD_OCU, DES_OCU, TIPO) |
| `relationshipTypes` | Tipos de vínculo y relación | `code`, `name`, `category`, `inverseTypeId`, `requiresEvidence`, `requiresVerification`, `defaultScopeActions[]`, `exemptFromAdherentConditions` (por ejemplo "discapacitado") | `VINCULOS` (COD_VIN, DES_VIN, TIPO_VIN); "DISCA" |
| `holderCloseReasons` | Causas de baja del titular | `code`, `name`, `requiresEvidence` | Causas (`abmCausas`), `SOCIOS.CAU_BAJA` |
| `blockReasons` | Causas de bloqueo | `code`, `name`, `defaultEffects[]` | `CAUBLOQ` |
| `noteTypes` | Tipos de nota | `code`, `name`, `defaultVisibility` | — |
| `premiseUsages` | Usos de inmueble; M06 lo usa como condición opcional de alícuota en `vatRateMatrix` (DEC-102) | `code`, `name`, `usageClass` (enum `residential`, `commercial`, `industrial`, `rural`, `other`; clase normalizada que lee M06, RF-PER-089). *Reemplazado (10-11-2026, DEC-102): "`code`, `name`".* | `USOINM` |
| `premiseStates` | Estados de inmueble | `code`, `name` | `ESTINM` |
| `premiseItemTypes` | Tipos de ítem de propiedad | `code`, `name`, `dataType`, `unit` | `PROPIEITEMS*` |
| `districtSections` | Distritos y secciones | `district`, `section`, `description` | `DISTRITO_SECCION` |
| `postalCompanies` | Empresas postales | `code`, `name` | `abm_Postales` |

`CALLES`, `RNQCALL`, `BARRIOS`, `LOCALIDA`, `PROVINC`, `DEPTO`, `DEPARTA`, `PAISES`, `ZONAS`, `MAPA` y `FERIADOS` son catálogos de T04 que PER consume; `VIAINGTE` es catálogo de M09 (`crmChannels`, CTR-DAT-77).

## 8. Estados y transiciones

### 8.1 Persona (`persons.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `active` | Atención, portal (vía registro y vinculación), importación | Búsqueda de coincidencias ejecutada; obligatorios por tipo | `per.person.created`; revisión 1 | Archivar si fue un error y no tiene relaciones |
| `active` → `deceased` | Supervisor (`per.personas.registrarFallecimiento`) | Fecha de fallecimiento ≤ hoy; evidencia según política | Baja de adhesiones y beneficios de la persona (motivo `deceased`); revocación de autorizaciones otorgadas por y a la persona; tareas en M09 (baja de titular, transferencia, cambio de garante); `per.person.deceased` | `deceased` → `active` con aprobación y motivo; reactiva lo dado de baja por ese evento; `per.person.deathReverted` |
| `active` → `merged` | Aprobador de fusión | Caso `confirmedSame` aprobado | Reasignación de referencias; `per.person.merged` | `merged` → `active` por reversión de fusión dentro del plazo (PRM-PER-099) |
| `active`/`deceased` → `archived` | Responsable de privacidad | Sin obligaciones ni relaciones vigentes; plazo de conservación cumplido o solicitud de supresión procedente | Anonimización de datos no obligatorios; `per.person.anonymized` | No reversible (se conserva constancia) |

### 8.2 Titular (`holders.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `applicant` | Registro/portal, atención | Persona existente | Puede iniciar solicitudes en M09 | Cerrar si no prospera |
| `applicant` → `active` | Atención | Identificación requerida completa (RN-PER-008, RN-PER-121); al menos una cuenta (PRM-PER-008) | Número de titular asignado; `per.holder.activated` (M04 puede generar cargo "alta de titular") | — |
| — → `active` | Atención | Ídem | `per.holder.created` | — |
| `active` → `closed` | Supervisor (`per.titulares.baja`) | Sin contratos activos (PRM-PER-031), sin capital si la política lo exige (PRM-PER-032), relaciones informadas (PRM-PER-034), sin bloqueo `cancellation` | Cierre del período; cuentas sin contratos se cierran; `per.holder.closed`; constancia con plantilla (PRM-PER-091) | `closed` → `active` (reactivación, RF-PER-046) con nuevo período; `per.holder.reopened` |

### 8.3 Cuenta (`accounts.status`, `isPrincipal`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `active` | Atención | Titular `active` o `applicant`; validaciones RF-PER-072 | Si es la primera, `isPrincipal = true`; nota de sistema; `per.account.created` | — |
| `active` → `closed` | Supervisor | Sin contratos vigentes; sin transferencia en curso; no es la única principal de un titular activo con otras cuentas (se debe reasignar) | `per.account.closed` | `closed` → `active` con aprobación |
| `isPrincipal`: A → B | Atención | B `active` del mismo titular | Una transacción desmarca A y marca B; `per.account.principalChanged` | Repetir la operación |

### 8.4 Domicilio (`addresses.geo.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `pending` | Sistema | Alta de domicilio | Job de geocodificación encolado |
| `pending` → `candidate` | JOB-PER-02 | Proveedor devuelve candidato | Se muestra para confirmar |
| `pending` → `unavailable` | JOB-PER-02 | Proveedor sin resultado o fuera de servicio tras reintentos | Queda para revisión manual |
| `candidate` → `confirmed` | Usuario con `per.domicilios.confirmarUbicacion`, socio en su solicitud | Revisión visual | `per.address.geoConfirmed` |
| `candidate`/`confirmed` → `approximate` | Usuario o job | Precisión centroide o calle | — |
| cualquiera → `needsReview` | Técnico (`proponerUbicacion`), operador | Discrepancia en campo o calle no encontrada | Tarea de revisión |
| `needsReview` → `confirmed` | Usuario autorizado | Punto corregido con motivo | `addressGeoEvents` `corrected` |

### 8.5 Punto de prestación (`servicePoints.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `active` | Atención, M02 al crear contrato | Domicilio válido | `per.servicePoint.created` |
| `active` → `inactive` | Sistema | Sin contratos vigentes durante el plazo configurado o retiro | — |
| `inactive` → `active` | Atención | Nuevo contrato | — |

### 8.6 Relación (`relationships.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `pending` | Atención, titular (portal) | Tipo y alcance definidos | Si el tipo no exige verificación pasa directo a `active` | — |
| `pending` → `active` | Supervisor (`per.relaciones.verificar`) | Evidencia válida | `per.relationship.granted`; acceso efectivo recalculado | — |
| `pending` → `rejected` | Supervisor | Evidencia insuficiente | Aviso al solicitante | — |
| `active` → `revoked` | Titular, representado, supervisor | — | `per.relationship.revoked`; acceso retirado desde ese momento | Nueva relación |
| `active` → `expired` | JOB-PER-04 | `validTo` < hoy | `per.relationship.expired` | Nueva relación |

### 8.7 Adherente (`adherents.status`)

**Reemplazado por los estados de `serviceDependents` de M18 §8** (HUECO-TRV-01). Los eventos `per.adherent.*` de esta tabla no se publican; se usan los de EVT-SOC-01. Texto original:

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `active` | Atención, importación | Contrato del servicio que admite adherentes; regla de unicidad (PRM-PER-064) | `per.adherent.added` (M04 recalcula) |
| `active` → `inactive` | Atención, JOB-PER-06 (condición), fallecimiento, desconexión del contrato, transferencia | Motivo | `per.adherent.removed` |
| `inactive` → `active` | Atención, reconexión del contrato (no si fallecido) | Condición vigente | `per.adherent.added` |

### 8.8 Bloqueo (`blocks.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `active` | Supervisor (`per.bloqueos.aplicar`), acción documental, módulo autorizado | Al menos un efecto; causa | `per.block.applied` |
| `active` → `lifted` | Supervisor (`per.bloqueos.levantar`) | Motivo | `per.block.lifted` |
| `active` → `expired` | JOB-PER-04 | `validTo` < ahora | `per.block.expired` |

### 8.9 Documentación presentada (`documentSubmissions.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `pending` | Sistema (requisito exigible) | Evento que lo exige | Aparece en "no presentados" |
| `pending` → `presented` | Atención, portal | Archivo o constancia | Acciones `actionsOnSubmit` |
| `presented` → `validated` / `rejected` | Supervisor (`per.documentacion.validar`) | Revisión | `per.document.validated` / `rejected` |
| `validated` → `expired` | JOB-PER-04 | Regla RN-PER-097 | Acciones `actionsOnExpiry`; `per.document.expired` |
| `validated` → `superseded` | Sistema | Nueva presentación validada del mismo tipo | — |

### 8.10 Transferencia (`transfers.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `draft` | Atención (`per.transferencias.crear`) | Origen y destino | — | Cancelar |
| `draft` → `pendingApproval` | Atención | Simulación vigente (menos de 24 h o sin cambios de origen) | Workflow T11 si la política lo exige | Volver a `draft` |
| `draft`/`pendingApproval` → `approved` | Supervisor (`per.transferencias.aprobar`) | Sin bloqueos `transfer`; validaciones RN-PER-103 | — | `cancelled` |
| `approved` → `executing` → `executed` | Supervisor (`per.transferencias.ejecutar`), JOB-PER-07 | `Idempotency-Key` | Comandos a M02/M05/M07/M17; `per.transfer.executed`; constancia | `executed` → `reverted` con transferencia inversa (RF-PER-136); `per.transfer.reverted` |
| `executing` → `failed` | JOB-PER-07 | Paso fallido tras reintentos | Compensación de pasos ejecutados; tarea | Reintentar desde el paso fallido |
| `executed` → `reverted` | Supervisor (`per.transferencias.revertir`) | Transferencia ejecutada; RF-PER-136 | Transferencia inversa; `per.transfer.reverted` (EVT-PER-22). Fila agregada el 05-11-2026: antes la reversión figuraba solo en la columna Reversión. | No |
| `draft`/`pendingApproval`/`approved` → `cancelled` | Atención, supervisor | — | — | — |

### 8.11 Caso de duplicado (`duplicateCases.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `open` | JOB-PER-03, alta, importación | Puntaje ≥ umbral (PRM-PER-082) | Aparece en bandeja |
| `open` → `dismissed` | Atención (`per.duplicados.resolver`) | Motivo | No se vuelve a proponer salvo dato nuevo |
| `open` → `confirmedSame` | Atención | — | Habilita solicitar fusión |
| `confirmedSame` → `mergeRequested` | Atención | Elección de valores por campo | Workflow de aprobación |
| `mergeRequested` → `merged` / `mergeRejected` | Aprobador (`per.personas.unificar`; antes `per.personas.fusionar`) | Distinto de quien solicitó | JOB-PER-08 reasigna referencias |
| `merged` → `mergeReverted` | Aprobador | Dentro del plazo | Restaura referencias registradas |

### 8.12 Solicitud de derechos (`dataSubjectRequests.status`)

— → `received` (alta de la solicitud; estado inicial) → `inProgress` (identidad verificada) → `resolved` (con evidencia) o `rejected` (con fundamento). Aviso por vencimiento de plazo.

> Colección absorbida (T05: COL-PER-20 A→COL-NFR-05): la solicitud se guarda en `dataSubjectRequests` de T08, que es el dueño de la máquina; esta subsección queda como referencia del circuito que inicia M01 (PA-PER-19).

### 8.13 Vínculo usuario–persona (`personUserLinks.status`)

> Colección absorbida (T05: COL-PER-21 A→COL-IAM-04): el vínculo se persiste en `memberships` de T02, dueño del estado; la tabla describe el circuito de verificación que ejecuta M01 y se conserva como referencia (PA-PER-19).

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `requested` | Usuario del portal | Sesión válida en el tenant | — |
| `requested` → `pendingVerification` | Sistema | Método elegido iniciado (código enviado al contacto registrado, código de factura solicitado) | Límite de intentos |
| `pendingVerification` → `verified` | Sistema u operador (`per.vinculosUsuario.verificar`) | Prueba superada | `per.userLink.verified`; T02 recalcula alcance |
| `pendingVerification` → `rejected` / `expired` | Sistema | Intentos agotados / plazo vencido | Bloqueo temporal |
| `verified` → `revoked` | Titular, operador | — | `per.userLink.revoked`; cierre de acceso |

### 8.14 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5): se agregan las transiciones de las entidades que tenían estados sin máquina y la transición que faltaba en §8.10.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `premises` | — | `active` | Alta de inmueble (API-PER-31) | RN-PER-072, RN-PER-073 | `per.premises.created` (EVT-PER-16) |
| `premises` | `active` | `merged` | Fusión de inmuebles duplicados | RN-PER-073 (clave catastral única) | `per.premises.updated` (EVT-PER-16) |
| `premises` | `active` | `archived` | Baja lógica sin puntos de prestación activos | Sin puntos de prestación activos (confirmada en PA-PER-18, DEC-072; antes [VERIFICAR] RN no explícita) | `per.premises.updated` (EVT-PER-16) |
| `documentRequirementTypes` | — | `active` | Alta del tipo de requisito (API-PER-66) | — | — |
| `documentRequirementTypes` | `active` | `inactive` | Desactivación por el administrador (`per.documentacion.configurar`) | No se exige en trámites nuevos; los presentados conservan su estado | — |
| `documentRequirementTypes` | `inactive` | `active` | Reactivación | — | — |

### 8.15 Estado de identificación de la persona (DEC-099, 10-11-2026)

Campo `persons.identificationStatus` (§7.1). Es independiente de `status` (8.1): una persona `active` puede estar `documentPending`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| — | `identified` | Alta con al menos una identificación | RN-PER-005, RN-PER-007 | `per.person.created` (EVT-PER-01) |
| — | `approvedException` | Alta sin documento con excepción aprobada (RF-PER-026) | Motivo y aprobador | `per.person.created` (EVT-PER-01) |
| — | `documentPending` | Migración de una persona de ProCoop sin ningún documento (T07) | RN-PER-136 (solo migración) | `per.person.created` (EVT-PER-01); tarea de regularización en M09 |
| `documentPending` | `identified` | Carga de un documento válido (RF-PER-175) | RN-PER-005 y control de duplicados por documento (RN-PER-136 punto 5) | `per.person.identificationRegularized` (EVT-PER-27) |
| `documentPending` | `approvedException` | Excepción aprobada (RF-PER-026) cuando la persona no puede presentar documento | Motivo y aprobador | `per.person.identificationRegularized` (EVT-PER-27) |
| `approvedException` | `identified` | Carga posterior de un documento | RN-PER-005 | `per.person.updated` (EVT-PER-02) |

No hay transición hacia `documentPending` fuera de la migración.

## 9. Procesos y flujos

### 9.1 Alta de persona con búsqueda de coincidencias (CU-03, RF-PER-001..003)

1. El operador ingresa tipo de persona e identificación o nombre. La pantalla llama a `API-PER-03` (coincidencias) con lo escrito.
2. El motor puntúa: identificación igual (100), DNI contenido en CUIT/CUIL (90, RN-PER-011), apellido y nombre fonético + fecha de nacimiento (70), contacto normalizado igual (50), mismo domicilio (20). Nunca consulta otros tenants (RN-PER-002). Las personas `documentPending` solo se comparan por nombre fonético y domicilio, y la coincidencia se muestra como aviso (RN-PER-136, DEC-099).
3. Si hay candidatos con puntaje ≥ PRM-PER-082, se muestran con datos mínimos enmascarados; el operador elige "usar esta persona" o "es otra persona" con motivo (queda en `duplicateCases` como `dismissed`).
4. Validación: obligatorios por tipo (RN-PER-012, RN-PER-013), dígito verificador (RN-PER-007), unicidad (RN-PER-005), política de contactos (RN-PER-019).
5. Guardado transaccional: `persons` + `personIdentifierIndex` + `perRevisions` revisión 1 + outbox `per.person.created`.
6. Asíncrono: JOB-PER-01 (ARCA) si hay CUIT/CUIL y la política lo pide; JOB-PER-02 (geocodificación) si hay domicilio.

### 9.2 Alta de titular y cuenta (RF-PER-040, RF-PER-055)

1. Desde la ficha de la persona, "Hacer titular": se valida que no tenga otra titularidad abierta.
2. Se asigna `holderNumber` de la secuencia única del tenant (DEC-017; manual con PRM-PER-004 solo en migración) y estado `applicant` o `active`.
3. Para pasar a `active` se crea la primera cuenta en el mismo asistente: domicilio postal, condición IVA (si exige CUIT, se valida RN-PER-008), empresa postal, zona/sector/recorrido de reparto, distrito y sección, grupo contable y conjunto según políticas (RN-PER-052), contactos y factura electrónica (RN-PER-048).
4. La primera cuenta es principal (RN-PER-029). Se crea nota de sistema "Nueva cuenta" (RN-PER-043).
5. Outbox: `per.holder.created`, `per.account.created`. M04 puede generar cargos de alta (RN-PER-126); M02 puede crear altas automáticas (RN-PER-125); M17 puede iniciar asociación si la política lo indica (RN-PER-038).

### 9.3 Validación de domicilio y geocodificación (BASE §77; CU-GEO-01)

1. El editor de domicilio (PAN-PER-06) usa el catálogo de T04 (localidad → calles → barrio) y sugerencias del proveedor (PRM-PER-101).
2. Al guardar se calcula `normalizedText` y queda `geo.status = pending`; JOB-PER-02 busca candidato y lo deja en `candidate` o `unavailable`.
3. El operador (o el socio en su solicitud) confirma en el mapa; la corrección manual exige motivo (RN-PER-068).
4. Si la calle no existe en el catálogo, se conserva el texto y puede solicitarse el alta de la calle a T04 (validando el permiso, V2 2309, PRM-PER-090); nunca se elige una calle homónima (RN-PER-069).
5. Cada cambio deja un `addressGeoEvents`.

### 9.4 Alta y uso de inmueble y punto de prestación (RF-PER-086..098)

1. Alta de inmueble: domicilio, nomenclatura de seis partes normalizada (RN-PER-072), partida, frentes, superficies, coeficientes, unidades funcionales; se verifica unicidad de la nomenclatura activa (RN-PER-073).
2. Al crear un contrato, M02 pide a PER un punto de prestación: se reutiliza uno existente en la misma dirección o se crea uno nuevo; se vincula el inmueble si el servicio lo exige (RN-PER-074).
3. Se valida deuda en el domicilio o en el mismo catastro (RN-PER-062): resultado `none`, `warning` (sin revelar detalle a quien no tiene permiso) o `blocking` (solo si la política validada lo indica).

### 9.5 Relaciones, representaciones y autorizaciones (AGR-007; RF-PER-099..108)

1. Se elige el tipo de relación del catálogo (que define categoría, evidencia y alcance por defecto), sujeto, destino, acciones y vigencia.
2. Si el tipo exige verificación, queda `pending` hasta que un supervisor valida la evidencia.
3. Al quedar `active`, T02 recalcula el alcance efectivo del usuario vinculado a esa persona (evento `per.relationship.granted`).
4. Cada operación en nombre de un tercero valida que exista una relación `active` con la acción correspondiente (`API-PER-35`), y deja `onBehalfOf` en la historia.
5. JOB-PER-04 vence relaciones y avisa N días antes (PRM-PER-098).

### 9.6 Bloqueos (RF-PER-124..128)

1. El supervisor aplica un bloqueo con efectos, causa, vigencia y mensajes.
2. Cada módulo consulta `API-PER-41` (o la proyección en caché invalidada por eventos) antes de operar: M07 caja (`cashPayment`), M19/M07 pago web (`webPayment`, `webDebtPublication`), M05 emisión (`billing`), M02 contratación, baja y reconexión (`newContracts`, `cancellation`, `reconnection`), PER (transferencias y cambios de datos).
3. Para `cashPayment` el modo por defecto es "requiere autorización de supervisor" (PA-PER-16).
4. JOB-PER-04 vence bloqueos con `validTo`.

### 9.7 Cambio de titularidad (BASE §4; CU-TIT-01; RF-PER-132..141)

1. Atención inicia el asistente (PAN-PER-14) con origen (titular, cuenta, contratos) y destino (titular existente o nuevo con búsqueda de coincidencias).
2. Selección de ítems y opciones explícitas: fecha efectiva, mantener fecha original, conservar capital (M17), cerrar titular de origen, cuenta destino principal (V2 3195, PRM-PER-084), modo de adherentes (PRM-SOC-012 de M18; antes PRM-PER-072, HUECO-TRV-01), cobrar cargos de transferencia (PRM-PER-080).
3. Simulación (`API-PER-47`): deuda de origen informativa (consultada a M07), cargos a generar (M04), cambio de IIBB (RN-PER-046), impacto en débito automático (M07), adherentes, grupos de facturación, bloqueos `transfer`, relaciones en otras cuentas (RN-PER-035), documentación exigida (requisitos con evento `transfer` o `succession`).
4. Validaciones: deuda (PRM-PER-075), destino de baja (PRM-PER-076), contratos de baja (PRM-PER-079), bloqueos `transfer`.
5. Aprobación por workflow T11 si el tipo lo exige (PRM-PER-081).
6. Ejecución idempotente (JOB-PER-07): para cada contrato, comando a M02 "cerrar por transferencia" y "crear contrato en cuenta destino con fecha efectiva" (clonado, PA-PER-07); M05 reasigna grupo de facturación en la cuenta destino; M07 traslada mandatos de débito solo si el destino lo acepta; M17 transfiere capital si se pidió; M18 trata los adherentes según PRM-SOC-012 al consumir `cat.contract.transferred` (HUECO-TRV-01; antes "PER mueve adherentes según modo") y PER registra historia de ambos titulares.
7. La deuda anterior queda en el titular de origen (RN-PER-101). Si el nuevo titular asume la deuda, se deriva a M08 un convenio con su consentimiento.
8. Se emite constancia (T11) y outbox `per.transfer.executed`, `per.ownership.changed`.
9. Si un paso falla, se compensan los pasos hechos y la operación queda `failed` con tarea.

### 9.8 Mudanza o traslado (CU-04)

1. El titular conserva cuenta y deuda; se crea un nuevo punto de prestación (o se reutiliza) y M02 da de baja el contrato del punto anterior y alta en el nuevo, o M10 ejecuta un traslado técnico por OT.
2. Al cerrar la OT (`tec.workOrder.closed` con nuevo domicilio), PER actualiza el punto y, si la OT lo indica, el domicilio de las personas adherentes (RN-PER-064). Publica `per.servicePoint.relocated`.
3. La copia del domicilio de la cuenta a los contratos solo ocurre por acción explícita (RN-PER-063).

### 9.9 Fallecimiento (RF-PER-009; PA-PER-08)

1. Supervisor registra fecha y evidencia (certificado en T11).
2. PER publica `per.person.deceased` y M18 da de baja las adhesiones y beneficios de la persona con causa `death` (RN-SOC-011; HUECO-TRV-01; antes los daba de baja PER, incluida la adhesión completa del contrato si era su único adherente); PER revoca relaciones donde es sujeto o representado.
3. Si es titular, crea tareas en M09: baja del titular o sucesión (transferencia tipo `succession`), cambio de garante en cuentas donde es garante.
4. No corta servicios ni cambia deuda. Publica `per.person.deceased`.

### 9.10 Detección de duplicados y fusión (RF-PER-155..158)

1. JOB-PER-03 recorre personas modificadas desde la última corrida y crea casos con puntaje.
2. El operador resuelve: `dismissed` o `confirmedSame`.
3. Para fusionar, elige valores por campo (sobreviviente), solicita; otro usuario aprueba (PRM-PER-082).
4. JOB-PER-08 publica `per.person.mergeRequested`; cada módulo reasigna sus referencias y confirma; PER registra cada referencia reasignada para poder revertir dentro del plazo (PRM-PER-099).
5. Nunca se fusiona por coincidencia de DNI o correo sin esta acción autorizada.

### 9.11 Vinculación usuario–persona (REG-001; DEC-043)

1. Un usuario registrado en T02 (sin acceso a cuentas) pide vincularse desde el portal (PAN-PER-26).
2. Elige método: código impreso en la factura + número de documento; o número de cuenta + documento + código enviado al contacto registrado en la cuenta; o validación presencial. El código al contacto lo genera y envía M01 al correo o celular **verificado** del titular (RF-PER-173, API-PER-76) a pedido de M19 (RF-POR-179); M19 solo muestra el contacto enmascarado.
3. Superada la prueba, `personUserLinks.status = verified`; T02 recalcula cuentas visibles. Intentos limitados y auditados.
4. Si no hay persona, el usuario puede iniciar una solicitud de alta (M09) con datos mínimos (PA-PER-11).

### 9.12 Jobs

| JOB-ID | Nombre BullMQ | Disparador | Qué hace | Idempotencia | Reintentos | Lock |
|---|---|---|---|---|---|---|
| JOB-PER-01 | `per:verificar-cuit-arca` | Alta/cambio de CUIT/CUIL; manual | Consulta el padrón de ARCA, guarda constancia y resultado (`arcaVerified`, `arcaMismatch`, `arcaNotFound`); publica `per.taxId.verified` o `per.taxId.mismatch`. | Por `identifierId` + hash del número | 5 con backoff exponencial; luego `pending` y aviso | Por persona |
| JOB-PER-02 | `per:geocodificar-domicilios` | Alta/cambio de domicilio | Reacción: pide la geocodificación a T04 por API y aplica el resultado al recibir EVT-CFG-15 `cfg.geoReference.updated`; no llama al proveedor ni administra cuotas. Ver JOB-CFG-09 (dueño). | Por `addressId` + versión | 3; con cuota agotada reprograma al día siguiente | Por domicilio |
| JOB-PER-03 | `per:detectar-duplicados` | Diario 02:00 (hora del tenant); al importar | Calcula pares candidatos sobre personas cambiadas; crea o actualiza `duplicateCases`. Las personas `documentPending` se comparan solo por nombre fonético y domicilio y generan aviso, no caso (RN-PER-136, DEC-099). | Por par ordenado | 3 | Por tenant |
| JOB-PER-04 | `per:vencimientos` | Diario 01:00 | Vence documentación, relaciones y bloqueos; ejecuta acciones de vencimiento; avisa por vencer (PRM-PER-098). | Por entidad + fecha de proceso | 3 | Por tenant |
| JOB-PER-05 | `per:mayoria-edad-adherentes` | — (antes: Diario) | **Reemplazado por JOB-SOC-01** (M18, dueño único; no se ejecuta). Texto original: lista adherentes que cumplen la edad (PRM-PER-067) y envía el aviso por T09 (PRM-PER-066). M01 solo muestra el dato. | Por adherente + año | 3 | Por tenant |
| JOB-PER-06 | `per:adherentes-condicion` | — (antes: Manual o programado por el administrador) | **Reemplazado por JOB-SOC-02** (M18, dueño único; no se ejecuta; HUECO-TRV-01). Texto original: evalúa condición de adherentes contra categoría (RN-PER-083) y da de baja o cambia categoría en lote con simulación previa. | Por lote | 1 (con informe de errores) | Por tenant |
| JOB-PER-07 | `per:ejecutar-transferencia` | Transferencia aprobada | Ejecuta los pasos con comandos a M02/M05/M07/M17; compensa si falla. | `Idempotency-Key` de la transferencia; cada paso registrado | 3 por paso | Por titular de origen y destino |
| JOB-PER-08 | `per:fusionar-personas` | Fusión aprobada | Reasigna referencias propias, publica evento y espera confirmaciones; habilita reversión. | Por `duplicateCaseId` | 5 | Por ambas personas |
| JOB-PER-09 | `per:importar` | Importación confirmada (ExcelImportWizard) | Importa personas, titulares, cuentas, inmuebles, marcas de facturación (RN-PER-051) con validación por fila. Los adherentes se importan en M18 (RF-SOC-149; HUECO-TRV-01; antes este job los incluía). | Por archivo + fila | 1 por fila; informe | Por tenant y tipo |
| JOB-PER-10 | `per:revalidar-padron-arca` | — | **Retirado.** T04 guarda el padrón, T06 lo descarga y M06 revalida la condición; M01 muestra las diferencias al recibir EVT-FIS-19 `fis.padron.differenceDetected` (RF-PER-029). Ver JOB-CFG-08 y JOB-FIS-19 (dueños). | — | — | — |
| JOB-PER-11 | `per:anonimizar` | Solicitud de supresión resuelta; plazo de conservación cumplido | Anonimiza campos no obligatorios de personas archivadas conservando lo fiscal exigido. | Por persona | 3 | Por persona |
| JOB-PER-12 | `per:exportar-padron` | Pedido de exportación | Genera el padrón con columnas y filtros elegidos (RF-PER-148) y lo deja en T11 con vencimiento. | Por pedido | 2 | — |

### 9.13 Alta asistida desde un maestro de rol (RF-PER-174, RN-PER-135; DEC-097)

1. En M12 (proveedor), M11 (vendedor), M18 (chofer, profesional de salud) o M16 (empleado), la acción "nuevo" abre PAN-PER-04 embebido en modo búsqueda, con el rol y el módulo como contexto.
2. El operador ingresa CUIT, documento o nombre; `per.findOrCreatePerson` aplica el motor de 9.1 (pasos 2 y 3) y muestra candidatos con datos mínimos.
3. Si elige una persona existente, se verifica que no tenga ya una ficha de ese rol (RN-PER-135) y se devuelve su `personId`. Para los roles que dependen de una entidad jurídica o empleador (empleado de M16), la verificación es por persona, rol y entidad: un legajo vigente con otra empresa empleadora no impide el alta (DEC-097). *Reemplazado (10-11-2026, DEC-097): sin la frase sobre roles por entidad.*
4. Si declara "es otra persona" o no hay candidatos, se completa el alta con las validaciones de 9.1 paso 4 (para proveedores la política suele exigir CUIT y condición IVA, RN-PER-008) y se guarda como en 9.1 paso 5.
5. El módulo dueño del rol crea su ficha con el `personId` y solo los datos del rol; la identidad la muestra con `per.getPersonIdentity` y se refresca con `per.person.updated` (EVT-PER-02) y `per.person.merged` (EVT-PER-06).
6. La ficha de la persona en M01 muestra el nuevo rol con enlace (RF-PER-015).

### 9.14 Regularización de personas con documento pendiente (RF-PER-175, RN-PER-136; DEC-099)

1. T07 crea la persona sin identificación con `identificationStatus = documentPending`, la incluye en el informe de migración y M01 pide a M09 una tarea de regularización por persona (o por lote, según el tenant): invoca `crm.openCase` con el tipo de sistema `identityDocumentRegularization` (M09 RF-CRM-261) e `idempotencyKey = per.documentPending:<personId>`, y guarda el `caseId` devuelto en `identificationRegularization.taskId`.
2. JOB-PER-03 compara estas personas solo por nombre fonético y domicilio y deja avisos, sin abrir casos de fusión.
3. El operador carga el documento desde la bandeja (PAN-PER-03, filtro "documento pendiente") o desde la ficha; se valida dígito y unicidad (RN-PER-005, RN-PER-007).
4. Si el documento ya pertenece a otra persona, se abre un caso en `duplicateCases` y se sigue 9.10.
5. Con el documento guardado, la persona pasa a `identified`, se cierra la tarea y se publica `per.person.identificationRegularized` (EVT-PER-27).
6. Mientras siga `documentPending`, M05 no le emite comprobantes que exijan documento del receptor (dato leído de `per.getHolderSnapshot`).

## 10. Pantallas

Todas usan `AdminShell`, `AdminStickyHeader` con acciones primarias a la derecha, `ScreenHelp` con clave `dict:per.help.<pantalla>`, `DataTable` con filtros persistentes, exportación y selección de columnas, modales según tamaño estándar y errores en línea. Las altas cortas van en modal; las fichas son páginas.

### 10.1 Mapa de pantallas

| PAN-ID | Nombre | Ruta | Tipo | Capability | Reemplaza (ProCoop) |
|---|---|---|---|---|---|
| PAN-PER-01 | Búsqueda de titulares y cuentas | `/admin/per/titulares` | Lista | `per.titulares.ver` | `frmTitulares` (búsqueda), `GridControl_Socios`, `BuscadorInfoSocio`, `frmSeleccionar_InfoSocios` |
| PAN-PER-02 | Ficha 360 del titular | `/admin/per/titulares/:holderId` | Ficha con pestañas | `per.titulares.ver` | `frmTitulares` (ficha), `abm_Socios`, `frmCuentaCorriente` (pestaña de lectura de M07) |
| PAN-PER-03 | Personas | `/admin/per/personas` y `/:personId` | Lista + ficha | `per.personas.ver` | `abm_Personas` (Configuración) |
| PAN-PER-04 | Alta y edición de persona | Modal `lg` | Formulario | `per.personas.crear` / `per.personas.editar` | `abm_Personas`, `frmEscanerCodigoDNI` |
| PAN-PER-05 | Cuenta | `/admin/per/cuentas/:accountId` | Ficha | `per.cuentas.ver` | `abm_SumSoc`, `frmNoFacturarServicios` (marca cuenta) |
| PAN-PER-06 | Editor de domicilio con mapa | Componente + modal `lg` | Formulario | capability de edición de la entidad dueña del domicilio (p. ej. `per.personas.editar`, `per.inmuebles.editar`; antes: «según entidad») | `DatosDomicilio`, `txtCalles` |
| PAN-PER-07 | Inmuebles | `/admin/per/inmuebles` y `/:premiseId` | Lista + ficha | `per.inmuebles.ver` | `abm_Propieda`, `frmSeleccionarInmueble` |
| PAN-PER-08 | Puntos de prestación | `/admin/per/puntos` y `/:servicePointId` | Lista + ficha | `per.puntosPrestacion.ver` | — (nuevo) |
| PAN-PER-09 | Relaciones y representaciones | Pestaña de ficha + modal `md` | Lista + formulario | `per.relaciones.ver` / `per.relaciones.crear` | `abm_Vinculos` (tipos), garante de `abm_Socios`/`abm_SumSoc` |
| PAN-PER-10 | Adherentes y beneficiarios | Pestaña del contrato en ficha, **solo lectura** con enlace a PAN-SOC-01 de M18 (HUECO-TRV-01; antes "+ modal `md`") | Lista (datos de API-SOC-001 y API-SOC-005); el alta, la baja y la edición se hacen en PAN-SOC-01 (antes "Lista + formulario") | `soc.adherentes.ver` (antes `per.adherentes.ver` / `per.adherentes.crear` / `per.adherentes.editar` / `per.adherentes.baja`) | `abm_adhsoc`, `frmBajaAdherentesCondicion` |
| PAN-PER-11 | Notas | Pestaña + modal `md` | Lista + formulario | `per.notas.ver` / `per.notas.crear` | `frmNota_Sum` |
| PAN-PER-12 | Bloqueos | Pestaña + modal `md` | Lista + formulario | `per.bloqueos.ver` / `per.bloqueos.aplicar` / `per.bloqueos.levantar` | `frmNota_Sum` (BLO_CAJ/MSG_CAJ), `frmNoFacturarServicios` |
| PAN-PER-13 | Documentación y requisitos | Pestaña + `/admin/per/documentacion` | Lista + bandeja | `per.documentacion.ver` / `per.documentacion.registrar` / `per.documentacion.validar` | `frmPTramites`, `frmTramite`, `abm_Tramites` |
| PAN-PER-14 | Asistente de transferencia | `/admin/per/transferencias/nueva` | Asistente de pasos | `per.transferencias.crear` | `frmTranferenciaCuenta`, `frmTranferenciaServicio`, `frmTransferenciasCuenta`, `frmTramiteCambioSevicio` (parte titularidad) |
| PAN-PER-15 | Transferencias | `/admin/per/transferencias` y `/:transferId` | Lista + detalle | `per.transferencias.ver` | `frmReimpresionTrans` |
| PAN-PER-16 | Registrar fallecimiento | Modal `md` | Formulario | `per.personas.registrarFallecimiento` | `frmTitular_Fallecimiento` |
| PAN-PER-17 | Baja y reactivación de titular | Modal `md` | Formulario | `per.titulares.baja` / `per.titulares.reactivar` | `abm_Socios.DarDeBaja`, `abmCausas` (catálogo), `frmMods_Especiales.btnRecuperar` |
| PAN-PER-18 | Duplicados y fusión | `/admin/per/duplicados` | Bandeja + comparador | `per.duplicados.ver` / `per.duplicados.resolver`, `per.personas.unificar` (antes `per.personas.fusionar`) | — (reemplaza `UnificarEntidades` para personas) |
| PAN-PER-19 | Historial | Pestaña "Historia" + modal `xl` comparador | Línea de tiempo | `per.historial.ver` | `frmConsultaHistoriales`, `frmHistorial_SerSum` (parte PER) |
| PAN-PER-20 | Padrón de titulares | `/admin/per/padron` | Informe parametrizable | `per.padron.ver` / `per.padron.exportar` | `frmPadronTitulares`, `frmPadronTitulares_Columnas`, `frmPadronTitulares_Filtros`, `Filtros_Padron`, `Fecha_Padron` |
| PAN-PER-21 | Operaciones especiales | `/admin/per/operaciones-especiales` | Formulario con aprobación | `per.operacionesEspeciales.ejecutar` | `frmMods_Especiales`, `frmCambioCuenta`, `frmEliminarCuenta` (descartado como borrado) |
| PAN-PER-22 | Configuración del módulo | `/admin/per/configuracion` | Formularios por grupo | `per.configuracion.configurar` | Opciones V2 de titulares; `abm_Document`, `abm_Ocupacio`, `abm_Profesio`, `abm_Vinculos`, `abmCausas`, `amb_DistritoSeccion`, `abm_Postales`, `abm_Zonas` (reparto) |
| PAN-PER-23 | Privacidad y derechos | `/admin/per/privacidad` | Bandeja + ficha | `per.privacidad.gestionar` | — (nuevo) |
| PAN-PER-24 | Importación | `/admin/per/importar` | ExcelImportWizard | `per.importaciones.crear` | `frm_ConceptosMasivos` (no), importaciones de marcas de facturación |
| PAN-PER-25 | PWA "Mis datos" | `/app/mis-datos` | Pantalla PWA | `per.me.ver` / `per.me.editarContactos` | CoopOnline datos del socio |
| PAN-PER-26 | PWA "Vincular cuenta" | `/app/vincular` | Flujo PWA | `per.me.vincular` | Clave web (descartada) |
| PAN-PER-27 | PWA "Autorizados y representantes" | `/app/autorizados` | Pantalla PWA | `per.me.autorizados.gestionar` | — (nuevo) |
| PAN-PER-28 | Mapa de domicilios y puntos | `/admin/per/mapa` | Mapa con capas | `per.puntosPrestacion.ver` | Sin equivalente (GIS en M10) |

### 10.2 PAN-PER-01 — Búsqueda de titulares y cuentas

- **Filtros:** texto libre (nombre, razón social, número de titular, número de cuenta, documento, CUIT, correo, teléfono, domicilio, nomenclatura catastral, matrícula de contrato vía M02 con búsqueda exacta o parcial según PRM-PER-087), estado (por defecto solo activos, PRM-PER-085), condición de asociado (de M17; con varias entidades jurídicas, por entidad, DEC-096), localidad, barrio, zona/sector/recorrido, distrito/sección, servicio, con bloqueos, con documentación vencida.
- **Columnas:** número de titular, nombre, documento principal (enmascarado sin `per.personas.ver`), cuenta principal, domicilio postal, estado, asociado (sí/no), contratos activos, saldo (de M07, solo con permiso), indicadores (bloqueo, juicio, presupuestos pendientes, documentación vencida, nota destacada PRM-PER-086).
- **Acciones:** alta de titular (modal), abrir ficha, exportar (permiso), vista simple/completa (PRM-PER-088).
- **Estados:** vacío con CTA "Buscar"; sin resultados con sugerencia "buscar por documento"; carga con skeleton; error con reintento.
- **Teclado:** foco inicial en búsqueda; Enter abre el primero; atajo para alta.

### 10.3 PAN-PER-02 — Ficha 360 del titular

Encabezado fijo: nombre, número de titular, documento y CUIT con estado de verificación, condición de asociado (M17; con varias entidades jurídicas, un chip por membresía con el código de la entidad, DEC-096), estado, chips de alertas (bloqueos activos con efectos, juicio, fallecido, documentación vencida, presupuestos pendientes, sin contacto verificado). Acciones: editar, nueva cuenta, nueva nota, aplicar bloqueo, transferir, registrar fallecimiento, dar de baja/reactivar, más (operaciones especiales).

Pestañas (cada una carga bajo demanda y respeta permisos; si falta permiso la pestaña no aparece):

| Pestaña | Contenido | Fuente |
|---|---|---|
| Resumen | Datos de persona, contactos con verificación, domicilios por rol, roles en el tenant, últimas novedades. | PER |
| Cuentas y contratos | Árbol cuenta → grupo de facturación → contrato (servicio, conexión, estado, categoría, punto, inmueble); cuenta principal destacada; acciones por contrato que abren M02. | PER + M02 + M05 |
| Inmuebles y puntos | Inmuebles relacionados y puntos con mapa. | PER |
| Relaciones | Garantes, representantes, autorizados, responsables de pago, familiares; vigencias y alcance. | PER |
| Adherentes | Por contrato; filtro de fallecidos (PRM-PER-069). | PER |
| Cuenta corriente | Saldo, comprobantes, pagos, planes (solo lectura). | M07/M08 |
| Facturas | Comprobantes emitidos (solo lectura y reimpresión). | M05 |
| Consumos | Lecturas y consumos por contrato. | M03 |
| Reclamos y OT | Tickets y órdenes. | M09/M10 |
| Trámites y documentación | Requisitos, presentados, vencidos. | PER + M09 |
| Notas y bloqueos | Notas con versiones; bloqueos activos e históricos. | PER |
| Comunicaciones | Mensajes enviados y preferencias. | T09 |
| Asociado y capital | Un bloque por cada membresía de la persona, **una por entidad jurídica** (DEC-096; resumen institucional de M17 RF-INS-015): entidad, número, estado, antigüedad, capital, acciones (solo lectura); solo las entidades del alcance del usuario. *Reemplazado (10-11-2026, DEC-096): "Número, estado, capital, acciones (solo lectura)."* | M17 |
| Adjuntos | Documentos por entidad. | T11 |
| Historia | Línea de tiempo bitemporal con filtro por entidad y fecha. | PER |

### 10.4 PAN-PER-04 — Alta y edición de persona

Modal `lg` con secciones: tipo de persona; identificación (con validación de dígito en línea y botón "Verificar en ARCA" si tiene permiso); datos personales o de organización; contactos (lista editable con verificación); domicilios por rol (PAN-PER-06); datos laborales; datos extra (grupos de T04); consentimientos. Panel lateral de coincidencias en tiempo real. Botón "Leer DNI" (PRM-PER-089).

**Modo búsqueda embebido (DEC-097, RF-PER-174):** abierto desde la acción "nuevo" de un maestro de rol (M11 vendedores, M12 proveedores, M16 empleados, M18 choferes y profesionales de salud), el modal empieza por un buscador (CUIT, documento o nombre) con la lista de candidatos y las acciones "Usar esta persona" y "Es otra persona" (con motivo); recién después muestra el formulario de alta. El título indica el rol (`dict:per.assistedCreate.title.<role>`) y al confirmar devuelve el `personId` al módulo que lo abrió. Si la persona ya tiene ficha de ese rol (y, para empleados, con la misma empresa empleadora), avisa y ofrece abrirla (RN-PER-135).

**Documento pendiente (DEC-099, RF-PER-175):** una persona `documentPending` muestra el chip `dict:per.identificationStatus.documentPending` en la sección de identificación y la acción "Regularizar documento"; PAN-PER-03 agrega el filtro "documento pendiente".

### 10.5 PAN-PER-05 — Cuenta

Encabezado: número de cuenta, titular, principal, estado, alertas. Secciones: domicilio postal y destinatario; entrega de facturas (electrónica, canales, sin papel con confirmación si el servicio lo exige); empresa postal y reparto (zona, sector, recorrido); fiscal (condición IVA, IIBB con datos de M06); distrito y sección; grupo contable; conjunto; marcas de facturación (excluir redondeo, no cobrar recargo con aprobación); contactos propios; débito automático (lectura de M07); grupos de facturación y contratos (árbol); datos extra; historia.

### 10.6 PAN-PER-06 — Editor de domicilio

Campos en cascada: país, provincia, departamento, localidad (código postal propuesto), calle con autocompletado (catálogo T04 + proveedor), número o "sin número", piso, departamento, torre, manzana, barrio, entrecalles, referencias; alternativa rural (ruta, km, paraje, lote). Mapa con marcador arrastrable, precisión y estado; botón "Confirmar ubicación" (permiso) y "Marcar para revisión". Si el proveedor no responde, aviso no bloqueante y guardado con `pending`.

### 10.7 PAN-PER-07 — Inmuebles

Lista con filtros por nomenclatura (con etiquetas configuradas, PRM-PER-057), partida, domicilio, uso, estado. Ficha: domicilio, domicilio postal del propietario, catastro (seis partes + extras), construcción, superficies, frentes (hasta 4, con ancho de calle y zona), bocacalle, coeficientes, metros de alumbrado y cloaca, unidades funcionales, ítems, personas relacionadas (propietario, ocupantes), contratos en el inmueble (de M02), atributos heredados (solo lectura), notas, adjuntos, historia.

### 10.8 PAN-PER-14 — Asistente de transferencia

Pasos: 1) Tipo (cuenta, cambio de titularidad de contratos, sucesión, cambio de responsable de pago, traslado); 2) Origen y elementos (selección de cuenta y contratos con estado); 3) Destino (buscar titular o crear nuevo con PAN-PER-04 embebido; cuenta existente o nueva); 4) Opciones (fecha efectiva, mantener fecha, capital, cerrar origen, cuenta principal, adherentes, cargos); 5) Simulación (resultado con advertencias y bloqueos, deuda de origen informativa, documentación exigida y carga de adjuntos); 6) Confirmación (envío a aprobación o ejecución). La pantalla de detalle (PAN-PER-15) muestra pasos de ejecución, constancia y botón "Revertir" con permiso.

### 10.9 PAN-PER-20 — Padrón de titulares

Selección de columnas (catálogo de columnas de persona, titular, cuenta, domicilio, asociado de M17, contratos de M02, saldo de M07 con permiso), filtros (estado, asociado, servicio, localidad, zona, fecha de corte "a la fecha" bitemporal), vista previa paginada, guardado de plantillas de padrón y exportación asíncrona (JOB-PER-12). Las credenciales de asociado (`frmPadronTitulares_Credenciales`, `frmCredencialAsociado`) son de M17.

### 10.10 PAN-PER-25 a 27 — PWA (socio)

- **Mis datos:** tarjetas con anatomía fija (título, dato principal, estado, acción): identidad (solo lectura), contactos (editar con verificación por código, PRM-PER-029/030), domicilio postal (cambio como solicitud a M09 si la política lo exige), preferencias de comunicación, consentimientos, "Descargar mis datos" (solicitud de acceso). Alta de contacto desde FAB en modal; tres tarjetas skeleton al cargar; errores en línea; edición sin conexión guardada en IndexedDB con `clientMutationId` y sincronizada al volver.
- **Vincular cuenta:** pasos del método configurado (DEC-043); mensajes de intento restante; sin revelar si el documento existe.
- **Autorizados y representantes:** lista de relaciones donde el usuario es titular (puede otorgar y revocar autorizaciones `view`/`pay` según PA-PER-12) y donde es autorizado (puede renunciar).

### 10.11 Ubicación en el menú (`siteMapGroups`)

Grupo "Socios y cuentas": Titulares (PAN-PER-01), Personas (PAN-PER-03), Inmuebles (PAN-PER-07), Puntos de prestación (PAN-PER-08), Mapa (PAN-PER-28), Transferencias (PAN-PER-15), Documentación (PAN-PER-13), Duplicados (PAN-PER-18), Padrón (PAN-PER-20). Grupo "Configuración > Socios y cuentas": PAN-PER-22, PAN-PER-24, PAN-PER-21. Grupo "Cumplimiento": PAN-PER-23.

## 11. API

> **Nota de rutas:** Rutas normalizadas el 05-11-2026 a la convención de la maestra (§8 y §13: endpoints en inglés; backoffice bajo `/api/admin/per/`, portal bajo `/api/per/me`). Cada fila conserva su ruta anterior en la descripción.

Convenciones: `tenantId` del token (nunca del cuerpo); validación Zod; listas `{ items, total, page, size }`; errores RFC 9457 con `type` `/problems/per/<codigo>` (DEC-090; antes `https://goodapps.ar/errors/per/<codigo>`); `If-Match` con `version` en PATCH; `Idempotency-Key` obligatorio donde se indica. Los datos sensibles y los números de documento se devuelven enmascarados salvo permiso.

### 11.1 Backoffice

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-PER-01 | GET | `/api/admin/per/persons` | `per.personas.ver` | Lista y búsqueda de personas. Ruta anterior: `/api/per/personas` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-02 | POST | `/api/admin/per/persons` | `per.personas.crear` | Alta de persona (exige `duplicateCheckToken` de API-PER-03). Ruta anterior: `/api/per/personas` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-03 | POST | `/api/admin/per/persons/matches` | `per.personas.crear` | Devuelve candidatos con puntaje y token de control. Ruta anterior: `/api/per/personas/coincidencias` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-04 | GET | `/api/admin/per/persons/:personId` | `per.personas.ver` | Detalle de persona. Ruta anterior: `/api/per/personas/:personId` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-05 | PATCH | `/api/admin/per/persons/:personId` | `per.personas.editar` | Modificación con fecha efectiva opcional y motivo. Ruta anterior: `/api/per/personas/:personId` (convención de rutas en inglés, maestra §13). | Sí (`If-Match`) |
| API-PER-06 | POST | `/api/admin/per/persons/:personId/identifiers` | `per.personas.editar` | Agrega o reemplaza identificación. Ruta anterior: `/api/per/personas/:personId/identificaciones` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-07 | POST | `/api/admin/per/persons/:personId/identifiers/:identifierId/verifications` | `per.identificaciones.verificar` | Verificación ARCA (asíncrona, devuelve `202` con estado) o manual con evidencia. Ruta anterior: `/api/per/personas/:personId/identificaciones/:identifierId/verificaciones` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-08 | POST | `/api/admin/per/persons/:personId/contacts/:contactId/verifications` | `per.personas.editar` | Inicia o confirma verificación por código. Ruta anterior: `/api/per/personas/:personId/contactos/:contactId/verificaciones` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-09 | POST | `/api/admin/per/persons/:personId/death` | `per.personas.registrarFallecimiento` | Registra fallecimiento y efectos. Ruta anterior: `/api/per/personas/:personId/fallecimiento` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-10 | POST | `/api/admin/per/persons/:personId/death/reverse` | `per.personas.registrarFallecimiento` | Revierte un fallecimiento con motivo. Ruta anterior: `/api/per/personas/:personId/fallecimiento/reversion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-11 | GET, PUT | `/api/admin/per/persons/:personId/sensitive-data/:category` | `per.personas.datosSensibles.ver` (antes `per.personas.verSensibles`) | Lee o actualiza datos sensibles (auditado). Ruta anterior: `/api/per/personas/:personId/datos-sensibles/:category` (convención de rutas en inglés, maestra §13). | PUT sí |
| API-PER-12 | GET | `/api/admin/per/persons/:personId/roles` | `per.personas.ver` | Roles de la persona en el tenant con enlaces. Ruta anterior: `/api/per/personas/:personId/roles` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-13 | GET | `/api/admin/per/holders` | `per.titulares.ver` | Búsqueda unificada de titulares y cuentas (PAN-PER-01). Ruta anterior: `/api/per/titulares` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-14 | POST | `/api/admin/per/holders` | `per.titulares.crear` | Alta de titular (con primera cuenta opcional en el mismo cuerpo). Ruta anterior: `/api/per/titulares` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-15 | GET | `/api/admin/per/holders/:holderId` | `per.titulares.ver` | Resumen de ficha 360 (datos propios + proyecciones). Ruta anterior: `/api/per/titulares/:holderId` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-16 | PATCH | `/api/admin/per/holders/:holderId` | `per.titulares.editar` | Modificación del titular. Ruta anterior: `/api/per/titulares/:holderId` (convención de rutas en inglés, maestra §13). | Sí (`If-Match`) |
| API-PER-17 | GET | `/api/admin/per/holders/:holderId/closure-check` | `per.titulares.baja` | Lista impedimentos y advertencias para la baja. Ruta anterior: `/api/per/titulares/:holderId/validacion-baja` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-18 | POST | `/api/admin/per/holders/:holderId/close` | `per.titulares.baja` | Baja con causa, fecha efectiva y conserva número. Ruta anterior: `/api/per/titulares/:holderId/baja` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-19 | POST | `/api/admin/per/holders/:holderId/reactivate` | `per.titulares.reactivar` | Reactivación con motivo. Ruta anterior: `/api/per/titulares/:holderId/reactivacion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-20 | GET | `/api/admin/per/accounts` | `per.cuentas.ver` | Lista de cuentas con filtros. Ruta anterior: `/api/per/cuentas` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-21 | POST | `/api/admin/per/holders/:holderId/accounts` | `per.cuentas.crear` | Alta de cuenta. Ruta anterior: `/api/per/titulares/:holderId/cuentas` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-22 | GET | `/api/admin/per/accounts/:accountId` | `per.cuentas.ver` | Detalle de cuenta. Ruta anterior: `/api/per/cuentas/:accountId` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-23 | PATCH | `/api/admin/per/accounts/:accountId` | `per.cuentas.editar` | Modificación de cuenta (con propuesta de copiar domicilio a contratos, RN-PER-063). Ruta anterior: `/api/per/cuentas/:accountId` (convención de rutas en inglés, maestra §13). | Sí (`If-Match`) |
| API-PER-24 | POST | `/api/admin/per/accounts/:accountId/set-principal` | `per.cuentas.editar` | Marca como principal (desmarca la anterior en la misma transacción). Ruta anterior: `/api/per/cuentas/:accountId/principal` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-25 | POST | `/api/admin/per/accounts/:accountId/close` | `per.cuentas.cerrar` | Cierra la cuenta. Ruta anterior: `/api/per/cuentas/:accountId/cierre` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-26 | GET | `/api/admin/per/accounts/:accountId/structure` | `per.cuentas.ver` | Árbol cuenta → grupos → contratos (proyección). Ruta anterior: `/api/per/cuentas/:accountId/estructura` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-27 | POST | `/api/admin/per/addresses` | `per.domicilios.editar` | Crea domicilio normalizado. Ruta anterior: `/api/per/domicilios` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-28 | PATCH | `/api/admin/per/addresses/:addressId` | `per.domicilios.editar` | Modifica domicilio (nueva versión). Ruta anterior: `/api/per/domicilios/:addressId` (convención de rutas en inglés, maestra §13). | Sí (`If-Match`) |
| API-PER-29 | POST | `/api/admin/per/addresses/:addressId/location` | `per.domicilios.confirmarUbicacion` o `per.domicilios.proponerUbicacion` | Confirma, corrige, marca aproximado o para revisión con motivo. Ruta anterior: `/api/per/domicilios/:addressId/ubicacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-30 | GET | `/api/admin/per/addresses/suggestions` | `per.domicilios.editar` | Autocompletado (catálogo T04 + proveedor). Ruta anterior: `/api/per/domicilios/sugerencias` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-31 | GET, POST | `/api/admin/per/premises` | `per.inmuebles.ver` / `per.inmuebles.crear` | Lista y alta de inmuebles. Ruta anterior: `/api/per/inmuebles` (convención de rutas en inglés, maestra §13). | POST sí (`Idempotency-Key`) |
| API-PER-32 | GET, PATCH | `/api/admin/per/premises/:premiseId` | `per.inmuebles.ver` / `per.inmuebles.editar` | Detalle y modificación. Ruta anterior: `/api/per/inmuebles/:premisesId` (convención de rutas en inglés, maestra §13). | PATCH sí (`If-Match`) |
| API-PER-33 | GET, POST, PATCH | `/api/admin/per/service-points[/:servicePointId]` | `per.puntosPrestacion.ver` / `per.puntosPrestacion.editar` (antes `per.puntosPrestacion.*`; comodín solo admitido en plantillas de plataforma, T02) | Lista, alta o reutilización, modificación. Ruta anterior: `/api/per/puntos-prestacion[/:servicePointId]` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-34 | POST | `/api/admin/per/validations/address-debt` | `per.cuentas.crear` | Resultado `none`/`warning`/`blocking` sin detalle de terceros (RN-PER-062). Ruta anterior: `/api/per/validaciones/deuda-domicilio` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-35 | POST | `/api/admin/per/relationships/check-authorization` | `per.relaciones.ver` (también servicio interno de autorización; antes: «interno o `per.relaciones.ver`») | ¿Puede la persona X hacer la acción A sobre el destino D? Devuelve relación habilitante. Ruta anterior: `/api/per/relaciones/autorizacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-36 | GET, POST | `/api/admin/per/relationships` | `per.relaciones.ver` / `per.relaciones.crear` | Lista y alta de relaciones. Ruta anterior: `/api/per/relaciones` (convención de rutas en inglés, maestra §13). | POST sí (`Idempotency-Key`) |
| API-PER-37 | POST | `/api/admin/per/relationships/:relationshipId/{verify,revoke}` | `per.relaciones.verificar` / `per.relaciones.revocar` | Verifica o revoca. Ruta anterior: `/api/per/relaciones/:relationshipId/{verificacion,revocacion}` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-38 | GET, POST, PATCH | `/api/admin/per/adherents[/:adherentId]` | `per.adherentes.ver` / `per.adherentes.editar` (antes `per.adherentes.*`; comodín solo admitido en plantillas de plataforma, T02) | **Reemplazado por API-SOC-001, API-SOC-002 y API-SOC-005** (HUECO-TRV-01; no se expone). Texto original: Lista, alta y modificación. Ruta anterior: `/api/per/adherentes[/:adherentId]` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-39 | POST | `/api/admin/per/adherents/:adherentId/close` | `per.adherentes.baja` | **Reemplazado por API-SOC-003** (HUECO-TRV-01; no se expone). Texto original: Baja con motivo. Ruta anterior: `/api/per/adherentes/:adherentId/baja` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-40 | POST | `/api/admin/per/adherents/condition/{simulate,execute}` | `per.adherentes.baja` | **Reemplazado por API-SOC-004** (HUECO-TRV-01; no se expone). Texto original: Baja o cambio de categoría en lote por condición. Ruta anterior: `/api/per/adherentes/condicion/{simulacion,ejecucion}` (convención de rutas en inglés, maestra §13). | Ejecución sí (`Idempotency-Key`) |
| API-PER-41 | GET | `/api/admin/per/blocks/effective` | `per.bloqueos.ver` (también servicio interno de bloqueos vigentes; antes: «`per.bloqueos.ver` o interno») | Bloqueos activos que afectan un destino y efecto (incluye herencia titular → cuenta → contrato). Ruta anterior: `/api/per/bloqueos/efectivos` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-42 | GET, POST | `/api/admin/per/blocks` | `per.bloqueos.ver` / `per.bloqueos.aplicar` | Lista y aplicación. Ruta anterior: `/api/per/bloqueos` (convención de rutas en inglés, maestra §13). | POST sí (`Idempotency-Key`) |
| API-PER-43 | POST | `/api/admin/per/blocks/:blockId/lift` | `per.bloqueos.levantar` | Levanta con motivo. Ruta anterior: `/api/per/bloqueos/:blockId/levantamiento` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-44 | GET, POST | `/api/admin/per/notes` | `per.notas.ver` / `per.notas.crear` | Lista por destino y alta. Ruta anterior: `/api/per/notas` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-45 | PATCH, DELETE | `/api/admin/per/notes/:noteId` | `per.notas.editar` / `per.notas.eliminar` | Nueva versión o borrado lógico con motivo (no aplica a notas de sistema). Ruta anterior: `/api/per/notas/:noteId` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-46 | GET, POST, PATCH | `/api/admin/per/document-submissions[/:submissionId]` | `per.documentacion.ver` / `per.documentacion.editar` (antes `per.documentacion.*`; comodín solo admitido en plantillas de plataforma, T02) | Requisitos exigibles, presentaciones y validación. Ruta anterior: `/api/per/documentacion[/:submissionId]` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-47 | POST | `/api/admin/per/transfers/simulate` | `per.transferencias.crear` | Simula y devuelve efectos y advertencias. Ruta anterior: `/api/per/transferencias/simulacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-48 | POST | `/api/admin/per/transfers` | `per.transferencias.crear` | Crea borrador o envía a aprobación (con simulación vigente). Ruta anterior: `/api/per/transferencias` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-49 | POST | `/api/admin/per/transfers/:transferId/approve` | `per.transferencias.aprobar` | Aprueba o rechaza. Ruta anterior: `/api/per/transferencias/:transferId/aprobacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-50 | POST | `/api/admin/per/transfers/:transferId/execute` | `per.transferencias.ejecutar` | Encola la ejecución; `202`. Ruta anterior: `/api/per/transferencias/:transferId/ejecucion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-51 | POST | `/api/admin/per/transfers/:transferId/reverse` | `per.transferencias.revertir` | Crea la transferencia inversa. Ruta anterior: `/api/per/transferencias/:transferId/reversion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-52 | GET | `/api/admin/per/transfers[/:transferId]` | `per.transferencias.ver` | Lista y detalle con pasos y constancia. Ruta anterior: `/api/per/transferencias[/:transferId]` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-53 | GET | `/api/admin/per/history/:entityType/:entityId` | `per.historial.ver` | Revisiones; parámetros `asOfValid`, `asOfRecorded`. Ruta anterior: `/api/per/historial/:entityType/:entityId` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-54 | GET | `/api/admin/per/duplicate-cases` | `per.duplicados.ver` | Bandeja de casos. Ruta anterior: `/api/per/duplicados` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-55 | POST | `/api/admin/per/duplicate-cases/:caseId/decision` | `per.duplicados.resolver` | `dismissed` o `confirmedSame` con motivo. Ruta anterior: `/api/per/duplicados/:caseId/decision` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-56 | POST | `/api/admin/per/duplicate-cases/:caseId/merge` | `per.duplicados.resolver` | Solicita fusión con elección por campo. Ruta anterior: `/api/per/duplicados/:caseId/fusion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-57 | POST | `/api/admin/per/duplicate-cases/:caseId/merge/{approve,reverse}` | `per.personas.unificar` (antes `per.personas.fusionar`) | Aprueba (otro usuario) o revierte. Ruta anterior: `/api/per/duplicados/:caseId/fusion/{aprobacion,reversion}` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-58 | POST | `/api/admin/per/roll/exports` | `per.padron.exportar` | Encola exportación (JOB-PER-12). Ruta anterior: `/api/per/padron/exportaciones` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-59 | GET | `/api/admin/per/roll` | `per.padron.ver` | Vista previa paginada con columnas y filtros. Ruta anterior: `/api/per/padron` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-60 | GET, POST, PATCH | `/api/admin/per/privacy/requests[/:requestId]` | `per.privacidad.gestionar` | Solicitudes de derechos. Ruta anterior: `/api/per/privacidad/solicitudes[/:requestId]` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-61 | POST | `/api/admin/per/persons/:personId/anonymize` | `per.personas.anonimizar` | Anonimiza (encola JOB-PER-11). Ruta anterior: `/api/per/personas/:personId/anonimizacion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-62 | GET, POST | `/api/admin/per/user-links[/:linkId/{verify,revoke}]` | `per.vinculosUsuario.ver` / `per.vinculosUsuario.editar` (antes `per.vinculosUsuario.*`; comodín solo admitido en plantillas de plataforma, T02) | Gestión de vínculos usuario–persona desde backoffice. Ruta anterior: `/api/per/vinculos-usuario[/:linkId/{verificacion,revocacion}]` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-63 | POST | `/api/admin/per/imports` | `per.importaciones.crear` | Valida y encola importación (JOB-PER-09). Ruta anterior: `/api/per/importaciones` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-64 | POST | `/api/admin/per/special-operations` | `per.operacionesEspeciales.ejecutar` (+ `per.titulares.renumerar`) | Renumeración y correcciones especiales con aprobación. Ruta anterior: `/api/per/operaciones-especiales` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |

### 11.2 Administración del tenant

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-PER-65 | GET, PUT | `/api/admin/per/settings` | `per.configuracion.configurar` | Parámetros del módulo (sección 14). Ruta anterior: `/api/admin/per/configuracion` (convención de rutas en inglés, maestra §13). | PUT sí |
| API-PER-66 | GET, POST, PATCH | `/api/admin/per/document-requirement-types[/:id]` | `per.documentacion.configurar` | Tipos de requisito documental y acciones. Ruta anterior: `/api/admin/per/requisitos[/:id]` (convención de rutas en inglés, maestra §13). | POST sí |
| API-PER-67 | GET, POST, PATCH | `/api/admin/per/catalogs/:catalogKey[/:id]` | `per.configuracion.configurar` | Catálogos del módulo (7.18) sobre el motor de T04. Ruta anterior: `/api/admin/per/catalogos/:catalogKey[/:id]` (convención de rutas en inglés, maestra §13). | POST sí |

### 11.3 Portal del socio (PWA)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-PER-68 | GET | `/api/per/me` | `per.me.ver` | Personas vinculadas, titularidades y cuentas visibles con relación aplicable. | Sí |
| API-PER-69 | PATCH | `/api/per/me/contacts` | `per.me.editarContactos` | Alta y cambio de contactos (fuente `portal`), con verificación; acepta `clientMutationId`. Ruta anterior: `/api/per/me/contactos` (convención de rutas en inglés, maestra §13). | Sí (`clientMutationId`) |
| API-PER-70 | POST | `/api/per/me/links` y `/api/per/me/links/:linkId/verify` | `per.me.vincular` | Solicita y verifica vínculo con una persona (intentos limitados). Ruta anterior: `/api/per/me/vinculos` y `/api/per/me/vinculos/:linkId/verificacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-71 | GET, POST, DELETE | `/api/per/me/authorized-persons[/:relationshipId]` | `per.me.autorizados.gestionar` | Otorga, lista y revoca autorizaciones que el titular concede. Ruta anterior: `/api/per/me/autorizados[/:relationshipId]` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-72 | POST | `/api/per/me/data-subject-requests` | `per.me.ver` | Solicitud de acceso, rectificación o supresión. Ruta anterior: `/api/per/me/solicitudes-derechos` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key`) |
| API-PER-73 | GET, PUT | `/api/per/me/preferences` | `per.me.editarContactos` | Preferencias y consentimientos. Ruta anterior: `/api/per/me/preferencias` (convención de rutas en inglés, maestra §13). | PUT sí |
| API-PER-76 | POST | `/api/per/me/links/contact-code` y `/api/per/me/links/contact-code/:attemptId/verify` | `per.me.vincular` | Envía el código de un solo uso al contacto verificado del titular de la cuenta o suministro indicado y lo verifica (RF-PER-173, DEC-043). Devuelve solo el contacto enmascarado; respuesta genérica si no hay cuenta o contacto verificado. Consumida por M19 (RF-POR-179). Ruta anterior: `/api/per/me/vinculos/codigo-contacto` y `/api/per/me/vinculos/codigo-contacto/:attemptId/verificacion` (convención de rutas en inglés, maestra §13). | Sí (`Idempotency-Key` en el envío) |

### 11.4 Externa (`/api/v1/ext`)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-PER-74 | GET | `/api/v1/ext/per/accounts/:accountNumber/summary` | `per.cuentas.ver` (credencial de integración, marca X; antes `ext.per.cuentas.ver`) | Titular (nombre y documento enmascarado), estado y bloqueos de pago para pasarelas y recaudadoras. Ruta anterior: `/api/v1/ext/per/cuentas/:accountNumber/resumen` (convención de rutas en inglés, maestra §13). | Sí |
| API-PER-75 | GET | `/api/v1/ext/per/holders` | `per.titulares.ver` (marca X; antes `ext.per.titulares.ver`) | Consulta para integraciones autorizadas (por ejemplo, organismos con convenio) con campos mínimos y auditoría. Ruta anterior: `/api/v1/ext/per/titulares` (convención de rutas en inglés, maestra §13). | Sí |

### 11.5 Interfaz interna para otros módulos

Los módulos del monolito consumen servicios de aplicación de PER (no HTTP) con el mismo contrato que la API:

| Servicio | Consumidores | Devuelve |
|---|---|---|
| `per.getHolderSnapshot(holderId, asOf)` | M02, M05, M06, M07, M09 | Persona, identificación principal con verificación, `identificationStatus` (DEC-099; M05 rechaza comprobantes que exigen documento si es `documentPending`), condición IVA de la cuenta, domicilio postal, contactos aplicables. |
| `per.findOrCreatePerson(criteria, draft, context)` | M11, M12, M16, M18 | Alta asistida (RF-PER-174, DEC-097): devuelve candidatos con puntaje; con la confirmación del usuario devuelve el `personId` elegido o crea la persona con las validaciones del alta normal. `context` indica módulo, rol y, cuando el rol depende de una entidad o empleador, `legalEntityId` (RN-PER-135; DEC-097), para la auditoría y para avisar si ya existe una ficha de ese rol. |
| `per.getPersonIdentity(personId)` | M11, M12, M16, M18 | Identidad vigente para mostrar en los maestros de rol: `displayName`, `tradeName`, identificación principal con verificación, `identificationStatus`, condición IVA, domicilios por rol y contactos (DEC-097). |
| `per.checkBlocks(target, effect)` | M02, M05, M07, M08, M19 | Bloqueos efectivos con modo y mensajes (igual que API-PER-41). |
| `per.checkAuthorization(personId, action, target)` | T02, M07, M09, M19 | Relación habilitante o rechazo (igual que API-PER-35). |
| `per.resolveServicePoint(addressId, premiseId)` | M02 | Punto existente o nuevo. |
| `per.matchIdentifiers(list)` | M06, M17, T09 | Coincidencias por identificación con RN-PER-011 (padrones externos, sorteos). |
| `per.getNotificationTarget(accountId, purpose, channel)` | T09 | Destino según RN-PER-021 y preferencias. |

## 12. Eventos y jobs

### 12.1 Eventos publicados (outbox en la misma transacción)

| EVT-ID | Evento | Cuándo | Carga útil mínima | Consumidores |
|---|---|---|---|---|
| EVT-PER-01 | `per.person.created` | Alta de persona | `personId`, `personType`, `identifiersSummary` | M17, M19, BI |
| EVT-PER-02 | `per.person.updated` | Cambio de datos | `personId`, `changedFields`, `validFrom` | M05 (datos para documentos futuros), M06, T09 |
| EVT-PER-03 | `per.person.deceased` | Fallecimiento | `personId`, `deathDate` | M02, M09 (tareas), M17, M19 |
| EVT-PER-04 | `per.person.deathReverted` | Reversión | `personId` | M02, M09, M17 |
| EVT-PER-05 | `per.person.mergeRequested` | Fusión aprobada | `survivorPersonId`, `absorbedPersonId`, `caseId` | Todos los módulos con referencias a personas |
| EVT-PER-06 | `per.person.merged` / `per.person.mergeReverted` | Fin de fusión / reversión | `survivorPersonId`, `absorbedPersonId`, `caseId` (antes: ídem; campos nombrados el 05-11-2026) | Todos |
| EVT-PER-07 | `per.person.anonymized` | Anonimización | `personId` | BI, T09, M19 |
| EVT-PER-08 | `per.taxId.verified` / `per.taxId.mismatch` | Resultado ARCA | `personId`, `identifierId`, `status`, `arcaIvaCondition` | M06, M05 |
| EVT-PER-09 | `per.holder.created` / `per.holder.activated` | Alta / activación | `holderId`, `personId`, `holderNumber` | M04 (cargo alta titular), M17, M19 |
| EVT-PER-10 | `per.holder.closed` / `per.holder.reopened` | Baja / reactivación | `holderId`, `effectiveDate`, `reasonId` | M02, M05, M17, M19 |
| EVT-PER-11 | `per.account.created` | Alta de cuenta | `accountId`, `holderId`, `localityId`, `isMember` | M02 (altas automáticas), M04 (cargo alta cuenta), M05, M07 |
| EVT-PER-12 | `per.account.updated` | Cambio de datos de cuenta | `accountId`, `changedFields`, `validFrom` | M05, M06, M07, T09 |
| EVT-PER-13 | `per.account.principalChanged` | Cambio de principal | `holderId`, `fromAccountId`, `toAccountId` | M05, M17 |
| EVT-PER-14 | `per.account.closed` | Cierre | `accountId` | M02, M05, M07 |
| EVT-PER-15 | `per.address.geoConfirmed` / `per.address.changed` | Ubicación confirmada / domicilio cambiado | `addressId`, `geo`, `refs[]` | M10 (GIS), M03 (rutas), M09 |
| EVT-PER-16 | `per.premises.created` / `per.premises.updated` | Inmueble | `premiseId`, `cadastreKey` | M02, M10, M04 (cuotas de obra) |
| EVT-PER-17 | `per.servicePoint.created` / `per.servicePoint.relocated` | Punto | `servicePointId`, `addressId` | M02, M03, M10 |
| EVT-PER-18 | `per.relationship.granted` / `revoked` / `expired` | Relaciones | `relationshipId`, `subjectPersonId`, `target`, `scopeActions` | T02 (alcance), M19, M07 |
| EVT-PER-19 | `per.adherent.added` / `per.adherent.removed` | Adherentes | `adherentId`, `contractId`, `reason` | **Reemplazado por EVT-SOC-01** (`soc.dependent.added` / `.ended`, productor M18; HUECO-TRV-01; no se publica). Consumidores originales: M04, M05, M17 |
| EVT-PER-20 | `per.block.applied` / `lifted` / `expired` | Bloqueos | `blockId`, `target`, `effects`, `effectMode` | M02, M05, M07, M08, M19 |
| EVT-PER-21 | `per.document.presented` / `validated` / `expired` | Documentación | `submissionId`, `requirementTypeId`, `target` | M02, M04 (beneficios), M09 |
| EVT-PER-22 | `per.transfer.executed` / `per.transfer.reverted` | Transferencias | `transferId`, `type`, `origin`, `destination`, `items`, `effectiveDate` | M02, M04 (cargo tipo 7), M05, M07, M17 |
| EVT-PER-23 | `per.ownership.changed` | Cambio de titularidad de un contrato | `contractId`, `fromHolderId`, `toHolderId`, `effectiveDate` | M02, M05, M07, M19 |
| EVT-PER-24 | `per.userLink.verified` / `per.userLink.revoked` | Vínculo usuario | `userId`, `personId` | T02, M19 |
| EVT-PER-25 | `per.contact.changed` | Contacto cambiado o verificado | `personId` o `accountId`, `type`, `verification` | T09, M19 |
| EVT-PER-26 | `per.person.fiscalLookupRequested` | Alta o cambio de CUIT/CUIL, o verificación manual (JOB-PER-01) | `personId`, `identifierId` | T06 (consulta el padrón de ARCA con `getPersona`; con el resultado M01 publica EVT-PER-08) |
| EVT-PER-27 | `per.person.identificationRegularized` | Una persona `documentPending` pasa a `identified` o `approvedException` (8.15; DEC-099) | `personId`, `fromStatus`, `toStatus`, `identifierId` | M05 (habilita comprobantes que exigen documento), M09 (cierra la tarea de regularización), T07 (informe de migración), M02 (refresca `serviceContracts.holderIdentifierSnapshot` de los contratos no terminados del titular con `per.getHolderSnapshot`; M02 §12.2; DEC-099, 10-11-2026) |

### 12.2 Eventos consumidos

| Evento | Productor | Acción en PER |
|---|---|---|
| `cat.serviceContract.activated` / `closed` / `disconnected` / `reconnected` | M02 | Actualiza proyección `structureSummary`; adherentes siguen el estado (RN-PER-086); punto `inactive` si queda sin contratos. El seguimiento de adherentes (RN-PER-086) pasa a M18 (RN-SOC-008, RN-SOC-009; HUECO-TRV-01). |
| `cat.serviceContract.categoryChanged` | M02 | Nota de sistema. La evaluación de condición de adherentes (RN-PER-083) pasa a M18 (RN-SOC-001; HUECO-TRV-01). |
| `tec.workOrder.closed` (con cambio de domicilio) | M10 | Traslado del punto y domicilio de adherentes (RN-PER-064). |
| `tec.geo.pointUpdated` (EVT-TEC-30) | M10 / app de campo | Crea evento de ubicación `candidate`/`needsReview`. |
| `ins.membership.approved` / `.suspended` / `.reinstated` / `.exited` (EVT-INS-02/04/06) | M17 | Actualiza en `holders.memberships` el elemento del `associateMembershipId` y `legalEntityId` del payload (DEC-096; antes "Actualiza `holders.membership` con el `associateMembershipId` del payload"; antes `membershipId`, PA-INS-12). |
| `mor.collectionCase.opened` / `.closed` (EVT-MOR-17) | M08 | Actualiza `indicators.inLegalProceedings`. |
| `iam.identity.created` (EVT-IAM-01) / `iam.portal.accountUnlinked` (EVT-IAM-15) | T02 | Propone vinculación; al borrar la cuenta de acceso revoca vínculos sin borrar datos de negocio (RN-PER-116). |
| `pla.tenant.created` (EVT-PLA-01) | T01 | Carga catálogos por defecto y secuencias. |
| `*.reference.reassigned` (respuesta a fusión) | Todos | Registra referencias reasignadas en `duplicateCases.merge.reassignedRefs`. |

### 12.3 Jobs

Ver tabla de la sección 9.12 (JOB-PER-01 a JOB-PER-12).

## 13. Integraciones

| Integración | Uso | Modo | Ante falla | Notas |
|---|---|---|---|---|
| ARCA — consulta de padrón de contribuyentes | Verificación de CUIT/CUIL, constancia, condición IVA, actividades, domicilio fiscal (RF-PER-020, RF-PER-029). | Asíncrono por JOB-PER-01/10; certificado del tenant o de plataforma gestionado por T09/T07 (**[VERIFICAR]** servicio y alcance del certificado: padrón A5/A13 u otro). | Estado `pending`, reintentos, alta no bloqueada salvo política. | No cambia datos automáticamente (RN-PER-009). |
| Georef (API del Estado argentino) | Normalización de provincias, departamentos, localidades y calles; geocodificación por altura. | Síncrono con tiempo máximo y caché; lote por JOB-PER-02. | Guardado con `pending` (RN-PER-070). | Opción recomendada para normalización (DEC-046). |
| Google Maps Platform | Mapa, autocompletado y geocodificación de mayor precisión. | Síncrono desde el navegador con clave del tenant o de plataforma; resultados guardados según términos de uso. | Mapa no disponible: formulario sin mapa. | No se descarga ni se guarda masivamente (RN-PER-071). |
| Lector de DNI (código PDF417) | Captura de datos del documento. | Local en el navegador (escáner tipo teclado o cámara). | Carga manual. | Separador configurable (PRM-PER-089). |
| T09 (comunicaciones) | Envío de códigos de verificación, avisos de vencimiento y mayoría de edad. | Eventos y servicios internos. | Reintentos de T09. | PER entrega destino (RN-PER-021). |
| T11 (documentos y workflow) | Adjuntos, constancias, plantillas, aprobaciones. | Servicios internos. | — | — |
| T04 (motor de configuración) | Catálogos geográficos, maestras, secuencias, datos extra, plantillas de importación. | Servicios internos. | — | — |
| ProCoop (migración) | Carga inicial (sección 19). | Lote. | Conciliación. | Sin sincronización permanente con la MySQL web (CTR-PER-15). |

## 14. Parámetros

Todos se administran en PAN-PER-22 mediante el motor de T04, con historia y auditoría. Ámbito: `tenant` salvo indicación (`tenant/servicio`, `tenant/sucursal`).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-PER-001 | `per.numbering.holder` | object `{ prefix, padding, start }` | tenant | `{ "", 0, último migrado + 1 }` | Formato y secuencia del número de titular. | `GetIdSocio` (MAX+1) |
| PRM-PER-002 | `per.numbering.holderSeries` | enum `single`, `memberAndNonMember` | tenant | `single` | Series de numeración. Fijo en `single` por DEC-017 (secuencia única por tenant con atributo de tipo); `memberAndNonMember` queda sin uso (antes PA-PER-15). | V2 32 |
| PRM-PER-003 | `per.numbering.closedKeepsNumberCountsAsActive` | bool | tenant | `true` | El dado de baja que conserva número cuenta como activo. | V2 2673 |
| PRM-PER-004 | `per.numbering.allowManualHolderNumber` | bool | tenant | `false` | Número de titular manual. Por DEC-017 solo se habilita dentro de una corrida de migración de T07; en operación queda `false`. | V2 2660 |
| PRM-PER-005 | `per.accounts.requirePrincipal` | bool | tenant | `true` | Exigir cuenta principal. | V2 2374 |
| PRM-PER-006 | `per.accounts.skipPrincipalOnTransfer` | bool | tenant | `false` | No exigir principal durante una transferencia. | V2 3164 |
| PRM-PER-007 | `per.accounts.skipPrincipalForNonMembers` | bool | tenant | `false` | No exigir principal, distrito ni sección a no asociados. | V2 3193 |
| PRM-PER-008 | `per.holders.requireAccount` | enum `no`, `warnAndProposeClose`, `require` | tenant | `require` | Titular activo sin cuentas (salvo solicitante). | V2 2324 |
| PRM-PER-009 | `per.numbering.account` | object `{ prefix, padding, start }` | tenant | último migrado + 1 | Formato y secuencia del número de cuenta. | `Guardar_SUMSOC` (MAX+1) |
| PRM-PER-010 | `per.identifiers.allowDuplicate` | enum `never`, `withApprovedException` | tenant | `withApprovedException` | Duplicado de documento (DEC-044: único por tenant con excepción aprobada y auditada). | V2 2077 |
| PRM-PER-011 | `per.identifiers.duplicateOnlyIfPreviousClosed` | bool | tenant | `true` | La excepción exige que la persona anterior no tenga titularidad activa. | V2 3196 |
| PRM-PER-012 | `per.identifiers.proposeCalculatedCuil` | bool | tenant | `true` | Proponer CUIL calculado como no verificado (PA-PER-04). | `GenerarCuit` |
| PRM-PER-013 | `per.identifiers.invalidTaxIdLevel` | enum `off`, `warn`, `block` | tenant | `block` | Nivel ante CUIT con dígito incorrecto al confirmar la ficha. | V2 2979 |
| PRM-PER-014 | `per.arca.verificationPolicy` | object `{ onCreate: bool, onChange: bool, periodicDays: int, mismatchLevel: warn/block }` | tenant | `{ true, true, 30, warn }` | Cuándo verificar en ARCA y qué hacer con discrepancias (PA-PER-05). | `clsInformes_Titulares` |
| PRM-PER-015 | `per.identifiers.defaultTypeLegal` | ref `identityDocumentTypes` (CTR-DAT-14) | tenant | CUIT | Tipo por defecto para jurídicas. | V2 591 |
| PRM-PER-016 | `per.identifiers.defaultTypeNatural` | ref `identityDocumentTypes` (CTR-DAT-14) | tenant | DNI | Tipo por defecto para humanas. | V2 592 |
| PRM-PER-017 | `per.persons.requireBirthOrRegistrationDate` | bool | tenant | `false` | Exigir fecha de nacimiento o de alta. | V2 2941 |
| PRM-PER-018 | `per.persons.allowReconnectionDeceased` | bool | tenant/servicio | `false` | Señal para M10: reconexión a fallecidos. | V2 2301 |
| PRM-PER-019 | `per.sensitive.bloodDonorAgeRange` | object `{ min, max }` | tenant | `{ 18, 65 }` | Edades de donante (si la cooperativa usa el dato). | V2 2527 |
| PRM-PER-020 | `per.contacts.enforcementMoment` | enum `onCreate`, `always` | tenant | `onCreate` | Momento de control de contactos. | V2 2490 |
| PRM-PER-021 | `per.contacts.mobileLevel` | enum `off`, `warn`, `require` | tenant | `warn` | Nivel de exigencia de celular. | V2 744 |
| PRM-PER-022 | `per.contacts.emailLevel` | enum `off`, `warn`, `require` | tenant | `warn` | Nivel de exigencia de correo. | V2 745 |
| PRM-PER-023 | `per.contacts.priority` | array enum `account`, `person`, `portal` | tenant | `[account, portal, person]` | Orden de prioridad de contactos. | `Get_Telefono`, `Get_Mail` |
| PRM-PER-024 | `per.notifications.messagingTargetPriority` | enum `portalFirst`, `holderFirst`, `both` | tenant | `portalFirst` | Destino de SMS/WhatsApp. | V2 2824 |
| PRM-PER-025 | `per.notifications.groupWhatsappByHolderAndPhone` | object `{ group: bool, useAccountMobile: bool }` | tenant | `{ true, false }` | Agrupar WhatsApp por titular y teléfono; usar celular de la cuenta. | V2 3051 |
| PRM-PER-026 | `per.notifications.invoiceWhatsappUseAccountMobile` | bool | tenant | `false` | Facturas por WhatsApp al celular de la cuenta, solo electrónicas. | V2 3121 |
| PRM-PER-027 | `per.contacts.phoneDisplayFormat` | enum `local`, `digitsOnly`, `e164` | tenant | `local` | Formato de visualización de teléfonos. | V2 2934 |
| PRM-PER-028 | `per.contacts.keepPortalContacts` | bool | tenant | `true` | No sobrescribir contactos del portal. | V2 2460 |
| PRM-PER-029 | `per.portal.requirePhoneAndEmail` | object `{ phone: bool, email: bool }` | tenant | `{ true, true }` | Exigir teléfono y correo en el portal. | PMovil 15, 18 |
| PRM-PER-030 | `per.portal.confirmContactsOnLogin` | enum `never`, `everyLogin`, `everyNDays` | tenant | `never` | Pedir confirmar contactos al ingresar. | PMovil 19 |
| PRM-PER-031 | `per.holders.allowCloseWithActiveContracts` | bool | tenant | `false` | Baja con contratos activos. | V2 340 |
| PRM-PER-032 | `per.holders.allowCloseWithCapital` | bool | tenant | `false` | Baja con capital integrado. | V2 337 |
| PRM-PER-033 | `per.holders.allowCloseWithoutAccounts` | bool | tenant | `true` | Baja de titular sin cuentas. | V2 2633 |
| PRM-PER-034 | `per.holders.informRelationsInOtherAccounts` | bool | tenant | `true` | Informar si es adherente, beneficiario o garante en otras cuentas. | V2 2571 |
| PRM-PER-035 | `per.holders.allowContractsForNonMembers` | bool | tenant/servicio | `true` | Contratos de no asociados. | V2 734 |
| PRM-PER-036 | `per.holders.noBillingForClosed` | bool | tenant | `true` | No facturar a titulares de baja (señal a M05). | V2 741 |
| PRM-PER-037 | `per.holders.newAsNonMember` | bool | tenant | `true` | Nuevos titulares como no asociados. | V2 2591 |
| PRM-PER-038 | `per.accounts.defaultIibbCondition` | ref [M06] | tenant | — | Condición IIBB por defecto. | V2 2312 |
| PRM-PER-039 | `per.accounts.autoElectronicInvoice` | bool | tenant | `true` | Factura electrónica automática al alta. | V2 2642 |
| PRM-PER-040 | `per.accounts.allowNoBillingMark` | bool | tenant | `false` | Permitir bloqueo `billing` sobre cuenta o contrato. | V2 2303 |
| PRM-PER-041 | `per.accounts.requireDeliveryZone` | bool | tenant | `false` | Exigir zona de reparto al alta. | V2 213 |
| PRM-PER-042 | `per.accounts.requireSetCode` | bool | tenant | `false` | Exigir conjunto. | V2 703 |
| PRM-PER-043 | `per.accounts.requireDistrictSectionOnPrincipal` | bool | tenant | `false` | Exigir distrito y sección en la principal. | V2 2285 |
| PRM-PER-044 | `per.accounts.requireAccountingGroup` | bool | tenant | `false` | Exigir grupo contable. | V2 2738 |
| PRM-PER-045 | `per.accounts.requirePostalCompany` | bool | tenant | `false` | Exigir empresa postal. | V2 2506 |
| PRM-PER-046 | `per.accounts.autofillDistrictFromSection` | bool | tenant | `true` | Completar distrito desde la sección. | V2 2373 |
| PRM-PER-047 | `per.ui.showContractObservation` | bool | tenant | `true` | Mostrar observación del contrato en la ficha. | V2 2557 |
| PRM-PER-048 | `per.ui.ungroupContracts` | bool | tenant | `false` | Mostrar contratos sin agrupar por grupo de facturación. | V2 3152 |
| PRM-PER-049 | `per.accounts.allowNoLateFee` | bool | tenant | `false` | Permitir marca "no cobrar recargo". | V2 3135 |
| PRM-PER-050 | `per.accounts.noLateFeeRequiresApproval` | bool | tenant | `true` | La marca requiere autorización. | V2 3162 |
| PRM-PER-051 | `per.addresses.sameAddressSameServiceLevel` | enum `off`, `warn` | tenant/servicio | `warn` | Aviso de otro contrato del mismo servicio en el mismo domicilio (nunca bloquea). | V2 2710 |
| PRM-PER-052 | `per.addresses.debtCheck` | enum `off`, `warn`, `block` | tenant/servicio | `warn` | Control de deuda en domicilio o catastro (PA-PER-03). | V2 2482 |
| PRM-PER-053 | `per.addresses.debtCheckAsk` | bool | tenant | `true` | Pedir confirmación al operador ante advertencia. | V2 2668 |
| PRM-PER-054 | `per.addresses.debtCheckOnlyOverdue` | bool | tenant | `true` | Considerar solo deuda vencida. | V2 2669 |
| PRM-PER-055 | `per.addresses.proposeCopyToContracts` | bool | tenant | `false` | Proponer copiar el domicilio de la cuenta a los contratos (con confirmación). | V2 2461 |
| PRM-PER-056 | `per.addresses.printFormat` | object `{ includeFloor, includeUnit, includeNeighborhood, includePostalCode, template }` | tenant | todo `true` | Formato del domicilio impreso. | V2 2918 |
| PRM-PER-057 | `per.cadastre.labels` | array[6] string | tenant | `["Cod","Sec","Man","Par","PH","Lote"]` | Etiquetas de nomenclatura. | V2 2281 |
| PRM-PER-058 | `per.cadastre.numericMode` | bool | tenant | `false` | Nomenclatura numérica. | V2 2320 |
| PRM-PER-059 | `per.premises.requireOnContractCreate` | bool | tenant/servicio | `false` | Solicitar siempre inmueble en el alta. | V2 2462 |
| PRM-PER-060 | `per.premises.checkCadastreOnTechnicalService` | bool | tenant/servicio | `false` | Controlar catastro en alta de servicios técnicos. | V2 319 |
| PRM-PER-061 | `per.guarantee.accountLevel` | enum `off`, `warn`, `require` | tenant | `off` | Garante por cuenta. | V2 2544 |
| PRM-PER-062 | `per.guarantee.holderRequired` | bool | tenant | `false` | Requerir garantía al titular. | V2 54 |
| PRM-PER-063 | `per.guarantee.validateHolderGuarantee` | bool | tenant | `false` | Validar garantía de titulares. | V2 2469 |
| PRM-PER-064 | `per.adherents.allowInMultipleContracts` | bool | tenant/servicio | `false` | **Reemplazado por PRM-SOC-002** (HUECO-TRV-01; no se configura en M01). Texto original: Adherente activo en dos contratos del mismo servicio. | V2 2400 |
| PRM-PER-065 | `per.adherents.offerCloseRepeated` | bool | tenant | `true` | **Reemplazado por PRM-SOC-003** (HUECO-TRV-01; no se configura en M01). Texto original: Ofrecer dar de baja la adhesión anterior. | V2 2521 |
| PRM-PER-066 | `per.adherents.majorityAgeNotify` | bool | tenant | `false` | **Reemplazado por PRM-SOC-010** (HUECO-TRV-01; no se configura en M01). Texto original: Avisar mayoría de edad por correo. | V2 3186 |
| PRM-PER-067 | `per.adherents.majorityAge` | object `{ age: int, notifyTo: holder/adminEmail, email }` | tenant | `{ 21, holder, — }` | **Reemplazado por PRM-SOC-009 y PRM-SOC-011** (HUECO-TRV-01; no se configura en M01). Texto original: Edad de mayoría y destino del aviso. | V2 3187 |
| PRM-PER-068 | `per.adherents.askOnReconnection` | bool | tenant | `true` | **Reemplazado por PRM-SOC-005** (HUECO-TRV-01; no se configura en M01). Texto original: Consultar alta de adherentes al reconectar. | V2 2401 |
| PRM-PER-069 | `per.adherents.hideDeceased` | bool | tenant | `true` | **Reemplazado por PRM-SOC-007** (HUECO-TRV-01; no se configura en M01). Texto original: Ocultar adherentes fallecidos en la ficha. | V2 3058 |
| PRM-PER-070 | `per.adherents.debtCheck` | enum `off`, `warn`, `block` | tenant | `warn` | **Reemplazado por PRM-SOC-008** (HUECO-TRV-01; no se configura en M01). Texto original: Control de deuda del adherente. | V2 2545 |
| PRM-PER-071 | `per.adherents.holderNotRequiredAsAdherent` | bool | tenant | `true` | **Reemplazado por PRM-SOC-001 (semántica inversa: PRM-SOC-001 = true exige el adherente titular; el default de M18 exige y el de M01 no exigía, se toma el de M18)** (HUECO-TRV-01; no se configura en M01). Texto original: El titular no necesita ser adherente. | V2 109 |
| PRM-PER-072 | `per.adherents.transferMode` | enum `copyInactive`, `copyActive`, `closeAtOrigin` | tenant/servicio | `copyActive` | **Reemplazado por PRM-SOC-012 (valores `end`/`keep`; `copyInactive` equivale a `end` y `closeAtOrigin` a `end` sin borrado; default de M18 `end`)** (HUECO-TRV-01; no se configura en M01). Texto original: Adherentes en transferencias. | V2 2291 |
| PRM-PER-073 | `per.blocks.cashPaymentDefaultMode` | enum `deny`, `requireApproval`, `warn` | tenant | `requireApproval` | Modo por defecto del efecto `cashPayment` (PA-PER-16); efectos habilitados. | `BLO_CAJ` |
| PRM-PER-074 | `per.documents.assignActionsToRequirements` | bool | tenant | `true` | Habilitar acciones tipadas en requisitos. | V2 2509 |
| PRM-PER-075 | `per.transfers.blockAccountWithDebt` | enum `off`, `warn`, `block` | tenant | `warn` | Transferir cuenta con deuda. | V2 427 |
| PRM-PER-076 | `per.transfers.allowToClosedHolders` | bool | tenant | `false` | Transferir a titulares de baja. | V2 2552 |
| PRM-PER-077 | `per.transfers.originContractStatus` | enum `notInForce` | tenant | `notInForce` | Estado del contrato de origen al transferir (fijo; se documenta por trazabilidad). | V2 2541 |
| PRM-PER-078 | `per.transfers.deleteOriginContract` | — | — | Descartado | El contrato de origen nunca se elimina (PA-PER-07). | V2 422 |
| PRM-PER-079 | `per.transfers.allowClosedContracts` | bool | tenant | `false` | Transferir contratos dados de baja. | V2 2599 |
| PRM-PER-080 | `per.transfers.chargeConcepts` | bool | tenant/servicio | `true` | Generar cargos de transferencia (M04). | V2 2782 |
| PRM-PER-081 | `per.transfers.approvalRequired` | object por tipo `{ accountTransfer, ownershipChange, capitalTransfer, relocation, payerChange, succession }` → bool | tenant | `ownershipChange` y `succession` = `true` | Aprobación por tipo. | — |
| PRM-PER-082 | `per.duplicates.policy` | object `{ threshold: int, blockCreateAbove: int, mergeRequiresSecondUser: bool }` | tenant | `{ 70, 95, true }` | Umbral de candidatos y aprobación de fusión (PA-PER-10). | — |
| PRM-PER-083 | `per.portal.legacyWebKey` | — | — | Descartado | Clave web por socio o DNI (CTR-PER-12). | V2 914, V2 800 |
| PRM-PER-084 | `per.transfers.makeDestinationPrincipal` | bool | tenant | `false` | La cuenta destino pasa a principal. | V2 3195 |
| PRM-PER-085 | `per.search.activeOnlyByDefault` | bool | tenant | `true` | Buscar solo activos por defecto. | V2 2321 |
| PRM-PER-086 | `per.search.showPinnedNotes` | bool | tenant | `true` | Mostrar notas destacadas en la búsqueda. | V2 2744 |
| PRM-PER-087 | `per.search.contractNumberMatch` | enum `exact`, `partial` | tenant | `exact` | Búsqueda por matrícula. | V2 3108 |
| PRM-PER-088 | `per.ui.simpleView` | bool | usuario | `false` | Vista simple de la búsqueda. | V2 2610 |
| PRM-PER-089 | `per.dniReader.separator` | string | tenant/sucursal | `@` | Separador del lector de DNI. | V2 2676 |
| PRM-PER-090 | `per.addresses.streetCreationRequiresPermission` | bool | tenant | `true` | Solicitar calles nuevas exige permiso. | V2 2309 |
| PRM-PER-091 | `per.holders.closeRequestTemplate` | ref [T11] | tenant | plantilla estándar | Plantilla de solicitud de baja. | V2 2580 |
| PRM-PER-092 | `per.register.defaults` | object (columnas y filtros por defecto) | tenant | estándar | Padrón por defecto. | V2 50 |
| PRM-PER-093 | `per.accounts.defaultDeliveryRoute` | object `{ zoneId, sectorId, routeOrder }` | tenant/sucursal | — | Zona, sector y recorrido de reparto por defecto. | V2 2031, V2 2032, V2 2033 |
| PRM-PER-094 | `per.accounts.defaultDistrictSection` | ref | tenant/sucursal | — | Distrito y sección por defecto. | V2 2030 **[VERIFICAR]** |
| PRM-PER-095 | `per.persons.minimumRegistrationData` | object `{ requireIdentifier: bool, requireContact: bool }` | tenant | `{ true, true }` | Datos mínimos de registro (PA-PER-11). | — |
| PRM-PER-096 | `per.relationships.portalGrantableActions` | array enum | tenant | `[view, pay]` | Acciones que el titular puede conceder desde la app (PA-PER-12). | — |
| PRM-PER-097 | `per.relationships.portalGrantMinAge` | int | tenant | 18 | Edad mínima del autorizado desde la app. | — |
| PRM-PER-098 | `per.expirations.noticeDays` | int | tenant | 30 | Días de aviso previo de vencimiento (documentos, relaciones, bloqueos). | — |
| PRM-PER-099 | `per.duplicates.mergeRevertDays` | int | tenant | 30 | Plazo de reversión de fusión. | — |
| PRM-PER-100 | `per.privacy.retention` | object por categoría `{ years, action: anonymize/keep }` | tenant | definido por T08 | Conservación y anonimización (PA-PER-14). | — |
| PRM-PER-101 | `per.geo.providers` | object `{ normalization: georef/google/catalog, map: google/osm, geocoding: georef/google }` | tenant | `{ georef, google, georef }` | Proveedores geográficos (DEC-046). | — |
| PRM-PER-102 | `per.userLink.methods` | array enum + `{ maxAttempts, lockMinutes, codeTtlMinutes }` | tenant | `[invoiceCode, otpToRegisteredContact, inPerson]`, `{ 5, 15, 10 }` (alineado con RF-POR-179 de M19: código válido 10 minutos, bloqueo de 15 minutos tras el quinto fallo; default anterior `{ 5, 30, 15 }`) | Métodos de vinculación (DEC-043; intentos limitados con bloqueo temporal; RF-PER-173). | — |

Parámetros relevados que **no** son de PER y se dejan referenciados: V2 2329 y V2 2507 (vía de ingreso de trámites, M09); V2 573, V2 2269, V2 2715, V2 2250, V2 2740, V2 2050, V2 343, V2 3034 (comportamiento de contratos y servicios, M02); V2 2428, 2429, 2430, 2616, 2608 (capital y credenciales, M17); V2 2623 (débito sin exigir datos, M07); PMovil 17 (bloqueo de pago web: se cubre con el efecto `webPayment`), PMovil 32 (adhesión a factura electrónica desde la web, M19 sobre `invoiceDelivery`), PMovil 46 (no subir cuentas sin servicios: descartado, no hay sincronización). V2 2286 "no utilizar guardado rápido" se descarta (RN-PER-124).

## 15. Reportes, indicadores y exportaciones

Todos declaran universo, fórmula y fecha de corte (AGR-022). La fecha de corte por defecto es "hoy" con interpretación por fecha efectiva; puede pedirse "a una fecha" por fecha efectiva o de registro (RF-PER-152). Las columnas con datos personales respetan el permiso del usuario y la exportación queda auditada (RF-PER-150).

| ID | Reporte | Universo | Fórmula / contenido | Fecha de corte | Origen ProCoop |
|---|---|---|---|---|---|
| REP-PER-01 | Padrón de titulares | Titulares del tenant según filtros (estado, asociado, servicio, localidad, zona, distrito) | Una fila por titular (o por cuenta, a elección) con columnas elegidas. | Parámetro "a la fecha" | `frmPadronTitulares` y relacionados |
| REP-PER-02 | Altas y bajas de titulares | Titulares con `openedAt` o `closedAt` en el rango | Cantidad por mes, causa de baja y sucursal; neto = altas − bajas. | Rango de fechas efectivas | `SOCIOS.ALTA`, `BAJA`, `CAU_BAJA` |
| REP-PER-03 | Cuentas por estado y estructura | Cuentas del tenant | Cuentas activas, cerradas, sin contratos vigentes, con varios grupos de facturación, sin cuenta principal (debe ser 0). | Fecha de corte | `PoseeGrupos` |
| REP-PER-04 | Calidad de datos | Personas activas | % con identificación verificada (dígito, ARCA), % con contacto verificado, % con domicilio confirmado, % sin fecha de nacimiento, discrepancias ARCA abiertas. | Hoy | Informe ARCA de `clsInformes_Titulares` |
| REP-PER-05 | Diferencias con ARCA | Identificaciones fiscales revalidadas en el período | Lista de condición IVA de la cuenta vs constancia; estado de la clave. | Fecha de la revalidación | `clsInformes_Titulares.cs:1189-1211` |
| REP-PER-06 | Documentación presentada, no presentada y vencida | Requisitos exigibles por entidad | Por tipo de requisito: presentados, pendientes, por vencer en N días, vencidos (RN-PER-097). | Fecha de proceso | `Get_TramitesPresentados`, `Get_TramitesNOPresentados` |
| REP-PER-07 | Bloqueos vigentes | Bloqueos `active` | Por efecto, causa y antigüedad; bloqueos sin vencimiento > 180 días. | Hoy | `HISBLOQ`, `SUMNOFAC` |
| REP-PER-08 | Transferencias | Transferencias en el rango | Por tipo y estado; revertidas; fallidas; tiempo medio entre borrador y ejecución. | Rango de `effectiveDate` | `TRANSFER`, `frmTransferenciasCuenta` |
| REP-PER-09 | Relaciones por vencer y vencidas | Relaciones `active` con `validTo` | Por tipo y días restantes. | Hoy | — |
| REP-PER-10 | Adherentes — **Reemplazado por REP-SOC-01 y REP-SOC-02** (M18; HUECO-TRV-01) | Adherentes por servicio y categoría | Texto original: Activos, altas y bajas por motivo, fuera de condición, que cumplen mayoría de edad en el período. | Rango | `ADHSOC`, `BENSOC`, `frmBajaAdherentesCondicion` |
| REP-PER-11 | Duplicados | Casos del período | Abiertos, descartados, fusionados, revertidos; tiempo de resolución. | Rango | — |
| REP-PER-12 | Geocodificación | Domicilios en uso por puntos de prestación | % por estado (`confirmed`, `approximate`, `pending`, `needsReview`, `unavailable`). | Hoy | — |
| REP-PER-13 | Inmuebles | Inmuebles activos | Por uso, estado, localidad; sin contratos; con varias unidades funcionales. | Hoy | `PROPIEDA` |
| REP-PER-14 | Etiquetas y circulares | Titulares, cuentas o contratos seleccionados | Domicilio postal vigente con formato del tenant (PRM-PER-056). | Hoy | `frmCirculares` |
| REP-PER-15 | Solicitudes de derechos | Solicitudes del período | Por tipo, en plazo y fuera de plazo. | Rango | — |
| REP-PER-16 | Inventario de datos personales | Modelo del módulo | Campo, categoría, finalidad, base, plazo (RF-PER-166). | Versión vigente | — |

Los reportes de deuda, saldo, consumo o capital que aparecen en la ficha o en el padrón usan los datos y fórmulas del módulo dueño (M07, M03, M17); PER no los recalcula.

## 16. Casos de uso

### CU-03 — Alta de persona y asociada sin duplicar (BASE §3)

- **Actor:** administrativo de atención.
- **Precondición:** persona que solicita asociarse y contratar agua, con datos mínimos.
- **Flujo:** 1) busca coincidencias (API-PER-03); 2) registra a Ana Pérez (PER-001) con contacto y domicilio, adjunta documentación (API-PER-02, T11); 3) crea titular en estado `applicant` (API-PER-14) y M17 registra la relación de asociada ASO-001; queda habilitada para iniciar una solicitud comercial en M09.
- **Resultado:** PER-001 y ASO-001 creadas sin duplicación; no hay contrato activo.
- **Excepción:** si aparece una persona coincidente, se revisa y se usa el registro existente; no se fusiona automáticamente.
- **Requisitos:** RF-PER-001..003, RF-PER-040, RF-PER-044, RN-PER-001, RN-PER-004, RN-PER-113.

### CU-04 — Contrato sobre un inmueble (BASE §4)

- **Actor:** administrativo comercial.
- **Precondición:** Ana registrada; solicitud de agua con aprobación técnica.
- **Flujo:** 1) selecciona INM-001 (API-PER-31); 2) PER resuelve el punto de prestación (`per.resolveServicePoint`) y M02 crea SUM-AG-001 con Ana como titular en su cuenta principal y plan AG-RES; 3) M02 registra la activación efectiva al confirmarse la instalación.
- **Resultado:** contrato activo vinculado a titular, cuenta, punto e inmueble.
- **Excepción:** sin aprobación de instalación el contrato queda pendiente (M02).
- **Requisitos:** RF-PER-086, RF-PER-093, RN-PER-074, RN-PER-100.

### CU-REG-01 — Registro sin suministro (BASE §67)

- **Definición:** el CU-REG-01 se define en M19 §16.1; M19 lo lista entre sus casos de uso originales (anexo dueño); aquí se detalla solo la parte de PER (alta de la persona y del titular `applicant`) y se cita esa definición.
- **Actor:** persona nueva en la landing del tenant TEN-002.
- **Flujo:** se registra (T02, USR-NUEVO-B, nuevo-b@example.com); elige Gas e inicia la solicitud (M09); PER crea la persona con los datos mínimos (PA-PER-11) y titular `applicant` cuando la solicitud lo requiere; si necesita asociarse, M17 lo informa.
- **Resultado:** usuario registrado y solicitud en trámite; no se crea cuenta ni contrato hasta que corresponda; el CUIT se pide solo si la emisión lo exige (RN-PER-121).
- **Requisitos:** RF-PER-159, RN-PER-118, RN-PER-119, RN-PER-121.

### CU-TIT-01 — Dos hermanos en el mismo domicilio (BASE §83)

- **Actores:** atención; hermanos A (PER-H-A) y B (PER-H-B).
- **Flujo:** ambos son titulares con cuentas propias; M02 crea INT-H-A-001 e INT-H-B-001 en dos puntos de prestación de DIR-CASA-001 (o en el mismo punto, sin unicidad); A paga, B queda pendiente; B pide la baja de su conexión.
- **Resultado:** estados separados; la baja de B no afecta a A; la cuenta unificada de A no incorpora los servicios de B; A no ve datos de B en el portal.
- **Requisitos:** RF-PER-093, RF-PER-094, RN-PER-042, RN-PER-060, RN-PER-061.

### CU-GEO-01 — Domicilio de prestación georreferenciado (BASE §77)

- **Definición:** el CU-GEO-01 se define en T04 §16; T04 lo marca "BASE §77, original" (anexo dueño); aquí se detalla solo la parte de PER (domicilio normalizado y georreferenciado) y se cita esa definición.
- **Actor:** Ana (portal) u operador.
- **Flujo:** selecciona Córdoba y localidad, busca la calle, completa altura y unidad; el sistema muestra la dirección normalizada y un candidato en el mapa; Ana u operador autorizado confirma; el contrato y la visita usan esa dirección; el domicilio fiscal queda separado.
- **Excepción:** calle inexistente en el catálogo (loteo nuevo): se conserva el texto y las referencias, se marca el punto para revisión; no se usa una calle homónima ni coordenadas inventadas.
- **Datos:** DIR-DEMO-001, INM-001, estado inicial `pending`.
- **Requisitos:** RF-PER-073..080, RN-PER-066..071.

### CU-PER-01 — Cambio de titularidad por venta del inmueble

- **Actor:** atención y supervisor.
- **Flujo:** el comprador (persona nueva o existente) solicita el servicio; atención abre PAN-PER-14 tipo `ownershipChange` desde el contrato del vendedor; adjunta escritura o boleto; simula (deuda informativa del vendedor, cargos de transferencia, IIBB); supervisor aprueba; se ejecuta: contrato del vendedor `notInForce`, contrato nuevo del comprador con fecha efectiva; relación `owner` del inmueble actualizada.
- **Resultado:** la deuda y los comprobantes anteriores quedan a nombre del vendedor; el siguiente período factura al comprador.
- **Excepción:** bloqueo `transfer` activo → rechazo con causa; si el comprador asume la deuda, se deriva a convenio en M08.
- **Requisitos:** RF-PER-133, RF-PER-135, RF-PER-136, RN-PER-100, RN-PER-101, RN-PER-104.

### CU-PER-02 — Mudanza del titular

- **Flujo:** el titular pide el servicio en el nuevo domicilio conservando su cuenta; se crea el punto nuevo; M02 cierra el contrato de origen y activa el de destino (o M10 ejecuta traslado técnico); al cerrar la OT, PER actualiza el punto (RN-PER-064).
- **Resultado:** deuda y historia en el contrato de origen; cuenta sin cambios.
- **Requisitos:** RF-PER-098, RN-PER-063, RN-PER-064.

### CU-PER-03 — Fallecimiento del titular

- **Flujo:** un familiar presenta el certificado; supervisor registra fallecimiento (PAN-PER-16); se dan de baja adhesiones y beneficios de la persona; se crean tareas en M09 (sucesión o baja del titular, cambio de garante).
- **Resultado:** servicios sin corte; la sucesión se hace como transferencia `succession` con la documentación exigida.
- **Excepción:** registro por error → reversión con aprobación (RF-PER-010).
- **Requisitos:** RF-PER-009, RF-PER-010, RF-PER-141, RN-PER-014.

### CU-PER-04 — Representante de persona jurídica (municipalidad)

- **Flujo:** la Municipalidad Demo (persona jurídica) tiene varias cuentas; se carga la relación `legalRepresentative` del intendente y `attorney` de un empleado con alcance `view`, `requestServices`; supervisor verifica la evidencia (decreto, poder).
- **Resultado:** el empleado ve y gestiona solo lo concedido; al cesar el mandato se revoca y pierde acceso.
- **Requisitos:** RF-PER-005, RF-PER-100, RF-PER-102, RF-PER-106, RN-PER-078, RN-PER-080.

### CU-PER-05 — Autorizado que paga por el titular

- **Flujo:** el titular agrega desde la app a su hija como autorizada con alcance `view` y `pay` (PAN-PER-27); la hija vincula su usuario y paga la factura.
- **Resultado:** el pago queda en M07 con `onBehalfOf`; la hija no puede pedir la baja; ver ESC-01 para la imputación.
- **Requisitos:** RF-PER-104, RF-PER-105, RF-PER-107, RN-PER-079.

### CU-PER-06 — Duplicado detectado y fusión

- **Flujo:** JOB-PER-03 detecta dos personas con el mismo DNI (una migrada con CUIL y otra cargada con DNI); el operador confirma "misma persona", elige valores y solicita fusión; otro usuario aprueba; los módulos reasignan referencias.
- **Resultado:** persona absorbida `merged`; búsquedas redirigen; reversión posible dentro del plazo.
- **Requisitos:** RF-PER-155..158, RN-PER-113, RN-PER-114.

### CU-PER-07 — Bloqueo de cobro en caja

- **Flujo:** el supervisor aplica a una cuenta un bloqueo `cashPayment` causa "cheque rechazado" con mensaje para caja; el cajero intenta cobrar.
- **Resultado:** con el modo por defecto (PA-PER-16) la caja muestra el mensaje y pide autorización del supervisor; el resto de canales sigue habilitado salvo otros efectos.
- **Requisitos:** RF-PER-123, RF-PER-124, RN-PER-095, RN-PER-096.

### CU-PER-08 — La misma persona en dos cooperativas

- **Flujo:** una persona es empleada en la cooperativa A y titular en la B; tiene un solo usuario de acceso (T02) con pertenencias a ambos tenants.
- **Resultado:** cada tenant tiene su propia persona; no se cruzan datos, coincidencias ni fusiones; al cambiar de tenant en la sesión se recalculan vínculos y cuentas visibles.
- **Requisitos:** RN-PER-002, RN-PER-120, RF-PER-158.

### CU-PER-09 — CUIT con discrepancia en ARCA

- **Flujo:** se carga una CUIT con dígito válido; JOB-PER-01 obtiene una constancia con otra denominación.
- **Resultado:** identificación `arcaMismatch`, aviso al operador; la cuenta Responsable Inscripto no puede activar contratos hasta resolver (RN-PER-008, PRM-PER-014).
- **Requisitos:** RF-PER-019..021, RN-PER-009.

### CU-PER-10 — Inmueble en propiedad horizontal

- **Flujo:** se da de alta un edificio con 8 unidades funcionales; cada unidad tiene un punto de prestación y su contrato de energía con titulares distintos.
- **Resultado:** la nomenclatura del edificio es única; las unidades comparten inmueble sin compartir deuda.
- **Requisitos:** RF-PER-086, RF-PER-087, RF-PER-093, RN-PER-076.

### CU-PER-11 — Transferencia de cuenta completa

- **Flujo:** un comercio cambia de razón social; la cuenta con tres contratos se transfiere al titular nuevo; se pregunta si conserva capital (M17); el titular origen queda sin cuentas y se propone su baja.
- **Resultado:** contratos nuevos en la cuenta destino con fecha efectiva; IIBB advertido; constancia reimprimible.
- **Requisitos:** RF-PER-132, RF-PER-137..139, RN-PER-102, RN-PER-103.

### CU-PER-12 — Baja de titular

- **Flujo:** se pide la baja; API-PER-17 informa contratos activos, capital, relaciones en otras cuentas; resueltos los impedimentos, se da de baja con causa y se imprime la constancia.
- **Requisitos:** RF-PER-045, RN-PER-031..035.

### CU-PER-13 — Solicitud de acceso a datos personales

- **Flujo:** el titular pide desde la app "Descargar mis datos"; el responsable de privacidad verifica identidad y resuelve; se genera la exportación sin datos de terceros.
- **Requisitos:** RF-PER-163, RF-PER-164.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Funcionales

| ID | Escenario | Dado | Cuando | Entonces |
|---|---|---|---|---|
| AC-PER-01 | Alta sin duplicar | PER-001 existe con DNI | Se intenta crear otra persona con el mismo DNI | Rechazo `per/duplicate-identifier` con enlace a la existente, salvo excepción aprobada. |
| AC-PER-02 | DNI dentro de CUIL | Persona con CUIL que contiene el DNI | Se busca por DNI | Aparece como candidata con puntaje 90. |
| AC-PER-03 | Dígito verificador | CUIT con dígito incorrecto | Se guarda | Error en línea; con dígito correcto queda `checkDigitOk`. Casos de prueba por prefijo 20, 23, 24, 27, 30, 33, 34 y resto 10. |
| AC-PER-04 | CUIL calculado | Persona con DNI y sexo | Se crea | CUIL propuesto `derivedFrom = calculatedFromDni`, `unverified`; la emisión que exige CUIT lo rechaza. |
| AC-PER-05 | Cuenta principal única | Titular con cuentas C1 (principal) y C2 | Dos usuarios marcan C2 y C1 como principal simultáneamente | Exactamente una queda principal (índice único parcial); la otra solicitud recibe `409`. |
| AC-PER-06 | Números concurrentes | 50 altas de titular en paralelo | Se ejecutan | 50 números distintos, sin huecos causados por colisión. |
| AC-PER-07 | Varios contratos en un domicilio | DIR-CASA-001 | Se crean INT-H-A-001 e INT-H-B-001 | Ambos se guardan; no hay error de unicidad. |
| AC-PER-08 | Deuda en domicilio | Otra cuenta con deuda vencida en el mismo catastro | Se crea cuenta nueva | Advertencia sin datos del deudor para quien no tiene permiso; con política `block` se rechaza con motivo. |
| AC-PER-09 | Cambio de titularidad | Contrato de A con deuda ARS 5.000 | Se transfiere a B con fecha 01/12 | La deuda sigue en A; las facturas previas siguen a nombre de A; la siguiente factura sale a B. |
| AC-PER-10 | Idempotencia de transferencia | Transferencia aprobada | Se llama dos veces a API-PER-50 con la misma `Idempotency-Key` | Un solo contrato nuevo; la segunda respuesta devuelve el mismo resultado. |
| AC-PER-11 | Falla parcial | M05 rechaza la reasignación de grupo | Se ejecuta | Se compensa el contrato creado, la transferencia queda `failed` con tarea; no quedan contratos a medias. |
| AC-PER-12 | Bloqueo tipado | Cuenta con bloqueo `transfer` | Se intenta transferir | Rechazo con causa; cobrar en caja sigue permitido. |
| AC-PER-13 | Bloqueo vencido | Bloqueo con `validTo` ayer | Corre JOB-PER-04 | Queda `expired` y ya no lo devuelve API-PER-41. |
| AC-PER-14 | Documento vencido | Certificado con 365 días de vigencia presentado hace 366 días, sin otro vigente | Corre JOB-PER-04 | `expired`; se ejecutan las acciones de vencimiento; un error en una acción no frena las otras. |
| AC-PER-15 | Fallecimiento | Titular con adherentes y es garante de otra cuenta | Se registra fallecimiento | Adhesiones de la persona en baja; tareas creadas; contratos sin cambios; la reconexión no reactiva al adherente fallecido. |
| AC-PER-16 | Autorización por acción | Autorizado con `pay` | Pide la baja de un contrato | `403` con `per/relationship-scope`. |
| AC-PER-17 | Relación vencida | Relación vence hoy | Al día siguiente el autorizado entra al portal | No ve la cuenta. |
| AC-PER-18 | Geocodificador caído | Proveedor responde 503 | Se guarda una cuenta | Se guarda con `geo.status = pending`; JOB-PER-02 reintenta. |
| AC-PER-19 | Calle inexistente | Loteo nuevo | Se carga el domicilio | Texto original conservado, punto `needsReview`, sin calle homónima. |
| AC-PER-20 | Historia bitemporal | Cambio de domicilio postal con vigencia 01/10 cargado el 15/10 | Se consulta al 05/10 por fecha efectiva | Devuelve el domicilio nuevo; por fecha de registro devuelve el anterior. |
| AC-PER-21 | Notas de sistema | Nota "Recategorización" | Un operador intenta editarla | `403`. |
| AC-PER-22 | Fusión con doble control | Caso `confirmedSame` solicitado por U1 | U1 intenta aprobar | Rechazo; U2 aprueba; tras la reversión las referencias vuelven a la persona original. |
| AC-PER-23 | Adherente repetido — **Reemplazado por el criterio de RF-SOC-013** (M18; HUECO-TRV-01); texto original: | Persona adherente activa en un contrato de sepelio | Se agrega en otro contrato de sepelio | Rechazo informando la cuenta; si PRM-PER-065, se ofrece dar de baja la anterior. |
| AC-PER-24 | Renumeración | Titular 1500 | Se renumera a 1600 | Cambia solo `holderNumber`; `_id` y referencias intactas; auditoría con aprobación. |
| AC-PER-25 | Importación | Archivo con 100 filas, 3 inválidas | Se importa | Vista previa con 3 errores; se confirman 97; informe descargable. |

### 17.2 Permisos negativos

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| AC-PER-30 | Cajero | Pide datos sensibles (API-PER-11) | `403`; la lectura no se registra como acceso exitoso. |
| AC-PER-31 | Usuario sin `per.padron.exportar` | Pide exportación | `403`. |
| AC-PER-32 | Atención sin `per.titulares.baja` | Pide la baja | `403`; el botón no aparece. |
| AC-PER-33 | Técnico de campo | Lista personas | Solo ve los puntos de sus órdenes asignadas. |
| AC-PER-34 | Usuario del portal con mismo correo que un titular, sin vínculo verificado | Llama a API-PER-68 | No recibe la cuenta del titular. |
| AC-PER-35 | Usuario del portal | Intenta vincular con 6 códigos erróneos | Bloqueo temporal (PRM-PER-102); intentos auditados; la respuesta no revela si el documento existe. |
| AC-PER-36 | Auditor | Intenta editar una cuenta | `403`. |

### 17.3 Aislamiento de tenant

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| AC-PER-40 | Persona con DNI X en TEN-001 | En TEN-002 se busca el DNI X | Sin resultados; no se crea caso de duplicado entre tenants. |
| AC-PER-41 | Token de TEN-002 | Se pide `GET /api/per/titulares/:holderId` de TEN-001 | `404` (no `403`, para no revelar existencia). |
| AC-PER-42 | Consulta de repositorio sin `tenantId` | Se ejecuta en prueba | El plugin la rechaza. |
| AC-PER-43 | Copia de configuración de TEN-001 a TEN-003 | Se ejecuta | No se copia ninguna persona, cuenta ni domicilio (RN-PER-117). |
| AC-PER-44 | Usuario con pertenencia a dos tenants | Cambia de tenant en la sesión | Vínculos, cuentas visibles, caché y descargas se recalculan. |

### 17.4 Reintentos, eventos y conciliación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| AC-PER-50 | ARCA no responde | JOB-PER-01 | 5 reintentos con backoff; luego `pending` y aviso; el alta no queda bloqueada salvo política. |
| AC-PER-51 | Evento `per.account.created` | Falla el broker | El outbox lo reenvía; los consumidores lo procesan una sola vez (deduplicación por `eventId`). |
| AC-PER-52 | Evento `tec.workOrder.closed` repetido | Llega dos veces | El traslado del punto se aplica una vez. |
| AC-PER-53 | Migración | Carga desde ProCoop | Conteos por tabla y sumas de control coinciden (sección 19). |
| AC-PER-54 | Socio existente con CUIT (DEC-097) | Compras lo da de alta como proveedor | El alta asistida propone la persona con puntaje 100; la ficha de proveedor queda con ese `personId` y el nombre y la CUIT se leen de M01; la ficha de la persona muestra los roles titular y proveedor (RF-PER-174, RN-PER-135). |
| AC-PER-55 | Persona ya registrada como chofer (DEC-097) | Se intenta crear otra ficha de chofer para la misma persona | El alta asistida avisa que ya existe y ofrece abrirla; no se crea una segunda ficha (RN-PER-135). |
| AC-PER-56 | Persona de ProCoop sin ningún documento (DEC-099) | T07 la migra | Queda con `identificationStatus = documentPending`, sin entrada en `personIdentifierIndex`, en el informe de migración y con una tarea de regularización en M09 (RN-PER-136). |
| AC-PER-57 | Dos personas `documentPending` con el mismo nombre fonético y domicilio (DEC-099) | Corre JOB-PER-03 | Se genera un aviso; no se abre caso de fusión ni se bloquea ninguna de las dos. |
| AC-PER-58 | Persona `documentPending` (DEC-099) | Se le carga un DNI ya usado por otra persona | Se abre un caso en `duplicateCases`; al resolverlo, la persona pasa a `identified`, se publica EVT-PER-27 y se cierra la tarea. |
| AC-PER-59 | Persona `documentPending` titular de una cuenta (DEC-099) | M05 intenta emitir un comprobante que exige documento del receptor | `per.getHolderSnapshot` informa `documentPending` y M05 rechaza la emisión con el motivo (la regla de emisión es de M05). |

### 17.5 ESC-01 — Pago excedente de un hermano

Dos hermanos con Internet en DIR-CASA-001. A (PER-H-A, INT-H-A-001) debe ARS 13.000 y paga ARS 15.000; B (PER-H-B, INT-H-B-001) tiene deuda propia. **Aporte de PER y criterio:** las cuentas de A y B son distintas y de titulares distintos (RN-PER-042); PER no ofrece ninguna relación que permita a M07 imputar el excedente de A a B por compartir domicilio (RN-PER-061, RN-PER-079); el pago se imputa por M07: ARS 13.000 a A y ARS 2.000 a favor de A o pendientes de aplicación según la política aprobada; la deuda de B no cambia. Si A quiere pagar la deuda de B, debe hacerlo como pagador explícito de la factura de B (RF-PER-107), lo que no le da acceso a los datos de B.

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son ficticios; los documentos usan marcadores que no son números válidos y los correos usan `example.com`. No se cargan datos reales de ProCoop.

| Código | Entidad | Datos | Uso |
|---|---|---|---|
| TEN-001 | Tenant | Cooperativa Demo de Servicios (Córdoba) | Tenant principal |
| TEN-002 | Tenant | Cooperativa Demo B (gas) | CU-REG-01 y aislamiento |
| PER-001 | Persona humana | Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa | CU-03, CU-04, CU-GEO-01 |
| ASO-001 | Asociada (M17) | Vínculo de asociada de PER-001 | CU-03 |
| TIT-001 | Titular | PER-001, número 1001, cuenta principal CTA-1001-01 | CU-04 |
| INM-001 | Inmueble | Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 | CU-04, CU-GEO-01 |
| DIR-DEMO-001 | Domicilio | Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales | CU-GEO-01 |
| SUM-AG-001 | Contrato (M02) | Agua residencial AG-RES, activación propuesta 01-11-2026 | CU-04 |
| PER-H-A / PER-H-B | Personas | Hermano A y Hermano B, DNI-A y DNI-B (marcadores) | CU-TIT-01, ESC-01 |
| DIR-CASA-001 | Domicilio | Domicilio compartido ficticio | CU-TIT-01 |
| INT-H-A-001 / INT-H-B-001 | Contratos (M02) | Internet, conexiones CON-A/CON-B, equipos MOD-A/MOD-B | CU-TIT-01, ESC-01 |
| PER-JUR-001 | Persona jurídica | Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) | CU-PER-04, RF-PER-069 |
| PER-REP-001 | Persona humana | Representante legal ficticio de PER-JUR-001 con relación vigente | CU-PER-04 |
| PER-AUT-001 | Persona humana | Hija ficticia de PER-001, autorizada `view`/`pay` | CU-PER-05 |
| INM-PH-001 | Inmueble | Edificio demo con 8 unidades funcionales | CU-PER-10 |
| USR-NUEVO-B | Usuario (T02) | `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite | CU-REG-01 |
| BLQ-001 | Bloqueo | Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" | CU-PER-07 |
| DUP-001 | Caso de duplicado | PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) | CU-PER-06 |

Catálogos precargados por defecto: tipos de documento con códigos ARCA (DNI 96, CUIL 86, CUIT 80 y demás), estados civiles, tipos de vínculo (incluido "discapacitado a cargo" exento de condiciones), causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, tipos de requisito de ejemplo (certificado de discapacidad 365 días, constancia de domicilio, poder).

## 19. Migración desde ProCoop

Ejecutada por T07 con las reglas de este anexo. Reglas generales: fechas centinela `1901-01-01` → `null`; textos recortados se migran completos si existen en el origen; códigos de ProCoop se guardan en el subdocumento `legacy` { `system`, `table`, `key`, `displayKey`, `runId`, `hash`, `readOnly` } de T05 §19.1 (CTR-DAT-32; antes campo `legacyCode`); las secuencias arrancan en el máximo migrado + 1; los números visibles se conservan; las referencias se resuelven por tabla de correspondencia `legacyId → _id` por tenant; ningún borrado físico del origen se replica.

| Origen (CAT) | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `PERSONAS` | `persons` | `TIP_DNI`/`NUM_DNI` y `CDI` → `identifiers` (el CDI calculado con `GenerarCuit` se migra `unverified` y `derivedFrom = calculatedFromDni` si coincide con el cálculo); `APELLIDOS`/`NOMBRES` → nombre o razón social según tipo; `SEXO`, `CIVIL`, `FEC_FAL` → campos; domicilio → `addresses` rol `real`; teléfonos y correo → `contacts` normalizados. Persona sin `TIP_DNI`/`NUM_DNI`, sin `CDI` y sin `SOCIOS.CUIT` → `identificationStatus = documentPending`, sin identificación inventada, con tarea de regularización en M09 (RN-PER-136, DEC-099); el resto → `identified`. | Conteo de personas; personas con identificación duplicada → `duplicateCases` (no se fusionan); % de CUIT con dígito válido; conteo de personas `documentPending` y avisos por nombre y domicilio. |
| `PERSONAS_EXTRAS` | `persons.workInfo` + `extra` | Columnas conocidas al conjunto "Datos laborales"; resto a campos extra definidos en T04. | Conteo de filas con datos. |
| `SOCIOS` | `holders` (+ M17 para asociado) | `COD_SOC` → `holderNumber` y `legacy.key` (CTR-DAT-32); `ALTA`, `BAJA`, `CAU_BAJA`, `CAUSA`, `ACTIVOBAJA` → estado y período; `CUIT` → identificación de la persona (si difiere del `CDI`, se registra discrepancia); `IBRUTOS` → cuenta principal; `COD_GAR` → `relationships` `guarantor`; `OBSERVA` → `notes`; `ACTIVO`, `NUM_SOC`, `ACCIONES`, `ACTA`, `REP_ASAMBLEA` → M17; `JURIDICO` → M08. | Conteo de titulares por estado; unicidad de `holderNumber`; titulares sin persona = 0. |
| `SUMSOC` | `accounts` | `COD_SUM`/`NUM_SUM` → `accountNumber`; `PRINCIPAL` (si hay 0 o >1 principales se elige la de menor número y se informa); domicilio → `addresses`; `COD_SIT`, `COD_SIB`, `NO_RESET` → `fiscal`; `EMAIL`, `MOVIL` → `contacts`; `BLOQUEAR_FAC_WEB` → `blocks` `webPayment`; `NOF_SUM` → `blocks` `billing`; `COD_GRU` → `accountingGroupId`. | Conteo; titulares con exactamente una principal = 100 %; cuentas sin titular = 0. |
| `SUMSOC_EXTRAS` | `accounts` (`contacts` fuente `legacyWeb`, `billingFlags`, `fileNumber`, `extra`); `autoDebit` → M07 | `CORREO_WEB`, `TELE_WEB` como contactos de portal; `EXCLUIR_REDONDEO`; `NROFICHA`; `DEBITO_360_*` a M07. | Conteo de marcas. |
| `SUMSOC_HST` | `perRevisions` (`account`) | Cada fila → revisión con `validFrom` = fecha del historial y `recordedAt` = fecha de registro (si no existe, igual a `validFrom`, marcada `source = migration`). | Revisiones por cuenta ≥ filas del origen. |
| `SERSOC` (parte PER) | `servicePoints`, `addresses`, `premises` (por catastro) y `relationships` | Domicilio del servicio → punto de prestación (se agrupan servicios con igual dirección normalizada y catastro); `CAT_*` → vínculo con `premises`; latitud/longitud → `geo` con `source = import` y `status = approximate` hasta confirmar; profesional → rol de persona. El contrato lo migra M02. | Contratos sin punto = 0. |
| `SERSOC_EXTRAS`, `SERSOC_HST`, `SERSOC_PRODUCTOS` | M02 (contrato); `GIS` → `servicePoints.gisRef`; historia de domicilio → `perRevisions` (`servicePoint`) | — | Conteo. |
| `PROPIEDA` | `premises` + `addresses` + `relationships` (`COD_PER` → `owner`) | Mapeo de la sección 7.7; `OBSERVA` → `notes`; columnas no identificadas → `legacyAttributes`; nomenclatura normalizada; duplicados de nomenclatura → informe (no se fusionan). | Conteo; nomenclaturas duplicadas listadas. |
| `ADHSOC` | **Reemplazado**: `serviceDependents` de M18 (T07 §19.1, O4; HUECO-TRV-01). M01 solo aporta las personas (`COD_PER`). Destino original: `adherents` (`kind = adherent`) | Fechas, vínculo, tarifa (referencia a M04), impresión, recupero. | Conteo por estado; adherentes activos repetidos en el mismo servicio listados. |
| `BENSOC` | **Reemplazado**: `serviceBeneficiaries` de M18 (T07 §19.1, RN-MIG-054; HUECO-TRV-01, HUECO-SEP-02). Destino original: `adherents` (`kind = beneficiary`) | `ACTIVO` → estado. | Conteo. |
| `VINCULOS` | catálogo `relationshipTypes` | `TIPO_VIN` → categoría; "DISCA" → exento. | Conteo. |
| `RELACION_ENTIDADES` | `relationships` | `TIPO_DESTINO`/`ID_DESTINO` → `target`; `FECHA` → `validFrom`. | Conteo. |
| `RESPONSA` | **No migra a M01** (DEC-104): técnicos, responsables y cobradores de campo → `fieldResources` de M10 (T07). Los garantes salen de `SOCIOS.COD_GAR` (fila `SOCIOS`) y del garante del servicio en `SERSOC` (**[VERIFICAR]** columna). *Reemplazado (10-11-2026): `RESPONSA` figuraba como origen de garantes y relaciones (glosario, RF-PER-101, 7.9 y 22.3).* | — | Filas de `RESPONSA` migradas a `relationships` = 0. |
| `PROVEED`, `VENDEDOR`, `CHOFERES`, `MEDICOS` (parte PER) | `persons` (vincular o crear) | T07 vincula cada registro con una persona existente por CUIT o documento (`PROVEED.CUIT`) o por nombre y domicilio con revisión, o crea la persona; sin documento queda `documentPending` (RN-PER-136). La ficha del rol la migran M12, M11 y M18 con el `personId` (RN-PER-135, DEC-097). | Registros de rol sin `personId` = 0; personas creadas por rol; vínculos propuestos por nombre para revisión. |
| `NOTA_SUM`, `NOTA_SUM1` | `notes` (+ `blocks` si `BLO_CAJ`) | `MSG_CAJ` → `visibility = cashier` y `cashierMessage` del bloqueo; cadenas `COD_NOT_ORI` → `revisions`. | Notas = filas del origen; bloqueos = notas con `BLO_CAJ`. |
| `NOT_ELIMINADAS_HST` | `notes` con `deletion` | Borradas lógicamente. | Conteo. |
| `SUMNOFAC` | `blocks` (`billing`) | Marca/desmarca → `appliedAt`/`lift`. | Conteo de vigentes. |
| `HISBLOQ`, `CAUBLOQ` | **Corregido (CTR-DAT-36)**: `HISBLOQ` (bloqueos de documentos) → `documentHolds` de M08; `CAUBLOQ` (motivos) → `holdReasons` de M08. M01 conserva en `blocks` solo los bloqueos de cuenta, titular o contrato (`SUMNOFAC`, `NOTA_SUM.BLO_CAJ`). Destino original: `blocks` (históricos), catálogo `blockReasons` | — | Conteo. |
| `TRAMITES`, `TRAMITES_ACCIONES`, `REQUISITOS`, `REQUISITOS_ITEMS` | `documentRequirementTypes` | `SCRIPT_ACCION` **no se migra**: se inventaría y se traduce manualmente a acciones tipadas (CTR-PER-18). | Requisitos con script → lista para revisión. |
| `PTRAMITES` | `documentSubmissions` | Estado calculado con RN-PER-097 a la fecha de migración. | Conteo por estado. |
| `TRANSFER` | `transfers` (`status = executed`, `source = migration`) | `TIPO_TRA` 1/2/3 → `accountTransfer`/`ownershipChange`/`capitalTransfer`; ítems agrupados por `ID_TRANS_CUENTA`. | Conteo. |
| `CAPITAL`, `CAPITAL_RES`, `RUBCAPI` | M17 | — | — |
| `VIAINGTE` | M09 (`crmChannels`, CTR-DAT-77) | — | — |
| `ADJUNTOS` (tipos 1, 2, 12, 14) | T11 con vínculo a la entidad PER | — | Conteo por tipo. |
| `DOCUMENT`, `EST_CIVIL`, `OCUPACIO`, `PROFESIO`, `DISTRITO_SECCION`, `USOINM`, `ESTINM` | Catálogos de 7.18 | Códigos ARCA/INAES/ENARGAS/SENASA conservados. | Conteo. |
| `CALLES`, `RNQCALL`, `BARRIOS`, `LOCALIDA`, `PROVINC`, `DEPTO`, `DEPARTA`, `PAISES`, `ZONAS`, `MAPA`, `FERIADOS` | T04 | Normalización contra Georef con informe de no encontradas. | Conteo; % normalizado. |
| MySQL de CoopOnline (claves web) | — | **No se migran** claves; los usuarios se registran y vinculan (CTR-PER-12). | — |

Conciliación final: informe por tenant con conteos origen/destino por tabla, diferencias explicadas, lista de duplicados propuestos, titulares sin principal corregidos, CUIT inválidos, nomenclaturas duplicadas, domicilios no normalizados, personas `documentPending` con su tarea (DEC-099) y personas vinculadas o creadas desde maestros de rol (DEC-097). Las pruebas usan copias anonimizadas (RN-PER-117).

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-PER-01 | DFA M3 y REL §2 (jerarquía Persona → Titular → Cuenta → Servicio) vs BASE §3–§4 (persona, asociado, inmueble, contrato) | ProCoop modela titular y cuenta; BASE habla de persona, asociado e inmueble sin cuenta explícita. | Se adoptan ambos: persona → titular → cuenta → grupo de facturación (M05) → contrato (M02) sobre punto de prestación e inmueble; asociado como relación de M17 (sección 2.3). | BASE manda en conceptos; DFA aporta estructura operativa no contradictoria. |
| CTR-PER-02 | CAT `SOCIOS` (`ACTIVO`, `NUM_SOC`) vs BASE §3 y AGR-029 | En ProCoop "socio" mezcla titular comercial y asociado. | Titular en PER; asociado en M17; la ficha muestra ambos. | BASE/AGR sobre legacy. |
| CTR-PER-03 | DFA M3 "cambio de titularidad preservando deuda" vs BASE §4 "no reasigna deuda" | Lectura posible de DFA: la deuda "sigue" al contrato. | La deuda queda en el titular anterior; asumirla requiere convenio de M08 (RN-PER-101, DEC-045). | BASE sobre DFA. |
| CTR-PER-04 | RN-06 `Validar_DeudaDomicilio` (bloquea por deuda en domicilio/catastro) vs BASE §83 (no trasladar deuda entre convivientes) | Control legacy puede negar servicio por deuda ajena. | Advertencia sin revelar datos; bloqueo solo por política validada (PA-PER-03). | BASE sobre RN. |
| CTR-PER-05 | RN-06 `GenerarCuit` vs BASE §83 (relación DNI↔CUIT solo verificada) | ProCoop guarda el CUIL calculado como dato. | Se propone como no verificado (PA-PER-04). | BASE sobre RN. |
| CTR-PER-06 | V2 2077 (permitir DNI duplicado) vs BASE §3 (una persona por tenant) | Política legacy permite duplicar. | Único con excepción aprobada y auditada (DEC-044). | BASE sobre parámetros. |
| CTR-PER-07 | CAT `NOTA_SUM.BLO_CAJ`, `SUMSOC.BLOQUEAR_FAC_WEB`, `SUMNOFAC` vs DFA mejora "bloqueos tipados" | Bloqueos dispersos en notas y marcas. | Colección `blocks` con efectos tipados. | DFA mejora + AGR-002 sobre legacy. |
| CTR-PER-08 | CAT `*_EXTRAS` vs DEC (configuración por T04) | Columnas extra por tabla. | Campos extra tipados del motor de T04. | Decisiones rectoras sobre legacy. |
| CTR-PER-09 | CAT `*_HST` (copias completas) vs AGR-010 (bitemporal) | Historia sin fecha efectiva. | `perRevisions` bitemporal. | AGR sobre legacy. |
| CTR-PER-10 | RN-06 `ModificacionEspecial_Socio`/`CambiarCuenta` (renumeración por SQL en ~60 tablas) vs DEC-002/AGR-010 | Renumerar reescribe referencias. | Solo cambia el número visible; IDs inmutables (RN-PER-041). | Decisiones rectoras. |
| CTR-PER-11 | RN-06 `UnificarEntidades` (borra duplicados) vs BASE §3 (no fusionar automáticamente) | Unificación destructiva. | Casos de duplicado + fusión aprobada y reversible; calles/barrios a T04, cuentas contables a M15. | BASE. |
| CTR-PER-12 | RN-06 `GenerarClaveWeb` (clave por socio o DNI) vs BASE §67 REG-001 y AGR-006 | Acceso por clave compartida. | Usuario de T02 + vínculo verificado (DEC-043); clave descartada. | BASE/AGR. |
| CTR-PER-13 | V2 2461 (actualizar domicilio de servicios al modificar la cuenta) vs BASE §77 (domicilio de prestación distinto del postal) | Copia automática mezcla roles de domicilio. | Copia solo explícita, con confirmación (RN-PER-063). | BASE. |
| CTR-PER-14 | RN-06 (condición IVA por cuenta, `COD_SIT`) vs DFA M3 (condición fiscal de la persona) | ¿IVA de la persona o de la cuenta? | Perfil fiscal en la persona (constancia ARCA) y condición IVA operativa en la cuenta, con advertencia si difieren (RF-PER-058). | Legacy confirmado por el código + mejora DFA. |
| CTR-PER-15 | RN-06 `SincronizarCuentas` (MySQL web) vs DEC (base única) | Contactos web en otra base. | Contactos con fuente `portal` en la misma colección; sin sincronización (RN-PER-023). | Decisiones rectoras. |
| CTR-PER-16 | RN-06 §4 (estado derivado de fechas y centinela) vs AGR-003 (estados explícitos) | Estado calculado de fechas. | Estados explícitos en todas las entidades de PER (sección 8); centinela → null. | AGR. |
| CTR-PER-17 | RN-06 §3.2 punto 8 (`REG_GARANTE` siempre bloquea) vs V2 2544 (niveles) | Garante sin niveles en servicio. | Tres niveles por política en servicio, cuenta y titular (RN-PER-081). | Parámetro explícito sobre comportamiento implícito; Duda 22.4 queda en M02. |
| CTR-PER-18 | CAT `TRAMITES_ACCIONES.SCRIPT_ACCION` (SQL libre) vs T08 seguridad | Ejecución de SQL configurable. | Acciones tipadas de catálogo (RN-PER-098). | T08/decisiones rectoras. |
| CTR-PER-19 | RN-06 `Validar_Titular` (CUIT exigido al guardar la cuenta) vs BASE §67 (no exigir CUIT para registrarse) | Momento de la exigencia. | Exigencia al activar contratos o emitir (RN-PER-008, RN-PER-121). | BASE. |
| CTR-PER-20 | CAT `SOCIOS.CUIT` vs `PERSONAS.CDI` | Dos lugares para la CUIT, a veces distintos. | Una sola lista de identificaciones en la persona; diferencias de migración → discrepancia para revisar. | Modelo nuevo; migración informa. |
| CTR-PER-21 | DFA M3 (`ADHSOC` = adhesiones del socio como factura por mail o débito; `BENSOC` = beneficios o tarifa social) vs CAT §1 y RN-06 §10 (`ADHSOC`/`BENSOC` con persona, vínculo, tarifa de adherente, fechas) | Distinta interpretación de las tablas. | Se sigue el código y el catálogo: `ADHSOC`/`BENSOC` → adherentes y beneficiarios de un contrato, en `serviceDependents`/`serviceBeneficiaries` de M18 (HUECO-TRV-01; antes `adherents` de M01). La adhesión a factura electrónica va a `accounts.invoiceDelivery`, el débito automático a M07 y la tarifa social a M02/M04. | Código relevado (RN, CAT) sobre descripción funcional derivada (DFA) en hechos del legacy. |
| CTR-PER-22 | DFA M3 Relaciones (`RESPONSA` como fuente de responsables y garantes) vs CAT (`RESPONSA` = responsables, técnicos y cobradores, usuarios operativos: `NOM_RES`, `ACTIVIDAD`, `ASIGNAOT_PMOVIL`) y T07 (`RESPONSA` → `fieldResources` de M10) | Interpretación de la tabla. | `RESPONSA` no es fuente de garantes ni de relaciones de M01; migra a M10. Fuente de garantes: `SOCIOS.COD_GAR` y garante del servicio en `SERSOC` (**[VERIFICAR]**). Se marcan como reemplazados el glosario, el origen de RF-PER-101, 7.9 y la fila de 22.3 (DEC-104 punto 2, 10-11-2026). | Catálogo relevado sobre descripción funcional derivada (mismo criterio que CTR-PER-21). |
| CTR-PER-23 | CAT `PROVEED`, `VENDEDOR`, `CHOFERES`, `MEDICOS` (maestros con identidad propia, aislados de `PERSONAS`) vs BASE §3 (persona única) | Una misma persona se carga en varios maestros con datos distintos. | Persona única en M01; los maestros de rol guardan `personId` obligatorio y solo los datos del rol; alta asistida con control de duplicados (RF-PER-174, RN-PER-135; DEC-097, 10-11-2026). | BASE y decisión sobre legacy. |

## 21. Preguntas abiertas

### PA-PER-01 — Método de verificación del vínculo usuario–persona

- **Pregunta:** ¿cómo prueba un usuario registrado que es el titular (o su representante) para ver sus cuentas?
- **Contexto:** REG-001 separa registro de acceso; ProCoop usaba una clave por socio o el DNI (V2 914/800), que no prueba identidad.
- **Opciones:** **A (Recomendada):** código impreso en la factura + número de documento, o código de un solo uso al contacto ya registrado en la cuenta, o validación presencial; intentos limitados. **B:** solo validación presencial. **C:** documento + número de cuenta sin segundo factor.
- **Impacto si no se responde:** se aplica A; sin definición no se habilita autogestión en el portal.
- **Bloquea:** RF-PER-159, PAN-PER-26, API-PER-70, M19.
- **Estado:** Respondida (DEC-043): opción A.

### PA-PER-02 — Documento duplicado

- **Pregunta:** ¿se permite que dos personas del tenant tengan el mismo tipo y número de documento?
- **Contexto:** V2 2077 lo permite; V2 3196 solo si la anterior está de baja; BASE exige una persona única.
- **Opciones:** **A (Recomendada):** único, con excepción aprobada y motivo (casos de error de origen o documentos reemplazados). **B:** único sin excepciones. **C:** permitir duplicados con advertencia.
- **Impacto:** se aplica A; la migración lista duplicados.
- **Bloquea:** RF-PER-025, RN-PER-005, migración.
- **Estado:** Respondida (DEC-044): opción A.

### PA-PER-03 — Deuda en el domicilio o catastro

- **Pregunta:** ¿la deuda de otra cuenta en el mismo domicilio o inmueble puede impedir un alta o cambio de titular?
- **Contexto:** `Validar_DeudaDomicilio` lo controla; BASE §83 prohíbe trasladar deuda entre convivientes; puede haber normativa local para casos de usurpación o fraude.
- **Opciones:** **A (Recomendada):** advertir sin revelar el detalle a terceros; bloqueo opcional por servicio solo con política validada por asesoría legal. **B:** solo advertencia, nunca bloqueo. **C:** bloqueo como en ProCoop.
- **Impacto:** se aplica A con `warn`.
- **Bloquea:** RN-PER-062, API-PER-34, PRM-PER-052.

### PA-PER-04 — CUIL calculado

- **Pregunta:** ¿se propone el CUIL calculado a partir de DNI y sexo?
- **Contexto:** ProCoop lo genera y guarda; puede no coincidir con el real (prefijo 23/24 o cambio de sexo registral).
- **Opciones:** **A (Recomendada):** proponer como "no verificado" y no usarlo fiscalmente hasta verificar en ARCA o con documento. **B:** no calcular nunca. **C:** usarlo como válido (como ProCoop).
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-022, RN-PER-006, migración del `CDI`.

### PA-PER-05 — Verificación en ARCA

- **Pregunta:** ¿cuándo se consulta el padrón de ARCA y con qué credenciales?
- **Contexto:** ProCoop solo lo hace en un informe; hace falta certificado y el servicio tiene límites.
- **Opciones:** **A (Recomendada):** al alta y al cambio de CUIT, más revalidación periódica configurable (30 días), con certificado gestionado por la plataforma o el tenant; discrepancias advierten. **B:** solo a pedido del operador. **C:** al alta y bloquear ante discrepancia.
- **Impacto:** se aplica A; sin certificado queda "pendiente".
- **Bloquea:** RF-PER-020, RF-PER-029, JOB-PER-01/10, PRM-PER-014.

### PA-PER-06 — Deuda en el cambio de titularidad

- **Pregunta:** ¿qué ocurre con la deuda del titular anterior?
- **Contexto:** BASE §4 prohíbe reasignarla automáticamente; DFA habla de "preservar deuda".
- **Opciones:** **A (Recomendada):** queda en el titular saliente; el nuevo solo la asume mediante convenio expreso de M08 con su consentimiento. **B:** igual que A pero el cambio se bloquea si hay deuda (PRM-PER-075 = `block`). **C:** la deuda acompaña al contrato.
- **Impacto:** se aplica A; C queda descartada por BASE.
- **Bloquea:** RF-PER-133, RN-PER-101, M08.
- **Estado:** Respondida (DEC-045): opción A.

### PA-PER-07 — Clonar o mover el contrato al transferir

- **Pregunta:** ¿el cambio de titularidad crea un contrato nuevo o reasigna el existente?
- **Contexto:** ProCoop clona por defecto y tiene un modo que mueve (V2 422).
- **Opciones:** **A (Recomendada):** clonar siempre: contrato de origen `notInForce` y nuevo en la cuenta destino, con referencia mutua. **B:** mover conservando el identificador con una nueva vigencia de titular. **C:** configurable.
- **Impacto:** se aplica A; M02 debe soportar la referencia origen–destino.
- **Bloquea:** RN-PER-104, JOB-PER-07, M02.

### PA-PER-08 — Efectos del fallecimiento

- **Pregunta:** ¿qué hace el sistema al registrar el fallecimiento de un titular?
- **Contexto:** ProCoop da de baja adhesiones y beneficios y avisa tareas; no corta servicios.
- **Opciones:** **A (Recomendada):** registrar con evidencia, dar de baja adhesiones y beneficios de la persona, revocar relaciones, crear tareas (sucesión, garante) y no cortar ni facturar distinto. **B:** además bloquear nuevas contrataciones de la cuenta. **C:** solo registrar la fecha.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-009, RN-PER-014.

### PA-PER-09 — Cuenta principal y titular sin cuentas

- **Pregunta:** ¿todo titular activo debe tener exactamente una cuenta principal?
- **Contexto:** V2 2374, 3164, 3193 y 2324 crean excepciones.
- **Opciones:** **A (Recomendada):** exactamente una principal si tiene cuentas; sin cuentas solo en estado "solicitante"; excepciones de V2 3164/3193 como políticas. **B:** principal opcional. **C:** como ProCoop, todo por parámetro.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-056, RN-PER-029, RN-PER-030.

### PA-PER-10 — Control de la fusión de personas

- **Pregunta:** ¿quién aprueba una fusión y si puede revertirse?
- **Opciones:** **A (Recomendada):** solicita un usuario, aprueba otro con `per.personas.unificar` (antes `per.personas.fusionar`); reversible durante 30 días (PRM-PER-099). **B:** un solo usuario con permiso. **C:** sin reversión.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-157, JOB-PER-08.

### PA-PER-11 — Datos mínimos para registrar una persona

- **Pregunta:** ¿qué datos son obligatorios al registrar una persona desde el portal o atención?
- **Opciones:** **A (Recomendada):** nombre, una identificación y un contacto; DNI/CUIT verificado antes de contratar. **B:** solo nombre y contacto. **C:** todos los datos fiscales desde el inicio.
- **Impacto:** se aplica A (PRM-PER-095).
- **Bloquea:** CU-REG-01, RF-PER-001.

### PA-PER-12 — Autorizaciones otorgadas desde el portal

- **Pregunta:** ¿qué puede conceder el titular desde la app sin intervención de la cooperativa?
- **Opciones:** **A (Recomendada):** autorizar a mayores de 18 a consultar y pagar; acciones mayores (bajas, cambios) requieren validación con evidencia. **B:** cualquier acción. **C:** nada desde el portal.
- **Impacto:** se aplica A (PRM-PER-096/097).
- **Bloquea:** RF-PER-105, PAN-PER-27.

### PA-PER-13 — Proveedor geográfico

- **Pregunta:** ¿qué servicios se usan para normalizar, geocodificar y mostrar mapas?
- **Contexto:** BASE §77 pide Google Maps y catálogo nacional; hay costos y términos de uso.
- **Opciones:** **A (Recomendada):** Georef para normalización y geocodificación por altura; Google Maps para mapa y autocompletado con resultados confirmados. **B:** solo Google. **C:** solo catálogo propio de T04.
- **Impacto:** se aplica A (PRM-PER-101).
- **Bloquea:** JOB-PER-02, PAN-PER-06, T04.
- **Estado:** Respondida (DEC-046): opción A.

### PA-PER-14 — Conservación y anonimización

- **Pregunta:** ¿cuánto se conservan los datos personales de personas sin relación vigente y qué se anonimiza?
- **Opciones:** **A (Recomendada):** plazos por categoría configurables (por defecto 10 años desde la última obligación para datos fiscales), anonimización del resto, validado por asesoría legal. **B:** conservar todo indefinidamente. **C:** borrar al pedido.
- **Impacto:** se aplica A con T08.
- **Bloquea:** RF-PER-165, JOB-PER-11, PRM-PER-100.

### PA-PER-15 — Numeración de titulares y asociados

- **Pregunta:** ¿una o dos series de números?
- **Contexto:** V2 32 permite numerar asociados y no asociados por separado; `NUM_SOC` (NIP) es el número de asociado.
- **Opciones:** **A (Recomendada):** número de titular único en PER y número de asociado propio en M17. **B:** dos series de titular según condición de asociado. **C:** un solo número compartido.
- **Impacto:** se aplica A; la migración conserva ambos números.
- **Bloquea:** RF-PER-042, PRM-PER-002, M17.
- **Estado:** Respondida (DEC-017, registrada como PA-CFG-P1-01): secuencia única por tenant con atributo de tipo; número manual solo en migración. El número de asociado sigue siendo propio de M17.

### PA-PER-16 — Bloqueo de cobro en caja

- **Pregunta:** ¿el bloqueo `cashPayment` rechaza el cobro o pide autorización?
- **Contexto:** `BLO_CAJ` bloquea; rechazar pagos puede perjudicar la cobranza.
- **Opciones:** **A (Recomendada):** requiere autorización de supervisor y muestra el mensaje. **B:** rechazo absoluto. **C:** solo advertencia.
- **Impacto:** se aplica A (PRM-PER-073).
- **Bloquea:** RF-PER-123, M07.

### PA-PER-17 - Destino de referencias sin colección dueña conocida
- **Pregunta:** ¿a qué colección apuntan `accounts.accountingGroupId` y `personIdentifierIndex.exceptionId`?
- **Contexto:** la corrección de inconsistencias del 05-11-2026 agregó la columna de referencia a las tablas del §7; estos dos campos no tienen destino en T05 ni en el texto del anexo y quedaron `[VERIFICAR]`.
- **Opciones:**
  - A) **(Recomendada)** `accountingGroupId` → catálogo de grupos contables de M15 y `exceptionId` → excepciones de unicidad de identificadores aprobadas en M01; el dueño de T05 agrega ambas referencias.
  - B) Quitar los campos si no los usa ningún RF ni RN.
- **Impacto si no se responde:** las referencias siguen `[VERIFICAR]` y no se generan índices ni validaciones de integridad para esos campos.
- **Bloquea:** T05 §7.2 (referencias canónicas).
- **Estado:** Asumida (DEC-072): opción A. `accounts.accountingGroupId` apunta al catálogo de grupos contables de M15 (reemplazado por `collectionAccountingGroups` de M07, PA-COB-20) y `personIdentifierIndex.exceptionId` a la excepción de unicidad aprobada de RN-PER-005 (M01); aplicado en las tablas del §7. T05 debe agregar ambas referencias. El destino de `exceptionId` lo reemplaza PA-PER-18 (`approvalRequests` de T11).

### PA-PER-18 - Destino de `exceptionId` y estados de `premises` (cierre, segunda ronda)
- **Pregunta:** ¿`personIdentifierIndex.exceptionId` apunta a una colección propia de excepciones de M01 o a la aprobación de T11? ¿Se confirman los estados de `premises` (`active`, `merged`, `archived`) y la baja lógica sin RN explícita?
- **Contexto:** PA-PER-17 dejó el destino como «excepción aprobada en M01», pero M01 no declara esa colección y T05 lo dejó `[VERIFICAR]`. La excepción de RN-PER-005 es una aprobación de un usuario distinto, que T11 ya modela.
- **Opciones:**
  - A) **(Recomendada)** `exceptionId` → `approvalRequests` de T11 (la excepción es un pedido de aprobación aprobado); sin colección propia en M01. Estados de `premises` como están en §7 y §8.14.
  - B) Colección propia `identifierExceptions` en M01.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T05 §7.2 (`exceptionId`), RN-PER-005, §8.14.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en la ficha de `personIdentifierIndex` (§7) y en la transición `active` → `archived` de `premises` (§8.14). El campo conserva el nombre `exceptionId` porque forma parte del índice único; T05 debe registrar la referencia a `approvalRequests`.

### PA-PER-19 — Residuales de estados, referencias y nombres (ronda del 05-11-2026)
- **Pregunta:** ¿Cómo se tratan las máquinas de §8 que describen colecciones absorbidas por otro dueño, la referencia `streetRequestId` sin destino legible y la diferencia de nombres de `relationships` con T05?
- **Contexto:** al regenerar los entregables, 06a §6 marcó `dataSubjectRequests` (§8.12, sin estado inicial) y `personUserLinks` (§8.13) como máquinas sobre colecciones que T05 absorbe en T08 y T02; 03-er marcó `addresses.streetRequestId` sin destino; 03 §29 punto 7 citó `fromPersonId`/`toPersonId` para `relationships`, pero T05 COL-PER-10 ya usa `subjectPersonId` y `target` (el generador leyó el texto «antes»).
- **Opciones:**
  - A) **(Recomendada)** Mantener las subsecciones como referencia del circuito que inicia M01 con nota de colección absorbida y dueño del estado (T08, T02), explicitar el estado inicial `received`; declarar `streetRequestId` → `streetProposals` (T04); confirmar `subjectPersonId`/`target` como nombres canónicos (sin cambios en M01).
  - B) Marcar las subsecciones como reemplazadas y mover el texto a T08 y T02.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), T05 §7.2.1.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.5 (`streetRequestId`), §7.9 (nota de alineación), §7.1 y §7.13 (tablas asociadas a `personIdentifierIndex` y `documentSubmissions`), §8.12 y §8.13. T05 no necesita cambio en `relationships`; el destino de `premises.units` (`unitId`) es el subdocumento de `premises` y T05 §7.2.1 puede cerrar su [VERIFICAR].
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M01 declara en §12.1 EVT-PER-26 `per.person.fiscalLookupRequested` (antes `per.person.fiscal-lookup-requested`, nombre que solo figuraba en T06 §12), publicado por JOB-PER-01 al dar de alta o cambiar un CUIT/CUIL o al verificar a pedido; payload `personId`, `identifierId`; consumidor T06. T11 §12.4 registra el alias.

## 22. Trazabilidad de fuentes

### 22.1 BASE

| Fuente | Elemento | Destino en este anexo |
|---|---|---|
| BASE §3 Objetivo y límite | Identidad única por tenant; ser asociado no activa prestación | Sección 1, 2; RN-PER-001, RN-PER-004 |
| BASE §3 | Registrar personas físicas y jurídicas | RF-PER-001, RF-PER-004, RF-PER-005 |
| BASE §3 | Datos identificatorios, fiscales y de contacto | RF-PER-001, RF-PER-018..039 |
| BASE §3 | Distinguir asociado, cliente no asociado, solicitante y beneficiario | RF-PER-015, RF-PER-043, RF-PER-044, RF-PER-050; RN-PER-003 |
| BASE §3 | DNI/CUIT y relaciones verificadas entre identificaciones | RF-PER-018, RF-PER-021; RN-PER-006 |
| BASE §3 | Domicilios personales, fiscales y de correspondencia | RF-PER-075; 7.1 `addresses` |
| BASE §3 | Documentación y vencimiento | RF-PER-008, RF-PER-129, RF-PER-130 |
| BASE §3 | Detectar duplicados | RF-PER-155..158; JOB-PER-03 |
| BASE §3 | Representantes y autorizados | RF-PER-099..106 |
| BASE §3 | Historial de cambios | RF-PER-151..154 |
| BASE §3 | Ingreso, baja y situación del asociado | RF-PER-044 (lectura); gestión en M17 |
| BASE §3 | Ficha con contratos, inmuebles, facturas, pagos y gestiones | RF-PER-145, PAN-PER-02 |
| BASE §3 | Preferencias de comunicación y autorizaciones | RF-PER-037, RF-PER-039 |
| BASE §3 Regla de diseño | Varios servicios en varios inmuebles sin duplicar; membresía, titularidad y ocupación como relaciones distintas | RF-PER-003, RN-PER-003, CTR-PER-02 |
| BASE §3 Requisito multitenant | Padrón propio; sin cruce ni fusión entre tenants; credencial multi-tenant | RN-PER-002, RF-PER-158, CU-PER-08; credencial: T02 |
| BASE §3 CU-03 y precarga | Alta sin duplicar | Sección 16 CU-03; sección 18 PER-001, ASO-001 |
| BASE §4 | Inmuebles, unidades, parcelas, ubicaciones | RF-PER-086..092 |
| BASE §4 | Catálogo de calles y direcciones normalizadas; georreferenciación y Google Maps | RF-PER-073..085 |
| BASE §4 | Contrato por prestación con titular DNI/CUIT; estados del contrato; fechas de solicitud/instalación | Delegado a M02 (sección 2.2); PER aporta RF-PER-024, contrato de interfaz 7.8 |
| BASE §4 | Varios contratos del mismo servicio en un domicilio; sin unicidad domicilio + servicio | RF-PER-093, RN-PER-060, RN-PER-061 |
| BASE §4 | Propietario, ocupante, titular y responsable de pago | RF-PER-088, RF-PER-140 |
| BASE §4 | Cambios de titularidad con fecha efectiva; mudanzas y transferencias | RF-PER-098, RF-PER-132..141 |
| BASE §4 | Condiciones comerciales particulares; adjuntar contratos; instalaciones y equipos; interrupciones | M02, T11, M10, M09 (sección 2.2) |
| BASE §4 Caso importante | No reescribir el pasado al cambiar titular | RN-PER-100, RN-PER-112 |
| BASE §4 CU-04 y precarga | Contrato sobre inmueble | Sección 16 CU-04; sección 18 INM-001, SUM-AG-001 |
| BASE §33 | Entidades Persona, Asociado, Relación/representación, Inmueble, Dirección de prestación, Contrato, Consentimiento y finalidad | Sección 7 (`persons`, `holders`, `relationships`, `premises`, `servicePoints`, `consents`); Asociado → M17; Contrato → M02 |
| BASE §37, §41, §57, §63 | Pendientes sobre límites persona/asociado/usuario, credenciales multi-tenant, ejemplos | PA-PER-01, PA-PER-11, PA-PER-15; CU-PER-08; resto en T02/M17 |
| BASE §39.6 | Perfiles Atención, Asociado y demás | Sección 4 |
| BASE §67 REG-001 y CU-REG-01 | Registro sencillo sin suministro ni asociación | RF-PER-159, RN-PER-118, RN-PER-121; CU-REG-01; sección 18 USR-NUEVO-B |
| BASE §68 CTA-001 (referencia) | Cuentas separadas o unificadas | RF-PER-071 (estructura); política en M07 |
| BASE §71 | Pendientes de catálogo, cuentas y lotes | RF-PER-071; M02/M05 |
| BASE §77 GEO-001 | Listado de calles de Argentina | RF-PER-073; T04 catálogo |
| BASE §77 GEO-002 | Dirección de prestación georreferenciada | RF-PER-076, RF-PER-093 |
| BASE §77 GEO-003 | Mapa Google Maps | RF-PER-076; sección 13 |
| BASE §77 Alcance (9 viñetas) y límites | Texto original/normalizado, confirmar/corregir, estados, historia, coordenadas sin calle, caída de proveedor, catálogo separado, control de acceso, permiso de ubicación, términos de proveedores | RF-PER-074..082, RN-PER-066..071 |
| BASE §77 CU-GEO-01 | Domicilio de prestación | Sección 16; sección 18 DIR-DEMO-001 |
| BASE §83 TIT-001 | Contrato con DNI o CUIT | RF-PER-024, RN-PER-008; contrato de interfaz 7.8 |
| BASE §83 TIT-002 | Múltiples contratos en un domicilio | RF-PER-093, RN-PER-060 |
| BASE §83 TIT-003 | Titulares y pagos independientes | RN-PER-042, RN-PER-061, RF-PER-107 |
| BASE §83 Modelo y límites (8 viñetas) | DNI/CUIT del titular; DNI↔CUIT verificado; roles distintos; excepción sin inventar; registro previo; privacidad del domicilio; autorización técnica | RF-PER-021, RF-PER-026, RF-PER-094, RN-PER-003, RN-PER-076, RN-PER-079, RN-PER-121 |
| BASE §83 CU-TIT-01 | Hermanos en el mismo domicilio | Sección 16; sección 18 |
| BASE §97.1 (7 viñetas y control) | Inventario, consentimientos, derechos, sensibles, minimización, registro de bases e incidentes, datos de prueba | RF-PER-014, RF-PER-039, RF-PER-163..167; RN-PER-017, RN-PER-117; registro de bases e incidentes → T08 |
| BASE §98, §101, §106 | Pendientes de revisión (ARCA, datos personales, mercado) | PA-PER-05, PA-PER-14; RF-PER-029 |
| BASE §103 FAC-006, FAC-012 (referencia) | Grupos de facturación dentro de la cuenta | RN-PER-057, RF-PER-069; M05 |

### 22.2 AGR, ESC y CNX

| Fuente | Destino |
|---|---|
| AGR-002 (dueño de datos y eventos) | Encabezado "Dueño de datos"; sección 12; RF-PER-124, RF-PER-172 |
| AGR-003 (estados explícitos y reversión, referencia) | Sección 8; RF-PER-010, RF-PER-136; CTR-PER-16 |
| AGR-006 (identidad, usuario y pertenencias) | RF-PER-159..162; RN-PER-119, RN-PER-120; PA-PER-01 |
| AGR-007 (representaciones, autorizaciones, pagadores) | RF-PER-099..107, RF-PER-140; RN-PER-078..080 |
| AGR-010 (bitemporalidad) | RF-PER-151, RF-PER-152; RN-PER-111, RN-PER-112; 7.16; CTR-PER-09 |
| AGR-029 (asociado vs servicio, referencia) | RN-PER-004; CTR-PER-02 |
| AGR-033 (privacidad y borrado de cuenta de acceso) | RF-PER-163..165; RN-PER-116 |
| ESC-01 | Sección 17.5 |
| CNX §2.4 (licencias y alcance) | Sección 4 (alcance por rol) |
| CNX §3.5 (PWA) | PAN-PER-25..27 (sección 10.10) |
| CNX §4.2 (admin, ExcelImportWizard, modales, DataTable) | Sección 10; PAN-PER-24; RF-PER-168 |

### 22.3 DFA y REL

| Fuente | Elemento | Destino |
|---|---|---|
| DFA M3 Jerarquía | Persona → Titular → Cuenta → G.F. → Servicio | Sección 2.3; CTR-PER-01 |
| DFA M3 Administración de Titulares | Búsquedas, acciones y grilla | RF-PER-142..144; PAN-PER-01 |
| DFA M3 Administración de Personas | Personas separadas de titulares | RF-PER-017; PAN-PER-03 |
| DFA M3 Ficha del titular | Pestañas, árbol, panel de trámites, observaciones con bloqueo, adjuntos, WhatsApp/e-mail | RF-PER-145, RF-PER-069, RF-PER-131, RF-PER-118, RF-PER-123, RF-PER-128, RF-PER-038 |
| DFA M3 Consultas e informes | — | Sección 15 |
| DFA M3 Datos de cada cuenta | Domicilio, IVA, descripción | RF-PER-055, RF-PER-058; `accounts.description` |
| DFA M3 Relaciones | `VINCULOS`, `RELACION_ENTIDADES`; `RESPONSA` no es fuente de M01 (→ M10, CTR-PER-22). *Reemplazado (10-11-2026, DEC-104): "`VINCULOS`, `RESPONSA`, `RELACION_ENTIDADES`".* | RF-PER-099, RF-PER-101; 7.9; CTR-PER-22 |
| DFA M3 Datos personales | `EST_CIVIL`, `OCUPACIO`, `PERSONAS_EXTRAS` | RF-PER-004, RF-PER-006, RF-PER-007 |
| DFA M3 Inmuebles | `PROPIEDA`, `PROPIESER`, `USOINM`, `ESTINM`, `PROPIEITEMS*` | RF-PER-086..090; 7.7, 7.8 |
| DFA M3 Adhesiones y beneficios | `ADHSOC`, `BENSOC`, carpeta tarifa social | RF-PER-109..117; CTR-PER-21; tarifa social → M02/M04 |
| DFA M3 Trámites | `TRAMITES`, `TRAMITES_ACCIONES`, `PTRAMITES`, `REQUISITOS`, `REQUISITOS_ITEMS`, `EXPEDIENTES`, `EXPEDIENTES_TRAM`, Procoop WEB | RF-PER-129, RF-PER-130; 7.13; expedientes → T11/M09; publicación web → M19 |
| DFA M3 Documentación | `ADJUNTOS`, `ARCHIVOS`, `DOCUMENT`, `NOTA_SUM` | RF-PER-128 (T11), 7.18 `documentTypes`, 7.11 |
| DFA M3 Historia | `SUMSOC_HST`, `SERSOC_HST`, `HISBLOQ`, `CAUBLOQ` | 7.16, 7.12 |
| DFA M3 Tablas núcleo | `PERSONAS`, `SOCIOS`, `SUMSOC`, `SERSOC` (+ `ACTAFIP`, `SERSOC_PRODUCTOS`, `SERSOC_REDES`, `SERSOC_DEMANDASXPERIODO`) | 7.1, 7.3, 7.4; `SERSOC` y relacionadas → M02/M03/M10 |
| DFA M3 Mejoras | Ficha 360, validaciones CUIT/ARCA, domicilios normalizados, bloqueos tipados, cambio de titularidad | RF-PER-145, RF-PER-019/020, RF-PER-073..080, RF-PER-123, RF-PER-133; CTR-PER-03 |
| DFA §31.1 | Alta de suministro (parte PER: titular, cuenta, domicilio, inmueble) | Secciones 9.2, 9.4; RN-PER-122 |
| REL §2 | Jerarquía y ejemplo de la Municipalidad | Sección 2.3; RF-PER-069; sección 18 PER-JUR-001 (ficticia) |
| REL §2 | Ficha en solo lectura | RF-PER-145 |
| REL §2 | Latitud/longitud, referencia, profesional y certificado, garante, GIS en el servicio | 7.5 `geo`, 7.8, RF-PER-016, RF-PER-101, RF-PER-097 |

### 22.4 RN-06 (titulares, servicios, medidores y consumos)

| Sección | Contenido | Destino |
|---|---|---|
| §1 | Alcance y fuentes | Encabezado "Fuentes consolidadas" |
| §2 | Jerarquía del padrón; `CrearPersona`, `GetIdSocio`, `Guardar_SUMSOC`, `GuardarHistorial`, `ValidarNumeroAsociado` | Sección 2.3; RN-PER-006, RN-PER-026, RN-PER-045; RF-PER-040, RF-PER-151 |
| §3.1 | Validaciones del titular (DNI único, CUIT por IVA, ARCA, `EsDni`, contactos, principal, `Validar_Domicilio`) | RN-PER-005..013, RN-PER-019, RN-PER-029, RN-PER-059 |
| §3.2 puntos 1–9 | `ValidarServicio` (servicio/domicilio, fecha, categoría, matrícula, catastro e inmueble, grupo, actividad, clase, zona, dispositivo, factibilidad, garante, tarifa social) | RN-PER-122 (delegado a M02); punto 4 → RN-PER-073/074; punto 8 → RN-PER-081, CTR-PER-17 |
| §3.3 | Configuración por servicio | RN-PER-123 (M02) |
| §3.4 | Guardado transaccional | RN-PER-124 |
| §3.5 | Altas automáticas `ALTASEAU` | RN-PER-125 (M02) |
| §3.6 | Conceptos por conexión | RN-PER-126 (M04) |
| §4.1–§4.3 | Estados del servicio, operaciones, trámites masivos | RN-PER-127 (M02/M10); CTR-PER-16 |
| §5 | Bajas de socio | RF-PER-045..047; RN-PER-031..035, RN-PER-039 |
| §6 | Cambios de categoría y clase | RN-PER-128 (M02/M04); RF-PER-120 |
| §7 | Transferencias (cuenta, servicio, capital) | RF-PER-132..139; RN-PER-102..110 |
| §8 | Domicilios | RN-PER-063..065; RF-PER-083, RF-PER-098 |
| §9 | Capital social y acciones | RN-PER-032, RN-PER-129 (M17) |
| §10 | Adherentes y beneficiarios | RF-PER-109..117; RN-PER-082..091 |
| §11 | Grupos de facturación | RN-PER-057; M05 |
| §12–§19 | Medidores, rutas, consumos, estimados, demanda, inyección, telemedición | Fuera de alcance: M03, M10, M13 |
| §20 | Parámetros V2 relacionados | Sección 14 (columna Origen) y nota final de la sección 14 |
| §21 punto 1 | Modelo de padrón de cuatro niveles; no socios; principal; domicilio postal vs suministro | Sección 2.3; RN-PER-029; RN-PER-063 |
| §21 punto 2 | Estados explícitos | CTR-PER-16 (M02 para el contrato) |
| §21 punto 4 | Validaciones como políticas de tres niveles | Sección 14; RF-PER-170 |
| §21 puntos 3, 5–13 | Configuración por servicio, motor evento-acción, lecturas, consumos, medidores, telemedición, subsidios, capital | M02, M03, M04, M10, M13, M17 |
| §21 punto 14 | Migración (centinela 1901-01-01) | Sección 19 |
| §22 Duda 1 | `ValidaCuit`/`GenerarCuit` | RN-PER-006, RN-PER-007; PA-PER-04 |
| §22 Duda 4 | `REG_GARANTE` | RN-PER-081; CTR-PER-17 |
| §22 Duda 7 | MAX+1 | RN-PER-026, RN-PER-045, RN-PER-054; sección 19 |
| §22 Duda 14 | Diálogos en reglas | RN-PER-110; `transfers.options` |
| §22 Duda 17 | Rango de edad invertido | RN-PER-089 (M04) |
| §22 Duda 22 | Acciones SQL de trámites | RN-PER-098; CTR-PER-18; sección 19 |
| §22 Dudas 2, 3, 5, 6, 8–13, 15, 16, 18–21, 23 | Consumos, medidores, telemedición, categorías | Fuera de alcance (M02/M03/M10/M13) |
| §23.1 `clsSocios` | `Validar_Titular`, `PermiteDardeBaja`, `Get_Relacion_OtraCuenta`, `Completar_Sumsoc`, `Get_Telefono`, `Get_Mail`, `GetNumeroDestino`, `PersonaEsAdherente`, `Get_Cod_Adh_Condicion*`, `DarBaja_Adherentes_Condicion`, `CambiarCategoria_Adherentes`, `Get_Adherentes_MayoriaEdad`, `Get_DeudaAdherente`, `Reconectar_*`, `Crear_NOTA_SUM`, `Guardar_NOTA_SUM*`, `Cuenta_CajaBloqueada`, `BloquearPagoWeb`, `Guardar_SUMNOFAC`, `Marcar_NoFacturarServicio`, `ImportarCuentas_MarcaFacturar`, `Get_InfoAdjuntos`, `Act_Domicilio_Sersoc`, `Actualizar_Domicilio_SERSOC`, `Get_Propieda_Nomenclatura`, `ValidarPropiedadCatastral`, `Get_Presupuestos`, `Validar_TelefonoMovil`, `Crear_SU_EMP_CBU`, `GenerarClaveWeb`, `UnificarEntidades`, `Get_CandidatosSorteo`, `ImportarRG60`, `getSetNroFicha`, `Guardar_DebitosExcluidos`, `Requiere_Confirmacion_Desmarcar_FacturaE`, `TransferirCuenta`, `TransferirServicio`, `TransferirCapital`, `Get_TAR_ADHE_Importe` | RN-PER-005..134 según la columna "Origen ProCoop" de la sección 6 |
| §23.2 `OpcionesEspeciales` | `Registrar_Fallecimiento`, `EliminarCuenta`, `CambiarCuenta`, `ModificacionEspecial_Socio` | RN-PER-014, RN-PER-115, RN-PER-041, RN-PER-039; RF-PER-169 |
| §23.3 `clsTramites` | Presentados, no presentados, acciones | RN-PER-097, RN-PER-098; RF-PER-130 |
| §23.4 `clsSocios_Capital` | `Validar_DeudaDomicilio`, capital | RN-PER-062; capital → M17 |
| §23.5 `clsPersonas`, `clsServicios` | `EsDni`, `GetDocument`, `Verificar_Persona_Cargada`, `SetFechaFallecimiento`, `GetSituacionImpositiva`, `Actualizar_Domicilio_PERSONAS` | RN-PER-010, RN-PER-011, RN-PER-014, RN-PER-044, RN-PER-064 |
| §23.6 `clsServicio`, `clsCuentas` | `ValidarLocalidadHabilitada`, `ValidacionAdvertencia_IIBB`, `ReasignarIngresoBrutos`, `DetalleCuenta`, `PoseeGrupos`, `GetDomicilio`, `GetDescripcion`, `Cuotas_Obra` | RN-PER-077, RN-PER-046, RN-PER-047, RN-PER-055, RN-PER-056, RN-PER-065; RF-PER-095 |
| §23.7 | Consumos | Fuera de alcance (M03) |
| §23.8, §23.9 | Otras clases y pendientes | Sin reglas adicionales de PER; `[VERIFICAR]` en 7.3, 7.4, 7.7 |

### 22.5 RN-09 (parámetros de TITULARES)

Cada parámetro V2 y PMovil del grupo TITULARES (líneas 340–656) que gobierna este módulo está en la sección 14 con su número en la columna "Origen V2 #n" (PRM-PER-001..102). Los que pertenecen a otros módulos o se descartan figuran en la nota final de la sección 14 (V2 2329, 2507, 573, 2269, 2715, 2250, 2740, 2050, 343, 3034, 2428, 2429, 2430, 2616, 2608, 2623, 2286; PMovil 17, 32, 46). V2 914 y V2 800 → PRM-PER-083 (descartado).

### 22.6 CAT §1 (24 tablas) y §30 (maestros)

| Tabla | Destino |
|---|---|
| `ADHSOC` | M18 `serviceDependents` (HUECO-TRV-01; antes `adherents` (7.10); sección 19) |
| `BENSOC` | M18 `serviceBeneficiaries` (HUECO-TRV-01, HUECO-SEP-02; antes `adherents` `kind = beneficiary`) |
| `CAPITAL` | M17 (RN-PER-129) |
| `CAPITAL_RES` | M17 |
| `NOTA_SUM` | `notes` (7.11) y `blocks` (7.12) |
| `NOT_ELIMINADAS_HST` | `notes.deletion` |
| `PERSONAS` | `persons` (7.1) |
| `PERSONAS_EXTRAS` | `persons.workInfo` + `extra` |
| `PROPIEDA` | `premises` (7.7) |
| `PTRAMITES` | `documentSubmissions` (7.13) |
| `RUBCAPI` | M17 |
| `SERSOC` | M02 (contrato); domicilio/catastro/GPS → `servicePoints`, `addresses`, `premises` |
| `SERSOC_EXTRAS` | M02; `GIS` → `servicePoints.gisRef` |
| `SERSOC_HST` | M02; historia de domicilio → `perRevisions` |
| `SERSOC_PRODUCTOS` | M02 |
| `SOCIOS` | `holders` (7.3) + M17 |
| `SUMSOC` | `accounts` (7.4) |
| `SUMSOC_EXTRAS` | `accounts` + M07 |
| `SUMSOC_HST` | `perRevisions` |
| `TRAMITES` | `documentRequirementTypes` |
| `TRAMITES_ACCIONES` | `documentRequirementTypes.actionsOnSubmit/OnExpiry` (CTR-PER-18) |
| `TRANSFER` | `transfers` (7.14) |
| `VIAINGTE` | M09 (RN-PER-024 consume la marca de validación) |
| `VINCULOS` | catálogo `relationshipTypes` |
| `RELACION_ENTIDADES` (CAT §29) | `relationships` |
| `BARRIOS`, `CALLES`, `DEPARTA`, `DEPTO`, `LOCALIDA`, `PAISES`, `PROVINC`, `RNQCALL`, `ZONAS`, `MAPA`, `FERIADOS` (§30) | T04; consumidos por `addresses` (7.5) |
| `DISTRITO_SECCION` (§30) | catálogo `districtSections` (7.18) |
| `DOCUMENT` (§30) | catálogo `documentTypes` |
| `EST_CIVIL` (§30) | catálogo `maritalStatuses` |
| `OCUPACIO` (§30) | catálogo `occupations` |

### 22.7 INV `ProMod_Titulares` (104 formularios y 6 controles)

| Formulario / control | Destino |
|---|---|
| `FrmSeleccionarPeriodo` | Componente común de selección de período (T03); usado por PAN-PER-20 |
| `GridControl_Socios` | PAN-PER-01; RF-PER-142, RF-PER-143 |
| `abmCausas` | Catálogo `holderCloseReasons` (7.18); PAN-PER-22 |
| `abm_ActAfip` | Absorbido por M06 (actividades ARCA) |
| `abm_ArtefSums` | Absorbido por M02 (gas, RN-PER-133) |
| `abm_Artefactos` | Absorbido por M02 |
| `abm_Capital` | Absorbido por M17 |
| `abm_ClaseSer` | Absorbido por M02 |
| `abm_Conexion` | Absorbido por M04 (RN-PER-126) |
| `abm_Consejo` | Absorbido por M17 |
| `abm_Disposi` | Absorbido por M02/M10 |
| `abm_Document` | Catálogo `documentTypes`; PAN-PER-22; RF-PER-018 |
| `abm_EstaSer` | Absorbido por M02 |
| `abm_Gru_Con` | Catálogo de M15; PER referencia (RF-PER-062) |
| `abm_MarMed` | Absorbido por M10 (medidores) |
| `abm_MedSoc` | Absorbido por M03/M10 |
| `abm_MedidorTestigo` | Absorbido por M03 |
| `abm_Ocupacio` | Catálogo `occupations`; PAN-PER-22 |
| `abm_Postales` | Catálogo `postalCompanies`; PAN-PER-22; RF-PER-060 |
| `abm_Profesio` | RF-PER-016; catálogo de profesiones en PAN-PER-22 |
| `abm_Reclamos` | Absorbido por M09 |
| `abm_Reclamos_Partiinc` | Absorbido por M09 |
| `abm_RetiroMaterialesViv` | Absorbido por M18 (vivienda) |
| `abm_SerSoc` | Absorbido por M02; partes de PER: punto, inmueble, adherentes, garante (RF-PER-093, RF-PER-096, RF-PER-109, RF-PER-101) |
| `abm_Sersoc_Productos` | Absorbido por M02 |
| `abm_Socios` | PAN-PER-02, PAN-PER-04, PAN-PER-17; RF-PER-040..054 |
| `abm_SumSoc` | PAN-PER-05; RF-PER-055..072 |
| `abm_TipMed` | Absorbido por M10 |
| `abm_Tramites` | PAN-PER-13 (configuración `documentRequirementTypes`); API-PER-66 |
| `abm_Vinculos` | Catálogo `relationshipTypes`; PAN-PER-09, PAN-PER-22 |
| `abm_VivActividad`, `abm_VivEtapa`, `abm_VivMatact`, `abm_VivProgmat`, `abm_VivProgreso`, `abm_Vivmat` | Absorbidos por M18 |
| `abm_Zonas` | Catálogo de zonas de T04; usado por `accounts.deliveryRoute` (RF-PER-060) |
| `abm_adhsoc` | PAN-PER-10; RF-PER-109..117 |
| `amb_DistritoSeccion` | Catálogo `districtSections`; RF-PER-061 |
| `amb_Rub_Rec` | Absorbido por M09 |
| `frmAltaBajaSersoc` | Absorbido por M02; acceso desde la ficha (RF-PER-147) |
| `frmAsignarCategoria` | Absorbido por M02 |
| `frmBajaAdherentesCondicion` | PAN-PER-10; RF-PER-111; JOB-PER-06 |
| `frmBajaVivienda` | Absorbido por M18 |
| `frmCambioCuenta` | PAN-PER-21; RF-PER-169; RN-PER-041 |
| `frmCapìtalReserva` | Absorbido por M17 |
| `frmCirculares` | RF-PER-149; REP-PER-14 |
| `frmComandosTelemedicion` | Absorbido por M03 MED (PAN-MED-24, RF-MED-110) |
| `frmConstruccionVivienda` | Absorbido por M18 |
| `frmConsultaCambioPlanVivienda` | Absorbido por M18; impresión desde la ficha (RF-PER-054) |
| `frmConsultaHistoriales` | PAN-PER-19; RF-PER-154 |
| `frmConsultaIncidentes` | Absorbido por M09/M10; acceso RF-PER-147 |
| `frmCredencialAsociado` | Absorbido por M17 |
| `frmCuentaCorreo` | Absorbido por M10 TEC (casillas del servicio de Internet en PAN-TEC-37; conector en T06 FI-INT-112); acceso RF-PER-147 |
| `frmCuentaCorriente` | Absorbido por M07; pestaña de lectura en PAN-PER-02 |
| `frmDemandaPeriodo` | Absorbido por M03 |
| `frmDispenser` | Absorbido por M02 CAT (servicio dispenser de agua, RF-CAT-101) |
| `frmDistribucionCapital` | Absorbido por M17 |
| `frmEliminarCuenta` | Descartado como borrado físico (RN-PER-115); el cierre se hace por API-PER-25 |
| `frmHistorial_SerSum` | PAN-PER-19; RF-PER-154 |
| `frmImpresiones` | RF-PER-054 |
| `frmInformesVivienda` | Absorbido por M18 |
| `frmMaterialesViv` | Absorbido por M18 |
| `frmModificarCategoria` | Absorbido por M02 |
| `frmModificarClase` | Absorbido por M02 |
| `frmModificarSersoc` | Absorbido por M02 |
| `frmMods_Especiales` | PAN-PER-21; RF-PER-046, RF-PER-169 |
| `frmNoFacturarServicios` | PAN-PER-12; RF-PER-126 |
| `frmNota_Reclamo` | Absorbido por M09 |
| `frmNota_Sum` | PAN-PER-11, PAN-PER-12; RF-PER-118..123 |
| `frmOperacionesTelemedicion` | Absorbido por M03 MED (PAN-MED-24, RF-MED-110) |
| `frmPTramites` | PAN-PER-13; RF-PER-129 |
| `frmPadronTitulares` | PAN-PER-20; RF-PER-148 |
| `frmPadronTitulares_Columnas` | PAN-PER-20 |
| `frmPadronTitulares_Credenciales` | Absorbido por M17 (credenciales) |
| `frmPadronTitulares_Filtros` | PAN-PER-20 |
| `frmRecuperoCapital` | Absorbido por M17 |
| `frmReclamosHist` | Absorbido por M09 |
| `frmReimpresionTrans` | PAN-PER-15; RF-PER-137 |
| `frmS3Manager` | Absorbido por T11 (almacenamiento) |
| `frmSegmentacion_Restablecer` | Absorbido por M04 |
| `frmSorteoMensual` | Absorbido por M17/T09; usa `per.matchIdentifiers` (RN-PER-134) |
| `frmTarifaSocial_Confirmar_TopeConsumo`, `frmTarifaSocial_Exportar`, `frmTarifaSocial_Importar`, `frmTarifaSocial_ImportarPorDni`, `frmTarifaSocial_ImportarPorDni_Confirmar`, `frmTarifaSocial_Restablecer`, `frmTarifaSocial_TopeConsumo` | Absorbidos por M02/M04; la importación por DNI usa `per.matchIdentifiers` (RN-PER-011, RN-PER-134) |
| `frmTel_Medtel` | Absorbido por M03 MED (mapeo de registros de telemedición `telemetryRegisterMappings`, origen `LEC_MEDTEL`) |
| `frmTitular_Fallecimiento` | PAN-PER-16; RF-PER-009 |
| `frmTitulares` | PAN-PER-01, PAN-PER-02; RF-PER-142..147 |
| `frmTramite` | PAN-PER-13 (consultas); RF-PER-130 |
| `frmTramiteCambioSevicio` | M09 (trámite) + PAN-PER-14 (parte titularidad) |
| `frmTranferenciaCapital` | PAN-PER-14 tipo `capitalTransfer`; ejecuta M17 (RF-PER-134) |
| `frmTranferenciaCuenta` | PAN-PER-14; RF-PER-132, RF-PER-138 |
| `frmTranferenciaServicio` | PAN-PER-14; RF-PER-133 |
| `frmTransferenciasCuenta` | PAN-PER-15; RF-PER-137 |
| `frmVivActualizarCostos_Act` | Absorbido por M18 |
| `frmViviendaActividad` | Absorbido por M18 |
| `frmWeb_Configurar` | Absorbido por M19 |
| `frmWeb_Envio` | Descartado (sincronización con MySQL web, CTR-PER-15) |
| `frm_ConceptosMasivos` | Absorbido por M04 |
| Control `DatosInternet` | Absorbido por M10 TEC (PAN-TEC-37 datos técnicos del servicio) |
| Control `Datos_Vivienda` | Absorbido por M18 |
| Control `Fecha_Padron` | PAN-PER-20 |
| Control `Filtros_Padron` | PAN-PER-20 |
| Control `SersocExtras` | Absorbido por M02 (campos extra del contrato con el motor de T04) |
| Control `chk_SerSoc` | Absorbido por M02 |

### 22.8 INV `Configuracion` (formularios usados por el módulo)

| Formulario | Destino |
|---|---|
| `abm_Personas` | PAN-PER-03, PAN-PER-04; RF-PER-001..017 |
| `abm_Propieda` | PAN-PER-07; RF-PER-086..092, RF-PER-095 |
| `frmSeleccionarInmueble` | PAN-PER-07 (selector); RF-PER-091 |
| `DatosDomicilio` | PAN-PER-06; RF-PER-073 |
| `txtCalles` | PAN-PER-06 (autocompletado); RF-PER-084 |
| `BuscadorInfoSocio` | PAN-PER-01; RF-PER-142 |
| `frmSeleccionar_InfoSocios` | PAN-PER-01 (selector reutilizable) |
| `frmEscanerCodigoDNI` | PAN-PER-04; RF-PER-013 |

### 22.9 Control de cobertura

- Las 24 tablas de CAT §1 y las 15 de CAT §30 tienen destino (22.6).
- Las secciones 1 a 11 de RN-06 tienen destino; también lo tienen §20 a §23 en lo relativo a titulares y cuentas (22.4).
- Los 104 formularios y 6 controles de `ProMod_Titulares` y los 8 formularios de `Configuracion` usados tienen destino (22.7, 22.8).
- Los requisitos de BASE asignados (§3, §4, §33, §39.6, §67, §77, §83, §97.1 y pendientes) tienen destino (22.1).
- Las marcas **[VERIFICAR]** del anexo son: columnas no relevadas de `SOCIOS`, `SUMSOC`, `PROPIEDA` y `ADHSOC`; semántica de V2 703 ("conjunto"), V2 2030 y V2 2324; `SUMSOC.CLIENTE`; `ADHSOC.RECUPERA`; servicio y certificado de ARCA a usar; columna del garante del servicio en `SERSOC` (DEC-104, 10-11-2026).

### 22.10 Decisiones del contraste del núcleo transversal (10-11-2026)

| Fuente | Requisito | Cobertura |
|---|---|---|
| DEC-097 (contraste NucleoTransversal, aporte A5) | Persona única: proveedores, vendedores, choferes y profesionales de salud con `personId` obligatorio y alta asistida con control de duplicados | §2.3; glosario "Rol de persona en otro módulo"; RF-PER-015, RF-PER-155, RF-PER-174; RN-PER-135; §7.1 `addresses` (`commercial`); §9.13; §11.5 `per.findOrCreatePerson`, `per.getPersonIdentity`; PAN-PER-04; §19 (fila de maestros de rol); CTR-PER-23; AC-PER-54, AC-PER-55. 10-11-2026: RN-PER-135, §9.13 paso 3, PAN-PER-04 y `per.findOrCreatePerson` precisan que la ficha del rol es única por persona y rol y, para roles que dependen de una entidad o empleador (empleado de M16, asociado de M17), por esa entidad |
| DEC-099 (contraste NucleoTransversal, aporte A7) | Personas migradas sin documento: `documentPending`, fuera del control por documento, aviso por nombre y domicilio, tarea de regularización, restricción fiscal | Glosario "Estado de identificación"; RF-PER-155, RF-PER-175; RN-PER-005, RN-PER-136; §7.1 `identifiers`, `identificationStatus`, `identificationRegularization`; contrato `holderIdentifierSnapshot`; §8.15; §9.1; §9.14; JOB-PER-03; §11.5 `per.getHolderSnapshot`; EVT-PER-27 (consumidores M05, M09, T07 y M02, este último sumado el 10-11-2026 según M02 §12.2); PAN-PER-04; §19 (`PERSONAS` y conciliación); AC-PER-56..59 |
| DEC-096 (contraste NucleoTransversal, aporte A4) | Membresía de asociado por entidad jurídica: la proyección de M01 y la ficha 360 muestran una membresía por entidad (M17 §7.1 `associateMemberships.legalEntityId`) | RF-PER-044; §7.3 `holders.memberships` (antes `membership`); PAN-PER-02 (encabezado y pestaña "Asociado y capital"); PAN-PER-03 (filtro de condición de asociado por entidad); §12 consumo de EVT-INS-02/04/06 |
| DEC-102 (contraste NucleoTransversal, §6 punto 2) | Uso del inmueble como condición opcional de alícuota en M06 | RF-PER-089; §7.7 `usageId`; §7.18 `premiseUsages` (`usageClass`) |
| DEC-104 punto 2 | `RESPONSA` = técnicos de campo (T07), no garantes | Glosario "Relación" y "Garante"; RF-PER-101; §7.9 `subjectPersonId`; §19 (fila `RESPONSA`); §22.3; CTR-PER-22 |
