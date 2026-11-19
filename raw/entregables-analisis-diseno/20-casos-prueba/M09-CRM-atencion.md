# Casos de prueba de aceptación — M09 CRM — CRM y atención (solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot, IA, actividades internas)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M09-CRM-atencion.md`](../../especificacion/anexos/M09-CRM-atencion.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 193 CP de requisitos funcionales, 30 CP de escenarios ESC y 25 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M09 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Expediente, bandejas y tickets (M09 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0001 | RF-CRM-001; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Crear casos con número de seguimiento único por tenant, visible al socio y al personal. | Al crear se devuelve el número; dos tenants pueden tener el mismo número sin colisión; el número nunca se reutiliza. |
| CP-CRM-0002 | RF-CRM-002; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Admitir tipos de gestión ampliables: solicitud comercial, reclamo técnico, reclamo comercial/de facturación, consulta, pedido, mesa de entradas, sugerencia/felicitación y otros que configure el tenant. | El tenant crea un tipo nuevo sin despliegue; los casos existentes conservan su tipo histórico. |
| CP-CRM-0003 | RF-CRM-003; M09 §5.1; PRO-O2-11 | O2 | Núcleo | seguridad | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Vincular el caso con persona, cuenta, servicio contratado, contrato/suministro, inmueble y comprobante cuando corresponda, validando la pertenencia. | Un socio no puede elegir una cuenta que no tiene autorizada (403); el agente ve la advertencia si la cuenta no pertenece a la persona. |
| CP-CRM-0004 | RF-CRM-004; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Registrar solicitudes de servicios aún no contratados con el servicio solicitado, sin inventar cuenta ni contrato; vincular el contrato cuando M02 lo cree. | El caso guarda `requestedServiceId` sin `contractId`; al recibir `cat.contract.requested` (EVT-CAT-06) con la correlación, el caso queda vinculado. |
| CP-CRM-0005 | RF-CRM-005; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Registrar canal de origen y vía de ingreso de cada caso; vía por defecto configurable y opcionalmente obligatoria; validar celular/email según la vía. | Sin vía, si es obligatoria, el alta falla con error de validación; la vía que exige validar celular solicita OTP. |
| CP-CRM-0006 | RF-CRM-006; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Adjuntar fotografías y documentos al caso desde cualquier canal, con almacenamiento privado, versión y control de acceso (T11). | La URL de descarga es firmada y expira; revocar acceso invalida enlaces previos; no se sustituye un adjunto: se agrega versión. |
| CP-CRM-0007 | RF-CRM-007; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Conservar la conversación del caso distinguiendo mensajes visibles al socio y notas internas. | El socio nunca recibe una nota interna por ningún endpoint ni notificación. |
| CP-CRM-0008 | RF-CRM-008; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Bandeja de supervisión por tenant con filtros por servicio, tipo, subtipo, estado, área, prioridad, antigüedad, responsable, canal, SLA y vistas de "sin clasificar" y "sin derivación". | Todo caso nuevo aparece en la vista "sin derivación" hasta ser derivado; los filtros se combinan y se guardan como vista. |
| CP-CRM-0009 | RF-CRM-009; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Derivar el caso a un área con motivo; al cambiar de área se conserva el mismo expediente e historial. | Tras dos derivaciones el número y el historial son los mismos y el timeline muestra ambas. |
| CP-CRM-0010 | RF-CRM-010; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Asignar y reasignar responsable dentro del área, con historial de asignaciones y aviso al asignado. | Cada asignación queda en `crmCaseEvents` con quién asignó, a quién y cuándo; el asignado recibe aviso in-app/push. |
| CP-CRM-0011 | RF-CRM-011; M09 §5.1; PRO-O2-11 | O2 | Núcleo | seguridad | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Bandeja del área y bandeja personal con el contexto completo del caso según permisos. | Un empleado ve solo casos de sus áreas o asignados; intentar abrir otro devuelve 404. |
| CP-CRM-0012 | RF-CRM-012; M09 §5.1; PRO-O2-11 | O2 | Estándar | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Devolver el caso a supervisión o rechazar la derivación con motivo. | El caso vuelve a "sin derivación" con el motivo registrado. |
| CP-CRM-0013 | RF-CRM-013; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Mantener historial completo e inmutable de atención: estados, derivaciones, asignaciones, cambios de clasificación, mensajes, comandos, SLA, sugerencias de IA. | No existe endpoint de edición/borrado de eventos; la reconstrucción del caso a una fecha es posible. |
| CP-CRM-0014 | RF-CRM-014; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Vincular el caso con órdenes de trabajo, contratos, comprobantes, pagos, presupuestos, incidentes y otros casos. | Desde el caso se navega a cada entidad vinculada con permisos del módulo dueño. |
| CP-CRM-0015 | RF-CRM-015; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Solicitar datos o documentación faltante, con lista de faltantes, plazo y recordatorio; mantener el caso pendiente y explicado. | El socio ve qué falta; al completar, el caso vuelve a revisión; si vence el plazo, se aplica la política del tipo (recordar o cancelar por desistimiento con aviso). |
| CP-CRM-0016 | RF-CRM-016; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Informar al solicitante el estado del caso y avisarle cada cambio de estado configurado como notificable, por el canal preferido (T09). | Cada transición marcada `notifyCustomer` genera una comunicación T09 con resultado de entrega visible en el caso. |
| CP-CRM-0017 | RF-CRM-017; M09 §5.1; PRO-O3-12 | O3 | Núcleo | regla | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Controlar vencimientos del caso (fecha compromiso) y del SLA. | Los casos vencidos aparecen en la vista "vencidos" y generan alerta. |
| CP-CRM-0018 | RF-CRM-018; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con `enacom.733-2017.noService`: Falta total de servicio Inmediata (al registrar) 3 días hábiles para restablecer hábil | Registrar resolución, resultado real de las acciones y conformidad del socio. | No se puede pasar a "resuelto" sin texto de solución y código de resolución. |
| CP-CRM-0019 | RF-CRM-019; M09 §5.1; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano | Medir tiempos de atención: primera respuesta, tiempo en cada estado, tiempo en cada área, tiempo total, tiempo pausado. | El reporte de tiempos coincide con la suma de intervalos del historial. |
| CP-CRM-0020 | RF-CRM-020; M09 §5.1; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Detectar y asociar casos duplicados; fusionar conservando ambos historiales. | Al crear un caso con misma cuenta+servicio+subtipo abierto en la ventana, se propone el vínculo; fusionar deja el secundario "fusionado" apuntando al principal. |
| CP-CRM-0021 | RF-CRM-021; M09 §5.1; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Reabrir casos resueltos o cerrados con motivo, dentro de la ventana configurada. | La reapertura conserva número y suma un ciclo; fuera de ventana se crea caso nuevo vinculado. |
| CP-CRM-0022 | RF-CRM-022; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Identificar recurrencias y reincidencias por cuenta, cuenta+servicio y cuenta+servicio+tipo. | El informe devuelve grupos con más de un caso en el período. |
| CP-CRM-0023 | RF-CRM-023; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Clasificar por prestación (servicio), motivo, prioridad y ubicación (domicilio, zona, localidad, nodo de red). | Los cuatro ejes son filtrables en bandejas y reportes. |
| CP-CRM-0024 | RF-CRM-024; M09 §5.1; PRO-O2-11 | O2 | Núcleo | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Prioridad/gravedad con niveles Sin asignar, Crítica, Alta, Normal, Baja, Muy baja y su orden numérico. | La bandeja ordena por prioridad y vencimiento; la prioridad inicial sale del subtipo y es corregible por supervisor. |
| CP-CRM-0025 | RF-CRM-025; M09 §5.1; PRO-O2-11 | O2 | Estándar | migración | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Contactos del caso distintos del titular (nombre, teléfono, celular, email, observación, vínculo), sin datos de acceso remoto ni contraseñas. | El modelo no tiene campos de credenciales; la migración los descarta. |
| CP-CRM-0026 | RF-CRM-026; M09 §5.1; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Unificar contactos duplicados conservando el más antiguo, reapuntando casos y auditando. | Tras unificar, los casos apuntan al contacto conservado y el otro queda marcado `mergedInto`. |
| CP-CRM-0027 | RF-CRM-027; M09 §5.1; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Cola personal ordenable: el empleado reordena sus casos (al primer lugar o intercambio con el vecino). | El orden persiste por usuario y no altera el de otros. |
| CP-CRM-0028 | RF-CRM-028; M09 §5.1; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. | Tomar un segundo caso exige pausar o soltar el primero; el tiempo tomado se registra como worklog. |
| CP-CRM-0029 | RF-CRM-029; M09 §5.1; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Alternar "en espera del socio" con su efecto sobre el SLA. | En espera, el reloj SLA se pausa si la política lo indica; al responder el socio, vuelve a "en tratamiento". |
| CP-CRM-0030 | RF-CRM-030; M09 §5.1; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con `enacom.733-2017.noService`: Falta total de servicio Inmediata (al registrar) 3 días hábiles para restablecer hábil | Listados agrupados por vencimiento: Vencidos, Hoy, Mañana, Próximos 7 días, Futuro, Sin fecha. | Los grupos suman el total de la bandeja. |
| CP-CRM-0031 | RF-CRM-031; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Cierre con tipo de cierre (Conforme, Conforme con observaciones, Sin solución, Improcedente), causa obligatoria si el subtipo la exige, bloqueo de cierre por subtipo, nota de cierre, validación interna y validación del socio. | Un subtipo con bloqueo impide cerrar hasta liberar; sin causa, cuando se exige, el cierre falla. |
| CP-CRM-0032 | RF-CRM-032; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Recuperar casos cerrados o cancelados dejando nota; desde cancelado vuelve al último estado previo no final. | La recuperación queda en el historial con la nota y respeta la ventana de reapertura. |
| CP-CRM-0033 | RF-CRM-033; M09 §5.1; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Notas internas automáticas al cambiar vencimiento, prioridad o subtipo; aviso de reprogramación al contacto cuando cambia la fecha compromiso. | Cada cambio genera nota automática; el aviso al contacto se envía si tiene canal y no optó por no recibirlo. |
| CP-CRM-0034 | RF-CRM-034; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. | Al cancelar con presupuesto vinculado se pide la decisión y se emite el comando a M11. |
| CP-CRM-0035 | RF-CRM-035; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Vista 360 del socio con historial unificado de interacciones, casos, turnos, comunicaciones y encuestas, ligada a persona, cuenta y servicio. | Desde la ficha de la persona o cuenta se ve el timeline completo con filtros por canal y servicio. |
| CP-CRM-0036 | RF-CRM-036; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" | Búsqueda global por número de caso, persona, documento, cuenta, teléfono, email, número de expediente de mesa de entradas. | La búsqueda respeta alcance; un teléfono devuelve las personas vinculadas. |
| CP-CRM-0037 | RF-CRM-037; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). | El socio solo ve casos de sus cuentas o creados por él. |
| CP-CRM-0038 | RF-CRM-038; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Denegar el acceso si la cuenta elegida no pertenece al socio; si no sabe identificarla, pedir aclaración sin bloquear la recepción. | Se crea el caso con "cuenta a identificar" y queda en supervisión. |
| CP-CRM-0039 | RF-CRM-039; M09 §5.1; PRO-O2-11 | O2 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Numeración configurable: continua por tenant, por servicio y año, por tipo, o por reclamo/no reclamo; formato con prefijo. | Cambiar la política aplica a casos nuevos; los números emitidos no cambian; numeración atómica sin colisiones. |
| CP-CRM-0040 | RF-CRM-040; M09 §5.1; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Proyectos que agrupan casos, con componentes/módulos afectados. | Un caso puede pertenecer a un proyecto y declarar componente; el proyecto muestra avance. |
| CP-CRM-0041 | RF-CRM-041; M09 §5.1; PRO-O10-12 | O10 | Estándar | integración | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). | La suma de worklogs coincide con minutos reales; descuento de bolsa antes de facturar; la facturación se pide por comando con `Idempotency-Key`. |
| CP-CRM-0042 | RF-CRM-042; M09 §5.1; PRO-O6-10 | O6 | Estándar | regla | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Vincular un presupuesto (M11) al caso y derivar la fecha compromiso del presupuesto. | Con presupuesto aceptado, vencimiento = hoy + (fecha de entrega − fecha de validez) días, 30 por defecto; si no, la fecha de validez. |
| CP-CRM-0043 | RF-CRM-043; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo, pausa SLA… | No se puede guardar un conjunto sin un estado por cada estado base obligatorio; las transiciones se validan contra T11. |
| CP-CRM-0044 | RF-CRM-044; M09 §5.1; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles | Paso opcional de verificación por un usuario distinto del resolutor antes del cierre. | Si el estado destino es de verificación, se exige verificador distinto y se fija fecha estimada (2 días hábiles por defecto). |
| CP-CRM-0045 | RF-CRM-045; M09 §5.1; PRO-O2-11 | O2 | Estándar | seguridad | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Exportar bandejas a XLSX/CSV/PDF según capability. | La exportación respeta filtros y alcance y queda auditada. |
| CP-CRM-0046 | RF-CRM-046; M09 §5.1; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Acciones masivas sobre selección: derivar, asignar, cambiar prioridad, vincular a incidente, cerrar en lote con el mismo texto de solución. | Cada caso del lote valida sus reglas; los rechazados se informan sin abortar el lote. |
| CP-CRM-0047 | RF-CRM-047; M09 §5.1; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Crear casos por comando desde otros módulos (M03 observación de lectura del socio, M05 reclamo de factura desde la ficha, M08 gestión de mora, M10 visita fallida que requiere contacto, M19 portal). | El caso guarda `origin.module` y la referencia de origen. |
| CP-CRM-0048 | RF-CRM-048; M09 §5.1; PRO-O2-11 | O2 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Aviso a usuarios internos de casos nuevos en sus bandejas (in-app/push), sin sondeo. | Un caso derivado a un área notifica a sus miembros en línea en menos de 10 s. |
| CP-CRM-0049 | RF-CRM-049; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Respuestas rápidas con variables por tipo/subtipo/canal. | Insertar una respuesta reemplaza variables del caso; queda editable antes de enviar. |
| CP-CRM-0050 | RF-CRM-050; M09 §5.1; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Etiquetas libres por tenant para casos. | Se filtra por etiqueta en bandejas. |
| CP-CRM-0051 | RF-CRM-051; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Campos adicionales por tipo de gestión (descripción ampliada, ruta de acceso, datos técnicos). | El tipo define campos tipados validados con Zod en alta. |
| CP-CRM-0052 | RF-CRM-052; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Tablero operativo del supervisor en tiempo real: casos por estado, SLA en riesgo y vencidos, carga por área y responsable, colas de conversaciones y turnos. | El tablero se actualiza sin recargar y cada número abre la bandeja filtrada. |
| CP-CRM-0053 | RF-CRM-053; M09 §5.1; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles | Indicadores "sin intervención" de 7 días y de 8 o más días por usuario. | El informe separa ambos grupos. |
### 1.2 Solicitudes comerciales (M09 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0060 | RF-CRM-060; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con `enacom.733-2017.contract`: Alta, baja o cambio de plan no ejecutado en plazo Inmediata 5 días hábiles hábil | Solicitar el alta de cualquiera de los servicios brindados por el tenant, con requisitos específicos por prestación. Al **admitir** la solicitud (requisitos obligatorios completos), M09 envía el comando a M02, que crea el contrato en… | El formulario ofrece solo servicios habilitados en el catálogo del tenant (M02) y pide los requisitos del tipo; una solicitud en "pendiente de datos" no tiene contrato y al admitirla el caso recibe `cat.contract.requested` (EVT-CAT-06). |
| CP-CRM-0061 | RF-CRM-061; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Solicitar la baja de cualquiera de los servicios contratados, identificando servicio y contrato. | El socio elige un contrato propio activo o suspendido; se genera constancia. |
| CP-CRM-0062 | RF-CRM-062; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Consultar servicios disponibles y contratados antes de solicitar. | La consulta combina catálogo (M02) y contratos del socio (M02/M01). |
| CP-CRM-0063 | RF-CRM-063; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Requisitos por prestación y tipo de solicitud: datos obligatorios, documentación, factibilidad, aceptación de condiciones, firma. | Sin un requisito obligatorio la solicitud queda en "pendiente de datos" y no avanza a evaluación. |
| CP-CRM-0064 | RF-CRM-064; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Conservar fecha solicitada y fecha efectiva, sin presumir que coinciden. | La fecha efectiva solo se completa con el evento del módulo ejecutor. |
| CP-CRM-0065 | RF-CRM-065; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Solicitar no equivale a ejecutar: cada efecto se pide por comando tipado al módulo dueño y el caso refleja su resultado. | Cerrar un caso con comando pendiente exige decisión explícita; ningún endpoint CRM modifica contratos ni deuda. |
| CP-CRM-0066 | RF-CRM-066; M09 §5.2; PRO-O2-12 | O2 | Núcleo | regla | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía; configurable en… | El formulario público crea el caso y emite el código en el acto; un job garantiza el envío en ≤ 24 h y alerta si falla. |
| CP-CRM-0067 | RF-CRM-067; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | La baja no genera cargo por solicitarla y no se supedita a pagar deuda, registrarse ni aceptar cargos. | El flujo de baja no tiene paso de pago; la deuda se informa sin bloquear. |
| CP-CRM-0068 | RF-CRM-068; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Solicitud de suspensión temporal con duración, motivo, fecha solicitada y condiciones habilitadas del contrato. | Solo se ofrecen modalidades habilitadas para el servicio; se registra la aceptación de condiciones. |
| CP-CRM-0069 | RF-CRM-069; M09 §5.2; PRO-O6-10 | O6 | Estándar | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Solicitud de reactivación con verificación de estado, reglas y necesidad de intervención técnica. | El caso no informa "reactivado" hasta recibir el evento de M02/M08. |
| CP-CRM-0070 | RF-CRM-070; M09 §5.2; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con SLA de seguridad (RF-CRM-260): Plantilla `safety.emergency`, corrido 24×7: fuga u olor a gas 10 min aceptación / 60 min arribo / 4 h zona segura; cable caído 15 min / 90 min / 6 h… | Modalidades con y sin costo solo si están habilitadas y validadas para el servicio y jurisdicción, con aceptación de condiciones conservada. | Una regla de costo sin marca de validación no se ofrece en producción. |
| CP-CRM-0071 | RF-CRM-071; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Solicitud de cambio de titular (transferencia del servicio o de la cuenta) con documentación y conformidad de ambas partes. | Se emite comando a M01/M02; el caso muestra la fecha efectiva de la transferencia. |
| CP-CRM-0072 | RF-CRM-072; M09 §5.2; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Solicitud de cambio de plan o categoría, con cotización informativa y proporcional calculado por M04/M05. | La cotización se muestra antes de confirmar; el cambio lo ejecuta M02. |
| CP-CRM-0073 | RF-CRM-073; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Solicitud de traslado/cambio de domicilio del servicio, con nuevo domicilio y factibilidad cuando corresponda. | Se solicita OT de traslado a M10 y actualización de domicilio a M01 al ejecutarse. |
| CP-CRM-0074 | RF-CRM-074; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Otras solicitudes tipificadas: cambio de medidor o equipo, reconexión, factibilidad, adhesión a factura digital, adhesión a débito automático, actualización de datos de contacto, alta de equipamiento adicional, baja de asociado (sin… | Cada tipo declara el comando destino; la baja de asociado se deriva a M17 sin baja automática de servicios ni viceversa. |
| CP-CRM-0075 | RF-CRM-075; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Bajas parciales: un servicio entre varios, o un componente/adicional del servicio. | La baja parcial identifica el componente y no afecta los demás. |
| CP-CRM-0076 | RF-CRM-076; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Desistimiento o cancelación antes de ejecutar, con efectos según avance (cancelar comandos pendientes, no exigir retiro de equipos no instalados). | Cancelar con OT en curso pide cancelar la OT a M10 y, si M10 reporta intervención ejecutada, el caso queda "en conflicto" para supervisión. |
| CP-CRM-0077 | RF-CRM-077; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Evaluación y aprobación mediante workflow de autorizaciones (T11) cuando el tipo lo requiera, con bandeja única de pendientes. | Hasta la aprobación no se emiten comandos con efecto. |
| CP-CRM-0078 | RF-CRM-078; M09 §5.2; PRO-O2-12 | O2 | Núcleo | integración | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Seguimiento de comandos solicitados con estados y resultado; reintento idempotente; alerta si fallan. | Reenviar un comando con la misma clave no duplica efectos; un fallo deja el caso en "en ejecución con error". |
| CP-CRM-0079 | RF-CRM-079; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Constancia descargable de toda solicitud (número, fecha, contenido, canal, código de verificación). | La constancia PDF se genera con plantilla T09 y queda en el expediente T11. |
| CP-CRM-0080 | RF-CRM-080; M09 §5.2; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Trámites presentados con vencimiento ligados a socio, cuenta o servicio (por ejemplo constancias para beneficios), con tipos de trámite, días de vencimiento, plantilla y acciones tipadas al alta y al vencimiento. | Un trámite vencido sin otro vigente del mismo tipo dispara la acción de vencimiento como comando al módulo dueño. |
| CP-CRM-0081 | RF-CRM-081; M09 §5.2; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Informe de trámites presentados, no presentados y vencidos, filtrable por titular y servicio. | Los tres estados suman el universo filtrado. |
| CP-CRM-0082 | RF-CRM-082; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Formularios imprimibles para firma del socio (solicitud de OT, cambio de categoría, traslado) desde plantillas T09. | El formulario usa el diseño específico de la operación y se adjunta firmado al expediente. |
| CP-CRM-0083 | RF-CRM-083; M09 §5.2; PRO-O2-12 | O2 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | La baja de un servicio no da de baja el vínculo de asociado ni viceversa. | Tras ejecutar la baja de Internet, la persona sigue asociada. |
| CP-CRM-0084 | RF-CRM-084; M09 §5.2; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles | Informar cargos y condiciones antes de confirmar solicitudes aranceladas admisibles (cotización de M04). | El socio ve el importe en ARS y acepta; la aceptación queda en el caso con versión de condiciones. |
| CP-CRM-0085 | RF-CRM-085; M09 §5.2; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Operaciones de lote originadas en trámites masivos (cambio de categoría, clase, actividad, referencia, baja de servicio) se reemplazan por solicitudes masivas con comandos individuales validados. | Cada servicio del lote produce su comando y su validación (`Validar_OrdenTrabajo_Desconexion` en M10). |
### 1.3 Reclamos e incidentes (M09 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0100 | RF-CRM-100; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Registrar reclamos vinculados a socio, servicio, cuenta y, cuando corresponda, contrato, inmueble o factura. | Un reclamo de factura exige el comprobante; uno técnico, el servicio. |
| CP-CRM-0101 | RF-CRM-101; M09 §5.3; PRO-O3-11 | O3 | Núcleo | regla | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Desde un reclamo técnico, solicitar a M10 una orden de trabajo vinculada; el caso refleja estados de la OT. | La OT creada queda vinculada; cerrar la OT no cierra el caso sin la regla del tipo. |
| CP-CRM-0102 | RF-CRM-102; M09 §5.3; PRO-O4-13 | O4 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Reclamos comerciales o de facturación derivan en comandos a M05/M07 (revisión, ajuste, nota de crédito) siempre con aprobación. | El caso nunca modifica importes; el ajuste lo emite M05 tras aprobación T11. |
| CP-CRM-0103 | RF-CRM-103; M09 §5.3; PRO-O3-11 | O3 | Núcleo | regla | TEN-001 con `enacom.733-2017.noService`: Falta total de servicio Inmediata (al registrar) 3 días hábiles para restablecer hábil | SLA por tipo, subtipo, prioridad y servicio, con objetivos de primera respuesta y resolución, calendario hábil del tenant y pausas. | Cada caso tiene política aplicada y fechas objetivo calculadas al crearse y recalculadas al reclasificar. |
| CP-CRM-0104 | RF-CRM-104; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Alertas por SLA en riesgo (umbral %) y vencido; escalamiento por niveles a supervisor y responsable del área. | Al 75 % (configurable) se alerta al responsable; al 100 % se escala y se registra el incumplimiento. |
| CP-CRM-0105 | RF-CRM-105; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Avisos al socio de cada cambio de estado del reclamo según configuración (recibido, derivado, en tratamiento, OT programada, técnico en camino si M10 lo informa, resuelto, cerrado). | Las transiciones configuradas producen comunicación con resultado de entrega (AGR-024). |
| CP-CRM-0106 | RF-CRM-106; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Incidente común que agrupa a los afectados con una sola gestión técnica. | Vincular N casos a un incidente genera una sola solicitud de OT/gestión técnica en M10. |
| CP-CRM-0107 | RF-CRM-107; M09 §5.3; PRO-O3-11 | O3 | Estándar | regla | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Detección sugerida de incidente común por concentración de reclamos (servicio, subtipo, zona/nodo, ventana de tiempo). | Con ≥ N casos en la ventana el sistema propone el incidente al supervisor; nunca lo crea solo. |
| CP-CRM-0108 | RF-CRM-108; M09 §5.3; PRO-O3-11 | O3 | Estándar | regla | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Alcance del incidente: servicio, zonas, localidades, nodos/elementos de red (M10 GIS), cuentas afectadas calculadas o cargadas. | La lista de afectados se calcula desde M10 y se congela por versión. |
| CP-CRM-0109 | RF-CRM-109; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Comunicación a afectados (aviso de falla, avance, restablecimiento) vía T09 con audiencia del incidente, y aviso al socio que reclama de que su caso está ligado al incidente. | Cada aviso registra destinatarios y resultado. |
| CP-CRM-0110 | RF-CRM-110; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Cerrar un incidente no cierra automáticamente los casos: cada caso confirma la resolución o permanece abierto/reabre si el domicilio sigue afectado. | Al restablecer el incidente los casos pasan a "resuelto pendiente de confirmación"; un caso puede desvincularse y seguir. |
| CP-CRM-0111 | RF-CRM-111; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Tipificación: categoría de incidente (M10), clase de incidente con numerador propio, tipo de falla (M10), resolución (M10). | Cada incidente recibe número de su clase; la resolución se toma del catálogo de M10. |
| CP-CRM-0112 | RF-CRM-112; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Participantes del incidente (responsables internos y cuadrillas). | El incidente lista participantes con rol. |
| CP-CRM-0113 | RF-CRM-113; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Consulta de incidentes por cuenta, período y estado, uniendo casos y OT, con exportación. | La consulta excluye anulados y exporta XLSX. |
| CP-CRM-0114 | RF-CRM-114; M09 §5.3; PRO-O7-09 | O7 | Estándar | funcional | TEN-001 con `enacom.733-2017.degraded`: Degradación de calidad o velocidad Inmediata 5 días hábiles hábil | Campos y vistas para reclamos regulatorios (por ejemplo los exigidos por OCEBA/ERSeP/ENACOM), marcables por tipo, para informes de calidad de atención. | Un tipo regulatorio exige los campos del regulador y aparece en el informe T10/M06. |
| CP-CRM-0115 | RF-CRM-115; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Resultado favorable/desfavorable al socio y revisión del reclamo (revisor y fecha). | Ambos datos son obligatorios al cerrar reclamos de tipos que lo requieran. |
| CP-CRM-0116 | RF-CRM-116; M09 §5.3; PRO-O3-11 | O3 | Núcleo | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Carga rápida de reclamos desde la ficha del titular (cuenta, servicio, descripción en una sola pantalla). | Un reclamo se crea en menos de tres interacciones desde la ficha. |
| CP-CRM-0117 | RF-CRM-117; M09 §5.3; PRO-O6-10 | O6 | Estándar | regla | TEN-001 con Reglas de suspensión: SUS-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-ARANCEL (ARS 5.000, **deshabilitada**, sin validar) | Cargo por visita improcedente asociado a reclamos solo con regla habilitada, validada y aviso previo; el cargo lo genera M10/M05. | Sin regla validada no se ofrece; con regla, el socio fue informado antes de la visita. |
| CP-CRM-0118 | RF-CRM-118; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Recibir la conformidad del socio y el motivo de disconformidad registrados en campo y reflejarlos en el caso. | Una disconformidad impide el cierre automático y vuelve el caso a "en tratamiento". |
| CP-CRM-0119 | RF-CRM-119; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Encuesta post-cierre (CSAT/NPS + comentario) configurable por tipo, enviada por T09, con resultado ligado al caso. | Una respuesta negativa crea alerta al supervisor; no se envía más de una encuesta por caso. |
| CP-CRM-0120 | RF-CRM-120; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Informes de reclamos, reincidencias y estadísticas de demora (pendientes, resueltos, dentro/fuera de período, demora promedio desde fecha del caso y desde registro). | Las demoras usan piso 0 y "ahora" para abiertos. |
| CP-CRM-0121 | RF-CRM-121; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Exponer a M10 el resumen de incidentes/casos vinculados para la impresión de la OT. | M10 obtiene el resumen por API interna. |
| CP-CRM-0122 | RF-CRM-122; M09 §5.3; PRO-O3-11 | O3 | Núcleo | seguridad | TEN-001 con SLA de seguridad (RF-CRM-260): Plantilla `safety.emergency`, corrido 24×7: fuga u olor a gas 10 min aceptación / 60 min arribo / 4 h zona segura; cable caído 15 min / 90 min / 6 h… | Protocolo de urgencias de seguridad (riesgo eléctrico, fuga de gas, cable caído, pérdida grave): prioridad crítica, aviso inmediato a guardia, mensaje de seguridad al socio con teléfono de emergencia. **Precisión (HUE-GAS-05):** la guardia… | Un subtipo marcado urgente no espera supervisión: notifica a guardia y queda visible en supervisión. |
| CP-CRM-0123 | RF-CRM-123; M09 §5.3; PRO-O3-11 | O3 | Estándar | regla | TEN-001 con `enacom.733-2017.noService`: Falta total de servicio Inmediata (al registrar) 3 días hábiles para restablecer hábil | Reglas de notificación de guardias por servicio, tipo, días de semana, franja horaria, feriados y momento (al crear o al derivar). | Fuera de franja se notifica al responsable de guardia configurado. |
| CP-CRM-0124 | RF-CRM-124; M09 §5.3; PRO-O3-11 | O3 | Estándar | funcional | TEN-001 con Incidente: INC-001 "Falta de agua barrio Centro", 12 cuentas afectadas ficticias | Envío configurable de correo a la cuenta configurada del incidente, a cada interviniente y al titular de la cuenta. | Cada destinatario se activa por parámetro y la comunicación queda en el caso. |
| CP-CRM-0125 | RF-CRM-125; M09 §5.3; PRO-O11-06 | O11 | Estándar | funcional | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Historial de estados de reclamos migrados y notas, consultables en el caso. | Los eventos migrados se ven en el timeline con marca "migrado". |
| CP-CRM-0258 | RF-CRM-258; M09 §5.3; PRO-O3-11 | O3 | Estándar | regla | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | **Plantilla de plataforma de SLA ENACOM** para reclamos de servicios TIC (Internet, TV, telefonía; Res. ENACOM 733/2017, Reglamento de Clientes TIC): políticas `crmSlaPolicies` precargadas por motivo de reclamo (falta total de servicio… | Un tenant con servicio TIC ve la plantilla ENACOM en PAN-CRM-14 y al adoptarla los casos de esos motivos calculan vencimientos con sus objetivos; T10 REP-BIA-015 informa el cumplimiento; ningún objetivo se muestra como vigente legal mientras `legalValidation.status = pending`. |
| CP-CRM-0259 | RF-CRM-259; M09 §5.3; PRO-O7-09 | O7 | Estándar | regla | TEN-001 con Subtipos de saneamiento y alumbrado (RF-CRM-259): Cloacas: desborde (`crm.claimType.clo.desborde`, urgente de seguridad si hay riesgo sanitario) y obstrucción (`crm.claimType.clo.obstruccion`)… | **Reclamos de saneamiento y alumbrado con derivación según convenio** (HUE-CLO-03, HUE-ALU-03): subtipos de precarga con clave del diccionario `dict:crm.claimType` (T03 §10.9.12, RF-UXD-179; nombres verificados): cloacas… | Un reclamo de luminaria apagada en un servicio cuyo convenio fija `claimHandler = municipality` no crea OT: registra la derivación, el número de constancia del municipio y avisa al socio; si el convenio fija `cooperative`, solicita la OT a M10. Un desborde se registra con su tipo propio y aparece separado en REP-BIA-021. |
| CP-CRM-0260 | RF-CRM-260; M09 §5.3; PRO-O3-11 | O3 | Núcleo | seguridad | TEN-001 con SLA de seguridad (RF-CRM-260): Plantilla `safety.emergency`, corrido 24×7: fuga u olor a gas 10 min aceptación / 60 min arribo / 4 h zona segura; cable caído 15 min / 90 min / 6 h… | **SLA de reclamo de seguridad** (HUE-GAS-05): política de plataforma `safety.emergency` aplicada a todo subtipo con `urgentSafety=true` (fuga u olor a gas, riesgo eléctrico, cable caído, pérdida grave de agua, desborde con riesgo… | Un caso de fuga de gas creado a las 23:00 de un feriado calcula el vencimiento de arribo en minutos corridos; si la guardia no acepta en el plazo, el caso muestra el escalamiento; el SLA de seguridad figura en REP-BIA-022 (gas) y REP-BIA-018 (energía). |
### 1.4 Mesa de entradas (M09 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0130 | RF-CRM-130; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Registrar entradas documentales (nota, oficio judicial, cédula, carta documento, documentación de organismos, solicitud por escrito) con número de expediente. | Cada entrada recibe número del libro de mesa de entradas y queda como caso tipo mesa de entradas. |
| CP-CRM-0131 | RF-CRM-131; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" | Datos de remitente externo (organismo, juzgado, persona, proveedor), destinatario interno, folios, medio de recepción, fecha y hora de recepción, adjuntos escaneados. | Sin remitente o sin fecha de recepción el registro falla. |
| CP-CRM-0132 | RF-CRM-132; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Pases y derivaciones internas con acuse de recepción del área. | Cada pase muestra quién lo envió, a quién y cuándo se acusó recibo. |
| CP-CRM-0133 | RF-CRM-133; M09 §5.4; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con `enacom.733-2017.contract`: Alta, baja o cambio de plan no ejecutado en plazo Inmediata 5 días hábiles hábil | Plazos de respuesta (por ejemplo oficios con término) con alertas. | El plazo usa el calendario hábil o corrido indicado; alerta a 2 días hábiles del vencimiento. |
| CP-CRM-0134 | RF-CRM-134; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Registro de salidas/respuestas con número de salida y constancia de envío. | Cada salida queda en el expediente con su número. |
| CP-CRM-0135 | RF-CRM-135; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Vincular la entrada con persona, cuenta, servicio u otro caso cuando corresponda. | La vinculación aparece en la vista 360. |
| CP-CRM-0136 | RF-CRM-136; M09 §5.4; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" | Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). | El libro es exportable a PDF con numeración continua. |
### 1.5 Atención presencial y turnero (M09 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0140 | RF-CRM-140; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Recepción: identificar a la persona (opcional), registrar motivo y emitir turno para un área. | El turno A-001 para Caja se emite con hora de ingreso. |
| CP-CRM-0141 | RF-CRM-141; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Áreas del turnero con letra, descripción, responsable, tiempo estimado de atención, habilitación e imagen. | Un área inhabilitada no emite turnos. |
| CP-CRM-0142 | RF-CRM-142; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Usuarios por área; un usuario sin áreas asignadas actúa como recepción y ve todas las áreas habilitadas. | El llamado toma solo turnos de las áreas del usuario. |
| CP-CRM-0143 | RF-CRM-143; M09 §5.5; PRO-O10-11 | O10 | Estándar | integración | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Boxes con tipo y número; apertura y cierre por usuario con historial; un box no puede estar abierto dos veces. | Abrir un box abierto informa quién lo tiene; cerrar es idempotente. |
| CP-CRM-0144 | RF-CRM-144; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Numeración correlativa por día y área; código visible por número (letra + 3 dígitos), por nombre o por letra + últimos 3 dígitos del documento sin imprimir. | El contador reinicia cada día por área en la zona horaria del tenant. |
| CP-CRM-0145 | RF-CRM-145; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Turnos prioritarios (embarazo, discapacidad, adultos mayores u otras causas del tenant) que se llaman primero. | Entre prioritarios y comunes, el siguiente llamado es el prioritario más antiguo. |
| CP-CRM-0146 | RF-CRM-146; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Llamar siguiente con exclusión concurrente: dos boxes nunca llaman el mismo turno. | Prueba de carga con 10 boxes simultáneos no duplica llamados. |
| CP-CRM-0147 | RF-CRM-147; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con `enacom.733-2017.service`: Atención comercial y otros motivos Inmediata 15 días hábiles hábil | Rellamar, marcar ausente, iniciar atención, derivar a otra área conservando el área de origen, finalizar como solucionado, sin solución o sin atención. | Cada acción queda en el historial con hora del servidor, box, área y usuario. |
| CP-CRM-0148 | RF-CRM-148; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Pantallas públicas con últimos llamados (agrupados por box o por turno), modos de visualización, voz sintetizada y múltiples pantallas por sucursal. | La pantalla web muestra los 5 últimos llamados del día y anuncia por voz el nuevo llamado. |
| CP-CRM-0149 | RF-CRM-149; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Tiempo estimado de espera por turno según usuarios con box abierto y tiempo estimado del área. | El estimado se muestra en el ticket y en el turno online. |
| CP-CRM-0150 | RF-CRM-150; M09 §5.5; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con `enacom.733-2017.service`: Atención comercial y otros motivos Inmediata 15 días hábiles hábil | Estadísticas: ingresados, atendidos, abandonos, prioritarios, tiempos de espera y atención, por día de semana y hora, por mes/día/hora y por turno, con exclusión de errores de carga. | Los intervalos ≥ 5 h se excluyen si se marca la opción. |
| CP-CRM-0151 | RF-CRM-151; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. | El turno remoto entra en la fila con marca de origen; el socio recibe aviso a N turnos. |
| CP-CRM-0152 | RF-CRM-152; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Reserva de turno con día y hora por área, con cupos, confirmación, recordatorio, cancelación y presentación (check-in) que genera el turno. | No se sobrevende un cupo por carrera; ausencia se registra. |
| CP-CRM-0153 | RF-CRM-153; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Tótem de autoservicio para emitir turno (con documento opcional) e imprimir o mostrar QR. | El tótem funciona como app web en modo kiosco. |
| CP-CRM-0154 | RF-CRM-154; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Turnos generados automáticamente por canales remotos con un box técnico de generación y un principal de servicio, excluidos de los boxes abiertos. | El box técnico no aparece en la consola ni en estadísticas de boxes. |
| CP-CRM-0155 | RF-CRM-155; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. | Si el agente está caído, el turno se emite y se muestra en pantalla/QR; la impresión se reintenta. |
| CP-CRM-0156 | RF-CRM-156; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Registrar cada atención presencial como interacción (motivo, resultado, caso creado o vinculado). | Finalizar un turno exige motivo y resultado; puede crear un caso en el mismo paso. |
| CP-CRM-0157 | RF-CRM-157; M09 §5.5; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Historial completo del turno consultable. | El historial muestra la acción en curso como fila "actual". |
| CP-CRM-0158 | RF-CRM-158; M09 §5.5; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01 | Atención de ventanilla sin turnero (registro directo de interacción) desde O2. | El agente registra la interacción y crea el caso sin turno. |
### 1.6 Canales de atención (M09 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0170 | RF-CRM-170; M09 §5.6; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" | Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. | Un canal deshabilitado no recibe ni envía; sus casos históricos se conservan. |
| CP-CRM-0171 | RF-CRM-171; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Bandeja omnicanal de conversaciones con asignación a agentes, estado, tiempo de espera y vínculo a caso. | Un mensaje entrante sin caso aparece en la cola del canal; el agente lo vincula o crea caso. |
| CP-CRM-0172 | RF-CRM-172; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Plantillas: `crm.case.created`, `crm.case.statusChanged`, `crm.case.closed`, `crm.case.pendingInfo`, `crm.survey.postClose`, `crm.queueTicket.called`… | WhatsApp Business con la cuenta oficial del tenant: mensajes entrantes y salientes, ventana de atención de 24 h, plantillas aprobadas fuera de ventana, opt-in y opt-out. | Fuera de ventana el sistema solo permite plantillas aprobadas; un opt-out bloquea envíos no transaccionales. |
| CP-CRM-0173 | RF-CRM-173; M09 §5.6; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Avisos salientes del CRM por WhatsApp con plantillas (caso recibido, estado actualizado, documentación pendiente, resuelto, encuesta, turno llamado, incidente zonal, constancia de baja), usando el motor T09. | Cada plantilla tiene variables declaradas; falta de variable impide el envío y registra error. |
| CP-CRM-0174 | RF-CRM-174; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano | Bot de autogestión: consulta de saldo, segunda vía de factura, link de pago, apertura de reclamo, estado de reclamos, turnos, cortes programados, inicio de baja (lleva al circuito de baja), preguntas frecuentes. | Cada intención se resuelve con APIs de solo lectura o creando un caso; ninguna cambia estado de contrato o deuda. |
| CP-CRM-0175 | RF-CRM-175; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Identificación en canales: por teléfono verificado vinculado, documento → cuentas, código de cuenta; verificación adicional antes de mostrar información privada. | Sin verificación el bot solo ofrece información pública y apertura de casos. |
| CP-CRM-0176 | RF-CRM-176; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Traspaso bot → humano con contexto completo; comportamiento fuera de horario. | El agente ve la transcripción y la intención detectada; fuera de horario se informa el plazo y se crea caso. |
| CP-CRM-0177 | RF-CRM-177; M09 §5.6; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas | Email entrante por casilla del tenant: crear caso o agregar al caso por número en el asunto; responder desde el caso. | Un email con "[TCK-…]" en el asunto se agrega al caso; sin número crea caso nuevo en supervisión. |
| CP-CRM-0178 | RF-CRM-178; M09 §5.6; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | SMS saliente desde el caso o ficha y entrante opcional (respuestas). | El SMS saliente queda como interacción con resultado de T09. |
| CP-CRM-0179 | RF-CRM-179; M09 §5.6; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Teléfono: registro de llamadas de atención (entrante/saliente, duración, motivo, resultado); integración CTI opcional (identificación por número, ficha emergente, clic para llamar, referencia a grabación). | Sin CTI el agente registra la llamada con temporizador; con CTI la ficha se abre sola. |
| CP-CRM-0180 | RF-CRM-180; M09 §5.6; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano | IVR entrante para consultas (saldo, estado de reclamo) y registro de reclamos o derivación a agente. | La opción del IVR crea interacción y, si corresponde, caso. |
| CP-CRM-0181 | RF-CRM-181; M09 §5.6; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Exportación de listas para discadores/IVR saliente (modelos de archivo heredados) delegada a T09/M08; CRM aporta universos de casos. | M09 no genera archivos de discador: el universo de casos se entrega a T09 por consulta filtrada y T09 produce el archivo del canal IVR con el modelo heredado; ninguna pantalla de M09 exporta ese archivo. |
| CP-CRM-0182 | RF-CRM-182; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano | Chat web en landing, portal y PWA (bot primero, humano después). | El widget respeta la marca del tenant y funciona sin login para consultas públicas. |
| CP-CRM-0183 | RF-CRM-183; M09 §5.6; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Redes sociales (mensajería de Facebook e Instagram) como canales de la bandeja omnicanal. | Los mensajes entran a la misma bandeja con canal identificado. |
| CP-CRM-0184 | RF-CRM-184; M09 §5.6; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Circular: "Aviso deuda mayor a ARS 20.000" | Selección del destino de avisos (móvil de la cuenta, teléfono web, teléfono de la persona) según preferencias y verificación (T09). | Un aviso de caso se emite a T09 sin dirección de destino; T09 elige móvil de la cuenta, teléfono web o teléfono de la persona según preferencia y verificación, y el destino usado queda en la comunicación vinculada al caso. |
| CP-CRM-0185 | RF-CRM-185; M09 §5.6; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Envío manual de WhatsApp/SMS desde la ficha del titular o el caso siempre registrado (no por enlaces externos sin trazabilidad). | El botón abre la conversación CRM; el envío queda como interacción. |
| CP-CRM-0186 | RF-CRM-186; M09 §5.6; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1" | Historial unificado de interacciones (llamada, WhatsApp, email, ventanilla, portal, SMS, bot, mesa de entradas) ligado a persona, cuenta y servicio. | Toda interacción tiene persona o "no identificada" y, si se identifica luego, se re-vincula. |
| CP-CRM-0187 | RF-CRM-187; M09 §5.6; PRO-O3-12 | O3 | Núcleo | funcional | TEN-001 con Circular: "Aviso deuda mayor a ARS 20.000" | Respetar consentimiento, preferencias de canal y horario de no molestar de T09 en avisos no urgentes. | Un aviso no urgente en horario de no molestar se difiere. |
| CP-CRM-0188 | RF-CRM-188; M09 §5.6; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Responder fuera de la ventana de 24 h solo con plantilla aprobada; reabrir ventana al responder el socio. | El editor bloquea texto libre fuera de ventana. |
### 1.7 IA supervisada (M09 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0200 | RF-CRM-200; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Clasificación sugerida de tipo, subtipo, servicio, prioridad y área. | La sugerencia se muestra con confianza; el supervisor acepta o corrige; la derivación la decide una persona. |
| CP-CRM-0201 | RF-CRM-201; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). | El resumen se guarda como sugerencia con versión de modelo; convertirlo en nota requiere confirmación. |
| CP-CRM-0202 | RF-CRM-202; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Sugerencia de respuesta (borrador) editable por el agente. | Ningún mensaje generado se envía sin acción humana. |
| CP-CRM-0203 | RF-CRM-203; M09 §5.7; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Lectura de adjuntos (foto de medidor, factura, documento, daño) para extraer datos y proponerlos. | Los datos extraídos se muestran junto al original; aceptar carga los campos con marca "origen IA". |
| CP-CRM-0204 | RF-CRM-204; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Asistencia al socio para redactar su gestión (propuesta revisable por el socio). | El socio puede descartar la propuesta y conservar su texto. |
| CP-CRM-0205 | RF-CRM-205; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. | La sugerencia nunca vincula sola. |
| CP-CRM-0206 | RF-CRM-206; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Registro de cada sugerencia: función, fuentes, tenant, versión de modelo y de instrucciones, salida, confianza, decisión humana (aceptada, corregida, descartada) y texto original conservado. | Para cualquier caso se reconstruye qué propuso la IA y qué decidió el operador. |
| CP-CRM-0207 | RF-CRM-207; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Operación sin IA: si la IA falla o está deshabilitada, la recepción y atención siguen normalmente. | Con el proveedor caído, crear y derivar casos funciona y la UI indica "IA no disponible". |
| CP-CRM-0208 | RF-CRM-208; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Mensajes y adjuntos se tratan como datos: no cambian permisos, instrucciones ni alcance. | Pruebas de inyección ("ignorá las instrucciones…") no alteran el comportamiento ni exponen datos de otro socio/tenant. |
| CP-CRM-0209 | RF-CRM-209; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Ámbito: la IA solo recibe datos del tenant y del socio del caso, minimizados. | El contexto enviado al proveedor excluye datos de otros socios y campos sensibles no necesarios. |
| CP-CRM-0210 | RF-CRM-210; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Casos sensibles (salud, sepelio, violencia, menores) y clasificaciones inciertas se derivan a humano; la IA no decide cobros, bajas, devoluciones ni temas clínicos. | Con confianza menor al umbral el caso queda "sin clasificar" en supervisión. |
| CP-CRM-0211 | RF-CRM-211; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Habilitación por tenant y por función, umbrales, y evaluación de exactitud (tasa de aceptación/corrección por servicio y función). | El tablero de IA muestra exactitud por función y período. |
| CP-CRM-0212 | RF-CRM-212; M09 §5.7; PRO-O6-09 | O6 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Propuesta de acción siguiente e información faltante como parte del resumen. | La propuesta lista datos faltantes que el agente puede pedir con un clic. |
| CP-CRM-0213 | RF-CRM-213; M09 §5.7; PRO-O6-09 | O6 | Núcleo | funcional | TEN-001 con Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano | Detección de intención en el bot con umbral; si es incierta, se pregunta o se deriva a humano. | Bajo umbral el bot ofrece menú o humano, nunca ejecuta una acción. |
### 1.8 Actividades y tareas internas (M09 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0220 | RF-CRM-220; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Áreas de actividades con responsable, destinatarios adicionales y días de envío de recordatorios. | Los destinatarios son usuarios o grupos del tenant (emails externos opcionales). |
| CP-CRM-0221 | RF-CRM-221; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. | Un tipo sin frecuencia solo admite actividades manuales. |
| CP-CRM-0222 | RF-CRM-222; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Frecuencias semanal, mensual, bimestral, trimestral, cuatrimestral, semestral, anual o cada N días, sin duplicados. | Crear una frecuencia con mismo tipo y días informa "ya existe". |
| CP-CRM-0223 | RF-CRM-223; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Rubros de actividades. | Las actividades se filtran por rubro. |
| CP-CRM-0224 | RF-CRM-224; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Actividades con tipo, rubro, responsable, destinatarios extra, vigencia hasta, generación automática o manual y tipo de fecha. | Una actividad vencida en vigencia deja de generar ocurrencias. |
| CP-CRM-0225 | RF-CRM-225; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Generación automática de la siguiente ocurrencia cuando la próxima fecha menos el margen anterior llegó, sin superar la vigencia. | El job diario crea a lo sumo una ocurrencia por fecha y actividad. |
| CP-CRM-0226 | RF-CRM-226; M09 §5.8; PRO-O10-12 | O10 | Estándar | regla | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. | La cita se asigna por usuario, no por coincidencia de email. |
| CP-CRM-0227 | RF-CRM-227; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Recordatorios diarios por actividad, por responsable y por área con resumen de días de atraso promedio, en los días de envío configurados. | El envío ocurre una vez por día aunque el job se ejecute varias veces. |
| CP-CRM-0228 | RF-CRM-228; M09 §5.8; PRO-O10-12 | O10 | Estándar | regla | TEN-001 con Conjunto de estados: Base unificado de §7 con etiquetas por defecto | Estados de ocurrencia: pendiente, próxima a vencer, vencida, cerrada en término, cerrada fuera de término, cerrada con revisión, anulada. | "En término" = cierre ≤ fecha + margen posterior. |
| CP-CRM-0229 | RF-CRM-229; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. | Un tipo con aprobación requiere que otro usuario apruebe para cerrar. |
| CP-CRM-0230 | RF-CRM-230; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Circular: "Aviso deuda mayor a ARS 20.000" | Aviso de finalización a destinatarios al cerrar una ocurrencia. | El aviso se envía por T09 de forma asíncrona. |
| CP-CRM-0231 | RF-CRM-231; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Planilla imprimible por plantilla del tipo o predeterminada, con estado impreso (Pendiente, Cerrada con revisión, Cerrada). | La planilla se genera en PDF con plantilla T09. |
| CP-CRM-0232 | RF-CRM-232; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Actividades previas/preventivas vinculadas a otra actividad, con estado de cumplimiento. | No se cierra una ocurrencia si sus previas obligatorias están pendientes (configurable). |
| CP-CRM-0233 | RF-CRM-233; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Escalamiento de ocurrencias vencidas al responsable del área tras N días. | A N días de vencida, el área recibe aviso. |
| CP-CRM-0234 | RF-CRM-234; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Indicadores de actividades, casos y turnos para el tablero de control (T10). | T10 consume indicadores con fórmula y umbral documentados. |
| CP-CRM-0235 | RF-CRM-235; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades) | Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. | Un evento recurrente se expande en la vista mensual. |
| CP-CRM-0236 | RF-CRM-236; M09 §5.8; PRO-O3-12 | O3 | Estándar | regla | TEN-001 con Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado… | Tareas internas ad hoc (no recurrentes) vinculables a casos, con responsable, vencimiento y evidencia. | Desde un caso se crea una tarea para otra área sin derivar el caso. |
| CP-CRM-0237 | RF-CRM-237; M09 §5.8; PRO-O10-12 | O10 | Estándar | funcional | TEN-001 con Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5) | Informe de seguimiento de actividades por estado, área, responsable y período. | El informe muestra días de atraso promedio por área. |
### 1.9 Circulares, plantillas y encuestas (M09 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-CRM-0250 | RF-CRM-250; M09 §5.9; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Circular: "Aviso deuda mayor a ARS 20.000" | Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. | Un modelo se previsualiza con datos ficticios antes de generar. |
| CP-CRM-0251 | RF-CRM-251; M09 §5.9; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. | La corrida congela el universo, registra destinatarios y resultado por canal. |
| CP-CRM-0252 | RF-CRM-252; M09 §5.9; PRO-O6-10 | O6 | Estándar | funcional | TEN-001 con Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio… | Etiquetas (titular, cuenta, servicio) e informe de comunicación de la corrida. | Las etiquetas se generan en PDF por formato configurado. |
| CP-CRM-0253 | RF-CRM-253; M09 §5.9; PRO-O6-10 | O6 | Estándar | integración | TEN-001 con Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central" | Solicitar OT masivas a M10 desde una corrida (por ejemplo, inspecciones). | Cada OT se pide por comando con clave idempotente por cuenta y corrida. |
| CP-CRM-0254 | RF-CRM-254; M09 §5.9; PRO-O11-06 | O11 | Estándar | funcional | TEN-001 con Cuentas y servicios: CTA-001 (Ana, INM-001): Agua y Energía activos, Internet INT-100 activo, TV activa; CTA-002 (Bruno): Energía | Exportaciones regulatorias e informes de deuda presentes en frmCirculares (EPRE, OCEBA, RASE, SINTYS, ENACOM, ERSeP, informes de deuda/servicios, mapa) se reasignan. | Ninguna exportación regulatoria ni informe de deuda se emite desde M09; cada salida listada en §22 existe en el módulo destino (M06, T10, M08 o M10) con su propio ID. |
| CP-CRM-0255 | RF-CRM-255; M09 §5.9; PRO-O2-11 | O2 | Núcleo | funcional | TEN-001 con Plantillas: `crm.case.created`, `crm.case.statusChanged`, `crm.case.closed`, `crm.case.pendingInfo`, `crm.survey.postClose`, `crm.queueTicket.called`… | Plantillas de correspondencia con variables (mail, SMS, WhatsApp, documento) administradas en T09; el CRM registra las claves de plantilla que usa cada tipo/estado. | Al cambiar un caso a un tipo o estado con plantilla configurada (PRM-CRM-056), M09 envía a T09 solo la clave de plantilla y las variables; si la clave no existe en T09 la configuración se rechaza. |
| CP-CRM-0256 | RF-CRM-256; M09 §5.9; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con Reglas de suspensión: SUS-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-ARANCEL (ARS 5.000, **deshabilitada**, sin validar) | Encuesta post-cierre y encuestas presentadas al usuario interno (heredado frmEncuestas) resueltas con el motor T09. | Al cerrar un caso con encuesta habilitada, la encuesta se envía con el motor de T09 y la respuesta queda vinculada al caso (RF-CRM-119); M09 no mantiene un editor propio de encuestas. |
| CP-CRM-0257 | RF-CRM-257; M09 §5.9; PRO-O11-01 | O11 | Estándar | funcional | TEN-001 con `enacom.733-2017.degraded`: Degradación de calidad o velocidad Inmediata 5 días hábiles hábil | Indicadores de calidad de atención para reguladores cuando se exijan (MER-014). | T10 obtiene tiempos por tipo regulatorio. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-CRM-5001 — ESC-CRM-01. Supervisión obligatoria**

