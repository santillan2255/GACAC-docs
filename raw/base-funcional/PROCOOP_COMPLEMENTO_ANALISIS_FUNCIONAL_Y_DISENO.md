# Complemento de análisis funcional y diseño del sistema de cooperativas

Versión: 0.1  
Fecha: 3 de noviembre de 2026  
Documento base revisado: PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md, versión 0.14.  
Estado: propuestas del análisis, pendientes de validación e incorporación al alcance aprobado.

## 1. Propósito y criterio de revisión

Este documento adicional identifica aspectos que conviene incorporar o precisar para convertir la visión del sistema en una especificación desarrollable y operable. Se revisó el documento base completo, sus 96 secciones numeradas, ampliaciones, fuentes y anexo de 20 mensajes originales. La base se conserva sin cambios.

El foco es el producto definido: SaaS multitenant de gestión cooperativa con ERP, CRM, comunidad, autogestión, servicios configurables, facturación argentina y operación técnica. No se proponen módulos ajenos a esa visión ni se convierte cada posibilidad en requisito obligatorio.

Se distinguen tres diagnósticos:

- **No explicitado:** no se encontró un circuito o requisito expreso equivalente en la base. No significa que no pueda estar implícito en una categoría general.
- **Detalle insuficiente:** el tema existe; faltan decisiones, reglas o criterios para implementarlo sin ambigüedad.
- **Pendiente ya identificado:** la base ya lo dejó abierto. El aporte aquí es proponer cómo cerrarlo, no presentarlo como un descubrimiento nuevo.

Las prioridades son de análisis, no de implementación completa:

- **P0:** resolver la decisión o contrato funcional antes de cerrar arquitectura o construir el núcleo. No exige construir toda la función en la primera entrega.
- **P1:** concretar antes de poner en producción el flujo afectado; imprescindible si se incluye en el piloto.
- **P2:** decidir su inclusión y momento; puede diferirse con límites explícitos.

Todas las recomendaciones de este complemento son propuestas. Los requisitos informados por el solicitante conservan su condición en la base; ninguna propuesta se considera aprobada por aparecer aquí.

## 2. Diagnóstico principal

La base tiene una cobertura funcional amplia: los módulos principales y las particularidades de servicios ya están relevados. El mayor trabajo pendiente no consiste en agregar nombres de módulos, sino en definir cómo funcionan sus bordes: quién puede actuar, qué dato es la fuente, cuándo cambia el estado, cómo se reintenta, cómo se corrige y cómo se concilian los efectos económicos.

Los puntos más determinantes para arquitectura son el modelo de identidad multitenant, los responsables de los datos, los estados y eventos entre módulos, el historial con fechas efectivas, la integridad de saldos y la publicación de configuración. Si se resuelven tarde, obligarán a rehacer contratos de API, pantallas, procesos y migraciones.

Los vacíos operativos más visibles son el circuito de pagos excedentes/no identificados y la moderación de comunidad si se habilita participación. Otros puntos —migración, backups, presupuestos, activos, privacidad y soporte— ya están mencionados, pero necesitan definición para ser comprobables.

### 2.1. Qué ya está y no hace falta volver a inventar

| Capacidad cubierta en la base | Referencias | Aporte necesario del complemento |
|---|---|---|
| Tenants, roles, perfiles, marca y diccionario | 42–45, 60, 65 | Cerrar reglas efectivas, ciclo del tenant y publicación. |
| Catálogo de servicios y copia entre cooperativas | 66, 72, 81, 84 | Convertir copia en paquete validable y mantener dependencias. |
| Facturación, cuenta corriente, cobranza y tesorería | 10–14, 21–22, 44, 68–69, 75 | Definir invariantes, correcciones, excedentes y cierre. |
| ERP con cuentas y centros de costos reales/simulados | 55, 75 | Completar controles operativos y opciones de activos/presupuesto. |
| CRM, IA, chat, bot y supervisión | 47 | Estados, responsabilidad y evaluación de automatizaciones. |
| Visitas, equipo, firma, encuesta y primer cobro | 50, 73 | Concurrencia, contingencia offline y efectos parciales. |
| APIs, seguridad, auditoría y organismos fiscales | 54, 59–62 | Contratos operativos, entornos y evidencia de verificación. |
| Seis dominios y límites regulatorios | 85–95 | Obtener documentación real y cerrar reglas por cooperativa. |

## 3. Matriz de propuestas y trazabilidad

La referencia a secciones corresponde siempre al documento base v0.14. Los identificadores AGR son propios de este complemento y no reutilizan los IDs de requisitos originales.

