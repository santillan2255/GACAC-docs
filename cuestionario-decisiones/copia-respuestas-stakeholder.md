# Copia de trabajo — respuestas del stakeholder

> **No es** `docs/especificacion/02-preguntas-abiertas.md` ni el registro de decisiones oficial.
> Se genera leyendo los anexos; las respuestas viven **solo en este archivo** (y en tus exportaciones).
> Regenerar: `python build_md.py` (mantiene tus respuestas ya cargadas en esta copia).


**Total:** 575 preguntas

---

### PA-BIA-01 — Ubicación del almacén analítico
- **Pregunta:** ¿Dónde vive el almacén analítico `bi_*` de O11?
- **Contexto:** BASE §97.8 exige que BI no afecte facturación ni atención; DEC-001/DEC-004 fijan MongoDB y despliegue agnóstico. Cambia costo y complejidad operativa.
- **Opciones:**
  - A) Base lógica `&lt;db>_analytics` leída desde un miembro oculto del replica set con etiqueta `analytics` (prioridad 0) **(Recomendada)** — aislamiento de carga suficiente, sin nueva tecnología.
  - B) Cluster MongoDB separado dedicado a analítica — más aislamiento, mayor costo y operación.
  - C) Sin almacén: todo BI sobre secundarios operativos — más simple, riesgo de impacto en horas pico y sin historización SCD2.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-060 a RF-BIA-064, JOB-BIA-09 a 12, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-02 — Formato del token de la API externa
- **Pregunta:** ¿Qué tipo de access token emite `/api/v1/ext/oauth/token`?
- **Contexto:** BASE §59 dice que tokenizar no obliga a JWT; T02 propone JWT de 15 minutos (CTR-BIA-06).
- **Opciones:**
  - A) JWT firmado de 15 minutos con lista de revocación por cliente en Redis **(Recomendada)** — validación rápida, revocación ≤ 60 s.
  - B) Token opaco con introspección en cada llamada (con caché) — revocación inmediata, más latencia.
  - C) Solo API key — más simple para terceros, menos seguro para escritura y scopes sensibles.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-071, §11.2.1, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-03 — Escrituras de terceros vía API
- **Pregunta:** ¿Se permiten operaciones de escritura desde `/api/v1/ext`?
- **Contexto:** Integra de ProCoop exponía `RegistrarCuenta`, `RegistrarPersona`, `PutCategoria` (FIC 14.3); BASE §59 prioriza la lectura.
- **Opciones:**
  - A) Solo **solicitudes** (persona, cuenta/servicio, reclamo) que el módulo dueño procesa con su circuito, idempotentes **(Recomendada)** — cubre bots y municipios sin saltear controles.
  - B) Solo lectura en `v1` — más simple; los terceros que hoy dan de alta cuentas dejan de poder hacerlo.
  - C) Escrituras directas sobre recursos — máxima flexibilidad, riesgo alto de datos inconsistentes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-088, API-BIA-130 a 133, scope `requests:write`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-04 — Destinatarios externos de reportes programados
- **Pregunta:** ¿Se pueden enviar reportes programados a emails que no son usuarios del tenant (auditor externo, municipio)?
- **Contexto:** MER-013 pide reportes programados; los datos personales no deben salir por email (BASE §97.1).
- **Opciones:**
  - A) Sí, solo para reportes `sensitivity=none`, a dominios en lista permitida, como adjunto o enlace de un solo uso con vencimiento **(Recomendada)** — cubre auditores y entes sin exponer datos personales.
  - B) No; solo usuarios del tenant — máxima seguridad, obliga a crear usuarios para externos.
  - C) Sí para cualquier reporte con enlace firmado — práctico, riesgo de fuga de datos personales.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-036, RN-BIA-019, PRM-BIA-057/058.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-05 — Benchmark anónimo entre cooperativas
- **Pregunta:** ¿Se ofrece comparación anónima de indicadores entre cooperativas?
- **Contexto:** es una propuesta de valor del SaaS, no pedida en BASE; implica consentimiento y riesgo de reidentificación.
- **Opciones:**
  - A) Sí, con adhesión voluntaria, solo ratios, segmentos con ≥ 5 participantes y sin dominancia > 40 %, en O11 **(Recomendada)** — valor diferencial con riesgo controlado.
  - B) No ofrecer — sin riesgo, sin el valor.
  - C) Incluir a todos los tenants por defecto con opción de salida — más muestra, requiere cláusula contractual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-069, RN-BIA-027, PAN-BIA-20, JOB-BIA-18.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-06 — Alcance de la IA analítica
- **Pregunta:** ¿La IA analítica acepta preguntas libres o solo preguntas de catálogo?
- **Contexto:** CNX §4.5 "cubo certificado primero, IA después"; ARQ-08 (IA solo propone); costo por tenant.
- **Opciones:**
  - A) Preguntas de catálogo + libres traducidas a consulta semántica verificada, habilitable por tenant con tope de costo **(Recomendada)** — útil y auditable.
  - B) Solo preguntas de catálogo — predecible, menos útil.
  - C) Sin IA analítica — sin costo ni riesgo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-066 a RF-BIA-068, PRM-BIA-036/037, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-07 — Conector para Power BI y herramientas de BI
- **Pregunta:** ¿Cómo se conectan Power BI, Excel o Looker Studio?
- **Contexto:** ProCoop publicaba tablas a Power BI (`TABLAS_POWERBI`); DEC-002 impide acceso directo a la base.
- **Opciones:**
  - A) API key de solo lectura + feeds `/datasets/:code/rows` (JSON/CSV paginado) **(Recomendada)** — funciona con conectores web estándar.
  - B) Además, un conector personalizado de Power BI publicado por CoopApps — mejor experiencia, mantenimiento extra.
  - C) Réplica de lectura directa por tenant — máxima flexibilidad, rompe la base compartida.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-102.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-08 — Límites de consumo de la API por defecto
- **Pregunta:** ¿Qué límites por defecto tiene un cliente de API?
- **Contexto:** BASE §59 pide límites que no afecten facturación; dependen del plan comercial (T01).
- **Opciones:**
  - A) 600 solicitudes/min con ráfaga 100 y 100.000 unidades/día por cliente; 1.200/min por tenant; ajustables por plan **(Recomendada)** — suficiente para BI incremental.
  - B) 60/min sin cuota diaria — conservador, puede frustrar cargas iniciales.
  - C) Sin límite en planes superiores — riesgo para la plataforma compartida.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-074, PRM-BIA-053 a 055.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-09 — Retención de archivos exportados
- **Pregunta:** ¿Cuántos días se conserva un archivo exportado antes de purgarse?
- **Contexto:** BASE §97.8 (conservación); los archivos pueden contener datos personales.
- **Opciones:**
  - A) 7 días **(Recomendada)** — equilibrio entre comodidad y exposición.
  - B) 30 días — más cómodo, más exposición y almacenamiento.
  - C) 24 horas — mínima exposición, más regeneraciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-024, PRM-BIA-008.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-10 — Publicación de datos abiertos
- **Pregunta:** ¿Se ofrece a las cooperativas publicar datos abiertos en su landing?
- **Contexto:** MER-014 y transparencia ante socios y reguladores; requiere control de celdas mínimas.
- **Opciones:**
  - A) Opcional por tenant, solo agregados aprobados con n ≥ 10 por celda, en O11 **(Recomendada)**.
  - B) No ofrecer.
  - C) Publicación obligatoria de tarifas e indicadores de calidad de servicio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-089, PAN-BIA-21, API-BIA-64/65.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-11 — Fórmula de variación porcentual con base cero
- **Pregunta:** ¿Qué se muestra cuando el valor base de una comparación es 0?
- **Contexto:** ProCoop y M04 muestran 100 %; RN-BIA-010 propone "nuevo" sin número (CTR-BIA-04).
- **Opciones:**
  - A) "Nuevo" (valor nulo) por defecto, con modo ProCoop por reporte cuando el dueño lo pida **(Recomendada)** — evita porcentajes engañosos sin romper paralelos.
  - B) 100 % en todo el sistema, como ProCoop — paralelo directo, matemáticamente engañoso.
  - C) "Nuevo" en todo el sistema sin excepción — consistente, rompe el paralelo de M04.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-BIA-010, PRM-BIA-022, REP-TAR-002/003/006.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-12 — Auditoría de consultas a reportes
- **Pregunta:** ¿Qué accesos a reportes se registran?
- **Contexto:** BASE §54 deja la auditoría de lecturas "según necesidad"; volumen vs control.
- **Opciones:**
  - A) Exportaciones, descargas, desenmascarado y visualización de reportes con datos personales **(Recomendada)**.
  - B) Toda ejecución de cualquier reporte — máximo control, mucho volumen.
  - C) Solo exportaciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-034, PRM-BIA-059.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-13 — Aprobación de reportes personalizados
- **Pregunta:** ¿Un reporte personalizado necesita aprobación de otra persona para publicarse?
- **Contexto:** MER-012 (gobierno de cambios); tenants chicos pueden tener un solo analista.
- **Opciones:**
  - A) Sí, aprobador distinto del autor, configurable a "no" solo por el administrador del tenant **(Recomendada)**.
  - B) Sin aprobación.
  - C) Aprobación de plataforma.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-043, PRM-BIA-027.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-14 — Datos personales y de sueldos en la API
- **Pregunta:** ¿Se habilitan los scopes `pii:read` y `payroll:read`?
- **Contexto:** BASE §59 exige minimización; §97.1 protección de datos; RN-SUE-093 prohíbe datos sensibles de personal en BI general.
- **Opciones:**
  - A) `pii:read` con finalidad registrada, aprobación por persona distinta del creador y vigencia ≤ 1 año; `payroll:read` solo agregados por centro y período **(Recomendada)**.
  - B) No ofrecer ninguno de los dos.
  - C) `pii:read` sin aprobación adicional.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-073, API-BIA-116, §4.3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-15 — Webhooks salientes
- **Pregunta:** ¿Se ofrecen webhooks salientes a terceros?
- **Contexto:** AGR-021 y FIC 14.3; alternativa: solo consulta incremental.
- **Opciones:**
  - A) Sí, en O11, firmados HMAC-SHA256 con payload delgado y reintentos hasta 72 h **(Recomendada)**.
  - B) No; solo consulta incremental.
  - C) Sí, con payload completo (incluye datos del recurso).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-BIA-083, §12.3, API-BIA-124 a 129.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-16 — Acceso delegado por usuario
- **Pregunta:** ¿Se habilita en la API el acceso en nombre de un usuario (authorization code + PKCE)?
- **Contexto:** BASE §59 pide "diferenciar integración servidor a servidor y acceso delegado"; RF-IAM-114 lo deja a T10.
- **Opciones:**
  - A) No en la primera versión de la API; tokens diseñados con `sub` opcional para habilitarlo después sin romper compatibilidad **(Recomendada)**.
  - B) Sí en O11 para aplicaciones confidenciales registradas, con scopes ⊆ capabilities del usuario.
  - C) Nunca.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §11.2.1, RF-IAM-114.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-BIA-17 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 7 máquinas de §8 estaban en texto sin estado de alta en tabla; 4 referencias no tenían destino (`scenarioId`, `templateOriginId`, `catalogQuestionId`, `indicatorId`); 59 colecciones no tenían tabla de campos; 14 filas de §11 citaban reglas en lugar de una capability; los scopes `erp.catalog:read` y `erp.finance:read` figuraban sin capability en T02; `apiUsageDaily` usaba `day` en lugar del nombre canónico `date`.
- **Opciones:**
  - A) Agregar §8.12 con una fila por transición y estado inicial; declarar destinos (`scenarioId` → `simulationScenarios` de M15, `templateOriginId` → `customReports`) y renombrar `catalogQuestionCode` (antes `catalogQuestionId`, código de configuración); renombrar `date` (antes `day`); agregar §7.26 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `bia.reportes.ver`, `bia.exportaciones.crear`, `bia.apis.consumir` y `public: true` (con la condición o la capability adicional entre paréntesis); citar el mapeo de los scopes `erp` de T02 §4.4.3. **(Recomendada)**.
  - B) Dejar las máquinas solo en texto y las celdas como reglas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos, ER y matriz de capabilities de T10.
- **Estado:** Asumida (DEC-072): opción A.
- **Residual (5-11-2026), Asumida (DEC-072):** el texto de §7.11 y §7.13 se alinea a §7.26 y a T05 (COL-BIA-12, 15, 16): `indicatorSnapshots` y `kpiAlertRules` llevan `indicatorId` (→ `indicatorDefinitions`) como referencia e `indicatorCode` como copia desnormalizada; `kpiAlerts.kpiAlertRuleId` (antes `ruleId`) también en el índice y en la deduplicación del §9; `apiUsageDaily.date` ya estaba alineado (§7.20).
- **Sincronización (5-11-2026), Asumida (DEC-072):** T10 se suscribe directamente a los canónicos de EVT-COB-04, EVT-COB-05, EVT-COB-06 y EVT-IAM-05 (`iam.role.changed` / `iam.profile.changed`), porque los alias `cob.ledgerEntry.posted` e `iam.roleAssignment.changed` resuelven a un solo canónico (T11 §12.4.1, CNC-WFL-083 y CNC-WFL-089); las fuentes de `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_invoice` citan los canónicos con "antes".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-01 — Momento de creación del contrato

- **Pregunta:** ¿El contrato se crea cuando el socio envía la solicitud, cuando CRM la admite o cuando se aprueba?
- **Contexto:** BASE §48 separa solicitar de ejecutar; ProCoop crea el registro `SERSOC` al grabar el alta. Crear demasiado pronto llena la base de contratos de solicitudes inválidas; crear tarde impide reservar equipo y agendar.
- **Opciones:**
  - A) **(Recomendada)** Al admitir la solicitud en CRM, en estado `requested`, sin efectos de facturación.
  - B) Al enviar la solicitud desde cualquier canal.
  - C) Solo al aprobar (la solicitud vive en CRM hasta entonces).
- **Impacto si no se responde:** se aplica A; ajustar luego obliga a migrar contratos `requested`.
- **Bloquea:** RF-CAT-067, T01, integración CRM–CAT (O3).
- **Estado:** Respondida (DEC-011): opción A, el contrato se crea al admitir la solicitud en CRM, en estado `requested`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-02 — Quién habilita capacidades y quién publica servicios

- **Pregunta:** ¿Quién habilita una capacidad en un tenant y quién publica la oferta? (BASE §71)
- **Contexto:** la habilitación depende de licencia (T01); la publicación compromete condiciones frente a los socios.
- **Opciones:**
  - A) **(Recomendada)** La plataforma habilita según licencia; el administrador del tenant configura y publica con aprobación por usuario distinto en producción (PRM-CAT-002).
  - B) El tenant habilita y publica sin intervención de plataforma.
  - C) La plataforma habilita y publica a pedido del tenant.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** RF-CAT-002, RF-CAT-005, PAN-CAT-02.
- **Estado:** Respondida (DEC-021): opción A, la plataforma habilita según licencia y el administrador del tenant publica con aprobación de otro usuario en producción.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-03 — Efecto de apagar una capacidad u oferta con contratos vigentes

- **Pregunta:** ¿Qué pasa con los contratos vigentes si se cierra la oferta o se deshabilita la capacidad? (BASE §71)
- **Contexto:** apagar no debe dejar socios sin servicio ni facturación huérfana.
- **Opciones:**
  - A) **(Recomendada)** Cerrar oferta solo impide nuevas contrataciones; cerrar operación exige plan de salida aprobado (bajas programadas, aviso, migración de plan).
  - B) Deshabilitar da de baja automáticamente todos los contratos.
  - C) No se permite deshabilitar mientras haya contratos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-001=true.
- **Bloquea:** RN-CAT-003, CU-CAT-12.
- **Estado:** Respondida (DEC-022): opción A, cerrar la oferta frena altas y cerrar la operación exige plan de salida.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-04 — Altas automáticas de servicios opcionales

- **Pregunta:** ¿Puede una regla automática crear contratos de servicios opcionales (ej. sepelio al conectar electricidad)?
- **Contexto:** ProCoop (`ALTASEAU`) los crea; BASE §66/§81 y la normativa de defensa del consumidor exigen consentimiento para servicios no obligatorios.
- **Opciones:**
  - A) **(Recomendada)** `create` solo para servicios obligatorios con fundamento normativo registrado (`legalBasis`); opcionales en modo `propose` con consentimiento del socio.
  - B) Permitir `create` en cualquier servicio, a criterio del tenant.
  - C) Solo `propose` en todos los casos.
- **Impacto si no se responde:** se aplica A; la migración de `ALTASEAU` crea reglas en `propose`.
- **Bloquea:** RF-CAT-086, RN-CAT-035, CTR-CAT-05.
- **Estado:** Respondida (DEC-023): opción A, altas directas solo para servicios obligatorios con fundamento normativo; los opcionales se proponen con consentimiento.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-05 — Jerarquía definitiva servicio, producto, subservicio y plan

- **Pregunta:** ¿Cuál es la jerarquía definitiva? (BASE §74)
- **Contexto:** ProCoop usa servicio → categoría → producto (`PROD_SER`); BASE §72 habla de productos, planes y subservicios.
- **Opciones:**
  - A) **(Recomendada)** Servicio del tenant → producto (incluye subservicio como producto `addon`) → plan versionado → conceptos facturables; la categoría es eje estructural transversal al plan.
  - B) Servicio → plan → subservicios, sin entidad producto.
  - C) Servicio → categoría → producto (modelo ProCoop).
- **Impacto si no se responde:** se aplica A, que admite migrar el modelo ProCoop.
- **Bloquea:** modelo de datos 7.5–7.10, M04 TAR.
- **Estado:** Respondida (DEC-012): opción A, servicio → producto (subservicio = producto adicional) → plan versionado → conceptos facturables.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-06 — Alcance de Banco de sangre

- **Pregunta:** ¿Banco de sangre se limita a cobertura administrativa por convenio? (BASE §91, §95)
- **Contexto:** gestionar información clínica implica régimen de datos de salud y habilitaciones sanitarias.
- **Opciones:**
  - A) **(Recomendada)** Solo administrativo: contrato, beneficiarios, convenio, autorización de cobertura; sin datos clínicos ni decisión de aptitud.
  - B) Incluir registro de donaciones y aptitud.
  - C) No incluirlo en la primera versión.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.12, CU-ESP-SAN.
- **Estado:** Respondida (DEC-024): opción A, solo administrativo por convenio, sin datos clínicos.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-07 — Autorización del tenant origen en copias

- **Pregunta:** ¿Hace falta consentimiento del tenant origen para copiar su configuración a otro?
- **Contexto:** la configuración (planes, condiciones, textos) puede ser información comercial propia de cada cooperativa.
- **Opciones:**
  - A) **(Recomendada)** Sí: autorización explícita del tenant origen más ejecución por operador de plataforma o admin del destino.
  - B) La plataforma copia sin consentimiento (configuración no es dato personal).
  - C) Solo se copian plantillas de plataforma, nunca configuración de tenants.
- **Impacto si no se responde:** se aplica A (PRM-CAT-103).
- **Bloquea:** RF-CAT-104..108, API-CAT-47.
- **Estado:** Respondida (DEC-025): opción A, autorización explícita del tenant origen.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-08 — Plantillas de plataforma

- **Pregunta:** ¿CoopApps mantiene plantillas de servicio propias (sin tenant origen)?
- **Contexto:** acelera el lanzamiento en cooperativas nuevas; riesgo de sugerir precios o condiciones como oficiales.
- **Opciones:**
  - A) **(Recomendada)** Sí, sin precios ni condiciones reguladas; solo estructura, conceptos, estados y textos de ejemplo.
  - B) Sí, con precios de referencia.
  - C) No; solo copia entre tenants.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** RF-CAT-109, API-CAT-55.
- **Estado:** Respondida (DEC-026): opción A, plantillas de plataforma sin precios ni condiciones reguladas.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-09 — Semántica de "Provisorio" y "Cobrar provisorio"

- **Pregunta:** ¿Qué significan exactamente las marcas de `SERSOC` "Provisorio" y "Cobrar provisorio"?
- **Contexto:** las fuentes no lo describen con precisión ([VERIFICAR]); se usan en filtros de `CONEXION` y trámites masivos.
- **Opciones:**
  - A) **(Recomendada)** Provisorio = suministro transitorio (obra, evento) con vencimiento obligatorio; Cobrar provisorio = se factura durante la condición provisoria con conceptos propios.
  - B) Provisorio = alta pendiente de documentación.
  - C) Eliminar las marcas y reemplazarlas por planes específicos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-071.
- **Bloquea:** RF-CAT-069, RN-CAT-063, migración de flags.
- **Estado:** Respondida (DEC-027): opción A, suministro transitorio con vencimiento obligatorio, facturable en esa condición.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-10 — Modalidad por defecto de equipos

- **Pregunta:** ¿Los equipos se entregan en comodato, venta o alquiler por defecto, y quién los valoriza? (BASE §74)
- **Opciones:**
  - A) **(Recomendada)** Modalidades configurables por plan; por defecto comodato en INT y TV; valorización y custodia en STK; cargo por no devolución solo si figura en las condiciones aceptadas.
  - B) Siempre venta financiada.
  - C) Siempre comodato sin cargo por pérdida.
- **Impacto si no se responde:** se aplica A (PRM-CAT-093).
- **Bloquea:** RF-CAT-051, RF-CAT-079, RF-CAT-101.
- **Estado:** Respondida (DEC-013): opción A, configurable por plan; comodato por defecto en Internet y TV, valorizado en stock.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-11 — Contratos iguales en la misma cuenta

- **Pregunta:** ¿Se permite que una cuenta tenga dos contratos del mismo servicio?
- **Contexto:** V2 2269/2715 lo prohíben; BASE §1/§83 exige múltiples contrataciones independientes.
- **Opciones:**
  - A) **(Recomendada)** Permitir en no medidos; en medidos uno por punto de suministro (con distinto domicilio o medidor se permiten).
  - B) Prohibir siempre.
  - C) Permitir siempre.
- **Impacto si no se responde:** se aplica A (PRM-CAT-021/022).
- **Bloquea:** RN-CAT-032, RF-CAT-078.
- **Estado:** Respondida (DEC-028): opción A, permitido en no medidos; en medidos, uno por punto de suministro.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-12 — Deuda en el domicilio del servicio

- **Pregunta:** ¿La deuda de otra cuenta en el mismo domicilio bloquea el alta?
- **Contexto:** ProCoop puede bloquear; BASE §1/§89 dice que la dirección no determina la deuda de otro titular (ESC-03).
- **Opciones:**
  - A) **(Recomendada)** Advertencia por defecto; el tenant puede exigir autorización de supervisor; nunca bloqueo automático ni traslado de deuda.
  - B) Bloqueo configurable.
  - C) Sin control.
- **Impacto si no se responde:** se aplica A (PRM-CAT-017).
- **Bloquea:** RN-CAT-030, RF-CAT-076.
- **Estado:** Respondida (DEC-029): opción A, advertencia con autorización opcional; nunca bloqueo ni traslado de deuda.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-13 — Modalidades de gas

- **Pregunta:** ¿Qué modalidades de gas se modelan (red natural, propano por redes, envasado)?
- **Contexto:** BASE §89 distingue condición de prestador/subdistribuidor; ProCoop tiene `CORREGAS`, `PRCAGAS`, `ENGAS_CANTMESES`.
- **Opciones:**
  - A) **(Recomendada)** Variantes de la capacidad GAS (red natural, propano por red, envasado) habilitables por tenant con perfil propio.
  - B) Solo gas natural por red.
  - C) Capacidades separadas por modalidad.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.7.
- **Estado:** Respondida (DEC-030): opción A, red natural, propano por red y envasado, habilitables por tenant; el envasado se detalla en PA-CAT-17 (DEC-082).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-14 — Suspensión voluntaria

- **Pregunta:** ¿La suspensión voluntaria (vacaciones, ausencia) está disponible por defecto?
- **Opciones:**
  - A) **(Recomendada)** Configurable por servicio, deshabilitada por defecto; con duración máxima y efecto sobre cargos definidos en TAR.
  - B) Habilitada por defecto en todos los servicios.
  - C) No se ofrece.
- **Impacto si no se responde:** se aplica A (PRM-CAT-098/099).
- **Bloquea:** T08 motivo `voluntary`, JOB-CAT-08.
- **Estado:** Respondida (DEC-031): opción A, configurable por servicio y deshabilitada por defecto.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-15 — Fecha efectiva del cambio de plan

- **Pregunta:** ¿Desde cuándo rige un cambio de plan?
- **Opciones:**
  - A) **(Recomendada)** Configurable; por defecto el próximo período de facturación; inmediato con prorrateo (TAR) si el tenant lo habilita; upgrades técnicos desde la confirmación de reprovisión.
  - B) Siempre inmediato con prorrateo.
  - C) Siempre al próximo período.
- **Impacto si no se responde:** se aplica A (PRM-CAT-100).
- **Bloquea:** RF-CAT-081, 9.4.
- **Estado:** Respondida (DEC-032): opción A, próximo período; inmediato con prorrateo si el tenant lo habilita.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-16 — Hito que confirma la activación

- **Pregunta:** ¿Qué hito activa el contrato técnico y qué rol tiene la revisión supervisora? (BASE §74)
- **Contexto:** activar antes de la provisión genera cargos sin servicio; esperar a la revisión retrasa la facturación.
- **Opciones:**
  - A) **(Recomendada)** Activa la confirmación técnica (`tec.installation.activationConfirmed`, EVT-TEC-16, con provisión confirmada y conformidad); la revisión supervisora es posterior y, si observa, abre corrección sin revertir automáticamente.
  - B) Activa la aprobación del supervisor tras la instalación.
  - C) Activa el cierre administrativo de la OT.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** T06, RN-CAT-042, M10 TEC.
- **Estado:** Respondida (DEC-033): opción A, activa la confirmación técnica de instalación y aprovisionamiento; la revisión del supervisor es posterior.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-17 — Gas envasado

- **Pregunta:** ¿Cómo se ofrece el gas envasado (garrafas, cilindros) dentro del servicio GAS? (HUE-GAS-02)
- **Contexto:** la ficha 6.C.7 lista la modalidad envasado (PA-CAT-13), pero el perfil GAS asume medidor, factor de corrección y DDJJ de artefactos, que no aplican a una garrafa. Algunas cooperativas venden garrafas con entrega a domicilio.
- **Opciones:**
  - A) **(Recomendada)** Variante "envasado" del servicio GAS como venta con stock en M13 y entrega en M10, sin medidor ni corrección (tipo de cálculo por cantidad), habilitable por tenant con PRM-CAT-112 (deshabilitada por defecto).
  - B) Fuera de alcance hasta que un tenant lo pida.
- **Impacto si no se responde:** se aplica A con PRM-CAT-112 = false.
- **Bloquea:** ficha 6.C.7 (modalidad envasado), PRM-CAT-112.
- **Estado:** Respondida (DEC-082): opción A, el gas envasado entra en el alcance como variante "envasado" del servicio GAS (venta con stock de M13 y entrega de M10, sin medidor ni corrección de volumen), habilitable por tenant. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-18 — Conceptos de terceros sin servicio propio

- **Pregunta:** ¿De qué se cuelga un concepto por cuenta de terceros (tasa municipal, aporte a bomberos, tasa hospital) cuando el socio no tiene un servicio al que asociarlo? (HUECO-TAS-01)
- **Contexto:** la ficha 6.C.15 admite el concepto transversal o un contrato "Fijos", pero no define qué pasa si el socio no tiene contrato que lo soporte; FAC necesita un contrato para facturar y COB para imputar.
- **Opciones:**
  - A) **(Recomendada)** Siempre cuelgan de un contrato propio del socio: si no hay un contrato al que asociarlo, se crea uno con el perfil de servicio "convenio de terceros" de tipo accesorio (sin técnica ni medición), configurable por tenant y por convenio.
  - B) Se facturan por inmueble sin contrato.
- **Impacto si no se responde:** se aplica A.
- **Bloquea:** ficha 6.C.15, mapeo `CLASESER` de §19.1 (pendiente de HUECO-TAS-03; resuelto con RF-FIS-163/RN-FIS-126 de M06 y RN-MIG-051 de T07), M05 FAC.
- **Estado:** Respondida (DEC-083): opción A, los conceptos de terceros siempre cuelgan de un contrato propio del socio con perfil de servicio "convenio de terceros" de tipo accesorio; nunca se facturan por inmueble sin contrato. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-19 — Correo electrónico y pack SMS

- **Pregunta:** ¿Se mantienen como servicios el correo electrónico (`CORREOSINT`) y el pack SMS? (HUECO-OTR-03)
- **Contexto:** ProCoop los vende como productos TIC; el aprovisionamiento real lo hace un proveedor externo y hoy casi no tienen altas nuevas.
- **Opciones:**
  - A) **(Recomendada)** Servicios de M02 con aprovisionamiento por T06 (integración con el proveedor) y cupo/consumo, habilitables por tenant con PRM-CAT-113 (deshabilitados por defecto).
  - B) Discontinuar y migrar solo los históricos.
- **Impacto si no se responde:** se aplica A con PRM-CAT-113 = `none`.
- **Bloquea:** RF-CAT-100, ficha 6.C.17 (correo y pack SMS), T06.
- **Estado:** Respondida (DEC-084): opción A, correo electrónico y pack SMS se mantienen como servicios de M02 con aprovisionamiento por T06 y control de cupo y consumo, habilitables por tenant. Estado anterior: "Asumida la recomendada (DEC-072) salvo respuesta del solicitante".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CAT-23 — Residuales de estados y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones que faltaban, el tratamiento de `serviceStatuses.canonicalStatus` como clasificación y los destinos de las referencias sin colección?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 10 máquinas de M02 sin estado inicial, `serviceStatuses`, `contractDeclaredAppliances` y `contractSpecialConditions` con estados sin transiciones, y `contractEquipmentAssignments` con valores de §7 inalcanzables (eran los nombres de M13 de la equivalencia); 03-er marcó sin destino `requiresProductIds`, `excludesProductIds`, `declaredAffidavitRef` y `chargeProposalId`.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.5 el estado de alta de cada máquina y las transiciones de `contractDeclaredAppliances` (`active` → `removed`) y `contractSpecialConditions` (`draft` → `approved` → `expired`; → `cancelled`); tratar `canonicalStatus` como clasificación sin ciclo; escribir la equivalencia con M13 fuera de código; `requiresProductIds`/`excludesProductIds` → `serviceProducts`; `declaredAffidavitRef` → `documents` (T11); `feasibilityRef` → `feasibilityRequests` (M10); `chargeProposalId` → `approvalRequests` (T11).
  - B) Dejar los estados iniciales implícitos y `chargeProposalId` apuntando a `billableItems`.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), T05 §7.2.1.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.5, §7.8, §7.18, §7.20, §7.21, §7.24, §8.4 y §8.5. T05 debe registrar los destinos; M13 §7 (`chargeProposalId`) debe citar `approvalRequests` (T11).
- **Residual (5-11-2026), Asumida (DEC-072):** pedido de M12 (PA-CMP-16) de confirmar `packageIds` → `servicePlans`: no se confirma. El paquete de TV que cuentan RF-CAT-116, REP-CAT-16 y API-CAT-56 es un producto (`serviceProducts`, el mismo que marca `tvMinimumLineup`, RN-CAT-079, y que cita PRM-MOR-200 de M08); `servicePlans` son los planes comerciales de ese producto y `serviceBundles` los combos de varios servicios. Destino: `serviceProducts` (M02, COL-CAT-05). M12 §7.13.21 y T05 §7.2.1 y COL-CMP-22 deben cambiar `servicePlans` por `serviceProducts`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-01 — Revisión obligatoria por clase de cambio
- **Pregunta:** ¿Qué cambios de configuración deben ser aprobados por un usuario distinto del autor antes de publicarse?
- **Contexto:** BASE §39.1 exige aprobación para la configuración sensible, pero no la define. Exigir revisión en todo frena la operación diaria; no exigirla en nada contradice AGR-009.
- **Opciones:**
  - A) Revisión obligatoria por otro usuario para las clases `commercial`, `fiscal` y `security` y para las claves marcadas `sensitive`; `operational`, `presentation` y `technical` se autopublican con auditoría **(Recomendada)** — equilibra control y agilidad.
  - B) Revisión para todo cambio — máxima seguridad; las cooperativas chicas con un solo administrador quedan bloqueadas.
  - C) Revisión opcional, configurable por tenant sin mínimo — flexible, pero permite publicar tarifas sin control.
- **Impacto si no se responde:** se asume A; PRM-CFG-001..003 con esos defaults.
- **Bloquea:** RF-CFG-013, RF-CFG-031, RN-CFG-008, O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-01 — Numeración de titulares: asociados y clientes
- **Pregunta:** ¿Cómo se numeran los titulares en CoopApps?
- **Contexto:** ProCoop permite series diferenciadas para asociados y clientes (V2 #32), número manual para activos (2660) y numeración que considera activo/baja (2673). En la migración (T07) hay que conservar los números existentes.
- **Opciones:**
  - A) Una sola secuencia por tenant, con atributo `tipoTitular` (asociado/cliente); número manual solo en la migración **(Recomendada)** — es simple, sin colisiones, y conserva los números históricos.
  - B) Dos series configurables (asociados y clientes), replicando 32 — mantiene la costumbre pero obliga a gestionar rangos.
  - C) Permitir número manual en cualquier alta — es flexible pero arriesga duplicados y huecos.
- **Impacto si no se responde:** se asume A; 32 y 2660 quedan `A validar (PA-CFG-P1-01)`.
- **Bloquea:** PRM-PER-P1 de 32 y 2660; numeración de M01 y T04 (O2); T07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-03 — Claves de mapas e IA: de la plataforma o del tenant
- **Pregunta:** ¿Las claves de Google/Bing Maps y OpenAI las provee la plataforma o cada cooperativa?
- **Contexto:** En ProCoop cada cooperativa cargaba sus propias claves (2242, 2251, 3048). En SaaS conviene centralizarlas, pero el costo de uso varía por tenant.
- **Opciones:**
  - A) Las provee la plataforma (costo incluido o medido por licencia), con opción de que el tenant use su propia clave **(Recomendada)** — la puesta en marcha es simple y el costo queda controlado.
  - B) Cada tenant debe cargar su clave en la bóveda — sin costo para la plataforma, pero agrega fricción al alta del tenant.
  - C) Solo la plataforma, sin opción de clave propia — es lo más simple, pero no permite que el tenant pague su propio consumo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-INT-P1 (claves de mapas e IA), PRM-PLA-P1 de 2090, T06 (O1), M10 (mapas, O3).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-04 — Intereses por mora en pagos online
- **Pregunta:** Cuando un socio paga online una factura vencida, ¿el interés se cobra en el momento o se difiere a la próxima factura?
- **Contexto:** V2 #12 (CoopOnline) permite diferirlo; afecta la conciliación con pasarelas que cobran importes fijos (QR, link, cupón).
- **Opciones:**
  - A) Diferir el interés a la próxima factura por defecto, configurable por canal **(Recomendada)** — es compatible con todas las pasarelas y replica ProCoop.
  - B) Recalcular y cobrar el interés en el momento del pago — más exacto, pero exige importes dinámicos en cada pasarela.
  - C) No cobrar interés en pagos online — incentiva el canal, pero implica pérdida financiera.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 12, M08 y M07 (O5–O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-05 — Reconexión automática al pagar
- **Pregunta:** ¿Se reconectan automáticamente los servicios suspendidos por deuda cuando se confirma el pago?
- **Contexto:** V2 #3112/3113 lo permiten para servicios sin técnica. En el piloto Internet la reconexión es remota (aprovisionamiento), lo que habilita automatizarla.
- **Opciones:**
  - A) Automática para servicios con reconexión remota o sin técnica, evaluando la deuda por servicio, al confirmarse el pago (no al iniciarlo) **(Recomendada)** — mejor experiencia y menos llamados.
  - B) Siempre con aprobación manual de un operador — más control, pero más demora.
  - C) Automática también para servicios con técnica (genera la OT sola) — máxima automatización, con riesgo de visitas por pagos luego revertidos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 3112 y 3113, M08 (O6), cierre del piloto Internet.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-06 — Antigüedad de comprobantes visibles en el portal
- **Pregunta:** ¿Cuántos meses de comprobantes ve el socio en el portal?
- **Contexto:** V2 #36 borraba PDF antiguos de la web. En CoopApps los PDF fiscales se conservan según la retención legal (T08); solo se decide qué ve el socio.
- **Opciones:**
  - A) 24 meses visibles; los anteriores se piden desde el portal y se generan bajo demanda **(Recomendada)** — equilibra utilidad y rendimiento.
  - B) Todo el historial siempre visible — es lo más transparente, pero las listas se vuelven largas.
  - C) 12 meses — listas cortas, pero genera más consultas al soporte.
- **Impacto si no se responde:** se asume A (`por.comprobantes.mesesVisibles = 24`).
- **Bloquea:** PRM-POR-P1 de 36, M19 (O2).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-07 — Prioridad de los parámetros regulatorios de otras provincias (OCEBA, RASE, EPRE, ATER)
- **Pregunta:** ¿En qué ola se implementan los parámetros y archivos de reguladores de Buenos Aires (OCEBA), RASE, EPRE y ATER?
- **Contexto:** Unas 80 filas de esta parte (casi todas de TITULARES) son parámetros de segmentación, tarifa social y archivos o mapeos regulatorios de energía eléctrica de otras jurisdicciones. El piloto es Internet en Córdoba (ERSeP). DEC-007 los deja en alcance.
- **Opciones:**
  - A) En O7, como mecanismo genérico de mapeo regulatorio (atributos en productos, categorías e impuestos más plantillas de archivo por regulador), cargando primero los reguladores de los tenants activos **(Recomendada)** — cumple DEC-007 sin bloquear el piloto.
  - B) Implementar solo los reguladores de los tenants que se contraten — menos trabajo inicial, pero lleva a desarrollos a pedido.
  - C) Pasarlos a prioridad Extensión (O11) — libera capacidad, con riesgo para la venta en Buenos Aires.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-FIS-P1 de reguladores y PRM-CAT-P1 de mapeo regulatorio; M06 y M02 (O7).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P1-08 — Exención de recargo por cuenta
- **Pregunta:** ¿Se permite eximir de recargo o interés por mora a una cuenta específica?
- **Contexto:** V2 #3135 lo permite y 3162 exige autorización en caja. Afecta la equidad entre asociados y los controles internos.
- **Opciones:**
  - A) Permitida con motivo, vigencia y autorización (workflow T11), con reporte de exenciones vigentes **(Recomendada)** — da flexibilidad con trazabilidad.
  - B) No permitida — máximo control, pero no cubre casos sociales.
  - C) Permitida sin autorización — más ágil, pero con riesgo de abuso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P1 de 3135 y 3162, M08 (O6), T11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-01 — Alcance de los 114 parámetros sin lectura directa en el código
- **Pregunta:** ¿Se implementan todos los parámetros catalogados que ProCoop no lee en sus fuentes descompilados, o solo los que alguna cooperativa tiene configurados con un valor distinto del default?
- **Contexto:** RN-09 §1: 114 de los 313 parámetros de este módulo no tienen lectura directa (pueden usarlos CoopOnline, PMovil, el Agente o procedimientos almacenados, o estar obsoletos). DEC-007 incluye en el alcance todo lo que hace ProCoop, pero un parámetro que nadie usa no es funcionalidad.
- **Opciones:**
  - A) Catalogarlos todos con PRM (como en este documento), pero **implementar el comportamiento** solo si en la migración (T07) se encuentra al menos una cooperativa con un valor distinto del default; el resto queda en estado `Extensión` y oculto **(Recomendada)**. Así se cumple DEC-007 sin construir comportamiento muerto.
  - B) Implementarlos todos en sus olas. Se gana cobertura total, con mayor costo y riesgo de replicar comportamiento obsoleto.
  - C) Descartar los que no tienen lectura directa. Es lo más barato, pero puede perder funciones que solo usan las apps externas.
- **Impacto si no se responde:** se asume A; los PRM sin lectura quedan `A validar (PA-CFG-P2-01)`.
- **Bloquea:** PRM sin lectura directa de M05, M11, M06, M08 y M19 (olas O4–O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-02 — Conversión de banderas "permitir/impedir" en permisos
- **Pregunta:** ¿Se confirma que las banderas globales que habilitan o impiden una acción del usuario (411, 2678, 2518, 2695, 325, 2360, 2511) pasan a ser capabilities por rol en lugar de parámetros del tenant?
- **Contexto:** en ProCoop la bandera rige para todos los usuarios. Con capabilities, la cooperativa puede, por ejemplo, permitir que un supervisor cambie precios y prohibírselo a un cajero.
- **Opciones:**
  - A) Capabilities por rol con auditoría de cada uso **(Recomendada)**. Da control fino, y en la migración el rol "operador" queda sin la capability cuando la bandera prohibía la acción.
  - B) Mantener además la bandera global como interruptor maestro. Suma una capa de configuración redundante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T02 (catálogo de capabilities), M05, M07, M11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-03 — Protección de los PDF de la impresión masiva (V2 #2402)
- **Pregunta:** ¿Cómo se protegen los PDF de facturas distribuidos masivamente?
- **Contexto:** ProCoop usa una única contraseña para todos los PDF generados, lo que no protege datos personales (T08) y obliga a comunicar la contraseña a todos los socios.
- **Opciones:**
  - A) Sin contraseña en el PDF: se distribuye un enlace firmado con vencimiento y descarga autenticada en el portal; si el tenant lo pide, el adjunto se envía sin contraseña **(Recomendada)**. Más simple y seguro.
  - B) Contraseña por destinatario derivada de un dato del socio (por ejemplo, su documento). Protege el adjunto, pero suma fricción y soporte.
  - C) Mantener una contraseña común guardada en la bóveda. Replica ProCoop con baja seguridad real.
- **Impacto si no se responde:** se asume A; el secreto 2402 no se migra.
- **Bloquea:** M05 (distribución), T06, T08.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-04 — Libro IVA ventas parcial (V2 #2605)
- **Pregunta:** ¿Se permite que el libro IVA ventas excluya la facturación diaria o la mensual?
- **Contexto:** ProCoop lo permite. El libro IVA legal y el Libro IVA Digital deben incluir todos los comprobantes fiscales emitidos.
- **Opciones:**
  - A) No: el libro legal y el digital siempre están completos, y la separación entre facturación diaria y mensual es solo un filtro de los reportes de gestión **(Recomendada)**. Así se evitan inconsistencias con ARCA.
  - B) Sí, como opción del tenant con advertencia. Replica ProCoop con riesgo fiscal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M06 (libros IVA, O8), T10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-05 — Parámetros con nombre de una cooperativa o un tercero puntual
- **Pregunta:** ¿Las variantes creadas para una cooperativa o un tercero puntual (2292 "CAU"/"AL", 2284 "A.M.A.", 3007 TORN, 3039 FECESCOR, 3134 ortopedia, 1023/1024 "personalizadas") se generalizan o se implementan como extensiones de ese tenant?
- **Contexto:** ProCoop resuelve estos casos con código condicionado por la sigla de la cooperativa (RN-02 §14, variable 2264). En un SaaS multitenant ese patrón no escala.
- **Opciones:**
  - A) Generalizar: convenios de terceros configurables (concepto, formato de exportación, secuencia), reglas por fórmula del motor M04 y métodos de interés nombrados por comportamiento, sin siglas **(Recomendada)**. Un solo código para todos los tenants.
  - B) Extensiones por tenant activables por la plataforma. Es más rápido para cada caso, pero acumula deuda.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P2-005, PRM-FAC-P2-041, PRM-SOC-P2-001, M06 (convenios de terceros), M04 (fórmulas).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P2-06 — Política de CAE en ventas de mostrador (V2 #727, #726, #2427)
- **Pregunta:** Cuando ARCA no responde en una venta de mostrador o en una caja, ¿qué hace el sistema?
- **Contexto:** con 727 activo, ProCoop espera el registro en ARCA antes de seguir. Sin él, entrega el comprobante y lo autoriza después con el Agente, con riesgo de entregar un comprobante sin CAE.
- **Opciones:**
  - A) Esperar el CAE con un tiempo máximo. Si se vence, pasar a CAEA o contingencia cuando el tenant lo tenga habilitado (M06); si no, dejar el comprobante en "pendiente de autorización" sin entregarlo como fiscal y reintentar con el job **(Recomendada)**.
  - B) Entregar siempre y autorizar en diferido, como ProCoop sin 727. Es más ágil, pero entrega comprobantes sin CAE.
  - C) Bloquear la venta hasta que ARCA responda. Es lo más seguro, pero corta la atención.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-FIS-P2-001, PRM-FIS-P2-002, PRM-FIS-P2-003; M06, M07 (caja), M11 (O4–O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-03 — Persistencia de resultados de Google
- **Pregunta:** ¿Qué se guarda de cada geocodificación hecha con Google?
- **Contexto:** Las condiciones de Google Maps Platform restringen el almacenamiento de coordenadas y contenido; la operación necesita el punto confirmado del acceso.
- **Opciones:**
  - A) Guardar el punto confirmado por el operador (dato propio) y el `place_id`; caché cruda de respuestas por 30 días; validación con el área legal **(Recomendada)** — cumple condiciones y conserva lo necesario.
  - B) Guardar todas las respuestas sin vencimiento — simple; riesgo de incumplimiento.
  - C) No guardar nada de Google, solo el texto — sin riesgo; obliga a re-geocodificar siempre.
- **Impacto si no se responde:** se asume A; JOB-CFG-14 purga a los 30 días.
- **Bloquea:** RF-CFG-080, JOB-CFG-14, O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-01 — Plazo de prescripción de deuda por defecto
- **Pregunta:** ¿Qué plazo por defecto se usa para marcar deuda como prescripta (#104) cuando el tenant no migra un valor?
- **Contexto:** ProCoop guarda "meses para prescripción" sin valor por defecto. El Código Civil y Comercial fija 2 años para prestaciones periódicas (art. 2562 inc. c) y 5 años como plazo genérico (art. 2560); la elección afecta el informe de prescripción, los incobrables y la gestión judicial.
- **Opciones:**
  - A) 24 meses por defecto, editable por tenant y por servicio **(Recomendada)** — alineado con el plazo de prestaciones periódicas; cada cooperativa lo ajusta con su asesor legal.
  - B) 60 meses por defecto — más conservador; puede mantener como cobrable deuda ya prescripta.
  - C) Sin valor por defecto, obligatorio al configurar el tenant — obliga a decidir en el alta; frena la puesta en marcha.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-029; reportes de prescripción e incobrables de M08 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-02 — Período de control de convenios: fechas fijas o ventana móvil
- **Pregunta:** ¿El tope de convenios por cuenta (#671) se controla dentro de un período de fechas fijas (#674/#675, como ProCoop) o en una ventana móvil de N meses?
- **Contexto:** Con fechas fijas, la cooperativa debe actualizar las fechas a mano cada período; si las olvida, el control queda desactivado o mal aplicado.
- **Opciones:**
  - A) Ventana móvil de N meses (default 12) **(Recomendada)** — no requiere mantenimiento; se migra calculando N desde las fechas ProCoop.
  - B) Mantener fechas fijas desde/hasta — réplica exacta de ProCoop; requiere mantenimiento periódico.
  - C) Ofrecer ambos modos — más flexible; más complejidad de configuración y pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-053, PRM-MOR-P3-056 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-03 — Política de pago online tras el vencimiento: general o por pasarela
- **Pregunta:** ¿Los límites de pago online después del vencimiento (permitir pagar tras el último vencimiento, días máximos, importe informado) se definen una vez por tenant con excepción por ente, o por separado en cada pasarela como en ProCoop?
- **Contexto:** ProCoop repite la misma política en cada pasarela con valores independientes (#905, #908, #914 en Pagos360; #2869, #3006, #3144 en SIRO; #3199 en Provincia Net). Esto produce reglas distintas para el mismo socio según el medio de pago.
- **Opciones:**
  - A) Política única del tenant (`cob.pagoOnline.*`) con override opcional por ente **(Recomendada)** — misma regla en todos los canales; se migra el valor más usado y los distintos quedan como override.
  - B) Una política independiente por pasarela — réplica de ProCoop; riesgo de inconsistencias.
  - C) Política única sin override — más simple; puede chocar con límites técnicos de una pasarela (ej. códigos de barras con fecha máxima).
- **Impacto si no se responde:** se asume A; los PRM de pasarela se tratan como override.
- **Bloquea:** PRM-COB-P3-074, -076, -078, -094, -095, -118, -119 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-04 — Reconexión automática al cobrar: comportamiento por defecto
- **Pregunta:** Cuando un socio con servicio cortado paga, ¿qué hace el sistema por defecto?
- **Contexto:** ProCoop permite no hacer nada, generar la OT de reconexión o generarla y confirmarla (#2713, #3106), reconectar sin técnica (#2926) y elegir qué deuda considerar (#3147). En el piloto Internet la reconexión puede ser solo de aprovisionamiento (sin visita).
- **Opciones:**
  - A) Generar OT automáticamente cuando no quede deuda vencida al último vencimiento; reconexión directa (aprovisionamiento) para servicios sin técnica **(Recomendada)** — reconecta rápido sin exigir pago de deuda aún no vencida.
  - B) Generar OT solo si se pagó toda la deuda (default ProCoop `todaLaDeuda`) — más estricto; demora reconexiones.
  - C) Sin acción automática; un operador decide — máximo control; más trabajo manual y reclamos.
- **Impacto si no se responde:** se asume A (`generarOT` + `vencidasUltimoVto` + reconexión directa sin técnica), configurable por servicio.
- **Bloquea:** PRM-MOR-P3-021, -023, -025 (O6, cierre del piloto Internet).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-05 — Prioridad de pasarelas secundarias
- **Pregunta:** ¿En qué ola se implementan los conectores de Naranja X, Macro, PayFun, Pago TIC, SiPago, Pronto Pago, Helipagos y Provincia Net?
- **Contexto:** DEC-007 los incluye en el alcance; O5 ya prevé Pagos360, Mercado Pago, SIRO y Red Link. Sus parámetros (40 filas de §5.11 y parte de §5.12) quedan definidos, pero cada conector requiere homologación con el proveedor.
- **Opciones:**
  - A) O5 para Pagos360, Mercado Pago, SIRO y Red Link; los demás como `Extensión` en O11, activados a pedido de cada tenant **(Recomendada)** — concentra el esfuerzo en lo que usa la mayoría de las cooperativas.
  - B) Todos en O5 — más alcance temprano; alarga O5 y retrasa el cierre del piloto.
  - C) Solo los que use cada tenant migrado, en la ola de su migración — prioriza por demanda real; requiere relevar uso por tenant.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-INT-P3-010 a -028, PRM-COB-P3-096 a -100, -113, -119 (O5/O11).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P3-06 — Beneficio de recargo para jubilados
- **Pregunta:** ¿Se mantiene la exención o reducción de recargo por mora para jubilados (#299, #1002) y cómo se identifica al jubilado?
- **Contexto:** ProCoop lo aplica como bandera global y depende de una marca del titular. En CoopApps puede modelarse como segmento o beneficio de la persona (M01) con regla de recargo por segmento (M08).
- **Opciones:**
  - A) Mantenerlo como beneficio de segmento ("jubilado/pensionado") con vigencia y comprobante, y regla de recargo por segmento **(Recomendada)** — reutilizable para otros segmentos (tarifa social, electrodependientes).
  - B) Mantener las dos banderas globales de ProCoop — réplica exacta; no escala a otros segmentos.
  - C) No replicarlo — simplifica; puede contradecir políticas sociales vigentes de las cooperativas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MOR-P3-001, PRM-MOR-P3-009; segmentos de M01 (O2) y motor de intereses de M08 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-01 — Módem GSM local para SMS
- **Pregunta:** ¿CoopApps tiene que soportar el envío de SMS por un módem GSM conectado a un puesto de la cooperativa, como ProCoop (V2 2047–2049)?
- **Contexto:** ProCoop tiene parámetros de desactivación de módem por errores. El stack de CoopApps (DEC-001) envía por proveedores vía API (Amazon SNS u otro gateway) con reintentos en BullMQ. Un módem local requiere el agente de hardware (DEC-007 lo admite para turnero y otros periféricos).
- **Opciones:**
  - A) Solo proveedores por API; el módem local queda fuera **(Recomendada)** — menos soporte en sitio y trazabilidad completa; las cooperativas con módem migran a un gateway.
  - B) Soportar módem GSM mediante el agente local como proveedor alternativo — más alcance, pero agrega mantenimiento de hardware y drivers.
  - C) Soportarlo solo como contingencia cuando el proveedor API no esté disponible — complejidad intermedia.
- **Impacto si no se responde:** se asume A; V2 2047 queda como política de plataforma.
- **Bloquea:** PRM-COM-P4-001, PRM-COM-P4-002; T09 (canal SMS), O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-02 — Nombre del socio en la pantalla pública del turnero
- **Pregunta:** ¿El turnero puede mostrar el nombre de la persona en la pantalla pública, como permite ProCoop (V2 2005, que por defecto muestra el nombre)?
- **Contexto:** exhibir nombres en una sala pública expone datos personales (Ley 25.326). ProCoop usa el nombre por defecto.
- **Opciones:**
  - A) Por defecto se muestra número o código; el tenant puede habilitar el nombre bajo su responsabilidad, con aviso **(Recomendada)** — privacidad por defecto sin perder la funcionalidad.
  - B) Replicar ProCoop (nombre por defecto) — continuidad visual para las cooperativas migradas.
  - C) Prohibir el nombre — máxima privacidad; algunas cooperativas pierden una función que usan.
- **Impacto si no se responde:** se asume A; los tenants migrados con nombre activo conservan el valor con aviso en la publicación de configuración.
- **Bloquea:** PRM-CRM-P4-006; M09 turnero, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-03 — Fechas de cierre por módulo
- **Pregunta:** ¿Se conservan los bloqueos de período independientes por módulo (ventas, compras, stock, bancos, tesorería, financiaciones, viviendas, sueldos, bienes de uso, contabilidad), como en ProCoop (V2 67, 432, 500, 502, 504, 505, 506, 2376, 2528, 2778)?
- **Contexto:** ProCoop tiene una fecha de cierre por módulo además del cierre contable. CoopApps las reemplaza por `con.periodLocks`; falta decidir si el bloqueo es por módulo o único.
- **Opciones:**
  - A) Bloqueo por módulo más bloqueo contable general que prevalece; T07 migra cada fecha **(Recomendada)** — mismo control operativo que hoy (por ejemplo, cerrar compras antes que contabilidad).
  - B) Solo el bloqueo contable general — más simple, pero se pierde el cierre escalonado por área.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M15 (bloqueos de período), M05/M12/M13/M14/M16/M18 (validación de fechas), O5/O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-04 — Métodos de valorización de stock
- **Pregunta:** ¿Qué métodos de la V2 2341 (FIFO, LIFO, PPP, precio de venta, precio de costo) se admiten para la **valuación contable** y cuáles solo como criterio de informe?
- **Contexto:** ProCoop permite los cinco como método de cálculo. Para la valuación contable, las normas argentinas usan costo de reposición o costo (FIFO/PPP); LIFO y precio de venta no son admitidos en la práctica contable habitual.
- **Opciones:**
  - A) Contable: FIFO o PPP (uno por tenant). Informe: los cinco **(Recomendada)** — consistencia contable sin perder los informes gerenciales.
  - B) Replicar ProCoop: los cinco también para la valuación contable — continuidad total, con riesgo de valuaciones no admitidas.
  - C) Solo PPP — más simple; algunas cooperativas tendrían que cambiar su método.
- **Impacto si no se responde:** se asume A; los tenants migrados con LIFO, precio de venta o precio de costo pasan a FIFO para la contabilidad, con aviso.
- **Bloquea:** PRM-STK-P4-010; M13 valorización, M15 asientos de stock, O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-05 — Topes previsionales y valores legales de sueldos
- **Pregunta:** ¿Los topes de aportes (V2 2437 y 2438) y los valores legales similares los mantiene la plataforma para todos los tenants o los carga cada cooperativa?
- **Contexto:** en ProCoop cada cooperativa los actualiza a mano. Son valores normativos comunes (ANSES/ARCA) que cambian por resolución.
- **Opciones:**
  - A) Tabla legal de plataforma con vigencia, mantenida por CoopApps, con override del tenant auditado **(Recomendada)** — menos errores y una sola actualización para todos.
  - B) Cada tenant los carga como parámetro propio — replica ProCoop; con riesgo de topes desactualizados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M16 (SICOSS, LSD), T01 (tablas legales de plataforma), O9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-P4-06 — Parches operativos de ProCoop
- **Pregunta:** ¿Se replican como opciones los parámetros que existen para resolver defectos de formatos externos (V2 2763 SIRADIG en noviembre y V2 3063 corrección de cabecera y fecha de txt)?
- **Contexto:** la regla DEC-007 incluye todo lo que hace ProCoop, pero estos parámetros corrigen problemas puntuales de archivos de terceros. Si el defecto ya no existe, generan imputaciones incorrectas.
- **Opciones:**
  - A) Migrarlos como opciones desactivadas por defecto, documentadas como compatibilidad y revisables en cada versión de formato **(Recomendada)** — no se pierde la función para quien la necesite.
  - B) Descartarlos y resolverlo en el importador de cada formato — catálogo más limpio, con riesgo de regresión en las cooperativas que hoy dependen de ellos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-SUE-P4-011, PRM-MED-P4-026; O7, O9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-06 — Puesto/terminal como ámbito de configuración
- **Pregunta:** ¿El puesto de trabajo (equipo/terminal) debe ser un ámbito de parámetros?
- **Contexto:** ProCoop resuelve punto de venta, impresora y lectores por `EQUIPOS` y por `.pro` de cada PC; en la web el "puesto" es un navegador.
- **Opciones:**
  - A) No es ámbito: punto de venta por sucursal/caja y periféricos como atributos del dispositivo registrado en M07/M09 **(Recomendada)** — simplifica la precedencia.
  - B) Agregar ámbito `device` entre `user` y `branch` — fiel a ProCoop; complica la resolución y el soporte.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-018, §19.3, O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-07 — Parámetros sin uso directo comprobado
- **Pregunta:** ¿Qué se hace con los 622 parámetros de ProCoop sin uso directo comprobado en el código analizado?
- **Contexto:** RN-09 sugiere no migrarlos; DEC-007 deja todo en alcance.
- **Opciones:**
  - A) Clasificarlos con la cooperativa piloto; mientras tanto quedan "A validar" en T04b con su equivalencia propuesta, y se crean en el registro solo cuando se confirma su uso **(Recomendada)** — no se pierde nada ni se infla el registro.
  - B) Crear todos en el registro desde O1 — cobertura total; ruido y mantenimiento.
  - C) Descartarlos — menos trabajo; contradice DEC-007.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-133, T04b, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-08 — Límite de retroactividad
- **Pregunta:** ¿Hasta cuántos días hacia atrás puede regir un cambio de configuración?
- **Contexto:** AGR-010 admite cambios con fecha efectiva pasada; sin límite se reabren períodos ya cerrados.
- **Opciones:**
  - A) Con aprobación, hasta 31 días (PRM-CFG-006), sin reescribir documentos; los efectos se corrigen con ajustes del módulo dueño **(Recomendada)**.
  - B) Sin retroactividad — más simple; obliga a ajustes manuales.
  - C) Sin límite con aprobación — flexible; riesgo contable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-035, RN-CFG-010, O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-09 — Alcance de la personalización de formularios
- **Pregunta:** ¿Qué puede cambiar el tenant en los formularios?
- **Contexto:** ProCoop permite modificar cualquier propiedad de cualquier control (`FORMULARIOS_PERSONALIZACIONES`).
- **Opciones:**
  - A) Ocultar campos opcionales, volver obligatorio, solo lectura, default, etiqueta, ayuda, orden y valores permitidos; sin lógica ni scripts **(Recomendada)**.
  - B) Además reglas condicionales simples (mostrar si…) — más potencia; más pruebas.
  - C) Sin personalización — mínimo esfuerzo; pierde una función de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-118, RN-CFG-041, PAN-CFG-22, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-10 — Modo de adopción de tablas de plataforma
- **Pregunta:** ¿Cómo recibe el tenant las actualizaciones de tablas de plataforma?
- **Contexto:** Las de referencia (geografía, documentos) no deberían requerir acción; las que afectan cálculos (fiscales, índices) sí.
- **Opciones:**
  - A) Tablas de referencia: siempre al día; tablas que afectan cálculos: "seguir con aviso", con aceptación del tenant antes de la vigencia y opción de fijar **(Recomendada)**.
  - B) Todo se aplica automáticamente — sin fricción; cambios fiscales sin revisión del tenant.
  - C) Todo requiere adopción manual — control total; riesgo de quedar desactualizado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-101, RN-CFG-023, PRM-CFG-026/033, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-11 — Semillas en tenants productivos
- **Pregunta:** ¿Puede aplicarse un paquete semilla a un tenant productivo?
- **Contexto:** BASE §39.1 separa los datos de demostración de los operativos.
- **Opciones:**
  - A) Semillas completas solo en demo/sandbox; en productivo, copia de servicios (M02) o plantillas sin importes **(Recomendada)**.
  - B) Permitir semillas en productivo con confirmación — rápido; riesgo de importes ficticios en operación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-064, RN-CFG-043, PRM-CFG-032, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-12 — Límite de campos extra
- **Pregunta:** ¿Cuántos campos extra puede definir un tenant por entidad?
- **Contexto:** Sin límite se degradan los índices y las pantallas.
- **Opciones:**
  - A) 50 por entidad incluidos en la licencia **(Recomendada)**.
  - B) 20 por entidad, ampliables con costo.
  - C) Sin límite.
- **Impacto si no se responde:** se asume A (PRM-CFG-027 = 50).
- **Bloquea:** RF-CFG-112, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-13 — Calles creadas por el tenant
- **Pregunta:** ¿Cómo se tratan las calles que el tenant crea porque no están en el catálogo nacional?
- **Contexto:** Loteos nuevos y zonas rurales no figuran en la fuente; BASE §77 prohíbe sustituirlas por homónimas.
- **Opciones:**
  - A) Locales del tenant en estado "pendiente de validación", utilizables de inmediato, con propuesta opcional a plataforma **(Recomendada)**.
  - B) Requieren aprobación de plataforma antes de usarse — catálogo limpio; bloquea altas.
  - C) Locales sin validación — rápido; duplicados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CFG-069, PAN-CFG-12, O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CFG-15 — Cierre de residuales del anexo (pantalla sin ruta, servicios, API, estados y tablas de campos)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** PAN-CFG-31 no citaba ninguna ruta; una fila de servicios internos no tenía nombre técnico; 11 filas de §11 citaban "Usuario autenticado", "Público" o "Token de tercero"; API-CFG-54 no citaba la API destino por ID y API-CFG-58 no tiene API destino; 6 máquinas no declaraban el estado de alta; 38 colecciones del §7 no tenían tabla de campos.
- **Opciones:**
  - A) Citar en PAN-CFG-31 las rutas de los flujos anfitriones de M19; nombrar el servicio `economicIndexes.valueAt({ seriesId, at })`; usar `iam.sesion.autenticada`, `public: true` y `bia.apis.consumir` (T02 PA-IAM-18); citar API-WFL-71 a 73 en API-CFG-54 y declarar que API-CFG-58 se reemplaza por un servicio interno sin API; agregar §8.11 y las tablas de campos de §7.18 (derivadas del texto y de T05, obligatoriedad por regla). **(Recomendada)**.
  - B) Dar a PAN-CFG-31 una ruta propia de modal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** catálogo de pantallas, contratos OpenAPI y diagramas de estados de T04.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-01 — Padrón de proveedores en O3
- **Pregunta:** ¿El piloto (O3) necesita un padrón mínimo de proveedores para registrar el ingreso de equipos serializados?
- **Contexto:** BASE §101 pone stock serializado en O3; el circuito de compras está en O8. Sin proveedor, el ingreso de módems queda sin origen.
- **Opciones:** A) (Recomendada) Sí, padrón mínimo (razón social, CUIT, condición IVA) y registro simple de ingreso, sin OC obligatoria. B) Ingreso en M13 sin proveedor y completar en O8. C) Adelantar el circuito completo a O3.
- **Impacto si no se responde:** el ingreso del piloto queda sin trazabilidad de origen o con costo desconocido.
- **Bloquea:** RF-CMP-018, RF-CMP-067, CU-OPE-01 en O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-02 — Nota de pedido
- **Pregunta:** ¿Se mantiene la nota de pedido como documento distinto de la OC?
- **Contexto:** CAT tiene `OCOMPRA` y `NPEDIDO` con funciones superpuestas (CTR-CMP-02).
- **Opciones:** A) (Recomendada) Unificar: la nota de pedido es una liberación contra OC abierta. B) Mantener dos documentos. C) Eliminar la OC marco.
- **Impacto si no se responde:** modelo de OC indefinido y migración ambigua.
- **Bloquea:** RF-CMP-054, migración de `NPEDIDO`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-03 — Recepción implícita en la factura (P583)
- **Pregunta:** ¿La factura puede registrar la recepción cuando no hubo remito?
- **Contexto:** con P583 desactivado, la factura de ProCoop mueve stock. En CoopApps la factura nunca mueve stock.
- **Opciones:** A) (Recomendada) Sí, con capability: la factura genera una recepción separada que se publica a M13. B) No, siempre remito previo. C) Solo para servicios (conformidad).
- **Impacto si no se responde:** proveedores que solo entregan factura no pueden recibirse.
- **Bloquea:** PRM-CMP-035, RF-CMP-061.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-04 — Tolerancias del control de 3 vías
- **Pregunta:** ¿Qué tolerancias de cantidad y precio se aceptan?
- **Contexto:** AGR-027 exige excepciones; ProCoop solo controla totales (P2057).
- **Opciones:** A) (Recomendada) Cantidad 0 %, precio ±2 % con tope ARS 1.000, configurable por tenant y categoría. B) Sin tolerancias. C) Tolerancias por proveedor.
- **Impacto si no se responde:** demasiadas excepciones o pagos no conciliados.
- **Bloquea:** RF-CMP-090, PRM-CMP-043/082/083.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-05 — Portal de proveedores
- **Pregunta:** ¿Cómo acceden los proveedores?
- **Contexto:** ProCoop usa contraseña genérica (CTR-CMP-15).
- **Opciones:** A) (Recomendada) Invitación individual con rol `supplier` en Landing-autogestión (T02). B) Enlace con OTP por documento. C) Sin portal, solo mail.
- **Impacto si no se responde:** no se implementa la carga web de comprobantes.
- **Bloquea:** RF-CMP-015, RF-CMP-112, CU-CMP-02.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-06 — Ajuste manual de retenciones (P2836)
- **Pregunta:** ¿Se permite modificar manualmente una retención calculada?
- **Opciones:** A) (Recomendada) Sí, con capability, motivo y aprobación, conservando el valor calculado. B) Nunca. C) Libre, como en ProCoop.
- **Contexto:** hay casos de certificados de exclusión no cargados a tiempo.
- **Impacto si no se responde:** OP bloqueadas o retenciones incorrectas sin auditoría.
- **Bloquea:** RF-CMP-103, PRM-CMP-110.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-07 — Compras sin OC
- **Pregunta:** ¿Qué compras pueden registrarse sin OC?
- **Contexto:** RN-08 §7.1 admite cualquier factura directa; AGR-027 pide tratamiento explícito.
- **Opciones:** A) (Recomendada) Solo categorías definidas (servicios públicos, impuestos y tasas, caja chica, montos menores a umbral), con aprobación posterior. B) Ninguna. C) Todas con advertencia.
- **Impacto si no se responde:** el control de 3 vías no se aplica o bloquea gastos recurrentes.
- **Bloquea:** RF-CMP-093, PRM-CMP-085.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-08 — Habilitación parcial de lo conciliado
- **Pregunta:** Con excepción abierta en parte de la factura, ¿se habilita para pago lo conciliado o se bloquea todo?
- **Contexto:** AGR-027 ("no se paga como si se hubieran recibido todos").
- **Opciones:** A) (Recomendada) Habilitar solo el importe conciliado. B) Bloquear toda la factura. C) Decide el autorizador caso a caso.
- **Impacto si no se responde:** demoras de pago o pago de lo no recibido.
- **Bloquea:** RN-CMP-045, PRM-CMP-084.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-09 — Compromisos y control presupuestario (AGR-028)
- **Pregunta:** ¿El compromiso de la OC solo se informa o bloquea si excede presupuesto?
- **Opciones:** A) (Recomendada) Eventos de compromiso en O8 (comprometido/devengado/pagado); control presupuestario bloqueante como Extensión de M15. B) Bloqueo desde O8. C) Sin compromisos.
- **Contexto:** AGR-028 pide distinguir comprometido, devengado y pagado.
- **Impacto si no se responde:** la proyección de M14 queda incompleta.
- **Bloquea:** RF-CMP-057, REP-CMP-10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-10 — Mis Comprobantes
- **Pregunta:** ¿Los comprobantes importados de ARCA pueden registrarse automáticamente?
- **Opciones:** A) (Recomendada) Solo borradores con revisión humana. B) Registro automático si el proveedor tiene concepto por defecto. C) Solo informe.
- **Contexto:** faltan imputación, servicio y vínculo con OC.
- **Impacto si no se responde:** se pierde la automatización o se registran comprobantes mal imputados.
- **Bloquea:** RF-CMP-120/121, CU-CMP-03.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-11 — Lectura de facturas con IA
- **Pregunta:** ¿Se habilita la IA y bajo qué condiciones?
- **Opciones:** A) (Recomendada) Opt-in por tenant con acuerdo de tratamiento de datos, en O11, siempre con confirmación humana. B) Habilitada por defecto. C) No incluir.
- **Contexto:** FIC 20 muestra uso con proveedor externo y auditoría `AUDIT_IA`.
- **Impacto si no se responde:** riesgo de datos o funcionalidad sin definir.
- **Bloquea:** RF-CMP-130/131, CU-CMP-04.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-12 — Adelantos y pagos de sueldos
- **Pregunta:** ¿Los adelantos de sueldo y pagos de recibos siguen saliendo de la OP de compras?
- **Opciones:** A) (Recomendada) Mover a M16; M12 solo ejecuta OP cuando M16 envía un lote aprobado. B) Mantener en M12. C) Mixto por tenant.
- **Contexto:** RN-08 §4.2/§4.4 (CTR-CMP-19).
- **Impacto si no se responde:** novedades de sueldo sin control de M16.
- **Bloquea:** RF-CMP-086, RF-CMP-109/110.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-13 — Concursos y licitaciones
- **Pregunta:** ¿En qué ola y nivel se incluyen?
- **Opciones:** A) (Recomendada) O8, nivel Estándar, con sobre cerrado y acta. B) Extensión posterior. C) Solo concurso de precios por mail.
- **Contexto:** RN-08 §7.3 muestra carátula, acta y planilla de adjudicación.
- **Impacto si no se responde:** compras de monto alto sin procedimiento formal.
- **Bloquea:** RF-CMP-044, CU-CMP-05.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-14 — Compras compartidas entre servicios
- **Pregunta:** ¿La distribución por servicio es obligatoria?
- **Opciones:** A) (Recomendada) Obligatoria cuando la línea abastece más de un servicio, por porcentaje o cantidad, sumando 100 %. B) Opcional. C) Siempre un solo servicio.
- **Contexto:** BASE §78 OPE-001 y §80.
- **Impacto si no se responde:** costos por servicio duplicados o sin asignar.
- **Bloquea:** RF-CMP-051, PRM-CMP-031, ESC-CMP-15.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-15 — Habilitación de pago (P2201/P2457)
- **Pregunta:** ¿Cómo se habilita una factura para pago?
- **Opciones:** A) (Recomendada) Automática por conciliación sin excepciones; manual con capability y bandas T11. B) Siempre manual. C) Automática hasta monto.
- **Contexto:** ProCoop permite autorizar sin verificar permisos.
- **Impacto si no se responde:** pagos sin control o cuello de botella.
- **Bloquea:** RF-CMP-092, PRM-CMP-080/081.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CMP-16 — Residuales del 05-11-2026 (estados, referencias y nombres de campo)
- **Pregunta:** ¿Cómo se cierran los residuales de M12 que detectaron los entregables regenerados?
- **Opciones:** A) (Recomendada) §8.8 con estados iniciales y transiciones de `supplierAdvances`, `supplyBalances`, `signalRightsContracts` (`draft`, `active`, `ended`) y `signalRightsSettlements`; destinos o "no es referencia" en cada campo del §7.13; facturas y recepciones de compra apuntan a `supplierInvoices` y `supplierReceipts` (antes `invoices` de M05 y `receipts` de M07); `legalEntityId` y `personId` de T05. B) Mantener el texto y resolver en los entregables.
- **Contexto:** el índice de estados marcó máquinas sin estado inicial, valores sin transiciones y el `cancelled` del evento de selección sin origen; el modelo entidad-relación dejó referencias sin destino y algunas apuntaban a colecciones de venta o cobranza.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.10, §7.13, §8.
- **Estado:** Asumida la recomendada (DEC-072). `packageIds` → `serviceProducts` (M02, COL-CAT-05; antes `servicePlans`, confirmado por M02 PA-CAT-23 el 5-11-2026); T05 COL-CMP-23 todavía dice que M12 nombra `declarationFileId`, pero este anexo ya usa `declarationStoredFileId`.
- **Sincronización (5-11-2026), Asumida (DEC-072):** M12 cita el servicio interno de M06 `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`; M06 §11.1, PA-FIS-22).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-01 — Regla de imputación por defecto
- **Pregunta**: ¿Cómo se distribuye un pago que no cubre todas las obligaciones seleccionadas o que llega sin selección?
- **Contexto**: ProCoop imputa por comprobante y no reparte (RN-05 §3.4); BASE §103 exige saldo por servicio.
- **Opciones**: A) **(Recomendada)** Por antigüedad (primer vencimiento) con recargos primero, y elección del socio/cajero cuando la hay. B) Por prioridad de servicio configurada. C) Proporcional entre servicios.
- **Impacto si no se responde**: se aplica A; cambios posteriores requieren nueva versión de política.
- **Bloquea**: RF-COB-032, RN-COB-024 (motor RF-COB-031..042), O5.
- **Estado**: Respondida (DEC-048): opción A, por antigüedad con recargos e intereses primero, respetando la elección explícita del socio o del cajero.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-02 — Cuentas unificadas múltiples por titular
- **Pregunta**: ¿Un titular puede tener más de una cuenta corriente unificada?
- **Contexto**: grupos de facturación (FAC-006) y titulares con domicilios distintos.
- **Opciones**: A) **(Recomendada)** Una por grupo de facturación. B) Una única por titular. C) Libre.
- **Impacto si no se responde**: A.
- **Bloquea**: RN-COB-015, RF-COB-021..025.
- **Estado**: Avance (DEC-087): la cuenta corriente es por titular **y por entidad jurídica**; dentro de cada entidad sigue rigiendo la opción A (una por grupo de facturación) hasta que se responda. Ver RF-COB-192 y RN-COB-151.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-03 — Créditos entre servicios en cuenta unificada
- **Pregunta**: ¿Un saldo a favor de un servicio puede cancelar deuda de otro automáticamente?
- **Contexto**: BASE §68 vs. FAC-008 (CTR-COB-14).
- **Opciones**: A) **(Recomendada)** Automático solo en el mismo servicio; entre servicios con elección del socio o autorización. B) Siempre automático. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-038, RN-COB-031.
- **Estado**: Respondida (DEC-049): opción A, automático solo dentro del mismo servicio; entre servicios, con elección del socio o autorización. Nunca entre entidades jurídicas distintas (DEC-087).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-04 — Tratamiento de excedentes
- **Pregunta**: ¿Qué hacer con el importe que excede lo adeudado?
- **Opciones**: A) **(Recomendada)** Saldo a favor en la misma cuenta, aplicable a las próximas facturas. B) Pendiente de aplicación manual. C) Devolución automática.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-044, RN-COB-030.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-05 — Diferencia entre importe pagado y esperado
- **Pregunta**: ¿Qué hacer cuando un ente o pasarela informa un importe distinto del esperado?
- **Contexto**: CTR-COB-12.
- **Opciones**: A) **(Recomendada)** Aceptar, imputar y enviar la diferencia a revisión. B) Rechazar a no identificados. C) Aceptar sin revisión dentro de tolerancia y rechazar fuera.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-148, RN-COB-116.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-06 — Significado del mínimo de pago
- **Pregunta**: ¿El mínimo de pago evita intereses o solo es umbral para la evaluación de mora?
- **Contexto**: CTA-003, CU-CTA-01.
- **Opciones**: A) **(Recomendada)** Umbral para la evaluación de mora (no cancela ni evita intereses). B) Pago mínimo tipo tarjeta (evita suspensión e intereses sobre lo pagado). C) No usar mínimo.
- **Impacto si no se responde**: A; M08 lo consume.
- **Bloquea**: RF-COB-028, RF-COB-029, RN-COB-017.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-07 — Pago parcial en caja
- **Pregunta**: ¿Se permiten entregas parciales y en qué canales?
- **Opciones**: A) **(Recomendada)** En caja con permiso `cob.caja.cobrarParcial`; en entes según configuración del ente. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-035.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-08 — Arqueo de todos los medios
- **Pregunta**: ¿El cierre declara solo efectivo o todos los medios?
- **Contexto**: CTR-COB-05.
- **Opciones**: A) **(Recomendada)** Declaración por medio (efectivo, cheques, cupones, retenciones). B) Solo efectivo, el resto se controla en tesorería.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-080, RN-COB-064.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-09 — Identificador publicado y resolutor LAG en transición
- **Pregunta**: ¿Qué identificador se publica a Red Link/SIRO para facturas nuevas y cómo se resuelven las emitidas por ProCoop?
- **Contexto**: RN-11 §1.1; CTR-COB-07.
- **Opciones**: A) **(Recomendada)** Identificador autocontenido nuevo + resolutor por alias hasta vencer las facturas ProCoop. B) Mantener el identificador LAG actual indefinidamente. C) Corte duro sin convivencia.
- **Impacto si no se responde**: no se pueden migrar cooperativas que publican con el identificador Red Link de la base relevada LAG.
- **Bloquea**: RF-COB-184, RF-COB-186, RN-COB-144..147, O11.
- **Estado**: Respondida (DEC-050): opción A, identificador nuevo autocontenido y resolución por clave ProCoop hasta que venzan sus facturas.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-10 — Registración bancaria de rendiciones
- **Pregunta**: ¿Cómo se informa a tesorería la acreditación esperada?
- **Opciones**: A) **(Recomendada)** Por fecha de acreditación. B) Por recibo. C) Por caja/rendición.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-171, RN-COB-095, M14.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-11 — Cargos en contracargos
- **Pregunta**: ¿Se cobran interés diario y comisión de reversión al socio?
- **Opciones**: A) **(Recomendada)** Configurable, desactivado por defecto. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-159, RN-COB-133.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-12 — Devoluciones por API
- **Pregunta**: ¿Las devoluciones se ejecutan por la pasarela o por tesorería?
- **Opciones**: A) **(Recomendada)** Expediente en COB; ejecución por el proveedor solo si declara la capacidad, si no orden a M14. B) Siempre por M14. C) Siempre por el proveedor.
- **Impacto si no se responde**: A.
- **Bloquea**: RN-COB-132.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-13 — Pasarelas prioritarias en O5
- **Pregunta**: ¿Qué conectores entran en la primera ola?
- **Opciones**: A) **(Recomendada)** SIRO + Red Link + Pagos360 + Mercado Pago. B) Solo los que use la cooperativa piloto. C) Todos.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-132, planificación O5/O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-14 — Cobranza offline de cobradores
- **Pregunta**: ¿Qué medios acepta un cobrador sin conexión?
- **Opciones**: A) **(Recomendada)** Efectivo y transferencia informada, con límite de efectivo por cobrador. B) Solo efectivo. C) Todos, incluido QR diferido.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-092.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-15 — Adelantar venta prepaga para la cooperativa piloto de migración
- **Pregunta**: ¿Se adelanta la venta prepaga si la cooperativa piloto de migración vende prepago?
- **Contexto**: CTR-COB-21.
- **Opciones**: A) **(Recomendada)** COB deja el punto de cobro genérico en O5 y M03 adelanta solo el subconjunto prepago. B) Mantener prepaga en ProCoop durante la convivencia. C) Adelantar todo M03.
- **Impacto si no se responde**: riesgo para la primera migración.
- **Bloquea**: RF-COB-075, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-16 — Código de barras SIRO para importes ≥ ARS 100.000
- **Pregunta**: ¿Qué formato se usa cuando el código 0447 de 56 dígitos no alcanza?
- **Contexto**: RN-11 §1.3; RN-COB-148.
- **Opciones**: A) **(Recomendada)** Acordar con Banco Roela el formato extendido (0448/0449); mientras tanto, código electrónico y QR. B) Partir el pago en dos cupones. C) No publicar código de barras.
- **Impacto si no se responde**: facturas grandes sin código de barras.
- **Bloquea**: RF-COB-187, RN-COB-148.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-17 — Traslado de comisión al socio
- **Pregunta**: ¿Se traslada al socio la comisión del ente o de la pasarela?
- **Opciones**: A) **(Recomendada)** No trasladar por defecto; configurable por canal con concepto facturado. B) Trasladar siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-114, PRM-COB-142.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-18 — Frecuencia y distribución del resumen de cuenta
- **Pregunta**: ¿Cada cuánto y por qué canal se emite el resumen de la cuenta corriente?
- **Opciones**: A) **(Recomendada)** Mensual por grupo de facturación al cierre del ciclo, por los canales del grupo. B) Solo a demanda. C) Con cada factura.
- **Impacto si no se responde**: A.
- **Bloquea**: PRM-COB-013, JOB-COB-11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-19 — Estados de colecciones sin máquina de estados (pendiente 8 del cierre)
- **Pregunta**: ¿Se define una máquina de estados para `collectorSettlements`, `gatewayTransactions`, `thirdPartyCollections` y `externalObligationImports` (M07), las cuotas `agreementInstallments` (M08), `crmCalendarEvents` (M09), `technicalProcedures` (M10), `fixedAssetValueChanges` y `mrpRuns` (M13), o se declaran sin máquina?
- **Contexto**: la corrección de inconsistencias encontró estas colecciones con campo `status` sin valores ni transiciones; `agreementInstallments` tenía valores sin transiciones.
- **Opciones**: A) **(Recomendada)** Definir una máquina por colección (estados y tabla de transiciones con evento) en el anexo dueño según T05. B) Declararlas sin máquina (estado informativo libre).
- **Impacto si no se responde**: A.
- **Bloquea**: §8 de M07, M08, M09, M10 y M13; valores de `status` en T05.
- **Estado**: Asumida (DEC-072): opción A. Máquinas definidas en §8.17 de este anexo (cuatro colecciones de M07), §8.14 de M08 (`agreementInstallments`) y §8.13 de M09 (`crmCalendarEvents`). M10 (`technicalProcedures`) y M13 (`fixedAssetValueChanges`, `mrpRuns`) deben definir las suyas y citar esta PA.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-20 — Colección `collectionAccountingGroups` (cierre, cuarta ronda)
- **Pregunta**: M15 (RN-CON-028, §7.39) nombra `collectionAccountingGroups` con dueño M07, y `accounts.accountingGroupId` (M01, PA-PER-17) apunta a los grupos contables, pero M07 no declaraba la colección. ¿M07 la declara y dónde viven las cuentas del grupo?
- **Contexto**: en ProCoop, `GRU_CON` guarda el grupo con sus columnas de cuenta (`CTA_COBF`, `CTA_COBR`, `CTA_CAJ`, etc.). M15 §7.39 centraliza las cuentas asignadas a entidades de otros módulos en `entityAccountAssignments`.
- **Opciones**: A) **(Recomendada)** M07 declara `collectionAccountingGroups` (`code`, `name`, `status` `active`/`inactive`) en la ola O5, sin cuentas; las cuentas van en `entityAccountAssignments` de M15 con `entityType = collectionAccountingGroup`. B) Declarar el grupo con las cuentas embebidas en M07.
- **Impacto si no se responde**: A.
- **Bloquea**: M15 RN-CON-028; M01 `accounts.accountingGroupId`; T05 §7.2.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.36 y §8.18; M01 cita el destino. T05 debe agregar `collectionAccountingGroups` (M07) y la referencia de `accountingGroupId`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COB-21 — Residuales de los entregables: referencias, nombres canónicos y estados (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección (`closeGroupId`, `settlementId`, `surchargeProductId`, `deviceIds`, `importLayoutId`, `controlLayoutId`, `reusedFromId`, `billingTypeId`, `productIds`; `externalQrId` y `externalPaymentId` con tipo `ObjectId`), qué nombres se adoptan (`cashSessionId`, `gatewayTransactionId`, `directDebitBatchId`, `gatewayConnectorId`) y qué valores y transiciones tienen `collectors.status`, `gatewayConnectors.status` y las colecciones con estados sin transiciones o sin estado inicial explícito?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M07-COB-cuenta-corriente-cobranza.md` §7 y de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 08).
- **Opciones**: A) **(Recomendada)** Destinos de §7.37 (T05 §7.2.1 cuando existe; `fileLayouts` de T06 para los layouts de entes, como dice §7.20; `voucherTypes` para `billingTypeId`, ex `COD_TPFC`; `closeGroupId`, `externalQrId` y `externalPaymentId` no son referencias), nombres canónicos con alias "antes" y máquinas de §8.19 (`collectors` y `gatewayConnectors` con `active`, `suspended`, `inactive`). B) Mantener `[VERIFICAR]` hasta revisar con la cooperativa.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER de M07; diagramas de estados de M07; T05 §7.2.1 y COL-COB-11, 21, 34.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.35 (filas corregidas con "antes"), §7.37 y §8.19. T05 debe reflejar: `cashSessionId` en COL-COB-11 (antes `sessionId`), los tres campos de layout en COL-COB-21 en lugar de `fileLayoutIds[]`, y en §7.2.1 `closeGroupId`, `externalQrId` y `externalPaymentId` como "no es referencia", `deviceIds` (M07 `collectors`) → `fieldDevices`, `productIds`/`surchargeProductId` (M07) → `serviceProducts`, `billingTypeId` (M07) → `voucherTypes`. También se cierran con los destinos de T05 §7.2.1 `gatewayConnectors.connectionId` (→ T06 `integrationConnections`), `thirdPartyBillers.productId` (→ M02 `serviceProducts`) y `collectionReportSchemes.taxIds` (→ M06 `taxDefinitions`).
- **Eventos de solicitud para T06 (5-11-2026)**: Asumida (DEC-072): M07 declara en §12.1 EVT-COB-28 `cob.paymentIntent.requested` (antes `cob.payment-intent.requested`), EVT-COB-29 `cob.debtPublication.requested` (antes `cob.debt-publication.requested`) y EVT-COB-30 `cob.directDebit.batchRequested` (antes `cob.direct-debit.batch-requested`), que T06 §12 consumía sin que M07 los publicara; payload mínimo con `paymentIntentId`, `agencyDebtExportId` y `directDebitBatchId`; consumidor T06. T11 §12.4 registra los alias.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-01 — Comentarios de socios habilitados por defecto
- **Pregunta:** ¿Los comentarios de socios en el muro arrancan deshabilitados y cada cooperativa los habilita?
- **Contexto:** DEC-008 permite comentar con moderación “habilitable por tenant y por publicación”, pero no fija el valor inicial. Comentarios abiertos exigen moderadores disponibles.
- **Opciones:**
  - A) Deshabilitados por defecto; el tenant los habilita y cada publicación decide **(Recomendada)** — arranque seguro; la cooperativa abre cuando tiene moderadores.
  - B) Habilitados por defecto en todas las publicaciones — más participación desde el día 1, mayor carga de moderación.
  - C) Habilitados solo en tipos `noticia`, `evento` y `beneficio` — intermedio, menos flexible.
- **Impacto si no se responde:** se asume A (PRM-COM-001 = false).
- **Bloquea:** RF-COM-032, PRM-COM-001; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-02 — Modo de moderación por defecto
- **Pregunta:** ¿Qué modo de moderación usan los comentarios cuando el tenant los habilita?
- **Contexto:** `pre` garantiza control pero demora la conversación; `post` es inmediato pero expone contenido ofensivo.
- **Opciones:**
  - A) `ai_assisted`: publica si el riesgo es bajo, el resto a revisión humana **(Recomendada)** — equilibrio entre fluidez y control; sin IA se comporta como `pre`.
  - B) `pre`: todo comentario pasa por un moderador — máximo control, mucha carga.
  - C) `post`: publica todo y se revisa después — riesgo reputacional.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-COM-040, PRM-COM-003; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-03 — Uso de IA externa en comunidad
- **Pregunta:** ¿La IA (moderación, borradores, copy, inteligencia de encuestas) queda apagada hasta que cada cooperativa la acepte?
- **Contexto:** El análisis envía texto de socios a un proveedor de IA (T06). DEC-056 fijó para atención “apagada hasta aceptación del tenant”; no hay decisión específica para comunidad.
- **Opciones:**
  - A) Apagada hasta aceptación expresa del tenant, con datos mínimos y sin entrenamiento **(Recomendada)** — coherente con DEC-056; mientras tanto reglas + humano.
  - B) Encendida por defecto con posibilidad de apagar — mejor experiencia inicial, riesgo de privacidad.
  - C) Sin IA en O2; solo reglas automáticas — más simple, más carga humana.
- **Impacto si no se responde:** se asume A (PRM-COM-010 = false hasta aceptación).
- **Bloquea:** RF-COM-021, 042, 052, 090, 194; O2/O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-04 — Quién contrata y paga la mensajería
- **Pregunta:** ¿Los costos de SMS, WhatsApp y email los paga cada cooperativa a su proveedor o CoopApps los revende con consumo medido?
- **Contexto:** RN-10 §5 muestra que en ProCoop el costo quedaba detrás del proveedor. Afecta conectores, licencias (T01) y tableros de consumo.
- **Opciones:**
  - A) Ambos modelos: conector propio del tenant o proveedor de plataforma con reventa y consumo medido **(Recomendada)** — flexibilidad para cooperativas grandes y chicas.
  - B) Solo proveedor de plataforma con reventa — operación simple, menos autonomía.
  - C) Solo conector propio del tenant — sin riesgo comercial para la plataforma, más fricción de alta.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-COM-154, PRM-COM-066/067, T01 consumo; O2.
- **Estado:** Respondida (DEC-077): opción A; el consumo medido del proveedor de plataforma se factura como complemento del pack (DEC-065, T01).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-05 — Evidencia mínima de intimaciones y constancias reguladas
- **Pregunta:** ¿Qué estado de entrega considera cumplida una intimación o constancia regulada?
- **Contexto:** AGR-024 exige no confundir “aceptado por el proveedor” con “entregado”. M08 define la evidencia por instancia, pero hace falta un default.
- **Opciones:**
  - A) Lo define M08 por instancia y servicio; default `delivered` en canales digitales y acuse físico en carta **(Recomendada)** — trazable y flexible.
  - B) Alcanza con `accepted` del proveedor — más simple, jurídicamente débil.
  - C) Siempre acuse físico — máxima solidez, costo y demora altos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-COM-182, RN-COM-046; O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-06 — Horario de no molestar
- **Pregunta:** ¿Cuál es la franja de no molestar por defecto para comunicaciones no urgentes?
- **Contexto:** CNX y `RESPONSA_NOTIFICA` usan franjas; no hay valor definido para socios.
- **Opciones:**
  - A) 21:00 a 08:30 todos los días y feriados, para `community`, `marketing` y `operational` no urgentes; exentas `security`, `service_outage` urgentes y `regulatory` con plazo **(Recomendada)**.
  - B) Sin restricción horaria — riesgo de quejas.
  - C) Solo días hábiles de 09:00 a 18:00 — muy restrictivo para recordatorios.
- **Impacto si no se responde:** se asume A (PRM-COM-027/028).
- **Bloquea:** RF-COM-143, RN-COM-054; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-07 — Consentimiento para comunicaciones comerciales y comunitarias
- **Pregunta:** ¿Las comunicaciones `marketing` y `community` por SMS, WhatsApp y email requieren opt-in explícito?
- **Contexto:** ProCoop no registra consentimientos; la migración no permite presumirlos. Afecta el alcance real de campañas.
- **Opciones:**
  - A) Opt-in explícito para `marketing`/`community` por SMS, WhatsApp y email; in-app y push `community` activados; transaccionales con al menos un canal activo; `security`/`regulatory` no desactivables **(Recomendada)** — cumplimiento de privacidad y reputación de remitente.
  - B) Opt-out: todo activo hasta que el socio se dé de baja — mayor alcance, mayor riesgo legal y de bloqueo de WhatsApp.
  - C) Como A, pero email comunitario en opt-out — intermedio.
- **Impacto si no se responde:** se asume A (PRM-COM-059 = true).
- **Bloquea:** RF-COM-171, RF-COM-190, migración §19; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-08 — Elector en votaciones rápidas y consultas
- **Pregunta:** ¿Quién vota (y cuántas veces) en votaciones y consultas no vinculantes?
- **Contexto:** Una persona puede tener varias cuentas y usuarios autorizados; la consulta previa a asamblea debería reflejar a los asociados.
- **Opciones:**
  - A) Un voto por asociado activo (persona asociada del padrón de M17) por defecto, configurable por encuesta **(Recomendada)**.
  - B) Un voto por cuenta/suministro — sobrerrepresenta a quien tiene más cuentas.
  - C) Un voto por usuario registrado — incluye no asociados.
- **Impacto si no se responde:** se asume A (PRM-COM-043 = `member`).
- **Bloquea:** RF-COM-088, 089; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-09 — Validación de canjes por comercios adheridos
- **Pregunta:** ¿Cómo validan los canjes los comercios que no son usuarios del sistema?
- **Contexto:** Los beneficios suelen darse en comercios de la localidad sin acceso a CoopApps.
- **Opciones:**
  - A) Link tokenizado por comercio (sin usuario) más opción de usuarios validadores internos **(Recomendada)** — simple para el comercio, auditable.
  - B) Solo usuarios internos de la cooperativa validan — control total, poco práctico.
  - C) Usuario del sistema para cada comercio — más gestión de identidades.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-COM-105, PAN-COM-16, API-COM-61; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-10 — Publicaciones y encuestas de supervisores a su equipo
- **Pregunta:** ¿Los supervisores pueden publicar avisos y encuestas rápidas a su equipo desde la PWA del empleado?
- **Contexto:** CNX lo ofrece; DEC-008 habla de “empleados autorizados”. Útil para cuadrillas.
- **Opciones:**
  - A) Habilitable por tenant, apagado por defecto, audiencia limitada a su equipo **(Recomendada)**.
  - B) Siempre habilitado para supervisores — más adopción, menos control editorial.
  - C) No disponible — todo pasa por el editor central.
- **Impacto si no se responde:** se asume A (PRM-COM-073 = false).
- **Bloquea:** RF-COM-019, PAN-COM-52; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-11 — Plazos de retención de comunicaciones y evidencia
- **Pregunta:** ¿Cuánto tiempo se conservan las comunicaciones, las constancias reguladas y la evidencia de moderación?
- **Contexto:** ProCoop purgaba `AUDIT_MAIL`; T01 propone 730 días para el registro de envíos (PRM-PLA-P1-016). Las constancias de intimación pueden necesitarse mientras la deuda sea exigible (DEC-052: prescripción de 2 años para facturas periódicas de servicios y 5 años para el resto; la conservación debe cubrir el plazo más largo configurado más un margen).
- **Opciones:**
  - A) Comunicaciones generales 2 años; comunicaciones con evidencia exigida y constancias de baja 5 años; evidencia de moderación 2 años; anonimización al vencer; si una regla de prescripción del tenant supera 5 años, la evidencia regulada se conserva hasta ese plazo **(Recomendada)** — alineado con DEC-052.
  - B) Todo 5 años — más almacenamiento y datos personales retenidos.
  - C) Todo 1 año con archivo externo — riesgo probatorio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-COM-008, RN-COM-042, PRM-COM-015/051/052, JOB-COM-19; O2/O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-12 — Sanciones de comunidad
- **Pregunta:** ¿Se aplican sanciones escalonadas a usuarios que incumplen las reglas de comunidad?
- **Contexto:** AGR-031 pide reglas, denuncias y sanciones; aplicarlas automáticamente puede ser injusto.
- **Opciones:**
  - A) Escalera sugerida por el sistema (advertencia, silencio 7 días, suspensión 30 días, bloqueo), aplicada por una persona; bloqueo permanente solo por el responsable de comunidad; apelación **(Recomendada)**.
  - B) Aplicación automática al confirmar la infracción — rápido, riesgo de errores.
  - C) Sin sanciones; solo ocultar comentarios — insuficiente ante reincidentes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-COM-048, 049, RN-COM-006; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-13 — Proveedor SMS de referencia
- **Pregunta:** ¿Qué proveedor de SMS se toma como referencia para la primera implementación?
- **Contexto:** PA-CFG-P4-01 recomienda solo proveedores por API (sin módem). ProCoop usaba un gateway propio del proveedor y tenía soporte para Amazon SNS (V2 3018). Los agregadores locales suelen ofrecer remitente y reportes de entrega más confiables en Argentina.
- **Opciones:**
  - A) Un agregador local con API REST y reportes de entrega como referencia, y Amazon SNS como alternativa configurable **(Recomendada)** — mejor entregabilidad local y continuidad con V2 3018.
  - B) Solo Amazon SNS — un único proveedor de nube, entregabilidad variable.
  - C) Sin referencia; cada tenant integra su proveedor — más trabajo de conectores.
- **Impacto si no se responde:** se asume A; depende de PA-CFG-P4-01 (se asume A: sin módem).
- **Bloquea:** RF-COM-130 (canal SMS), RN-COM-023, PRM-COM-037; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-14 — Envío manual “abrir chat” de WhatsApp
- **Pregunta:** ¿Se permite que un operador abra un chat de WhatsApp desde la ficha (click-to-chat) fuera de la API oficial?
- **Contexto:** ProCoop abría `api.whatsapp.com` desde la ficha. DEC-055 fija la API oficial (Meta Cloud) con adaptador Trii para los envíos del sistema, pero el uso manual no tiene constancia de entrega.
- **Opciones:**
  - A) Permitido desde la ficha, registrando la acción como `manual_external` sin constancia, configurable por tenant **(Recomendada)** — continuidad operativa con trazabilidad mínima.
  - B) Prohibido; solo envíos por API — trazabilidad total, menos flexibilidad en mostrador.
  - C) Permitido sin registro — sin trazabilidad.
- **Impacto si no se responde:** se asume A (PRM-COM-074 = true).
- **Bloquea:** RN-COM-026, PAN-COM-30; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-15 — Mensajes impresos en factura
- **Pregunta:** ¿Quién gestiona los mensajes segmentados que se imprimen en la factura y con qué espacio?
- **Contexto:** DFA M8 y CNX §7.7 (QR en factura) piden mensajes por segmento; el espacio depende del diseño de factura de M05.
- **Opciones:**
  - A) T09 gestiona mensajes segmentados con aprobación y M05 los resuelve por comprobante; espacio fijo por área según el diseño de factura del tenant **(Recomendada)**.
  - B) M05 gestiona leyendas fijas por ciclo sin segmentación — simple, menos útil.
  - C) Un único mensaje general por período — mínimo.
- **Impacto si no se responde:** se asume A (PRM-COM-047).
- **Bloquea:** RF-COM-195, P-COM-09, API-COM-78; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-16 — Publicación automática de cortes no programados
- **Pregunta:** ¿Los cortes no programados detectados por técnica (equipo de red caído) o por un incidente zonal se publican automáticamente a los afectados?
- **Contexto:** EVT-TEC-24 y EVT-CRM-16 permiten avisar en minutos, pero una detección errónea genera alarma innecesaria.
- **Opciones:**
  - A) Borrador automático con plantilla rápida y publicación por un operador (un clic); publicación automática habilitable por tenant y servicio **(Recomendada)**.
  - B) Siempre automática — máxima rapidez, riesgo de falsos positivos.
  - C) Siempre manual desde cero — lento.
- **Impacto si no se responde:** se asume A (PRM-COM-063 = false).
- **Bloquea:** RF-COM-160, 161, P-COM-08; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-17 — Estados de los avisos de plataforma
- **Pregunta:** ¿Qué estados tiene un aviso de plataforma (`platformNotices.status`)?
- **Contexto:** §7.10 declaraba `status` como enum sin valores; §8.0 y §8.13.1 proponían `draft`, `published`, `expired`, `withdrawn`. La alternativa era reutilizar los estados de ciclo de T01. Pregunta 1 del pendiente de cierre (grupo T02 y T09).
- **Opciones:**
  - A) Ciclo propio `draft` → `published` → `expired`, con `withdrawn` desde `draft` o `published` **(Recomendada)** — refleja la vigencia (`startsAt`, `endsAt`, permanencia) y el retiro manual.
  - B) Reutilizar los estados de T01 — un solo vocabulario, pero T01 no modela vigencia ni retiro de avisos.
- **Impacto si no se responde:** se asume A.
- **Estado:** Asumida la recomendada (DEC-072): opción A, aplicada en §7.10, §8.0 y §8.13.1.
- **Bloquea:** RF-COM-204, EVT-COM-38, PAN-COM-33; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-18 — Tipo de comunicación en plantillas de campaña y de texto libre
- **Pregunta:** ¿`messageTemplates.communicationTypeId` es obligatorio también en las plantillas de campaña y de texto libre?
- **Contexto:** ProCoop usaba los valores `campaign` y `free` en el tipo de plantilla. §7.7 declaraba el campo obligatorio pero dejaba esas plantillas "sin tipo" [VERIFICAR], lo que rompía el índice único `{tenantId, communicationTypeId, channel, locale}` y la referencia a `communicationTypes`. Pregunta 2 del pendiente de cierre (grupo T02 y T09).
- **Opciones:**
  - A) Obligatorio; esas plantillas usan un tipo genérico "Campaña" (`com.campaign.generic`) precargado por plataforma, y el motor aplica la finalidad efectiva de la campaña o del envío **(Recomendada)** — integridad referencial e índice único sin excepciones.
  - B) Opcional para campañas y texto libre — menos filas de catálogo, pero el índice y las reglas de consentimiento necesitan casos especiales.
- **Impacto si no se responde:** se asume A.
- **Estado:** Asumida la recomendada (DEC-072): opción A, aplicada en §7.7 (`messageTemplates.communicationTypeId` y tipo genérico de `communicationTypes`).
- **Bloquea:** RF-COM-131, RF-COM-190 a 194, PAN-COM-19, PAN-COM-22, PAN-COM-30; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-COM-19 — Cierre de residuales: carga rápida de reclamos por SMS, destinos de referencia y estados
- **Pregunta:** ¿qué habilita la carga rápida de reclamos por SMS entrante si no tiene parámetro V2, a qué apuntan las referencias que seguían marcadas [VERIFICAR] y cómo se completan las máquinas de estado de §8?
- **Contexto:** §9.11, el reparto de responsabilidades (§1) y CTR-COM-21 dejaban "[VERIFICAR en RN-07]": V2 2812 es el remitente SMS (PRM-COM-P1-003, PRM-COM-025), no la carga rápida. Seguían marcadas [VERIFICAR] `surveyResponses.fieldAssignmentId` y `posts.categoryIds[]`; `platformNotices.targetTenants` y `senderIdentities.senderId` no declaraban destino; `newsletterRecipients.deliveryStatus` no listaba valores y la bandeja, la supresión, las versiones de plantilla, la aprobación WhatsApp y las filas de lista importada no tenían tabla de transiciones. Cierre de residuales del 5-11-2026 (`_trabajo/residuales-instrucciones.md`, categorías 1, 2, 5 y 6).
- **Opciones:**
  - A) La carga rápida no tiene parámetro V2: la habilita un canal `crmChannels` de M09 con `kind = sms` activo; `fieldAssignmentId` → `workOrders` de M10; `categoryIds[]` → `postCategories`; `targetTenants` → `tenants` de T01; `senderId` no es referencia; valores y tablas de estado completos en §8 **(Recomendada)**.
  - B) Crear un parámetro PRM-COM nuevo para la carga rápida — duplica la configuración del canal de M09, que es el dueño del reclamo.
- **Impacto si no se responde:** se asume A.
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026 en §1, RF-COM-156, §7 (`posts`, `newsletterRecipients`, `surveyResponses`, `communicationTypes`, `senderIdentities`, `platformNotices`), §8.0, §8.6, §8.6.1, §8.8.2, §8.9, §8.9.2, §8.13.2, §9.11 y CTR-COM-21; además API-COM-46, 101, 105, 106 y 112 con `public: true` (RF-IAM-061) y los eventos renombrados por T11 §12.3 (`int.message.inboundReceived`, `int.ai.completionReady`, código `ins.capitalRefund.paid`). Ya no bloquea.
- **Bloquea:** RF-COM-092, RF-COM-156, RF-COM-204; O2.
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** T09 declara en §12.1 EVT-COM-40 `com.message.dispatchRequested` (antes `com.message.dispatch-requested`, nombre que solo figuraba en T06 §12), publicado cuando una comunicación queda `queued` para un canal con conector; payload `communicationId`, `communicationAttemptId`, `channel`, `providerConnectorId`, `idempotencyKey`; consumidor T06. T11 §12.4 registra el alias.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-01 — Modo y granularidad de contabilización

- **Pregunta**: ¿cada módulo contabiliza por operación en tiempo real o por resumen diario?
- **Contexto**: la facturación y la cobranza masivas generan decenas de miles de documentos por mes; ProCoop resume por lote (RN-08 §6.1); BASE §75 exige trazabilidad documento ↔ asiento.
- **Opciones**: A) Todo por operación en tiempo real. B) **(Recomendada)** Tiempo real por operación en ERP administrativo (compras, tesorería, stock, sueldos, capital) y resumen diario por servicio y concepto en facturación y cobranza masivas, con vínculo renglón → documentos. C) Todo por lote como ProCoop.
- **Impacto si no se responde**: se aplica B como default de PRM-CON-014.
- **Bloquea**: RF-CON-002, P-CON-02 (no bloquea el desarrollo).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-02 — Evento sin cuenta configurada

- **Pregunta**: ¿qué pasa con la operación de origen si falta una cuenta?
- **Opciones**: A) **(Recomendada)** No se bloquea el origen; el evento queda pendiente y bloquea el cierre del período. B) Se bloquea la operación de origen. C) Se imputa a una cuenta puente.
- **Impacto si no se responde**: A (PRM-CON-028). **Bloquea**: RN-CON-022, P-CON-01.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-03 — Contabilidad durante el paralelo con ProCoop

- **Contexto**: DEC-009 adelanta el núcleo contable a O5; la nota del DFA prevé el by-pass administrativo el 01-07-2027 con paralelo desde el 01-03-2027.
- **Opciones**: A) **(Recomendada)** La contabilidad oficial sigue en ProCoop hasta el by-pass; CoopApps contabiliza todo en un plan marcado no oficial y concilia contra ProCoop; se oficializa en el by-pass. B) CoopApps es oficial desde O5 y exporta a ProCoop. C) Exportar a un sistema externo del estudio durante el paralelo.
- **Impacto si no se responde**: A. **Bloquea**: plan de corte de T07, CTR-CON-11.
- **Estado**: Respondida (DEC-069): opción A. La contabilidad oficial sigue en ProCoop hasta el corte administrativo; CoopApps contabiliza en un plan marcado no oficial, concilia contra ProCoop y se oficializa en el corte.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-04 — Anulación y eliminación de asientos

- **Opciones**: A) **(Recomendada)** Borradores eliminables; contabilizados de período abierto no transcripto → anulación lógica; resto → contraasiento. B) Solo contraasiento siempre. C) Eliminación física en período abierto (como ProCoop).
- **Impacto si no se responde**: A (PRM-CON-007). **Bloquea**: RN-CON-013, RF-CON-046.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-05 — Más de un plan oficial

- **Opciones**: A) **(Recomendada)** Un plan operativo por ejercicio; los demás analíticos por equivalencias. B) Doble registración oficial en dos planes. C) Plan regulatorio como oficial.
- **Impacto si no se responde**: A. **Bloquea**: RF-CON-103–RF-CON-111.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-06 — Marco normativo de estados contables

- **Opciones**: A) **(Recomendada)** Normas contables profesionales FACPCE aplicables a cooperativas (RT 24 y vigentes [VERIFICAR]) y requisitos INAES, en plantilla versionada validada por el contador. B) Solo formato INAES. C) Plantilla libre por tenant.
- **Impacto si no se responde**: A con plantilla editable (PRM-CON-047). **Bloquea**: RF-CON-112–RF-CON-126 (estados).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-07 — Ajuste por inflación

- **Opciones**: A) **(Recomendada)** Ajuste integral al cierre del ejercicio en CoopApps, con opción mensual. B) Solo mensual. C) No se calcula en CoopApps (lo hace el estudio).
- **Impacto si no se responde**: A (PRM-CON-035). **Bloquea**: RF-CON-127–RF-CON-131.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-08 — Libros rubricados

- **Opciones**: A) **(Recomendada)** Hojas rubricadas en papel y libros digitales cuando el organismo de la jurisdicción lo admita. B) Solo papel. C) Solo digital.
- **Impacto si no se responde**: A con papel por defecto (PRM-CON-048). **Bloquea**: RF-CON-136–RF-CON-138.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-09 — Control presupuestario

- **Opciones**: A) Solo informativo. B) **(Recomendada)** Advertir y exigir autorización para exceder. C) Bloquear.
- **Impacto si no se responde**: B (PRM-CON-041). **Bloquea**: RF-CON-143–RF-CON-149.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-10 — Momento del asiento de cobros en caja

- **Opciones**: A) **(Recomendada)** Al confirmar el pago; el cierre de período exige cajas cerradas. B) Al cerrar la caja (como ProCoop con P3100). C) Al rendir a tesorería.
- **Impacto si no se responde**: A (PRM-CON-025, PRM-CON-024). **Bloquea**: RF-CON-064.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-11 — Provisiones automáticas

- **Opciones**: A) **(Recomendada)** SAC, vacaciones e incobrables automáticos y configurables. B) Solo manuales. C) Solo incobrables.
- **Impacto si no se responde**: A (PRM-CON-037). **Bloquea**: JOB-CON-21.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-12 — Alcance del presupuesto

- **Opciones**: A) **(Recomendada)** Presupuesto económico por cuenta, centro y servicio con compromisos de compras en O8; financiero (flujo de fondos) en una etapa posterior. B) Económico y financiero en O8. C) Solo informes de comparación.
- **Impacto si no se responde**: A (PRM-CON-043). **Bloquea**: RF-CON-143–RF-CON-149.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-13 — Cuentas de orden en el cierre

- **Opciones**: A) **(Recomendada)** Se incluyen en el cierre patrimonial y se reabren en la apertura. B) Deben estar en cero para cerrar (como la validación de ProCoop). C) Se excluyen del cierre.
- **Impacto si no se responde**: A (PRM-CON-012). **Bloquea**: P-CON-05.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-14 — Ingresos devengados no facturados

- **Opciones**: A) **(Recomendada)** Provisión al cierre configurable (desactivada por defecto) con reversión automática. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A (PRM-CON-038). **Bloquea**: M-13.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-15 — Plan y reglas modelo de plataforma

- **Pregunta**: ¿CoopApps ofrece un plan de cuentas y reglas modelo para cooperativas de servicios?
- **Opciones**: A) **(Recomendada)** Sí, plantilla de plataforma validada por un contador, copiada al tenant y luego propia. B) Cada tenant arma su plan. C) Plan único obligatorio para todos.
- **Impacto si no se responde**: A (PRM-CON-058). **Bloquea**: RN-CON-110, precarga de tenants nuevos.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-16 — Servicio obligatorio en cuentas de control

- **Opciones**: A) **(Recomendada)** Obligatorio en créditos por servicios, ingresos y costos directos. B) Opcional. C) Obligatorio en todas las cuentas de resultado.
- **Impacto si no se responde**: A (PRM-CON-059). **Bloquea**: RN-CON-108, conciliación por servicio (RF-CON-093).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-17 — Venta del derecho de sepultura: ingreso del período o diferido (HUECO-CEM-04)

- **Pregunta**: ¿Cómo se reconoce el ingreso por la venta (adquisición) del derecho de sepultura, y cómo el mantenimiento?
- **Contexto**: el derecho se formaliza en M18 (EVT-SOC-05) y se factura por M05 con un concepto del catálogo; la ficha CEM de T12 parte 2 deja sin definir si el ingreso es del período o diferido. El tratamiento de IVA lo define M06 por la clase del concepto; M15 no lo decide. ProCoop no tiene un tratamiento relevado.
- **Opciones**: A) **(Recomendada)** Ingreso del período al otorgar el derecho (M-134); el mantenimiento como ingreso periódico por la facturación general (M-01); IVA según la clase del concepto en M06. Requiere validación con el contador de la cooperativa piloto. B) Ingreso diferido (`rol:burialRightDeferredRevenue`) devengado mensualmente durante la vigencia del derecho (M-135, JOB-CON-23); la extinción anticipada devenga el saldo.
- **Estado**: Asumida la recomendada (DEC-072) salvo respuesta del solicitante. Se implementa como comportamiento configurable: PRM-CON-193 = `atGrant` por defecto; `deferredOverTerm` habilita la opción B sin cambios de código (RN-CON-124).
- **Impacto si no se responde**: A (PRM-CON-193). **Bloquea**: M-134, M-135, RN-CON-124, ficha CEM de T12 parte 2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-18 — Colección del modelo de centro de costo (PA 10 del pendiente de cierre)

- **Pregunta**: ¿`costCenterModelId` (en `accountRoles`, `postingRules` y plantillas de asiento) apunta a una colección propia o es un código?
- **Contexto**: el campo existía sin colección destino; T05 §7.2 lo marcaba `[VERIFICAR]` y este anexo apuntaba a `distributionModels` con duda.
- **Opciones**: A) **(Recomendada)** M15 declara la colección `costCenterModels` (§7.19.1) con reparto fijo o delegado en un modelo de distribución. B) `costCenterModelId` como código sin colección.
- **Estado**: Asumida la recomendada (DEC-072). T05 agrega la colección `costCenterModels` (M15) y la referencia de `costCenterModelId`. No cambia ninguna ola de RF.
- **Impacto si no se responde**: A. **Bloquea**: §7.5, §7.6, §7.19.1; T05 §7.2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CON-19 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y eventos de M17)

- **Pregunta**: ¿Cómo se cierran los residuales de M15 que detectaron los entregables regenerados?
- **Contexto**: el índice de estados marcó sin estado inicial a `chartOfAccounts`, `fiscalYears`, `postingBatches`, `accountingPeriods`, `budgets` y `reconciliationRuns`, mezcló en `costDistributionRuns` los valores del §8.7 de otras dos colecciones y dejó `journalLines.entryStatus` sin transiciones; T05 nombra `ledgerAccountId`, `number`, `chartId`, `fileLayoutId` y otros campos clave que este §7 no tenía o llamaba distinto; M17 renombró sus eventos de capital y excedentes a camelCase (PA-INS-13).
- **Opciones**: A) **(Recomendada)** Declarar el estado inicial de cada máquina; calificar con su colección cada frase del §8.7 y §8.9; tabla de `journalLines.entryStatus` como copia de §8.1; adoptar los nombres de T05 con "antes"; `seriesId` → `economicIndexSeries` (T04); consumir los eventos de M17 con el nombre nuevo (el viejo queda como alias). B) Mantener el texto y resolver en los entregables.
- **Estado**: Asumida la recomendada (DEC-072). Los campos nuevos de `rubricatedBooks` (`fiscalYearId`, `volume`, `storedFileId`) y de `costDistributionRuns` (`number`, `distributionModelId`) siguen a T05; `volume` y la semántica de `distributionModelId` deben validarse con el contador piloto.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `entityAccountAssignments.entityType` admite `vatRate` y `taxDefinition` (antes `tax`) con las cuentas que M06 deja de guardar en `vatRates` y `taxDefinitions`; `entityId` es polimórfica según `entityType` (antes `identities` de T02).
- **Impacto si no se responde**: A. **Bloquea**: §7.10, §7.11, §7.14, §7.20, §7.24, §7.31 a §7.33, §7.37, §8, §9.1 (M-105 a M-114).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-01 — Catálogo inicial de tipos, motivos y estados
- **Pregunta:** ¿Cómo se carga el catálogo inicial de tipos, subtipos, motivos y estados de atención de cada tenant?
- **Contexto:** BASE §47 y §16 no enumeran tipos; ProCoop tiene catálogos distintos por cooperativa (`RUB_REC`, `TICKETS_TIPOS`, transacciones de reclamo).
- **Opciones:**
  - A) Precargar un catálogo base de CoopApps por servicio (§18), editable por el tenant y complementado con lo migrado **(Recomendada)** — arranque rápido y comparabilidad de indicadores.
  - B) Migrar solo el catálogo de ProCoop de cada cooperativa — continuidad pero indicadores no comparables.
  - C) Catálogo vacío que configura cada tenant — mayor esfuerzo de implementación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-CRM-043, RF-CRM-050, §18, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-02 — Derivación automática
- **Pregunta:** ¿Se permite que reglas deterministas deriven casos sin pasar por supervisión?
- **Contexto:** BASE §47 exige supervisión; el volumen de reclamos técnicos puede saturarla.
- **Opciones:**
  - A) Supervisión obligatoria; las reglas solo proponen; auto-derivación habilitable por tenant y tipo, apagada por defecto **(Recomendada)** — cumple la BASE y permite escalar.
  - B) Supervisión siempre, sin excepción — más carga operativa.
  - C) Derivación automática por defecto — contradice BASE §47.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-008, RN-CRM-019, PRM-CRM-012, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-03 — Cálculo del SLA
- **Pregunta:** ¿Con qué calendario y pausas se mide el SLA?
- **Contexto:** No hay SLA en ProCoop ni valores en la BASE.
- **Opciones:**
  - A) Horas hábiles del calendario del tenant; corridas para prioridad crítica; pausa en espera del socio; valores demo de §18 **(Recomendada)**.
  - B) Siempre horas corridas — más simple, penaliza fines de semana.
  - C) Solo días hábiles sin horas — poca granularidad para urgencias.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-103, RF-CRM-104, RN-CRM-052, PRM-CRM-020, O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-04 — Cierre de casos resueltos
- **Pregunta:** ¿Cómo pasa un caso de resuelto a cerrado?
- **Contexto:** BASE §47 deja el circuito de cierre a acordar.
- **Opciones:**
  - A) Cierre automático a los 7 días corridos sin respuesta del socio; el socio puede confirmar antes **(Recomendada)**.
  - B) Solo con confirmación explícita del socio — muchos casos quedarían abiertos.
  - C) Cierre inmediato al resolver — sin oportunidad de objetar.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-CRM-094, PRM-CRM-022, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-05 — Reapertura
- **Pregunta:** ¿Hasta cuándo se reabre un caso y desde cuándo se crea uno nuevo?
- **Contexto:** La reapertura afecta indicadores y el historial.
- **Opciones:**
  - A) Reabrir el mismo caso dentro de 30 días del cierre; luego caso nuevo vinculado **(Recomendada)**.
  - B) Siempre caso nuevo vinculado.
  - C) Reapertura sin límite.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-021, RN-CRM-054, PRM-CRM-023.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-07 — Verificación de identidad en el bot
- **Pregunta:** ¿Cómo se verifica al socio antes de mostrar información privada por bot?
- **Contexto:** El bot de ProCoop consulta por DNI sin verificación documentada (FIC 13.2); AGR-023 exige protección de datos.
- **Opciones:**
  - A) Teléfono verificado vinculado a la persona y OTP como respaldo **(Recomendada)**.
  - B) DNI + número de cuenta — vulnerable a terceros que conocen los datos.
  - C) Solo derivar a humano para datos privados.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-175, RN-CRM-017, PRM-CRM-060, O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-08 — Horario de atención del bot y humanos
- **Pregunta:** ¿Qué ocurre fuera del horario de atención humana?
- **Contexto:** BASE §47 pendientes (disponibilidad).
- **Opciones:**
  - A) Bot 24×7; humano en horario configurado; fuera de horario se crea caso con plazo informado; urgencias de seguridad derivan al teléfono de guardia **(Recomendada)**.
  - B) Canal cerrado fuera de horario.
  - C) Guardia humana 24×7 — costo operativo.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-176, RF-CRM-122, PRM-CRM-066.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-10 — Visibilidad de notas internas
- **Pregunta:** ¿Quién ve las notas internas de un caso?
- **Contexto:** `TICKETS_NOTAS.INTERNA` en ProCoop; casos sensibles (legales, reclamos contra personal).
- **Opciones:**
  - A) Visibles a empleados con acceso al caso; nota restringida opcional que requiere `crm.notasRestringidas.ver` **(Recomendada)**.
  - B) Visibles a todos los empleados del tenant.
  - C) Solo al autor y al supervisor.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-CRM-016, NEG-CRM-03.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-11 — Límites de adjuntos
- **Pregunta:** ¿Qué tipos y tamaños de adjunto acepta el CRM?
- **Contexto:** Fotos de medidores y documentos desde el celular; costo de almacenamiento.
- **Opciones:**
  - A) jpg, png, heic, webp y pdf; 10 MB por archivo; 10 por mensaje; antivirus **(Recomendada)**.
  - B) Cualquier tipo hasta 25 MB.
  - C) Solo imágenes hasta 5 MB.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-CRM-017, PRM-CRM-018.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-12 — Horas y proyectos
- **Pregunta:** ¿Se incluye el registro de horas, proyectos y bolsas de horas bonificadas heredado de los tickets?
- **Contexto:** En ProCoop es la facturación del soporte del proveedor (CTR-CRM-01); puede servir a cooperativas con servicios TIC empresariales.
- **Opciones:**
  - A) Registro de horas genérico para todos los casos y bolsa de horas por contrato para servicios TIC empresariales, como Extensión en O10; soporte SaaS en T01 **(Recomendada)**.
  - B) Solo registro de horas sin facturación.
  - C) Descartar horas y proyectos.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-040, RF-CRM-041, RN-CRM-050, PRM-CRM-090–092, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-13 — Turno online
- **Pregunta:** ¿Qué modalidad de turno remoto se ofrece?
- **Contexto:** ProCoop ofrece turno web ligado al DNI (V2 67/3064); BASE §26 pide turnos.
- **Opciones:**
  - A) Fila virtual y reserva horaria, configurables por área **(Recomendada)**.
  - B) Solo fila virtual.
  - C) Solo reserva horaria.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-151, RF-CRM-152, PRM-CRM-110, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-14 — Hardware del turnero
- **Pregunta:** ¿Qué hardware requiere el agente local?
- **Contexto:** FIC 19: impresora térmica y turnero serie; las pantallas web no necesitan agente.
- **Opciones:**
  - A) Pantallas y tótem como aplicaciones web sin agente; agente local solo para impresora térmica y dispositivos serie **(Recomendada)**.
  - B) Agente local obligatorio en toda sucursal con turnero.
  - C) Sin soporte de hardware local (QR en pantalla).
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-153, RF-CRM-155, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-16 — Oportunidades y campañas comerciales
- **Pregunta:** ¿El CRM incluye gestión de oportunidades de venta y campañas comerciales?
- **Contexto:** La solución 2 de BASE §105 menciona "comunicaciones y campañas"; no hay requisitos de embudo de ventas.
- **Opciones:**
  - A) Fuera del alcance inicial; campañas comunicacionales en T09; oportunidades como Extensión a relevar **(Recomendada)**.
  - B) Embudo de oportunidades en O10.
  - C) Excluir definitivamente.
- **Impacto si no se responde:** A.
- **Bloquea:** Ninguno en O2–O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-17 — Mesa de entradas documental
- **Pregunta:** ¿Qué alcance tiene la mesa de entradas?
- **Contexto:** MER-016 la pide; DFA M21 la confunde con tickets (CTR-CRM-22).
- **Opciones:**
  - A) Numeración anual ME-AAAA-NNNNN, entradas externas y salidas, pases internos con acuse **(Recomendada)**.
  - B) Solo entradas, sin salidas.
  - C) Expediente administrativo completo con foliatura en T11.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-130–134, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-18 — Cargo por visita improcedente
- **Pregunta:** ¿Se cobra la visita técnica cuando el reclamo resulta improcedente?
- **Contexto:** `CONEXION.RECLAMO` en ProCoop; impacto en protección del consumidor.
- **Opciones:**
  - A) Habilitable solo con regla aprobada y aviso previo al socio; la ejecuta M10/M05 **(Recomendada)**.
  - B) Nunca se cobra.
  - C) Se cobra siempre que el técnico lo marque.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-CRM-117, RN-CRM-091, PRM-CRM-047.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-19 — Anexo dueño de CU-SOL-01
- **Pregunta:** ¿Qué anexo define CU-SOL-01 (alta de Internet y baja de TV, BASE §48)?
- **Contexto:** M02 lo describe en lo que toca al contrato y este anexo en la solicitud y su circuito de atención; la corrección de inconsistencias pide un único anexo dueño y citas en los demás (pendiente 6 del cierre).
- **Opciones:**
  - A) M09 es dueño (la solicitud es el hilo del caso) y M02 cita su parte de contrato **(Recomendada)**.
  - B) M02 es dueño y M09 cita el tramo de atención.
- **Impacto si no se responde:** A.
- **Bloquea:** §16 de M09 y M02; T12 parte 1 (solicitud de alta); 04-matriz.
- **Estado:** Asumida (DEC-072): opción A. CU-SOL-01 queda definido en §16 de este anexo; M02 ya lo cita (fila «CU-SOL-01 (BASE, parte CAT)»).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-CRM-20 — Residuales de los entregables: referencias, nombres de T05 y estados (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M09 (§7.45), cómo se concilian los campos que T05 nombra distinto y cuáles son el estado inicial y las transiciones de las máquinas que el §8 daba solo en texto?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M09-CRM-atencion.md` §7 y de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-02 y INC-06-08).
- **Opciones**: A) **(Recomendada)** Destinos de §7.45 (T11 `workflowDefinitions`, M10 `incidentCategories`, M05 `invoices`, T09 `campaigns`, T02 `memberships`, autorreferencias), `aiUsageLogId` incorporado y máquinas de §8.14. B) Mantener `[VERIFICAR]` y el texto.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER y diagramas de estados de M09; T05 COL-CRM-02, 04, 09, 10, 11, 12, 16, 17, 19, 23 y 26.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.3, §7.8, §7.12 a §7.14, §7.20, §7.43, §7.44, §7.45 y §8.14. T05 debe reflejar las equivalencias de §7.45 (en especial `crmCaseId` en lugar de `caseId`) y quitar `operationId` de COL-CRM-12 y `documentRequirementTypeIds[]` de COL-CRM-16; en §7.2.1, `externalThreadId` y `targetType` como "no es referencia". Se adopta además el nombre canónico `associateMembershipId` (antes `memberId`) de T05 §7.2.1 en `crmProcedureRecords` y se cierran las referencias restantes de §7.44 (`ownerUserId` → T02 `memberships`, `providerConnectionId` → T06 `integrationConnections`, `printDocumentId` y `labelsDocumentId` → T11 `documents`).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-DAT-01 — Cuenta corriente y cobro cuando hay varias entidades jurídicas

- **Pregunta:** cuando un mismo socio tiene servicios facturados por dos entidades jurídicas del tenant (por ejemplo, la cooperativa y una sociedad de telecomunicaciones), ¿la cuenta corriente y el recibo se separan por entidad o se unifican?
- **Contexto:** DEC-064 fija emisión, contabilidad y sueldos por entidad, pero no dice nada de la cuenta corriente ni del cobro; M07 no menciona entidades jurídicas. Define `currentAccounts.legalEntityId`, la numeración de recibos, la imputación de un pago entre facturas de distintas entidades y la rendición a cada entidad.
- **Opciones:**
  - A) Cuenta corriente por titular y entidad; en caja un solo cobro puede cubrir facturas de varias entidades, pero se emite **un recibo por entidad** **(Recomendada)** — saldos y contabilidad limpios por entidad; el socio ve un solo pago con varios comprobantes.
  - B) Cuenta corriente única para todas las entidades y un solo recibo de la entidad principal, que cobra por cuenta de las demás — una sola vista para el socio, pero exige convenio de cobro por cuenta de terceros, rendiciones entre entidades y asientos de deuda entre ellas.
  - C) Sin mezcla: cada entidad cobra por separado (cajas y canales distintos) — más simple de construir, peor experiencia para el socio.
- **Impacto si no se responde:** se asume A; `currentAccounts`, `obligations`, `receipts` y `ledgerEntries` llevan `legalEntityId` obligatorio y la imputación nunca cruza entidades.
- **Bloquea:** COL-COB-01, COL-COB-12, CTR-DAT-74; ola O5 (y la numeración de recibos desde O4).
- **Estado:** **Asumida (DEC-087)**, opción A: cuenta corriente por titular y entidad jurídica; un cobro en caja puede cubrir facturas de varias entidades con un recibo por entidad; `legalEntityId` obligatorio en `currentAccounts`, `obligations`, `receipts` y `ledgerEntries`; la imputación nunca cruza entidades. Ya no bloquea.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-DAT-02 — Consulta del detalle histórico antiguo

- **Pregunta:** ¿el detalle de renglones de facturas, lecturas de telemedición, llamadas y bitácoras de más de 36 meses puede quedar en archivo de consulta diferida?
- **Contexto:** con el perfil de DEC-075 la plataforma llega a cientos de millones de renglones por año. Tener todo en línea durante los 10 años de retención legal multiplica el costo de almacenamiento y de los índices. Las facturas, recibos, asientos y movimientos, con su PDF y totales, quedan siempre en línea.
- **Opciones:**
  - A) En línea 36 meses; el detalle más antiguo se archiva cifrado y se recupera a pedido en minutos, con trazabilidad **(Recomendada)** — costo acotado; las consultas viejas de detalle no son instantáneas.
  - B) Todo en línea los 10 años — consultas instantáneas; mayor costo por tenant, que se traslada al pack (DEC-065).
  - C) En línea 24 meses (igual que la profundidad de migración, DEC-070) — menor costo; más consultas diferidas en reclamos de los últimos tres años.
- **Impacto si no se responde:** se asume A (§7.8.2).
- **Bloquea:** §7.8.2 (archivo en frío), COL-FAC-11 `billableItems`, COL-MED-32 `intervalReadings`, COL-TEC-67 `callRecords`; jobs de retención de T08 (O8 en adelante).
- **Estado:** **Asumida (DEC-087)**, opción A: detalle en línea 36 meses y archivo cifrado con recuperación a pedido y trazabilidad (§7.8.2). Ya no bloquea.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-DAT-03 — Errores de unicidad y de campos en el catálogo de T09

- **Pregunta:** ¿se corrigen en T05 los índices únicos y campos del catálogo de T09 que no coinciden con las fichas de T09?
- **Contexto:** T09 detectó que COL-COM-15 `communityGuidelines` exigía `version` única aunque es opcional; COL-COM-37 `messageTemplateVersions` usaba `version` (campo de concurrencia) en lugar de `versionNumber`; COL-COM-22 `surveyInvitations` declaraba único `{surveyId, personId}` con `personId` opcional y con invitaciones repetidas por evento; COL-COM-56 `outageNotices` declaraba `serviceId` singular cuando un corte afecta varios servicios; y COL-COM-45 `messagingUsage` tenía una clave única `{period, channel}` demasiado gruesa para el conteo diario. Es la PA 3 del pendiente de cierre de la corrección de inconsistencias.
- **Opciones:**
  - A) Corregir T05 para que siga a las fichas de T09 **(Recomendada)**.
  - B) Mantener T05 y que T09 adapte sus fichas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** COL-COM-15, COL-COM-16, COL-COM-22, COL-COM-37, COL-COM-45, COL-COM-56; ola O2.
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026: `{version}` parcial en COL-COM-15; `{membershipId, guidelinesVersion}` en COL-COM-16; `idempotencyKey` en COL-COM-22; `{templateId, versionNumber}` en COL-COM-37; `{dayKey, channel, purpose, communicationTypeCode}` en COL-COM-45; `serviceIds[]` y `{source.kind, source.refId}` parcial en COL-COM-56. Ya no bloquea.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-DAT-04 — Destinos de referencia pendientes y alineación del catálogo con los anexos dueños

- **Pregunta:** ¿qué destino toman los campos de referencia marcados [VERIFICAR] en §7.2.1 y en el catálogo, y cómo se resuelven las diferencias de nombre entre el catálogo y los §7 de los anexos dueños?
- **Contexto:** cierre de residuales del 5-11-2026 (`_trabajo/residuales-instrucciones.md`). El diagrama entidad-relación (`docs/entregables-analisis-diseno/03-er/`) contaba 393 campos que solo figuraban en T05; la mayoría eran nombres de T05 distintos del anexo dueño y una parte eran nombres citados en notas "antes `x`", que el generador también cuenta. Seguían abiertos los [VERIFICAR] de `templateId`, `deviceId`, `targetAccountId`, `importBatchId`, `projectId`, `lineId`, `memberId`, `paymentId` y `unitId`, el doble destino de `taxRateIds` y las cuentas contables de COL-FIS-16 y COL-FIS-18.
- **Opciones:**
  - A) Fijar un destino único por colección o módulo, alinear el catálogo al anexo dueño cuando el anexo usa un nombre canónico y conservar el canónico de §7.2 cuando el anexo no lo usa (el anexo debe renombrar) **(Recomendada)**.
  - B) Dejar los [VERIFICAR] hasta que cada anexo dueño confirme — bloquea los esquemas de las olas O1 a O10.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.2.1; COL-FIS-16, COL-FIS-18, COL-TAR-20, COL-INS-11; las 64 filas alineadas (§7.3 a §7.7).
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026:
  - §7.2.1: `templateId` de M12 y T02 → `messageTemplates`; de M10 y M17 → `documentTemplates`; de M08 `suspensionRestrictionRules` → `code` de la fila de plataforma de la misma colección; `deviceId` de M03 → `fieldDevices`; de M16 y T06 → dispositivo embebido en `localAgents.devices[]`; `targetAccountId` de M08 → `accounts`; `importBatchId` → `migrationBatches` (T02, M11) y `masterImportJobs` (M08); `projectId` → `crmProjects` (M11) y `works` (M13); `taxRateIds` → solo `vatRates` (el resto de los tributos en `taxIds` → `taxDefinitions`; M04 debe separar los campos); `lineId` de T10 → renglón `invoices.lines[]`; `memberId` → `associateMemberships`; `paymentId` → `receipts`; `unitId` de M01 → subdocumento `premises.units`; filas nuevas `rightId` → `burialRights` y `paymentOrderRef` → `paymentOrders`.
  - Cuentas contables de `vatRates` y `taxDefinitions` en `entityAccountAssignments` (COL-CON-38); M06 no guarda `ledgerAccountId` y M15 debe admitir `entityType` `vatRate` y `taxDefinition`.
  - `apiUsageDaily` único `{apiClientId, day}` (antes `date`, alineado a T10; 5-11-2026, sincronización: reemplazado por `{apiClientId, date, route, status}`, ver PA-DAT-05); `relationships` ya usaba `subjectPersonId`/`target` en las dos columnas (sin cambio).
  - 64 filas del catálogo alineadas a los §7 de T01, T02, T04, T06, T08, T10, M07, M09, M10, M13, M14, M15 y M16, con nota "5-11-2026, residuales: alineado a … §7; antes …".
  - Se mantiene el nombre de T05 porque el anexo dueño usa uno no canónico de §7.2 o §7.2.1 (el anexo debe renombrar): M14 `paymentFiles` (`originTreasuryAccountId`; el anexo dice `originAccountId`); T01 `tenantExports` (`storedFileId`; el anexo dice `fileId`); M04 `tariffScheduleId` (el anexo dice `scheduleId`, admitido solo dentro de M04); M13 `stockDocumentId` y `currentContractId`; M17 `fromAssociateMembershipId`, `toAssociateMembershipId`, `grantorAssociateMembershipId` y `proxyAssociateMembershipId`; M16 `cbuHmac` y el número de `laborLawsuits`; M18 `documentRefId` (apunta a `documents`; el anexo lo apunta a `storedFiles`), `supplierId` (el anexo dice `providerId`), `fuelTypes.vatRateId` y `housingContributions.invoiceId`. (5-11-2026, sincronización: M13, M14, M16, M17 y M18 `fuelTypes.vatRateId` ya adoptaron estos nombres; ver PA-DAT-05.)
  - Las 6 filas `R` pasan a `C (antes R)`. Los totales no cambian: 1.108 filas y 1.057 colecciones a crear. Ya no bloquea.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-DAT-05 — Sincronización del catálogo con las rondas de residuales de los anexos dueños

- **Pregunta:** ¿cómo se reflejan en el catálogo, en §7.2.1 y en §8.1 los nombres, destinos, unicidades y estados que los anexos dueños fijaron en la ronda de residuales del 5-11-2026 (`_trabajo/residuales-sincronizacion.md`), y qué nombre rige cuando T05 y el dueño difieren?
- **Contexto:** M07 a M11 (PA-COB-21, PA-MOR-22, PA-CRM-20, PA-TEC-23, PA-VEN-12), M12 a M17 (PA-CMP-16, PA-STK-11, PA-TES-19, PA-SUE-18, PA-INS-13), M02 a M06 (PA-CAT-23, PA-MED-15, PA-TAR-21, PA-FAC-23, PA-FIS-22) y T02, T06, T07, T10 corrigieron sus §7 y §8 y piden a T05 reflejarlo. En la ronda anterior T05 había alineado algunas filas a nombres que los dueños después cambiaron (`connectorId` de COL-COB-34, `ruleId` de COL-BIA-16, `day` de COL-BIA-23, `profileId` de COL-IAM-08, `familyId` de COL-IAM-13). T10 §7.26 declara `indicatorId` obligatorio en `indicatorSnapshots` y `kpiAlertRules`, y el texto del §7.11 y del §7.13 solo `indicatorCode`; T07 declara `migrationIssues.ruleId` → `migrationMappingRules` y `ruleCode` como clave natural de la regla.
- **Opciones:**
  - A) Prevalece el anexo dueño: el catálogo toma los nombres del §7 del dueño (incluidas las tablas de campos que adoptan el canónico de T05), los destinos y valores nuevos se registran en §7.2.1 y §8.1, y donde el dueño declara dos nombres se toma la tabla de campos: `indicatorId` como referencia más `indicatorCode` como código desnormalizado, `kpiAlertRuleId`, `migrationIssues.ruleId` como referencia y `ruleCode` como clave natural, `apiUsageDaily.date` **(Recomendada)**.
  - B) Conservar los nombres de la ronda anterior de T05 y pedir a cada dueño que vuelva a cambiar — reabre filas que el dueño ya cerró.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** COL-COB-11, 13 y 34; COL-MOR-02, 13, 17, 19, 20, 24 y 26; COL-CRM-10, 11, 12, 16, 19 y 26; COL-TEC-12, 20, 21, 22, 28 y 42; COL-MED-17; COL-CMP-22 y 23; COL-TES-13 y 42; COL-INS-01; COL-IAM-08 y 13; COL-MIG-01, 11 y 13; COL-BIA-12, 15, 16 y 23; §7.2.1; §8.1.
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026:
  - Catálogo: 40 celdas con nota "5-11-2026, sincronización: …; antes …" en las filas de la lista anterior (claves y referencias o únicos). No cambian Alc., Clas., Ola ni Est.
  - §7.2.1: 9 filas existentes con nota y 44 filas nuevas (14 de "no es referencia" y 30 de destinos), entre ellas `obligationId` de `withholdingsApplied` → `taxObligations` e `invoiceId`/`receiptId` de M12 → `supplierInvoices`/`supplierReceipts`, que son excepciones de contexto a §7.2.
  - §8.1: 10 filas nuevas (`collectors` y `gatewayConnectors`, `interestIndexTables`, `debtCollectionAgencies`, `regulatoryReportRuns`, `revaluations`, `serviceReceptions`, `signalRightsContracts`, `matchExceptions.decision`, `shifts`, `extraTasks`).
  - Los totales no cambian: 1.108 filas y 1.057 colecciones a crear (no hay colecciones nuevas ni absorbidas).
  - Cerrado el 5-11-2026 (M13 PA-STK-11, T10 PA-BIA-17, M02 PA-CAT-23; `packageIds` → `serviceProducts`). Antes decía: Quedan para los dueños: M13 §7.37.15 todavía apunta `lots.purchaseReceiptId` a `receipts` (M07) mientras §7.37.14 dice `supplierReceipts`; T10 §7.11 y §7.13 nombran solo `indicatorCode` y `ruleId` en el texto; M12 PA-CMP-16 pide que M02 confirme `packageIds` → `servicePlans`.
  - 5-11-2026, pendientes de la sincronización: COL-TAR-03, COL-TAR-04 y COL-TAR-06 suman `taxRateIds` → `vatRates` y `taxIds` → `taxDefinitions` (M04 PA-TAR-21); COL-CON-38 declara `entityType` + `entityId` polimórfica con `vatRate` y `taxDefinition` (antes `tax`; M15); COL-SOC-48 `vatRateId` → `vatRates` como ObjectId obligatorio, que resuelve el [VERIFICAR] de M18 (fila nueva en §7.2.1); COL-SUE-06 conserva `{employeeId, cbuHmac}`, que M16 ya adopta como `{tenantId, employeeId, cbuHmac}`. Totales sin cambio. M18 debe quitar el [VERIFICAR] de `fuelTypes.vatRateId`.
  - 10-11-2026, sincronización con los anexos dueños de DEC-093 a DEC-104 (misma regla: prevalece el dueño, verificado por búsqueda en cada anexo). M06: COL-FIS-48 `ownTaxObligations` nueva (§7.39, O8), COL-FIS-30 (`ownTaxObligationId` y `taxAgentRegistrationId` condicional), COL-FIS-17 (`supplyUsageIds[]` y único con `supplyUsageKey`; M06 todavía no cambió a la clase fija `usageClass`: si lo hace, la fila se vuelve a alinear), COL-FIS-24 (`lines[].supplyUsageId`), COL-FIS-46 (`publicServiceAccessory`, `accessoryApproval`). M05: COL-FAC-21 (`billingGroupId` opcional en el único, `authorizationType` con `CESP`). M01: COL-PER-01 (`identificationStatus`, `identificationRegularization`, rol de domicilio `commercial`), atributo `usageClass` de `premiseUsages` (§7.5.1) y foto `holderIdentifierSnapshot.identificationStatus` en COL-CAT-18. Maestros de rol: COL-CMP-01, COL-VEN-10, COL-SOC-08 y COL-SOC-44 (CTR-DAT-82). M17, M15, T02 y T04: COL-INS-06, 07, 12, 14, 16, 18, 24, 33, 34 y 36, COL-CON-05, COL-CON-16, COL-CON-38, COL-IAM-07 (`scope.legalEntities[]`, nombre de T02; `scope.areas[]` → `crmAreas`), COL-IAM-26 y COL-CFG-42 (origen `PTOVENTA.SUC_COM` y `legacy`, DEC-098). §7.1.10, §7.2.1 (7 filas nuevas y 1 con nota), §7.10 y §8.1 (`ownTaxObligations`). Totales: 1.109 filas y 1.058 colecciones a crear (antes 1.108 y 1.057). T05 no tiene catálogo de servicios entre módulos ni repite `tariffServiceSettings.proration`, así que `cob.service.getUnremittedCash`, `ins.capitalBase.get`, `per.findOrCreatePerson`, `per.getPersonIdentity` y el prorrateo de M04 no se registran aquí (se citan solo como contexto en COL-PER-01, COL-INS-12 y COL-FIS-48). Queda para M02: declarar en su §7 la foto `holderIdentifierSnapshot` con `identificationStatus` que M01 exige del contrato.
  - 10-11-2026, última ronda de DEC-093 a DEC-108 (misma regla, verificada por búsqueda en cada dueño). M01: COL-PER-04 `holders.memberships[]` (antes `membership`; DEC-096). M02: COL-CAT-18 ya no está pendiente (M02 §7.18 declara `holderIdentifierSnapshot`; cierra el pendiente anterior). M05 (DEC-106 y DEC-107): COL-FAC-07 (`releases[]`, `authorizationType` con `none`), COL-FAC-13 (`numberAssignments[]`, `issueAttempt`, `emissionSeq`, `dueDates` 1..N, `dueDateCap`, `commercialStatus` con `returnedToDraft` y `requeued`, único `{numberSequenceId, number}` parcial), COL-FAC-21 (`lastAuthorizedNumber`, `authorizationType` con `none`), COL-FAC-33 (`dueDateCapacity`), COL-FAC-35 (`dueDates` 1..N). M06: COL-FIS-10 (`issueAttempt`, `rejectionKind`, `cancelReason`, `idempotencyKey` único parcial y `{documentRef, issueAttempt}` único; DEC-107), COL-FIS-17 (`supplyUsageClasses[]` en lugar de `supplyUsageIds[]`; se cumple la realineación anunciada en el punto anterior), COL-FIS-24 (`lines[].supplyUsageClass`), COL-FIS-28 (`supplierPersonId`; DEC-097), COL-FIS-30 (`capitalBaseRef`, `cancelReason`, `replacesObligationId`, `replacedByObligationId`; DEC-095), COL-FIS-48 (`capitalBase` sin `serviceIds[]` ni `capitalEventTypes[]`, con `capitalItemIds[]`). M07: COL-COB-02 (`dueSchedule` 1..N, `fiscalGate` e índice), COL-COB-21 (`dueDateCapacity`), COL-COB-25 (`totals.byDue[]`, `publishedDueCount`). M04: COL-TAR-11 (`formulaJustification`; DEC-105). M14: COL-TES-35 (`taxObligation`; DEC-095). §7.2.1: 6 filas nuevas (`capitalBaseRef.capitalClosingId` y enlaces de recálculo de `taxObligations`; `supplierPersonId`; `holders.memberships[]`; referencias de `invoices.numberAssignments[]` y `dueDateCap`; `billingRunNumberRanges.releases[].invoiceId`; `paymentExecutions.taxObligation`) y 2 con nota (uso del suministro; `ownTaxObligations`). §20: CTR-DAT-81 pasa a **Aplicada** también en T11. Totales sin cambio: 1.109 filas y 1.058 colecciones a crear (no hay colecciones nuevas ni absorbidas); 82 contraposiciones.
  - 10-11-2026, ronda de cierre de DEC-093 a DEC-108 (verificada por búsqueda en M17 §7 y CTR-INS-14 y en M16 §7.2 y RN-SUE-001). M17 (DEC-096): `legalEntityId` obligatorio en COL-INS-10 `capitalTransfers`, COL-INS-11 `capitalRefunds`, COL-INS-13 `shareCertificates`, COL-INS-17 `bodyMandates`, COL-INS-22 `minutes`, COL-INS-23 `resolutions` y COL-INS-31 `institutionalFeeSettlements`; únicos por entidad `{legalEntityId, number}` en `shareCertificates` y `{legalEntityId, bookType, number}` en `minutes`; `capitalRefunds.number` sigue por tenant (`ins.refundRequest`); el párrafo de DEC-096 de §7.1.10 deja de decir que esas colecciones no declaran el campo. M16 (DEC-097): COL-SUE-02 `employees` suma el único parcial `{personId, legalEntityId}` para legajos no egresados. M06 (DEC-095): COL-FIS-30 `taxObligations` suma el estado `cancellationPending`, `paymentConflict` (con referencia a `paymentExecutions`) y `creditBalanceAmount` (RN-FIS-133 punto 9). M05 y M07 (DEC-107): COL-FAC-13 (`lateAuthorizationGraceDays`, `lateAuthorizationShift`), COL-FAC-24 (`lateAuthorizationGraceDays`) y COL-COB-02 (`fiscalGate.lateAuthorizationGraceDays`, `dueScheduleShift`) por los vencimientos corridos de M05 RN-FAC-165. Totales sin cambio: sin colecciones nuevas; 82 contraposiciones.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-01 — Modalidad por defecto para tenants nuevos
- **Pregunta:** ¿qué modalidad de facturación se configura por defecto al dar de alta un tenant?
- **Contexto:** BASE §103 admite separada y agrupada; las cooperativas migradas traen su práctica.
- **Opciones:** A) Separada por defecto, agrupada opt-in por grupo (Recomendada). B) Agrupada por titular por defecto. C) Obligar a elegir en el alta sin default.
- **Impacto:** onboarding, plantillas de impresión, M07.
- **Estado:** Respondida (DEC-034): separada por servicio por defecto; agrupada solo si se activa por grupo.
- **Bloquea:** RF-FAC-064, PRM-FAC-073.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-02 — Periodicidad distinta dentro de un grupo
- **Pregunta:** si un servicio del grupo es bimestral y otro mensual, ¿cómo se emite?
- **Contexto:** FAC-010 de BASE §103.
- **Opciones:** A) El servicio con período vencido se incluye en el próximo comprobante del grupo (Recomendada). B) Se emite separado cuando no coincide. C) Prorratear a la periodicidad del grupo.
- **Impacto:** cálculo (M04), vencimientos.
- **Bloquea:** RF-FAC-072, PRM-FAC-074.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-03 — Distribuir y publicar solo autorizados
- **Pregunta:** ¿se envían o publican comprobantes pendientes de autorización?
- **Contexto:** ProCoop desactivaba el registro automático si quedaban bloqueados por CAE.
- **Opciones:** A) Solo autorizados (Recomendada). B) Enviar con leyenda "pendiente de autorización". C) Configurable por canal.
- **Impacto:** plazos de entrega, M15.
- **Bloquea:** RF-FAC-063, PRM-FAC-076.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-04 — Momento de asignación del número fiscal
- **Pregunta:** ¿el número se asigna al emitir o al autorizar?
- **Contexto:** ARCA exige correlatividad por tipo y PV; el orden de reparto requiere numeración en orden de ruta.
- **Opciones:** A) Numerar al emitir en orden del lote y autorizar en orden estricto por numerador; un rechazo bloquea el numerador hasta reenviar el mismo número corregido (Recomendada). B) Número interno provisorio y número fiscal al autorizar. C) Usar CAEA para masiva.
- **Impacto:** M06, impresión, conciliación.
- **Estado:** Respondida (DEC-035): opción A; número al emitir en orden del lote; ante rechazo se reenvía el mismo número. **Reemplazada en parte por DEC-107 (10-11-2026):** se mantiene la asignación al emitir en orden del lote; ante un rechazo de ARCA el comprobante vuelve a borrador y libera su número, los posteriores sin CAE vuelven a la cola y se renumeran desde el último autorizado, y los autorizados nunca cambian (RN-FAC-164). *Reemplazado (10-11-2026, DEC-107): "ante rechazo se reenvía el mismo número" y, en la opción A, "un rechazo bloquea el numerador hasta reenviar el mismo número corregido".*
- **Bloquea:** RF-FAC-048 a 052, §8.6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-05 — Total negativo
- **Pregunta:** ¿qué se hace cuando el total de un caso es negativo?
- **Contexto:** ProCoop invierte signos y emite NC; con GD agrega crédito a futuro.
- **Opciones:** A) Política por servicio, default NC; GD con crédito a futuro (Recomendada). B) Siempre NC. C) Siempre saldo a favor en M07.
- **Impacto:** M06, M07.
- **Estado:** Respondida (DEC-036): política por servicio, por defecto NC; generación distribuida como crédito a futuro (coherente con DEC-060 y RF-MED-097).
- **Bloquea:** RF-FAC-030, RN-FAC-039, PRM-FAC-063.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-06 — Factura en cero por consumo
- **Pregunta:** ¿se emite un comprobante en cero cuando hay consumo pero importe nulo?
- **Opciones:** A) No emitir; registrar "sin cargo" en el lote; configurable por servicio (Recomendada). B) Emitir siempre. C) No emitir nunca.
- **Impacto:** ARCA, reportes regulatorios.
- **Estado:** Respondida (DEC-037): no emitir; registrar "sin cargo", configurable por servicio.
- **Bloquea:** RF-FAC-029, PRM-FAC-032.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-07 — Varios suministros del mismo servicio
- **Pregunta:** un titular con dos medidores de agua, ¿una o dos facturas?
- **Opciones:** A) Una por contrato/suministro en separada; agrupar solo vía grupo (Recomendada). B) Una por cuenta. C) Configurable por servicio.
- **Impacto:** M02, impresión.
- **Bloquea:** RF-FAC-075, PRM-FAC-075.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-08 — Formatos de código de barras a precargar
- **Pregunta:** ¿qué formatos se priorizan en O4?
- **Contexto:** ProCoop tiene ~100 (RN-02 §16.7).
- **Opciones:** A) Los de la cooperativa piloto + los genéricos de RF-FAC-142 (Recomendada). B) Todos. C) Solo genéricos.
- **Impacto:** esfuerzo de O4, migración.
- **Bloquea:** RF-FAC-142.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-09 — Conservar prefijos 40/41/42/43
- **Pregunta:** ¿se mantienen los prefijos de documento de ProCoop?
- **Opciones:** A) Sí, para leer lo ya impreso (Recomendada). B) Nuevos prefijos con decodificador heredado temporal.
- **Impacto:** recaudadores, M07.
- **Bloquea:** RF-FAC-143.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-10 — Modificación masiva de autorizados
- **Opciones:** A) Solo datos no fiscales (vencimientos 2–4, recargos, observaciones, mensajes) (Recomendada). B) Prohibir toda modificación. C) Igual que ProCoop.
- **Contexto:** RN-02 §15.16.
- **Pregunta:** ¿qué se puede modificar masivamente en comprobantes autorizados?
- **Impacto:** cumplimiento fiscal.
- **Bloquea:** RF-FAC-113.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-11 — Muestra de control obligatoria
- **Pregunta:** ¿la muestra revisada es obligatoria para aprobar lotes grandes?
- **Opciones:** A) Sí, a partir de `PRM-FAC-034` casos (Recomendada). B) Siempre opcional. C) Siempre obligatoria.
- **Impacto:** tiempos de ciclo.
- **Bloquea:** RF-FAC-046.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-12 — Desborde de ancho de importe en el código
- **Pregunta:** ¿qué pasa si el importe no entra en el ancho del formato (ej. Banco de Córdoba 43, 6 dígitos)?
- **Opciones:** A) Formato alternativo automático configurado (Recomendada). B) Excepción de impresión sin código. C) Truncar (como ProCoop).
- **Impacto:** recaudación.
- **Bloquea:** RF-FAC-144.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-13 — Franqueo
- **Pregunta:** ¿se ofrece el cargo por franqueo?
- **Opciones:** A) Habilitable por tenant con validación de adhesión digital (Recomendada). B) Descartar.
- **Impacto:** M02 (concepto), distribución.
- **Bloquea:** RF-FAC-161, PAN-FAC-34, PRM-FAC-138.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-14 — Facturación in situ
- **Pregunta:** ¿en qué ola y con qué modelo se emite en campo?
- **Opciones:** A) O7 con reserva de rango por dispositivo (Recomendada). B) O7 como internos que se autorizan al sincronizar. C) Fuera de alcance.
- **Impacto:** M03, M06, PWA offline.
- **Bloquea:** RF-FAC-170, §9.8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-15 — Propagación de bloqueos al cierre
- **Opciones:** A) Configurable, default desactivado (Recomendada). B) Replicar siempre (V2 2769). C) Descartar.
- **Pregunta:** ¿se propagan causas de bloqueo a los comprobantes nuevos?
- **Impacto:** cobranza.
- **Bloquea:** RF-FAC-096, RN-FAC-142, PRM-FAC-023.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-16 — Signo del interés en retroactivos
- **Pregunta:** ProCoop calcula el interés con signo negativo (RN-02 §16.1); ¿los retroactivos son siempre devoluciones?
- **Opciones:** A) Signo explícito según la diferencia (cargo o devolución) (Recomendada). B) Replicar signo negativo.
- **Impacto:** importes facturados.
- **Bloquea:** RF-FAC-111, CU-FAC-11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-17 — Comprobantes de administración pública
- **Pregunta:** ¿qué hace exactamente `frmComprobnatesAdministracionPublicaRAW` / `COMPROBANTES_ADM`? [VERIFICAR]
- **Opciones:** A) Relevar con la cooperativa piloto; mientras tanto, modelar como relación `administrative` y reporte (Recomendada). B) Descartar.
- **Impacto:** organismos públicos clientes.
- **Bloquea:** RF-FAC-133, PAN-FAC-38.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-18 — SLA por defecto de excepciones
- **Pregunta:** ¿qué responsables y plazos de corrección se precargan? (BASE §71)
- **Opciones:** A) Por categoría: datos fiscales 48 h (corrector), lecturas 24 h (supervisor de consumos), configuración 24 h (responsable) (Recomendada). B) Sin SLA. C) Definido por cada tenant desde cero.
- **Impacto:** tablero, alertas.
- **Bloquea:** `billingExceptionReasons.slaHours`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-19 — Contingencia ante caída fiscal
- **Pregunta:** ¿qué hace el lote si ARCA no responde por horas? (BASE §71)
- **Opciones:** A) Emitir y dejar en cola; pausar solo la fase de autorización; CAEA si el tenant lo tiene habilitado (Recomendada). B) Pausar la emisión. C) Siempre CAEA.
- **Impacto:** M06, distribución.
- **Estado:** Respondida (DEC-038): emitir y encolar; pausar solo la autorización; CAEA si está habilitado. En mostrador rige DEC-018 (espera del CAE con tiempo máximo; luego CAEA o comprobante pendiente no entregable como fiscal).
- **Bloquea:** §13, §8.6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-20 — Preferencia de entrega de migrados
- **Pregunta:** ¿qué canal tienen los titulares migrados?
- **Opciones:** A) Conservar el de ProCoop; sin dato, papel (Recomendada). B) Email si existe correo. C) Pedir confirmación a todos.
- **Impacto:** costos de impresión, consentimiento.
- **Bloquea:** §19.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FAC-23 — Residuales de estados, referencias y API reemplazada (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados de alta y las transiciones agregadas en §8.13, los destinos y la obligatoriedad de las referencias marcadas y la API destino de API-FAC-023?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 11 máquinas de M05 sin estado inicial, 6 colecciones con `status` sin valores legibles (escritos en un solo bloque), `paymentSlips` sin transiciones y `billableItems` con valores de §8.12 no declarados; 03-er marcó referencias sin destino; API-FAC-023 decía «Reemplazado» sin API destino.
- **Opciones:**
  - A) **(Recomendada)** Escribir los valores de §7 uno por uno; declarar en §8.13 los estados de alta y las transiciones; `ownerRole` → `roles` y `assigneeId` → `memberships` (T02); `serviceBlockId` obligatorio y `affectedServiceBlockIds` opcional (vacío = todos); los números de versión no son referencias; API-FAC-023 reemplazada por API-MOR-25.
  - B) Mantener API-FAC-023 como fachada de M08 con capability propia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), 05 (contratos de API), T02 (capability `fac.bloqueosCausas.configurar`).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7, §8.7, §8.13 y §11. T02 debe marcar `fac.bloqueosCausas.configurar` como reemplazada por `mor.causas.configurar` (API-MOR-25).
- **Sincronización (5-11-2026), Asumida (DEC-072):** `billingRunItems` y `invoices.customer` usan `associateMembershipId` (antes `memberId`) → `associateMemberships` (M17), nombre canónico de T05 §7.2.1 (PA-DAT-04).
- **Residual (5-11-2026), Asumida (DEC-072):** PAN-FAC-17 y el rol Administrador del tenant (§4) citan `mor.causas.configurar` (antes `fac.bloqueosCausas.configurar`), la misma capability de API-MOR-25 que usa la pantalla.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-01 — Uso del CAEA
- **Pregunta:** ¿El CAEA se usa solo como contingencia o también como modalidad habitual para la facturación masiva?
- **Contexto:** ProCoop lo solicita por quincena sin controlar el uso; la normativa vigente restringe su uso según el sujeto y el caso (BASE §97.2). Afecta la operación de lotes grandes.
- **Opciones:**
  - A) Solo contingencia por defecto, y habilitable por punto de venta para facturación masiva cuando la tabla normativa lo permita al tenant **(Recomendada)** — cumple la normativa y mantiene flexibilidad.
  - B) Siempre CAEA para facturación masiva — menos llamadas a ARCA, pero riesgo de uso no admitido.
  - C) No ofrecer CAEA — simplifica, pero sin respaldo ante caídas de WSFE.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-065, RF-FIS-069, `PRM-FIS-022`; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-02 — Alcance del CESP para LQSP
- **Pregunta:** ¿Se implementa el CESP para liquidaciones de servicios públicos en O7?
- **Contexto:** RN-03 §4.2 lo documenta con defectos; solo aplica a tenants con servicios LQSP.
- **Opciones:**
  - A) Sí, en O7, separado de CAEA y con validación de superposición correcta **(Recomendada)** — cubre electricidad y agua.
  - B) Solo si un tenant piloto lo usa — reduce trabajo, pero bloquea tenants futuros.
  - C) Descartar — riesgo de no poder emitir LQSP.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-071 a RF-FIS-074; O7.
- **Actualización (10-11-2026, DEC-094):** se mantiene la opción A: la LQSP se autoriza con CESP separado del CAEA; la propuesta externa de CAE o CAEA no se adopta. La norma, la vía vigente y el efecto de las RG 5003 y 5866/2026 se consultan al contador en PA-FIS-24; si cambian la vía, una DEC nueva reemplaza a DEC-094.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-03 — Obtención del certificado ARCA
- **Pregunta:** ¿La plataforma genera la clave privada y el CSR, o el tenant solo carga un certificado PFX ya obtenido?
- **Contexto:** RN-03 rec. 1; generar en la plataforma evita que la clave salga de la bóveda.
- **Opciones:**
  - A) Ambas, con la generación en la plataforma como camino principal **(Recomendada)** — la clave nunca sale de la bóveda; se admite la importación para quien ya tiene certificado.
  - B) Solo carga de PFX — más simple, pero la clave pasa por equipos del usuario.
  - C) Solo generación en plataforma — más seguro, pero obliga a renovar certificados vigentes.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-053): la plataforma genera clave y CSR con la clave privada en la bóveda de T06 (`integrationSecrets`, DEC-074) y admite PFX existente.
- **Bloquea:** RF-FIS-025; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-04 — Agrupación en rango de comprobantes B/C
- **Pregunta:** ¿Se ofrece la autorización agrupada en rango de comprobantes a consumidor final?
- **Contexto:** RN-03 §3.3 (V2 2712); reduce llamadas pero pierde el detalle por comprobante en ARCA.
- **Opciones:**
  - A) Opcional, apagada por defecto y limitada por el tope normativo **(Recomendada)** — disponible para tenants de gran volumen.
  - B) Siempre activa bajo el tope — menos llamadas, menos trazabilidad.
  - C) No ofrecerla — máxima trazabilidad; más llamadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-054, `PRM-FIS-012`; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-05 — Imputación de pagos parciales con conceptos de terceros
- **Pregunta:** ¿Cómo se reparte un pago parcial entre conceptos propios y conceptos por cuenta de terceros?
- **Contexto:** BASE §97.4 exige una política aprobada; impacta la rendición y el pasivo.
- **Opciones:**
  - A) Prorrata entre propio y terceros **(Recomendada)** — neutral y explicable; el ejemplo de RF-FIS-138 lo usa.
  - B) Primero terceros — protege al organismo; la cooperativa cobra último.
  - C) Primero propios — protege la caja de la cooperativa; puede incumplir convenios.
- **Impacto si no se responde:** se asume A, configurable por convenio si el convenio lo exige.
- **Bloquea:** RF-FIS-138, RF-FIS-139; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-06 — Ola del Libro IVA
- **Pregunta:** ¿El Libro IVA Ventas con criterio facturado entra en O4 o espera a O8?
- **Contexto:** la guía ubica los libros digitales en O8, pero el tenant piloto factura en producción desde O4/O6 y necesita su libro mensual.
- **Opciones:**
  - A) Libro IVA Ventas criterio facturado y carátula en O4; criterios percibido, LID, Mis Comprobantes y libro compras en O8 **(Recomendada)** — el piloto cumple desde el inicio.
  - B) Todo en O8 — el piloto exporta datos y arma el libro fuera.
  - C) Todo en O4 — adelanta trabajo que depende de compras (M12, O8).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-112 a RF-FIS-117; O4/O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-07 — Ola de RG 3571 y RG 5746/2025
- **Pregunta:** ¿El régimen de servicios públicos (RG 3571) y los datos de energía inyectada (RG 5746/2025) se entregan en O7 con servicios medidos?
- **Contexto:** MER-001/MER-002; los generadores aparecen con electricidad en O7.
- **Opciones:**
  - A) O7 **(Recomendada)** — coincide con la habilitación de electricidad y generación distribuida.
  - B) O8 con el resto de regímenes — riesgo de no informar en el primer período con generadores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-073, RF-FIS-128; O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-08 — Ola del modo pasarela
- **Pregunta:** ¿El modo pasarela (autorización para sistemas externos) se ofrece en O11 o antes?
- **Contexto:** RN-03 §1, §6: algunas cooperativas usan ProCoop solo para factura electrónica de otros sistemas.
- **Opciones:**
  - A) O11 con las APIs para terceros **(Recomendada)** — no distrae el núcleo.
  - B) O4 junto con ARCA — habilita tenants que solo quieren factura electrónica.
- **Impacto si no se responde:** se asume A; si un tenant lo requiere antes, se replanifica.
- **Bloquea:** RF-FIS-154 a RF-FIS-156; O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-09 — Jurisdicciones de IIBB en la primera entrega
- **Pregunta:** ¿Qué jurisdicciones de IIBB se implementan primero?
- **Contexto:** RN-01 §17.2 y RN-02 §13.3.1 relevan Córdoba, Buenos Aires, Entre Ríos, Santa Fe, La Pampa y Río Negro.
- **Opciones:**
  - A) Córdoba completa en O4 (padrón, percepción, CVP) y el resto como configuración en O8, adelantando la de un tenant piloto que la necesite **(Recomendada)**.
  - B) Todas en O4 — mayor esfuerzo inicial.
  - C) Solo Córdoba — riesgo con tenants de otras provincias o Convenio Multilateral.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-054): Córdoba en O4; el resto como configuración en O8.
- **Bloquea:** RF-FIS-087, RF-FIS-132; O4/O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-10 — Servicio de padrón
- **Pregunta:** ¿Se reemplaza WSPN3 por padrón A13 y constancia de inscripción?
- **Contexto:** RN-03 §5, §12.4; FIC 2.2.
- **Opciones:**
  - A) A13 + constancia de inscripción **(Recomendada)** — servicios vigentes con datos tipados.
  - B) Mantener WSPN3 mientras exista — compatibilidad, riesgo de baja del servicio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-016, RN-FIS-066; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-11 — Espera sincrónica de CAE en mostrador y cobranza
- **Pregunta:** ¿Qué ocurre si el CAE no llega dentro de la espera en una venta de mostrador o cobranza con factura?
- **Contexto:** RN-03 §3.1 (V2 727: 15 s y aviso).
- **Opciones:**
  - A) Esperar hasta 15 s (configurable); si no llega, registrar la operación, avisar "pendiente de ARCA" y entregar el comprobante al autorizarse **(Recomendada)** — no frena la caja.
  - B) Bloquear la operación hasta obtener el CAE — fila en caja ante caídas.
  - C) No esperar nunca — el cliente siempre se va sin comprobante autorizado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-056, `PRM-FIS-010`; O4/O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-12 — Adopción de tablas normativas por el tenant
- **Pregunta:** ¿La adopción de una versión publicada por la plataforma es explícita o automática?
- **Contexto:** BASE §52.4 y §105-7: tablas mantenidas por la plataforma y adoptadas por el tenant.
- **Opciones:**
  - A) Explícita, con aprobación del responsable fiscal (doble control opcional), aviso de vencimiento de adopción y alerta si se acerca la vigencia **(Recomendada)** — el tenant asume la decisión.
  - B) Automática en la fecha de vigencia con opción de rechazo en N días — menor riesgo de olvido; el tenant pierde control.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-002; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-13 — Informes ENACOM
- **Pregunta:** ¿Se descarta el informe histórico DNU 311/2020 (Res. 367/2020) de ENACOM y se mueve la configuración a la base?
- **Contexto:** RN-02 §13.2.
- **Opciones:**
  - A) Sí: configuración versionada en base y solo informes vigentes **(Recomendada)**.
  - B) Mantener el histórico como consulta — más trabajo sin uso actual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-146, RN-FIS-116; O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-14 — Alcance de informes ERSeP y ENARGAS
- **Pregunta:** ¿Se implementan todos los informes regulatorios relevados o solo los que usan los tenants piloto?
- **Contexto:** RN-11 §4, RN-02 §13.1, FIC 8.1, 8.2.
- **Opciones:**
  - A) Todos los relevados, como catálogo configurable por tenant, priorizando los del tenant piloto **(Recomendada)**.
  - B) Solo los del piloto — riesgo para cooperativas siguientes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-144, RF-FIS-145; O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-15 — SICORE de retenciones de Ganancias de sueldos
- **Pregunta:** ¿Quién genera la declaración SICORE de las retenciones de Ganancias de cuarta categoría?
- **Contexto:** BASE §104 (SUE-006, SUE-007) asigna el cálculo a M16; el agente presenta un único SICORE con retenciones a proveedores y a empleados.
- **Opciones:**
  - A) M16 calcula y publica las retenciones; M06 genera el archivo SICORE único del agente **(Recomendada)** — una sola declaración y un solo calendario.
  - B) M16 genera su propio archivo — dos archivos que el contador debe unir.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF de 5.10 (SICORE), JOB-FIS-13; O8/O9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-16 — Ola de FECESCOR
- **Pregunta:** ¿La rendición FECESCOR (terceros y tarjeta) se entrega en O8 o junto con la rendición de terceros en O5?
- **Contexto:** FIC 9.1, RN-11 §4.
- **Opciones:**
  - A) O8 **(Recomendada)** — depende de tesorería completa.
  - B) O5 — si un tenant piloto es socio de FECESCOR.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-140; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-17 — Revalidación periódica de padrón
- **Pregunta:** ¿La revalidación masiva actualiza la condición IVA automáticamente o propone cambios para aprobación?
- **Contexto:** RN-03 §5; un cambio de condición afecta la clase de los comprobantes futuros.
- **Opciones:**
  - A) Propone y requiere aprobación **(Recomendada)** — control humano y evidencia.
  - B) Actualiza automáticamente y notifica — menos trabajo, riesgo de errores de padrón.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-018, JOB-FIS-19; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-18 — Mantenimiento de padrones de IIBB (ex PA-CFG-05)
- **Pregunta:** ¿Los padrones fiscales los mantiene la plataforma o cada tenant?
- **Contexto:** Trasladada desde T04 con los padrones (CTR-DAT-13). Algunos padrones son públicos; otros solo se descargan con las credenciales del agente de recaudación (la cooperativa).
- **Opciones:**
  - A) Mixto: los públicos los ingesta la plataforma; los que requieren credenciales del agente los importa o integra cada tenant **(Recomendada)** - evita duplicar cargas y respeta credenciales.
  - B) Todo lo importa cada tenant - simple; trabajo repetido en cada cooperativa.
  - C) Todo en plataforma con credenciales delegadas - centralizado; problemático legalmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-FIS-168, RN-FIS-132; O4.
- **Estado:** Asumida la recomendada (DEC-072): opción A, aplicada en RF-FIS-168 y RN-FIS-132.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-22 — Residuales de estados, servicios internos y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones que faltaban (incluida `active` → `expired` de `provincialValidationCodes`), los valores de `regulatoryReportRuns.status`, los consumidores de los servicios internos de §11.1 y los destinos de las referencias que no lo indicaban?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 12 máquinas sin estado inicial, `provincialValidationCodes` con estados sin transiciones, `regulatoryReportRuns` sin valores y `fiscalProfiles.mipymeStatus` como estado sin valores; 18 §11 marcó [VERIFICAR] los consumidores de tres servicios; 06w marcó `fis.taxEngine.calculate` y `fis.withholding.calculate` sin invocador (son los nombres anteriores de `fis.service.calculateTaxes` y `fis.service.calculateWithholdings`); 03-er marcó referencias sin destino.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.12 el estado de alta de cada máquina, `provincialValidationCodes` `active` → `expired` por vencimiento de `validTo` y la máquina de `regulatoryReportRuns` con los valores de `regimeFilings`; aclarar que `mipymeStatus` no es estado; usar en §9 los nombres de §11.1; fijar consumidores según las invocaciones de los anexos (M04, M05 y M11 para `calculateTaxes`; M05 y M11 para `resolveDocumentClass`; M05 para `checkRegistryCoverage`); declarar destinos (`paymentOrders` y `suppliers` de M12; `withholdingTypes`, `regimeFilings`, `taxObligations`, `taxDefinitions` de M06) y tipar `arcaVatId` como código ARCA.
  - B) Dejar los estados iniciales implícitos (primer valor) y los consumidores como [VERIFICAR].
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados y servicios), 18 (contratos internos), T05 §7.2.1 y §8.1.
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.4, §7.14, §7.16, §7.24, §7.32, §8.12, §9.6 a §9.8, §11.1 y §12 (JOB-FIS-17 consume `int.arca.paramsSynced`, antes `int.arca.params-synced`). T11 debe registrar el alias en §12.4; T05 debe reflejar los destinos y los valores de `regulatoryReportRuns.status`; M04, M12 y M14 deben citar `fis.service.calculateTaxes` y `fis.service.calculateWithholdings`.
- **Sincronización (5-11-2026), Asumida (DEC-072):** las cuentas contables de `vatRates` (antes `accounts{ sales, purchases, salesPerception }`) y de `taxDefinitions` (antes `accountMap`) se retiran de M06 y pasan a `entityAccountAssignments` de M15 (`entityType` `vatRate` y `taxDefinition`), como T05 COL-FIS-16 y COL-FIS-18 (PA-DAT-04).
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M06 declara en §12.1 EVT-FIS-25 `fis.regimeFile.requested` (antes `fis.regime-file.requested`, nombre que solo figuraba en T06 §12), publicado al aprobar una `regimeFilings` que se entrega por conector; payload `filingId`, `legalEntityId`, `regimeCode`, `period`, `storedFileIds[]`; consumidor T06. T11 §12.4 registra el alias.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-23 — Conceptos accesorios admitidos dentro de la LQSP (DEC-093)
- **Pregunta:** ¿Qué conceptos pueden ir dentro de la liquidación de servicios públicos cuando la factura agrupada reúne servicios públicos y servicios de factura común?
- **Contexto:** DEC-093 prohíbe mezclar en un comprobante servicios de LQSP con servicios de factura común y admite en la LQSP solo los conceptos que el tenant declare accesorios con respaldo del contador. La marca es `conceptFiscalCases.publicServiceAccessory` con `accessoryApproval` (§7.37; RN-FIS-122; RN-FAC-040 de M05). Origen: contraste del documento externo `NucleoTransversal-Modelo`, aporte A1.
- **Opciones:**
  - A) **(Recomendada)** Solo tasas, contribuciones y cargos regulados que acompañan al servicio público y que el contador declare accesorios; internet, telefonía, TV, sepelio y servicios sociales siempre en factura común.
  - B) Lista cerrada precargada por la plataforma — riesgo de admitir conceptos sin respaldo del contador del tenant.
- **Impacto si no se responde:** ningún concepto queda marcado como accesorio y todo lo que no es tarifa del servicio público va a la factura común.
- **Bloquea:** carga de `conceptFiscalCases.publicServiceAccessory` en producción; RN-FAC-040 de M05.
- **Estado:** Pendiente (contador).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-24 — Norma, vía de autorización de la LQSP y RG 5003 y 5866/2026 (DEC-094)
- **Pregunta:** ¿Qué norma obliga a usar la LQSP, cuál es la vía de autorización vigente (CESP, CAE o CAEA) y qué efecto tienen las RG 5003 y 5866/2026?
- **Contexto:** M06 autoriza la LQSP con CESP separado del CAEA (PA-FIS-02, RF-FIS-071 a RF-FIS-074); el documento externo habla de CAE o CAEA y cita normas que la especificación no trataba. M05 también trata la LQSP como comprobante que exige documento del receptor mientras esto no se confirme (RN-FAC-162).
- **Opciones:**
  - A) **(Recomendada)** Mantener CESP separado del CAEA hasta que el contador confirme; la RG 3571/2013 se sigue tratando como régimen de información (RF-FIS-128).
  - B) Cambiar a CAE o CAEA — requiere DEC nueva que reemplace a DEC-094 y revisar RF-FIS-034, RF-FIS-071 a RF-FIS-074 y `numberSequences.authorizationType` de M05.
- **Impacto si no se responde:** se mantiene A; el riesgo es bloquear la facturación de servicios medidos en O7 si la vía no fuera la vigente.
- **Bloquea:** RF-FIS-071 a RF-FIS-074 (O7); RN-FAC-162 punto 4 de M05.
- **Estado:** Pendiente (contador).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-25 — Obligaciones y exenciones propias de la cooperativa (DEC-095)
- **Pregunta:** ¿Qué obligaciones y exenciones propias tiene cada cooperativa como contribuyente, con qué fundamento y vigencia? En particular: exención de Ingresos Brutos de Córdoba para cooperativas eléctricas, Contribución Especial sobre el Capital Cooperativo y reforma de Ganancias 2026.
- **Contexto:** M06 incorpora el registro genérico `ownTaxObligations` (§7.39; RF-FIS-169, RN-FIS-133) sin normas precargadas; M17 provee la base de capital por servicio o evento.
- **Opciones:**
  - A) **(Recomendada)** No precargar ninguna; el contador confirma cada una con su fundamento y vigencia y el tenant la da de alta en el registro.
  - B) Precargar las tres como plantillas de plataforma — riesgo de aplicar normas no confirmadas.
- **Impacto si no se responde:** el registro queda vacío y esas posiciones se siguen llevando fuera del sistema.
- **Bloquea:** carga productiva de `ownTaxObligations`; contrato de base de capital con M17.
- **Estado:** Pendiente (contador).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-FIS-26 — IVA del 27 % a responsables inscriptos según el uso del suministro (DEC-102)
- **Pregunta:** ¿Corresponde aplicar el 27 % a responsables inscriptos según el uso del inmueble (residencial, comercial, industrial, rural), y para qué servicios?
- **Contexto:** `vatRateMatrix` admite la condición opcional `supplyUsageClasses[]` (clase `premiseUsages.usageClass` de M01; antes `supplyUsageIds[]` del catálogo `premiseUsages`), desactivada por defecto con PRM-FIS-125 (RF-FIS-079, RN-FIS-073). Hoy el 27 % solo figura como dato de demostración (§18).
- **Opciones:**
  - A) **(Recomendada)** Condición por uso desactivada por defecto; se activa por tenant y servicio solo con la confirmación del contador.
  - B) Activarla por defecto para energía — riesgo de liquidar mal el IVA sin respaldo.
- **Impacto si no se responde:** la alícuota se resuelve sin considerar el uso del suministro.
- **Bloquea:** activación de PRM-FIS-125 en producción.
- **Estado:** Pendiente (contador).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-01 — Ingreso del socio sin contraseña
- **Pregunta:** ¿Se ofrece a los socios un ingreso sin contraseña y con qué mecanismo?
- **Contexto:** El solicitante lo dejó "a decidir". El enlace mágico falla a menudo en PWA instaladas (abre otro navegador) y es más phishing-propenso; el OTP funciona en todos los canales.
- **Opciones:**
  - A) OTP de 6 dígitos por correo/SMS como alternativa habilitable por tenant; sin enlace mágico **(Recomendada)** — simple, compatible con la PWA; cuenta como un factor.
  - B) OTP y enlace mágico — más cómodo en escritorio; riesgo de sesiones abiertas en navegadores ajenos.
  - C) Solo contraseña (y federados) — menor superficie; más pedidos de recuperación.
- **Impacto si no se responde:** se implementa A deshabilitado por defecto.
- **Bloquea:** RF-IAM-026, P-IAM-09, API-IAM-17/18.
- **Estado:** Respondida (DEC-066): contraseña o código OTP de 6 dígitos por correo o SMS, habilitable por tenant; sin enlace mágico (opción A).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-02 — CiDi Córdoba
- **Pregunta:** ¿En qué ola y con qué alcance se integra CiDi?
- **Contexto:** CoopOnline lo tiene como opción (var 40); el protocolo y el alta como aplicación requieren verificación con el Gobierno de Córdoba.
- **Opciones:**
  - A) Proveedor federado habilitable por tenant para socios en O1 (mecanismo) con activación cuando se publique el portal (O2), nivel mínimo 2 para vincular **(Recomendada)** — cubre cooperativas cordobesas sin bloquear el resto.
  - B) Solo en O2 junto con el portal — menor esfuerzo inicial.
  - C) Fuera de alcance hasta que una cooperativa lo pida — riesgo de regresión frente a CoopOnline.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-027, P-IAM-08, PRM-IAM-051/058.
- **Estado:** Respondida (DEC-067): mecanismo de proveedor federado en O1; CiDi habilitable por tenant al publicar el portal (O2); nivel mínimo 2 para vincular cuentas (opción A).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-03 — MFA para socios
- **Pregunta:** ¿Es obligatorio el segundo factor para los socios?
- **Contexto:** BASE §60 pide definir por separado la política de socios.
- **Opciones:**
  - A) Opcional, con step-up obligatorio para acciones sensibles (baja, cambio de titularidad, alta de representante, medio de pago, cambio de correo/teléfono) **(Recomendada)** — equilibrio entre seguridad y adopción.
  - B) Obligatorio para todos — más fricción, más soporte.
  - C) Nunca — riesgo alto en bajas y cambios de titularidad.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-043, PRM-IAM-029.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-04 — Separación de funciones estática
- **Pregunta:** ¿Los conflictos SoD estáticos bloquean la asignación o solo advierten?
- **Contexto:** Las cooperativas chicas tienen pocas personas; bloquear puede impedir operar.
- **Opciones:**
  - A) SoD dinámica siempre bloqueante; estática en modo advertencia con excepción aprobada, control compensatorio y reporte al síndico **(Recomendada)** — viable en cooperativas chicas.
  - B) Estática siempre bloqueante — más seguro, puede impedir operar.
  - C) Solo informe — control débil.
- **Impacto si no se responde:** A (`PRM-IAM-056 = warn`).
- **Bloquea:** RF-IAM-091, RN-IAM-040/042.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-05 — Operación fuera de la franja horaria
- **Pregunta:** ¿Qué pasa cuando un usuario opera fuera de la franja de su perfil?
- **Contexto:** ProCoop impide el ingreso (`ValidarUsoSistema`).
- **Opciones:**
  - A) Se permite iniciar sesión pero se bloquean las pantallas fuera de franja; cada operación puntual puede autorizarla un supervisor **(Recomendada)** — conserva el control y resuelve urgencias.
  - B) Bloqueo total del ingreso (igual a ProCoop).
  - C) Solo lectura fuera de franja.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-068, RN-IAM-024, PRM-IAM-030.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-06 — Acceso de la plataforma a datos operativos
- **Pregunta:** ¿Puede el personal de plataforma ver datos de una cooperativa sin autorización del tenant?
- **Contexto:** BASE §29 y §42.4 lo dejan pendiente; AGR-034 propone acceso temporal.
- **Opciones:**
  - A) Ninguno por defecto; solo con acceso temporal aprobado por el T-ADM, salvo emergencia por P-SUP con aviso inmediato y revisión posterior **(Recomendada)** — máxima confianza del tenant.
  - B) Lectura sin aprobación para P-SOP2 con registro — soporte más rápido, menor control.
  - C) Acceso pleno para P-SUP — contrario a BASE §54.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-111/112, RN-IAM-050/051.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-07 — Cobertura de la auditoría de lecturas
- **Pregunta:** ¿Qué lecturas se auditan?
- **Contexto:** BASE §54 exige cambios; lecturas "según necesidad". Auditar todo multiplica el volumen.
- **Opciones:**
  - A) Datos sensibles, informes, exportaciones, descargas masivas y búsquedas amplias **(Recomendada)**.
  - B) Toda lectura de fichas de personas y cuentas — mayor trazabilidad, alto volumen.
  - C) Solo exportaciones.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-135, RN-IAM-063.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-08 — Empleado y socio en la misma cooperativa
- **Pregunta:** ¿Cómo opera una persona que es empleada y socia del mismo tenant?
- **Contexto:** BASE §42.9 lo deja pendiente.
- **Opciones:**
  - A) Misma identidad, dos contextos (staff/portal) con cambio explícito; sus acciones sensibles sobre registros propios desde staff requieren otro usuario **(Recomendada)**.
  - B) Un contexto fusionado — riesgo de conflicto de interés.
  - C) Dos identidades separadas — duplicación y confusión.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-005, RN-IAM-029.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-09 — Roles predefinidos o configurables
- **Pregunta:** ¿Los roles del tenant son fijos, configurables o ambos?
- **Contexto:** BASE §42.9.
- **Opciones:**
  - A) Plantillas de plataforma versionadas (no editables) que el tenant instancia, clona y ajusta, más roles propios **(Recomendada)**.
  - B) Solo predefinidos — simple, poco flexible.
  - C) Solo configurables desde cero — difícil para cooperativas chicas.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-062.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-10 — Identificador de login del staff
- **Pregunta:** ¿El personal ingresa con alias, correo o ambos?
- **Contexto:** ProCoop usa alias; la identidad común se basa en correo.
- **Opciones:**
  - A) Ambos: alias único por tenant o correo **(Recomendada)** — continuidad con ProCoop.
  - B) Solo correo — más simple.
  - C) Solo alias.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-021, RN-IAM-004.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-11 — Passkeys (WebAuthn)
- **Pregunta:** ¿Se incluyen passkeys como factor en O1?
- **Contexto:** BASE §60 pide evaluarlas como opción resistente al phishing.
- **Opciones:**
  - A) Sí en O1, opcionales para todos y recomendadas para plataforma y T-ADM **(Recomendada)**.
  - B) En una ola posterior (Extensión).
  - C) No.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-022.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-12 — Prueba para vincular cuentas en el portal
- **Pregunta:** ¿Qué prueba debe aportar un socio para vincular una cuenta?
- **Contexto:** CoopOnline usa código de socio + clave/suministro (vars 7–8); el riesgo es que un tercero con una factura vieja vincule la cuenta.
- **Opciones:**
  - A) DNI/CUIT del titular + número de cuenta/suministro + un dato de un comprobante de los últimos 6 meses (número o importe), **o** código enviado al contacto registrado en M01 **(Recomendada)**.
  - B) DNI/CUIT + número de socio (como CoopOnline).
  - C) Solo validación presencial.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-048, P-IAM-15, PAN-IAM-32.
- **Estado:** Respondida (DEC-043): se admiten la opción A (código de factura + documento, o código enviado al contacto) y la validación presencial de la opción C, con intentos limitados (PRM-IAM-060).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-13 — SMS como segundo factor
- **Pregunta:** ¿Se admite SMS como factor para el personal?
- **Contexto:** NIST lo considera restringido (SIM swapping).
- **Opciones:**
  - A) Permitido para roles operativos y socios; prohibido para plataforma, T-ADM y T-USR **(Recomendada)**.
  - B) Permitido para todos.
  - C) Prohibido para todo el staff.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-044, PRM-IAM-028.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-14 — Suspensión de usuarios inactivos
- **Pregunta:** ¿Se suspenden automáticamente los usuarios staff inactivos?
- **Contexto:** Cuentas olvidadas son un riesgo frecuente.
- **Opciones:**
  - A) Sí, a los 90 días sin ingreso, con aviso 7 días antes; reactivación por T-ADM/T-USR **(Recomendada)**.
  - B) No; solo reporte.
  - C) Sí, a los 30 días.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-076, JOB-IAM-07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-15 — Alta automática por SSO
- **Pregunta:** ¿Se crean usuarios automáticamente al primer ingreso por el SSO del tenant?
- **Contexto:** BASE §60: tener sesión en un proveedor no concede roles ni acceso.
- **Opciones:**
  - A) No; requiere invitación previa **(Recomendada)**.
  - B) Sí, con pertenencia sin roles hasta que un T-ADM asigne.
  - C) Sí, con rol por grupo del IdP.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-028, P-IAM-07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-16 — Recertificación periódica
- **Pregunta:** ¿Con qué frecuencia y para qué roles se recertifican los accesos?
- **Contexto:** Buena práctica de auditoría (síndico).
- **Opciones:**
  - A) Semestral para asignaciones con capabilities sensibles; suspensión si no se confirma **(Recomendada)**.
  - B) Anual para todas.
  - C) Sin recertificación.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-IAM-075, JOB-IAM-06.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-17 — Alcance del consejero y del síndico
- **Pregunta:** ¿Qué ven el consejero y el síndico?
- **Contexto:** El maestro los define como lectura institucional y solo lectura con auditoría; hay datos sensibles (salud, sueldos individuales).
- **Opciones:**
  - A) Síndico: lectura de todos los módulos y auditoría, sin datos de salud ni legajos individuales salvo pedido justificado (acceso temporal aprobado por T-ADM); consejero: tableros agregados, institucional y actas **(Recomendada)**.
  - B) Síndico con lectura total incluida salud y sueldos.
  - C) Ambos solo tableros agregados.
- **Impacto si no se responde:** A.
- **Bloquea:** Matriz 4.3–4.4 (T-SIN, T-CJO).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-IAM-18 — Cierre de residuales del anexo (capabilities, estados, referencias y CU)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis: celdas de capability sin capability, scopes `erp.*` no registrados, estados sin estado inicial o sin transiciones, referencias sin destino, colecciones sin tabla de campos y el CU-SEG-01 duplicado con T08?
- **Contexto:** 33 filas de §11 citaban "pública", "sesión", "token", "step-up" o comodines; T10 usa `erp.catalog:read` y `erp.finance:read` sin registro; 12 colecciones no declaraban estado inicial y 6 solo listaban estados; 20 colecciones del §7 no tenían tabla de campos; el ID CU-SEG-01 es de T08.
- **Opciones:**
  - A) Usar `public: true` (con la condición entre paréntesis) en las rutas sin sesión; registrar capabilities implícitas no asignables (`iam.sesion.autenticada`, `iam.ia.decisiones.registrar`, `pla.archivos.ver`, `pla.archivos.subir`, `pla.misProcesos.ver`) y técnicas (`pla.salud.sondear`, `mig.clavesHeredadas.resolver`) más `mig.miHistorial.ver`; mapear `erp.catalog:read` → `stk.articulos.ver` y `erp.finance:read` → `tes.posicion.ver` en §4.4.3; agregar la tabla normalizada §8.11 con valores para `profileAssignments` (`active`, `expired`, `revoked`), `sodRules` (`active`, `inactive`), `sessions` y `apiCredentials`; declarar destinos y nombres canónicos de T05 (`refreshFamilyId`, `screenProfileId`; `promptTemplateCode` porque las plantillas de prompt viven en código); agregar las tablas de campos del §7.20 derivadas del texto y de T05 (obligatoriedad por regla); renumerar el CU propio a CU-IAM-11. **(Recomendada)**.
  - B) Mantener el texto y documentar las excepciones en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** contratos OpenAPI (seguridad por operación), diagramas de estados y ER de T02.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-01 — Momento de la suscripción de capital

**Pregunta:** ¿Cuándo se registra la suscripción de cuotas sociales?
**Contexto:** ProCoop admite suscripción en la afiliación (V2 2636) o al facturar (V2 73).
**Opciones:**
- A) **(Recomendada)** En la afiliación (aprobación del ingreso), con plan de integración en cuotas: refleja el compromiso legal desde el ingreso.
- B) Al facturar cada cuota: más simple, pero el libro no muestra suscripción completa hasta terminar de facturar.
- C) Al activar el primer servicio: útil si el ingreso se tramita junto con el servicio, pero desacopla de la aprobación.
**Impacto si no se responde:** se usa A; el libro de asociados podría diferir del criterio histórico.
**Bloquea:** RF-INS-034, JOB-INS-01, migración de `CAPITAL`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-02 — Cobro de cuotas sociales en la factura del servicio

**Pregunta:** ¿La cuota social se cobra dentro de la factura del servicio o en un documento propio?
**Contexto:** BASE §97.7 la admite en la factura; MER-010/§52 exige separación de conceptos.
**Opciones:**
- A) **(Recomendada)** En la factura del servicio como renglón identificado, con auxiliar separado y leyenda: aprovecha la cobranza existente.
- B) Documento propio de capital (no fiscal o fiscal según asesoría): máxima separación, más costo de cobranza.
- C) Sin cobro periódico (integración al ingreso).
**Impacto si no se responde:** se usa A; M04/M05 deben soportar renglón capitalizable.
**Bloquea:** PRM-INS-017, M04/M05 en O5.
**Estado:** Respondida (DEC-061): opción A, renglón identificado en la factura del servicio con auxiliar separado y leyenda.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-03 — Ola del capital social

**Pregunta:** ¿El piloto necesita cobrar cuotas sociales desde la primera facturación?
**Contexto:** Si la cooperativa piloto factura capital, M05 en O5 debe registrar el movimiento; si no, todo el capital va a O10.
**Opciones:**
- A) **(Recomendada)** O5 mínimo (rubros, regla, `billed`/`paid`, estado de cuenta) y O10 el resto: evita reprocesar facturas.
- B) Todo en O10 con migración de saldos de apertura: menos alcance temprano, requiere reconstrucción posterior de movimientos.
**Impacto si no se responde:** se planifica A con PRM-INS-055 apagado hasta confirmar.
**Bloquea:** RF-INS-035, plan de olas.
**Estado:** Respondida (DEC-019): opción A, mínimo en O5 (rubros, regla, facturado/pagado, estado de cuenta) y el resto en O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-04 — Política de reembolso de capital

**Pregunta:** ¿Qué límite anual, orden, compensaciones e intereses establece el estatuto?
**Contexto:** ProCoop solo emite un comprobante de rescate; la ley permite limitar el reembolso anual.
**Opciones:**
- A) **(Recomendada)** Límite 5 % del capital integrado del último balance, orden por fecha de solicitud, compensación de deuda exigible, sin interés salvo estatuto.
- B) Sin límite: reembolso inmediato aprobado por consejo.
- C) Configurable por estatuto con valores cargados por la cooperativa al implementar.
**Impacto si no se responde:** se aplica A, que podría contradecir el estatuto.
**Bloquea:** RF-INS-051, JOB-INS-11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-05 — Votación electrónica y asamblea a distancia

**Pregunta:** ¿Se habilita votación electrónica o solo registro de votaciones presenciales?
**Contexto:** BASE §27 pide votación formal fuera de encuestas; el estatuto y el INAES condicionan la modalidad a distancia.
**Opciones:**
- A) **(Recomendada)** Registro de votaciones presenciales/híbridas (recuento por escrutadores), con votación electrónica como extensión habilitable por tenant cuando el estatuto la admita.
- B) Votación electrónica desde el inicio con identidad fuerte.
- C) Solo registro del resultado en el acta.
**Impacto si no se responde:** se aplica A.
**Bloquea:** PRM-INS-051, RF-INS-086.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-06 — Asambleas de distrito y delegados

**Pregunta:** ¿La cooperativa realiza asambleas de distrito con elección de delegados?
**Contexto:** ProCoop tiene informe de delegados; la ley lo exige superado cierto número de asociados.
**Opciones:**
- A) **(Recomendada)** Modelo de distritos disponible y desactivado por defecto (PRM-INS-057), con alerta por umbral.
- B) Siempre asamblea directa.
- C) Siempre por distritos.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-084, RN-INS-038, PAN-INS-29.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-07 — Criterios de elegibilidad del padrón

**Pregunta:** ¿Qué deudas inhabilitan para votar: capital vencido, servicios, ambas o ninguna?
**Contexto:** ProCoop filtra por deuda de capital (V2 2606/2429) y por facturas impagas; la condición depende del estatuto.
**Opciones:**
- A) **(Recomendada)** Solo deuda de capital vencida por encima del umbral, más fecha límite de alta; deuda de servicios solo si el estatuto lo prevé expresamente.
- B) Capital y servicios.
- C) Sin restricción por deuda.
**Impacto si no se responde:** se aplica A con leyenda de padrón preliminar.
**Bloquea:** RF-INS-047, RF-INS-079, RN-INS-021.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-08 — Firma de actas y libros

**Pregunta:** ¿Cómo se firman las actas y se llevan los libros?
**Contexto:** ProCoop guarda PDF y estado de firma; los libros pueden requerir rúbrica o medios digitales autorizados.
**Opciones:**
- A) **(Recomendada)** Firma ológrafa escaneada con hash y registro de firmantes; adaptador de firma electrónica/digital para cuando el organismo lo admita.
- B) Firma digital obligatoria desde el inicio.
- C) Solo PDF sin control de firmas.
**Impacto si no se responde:** se aplica A.
**Bloquea:** PRM-INS-052, RF-INS-087, RF-INS-088, RF-INS-092.
**Estado:** Resuelta por DEC-078: firma digital con proveedor licenciado mediante el perfil SIG-ACTA-INSTITUCIONAL de T11 §18.5 (O8/O9); la opción A queda como contingencia (`handwrittenScan`) mientras no haya proveedor.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-09 — Formato del libro digital y presentaciones INAES

**Pregunta:** ¿Qué formato y canal exige el INAES y qué categorías usa la cooperativa? Además (10-11-2026, DEC-096; para el asesor legal): con varias entidades jurídicas en el tenant, ¿la norma permite que alguno de los libros sociales (actas de consejo, asamblea, sindicatura, asistencia, Registro de Asociados) se comparta entre entidades? El anexo asume que no: cada entidad lleva sus libros y numera actas, folios y certificados por separado (§7.3) [VERIFICAR].
**Contexto:** ProCoop exporta altas y bajas por lotes; no hay especificación de formato en las fuentes.
**Opciones:**
- A) **(Recomendada)** Adaptador de exportación versionado; primera versión CSV/XLSX según plantilla que provea la cooperativa; categorías desde catálogo de plataforma editable.
- B) Solo PDF del libro.
**Impacto si no se responde:** se entrega A con plantilla genérica.
**Bloquea:** RF-INS-021 a RF-INS-028, RF-INS-092.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-10 — Canal de pago de honorarios

**Pregunta:** ¿Los honorarios se pagan por orden de pago de tesorería o por un circuito de liquidación tipo nómina?
**Contexto:** BASE §104.3: no son sueldo.
**Opciones:**
- A) **(Recomendada)** Orden de pago en M14 con retención de M06 y comprobante del perceptor cuando corresponda.
- B) Liquidación en M16 con concepto no remunerativo: mezcla dominios.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-096.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-11 — Forma del retorno de excedentes

**Pregunta:** ¿Cómo se entrega el retorno: capitalización, crédito en cuenta, pago o mixto?
**Contexto:** La asamblea decide; afecta M07 y M14.
**Opciones:**
- A) **(Recomendada)** Capitalización por defecto con opción de crédito en cuenta, definida en cada distribución.
- B) Pago en efectivo/transferencia.
- C) Crédito en la próxima factura.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-064, JOB-INS-07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-12 — Nombre del campo que apunta al padrón de asociados (PA 9 del pendiente de cierre)

**Pregunta:** ¿Cómo se llama el campo que referencia a `associateMemberships` en las colecciones de M17 y en los eventos `ins.membership.*`?
**Contexto:** el anexo usaba `membershipId`, que coincide con la referencia a `memberships` (relación usuario–tenant) de T02 y produce ambigüedad en T05 y en los consumidores de eventos.
**Opciones:**
- A) **(Recomendada)** `associateMembershipId`, alineado con el nombre de la colección `associateMemberships`.
- B) Mantener `membershipId` y aclarar el destino en cada referencia.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7, EVT-INS-01 a EVT-INS-07, JOB-INS-07; T05 §7.7.
**Estado:** Asumida la recomendada (DEC-072). Se renombra en todo el anexo con la nota "antes `membershipId`"; T05 y los consumidores de `ins.membership.*` (M01, M04, M05, M18, M19, T09, T11) adoptan el nombre nuevo.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INS-13 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y tipos de evento)

**Pregunta:** ¿Cómo se cierran los residuales que detectaron los entregables regenerados (estados, referencias sin destino, nombres de T05 y tipos de evento fuera de convención)?
**Contexto:** el índice de secuencias y estados, el modelo entidad-relación y el catálogo de eventos marcaron en M17 máquinas sin estado inicial, `associateMemberships` sin transiciones (el §8.1 no nombraba la colección), referencias sin destino, nombres que difieren de T05 §7.2 y ocho tipos de evento de cuatro segmentos.
**Opciones:**
- A) **(Recomendada)** Explicitar el estado inicial de cada máquina; titular el §8.1 con `associateMemberships.status`; declarar destinos (`productGroupIds` → `accountRubrics` de M15, como `billableConcepts.accountingRubricId` de M02; `creditRef` → `creditBalances` de M07; `withholdingRef` → `withholdingsApplied` de M06; `savedFilterSetId` → `dataTableViews` de T03; `templateId` → `documentTemplates` de T11; `documentRef`/`receiptRef` no son referencias); adoptar los nombres de T05 (`fromAssociateMembershipId`, `toAssociateMembershipId`, `grantorAssociateMembershipId`, `proxyAssociateMembershipId`, `reentryOfAssociateMembershipId`, `storedFileId`/`storedFileIds` en lugar de `pdfObjectKey`/`files[].objectKey`, `legalEntityId` en `capitalMovements`); renombrar los eventos a `ins.capitalMovement.*`, `ins.capitalTransfer.executed`, `ins.capitalRefund.*`, `ins.surplusDistribution.*` e `ins.inaesReport.submitted`, con el nombre anterior como alias.
- B) Mantener los nombres actuales y documentar las diferencias en T05 y T11.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7, §8, §12.1; consumidores de EVT-INS-08 a 13 (M01, M05, M07, M14, M15, M19, T09) y de EVT-INS-21 (T11).
**Estado:** Asumida la recomendada (DEC-072). `fromStatus`/`toStatus` de `membershipEvents` toman los valores de `associateMemberships.status`. PRM-INS-006 es un parámetro que consulta M02, no un servicio interno. T05 debe reflejar `reentryOfAssociateMembershipId`, `storedFileId` en `shareCertificates`, `minutes` y `associateRegisterEditions`, y los destinos nuevos; T11 debe registrar los alias de evento en §12.4.
**Sincronización (5-11-2026), Asumida (DEC-072):** cada alias de evento resuelve a un solo canónico (T11 §12.4, PA-WFL-23): M17 se suscribe directamente a `fac.debitNote.issued` (EVT-FAC-11) y la nota de alias de §12 se corrige con "antes".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-01 — Modelo de contratación de proveedores

- **Pregunta:** ¿Las cuentas con proveedores externos las contrata cada cooperativa o CoopApps como plataforma?
- **Contexto:** fiscal y pasarelas exigen titularidad del tenant; mensajería, mapas e IA pueden ser compartidas con cuota (RF-INT-013).
- **Opciones:**
  - A) Credenciales propias del tenant para fiscal, bancos y pasarelas; conexiones de plataforma compartidas para email, SMS, mapas e IA, reemplazables por las del tenant **(Recomendada)** — menor fricción de alta y costo trasladable.
  - B) Todo con credenciales del tenant — más trabajo de alta por cooperativa.
  - C) Todo de plataforma — imposible para fiscal y cobros (titularidad).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-INT-010…013; FI-INT-61, 64, 69, 90.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-02 — Bóveda de secretos y KMS

- **Pregunta:** ¿Qué servicio de gestión de claves se usa para la bóveda?
- **Contexto:** RF-INT-014…021 exigen envelope encryption y separación por ambiente.
- **Opciones:**
  - A) Envelope encryption propio en Mongo con clave maestra en un KMS gestionado del proveedor de nube, detrás de una interfaz agnóstica **(Recomendada)** — portable y auditable.
  - B) HashiCorp Vault autogestionado — más operación.
  - C) Clave maestra en variable de entorno — no cumple separación ni rotación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** O0 (bóveda), RF-INT-014…021.
- **Estado:** Respondida (DEC-074): opción A, con clave maestra en AWS KMS detrás de una interfaz agnóstica de proveedor; nunca se transcriben ni registran valores.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-03 — Custodia del certificado ARCA

- **Pregunta:** ¿Dónde se genera la clave privada del certificado de ARCA?
- **Contexto:** ProCoop guarda el PFX sin contraseña en carpeta (RN-03 §2.1).
- **Opciones:**
  - A) Clave y CSR generados en el servidor; la clave nunca sale de la bóveda **(Recomendada)** — sin manipulación de archivos sensibles.
  - B) La cooperativa sube un PFX con contraseña — permitido como alternativa.
  - C) Reutilizar el certificado de ProCoop — se desaconseja (comprometido).
- **Impacto si no se responde:** A con B como alternativa.
- **Bloquea:** RF-INT-024; FI-INT-01; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-04 — CAE o CAEA en facturación masiva

- **Pregunta:** ¿La facturación masiva usa CAE por lotes o CAEA?
- **Contexto:** LAG emite ≈ 12.500 comprobantes/mes; el CAEA obliga a informar después.
- **Opciones:**
  - A) CAE en lotes como modo normal y CAEA solo como contingencia, si el tenant lo habilita **(Recomendada)** — validación inmediata.
  - B) CAEA como modo normal — más rápido, más riesgo de rechazos tardíos.
  - C) Solo CAE, sin contingencia — la caída de ARCA frena la emisión.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-02/03; PRM-INT-018; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-05 — Proveedor de WhatsApp

- **Pregunta:** ¿WhatsApp se integra directo con Meta o mediante un BSP (ej. Trii)?
- **Opciones:**
  - A) Meta Cloud API directo, con adaptador BSP opcional por tenant **(Recomendada)** — menor costo y sin intermediarios.
  - B) Solo BSP — servicios de bandeja ya resueltos, mayor costo.
  - C) Ambos obligatorios — duplicación.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-63; CTR-INT-09; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-06 — Proveedor de SMS

- **Pregunta:** ¿Qué proveedor de SMS usa la plataforma?
- **Contexto:** ProCoop usa un proveedor local con lotes de 50.
- **Opciones:**
  - A) Un agregador local argentino como conexión de plataforma, con interfaz que permita agregar otro (ej. Twilio) por tenant **(Recomendada)** — costo y entregabilidad locales.
  - B) Proveedor global único — más caro por mensaje.
  - C) Sin SMS — perdería OTP y avisos.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-64; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-07 — Proveedor y dominio de email

- **Pregunta:** ¿Cómo se envía el email de cada tenant?
- **Opciones:**
  - A) Proveedor transaccional de plataforma con dominio verificado por tenant (SPF/DKIM/DMARC) y SMTP propio opcional **(Recomendada)**.
  - B) Solo SMTP del tenant — entregabilidad variable.
  - C) Dominio compartido de CoopApps — afecta marca y reputación.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-61; CTR-INT-13; O0–O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-08 — Proveedor de IA y datos personales

- **Pregunta:** ¿Con qué proveedor(es) de IA y bajo qué política de datos?
- **Opciones:**
  - A) Abstracción multi-proveedor, redacción de datos personales no necesarios, sin entrenamiento con datos del cliente, activación opt-in por tenant **(Recomendada)**.
  - B) Proveedor único — dependencia.
  - C) Sin IA — se pierde la propuesta de valor de CNX.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-086; FI-INT-90; PRM-INT-049.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-09 — Agente local

- **Pregunta:** ¿Se desarrolla un agente propio para hardware local?
- **Opciones:**
  - A) Agente propio CoopApps (O10), saliente por WebSocket, multiplataforma **(Recomendada)** — reemplaza Agente/Integra con seguridad.
  - B) Solo impresión desde el navegador (PDF) — sin turnero ni periféricos.
  - C) Software de terceros por dispositivo — heterogéneo.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-084; FI-INT-91…95.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-10 — Reconsulta de webhooks

- **Pregunta:** ¿Se exige reconsultar siempre al proveedor antes de dar por confirmado un pago?
- **Opciones:**
  - A) Siempre, sin opción de desactivarlo en pagos **(Recomendada)** — cierra el fraude por aviso falso (RN-INT-009).
  - B) Confiar en webhooks firmados — más rápido, menos seguro.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-INT-020; FI-INT-43…54.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-11 — SIRO por archivo o por API

- **Pregunta:** ¿Qué canal de SIRO se implementa para la cooperativa piloto (la base relevada LAG usa archivo y API)?
- **Opciones:**
  - A) Ambos: archivos para publicación/rendición y API para botón/QR y consulta **(Recomendada)** — refleja el uso real.
  - B) Solo archivos — sin pago online inmediato.
  - C) Solo API — dependencia total del servicio en línea.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-36/37; CTR-INT-01; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-12 — Layouts de archivos

- **Pregunta:** ¿Cómo se definen los formatos de archivos de entes y bancos?
- **Opciones:**
  - A) Layouts declarativos versionados + hooks de código acotados para lo no declarable **(Recomendada)**.
  - B) Un programa por formato — como ProCoop, caro de mantener.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-058…061; FI-INT-35…42, 56, 57.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-13 — Pasarelas en O5

- **Pregunta:** ¿Qué pasarelas se construyen en O5?
- **Opciones:**
  - A) SIRO como Núcleo; Pagos360 y Mercado Pago como Estándar; el resto bajo demanda de un tenant **(Recomendada)**.
  - B) Todas las de ProCoop en O5 — demora la ola.
  - C) Solo SIRO — no cumple la BASE.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-43…54; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-14 — Primer adaptador de telemedición

- **Pregunta:** ¿Con qué sistema de telemedición se empieza?
- **Opciones:**
  - A) El que use la cooperativa piloto de servicios medidos; el resto bajo demanda **(Recomendada)**.
  - B) Los 11 sistemas relevados — esfuerzo alto sin uso confirmado.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-75; O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-15 — Retención de la bitácora

- **Pregunta:** ¿Cuánto tiempo se guardan los cuerpos de request/response?
- **Opciones:**
  - A) Cuerpos saneados 13 meses; metadatos 10 años (plazo de conservación contable) **(Recomendada)**.
  - B) Todo 10 años — costo y exposición de datos.
  - C) 90 días — insuficiente para auditorías fiscales.
- **Impacto si no se responde:** A.
- **Bloquea:** PRM-INT-010/011; JOB-INT-15.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-16 — Ambientes de prueba de proveedores

- **Pregunta:** ¿Quién tramita las credenciales de homologación (ARCA, pasarelas)?
- **Opciones:**
  - A) GoodApps mantiene cuentas de homologación de plataforma para desarrollo; cada tenant usa las suyas para su prueba previa a producción **(Recomendada)**.
  - B) Solo simuladores — no valida contra el proveedor real.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-INT-028…031.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-17 — Links viejos de CoopOnline

- **Pregunta:** ¿Se redirigen los links del portal viejo (facturas, pagos) al nuevo?
- **Opciones:**
  - A) Redirecciones durante 12 meses desde el corte **(Recomendada)** — no rompe links en facturas impresas.
  - B) Sin redirección — reclamos de socios.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-101; T07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-18 — Interbanking

- **Pregunta:** ¿Cómo se autentica CoopApps ante Interbanking?
- **Opciones:**
  - A) Aplicación registrada por cada cooperativa con sus credenciales **(Recomendada)**.
  - B) Aplicación de plataforma — requiere convenio de CoopApps con Interbanking.
  - C) Solo archivos — sin automatización.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-58; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-19 — Clave de Google Maps

- **Pregunta:** ¿La clave de mapas es de la plataforma o del tenant?
- **Opciones:**
  - A) Clave de plataforma restringida, con cuota por tenant y opción de clave propia **(Recomendada)**.
  - B) Siempre clave del tenant — fricción de alta.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-69/70; PRM-INT-036.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-20 — CiDi

- **Pregunta:** ¿Se integra CiDi para el portal del socio?
- **Opciones:**
  - A) Sí, como Extensión en O10, si la provincia habilita la integración **(Recomendada)**.
  - B) En O2 junto con el portal — adelanta un trámite externo incierto.
  - C) No integrar.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-68.
- **Estado:** Respondida (DEC-067, pregunta equivalente PA-IAM-02): mecanismo federado en O1; adaptador CiDi en O2 habilitable por tenant, nivel mínimo 2; apagado mientras la provincia no habilite la aplicación.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-21 — Devoluciones por API

- **Pregunta:** ¿Las devoluciones a socios se ejecutan por API de la pasarela?
- **Opciones:**
  - A) Sí, donde el proveedor lo permita, con aprobación de M07 y doble control **(Recomendada)**.
  - B) Siempre manual en el portal del proveedor.
- **Impacto si no se responde:** A.
- **Bloquea:** RN-INT-056; FI-INT-43/44.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-22 — Proveedor de firma

- **Pregunta:** ¿Qué proveedor de firma electrónica/digital se usa?
- **Opciones:**
  - A) Interfaz de firma propia; proveedor concreto a decidir antes de O3 (firma de instalación), evaluando Encustody y alternativas **(Recomendada)**.
  - B) Encustody directamente — continuidad con ProCoop.
  - C) Solo firma en pantalla sin proveedor — menor valor probatorio.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-89; O3.
- **Estado:** Respondida (DEC-078): opción A. Firma electrónica con OTP por defecto (instalación, convenios, trámites); firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9); el proveedor concreto se elige antes de O3 detrás de la interfaz de firma propia.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-23 — IVR

- **Pregunta:** ¿Se integra un IVR?
- **Opciones:**
  - A) Sí, como Extensión en O10 sobre la API interna **(Recomendada)**.
  - B) No integrar.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-66.
- **Alcance aclarado (DEC-104):** la opción A es la conexión opcional con un discador o IVR externo que consume la exportación `ivr_export` de T09 (mecanismo base, O6, siempre disponible) y devuelve resultados; no es un canal de voz propio ni reemplaza la exportación. Con la opción B, los avisos telefónicos se siguen haciendo con la exportación manual.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-24 — Jurisdicciones fuera de Córdoba

- **Pregunta:** ¿En qué ola entran los fiscos y reguladores de otras provincias?
- **Opciones:**
  - A) Motor configurable en O4/O7 con Córdoba; otras jurisdicciones como configuración cuando haya un tenant de esa provincia **(Recomendada)**.
  - B) Todas desde el inicio.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-21, 22, 29.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-25 — Controladores fiscales

- **Pregunta:** ¿Se soportan controladores fiscales (Hasar/Epson)?
- **Opciones:**
  - A) No por defecto (la cooperativa emite electrónica); solo si un tenant lo exige, en O10 **(Recomendada)**.
  - B) Sí desde O5 en caja.
- **Impacto si no se responde:** A.
- **Bloquea:** FI-INT-92.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-26 — Estados de `aiUsageLogs`

- **Pregunta:** ¿Qué valores toma `aiUsageLogs.status`?
- **Contexto:** §7.16 y §8.12 declaraban `succeeded`, `failed` y `blockedByPolicy` [VERIFICAR]; el registro es inmutable y solo cambia `outcome`.
- **Opciones:**
  - A) `ok`, `error` y `blocked` (bloqueada por política o porque la IA está apagada en el tenant) **(Recomendada)**.
  - B) Sin estado: solo un código de resultado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-INT-086; FI-INT-90.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-INT-27 — Cierre de residuales del anexo (tipos de evento, estados, referencias y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 27 tipos de evento usaban guiones fuera de la convención `&lt;mod>.&lt;agregado>.&lt;hecho>` en camelCase; 7 máquinas descritas en texto no declaraban el estado de alta; 3 referencias no tenían destino en la definición del campo; 10 colecciones del §7 no tenían tabla de campos; 4 filas de §11 citaban reglas de acceso en lugar de una capability.
- **Opciones:**
  - A) Renombrar los tipos a camelCase y conservar el nombre anterior como alias en la descripción del evento de §12 (T11 los registra en su §12.4); agregar §8.13 con una fila por transición; declarar destinos (`externalTransactionNumber`, antes `externalTransactionId`, porque es un número del ente y no una referencia); agregar las tablas de campos de §7.18 (derivadas del texto y de T05, obligatoriedad por regla); usar `public: true` (con la condición) y `int.agentes.ejecutar` en §11. **(Recomendada)**.
  - B) Mantener los nombres con guiones y registrarlos como excepción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** catálogo de eventos (T11 §12.4), diagramas de estados y contratos de T06.
- **Estado:** Asumida (DEC-072): opción A.
- **Sincronización (5-11-2026), Asumida (DEC-072):** los tipos de evento que T06 consume con guion (§12, eventos consumidos) pasan a camelCase con el nombre anterior como "antes": `fis.regimeFile.requested`, `cob.paymentIntent.requested`, `cob.debtPublication.requested`, `cob.directDebit.batchRequested`, `med.readingRoute.published`, `com.message.dispatchRequested`, `per.person.fiscalLookupRequested`, `tes.bankSync.requested`, `tes.paymentFile.requested` y `sue.payrollFiles.requested`; CU-INT-09 dispara con el canónico `mor.interruption.approved` (EVT-MOR-12; antes `mor.cut-order.approved`). Los productores (M06, M07, M03, T09, M01, M14, M16) deben declarar esos nombres en su §12 y T11 §12.4 registrar los alias.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-01 — Regularización de consumos estimados
- **Pregunta:** cuando llega la lectura real después de uno o más estimados, ¿cómo se corrige lo facturado de más o de menos?
- **Contexto:** ProCoop solo bonifica metros en la factura siguiente (RN-06 §15). La implicancia RN-06 §21.8 pide poder refacturar. Los entes provinciales (ERSEP, EPRE, OCEBA) pueden exigir uno u otro (Duda 12).
- **Opciones:**
  - A) Configurable por servicio, con compensación en unidades por defecto **(Recomendada)** — replica ProCoop y deja refacturar donde el regulador lo pida.
  - B) Solo compensación en unidades — más simple; no cubre a los entes que exigen refacturación.
  - C) Siempre refacturación por NC/ND — más exacta; genera muchos comprobantes y trabajo para M05.
- **Impacto si no se responde:** se asume A con compensación por defecto.
- **Bloquea:** RF-MED-079, RN-MED-089, PRM-MED-107 (O7).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-02 — Método de estimación por defecto
- **Pregunta:** ¿qué método de estimación se usa por defecto y cuál es la cadena de respaldo cuando falta historia?
- **Contexto:** ProCoop usa el promedio simple de N períodos y puede dividir por cero si no hay historia (Duda 2).
- **Opciones:**
  - A) Promedio de los últimos 6 períodos reales; si no hay, el mismo mes del año anterior; si no hay, el promedio de la categoría; si no hay, consumo declarado o mínimo de la categoría **(Recomendada)** — siempre tiene un valor trazable.
  - B) Promedio de 12 períodos sin respaldo — igual a ProCoop; deja casos sin estimar.
  - C) Siempre promedio de la categoría — simple, pero poco fiel al usuario.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-074, RN-MED-084, PRM-MED-100 (O7).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-03 — Curvas de carga
- **Pregunta:** ¿se almacenan curvas de carga (lecturas por intervalo) de grandes usuarios en la primera entrega?
- **Contexto:** ProCoop no tiene curvas de carga (RN-06 §19.2, Duda 15). La implicancia §21.11 pide planificarlas.
- **Opciones:**
  - A) Dejar el modelo preparado (`intervalReadings`) y construir la importación como Extensión **(Recomendada)** — sin costo inicial y sin rehacer el modelo.
  - B) Construirlas en O7 — solo vale si la cooperativa piloto tiene grandes usuarios con AMI.
  - C) No contemplarlas — obliga a rediseñar más adelante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-111, PRM-MED-159.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-04 — Modalidad de prepago
- **Pregunta:** ¿qué modalidades de prepago se implementan: token (STS) o crédito en línea, y con qué proveedor primero?
- **Contexto:** ProCoop integra Discar, Boiero, CashPower, C_Token y Hexing (RN-06 §19.2). La BASE §98 deja pendiente si la cooperativa piloto usa prepago.
- **Opciones:**
  - A) Ambas modalidades mediante el contrato de conector; se construye primero el proveedor de la cooperativa piloto **(Recomendada)**.
  - B) Solo token — cubre la mayoría de los medidores prepagos, pero no el crédito en línea.
  - C) Diferir el prepago completo — deja sin reemplazo a las cooperativas que lo usan hoy.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-113 a 121, RN-MED-110 a 115 (O7).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-05 — Facturación in situ
- **Pregunta:** ¿se emite la factura en el momento de leer, en el domicilio?
- **Contexto:** MER-018 la menciona como práctica del mercado; ProCoop no la tiene. Requiere impresora portátil y emisión electrónica en línea con M05.
- **Opciones:**
  - A) Extensión posterior a O7 **(Recomendada)** — no frena el ciclo estándar.
  - B) Incluirla en O7 — suma riesgo de emisión offline.
  - C) Descartarla.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-122, PRM-MED-158.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-06 — Alcance de la autolectura
- **Pregunta:** ¿la autolectura del socio reemplaza la visita del lecturista o solo la complementa?
- **Contexto:** MER-018 la propone; reemplazar visitas ahorra costos pero aumenta el riesgo de fraude.
- **Opciones:**
  - A) Complementa; por defecto nunca reemplaza la visita (`never`) y, si el tenant habilita el reemplazo, se exige lectura de campo cada N períodos **(Recomendada)**.
  - B) Reemplaza cuando la lectura está en rango (`ifInRange`) desde el inicio.
  - C) No implementar la autolectura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-057, RN-MED-056, PRM-MED-054, PRM-MED-055.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-07 — Tope de estimaciones consecutivas
- **Pregunta:** ¿cuántas estimaciones consecutivas se admiten antes de exigir inspección o relectura?
- **Contexto:** ProCoop no tiene tope; los reglamentos de los entes suelen limitar los estimados sucesivos.
- **Opciones:**
  - A) 2 períodos, configurable por servicio **(Recomendada)**.
  - B) 3 períodos.
  - C) Sin tope (como ProCoop).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-081, RN-MED-090, PRM-MED-108.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-08 — Régimen de compensación de generación distribuida
- **Pregunta:** ¿la energía inyectada se compensa en dinero (Ley 27.424, tarifa de inyección) o en kWh (balance neto)?
- **Contexto:** depende de la adhesión de cada provincia (BASE §101). MED entrega el balance; M04 valoriza; M07 lleva el crédito.
- **Opciones:**
  - A) Configurable por régimen; por defecto, compensación monetaria (Ley 27.424) **(Recomendada)**.
  - B) Solo monetaria.
  - C) Solo balance neto en kWh.
- **Impacto si no se responde:** se asume A.
- **Estado:** Respondida (DEC-060): configurable por régimen; por defecto compensación monetaria (Ley 27.424); balance neto como opción del régimen (coherente con PA-TAR-14 de M04).
- **Bloquea:** RF-MED-097, RN-MED-117.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-09 — Conservación de fotos de lectura
- **Pregunta:** ¿cuánto tiempo se conservan las fotos y los datos GPS de las lecturas?
- **Contexto:** son evidencia ante reclamos y datos personales (Ley 25.326). ProCoop no define plazo (Duda 13).
- **Opciones:**
  - A) 24 meses en almacenamiento en línea y luego archivo frío; no se borran hasta que el tenant defina su política **(Recomendada)**.
  - B) Borrado a los 24 meses.
  - C) Conservación indefinida en línea.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-MED-157, migración de fotos (§19).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-10 — Cambio de clase por consumo
- **Pregunta:** ¿el cambio de clase o categoría por rango de consumo se aplica automáticamente o como propuesta?
- **Contexto:** `Get_ServiciosClase` parece regla de un cliente puntual (Duda 21); afecta tarifas (M04) y el contrato (M02).
- **Opciones:**
  - A) Propuesta con aprobación **(Recomendada)**.
  - B) Aplicación automática.
  - C) No implementar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-102, RN-MED-122.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-11 — Colectoras USB (PSION/Android por cable)
- **Pregunta:** ¿se da soporte directo a colectoras conectadas por USB?
- **Contexto:** ProCoop usa Windows Portable Device y SQLite (RN-06 §13.3). Una aplicación web no accede al USB sin agente local.
- **Opciones:**
  - A) Sin USB directo: intercambio por archivo; agente local solo a pedido de una cooperativa **(Recomendada)**.
  - B) Agente local desde O7.
  - C) Discontinuar las colectoras y usar solo la PWA.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-056.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-12 — Conectores y formatos a construir primero
- **Pregunta:** ¿qué conectores de telemedición/prepago y qué perfiles de importación se construyen en O7?
- **Contexto:** ProCoop tiene 26 sistemas y unos 20 formatos de archivo. La BASE §98 deja pendiente si la cooperativa piloto usa telemedición.
- **Opciones:**
  - A) Contrato genérico, importación por archivo y uno o dos conectores de la cooperativa piloto; el resto a pedido **(Recomendada)**.
  - B) Todos los conectores de ProCoop en O7 — mucho esfuerzo sin clientes confirmados.
  - C) Solo importación por archivo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MED-054, RF-MED-103 a 112.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-13 — Profundidad histórica a migrar
- **Pregunta:** ¿cuántos períodos de lecturas, consumos y fotos se migran desde ProCoop y desde la base de la app móvil?
- **Contexto:** la estimación y el rango esperado necesitan al menos 12 períodos; las fotos están en una base compartida entre cooperativas (Duda 13).
- **Opciones:**
  - A) Lecturas y consumos completos; fotos de los últimos 24 meses **(Recomendada)** — cubre estimación, interanual y reclamos.
  - B) Solo los últimos 24 meses de todo.
  - C) Solo el último estado por medidor — pierde la base de estimación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §19 (migración), RF-MED-074.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-14 — Estados de `meteringSystems` (cierre, segunda ronda)
- **Pregunta:** ¿se confirman los valores `active` e `inactive` de `meteringSystems.status`, propuestos en §8 con `[VERIFICAR]`?
- **Contexto:** la corrección de inconsistencias del 05-11-2026 declaró esos valores sin una RN que los respalde; la salud técnica va aparte, en `health.status`.
- **Opciones:**
  - A) **(Recomendada)** Confirmar `active` e `inactive` (estado inicial `active`); `health.status` sigue siendo independiente.
  - B) Unificar estado y salud en un solo campo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §8 (estados completados), T05.
- **Estado:** Asumida (DEC-072): opción A, aplicada en §8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MED-15 — Residuales de estados y referencias (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados iniciales y las transiciones de `readingImportJobs` y `consumptionClassReviews`, y los destinos de las referencias del lecturista, del dispositivo y de los expedientes?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 6 máquinas de M03 sin estado inicial y 2 colecciones con estados sin transiciones; 03-er marcó sin destino `meters.documents`, `meteringPoints.reading`, `defaultReaderIds`, `readerId`, `photoIds`, `readingId`, `vendorTransactionId` y `distributedGenerationContracts.documents`; T05 §7.2.1 tiene `deviceId` de M03 con [VERIFICAR].
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.13 el estado de alta y las transiciones; lecturista → `memberships` (T02); `deviceId` → `fieldDevices` (M10, tipo ObjectId); expedientes → `documents` (T11); fotos → `storedFiles` (T01); `routeIds` → `readingRoutes`; `vendorTransactionId` es un identificador externo.
  - B) Lecturista → `employees` (M16), que excluye lecturistas tercerizados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), T05 §7.2.1 (`deviceId`).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7.2 a §7.6 y §8.13. T05 debe cerrar el [VERIFICAR] de `deviceId` (M03 → `fieldDevices`).
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M03 declara en §12.1 EVT-MED-30 `med.readingRoute.published` (antes `med.reading-route.published`, nombre que solo figuraba en T06 §12), publicado al exportar el lote de una ruta a un sistema conectado por T06; payload `readingRouteId`, `readingBatchId`, `meteringSystemId`, `period`; consumidor T06. T11 §12.4 registra el alias.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-01 — Profundidad del histórico y plazo de archivo
- **Pregunta:** ¿Cuánta historia se migra tipada (consultable y operable) y cuánto se archiva solo consultable?
- **Contexto:** ProCoop acumula décadas de facturas, cobros y movimientos; migrar todo tipado encarece la carga y el paralelo; la ley fiscal exige conservar 10 años.
- **Opciones:**
  - A) Ejercicio en curso + 24 meses tipados; el resto en `legacyRecords` consultable; snapshot conservado 10 años **(Recomendada)** — carga acotada, cumplimiento fiscal.
  - B) Todo tipado — máxima consulta, carga y paralelo mucho más largos.
  - C) Solo saldos vivos + archivo — carga mínima, pierde consultas operativas recientes.
- **Impacto si no se responde:** se asume A (PRM-MIG-014 = 24).
- **Bloquea:** RN-MIG de histórico, §9.4, cargadores de O4–O9.
- **Estado:** Respondida (DEC-070): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-02 — Duración y criterio de aprobación de la corrida paralela
- **Pregunta:** ¿Cuántos ciclos de facturación en paralelo y con qué tolerancia se aprueba el by-pass?
- **Contexto:** BASE FAC-012 exige comparación factura por factura; la duración define el calendario de O11.
- **Opciones:**
  - A) 2 ciclos consecutivos por servicio con 0 diferencias sin explicar **(Recomendada)** — evidencia suficiente con costo acotado.
  - B) 1 ciclo — más rápido, riesgo de errores estacionales.
  - C) 3 ciclos o más — más seguro, doble carga operativa prolongada.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.6, ESC de paralelo, corte comercial tras O7 (DEC-089; antes "O11").

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-03 — Modo de sincronización durante la convivencia
- **Pregunta:** ¿Cómo se sincronizan ProCoop y CoopApps mientras conviven?
- **Contexto:** Doble digitación genera errores; la sincronización bidireccional es costosa y riesgosa.
- **Opciones:**
  - A) Delta unidireccional ProCoop→CoopApps mientras ProCoop es maestro; luego exportaciones CoopApps→ProCoop para módulos que siguen en ProCoop **(Recomendada)** — un solo maestro por dominio.
  - B) Bidireccional en tiempo real — complejo, conflictos.
  - C) Sin sincronización, doble carga manual — barato, propenso a errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.7, JOB de convivencia, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-04 — Módulos que permanecen en ProCoop tras el corte comercial
- **Pregunta:** ¿En qué orden se cortan los dominios?
- **Contexto:** DEC-006/DEC-009 y la DFA proponen etapas; la cooperativa puede preferir un corte único.
- **Opciones:**
  - A) E2: corte comercial primero (socios, servicios, facturación, cobranza, mora); contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta E3 corte administrativo **(Recomendada)** — riesgo repartido.
  - B) Corte único total — un solo esfuerzo, riesgo concentrado.
  - C) Corte por servicio (Internet, luego agua, etc.) — muy gradual, convivencia larga.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.7 etapas E0–E4, plan de corte.
- **Estado:** Respondida (DEC-068): opción A (corte comercial M01–M09 primero; contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-05 — Forma del saldo de apertura de deuda
- **Pregunta:** ¿La deuda se migra documento por documento o como saldo único por cuenta?
- **Contexto:** El saldo único es más simple, pero impide imputar cobros a comprobantes, calcular intereses por vencimiento y emitir notas de crédito sobre facturas viejas.
- **Opciones:**
  - A) Documento por documento (facturas/obligaciones pendientes) **(Recomendada)** — intereses, imputación y NC exactas.
  - B) Saldo único por cuenta y servicio — rápido, pierde trazabilidad.
  - C) Mixto: documentos del período tipado y saldo para lo anterior — compromiso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargadores M07/M08, conciliación de deuda.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-06 — Intereses devengados al corte
- **Pregunta:** ¿Se migran los intereses calculados por ProCoop o se recalculan?
- **Contexto:** RN-04 describe el cálculo de mora de ProCoop; diferencias de redondeo o tasa generan reclamos.
- **Opciones:**
  - A) Recalcular con las tablas de tasas migradas y conciliar contra ProCoop; diferencias explicadas **(Recomendada)** — un único motor de intereses.
  - B) Congelar el interés de ProCoop como concepto — sin diferencias, dos lógicas.
  - C) Condonar intereses al corte — simple, pérdida económica.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M08, ESC de mora.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-07 — Contraseñas y activación de usuarios
- **Pregunta:** ¿Cómo acceden los usuarios internos y del portal tras la migración?
- **Contexto:** Las contraseñas de ProCoop son reversibles y no deben copiarse (RN-MIG-013).
- **Opciones:**
  - A) No migrar contraseñas; enviar invitación de activación por mail/SMS **(Recomendada)** — seguro.
  - B) Migrar con hash nuevo — imposible sin leer contraseñas en claro.
  - C) Contraseña temporal común — inseguro.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T02, M19.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-08 — Numeración de comprobantes después del corte
- **Pregunta:** ¿Se conservan los puntos de venta de ARCA?
- **Contexto:** Cambiar puntos de venta implica trámite en ARCA; continuar la numeración requiere sincronizar el último número autorizado.
- **Opciones:**
  - A) Mismos puntos de venta; continuar con el último número consultado a ARCA al corte **(Recomendada)** — sin trámites, continuidad.
  - B) Puntos de venta nuevos — separación clara, trámite previo.
  - C) Mixto por tipo de comprobante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M05/M06, corte F12.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-09 — Profundidad contable
- **Pregunta:** ¿Qué se migra de contabilidad?
- **Contexto:** Los libros oficiales del ejercicio cerrado ya están rubricados en ProCoop.
- **Opciones:**
  - A) Saldos de apertura + asientos del ejercicio en curso **(Recomendada)** — continuidad del ejercicio.
  - B) Solo saldos de apertura al inicio del ejercicio siguiente — corte limpio, espera al cierre.
  - C) Todos los ejercicios — costo alto, valor bajo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M15, O5/O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-10 — Deduplicación de personas
- **Pregunta:** ¿Cómo se unifican personas duplicadas (mismo documento con varios códigos)?
- **Contexto:** Duplicados frecuentes en socios, proveedores y empleados; fusionar mal mezcla datos personales.
- **Opciones:**
  - A) Asistida: el sistema propone candidatos y una persona aprueba **(Recomendada)** — calidad con control.
  - B) Automática por documento — rápida, errores en documentos mal cargados.
  - C) Sin deduplicación — replica la deuda de datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M01, F4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-11 — CUIT/DNI inválidos
- **Pregunta:** ¿Qué se hace con personas cuyo documento no valida?
- **Contexto:** Dígito verificador incorrecto o documentos ficticios cargados en ProCoop. **Alcance (10-11-2026, DEC-099):** esta pregunta trata solo los documentos **presentes pero inválidos**. La persona que llega **sin ningún documento** ya está decidida por DEC-099 y no depende de esta respuesta: se carga con `identificationStatus = documentPending`, entra en el informe de migración y genera una tarea de regularización (RN-MIG-058, M01 RN-PER-136). Un documento de relleno (por ejemplo `0`) se trata aquí como inválido, salvo lo previsto en RN-MIG-058.
- **Opciones:**
  - A) Cargar marcadas como "documento a revisar" y bloquear factura A hasta corregir **(Recomendada)** — no frena la migración.
  - B) Rechazar hasta corregir en origen — bloquea cuentas activas.
  - C) Cargar sin marca — riesgo fiscal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M01, M06.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-12 — Normalización de domicilios y geocodificación
- **Pregunta:** ¿Se normalizan y geocodifican los domicilios en la migración?
- **Contexto:** Calles duplicadas (`CALLES`/`RNQCALL`) y domicilios libres; el GIS y las rutas dependen de coordenadas.
- **Opciones:**
  - A) Normalizar contra el maestro de calles y sugerir geocodificación para aprobación **(Recomendada)** — mejora sin bloquear.
  - B) Migrar tal cual — rápido, GIS pobre.
  - C) Geocodificación obligatoria — bloquea cuentas sin coordenadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T04 geografía, M04 rutas, M10 GIS.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-13 — Modelo GIS duplicado (`NIV_*` vs `REDES_*`)
- **Pregunta:** ¿Qué modelo de red prevalece?
- **Contexto:** ProCoop tiene dos modelos de red superpuestos.
- **Opciones:**
  - A) Prevalece `REDES_*`; `NIV_*` se consolida como atributos **(Recomendada)** — modelo más completo.
  - B) Prevalece `NIV_*` — modelo más simple, pierde atributos.
  - C) Migrar ambos — duplicación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M10 red.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-14 — Uso de `TICKETS` (mesa de ayuda)
- **Pregunta:** ¿Los tickets son atención a socios o soporte interno del proveedor?
- **Contexto:** Campos como horas bonificadas sugieren uso del proveedor de software.
- **Opciones:**
  - A) Migrar abiertos + 12 meses de cerrados como atención; descartar horas bonificadas **(Recomendada)** — continuidad de atención.
  - B) No migrar — si es uso del proveedor.
  - C) Migrar todo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** cargador M09 tickets.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-15 — Método de anonimización para ambientes de prueba
- **Pregunta:** ¿Cómo se anonimizan las copias para ensayo y capacitación?
- **Contexto:** Ley 25.326; los ensayos requieren datos realistas y montos conciliables.
- **Opciones:**
  - A) Seudonimización determinística irreversible, conservando importes, fechas y relaciones **(Recomendada)** — ensayos conciliables.
  - B) Datos sintéticos — sin riesgo, no conciliable con ProCoop.
  - C) Copia real con acceso restringido — riesgo legal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §9.10, ensayos F5–F9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-16 — Vigencia de alias de códigos ProCoop
- **Pregunta:** ¿Hasta cuándo se aceptan cobros con códigos y barras de ProCoop?
- **Contexto:** Facturas emitidas por ProCoop siguen circulando y se cobran en entes.
- **Opciones:**
  - A) Último vencimiento emitido por ProCoop + 180 días **(Recomendada)** — cubre segundos vencimientos y atrasos.
  - B) Permanente — deuda técnica.
  - C) 30 días — cobros rechazados.
- **Impacto si no se responde:** se asume A (PRM de alias).
- **Bloquea:** `legacyKeyAliases`, M07/M12.
- **Estado:** Abierta solo en el margen de días: el criterio (resolución por clave ProCoop hasta vencer las facturas migradas, identificador nuevo autocontenido) está respondido por DEC-050.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-17 — Orden de cooperativas y piloto de migración
- **Pregunta:** ¿Qué cooperativa se migra primero y cómo se valida la herramienta?
- **Contexto:** DEC-005 fija Internet como piloto comercial; la cooperativa piloto de migración es LAG (DEC-088; antes "no está definida", DEC-081), que opera electricidad, gas y prepago (CTR-MIG-07).
- **Opciones:**
  - A) Herramienta validada con datos sintéticos de Internet; primera migración real de la cooperativa piloto tras O7 si opera servicios medidos, o desde O6 si es solo Internet **(Recomendada)** — respeta DEC-005 y DEC-081. Con DEC-088 (piloto LAG, servicios medidos) aplica la rama "tras O7".
  - B) Cooperativa piloto con servicios medidos sin esperar O7 — servicios medidos incompletos.
  - C) Otra cooperativa Internet como primera real — requiere identificarla.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** plan de proyectos de migración, O7–O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-18 — Contabilidad durante el paralelo
- **Pregunta:** ¿Dónde se llevan los libros oficiales mientras hay paralelo?
- **Contexto:** Doble contabilidad oficial no es admisible.
- **Opciones:**
  - A) Libros oficiales en ProCoop; CoopApps simula asientos y exporta para comparar **(Recomendada)** — un solo libro oficial.
  - B) Libros oficiales en CoopApps desde el paralelo — riesgo si se revierte.
  - C) Sin contabilidad en el paralelo — no valida asientos automáticos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M15, §9.6.
- **Estado:** Respondida (DEC-069): opción A; CoopApps usa un plan no oficial, concilia contra ProCoop y se oficializa en el corte administrativo.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-19 — Datos de salud
- **Pregunta:** ¿Cómo se tratan los datos de salud (ambulancias, licencias médicas)?
- **Contexto:** Datos sensibles (Ley 25.326 art. 7–8).
- **Opciones:**
  - A) Cifrado a nivel de campo y acceso restringido por capacidad **(Recomendada)** — cumplimiento.
  - B) Solo histórico en archivo cifrado — menos uso operativo.
  - C) No migrar — pérdida de historia clínica operativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-MIG-038, M18, M16.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-20 — Dónde se guarda el acta de aceptación de la migración
- **Pregunta:** ¿El acta de aceptación firmada (RF-MIG-087, PAN-MIG-23) es un documento de T11 o una colección propia de T07?
- **Contexto:** `migrationProjects.acceptanceActId` apuntaba a un documento de T11 sin colección definida.
- **Opciones:**
  - A) `documents` de T11 con tipo documental `acta`: firma, versiones y retención las da T11 **(Recomendada)**.
  - B) Colección propia de T07.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MIG-087; PAN-MIG-23; API-MIG-03 (transición a `live`).
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MIG-21 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** las máquinas de §8.1 a §8.6 estaban en texto sin estado de alta explícito; `migrationProjects` y `migrationRuns` no listaban valores en §7; 5 referencias no tenían destino en la definición del campo; 9 colecciones no tenían tabla de campos; API-MIG-34 y 36 citaban reglas de acceso en lugar de capabilities; `setId` y `ruleId` no usaban el nombre canónico de T05.
- **Opciones:**
  - A) Agregar §8.8 con una fila por transición y estado inicial; listar valores en §7; declarar destinos (`goodappsBatchId` → `billingRuns` de M05, `acceptanceActId` → `documents`, snapshots → `legacySnapshots`, `baseSetId` → `migrationMappingSets`); renombrar a `mappingSetId` y `ruleCode` (con "antes"); agregar §7.14 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `mig.clavesHeredadas.resolver` y `mig.miHistorial.ver` (registradas en T02 §4.4.2). **(Recomendada)**.
  - B) Dejar las máquinas solo en texto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos y ER de T07.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-01 — Interés simple o compuesto
- **Pregunta:** ¿El interés por mora se calcula como interés simple diario o admite capitalización?
- **Contexto:** ProCoop usa interés simple (tasa diaria × días) y evita el interés sobre interés (RN-04 §12.2). AGR-011 exige que el cálculo sea explicable. Algunas tablas de índices implican capitalización de hecho.
- **Opciones:**
  - A) Interés simple diario para todos los métodos, sin interés sobre interés **(Recomendada)**: es compatible con ProCoop y fácil de explicar en la factura.
  - B) Simple por defecto y compuesto habilitable por política: más flexible, pero exige una explicación adicional al socio y validación legal.
  - C) Compuesto mensual: diferencias con el histórico y riesgo de reclamo.
- **Impacto si no se responde:** se asume A; `compounding = simple` no editable.
- **Bloquea:** RF-MOR-007, RN-MOR-016, PRM-MOR-013 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-02 — Significado del mínimo de recargo (#609)
- **Pregunta:** Cuando el recargo calculado es menor que el mínimo, ¿se cobra 0 o se cobra el mínimo?
- **Contexto:** En ProCoop, un recargo menor que el mínimo vale 0 (RN-04 §13.3). El nombre del parámetro sugiere un piso.
- **Opciones:**
  - A) Ofrecer los dos modos, con "umbral de exención" (se cobra 0) por defecto **(Recomendada)**: mantiene el comportamiento actual y permite el piso.
  - B) Solo umbral de exención.
  - C) Solo piso: cambia los importes cobrados respecto de ProCoop.
- **Impacto si no se responde:** se asume A con modo `exemptBelow`.
- **Bloquea:** RF-MOR-027, RN-MOR-013, PRM-MOR-031/032 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-03 — Tramas en cascada e IVA del importe fijo
- **Pregunta:** En el recargo entre vencimientos por porcentaje o trama, ¿VTO3 y VTO4 aplican el recargo sobre el importe anterior (cascada) o sobre el TOTAL1? ¿Y el importe fijo lleva IVA?
- **Contexto:** `Tramas_Importe` aplica la trama dos o tres veces con días acumulados, y `Fijo_Pesos` no calcula IVA (RN-04 §3.3, §13.13).
- **Opciones:**
  - A) Modo simple (sobre TOTAL1) por defecto, cascada como opción explícita, e IVA según el concepto también en el importe fijo **(Recomendada)**: es transparente y fiscalmente consistente.
  - B) Replicar la cascada y el importe fijo sin IVA: coincide con lo que hoy se imprime, pero mantiene el problema fiscal.
  - C) Solo modo simple.
- **Impacto si no se responde:** se asume A; la migración marca los esquemas en cascada.
- **Bloquea:** RN-MOR-031, RN-MOR-032, RF-MOR-011 (O4).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-04 — Documento y momento de facturación del interés
- **Pregunta:** ¿El interés cobrado se documenta con nota de débito asociada o con factura? ¿Se difiere a la próxima factura por defecto?
- **Contexto:** El parámetro #273 permite elegir factura o ND; el #1011 define el diferimiento; MER-019 habla de "ND diferida" (CTR-MOR-14).
- **Opciones:**
  - A) ND asociada al documento de origen, sin diferir por defecto, y diferimiento configurable por servicio y ente **(Recomendada)**: es trazable y sigue el uso más común.
  - B) Factura por defecto.
  - C) Diferir siempre a la próxima factura: reduce documentos, pero demora la registración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-041–048, RF-MOR-043, PRM-MOR-050/051 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-05 — Instancias por defecto del piloto Internet
- **Pregunta:** ¿Qué instancias y plazos se precargan para el piloto Internet?
- **Contexto:** El DFA define 3 instancias (CTR-MOR-02); BASE §86 y §53 exigen preaviso y una suspensión antes de la baja.
- **Opciones:**
  - A) Candidato → Aviso → Intimación con preaviso (evidencia exigida) → Suspensión → Baja por mora **(Recomendada)**: es gradual y cumple el preaviso.
  - B) Las 3 instancias del DFA (Candidatos, 1ª, 2ª), con corte en la 2ª.
  - C) Definirlas con cada cooperativa, sin precarga.
- **Impacto si no se responde:** se asume A como precarga editable.
- **Bloquea:** RF-MOR-075–082, CU-MOR-03, §18 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-06 — Preaviso y constancia exigidos por servicio
- **Pregunta:** ¿Qué preaviso mínimo y qué tipo de constancia se exigen antes de suspender, por servicio y jurisdicción?
- **Contexto:** AGR-024 pide evidencia de entrega; la normativa por servicio (Internet, electricidad ERSeP, agua) no está relevada con precisión.
- **Opciones:**
  - A) Preaviso mínimo configurable como restricción `normative` y evidencia digital aceptada (acuse del proveedor, lectura, OTP), a validar legalmente por servicio **(Recomendada)**.
  - B) Solo constancia física (carta documento o firma).
  - C) Sin constancia obligatoria: no recomendable.
- **Impacto si no se responde:** se asume A con 10 días ilustrativos y bloqueo sin evidencia.
- **Bloquea:** RF-MOR-120, RN-MOR-082, PRM-MOR-091/113 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-07 — Protecciones (electrodependientes, entidades públicas, salud, educación)
- **Pregunta:** ¿Qué protecciones bloquean la suspensión y cuáles solo requieren revisión?
- **Contexto:** BASE §87 protege a los electrodependientes; las entidades públicas y los servicios esenciales para salud o educación no tienen regla relevada.
- **Opciones:**
  - A) Bloqueo duro para las protecciones normativas acreditadas, y revisión con aprobación para entidades públicas, salud y educación **(Recomendada)**.
  - B) Bloqueo duro para todas.
  - C) Solo electrodependientes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-111, RF-MOR-112, RN-MOR-084 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-08 — Afectación cruzada en cuenta unificada
- **Pregunta:** ¿La deuda de un servicio puede habilitar la suspensión de otro servicio de la misma cuenta unificada?
- **Contexto:** BASE §68 recibió el pedido de "afectar todos", pero lo condiciona a que cada servicio sea elegible (CTR-MOR-19).
- **Opciones:**
  - A) Deshabilitada; cada servicio se evalúa solo con su propia deuda **(Recomendada)**.
  - B) Habilitable por par de servicios, con validación jurídica y aprobación.
  - C) Habilitada por defecto: contraria al control de BASE.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-069, PRM-MOR-117 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-09 — Significado del pago mínimo
- **Pregunta:** ¿Qué efecto tiene alcanzar el pago mínimo definido por la política?
- **Contexto:** BASE §68 CTA-002 menciona un pago mínimo sin definir su efecto.
- **Opciones:**
  - A) Solo evita la suspensión del período; la deuda restante sigue en mora con interés **(Recomendada)**.
  - B) Además detiene el avance de las instancias.
  - C) Equivale a regularizar (cierra la notificación).
- **Impacto si no se responde:** se asume A, deshabilitado por defecto.
- **Bloquea:** RF-MOR-067, PRM-MOR-118 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-10 — Ventanas de ejecución de suspensiones
- **Pregunta:** ¿En qué días y horarios se pueden ejecutar suspensiones por mora?
- **Contexto:** La práctica regulatoria suele restringir los cortes en viernes, vísperas de feriado y feriados; no está relevado por servicio.
- **Opciones:**
  - A) Solo días hábiles, sin viernes, vísperas ni feriados, en horario restringido configurable, a validar por servicio **(Recomendada)**.
  - B) Días hábiles sin más restricción.
  - C) Sin restricción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-119, JOB-MOR-18 (O6).
- **Avance (HUE-ELE-05):** la opción A se concreta para electricidad en Córdoba como plantilla de plataforma ERSeP (RF-MOR-221, RN-MOR-145, PRM-MOR-206), precargada como `toValidate` hasta su validación legal.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-11 — Criterio de deuda para reconectar
- **Pregunta:** ¿Qué deuda debe estar cancelada para reconectar automáticamente?
- **Contexto:** ProCoop ofrece toda la deuda, la vencida al VTO2 y la vencida al último vencimiento (#3147, CTR-MOR-12).
- **Opciones:**
  - A) La deuda vencida exigible del servicio afectado (al último vencimiento), con pago confirmado **(Recomendada)**.
  - B) Toda la deuda de la cuenta.
  - C) Solo la deuda que motivó el caso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-122, PRM-MOR-124/125 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-12 — Cargos admisibles por mora e interrupción
- **Pregunta:** ¿Se habilitan gastos administrativos, costo de notificación y cargo de reconexión? ¿Con qué respaldo?
- **Contexto:** BASE §52.2, §52.3 y §53 exigen fundamento; ProCoop los cobra automáticamente (CTR-MOR-04, CTR-MOR-05).
- **Opciones:**
  - A) Deshabilitados o gratuitos por defecto; habilitables por servicio con respaldo documentado y aprobación **(Recomendada)**.
  - B) Habilitar el cargo de reconexión por defecto y los demás deshabilitados.
  - C) Replicar ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-028, RF-MOR-087, RF-MOR-126, PRM-MOR-033/085/131/141 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-13 — Caducidad del convenio
- **Pregunta:** ¿Cuándo cae un convenio y qué efectos tiene la caída?
- **Contexto:** ProCoop no tiene caducidad (CTR-MOR-07); AGR-014 pide definirla.
- **Opciones:**
  - A) Cae con 3 cuotas impagas o 60 días de atraso, con aviso previo; el saldo de capital es exigible; no revive la deuda original; se pierden las quitas proporcionales **(Recomendada)**.
  - B) Cae con 2 cuotas impagas y revive la deuda original con sus intereses.
  - C) Sin caducidad automática; la decide un supervisor.
- **Impacto si no se responde:** se asume A, configurable por plan.
- **Bloquea:** RF-MOR-156, RN-MOR-123, PRM-MOR-170/171 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-14 — Variantes del proceso masivo de intereses
- **Pregunta:** ¿Se mantienen las variantes estándar, CAU, cheques y AL del proceso masivo?
- **Contexto:** Son variantes por cooperativa (RN-04 §5.4, dudas 6 y 7), con valores hardcodeados.
- **Opciones:**
  - A) Unificarlas como opciones parametrizadas de una sola corrida (estándar, valores, solo cargos), sin valores fijos **(Recomendada)**.
  - B) Replicar las cuatro variantes.
  - C) Solo la estándar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-053, RF-MOR-054, PRM-MOR-055/056 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-15 — Unidad de la tasa y CFT
- **Pregunta:** ¿En qué unidad se carga la tasa de los planes y qué se muestra al socio?
- **Contexto:** `PLAN_CUO.TASA` se usa como fracción por período, y `INT_TEM`/`INT_TNA` son informativas (RN-04 §13.15). La información al consumidor exige CFT.
- **Opciones:**
  - A) Cargar la TNA, derivar la tasa por período y mostrar CFT y TEA en el simulador y el convenio, con validación legal de la información al consumidor **(Recomendada)**.
  - B) Cargar la tasa por período (como ProCoop) y calcular la TNA.
  - C) Sin CFT.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-172, RN-MOR-125 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-16 — Firma del convenio
- **Pregunta:** ¿Qué mecanismos de firma se aceptan para los convenios?
- **Contexto:** ProCoop guarda firmas en `PPAGOS_FIRMAS`; la PWA permite aceptación remota.
- **Opciones:**
  - A) Aceptación electrónica con OTP, evidencia y hash del documento, más firma presencial en tableta; firma digital con certificado como extensión **(Recomendada)**.
  - B) Solo firma presencial.
  - C) Firma digital obligatoria.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-154, RF-MOR-209 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-17 — Incobrables
- **Pregunta:** ¿Cómo se tratan los incobrables?
- **Contexto:** MER-006 pide no borrar la deuda; no hay criterio de previsión relevado.
- **Opciones:**
  - A) Previsión por antigüedad y castigo con doble aprobación, sin borrar la deuda **(Recomendada)**.
  - B) Solo castigo manual.
  - C) Sin incobrables: la deuda queda abierta indefinidamente.
- **Impacto si no se responde:** se asume A con criterios ilustrativos.
- **Bloquea:** RF-MOR-188, PRM-MOR-182/183 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-18 — Gastos y honorarios judiciales
- **Pregunta:** ¿Se trasladan al deudor los gastos y honorarios de la gestión externa o judicial?
- **Contexto:** MER-006; su procedencia depende de un título.
- **Opciones:**
  - A) Solo con título (sentencia o convenio firmado); en otro caso, a cargo de la cooperativa **(Recomendada)**.
  - B) Trasladar siempre un porcentaje.
  - C) Nunca trasladar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-186, RN-MOR-134, PRM-MOR-181 (O6).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-19 — Garantías y depósitos
- **Pregunta:** ¿Se exigen garantías o depósitos en garantía? ¿En qué servicios?
- **Contexto:** MER-005; la exigencia puede ser restrictiva para servicios esenciales.
- **Opciones:**
  - A) Habilitable por servicio y categoría, deshabilitada por defecto **(Recomendada)**.
  - B) Exigida por defecto en los servicios no esenciales.
  - C) No soportar garantías.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-177–182, RF-MOR-178, PRM-MOR-180 (O6/O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-20 — Plazos de prescripción
- **Pregunta:** ¿Qué plazos de prescripción se aplican por tipo de obligación?
- **Contexto:** #104 es un único plazo en meses; el CCyC (art. 2562 inc. c) fija 2 años para prestaciones periódicas, a validar por servicio.
- **Opciones:**
  - A) Plazos configurables por tipo de obligación con aprobación, sin default productivo, sugiriendo 2 años para las periódicas, a validar **(Recomendada)**.
  - B) Un plazo único por tenant (como ProCoop).
  - C) Sin prescripción automática.
- **Impacto si no se responde:** se asume A; no se ejecutan corridas sin plazo cargado.
- **Bloquea:** RF-MOR-193, RN-MOR-136, PRM-MOR-184 (O6).
- **Estado:** Respondida (DEC-052): 24 meses para facturas periódicas de servicios y 60 meses para el resto, editables y con validación legal previa.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-21 — Anexo dueño de CU-CIC-01
- **Pregunta:** ¿Qué anexo define CU-CIC-01 (suspensión temporal y reactivación, BASE §53)?
- **Contexto:** CU-CIC-01 aparece en M02 (cambio de estado del contrato), M08, M09 (tramo de atención) y M19 (portal) con flujos distintos. PA-CAT-20 de M02 proponía M09; la pasada de cierre (pendiente 5) recomienda M08, porque el caso de suspensión y reactivación, sus estados y la confirmación técnica están en este anexo (§8.7; RF-MOR-131–140, 211).
- **Opciones:**
  - A) M08 es dueño; M02, M09 y M19 citan su parte **(Recomendada)**.
  - B) M02 es dueño (ciclo de vida del contrato).
  - C) M09 es dueño (trámite).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §16 de M08, M02, M09 y M19; PA-CAT-20 de M02; 04-matriz.
- **Estado:** Asumida (DEC-072): opción A. Para este CU reemplaza la opción A de PA-CAT-20 (que decía M09). M02 y M09 citan la definición de §16; M19 debe citarla.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-MOR-22 — Residuales de los entregables: referencias, nombres canónicos, estados y alias (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M08 (§7.38), qué nombres se adoptan (`delinquencyBatchId`, `holdReasonId`), qué campos de T05 se incorporan (`personSensitiveDataId`, `signatureRequestId`, `code`), qué valores y transiciones tienen `interestIndexTables`, `debtCollectionAgencies`, `interestBillingRunItems` y las garantías, y cómo se nombran el evento `int.network.provisioning-result` y el comando de OT que M08 pide a M10?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M08-MOR-mora-financiacion.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 03, 08, 11) y de `_trabajo/correccion-inconsistencias-pendientes-cierre.md` (`delinquencyNotices.batchId`).
- **Opciones**: A) **(Recomendada)** Destinos de §7.38 (T05 §7.2.1 cuando existe; `configVersions` de T04 para la versión publicada; `billingCycles` para los ciclos; `billableItems` para los pedidos de cargo), campos de T05 incorporados, máquinas de §8.15, evento `int.network.provisioningResult` (regla de guiones a camelCase; alias `int.network.provisioning-result`) y comando `tec.workOrder.request` (el que emite M09). B) Mantener `[VERIFICAR]` y los nombres anteriores.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER y diagramas de estados de M08; T05 COL-MOR-02, 13, 19, 20, 21, 24, 26, 29 y §7.2.1; alias de T11 §12.4.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.37 (filas corregidas con "antes"), §7.17, §7.18, §7.26, §7.38, §8.15, §9 y §12. T05 debe reflejar las equivalencias de §7.38 (subcampos `scope.*`, `origin.noticeId`, `execution.*`; `policyId`/`validFrom` de COL-MOR-02; `financialInstitutionId` en COL-MOR-27) y en §7.2.1 `planSnapshot`, `noticeModelVersion`, `policyVersion`, `rates[].rateId` y `adminFee.*` como "no es referencia". T11 debe registrar el alias `int.network.provisioning-result` → `int.network.provisioningResult` en §12.4. Se adopta además el nombre canónico `billableItemId` (antes `pendingChargeId`) de T05 §7.2.1 en `deferredInterests` y `agreementInstallments`, y se cierran las referencias restantes de §7.37 con los destinos de T05 §7.2.1 (`interestIndexTables`, `masterImportJobs`, `jobRuns`, `interruptionCases`).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-01 — Compromiso de disponibilidad (SLA) con las cooperativas
- **Pregunta:** ¿Qué disponibilidad mensual se compromete contractualmente?
- **Contexto:** BASE §97.8 y §64.5 piden definirla sin prometer cifras sin acuerdo; condiciona arquitectura, guardia y costos.
- **Opciones:**
  - A) 99,5 % durante el piloto y 99,9 % en operación general, con guardia 24×7 para SEV1/SEV2 **(Recomendada)** — equilibrio costo/riesgo; cubre facturación y cobranza.
  - B) 99,9 % desde el piloto — mayor costo inicial de infraestructura y guardia.
  - C) Sin SLA formal en el piloto, solo "mejor esfuerzo" — menor costo, riesgo comercial y de confianza.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-030, 134; PRM-NFR-115; O0–O1.
- **Estado:** Respondida (DEC-063): 99,5 % mensual comprometido; soporte lunes a viernes 8–18 con P1 24×7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-02 — RPO y RTO
- **Pregunta:** ¿Qué pérdida de datos y tiempo de recuperación se aceptan?
- **Contexto:** AGR-019 pide acordarlos sin inventar cifras; definen tipo de backup, réplica regional y costos.
- **Opciones:**
  - A) RPO ≤ 5 min y RTO ≤ 4 h en plataforma; restauración selectiva de tenant ≤ 8 h; DR regional RPO ≤ 1 h / RTO ≤ 24 h **(Recomendada)** — PITR estándar de Mongo gestionado.
  - B) RPO ≤ 1 h y RTO ≤ 24 h en todos los casos — menor costo, mayor exposición en días de cobranza.
  - C) RPO ≈ 0 y RTO ≤ 1 h con multirregión activa — costo y complejidad altos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-035 a 037, 046; O0, O1, O11.
- **Estado:** Respondida (DEC-063): RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h plataforma completa; los valores más exigentes quedan como objetivos internos; DR regional según la opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-03 — Perfil de capacidad de referencia
- **Pregunta:** ¿Se adopta el perfil de la sección 7.1 para dimensionar y probar?
- **Contexto:** AGR-020 indica que no existe perfil cuantificado; la DEMO muestra 12.500 comprobantes semanales.
- **Opciones:**
  - A) Tenant estándar 25.000 y grande 150.000 suministros; 100 tenants de diseño y 300 sin rediseño **(Recomendada)** — cubre cooperativas medianas y grandes.
  - B) Tenant grande 50.000 y 50 tenants — dimensionamiento menor; riesgo de rediseño temprano.
  - C) Tenant grande 500.000 — sobredimensiona y encarece las pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-010, 016, 024, 145.
- **Estado:** Respondida (DEC-075): tenant estándar 25.000 suministros y grande 150.000; diseño para 100 tenants y hasta 300 sin rediseño.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-04 — Meta de facturación masiva
- **Pregunta:** ¿En cuánto tiempo debe completarse un lote de facturación?
- **Contexto:** BASE §97.8 pide fijar el tiempo máximo del lote y de la emisión fiscal.
- **Opciones:**
  - A) Cálculo y documentos de 50.000 suministros ≤ 60 min; CAE ≤ 2 h si ARCA responde normal; PDF ≤ 60 min; distribución ≤ 4 h **(Recomendada)** — permite emitir y distribuir en una jornada.
  - B) Ventana nocturna ≤ 8 h para todo — más barato, menos margen para reprocesos.
  - C) Todo en ≤ 1 h incluido CAE — depende de ARCA y no es garantizable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-010 a 012, 016; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-05 — Región de alojamiento y transferencias internacionales
- **Pregunta:** ¿Dónde se alojan los datos de producción?
- **Contexto:** Ley 25.326 art. 12 restringe transferencias a países sin protección adecuada; DEC-004 toma AWS como referencia.
- **Opciones:**
  - A) Región de nube de Sudamérica (por ejemplo São Paulo) con cláusulas contractuales modelo aprobadas por la AAIP, informadas en avisos y registro de subencargados **(Recomendada)** — servicios gestionados completos y latencia baja.
  - B) Infraestructura en Argentina (zona local o proveedor nacional) — menos transferencias, menos servicios gestionados y mayor costo operativo.
  - C) Región de Estados Unidos con cláusulas modelo — más servicios, mayor latencia y mayor transferencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-105, 139; RF-NFR-013; O0.
- **Estado:** Respondida (DEC-062): AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia según la AAIP.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-06 — Plazos de conservación por categoría
- **Pregunta:** ¿Se aprueban los plazos de la tabla 10.3 como valores por defecto?
- **Contexto:** BASE §98 y AGR-033 los dejan pendientes; requieren asesoramiento legal, fiscal y contable.
- **Opciones:**
  - A) Aprobar la tabla 10.3 como default, parametrizable por tenant dentro de mínimos legales, con validación del asesor antes de la primera ejecución real **(Recomendada)** — permite construir y probar.
  - B) Conservar todo hasta la baja del tenant y definir plazos más adelante — incumple el principio de finalidad y acumula riesgo.
  - C) Solo los mínimos legales estrictos validados caso por caso antes de construir — bloquea O1.
- **Impacto si no se responde:** se asume A sin ejecutar supresiones reales hasta la validación.
- **Bloquea:** RF-NFR-009; RNF-NFR-038, 116; PRM-NFR-040 a 055.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-07 — Rol de la plataforma ante la Ley 25.326 y contrato de encargo
- **Pregunta:** ¿Qué rol asume CoopApps frente a los datos de cada cooperativa?
- **Contexto:** BASE §97.1 y §98 piden confirmarlo y redactar el contrato.
- **Opciones:**
  - A) GoodApps prestador de servicios de tratamiento (art. 25) con contrato tipo, lista de subencargados y destrucción al fin del encargo **(Recomendada)** — coherente con SaaS y con BASE §59.
  - B) Corresponsable del tratamiento — más obligaciones y riesgo para la plataforma.
  - C) Definir caso por caso por cooperativa — complejidad operativa y documental.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-002, 013; RNF-NFR-108.
- **Estado:** Respondida (DEC-076): GoodApps es prestador de servicios de tratamiento por cuenta de la cooperativa (art. 25): contrato tipo de encargo, registro público de subencargados y destrucción o devolución al fin del encargo.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-08 — Plazos de notificación de incidentes a la cooperativa
- **Pregunta:** ¿En qué plazos se notifica un incidente con datos personales?
- **Contexto:** BASE §97.1 pide procedimiento y notificación a la cooperativa; la ley no fija un plazo general [VERIFICAR].
- **Opciones:**
  - A) Aviso inicial ≤ 24 h desde la confirmación, informe preliminar ≤ 72 h y final ≤ 15 días **(Recomendada)** — permite a la cooperativa actuar como responsable.
  - B) Aviso ≤ 72 h — más margen, menor capacidad de reacción del tenant.
  - C) Según contrato de cada cooperativa — heterogéneo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-014; flujo 10.5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-09 — Uso de IA con datos personales
- **Pregunta:** ¿Bajo qué condiciones las funciones de IA procesan datos personales?
- **Contexto:** BASE §97.1 prohíbe enviar datos sin acuerdo y evaluación; AGR-030 pide gobierno de la IA.
- **Opciones:**
  - A) Solo proveedores con acuerdo de tratamiento y sin entrenamiento con datos, redacción de identificadores antes de enviar, habilitación por tenant y exclusión total de salud **(Recomendada)** — habilita bot y clasificación con riesgo acotado.
  - B) Prohibir todo dato personal (solo texto anonimizado) — reduce utilidad del bot y la clasificación.
  - C) Libre con consentimiento del socio — difícil de gestionar y probar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-NFR-010; RNF-NFR-098; PRM-NFR-090.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-10 — Enlaces a comprobantes en correo o WhatsApp
- **Pregunta:** ¿Cómo accede el socio a la factura desde un mensaje?
- **Contexto:** ProCoop publica PDF por FTP al portal; CNX V-01 expone `/uploads`; BASE §97.2 pide envío digital.
- **Opciones:**
  - A) Enlace de un solo documento, revocable, que vence a los 7 días y luego exige iniciar sesión **(Recomendada)** — práctico y sin exponer el bucket.
  - B) Siempre exigir inicio de sesión — más seguro, más fricción para socios mayores.
  - C) Adjuntar el PDF en el correo — sin control posterior del documento; no aplicable a WhatsApp por tamaño y privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-081; PRM-NFR-031; API-NFR-29.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-11 — Desafío antiautomatización (CAPTCHA)
- **Pregunta:** ¿Qué mecanismo se usa en formularios públicos?
- **Contexto:** RNF-NFR-076; el proveedor sería subencargado.
- **Opciones:**
  - A) Desafío de terceros respetuoso de la privacidad y accesible (tipo Turnstile), activado por riesgo **(Recomendada)** — baja fricción.
  - B) hCaptcha u otro con desafío visual — más fricción y problemas de accesibilidad.
  - C) Solo rate limiting y heurísticas propias — sin subencargado, menor eficacia ante bots distribuidos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-076; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-12 — Ventana de mantenimiento y congelamiento
- **Pregunta:** ¿Cuándo pueden hacerse mantenimientos con corte y en qué días se congela?
- **Contexto:** BASE §97.8 pide definir ventanas; la facturación y los vencimientos son críticos.
- **Opciones:**
  - A) Domingo 02:00–06:00 ART, ≤ 4 h/mes, aviso ≥ 72 h; congelamiento en días de lote y primeros vencimientos de cada tenant **(Recomendada)**.
  - B) Todas las noches 01:00–05:00 — más flexibilidad técnica, más cortes.
  - C) Sin ventana: solo despliegues sin corte — exige inversión extra en migraciones en línea.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-032, 034; PRM-NFR-110, 111.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-13 — Soporte mínimo de dispositivos
- **Pregunta:** ¿Qué versiones mínimas de Android e iOS se soportan?
- **Contexto:** BASE §97.8 pide usabilidad en celulares de gama baja.
- **Opciones:**
  - A) Android 9+ e iOS 16.4+, últimas 2 versiones de navegadores **(Recomendada)** — cubre la gran mayoría del parque y permite push en iOS.
  - B) Android 8+ — más alcance, más pruebas y menos APIs web.
  - C) Android 11+ — menos esfuerzo, excluye equipos viejos de socios y técnicos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-183, 185.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-14 — Protección de datos en el dispositivo offline
- **Pregunta:** ¿Cómo se protegen los datos guardados offline?
- **Contexto:** RNF-NFR-189; los técnicos llevan datos de socios y evidencias.
- **Opciones:**
  - A) Minimización, vencimiento a 7 días, borrado al cerrar o revocar sesión y cifrado con WebCrypto de evidencias sensibles **(Recomendada)**.
  - B) Sin cifrado adicional (solo minimización) — más simple, mayor riesgo ante pérdida del equipo.
  - C) Cifrar todo con PIN propio de la app — más seguro, más fricción y riesgo de pérdida de trabajo offline.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-189; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-15 — Página de estado e información de incidentes
- **Pregunta:** ¿Cómo se informan incidentes y mantenimientos a las cooperativas?
- **Contexto:** BASE §64.5 (comunicar avances y vincular con incidentes generales).
- **Opciones:**
  - A) Página de estado pública de la plataforma + aviso en el admin + correo a administradores **(Recomendada)**.
  - B) Solo aviso en el admin — invisible si el admin no está disponible.
  - C) Solo correo — sin historial público.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-019; PAN-NFR-18.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-16 — Alcance de la auditoría de lecturas
- **Pregunta:** ¿Qué lecturas se auditan obligatoriamente?
- **Contexto:** BASE §54 la deja opcional; §97.1 exige tratamiento reforzado (CTR-NFR-15).
- **Opciones:**
  - A) Obligatoria para salud, datos bancarios completos, informes ARCO, exportaciones con datos personales, soporte y bóveda; opcional configurable para el resto **(Recomendada)** — costo acotado.
  - B) Todas las lecturas de datos personales — alto volumen y costo.
  - C) Ninguna lectura — incumple el tratamiento reforzado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-101, 114; PRM-NFR-093.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-17 — Pruebas de penetración externas
- **Pregunta:** ¿Con qué frecuencia se contratan pruebas de penetración independientes?
- **Contexto:** BASE §60 pide verificación continuada.
- **Opciones:**
  - A) Antes del go-live del piloto, anual y ante cambios mayores de autenticación, pagos o tenancy **(Recomendada)**.
  - B) Solo anual — riesgo en el lanzamiento.
  - C) Solo pruebas internas — menor independencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-095; cierre de O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-18 — Plazo de soporte de versiones de la API externa
- **Pregunta:** ¿Cuánto tiempo se mantiene una versión anterior de `/api/v1/ext`?
- **Contexto:** BASE §59 pide versiones documentadas y estabilidad para BI de las cooperativas.
- **Opciones:**
  - A) 12 meses desde la publicación de la nueva versión **(Recomendada)**.
  - B) 6 meses — menos mantenimiento, más presión sobre integradores.
  - C) 24 meses — más estabilidad, más costo de mantenimiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-175, 176; O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-19 — Datos reales en ensayos
- **Pregunta:** ¿Se pueden usar datos reales de ProCoop para ensayos de migración y pruebas de carga?
- **Contexto:** BASE §97.1 prohíbe copiar datos reales a desarrollo o demostración; la migración (T07) necesita ensayar con datos reales.
- **Opciones:**
  - A) Pruebas de carga solo con datos sintéticos; ensayos de migración con copia real únicamente en un ambiente aislado de migración, autorizado por la cooperativa, con acceso restringido y eliminación documentada **(Recomendada)**.
  - B) Copia anonimizada irreversible para carga y migración — la anonimización puede invalidar la conciliación.
  - C) Nunca datos reales, ni en migración — impide ensayar la conciliación de saldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-NFR-014; RNF-NFR-154; T07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-20 — Comunicaciones promocionales y Registro "No Llame"
- **Pregunta:** ¿Cómo se gestionan las comunicaciones promocionales a socios?
- **Contexto:** Ley 25.326 art. 27 y Ley 26.951 [VERIFICAR]; T09 maneja audiencias.
- **Opciones:**
  - A) Separar transaccional de promocional; promocional con consentimiento u oposición respetada y consulta del registro para llamadas y mensajes **(Recomendada)**.
  - B) Tratar todo como institucional — riesgo legal.
  - C) Prohibir comunicaciones promocionales — limita la comercialización de servicios.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-NFR-005; T09.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-21 — Redondeo por defecto
- **Pregunta:** ¿Qué regla de redondeo se usa por defecto cuando un concepto no define otra?
- **Contexto:** AGR-011 pide redondeo explícito; ARCA valida la coherencia de totales; M04/M06 pueden definir excepciones.
- **Opciones:**
  - A) Mitad hacia arriba a 2 decimales por línea, IVA por alícuota sobre la suma de netos del comprobante y residuos por mayor resto **(Recomendada)** — práctica comercial habitual.
  - B) Redondeo bancario (mitad al par) — reduce sesgo, poco habitual en facturación local.
  - C) Truncado — subfactura sistemáticamente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-203; PRM-NFR-060; O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-22 — Factor de simultaneidad del pico de plataforma
- **Pregunta:** ¿Qué factor se aplica a la suma de los picos por tenant para obtener el pico simultáneo de la plataforma (§7.1)?
- **Contexto:** Los ciclos y vencimientos de los tenants no coinciden; el perfil usaba factores implícitos distintos por fila (entre 35 % y 85 %), sin una regla.
- **Opciones:**
  - A) 0,6 en todas las filas de simultaneidad, con prueba de carga antes de O4 que lo confirma o lo recalibra **(Recomendada)**.
  - B) 1,0 (todos los tenants en su pico a la vez): sobredimensiona la infraestructura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.1; RNF-NFR-010, 016, 024, 145.
- **Estado:** Asumida (DEC-072): opción A, aplicada en §7.1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-23 — Copias anuales de 10 años
- **Pregunta:** ¿La conservación legal de 10 años necesita copias de seguridad anuales?
- **Contexto:** RNF-NFR-038 preveía copias anuales de 10 años; DEC-087 deja en línea los datos económicos y pasa a archivo en frío el detalle de más de 36 meses.
- **Opciones:**
  - A) Sin copias anuales: los datos quedan en línea los 10 años y el detalle va al archivo en frío según DEC-087; los backups sirven para recuperar **(Recomendada)**.
  - B) Además, una copia anual inmutable de 10 años: más costo de almacenamiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RNF-NFR-038, RNF-NFR-259.
- **Estado:** Asumida (DEC-072): opción A; RNF-NFR-038 ya la aplica.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-NFR-24 — Cierre de residuales del anexo (estados, referencias, tablas de campos y API)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** varias máquinas de §15.2 estaban solo en texto sin estado de alta en tabla; `dataSubjectRequests` y `securityIncidents` no listaban valores en §15.1; 2 referencias no tenían destino en la definición del campo; 16 colecciones no tenían tabla de campos; 7 filas de §15.4 citaban reglas de acceso en lugar de una capability; CU-ARQ-01 se usaba como propio y es de T11.
- **Opciones:**
  - A) Agregar las filas de alta y transiciones en la tabla de §15.2; listar valores en §15.1; declarar destinos (`purposesCovered` → `processingActivities`, `noticeId` → `privacyNotices`); agregar §15.1.1 con tablas derivadas del texto y de T05 (obligatoriedad por regla: clave única, `status`, `code`, `name` y referencias de T05 = Sí); usar `public: true` (con la condición) y `pla.salud.sondear` (registrada en T02 §4.4.2); citar CU-ARQ-01 como de T11. **(Recomendada)**.
  - B) Dejar las máquinas solo en texto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, contratos y ER de T08.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-01 — Método de verificación del vínculo usuario–persona

- **Pregunta:** ¿cómo prueba un usuario registrado que es el titular (o su representante) para ver sus cuentas?
- **Contexto:** REG-001 separa registro de acceso; ProCoop usaba una clave por socio o el DNI (V2 914/800), que no prueba identidad.
- **Opciones:** **A (Recomendada):** código impreso en la factura + número de documento, o código de un solo uso al contacto ya registrado en la cuenta, o validación presencial; intentos limitados. **B:** solo validación presencial. **C:** documento + número de cuenta sin segundo factor.
- **Impacto si no se responde:** se aplica A; sin definición no se habilita autogestión en el portal.
- **Bloquea:** RF-PER-159, PAN-PER-26, API-PER-70, M19.
- **Estado:** Respondida (DEC-043): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-02 — Documento duplicado

- **Pregunta:** ¿se permite que dos personas del tenant tengan el mismo tipo y número de documento?
- **Contexto:** V2 2077 lo permite; V2 3196 solo si la anterior está de baja; BASE exige una persona única.
- **Opciones:** **A (Recomendada):** único, con excepción aprobada y motivo (casos de error de origen o documentos reemplazados). **B:** único sin excepciones. **C:** permitir duplicados con advertencia.
- **Impacto:** se aplica A; la migración lista duplicados.
- **Bloquea:** RF-PER-025, RN-PER-005, migración.
- **Estado:** Respondida (DEC-044): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-03 — Deuda en el domicilio o catastro

- **Pregunta:** ¿la deuda de otra cuenta en el mismo domicilio o inmueble puede impedir un alta o cambio de titular?
- **Contexto:** `Validar_DeudaDomicilio` lo controla; BASE §83 prohíbe trasladar deuda entre convivientes; puede haber normativa local para casos de usurpación o fraude.
- **Opciones:** **A (Recomendada):** advertir sin revelar el detalle a terceros; bloqueo opcional por servicio solo con política validada por asesoría legal. **B:** solo advertencia, nunca bloqueo. **C:** bloqueo como en ProCoop.
- **Impacto:** se aplica A con `warn`.
- **Bloquea:** RN-PER-062, API-PER-34, PRM-PER-052.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-04 — CUIL calculado

- **Pregunta:** ¿se propone el CUIL calculado a partir de DNI y sexo?
- **Contexto:** ProCoop lo genera y guarda; puede no coincidir con el real (prefijo 23/24 o cambio de sexo registral).
- **Opciones:** **A (Recomendada):** proponer como "no verificado" y no usarlo fiscalmente hasta verificar en ARCA o con documento. **B:** no calcular nunca. **C:** usarlo como válido (como ProCoop).
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-022, RN-PER-006, migración del `CDI`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-05 — Verificación en ARCA

- **Pregunta:** ¿cuándo se consulta el padrón de ARCA y con qué credenciales?
- **Contexto:** ProCoop solo lo hace en un informe; hace falta certificado y el servicio tiene límites.
- **Opciones:** **A (Recomendada):** al alta y al cambio de CUIT, más revalidación periódica configurable (30 días), con certificado gestionado por la plataforma o el tenant; discrepancias advierten. **B:** solo a pedido del operador. **C:** al alta y bloquear ante discrepancia.
- **Impacto:** se aplica A; sin certificado queda "pendiente".
- **Bloquea:** RF-PER-020, RF-PER-029, JOB-PER-01/10, PRM-PER-014.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-06 — Deuda en el cambio de titularidad

- **Pregunta:** ¿qué ocurre con la deuda del titular anterior?
- **Contexto:** BASE §4 prohíbe reasignarla automáticamente; DFA habla de "preservar deuda".
- **Opciones:** **A (Recomendada):** queda en el titular saliente; el nuevo solo la asume mediante convenio expreso de M08 con su consentimiento. **B:** igual que A pero el cambio se bloquea si hay deuda (PRM-PER-075 = `block`). **C:** la deuda acompaña al contrato.
- **Impacto:** se aplica A; C queda descartada por BASE.
- **Bloquea:** RF-PER-133, RN-PER-101, M08.
- **Estado:** Respondida (DEC-045): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-07 — Clonar o mover el contrato al transferir

- **Pregunta:** ¿el cambio de titularidad crea un contrato nuevo o reasigna el existente?
- **Contexto:** ProCoop clona por defecto y tiene un modo que mueve (V2 422).
- **Opciones:** **A (Recomendada):** clonar siempre: contrato de origen `notInForce` y nuevo en la cuenta destino, con referencia mutua. **B:** mover conservando el identificador con una nueva vigencia de titular. **C:** configurable.
- **Impacto:** se aplica A; M02 debe soportar la referencia origen–destino.
- **Bloquea:** RN-PER-104, JOB-PER-07, M02.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-08 — Efectos del fallecimiento

- **Pregunta:** ¿qué hace el sistema al registrar el fallecimiento de un titular?
- **Contexto:** ProCoop da de baja adhesiones y beneficios y avisa tareas; no corta servicios.
- **Opciones:** **A (Recomendada):** registrar con evidencia, dar de baja adhesiones y beneficios de la persona, revocar relaciones, crear tareas (sucesión, garante) y no cortar ni facturar distinto. **B:** además bloquear nuevas contrataciones de la cuenta. **C:** solo registrar la fecha.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-009, RN-PER-014.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-09 — Cuenta principal y titular sin cuentas

- **Pregunta:** ¿todo titular activo debe tener exactamente una cuenta principal?
- **Contexto:** V2 2374, 3164, 3193 y 2324 crean excepciones.
- **Opciones:** **A (Recomendada):** exactamente una principal si tiene cuentas; sin cuentas solo en estado "solicitante"; excepciones de V2 3164/3193 como políticas. **B:** principal opcional. **C:** como ProCoop, todo por parámetro.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-056, RN-PER-029, RN-PER-030.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-10 — Control de la fusión de personas

- **Pregunta:** ¿quién aprueba una fusión y si puede revertirse?
- **Opciones:** **A (Recomendada):** solicita un usuario, aprueba otro con `per.personas.unificar` (antes `per.personas.fusionar`); reversible durante 30 días (PRM-PER-099). **B:** un solo usuario con permiso. **C:** sin reversión.
- **Impacto:** se aplica A.
- **Bloquea:** RF-PER-157, JOB-PER-08.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-11 — Datos mínimos para registrar una persona

- **Pregunta:** ¿qué datos son obligatorios al registrar una persona desde el portal o atención?
- **Opciones:** **A (Recomendada):** nombre, una identificación y un contacto; DNI/CUIT verificado antes de contratar. **B:** solo nombre y contacto. **C:** todos los datos fiscales desde el inicio.
- **Impacto:** se aplica A (PRM-PER-095).
- **Bloquea:** CU-REG-01, RF-PER-001.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-12 — Autorizaciones otorgadas desde el portal

- **Pregunta:** ¿qué puede conceder el titular desde la app sin intervención de la cooperativa?
- **Opciones:** **A (Recomendada):** autorizar a mayores de 18 a consultar y pagar; acciones mayores (bajas, cambios) requieren validación con evidencia. **B:** cualquier acción. **C:** nada desde el portal.
- **Impacto:** se aplica A (PRM-PER-096/097).
- **Bloquea:** RF-PER-105, PAN-PER-27.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-13 — Proveedor geográfico

- **Pregunta:** ¿qué servicios se usan para normalizar, geocodificar y mostrar mapas?
- **Contexto:** BASE §77 pide Google Maps y catálogo nacional; hay costos y términos de uso.
- **Opciones:** **A (Recomendada):** Georef para normalización y geocodificación por altura; Google Maps para mapa y autocompletado con resultados confirmados. **B:** solo Google. **C:** solo catálogo propio de T04.
- **Impacto:** se aplica A (PRM-PER-101).
- **Bloquea:** JOB-PER-02, PAN-PER-06, T04.
- **Estado:** Respondida (DEC-046): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-14 — Conservación y anonimización

- **Pregunta:** ¿cuánto se conservan los datos personales de personas sin relación vigente y qué se anonimiza?
- **Opciones:** **A (Recomendada):** plazos por categoría configurables (por defecto 10 años desde la última obligación para datos fiscales), anonimización del resto, validado por asesoría legal. **B:** conservar todo indefinidamente. **C:** borrar al pedido.
- **Impacto:** se aplica A con T08.
- **Bloquea:** RF-PER-165, JOB-PER-11, PRM-PER-100.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-15 — Numeración de titulares y asociados

- **Pregunta:** ¿una o dos series de números?
- **Contexto:** V2 32 permite numerar asociados y no asociados por separado; `NUM_SOC` (NIP) es el número de asociado.
- **Opciones:** **A (Recomendada):** número de titular único en PER y número de asociado propio en M17. **B:** dos series de titular según condición de asociado. **C:** un solo número compartido.
- **Impacto:** se aplica A; la migración conserva ambos números.
- **Bloquea:** RF-PER-042, PRM-PER-002, M17.
- **Estado:** Respondida (DEC-017, registrada como PA-CFG-P1-01): secuencia única por tenant con atributo de tipo; número manual solo en migración. El número de asociado sigue siendo propio de M17.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PER-16 — Bloqueo de cobro en caja

- **Pregunta:** ¿el bloqueo `cashPayment` rechaza el cobro o pide autorización?
- **Contexto:** `BLO_CAJ` bloquea; rechazar pagos puede perjudicar la cobranza.
- **Opciones:** **A (Recomendada):** requiere autorización de supervisor y muestra el mensaje. **B:** rechazo absoluto. **C:** solo advertencia.
- **Impacto:** se aplica A (PRM-PER-073).
- **Bloquea:** RF-PER-123, M07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

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

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-01 — Región de alojamiento de datos
- **Pregunta:** ¿En qué región se alojan los datos de producción de las cooperativas?
- **Contexto:** DEC-004 fija AWS pero no la región; la Ley 25.326 y criterios de la AAIP sobre transferencia internacional; latencia; costo. No hay región AWS en Argentina [VERIFICAR disponibilidad actual].
- **Opciones:**
  - A) AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia según AAIP **(Recomendada)** — menor latencia regional, cumplimiento contractual.
  - B) AWS us-east-1 — menor costo, mayor latencia y más exigencia contractual.
  - C) Proveedor con centro de datos en Argentina para la base y AWS para el resto — soberanía, mayor complejidad operativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-157, PRM-PLA-049, O1 (producción).
- **Estado:** Respondida (DEC-062): AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia internacional según la AAIP; diseño agnóstico de nube.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-02 — Objetivos de RPO y RTO
- **Pregunta:** ¿Qué RPO y RTO se comprometen?
- **Contexto:** Define costo de backups (PITR) y procedimientos; BASE §64 exige continuidad sin fijar valores.
- **Opciones:**
  - A) RPO ≤ 15 min; RTO por tenant ≤ 4 h; plataforma completa ≤ 8 h **(Recomendada)** — alcanzable con PITR y backups lógicos por tenant.
  - B) RPO ≤ 24 h; RTO ≤ 24 h — más barato, riesgo de pérdida de cobros del día.
  - C) RPO ≤ 1 min; RTO ≤ 1 h — requiere multi-región activa, costo alto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-121, PRM-PLA-015..017, §17.6.
- **Estado:** Respondida (DEC-063): RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h para la plataforma completa.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-03 — SLO de disponibilidad, latencia y SLA de soporte
- **Pregunta:** ¿Qué niveles de servicio se ofrecen en el contrato SaaS?
- **Contexto:** BASE §64.6 (CU-SaaS-01) no fija plazos; condicionan guardia y costos.
- **Opciones:**
  - A) 99,5 % mensual; p95 interactivo ≤ 800 ms; soporte lun–vie 8–18 con P1 24×7 y plazos de `PRM-PLA-035` **(Recomendada)** — valores iniciales razonables para un equipo chico.
  - B) 99,9 % y soporte 24×7 para todas las prioridades — exige guardia ampliada.
  - C) Sin SLA contractual en el piloto — simple, débil comercialmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-098, RF-PLA-132, RNF-PLA-011, PRM-PLA-018/019/035/036.
- **Estado:** Respondida (DEC-063): disponibilidad 99,5 % mensual; p95 interactivo ≤ 800 ms; soporte de lunes a viernes de 8 a 18 con P1 24×7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-04 — Portal del socio durante la suspensión del tenant
- **Pregunta:** Cuando se suspende una cooperativa, ¿qué pueden hacer sus socios en el portal?
- **Contexto:** Cortar el portal perjudica a los socios y a la cobranza; mantenerlo completo debilita la suspensión.
- **Opciones:**
  - A) Consulta y pagos activos; nuevas solicitudes bloqueadas **(Recomendada)** — protege al socio y la cobranza.
  - B) Solo consulta.
  - C) Portal fuera de servicio con aviso.
- **Impacto si no se responde:** se asume A (`PRM-PLA-006 = readAndPay`).
- **Bloquea:** RF-PLA-049, RN-PLA-012, §17.3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-05 — Aprobación del acceso de soporte
- **Pregunta:** ¿Quién aprueba los accesos temporales de soporte según su alcance?
- **Contexto:** BASE §64.5 exige acceso controlado; Ley 25.326 (datos personales).
- **Opciones:**
  - A) `observe` sin datos personales: aprobación de plataforma y aviso al tenant; con datos personales, `operate` o `config`: aprobación del administrador del tenant; break-glass: dos aprobadores de plataforma y aviso inmediato **(Recomendada)** — equilibrio entre agilidad y control.
  - B) Todo acceso requiere aprobación del tenant — máximo control, demora en P1.
  - C) Soporte con acceso permanente de lectura — rápido, inaceptable para privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-101, RF-PLA-102, RF-PLA-105, RN-PLA-018.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-06 — Forma del ambiente de prueba de cada cooperativa
- **Pregunta:** ¿Cómo se ofrece el ambiente de prueba a cada cooperativa?
- **Contexto:** Maestro §6 pide prueba por tenant; BASE §97.9 prohíbe datos demo en producción.
- **Opciones:**
  - A) Ambiente `sandbox` separado con un tenant gemelo por cooperativa **(Recomendada)** — aislamiento total de credenciales y envíos.
  - B) Tenant de prueba dentro del ambiente de producción — más simple, riesgo de envíos reales.
  - C) Sin sandbox; solo `demo` común — no permite probar la configuración propia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-111, CU-PLA-07.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-07 — Datos del sandbox
- **Pregunta:** ¿Con qué datos se carga el sandbox?
- **Contexto:** Maestro §6 dice “anonimizados”; la anonimización imperfecta es un riesgo de privacidad.
- **Opciones:**
  - A) Ficticios por defecto y copia anonimizada solo con aprobación del administrador y de seguridad **(Recomendada)**.
  - B) Siempre copia anonimizada de producción.
  - C) Copia sin anonimizar — descartable por privacidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-116, CTR-PLA-09.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-08 — Facturación del servicio SaaS a las cooperativas
- **Pregunta:** ¿Con qué herramienta factura el proveedor el SaaS?
- **Contexto:** El contrato y el uso viven en PLA; la emisión fiscal está en M05/M06 (O4/O5).
- **Opciones:**
  - A) Con el propio módulo FAC bajo el tenant PLATFORM desde O5; en O1, prefactura exportable **(Recomendada)** — dogfooding y una sola lógica fiscal.
  - B) Sistema externo de facturación permanente.
  - C) Facturación manual sin prefactura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-040, RF-PLA-082, JOB de prefactura.
- **Estado:** Respondida (DEC-065): facturación del SaaS con M05 bajo el tenant `PLATFORM` desde O5 y prefactura exportable en O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-09 — Modelo comercial
- **Pregunta:** ¿Cómo se estructura el precio del SaaS?
- **Contexto:** Define `platformPlans` y medición.
- **Opciones:**
  - A) Packs por tamaño más complementos, con cupo por contratos activos **(Recomendada)** — predecible y alineado al valor.
  - B) Precio por usuario interno.
  - C) Precio por módulo sin cupos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-072, `platformPlans`.
- **Estado:** Respondida (DEC-065): packs por tamaño más complementos con cupo por contratos activos; la mensajería revendida es un complemento medido (DEC-077).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-10 — Comportamiento al superar el cupo duro
- **Pregunta:** Al superar el límite contratado, ¿qué se bloquea?
- **Contexto:** Bloquear la operación dañaría la facturación de la cooperativa.
- **Opciones:**
  - A) Solo nuevas altas de la dimensión excedida (p. ej. nuevos contratos); el resto sigue **(Recomendada)**.
  - B) Solo aviso y cargo por excedente, sin bloqueo.
  - C) Pasar el tenant a solo lectura.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-078, RN-PLA-016, CU-PLA-11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-11 — Dominios de la cooperativa
- **Pregunta:** ¿Con qué dominio accede cada cooperativa a su landing y portal?
- **Contexto:** BASE §2 (marca y landing propias).
- **Opciones:**
  - A) Subdominio de la plataforma y dominio propio opcional verificado **(Recomendada)**.
  - B) Solo subdominio.
  - C) Dominio propio obligatorio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** `tenants.domains`, PRM-PLA-050.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-12 — Política de salida de una cooperativa
- **Pregunta:** ¿Qué plazos y obligaciones rigen cuando una cooperativa deja el servicio?
- **Contexto:** Portabilidad (MER-020), conservación fiscal (10 años) [VERIFICAR] y privacidad.
- **Opciones:**
  - A) 90 días de solo lectura con exportación completa, luego retención de `PRM-PLA-005` días antes de purgar; la custodia fiscal queda en manos de la cooperativa con la exportación entregada **(Recomendada)**.
  - B) Custodia fiscal por el proveedor durante el plazo legal (servicio pago).
  - C) Purga inmediata tras exportar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-051, RF-PLA-081, RF-PLA-158, PRM-PLA-004/005.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-13 — Versiones por cooperativa
- **Pregunta:** ¿Puede una cooperativa diferir una actualización?
- **Contexto:** Una sola versión simplifica operación; algunas cooperativas piden congelar cambios en cierres.
- **Opciones:**
  - A) Misma versión para todos; cambios visibles por feature flags y anillos, sin diferir **(Recomendada)**.
  - B) Diferir hasta 30 días.
  - C) Versiones por cooperativa.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-PLA-149, RN-PLA-036.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-14 — Varias personas jurídicas en un mismo tenant
- **Pregunta:** ¿Un tenant puede agrupar varias personas jurídicas (CUIT distintos)?
- **Contexto:** ProCoop tiene `EMPRESAS` (grupo); algunas cooperativas tienen mutuales o sociedades vinculadas.
- **Opciones:**
  - A) Sí, mediante `legalEntities` del tenant gestionadas en T04 (emisión, contabilidad y sueldos por entidad) **(Recomendada)**.
  - B) No; un tenant por CUIT.
  - C) Solo para sueldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-PLA-007, §19 (`EMPRESAS`), T04, M05/M06/M16.
- **Estado:** Respondida (DEC-064): opción A; `legalEntities` y `branches` se definen en T04 (RF-CFG-134 a 142) desde O0, con `legalEntityId` obligatorio en los documentos económicos.

---

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-PLA-15 — Cierre de residuales del anexo (estados, referencias, API, colas y CU)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables de análisis?
- **Contexto:** 10 máquinas no declaraban el estado de alta; `schemaMigrations` citaba `expand` (valor de `phase`) como si fuera de `status`; 5 referencias no tenían destino en la definición del campo; 24 colecciones del §7 no tenían tabla de campos; 5 filas de §11 citaban reglas de acceso en lugar de una capability; JOB-PLA-01 corría como "proceso dedicado" sin fila en la tabla de clases de cola; el ID CU-ARQ-01 es de T11.
- **Opciones:**
  - A) Agregar §8.13 y las filas "—" de `healthSnapshots`; aclarar `schemaMigrations`; declarar destinos en cada campo y usar los nombres canónicos de T05 (`supportAccessGrantId`, `jobId`); agregar las tablas de campos de §7.12 (derivadas del texto y de T05, obligatoriedad por regla); usar `public: true` y las capabilities implícitas o técnicas registradas en T02 (PA-IAM-18): `pla.archivos.ver`, `pla.archivos.subir`, `pla.misProcesos.ver`, `pla.salud.sondear`; agregar a la tabla de colas la fila de excepción de JOB-PLA-01; renumerar el CU propio a CU-PLA-15. **(Recomendada)**.
  - B) Mover JOB-PLA-01 a la cola `maintenance` y mantener el resto como está.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** diagramas de estados, ER y contratos OpenAPI de T01.
- **Estado:** Asumida (DEC-072): opción A.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `tenantExports.files[].fileId` pasa a `storedFileId` → `storedFiles` (antes `fileId`), nombre canónico de T05 COL-PLA-21 (PA-DAT-04).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-01 — Identidad global o por tenant
- **Pregunta:** ¿La identidad de acceso del socio es única en la plataforma o se crea una por cooperativa?
- **Contexto:** AGR-006 separa identidad de pertenencia; una persona puede ser socia de dos cooperativas (CU-POR-21). CNX trabaja con código de empresa.
- **Opciones:**
  - A) Identidad común en la plataforma con pertenencias privadas por tenant y selector de ámbito **(Recomendada)** — un solo login; ningún tenant ve las pertenencias de otro.
  - B) Una identidad por tenant — aislamiento total, pero la persona repite registro y contraseña.
  - C) Identidad común visible entre tenants — más simple, pero viola la privacidad entre cooperativas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-022, 027; RN-POR-001, 009; T02; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-02 — Consulta y pago de facturas sin login
- **Pregunta:** ¿Se permite consultar y pagar facturas sin iniciar sesión?
- **Contexto:** CoopOnline lo permite (VAR_PMOVIL 60/61), incluso mostrando todos los comprobantes; BASE §25 exige que conocer una cuenta no alcance para ver datos privados.
- **Opciones:**
  - A) Permitir, opcional por tenant, con número de cuenta + dato verificador, solo impagas y datos enmascarados **(Recomendada)** — mantiene la facilidad de pago sin exponer datos.
  - B) No permitir; solo pago por código (PAN-POR-22) — máxima privacidad, más fricción.
  - C) Replicar CoopOnline (todos los comprobantes) — expone historial a cualquiera con el número.
- **Impacto si no se responde:** se asume A con PRM-POR-052 en `false`.
- **Bloquea:** RF-POR-012; RN-POR-060; PAN-POR-12; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-03 — Migración de credenciales de CoopOnline
- **Pregunta:** ¿Cómo acceden los usuarios actuales de CoopOnline al nuevo portal?
- **Contexto:** `WS_USERS` guarda contraseñas en un esquema heredado; migrarlas sería inseguro, pero exigir re-registro pierde usuarios.
- **Opciones:**
  - A) Migrar usuarios, vínculos y adhesiones; activar con OTP al correo/celular sin re-registro; nunca importar contraseñas **(Recomendada)** — continuidad y seguridad.
  - B) Re-registro completo y nueva vinculación — limpio, pero alta pérdida de usuarios y carga en atención.
  - C) Importar contraseñas y re-hashear al primer ingreso — conserva el hábito, arrastra un riesgo de seguridad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-031, 169…173; PAN-POR-20, 92; O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-04 — Vinculación por identidad federada verificada (CiDi)
- **Pregunta:** ¿Se permite vincular cuentas automáticamente cuando el DNI verificado por CiDi coincide con el titular?
- **Contexto:** CoopOnline habilita CiDi (VAR_PMOVIL 40); AGR-006 prohíbe vincular por mera coincidencia de datos.
- **Opciones:**
  - A) Permitir solo si el tenant lo habilita y el DNI verificado coincide con el titular, avisando al titular **(Recomendada)** — autoservicio con verificación fuerte.
  - B) CiDi solo como método de ingreso, sin vincular — más conservador.
  - C) Vincular por cualquier coincidencia de DNI — rápido pero inseguro.
- **Impacto si no se responde:** se asume A con PRM-POR-006 en `false`.
- **Bloquea:** RF-POR-026, 036; O2.
- **Estado:** Respondida (DEC-067): mecanismo federado en O1, CiDi habilitable por tenant al publicar el portal (O2), nivel mínimo 2 para vincular cuentas.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-05 — Activación inmediata frente a solicitud
- **Pregunta:** ¿Qué acciones del portal se ejecutan al instante y cuáles generan solicitud?
- **Contexto:** BASE §25/§43 habla de "activar/desactivar"; §48 dice que solicitar no es ejecutar (CTR-POR-01).
- **Opciones:**
  - A) Siempre solicitud; inmediata solo para adhesiones, recarga prepaga y cambios de plan configurados en PRM-POR-072 **(Recomendada)** — estados reales y autoservicio donde no hay riesgo.
  - B) Todo como solicitud — más control, más carga operativa.
  - C) Activación inmediata en general — rápido, pero muestra estados falsos sin instalación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-070, 071; RN-POR-011; O2–O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-06 — Tótem de autogestión
- **Pregunta:** ¿Cómo se reemplaza AutoGestion.exe (tótem presencial)?
- **Contexto:** INV AutoGestion muestra un tótem Windows con lector de tarjetas, billetero, QR e impresión; CoopApps es web (DEC-001).
- **Opciones:**
  - A) Modo tótem de la PWA con agente local para periféricos, en O10, prioridad Extensión **(Recomendada)** — misma lógica de cobro que el portal.
  - B) Mantener AutoGestion.exe contra la API nueva — reutiliza hardware, duplica lógica en otra tecnología.
  - C) Descartar el tótem — simplifica, pero pierde un canal presencial existente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-161…168; PAN-POR-78…83, 96; O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-07 — Layout de escritorio
- **Pregunta:** ¿El portal en PC mantiene el marco de teléfono de CNX?
- **Contexto:** CNX usa phone shell fijo; muchos socios consultan facturas desde PC (CTR-POR-11).
- **Opciones:**
  - A) Phone shell en móvil y vista ancha para facturas, consumos y gestiones **(Recomendada)** — legibilidad en PC sin duplicar pantallas.
  - B) Phone shell siempre — coherencia visual, peor uso en PC.
  - C) Diseño de escritorio completo separado — mejor experiencia, doble mantenimiento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-POR-024; T03; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-08 — Pagador eventual
- **Pregunta:** ¿Puede una persona sin acceso a la cuenta pagar una factura ajena?
- **Contexto:** ESC-01 (hermano que paga por otro); BASE §25 protege los datos privados.
- **Opciones:**
  - A) Pagar por código de pago/QR sin ver el detalle **(Recomendada)** — facilita la cobranza sin exponer datos.
  - B) Solo con representación otorgada — más control, menos cobranza.
  - C) Pago libre con número de cuenta — expone deuda a terceros.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-045, 100; PAN-POR-22; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-09 — Pago a cuenta o parcial
- **Pregunta:** ¿Se permite pagar un importe distinto del total de las facturas seleccionadas?
- **Contexto:** CoopOnline rechaza importes distintos (CTR-POR-09); AGR-012 contempla imputación parcial.
- **Opciones:**
  - A) Solo si la política de imputación de M07 lo habilita para el tenant **(Recomendada)** — flexible sin perder control.
  - B) Nunca — simple, pero frustra a socios con dificultad de pago.
  - C) Siempre — máxima flexibilidad, complica la conciliación.
- **Impacto si no se responde:** se asume A con la política deshabilitada.
- **Bloquea:** RF-POR-101; RN-POR-031; O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-10 — Portal del empleado con la misma identidad
- **Pregunta:** ¿El empleado que además es socio usa la misma identidad para ambos espacios?
- **Contexto:** BASE §104 y CNX incluyen portal del empleado; RN-POR-010 exige no mezclar datos.
- **Opciones:**
  - A) Misma identidad, espacio separado y reautenticación para recibos y legajo **(Recomendada)** — un solo acceso con aislamiento.
  - B) Identidades distintas — aislamiento fuerte, doble gestión de credenciales.
  - C) Misma identidad y mismo espacio — riesgo de mezcla de datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-028, 129…136; O9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-11 — Firma de recibos de sueldo
- **Pregunta:** ¿Con qué mecanismo firma el empleado su recibo?
- **Contexto:** VAR 3122/3166 exigen firma; la firma digital con certificado es costosa para el empleado.
- **Opciones:**
  - A) Conformidad electrónica con OTP, hash del documento y sello de tiempo **(Recomendada)** — trazable y simple.
  - B) Firma digital con certificado — máxima validez, alta fricción.
  - C) Aceptación con un clic — simple, evidencia débil.
- **Impacto si no se responde:** se asume A; validación legal pendiente con el asesor laboral del tenant.
- **Bloquea:** RF-POR-130; RN-POR-058; O9.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-12 — Dominio de la landing
- **Pregunta:** ¿Dónde se publica la landing de cada cooperativa?
- **Contexto:** RF-POR-001; muchas cooperativas ya tienen dominio propio.
- **Opciones:**
  - A) Subdominio de la plataforma + dominio propio opcional con TLS automático **(Recomendada)** — arranque inmediato y marca propia.
  - B) Solo subdominio — simple, sin marca propia.
  - C) Solo dominio propio — depende de cada cooperativa para salir.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-POR-002, 003; T08; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-13 — Editor de landing
- **Pregunta:** ¿Qué grado de libertad tiene la cooperativa para diseñar su landing?
- **Contexto:** BASE §101/§105 pide landing por tenant; un editor libre arriesga accesibilidad y la obligación del botón de baja.
- **Opciones:**
  - A) Bloques predefinidos con circuito de publicación **(Recomendada)** — accesible, con marca y sin romper obligaciones.
  - B) Editor libre HTML/CSS — máxima libertad, alto riesgo.
  - C) Plantilla fija — sin esfuerzo, poca personalización.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-002, 003, 150; PAN-POR-85, 86; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-14 — Autolectura
- **Pregunta:** ¿Se ofrece al socio informar su propia lectura del medidor?
- **Contexto:** MER-018 la propone; la lectura impacta facturación (M03).
- **Opciones:**
  - A) Habilitable por servicio; la lectura se valida en M03 antes de facturar **(Recomendada)** — reduce visitas sin perder control.
  - B) No ofrecer — sin riesgo, sin beneficio.
  - C) Lectura del socio directa a facturación — riesgo de errores y fraude.
- **Impacto si no se responde:** se asume A con PRM-POR-061 en `false`.
- **Bloquea:** RF-POR-107; RN-POR-065; O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-15 — Socio moroso o suspendido
- **Pregunta:** ¿Qué puede hacer en el portal un socio con deuda vencida o servicio suspendido?
- **Contexto:** VAR_PMOVIL 37 controla deuda vencida en la web; la baja y el reclamo no pueden condicionarse.
- **Opciones:**
  - A) Nunca bloquear consulta, pago, reclamo ni baja; nuevas contrataciones según PRM-POR-071 **(Recomendada)** — cumple la norma y favorece la regularización.
  - B) Bloquear todo excepto pagar — presiona el cobro, viola el derecho a la baja.
  - C) Sin controles — permite contratar con deuda.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-049, 050, 099; RN-POR-057; O5–O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-16 — DDJJ de artefactos y vehículos eléctricos
- **Pregunta:** ¿Se incluyen las declaraciones juradas de artefactos y vehículos eléctricos?
- **Contexto:** CoopOnline las ofrece (`CrearDDJJ_Artefactos`, VAR_PMOVIL 44, 59, 75).
- **Opciones:**
  - A) En alcance vía el motor de formularios, habilitables por tenant **(Recomendada)** — sin desarrollo específico.
  - B) Desarrollo dedicado — más rico, más costo.
  - C) Fuera de alcance — pierde una función usada por cooperativas eléctricas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-069; RN-POR-042; PAN-POR-66; O7. Con HUE-GAS-01 el motor de formularios se alimenta de la plantilla por servicio de M02 (PRM-CAT-110), que cubre gas y energía.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-17 — Comentarios del muro
- **Pregunta:** ¿Los socios pueden comentar publicaciones del muro?
- **Contexto:** DEC-008 permite comentarios moderados; BASE §46 lo dejaba pendiente (CTR-POR-14).
- **Opciones:**
  - A) Deshabilitados por defecto; habilitables por tenant y publicación con moderación **(Recomendada)** — prudencia sin perder la función.
  - B) Habilitados por defecto — más participación, más carga de moderación.
  - C) Nunca — contradice DEC-008.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-125; PRM-POR-086; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-18 — Resúmenes de terceros (FECESCOR)
- **Pregunta:** ¿Se mantiene el cobro de resúmenes de tarjetas regionales u otros convenios de terceros?
- **Contexto:** CoopOnline cobra resúmenes FECESCOR (`CrearCobranzaResumenTarjeta`, VAR 3114, VAR_PMOVIL 68).
- **Opciones:**
  - A) Extensión en O8, deshabilitada por defecto **(Recomendada)** — conserva la función para quien la usa.
  - B) Núcleo en O5 — adelanta una función minoritaria.
  - C) Descartar — perjudica a las cooperativas con ese convenio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-102; PRM-POR-058; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-19 — App en tiendas
- **Pregunta:** ¿Se publica la app en Google Play y App Store?
- **Contexto:** CNX es PWA; algunas cooperativas esperan "app en la tienda" y push en iOS tiene limitaciones.
- **Opciones:**
  - A) PWA instalable sin tiendas al inicio; empaquetado TWA/Capacitor opcional por tenant después **(Recomendada)** — sin costo de publicación inicial.
  - B) Apps nativas desde el inicio — mejor presencia, mucho más costo.
  - C) Solo web sin instalación — pierde push y acceso rápido.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-POR-145; O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-20 — Tabbar del socio y pantalla Comunidad (PA 16 del pendiente de cierre)
- **Pregunta:** ¿Cuál es la tabbar del socio y qué abre el destino "Comunidad"?
- **Contexto:** este anexo tenía Inicio · Servicios · (+) · Facturas · Perfil; T03 (RF-UXD-066, CTR-UXD-12) y el maestro §9.2 fijan Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad, con Perfil en la topbar, y T03 SM-PWS-026 espera una pantalla Comunidad de M19.
- **Opciones:**
  - A) Alinear con T03 y el maestro; FAB = Pagar por defecto; nueva PAN-POR-105 `/app/comunidad` que agrega muro, encuestas y novedades con la capability existente `por.portal.ver` (RF-POR-180) **(Recomendada)**.
  - B) Mantener la tabbar de este anexo y que T03 se ajuste.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §10.1, §10.3, PAN-POR-105, RF-POR-180.
- **Estado:** Asumida la recomendada (DEC-072). Las tabbars de empleado y de registrado sin cuenta no cambian en esta corrección.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-POR-21 — Versiones de formularios del portal (PA 18 del pendiente de cierre)
- **Pregunta:** ¿Las versiones de `portalForms` se guardan embebidas (`versions`) o en `formVersions` de T11?
- **Contexto:** T05 (COL-POR-06) declara `portalForms` sobre `formVersions` de T11; este anexo versionaba en `versions` embebido.
- **Opciones:**
  - A) `formVersions` de T11: `portalForms` guarda la configuración del portal y `formVersionId`; las presentaciones y borradores guardan el `formVersionId` usado **(Recomendada)**.
  - B) Versionado embebido en M19.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.6 a §7.8, §8.4.
- **Estado:** Asumida la recomendada (DEC-072); `versions` y `currentVersion` quedan marcados como reemplazados.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-01 — Alcance de internaciones y salud

**Pregunta:** ¿La cooperativa gestiona internaciones o prácticas médicas por convenio?
**Contexto:** DFA M25 menciona internaciones, pero `INTERNAC` es telefonía; BASE §24 excluye la historia clínica.
**Opciones:**
- A) **(Recomendada)** Registro administrativo de autorizaciones por convenio (prestador, fechas, número, costo), sin datos clínicos.
- B) No incluir internaciones.
- C) Módulo clínico separado con revisión especializada.
**Impacto si no se responde:** se aplica A como extensión deshabilitada.
**Bloquea:** RF-SOC-081, PAN-SOC-16.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-02 — Ambulancias: emergencias o traslados programados

**Pregunta:** ¿El servicio de ambulancia cubre emergencias o solo traslados programados?
**Contexto:** BASE §92 indica no asumir urgencias; ProCoop registra viajes de ambulancia.
**Opciones:**
- A) **(Recomendada)** Traslados programados y registro administrativo de viajes; emergencias derivadas al prestador habilitado (`derived`).
- B) Despacho de emergencias propio: requiere habilitación y otro sistema.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-074, RF-SOC-082.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-03 — Datos del banco de sangre

**Pregunta:** ¿Qué datos de donantes o pacientes se guardan?
**Contexto:** BASE §91 limita a datos estrictamente necesarios; V2 2527 valida edades de donante.
**Opciones:**
- A) **(Recomendada)** Solo datos administrativos (persona, contacto, referencia del prestador); sin grupo sanguíneo, diagnóstico ni aptitud.
- B) Guardar grupo sanguíneo con consentimiento: aumenta riesgo y obligaciones.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-069, RF-SOC-070.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-04 — Edad de corte de adherentes

**Pregunta:** ¿Qué edad de corte rige para hijos y otros vínculos?
**Contexto:** ProCoop usa 21 años fijos.
**Opciones:**
- A) **(Recomendada)** Configurable por plan y vínculo, con 21 por defecto y extensión por estudio o discapacidad.
- B) 18 años para todos.
- C) 21 fijo como ProCoop.
**Impacto si no se responde:** se aplica A con 21.
**Bloquea:** RF-SOC-017, JOB-SOC-01.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-05 — Modalidad jurídica del cementerio

**Pregunta:** ¿El cementerio encuadra en los arts. 2103 a 2113 del CCyC o en una concesión municipal u otra modalidad?
**Contexto:** BASE §90 exige verificarlo.
**Opciones:**
- A) **(Recomendada)** Configurable por establecimiento; los derechos referencian el reglamento vigente.
- B) Asumir cementerio privado del CCyC.
**Impacto si no se responde:** se aplica A con revisión legal pendiente.
**Bloquea:** RF-SOC-049, RF-SOC-053.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-06 — Cesión, devolución y extinción de derechos de sepultura

**Pregunta:** ¿Qué operaciones admite el reglamento: cesión, sucesión, devolución, extinción por abandono?
**Contexto:** BASE §90: no prometer baja por botón; la mora no autoriza disponer de restos.
**Opciones:**
- A) **(Recomendada)** Trámites con workflow T11 y aprobación jurídica; nunca automáticos por mora.
- B) Solo cesión y sucesión.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-059, CU-SOC-06.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-07 — Proveedor GPS/AVL

**Pregunta:** ¿Qué proveedor de seguimiento satelital usa el piloto?
**Contexto:** ProCoop integra AVL de Discar por proceso batch.
**Opciones:**
- A) **(Recomendada)** Adaptador genérico T06 (webhook o pull) con Discar como primer adaptador si el piloto lo usa.
- B) Sin GPS en el alcance inicial.
**Impacto si no se responde:** se entrega el adaptador genérico sin conector concreto.
**Bloquea:** RF-SOC-132 a RF-SOC-134.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-08 — Fondo fiduciario de vivienda

**Pregunta:** ¿Se usa el control de meses adeudados para fondo fiduciario (V2 637)?
**Contexto:** Parámetro sin lectura relevada en el código.
**Opciones:**
- A) **(Recomendada)** Regla de mora configurable por plan, desactivada por defecto.
- B) Descartar.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-111.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-09 — Actualización del precio de la vivienda

**Pregunta:** ¿Cómo se actualiza el valor de la tipología?
**Contexto:** ProCoop usa precios con fecha y actualización masiva por plan/etapa.
**Opciones:**
- A) **(Recomendada)** Precio vigente por tipología con actualización masiva manual o por índice (por ejemplo, costo de la construcción) con aprobación.
- B) Solo carga manual.
**Impacto si no se responde:** se aplica A sin índice automático.
**Bloquea:** RF-SOC-087.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-10 — Subsidio por fallecimiento

**Pregunta:** ¿El subsidio se paga con fondo propio o por un seguro de terceros?
**Contexto:** BASE §92: no es automáticamente un seguro.
**Opciones:**
- A) **(Recomendada)** Configurable por plan; por defecto fondo propio por reglamento aprobado con pago por M14.
- B) Siempre seguro de terceros (M18 solo registra el siniestro).
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-044.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-11 — Carencias de sepelio

**Pregunta:** ¿Qué carencias aplican y desde cuándo se cuentan?
**Contexto:** BASE §92 pide relevar carencias.
**Opciones:**
- A) **(Recomendada)** Carencia configurable por plan, contada desde el alta de cada adherente, con excepción autorizada.
- B) Sin carencias.
**Impacto si no se responde:** se aplica A con 0 días.
**Bloquea:** RF-SOC-005.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-12 — Rendiciones de viaje

**Pregunta:** ¿Las rendiciones se usan solo para fletes de ventas o también para traslados y OT?
**Contexto:** ProCoop vincula la rendición a un comprobante de venta.
**Opciones:**
- A) **(Recomendada)** Rendición genérica de M18 vinculable a venta, viaje u OT.
- B) Solo fletes de ventas (M11).
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-128, RF-SOC-131.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-13 — Comprobante exclusivo de vivienda

**Pregunta:** ¿Las cuotas de vivienda van en comprobante propio?
**Contexto:** ProCoop lo impone (V2 639); MER-010 favorece documentos propios para conceptos ajenos al servicio.
**Opciones:**
- A) **(Recomendada)** Replicar comprobante exclusivo configurable.
- B) Incluir en la factura de servicios.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-SOC-094.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-14 — Ola de adherentes

**Pregunta:** ¿La cooperativa piloto factura servicios con tarifa por cantidad de adherentes desde el inicio?
**Contexto:** M04 (O4) necesita la cantidad de adherentes para los tipos de cálculo 9 a 13.
**Opciones:**
- A) **(Recomendada)** Registro de adherentes y `billing-inputs` en O4; el resto de M18 en O10.
- B) Todo en O10 con cantidades migradas como dato fijo hasta entonces.
**Impacto si no se responde:** se planifica A.
**Bloquea:** RF-SOC-011, RF-SOC-026, plan de olas.
**Estado:** Respondida (DEC-071): opción A. Adherentes y sus entradas a facturar (`billing-inputs`) en O4; el resto de M18 en O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-15 — Uso real de planes de vivienda y ambulancias

**Pregunta:** ¿El piloto usa planes de vivienda y traslados de ambulancia?
**Contexto:** DFA (línea 1269) y RN-10 (§16.5) piden validar uso; DEC-007 los mantiene en alcance.
**Opciones:**
- A) **(Recomendada)** Especificar completo y habilitar por tenant; priorizar dentro de O10 según uso real.
- B) Diferir a una ola posterior a O10.
**Impacto si no se responde:** se aplica A.
**Bloquea:** Priorización de §5.7 y §5.8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-16 — Referencia al artículo de stock en vivienda (PA 20 del pendiente de cierre)

**Pregunta:** ¿Cómo se llama el campo que referencia al artículo de M13 en tipologías y materiales de vivienda?
**Contexto:** el anexo usaba `productId` (de `COD_PRO`) y T05 lo nombra `inventoryItemId`, apuntando a `inventoryItems` (M13).
**Opciones:**
- A) **(Recomendada)** `inventoryItemId`, como T05 y M13.
- B) Mantener `productId`.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7 (`housingPlans`, `housingActivityMaterials`, `housingProgressMaterials`, `housingMaterialAllocations`, `housingMaterialWithdrawals`).
**Estado:** Asumida la recomendada (DEC-072). Renombrado con la nota "antes `productId`".

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-17 — API-SOC-006: endpoint HTTP o servicio interno (PA 21 del pendiente de cierre)

**Pregunta:** ¿Los insumos de facturación de servicios sociales (API-SOC-006) son un endpoint HTTP o un servicio interno?
**Contexto:** M04 y T12 la citan como API-SOC-006; el anexo la describía como servicio interno para M04.
**Opciones:**
- A) **(Recomendada)** Endpoint HTTP `GET /api/admin/soc/contracts/:id/billing-inputs` que consume M04, con capability `soc.adherentes.ver`.
- B) Servicio interno sin ruta HTTP.
**Impacto si no se responde:** se aplica A.
**Bloquea:** API-SOC-006; cálculo de M04.
**Estado:** Asumida la recomendada (DEC-072); API-SOC-006 ya figura como endpoint HTTP en §11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SOC-18 — Estados de convenios, campañas de donación y planes de vivienda (PA 19 del pendiente de cierre)

**Pregunta:** ¿Se confirman los estados de `providerAgreements`, `donationCampaigns` y `housingPlans`?
**Contexto:** el §7 declaraba `status` sin valores; la corrección del 05-11-2026 propuso valores con `[VERIFICAR]` para convenios y campañas (§8.1.6, §8.1.7), y `housingPlans` no tenía valores.
**Opciones:**
- A) **(Recomendada)** Confirmar §8.1.6 y §8.1.7 y agregar §8.1.8 (`draft`, `active`, `closed`) para planes de vivienda.
- B) Derivar el estado de las fechas de vigencia sin campo `status`.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §8.1.6 a §8.1.8.
**Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de esas secciones.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-01 — Método de costeo
- **Pregunta:** ¿Qué método de costeo perpetuo y con qué alcance se valúan las existencias?
- **Contexto:** ProCoop usa PEPS por defecto (V2 #2341) y valoriza a demanda; RN-08 §13.8 y §14 duda 8 dejan abierto PPP o PEPS por depósito; AGR-026 exige método aprobado.
- **Opciones:**
  - A) PPP móvil por artículo a nivel tenant e identificación específica para serializados **(Recomendada)** — cálculo simple, transferencias sin efecto de costo, serializados con costo real.
  - B) PPP móvil por artículo y depósito — refleja costos por sucursal; las transferencias mueven costo y complican la conciliación.
  - C) PEPS por capas — continuidad con ProCoop; más cálculo y capas por depósito.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-051, RF-STK-089, PRM-STK-001; O3 (costo de ingreso) y O8 (valorización).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-02 — Validación del consumo de campo por el supervisor
- **Pregunta:** ¿El consumo declarado por el técnico necesita validación del supervisor antes de su efecto?
- **Contexto:** BASE §20 pide control de consumos; AGR-016 exige no bloquear la operación offline.
- **Opciones:**
  - A) Afecta stock al sincronizar y el supervisor revisa por excepción o en la rendición; el evento económico sale al sincronizar **(Recomendada)** — operación fluida y control en la rendición.
  - B) Afecta stock al sincronizar, pero el evento económico espera la validación — más control contable, costos de OT demorados.
  - C) Nada se afecta hasta validar — saldos de cuadrilla desactualizados.
- **Impacto si no se responde:** se asume A (PRM-STK-051 = `none`).
- **Bloquea:** RF-STK-069; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-03 — Modo de entrega de equipos
- **Pregunta:** ¿Los equipos se entregan al técnico como stock rodante o asignados por serie a cada OT?
- **Contexto:** BASE §73 admite reserva de equipo y entrega al instalador sin fijar el modo.
- **Opciones:**
  - A) Ambos configurables por servicio; por defecto stock rodante con reserva por modelo y serie definida al aplicar **(Recomendada)** — menos viajes al depósito, trazabilidad completa al aplicar.
  - B) Siempre serie específica por OT — máximo control, más logística.
  - C) Solo stock rodante — más simple, sin reserva por serie.
- **Impacto si no se responde:** se asume A (PRM-STK-050 = `rollingStock`).
- **Bloquea:** RF-STK-057; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-04 — Diferencias de rendición y responsabilidad
- **Pregunta:** ¿Cómo se tratan los faltantes en la rendición de cuadrilla?
- **Contexto:** CU-20 exige ajuste autorizado con evidencia; no define si se carga al empleado.
- **Opciones:**
  - A) Ajuste aprobado clasificado imputable/no imputable; sin cargo automático; cargo al empleado vía M16 opcional por tenant **(Recomendada)** — control sin conflictos laborales automáticos.
  - B) Cargo automático al empleado por todo faltante — riesgo legal y gremial.
  - C) Solo ajuste, sin clasificación — se pierde análisis de responsabilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-066, PRM-STK-030; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-05 — Equipo no devuelto
- **Pregunta:** ¿Qué pasa cuando el socio no devuelve el equipo tras la baja?
- **Contexto:** BASE §74 lo deja pendiente; BASE §78 prohíbe convertir automáticamente el costo en cargo.
- **Opciones:**
  - A) Plazo configurable (30 días) y propuesta de cargo al costo de reposición, con aprobación y facturación por M05 **(Recomendada)** — recupera valor con control.
  - B) Importe fijo por modelo, también con aprobación — más previsible para el socio.
  - C) No cobrar; solo marcar no recuperado — pérdida de activos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-078, PRM-STK-026, PRM-STK-027; O6.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-06 — Unidades de gasto
- **Pregunta:** ¿Las unidades de gasto se mantienen como catálogo propio?
- **Contexto:** ProCoop tiene `UNIDADES_GASTOS` como destino de vales; M15 tiene centros de costo.
- **Opciones:**
  - A) Destino interno de consumo mapeado a un centro de costo de M15 **(Recomendada)** — conserva la práctica y unifica el análisis contable.
  - B) Fusionar con centros de costo — simplifica, pero pierde granularidad operativa.
  - C) Catálogo independiente sin vínculo contable — análisis paralelo no conciliable.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-STK-130; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-07 — Inventario físico
- **Pregunta:** ¿Se bloquean los movimientos durante un inventario físico?
- **Contexto:** ProCoop no define regla; la operación de campo no puede detenerse.
- **Opciones:**
  - A) Corte con instantánea y movimientos permitidos, considerados en la diferencia (RN-STK-042) **(Recomendada)** — no interrumpe la operación.
  - B) Bloquear movimientos del alcance contado — más simple de conciliar, frena el depósito.
- **Impacto si no se responde:** se asume A (PRM-STK-031 = `cutoffWithMovements`).
- **Bloquea:** RF-STK-083; O8.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-08 — Equipos propiedad del socio o de terceros
- **Pregunta:** ¿Se registran los equipos que no son de la cooperativa?
- **Contexto:** BASE §73 menciona "otra modalidad que se defina"; el aprovisionamiento necesita la MAC.
- **Opciones:**
  - A) Registrar identificadores sin existencia ni valorización **(Recomendada)** — soporte y aprovisionamiento sin distorsionar el stock.
  - B) No registrar — el aprovisionamiento carga la MAC aparte, sin trazabilidad.
- **Impacto si no se responde:** se asume A (PRM-STK-057 = `true`).
- **Bloquea:** RF-STK-052; O3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-09 — Tratamiento contable del comodato
- **Pregunta:** ¿Cómo se reconoce contablemente un equipo entregado en comodato?
- **Contexto:** ProCoop tiene un asiento opcional (V2 #2734); AGR-026 exige que comodato no sea consumo.
- **Opciones:**
  - A) Activo "equipos en comodato" sin amortizar, con opción por artículo de tratarlo como bien de uso **(Recomendada)** — conciliable con existencias por custodia.
  - B) Siempre bien de uso amortizable — refleja desgaste, requiere alta de bien por cada equipo.
  - C) Gasto al instalar — simple, pierde el control del activo en domicilios.
- **Impacto si no se responde:** se asume A (PRM-STK-025 = `inventoryOnLoan`).
- **Bloquea:** RN-STK-035, RF-STK-094, RF-STK-095; O3/O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-10 — Estados de `fixedAssetValueChanges` y `mrpRuns` (PA 8 del pendiente de cierre)
- **Pregunta:** ¿Los cambios de valor de bienes de uso y las corridas de aprovisionamiento de fabricación tienen máquina de estados propia?
- **Contexto:** el §7 declaraba `status` sin valores en ambas colecciones (en `mrpRuns` con tipo `Date`) y el §8 no tenía sus transiciones.
- **Opciones:**
  - A) Máquina por colección (§8.13): `fixedAssetValueChanges` `draft` → `posted` → `voided` con reversión contable; `mrpRuns` `calculated` → `confirmed` / `discarded`, o `failed` **(Recomendada)**.
  - B) Sin máquina: el cambio de valor se contabiliza al registrarse y la corrida de MRP no guarda estado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.26, §7.35, §8.13; RF-STK-099, RF-STK-126.
- **Estado:** Asumida la recomendada (DEC-072). T05 (COL-STK-28, COL-STK-40) toma los valores de §8.13.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-STK-11 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y evento bajo mínimo)
- **Pregunta:** ¿Cómo se cierran los residuales de M13 que detectaron los entregables regenerados?
- **Contexto:** el índice de estados marcó máquinas sin estado inicial (§8.3, §8.5 a §8.8, §8.10, §8.11), `stockState`, `lotTypes` y `revaluations` con valores sin transiciones, y `serialUnitEvents`, `receptionStatuses` y `serviceReceptions` sin valores; las tablas del §7.37 dejaban referencias sin destino; T05 nombra `inventoryItemId`, `stockDocumentId`, `currentContractId`, `costCenterId` y `bomStructureVersionId`; RF-STK-029 publicaba `stk.item.below-minimum` con guion.
- **Opciones:**
  - A) Estado inicial explícito; §8.14 con `stockState` como flujo entre estados por pares de movimientos, `revaluations` y `serviceReceptions` (`open`, `closed`, `cancelled`); los renglones de `lots` y `serviceReceptions` mezclados en las tablas de `lotTypes` y `receptionStatuses` quedan marcados como reemplazados; nombres de T05 con "antes"; `projectId` → `works` (M10) por ser la obra de P3041; `requisitionId` y `requisitionIds` → `supplyRequests` (M12); `purchaseReceiptId` → `supplierReceipts` (M12); `catalogProductId` → `serviceProducts` (M02); evento `stk.item.belowMinimum` (EVT-STK-12) **(Recomendada)**.
  - B) Mantener el texto y resolver en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.11 a §7.13, §7.24, §7.33, §7.37, §8.
- **Estado:** Asumida la recomendada (DEC-072). T05 debe resolver el `[VERIFICAR]` de `projectId` (§7.2 lo apuntaba a `crmProjects` con duda) hacia `works` (M10) para M13, y registrar `serviceReceptions.status` y `revaluations.status` con estos valores.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `chargeProposalId` → `approvalRequests` (T11): la propuesta de cargo por no devolución es una solicitud de aprobación (RN-STK-038).
- **Residual (5-11-2026), Asumida (DEC-072):** `lots.purchaseReceiptId` (§7.37.15) → `supplierReceipts` (M12, COL-CMP-11), igual que §7.37.14 y T05 §7.2.1 (antes `receipts` de M07, que son recibos de cobranza y no recepciones de compra).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-01 — Momento de reemplazo del sistema laboral en la piloto
- **Pregunta:** ¿La cooperativa piloto reemplaza su sistema laboral con la liquidación propia o arranca importando su liquidación externa?
- **Contexto:** BASE §104.6 y §106 piden decidirlo; la liquidación propia está en O9 y la importación (CU-28) puede estar en O8.
- **Opciones:**
  - A) Importación externa desde O8 y liquidación propia en O9 con dos períodos en paralelo antes de reemplazar **(Recomendada)** — el ERP se contabiliza sin esperar a O9 y el reemplazo se valida con datos reales.
  - B) Liquidación propia directa en O9 sin paralelo — menor esfuerzo, mayor riesgo de diferencias.
  - C) Mantener el sistema externo de forma indefinida — sueldos solo importados; se desaprovecha el módulo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-140 a 145; O8, O9.
- **Estado:** Respondida (DEC-058): O8 importa la liquidación del sistema externo; O9 liquida con el módulo propio con dos períodos en paralelo (opción A).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-02 — Alcance del cálculo de seguridad social y F.931
- **Pregunta:** ¿El sistema solo prepara archivos (LSD y SICOSS) o también calcula aportes y contribuciones y controla el F.931?
- **Contexto:** ProCoop delega todo el cálculo en SICOSS (RN-08 §11.6); SUE-007 menciona aportes, contribuciones y F.931.
- **Opciones:**
  - A) Calcular aportes y contribuciones para asiento, provisión y control; generar LSD y SICOSS; el F.931 se obtiene y presenta en ARCA con acuse cargado en el sistema **(Recomendada)** — asiento exacto y control de diferencias sin asumir la presentación.
  - B) Solo archivos, como ProCoop — asiento de contribuciones estimado.
  - C) Calcular y presentar automáticamente por web service — mayor riesgo y dependencia de credenciales del contribuyente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-096, RN-SUE-080, RF-SUE-118.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-03 — Lenguaje de fórmulas
- **Pregunta:** ¿Qué lenguaje usan las fórmulas de conceptos?
- **Contexto:** ProCoop usa expresiones DevExpress con funciones propias (RN-08 §15.6); hay que migrar fórmulas existentes y evitar ejecutar código arbitrario.
- **Opciones:**
  - A) Lenguaje propio seguro (interpretado, sin acceso a código) con las funciones de dominio y un traductor asistido de fórmulas ProCoop en la migración **(Recomendada)** — seguridad, trazabilidad y migración controlada.
  - B) Compatibilidad sintáctica total con ProCoop — migración directa, pero arrastra limitaciones.
  - C) Solo conceptos parametrizados sin fórmulas libres — más simple, insuficiente para convenios.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-039, RF-SUE-040, §19.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-04 — Firma de recibos
- **Estado:** Resuelta por DEC-078: firma digital con proveedor licenciado para recibos de sueldo, con la interfaz y los perfiles de firma de T11.
- **Pregunta:** ¿Qué firma se usa en los recibos digitales?
- **Contexto:** SUE-008 pide firma «cuando la normativa lo admita»; la admisión del recibo digital depende de normas nacionales y provinciales [VERIFICAR]; ProCoop usa un proveedor de firma (FIC 15).
- **Opciones:**
  - A) Firma electrónica del empleado (conformidad con OTP, hash y sello de tiempo) y firma digital del empleador con proveedor, configurable por empresa **(Recomendada)** — cubre la mayoría de los casos y permite elevar a firma digital donde se exija.
  - B) Firma digital certificada para ambas partes — más costo y fricción para el empleado.
  - C) Solo constancia de recepción, con recibo en papel firmado — menor riesgo normativo, sin despapelización.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-105, PRM-SUE-039, JOB-SUE-04.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-05 — Modelo del pago de haberes
- **Pregunta:** ¿Cómo se representa al empleado en el pago?
- **Contexto:** ProCoop da de alta al empleado como proveedor y le genera una factura de compra (RN-08 §11.5).
- **Opciones:**
  - A) Beneficiario propio en una solicitud de pago de haberes a M14, sin proveedor ni factura **(Recomendada)** — evita mezclar compras con sueldos y protege la privacidad.
  - B) Replicar el modelo de proveedor — compatibilidad con ProCoop, mezcla datos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-112, RN-SUE-085, §19.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-06 — Descuento de deuda de servicios del empleado
- **Pregunta:** ¿Se permite descontar del recibo la deuda de servicios del empleado con la cooperativa?
- **Contexto:** ProCoop tiene la función `ImporteFacturasAdeudadas`; la LCT limita los descuentos (art. 132–133).
- **Opciones:**
  - A) Permitido solo con autorización escrita del empleado registrada, dentro del límite legal, desactivado por defecto **(Recomendada)** — conserva la función con resguardo legal.
  - B) No permitirlo — más simple; se pierde una facilidad usada.
  - C) Permitirlo sin autorización — riesgo legal.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-014, RF-SUE-083, RN-SUE-029, EVT-SUE-26.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-07 — Asignaciones familiares
- **Pregunta:** ¿El sistema liquida asignaciones familiares a cargo del empleador?
- **Contexto:** ProCoop registra familiares «(Ganancias, salario familiar)»; la mayoría de los empleadores está en el régimen de pago directo de ANSES (SUAF) [VERIFICAR para la piloto].
- **Opciones:**
  - A) Solo datos informativos para SUAF; conceptos de pago directo disponibles pero desactivados **(Recomendada)** — cubre el caso general sin complejidad innecesaria.
  - B) Liquidar asignaciones como concepto del recibo — solo si la cooperativa está en un régimen que lo exige.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-005.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-08 — Profundidad de RRHH en O9
- **Pregunta:** ¿Evaluaciones de desempeño y objetivos entran en O9 o se difieren?
- **Contexto:** SUE-012 los incluye con GLM como referencia; sanciones, accidentes y juicios impactan la liquidación y la contabilidad; evaluaciones y objetivos no.
- **Opciones:**
  - A) Sanciones, sumarios, accidentes y juicios en O9 (Núcleo/Estándar); evaluaciones y objetivos en O9 como Extensión al final de la ola, desactivados por defecto **(Recomendada)** — prioriza lo que afecta al cálculo.
  - B) Todo en O9 con la misma prioridad.
  - C) Evaluaciones y objetivos en O11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-127, RF-SUE-128, PRM-SUE-055.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-09 — Fichadas de reloj
- **Pregunta:** ¿Cómo ingresan las fichadas?
- **Contexto:** ProCoop tiene lector de fichadas (`SU_HORAS_LECTOR`); el agente de hardware local está previsto en O10 (DEC-007).
- **Opciones:**
  - A) Importación de archivo o API del proveedor del reloj en O9; agente local en O10 **(Recomendada)** — no adelanta el agente local.
  - B) Agente local en O9.
  - C) Sin fichadas; solo novedades.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-052, PRM-SUE-044, JOB-SUE-17.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-10 — Conservación de datos laborales
- **Pregunta:** ¿Cuánto tiempo se conservan legajos, recibos y datos sensibles tras el egreso?
- **Contexto:** AGR-033 y BASE §98 piden fijar plazos; inciden la prescripción laboral, las obligaciones de la seguridad social y la Ley 25.326 [VERIFICAR con asesor].
- **Opciones:**
  - A) Recibos, liquidaciones y presentaciones 10 años; legajo 10 años; datos de salud minimizados y eliminados a los 5 años salvo litigio **(Recomendada)** — cubre plazos habituales con minimización.
  - B) Conservación indefinida — mayor riesgo de privacidad.
  - C) Plazo que fije cada tenant sin mínimo — riesgo de incumplir obligaciones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-SUE-058, RF-SUE-020.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-11 — Pluriempleo dentro del tenant
- **Pregunta:** ¿Se admite que una persona tenga relaciones laborales simultáneas con dos empresas del mismo tenant?
- **Contexto:** El tenant puede tener varias empresas empleadoras; ProCoop exige legajo único por empresa.
- **Opciones:**
  - A) Sí, un legajo por empresa, con Ganancias del agente designado y «otros empleos» en la otra **(Recomendada)** — refleja la norma.
  - B) No; una persona solo en una empresa del tenant — más simple, limita casos reales.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-024, CU-SUE-14.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-12 — Automatismo de novedades desde la operación
- **Pregunta:** ¿Las novedades que nacen en OT, cuadrillas y flota se proponen automáticamente?
- **Contexto:** CU-104 importa guardias desde OT; las horas deben revisarse por el encargado.
- **Opciones:**
  - A) Propuesta automática en borrador al cerrar OT/partes (flota a pedido), con aprobación del encargado y consolidación del liquidador **(Recomendada)** — menos carga manual con control.
  - B) Solo importación a pedido del liquidador.
  - C) Aprobación automática sin revisión — riesgo de pagar horas mal cargadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-049, RF-SUE-050, PRM-SUE-042/043.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-13 — Regímenes alternativos de indemnización
- **Pregunta:** ¿Se soportan fondos o sistemas de cese alternativos que habilite un convenio?
- **Contexto:** La Ley 27.742 habilita sistemas de cese por convenio [VERIFICAR]; la piloto puede no estar alcanzada.
- **Opciones:**
  - A) Soportarlos como plantilla de motivo de egreso y concepto configurable, no por defecto **(Recomendada)** — sin desarrollo específico.
  - B) Desarrollo específico con aportes mensuales al fondo.
  - C) No soportarlos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-SUE-059, RF-SUE-073.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-14 — Tratamiento de retroactivos
- **Pregunta:** ¿Cómo se liquidan los aumentos retroactivos de paritarias?
- **Contexto:** Las escalas se publican con fecha efectiva pasada; el LSD distingue período de devengamiento y pago.
- **Opciones:**
  - A) Liquidación complementaria en el período actual con devengamiento del período original, y rectificativa de presentaciones solo cuando la norma lo exija **(Recomendada)** — práctica habitual y trazable.
  - B) Reliquidar (rectificar) cada período afectado.
  - C) Pagar la diferencia como concepto del mes sin devengamiento separado — simple, distorsiona Ganancias y LSD.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-SUE-076, §9.3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-15 — Asociados de cooperativas de trabajo
- **Pregunta:** ¿Se incluirá a futuro la liquidación de retiros de asociados de cooperativas de trabajo?
- **Contexto:** BASE §104.3 los excluye «salvo decisión posterior».
- **Opciones:**
  - A) Fuera del módulo; si se requiere, como pago institucional en M17 **(Recomendada)** — evita confundir relación asociativa con laboral.
  - B) Incluir un tipo de liquidación «retiro de asociado» en SUE en una ola posterior.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §2.2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-16 — Dueño de las pantallas del empleado (PA 17 del pendiente de cierre)
- **Pregunta:** ¿Las pantallas de autoservicio del empleado (recibos, licencias, datos, equipo, certificados, evaluaciones) son de M16 o de M19?
- **Contexto:** M16 declara PAN-SUE-41 a PAN-SUE-46 y M19 declara PAN-POR-69 a PAN-POR-76 para las mismas funciones, con rutas distintas (`/empleado/...` y `/app/empleado/...`).
- **Opciones:**
  - A) M16 es dueño del contenido, las reglas y las API (PAN-SUE-41 a PAN-SUE-46, API-SUE-78 a API-SUE-81); M19 es dueño de la ruta publicada en la PWA y la incrusta (HUE-SRV-04) **(Recomendada)**.
  - B) M19 es dueño de todo y M16 solo expone API.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PAN-SUE-41 a PAN-SUE-46; PAN-POR-69 a PAN-POR-74 de M19.
- **Estado:** Asumida la recomendada (DEC-072). La ruta publicada es la de M19; la de M16 queda como referencia. PAN-SUE-44 a PAN-SUE-46 no tienen PAN-POR propia en M19.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-SUE-17 — Estados de notificación de recibo, evaluación y objetivo (PA 19 del pendiente de cierre)
- **Pregunta:** ¿Se confirman los estados propuestos para `payslipNotifications`, `performanceReviews` y `objectives`?
- **Contexto:** el §7 declaraba `status` sin valores; la corrección del 05-11-2026 propuso valores con `[VERIFICAR]` en §8.12.8 a §8.12.10.
- **Opciones:**
  - A) Confirmar los valores y transiciones de §8.12.8 a §8.12.10 **(Recomendada)**.
  - B) Derivar el estado de las fechas (`sentAt`, `viewedAt`, `signedAt`, `feedbackAt`) sin campo `status`.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §8.12.8 a §8.12.10.
- **Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de esas secciones.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-01 — Semántica de evaluación de reglas encadenadas
- **Pregunta:** ¿Las reglas de un mismo servicio se evalúan sobre la foto previa (como ProCoop) o en cascada sobre la base ya modificada?
- **Contexto:** En ProCoop todas las variables de un servicio se evalúan antes de aplicar cualquier cargo; un recargo de orden 1 no cambia la base del orden 2 salvo referencia explícita (RN-01 §12.5). Cambiarlo altera resultados migrados.
- **Opciones:**
  - A) Foto previa por defecto + referencias explícitas (`rule('x')`, `previousTotal`) y opción `baseMode = cascade` por regla **(Recomendada)** — compatibilidad total y flexibilidad para reglas nuevas.
  - B) Siempre en cascada — más intuitivo, pero obliga a reescribir reglas migradas.
  - C) Siempre foto previa — compatible, pero limita reglas nuevas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-133, RF-TAR-065, RF-TAR-068, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-02 — Factor por días en tarifa por bloque
- **Pregunta:** ¿Cómo se aplica el factor por días en categorías de bloque?
- **Contexto:** ProCoop multiplica la cantidad facturada (cobra unidades de más), mientras en tramas escala los límites (RN-01 §4.1, §4.3, duda 1).
- **Opciones:**
  - A) Ambos modos por categoría: migrados en `scale_quantity` (legacy) y nuevos en `scale_limits` **(Recomendada)** — paralelo sin diferencias y corrección gradual.
  - B) Solo `scale_limits` — corrige pero genera diferencias en el paralelo.
  - C) Solo `scale_quantity` — replica el comportamiento discutible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-027, ESC-TAR-05, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-03 — Errores de ProCoop durante el paralelo
- **Pregunta:** ¿Se corrigen los errores detectados en el cálculo de ProCoop (dudas 2, 3, 4, 7, 8, 16–23, 25–27) aunque generen diferencias en el paralelo?
- **Contexto:** Replicar errores asegura igualdad en el paralelo; corregirlos mejora la exactitud pero exige explicar diferencias.
- **Opciones:**
  - A) Corregir y clasificar cada diferencia como "corrección conocida" con advertencia `TAR-W-CORRECTION-KNOWN` **(Recomendada)** — paralelo trazable.
  - B) Replicar errores con interruptor por tenant hasta aprobar la corrección — más esfuerzo de mantenimiento.
  - C) Replicar siempre — perpetúa errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-058, 144, 177, 185, 190, 192; ESC-TAR-27; O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-04 — Fecha de referencia tarifaria
- **Pregunta:** ¿Qué fecha determina la versión aplicable de tarifas y reglas?
- **Contexto:** ProCoop usa la fecha del lote o del sistema y un segundo control por mes actual (duda 24); AGR-010 exige declarar la fecha que se interpreta.
- **Opciones:**
  - A) Período de prestación: medidos por fecha de lectura actual con prorrateo entre versiones; no medidos por inicio del período liquidado **(Recomendada)** — coherente con prorrateo y retroactivos.
  - B) Fecha de emisión — simple, pero cobra consumos pasados con precios nuevos.
  - C) Fecha de vigencia elegida en cada lote (como ProCoop) — flexible pero manual y propensa a errores.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-131, PRM-TAR-010, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-05 — Ciclo parcial de una promoción
- **Pregunta:** Si el primer comprobante incluye una fracción de mes, ¿consume un ciclo de la promoción?
- **Contexto:** CU-PRO-01 exige criterio explícito para ciclos parciales y cambios de plan.
- **Opciones:**
  - A) Parametrizable por promoción, default "no consume" (PRM-TAR-016) **(Recomendada)** — favorece al socio y es explicable.
  - B) Siempre consume — más simple, el socio pierde parte de la promoción.
  - C) Consume proporcionalmente (fracción de ciclo) — exacto, más complejo de explicar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-242, ESC-TAR-03, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-06 — Cuenta corriente de redondeo
- **Pregunta:** ¿Se mantiene el redondeo con arrastre (cobrar la diferencia en el comprobante siguiente) y dónde se lleva su saldo?
- **Contexto:** ProCoop guarda el saldo en tablas propias (`DEUDARED`); AGR-011 exige saldo con única fuente y ningún ajuste sin contrapartida.
- **Opciones:**
  - A) Mantener la opción; el saldo es un movimiento de M07 propuesto por TAR y confirmado al emitir **(Recomendada)** — compatible y conciliable.
  - B) Eliminar el arrastre; solo redondeo simple — más simple, cambia el hábito de las cooperativas.
  - C) Mantener tabla propia en TAR — duplica saldos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-163, PRM-TAR-131, O4/O5.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-07 — Redondeo cuando la fecha del comprobante coincide con el primer vencimiento
- **Pregunta:** ¿Se omite el redondeo con arrastre en comprobantes cuya fecha es igual al primer vencimiento (como ProCoop)?
- **Contexto:** Regla implícita del código (RN-01 §15) sin justificación documentada; afecta comprobantes de contado.
- **Opciones:**
  - A) Configurable por política, default replicar (omitir) **(Recomendada)** — sin diferencias en el paralelo.
  - B) Redondear siempre — uniforme.
  - C) Nunca redondear comprobantes de contado — explícito por tipo de comprobante.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-163, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-08 — Firmas para publicar tarifas
- **Pregunta:** ¿Cuántas firmas se exigen para publicar una versión tarifaria?
- **Contexto:** DFA M7 propone doble firma; algunas cooperativas requieren aprobación del Consejo.
- **Opciones:**
  - A) Dos firmas obligatorias + tercera opcional configurable (PRM-TAR-004) **(Recomendada)** — control y flexibilidad.
  - B) Una firma — ágil, menor control.
  - C) Tres firmas siempre — máximo control, más lento.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TAR-005, 8.1, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-09 — Simulación obligatoria antes de aprobar
- **Pregunta:** ¿Qué simulación se exige antes de enviar una versión a aprobación?
- **Contexto:** BASE §51 pide simular antes de publicar; una simulación completa puede ser costosa en cooperativas grandes.
- **Opciones:**
  - A) Completa para cambios de precio que afectan más de N contratos; muestra estadística para menores; ninguna para cambios de presentación **(Recomendada)** — equilibrio entre control y costo.
  - B) Siempre completa — máximo control.
  - C) Opcional — riesgo de publicar sin conocer el impacto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-TAR-005, RN-TAR-214, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-10 — Mecanismo de subsidios y tarifa social
- **Pregunta:** ¿Cómo se aplican los subsidios y la tarifa social?
- **Contexto:** ProCoop usa categorías sociales y fórmulas (RN-01 §18); BASE §51–52 exige origen del beneficio, componente y vigencia.
- **Opciones:**
  - A) Régimen + inscripción por suministro + regla de beneficio por componente con origen; recategorización solo por compatibilidad donde el régimen lo exija **(Recomendada)** — trazable y sin duplicar categorías.
  - B) Solo categorías sociales (como ProCoop) — compatible, poco trazable.
  - C) Solo reglas sin régimen — flexible, sin evidencia estructurada.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-172, 9.9, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-11 — Funciones a medida (procedimientos `FORMULA_CARGO_*`)
- **Pregunta:** ¿Cómo se reemplazan las funciones definidas por cada cooperativa como procedimientos almacenados?
- **Contexto:** No se pueden ejecutar procedimientos en el SaaS multitenant; su inventario está pendiente ([VERIFICAR] LAG).
- **Opciones:**
  - A) Catálogo de funciones declarativas por tenant (consulta sobre datos del contexto) + funciones nativas de plataforma a demanda **(Recomendada)** — seguro y extensible.
  - B) Solo funciones nativas de plataforma — seguro, cada caso requiere desarrollo.
  - C) Datos precargados por contrato en lugar de funciones — simple, poco flexible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-145, 19.3, O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-12 — Cambios tarifarios con vigencia pasada sobre comprobantes emitidos
- **Pregunta:** ¿Qué ocurre si se publica una versión con vigencia anterior a comprobantes ya emitidos?
- **Contexto:** ESC-02 prohíbe reescribir comprobantes; algunas resoluciones regulatorias son retroactivas.
- **Opciones:**
  - A) Simular diferencias y generar NC/ND solo con aprobación de doble firma **(Recomendada)** — control y trazabilidad.
  - B) Generar ajustes automáticamente — rápido, riesgoso.
  - C) Prohibir vigencias pasadas — impide cumplir resoluciones retroactivas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 9.7, PRM-TAR-154, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-13 — Actualización automática de la demanda contratada
- **Pregunta:** Cuando la demanda registrada supera la contratada más la tolerancia, ¿se actualiza automáticamente?
- **Contexto:** ProCoop la actualiza al calcular (RN-01 §11.2); afecta condiciones contractuales (BASE §72).
- **Opciones:**
  - A) Automática al emitir con registro y aviso, configurable a "requiere aprobación" (PRM-TAR-094) **(Recomendada)** — compatible y controlable.
  - B) Siempre requiere aprobación — más control, más carga operativa.
  - C) Nunca actualizar — pierde la regla de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-109, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-14 — Energía inyectada
- **Pregunta:** ¿Cómo se liquida la energía inyectada por usuarios-generadores?
- **Contexto:** ProCoop la trata como consumo negativo y anticipo (RN-01 §4.6); MER-001 exige operaciones separadas con IVA y cuenta de créditos (Ley 27.424).
- **Opciones (texto original, reemplazado por las opciones alineadas con DEC-060; HUE-ELE-03):**
  - A) Modelo MER-001 (balance neto con operaciones separadas y cuenta de créditos) como objetivo + modo compatibilidad para migrados hasta su transición **(Recomendada)** — cumple el régimen sin romper el paralelo.
  - B) Solo modo compatibilidad — replica, riesgo normativo.
  - C) Solo MER-001 desde el inicio — correcto, diferencias en el paralelo.
- **Contexto adicional (HUE-ELE-03):** DEC-060 fija "configurable por régimen; default compensación monetaria (Ley 27.424)". La recomendación original priorizaba el balance neto y contradecía la decisión.
- **Opciones alineadas con DEC-060:**
  - A) **Compensación monetaria Ley 27.424 por defecto** (la energía inyectada se valoriza a la tarifa de inyección del régimen y se acredita en pesos en operación separada con su IVA, M06; crédito en cuenta de M07 con EVT-TAR-021), con **balance neto como opción del régimen** (neteo de kWh por período con arrastre del excedente) y modo compatibilidad para migrados hasta su transición **(Recomendada)** — cumple DEC-060 y deja el balance neto configurable donde la jurisdicción lo exija.
  - B) Balance neto por defecto y compensación monetaria como opción — contradice DEC-060.
  - C) Solo modo compatibilidad (consumo negativo y anticipo, como ProCoop) — replica, riesgo normativo.
- **Comportamiento configurable:** el régimen del usuario-generador (`injectionRegime`: `monetary_compensation` por defecto, `net_balance`, `legacy_compat`) se define en la versión tarifaria del servicio ELE y se puede cambiar por régimen/jurisdicción con vigencia.
- **Impacto si no se responde:** se asume A (compensación monetaria por defecto).
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante; alineada con DEC-060 (HUE-ELE-03).
- **Bloquea:** RN-TAR-039, 198, 231, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-15 — Precisión decimal
- **Pregunta:** ¿Qué precisión se usa para precios, cantidades e importes?
- **Contexto:** ProCoop mezcla precisiones según el campo; AGR-011 pide precisión explícita por concepto.
- **Opciones:**
  - A) Precio unitario 6, cantidad 4, fracción 6, importe de renglón 2, IVA redondeado por alícuota **(Recomendada)** — compatible con ProCoop y ARCA.
  - B) Todo a 2 decimales — pierde exactitud en tarifas de energía.
  - C) Configurable por servicio sin default — riesgo de inconsistencias.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-TAR-150, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-16 — Fecha de cotización de moneda extranjera
- **Pregunta:** ¿Con qué fecha se toma la cotización para conceptos en moneda extranjera?
- **Contexto:** ProCoop usa la cotización vigente al calcular; la fecha de referencia podría ser otra.
- **Opciones:**
  - A) Cotización vendedora del día hábil anterior a la fecha de emisión **(Recomendada)** — conocida al emitir y reproducible.
  - B) Cotización a la fecha de referencia tarifaria — coherente con la versión, puede no estar publicada.
  - C) Cotización del día del cálculo — como ProCoop, no reproducible.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-020, PRM-TAR-015, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-17 — Factura mínima
- **Pregunta:** ¿Se incorpora un componente estándar de factura mínima?
- **Contexto:** ProCoop tiene `FMINIMA` solo como variable de fórmulas; algunas cooperativas lo usan con reglas.
- **Opciones:**
  - A) Componente estándar opcional por categoría, además de la variable para reglas **(Recomendada)** — evita fórmulas repetidas.
  - B) Solo variable para reglas (como ProCoop) — compatible.
  - C) No soportarla — pierde funcionalidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** P07 (9.2), O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-18 — Errores de fórmula en un lote
- **Pregunta:** ¿Qué hace el lote ante errores de evaluación de fórmulas?
- **Contexto:** ProCoop aborta todo el lote ante un `#Err` (RN-01 §12.5).
- **Opciones:**
  - A) Excluir la cuenta y continuar; detener el lote si los errores superan un umbral (PRM-TAR-113) **(Recomendada)** — continuidad con control.
  - B) Abortar siempre (como ProCoop) — seguro, bloquea la facturación por un caso.
  - C) Excluir siempre sin umbral — riesgo de emitir un lote con muchas exclusiones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-TAR-126, PRM-TAR-113, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-19 — Propiedad de los factores de gas y de los cargos por evento
- **Pregunta:** ¿Qué módulo es dueño de los factores de corrección de gas (`FACTOR_CAL`) y de la definición de los cargos por evento (`CONEXION`)?
- **Contexto:** M03 declara `gasCorrectionFactors` (PAN-MED-20) y M04 `gasCalorificFactors` (PAN-TAR-09); M02 declara `eventChargeRules` y M04 `eventCharges` (CTR-TAR-38, CTR-TAR-39). Dos colecciones para el mismo dato rompen la reproducibilidad del cálculo.
- **Opciones:**
  - A) Factores de gas en M04 (son datos versionados del cálculo y M03 los lee para estimar); disparador y filtros de cargos por evento en M02, y precio, fundamento y bonificaciones en M04 **(Recomendada)** — cada dato queda junto a la versión que lo usa.
  - B) Factores de gas en M03 (corrección física del volumen) y cargos por evento completos en M04 — M04 depende de la vigencia de datos de otro módulo.
  - C) Todo en M02 como catálogo — mezcla catálogo con datos tarifarios versionados.
- **Impacto si no se responde:** se asume A; M03 y M02 deben alinear sus anexos.
- **Estado:** Resuelta por HUE-GAS-03 (opción A en factores de gas): M04 es dueño de `gasCalorificFactors`, PAN-TAR-09, PRM-TAR-050..052 y PRM-TAR-168; M03 marca `gasCorrectionFactors`, PAN-MED-20 y PRM-MED-070..072 como reemplazados y lee los factores (CTR-TAR-38). La parte de cargos por evento (CTR-TAR-39) sigue con la opción A como supuesto.
- **Bloquea:** PAN-TAR-09, PAN-TAR-18, 19.2 (`FACTOR_CAL`, `CONEXION`), O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TAR-21 — Residuales de estados, referencias y nombres (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados de alta de `subsidyEnrollments` y `calculationRuns`, los destinos de `rightId` y `levyEventId`, el nombre del servicio fiscal y la marca pública de API-TAR-061?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 2 máquinas de M04 sin estado inicial; 03-er marcó 12 colecciones sin tabla asociada y referencias sin destino; M06 §11.1 nombra el servicio `fis.service.calculateTaxes`; API-TAR-061 tenía la celda de capability vacía.
- **Opciones:**
  - A) **(Recomendada)** Declarar en §8.8 `subsidyEnrollments` inicial `active` (más `suspended → ended`) y `calculationRuns` inicial `queued`; `rightId` → `burialRights` (M18); `levyEventId` es el `eventId` del sobre, no una colección; usar `fis.service.calculateTaxes`; API-TAR-061 con `public: true` (RF-IAM-061).
  - B) Crear un estado `pending` para inscripciones de padrón no confirmadas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), 05 (contratos de API).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §6 (RN-TAR-167), §7.16, §7.19, §8.8, §9 (P15) y §11.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `taxRateIds` queda solo para alícuotas de IVA (→ `vatRates`) y se agrega `taxIds` (→ `taxDefinitions`) para IIBB, percepciones y demás tributos en `tariffCategoryRates`, `tariffRows` y `productPrices`, como T05 §7.2.1 (PA-DAT-04); reemplaza el doble destino de PA-TAR-20.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-01 — Doble paso "ejecutada" y "confirmada"
- **Pregunta:** ¿Las OT deben pasar por dos pasos de cierre (el técnico la ejecuta y un supervisor la confirma) o alcanza con uno?
- **Contexto:** ProCoop distingue estados según la cooperativa (RN-07 §11.1). El doble paso agrega control, pero también demora.
- **Opciones:**
  - A) Configurable por tipo de operación, con doble paso por defecto en altas, desconexiones, reconexiones y cambios de medidor **(Recomendada)**: control donde hay efectos sobre el contrato y agilidad en el resto.
  - B) Doble paso siempre: más control y más trabajo para los supervisores.
  - C) Un solo paso siempre: más rápido, pero sin revisión.
- **Impacto si no se responde:** se asume A (PRM-TEC-132).
- **Bloquea:** RF-TEC-035 a 038, §8.4, O3.
- **Estado:** Respondida (DEC-039): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-02 — Hito de activación del servicio
- **Pregunta:** ¿Qué hecho fija la fecha desde la que el contrato queda activo (y se empieza a facturar)?
- **Contexto:** BASE §73 pide una fecha efectiva confirmada. ProCoop activa al cerrar la OT (CTR-TEC-18).
- **Opciones:**
  - A) Instalación probada más aprovisionamiento confirmado **(Recomendada)**: el socio paga desde que tiene servicio real.
  - B) Solo la instalación probada: más simple, pero puede facturar sin servicio si falla el aprovisionamiento.
  - C) Instalación, aprovisionamiento y revisión del supervisor: más control, con demora en la facturación.
- **Impacto si no se responde:** se asume A (PRM-TEC-138).
- **Bloquea:** RF-TEC-085 a 101, RN-TEC-064, EVT-TEC-16, O3 y O4.
- **Estado:** Respondida (DEC-033, PA-CAT-16 de M02): opción A; la revisión del supervisor es posterior y no demora la activación.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-03 — Facturación de materiales usados en la OT
- **Pregunta:** ¿Los materiales usados en una OT se le facturan al socio?
- **Contexto:** ProCoop permite facturar materiales con precio editable (V2 #443/#448). BASE §78 dice que el costo del equipo no se convierte automáticamente en un cargo.
- **Opciones:**
  - A) No por defecto; solo si lo define una regla de la operación o un presupuesto aceptado **(Recomendada)**: evita cobros no pactados.
  - B) Sí, todos los materiales marcados como facturables.
  - C) Nunca: todo cobro va por presupuesto de M11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-064 a 072, EVT-TEC-10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-04 — Factibilidad obligatoria
- **Pregunta:** ¿La factibilidad es obligatoria para dar un alta?
- **Contexto:** DFA la pide siempre; ProCoop la tiene como opcional (V2 #388, CTR-TEC-33).
- **Opciones:**
  - A) Configurable por servicio y operación, obligatoria por defecto en Internet y en servicios con red **(Recomendada)**.
  - B) Obligatoria siempre: más control, pero frena altas simples (por ejemplo, servicios sociales).
  - C) Opcional siempre.
- **Impacto si no se responde:** se asume A (PRM-TEC-024).
- **Bloquea:** RF-TEC-001 a 017, O3.
- **Estado:** Respondida (DEC-040): opción A; valores por servicio en PRM-TEC-024 (HUE-SRV-07).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-05 — Vigencia de la factibilidad
- **Pregunta:** ¿Por cuánto tiempo vale una factibilidad favorable para dar el alta?
- **Contexto:** ProCoop usa 90 días fijos. La capacidad de la red cambia con el tiempo.
- **Opciones:**
  - A) Parámetro por servicio, con 90 días por defecto **(Recomendada)**.
  - B) 90 días fijos para todos los servicios.
  - C) Sin vencimiento.
- **Impacto si no se responde:** se asume A (PRM-TEC-130).
- **Bloquea:** RN-TEC-001.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-06 — Costo de la visita fallida
- **Pregunta:** ¿Se le cobra al socio una visita fallida por causas atribuibles a él (por ejemplo, ausencia)?
- **Contexto:** BASE §73 menciona la visita fallida, pero no define el cargo.
- **Opciones:**
  - A) Sin costo por defecto, con una regla configurable por tipo de visita **(Recomendada)**.
  - B) Siempre se cobra a partir de la segunda visita fallida.
  - C) Nunca se cobra.
- **Impacto si no se responde:** se asume A (PRM-TEC-146).
- **Bloquea:** EVT-TEC-14, CU-TEC-01.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-07 — Mecanismo de la firma de conformidad
- **Pregunta:** ¿Qué validez debe tener la firma de conformidad en el domicilio?
- **Contexto:** BASE §73 pide la conformidad; ProCoop captura una firma en el colector (V2 #50).
- **Opciones:**
  - A) Firma manuscrita en pantalla + identificación del receptor (nombre y documento) + hash del documento, con fecha y hora **(Recomendada)**: suficiente como evidencia operativa.
  - B) Firma con validación por código enviado al teléfono del titular: más fuerte, pero depende de cobertura.
  - C) Solo una foto del remito firmado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-085 a 101, `serviceConformities`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-08 — Umbral de insatisfacción
- **Pregunta:** ¿Desde qué puntaje de la encuesta post instalación se abre un seguimiento?
- **Contexto:** BASE §73 incorpora la encuesta al tablero, pero no define la acción.
- **Opciones:**
  - A) Un puntaje de 2 o menos (en escala de 1 a 5) crea un caso de seguimiento en M09 **(Recomendada)**.
  - B) Un puntaje de 3 o menos.
  - C) Solo se informa en el tablero, sin seguimiento.
- **Impacto si no se responde:** se asume A (PRM-TEC-137).
- **Bloquea:** EVT-TEC-17, REP-TEC-13.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-09 — Modo de aprovisionamiento
- **Pregunta:** ¿El aprovisionamiento en los sistemas de red debe ser automático o manual?
- **Contexto:** ProCoop combina corte directo y acciones manuales. AGR-016 pide reintentos y trazabilidad.
- **Opciones:**
  - A) Automático y asíncrono, con respaldo manual cuando se agotan los reintentos **(Recomendada)**.
  - B) Solo manual, con una tarea para el NOC.
  - C) Automático sin respaldo manual.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-182 a 196, §9.9, O3.
- **Estado:** Respondida (DEC-041): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-10 — Sistemas de red del piloto
- **Pregunta:** ¿Qué sistemas de red deben estar integrados para el piloto de Internet (O3)?
- **Contexto:** ProCoop integra MikroTik, Wispro, Radius, SmartOlt, Ispfull, Sensa, Sopnet y Sitsa. Integrar todos en O3 no es viable.
- **Opciones:**
  - A) MikroTik + Radius + SmartOLT en O3 y el resto por demanda de las cooperativas a migrar **(Recomendada)**.
  - B) Solo MikroTik en O3.
  - C) Todos en O3.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §13, O3.
- **Estado:** Respondida (DEC-042): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-11 — Alcance del análisis de red
- **Pregunta:** ¿El análisis de red debe incluir cálculo eléctrico (caídas de tensión, cargas) o solo topología e impacto?
- **Contexto:** BASE §18 habla de "simulación"; ProCoop no tiene cálculo eléctrico (CTR-TEC-22).
- **Opciones:**
  - A) Topología e impacto (qué contratos quedan afectados), sin cálculo eléctrico **(Recomendada)**.
  - B) Incluir cálculo eléctrico básico.
  - C) Integrarse con un software eléctrico externo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-148 a 163, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-12 — Mapa base
- **Pregunta:** ¿Qué proveedor de mapas se usa?
- **Contexto:** BASE §77 nombra Google Maps. ProCoop usa Bing y Google Earth (CTR-TEC-34). Google Maps tiene costo por uso.
- **Opciones:**
  - A) Google Maps con el proveedor abstraído, para poder cambiarlo más adelante **(Recomendada)**.
  - B) OpenStreetMap, sin costo de licencia.
  - C) Google Maps sin abstracción.
- **Impacto si no se responde:** se asume A (PRM-TEC-149).
- **Bloquea:** RF-TEC-215 a 223.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-13 — Formatos de CDR prioritarios
- **Pregunta:** ¿Qué formatos de CDR se implementan primero?
- **Contexto:** ProCoop tiene lectores para más de 20 centrales. Implementarlos todos de una vez es costoso.
- **Opciones:**
  - A) Los formatos de las cooperativas que se migran primero, con lectores como plugins **(Recomendada)**.
  - B) Todos los formatos en O10.
  - C) Solo un formato estándar (CSV) y conversión fuera del sistema.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-197 a 214, O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-14 — Telefonía móvil (Claro y Personal)
- **Pregunta:** ¿Cómo se integran los consumos de telefonía móvil?
- **Contexto:** MER-017 los incluye; ProCoop tiene configuración propia para Personal (V2 #301).
- **Opciones:**
  - A) Importador configurable por operadora en O10 **(Recomendada)**.
  - B) Integración por API con cada operadora.
  - C) Fuera de alcance.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PAN-TEC-46, EVT-TEC-28.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-15 — Procedimiento de recupero por fraude
- **Pregunta:** ¿Cómo se define el procedimiento de recupero de consumo no registrado?
- **Contexto:** MER-004 pide el debido proceso; la normativa varía según el regulador.
- **Opciones:**
  - A) Flujo configurable con aprobación obligatoria por un rol distinto del inspector y método de cálculo versionado **(Recomendada)**.
  - B) Flujo fijo según una normativa de referencia.
  - C) Solo registro de la inspección, con el recupero fuera del sistema.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-176 a 181, RN-TEC-094, O7.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-16 — Criterio de prorrateo de la contribución por mejoras
- **Pregunta:** ¿Con qué criterio se reparte el costo de una obra entre los beneficiarios?
- **Contexto:** MER-009 lo deja abierto; cada ordenanza puede definir uno distinto.
- **Opciones:**
  - A) Metros de frente por defecto, con el criterio configurable por obra (superficie, partes iguales, valuación) **(Recomendada)**.
  - B) Siempre en partes iguales.
  - C) Importe cargado a mano por beneficiario.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TEC-168 a 175, §9.10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-17 — Responsable de resolver conflictos de sincronización
- **Pregunta:** ¿Quién resuelve los conflictos entre lo hecho en campo y lo cambiado en la administración?
- **Contexto:** AGR-025 exige un responsable definido.
- **Opciones:**
  - A) El supervisor de la zona o cuadrilla, con escalamiento al administrador técnico al vencer el plazo **(Recomendada)**.
  - B) Siempre el administrador técnico.
  - C) Quien haya hecho el cambio en la administración.
- **Impacto si no se responde:** se asume A (PRM-TEC-139).
- **Bloquea:** RN-TEC-068, PAN-TEC-24.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-18 — Retención de evidencias de campo
- **Pregunta:** ¿Cuánto tiempo se guardan las fotos y firmas de las OT?
- **Contexto:** Las evidencias ocupan espacio y pueden tener datos personales. T11 define la retención documental.
- **Opciones:**
  - A) 10 años para conformidades e inspecciones; 2 años para el resto de las fotos operativas, configurable por tenant **(Recomendada)**.
  - B) Todo por 10 años.
  - C) Según la política general de T11, sin distinción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** `fieldEvidence`, T11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-19 — Portabilidad numérica en telefonía (HUE-TEL-05)
- **Pregunta:** ¿CoopApps debe gestionar la portabilidad numérica de las líneas telefónicas de la cooperativa?
- **Contexto:** La portabilidad solo es posible para cooperativas que tienen numeración asignada como prestador. La mayoría revende servicio o no opera telefonía, y el proceso regulatorio de portabilidad (administrador de la base, ventanas, plazos) no está relevado en ProCoop. El campo `portId` de EVT-TEC-31 ya estaba previsto sin proceso que lo alimentara.
- **Opciones:**
  - A) "No aplica" por defecto; la portabilidad queda como operación técnica con estados (solicitada, presentada, aceptada, programada, ejecutada, rechazada, cancelada), habilitable por tenant con numeración propia mediante PRM-TEC-156 (RF-TEC-234, `numberPortings`, PAN-TEC-63, API-TEC-53) **(Recomendada)**.
  - B) Portabilidad completa desde O10: integración con el administrador de la base de portabilidad, ventanas automáticas y conciliación (requiere una ficha nueva en T06).
- **Impacto si no se responde:** se asume A; PRM-TEC-156 = false y las pantallas no se muestran.
- **Bloquea:** RF-TEC-234; EVT-TEC-31 (`portId`).
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-20 — Controles de calidad del agua (HUE-AG-01)
- **Pregunta:** ¿La cooperativa registra en CoopApps los controles de calidad del agua (muestras, análisis de laboratorio y resultados) o los lleva en un sistema externo?
- **Contexto:** Las concesiones de agua potable exigen controles periódicos de calidad e informes al regulador. ProCoop no tiene funcionalidad específica. Sin registro en el sistema, el informe regulatorio debe armarse fuera de CoopApps.
- **Opciones:**
  - A) Controles en M10: punto de muestreo, plan, muestra, análisis, resultado por parámetro con límite, laboratorio con protocolo como documento T11 y acciones correctivas; el informe al regulador se emite por M06 con el código REP-BIA-024 de T10. Habilitable por servicio o concesión con PRM-TEC-157 (RF-TEC-235, RF-TEC-236, PAN-TEC-64, API-TEC-54, EVT-TEC-37, REP-TEC-29) **(Recomendada)**.
  - B) "No aplica": la calidad del agua se gestiona en un sistema externo y CoopApps solo adjunta el informe del laboratorio como documento.
- **Impacto si no se responde:** se asume A con PRM-TEC-157 = false hasta que el tenant lo active.
- **Bloquea:** RF-TEC-235, RF-TEC-236; REP-BIA-020 (sección de calidad), REP-BIA-024.
- **Estado:** Asumida la recomendada (DEC-072) salvo respuesta del solicitante.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-21 — Vocabulario de capabilities de M10 (PA 4 y 7 del pendiente de cierre)
- **Pregunta:** ¿Las capabilities de M10 con acción en inglés (`tec.workOrder.read`, `tec.network.manage`, `tec.schedule.configure`…) se mantienen como excepción o se renombran al español?
- **Contexto:** la guía §62 fija acciones en español. T02 §4.4.3 lista los nombres de M10 fuera de convención con su canónica propuesta y, hasta que se corrijan, el chequeo de permisos no los reconoce. El §4 de este anexo usaba además un vocabulario propio (`tec.ot.*`, `tec.factibilidades.*`) que T02 no registra.
- **Opciones:**
  - A) Renombrar al español con la canónica de T02 (`tec.ordenes.ver/editar/cerrar`, `tec.serviceTechnical.ver/editar`, `tec.redes.*`, `tec.agenda.*`…) y conservar el nombre anterior como alias "antes `x`" en cada celda **(Recomendada)**.
  - B) Mantener los nombres en inglés como excepción registrada en T02.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §4, §10, §11 y ESC-TEC-24; catálogo de T02 §4.4.
- **Estado:** Asumida la recomendada (DEC-072). Aplicada en la corrección de cierre del 05-11-2026. El pendiente proponía `tec.ot.*` y `tec.servicioTecnico.*`; se usan `tec.ordenes.*` y `tec.serviceTechnical.*` porque son los nombres que registra T02. T02 debe registrar `tec.materiales.autorizar`, `tec.materiales.solicitar`, `tec.conflictos.resolver`, `tec.guardias.gestionar` y `tec.calidadAgua.gestionar` (reemplazan a `tec.material.authorize`, `tec.material.request`, `tec.syncConflict.resolve`, `tec.onCall.manage` y `tec.waterQuality.manage`, que T02 registraba con acción en inglés). Barrido final de T02 (§4.4.1 y §4.4.3): T02 fijó como canónicas `tec.servicioTecnico.*` (antes en este anexo `tec.serviceTechnical.*`), `tec.estimaciones.gestionar`, `tec.despacho.gestionar`, `tec.cuadrillas.gestionar`, `tec.formulariosCampo.gestionar`, `tec.equiposRed.gestionar`, `tec.contribucionesObra.gestionar`, `tec.dispositivos.gestionar`, `tec.perfilTecnico.verSecretos` y las acciones de campo `tec.campo.marcarEnCamino`, `tec.campo.registrarConformidad`, `tec.campo.registrarMateriales`, `tec.campo.crearOrden`; se renombraron en §4 y §10–§11 con "antes". Los comandos (`tec.workOrder.create`) no son capabilities y no cambian.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-22 — Estados de `technicalProcedures` (PA 8 del pendiente de cierre)
- **Pregunta:** ¿El expediente técnico (`EXPEDIENTES`, `EXPEDIENTES_TRAM`) tiene máquina de estados propia o solo un código de estado libre?
- **Contexto:** el §7.11 declaraba `status` sin valores y el §8 no tenía su máquina; las etapas (`stages[]`) ya registran presentación y resolución.
- **Opciones:**
  - A) Máquina propia con `open`, `inReview`, `observed`, `approved`, `rejected` y `cancelled` (§8.15), dirigida por la resolución de cada etapa **(Recomendada)**.
  - B) Sin máquina: `status` como texto libre migrado de ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.11, §8.15; migración de `EXPEDIENTES` (§19).
- **Estado:** Asumida la recomendada (DEC-072). T05 (COL-TEC-17) toma los valores de §8.15.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TEC-23 — Residuales de los entregables: referencias, estados, rutas de API, comando de OT y alias (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M10 (§7.23), qué valores y transiciones tienen las colecciones excluidas o sin estado inicial explícito, cómo se alinean los grupos de método de API-TEC-26, 29, 39, 40 y 47 con sus rutas, qué nombre tiene el comando con que M09 pide una OT y cómo se nombra el evento `int.cdr.batch-received`?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M10-TEC-tecnica-campo-redes-parte2.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 08, 11) y de `18-openapi/_inconsistencias.md` (grupos de método). El comando `tec.workOrder.create` coincidía con un alias de la capability `tec.ordenes.crear` de T02.
- **Opciones**: A) **(Recomendada)** Destinos de §7.23, máquinas de §8.16, un grupo de método por ruta en el mismo orden, comando `tec.workOrder.request` (el que M09 ya emite y paralelo a `tec.feasibility.request`) y evento `int.cdr.batchReceived` (regla de guiones a camelCase; alias `int.cdr.batch-received`). B) Mantener `[VERIFICAR]`, los grupos de método anteriores y `tec.workOrder.create`.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER, diagramas de estados y contrato OpenAPI de M10; T05 COL-TEC-12, 14, 15, 20, 21, 22, 28 y 42 y §7.2.1; alias de T11 §12.4.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §2, §5 (RF-TEC-233), §7.1 a §7.12, §7.22, §7.23, §8.16, §9.11.1, §11 y §12. T05 debe reflejar las equivalencias de §7.23 y en §7.2.1 `prospect`, `cancelReason`, `entityType`, `casPackageIds` y `fieldDevices.deviceId` como "no es referencia". T11 debe registrar el alias `int.cdr.batch-received` → `int.cdr.batchReceived` en §12.4 y el comando `tec.workOrder.request` en el payload de EVT-CRM-13. También se cierran en §7.22 las referencias restantes: `debitAccountId`/`creditAccountId` → M15 `ledgerAccounts`, `serviceId`/`serviceIds` → M02 `tenantServices`, `connectionEstimates.templateId` → T11 `documentTemplates`, `syncMutations.deviceId` → M10 `fieldDevices`, `ancestorIds` → M10 `networkElements`, `supersedesSampleResultId` → M10 `waterSamples` y los `entityId` polimórficos de `technicalNotes` y `syncMutations`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-01 — Firma de pagos: dónde y cuántos firmantes
- **Pregunta:** ¿La firma de los pagos se hace en Tesorería con N firmantes configurables por monto y cuenta, o se mantiene una única firma ligada a la OP como en ProCoop?
- **Contexto:** RN-08 §4.3 y §14 duda 6 (relación entre `PPAGOS.FIRMA`, `PPAGOS_FIRMANTES` y `FIRMASELECTRONICAS` no aclarada); BASE SUE-013 exige separación liquidador/aprobador/tesorero.
- **Opciones:**
  - A) M12 aprueba la OP; TES firma con N firmantes por monto y grupo (A + B) según la cuenta, y entrega **(Recomendada)** — segregación real y control bancario de firmas conjuntas.
  - B) Una sola firma por OP, en TES — más simple, menor control.
  - C) Firma en M12 como parte de la aprobación de la OP — mezcla obligación y egreso de fondos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-008, RF-TES-117, PRM-TES-048 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-02 — Alcance de Interbanking
- **Pregunta:** ¿Qué capacidades de Interbanking se implementan en O8?
- **Contexto:** RN-13 §16 (API solo de información, pagos por archivo) vs CAT `SU_AUDIT_TRA_INTERBANKING` (indicios de envío por servicio) (CTR-TES-02); RN-08 §14 duda 12 (cuántas cooperativas lo usan).
- **Opciones:**
  - A) API de información (cuentas, saldos, movimientos) + archivos de pago con registro de envío y respuesta; transferencias por API como adaptador posterior si Interbanking lo habilita para el tenant **(Recomendada)** — cubre ProCoop sin depender de un servicio no confirmado.
  - B) Solo archivos (extractos y pagos), sin API — menor costo, conciliación menos automática.
  - C) API de información y de pagos desde O8 — mayor automatización, requiere convenio y certificación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-051…060, RF-TES-161 (O8, O9).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-03 — Integración de eCheq
- **Pregunta:** ¿Cómo se integra el eCheq?
- **Contexto:** DFA M18 lo propone como mejora; ProCoop solo registra el número del e-cheq en la chequera (RN-08 §2.5). Cada banco ofrece canales distintos.
- **Opciones:**
  - A) Registro en CoopApps del ciclo completo con carga manual o importación de listados del banco, y adaptadores de API por banco/Interbanking cuando estén disponibles **(Recomendada)** — funciona desde el día uno con cualquier banco.
  - B) Integración directa por API con los bancos de la piloto desde O8 — más automático, depende de cada banco.
  - C) Solo registro manual del número (como ProCoop) — sin seguimiento de aceptación ni endosos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-085…090 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-04 — Formatos de extracto prioritarios
- **Pregunta:** ¿Qué formatos de extracto deben estar disponibles en O5 para la piloto?
- **Contexto:** FIC 11.2 (CSV, Excel o formato del banco); no se relevó qué bancos usa la piloto.
- **Opciones:**
  - A) Perfil genérico CSV/XLSX configurable + perfiles predefinidos de los dos bancos principales de la piloto **(Recomendada)** — cubre O5 sin esperar Interbanking.
  - B) Solo perfil genérico — el tenant configura todo.
  - C) Esperar a Interbanking (O8) — la piloto concilia a mano en O5.
- **Impacto si no se responde:** se asume A; requiere muestras anonimizadas de extractos.
- **Bloquea:** RF-TES-033 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-05 — Autoconfirmación de conciliaciones
- **Pregunta:** ¿Puede el sistema confirmar conciliaciones sin intervención humana?
- **Contexto:** DFA pide conciliación asistida; AGR-011 exige explicar cada peso.
- **Opciones:**
  - A) El sistema solo propone; el tenant puede habilitar autoconfirmación para reglas 1:1 con referencia exacta e importe exacto **(Recomendada)** — ahorro de tiempo con riesgo acotado.
  - B) Siempre confirmación humana — máximo control, más trabajo.
  - C) Autoconfirmar toda propuesta con puntaje alto — riesgo de errores silenciosos.
- **Impacto si no se responde:** se asume A con PRM-TES-057 en `false` por defecto.
- **Bloquea:** RF-TES-037 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-06 — Aceptación de rendiciones
- **Pregunta:** ¿La rendición de cada caja de cobranza requiere aceptación expresa de Tesorería?
- **Contexto:** En ProCoop el cierre de caja transfiere los fondos automáticamente (RN-08 §2.2); BASE §102.8 menciona procedimientos de arqueo; CTR-TES-14.
- **Opciones:**
  - A) Sí: M07 cierra y arquea; Tesorería recibe, cuenta y acepta u observa (doble control), configurable por tenant **(Recomendada)** — trazabilidad de faltantes y responsables.
  - B) No: el cierre de M07 transfiere automáticamente como ProCoop — más rápido, sin segundo control.
  - C) Aceptación solo para cajas con diferencias — control parcial.
- **Impacto si no se responde:** se asume A (PRM-TES-028 = `true`).
- **Bloquea:** RF-TES-126…129 (O5).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-07 — Pago de haberes
- **Pregunta:** ¿El pago de haberes se ejecuta como lote directo de Tesorería o replicando la OP de Compras al empleado como ProCoop?
- **Contexto:** RN-08 §11.5 (factura de compra ficticia al empleado + OP); BASE §104 SUE-009 (archivo bancario, órdenes a tesorería, conciliación); CTR-TES-20.
- **Opciones:**
  - A) Lote directo: M16 envía el lote aprobado y TES genera archivos, ejecuta y concilia **(Recomendada)** — sin proveedores ficticios, mejor confidencialidad.
  - B) Replicar el circuito ProCoop (factura y OP por empleado) — continuidad, pero contamina compras y libros.
  - C) Una OP global por el total del lote en M12 — intermedio, menos detalle por empleado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-160…165 (O9).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-08 — Compromisos de fondos y presupuesto
- **Pregunta:** ¿Cómo se reparten los compromisos entre Tesorería (M14) y Presupuesto (M15)?
- **Contexto:** AGR-028 (P2, "mantener este alcance como decisión explícita"); BASE §21.
- **Opciones:**
  - A) M15 es dueño del registro presupuestario (crédito, comprometido, devengado, pagado); TES es dueño del compromiso de fondos con fecha y cuenta esperadas; ambos se alimentan del mismo evento con un `commitmentRef` común **(Recomendada)** — cada módulo con su dato, sin doble cómputo.
  - B) Solo TES registra compromisos y M15 los lee — presupuesto depende de tesorería.
  - C) Sin compromisos en O8 (solo proyección por vencimientos) — más simple, se pierde AGR-028.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-156…159 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-09 — Fuente de cotizaciones
- **Pregunta:** ¿De qué fuente se toman las cotizaciones de moneda extranjera?
- **Contexto:** FIC 11.3 (se puede tomar de ARCA); ProCoop guarda cotizaciones manuales (`COT_DOL`).
- **Opciones:**
  - A) ARCA (`FEParamGetCotizacion`) diaria, con carga manual aprobada como respaldo **(Recomendada)** — fuente oficial y la misma que usa la factura electrónica.
  - B) Banco Nación (cotización vendedor) — práctica contable habitual, requiere otra integración.
  - C) Solo carga manual — sin integración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-142 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-10 — Cuentas en moneda extranjera
- **Pregunta:** ¿Se admiten cuentas y movimientos en moneda extranjera en O8?
- **Contexto:** CAT `TIP_MON`, `COT_DOL`; RN-08 §15.1 (disponibilidades convierten ME); no hay evidencia de uso en la piloto.
- **Opciones:**
  - A) Sí, con valuación a cotización y diferencia de cambio informada a M15 **(Recomendada)** — cubre ProCoop.
  - B) Solo ARS en O8 y ME en una ola posterior — menor alcance inicial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-019, RF-TES-143 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-11 — Presentación automática de retenciones recibidas
- **Pregunta:** ¿Las retenciones recibidas se transfieren automáticamente al cómputo fiscal al aceptarse la rendición?
- **Contexto:** RN-09 P2952; CTR-TES-16.
- **Opciones:**
  - A) Configurable por tenant, desactivado por defecto: Tesorería verifica certificados y presenta por lote **(Recomendada)** — evita computar certificados no recibidos.
  - B) Siempre automática — menos trabajo, riesgo de cómputo sin certificado.
  - C) Siempre manual — sin opción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-106 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-12 — Pagos en efectivo desde caja de cobranza
- **Pregunta:** ¿Se permite pagar a proveedores con efectivo de una caja de cobranza?
- **Contexto:** RN-08 §4.2 (P144, P2025), §15.1 (`GetCajaCobranza_CajaPagos`); CTR-TES-22.
- **Opciones:**
  - A) No por defecto: los pagos en efectivo salen de la caja de pagos; el tenant puede habilitarlo con tope y registro de salida pendiente **(Recomendada)** — separa recaudación y pagos sin perder la práctica de ProCoop.
  - B) Prohibido siempre — más control, puede no reflejar la operatoria de cooperativas pequeñas.
  - C) Permitido sin tope como ProCoop — menor control.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-108, RF-TES-109 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-13 — Efecto de un cupón rechazado sobre el socio
- **Pregunta:** ¿Qué documento se genera al socio cuando el procesador rechaza un cupón?
- **Contexto:** RN-08 §2.6 (anticipo/deuda), P3177/P3178 (comprobante formal opcional); CTR-TES-23.
- **Opciones:**
  - A) Nota de débito formal (M05/M07) que reabre la obligación cancelada, con gasto configurable **(Recomendada)** — trazable y fiscalmente consistente.
  - B) Anticipo/deuda informal como ProCoop — sin comprobante fiscal.
  - C) Revertir el recibo original — altera la historia (prohibido por guía §5 salvo reversa vinculada).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-098 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-14 — Método de proyección de cobros
- **Pregunta:** ¿Cómo se proyectan los cobros de cuenta corriente en el flujo de fondos?
- **Contexto:** DFA M18 (flujo desde vencimientos a cobrar); BASE §21 (un cobro esperado no es disponibilidad).
- **Opciones:**
  - A) Por vencimiento aplicando una curva de cobrabilidad configurable por servicio (calculable desde el historial) **(Recomendada)** — proyección realista.
  - B) 100 % al vencimiento — simple, sobreestima ingresos.
  - C) Solo lo ya cobrado o en tránsito — subestima, inútil para planificar.
- **Impacto si no se responde:** se asume A con curva inicial 100 % al vencimiento hasta calibrarla.
- **Bloquea:** RF-TES-146, PRM-TES-066 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-15 — Cheque de socio rechazado
- **Pregunta:** ¿Qué se hace con la deuda del socio cuando su cheque es rechazado?
- **Contexto:** RN-08 §15.1 (registro en cuenta de rechazados); BASE §13 (contracargo reabre obligación sin borrar el recibo).
- **Opciones:**
  - A) ND automática al socio por el importe más gastos bancarios configurables, con revisión previa del tesorero **(Recomendada)** — reabre la deuda de forma trazable y recupera costos.
  - B) ND solo por el importe, gastos a cargo de la cooperativa.
  - C) Gestión manual caso por caso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-069 (O8).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-16 — Alcance de Tesorería en O5 (piloto)
- **Pregunta:** ¿Qué parte de Tesorería debe estar operativa en O5 para cerrar el circuito de cobranza del piloto Internet?
- **Contexto:** Guía §7 (O5 cuenta corriente y cobranza; O8 tesorería); el encargo fija rendición, depósito y conciliación de cobranzas en O5.
- **Opciones:**
  - A) O5: cuentas, entidades, categorías, movimientos básicos, rendición y aceptación (efectivo y transferencias), caja de tesorería, depósito, extractos, conciliación asistida de depósitos y acreditaciones de pasarelas, reintegros; valores, cupones, retenciones, Interbanking y el resto en O8 **(Recomendada)** — mínimo suficiente si la piloto no cobra con cheques ni tarjeta en caja.
  - B) Igual que A, sumando cupones de tarjeta en O5 — si la piloto cobra con POS en caja.
  - C) Igual que A, sumando Interbanking en O5 — si la piloto ya lo usa.
- **Impacto si no se responde:** se asume A; M07 no habilitará cheques ni tarjetas en caja hasta O8.
- **Bloquea:** asignación de olas de §5 (O5/O8).
- **Estado:** Respondida (DEC-059): en O5 cuentas, rendición, depósitos, extractos y conciliación; en O8 valores, cupones de tarjeta, retenciones e Interbanking (opción A).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-17 — Diferencia de arqueo en una rendición con varias entidades jurídicas
- **Pregunta:** cuando una rendición de caja cubre cobros de varias entidades jurídicas (DEC-064, DEC-087) y el arqueo da diferencia, ¿a qué entidad se imputa?
- **Contexto:** RN-TES-086 exige una operación de tesorería por entidad; la diferencia de arqueo no tiene entidad propia.
- **Opciones:**
  - A) A la entidad que indique el receptor, con default la de mayor importe rendido, y asiento entre entidades si corresponde (M15 M-136) **(Recomendada)**.
  - B) Prorrateada por importe rendido de cada entidad.
  - C) Siempre a la entidad por defecto del tenant (T04 RF-CFG-134).
- **Impacto si no se responde:** se asume A; validar con el contador de la cooperativa piloto.
- **Bloquea:** RN-TES-086 (O5).
- **Estado:** Asumida la recomendada (DEC-072).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-TES-18 — Estados de `cashFlowScenarios` (PA 19 del pendiente de cierre)
- **Pregunta:** ¿Se confirman los estados propuestos del escenario de flujo de fondos?
- **Contexto:** el §7.41 declaraba `status` sin valores; la corrección del 05-11-2026 propuso `draft`, `active`, `archived` con `[VERIFICAR]` (§8.16.10).
- **Opciones:**
  - A) Confirmar `draft` → `active` → `archived` (§8.16.10); un escenario archivado se copia para reutilizarlo **(Recomendada)**.
  - B) Sin estado: el escenario existe o se elimina.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.41, §8.16.10; CU-TES-11.
- **Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de §8.16.10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-01 — Tema de la PWA y de la landing para socios
- **Pregunta:** ¿La PWA de socios y la landing usan la piel oscura `.pwa-mod` o un tema claro por defecto?
- **Contexto:** CNX §3.1 define la piel oscura; el público de socios es amplio (adultos mayores, pantallas al sol) y la landing es pública.
- **Opciones:**
  - A) Landing clara por defecto; PWA socio según política del tenant (`dark` por defecto, con opción del usuario) **(Recomendada)** — coherencia de producto y legibilidad en lo público.
  - B) Todo oscuro — máxima coherencia visual, menor legibilidad al aire libre.
  - C) Todo claro — más convencional; se pierde la identidad de la piel.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-077, PRM-UXD-001/002, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-02 — Dominio propio de la cooperativa
- **Pregunta:** ¿Se permite que el tenant use su propio dominio (ej. `app.coopsur.com.ar`) además del subdominio del producto?
- **Contexto:** RF-UXD-112 resuelve por subdominio; el dominio propio requiere certificados y validación DNS (T08).
- **Opciones:**
  - A) Subdominio en O1; dominio propio en O2 como opción con verificación DNS y certificado automático **(Recomendada)** — no frena el arranque.
  - B) Solo subdominio — más simple; menos identidad propia.
  - C) Dominio propio desde O1 — más trabajo de infraestructura temprano.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-112, API-POR-01 (antes API-UXD-01), API-UXD-02, T08.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-03 — Apps instalables y tiendas
- **Pregunta:** ¿Se ofrecen tres apps instalables (socio, equipo, campo) desde la misma PWA, y se publican en tiendas?
- **Contexto:** RN-UXD-038; guía §8 exige una sola PWA; las tiendas requieren cuentas de desarrollador por cooperativa o por producto.
- **Opciones:**
  - A) Tres manifests instalables desde la web; sin tiendas en esta versión **(Recomendada)** — sin costos de tiendas, actualización inmediata.
  - B) Una sola app instalable con cambio de espacio — menos íconos; mezcla audiencias.
  - C) Tres manifests y publicación en tiendas (TWA) — mayor alcance; gestión de cuentas y revisiones.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-038, RF-UXD de manifest, O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-04 — Plantillas, importación y control de publicación del diccionario
- **Pregunta:** ¿Se habilitan plantillas e importación XLSX del diccionario, y la publicación exige doble control?
- **Contexto:** BASE §65.9 deja abiertas las opciones; una mala publicación afecta a todo el tenant (aunque es reversible).
- **Opciones:**
  - A) Plantillas e importación habilitadas; doble control opcional por tenant (apagado por defecto) **(Recomendada)** — agilidad con reversión inmediata.
  - B) Plantillas e importación; doble control obligatorio — más seguro, más lento.
  - C) Sin importación (solo edición en pantalla) — menos riesgo, más trabajo inicial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-165, PRM-UXD-021/023, API-UXD-23/24.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-05 — Variantes por canal
- **Pregunta:** ¿Un mismo texto puede tener valores distintos por canal (admin, PWA, documentos, email, SMS)?
- **Contexto:** BASE §65.4 lo menciona y §65.9 lo deja pendiente; agrega complejidad a la edición.
- **Opciones:**
  - A) Sí, opcional, con el valor general como fallback **(Recomendada)** — cubre SMS cortos y lenguaje cercano en PWA.
  - B) No, un valor por clave — más simple; textos largos en SMS.
  - C) Solo para SMS y push — intermedio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-148, PRM-UXD-022.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-06 — Multi-idioma
- **Pregunta:** ¿Se requiere traducción a otros idiomas?
- **Contexto:** BASE §65.3 no lo pide; el modelo guarda `locale`.
- **Opciones:**
  - A) Solo `es-AR`, modelo preparado **(Recomendada)** — sin costo hoy.
  - B) `es-AR` + `en` desde O1 — duplica la carga de textos.
  - C) Multi-idioma completo por tenant — fuera de alcance del mercado objetivo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-168.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-07 — Congelamiento de textos en documentos
- **Pregunta:** ¿Los documentos ya emitidos conservan los términos vigentes al emitirse o se re-renderizan con el diccionario actual?
- **Contexto:** RF-UXD-161; facturas y constancias tienen valor legal; reimprimir con otro término puede generar confusión.
- **Opciones:**
  - A) Congelar la versión del diccionario en el documento (la reimpresión es idéntica) **(Recomendada)** — integridad documental.
  - B) Re-renderizar siempre — coherencia con el término actual; riesgo legal.
  - C) Congelar solo comprobantes fiscales; resto re-renderiza — mixto.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-161, M05, T09, O4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-08 — Tipografías personalizables por tenant
- **Pregunta:** ¿El tenant puede elegir tipografías propias?
- **Contexto:** RF-UXD-004; fuentes autoalojadas por rendimiento y privacidad; licencias de fuentes de terceros.
- **Opciones:**
  - A) No: tipografías del producto, autoalojadas **(Recomendada)** — rendimiento, accesibilidad y licencias controladas.
  - B) Elegir entre 3–4 fuentes curadas — algo de identidad, más pruebas.
  - C) Subir fuente propia — riesgo de licencias y legibilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-004, 7.A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-09 — Proveedor de mapas
- **Pregunta:** ¿Qué proveedor de mapas se usa por defecto y quién paga la clave?
- **Contexto:** BASE §77 nombra Google; CNX usa Leaflet; Google tiene costo por uso; RN-09 tiene Google y Bing.
- **Opciones:**
  - A) Google por defecto con clave del tenant en bóveda; OSM como alternativa sin costo **(Recomendada)** — continuidad con ProCoop y opción gratuita.
  - B) OSM por defecto; Google opcional — sin costo; menor calidad de geocodificación en localidades chicas.
  - C) Google con clave del producto — costo para GoodApps, menos fricción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-057, PRM-UXD-040…044, CTR-UXD-03.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-10 — Logos por sucursal
- **Pregunta:** ¿Las sucursales pueden tener logo propio?
- **Contexto:** RF-UXD-028; cooperativas con sucursales en otras localidades o con marcas comerciales distintas.
- **Opciones:**
  - A) Sí, opcional (PRM-UXD-024 apagado por defecto), con herencia del tenant **(Recomendada)** — cubre casos sin complejidad para el resto.
  - B) No — un logo por tenant.
  - C) Marca completa por sucursal (colores incluidos) — mayor complejidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-028.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-11 — PWA en escritorio
- **Pregunta:** ¿La PWA en escritorio se muestra siempre en phone shell o se permite una vista amplia?
- **Contexto:** RF-UXD-069; socios que usan PC; CNX §3.3 define phone shell.
- **Opciones:**
  - A) Phone shell por defecto; vista amplia opcional por tenant (PRM-UXD-004) en O2 **(Recomendada)** — un solo diseño garantizado y flexibilidad.
  - B) Siempre phone shell — más simple.
  - C) Diseño responsive completo para escritorio — duplica diseño y pruebas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-069, PRM-UXD-003/004.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-12 — Mostrar módulos "No contratado"
- **Pregunta:** ¿El administrador del tenant ve los módulos no licenciados en el mapa del sitio?
- **Contexto:** RF-UXD-173; oportunidad comercial vs. ruido.
- **Opciones:**
  - A) Solo el administrador, con badge y enlace a licencia; configurable (PRM-UXD-026) **(Recomendada)** — descubrimiento sin molestar a operadores.
  - B) Nadie — interfaz limpia, sin descubrimiento.
  - C) Todos los usuarios — ruido y frustración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-173, API-UXD-20.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-13 — Admin en pantallas chicas
- **Pregunta:** ¿Hasta qué ancho se soporta el admin?
- **Contexto:** RF-UXD-058; tablas densas; la PWA empleado cubre lo móvil.
- **Opciones:**
  - A) Objetivo 1024 px; 768–1023 px soportado con menú colapsado; &lt; 768 px aviso de usar la PWA **(Recomendada)** — esfuerzo acotado.
  - B) Totalmente responsive hasta 360 px — gran esfuerzo en tablas.
  - C) Solo ≥ 1280 px — excluye tablets y notebooks chicas.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-058, PRM-UXD-025.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-14 — Mensaje de error de login
- **Pregunta:** ¿El login distingue "usuario inexistente" de "contraseña incorrecta"?
- **Contexto:** CNX §3.6 pide errores específicos; la anti-enumeración (T02) pide mensajes genéricos.
- **Opciones:**
  - A) Mensaje genérico siempre, con ayuda de formato y enlace a recuperar **(Recomendada)** — seguridad sin perder guía.
  - B) Específico configurable por tenant (PRM-UXD-032) — más claro, riesgo de enumeración.
  - C) Específico solo en red interna — complejo de operar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-UXD-117, PRM-UXD-032, T02.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-15 — Bloqueo de escritorio para roles de campo
- **Pregunta:** ¿El tenant puede impedir que roles de campo usen la PWA en escritorio?
- **Contexto:** RN-UXD-027; CNX §3.3 lo prevé; evita registrar lecturas o cobranzas desde la oficina como si fueran de campo.
- **Opciones:**
  - A) Sí, configurable por rol (PRM-UXD-005), vacío por defecto **(Recomendada)** — control para quien lo necesite.
  - B) Bloqueo fijo para roles de campo — rígido.
  - C) Sin bloqueo — se pierde control; la validación de GPS lo compensa parcialmente.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RN-UXD-027, PRM-UXD-005.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-16 — Asistente IA en la PWA
- **Pregunta:** ¿Se incluye un asistente IA en la topbar de la PWA (socio y empleado)?
- **Contexto:** CNX §3.3 lo muestra; costo por uso; IA solo propone (CNX §4.2); M09 define el bot.
- **Opciones:**
  - A) Detrás de flag `pwa.asistente`, apagado por defecto, habilitable en O11 **(Recomendada)** — sin costo ni riesgo hasta validar.
  - B) Habilitado desde O2 para socios — atención 24 h; costo y riesgo de respuestas.
  - C) No incluir — se pierde diferencial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** SM-PWS-041, SM-PWE-017, PRM-UXD-034.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-17 — Tipografía de los documentos PDF
- **Pregunta:** ¿La cooperativa puede elegir la tipografía de sus comprobantes y documentos PDF?
- **Contexto:** ProCoop permite elegir la fuente de los PDF (T04b VAR 2368). PA-UXD-08 recomienda no personalizar las tipografías de la interfaz. CTR-UXD-30 separa la interfaz de los documentos.
- **Opciones:**
  - A) Sí, solo para documentos, desde una lista cerrada de 3 tipografías autoalojadas con licencia libre (por defecto la del producto) **(Recomendada)** — conserva lo que ProCoop permite sin afectar la interfaz ni las licencias.
  - B) No: los documentos usan siempre la tipografía del producto — más simple; se pierde una opción que algunas cooperativas usan.
  - C) Carga libre de tipografías por el tenant — máxima libertad; riesgo de licencias, peso y legibilidad.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** CTR-UXD-30, campo `tenantBrandings.documentFont` (22.4).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-UXD-18 — Cierre de residuales del anexo (mapa del sitio, tabbar, estados, API y CU)

- **Pregunta:** ¿cómo se cierran los residuales del anexo detectados por los entregables (mapa de navegación, catálogo de pantallas, contratos y estados)?
- **Contexto:** el mapa citaba pantallas de otra app o recurso y citas anteriores a PAN inexistentes de T09 (PAN-COM-35 a 39); 7 capabilities y 4 rutas diferían del anexo dueño; el rótulo "Cuentas y servicios" supera los 12 caracteres de RN-UXD-006; SM-PWE-013, 016 y 018 son slots de la tabbar del empleado; 7 filas de §11 citaban "Público" o "Autenticado"; `brandAssets` y `tenantDictionaryEntries` no declaraban el estado de alta; el ID CU-ACC-01 es de T02; PAN-UXD-15, 16 y 17 no tenían RF ni ola.
- **Opciones:**
  - A) Dejar en las columnas de PAN solo pantallas de la misma app y recurso y registrar las demás en 10.9.13 con el texto anterior; tomar la capability y la ruta del anexo dueño (AL-01); rótulo corto "Cuentas"; grupo Tabbar para SM-PWE-013, 016 y 018; `public: true` o `iam.sesion.autenticada` (T02 PA-IAM-18) en §11; tabla 8.8 con los estados de alta; tablas de campos en 7.B.13; renumerar el CU propio a CU-UXD-07; asignar a PAN-UXD-15, 16 y 17 los RF existentes RF-UXD-064, 063 y 055 (ola O0, PRO-O0-15), sin crear RF nuevos. **(Recomendada)**.
  - B) Mantener las citas y documentar las diferencias en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** mapa de navegación, catálogo de pantallas y contratos OpenAPI de T03.
- **Estado:** Asumida (DEC-072): opción A.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-01 — Inclusión de cuotas no vinculadas en la factura del servicio

- **Pregunta:** ¿Se permite, por excepción configurable, incluir cuotas de ventas no vinculadas (por ejemplo, router) en la factura del servicio, como hace ProCoop?
- **Contexto:** MER-010 y BASE §52/§70 restringen la inclusión a conceptos vinculados; ProCoop lo hace en general (P308).
- **Opciones:** A) (Recomendada) No: solo conceptos vinculados y validados; el resto en documento propio presentado junto en el resumen. B) Permitir por tenant con validación fiscal documentada. C) Permitir siempre como ProCoop.
- **Impacto si no se responde:** se aplica A; tenants que hoy cobran ventas en la factura deberán comunicar el cambio.
- **Bloquea:** RF-VEN-007, RF-VEN-084, RN-VEN-004.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-02 — Modelo fiscal de la venta en cuotas

- **Pregunta:** ¿La venta financiada se factura por el total al vender (con "factura en cuotas" y crédito fiscal) o se factura cada cuota?
- **Contexto:** ProCoop admite ambos (P403, P2930, P733); impacta IVA, percepciones y libro IVA.
- **Opciones:** A) (Recomendada) Configurable por plan/concepto, default "factura total al vender" con cuotas como cronograma de cobro. B) Siempre factura por cuota. C) Siempre factura total.
- **Impacto si no se responde:** se implementa A con default; validación del contador del tenant.
- **Bloquea:** RF-VEN-058, RF-VEN-059, RN-VEN-026, CU-23 paso 4.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-03 — Comisiones de vendedores

- **Pregunta:** ¿Se requiere liquidar comisiones de vendedores?
- **Contexto:** Ninguna fuente lo pide; es práctica de mercado.
- **Opciones:** A) (Recomendada) No en O8; solo informe por vendedor; evaluar en O11. B) Comisiones por porcentaje sobre cobrado en O8. C) Integración con sueldos (M16).
- **Impacto si no se responde:** solo REP-VEN-14.
- **Bloquea:** RF-VEN-103.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-04 — Comprobantes en POS

- **Pregunta:** ¿El POS emite factura electrónica o requiere controlador fiscal?
- **Contexto:** BASE §2 menciona POS; el mercado usa factura electrónica con ticket no fiscal; los controladores fiscales requieren hardware homologado.
- **Opciones:** A) (Recomendada) Factura electrónica (M05) + ticket no fiscal/representación impresa. B) Soporte de controladores fiscales vía agente (O10). C) Ambos.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-104, RF-VEN-105.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-05 — Identificación en la aceptación online

- **Pregunta:** ¿Qué nivel de verificación exige la aceptación online?
- **Contexto:** El presupuesto puede dirigirse a socios o prospectos; la aceptación tiene valor contractual.
- **Opciones:** A) (Recomendada) Usuario autenticado de la PWA con relación sobre la cuenta, o enlace firmado + OTP al contacto registrado. B) Solo usuario autenticado. C) Enlace sin OTP.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-032, RN-VEN-047, PAN-VEN-05.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-06 — Momento del egreso de stock

- **Pregunta:** ¿El stock egresa al confirmar la venta o al entregar?
- **Contexto:** ProCoop: P77 "mover stock al registrar venta".
- **Opciones:** A) (Recomendada) Reserva al confirmar y egreso en la entrega; en POS al emitir. B) Egreso al confirmar. C) Por depósito.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-054, RN-VEN-020.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-07 — Alcance de la rendición de viajes y fletes

- **Pregunta:** ¿Cuántas cooperativas usan la rendición de fletes y combustible de ventas?
- **Contexto:** Funcionalidad de nicho con defectos en ProCoop.
- **Opciones:** A) (Recomendada) Extensión en O8, activable por tenant. B) Núcleo. C) Descartar.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-107.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-08 — Momento de facturación de la instalación del piloto

- **Pregunta:** ¿La instalación contado se factura en la primera factura del ciclo o inmediatamente al confirmar la OT?
- **Contexto:** BASE §73 deja ambos caminos.
- **Opciones:** A) (Recomendada) En la primera factura del ciclo tras la OT confirmada (concepto vinculado). B) Factura inmediata propia. C) Configurable por concepto (default A).
- **Impacto si no se responde:** C con default A.
- **Bloquea:** RF-VEN-005, §9.1, CU-INS-01.
- **Estado:** Respondida (DEC-016): opción A, en la primera factura del ciclo posterior a la OT confirmada.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-09 — Presupuesto obligatorio para conexiones del piloto

- **Pregunta:** ¿Toda conexión del piloto debe pasar por presupuesto aceptado?
- **Contexto:** El alta del piloto ya usa solicitud y simulación (M09).
- **Opciones:** A) (Recomendada) No; solo para obras/instalaciones especiales. B) Sí, siempre. C) Configurable por servicio.
- **Impacto si no se responde:** A.
- **Bloquea:** §9.1, §9.3.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-10 — Vendedor obligatorio

- **Pregunta:** ¿El vendedor es obligatorio en ventas y presupuestos?
- **Contexto:** ProCoop usa vendedor por defecto (P1008) con validación (P3053).
- **Opciones:** A) (Recomendada) Opcional con default por terminal/canal; obligatorio si el tenant lo activa. B) Siempre obligatorio. C) No usar vendedores.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-101, RN-VEN-035.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-11 — Validación de deuda y riesgo

- **Pregunta:** ¿La deuda vencida o el riesgo excedido bloquean o advierten?
- **Contexto:** P2381/P2600 y riesgo crediticio en ProCoop.
- **Opciones:** A) (Recomendada) Advertencia por defecto con override auditado; bloqueo configurable. B) Bloqueo siempre. C) Sin validación.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-028, RF-VEN-057, RN-VEN-014, RN-VEN-022.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-VEN-12 — Residuales de los entregables: referencias, estados y API reemplazadas (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M11 (§7.15), qué transiciones tienen entregas y devoluciones, y qué API de M05 reemplaza a API-VEN-006 y API-VEN-007?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M11-VEN-ventas-presupuestos.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-02 e INC-06-08) y de `18-openapi/_inconsistencias.md` (filas reemplazadas sin API destino).
- **Opciones**: A) **(Recomendada)** Destinos de §7.15, máquinas de §8.6 y API destino API-FAC-105 (consulta de `billableItems`) para API-VEN-006 y API-FAC-044 (preparación de la corrida) para API-VEN-007. B) Mantener `[VERIFICAR]` y el reemplazo sin API destino.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER, diagramas de estados y contrato OpenAPI de M11.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.1 a §7.8, §7.14, §7.15, §8.6 y §11. T05 debe registrar en §7.2.1 `sourceType`, `originType`, `quoteVersion`, `installmentType`, `discountAmount` y `discountReason` como "no es referencia" y los destinos de `premiseAddressId`, `creditNoteRequestId`, `freightSettlementId` y `discountApprovalId`.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-01 — Tratamiento de eventos consumidos sin productor
- **Pregunta:** ¿Cómo se resuelven los nombres de eventos que un consumidor usa y el productor no publica (§12.4)?
- **Contexto:** la consolidación encontró 83 discrepancias: la mayoría son alias de un evento existente y 12 son brechas, donde ningún productor publica el hecho que el consumidor espera.
- **Opciones:**
  - A) Alias con vencimiento al cierre de O2 y, para las brechas, el productor agrega el evento en su anexo **(Recomendada)**: convive sin romper y corrige la fuente.
  - B) Corregir todos los consumidores ahora y no admitir alias: más limpio, pero bloquea varios anexos a la vez.
  - C) Admitir alias permanentes: no bloquea, pero deja dos nombres para siempre.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-015, CTR-WFL-03; O0.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-02 — Aprobaciones diferidas: frontera con T02
- **Pregunta:** ¿Una aprobación de un solo paso, pedida para después, la gestiona T02 o T11?
- **Contexto:** T02 RF-IAM-093 ofrece la autorización diferida; T11 tiene el motor de aprobaciones. Si los dos la ofrecen, aparecen dos bandejas y dos auditorías.
- **Opciones:**
  - A) Un paso sin monto: T02. Multipaso, por monto, comité o delegación: T11. La bandeja muestra ambas **(Recomendada)**.
  - B) Todo lo diferido va a T11; T02 solo resuelve lo inmediato en la sesión.
  - C) Todo en T02, y T11 solo ofrece trámites.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-110, RF-WFL-130; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-03 — Plazos de retención documental
- **Pregunta:** ¿Qué plazos mínimos de retención rigen para cada categoría documental (fiscal, laboral, contractual, atención, salud, accesos)?
- **Contexto:** AGR-023 prohíbe inventar plazos. Sin confirmación, nada se purga (PRM-WFL-041), lo que hace crecer el almacenamiento.
- **Opciones:**
  - A) Cargar como "a validar" la propuesta de un asesor legal de la cooperativa piloto y no purgar hasta que se confirme **(Recomendada)**.
  - B) No purgar nunca en la primera etapa y revisarlo en O11.
  - C) Que cada tenant fije sus plazos sin mínimos de plataforma.
- **Impacto si no se responde:** no se purga ningún documento; se acumula almacenamiento.
- **Bloquea:** RF-WFL-160, PRM-WFL-041, PRM-WFL-046, JOB-WFL-14/15; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-04 — Alcance del diseñador de workflows para el tenant
- **Pregunta:** ¿El tenant puede crear workflows desde cero o solo adoptar y ajustar las plantillas de plataforma?
- **Contexto:** Connectia permitía diseñar trámites libremente; abrirlo por completo arriesga circuitos que saltan controles del dominio.
- **Opciones:**
  - A) Adoptar y ajustar plantillas en los puntos de extensión, y crear trámites nuevos solo de tipo "solicitud genérica" que terminan en una tarea o un caso **(Recomendada)**.
  - B) Diseñador libre con acciones tipadas y nodos obligatorios por dominio.
  - C) Solo plantillas de plataforma sin edición.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-076, PAN-WFL-08..12; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-05 — Motor de render PDF
- **Pregunta:** ¿Con qué motor se generan los PDF?
- **Contexto:** se necesita PDF/A-2b, fuentes embebidas, códigos de barras y QR, y lotes de miles de facturas por hora.
- **Opciones:**
  - A) HTML + CSS con un navegador sin interfaz en workers dedicados, y validación PDF/A posterior **(Recomendada)**: plantillas editables por el tenant y buen diseño.
  - B) Una biblioteca de composición PDF programática: más rápida, pero la plantilla deja de ser editable por el tenant.
  - C) Un servicio externo de render: menos operación, pero con costo por documento y datos personales fuera.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-175, JOB-WFL-11/12; O0.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-06 — Proveedor y nivel de firma por documento
- **Pregunta:** ¿Qué proveedor de firma digital se usa y qué nivel exige cada tipo documental (recibos de sueldo, actas, órdenes de pago, convenios)?
- **Contexto:** FIC 15 muestra firma digital con proveedor para recibos de sueldo, pero el proveedor está pendiente. BASE §73 pide firma capturada en campo. La firma digital tiene costo por firma.
- **Opciones:**
  - A) Electrónica (OTP) por defecto en todo, y digital con un proveedor licenciado por T06 solo para los recibos de sueldo del empleador y las actas, en O8 y O9 **(Recomendada)**.
  - B) Digital en todo lo que firma la cooperativa desde O1.
  - C) Solo electrónica interna, sin proveedor.
- **Impacto si no se responde:** se asume A, sin proveedor hasta que se elija.
- **Bloquea:** RF-WFL-198, PRM-WFL-048, perfiles de §18.5, JOB-SUE-04; O8.
- **Estado:** Resuelta por DEC-078 (opción A).

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-07 — Calendario, agenda y mesa de entradas entre M09 y T11
- **Pregunta:** ¿Se confirma que M09 es dueño del calendario interno y de la mesa de entradas, y que T11 aporta la agenda unificada, la numeración y el expediente formal?
- **Contexto:** el pedido de T11 incluye agenda y mesa de entradas "si M09 no la cubre". M09 ya la cubre como caso `deskEntry`.
- **Opciones:**
  - A) M09 es dueño de los datos y T11 aporta la proyección de agenda, la numeración, el expediente, la carátula y el acuse **(Recomendada)**.
  - B) T11 es dueño de la agenda completa, incluidos los eventos manuales.
  - C) La mesa de entradas pasa a T11 como módulo propio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-140, RF-WFL-212, RF-WFL-220; O2 y O10.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-08 — Delegaciones: duración y alcance
- **Pregunta:** ¿Cuál es la duración máxima de una delegación, y si puede delegarse la decisión de un comité?
- **Opciones:**
  - A) Hasta 90 días, con límite de importe ≤ al del delegante y sin delegar votos de comité ni consejo **(Recomendada)**.
  - B) Sin tope, con renovación manual.
  - C) Hasta 30 días y solo para aprobaciones de un paso.
- **Impacto si no se responde:** se asume A (PRM-WFL-031 = 90).
- **Bloquea:** RF-WFL-118; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-09 — Qué pasa cuando vence un paso de aprobación
- **Pregunta:** ¿Qué acción por defecto se aplica cuando vence el SLA de un paso?
- **Contexto:** expirar en silencio deja operaciones sin resolver; aprobar en forma automática no es aceptable.
- **Opciones:**
  - A) Escalar al supervisor del aprobador y avisar al solicitante; nunca aprobar automáticamente **(Recomendada)**.
  - B) Sumar un aprobador alternativo del mismo rol.
  - C) Expirar y obligar a pedir de nuevo.
- **Impacto si no se responde:** se asume A (PRM-WFL-028 = `escalate`).
- **Bloquea:** RF-WFL-101; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-10 — Días hábiles o corridos en los SLA
- **Pregunta:** ¿Los SLA por defecto se cuentan en días hábiles o corridos, y con qué calendario?
- **Contexto:** ProCoop usaba días corridos (`DIAS_VENCE`). Algunos plazos regulados (por ejemplo, la constancia de baja en 24 h) son corridos.
- **Opciones:**
  - A) Hábiles con el calendario de T04 por defecto, y corridos cuando la norma lo exige, marcado en la política **(Recomendada)**.
  - B) Corridos siempre, como ProCoop.
  - C) Hábiles siempre.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-100, PRM-WFL-020; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-11 — Documentos visibles para el socio
- **Pregunta:** ¿Qué tipos documentales ve el socio en "Mis documentos" por defecto?
- **Opciones:**
  - A) Comprobantes emitidos, contratos y convenios firmados, constancias de trámite y documentos que el propio socio subió; nunca notas internas ni documentos de verificación **(Recomendada)**.
  - B) Solo comprobantes y constancias.
  - C) Todo lo vinculado a su cuenta, salvo lo que se marque interno.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-162; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-12 — Convergencia del SLA de M09 con el motor de T11
- **Pregunta:** ¿M09 deja su `crm:sla-monitor` y usa el motor de SLA de T11?
- **Contexto:** dos motores de SLA producen avisos dobles y cálculos distintos de días hábiles.
- **Opciones:**
  - A) Un solo motor en T11 desde O2; M09 sigue publicando EVT-CRM-06/07, que deriva de EVT-WFL-020/021 **(Recomendada)**.
  - B) M09 conserva su motor para casos y T11 para trámites y aprobaciones.
  - C) M09 adopta el motor y deja de publicar sus eventos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** JOB-CRM-01, JOB-WFL-04; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-13 — Huecos en la numeración
- **Pregunta:** ¿Qué secuencias deben ser sin huecos?
- **Contexto:** sin huecos exige bloqueo en la transacción y limita la concurrencia. Los comprobantes fiscales lo exigen; las tareas no.
- **Opciones:**
  - A) Sin huecos en comprobantes, recibos, actas, mesa de entradas y expedientes formales; con huecos en el resto **(Recomendada)**.
  - B) Sin huecos en todo.
  - C) Que cada tenant decida por secuencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-187, PRM-WFL-063; O0.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-14 — Eventos públicos para terceros
- **Pregunta:** ¿Qué tipos del catálogo se exponen a terceros por webhooks de T10?
- **Opciones:**
  - A) Un subconjunto curado sin datos personales (factura emitida, pago confirmado, estado de trámite, interrupción de servicio), en O11 **(Recomendada)**.
  - B) Todos los eventos del tenant con filtro por permiso.
  - C) Ninguno hasta tener un caso de negocio.
- **Impacto si no se responde:** se asume C hasta O11.
- **Bloquea:** RF-WFL-014, JOB-BIA-14; O11.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-15 — Fuentes de la bandeja unificada
- **Pregunta:** ¿Qué pendientes de otros módulos entran en la bandeja del empleado desde O1?
- **Opciones:**
  - A) Desde O1: tareas, aprobaciones, autorizaciones de T02 y excepciones de corridas. Desde O2: casos de M09 y OT de M10. Más adelante, el resto **(Recomendada)**.
  - B) Todas las fuentes desde O1.
  - C) Solo tareas y aprobaciones de T11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-130; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-16 — Feed iCal de la agenda
- **Pregunta:** ¿Se ofrece un feed iCal privado de la agenda para que el empleado la vea en su calendario personal?
- **Contexto:** es cómodo, pero saca información de la plataforma.
- **Opciones:**
  - A) Deshabilitado por defecto; habilitable por tenant, sin datos de socios en el título **(Recomendada)**.
  - B) Habilitado para todos.
  - C) No se ofrece.
- **Impacto si no se responde:** se asume A (PRM-WFL-057 = false).
- **Bloquea:** RF-WFL-144; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-17 — Correo interno PROMAIL
- **Pregunta:** ¿Se migra el historial de `PROMAIL` y se reemplaza por comentarios con menciones?
- **Opciones:**
  - A) Se reemplaza por comentarios y menciones; el historial se migra solo si el tenant lo pide (últimos 12 meses) **(Recomendada)**.
  - B) Se mantiene un correo interno equivalente.
  - C) Se descarta sin migrar.
- **Impacto si no se responde:** se asume A sin migración.
- **Bloquea:** RF-WFL-139; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-18 — Quién reprograma los jobs
- **Pregunta:** ¿El administrador del tenant puede cambiar el horario de los jobs?
- **Opciones:**
  - A) Sí, solo la hora y los días de los jobs `tenantSchedulable`, dentro de la ventana de plataforma **(Recomendada)**.
  - B) Solo T-SOP de plataforma.
  - C) Libre, incluida la cola.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-023; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-19 — Dueño único de los jobs duplicados
- **Pregunta:** ¿Se aceptan los dueños propuestos en §12.9 para los 22 grupos de jobs duplicados o convergentes?
- **Opciones:**
  - A) Sí, y cada anexo afectado elimina o convierte su job en el siguiente ciclo de revisión **(Recomendada)**.
  - B) Se mantienen los duplicados y se desactiva uno por configuración.
  - C) Se decide caso por caso al implementar.
- **Impacto si no se responde:** se asume A; hasta corregir los anexos, el catálogo de `jobDefinitions` registra solo el job del dueño.
- **Bloquea:** CTR-WFL-07; O0.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-20 — Comparación contra fuentes oficiales
- **Pregunta:** ¿Qué fuentes oficiales se consultan para validar datos en los trámites, y si una diferencia bloquea?
- **Contexto:** ProCoop comparaba documentos contra CiDi (`COMPARAR_DOCUMENTO`). Cada fuente necesita convenio y conector de T06.
- **Opciones:**
  - A) Padrón de ARCA desde O2 y otras fuentes (identidad provincial o nacional) a demanda del tenant; una diferencia marca el paso para revisión, no bloquea **(Recomendada)**.
  - B) Ninguna fuente automática; revisión manual.
  - C) Bloquear el trámite ante cualquier diferencia.
- **Impacto si no se responde:** se asume A con solo ARCA.
- **Bloquea:** RF-WFL-094; O2.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-21 — Importe de referencia para los tramos de aprobación
- **Pregunta:** ¿Los tramos por monto se evalúan sobre el importe bruto (con impuestos) o el neto?
- **Opciones:**
  - A) Bruto, que es lo que sale de caja, con opción de neto por tipo de operación **(Recomendada)**.
  - B) Neto siempre.
  - C) Que el tenant lo decida para todas las políticas.
- **Impacto si no se responde:** se asume A (PRM-WFL-029 = `gross`).
- **Bloquea:** RF-WFL-110, RF-WFL-114; O1.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-22 — Destino de `responsibleAreaId`
- **Pregunta:** ¿A qué colección apunta `responsibleAreaId` en los nodos de workflow (§7.4) y en los expedientes (§7.11)?
- **Contexto:** T05 §7.2 no declaraba el destino de las áreas responsables genéricas; T11 dejaba dos opciones (PA 11 del pendiente de cierre de la corrección de inconsistencias).
- **Opciones:**
  - A) `crmAreas` de M09, que ya modela las áreas que atienden trámites y casos **(Recomendada)**.
  - B) `workAreas` de M16.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.4 y §7.11 (`responsibleAreaId`); O2.
- **Estado:** Asumida (DEC-072), opción A. Aplicada en §7.4 y §7.11 el 5-11-2026.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —

### PA-WFL-23 — Cierre de residuales: nombres de eventos, alias con un solo canónico y máquinas de estado
- **Pregunta:** ¿cómo se cierran los residuales de T11: los tipos de evento fuera de la convención `&lt;mod>.&lt;agregado>.&lt;hecho>` (INC-06-11), los alias de §12.4 y §12.4.1 que resuelven a más de un canónico, las máquinas de estado descritas solo en texto y la tabla combinada de `formDefinitions`/`formVersions`?
- **Contexto:** `docs/entregables-analisis-diseno/06a-*.md` §7 (INC-06-11: 31 tipos en 24 eventos con guiones o cuatro segmentos, de T06 y M17) y `19-catalogo-eventos.md` (24 alias con varios canónicos). Cierre de residuales del 5-11-2026 (`_trabajo/residuales-instrucciones.md`, categorías 1, 3, 4, 5 y 6).
- **Opciones:**
  - A) Renombrar en el catálogo de §12.3 (guiones a camelCase; cuatro segmentos uniendo el 2.º y el 3.º en camelCase), registrar el nombre viejo como alias en §12.4, dejar un solo canónico por alias (el resto de los casos se suscribe directamente al canónico) y pasar a tabla todas las máquinas de §8 **(Recomendada)**.
  - B) Mantener los nombres actuales y los alias múltiples — el chequeo de CI (CTR-WFL-03) no puede resolver un alias a un único tipo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §12.3 (EVT-INS-08 a 13 y 21; EVT-INT-01, 03, 06 a 17, 20, 22 y 23), §12.4, §12.4.1, §8; O0 a O2 (registro de `eventTypes`).
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026:
  - 35 nombres de evento renombrados en §12.3 (24 filas EVT), con su alias en §12.4; M17 (productor de EVT-INS), T06 (productor de EVT-INT) y los consumidores (M06, M08, M10, M15, M18, M19, T09, T12) deben adoptar el nombre nuevo.
  - 24 alias con un solo canónico: 17 de §12.4 (25 filas pasan a "retirado como alias") y 7 de §12.4.1 (CNC-WFL-001, 004, 005, 009, 049, 083 y 089).
  - §8: tablas de transición para §8.3, §8.5, §8.7, §8.8, §8.9 y §8.10; subtítulos de §8.11 como encabezados 8.11.1 a 8.11.14; nuevas 8.11.15 (versiones de workflow, plantilla y formulario) y 8.11.16 (`documentVersions.scanStatus`); `operationTypes` no tiene estado.
  - §7: tablas propias de `formDefinitions` y `formVersions`; nombres con rol de T05 §7.2 (`resultStoredFileId`, `thumbnailStoredFileId`, `previewStoredFileId`, `signatureImageStoredFileId`, `signatureProfileId`) y `numberingSequenceId` en EVT-WFL-040; `sourceModule` y `subjectType` declarados como códigos, no referencias.
  - API-WFL-16, 64 y 65 con `public: true` (RF-IAM-061).
  - CU-ARQ-01 queda con dueño T11 (decisión del coordinador del 5-11-2026); T01 renumera el suyo.
  - Ya no bloquea.

- **Opción elegida:** —
- **Ampliación:** —
- **Respondido:** —