- Cubre: ESC-CRM-01; RF-CRM-008; RN-CRM-003; M09 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas
- Dado Tenant con `crm.routing.autoDeriveEnabled = false`
- Cuando Ana crea un reclamo desde la app
- Entonces El caso queda en `received` en la bandeja de supervisión; ninguna área lo ve hasta derivarlo

**CP-CRM-5002 — ESC-CRM-02. Derivación cambia de área sin perder historia**

- Cubre: ESC-CRM-02; RF-CRM-009; M09 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado TCK-DEMO-001 derivado a Agua
- Cuando El empleado lo deriva a Comercial con motivo
- Entonces Mismo número, timeline con ambos pases, SLA continúa

**CP-CRM-5003 — ESC-CRM-03. CRM no altera contratos**

- Cubre: ESC-CRM-03; RF-CRM-078; RN-CRM-001; M09 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado Solicitud de baja aprobada
- Cuando Se ejecuta
- Entonces El CRM emite `crmCommandRequests` a M02; el contrato cambia solo cuando M02 confirma; si M02 rechaza, el caso pasa a "en ejecución con error"

**CP-CRM-5004 — ESC-CRM-04. Baja sin cargo ni deuda**

- Cubre: ESC-CRM-04; RF-CRM-066, RF-CRM-067; RN-CRM-007; M09 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado Ana tiene deuda vencida de ARS 12.500
- Cuando Pide la baja de Internet por el formulario público
- Entonces Se recibe, se entrega código en ≤ 24 h, no se exige pagar ni se crea cargo; la deuda sigue en M07