| ID | Propuesta | Prioridad | Diagnóstico respecto de la base | Secciones base |
|---|---|---|---|---|
| AGR-001 | Consolidar requisitos y decisiones en un catálogo único | P0 | Detalle insuficiente | 2, 34–38, 84, 93, 96 |
| AGR-002 | Responsable de cada dato y límite entre ERP, CRM y operación | P0 | Pendiente ya identificado | 33, 58, 73, 75, 78, 84 |
| AGR-003 | Modelos de estados y reversión por proceso | P0 | Detalle insuficiente | 15–17, 39, 47–50, 53, 69, 73 |
| AGR-004 | Ciclo de vida completo de la cooperativa y preparación para producción | P0 | Detalle insuficiente | 42–43, 64, 66, 81 |
| AGR-005 | Contrato comercial SaaS y habilitación de capacidades | P2 | Pendiente ya identificado | 64, 66, 81 |
| AGR-006 | Identidad de acceso, pertenencia y selección de cooperativa | P0 | Pendiente ya identificado | 3, 42, 59–60, 67, 83 |
| AGR-007 | Representaciones, titulares, beneficiarios y cambios de responsabilidad | P1 | Detalle insuficiente | 3–4, 24, 67, 83, 90–91 |
| AGR-008 | Regla exacta de combinación entre roles y perfiles | P0 | Pendiente ya identificado | 29, 42, 45, 60 |
| AGR-009 | Publicación segura de configuración y paquetes de servicio | P0 | Detalle insuficiente | 6, 51, 65–66, 72, 81 |
| AGR-010 | Historia con fecha efectiva y fecha de registro | P0 | Detalle insuficiente | 4, 6–11, 51, 55, 69, 75, 83 |
| AGR-011 | Invariantes monetarias y única fuente del saldo | P0 | Detalle insuficiente | 10–14, 22, 40, 44, 51, 55, 75, 78 |
| AGR-012 | Pagos excedentes, anticipos y cobros sin identificar | P1 | No explicitado | 11–13, 40, 44, 68, 75 |
| AGR-013 | Devoluciones y reversos con sus dos efectos | P1 | Detalle insuficiente | 10–14, 21–22, 53, 61, 75 |
| AGR-014 | Vida completa de convenios y financiación | P1 | Detalle insuficiente | 14, 23, 51, 68, 72 |
| AGR-015 | Cierre y aprobación de cada ciclo de facturación | P0 | Detalle insuficiente | 10, 51, 69, 75 |
| AGR-016 | Ejecución fiable de acciones entre componentes | P0 | Detalle insuficiente | 13, 47, 54, 58–59, 61, 69, 73 |
| AGR-017 | Calendarios, prorrateos y cambios dentro del período | P1 | Detalle insuficiente | 6, 51, 69, 72–73 |
| AGR-018 | Migración y cambio operativo desde el sistema anterior | P1 | Detalle insuficiente | 31, 35, 64, 95 |
| AGR-019 | Recuperación y restauración por tenant | P0 | Detalle insuficiente | 29, 54, 60, 64 |
| AGR-020 | Capacidad, rendimiento y aislamiento de carga | P0 | Pendiente ya identificado | 54, 58–60, 64, 69 |
| AGR-021 | Operación de APIs y conectores, además de su desarrollo | P1 | Detalle insuficiente | 13, 31, 59, 61, 79 |
| AGR-022 | Contrato semántico para dashboards y BI | P1 | Detalle insuficiente | 30, 54–55, 59, 75 |
| AGR-023 | Expediente documental y conservación de evidencia | P1 | Detalle insuficiente | 3, 17, 43, 47, 54, 61, 73, 90–91 |
| AGR-024 | Comunicaciones, entrega y constancias | P1 | Detalle insuficiente | 26, 43, 47, 50, 52–54, 73 |
| AGR-025 | Visitas y operación sin conexión con conflictos | P1 | Detalle insuficiente | 8, 17, 50, 73, 77 |
| AGR-026 | Valorización, activos y reparación de equipos | P1 | Pendiente ya identificado | 7, 18, 20, 55, 73, 75, 78 |
| AGR-027 | Control de compra, recepción y factura de proveedor | P1 | Detalle insuficiente | 19–21, 61, 75, 78 |
| AGR-028 | Presupuestos y compromisos de fondos | P2 | Pendiente ya identificado | 19, 21–22, 55, 75 |
| AGR-029 | Capital y relación institucional del asociado | P1 | Pendiente ya identificado | 3, 27, 75, 83 |
| AGR-030 | Gobierno de la IA y verificación de sus resultados | P0 | Detalle insuficiente | 47, 54, 60, 65, 73, 91 |
| AGR-031 | Moderación y ciclo de vida de la comunidad | P2 | No explicitado | 26, 46, 65, 82 |
| AGR-032 | Accesibilidad y autogestión tolerante a errores | P1 | Detalle insuficiente | 25, 43, 50, 60, 65, 67, 73 |
| AGR-033 | Ciclo de privacidad, conservación y salida de datos | P0 | Detalle insuficiente | 29, 54, 59–60, 64, 77, 83, 90–91 |
| AGR-034 | Soporte con acceso temporal y responsabilidad | P1 | Detalle insuficiente | 42, 54, 60, 64 |
| AGR-035 | Entornos, pruebas y evidencias antes de cada entrega | P0 | Detalle insuficiente | 34, 39–40, 54–55, 60, 69, 73 |
| AGR-036 | Plan de entrega y aceptación de la cooperativa piloto | P0 | Pendiente ya identificado | 35, 37, 58, 64, 95 |

## 4. Fichas de ampliación recomendadas

Cada ficha contiene un problema concreto, una propuesta, un ejemplo y un criterio verificable. El criterio puede implementarse como prueba, inspección de diseño o evidencia operativa según corresponda.

### AGR-001 — Consolidar requisitos y decisiones en un catálogo único

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 2, 34–38, 84, 93, 96.

**Qué falta concretar y por qué:** La base acumuló ampliaciones y pendientes a lo largo de 96 secciones. Tener todos los textos no asegura que cada decisión tenga una única versión vigente y responsable.

**Propuesta:** Crear un registro con ID estable, origen, redacción vigente, estado —informado, propuesto, aprobado, rechazado o sustituido—, responsable, dependencia, versión y criterio de aceptación. Referenciar los mensajes P-001 a P-020 sin convertir todas las opiniones del anexo en hechos verificados. Mantener ejemplos fuera de la configuración normativa.

**Ejemplo:** Una regla propuesta en una sección y precisada después debe mostrar cuál redacción prevalece y qué decisión la sustituyó.

**Criterio de aceptación:** Cada requisito del piloto tiene una definición vigente identificable y puede rastrearse a su origen y prueba; una contradicción no se resuelve eligiendo arbitrariamente el párrafo más conveniente.

### AGR-002 — Responsable de cada dato y límite entre ERP, CRM y operación

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 33, 58, 73, 75, 78, 84.

**Qué falta concretar y por qué:** La revisión de arquitectura está expresamente pedida, pero falta convertirla en un mapa de propietarios de datos y comandos. Varias pantallas podrían terminar modificando el mismo estado.

**Propuesta:** Asignar un responsable funcional a persona, vínculo de tenant, contrato, visita, instalación, medición, factura, pago y asiento. Los otros módulos solicitan acciones o consultan proyecciones; no escriben directamente estados ajenos. Definir comandos, eventos y resultados esperados.

**Ejemplo:** CRM puede solicitar una baja y mostrar su avance; el componente contractual confirma el cambio efectivo y facturación calcula las consecuencias.

**Criterio de aceptación:** Para cada entidad crítica hay un responsable y una interfaz de modificación documentados; cerrar un ticket por sí solo no cambia un contrato ni cancela deuda.

### AGR-003 — Modelos de estados y reversión por proceso

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 15–17, 39, 47–50, 53, 69, 73.

**Qué falta concretar y por qué:** Ya existen estados de ejemplo, pero no tablas completas de transiciones, responsables, precondiciones y efectos. Dos procesos pueden quedar en estados incompatibles.

**Propuesta:** Definir por proceso estado origen/destino, actor, requisitos, datos obligatorios, efectos, avisos, reversión y tratamiento de cancelación. Distinguir el estado del trámite del estado real del contrato, equipo, pago y documento.

**Ejemplo:** Cancelar una visita no cancela necesariamente la contratación; anular una solicitud antes de instalar no debe exigir el circuito de retiro de un equipo instalado.

**Criterio de aceptación:** Toda transición aceptada o rechazada puede explicarse por una regla; no existe edición libre de Activo, Pagado o Emitido para forzar cierres.

### AGR-004 — Ciclo de vida completo de la cooperativa y preparación para producción

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 42–43, 64, 66, 81.

**Qué falta concretar y por qué:** Se contempla el alta del tenant, pero faltan etapas operativas de preparación, validación, habilitación, suspensión administrativa, reactivación y salida.

**Propuesta:** Proponer estados Preparación, Prueba, Listo para habilitar, Operativo y Cierre administrativo, con tareas por área. Exigir checklist de identidad, servicio, tarifas, emisión, pagos, usuarios, contactos y saldos iniciales para cada capacidad productiva. Diferenciar disponibilidad técnica, situación comercial SaaS y prestación al socio.

**Ejemplo:** Un tenant puede cargar marca y catálogo mientras todavía no tiene credenciales fiscales aprobadas; eso no debe habilitar emisión real.

