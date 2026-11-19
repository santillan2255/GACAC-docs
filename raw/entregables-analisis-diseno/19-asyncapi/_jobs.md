# Catálogo de jobs por módulo

Jobs de T11 §12.7 (propios) y §12.8 (por módulo) con su clase de cola de T01. No son mensajes del bus: se encolan en las colas de T01 y, cuando se disparan por evento, se suscriben al canal del evento (T11 §12.6 regla 8). Generado por `_trabajo/gen_asyncapi.py`.

| JOB-ID | Nombre | Módulo | Cola | Disparo | Estado | T11 línea |
|---|---|---|---|---|---|---|
| JOB-WFL-01 | `wfl:ejecutar-operacion` | T11 | `events` | Al aprobar (EVT-WFL-002) o por pedido directo | vigente | 3425 |
| JOB-WFL-02 | `wfl:reparar-operaciones` | T11 | `maintenance` | Cada 5 min | vigente | 3426 |
| JOB-WFL-03 | `wfl:conciliar-inciertas` | T11 | `integration` | Cada 15 min | vigente | 3427 |
| JOB-WFL-04 | `wfl:sla-monitor` | T11 | `events` | Cada minuto | vigente | 3428 |
| JOB-WFL-05 | `wfl:vencer-aprobaciones` | T11 | `events` | Cada 5 min | vigente | 3429 |
| JOB-WFL-06 | `wfl:proyectar-bandeja` | T11 | `events` | Por evento proyectable | vigente | 3430 |
| JOB-WFL-07 | `wfl:recalcular-vencimientos-bandeja` | T11 | `batch` | Al cambiar feriados, calendarios o políticas SLA; diario 00:30 | vigente | 3431 |
| JOB-WFL-08 | `wfl:reconstruir-proyecciones` | T11 | `maintenance` | A demanda, tras restauración (EVT-PLA-14) | vigente | 3432 |
| JOB-WFL-09 | `wfl:recordatorios-tareas` | T11 | `notifications` | Cada 15 min | vigente | 3433 |
| JOB-WFL-10 | `wfl:generar-tareas-recurrentes` | T11 | `batch` | Diario 01:15 | vigente | 3434 |
| JOB-WFL-11 | `wfl:renderizar-documento` | T11 | `interactive` | Por pedido (wfl.templates.render) | vigente | 3435 |
| JOB-WFL-12 | `wfl:renderizar-lote` | T11 | `batch` | Por pedido masivo (facturas de un lote, recibos de sueldo) | vigente | 3436 |
| JOB-WFL-13 | `wfl:procesar-subida` | T11 | `interactive` | Tras JOB-PLA-21 limpio | vigente | 3437 |
| JOB-WFL-14 | `wfl:aplicar-retencion` | T11 | `maintenance` | Diario 03:30 | vigente | 3438 |
| JOB-WFL-15 | `wfl:purgar-documentos` | T11 | `maintenance` | Diario 04:00, tras la aprobación de purga | vigente | 3439 |
| JOB-WFL-16 | `wfl:exportar-expediente` | T11 | `export` | A demanda | vigente | 3440 |
| JOB-WFL-17 | `wfl:enviar-a-firma` | T11 | `integration` | Al pedir firma digital (EVT-WFL-041) | vigente | 3441 |
| JOB-WFL-18 | `wfl:consultar-estado-firma` | T11 | `integration` | Cada 15 min mientras haya solicitudes abiertas con proveedor sin webhook | vigente | 3442 |
| JOB-WFL-19 | `wfl:vencer-firmas` | T11 | `events` | Cada hora | vigente | 3443 |
| JOB-WFL-20 | `wfl:sellar-documento` | T11 | `interactive` | Al completar la firma | vigente | 3444 |
| JOB-WFL-21 | `wfl:proyectar-agenda` | T11 | `events` | Por evento agendable | vigente | 3445 |
| JOB-WFL-22 | `wfl:replay-eventos` | T11 | `maintenance` | A demanda (T-SOP con aprobación) | vigente | 3446 |
| JOB-WFL-23 | `wfl:verificar-integridad-documentos` | T11 | `maintenance` | Semanal, domingo 04:30 | vigente | 3447 |
| JOB-WFL-24 | `wfl:importar-definiciones` | T11 | `batch` | A demanda (paquetes de T04, migración T07) | vigente | 3448 |
| JOB-WFL-25 | `wfl:indicadores-bandeja` | T11 | `batch` | Cada hora | vigente | 3449 |
| JOB-WFL-26 | `wfl:vencer-enlaces-compartidos` | T11 | `maintenance` | Cada hora | vigente | 3450 |
| JOB-WFL-27 | `wfl:alertar-secuencias` | T11 | `maintenance` | Diario 06:00 | vigente | 3451 |
| JOB-WFL-28 | `wfl:delegaciones-vigencia` | T11 | `events` | Cada 15 min | vigente | 3452 |
| JOB-WFL-29 | `wfl:reasignar-huerfanos` | T11 | `events` | Por EVT-IAM-03, EVT-SUE-03 y EVT-SUE-08 | vigente | 3453 |
| JOB-WFL-30 | `wfl:vencer-documentos` | T11 | `maintenance` | Diario 05:30 | vigente | 3454 |
| JOB-WFL-31 | `wfl:programador` | T11 | `maintenance` | Continuo | vigente | 3455 |
| JOB-WFL-32 | `wfl:purgar-corridas` | T11 | `maintenance` | Diario 02:30 | vigente | 3456 |
| JOB-PER-01 | `per:verificar-cuit-arca` | M01 | `integration` | Alta o cambio de CUIT/CUIL; manual | vigente | 3466 |
| JOB-PER-02 | `per:geocodificar-domicilios` | M01 | `integration` | Alta o cambio de domicilio; lote nocturno | vigente | 3467 |
| JOB-PER-03 | `per:detectar-duplicados` | M01 | `batch` | Diario 02:00; al importar | vigente | 3468 |
| JOB-PER-04 | `per:vencimientos` | M01 | `maintenance` | Diario 01:00 | vigente | 3469 |
| JOB-PER-05 | `per:mayoria-edad-adherentes` | M01 | `maintenance` | Diario | reemplazado por JOB-SOC-01 | 3470 |
| JOB-PER-06 | `per:adherentes-condicion` | M01 | `batch` | Manual o programado | vigente | 3471 |
| JOB-PER-07 | `per:ejecutar-transferencia` | M01 | `events` | Transferencia aprobada (EVT-WFL-002) | vigente | 3472 |
| JOB-PER-08 | `per:fusionar-personas` | M01 | `events` | Fusión aprobada | vigente | 3473 |
| JOB-PER-09 | `per:importar` | M01 | `batch` | Importación confirmada | vigente | 3474 |
| JOB-PER-10 | `per:revalidar-padron-arca` | M01 | `integration` | Mensual (PRM-PER-014) | retirado | 3475 |
| JOB-PER-11 | `per:anonimizar` | M01 | `maintenance` | Supresión resuelta; plazo cumplido | vigente | 3476 |
| JOB-PER-12 | `per:exportar-padron` | M01 | `export` | Pedido de exportación | vigente | 3477 |
| JOB-CAT-01 | `cat:altas-automaticas` | M02 | `events` | Evento | vigente | 3483 |
| JOB-CAT-02 | `cat:tramite-masivo` | M02 | `batch` | Aprobación | vigente | 3484 |
| JOB-CAT-03 | `cat:copiar-servicio` | M02 | `batch` | Comando | vigente | 3485 |
| JOB-CAT-04 | `cat:publicar-version-programada` | M02 | `maintenance` | Diario 00:05 | vigente | 3486 |
| JOB-CAT-05 | `cat:vencimiento-provisorios` | M02 | `maintenance` | Diario | vigente | 3487 |
| JOB-CAT-06 | `cat:vencimiento-no-facturar` | M02 | `maintenance` | Diario | vigente | 3488 |
| JOB-CAT-07 | `cat:mayoria-edad-adherentes` | M02 | `maintenance` | Diario | reemplazado por JOB-SOC-01 | 3489 |
| JOB-CAT-08 | `cat:fin-suspension-voluntaria` | M02 | `maintenance` | Diario | vigente | 3490 |
| JOB-CAT-09 | `cat:devoluciones-vencidas` | M02 | `maintenance` | Evento EVT-STK-07 | vigente | 3491 |
| JOB-CAT-10 | `cat:fin-promociones` | M02 | `events` | Evento EVT-TAR-012 | vigente | 3492 |
| JOB-CAT-11 | `cat:carencias` | M02 | `maintenance` | Diario | vigente | 3493 |
| JOB-CAT-12 | `cat:fin-cuotas-obra` | M02 | `events` | Última cuota facturada (EVT-FAC-20) | vigente | 3494 |
| JOB-CAT-13 | `cat:crear-contratos-obra` | M02 | `events` | Evento EVT-TEC-25 tec.levy.approved | vigente | 3495 |
| JOB-MED-01 | `med:generar-lotes` | M03 | `batch` | Diario según cronograma; a pedido | vigente | 3501 |
| JOB-MED-02 | `med:asignar-automatica` | M03 | `interactive` | A pedido | vigente | 3502 |
| JOB-MED-03 | `med:confirmar-lote` | M03 | `batch` | A pedido; al completar la recepción | vigente | 3503 |
| JOB-MED-04 | `med:importar-lecturas` | M03 | `batch` | A pedido | vigente | 3504 |
| JOB-MED-05 | `med:estimar` | M03 | `batch` | A pedido; al cerrar lote | vigente | 3505 |
| JOB-MED-06 | `med:dividir-consumos` | M03 | `batch` | A pedido; al confirmar lote | vigente | 3506 |
| JOB-MED-07 | `med:distribuir-consumos` | M03 | `batch` | Al aprobar el padre; a pedido | vigente | 3507 |
| JOB-MED-08 | `med:regularizar-estimados` | M03 | `batch` | Al validar lectura real; diario | vigente | 3508 |
| JOB-MED-09 | `med:detectar-transgresiones` | M03 | `batch` | Al aprobar demanda; mensual | vigente | 3509 |
| JOB-MED-10 | `med:toma-estado` | M03 | `integration` | Según cronograma; a pedido | vigente | 3510 |
| JOB-MED-11 | `med:importar-ami` | M03 | `integration` | Horario o diario por sistema | vigente | 3511 |
| JOB-MED-12 | `med:ejecutar-operaciones-remotas` | M03 | `integration` | Continuo | vigente | 3512 |
| JOB-MED-13 | `med:solicitar-credito-prepago` | M03 | `integration` | Continuo | vigente | 3513 |
| JOB-MED-14 | `med:conciliar-prepago` | M03 | `integration` | Diario (PRM-MED-135) | vigente | 3514 |
| JOB-MED-15 | `med:balance-inyeccion` | M03 | `batch` | Al aprobar consumos de generación distribuida | vigente | 3515 |
| JOB-MED-16 | `med:abrir-ventanas-autolectura` | M03 | `maintenance` | Diario | vigente | 3516 |
| JOB-MED-17 | `med:detectar-sin-lectura` | M03 | `batch` | Al cerrar la ventana del cronograma | vigente | 3517 |
| JOB-MED-18 | `med:detectar-consumo-no-registrado` | M03 | `batch` | Mensual tras aprobación | vigente | 3518 |
| JOB-MED-19 | `med:verificar-salud-conectores` | M03 | `maintenance` | Cada 15 min | vigente | 3519 |
| JOB-MED-20 | `med:depurar-logs-conector` | M03 | `maintenance` | Diario | vigente | 3520 |
| JOB-MED-21 | `med:archivar-fotos` | M03 | `maintenance` | Mensual | vigente | 3521 |
| JOB-MED-22 | `med:importar-curvas` | M03 | `integration` | Diario (extensión) | vigente | 3522 |
| JOB-TAR-01 | `tar:activar-versiones` | M04 | `maintenance` | Diario 00:05 y al publicar | vigente | 3528 |
| JOB-TAR-02 | `tar:simular-masivo` | M04 | `batch` | A pedido | vigente | 3529 |
| JOB-TAR-03 | `tar:calcular-lote` | M04 | `batch` | A pedido de M05 | vigente | 3530 |
| JOB-TAR-04 | `tar:importar-padron` | M04 | `batch` | A pedido | vigente | 3531 |
| JOB-TAR-05 | `tar:recategorizar` | M04 | `batch` | A pedido | vigente | 3532 |
| JOB-TAR-06 | `tar:diferencias-retroactivas` | M04 | `batch` | Al publicar con vigencia pasada; a pedido | vigente | 3533 |
| JOB-TAR-07 | `tar:migrar-cuadros` | M04 | `batch` | Migración (T07) | vigente | 3534 |
| JOB-TAR-08 | `tar:traducir-formulas` | M04 | `batch` | Migración; a pedido | vigente | 3535 |
| JOB-TAR-09 | `tar:tasar-llamadas` | M04 | `events` | EVT-TEC-27; cada hora (PRM-TAR-083) | vigente | 3536 |
| JOB-TAR-10 | `tar:retasar` | M04 | `batch` | A pedido | vigente | 3537 |
| JOB-TAR-11 | `tar:aviso-fin-promociones` | M04 | `notifications` | Diario | vigente | 3538 |
| JOB-TAR-12 | `tar:purgar-simulaciones` | M04 | `maintenance` | Semanal | vigente | 3539 |
| JOB-TAR-13 | `tar:exportar-padron` | M04 | `export` | A pedido | vigente | 3540 |
| JOB-TAR-14 | `tar:crear-planes-obra` | M04 | `events` | Eventos EVT-TEC-25 tec.levy.approved y EVT-CAT-09 de contratos tipo 17 | vigente | 3541 |
| JOB-FAC-01 | `fac:preparar-lote` | M05 | `batch` | API de preparación | vigente | 3547 |
| JOB-FAC-02 | `fac:prefacturar-lote` | M05 | `batch` | API de prefacturación; nueva versión de universo | vigente | 3548 |
| JOB-FAC-03 | `fac:emitir-lote` | M05 | `batch` | API de emisión o reanudación | vigente | 3549 |
| JOB-FAC-04 | `fac:generar-pdf` | M05 | `batch` | EVT-FIS-01 o emisión sin autorización | vigente | 3550 |
| JOB-FAC-05 | `fac:generar-codigos` | M05 | `batch` | Emisión | vigente | 3551 |
| JOB-FAC-06 | `fac:distribuir-lote` | M05 | `notifications` | API o automático al autorizar | vigente | 3552 |
| JOB-FAC-07 | `fac:reprocesar-excepciones` | M05 | `batch` | API o al resolver excepciones | vigente | 3553 |
| JOB-FAC-08 | `fac:conciliar-inciertos` | M05 | `integration` | Cada 15 min | vigente | 3554 |
| JOB-FAC-09 | `fac:anular-masivo` | M05 | `batch` | Solicitud aprobada (EVT-WFL-002) | vigente | 3555 |
| JOB-FAC-10 | `fac:recategorizar` | M05 | `batch` | Operación aprobada | vigente | 3556 |
| JOB-FAC-11 | `fac:retroactivos` | M05 | `batch` | Operación aprobada | vigente | 3557 |
| JOB-FAC-12 | `fac:modificacion-masiva` | M05 | `batch` | Operación aprobada | vigente | 3558 |
| JOB-FAC-13 | `fac:importar-terceros` | M05 | `batch` | Importación confirmada | vigente | 3559 |
| JOB-FAC-14 | `fac:generar-talones` | M05 | `batch` | API | vigente | 3560 |
| JOB-FAC-15 | `fac:cerrar-ciclo` | M05 | `batch` | Acta aprobada | vigente | 3561 |
| JOB-FAC-16 | `fac:alerta-pendientes-autorizacion` | M05 | `maintenance` | Diario | vigente | 3562 |
| JOB-FAC-17 | `fac:programar-ciclos` | M05 | `maintenance` | Diario 02:00 | vigente | 3563 |
| JOB-FAC-18 | `fac:aplicar-resultado-fiscal` | M05 | `events` | Eventos fis.* | vigente | 3564 |
| JOB-FIS-01 | `fis:autorizar-cola` | M06 | `integration` | Por evento y cada minuto; serializa por punto de venta + tipo | vigente | 3570 |
| JOB-FIS-02 | `fis:renovar-ticket` | M06 | `integration` | A demanda; preventivo cada 30 min | vigente | 3571 |
| JOB-FIS-03 | `fis:probar-conector` | M06 | `maintenance` | A demanda; cada 15 min | vigente | 3572 |
| JOB-FIS-04 | `fis:conciliar-incierto` | M06 | `integration` | Tras timeout; cada 5 min | vigente | 3573 |
| JOB-FIS-05 | `fis:conciliar-arca` | M06 | `integration` | Diario 02:00; tras restauración | vigente | 3574 |
| JOB-FIS-06 | `fis:solicitar-caea` | M06 | `integration` | N días antes de cada quincena | vigente | 3575 |
| JOB-FIS-07 | `fis:informar-caea` | M06 | `integration` | Diario; al cierre de quincena | vigente | 3576 |
| JOB-FIS-08 | `fis:importar-padron` | M06 | `batch` | A demanda; mensual | retirado | 3577 |
| JOB-FIS-09 | `fis:sincronizar-puntos-venta` | M06 | `integration` | Diario | vigente | 3578 |
| JOB-FIS-10 | `fis:generar-libro-iva` | M06 | `export` | A demanda | vigente | 3579 |
| JOB-FIS-11 | `fis:generar-lid` | M06 | `export` | A demanda; mensual | vigente | 3580 |
| JOB-FIS-12 | `fis:conciliar-mis-comprobantes` | M06 | `batch` | A demanda | vigente | 3581 |
| JOB-FIS-13 | `fis:generar-regimen` | M06 | `export` | A demanda; según calendario | vigente | 3582 |
| JOB-FIS-14 | `fis:calendario-fiscal` | M06 | `maintenance` | Diario | vigente | 3583 |
| JOB-FIS-15 | `fis:rendicion-terceros` | M06 | `batch` | Según convenio | vigente | 3584 |
| JOB-FIS-16 | `fis:generar-informe-regulatorio` | M06 | `export` | A demanda; según calendario | vigente | 3585 |
| JOB-FIS-17 | `fis:sincronizar-parametros-arca` | M06 | `integration` | Semanal (plataforma) | vigente | 3586 |
| JOB-FIS-18 | `fis:alertas-credenciales` | M06 | `maintenance` | Diario | vigente | 3587 |
| JOB-FIS-19 | `fis:revalidar-condicion` | M06 | `integration` | Mensual | vigente | 3588 |
| JOB-FIS-20 | `fis:pasarela-importar` | M06 | `batch` | Por carga o API | vigente | 3589 |
| JOB-COB-01 | `cob:exportar-deuda-ente` | M07 | `integration` | Programado por ente; manual | vigente | 3595 |
| JOB-COB-02 | `cob:importar-rendicion` | M07 | `integration` | Archivo nuevo en SFTP (T06); cada 30 min en ventana | vigente | 3596 |
| JOB-COB-03 | `cob:sondear-rendicion-api` | M07 | `integration` | Diario y a demanda | vigente | 3597 |
| JOB-COB-04 | `cob:procesar-webhook` | M07 | `integration` | Webhook recibido (tras JOB-INT-03) | vigente | 3598 |
| JOB-COB-05 | `cob:resolver-inciertos` | M07 | `integration` | Intención incierta; backoff 1-5-15-60 min y luego 6 h hasta 72 h | vigente | 3599 |
| JOB-COB-06 | `cob:conciliar-pasarelas-diario` | M07 | `integration` | Diario 06:00 | vigente | 3600 |
| JOB-COB-07 | `cob:presentar-debitos` | M07 | `integration` | Diario (evalúa fechas de corte) | vigente | 3601 |
| JOB-COB-08 | `cob:importar-rechazos-debito` | M07 | `integration` | Diario | vigente | 3602 |
| JOB-COB-09 | `cob:sincronizar-adhesiones` | M07 | `integration` | Diario | vigente | 3603 |
| JOB-COB-10 | `cob:cancelacion-automatica-creditos` | M07 | `batch` | Diario tras facturación; manual | vigente | 3604 |
| JOB-COB-11 | `cob:emitir-resumenes` | M07 | `batch` | EVT-FAC-05; cierre de ciclo | vigente | 3605 |
| JOB-COB-12 | `cob:vencer-intenciones` | M07 | `maintenance` | Cada hora | vigente | 3606 |
| JOB-COB-13 | `cob:recordatorio-cierre-caja` | M07 | `notifications` | Fin de jornada configurable | vigente | 3607 |
| JOB-COB-14 | `cob:verificar-integridad-auxiliar` | M07 | `maintenance` | Diario 03:00 | vigente | 3608 |
| JOB-COB-15 | `cob:reparar-pendientes` | M07 | `maintenance` | Cada 10 min | vigente | 3609 |
| JOB-COB-16 | `cob:qr-masivo-facturas` | M07 | `integration` | EVT-FAC-05 | vigente | 3610 |
| JOB-COB-17 | `cob:liquidar-comisiones-cobradores` | M07 | `batch` | Mensual; manual | vigente | 3611 |
| JOB-COB-18 | `cob:procesar-novedades-adhesion` | M07 | `batch` | Archivo de novedades | vigente | 3612 |
| JOB-COB-19 | `cob:importar-contracargos` | M07 | `integration` | Diario | vigente | 3613 |
| JOB-COB-20 | `cob:conciliacion-cobranzas` | M07 | `batch` | Diario | vigente | 3614 |
| JOB-COB-21 | `cob:escalar-no-identificados` | M07 | `maintenance` | Diario | vigente | 3615 |
| JOB-COB-22 | `cob:actualizar-deuda-publicada` | M07 | `integration` | EVT-COB-02, EVT-FAC-08; lote diario | vigente | 3616 |
| JOB-MOR-01 | `mor:intereses-facturar` | M08 | `batch` | A demanda | vigente | 3622 |
| JOB-MOR-02 | `mor:evaluar-mora` | M08 | `batch` | Diario 03:00 | vigente | 3623 |
| JOB-MOR-03 | `mor:generar-candidatos` | M08 | `batch` | A demanda o programado por política | vigente | 3624 |
| JOB-MOR-04 | `mor:procesar-instancia` | M08 | `batch` | A demanda o programado (autoAdvance) | vigente | 3625 |
| JOB-MOR-05 | `mor:vencer-promesas` | M08 | `maintenance` | Diario | vigente | 3626 |
| JOB-MOR-06 | `mor:alertas-protecciones` | M08 | `maintenance` | Diario | vigente | 3627 |
| JOB-MOR-07 | `mor:evaluar-reconexion` | M08 | `events` | Por evento (EVT-COB-04, EVT-MOR-14) | vigente | 3628 |
| JOB-MOR-08 | `mor:fin-suspension-voluntaria` | M08 | `maintenance` | Diario | vigente | 3629 |
| JOB-MOR-09 | `mor:vencer-anticipos` | M08 | `maintenance` | Diario | vigente | 3630 |
| JOB-MOR-10 | `mor:emitir-cuotas` | M08 | `batch` | Diario | vigente | 3631 |
| JOB-MOR-11 | `mor:control-convenios` | M08 | `batch` | Diario | vigente | 3632 |
| JOB-MOR-12 | `mor:recalcular-cuotas-fiscal` | M08 | `batch` | Mensual; a demanda | vigente | 3633 |
| JOB-MOR-13 | `mor:deuda-a-prescribir` | M08 | `batch` | Mensual | vigente | 3634 |
| JOB-MOR-14 | `mor:exportacion-regulatoria` | M08 | `export` | Según regulador | vigente | 3635 |
| JOB-MOR-15 | `mor:ajuste-indices` | M08 | `maintenance` | Mensual | vigente | 3636 |
| JOB-MOR-16 | `mor:actualizar-depositos` | M08 | `batch` | Mensual | vigente | 3637 |
| JOB-MOR-17 | `mor:segmentar-deuda` | M08 | `batch` | Diario | vigente | 3638 |
| JOB-MOR-18 | `mor:ejecutar-ventana` | M08 | `events` | Cada 15 min | vigente | 3639 |
| JOB-CRM-01 | `crm:sla-monitor` | M09 | `events` | Cada minuto | vigente | 3645 |
| JOB-CRM-02 | `crm:ai-classify` | M09 | `ai` | Por evento | vigente | 3646 |
| JOB-CRM-03 | `crm:auto-close-resolved` | M09 | `maintenance` | Diario 02:00 | vigente | 3647 |
| JOB-CRM-04 | `crm:stale-cases` | M09 | `notifications` | Diario 07:00 | vigente | 3648 |
| JOB-CRM-05 | `crm:incident-detect` | M09 | `events` | Cada 5 min | vigente | 3649 |
| JOB-CRM-06 | `crm:cancellation-receipts` | M09 | `notifications` | Cada 15 min | vigente | 3650 |
| JOB-CRM-07 | `crm:procedure-expiry` | M09 | `maintenance` | Diario 03:00 | vigente | 3651 |
| JOB-CRM-08 | `crm:queue-day-close` | M09 | `maintenance` | Diario al cierre de sucursal | vigente | 3652 |
| JOB-CRM-09 | `crm:activity-generate` | M09 | `batch` | Diario 01:00 | vigente | 3653 |
| JOB-CRM-10 | `crm:activity-reminders` | M09 | `notifications` | Diario 08:00 | vigente | 3654 |
| JOB-CRM-11 | `crm:circular-generate` | M09 | `batch` | A demanda | vigente | 3655 |
| JOB-CRM-12 | `crm:email-ingest` | M09 | `integration` | Cada minuto o por webhook | vigente | 3656 |
| JOB-CRM-13 | `crm:bot-step` | M09 | `interactive` | Por mensaje | vigente | 3657 |
| JOB-CRM-14 | `crm:conversation-expire` | M09 | `maintenance` | Cada 5 min | vigente | 3658 |
| JOB-CRM-15 | `crm:appointment-reminders` | M09 | `notifications` | Cada 15 min | vigente | 3659 |
| JOB-CRM-16 | `crm:command-retry` | M09 | `events` | Cada minuto | vigente | 3660 |
| JOB-CRM-17 | `crm:metrics-snapshot` | M09 | `batch` | Cada hora | vigente | 3661 |
| JOB-CRM-18 | `crm:whatsapp-templates-sync` | M09 | `integration` | Diario | retirado | 3662 |
| JOB-TEC-01 | `tec:liberar-reservas` | M10 | `maintenance` | Cada minuto | vigente | 3668 |
| JOB-TEC-02 | `tec:generar-ot-masivas` | M10 | `batch` | A demanda | vigente | 3669 |
| JOB-TEC-03 | `tec:cerrar-ot-masivas` | M10 | `batch` | A demanda | vigente | 3670 |
| JOB-TEC-04 | `tec:reparar-efectos` | M10 | `maintenance` | Cada 5 min | vigente | 3671 |
| JOB-TEC-05 | `tec:generar-mantenimiento` | M10 | `batch` | Diario 02:00 | vigente | 3672 |
| JOB-TEC-06 | `tec:aprovisionar` | M10 | `integration` | Continuo | vigente | 3673 |
| JOB-TEC-07 | `tec:monitorear-equipos` | M10 | `integration` | Cada 5 min | vigente | 3674 |
| JOB-TEC-08 | `tec:recordatorios-visitas` | M10 | `notifications` | Cada 15 min | retirado | 3675 |
| JOB-TEC-09 | `tec:importar-cdr` | M10 | `batch` | A demanda; programado | vigente | 3676 |
| JOB-TEC-10 | `tec:geocodificar-pendientes` | M10 | `integration` | Cada hora | vigente | 3677 |
| JOB-TEC-11 | `tec:conciliar-aprovisionamiento` | M10 | `integration` | Diario; tras restauración | vigente | 3678 |
| JOB-TEC-12 | `tec:escalar-conflictos` | M10 | `events` | Cada hora | vigente | 3679 |
| JOB-TEC-13 | `tec:exportar-gis` | M10 | `export` | A demanda; programado | vigente | 3680 |
| JOB-TEC-14 | `tec:vencer-factibilidades` | M10 | `maintenance` | Diario | vigente | 3681 |
| JOB-TEC-15 | `tec:impacto-interrupcion` | M10 | `batch` | A demanda | vigente | 3682 |
| JOB-TEC-16 | `tec:alertas-ot-vencidas` | M10 | `notifications` | Cada 30 min | vigente | 3683 |
| JOB-TEC-17 | `tec:escalar-guardia` | M10 | `notifications` | Cada minuto | vigente | 3684 |
| JOB-VEN-01 | `ven:vencer-presupuestos` | M11 | `maintenance` | Diario 00:30 | vigente | 3690 |
| JOB-VEN-02 | `ven:recordar-presupuestos` | M11 | `notifications` | Diario | vigente | 3691 |
| JOB-VEN-03 | `ven:preparar-cuotas-corrida` | M11 | `batch` | A demanda de M05 | vigente | 3692 |
| JOB-VEN-04 | `ven:modificacion-masiva-cuotas` | M11 | `batch` | A demanda | vigente | 3693 |
| JOB-VEN-05 | `ven:actualizacion-masiva-precios` | M11 | `batch` | A demanda | vigente | 3694 |
| JOB-VEN-06 | `ven:importar-ventas-terceros` | M11 | `batch` | A demanda desde M05 | vigente | 3695 |
| JOB-VEN-07 | `ven:sincronizar-campo` | M11 | `interactive` | Al sincronizar | vigente | 3696 |
| JOB-CMP-01 | `cmp:vencer-cotizaciones` | M12 | `maintenance` | Diario 01:00 | vigente | 3702 |
| JOB-CMP-02 | `cmp:conciliar-tres-vias` | M12 | `events` | Al registrar factura o recepción; nocturno | vigente | 3703 |
| JOB-CMP-03 | `cmp:alertas-vencimientos` | M12 | `notifications` | Diario | vigente | 3704 |
| JOB-CMP-04 | `cmp:borradores-mis-comprobantes` | M12 | `batch` | Tras JOB-FIS-12 | vigente | 3705 |
| JOB-CMP-05 | `cmp:lectura-ia` | M12 | `ai` | A demanda | vigente | 3706 |
| JOB-CMP-06 | `cmp:desempeno-proveedores` | M12 | `batch` | Semanal | vigente | 3707 |
| JOB-CMP-07 | `cmp:expandir-previsiones` | M12 | `batch` | Diario | vigente | 3708 |
| JOB-CMP-08 | `cmp:aprobacion-masiva` | M12 | `batch` | A demanda (usa wfl.services.requestApproval por documento) | vigente | 3709 |
| JOB-CMP-09 | `cmp:liquidar-derechos-senales` | M12 | `batch` | Mensual (PRM-CMP-116) y a demanda | vigente | 3710 |
| JOB-CMP-10 | `cmp:controlar-compra-mayorista` | M12 | `batch` | Al registrar una factura mayorista; diario de repaso | vigente | 3711 |
| JOB-STK-01 | `stk:verificar-saldos` | M13 | `maintenance` | Diario; antes del cierre | vigente | 3717 |
| JOB-STK-02 | `stk:vencer-reservas` | M13 | `maintenance` | Cada hora | vigente | 3718 |
| JOB-STK-03 | `stk:sugerir-reposicion` | M13 | `batch` | Diario | vigente | 3719 |
| JOB-STK-04 | `stk:rendicion-cuadrillas` | M13 | `batch` | Semanal configurable | vigente | 3720 |
| JOB-STK-05 | `stk:devoluciones-vencidas` | M13 | `maintenance` | Diario | vigente | 3721 |
| JOB-STK-06 | `stk:preparar-cierre` | M13 | `batch` | Mensual; a demanda | vigente | 3722 |
| JOB-STK-07 | `stk:amortizar-bienes` | M13 | `batch` | Mensual o anual | vigente | 3723 |
| JOB-STK-08 | `stk:mrp` | M13 | `batch` | A demanda; diario | vigente | 3724 |
| JOB-STK-09 | `stk:vencimientos` | M13 | `maintenance` | Diario | vigente | 3725 |
| JOB-STK-10 | `stk:procesar-sync-campo` | M13 | `interactive` | Continuo | vigente | 3726 |
| JOB-STK-11 | `stk:importar` | M13 | `batch` | A demanda | vigente | 3727 |
| JOB-STK-12 | `stk:migrar-procoop` | M13 | `batch` | A demanda (O11) | vigente | 3728 |
| JOB-TES-01 | `tes:recalcular-saldos` | M14 | `maintenance` | Nocturno | vigente | 3734 |
| JOB-TES-02 | `tes:importar-extracto` | M14 | `batch` | A demanda | vigente | 3735 |
| JOB-TES-03 | `tes:conciliar-automatico` | M14 | `batch` | Tras importación o sincronización; a demanda | vigente | 3736 |
| JOB-TES-04 | `tes:sincronizar-interbanking` | M14 | `integration` | Diario (PRM-TES-058) | vigente | 3737 |
| JOB-TES-05 | `tes:generar-archivo-pago` | M14 | `export` | A demanda | vigente | 3738 |
| JOB-TES-06 | `tes:procesar-respuesta-banco` | M14 | `integration` | Al recibir; a demanda | vigente | 3739 |
| JOB-TES-07 | `tes:abrir-caja-pagos` | M14 | `maintenance` | Diario 00:05 (PRM-TES-040) | vigente | 3740 |
| JOB-TES-08 | `tes:verificar-cajas-abiertas` | M14 | `notifications` | Diario 07:00 | vigente | 3741 |
| JOB-TES-09 | `tes:actualizar-cotizaciones` | M14 | `integration` | Diario, hora configurable | vigente | 3742 |
| JOB-TES-10 | `tes:proyectar-flujo` | M14 | `batch` | Nocturno; a demanda | vigente | 3743 |
| JOB-TES-11 | `tes:alertas-vencimientos` | M14 | `notifications` | Diario | vigente | 3744 |
| JOB-TES-12 | `tes:importar-liquidaciones-tarjeta` | M14 | `batch` | A demanda (extensión) | vigente | 3745 |
| JOB-TES-13 | `tes:reconciliar-externos` | M14 | `integration` | A demanda (recuperación) | vigente | 3746 |
| JOB-TES-14 | `tes:reintentar-eventos` | M14 | `events` | Cada 5 min | retirado | 3747 |
| JOB-CON-01 | `con:contabilizar-evento` | M15 | `events` (cola propia `con-realtime`) | Por evento | vigente | 3755 |
| JOB-CON-02 | `con:cierre-diario` | M15 | `batch` (cola propia `con-batch`) | Diario 02:00; a demanda | vigente | 3756 |
| JOB-CON-03 | `con:reprocesar-pendientes` | M15 | `batch` (cola propia `con-batch`) | Al publicar configuración; a demanda | vigente | 3757 |
| JOB-CON-05 | `con:cierre-ejercicio` | M15 | `batch` (cola propia `con-closing`) | A demanda | vigente | 3758 |
| JOB-CON-06 | `con:ajuste-inflacion` | M15 | `batch` (cola propia `con-closing`) | A demanda (anual o mensual) | vigente | 3759 |
| JOB-CON-07 | `con:distribuir-costos` | M15 | `batch` (cola propia `con-batch`) | Mensual; a demanda | vigente | 3760 |
| JOB-CON-08 | `con:conciliar` | M15 | `batch` (cola propia `con-batch`) | Diario y mensual | vigente | 3761 |
| JOB-CON-09 | `con:simular-escenario` | M15 | `batch` (cola propia `con-sim`) | A demanda | vigente | 3762 |
| JOB-CON-10 | `con:proyectar-planes` | M15 | `batch` (cola propia `con-batch`) | Por asiento; reconstrucción | vigente | 3763 |
| JOB-CON-11 | `con:reconstruir-saldos` | M15 | `batch` (cola propia `con-batch`) | Nocturno | vigente | 3764 |
| JOB-CON-12 | `con:exportar-externo` | M15 | `integration` (cola propia `con-integration`) | Programado; a demanda | vigente | 3765 |
| JOB-CON-13 | `con:importar-asientos` | M15 | `batch` (cola propia `con-batch`) | Carga de archivo | vigente | 3766 |
| JOB-CON-14 | `con:presupuesto-ejecucion` | M15 | `batch` (cola propia `con-batch`) | Nocturno y por evento | vigente | 3767 |
| JOB-CON-15 | `con:generar-estados` | M15 | `batch` (cola propia `con-closing`) | A demanda | vigente | 3768 |
| JOB-CON-16 | `con:renumerar-asientos` | M15 | `batch` (cola propia `con-closing`) | A demanda | vigente | 3769 |
| JOB-CON-17 | `con:anular-masivo` | M15 | `batch` (cola propia `con-batch`) | A demanda | vigente | 3770 |
| JOB-CON-18 | `con:transcribir-rubricado` | M15 | `batch` (cola propia `con-closing`) | A demanda | vigente | 3771 |
| JOB-CON-19 | `con:salud-configuracion` | M15 | `maintenance` (cola propia `con-batch`) | Diario y al publicar | vigente | 3772 |
| JOB-CON-20 | `con:asientos-recurrentes` | M15 | `batch` (cola propia `con-batch`) | Diario | vigente | 3773 |
| JOB-CON-21 | `con:provisiones-cierre` | M15 | `batch` (cola propia `con-closing`) | Mensual | vigente | 3774 |
| JOB-CON-22 | `con:diferencia-cambio` | M15 | `batch` (cola propia `con-closing`) | Mensual | vigente | 3775 |
| JOB-CON-23 | `con:devengar-derechos-sepultura` | M15 | `batch` (cola propia `con-closing`) | Mensual, solo con PRM-CON-193 = deferredOverTerm (M-135; HUECO-CEM-04) | vigente | 3776 |
| JOB-SUE-01 | `sue:calcular-liquidacion` | M16 | `batch` | A pedido | vigente | 3784 |
| JOB-SUE-02 | `sue:simular-configuracion` | M16 | `batch` | A pedido | vigente | 3785 |
| JOB-SUE-03 | `sue:emitir-recibos-pdf` | M16 | `batch` | Al aprobar | vigente | 3786 |
| JOB-SUE-04 | `sue:firmar-recibos-empleador` | M16 | `integration` | Al emitir | vigente | 3787 |
| JOB-SUE-05 | `sue:notificar-recibos` | M16 | `notifications` | Al firmar el empleador | vigente | 3788 |
| JOB-SUE-06 | `sue:consultar-estado-firma` | M16 | `integration` | — | retirado | 3789 |
| JOB-SUE-07 | `sue:proponer-novedades-operativas` | M16 | `events` | Por evento; a pedido | vigente | 3790 |
| JOB-SUE-08 | `sue:importar-siradig` | M16 | `batch` | A pedido | vigente | 3791 |
| JOB-SUE-09 | `sue:liquidacion-anual-ganancias` | M16 | `batch` | Anual; por egreso | vigente | 3792 |
| JOB-SUE-10 | `sue:generar-lsd` | M16 | `export` | A pedido | vigente | 3793 |
| JOB-SUE-11 | `sue:generar-sicoss` | M16 | `export` | A pedido | vigente | 3794 |
| JOB-SUE-12 | `sue:recalcular-saldos-vacaciones` | M16 | `batch` | Diario 02:00; por evento de licencia | vigente | 3795 |
| JOB-SUE-13 | `sue:generar-sicore-sueldos` | M16 | `export` | A pedido | vigente | 3796 |
| JOB-SUE-14 | `sue:generar-archivos-sindicales` | M16 | `export` | A pedido | vigente | 3797 |
| JOB-SUE-15 | `sue:alertas-legajo` | M16 | `notifications` | Diario 06:00 | vigente | 3798 |
| JOB-SUE-16 | `sue:importar-liquidacion-externa` | M16 | `batch` | A pedido | vigente | 3799 |
| JOB-SUE-17 | `sue:procesar-fichadas` | M16 | `batch` | Diario 03:00; a pedido | vigente | 3800 |
| JOB-SUE-18 | `sue:aplicar-aumento` | M16 | `batch` | A pedido | vigente | 3801 |
| JOB-SUE-19 | `sue:recordatorios-firma` | M16 | `notifications` | — | retirado | 3802 |
| JOB-SUE-20 | `sue:proyeccion-costo` | M16 | `batch` | Mensual; a pedido | vigente | 3803 |
| JOB-SUE-21 | `sue:purgar-simulaciones` | M16 | `maintenance` | Semanal | vigente | 3804 |
| JOB-SUE-22 | `sue:importar-novedades-excel` | M16 | `batch` | A pedido | vigente | 3805 |
| JOB-SUE-23 | `sue:paralelo-comparar` | M16 | `batch` | A pedido | vigente | 3806 |
| JOB-INS-01 | `ins:registrar-capital-lote` | M17 | `events` | EVT-FAC-05 | vigente | 3812 |
| JOB-INS-02 | `ins:revisar-capital` | M17 | `batch` | Manual; nocturno | vigente | 3813 |
| JOB-INS-03 | `ins:generar-padron` | M17 | `batch` | API-INS-046 | vigente | 3814 |
| JOB-INS-04 | `ins:emitir-libro-asociados` | M17 | `export` | API-INS-011 | vigente | 3815 |
| JOB-INS-05 | `ins:exportar-inaes` | M17 | `export` | API-INS-057 | vigente | 3816 |
| JOB-INS-06 | `ins:calcular-distribucion-excedentes` | M17 | `batch` | API-INS-033 | vigente | 3817 |
| JOB-INS-07 | `ins:ejecutar-distribucion` | M17 | `batch` | API-INS-034 | vigente | 3818 |
| JOB-INS-08 | `ins:emitir-credenciales-masivas` | M17 | `batch` | API-INS-059 | vigente | 3819 |
| JOB-INS-09 | `ins:alertas-institucionales` | M17 | `notifications` | Diario 06:00 | vigente | 3820 |
| JOB-INS-10 | `ins:liquidar-honorarios` | M17 | `batch` | Mensual; API-INS-055 | vigente | 3821 |
| JOB-INS-11 | `ins:procesar-cola-rescates` | M17 | `batch` | EVT-CON-09; manual | vigente | 3822 |
| JOB-INS-12 | `ins:conciliar-capital-contable` | M17 | `maintenance` | Diario; manual | vigente | 3823 |
| JOB-SOC-01 | `soc:mayoria-edad` | M18 | `maintenance` | Diario 05:00 | vigente | 3829 |
| JOB-SOC-02 | `soc:revision-condiciones` | M18 | `batch` | Manual; mensual | vigente | 3830 |
| JOB-SOC-03 | `soc:vencimiento-subsidios` | M18 | `maintenance` | Diario | vigente | 3831 |
| JOB-SOC-04 | `soc:vencer-reservas` | M18 | `maintenance` | Cada hora | vigente | 3832 |
| JOB-SOC-05 | `soc:actualizar-precios-vivienda` | M18 | `batch` | API-SOC-034 tras aprobación | vigente | 3833 |
| JOB-SOC-06 | `soc:vencimientos-flota` | M18 | `maintenance` | Diario | vigente | 3834 |
| JOB-SOC-07 | `soc:mantenimiento-preventivo` | M18 | `notifications` | Diario | vigente | 3835 |
| JOB-SOC-08 | `soc:ingestar-gps` | M18 | `integration` | Cada PRM-SOC-051 min; webhook | vigente | 3836 |
| JOB-SOC-09 | `soc:resumir-recorridos` | M18 | `batch` | Nocturno | vigente | 3837 |
| JOB-SOC-10 | `soc:vencimiento-prestamos` | M18 | `maintenance` | Diario | vigente | 3838 |
| JOB-SOC-11 | `soc:costo-convenios` | M18 | `batch` | Mensual | vigente | 3839 |
| JOB-POR-01 | `por:vencer-borradores` | M19 | `maintenance` | Diario 03:00 | vigente | 3845 |
| JOB-POR-02 | `por:vencer-accesos` | M19 | `maintenance` | Cada hora | vigente | 3846 |
| JOB-POR-03 | `por:identificar-bajas-publicas` | M19 | `events` | Al recibir; cada 15 min | vigente | 3847 |
| JOB-POR-04 | `por:controlar-plazos-baja-publica` | M19 | `notifications` | Cada 15 min | vigente | 3848 |
| JOB-POR-05 | `por:importar-usuarios-cooponline` | M19 | `batch` | A demanda | vigente | 3849 |
| JOB-POR-06 | `por:invitar-usuarios-migrados` | M19 | `notifications` | A demanda, tandas de 500 por hora | vigente | 3850 |
| JOB-POR-07 | `por:publicar-landing-programada` | M19 | `maintenance` | Cada minuto | vigente | 3851 |
| JOB-POR-08 | `por:purgar-intentos-vinculacion` | M19 | — | TTL de MongoDB (no encola) | vigente | 3852 |
| JOB-POR-09 | `por:metricas-portal` | M19 | `batch` | Diario 04:00 | vigente | 3853 |
| JOB-POR-10 | `por:vencer-banners` | M19 | `maintenance` | Cada hora | vigente | 3854 |
| JOB-POR-11 | `por:heartbeat-totems` | M19 | `maintenance` | Cada minuto | vigente | 3855 |
| JOB-POR-12 | `por:recordar-acciones-pendientes` | M19 | `notifications` | Diario 10:00 | vigente | 3856 |
| JOB-PLA-01 | `pla:outbox-relay` | T01 | `Proceso dedicado` | Continuo + sondeo (PRM-PLA-029) | vigente | 3864 |
| JOB-PLA-02 | `pla:evaluar-checklist` | T01 | `events` | Por evento; diario 03:00 | vigente | 3865 |
| JOB-PLA-03 | `pla:vencimientos-contratos-licencias` | T01 | `maintenance` | Diario 02:00 (fan-out) | vigente | 3866 |
| JOB-PLA-04 | `pla:expirar-accesos-soporte` | T01 | `maintenance` | Cada minuto | vigente | 3867 |
| JOB-PLA-05 | `pla:medir-uso` | T01 | `maintenance` | Diario 01:00 (fan-out) | vigente | 3868 |
| JOB-PLA-06 | `pla:evaluar-cupos` | T01 | `maintenance` | Tras JOB-PLA-05 | vigente | 3869 |
| JOB-PLA-07 | `pla:evaluar-alertas` | T01 | `maintenance` | Cada minuto | vigente | 3870 |
| JOB-PLA-08 | `pla:recolectar-salud` | T01 | `maintenance` | Cada PRM-PLA-043 s | vigente | 3871 |
| JOB-PLA-09 | `pla:backup-logico-tenant` | T01 | `maintenance` | Diario escalonado (fan-out) | vigente | 3872 |
| JOB-PLA-10 | `pla:verificar-backups` | T01 | `maintenance` | Diario | vigente | 3873 |
| JOB-PLA-11 | `pla:restaurar-tenant` | T01 | `maintenance` | A demanda | vigente | 3874 |
| JOB-PLA-12 | `pla:conciliar-post-restauracion` | T01 | `integration` | Tras JOB-PLA-11 | vigente | 3875 |
| JOB-PLA-13 | `pla:ensayo-restauracion` | T01 | `maintenance` | Cada PRM-PLA-014 días | vigente | 3876 |
| JOB-PLA-14 | `pla:cerrar-y-purgar-tenant` | T01 | `maintenance` | Diario | vigente | 3877 |
| JOB-PLA-15 | `pla:crear-sandbox` | T01 | `maintenance` | A demanda | vigente | 3878 |
| JOB-PLA-16 | `pla:propuesta-ia-alta` | T01 | `interactive` | A demanda | vigente | 3879 |
| JOB-PLA-17 | `pla:limpiar-borradores-y-temporales` | T01 | `maintenance` | Diario | vigente | 3880 |
| JOB-PLA-18 | `pla:sincronizar-config-sandbox` | T01 | `maintenance` | A demanda | vigente | 3881 |
| JOB-PLA-19 | `pla:copia-anonimizada` | T01 | `maintenance` | A demanda aprobada | vigente | 3882 |
| JOB-PLA-20 | `pla:exportar-tenant` | T01 | `export` | A demanda; salida | vigente | 3883 |
| JOB-PLA-21 | `pla:escanear-archivo` | T01 | `interactive` | Por subida | vigente | 3884 |
| JOB-PLA-22 | `pla:sla-soporte` | T01 | `maintenance` | Cada 5 min | vigente | 3885 |
| JOB-IAM-01 | `iam:expirar-autorizaciones` | T02 | `maintenance` | Cada 5 min | vigente | 3891 |
| JOB-IAM-02 | `iam:expirar-accesos-soporte` | T02 | `maintenance` | Cada minuto | vigente | 3892 |
| JOB-IAM-03 | `iam:purgar-transitorios` | T02 | `maintenance` | Cada hora | vigente | 3893 |
| JOB-IAM-04 | `iam:sellar-auditoria` | T02 | `maintenance` | Diario 00:15 | vigente | 3894 |
| JOB-IAM-05 | `iam:verificar-integridad` | T02 | `maintenance` | Diario; a demanda | vigente | 3895 |
| JOB-IAM-06 | `iam:recertificacion` | T02 | `batch` | Según PRM-IAM-061 | vigente | 3896 |
| JOB-IAM-07 | `iam:suspender-inactivos` | T02 | `maintenance` | Diario | vigente | 3897 |
| JOB-IAM-08 | `iam:detectar-anomalias` | T02 | `events` | Cada 5 min | vigente | 3898 |
| JOB-IAM-09 | `iam:enviar-invitaciones` | T02 | `notifications` | A demanda | vigente | 3899 |
| JOB-IAM-10 | `iam:expirar-asignaciones` | T02 | `maintenance` | Cada hora | vigente | 3900 |
| JOB-IAM-11 | `iam:verificar-contrasenas-comprometidas` | T02 | `maintenance` | Semanal | vigente | 3901 |
| JOB-IAM-12 | `iam:sincronizar-catalogos` | T02 | `maintenance` | Al desplegar | vigente | 3902 |
| JOB-UXD-01 | `uxd:procesar-recurso` | T03 | `interactive` | Subida de recurso | vigente | 3908 |
| JOB-UXD-02 | `uxd:compilar-marca` | T03 | `events` | EVT-UXD-01/02 | vigente | 3909 |
| JOB-UXD-03 | `uxd:compilar-diccionario` | T03 | `events` | EVT-UXD-04/05/08 | vigente | 3910 |
| JOB-UXD-04 | `uxd:sembrar-tenant` | T03 | `events` | EVT-PLA-01 | vigente | 3911 |
| JOB-UXD-05 | `uxd:sincronizar-catalogo` | T03 | `maintenance` | Despliegue | vigente | 3912 |
| JOB-UXD-06 | `uxd:resumen-claves-faltantes` | T03 | `maintenance` | Diario 03:00 (zona plataforma) | vigente | 3913 |
| JOB-UXD-07 | `uxd:auditar-contraste` | T03 | `maintenance` | Semanal; al cambiar tokens base | vigente | 3914 |
| JOB-CFG-01 | `cfg:sincronizar-registro` | T04 | `maintenance` | En cada despliegue | vigente | 3920 |
| JOB-CFG-02 | `cfg:publicar-version-programada` | T04 | `maintenance` | Cada minuto | vigente | 3921 |
| JOB-CFG-03 | `cfg:importar-maestro` | T04 | `batch` | A demanda | vigente | 3922 |
| JOB-CFG-04 | `cfg:unificar-maestro` | T04 | `batch` | A demanda | vigente | 3923 |
| JOB-CFG-05 | `cfg:ingesta-georef` | T04 | `integration` | Mensual; manual | vigente | 3924 |
| JOB-CFG-06 | `cfg:ingesta-feriados` | T04 | `integration` | Anual; manual ante decreto | vigente | 3925 |
| JOB-CFG-07 | `cfg:ingesta-indices` | T04 | `integration` | Diaria 18:00 (cotizaciones y tasas); mensual (IPC) | vigente | 3926 |
| JOB-CFG-08 | `cfg:ingesta-padron:<registro>` | T04 | `integration` | Según fuente | vigente | 3927 |
| JOB-CFG-09 | `cfg:geocodificar-pendientes` | T04 | `integration` | Cada 15 min | vigente | 3928 |
| JOB-CFG-10 | `cfg:migrar-variables` | T04 | `batch` | A demanda (T07) | vigente | 3929 |
| JOB-CFG-11 | `cfg:aplicar-semilla` | T04 | `batch` | A demanda | vigente | 3930 |
| JOB-CFG-12 | `cfg:activar-vigencias` | T04 | `maintenance` | Cada minuto | vigente | 3931 |
| JOB-CFG-13 | `cfg:verificar-integridad` | T04 | `maintenance` | Diario 03:00 | vigente | 3932 |
| JOB-CFG-14 | `cfg:purgar-geocache` | T04 | `maintenance` | Diario | vigente | 3933 |
| JOB-INT-01 | `int:ejecutar-operacion` | T06 | `integration` | Por operación | vigente | 3939 |
| JOB-INT-02 | `int:resolver-incierto` | T06 | `integration` | Por operación incierta, con backoff | vigente | 3940 |
| JOB-INT-03 | `int:procesar-webhook` | T06 | `integration` | Por webhook | vigente | 3941 |
| JOB-INT-04 | `int:generar-archivo` | T06 | `integration` | A pedido del módulo dueño | vigente | 3942 |
| JOB-INT-05 | `int:procesar-archivo-entrante` | T06 | `integration` | Carga o buzón | vigente | 3943 |
| JOB-INT-06 | `int:conciliar` | T06 | `integration` | Diario por conexión | vigente | 3944 |
| JOB-INT-07 | `int:recuperar-pendientes` | T06 | `integration` | Cada PRM-INT-025 min | vigente | 3945 |
| JOB-INT-08 | `int:health-check` | T06 | `maintenance` | Cada PRM-INT-013 min | vigente | 3946 |
| JOB-INT-09 | `int:alertar-vencimientos` | T06 | `maintenance` | Diario | vigente | 3947 |
| JOB-INT-10 | `int:rotar-credencial` | T06 | `maintenance` | Manual; programado | vigente | 3948 |
| JOB-INT-11 | `int:refrescar-tokens` | T06 | `integration` | Antes de vencer | vigente | 3949 |
| JOB-INT-12 | `int:cerrar-contingencia` | T06 | `integration` | Al recuperar conexión | vigente | 3950 |
| JOB-INT-13 | `int:entregar-mensaje` | T06 | `notifications` | Por lote de T09 | vigente | 3951 |
| JOB-INT-14 | `int:despachar-comando-agente` | T06 | `integration` | Por comando | vigente | 3952 |
| JOB-INT-15 | `int:purgar-bitacora` | T06 | `maintenance` | Diario | vigente | 3953 |
| JOB-INT-16 | `int:leer-buzon-sftp` | T06 | `integration` | Cron por conexión | vigente | 3954 |
| JOB-INT-17 | `int:entregar-sftp` | T06 | `integration` | Por archivo | vigente | 3955 |
| JOB-INT-18 | `int:sincronizar-parametros-arca` | T06 | `integration` | Semanal; a demanda | vigente | 3956 |
| JOB-INT-19 | `int:polling-cobranzas` | T06 | `integration` | Cron por conexión | vigente | 3957 |
| JOB-INT-20 | `int:sincronizar-estados-debito` | T06 | `integration` | Diario | vigente | 3958 |
| JOB-INT-21 | `int:importar-movimientos-bancarios` | T06 | `integration` | Diario por cuenta | vigente | 3959 |
| JOB-INT-22 | `int:leer-telemedicion` | T06 | `integration` | Cron por sistema | vigente | 3960 |
| JOB-INT-23 | `int:recibir-cdr` | T06 | `integration` | Cron o buzón por central | vigente | 3961 |
| JOB-INT-24 | `int:importar-posiciones-gps` | T06 | `integration` | Cada N min | vigente | 3962 |
| JOB-INT-25 | `int:revalidar-padron` | T06 | `integration` | Mensual (opcional) | vigente | 3963 |
| JOB-INT-26 | `int:importar-padron-provincial` | T06 | `integration` | Mensual; al publicarse | vigente | 3964 |
| JOB-INT-27 | `int:vencer-intenciones` | T06 | `maintenance` | Cada hora | vigente | 3965 |
| JOB-INT-28 | `int:consumo-mensual` | T06 | `batch` | Mensual | vigente | 3966 |
| JOB-MIG-01 | `mig:extraer-snapshot` | T07 | `batch` | A demanda; delta diario | vigente | 3972 |
| JOB-MIG-02 | `mig:perfilar` | T07 | `batch` | Tras snapshot | vigente | 3973 |
| JOB-MIG-03 | `mig:transformar` | T07 | `batch` | Por corrida | vigente | 3974 |
| JOB-MIG-04 | `mig:validar` | T07 | `batch` | Por corrida | vigente | 3975 |
| JOB-MIG-05 | `mig:cargar-dominio` | T07 | `batch` | Por corrida | vigente | 3976 |
| JOB-MIG-06 | `mig:conciliar` | T07 | `batch` | Tras carga | vigente | 3977 |
| JOB-MIG-07 | `mig:reprocesar` | T07 | `batch` | A demanda | vigente | 3978 |
| JOB-MIG-08 | `mig:paralelo-simular` | T07 | `batch` | Por ciclo | vigente | 3979 |
| JOB-MIG-09 | `mig:paralelo-comparar` | T07 | `batch` | Tras simular e importar | vigente | 3980 |
| JOB-MIG-10 | `mig:sync-convivencia` | T07 | `integration` | Según coexistenceSyncs.schedule | vigente | 3981 |
| JOB-MIG-11 | `mig:exportar-asientos-procoop` | T07 | `export` | Diario en convivencia E2 | vigente | 3982 |
| JOB-MIG-12 | `mig:anonimizar` | T07 | `batch` | A demanda | vigente | 3983 |
| JOB-MIG-13 | `mig:archivar-historico` | T07 | `batch` | O11, tras corte | vigente | 3984 |
| JOB-MIG-14 | `mig:vencer-alias` | T07 | `maintenance` | Diario | vigente | 3985 |
| JOB-MIG-15 | `mig:purgar-staging` | T07 | `maintenance` | Diario | vigente | 3986 |
| JOB-MIG-16 | `mig:migrar-adjuntos` | T07 | `batch` | Por corrida | vigente | 3987 |
| JOB-NFR-01 | `nfr:informe-acceso` | T08 | `export` | Solicitud verificada | vigente | 3995 |
| JOB-NFR-02 | `nfr:localizar-titular` | T08 | `batch` | Solicitud verificada | vigente | 3996 |
| JOB-NFR-03 | `nfr:ejecutar-solicitud` | T08 | `events` | Aprobación | vigente | 3997 |
| JOB-NFR-04 | `nfr:aplicar-conservacion` | T08 | `maintenance` | Diario 03:00 | vigente | 3998 |
| JOB-NFR-05 | `nfr:verificar-cadena-auditoria` | T08 | `maintenance` | Diario 04:00 UTC | retirado | 3999 |
| JOB-NFR-06 | `nfr:verificar-invariantes` | T08 | `maintenance` | Diario 05:00; a demanda | vigente | 4000 |
| JOB-NFR-07 | `nfr:simulacro-restauracion` | T08 | `maintenance` | Mensual (plataforma), trimestral (tenant) | vigente | 4001 |
| JOB-NFR-08 | `nfr:recifrar` | T08 | `maintenance` | Tras rotación de clave | vigente | 4002 |
| JOB-NFR-09 | `nfr:vencimientos-credenciales` | T08 | `maintenance` | Diario 08:00 | vigente | 4003 |
| JOB-NFR-10 | `nfr:escanear-patrones` | T08 | `maintenance` | Semanal | vigente | 4004 |
| JOB-NFR-11 | `nfr:limpiar-exportaciones` | T08 | `maintenance` | Cada hora | vigente | 4005 |
| JOB-NFR-12 | `nfr:antivirus-analizar` | T08 | `interactive` (cola propia `critical`) | Por archivo subido | retirado | 4006 |
| JOB-NFR-13 | `nfr:actualizar-firmas-av` | T08 | `maintenance` | Cada 6 h | vigente | 4007 |
| JOB-NFR-14 | `nfr:destruir-tenant` | T08 | `maintenance` | EVT-PLA-05 + plazo | vigente | 4008 |
| JOB-NFR-15 | `nfr:reaplicar-supresiones` | T08 | `maintenance` | Tras cada restauración | vigente | 4009 |
| JOB-NFR-16 | `nfr:agregar-csp` | T08 | `maintenance` | Cada 5 min | vigente | 4010 |
| JOB-NFR-17 | `nfr:informe-sla` | T08 | `export` | Mensual, día 1 | vigente | 4011 |
| JOB-NFR-18 | `nfr:inventario-backups` | T08 | `maintenance` | Cada hora | vigente | 4012 |
| JOB-NFR-19 | `nfr:conciliar-tras-restauracion` | T08 | `integration` | Tras restauración selectiva | retirado | 4013 |
| JOB-NFR-20 | `nfr:evaluar-slo` | T08 | `maintenance` | Cada 60 s | vigente | 4014 |
| JOB-NFR-21 | `nfr:medir-consumo` | T08 | `maintenance` | Cada hora; cierre mensual | vigente | 4015 |
| JOB-NFR-22 | `nfr:informe-accesos-sensibles` | T08 | `export` | Mensual | vigente | 4016 |
| JOB-NFR-23 | `nfr:anonimizar-dataset-bi` | T08 | `batch` | Al publicar cubo certificado; diario | vigente | 4017 |
| JOB-NFR-24 | `nfr:escaneo-configuracion` | T08 | `maintenance` | Semanal | vigente | 4018 |
| JOB-COM-01 | `com:publicar-programadas` | T09 | `maintenance` | Cada minuto | vigente | 4024 |
| JOB-COM-02 | `com:expirar-publicaciones` | T09 | `maintenance` | Cada 5 min | vigente | 4025 |
| JOB-COM-03 | `com:generar-boletines` | T09 | `batch` | Cada 15 min | vigente | 4026 |
| JOB-COM-04 | `com:enviar-boletin` | T09 | `notifications` | A demanda (aprobado por T11) | vigente | 4027 |
| JOB-COM-05 | `com:vencer-sanciones` | T09 | `maintenance` | Cada hora | vigente | 4028 |
| JOB-COM-06 | `com:recordatorios-encuestas` | T09 | `notifications` | Cada hora | vigente | 4029 |
| JOB-COM-07 | `com:cerrar-encuestas` | T09 | `maintenance` | Cada 15 min | vigente | 4030 |
| JOB-COM-08 | `com:encuestas-periodicas` | T09 | `batch` | Diario 03:00 | vigente | 4031 |
| JOB-COM-09 | `com:eventos` | T09 | `notifications` | Cada 15 min | vigente | 4032 |
| JOB-COM-10 | `com:beneficios` | T09 | `maintenance` | Diario 02:00 | vigente | 4033 |
| JOB-COM-11 | `com:saludos` | T09 | `notifications` | Diario a la hora configurada | vigente | 4034 |
| JOB-COM-12 | `com:vencer-mensajes` | T09 | `notifications` | Cada 10 min | vigente | 4035 |
| JOB-COM-13 | `com:recordatorios-agenda` | T09 | `notifications` | Cada 15 min | vigente | 4036 |
| JOB-COM-14 | `com:sincronizar-plantillas-whatsapp` | T09 | `integration` | Cada 6 h; a demanda | vigente | 4037 |
| JOB-COM-15 | `com:ejecutar-campanas` | T09 | `notifications` | Cada minuto | vigente | 4038 |
| JOB-COM-16 | `com:recordatorios-vencimiento` | T09 | `notifications` | Diario 08:00 | vigente | 4039 |
| JOB-COM-17 | `com:constancias` | T09 | `batch` | Cada 5 min | vigente | 4040 |
| JOB-COM-18 | `com:purgar-bandeja` | T09 | `maintenance` | Diario 04:00 | vigente | 4041 |
| JOB-COM-19 | `com:retencion` | T09 | `maintenance` | Diario 04:30 | vigente | 4042 |
| JOB-COM-20 | `com:metricas` | T09 | `batch` | Cada 5 min | vigente | 4043 |
| JOB-COM-21 | `com:segmentos-dinamicos` | T09 | `batch` | Diario 01:00 | vigente | 4044 |
| JOB-COM-22 | `com:inteligencia-encuestas` | T09 | `ai` | Cada 24 h o cada 15 respuestas | vigente | 4045 |
| JOB-COM-23 | `com:salud-canales` | T09 | `maintenance` | Cada 5 min | vigente | 4046 |
| JOB-COM-24 | `com:moderar-comentario` | T09 | `ai` | Por comentario | vigente | 4047 |
| JOB-COM-34 | `com:generar-comunicaciones` | T09 | `events` | Por evento (antes citado como com:consumir-eventos) | vigente | 4048 |
| JOB-COM-35 | `com:despachar` | T09 | `notifications` | Continuo, cola por canal (antes citado como com:enviar-mensajes) | vigente | 4049 |
| JOB-COM-36 | `com:reintentar` | T09 | `notifications` | Cada minuto | vigente | 4050 |
| JOB-COM-37 | `com:verificar-hitos` | T09 | `maintenance` | Cada 15 min | vigente | 4051 |
| JOB-COM-38 | `com:notificar-publicacion` | T09 | `notifications` | Por evento | vigente | 4052 |
| JOB-COM-39 | `com:informe-encuesta` | T09 | `notifications` | Según reportSchedule | vigente | 4053 |
| JOB-COM-40 | `com:evaluar-audiencia` | T09 | `batch` | A pedido | vigente | 4054 |
| JOB-COM-41 | `com:avisos-interrupcion` | T09 | `notifications` | Cada 5 min | vigente | 4055 |
| JOB-BIA-01 | `bia:ejecutar-reporte` | T10 | `export` | A demanda | vigente | 4063 |
| JOB-BIA-02 | `bia:generar-exportacion` | T10 | `export` | A demanda | vigente | 4064 |
| JOB-BIA-03 | `bia:programador` | T10 | `maintenance` | Cada minuto | vigente | 4065 |
| JOB-BIA-04 | `bia:entregar-reporte` | T10 | `notifications` | A demanda | vigente | 4066 |
| JOB-BIA-05 | `bia:purgar-exportaciones` | T10 | `maintenance` | Diario 03:00 | vigente | 4067 |
| JOB-BIA-06 | `bia:snapshot-indicadores` | T10 | `batch` | Diario 02:00 | vigente | 4068 |
| JOB-BIA-07 | `bia:cierre-mensual-indicadores` | T10 | `batch` | Mensual, día hábil PRM-BIA-028 | vigente | 4069 |
| JOB-BIA-08 | `bia:evaluar-alertas` | T10 | `batch` | Cada 15 min y tras snapshot | vigente | 4070 |
| JOB-BIA-09 | `bia:proyectar-<dominio>` | T10 | `events` | Continuo | vigente | 4071 |
| JOB-BIA-10 | `bia:snapshot-saldos` | T10 | `batch` | Diario 01:30 | vigente | 4072 |
| JOB-BIA-11 | `bia:reconciliar-bi` | T10 | `batch` | Diario 05:00 | vigente | 4073 |
| JOB-BIA-12 | `bia:reconstruir-proyeccion` | T10 | `maintenance` | Manual | vigente | 4074 |
| JOB-BIA-13 | `bia:analisis-ia-auto` | T10 | `ai` | Cada PRM-BIA-034 h por sala con cambios | vigente | 4075 |
| JOB-BIA-14 | `bia:despachar-eventos-publicos` | T10 | `events` | Continuo | vigente | 4076 |
| JOB-BIA-15 | `bia:entregar-webhook` | T10 | `integration` | Por entrega | vigente | 4077 |
| JOB-BIA-16 | `bia:expirar-credenciales` | T10 | `maintenance` | Cada hora | vigente | 4078 |
| JOB-BIA-17 | `bia:agregar-uso-api` | T10 | `batch` | Horario y diario | vigente | 4079 |
| JOB-BIA-18 | `bia:benchmark-agregar` | T10 | `batch` | Mensual, día 10 | vigente | 4080 |
| JOB-BIA-19 | `bia:publicar-datos-abiertos` | T10 | `export` | Según publicación | vigente | 4081 |
| JOB-BIA-20 | `bia:exportacion-masiva` | T10 | `export` | A demanda | vigente | 4082 |
| JOB-BIA-21 | `bia:exportacion-salida` | T10 | `export` | A demanda (T01) | vigente | 4083 |
| JOB-BIA-22 | `bia:verificar-frescura` | T10 | `maintenance` | Cada 5 min | vigente | 4084 |