**CP-CRM-5005 — ESC-CRM-05. Rescisión por el mismo medio**

- Cubre: ESC-CRM-05; RN-CRM-008; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado Contrato celebrado por la app
- Cuando Ana pide la baja por la app
- Entonces La opción está disponible en la app y la constancia se envía por el mismo medio en ≤ 72 h

**CP-CRM-5006 — ESC-CRM-06. Regla arancelada no validada**

- Cubre: ESC-CRM-06; RF-CRM-070; RN-CRM-012; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Reglas de suspensión: SUS-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-GRATIS (ARS 0, habilitada), REACT-DEMO-ARANCEL (ARS 5.000, **deshabilitada**, sin validar)
- Dado REACT-DEMO-ARANCEL deshabilitada
- Cuando Ana pide reactivación
- Entonces Solo se ofrece REACT-DEMO-GRATIS; no aparece cargo

**CP-CRM-5007 — ESC-CRM-07. Reactivación por pago**

- Cubre: ESC-CRM-07; RN-CRM-013; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: `enacom.733-2017.contract`: Alta, baja o cambio de plan no ejecutado en plazo Inmediata 5 días hábiles hábil
- Dado Cargo admisible validado y pagado
- Cuando M07 confirma pago
- Entonces El caso no pasa a "reactivado" hasta `contract.reactivated` de M02