**Criterio de aceptación:** No se activa una capacidad productiva con datos de demostración o dependencias faltantes; una decisión administrativa de plataforma no ejecuta bajas masivas de servicios de la cooperativa.

### AGR-005 — Contrato comercial SaaS y habilitación de capacidades

**Prioridad:** P2. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 64, 66, 81.

**Qué falta concretar y por qué:** La base declara que precio y licenciamiento SaaS no están definidos. Conviene diseñar el punto de conexión sin inventar todavía el modelo comercial.

**Propuesta:** Separar capacidades contratadas a la plataforma, servicios ofrecidos por el tenant y contratos de sus socios. Si se comercializa por módulos o cupos, definir vigencia, límites blandos/duros, excedentes, avisos y tratamiento de baja del cliente SaaS. Determinar acceso a documentos y exportación durante una transición.

**Ejemplo:** Deshabilitar nuevas contrataciones de un módulo no debe ocultar facturas históricas del tenant ni eliminar expedientes.

**Criterio de aceptación:** El sistema puede explicar qué habilitación depende del producto SaaS y cuál del catálogo del tenant; no se implementa un precio o límite sin decisión comercial expresa.

### AGR-006 — Identidad de acceso, pertenencia y selección de cooperativa

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 3, 42, 59–60, 67, 83.

**Qué falta concretar y por qué:** La identidad global o separada por tenant sigue abierta y afecta registro, Google, recuperaciones, duplicados y privacidad.

**Propuesta:** Como hipótesis preferida, evaluar una identidad de acceso común con pertenencias privadas a tenants, manteniendo separados los registros de personas y asociados de cada cooperativa. La selección de ámbito debe ser explícita, comprobada en servidor y visible al usuario. La coincidencia de DNI o correo no concede pertenencia.

**Ejemplo:** Una persona que trabaja en A y contrata un servicio en B cambia de ámbito sin mezclar sus roles ni revelar a una cooperativa su relación con la otra.

**Criterio de aceptación:** Un cambio de tenant obliga a recalcular permisos y datos visibles, incluyendo descargas, caché, conversaciones y trabajos de fondo.

### AGR-007 — Representaciones, titulares, beneficiarios y cambios de responsabilidad

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 3–4, 24, 67, 83, 90–91.

**Qué falta concretar y por qué:** Los roles de persona están distinguidos, pero falta el ciclo verificable de autorización, vencimiento y revocación de representación y de los cambios de titularidad.

**Propuesta:** Modelar relaciones con inicio/fin, alcance y evidencia. Definir quién puede consultar, pagar, solicitar baja o firmar por otro. Resolver fallecimiento, representación de organizaciones, grupo familiar y cambio de pagador sin reasignar deuda automáticamente. Conservar la responsabilidad de cada período.

**Ejemplo:** Un hermano paga una factura del otro sin adquirir derecho a ver todos sus contratos; revocar una representación retira el acceso futuro.

**Criterio de aceptación:** Cada gestión en nombre de tercero acredita una relación vigente para esa acción y conserva quién actuó y por quién.

### AGR-008 — Regla exacta de combinación entre roles y perfiles

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 29, 42, 45, 60.

**Qué falta concretar y por qué:** Está clara la diferencia entre pantalla y función, pero falta resolver varios roles/perfiles, restricciones por sucursal/área, denegaciones y separación de tareas.

**Propuesta:** Definir cómo se calcula el permiso efectivo, el alcance sobre datos y el tratamiento de conflictos. Proponer denegación por defecto, aprobación independiente para operaciones sensibles y pruebas de permiso por acción y objeto. Restringir la autoasignación de privilegios y el poder de delegarlos.

**Ejemplo:** Ver Tesorería no permite aprobar una devolución propia; un supervisor de Agua no obtiene por ese rol los expedientes sanitarios de Banco de sangre.

**Criterio de aceptación:** Para cualquier usuario se puede explicar por qué una pantalla, registro y acción están habilitados o denegados, también en la API.

### AGR-009 — Publicación segura de configuración y paquetes de servicio

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 6, 51, 65–66, 72, 81.

**Qué falta concretar y por qué:** La configuración versionada y la copia existen conceptualmente, pero falta definir cómo se publica un conjunto coherente y cómo se evita aplicar solo una parte.

**Propuesta:** Crear una versión de configuración que reúna dependencias, validaciones, simulación, revisión y fecha efectiva. Copiar a borrador y mostrar diferencias. Separar cambios comerciales, fiscales y de presentación; una corrección de label no debe generar una revisión tarifaria innecesaria. No sobrescribir contratos vigentes sin política.

**Ejemplo:** Copiar Internet a B importa formularios, pero la publicación se detiene si no hay equivalencia contable o una tarifa aplicable para B.

**Criterio de aceptación:** La publicación es íntegra y auditable; no queda un plan visible sin precio o con un impuesto del tenant origen por una actualización parcial.

### AGR-010 — Historia con fecha efectiva y fecha de registro

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 4, 6–11, 51, 55, 69, 75, 83.

**Qué falta concretar y por qué:** Existen vigencias, pero falta una regla transversal para cambios retroactivos, datos recibidos tarde y reconstrucción de lo conocido en una fecha.

**Propuesta:** Conservar fecha efectiva del hecho y fecha en que el sistema lo recibió, además de su origen. Definir qué puede corregirse en borrador y qué exige un ajuste de operación emitida/cerrada. Las consultas históricas deben declarar qué fecha interpretan.

**Ejemplo:** Una instalación realizada el 10 se sincroniza el 12; una tarifa cargada el 15 tiene vigencia autorizada desde el 1. No son el mismo tipo de retroactividad.

**Criterio de aceptación:** Se puede explicar una factura con los datos y reglas que utilizó, y reconstruir la corrección posterior sin reescribir silenciosamente el documento original.

### AGR-011 — Invariantes monetarias y única fuente del saldo

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10–14, 22, 40, 44, 51, 55, 75, 78.

**Qué falta concretar y por qué:** Las conciliaciones y ejemplos están bien planteados, pero falta convertirlos en reglas obligatorias del diseño y la persistencia.

**Propuesta:** Definir representación decimal, precisión por concepto, redondeo, moneda y reglas de compensación. El saldo comercial se deriva de movimientos válidos e imputaciones, no de campos editables independientes. Mantener control de documentos, auxiliar, caja/banco y contabilidad con diferencias explicadas.

**Ejemplo:** Una factura de ARS 13.000 con ARS 5.000 imputados tiene ARS 8.000 de saldo aunque el resumen se regenere o cambie su presentación.

**Criterio de aceptación:** El total no depende de la pantalla o proceso que lo consulte; ningún ajuste de saldo carece de operación, causa, autor y contrapartida.

### AGR-012 — Pagos excedentes, anticipos y cobros sin identificar

**Prioridad:** P1. **Diagnóstico:** No explicitado. **Base:** secciones 11–13, 40, 44, 68, 75.

**Qué falta concretar y por qué:** Se contemplan pagos parciales y a cuenta, pero no está cerrado el tratamiento de excedentes, transferencias no identificadas y pagos de terceros.

