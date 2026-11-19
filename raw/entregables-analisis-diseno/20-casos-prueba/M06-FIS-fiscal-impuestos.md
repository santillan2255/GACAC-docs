# Casos de prueba de aceptación — M06 FIS — Fiscal e impuestos (ARCA, IVA, percepciones, retenciones, regímenes, terceros, reguladores)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M06-FIS-fiscal-impuestos.md`](../../especificacion/anexos/M06-FIS-fiscal-impuestos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 168 CP de requisitos funcionales, 53 CP de escenarios ESC y 20 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M06 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Tablas normativas, relevamiento fiscal y gobierno (M06 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0001 | RF-FIS-001; M06 §5.1; PRO-O4-01 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | Catálogo de **tablas normativas fiscales** mantenido por la plataforma (tenant `PLATFORM`): cada versión con fuente (norma, organismo, URL, fecha de consulta), vigencia desde/hasta, estado (borrador, en revisión, publicada, retirada) y… | No existe ningún porcentaje, mínimo, código ni vencimiento fiscal en el código fuente; todos se leen de una versión publicada con fuente cargada. |
| CP-FIS-0002 | RF-FIS-002; M06 §5.1; PRO-O4-01 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Adopción por tenant** de cada versión publicada con fecha efectiva y aprobación del responsable fiscal; sin adopción la versión no se aplica en producción. Notificación al tenant cuando la plataforma publica una nueva versión. | Un comprobante solo usa versiones adoptadas y vigentes a su fecha; la adopción queda auditada con usuario, fecha y versión anterior. |
| CP-FIS-0003 | RF-FIS-003; M06 §5.1; PRO-O4-01 | O4 | Estándar | seguridad | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | Tablas **extensibles** por tenant (tributos municipales, convenios, conceptos regulatorios, alícuotas determinadas): el tenant agrega filas con fundamento obligatorio; no puede editar filas de plataforma ni desactivar restricciones. | Intentar editar una fila de plataforma devuelve 403; agregar una fila sin fundamento devuelve error de validación. |
| CP-FIS-0004 | RF-FIS-004; M06 §5.1; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Sincronización de tablas paramétricas ARCA** (`FEParamGetTiposCbte`, `TiposMonedas`, `TiposIva`, `TiposConcepto`, `TiposTributos`, `TiposDoc`, `TiposOpcional`, `TiposPaises`, `CondicionIvaReceptor`, `Actividades`, `Cotizacion`) por job… | Un cambio en la tabla de ARCA genera una versión borrador con el diff y una alerta al equipo normativo; nada cambia en producción sin publicación. |
| CP-FIS-0005 | RF-FIS-005; M06 §5.1; PRO-O4-01 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Historia bitemporal**: fecha efectiva y fecha de registro de cada versión y adopción; reconstrucción de qué tablas, reglas y versiones se usaron en cada comprobante, retención o declaración. | Dado un comprobante, la traza muestra versión de alícuota, padrón, convenio y mapeo usados; una corrección posterior no reescribe el original. |
| CP-FIS-0006 | RF-FIS-006; M06 §5.1; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Relevamiento fiscal del tenant** versionado (BASE §52.4): CUIT y condición del prestador, provincia, localidad, concesión, autoridad aplicable, servicios, tributos (impuesto, fundamento, base, alícuota, excepciones, tratamiento… | Sin relevamiento aprobado, el ambiente de producción del conector ARCA no puede activarse. |
| CP-FIS-0007 | RF-FIS-007; M06 §5.1; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Calendario fiscal** por tenant generado desde la tabla normativa de vencimientos (por régimen, terminación de CUIT, jurisdicción) con alertas a responsables. | Cada obligación activa del tenant aparece con fecha de vencimiento y alerta a 7, 3 y 1 días (configurable). |
| CP-FIS-0008 | RF-FIS-008; M06 §5.1; PRO-O4-01 | O4 | Estándar | regla | TEN-001 con Declaraciones: DDJJ-DEMO-001 (retenciones, `approved`), DDJJ-RG3571-DEMO-2026-09 `rejected` con su rectificativa en `draft` (CU-FIS-10) | Leyenda de responsabilidad en pantallas y archivos de declaraciones: "el sistema calcula y prepara; la presentación y responsabilidad son del contribuyente y su contador". | La leyenda aparece en todas las pantallas PAN-FIS de declaraciones y en la cabecera del resumen de cada archivo. |
| CP-FIS-0009 | RF-FIS-009; M06 §5.1; PRO-O4-01 | O4 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Simulación** de una nueva versión de tabla normativa sobre los comprobantes de un período (sin efectos) antes de adoptarla, con diferencias por comprobante. | La simulación no crea documentos ni modifica totales; muestra totales antes/después y casos afectados. |
| CP-FIS-0010 | RF-FIS-010; M06 §5.1; PRO-O4-01 | O4 | Estándar | seguridad | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Auditoría** de toda configuración fiscal, adopción, cálculo, envío a ARCA, presentación y conciliación, por tenant, con antes/después y `requestId`. | Toda acción con capability `configurar`, `aprobar`, `presentar` o `enviar` produce un registro de auditoría consultable. |
| CP-FIS-0011 | RF-FIS-011; M06 §5.1; PRO-O4-01 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | La configuración de un **cargo/tributo** no habilita por sí cualquier concepto: catálogo aprobado con fundamento, servicio, jurisdicción y documento permitido; no se trasladan al socio tributos propios de la cooperativa. | El motor rechaza aplicar un tributo sin fundamento o fuera de su servicio/jurisdicción, con motivo explicado. |
| CP-FIS-0012 | RF-FIS-012; M06 §5.1; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | Reglas de **contenido permitido en facturas** por jurisdicción (ej. Ley provincial 10739 de Córdoba para energía, agua y saneamiento) como tabla normativa que bloquea rubros no permitidos. | Un rubro no permitido para el servicio y jurisdicción queda bloqueado al configurar el concepto y al emitir. |
### 1.2 Perfil fiscal del tenant, condición de agente y padrón (M06 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0013 | RF-FIS-013; M06 §5.2; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Perfil fiscal** del tenant: razón social, CUIT, condición IVA, número y régimen de IIBB (local o Convenio Multilateral con jurisdicciones y coeficientes), inicio de actividades, domicilio fiscal, actividades ARCA, logo fiscal, versionado. | Los comprobantes toman los datos del emisor del perfil vigente a la fecha de emisión. |
| CP-FIS-0014 | RF-FIS-014; M06 §5.2; PRO-O4-01 | O4 | Estándar | regla | TEN-001 con Condiciones IVA y matriz: RI → A; exento, CF, monotributo y no categorizado → B; percepción IVA a no categorizado activa en TEN-001 | **Condiciones de agente**: organismo, impuesto, régimen, jurisdicción, número de agente, nombre/domicilio/localidad del agente, vigencias, respaldo documental y responsables. | Un régimen solo se calcula si existe condición de agente vigente a la fecha de la operación. |
| CP-FIS-0015 | RF-FIS-015; M06 §5.2; PRO-O4-01 | O4 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Validación de CUIT/CUIL** (11 dígitos y dígito verificador) en personas y proveedores; alerta configurable al confirmar el ABM. | Un CUIT con dígito verificador inválido no puede guardarse como CUIT; se muestra la causa. |
| CP-FIS-0016 | RF-FIS-016; M06 §5.2; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Consulta de padrón ARCA** (A13 y constancia de inscripción) para autocompletar razón social, domicilio fiscal, condición IVA, monotributo, actividades y estado de la clave, conservando fecha y resultado de la consulta como evidencia. | Al ingresar un CUIT en alta de titular o proveedor, se proponen los datos de ARCA; el usuario confirma; la evidencia queda vinculada. |
| CP-FIS-0017 | RF-FIS-017; M06 §5.2; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **CUIT a partir del DNI** (`getIdPersonaListByDocumento`): propone los CUIT/CUIL asociados al documento para que el usuario elija; la generación por algoritmo DNI+sexo queda solo como sugerencia no confirmada. | Nunca se informa a ARCA un CUIT generado por algoritmo sin confirmación de padrón o del usuario. |
| CP-FIS-0018 | RF-FIS-018; M06 §5.2; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Revalidación masiva periódica** de condición IVA y monotributo de titulares y proveedores contra padrón, con informe de diferencias y actualización con aprobación. | El job produce un informe de diferencias; ninguna condición se cambia sin aprobación (si la PA se resuelve como recomendada). |
| CP-FIS-0019 | RF-FIS-019; M06 §5.2; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Padrón offline** de condición tributaria (archivo masivo de ARCA de ancho fijo: CUIT, razón social, IVA, monotributo) importable, con conversión a códigos (`MT`, `EX`, `NA`, `AC`, `NI`) y cruce con titulares y proveedores. | Importar el archivo crea una versión de padrón con fecha de publicación; el cruce lista diferencias por persona. |
| CP-FIS-0020 | RF-FIS-020; M06 §5.2; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Control de proveedores** contra padrón ARCA al darlos de alta/modificarlos y aviso si su certificado/constancia está fuera de fecha. | Con el control activo, un proveedor con condición distinta a la del padrón genera advertencia u obligación de corregir según configuración. |
| CP-FIS-0021 | RF-FIS-021; M06 §5.2; PRO-O4-01 | O4 | Estándar | funcional | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Defaults fiscales de personas**: situación IVA por defecto (V2 2086) y situación IIBB por defecto (V2 2312) por tenant. | Un alta sin condición explícita toma el default del tenant y queda marcada "a validar". |
| CP-FIS-0022 | RF-FIS-022; M06 §5.2; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Receptor MiPyME**: marca de obligado a recibir FCE, umbral de importe para FCE (V2 2515) y consulta a ARCA de obligados, para que M05 elija FCE. | Con receptor MiPyME y importe sobre el umbral vigente, la selección de comprobante propone FCE. |
| CP-FIS-0023 | RF-FIS-023; M06 §5.2; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Actividades ARCA** (nomenclador) asignables al servicio del titular, con filtro en cargos adicionales y posibilidad de informarlas en `Actividades` del request cuando ARCA lo exija. | El catálogo de actividades sale de la tabla normativa sincronizada; la asignación a servicio se audita. |
### 1.3 Credenciales ARCA y autenticación WSAA (M06 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0024 | RF-FIS-024; M06 §5.3; PRO-O4-02 | O4 | Estándar | seguridad | TEN-001 con Credenciales: TEN-001 con credencial `testing` en homologación (certificado de prueba autogenerado sin validez); TEN-002 con `pendingCertificate` para mostrar el… | **Certificados por tenant y ambiente** (homologación/producción) en la bóveda de credenciales del tenant; en la base solo metadatos: CUIT, alias, emisor, número de serie, NotBefore/NotAfter, servicios autorizados (`wsfe`… | La clave privada nunca se guarda en la base ni en disco compartido; un usuario sin `fis.arca.configurar` no ve ni descarga el certificado. |
| CP-FIS-0025 | RF-FIS-025; M06 §5.3; PRO-O4-02 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Generación de clave y CSR** dentro de la plataforma para que el tenant obtenga el certificado en ARCA, o carga de un PFX existente. | El flujo completo (generar CSR → subir certificado emitido por ARCA → probar en homologación) se puede hacer sin exponer la clave privada. |
| CP-FIS-0026 | RF-FIS-026; M06 §5.3; PRO-O4-02 | O4 | Estándar | seguridad | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Alertas de vencimiento** de certificado a 30, 14, 7 y 3 días y vencido, a usuarios con capability; bloqueo preventivo de envíos con certificado vencido y mensaje accionable. | Con certificado vencido, la cola queda en "detenida por credencial" y el tablero muestra la causa, sin marcar errónea cada factura. |
| CP-FIS-0027 | RF-FIS-027; M06 §5.3; PRO-O4-02 | O4 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **WSAA**: obtención del TA por (tenant, CUIT representado, servicio, ambiente) con caché compartido entre workers, lock distribuido, `uniqueId` único, reutilización hasta su vencimiento, renovación anticipada y manejo del rechazo "ya posee… | Dos workers simultáneos producen una sola llamada a `loginCms`; un reinicio no pide un TA nuevo si el vigente está en caché. |
| CP-FIS-0028 | RF-FIS-028; M06 §5.3; PRO-O4-02 | O4 | Estándar | integración | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | **Ambientes separados** con URLs administradas por la plataforma (no por tenant); los tenants de demostración o sandbox solo operan en homologación; padrón también por ambiente. | Un tenant demo no puede activar producción; las URLs de padrón no están fijas en producción. |
| CP-FIS-0029 | RF-FIS-029; M06 §5.3; PRO-O4-02 | O4 | Estándar | funcional | TEN-001 con Reguladores: Configuración ERSeP con código de empresa `ERSEP-DEMO`; ENARGAS FCU-DS para TEN-002 con tablas maestras demo; ENACOM con un servicio de Internet… | **CUIT representado explícito** en la configuración (incluido el caso de delegación de un representante), nunca inferido del orden de relaciones del TA. | Con un TA de varias relaciones, el sistema usa el CUIT configurado y valida que esté entre las relaciones. |
| CP-FIS-0030 | RF-FIS-030; M06 §5.3; PRO-O4-02 | O4 | Estándar | integración | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Cliente técnico**: TLS 1.2 o superior, timeout configurable (90 s por defecto), `FEDummy`/`dummy` como verificación de salud del conector. | El estado del conector muestra el resultado del último `FEDummy` por ambiente. |
| CP-FIS-0031 | RF-FIS-031; M06 §5.3; PRO-O4-02 | O4 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Estado observable del conector** por tenant (AGR-021): último éxito, último error, certificado, TA vigente, cola pendiente, servicios de ARCA caídos. | Ante una caída de ARCA, el tablero identifica la integración afectada sin marcar como erróneos a los socios. |
| CP-FIS-0032 | RF-FIS-032; M06 §5.3; PRO-O4-02 | O4 | Estándar | seguridad | TEN-001 con Credenciales: TEN-001 con credencial `testing` en homologación (certificado de prueba autogenerado sin validez); TEN-002 con `pendingCertificate` para mostrar el… | Las credenciales fiscales están separadas de los tokens de BI/APIs; nunca se exponen por API ni en logs; rotación sin interrupción. | Búsqueda de secretos en logs y respuestas de API da cero resultados en las pruebas de seguridad. |
### 1.4 Puntos de venta y modalidades de autorización (M06 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0033 | RF-FIS-033; M06 §5.4; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Puntos de venta fiscales**: número, descripción, sistema de emisión ARCA (web service CAE, CAEA, CAI talonario), sucursal, servicio/canal, domicilio, estado (activo, pausado, baja); sincronización con `FEParamGetPtosVenta` (no bloqueados… | Un punto de venta que ARCA informa bloqueado o dado de baja no puede usarse para autorizar. |
| CP-FIS-0034 | RF-FIS-034; M06 §5.4; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Modalidad por (tipo de comprobante × punto de venta)**: CAE, CAEA, CAI o CESP, con prioridad de asignación CAEA (si hay vigente y la modalidad está activa) → CAE → CAI → CESP. | La modalidad aplicada se registra en el comprobante (`authorizationKind`); un par sin modalidad no puede emitirse como fiscal. |
| CP-FIS-0035 | RF-FIS-035; M06 §5.4; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Pausar** un punto de venta: la cola no envía comprobantes de ese punto; alerta y auditoría. | Comprobantes de un punto pausado quedan "pendiente — punto pausado". |
| CP-FIS-0036 | RF-FIS-036; M06 §5.4; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **CAI**: registro del CAI vigente y su vencimiento por talonario/punto; bloqueo de emisión con CAI vencido. | Con CAI vencido el comprobante no se emite y se informa el motivo. |
| CP-FIS-0037 | RF-FIS-037; M06 §5.4; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Consulta de último comprobante autorizado** (`FECompUltimoAutorizado`) y de un comprobante (`FECompConsultar`) a demanda. | La pantalla devuelve número, fecha, importe, CAE y vencimiento informados por ARCA. |
| CP-FIS-0038 | RF-FIS-038; M06 §5.4; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Contraste de numeración** local contra ARCA antes de cada tanda: si ARCA tiene un número mayor al último autorizado localmente, la cola se detiene y se concilia. | Nunca se envía un número ya autorizado ni se saltea numeración. |
### 1.5 Cola de autorización CAE (WSFEv1) (M06 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0039 | RF-FIS-039; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Cola de autorización** con estados explícitos (pendiente, validando, enviando, autorizado, autorizado con observaciones, rechazado, incierto, a conciliar, detenido) en lugar de bloqueo por bandera y *polling*. | Cada comprobante fiscal tiene una única autorización con estado y su historial. |
| CP-FIS-0040 | RF-FIS-040; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Serialización** por (tenant, CUIT, punto de venta, tipo ARCA), en orden de número, con tandas de hasta el máximo de registros por request vigente (`FECompTotXRequest`). | Dos workers no envían el mismo par en paralelo; la tanda no supera el máximo informado por ARCA. |
| CP-FIS-0041 | RF-FIS-041; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Validaciones previas**: código ARCA del tipo configurado y numérico; sin comprobante anterior pendiente del mismo par; numeración correlativa sin huecos; TA y certificado vigentes; punto no pausado; receptor completo; condición IVA del… | Ante una falla previa el comprobante queda "detenido" con motivo exacto (ej. "hay un comprobante anterior pendiente: N"). |
| CP-FIS-0042 | RF-FIS-042; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Prevalidación fiscal en lote** (BASE §69): un caso configurado como factura A sin CUIT se identifica como `dict:fis.motivo.facturaASinCuit` ("No apto para emisión: falta CUIT del receptor") y se deriva a corrección; no se inventa el dato… | En CU-LOT-01, las 2 excepciones quedan pendientes y las 98 aptas se autorizan; después de corregir, 100 emitidas y 0 duplicadas. |
| CP-FIS-0043 | RF-FIS-043; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Receptor**: `DocTipo` 80 con CUIT para comprobantes que exigen CUIT; tipo de documento mapeado (DNI 96, LE 89, LC 90, pasaporte 94, cédula 91, CUIL 86, CUIT 80, sin identificar 99); `DocTipo 99/DocNro 0` solo para consumidor final por… | Un consumidor final sobre el umbral sin documento queda detenido; nunca se envía 23333333333. |
| CP-FIS-0044 | RF-FIS-044; M06 §5.5; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Concepto y fechas**: concepto 1 (productos), 2 (servicios) o 3 (ambos) según ítems; `FchServDesde/Hasta` = período facturado (o mes de emisión si no hay período); `FchVtoPago` = primer vencimiento cuando el concepto es 2 o 3. | Una factura mensual de Internet de octubre informa servicio 01-10 a 31-10 y vencimiento de pago igual al primer vencimiento. |
| CP-FIS-0045 | RF-FIS-045; M06 §5.5; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Importes fiscales** (`ImpNeto`, `ImpOpEx`, `ImpTotConc`, `ImpIVA`, `ImpTrib`, `ImpTotal`) calculados en decimal desde las líneas del comprobante; reglas de clase C (sin IVA discriminado; exento al neto y `ImpOpEx = 0`); ajustes de cierre… | `ImpTotal = ImpNeto + ImpOpEx + ImpTotConc + ImpIVA + ImpTrib` siempre; una factura C nunca sale con `ImpOpEx ≠ 0`. |
| CP-FIS-0046 | RF-FIS-046; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Alícuotas IVA** mapeadas por tabla normativa (0 % → Id 3, 2,5 % → 9, 5 % → 8, 10,5 % → 4, 21 % → 5, 27 % → 6); un porcentaje sin mapeo **detiene** el comprobante en lugar de descartarse en silencio. | Una alícuota 19 % configurada por error detiene el comprobante con "alícuota sin código ARCA". |
| CP-FIS-0047 | RF-FIS-047; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | **Tributos** mapeados explícitamente al Id ARCA (`FEParamGetTiposTributos`): 1 nacionales, 2 provinciales, 3 municipales, 4 internos, 5 IIBB, 6 percepción de IVA, 7 percepción de IIBB, 8 percepciones municipales, 9 otras percepciones, 13… | Una tasa municipal se informa con Id 3 y una percepción de IVA con Id 6; ambos aparecen separados en Mis Comprobantes. |
| CP-FIS-0048 | RF-FIS-048; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Comprobantes asociados**: `CbtesAsoc` (tipo, punto, número, CUIT, fecha) para ND/NC y FCE; `PeriodoAsoc` cuando ningún asociado fue autorizado con CAE; ND/NC A y B sin asociados informan siempre `PeriodoAsoc`. | Una NC por una factura autorizada informa el asociado; una NC por un período informa `PeriodoAsoc`. |
| CP-FIS-0049 | RF-FIS-049; M06 §5.5; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **FCE MiPyME**: `FchVtoPago` (salvo NC y 202); opcionales 2101 (CBU, V2 2431), 2102 (alias, V2 2432) solo con valor; 27 (transferencia SCA/ADC según opción vigente) para 201/206/211; 22 (anulación S/N) en NC 203/208/213; CUIT asociado del… | Una FCE 201 sale con CBU y alias de la cooperativa y con opcional 27 válido. |
| CP-FIS-0050 | RF-FIS-050; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | El modelo soporta `Actividades`, `Compradores`, `Opcionales`, moneda extranjera (`MonId`, `MonCotiz`, `CanMisMonExt`) y `CbteFchHsGen` aunque el piloto no los use. | El request se arma desde el modelo; agregar un opcional no requiere cambiar el código del conector. |
| CP-FIS-0051 | RF-FIS-051; M06 §5.5; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Respuesta**: con resultado `A` se graba CAE, vencimiento y observaciones **del detalle que corresponde** a cada comprobante; con `R`, códigos y mensajes; con `P`, se procesa por detalle. | Las observaciones de un comprobante nunca se toman de otro detalle. |
| CP-FIS-0052 | RF-FIS-052; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Tratamiento de errores ARCA**: 10016 → consultar `FECompConsultar` antes de reintentar y tomar el CAE si importe coincide; timeout o respuesta perdida → "incierto" y conciliación; 10040 → marcar asociados observados, reintentar con… | Ningún comprobante cambia la condición IVA del receptor por un reintento; un incierto nunca se reenvía sin consultar. |
| CP-FIS-0053 | RF-FIS-053; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Idempotencia y reintentos** con *backoff* por (tenant, tipo, punto, número): un reintento nunca genera otro número ni otro CAE; tras un rechazo agrupado se reintenta individualmente. | Repetir el job no produce efectos duplicados (prueba de reintento); un comprobante rechazado se corrige y se reenvía con el mismo número asignado por M05 al emitir (DEC-035). |
| CP-FIS-0054 | RF-FIS-054; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Agrupación en rango** (`CbteDesde..CbteHasta`, receptor 99/0) de comprobantes B/C a consumidor final solo si el tenant la habilita y por debajo del tope vigente. | Con la opción apagada (por defecto) cada comprobante tiene su detalle y su CAE individual. |
| CP-FIS-0055 | RF-FIS-055; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Vista previa del request** que aplica todas las reglas según el código ARCA real (C, FCE, asociados), sin enviarlo. | La vista previa coincide campo a campo con el request que luego se envía. |
| CP-FIS-0056 | RF-FIS-056; M06 §5.5; PRO-O4-03 | O4 | Estándar | migración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Disparo**: automático (activable por tenant y por punto, V2 726) con auditoría de cada encendido/apagado; manual por selección; **espera sincrónica** breve para venta mostrador y cobranza con factura (V2 727). | En mostrador, si ARCA no responde dentro del tiempo máximo de espera, el comprobante pasa a contingencia CAEA o queda pendiente y no se entrega como fiscal (DEC-018). El apagado automático de la autorización nunca ocurre en silencio (ProCoop lo apagaba al quedar facturas bloqueadas). |
| CP-FIS-0057 | RF-FIS-057; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Alertas de pendientes** con más de N días (3 por defecto) y de rechazados sin tratar, en el tablero y al iniciar sesión de roles fiscales. | Un pendiente de 4 días aparece destacado en PAN-FIS-10 y en la campana del usuario fiscal. |
| CP-FIS-0058 | RF-FIS-058; M06 §5.5; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | Regla configurable de **comprobantes no cobrables** mientras haya otros comprobantes no autorizados de la misma cuenta (equivalente a V2 2769), publicada a M07/M19. | Con la regla activa, M07 no permite cobrar el comprobante autorizado mientras exista otro pendiente de la cuenta, y lo explica. |
| CP-FIS-0059 | RF-FIS-059; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Conciliación con ARCA** (inconsistencias) por rango, período o punto: CAE distinto, importe distinto (tolerancia 0,02), inexistente en ARCA; propuesta de reparación con aprobación, informe de individuales y rangos. | La reparación nunca es silenciosa: cada cambio de CAE queda con evidencia de ARCA y aprobación. |
| CP-FIS-0060 | RF-FIS-060; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Tablero de autorizaciones** por estado, punto, tipo y fecha, con motivo de ARCA, acciones masivas (reintentar, consultar, derivar) y exportación. | Los totales del tablero cuadran con los comprobantes fiscales del período. |
| CP-FIS-0061 | RF-FIS-061; M06 §5.5; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Datos de QR fiscal** (RG 4892: versión, fecha, CUIT, punto, tipo, número, importe, moneda, cotización, tipo y número de documento del receptor, `tipoCodAut` A para CAEA y E para CAE, código) y del **código de barras** ARCA, entregados a… | El QR de un comprobante CAEA lleva `tipoCodAut = A`; el de CAE, `E`. |
| CP-FIS-0062 | RF-FIS-062; M06 §5.5; PRO-O4-03 | O4 | Estándar | regla | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Transparencia fiscal** (Ley 27.743, RG 5614/2024): cálculo del IVA contenido y otros impuestos nacionales indirectos para comprobantes a consumidor final, con la exhibición que defina la tabla normativa. | Una factura B a consumidor final muestra "IVA contenido" igual a la suma del IVA de sus líneas. |
| CP-FIS-0063 | RF-FIS-063; M06 §5.5; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Eventos de resultado** a M05, M07, M15 y M19 (autorizado, rechazado, observado, incierto) para marcar emitido, habilitar cobro, contabilizar y publicar al socio. El lote no se marca emitido sin autorización confirmada. | Un lote con 2 rechazos muestra 98 emitidos y 2 pendientes; M19 no publica los rechazados. |
| CP-FIS-0064 | RF-FIS-064; M06 §5.5; PRO-O4-03 | O4 | Estándar | seguridad | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Conservación de evidencia** de cada request/response ARCA (sin token, firma ni clave) por el plazo que defina T08. | Para cualquier comprobante se puede descargar el XML de request y response enmascarados. |
### 1.6 CAEA (M06 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0065 | RF-FIS-065; M06 §5.6; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Solicitud y consulta de CAEA** por período `yyyyMM` y quincena (`FECAEASolicitar` / `FECAEAConsultar`), anticipada por job dentro de la ventana de solicitud vigente. | Antes del inicio de cada quincena el tenant con CAEA habilitado tiene su CAEA registrado. |
| CP-FIS-0066 | RF-FIS-066; M06 §5.6; PRO-O4-03 | O4 | Estándar | migración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Asignación de CAEA** a comprobantes de puntos CAEA o en contingencia, vigencia por fechas desde/hasta y fecha tope de informe (corrige la inversión de criterio de ProCoop). | Un comprobante fuera del rango del CAEA no lo recibe. |
| CP-FIS-0067 | RF-FIS-067; M06 §5.6; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Informe CAEA** (`FECAEARegInformativo`) en tandas, con `CbteFchHsGen`, estado informado/rechazado por comprobante y totales informados. | Todos los comprobantes CAEA quedan "informado" antes del plazo; los rechazados quedan en bandeja. |
| CP-FIS-0068 | RF-FIS-068; M06 §5.6; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **CAEA sin movimiento** (`FECAEASinMovimientoInformar`) por punto de venta sin uso en la quincena. | Un punto CAEA sin comprobantes queda informado sin movimiento. |
| CP-FIS-0069 | RF-FIS-069; M06 §5.6; PRO-O4-03 | O4 | Estándar | integración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Contingencia**: activación manual o automática de CAEA ante caída prolongada de WSFE (umbral configurable), con evento y aviso. | En facturación masiva se emite y encola, se pausa solo la autorización y se usa CAEA si el tenant lo tiene habilitado (DEC-038). Con WSFE caído más de N minutos, el responsable recibe la propuesta de activar contingencia. |
| CP-FIS-0070 | RF-FIS-070; M06 §5.6; PRO-O4-03 | O4 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Alertas de plazos** de informe CAEA y de comprobantes CAEA no informados. | Un CAEA con comprobantes no informados a 2 días del plazo genera alerta. |
### 1.7 CESP, LQSP y RG 5746/2025 (M06 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0071 | RF-FIS-071; M06 §5.7; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **CESP** por rango de fechas y punto de venta, separado de CAEA, con validación de superposición correcta (incluida la contención total) y vencimiento. | Un CESP nuevo contenido dentro de otro existente es rechazado. |
| CP-FIS-0072 | RF-FIS-072; M06 §5.7; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **LQSP**: validación de autorización vigente con el **mismo criterio** en emisión, facturación masiva y anulación, para servicios marcados como LQSP y condiciones que la usan. | Masiva, anulación y emisión rechazan por igual una LQSP sin autorización vigente. |
| CP-FIS-0073 | RF-FIS-073; M06 §5.7; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **RG 5746/2025**: conjunto de datos fiscales de energía inyectada en la LQSP (clasificación del usuario-generador, potencia, kWh inyectados, precio, IVA, balance neto, crédito anterior, cesión, retribución y crédito final), que calculan… | Una LQSP de un usuario-generador contiene los diez datos exigidos y se trazan a la cuenta de créditos. |
| CP-FIS-0074 | RF-FIS-074; M06 §5.7; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | Aviso "no hay CESP activos" al iniciar sesión cuando hay servicios LQSP configurados con CESP. | Sin CESP vigente aparece el aviso en el tablero fiscal. |
### 1.8 Condición IVA, clase de comprobante y alícuotas de IVA (M06 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0075 | RF-FIS-075; M06 §5.8; PRO-O4-04 | O4 | Estándar | migración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Catálogo de condiciones frente al IVA** sincronizado con `FEParamGetCondicionIvaReceptor` (código ARCA oficial), más configuración del tenant por condición: percibido (libro IVA), mínimo y base de percepción, código de padrón offline… | La condición "consumidor final" se informa con el código ARCA vigente (5), no con el semilla de ProCoop. |
| CP-FIS-0076 | RF-FIS-076; M06 §5.8; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Determinación de la clase** de comprobante por condición del emisor y del receptor y normativa (A, B, C, M, LQSP A/B, FCE), como servicio consumido por M05. | Emisor RI y receptor RI → A; emisor RI y receptor CF → B; emisor monotributo → C. |
| CP-FIS-0077 | RF-FIS-077; M06 §5.8; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Validación de factura A**: CUIT válido y consistente con padrón, condición del receptor compatible, emisor habilitado para A (o régimen A con leyenda/M según corresponda). Estados distinguibles: prevalidación bloqueada, rechazo… | La interfaz muestra los cuatro estados por separado; una observación no permite reemitir. |
| CP-FIS-0078 | RF-FIS-078; M06 §5.8; PRO-O4-04 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Alícuotas de IVA** (0, 2,5, 5, 10,5, 21, 27; exento, no gravado, no alcanzado) con código ARCA y cuentas contables de ventas, compras y percepción. | Cada alícuota tiene código ARCA y mapeo contable antes de usarse. |
| CP-FIS-0079 | RF-FIS-079; M06 §5.8; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Condiciones IVA y matriz: RI → A; exento, CF, monotributo y no categorizado → B; percepción IVA a no categorizado activa en TEN-001 | **Matriz alícuota × condición**: porcentaje de IVA, segunda tasa (IVA 2) y percepción de IVA. | Para cada par (condición, alícuota) se obtiene IVA1, IVA2 y percepción vigentes. |
| CP-FIS-0080 | RF-FIS-080; M06 §5.8; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Asignación de alícuota al ítem**: tarifa → categoría → servicio (servicios) y producto (productos), con validación de existencia y vigencia en FIS. | Un ítem sin alícuota resoluble detiene el cálculo con motivo. |
| CP-FIS-0081 | RF-FIS-081; M06 §5.8; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Condiciones IVA y matriz: RI → A; exento, CF, monotributo y no categorizado → B; percepción IVA a no categorizado activa en TEN-001 | **Cálculo de IVA y percepción de IVA**: IVA1 = neto × tasa; IVA2 si corresponde; percepción = (neto + IVA1) × tasa, o neto × tasa si la condición lo indica; percepción de producto solo a RI cuando la matriz no define percepción; exclusión… | Con neto ARS 10.000, IVA 21 % y percepción ficticia 3 % sobre neto+IVA, la percepción es ARS 363,00. |
| CP-FIS-0082 | RF-FIS-082; M06 §5.8; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **IVA fijo** de ítems que conservan su IVA original (cuotas de financiación), IVA de refinanciaciones (devengamiento) y crédito fiscal en factura en cuotas (V2 2930). | Una cuota de financiación conserva la alícuota de la venta original aunque la tabla haya cambiado. |
| CP-FIS-0083 | RF-FIS-083; M06 §5.8; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Traza de cálculo** por comprobante: reglas, versiones, bases, alícuotas, mínimos y exclusiones aplicadas. | Desde el comprobante se abre la explicación completa de cada línea impositiva. |
| CP-FIS-0084 | RF-FIS-084; M06 §5.8; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Código de impuesto IVA** para informes de composición de deuda y asientos (V2 543) como mapeo del catálogo de tributos. | Los informes de composición de deuda separan IVA usando el mapeo. |
| CP-FIS-0161 | RF-FIS-161; RN-FIS-124; M06 §5.8; PRO-O4-04 | O4 | Estándar | integración | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Clase fiscal "aporte de capital"** (cuota o integración de capital social facturada junto al servicio): concepto **no gravado** que no integra el neto del servicio, ni la base de IVA, percepciones de IVA, IIBB ni tributos municipales… | Un comprobante con servicio ARS 10.000 + IVA 21 % y aporte de capital ARS 1.500 informa `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 1.500 y total 13.600; la percepción de IVA y el IIBB se calculan sobre 10.000. |
| CP-FIS-0162 | RF-FIS-162; RN-CON-124, RN-FIS-125; M06 §5.8; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Caso fiscal de derechos de sepultura** (perfil CEM): tratamiento de IVA definido **por concepto** en `conceptFiscalCases` — (a) adquisición del derecho de uso; (b) mantenimiento periódico; (c) actos (inhumación, exhumación, reducción… | Sin caso fiscal adoptado para los conceptos CEM del tenant, M04 no puede publicar la versión tarifaria del derecho (bloqueo con motivo); con el caso adoptado, un derecho en 24 cuotas factura cada cuota con la clase del concepto "adquisición" y el mantenimiento con la suya. |
### 1.9 Ingresos Brutos, padrones, CVP y jurisdicciones (M06 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0085 | RF-FIS-085; M06 §5.9; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Situaciones frente a IIBB** (exento, base mínima), **alícuotas IIBB** (rendir en facturación, impuesto, grupo), **matriz** situación × alícuota y **alícuota por comprobante** (con cálculo sobre IVA). | Las cuatro tablas se configuran con vigencia y se aplican en el cálculo. |
| CP-FIS-0086 | RF-FIS-086; M06 §5.9; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Percepción de IIBB en factura**: aplica si la alícuota es de "rendir en facturación" y la situación no es exenta; se cobra si la suma de netos alcanzados llega a la base mínima (situación) o al mínimo imponible (V2 758); sobre IVA si el… | Una factura con neto alcanzado menor a la base mínima no lleva percepción; la traza lo explica. |
| CP-FIS-0087 | RF-FIS-087; M06 §5.9; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Padrones de alícuotas por CUIT** (Córdoba RN 01/2017 V2 757, Buenos Aires ARBA, Entre Ríos ATER RN 208/24 y 234/24 con importador ARBA V2 2923, Río Negro), con vigencia, régimen, alícuota para no incluidos (V2 759 servicios públicos, V2… | Una cuenta incluida en el padrón vigente percibe con su alícuota; una no incluida, con la alícuota de no incluidos. Córdoba en O4 y el resto de jurisdicciones como configuración en O8 (DEC-054). |
| CP-FIS-0088 | RF-FIS-088; M06 §5.9; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Validación de vigencia del padrón** antes de facturar y aviso al iniciar sesión (V2 2699). | Con padrón vencido, la masiva queda bloqueada para los servicios alcanzados hasta importar uno vigente o aprobar excepción. |
| CP-FIS-0089 | RF-FIS-089; M06 §5.9; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Percepción IIBB en intereses entre vencimientos y recargos en caja** (V2 2826, concepto V2 2080) calculada por FIS para M07/M08. | El recargo cobrado en caja discrimina IIBB cuando el parámetro está activo. |
| CP-FIS-0090 | RF-FIS-090; M06 §5.9; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **CVP** (Código de Validación Provincial) por punto de venta, comprobante y período, con leyenda, para imprimir en el comprobante. | Un comprobante del punto y período con CVP vigente lleva el código y la leyenda. |
| CP-FIS-0091 | RF-FIS-091; M06 §5.9; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Convenio Multilateral**: jurisdicciones y coeficientes en el perfil, informe de bases imponibles y percepciones por jurisdicción como insumo de la declaración del contribuyente. | El informe por jurisdicción cuadra con el libro IVA y las percepciones del período. |
| CP-FIS-0092 | RF-FIS-092; M06 §5.9; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Motor por jurisdicción configurable**: cada provincia es una configuración (padrón, régimen, formato de exportación), no un desarrollo. | Agregar una jurisdicción nueva no requiere código si el formato existe en el catálogo. |
### 1.10 Percepciones nacionales y SICORE (M06 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0093 | RF-FIS-093; M06 §5.10; PRO-O4-04 | O4 | Estándar | integración | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Regímenes de percepción de IVA** aplicables al tenant (según relevamiento) configurados como tributo con régimen y códigos SICORE; percepción a no categorizados informada como Id 13 en WSFE y como percepción de impuestos nacionales en el… | Una percepción a no categorizado figura con su Id correcto en ARCA y en el libro. |
| CP-FIS-0094 | RF-FIS-094; M06 §5.10; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Exportación SICORE** de percepciones de ventas, retenciones a proveedores (impuesto y régimen configurables, ej. Ganancias) y datos de sueldos provistos por M16; formato decimal (V2 2991) e internacional (V2 2539); sin CUIT genérico. | Un sujeto sin CUIT válido queda en el informe de errores del archivo, no con un CUIT inventado. |
| CP-FIS-0095 | RF-FIS-095; M06 §5.10; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **Libro/informe de percepciones** que incluye todas las percepciones (IVA, IIBB, municipales y otras) por cuenta, CUIT, domicilio y comprobante. | La suma del informe coincide con `ImpTrib` de percepciones de los comprobantes del período. |
| CP-FIS-0096 | RF-FIS-096; M06 §5.10; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | Opción "no incluir percepciones" en el comprobante CVLP (V2 141) como parámetro de exhibición. | Con el parámetro activo, el CVLP no muestra percepciones. |
### 1.11 Retenciones como agente (motor invocado por M12/M14) (M06 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0097 | RF-FIS-097; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Calendario: Vencimientos ficticios de IVA, IIBB, SICORE, SIRCAR, RG 3571 y ERSeP del mes en curso | **Tipos de retención** configurables (IIBB, IVA, Ganancias, Seguridad Social) con régimen, mínimo imponible, mínimo de retención, valores fijos, banderas de suma/resta de componentes, factor, solo pago total, cálculo por ítem, acumulación… | La configuración reproduce cada ejemplo de RN-08 §3.3 con valores ficticios. |
| CP-FIS-0098 | RF-FIS-098; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Asignación** de tipos de retención a proveedores, productos y conceptos de compra. | Solo se calculan los tipos asignados al proveedor y habilitados. |
| CP-FIS-0099 | RF-FIS-099; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Cálculo de base imponible** por factura a pagar: prorrateo en pago parcial, base por ítems vinculados o totales de cabecera, IVA presunto en comprobantes no discriminados y anticipos (V2 2310), no retener en comprobantes no formales (V2… | Un anticipo de ARS 121 con IVA presunto 21 % tiene base ARS 100. |
| CP-FIS-0100 | RF-FIS-100; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Cálculo del importe**: mínimo (o cero si ya hubo retención en el año con descuento anual), tramo de escala, importe fijo + porcentaje sobre excedente, mínimo de retención, descuento de lo ya retenido, devolución (retención negativa)… | CU-FIS-01: base ARS 100.000 y retención ficticia ARS 2.000 producen pago neto ARS 98.000. |
| CP-FIS-0101 | RF-FIS-101; M06 §5.11; PRO-O8-03 | O8 | Estándar | funcional | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Sin escala válida → error** explícito; el motor no crea ni persiste escalas implícitas. | Un tipo sin escala devuelve "no se encontró una escala válida" y no modifica la configuración. |
| CP-FIS-0102 | RF-FIS-102; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Exclusiones, certificados de no retención y reducciones** por proveedor, régimen y vigencia, con respaldo y consulta de padrones de exclusión cuando existan. | Un proveedor con certificado de exclusión vigente no sufre retención; la traza cita el certificado. |
| CP-FIS-0103 | RF-FIS-103; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | **Período de información**: día límite configurable (V2 2045); después de ese día la retención se informa en el período siguiente. | Con día límite 10, una retención del 12 se asigna al período siguiente. |
| CP-FIS-0104 | RF-FIS-104; M06 §5.11; PRO-O8-03 | O8 | Estándar | integración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Certificados de retención**: numeración por tipo y punto de venta que reinicia cada año (punto de IIBB V2 2012), PDF, impresión automática por impuesto (V2 2038, 2040, 2042); distinción entre certificado interno y certificado oficial… | El certificado oficial registra su número/código de ARCA cuando se obtiene; el interno se identifica como tal. |
| CP-FIS-0105 | RF-FIS-105; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Anulación de OP**: retenciones anuladas (conservadas, importes en cero) y, si estaban declaradas, rectificativa. | Anular una OP con retención ya presentada abre un borrador de rectificativa. |
| CP-FIS-0106 | RF-FIS-106; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | Controles: modificación manual de retenciones solo con permiso y motivo (V2 2836); código de régimen obligatorio (V2 2813); no permitir anticipos en retenciones (V2 409); importación de retenciones de proveedores con base mínima (V2 2542)… | Un cambio manual queda con motivo y valor calculado original. |
| CP-FIS-0107 | RF-FIS-107; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **SIRE** F2004/F2005 (Seguridad Social y regímenes alcanzados) con código SIRE de la condición IVA del proveedor; exportación de seguridad social. | El archivo SIRE del período cuadra con las retenciones SUSS practicadas. |
| CP-FIS-0108 | RF-FIS-108; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Obligación fiscal** por régimen y período: importe, vencimiento, estado (pendiente, pagada, conciliada), pago vía M14 y conciliación con M15. | Pagar en M14 cambia la obligación a pagada solo con el movimiento confirmado. |
| CP-FIS-0109 | RF-FIS-109; M06 §5.11; PRO-O8-03 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | "Presentación automática al agregar retenciones" (V2 2952) se reemplaza por creación automática del **borrador de declaración** del período. | Al confirmar una retención se actualiza el borrador; nunca se marca presentado. |
| CP-FIS-0110 | RF-FIS-110; M06 §5.11; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Retenciones sufridas**: catálogo de tipos con cuenta contable, validación (régimen, certificado, CUIT del agente) para que M07 las registre en cobros, y consolidación para informes y crédito. | Un cobro con retención sufrida sin tipo válido es rechazado por M07 con el motivo provisto por FIS. |
| CP-FIS-0111 | RF-FIS-111; M06 §5.11; PRO-O9-07 | O9 | Estándar | regla | TEN-001 con Calendario: Vencimientos ficticios de IVA, IIBB, SICORE, SIRCAR, RG 3571 y ERSeP del mes en curso | **Ganancias 4.ª categoría, F.931 y LSD** se liquidan en M16; FIS solo recibe los datos para SICORE de sueldos y muestra las obligaciones en el calendario. | El SICORE de sueldos usa los importes de M16 sin recalcularlos. |
### 1.12 Libros IVA, Libro IVA Digital y Mis Comprobantes (M06 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0112 | RF-FIS-112; M06 §5.12; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Condiciones IVA y matriz: RI → A; exento, CF, monotributo y no categorizado → B; percepción IVA a no categorizado activa en TEN-001 | **Libro IVA Ventas** por período con criterios: facturado; percibido (para condiciones con percibido, por cobros y refinanciaciones); facturado y percibido (prorrateo por saldo); cuotas facturadas vencidas; por fecha de emisión o… | El total de IVA débito del libro coincide con los comprobantes autorizados del período en el criterio elegido. |
| CP-FIS-0113 | RF-FIS-113; M06 §5.12; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Tipos de informe**: tradicional (con variante rubricado), IVA por alícuota, neto por alícuota, neto e IVA por alícuota, agrupado por tipo de factura (grupo IVA), por actividad, percepciones, consumos relevantes. | Cada tipo cuadra en totales con el tradicional para el mismo filtro. |
| CP-FIS-0114 | RF-FIS-114; M06 §5.12; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Filtros**: tipo de factura, comprobante, situación IVA, servicio, sucursal, interno/fiscal, solo créditos, localidad, grupo contable, titular activo, facturación mensual/diaria (V2 2605). | Los filtros se combinan y se guardan como vista. |
| CP-FIS-0115 | RF-FIS-115; M06 §5.12; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Reglas de armado**: solo comprobantes fiscales; exclusión de prescripción de deuda; signo por débito/crédito; separar ítems financiados (V2 2972); en percibido informar total del IVA (V2 3110); carátula separada (V2 2325); valor por… | Un comprobante con 2,5 % aparece en "otros" en el informe y con su código propio en el archivo digital. |
| CP-FIS-0116 | RF-FIS-116; M06 §5.12; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Carátula**: totales de débito y crédito, gravado e IVA por condición y alícuota, LQSP aparte. | La carátula suma igual que el detalle. |
| CP-FIS-0117 | RF-FIS-117; M06 §5.12; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto | **Cierre del período** del libro: snapshot inmutable; reapertura con autorización y motivo; rectificación vinculada. | Un comprobante autorizado después del cierre aparece como "posterior al cierre" y no altera el snapshot. |
| CP-FIS-0118 | RF-FIS-118; M06 §5.12; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Libro IVA Compras** desde los comprobantes de M12, con informe personalizado (V2 382), IVA no tomado como gasto (V2 2890), porcentaje de IVA por sección del plan (V2 2902). | El crédito fiscal del libro coincide con los comprobantes de compra del período. |
| CP-FIS-0119 | RF-FIS-119; M06 §5.12; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Libro IVA Digital** (RG 4597): archivos de ventas (comprobantes y alícuotas) y compras (comprobantes y alícuotas) con las reglas de formato heredadas de RG 3685. | El archivo pasa la validación propia (RF-FIS-121) y se importa en el aplicativo de ARCA en la prueba de homologación del tenant piloto. |
| CP-FIS-0120 | RF-FIS-120; M06 §5.12; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Reglas de formato LID/RG 3685**: tipo 3 dígitos; punto 5 (00000 para 33, 99, 331, 332); número 20; comprador 80 con CUIT si tiene 11 dígitos y la condición no es CF ni no categorizado; 99 con número 0 hasta el umbral; nombre 30; moneda… | Cada regla tiene un caso de prueba con línea esperada. |
| CP-FIS-0121 | RF-FIS-121; M06 §5.12; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Validación de archivos** generados: análisis por línea (largo fijo, 266 caracteres en RG 3685) y por correlatividad, informando el **rango faltante completo**. | Un salto de 3 números informa los tres faltantes. |
| CP-FIS-0122 | RF-FIS-122; M06 §5.12; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Mis Comprobantes**: importar CSV actual de ARCA (y Excel heredado) de emitidos y recibidos; comparar con libros de ventas y compras por código, punto y rango de número. | El import acepta ambos formatos y rechaza filas mal formadas con su número de fila. |
| CP-FIS-0123 | RF-FIS-123; M06 §5.12; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Resultados de la conciliación**: inexistente en GoodApps, inexistente en ARCA, diferencias mayores a la tolerancia (ARS 1 por defecto) en neto, no gravado, exento, IVA (todas las alícuotas), percepciones y total; signos correctos en… | Un comprobante con dos alícuotas no genera diferencia falsa de IVA. |
| CP-FIS-0124 | RF-FIS-124; M06 §5.12; PRO-O8-04 | O8 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Comprobantes recibidos**: verificación de CAE/CAI de proveedores al cargar facturas de compra (V2 2977), advertencia de comprobantes no autorizados según situación IVA (V2 2365). | Una factura de compra con CAE inexistente en ARCA genera advertencia en M12. |
### 1.13 Regímenes informativos y presentaciones (M06 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0125 | RF-FIS-125; M06 §5.13; PRO-O8-04 | O8 | Estándar | migración | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Catálogo de regímenes** (tabla normativa con formato y versión): Libro IVA Digital RG 4597; RG 3685 (CITI, histórico); RG 1361 duplicados electrónicos; RG 3349 consumos relevantes; RG 3571 RCSP y variante RG 46/2019 con generadores; RG… | Cada régimen activo del tenant tiene formato, versión, período y vencimiento. |
| CP-FIS-0126 | RF-FIS-126; M06 §5.13; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Generación de declaración** por régimen y período: universo, validaciones, archivo con nombre normativo, hash, versión de formato, totales de control. | Regenerar el mismo período sin cambios produce el mismo hash. |
| CP-FIS-0127 | RF-FIS-127; M06 §5.13; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Declaraciones: DDJJ-DEMO-001 (retenciones, `approved`), DDJJ-RG3571-DEMO-2026-09 `rejected` con su rectificativa en `draft` (CU-FIS-10) | **Registro de presentación**: estados generado → validado → aprobado → presentado (con acuse adjunto y fecha) → aceptado/rechazado → rectificado; la original se vincula con la rectificativa. | Exportar no marca presentado; presentar exige acuse o número de transacción. |
| CP-FIS-0128 | RF-FIS-128; M06 §5.13; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **RG 3571 RCSP / RG 5746/2025**: rendición de comprobantes de servicios públicos con detalle de generadores, análisis por línea y correlatividad. | El archivo incluye los datos de energía inyectada para los usuarios-generadores. |
| CP-FIS-0129 | RF-FIS-129; M06 §5.13; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **RG 3349 consumos relevantes** con opción de incluir conceptos asociados al servicio (V2 2358). | El archivo lista los consumos sobre el umbral vigente de la tabla normativa. |
| CP-FIS-0130 | RF-FIS-130; M06 §5.13; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **RG 1361** duplicados electrónicos. | El archivo incluye todos los comprobantes del período con sus tributos bien clasificados. |
| CP-FIS-0131 | RF-FIS-131; M06 §5.13; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %) | **SIRCAR**: percepciones y retenciones de IIBB por jurisdicción (Córdoba, Río Negro; 904 con constancia), versión de formato (v12 o anterior), validación de CUIT con lista de errores. | Un CUIT inválido aparece en la lista de errores y no aborta en silencio. |
| CP-FIS-0132 | RF-FIS-132; M06 §5.13; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de… | **Exportadores provinciales y municipales**: ARBA (nombre `AR-<cuit>-AAAAMM<quincena>-6-LOTE1`), A122R (`ER-…-LOTE00001`), Santa Fe, La Pampa (todo del mismo mes), Río Negro, DGR (V2 2445, 2935) y SILARPIB, retenciones municipales… | Cada exportador se activa por configuración de jurisdicción. |
| CP-FIS-0133 | RF-FIS-133; M06 §5.13; PRO-O8-04 | O8 | Estándar | regla | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | **Alertas de vencimiento** de cada declaración y de rechazos sin rectificar. | Una declaración rechazada sin rectificativa a 2 días del vencimiento alerta al responsable. |
### 1.14 Conceptos por cuenta y orden de terceros (M06 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0134 | RF-FIS-134; M06 §5.14; PRO-O4-04 | O4 | Estándar | regla | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Convenios** con el organismo beneficiario: CUIT, fundamento normativo, vigencia, base, alícuota o importe, servicio y documento en que puede incluirse, forma de exhibición, comisión de cobranza si existe, cuenta de pasivo; sin convenio y… | Un concepto de alumbrado público sin convenio vigente no puede facturarse. |
| CP-FIS-0135 | RF-FIS-135; M06 §5.14; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Exhibición separada** en el comprobante del cargo propio y del concepto de terceros; tratamiento fiscal del concepto de terceros (no gravado/no ingreso propio, según convenio). | El PDF muestra la sección "por cuenta y orden de terceros" con cada organismo. |
| CP-FIS-0136 | RF-FIS-136; M06 §5.14; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Pasivo con el tercero**, no ingreso propio (evento a M15). | El asiento de emisión acredita el pasivo del convenio. |
| CP-FIS-0137 | RF-FIS-137; M06 §5.14; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **Importaciones de terceros** que realiza M05 (alumbrado público IAL, Excel EMA, tasa verde SAM, emergencias EME, A.M.A. CT1 con concepto V2 2284, farmacia FAR con titular V2 2721, celulares CEL, gas importado, telefonía revendida PR1… | Una importación con un concepto de terceros sin convenio rechaza esas filas con motivo. |
| CP-FIS-0138 | RF-FIS-138; M06 §5.14; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **Imputación de pagos parciales** entre conceptos propios y de terceros según la política aprobada. | Un pago parcial de ARS 5.000 sobre una factura de ARS 10.000 con ARS 1.000 de terceros imputa ARS 500 al tercero (prorrata). |
| CP-FIS-0139 | RF-FIS-139; M06 §5.14; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **Rendición periódica**: liquidación de lo cobrado por convenio y período (base, comisión, neto a rendir), reporte para el organismo, orden de pago en M14 y conciliación. | La rendición cuadra con los cobros imputados al tercero en el período. |
| CP-FIS-0140 | RF-FIS-140; M06 §5.14; PRO-O8-04 | O8 | Estándar | funcional | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **FECESCOR**: rendición de facturas de terceros y de tarjeta (número de sucursal V2 68, lote V2 3039, pago de resumen en canal web V2 3096, entidad de terceros V2 3114, correos V2 3158, código de propiedad V2 3190). | El archivo FECESCOR del período cuadra con los cobros de la entidad configurada. |
| CP-FIS-0141 | RF-FIS-141; M06 §5.14; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Tributos municipales**: catálogo que distingue tasas por cuenta del municipio (terceros) de tributos propios de la cooperativa (que no se trasladan al socio sin fundamento). | Un tributo propio marcado como no trasladable no puede asignarse como cargo al socio. |
| CP-FIS-0142 | RF-FIS-142; M06 §5.14; PRO-O8-04 | O8 | Estándar | migración | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Informe de impuestos facturados por categoría** con selección guardada de productos y servicios por servicio e impuesto. | La selección guardada se recupera exactamente (corrige el cruce de listas de ProCoop). |
| CP-FIS-0163 | RF-FIS-163; RN-FIS-126; M06 §5.14; PRO-O7-11 | O7 | Estándar | migración | TEN-001 con Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de… | **Regla de clasificación tributo propio / tributo de terceros / concepto de terceros** para cada definición del catálogo (`taxDefinitions.nature`) y para la migración de `IMPUESTO`/`CLASESER` (T07, M02; `CON_TASAS` solo si el perfilado de… | La tasa hospital (organismo municipal/hospital con convenio) se clasifica como concepto de terceros; un tributo provincial que la cooperativa percibe como agente queda `perception`; una fila de `IMPUESTO` sin organismo ni convenio queda pendiente con motivo (antes el ejemplo citaba una fila de `CON_TASAS`, que ahora va a Compras). |
| CP-FIS-0164 | RF-FIS-164; RN-FIS-127, RN-FIS-129; M06 §5.14; PRO-O6-02 | O6 | Estándar | regla | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **Clasificación del saldo de conceptos de terceros para mora**: el saldo impago de cada concepto de terceros se identifica como tal (por `thirdPartyAgreementId`) y **se excluye por defecto del saldo elegible de mora** de M08 (RF-MOR-068)… | Una cuenta con ARS 9.000 propios y ARS 1.000 de alumbrado vencidos tiene saldo elegible de mora ARS 9.000 con el convenio por defecto; con `includeInEligibleBalance = true`, ARS 10.000; sin `surcharge` en el convenio, el interés de mora no se calcula sobre los ARS 1.000. La marca de corte (`moraPolicy.allowServiceCut` con norma validada) es independiente y la regula RN-FIS-129. |
| CP-FIS-0165 | RF-FIS-165; RN-FIS-128; M06 §5.14; PRO-O10-13 | O10 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Clase fiscal "depósito en garantía"** (por ejemplo, el del préstamo ortopédico de M18 o la garantía de M08): concepto fuera de la base imponible y no gravado (`conceptFiscalCases.caseCode = guaranteeDeposit`, `fiscalClass =… | Un comprobante con servicio ARS 10.000 + IVA 21 % y depósito en garantía ARS 50.000 (valores ficticios) informa `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 50.000 y total 62.100; la percepción se calcula sobre 10.000. |
| CP-FIS-0166 | RF-FIS-166; RN-FIS-129; M06 §5.14; PRO-O6-04 | O6 | Estándar | regla | TEN-001 con Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11) | **Marca de corte en el convenio de terceros**: `thirdPartyAgreements.moraPolicy.allowServiceCut` (default `false`) con norma habilitante `cutNormativeRef` validada; se publica a M08 junto con las marcas de saldo elegible y recargo… | Con convenio de alumbrado sin marca de corte, una cuenta que solo debe alumbrado no entra en la lista de corte de M08; con `allowServiceCut = true` pero norma `pending`, tampoco; con norma `validated`, M08 puede considerarla. |
| CP-FIS-0167 | RF-FIS-167; RN-FIS-130, RN-FIS-131; M06 §5.14; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE) | **Emisión fiscal por entidad jurídica** (DEC-064): perfil fiscal, CUIT, credencial ARCA, puntos de venta, CAEA/CESP, libros IVA, regímenes y obligaciones por `legalEntityId` (RN-FIS-130). T04 guarda solo los datos legales básicos de la… | Un tenant con LE-01 y LE-02 tiene dos perfiles fiscales, dos certificados y el punto de venta 0001 en ambas; un comprobante de LE-02 se autoriza con el certificado y CUIT de LE-02 y figura solo en el Libro IVA de LE-02. |
| CP-FIS-0168 | RF-FIS-168; RN-FIS-132; M06 §5.14; PRO-O4-01 | O4 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Mantenimiento mixto de padrones** (ex PA-CFG-05 de T04, trasladada con CTR-DAT-13): los padrones públicos (padrón offline ARCA, padrones provinciales de descarga libre) los ingesta la plataforma y los adoptan los tenants; los que solo se… | El padrón offline ARCA cargado por la plataforma queda disponible para LE-01 de TEN-001 y TEN-002 sin reimportar; el padrón de Córdoba que exige la clave del agente solo lo importa cada tenant y no es visible para otro. |
### 1.15 Informes a entes reguladores (M06 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0143 | RF-FIS-143; M06 §5.15; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Catálogo de informes regulatorios** por organismo y servicio, con formato, versión, período, vencimiento y conceptos configurables por tenant; distinto del módulo de retenciones. | Cada informe activo tiene organismo, servicio, formato y vencimiento. |
| CP-FIS-0144 | RF-FIS-144; M06 §5.15; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Reguladores: Configuración ERSeP con código de empresa `ERSEP-DEMO`; ENARGAS FCU-DS para TEN-002 con tablas maestras demo; ENACOM con un servicio de Internet… | **ERSeP**: Circular 70/2021 (régimen de ventas, código de empresa V2 737), archivo de consumos, informe de pérdidas por servicio, informe de servicios (titulares), DNU 311/2020 riesgo de corte (instancias V2 2203/2204), tarifa social… | Los archivos ERSeP del período se generan con el código de empresa configurado. |
| CP-FIS-0145 | RF-FIS-145; M06 §5.15; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **ENARGAS/ENReGE**: protocolo SARI (FDU, DET, CMD, USR, RAU, FDC, FDD, RZF-DS, SUP) y FCU-DS (FaC, Sub, FaD, CoC, Usr, FaV, SICC), tablas maestras por protocolo (V2 2603), matrícula como identificador (V2 3174), concepto de percepción (V2… | El paquete FCU-DS del período se genera con nombres y separadores del protocolo. |
| CP-FIS-0146 | RF-FIS-146; M06 §5.15; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Reguladores: Configuración ERSeP con código de empresa `ERSEP-DEMO`; ENARGAS FCU-DS para TEN-002 con tablas maestras demo; ENACOM con un servicio de Internet… | **ENACOM**: configuración, por servicio TIC (fija, móvil, Internet, TV), de servicios principales, servicios, productos e impuestos que componen cada informe, guardada en GoodApps (no en archivo del servidor); informes vigentes que defina… | La configuración se versiona por tenant y alimenta el informe. |
| CP-FIS-0147 | RF-FIS-147; M06 §5.15; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Secretaría de Energía**: informe de energía y de usuarios-generadores (energía inyectada). | El informe de generadores cuadra con las lecturas de inyección del período. |
| CP-FIS-0148 | RF-FIS-148; M06 §5.15; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Indicadores de calidad** de servicio y de atención (de M09/M10) incluibles en informes regulatorios cuando el regulador los exija. | Un informe puede incluir un indicador del catálogo T10 con su fórmula. |
| CP-FIS-0149 | RF-FIS-149; M06 §5.15; PRO-O7-07 | O7 | Estándar | funcional | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Presentación y acuse** de informes regulatorios con el mismo ciclo de estados de RF-FIS-127. | Un informe regulatorio no figura presentado sin acuse. |
| CP-FIS-0150 | RF-FIS-150; M06 §5.15; PRO-O7-07 | O7 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | Mapa de **responsabilidad regulatoria** por servicio (regulador vs prestador vs autoridad tarifaria; ERSeP no rige todo el gas; ENReGE asume funciones federales antes de ENARGAS/ENRE) en el perfil del tenant. | Cada servicio del tenant indica su regulador y autoridad vigentes. |
### 1.16 Comprobantes de administración pública (M06 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0151 | RF-FIS-151; M06 §5.16; PRO-O5-07 | O5 | Estándar | regla | TEN-001 con Administración pública: Cuenta ficticia "Organismo Público Demo" con 3 facturas impagas de octubre | **Selección** de facturas impagas de cuentas de organismos públicos (u otras liquidadas en bloque) por período o fecha de emisión, con filtros (empresa postal, cuenta, titular, tipo de factura, servicio, rango de vencimiento) y datos de… | La selección muestra consumo total por factura y servicio. |
| CP-FIS-0152 | RF-FIS-152; M06 §5.16; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Guardar selección** con reemplazo controlado del período/fecha (sin duplicados), aviso si ya existe una selección y eliminación de comprobantes elegidos. | Guardar dos veces la misma fecha no duplica registros. |
| CP-FIS-0153 | RF-FIS-153; M06 §5.16; PRO-O5-07 | O5 | Estándar | funcional | TEN-001 con CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested` | **Vista para cobro en caja** (M07) filtrable por período, grupo contable y "recibos de empleados" (cuentas asociadas a legajos para descuento por recibo de sueldo, M16). | M07 cobra la selección y M16 recibe los descuentos de empleados. |
### 1.17 Modo pasarela (autorización para sistemas externos) (M06 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0154 | RF-FIS-154; M06 §5.17; PRO-O11-05 | O11 | Estándar | integración | TEN-001 con Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1… | **Modo pasarela**: autorizar comprobantes generados por sistemas externos mediante API (`/api/v1/ext/fis/...`) e importación CSV (diseño de 46 columnas posicionales con separador configurable V2 2497), sin carpetas compartidas. | Un sistema externo envía un comprobante por API y consulta su CAE con idempotencia. |
| CP-FIS-0155 | RF-FIS-155; M06 §5.17; PRO-O11-05 | O11 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Validaciones del modo pasarela**: duplicados, reemplazo de pendientes no procesados, comprobante relacionado de 16 caracteres (tipo, punto, número) con CUIT del emisor para 203 y 208, hasta 3 alícuotas y 3 tributos en CSV (sin límite en… | Un comprobante ya autorizado no se reemplaza; solo se actualiza su origen. |
| CP-FIS-0156 | RF-FIS-156; M06 §5.17; PRO-O11-05 | O11 | Estándar | integración | TEN-001 con Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento… | **Resultado del modo pasarela**: por API o archivo de salida con tipo, punto, número, fecha, importe, CAE, vencimiento y error; marcas de exportado/error que se reexportan al autorizar. | Un comprobante con error que luego se autoriza vuelve a informarse con su CAE. |
### 1.18 Contabilidad, BI y conservación (M06 §5.18)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-FIS-0157 | RF-FIS-157; M06 §5.18; PRO-O5-11 | O5 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Eventos contables**: IVA débito por alícuota, percepciones (productos, no categorizados), IIBB, retenciones practicadas y sufridas, pasivo con terceros, IVA crédito, devengamiento de IVA en refinanciaciones; mapeo de cuentas por tenant… | Todo evento fiscal económico tiene cuenta mapeada; sin mapeo, M15 lo retiene en bandeja. |
| CP-FIS-0158 | RF-FIS-158; M06 §5.18; PRO-O11-01 | O11 | Estándar | regla | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Datasets fiscales** para BI con contrato semántico (facturado fiscal, IVA débito, percepciones, retenciones, terceros), fecha de corte y granularidad. | El tablero fiscal y el libro IVA reconcilian para el mismo período. |
| CP-FIS-0159 | RF-FIS-159; M06 §5.18; PRO-O4-04 | O4 | Estándar | funcional | TEN-001 con Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002… | **Expediente** de cada presentación, convenio, certificado y conciliación (acuses, constancias, archivos) con conservación por el plazo legal que defina T08. | Cada presentación tiene sus archivos y acuses descargables con URL firmada. |
| CP-FIS-0160 | RF-FIS-160; M06 §5.18; PRO-O4-04 | O4 | Estándar | seguridad | TEN-001 con Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de… | **Aislamiento por tenant** de credenciales, colas, padrones y declaraciones; un job nunca procesa datos de dos tenants. | Pruebas de aislamiento: consultar con token de otro tenant devuelve 404. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-FIS-5001 — ESC-FIS-01. Autorizar 100 comprobantes B del mismo par**

- Cubre: ESC-FIS-01; RF-FIS-039; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Autorizar 100 comprobantes B del mismo par
- Entonces 100 CAE; numeración correlativa; 1 request si `FECompTotXRequest` ≥ 100.

**CP-FIS-5002 — ESC-FIS-02. Factura A a receptor sin CUIT**

- Cubre: ESC-FIS-02; RF-FIS-041; RN-FIS-045; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Factura A a receptor sin CUIT
- Entonces Detenida en prevalidación; no se cambia a B ni a CF; excepción en M05.

**CP-FIS-5003 — ESC-FIS-03. Comprobante B a CF sobre el umbral de identificación sin documento**

- Cubre: ESC-FIS-03; RN-FIS-026; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comprobante B a CF sobre el umbral de identificación sin documento
- Entonces Detenido; mensaje accionable.

**CP-FIS-5004 — ESC-FIS-04. Receptor con condición IVA no válida para la clase (error 10242/10243 simulado)**

- Cubre: ESC-FIS-04; RN-FIS-045; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Receptor con condición IVA no válida para la clase (error 10242/10243 simulado)
- Entonces Rechazado y detenido para corrección; sin reintento con CF.

**CP-FIS-5005 — ESC-FIS-05. Alícuota no mapeada**

- Cubre: ESC-FIS-05; RN-FIS-034; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de terceros ARS 500; fondo provincial ficticio 1 % por cuenta de terceros
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Alícuota no mapeada
- Entonces Detenido, nunca descartada.

**CP-FIS-5006 — ESC-FIS-06. Tributo IIBB con Id de mapeo explícito**

- Cubre: ESC-FIS-06; RN-FIS-035; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tributo IIBB con Id de mapeo explícito
- Entonces `Tributo.Id = 7` (percepción IIBB) independientemente del código interno.

**CP-FIS-5007 — ESC-FIS-07. Observaciones de ARCA en un comprobante de una tanda**

- Cubre: ESC-FIS-07; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Observaciones de ARCA en un comprobante de una tanda
- Entonces Observaciones asignadas a ese comprobante y no a la tanda.

**CP-FIS-5008 — ESC-FIS-08. CAEA vencido el día de su vencimiento**

- Cubre: ESC-FIS-08; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CAEA vencido el día de su vencimiento
- Entonces Utilizable hasta el fin del día de vencimiento; al día siguiente no.

**CP-FIS-5009 — ESC-FIS-09. CESP nuevo contenido dentro de otro**

- Cubre: ESC-FIS-09; RF-FIS-071; M06 §17.1
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: CESP: CESP-DEMO-001 para punto 0009 desde 01/11/2026 hasta 30/11/2026
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando CESP nuevo contenido dentro de otro
- Entonces Rechazado.

**CP-FIS-5010 — ESC-FIS-10. Total de comprobante ARS 0,02**

- Cubre: ESC-FIS-10; RN-FIS-037; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Total de comprobante ARS 0,02
- Entonces Todo exento; ajuste trazado.

**CP-FIS-5011 — ESC-FIS-11. Retención con mínimo no superado**

- Cubre: ESC-FIS-11; RF-FIS-100; M06 §17.1
- Ola: O8 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de demostración); TEN-002 "Cooperativa Demo Gas" (responsable inscripto, LQSP no…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Retención con mínimo no superado
- Entonces Retención cero con traza del motivo.

**CP-FIS-5012 — ESC-FIS-12. Libro IVA con NC del período**

- Cubre: ESC-FIS-12; RF-FIS-115; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Libro IVA con NC del período
- Entonces NC con signo negativo; totales cuadran con autorizados.

**CP-FIS-5013 — ESC-FIS-13. Percepciones en informe del libro**

- Cubre: ESC-FIS-13; RN-FIS-094; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Percepciones en informe del libro
- Entonces Incluye todas las percepciones, no solo IVA.

**CP-FIS-5014 — ESC-FIS-14. Archivo LID con hueco de numeración**

- Cubre: ESC-FIS-14; RF-FIS-121; M06 §17.1
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Archivo LID con hueco de numeración
- Entonces Informe de rango faltante completo.

**CP-FIS-5015 — ESC-FIS-15. Conciliación ARCA con alícuota 10,5 % y 21 %**

- Cubre: ESC-FIS-15; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación ARCA con alícuota 10,5 % y 21 %
- Entonces Compara todas las alícuotas.

**CP-FIS-5016 — ESC-FIS-16. Rendición de terceros con pago parcial**

- Cubre: ESC-FIS-16; RF-FIS-138, RF-FIS-139; M06 §17.1
- Ola: O5 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición de terceros con pago parcial
- Entonces Imputación según política vigente; el tercero recibe solo lo cobrado.

**CP-FIS-5017 — ESC-FIS-17. Declaración generada sin acuse**

- Cubre: ESC-FIS-17; RF-FIS-127; M06 §17.1
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: CAEA: Período 202611, quincena 1, estado `active`, con 0 comprobantes; quincena 2 `requested`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Declaración generada sin acuse
- Entonces Estado `generated`/`approved`; nunca `submitted`.

**CP-FIS-5018 — ESC-FIS-18. Tabla normativa publicada no adoptada**

- Cubre: ESC-FIS-18; RF-FIS-002; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tabla normativa publicada no adoptada
- Entonces No se aplica en producción; aviso en tablero.

**CP-FIS-5019 — ESC-FIS-19. Padrón IIBB vencido con `PRM-FIS-035` activo**

- Cubre: ESC-FIS-19; RN-FIS-080; M06 §17.1
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Padrón IIBB vencido con `PRM-FIS-035` activo
- Entonces Cálculo bloqueado con `fis.taxCalculation.blocked`.

**CP-FIS-5020 — ESC-FIS-20. Modo pasarela con comprobante ya autorizado reenviado**

- Cubre: ESC-FIS-20; RF-FIS-155; M06 §17.1
- Ola: O11 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O11 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Modo pasarela con comprobante ya autorizado reenviado
- Entonces Devuelve el CAE existente; no reemplaza.

**CP-FIS-5021 — ESC-FIS-21. Operador de facturación sin `fis.arca.configurar` intenta subir certificado**

- Cubre: ESC-FIS-21; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Operador de facturación sin `fis.arca.configurar` intenta subir certificado
- Entonces 403 `fis/forbidden`; auditoría del intento.

**CP-FIS-5022 — ESC-FIS-22. Usuario que generó una declaración intenta aprobarla con doble control activo**

- Cubre: ESC-FIS-22; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario que generó una declaración intenta aprobarla con doble control activo
- Entonces Rechazado: segregación de funciones.

**CP-FIS-5023 — ESC-FIS-23. Aprobar o presentar sin MFA reforzado**

- Cubre: ESC-FIS-23; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aprobar o presentar sin MFA reforzado
- Entonces Solicita MFA; sin él, no avanza.

**CP-FIS-5024 — ESC-FIS-24. Soporte de plataforma intenta ver la clave privada o el TA**

- Cubre: ESC-FIS-24; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Soporte de plataforma intenta ver la clave privada o el TA
- Entonces No existe endpoint que la devuelva; solo metadatos (huella, vencimiento).

**CP-FIS-5025 — ESC-FIS-25. Tenant intenta editar una tabla normativa de plataforma**

- Cubre: ESC-FIS-25; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tenant intenta editar una tabla normativa de plataforma
- Entonces 403; solo puede adoptar o pedir revisión.

**CP-FIS-5026 — ESC-FIS-26. Auditor intenta reabrir un Libro IVA cerrado**

- Cubre: ESC-FIS-26; M06 §17.2
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Auditor intenta reabrir un Libro IVA cerrado
- Entonces 403.

**CP-FIS-5027 — ESC-FIS-27. TEN-002 consulta un `fiscalAuthorizations` de TEN-001 por id**

- Cubre: ESC-FIS-27; M06 §17.3
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando TEN-002 consulta un `fiscalAuthorizations` de TEN-001 por id
- Entonces 404 (no revela existencia).

**CP-FIS-5028 — ESC-FIS-28. Caché de TA**

- Cubre: ESC-FIS-28; M06 §17.3
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Caché de TA
- Entonces Clave por (tenant, CUIT, servicio, ambiente); TEN-002 nunca usa el TA de TEN-001.

**CP-FIS-5029 — ESC-FIS-29. Job de autorización con dos tenants**

- Cubre: ESC-FIS-29; M06 §17.3
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de demostración); TEN-002 "Cooperativa Demo Gas" (responsable inscripto, LQSP no…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Job de autorización con dos tenants
- Entonces Colas y límites de tasa separados; la caída de uno no frena al otro.

**CP-FIS-5030 — ESC-FIS-30. Exportación de libro IVA**

- Cubre: ESC-FIS-30; M06 §17.3
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Exportación de libro IVA
- Entonces Solo datos del tenant; archivo en almacenamiento privado con URL firmada de corta duración.

**CP-FIS-5031 — ESC-FIS-31. Tenant demo intenta producción**

- Cubre: ESC-FIS-31; M06 §17.3
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Tenant demo intenta producción
- Entonces Bloqueado por `PRM-FIS-002`.

**CP-FIS-5032 — ESC-FIS-32. Timeout tras enviar**

- Cubre: ESC-FIS-32; relacionados: CU-FIS-03; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Timeout tras enviar
- Entonces `uncertain`; consulta antes de reintentar; 0 duplicados (CU-FIS-03).

**CP-FIS-5033 — ESC-FIS-33. ARCA no disponible (error transitorio)**

- Cubre: ESC-FIS-33; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando ARCA no disponible (error transitorio)
- Entonces Reintentos con backoff `PRM-FIS-027`; al agotarlos, `fis.authorization.globalFailure` y pausa de lotes en M05.

**CP-FIS-5034 — ESC-FIS-34. Certificado vencido**

- Cubre: ESC-FIS-34; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Certificado vencido
- Entonces Sin envíos; `fis.credential.expired`; tablero rojo; ningún comprobante cambia de estado.

**CP-FIS-5035 — ESC-FIS-35. Dos workers toman el mismo par**

- Cubre: ESC-FIS-35; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: CESP: CESP-DEMO-001 para punto 0009 desde 01/11/2026 hasta 30/11/2026
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos workers toman el mismo par
- Entonces Lock por (tenant, punto, tipo); el segundo espera.

**CP-FIS-5036 — ESC-FIS-36. Reintento de `POST` con mismo `Idempotency-Key`**

- Cubre: ESC-FIS-36; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reintento de `POST` con mismo `Idempotency-Key`
- Entonces Misma respuesta.

**CP-FIS-5037 — ESC-FIS-37. Conciliación diaria con CAE distinto en ARCA**

- Cubre: ESC-FIS-37; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación diaria con CAE distinto en ARCA
- Entonces Incidencia `toReconcile`; resolución con aprobación y evento `fis.authorization.reconciled`.

**CP-FIS-5038 — ESC-FIS-38. Retención: OP reintentada**

- Cubre: ESC-FIS-38; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de demostración); TEN-002 "Cooperativa Demo Gas" (responsable inscripto, LQSP no…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Retención: OP reintentada
- Entonces Una sola retención.

**CP-FIS-5039 — ESC-FIS-39. Rendición recalculada**

- Cubre: ESC-FIS-39; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tenants: TEN-001 "Cooperativa Demo Agua y Electricidad" (responsable inscripto, agente de percepción IIBB y agente de retención IVA/Ganancias/IIBB de demostración); TEN-002 "Cooperativa Demo Gas" (responsable inscripto, LQSP no…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición recalculada
- Entonces Misma rendición en borrador; una aprobada no se recalcula (se ajusta en la siguiente).

**CP-FIS-5040 — ESC-FIS-40. Aporte de capital en el comprobante (HUECO-CAP-04)**

- Cubre: ESC-FIS-40; RN-FIS-124; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aporte de capital en el comprobante (HUECO-CAP-04)
- Entonces Servicio ARS 10.000 + IVA 21 % + aporte ARS 1.500 (ficticios): `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 1.500, total 13.600; percepciones e IIBB sobre 10.000; con PRM-FIS-122 = `outsideFiscalDocument` el aporte no viaja a ARCA (RN-FIS-124).

**CP-FIS-5041 — ESC-FIS-41. Derecho de sepultura sin caso fiscal (HUECO-CEM-01)**

- Cubre: ESC-FIS-41; RN-FIS-125; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Derecho de sepultura sin caso fiscal (HUECO-CEM-01)
- Entonces M04 no puede publicar la versión del derecho; con el caso adoptado, cada cuota lleva la clase del concepto "adquisición" y el diferimiento contable de M15 no cambia el comprobante (RN-FIS-125).

**CP-FIS-5042 — ESC-FIS-42. Clasificación en migración (HUECO-TAS-03)**

- Cubre: ESC-FIS-42; RN-FIS-126; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Impuestos: IVA 21 % y 27 % (consumos no residenciales); percepción IIBB ficticia 2,5 %; alícuota de no incluidos ficticia 3 %; tasa de alumbrado por cuenta de terceros ARS 500; fondo provincial ficticio 1 % por cuenta de terceros
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Clasificación en migración (HUECO-TAS-03)
- Entonces Fila de `IMPUESTO` con `ORIGEN` municipal y convenio vigente ⇒ `thirdPartyCharge`; con régimen de percepción provincial ⇒ `perception`; sin organismo ni convenio ⇒ `pendingClassification`, no publicable (RN-FIS-126).

**CP-FIS-5043 — ESC-FIS-43. Saldo de terceros en mora (HUECO-TAS-02)**

- Cubre: ESC-FIS-43; RN-FIS-127; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Saldo de terceros en mora (HUECO-TAS-02)
- Entonces ARS 9.000 propios + ARS 1.000 de alumbrado vencidos: saldo elegible de mora 9.000 por defecto; 10.000 con `includeInEligibleBalance = true`; sin `surcharge` no hay interés sobre los 1.000 (RN-FIS-127).

**CP-FIS-5044 — ESC-FIS-44. Depósito en garantía (HUECO-OTR-04)**

- Cubre: ESC-FIS-44; RN-FIS-128; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Depósito en garantía (HUECO-OTR-04)
- Entonces Servicio ARS 10.000 + IVA 21 % + depósito ARS 50.000 (ficticios): `ImpNeto` 10.000, `ImpIVA` 2.100, `ImpTotConc` 50.000, total 62.100; percepciones sobre 10.000; la devolución del depósito no genera NC fiscal (RN-FIS-128).

**CP-FIS-5045 — ESC-FIS-45. Corte por deuda de terceros (HUECO-ALU-01)**

- Cubre: ESC-FIS-45; RN-FIS-129; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corte por deuda de terceros (HUECO-ALU-01)
- Entonces Cuenta que solo debe ARS 1.000 de alumbrado: con `allowServiceCut = false` o norma `pending` no entra en la lista de corte de M08; con `allowServiceCut = true` y norma `validated`, M08 puede considerarla; EVT-FIS-24 lleva ambas marcas (RN-FIS-129).

**CP-FIS-5046 — ESC-FIS-46. Dos entidades jurídicas (DEC-064)**

- Cubre: ESC-FIS-46; RN-FIS-130; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos entidades jurídicas (DEC-064)
- Entonces LE-01 y LE-02 con PV 0001 cada una: un comprobante de LE-02 se autoriza con certificado y CUIT de LE-02, la caché de TA es separada y el Libro IVA de LE-01 no lo incluye; un comprobante de LE-02 con PV de LE-01 queda detenido con `legalEntityMismatch` (RN-FIS-130).

**CP-FIS-5047 — ESC-FIS-47. Cambio de razón social en T04 (RN-FIS-131)**

- Cubre: ESC-FIS-47; RN-FIS-131; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de razón social en T04 (RN-FIS-131)
- Entonces `cfg.legalEntity.updated` cambia la razón social de LE-02: el perfil queda en revisión, los comprobantes nuevos de LE-02 quedan detenidos con `legalEntityProfileReview` y los ya autorizados conservan su `issuerSnapshot`; al aprobar la versión nueva se reanudan.

**CP-FIS-5048 — ESC-FIS-48. Padrón de plataforma y de tenant (RN-FIS-132)**

- Cubre: ESC-FIS-48; RN-FIS-132; M06 §17.4
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Padrón de plataforma y de tenant (RN-FIS-132)
- Entonces Padrón provincial público cargado por la plataforma y padrón del agente importado por TEN-001 para la misma jurisdicción: un CUIT ficticio presente en ambos usa la alícuota del padrón de TEN-001; TEN-002 solo ve el de plataforma.

**CP-FIS-5049 — ESC-01. El excedente de ARS 2.000 de A no genera NC ni comprobante fiscal; si luego se aplica a una factura, el Libro…**

- Cubre: ESC-01; M06 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Escenarios BASE» (M06 §17.5)
- Entonces El excedente de ARS 2.000 de A no genera NC ni comprobante fiscal; si luego se aplica a una factura, el Libro IVA percibido toma el cobro en la fecha de imputación. Sin documento fiscal por un saldo a favor.

**CP-FIS-5050 — ESC-02. La corrección de ARS 12.000 a ARS 15.000 se emite como ND de ARS 3.000 vinculada; FIS la autoriza con…**

- Cubre: ESC-02; M06 §17.5
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Escenarios BASE» (M06 §17.5)
- Entonces La corrección de ARS 12.000 a ARS 15.000 se emite como ND de ARS 3.000 vinculada; FIS la autoriza con comprobante asociado y la informa en el libro del período de la ND. Original intacto; ND con `CbtesAsoc`.

**CP-FIS-5051 — ESC-04. CU-FIS-17. Sin reenvío ni renumeración.**

- Cubre: ESC-04; relacionados: CU-FIS-17; M06 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de Ganancias con 3 tramos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Escenarios BASE» (M06 §17.5)
- Entonces CU-FIS-17. Sin reenvío ni renumeración.

**CP-FIS-5052 — ESC-05. Una adopción de alícuota con fecha efectiva en medio del período aplica a los comprobantes pendientes con…**

- Cubre: ESC-05; M06 §17.5
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Escenarios BASE» (M06 §17.5)
- Entonces Una adopción de alícuota con fecha efectiva en medio del período aplica a los comprobantes pendientes con fecha ≥ efectiva; los emitidos no se recalculan. Explicación del ajuste en la traza.

**CP-FIS-5053 — ESC-03. No aplica a M06 (instalación offline).**

- Cubre: ESC-03; M06 §17.5
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de Ganancias con 3 tramos
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se ejecuta la prueba automatizada que verifica el criterio en el contexto «Escenarios BASE» (M06 §17.5)
- Entonces No aplica a M06 (instalación offline).

## 3. Casos por caso de uso (CU)

**CP-FIS-8001 — CU-FIS-01. Retención en un pago a proveedor (BASE §61, original)**

- Cubre: CU-FIS-01; relacionados: CU-FIS-10; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Retenciones: PROV-DEMO-001, régimen REG-DEMO "pendiente de configuración real", RET-DEMO-001 por ARS 2.000 sobre base ARS 100.000 (CU-FIS-01), escala ficticia de Ganancias con 3 tramos
- Dado TEN-001 con condición de agente de retención registrada (`taxAgentRegistrations`) y el régimen REG-DEMO configurado como "pendiente de configuración real" (solo homologación/demo); proveedor PROV-DEMO-001 sin exclusión vigente. 1. M12 registra la obligación con PROV-DEMO-001 y M14 prepara la OP por ARS 100.000. 2. M14 invoca `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`; §9.8); FIS aplica la…
- Cuando Retención en un pago a proveedor (BASE §61, original)
- Entonces Se completa «Retención en un pago a proveedor (BASE §61, original)» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-FIS-8002 — CU-LOT-01. Validación fiscal de la factura A en un lote (BASE §69, original; parte fiscal)**

- Cubre: CU-LOT-01; RF-FIS-041, RF-FIS-016; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado actor: responsable de facturación (M05) y corrector de datos de clientes (M01). 1. M05 prefactura LOTE-AG-DEMO-001 (100 casos) e invoca la prevalidación fiscal de FIS (RF-FIS-041/043) para cada caso. 2. FIS devuelve `FISCAL_TAXID_MISSING` para ITEM-099 (Factura A sin CUIT válido): no autoriza, no cambia la clase del comprobante y no fuerza consumidor final (CTR-FIS-04). 3. Se emiten 98; FIS autoriza 98 en…
- Cuando - Definición: el CU-LOT-01 se define en M05 §16 (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición.
- Entonces Se completa «Validación fiscal de la factura A en un lote (BASE §69, original; parte fiscal)» sin errores, con los efectos que exigen RF-FIS-041, RF-FIS-016, y quedan auditoría y evento del cambio

**CP-FIS-8003 — CU-10. Emisión y autorización de una factura (BASE §10, original; parte fiscal)**

- Cubre: CU-10; RN-FIS-040; M06 §16
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Emisión y autorización de una factura (BASE §10, original; parte fiscal)
- Entonces - Definición: el CU-10 se define en M05 §16 (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición. FAC-DEMO-001 por ARS 13.000 se emite en M05; FIS la autoriza con CAE, publica `fis.invoice.authorized` con QR y vencimiento del CAE; M05 genera el PDF y la pone a disposición del titular. Si la respuesta es incierta, FIS consulta (`FECompConsultar`) antes de reintentar (RN-FIS-040).

**CP-FIS-8004 — CU-MER-01. Usuario-generador con energía inyectada (BASE MER-001/MER-002, original; parte fiscal)**

- Cubre: CU-MER-01; RF-FIS-073, RF-FIS-071, RF-FIS-128, RF-FIS-147; M06 §16
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Perfil fiscal: TEN-001: razón social ficticia, `CUIT-DEMO-001`, inicio de actividades 01/03/1960, IIBB Convenio Multilateral `IIBB-DEMO-001`; TEN-002: `CUIT-DEMO-002`
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario-generador con energía inyectada (BASE MER-001/MER-002, original; parte fiscal)
- Entonces - Definición: el CU-MER-01 se define en M03 §16; M03 lo marca "MER-001, original" (anexo dueño); aquí se detalla solo la parte fiscal y se cita esa definición. Un asociado ficticio demanda 300 kWh e inyecta 120 kWh. M04 liquida demanda e inyección; FIS arma la LQSP con los datos fiscales de energía inyectada de RG 5746/2025 (RF-FIS-073), valida el CESP vigente (RF-FIS-071/072) y los incluye en RG 3571/RCSP (RF-FIS-128) y en el informe a la Secretaría de Energía (RF-FIS-147). El crédito del período siguiente lo administra M07.

**CP-FIS-8005 — CU-FIS-02. Habilitación fiscal de un tenant nuevo**

- Cubre: CU-FIS-02; RF-FIS-025, RF-FIS-002; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado actor: responsable fiscal del tenant; soporte de plataforma (sin ver secretos). 1. Completa el relevamiento fiscal (PAN-FIS-03, BASE §52.4) y el perfil del emisor (PAN-FIS-04). 2. Genera la clave y el CSR dentro de la plataforma (RF-FIS-025), obtiene el certificado en ARCA fuera del sistema, lo sube y asocia el servicio `wsfe` y el padrón. 3. Prueba en homologación con JOB-FIS-03 (`FEDummy`, TA, último autorizado) y…
- Cuando Habilitación fiscal de un tenant nuevo
- Entonces El tenant queda habilitado fiscalmente solo en el ambiente probado (credencial `active` y punto de venta con modalidad configurada); otro tenant no ve sus credenciales ni su estado.

**CP-FIS-8006 — CU-FIS-03. Respuesta incierta durante la autorización**

- Cubre: CU-FIS-03; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Respuesta incierta durante la autorización
- Entonces Durante el envío de 50 comprobantes de Factura B 0002 se corta la conexión tras el envío. La tanda queda `uncertain`; JOB-FIS-04 ejecuta `FECompUltimoAutorizado` y `FECompConsultar` por cada número; 50 resultan autorizados en ARCA y se registran con su CAE sin segundo `FECAESolicitar`. Si alguno no existe en ARCA y el último autorizado es menor, se reintenta con la misma numeración; nunca se renumera.

**CP-FIS-8007 — CU-FIS-04. Contingencia con CAEA**

- Cubre: CU-FIS-04; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Puntos de venta: TEN-001: 0002 (CAE, facturación masiva), 0003 (CAE, mostrador), 0004 (CAEA contingencia), 0009 (CESP, LQSP); TEN-002: 0001 (CAE)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Contingencia con CAEA
- Entonces WSFE no responde durante más de `PRM-FIS-026` minutos. FIS propone activar contingencia; el responsable la aprueba; M05 emite con el CAEA vigente de la quincena; al restablecerse, JOB-FIS-07 informa los comprobantes con `FECAEARegInformativo` y, para los puntos sin movimiento, `FECAEASinMovimientoInformar`; los rechazos del informe abren excepción y alerta.

**CP-FIS-8008 — CU-FIS-05. Adopción de una nueva versión de tabla normativa**

- Cubre: CU-FIS-05; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Adopción de una nueva versión de tabla normativa
- Entonces La plataforma publica la versión 2 de la tabla de alícuotas de IVA con fuente y vigencia. TEN-001 recibe la notificación, revisa diferencias (PAN-FIS-02), el responsable fiscal la adopta con fecha efectiva 01/12/2026 y un segundo usuario la aprueba. Los comprobantes con fecha anterior siguen usando la versión 1; los posteriores, la 2; las cachés de M04, M05 y M12 se invalidan por `fis.normativeAdoption.approved`.

**CP-FIS-8009 — CU-FIS-06. Percepción de IIBB con padrón por CUIT**

- Cubre: CU-FIS-06; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Percepción de IIBB con padrón por CUIT
- Entonces Se importa el padrón ficticio de noviembre de 2026 de Rentas Córdoba con 3 registros (formato validado, vigencia del mes). Una factura a un responsable inscripto incluido en el padrón con alícuota ficticia 2,5 % sobre neto ARS 40.000 percibe ARS 1.000; otra a un no incluido aplica la alícuota de no incluidos (`PRM-FIS-032`); un exento con certificado vigente no percibe. Cada cálculo deja traza con versión del padrón.

**CP-FIS-8010 — CU-FIS-07. Comprobante detenido por alícuota sin mapeo**

- Cubre: CU-FIS-07; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comprobante detenido por alícuota sin mapeo
- Entonces Un producto con IVA 19 % (porcentaje no existente) llega a la cola. FIS no descarta la alícuota (CTR-FIS-07): detiene el comprobante con `fis/prevalidation-failed`, publica `fis.taxCalculation.blocked` y M05 lo muestra en su bandeja; corregido el producto, se emite NC/refacturación en M05 según su estado.

**CP-FIS-8011 — CU-FIS-08. Libro IVA Ventas y Libro IVA Digital del período**

- Cubre: CU-FIS-08; RF-FIS-121; M06 §16
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Libro IVA Ventas y Libro IVA Digital del período
- Entonces El contador genera el Libro IVA Ventas de octubre de 2026 (criterio facturado), revisa la carátula, genera los archivos LID, ejecuta el análisis por línea y correlatividad (RF-FIS-121) que informa el rango faltante `B 0002 00001099–00001100`, corrige (eran comprobantes `uncertain` ya conciliados), regenera, cierra el período con snapshot y presenta fuera del sistema; adjunta el acuse.

**CP-FIS-8012 — CU-FIS-09. Conciliación con Mis Comprobantes**

- Cubre: CU-FIS-09; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importa el CSV de emitidos de ARCA del período.
- Entonces 0 inexistentes en GoodApps, 1 inexistente en ARCA (comprobante `uncertain` pendiente) y 1 con diferencia de ARS 3 en neto (sobre la tolerancia de ARS 1). El usuario abre la diferencia, identifica el redondeo y la documenta; la conciliación queda `reviewed`.

**CP-FIS-8013 — CU-FIS-10. Rectificación de una declaración rechazada (RG 3571)**

- Cubre: CU-FIS-10; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M06 §18.
- Datos de prueba: Declaraciones: DDJJ-DEMO-001 (retenciones, `approved`), DDJJ-RG3571-DEMO-2026-09 `rejected` con su rectificativa en `draft` (CU-FIS-10)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rectificación de una declaración rechazada (RG 3571)
- Entonces DDJJ RG 3571 de septiembre de 2026 queda `rejected` con el acuse adjunto. El responsable genera una rectificativa vinculada (versión 2), corrige los registros observados, la valida, aprueba con MFA y registra la presentación. La original se conserva `rectified`; ambas quedan en el expediente del período.

**CP-FIS-8014 — CU-FIS-11. Rendición de una tasa por cuenta de terceros**

- Cubre: CU-FIS-11; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Terceros: CONV-DEMO-001 "Municipalidad Demo" (alumbrado, comisión 3 %), rendición de octubre `approved` (CU-FIS-11)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Rendición de una tasa por cuenta de terceros
- Entonces Convenio CONV-DEMO-001 con el municipio ficticio "Municipalidad Demo" por tasa de alumbrado (ARS 500 por factura) y comisión ficticia 3 %. En octubre se facturan 1.000 cargos (ARS 500.000) y se cobran 900 (ARS 450.000). La rendición calcula comisión ARS 13.500 y neto ARS 436.500; se aprueba, M14 genera la OP y, al pagarse, la rendición pasa a `paid`. Un pago parcial de una factura con tasa se imputa según la política (PA-FIS-05).

**CP-FIS-8015 — CU-FIS-12. Informe ERSeP del período**

- Cubre: CU-FIS-12; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Libro IVA: Octubre 2026 cerrado con snapshot; noviembre 2026 abierto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Informe ERSeP del período
- Entonces El responsable regulatorio genera el archivo de la Circular 70/2021 de octubre de 2026 con el código de empresa configurado (`PRM-FIS-100`), valida totales contra el Libro IVA del mismo período, aprueba y registra la presentación con acuse.

**CP-FIS-8016 — CU-FIS-13. Paquete ENARGAS FCU-DS**

- Cubre: CU-FIS-13; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Paquete ENARGAS FCU-DS
- Entonces Para un tenant con gas, el responsable genera el paquete FCU-DS del mes: FIS usa las tablas maestras de la versión adoptada, mapea categorías con `regulatoryConceptMaps`, genera los archivos con los nombres del protocolo y el reporte de control (cantidad de usuarios, m³ y facturado) que debe coincidir con M05.

**CP-FIS-8017 — CU-FIS-14. Comprobantes de administración pública**

- Cubre: CU-FIS-14; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Administración pública: Cuenta ficticia "Organismo Público Demo" con 3 facturas impagas de octubre
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comprobantes de administración pública
- Entonces Se seleccionan las facturas impagas del período de las cuentas de un organismo público ficticio, se guarda la selección (reemplazando la anterior del mismo período sin duplicar) y M07 las cobra en bloque desde la vista para caja.

**CP-FIS-8018 — CU-FIS-15. Autorización en modo pasarela**

- Cubre: CU-FIS-15; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Tablas normativas (plataforma): Versión 1 de: condición IVA del receptor, alícuotas de IVA (0 %, 2,5 %, 5 %, 10,5 %, 21 %, 27 %), tipos de comprobante ARCA, tipos de documento, tributos (Id 1 a 9, 13 y 99), monedas, conceptos (productos, servicios…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Autorización en modo pasarela
- Entonces Un sistema externo del tenant envía por `POST /api/v1/ext/fis/documents` un comprobante con `Idempotency-Key`; FIS valida duplicados y datos fiscales con las mismas reglas del modo completo, lo autoriza y devuelve el CAE; el reenvío con la misma clave devuelve el mismo resultado sin nuevo CAE.

**CP-FIS-8019 — CU-FIS-16. Revalidación periódica de padrón**

- Cubre: CU-FIS-16; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Padrón IIBB: REG-PADRON-DEMO-2026-11 con 3 registros ficticios (`CUIT-DEMO-101` 2,5 %, `CUIT-DEMO-102` 0 % exento, `CUIT-DEMO-103` 4 %)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Revalidación periódica de padrón
- Entonces JOB-FIS-19 revalida 1.200 personas; detecta 4 cambios de condición IVA (2 a monotributo, 2 a responsable inscripto). Genera el informe de diferencias; el responsable aprueba 3 y rechaza 1 con motivo; M01/M12 actualizan; los comprobantes futuros usan la condición nueva; ningún comprobante emitido cambia.

**CP-FIS-8020 — CU-FIS-17. Recuperación tras restauración (ESC-04)**

- Cubre: CU-FIS-17; relacionados: ESC-04; M06 §16
- Ola: O4 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M06 §18.
- Datos de prueba: Comprobantes en cola: FAC-DEMO-001 (ARS 13.000, autorizada), 98 de LOTE-AG-DEMO-001 autorizadas, ITEM-099 detenida por `FISCAL_TAXID_MISSING`, 1 `uncertain` y 1 `authorizedWithObservations` para mostrar el tablero
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recuperación tras restauración (ESC-04)
- Entonces Se restaura una copia de las 10:00; ARCA tiene comprobantes autorizados a las 10:30. Al reanudar, JOB-FIS-05 consulta el último autorizado por par y recupera los CAE posteriores sin reenviar; los comprobantes que ya no existen localmente se marcan como incidente para reconstrucción con M05 y no se renumeran.