**CP-CRM-5008 — ESC-CRM-08. Incidente no cierra casos**

- Cubre: ESC-CRM-08; RF-CRM-110; M09 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado INC-001 con 12 casos
- Cuando M10 informa restablecido
- Entonces Los casos pasan a "resuelto pendiente de confirmación"; un caso con respuesta "sigue sin agua" se reabre

**CP-CRM-5009 — ESC-CRM-09. SLA con pausa**

- Cubre: ESC-CRM-09; RF-CRM-103; M09 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado Política 48 h hábiles, pausa en `waitingCustomer`
- Cuando El caso espera al socio 2 días
- Entonces El tiempo pausado no consume SLA; `pausedMs` refleja la espera

**CP-CRM-5010 — ESC-CRM-10. Escalamiento**

- Cubre: ESC-CRM-10; RF-CRM-104; M09 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado SLA crítico de 4 h corridas
- Cuando Pasan 3 h sin resolución
- Entonces Alerta al 75 %; a las 4 h escala a N2 y marca incumplido

**CP-CRM-5011 — ESC-CRM-11. Aviso fallido no es notificado**

- Cubre: ESC-CRM-11; RN-CRM-023; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado WhatsApp rechaza la plantilla
- Cuando Se emite aviso de cambio de estado
- Entonces La interacción queda "fallida" con motivo; se reintenta por canal alternativo según T09; el caso muestra "aviso no entregado"