**Propuesta:** Crear un circuito de pendientes de identificación y saldo a favor, con conciliación, responsable y aplicación autorizada. Definir qué datos se requieren para identificar al titular beneficiado y cómo se trata un pago anterior a la factura. No aplicar un excedente a otro conviviente o servicio por inferencia.

**Ejemplo:** Ingresan ARS 15.000 para una factura de ARS 13.000: se cancela la obligación y quedan ARS 2.000 a favor o pendientes de aplicación según la política acordada.

**Criterio de aceptación:** Cada peso recibido queda explicado como cancelación, crédito o pendiente; no se pierden excedentes ni se asignan fondos solo por dirección, nombre parecido o imagen de comprobante.

### AGR-013 — Devoluciones y reversos con sus dos efectos

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10–14, 21–22, 53, 61, 75.

**Qué falta concretar y por qué:** La base menciona devoluciones y contracargos, pero falta el expediente que distingue corrección comercial, autorización y devolución efectiva de dinero.

**Propuesta:** Definir solicitud, causa, documento correctivo si corresponde, aprobación, cuenta a reintegrar, ejecución financiera y conciliación. Mantener vinculadas las operaciones originales y reversos. Evaluar efectos en promociones, mora, financiación y períodos cerrados.

**Ejemplo:** Emitir un crédito de ARS 2.000 no significa que el banco ya devolvió ARS 2.000. Un contracargo puede reabrir una obligación sin borrar el recibo original.

**Criterio de aceptación:** Se puede explicar por separado el saldo comercial y el reintegro pendiente/ejecutado; no se devuelve dos veces al repetir una orden.

### AGR-014 — Vida completa de convenios y financiación

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 14, 23, 51, 68, 72.

**Qué falta concretar y por qué:** Existen planes y acuerdos, pero faltan reglas de sustitución de deuda, refinanciación, cancelación anticipada, incumplimiento y conciliación de cuotas.

**Propuesta:** Conservar obligaciones incluidas, capital, intereses y componentes del acuerdo; definir qué sigue exigible y qué queda reemplazado. Separar venta financiada y regularización. Precisar aplicación de pagos, cambios de tasa si fueran válidos y efecto de baja del servicio.

**Ejemplo:** Una deuda incluida en un convenio no puede seguir reclamándose íntegramente junto con todas sus cuotas como si fueran obligaciones adicionales.

**Criterio de aceptación:** Se concilian deuda de origen, pagos, capital pendiente y cargos del acuerdo sin doble exigencia ni cuotas huérfanas.

### AGR-015 — Cierre y aprobación de cada ciclo de facturación

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 10, 51, 69, 75.

**Qué falta concretar y por qué:** Los lotes ya tienen validación y excepciones. Falta un cierre de ciclo que establezca si la cooperativa puede dar por terminado el período y quién acepta diferencias.

**Propuesta:** Definir universo congelado o versionado, totales esperados, simulación, aprobación y emisión. Clasificar cada seleccionado como emitido, observado, pendiente, excluido con causa o incierto, y cuadrar sus cantidades. Determinar reapertura y reportes de pendientes trasladados.

**Ejemplo:** Un lote de 100 con 98 emitidos y 2 pendientes puede terminar su ejecución, pero el período no debe aparentar 100 facturados.

**Criterio de aceptación:** El cierre produce un acta/reporte de control con responsables y excepciones; no exige ocultar errores para cerrar ni deja casos sin seguimiento.

### AGR-016 — Ejecución fiable de acciones entre componentes

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 13, 47, 54, 58–59, 61, 69, 73.

**Qué falta concretar y por qué:** Se pide evitar duplicados, pero falta una política común de identidad de operación, entrega de mensajes y reparación de acciones incompletas.

**Propuesta:** Definir identificador de operación por tenant, reintento seguro, estados intermedios, correlación y resultado final. Registrar de forma durable el cambio y el trabajo pendiente para otros componentes; reintentar sin volver a aplicar lo ya confirmado. No exigir una tecnología específica ni presumir entrega única de mensajes.

**Ejemplo:** El servicio quedó instalado y se registró stock, pero falló crear el cargo: se repara el paso faltante y no se instala ni descuenta otra vez.

**Criterio de aceptación:** Un fallo después de confirmar un pago o activar un servicio puede recuperarse sin duplicar efectos; existe una bandeja técnica/operativa para casos no reparables automáticamente.

### AGR-017 — Calendarios, prorrateos y cambios dentro del período

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 6, 51, 69, 72–73.

**Qué falta concretar y por qué:** Hay ejemplos de prorrateo y fechas, pero falta una especificación de fronteras que sirva para todos los motores de cálculo.

**Propuesta:** Definir zona horaria, inclusión de días, meses cortos, feriados, cambio de plan o titular, suspensión, promoción y redondeo por tramo. Diferenciar calendario de lectura, liquidación, emisión y vencimiento. Guardar cada tramo y su regla.

**Ejemplo:** Una promoción de tres ciclos puede consumir o no un primer ciclo parcial; cualquiera sea la decisión, debe estar definida y explicarse al socio.

**Criterio de aceptación:** Los casos de fin de mes, año bisiesto, cambios a mitad de período y carga tardía producen resultados aprobados y reproducibles, no dependientes del horario del servidor.

### AGR-018 — Migración y cambio operativo desde el sistema anterior

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 31, 35, 64, 95.

**Qué falta concretar y por qué:** La migración está contemplada, pero falta una estrategia ejecutable para la primera cooperativa y su continuidad diaria.

**Propuesta:** Planificar inventario de fuentes, correspondencias, limpieza, ensayo completo, conciliación por servicio y titular, congelamiento de cambios, carga final, aceptación y plan de retorno. Definir qué historia se importa y qué queda disponible solo para consulta. No usar una misma persona/domicilio para fusionar contratos distintos.

**Ejemplo:** Un saldo inicial de ARS 8.000 debe conservar titular, contrato, documento/período y origen, además de coincidir con el total contable.

**Criterio de aceptación:** Antes de habilitar producción se cuadran socios, contratos activos, equipos, deuda y fondos; los cambios realizados después del corte no desaparecen si se debe volver al sistema anterior.

### AGR-019 — Recuperación y restauración por tenant

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 29, 54, 60, 64.

**Qué falta concretar y por qué:** Ya se prevén copias y pruebas. Falta precisar pérdida admisible de datos, tiempo de recuperación y cómo restaurar una cooperativa sin retroceder las demás.

**Propuesta:** Acordar RPO —datos que se tolera perder— y RTO —tiempo objetivo de recuperación— por proceso, sin inventar cifras. Diseñar restauración selectiva, claves, adjuntos, auditoría y conciliación con terceros. Una restauración no puede deshacer una emisión fiscal o un cobro externo ya confirmado.

**Ejemplo:** Restaurar una copia anterior al último pago exige recuperar/conciliar ese pago desde evidencia verificable, sin volver a cobrarlo.

**Criterio de aceptación:** Un ensayo demuestra recuperación del tenant, integridad de documentos y conciliación externa; no basta comprobar que existe un archivo de backup.

