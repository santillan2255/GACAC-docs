# Casos de prueba de aceptación — M02 CAT — Catálogo de servicios, productos, planes, categorías, estados, contrato de servicio, habilitación por tenant, copia entre tenants y particularidades por servicio

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M02-CAT-catalogo-servicios.md`](../../especificacion/anexos/M02-CAT-catalogo-servicios.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 116 CP de requisitos funcionales, 5 CP de escenarios ESC y 23 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M02 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Catálogo de plataforma y habilitación por tenant (M02 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0001 | RF-CAT-001; M02 §5.1; PRO-O2-09 | O2 | Núcleo | regla | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Mantener un catálogo global de capacidades de servicio con código, nombre (dict), dominio, descripción, estado (`draft`, `available`, `deprecated`), madurez (`confirmed`, `candidate`), perfiles de registración y tipos de cálculo… | Plataforma crea INT y lo marca `available`; un tenant no lo ve hasta habilitarlo. |
| CP-CAT-0002 | RF-CAT-002; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Habilitar y deshabilitar capacidades por tenant con fecha desde/hasta, solo si el tenant tiene la licencia correspondiente (T01). | Intentar habilitar Gas sin licencia devuelve 409 con explicación de dependencia de licencia. |
| CP-CAT-0003 | RF-CAT-003; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Distinguir tres niveles: capacidad de plataforma, servicio habilitado/ofertado por el tenant y contrato de una persona. | Habilitar Agua en TEN-001 no crea ningún contrato. |
| CP-CAT-0004 | RF-CAT-004; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Definir por separado disponibilidad para nuevas contrataciones (`offerStatus`) y operación de contratos existentes (`operationStatus`). | Con oferta cerrada, landing no muestra el servicio pero los contratos activos siguen facturándose. |
| CP-CAT-0005 | RF-CAT-005; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Al retirar una oferta, exigir que el administrador declare el alcance (solo nuevas contrataciones / cierre total con plan de salida) y no borrar contratos, documentos, deuda ni casos. | Retirar Agua de A deja contratos activos visibles y facturables. |
| CP-CAT-0006 | RF-CAT-006; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Auditar toda habilitación, deshabilitación, publicación, retiro y modificación de alcance con actor, fecha, antes/después. | Cada cambio genera registro de auditoría consultable. |
| CP-CAT-0007 | RF-CAT-007; M02 §5.1; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Reflejar la selección del tenant en landing, contratación, apps y pantallas de administración según perfiles. | Un usuario de B ve solo Electricidad y Gas (CU-CAT-01). |
| CP-CAT-0008 | RF-CAT-008; M02 §5.1; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con CEM-PAR: Plan Parcela cementerio parque en 24 cuotas ficticias. | Incluir Cementerio parque como prestación distinta de servicios sociales, sin equivalencia con consumo medido ni con sepelio. | Existe capacidad CEM separada de SEP y SOC. |
| CP-CAT-0009 | RF-CAT-009; M02 §5.1; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Registrar por dominio si es servicio confirmado por el solicitante o candidato investigado, y la documentación prioritaria pendiente para pasar a configuración real (BASE §95). | La ficha de capacidad muestra madurez y checklist de insumos. |
| CP-CAT-0010 | RF-CAT-010; M02 §5.1; PRO-O2-09 | O2 | Estándar | migración | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Ofrecer como capacidades todos los dominios que ProCoop gestiona: Internet, Telefonía fija, Telefonía móvil, Pack SMS, TV/cable, Energía eléctrica, Agua, Cloacas, Gas, Alumbrado público, Pavimento/obras (cuotas de obras), Sepelio, Subsidio… | El catálogo de plataforma contiene las 25 capacidades con ficha. |
| CP-CAT-0011 | RF-CAT-011; M02 §5.1; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Permitir marcar un servicio principal del tenant (por defecto en búsquedas, reportes y altas). | La ficha de cuenta abre por defecto el servicio principal. |
| CP-CAT-0012 | RF-CAT-012; M02 §5.1; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mantener tipos de servicio (agrupador de reporte) configurables por tenant, independientes del dominio. | Un reporte agrupa contratos por tipo "Energía y conexos". |
### 1.2 Perfil de configuración por servicio (M02 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0013 | RF-CAT-013; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mantener por tenant y servicio un perfil de configuración en las 13 dimensiones: prestador y jurisdicción, titularidad, unidad de prestación, oferta, cantidad, excepciones, facturación, cuenta y pago, ciclo comercial, operación, cambios y… | La ficha de servicio tiene una pestaña por dimensión y cada una admite "No aplica". |
| CP-CAT-0014 | RF-CAT-014; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Registrar prestador y jurisdicción: modalidad (prestación directa, subdistribución, convenio, intermediación administrativa), autoridad de aplicación/regulador, título habilitante, concesión, fuente normativa, jurisdicción y vigencia de… | No se publica un servicio regulado sin autoridad y título habilitante cargados. |
| CP-CAT-0015 | RF-CAT-015; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Definir la unidad de prestación del servicio (conexión, suministro, punto de medición, cobertura, parcela/unidad, acto, línea, grupo/beneficiario, plan de vivienda, cuota de obra) sin equivalencias automáticas entre dominios. | CEM usa unidad "derecho/unidad de sepultura" y no admite lectura. |
| CP-CAT-0016 | RF-CAT-016; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Asignar al servicio un perfil de registración que determina qué datos y pestañas pide el contrato (medidor, adherentes, dispositivos, línea, perfil Internet, vivienda, seguro, cuotas de obra, vehículo eléctrico, cantidad). | Un servicio con perfil "Adherentes" muestra la pestaña de adherentes y oculta la de medidor. |
| CP-CAT-0017 | RF-CAT-017; M02 §5.2; PRO-O2-09 | O2 | Núcleo | migración | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Declarar el tipo de cálculo del servicio (17 tipos de ProCoop más los nuevos que defina TAR) y su variante para grandes clientes; el algoritmo lo ejecuta TAR. | Cambiar el tipo de cálculo exige nueva versión de configuración y simulación TAR. |
| CP-CAT-0018 | RF-CAT-018; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Configurar los requisitos de alta del contrato: domicilio del servicio, fecha de alta (salvo servicio técnico), categoría, cantidad/dispositivos, matrícula, designación catastral, inmueble, actividad, clase, zona/sector/recorrido… | Con factibilidad en `exigir`, el alta sin factibilidad aprobada se rechaza con mensaje. |
| CP-CAT-0019 | RF-CAT-019; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Marcar si el servicio es técnico (altas, bajas, reconexiones y cambios por orden de trabajo), si genera OT automáticamente al guardar, si consulta dar baja administrativa al generar OT de desconexión y qué tipo de operación técnica… | En INT técnico, aprobar el alta crea pedido de instalación a TEC y el contrato queda Pendiente de instalación. |
| CP-CAT-0020 | RF-CAT-020; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Configurar grupo de facturación por defecto del servicio y su herencia en altas automáticas; el valor "sin grupo" es inválido. | Un contrato sin grupo de facturación no puede pasar a Activo. |
| CP-CAT-0021 | RF-CAT-021; M02 §5.2; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Declarar para servicios medidos: medidor registrado en stock, lectura inicial al conectar, facturar sin consumo (cobrar cargo fijo), servicio relacionado cuyo consumo se usa (ej. cloaca sobre agua) y modo de división de consumo; la… | CLO configurado con servicio relacionado AG; TAR toma lecturas de AG de la misma cuenta. |
| CP-CAT-0022 | RF-CAT-022; M02 §5.2; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con SOC-FAM: Plan Sepelio familiar con adherentes, carencia 90 días. | Declarar si el servicio admite adherentes y/o beneficiarios, exclusiones de cómputo (menores del último año, mayores, personas con discapacidad, jubilados), carencia, recategorización por edad del titular y si se exige adherente titular… | Un sepelio con carencia 6 meses muestra la fecha de inicio de cobertura de cada adherente. |
| CP-CAT-0023 | RF-CAT-023; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Configurar el estado operativo por defecto que asume el contrato en cada evento: alta, baja, reconexión, cambio de medidor, transferencia, desconectado, y selección automática del estado principal al dar de alta. | Al confirmar la instalación el contrato toma el estado operativo configurado para "alta". |
| CP-CAT-0024 | RF-CAT-024; M02 §5.2; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Configurar documentos y plantillas por servicio: contrato de alta, fianza del servicio, informe/constancia de baja, formulario de desconexión, DDJJ (artefactos), constancia de entrega y devolución de equipos; y si se consulta… | Al activar INT se genera la constancia de alta con la versión de condiciones. |
| CP-CAT-0025 | RF-CAT-025; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Configurar canales habilitados por servicio y operación: landing, PWA, mostrador, teléfono, bot, botón de baja público. | Si INT tiene baja por PWA habilitada, el socio ve "Solicitar baja" en su contrato. |
| CP-CAT-0026 | RF-CAT-026; M02 §5.2; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Referenciar por servicio los motivos y tiempos de atención aplicables (catálogo en CRM), incluidos los plazos diferenciados por motivo de ENACOM para TIC. | INT referencia motivos técnico/facturación/otros con plazos distintos. |
| CP-CAT-0027 | RF-CAT-027; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mapear por servicio área responsable, centro de costos, cuentas contables, depósito de equipos y sucursales, usando entidades del tenant. | La publicación se detiene si falta la equivalencia contable (AGR-009). |
| CP-CAT-0028 | RF-CAT-028; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Representar las diferencias por configuración y componentes de dominio explícitos; prohibido convertir particularidades en texto libre o forzarlas en P × Q. | Las fichas de dominio exponen atributos tipados, no un campo "observaciones regulatorias". |
| CP-CAT-0029 | RF-CAT-029; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con Ana Demo (DNI ficticio 00000001): Titular Socia de TEN-001 para ESC-01. | Permitir marcar "No aplica" en cualquier dimensión o concepto que no corresponda al dominio, en lugar de forzar un cargo o proceso ficticio. | SAN marca "Cantidad: No aplica". |
| CP-CAT-0030 | RF-CAT-030; M02 §5.2; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Declarar permisos y operaciones admitidas por servicio: suspensión voluntaria (sí/no, duración máxima), reactivación, cambio de plan, cambio de titular, transferencia, traslado, baja parcial, cesión (CEM). | Si CEM no admite baja por botón, la PWA muestra "Consultar trámite" (BASE §90). |
### 1.3 Versionado y publicación (M02 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0031 | RF-CAT-031; M02 §5.3; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Agrupar los cambios de un servicio en una versión de configuración con dependencias, validaciones, simulación, revisión, aprobación y fecha efectiva. | Una versión no aprobada no afecta landing ni contratos. |
| CP-CAT-0032 | RF-CAT-032; M02 §5.3; PRO-O2-09 | O2 | Estándar | regla | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Clasificar cada cambio como comercial, fiscal, técnico o de presentación; un cambio solo de etiqueta no exige revisión tarifaria. | Corregir una etiqueta publica sin simulación TAR. |
| CP-CAT-0033 | RF-CAT-033; M02 §5.3; PRO-O2-09 | O2 | Núcleo | regla | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Publicación íntegra: impedir publicar un plan sin precio vigente en TAR, sin equivalencia contable, con referencias al tenant origen o con impuestos no configurados. | Publicar INT-100 sin cuadro tarifario vigente devuelve lista de bloqueos. |
| CP-CAT-0034 | RF-CAT-034; M02 §5.3; PRO-O2-09 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Conservar fecha efectiva y fecha de registro de cada versión y cambio; consultar la configuración vigente a una fecha. | Consultar INT "a 01-03-2026" devuelve la versión entonces vigente. |
| CP-CAT-0035 | RF-CAT-035; M02 §5.3; PRO-O2-09 | O2 | Estándar | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Exigir aprobación de un segundo usuario para publicar versiones con cambios comerciales o fiscales en producción (configurable). | El autor no puede aprobar su propia versión. |
### 1.4 Productos, conceptos, planes y paquetes (M02 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0036 | RF-CAT-036; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Definir productos y subservicios dentro de cada servicio del tenant. | INT tiene productos "Fibra hogar" y "IP fija" (subservicio). |
| CP-CAT-0037 | RF-CAT-037; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Definir conceptos facturables individualizables por servicio, tipificados: una sola vez, recurrente, por cantidad, por evento, cuota, ajuste, tasa por cuenta de terceros, aporte de capital. | Instalación (una vez) y abono (recurrente) de INT son conceptos distintos vinculados a INT. |
| CP-CAT-0038 | RF-CAT-038; M02 §5.4; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Establecer el disparador de cada concepto: aprobación, instalación efectiva, activación, inicio de período, evento (reconexión, transferencia, OT), vencimiento de hito. | La instalación de INT se devenga al confirmar la instalación, no al aprobar. |
| CP-CAT-0039 | RF-CAT-039; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Referenciar en cada concepto su clase fiscal (FIS), cuenta/rubro contable (CON), centro de costo y unidad de medida; el importe lo define TAR. | No se publica un concepto sin clase fiscal. |
| CP-CAT-0040 | RF-CAT-040; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Distinguir costo interno de prestación y precio al socio; un costo interno no se factura sin concepto habilitado. | El costo de instalación interna no aparece en factura si no existe concepto de instalación publicado. |
| CP-CAT-0041 | RF-CAT-041; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Registrar planes comerciales con atributos del dominio (tecnología, velocidad bajada/subida, unidad, periodicidad, modalidad medida/no medida, requisitos, componentes incluidos, opciones, equipamiento requerido, necesidad de… | INT-100 declara 100 Mbps, mensual, requiere factibilidad y equipo. |
| CP-CAT-0042 | RF-CAT-042; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Mantener versiones históricas de cada plan; un plan discontinuado no se ofrece a nuevos clientes pero conserva sus condiciones en los contratos anteriores; un cambio comercial puede aplicarse solo a nuevas contrataciones. | Discontinuar INT-50 no modifica contratos INT-50 existentes. |
| CP-CAT-0043 | RF-CAT-043; M02 §5.4; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Vincular plan y categoría a la tarifa vigente de TAR por vigencia; el contrato guarda referencia a la versión de plan y a condiciones pactadas, no un precio libre. | El contrato muestra "Tarifa vigente: cuadro X" y no un importe editable. |
| CP-CAT-0044 | RF-CAT-044; M02 §5.4; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Administrar paquetes de prestaciones (planes de varios servicios) con componentes y condiciones; la contratación de un paquete crea un contrato por servicio vinculados por `bundleSubscriptionId`. | Paquete INT+TV crea dos contratos enlazados; la baja de uno sigue la regla del paquete. |
| CP-CAT-0045 | RF-CAT-045; M02 §5.4; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Definir promociones como componentes del plan con inicio/fin de vigencia de oferta, base (concepto afectado), duración (meses calendario, ciclos facturados u otra explícita) y regla de inicio; el cálculo es de TAR. | "50 % sobre abono durante 3 ciclos" queda en el contrato con su criterio de duración. |
| CP-CAT-0046 | RF-CAT-046; M02 §5.4; PRO-O4-07 | O4 | Estándar | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Ofrecer en el plan opciones de financiación de instalación (principal, anticipo, cuotas, método) como alternativa excluyente del pago de contado; el cronograma lo genera MOR y se evita la duplicación. | Elegir financiar anula la alternativa de contado en el mismo contrato. |
| CP-CAT-0047 | RF-CAT-047; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | No aplicar subsidios por defecto; un subsidio exige régimen o beneficio real autorizado y se representa con categoría o beneficio vinculado a TAR/FIS. | Un plan INT no tiene subsidio salvo régimen configurado. |
| CP-CAT-0048 | RF-CAT-048; M02 §5.4; PRO-O4-07 | O4 | Estándar | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Declarar compatibilidad y orden entre promociones, subsidios, bonificaciones y otras excepciones del plan. | Dos promociones incompatibles no pueden asignarse al mismo contrato. |
| CP-CAT-0049 | RF-CAT-049; M02 §5.4; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Definir unidades de medición y periodicidad del servicio y del plan (mensual, bimestral, anual, por evento). | GAS bimestral y INT mensual conviven en el tenant. |
| CP-CAT-0050 | RF-CAT-050; M02 §5.4; PRO-O3-07 | O3 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Configurar conceptos por evento (alta de servicio, alta de cuenta, alta de titular, reconexión, después de OT, antes de OT, transferencia) con filtros (socio activo, moroso, prepago, referencia, localidad, categoría, clase, medidor… | Al reconectar ELE se propone "Cargo de reconexión" solo si la política de MOR lo habilita. |
| CP-CAT-0051 | RF-CAT-051; M02 §5.4; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Declarar productos entregables en comodato (equipos) por plan, con modalidad (comodato, venta, alquiler, propio del cliente). | INT-100 declara ONT en comodato obligatoria. |
| CP-CAT-0052 | RF-CAT-052; M02 §5.4; PRO-O4-07 | O4 | Estándar | funcional | TEN-001 con INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción… | Mostrar al socio el detalle de su precio vigente y la fecha de finalización de beneficios temporales. | "Mis servicios" muestra "Promoción 50 % hasta el ciclo 03-2027". |
| CP-CAT-0053 | RF-CAT-053; M02 §5.4; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio… | Mantener clases de servicio con valores asociados (ej. tasa hospital, tipo de suministro). | Un contrato ELE con clase "Tasa hospital municipal" informa VALOR1 al motor. |
| CP-CAT-0054 | RF-CAT-054; M02 §5.4; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Mantener propiedades del servicio (tensión, mínimos, cargo fijo asociado, tensión regulatoria) y propiedades personalizadas tipadas con lista de valores. | ELE tiene propiedad "Tensión" con valores BT/MT. |
### 1.5 Categorías (M02 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0055 | RF-CAT-055; M02 §5.5; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con ELE-RES: Categoría Residencial con código regulatorio ficticio R1. | Mantener categorías por servicio con atributos estructurales: social, prepaga, residencial, generador, categoría con subsidio asociada, categoría SEF asociada, código de tarifa regulatorio, perfil de red (Internet), grupo, códigos para… | La categoría "Jubilados" se marca `isSocial` explícitamente. |
| CP-CAT-0056 | RF-CAT-056; M02 §5.5; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con ELE-RES: Categoría Residencial con código regulatorio ficticio R1. | Mantener grupos de categorías con código regulatorio. | Grupo "Residencial gas" informa su código ENARGAS. |
| CP-CAT-0057 | RF-CAT-057; M02 §5.5; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con ELE-RES: Categoría Residencial con código regulatorio ficticio R1. | Conservar historial de categoría por vigencia en el contrato para facturar cada período con la categoría que correspondía. | Un cambio de categoría del día 15 genera dos tramos consultables. |
| CP-CAT-0058 | RF-CAT-058; M02 §5.5; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Permitir recategorización automática (por segmentación, consumo, edad o adherentes) respetando la marca "No aplica recategorización" del contrato. | El contrato marcado queda excluido del job de recategorización. |
| CP-CAT-0059 | RF-CAT-059; M02 §5.5; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con SOC-FAM: Plan Sepelio familiar con adherentes, carencia 90 días. | Para servicios con adherentes según cantidad, determinar la categoría por cantidad de adherentes computables y registrarla en el contrato como cambio de categoría. | Al pasar de 3 a 4 adherentes el contrato cambia a categoría "Familiar 4". |
| CP-CAT-0060 | RF-CAT-060; M02 §5.5; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con ELE-RES: Categoría Residencial con código regulatorio ficticio R1. | Restablecer en bloque categorías subsidiadas a su categoría base (por niveles o por régimen), excluyendo contratos marcados y bajas de más de 60 días. | El restablecimiento informa cantidad de contratos excluidos por cada motivo. |
### 1.6 Estados del contrato (M02 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0061 | RF-CAT-061; M02 §5.6; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio… | Mantener una máquina de estados canónica explícita del contrato (sección 8) con transiciones, actores, precondiciones, efectos y reversión; no existe edición libre del estado. | Un PATCH de `lifecycleStatus` devuelve 405; solo existen comandos de transición. |
| CP-CAT-0062 | RF-CAT-062; M02 §5.6; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mantener por servicio un catálogo de estados operativos configurables, cada uno mapeado a un estado canónico, con marca de "implica desconexión" y "estado principal". | El estado operativo "CORTADO" de ELE mapea a `suspended` con `impliesDisconnection=true`. |
| CP-CAT-0063 | RF-CAT-063; M02 §5.6; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Registrar por separado fecha solicitada y fecha efectiva de alta, suspensión, reactivación y baja; nunca presumir que coinciden. | Un contrato tiene `terminationRequestedAt` 10-05 y `effectiveEnd` 31-05. |
| CP-CAT-0064 | RF-CAT-064; M02 §5.6; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Registrar fecha, actor, origen y motivo del último cambio de estado y la historia completa. | La ficha muestra "Activo desde 12-04-2026 por cierre de OT-123". |
| CP-CAT-0065 | RF-CAT-065; M02 §5.6; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Distinguir suspensión temporal solicitada por el socio, suspensión por mora, suspensión técnica/seguridad, suspensión regulatoria/administrativa y reactivación; cada una con duración, motivo, fecha efectiva y modo (restringido o… | Una suspensión por mora de INT con modo "restringido" no figura como "Baja". |
| CP-CAT-0066 | RF-CAT-066; M02 §5.6; PRO-O6-04 | O6 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Mostrar "Rehabilitación en trámite" mientras falte la confirmación técnica; el contrato no vuelve a Activo por el solo registro de un pago. | Pagar la deuda de GAS suspendido deja el contrato en `reactivationPending` hasta la inspección. |
### 1.7 Contrato de servicio (M02 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0067 | RF-CAT-067; M02 §5.7; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con Hermano A / Hermano B: Titulares Contratos INT-H-A-001 e INT-H-B-001 en DIR-CASA-001 (ESC-03); A con deuda ficticia. | Vincular cada contrato con un titular identificado por DNI o CUIT y una cuenta; un mismo domicilio puede tener varios contratos del mismo servicio con titulares distintos; la dirección no es clave del contrato ni determina responsabilidad… | Dos hermanos con INT en DIR-CASA-001 tienen contratos, equipos y deudas independientes. |
| CP-CAT-0068 | RF-CAT-068; M02 §5.7; PRO-O2-10 | O2 | Núcleo | integración | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS… | Todos los bloques aparecen en la ficha, ocultando los que el perfil marca "No aplica". |
| CP-CAT-0069 | RF-CAT-069; M02 §5.7; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mantener flags del contrato: No facturar (con autorización y vigencia), Provisorio, Cobrar provisorio, No aplica recategorización, Alta desde portal (origen), Lectura con factor de multiplicación, Enviar factura electrónica por defecto, No… | Marcar "No facturar" exige permiso, motivo y fecha hasta; FAC excluye el contrato y lo lista en la bandeja de no facturables. |
| CP-CAT-0070 | RF-CAT-070; M02 §5.7; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Congelar en el contrato las condiciones contratadas: versión del plan, componentes, promociones con su criterio de duración, financiación elegida, aceptación (fecha, canal, evidencia) y documento de condiciones. | Cambiar el plan publicado no modifica las condiciones guardadas del contrato. |
| CP-CAT-0071 | RF-CAT-071; M02 §5.7; PRO-O4-07 | O4 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Registrar cantidad o dispositivos en servicios por cantidad (tipos 7/8) y por dispositivos. | Un servicio "por cantidad" exige cantidad > 0 para activarse. |
| CP-CAT-0072 | RF-CAT-072; M02 §5.7; PRO-O2-10 | O2 | Núcleo | migración | TEN-001 con PAR-DEMO-001: Regla automática Alta de SEP propuesta al activar ELE (modo `propose`). | Registrar origen del contrato (canal, caso CRM, usuario, regla automática, migración, transferencia) y enlazar el caso. | Un alta desde PWA queda con `origin.channel=pwa` y `crmCaseId`. |
| CP-CAT-0073 | RF-CAT-073; RN-CAT-020; M02 §5.7; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con PAR-DEMO-001: Regla automática Alta de SEP propuesta al activar ELE (modo `propose`). | Ejecutar las validaciones de alta configuradas (sección 6, RN-CAT-020..031) devolviendo todos los errores y advertencias juntos. | Un alta con tres faltantes devuelve los tres en un único problem+json. |
| CP-CAT-0074 | RF-CAT-074; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Controlar matrícula única por servicio entre contratos no dados de baja salvo parámetro, y generar matrícula automática cuando el servicio lo indique. | Con unicidad activa, repetir la matrícula ELE-0001 devuelve 409. |
| CP-CAT-0075 | RF-CAT-075; M02 §5.7; PRO-O7-01 | O7 | Estándar | regla | TEN-001 con ELE-RES-SOC: Categoría Residencial social (`isSocial=true`). | Impedir que un asociado tenga más de un contrato del mismo servicio en categoría social cuando el parámetro lo indique, usando la marca explícita `isSocial` de la categoría. | El segundo contrato social ELE del mismo titular se rechaza o se recategoriza según la regla de prioridad. |
| CP-CAT-0076 | RF-CAT-076; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Advertir (o exigir autorización) si existen deudas, vencidas o totales, en otras cuentas con el mismo domicilio o la misma parcela catastral al dar de alta o cambiar el titular. | El alta muestra advertencia y registra quién continuó. |
| CP-CAT-0077 | RF-CAT-077; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Configurar si se permiten contratos para titulares no activos o dados de baja. | Con el parámetro activo, un titular dado de baja no puede recibir un contrato nuevo. |
| CP-CAT-0078 | RF-CAT-078; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Configurar si se permiten contratos iguales (mismo servicio) medidos o no medidos en una misma cuenta. | Por defecto INT admite dos contratos en la misma cuenta; ELE no admite dos en el mismo punto de suministro. |
| CP-CAT-0079 | RF-CAT-079; M02 §5.7; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja de equipos… | Dar de baja INT con ONT no devuelta crea pendiente de retiro y no bloquea la baja comercial. |
| CP-CAT-0080 | RF-CAT-080; M02 §5.7; PRO-O10-04 | O10 | Estándar | regla | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | **Reemplazado por RF-SOC-011 a RF-SOC-030 (M18, DEC-071, HUECO-TRV-01).** Texto original: Gestionar adherentes y beneficiarios del contrato: persona, vínculo, titular sí/no, fechas de alta/baja, tarifa de adherente asignada, inicio de… | Registrar el fallecimiento de un adherente en PER da de baja su vínculo con fecha y causa y conserva la historia. |
| CP-CAT-0081 | RF-CAT-081; M02 §5.7; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Cambiar el plan de un contrato registrando nueva oferta, aceptación, fecha efectiva y tratamiento de promociones y período en curso. | Un cambio de INT-100 a INT-300 queda como nuevo tramo de condiciones con fecha efectiva. |
| CP-CAT-0082 | RF-CAT-082; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio… | Cambiar la categoría de un contrato de forma inmediata, en fecha futura, o al cerrar la OT correspondiente, impidiendo dos OT pendientes del mismo tipo, y aplicando el día límite para cobrar proporcional. | Con modo "al cerrar OT", la categoría nueva se aplica en la fecha de cierre. |
| CP-CAT-0083 | RF-CAT-083; M02 §5.7; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Ejecutar cambios masivos de categoría solicitados por otros módulos (paso a prepago por deuda desde MOR; recategorización por segmentación desde TAR) con origen, criterio, simulación previa y reversión. | Un lote de recategorización muestra antes/después y puede revertirse mientras no haya facturación con la nueva categoría. |
| CP-CAT-0084 | RF-CAT-084; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Transferir un contrato a otra cuenta/titular creando un contrato nuevo (con o sin mantener fecha de alta) y dejando el original en "No vigente", trasladando línea, beneficiarios, vivienda, punto de suministro y propiedades; adherentes… | La transferencia conserva la deuda en el titular original y la historia en el contrato original. |
| CP-CAT-0085 | RF-CAT-085; M02 §5.7; PRO-O3-07 | O3 | Estándar | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Trasladar el domicilio del servicio por orden de trabajo (aplicar el domicilio nuevo al cerrarla, opcionalmente también a las personas adherentes) y, a pedido, copiar el domicilio de la cuenta a sus contratos; validar mismo domicilio… | El traslado de INT queda con domicilio anterior y nuevo con fechas. |
| CP-CAT-0086 | RF-CAT-086; M02 §5.7; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Ejecutar reglas de altas automáticas ante eventos (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtros (categoría, propiedad, clase, actividad, localidad, referencia, zona… | Conectar ELE en una localidad con alumbrado configurado crea el contrato ALU vinculado. |
| CP-CAT-0087 | RF-CAT-087; M02 §5.7; PRO-O4-07 | O4 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la validación de… | Un trámite masivo informa procesados, rechazados y motivo por contrato. |
| CP-CAT-0088 | RF-CAT-088; M02 §5.7; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Dar de baja un contrato: recibir la solicitud sin cargo, fijar fecha efectiva, ordenar desactivación/retiro, conservar facturas, deuda e historia, dejar equipos pendientes, no extinguir la condición de asociado. | La baja de INT de B no afecta INT de A ni la asociación de B. |
| CP-CAT-0089 | RF-CAT-089; M02 §5.7; PRO-O6-04 | O6 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Configurar si se permite la baja de contratos con cuotas relacionadas pendientes (financiaciones, cuotas de obra o vivienda) y cómo se informan. | Con el parámetro apagado, la baja muestra las cuotas pendientes y requiere supervisor. |
| CP-CAT-0090 | RF-CAT-090; M02 §5.7; PRO-O6-04 | O6 | Estándar | regla | TEN-001 con ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio… | Reconectar/reactivar un contrato aplicando la regla de fecha de alta para no medidos en el mismo mes de la desconexión y la regla sobre titulares fallecidos. | La reconexión de un no medido en el mismo mes conserva la fecha de alta anterior si el parámetro está apagado. |
| CP-CAT-0091 | RF-CAT-091; M02 §5.7; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Anular un contrato antes de su activación (desistimiento, factibilidad negativa, OT de alta eliminada) sin exigir circuito de retiro de equipo no instalado. | Anular un contrato en `pendingInstallation` sin equipo asignado lo pasa a `cancelled`. |
| CP-CAT-0092 | RF-CAT-092; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Al desconectar el último servicio de un titular, informar si sigue siendo adherente, beneficiario o garante en otros contratos. | La baja muestra el aviso con enlaces. |
| CP-CAT-0093 | RF-CAT-093; M02 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Declarar por servicio si se admiten consumos de contratos dados de baja (no permitir/controlar/permitir); la carga la gestiona MED. | MED rechaza una lectura posterior a la baja si el servicio está en "no permitir". |
| CP-CAT-0094 | RF-CAT-094; M02 §5.7; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | En listados: mostrar por defecto solo contratos activos, mostrar observación del servicio junto a su descripción, permitir desagrupar servicios de la cuenta y buscar por matrícula aproximada. | La búsqueda "ELE-00" devuelve todas las matrículas que empiezan así si el parámetro está activo. |
| CP-CAT-0095 | RF-CAT-095; M02 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con GAS-RES: Categoría Gas natural residencial (capacidad habilitada en TEN-001; demo de DDJJ con plantilla `gasAppliances`, PRM-CAT-110). | Registrar la declaración jurada de artefactos **por servicio**, con plantilla definida en M02 por servicio (PRM-CAT-110) e historial: **GAS** artefactos a gas con potencia en kcal/h (artefacto, cantidad, potencia, marca, serie, modelo… | Cada cambio de la DDJJ queda en historia con fecha y usuario; una DDJJ de gas sin potencia en kcal/h se rechaza y una de ELE acepta vehículos eléctricos. |
| CP-CAT-0096 | RF-CAT-096; M02 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Registrar el vínculo de generación distribuida asociado al suministro eléctrico: clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; su cambio de titular y baja siguen al suministro… | Un contrato ELE con GD muestra su vínculo y potencia; la baja del suministro cierra el vínculo. |
| CP-CAT-0097 | RF-CAT-097; M02 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Registrar condiciones especiales de grandes usuarios: precio particular, potencia contratada, plazo, penalidades, aprobación y versión; revisión previa obligatoria de la factura por su importe (marca para FAC). | Un contrato GU no puede activarse sin condiciones aprobadas. |
| CP-CAT-0098 | RF-CAT-098; M02 §5.7; PRO-O4-07 | O4 | Estándar | regla | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Telefonía: asignar número/línea al contrato (con fechas y tarifa), modalidad (fija/móvil), plan, pack SMS, producto de telefonía prepaga que genera OT al venderse; la numeración y CDR los gestiona TEC. | Un contrato TEL muestra su número vigente y los anteriores con fechas. |
| CP-CAT-0099 | RF-CAT-099; M02 §5.7; PRO-O3-07 | O3 | Núcleo | seguridad | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Internet: referenciar el perfil técnico del contrato (identificador de acceso, nodo/OLT, puerto/recurso, perfil de velocidad de la categoría) sin almacenar secretos en CAT ni exponerlos en catálogo público o BI. | La API de contratos nunca devuelve contraseñas de acceso. |
| CP-CAT-0100 | RF-CAT-100; M02 §5.7; PRO-O10-07 | O10 | Estándar | seguridad | TEN-001 con ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio… | Correo electrónico como producto TIC del contrato (casilla, dominio) con credenciales gestionadas en la bóveda. Alcance y aprovisionamiento según PA-CAT-19 (HUECO-OTR-03). | La casilla se lista sin contraseña. |
| CP-CAT-0101 | RF-CAT-101; M02 §5.7; PRO-O10-07 | O10 | Estándar | regla | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Dispenser de agua como servicio con límite diario de litros, litros por atención y días para cálculo de deuda. | El contrato de dispenser informa el límite diario vigente. |
| CP-CAT-0102 | RF-CAT-102; M02 §5.7; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Vehículo eléctrico como perfil de registración (datos del vehículo, carga habilitable desde el portal). | El perfil pide dominio y modelo del vehículo. |
| CP-CAT-0103 | RF-CAT-103; M02 §5.7; PRO-O10-07 | O10 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Seguro como perfil de registración (cobertura, asegurados, vigencia). | El perfil pide asegurados como adherentes. |
| CP-CAT-0114 | RF-CAT-114; M02 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Cambiar el **régimen de medición** del contrato (`metered` ↔ `unmetered`) con el comando `changeMeteringRegime`, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28… | Pasar un contrato AG de `unmetered` a `metered` con fecha 01/12/2026 publica EVT-CAT-28 y desde esa fecha el contrato se factura por consumo; los períodos anteriores siguen como cuota fija. |
| CP-CAT-0115 | RF-CAT-115; M02 §5.7; PRO-O7-08 | O7 | Estándar | integración | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Crear los **contratos de obra** (tipo 17, dominio OBR) al aprobarse el prorrateo de una obra: consumir EVT-TEC-25 `tec.levy.approved` y, por cada beneficiario, crear un contrato con API-CAT-33 vinculado a la obra, al inmueble y a la cuenta… | Reprocesar el mismo EVT-TEC-25 de la obra OBR-DEMO-01 con 40 beneficiarios no crea contratos duplicados: el resultado sigue siendo 40 contratos. |
| CP-CAT-0116 | RF-CAT-116; M02 §5.7; PRO-O10-09 | O10 | Estándar | regla | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | **Informe de abonados activos por paquete a una fecha de corte**: por servicio (TV en el uso principal, aplicable a cualquier servicio con paquetes) y producto de tipo paquete, cantidad de contratos que a la fecha de corte estaban en… | Con 1.200 contratos TV del paquete básico activos al 31/10/2026 y 30 dados de baja el 01/11/2026, el informe con corte 31/10/2026 devuelve 1.200 aunque se consulte el 05/11/2026. |
### 1.8 Configuración independiente y copia entre tenants (M02 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0104 | RF-CAT-104; M02 §5.8; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con CLO-RES: Categoría Cloacas residencial con servicio relacionado AG (usa el consumo de agua de la misma cuenta); cargo de saneamiento ficticio (HUE-SRV-05). | Cada servicio de cada tenant tiene configuración propia e independiente sobre la misma capacidad de plataforma. | Cambiar INT en A no altera INT en B. |
| CP-CAT-0105 | RF-CAT-105; M02 §5.8; PRO-O2-10 | O2 | Núcleo | regla | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Copiar la configuración de un servicio (tenant, servicio y versión de origen) a un destino autorizado, eligiendo componentes (productos, planes, conceptos, reglas comerciales, categorías, estados, formularios, tipos de gestión… | La copia de INT de A a B no trae ningún documento con `tenantId` de A salvo la procedencia. |
| CP-CAT-0106 | RF-CAT-106; M02 §5.8; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. | La copia sobre un INT existente en B crea "versión 2 borrador" y conserva la versión 1 publicada. |
| CP-CAT-0107 | RF-CAT-107; M02 §5.8; PRO-O2-10 | O2 | Núcleo | integración | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Registrar identidad de la copia, procedencia, versión, componentes elegidos, actor, fecha, resultado, dependencias pendientes; evitar duplicados por reintentos. | Reintentar con el mismo `Idempotency-Key` devuelve la misma ejecución. |
| CP-CAT-0108 | RF-CAT-108; M02 §5.8; PRO-O2-10 | O2 | Núcleo | seguridad | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Exigir permiso explícito de lectura en origen y de escritura en destino; ser administrador de B no autoriza a leer A. | Un administrador de B sin autorización de A recibe 403. |
| CP-CAT-0109 | RF-CAT-109; M02 §5.8; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador. | Mantener plantillas de servicio de plataforma (sin precios ni referencias de tenants) reutilizables para lanzar servicios. | Un tenant nuevo crea INT desde la plantilla "Internet FTTH base". |
### 1.9 Oferta, portal y landing (M02 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CAT-0110 | RF-CAT-110; M02 §5.9; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia). | Publicar en la landing del tenant los servicios y planes con oferta abierta, sus requisitos y canales para solicitar, sin login. | La landing de TEN-002 muestra Electricidad y Gas. |
| CP-CAT-0111 | RF-CAT-111; M02 §5.9; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | En la PWA, mostrar servicios disponibles y contratados con estado, condiciones, beneficios temporales, equipos asignados y acciones permitidas. | Ana ve su INT Activo, su ONT en comodato y "Solicitar baja". |
| CP-CAT-0112 | RF-CAT-112; M02 §5.9; PRO-O2-10 | O2 | Núcleo | funcional | TEN-001 con BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04. | Desde la oferta o el contrato, iniciar solicitudes de alta, baja, suspensión, reactivación o cambio de plan; la solicitud la gestiona CRM y no cambia el contrato hasta su ejecución. | Solicitar la baja deja el contrato Activo con marca "Baja solicitada" hasta su ejecución. |
| CP-CAT-0113 | RF-CAT-113; M02 §5.9; PRO-O2-10 | O2 | Estándar | funcional | TEN-001 con TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.) | Proveer indicadores del catálogo: contratos por servicio/estado/plan/categoría, altas pendientes, suspensiones, bajas, equipos pendientes de devolución, contratos no facturables, planes discontinuados con contratos vigentes. | El tablero muestra cada indicador con universo y fecha de corte. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-CAT-5001 — ESC-01. Piloto Internet extremo a extremo**

- Cubre: ESC-01; M02 §17.1
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT-100 "Fibra 100": Plan 100/50 Mbps; abono ficticio ARS 15.000; instalación ARS 20.000 con promoción 50 % por 3 meses; ONT en comodato. Aclaración: la promoción **PROMO-INT-50x3** es 50 % sobre el **abono** durante 3 ciclos; la…
- Dado TEN-001 con INT publicado y plan "Fibra 100"
- Cuando Ana solicita por la PWA, TEC aprueba factibilidad, instala con ONT en comodato y confirma provisión
- Entonces el contrato pasa `requested → feasibility → pendingInstallation → active`, existe asignación `delivered`, se emite `cat.contract.activated` una sola vez y FAC inicia el devengamiento.

**CP-CAT-5002 — ESC-02. Copia entre tenants**

- Cubre: ESC-02; M02 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia).
- Dado INT v1 en TEN-001
- Cuando se copia a TEN-002 con consentimiento
- Entonces TEN-002 tiene borrador con `copiedFrom`, sin contratos, sin credenciales ni precios de A (pendientes de TAR), y cambiar A después no altera B.

**CP-CAT-5003 — ESC-03. Hermanos en el mismo domicilio**

- Cubre: ESC-03; M02 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: Hermano A / Hermano B: Titulares Contratos INT-H-A-001 e INT-H-B-001 en DIR-CASA-001 (ESC-03); A con deuda ficticia.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Hermanos en el mismo domicilio
- Entonces Dados dos titulares (A y B) en DIR-CASA-001, cuando ambos contratan INT, entonces existen dos contratos independientes; la deuda de A no bloquea a B (solo advertencia si PRM-CAT-017=warn) ni se traslada.

**CP-CAT-5004 — ESC-04. Baja sin trabas**

- Cubre: ESC-04; M02 §17.1
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Baja sin trabas
- Entonces Cuando un socio con deuda pide la baja por el botón público, entonces CRM la admite, CAT ejecuta T12 sin cargo ni bloqueo, y la deuda queda en COB.

**CP-CAT-5005 — ESC-05. Reactivación gratuita vs. arancelada**

- Cubre: ESC-05; M02 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: REACT-DEMO-GRATIS / REACT-DEMO-ARANCEL: Política Reconexión gratuita (activa) / arancelada (deshabilitada) en MOR para ESC-05.
- Dado SUS-DEMO-GRATIS (sin cargo) y REACT-DEMO-ARANCEL (deshabilitado por política MOR)
- Cuando se reactiva
- Entonces solo se genera concepto tipo 4 si la política MOR lo habilita.

## 3. Casos por caso de uso (CU)

**CP-CAT-8001 — CU-05. Configurar y publicar un servicio**

- Cubre: CU-05; M02 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.)
- Dado actor: Administrador del tenant, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.1
- Entonces Servicio publicado con versión vigente.

**CP-CAT-8002 — CU-CAT-01. Habilitar capacidades a un tenant**

- Cubre: CU-CAT-01; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia).
- Dado actor: Operador de plataforma, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-02: elige tenant, capacidad, fecha; valida licencia; confirma
- Entonces `tenantService` habilitado sin oferta.

**CP-CAT-8003 — CU-COP-01. Copiar un servicio de A a B**

- Cubre: CU-COP-01; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Operador + admin B, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.6
- Entonces Borrador en B con pendientes; A intacto.

**CP-CAT-8004 — CU-PRO-01. Contratar Internet (piloto)**

- Cubre: CU-PRO-01; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Ana (socia), comercial, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.2
- Entonces Contrato activo, comodato registrado, facturación iniciada.

**CP-CAT-8005 — CU-SOL-01. Solicitud de alta por portal (definición en M09 §16, anexo dueño; aquí la parte CAT)**

- Cubre: CU-SOL-01; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio `accessoryContract` (PRM-CAT-111) y reclamos atendidos por la cooperativa…
- Dado actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-21 (embebido en PAN-POR-31) → CRM → T01
- Entonces Contrato `requested` vinculado a la solicitud.

**CP-CAT-8006 — CU-CIC-01. Ciclo de vida del contrato (definición en M08 §16, anexo dueño según PA-MOR-21 y PA-CAT-20; aquí la parte CAT)**

- Cubre: CU-CIC-01; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio `accessoryContract` (PRM-CAT-111) y reclamos atendidos por la cooperativa…
- Dado actor: Varios, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.3
- Entonces Transiciones auditadas.

**CP-CAT-8007 — CU-CAT-13. Ofrecer servicio a un mercado nuevo (no socio)**

- Cubre: CU-CAT-13; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.)
- Dado actor: Comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando Alta con titular no asociado si el perfil lo admite (`holderRules.requiresMember=false`)
- Entonces Contrato sin condición de socio.

**CP-CAT-8008 — CU-ESP-ELE. Alta de suministro eléctrico con medidor y GD**

- Cubre: CU-ESP-ELE; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Comercial, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Factibilidad → OT de conexión → medidor (MED) → T06; vínculo GD opcional
- Entonces Suministro activo con categoría regulatoria.

**CP-CAT-8009 — CU-ESP-AG. Alta de agua con conexión**

- Cubre: CU-ESP-AG; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Comercial, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Igual ELE, con parcela única
- Entonces Conexión activa.

**CP-CAT-8010 — CU-ESP-GAS. Alta de gas con DDJJ de artefactos**

- Cubre: CU-ESP-GAS; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Comercial, gasista matriculado, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Certificado de instalador → DDJJ → inspección → T06
- Entonces Servicio habilitado con artefactos registrados.

**CP-CAT-8011 — CU-ESP-CEM. Contratar parcela de cementerio parque (definición en M18 §16, anexo dueño según PA-CAT-20; aquí la parte de contratación)**

- Cubre: CU-ESP-CEM; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: CEM-PAR: Plan Parcela cementerio parque en 24 cuotas ficticias.
- Dado actor: Comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando Alta con parcela/nicho (PRM-CAT-097), financiación, beneficiarios
- Entonces Contrato con cuotas (FAC) y beneficiarios.

**CP-CAT-8012 — CU-ESP-SAN. Adhesión a banco de sangre (definición en M18 §16, anexo dueño según PA-CAT-20; aquí la parte de contratación)**

- Cubre: CU-ESP-SAN; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: SAN-CONV: Plan Banco de sangre por convenio CONV-SAN-DEMO (solo administrativo).
- Dado actor: Comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando Alta administrativa con convenio (PA-CAT-06)
- Entonces Contrato y beneficiarios; sin datos clínicos.

**CP-CAT-8013 — CU-CAT-02. Dar de baja un contrato**

- Cubre: CU-CAT-02; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: BAJA-DEMO: Contrato INT activo con deuda ficticia para ESC-04.
- Dado actor: Socio / comercial / técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando Solicitud CRM (botón de baja) → T12 → OT → T14; equipos a devolución
- Entonces Baja efectiva sin bloqueo por deuda.

**CP-CAT-8014 — CU-CAT-03. Suspender y reactivar por mora**

- Cubre: CU-CAT-03; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: MOR, técnico, autenticado en TEN-001 con las capabilities de su rol
- Cuando `mor.interruption.approved` (EVT-MOR-12) → T08; pago → T09 → T10
- Entonces Servicio restablecido con regla de fecha.

**CP-CAT-8015 — CU-CAT-04. Cambiar de plan**

- Cubre: CU-CAT-04; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.)
- Dado actor: Socio / comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.4
- Entonces Nuevo tramo de condiciones con fecha efectiva.

**CP-CAT-8016 — CU-CAT-05. Recategorización masiva**

- Cubre: CU-CAT-05; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: Hermano A / Hermano B: Titulares Contratos INT-H-A-001 e INT-H-B-001 en DIR-CASA-001 (ESC-03); A con deuda ficticia.
- Dado actor: Responsable comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.8
- Entonces Contratos recategorizados con historia, reversibles.

**CP-CAT-8017 — CU-CAT-06. Transferir un servicio**

- Cubre: CU-CAT-06; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-002 `coop-ejemplo-b` "Cooperativa Ejemplo B" (R14; antes "Cooperativa Demo Sur"): Tenant Capacidad INT habilitada, sin oferta (destino de copia).
- Dado actor: Supervisor, autenticado en TEN-001 con las capabilities de su rol
- Cuando 9.5
- Entonces Contrato nuevo en destino, original `superseded`.

**CP-CAT-8018 — CU-CAT-07. Registrar y devolver equipo en comodato**

- Cubre: CU-CAT-07; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: INT: Servicio Perfil técnico, factibilidad obligatoria, comodato por defecto, canal PWA y mostrador.
- Dado actor: Técnico / comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-19
- Entonces Equipo trazable en STK y contrato.

**CP-CAT-8019 — CU-CAT-08. Administrar adherentes (Reemplazado por M18, PAN-SOC-01; HUECO-TRV-01)**

- Cubre: CU-CAT-08; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: SOC-FAM: Plan Sepelio familiar con adherentes, carencia 90 días.
- Dado actor: Comercial, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-20 (Reemplazado por PAN-SOC-01)
- Entonces Miembros vigentes con controles.

**CP-CAT-8020 — CU-CAT-09. Configurar alta automática**

- Cubre: CU-CAT-09; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: PAR-DEMO-001: Regla automática Alta de SEP propuesta al activar ELE (modo `propose`).
- Dado actor: Administrador, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-11 con simulación
- Entonces Regla vigente.

**CP-CAT-8021 — CU-CAT-10. Marcar contrato como No facturar**

- Cubre: CU-CAT-10; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: ALU-MUN: Plan Alumbrado público accesorio al ELE (contrato tipo 6 con `parentContractId`), convenio municipal ficticio CONV-ALU-DEMO, criterio `accessoryContract` (PRM-CAT-111) y reclamos atendidos por la cooperativa…
- Dado actor: Supervisor, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-16 con motivo y vigencia
- Entonces Marca con vencimiento; bandeja.

**CP-CAT-8022 — CU-CAT-11. Consultar mis servicios**

- Cubre: CU-CAT-11; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: Hermano A / Hermano B: Titulares Contratos INT-H-A-001 e INT-H-B-001 en DIR-CASA-001 (ESC-03); A con deuda ficticia.
- Dado actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-22 (embebido en PAN-POR-29/30, HUE-SRV-04)
- Entonces Visión de contratos, equipos y promociones.

**CP-CAT-8023 — CU-CAT-12. Retirar un servicio de la oferta**

- Cubre: CU-CAT-12; M02 §16
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M02 §18.
- Datos de prueba: TEN-001 `coop-ejemplo-a` "Cooperativa Ejemplo A" (R14 del plan; antes "Cooperativa Demo Norte"): Tenant Capacidades INT, ELE, AG, CLO, GAS, ALU, TEL, TV, SEP, CEM, SAN habilitadas; INT publicado. (CLO, GAS y ALU agregadas por HUE-SRV-05.)
- Dado actor: Administrador, autenticado en TEN-001 con las capabilities de su rol
- Cuando PAN-CAT-03 con alcance (PA-CAT-03)
- Entonces Oferta cerrada; contratos vigentes intactos o plan de salida.