**CP-CRM-5012 — ESC-CRM-12. IA solo sugiere**

- Cubre: ESC-CRM-12; RF-CRM-200, RF-CRM-206; RN-CRM-018; M09 §17.1
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado `crm.ai.enabled = true`
- Cuando La IA propone subtipo "Pérdida en vereda" con confianza 0,82
- Entonces Se muestra como sugerencia; el caso no cambia hasta que el agente acepta; queda `crmAiSuggestions` con decisión

**CP-CRM-5013 — ESC-CRM-13. IA excluye sensibles**

- Cubre: ESC-CRM-13; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central"
- Dado Caso marcado sensible (violencia, salud)
- Cuando Se abre el caso
- Entonces No se envía contenido al proveedor de IA

**CP-CRM-5014 — ESC-CRM-14. Bot no divulga sin verificación**

- Cubre: ESC-CRM-14; RF-CRM-175; RN-CRM-017; M09 §17.1
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado Teléfono no vinculado
- Cuando Pide saldo por WhatsApp
- Entonces El bot solicita OTP o derivación; no muestra importes

**CP-CRM-5015 — ESC-CRM-15. Traspaso a humano**

- Cubre: ESC-CRM-15; RF-CRM-176; M09 §17.1
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Bot: Flujo demo: saludo, identificación, saldo, factura, link de pago, reclamo, estado, humano
- Dado Sesión de bot
- Cuando El socio escribe "quiero hablar con alguien" en horario
- Entonces Pasa a bandeja omnicanal con transcripción e identificación; fuera de horario crea caso e informa plazo