### AGR-020 — Capacidad, rendimiento y aislamiento de carga

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 54, 58–60, 64, 69.

**Qué falta concretar y por qué:** No hay un perfil cuantificado de volumen y simultaneidad que permita elegir infraestructura y probar el servicio.

**Propuesta:** Relevar tenants, usuarios, contratos, documentos por ciclo, tamaño de archivos, mensajes, consultas BI y trabajos de fondo. Definir objetivos de respuesta y ventanas batch, límites por tenant y prioridades. Proponer separar trabajos pesados del uso interactivo según las mediciones.

**Ejemplo:** Un tenant exporta toda su historia mientras otro cobra en caja; la exportación no debe monopolizar recursos y bloquear la cobranza.

**Criterio de aceptación:** Se validan escenarios de carga representativos con métricas por tenant; las cifras acordadas son verificables y no se promete capacidad ilimitada.

### AGR-021 — Operación de APIs y conectores, además de su desarrollo

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 13, 31, 59, 61, 79.

**Qué falta concretar y por qué:** Las APIs y mecanismos externos están definidos, pero falta un contrato operativo uniforme para fallos, cambios de esquema y vencimiento de credenciales.

**Propuesta:** Estandarizar códigos de error, correlación, límites, versiones, reintentos, revocación y manejo de indisponibilidad. Definir cola/bandeja de operaciones detenidas y reconciliación. Evaluar notificaciones a sistemas terceros solo si el caso lo necesita, sin hacer obligatorio un webhook para toda integración.

**Ejemplo:** Un certificado fiscal vence o cambia el formato del archivo: se identifica la integración afectada sin marcar como erróneos todos los socios.

**Criterio de aceptación:** Existe estado observable por conector y tenant, causa accionable y mecanismo de recuperación; los errores públicos no revelan secretos ni detalles internos. Puede evaluarse RFC 9457 como formato [R3].

### AGR-022 — Contrato semántico para dashboards y BI

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 30, 54–55, 59, 75.

**Qué falta concretar y por qué:** La exposición de datos está cubierta, pero no todas las métricas tienen una definición única de fecha, universo y granularidad.

**Propuesta:** Crear un catálogo de indicadores con fórmula, nivel —persona, contrato, factura, pago—, fecha de corte, estado incluido y actualización. Definir exportaciones consistentes y separación real/simulado. Explicar qué significa Facturado, Cobrado, Acreditado y Saldo.

**Ejemplo:** Sumar un resumen de cuenta y sus facturas duplica la deuda; sumar filas por concepto puede duplicar el total de una factura.

**Criterio de aceptación:** El dashboard interno y BI reconcilian para el mismo universo y corte; un conjunto de datos indica granularidad y no mezcla simulaciones sin identificarlas.

### AGR-023 — Expediente documental y conservación de evidencia

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 3, 17, 43, 47, 54, 61, 73, 90–91.

**Qué falta concretar y por qué:** Hay documentos, fotos y firma, pero falta un ciclo transversal de expediente, versión, sustitución, retención y descarga autorizada.

**Propuesta:** Clasificar documentos por finalidad y sensibilidad, relacionarlos con su operación, conservar versión aceptada y determinar quién puede verlos o sustituirlos. Definir retención y archivo según el marco que se releve, sin inventar plazos universales. Proteger descargas fuera de sesión y referencias compartidas.

**Ejemplo:** La foto de una instalación o la firma no debe seguir accesible mediante un enlace antiguo después de revocar una autorización.

**Criterio de aceptación:** Se identifica qué versión de documento respalda una acción y quién la consultó cuando ese acceso sea auditable; no se sustituyen evidencias históricas silenciosamente.

### AGR-024 — Comunicaciones, entrega y constancias

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 26, 43, 47, 50, 52–54, 73.

**Qué falta concretar y por qué:** Se registra el resultado de mensajes, pero falta concretar cuándo una comunicación satisface un hito del proceso y qué hacer si falla.

**Propuesta:** Diferenciar creado, encolado, aceptado por proveedor, entregado y evidencia requerida. Definir destinatario verificado, versión de plantilla, reintento, alternativa de canal y revisión. Separar avisos comerciales, operativos y constancias reguladas; no declarar equivalencia legal de cualquier email.

**Ejemplo:** Una intimación o constancia de baja no se considera cumplida solo porque el proveedor de correo aceptó una solicitud.

**Criterio de aceptación:** El caso conserva contenido, destinatario, fechas y evidencia; un fallo de entrega produce acción y no queda oculto tras Mensaje enviado.

### AGR-025 — Visitas y operación sin conexión con conflictos

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 8, 17, 50, 73, 77.

**Qué falta concretar y por qué:** El trabajo offline y las reservas están mencionados, pero falta resolver reservas simultáneas y cambios del servidor mientras el técnico está desconectado.

**Propuesta:** Definir reserva temporal y confirmada, capacidad del recurso, expiración, reprogramación y asignación. Versionar la tarea descargada y tratar conflictos al sincronizar. Registrar fecha real de intervención y fecha de recepción; no sobrescribir equipos o titulares ya modificados sin revisión.

**Ejemplo:** Un técnico instala un equipo offline mientras la orden fue cancelada en administración: se recibe la evidencia y se revisa el conflicto, en vez de borrar lo realizado o activar sin control.

**Criterio de aceptación:** No hay doble asignación del mismo equipo/turno por carrera; el conflicto conserva ambas evidencias y tiene un responsable de resolución.

### AGR-026 — Valorización, activos y reparación de equipos

**Prioridad:** P1. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 7, 18, 20, 55, 73, 75, 78.

**Qué falta concretar y por qué:** La custodia física está bien desarrollada. Sigue pendiente la relación entre cantidad, costo, activo propio, bien vendido, depreciación y reparación.

**Propuesta:** Definir categorías de material/activo, método de valoración aprobado, costos de ingreso y series/lotes. Gestionar reparación, garantía, reemplazo, baja técnica y disposición. Si hay activo fijo, acordar amortización y su relación contable; no activar ese alcance por inferencia para todo artículo.

**Ejemplo:** Un módem propio en casa del socio no desaparece del patrimonio por salir del depósito; si se vende, su tratamiento comercial/contable es diferente.

**Criterio de aceptación:** Existencias, custodia y valoración pueden conciliarse; el traslado físico no duplica un gasto ni una venta y una sustitución conserva historia.

### AGR-027 — Control de compra, recepción y factura de proveedor

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 19–21, 61, 75, 78.

**Qué falta concretar y por qué:** La vinculación compra-recepción-factura existe, pero faltan tolerancias, excepciones y autorización de diferencias.

**Propuesta:** Comparar cantidades y condiciones de orden, recepción y factura; definir entregas parciales, excesos, devolución, factura anticipada y servicios sin recepción material. Separar quién compra, recibe y aprueba pago y registrar el tratamiento de compras sin orden previa.

**Ejemplo:** Se pidieron diez medidores, llegaron seis y se facturaron diez: el sistema no paga automáticamente como si se hubieran recibido todos.

