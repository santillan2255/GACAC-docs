# 02 — Preguntas abiertas consolidadas

> **Política vigente (DEC-047):** solo se presentan al solicitante las preguntas de alto impacto o que bloquean olas tempranas. El resto rige con la opción **Recomendada** (estado `Pendiente` = asumida la recomendada) y puede revisarse en cualquier momento.

Registro único de las preguntas de decisión del solicitante surgidas en los anexos. Mientras no se responden, rige la opción **Recomendada** y los requisitos afectados quedan `A validar`. Al responderse, se registra la DEC correspondiente en `01-registro-decisiones.md` y la pregunta pasa a `Respondida (DEC-xxx)`.

| PA | Anexo | Título | Recomendada | Estado |
|---|---|---|---|---|
| PA-CFG-P2-01 | T04b parte 2 | Alcance de los 114 parámetros de facturación que ProCoop no lee en su código | Catalogarlos e implementar el comportamiento solo si la migración muestra valores distintos del default | Asumida (DEC-072) |
| PA-CFG-P2-02 | T04b parte 2 | Opciones "permitir/impedir" de facturación convertidas en permisos | Permisos por rol, con auditoría de cada uso | Asumida (DEC-072) |
| PA-CFG-P2-03 | T04b parte 2 | Protección de los PDF de la impresión masiva (#2402) | Sin contraseña común; distribución por enlace firmado con vencimiento | Asumida (DEC-072) |
| PA-CFG-P2-04 | T04b parte 2 | Libro IVA ventas parcial (#2605) | Libro legal siempre completo; la separación es solo un filtro de reportes | Asumida (DEC-072) |
| PA-CFG-P2-05 | T04b parte 2 | Parámetros con nombre de una cooperativa o tercero (CAU/AL, A.M.A., TORN, FECESCOR, "personalizadas") | Generalizarlos en convenios de terceros y fórmulas, sin siglas | Asumida (DEC-072) |
| PA-CFG-P2-06 | T04b parte 2 | Falta de respuesta de ARCA en la venta de mostrador (#727, #726, #2427) | Esperar el CAE con tiempo máximo; si se vence, contingencia o comprobante pendiente no entregable como fiscal | Respondida (DEC-018) |
| PA-CFG-P3-01 | T04b parte 3 | Plazo de prescripción de deuda por defecto | 24 meses, editable por tenant y servicio | Respondida (DEC-052: 24 meses periódicas / 60 meses resto) |
| PA-CFG-P3-02 | T04b parte 3 | Período de control de convenios | Ventana móvil de 12 meses en lugar de fechas fijas | Asumida (DEC-072) |
| PA-CFG-P3-03 | T04b parte 3 | Pago online después del vencimiento | Política única del tenant con excepción opcional por ente | Asumida (DEC-072) |
| PA-CFG-P3-04 | T04b parte 3 | Reconexión automática al cobrar | Generar la orden de trabajo cuando no quede deuda vencida al último vencimiento; reconexión directa en servicios que no necesitan técnico | Respondida (DEC-014) |
| PA-CFG-P3-05 | T04b parte 3 | Prioridad de las pasarelas secundarias | Pagos360, Mercado Pago, SIRO y Red Link en O5; el resto Extensión en O11 | Respondida (DEC-015) |
| PA-CFG-P3-06 | T04b parte 3 | Beneficio de recargo para jubilados | Beneficio de un segmento de personas con su propia regla de recargo | Asumida (DEC-072) |
| PA-CFG-P1-01 | T04b parte 1 | Numeración de titulares (asociados/clientes) | Secuencia única por tenant con atributo de tipo; número manual solo en migración | Respondida (DEC-017) |
| PA-CFG-P1-02 | T04b parte 1 | Quién edita los datos legales del tenant | El tenant edita razón social y domicilio con auditoría; el CUIT solo la plataforma | Asumida (DEC-072); respondida en parte por DEC-064 (datos legales en `legalEntities` de T04; CUIT no editable, PA-CFG-14) |
| PA-CFG-P1-03 | T04b parte 1 | Claves de mapas e IA | Provistas por la plataforma, con opción de clave propia del tenant | Respondida (DEC-020) |
| PA-CFG-P1-04 | T04b parte 1 | Intereses por mora en pagos online | Diferir el interés a la próxima factura, configurable por canal | Respondida (DEC-051) |
| PA-CFG-P1-05 | T04b parte 1 | Reconexión automática al pagar (ver también PA-CFG-P3-04) | Automática solo en servicios remotos o sin técnica, al confirmarse el pago, por deuda del servicio | Respondida (DEC-014) |
| PA-CFG-P1-06 | T04b parte 1 | Meses de comprobantes visibles en el portal | 24 meses; los anteriores a pedido | Asumida (DEC-072) |
| PA-CFG-P1-07 | T04b parte 1 | Reguladores de otras provincias (OCEBA, RASE, EPRE, ATER) | O7 como mapeo regulatorio genérico | Asumida (DEC-072) |
| PA-CFG-P1-08 | T04b parte 1 | Exención de recargo por cuenta | Permitida con motivo, vigencia y autorización | Asumida (DEC-072) |
| PA-CFG-P4-01 | T04b parte 4 | Módem GSM local para SMS | Solo proveedores por API | Asumida (DEC-072) |
| PA-CFG-P4-02 | T04b parte 4 | Nombre del socio en la pantalla del turnero | Número o código por defecto; nombre como opción del tenant | Asumida (DEC-072) |
| PA-CFG-P4-03 | T04b parte 4 | Fechas de cierre por módulo | Bloqueo de período por módulo + bloqueo contable general que prevalece | Asumida (DEC-072) |
| PA-CFG-P4-04 | T04b parte 4 | Métodos de valorización de stock | FIFO o PPP para la valuación contable; los cinco métodos solo en informes | Asumida (DEC-072) |
| PA-CFG-P4-05 | T04b parte 4 | Topes previsionales de sueldos | Tabla legal de plataforma con vigencia + override auditado del tenant | Asumida (DEC-072) |
| PA-CFG-P4-06 | T04b parte 4 | Parches operativos de ProCoop (SIRADIG, corrección de txt) | Migrar como opciones desactivadas por defecto | Asumida (DEC-072) |
| PA-CAT-01 | M02 | Momento de creación del contrato de servicio | Al admitir la solicitud en CRM, en estado Solicitado | Respondida (DEC-011) |
| PA-CAT-02 | M02 | Quién habilita y quién publica servicios | Plataforma habilita según licencia; admin del tenant publica con aprobación de otro usuario en producción | Respondida (DEC-021) |
| PA-CAT-03 | M02 | Apagar una oferta con contratos vigentes | Cerrar oferta solo frena altas; cerrar la operación exige plan de salida | Respondida (DEC-022) |
| PA-CAT-04 | M02 | Altas automáticas de servicios opcionales | Directas solo obligatorios con fundamento normativo; opcionales se proponen con consentimiento | Respondida (DEC-023) |
| PA-CAT-05 | M02 | Jerarquía servicio-producto-plan | Servicio → producto (subservicio = producto adicional) → plan versionado → conceptos | Respondida (DEC-012) |
| PA-CAT-06 | M02 | Alcance de Banco de sangre | Solo administrativo por convenio, sin datos clínicos | Respondida (DEC-024) |
| PA-CAT-07 | M02 | Consentimiento en copias de servicios entre tenants | Autorización explícita del tenant origen | Respondida (DEC-025) |
| PA-CAT-08 | M02 | Plantillas de servicios de plataforma | Sí, sin precios ni condiciones reguladas | Respondida (DEC-026) |
| PA-CAT-09 | M02 | Significado de "Provisorio" / "Cobrar provisorio" | Suministro transitorio con vencimiento obligatorio, facturable en esa condición | Respondida (DEC-027) |
| PA-CAT-10 | M02 | Modalidad de equipos | Configurable por plan; comodato por defecto en Internet y TV | Respondida (DEC-013) |
| PA-CAT-11 | M02 | Dos contratos iguales en la misma cuenta | Permitido en no medidos; en medidos uno por punto de suministro | Respondida (DEC-028) |
| PA-CAT-12 | M02 | Deuda existente en el domicilio del servicio | Advertencia con autorización opcional; nunca bloqueo ni traslado de deuda | Respondida (DEC-029) |
| PA-CAT-13 | M02 | Modalidades de gas | Red natural, propano por red y envasado como variantes habilitables | Respondida (DEC-030) |
| PA-CAT-14 | M02 | Suspensión voluntaria del servicio | Configurable, deshabilitada por defecto | Respondida (DEC-031) |
| PA-CAT-15 | M02 | Cuándo rige un cambio de plan | Próximo período; inmediato con prorrateo si el tenant lo habilita | Respondida (DEC-032) |
| PA-CAT-16 | M02 | Qué confirma la activación del servicio | Confirmación técnica de instalación y provisión; la revisión del supervisor es posterior | Respondida (DEC-033) |
| PA-VEN-01 | M11 | Cuotas no vinculadas en la factura del servicio | No: solo conceptos vinculados y validados; el resto en documento propio presentado junto | Asumida (DEC-072) |
| PA-VEN-02 | M11 | Modelo fiscal de la venta en cuotas | Configurable por plan/concepto; default factura total al vender, cuotas como cronograma de cobro | Asumida (DEC-072) |
| PA-VEN-03 | M11 | Comisiones de vendedores | No en O8; solo informe por vendedor; evaluar en O11 | Asumida (DEC-072) |
| PA-VEN-04 | M11 | Comprobantes en POS | Factura electrónica + ticket no fiscal/representación impresa | Asumida (DEC-072) |
| PA-VEN-05 | M11 | Identificación en la aceptación online de presupuestos | Usuario autenticado con relación sobre la cuenta, o enlace firmado + OTP | Asumida (DEC-072) |
| PA-VEN-06 | M11 | Momento del egreso de stock en ventas | Reserva al confirmar y egreso en la entrega; en POS al emitir | Asumida (DEC-072) |
| PA-VEN-07 | M11 | Rendición de viajes y fletes | Extensión en O8, activable por tenant | Asumida (DEC-072) |
| PA-VEN-08 | M11 | Facturación de la instalación del piloto | En la primera factura del ciclo tras la OT confirmada | Respondida (DEC-016) |
| PA-VEN-09 | M11 | Presupuesto obligatorio para conexiones del piloto | No; solo para obras/instalaciones especiales | Asumida (DEC-072) |
| PA-VEN-10 | M11 | Vendedor obligatorio | Opcional con default por terminal/canal; obligatorio si el tenant lo activa | Asumida (DEC-072) |
| PA-VEN-11 | M11 | Validación de deuda y riesgo en ventas | Advertencia con override auditado; bloqueo configurable | Asumida (DEC-072) |
| PA-INS-01 | M17 | Momento de la suscripción de capital | En la aprobación del ingreso, con plan de integración en cuotas | Asumida (DEC-072) |
| PA-INS-02 | M17 | Cuotas sociales en la factura del servicio | Renglón identificado en la factura, con auxiliar separado y leyenda | Respondida (DEC-061) |
| PA-INS-03 | M17 | Ola del capital social | O5 mínimo (rubros, regla, facturado/pagado, estado de cuenta); resto O10 | Respondida (DEC-019) |
| PA-INS-04 | M17 | Política de reembolso de capital | Límite 5 % del capital integrado del último balance, orden por solicitud, compensación de deuda, sin interés | Asumida (DEC-072) |
| PA-INS-05 | M17 | Votación electrónica y asamblea a distancia | Registro presencial/híbrido; votación electrónica como extensión si el estatuto la admite | Asumida (DEC-072) |
| PA-INS-06 | M17 | Asambleas de distrito y delegados | Modelo disponible y desactivado por defecto, con alerta por umbral | Asumida (DEC-072) |
| PA-INS-07 | M17 | Elegibilidad del padrón | Solo deuda de capital vencida sobre umbral + fecha límite de alta; deuda de servicios solo si el estatuto lo prevé | Asumida (DEC-072) |
| PA-INS-08 | M17 | Firma de actas y libros | Firma ológrafa escaneada con hash; adaptador de firma digital cuando se admita | Asumida (DEC-072) |
| PA-INS-09 | M17 | Formato del libro digital e informes INAES | Adaptador de exportación versionado; CSV/XLSX según plantilla de la cooperativa | Asumida (DEC-072) |
| PA-INS-10 | M17 | Canal de pago de honorarios | Orden de pago en M14 con retención de M06 | Asumida (DEC-072) |
| PA-INS-11 | M17 | Forma del retorno de excedentes | Capitalización por defecto, con opción de crédito en cuenta por distribución | Asumida (DEC-072) |
| PA-MED-01 | M03 | Regularización de consumos estimados | Configurable por servicio; por defecto compensación en unidades | Asumida (DEC-072) |
| PA-MED-02 | M03 | Método de estimación | Promedio de 6 períodos → mismo mes año anterior → promedio de categoría → declarado/mínimo | Asumida (DEC-072) |
| PA-MED-03 | M03 | Curvas de carga | Modelo preparado; importación como Extensión | Asumida (DEC-072) |
| PA-MED-04 | M03 | Modalidad de prepago | Token y crédito en línea vía conector; primero el proveedor de la piloto | Asumida (DEC-072) |
| PA-MED-05 | M03 | Facturación in situ | Extensión posterior a O7 | Asumida (DEC-072) |
| PA-MED-06 | M03 | Autolectura del socio | Complementa la visita; lectura de campo cada N períodos | Asumida (DEC-072) |
| PA-MED-07 | M03 | Tope de estimaciones consecutivas | 2, configurable | Asumida (DEC-072) |
| PA-MED-08 | M03 | Compensación de generación distribuida | Configurable por régimen; por defecto monetaria (Ley 27.424) | Respondida (DEC-060) |
| PA-MED-09 | M03 | Conservación de fotos de lectura | 24 meses en línea, luego archivo frío sin borrar | Asumida (DEC-072) |
| PA-MED-10 | M03 | Cambio de clase por consumo | Propuesta con aprobación | Asumida (DEC-072) |
| PA-MED-11 | M03 | Colectoras USB | Sin USB directo; intercambio por archivo y agente local a pedido | Asumida (DEC-072) |
| PA-MED-12 | M03 | Conectores de telemedición y formatos | Contrato genérico + importación por archivo + 1–2 conectores de la piloto | Asumida (DEC-072) |
| PA-MED-13 | M03 | Historia de medición a migrar | Lecturas y consumos completos; fotos de los últimos 24 meses | Asumida (DEC-072) |
| PA-SUE-01 | M16 | Modo de entrega de sueldos | Importar de liquidador externo en O8; liquidación propia en O9 con 2 períodos en paralelo | Respondida (DEC-058) |
| PA-SUE-02 | M16 | F.931 y SICOSS | Calcular aportes/contribuciones y generar LSD/SICOSS; la presentación la hace la cooperativa | Asumida (DEC-072) |
| PA-SUE-03 | M16 | Lenguaje de fórmulas de liquidación | Lenguaje propio seguro + traductor de fórmulas existentes | Asumida (DEC-072) |
| PA-SUE-04 | M16 | Firma del recibo de sueldo | Firma electrónica del empleado y digital del empleador | Asumida (DEC-072) |
| PA-SUE-05 | M16 | Pago de haberes | Empleado como beneficiario propio, no como proveedor | Asumida (DEC-072) |
| PA-SUE-06 | M16 | Descontar deudas del socio-empleado | Solo con autorización y límite; desactivado por defecto | Asumida (DEC-072) |
| PA-SUE-07 | M16 | Asignaciones familiares (SUAF) | Solo informativo | Asumida (DEC-072) |
| PA-SUE-08 | M16 | Módulos de RRHH | Disciplina, accidentes y juicios en O9; evaluaciones como extensión desactivada | Asumida (DEC-072) |
| PA-SUE-09 | M16 | Pago al banco | Archivo o API en O9; agente en O10 | Asumida (DEC-072) |
| PA-SUE-10 | M16 | Plazos de conservación de legajos | 10 años general; 5 años datos de salud | Asumida (DEC-072) |
| PA-SUE-11 | M16 | Pluriempleo | Sí | Asumida (DEC-072) |
| PA-SUE-12 | M16 | Cambio de categoría por antigüedad | Propuesta automática en borrador | Asumida (DEC-072) |
| PA-SUE-13 | M16 | Regímenes de cese | Como plantilla | Asumida (DEC-072) |
| PA-SUE-14 | M16 | Liquidación complementaria | Con su propio devengamiento | Asumida (DEC-072) |
| PA-SUE-15 | M16 | Cooperativas de trabajo | Fuera de M16; van a M17 | Asumida (DEC-072) |
| PA-TES-01 | M14 | Firma de pagos | M12 aprueba la OP; Tesorería firma con N firmantes según monto y cuenta | Asumida (DEC-072) |
| PA-TES-02 | M14 | Alcance de Interbanking | API de información + archivos de pago; transferencias por API como adaptador futuro | Asumida (DEC-072) |
| PA-TES-03 | M14 | eCheq | Ciclo completo con carga manual o importación; API cuando esté disponible | Asumida (DEC-072) |
| PA-TES-04 | M14 | Formatos de extracto bancario | Perfil genérico CSV/XLSX + los dos bancos principales del piloto | Asumida (DEC-072) |
| PA-TES-05 | M14 | Autoconfirmación de conciliaciones | El sistema propone; autoconfirma solo reglas 1:1 exactas si el tenant lo habilita | Asumida (DEC-072) |
| PA-TES-06 | M14 | Aceptación de rendiciones de caja | Doble control: M07 cierra y arquea, Tesorería acepta u observa | Asumida (DEC-072) |
| PA-TES-07 | M14 | Pago de haberes desde Tesorería (ver PA-SUE-05) | Lote directo, sin facturas ni OP ficticias | Asumida (DEC-072) |
| PA-TES-08 | M14 | Compromisos de fondos | M15 registro presupuestario, Tesorería compromiso de fondos, con referencia común | Asumida (DEC-072) |
| PA-TES-09 | M14 | Cotizaciones de moneda | ARCA diaria + carga manual aprobada como respaldo | Asumida (DEC-072) |
| PA-TES-10 | M14 | Moneda extranjera | Se admite; diferencia de cambio informada a M15 | Asumida (DEC-072) |
| PA-TES-11 | M14 | Presentación automática de retenciones | Configurable, desactivada por defecto | Asumida (DEC-072) |
| PA-TES-12 | M14 | Pagos en efectivo desde la caja de cobranza | No por defecto; habilitable con tope | Asumida (DEC-072) |
| PA-TES-13 | M14 | Cupón de tarjeta rechazado | Nota de débito formal al socio (M07/M05) | Asumida (DEC-072) |
| PA-TES-14 | M14 | Proyección de cobros | Curva de cobrabilidad configurable | Asumida (DEC-072) |
| PA-TES-15 | M14 | Cheque de socio rechazado | Nota de débito automática con gastos configurables y revisión previa | Asumida (DEC-072) |
| PA-TES-16 | M14 | Alcance de Tesorería en O5 | Cuentas, rendición, depósito, extractos y conciliación en O5; valores, cupones, retenciones e Interbanking en O8 | Respondida (DEC-059) |
| PA-FAC-01 | M05 | Modalidad de factura por defecto para tenants nuevos | Separada; agrupada multiservicio solo si se activa por grupo | Respondida (DEC-034) |
| PA-FAC-02 | M05 | Periodicidad distinta dentro de un grupo | El servicio vencido va en el próximo comprobante del grupo | Asumida (DEC-072) |
| PA-FAC-03 | M05 | Distribuir y publicar solo comprobantes autorizados | Solo autorizados | Asumida (DEC-072) |
| PA-FAC-04 | M05 | Momento de asignar el número fiscal | Al emitir, en orden del lote; si ARCA rechaza se reenvía el mismo número | Respondida (DEC-035) |
| PA-FAC-05 | M05 | Factura con total negativo | Política por servicio; por defecto NC; generación distribuida como crédito a futuro | Respondida (DEC-036) |
| PA-FAC-06 | M05 | Factura en cero por consumo | No emitir, registrar "sin cargo", configurable por servicio | Respondida (DEC-037) |
| PA-FAC-07 | M05 | Varios suministros del mismo servicio | Una factura por contrato; agrupar solo mediante grupo | Asumida (DEC-072) |
| PA-FAC-08 | M05 | Formatos de código de barras a precargar | Los de la piloto + genéricos | Asumida (DEC-072) |
| PA-FAC-09 | M05 | Conservar prefijos 40/41/42/43 | Sí | Asumida (DEC-072) |
| PA-FAC-10 | M05 | Modificación masiva de comprobantes autorizados | Solo datos no fiscales | Asumida (DEC-072) |
| PA-FAC-11 | M05 | Muestra de control obligatoria del lote | Sí, a partir de un umbral de casos | Asumida (DEC-072) |
| PA-FAC-12 | M05 | Importe que no entra en el código de barras | Pasar automáticamente a formato alternativo | Asumida (DEC-072) |
| PA-FAC-13 | M05 | Franqueo | Habilitable por tenant; no se cobra a adheridos a factura digital | Asumida (DEC-072) |
| PA-FAC-14 | M05 | Facturación in situ (ver PA-MED-05) | O7 con rango de numeración reservado por dispositivo | Asumida (DEC-072) |
| PA-FAC-15 | M05 | Propagar bloqueos al cierre | Configurable, desactivado por defecto | Asumida (DEC-072) |
| PA-FAC-16 | M05 | Signo del interés en retroactivos | Signo explícito según la diferencia | Asumida (DEC-072) |
| PA-FAC-17 | M05 | Comprobantes de administración pública | Relevar con la piloto; mientras tanto relación administrativa | Asumida (DEC-072) |
| PA-FAC-18 | M05 | Plazos por defecto de las excepciones del lote | 48 h datos fiscales; 24 h lecturas y configuración | Asumida (DEC-072) |
| PA-FAC-19 | M05 | Contingencia ante caída de ARCA (ver PA-CFG-P2-06) | Emitir y encolar, pausar solo la autorización; CAEA si está habilitado | Respondida (DEC-038) |
| PA-FAC-20 | M05 | Canal de entrega de clientes migrados | Conservar el de ProCoop; sin dato, papel | Asumida (DEC-072) |
| PA-PER-01 | M01 | Verificación del vínculo usuario–persona | Código de factura + documento, código al contacto o validación presencial, con intentos limitados | Respondida (DEC-043) |
| PA-PER-02 | M01 | Documento duplicado | Único, con excepción aprobada | Respondida (DEC-044) |
| PA-PER-03 | M01 | Deuda en el domicilio/catastro (ver PA-CAT-12) | Advertir sin revelar detalle; bloqueo solo por política validada | Respondida (DEC-029) |
| PA-PER-04 | M01 | CUIL calculado | Proponerlo como "no verificado" | Asumida (DEC-072) |
| PA-PER-05 | M01 | Verificación en padrón ARCA | Al alta y al cambio; revalidar cada 30 días | Asumida (DEC-072) |
| PA-PER-06 | M01 | Deuda en el cambio de titularidad | Queda en el saliente; el nuevo solo la asume por convenio (M08) | Respondida (DEC-045) |
| PA-PER-07 | M01 | Transferencia de contrato | Clonar siempre; el origen queda "no vigente" | Asumida (DEC-072) |
| PA-PER-08 | M01 | Fallecimiento del titular | Registrar, baja de adhesiones, revocar relaciones y crear tareas, sin cortar servicios | Asumida (DEC-072) |
| PA-PER-09 | M01 | Cuenta principal | Exactamente una; titular sin cuentas solo como "solicitante" | Asumida (DEC-072) |
| PA-PER-10 | M01 | Fusión de personas duplicadas | Doble control y reversión durante 30 días | Asumida (DEC-072) |
| PA-PER-11 | M01 | Datos mínimos de registro | Nombre, una identificación y un contacto | Asumida (DEC-072) |
| PA-PER-12 | M01 | Autorizaciones desde el portal | Consultar y pagar, solo a mayores de 18 | Asumida (DEC-072) |
| PA-PER-13 | M01 | Proveedor geográfico | Georef para normalizar/geocodificar; Google Maps para mapa y autocompletado | Respondida (DEC-046) |
| PA-PER-14 | M01 | Conservación de datos personales | Plazos por categoría y anonimización, validados por asesoría legal | Asumida (DEC-072) |
| PA-PER-15 | M01 | Numeración titular/asociado (ver PA-CFG-P1-01) | Número de titular único; número de asociado en M17 | Respondida (DEC-017) |
| PA-PER-16 | M01 | Bloqueo de cobro en caja | Exige autorización de supervisor | Asumida (DEC-072) |
| PA-TEC-01 | M10 | Cierre de OT en dos pasos (ejecutada/confirmada) | Configurable por operación; dos pasos por defecto en altas, desconexiones, reconexiones y cambios de medidor | Respondida (DEC-039) |
| PA-TEC-02 | M10 | Hito de activación (ver PA-CAT-16) | Instalación probada + aprovisionamiento confirmado | Respondida (DEC-033) |
| PA-TEC-03 | M10 | Facturación de materiales | No por defecto; solo por regla o presupuesto aceptado | Asumida (DEC-072) |
| PA-TEC-04 | M10 | Factibilidad obligatoria | Configurable; obligatoria por defecto en Internet y servicios con red | Respondida (DEC-040) |
| PA-TEC-05 | M10 | Vigencia de la factibilidad | Parámetro por servicio, 90 días por defecto | Asumida (DEC-072) |
| PA-TEC-06 | M10 | Costo de la visita fallida | Sin costo por defecto, regla configurable | Asumida (DEC-072) |
| PA-TEC-07 | M10 | Firma de conformidad | Firma en pantalla + identificación del receptor + hash del documento | Asumida (DEC-072) |
| PA-TEC-08 | M10 | Umbral de insatisfacción de la encuesta | Puntaje ≤ 2 abre seguimiento en M09 | Asumida (DEC-072) |
| PA-TEC-09 | M10 | Modo de aprovisionamiento | Automático asíncrono con respaldo manual | Respondida (DEC-041) |
| PA-TEC-10 | M10 | Sistemas de red del piloto (O3) | MikroTik, Radius y SmartOLT | Respondida (DEC-042) |
| PA-TEC-11 | M10 | Alcance del análisis de red | Topología e impacto, sin cálculo eléctrico | Asumida (DEC-072) |
| PA-TEC-12 | M10 | Mapa base (ver PA-PER-13) | Google Maps con proveedor abstraído | Respondida (DEC-046) |
| PA-TEC-13 | M10 | Formatos de CDR prioritarios | Los de las cooperativas que migran primero; lectores como plugins | Asumida (DEC-072) |
| PA-TEC-14 | M10 | Telefonía móvil (Claro/Personal) | Importador configurable en O10 | Asumida (DEC-072) |
| PA-TEC-15 | M10 | Recupero por fraude | Flujo configurable, aprobado por rol distinto del inspector, método versionado | Asumida (DEC-072) |
| PA-TEC-16 | M10 | Prorrateo de contribución por mejoras | Metros de frente, configurable por obra | Asumida (DEC-072) |
| PA-TEC-17 | M10 | Responsable de conflictos offline | Supervisor de zona, con escalamiento | Asumida (DEC-072) |
| PA-TEC-18 | M10 | Retención de evidencias de campo | 10 años conformidades e inspecciones; 2 años resto; configurable | Asumida (DEC-072) |
| PA-CRM-01 | M09 | Catálogo inicial de tipos, motivos y estados de casos | Catálogo base precargado y editable | Asumida (DEC-072) |
| PA-CRM-02 | M09 | Derivación automática de casos | Supervisión obligatoria; reglas solo proponen; auto-derivación habilitable, apagada por defecto | Asumida (DEC-072) |
| PA-CRM-03 | M09 | Cálculo del SLA | Horas hábiles del tenant; corridas para crítica; pausa esperando al socio | Asumida (DEC-072) |
| PA-CRM-04 | M09 | Cierre de casos resueltos | Automático a los 7 días si el socio no responde | Asumida (DEC-072) |
| PA-CRM-05 | M09 | Reapertura de casos | Mismo caso dentro de 30 días; después uno nuevo vinculado | Asumida (DEC-072) |
| PA-CRM-06 | M09 | Proveedor de WhatsApp | Meta Cloud API por defecto, adaptador para Trii | Respondida (DEC-055) |
| PA-CRM-07 | M09 | Verificación de identidad en el bot | Teléfono verificado vinculado + OTP de respaldo | Asumida (DEC-072) |
| PA-CRM-08 | M09 | Horario de atención | Bot 24×7; humanos en horario; fuera de horario caso con plazo y urgencias a guardia | Asumida (DEC-072) |
| PA-CRM-09 | M09 | Funciones de IA en atención | Clasificar/resumir/sugerir en O6, adjuntos en O10; apagada hasta aceptación del tenant | Respondida (DEC-056) |
| PA-CRM-10 | M09 | Visibilidad de notas internas | Empleados con acceso al caso; nota restringida opcional con permiso propio | Asumida (DEC-072) |
| PA-CRM-11 | M09 | Adjuntos permitidos | jpg, png, heic, webp, pdf; 10 MB, 10 por mensaje, antivirus | Asumida (DEC-072) |
| PA-CRM-12 | M09 | Horas y proyectos | Registro de horas genérico y bolsa TIC como Extensión en O10 | Asumida (DEC-072) |
| PA-CRM-13 | M09 | Turno online | Fila virtual y reserva horaria configurables por área | Asumida (DEC-072) |
| PA-CRM-14 | M09 | Hardware del turnero | Pantallas y tótem web sin agente; agente local solo impresora térmica y serie | Asumida (DEC-072) |
| PA-CRM-15 | M09 | Baja pública (botón de baja) | Habilitada en Internet, TV y telefonía; configurable para otros; código en 24 h | Respondida (DEC-057) |
| PA-CRM-16 | M09 | Oportunidades y campañas comerciales | Fuera del alcance inicial; campañas en T09 | Asumida (DEC-072) |
| PA-CRM-17 | M09 | Numeración de mesa de entradas | Anual ME-AAAA-NNNNN con entradas, salidas y pases con acuse | Asumida (DEC-072) |
| PA-CRM-18 | M09 | Cobro de visita improcedente (ver PA-TEC-06) | Solo con regla aprobada y aviso previo | Asumida (DEC-072) |
| PA-FIS-01 | M06 | Uso del CAEA | Solo contingencia; habilitable por punto de venta para masiva si la norma lo permite | Asumida (DEC-072) |
| PA-FIS-02 | M06 | CESP para LQSP | Sí, en O7, separado del CAEA | Asumida (DEC-072) |
| PA-FIS-03 | M06 | Obtención del certificado ARCA | Generar clave y CSR en la plataforma + admitir PFX existente | Respondida (DEC-053) |
| PA-FIS-04 | M06 | Agrupación en rango B/C | Opcional, apagada por defecto, con tope normativo | Asumida (DEC-072) |
| PA-FIS-05 | M06 | Pagos parciales con conceptos de terceros | Prorrata | Asumida (DEC-072) |
| PA-FIS-06 | M06 | Ola del Libro IVA | Criterio facturado en O4; resto en O8 | Asumida (DEC-072) |
| PA-FIS-07 | M06 | RG 3571 y RG 5746/2025 | En O7 | Asumida (DEC-072) |
| PA-FIS-08 | M06 | Modo pasarela fiscal | En O11 | Asumida (DEC-072) |
| PA-FIS-09 | M06 | Jurisdicciones de IIBB | Córdoba en O4; resto como configuración en O8 | Respondida (DEC-054) |
| PA-FIS-10 | M06 | Servicio de padrón ARCA (ver PA-PER-05) | A13 + constancia de inscripción | Asumida (DEC-072) |
| PA-FIS-11 | M06 | Espera de CAE en mostrador/cobranza (ver PA-CFG-P2-06) | 15 s y aviso posterior | Respondida (DEC-018) |
| PA-FIS-12 | M06 | Adopción de tablas normativas | Explícita, aprobada por el responsable fiscal | Asumida (DEC-072) |
| PA-FIS-13 | M06 | ENACOM | Configuración en base y solo informes vigentes | Asumida (DEC-072) |
| PA-FIS-14 | M06 | Informes ERSeP y ENARGAS | Todos, configurables, priorizando los del piloto | Asumida (DEC-072) |
| PA-FIS-15 | M06 | SICORE de sueldos | M16 calcula y M06 genera un SICORE único | Asumida (DEC-072) |
| PA-FIS-16 | M06 | FECESCOR | En O8 | Asumida (DEC-072) |
| PA-FIS-17 | M06 | Revalidación de padrón | Propone cambios y requiere aprobación | Asumida (DEC-072) |
| PA-FIS-18 | M06 | Mantenimiento de padrones de IIBB (ex PA-CFG-05) | Mixto: públicos los ingesta la plataforma; con credenciales del agente, cada tenant | Asumida (DEC-072) |
| PA-COB-01 | M07 | Regla de imputación por defecto | Por antigüedad, recargos primero, respetando la elección del socio o cajero | Respondida (DEC-048) |
| PA-COB-02 | M07 | Cuentas unificadas múltiples por titular | Una por grupo de facturación | Asumida (DEC-072) |
| PA-COB-03 | M07 | Créditos entre servicios | Automático solo dentro del mismo servicio; entre servicios con elección o autorización | Respondida (DEC-049) |
| PA-COB-04 | M07 | Excedentes de pago | Saldo a favor en la misma cuenta, aplicable a próximas facturas | Asumida (DEC-072) |
| PA-COB-05 | M07 | Diferencia entre pagado y esperado | Aceptar, imputar y mandar la diferencia a revisión | Asumida (DEC-072) |
| PA-COB-06 | M07 | Significado del mínimo de pago | Umbral para evaluar la mora; no cancela deuda ni evita intereses | Asumida (DEC-072) |
| PA-COB-07 | M07 | Pago parcial | En caja con permiso; en entes según la configuración del ente | Asumida (DEC-072) |
| PA-COB-08 | M07 | Arqueo de caja | Declaración por cada medio de pago | Asumida (DEC-072) |
| PA-COB-09 | M07 | Identificador publicado y transición | Identificador nuevo autocontenido + resolución por clave anterior hasta vencer facturas ProCoop | Respondida (DEC-050) |
| PA-COB-10 | M07 | Registración bancaria de rendiciones | Por fecha de acreditación | Asumida (DEC-072) |
| PA-COB-11 | M07 | Cargos en contracargos | Configurables, desactivados por defecto | Asumida (DEC-072) |
| PA-COB-12 | M07 | Devoluciones por API | Expediente en COB; ejecuta el proveedor si puede, si no M14 | Asumida (DEC-072) |
| PA-COB-13 | M07 | Pasarelas prioritarias en O5 (ver PA-CFG-P3-05) | SIRO, Red Link, Pagos360 y Mercado Pago | Respondida (DEC-015) |
| PA-COB-14 | M07 | Cobranza offline de cobradores | Efectivo y transferencia informada, con límite por cobrador | Asumida (DEC-072) |
| PA-COB-15 | M07 | Adelantar venta prepaga para la piloto | COB deja el cobro genérico en O5 y M03 adelanta solo el subconjunto prepago | Asumida (DEC-072) |
| PA-COB-16 | M07 | Código de barras SIRO para importes ≥ ARS 100.000 | Acordar formato extendido con el banco; mientras tanto código electrónico y QR | Asumida (DEC-072) |
| PA-COB-17 | M07 | Traslado de comisión de pasarela al socio | No trasladar por defecto | Asumida (DEC-072) |
| PA-COB-18 | M07 | Frecuencia del resumen de cuenta | Mensual por grupo de facturación al cierre del ciclo | Asumida (DEC-072) |
| PA-MOR-01 | M08 | Interés simple o compuesto | Simple diario, sin interés sobre interés | Asumida (DEC-072) |
| PA-MOR-02 | M08 | Mínimo de recargo (#609) | Dos modos; por defecto bajo el mínimo se cobra 0 | Asumida (DEC-072) |
| PA-MOR-03 | M08 | Recargo en cascada e IVA del importe fijo | Simple por defecto; cascada opcional; IVA según el concepto | Asumida (DEC-072) |
| PA-MOR-04 | M08 | Documento y momento del interés (ver PA-CFG-P1-04) | Nota de débito asociada, sin diferir por defecto, configurable | Asumida (DEC-072) |
| PA-MOR-05 | M08 | Instancias de mora del piloto Internet | Candidato → Aviso → Intimación con preaviso → Suspensión → Baja por mora | Asumida (DEC-072) |
| PA-MOR-06 | M08 | Preaviso de corte y constancia | Preaviso mínimo con evidencia digital, validado legalmente por servicio | Asumida (DEC-072) |
| PA-MOR-07 | M08 | Protecciones contra el corte | Bloqueo total para electrodependientes; revisión con aprobación para público, salud y educación | Asumida (DEC-072) |
| PA-MOR-08 | M08 | Afectación cruzada entre servicios de una cuenta unificada | Deshabilitada | Asumida (DEC-072) |
| PA-MOR-09 | M08 | Pago mínimo (ver PA-COB-06) | Solo evita la suspensión | Asumida (DEC-072) |
| PA-MOR-10 | M08 | Ventanas de corte | Días hábiles, sin viernes, vísperas ni feriados, horario restringido | Asumida (DEC-072) |
| PA-MOR-11 | M08 | Deuda a pagar para reconectar (ver PA-CFG-P1-05/P3-04) | La vencida del servicio afectado, con pago confirmado | Asumida (DEC-072) |
| PA-MOR-12 | M08 | Cargos por notificación, gastos y reconexión | Deshabilitados/gratuitos, habilitables con respaldo | Asumida (DEC-072) |
| PA-MOR-13 | M08 | Caducidad del convenio | 3 cuotas impagas o 60 días; saldo de capital exigible; la deuda original no revive | Asumida (DEC-072) |
| PA-MOR-14 | M08 | Variantes del proceso masivo de intereses | Unificarlas en una corrida parametrizada | Asumida (DEC-072) |
| PA-MOR-15 | M08 | Tasa y CFT de financiación | Cargar TNA, derivar tasa por período, mostrar CFT y TEA | Asumida (DEC-072) |
| PA-MOR-16 | M08 | Firma del convenio | Aceptación con OTP y firma presencial en tableta; firma digital como extensión | Asumida (DEC-072) |
| PA-MOR-17 | M08 | Incobrables | Previsión por antigüedad y castigo con doble aprobación, sin borrar deuda | Asumida (DEC-072) |
| PA-MOR-18 | M08 | Gastos y honorarios judiciales | Se trasladan al deudor solo con título | Asumida (DEC-072) |
| PA-MOR-19 | M08 | Garantías | Habilitables por servicio y categoría, deshabilitadas por defecto | Asumida (DEC-072) |
| PA-MOR-20 | M08 | Plazos de prescripción (ver PA-CFG-P3-01) | Configurables por tipo de obligación; sugerido 2 años para periódicas | Respondida (DEC-052; antes Asumida (DEC-072)) |
| PA-STK-01 | M13 | Método de costeo (ver PA-CFG-P4-04) | PPP móvil por artículo; serializados por costo de su serie | Asumida (DEC-072) |
| PA-STK-02 | M13 | Validación del consumo de campo | Afecta stock al sincronizar; supervisor revisa por excepción | Asumida (DEC-072) |
| PA-STK-03 | M13 | Modo de entrega de equipos | Configurable por servicio; por defecto stock rodante con reserva por modelo | Asumida (DEC-072) |
| PA-STK-04 | M13 | Diferencias de rendición de materiales | Ajuste aprobado imputable/no imputable, sin cargo automático al empleado | Asumida (DEC-072) |
| PA-STK-05 | M13 | Equipo en comodato no devuelto | 30 días y propuesta de cargo al costo de reposición, con aprobación | Asumida (DEC-072) |
| PA-STK-06 | M13 | Unidades de gasto | Destino interno de consumo asociado a centro de costo M15 | Asumida (DEC-072) |
| PA-STK-07 | M13 | Inventario físico | Corte con foto de saldos, sin bloquear movimientos | Asumida (DEC-072) |
| PA-STK-08 | M13 | Equipos del socio o de terceros | Se registran identificadores, sin existencia ni valorización | Asumida (DEC-072) |
| PA-STK-09 | M13 | Contabilidad del comodato | Activo "equipos en comodato" sin amortizar, opción como bien de uso | Asumida (DEC-072) |
| PA-POR-01 | M19 | Identidad global o por tenant | Identidad común con pertenencias privadas (ya adoptado por AGR-006; candidata a cerrar sin preguntar) | Asumida (DEC-072) |
| PA-POR-02 | M19 | Consulta de facturas sin login | Opcional, con cuenta + verificador; solo impagas y enmascaradas | Asumida (DEC-072) |
| PA-POR-03 | M19 | Credenciales de CoopOnline | Migrar usuarios, vínculos y adhesiones; activar con OTP; no importar contraseñas | Asumida (DEC-072) |
| PA-POR-04 | M19 | Vinculación con CiDi | Solo si el tenant la habilita y el DNI coincide con el titular, con aviso | Respondida (DEC-067; antes Asumida (DEC-072)) |
| PA-POR-05 | M19 | Activación inmediata o solicitud | Siempre solicitud; inmediata solo adhesiones, recarga prepaga y cambios de plan configurados | Asumida (DEC-072) |
| PA-POR-06 | M19 | Tótem de autogestión | Modo tótem de la PWA con agente local, en O10 | Asumida (DEC-072) |
| PA-POR-07 | M19 | Portal en escritorio | Marco de teléfono en celular y vista ancha en PC | Asumida (DEC-072) |
| PA-POR-08 | M19 | Pagador eventual | Paga por código sin ver el detalle | Asumida (DEC-072) |
| PA-POR-09 | M19 | Pago parcial o a cuenta (ver PA-COB-07) | Solo si lo habilita la política de M07 | Asumida (DEC-072) |
| PA-POR-10 | M19 | Portal del empleado | Misma identidad, espacio separado y reautenticación | Asumida (DEC-072) |
| PA-POR-11 | M19 | Firma de recibos de sueldo (ver PA-SUE-04) | Conformidad electrónica con OTP y hash | Asumida (DEC-072) |
| PA-POR-12 | M19 | Dominio de la landing | Subdominio + dominio propio opcional con TLS automático | Asumida (DEC-072) |
| PA-POR-13 | M19 | Editor de landing | Bloques predefinidos con circuito de publicación | Asumida (DEC-072) |
| PA-POR-14 | M19 | Autolectura desde el portal (ver PA-MED-06) | Habilitable por servicio; M03 valida | Asumida (DEC-072) |
| PA-POR-15 | M19 | Socio moroso o suspendido en el portal | Nunca bloquear consulta, pago, reclamo ni baja | Asumida (DEC-072) |
| PA-POR-16 | M19 | DDJJ de artefactos y vehículos eléctricos | En alcance mediante el motor de formularios | Asumida (DEC-072) |
| PA-POR-17 | M19 | Comentarios del muro por defecto (DEC-008) | Deshabilitados por defecto, habilitables por tenant y publicación | Asumida (DEC-072) |
| PA-POR-18 | M19 | Resúmenes de terceros (FECESCOR) (ver PA-FIS-16) | Extensión en O8, deshabilitada por defecto | Asumida (DEC-072) |
| PA-POR-19 | M19 | App en tiendas | PWA sin tiendas al inicio; TWA o Capacitor después | Asumida (DEC-072) |
| PA-TAR-01 | M04 | Semántica de evaluación de reglas tarifarias | Foto previa + referencias explícitas; cascada opcional por regla | Asumida (DEC-072) |
| PA-TAR-02 | M04 | Factor por días en tarifa por bloque | Ambos modos; migrados escalan cantidad, nuevos escalan límites | Asumida (DEC-072) |
| PA-TAR-03 | M04 | Errores de ProCoop durante el paralelo | Corregirlos y clasificar la diferencia como "corrección conocida" | Asumida (DEC-072) |
| PA-TAR-04 | M04 | Fecha de referencia tarifaria | Período de prestación; en medidos fecha de lectura con prorrateo | Asumida (DEC-072) |
| PA-TAR-05 | M04 | Ciclo parcial de promoción | Configurable; por defecto no consume | Asumida (DEC-072) |
| PA-TAR-06 | M04 | Cuenta corriente de redondeo | Se mantiene como movimiento en M07 | Asumida (DEC-072) |
| PA-TAR-07 | M04 | Redondeo si la fecha coincide con el 1er vencimiento | Configurable; por defecto replica ProCoop | Asumida (DEC-072) |
| PA-TAR-08 | M04 | Firmas para publicar un cuadro tarifario | Dos obligatorias y una tercera opcional | Asumida (DEC-072) |
| PA-TAR-09 | M04 | Simulación obligatoria de cambios tarifarios | Completa si el cambio supera N contratos; muestra estadística si no | Asumida (DEC-072) |
| PA-TAR-10 | M04 | Subsidios y tarifa social | Régimen, inscripción y regla por componente con origen del beneficio | Asumida (DEC-072) |
| PA-TAR-11 | M04 | Reemplazo de `FORMULA_CARGO_*` | Funciones declarativas por tenant + funciones nativas | Asumida (DEC-072) |
| PA-TAR-12 | M04 | Cambio retroactivo sobre emitidos | Simular y emitir NC/ND solo con doble firma | Asumida (DEC-072) |
| PA-TAR-13 | M04 | Demanda contratada | Actualización automática registrada, configurable a aprobación | Asumida (DEC-072) |
| PA-TAR-14 | M04 | Energía inyectada (ver PA-MED-08) | Balance neto MER-001 + modo de compatibilidad | Asumida (DEC-072) |
| PA-TAR-15 | M04 | Precisión de cálculo | Precio 6 decimales, cantidad 4, importe 2, IVA por alícuota | Asumida (DEC-072) |
| PA-TAR-16 | M04 | Cotización de moneda (ver PA-TES-09) | Vendedora del día hábil anterior a la emisión | Asumida (DEC-072) |
| PA-TAR-17 | M04 | Factura mínima | Componente estándar opcional por categoría | Asumida (DEC-072) |
| PA-TAR-18 | M04 | Errores de fórmula en el lote | Excluir la cuenta y detener el lote si superan un umbral | Asumida (DEC-072) |
| PA-CFG-01 | T04 | Revisión obligatoria de cambios de configuración | Otro usuario aprueba cambios comerciales, fiscales, de seguridad y sensibles | Asumida (DEC-072) |
| PA-CFG-02 | T04 | Fuente del catálogo de calles (ver PA-PER-13) | Georef/BAHRA en plataforma + calles locales; Google solo geocodificar y mostrar | Respondida (DEC-046; antes Asumida (DEC-072)) |
| PA-CFG-03 | T04 | Persistencia de datos de Google | Punto confirmado y `place_id`; respuestas crudas 30 días; validar con legales | Asumida (DEC-072) |
| PA-CFG-04 | T04 | Clave y cuota de Google (ver PA-CFG-P1-03) | Clave de plataforma con cuota por tenant + opción de clave propia | Respondida (DEC-020; antes Asumida (DEC-072)) |
| PA-CFG-05 | T04 | Padrones de IIBB | Públicos los carga la plataforma; con credenciales, cada tenant | Reemplazada por PA-FIS-18 (trasladada a M06 con los padrones, CTR-DAT-13) |
| PA-CFG-06 | T04 | Puesto/terminal como ámbito de configuración | No es ámbito; atributos del dispositivo en M07/M09 | Asumida (DEC-072) |
| PA-CFG-07 | T04 | 622 parámetros sin uso directo (ver PA-CFG-P2-01) | Clasificarlos con la piloto; mientras tanto "A validar" | Asumida (DEC-072) |
| PA-CFG-08 | T04 | Retroactividad de configuración | Hasta 31 días, con aprobación, sin reescribir documentos | Asumida (DEC-072) |
| PA-CFG-09 | T04 | Personalización de formularios | Ocultar, obligatorio, default, etiqueta, orden y valores permitidos, sin lógica | Asumida (DEC-072) |
| PA-CFG-10 | T04 | Adopción de tablas de plataforma (ver PA-FIS-12) | Referencia siempre; las que afectan cálculos con aviso y aceptación | Asumida (DEC-072) |
| PA-CFG-11 | T04 | Datos semilla en productivo | Solo demo/sandbox; en productivo copia o plantillas sin importes | Asumida (DEC-072) |
| PA-CFG-12 | T04 | Límite de campos extra | 50 por entidad, incluidos en la licencia | Asumida (DEC-072) |
| PA-CFG-13 | T04 | Calles creadas por el tenant | Locales "pendiente de validación" con propuesta opcional a plataforma | Asumida (DEC-072) |
| PA-CMP-01 | M12 | Padrón de proveedores en O3 | Sí, padrón mínimo (razón social, CUIT, condición IVA) y registro simple de ingreso, sin OC obligatoria | Asumida (DEC-072) |
| PA-CMP-02 | M12 | Nota de pedido | Unificar: la nota de pedido es una liberación contra OC abierta | Asumida (DEC-072) |
| PA-CMP-03 | M12 | Recepción implícita en la factura (P583) | Sí, con capability: la factura genera una recepción separada que se publica a M13 | Asumida (DEC-072) |
| PA-CMP-04 | M12 | Tolerancias del control de 3 vías | Cantidad 0 %, precio ±2 % con tope ARS 1.000, configurable por tenant y categoría | Asumida (DEC-072) |
| PA-CMP-05 | M12 | Portal de proveedores | Invitación individual con rol `supplier` en Landing-autogestión (T02) | Asumida (DEC-072) |
| PA-CMP-06 | M12 | Ajuste manual de retenciones (P2836) | Sí, con capability, motivo y aprobación, conservando el valor calculado | Asumida (DEC-072) |
| PA-CMP-07 | M12 | Compras sin OC | Solo categorías definidas (servicios públicos, impuestos y tasas, caja chica, montos menores a umbral), con aprobación posterior | Asumida (DEC-072) |
| PA-CMP-08 | M12 | Habilitación parcial de lo conciliado | Habilitar solo el importe conciliado | Asumida (DEC-072) |
| PA-CMP-09 | M12 | Compromisos y control presupuestario (AGR-028) | Eventos de compromiso en O8 (comprometido/devengado/pagado); control presupuestario bloqueante como Extensión de M15 | Asumida (DEC-072) |
| PA-CMP-10 | M12 | Mis Comprobantes | Solo borradores con revisión humana | Asumida (DEC-072) |
| PA-CMP-11 | M12 | Lectura de facturas con IA | Opt-in por tenant con acuerdo de tratamiento de datos, en O11, siempre con confirmación humana | Asumida (DEC-072) |
| PA-CMP-12 | M12 | Adelantos y pagos de sueldos | Mover a M16; M12 solo ejecuta OP cuando M16 envía un lote aprobado | Asumida (DEC-072) |
| PA-CMP-13 | M12 | Concursos y licitaciones | O8, nivel Estándar, con sobre cerrado y acta | Asumida (DEC-072) |
| PA-CMP-14 | M12 | Compras compartidas entre servicios | Obligatoria cuando la línea abastece más de un servicio, por porcentaje o cantidad, sumando 100 % | Asumida (DEC-072) |
| PA-CMP-15 | M12 | Habilitación de pago (P2201/P2457) | Automática por conciliación sin excepciones; manual con capability y bandas T11 | Asumida (DEC-072) |
| PA-CON-01 | M15 | Modo y granularidad de contabilización | Tiempo real por operación en ERP administrativo (compras, tesorería, stock, sueldos, capital) y resumen diario por servicio y concepto en facturación y cobranza masiva... | Asumida (DEC-072) |
| PA-CON-02 | M15 | Evento sin cuenta configurada | No se bloquea el origen; el evento queda pendiente y bloquea el cierre del período | Asumida (DEC-072) |
| PA-CON-03 | M15 | Contabilidad durante el paralelo con ProCoop | La contabilidad oficial sigue en ProCoop hasta el by-pass; CoopApps contabiliza todo en un plan marcado no oficial y concilia contra ProCoop; se oficializa en el by-pass | Respondida (DEC-069) |
| PA-CON-04 | M15 | Anulación y eliminación de asientos | Borradores eliminables; contabilizados de período abierto no transcripto → anulación lógica; resto → contraasiento | Asumida (DEC-072) |
| PA-CON-05 | M15 | Más de un plan oficial | Un plan operativo por ejercicio; los demás analíticos por equivalencias | Asumida (DEC-072) |
| PA-CON-06 | M15 | Marco normativo de estados contables | Normas contables profesionales FACPCE aplicables a cooperativas (RT 24 y vigentes [VERIFICAR]) y requisitos INAES, en plantilla versionada validada por el contador | Asumida (DEC-072) |
| PA-CON-07 | M15 | Ajuste por inflación | Ajuste integral al cierre del ejercicio en CoopApps, con opción mensual | Asumida (DEC-072) |
| PA-CON-08 | M15 | Libros rubricados | Hojas rubricadas en papel y libros digitales cuando el organismo de la jurisdicción lo admita | Asumida (DEC-072) |
| PA-CON-09 | M15 | Control presupuestario | Advertir y exigir autorización para exceder | Asumida (DEC-072) |
| PA-CON-10 | M15 | Momento del asiento de cobros en caja | Al confirmar el pago; el cierre de período exige cajas cerradas | Asumida (DEC-072) |
| PA-CON-11 | M15 | Provisiones automáticas | SAC, vacaciones e incobrables automáticos y configurables | Asumida (DEC-072) |
| PA-CON-12 | M15 | Alcance del presupuesto | Presupuesto económico por cuenta, centro y servicio con compromisos de compras en O8; financiero (flujo de fondos) en una etapa posterior | Asumida (DEC-072) |
| PA-CON-13 | M15 | Cuentas de orden en el cierre | Se incluyen en el cierre patrimonial y se reabren en la apertura | Asumida (DEC-072) |
| PA-CON-14 | M15 | Ingresos devengados no facturados | Provisión al cierre configurable (desactivada por defecto) con reversión automática | Asumida (DEC-072) |
| PA-CON-15 | M15 | Plan y reglas modelo de plataforma | Sí, plantilla de plataforma validada por un contador, copiada al tenant y luego propia | Asumida (DEC-072) |
| PA-CON-16 | M15 | Servicio obligatorio en cuentas de control | Obligatorio en créditos por servicios, ingresos y costos directos | Asumida (DEC-072) |
| PA-SOC-01 | M18 | Alcance de internaciones y salud | Registro administrativo de autorizaciones por convenio (prestador, fechas, número, costo), sin datos clínicos | Asumida (DEC-072) |
| PA-SOC-02 | M18 | Ambulancias: emergencias o traslados programados | Traslados programados y registro administrativo de viajes; emergencias derivadas al prestador habilitado (`derived`) | Asumida (DEC-072) |
| PA-SOC-03 | M18 | Datos del banco de sangre | Solo datos administrativos (persona, contacto, referencia del prestador); sin grupo sanguíneo, diagnóstico ni aptitud | Asumida (DEC-072) |
| PA-SOC-04 | M18 | Edad de corte de adherentes | Configurable por plan y vínculo, con 21 por defecto y extensión por estudio o discapacidad | Asumida (DEC-072) |
| PA-SOC-05 | M18 | Modalidad jurídica del cementerio | Configurable por establecimiento; los derechos referencian el reglamento vigente | Asumida (DEC-072) |
| PA-SOC-06 | M18 | Cesión, devolución y extinción de derechos de sepultura | Trámites con workflow T11 y aprobación jurídica; nunca automáticos por mora | Asumida (DEC-072) |
| PA-SOC-07 | M18 | Proveedor GPS/AVL | Adaptador genérico T06 (webhook o pull) con Discar como primer adaptador si el piloto lo usa | Asumida (DEC-072) |
| PA-SOC-08 | M18 | Fondo fiduciario de vivienda | Regla de mora configurable por plan, desactivada por defecto | Asumida (DEC-072) |
| PA-SOC-09 | M18 | Actualización del precio de la vivienda | Precio vigente por tipología con actualización masiva manual o por índice (por ejemplo, costo de la construcción) con aprobación | Asumida (DEC-072) |
| PA-SOC-10 | M18 | Subsidio por fallecimiento | Configurable por plan; por defecto fondo propio por reglamento aprobado con pago por M14 | Asumida (DEC-072) |
| PA-SOC-11 | M18 | Carencias de sepelio | Carencia configurable por plan, contada desde el alta de cada adherente, con excepción autorizada | Asumida (DEC-072) |
| PA-SOC-12 | M18 | Rendiciones de viaje | Rendición genérica de M18 vinculable a venta, viaje u OT | Asumida (DEC-072) |
| PA-SOC-13 | M18 | Comprobante exclusivo de vivienda | Replicar comprobante exclusivo configurable | Asumida (DEC-072) |
| PA-SOC-14 | M18 | Ola de adherentes | Registro de adherentes y `billing-inputs` en O4; el resto de M18 en O10 | Respondida (DEC-071) |
| PA-SOC-15 | M18 | Uso real de planes de vivienda y ambulancias | Especificar completo y habilitar por tenant; priorizar dentro de O10 según uso real | Asumida (DEC-072) |
| PA-PLA-01 | T01 | Región de alojamiento de datos | AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia según AAIP  — menor latencia regional, cumplimiento contractual | Respondida (DEC-062) |
| PA-PLA-02 | T01 | Objetivos de RPO y RTO | RPO ≤ 15 min; RTO por tenant ≤ 4 h; plataforma completa ≤ 8 h  — alcanzable con PITR y backups lógicos por tenant | Respondida (DEC-063) |
| PA-PLA-03 | T01 | SLO de disponibilidad, latencia y SLA de soporte | 99,5 % mensual; p95 interactivo ≤ 800 ms; soporte lun–vie 8–18 con P1 24×7 y plazos de `PRM-PLA-035`  — valores iniciales razonables para un equipo chico | Respondida (DEC-063) |
| PA-PLA-04 | T01 | Portal del socio durante la suspensión del tenant | Consulta y pagos activos; nuevas solicitudes bloqueadas  — protege al socio y la cobranza | Asumida (DEC-072) |
| PA-PLA-05 | T01 | Aprobación del acceso de soporte | `observe` sin datos personales: aprobación de plataforma y aviso al tenant; con datos personales, `operate` o `config`: aprobación del administrador del tenant; break-... | Asumida (DEC-072) |
| PA-PLA-06 | T01 | Forma del ambiente de prueba de cada cooperativa | Ambiente `sandbox` separado con un tenant gemelo por cooperativa  — aislamiento total de credenciales y envíos | Asumida (DEC-072) |
| PA-PLA-07 | T01 | Datos del sandbox | Ficticios por defecto y copia anonimizada solo con aprobación del administrador y de seguridad | Asumida (DEC-072) |
| PA-PLA-08 | T01 | Facturación del servicio SaaS a las cooperativas | Con el propio módulo FAC bajo el tenant PLATFORM desde O5; en O1, prefactura exportable  — dogfooding y una sola lógica fiscal | Respondida (DEC-065) |
| PA-PLA-09 | T01 | Modelo comercial | Packs por tamaño más complementos, con cupo por contratos activos  — predecible y alineado al valor | Respondida (DEC-065) |
| PA-PLA-10 | T01 | Comportamiento al superar el cupo duro | Solo nuevas altas de la dimensión excedida (p. ej. nuevos contratos); el resto sigue | Asumida (DEC-072) |
| PA-PLA-11 | T01 | Dominios de la cooperativa | Subdominio de la plataforma y dominio propio opcional verificado | Asumida (DEC-072) |
| PA-PLA-12 | T01 | Política de salida de una cooperativa | 90 días de solo lectura con exportación completa, luego retención de `PRM-PLA-005` días antes de purgar; la custodia fiscal queda en manos de la cooperativa con la exp... | Asumida (DEC-072) |
| PA-PLA-13 | T01 | Versiones por cooperativa | Misma versión para todos; cambios visibles por feature flags y anillos, sin diferir | Asumida (DEC-072) |
| PA-PLA-14 | T01 | Varias personas jurídicas en un mismo tenant | Sí, mediante `legalEntities` del tenant gestionadas en T04 (emisión, contabilidad y sueldos por entidad) | Respondida (DEC-064) |
| PA-IAM-01 | T02 | Ingreso del socio sin contraseña | OTP de 6 dígitos por correo/SMS como alternativa habilitable por tenant; sin enlace mágico  — simple, compatible con la PWA; cuenta como un factor | Respondida (DEC-066) |
| PA-IAM-02 | T02 | CiDi Córdoba | Proveedor federado habilitable por tenant para socios en O1 (mecanismo) con activación cuando se publique el portal (O2), nivel mínimo 2 para vincular  — cubre coopera... | Respondida (DEC-067) |
| PA-IAM-03 | T02 | MFA para socios | Opcional, con step-up obligatorio para acciones sensibles (baja, cambio de titularidad, alta de representante, medio de pago, cambio de correo/teléfono)  — equilibrio ... | Asumida (DEC-072) |
| PA-IAM-04 | T02 | Separación de funciones estática | SoD dinámica siempre bloqueante; estática en modo advertencia con excepción aprobada, control compensatorio y reporte al síndico  — viable en cooperativas chicas | Asumida (DEC-072) |
| PA-IAM-05 | T02 | Operación fuera de la franja horaria | Se permite iniciar sesión pero se bloquean las pantallas fuera de franja; cada operación puntual puede autorizarla un supervisor  — conserva el control y resuelve urge... | Asumida (DEC-072) |
| PA-IAM-06 | T02 | Acceso de la plataforma a datos operativos | Ninguno por defecto; solo con acceso temporal aprobado por el T-ADM, salvo emergencia por P-SUP con aviso inmediato y revisión posterior  — máxima confianza del tenant | Asumida (DEC-072) |
| PA-IAM-07 | T02 | Cobertura de la auditoría de lecturas | Datos sensibles, informes, exportaciones, descargas masivas y búsquedas amplias | Asumida (DEC-072) |
| PA-IAM-08 | T02 | Empleado y socio en la misma cooperativa | Misma identidad, dos contextos (staff/portal) con cambio explícito; sus acciones sensibles sobre registros propios desde staff requieren otro usuario | Asumida (DEC-072) |
| PA-IAM-09 | T02 | Roles predefinidos o configurables | Plantillas de plataforma versionadas (no editables) que el tenant instancia, clona y ajusta, más roles propios | Asumida (DEC-072) |
| PA-IAM-10 | T02 | Identificador de login del staff | Ambos: alias único por tenant o correo  — continuidad con ProCoop | Asumida (DEC-072) |
| PA-IAM-11 | T02 | Passkeys (WebAuthn) | Sí en O1, opcionales para todos y recomendadas para plataforma y T-ADM | Asumida (DEC-072) |
| PA-IAM-12 | T02 | Prueba para vincular cuentas en el portal | DNI/CUIT del titular + número de cuenta/suministro + un dato de un comprobante de los últimos 6 meses (número o importe), o código enviado al contacto registrado en M01 | Respondida (DEC-043; antes Asumida (DEC-072)) |
| PA-IAM-13 | T02 | SMS como segundo factor | Permitido para roles operativos y socios; prohibido para plataforma, T-ADM y T-USR | Asumida (DEC-072) |
| PA-IAM-14 | T02 | Suspensión de usuarios inactivos | Sí, a los 90 días sin ingreso, con aviso 7 días antes; reactivación por T-ADM/T-USR | Asumida (DEC-072) |
| PA-IAM-15 | T02 | Alta automática por SSO | No; requiere invitación previa | Asumida (DEC-072) |
| PA-IAM-16 | T02 | Recertificación periódica | Semestral para asignaciones con capabilities sensibles; suspensión si no se confirma | Asumida (DEC-072) |
| PA-IAM-17 | T02 | Alcance del consejero y del síndico | Síndico: lectura de todos los módulos y auditoría, sin datos de salud ni legajos individuales salvo pedido justificado (acceso temporal aprobado por T-ADM); consejero:... | Asumida (DEC-072) |
| PA-MIG-01 | T07 | Profundidad del histórico y plazo de archivo | Ejercicio en curso + 24 meses tipados; el resto en `legacyRecords` consultable; snapshot conservado 10 años  — carga acotada, cumplimiento fiscal | Respondida (DEC-070) |
| PA-MIG-02 | T07 | Duración y criterio de aprobación de la corrida paralela | 2 ciclos consecutivos por servicio con 0 diferencias sin explicar  — evidencia suficiente con costo acotado | Asumida (DEC-072) |
| PA-MIG-03 | T07 | Modo de sincronización durante la convivencia | Delta unidireccional ProCoop→CoopApps mientras ProCoop es maestro; luego exportaciones CoopApps→ProCoop para módulos que siguen en ProCoop  — un solo maestro por dominio | Asumida (DEC-072) |
| PA-MIG-04 | T07 | Módulos que permanecen en ProCoop tras el corte comercial | E2: corte comercial primero (socios, servicios, facturación, cobranza, mora); contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta E3 corte admini... | Respondida (DEC-068) |
| PA-MIG-05 | T07 | Forma del saldo de apertura de deuda | Documento por documento (facturas/obligaciones pendientes)  — intereses, imputación y NC exactas | Asumida (DEC-072) |
| PA-MIG-06 | T07 | Intereses devengados al corte | Recalcular con las tablas de tasas migradas y conciliar contra ProCoop; diferencias explicadas  — un único motor de intereses | Asumida (DEC-072) |
| PA-MIG-07 | T07 | Contraseñas y activación de usuarios | No migrar contraseñas; enviar invitación de activación por mail/SMS  — seguro | Asumida (DEC-072) |
| PA-MIG-08 | T07 | Numeración de comprobantes después del corte | Mismos puntos de venta; continuar con el último número consultado a ARCA al corte  — sin trámites, continuidad | Asumida (DEC-072) |
| PA-MIG-09 | T07 | Profundidad contable | Saldos de apertura + asientos del ejercicio en curso  — continuidad del ejercicio | Asumida (DEC-072) |
| PA-MIG-10 | T07 | Deduplicación de personas | Asistida: el sistema propone candidatos y una persona aprueba  — calidad con control | Asumida (DEC-072) |
| PA-MIG-11 | T07 | CUIT/DNI inválidos | Cargar marcadas como "documento a revisar" y bloquear factura A hasta corregir  — no frena la migración | Asumida (DEC-072) |
| PA-MIG-12 | T07 | Normalización de domicilios y geocodificación | Normalizar contra el maestro de calles y sugerir geocodificación para aprobación  — mejora sin bloquear | Asumida (DEC-072) |
| PA-MIG-13 | T07 | Modelo GIS duplicado (`NIV_*` vs `REDES_*`) | Prevalece `REDES_*`; `NIV_*` se consolida como atributos  — modelo más completo | Asumida (DEC-072) |
| PA-MIG-14 | T07 | Uso de `TICKETS` (mesa de ayuda) | Migrar abiertos + 12 meses de cerrados como atención; descartar horas bonificadas  — continuidad de atención | Asumida (DEC-072) |
| PA-MIG-15 | T07 | Método de anonimización para ambientes de prueba | Seudonimización determinística irreversible, conservando importes, fechas y relaciones  — ensayos conciliables | Asumida (DEC-072) |
| PA-MIG-16 | T07 | Vigencia de alias de códigos ProCoop | Último vencimiento emitido por ProCoop + 180 días  — cubre segundos vencimientos y atrasos | Asumida (DEC-072) |
| PA-MIG-17 | T07 | Orden de cooperativas y piloto de migración | Herramienta validada con datos sintéticos de Internet; primera migración real de la cooperativa piloto (DEC-081) tras O7 si opera servicios medidos, o desde O6 si es solo Internet | Asumida (DEC-072); con DEC-088 (piloto LAG, servicios medidos) aplica "tras O7" |
| PA-MIG-18 | T07 | Contabilidad durante el paralelo | Libros oficiales en ProCoop; CoopApps simula asientos y exporta para comparar  — un solo libro oficial | Respondida (DEC-069) |
| PA-MIG-19 | T07 | Datos de salud | Cifrado a nivel de campo y acceso restringido por capacidad  — cumplimiento | Asumida (DEC-072) |
| PA-NFR-01 | T08 | Compromiso de disponibilidad (SLA) con las cooperativas | 99,5 % durante el piloto y 99,9 % en operación general, con guardia 24×7 para SEV1/SEV2  — equilibrio costo/riesgo; cubre facturación y cobranza | Respondida (DEC-063) |
| PA-NFR-02 | T08 | RPO y RTO | RPO ≤ 5 min y RTO ≤ 4 h en plataforma; restauración selectiva de tenant ≤ 8 h; DR regional RPO ≤ 1 h / RTO ≤ 24 h  — PITR estándar de Mongo gestionado | Respondida (DEC-063) |
| PA-NFR-03 | T08 | Perfil de capacidad de referencia | Tenant estándar 25.000 y grande 150.000 suministros; 100 tenants de diseño y 300 sin rediseño  — cubre cooperativas medianas y grandes | Respondida (DEC-075) |
| PA-NFR-04 | T08 | Meta de facturación masiva | Cálculo y documentos de 50.000 suministros ≤ 60 min; CAE ≤ 2 h si ARCA responde normal; PDF ≤ 60 min; distribución ≤ 4 h  — permite emitir y distribuir en una jornada | Asumida (DEC-072) |
| PA-NFR-05 | T08 | Región de alojamiento y transferencias internacionales | Región de nube de Sudamérica (por ejemplo São Paulo) con cláusulas contractuales modelo aprobadas por la AAIP, informadas en avisos y registro de subencargados  — serv... | Respondida (DEC-062) |
| PA-NFR-06 | T08 | Plazos de conservación por categoría | Aprobar la tabla 10.3 como default, parametrizable por tenant dentro de mínimos legales, con validación del asesor antes de la primera ejecución real  — permite constr... | Asumida (DEC-072) |
| PA-NFR-07 | T08 | Rol de la plataforma ante la Ley 25.326 y contrato de encargo | GoodApps prestador de servicios de tratamiento (art. 25) con contrato tipo, lista de subencargados y destrucción al fin del encargo  — coherente con SaaS y con BASE §59 | Respondida (DEC-076) |
| PA-NFR-08 | T08 | Plazos de notificación de incidentes a la cooperativa | Aviso inicial ≤ 24 h desde la confirmación, informe preliminar ≤ 72 h y final ≤ 15 días  — permite a la cooperativa actuar como responsable | Asumida (DEC-072) |
| PA-NFR-09 | T08 | Uso de IA con datos personales | Solo proveedores con acuerdo de tratamiento y sin entrenamiento con datos, redacción de identificadores antes de enviar, habilitación por tenant y exclusión total de s... | Asumida (DEC-072) |
| PA-NFR-10 | T08 | Enlaces a comprobantes en correo o WhatsApp | Enlace de un solo documento, revocable, que vence a los 7 días y luego exige iniciar sesión  — práctico y sin exponer el bucket | Asumida (DEC-072) |
| PA-NFR-11 | T08 | Desafío antiautomatización (CAPTCHA) | Desafío de terceros respetuoso de la privacidad y accesible (tipo Turnstile), activado por riesgo  — baja fricción | Asumida (DEC-072) |
| PA-NFR-12 | T08 | Ventana de mantenimiento y congelamiento | Domingo 02:00–06:00 ART, ≤ 4 h/mes, aviso ≥ 72 h; congelamiento en días de lote y primeros vencimientos de cada tenant | Asumida (DEC-072) |
| PA-NFR-13 | T08 | Soporte mínimo de dispositivos | Android 9+ e iOS 16.4+, últimas 2 versiones de navegadores  — cubre la gran mayoría del parque y permite push en iOS | Asumida (DEC-072) |
| PA-NFR-14 | T08 | Protección de datos en el dispositivo offline | Minimización, vencimiento a 7 días, borrado al cerrar o revocar sesión y cifrado con WebCrypto de evidencias sensibles | Asumida (DEC-072) |
| PA-NFR-15 | T08 | Página de estado e información de incidentes | Página de estado pública de la plataforma + aviso en el admin + correo a administradores | Asumida (DEC-072) |
| PA-NFR-16 | T08 | Alcance de la auditoría de lecturas | Obligatoria para salud, datos bancarios completos, informes ARCO, exportaciones con datos personales, soporte y bóveda; opcional configurable para el resto  — costo ac... | Asumida (DEC-072) |
| PA-NFR-17 | T08 | Pruebas de penetración externas | Antes del go-live del piloto, anual y ante cambios mayores de autenticación, pagos o tenancy | Asumida (DEC-072) |
| PA-NFR-18 | T08 | Plazo de soporte de versiones de la API externa | 12 meses desde la publicación de la nueva versión | Asumida (DEC-072) |
| PA-NFR-19 | T08 | Datos reales en ensayos | Pruebas de carga solo con datos sintéticos; ensayos de migración con copia real únicamente en un ambiente aislado de migración, autorizado por la cooperativa, con acce... | Asumida (DEC-072) |
| PA-NFR-20 | T08 | Comunicaciones promocionales y Registro "No Llame" | Separar transaccional de promocional; promocional con consentimiento u oposición respetada y consulta del registro para llamadas y mensajes | Asumida (DEC-072) |
| PA-NFR-21 | T08 | Redondeo por defecto | Mitad hacia arriba a 2 decimales por línea, IVA por alícuota sobre la suma de netos del comprobante y residuos por mayor resto  — práctica comercial habitual | Asumida (DEC-072) |
| PA-INT-01 | T06 | Modelo de contratación de proveedores | Credenciales propias del tenant para fiscal, bancos y pasarelas; conexiones de plataforma compartidas para email, SMS, mapas e IA, reemplazables por las del tenant  — ... | Respondida (DEC-020) |
| PA-INT-02 | T06 | Bóveda de secretos y KMS | Envelope encryption propio en Mongo con clave maestra en un KMS gestionado del proveedor de nube, detrás de una interfaz agnóstica  — portable y auditable | Respondida (DEC-074) |
| PA-INT-03 | T06 | Custodia del certificado ARCA | Clave y CSR generados en el servidor; la clave nunca sale de la bóveda  — sin manipulación de archivos sensibles | Respondida (DEC-053) |
| PA-INT-04 | T06 | CAE o CAEA en facturación masiva | CAE en lotes como modo normal y CAEA solo como contingencia, si el tenant lo habilita  — validación inmediata | Respondida (DEC-018/038) |
| PA-INT-05 | T06 | Proveedor de WhatsApp | Meta Cloud API directo, con adaptador BSP opcional por tenant  — menor costo y sin intermediarios | Respondida (DEC-055) |
| PA-INT-06 | T06 | Proveedor de SMS | Un agregador local argentino como conexión de plataforma, con interfaz que permita agregar otro (ej. Twilio) por tenant  — costo y entregabilidad locales | Asumida (DEC-072) |
| PA-INT-07 | T06 | Proveedor y dominio de email | Proveedor transaccional de plataforma con dominio verificado por tenant (SPF/DKIM/DMARC) y SMTP propio opcional | Asumida (DEC-072) |
| PA-INT-08 | T06 | Proveedor de IA y datos personales | Abstracción multi-proveedor, redacción de datos personales no necesarios, sin entrenamiento con datos del cliente, activación opt-in por tenant | Respondida (DEC-056) |
| PA-INT-09 | T06 | Agente local | Agente propio CoopApps (O10), saliente por WebSocket, multiplataforma  — reemplaza Agente/Integra con seguridad | Asumida (DEC-072) |
| PA-INT-10 | T06 | Reconsulta de webhooks | Siempre, sin opción de desactivarlo en pagos  — cierra el fraude por aviso falso (RN-INT-009) | Asumida (DEC-072) |
| PA-INT-11 | T06 | SIRO por archivo o por API | Ambos: archivos para publicación/rendición y API para botón/QR y consulta  — refleja el uso real | Asumida (DEC-072) |
| PA-INT-12 | T06 | Layouts de archivos | Layouts declarativos versionados + hooks de código acotados para lo no declarable | Asumida (DEC-072) |
| PA-INT-13 | T06 | Pasarelas en O5 | SIRO como Núcleo; Pagos360 y Mercado Pago como Estándar; el resto bajo demanda de un tenant | Respondida (DEC-015) |
| PA-INT-14 | T06 | Primer adaptador de telemedición | El que use la cooperativa piloto de servicios medidos; el resto bajo demanda | Asumida (DEC-072) |
| PA-INT-15 | T06 | Retención de la bitácora | Cuerpos saneados 13 meses; metadatos 10 años (plazo de conservación contable) | Asumida (DEC-072) |
| PA-INT-16 | T06 | Ambientes de prueba de proveedores | GoodApps mantiene cuentas de homologación de plataforma para desarrollo; cada tenant usa las suyas para su prueba previa a producción | Asumida (DEC-072) |
| PA-INT-17 | T06 | Links viejos de CoopOnline | Redirecciones durante 12 meses desde el corte  — no rompe links en facturas impresas | Asumida (DEC-072) |
| PA-INT-18 | T06 | Interbanking | Aplicación registrada por cada cooperativa con sus credenciales | Asumida (DEC-072) |
| PA-INT-19 | T06 | Clave de Google Maps | Clave de plataforma restringida, con cuota por tenant y opción de clave propia | Respondida (DEC-020/046) |
| PA-INT-20 | T06 | CiDi | Sí, como Extensión en O10, si la provincia habilita la integración | Respondida (DEC-067) |
| PA-INT-21 | T06 | Devoluciones por API | Sí, donde el proveedor lo permita, con aprobación de M07 y doble control | Asumida (DEC-072) |
| PA-INT-22 | T06 | Proveedor de firma | Interfaz de firma propia; proveedor concreto a decidir antes de O3 (firma de instalación), evaluando Encustody y alternativas | Respondida (DEC-078) |
| PA-INT-23 | T06 | IVR | Sí, como Extensión en O10 sobre la API interna | Asumida (DEC-072) |
| PA-INT-24 | T06 | Jurisdicciones fuera de Córdoba | Motor configurable en O4/O7 con Córdoba; otras jurisdicciones como configuración cuando haya un tenant de esa provincia | Asumida (DEC-072) |
| PA-INT-25 | T06 | Controladores fiscales | No por defecto (la cooperativa emite electrónica); solo si un tenant lo exige, en O10 | Asumida (DEC-072) |
| PA-BIA-01 | T10 | Ubicación del almacén analítico | Base lógica `<db>_analytics` leída desde un miembro oculto del replica set con etiqueta `analytics` (prioridad 0)  — aislamiento de carga suficiente, sin nueva tecnología | Asumida (DEC-072) |
| PA-BIA-02 | T10 | Formato del token de la API externa | JWT firmado de 15 minutos con lista de revocación por cliente en Redis  — validación rápida, revocación ≤ 60 s | Asumida (DEC-072) |
| PA-BIA-03 | T10 | Escrituras de terceros vía API | Solo solicitudes (persona, cuenta/servicio, reclamo) que el módulo dueño procesa con su circuito, idempotentes  — cubre bots y municipios sin saltear controles | Asumida (DEC-072) |
| PA-BIA-04 | T10 | Destinatarios externos de reportes programados | Sí, solo para reportes `sensitivity=none`, a dominios en lista permitida, como adjunto o enlace de un solo uso con vencimiento  — cubre auditores y entes sin exponer d... | Asumida (DEC-072) |
| PA-BIA-05 | T10 | Benchmark anónimo entre cooperativas | Sí, con adhesión voluntaria, solo ratios, segmentos con ≥ 5 participantes y sin dominancia > 40 %, en O11  — valor diferencial con riesgo controlado | Asumida (DEC-072) |
| PA-BIA-06 | T10 | Alcance de la IA analítica | Preguntas de catálogo + libres traducidas a consulta semántica verificada, habilitable por tenant con tope de costo  — útil y auditable | Asumida (DEC-072) |
| PA-BIA-07 | T10 | Conector para Power BI y herramientas de BI | API key de solo lectura + feeds `/datasets/:code/rows` (JSON/CSV paginado)  — funciona con conectores web estándar | Asumida (DEC-072) |
| PA-BIA-08 | T10 | Límites de consumo de la API por defecto | 600 solicitudes/min con ráfaga 100 y 100.000 unidades/día por cliente; 1.200/min por tenant; ajustables por plan  — suficiente para BI incremental | Asumida (DEC-072) |
| PA-BIA-09 | T10 | Retención de archivos exportados | 7 días  — equilibrio entre comodidad y exposición | Asumida (DEC-072) |
| PA-BIA-10 | T10 | Publicación de datos abiertos | Opcional por tenant, solo agregados aprobados con n ≥ 10 por celda, en O11 | Asumida (DEC-072) |
| PA-BIA-11 | T10 | Fórmula de variación porcentual con base cero | "Nuevo" (valor nulo) por defecto, con modo ProCoop por reporte cuando el dueño lo pida  — evita porcentajes engañosos sin romper paralelos | Asumida (DEC-072) |
| PA-BIA-12 | T10 | Auditoría de consultas a reportes | Exportaciones, descargas, desenmascarado y visualización de reportes con datos personales | Asumida (DEC-072) |
| PA-BIA-13 | T10 | Aprobación de reportes personalizados | Sí, aprobador distinto del autor, configurable a "no" solo por el administrador del tenant | Asumida (DEC-072) |
| PA-BIA-14 | T10 | Datos personales y de sueldos en la API | `pii:read` con finalidad registrada, aprobación por persona distinta del creador y vigencia ≤ 1 año; `payroll:read` solo agregados por centro y período | Asumida (DEC-072) |
| PA-BIA-15 | T10 | Webhooks salientes | Sí, en O11, firmados HMAC-SHA256 con payload delgado y reintentos hasta 72 h | Asumida (DEC-072) |
| PA-BIA-16 | T10 | Acceso delegado por usuario | No en la primera versión de la API; tokens diseñados con `sub` opcional para habilitarlo después sin romper compatibilidad | Asumida (DEC-072) |
| PA-COM-01 | T09 | Comentarios de socios habilitados por defecto | Deshabilitados por defecto; el tenant los habilita y cada publicación decide  — arranque seguro; la cooperativa abre cuando tiene moderadores | Asumida (DEC-072) |
| PA-COM-02 | T09 | Modo de moderación por defecto | `ai_assisted`: publica si el riesgo es bajo, el resto a revisión humana  — equilibrio entre fluidez y control; sin IA se comporta como `pre` | Asumida (DEC-072) |
| PA-COM-03 | T09 | Uso de IA externa en comunidad | Apagada hasta aceptación expresa del tenant, con datos mínimos y sin entrenamiento  — coherente con DEC-056; mientras tanto reglas + humano | Respondida (DEC-056) |
| PA-COM-04 | T09 | Quién contrata y paga la mensajería | Ambos modelos: conector propio del tenant o proveedor de plataforma con reventa y consumo medido  — flexibilidad para cooperativas grandes y chicas | Respondida (DEC-077) |
| PA-COM-05 | T09 | Evidencia mínima de intimaciones y constancias reguladas | Lo define M08 por instancia y servicio; default `delivered` en canales digitales y acuse físico en carta  — trazable y flexible | Asumida (DEC-072) |
| PA-COM-06 | T09 | Horario de no molestar | 21:00 a 08:30 todos los días y feriados, para `community`, `marketing` y `operational` no urgentes; exentas `security`, `service_outage` urgentes y `regulatory` con plazo | Asumida (DEC-072) |
| PA-COM-07 | T09 | Consentimiento para comunicaciones comerciales y comunitarias | Opt-in explícito para `marketing`/`community` por SMS, WhatsApp y email; in-app y push `community` activados; transaccionales con al menos un canal activo; `security`/... | Asumida (DEC-072) |
| PA-COM-08 | T09 | Elector en votaciones rápidas y consultas | Un voto por asociado activo (persona asociada del padrón de M17) por defecto, configurable por encuesta | Asumida (DEC-072) |
| PA-COM-09 | T09 | Validación de canjes por comercios adheridos | Link tokenizado por comercio (sin usuario) más opción de usuarios validadores internos  — simple para el comercio, auditable | Asumida (DEC-072) |
| PA-COM-10 | T09 | Publicaciones y encuestas de supervisores a su equipo | Habilitable por tenant, apagado por defecto, audiencia limitada a su equipo | Asumida (DEC-072) |
| PA-COM-11 | T09 | Plazos de retención de comunicaciones y evidencia | Comunicaciones generales 2 años; comunicaciones con evidencia exigida y constancias de baja 5 años; evidencia de moderación 2 años; anonimización al vencer; si una reg... | Asumida (DEC-072) |
| PA-COM-12 | T09 | Sanciones de comunidad | Escalera sugerida por el sistema (advertencia, silencio 7 días, suspensión 30 días, bloqueo), aplicada por una persona; bloqueo permanente solo por el responsable de c... | Asumida (DEC-072) |
| PA-COM-13 | T09 | Proveedor SMS de referencia | Un agregador local con API REST y reportes de entrega como referencia, y Amazon SNS como alternativa configurable  — mejor entregabilidad local y continuidad con V2 3018 | Asumida (DEC-072) |
| PA-COM-14 | T09 | Envío manual “abrir chat” de WhatsApp | Permitido desde la ficha, registrando la acción como `manual_external` sin constancia, configurable por tenant  — continuidad operativa con trazabilidad mínima | Asumida (DEC-072) |
| PA-COM-15 | T09 | Mensajes impresos en factura | T09 gestiona mensajes segmentados con aprobación y M05 los resuelve por comprobante; espacio fijo por área según el diseño de factura del tenant | Asumida (DEC-072) |
| PA-COM-16 | T09 | Publicación automática de cortes no programados | Borrador automático con plantilla rápida y publicación por un operador (un clic); publicación automática habilitable por tenant y servicio | Asumida (DEC-072) |
| PA-UXD-01 | T03 | Tema de la PWA y de la landing para socios | Landing clara por defecto; PWA socio según política del tenant (`dark` por defecto, con opción del usuario)  — coherencia de producto y legibilidad en lo público | Asumida (DEC-072) |
| PA-UXD-02 | T03 | Dominio propio de la cooperativa | Subdominio en O1; dominio propio en O2 como opción con verificación DNS y certificado automático  — no frena el arranque | Asumida (DEC-072) |
| PA-UXD-03 | T03 | Apps instalables y tiendas | Tres manifests instalables desde la web; sin tiendas en esta versión  — sin costos de tiendas, actualización inmediata | Asumida (DEC-072) |
| PA-UXD-04 | T03 | Plantillas, importación y control de publicación del diccionario | Plantillas e importación habilitadas; doble control opcional por tenant (apagado por defecto)  — agilidad con reversión inmediata | Asumida (DEC-072) |
| PA-UXD-05 | T03 | Variantes por canal | Sí, opcional, con el valor general como fallback  — cubre SMS cortos y lenguaje cercano en PWA | Asumida (DEC-072) |
| PA-UXD-06 | T03 | Multi-idioma | Solo `es-AR`, modelo preparado  — sin costo hoy | Asumida (DEC-072) |
| PA-UXD-07 | T03 | Congelamiento de textos en documentos | Congelar la versión del diccionario en el documento (la reimpresión es idéntica)  — integridad documental | Asumida (DEC-072) |
| PA-UXD-08 | T03 | Tipografías personalizables por tenant | No: tipografías del producto, autoalojadas  — rendimiento, accesibilidad y licencias controladas | Asumida (DEC-072) |
| PA-UXD-09 | T03 | Proveedor de mapas | Google por defecto con clave del tenant en bóveda; OSM como alternativa sin costo  — continuidad con ProCoop y opción gratuita | Asumida (DEC-072) |
| PA-UXD-10 | T03 | Logos por sucursal | Sí, opcional (PRM-UXD-024 apagado por defecto), con herencia del tenant  — cubre casos sin complejidad para el resto | Asumida (DEC-072) |
| PA-UXD-11 | T03 | PWA en escritorio | Phone shell por defecto; vista amplia opcional por tenant (PRM-UXD-004) en O2  — un solo diseño garantizado y flexibilidad | Asumida (DEC-072) |
| PA-UXD-12 | T03 | Mostrar módulos "No contratado" | Solo el administrador, con badge y enlace a licencia; configurable (PRM-UXD-026)  — descubrimiento sin molestar a operadores | Asumida (DEC-072) |
| PA-UXD-13 | T03 | Admin en pantallas chicas | Objetivo 1024 px; 768–1023 px soportado con menú colapsado; < 768 px aviso de usar la PWA  — esfuerzo acotado | Asumida (DEC-072) |
| PA-UXD-14 | T03 | Mensaje de error de login | Mensaje genérico siempre, con ayuda de formato y enlace a recuperar  — seguridad sin perder guía | Asumida (DEC-072) |
| PA-UXD-15 | T03 | Bloqueo de escritorio para roles de campo | Sí, configurable por rol (PRM-UXD-005), vacío por defecto  — control para quien lo necesite | Asumida (DEC-072) |
| PA-UXD-16 | T03 | Asistente IA en la PWA | Detrás de flag `pwa.asistente`, apagado por defecto, habilitable en O11  — sin costo ni riesgo hasta validar | Asumida (DEC-072) |
| PA-UXD-17 | T03 | Tipografía de los documentos PDF | Sí, solo para documentos, desde una lista cerrada de 3 tipografías autoalojadas con licencia libre (por defecto la del producto)  — conserva lo que ProCoop permite sin... | Asumida (DEC-072) |
| PA-WFL-01 | T11 | Tratamiento de eventos consumidos sin productor | Alias con vencimiento al cierre de O2 y, para las brechas, el productor agrega el evento en su anexo : convive sin romper y corrige la fuente | Asumida (DEC-072) |
| PA-WFL-02 | T11 | Aprobaciones diferidas: frontera con T02 | Un paso sin monto: T02. Multipaso, por monto, comité o delegación: T11. La bandeja muestra ambas | Asumida (DEC-072) |
| PA-WFL-03 | T11 | Plazos de retención documental | Cargar como "a validar" la propuesta de un asesor legal de la cooperativa piloto y no purgar hasta que se confirme | Asumida (DEC-072) |
| PA-WFL-04 | T11 | Alcance del diseñador de workflows para el tenant | Adoptar y ajustar plantillas en los puntos de extensión, y crear trámites nuevos solo de tipo "solicitud genérica" que terminan en una tarea o un caso | Respondida (DEC-079) |
| PA-WFL-05 | T11 | Motor de render PDF | HTML + CSS con un navegador sin interfaz en workers dedicados, y validación PDF/A posterior : plantillas editables por el tenant y buen diseño | Respondida (DEC-080) |
| PA-WFL-06 | T11 | Proveedor y nivel de firma por documento | Electrónica (OTP) por defecto en todo, y digital con un proveedor licenciado por T06 solo para los recibos de sueldo del empleador y las actas, en O8 y O9 | Respondida (DEC-078) |
| PA-WFL-07 | T11 | Calendario, agenda y mesa de entradas entre M09 y T11 | M09 es dueño de los datos y T11 aporta la proyección de agenda, la numeración, el expediente, la carátula y el acuse | Asumida (DEC-072) |
| PA-WFL-08 | T11 | Delegaciones: duración y alcance | Hasta 90 días, con límite de importe ≤ al del delegante y sin delegar votos de comité ni consejo | Asumida (DEC-072) |
| PA-WFL-09 | T11 | Qué pasa cuando vence un paso de aprobación | Escalar al supervisor del aprobador y avisar al solicitante; nunca aprobar automáticamente | Asumida (DEC-072) |
| PA-WFL-10 | T11 | Días hábiles o corridos en los SLA | Hábiles con el calendario de T04 por defecto, y corridos cuando la norma lo exige, marcado en la política | Asumida (DEC-072) |
| PA-WFL-11 | T11 | Documentos visibles para el socio | Comprobantes emitidos, contratos y convenios firmados, constancias de trámite y documentos que el propio socio subió; nunca notas internas ni documentos de verificación | Asumida (DEC-072) |
| PA-WFL-12 | T11 | Convergencia del SLA de M09 con el motor de T11 | Un solo motor en T11 desde O2; M09 sigue publicando EVT-CRM-06/07, que deriva de EVT-WFL-020/021 | Asumida (DEC-072) |
| PA-WFL-13 | T11 | Huecos en la numeración | Sin huecos en comprobantes, recibos, actas, mesa de entradas y expedientes formales; con huecos en el resto | Asumida (DEC-072) |
| PA-WFL-14 | T11 | Eventos públicos para terceros | Un subconjunto curado sin datos personales (factura emitida, pago confirmado, estado de trámite, interrupción de servicio), en O11 | Asumida (DEC-072) |
| PA-WFL-15 | T11 | Fuentes de la bandeja unificada | Desde O1: tareas, aprobaciones, autorizaciones de T02 y excepciones de corridas. Desde O2: casos de M09 y OT de M10. Más adelante, el resto | Asumida (DEC-072) |
| PA-WFL-16 | T11 | Feed iCal de la agenda | Deshabilitado por defecto; habilitable por tenant, sin datos de socios en el título | Asumida (DEC-072) |
| PA-WFL-17 | T11 | Correo interno PROMAIL | Se reemplaza por comentarios y menciones; el historial se migra solo si el tenant lo pide (últimos 12 meses) | Asumida (DEC-072) |
| PA-WFL-18 | T11 | Quién reprograma los jobs | Sí, solo la hora y los días de los jobs `tenantSchedulable`, dentro de la ventana de plataforma | Asumida (DEC-072) |
| PA-WFL-19 | T11 | Dueño único de los jobs duplicados | Sí, y cada anexo afectado elimina o convierte su job en el siguiente ciclo de revisión | Asumida (DEC-072) |
| PA-WFL-20 | T11 | Comparación contra fuentes oficiales | Padrón de ARCA desde O2 y otras fuentes (identidad provincial o nacional) a demanda del tenant; una diferencia marca el paso para revisión, no bloquea | Asumida (DEC-072) |
| PA-WFL-21 | T11 | Importe de referencia para los tramos de aprobación | Bruto, que es lo que sale de caja, con opción de neto por tipo de operación | Asumida (DEC-072) |
| PA-TAR-19 | M04 | Propiedad de los factores de gas y de los cargos por evento | Factores de gas en M04; disparador y filtros de cargos por evento en M02, y precio, fundamento y bonificaciones en M04 | Asumida (DEC-072) |
| PA-CAT-17 | M02 | Gas envasado (HUE-GAS-02) | Variante "envasado" como venta con stock (M13) y entrega (M10), sin medidor ni corrección, habilitable por tenant | Respondida (DEC-082) |
| PA-CAT-18 | M02 | Conceptos de terceros sin servicio propio (HUECO-TAS-01) | Siempre cuelgan de un contrato propio del socio, con perfil de servicio "convenio de terceros" de tipo accesorio | Respondida (DEC-083) |
| PA-CAT-19 | M02 | Correo electrónico y pack SMS (HUECO-OTR-03) | Servicios de M02 con aprovisionamiento por T06 y cupo/consumo, habilitables por tenant | Respondida (DEC-084) |
| PA-TEC-19 | M10 | Portabilidad numérica (HUE-TEL-05) | "No aplica" por defecto (cooperativa sin numeración propia); operación técnica de portabilidad entrante/saliente habilitable por tenant | Asumida (DEC-072) |
| PA-TEC-20 | M10 | Calidad del agua (HUE-AG-01) | Controles de calidad en M10 (muestreo, análisis, laboratorio con documento en T11) e informe al regulador vía M06/T10, habilitable por concesión | Asumida (DEC-072) |
| PA-CON-17 | M15 | Tratamiento contable de la venta del derecho de sepultura (HUECO-CEM-04) | Ingreso del período al otorgar el derecho y mantenimiento como ingreso periódico; IVA según la clase de M06; validar con el contador de la cooperativa piloto | Asumida (DEC-072) |
| PA-DAT-01 | T05 | Cuenta corriente y cobro con varias entidades jurídicas | Una cuenta corriente por titular y por entidad; un cobro de caja puede cubrir varias entidades y se emite un recibo por entidad | Asumida (DEC-072, DEC-087) |
| PA-TES-17 | M14 | Diferencia de arqueo en una rendición con varias entidades jurídicas | A la entidad que indique el receptor (default: la de mayor importe rendido), con asiento entre entidades si corresponde | Asumida (DEC-072) |
| PA-DAT-02 | T05 | Detalle histórico de más de 36 meses | Archivado con consulta diferida; facturas, recibos y asientos con sus PDF siempre en línea | Asumida (DEC-072, DEC-087) |
| PA-PER-17 | M01 | Destino de `accounts.accountingGroupId` y `personIdentifierIndex.exceptionId` | `accountingGroupId` → grupos contables (reemplazado por `collectionAccountingGroups` de M07, PA-COB-20); `exceptionId` → excepción de unicidad aprobada (reemplazado por `approvalRequests` de T11, PA-PER-18) | Asumida (DEC-072) |
| PA-PER-18 | M01 | Destino de `exceptionId` y estados de `premises` | `exceptionId` → `approvalRequests` de T11, sin colección propia en M01; estados de `premises` `active`, `merged`, `archived` según §7 y §8.14 | Asumida (DEC-072) |
| PA-CAT-20 | M02 | Dueño de los CU compartidos CU-MER-01, CU-PRO-01, CU-CIC-01, CU-ESP-CEM y CU-ESP-SAN | CU-MER-01 → M03 y el CU de M02 pasa a CU-CAT-13; CU-PRO-01 → M02; CU-CIC-01 → M08 (PA-MOR-21; antes M09); CU-ESP-CEM y CU-ESP-SAN → M18; los demás anexos citan su parte | Asumida (DEC-072) |
| PA-CAT-21 | M02 | Destino de referencias de `billableConcepts`, `serviceContracts` y `serviceConcessions`, y estados propuestos del §8 | `fiscalClassId` → `fiscalClasses` de M06; `thirdPartyId` y `authorityIds` → terceros y autoridades de M01; `activityId` según PA-CAT-22; se aceptan los estados propuestos | Asumida (DEC-072) |
| PA-CAT-22 | M02 | Destino de `externalClientId`, `bundleSubscriptionId` y `activityId` | `externalClientId` → `persons` (M01); `bundleSubscriptionId` → colección nueva `bundleSubscriptions` (M02 §7.29); `activityId` → `normativeTables` de M06 (`code = arcaActivities`) | Asumida (DEC-072) |
| PA-MED-14 | M03 | Estados de `meteringSystems` | `active` e `inactive` (inicial `active`); la salud técnica sigue aparte en `health.status` | Asumida (DEC-072) |
| PA-TAR-20 | M04 | Destino de `taxRateIds`, `adjustmentRequestIds` y `m02ChangeIds`, y estados propuestos del §8 | Alícuotas de M06; pedidos de ajuste de M05 (`invoiceAnnulmentRequests`, PA-FAC-22); versiones de contrato de M02; se aceptan los estados, incluido `failed` en `calculationRuns.status` | Asumida (DEC-072) |
| PA-FAC-21 | M05 | Destino de `invoices.sellerId` y estados propuestos del §8 | Vendedor como usuario del tenant (`memberships` de T02) según el canal de venta de M11; se aceptan los estados propuestos | Asumida (DEC-072) |
| PA-FAC-22 | M05 | Destino de `adjustmentRequestIds` de M04 | `invoiceAnnulmentRequests` (COL-FAC-17) con `mode` `partialCredit` o `debitAdjustment`; sin colección nueva | Asumida (DEC-072) |
| PA-FIS-19 | M06 | Capability de exportación de reportes fiscales | `fis.reportes.exportar`, única para todos los reportes, además de la `fis.<recurso>.ver` del dominio | Asumida (DEC-072) |
| PA-FIS-20 | M06 | Destino de `normativeAdoptions.simulationId` y `gatewayDocuments.externalSystemId` | Simulaciones de M04 y `apiClients` de T02 | Asumida (DEC-072) |
| PA-FIS-21 | M06 | Colección `fiscalClasses`, catálogo de actividades y estados de `provincialValidationCodes` | M06 declara `fiscalClasses` (§7.38); `activityId` → `normativeTables` (`arcaActivities`); estados `active` y `expired` | Asumida (DEC-072) |
| PA-COB-19 | M07 | Estados de colecciones sin máquina de estados | Una máquina por colección en el anexo dueño: M07 §8.17, M08 §8.14 (`agreementInstallments`), M09 §8.13 (`crmCalendarEvents`), M10 (`technicalProcedures`, PA-TEC-22) y M13 (`fixedAssetValueChanges`, `mrpRuns`, PA-STK-10) | Asumida (DEC-072) |
| PA-COB-20 | M07 | Colección `collectionAccountingGroups` | M07 la declara (`code`, `name`, `status` `active`/`inactive`) en O5, sin cuentas; las cuentas van en `entityAccountAssignments` de M15 (`entityType = collectionAccountingGroup`) | Asumida (DEC-072) |
| PA-MOR-21 | M08 | Anexo dueño de CU-CIC-01 (suspensión temporal y reactivación) | M08 es dueño; M02, M09 y M19 citan su parte (para este CU reemplaza la opción de PA-CAT-20, que decía M09) | Asumida (DEC-072) |
| PA-CRM-19 | M09 | Anexo dueño de CU-SOL-01 (alta de Internet y baja de TV) | M09 es dueño; M02 cita su parte de contrato | Asumida (DEC-072) |
| PA-TEC-21 | M10 | Vocabulario de capabilities de M10 | Renombrar al español con la canónica de T02 (`tec.ordenes.*`, `tec.servicioTecnico.*`, `tec.redes.*`, `tec.agenda.*`…) y conservar el nombre anterior como alias "antes `x`" | Asumida (DEC-072) |
| PA-TEC-22 | M10 | Estados de `technicalProcedures` | Máquina propia `open`, `inReview`, `observed`, `approved`, `rejected`, `cancelled` (§8.15), dirigida por la resolución de cada etapa | Asumida (DEC-072) |
| PA-STK-10 | M13 | Estados de `fixedAssetValueChanges` y `mrpRuns` | `fixedAssetValueChanges` `draft` → `posted` → `voided`; `mrpRuns` `calculated` → `confirmed` / `discarded`, o `failed` (§8.13) | Asumida (DEC-072) |
| PA-TES-18 | M14 | Estados de `cashFlowScenarios` | `draft` → `active` → `archived` (§8.16.10); un escenario archivado se copia para reutilizarlo | Asumida (DEC-072) |
| PA-CON-18 | M15 | Colección del modelo de centro de costo (`costCenterModelId`) | M15 declara la colección `costCenterModels` (§7.19.1), con reparto fijo o delegado en un modelo de distribución | Asumida (DEC-072) |
| PA-SUE-16 | M16 | Dueño de las pantallas del empleado | M16 es dueño del contenido, las reglas y las API (PAN-SUE-41 a 46, API-SUE-78 a 81); M19 es dueño de la ruta publicada en la PWA y las incrusta | Asumida (DEC-072) |
| PA-SUE-17 | M16 | Estados de `payslipNotifications`, `performanceReviews` y `objectives` | Se confirman los valores y transiciones de §8.12.8 a §8.12.10 | Asumida (DEC-072) |
| PA-INS-12 | M17 | Nombre del campo que apunta al padrón de asociados | `associateMembershipId` (antes `membershipId`) en M17, T05 y los consumidores de `ins.membership.*` | Asumida (DEC-072) |
| PA-SOC-16 | M18 | Referencia al artículo de stock en vivienda | `inventoryItemId` de M13 (antes `productId`) | Asumida (DEC-072) |
| PA-SOC-17 | M18 | API-SOC-006: endpoint HTTP o servicio interno | Endpoint HTTP `GET /api/admin/soc/contracts/:id/billing-inputs` que consume M04, con `soc.adherentes.ver` | Asumida (DEC-072) |
| PA-SOC-18 | M18 | Estados de `providerAgreements`, `donationCampaigns` y `housingPlans` | Se confirman §8.1.6 y §8.1.7 y se agrega §8.1.8 (`draft`, `active`, `closed`) para planes de vivienda | Asumida (DEC-072) |
| PA-POR-20 | M19 | Tabbar del socio y pantalla Comunidad | Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar (maestra §9.2 y T03); nueva PAN-POR-105 `/app/comunidad` (RF-POR-180) | Asumida (DEC-072) |
| PA-POR-21 | M19 | Versiones de formularios del portal | `formVersions` de T11: `portalForms` guarda `formVersionId`; presentaciones y borradores guardan la versión usada | Asumida (DEC-072) |
| PA-CFG-14 | T04 | Cambio de CUIT o de entidad emisora con documentos emitidos | El CUIT no se edita (un CUIT nuevo es una entidad nueva); el cambio de emisora de un servicio tiene fecha efectiva y los saldos anteriores quedan en la entidad original (RN-CFG-052) | Asumida (DEC-072) |
| PA-DAT-03 | T05 | Errores de unicidad y de campos en el catálogo de T09 | Corregir T05 según las fichas de T09 (COL-COM-15, 16, 22, 37, 45 y 56) | Asumida (DEC-072) |
| PA-INT-26 | T06 | Estados de `aiUsageLogs` | `ok`, `error` y `blocked` | Asumida (DEC-072) |
| PA-MIG-20 | T07 | Dónde se guarda el acta de aceptación de la migración | `documents` de T11 con tipo documental `acta` | Asumida (DEC-072) |
| PA-NFR-22 | T08 | Factor de simultaneidad del pico de plataforma | 0,6 en todas las filas de simultaneidad de §7.1, con prueba de carga antes de O4 | Asumida (DEC-072) |
| PA-NFR-23 | T08 | Copias anuales de 10 años | Sin copias anuales: datos en línea los 10 años y detalle de más de 36 meses en archivo en frío (DEC-087) | Asumida (DEC-072) |
| PA-COM-17 | T09 | Estados de los avisos de plataforma (`platformNotices`) | `draft` → `published` → `expired`, con `withdrawn` desde `draft` o `published` | Asumida (DEC-072) |
| PA-COM-18 | T09 | Tipo de comunicación en plantillas de campaña y de texto libre | Obligatorio, con el tipo genérico "Campaña" (`com.campaign.generic`) precargado por plataforma | Asumida (DEC-072) |
| PA-WFL-22 | T11 | Destino de `responsibleAreaId` | `crmAreas` de M09 | Asumida (DEC-072) |
| PA-PER-19 | M01 | Residuales del 05-11-2026: estados, referencias y nombres | Estado inicial `received`; `streetRequestId` → `streetProposals` (T04); subsecciones absorbidas como referencia del circuito con dueño del estado (T08, T02); `subjectPersonId`/`target` sin cambios | Asumida (DEC-072) |
| PA-CAT-23 | M02 | Residuales del 05-11-2026: estados y referencias | Estado de alta de cada máquina (§8.5); `contractDeclaredAppliances` `active` → `removed`; `contractSpecialConditions` `draft` → `approved` → `expired` / `cancelled`; destinos `serviceProducts`, `documents` (T11), `feasibilityRequests` (M10) y `approvalRequests` (T11) | Asumida (DEC-072) |
| PA-MED-15 | M03 | Residuales del 05-11-2026: estados y referencias | Estado de alta y transiciones en §8.13; lecturista → `memberships` (T02); `deviceId` → `fieldDevices` (M10); expedientes → `documents` (T11); fotos → `storedFiles` (T01); `routeIds` → `readingRoutes` | Asumida (DEC-072) |
| PA-TAR-21 | M04 | Residuales del 05-11-2026: estados, referencias y nombres | `subsidyEnrollments` inicial `active`; `calculationRuns` inicial `queued`; `rightId` → `burialRights` (M18); usar `fis.service.calculateTaxes`; API-TAR-061 con `public: true` | Asumida (DEC-072) |
| PA-FAC-23 | M05 | Residuales del 05-11-2026: estados, referencias y API reemplazada | Estados de alta y transiciones en §8.13; `ownerRole` → `roles` y `assigneeId` → `memberships` (T02); `serviceBlockId` obligatorio; API-FAC-023 reemplazada por API-MOR-25 | Asumida (DEC-072) |
| PA-FIS-22 | M06 | Residuales del 05-11-2026: estados, servicios internos y referencias | Estado de alta en §8.12; `provincialValidationCodes` `active` → `expired`; máquina de `regulatoryReportRuns`; consumidores de `calculateTaxes`, `resolveDocumentClass` y `checkRegistryCoverage`; destinos en M12 y M06 | Asumida (DEC-072) |
| PA-COB-21 | M07 | Residuales del 05-11-2026: referencias, nombres canónicos y estados | Destinos de §7.37 según T05 §7.2.1; nombres canónicos con alias "antes"; `collectors` y `gatewayConnectors` con `active`, `suspended`, `inactive` (§8.19) | Asumida (DEC-072) |
| PA-MOR-22 | M08 | Residuales del 05-11-2026: referencias, nombres canónicos, estados y alias | Destinos de §7.38; máquinas de §8.15; evento `int.network.provisioningResult` (alias con guiones); comando `tec.workOrder.request`; `billableItemId` (antes `pendingChargeId`) | Asumida (DEC-072) |
| PA-CRM-20 | M09 | Residuales del 05-11-2026: referencias, nombres de T05 y estados | Destinos de §7.45; `aiUsageLogId` incorporado; máquinas de §8.14; `crmCaseId` y `associateMembershipId` (antes `memberId`) | Asumida (DEC-072) |
| PA-TEC-23 | M10 | Residuales del 05-11-2026: referencias, estados, rutas de API, comando de OT y alias | Destinos de §7.23; máquinas de §8.16; comando `tec.workOrder.request`; evento `int.cdr.batchReceived` (alias con guiones) | Asumida (DEC-072) |
| PA-VEN-12 | M11 | Residuales del 05-11-2026: referencias, estados y API reemplazadas | Destinos de §7.15; máquinas de §8.6; API-VEN-006 → API-FAC-105 y API-VEN-007 → API-FAC-044 | Asumida (DEC-072) |
| PA-CMP-16 | M12 | Residuales del 05-11-2026: estados, referencias y nombres de campo | §8.8 con estados de `supplierAdvances`, `supplyBalances`, `signalRightsContracts` y `signalRightsSettlements`; facturas y recepciones de compra → `supplierInvoices` y `supplierReceipts` | Asumida (DEC-072) |
| PA-STK-11 | M13 | Residuales del 05-11-2026: estados, referencias, nombres de campo y evento bajo mínimo | §8.14 (`stockState`, `revaluations`, `serviceReceptions`); `projectId` → `works` (M10); `requisitionId(s)` → `supplyRequests` y `purchaseReceiptId` → `supplierReceipts` (M12); evento `stk.item.belowMinimum` | Asumida (DEC-072) |
| PA-TES-19 | M14 | Residuales del 05-11-2026: estados, referencias, nombres de campo, CU duplicado y capability de API | Estado inicial explícito; §8.16.11 y §8.16.12; nombres de T05 con "antes"; CU-TES-17 (antes CU-13); API-TES-87 exige `tes.posicion.ver` | Asumida (DEC-072) |
| PA-CON-19 | M15 | Residuales del 05-11-2026: estados, referencias, nombres de campo y eventos de M17 | Estado inicial de cada máquina; nombres de T05 con "antes"; `seriesId` → `economicIndexSeries` (T04); eventos de M17 con el nombre nuevo (alias el viejo) | Asumida (DEC-072) |
| PA-SUE-18 | M16 | Residuales del 05-11-2026: estados, referencias y nombres de campo | §8.12.11 a §8.12.13; `shifts` `active`/`inactive`; `extraTasks` `draft`, `confirmed`, `voided`; nombres de T05 con alias | Asumida (DEC-072) |
| PA-INS-13 | M17 | Residuales del 05-11-2026: estados, referencias, nombres de campo y tipos de evento | Estado inicial explícito; §8.1 sobre `associateMemberships.status`; destinos (`accountRubrics`, `creditBalances`, `withholdingsApplied`, `dataTableViews`, `documentTemplates`); nombres de T05 (`*AssociateMembershipId`, `storedFileId`) | Asumida (DEC-072) |
| PA-SOC-19 | M18 | Residuales del 05-11-2026: estados, referencias, nombres de campo y evento GPS | §8.2 completo; vínculos → `enumerationItems` (T04); tarifa → `tariffCategoryRates` (M04); plantillas → `documentTemplates` (T11); evento `int.fleet.positionsReceived` | Asumida (DEC-072) |
| PA-POR-22 | M19 | Residuales del 05-11-2026: estados, referencias, rótulo corto y nombre de PAN-POR-105 | `portalForms` inicial `borrador` y `kioskDevices` inicial `activo`; `cashboxId` → `cashRegisters` (M07); PAN-POR-105 "Comunidad"; rótulo corto "Cuentas" en la tabbar; consumir `ins.capitalMovement.recorded` | Asumida (DEC-072) |
| PA-PLA-15 | T01 | Cierre de residuales del anexo (estados, referencias, API, colas y CU) | §8.13; destinos y nombres canónicos de T05; `public: true` y capabilities implícitas o técnicas de T02 (PA-IAM-18); excepción de JOB-PLA-01 en la tabla de colas; CU propio renumerado a CU-PLA-15 (antes CU-ARQ-01) | Asumida (DEC-072) |
| PA-IAM-18 | T02 | Cierre de residuales del anexo (capabilities, estados, referencias y CU) | `public: true` en rutas sin sesión; capabilities implícitas (`iam.sesion.autenticada`, `pla.archivos.*`, `pla.misProcesos.ver`…) y técnicas (`pla.salud.sondear`, `mig.clavesHeredadas.resolver`); mapeo de scopes `erp`; §8.11; CU propio renumerado a CU-IAM-11 (antes CU-SEG-01) | Asumida (DEC-072) |
| PA-UXD-18 | T03 | Cierre de residuales del anexo (mapa del sitio, tabbar, estados, API y CU) | Capability y ruta del anexo dueño (AL-01); rótulo corto "Cuentas"; tabla 8.8; CU propio renumerado a CU-UXD-07 (antes CU-ACC-01); PAN-UXD-15, 16 y 17 asignadas a RF-UXD-064, 063 y 055 (O0, PRO-O0-15), sin RF nuevos | Asumida (DEC-072) |
| PA-CFG-15 | T04 | Cierre de residuales del anexo (pantalla sin ruta, servicios, API, estados y tablas de campos) | PAN-CFG-31 cita las rutas anfitrionas de M19; servicio `economicIndexes.valueAt({ seriesId, at })`; API-CFG-58 reemplazada por servicio interno; §8.11 y tablas de campos de §7.18 | Asumida (DEC-072) |
| PA-DAT-04 | T05 | Destinos de referencia pendientes y alineación del catálogo con los anexos dueños | Destino único por colección o módulo; el catálogo se alinea al anexo dueño cuando usa un nombre canónico y conserva el de §7.2 cuando no (el anexo renombra) | Asumida (DEC-072) |
| PA-INT-27 | T06 | Cierre de residuales del anexo (tipos de evento, estados, referencias y API) | Tipos de evento en camelCase con alias en T11 §12.4; §8.13; `externalTransactionNumber` (antes `externalTransactionId`); tablas de campos de §7.18; `int.agentes.ejecutar` | Asumida (DEC-072) |
| PA-MIG-21 | T07 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | §8.8; destinos (`billingRuns`, `documents`, `legacySnapshots`, `migrationMappingSets`); `mappingSetId` y `ruleCode` con "antes"; §7.14; `mig.clavesHeredadas.resolver` y `mig.miHistorial.ver` | Asumida (DEC-072) |
| PA-NFR-24 | T08 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | Transiciones en §15.2 y valores en §15.1; destinos `processingActivities` y `privacyNotices`; §15.1.1; `public: true` y `pla.salud.sondear`; CU-ARQ-01 citado como de T11 | Asumida (DEC-072) |
| PA-COM-19 | T09 | Cierre de residuales: carga rápida de reclamos por SMS, destinos de referencia y estados | Carga rápida habilitada por un canal `crmChannels` de M09 con `kind = sms`; `fieldAssignmentId` → `workOrders` (M10); `categoryIds[]` → `postCategories`; `targetTenants` → `tenants` (T01); estados completos en §8 | Asumida (DEC-072) |
| PA-BIA-17 | T10 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | §8.12; `scenarioId` → `simulationScenarios` (M15) y `templateOriginId` → `customReports`; `catalogQuestionCode` y `date` con "antes"; §7.26; `bia.reportes.ver`, `bia.exportaciones.crear`, `bia.apis.consumir` | Asumida (DEC-072) |
| PA-WFL-23 | T11 | Cierre de residuales: nombres de eventos, alias con un solo canónico y máquinas de estado | Eventos en camelCase en §12.3 con el nombre viejo como alias en §12.4, un solo canónico por alias y todas las máquinas de §8 en tabla | Asumida (DEC-072) |
| PA-IAM-19 | T02 | Sincronización posterior a la ronda de residuales: capabilities reemplazadas, servicios internos y comando de OT | `fac.bloqueosCausas.configurar` reemplazada y alias total de `mor.causas.configurar`; filas `fis.service.*` como servicios internos de M06 §11.1; `tec.workOrder.create` queda solo como alias de capability | Asumida (DEC-072) |
| PA-UXD-19 | T03 | Sincronización posterior a la ronda de residuales: mapa del portal y rótulo corto | Correspondencia de PAN-POR-19, 52, 55 y 91 con los ítems del mapa (misma app y recurso como principal); rótulo corto "Cuentas" también en CTR-UXD-12 | Asumida (DEC-072) |
| PA-DAT-05 | T05 | Sincronización posterior a la ronda de residuales: catálogo de colecciones | Prevalece el anexo dueño: el catálogo toma los nombres del §7 del dueño y registra destinos y valores nuevos en §7.2.1 y §8.1 (`indicatorId` + `indicatorCode`, `kpiAlertRuleId`, `migrationIssues.ruleId` + `ruleCode`, `apiUsageDaily.date`) | Asumida (DEC-072) |
| PA-WFL-24 | T11 | Sincronización posterior a la ronda de residuales: alias de M13 y comando de OT en EVT-CRM-13 | Fila de alias en §12.4, nombre anterior citado en EVT-STK-12, comando en el campo `command` de EVT-CRM-13 (no es tipo de evento) y §12.10 actualizado | Asumida (DEC-072) |
| PA-FIS-23 | M06, M05 | Conceptos accesorios admitidos dentro de la liquidación de servicios públicos en la factura agrupada (DEC-093) | Solo tasas, contribuciones y cargos regulados que acompañan al servicio público y que el contador declare como accesorios; internet, telefonía, TV, sepelio y servicios sociales siempre en factura común | Pendiente (contador) |
| PA-FIS-24 | M06 | Norma que obliga a usar la LQSP, vía de autorización (CESP, CAE o CAEA) y efecto de las RG 5003 y 5866/2026 (DEC-094) | Mantener CESP separado del CAEA (PA-FIS-02) hasta que el contador confirme; la RG 3571/2013 se sigue tratando como régimen de información | Pendiente (contador) |
| PA-FIS-25 | M06, M17 | Obligaciones y exenciones propias de la cooperativa: exención de Ingresos Brutos de Córdoba para cooperativas eléctricas, Contribución Especial sobre el Capital Cooperativo y reforma de Ganancias 2026 (DEC-095) | No precargar ninguna; el contador confirma cada una con su fundamento y vigencia y el tenant la da de alta en el registro de M06 | Pendiente (contador) |
| PA-FIS-26 | M06 | Alícuota de IVA del 27 % a responsables inscriptos según el uso del suministro (DEC-102) | Condición por uso desactivada por defecto; se activa por tenant y servicio solo con la confirmación del contador | Pendiente (contador) |

**Cierre del cuestionario (04-11-2026):** 516 preguntas registradas desde las §21 de todos los anexos completos, T05 y los huecos de decisión de `05-registro-huecos.md`; 93 respondidas por el solicitante (DEC-011 a DEC-084) y 423 asumidas con la opción recomendada (DEC-072). Las preguntas que surjan de anexos nuevos (T05 DAT) se agregan al final de esta tabla con el mismo criterio.

**Actualización por el cierre de la corrección de inconsistencias (05-11-2026):** 555 preguntas registradas (antes 516 en el cierre del 04-11-2026; 517 filas con PA-DAT-02); 98 respondidas por el solicitante (antes 93), 456 asumidas con la opción recomendada (DEC-072; antes 423) y 1 reemplazada. Se agregaron al final de la tabla las 38 PA que los anexos registraron en su §21 durante la corrección: PA-PER-17, 18; PA-CAT-20, 21, 22; PA-MED-14; PA-TAR-20; PA-FAC-21, 22; PA-FIS-19, 20, 21; PA-COB-19, 20; PA-MOR-21; PA-CRM-19; PA-TEC-21, 22; PA-STK-10; PA-TES-18; PA-CON-18; PA-SUE-16, 17; PA-INS-12; PA-SOC-16, 17, 18; PA-POR-20, 21; PA-CFG-14; PA-DAT-03; PA-INT-26; PA-MIG-20; PA-NFR-22, 23; PA-COM-17, 18; PA-WFL-22. Pasan a respondidas, porque su anexo ya aplica la DEC: PA-IAM-12 (DEC-043), PA-CFG-02 (DEC-046), PA-CFG-04 (DEC-020), PA-MOR-20 (DEC-052) y PA-POR-04 (DEC-067); PA-CFG-P1-02 sigue asumida y anota la respuesta parcial de DEC-064.

**Actualización por la ronda de residuales (05-11-2026):** 585 preguntas registradas (antes 555); 98 respondidas (sin cambios), 486 asumidas con la opción recomendada (DEC-072; antes 456) y 1 reemplazada. Se agregaron al final de la tabla las 30 PA de cierre de residuales que los anexos registraron en su §21: PA-PER-19, PA-CAT-23, PA-MED-15, PA-TAR-21, PA-FAC-23, PA-FIS-22, PA-COB-21, PA-MOR-22, PA-CRM-20, PA-TEC-23, PA-VEN-12, PA-CMP-16, PA-STK-11, PA-TES-19, PA-CON-19, PA-SUE-18, PA-INS-13, PA-SOC-19, PA-POR-22, PA-PLA-15, PA-IAM-18, PA-UXD-18, PA-CFG-15, PA-DAT-04, PA-INT-27, PA-MIG-21, PA-NFR-24, PA-COM-19, PA-BIA-17, PA-WFL-23.

**Actualización por la sincronización posterior a los residuales (05-11-2026):** 589 preguntas registradas (antes 585); 98 respondidas (sin cambios), 490 asumidas (DEC-072; antes 486) y 1 reemplazada. Se agregaron al final de la tabla: PA-IAM-19, PA-UXD-19, PA-DAT-05, PA-WFL-24.

### Negociación stack GoodApps (cuestionario `06-impacto-adaptacion-stack-goodapps.md`, 19-11-2026)

| PA | Anexo | Título | Recomendada / decisión | Estado |
|---|---|---|---|---|
| PA-STACK-01 | 00 | Stack back .NET + Azure SQL vs DEC-001 Node+Mongo | Adoptar stack GoodApps en spec; análisis funcional conserva reglas de negocio | Respondida (DEC-111) |
| PA-STACK-02 | T02 | 2FA sin SMS (PDF) vs SMS en spec actual | No tocar T02 hasta acuerdo con GoodApps | Pendiente (D-08: diferir) |
| PA-STACK-03 | T04 | T04 global vs parámetros solo en módulos dueños (PDF) | Mantener T04 motor + T04b; §14 por módulo | Respondida (DEC-114) |
| PA-STACK-04 | 03 | Rol del plan Cursor/olas frente a pipeline GoodApps | Solo pipeline GoodApps; `03` histórico | Respondida (DEC-118) |
| PA-STACK-05 | entregables | OpenAPI en GACAC vs «solo referencia» del PDF | Mantener normativo en GACAC hasta existir código generador | Respondida (D-06; ver nota en `06` §10) |
| PA-STACK-06 | T05, nuevo `07-*` | ER físico Azure SQL 4NF con PK/FK | Documento aparte complementario a T05 | Respondida (DEC-117) |
| PA-STACK-07 | T03, M09, export | ¿Ampliar IA / ayuda más allá de lo ya especificado en la reunión? | Mantener alcance actual (P6, M09, ScreenHelp); solo mejorar empaquetado en export | Pendiente (si piden más IA) |
| PA-BRD-01 | `08`, `docs/brand/coopapps/` | Sustituir SVG wordmark v1.0 por manual gráfico del informe de naming | B) **No hay manual** — usar repo como fuente única (DEC-120) | Asumida (DEC-120, 19-11-2026) |