**CP-CRM-5016 — ESC-CRM-16. Duplicado**

- Cubre: ESC-CRM-16; RF-CRM-020; M09 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: `enacom.733-2017.noService`: Falta total de servicio Inmediata (al registrar) 3 días hábiles para restablecer hábil
- Dado Caso abierto del mismo subtipo, cuenta y servicio en 90 días
- Cuando Se crea otro
- Entonces Se propone vínculo; al fusionar ambos historiales quedan en el principal

**CP-CRM-5017 — ESC-CRM-17. Turnero llamado concurrente**

- Cubre: ESC-CRM-17; RN-CRM-063; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01
- Dado Dos boxes del área Caja
- Cuando Ambos presionan "llamar siguiente" a la vez
- Entonces Cada uno recibe un turno distinto (operación atómica)

**CP-CRM-5018 — ESC-CRM-18. Box doble**

- Cubre: ESC-CRM-18; RN-CRM-065; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tenant: TEN-001 "Cooperativa Demo Ltda.", sucursal SUC-01 "Casa central"
- Dado Box 2 abierto por usuario A
- Cuando Usuario B intenta abrirlo
- Entonces Se rechaza informando quién lo tiene

**CP-CRM-5019 — ESC-CRM-19. Actividades sin duplicar**

- Cubre: ESC-CRM-19; RN-CRM-073; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5)
- Dado Actividad mensual con ocurrencia pendiente
- Cuando El job corre dos veces el mismo día
- Entonces Se genera una sola ocurrencia