**Criterio de aceptación:** Cada diferencia está aprobada o pendiente con causa; el pago respeta lo autorizado y los movimientos de stock representan lo físicamente recibido.

### AGR-028 — Presupuestos y compromisos de fondos

**Prioridad:** P2. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 19, 21–22, 55, 75.

**Qué falta concretar y por qué:** Hay proyección y se menciona presupuesto como extensión, pero no se distingue todavía crédito presupuestario, compromiso, obligación y pago.

**Propuesta:** Si el alcance ERP lo requiere, definir presupuestos por servicio/centro, versiones, compromisos de compra y comparación con devengado/pagado. Establecer límites de autorización, excepciones y liberación de compromisos al cancelar. Mantener este alcance como decisión explícita.

**Ejemplo:** Una compra aprobada compromete fondos aunque todavía no exista factura; al cancelarla se libera ese compromiso sin inventar un ingreso.

**Criterio de aceptación:** Los informes distinguen presupuesto, comprometido, devengado y pagado y no suman esos estados como gastos independientes.

### AGR-029 — Capital y relación institucional del asociado

**Prioridad:** P1. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 3, 27, 75, 83.

**Qué falta concretar y por qué:** El módulo institucional menciona aportes, pero el detalle está muy por debajo del de servicios. Puede ser relevante para una cooperativa real.

**Propuesta:** Relevar suscripción/integración de capital, cuotas/aportes, estado institucional, documentación, egreso y eventual devolución según estatuto y marco aplicable. Mantener auxiliar institucional distinto de la deuda por servicios; no inventar obligaciones universales para todas las cooperativas.

**Ejemplo:** Dar de baja Internet no produce automáticamente egreso como asociado ni devolución de capital; cobrar un aporte no lo convierte en ingreso por consumo.

**Criterio de aceptación:** La cooperativa puede explicar relación institucional, capital y servicios por separado; las reglas económicas concretas tienen respaldo y validación contable.

### AGR-030 — Gobierno de la IA y verificación de sus resultados

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 47, 54, 60, 65, 73, 91.

**Qué falta concretar y por qué:** La IA tiene límites bien señalados, pero faltan responsables, versiones, evaluación, evidencia y comportamiento ante falta de disponibilidad.

**Propuesta:** Registrar función permitida, fuente, ámbito de tenant, versión y resultado. Definir cuándo confirma una persona, cómo se corrige y cómo se atiende sin IA. Tratar mensajes y adjuntos como datos que no pueden cambiar permisos ni instrucciones del sistema. Evaluar errores por servicio y derivar casos sensibles.

**Ejemplo:** Una foto o mensaje que pida ignorar instrucciones no habilita al bot a consultar otro tenant; una clasificación incierta deja el caso para supervisión.

**Criterio de aceptación:** Se puede reconstruir qué sugirió la IA y qué decidió el operador; un fallo o respuesta insegura no bloquea la recepción del reclamo ni ejecuta cobros o decisiones clínicas.

### AGR-031 — Moderación y ciclo de vida de la comunidad

**Prioridad:** P2. **Diagnóstico:** No explicitado. **Base:** secciones 26, 46, 65, 82.

**Qué falta concretar y por qué:** La publicación de noticias existe, pero falta definir participación, moderación y tratamiento de contenido denunciado si se habilitan comentarios o aportes.

**Propuesta:** Precisar si el muro es solo editorial o también participativo. Si hay participación, definir quién publica, audiencias, denuncia, ocultamiento, revisión, conservación y respuesta. Distinguir borrar contenido visible de eliminar evidencia; revisar datos personales en fotos y mensajes.

**Ejemplo:** Una publicación dirigida a empleados no se vuelve pública al copiar una plantilla o cambiar el perfil del autor.

**Criterio de aceptación:** No se habilitan comentarios solo por reutilizar Connectyx; las interacciones permitidas y la moderación tienen alcance y responsables definidos.

### AGR-032 — Accesibilidad y autogestión tolerante a errores

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 25, 43, 50, 60, 65, 67, 73.

**Qué falta concretar y por qué:** La personalización visual y de términos no incluye todavía un objetivo verificable de accesibilidad y resolución de formularios incompletos.

**Propuesta:** Proponer WCAG 2.2 nivel AA como objetivo a validar [R1], junto con recorridos simples, teclado, foco, contraste, etiquetas, mensajes claros y alternativas al mapa. Guardar borradores y recuperar carga interrumpida. Validar que los colores del tenant y textos largos no rompan accesibilidad.

**Ejemplo:** Una persona puede solicitar un servicio o pagar sin operar un mapa; un error conserva los datos y señala qué falta sin perder todo el trámite.

**Criterio de aceptación:** Los recorridos esenciales se prueban con teclado y ayudas de acceso; existe alternativa al gesto táctil o componente inaccesible y no se afirma conformidad sin verificación.

### AGR-033 — Ciclo de privacidad, conservación y salida de datos

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 29, 54, 59–60, 64, 77, 83, 90–91.

**Qué falta concretar y por qué:** Se protege el acceso, pero falta un ciclo transversal de finalidad, conservación, solicitudes de personas y salida de la cooperativa.

**Propuesta:** Inventariar categorías de datos, finalidad, responsables, acceso y plazo a validar. Diferenciar corrección de identidad, baja de usuario, archivo contractual y eliminación cuando proceda. Definir exportación de salida y tratamiento de copias/adjuntos; consultar el marco aplicable antes de fijar plazos o excepciones.

**Ejemplo:** Eliminar una cuenta de acceso no puede destruir una factura válida ni el registro de una inhumación; tampoco justifica conservar indefinidamente todo comentario sin criterio.

**Criterio de aceptación:** Existe una decisión documentada por categoría y un procedimiento de atención; las APIs de BI no exponen por defecto información sanitaria o documentos innecesarios.

### AGR-034 — Soporte con acceso temporal y responsabilidad

**Prioridad:** P1. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 42, 54, 60, 64.

**Qué falta concretar y por qué:** El soporte es un diferencial esperado, pero falta definir cómo interviene en datos de una cooperativa y cómo se controla esa capacidad.

**Propuesta:** Establecer solicitud, alcance mínimo, justificación, autorización cuando corresponda, vencimiento, registro y revocación. Diferenciar observar de operar; cualquier acción debe conservar identidad del agente de soporte y del tenant. No resolver mediante compartir contraseñas o impersonación sin rastro.

**Ejemplo:** Para corregir una configuración se habilita una intervención acotada al caso; no se concede a todo soporte acceso permanente a todas las cooperativas.

**Criterio de aceptación:** Cada intervención sensible tiene expediente, alcance y evidencia; vencida la autorización, el agente deja de acceder y el tenant puede consultar las actuaciones permitidas.

### AGR-035 — Entornos, pruebas y evidencias antes de cada entrega

**Prioridad:** P0. **Diagnóstico:** Detalle insuficiente. **Base:** secciones 34, 39–40, 54–55, 60, 69, 73.

