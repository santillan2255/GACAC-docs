# M09 CRM — CRM y atención (solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot, IA, actividades internas)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | CRM (solución 2: "Atender pedidos, reclamos, solicitudes de alta y baja, comunicaciones y campañas, con chat, bot, IA y supervisión. Coordina expedientes y muestra su avance; no cambia por sí solo contratos ni deudas") |
| Olas | O2 (expediente, bandejas, solicitudes de alta y baja, baja pública), O3 (reclamos e incidentes del piloto Internet con SLA y avisos, cambios de plan/titular/traslado, suspensión, encuesta post-cierre), O6 (reactivación, bandeja omnicanal, WhatsApp entrante, bot de autogestión, IA supervisada, circulares), O7 (reclamos de servicios medidos y regulatorios, trámites con vencimiento), O10 (turnero y agente local, atención presencial completa, mesa de entradas, actividades y calendario, horas y proyectos, IVR/CTI, redes sociales, lectura de adjuntos por IA), O11 (reportes avanzados, migración) |
| Dueño de datos | Casos/expedientes de atención (`crmCases`) y su historial (`crmCaseEvents`), conversaciones, mensajes e interacciones, catálogos de gestión (tipos, subtipos, estados visibles, áreas de atención, prioridades, políticas SLA, reglas de derivación), solicitudes de comando a otros módulos (`crmCommandRequests`), contactos no titulares, incidentes comunes y sus clases, trámites presentados y tipos de trámite, proyectos, registros de tiempo y bolsas de horas, respuestas rápidas, configuración de canales y bot, sugerencias de IA, turnero (turnos, historial, boxes, tipos de box, sesiones, pantallas, reservas), actividades internas (áreas, tipos, frecuencias, rubros, actividades, ocurrencias), calendario interno, modelos y corridas de circulares |
| Fuentes consolidadas | BASE §15, §16, §26, §39.5, §41, §47, §48, §52.3, §53, §57, §63, §98, §101, §105 (solución 2), §106, MER-012, MER-016, ESC-03, ESC-04; AGR-002, AGR-003, AGR-023, AGR-024, AGR-030; DFA M14 (§15 "Carga rápida de reclamos" y mejoras), M21 (§22 completo), M22 (§23 completo); RN-07 §1.10, §1.11, §2, §6, §6.1, §7, §7.1, §8.9, "Reglas adicionales" (reclamos, notificaciones y web), §9 (parámetros), §10 (implicancias 1, 6, 7, 12, 13, 14, 15), §11 (dudas 3, 5, 6, 13); RN-06 §4.3, §23.1 (reclamos, trámites, adjuntos), §23.3; RN-10 §5, §16.1, §16.2 (adjuntos); RN-09 grupos TURNERO, TICKETS, MESA_DE_ENTRADAS, ACTIVIDADES, TECNICA (parámetros de reclamos, vía de ingreso, encuesta), y 2509; FIC 13.2, 13.3, 13.4, 19, 20; CAT §1 (`PTRAMITES`, `TRAMITES`, `TRAMITES_ACCIONES`, `VIAINGTE`), §10 (`RECLAMOS`, `RECLAMOS_HIST`, `RECLAMOS_NOTAS`, `CAT_INCI`, `CLAS_INC`, `PARTIINC`, `FALLAS`, `RESPONSA_NOTIFICA`), §21 (14 tablas), §22 (7 tablas), §23 (10 tablas), §31 y tablas de comunicaciones (referencia a T09), `TABLERO`/`TENDTAB`/`TIPO_TAB`, `AUDIT_IA`, `ADJUNTOS`, `CIRCULAR`; INV `ProMod_Titulares` (frmCirculares, frmConsultaIncidentes, frmNota_Reclamo, frmPTramites, frmReclamosHist, frmTramite, frmTramiteCambioSevicio), `ProMod_Tecnica` (frmCargaRapidaReclamo), `Configuracion` (frmParam_SMS, frmPlantillaEditor, frmDatosTicketsSimple, frmPTramites, frmEnvioWhatsApp, frmEnvioWhatsAppTrii, frmEnviar_SMS), `ProcoopNet` (frmEncuestas); CNX §2.3, §2.4, §2.6, §2.7, §3.3, §3.7, §4.2, §4.4 (Trámites: Solicitudes, Tipos, Estados, Workflows), §4.5, §6.2, §6.3, §7.7, §8, §10 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Centralizar en un **expediente único por gestión** toda la atención que la cooperativa brinda a sus socios, usuarios no asociados, solicitantes sin cuenta y terceros (organismos, juzgados, proveedores que presentan notas), cualquiera sea el canal de ingreso (portal y app del socio, WhatsApp, email, SMS, teléfono/IVR, chat web, redes sociales, ventanilla con o sin turnero, mesa de entradas, bot), con:

- **casos trazables** con número de seguimiento que el socio consulta y el personal atiende (BASE §47 CRM-001 a CRM-010);
- **solicitudes comerciales** de cualquier servicio del catálogo del tenant: alta, baja (incluida la recepción pública sin registro), suspensión temporal, reactivación, cambio de titular, cambio de plan/categoría, traslado, cambio de equipo o medidor, adhesiones y actualizaciones de datos (BASE §15, §48, §53);
- **reclamos e incidentes** con SLA, prioridad, avisos al socio de cada cambio de estado, agrupación de afectados en un incidente común, duplicados, reapertura, reincidencia y satisfacción (BASE §16, DFA M14 mejoras);
- **bandejas** de supervisión, de área y personales, con derivación por supervisores y resolución por empleados autorizados;
- **canales y bot** de autogestión (WhatsApp Business con plantillas, MER-016) e **IA supervisada** que solo propone (AGR-030, CNX §4.2);
- **historial unificado** de interacciones ligado a persona, cuenta y servicio (DFA M21 mejora "CRM unificado");
- **atención presencial y turnero** (áreas, boxes, llamados, derivaciones, estadísticas, turno online, pantallas y hardware vía agente local);
- **mesa de entradas** documental y **actividades/tareas internas** recurrentes con recordatorios y tablero de control;
- **circulares** y uso de plantillas de correspondencia, delegando el motor de envío en T09.

El CRM **coordina y muestra el avance**: toda modificación de contratos, deudas, comprobantes, órdenes de trabajo o padrón se **solicita por comando** al módulo dueño (M01, M02, M05, M07, M08, M10, M11, M17) y el caso refleja el resultado real (AGR-002).

## 2. Límite y responsabilidades

### 2.1 Qué hace

| Responsabilidad | Detalle |
|---|---|
| Expediente de atención | Alta, clasificación, contexto (persona, cuenta, servicio, contrato, inmueble, comprobante), conversación, notas internas, adjuntos (vía T11), derivación, asignación, SLA, resolución, cierre, reapertura, vínculos con otras entidades. |
| Solicitudes comerciales | Recepción, requisitos por prestación, documentación faltante, aprobación (vía workflow T11), emisión de **comandos** a los módulos dueños, seguimiento del resultado, fecha solicitada y fecha efectiva, constancias. |
| Reclamos e incidentes | Tipificación de atención, prioridad, SLA, duplicados, incidente común con afectados, comunicación a afectados (vía T09), conformidad, encuesta post-cierre (vía T09), reincidencias. |
| Bandejas y tickets | Bandejas de supervisión, área y personal; cola personal; tomar/pausar/soltar; espera del cliente; estados visibles configurables mapeados a estados base; prioridad/gravedad; contactos; registro de tiempo; proyectos; bolsas de horas bonificadas. |
| Canales | Configuración de canales de atención del tenant, recepción de mensajes entrantes (webhooks vía T06), bandeja omnicanal, enrutamiento a casos, bot de autogestión, traspaso a humano. |
| IA supervisada | Clasificación, resumen, sugerencia de respuesta, lectura de adjuntos, detección de duplicados/incidentes, intención del bot; registro de cada sugerencia y decisión humana. |
| Historial unificado | Toda interacción (entrante o saliente, cualquier canal) ligada a persona/cuenta/servicio y, si corresponde, al caso. |
| Atención presencial y turnero | Emisión de turnos, áreas, boxes, llamados, derivaciones, pantallas, tótem, turno online y reservas, estadísticas; uso del agente local de T06 para hardware. |
| Mesa de entradas | Registro de notas, oficios, cédulas y documentación recibida con número de expediente, pases internos, plazos, salidas. |
| Trámites con vencimiento | Tipos de trámite y trámites presentados por socio/cuenta/servicio con vencimiento y acciones tipadas al alta y al vencimiento. |
| Actividades internas | Áreas, tipos, frecuencias, rubros, actividades, ocurrencias, recordatorios, preventivas, calendario interno, indicadores para el tablero de control. |
| Circulares | Modelos de circular y corridas de generación sobre universos filtrados, con salida por impresión, email, SMS o WhatsApp a través de T09. |

### 2.2 Qué NO hace

- **No** activa, suspende, reactiva, transfiere ni da de baja contratos (M02), no cambia titulares ni domicilios (M01), no emite ni anula comprobantes (M05), no imputa ni cancela deuda (M07), no suspende ni reconecta por mora (M08), no crea ni cierra órdenes de trabajo (M10), no presupuesta (M11), no da de baja asociados (M17). Solo **solicita** y refleja (AGR-002).
- **No** es el motor de workflow/estados genérico ni el expediente documental: los **usa** (T11).
- **No** es el motor de comunicaciones, plantillas, audiencias, preferencias de contacto ni encuestas: los **usa** (T09).
- **No** gestiona la agenda de visitas, cuadrillas ni órdenes de trabajo (M10), ni el portal del socio (M19), que consume los endpoints de §11 de este anexo.
- **No** tasa llamadas telefónicas ni gestiona centrales (`LLAMADAS`, `TIPOLLAM`, `ENTRANTE` → M10 telefonía).
- **No** brinda la mesa de ayuda del proveedor SaaS hacia las cooperativas (soporte de plataforma → T01); ver CTR-CRM-01.
- **No** implementa oportunidades, embudos de venta ni campañas comerciales (BASE §47 los deja pendientes de relevamiento; PA-CRM-16). Las campañas de comunicación masiva están en T09.

### 2.3 Qué delega y a quién

| Necesidad | Módulo responsable | Interfaz desde CRM |
|---|---|---|
| Alta, baja, suspensión, reactivación, cambio de plan/categoría de contrato | M02 CAT | Comandos `cat.contract.*` vía `crmCommandRequests`; eventos de resultado |
| Cambio de titular, traslado de domicilio, actualización de datos de persona/cuenta | M01 PER | Comandos `per.*`; eventos |
| Factibilidad, visita, OT de reclamo, instalación, retiro de equipo, conformidad de campo | M10 TEC | Comando `tec.workOrder.request`; eventos `tec.workOrder.*` |
| Ajuste/nota de crédito por reclamo de factura, segunda vía, proporcionales, cargos | M05 FAC | Comandos `fac.*` (siempre con aprobación T11 cuando corresponda) |
| Consulta de saldo, link de pago, plan de pagos | M07 COB / M08 MOR | Consultas de solo lectura y comandos `cob.paymentLink.create`, `mor.paymentPlan.request` |
| Presupuesto vinculado al caso | M11 VEN | Comando/consulta `ven.quote.*` |
| Baja de asociado (no automática) | M17 INS | Comando `ins.membership.requestExit` |
| Workflow de aprobación, estados genéricos, expediente documental, adjuntos | T11 WFL | Definiciones de flujo, `approvals`, `documents` |
| Envío de avisos, plantillas, preferencias, audiencia, encuestas, constancias | T09 COM | `communications`, `communicationTemplates`, `surveys` |
| Credenciales de canales, webhooks entrantes, agente local, proveedores IA/WhatsApp/SMS/IVR | T06 INT y bóveda de T01 | Adaptadores por proveedor |
| Feriados, calendarios hábiles, geografía, numeradores | T04 CFG | Servicios compartidos |
| Indicadores, salas BI y tablero de control | T10 BIA | Proyecciones y eventos del CRM |
| Retención, anonimización, seguridad, rate limiting | T08 NFR | Políticas transversales |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| Caso / expediente | Unidad única de gestión con número de seguimiento, contexto, conversación, historial y resultado. Puede ser solicitud, reclamo, consulta, pedido, mesa de entradas u otro tipo configurado. | `dict:crm.case` | `TICKETS` (mesa de ayuda), `RECLAMOS`, `TECNICA` con `RECLAMO = true`, `PTRAMITES` |
| Número de seguimiento (ticket) | Identificador visible del caso, único por tenant, que se comunica al socio. | `dict:crm.case.number` | `COD_TICKET`, `COD_SLS`, `COD_REC` |
| Tipo de gestión | Clase principal del caso (Solicitud de alta, Reclamo técnico, Consulta, etc.) con reglas, requisitos, SLA y flujo. | `dict:crm.caseType` | `TICKETS_TIPOS`, `TRAMITES`, `TRANSAC` de reclamo |
| Subtipo / motivo | Detalle del tipo (Sin conexión, Lentitud, Pérdida de agua…), con plantillas, causa y bloqueo de cierre. | `dict:crm.caseSubtype` | `TICKETS_SUBTIPOS`, `RUB_REC` |
| Estado base | Estado normalizado del caso que gobierna reglas (recibido, derivado, en tratamiento, resuelto, cerrado…). | `dict:crm.status.base` | `COD_ESTADO_BASE` (1 Pendiente, 2 En proceso, 3 Cerrado, 4 Cancelado) |
| Estado visible | Estado que el tenant nombra y ordena, mapeado a un estado base, con banderas de comportamiento. | `dict:crm.status.visible` | `TICKETS_ESTADOS` |
| Conjunto de estados | Grupo ordenado de estados visibles asignado a tipos de gestión. | `dict:crm.statusSet` | `TICKETS_TIPOSESTADOS` |
| Prioridad / gravedad | Nivel de urgencia: Crítica, Alta, Normal, Baja, Muy baja, Sin asignar. | `dict:crm.priority` | Gravedad de tickets (0, 1, 25, 50, 75, 100) |
| Área de atención | Unidad organizativa que recibe derivaciones, atiende turnos y/o es responsable de actividades. | `dict:crm.area` | `TUR_AREAS`, `ACT_AREAS`, áreas de derivación |
| Bandeja de supervisión | Vista donde ingresan los casos para revisión, clasificación y derivación. | `dict:crm.inbox.supervision` | — (nuevo, BASE §47 CRM-007) |
| Derivación | Asignación del caso a un área por un supervisor (o por regla habilitada). | `dict:crm.derivation` | — |
| Asignación | Designación del responsable individual dentro del área. | `dict:crm.assignment` | `TICKETS_ASIGNACIONES` |
| Tomar / pausar / soltar | Marcar el caso en el que el empleado trabaja activamente; registra tiempo. | `dict:crm.case.take` | `TomarTicket`, `PausarTicket`, `SoltarTicket` |
| Espera del socio | Estado en que se aguarda una acción del socio; pausa el SLA si la política lo indica. | `dict:crm.status.waitingCustomer` | `ESPERA_CLIENTE` |
| SLA | Política de tiempos objetivo (primera respuesta, resolución) con calendario, pausas, alertas y escalamiento. | `dict:crm.sla` | — (no existe; `TECNICA.VENCE`, `FEC_VENC`) |
| Incidente común | Evento que afecta a varios socios (falla zonal) con una sola gestión técnica y casos individuales vinculados. | `dict:crm.incident` | `CLAS_INC`, `PARTIINC`, consulta de incidentes |
| Afectado | Cuenta/servicio alcanzado por un incidente, con o sin reclamo propio. | `dict:crm.incident.affected` | — |
| Comando | Pedido tipado que el CRM envía al módulo dueño para que ejecute un cambio, con resultado trazable. | `dict:crm.commandRequest` | `TRAMITES_ACCIONES` (SQL libre) |
| Conversación | Hilo de mensajes por canal (WhatsApp, chat, email, llamada). | `dict:crm.conversation` | — |
| Mensaje visible / nota interna | Mensaje que ve el socio / anotación solo para personal. | `dict:crm.message.public` / `dict:crm.message.internal` | `TICKETS_NOTAS.INTERNA`, `RECLAMOS_NOTAS` |
| Interacción | Registro de cada contacto con la persona (canal, dirección, motivo, resultado), con o sin caso. | `dict:crm.interaction` | — (DFA "CRM unificado") |
| Canal / medio de atención | Vía por la que ingresa o sale una interacción. | `dict:crm.channel` | `TICKETS_MEDIOSATENCION`, `VIAINGTE` |
| Bot de autogestión | Asistente conversacional que resuelve consultas y abre casos. | `dict:crm.bot` | `GetCuentasDniBot`, `GetReclamosBot`, `GetCuentaCodigoBot` |
| Sugerencia de IA | Propuesta registrada (clasificación, resumen, respuesta, extracción) pendiente de decisión humana. | `dict:crm.aiSuggestion` | `clsAnalisisNotasTicket`, `AUDIT_IA` |
| Contacto | Persona de contacto del caso distinta del titular (inquilino, administrador, apoderado). | `dict:crm.contact` | `TICKETS_CONTACTOS` |
| Proyecto | Agrupador de casos de un mismo esfuerzo (obra, migración, implementación TIC). | `dict:crm.project` | `TICKETS_PROYECTO`, `TICKETS_MODULOS` |
| Bolsa de horas | Horas bonificadas por período o por venta, que se consumen con los registros de tiempo. | `dict:crm.hourBank` | `TICKETS_HSBONIF`, `BONIF_SOPORTE`, `BONIF_VENTA` |
| Mesa de entradas | Registro de documentación recibida/emitida con número de expediente y pases internos. | `dict:crm.deskEntry` | Mesa de Entradas (DFA M21), MER-016 |
| Trámite presentado | Documento o gestión con vencimiento ligado a socio/cuenta/servicio (ej. constancia para tarifa social). | `dict:crm.procedureRecord` | `PTRAMITES` |
| Tipo de trámite | Definición con días de vencimiento, plantilla y acciones. | `dict:crm.procedureType` | `TRAMITES`, `TRAMITES_ACCIONES` |
| Turno | Ticket de fila presencial o virtual en un área. | `dict:crm.queueTicket` | `TURNOS` |
| Box | Puesto de atención que llama turnos. | `dict:crm.queueDesk` | `TUR_BOX`, `TUR_TIPO_BOX` |
| Pantalla de turnos | Display público con los últimos llamados. | `dict:crm.queueDisplay` | Pantallas por parámetro 2007 |
| Reserva de turno | Turno online con día y hora para un área. | `dict:crm.queueAppointment` | — (DFA mejora "turno online") |
| Agente local | Programa instalado en una PC del tenant que conecta dispositivos (impresora térmica, turnero serie) con la nube (T06). | `dict:int.localAgent` | `clsTurnero.EscucharPuerto`, `Impresoras.Masung_D347` |
| Actividad interna | Tarea programada recurrente o manual con responsable, márgenes y recordatorios. | `dict:crm.activity` | `ACTIV` |
| Ocurrencia | Instancia fechada de una actividad. | `dict:crm.activityOccurrence` | `ACTIV_SEG` |
| Actividad preventiva/previa | Actividad vinculada que debe cumplirse antes o como prevención de otra. | `dict:crm.activity.prerequisite` | `ACTIPREV` |
| Circular | Modelo de comunicación masiva con filtros de universo, firma y canal. | `dict:crm.circular` | `CIRCULAR`, frmCirculares |
| Respuesta rápida | Texto predefinido con variables para responder casos. | `dict:crm.quickReply` | `PLANTILLA` del tipo/subtipo de ticket |
| Constancia | Comprobante de recepción de una solicitud (ej. baja) con código identificador. | `dict:crm.receipt` | — (BASE §52.3) |

## 4. Actores, permisos y alcance

| Rol | Capabilities principales | Alcance de datos |
|---|---|---|
| Socio / usuario autenticado (PWA, portal) | `crm.misCasos.ver`, `crm.misCasos.crear`, `crm.misCasos.responder`, `crm.misCasos.adjuntar`, `crm.misCasos.cancelar`, `crm.turnos.reservar`, `crm.encuestas.responder` (antes `crm.encuesta.responder`) | Propios: solo personas/cuentas/servicios que tiene autorizados en el tenant (M01, T02) |
| Solicitante público (sin login) | Ninguna capability; endpoints `/api/public/<tenantSlug>/crm/*` con rate limiting y captcha | Solo puede crear la solicitud y consultar su estado con número + código de verificación; nunca ve datos privados |
| Bot (principal de servicio) | `crm.bot.ejecutar` (crear caso, consultar estado), lecturas delegadas `cob.cuentaCorriente.ver` (antes `cob.saldo.consultar`), `fac.comprobantes.reimprimir` (antes `fac.comprobante.segundaVia`) en nombre del socio verificado | Socio verificado en la sesión; un tenant |
| Agente de atención (front, ventanilla, teléfono, chat) | `crm.casos.ver`, `crm.casos.crear`, `crm.casos.editar`, `crm.casos.responder`, `crm.conversaciones.atender`, `crm.interacciones.crear`, `crm.ia.usar`, `crm.respuestasRapidas.usar` | Sucursales y servicios asignados |
| Supervisor de atención | Todo lo del agente + `crm.bandejaSupervision.ver`, `crm.casos.derivar`, `crm.casos.asignar`, `crm.casos.reclasificar`, `crm.casos.cerrar`, `crm.casos.reabrir`, `crm.casos.anular`, `crm.casos.fusionar`, `crm.casos.aprobar`, `crm.incidentes.crear`, `crm.incidentes.editar`, `crm.sla.excepcionar`, `crm.casos.exportar` | Tenant o sucursales/servicios asignados |
| Empleado de área (resolutor) | `crm.casos.ver`, `crm.casos.responder`, `crm.casos.tomar`, `crm.casos.resolver`, `crm.casos.devolver`, `crm.comandos.solicitar`, `crm.horas.registrar` | Casos de sus áreas o asignados a él |
| Operador de reclamos | `crm.casos.*` sobre tipos de reclamo, `crm.incidentes.ver`, `crm.incidentes.vincular`, `crm.cargaRapida.usar` | Servicios y zonas asignados |
| Recepcionista (turnero) | `crm.turnero.emitir`, `crm.turnero.ver`, `crm.interacciones.crear` | Sucursal |
| Operador de box (incluye cajero que atiende turnos) | `crm.turnero.box.abrir`, `crm.turnero.llamar`, `crm.turnero.derivar`, `crm.turnero.finalizar` | Áreas asignadas (`TUR_AREAS_USERS`) |
| Operador de mesa de entradas | `crm.mesaEntradas.ver`, `crm.mesaEntradas.crear`, `crm.mesaEntradas.pasar`, `crm.mesaEntradas.registrarSalida` | Tenant |
| Responsable de actividades | `crm.actividades.ver`, `crm.actividades.cerrar`, `crm.actividades.crear` | Propias o de su área |
| Administrador de CRM | `crm.config.tipos.configurar`, `crm.config.estados.configurar`, `crm.config.areas.configurar`, `crm.config.sla.configurar`, `crm.config.reglas.configurar`, `crm.canales.configurar`, `crm.bot.configurar`, `crm.ia.configurar`, `crm.turnero.configurar`, `crm.actividades.configurar`, `crm.circulares.configurar`, `crm.tramites.configurar`, `crm.respuestasRapidas.configurar` | Tenant |
| Operador de comunicaciones | `crm.circulares.ver`, `crm.circulares.generar`, `crm.circulares.aprobar` | Tenant (audiencia acotada a su alcance, CNX §8) |
| Auditor | `crm.casos.ver`, `crm.ia.auditar`, `crm.reportes.ver`, `crm.casos.exportar` (solo lectura) | Tenant |
| Soporte de plataforma | Acceso temporal y auditado (T01/T02); nunca escribe en casos salvo autorización explícita | Tenant autorizado |

Reglas de permisos: (a) el alcance efectivo es la unión de alcances del rol y del usuario (CNX §2.4); (b) `crm.notasInternas.ver` es requisito para ver notas internas y `crm.notasRestringidas.ver` para las marcadas como restringidas (PA-CRM-10); (c) los casos de servicios sociales sensibles (salud, sepelio, M18) requieren además `crm.casosSensibles.ver`; (d) ningún rol del CRM tiene capabilities de escritura sobre contratos, deuda u órdenes: solicita comandos.

## 5. Requisitos funcionales

### 5.1 Expediente, bandejas y tickets

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-001 | Crear casos con número de seguimiento único por tenant, visible al socio y al personal. | BASE §16, §47 CRM-001, CRM-003 | Núcleo | O2 | Informado | Al crear se devuelve el número; dos tenants pueden tener el mismo número sin colisión; el número nunca se reutiliza. |
| RF-CRM-002 | Admitir tipos de gestión ampliables: solicitud comercial, reclamo técnico, reclamo comercial/de facturación, consulta, pedido, mesa de entradas, sugerencia/felicitación y otros que configure el tenant. | BASE §47 CRM-010, §15 | Núcleo | O2 | Informado | El tenant crea un tipo nuevo sin despliegue; los casos existentes conservan su tipo histórico. |
| RF-CRM-003 | Vincular el caso con persona, cuenta, servicio contratado, contrato/suministro, inmueble y comprobante cuando corresponda, validando la pertenencia. | BASE §47 CRM-004, §16, §15 | Núcleo | O2 | Informado | Un socio no puede elegir una cuenta que no tiene autorizada (403); el agente ve la advertencia si la cuenta no pertenece a la persona. |
| RF-CRM-004 | Registrar solicitudes de servicios aún no contratados con el servicio solicitado, sin inventar cuenta ni contrato; vincular el contrato cuando M02 lo cree. | BASE §47, §48 | Núcleo | O2 | Informado | El caso guarda `requestedServiceId` sin `contractId`; al recibir `cat.contract.requested` (EVT-CAT-06) con la correlación, el caso queda vinculado. |
| RF-CRM-005 | Registrar canal de origen y vía de ingreso de cada caso; vía por defecto configurable y opcionalmente obligatoria; validar celular/email según la vía. | CAT `VIAINGTE`; RN-09 333, 2629; RN-07 §1 (`COD_VIA`) | Núcleo | O2 | Adoptado | Sin vía, si es obligatoria, el alta falla con error de validación; la vía que exige validar celular solicita OTP. |
| RF-CRM-006 | Adjuntar fotografías y documentos al caso desde cualquier canal, con almacenamiento privado, versión y control de acceso (T11). | BASE §16, §47 CRM-006, AGR-023 | Núcleo | O2 | Informado | La URL de descarga es firmada y expira; revocar acceso invalida enlaces previos; no se sustituye un adjunto: se agrega versión. |
| RF-CRM-007 | Conservar la conversación del caso distinguiendo mensajes visibles al socio y notas internas. | BASE §16, §47 | Núcleo | O2 | Informado | El socio nunca recibe una nota interna por ningún endpoint ni notificación. |
| RF-CRM-008 | Bandeja de supervisión por tenant con filtros por servicio, tipo, subtipo, estado, área, prioridad, antigüedad, responsable, canal, SLA y vistas de "sin clasificar" y "sin derivación". | BASE §47 CRM-007 | Núcleo | O2 | Informado | Todo caso nuevo aparece en la vista "sin derivación" hasta ser derivado; los filtros se combinan y se guardan como vista. |
| RF-CRM-009 | Derivar el caso a un área con motivo; al cambiar de área se conserva el mismo expediente e historial. | BASE §47 CRM-008, CU-CRM-01 | Núcleo | O2 | Informado | Tras dos derivaciones el número y el historial son los mismos y el timeline muestra ambas. |
| RF-CRM-010 | Asignar y reasignar responsable dentro del área, con historial de asignaciones y aviso al asignado. | BASE §47; CAT `TICKETS_ASIGNACIONES`; RN-07 §6.1 (`AsignarTicket`) | Núcleo | O2 | Adoptado | Cada asignación queda en `crmCaseEvents` con quién asignó, a quién y cuándo; el asignado recibe aviso in-app/push. |
| RF-CRM-011 | Bandeja del área y bandeja personal con el contexto completo del caso según permisos. | BASE §47 CRM-009 | Núcleo | O2 | Informado | Un empleado ve solo casos de sus áreas o asignados; intentar abrir otro devuelve 404. |
| RF-CRM-012 | Devolver el caso a supervisión o rechazar la derivación con motivo. | BASE §47 pendientes | Estándar | O2 | Adoptado | El caso vuelve a "sin derivación" con el motivo registrado. |
| RF-CRM-013 | Mantener historial completo e inmutable de atención: estados, derivaciones, asignaciones, cambios de clasificación, mensajes, comandos, SLA, sugerencias de IA. | BASE §16, AGR-003 | Núcleo | O2 | Informado | No existe endpoint de edición/borrado de eventos; la reconstrucción del caso a una fecha es posible. |
| RF-CRM-014 | Vincular el caso con órdenes de trabajo, contratos, comprobantes, pagos, presupuestos, incidentes y otros casos. | BASE §15, §47 | Núcleo | O2 | Informado | Desde el caso se navega a cada entidad vinculada con permisos del módulo dueño. |
| RF-CRM-015 | Solicitar datos o documentación faltante, con lista de faltantes, plazo y recordatorio; mantener el caso pendiente y explicado. | BASE §15, CU-15 | Núcleo | O2 | Informado | El socio ve qué falta; al completar, el caso vuelve a revisión; si vence el plazo, se aplica la política del tipo (recordar o cancelar por desistimiento con aviso). |
| RF-CRM-016 | Informar al solicitante el estado del caso y avisarle cada cambio de estado configurado como notificable, por el canal preferido (T09). | BASE §15; DFA M14 mejoras ("aviso al socio de cada cambio de estado") | Núcleo | O2 | Informado | Cada transición marcada `notifyCustomer` genera una comunicación T09 con resultado de entrega visible en el caso. |
| RF-CRM-017 | Controlar vencimientos del caso (fecha compromiso) y del SLA. | BASE §15 | Núcleo | O3 | Informado | Los casos vencidos aparecen en la vista "vencidos" y generan alerta. |
| RF-CRM-018 | Registrar resolución, resultado real de las acciones y conformidad del socio. | BASE §15, §47 paso 8 | Núcleo | O2 | Informado | No se puede pasar a "resuelto" sin texto de solución y código de resolución. |
| RF-CRM-019 | Medir tiempos de atención: primera respuesta, tiempo en cada estado, tiempo en cada área, tiempo total, tiempo pausado. | BASE §15, §26 | Núcleo | O3 | Informado | El reporte de tiempos coincide con la suma de intervalos del historial. |
| RF-CRM-020 | Detectar y asociar casos duplicados; fusionar conservando ambos historiales. | BASE §16; RN-07 §1 (ventana 90 días) | Núcleo | O3 | Informado | Al crear un caso con misma cuenta+servicio+subtipo abierto en la ventana, se propone el vínculo; fusionar deja el secundario "fusionado" apuntando al principal. |
| RF-CRM-021 | Reabrir casos resueltos o cerrados con motivo, dentro de la ventana configurada. | BASE §16, BASE §39.5 (Reabierto) | Núcleo | O3 | A validar (PA-CRM-05) | La reapertura conserva número y suma un ciclo; fuera de ventana se crea caso nuevo vinculado. |
| RF-CRM-022 | Identificar recurrencias y reincidencias por cuenta, cuenta+servicio y cuenta+servicio+tipo. | BASE §16; RN-07 §1.10, §1.11 | Estándar | O3 | Informado | El informe devuelve grupos con más de un caso en el período. |
| RF-CRM-023 | Clasificar por prestación (servicio), motivo, prioridad y ubicación (domicilio, zona, localidad, nodo de red). | BASE §16 | Núcleo | O2 | Informado | Los cuatro ejes son filtrables en bandejas y reportes. |
| RF-CRM-024 | Prioridad/gravedad con niveles Sin asignar, Crítica, Alta, Normal, Baja, Muy baja y su orden numérico. | RN-07 §6 (gravedad 0/1/25/50/75/100) | Núcleo | O2 | Adoptado | La bandeja ordena por prioridad y vencimiento; la prioridad inicial sale del subtipo y es corregible por supervisor. |
| RF-CRM-025 | Contactos del caso distintos del titular (nombre, teléfono, celular, email, observación, vínculo), sin datos de acceso remoto ni contraseñas. | CAT `TICKETS_CONTACTOS`; RN-07 §6 (⚠ credenciales) | Estándar | O2 | Adoptado | El modelo no tiene campos de credenciales; la migración los descarta. |
| RF-CRM-026 | Unificar contactos duplicados conservando el más antiguo, reapuntando casos y auditando. | RN-07 §6.1 (`UnificarContactos`) | Estándar | O10 | Adoptado | Tras unificar, los casos apuntan al contacto conservado y el otro queda marcado `mergedInto`. |
| RF-CRM-027 | Cola personal ordenable: el empleado reordena sus casos (al primer lugar o intercambio con el vecino). | RN-07 §6.1 (`CambiarOrden`) | Estándar | O6 | Adoptado | El orden persiste por usuario y no altera el de otros. |
| RF-CRM-028 | Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. | RN-07 §6, §6.1 | Estándar | O6 | Adoptado | Tomar un segundo caso exige pausar o soltar el primero; el tiempo tomado se registra como worklog. |
| RF-CRM-029 | Alternar "en espera del socio" con su efecto sobre el SLA. | RN-07 §6.1 (`ESPERA_CLIENTE`) | Núcleo | O3 | Adoptado | En espera, el reloj SLA se pausa si la política lo indica; al responder el socio, vuelve a "en tratamiento". |
| RF-CRM-030 | Listados agrupados por vencimiento: Vencidos, Hoy, Mañana, Próximos 7 días, Futuro, Sin fecha. | RN-07 §6.1 (`GetListaTickets`) | Estándar | O3 | Adoptado | Los grupos suman el total de la bandeja. |
| RF-CRM-031 | Cierre con tipo de cierre (Conforme, Conforme con observaciones, Sin solución, Improcedente), causa obligatoria si el subtipo la exige, bloqueo de cierre por subtipo, nota de cierre, validación interna y validación del socio. | RN-07 §6, §6.1 (`BLOQUEAR_CIERRE`, `REGISTRA_CAUSA`, `ValidaTicket`) | Núcleo | O2 | Adoptado | Un subtipo con bloqueo impide cerrar hasta liberar; sin causa, cuando se exige, el cierre falla. |
| RF-CRM-032 | Recuperar casos cerrados o cancelados dejando nota; desde cancelado vuelve al último estado previo no final. | RN-07 §6, §6.1 | Estándar | O3 | Adoptado | La recuperación queda en el historial con la nota y respeta la ventana de reapertura. |
| RF-CRM-033 | Notas internas automáticas al cambiar vencimiento, prioridad o subtipo; aviso de reprogramación al contacto cuando cambia la fecha compromiso. | RN-07 §6.1 (`CambiosAlReasignar`) | Estándar | O3 | Adoptado | Cada cambio genera nota automática; el aviso al contacto se envía si tiene canal y no optó por no recibirlo. |
| RF-CRM-034 | Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. | RN-07 §6.1 (`CancelarTicket`); BASE §48 pendientes (desistimiento) | Núcleo | O2 | Adoptado | Al cancelar con presupuesto vinculado se pide la decisión y se emite el comando a M11. |
| RF-CRM-035 | Vista 360 del socio con historial unificado de interacciones, casos, turnos, comunicaciones y encuestas, ligada a persona, cuenta y servicio. | DFA M21 mejoras ("CRM unificado") | Núcleo | O2 | Adoptado | Desde la ficha de la persona o cuenta se ve el timeline completo con filtros por canal y servicio. |
| RF-CRM-036 | Búsqueda global por número de caso, persona, documento, cuenta, teléfono, email, número de expediente de mesa de entradas. | CNX §4.2 (mapa del sitio y buscador); BASE §47 | Núcleo | O2 | Adoptado | La búsqueda respeta alcance; un teléfono devuelve las personas vinculadas. |
| RF-CRM-037 | Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). | BASE §47 CRM-001, CRM-003; §48 | Núcleo | O2 | Informado | El socio solo ve casos de sus cuentas o creados por él. |
| RF-CRM-038 | Denegar el acceso si la cuenta elegida no pertenece al socio; si no sabe identificarla, pedir aclaración sin bloquear la recepción. | CU-CRM-01 (excepciones) | Núcleo | O2 | Informado | Se crea el caso con "cuenta a identificar" y queda en supervisión. |
| RF-CRM-039 | Numeración configurable: continua por tenant, por servicio y año, por tipo, o por reclamo/no reclamo; formato con prefijo. | RN-09 344, 2998, 3031; RN-07 §2 | Estándar | O2 | Adoptado | Cambiar la política aplica a casos nuevos; los números emitidos no cambian; numeración atómica sin colisiones. |
| RF-CRM-040 | Proyectos que agrupan casos, con componentes/módulos afectados. | CAT `TICKETS_PROYECTO`, `TICKETS_MODULOS` | Extensión | O10 | A validar (PA-CRM-12) | Un caso puede pertenecer a un proyecto y declarar componente; el proyecto muestra avance. |
| RF-CRM-041 | Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). | CAT `TICKETS_NOTAS`, `TICKETS_HSBONIF`, `TICKETS_RESPONSABLES`; RN-07 §6 (facturación de horas); RN-09 2488 | Extensión | O10 | A validar (PA-CRM-12) | La suma de worklogs coincide con minutos reales; descuento de bolsa antes de facturar; la facturación se pide por comando con `Idempotency-Key`. |
| RF-CRM-042 | Vincular un presupuesto (M11) al caso y derivar la fecha compromiso del presupuesto. | RN-07 §6.1 (`RelacionarPresupuesto`, `ModificarVencimientoTicket`) | Estándar | O6 | Adoptado | Con presupuesto aceptado, vencimiento = hoy + (fecha de entrega − fecha de validez) días, 30 por defecto; si no, la fecha de validez. |
| RF-CRM-043 | Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo, pausa SLA, final. | CAT `TICKETS_ESTADOS`, `TICKETS_TIPOSESTADOS`; CNX §4.4 (Estados, Workflows) | Núcleo | O2 | Adoptado | No se puede guardar un conjunto sin un estado por cada estado base obligatorio; las transiciones se validan contra T11. |
| RF-CRM-044 | Paso opcional de verificación por un usuario distinto del resolutor antes del cierre. | RN-07 §6 (`TESTING`, tester, 2 días hábiles) | Extensión | O10 | Adoptado | Si el estado destino es de verificación, se exige verificador distinto y se fija fecha estimada (2 días hábiles por defecto). |
| RF-CRM-045 | Exportar bandejas a XLSX/CSV/PDF según capability. | CNX §4.6 (DataTable) | Estándar | O2 | Adoptado | La exportación respeta filtros y alcance y queda auditada. |
| RF-CRM-046 | Acciones masivas sobre selección: derivar, asignar, cambiar prioridad, vincular a incidente, cerrar en lote con el mismo texto de solución. | RN-07 §1 (cierre masivo, patrón) | Estándar | O3 | Adoptado | Cada caso del lote valida sus reglas; los rechazados se informan sin abortar el lote. |
| RF-CRM-047 | Crear casos por comando desde otros módulos (M03 observación de lectura del socio, M05 reclamo de factura desde la ficha, M08 gestión de mora, M10 visita fallida que requiere contacto, M19 portal). | RN-07 §1 (`OrigenOrden`: Titulares, GestionMora, Integra) | Núcleo | O2 | Adoptado | El caso guarda `origin.module` y la referencia de origen. |
| RF-CRM-048 | Aviso a usuarios internos de casos nuevos en sus bandejas (in-app/push), sin sondeo. | RN-07 adicionales (`NotificarNuevaOrden`) | Estándar | O2 | Adoptado | Un caso derivado a un área notifica a sus miembros en línea en menos de 10 s. |
| RF-CRM-049 | Respuestas rápidas con variables por tipo/subtipo/canal. | CAT `TICKETS_TIPOS.PLANTILLA`, `TICKETS_SUBTIPOS.PLANTILLA` | Estándar | O3 | Adoptado | Insertar una respuesta reemplaza variables del caso; queda editable antes de enviar. |
| RF-CRM-050 | Etiquetas libres por tenant para casos. | CNX §4.2 | Extensión | O6 | Adoptado | Se filtra por etiqueta en bandejas. |
| RF-CRM-051 | Campos adicionales por tipo de gestión (descripción ampliada, ruta de acceso, datos técnicos). | CAT `TICKETS_EXTRAS` | Estándar | O3 | Adoptado | El tipo define campos tipados validados con Zod en alta. |
| RF-CRM-052 | Tablero operativo del supervisor en tiempo real: casos por estado, SLA en riesgo y vencidos, carga por área y responsable, colas de conversaciones y turnos. | BASE §47; CNX §4.5 | Estándar | O3 | Adoptado | El tablero se actualiza sin recargar y cada número abre la bandeja filtrada. |
| RF-CRM-053 | Indicadores "sin intervención" de 7 días y de 8 o más días por usuario. | RN-07 §6.1 (informe de pendientes por usuario) | Estándar | O3 | Adoptado | El informe separa ambos grupos. |

### 5.2 Solicitudes comerciales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-060 | Solicitar el alta de cualquiera de los servicios brindados por el tenant, con requisitos específicos por prestación. Al **admitir** la solicitud (requisitos obligatorios completos), M09 envía el comando a M02, que crea el contrato en estado Solicitado (`requested`); antes de la admisión no existe contrato (DEC-011, PA-CAT-01 de M02). | BASE §48 SOL-001, §15, CU-15, CU-SOL-01; DEC-011 | Núcleo | O2 | Informado | El formulario ofrece solo servicios habilitados en el catálogo del tenant (M02) y pide los requisitos del tipo; una solicitud en "pendiente de datos" no tiene contrato y al admitirla el caso recibe `cat.contract.requested` (EVT-CAT-06). |
| RF-CRM-061 | Solicitar la baja de cualquiera de los servicios contratados, identificando servicio y contrato. | BASE §48 SOL-002, §53 CIC-001 | Núcleo | O2 | Informado | El socio elige un contrato propio activo o suspendido; se genera constancia. |
| RF-CRM-062 | Consultar servicios disponibles y contratados antes de solicitar. | BASE §48 | Núcleo | O2 | Informado | La consulta combina catálogo (M02) y contratos del socio (M02/M01). |
| RF-CRM-063 | Requisitos por prestación y tipo de solicitud: datos obligatorios, documentación, factibilidad, aceptación de condiciones, firma. | BASE §15, §48 | Núcleo | O2 | Informado | Sin un requisito obligatorio la solicitud queda en "pendiente de datos" y no avanza a evaluación. |
| RF-CRM-064 | Conservar fecha solicitada y fecha efectiva, sin presumir que coinciden. | BASE §48, §53 | Núcleo | O2 | Informado | La fecha efectiva solo se completa con el evento del módulo ejecutor. |
| RF-CRM-065 | Solicitar no equivale a ejecutar: cada efecto se pide por comando tipado al módulo dueño y el caso refleja su resultado. | BASE §48; AGR-002 | Núcleo | O2 | Informado | Cerrar un caso con comando pendiente exige decisión explícita; ningún endpoint CRM modifica contratos ni deuda. |
| RF-CRM-066 | Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía; configurable en otros servicios (DEC-057). | BASE §48, §52.3 (Res. 316/2018, art. 10 ter Ley 24.240), §53, §57; DEC-057 | Núcleo | O2 | Adoptado (DEC-057) | El formulario público crea el caso y emite el código en el acto; un job garantiza el envío en ≤ 24 h y alerta si falla. |
| RF-CRM-067 | La baja no genera cargo por solicitarla y no se supedita a pagar deuda, registrarse ni aceptar cargos. | BASE §52.3, §53 | Núcleo | O2 | Informado | El flujo de baja no tiene paso de pago; la deuda se informa sin bloquear. |
| RF-CRM-068 | Solicitud de suspensión temporal con duración, motivo, fecha solicitada y condiciones habilitadas del contrato. | BASE §53 CIC-002, CU-CIC-01 | Estándar | O3 | Informado | Solo se ofrecen modalidades habilitadas para el servicio; se registra la aceptación de condiciones. |
| RF-CRM-069 | Solicitud de reactivación con verificación de estado, reglas y necesidad de intervención técnica. | BASE §53 CIC-003, CU-CIC-01 | Estándar | O6 | Informado | El caso no informa "reactivado" hasta recibir el evento de M02/M08. |
| RF-CRM-070 | Modalidades con y sin costo solo si están habilitadas y validadas para el servicio y jurisdicción, con aceptación de condiciones conservada. | BASE §53 CIC-004, §52.3 | Estándar | O3 | Informado | Una regla de costo sin marca de validación no se ofrece en producción. |
| RF-CRM-071 | Solicitud de cambio de titular (transferencia del servicio o de la cuenta) con documentación y conformidad de ambas partes. | CAT `TRANSFER`; CNX §4.4 (cambio de titular); BASE §15 | Estándar | O3 | Adoptado | Se emite comando a M01/M02; el caso muestra la fecha efectiva de la transferencia. |
| RF-CRM-072 | Solicitud de cambio de plan o categoría, con cotización informativa y proporcional calculado por M04/M05. | RN-07 §1.11 (`Get_Reporte_CambioCategoria`), RN-09 2330; BASE §15 | Estándar | O3 | Adoptado | La cotización se muestra antes de confirmar; el cambio lo ejecuta M02. |
| RF-CRM-073 | Solicitud de traslado/cambio de domicilio del servicio, con nuevo domicilio y factibilidad cuando corresponda. | RN-07 §1.11 (formulario de traslado) | Estándar | O3 | Adoptado | Se solicita OT de traslado a M10 y actualización de domicilio a M01 al ejecutarse. |
| RF-CRM-074 | Otras solicitudes tipificadas: cambio de medidor o equipo, reconexión, factibilidad, adhesión a factura digital, adhesión a débito automático, actualización de datos de contacto, alta de equipamiento adicional, baja de asociado (sin automatismo). | BASE §15, §48, §53; RN-09 911; AGR-029 | Estándar | O3 | Adoptado | Cada tipo declara el comando destino; la baja de asociado se deriva a M17 sin baja automática de servicios ni viceversa. |
| RF-CRM-075 | Bajas parciales: un servicio entre varios, o un componente/adicional del servicio. | BASE §48 pendientes | Estándar | O3 | Adoptado | La baja parcial identifica el componente y no afecta los demás. |
| RF-CRM-076 | Desistimiento o cancelación antes de ejecutar, con efectos según avance (cancelar comandos pendientes, no exigir retiro de equipos no instalados). | BASE §48 pendientes; AGR-003 ejemplo; ESC-03 | Núcleo | O2 | Informado | Cancelar con OT en curso pide cancelar la OT a M10 y, si M10 reporta intervención ejecutada, el caso queda "en conflicto" para supervisión. |
| RF-CRM-077 | Evaluación y aprobación mediante workflow de autorizaciones (T11) cuando el tipo lo requiera, con bandeja única de pendientes. | BASE §15 (derivar a evaluación); MER-012; CNX §4.4 (Workflows) | Núcleo | O2 | Informado | Hasta la aprobación no se emiten comandos con efecto. |
| RF-CRM-078 | Seguimiento de comandos solicitados con estados y resultado; reintento idempotente; alerta si fallan. | AGR-002; BASE §53 (evitar duplicados por reintentos) | Núcleo | O2 | Adoptado | Reenviar un comando con la misma clave no duplica efectos; un fallo deja el caso en "en ejecución con error". |
| RF-CRM-079 | Constancia descargable de toda solicitud (número, fecha, contenido, canal, código de verificación). | BASE §52.3, §53 | Núcleo | O2 | Adoptado | La constancia PDF se genera con plantilla T09 y queda en el expediente T11. |
| RF-CRM-080 | Trámites presentados con vencimiento ligados a socio, cuenta o servicio (por ejemplo constancias para beneficios), con tipos de trámite, días de vencimiento, plantilla y acciones tipadas al alta y al vencimiento. | CAT `PTRAMITES`, `TRAMITES`, `TRAMITES_ACCIONES`; RN-06 §23.1, §23.3; RN-09 2509; INV frmPTramites, frmTramite | Estándar | O7 | Adoptado | Un trámite vencido sin otro vigente del mismo tipo dispara la acción de vencimiento como comando al módulo dueño. |
| RF-CRM-081 | Informe de trámites presentados, no presentados y vencidos, filtrable por titular y servicio. | RN-06 §23.3 | Estándar | O7 | Adoptado | Los tres estados suman el universo filtrado. |
| RF-CRM-082 | Formularios imprimibles para firma del socio (solicitud de OT, cambio de categoría, traslado) desde plantillas T09. | RN-07 §1.11 | Estándar | O3 | Adoptado | El formulario usa el diseño específico de la operación y se adjunta firmado al expediente. |
| RF-CRM-083 | La baja de un servicio no da de baja el vínculo de asociado ni viceversa. | BASE §48; AGR-029 | Núcleo | O2 | Informado | Tras ejecutar la baja de Internet, la persona sigue asociada. |
| RF-CRM-084 | Informar cargos y condiciones antes de confirmar solicitudes aranceladas admisibles (cotización de M04). | BASE §53 | Estándar | O3 | Informado | El socio ve el importe en ARS y acepta; la aceptación queda en el caso con versión de condiciones. |
| RF-CRM-085 | Operaciones de lote originadas en trámites masivos (cambio de categoría, clase, actividad, referencia, baja de servicio) se reemplazan por solicitudes masivas con comandos individuales validados. | RN-06 §4.3; INV frmTramite (`RealizarBajasServicios`, `btnCambiarCategoria`…) | Estándar | O7 | Reemplazado por RF-CRM-046 + comandos M02 | Cada servicio del lote produce su comando y su validación (`Validar_OrdenTrabajo_Desconexion` en M10). |

### 5.3 Reclamos e incidentes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-100 | Registrar reclamos vinculados a socio, servicio, cuenta y, cuando corresponda, contrato, inmueble o factura. | BASE §16, §47 | Núcleo | O3 | Informado | Un reclamo de factura exige el comprobante; uno técnico, el servicio. |
| RF-CRM-101 | Desde un reclamo técnico, solicitar a M10 una orden de trabajo vinculada; el caso refleja estados de la OT. | BASE §47 paso 6; RN-07 §2; RN-09 58 | Núcleo | O3 | Informado | La OT creada queda vinculada; cerrar la OT no cierra el caso sin la regla del tipo. |
| RF-CRM-102 | Reclamos comerciales o de facturación derivan en comandos a M05/M07 (revisión, ajuste, nota de crédito) siempre con aprobación. | AGR-002 | Núcleo | O4 | Adoptado | El caso nunca modifica importes; el ajuste lo emite M05 tras aprobación T11. |
| RF-CRM-103 | SLA por tipo, subtipo, prioridad y servicio, con objetivos de primera respuesta y resolución, calendario hábil del tenant y pausas. | DFA M14 mejoras ("SLA por tipo"); RN-07 §10.6 | Núcleo | O3 | A validar (PA-CRM-03) | Cada caso tiene política aplicada y fechas objetivo calculadas al crearse y recalculadas al reclasificar. |
| RF-CRM-104 | Alertas por SLA en riesgo (umbral %) y vencido; escalamiento por niveles a supervisor y responsable del área. | BASE §47 pendientes; RN-07 §10.6 | Núcleo | O3 | Adoptado | Al 75 % (configurable) se alerta al responsable; al 100 % se escala y se registra el incumplimiento. |
| RF-CRM-105 | Avisos al socio de cada cambio de estado del reclamo según configuración (recibido, derivado, en tratamiento, OT programada, técnico en camino si M10 lo informa, resuelto, cerrado). | DFA M14 mejoras; CNX §6.2 (reclamo recibido/resuelto) | Núcleo | O3 | Informado | Las transiciones configuradas producen comunicación con resultado de entrega (AGR-024). |
| RF-CRM-106 | Incidente común que agrupa a los afectados con una sola gestión técnica. | BASE §16, CU-16 | Núcleo | O3 | Informado | Vincular N casos a un incidente genera una sola solicitud de OT/gestión técnica en M10. |
| RF-CRM-107 | Detección sugerida de incidente común por concentración de reclamos (servicio, subtipo, zona/nodo, ventana de tiempo). | BASE §16 ejemplo; RN-07 §10.6 | Estándar | O3 | Adoptado | Con ≥ N casos en la ventana el sistema propone el incidente al supervisor; nunca lo crea solo. |
| RF-CRM-108 | Alcance del incidente: servicio, zonas, localidades, nodos/elementos de red (M10 GIS), cuentas afectadas calculadas o cargadas. | BASE §16; CNX §8 (ramal/transformador) | Estándar | O3 | Adoptado | La lista de afectados se calcula desde M10 y se congela por versión. |
| RF-CRM-109 | Comunicación a afectados (aviso de falla, avance, restablecimiento) vía T09 con audiencia del incidente, y aviso al socio que reclama de que su caso está ligado al incidente. | BASE §16 (comunicar avances), §26 (interrupción programada) | Núcleo | O3 | Informado | Cada aviso registra destinatarios y resultado. |
| RF-CRM-110 | Cerrar un incidente no cierra automáticamente los casos: cada caso confirma la resolución o permanece abierto/reabre si el domicilio sigue afectado. | BASE §16, CU-16 excepción | Núcleo | O3 | Informado | Al restablecer el incidente los casos pasan a "resuelto pendiente de confirmación"; un caso puede desvincularse y seguir. |
| RF-CRM-111 | Tipificación: categoría de incidente (M10), clase de incidente con numerador propio, tipo de falla (M10), resolución (M10). | CAT `CAT_INCI`, `CLAS_INC`, `FALLAS`, `RESOL_OT`; RN-07 §2 | Estándar | O3 | Adoptado | Cada incidente recibe número de su clase; la resolución se toma del catálogo de M10. |
| RF-CRM-112 | Participantes del incidente (responsables internos y cuadrillas). | CAT `PARTIINC` | Estándar | O3 | Adoptado | El incidente lista participantes con rol. |
| RF-CRM-113 | Consulta de incidentes por cuenta, período y estado, uniendo casos y OT, con exportación. | INV frmConsultaIncidentes; RN-06 §23.1 (`Get_Incidentes` une OT y reclamos, excluye estado 4) | Estándar | O3 | Adoptado | La consulta excluye anulados y exporta XLSX. |
| RF-CRM-114 | Campos y vistas para reclamos regulatorios (por ejemplo los exigidos por OCEBA/ERSeP/ENACOM), marcables por tipo, para informes de calidad de atención. | RN-09 3120; MER-014; RN-07 §10.6, §11 duda 5 | Estándar | O7 | Adoptado | Un tipo regulatorio exige los campos del regulador y aparece en el informe T10/M06. |
| RF-CRM-115 | Resultado favorable/desfavorable al socio y revisión del reclamo (revisor y fecha). | CAT `RECLAMOS` (`FAVORABLE`, `USU_REV`, `FEC_REV`, `TXT_RES`) | Estándar | O3 | Adoptado | Ambos datos son obligatorios al cerrar reclamos de tipos que lo requieran. |
| RF-CRM-116 | Carga rápida de reclamos desde la ficha del titular (cuenta, servicio, descripción en una sola pantalla). | DFA M14 ("Carga Rápida de Reclamos"); INV frmCargaRapidaReclamo | Núcleo | O3 | Adoptado | Un reclamo se crea en menos de tres interacciones desde la ficha. |
| RF-CRM-117 | Cargo por visita improcedente asociado a reclamos solo con regla habilitada, validada y aviso previo; el cargo lo genera M10/M05. | RN-07 §2 (`CONEXION.RECLAMO`); BASE §52.2 | Extensión | O6 | A validar (PA-CRM-18) | Sin regla validada no se ofrece; con regla, el socio fue informado antes de la visita. |
| RF-CRM-118 | Recibir la conformidad del socio y el motivo de disconformidad registrados en campo y reflejarlos en el caso. | RN-07 §2 (`RESP_ENC`, `MOTIVO_DISCONFORME`); RN-09 51 | Estándar | O3 | Adoptado | Una disconformidad impide el cierre automático y vuelve el caso a "en tratamiento". |
| RF-CRM-119 | Encuesta post-cierre (CSAT/NPS + comentario) configurable por tipo, enviada por T09, con resultado ligado al caso. | BASE §16 (medir satisfacción), §47 pendientes; CNX §7.7; DFA M21 (encuestas) | Estándar | O3 | Adoptado | Una respuesta negativa crea alerta al supervisor; no se envía más de una encuesta por caso. |
| RF-CRM-120 | Informes de reclamos, reincidencias y estadísticas de demora (pendientes, resueltos, dentro/fuera de período, demora promedio desde fecha del caso y desde registro). | RN-07 §1.10, §1.11 | Estándar | O3 | Adoptado | Las demoras usan piso 0 y "ahora" para abiertos. |
| RF-CRM-121 | Exponer a M10 el resumen de incidentes/casos vinculados para la impresión de la OT. | RN-09 3173 | Estándar | O3 | Adoptado | M10 obtiene el resumen por API interna. |
| RF-CRM-122 | Protocolo de urgencias de seguridad (riesgo eléctrico, fuga de gas, cable caído, pérdida grave): prioridad crítica, aviso inmediato a guardia, mensaje de seguridad al socio con teléfono de emergencia. **Precisión (HUE-GAS-05):** la guardia es la de M10 (turnos y escalamiento RF-TEC-231 y RF-TEC-232; el teléfono de PRM-CRM-019 se toma del turno vigente cuando existe); el caso solicita a M10 la OT de emergencia (RF-TEC-233); el mensaje al socio y a los afectados usa el tipo T09 `tec.emergency.notice`; el tiempo de respuesta se controla con el SLA de seguridad de RF-CRM-260. | BASE §47 pendientes (casos urgentes); HUE-GAS-05 | Núcleo | O3 | Adoptado | Un subtipo marcado urgente no espera supervisión: notifica a guardia y queda visible en supervisión. |
| RF-CRM-123 | Reglas de notificación de guardias por servicio, tipo, días de semana, franja horaria, feriados y momento (al crear o al derivar). | CAT `RESPONSA_NOTIFICA`; RN-07 §1 (`NotificarResponsables`) | Estándar | O3 | Adoptado | Fuera de franja se notifica al responsable de guardia configurado. |
| RF-CRM-124 | Envío configurable de correo a la cuenta configurada del incidente, a cada interviniente y al titular de la cuenta. | RN-09 2630, 2631, 2632 | Estándar | O3 | Adoptado | Cada destinatario se activa por parámetro y la comunicación queda en el caso. |
| RF-CRM-125 | Historial de estados de reclamos migrados y notas, consultables en el caso. | CAT `RECLAMOS_HIST`, `RECLAMOS_NOTAS`; INV frmReclamosHist, frmNota_Reclamo | Estándar | O11 | Adoptado | Los eventos migrados se ven en el timeline con marca "migrado". |
| RF-CRM-258 | **Plantilla de plataforma de SLA ENACOM** para reclamos de servicios TIC (Internet, TV, telefonía; Res. ENACOM 733/2017, Reglamento de Clientes TIC): políticas `crmSlaPolicies` precargadas por motivo de reclamo (falta total de servicio, degradación de calidad o velocidad, facturación, alta/baja/cambio de plan, atención comercial) con `templateCode`, objetivos de primera respuesta y resolución, calendario y marca `regulatory=true`. El tenant la adopta y edita en PAN-CRM-14; cada objetivo queda marcado **"a validar legalmente"** (`legalValidation.status = pending`) hasta que el responsable legal del tenant lo confirme. Valores iniciales en §18.1 y PRM-CRM-135. | HUE-INT-03; RF-CRM-103, RF-CRM-114; MER-014 | Estándar | O3 | Adoptado (plazos como parámetro con default propuesto; requiere validación legal) | Un tenant con servicio TIC ve la plantilla ENACOM en PAN-CRM-14 y al adoptarla los casos de esos motivos calculan vencimientos con sus objetivos; T10 REP-BIA-015 informa el cumplimiento; ningún objetivo se muestra como vigente legal mientras `legalValidation.status = pending`. |
| RF-CRM-259 | **Reclamos de saneamiento y alumbrado con derivación según convenio** (HUE-CLO-03, HUE-ALU-03): subtipos de precarga con clave del diccionario `dict:crm.claimType` (T03 §10.9.12, RF-UXD-179; nombres verificados): cloacas `dict:crm.claimType.clo.desborde` y `dict:crm.claimType.clo.obstruccion` (incidente de red en M10, con detección de incidente común por zona); alumbrado `dict:crm.claimType.alu.luminariaApagada` (ubicación o poste, M10 GIS). Cada subtipo define `externalDerivation` según el convenio del servicio (M02 `domainAttributes.agreement.claimHandler`, PRM-CAT-111): `cooperative` (OT en M10), `municipality` (el caso se deriva al municipio por el canal del convenio, queda en estado de espera de tercero con pausa de SLA y registra la respuesta) o `byAgreement` (lo resuelve la regla del convenio por zona o tipo de luminaria). | HUE-CLO-03; HUE-ALU-03; M02 (servicios CLO y ALU) | Estándar | O7 | Adoptado | Un reclamo de luminaria apagada en un servicio cuyo convenio fija `claimHandler = municipality` no crea OT: registra la derivación, el número de constancia del municipio y avisa al socio; si el convenio fija `cooperative`, solicita la OT a M10. Un desborde se registra con su tipo propio y aparece separado en REP-BIA-021. |
| RF-CRM-260 | **SLA de reclamo de seguridad** (HUE-GAS-05): política de plataforma `safety.emergency` aplicada a todo subtipo con `urgentSafety=true` (fuga u olor a gas, riesgo eléctrico, cable caído, pérdida grave de agua, desborde con riesgo sanitario): calendario **corrido 24×7** (no hábil), sin pausas, objetivos `firstResponse` (aceptación de la guardia), `onSite` (arribo) y `resolution` (zona segura) por servicio (PRM-CRM-133), escalamiento a la guardia de M10 (EVT-TEC-36 se refleja en el caso) y cierre solo con la OT de emergencia en estado seguro (EVT-TEC-35 `tec.emergency.closed`). | HUE-GAS-05; RF-CRM-122; RF-TEC-233 | Núcleo | O7 (GAS, ELE); O3 resto | Adoptado (tiempos como parámetro PRM-CRM-133 con default propuesto; requiere validación legal con la distribuidora y el regulador) | Un caso de fuga de gas creado a las 23:00 de un feriado calcula el vencimiento de arribo en minutos corridos; si la guardia no acepta en el plazo, el caso muestra el escalamiento; el SLA de seguridad figura en REP-BIA-022 (gas) y REP-BIA-018 (energía). |

### 5.4 Mesa de entradas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-130 | Registrar entradas documentales (nota, oficio judicial, cédula, carta documento, documentación de organismos, solicitud por escrito) con número de expediente. | MER-016; DFA M21 (Mesa de Entradas: Administración) | Estándar | O10 | A validar (PA-CRM-17) | Cada entrada recibe número del libro de mesa de entradas y queda como caso tipo mesa de entradas. |
| RF-CRM-131 | Datos de remitente externo (organismo, juzgado, persona, proveedor), destinatario interno, folios, medio de recepción, fecha y hora de recepción, adjuntos escaneados. | MER-016 | Estándar | O10 | Adoptado | Sin remitente o sin fecha de recepción el registro falla. |
| RF-CRM-132 | Pases y derivaciones internas con acuse de recepción del área. | MER-016 | Estándar | O10 | Adoptado | Cada pase muestra quién lo envió, a quién y cuándo se acusó recibo. |
| RF-CRM-133 | Plazos de respuesta (por ejemplo oficios con término) con alertas. | MER-016; BASE §15 (controlar vencimientos) | Estándar | O10 | Adoptado | El plazo usa el calendario hábil o corrido indicado; alerta a 2 días hábiles del vencimiento. |
| RF-CRM-134 | Registro de salidas/respuestas con número de salida y constancia de envío. | MER-016 | Estándar | O10 | Adoptado | Cada salida queda en el expediente con su número. |
| RF-CRM-135 | Vincular la entrada con persona, cuenta, servicio u otro caso cuando corresponda. | MER-016; BASE §47 | Estándar | O10 | Adoptado | La vinculación aparece en la vista 360. |
| RF-CRM-136 | Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). | DFA M21 (Informes) | Estándar | O10 | Adoptado | El libro es exportable a PDF con numeración continua. |

### 5.5 Atención presencial y turnero

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-140 | Recepción: identificar a la persona (opcional), registrar motivo y emitir turno para un área. | BASE §26 (atención presencial), CU-CRM-21 (antes CU-26; el CU-26 lo define T09) | Estándar | O10 | Informado | El turno A-001 para Caja se emite con hora de ingreso. |
| RF-CRM-141 | Áreas del turnero con letra, descripción, responsable, tiempo estimado de atención, habilitación e imagen. | CAT `TUR_AREAS`; DFA M21 | Estándar | O10 | Adoptado | Un área inhabilitada no emite turnos. |
| RF-CRM-142 | Usuarios por área; un usuario sin áreas asignadas actúa como recepción y ve todas las áreas habilitadas. | CAT `TUR_AREAS_USERS`; RN-10 §16.1 | Estándar | O10 | Adoptado | El llamado toma solo turnos de las áreas del usuario. |
| RF-CRM-143 | Boxes con tipo y número; apertura y cierre por usuario con historial; un box no puede estar abierto dos veces. | CAT `TUR_BOX`, `TUR_TIPO_BOX`, `TUR_BOX_HISTORIAL`; RN-10 §16.1 | Estándar | O10 | Adoptado | Abrir un box abierto informa quién lo tiene; cerrar es idempotente. |
| RF-CRM-144 | Numeración correlativa por día y área; código visible por número (letra + 3 dígitos), por nombre o por letra + últimos 3 dígitos del documento sin imprimir. | RN-10 §16.1; RN-09 2005, 3064 | Estándar | O10 | Adoptado | El contador reinicia cada día por área en la zona horaria del tenant. |
| RF-CRM-145 | Turnos prioritarios (embarazo, discapacidad, adultos mayores u otras causas del tenant) que se llaman primero. | CAT `TURNOS.PRIORIDAD`; RN-10 §16.1 | Estándar | O10 | Adoptado | Entre prioritarios y comunes, el siguiente llamado es el prioritario más antiguo. |
| RF-CRM-146 | Llamar siguiente con exclusión concurrente: dos boxes nunca llaman el mismo turno. | RN-10 §16.1 (`LlamarSiguiente` con bloqueo) | Estándar | O10 | Adoptado | Prueba de carga con 10 boxes simultáneos no duplica llamados. |
| RF-CRM-147 | Rellamar, marcar ausente, iniciar atención, derivar a otra área conservando el área de origen, finalizar como solucionado, sin solución o sin atención. | RN-10 §16.1 (acciones 1–8) | Estándar | O10 | Adoptado | Cada acción queda en el historial con hora del servidor, box, área y usuario. |
| RF-CRM-148 | Pantallas públicas con últimos llamados (agrupados por box o por turno), modos de visualización, voz sintetizada y múltiples pantallas por sucursal. | RN-09 2007, 2209, 2240, 2700; RN-10 §16.1 (`GetLamadas`) | Estándar | O10 | Adoptado | La pantalla web muestra los 5 últimos llamados del día y anuncia por voz el nuevo llamado. |
| RF-CRM-149 | Tiempo estimado de espera por turno según usuarios con box abierto y tiempo estimado del área. | RN-10 §16.1 (`GetTiempoEstimadoTurno`) | Estándar | O10 | Adoptado | El estimado se muestra en el ticket y en el turno online. |
| RF-CRM-150 | Estadísticas: ingresados, atendidos, abandonos, prioritarios, tiempos de espera y atención, por día de semana y hora, por mes/día/hora y por turno, con exclusión de errores de carga. | DFA M21 (Estadísticas); RN-10 §16.1 (`GetEstadisticas`) | Estándar | O10 | Adoptado | Los intervalos ≥ 5 h se excluyen si se marca la opción. |
| RF-CRM-151 | Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. | RN-09 67; DFA M21 mejoras ("Turnero web con turno online") | Estándar | O10 | A validar (PA-CRM-13) | El turno remoto entra en la fila con marca de origen; el socio recibe aviso a N turnos. |
| RF-CRM-152 | Reserva de turno con día y hora por área, con cupos, confirmación, recordatorio, cancelación y presentación (check-in) que genera el turno. | DFA M21 mejoras; BASE §26 | Estándar | O10 | A validar (PA-CRM-13) | No se sobrevende un cupo por carrera; ausencia se registra. |
| RF-CRM-153 | Tótem de autoservicio para emitir turno (con documento opcional) e imprimir o mostrar QR. | FIC 19; BASE §26 | Extensión | O10 | Adoptado | El tótem funciona como app web en modo kiosco. |
| RF-CRM-154 | Turnos generados automáticamente por canales remotos con un box técnico de generación y un principal de servicio, excluidos de los boxes abiertos. | RN-09 2014, 3089; RN-10 §16.1 | Estándar | O10 | Adoptado | El box técnico no aparece en la consola ni en estadísticas de boxes. |
| RF-CRM-155 | Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. | FIC 19; RN-09 2006; DEC-007 | Extensión | O10 | A validar (PA-CRM-14) | Si el agente está caído, el turno se emite y se muestra en pantalla/QR; la impresión se reintenta. |
| RF-CRM-156 | Registrar cada atención presencial como interacción (motivo, resultado, caso creado o vinculado). | BASE §26; DFA M21 mejoras | Estándar | O10 | Adoptado | Finalizar un turno exige motivo y resultado; puede crear un caso en el mismo paso. |
| RF-CRM-157 | Historial completo del turno consultable. | CAT `TURNOS_HISTORIAL`; RN-10 §16.1 (`GetHistorial`) | Estándar | O10 | Adoptado | El historial muestra la acción en curso como fila "actual". |
| RF-CRM-158 | Atención de ventanilla sin turnero (registro directo de interacción) desde O2. | BASE §15 (solicitudes presenciales) | Núcleo | O2 | Adoptado | El agente registra la interacción y crea el caso sin turno. |

### 5.6 Canales de atención

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-170 | Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. | CAT `TICKETS_MEDIOSATENCION`, `VIAINGTE`; MER-016 | Núcleo | O2 | Adoptado | Un canal deshabilitado no recibe ni envía; sus casos históricos se conservan. |
| RF-CRM-171 | Bandeja omnicanal de conversaciones con asignación a agentes, estado, tiempo de espera y vínculo a caso. | BASE §47 CRM-002; DFA M21 mejoras | Núcleo | O6 | Informado | Un mensaje entrante sin caso aparece en la cola del canal; el agente lo vincula o crea caso. |
| RF-CRM-172 | WhatsApp Business con la cuenta oficial del tenant: mensajes entrantes y salientes, ventana de atención de 24 h, plantillas aprobadas fuera de ventana, opt-in y opt-out. | MER-016; FIC 13.2; DFA M21 mejoras; RN-09 3105 | Núcleo | O6 | A validar (PA-CRM-06) | Fuera de ventana el sistema solo permite plantillas aprobadas; un opt-out bloquea envíos no transaccionales. |
| RF-CRM-173 | Avisos salientes del CRM por WhatsApp con plantillas (caso recibido, estado actualizado, documentación pendiente, resuelto, encuesta, turno llamado, incidente zonal, constancia de baja), usando el motor T09. | FIC 13.2; RN-07 §8.9 (plantillas Trii); CAT `PLANTILLA_WSP`, `VARIABLES_PLANTILLA_WSP` | Núcleo | O3 | Adoptado | Cada plantilla tiene variables declaradas; falta de variable impide el envío y registra error. |
| RF-CRM-174 | Bot de autogestión: consulta de saldo, segunda vía de factura, link de pago, apertura de reclamo, estado de reclamos, turnos, cortes programados, inicio de baja (lleva al circuito de baja), preguntas frecuentes. | MER-016; DFA M21 mejoras; FIC 13.2 (`GetReclamosBot`) | Núcleo | O6 | Informado | Cada intención se resuelve con APIs de solo lectura o creando un caso; ninguna cambia estado de contrato o deuda. |
| RF-CRM-175 | Identificación en canales: por teléfono verificado vinculado, documento → cuentas, código de cuenta; verificación adicional antes de mostrar información privada. | FIC 13.2 (`GetCuentasDniBot`, `GetCuentaCodigoBot`); AGR-030 | Núcleo | O6 | A validar (PA-CRM-07) | Sin verificación el bot solo ofrece información pública y apertura de casos. |
| RF-CRM-176 | Traspaso bot → humano con contexto completo; comportamiento fuera de horario. | BASE §47 pendientes (disponibilidad del bot, traspaso, fuera de horario) | Núcleo | O6 | A validar (PA-CRM-08) | El agente ve la transcripción y la intención detectada; fuera de horario se informa el plazo y se crea caso. |
| RF-CRM-177 | Email entrante por casilla del tenant: crear caso o agregar al caso por número en el asunto; responder desde el caso. | BASE §47 pendientes (canales); FIC 13.1 | Estándar | O6 | Adoptado | Un email con "[TCK-…]" en el asunto se agrega al caso; sin número crea caso nuevo en supervisión. |
| RF-CRM-178 | SMS saliente desde el caso o ficha y entrante opcional (respuestas). | CAT `MENSAJES`; RN-09 2693; RN-10 §5; INV frmEnviar_SMS, frmParam_SMS; FIC 13.3 | Estándar | O6 | Adoptado | El SMS saliente queda como interacción con resultado de T09. |
| RF-CRM-179 | Teléfono: registro de llamadas de atención (entrante/saliente, duración, motivo, resultado); integración CTI opcional (identificación por número, ficha emergente, clic para llamar, referencia a grabación). | DFA M21 ("Telefonía y llamadas"); MER-016 | Estándar | O10 | Adoptado | Sin CTI el agente registra la llamada con temporizador; con CTI la ficha se abre sola. |
| RF-CRM-180 | IVR entrante para consultas (saldo, estado de reclamo) y registro de reclamos o derivación a agente. | MER-016; FIC 13.4 | Extensión | O10 | Adoptado | La opción del IVR crea interacción y, si corresponde, caso. |
| RF-CRM-181 | Exportación de listas para discadores/IVR saliente (modelos de archivo heredados) delegada a T09/M08; CRM aporta universos de casos. | RN-07 §8.9 (`clsIVR`); CAT `IVR`; INV frmCirculares (`ExportarIVR`) | Extensión | O10 | Reemplazado por T09 (motor de canal IVR) | M09 no genera archivos de discador: el universo de casos se entrega a T09 por consulta filtrada y T09 produce el archivo del canal IVR con el modelo heredado; ninguna pantalla de M09 exporta ese archivo. |
| RF-CRM-182 | Chat web en landing, portal y PWA (bot primero, humano después). | BASE §47 CRM-002 | Núcleo | O6 | Informado | El widget respeta la marca del tenant y funciona sin login para consultas públicas. |
| RF-CRM-183 | Redes sociales (mensajería de Facebook e Instagram) como canales de la bandeja omnicanal. | Enunciado del alcance (redes); MER-016 | Extensión | O10 | Adoptado | Los mensajes entran a la misma bandeja con canal identificado. |
| RF-CRM-184 | Selección del destino de avisos (móvil de la cuenta, teléfono web, teléfono de la persona) según preferencias y verificación (T09). | RN-07 §8.9; RN-09 2824, 3051, 3121 | Núcleo | O3 | Reemplazado por T09 (resolución de contacto) | Un aviso de caso se emite a T09 sin dirección de destino; T09 elige móvil de la cuenta, teléfono web o teléfono de la persona según preferencia y verificación, y el destino usado queda en la comunicación vinculada al caso. |
| RF-CRM-185 | Envío manual de WhatsApp/SMS desde la ficha del titular o el caso siempre registrado (no por enlaces externos sin trazabilidad). | DFA M21 (botón WhatsApp en la ficha); INV frmEnvioWhatsApp, frmEnvioWhatsAppTrii; RN-10 §5 | Estándar | O3 | Adoptado | El botón abre la conversación CRM; el envío queda como interacción. |
| RF-CRM-186 | Historial unificado de interacciones (llamada, WhatsApp, email, ventanilla, portal, SMS, bot, mesa de entradas) ligado a persona, cuenta y servicio. | DFA M21 mejoras ("CRM unificado") | Núcleo | O2 | Adoptado | Toda interacción tiene persona o "no identificada" y, si se identifica luego, se re-vincula. |
| RF-CRM-187 | Respetar consentimiento, preferencias de canal y horario de no molestar de T09 en avisos no urgentes. | CNX §2.7; AGR-024 | Núcleo | O3 | Adoptado | Un aviso no urgente en horario de no molestar se difiere. |
| RF-CRM-188 | Responder fuera de la ventana de 24 h solo con plantilla aprobada; reabrir ventana al responder el socio. | MER-016 (políticas del proveedor) | Núcleo | O6 | Adoptado | El editor bloquea texto libre fuera de ventana. |

### 5.7 IA supervisada

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-200 | Clasificación sugerida de tipo, subtipo, servicio, prioridad y área. | BASE §16, §47 CRM-005, paso 3; AGR-030 | Estándar | O6 | A validar (PA-CRM-09) | La sugerencia se muestra con confianza; el supervisor acepta o corrige; la derivación la decide una persona. |
| RF-CRM-201 | Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). | RN-07 §6 (`clsAnalisisNotasTicket`); BASE §47 | Estándar | O6 | A validar (PA-CRM-09) | El resumen se guarda como sugerencia con versión de modelo; convertirlo en nota requiere confirmación. |
| RF-CRM-202 | Sugerencia de respuesta (borrador) editable por el agente. | CNX §4.2 (IA solo propone); AGR-030 | Estándar | O6 | A validar (PA-CRM-09) | Ningún mensaje generado se envía sin acción humana. |
| RF-CRM-203 | Lectura de adjuntos (foto de medidor, factura, documento, daño) para extraer datos y proponerlos. | FIC 20 (`clsLeerComprobante` como precedente); AGR-030 | Extensión | O10 | A validar (PA-CRM-09) | Los datos extraídos se muestran junto al original; aceptar carga los campos con marca "origen IA". |
| RF-CRM-204 | Asistencia al socio para redactar su gestión (propuesta revisable por el socio). | BASE §47 paso 3, CU-CRM-01 | Estándar | O6 | A validar (PA-CRM-09) | El socio puede descartar la propuesta y conservar su texto. |
| RF-CRM-205 | Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. | BASE §16; AGR-030 | Extensión | O6 | Adoptado | La sugerencia nunca vincula sola. |
| RF-CRM-206 | Registro de cada sugerencia: función, fuentes, tenant, versión de modelo y de instrucciones, salida, confianza, decisión humana (aceptada, corregida, descartada) y texto original conservado. | AGR-030; CAT `AUDIT_IA` | Núcleo | O6 | Adoptado | Para cualquier caso se reconstruye qué propuso la IA y qué decidió el operador. |
| RF-CRM-207 | Operación sin IA: si la IA falla o está deshabilitada, la recepción y atención siguen normalmente. | AGR-030 | Núcleo | O6 | Adoptado | Con el proveedor caído, crear y derivar casos funciona y la UI indica "IA no disponible". |
| RF-CRM-208 | Mensajes y adjuntos se tratan como datos: no cambian permisos, instrucciones ni alcance. | AGR-030 | Núcleo | O6 | Adoptado | Pruebas de inyección ("ignorá las instrucciones…") no alteran el comportamiento ni exponen datos de otro socio/tenant. |
| RF-CRM-209 | Ámbito: la IA solo recibe datos del tenant y del socio del caso, minimizados. | BASE §47; AGR-030 | Núcleo | O6 | Adoptado | El contexto enviado al proveedor excluye datos de otros socios y campos sensibles no necesarios. |
| RF-CRM-210 | Casos sensibles (salud, sepelio, violencia, menores) y clasificaciones inciertas se derivan a humano; la IA no decide cobros, bajas, devoluciones ni temas clínicos. | AGR-030 | Núcleo | O6 | Adoptado | Con confianza menor al umbral el caso queda "sin clasificar" en supervisión. |
| RF-CRM-211 | Habilitación por tenant y por función, umbrales, y evaluación de exactitud (tasa de aceptación/corrección por servicio y función). | AGR-030 | Estándar | O6 | Adoptado | El tablero de IA muestra exactitud por función y período. |
| RF-CRM-212 | Propuesta de acción siguiente e información faltante como parte del resumen. | RN-07 §6.1 (`FormatearComoNota`) | Estándar | O6 | Adoptado | La propuesta lista datos faltantes que el agente puede pedir con un clic. |
| RF-CRM-213 | Detección de intención en el bot con umbral; si es incierta, se pregunta o se deriva a humano. | AGR-030 ejemplo (clasificación incierta → supervisión) | Núcleo | O6 | Adoptado | Bajo umbral el bot ofrece menú o humano, nunca ejecuta una acción. |

### 5.8 Actividades y tareas internas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-220 | Áreas de actividades con responsable, destinatarios adicionales y días de envío de recordatorios. | CAT `ACT_AREAS`; RN-07 §7 | Estándar | O10 | Adoptado | Los destinatarios son usuarios o grupos del tenant (emails externos opcionales). |
| RF-CRM-221 | Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. | CAT `ACT_TIPOS`; RN-07 §7 | Estándar | O10 | Adoptado | Un tipo sin frecuencia solo admite actividades manuales. |
| RF-CRM-222 | Frecuencias semanal, mensual, bimestral, trimestral, cuatrimestral, semestral, anual o cada N días, sin duplicados. | CAT `ACT_FREC`; RN-07 §7, §7.1 | Estándar | O10 | Adoptado | Crear una frecuencia con mismo tipo y días informa "ya existe". |
| RF-CRM-223 | Rubros de actividades. | CAT `ACT_RBR` | Estándar | O10 | Adoptado | Las actividades se filtran por rubro. |
| RF-CRM-224 | Actividades con tipo, rubro, responsable, destinatarios extra, vigencia hasta, generación automática o manual y tipo de fecha. | CAT `ACTIV`; RN-07 §7 | Estándar | O10 | Adoptado | Una actividad vencida en vigencia deja de generar ocurrencias. |
| RF-CRM-225 | Generación automática de la siguiente ocurrencia cuando la próxima fecha menos el margen anterior llegó, sin superar la vigencia. | RN-07 §7, §7.1 | Estándar | O10 | Adoptado | El job diario crea a lo sumo una ocurrencia por fecha y actividad. |
| RF-CRM-226 | Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. | RN-07 §7, §7.1; CAT `CALENDARIO` | Estándar | O10 | Adoptado | La cita se asigna por usuario, no por coincidencia de email. |
| RF-CRM-227 | Recordatorios diarios por actividad, por responsable y por área con resumen de días de atraso promedio, en los días de envío configurados. | RN-07 §7, §7.1; RN-09 681 | Estándar | O10 | Adoptado | El envío ocurre una vez por día aunque el job se ejecute varias veces. |
| RF-CRM-228 | Estados de ocurrencia: pendiente, próxima a vencer, vencida, cerrada en término, cerrada fuera de término, cerrada con revisión, anulada. | RN-07 §7 (con corrección de filtros invertidos) | Estándar | O10 | Adoptado | "En término" = cierre ≤ fecha + margen posterior. |
| RF-CRM-229 | Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. | CAT `ACTIV_SEG`; BASE §26 (evidencias, aprobaciones) | Estándar | O10 | Informado | Un tipo con aprobación requiere que otro usuario apruebe para cerrar. |
| RF-CRM-230 | Aviso de finalización a destinatarios al cerrar una ocurrencia. | RN-07 §7.1 (`EnviarMailFinalizacion`) | Estándar | O10 | Adoptado | El aviso se envía por T09 de forma asíncrona. |
| RF-CRM-231 | Planilla imprimible por plantilla del tipo o predeterminada, con estado impreso (Pendiente, Cerrada con revisión, Cerrada). | RN-07 §7.1 (`GenerarPlantilla`) | Estándar | O10 | Adoptado | La planilla se genera en PDF con plantilla T09. |
| RF-CRM-232 | Actividades previas/preventivas vinculadas a otra actividad, con estado de cumplimiento. | CAT `ACTIPREV` | Estándar | O10 | Adoptado | No se cierra una ocurrencia si sus previas obligatorias están pendientes (configurable). |
| RF-CRM-233 | Escalamiento de ocurrencias vencidas al responsable del área tras N días. | BASE §26 (escalamiento) | Estándar | O10 | Informado | A N días de vencida, el área recibe aviso. |
| RF-CRM-234 | Indicadores de actividades, casos y turnos para el tablero de control (T10). | DFA M22 (Tablero de Control); CAT `TABLERO`, `TENDTAB`, `TIPO_TAB` | Estándar | O10 | Adoptado | T10 consume indicadores con fórmula y umbral documentados. |
| RF-CRM-235 | Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. | CAT `CALENDARIO`, `CALENDARIO_TIPO`, `TIP_EVEN` | Estándar | O10 | Adoptado | Un evento recurrente se expande en la vista mensual. |
| RF-CRM-236 | Tareas internas ad hoc (no recurrentes) vinculables a casos, con responsable, vencimiento y evidencia. | BASE §26 (Tareas), CU-CRM-21 (antes CU-26; el CU-26 lo define T09) | Estándar | O3 | Informado | Desde un caso se crea una tarea para otra área sin derivar el caso. |
| RF-CRM-237 | Informe de seguimiento de actividades por estado, área, responsable y período. | DFA M22 (Seguimiento e Informe) | Estándar | O10 | Adoptado | El informe muestra días de atraso promedio por área. |
| RF-CRM-261 | **Tarea de regularización del documento de una persona migrada** (DEC-099; M01 RF-PER-175, RN-PER-136, §9.14): tipo de gestión de sistema `crmCaseTypes` (nombre `dict:crm.caseType.identityDocumentRegularization`) con `kind = request`, `requestAction = identityDocumentRegularization`, `customerVisible = false`, `requiresAccount = false`, `allowsAnonymous = false`, área por defecto la que el tenant indique (sugerida: Comercial o Padrón) y SLA propio. Se precarga en todo tenant y no se puede borrar (sí renombrar, cambiar área, responsable y SLA). M01 la abre con `crm.openCase` (`origin.module = per`, `origin.sourceRef = personId`, `requester.personId`, `idempotencyKey = per.documentPending:<personId>`) al crear en la migración una persona con `identificationStatus = documentPending`, una por persona; si el tenant elige agrupar por lote de migración, una por lote con cada persona en `links[]` (`entityType = person`). El caso no ejecuta comandos ni cambia datos de la persona (la carga del documento se hace en M01, PAN-PER-02 acción "Regularizar documento"); el operador solo lo gestiona y el enlace abre la ficha. M09 cierra el caso, o en modo lote quita la persona y cierra el caso cuando no quedan pendientes, al consumir `per.person.identificationRegularized` (EVT-PER-27) de M01, y devuelve el `caseId` que M01 guarda en `persons.identificationRegularization.taskId`. | DEC-099; M01 RF-PER-175, RN-PER-136, §9.14; T07 (migración de LAG) | Núcleo | O2 | Adoptado | Migrar una persona sin documento abre un caso `identityDocumentRegularization` en el área configurada, no visible en el portal; reintentar la migración no abre un segundo caso (misma `idempotencyKey`); cargar el documento en M01 publica EVT-PER-27 y el caso queda cerrado con motivo "documento regularizado"; un caso de lote con tres personas queda abierto hasta que se regulariza la tercera. |

### 5.9 Circulares, plantillas y encuestas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CRM-250 | Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. | CAT `CIRCULAR`; INV frmCirculares | Estándar | O6 | Adoptado | Un modelo se previsualiza con datos ficticios antes de generar. |
| RF-CRM-251 | Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. | INV frmCirculares (`GenerarCirculares`, `GetFiltros*`, `Imprimir_Circulares`); CNX §8 | Estándar | O6 | Adoptado | La corrida congela el universo, registra destinatarios y resultado por canal. |
| RF-CRM-252 | Etiquetas (titular, cuenta, servicio) e informe de comunicación de la corrida. | INV frmCirculares (`Imprimir_Etiquetas*`, `Imprimir_InformeComunicacion`) | Estándar | O6 | Adoptado | Las etiquetas se generan en PDF por formato configurado. |
| RF-CRM-253 | Solicitar OT masivas a M10 desde una corrida (por ejemplo, inspecciones). | INV frmCirculares (`Generar_OrdenTrabajo`) | Estándar | O6 | Adoptado | Cada OT se pide por comando con clave idempotente por cuenta y corrida. |
| RF-CRM-254 | Exportaciones regulatorias e informes de deuda presentes en frmCirculares (EPRE, OCEBA, RASE, SINTYS, ENACOM, ERSeP, informes de deuda/servicios, mapa) se reasignan. | INV frmCirculares (`Exportar_*`, `Imprimir_Informe*`, `ExportarMapa`) | Estándar | — | Reemplazado por M06/T10/M08/M10 (ver §22) | Ninguna exportación regulatoria ni informe de deuda se emite desde M09; cada salida listada en §22 existe en el módulo destino (M06, T10, M08 o M10) con su propio ID. |
| RF-CRM-255 | Plantillas de correspondencia con variables (mail, SMS, WhatsApp, documento) administradas en T09; el CRM registra las claves de plantilla que usa cada tipo/estado. | CAT `PLANTILLA`, `VARIABLEPLANT`; INV frmPlantillaEditor; RN-09 2478, 2479 | Núcleo | O2 | Reemplazado por T09 (motor) + PRM-CRM-056 (claves) | Al cambiar un caso a un tipo o estado con plantilla configurada (PRM-CRM-056), M09 envía a T09 solo la clave de plantilla y las variables; si la clave no existe en T09 la configuración se rechaza. |
| RF-CRM-256 | Encuesta post-cierre y encuestas presentadas al usuario interno (heredado frmEncuestas) resueltas con el motor T09. | INV ProcoopNet frmEncuestas; CAT `ENCUESTAS`, `RESPUESTAS` | Estándar | O3 | Reemplazado por T09 + RF-CRM-119 | Al cerrar un caso con encuesta habilitada, la encuesta se envía con el motor de T09 y la respuesta queda vinculada al caso (RF-CRM-119); M09 no mantiene un editor propio de encuestas. |
| RF-CRM-257 | Indicadores de calidad de atención para reguladores cuando se exijan (MER-014). | MER-014 | Estándar | O11 | Adoptado | T10 obtiene tiempos por tipo regulatorio. |

### 5.10 Requisitos no funcionales específicos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RNF-CRM-001 | Aislamiento de tenant en casos, conversaciones, bot, IA, numeración, turnero y webhooks entrantes (el tenant del webhook se resuelve por el canal registrado, nunca por parámetro). | DEC-002; AGR-030 | Núcleo | O2 | Adoptado | Pruebas cruzadas entre dos tenants no devuelven datos ajenos. |
| RNF-CRM-002 | Webhooks entrantes con verificación de firma del proveedor, idempotencia por id de mensaje y respuesta < 2 s (procesamiento asíncrono). | DEC-003; AGR-016 | Núcleo | O6 | Adoptado | Reenvío del mismo webhook no duplica mensajes. |
| RNF-CRM-003 | Endpoints públicos (baja, chat, turno) con rate limiting por IP, captcha adaptable y sin enumeración de datos. | CNX §10 (V-07); BASE §52.3 | Núcleo | O2 | Adoptado | 30 solicitudes por minuto por IP como tope por defecto. |
| RNF-CRM-004 | Pantalla de turnos y consola de box con latencia de llamado < 1 s (WebSocket/SSE). | RN-10 §16.1 | Estándar | O10 | Adoptado | Medición en prueba de carga. |
| RNF-CRM-005 | Casos y mensajes nunca se borran físicamente; anonimización por política de retención (T08). | AGR-023; T08 | Núcleo | O2 | Adoptado | No existe DELETE de casos en la API. |
| RNF-CRM-006 | Accesibilidad de pantallas públicas y del turnero (contraste, voz, tamaño). | BASE §26 | Estándar | O10 | Adoptado | Cumple WCAG 2.1 AA en las vistas públicas. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CRM-001 | Expediente común: una solicitud puede originar varios trabajos y movimientos; cambiar de área no crea otro caso. | Reclamo = OT; trámites, tickets y reclamos en tablas separadas (RN-07 §2, CAT §10, §21) | Mejorar: un `crmCase` con vínculos múltiples (BASE §15, CU-CRM-01) | — | — |
| RN-CRM-002 | Cerrar un caso no cambia contratos ni cancela deuda; los efectos solo ocurren por comando ejecutado en el módulo dueño. | Trámites ejecutan SQL directo sobre cuentas/servicios (RN-06 §23.3) | Reemplazar por comandos tipados (AGR-002) | — | — |
| RN-CRM-003 | Resolver un chat no equivale a resolver el problema; cerrar una conversación no cierra el caso. | — | Nuevo (BASE §47) | — | — |
| RN-CRM-004 | Aprobar una solicitud no implica servicio instalado; la prestación es activa solo con el evento de ejecución. | — | Nuevo (BASE §39.5, §53 control) | — | — |
| RN-CRM-005 | El socio solo opera sobre personas/cuentas/servicios que tiene autorizados; si elige una ajena se deniega; si no sabe cuál, el caso queda "cuenta a identificar". | — | Nuevo (CU-CRM-01) | — | — |
| RN-CRM-006 | Una solicitud de alta puede no tener cuenta ni contrato; nunca se inventa un identificador. | Factibilidad crea `PERSONAS` en el momento (RN-07 §3.1) | Mejorar: se registra persona provisoria o datos del solicitante y servicio solicitado (BASE §47, §48) | — | — |
| RN-CRM-007 | La solicitud de baja no genera cargo, no exige registro previo, pago de deuda ni aceptación de cargos; la deuda se informa aparte. | — | Nuevo (BASE §52.3, Ley 24.240 art. 10 quáter) | PRM-CRM-030 | — |
| RN-CRM-008 | Para servicios alcanzados (Res. 316/2018, ej. Internet) la baja debe poder iniciarse por un botón visible y público; se informa código identificador por el mismo medio dentro de 24 h; si la contratación fue electrónica/telefónica, la rescisión se admite por el mismo medio con constancia en 72 h. | — | Nuevo (BASE §52.3) | PRM-CRM-030, PRM-CRM-031, PRM-CRM-032 | Validar servicios alcanzados por jurisdicción (PA-CRM-15) |
| RN-CRM-009 | Recibir una solicitud pública no habilita a divulgar datos privados: la consulta pública del caso solo muestra estado y fechas. | — | Nuevo (BASE §48, §52.3) | — | — |
| RN-CRM-010 | La baja de un servicio no produce baja de asociado ni devolución de capital, y viceversa. | Baja de socio impedida con servicios activos salvo V2 340 (RN-06 §5) | Mantener la separación (AGR-029, BASE §48); M17 decide | — | — |
| RN-CRM-011 | Suspensión temporal no extingue el contrato; reactivar un contrato cerrado puede requerir nueva alta según el servicio. | — | Nuevo (BASE §53) | PRM-CRM-033 | — |
| RN-CRM-012 | Un costo de suspensión/reactivación solo se ofrece si la regla está habilitada **y** validada para el servicio y jurisdicción; las reglas de demostración están deshabilitadas para producción. | — | Nuevo (BASE §53 CIC-004, §52.3) | PRM-CRM-034 | — |
| RN-CRM-013 | El caso no informa "reactivado" porque se confirmó el pago de un cargo: espera la confirmación de ejecución. | — | Nuevo (BASE §53 control) | — | — |
| RN-CRM-014 | Todo comando lleva `Idempotency-Key` derivada de caso + tipo + versión; los reintentos no duplican ejecuciones ni cobros. | Números con max+1 sin bloqueo (RN-07 adicionales) | Mejorar (BASE §53, AGR-016) | — | — |
| RN-CRM-015 | La deuda previa y los documentos históricos se conservan y no impiden solicitar la baja. | — | Nuevo (BASE §53) | — | — |
| RN-CRM-016 | Mensajes visibles y notas internas son tipos distintos; una nota interna nunca se envía al socio ni se expone por API del socio. | `TICKETS_NOTAS.INTERNA` (CAT §21) | Replicar y reforzar (BASE §47) | — | — |
| RN-CRM-017 | Bot e IA solo acceden a información autorizada del tenant y del socio verificado de la sesión. | Bot por DNI sin verificación documentada (FIC 13.2) | Mejorar (BASE §47, AGR-030) | PRM-CRM-060 | — |
| RN-CRM-018 | Una sugerencia de IA no confirma bajas, devoluciones, resoluciones de falla, cobros ni decisiones clínicas. | IA resume notas y sugiere acción (RN-07 §6, §6.1) | Mejorar: solo propuesta registrada (AGR-030) | — | — |
| RN-CRM-019 | La derivación inicial corresponde a supervisión; la IA no deriva autónomamente; las reglas deterministas solo proponen salvo habilitación explícita del tenant. | — | Nuevo (BASE §47) | PRM-CRM-012 | PA-CRM-02 |
| RN-CRM-020 | Una sugerencia incorrecta se corrige sin perder el texto original; ambos quedan en el registro. | — | Nuevo (CU-CRM-01) | — | — |
| RN-CRM-021 | Un caso con datos faltantes queda creado e identificado como pendiente de completar; no se rechaza la recepción. | — | Nuevo (BASE §47 paso 4) | PRM-CRM-015 | — |
| RN-CRM-022 | Casos de un incidente común: la gestión técnica es única; cerrar el incidente lleva los casos a "resuelto pendiente de confirmación"; si un domicilio sigue afectado, ese caso se mantiene o reabre. | `Get_Incidentes` une OT y reclamos (RN-06 §23.1) | Mejorar (BASE §16, CU-16) | PRM-CRM-040 | — |
| RN-CRM-023 | Un aviso fallido queda identificado y genera acción; nunca se declara notificado por haberlo encolado. | Mensajes encolados en tabla y enviados por servicio externo (RN-07 §8.9) | Mejorar (BASE §26, AGR-024) | — | — |
| RN-CRM-024 | Constancias reguladas (baja, intimaciones) se diferencian de avisos comerciales; "aceptado por el proveedor" no equivale a "entregado" ni a evidencia. | — | Nuevo (AGR-024) | — | — |
| RN-CRM-025 | No hay edición libre de estado: cada transición se valida contra el conjunto de estados y el flujo T11 y se explica por una regla. | Cambio de estado directo; volver atrás por bandera `VUELVE` (RN-07 §6.1) | Mejorar (AGR-003) | — | — |
| RN-CRM-026 | El estado del trámite es distinto del estado real del contrato, equipo, pago y documento; el caso muestra ambos sin mezclarlos. | — | Nuevo (AGR-003) | — | — |
| RN-CRM-027 | Cancelar una visita no cancela la solicitud; anular una solicitud antes de instalar no exige circuito de retiro; si la intervención ya se ejecutó offline, se abre conflicto con ambas evidencias. | — | Nuevo (AGR-003, ESC-03) | — | — |
| RN-CRM-028 | Evidencias con versión aceptada; no se sustituyen silenciosamente; enlaces revocados dejan de funcionar. | Adjuntos en carpeta por `COD_ADJ` (RN-10 §16.2) | Reemplazar por T11 (AGR-023) | — | — |
| RN-CRM-029 | Duplicados: al crear, si existe caso abierto con misma cuenta + servicio + subtipo dentro de la ventana, se propone vincular o fusionar; nunca se bloquea la recepción. | No se permite otra OT pendiente de la misma operación para el mismo servicio; variante de 90 días (RN-07 §1) | Mejorar: advertencia y vínculo, no bloqueo | PRM-CRM-041 | — |
| RN-CRM-030 | Numeración atómica por contador transaccional; formato según política. | max+1 con o sin bloqueo (RN-07 adicionales, §6.1) | Reemplazar | PRM-CRM-001 a PRM-CRM-004 | — |
| RN-CRM-031 | Prioridad: Sin asignar 0, Crítica 1, Alta 25, Normal 50, Baja 75, Muy baja 100; menor valor = más urgente. | Gravedad de tickets (RN-07 §6) | Replicar | PRM-CRM-010 | — |
| RN-CRM-032 | Estados visibles ordenados por conjunto, mapeados a un estado base, con banderas: reasignar, vuelve, espera del socio, requiere aprobación, verificación, notificar, pausa SLA. | `TICKETS_ESTADOS` (`ORDEN`, `COD_ESTADO_BASE`, `REASIGNAR`, `VUELVE`, `REQAPROV`, `TESTING`, `ENVIARMAIL`, `ESPERA_CLIENTE`) | Replicar y ampliar | — | — |
| RN-CRM-033 | Orden de validación al avanzar estado: (1) si está tomado por el usuario se suelta y registra tiempo; (2) si está pausado, se rechaza; (3) volver atrás exige bandera "vuelve" y que no haya horas facturadas; desde cancelado vuelve al último estado no final; (4) un caso cerrado no se procesa (salvo reabrir/recuperar); (5) cancelar lleva al estado base "cancelado" del conjunto; (6) avanzar va al siguiente por orden o al elegido si la transición está permitida; (7) se fuerza asignación si el destino tiene "reasignar" o es de verificación sin verificador. | `Esprocesable` pasos 1–7 (RN-07 §6.1) | Replicar con transiciones explícitas | — | — |
| RN-CRM-034 | Reasignación permitida en estados no finales; no si el caso está tomado por otro usuario (salvo supervisor, que lo suelta con nota). | Solo en estado base 2 y no pausado/tomado (RN-07 §6.1) | Mejorar | — | — |
| RN-CRM-035 | Tipos que requieren aprobación no avanzan de "en evaluación" sin decisión T11 de un usuario con `crm.casos.aprobar`. | Pendiente → requiere permiso `Tk_Autorizar` (RN-07 §6) | Replicar vía T11 (MER-012) | — | — |
| RN-CRM-036 | Tomar: solo casos asignados a uno mismo; un usuario tiene a lo sumo un caso tomado; al tomar otro elige pausar o soltar el anterior; en verificación registra al verificador. | `TomarTicket`, `PoseeTicketTomado` (RN-07 §6, §6.1) | Replicar | — | — |
| RN-CRM-037 | Durante una llamada registrada el caso tomado se pausa y se reanuda solo, con nota interna automática. | `PausarTicketTomado` (RN-07 §6.1) | Replicar con CTI o temporizador de llamada | — | — |
| RN-CRM-038 | Pausar y soltar solo los puede hacer quien tiene tomado el caso. | RN-07 §6.1 | Replicar | — | — |
| RN-CRM-039 | "En espera del socio" alterna con el estado asignado y pausa el SLA si la política lo indica; la respuesta del socio por cualquier canal reanuda. | Alterna estado de espera y asignado (RN-07 §6.1) | Mejorar (pausa SLA) | PRM-CRM-021 | — |
| RN-CRM-040 | Cierre: subtipo con bloqueo impide cerrar; tipo de cierre obligatorio; causa obligatoria si el subtipo la registra; nota de cierre; validación interna y del socio opcionales; aviso de cierre según configuración. | `BLOQUEAR_CIERRE`, `REGISTRA_CAUSA`, tipo de cierre OK/OK con observaciones, `ValidaTicket` (RN-07 §6, §6.1) | Replicar y ampliar tipos de cierre | PRM-CRM-022 | — |
| RN-CRM-041 | Recuperar un caso cerrado o cancelado exige nota y respeta la ventana de reapertura. | Recuperar con nota (RN-07 §6) | Replicar | PRM-CRM-023 | — |
| RN-CRM-042 | No se vuelve atrás ni se recupera un caso con horas ya facturadas sin anular primero la facturación en M05. | "No se puede volver atrás un ticket facturado" (RN-07 §6) | Replicar | — | — |
| RN-CRM-043 | Cambios de vencimiento, prioridad o subtipo dejan nota interna automática; si cambia el vencimiento y el contacto tiene canal y no optó por no recibir, se le avisa la reprogramación y se anota "aviso de reprogramación enviado/cancelado". | `CambiosAlReasignar` (RN-07 §6.1) | Replicar con T09 | PRM-CRM-024 | — |
| RN-CRM-044 | Cancelar registra fecha y usuario de cierre; si cancela alguien distinto del creador se avisa al creador; con presupuesto vinculado se decide rechazado o anulado (comando M11). | `CancelarTicket` (RN-07 §6.1); casilla interna fija de respaldo | Replicar sin direcciones fijas en código | — | — |
| RN-CRM-045 | Fecha compromiso desde presupuesto: aceptado → hoy + (fecha de entrega − fecha de validez) días (30 por defecto); no aceptado → fecha de validez. El cambio avisa al último asignador. | `ModificarVencimientoTicket`, `CambioFechaVencimiento` (RN-07 §6.1) | Replicar | PRM-CRM-025 | — |
| RN-CRM-046 | Bandejas de pendientes excluyen estados finales y "sin asignar" en la vista de todos; la vista de sin responsable excluye tomados o pausados. Agrupación por fecha compromiso: Vencidos/Hoy/Mañana/Próximos 7 días/Futuro/Sin fecha. | `GetListaTickets` (reintentos 3 × 350 ms) (RN-07 §6.1) | Replicar agrupación; reintentos se reemplazan por manejo estándar de errores | — | — |
| RN-CRM-047 | Indicador "sin intervención": casos sin evento de trabajo en 7 días y en 8 o más días. | Informe de pendientes por usuario (RN-07 §6.1) | Replicar | PRM-CRM-026 | — |
| RN-CRM-048 | Desvío de vencimiento = fecha de cierre − fecha compromiso, solo para casos cerrados, con filtro correcto (sin el bug de resultado vacío). | `GetDesvioFechaVto` con bug (RN-07 §6.1) | Mejorar (corregir) | — | — |
| RN-CRM-049 | Unificar contactos conserva el más antiguo, reapunta casos y marca los demás como fusionados (sin borrado físico). | `UnificarContactos` borra los demás (RN-07 §6.1) | Mejorar | — | — |
| RN-CRM-050 | Tiempo: minutos reales = suma de worklogs; minutos a facturar editables (si 0, se usan los reales); bolsas mensuales de soporte y de implementación/venta se descuentan antes de facturar; valor hora y producto de facturación configurables. | `GetTicketsFacturar`, `Aplicar_Bonificaciones`, producto 464 fijo, valor hora 2488 (RN-07 §6) | Mejorar (sin producto fijo; facturación por comando M05) | PRM-CRM-090 a PRM-CRM-093 | PA-CRM-12 |
| RN-CRM-051 | Asignar guarda historial y avisa al asignado; puede reiniciar fechas estimadas si cambia el responsable. | `AsignarTicket` (RN-07 §6.1) | Replicar | — | — |
| RN-CRM-052 | SLA: al crear se resuelve la política más específica (subtipo > tipo; servicio; prioridad); objetivos de primera respuesta y resolución en calendario hábil o corrido; pausa en estados con bandera; alerta en umbral; vencido escala; reclasificar recalcula y registra. | No existe motor de SLA; solo `TECNICA.VENCE` impreso (RN-07 §2) | Nuevo (DFA M14 mejoras, RN-07 §10.6) | PRM-CRM-020, PRM-CRM-021, PRM-CRM-027, PRM-CRM-028 | PA-CRM-03 |
| RN-CRM-053 | Avisos al socio: cada estado visible define si notifica, plantilla y canales; los avisos respetan preferencias, salvo constancias reguladas. | `ENVIARMAIL` por estado; plantillas de alta, cierre, modificación (RN-07 §6.1) | Replicar con T09 | PRM-CRM-050 a PRM-CRM-053 | — |
| RN-CRM-054 | Reapertura dentro de la ventana conserva número e incrementa el contador de ciclos; fuera de ventana se crea caso nuevo vinculado como reincidencia. | — | Nuevo (BASE §16, §39.5) | PRM-CRM-023 | PA-CRM-05 |
| RN-CRM-055 | Reincidencias: grupos de más de un caso por cuenta, por cuenta+servicio o por cuenta+servicio+tipo en el período. | Informe de reincidencias por OT (RN-07 §1.11) | Replicar sobre casos | — | — |
| RN-CRM-056 | Estadísticas de demora: desde fecha del caso y desde fecha de registro hasta cierre o "ahora", piso 0; "período anterior" = mismo filtro con todo lo anterior a la fecha desde. | `Get_Reporte_Estadisticas` (RN-07 §1.11) | Replicar | — | — |
| RN-CRM-057 | Numeración de reclamos: sin política única, por reclamo/no reclamo, por tipo, por tipo y reclamo; continua; por servicio en informe. | Parámetros 344, 2998, 3031 (RN-07 §2, RN-09) | Replicar como política de numeración | PRM-CRM-001 a PRM-CRM-004 | — |
| RN-CRM-058 | Vía de ingreso: por defecto configurable; obligatoria si se habilita; cada vía puede exigir validar celular o email del solicitante. | `VIAINGTE` (`VALIDAR_CELULAR`, `VALIDAR_MAIL`); 333, 2629 | Replicar | PRM-CRM-005, PRM-CRM-006 | — |
| RN-CRM-059 | Trámite vencido: su fecha de vencimiento pasó o, si no tiene, fecha + días de vencimiento del tipo es anterior a hoy, y no existe otro trámite vigente del mismo tipo para la misma entidad. | `Get_TramitesPresentados` (RN-06 §23.3) | Replicar | — | — |
| RN-CRM-060 | Acciones de trámite al alta y al vencimiento son comandos tipados al módulo dueño; un error en una acción no frena las demás, se registra y se reintenta; marca "accionado". | Scripts SQL libres con `{0}`/`{1}` (`TRAMITES_ACCIONES`, RN-06 §23.3, 600) | Reemplazar (seguridad, AGR-002) | PRM-CRM-085 | Relevar scripts configurados en cooperativas (RN-06 duda 22) |
| RN-CRM-061 | Turno: número correlativo por día y área de origen; código visible por nombre (si se habilita), letra + últimos 3 dígitos del documento (si se habilita y hay documento) o letra + número de 3 dígitos. Se registran acciones "recepción" y "en espera". | `CrearTurno` (RN-10 §16.1) | Replicar (nombre deshabilitado por defecto, ver CTR-CRM-17) | PRM-CRM-100, PRM-CRM-101 | Verificar uso en LAG (RN-10) |
| RN-CRM-062 | Estados del turno: en espera, llamando, en atención, finalizado; acciones: recepción, en espera, llamado, atendido, derivado, retirado solucionado, retirado sin solución, retirado sin atención; cada cambio con hora del servidor, box, área y usuario. | RN-10 §16.1 (estados 1–4, acciones 1–8) | Replicar | — | — |
| RN-CRM-063 | Llamar siguiente: transacción con exclusión; toma el próximo en espera de las áreas del usuario, prioritarios primero y luego por hora de ingreso; lo pasa a "llamando" y refresca pantallas. | `LlamarSiguiente` con bloqueo de tabla (RN-10 §16.1) | Replicar con actualización condicional atómica | — | — |
| RN-CRM-064 | Usuario sin áreas asignadas = recepción, ve todas las áreas habilitadas. | `GetAreasUsuario` (RN-10 §16.1) | Replicar | — | — |
| RN-CRM-065 | Un box no puede estar abierto dos veces; cerrar es idempotente; al ingresar se carga el último box abierto del usuario. | `AbrirBox`, `CerrarBox`, `CargarBox` (RN-10 §16.1) | Replicar | — | — |
| RN-CRM-066 | Derivar un turno cambia su área actual y conserva el área de origen. | `ActualizarTurno` (RN-10 §16.1) | Replicar | — | — |
| RN-CRM-067 | Tiempo estimado: reparte los turnos pendientes (por prioridad y hora) entre los usuarios con box abierto hoy en el área y suma el tiempo estimado del área de los turnos asignados antes del consultado; devuelve minutos. | `GetTiempoEstimadoTurno` (RN-10 §16.1) | Replicar | — | — |
| RN-CRM-068 | Estadísticas: cuentan ingresados (acción recepción), atendidos, abandonos (sin atención) y prioritarios; tiempos de espera y atención hasta el movimiento siguiente; opción de excluir movimientos cuyo siguiente llega ≥ 5 h después. | `GetEstadisticas` (RN-10 §16.1) | Replicar | PRM-CRM-108 | — |
| RN-CRM-069 | Últimos llamados: los 5 últimos del día agrupados por box o por turno. | `GetLamadas` (RN-10 §16.1); 2209 | Replicar | PRM-CRM-103 | — |
| RN-CRM-070 | El box de generación automática se excluye de la lista de boxes abiertos. | `GetBoxesAbiertos` excluye 2014 (RN-10 §16.1) | Replicar | PRM-CRM-105 | — |
| RN-CRM-071 | Al cierre del día los turnos en espera pasan a "retirado sin atención" con acción automática. | No documentado | Nuevo (consistencia de estadísticas) | PRM-CRM-109 | — |
| RN-CRM-072 | Frecuencias: próxima fecha = última + período (semanal 7 d; mensual, bimestral, trimestral, cuatrimestral, semestral, anual por meses calendario; manual cada N días). | `GetFechaActividad` (RN-07 §7) | Replicar | — | — |
| RN-CRM-073 | Se genera la siguiente ocurrencia solo para actividades automáticas y vigentes, cuando próxima fecha − margen anterior ≤ hoy y la próxima fecha no supera la vigencia; numeración atómica; marca automática. | `GenerarSeguimiento` (RN-07 §7.1) | Replicar | — | — |
| RN-CRM-074 | No puede haber dos frecuencias con igual tipo y cantidad de días. | `ValidarExistencia` (RN-07 §7.1) | Replicar | — | — |
| RN-CRM-075 | Destinatarios de recordatorios: unión sin repetidos de responsables y destinatarios adicionales del área y de la actividad. | `GetlstMails` (RN-07 §7.1) | Replicar por usuarios y grupos | — | — |
| RN-CRM-076 | Días de envío: 0 = todos los días; 1–7 = día ISO (lunes = 1). | `DIAS_ENVIO` (RN-07 §7.1) | Replicar | — | — |
| RN-CRM-077 | Recordatorios una vez por día: el job registra la fecha de último envío por tenant y es idempotente. | Parámetro 681 fecha del último envío (RN-07 §7, RN-09) | Replicar como marca de job | PRM-CRM-120 | — |
| RN-CRM-078 | Estado de ocurrencia: cerrada en término si fecha de cierre ≤ fecha + margen posterior; fuera de término si es posterior; próxima a vencer si hoy ∈ [fecha − margen anterior, fecha + margen posterior]; vencida si hoy > fecha + margen posterior. | Filtros "en término" y "fuera de término" invertidos (RN-07 §7) | Mejorar (corregir) | — | — |
| RN-CRM-079 | Al cerrar una ocurrencia se envía aviso de finalización de forma asíncrona. | `EnviarMailFinalizacion` en hilo aparte (RN-07 §7.1) | Replicar vía T09 | — | — |
| RN-CRM-080 | La cita de calendario se crea para el usuario responsable (identificado por usuario, no por email). | Solo si un usuario tiene el mismo mail que el responsable (RN-07 §7.1) | Mejorar | — | — |
| RN-CRM-081 | El bot solo consulta o crea casos; pagos solo por link del proveedor (M07); la baja iniciada por bot sigue el circuito de baja con constancia. | Bot de reclamos/cuentas (FIC 13.2) | Mejorar (AGR-002) | — | — |
| RN-CRM-082 | Fuera de la ventana de 24 h de WhatsApp solo se envían plantillas aprobadas; opt-out bloquea mensajes no transaccionales; demora mínima entre mensajes según proveedor. | WhatsApp oficial con plantillas (3105), demora (2872) (RN-10 §5) | Replicar en T09 | PRM-CRM-061, PRM-CRM-062 | — |
| RN-CRM-083 | Destino de WhatsApp/SMS: móvil de la cuenta, teléfono web o teléfono de la persona según preferencia y verificación; agrupar facturas por socio cuando corresponda. | 2824, 3051, 3121 (RN-07 §8.9) | Reemplazar por resolución de contacto T09 | — | — |
| RN-CRM-084 | Guardias: reglas por servicio, tipo, operaciones, días de semana, franja horaria, feriados y momento (al crear/al derivar); canal según preferencias T09. | `RESPONSA_NOTIFICA`, canal único 3088 (RN-07 §1) | Replicar para casos; canal por preferencias | PRM-CRM-042 | — |
| RN-CRM-085 | Mesa de entradas/incidente: correo a la cuenta configurada del incidente, a cada interviniente y al titular, cada uno habilitable. | 2630, 2631, 2632 (sin uso directo en código) | Replicar como reglas de aviso | PRM-CRM-043 a PRM-CRM-045 | Uso real en cooperativas |
| RN-CRM-086 | Distribución porcentual de una categoría de incidente por sección debe sumar 100 % (validación en M10). | No se valida (RN-07 adicionales) | Mejorar (M10) | — | Duda RN-07 §11.6 (secciones de red vs centros de costo) |
| RN-CRM-087 | Fallo o respuesta insegura de IA no bloquea la recepción; la clasificación incierta deja el caso sin clasificar en supervisión. | — | Nuevo (AGR-030) | PRM-CRM-070, PRM-CRM-071 | — |
| RN-CRM-088 | Casos de servicios sociales y salud se marcan sensibles: acceso restringido, IA deshabilitada por defecto, resúmenes sin datos clínicos. | — | Nuevo (AGR-030, T08) | PRM-CRM-072 | — |
| RN-CRM-089 | Los adjuntos se relacionan con su entidad (caso, mensaje, ocurrencia, trámite) en el expediente T11. | Tipos de relación de `ADJUNTOS` (RN-10 §16.2, RN-06 §23.1) | Reemplazar por T11 | — | — |
| RN-CRM-090 | Circular: el universo se filtra por titulares, cuentas, servicios, deudas (tipo y mínimo), mora y adhesión; se congela al generar. | frmCirculares (`GetFiltros*`), `CIRCULAR.TDEUDA`, `DEUDA`, `ADHER` | Replicar con audiencia T09 | — | — |
| RN-CRM-091 | Cargo por visita improcedente solo con regla aprobada y aviso previo al socio; el CRM no lo genera. | `CONEXION.RECLAMO` (RN-07 §2) | Mejorar | PRM-CRM-047 | PA-CRM-18 |
| RN-CRM-092 | La conformidad registrada en campo no cierra el caso sin regla del tipo; la disconformidad lo devuelve a tratamiento. | `RESP_ENC`, `MOTIVO_DISCONFORME` (RN-07 §2) | Mejorar | PRM-CRM-046 | — |
| RN-CRM-093 | Una sola encuesta post-cierre por caso; no repetir encuesta al mismo socio dentro del intervalo configurado. | `ENCUESTAS` (`REPETIBLE`, `INTERVALO_REPITE`, `PROBABILIDAD`) | Replicar en T09 | PRM-CRM-054, PRM-CRM-055 | — |
| RN-CRM-094 | Un caso resuelto sin respuesta del socio se cierra automáticamente tras el plazo; la respuesta negativa lo reabre. | — | Nuevo (BASE §47 pendientes) | PRM-CRM-022 | PA-CRM-04 |
| RN-CRM-095 | Recepción de mensajes entrantes: el tenant se determina por el canal registrado (número, casilla, página); mensajes de remitentes no identificados crean interacción "no identificada". | — | Nuevo (DEC-002) | — | — |
| RN-CRM-096 | Restauración desde backup: no se reenvían avisos ni comandos ya aceptados por proveedores; se concilian por identificador externo. | — | Nuevo (ESC-04) | — | — |
| RN-CRM-097 | Notas de OT con "visible en caja" y notas de cuenta con bloqueo de caja pertenecen a M10/M01; el CRM las muestra en la vista 360 sin duplicarlas. | `NOTA_SUM.BLO_CAJ`, `MSG_CAJ`; nota "Orden de cambio de estado" visible en caja (RN-06, RN-07) | Consumir | — | — |

## 7. Modelo de datos

**Campos comunes** (no se repiten en cada tabla): `_id` (ObjectId), `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy` (userId o principal de servicio), `version` (int, control optimista), `deletedAt` (borrado lógico solo en catálogos; los casos, eventos, mensajes, interacciones, turnos y ocurrencias **nunca** se borran). Los catálogos configurables llevan además `code` (string único por tenant), `nameKey` (clave `dict:`), `active` (bool), `order` (int) y `validFrom`/`validTo` cuando corresponda. Los importes se guardan en `Decimal128` con `currency` (`ARS` por defecto). Las fechas en UTC; los cálculos de calendario usan la zona horaria del tenant.

### 7.1 `crmCases` — caso/expediente de atención

Propósito: expediente único de cualquier gestión (solicitud, reclamo, consulta, pedido, mesa de entradas, otros).

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | Número de seguimiento visible (ej. `TCK-2026-000123`), único por tenant. |
| `numberingKey` | string | Sí | Clave del contador usado (política de numeración). |
| `kind` | enum | Sí | `request` (solicitud comercial), `complaint` (reclamo), `inquiry` (consulta), `order` (pedido), `deskEntry` (mesa de entradas), `suggestion` (sugerencia/felicitación), `other`. |
| `caseTypeId` | ObjectId → `crmCaseTypes` | Sí | Tipo de gestión. |
| `caseSubtypeId` | ObjectId → `crmCaseSubtypes` | No | Subtipo/motivo. |
| `statusSetId` | ObjectId → `crmStatusSets` | Sí | Conjunto de estados vigente al crear. |
| `status` | string | Sí | Código del estado visible actual. |
| `baseStatus` | enum | Sí | `draft`, `received`, `pendingInfo`, `derived`, `assigned`, `inProgress`, `waitingCustomer`, `inEvaluation`, `approved`, `rejected`, `inExecution`, `resolved`, `reopened`, `closed`, `cancelled`, `merged`, `conflict`. |
| `priority` | int | Sí | 0 sin asignar, 1 crítica, 25 alta, 50 normal, 75 baja, 100 muy baja. |
| `urgentSafety` | bool | No | Protocolo de urgencia de seguridad (RF-CRM-122). |
| `sensitive` | bool | No | Caso sensible (RN-CRM-088). |
| `subject` | string(200) | Sí | Asunto. |
| `description` | string(10000) | Sí | Descripción original del solicitante (inmutable; ediciones generan evento). |
| `origin` | objeto | Sí | `{ channelId, channelKind, intakeRouteCode, module (crm/m03/m05/m08/m10/m19/public/bot), sourceRef, conversationId, createdByActor (customer/employee/bot/system/public) }`. |
| `requester` | objeto | Sí | `{ personId?, userId?, displayName, documentType?, documentNumber?, phone?, email?, identityStatus (verified/unverified/pendingIdentification), publicVerificationCodeHash? }`. |
| `context` | objeto | No | `{ accountId?, contractId?, serviceId?, requestedServiceId?, requestedPlanId?, premiseId?, servicePointId?, invoiceId?, addressSnapshot?, zoneId?, localityId?, networkNodeId?, geo? }`. |
| `contactIds` | ObjectId[] → `crmContacts` | No | Contactos adicionales. |
| `areaId` | ObjectId → `crmAreas` | No | Área actual. |
| `assigneeUserId` | ObjectId | No | Responsable actual. |
| `supervisorUserId` | ObjectId | No | Supervisor que derivó. |
| `takenBy` | objeto | No | `{ userId, takenAt, pausedAt? }` (un solo tomado por usuario). |
| `queueOrder` | int | No | Orden en la cola personal del asignado. |
| `dueAt` | date | No | Fecha compromiso. |
| `sla` | objeto | No | `{ policyId, policyVersion, calendarId, firstResponseDueAt, resolutionDueAt, firstRespondedAt?, pausedMs, pausedSince?, warnedAt?, breachedFirstResponse (bool), breachedResolution (bool), escalationLevel }`. |
| `requestedDate` | date | No | Fecha solicitada por el socio (solicitudes). |
| `effectiveDate` | date | No | Fecha efectiva informada por el módulo ejecutor. |
| `requirements` | objeto[] | No | `{ code, nameKey, kind (data/document/feasibility/acceptance/signature), required, status (pending/provided/accepted/rejected/waived), documentId?, value?, note }`. |
| `acceptedTerms` | objeto[] | No | `{ termsCode, termsVersion, acceptedAt, channel, amount?, currency? }`. |
| `customFields` | objeto | No | Campos adicionales del tipo, validados por su esquema. |
| `tags` | string[] | No | Etiquetas. |
| `links` | objeto[] | No | `{ entityType (workOrder/contract/invoice/payment/quote/incident/case/project/procedureRecord/deskEntry/queueTicket), entityId, relation (origin/derived/duplicateOf/relatedTo/parentIncident), createdAt, createdBy }`. |
| `incidentId` | ObjectId → `crmIncidents` | No | Incidente común vinculado. |
| `projectId` | ObjectId → `crmProjects` | No | Proyecto. |
| `componentCode` | string | No | Módulo/componente afectado. |
| `quoteId` | ObjectId (M11) | No | Presupuesto vinculado. |
| `aiClassification` | objeto | No | `{ suggestionId, status (pending/accepted/corrected/discarded) }`. |
| `resolution` | objeto | No | `{ resolutionCode, resolutionText, closeType (conforming/conformingWithObservations/unresolved/notApplicable), causeCode?, favorable (bool)?, reviewedBy?, reviewedAt?, internalValidation (bool)?, customerValidation (accepted/rejected/none), customerComment?, resolvedAt, resolvedBy }`. |
| `closedAt`, `closedBy` | date, ObjectId | No | Cierre. |
| `cancellation` | objeto | No | `{ reason, cancelledAt, cancelledBy, byCustomer (bool) }`. |
| `reopenCount` | int | Sí (0) | Ciclos de reapertura. |
| `mergedIntoCaseId` | ObjectId | No | Caso principal si fue fusionado. |
| `survey` | objeto | No | `{ surveyId, sentAt, respondedAt, score?, npsCategory? }` (T09). |
| `deskEntry` | objeto | No | Solo `kind = deskEntry`: `{ registerNumber, documentKind (note/courtOrder/summons/registeredLetter/agencyNote/written), senderKind (agency/court/person/supplier/other), senderName, senderReference, receivedAt, receivedVia, folios, responseDueAt?, dueCalendar (business/calendar), transfers[] { fromAreaId, toAreaId, sentAt, sentBy, acknowledgedAt?, acknowledgedBy?, note }, outgoing[] { outgoingNumber, sentAt, channel, documentId, recipient } }`. |
| `cancellationRequest` | objeto | No | Solicitudes de baja: `{ isPublic (bool), regulatoryRegime (res316/law24240/other), receiptCode, receiptIssuedAt?, receiptChannel, receiptDeadlineAt }`. |
| `regulatory` | objeto | No | `{ regulatorCode, fields{} }` para reclamos regulatorios. |
| `metrics` | objeto | No | Derivados para reportes: `{ firstResponseMs, resolutionMs, totalMs, pausedMs, areasCount, reassignmentsCount, messagesIn, messagesOut }`. |
| `lastActivityAt` | date | Sí | Último evento de trabajo (indicador "sin intervención"). |
| `migratedFrom` | objeto | No | `{ system: 'procoop', table, key }`. |

Índices: `{tenantId, number}` único; `{tenantId, baseStatus, areaId, priority, dueAt}`; `{tenantId, assigneeUserId, baseStatus, queueOrder}`; `{tenantId, 'requester.personId', createdAt}`; `{tenantId, 'context.accountId', 'context.contractId', caseSubtypeId, baseStatus}` (duplicados); `{tenantId, incidentId}`; `{tenantId, 'sla.resolutionDueAt', baseStatus}` (monitor SLA); `{tenantId, 'deskEntry.registerNumber'}` único parcial; `{tenantId, 'cancellationRequest.receiptCode'}` único parcial; texto `{subject, description}` por tenant.

Mapeo ProCoop: `TICKETS` (COD_TICKET → `number` migrado, COD_TIPO → `caseTypeId`, COD_SUBTIPO → `caseSubtypeId`, COD_ESTADO → `status`, COD_MODULO → `componentCode`, USER_CREACION/FEC_CREA → `createdBy/createdAt`, ASUNTO, DESCRIPCION, ESTIMADO_MINUTOS/INICIO_ESTIMADO/FIN_ESTIMADO → `customFields.estimate*`/`dueAt`, COD_MEDIO → `origin.channelId`, gravedad → `priority`, FEC_VENC → `dueAt`), `TICKETS_EXTRAS` → `customFields`, `RECLAMOS` (COD_REC, RUB_REC → subtipo, DES_REC, FEC_REC, USU_REC, COD_SUM → `context.accountId`, ESTADO/FEC_EST, TXT_RES, FAVORABLE, USU_REV/FEC_REV, USU_RES), `TECNICA` con `RECLAMO = true` (caso `complaint` + vínculo a la OT migrada en M10; `COD_SLS` → `number`, `COD_VIA` → `origin.intakeRouteCode`, `COD_CIN` → categoría vía M10), `PTRAMITES` (ver §7.17).

### 7.2 `crmCaseEvents` — historial inmutable del caso

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `crmCaseId` | ObjectId | Sí | Caso. |
| `seq` | int | Sí | Secuencia dentro del caso. |
| `type` | enum | Sí | `created`, `statusChanged`, `classified`, `reclassified`, `derived`, `returnedToSupervision`, `assigned`, `taken`, `paused`, `released`, `resumed`, `priorityChanged`, `dueChanged`, `subtypeChanged`, `requirementUpdated`, `documentAdded`, `messageAdded`, `noteAdded`, `commandRequested`, `commandResolved`, `linked`, `unlinked`, `merged`, `incidentLinked`, `slaWarned`, `slaBreached`, `slaPaused`, `slaResumed`, `escalated`, `customerNotified`, `notificationFailed`, `aiSuggested`, `aiDecided`, `resolved`, `closed`, `reopened`, `recovered`, `cancelled`, `surveySent`, `surveyAnswered`, `conflictOpened`, `conflictResolved`, `migrated`. |
| `at` | date | Sí | Momento del servidor. |
| `actor` | objeto | Sí | `{ kind (user/customer/bot/system/integration), userId?, personId?, principal? }`. |
| `from`, `to` | objeto | No | Valores anterior y nuevo (estado, área, responsable, prioridad, fecha). |
| `reason` | string | No | Motivo/nota. |
| `refs` | objeto | No | `{ messageId?, commandRequestId?, suggestionId?, communicationId?, documentId? }`. |
| `visibleToCustomer` | bool | Sí | Si aparece en el timeline del socio. |

Índices: `{tenantId, crmCaseId, seq}` único; `{tenantId, type, at}`. Mapeo: `RECLAMOS_HIST` (FECHA, ESTADO, USUARIO, OBSERVA), `TICKETS_ASIGNACIONES` (USER_ASIGNA, USER_ASIGNADO, FECHA_ASIGNACION).

### 7.3 `crmConversations` — hilo por canal

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `channelId` | ObjectId → `crmChannels` | Sí | Canal. |
| `channelKind` | enum | Sí | `whatsapp`, `webchat`, `email`, `sms`, `phone`, `ivr`, `facebook`, `instagram`, `portal`, `presential`. |
| `externalThreadId` | string | No | Id del proveedor (número, hilo de email, id de chat). No es referencia: identificador externo del hilo (PA-CRM-20). |
| `participant` | objeto | Sí | `{ address (teléfono/email/psid), personId?, identityStatus, verifiedAt?, verificationMethod? }`. |
| `status` | enum | Sí | `botActive`, `queued`, `assigned`, `active`, `waitingCustomer`, `closed`, `expired`. |
| `assignedUserId` | ObjectId | No | Agente. |
| `caseIds` | ObjectId[] | No | Casos vinculados. |
| `windowExpiresAt` | date | No | Fin de ventana de 24 h (WhatsApp). |
| `botSessionId` | ObjectId | No | Sesión del bot. |
| `optOut` | bool | No | El participante pidió no recibir mensajes no transaccionales. |
| `lastMessageAt` | date | Sí | Último mensaje. |

Índices: `{tenantId, channelId, externalThreadId}` único; `{tenantId, status, channelKind, lastMessageAt}`; `{tenantId, 'participant.personId'}`.

### 7.4 `crmMessages` — mensajes y notas

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `conversationId` | ObjectId | No | Conversación (null para notas del caso). |
| `crmCaseId` | ObjectId | No | Caso. |
| `direction` | enum | Sí | `inbound`, `outbound`, `internal`. |
| `visibility` | enum | Sí | `public` (visible al socio), `internal`, `restricted` (requiere `crm.notasRestringidas.ver`). |
| `authorKind` | enum | Sí | `customer`, `employee`, `bot`, `system`, `ai` (solo si un humano confirmó). |
| `authorUserId` | ObjectId | No | Empleado. |
| `body` | string(20000) | No | Texto (sanitizado). |
| `format` | enum | Sí | `text`, `html`, `template`, `media`, `location`, `interactive`. |
| `templateRef` | objeto | No | `{ templateKey, templateVersion, variables{} }`. |
| `attachments` | objeto[] | No | `{ documentId (T11), mimeType, sizeBytes, scanStatus (pending/clean/infected) }`. |
| `providerMessageId` | string | No | Id externo (idempotencia). |
| `delivery` | objeto | No | `{ communicationId (T09), status (created/queued/accepted/delivered/read/failed), statusAt, error? }`. |
| `isAutomatic` | bool | No | Nota automática (cambio de vencimiento, pausa por llamada). |
| `workLogId` | ObjectId | No | Registro de tiempo asociado. |
| `flags` | objeto | No | `{ complaintMark (bool) }` (nota marcada como reclamo del cliente, `TICKETS_NOTAS.RECLAMO`). |
| `aiSuggestionId` | ObjectId | No | Si nació de una sugerencia aceptada. |

Índices: `{tenantId, crmCaseId, createdAt}`; `{tenantId, conversationId, createdAt}`; `{tenantId, providerMessageId}` único parcial. Mapeo: `TICKETS_NOTAS` (DESCRIPCION, INTERNA, ELIMINADA → evento, FECHAADD/FECHAMOD, RECLAMO → `flags.complaintMark`, PAUSADO/ESTESTING/FECHAINICIO/FECHAFIN → `crmWorkLogs`), `RECLAMOS_NOTAS` (DESCRIPCION, FECHA, COD_USER, ACCION).

### 7.5 `crmInteractions` — historial unificado de interacciones

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `personId` | ObjectId | No | Persona (null si no identificada). |
| `accountId`, `contractId` | ObjectId | No | Cuenta y servicio. |
| `channelKind` | enum | Sí | Igual que conversaciones + `deskEntry`, `queue`. |
| `direction` | enum | Sí | `inbound`, `outbound`. |
| `kind` | enum | Sí | `call`, `message`, `email`, `visit`, `queueAttention`, `botSession`, `portalAction`, `deskEntry`, `notification`, `survey`. |
| `startedAt`, `endedAt` | date | Sí/No | Duración. |
| `reasonCode` | string | No | Motivo (catálogo de subtipos o motivos de atención presencial). |
| `outcome` | enum | No | `resolvedAtContact`, `caseCreated`, `caseUpdated`, `informed`, `noAnswer`, `abandoned`, `transferred`. |
| `crmCaseId`, `conversationId`, `queueTicketId`, `communicationId` | ObjectId | No | Referencias. |
| `userId` | ObjectId | No | Empleado que atendió. |
| `summary` | string(2000) | No | Resumen. |
| `call` | objeto | No | `{ fromNumber, toNumber, ctiCallId?, recordingRef? }`. |

Índices: `{tenantId, personId, startedAt}`; `{tenantId, accountId, startedAt}`; `{tenantId, channelKind, startedAt}`.

### 7.6 `crmCaseTypes` — tipos de gestión

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `kind` | enum | Sí | Igual a `crmCases.kind`. |
| `requestAction` | enum | No | Solo `request`: `serviceActivation`, `serviceCancellation`, `temporarySuspension`, `reactivation`, `ownerChange`, `planChange`, `relocation`, `equipmentChange`, `meterChange`, `reconnection`, `feasibility`, `digitalInvoiceEnrollment`, `directDebitEnrollment`, `contactDataUpdate`, `additionalEquipment`, `memberExit`, `identityDocumentRegularization` (tarea interna de regularización del documento de una persona migrada con `identificationStatus = documentPending`; la abre M01, no se ofrece al socio; RF-CRM-261, DEC-099), `custom`. |
| `serviceIds` | ObjectId[] | No | Servicios a los que aplica (vacío = todos). |
| `statusSetId` | ObjectId | Sí | Conjunto de estados. |
| `workflowDefinitionId` | ObjectId (T11) | No | Flujo de aprobación. |
| `requirementsTemplate` | objeto[] | No | Requisitos por defecto (mismo esquema que `crmCases.requirements`). |
| `customFieldsSchema` | objeto | No | Esquema JSON de campos adicionales. |
| `commandsOnApproval` | objeto[] | No | `{ module, command, payloadMapping, order, dependsOn? }`. |
| `defaultAreaId` | ObjectId | No | Área sugerida. |
| `defaultPriority` | int | No | Prioridad por defecto. |
| `slaPolicyId` | ObjectId | No | Política SLA. |
| `numberingPolicy` | objeto | No | `{ scope (tenant/service/type/complaintFlag), resetYearly (bool), prefix }`. |
| `publicIntake` | bool | No | Admite recepción pública (bajas). |
| `customerVisible` | bool | Sí | Se ofrece en portal/app/bot. |
| `requiresAccount` | bool | Sí | Exige cuenta (false en altas). |
| `allowsAnonymous` | bool | No | Admite casos sin persona identificada. |
| `surveyTemplateId` | ObjectId (T09) | No | Encuesta post-cierre. |
| `autoCloseDays` | int | No | Días para cierre automático tras resuelto. |
| `reopenWindowDays` | int | No | Ventana de reapertura. |
| `regulatorCode` | string | No | Regulador si es tipo regulatorio. |
| `sensitive` | bool | No | Tipo sensible. |
| `templateKeys` | objeto | No | Claves de plantillas T09 por evento (`created`, `statusChanged`, `pendingInfo`, `resolved`, `closed`, `receipt`). |
| `billingMode` | enum | No | `none`, `hours` (facturación de horas, PA-CRM-12). |
| `projectId` | ObjectId | No | Proyecto por defecto. |

Mapeo: `TICKETS_TIPOS` (DES_TIPO, COD_PROYECTO, COD_TIPOESTADO → `statusSetId`, PLANTILLA → `templateKeys`, TIPO_BONIFICACION → hour bank kind), `TRAMITES` cuando son trámites de atención, `TRANSAC` con `TRANSAC_RECLAMO` (operación 6 "Incidente/Reclamo") → tipo `complaint` técnico.

### 7.7 `crmCaseSubtypes` — subtipos/motivos

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `caseTypeId` | ObjectId | Sí | Tipo padre. |
| `defaultStatus` | string | No | Estado inicial (`TICKETS_SUBTIPOS.COD_ESTADO`). Valor: un `code` de `crmStatusSets.states[]` (§7.8) del conjunto asignado al tipo, con `isInitial = true`; si falta, se usa el estado inicial del conjunto. |
| `defaultPriority` | int | No | Prioridad. |
| `urgentSafety` | bool | No | Activa protocolo de urgencia. |
| `slaPolicyId` | ObjectId | No | SLA específico. |
| `registersCause` | bool | Sí | Causa obligatoria al cerrar. |
| `causeCodes` | string[] | No | Causas permitidas. |
| `blockClosure` | bool | Sí | Bloqueo de cierre. |
| `isDefault` | bool | No | Subtipo por defecto del tipo. |
| `productId` | ObjectId (M02) | No | Producto de facturación asociado (horas). |
| `incidentCategoryId` | ObjectId (M10) | No | Categoría técnica de incidente equivalente. |
| `workOrderOperationCode` | string (M10) | No | Operación de OT a solicitar. |
| `quickReplyIds` | ObjectId[] | No | Respuestas rápidas sugeridas. |
| `duplicateWindowDays` | int | No | Ventana para duplicados (default PRM-CRM-041). |
| `incidentDetection` | objeto | No | `{ enabled, threshold, windowMinutes, groupBy (zone/node/locality) }`. |
| `claimTypeKey` | string | No | Clave completa del diccionario de T03 §10.9.12 (RF-UXD-179), patrón `crm.claimType.<dominio>.<tipo>`: `crm.claimType.clo.desborde`, `crm.claimType.clo.obstruccion`, `crm.claimType.alu.luminariaApagada` (RF-CRM-259). M09 no crea claves propias equivalentes. |
| `externalDerivation` | objeto | No | `{ mode (cooperative/municipality/byAgreement), agreementSource (M02 domainAttributes.agreement.claimHandler), channel (email/portal/api/manual), recipientRef, awaitingStatusCode }` (RF-CRM-259). |
| `regulatoryReasonCode` | string | No | Motivo regulatorio (por ejemplo ENACOM) con el que el subtipo se informa en T10 (RF-CRM-114, RF-CRM-258). |

Mapeo: `TICKETS_SUBTIPOS` (DES_SUBTIPO, COD_TIPO, COD_ESTADO, COD_PROD, PLANTILLA, REGISTRA_CAUSA, POR_DEFECTO, BLOQUEAR_CIERRE); rubros de `RECLAMOS.RUB_REC`.

### 7.8 `crmStatusSets` — conjuntos de estados visibles

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `states` | objeto[] | Sí | `{ code, nameKey, order, baseStatus, allowReassign, allowBack, waitingCustomer, requiresApproval, verification, notifyCustomer, notifyTeam, pausesSla, isFinal, isInitial, color }`. |
| `transitions` | objeto[] | No | `{ from, to, capability, requiresReason }` (si vacío: secuencial por `order` más cancelar). |
| `workflowRef` | ObjectId → T11 `workflowDefinitions` | No | Definición de máquina de estados en T11 (PA-CRM-20; antes "ObjectId (T11)"). |

Regla: cada conjunto debe tener al menos un estado inicial y estados con base `resolved`, `closed` y `cancelled`. Mapeo: `TICKETS_TIPOSESTADOS` (DES_TIPOESTADO), `TICKETS_ESTADOS` (DES_ESTADO, ORDEN, COD_ESTADO_BASE, REASIGNAR, VUELVE, COD_TIPOESTADO, REQAPROV, TESTING, ENVIARMAIL, ESPERA_CLIENTE).

### 7.9 `crmAreas` — áreas de atención, turnero y actividades

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `roles` | enum[] | Sí | `caseHandling`, `queue`, `activities`, `deskEntry`. |
| `branchIds` | ObjectId[] | No | Sucursales. |
| `serviceIds` | ObjectId[] | No | Servicios que atiende. |
| `managerUserId` | ObjectId | No | Responsable. |
| `members` | objeto[] | No | `{ userId, role (member/supervisor/onCall) }`. |
| `extraRecipients` | objeto[] | No | `{ userId? \| groupId? \| email? }`. |
| `reminderWeekday` | int | No | 0 = todos los días; 1–7 día ISO. |
| `businessCalendarId` | ObjectId (T04) | No | Calendario hábil. |
| `queue` | objeto | No | Solo rol `queue`: `{ letter, estimatedServiceSeconds, disabled, imageDocumentId, displayIds[] }`. |
| `onCallSchedule` | objeto[] | No | Guardias: `{ weekday, from, to, userId }`. |

Mapeo: `TUR_AREAS` (DES_AREA, DES_RES, TIEMPO_EST, INHABILITADA, IMAGEN), `TUR_AREAS_USERS` (COD_AREA, COD_USER) → `members`, `ACT_AREAS` (DES_AREA, MAILSEXTRA, COD_RES, DIAS_ENVIO).

### 7.10 `crmSlaPolicies` — políticas de SLA

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `scope` | objeto | Sí | `{ caseTypeIds[], caseSubtypeIds[], serviceIds[], priorities[] }`. |
| `targets` | objeto[] | Sí | `{ metric (firstResponse/resolution/onSite), minutes, calendarMode (business/calendar) }`. |
| `pauseOnBaseStatuses` | enum[] | Sí | Por defecto `pendingInfo`, `waitingCustomer`. |
| `warnAtPercent` | int | Sí | Umbral de alerta (75). |
| `escalation` | objeto[] | No | `{ level, atPercent, notifyRoles[], notifyUserIds[] }`. |
| `businessCalendarId` | ObjectId (T04) | No | Calendario; si no, el del área o del tenant. |
| `regulatory` | bool | No | Objetivo regulatorio (se informa a T10/M06). |
| `policyVersion` | int | Sí | Versión (los casos guardan la versión aplicada). |
| `templateCode` | string | No | Plantilla de plataforma de la que proviene (`enacom.733-2017.*`, `safety.emergency`); al editarla el tenant conserva el origen (RF-CRM-258, RF-CRM-260). |
| `legalValidation` | objeto | No | `{ status (pending/validated/notApplicable), validatedBy, validatedAt, legalReference, notes }`; las plantillas regulatorias nacen `pending` (HUE-INT-03). |
| `continuous` | bool | No | `true` = calendario corrido 24×7 sin pausas (SLA de seguridad, RF-CRM-260); ignora `pauseOnBaseStatuses`. |

### 7.11 `crmRoutingRules` — reglas de derivación sugerida y guardias

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `purpose` | enum | Sí | `suggestArea`, `autoDerive`, `onCallNotify`, `notifyRecipients`. |
| `conditions` | objeto | Sí | `{ caseTypeIds[], caseSubtypeIds[], serviceIds[], operationCodes[], zoneIds[], channelKinds[], priorities[], weekdays[], timeFrom, timeTo, holidays (include/exclude/only) }`. |
| `trigger` | enum | Sí | `onCreate`, `onDerive`, `onEscalate`, `onIncident`. |
| `target` | objeto | Sí | `{ areaId?, userIds[], roleCodes[], recipients (incidentMailbox/participants/accountHolder) }`. |
| `priority` | int | Sí | Orden de evaluación. |

Mapeo: `RESPONSA_NOTIFICA` (COD_SER, COD_OPER separados por "|", COD_RES, TIP_ORDEN, DIAS, HORA_DESDE, HORA_HASTA, FERIADOS, NOTIFICAR_AL 1 al generar / 0 al enviar) para reglas de casos; los de OT siguen en M10. Parámetros 2630–2632 → reglas `notifyRecipients`.

### 7.12 `crmCommandRequests` — comandos a módulos dueños

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `crmCaseId` | ObjectId | Sí | Caso de origen. |
| `targetModule` | enum | Sí | `per`, `cat`, `fac`, `cob`, `mor`, `tec`, `ven`, `ins`, `soc`. |
| `command` | string | Sí | Ej. `cat.contract.requestActivation`, `cat.contract.requestCancellation`, `cat.contract.requestSuspension`, `cat.contract.requestReactivation`, `cat.contract.requestPlanChange`, `per.account.requestOwnerTransfer`, `per.address.requestUpdate`, `tec.workOrder.request`, `tec.workOrder.requestCancel`, `tec.feasibility.request`, `fac.adjustment.request`, `fac.hours.requestBilling`, `cob.paymentLink.create`, `mor.paymentPlan.request`, `ven.quote.request`, `ins.membership.requestExit`. |
| `payload` | objeto | Sí | Datos tipados (validados por el esquema Zod del módulo destino). |
| `idempotencyKey` | string | Sí | Clave única por tenant. |
| `status` | enum | Sí | `requested`, `accepted`, `rejected`, `executed`, `failed`, `cancelRequested`, `cancelled`. |
| `result` | objeto | No | `{ entityType, entityId, effectiveDate?, message, errorCode? }`. |
| `attempts` | int | Sí | Reintentos. |
| `dependsOnCommandId` | ObjectId → M09 `crmCommandRequests` | No | Orden de ejecución: comando del mismo caso que debe terminar antes (PA-CRM-20). |
| `requestedAt`, `resolvedAt` | date | Sí/No | Fechas. |

Índices: `{tenantId, idempotencyKey}` único; `{tenantId, crmCaseId}`; `{tenantId, status, requestedAt}`. Reemplaza `TRAMITES_ACCIONES.SCRIPT_ACCION` y las acciones masivas de `clsTramites`.

### 7.13 `crmContacts` — contactos no titulares

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `displayName` | string | Sí | Nombre. |
| `personId` | ObjectId | No | Si es persona del padrón. |
| `relatedAccountIds` | ObjectId[] | No | Cuentas relacionadas. |
| `relation` | enum | No | `tenantOccupant`, `buildingAdmin`, `attorney`, `employee`, `familyMember`, `companyContact`, `other`. |
| `phone`, `mobile`, `email` | string | No | Contacto. |
| `notes` | string | No | Observación. |
| `doNotNotify` | bool | No | No recibir avisos (por ejemplo reprogramaciones). |
| `mergedInto` | ObjectId → M09 `crmContacts` | No | Unificación: contacto que sobrevive (PA-CRM-20). |

Mapeo: `TICKETS_CONTACTOS` (DES_CONTACTO, COD_SOC, TELEFONO, CELULAR, MAIL, OBSERVACION). **Descartados**: FORMA_CONEXION, ID_REMOTO, CLAVE (credenciales en claro).

### 7.14 `crmIncidents` — incidentes comunes

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | Número por clase (ej. `INC-2026-0001`). |
| `incidentClassId` | ObjectId → `crmIncidentClasses` | Sí | Clase con numerador. |
| `incidentCategoryId` | ObjectId (M10) | No | Categoría técnica. |
| `failureTypeId` | ObjectId → M10 `incidentCategories` | No | Tipo de falla. M10 no define `failureTypes`: la tipificación técnica de la causa es `incidentCategories` (PA-CRM-20; antes "ObjectId (M10)"). |
| `serviceId` | ObjectId | Sí | Servicio afectado. |
| `title`, `description` | string | Sí | Descripción. |
| `status` | enum | Sí | `suspected`, `confirmed`, `inProgress`, `restored`, `closed`, `discarded`. |
| `scheduled` | bool | No | Interrupción programada. |
| `scope` | objeto | Sí | `{ zoneIds[], localityIds[], networkNodeIds[], geometry?, accountIdsSnapshotRef?, affectedCount }`. |
| `affected` | objeto | No | Referencia a lista versionada de cuentas/servicios afectados (colección de proyección en T10 o subcolección paginada). |
| `startedAt`, `detectedAt`, `restoredAt`, `closedAt` | date | — | Hitos. |
| `estimatedRestoreAt` | date | No | Estimado comunicado. |
| `workOrderIds` | ObjectId[] (M10) | No | Gestión técnica. |
| `participants` | objeto[] | No | `{ userId? , crewId?, role }` (`PARTIINC`). |
| `caseCount` | int | Sí | Casos vinculados. |
| `communications` | objeto[] | No | `{ communicationRunId (T09), kind (initial/update/restored), sentAt }`. |
| `resolutionCode` | string (M10) | No | Resolución. |
| `regulatoryReportable` | bool | No | Interrupción reportable. |

Índices: `{tenantId, number}` único; `{tenantId, status, serviceId}`; `{tenantId, 'scope.zoneIds'}`.

### 7.15 `crmIncidentClasses` — clases de incidente

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `prefix` | string | Sí | Prefijo de numeración. |
| `counterKey` | string | Sí | Contador atómico (reemplaza `ULT_NUM`). |
| `serviceIds` | ObjectId[] | No | Servicios. |

Mapeo: `CLAS_INC` (DES_CLI, ULT_NUM → valor inicial del contador).

### 7.16 `crmProcedureTypes` — tipos de trámite con vencimiento

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `entityLevel` | enum | Sí | `person`, `member`, `account`, `serviceContract` (proveedores y empleados usan el mismo motor desde M12/M16). |
| `expiryDays` | int | No | Días de vencimiento (`DIAS_VENCE`). |
| `kind` | string | No | `TIPO_TMT`. |
| `isDefault` | bool | No | `TRAMITE_DEFAULT`. |
| `templateKey` | string | No | Plantilla T09 (`COD_PLA`). |
| `actions` | objeto[] | No | `{ trigger (onCreate/onExpiry/manual), module, command, payloadMapping, description }` (reemplaza `TRAMITES_ACCIONES`: TIPO, DES_ACCION, SCRIPT_ACCION, ACCIONES_CTRL, ACCION_ALTA, ACCION_VTO). |
| `requiredForServiceIds` | ObjectId[] | No | Servicios que lo exigen (para "no presentados"). |
| `intakeRouteCodes` | string[] | No | Vías habilitadas. |

### 7.17 `crmProcedureRecords` — trámites presentados

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `procedureTypeId` | ObjectId | Sí | Tipo. |
| `associateMembershipId` (antes `memberId`), `accountId`, `contractId`, `personId` | ObjectId | Según nivel | Entidad. |
| `date` | date | Sí | Fecha del trámite (`FECHA`). |
| `expiresAt` | date | No | `FECHA_VTO` (si no, fecha + días del tipo). |
| `presented` | bool | Sí | `PRESENTADO`. |
| `status` | enum | Sí | `presented`, `notPresented`, `expired`, `superseded`, `voided`. |
| `notes` | string | No | `OBSERVA`. |
| `documentIds` | ObjectId[] (T11) | No | Adjuntos (tipo 26 de `ADJUNTOS`). |
| `actionsExecuted` | objeto[] | No | `{ actionIndex, trigger, commandRequestId, executedAt, status }` (reemplaza `ACCIONADO`). |
| `crmCaseId` | ObjectId | No | Caso que lo originó. |
| `recordedAt`, `recordedBy` | date, ObjectId | Sí | `FEC_REG`, `USU_REG`. |

Índices: `{tenantId, procedureTypeId, accountId, expiresAt}`; `{tenantId, status, expiresAt}`. Mapeo: `PTRAMITES` (TMT_SOC, COD_TMT, COD_SOC, COD_SUM, ID_SERSOC, FECHA, OBSERVA, FEC_REG, USU_REG, FECHA_VTO, PRESENTADO, COD_PROV → M12, ID_AC_TRA).

### 7.18 `crmProjects` — proyectos

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `accountId` | ObjectId | No | Cliente del proyecto (si aplica). |
| `components` | objeto[] | No | `{ code, nameKey }` (`TICKETS_MODULOS`). |
| `status` | enum | Sí | `active`, `onHold`, `closed`. |
| `ownerUserId` | ObjectId | No | Responsable. |

Mapeo: `TICKETS_PROYECTO` (DES_PROYECTO), `TICKETS_MODULOS` (DES_MODULO, COD_PROYECTO).

### 7.19 `crmWorkLogs` — registro de tiempo

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `crmCaseId` | ObjectId | Sí | Caso. |
| `userId` | ObjectId | Sí | Usuario. |
| `startedAt`, `endedAt` | date | Sí/No | Intervalo. |
| `minutes` | int | Sí | Minutos reales (derivado). |
| `billableMinutes` | int | No | Minutos a facturar (editable con permiso). |
| `kind` | enum | Sí | `work`, `verification`, `call`, `travel`. |
| `autoPaused` | bool | No | Pausa automática por llamada. |
| `billingStatus` | enum | Sí | `notBillable`, `pending`, `coveredByBank`, `requested`, `billed`. |
| `hourBankId` | ObjectId | No | Bolsa usada. |
| `invoiceRef` | ObjectId (M05) | No | Comprobante. |

Mapeo: `TICKETS_NOTAS` (FECHAINICIO, FECHAFIN, PAUSADO, ESTESTING, COD_USER).

### 7.20 `crmHourBanks` — bolsas de horas bonificadas

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `accountId` | ObjectId | Sí | Cuenta. |
| `kind` | enum | Sí | `monthlySupport`, `perSale`. |
| `minutesGranted` | int | Sí | Minutos otorgados (horas × 60). |
| `period` | string | No | `AAAA-MM` para mensual. |
| `saleRef` | ObjectId → M05 `invoices` | No | Comprobante de venta que la otorgó (`ID_COMPV`) (PA-CRM-20; antes "ObjectId (M11/M05)"). |
| `minutesUsed` | int | Sí | Consumidos. |
| `hourlyRate` | Decimal128 | No | Valor hora para bonificación (default PRM-CRM-091). |

Mapeo: `TICKETS_HSBONIF` (ID_COMPV, HS_IMPLEMENTACION, HS_SOPORTE), `SOCIOS.BONIF_SOPORTE`, `TICKETS_RESPONSABLES.BONIF_VENTA`.

### 7.21 `crmAccountAssignments` — responsables por cuenta

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `accountId` | ObjectId | Sí | Cuenta. |
| `userId` | ObjectId | Sí | Responsable (ejecutivo/gestor). |
| `projectId` | ObjectId | No | Proyecto. |
| `role` | enum | Sí | `accountManager`, `supportLead`. |

Mapeo: `TICKETS_RESPONSABLES` (COD_RES, COD_SOC, COD_USER, COD_PROYECTO, BONIF_VENTA → `crmHourBanks`).

### 7.22 `crmQuickReplies` — respuestas rápidas

Campos: `title`, `body` (con variables `{{case.number}}`, `{{person.firstName}}`…), `channelKinds[]`, `caseTypeIds[]`, `caseSubtypeIds[]`, `visibility` (`all`/`area`/`personal`), `ownerUserId?`, `areaId?`. Mapeo: plantillas de `TICKETS_TIPOS`/`TICKETS_SUBTIPOS`.

### 7.23 `crmChannels` — canales del tenant

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `kind` | enum | Sí | `presential`, `phone`, `email`, `whatsapp`, `sms`, `webchat`, `portal`, `facebook`, `instagram`, `deskEntry`, `ivr`, `bot`, `public`. |
| `intakeRouteCode` | string | Sí | Vía de ingreso equivalente. |
| `validatePhone`, `validateEmail` | bool | Sí | Exigir validación (`VIAINGTE`). |
| `providerConnectionId` | ObjectId (T06) | No | Conexión con credenciales en bóveda. |
| `address` | string | No | Número, casilla, id de página. |
| `businessHours` | objeto | No | Horario de atención humana. |
| `botFlowId` | ObjectId | No | Bot asignado. |
| `defaultAreaId` | ObjectId | No | Área por defecto. |
| `status` | enum | Sí | `draft`, `testing`, `active`, `suspended`. |
| `templatesSyncedAt` | date | No | Sincronización de plantillas (WhatsApp). |

Índices: `{tenantId, kind, address}` único; para webhooks: `{kind, address}` único global (resuelve el tenant, RN-CRM-095). Mapeo: `TICKETS_MEDIOSATENCION` (DES_MEDIO), `VIAINGTE` (DES_VIA, VALIDAR_CELULAR, VALIDAR_MAIL).

### 7.24 `crmBotFlows` — flujos del bot

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `intents` | objeto[] | Sí | `{ code (balance/invoiceCopy/paymentLink/openComplaint/caseStatus/queueTicket/outages/startCancellation/faq/human), enabled, requiresVerification, nlu (examples[]), steps[] }`. |
| `greetingKey`, `outOfHoursKey`, `fallbackKey` | string | Sí | Textos por diccionario. |
| `handoff` | objeto | Sí | `{ areaId, maxBotTurns, keywords[] }`. |
| `faq` | objeto[] | No | `{ question, answerKey, tags[] }`. |
| `version` | int | Sí | Versión publicada. |
| `status` | enum | Sí | `draft`, `published`, `archived`. |

### 7.25 `crmBotSessions` — sesiones del bot

Campos: `conversationId`, `flowId`, `flowVersion`, `currentIntent`, `step`, `slots{}`, `verification` `{ method (linkedPhone/otp/accountPlusData), verifiedPersonId, verifiedAt, attempts }`, `startedAt`, `endedAt`, `outcome` (`selfServed`/`caseCreated`/`handedOff`/`abandoned`), `crmCaseId?`. Índice `{tenantId, conversationId, startedAt}`. Expira por inactividad (PRM-CRM-063).

### 7.26 `crmAiSuggestions` — registro de IA

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `function` | enum | Sí | `classify`, `summarize`, `replyDraft`, `attachmentExtract`, `customerDraft`, `duplicateDetect`, `incidentDetect`, `botIntent`, `nextAction`. |
| `targetType`, `targetId` | string, ObjectId | Sí | Caso, conversación, mensaje, adjunto. |
| `inputRefs` | objeto[] | Sí | Referencias a los datos usados (no copia de datos sensibles). |
| `provider`, `model`, `promptVersion` | string | Sí | Versiones. |
| `output` | objeto | Sí | Salida estructurada. |
| `confidence` | number | No | 0–1. |
| `status` | enum | Sí | `proposed`, `accepted`, `corrected`, `discarded`, `expired`, `failed`. |
| `decision` | objeto | No | `{ userId, decidedAt, finalValue, diff }`. |
| `latencyMs`, `tokens` | int | No | Métricas. |
| `safetyFlags` | string[] | No | `injectionSuspected`, `sensitiveContent`, `lowConfidence`. |

Índices: `{tenantId, targetType, targetId, createdAt}`; `{tenantId, function, status, createdAt}`. Mapeo: `AUDIT_IA` (TIPO_CONSULTA, FEC_REG, COMANDO, RESPUESTA, TOKENS, USUARIO).

### 7.27 `crmQueueTickets` — turnos

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `branchId` | ObjectId | Sí | Sucursal. |
| `serviceDate` | string `AAAA-MM-DD` | Sí | Día (zona del tenant). |
| `originAreaId`, `areaId` | ObjectId | Sí | Área de origen y actual (`COD_AREA_ORIG`, `COD_AREA`). |
| `seq` | int | Sí | Correlativo del día y área de origen (`NUMERO`). |
| `displayCode` | string | Sí | Código visible (`TURNO`). |
| `personId` | ObjectId | No | `COD_PER`. |
| `displayName` | string | No | `NOMBRE` (solo si se habilita mostrarlo). |
| `priority` | bool | Sí | `PRIORIDAD`. |
| `priorityReason` | string | No | Motivo. |
| `origin` | enum | Sí | `reception`, `kiosk`, `web`, `app`, `whatsapp`, `appointment`. |
| `status` | enum | Sí | `waiting`, `calling`, `inService`, `finished`, `cancelled` (`COD_EST`, `FEC_EST`). |
| `outcome` | enum | No | `solved`, `unsolved`, `noShow`. |
| `deskId`, `userId` | ObjectId | No | Box y usuario actuales. |
| `issuedAt` | date | Sí | `FEC_INGRESO`. |
| `reasonCode` | string | No | Motivo de visita. |
| `crmCaseId`, `interactionId`, `appointmentId` | ObjectId | No | Vínculos. |
| `estimatedWaitMinutes` | int | No | Al emitir. |

Índices: `{tenantId, branchId, serviceDate, originAreaId, seq}` único; `{tenantId, branchId, areaId, status, priority, issuedAt}` (llamado).

### 7.28 `crmQueueTicketEvents` — historial del turno

Campos: `queueTicketId`, `action` (`received`, `waiting`, `called`, `recalled`, `served`, `derived`, `finishedSolved`, `finishedUnsolved`, `finishedNoShow`, `cancelled`), `areaId`, `deskId`, `deskSessionId`, `userId`, `at` (hora del servidor), `note`. Índice `{tenantId, queueTicketId, at}`. Mapeo: `TURNOS_HISTORIAL` (COD_TUR, COD_AREA, TIP_ACCION 1–8, COD_USER, COD_BHIS, INICIO, OBSERVA).

### 7.29 `crmQueueDeskTypes` — tipos de box

Campos: `name` (`NOM_BOX`), `icon`. Mapeo `TUR_TIPO_BOX`.

### 7.30 `crmQueueDesks` — boxes

Campos: `branchId`, `deskTypeId` (`COD_TBOX`), `number` (`NUM_BOX`), `label`, `isAutoGeneration` (bool, parámetro 2014), `areaIds[]` (opcional, áreas por defecto). Índice `{tenantId, branchId, number}` único. Mapeo `TUR_BOX`.

### 7.31 `crmQueueDeskSessions` — apertura y cierre de boxes

Campos: `deskId`, `userId`, `openedAt` (`FEC_APER`), `closedAt` (`FEC_CIERRE`), `areaIds[]` atendidas en la sesión. Índice único parcial `{tenantId, deskId}` donde `closedAt = null` (impide doble apertura). Mapeo `TUR_BOX_HISTORIAL`.

### 7.32 `crmQueueDisplays` — pantallas

Campos: `branchId`, `name`, `mode` (`highlightLast`, `allEqual`, `highlightLastLarge` — parámetro 2240), `groupBy` (`lastCalls`, `byDesk` — 2209), `showName` (bool — 2005), `voice` `{ enabled, voiceName, rate }` (2700), `areaIds[]`, `accessTokenHash` (pantalla sin login), `localAgentId?` (T06). Mapeo: lista de pantallas del parámetro 2007.

### 7.33 `crmQueueAppointments` — reservas de turno

Campos: `branchId`, `areaId`, `slotStart`, `slotEnd`, `personId?`, `contact` `{ name, phone, email }`, `reasonCode`, `status` (`booked`, `confirmed`, `checkedIn`, `noShow`, `cancelled`), `queueTicketId?`, `channel`, `reminderSentAt?`. Índices `{tenantId, areaId, slotStart}`; cupos por `crmAreas.queue.slots` (PRM-CRM-110).

### 7.34 `crmActivityFrequencies`

Campos: `kind` (`weekly`, `monthly`, `bimonthly`, `quarterly`, `fourMonthly`, `semiannual`, `annual`, `everyNDays`), `days` (int, solo `everyNDays`). Índice único `{tenantId, kind, days}`. Mapeo `ACT_FREC` (TIPO_FREC, DIAS_FREC).

### 7.35 `crmActivityRubros`

Campos: `code`, `nameKey`. Mapeo `ACT_RBR` (COD_ACT, DES_ACT).

### 7.36 `crmActivityTypes`

Campos: `areaId` (`COD_AREA`), `name` (`DES_TIPO`), `marginBeforeDays` (`MARGEN_ANT`), `marginAfterDays` (`MARGEN_POS`), `frequencyId` (`COD_FREC`), `templateKey` (`PLANTILLA`, en T09), `reminderWeekday` (`DIAS_ENVIO`), `requiresApproval` (bool), `requiresEvidence` (bool), `escalateAfterDays` (int). Mapeo `ACT_TIPOS`.

### 7.37 `crmActivities`

Campos: `activityTypeId` (`COD_TIPO`), `rubroId`, `responsibleUserId` (`COD_RES`), `description` (`DES_ACT`), `extraRecipients[]` (`MAILSEXTRA`), `generation` (`automatic` = `TIP_GEN 1` / `manual`), `dateMode` (`TIP_FEC`), `firstDueDate`, `validUntil` (`FEC_HASTA`), `prerequisites[]` `{ activityId, mandatory }` (`ACTIPREV`: DES_ACP, COD_ACI, ACT_ACP), `linkedEntity` `{ type (asset/network/regulation/contract), id }`, `active`. Mapeo `ACTIV`.

### 7.38 `crmActivityOccurrences`

Campos: `activityId` (`COD_ACT`), `seq` (numeración atómica), `dueDate` (`FEC_ACT`), `generatedAt` (`FEC_ALTA`), `manual` (`MANUAL_ACT`), `responsibleUserId` (`COD_RES`), `status` (`pending`, `dueSoon`, `overdue`, `closedOnTime`, `closedLate`, `closedWithReview`, `voided` — derivado y persistido por job), `closedAt` (`FEC_CIERRE`), `realClosedAt` (`FEC_REALCI`), `closedByResponsibleId` (`CODRES_CIE`), `closedByUserId` (`COD_US_CIE`), `review` (`REV_ACT`, bool + texto), `observation` (`OBS_ACT`), `evidenceDocumentIds[]`, `approval` `{ approvedBy, approvedAt }`, `calendarEventId`. Índices `{tenantId, activityId, dueDate}` único; `{tenantId, status, dueDate}`. Mapeo `ACTIV_SEG`.

### 7.39 `crmCalendarEventTypes`

Campos: `description`, `color`. Mapeo `CALENDARIO_TIPO` (DESCRIPCION, COLOR) y `TIP_EVEN` (DES_TIPE).

### 7.40 `crmCalendarEvents`

Campos: `userId` (`COD_USER`), `allDay` (`TODOELDIA`), `start`, `end` (`CAL_START`, `CAL_END`), `subject` (`CAL_ASUNTO`), `description` (`CAL_DES`), `location` (`CAL_UBICA`), `label` (`ETIQUETA`), `recurrence` (RRULE, desde `INFO_RECUR`), `reminders[]` (desde `INFO_RECOR`), `status` (`ESTADO`), `eventTypeId` (`TIPO`), `source` `{ type (activityOccurrence/case/manual), id }`. Índice `{tenantId, userId, start}`. Mapeo `CALENDARIO`.

### 7.41 `crmCirculars` — modelos de circular

Campos: `name` (`DES_CIR`), `bodyTemplateKey` (T09; texto `TEXTO` migrado como plantilla), `debtFilter` `{ debtKind (`TDEUDA`), minAmount Decimal128 (`DEUDA`) }`, `enrollmentFilter` (`ADHER`: adheridos a factura digital/débito), `signatures` `{ manager (`FIR_GTE`), auditor (`FIR_AUD`) }`, `includeServiceDetail` (`DET_SER`), `serviceId` (`COD_SER`), `channels[]` (`print`, `email`, `sms` (`SMS`), `whatsapp`), `templateKey` (`PLANTILLA`), `audienceDefinition` (motor T09), `requiresApproval`. Mapeo `CIRCULAR`; `CIRCUPRO` (circulares a proveedores) → M12.

### 7.42 `crmCircularRuns` — corridas

Campos: `circularId`, `audienceSnapshotRef`, `recipientCount`, `status` (`draft`, `pendingApproval`, `approved`, `generating`, `sent`, `partiallyFailed`, `cancelled`), `communicationRunIds[]` (T09), `printDocumentId?`, `labelsDocumentId?`, `workOrderCommandIds[]`, `approvedBy`, `approvedAt`, `results` `{ delivered, failed, printed }`.

### 7.43 Relaciones con colecciones de otros módulos

| Colección externa | Dueño | Uso en CRM |
|---|---|---|
| `persons`, `members`, `accounts`, `premises`, `addresses` | M01 | Contexto y pertenencia (solo lectura) |
| `serviceContracts`, `services`, `plans`, `serviceCatalog` | M02 | Servicios disponibles/contratados; comandos |
| `workOrders`, `incidentCategories`, `workOrderResolutions`, `networkNodes`, `crews` | M10 | OT vinculadas, tipificación técnica, alcance de incidentes (antes también `failureTypes`, que M10 no define: el tipo de falla es `incidentCategories`; PA-CRM-20) |
| `invoices` | M05 | Contexto de reclamos de factura; segunda vía |
| `accountLedger`, `paymentLinks` | M07 | Saldo (bot) y link de pago |
| `quotes` | M11 | Presupuesto vinculado |
| `documents`, `approvals`, `workflowDefinitions` | T11 | Adjuntos, aprobaciones, estados |
| `communications`, `communicationTemplates`, `surveys`, `contactPreferences`, `audiences` | T09 | Avisos, plantillas, encuestas, preferencias |
| `providerConnections`, `localAgents`, `webhookInbox` | T06 | Canales, agente local, webhooks |
| `businessCalendars`, `holidays`, `sequences`, `zones`, `localities` | T04 | Calendario hábil, numeradores, geografía |
| `users`, `roles`, `groups`, `branches` | T02 | Actores, alcance |

### 7.44 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.44.1 `crmCases` (COL-CRM-01) — referencias declaradas

| Campo | Referencia |
|---|---|
| `quoteId` | `salesQuotes` (M11); antes implícita por el nombre |
| `mergedIntoCaseId` | `crmCases` (M09); antes implícita por el nombre |

#### 7.44.2 `crmConversations` (COL-CRM-03) — referencias declaradas

| Campo | Referencia |
|---|---|
| `caseIds` | `crmCases` (M09); antes implícita por el nombre |
| `botSessionId` | `crmBotSessions` (M09); antes implícita por el nombre |

#### 7.44.3 `crmMessages` (COL-CRM-04) — referencias declaradas

| Campo | Referencia |
|---|---|
| `conversationId` | `crmConversations` (M09); antes implícita por el nombre |
| `providerMessageId` | — (identificador del proveedor del canal; no es referencia interna) |
| `workLogId` | `crmWorkLogs` (M09); antes implícita por el nombre |
| `aiSuggestionId` | `crmAiSuggestions` (M09); antes implícita por el nombre |

#### 7.44.4 `crmInteractions` (COL-CRM-05) — referencias declaradas

| Campo | Referencia |
|---|---|
| `conversationId` | `crmConversations` (M09); antes implícita por el nombre |
| `queueTicketId` | `crmQueueTickets` (M09); antes implícita por el nombre |

#### 7.44.5 `crmCaseTypes` (COL-CRM-06) — referencias declaradas

| Campo | Referencia |
|---|---|
| `statusSetId` | `crmStatusSets` (M09); antes implícita por el nombre |
| `workflowDefinitionId` | `workflowDefinitions` (T11); antes implícita por el nombre |
| `defaultAreaId` | `crmAreas` (M09); antes implícita por el nombre |
| `slaPolicyId` | `crmSlaPolicies` (M09); antes implícita por el nombre |
| `surveyTemplateId` | `surveyTemplates` (T09); antes implícita por el nombre |
| `projectId` | `crmProjects` (M09); antes implícita por el nombre |

#### 7.44.6 `crmCaseSubtypes` (COL-CRM-07) — referencias declaradas

| Campo | Referencia |
|---|---|
| `caseTypeId` | `crmCaseTypes` (M09); antes implícita por el nombre |
| `slaPolicyId` | `crmSlaPolicies` (M09); antes implícita por el nombre |
| `productId` | `serviceProducts` (M02); antes implícita por el nombre |
| `incidentCategoryId` | `incidentCategories` (M10); antes implícita por el nombre |
| `quickReplyIds` | `crmQuickReplies` (M09); antes implícita por el nombre |

#### 7.44.7 `crmStatusSets` (COL-CRM-08) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `workflowRef` | ObjectId | → T11 `workflowDefinitions` (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.44.8 `crmSlaPolicies` (COL-CRM-10) — referencias declaradas

| Campo | Referencia |
|---|---|
| `businessCalendarId` | `calendars` (T04); antes implícita por el nombre |

#### 7.44.9 `crmCommandRequests` (COL-CRM-12) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `dependsOnCommandId` | ObjectId | → M09 `crmCommandRequests` (comando previo del mismo caso) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.44.10 `crmIncidents` (COL-CRM-14) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `incidentCategoryId` | ObjectId | `incidentCategories` (M10); antes implícita por el nombre |
| `failureTypeId` | ObjectId | → M10 `incidentCategories` (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.44.11 `crmProcedureRecords` (COL-CRM-17) — referencias declaradas

| Campo | Referencia |
|---|---|
| `procedureTypeId` | `crmProcedureTypes` (M09); antes implícita por el nombre |
| `associateMembershipId` | → M17 `associateMemberships`. Nombre canónico de T05 §7.2.1 `associateMembershipId` (antes `memberId`) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.44.12 `crmHourBanks` (COL-CRM-20) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `saleRef` | ObjectId | → M05 `invoices` (comprobante de venta `ID_COMPV`) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.44.13 `crmAccountAssignments` (COL-CRM-21) — referencias declaradas

| Campo | Referencia |
|---|---|
| `projectId` | `crmProjects` (M09); antes implícita por el nombre |

#### 7.44.14 `crmQuickReplies` (COL-CRM-22)

Lista original: §7.22.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `title` | [VERIFICAR] | [VERIFICAR] | — | — |
| `body` | [VERIFICAR] | [VERIFICAR] | con variables `{{case.number}}`, `{{person.firstName}}`… | — |
| `channelKinds` | array | [VERIFICAR] | — | — |
| `caseTypeIds` | array | [VERIFICAR] | — | `crmCaseTypes` (M09); antes implícita por el nombre |
| `caseSubtypeIds` | array | [VERIFICAR] | — | `crmCaseSubtypes` (M09); antes implícita por el nombre |
| `visibility` | enum | [VERIFICAR] | `all`/`area`/`personal` | — |
| `ownerUserId` | ObjectId | No | — | → T02 `memberships` (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `areaId` | ObjectId | No | — | `crmAreas` (M09); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.15 `crmChannels` (COL-CRM-23) — referencias declaradas

| Campo | Referencia |
|---|---|
| `providerConnectionId` | → T06 `integrationConnections` (T05 §7.2.1) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `botFlowId` | `crmBotFlows` (M09); antes implícita por el nombre |
| `defaultAreaId` | `crmAreas` (M09); antes implícita por el nombre |

#### 7.44.16 `crmBotSessions` (COL-CRM-25)

Lista original: §7.25.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `conversationId` | ObjectId | [VERIFICAR] | — | `crmConversations` (M09); antes implícita por el nombre |
| `flowId` | ObjectId | [VERIFICAR] | — | `crmBotFlows` (M09); antes implícita por el nombre |
| `flowVersion` | [VERIFICAR] | [VERIFICAR] | — | — |
| `currentIntent` | [VERIFICAR] | [VERIFICAR] | — | — |
| `step` | [VERIFICAR] | [VERIFICAR] | — | — |
| `verification` | object | [VERIFICAR] | `{ method (linkedPhone/otp/accountPlusData), verifiedPersonId, verifiedAt, attempts }` | — |
| `startedAt` | Date | [VERIFICAR] | — | — |
| `endedAt` | Date | [VERIFICAR] | — | — |
| `outcome` | enum | [VERIFICAR] | `selfServed`/`caseCreated`/`handedOff`/`abandoned` | — |
| `crmCaseId` | ObjectId | No | — | `crmCases` (M09); antes implícita por el nombre |

#### 7.44.17 `crmAiSuggestions` (COL-CRM-26) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `targetType` | enum | No es referencia: discriminador de `targetId` (`case`, `conversation`, `message`, `attachment`) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `targetId` | ObjectId | Polimórfica según `targetType`: → M09 `crmCases` · `crmConversations` · `crmMessages` · T01 `storedFiles` (PA-CRM-20; antes "[VERIFICAR] polimórfica según el tipo de destino") |
| `aiUsageLogId` | ObjectId | → T06 `aiUsageLogs` (llamada al proveedor de IA, CTR-DAT-04). Declarado en T05 (COL-CRM-26); no figuraba en el anexo (PA-CRM-20). |

#### 7.44.18 `crmQueueTickets` (COL-CRM-27) — referencias declaradas

| Campo | Referencia |
|---|---|
| `originAreaId` | `crmAreas` (M09); antes implícita por el nombre |
| `areaId` | `crmAreas` (M09); antes implícita por el nombre |
| `deskId` | `crmQueueDesks` (M09); antes implícita por el nombre |
| `interactionId` | `crmInteractions` (M09); antes implícita por el nombre |
| `appointmentId` | `crmQueueAppointments` (M09); antes implícita por el nombre |

#### 7.44.19 `crmQueueTicketEvents` (COL-CRM-28)

Lista original: §7.28.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `queueTicketId` | ObjectId | [VERIFICAR] | — | `crmQueueTickets` (M09); antes implícita por el nombre |
| `action` | enum | [VERIFICAR] | `received`, `waiting`, `called`, `recalled`, `served`, `derived`, `finishedSolved`, `finishedUnsolved`, `finishedNoShow`, `cancelled` | — |
| `areaId` | ObjectId | [VERIFICAR] | — | `crmAreas` (M09); antes implícita por el nombre |
| `deskId` | ObjectId | [VERIFICAR] | — | `crmQueueDesks` (M09); antes implícita por el nombre |
| `deskSessionId` | ObjectId | [VERIFICAR] | — | `crmQueueDeskSessions` (M09); antes implícita por el nombre |
| `userId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `at` | [VERIFICAR] | [VERIFICAR] | hora del servidor | — |
| `note` | [VERIFICAR] | [VERIFICAR] | — | — |

#### 7.44.20 `crmQueueDeskTypes` (COL-CRM-29)

Lista original: §7.29.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `NOM_BOX` | — |
| `icon` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.21 `crmQueueDesks` (COL-CRM-30)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `branchId` | ObjectId | [VERIFICAR] | — | `branches` (T04) |
| `deskTypeId` | ObjectId | [VERIFICAR] | `COD_TBOX` | `crmQueueDeskTypes` (M09); antes implícita por el nombre |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | `NUM_BOX` | — |
| `label` | string | [VERIFICAR] | — | — |
| `isAutoGeneration` | bool | [VERIFICAR] | bool, parámetro 2014 | — |
| `areaIds` | array | No | opcional, áreas por defecto | `crmAreas` (M09); antes implícita por el nombre |

#### 7.44.22 `crmQueueDeskSessions` (COL-CRM-31)

Lista original: §7.31.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `deskId` | ObjectId | [VERIFICAR] | — | `crmQueueDesks` (M09); antes implícita por el nombre |
| `userId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `openedAt` | Date | [VERIFICAR] | `FEC_APER` | — |
| `closedAt` | Date | [VERIFICAR] | `FEC_CIERRE` | — |
| `areaIds` | array | [VERIFICAR] | atendidas en la sesión. Índice único parcial `{tenantId, deskId}` donde `closedAt = null` (impide doble apertura) | `crmAreas` (M09); antes implícita por el nombre |

#### 7.44.23 `crmQueueDisplays` (COL-CRM-32)

Lista original: §7.32.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `branchId` | ObjectId | [VERIFICAR] | — | `branches` (T04) |
| `name` | string | [VERIFICAR] | — | — |
| `mode` | enum | [VERIFICAR] | `highlightLast`, `allEqual`, `highlightLastLarge` — parámetro 2240 | — |
| `groupBy` | enum | [VERIFICAR] | `lastCalls`, `byDesk` — 2209 | `memberships` (T02) |
| `showName` | bool | [VERIFICAR] | bool — 2005 | — |
| `voice` | object | [VERIFICAR] | `{ enabled, voiceName, rate }` (2700) | — |
| `areaIds` | array | [VERIFICAR] | — | `crmAreas` (M09); antes implícita por el nombre |
| `accessTokenHash` | [VERIFICAR] | [VERIFICAR] | pantalla sin login | — |
| `localAgentId` | ObjectId | No | T06 | `localAgents` (T06); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.24 `crmQueueAppointments` (COL-CRM-33)

Lista original: §7.33.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `branchId` | ObjectId | [VERIFICAR] | — | `branches` (T04) |
| `areaId` | ObjectId | [VERIFICAR] | — | `crmAreas` (M09); antes implícita por el nombre |
| `slotStart` | Date | [VERIFICAR] | — | — |
| `slotEnd` | Date | [VERIFICAR] | — | — |
| `personId` | ObjectId | No | — | `persons` (M01) |
| `contact` | object | [VERIFICAR] | `{ name, phone, email }` | — |
| `reasonCode` | string | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `booked`, `confirmed`, `checkedIn`, `noShow`, `cancelled` | — |
| `queueTicketId` | ObjectId | No | — | `crmQueueTickets` (M09); antes implícita por el nombre |
| `channel` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reminderSentAt` | Date | No | — | — |

#### 7.44.25 `crmActivityFrequencies` (COL-CRM-34)

Lista original: §7.34.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | `weekly`, `monthly`, `bimonthly`, `quarterly`, `fourMonthly`, `semiannual`, `annual`, `everyNDays` | — |
| `days` | int | [VERIFICAR] | (int, solo `everyNDays`). Índice único `{tenantId, kind, days}` | — |

#### 7.44.26 `crmActivityRubros` (COL-CRM-35)

Lista original: §7.35.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `nameKey` | string | [VERIFICAR] | — | — |

#### 7.44.27 `crmActivityTypes` (COL-CRM-36)

Lista original: §7.36.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `areaId` | ObjectId | [VERIFICAR] | `COD_AREA` | `crmAreas` (M09); antes implícita por el nombre |
| `name` | string | [VERIFICAR] | `DES_TIPO` | — |
| `marginBeforeDays` | int | [VERIFICAR] | `MARGEN_ANT` | — |
| `marginAfterDays` | int | [VERIFICAR] | `MARGEN_POS` | — |
| `frequencyId` | ObjectId | [VERIFICAR] | `COD_FREC` | `crmActivityFrequencies` (M09); antes implícita por el nombre |
| `templateKey` | string | [VERIFICAR] | `PLANTILLA`, en T09 | — |
| `reminderWeekday` | [VERIFICAR] | [VERIFICAR] | `DIAS_ENVIO` | — |
| `requiresApproval` | bool | [VERIFICAR] | — | — |
| `requiresEvidence` | bool | [VERIFICAR] | — | — |
| `escalateAfterDays` | int | [VERIFICAR] | int | — |
| `rubroId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crmActivityRubros` (M09); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.28 `crmActivities` (COL-CRM-37)

Lista original: §7.37.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `activityTypeId` | ObjectId | [VERIFICAR] | `COD_TIPO` | `crmActivityTypes` (M09); antes implícita por el nombre |
| `rubroId` | ObjectId | [VERIFICAR] | — | `crmActivityRubros` (M09); antes implícita por el nombre |
| `responsibleUserId` | ObjectId | [VERIFICAR] | `COD_RES` | `memberships` (T02) |
| `description` | string | [VERIFICAR] | `DES_ACT` | — |
| `extraRecipients` | array | [VERIFICAR] | `MAILSEXTRA` | — |
| `generation` | [VERIFICAR] | [VERIFICAR] | `automatic` = `TIP_GEN 1` / `manual` | — |
| `dateMode` | [VERIFICAR] | [VERIFICAR] | `TIP_FEC` | — |
| `firstDueDate` | Date | [VERIFICAR] | — | — |
| `validUntil` | [VERIFICAR] | [VERIFICAR] | `FEC_HASTA` | — |
| `prerequisites` | array | [VERIFICAR] | `{ activityId, mandatory }` (`ACTIPREV`: DES_ACP, COD_ACI, ACT_ACP) | — |
| `linkedEntity` | object | [VERIFICAR] | `{ type (asset/network/regulation/contract), id }` | — |
| `active` | bool | [VERIFICAR] | — | — |
| `typeId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crmActivityTypes` (M09); antes implícita por el nombre |
| `frequencyId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crmActivityFrequencies` (M09); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.29 `crmActivityOccurrences` (COL-CRM-38)

Lista original: §7.38.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `activityId` | ObjectId | [VERIFICAR] | `COD_ACT` | `crmActivities` (M09); antes implícita por el nombre |
| `seq` | int | [VERIFICAR] | numeración atómica | — |
| `dueDate` | Date | [VERIFICAR] | `FEC_ACT` | — |
| `generatedAt` | Date | [VERIFICAR] | `FEC_ALTA` | — |
| `manual` | [VERIFICAR] | [VERIFICAR] | `MANUAL_ACT` | — |
| `responsibleUserId` | ObjectId | [VERIFICAR] | `COD_RES` | `memberships` (T02) |
| `status` | enum | [VERIFICAR] | `pending`, `dueSoon`, `overdue`, `closedOnTime`, `closedLate`, `closedWithReview`, `voided` — derivado y persistido por job | — |
| `closedAt` | Date | [VERIFICAR] | `FEC_CIERRE` | — |
| `realClosedAt` | Date | [VERIFICAR] | `FEC_REALCI` | — |
| `closedByResponsibleId` | ObjectId | [VERIFICAR] | `CODRES_CIE` | → T02 `memberships` (responsable que cerró, como `responsibleUserId`) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `closedByUserId` | ObjectId | [VERIFICAR] | `COD_US_CIE` | `memberships` (T02) |
| `review` | bool | [VERIFICAR] | `REV_ACT`, bool + texto | — |
| `observation` | [VERIFICAR] | [VERIFICAR] | `OBS_ACT` | — |
| `evidenceDocumentIds` | array | [VERIFICAR] | — | `documents` (T11) |
| `approval` | object | [VERIFICAR] | `{ approvedBy, approvedAt }` | — |
| `calendarEventId` | ObjectId | [VERIFICAR] | — | `crmCalendarEvents` (M09); antes implícita por el nombre |

#### 7.44.30 `crmCalendarEventTypes` (COL-CRM-39)

Lista original: §7.39.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `description` | string | [VERIFICAR] | — | — |
| `color` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.31 `crmCalendarEvents` (COL-CRM-40)

Lista original: §7.40.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `userId` | ObjectId | [VERIFICAR] | `COD_USER` | `memberships` (T02) |
| `allDay` | [VERIFICAR] | [VERIFICAR] | `TODOELDIA` | — |
| `start` | Date | [VERIFICAR] | — | — |
| `end` | Date | [VERIFICAR] | `CAL_START`, `CAL_END` | — |
| `subject` | string | [VERIFICAR] | `CAL_ASUNTO` | — |
| `description` | string | [VERIFICAR] | `CAL_DES` | — |
| `location` | [VERIFICAR] | [VERIFICAR] | `CAL_UBICA` | — |
| `label` | string | [VERIFICAR] | `ETIQUETA` | — |
| `recurrence` | [VERIFICAR] | [VERIFICAR] | RRULE, desde `INFO_RECUR` | — |
| `reminders` | array | [VERIFICAR] | desde `INFO_RECOR` | — |
| `status` | enum | Sí | `ESTADO`. Valores: `scheduled`, `completed`, `cancelled`, `missed` (§8.13; PA-COB-19 de M07); antes sin valores. | — |
| `eventTypeId` | ObjectId | [VERIFICAR] | `TIPO` | `crmCalendarEventTypes` (M09); antes implícita por el nombre |
| `source` | object | [VERIFICAR] | `{ type (activityOccurrence/case/manual), id }` | — |
| `typeId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crmCalendarEventTypes` (M09); antes implícita por el nombre |

#### 7.44.32 `crmCirculars` (COL-CRM-41)

Lista original: §7.41.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | `DES_CIR` | — |
| `bodyTemplateKey` | string | [VERIFICAR] | T09; texto `TEXTO` migrado como plantilla | — |
| `debtFilter` | object | [VERIFICAR] | `{ debtKind (`TDEUDA`), minAmount Decimal128 (`DEUDA`) }` | — |
| `enrollmentFilter` | [VERIFICAR] | [VERIFICAR] | `ADHER`: adheridos a factura digital/débito | — |
| `signatures` | object | [VERIFICAR] | `{ manager (`FIR_GTE`), auditor (`FIR_AUD`) }` | — |
| `includeServiceDetail` | bool | [VERIFICAR] | `DET_SER` | — |
| `serviceId` | ObjectId | [VERIFICAR] | `COD_SER` | `tenantServices` (M02) |
| `channels` | enum | [VERIFICAR] | `print`, `email`, `sms` (`SMS`), `whatsapp` | — |
| `templateKey` | string | [VERIFICAR] | `PLANTILLA` | — |
| `audienceDefinition` | [VERIFICAR] | [VERIFICAR] | motor T09 | — |
| `requiresApproval` | bool | [VERIFICAR] | — | — |
| `templateVersionId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `templateVersions` (T11); antes implícita por el nombre |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.44.33 `crmCircularRuns` (COL-CRM-42)

Lista original: §7.42.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `circularId` | ObjectId | [VERIFICAR] | — | `crmCirculars` (M09); antes implícita por el nombre |
| `audienceSnapshotId` | string | [VERIFICAR] | Nombre de T05; antes `audienceSnapshotRef` en este anexo. | `audienceSnapshots` (T09); antes implícita por el nombre |
| `recipientCount` | int | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `draft`, `pendingApproval`, `approved`, `generating`, `sent`, `partiallyFailed`, `cancelled` | — |
| `communicationRunIds` | array | [VERIFICAR] | T09 | → T09 `campaigns` (envío masivo de la corrida, COL-COM-47) (PA-CRM-20; antes "[VERIFICAR] corridas de comunicación de T09 (colección no identificada en T05)") |
| `printDocumentId` | ObjectId | No | — | → T11 `documents` (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `labelsDocumentId` | ObjectId | No | — | → T11 `documents` (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `workOrderCommandIds` | array | [VERIFICAR] | — | → M09 `crmCommandRequests` (comandos de OT que emite la corrida) (PA-CRM-20; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `approvedBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `approvedAt` | Date | [VERIFICAR] | — | — |
| `results` | object | [VERIFICAR] | `{ delivered, failed, printed }` | — |

### 7.45 Residuales del 5-11-2026: referencias y nombres de T05 (PA-CRM-20)

Ronda de residuales detectados al regenerar los entregables (categorías 2 y 4 de `_trabajo/residuales-instrucciones.md`). Las filas de §7.3 a §7.20 y de §7.44 quedaron corregidas en su lugar con "antes"; esta tabla las resume.

| Colección | Campo | Tipo | Referencia | Antes |
|---|---|---|---|---|
| `crmConversations` | `externalThreadId` | string | No es referencia (identificador externo) | sin destino |
| `crmStatusSets` | `workflowRef` | ObjectId | → T11 `workflowDefinitions` | "ObjectId (T11)" |
| `crmCommandRequests` | `dependsOnCommandId` | ObjectId | → M09 `crmCommandRequests` | sin destino |
| `crmContacts` | `mergedInto` | ObjectId | → M09 `crmContacts` | sin destino |
| `crmIncidents` | `failureTypeId` | ObjectId | → M10 `incidentCategories` | "ObjectId (M10)" |
| `crmHourBanks` | `saleRef` | ObjectId | → M05 `invoices` | "ObjectId (M11/M05)" |
| `crmAiSuggestions` | `targetType` / `targetId` | enum / ObjectId | Discriminador / polimórfica (`crmCases`, `crmConversations`, `crmMessages`, `storedFiles`) | sin destino |
| `crmAiSuggestions` | `aiUsageLogId` | ObjectId | → T06 `aiUsageLogs` | solo en T05 |
| `crmActivityOccurrences` | `closedByResponsibleId` | ObjectId | → T02 `memberships` | sin destino |
| `crmCircularRuns` | `communicationRunIds` | ObjectId[] | → T09 `campaigns` | sin destino |
| `crmCircularRuns` | `workOrderCommandIds` | ObjectId[] | → M09 `crmCommandRequests` | sin destino |

Campos que T05 cita con otro nombre (prevalece el anexo; T05 debe reflejarlo): `caseId` de COL-CRM-02, 04, 12, 17, 19 y 26 es `crmCaseId` (nombre canónico de la propia T05 §7.2, CTR-DAT-30; en `crmAiSuggestions` el caso es `targetType` = `case` + `targetId`); `crmAreas.branchId` es `branchIds[]`; `crmSlaPolicies.caseSubtypeId` es `scope.caseSubtypeIds[]`; `crmRoutingRules.areaId` es `target.areaId`; `crmChannels.connectionId` es `providerConnectionId`; `crmWorkLogs.projectId` no existe (el proyecto se toma del caso, `crmCases.projectId`); `crmCommandRequests.operationId` y `crmProcedureTypes.documentRequirementTypeIds[]` no existen en el anexo y T05 debe quitarlos (los requisitos documentales de M09 se declaran en `crmCaseTypes.requirementsTemplate`). Los `code` que T05 declara único ya figuran en §7.44 como "Declarado en T05".

## 8. Estados y transiciones

### 8.1 Caso (`crmCases.baseStatus`)

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Socio (portal/app), bot | Gestión iniciada sin enviar | Guarda borrador 7 días (PRM-CRM-016) | Se descarta al vencer (no hay número asignado) |
| — / `draft` | `received` | Socio, agente, bot, sistema, público | Datos mínimos del tipo; validación de pertenencia | Asigna número; calcula SLA; evento `crm.case.created`; constancia si es solicitud; aviso "recibido"; propuesta IA (si habilitada); regla de urgencia | Cancelación |
| `received` | `pendingInfo` | Supervisor, empleado | Al menos un requisito `pending` | Pausa SLA (si política); aviso al socio con faltantes y plazo | Al completar → `received`/estado previo |
| `pendingInfo` | `received` / estado previo | Sistema (socio aportó), empleado | Requisitos completos | Reanuda SLA; evento | — |
| `pendingInfo` | `cancelled` | Sistema | Venció plazo y el tipo cancela por desistimiento (PRM-CRM-015) | Aviso de cancelación con motivo | Recuperar (RN-CRM-041) |
| `received`/`reopened` | `derived` | Supervisor (o regla `autoDerive` habilitada) | Tipo/servicio clasificados; área elegida | Aviso al área; evento `crm.case.derived` | Devolver a supervisión |
| `derived` | `received` | Empleado del área | Motivo obligatorio | Vuelve a "sin derivación" | — |
| `derived` | `assigned` | Supervisor, responsable de área, empleado (autoasignación) | Usuario miembro del área | Aviso al asignado | Reasignar |
| `assigned` | `inProgress` | Asignado (tomar) o primera acción de trabajo | — | Registra primera respuesta si es mensaje visible | — |
| `inProgress` | `waitingCustomer` | Empleado | Mensaje visible enviado al socio | Pausa SLA si política | Respuesta del socio → `inProgress` |
| `inProgress`/`received` | `inEvaluation` | Supervisor/empleado | Tipo con aprobación (T11) | Crea aprobación T11 | Decisión |
| `inEvaluation` | `approved` | Aprobador (`crm.casos.aprobar`) | Decisión T11 aprobada | Habilita comandos `commandsOnApproval` | Anulación con nueva aprobación |
| `inEvaluation` | `rejected` | Aprobador | Motivo obligatorio | Aviso al socio con motivo; cierre posterior | Reapertura con nueva evidencia |
| `approved`/`inProgress` | `inExecution` | Sistema | Al menos un comando emitido | Seguimiento de `crmCommandRequests` | Cancelar comandos |
| `inExecution` | `inProgress` | Sistema | Comando `rejected`/`failed` | Alerta al responsable | Reintento |
| `inExecution` | `resolved` | Sistema o empleado | Todos los comandos `executed` (o decisión explícita) | Fecha efectiva; aviso al socio | Reapertura |
| `inProgress`/`waitingCustomer` | `resolved` | Empleado | Solución + código de resolución; subtipo sin bloqueo | Aviso de resolución; inicia plazo de cierre automático | Disconformidad del socio → `reopened` |
| `resolved` | `closed` | Socio (conforme), empleado, sistema (cierre automático) | Tipo de cierre; causa si aplica; sin comandos pendientes | Encuesta post-cierre; métricas; evento `crm.case.closed` | Reabrir dentro de ventana |
| `resolved`/`closed` | `reopened` | Socio (dentro de ventana), supervisor | Motivo; dentro de `reopenWindowDays` | `reopenCount++`; recalcula SLA de resolución | — |
| `reopened` | `derived`/`assigned`/`inProgress` | Supervisor/empleado | — | — | — |
| cualquiera no final | `cancelled` | Socio (desistimiento), supervisor | Motivo; si hay comandos ejecutados, no se permite (usar resolución) | Cancela comandos pendientes; aviso; presupuesto → M11 | Recuperar con nota |
| cualquiera no final | `merged` | Supervisor | Caso principal abierto | Mensajes/adjuntos visibles enlazados al principal; aviso al socio con número principal | Desfusionar (supervisor) |
| `inExecution` | `conflict` | Sistema | Evento de M10/M02 contradictorio (ej. intervención ejecutada tras cancelación, ESC-03) | Alerta a supervisión con ambas evidencias | Resolución manual → `inProgress` o `resolved` |
| `closed`/`cancelled` | estado previo no final | Supervisor (`crm.casos.reabrir`) | Nota; sin horas facturadas | Evento `recovered` | — |

Estados visibles: cada estado configurable mapea a uno de los anteriores (ver §7.8). Estados de BASE §39.5 para **Solicitud**: Borrador → `draft`, Pendiente de documentación → `pendingInfo`, En evaluación → `inEvaluation`, Aprobada → `approved`, Rechazada → `rejected`, Cancelada → `cancelled`. Para **Reclamo**: Abierto → `received`, Asignado → `assigned`, En tratamiento → `inProgress`, Resuelto → `resolved`, Cerrado → `closed`, Reabierto → `reopened`. Estados base de tickets ProCoop: 1 Pendiente → `received`/`derived`; 2 En proceso → `assigned`/`inProgress`/`waitingCustomer`; 3 Cerrado → `closed`; 4 Cancelado → `cancelled`.

### 8.2 Solicitud de comando (`crmCommandRequests.status`)

Estado inicial: `requested`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `requested` | CRM | Caso aprobado o tipo sin aprobación | Outbox → módulo destino | `cancelRequested` |
| `requested` | `accepted` | Módulo destino | Validación OK | Evento al caso | — |
| `requested` | `rejected` | Módulo destino | Regla del dueño (ej. contrato no existe) | Caso vuelve a `inProgress` con motivo | Nuevo comando |
| `accepted` | `executed` | Módulo destino | Efecto real ocurrido (ej. `cat.contract.cancelled`) | Fecha efectiva al caso | Solo por comando inverso del dueño |
| `accepted` | `failed` | Módulo destino | Error de ejecución | Reintento automático hasta PRM-CRM-080; alerta | Reintento manual |
| `requested`/`accepted` | `cancelRequested` → `cancelled` | CRM / dueño | Dueño confirma que no hubo efecto | Caso continúa | — |

### 8.3 Incidente (`crmIncidents.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `suspected` | Sistema (detección) | Umbral alcanzado | Alerta a supervisor | `discarded` |
| — / `suspected` | `confirmed` | Supervisor, M10 (evento de red) | Servicio y alcance | Número; aviso inicial a afectados (opcional); vincula casos | — |
| `confirmed` | `inProgress` | Sistema | OT solicitada a M10 aceptada | Aviso de avance | — |
| `inProgress` | `restored` | M10 / supervisor | OT ejecutada o confirmación técnica | Casos vinculados → `resolved` pendientes de confirmación; aviso de restablecimiento | Volver a `inProgress` si recae |
| `restored` | `closed` | Supervisor | Plazo de observación cumplido (PRM-CRM-040) | Métricas; reporte regulatorio | Reabrir → `inProgress` |
| `suspected`/`confirmed` | `discarded` | Supervisor | Motivo | Casos se desvinculan y siguen individualmente | — |

### 8.4 Conversación (`crmConversations.status`)

Estado inicial: `botActive`.

`botActive` → `queued` (traspaso a humano o fuera del bot) → `assigned` → `active` → `waitingCustomer` → `active` → `closed`. `active`/`waitingCustomer` → `expired` cuando vence la ventana del canal sin respuesta (WhatsApp 24 h; chat web inactividad PRM-CRM-064). Cerrar una conversación no cambia el caso (RN-CRM-003). Un mensaje entrante en `closed`/`expired` reabre la conversación (`queued`) y la vincula al último caso abierto de esa persona si existe.

### 8.5 Turno (`crmQueueTickets.status`)

Estado inicial: `waiting`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `waiting` | Recepción, tótem, web/app/WhatsApp, check-in de reserva | Área habilitada | Acciones `received` + `waiting`; tiempo estimado | `cancelled` |
| `waiting` | `calling` | Operador de box | Box abierto con área del turno; llamado atómico | Pantalla y voz; aviso push/WhatsApp si es remoto | Rellamar / `noShow` |
| `calling` | `inService` | Operador | Persona presente | Inicio de atención | — |
| `calling` | `finished` (`noShow`) | Operador | Tras N rellamados (PRM-CRM-107) | Interacción `abandoned` | — |
| `inService` | `waiting` (otra área) | Operador (derivar) | Área destino habilitada | Cambia `areaId`; conserva origen; acción `derived` | — |
| `inService` | `finished` (`solved`/`unsolved`) | Operador | Motivo y resultado | Interacción; caso opcional | — |
| `waiting` | `finished` (`noShow`) | Sistema | Cierre del día (RN-CRM-071) | Acción `finishedNoShow` | — |
| `waiting` | `cancelled` | Socio (remoto), recepción | — | — | — |

### 8.6 Reserva (`crmQueueAppointments.status`)

Estado inicial: `booked`.

`booked` → `confirmed` (confirmación del socio o automática) → `checkedIn` (genera turno `appointment` con prioridad de hora) ; `booked`/`confirmed` → `cancelled` (socio o tenant, con aviso) ; `booked`/`confirmed` → `noShow` (pasado `slotEnd` + tolerancia PRM-CRM-111).

### 8.7 Ocurrencia de actividad (`crmActivityOccurrences.status`)

Estado inicial: `pending`.

`pending` → `dueSoon` (hoy ≥ fecha − margen anterior) → `overdue` (hoy > fecha + margen posterior) ; `pending`/`dueSoon`/`overdue` → `closedOnTime` (cierre ≤ fecha + margen posterior) | `closedLate` (cierre posterior) | `closedWithReview` (cierre con revisión) ; cualquiera no cerrada → `voided` (con motivo, por responsable del área). Con aprobación: cierre queda `pendingApproval` hasta que otro usuario aprueba (estado auxiliar `approval.approvedAt`). Reversión: reabrir ocurrencia cerrada por responsable del área con nota.

### 8.8 Sugerencia de IA (`crmAiSuggestions.status`)

Estado inicial: `proposed`.

`proposed` → `accepted` | `corrected` | `discarded` (decisión humana) ; `proposed` → `expired` (el caso avanzó sin decisión) ; creación directa `failed` (error del proveedor; no bloquea). No hay reversión: una nueva sugerencia es un registro nuevo.

Transiciones explícitas (el texto anterior no mostraba el origen de `failed`):

| Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|
| (nuevo) | `proposed` | Respuesta válida del proveedor de IA | — | — |
| (nuevo) | `failed` | Error o tiempo agotado del proveedor de IA | No bloquea el caso | — |
| `proposed` | `accepted` · `corrected` · `discarded` | Decisión del operador | Usuario humano con acceso al caso | — |
| `proposed` | `expired` | El caso avanzó sin decisión | Cambio de estado del caso posterior a la sugerencia | — |

### 8.9 Trámite presentado (`crmProcedureRecords.status`)

Estado inicial: `notPresented`.

`notPresented` → `presented` (carga con documentación) → `expired` (job: vencimiento sin otro vigente; ejecuta acciones `onExpiry`) ; `presented` → `superseded` (se carga uno nuevo del mismo tipo) ; cualquiera → `voided` (error de carga, con motivo).

### 8.10 Corrida de circular (`crmCircularRuns.status`)

Estado inicial: `draft`.

`draft` → `pendingApproval` (si el modelo lo exige) → `approved` → `generating` → `sent` | `partiallyFailed` ; `draft`/`pendingApproval` → `cancelled`. Una corrida enviada no se reenvía: los fallidos se reintentan por T09 o en una corrida nueva con universo "fallidos de la corrida X".

### 8.11 Mesa de entradas (pases)

Estado inicial: pase `sent`.

Cada pase: `sent` → `acknowledged` (acuse del área) ; `sent` → `returned` (área rechaza con motivo). El expediente sigue el ciclo de §8.1; `resolved` exige registrar la salida o la decisión "sin respuesta requerida".

### 8.12 Otras colecciones con estado (`crmProjects.status`, `crmChannels.status`)

Los valores ya estaban en §7; se explicitan las transiciones.

Estado inicial: ver las filas `(nuevo)`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `crmProjects` | (nuevo) | `active` | Alta del proyecto | — | — |
| `crmProjects` | `active` | `onHold` | Pausa por el responsable | — | — |
| `crmProjects` | `onHold` | `active` | Reanudación | — | — |
| `crmProjects` | `active` · `onHold` | `closed` | Cierre por el responsable | Sin casos abiertos del proyecto | — |
| `crmChannels` | (nuevo) | `draft` | Alta del canal | — | — |
| `crmChannels` | `draft` | `testing` | Prueba de conexión | Credenciales del conector cargadas (T06) | — |
| `crmChannels` | `testing` | `active` | Activación | Prueba exitosa | — |
| `crmChannels` | `active` | `suspended` | Suspensión manual o caída del conector | — | — |
| `crmChannels` | `suspended` | `active` | Reactivación | Prueba exitosa | — |

### 8.13 Evento de calendario (`crmCalendarEvents.status`)

El campo `status` (`ESTADO`) no tenía valores (§7.44.31). Valores y transiciones asumidos en PA-COB-19 de M07 (pendiente 8 del cierre, DEC-072). Cada cambio se proyecta en `agendaEntries` de T11.

Estado inicial: `scheduled`.

| Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|
| (nuevo) | `scheduled` | Alta manual del usuario o proyección desde una ocurrencia de actividad o un caso (`source`) | `start` anterior o igual a `end` | — |
| `scheduled` | `completed` | El usuario lo marca realizado o se cierra la fuente (ocurrencia o caso) | — | — |
| `scheduled` | `cancelled` | El usuario lo cancela o se anula la fuente | — | — |
| `scheduled` | `missed` | Job diario: pasó `end` sin marcarlo realizado | En eventos recurrentes aplica a cada instancia | — |
| `completed` · `missed` | `scheduled` | El usuario lo reprograma con fecha nueva | Solo eventos manuales (`source.type` = `manual`) | — |

### 8.14 Máquinas completadas y altas explícitas (residuales del 5-11-2026, PA-CRM-20)

Traslada a tabla las máquinas que §8.1, §8.4, §8.6, §8.7, §8.9 y §8.10 daban en texto (el estado inicial solo figuraba como "Estado inicial: x" o "—"), agrega las transiciones de `crmWorkLogs.billingStatus` (solo tenía valores) y la tabla de `crmBotFlows` (patrón de publicación). Las filas `(nuevo)` fijan el estado inicial. Valores asumidos en PA-CRM-20 (DEC-072); coinciden con §7. Prevalece esta tabla sobre el texto de las secciones citadas cuando difieran.

`crmCaseSubtypes.defaultStatus` no es un campo de estado del subtipo: es un parámetro que indica el estado visible con el que nace un caso del subtipo (un `code` de `crmStatusSets.states[]`, §7.7); no tiene máquina propia. La tabla "Estados visibles" de §8.1 y los pases de §8.11 no son colecciones aparte.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `crmCases.baseStatus` | (nuevo) | `draft` | Socio (portal o app) o bot inicia la gestión sin enviarla | — | — |
| `crmCases.baseStatus` | (nuevo) | `received` | Alta directa por socio, agente, bot, sistema o público | Datos mínimos del tipo | `crm.case.created` |
| `crmConversations` | (nuevo) | `botActive` | Primer mensaje entrante en un canal con bot (`botFlowId`) | — | — |
| `crmConversations` | (nuevo) | `queued` | Primer mensaje entrante en un canal sin bot o fuera del bot | — | — |
| `crmConversations` | `botActive` | `queued` | Traspaso a humano | — | — |
| `crmConversations` | `queued` | `assigned` | Asignación a un agente | — | — |
| `crmConversations` | `assigned` | `active` | El agente responde | — | — |
| `crmConversations` | `active` | `waitingCustomer` | Mensaje del agente que espera respuesta | — | — |
| `crmConversations` | `waitingCustomer` | `active` | Respuesta del socio | — | — |
| `crmConversations` | `active` · `waitingCustomer` | `closed` | Cierre por el agente | No cambia el caso (RN-CRM-003) | — |
| `crmConversations` | `active` · `waitingCustomer` | `expired` | Vence la ventana del canal sin respuesta | WhatsApp 24 h; chat web PRM-CRM-064 | — |
| `crmConversations` | `closed` · `expired` | `queued` | Mensaje entrante nuevo | Se vincula al último caso abierto de la persona | — |
| `crmProcedureRecords` | (nuevo) | `notPresented` | Alta del trámite exigido sin documentación | — | — |
| `crmProcedureRecords` | (nuevo) | `presented` | Carga del trámite con documentación | — | — |
| `crmProcedureRecords` | `notPresented` | `presented` | Carga de la documentación | — | — |
| `crmProcedureRecords` | `presented` | `expired` | Job de vencimientos | Sin otro trámite vigente del mismo tipo; ejecuta `onExpiry` | — |
| `crmProcedureRecords` | `presented` | `superseded` | Carga de un trámite nuevo del mismo tipo | — | — |
| `crmProcedureRecords` | `notPresented` · `presented` · `expired` · `superseded` | `voided` | Anulación por error de carga | Motivo obligatorio | — |
| `crmWorkLogs.billingStatus` | (nuevo) | `pending` | Cierre del registro de tiempo con minutos a facturar | `billableMinutes` mayor que cero y tipo facturable | — |
| `crmWorkLogs.billingStatus` | (nuevo) | `notBillable` | Cierre del registro de tiempo no facturable | Tipo no facturable o `billableMinutes` = 0 | — |
| `crmWorkLogs.billingStatus` | `pending` | `coveredByBank` | Consumo de una bolsa de horas (`hourBankId`) | Bolsa vigente con saldo (RN-CRM-050) | — |
| `crmWorkLogs.billingStatus` | `pending` | `requested` | Solicitud de facturación a M05 (API-CRM-44) | `crm.horas.facturar` | — |
| `crmWorkLogs.billingStatus` | `requested` | `billed` | M05 emite el comprobante (`invoiceRef`) | — | — |
| `crmWorkLogs.billingStatus` | `requested` | `pending` | M05 rechaza o anula el cargo pedido | — | — |
| `crmWorkLogs.billingStatus` | `pending` | `notBillable` | El responsable bonifica el tiempo | Nota obligatoria | — |
| `crmQueueAppointments` | (nuevo) | `booked` | Reserva desde web, app, WhatsApp o recepción | Franja con cupo | — |
| `crmQueueAppointments` | `booked` | `confirmed` | Confirmación del socio o automática | — | — |
| `crmQueueAppointments` | `booked` · `confirmed` | `checkedIn` | Check-in del socio | Genera turno `appointment` con prioridad de hora | — |
| `crmQueueAppointments` | `booked` · `confirmed` | `cancelled` | Cancelación del socio o del tenant | Con aviso | — |
| `crmQueueAppointments` | `booked` · `confirmed` | `noShow` | Job: pasó `slotEnd` más la tolerancia | PRM-CRM-111 | — |
| `crmActivityOccurrences` | (nuevo) | `pending` | Generación automática o alta manual de la ocurrencia | — | — |
| `crmActivityOccurrences` | `pending` | `dueSoon` | Job diario | Hoy mayor o igual a fecha menos margen anterior | — |
| `crmActivityOccurrences` | `dueSoon` | `overdue` | Job diario | Hoy mayor que fecha más margen posterior | — |
| `crmActivityOccurrences` | `pending` · `dueSoon` · `overdue` | `closedOnTime` | Cierre por el responsable | Cierre hasta fecha más margen posterior | — |
| `crmActivityOccurrences` | `pending` · `dueSoon` · `overdue` | `closedLate` | Cierre por el responsable | Cierre posterior al margen | — |
| `crmActivityOccurrences` | `pending` · `dueSoon` · `overdue` | `closedWithReview` | Cierre con revisión | Aprobación de otro usuario si la actividad la exige | — |
| `crmActivityOccurrences` | `pending` · `dueSoon` · `overdue` | `voided` | Anulación por el responsable del área | Motivo obligatorio | — |
| `crmActivityOccurrences` | `closedOnTime` · `closedLate` · `closedWithReview` | `pending` | Reapertura por el responsable del área | Nota obligatoria | — |
| `crmCircularRuns` | (nuevo) | `draft` | Alta de la corrida sobre un modelo de circular | — | — |
| `crmCircularRuns` | `draft` | `pendingApproval` | Envío a aprobación | El modelo exige aprobación | — |
| `crmCircularRuns` | `draft` · `pendingApproval` | `approved` | Aprobación (o confirmación si no exige aprobación) | — | — |
| `crmCircularRuns` | `approved` | `generating` | Inicio de la generación | — | — |
| `crmCircularRuns` | `generating` | `sent` | Envío completo por T09 | — | — |
| `crmCircularRuns` | `generating` | `partiallyFailed` | Envío con destinatarios fallidos | Los fallidos se reintentan por T09 o en una corrida nueva | — |
| `crmCircularRuns` | `draft` · `pendingApproval` | `cancelled` | Cancelación | — | — |
| `crmBotFlows` | (nuevo) | `draft` | Alta del flujo por el configurador | — | — |
| `crmBotFlows` | `draft` | `published` | Publicación | Flujo validado; la versión publicada no se edita (se crea otra `version`) | — |
| `crmBotFlows` | `published` | `archived` | Publicación de la versión sucesora o retiro | — | — |

## 9. Procesos y flujos

### 9.1 Ingreso y supervisión de un caso (circuito BASE §47)

1. **Ingreso**: el socio se identifica (o no, en canales públicos), elige servicio y cuenta cuando corresponda, describe la gestión por formulario, conversación o bot. El agente puede registrar en nombre del socio (ventanilla, teléfono).
2. **Validación**: se valida pertenencia de la cuenta (RN-CRM-005), datos mínimos del tipo y vía de ingreso (RN-CRM-058). Si falta identificar la cuenta, se crea igual con `context.accountId = null` y marca "cuenta a identificar".
3. **Evidencia**: adjuntos se suben a T11 (escaneo antivirus; límites PRM-CRM-017/018) y se ligan al mensaje.
4. **Asistencia IA** (si habilitada, O6): se encola `crm:ai-classify`; la sugerencia aparece al supervisor; no bloquea.
5. **Registro**: transacción Mongo que crea `crmCases`, primer `crmCaseEvents` y outbox `crm.case.created`; número del contador atómico; SLA calculado. Respuesta al socio con número y constancia.
6. **Duplicados**: búsqueda por cuenta + servicio + subtipo en ventana; si hay coincidencia, se marca `possibleDuplicateOf` para supervisión (no bloquea).
7. **Urgencias**: si el subtipo es `urgentSafety`, se ejecutan reglas `onCallNotify` inmediatamente y se muestra al socio el mensaje de seguridad (PRM-CRM-019).
8. **Supervisión**: el caso aparece en "sin derivación". El supervisor revisa servicio, cuenta, motivo, evidencia y propuesta IA; acepta o corrige la clasificación (registro en `crmAiSuggestions`), ajusta prioridad.
9. **Derivación**: elige área (o acepta la sugerida por regla); opcionalmente asigna responsable. Con `autoDerive` habilitado (PA-CRM-02), la regla deriva sola y el caso sigue visible en supervisión.
10. **Atención**: el empleado toma el caso, conversa, pide datos (`pendingInfo`), vincula o solicita OT (comando `tec.workOrder.request`), registra intervenciones y tiempo.
11. **Resolución**: registra solución, código y resultado real; el sistema avisa al socio; el caso queda `resolved`.
12. **Cierre**: por conformidad del socio, por empleado con tipo de cierre, o automático tras `autoCloseDays` (JOB-CRM-03). Se envía la encuesta post-cierre (T09).
13. **Reapertura**: dentro de la ventana el socio o supervisor reabre; fuera, se crea caso nuevo vinculado.

### 9.2 Solicitud de alta de servicio (piloto Internet, CU-15, CU-SOL-01)

1. Socio elige Internet y plan (catálogo M02); el sistema registra `requestedServiceId` y `requestedPlanId` sin contrato.
2. Requisitos del tipo `serviceActivation` para Internet: domicilio de instalación, documento, aceptación de condiciones (versión), factibilidad.
3. Supervisión deriva al área Comercial. Si faltan requisitos → `pendingInfo`.
4. Comando `tec.feasibility.request` a M10; el caso queda `inEvaluation` esperando `tec.feasibility.verdictIssued` (EVT-TEC-02).
5. Factible → aprobación T11 (si el tipo la exige) → `approved` → comandos en orden: `cat.contract.requestActivation` (crea contrato `Solicitado/Pendiente de instalación` en M02) y `tec.workOrder.request` (instalación). Estado `inExecution`.
6. M10 informa visita, instalación, equipo en comodato; M02 activa el contrato con fecha efectiva (`cat.contract.activated`). El caso pasa a `resolved` con fecha efectiva; aviso al socio.
7. No factible → `rejected` con motivo comunicado; el caso conserva la evidencia.
8. Cancelación por el socio antes de instalar: se pide `tec.workOrder.requestCancel` y `cat.contract.requestCancellation` (si se creó); no se exige retiro de equipo (RN-CRM-027). Si M10 informa instalación ejecutada offline después de la cancelación → `conflict` (ESC-03).

### 9.3 Solicitud de baja autenticada y pública (CIC-001, BASE §52.3)

1. **Autenticada**: el socio elige el contrato; el sistema muestra fecha solicitada, plazo de respuesta, efectos (equipos a devolver, facturación final de lo devengado informada por M05) y **sin cargo por solicitar**. Confirma; se crea el caso con constancia y código.
2. **Pública** (`/api/public/<tenantSlug>/crm/cancellations`): formulario visible sin login con datos mínimos (PA-CRM-15): nombre, documento, servicio, domicilio o número de cuenta, canal de contacto. Rate limit y captcha. Se crea el caso con `requester.identityStatus = unverified`, `cancellationRequest.isPublic = true`, código identificador mostrado en pantalla y enviado por el mismo medio (email/SMS) con `receiptDeadlineAt = recepción + 24 h`.
3. **Constancia** (JOB-CRM-06): verifica que la constancia fue entregada antes del plazo; si el canal falla, intenta canal alternativo y alerta a supervisión; registra evidencia (AGR-024).
4. **Identificación posterior**: supervisión vincula el caso con la persona/contrato sin exigir trámites obstructivos; si no hay coincidencia, contacta al solicitante.
5. **Ejecución**: comando `cat.contract.requestCancellation` con fecha efectiva solicitada; M10 retiro de equipos si corresponde; M05 facturación final de lo devengado. La deuda previa se informa pero no condiciona (RN-CRM-015).
6. **Cierre**: con evento `cat.contract.cancelled`; aviso con fecha efectiva; el vínculo asociativo no cambia (RN-CRM-010).

### 9.4 Suspensión temporal y reactivación (CU-CIC-01)

1. Socio solicita suspender Internet desde una fecha; la app muestra modalidades habilitadas y validadas para su contrato (gratuita o arancelada, PRM-CRM-034).
2. Acepta condiciones (versionadas); comando `cat.contract.requestSuspension`.
3. Ejecución confirmada (M02/M10 aprovisionamiento) → `resolved` con fecha efectiva.
4. Reactivación: el sistema consulta estado y reglas (M02/M08); si hay cargo válido, se informa; si se paga, el caso **sigue en trámite** hasta `cat.contract.reactivated` (RN-CRM-013).

### 9.5 Cambio de plan, cambio de titular, traslado

- **Cambio de plan**: cotización (M04) con proporcional informativo; comando `cat.contract.requestPlanChange` con fecha efectiva; el proporcional lo calcula M05.
- **Cambio de titular**: requisitos de ambas partes (documento, conformidad del cedente, aceptación del cesionario, libre deuda solo si una norma lo habilita y está configurado); comando `per.account.requestOwnerTransfer`; M01 registra la transferencia (`TRANSFER`).
- **Traslado**: nuevo domicilio y factibilidad; comandos `tec.feasibility.request` y `tec.workOrder.request` (operación traslado); al ejecutarse, M01 actualiza domicilio del servicio.

### 9.6 Reclamo técnico con incidente común (CU-16, piloto Internet)

1. Llegan reclamos "sin conexión" de la misma zona; JOB-CRM-05 detecta ≥ N casos en la ventana y propone INC al supervisor.
2. Supervisor confirma el incidente con alcance (zona/nodo de M10); el sistema vincula casos abiertos coincidentes y calcula afectados.
3. Se pide una sola OT/gestión técnica a M10; se envía aviso a afectados (T09) con estimado.
4. Nuevos reclamos que coinciden con el alcance se vinculan automáticamente si el supervisor habilitó "vinculación automática al incidente confirmado" (PRM-CRM-039) y el socio recibe el mensaje del incidente.
5. M10 informa restablecimiento → incidente `restored` → casos `resolved` pendientes de confirmación; aviso de restablecimiento.
6. Si un socio responde que sigue sin servicio, su caso se desvincula, vuelve a `inProgress` y se pide OT individual (CU-16 excepción).
7. Cierre del incidente tras el plazo de observación; métricas e informe regulatorio.

### 9.7 SLA (JOB-CRM-01)

1. Al crear o reclasificar, se resuelve la política (subtipo > tipo; servicio; prioridad) y se calculan vencimientos con el calendario hábil de T04 (feriados del tenant y de la localidad).
2. Cada minuto el job evalúa casos con vencimientos próximos: al `warnAtPercent` emite `crm.case.slaWarning` y avisa al responsable; al 100 % emite `crm.case.slaBreached`, escala según niveles y marca incumplimiento (no se borra aunque luego se cumpla).
3. Las pausas acumulan `pausedMs` y desplazan vencimientos.
4. El supervisor con `crm.sla.excepcionar` puede registrar excepción justificada (no borra el incumplimiento; lo califica).

### 9.8 Bot de WhatsApp (O6)

1. Webhook entrante (T06) → verificación de firma → resolución del tenant por número → idempotencia por `providerMessageId` → `crmMessages`.
2. Si la conversación está en `botActive`, `crm:bot-step` procesa: intención (NLU/IA con umbral), verificación si la intención la exige (PA-CRM-07), ejecución de la consulta (saldo M07, segunda vía M05, link de pago M07, estado de casos, cortes programados de incidentes) o creación de caso.
3. Traspaso a humano: por intención `human`, por límite de turnos, por palabra clave, por baja confianza o por error; la conversación pasa a `queued` del área del canal con transcripción y resumen.
4. Fuera de horario: el bot informa horario y plazo, crea caso y ofrece teléfono de guardia si la intención es urgencia (PA-CRM-08).
5. Salientes fuera de ventana: solo plantillas aprobadas (RN-CRM-082).

### 9.9 Email entrante (O6)

`crm:email-ingest` lee la casilla del canal (IMAP o webhook del proveedor), detecta número de caso en el asunto (`[TCK-…]`) o en cabeceras de respuesta, agrega el mensaje al caso o crea uno nuevo en supervisión; adjuntos a T11 con escaneo; respuestas automáticas y rebotes se descartan como interacción técnica.

### 9.10 Turnero (O10)

1. Recepción/tótem/web emite turno en área: contador atómico por (sucursal, día, área de origen); código visible según PRM-CRM-100/101; acciones `received` y `waiting`; estimado de espera.
2. Operador abre box (único abierto), elige áreas (por defecto sus áreas asignadas).
3. "Llamar siguiente": `findOneAndUpdate` condicional sobre el turno `waiting` más prioritario y antiguo de sus áreas → `calling`; evento a pantallas (WebSocket) y voz; aviso push/WhatsApp si es turno remoto.
4. Atiende → `inService`; deriva → vuelve a `waiting` en otra área; finaliza con motivo y resultado → interacción y caso opcional.
5. Fin de día (JOB-CRM-08): turnos en espera → `noShow`; boxes abiertos se cierran con nota.
6. Hardware: impresión del ticket por el agente local (T06) con reintento; si no hay agente, se muestra QR/código en pantalla.

### 9.11 Actividades internas (O10)

1. JOB-CRM-09 (diario, idempotente por fecha): por cada actividad automática vigente, calcula la próxima fecha; si próxima fecha − margen anterior ≤ hoy y no existe ocurrencia para esa fecha y no supera la vigencia, crea la ocurrencia y la cita del responsable.
2. JOB-CRM-10 (diario, una vez por día según marca): recalcula estados; envía recordatorios por actividad, por responsable y por área en los días de envío configurados, con resumen de atraso promedio; escala vencidas tras N días.
3. Cierre: responsable registra observación, evidencia, revisión; si requiere aprobación, queda pendiente; al cerrar se envía aviso de finalización.

### 9.12 Trámites con vencimiento (O7)

JOB-CRM-07 (diario): detecta trámites vencidos sin otro vigente del mismo tipo para la misma entidad; marca `expired`; ejecuta acciones `onExpiry` como comandos (por ejemplo, solicitar a M07/M04 la baja de un beneficio de tarifa social); un error en una acción no frena las demás; registra resultado. Al alta de un trámite, ejecuta acciones `onCreate`.

### 9.13 Circulares (O6)

1. Operador elige modelo; define/ajusta audiencia (T09) con filtros de deuda, mora, adhesión y servicio.
2. Previsualiza con datos ficticios y conteo; si el modelo requiere, pasa a aprobación.
3. Generación (JOB-CRM-11): congela universo; produce PDF de impresión y etiquetas, o envía por T09 por canal; opcionalmente pide OT masivas a M10 por comando idempotente por cuenta.
4. Informe de comunicación con entregados/fallidos.

### 9.14 Recuperación y reintentos

- Todos los jobs son idempotentes y reanudables (marca de progreso por lote).
- Comandos: reintento exponencial hasta PRM-CRM-080; luego `failed` y alerta.
- Webhooks: deduplicación por id externo; reproceso de la bandeja `webhookInbox` (T06).
- Restauración: comunicaciones y comandos con id externo no se reenvían; se concilian (ESC-04, RN-CRM-096).

## 10. Pantallas

Todas las pantallas admin usan AdminShell, `AdminStickyHeader` (título, subtítulo, acciones), `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` con vistas guardadas y exportación, modales `sm/md/lg/xl`, toasts y `ConfirmDialog`; etiquetas por `dict:`. Las PWA usan AppShell, cards de anatomía fija, alta en modal desde FAB, 3 skeleton cards y errores inline (CNX §3, §4). Grupo del mapa del sitio: **Atención** (cluster CRM), con subgrupos Bandejas, Solicitudes y reclamos, Canales, Presencial, Mesa de entradas, Actividades, Comunicaciones, Configuración.

| PAN-ID | App | Ruta | Capability | Propósito | Layout, filtros, columnas, acciones, modales, estados vacíos | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|
| PAN-CRM-01 | admin | `/crm/supervision` | `crm.bandejaSupervision.ver` | Bandeja de supervisión | Filtros: servicio, tipo, subtipo, estado, área, prioridad, antigüedad, responsable, canal, SLA (en riesgo/vencido), "sin clasificar", "sin derivación", posible duplicado, urgente. Columnas: número, prioridad (chip), asunto, socio, cuenta, servicio, canal, estado, área, responsable, antigüedad, vence SLA, sugerencia IA. Acciones: derivar, asignar, reclasificar, vincular a incidente, fusionar, acciones masivas, exportar. Modal `md` derivar (área, responsable, motivo); modal `lg` vista rápida. Vacío: "No hay casos pendientes de derivación". | — (nuevo) |
| PAN-CRM-02 | admin | `/crm/bandeja` | `crm.casos.ver` | Bandeja de mi área y mis casos | Pestañas: Mis casos (cola ordenable, arrastrar), Mi área, Tomado, En espera del socio, Vencidos. Agrupación por vencimiento (Vencidos/Hoy/Mañana/7 días/Futuro/Sin fecha). Acciones: tomar, pausar, soltar, espera del socio, avanzar estado, responder. Indicador "sin intervención 7 / 8+ días". | frmDatosTicketsSimple; listados de tickets |
| PAN-CRM-03 | admin | `/crm/casos/:id` | `crm.casos.ver` | Expediente del caso | Cabecera sticky con número, estado (selector de transiciones válidas), prioridad, SLA (barra), acciones (tomar, derivar, asignar, pedir datos, solicitar comando, vincular, resolver, cerrar, reabrir, cancelar, fusionar). Columna izquierda: contexto (persona, cuenta, servicio, contrato, inmueble, comprobante, deuda resumida de M07 solo lectura). Centro: timeline (mensajes visibles, notas internas con color distinto, eventos, comandos, comunicaciones con estado de entrega). Derecha: requisitos, vínculos (OT, contratos, incidentes, presupuesto), IA (resumen, clasificación, borrador de respuesta, con botones aceptar/corregir/descartar), tiempo registrado. Modales: `md` resolver (código, texto, tipo de cierre, causa), `lg` solicitar comando (catálogo por tipo), `md` pedir datos, `sm` motivo de cancelación. | frmNota_Reclamo, frmReclamosHist, frmTramiteCambioSevicio |
| PAN-CRM-04 | admin | modal global "Nuevo caso" y `/crm/carga-rapida` | `crm.casos.crear` | Alta y carga rápida de reclamo | Modal `lg`: buscar persona/cuenta (documento, cuenta, teléfono), servicio (solo contratados o catálogo si es alta), tipo/subtipo, descripción, adjuntos, vía de ingreso, prioridad sugerida, aviso de duplicado. Carga rápida: cuenta + servicio + subtipo + descripción en una pantalla. | frmCargaRapidaReclamo, frmPTramites |
| PAN-CRM-05 | admin | `/crm/personas/:personId/360` (también pestaña en ficha M01) | `crm.casos.ver` | Vista 360 del socio | Timeline unificado (interacciones, casos, turnos, comunicaciones, encuestas, notas de cuenta de M01 en solo lectura), filtros por canal/servicio/cuenta/período, botones "Nuevo caso", "Abrir conversación WhatsApp", "Registrar llamada". | Botón WhatsApp en ficha del titular (DFA M21) |
| PAN-CRM-06 | admin | `/crm/buscar` | `crm.casos.ver` | Búsqueda global | Caja única (número de caso, expediente, documento, cuenta, teléfono, email); resultados agrupados. | — |
| PAN-CRM-07 | admin | `/crm/incidentes` | `crm.incidentes.ver` | Listado y mapa de incidentes | Vista lista + mapa (M10 GIS) con zonas afectadas; filtros servicio, estado, clase, fecha; sugerencias de detección pendientes. Acciones: confirmar, descartar, crear. | frmConsultaIncidentes |
| PAN-CRM-08 | admin | `/crm/incidentes/:id` | `crm.incidentes.ver` | Detalle de incidente | Alcance (mapa), afectados (paginado), casos vinculados, OT de M10, participantes, comunicaciones enviadas (con resultados), hitos. Acciones: vincular casos, enviar aviso (composer T09 con preview celular), registrar restablecimiento, cerrar. | — |
| PAN-CRM-09 | admin | `/crm/mesa-entradas` | `crm.mesaEntradas.ver` | Libro de mesa de entradas | Columnas: número, fecha y hora de recepción, tipo documental, remitente, asunto, área actual, plazo, estado. Acciones: registrar entrada (modal `lg` con escaneo/adjuntos), pase, acuse, registrar salida, imprimir libro. | Mesa de Entradas (DFA M21: Administración, Informes) |
| PAN-CRM-10 | admin | `/crm/conversaciones` | `crm.conversaciones.atender` | Bandeja omnicanal y consola de agente | Lista izquierda por canal/estado/espera; centro: conversación con editor (plantillas obligatorias fuera de ventana, respuestas rápidas, borrador IA), adjuntos; derecha: persona identificada, verificación, casos abiertos, botón crear/vincular caso, transferir, cerrar conversación. | frmEnvioWhatsApp, frmEnvioWhatsAppTrii, frmEnviar_SMS |
| PAN-CRM-11 | admin | `/crm/config/tipos` | `crm.config.tipos.configurar` | Tipos y subtipos de gestión | Árbol tipo → subtipo; formulario por tipo (kind, acción de solicitud, servicios, requisitos, campos adicionales, comandos al aprobar, flujo T11, SLA, numeración, plantillas, encuesta, visibilidad al socio, recepción pública); subtipo (prioridad, urgente, causa, bloqueo, categoría M10, operación OT, detección de incidentes, ventana de duplicados). `ExcelImportWizard` para catálogo. | Tipos/Subtipos de tickets; TRAMITES (Configuracion) |
| PAN-CRM-12 | admin | `/crm/config/estados` | `crm.config.estados.configurar` | Conjuntos de estados y transiciones | Lista de conjuntos; editor de estados (orden por arrastre, estado base, banderas, color) y matriz de transiciones con capability; validación de estados obligatorios; enlace al diseñador T11. | Estados de tickets |
| PAN-CRM-13 | admin | `/crm/config/areas` | `crm.config.areas.configurar` | Áreas, miembros, guardias | Roles del área (casos, turnero, actividades, mesa de entradas), miembros con rol, destinatarios extra, día de recordatorios, calendario, configuración de turnero (letra, tiempo estimado, imagen, habilitación), guardias. | TUR_AREAS, TUR_AREAS_USERS, ACT_AREAS |
| PAN-CRM-14 | admin | `/crm/config/sla` | `crm.config.sla.configurar` | Políticas SLA | Alcance, objetivos, modo hábil/corrido, pausas, umbral, escalamiento; simulador ("si entra hoy 18:00, vence…"). Pestaña **Plantillas de plataforma** (HUE-INT-03, HUE-GAS-05): ENACOM Res. 733/2017 por motivo y `safety.emergency`; acción "Adoptar" copia la plantilla al tenant; insignia "A validar legalmente" hasta registrar `legalValidation`. | — |
| PAN-CRM-15 | admin | `/crm/config/reglas` | `crm.config.reglas.configurar` | Reglas de derivación y notificación | Lista ordenada; condiciones (servicio, tipo, operación, zona, canal, días, franja, feriados), disparador, destino; prueba de regla con un caso ejemplo. | RESPONSA_NOTIFICA (M10), parámetros 2630–2632 |
| PAN-CRM-16 | admin | `/crm/config/canales` | `crm.canales.configurar` | Canales | Tarjetas por canal (WhatsApp, email, SMS, teléfono/CTI, IVR, chat web, Facebook, Instagram, presencial, mesa de entradas, público); conexión con credenciales en bóveda (T01/T06) con "probar conexión"; horario; validación de celular/email; bot asignado; sincronizar plantillas WhatsApp; estado. | frmParam_SMS; VIAINGTE; TICKETS_MEDIOSATENCION |
| PAN-CRM-17 | admin | `/crm/config/bot` | `crm.bot.configurar` | Bot de autogestión | Intenciones (habilitar, verificación, ejemplos), textos por diccionario, FAQ, traspaso, versión borrador/publicada, simulador de conversación con preview celular. | — |
| PAN-CRM-18 | admin | `/crm/config/ia` | `crm.ia.configurar` | IA supervisada | Funciones habilitadas, umbrales de confianza, tipos sensibles excluidos, proveedor (conexión T06), aviso de condiciones aceptadas, tablero de exactitud. | — |
| PAN-CRM-19 | admin | `/crm/auditoria-ia` | `crm.ia.auditar` | Auditoría de IA | Lista de sugerencias con función, caso, modelo, versión, confianza, decisión, usuario, diferencias; filtros; exportar. | AUDIT_IA |
| PAN-CRM-20 | admin | `/crm/config/respuestas-rapidas` | `crm.respuestasRapidas.configurar` | Respuestas rápidas | ABM con variables, canales, tipos; vista previa. | Plantillas de tickets |
| PAN-CRM-21 | admin | `/crm/tramites` | `crm.tramites.configurar` / `crm.casos.ver` | Trámites con vencimiento | Pestañas: Tipos (días, plantilla, acciones tipadas), Presentados/No presentados/Vencidos (filtros titular, servicio, estado), carga de trámite (modal `md` con adjuntos). | frmTramite, frmPTramites |
| PAN-CRM-22 | admin | `/crm/proyectos` | `crm.horas.ver` | Proyectos, horas y bolsas | Proyectos con componentes y casos; registro de tiempo por caso/usuario; bolsas de horas por cuenta; "pendiente de facturar" con solicitud a M05; responsables por cuenta. | Administración/cuentas de tickets |
| PAN-CRM-23 | admin, pwa-empleado | `/crm/turnero/recepcion` | `crm.turnero.emitir` | Recepción y emisión de turnos | Buscar persona (opcional), área (botones grandes con imagen), prioridad y motivo, imprimir/mostrar código; lista de espera por área con estimados. | Selección de Turnos (DFA M21) |
| PAN-CRM-24 | admin, pwa-empleado | `/crm/turnero/box` | `crm.turnero.llamar` | Consola de box | Abrir/cerrar box, áreas atendidas, botón "Llamar siguiente", rellamar, ausente, atender, derivar (área), finalizar (motivo, resultado, crear caso), turno actual e historial. | Administración de Box (DFA M21) |
| PAN-CRM-25 | landing (ruta pública con token de pantalla) | `/t/:tenantSlug/pantalla/:displayId` | `crm.turnero.pantalla.ver` (cuenta técnica S-KSK con token de pantalla) (antes token de pantalla) | Pantalla pública de turnos | Pantalla completa con últimos 5 llamados (por turno o por box), modo de destacado, voz, marca del tenant, noticias opcionales (T09). | Turnero (pantallas por 2007) |
| PAN-CRM-26 | landing (kiosco) | `/t/:tenantSlug/totem/:branchId` | `crm.turnero.emitir` (cuenta técnica S-KSK con token de dispositivo) (antes token de dispositivo) | Tótem de autoservicio | Elegir área, documento opcional, prioridad declarada, emitir e imprimir vía agente o mostrar QR. | — |
| PAN-CRM-27 | admin | `/crm/turnero/config` | `crm.turnero.configurar` | Administración del turnero | Boxes y tipos, pantallas (modo, agrupación, voz, nombre visible), tótems, agente local (estado de T06), cupos de reservas por área. | Administración de Box/Turnero (DFA M21) |
| PAN-CRM-28 | admin | `/crm/turnero/estadisticas` | `crm.reportes.ver` | Estadísticas del turnero | Filtros sucursal, área, período; agrupación (día de semana y hora; mes, día y hora; turno); KPIs ingresados, atendidos, abandonos, prioritarios, espera y atención promedio; excluir errores de carga. | Estadísticas (DFA M21) |
| PAN-CRM-29 | admin | `/crm/actividades` | `crm.actividades.ver` | Seguimiento de actividades | Vista agenda/lista con estados (pendiente, próxima a vencer, vencida, cerradas en término/fuera de término, con revisión), filtros área, tipo, rubro, responsable; cierre (modal `md`: observación, revisión, evidencia); imprimir planilla; informe. | Seguimiento e Informe (DFA M22) |
| PAN-CRM-30 | admin | `/crm/config/actividades` | `crm.actividades.configurar` | Configuración de actividades | Pestañas: Áreas (rol actividades), Tipos, Frecuencias, Rubros, Actividades (con previas/preventivas). | ACT_* (DFA M22) |
| PAN-CRM-31 | admin, pwa-empleado | `/crm/calendario` | `crm.actividades.ver` | Calendario interno | Vistas día/semana/mes; eventos por tipo con color; recurrencias; recordatorios; ocurrencias de actividades y tareas de casos. | CALENDARIO |
| PAN-CRM-32 | admin | `/crm/circulares` | `crm.circulares.ver` | Circulares | Modelos (ABM con preview), corridas (universo con motor de audiencia T09, conteo, aprobación, generación, etiquetas, informe de comunicación, solicitar OT masivas). | frmCirculares |
| PAN-CRM-33 | admin | `/crm/tablero` | `crm.bandejaSupervision.ver` | Tablero operativo | KPIs en tiempo real: abiertos por estado, SLA en riesgo y vencidos, carga por área/responsable, colas de conversaciones y turnos, incidentes activos; cada número abre la bandeja filtrada. | TABLERO (indicadores) |
| PAN-CRM-34 | admin | `/bi/salas/reclamos` (T10) | `crm.reportes.ver` | Sala BI de atención y reclamos | Patrón CNX §4.5: KPIs certificados (§15), contexto y IA sobre los datos. | Informes de reclamos/reincidencias (RN-07 §1.10) |
| PAN-CRM-35 | pwa-empleado | `/app/casos` | `crm.casos.ver` | Mis casos (móvil) | Cards con número, prioridad, socio, servicio, vencimiento; detalle con timeline y respuesta; tomar/pausar; FAB "+" nuevo caso. Offline: lectura de casos asignados y cola de respuestas con `clientMutationId`. | — |
| PAN-CRM-36 | pwa-empleado | `/app/actividades` | `crm.actividades.ver` | Mis actividades (móvil) | Cards por ocurrencia con estado; cerrar con foto de evidencia. | — |

Pantallas del socio (consumen la API de §11, definidas en M19): Mis gestiones (lista y detalle), Nueva gestión (asistente por tipo con ayuda IA), Solicitar alta/baja/suspensión/reactivación/cambio, Constancias, Turnos (fila virtual y reserva), Encuesta post-cierre, Chat (widget), y en landing el **botón visible de baja** y el formulario público de baja.

## 11. API

Convenciones: paginación `?page=&size=` → `{ items, total, page, size }`; errores RFC 9457 con `requestId`; validación Zod compartida; `Idempotency-Key` en creación de casos públicos/bot, comandos, emisión de turnos remotos y envíos.

### 11.1 Admin (`/api/admin/crm/...`)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CRM-01 | GET | `/api/admin/crm/cases` | `crm.casos.ver` | Listar casos con filtros de bandeja y vistas | — |
| API-CRM-02 | POST | `/api/admin/crm/cases` | `crm.casos.crear` | Crear caso (agente, carga rápida) | Sí (`Idempotency-Key`) |
| API-CRM-03 | GET | `/api/admin/crm/cases/:id` | `crm.casos.ver` | Detalle con contexto | — |
| API-CRM-04 | PATCH | `/api/admin/crm/cases/:id` | `crm.casos.editar` | Editar campos no estructurales (asunto, etiquetas, campos adicionales, contactos) | Por `version` |
| API-CRM-05 | POST | `/api/admin/crm/cases/:id/transitions` | `crm.casos.editar` más la capability propia de la transición según §8.1 (`crm.casos.resolver`, `crm.casos.cerrar`, `crm.casos.reabrir`, `crm.casos.anular`, `crm.casos.derivar`); antes "según transición" | Ejecutar transición (`{ to, reason, data }`) | Por `version` |
| API-CRM-06 | POST | `/api/admin/crm/cases/:id/derive` | `crm.casos.derivar` | Derivar a área | Por `version` |
| API-CRM-07 | POST | `/api/admin/crm/cases/:id/assign` | `crm.casos.asignar` | Asignar/reasignar | Por `version` |
| API-CRM-08 | POST | `/api/admin/crm/cases/:id/take` · `/pause` · `/release` · `/resume` | `crm.casos.tomar` | Tomar, pausar, soltar, retomar | Sí |
| API-CRM-09 | POST | `/api/admin/crm/cases/:id/classify` | `crm.casos.reclasificar` | Clasificar/reclasificar (acepta o corrige sugerencia IA) | Por `version` |
| API-CRM-10 | POST | `/api/admin/crm/cases/:id/messages` | `crm.casos.responder` | Mensaje visible o nota interna (con adjuntos) | Sí |
| API-CRM-11 | GET | `/api/admin/crm/cases/:id/timeline` | `crm.casos.ver` | Timeline (eventos + mensajes + comunicaciones) | — |
| API-CRM-12 | POST | `/api/admin/crm/cases/:id/requirements` | `crm.casos.editar` | Pedir/actualizar requisitos | Sí |
| API-CRM-13 | POST | `/api/admin/crm/cases/:id/commands` | `crm.comandos.solicitar` | Solicitar comando a módulo dueño | Sí |
| API-CRM-14 | GET | `/api/admin/crm/command-requests` | `crm.casos.ver` | Seguimiento de comandos (filtros estado/módulo) | — |
| API-CRM-15 | POST | `/api/admin/crm/command-requests/:id/retry` | `crm.comandos.solicitar` | Reintentar comando fallido | Sí |
| API-CRM-16 | POST | `/api/admin/crm/cases/:id/links` / DELETE `/links/:linkId` | `crm.casos.editar` | Vincular/desvincular entidades | Sí |
| API-CRM-17 | POST | `/api/admin/crm/cases/:id/merge` | `crm.casos.fusionar` | Fusionar en caso principal | Sí |
| API-CRM-18 | POST | `/api/admin/crm/cases/:id/resolve` | `crm.casos.resolver` | Resolver | Por `version` |
| API-CRM-19 | POST | `/api/admin/crm/cases/:id/close` | `crm.casos.cerrar` | Cerrar con tipo/causa/validaciones | Por `version` |
| API-CRM-20 | POST | `/api/admin/crm/cases/:id/reopen` · `/recover` | `crm.casos.reabrir` | Reabrir/recuperar | Por `version` |
| API-CRM-21 | POST | `/api/admin/crm/cases/:id/cancel` | `crm.casos.anular` | Cancelar con motivo | Por `version` |
| API-CRM-22 | POST | `/api/admin/crm/cases/bulk` | `crm.casos.derivar` | Acciones masivas | Sí |
| API-CRM-23 | GET | `/api/admin/crm/cases/export` | `crm.casos.exportar` | Exportar XLSX/CSV/PDF | — |
| API-CRM-24 | GET | `/api/admin/crm/cases/:id/duplicates` | `crm.casos.ver` | Candidatos a duplicado | — |
| API-CRM-25 | GET | `/api/admin/crm/persons/:personId/timeline` | `crm.casos.ver` | Historial unificado 360 | — |
| API-CRM-26 | POST | `/api/admin/crm/interactions` | `crm.interacciones.crear` | Registrar interacción (llamada, visita) | Sí |
| API-CRM-27 | GET | `/api/admin/crm/search` | `crm.casos.ver` | Búsqueda global | — |
| API-CRM-28 | GET/POST/PATCH | `/api/admin/crm/incidents[/:id]` | `crm.incidentes.ver` (GET), `crm.incidentes.crear` (POST), `crm.incidentes.editar` (PATCH) (antes `crm.incidentes.*`) | ABM de incidentes | Sí (POST) |
| API-CRM-29 | POST | `/api/admin/crm/incidents/:id/cases` | `crm.incidentes.vincular` | Vincular casos al incidente | Sí |
| API-CRM-30 | POST | `/api/admin/crm/incidents/:id/notify` | `crm.incidentes.editar` | Aviso a afectados (T09) | Sí |
| API-CRM-31 | POST | `/api/admin/crm/incidents/:id/transitions` | `crm.incidentes.editar` | Confirmar, restablecer, cerrar, descartar | Por `version` |
| API-CRM-32 | GET/POST | `/api/admin/crm/desk-entries` · `/:id/transfers` · `/:id/acknowledge` · `/:id/outgoing` | `crm.mesaEntradas.ver` (GET), `crm.mesaEntradas.crear` (alta), `crm.mesaEntradas.pasar` (`/transfers`, `/acknowledge`), `crm.mesaEntradas.registrarSalida` (`/outgoing`) (antes `crm.mesaEntradas.*`) | Mesa de entradas | Sí (POST) |
| API-CRM-33 | GET | `/api/admin/crm/conversations` | `crm.conversaciones.atender` | Bandeja omnicanal | — |
| API-CRM-34 | POST | `/api/admin/crm/conversations/:id/messages` | `crm.conversaciones.atender` | Enviar mensaje (texto en ventana o plantilla) | Sí |
| API-CRM-35 | POST | `/api/admin/crm/conversations/:id/assign` · `/transfer` · `/close` · `/link-case` | `crm.conversaciones.atender` | Gestión de conversación | Sí |
| API-CRM-36 | POST | `/api/admin/crm/ai/suggestions` | `crm.ia.usar` | Pedir sugerencia (resumen, borrador, extracción) | Sí |
| API-CRM-37 | POST | `/api/admin/crm/ai/suggestions/:id/decision` | `crm.ia.usar` | Aceptar/corregir/descartar | Sí |
| API-CRM-38 | GET | `/api/admin/crm/ai/suggestions` | `crm.ia.auditar` | Auditoría de IA | — |
| API-CRM-39 | CRUD | `/api/admin/crm/config/case-types`, `/case-subtypes`, `/status-sets`, `/areas`, `/sla-policies`, `/routing-rules`, `/quick-replies`, `/channels`, `/bot-flows`, `/ai-settings`, `/procedure-types`, `/incident-classes` | `crm.config.tipos.configurar` (case-types, case-subtypes), `crm.config.estados.configurar` (status-sets), `crm.config.areas.configurar` (areas), `crm.config.sla.configurar` (sla-policies), `crm.config.reglas.configurar` (routing-rules, quick-replies), `crm.config.canales.configurar` (channels, bot-flows, ai-settings; nueva), `crm.config.tramites.configurar` (procedure-types, incident-classes; nueva) (antes `crm.config.*` correspondiente) | Catálogos y configuración | — |
| API-CRM-40 | POST | `/api/admin/crm/config/channels/:id/test` · `/sync-templates` | `crm.canales.configurar` | Probar conexión, sincronizar plantillas WhatsApp | — |
| API-CRM-41 | POST | `/api/admin/crm/config/bot-flows/:id/publish` · `/simulate` | `crm.bot.configurar` | Publicar y simular bot | — |
| API-CRM-42 | GET/POST | `/api/admin/crm/procedure-records` | `crm.casos.ver` / `crm.casos.crear` | Trámites presentados, no presentados, vencidos | Sí (POST) |
| API-CRM-43 | CRUD | `/api/admin/crm/projects`, `/worklogs`, `/hour-banks`, `/account-assignments` | `crm.horas.ver` (GET), `crm.horas.registrar` (POST, PATCH) (antes `crm.horas.*`) | Proyectos, tiempo, bolsas | Sí (POST) |
| API-CRM-44 | POST | `/api/admin/crm/worklogs/billing-requests` | `crm.horas.facturar` | Solicitar a M05 la facturación de horas | Sí |
| API-CRM-45 | POST | `/api/admin/crm/queue/tickets` | `crm.turnero.emitir` | Emitir turno | Sí |
| API-CRM-46 | POST | `/api/admin/crm/queue/desks/:id/open` · `/close` | `crm.turnero.box.abrir` | Abrir/cerrar box | Sí |
| API-CRM-47 | POST | `/api/admin/crm/queue/desks/:id/call-next` | `crm.turnero.llamar` | Llamar siguiente (atómico) | Sí |
| API-CRM-48 | POST | `/api/admin/crm/queue/tickets/:id/actions` | `crm.turnero.llamar` | Rellamar, ausente, atender, derivar, finalizar | Sí |
| API-CRM-49 | GET | `/api/admin/crm/queue/stats` | `crm.reportes.ver` | Estadísticas del turnero | — |
| API-CRM-50 | CRUD | `/api/admin/crm/queue/desk-types`, `/desks`, `/displays`, `/kiosks`, `/appointment-slots` | `crm.turnero.configurar` | Configuración del turnero | — |
| API-CRM-51 | GET (SSE/WebSocket) | `/api/admin/crm/queue/stream?branchId=` | `crm.turnero.ver` | Eventos en tiempo real de turnos | — |
| API-CRM-52 | CRUD | `/api/admin/crm/activities`, `/activity-types`, `/activity-frequencies`, `/activity-rubros` | `crm.actividades.configurar` | Actividades y catálogos | — |
| API-CRM-53 | GET | `/api/admin/crm/activity-occurrences` | `crm.actividades.ver` | Seguimiento | — |
| API-CRM-54 | POST | `/api/admin/crm/activity-occurrences/:id/close` · `/approve` · `/void` · `/reopen` | `crm.actividades.cerrar` | Cierre, aprobación, anulación | Sí |
| API-CRM-55 | GET | `/api/admin/crm/activity-occurrences/:id/sheet.pdf` | `crm.actividades.ver` | Planilla imprimible | — |
| API-CRM-56 | CRUD | `/api/admin/crm/calendar/events`, `/calendar/event-types` | `crm.actividades.ver` | Calendario interno | — |
| API-CRM-57 | CRUD | `/api/admin/crm/circulars` | `crm.circulares.configurar` | Modelos de circular | — |
| API-CRM-58 | POST | `/api/admin/crm/circulars/:id/runs` · `/runs/:runId/approve` · `/runs/:runId/generate` · `/runs/:runId/cancel` | `crm.circulares.generar` / `crm.circulares.aprobar` | Corridas de circulares | Sí |
| API-CRM-59 | GET | `/api/admin/crm/reports/:reportCode` | `crm.reportes.ver` | Reportes del §15 (con export) | — |
| API-CRM-60 | GET | `/api/admin/crm/dashboard` | `crm.bandejaSupervision.ver` | Tablero operativo | — |

### 11.2 Socio (`/api/crm/...`, consumidos por M19)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CRM-61 | GET | `/api/crm/my/cases` | `crm.misCasos.ver` | Mis gestiones | — |
| API-CRM-62 | POST | `/api/crm/my/cases` | `crm.misCasos.crear` | Nueva gestión (reclamo, consulta, solicitud) | Sí |
| API-CRM-63 | GET | `/api/crm/my/cases/:id` | `crm.misCasos.ver` | Detalle (sin notas internas) | — |
| API-CRM-64 | POST | `/api/crm/my/cases/:id/messages` | `crm.misCasos.responder` | Responder/adjuntar | Sí |
| API-CRM-65 | POST | `/api/crm/my/cases/:id/cancel` · `/confirm-resolution` · `/reopen` | `crm.misCasos.cancelar` | Desistir, confirmar o rechazar resolución, reabrir | Sí |
| API-CRM-66 | GET | `/api/crm/my/request-options?accountId=` | `crm.misCasos.crear` | Servicios disponibles/contratados y tipos de solicitud habilitados con requisitos, modalidades y costos | — |
| API-CRM-67 | POST | `/api/crm/my/requests/quote` | `crm.misCasos.crear` | Cotización informativa (cambio de plan, reactivación arancelada) vía M04 | — |
| API-CRM-68 | GET | `/api/crm/my/cases/:id/receipt.pdf` | `crm.misCasos.ver` | Constancia | — |
| API-CRM-69 | POST | `/api/crm/ai/draft` | `crm.misCasos.crear` | Asistencia IA para redactar la gestión | Sí |
| API-CRM-70 | GET/POST | `/api/crm/my/queue/tickets` · `/appointments` · `/appointments/:id/cancel` · `/slots` | `crm.turnos.reservar` | Fila virtual y reservas | Sí |

### 11.3 Público (`/api/public/<tenantSlug>/crm/...`)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CRM-71 | GET | `/api/public/:tenantSlug/crm/cancellation-form` | `public: true` (sin capability, RF-IAM-061) | Servicios alcanzados y campos del formulario de baja | — |
| API-CRM-72 | POST | `/api/public/:tenantSlug/crm/cancellations` | `public: true` (sin capability, RF-IAM-061; rate limit + captcha) | Recepción pública de baja; devuelve código | Sí |
| API-CRM-73 | GET | `/api/public/:tenantSlug/crm/cases/status?number=&code=` | `public: true` (sin capability, RF-IAM-061; número y código verificador) | Estado público del caso (sin datos privados) | — |
| API-CRM-74 | POST | `/api/public/:tenantSlug/crm/webchat/sessions` · `/messages` | `public: true` (sin capability, RF-IAM-061; rate limit) | Chat web anónimo (bot) | Sí |
| API-CRM-75 | GET | `/api/public/:tenantSlug/crm/outages` | `public: true` (sin capability, RF-IAM-061) | Cortes/incidentes vigentes publicables | — |
| API-CRM-76 | GET (SSE) | `/api/public/:tenantSlug/crm/queue/displays/:displayId/stream` | `crm.turnero.pantalla.ver` (cuenta técnica S-KSK de la pantalla enrolada; antes "token de pantalla") | Pantalla pública de turnos | — |
| API-CRM-77 | POST | `/api/public/:tenantSlug/crm/queue/kiosks/:kioskId/tickets` | `crm.turnero.emitir` (cuenta técnica S-KSK del tótem enrolado; antes "token de dispositivo") | Emitir turno en tótem | Sí |

### 11.4 Webhooks e internos

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CRM-78 | POST | `/api/v1/ext/crm/webhooks/:channelKind/:connectionId` | `crm.webhooks.recibir` (cuenta técnica del canal; la llamada se autentica con la firma del proveedor) | Entrantes de WhatsApp, SMS, email, redes, CTI/IVR | Sí (id externo) |
| API-CRM-79 | POST | `/api/v1/ext/crm/ivr/:connectionId/lookup` · `/cases` | `crm.ivr.consultar` (`lookup`) y `crm.casos.crear` (`/cases`) (scope del cliente API de la integración IVR; antes "token de integración") | Consulta y alta de reclamo desde IVR | Sí |
| API-CRM-80 | — | — | — | **Reemplazado por servicios internos** `crm.openCase` (antes `crmService.createCase`), `crm.getIncidentSummaryForWorkOrder` (antes `crmService.getIncidentSummaryForWorkOrder`) y `crm.getCaseLinks` (antes `crmService.getCaseLinks`), definidos en §11.5: no son rutas HTTP. Descripción original: "Comandos y consultas que invocan M03/M05/M08/M10/M19". | — |

### 11.5 Servicios internos (no HTTP)

Llamadas en proceso entre módulos del monolito modular (DEC-003). El módulo invocante usa su cuenta técnica (T02 RF-IAM-115) con la capability indicada; `tenantId` y actor salen del contexto de la llamada, nunca de la entrada.

| Servicio | Invocante | Capability de la cuenta técnica | Entrada | Salida | Errores |
|---|---|---|---|---|---|
| `crm.openCase` (antes `crmService.createCase`) | M19 (envío de formularios del portal, §9.5 de M19), M03, M05, M08, M10, M01 (tarea de regularización de documento, `caseTypeCode` del tipo `identityDocumentRegularization`, RF-CRM-261, DEC-099) | `crm.casos.crear` | `{ caseTypeCode, caseSubtypeCode?, kind?, subject, description, origin: { module, sourceRef, channelKind?, intakeRouteCode?, conversationId? }, requester: { personId?, userId?, displayName, documentType?, documentNumber?, phone?, email? }, context?: { accountId?, contractId?, serviceId?, requestedServiceId?, requestedPlanId?, premiseId?, servicePointId?, invoiceId?, geo? }, requirements?[], acceptedTerms?[], documentIds?[], customFields?, priority?, idempotencyKey }`. `caseTypeCode` es el `code` de `crmCaseTypes` (M19 cita `type=solicitudAlta`; para el alta de servicio el tipo es `serviceActivation`, §9.2). | `{ caseId, number, baseStatus, status, slaResolutionDueAt?, possibleDuplicateOf?, receiptDocumentId?, created }`; `created = false` cuando la misma `idempotencyKey` ya creó el caso (devuelve el mismo caso). | `crm.caseType.notFound` o `crm.caseType.inactive` (tipo inexistente o inactivo); `crm.case.validation` (faltan datos mínimos del tipo o la vía de ingreso no está habilitada, RN-CRM-058); `crm.case.accountNotAuthorized` (la cuenta no pertenece al solicitante, RN-CRM-005); `crm.idempotency.conflict` (misma clave con otra entrada). |
| `crm.getIncidentSummaryForWorkOrder` (antes `crmService.getIncidentSummaryForWorkOrder`) | M10 | `crm.casos.ver` | `{ workOrderId }` | Resumen del incidente común vinculado a la OT (datos de `crmIncidents`) o `null` si no hay [VERIFICAR] | No declarados en el anexo [VERIFICAR] |
| `crm.getCaseLinks` (antes `crmService.getCaseLinks`) | M03, M05, M08, M10, M19 | `crm.casos.ver` | `{ caseId }` | `crmCases.links[]` (`entityType`, `entityId`, `relation`) | No declarados en el anexo [VERIFICAR] |

Efectos de `crm.openCase`: los del paso 5 de §9.1 (caso, primer `crmCaseEvents`, outbox `crm.case.created` EVT-CRM-01, número del contador atómico, SLA). Sin cuenta identificada el caso se crea con `context.accountId = null` y marca "cuenta a identificar" (RN-CRM-005, §9.1 paso 2); la detección de duplicados marca `possibleDuplicateOf` y no bloquea (§9.1 paso 6).

## 12. Eventos y jobs

### 12.1 Eventos emitidos

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-CRM-01 | `crm.case.created` | Alta de caso | T09 (aviso recibido), T10, IA |
| EVT-CRM-02 | `crm.case.classified` | Clasificación aceptada/corregida | T10 |
| EVT-CRM-03 | `crm.case.derived` | Derivación | T09 (aviso al área) |
| EVT-CRM-04 | `crm.case.assigned` | Asignación | T09 (aviso al asignado) |
| EVT-CRM-05 | `crm.case.statusChanged` | Toda transición | T09 (aviso al socio si notificable), T10, M19 |
| EVT-CRM-06 | `crm.case.slaWarning` | Umbral SLA | T09 |
| EVT-CRM-07 | `crm.case.slaBreached` | Vencimiento SLA | T09, T10 |
| EVT-CRM-08 | `crm.case.resolved` | Resolución | T09, M19 |
| EVT-CRM-09 | `crm.case.closed` | Cierre | T09 (encuesta), T10 |
| EVT-CRM-10 | `crm.case.reopened` | Reapertura | T10 |
| EVT-CRM-11 | `crm.case.cancelled` | Cancelación | M11 (presupuesto), T10 |
| EVT-CRM-12 | `crm.case.merged` | Fusión | T10 |
| EVT-CRM-13 | `crm.commandRequest.requested` | Comando emitido | Módulo destino |
| EVT-CRM-14 | `crm.cancellationRequest.received` | Baja recibida (pública o autenticada) | T09 (constancia), T10 (indicador regulatorio) |
| EVT-CRM-15 | `crm.cancellationRequest.receiptDelivered` / `receiptFailed` | Resultado de constancia | T10, supervisión |
| EVT-CRM-16 | `crm.incident.confirmed` / `updated` / `restored` / `closed` | Ciclo del incidente | T09 (avisos), M10, T10, M19 (cortes vigentes) |
| EVT-CRM-17 | `crm.message.received` / `crm.message.sent` | Mensajería | T10 |
| EVT-CRM-18 | `crm.conversation.handedOff` | Traspaso bot → humano | T10 |
| EVT-CRM-19 | `crm.aiSuggestion.recorded` / `decided` | IA | T08 (auditoría), T10 |
| EVT-CRM-20 | `crm.queueTicket.issued` / `called` / `finished` | Turnero | T09 (aviso remoto), T10 |
| EVT-CRM-21 | `crm.activityOccurrence.generated` / `overdue` / `closed` | Actividades | T09 (recordatorios), T10 |
| EVT-CRM-22 | `crm.deskEntry.registered` / `transferred` / `answered` | Mesa de entradas | T10 |
| EVT-CRM-23 | `crm.procedureRecord.expired` | Trámite vencido | M02/M04/M07 según acción |
| EVT-CRM-24 | `crm.circularRun.generated` | Corrida | T09 |
| EVT-CRM-25 | `crm.survey.negativeReceived` | Encuesta negativa | Supervisión |

### 12.2 Eventos consumidos

| Evento | Productor | Efecto en CRM |
|---|---|---|
| `cat.contract.requested` / `activated` / `suspended` / `reactivated` / `cancelled` / `planChanged` (EVT-CAT-06/09/10/12/16/18) | M02 | Actualiza comando y fecha efectiva; avanza caso |
| `cat.command.rejected` (EVT-CAT-27) | M02 | Comando `rejected`. Para los demás dueños el rechazo llega como respuesta síncrona del comando (API-CRM-80) hasta que declaren su evento. |
| `per.ownership.changed` (EVT-PER-23), `per.address.changed` (EVT-PER-15), `per.person.merged` (EVT-PER-06) | M01 | Comando ejecutado; re-vincula casos/interacciones de personas fusionadas |
| `per.person.identificationRegularized` (EVT-PER-27) | M01 | Cierra el caso `identityDocumentRegularization` de la persona (o la quita del caso de lote y lo cierra si no quedan pendientes) con motivo "documento regularizado" (RF-CRM-261, DEC-099) |
| `tec.feasibility.verdictIssued` (EVT-TEC-02) | M10 | Avanza evaluación |
| `tec.workOrder.created` / `.statusChanged` / `.executed` / `.cancelled` (EVT-TEC-04/05/06/08), `tec.visit.statusChanged` / `tec.visit.failed` (EVT-TEC-13/14), `tec.conformity.signed` (EVT-TEC-15) | M10 | Timeline, avisos al socio, conformidad, conflicto (ESC-03) |
| `tec.networkDevice.down` (EVT-TEC-24) / `tec.outage.finished` (EVT-TEC-23) | M10 | Propone/actualiza incidente |
| `tec.emergency.declared` / `tec.emergency.closed` (EVT-TEC-35), `tec.onCall.escalated` (EVT-TEC-36) | M10 | SLA de seguridad (RF-CRM-260): marca aceptación, arribo y zona segura; muestra el escalamiento de guardia en el caso (HUE-GAS-05) |
| `tec.waterSample.outOfLimit` (EVT-TEC-37) | M10 | Propone incidente preventivo por zona al supervisor (solo si M10 PRM-TEC-157 está activo) |
| `fac.creditNote.issued` / `fac.debitNote.issued` (EVT-FAC-10/11), `fac.billableItem.billed` (EVT-FAC-20), `fac.invoice.issued` (EVT-FAC-07) | M05 | Comando ejecutado; contexto |
| `cob.payment.confirmed` | M07 | Informa en caso de reactivación (no cambia estado, RN-CRM-013) |
| `mor.interruption.executed` (EVT-MOR-13; suspensión o reconexión según el tipo) | M08 | Comandos de reactivación; avisos |
| `ven.quote.accepted` / `rejected` | M11 | Recalcula fecha compromiso |
| `com.communication.delivered` / `failed` / `read` | T09 | Estado de entrega en mensaje/evento; acción ante fallo |
| `com.survey.responseSubmitted` | T09 | Resultado en el caso; alerta si negativo |
| `wfl.approval.decided` | T11 | Transición `approved`/`rejected` |
| `int.agent.online` / `.offline` (EVT-INT-22) | T06 | Estado de dispositivos del turnero |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-CRM-01 | `crm:sla-monitor` | Eventos EVT-WFL-020 / EVT-WFL-021 | Reacción: proyecta en el caso el aviso y el vencimiento SLA que calcula T11 y publica EVT-CRM-06/07 (PA-WFL-12). Ver JOB-WFL-04 (dueño). |
| JOB-CRM-02 | `crm:ai-classify` | Cola (por evento) | Sugerencias de IA para casos nuevos y mensajes entrantes |
| JOB-CRM-03 | `crm:auto-close-resolved` | Diario 02:00 | Cierre automático de resueltos sin respuesta tras plazo |
| JOB-CRM-04 | `crm:stale-cases` | Diario 07:00 | Indicadores "sin intervención" 7 y 8+ días; aviso a responsables |
| JOB-CRM-05 | `crm:incident-detect` | Cada 5 minutos | Detección de concentraciones de reclamos |
| JOB-CRM-06 | `crm:cancellation-receipts` | Cada 15 minutos | Control de constancias de baja (≤ 24 h) y reintento por canal alternativo |
| JOB-CRM-07 | `crm:procedure-expiry` | Diario 03:00 | Vencimiento de trámites y acciones |
| JOB-CRM-08 | `crm:queue-day-close` | Diario al cierre de sucursal | Cierre de turnos y boxes del día |
| JOB-CRM-09 | `crm:activity-generate` | Diario 01:00 | Generación de ocurrencias y citas |
| JOB-CRM-10 | `crm:activity-reminders` | Diario 08:00 (una vez por día) | Estados, recordatorios, escalamiento |
| JOB-CRM-11 | `crm:circular-generate` | A demanda | Generación de corridas |
| JOB-CRM-12 | `crm:email-ingest` | Cada minuto o por webhook | Ingesta de email |
| JOB-CRM-13 | `crm:bot-step` | Cola (por mensaje) | Procesamiento del bot |
| JOB-CRM-14 | `crm:conversation-expire` | Cada 5 minutos | Expiración de ventanas y sesiones |
| JOB-CRM-15 | `crm:appointment-reminders` | Cada 15 minutos | Solo marca ausencias de reservas; los recordatorios los envía T09 a partir de la cita publicada. Ver JOB-COM-13 `com:recordatorios-agenda` (dueño). |
| JOB-CRM-16 | `crm:command-retry` | Cada minuto | Reintentos de comandos fallidos |
| JOB-CRM-17 | `crm:metrics-snapshot` | Cada hora | Proyecciones para T10 (cubos de atención) |
| JOB-CRM-18 | `crm:whatsapp-templates-sync` | — | **Retirado.** M09 lee de T09 el estado de las plantillas. Ver JOB-COM-14 `com:sincronizar-plantillas-whatsapp` (dueño). |

## 13. Integraciones

Marco general en T06 (conexiones por tenant, bóveda de credenciales, webhooks entrantes, reintentos, monitoreo, agente local). Particularidades del CRM:

| Integración | Dirección | Proveedor / mecanismo | Particularidades CRM | Origen |
|---|---|---|---|---|
| WhatsApp Business | Entrante y saliente | Interfaz `WhatsAppProvider` con adaptador Meta Cloud API (CNX §2.7) y adaptador BSP (Trii, usado hoy por ProCoop) | Número oficial del tenant; webhooks de mensajes y estados; plantillas aprobadas por Meta sincronizadas (JOB-CRM-18); ventana 24 h; opt-in/opt-out; plantillas heredadas a recrear: `generacion_ot` (M10), `link_pago_solicitado` y `confirmacion_de_pago` (M07), `detalle_comprobantes` (M05), `recarga_prepaga` (M03), `cambio_dispositivo_medicion` (M03/M10); nuevas del CRM: `caso_recibido`, `caso_actualizado`, `caso_pendiente_datos`, `caso_resuelto`, `encuesta_post_cierre`, `turno_proximo`, `turno_llamado`, `incidente_zona`, `incidente_restablecido`, `constancia_baja`. Credenciales (token, host, canal — V2 2870/2873/2874) en bóveda, nunca en parámetros. | FIC 13.2; RN-07 §8.9; RN-10 §5; MER-016; PA-CRM-06 |
| Email | Entrante y saliente | Saliente por T09 (SMTP/SES con SPF, DKIM, DMARC); entrante IMAP o webhook de proveedor | Hilo por número en asunto; adjuntos a T11 con antivirus | FIC 13.1 |
| SMS | Saliente (y entrante opcional) | Interfaz `SmsProvider` (T09/T06) | Reemplaza el envío por API del proveedor de ProCoop (V2 2696, identificación 518/519) y por módems GSM (`MODEMS`, `ENVIOS`) | FIC 13.3; RN-10 §5 |
| Telefonía / CTI | Entrante | Adaptador CTI (central IP del tenant) | Identificación por número, ficha emergente, clic para llamar, pausa automática del caso tomado, referencia a grabación (no se almacena audio por defecto) | DFA M21; RN-07 §6.1 |
| IVR | Entrante y saliente | Adaptador IVR | Entrante: consultas y reclamos (API-CRM-79). Saliente: modelos de archivo de discadores (IVR Logística, TeleAnnouncer Lite, texto en fila/columna, texto + audio, Minerva, IVR SPE, Excel) en T09/M08 | FIC 13.4; RN-07 §8.9; CAT `IVR` |
| Chat web | Entrante | Widget propio | Embebido en landing/portal/PWA; sesiones anónimas con rate limiting | BASE §47 |
| Redes sociales | Entrante y saliente | Adaptadores Messenger e Instagram | Misma bandeja omnicanal | Alcance solicitado |
| IA | Saliente | Interfaz `AiProvider` (T06) con registro de versión | Sin proveedor fijo en código (ProCoop usa gpt-4o fijo en `clsAnalisisNotasTicket`); acuerdo de tratamiento de datos; sin entrenamiento con datos del tenant | FIC 20; AGR-030 |
| Agente local | Bidireccional | Agente T06 en PC de la sucursal | Impresora térmica de tickets (ej. Masung D347), turnero serie existente (puerto, V2 2006), pulsadores; heartbeat; cola local si se corta Internet | FIC 19; RN-10 §16.1 |
| GIS / red | Consulta | M10 | Alcance de incidentes por nodo/zona | RN-07 §10.9 |
| ProCoop (migración y paralelo) | Entrante | T07 | Ver §19 | T07 |

## 14. Parámetros de configuración

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-CRM-001 | `crm.numbering.scope` | enum (`tenant`, `service`, `type`, `complaintFlag`, `typeAndComplaint`) | tenant | `tenant` | Alcance del contador de casos | V2 344 |
| PRM-CRM-002 | `crm.numbering.continuousComplaints` | bool | tenant | false | Numeración única continua de reclamos (sin reinicio anual) | V2 2998 |
| PRM-CRM-003 | `crm.numbering.perServiceInReports` | bool | tenant | false | Mostrar numeración por servicio en informes de reclamos | V2 3031 |
| PRM-CRM-004 | `crm.numbering.format` | string | tenant | `TCK-{YYYY}-{N:6}` | Formato del número visible | — |
| PRM-CRM-005 | `crm.intake.defaultRoute` | ref canal | tenant | `presential` | Vía de ingreso por defecto | V2 333 |
| PRM-CRM-006 | `crm.intake.routeRequired` | bool | tenant | true | Exigir vía de ingreso | V2 2629 |
| PRM-CRM-010 | `crm.priority.levels` | lista | plataforma/tenant | 0/1/25/50/75/100 | Niveles y etiquetas de prioridad | Gravedad tickets |
| PRM-CRM-011 | `crm.priority.defaultUnclassified` | int | tenant | 50 | Prioridad si el subtipo no define | — |
| PRM-CRM-012 | `crm.routing.autoDeriveEnabled` | bool | tenant/tipo | false | Permitir derivación automática por regla determinista | — (PA-CRM-02) |
| PRM-CRM-013 | `crm.routing.supervisionRequired` | bool | plataforma | true | Todo caso ingresa a supervisión (no desactivable por tenant) | BASE §47 CRM-007 |
| PRM-CRM-015 | `crm.case.pendingInfoDeadlineDays` + `crm.case.pendingInfoAction` | int + enum (`remind`, `cancelAsWithdrawn`) | tenant/tipo | 15 + `remind` | Plazo y acción ante faltantes | — |
| PRM-CRM-016 | `crm.case.draftRetentionDays` | int | tenant | 7 | Conservación de borradores del socio | — |
| PRM-CRM-017 | `crm.attachments.maxSizeMb` | int | plataforma/tenant | 10 | Tamaño máximo por archivo | — (PA-CRM-11) |
| PRM-CRM-018 | `crm.attachments.allowedTypes` + `maxPerMessage` | lista + int | plataforma/tenant | jpg, png, heic, webp, pdf + 10 | Tipos y cantidad | — (PA-CRM-11) |
| PRM-CRM-019 | `crm.urgent.safetyMessageKey` + `crm.urgent.emergencyPhone` | dict + string | tenant/servicio | `dict:crm.urgent.safety` + vacío | Mensaje de seguridad y teléfono de guardia | — |
| PRM-CRM-020 | `crm.sla.defaultCalendarMode` | enum | tenant | `business` | Modo de cálculo por defecto | — (PA-CRM-03) |
| PRM-CRM-021 | `crm.sla.pauseBaseStatuses` | enum[] | tenant | `pendingInfo`, `waitingCustomer` | Estados que pausan SLA | — |
| PRM-CRM-022 | `crm.case.autoCloseDays` | int | tenant/tipo | 7 | Cierre automático tras resuelto sin respuesta | — (PA-CRM-04) |
| PRM-CRM-023 | `crm.case.reopenWindowDays` | int | tenant/tipo | 30 | Ventana de reapertura/recuperación | — (PA-CRM-05) |
| PRM-CRM-024 | `crm.case.notifyRescheduleToContact` | bool | tenant | true | Avisar reprogramación de fecha compromiso | RN-07 §6.1 (correo "CambioVencimiento") |
| PRM-CRM-025 | `crm.case.quoteDefaultDays` | int | tenant | 30 | Días por defecto para vencimiento desde presupuesto | RN-07 §6.1 |
| PRM-CRM-026 | `crm.case.staleDays` | int | tenant | 7 | Umbral "sin intervención" | RN-07 §6.1 |
| PRM-CRM-027 | `crm.sla.warnPercent` | int | tenant | 75 | Umbral de alerta | — |
| PRM-CRM-028 | `crm.sla.escalationLevels` | lista | tenant | N1 100 % responsable del área; N2 150 % supervisor | Escalamiento por defecto | — |
| PRM-CRM-030 | `crm.cancellation.publicEnabledServices` | ref servicios | tenant | Internet, TV, telefonía | Servicios con recepción pública de baja | BASE §52.3 (PA-CRM-15) |
| PRM-CRM-031 | `crm.cancellation.receiptDeadlineHours` | int | plataforma | 24 | Plazo de constancia con código (no editable por tenant hacia arriba) | Res. 316/2018 (BASE §52.3) |
| PRM-CRM-032 | `crm.cancellation.rescissionReceiptHours` | int | plataforma | 72 | Plazo de constancia de rescisión por el mismo medio | Ley 24.240 art. 10 ter |
| PRM-CRM-033 | `crm.suspension.rules` | lista por servicio | servicio | Sin suspensión temporal habilitada | Duración mínima/máxima y efectos | BASE §53 |
| PRM-CRM-034 | `crm.suspension.feeRules` | lista (regla, importe ARS, `validated`, `validatedBy`, `basis`) | servicio/jurisdicción | Demo: SUS-DEMO-GRATIS ARS 0, REACT-DEMO-GRATIS ARS 0, REACT-DEMO-ARANCEL ARS 5.000 **deshabilitada** | Modalidades con y sin costo | BASE §53 CIC-004 |
| PRM-CRM-035 | `crm.cancellation.publicRequiredFields` | lista | tenant | nombre, documento, servicio, domicilio o cuenta, contacto | Campos mínimos del formulario público | — (PA-CRM-15) |
| PRM-CRM-039 | `crm.incident.autoLinkConfirmed` | bool | tenant | false | Vincular automáticamente reclamos nuevos al incidente confirmado que los alcanza | — |
| PRM-CRM-040 | `crm.incident.observationHours` | int | tenant/servicio | 24 | Plazo entre restablecido y cierre del incidente | — |
| PRM-CRM-041 | `crm.duplicates.windowDays` | int | tenant/subtipo | 90 | Ventana de detección de duplicados | RN-07 §1 (90 días) |
| PRM-CRM-042 | `crm.onCall.enabled` | bool | tenant | true | Reglas de guardia | `RESPONSA_NOTIFICA` |
| PRM-CRM-043 | `crm.notify.incidentMailbox` | bool + email | tenant | false | Correo a la cuenta configurada del incidente | V2 2630 |
| PRM-CRM-044 | `crm.notify.participants` | bool | tenant | false | Correo a cada interviniente registrado | V2 2631 |
| PRM-CRM-045 | `crm.notify.accountHolder` | bool | tenant | true | Aviso al titular de la cuenta | V2 2632 |
| PRM-CRM-046 | `crm.fieldConformity.blocksAutoClose` | bool | tenant | true | Disconformidad de campo impide cierre automático | V2 51 (M10, conformidad al cerrar OT) |
| PRM-CRM-047 | `crm.complaints.improperVisitCharge` | bool | servicio | false | Habilita cargo por visita improcedente (regla en M10/M05) | `CONEXION.RECLAMO` (PA-CRM-18) |
| PRM-CRM-048 | `crm.complaints.webCreatesWorkOrderRequest` | bool | tenant/subtipo | false | Reclamo del portal solicita OT a M10 sin pasar por supervisión (solo subtipos técnicos marcados) | V2 58 |
| PRM-CRM-050 | `crm.notify.onCreated` | bool | tenant/tipo | true | Aviso "recibido" | — |
| PRM-CRM-051 | `crm.notify.statusChange` | por estado visible | tenant | según `notifyCustomer` | Estados notificables | `ENVIARMAIL` |
| PRM-CRM-052 | `crm.notify.channelPriority` | lista | tenant | app/push, WhatsApp, email, SMS | Orden de canales cuando el socio no definió preferencia | V2 3088 (canal único) → T09 |
| PRM-CRM-053 | `crm.templates.closed` | clave plantilla | tenant/tipo | `crm.case.closed` | Plantilla de aviso de cierre | V2 2478 |
| PRM-CRM-054 | `crm.survey.enabled` + `delayHours` | bool + int | tenant/tipo | true + 2 | Encuesta post-cierre | CNX §7.7 |
| PRM-CRM-055 | `crm.survey.minIntervalDays` | int | tenant | 30 | Intervalo mínimo entre encuestas al mismo socio | `ENCUESTAS.INTERVALO_REPITE` |
| PRM-CRM-056 | `crm.templates.created` (y claves por evento) | clave plantilla | tenant/tipo | `crm.case.created` | Plantilla de aviso de caso nuevo | V2 2479 |
| PRM-CRM-060 | `crm.bot.verificationMethod` | enum (`linkedPhone`, `otp`, `accountPlusData`) | tenant | `linkedPhone` + `otp` de respaldo | Verificación para información privada | — (PA-CRM-07) |
| PRM-CRM-061 | `crm.whatsapp.provider` + `crm.whatsapp.officialApi` | enum + bool | tenant | `metaCloud` + true | Proveedor y uso de API oficial con plantillas | V2 3105 (PA-CRM-06) |
| PRM-CRM-062 | `crm.whatsapp.minDelayMs` | int | tenant | 1000 | Demora mínima entre mensajes masivos | V2 2872 |
| PRM-CRM-063 | `crm.bot.sessionTimeoutMinutes` | int | tenant | 30 | Expiración de sesión del bot | — |
| PRM-CRM-064 | `crm.webchat.inactivityMinutes` | int | tenant | 15 | Cierre de chat web inactivo | — |
| PRM-CRM-065 | `crm.bot.enabledIntents` | lista | tenant | todas menos `startCancellation` vía bot (redirige a formulario de baja) | Intenciones activas | — |
| PRM-CRM-066 | `crm.bot.humanHours` | horario | tenant/canal | Lunes a viernes 8 a 16 | Horario de atención humana | — (PA-CRM-08) |
| PRM-CRM-070 | `crm.ai.enabled` | bool | tenant | false | IA habilitada (requiere aceptación de condiciones) | — (PA-CRM-09) |
| PRM-CRM-071 | `crm.ai.confidenceThreshold` | number | tenant/función | 0,70 | Umbral para mostrar como sugerencia preseleccionada | — |
| PRM-CRM-072 | `crm.ai.excludeSensitive` | bool | plataforma | true | Excluir casos sensibles | AGR-030 |
| PRM-CRM-073 | `crm.ai.functions` | lista | tenant | `classify`, `summarize`, `replyDraft` | Funciones activas | — |
| PRM-CRM-074 | `crm.ai.providerConnectionId` | ref T06 | tenant/plataforma | conexión de plataforma | Proveedor de IA | FIC 20 |
| PRM-CRM-080 | `crm.commands.maxRetries` | int | plataforma | 5 | Reintentos de comandos fallidos | — |
| PRM-CRM-085 | `crm.procedures.actionsEnabled` | bool | tenant | true | Ejecutar acciones de trámites | V2 2509 |
| PRM-CRM-090 | `crm.hours.billingEnabled` | bool | tenant | false | Facturación de horas de casos | — (PA-CRM-12) |
| PRM-CRM-091 | `crm.hours.hourlyRate` | Decimal128 ARS | tenant | 0 | Valor hora para bonificación | V2 2488 |
| PRM-CRM-092 | `crm.hours.billingProductId` | ref producto M02 | tenant | — (obligatorio si facturación activa) | Producto para horas sin producto (reemplaza producto 464 fijo) | RN-07 §6 |
| PRM-CRM-093 | `crm.cases.verificationBusinessDays` | int | tenant | 2 | Días hábiles estimados para verificación | RN-07 §6 (testing) |
| PRM-CRM-100 | `crm.queue.displayCodeMode` | enum (`number`, `name`) | sucursal | `number` | Mostrar próximo turno por número o por nombre | V2 2005 |
| PRM-CRM-101 | `crm.queue.useDocumentLast3` | bool | sucursal | false | Código con últimos 3 dígitos del documento y sin impresión | V2 3064 |
| PRM-CRM-102 | `crm.queue.serialDevice` | objeto (puerto, velocidad) en el agente | sucursal | — | Turnero serie existente vía agente local | V2 2006 |
| PRM-CRM-103 | `crm.queue.lastCallsGrouping` | enum (`lastCalls`, `byDesk`) | pantalla | `lastCalls` | Agrupación de últimos llamados | V2 2209 |
| PRM-CRM-104 | `crm.queue.displayMode` | enum (`highlightLast`, `allEqual`, `highlightLastLarge`) | pantalla | `highlightLast` | Modo de visualización | V2 2240 |
| PRM-CRM-105 | `crm.queue.autoGenerationDeskId` | ref box | sucursal | box técnico creado al habilitar | Box para turnos generados automáticamente | V2 2014 |
| PRM-CRM-106 | `crm.queue.voice` | objeto (habilitada, voz, velocidad) | pantalla | habilitada, voz es-AR | Lectura por voz | V2 2700 |
| PRM-CRM-107 | `crm.queue.maxRecalls` | int | sucursal | 2 | Rellamados antes de ausente | — |
| PRM-CRM-108 | `crm.queue.statsExcludeGapHours` | int | tenant | 5 | Exclusión de errores de carga en estadísticas | RN-10 §16.1 |
| PRM-CRM-109 | `crm.queue.dayCloseTime` | hora | sucursal | 20:00 | Cierre automático del día | — |
| PRM-CRM-110 | `crm.queue.appointmentSlot` | objeto (minutos, cupo por franja, horario) | área | 15 min, 1 por box | Reservas | — (PA-CRM-13) |
| PRM-CRM-111 | `crm.queue.noShowToleranceMinutes` | int | área | 15 | Tolerancia de reserva | — |
| PRM-CRM-112 | `crm.queue.remoteEnabled` | bool | tenant | false | Turnos desde la web/app/WhatsApp | V2 67 (requiere 3064 en ProCoop; en CoopApps no) |
| PRM-CRM-113 | `crm.queue.remotePrincipal` | principal de servicio | tenant | creado automáticamente | Usuario técnico de turnos remotos | V2 3089 |
| PRM-CRM-114 | `crm.queue.displays` | colección `crmQueueDisplays` | sucursal | 1 pantalla | Pantallas del turnero | V2 2007 |
| PRM-CRM-115 | `crm.queue.remoteNotifyAhead` | int | área | 3 | Aviso al turno remoto cuando faltan N | — |
| PRM-CRM-120 | `crm.activities.lastReminderRun` | fecha (sistema) | tenant | — | Marca del último envío de recordatorios | V2 681 |
| PRM-CRM-121 | `crm.activities.reminderHour` | hora | tenant | 08:00 | Hora de recordatorios | — |
| PRM-CRM-122 | `crm.activities.escalateAfterDays` | int | tenant/tipo | 3 | Escalamiento de vencidas | BASE §26 |
| PRM-CRM-130 | `crm.regulatory.complaintTypes` | lista (regulador, tipos, campos) | tenant | vacío | Reclamos regulatorios (ej. pestaña OCEBA) | V2 3120 |
| PRM-CRM-131 | `crm.workOrderPrint.includeCaseSummary` | bool | tenant | false | M10 incluye resumen de incidentes/casos en la OT impresa | V2 3173 |
| PRM-CRM-132 | `crm.sla.platformTemplates.enacom` | bool | tenant/servicio TIC | true si el tenant tiene INT, TV o TEL | Ofrece la plantilla ENACOM Res. 733/2017 en PAN-CRM-14 (RF-CRM-258); no la aplica sin adopción | — (HUE-INT-03) |
| PRM-CRM-133 | `crm.sla.safetyTargets` | objeto por servicio `{ firstResponseMin, onSiteMin, resolutionMin }` | servicio | GAS 10/60/240 · ELE 15/90/360 · AG 30/180/720 · CLO 30/180/720 (default propuesto; **requiere validación legal** con la distribuidora y el regulador) | Objetivos del SLA de seguridad en minutos corridos (RF-CRM-260) | — (HUE-GAS-05) |
| PRM-CRM-134 | `crm.claims.externalDerivationDefault` | enum `cooperative/municipality/byAgreement` | servicio | ALU `byAgreement`; CLO `cooperative`; resto `cooperative` | Derivación por defecto de reclamos según el convenio (RF-CRM-259) | — (HUE-CLO-03, HUE-ALU-03) |
| PRM-CRM-135 | `crm.sla.enacomTargets` | objeto por motivo `{ firstResponse, resolutionBusinessDays }` | plataforma (plantilla) / tenant al adoptar | `noService` inmediata/3 · `degraded` inmediata/5 · `billing` inmediata/15 · `contract` inmediata/5 · `service` inmediata/15 (default propuesto, §18.1; **requiere validación legal** de los plazos vigentes de la Res. ENACOM 733/2017) | Objetivos de la plantilla `enacom.733-2017` (RF-CRM-258); la adopción copia los valores a `crmSlaPolicies` con `legalValidation.status = pending` | — (HUE-INT-03) |

Parámetros V2 del ámbito **no** asignados a este anexo (destino): 2810/2873/2874/2870 credenciales WhatsApp → bóveda T01/T06; 518/519 identificación del cliente ProCoop en gateway → Descartado (propio de ProCoop); 2693 SMS habilitado y 2696 URL del gateway → T09/T06; 2824, 3051, 3121 selección de teléfono destino → T09 (resolución de contacto); 3088 canal de notificación a responsables → T09 preferencias; 3105 WhatsApp oficial → PRM-CRM-061 (CRM) y T09; 210 reporte de presupuesto adjunto al mail → M11; 3072 grilla de áreas despegada del borde → Descartado (estética resuelta por el design system T03); 3084 responsables por servicio y operación, 2480 actualizar teléfono y mails en órdenes, 333/2629 en OT → M10 (el CRM usa sus propios PRM-CRM-005/006); 51 encuesta de conformidad al cerrar OT → M10 (CRM consume, PRM-CRM-046); 911 adhesión a factura web → M19/M05.

## 15. Reportes, indicadores y exportaciones

Todos los indicadores se calculan sobre proyecciones (JOB-CRM-17) con **fórmula, universo y fecha de corte** explícitos (AGR-022); se exponen en T10 (sala "Atención y reclamos", CNX §4.5) y se exportan a XLSX/CSV/PDF.

| Código | Indicador / reporte | Fórmula | Universo | Fecha de corte |
|---|---|---|---|---|
| REP-CRM-01 | Casos abiertos por estado, área, servicio, prioridad | Conteo de casos con `baseStatus` no final | Casos del tenant según alcance | Instante de consulta o fin del día elegido (snapshot) |
| REP-CRM-02 | Tiempo de primera respuesta | Mediana y p90 de (`firstRespondedAt` − `createdAt` − pausas) | Casos con primera respuesta en el período | Fecha de primera respuesta |
| REP-CRM-03 | Tiempo de resolución | Mediana, promedio y p90 de (`resolvedAt` − `createdAt` − `pausedMs`) | Casos resueltos en el período | Fecha de resolución |
| REP-CRM-04 | Cumplimiento SLA | Casos resueltos con `breachedResolution = false` / casos resueltos con SLA × 100 | Casos con política SLA resueltos en el período | Fecha de resolución |
| REP-CRM-05 | Backlog y antigüedad | Distribución de abiertos por tramos 0–2, 3–7, 8–15, 16–30, > 30 días | Abiertos | Snapshot |
| REP-CRM-06 | Reincidencias | Grupos con > 1 caso por cuenta / cuenta+servicio / cuenta+servicio+tipo | Casos creados en el período | Fecha de creación |
| REP-CRM-07 | Tasa de reapertura | Casos con `reopenCount > 0` / casos cerrados × 100 | Cerrados en el período | Fecha de cierre |
| REP-CRM-08 | Estadísticas de demora (heredado) | Cantidad y demora promedio en días de pendientes, resueltos, resueltos dentro y después del período, no resueltos; desde fecha del caso y desde registro hasta cierre o ahora, piso 0; comparación con período anterior | Casos del filtro | Fecha desde/hasta del filtro |
| REP-CRM-09 | Satisfacción CSAT / NPS | CSAT = respuestas 4–5 / respuestas × 100; NPS = %promotores − %detractores | Encuestas post-cierre respondidas | Fecha de respuesta |
| REP-CRM-10 | Resolución en primer contacto | Casos cerrados con una sola interacción entrante y sin derivación / cerrados × 100 | Cerrados en el período | Fecha de cierre |
| REP-CRM-11 | Volumen por canal, servicio, tipo y motivo | Conteo | Casos e interacciones creados | Fecha de creación |
| REP-CRM-12 | Incidentes | Cantidad, afectados, duración (restablecido − inicio), casos por incidente | Incidentes confirmados | Fecha de inicio |
| REP-CRM-13 | Bajas recibidas y constancias en plazo | Bajas por canal (pública/autenticada) y % constancias entregadas ≤ 24 h | Solicitudes de baja | Fecha de recepción |
| REP-CRM-14 | Solicitudes comerciales | Tiempo solicitud → fecha efectiva; tasa de aprobación; desistimientos | Solicitudes por acción | Fecha de creación |
| REP-CRM-15 | Bot | Contención = sesiones `selfServed` / sesiones × 100; traspasos; abandonos | Sesiones del bot | Fecha de inicio |
| REP-CRM-16 | IA | Tasa de aceptación, corrección y descarte por función y servicio | Sugerencias decididas | Fecha de decisión |
| REP-CRM-17 | Turnero | Ingresados, atendidos, abandonos, prioritarios, espera y atención promedio por día de semana y hora, por mes/día/hora y por turno | Turnos del período (excluye errores ≥ 5 h si se elige) | Fecha del turno |
| REP-CRM-18 | Actividades | % cerradas en término; atraso promedio por área y responsable | Ocurrencias con fecha en el período | Fecha de ocurrencia |
| REP-CRM-19 | Mesa de entradas | Entradas, pendientes, vencidas, tiempo de respuesta | Expedientes de mesa | Fecha de recepción |
| REP-CRM-20 | Desvío de fecha compromiso | Fecha de cierre − fecha compromiso (solo cerrados) | Casos cerrados con fecha compromiso | Fecha de cierre |
| REP-CRM-21 | Pendientes por usuario | Abiertos asignados separando sin intervención 7 días y 8+ días | Asignados | Snapshot |
| REP-CRM-22 | Horas por proyecto/cuenta | Minutos reales, a facturar, cubiertos por bolsa, facturados | Worklogs | Fecha de fin del worklog |
| REP-CRM-23 | Trámites presentados/no presentados/vencidos | Conteos por tipo | Entidades con trámite exigido | Fecha de consulta |
| REP-CRM-24 | Informe de comunicación de circulares | Destinatarios, entregados, fallidos, impresos | Corrida | Fecha de generación |
| REP-CRM-25 | Operaciones por usuario | Creados, mensajes/notas, asignaciones, cerrados, cancelados; control por período | Eventos del período | Fecha del evento |
| REP-CRM-26 | Reclamos del socio sobre casos en curso | Mensajes marcados como reclamo en casos abiertos | Casos abiertos | Snapshot |
| REP-CRM-27 | Desvío de estimación de tiempo | (minutos reales − estimados) / estimados por área, excluyendo verificación; devoluciones desde verificación | Casos con estimación cerrados | Fecha de cierre |
| REP-CRM-28 | Indicadores de calidad de atención regulatoria | Según regulador (tiempos por tipo regulatorio) | Tipos regulatorios | Período del informe |

## 16. Casos de uso

### CU-15 — Alta de Internet con documentación (BASE §15)

**Actor:** agente de atención. **Inicio:** Ana solicita incorporar Internet en INM-001. **Pasos:** (1) el agente crea SOL-001 (tipo `serviceActivation`, plan INT-100, canal Presencial); (2) valida documentación; falta constancia de domicilio → estado "Pendiente de documentación" con faltante listado; (3) Ana sube la constancia por la app; (4) se envía a evaluación de cobertura (comando de factibilidad a M10); (5) aprobada, se piden a M02 el contrato y a M10 la instalación; (6) se informa el avance y la fecha efectiva al activarse. **Resultado:** solicitud trazable que origina contrato y OT sin perder el expediente. **Excepción:** sin documentación, queda pendiente y no se da de alta una prestación activa. **Requisitos:** RF-CRM-015, 060, 063–065, 077, 078.

### CU-16 — Falta de agua en una zona (BASE §16)

**Actor:** operador de reclamos. **Pasos:** (1) se registran REC-001 y otros reclamos; JOB-CRM-05 propone INC-001; (2) el supervisor confirma, vincula casos y se solicita una sola intervención técnica; (3) se comunican avances; (4) M10 restablece; los casos quedan "resuelto pendiente de confirmación"; (5) un domicilio sigue afectado: su caso se reabre y se pide OT individual. **Requisitos:** RF-CRM-106–110.

### CU-CRM-21 — Tarea interna, turno y aviso (BASE §26)

Antes CU-26. El CU-26 de BASE §26 («Comunicar al asociado con constancia») lo define T09 (anexo dueño); aquí se detallan la tarea interna y el turno, y el paso de comunicación cita a T09.

**Actores:** supervisor, recepcionista, operador de comunicaciones. **Pasos:** (1) tarea: TAR-001 "Revisión mensual" con responsable, evidencia y cierre (actividad mensual); (2) atención: se entrega A-001 para Caja, se llama y se registra atención o ausencia; (3) comunicación: aviso AVISO-FACTURA (T09) con resultado diferenciado por canal. **Excepción:** un envío fallido queda identificado; encolar no es notificar. **Requisitos:** RF-CRM-140–147, 224–229, RN-CRM-023.

### CU-CRM-01 — Reclamo por pérdida de agua con foto (BASE §47)

Según BASE §47: Ana abre gestión en Agua con cuenta autorizada, el bot pide datos y foto, la IA propone resumen y motivo, se registra TCK-DEMO-001 en supervisión, el supervisor deriva a Agua, el empleado genera OT vinculada, registra el resultado y responde por el canal; cierre por el circuito acordado. **Excepciones:** cuenta ajena → denegado; cuenta desconocida → aclaración; cambio de área → mismo expediente; sugerencia IA incorrecta → corrección sin perder original. **Requisitos:** RF-CRM-001–011, 038, 101, 200, 206.

### CU-SOL-01 — Alta de Internet y baja de TV (BASE §48)

Definición dueña: este anexo (PA-CRM-19, Asumida DEC-072). M02 cita la parte «en lo que toca al contrato». Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: este anexo). M02 también lo describe "en lo que toca al contrato"; mientras tanto, este texto cubre solo la solicitud y su circuito de atención.»

Ana solicita alta de Internet (TCK-ALTA-001) sin contrato previo; supervisión deriva; aprobación e instalación habilitan el contrato con fecha efectiva. Luego solicita la baja de TV (TCK-BAJA-001); se ejecuta conforme al circuito, se informa fecha efectiva y se conservan facturas e historia. **Requisitos:** RF-CRM-004, 060, 061, 064, 065.

### CU-CIC-01 — Suspensión temporal y reactivación de Internet (BASE §53)

Definición dueña: M08 «CU-CIC-01 — Suspensión temporal y reactivación de Internet» (PA-MOR-21 de M08, Asumida DEC-072). Aquí solo el tramo de atención. Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: M08).» Ver §9.4. **Requisitos:** RF-CRM-068–070, RN-CRM-011–013.

### CU-CRM-02 — Baja pública de Internet sin registro

**Actor:** solicitante sin cuenta en el portal. **Pasos:** (1) desde el botón visible "Baja" de la landing elige Internet, completa nombre, documento, domicilio y email; (2) recibe en pantalla y por email el código BAJA-DEMO-7Q4K y el número de caso; (3) supervisión identifica el contrato; (4) M02 ejecuta la baja con fecha efectiva; M10 coordina retiro del módem; (5) se informa la fecha efectiva. **Excepción:** el email rebota → JOB-CRM-06 intenta SMS y alerta; datos que no coinciden → contacto sin divulgar información. **Requisitos:** RF-CRM-066, 067, 079; RN-CRM-007–009.

### CU-CRM-03 — Corte zonal de Internet con aviso masivo

M10 emite `tec.networkDevice.down` (EVT-TEC-24) en el nodo OLT-DEMO-03; el CRM propone INC; el supervisor confirma; los reclamos nuevos de la zona se vinculan; el bot de WhatsApp informa "Hay una interrupción en tu zona, estimamos restablecer 18:00"; al restablecer se avisa a afectados. **Requisitos:** RF-CRM-106–110, 174.

### CU-CRM-04 — Cambio de plan de Internet

Ana pide pasar de INT-100 a INT-300; ve la cotización y el proporcional informativo; acepta; M02 aplica el cambio con fecha efectiva; M05 factura el proporcional. **Requisitos:** RF-CRM-072, 084.

### CU-CRM-05 — Cambio de titular por venta de inmueble

Cedente y cesionario presentan documentación; el caso exige ambas conformidades; M01 registra la transferencia; las deudas previas siguen con el cedente según regla de M07. **Requisitos:** RF-CRM-071.

### CU-CRM-06 — Traslado de servicio

El socio informa mudanza; se pide factibilidad en el nuevo domicilio y OT de traslado; al ejecutarse, M01 actualiza domicilio del servicio. **Requisitos:** RF-CRM-073.

### CU-CRM-07 — Consulta de saldo y reclamo por WhatsApp

Ana escribe al número oficial; el bot la identifica por teléfono vinculado verificado, informa saldo y ofrece link de pago (M07); luego elige "reclamo: Internet lento", adjunta captura; se crea el caso y se informa el número; fuera de horario se le indica el plazo de respuesta. **Requisitos:** RF-CRM-172–176.

### CU-CRM-08 — Turno presencial con derivación

Se emite C-014 para Comercial; el box 2 lo llama; la consulta requiere Caja; se deriva conservando el área de origen; Caja atiende y finaliza "solucionado". **Requisitos:** RF-CRM-140–147, 156.

### CU-CRM-09 — Turno online con aviso

El socio reserva para Atención Comercial a las 10:15; recibe recordatorio; al llegar hace check-in en el tótem; recibe aviso cuando faltan 3 turnos. **Requisitos:** RF-CRM-151–153.

### CU-CRM-10 — Oficio judicial en mesa de entradas

Ingresa un oficio con plazo de 10 días hábiles; se registra ME-2026-00045, se pasa a Legales con acuse; alerta a 2 días hábiles; se registra la salida con número y constancia. **Requisitos:** RF-CRM-130–134.

### CU-CRM-11 — Actividad recurrente regulatoria

Tipo "Presentación trimestral" (margen anterior 10 días, posterior 5); el job crea la ocurrencia y la cita; recordatorios por área; cierre con evidencia en término. **Requisitos:** RF-CRM-221–229.

### CU-CRM-12 — Lectura de adjunto por IA

El socio envía foto del medidor por WhatsApp; la IA propone número de medidor y lectura; el agente acepta el número y corrige la lectura; queda registro de ambos valores. **Requisitos:** RF-CRM-203, 206.

### CU-CRM-13 — SLA vencido y escalamiento

Un reclamo crítico "cable caído" con objetivo de 4 h corridas: al 75 % alerta al responsable; a las 4 h escala al supervisor; el informe registra el incumplimiento. **Requisitos:** RF-CRM-103, 104, 122.

### CU-CRM-14 — Reapertura por falla persistente

El socio responde "sigue sin funcionar" a los 3 días del cierre; el caso se reabre (ciclo 2) y vuelve al área; el indicador de reapertura lo cuenta. **Requisitos:** RF-CRM-021.

### CU-CRM-15 — Duplicado detectado

Un socio reclama dos veces por el mismo corte (portal y teléfono); el sistema propone el vínculo; el supervisor fusiona; el socio recibe el número principal. **Requisitos:** RF-CRM-020.

### CU-CRM-16 — Soporte TIC con bolsa de horas (si se confirma PA-CRM-12)

Una empresa socia con servicio TIC tiene 10 h mensuales bonificadas; el técnico registra 12 h; se consumen 10 de la bolsa y se solicitan a M05 2 h a valor hora configurado. **Requisitos:** RF-CRM-041.

### CU-CRM-17 — Circular de aviso de deuda con etiquetas

El operador elige el modelo "Aviso deuda mayor a ARS 20.000", filtra por servicio y adheridos sin factura digital; aprueba; se generan PDF y etiquetas; el informe de comunicación muestra impresos y fallidos. **Requisitos:** RF-CRM-250–252.

### CU-CRM-18 — Email a caso

Un socio responde por email al aviso con asunto "[TCK-2026-000321]"; el mensaje se agrega al caso, que vuelve de "en espera del socio" a "en tratamiento". **Requisitos:** RF-CRM-177, RN-CRM-039.

### CU-CRM-19 — Trámite de tarifa social vencido

El socio tenía constancia con vencimiento anual; JOB-CRM-07 la detecta vencida sin otra vigente y solicita a M04/M07 la baja del beneficio desde el próximo período; se avisa al socio. **Requisitos:** RF-CRM-080, RN-CRM-059, 060.

### CU-CRM-20 — Cancelación con instalación offline en conflicto (ESC-03)

El socio cancela su alta mientras el instalador sin conexión ya instaló; al sincronizar, M10 informa ejecución; el caso pasa a "en conflicto" con ambas evidencias para que supervisión decida. **Requisitos:** RF-CRM-076, RN-CRM-027.

## 17. Criterios de aceptación y escenarios de prueba

Los criterios por requisito están en la columna "Criterio de aceptación" de §5. Esta sección agrega escenarios transversales en formato Dado / Cuando / Entonces. Datos: precarga ficticia de §18.

### 17.1 Escenarios funcionales

| ID | Escenario | Dado | Cuando | Entonces | Requisitos |
|---|---|---|---|---|---|
| ESC-CRM-01 | Supervisión obligatoria | Tenant con `crm.routing.autoDeriveEnabled = false` | Ana crea un reclamo desde la app | El caso queda en `received` en la bandeja de supervisión; ninguna área lo ve hasta derivarlo | RF-CRM-008, RN-CRM-003, PRM-CRM-013 |
| ESC-CRM-02 | Derivación cambia de área sin perder historia | TCK-DEMO-001 derivado a Agua | El empleado lo deriva a Comercial con motivo | Mismo número, timeline con ambos pases, SLA continúa | RF-CRM-009, BASE §47 |
| ESC-CRM-03 | CRM no altera contratos | Solicitud de baja aprobada | Se ejecuta | El CRM emite `crmCommandRequests` a M02; el contrato cambia solo cuando M02 confirma; si M02 rechaza, el caso pasa a "en ejecución con error" | RF-CRM-078, RN-CRM-001, AGR-002 |
| ESC-CRM-04 | Baja sin cargo ni deuda | Ana tiene deuda vencida de ARS 12.500 | Pide la baja de Internet por el formulario público | Se recibe, se entrega código en ≤ 24 h, no se exige pagar ni se crea cargo; la deuda sigue en M07 | RF-CRM-066, 067; RN-CRM-007, 008 |
| ESC-CRM-05 | Rescisión por el mismo medio | Contrato celebrado por la app | Ana pide la baja por la app | La opción está disponible en la app y la constancia se envía por el mismo medio en ≤ 72 h | RN-CRM-008, PRM-CRM-032 |
| ESC-CRM-06 | Regla arancelada no validada | REACT-DEMO-ARANCEL deshabilitada | Ana pide reactivación | Solo se ofrece REACT-DEMO-GRATIS; no aparece cargo | RF-CRM-070, RN-CRM-012 |
| ESC-CRM-07 | Reactivación por pago | Cargo admisible validado y pagado | M07 confirma pago | El caso no pasa a "reactivado" hasta `contract.reactivated` de M02 | RN-CRM-013 |
| ESC-CRM-08 | Incidente no cierra casos | INC-001 con 12 casos | M10 informa restablecido | Los casos pasan a "resuelto pendiente de confirmación"; un caso con respuesta "sigue sin agua" se reabre | RF-CRM-110 |
| ESC-CRM-09 | SLA con pausa | Política 48 h hábiles, pausa en `waitingCustomer` | El caso espera al socio 2 días | El tiempo pausado no consume SLA; `pausedMs` refleja la espera | RF-CRM-103, PRM-CRM-021 |
| ESC-CRM-10 | Escalamiento | SLA crítico de 4 h corridas | Pasan 3 h sin resolución | Alerta al 75 %; a las 4 h escala a N2 y marca incumplido | RF-CRM-104, PRM-CRM-027/028 |
| ESC-CRM-11 | Aviso fallido no es notificado | WhatsApp rechaza la plantilla | Se emite aviso de cambio de estado | La interacción queda "fallida" con motivo; se reintenta por canal alternativo según T09; el caso muestra "aviso no entregado" | RN-CRM-023 |
| ESC-CRM-12 | IA solo sugiere | `crm.ai.enabled = true` | La IA propone subtipo "Pérdida en vereda" con confianza 0,82 | Se muestra como sugerencia; el caso no cambia hasta que el agente acepta; queda `crmAiSuggestions` con decisión | RF-CRM-200, 206; RN-CRM-018 |
| ESC-CRM-13 | IA excluye sensibles | Caso marcado sensible (violencia, salud) | Se abre el caso | No se envía contenido al proveedor de IA | PRM-CRM-072 |
| ESC-CRM-14 | Bot no divulga sin verificación | Teléfono no vinculado | Pide saldo por WhatsApp | El bot solicita OTP o derivación; no muestra importes | RF-CRM-175, RN-CRM-017 |
| ESC-CRM-15 | Traspaso a humano | Sesión de bot | El socio escribe "quiero hablar con alguien" en horario | Pasa a bandeja omnicanal con transcripción e identificación; fuera de horario crea caso e informa plazo | RF-CRM-176 |
| ESC-CRM-16 | Duplicado | Caso abierto del mismo subtipo, cuenta y servicio en 90 días | Se crea otro | Se propone vínculo; al fusionar ambos historiales quedan en el principal | RF-CRM-020, PRM-CRM-041 |
| ESC-CRM-17 | Turnero llamado concurrente | Dos boxes del área Caja | Ambos presionan "llamar siguiente" a la vez | Cada uno recibe un turno distinto (operación atómica) | RN-CRM-063 |
| ESC-CRM-18 | Box doble | Box 2 abierto por usuario A | Usuario B intenta abrirlo | Se rechaza informando quién lo tiene | RN-CRM-065 |
| ESC-CRM-19 | Actividades sin duplicar | Actividad mensual con ocurrencia pendiente | El job corre dos veces el mismo día | Se genera una sola ocurrencia | RN-CRM-073, 074 |
| ESC-CRM-20 | En término / fuera de término | Ocurrencia cerrada 2 días después del vencimiento | Se filtra "fuera de término" | Aparece en ese filtro (corrige la inversión de ProCoop) | RN-CRM-078 |
| ESC-CRM-21 | Trámite vencido | Constancia vencida sin otra vigente | JOB-CRM-07 | Emite un comando tipado al módulo dueño una sola vez; un error queda registrado sin detener los demás | RN-CRM-059, 060 |
| ESC-CRM-22 | Mesa de entradas con plazo | Oficio con 10 días hábiles | Faltan 2 días hábiles | Alerta al área y al responsable de mesa | RF-CRM-133 |
| ESC-CRM-23 | Circular de deuda | Modelo con mínimo ARS 20.000 | Se genera | Solo incluye cuentas con deuda ≥ mínimo y no adheridas si el filtro lo indica; la deuda se toma de M07 a la fecha de corte | RN-CRM-090 |
| ESC-CRM-24 | Horas facturadas | Caso con horas facturadas | Se intenta volver atrás | Rechazo "anule primero la facturación en M05" | RN-CRM-042 |
| ESC-CRM-25 | Reapertura fuera de ventana | Caso cerrado hace 45 días | El socio responde | Se crea caso nuevo vinculado al anterior | RF-CRM-021, PRM-CRM-023 |

### 17.2 Permisos negativos

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| NEG-CRM-01 | Socio Ana autenticada | Consulta un caso de una cuenta que no le pertenece ni tiene autorizada | 404 (no revela existencia); intento auditado |
| NEG-CRM-02 | Empleado del área Agua | Abre un caso derivado solo a Energía | 403 salvo alcance de supervisión o de área ampliado |
| NEG-CRM-03 | Empleado sin `crm.notasRestringidas.ver` | Lee una nota restringida | La nota aparece como "Nota restringida" sin contenido |
| NEG-CRM-04 | Agente sin `crm.casos.derivar` | Intenta derivar desde supervisión | 403 |
| NEG-CRM-05 | Operador de comunicaciones | Intenta cambiar el estado de un caso | 403 |
| NEG-CRM-06 | Recepcionista | Intenta abrir un box de un área no asignada | 403 |
| NEG-CRM-07 | Público anónimo | Consulta una baja pública con solo el número | Solo ve estado general; con número + código ve detalle mínimo, nunca deuda ni datos del contrato |
| NEG-CRM-08 | Agente | Intenta exportar casos sin `crm.casos.exportar` | 403; con el permiso, los casos sensibles se exportan seudonimizados salvo `crm.casosSensibles.ver` |
| NEG-CRM-09 | Usuario sin `crm.ia.usar` | Pide resumen IA | 403 y la opción no se muestra |
| NEG-CRM-10 | Soporte de plataforma | Accede a casos de un tenant | Requiere acceso de soporte temporal autorizado (T01) y queda auditado |

### 17.3 Aislamiento de tenant

| ID | Escenario | Resultado esperado |
|---|---|---|
| TEN-CRM-01 | Usuario de TEN-001 consulta `GET /crm/cases/:id` con un id de TEN-002 | 404; el repositorio filtra siempre por `tenantId` |
| TEN-CRM-02 | Webhook de WhatsApp de un número de TEN-002 | Se enruta por la conexión del número; nunca crea casos en TEN-001 |
| TEN-CRM-03 | Job de SLA/actividades | Procesa por tenant con lock por tenant; un fallo en uno no detiene a los demás |
| TEN-CRM-04 | IA | El contexto enviado contiene solo datos del tenant del caso; el registro guarda `tenantId` |
| TEN-CRM-05 | Numeración | Contadores independientes por tenant; dos tenants pueden tener TCK-2026-000001 |
| TEN-CRM-06 | Pantalla de turnero | El token de pantalla solo lee la sucursal configurada |

### 17.4 Reintentos, idempotencia y conciliación

| ID | Escenario | Resultado esperado |
|---|---|---|
| RET-CRM-01 | Doble clic en "Crear reclamo" con la misma `Idempotency-Key` | Un solo caso; la segunda respuesta devuelve el mismo |
| RET-CRM-02 | Webhook de WhatsApp duplicado (mismo `externalMessageId`) | Un solo mensaje registrado |
| RET-CRM-03 | M02 no responde a un comando | Reintentos con backoff hasta PRM-CRM-080; luego alerta y estado "error"; un reintento manual reutiliza la clave |
| RET-CRM-04 | Evento `tec.workOrder.closed` (EVT-TEC-07) llega antes que `tec.workOrder.created` (EVT-TEC-04) | El consumidor lo guarda y aplica en orden por versión |
| RET-CRM-05 | Conciliación diaria de comandos | JOB reporta comandos aceptados sin resultado > 24 h |
| RET-CRM-06 | Estado de entrega de proveedor llega tarde | Actualiza la interacción sin duplicar |

### 17.5 Escenarios ESC de la BASE

| ESC | Aplicación en CRM | Resultado esperado | Requisitos |
|---|---|---|---|
| ESC-01 (pago duplicado) | El caso de reclamo "pagué dos veces" se vincula al resultado de conciliación de M07 | El CRM no anula ni acredita; informa el resultado de M07 | RN-CRM-001 |
| ESC-02 (concurrencia) | Dos agentes toman el mismo caso | Solo uno lo toma (actualización condicional por versión); el otro ve "tomado por" | RN-CRM-036 |
| ESC-03 (offline en conflicto) | Cancelación del alta mientras la instalación offline se ejecutó | Estado `conflict` con ambas evidencias; decide supervisión | RN-CRM-027, CU-CRM-20 |
| ESC-04 (recuperación) | Restauración desde backup | No se reenvían avisos ni comandos aceptados; se concilian por id externo | RN-CRM-096 |
| ESC-05 (corte de proveedor) | Caída de WhatsApp | Los avisos usan canal alternativo; los mensajes entrantes perdidos se recuperan al restablecer si el proveedor los reenvía; banner en bandeja | RF-CRM-172, T09 |

### 17.6 Verificación de no funcionales

| Requisito | Prueba |
|---|---|
| RNF-CRM-001 | Suite TEN-CRM-01..06 en CI |
| RNF-CRM-002 | Webhook con firma inválida → 401; mismo id dos veces → un mensaje; respuesta p95 < 2 s bajo 50 mensajes/s |
| RNF-CRM-003 | 30 solicitudes/min desde una IP al formulario de baja → rate limit y captcha; respuestas iguales para cuenta existente e inexistente |
| RNF-CRM-004 | Llamado visible en pantalla p95 < 1 s con 10 boxes simultáneos |
| RNF-CRM-005 | No existe endpoint de borrado físico; la anonimización conserva números y tiempos para indicadores |
| RNF-CRM-006 | Auditoría WCAG 2.1 AA del portal, formulario de baja, chat web y pantalla del turnero |
| Rendimiento general | Alta de caso p95 < 800 ms; bandeja de 50 casos p95 < 1 s con 200 000 casos por tenant (T08) |

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son ficticios; no se transcriben datos de la DEMO de ProCoop.

| Conjunto | Datos |
|---|---|
| Tenant | TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" |
| Personas | Ana Pérez (DNI 20.000.001, tel. +54 9 11 5555-0001, ana.perez@example.test), Bruno Díaz (DNI 20.000.002), Empresa Demo SRL (CUIT 30-00000001-1) |
| Cuentas y servicios | CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía |
| Áreas CRM | Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas |
| Usuarios | sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) |
| Tipos y subtipos | Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud comercial (alta, baja, cambio de titular, cambio de plan, traslado, suspensión, reactivación), Consulta, Mesa de entradas (nota, oficio, carta documento), Regularización de documento (tipo de sistema `identityDocumentRegularization`, área Comercial, SLA 30 días corridos; RF-CRM-261, DEC-099) |
| Conjunto de estados | Base unificado de §7 con etiquetas por defecto |
| SLA demo | Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles |
| Casos | TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja TV ejecutada); BAJA-DEMO-7Q4K (baja pública Internet recibida) |
| Incidente | INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias |
| Reglas de suspensión | SUS-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-ARANCEL (ARS 5.000, **deshabilitada**, sin validar) |
| Turnero | Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 |
| Actividades | TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) |
| Mesa de entradas | ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" |
| Circular | "Aviso deuda mayor a ARS 20.000" |
| Bot | Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano |
| Plantillas | `crm.case.created`, `crm.case.statusChanged`, `crm.case.closed`, `crm.case.pendingInfo`, `crm.survey.postClose`, `crm.queueTicket.called`, `crm.incident.zone`, `crm.cancellation.receipt` |
| Subtipos de saneamiento y alumbrado (RF-CRM-259) | Cloacas: desborde (`crm.claimType.clo.desborde`, urgente de seguridad si hay riesgo sanitario) y obstrucción (`crm.claimType.clo.obstruccion`), derivación `cooperative`; Alumbrado: luminaria apagada (`crm.claimType.alu.luminariaApagada`), derivación `byAgreement` con convenio ficticio "Municipio Demo – Alumbrado 2026" que deriva al municipio por correo `alumbrado@municipio-demo.example.test` |
| SLA de seguridad (RF-CRM-260) | Plantilla `safety.emergency`, corrido 24×7: fuga u olor a gas 10 min aceptación / 60 min arribo / 4 h zona segura; cable caído 15 min / 90 min / 6 h (PRM-CRM-133, default propuesto; requiere validación legal) |

### 18.1 Plantilla de plataforma ENACOM (RF-CRM-258, HUE-INT-03)

Valores iniciales de la plantilla `enacom.733-2017` (default propuesto de PRM-CRM-135; **requiere validación legal**), todos con `legalValidation.status = pending` ("a validar legalmente"): la cooperativa debe confirmar los plazos vigentes con su asesoría antes de adoptarlos como objetivo regulatorio.

| `templateCode` | Motivo (servicios INT, TV, TEL) | Primera respuesta (constancia con número de reclamo) | Resolución | Calendario |
|---|---|---|---|---|
| `enacom.733-2017.noService` | Falta total de servicio | Inmediata (al registrar) | 3 días hábiles para restablecer | hábil |
| `enacom.733-2017.degraded` | Degradación de calidad o velocidad | Inmediata | 5 días hábiles | hábil |
| `enacom.733-2017.billing` | Facturación (cargo no reconocido, error de importe) | Inmediata | 15 días hábiles para responder | hábil |
| `enacom.733-2017.contract` | Alta, baja o cambio de plan no ejecutado en plazo | Inmediata | 5 días hábiles | hábil |
| `enacom.733-2017.service` | Atención comercial y otros motivos | Inmediata | 15 días hábiles | hábil |

## 19. Migración desde ProCoop

Proceso general, paralelo y conciliación en T07. Ola de carga: O11 (histórico) con cargas previas para el piloto Internet en O3 si el tenant migra con casos abiertos.

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `TICKETS` | `crmCases` (`kind = case`) | Tipo/subtipo/estado mapeados por tabla de equivalencias; `COD_MEDIO` → canal; gravedad → prioridad; fechas a UTC; número conservado en el subdocumento `legacy` (T05 §19.1: `table` = `TICKETS`, `key`, `displayKey` = número visible; antes `legacyNumber`, CTR-DAT-32) | Cantidad por estado base y por tipo igual al origen |
| `TICKETS_ASIGNACIONES` | `crmCaseEvents` (`assigned`) | Usuario mapeado por T07 | Cantidad de asignaciones por caso |
| `TICKETS_NOTAS` | `crmMessages` / `crmWorkLogs` | `INTERNA` → visibilidad; `RECLAMO` → marca; inicio/fin → worklog; `ELIMINADA` → no se migra contenido, solo evento | Suma de minutos por caso |
| `TICKETS_CONTACTOS` | `crmContacts` | Se descartan `FORMA_CONEXION`, `ID_REMOTO`, `CLAVE` (credenciales) | Cantidad de contactos; ningún campo de credencial en destino |
| `TICKETS_ESTADOS`, `TICKETS_TIPOSESTADOS` | `crmStatusSets` | Mapeo a estado base; banderas | Cada estado tiene estado base |
| `TICKETS_TIPOS`, `TICKETS_SUBTIPOS` | `crmCaseTypes`, `crmCaseSubtypes` | `COD_PROD` → producto M02; plantilla → clave T09 | Cantidad |
| `TICKETS_EXTRAS` | `crmCases.extraFields` | Campos libres | Cantidad |
| `TICKETS_MEDIOSATENCION` | `crmChannels` | Mapeo a canal estándar | — |
| `TICKETS_PROYECTO`, `TICKETS_MODULOS` | `crmProjects` | Solo si PA-CRM-12 = A | Cantidad |
| `TICKETS_RESPONSABLES`, `TICKETS_HSBONIF` | `crmAccountAssignments`, `crmHourBanks` | Solo si PA-CRM-12 = A | Saldo de horas |
| `RECLAMOS`, `RUB_REC` | `crmCases` (`kind = complaint`), `crmCaseSubtypes` | Rubro → subtipo; `FAVORABLE`, revisión | Cantidad por rubro/estado |
| `RECLAMOS_HIST`, `RECLAMOS_NOTAS` | `crmCaseEvents` (migrado), `crmMessages` | Marca "migrado" | Cantidad |
| `TECNICA` con transacción de reclamo | `crmCases` + vínculo a OT migrada por M10 | Se crea el caso y se vincula `workOrderId`; la OT la migra M10 | Cada OT de reclamo tiene caso |
| `CLAS_INC`, `PARTIINC` | `crmIncidentClasses`, `crmIncidents.participants` | `ULT_NUM` → contador | Último número |
| `CAT_INCI`, `FALLAS`, `RESOL_OT` | M10 | Reemplazado por M10 | — |
| `RESPONSA_NOTIFICA` | `crmRoutingRules` (guardias) | Canal único → preferencias T09 | Cantidad |
| `PTRAMITES`, `TRAMITES` | `crmProcedureRecords`, `crmProcedureTypes` | Vencimientos recalculados | Vigentes/vencidos iguales |
| `TRAMITES_ACCIONES` | `crmProcedureTypes.actions` | Scripts SQL **no** se migran; se reconstruyen como comandos tipados con validación funcional | Lista de acciones revisada por el tenant |
| `VIAINGTE` | `crmChannels` (vías de ingreso) | Banderas de validación | — |
| `TRANSFER` | M01/M02 (histórico) | El CRM migra solo casos asociados | — |
| `TURNOS`, `TURNOS_HISTORIAL` | `crmQueueTickets`, `crmQueueTicketEvents` | Solo últimos 24 meses para estadísticas (configurable) | Totales por área y mes |
| `TUR_AREAS`, `TUR_AREAS_USERS` | `crmAreas` (con `queue`), asignaciones | Letra, tiempo estimado | — |
| `TUR_BOX`, `TUR_TIPO_BOX`, `TUR_BOX_HISTORIAL` | `crmQueueDesks`, `crmQueueDeskTypes`, `crmQueueDeskSessions` | — | — |
| `ACT_AREAS`, `ACT_TIPOS`, `ACT_FREC`, `ACT_RBR`, `ACTIV`, `ACTIPREV` | `crmAreas`, `crmActivityTypes`, `crmActivityFrequencies`, `crmActivityRubros`, `crmActivities` | Mails extra → usuarios cuando coinciden, si no externos | Cantidad activas |
| `ACTIV_SEG` | `crmActivityOccurrences` | Estado recalculado (en término corregido) | Pendientes iguales |
| `CALENDARIO`, `CALENDARIO_TIPO`, `TIP_EVEN` | `crmCalendarEvents`, `crmCalendarEventTypes` | Por `userId` | Cantidad por usuario |
| `CIRCULAR` | `crmCirculars` | Firmas como referencias | — |
| `AUDIT_IA` | `crmAiSuggestions` (histórico, solo lectura) | Sin contenido personal si el tenant lo pide | — |
| `ADJUNTOS` (tipos de casos, reclamos, tickets) | T11 (archivos) con vínculo al caso | Antivirus y hash | Cantidad y hash |
| `NOTA_SUM` | M01 (notas de cuenta) | Reemplazado por M01 | — |
| `PLANTILLA`, `VARIABLEPLANT`, `PLANTILLA_WSP`, `VARIABLES_PLANTILLA_WSP`, `ENCUESTAS`, `RESPUESTAS`, `MENSAJES`, `AUDIT_MAIL`, `PROMAIL`, `SENDMAIL` | T09 | Reemplazado por T09 | — |
| `CORREOS_INTERNOS`, `MODEMS`, `ENVIOS`, `RESULTADOS` | — | Descartado: credenciales y módems GSM no se migran | — |
| `TABLERO`, `TENDTAB` | T10 | Reemplazado por T10 | — |
| Credenciales en parámetros (2870, 2873, 2874) | — | Descartado; se recargan en bóveda T06 | — |

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-CRM-01 | RN-07 §6; CAT §21; BASE §47 | Los `TICKETS` de ProCoop son la mesa de ayuda del proveedor hacia la cooperativa (soporte del software, horas facturables); la BASE pide casos de atención al socio | Se reutilizan sus reglas (estados base, tomar/pausar, espera del cliente, verificación, vencimientos) para `crmCases`; proyectos y horas quedan como Extensión para servicios TIC (PA-CRM-12); el soporte SaaS del proveedor va a T01 | BASE > RN/CAT |
| CTR-CRM-02 | RN-07 §2; BASE §16, §47 | En ProCoop un reclamo es una OT (`TECNICA` con transacción de reclamo); la BASE pide caso CRM con OT vinculada | El reclamo es un caso CRM; la OT se solicita a M10 y se vincula (`workOrderId`) | BASE > RN |
| CTR-CRM-03 | CAT §10 `RECLAMOS`; RN-07 §2 | `RECLAMOS` casi no se usa en técnica pero sí desde titulares | Se migran ambas fuentes (`RECLAMOS` y `TECNICA` de reclamo) a `crmCases` | CAT/INV (hechos) sin conflicto con BASE |
| CTR-CRM-04 | RN-07 §2 (sin SLA ni prioridad); BASE §16 y DFA M14 mejoras | ProCoop no tiene motor de SLA | Se adopta SLA con políticas, pausa y escalamiento (RF-CRM-103/104) | BASE > RN |
| CTR-CRM-05 | FIC 20; RN-07 §6.1 (IA resume y sugiere acción); BASE §47 CRM-007, AGR-030 | La IA de ProCoop podría aplicar sugerencias; la BASE exige supervisión humana | La IA solo propone; nunca deriva, cierra ni responde sin aprobación (RN-CRM-018) | BASE/AGR > FIC |
| CTR-CRM-06 | BASE §39.5 (estados de ejemplo); CAT `TICKETS_ESTADOS` (4 estados base) | Conjuntos de estados distintos | Estado base unificado de 17 valores (§7) con estados visibles configurables mapeados | BASE > CAT |
| CTR-CRM-07 | DFA M21 "Telefonía y llamadas"; CAT `LLAMADAS`, `TIPOLLAM`, `ENTRANTE`, `RNQCALL` | DFA ubica en atención la tarifación telefónica | Tarifación de llamadas → M10/M04 (servicio de telefonía); calles (`RNQCALL`) → M01/T04; el CRM solo registra llamadas de atención (CTI) | Límite de módulo (maestro) |
| CTR-CRM-08 | DFA M21; CAT `RESULTA`, `ENCUESTAS` | DFA agrupa cuentas de resultados y encuestas en atención | `RESULTA` (cuentas de resultados) → M15; encuestas → T09 | Límite de módulo |
| CTR-CRM-09 | DFA M21; CAT `HISWORK`, `IMP_WORK`, `CORREOSINT` | Historial de trabajo e importación y casillas de correo del servicio TIC en atención | `HISWORK`/`IMP_WORK` → M03; `CORREOSINT` → M02/M10 (servicio TIC) | Límite de módulo |
| CTR-CRM-10 | RN-07 §7 (filtros invertidos) | En ProCoop "en término" y "fuera de término" están invertidos | Se implementa el significado correcto (RN-CRM-078) | Corrección de error documentado |
| CTR-CRM-11 | RN-07 §7.1 (cita por coincidencia de mail) | La cita del calendario se asigna solo si un usuario tiene el mismo mail | Asignación por `userId` (RN-CRM-080) | Corrección |
| CTR-CRM-12 | RN-06 §23.3 (`TRAMITES_ACCIONES` con SQL libre); DEC/T08 seguridad | Scripts SQL ejecutados por configuración | Acciones como comandos tipados a módulos dueños (RN-CRM-060) | DEC > RN |
| CTR-CRM-13 | BASE §25/§43 (ejecución inmediata de ciertas solicitudes); BASE §48 (circuito de solicitud y aprobación) | Inmediatez vs circuito | Rige §48: toda solicitud sigue el circuito configurado; un tipo puede tener aprobación automática por regla | BASE posterior y específica |
| CTR-CRM-14 | BASE §53 CIC-004 (costo de baja); BASE §52.3 (baja sin cargo) | Posibilidad de cobrar la baja | La baja no genera cargo; solo suspensión/reactivación pueden tener cargo validado | BASE §52.3 (norma legal) |
| CTR-CRM-15 | RN-09 67 (turno web requiere 3064) ; BASE §26 (reserva online) | Turno web de ProCoop ligado al código por DNI | Se ofrecen fila virtual y reserva horaria, independientes del código (PA-CRM-13) | BASE > RN-09 |
| CTR-CRM-16 | CAT `TICKETS_CONTACTOS` (`ID_REMOTO`, `CLAVE`); T08 | Credenciales de acceso remoto en contactos | Descartadas; no se modelan ni migran | DEC/T08 > CAT |
| CTR-CRM-17 | RN-09 2005 (mostrar nombre en turnero); privacidad (T08, AGR-023) | Exposición del nombre en pantalla pública | Por defecto se muestra el número; nombre solo si el tenant lo habilita | AGR > RN-09 |
| CTR-CRM-18 | FIC 20 (gpt-4o fijo en código); DEC multi-tenant/T06 | Proveedor de IA fijo | Interfaz `AiProvider` con conexión por tenant/plataforma | DEC > FIC |
| CTR-CRM-19 | CAT `CAT_INCI`, `FALLAS`, `RESOL_OT` (técnica); CRM incidentes | Duplicidad de catálogos | M10 es dueño de categorías, fallas y resoluciones; CRM es dueño de `CLAS_INC`, `PARTIINC` e incidentes comunes | Límite de módulo |
| CTR-CRM-20 | RN-09 2630–2632 (sin uso en código) | Parámetros sin comportamiento | Se convierten en reglas de aviso PRM-CRM-043–045 | BASE §16 (avisos) |
| CTR-CRM-21 | RN-09 3088 (canal único de notificación a responsables) | Canal único vs preferencias | Preferencias por usuario en T09 | AGR > RN-09 |
| CTR-CRM-22 | DFA M21 "Mesa de entradas" (tickets); MER-016 (mesa documental) | Dos significados | Ambos: bandejas de casos y mesa de entradas documental con numeración (PA-CRM-17) | BASE/MER > DFA |
| CTR-CRM-23 | INV frmCirculares (exportaciones regulatorias e IVR) | Circulares mezclan exportaciones regulatorias | Exportaciones regulatorias → M06/T10/M08; IVR saliente → T09; el CRM conserva modelos y corridas | Límite de módulo |
| CTR-CRM-24 | CAT `CIRCUPRO`; CAT `NOTA_SUM` | Circulares a proveedores y notas de cuenta en atención | `CIRCUPRO` → M12 (proveedores); `NOTA_SUM` → M01 (el CRM las muestra en contexto) | Límite de módulo |
| CTR-CRM-25 | RN-07 adicionales (números max+1 sin bloqueo) | Riesgo de números duplicados | Contador atómico por alcance (RN-CRM-014/030) | Corrección |
| CTR-CRM-26 | RN-07 §6.1 (`UnificarContactos` borra) | Pérdida de datos | Fusión con conservación y redirección (RN-CRM-049) | AGR-023 > RN |
| CTR-CRM-27 | RN-07 §6.1 (`GetDesvioFechaVto` con error) | Cálculo erróneo de desvío | Fórmula correcta en REP-CRM-20 | Corrección |
| CTR-CRM-28 | DFA M14 "Carga rápida" (crea OT directa); BASE §47 (supervisión) | Atajo sin supervisión | Carga rápida crea caso y, solo para subtipos técnicos marcados con PRM-CRM-048, solicita OT directa a M10 | BASE > DFA, con excepción configurable |

## 21. Preguntas abiertas

### PA-CRM-01 — Catálogo inicial de tipos, motivos y estados
- **Pregunta:** ¿Cómo se carga el catálogo inicial de tipos, subtipos, motivos y estados de atención de cada tenant?
- **Contexto:** BASE §47 y §16 no enumeran tipos; ProCoop tiene catálogos distintos por cooperativa (`RUB_REC`, `TICKETS_TIPOS`, transacciones de reclamo).
- **Opciones:**
  - A) Precargar un catálogo base de CoopApps por servicio (§18), editable por el tenant y complementado con lo migrado **(Recomendada)** — arranque rápido y comparabilidad de indicadores.
  - B) Migrar solo el catálogo de ProCoop de cada cooperativa — continuidad pero indicadores no comparables.
  - C) Catálogo vacío que configura cada tenant — mayor esfuerzo de implementación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CRM-043, RF-CRM-050, §18, O2.

### PA-CRM-02 — Derivación automática
- **Pregunta:** ¿Se permite que reglas deterministas deriven casos sin pasar por supervisión?
- **Contexto:** BASE §47 exige supervisión; el volumen de reclamos técnicos puede saturarla.
- **Opciones:**
  - A) Supervisión obligatoria; las reglas solo proponen; auto-derivación habilitable por tenant y tipo, apagada por defecto **(Recomendada)** — cumple la BASE y permite escalar.
  - B) Supervisión siempre, sin excepción — más carga operativa.
  - C) Derivación automática por defecto — contradice BASE §47.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-008, RN-CRM-019, PRM-CRM-012, O2.

### PA-CRM-03 — Cálculo del SLA
- **Pregunta:** ¿Con qué calendario y pausas se mide el SLA?
- **Contexto:** No hay SLA en ProCoop ni valores en la BASE.
- **Opciones:**
  - A) Horas hábiles del calendario del tenant; corridas para prioridad crítica; pausa en espera del socio; valores demo de §18 **(Recomendada)**.
  - B) Siempre horas corridas — más simple, penaliza fines de semana.
  - C) Solo días hábiles sin horas — poca granularidad para urgencias.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-103, RF-CRM-104, RN-CRM-052, PRM-CRM-020, O3.

### PA-CRM-04 — Cierre de casos resueltos
- **Pregunta:** ¿Cómo pasa un caso de resuelto a cerrado?
- **Contexto:** BASE §47 deja el circuito de cierre a acordar.
- **Opciones:**
  - A) Cierre automático a los 7 días corridos sin respuesta del socio; el socio puede confirmar antes **(Recomendada)**.
  - B) Solo con confirmación explícita del socio — muchos casos quedarían abiertos.
  - C) Cierre inmediato al resolver — sin oportunidad de objetar.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-CRM-094, PRM-CRM-022, O2.

### PA-CRM-05 — Reapertura
- **Pregunta:** ¿Hasta cuándo se reabre un caso y desde cuándo se crea uno nuevo?
- **Contexto:** La reapertura afecta indicadores y el historial.
- **Opciones:**
  - A) Reabrir el mismo caso dentro de 30 días del cierre; luego caso nuevo vinculado **(Recomendada)**.
  - B) Siempre caso nuevo vinculado.
  - C) Reapertura sin límite.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-021, RN-CRM-054, PRM-CRM-023.

### PA-CRM-06 — Proveedor de WhatsApp
- **Pregunta:** ¿Qué proveedor de WhatsApp Business se usa por defecto?
- **Contexto:** ProCoop usa Trii (BSP); MER-016 pide WhatsApp Business con plantillas; CNX §2.7 menciona Meta Cloud API.
- **Opciones:**
  - A) Interfaz de proveedor con Meta Cloud API por defecto y adaptador Trii para quienes ya lo usan **(Recomendada)** — sin dependencia de un BSP y migración sin corte.
  - B) Solo Trii — continuidad, costo por intermediario.
  - C) Solo Meta Cloud API — obliga a migrar números de cooperativas con Trii.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-172, RF-CRM-173, PRM-CRM-061, O6.
- **Estado:** Respondida (DEC-055): opción A.

### PA-CRM-07 — Verificación de identidad en el bot
- **Pregunta:** ¿Cómo se verifica al socio antes de mostrar información privada por bot?
- **Contexto:** El bot de ProCoop consulta por DNI sin verificación documentada (FIC 13.2); AGR-023 exige protección de datos.
- **Opciones:**
  - A) Teléfono verificado vinculado a la persona y OTP como respaldo **(Recomendada)**.
  - B) DNI + número de cuenta — vulnerable a terceros que conocen los datos.
  - C) Solo derivar a humano para datos privados.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-175, RN-CRM-017, PRM-CRM-060, O6.

### PA-CRM-08 — Horario de atención del bot y humanos
- **Pregunta:** ¿Qué ocurre fuera del horario de atención humana?
- **Contexto:** BASE §47 pendientes (disponibilidad).
- **Opciones:**
  - A) Bot 24×7; humano en horario configurado; fuera de horario se crea caso con plazo informado; urgencias de seguridad derivan al teléfono de guardia **(Recomendada)**.
  - B) Canal cerrado fuera de horario.
  - C) Guardia humana 24×7 — costo operativo.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-176, RF-CRM-122, PRM-CRM-066.

### PA-CRM-09 — Funciones y activación de IA
- **Pregunta:** ¿Qué funciones de IA se habilitan y cuándo?
- **Contexto:** AGR-030 admite IA supervisada; implica tratamiento de datos por terceros.
- **Opciones:**
  - A) Clasificar, resumir y sugerir respuesta en O6; lectura de adjuntos en O10; apagada por defecto hasta que el tenant acepte condiciones; proveedor vía interfaz **(Recomendada)**.
  - B) Todas las funciones desde O6 encendidas por defecto.
  - C) Sin IA en la primera versión.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-200–204, PRM-CRM-070, O6, O10.
- **Estado:** Respondida (DEC-056): opción A.

### PA-CRM-10 — Visibilidad de notas internas
- **Pregunta:** ¿Quién ve las notas internas de un caso?
- **Contexto:** `TICKETS_NOTAS.INTERNA` en ProCoop; casos sensibles (legales, reclamos contra personal).
- **Opciones:**
  - A) Visibles a empleados con acceso al caso; nota restringida opcional que requiere `crm.notasRestringidas.ver` **(Recomendada)**.
  - B) Visibles a todos los empleados del tenant.
  - C) Solo al autor y al supervisor.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-CRM-016, NEG-CRM-03.

### PA-CRM-11 — Límites de adjuntos
- **Pregunta:** ¿Qué tipos y tamaños de adjunto acepta el CRM?
- **Contexto:** Fotos de medidores y documentos desde el celular; costo de almacenamiento.
- **Opciones:**
  - A) jpg, png, heic, webp y pdf; 10 MB por archivo; 10 por mensaje; antivirus **(Recomendada)**.
  - B) Cualquier tipo hasta 25 MB.
  - C) Solo imágenes hasta 5 MB.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-CRM-017, PRM-CRM-018.

### PA-CRM-12 — Horas y proyectos
- **Pregunta:** ¿Se incluye el registro de horas, proyectos y bolsas de horas bonificadas heredado de los tickets?
- **Contexto:** En ProCoop es la facturación del soporte del proveedor (CTR-CRM-01); puede servir a cooperativas con servicios TIC empresariales.
- **Opciones:**
  - A) Registro de horas genérico para todos los casos y bolsa de horas por contrato para servicios TIC empresariales, como Extensión en O10; soporte SaaS en T01 **(Recomendada)**.
  - B) Solo registro de horas sin facturación.
  - C) Descartar horas y proyectos.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-040, RF-CRM-041, RN-CRM-050, PRM-CRM-090–092, O10.

### PA-CRM-13 — Turno online
- **Pregunta:** ¿Qué modalidad de turno remoto se ofrece?
- **Contexto:** ProCoop ofrece turno web ligado al DNI (V2 67/3064); BASE §26 pide turnos.
- **Opciones:**
  - A) Fila virtual y reserva horaria, configurables por área **(Recomendada)**.
  - B) Solo fila virtual.
  - C) Solo reserva horaria.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-151, RF-CRM-152, PRM-CRM-110, O10.

### PA-CRM-14 — Hardware del turnero
- **Pregunta:** ¿Qué hardware requiere el agente local?
- **Contexto:** FIC 19: impresora térmica y turnero serie; las pantallas web no necesitan agente.
- **Opciones:**
  - A) Pantallas y tótem como aplicaciones web sin agente; agente local solo para impresora térmica y dispositivos serie **(Recomendada)**.
  - B) Agente local obligatorio en toda sucursal con turnero.
  - C) Sin soporte de hardware local (QR en pantalla).
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-153, RF-CRM-155, O10.

### PA-CRM-15 — Baja pública
- **Pregunta:** ¿Para qué servicios se habilita la recepción pública de bajas y con qué datos mínimos?
- **Contexto:** Res. 316/2018 obliga para TIC (Internet, TV, telefonía); BASE §57 lo deja pendiente para el resto.
- **Opciones:**
  - A) Habilitada para Internet, TV y telefonía y configurable para otros servicios; datos mínimos nombre, documento, servicio, domicilio o cuenta y contacto; código en 24 h **(Recomendada)**.
  - B) Habilitada para todos los servicios.
  - C) Solo TIC, sin opción para otros.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-066, RN-CRM-008, PRM-CRM-030, PRM-CRM-035, O2.
- **Estado:** Respondida (DEC-057): opción A.

### PA-CRM-16 — Oportunidades y campañas comerciales
- **Pregunta:** ¿El CRM incluye gestión de oportunidades de venta y campañas comerciales?
- **Contexto:** La solución 2 de BASE §105 menciona "comunicaciones y campañas"; no hay requisitos de embudo de ventas.
- **Opciones:**
  - A) Fuera del alcance inicial; campañas comunicacionales en T09; oportunidades como Extensión a relevar **(Recomendada)**.
  - B) Embudo de oportunidades en O10.
  - C) Excluir definitivamente.
- **Impacto si no se responde:** A.
- **Bloquea:** Ninguno en O2–O6.

### PA-CRM-17 — Mesa de entradas documental
- **Pregunta:** ¿Qué alcance tiene la mesa de entradas?
- **Contexto:** MER-016 la pide; DFA M21 la confunde con tickets (CTR-CRM-22).
- **Opciones:**
  - A) Numeración anual ME-AAAA-NNNNN, entradas externas y salidas, pases internos con acuse **(Recomendada)**.
  - B) Solo entradas, sin salidas.
  - C) Expediente administrativo completo con foliatura en T11.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-130–134, O10.

### PA-CRM-18 — Cargo por visita improcedente
- **Pregunta:** ¿Se cobra la visita técnica cuando el reclamo resulta improcedente?
- **Contexto:** `CONEXION.RECLAMO` en ProCoop; impacto en protección del consumidor.
- **Opciones:**
  - A) Habilitable solo con regla aprobada y aviso previo al socio; la ejecuta M10/M05 **(Recomendada)**.
  - B) Nunca se cobra.
  - C) Se cobra siempre que el técnico lo marque.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-117, RN-CRM-091, PRM-CRM-047.

### PA-CRM-19 — Anexo dueño de CU-SOL-01
- **Pregunta:** ¿Qué anexo define CU-SOL-01 (alta de Internet y baja de TV, BASE §48)?
- **Contexto:** M02 lo describe en lo que toca al contrato y este anexo en la solicitud y su circuito de atención; la corrección de inconsistencias pide un único anexo dueño y citas en los demás (pendiente 6 del cierre).
- **Opciones:**
  - A) M09 es dueño (la solicitud es el hilo del caso) y M02 cita su parte de contrato **(Recomendada)**.
  - B) M02 es dueño y M09 cita el tramo de atención.
- **Impacto si no se responde:** A.
- **Bloquea:** §16 de M09 y M02; T12 parte 1 (solicitud de alta); 04-matriz.
- **Estado:** Asumida (DEC-072): opción A. CU-SOL-01 queda definido en §16 de este anexo; M02 ya lo cita (fila «CU-SOL-01 (BASE, parte CAT)»).

### PA-CRM-20 — Residuales de los entregables: referencias, nombres de T05 y estados (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M09 (§7.45), cómo se concilian los campos que T05 nombra distinto y cuáles son el estado inicial y las transiciones de las máquinas que el §8 daba solo en texto?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M09-CRM-atencion.md` §7 y de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-02 y INC-06-08).
- **Opciones**: A) **(Recomendada)** Destinos de §7.45 (T11 `workflowDefinitions`, M10 `incidentCategories`, M05 `invoices`, T09 `campaigns`, T02 `memberships`, autorreferencias), `aiUsageLogId` incorporado y máquinas de §8.14. B) Mantener `[VERIFICAR]` y el texto.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER y diagramas de estados de M09; T05 COL-CRM-02, 04, 09, 10, 11, 12, 16, 17, 19, 23 y 26.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.3, §7.8, §7.12 a §7.14, §7.20, §7.43, §7.44, §7.45 y §8.14. T05 debe reflejar las equivalencias de §7.45 (en especial `crmCaseId` en lugar de `caseId`) y quitar `operationId` de COL-CRM-12 y `documentRequirementTypeIds[]` de COL-CRM-16; en §7.2.1, `externalThreadId` y `targetType` como "no es referencia". Se adopta además el nombre canónico `associateMembershipId` (antes `memberId`) de T05 §7.2.1 en `crmProcedureRecords` y se cierran las referencias restantes de §7.44 (`ownerUserId` → T02 `memberships`, `providerConnectionId` → T06 `integrationConnections`, `printDocumentId` y `labelsDocumentId` → T11 `documents`).


## 22. Trazabilidad de fuentes

### 22.1 BASE funcional

| Fuente | Destino en este anexo |
|---|---|
| BASE §15 (alta con documentación, CU-15) | RF-CRM-015, 060, 063–065, 077–079, 133; CU-15 |
| BASE §16 (incidente común, reclamos, CU-16) | RF-CRM-020, 021, 100–125; CU-16 |
| BASE §26 (tareas, turnos, avisos, CU-26) | RF-CRM-140–158, 220–237; RNF-CRM-006; CU-CRM-21 (antes CU-26; el CU-26 lo define T09) |
| BASE §39.5 (estados seleccionables) | §7 estado base; §8.1; RF-CRM-043; CTR-CRM-06 |
| BASE §41 (límites entre atención, contratos, técnica, facturación) | §2.2, §2.3 |
| BASE §47 CRM-001 | RF-CRM-001, 037 |
| BASE §47 CRM-002 | RF-CRM-002, 171, 182 |
| BASE §47 CRM-003 | RF-CRM-001, 003, 037 |
| BASE §47 CRM-004 | RF-CRM-003 |
| BASE §47 CRM-005 | RF-CRM-005, 200 |
| BASE §47 CRM-006 | RF-CRM-006 |
| BASE §47 CRM-007 | RF-CRM-008, PRM-CRM-013, CTR-CRM-05 |
| BASE §47 CRM-008 | RF-CRM-008, 009 |
| BASE §47 CRM-009 | RF-CRM-009, 011 |
| BASE §47 CRM-010 | RF-CRM-002 |
| BASE §47 flujo y excepciones; pendientes (disponibilidad, cierre) | CU-CRM-01; PA-CRM-04, PA-CRM-08 |
| BASE §48 SOL-001 | RF-CRM-060 |
| BASE §48 SOL-002 | RF-CRM-061 |
| BASE §48 pendientes (bajas parciales) | RF-CRM-075; CU-SOL-01 |
| BASE §52.3 (baja sin cargo, mismo medio, botón de baja, código 24 h) | RF-CRM-066, 067, 079; RN-CRM-007–009; PRM-CRM-030–032, 035; CU-CRM-02; CTR-CRM-14 |
| BASE §53 CIC-001 | RF-CRM-061 |
| BASE §53 CIC-002 | RF-CRM-068 |
| BASE §53 CIC-003 | RF-CRM-069 |
| BASE §53 CIC-004 | RF-CRM-070, 084; RN-CRM-012, 013; PRM-CRM-034; CU-CIC-01 |
| BASE §57 (recepción pública de bajas pendiente) | PA-CRM-15 |
| BASE §58/§63 (revisión ERP/CRM) | §2 límite; resuelto por DEC del maestro (monolito modular) |
| BASE §98, §101, §106 (pendientes generales y benchmark) | MER-012/MER-016 abajo; resto sin requisitos de atención: Descartado (no aplica al módulo) |
| BASE §105 solución 2 "CRM" | Encabezado, §1; PA-CRM-16 (campañas) |
| MER-012 (workflow de aprobación) | RF-CRM-077; RN-CRM-035 |
| MER-016 (WhatsApp, mesa de entradas, canales) | RF-CRM-130–135, 170, 172; PA-CRM-17 |
| ESC-01 | §17.5 |
| ESC-02 | §17.5; RN-CRM-036 |
| ESC-03 | RN-CRM-027; CU-CRM-20; §17.5 |
| ESC-04 | RN-CRM-096; §17.5 |
| ESC-05 | §17.5 |

### 22.2 AGR, DEC y CNX

| Fuente | Destino |
|---|---|
| AGR-002 (CRM no cambia contratos ni deudas) | RF-CRM-078; RN-CRM-001; §2.3; ESC-CRM-03 |
| AGR-003 (offline) | RF-CRM-013; RN-CRM-027 |
| AGR-022 (fórmula, universo, fecha de corte) | §15 |
| AGR-023 (datos personales, retención) | RF-CRM-006; RNF-CRM-005; RN-CRM-028; CTR-CRM-17, 26 |
| AGR-024 (avisos) | RF-CRM-105 |
| AGR-030 (IA supervisada) | RF-CRM-200–206; RN-CRM-018; PRM-CRM-070–074; PA-CRM-09 |
| DEC-001..010 | §7 (Mongo, `tenantId`), §12 (outbox, BullMQ), olas O2–O3 piloto Internet, CTR-CRM-12, 18 |
| CNX §2.3, §2.4, §2.6 (navegación, alcance, roles) | §4; §10 |
| CNX §2.7 (WhatsApp Meta Cloud) | RF-CRM-187; §13; PA-CRM-06 |
| CNX §3.3, §3.7 (patrones de ficha y bandejas) | §10 PAN-CRM-01..08 |
| CNX §4.2 (IA) | RF-CRM-036, 200 |
| CNX §4.4 (Trámites: solicitudes, tipos, estados, workflows) | RF-CRM-043, 060–085 |
| CNX §4.5 (sala de atención) | RF-CRM-052; PAN-CRM-34; §15 |
| CNX §4.6 | RF-CRM-045 |
| CNX §6.2, §6.3 (notificaciones) | RF-CRM-105; §13 |
| CNX §7.7 (encuesta) | RF-CRM-119; PRM-CRM-054 |
| CNX §8 (comunicaciones) | RF-CRM-108; §4 operador de comunicaciones |
| CNX §10 (seguridad de endpoints públicos) | RNF-CRM-003 |

### 22.3 DFA y FIC

| Fuente | Destino |
|---|---|
| DFA M14 §15 "Carga rápida de reclamos" y mejoras (SLA, avisos, conformidad) | RF-CRM-016, 103, 105, 116; RN-CRM-052; PAN-CRM-04; CTR-CRM-28 |
| DFA M21 §22 Mesa de entradas (tickets) | RF-CRM-001–053; CTR-CRM-22 |
| DFA M21 §22 Turnero | RF-CRM-140–158 |
| DFA M21 §22 Comunicaciones (mail, SMS, WhatsApp) | RF-CRM-170–188; T09 |
| DFA M21 §22 Encuestas | RF-CRM-119, 256 → T09 |
| DFA M21 §22 Telefonía y llamadas | CTR-CRM-07 (M10/M04; CTI en RF-CRM-180) |
| DFA M21 §22 Cuentas de resultados, historial de trabajo, correos internos | CTR-CRM-08, 09 |
| DFA M21 mejora "CRM unificado" | RF-CRM-035; §1 |
| DFA M21 mejora turno online | RF-CRM-150–152 |
| DFA M22 §23 Actividades y tareas internas | RF-CRM-220–233 |
| DFA M22 Tablero de control | RF-CRM-234, 237 → T10 |
| FIC 13.2 (WhatsApp/bot) | RF-CRM-172–176; RN-CRM-017, 081; PA-CRM-07 |
| FIC 13.3 (SMS) | RF-CRM-178 |
| FIC 13.4 (IVR) | RF-CRM-180, 181 |
| FIC 19 (agente local, impresora, turnero serie) | RF-CRM-153, 155; PA-CRM-14; §13 |
| FIC 20 (IA, `clsAnalisisNotasTicket`, lectura de adjuntos) | RF-CRM-200–206; CTR-CRM-18 |

### 22.4 Reglas de negocio (RN-06, RN-07, RN-10)

| Fuente | Destino |
|---|---|
| RN-07 §1 (OT: duplicados 90 días, notificar responsables, vía de ingreso) | RN-CRM-029, 058, 084; PRM-CRM-041; RF-CRM-123 |
| RN-07 §1.10 | RF-CRM-022 |
| RN-07 §1.11 (reincidencias, estadísticas, cambios de servicio) | RF-CRM-072, 073, 082; RN-CRM-055, 056; REP-CRM-06, 08 |
| RN-07 §2 (reclamos = OT, numeración, `CONEXION.RECLAMO`, encuesta de conformidad, sin SLA) | RN-CRM-001, 052, 057, 091, 092; CTR-CRM-02, 03, 04 |
| RN-07 §6 (tickets: gravedad, autorizar, tomar, cierre, recuperar, facturación de horas, credenciales) | RN-CRM-031, 035, 036, 040–042, 050; RF-CRM-025, 040, 041; CTR-CRM-01, 16 |
| RN-07 §6.1 (Esprocesable, pausas, espera, reasignación, cancelación, vencimientos, listas, pendientes, desvío, unificar contactos, asignar, avisos) | RN-CRM-025, 032–039, 043–049, 051, 053; PRM-CRM-024–026; CTR-CRM-26, 27 |
| RN-07 §7 (actividades: fechas, parámetro 681, en término invertido) | RN-CRM-072, 077, 078; CTR-CRM-10 |
| RN-07 §7.1 (generar seguimiento, existencia, mails, días de envío, finalización, calendario por mail) | RN-CRM-073–076, 079, 080; CTR-CRM-11 |
| RN-07 §8.9 (plantillas WhatsApp, IVR, teléfono destino) | RF-CRM-173, 181, 184; RN-CRM-023, 083 |
| RN-07 reglas adicionales (numeración, validaciones web) | RN-CRM-014, 030, 086; CTR-CRM-25 |
| RN-07 §9 (parámetros) | §14 |
| RN-07 §10 implicancias 1, 6, 7, 12, 13, 14, 15 | RF-CRM-103, 104, 107, 108, 114; RN-CRM-052 |
| RN-07 §11 dudas 3, 5, 6, 13 | RN-CRM-086; PA-CRM-03, 18; CTR-CRM-03 |
| RN-06 §4.3 | RF-CRM-085 |
| RN-06 §5 (baja de socio con servicios) | RN-CRM-010 |
| RN-06 §23.1 (incidentes, trámites, adjuntos) | RF-CRM-080, 113; RN-CRM-022, 089 |
| RN-06 §23.3 (trámites presentados, acciones SQL) | RN-CRM-002, 059, 060; CTR-CRM-12 |
| RN-10 §5 (SMS, WhatsApp oficial) | RF-CRM-178, 185; RN-CRM-082 |
| RN-10 §16.1 (turnero) | RN-CRM-061–071; RF-CRM-140–158; RNF-CRM-004 |
| RN-10 §16.2 (adjuntos) | RN-CRM-028, 089 |

### 22.5 Parámetros V2 (RN-09)

| Parámetro V2 | Destino |
|---|---|
| 51 | PRM-CRM-046 (consumo); dueño M10 |
| 58 | PRM-CRM-048 |
| 67 | PRM-CRM-112 |
| 210 | Reemplazado por M11 |
| 333, 2629 | PRM-CRM-005, 006 |
| 344, 2998, 3031 | PRM-CRM-001, 002, 003 |
| 518, 519 | Descartado (identificación del cliente ProCoop en gateway) |
| 681 | PRM-CRM-120 |
| 911 | Reemplazado por M19/M05 |
| 2005, 3064 | PRM-CRM-100, 101; CTR-CRM-17 |
| 2006 | PRM-CRM-102 |
| 2007 | PRM-CRM-114 |
| 2014 | PRM-CRM-105 |
| 2209 | PRM-CRM-103 |
| 2240 | PRM-CRM-104 |
| 2478, 2479 | PRM-CRM-053, 056 |
| 2480, 3084 | Reemplazado por M10 |
| 2488 | PRM-CRM-091 |
| 2509 | PRM-CRM-085 |
| 2630, 2631, 2632 | PRM-CRM-043, 044, 045; CTR-CRM-20 |
| 2693, 2696 | Reemplazado por T09/T06 |
| 2700 | PRM-CRM-106 |
| 2824, 3051, 3121 | Reemplazado por T09 (resolución de contacto); RN-CRM-083 |
| 2870, 2873, 2874 | Descartado como parámetro; credenciales en bóveda T06 |
| 2872 | PRM-CRM-062 |
| 3072 | Descartado (estética, design system T03) |
| 3088 | Reemplazado por T09; CTR-CRM-21 |
| 3089 | PRM-CRM-113 |
| 3105 | PRM-CRM-061 |
| 3120 | PRM-CRM-130 |
| 3173 | PRM-CRM-131 |

### 22.6 Catálogo de tablas (CAT)

| Tabla | Destino |
|---|---|
| §1 `PTRAMITES` | `crmProcedureRecords`; RF-CRM-080 |
| §1 `TRAMITES` | `crmProcedureTypes`; RF-CRM-080 |
| §1 `TRAMITES_ACCIONES` | `crmProcedureTypes.actions`; RN-CRM-060; CTR-CRM-12 |
| §1 `VIAINGTE` | `crmChannels`; RF-CRM-005; RN-CRM-058 |
| §1 `TRANSFER` | RF-CRM-071 (dueño M01/M02) |
| §1 `NOTA_SUM` | Reemplazado por M01; RN-CRM-097 |
| §10 `RECLAMOS`, `RUB_REC` | `crmCases`, `crmCaseSubtypes`; RF-CRM-115 |
| §10 `RECLAMOS_HIST`, `RECLAMOS_NOTAS` | `crmCaseEvents`, `crmMessages`; RF-CRM-125 |
| §10 `CAT_INCI`, `FALLAS`, `RESOL_OT` | Reemplazado por M10; RF-CRM-111; CTR-CRM-19 |
| §10 `CLAS_INC` | `crmIncidentClasses`; RF-CRM-111 |
| §10 `PARTIINC` | `crmIncidents.participants`; RF-CRM-112 |
| §10 `RESPONSA_NOTIFICA` | `crmRoutingRules`; RF-CRM-123; PRM-CRM-042 |
| §10 `TECNICA` (reclamos), `TECNICA_EXTRAS` (OCEBA, daños) | Vínculo `workOrderId`; PRM-CRM-130; dueño M10 |
| §10 `RESPONSA`, `PARTICUA`, `PARTIORD`, `FACTIBIL`, `EXPEDIENTES_TRAM`, `TECNICA_NECESIDAD` | Reemplazado por M10/M18 (el CRM consume) |
| §10 `ENTRANTE`, `LLAMADAS`, `TIPOLLAM`, `BANCLA`, `BANDAS`, `GRATIS`, `INTERNAC`, `LLA_CEL`, `RECHAZOS`, `TEL_FRACCIONES`, `TEL_GRUPOS_REPARTIDOR`, `TEL_REPARTIDOR` | Reemplazado por M10/M04 (telefonía); CTR-CRM-07 |
| §10 `CORREOSINT` | Reemplazado por M02/M10; CTR-CRM-09 |
| §21 `TICKETS` | `crmCases`; RF-CRM-001–053 |
| §21 `TICKETS_ASIGNACIONES` | `crmCaseEvents`; RF-CRM-010 |
| §21 `TICKETS_CONTACTOS` | `crmContacts`; RF-CRM-025; CTR-CRM-16 |
| §21 `TICKETS_ESTADOS` | `crmStatusSets`; RF-CRM-043; RN-CRM-032 |
| §21 `TICKETS_EXTRAS` | `crmCases.extraFields`; RF-CRM-051 |
| §21 `TICKETS_HSBONIF` | `crmHourBanks`; RF-CRM-041 |
| §21 `TICKETS_MEDIOSATENCION` | `crmChannels`; RF-CRM-170 |
| §21 `TICKETS_MODULOS` | `crmProjects.components`; RF-CRM-040 |
| §21 `TICKETS_NOTAS` | `crmMessages`, `crmWorkLogs`; RF-CRM-041; RN-CRM-016 |
| §21 `TICKETS_PROYECTO` | `crmProjects`; RF-CRM-040 |
| §21 `TICKETS_RESPONSABLES` | `crmAccountAssignments`; RF-CRM-041 |
| §21 `TICKETS_SUBTIPOS` | `crmCaseSubtypes`; RN-CRM-040 |
| §21 `TICKETS_TIPOS` | `crmCaseTypes` |
| §21 `TICKETS_TIPOSESTADOS` | `crmStatusSets`; RF-CRM-043 |
| §22 `TURNOS` | `crmQueueTickets`; RN-CRM-061 |
| §22 `TURNOS_HISTORIAL` | `crmQueueTicketEvents`; RF-CRM-157 |
| §22 `TUR_AREAS` | `crmAreas`; RF-CRM-141 |
| §22 `TUR_AREAS_USERS` | Asignaciones de área; RF-CRM-142 |
| §22 `TUR_BOX` | `crmQueueDesks`; RF-CRM-143 |
| §22 `TUR_BOX_HISTORIAL` | `crmQueueDeskSessions`; RF-CRM-143 |
| §22 `TUR_TIPO_BOX` | `crmQueueDeskTypes`; RF-CRM-143 |
| §23 `ACTIPREV` | `crmActivities.previous`; RF-CRM-232 |
| §23 `ACTIV` | `crmActivities`; RF-CRM-224 |
| §23 `ACTIV_SEG` | `crmActivityOccurrences`; RF-CRM-229 |
| §23 `ACT_AREAS` | `crmAreas`; RF-CRM-220 |
| §23 `ACT_FREC` | `crmActivityFrequencies`; RF-CRM-222 |
| §23 `ACT_RBR` | `crmActivityRubros`; RF-CRM-223 |
| §23 `ACT_TIPOS` | `crmActivityTypes`; RF-CRM-221 |
| §23 `CALENDARIO` | `crmCalendarEvents`; RF-CRM-226, 235 |
| §23 `CALENDARIO_TIPO` | `crmCalendarEventTypes`; RF-CRM-235 |
| §23 `TIP_EVEN` | `crmCalendarEventTypes`; RF-CRM-235 |
| §31 `PLANTILLA`, `VARIABLEPLANT` | Reemplazado por T09; RF-CRM-255 |
| §31 `PLANTILLA_WSP`, `VARIABLES_PLANTILLA_WSP` | Reemplazado por T09; RF-CRM-173 |
| §31 `MENSAJES`, `ENVIOS`, `MODEMS`, `RESULTADOS` | Reemplazado por T09 (MODEMS descartado); RF-CRM-178 |
| §31 `IVR` | Reemplazado por T09; RF-CRM-181 |
| §31 `ENCUESTAS`, `RESPUESTAS` | Reemplazado por T09; RF-CRM-119, 256; RN-CRM-093 |
| §31 `AUDIT_MAIL`, `PROMAIL`, `SENDMAIL`, `CORREOS_INTERNOS` | Reemplazado por T09/T06 (credenciales descartadas) |
| §31 `CIRCUPRO` | Reemplazado por M12; CTR-CRM-24 |
| §31 `NOTI_COOP`, `TELEFON` | Reemplazado por T09 (novedades) y T04 (agenda); Descartado en CRM |
| `CIRCULAR` | `crmCirculars`; RF-CRM-250 |
| `TABLERO`, `TENDTAB`, `TIPO_TAB` | Reemplazado por T10; RF-CRM-234 |
| `AUDIT_IA` | `crmAiSuggestions`; RF-CRM-206 |
| `ADJUNTOS` | T11 con vínculo al caso; RN-CRM-028, 089 |

### 22.7 Formularios ProCoop (INV)

| Formulario | Destino |
|---|---|
| `ProMod_Titulares` frmCirculares | RF-CRM-250–254; PAN-CRM-32; CTR-CRM-23 |
| `ProMod_Titulares` frmConsultaIncidentes | RF-CRM-113; PAN-CRM-07 |
| `ProMod_Titulares` frmNota_Reclamo | RF-CRM-125; PAN-CRM-03 |
| `ProMod_Titulares` frmPTramites | RF-CRM-080; PAN-CRM-21 |
| `ProMod_Titulares` frmReclamosHist | RF-CRM-125; PAN-CRM-03 |
| `ProMod_Titulares` frmTramite | RF-CRM-080, 085 |
| `ProMod_Titulares` frmTramiteCambioSevicio | RF-CRM-072; PAN-CRM-03 |
| `ProMod_Tecnica` frmCargaRapidaReclamo | RF-CRM-116; PAN-CRM-04 |
| `Configuracion` frmParam_SMS | RF-CRM-178; PAN-CRM-16 |
| `Configuracion` frmPlantillaEditor | RF-CRM-255 (Reemplazado por T09) |
| `Configuracion` frmDatosTicketsSimple | PAN-CRM-02 |
| `Configuracion` frmPTramites | PAN-CRM-21 |
| `Configuracion` frmEnvioWhatsApp, frmEnvioWhatsAppTrii | RF-CRM-185; PAN-CRM-10 |
| `Configuracion` frmEnviar_SMS | RF-CRM-178; PAN-CRM-10 |
| `ProcoopNet` frmEncuestas | RF-CRM-256 (Reemplazado por T09) |

### 22.8 Huecos de cobertura corregidos

| Hueco | Destino en este anexo |
|---|---|
| HUE-INT-03 Plazos ENACOM por motivo | RF-CRM-258; `crmSlaPolicies.templateCode`, `legalValidation`; PRM-CRM-132, PRM-CRM-135 (default propuesto, requiere validación legal); PAN-CRM-14; §18.1 |
| HUE-CLO-03 Reclamos de cloacas | RF-CRM-259; `crmCaseSubtypes.claimTypeKey`, `externalDerivation`; PRM-CRM-134; §18 |
| HUE-ALU-03 Reclamos de alumbrado | RF-CRM-259; PRM-CRM-134; §18 |
| HUE-GAS-05 SLA de reclamo de seguridad | RF-CRM-122 (precisión), RF-CRM-260; `crmSlaPolicies.continuous`; PRM-CRM-133 (default propuesto, requiere validación legal); §18 |

### 22.9 Decisiones y modelo de datos

| Fuente | Destino en este anexo |
|---|---|
| DEC-011 Momento de creación del contrato | RF-CRM-060 |
| DEC-055 Proveedor de WhatsApp | PA-CRM-06 (Respondida) |
| DEC-056 IA en atención | PA-CRM-09 (Respondida) |
| DEC-057 Botón de baja | RF-CRM-066; PA-CRM-15 (Respondida) |
| DEC-099 Personas migradas sin documento (contraste NucleoTransversal, aporte A7) | RF-CRM-261; §7.6 `crmCaseTypes.requestAction = identityDocumentRegularization`; §11.5 `crm.openCase` (invocante M01); §12.2 consumo de EVT-PER-27; §18 tipo de sistema precargado |
| T05 CTR-DAT-30 (§7.2) | `crmCaseId` en lugar de `caseId` en las colecciones del módulo; `contractId` en lugar de `serviceContractId`; `servicePointId` en lugar de `supplyPointId` |
| T03 §10.9.12 (RF-UXD-179) | `crmCaseSubtypes.claimTypeKey`; RF-CRM-259; §18 |