**CP-CRM-5020 — ESC-CRM-20. En término / fuera de término**

- Cubre: ESC-CRM-20; RN-CRM-078; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: migración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado Ocurrencia cerrada 2 días después del vencimiento
- Cuando Se filtra "fuera de término"
- Entonces Aparece en ese filtro (corrige la inversión de ProCoop)

**CP-CRM-5021 — ESC-CRM-21. Trámite vencido**

- Cubre: ESC-CRM-21; RN-CRM-059; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: `enacom.733-2017.billing`: Facturación (cargo no reconocido, error de importe) Inmediata 15 días hábiles para responder hábil
- Dado Constancia vencida sin otra vigente
- Cuando JOB-CRM-07
- Entonces Emite un comando tipado al módulo dueño una sola vez; un error queda registrado sin detener los demás

**CP-CRM-5022 — ESC-CRM-22. Mesa de entradas con plazo**

- Cubre: ESC-CRM-22; RF-CRM-133; M09 §17.1
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1"
- Dado Oficio con 10 días hábiles
- Cuando Faltan 2 días hábiles
- Entonces Alerta al área y al responsable de mesa

**CP-CRM-5023 — ESC-CRM-23. Circular de deuda**

- Cubre: ESC-CRM-23; RN-CRM-090; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Circular: "Aviso deuda mayor a ARS 20.000"
- Dado Modelo con mínimo ARS 20.000
- Cuando Se genera
- Entonces Solo incluye cuentas con deuda ≥ mínimo y no adheridas si el filtro lo indica; la deuda se toma de M07 a la fecha de corte

**CP-CRM-5024 — ESC-CRM-24. Horas facturadas**

- Cubre: ESC-CRM-24; RN-CRM-042; M09 §17.1
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado Caso con horas facturadas
- Cuando Se intenta volver atrás
- Entonces Rechazo "anule primero la facturación en M05"

**CP-CRM-5025 — ESC-CRM-25. Reapertura fuera de ventana**

- Cubre: ESC-CRM-25; RF-CRM-021; M09 §17.1
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado Caso cerrado hace 45 días
- Cuando El socio responde
- Entonces Se crea caso nuevo vinculado al anterior

**CP-CRM-5026 — ESC-01. (pago duplicado) (pago duplicado)**

- Cubre: ESC-01; RN-CRM-001; M09 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (pago duplicado)
- Entonces El caso de reclamo "pagué dos veces" se vincula al resultado de conciliación de M07. El CRM no anula ni acredita; informa el resultado de M07.

**CP-CRM-5027 — ESC-02. (concurrencia) (concurrencia)**

- Cubre: ESC-02; RN-CRM-036; M09 §17.5
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Conjunto de estados: Base unificado de §7 con etiquetas por defecto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (concurrencia)
- Entonces Dos agentes toman el mismo caso. Solo uno lo toma (actualización condicional por versión); el otro ve "tomado por".

**CP-CRM-5028 — ESC-03. (offline en conflicto) (offline en conflicto)**

- Cubre: ESC-03; RN-CRM-027; relacionados: CU-CRM-20; M09 §17.5
- Ola: O3 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (offline en conflicto)
- Entonces Cancelación del alta mientras la instalación offline se ejecutó. Estado `conflict` con ambas evidencias; decide supervisión.

**CP-CRM-5029 — ESC-04. (recuperación) (recuperación)**

- Cubre: ESC-04; RN-CRM-096; M09 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Conjunto de estados: Base unificado de §7 con etiquetas por defecto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (recuperación)
- Entonces Restauración desde backup. No se reenvían avisos ni comandos aceptados; se concilian por id externo.

**CP-CRM-5030 — ESC-05. (corte de proveedor) (corte de proveedor)**

- Cubre: ESC-05; RF-CRM-172; M09 §17.5
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Conjunto de estados: Base unificado de §7 con etiquetas por defecto
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (corte de proveedor)
- Entonces Caída de WhatsApp. Los avisos usan canal alternativo; los mensajes entrantes perdidos se recuperan al restablecer si el proveedor los reenvía; banner en bandeja.

## 3. Casos por caso de uso (CU)

**CP-CRM-8001 — CU-15. Alta de Internet con documentación (BASE §15)**

- Cubre: CU-15; RF-CRM-015, RF-CRM-060, RF-CRM-063; M09 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado actor: agente de atención. Inicio: Ana solicita incorporar Internet en INM-001., autenticado en TEN-001 con las capabilities de su rol
- Cuando (1) el agente crea SOL-001 (tipo `serviceActivation`, plan INT-100, canal Presencial); (2) valida documentación; falta constancia de domicilio → estado "Pendiente de documentación" con faltante listado; (3) Ana sube la constancia por la app; (4) se envía a evaluación de cobertura (comando de factibilidad a M10); (5) aprobada, se piden a M02 el contrato y a M10 la instalación; (6) se informa el avance y la fecha efectiva al activarse.
- Entonces Solicitud trazable que origina contrato y OT sin perder el expediente. Excepción: sin documentación, queda pendiente y no se da de alta una prestación activa. Requisitos: RF-CRM-015, 060, 063–065, 077, 078.

**CP-CRM-8002 — CU-16. Falta de agua en una zona (BASE §16)**

- Cubre: CU-16; RF-CRM-106; M09 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado actor: operador de reclamos., autenticado en TEN-001 con las capabilities de su rol
- Cuando (1) se registran REC-001 y otros reclamos; JOB-CRM-05 propone INC-001; (2) el supervisor confirma, vincula casos y se solicita una sola intervención técnica; (3) se comunican avances; (4) M10 restablece; los casos quedan "resuelto pendiente de confirmación"; (5) un domicilio sigue afectado: su caso se reabre y se pide OT individual. Requisitos: RF-CRM-106–110.
- Entonces Se completa «Falta de agua en una zona (BASE §16)» sin errores, con los efectos que exigen RF-CRM-106, y quedan auditoría y evento del cambio

**CP-CRM-8003 — CU-CRM-21. Tarea interna, turno y aviso (BASE §26)**

- Cubre: CU-CRM-21; RF-CRM-140; RN-CRM-023; relacionados: CU-26; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades)
- Dado actor: supervisor, recepcionista, operador de comunicaciones., autenticado en TEN-001 con las capabilities de su rol
- Cuando (1) tarea: TAR-001 "Revisión mensual" con responsable, evidencia y cierre (actividad mensual); (2) atención: se entrega A-001 para Caja, se llama y se registra atención o ausencia; (3) comunicación: aviso AVISO-FACTURA (T09) con resultado diferenciado por canal. Excepción: un envío fallido queda identificado; encolar no es notificar. Requisitos: RF-CRM-140–147, 224–229, RN-CRM-023.
- Entonces Se completa «Tarea interna, turno y aviso (BASE §26)» sin errores, con los efectos que exigen RF-CRM-140, y quedan auditoría y evento del cambio

**CP-CRM-8004 — CU-CRM-01. Reclamo por pérdida de agua con foto (BASE §47)**

- Cubre: CU-CRM-01; RF-CRM-001; M09 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Según BASE §47: Ana abre gestión en Agua con cuenta autorizada, el bot pide datos y foto, la IA propone resumen y motivo, se registra TCK-DEMO-001 en supervisión, el supervisor deriva a Agua, el empleado genera OT vinculada, registra el resultado y responde por el canal; cierre por el circuito acordado.
- Entonces Se completa «Reclamo por pérdida de agua con foto (BASE §47)» sin errores, con los efectos que exigen RF-CRM-001, y quedan auditoría y evento del cambio. Alternativo o excepción: cuenta ajena → denegado; cuenta desconocida → aclaración; cambio de área → mismo expediente; sugerencia IA incorrecta → corrección sin perder original. Requisitos: RF-CRM-001–011, 038, 101, 200, 206.

**CP-CRM-8005 — CU-SOL-01. Alta de Internet y baja de TV (BASE §48)**

- Cubre: CU-SOL-01; RF-CRM-004, RF-CRM-060, RF-CRM-061, RF-CRM-064, RF-CRM-065; M09 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Alta de Internet y baja de TV (BASE §48)
- Entonces Definición dueña: este anexo (PA-CRM-19, Asumida DEC-072). M02 cita la parte «en lo que toca al contrato». Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: este anexo). M02 también lo describe "en lo que toca al contrato"; mientras tanto, este texto cubre solo la solicitud y su circuito de atención.» Ana solicita alta de Internet (TCK-ALTA-001) sin contrato previo; supervisión deriva; aprobación e instalación habilitan el contrato con fecha efectiva. Luego solicita la baja de TV (TCK-BAJA-001); se ejecuta conforme al circuito, se informa fecha efectiva y se conservan facturas e historia. Requisitos: RF-CRM-004, 060…

**CP-CRM-8006 — CU-CIC-01. Suspensión temporal y reactivación de Internet (BASE §53)**

- Cubre: CU-CIC-01; RF-CRM-068; RN-CRM-011; M09 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Suspensión temporal y reactivación de Internet (BASE §53)
- Entonces Definición dueña: M08 «CU-CIC-01 — Suspensión temporal y reactivación de Internet» (PA-MOR-21 de M08, Asumida DEC-072). Aquí solo el tramo de atención. Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: M08).» Ver §9.4. Requisitos: RF-CRM-068–070, RN-CRM-011–013.

**CP-CRM-8007 — CU-CRM-02. Baja pública de Internet sin registro**