**Qué falta concretar y por qué:** Existen escenarios de prueba, pero no una política de entornos ni una matriz de verificación contra requisitos, versiones y riesgos.

**Propuesta:** Separar desarrollo, prueba y producción; identificar datos ficticios y bloquear emisiones/cobros reales desde pruebas. Crear un juego canónico de datos para dos tenants, titulares con domicilio compartido y casos de excepción. Vincular pruebas con requisitos, integraciones y versión liberada.

**Ejemplo:** Una simulación fiscal no utiliza credenciales productivas; actualizar la app no puede sustituir el precio de un contrato por un valor del ejemplo documental.

**Criterio de aceptación:** Cada entrega del piloto tiene evidencia de recorridos críticos, permisos negativos, conciliación e interrupción/reintento; un fallo relevante impide promover la versión hasta resolverlo.

### AGR-036 — Plan de entrega y aceptación de la cooperativa piloto

**Prioridad:** P0. **Diagnóstico:** Pendiente ya identificado. **Base:** secciones 35, 37, 58, 64, 95.

**Qué falta concretar y por qué:** La visión abarca seis dominios y un ERP/CRM completos, pero falta convertirla en entregas aceptables sin intentar desarrollar todo simultáneamente.

**Propuesta:** Definir el alcance final y un piloto de una prestación concreta con una cooperativa real, sin retirar el resto del catálogo objetivo. Incluir plataforma básica, dos tenants de prueba para aislamiento y el recorrido completo elegido. Acordar responsables, documentación, capacitación, soporte de arranque y aceptación por rol.

**Ejemplo:** Un piloto de Internet debe completar contratación, visita, equipo, factura, pago y reclamo; un conjunto de pantallas sin ese ciclo no equivale a un servicio operativo.

**Criterio de aceptación:** Hay una matriz de capacidades incluidas/excluidas por entrega y criterios de aceptación firmables; ninguna fecha o presupuesto se estima como compromiso sin dimensionar el alcance.

## 5. Decisiones de diseño que recomiendo adoptar como hipótesis iniciales

Estas elecciones son propuestas razonadas para contrastar en arquitectura, no decisiones ya tomadas ni instrucciones para implementar un stack particular.

### 5.1. Diseñar módulos con responsabilidades claras antes de distribuirlos

Usaría como punto de partida un diseño modular con interfaces explícitas y procesos de fondo, y compararía su implementación como aplicación modular o componentes separados según volumen, equipo, reutilización de Connectyx y operación. La existencia de ERP, CRM y comunidad no obliga por sí sola a desplegar muchos microservicios.

Una separación temprana que sí considero necesaria es la de responsabilidades: contratación decide sobre contratos; operación confirma actuaciones técnicas; facturación emite documentos; cuenta corriente aplica movimientos; pagos confirma transacciones; contabilidad registra su efecto; CRM coordina expedientes. Separación lógica no significa necesariamente bases o servidores diferentes.

### 5.2. Identidad de acceso y relación de negocio separadas

Evaluaría identidad de acceso común con pertenencias a tenants y perfiles/roles recalculados al seleccionar ámbito. Los registros de personas/asociados de cada cooperativa permanecen privados y no se fusionan por correo o DNI sin una acción autorizada. Esta hipótesis facilita el caso de persona empleada en una cooperativa y socia de otra, sin otorgar acceso cruzado.

### 5.3. Un auxiliar comercial trazable y resúmenes derivados

Mantendría movimientos e imputaciones como fuente del saldo comercial, con integridad definida. Las cuentas por servicio, la vista unificada y el resumen se generan desde esos registros. No guardaría totales editables independientes en cada pantalla que luego deban mantenerse iguales mediante parches.

Los planes contables y escenarios alternativos consumen operaciones identificadas y mantienen su ámbito. No es necesario adoptar una arquitectura completa de event sourcing para lograr esta trazabilidad: debe elegirse el mecanismo más sencillo que conserve integridad, historia y corrección.

### 5.4. Configuración por versiones publicadas, no campos sueltos

Productos, conceptos, reglas, formularios y calendarios deben poder revisarse juntos cuando sus dependencias lo requieran. Copiar configuración entre tenants crea un borrador con correspondencias y validaciones; no un enlace vivo a las condiciones comerciales de la cooperativa origen. Los cambios menores de texto pueden tener un circuito más simple que los tarifarios.

### 5.5. Automatización con estados observables

Mantendría explícitos Pendiente, Confirmado, Fallido y Resultado incierto para integraciones y actuaciones relevantes, con variantes según dominio. Una cola técnica no debería ser la única explicación de por qué un asociado sigue sin servicio o una factura parece impaga.

### 5.6. Autogestión con una tarea principal clara por pantalla

El socio necesita entender qué tiene contratado, cuánto debe, qué está en trámite y qué puede hacer. Priorizaría Mis servicios, Mis facturas y pagos, Mis gestiones y Noticias; los nombres concretos se resuelven mediante el diccionario del tenant. Mostraría estados del trámite y del servicio por separado, y conservaría la alternativa pública de baja cuando corresponda al flujo ya definido.

El empleado necesita una bandeja con siguiente acción, responsable y contexto, no solo una lista de casos con estados. El supervisor necesita pendientes sin asignar y excepciones; el administrador, configuración y control. La jerarquía de navegación debe responder a esas tareas y luego aplicar el perfil de pantallas.

## 6. Cinco escenarios que conviene usar para verificar el diseño

### ESC-01 — Pago excedente de un hermano

Dos hermanos tienen Internet en el mismo domicilio. A debe ARS 13.000 y paga ARS 15.000; B tiene deuda propia. Se confirman ARS 13.000 contra A y quedan ARS 2.000 a favor o pendientes de aplicación según la política aprobada. No se paga la deuda de B automáticamente. Cada movimiento se concilia con fondos e imputación. **Propuestas relacionadas:** AGR-006, 007, 011 y 012.

### ESC-02 — Corrección recibida después de emitir

Se emitió una obligación por ARS 12.000 y después llega evidencia que requiere recalcularla en ARS 15.000. El sistema simula la diferencia de ARS 3.000, solicita el circuito de aprobación y documentación aplicable y conserva el original. No edita su total histórico ni crea otra obligación completa de ARS 15.000 sin resolver la primera. **Relacionadas:** AGR-009, 010, 011, 013 y 015.

### ESC-03 — Instalación offline en conflicto

Una orden se modifica mientras el instalador está sin conexión. Este realizó una intervención y capturó firma/equipo. Al sincronizar se conserva la evidencia y se detecta el conflicto; se decide la situación contractual y financiera con responsabilidad explícita. No se duplica salida de equipo ni se borra lo realizado para igualar estados. **Relacionadas:** AGR-003, 010, 016, 023 y 025.

### ESC-04 — Recuperación con operaciones externas posteriores a la copia

Se restaura información anterior a una confirmación de pago o emisión fiscal. El sistema recupera y concilia identificadores externos, controla sus efectos y reanuda lo pendiente; no envía otra emisión o cobro por considerar que el registro local faltante nunca existió. **Relacionadas:** AGR-011, 016, 018, 019 y 021.

### ESC-05 — Cambio de condiciones en un período parcialmente procesado

Hay un ciclo con documentos ya emitidos, otros pendientes y una modificación tarifaria propuesta. El sistema mantiene el universo y versiones aplicadas, determina el efecto de vigencia sobre pendientes y conserva una explicación de ajustes. Las promociones y simulaciones no reescriben contratos o documentos por el hecho de volver a ejecutar el lote. **Relacionadas:** AGR-009, 010, 015, 017 y 035.

Los importes son ficticios y omiten tributos; las correcciones fiscales concretas se validan con el régimen ya previsto en la base.

## 7. Orden recomendado de trabajo

| Etapa | Trabajo concreto | Salida verificable | Condición para avanzar |
|---|---|---|---|
| A. Consolidación | Catálogo vigente, alcance final/piloto y decisiones abiertas | Requisitos y responsables con trazabilidad | No hay contradicciones bloqueantes sin dueño |
| B. Arquitectura funcional | Identidad, dominios, estados, datos y transacciones | Mapa de responsabilidades y contratos de interacción | Se pueden explicar fallos y recuperación del ciclo |
| C. Núcleo configurable | Tenant, seguridad, catálogo, diccionario y publicación | Dos tenants de prueba con aislamiento y configuración propia | No se mezclan datos ni se publican condiciones incompletas |
| D. Ciclo de servicio piloto | Contratación, actuación técnica, equipo y activación | Recorrido extremo a extremo con excepciones | El estado visible corresponde al hecho real |
| E. Circuito económico | Liquidación, emisión, saldo, cobro, ajustes y conciliación | Control de integridad y cierre de ciclo | Dinero y documentos cuadran por contrato/servicio |
| F. Preparación operativa | Migración, carga, seguridad, recuperación y capacitación | Ensayo de puesta en marcha y acta de aceptación | Se cumplen los criterios acordados y hay soporte de arranque |
| G. Extensión | Otros dominios, capacidades ERP y evolución | Incorporación por servicio con su evidencia | No se copia una regla sin validar su significado y ámbito |

No se asignan semanas, presupuesto, cantidad de desarrolladores ni stack porque no están dimensionados. Las etapas pueden solaparse cuando sus dependencias estén resueltas. El alcance final mantiene los servicios y módulos requeridos; la secuencia evita confundir visión completa con construcción simultánea.

## 8. Agenda de relevamiento para cerrar los faltantes

| Responsable a convocar | Decisiones a resolver | Material útil |
|---|---|---|
| Dirección de producto/plataforma | Alcance SaaS, responsabilidad operativa y entregas | Acuerdos comerciales y objetivos de servicio |
| Administrador del tenant | Roles/perfiles, configuración y circuitos | Organigrama, autorizaciones y casos reales |
| Comercial/atención | Contratación, representaciones y excepciones | Formularios, contratos y reclamos reales anonimizados |
| Facturación/contador | Fechas, reglas, documentos, ajustes y cierres | Cuadros, comprobantes, conciliaciones y criterios de registración |
| Caja/tesorería | Excedentes, no identificados, devoluciones y fondos | Rendiciones, extractos y procedimientos de arqueo |
| Operación técnica/depósito | Agenda, equipos, conflictos y devoluciones | Órdenes, inventario y actuaciones con contingencias |
| Secretaría institucional | Asociación, capital y egreso | Estatuto, registros y documentación validada |
| Soporte/seguridad | Recuperación, acceso de soporte e incidentes | Procedimientos y evidencia de pruebas |
| Responsables por servicio | Reglas específicas y documentos regulatorios | Los insumos ya identificados en la sección 95 de la base |

## 9. Cómo incorporar estas propuestas sin perder control del alcance

1. Revisar las AGR con los responsables de la cooperativa piloto y del producto.
2. Marcar cada propuesta como Aprobada, Ajustar, Diferida o No aplica, con motivo.
3. Para las aprobadas, escribir el requisito canónico y sus criterios en la especificación vigente, manteniendo el ID AGR como origen.
4. Asignar versión de entrega y dependencia; no convertir P0 en una promesa de entregar todo primero.
5. Actualizar modelos de datos, pantallas y pruebas afectados antes de programar el flujo.
6. Mantener el anexo de mensajes originales como evidencia y no sobrescribirlo con redacción interpretada.

### Plantilla de decisión

| Campo | Contenido a completar |
|---|---|
| Propuesta | AGR-XXX |
| Decisión | Aprobada / Ajustar / Diferida / No aplica |
| Redacción acordada | Regla precisa y límite |
| Responsable | Rol y persona que valida |
| Servicio/tenant | Ámbito donde aplica |
| Dependencias | Otras decisiones o componentes |
| Aceptación | Ejemplo verificable y evidencia |
| Entrega | Versión o hito acordado |
| Fecha y motivo | Registro de decisión |

## 10. Referencias y límites de este análisis

La fuente principal es el documento base completo v0.14. Las referencias numéricas de cada AGR permiten ubicar lo ya existente. Este complemento no vuelve a afirmar vigencia de todas las normas de la base ni modifica sus fuentes: la configuración productiva sigue requiriendo los documentos específicos de cada cooperativa.

Se consultaron tres referencias primarias complementarias el 3 de noviembre de 2026:

- **[R1] W3C, WCAG 2.2:** https://www.w3.org/TR/WCAG22/ — referencia para proponer un objetivo verificable de accesibilidad; no se afirma conformidad del producto.
- **[R2] OWASP, Multi-Tenant Security Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html — referencia de revisión para extender el aislamiento a todos los componentes y probar límites; no impone una implementación concreta de base de datos.
- **[R3] IETF, RFC 9457, Problem Details for HTTP APIs:** https://www.rfc-editor.org/rfc/rfc9457.html — posible formato uniforme de errores; no es un sustituto del control interno ni una herramienta para publicar detalles sensibles de depuración.

Las propuestas se apoyan en análisis funcional y diseño del alcance recibido. No se ha inspeccionado el código local de Connectyx, una instalación de ProCoop ni una cooperativa piloto en funcionamiento. Se mantiene la diferencia entre hipótesis de diseño, ejemplos ficticios y decisiones aprobadas.

## 11. Control de la revisión

| Elemento | Resultado |
|---|---|
| Base examinada | Versión 0.14; 96 secciones y 20 mensajes originales |
| Extensión de la base | 52,960 palabras, aproximadamente; no es una estimación de esfuerzo |
| Propuestas | 36 fichas con trazabilidad, prioridad, ejemplo y aceptación |
| P0 / P1 / P2 | 17 / 16 / 3 |
| No explicitado / Detalle insuficiente / Pendiente ya identificado | 2 / 25 / 9 |
| Documento original | Conservado sin modificaciones |
| Estado del complemento | Versión 0.1, pendiente de validación |

La priorización ayuda a decidir qué cerrar y cuándo; no implica agregar todos los elementos a un presupuesto o entrega sin validar su necesidad.