- Cubre: CU-CRM-02; RF-CRM-066, RF-CRM-067, RF-CRM-079; RN-CRM-007; M09 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado actor: solicitante sin cuenta en el portal., autenticado en TEN-001 con las capabilities de su rol
- Cuando (1) desde el botón visible "Baja" de la landing elige Internet, completa nombre, documento, domicilio y email; (2) recibe en pantalla y por email el código BAJA-DEMO-7Q4K y el número de caso; (3) supervisión identifica el contrato; (4) M02 ejecuta la baja con fecha efectiva; M10 coordina retiro del módem; (5) se informa la fecha efectiva. Excepción: el email rebota → JOB-CRM-06 intenta SMS y alerta; datos que no coinciden → contacto sin divulgar información. Requisitos: RF-CRM-066, 067, 079; RN-CRM-007–009.
- Entonces Se completa «Baja pública de Internet sin registro» sin errores, con los efectos que exigen RF-CRM-066, RF-CRM-067, RF-CRM-079, y quedan auditoría y evento del cambio

**CP-CRM-8008 — CU-CRM-03. Corte zonal de Internet con aviso masivo**

- Cubre: CU-CRM-03; RF-CRM-106; M09 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Corte zonal de Internet con aviso masivo
- Entonces M10 emite `tec.networkDevice.down` (EVT-TEC-24) en el nodo OLT-DEMO-03; el CRM propone INC; el supervisor confirma; los reclamos nuevos de la zona se vinculan; el bot de WhatsApp informa "Hay una interrupción en tu zona, estimamos restablecer 18:00"; al restablecer se avisa a afectados. Requisitos: RF-CRM-106–110, 174.

**CP-CRM-8009 — CU-CRM-04. Cambio de plan de Internet**

- Cubre: CU-CRM-04; RF-CRM-072, RF-CRM-084; M09 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de plan de Internet
- Entonces Ana pide pasar de INT-100 a INT-300; ve la cotización y el proporcional informativo; acepta; M02 aplica el cambio con fecha efectiva; M05 factura el proporcional. Requisitos: RF-CRM-072, 084.

**CP-CRM-8010 — CU-CRM-05. Cambio de titular por venta de inmueble**

- Cubre: CU-CRM-05; RF-CRM-071; M09 §16
- Ola: O3 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de titular por venta de inmueble
- Entonces Cedente y cesionario presentan documentación; el caso exige ambas conformidades; M01 registra la transferencia; las deudas previas siguen con el cedente según regla de M07. Requisitos: RF-CRM-071.

**CP-CRM-8011 — CU-CRM-06. Traslado de servicio**

- Cubre: CU-CRM-06; RF-CRM-073; M09 §16
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Traslado de servicio
- Entonces El socio informa mudanza; se pide factibilidad en el nuevo domicilio y OT de traslado; al ejecutarse, M01 actualiza domicilio del servicio. Requisitos: RF-CRM-073.

**CP-CRM-8012 — CU-CRM-07. Consulta de saldo y reclamo por WhatsApp**

- Cubre: CU-CRM-07; RF-CRM-172; M09 §16
- Ola: O6 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Consulta de saldo y reclamo por WhatsApp
- Entonces Ana escribe al número oficial; el bot la identifica por teléfono vinculado verificado, informa saldo y ofrece link de pago (M07); luego elige "reclamo: Internet lento", adjunta captura; se crea el caso y se informa el número; fuera de horario se le indica el plazo de respuesta. Requisitos: RF-CRM-172–176.

**CP-CRM-8013 — CU-CRM-08. Turno presencial con derivación**

- Cubre: CU-CRM-08; RF-CRM-140; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Turno presencial con derivación
- Entonces Se emite C-014 para Comercial; el box 2 lo llama; la consulta requiere Caja; se deriva conservando el área de origen; Caja atiende y finaliza "solucionado". Requisitos: RF-CRM-140–147, 156.

**CP-CRM-8014 — CU-CRM-09. Turno online con aviso**

- Cubre: CU-CRM-09; RF-CRM-151; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Turnero: Áreas A Caja, C Comercial, T Técnica; boxes 1–3; turnos A-001, C-014; pantalla PANT-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Turno online con aviso
- Entonces El socio reserva para Atención Comercial a las 10:15; recibe recordatorio; al llegar hace check-in en el tótem; recibe aviso cuando faltan 3 turnos. Requisitos: RF-CRM-151–153.

**CP-CRM-8015 — CU-CRM-10. Oficio judicial en mesa de entradas**

- Cubre: CU-CRM-10; RF-CRM-130; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Mesa de entradas: ME-2026-00045 oficio ficticio "Juzgado Demo N.º 1"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Oficio judicial en mesa de entradas
- Entonces Ingresa un oficio con plazo de 10 días hábiles; se registra ME-2026-00045, se pasa a Legales con acuse; alerta a 2 días hábiles; se registra la salida con número y constancia. Requisitos: RF-CRM-130–134.

**CP-CRM-8016 — CU-CRM-11. Actividad recurrente regulatoria**

- Cubre: CU-CRM-11; RF-CRM-221; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Actividades: TAR-001 "Revisión mensual de caja" (mensual, margen 5/3); "Presentación trimestral" (trimestral, 10/5)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Actividad recurrente regulatoria
- Entonces Tipo "Presentación trimestral" (margen anterior 10 días, posterior 5); el job crea la ocurrencia y la cita; recordatorios por área; cierre con evidencia en término. Requisitos: RF-CRM-221–229.

**CP-CRM-8017 — CU-CRM-12. Lectura de adjunto por IA**

- Cubre: CU-CRM-12; RF-CRM-203, RF-CRM-206; M09 §16
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lectura de adjunto por IA
- Entonces El socio envía foto del medidor por WhatsApp; la IA propone número de medidor y lectura; el agente acepta el número y corrige la lectura; queda registro de ambos valores. Requisitos: RF-CRM-203, 206.

**CP-CRM-8018 — CU-CRM-13. SLA vencido y escalamiento**

- Cubre: CU-CRM-13; RF-CRM-103, RF-CRM-104, RF-CRM-122; M09 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando SLA vencido y escalamiento
- Entonces Un reclamo crítico "cable caído" con objetivo de 4 h corridas: al 75 % alerta al responsable; a las 4 h escala al supervisor; el informe registra el incumplimiento. Requisitos: RF-CRM-103, 104, 122.

**CP-CRM-8019 — CU-CRM-14. Reapertura por falla persistente**

- Cubre: CU-CRM-14; RF-CRM-021; M09 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: SLA demo: Crítico: 1 h / 4 h corridas; Alta: 4 h / 24 h hábiles; Normal: 8 h / 48 h hábiles; Solicitudes: 24 h / 10 días hábiles
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reapertura por falla persistente
- Entonces El socio responde "sigue sin funcionar" a los 3 días del cierre; el caso se reabre (ciclo 2) y vuelve al área; el indicador de reapertura lo cuenta. Requisitos: RF-CRM-021.

**CP-CRM-8020 — CU-CRM-15. Duplicado detectado**

- Cubre: CU-CRM-15; RF-CRM-020; M09 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Usuarios: sup.demo (supervisor), agente.demo (agente), agua.demo, tic.demo, recep.demo, caja.demo, mesa.demo, act.demo (responsable de actividades)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Duplicado detectado
- Entonces Un socio reclama dos veces por el mismo corte (portal y teléfono); el sistema propone el vínculo; el supervisor fusiona; el socio recibe el número principal. Requisitos: RF-CRM-020.

**CP-CRM-8021 — CU-CRM-16. Soporte TIC con bolsa de horas (si se confirma PA-CRM-12)**

- Cubre: CU-CRM-16; RF-CRM-041; M09 §16
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Soporte TIC con bolsa de horas (si se confirma PA-CRM-12)
- Entonces Una empresa socia con servicio TIC tiene 10 h mensuales bonificadas; el técnico registra 12 h; se consumen 10 de la bolsa y se solicitan a M05 2 h a valor hora configurado. Requisitos: RF-CRM-041.

**CP-CRM-8022 — CU-CRM-17. Circular de aviso de deuda con etiquetas**

- Cubre: CU-CRM-17; RF-CRM-250; M09 §16
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Circular: "Aviso deuda mayor a ARS 20.000"
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Circular de aviso de deuda con etiquetas
- Entonces El operador elige el modelo "Aviso deuda mayor a ARS 20.000", filtra por servicio y adheridos sin factura digital; aprueba; se generan PDF y etiquetas; el informe de comunicación muestra impresos y fallidos. Requisitos: RF-CRM-250–252.

**CP-CRM-8023 — CU-CRM-18. Email a caso**

- Cubre: CU-CRM-18; RF-CRM-177; RN-CRM-039; M09 §16
- Ola: O6 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Casos: TCK-DEMO-001 (pérdida de agua con foto, Ana, en tratamiento); SOL-001 (alta Internet, pendiente de documentación); REC-001 (falta de agua, vinculado a INC-001); TCK-ALTA-001 (alta Internet aprobada); TCK-BAJA-001 (baja…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Email a caso
- Entonces Un socio responde por email al aviso con asunto "[TCK-2026-000321]"; el mensaje se agrega al caso, que vuelve de "en espera del socio" a "en tratamiento". Requisitos: RF-CRM-177, RN-CRM-039.

**CP-CRM-8024 — CU-CRM-19. Trámite de tarifa social vencido**

- Cubre: CU-CRM-19; RF-CRM-080; RN-CRM-059; M09 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Tipos y subtipos: Reclamo técnico (Agua: pérdida en vereda, falta de agua, baja presión; Energía: sin suministro, cable caído [crítico]; Internet: sin servicio, lentitud), Reclamo comercial (facturación, pago no acreditado), Solicitud…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Trámite de tarifa social vencido
- Entonces El socio tenía constancia con vencimiento anual; JOB-CRM-07 la detecta vencida sin otra vigente y solicita a M04/M07 la baja del beneficio desde el próximo período; se avisa al socio. Requisitos: RF-CRM-080, RN-CRM-059, 060.

**CP-CRM-8025 — CU-CRM-20. Cancelación con instalación offline en conflicto (ESC-03)**

- Cubre: CU-CRM-20; RF-CRM-076; RN-CRM-027; relacionados: ESC-03; M09 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M09 §18.
- Datos de prueba: Áreas CRM: Supervisión, Comercial, Agua, Energía, Internet/TIC, Caja, Legales, Mesa de entradas
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cancelación con instalación offline en conflicto (ESC-03)
- Entonces El socio cancela su alta mientras el instalador sin conexión ya instaló; al sincronizar, M10 informa ejecución; el caso pasa a "en conflicto" con ambas evidencias para que supervisión decida. Requisitos: RF-CRM-076, RN-CRM-027.
