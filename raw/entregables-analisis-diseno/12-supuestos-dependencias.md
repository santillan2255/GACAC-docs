# Registro de supuestos y dependencias externas — GoodApps Cooperativas

| Campo | Valor |
|---|---|
| Proyecto | GoodApps Cooperativas — plataforma SaaS multitenant que reemplaza a ProCoop |
| Documento | `12-supuestos-dependencias.md` |
| Artefacto del índice | 1.6 Registro de supuestos y dependencias externas (`00-INDICE.md`) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` (§12, §15, §18); `01-registro-decisiones.md` (DEC-001 a DEC-088); `02-preguntas-abiertas.md` (516 PA); `03-plan-de-olas-y-prompts.md` (§1, §16); `05-registro-huecos.md`; anexos T04, T05, T06 (fichas FI-INT-01 a FI-INT-115), T07, M04, M08, M14 y demás anexos citados |
| Prevalencia | Este documento deriva de la especificación y no la reemplaza. Ante cualquier diferencia prevalecen la especificación maestra, sus anexos y el registro de decisiones. |
| Documentos relacionados | `09-riesgos-y-raci.md` (registro de riesgos RSK, matriz RACI y Parte D "Supuestos y dependencias clave", que este documento amplía); `13-plan-validacion-cliente.md` (artefacto 1.7, donde se validan estos supuestos) |

## Control de versiones

| Versión | Fecha | Descripción del cambio | Elaborado por (rol) |
|---|---|---|---|
| 1.0 | 05-11-2026 | Versión inicial: 57 supuestos, 55 dependencias externas y resumen de lo que la cooperativa debe conseguir antes de cada ola. | Equipo de producto y desarrollo |

## Aprobaciones

| Rol | Alcance de la aprobación | Estado |
|---|---|---|
| Gerencia de la cooperativa piloto (Laguna Larga) | Registro completo; en especial la Parte C (qué conseguir antes de cada ola) | Pendiente |
| Contador | Supuestos fiscales, contables y de migración de saldos | Pendiente |
| Asesor legal | Supuestos normativos (SUP-040 a SUP-047, SUP-022, SUP-024, SUP-031) y dependencias normativas | Pendiente |
| Responsable de sistemas de la cooperativa | Dependencias técnicas, credenciales y accesos | Pendiente |
| Equipo de producto y desarrollo | Contenido completo | Pendiente |

> **Convenciones.** Los responsables se identifican por **rol genérico** (catálogo de interesados de `09-riesgos-y-raci.md`, Parte A), nunca por nombre de persona. No se transcriben credenciales, números de convenio ni datos personales: solo los **nombres** de las credenciales tal como figuran en T06 (los valores viven en la bóveda, DEC-074). La cooperativa piloto es **Laguna Larga** (`LAG`, DEC-088); de su base relevada `PR_LAG_DEMO` solo se toma configuración, nunca datos personales. Los recuentos son por búsqueda textual sobre la especificación al 05-11-2026.

## Índice

- Parte A — Registro de supuestos
  - A.1 Estados y reglas del registro
  - A.2 Recuento de PA asumidas y marcas `[VERIFICAR]` por anexo
  - A.3 Registro
- Parte B — Registro de dependencias externas
  - B.1 Tipos y reglas
  - B.2 Registro
  - B.3 Correspondencia con `09-riesgos-y-raci.md`
- Parte C — Qué debe conseguir la cooperativa antes de cada ola
- Parte D — Observaciones sobre las fuentes

---

## Parte A — Registro de supuestos

Un **supuesto** es una condición que el proyecto da por cierta para avanzar sin haberla confirmado con la cooperativa. Surge de tres orígenes: (1) las preguntas abiertas no consultadas, que rigen con su opción recomendada por la regla general **DEC-072** (política DEC-047); (2) los parámetros con valor por defecto que requieren validación legal (`05-registro-huecos.md`); y (3) las marcas `[VERIFICAR]` de los anexos, que señalan datos relevados en la base de referencia `PR_LAG_DEMO` pendientes de confirmar con datos reales.

Los **riesgos** derivados de estos supuestos no se repiten aquí: se gestionan en `09-riesgos-y-raci.md`, Parte C, y se citan por su ID (RSK-xxx).

### A.1 Estados y reglas del registro

| Estado | Significado |
|---|---|
| **Asumido** | Rige la opción recomendada o el valor por defecto; pendiente de validación. Es el estado inicial de todos los supuestos de esta versión. |
| **En validación** | Está en la agenda de una sesión del plan de validación (`13-plan-validacion-cliente.md`). |
| **Validado** | La cooperativa lo confirmó en un acta. Si era una PA, pasa a `Respondida (DEC-xxx)` en `02-preguntas-abiertas.md` con una DEC nueva (DEC-089 en adelante). |
| **Invalidado** | La cooperativa lo rechazó. Se registra la DEC con la opción elegida y se ajustan el anexo, el parámetro y, si cambia la ola, el plan de olas; se revisa el riesgo asociado en `09`. |

Reglas:

1. Un supuesto que bloquea una ola debe estar **Validado** (o explícitamente aceptado como riesgo por la Gerencia) antes de iniciar esa ola. La ola de cada RF es la de la matriz ola × anexo (`03-plan-de-olas-y-prompts.md` §16).
2. Las PA asumidas ya están implementadas como opción configurable o parámetro (maestra §16; `05-registro-huecos.md`, encabezado), de modo que invalidar un supuesto se resuelve, en la mayoría de los casos, por configuración y no por rediseño.
3. Los parámetros con validación legal no se habilitan en producción con el valor por defecto sin el dictamen del asesor legal (`05-registro-huecos.md`, variante "requiere validación legal").

### A.2 Recuento de PA asumidas y marcas `[VERIFICAR]` por anexo

`02-preguntas-abiertas.md` registra **516 preguntas**: **93 respondidas** por el solicitante, **423 asumidas** con la opción recomendada (DEC-072) y 1 reemplazada (PA-CFG-05 → PA-FIS-18). El anexo M02 no tiene PA asumidas: sus 19 preguntas fueron respondidas (DEC-011 a DEC-033, DEC-082 a DEC-084).

Las marcas `[VERIFICAR]` suman **522 ocurrencias en los anexos** (y 8 más en la maestra, el registro de decisiones, el de preguntas, la matriz de trazabilidad y la guía de redacción). El recuento incluye las menciones históricas que quedaron como "antes `[VERIFICAR]`" en filas ya resueltas, por lo que es una cota superior de lo pendiente.

| Anexo | PA asumidas (DEC-072) | `[VERIFICAR]` | Anexo | PA asumidas (DEC-072) | `[VERIFICAR]` |
|---|---|---|---|---|---|
| M01 PER | 10 | 24 | T01 PLA | 8 | 3 |
| M02 CAT | 0 | 7 | T02 IAM | 15 | 10 |
| M03 MED | 12 | 19 | T03 UXD | 17 | 1 |
| M04 TAR | 19 | 43 | T04 CFG | 12 | 20 |
| M05 FAC | 15 | 17 | T04b parte 1 | 4 | 0 |
| M06 FIS | 15 | 10 | T04b parte 2 | 5 | 20 |
| M07 COB | 14 | 20 | T04b parte 3 | 3 | 8 |
| M08 MOR | 20 | 31 | T04b parte 4 | 6 | 10 |
| M09 CRM | 15 | 1 | T05 DAT | 2 (además resueltas por DEC-087) | 33 |
| M10 TEC | 14 | 3 | T06 INT | 15 | 43 |
| M11 VEN | 10 | 3 | T07 MIG | 16 | 18 |
| M12 CMP | 15 | 3 | T08 NFR | 16 | 30 |
| M13 STK | 9 | 5 | T09 COM | 14 | 2 |
| M14 TES | 16 | 17 | T10 BIA | 16 | 3 |
| M15 CON | 16 | 29 | T11 WFL | 18 | 6 |
| M16 SUE | 14 | 34 | T12 parte 1 | 0 | 0 |
| M17 INS | 9 | 28 | T12 parte 2 | 0 | 5 |
| M18 SOC | 14 | 5 | | | |
| M19 POR | 19 | 11 | **Total** | **423** | **522** |

Lectura: los anexos con más supuestos sin confirmar son los del **motor económico** (M04, M08, M15, M16), **integraciones** (T06) y **datos** (T05, T08). Las PA asumidas no se listan una por una: el registro A.3 las agrupa por tema y destaca las de impacto alto o medio. La lista completa está en `02-preguntas-abiertas.md` y en el §21 de cada anexo.

### A.3 Registro

Clasificación del impacto (propuesta de este entregable): **Alto** = invalidarlo cambia importes, obligaciones fiscales o legales, o demora un hito de ola o el corte; **Medio** = se corrige por configuración con retrabajo acotado; **Bajo** = ajuste de presentación o de operación.

#### Supuestos rectores del proyecto

| ID | Supuesto | Origen | Impacto si resulta falso | Ola afectada | Quién lo valida | Estado |
|---|---|---|---|---|---|---|
| SUP-001 | Las 423 PA no consultadas rigen con su opción recomendada hasta que la cooperativa las revise; cada una está implementada como opción configurable. | DEC-047, DEC-072; `02` (cierre del cuestionario); 09 SUP-01 | **Alto:** retrabajo de requisitos, datos o configuración si se rechaza una opción ya construida (RSK-003). | O0–O11 | Equipo de producto y desarrollo, con la Gerencia (revisión por ola) | Asumido |
| SUP-002 | Laguna Larga es la cooperativa piloto comercial y de migración, y la configuración de su base relevada `PR_LAG_DEMO` representa su operación real y la de toda cooperativa migrada con la misma configuración. | DEC-088 (reemplaza DEC-081); índice (supuesto transversal); 09 SUP-02 | **Alto:** si LAG no ratifica formalmente, las preguntas dirigidas "a la cooperativa piloto" quedan sin destinatario; si su operación difiere de lo relevado, hay que rehacer mapeos y reglas (RSK-007, RSK-012). | O1–O11 | Gerencia y Consejo de administración de LAG (ratificación); operador de plataforma (representatividad) | Asumido |
| SUP-003 | Internet se construye de punta a punta y se valida con **datos sintéticos** (tenant demo TEN-001); el hito de O6 no requiere socios reales de LAG. | DEC-005, DEC-088; maestra §15 | **Medio:** si LAG quisiera operar Internet con socios reales antes de O7, habría que adelantar credenciales de producción (Parte B) y una migración parcial que T07 no prevé. | O2–O6 | Gerencia | Asumido |
| SUP-004 | La primera migración real de LAG ocurre después de O7 (opera electricidad, gas y prepago) y el prepago está disponible al migrar. | PA-MIG-17 (opción A, ratificada por DEC-088); CTR-COB-21; PA-COB-15 | **Alto:** sin el subconjunto prepago listo (M03, M07, FI-INT-77) no se puede migrar LAG y se demora el corte comercial. | O5, O7, O11 | Gerencia; operador de plataforma (líder de migración) | Asumido |
| SUP-005 | El reemplazo de ProCoop es por etapas: primero el corte comercial (M01–M09); contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo, y la contabilidad oficial sigue en ProCoop mientras GoodApps contabiliza en un plan no oficial y concilia. | DEC-068, DEC-069; PA-MIG-03; 09 SUP-08 | **Alto:** doble carga e inconsistencias entre sistemas (RSK-013). | O5, O8, O11 | Contador | Asumido |
| SUP-006 | Profundidad del histórico: ejercicio en curso más 24 meses en estructuras tipadas, el resto consultable en `legacyRecords` y copia del origen conservada 10 años; el detalle de más de 36 meses se archiva con consulta diferida. | DEC-070, DEC-087 | **Medio:** si la cooperativa o un organismo exige más historia tipada, crece la carga de migración y el almacenamiento. | O1, O11 | Contador; asesor legal | Asumido |
| SUP-007 | Niveles de servicio (99,5 % mensual, RPO ≤ 15 min, RTO ≤ 4 h por tenant), perfil de capacidad (tenant estándar de 25.000 suministros) y meta de facturación masiva (50.000 suministros en 60 min o menos). | DEC-063, DEC-075, PA-NFR-04; 09 SUP-05, SUP-06, SUP-11 | **Medio:** recalibración de infraestructura y de los procesos masivos (RSK-028). | O4, O7 | Operador de plataforma; Gerencia | Asumido |
| SUP-008 | Alojamiento en AWS sa-east-1 con cláusulas contractuales de transferencia internacional y rol de GoodApps como prestador de servicios de tratamiento por cuenta de la cooperativa. | DEC-062, DEC-076; 09 SUP-10 | **Alto:** cambio de contrato o de región si la autoridad o la cooperativa lo objetan (RSK-006, RSK-020). | O0 | Asesor legal | Asumido |

#### PA asumidas agrupadas por tema (impacto alto y medio)

| ID | Supuesto | Origen | Impacto si resulta falso | Ola afectada | Quién lo valida | Estado |
|---|---|---|---|---|---|---|
| SUP-009 | **ARCA y numeración fiscal.** El CAEA se usa solo como contingencia; tras el corte se siguen usando los mismos puntos de venta con el último número consultado a ARCA; el padrón se consulta con A13 más constancia de inscripción al alta y al cambio, y se revalida cada 30 días proponiendo cambios con aprobación. | PA-FIS-01, PA-MIG-08, PA-FIS-10, PA-PER-05, PA-FIS-17 (M06, T07, M01) | **Alto:** trámites de puntos de venta nuevos, cambio del modo de emisión masiva o de la condición fiscal de los socios. | O4, O11 | Contador | Asumido |
| SUP-010 | **IIBB y tablas normativas.** Los padrones públicos los ingesta la plataforma y los que requieren credenciales del agente, cada tenant; las tablas normativas se adoptan de forma explícita; otras jurisdicciones se agregan como configuración; Libro IVA con criterio facturado en O4. | PA-FIS-18, PA-FIS-12, PA-CFG-10, PA-INT-24, PA-FIS-06 (M06, T04, T06) | **Medio:** carga operativa en la cooperativa o adelanto de jurisdicciones previstas para O8. | O4, O8 | Contador | Asumido |
| SUP-011 | **Regímenes regulatorios.** RG 3571 y RG 5746/2025 en O7; CESP para liquidaciones de servicios públicos en O7; ENACOM con informes vigentes; ERSeP y ENARGAS todos configurables priorizando los de la piloto; otros reguladores como mapeo genérico. | PA-FIS-07, PA-FIS-02, PA-FIS-13, PA-FIS-14, PA-CFG-P1-07 (M06, T04b) | **Medio:** adelantar informes si el regulador los exige antes de O7. | O7 | Contador; asesor legal | Asumido |
| SUP-012 | **Semántica del cálculo tarifario.** Reglas evaluadas sobre una foto previa con referencias explícitas; precios con 6 decimales, cantidades con 4 e importes con 2; redondeo mitad hacia arriba por línea e IVA por alícuota; fecha de referencia = período de prestación (lectura con prorrateo en medidos); un error de fórmula excluye la cuenta y detiene el lote sobre un umbral. | PA-TAR-01, PA-TAR-15, PA-NFR-21, PA-TAR-04, PA-TAR-18 (M04, T08) | **Alto:** diferencias de centavos o de importe en la corrida paralela y en la factura. | O4, O7 | Responsables de facturación; contador | Asumido |
| SUP-013 | **Diferencias con ProCoop en el paralelo.** Los errores conocidos de ProCoop se corrigen y la diferencia se clasifica como "corrección conocida"; el redondeo por coincidencia con el primer vencimiento replica ProCoop; tarifa por bloque con factor por días (migrados escalan cantidad); variación porcentual con base cero = "Nuevo". | PA-TAR-03, PA-TAR-07, PA-TAR-02, PA-BIA-11 (M04, T10) | **Alto:** si la cooperativa exige réplica exacta, el criterio de aprobación del paralelo (PA-MIG-02) cambia (RSK-010). | O4, O7, O11 | Responsables de facturación; Gerencia | Asumido |
| SUP-014 | **Operación de la facturación.** Una factura por contrato (agrupar solo por grupo); códigos de barras de la piloto más genéricos; se conservan los prefijos 40/41/42/43; los clientes migrados conservan su canal de entrega (sin dato, papel); solo se distribuyen comprobantes autorizados; los parámetros de ProCoop sin uso se catalogan y quedan "a validar". | PA-FAC-07, PA-FAC-08, PA-FAC-09, PA-FAC-20, PA-FAC-03, PA-CFG-P2-01, PA-CFG-07 (M05, T04, T04b) | **Medio:** ajustes de configuración y de diseño de factura. | O4 | Responsables de facturación | Asumido |
| SUP-015 | **Generación distribuida.** Configurable por régimen con compensación monetaria por defecto (Ley 27.424); balance neto como opción del régimen. | DEC-060; PA-TAR-14 (alineada por HUE-ELE-03 en M04) | **Medio:** cambio del régimen por defecto para usuarios-generadores de LAG. | O7 | Contador; asesor legal | Asumido |
| SUP-016 | **Cuenta corriente e imputación.** Una cuenta unificada por grupo de facturación; excedentes como saldo a favor; diferencia entre pagado y esperado se acepta, imputa y revisa; pago parcial en caja con permiso; rendiciones registradas por fecha de acreditación; comisión de pasarela no trasladada al socio. | PA-COB-02, PA-COB-04, PA-COB-05, PA-COB-07, PA-COB-10, PA-COB-17 (M07) | **Medio:** reglas de imputación y de conciliación a reconfigurar. | O5 | Responsables de tesorería; contador | Asumido |
| SUP-017 | **Canales de cobro de LAG.** SIRO se usa por archivo (publicación y rendición) y por API (botón, QR, consulta); para importes de ARS 100.000 o más se acuerda con el banco un código de barras extendido y mientras tanto se usan código electrónico y QR; los códigos ProCoop se resuelven hasta 180 días después del último vencimiento; todo aviso de pago por webhook se reconsulta. | PA-INT-11, PA-COB-16, PA-MIG-16, DEC-050, PA-INT-10 (T06, M07, T07) | **Alto:** pagos no identificados o rechazados en la red y cobranza demorada en el corte (RSK-017). | O5, O11 | Responsables de tesorería; responsable de sistemas | Asumido |
| SUP-018 | **Prepago.** M07 deja el cobro genérico en O5 y M03 adelanta solo el subconjunto prepago para la piloto; modalidad token y crédito en línea vía conector, empezando por el proveedor de la piloto. | PA-COB-15, PA-MED-04, CTR-COB-21 (M07, M03) | **Alto:** condición para migrar LAG (SUP-004). | O5, O7 | Jefe técnico; responsables de facturación | Asumido |
| SUP-019 | **Tesorería operativa.** Extractos por perfil genérico CSV/XLSX más los dos bancos principales de la piloto; conciliación que solo autoconfirma reglas 1:1 exactas si el tenant lo habilita; rendición con doble control (M07 cierra, Tesorería acepta); Interbanking por API de información y archivos de pago, con aplicación registrada por la cooperativa. | PA-TES-04, PA-TES-05, PA-TES-06, PA-TES-02, PA-INT-18 (M14, T06) | **Medio:** formatos bancarios adicionales o cambio del circuito de rendición. | O5, O8 | Responsables de tesorería | Asumido |
| SUP-020 | **PA-TES-17.** La diferencia de arqueo de una rendición que cubre varias entidades jurídicas se imputa a la entidad que indique el receptor (por defecto, la de mayor importe rendido), con asiento entre entidades si corresponde (M15 M-136). | PA-TES-17 (M14 §21; bloquea RN-TES-086); DEC-064, DEC-087; 09 SUP-09 | **Medio:** asientos entre entidades a corregir si el contador exige prorrateo (opción B) o entidad por defecto (opción C) (RSK-015). | O5 | Contador | Asumido |
| SUP-021 | **Mora del piloto Internet.** Instancias Candidato → Aviso → Intimación con preaviso → Suspensión → Baja por mora; interés simple diario; bajo el mínimo de recargo se cobra 0; interés en nota de débito asociada; sin afectación cruzada entre servicios; para reconectar se paga la deuda vencida del servicio afectado; cargos de notificación y reconexión deshabilitados por defecto. | PA-MOR-05, PA-MOR-01, PA-MOR-02, PA-MOR-04, PA-MOR-08, PA-MOR-11, PA-MOR-12 (M08) | **Alto:** cambia el circuito de corte y los importes de intereses del hito O6. | O6 | Gerencia; asesor legal | Asumido |
| SUP-022 | **Garantías legales del corte.** Preaviso mínimo con evidencia digital validado por servicio; bloqueo total del corte para electrodependientes y revisión con aprobación para establecimientos públicos, de salud y educación; ventanas de corte en días hábiles, sin viernes, vísperas ni feriados; evidencia mínima `delivered` en canales digitales y acuse físico en carta. | PA-MOR-06, PA-MOR-07, PA-MOR-10, PA-COM-05 (M08, T09) | **Alto:** cortes indebidos, reclamos y sanciones (RSK-004). | O6, O7 | Asesor legal | Asumido |
| SUP-023 | **Convenios e incobrables.** Caducidad del convenio a las 3 cuotas impagas o 60 días; se carga TNA y se muestran CFT y TEA; aceptación con OTP y firma presencial en tableta; previsión por antigüedad y castigo con doble aprobación sin borrar deuda; gastos judiciales solo con título. | PA-MOR-13, PA-MOR-15, PA-MOR-16, PA-MOR-17, PA-MOR-18 (M08) | **Medio:** reglas de convenio y contables a reconfigurar. | O6 | Contador; asesor legal | Asumido |
| SUP-024 | **Prescripción.** 24 meses para facturas periódicas de servicios y 60 meses para el resto, editable por tenant y servicio, con estado de validación que impide la corrida productiva hasta el dictamen. | DEC-052; PA-MOR-20; 09 SUP-04 | **Alto:** deudas dadas por prescriptas o reclamadas indebidamente (RSK-005). | O6 | Asesor legal | Asumido |
| SUP-025 | **Saldos y paralelo de migración.** Saldo de apertura documento por documento; intereses al corte recalculados con las tablas migradas y conciliados; contabilidad migrada como saldos de apertura más asientos del ejercicio en curso; paralelo de 2 ciclos consecutivos por servicio con 0 diferencias sin explicar; sincronización unidireccional ProCoop → GoodApps mientras ProCoop es maestro. | PA-MIG-05, PA-MIG-06, PA-MIG-09, PA-MIG-02, PA-MIG-03 (T07); 09 SUP-07, SUP-08 | **Alto:** cargadores a rehacer y corte demorado (RSK-010). | O4–O7 (ensayos), O11 | Contador; operador de plataforma (líder de migración) | Asumido |
| SUP-026 | **Calidad de los datos migrados.** Deduplicación asistida con aprobación humana; CUIT/DNI inválidos cargados como "documento a revisar" con bloqueo de factura A; domicilios normalizados con geocodificación sugerida; prevalece el modelo GIS `REDES_*`; de `TICKETS` se migran abiertos y 12 meses de cerrados. | PA-MIG-10, PA-MIG-11, PA-MIG-12, PA-MIG-13, PA-MIG-14 (T07) | **Medio:** cola de saneamiento mayor y demora de la carga (RSK-009). | O2–O11 | Operador de plataforma; jefe de atención | Asumido |
| SUP-027 | **Usuarios del portal anterior.** No se migran contraseñas: se migran usuarios, vínculos y adhesiones de CoopOnline y se activan por OTP; los enlaces viejos se redirigen 12 meses desde el corte; consulta de facturas sin login opcional con cuenta y verificador. | PA-MIG-07, PA-POR-03, PA-INT-17, PA-POR-02 (T07, M19, T06) | **Medio:** baja adopción del portal y carga en mostrador (RSK-027). | O2, O11 | Jefe de atención; responsable de sistemas | Asumido |
| SUP-028 | **Personas y cuentas.** La transferencia clona el contrato y deja el origen "no vigente"; el fallecimiento no corta servicios; exactamente una cuenta principal; fusión de duplicados con doble control y reversión por 30 días; datos mínimos: nombre, una identificación y un contacto; conservación por categoría con anonimización validada por asesoría legal. | PA-PER-07, PA-PER-08, PA-PER-09, PA-PER-10, PA-PER-11, PA-PER-14 (M01) | **Medio:** cambios de proceso en atención; PA-PER-14 requiere dictamen legal. | O2 | Jefe de atención; asesor legal | Asumido |
| SUP-029 | **Atención y plazos.** Catálogo base de tipos y motivos editable; las reglas de derivación solo proponen; SLA en horas hábiles del tenant con pausa esperando al socio; bot 24×7 y humanos en horario; un único motor de SLA en T11 desde O2. | PA-CRM-01, PA-CRM-02, PA-CRM-03, PA-CRM-08, PA-WFL-10, PA-WFL-12 (M09, T11) | **Medio:** reconfiguración de colas y plazos. | O2, O6 | Jefe de atención | Asumido |
| SUP-030 | **Seguridad y control interno.** Separación de funciones estática en modo advertencia con excepción aprobada y reporte al síndico; la plataforma no accede a datos operativos sin acceso temporal aprobado; SMS como segundo factor prohibido para administradores; suspensión de usuarios a los 90 días sin ingreso; aprobación del acceso de soporte según el nivel. | PA-IAM-04, PA-IAM-06, PA-IAM-13, PA-IAM-14, PA-PLA-05 (T02, T01) | **Medio:** si la sindicatura exige SoD estática bloqueante, cooperativas chicas pueden no tener personal suficiente. | O1 | Responsable de sistemas; sindicatura | Asumido |
| SUP-031 | **Protección de datos y conservación.** Tabla de conservación de T08 §10.3 como default parametrizable; aviso de incidentes a la cooperativa en 24 h o menos, informe preliminar en 72 h y final en 15 días; ensayos de migración con copia real solo en ambiente aislado autorizado; retención documental "a validar" sin purgar hasta confirmar; datos crudos de Google 30 días; seudonimización determinística irreversible para pruebas. | PA-NFR-06, PA-NFR-08, PA-NFR-19, PA-WFL-03, PA-CFG-03, PA-MIG-15 (T08, T11, T04, T07) | **Alto:** incumplimiento de la Ley 25.326 o pérdida de información exigible (RSK-006, RSK-024). | O1 en adelante | Asesor legal | Asumido |
| SUP-032 | **Mensajería y consentimiento.** SMS por agregador local de plataforma; correo de plataforma con dominio verificado por tenant (SPF/DKIM/DMARC); horario de no molestar 21:00–08:30; opt-in explícito para comunicaciones comerciales y comunitarias y consulta del Registro "No Llame"; retención de comunicaciones 2 años y de constancias 5 años. | PA-INT-06, PA-INT-07, PA-COM-06, PA-COM-07, PA-NFR-20, PA-COM-11 (T06, T09, T08) | **Medio:** cambio de proveedor o de reglas de envío (RSK-021). | O2 | Jefe de atención; asesor legal | Asumido |
| SUP-033 | **Contabilidad.** Contabilización en tiempo real en el ERP administrativo y resumen diario en facturación y cobranza masiva; evento sin cuenta configurada no bloquea el origen pero sí el cierre; marco de normas profesionales FACPCE para cooperativas (RT 24 y vigentes, marcado `[VERIFICAR]`) y requisitos INAES; ajuste integral por inflación al cierre; plan y reglas modelo validados por un contador. | PA-CON-01, PA-CON-02, PA-CON-06, PA-CON-07, PA-CON-15 (M15) | **Alto:** estados contables con un marco normativo no aceptado por el contador o el órgano de control. | O5, O8 | Contador | Asumido |
| SUP-034 | **Capital e institucional.** Suscripción al aprobar el ingreso con integración en cuotas; reembolso limitado al 5 % del capital integrado del último balance; elegibilidad del padrón solo por deuda de capital vencida sobre umbral; retorno de excedentes capitalizado por defecto; firma ológrafa escaneada con hash para actas. | PA-INS-01, PA-INS-04, PA-INS-07, PA-INS-11, PA-INS-08 (M17) | **Medio:** las reglas dependen del estatuto de cada cooperativa. | O5, O10 | Consejo de administración; asesor legal | Asumido |
| SUP-035 | **Sueldos.** GoodApps calcula aportes y genera LSD y SICOSS, y la presentación la hace la cooperativa; lenguaje de fórmulas propio con traductor; recibo con firma electrónica del empleado y digital del empleador; legajos 10 años (salud 5 años); SICORE único generado por M06. | PA-SUE-02, PA-SUE-03, PA-SUE-04, PA-SUE-10, PA-FIS-15 (M16, M06) | **Medio:** alcance de O9 y dependencia de firma digital (DEP-039). | O8, O9 | Contador; responsable de RRHH | Asumido |
| SUP-036 | **Técnica y campo.** Factibilidad vigente 90 días; firma de conformidad en pantalla con identificación del receptor y hash; conflictos offline los resuelve el supervisor de zona; stock rodante con reserva por modelo; comodato no devuelto a los 30 días con propuesta de cargo aprobada; dispositivos Android 9+ e iOS 16.4+. | PA-TEC-05, PA-TEC-07, PA-TEC-17, PA-STK-03, PA-STK-05, PA-NFR-13 (M10, M13, T08) | **Medio:** reemplazo de dispositivos o cambio del circuito de comodato (RSK-029). | O3 | Jefe técnico | Asumido |
| SUP-037 | **Medición de LAG.** Estimación: promedio de 6 períodos → mismo mes del año anterior → promedio de categoría → declarado o mínimo; tope de 2 estimaciones consecutivas; contrato genérico de telemedición más importación por archivo y 1–2 conectores de la piloto; se migran lecturas y consumos completos y fotos de 24 meses. | PA-MED-02, PA-MED-07, PA-MED-12, PA-MED-13, PA-INT-14 (M03, T06) | **Alto:** LAG opera servicios medidos; un método distinto cambia consumos facturados y el paralelo. | O7 | Jefe técnico; responsables de facturación | Asumido |
| SUP-038 | **Servicios sociales y datos sensibles.** Salud e internaciones solo como registro administrativo sin datos clínicos; banco de sangre sin grupo ni diagnóstico; datos de salud cifrados por campo; portabilidad numérica "no aplica" por defecto; controles de calidad del agua habilitables por concesión; venta del derecho de sepultura como ingreso del período. | PA-SOC-01, PA-SOC-03, PA-MIG-19, PA-TEC-19, PA-TEC-20, PA-CON-17 (M18, T07, M10, M15) | **Medio:** si la cooperativa requiere datos clínicos, cambia el alcance y la evaluación de impacto (RSK-023). | O7, O10 | Asesor legal; contador; responsable de servicios sociales | Asumido |
| SUP-039 | **Red del piloto Internet.** Los sistemas de red son MikroTik, Radius y SmartOLT con aprovisionamiento automático asíncrono y respaldo manual. El uso de MikroTik en LAG figura "a confirmar" en T06. | DEC-041, DEC-042; FI-INT-79 a FI-INT-81 | **Medio:** conector adicional si los equipos o versiones difieren (RSK-018). | O3 | Jefe técnico | Asumido |

#### Parámetros con valor por defecto que requieren validación legal

Los 8 huecos de `05-registro-huecos.md` resueltos con "parámetro con default propuesto; requiere validación legal". Riesgo asociado: RSK-004 (`09`).

| ID | Supuesto | Origen | Impacto si resulta falso | Ola afectada | Quién lo valida | Estado |
|---|---|---|---|---|---|---|
| SUP-040 | El renglón de aporte de capital en la factura del servicio es **no gravado y se expone dentro de la factura** (`PRM-FIS-122` `fis.capitalContribution.exposure` = `untaxedInInvoice`). | HUECO-CAP-04; M06 RF-FIS-161, RN-FIS-124; DEC-061 | **Alto:** comprobantes con exposición fiscal incorrecta ante ARCA. | O4 | Contador; asesor legal | Asumido |
| SUP-041 | Los plazos de respuesta de reclamos TIC por motivo siguen la plantilla ENACOM de plataforma (Res. 733/2017) (`PRM-CRM-135` `crm.sla.enacomTargets`, plantilla `PRM-CRM-132`). | HUE-INT-03; M09 RF-CRM-258 | **Alto:** incumplimiento de plazos regulados en el primer servicio construido (Internet). | O2 | Asesor legal; jefe de atención | Asumido |
| SUP-042 | Protocolo de emergencias de gas: guardias con tiempo de aceptación (`PRM-TEC-152` `onCall.acceptanceMinutes`, `PRM-TEC-153`, `PRM-TEC-154`) y SLA de reclamos de seguridad GAS de 10/60/240 minutos (`PRM-CRM-133` `crm.sla.safetyTargets`). | HUE-GAS-05; M10 RF-TEC-231 a RF-TEC-233; M09 RF-CRM-260 | **Alto:** riesgo para la seguridad de las personas y sanciones del regulador; validar con la distribuidora y el regulador. | O7 | Asesor legal; jefe técnico | Asumido |
| SUP-043 | La mora de agua admite restricción de caudal con un mínimo vital de 50 litros por persona y día (`PRM-MOR-201`, modo `restricted`). | HUE-AG-02; M08 RN-MOR-139, RN-MOR-085 | **Alto:** restricción contraria al marco de la concesión. | O7 | Asesor legal | Asumido |
| SUP-044 | Las ventanas de corte de electricidad usan una plantilla de plataforma ERSeP en estado `toValidate` (días, horarios y umbrales climáticos) (`PRM-MOR-206`). | HUE-ELE-05; M08 RN-MOR-145, RF-MOR-221, RF-MOR-119; PA-MOR-10 | **Alto:** cortes fuera de la ventana permitida en el servicio principal de LAG. | O7 | Asesor legal | Asumido |
| SUP-045 | La suspensión por mora de telefonía es bloqueo saliente conservando entrantes y números de emergencia siempre habilitados (`PRM-MOR-199`, modo `restricted`). | HUE-TEL-04; M08 RN-MOR-137 | **Alto:** bloqueo indebido de llamadas de emergencia. | O10 | Asesor legal | Asumido |
| SUP-046 | La suspensión por mora de TV es restringida a la grilla mínima del paquete definido en M02 (`PRM-MOR-200`, modo `restricted`; RN-CAT-079). | HUE-TV-03; M08 RN-MOR-138 | **Medio:** grilla mínima no admitida por la norma o por los contratos de señales. | O10 | Asesor legal | Asumido |
| SUP-047 | La cobertura social se suspende a los 3 meses impagos (`PRM-MOR-204`, deshabilitado por defecto) y la rehabilitación tiene una carencia de 30 días (`PRM-SOC-052`). | HUECO-SEP-01; M08 RN-MOR-143; M18 RF-SOC-032, RN-SOC-054 | **Alto:** prestaciones negadas o concedidas en contra del reglamento del servicio de sepelio. | O10 | Asesor legal; responsable de servicios sociales | Asumido |

#### Marcas `[VERIFICAR]` de migración e integración de mayor impacto

| ID | Supuesto | Origen | Impacto si resulta falso | Ola afectada | Quién lo valida | Estado |
|---|---|---|---|---|---|---|
| SUP-048 | `DEUDARED` guarda solo la deuda publicada a la red por cuenta y se migra a `agencyPublishedDebts`; el saldo de redondeo lo recalcula M04. Si el perfilado encuentra arrastres de redondeo, el cargador separa esas filas por `DEUDARED_TIPO` hacia `roundingCarryEntries`. | T07 §19 (§7, fila `DEUDARED`) `[VERIFICAR]`; CTR-DAT-42; COL-COB-26 | **Alto:** saldos de redondeo perdidos o duplicados y deuda publicada a Red Link inconsistente (RSK-008). | O5, O11 | Operador de plataforma (líder de migración); responsables de tesorería | Asumido |
| SUP-049 | `SERSOC_PRODUCTOS` contiene los productos entregados en comodato con un servicio; las filas del banco ortopédico se cargan como préstamos de M18 con fechas de entrega, devolución prevista y devolución real. | T07 §19 (§1, fila `SERSOC_PRODUCTOS`) y §19.33 `[VERIFICAR]` con datos; HUECO-OTR-01 | **Medio:** equipos en comodato o préstamos mal clasificados y cargos por atraso incorrectos. | O3, O10 | Operador de plataforma; responsable de servicios sociales | Asumido |
| SUP-050 | Las sucursales del tenant provienen de `EMPRESAS`/`CAJASJP` de ProCoop y se migran a `branches`; los puestos (`EQUIPOS`) a `workstations`. La colección se crea en O0 pero su migración figura en O11: hasta entonces las sucursales se cargan a mano. | T04 RF-CFG-142 `[VERIFICAR origen]`; T05 COL-CFG-42 `[VERIFICAR]`; T04 §19 | **Medio:** sucursales, cajas y puntos de venta con entidad jurídica mal asignada; desfasaje entre la carga manual de O0 y la migración. | O0, O5, O11 | Responsable de sistemas; contador | Asumido |
| SUP-051 | Las varias "empresas" de ProCoop (`EMPRESAS`, `SU_EMPRESAS`) se convierten en entidades jurídicas del mismo tenant y todo documento económico migrado tiene entidad resoluble. | T07 RN-MIG-002 `[VERIFICAR]` cooperativas con varias razones sociales; DEC-064 | **Alto:** rechazo bloqueante de documentos sin entidad (RSK-014). | O0, O4, O11 | Contador | Asumido |
| SUP-052 | Los pagos parciales históricos se reparten por servicio con `IT_PAGSO`; si ProCoop no discrimina el servicio, se prorratean por saldo con advertencia. | T07 RN-MIG-008 `[VERIFICAR]` con datos | **Medio:** saldos por servicio distintos de ProCoop. | O5, O11 | Contador | Asumido |
| SUP-053 | Las fórmulas embebidas de ProCoop se pueden traducir al lenguaje de fórmulas de GoodApps con revisión humana; las que contienen SQL no se ejecutan nunca. | T07 RN-MIG-048 `[VERIFICAR]` con datos reales; PA-TAR-11 | **Alto:** cargos tarifarios sin traducir que bloquean el paralelo (RSK-010). | O4, O7 | Responsables de facturación | Asumido |
| SUP-054 | Las facturas de la migración anterior a ProCoop se identifican por marca de usuario y se excluyen de los informes ENARGAS con `legacy.priorMigration`. | T07 RN-MIG-034 `[VERIFICAR]` | **Medio:** informes regulatorios de gas con datos incorrectos. | O7 | Operador de plataforma | Asumido |
| SUP-055 | Supuestos menores de mapeo: discriminador de stock en `TRANSFER`; columnas `PORC_INST_*` de `SERSOC_EXTRAS`; uso de `CTRLCNC`, `PRODPUES` y `TICKETS_HSBONIF`; conteo de 659 tablas del catálogo. | T07 §19 (filas citadas) y CTR-MIG-03, todas `[VERIFICAR]` | **Bajo:** se resuelven en el inventario y el perfilado (T07 F1, F2). | O3–O11 | Operador de plataforma | Asumido |
| SUP-056 | Integraciones cuyo uso en LAG está "a confirmar": sistema exacto de tokens prepago (FI-INT-77), telemedición (FI-INT-75), API de SIRO (FI-INT-37), débito directo por CBU (FI-INT-56), firma Encustody (FI-INT-89), significado de "LUA" en Rentas Córdoba (FI-INT-18), producto "Pagar" (FI-INT-54), vigencia del padrón A4 (FI-INT-08) y SITSA (FI-INT-87). | T06 (campo "Estado investigación" y `[VERIFICAR]` de cada ficha) | **Alto** para prepago y telemedición (condicionan SUP-004 y SUP-037); **Medio** para el resto. | O4, O5, O7, O10 | Responsable de sistemas; jefe técnico | Asumido |
| SUP-057 | La cooperativa tiene identificado quién custodia el certificado ARCA actual y su vencimiento; la plataforma genera clave y CSR o admite el PFX existente. | FI-INT-01 (pregunta a la cooperativa piloto); DEC-053 | **Alto:** sin certificado vigente no hay CAE (DEP-001). | O4 | Contador; responsable de sistemas | Asumido |

Total: **57 supuestos** (8 rectores, 31 de PA asumidas agrupadas, 8 de parámetros legales y 10 de `[VERIFICAR]` de migración e integración).

---

## Parte B — Registro de dependencias externas

Una **dependencia externa** es algo que el proyecto necesita de un organismo, proveedor o sistema fuera de su control. Por PA-INT-01 (respondida por DEC-020) las credenciales de **fiscal, bancos y pasarelas son propias del tenant**, y las de **correo, SMS, mapas e IA** son conexiones de plataforma reemplazables por las del tenant; esa regla determina quién gestiona cada dependencia. Por PA-INT-16, GoodApps mantiene cuentas de homologación de plataforma para desarrollo y cada tenant usa las suyas para la prueba previa a producción.

### B.1 Tipos y reglas

| Tipo | Significado |
|---|---|
| **Normativa** | Exigencia de un organismo (alta, homologación, formato oficial, padrón, informe). |
| **Técnica** | Acceso, credencial, API, equipo o formato de un sistema. |
| **Comercial** | Contrato, convenio o alta de servicio con un proveedor. |
| **Datos** | Información que debe entregar la cooperativa o un tercero (padrones, layouts, reglamentos, base de origen). |

Columna "Ola en que se necesita": se distingue el **ambiente de homologación** (necesario para construir y probar en la ola) de la **producción**. Como Internet se valida con datos sintéticos (DEC-088) y la primera migración real de LAG ocurre después de O7 (PA-MIG-17), la mayoría de las credenciales de producción recién se necesitan **antes del corte comercial de LAG**.

### B.2 Registro

#### Fiscal y tributario

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-001 | ARCA — WSAA (autenticación de servicios web) | Normativa, técnica | Certificado X.509 por entidad jurídica (CSR generado en la plataforma o PFX existente), alta del alias y delegación de los servicios web en el portal de ARCA; credencial `arcaCertificate` en bóveda. | FI-INT-01; DEC-053; PA-INT-03 | O4 (homologación); producción antes del corte comercial de LAG | Sin ticket de acceso no hay CAE ni padrón; hito O4 bloqueado (RSK-016). | Contador, con el responsable de sistemas |
| DEP-002 | ARCA — WSFEv1 (CAE) | Normativa, técnica | Puntos de venta habilitados para web service por entidad; continuidad de la numeración en los mismos puntos de venta al corte. | FI-INT-02; DEC-018, DEC-035, DEC-038; PA-MIG-08 | O4 (homologación); producción al corte comercial | Facturación sin autorizar; numeración discontinua. | Contador |
| DEP-003 | ARCA — CAEA y CESP | Normativa | Solicitud de CAEA por período si el tenant habilita la contingencia; régimen CESP para liquidaciones de servicios públicos. | FI-INT-03; PA-FIS-01, PA-FIS-02 | O4 (CAEA); O7 (CESP) | Sin contingencia ante caída de ARCA en lote masivo. | Contador |
| DEP-004 | ARCA — padrones A13, A5 y archivo de condición tributaria | Normativa, datos | Servicios `ws_sr_padron_a13` y `ws_sr_constancia_inscripcion` en el certificado; descarga del archivo público. | FI-INT-06, FI-INT-07, FI-INT-10; PA-FIS-10 | O4 (en O2 el alta funciona sin padrón) | Condición fiscal de socios y proveedores sin verificar. | Contador |
| DEP-005 | ARCA — regímenes informativos y constatación (Libro IVA Digital, SICORE, SIRE, Mis Comprobantes, WSCDC) | Normativa | Formatos vigentes y confirmación de qué presenta la cooperativa. | FI-INT-11 a FI-INT-15; PA-FIS-06 | O8 (Libro IVA criterio facturado en O4) | Presentaciones fuera de GoodApps durante O8. | Contador |
| DEP-006 | ARCA — Libro de Sueldos Digital, SICOSS / F.931, F.572 | Normativa | Formatos vigentes; tablas legales con vigencia. | FI-INT-16; PA-SUE-02; PA-CFG-P4-05 | O9 | Hito de O9 (liquidación con F.931 y LSD) bloqueado. | Contador; responsable de RRHH |
| DEP-007 | Rentas Córdoba — padrón de IIBB y Código de Validación Provincial | Normativa, datos | Acceso al padrón (descarga manual o autenticada, `rentasCbaUser`); CVP si la cooperativa lo imprime. | FI-INT-18, FI-INT-19; DEC-054 | O4 | Alícuotas o percepciones de IIBB erróneas. | Contador |
| DEP-008 | Otras jurisdicciones de IIBB (SIRCAR, ARBA, Santa Fe y demás) | Normativa | Credenciales y formatos solo si un tenant opera en esa jurisdicción. | FI-INT-20 a FI-INT-22; PA-INT-24 | O8 (cálculo de percepción en O4) | Sin presentación automática fuera de Córdoba. | Contador |
| DEP-009 | Municipios y terceros — tasas y conceptos por cuenta de terceros | Normativa, comercial | Convenios de cobranza por cuenta de terceros (bomberos, municipios, banco de sangre) con su política de mora y rendición. | FI-INT-23, FI-INT-32; DEC-083; RN-MIG-051 | O5 (rendición); O8 (retenciones municipales) | Conceptos de terceros sin respaldo; mora mal calculada (HUECO-TAS-02). | Gerencia; contador |

#### Reguladores y organismos

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-010 | Secretaría de Energía — subsidios y segmentación (RASE, Res. SE 493/25, gas SEF, Zona Fría) | Normativa, datos | Padrones de beneficiarios y acceso al portal del organismo si corresponde. | FI-INT-24; PA-TAR-10 | O7 | Tarifa subsidiada mal aplicada en electricidad y gas. | Responsables de facturación |
| DEP-011 | ERSeP (Córdoba) | Normativa, datos | Formatos de informes vigentes; cuadros tarifarios aprobados; ventanas de corte para validar `PRM-MOR-206`. | FI-INT-25; PA-FIS-14; HUE-ELE-05 | O7 | Informes regulatorios manuales; corte de energía sin ventana validada. | Contador; asesor legal |
| DEP-012 | ENARGAS | Normativa | Informes vigentes; validación de tiempos de emergencia de gas (`PRM-CRM-133`). | FI-INT-26; PA-FIS-14; HUE-GAS-05 | O7 | Informes de gas manuales; protocolo de emergencia sin validar. | Asesor legal; jefe técnico |
| DEP-013 | ENACOM | Normativa | Licencia TIC de la cooperativa; plazos de reclamos por motivo (Res. 733/2017) para validar `PRM-CRM-135`; informes vigentes. | FI-INT-27; PA-FIS-13; HUE-INT-03 | O2 (plazos); O7 (informes) | Plazos de reclamos de Internet sin validar desde el primer servicio. | Asesor legal; jefe de atención |
| DEP-014 | Secretaría de Energía / CAMMESA — informes | Normativa | Formatos vigentes. | FI-INT-28 | O7 | Informes manuales. | Contador |
| DEP-015 | Otros entes provinciales (EPRE, OCEBA y similares) | Normativa | Solo si se incorpora un tenant de otra provincia. | FI-INT-29; PA-CFG-P1-07 | O7 (bajo demanda) | Ninguno para LAG. | Gerencia del tenant que lo requiera |
| DEP-016 | INAES y FECESCOR | Normativa, datos | Plantilla del libro digital e informes INAES; formato de resúmenes de FECESCOR si la cooperativa la usa. | FI-INT-30, FI-INT-31; PA-INS-09; PA-FIS-16 | O8 (FECESCOR); O10 (INAES) | Informes institucionales fuera del sistema. | Consejo de administración; contador |
| DEP-017 | Registro de electrodependientes | Normativa, datos | Listado oficial o carga manual con respaldo; consulta automática como extensión. | FI-INT-110; PA-MOR-07 | O7 (antes de habilitar corte de energía) | Corte a un electrodependiente (RSK-004). | Jefe de atención; asesor legal |

#### Mayoristas de energía y gas

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-018 | Mayorista eléctrico (EPEC) — factura de compra de energía | Comercial, datos | Layout y canal de la factura del mayorista; medición de frontera para el control (M03 RF-MED-129). | FI-INT-33; HUE-ELE-01; M12 RF-CMP-149 a RF-CMP-151 | O8 | Costo de energía sin controlar contra la medición; asiento manual. | Contador; jefe técnico |
| DEP-019 | Distribuidora de gas — formularios y factura de abastecimiento | Comercial, datos | Formularios y canal vigentes de la distribuidora; layout de la factura de compra; usuario de portal si aplica. | FI-INT-114, FI-INT-115; HUE-GAS-04 | O7 (formularios); O8 (factura) | Habilitaciones de gas y balance de volumen manuales. | Jefe técnico; contador |

#### Cobranza: redes, pasarelas y bancos

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-020 | Red Link (LinkPagos) | Comercial, técnica | Convenio vigente de la cooperativa; acceso SFTP o portal (`redlinkSftpUser`, `redlinkSftpKey`); layout vigente. | FI-INT-35; DEC-015 | O5 (homologación); producción al corte comercial | Deuda no publicada y pagos de la red sin imputar (RSK-017). | Responsables de tesorería |
| DEP-021 | SIRO (Banco Roela) — archivos y API | Comercial, técnica | Convenio; acceso SFTP (`siroSftpUser`, `siroSftpKey`) y API (`siroApiUser`, `siroApiPassword`); acuerdo de código de barras extendido para importes de ARS 100.000 o más. | FI-INT-36, FI-INT-37; PA-INT-11; PA-COB-16 | O5 (homologación); producción al corte comercial | Canal principal de cobro de LAG sin operar. | Responsables de tesorería; responsable de sistemas |
| DEP-022 | Entes recaudadores vía SIRO (Pago Mis Cuentas, Rapipago, Pago Fácil) | Comercial | Confirmar que en LAG llegan vía SIRO y no por convenio directo. | FI-INT-38 a FI-INT-40 | O5 | Canal de cobro omitido si existe convenio directo. | Responsables de tesorería |
| DEP-023 | Pagos360 y Mercado Pago | Comercial, técnica | Alta comercial (en LAG no se usan, credenciales vacías) y credenciales (`pagos360ApiKey`; `mercadoPagoAccessToken`, `mercadoPagoWebhookSecret`). | FI-INT-43, FI-INT-44; DEC-015 | O5 (homologación de plataforma para construir); producción solo si la cooperativa los contrata | Pago online del hito O5 solo en homologación. | Gerencia; responsables de tesorería |
| DEP-024 | QR interoperable, DEBIN y otros entes | Comercial, técnica | Proveedor de servicios de pago (PSP) y credenciales; definición del producto "Pagar". | FI-INT-41, FI-INT-45, FI-INT-54 | O5 (extensión bajo demanda) | Canales adicionales no disponibles. | Responsables de tesorería |
| DEP-025 | Bancos recaudadores, débito directo por CBU y débito con tarjetas | Comercial, técnica | Acceso al canal bancario o de la procesadora (`bancoDebitoSftpUser`, `bancoDebitoSftpKey`) y layouts; sin guardar números de tarjeta. | FI-INT-42, FI-INT-56, FI-INT-57 | O5 | Débitos automáticos de los socios sin migrar. | Responsables de tesorería |
| DEP-026 | Bancos — extractos por archivo | Datos | Formatos de extracto de los dos bancos principales de la cooperativa. | FI-INT-60; PA-TES-04; DEC-059 | O5 | Conciliación bancaria manual. | Responsables de tesorería |
| DEP-027 | Interbanking | Comercial, técnica | Aplicación registrada por la cooperativa (`interbankingClientId`, `interbankingClientSecret`, `interbankingServiceCode`); archivos de pago con firma bancaria. | FI-INT-58, FI-INT-59; PA-INT-18; PA-TES-02 | O8 | Movimientos y pagos a proveedores fuera del sistema. | Responsables de tesorería |
| DEP-028 | Redes de cobranza — código de barras y línea de pago | Técnica, datos | Formato por red y número de convenio (no secreto) para cada código. | FI-INT-34; PA-FAC-08, PA-FAC-12 | O4 | Facturas no cobrables en redes. | Responsables de facturación |
| DEP-029 | Imprenta y distribución física de facturas | Comercial, técnica | Proveedor de impresión y canal de entrega (SFTP si aplica). | FI-INT-108 | O5 | Distribución en papel manual. | Responsables de facturación |
| DEP-030 | Cobranza fuera de oficina y puntos de venta remotos de prepago | Comercial, técnica | Lista de cobradores y puntos de venta; acuerdos con terceros si venden prepago. | FI-INT-107 | O5 (cobrador); O7 (prepago remoto) | Cobranza y venta de prepago en campo sin registro. | Responsables de tesorería |

#### Comunicaciones, identidad y geografía

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-031 | Correo transaccional y masivo | Comercial, técnica | Proveedor de plataforma o SMTP propio; dominio de envío verificado con SPF, DKIM y DMARC. | FI-INT-61; PA-INT-07; DEC-077 | O0–O2 | Notificaciones y OTP no entregados (RSK-021). | Operador de plataforma; responsable de sistemas (DNS) |
| DEP-032 | WhatsApp (Meta Cloud API; adaptador Trii) | Comercial, técnica | Cuenta de WhatsApp Business verificada y número de la cooperativa o del proveedor de plataforma (DEC-077); plantillas aprobadas por Meta; `waPhoneNumberId`, `waBusinessAccountId`, `waAccessToken`, `waAppSecret`. | FI-INT-63; DEC-055 | O2 | Canal omnicanal y avisos de mora sin WhatsApp. | Jefe de atención; responsable de sistemas |
| DEP-033 | SMS | Comercial, técnica | Agregador local de plataforma o conector propio del tenant (`smsApiKey`, `smsAccountId`). | FI-INT-64; PA-INT-06; DEC-077 | O2 | OTP y avisos solo por correo. | Operador de plataforma |
| DEP-034 | Notificaciones push | Técnica | Claves VAPID y cuenta de servicio de plataforma. | FI-INT-65 | O2 | PWA sin avisos push. | Operador de plataforma |
| DEP-035 | Google OIDC y CiDi (Ciudadano Digital Córdoba) | Técnica, normativa | Cliente OIDC de plataforma; alta de la aplicación en CiDi ante la provincia (`cidiAppId`, `cidiAppKey`) y habilitación por tenant con nivel mínimo 2. | FI-INT-67, FI-INT-68; DEC-067 | O1 (mecanismo); O2 (CiDi al publicar el portal) | Ingreso federado no disponible (RSK-027). | Responsable de sistemas |
| DEP-036 | Google Maps, Places y Georef | Comercial, técnica | Clave de plataforma restringida con cuota por tenant u opción de clave propia; Georef sin credencial. | FI-INT-69 a FI-INT-71; DEC-020, DEC-046 | O1 (Georef tablas); O3 (mapas y geocodificación) | Domicilios sin normalizar; sin mapa en agenda técnica. | Operador de plataforma |
| DEP-037 | GIS y catastro de la cooperativa | Datos | Archivos KML de redes y parcelas del catastro, si existen. | FI-INT-72, FI-INT-113; PA-MIG-13 | O3 | Factibilidad sin topología de red. | Jefe técnico |
| DEP-038 | Dominio propio de la cooperativa | Técnica | Delegación DNS para subdominio o dominio propio con certificado automático. | PA-POR-12, PA-UXD-02, PA-PLA-11 | O2 | Landing y portal solo en subdominio de plataforma. | Responsable de sistemas |

#### Red, medición, campo y hardware

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-039 | Proveedor de firma digital licenciado | Comercial | Elección del proveedor antes de O3 (Encustody u otro); contrato para recibos de sueldo y actas (`signatureApiKey`, `signatureWebhookSecret`). La firma electrónica con OTP es propia. | FI-INT-89; DEC-078; PA-INT-22 | Antes de O3 (elección); O8–O9 (uso) | Recibos y actas sin firma digital (RSK-019). | Equipo de producto y desarrollo; Gerencia |
| DEP-040 | Proveedor de IA (LLM) | Comercial, normativa | Proveedor con acuerdo de tratamiento y sin entrenamiento con datos; aceptación expresa del tenant. | FI-INT-90; DEC-056; PA-NFR-09 | O6 | IA de atención apagada; el flujo sigue sin ella (RSK-025). | Operador de plataforma; Gerencia (aceptación) |
| DEP-041 | Equipos de red ISP (MikroTik, RADIUS, SmartOLT) | Técnica | Accesos API por equipo (`mikrotikHost` en lista permitida, `mikrotikUser`, `mikrotikPassword`; `radiusApiUser`, `radiusApiKey`; `smartoltApiKey`), versiones y ambiente de prueba. | FI-INT-79 a FI-INT-81; DEC-041, DEC-042 | O3 | Aprovisionamiento solo manual (RSK-018). | Jefe técnico |
| DEP-042 | Telemedición, colectores y Mi Medidor | Técnica, comercial | Marca y sistema MDM de la cooperativa (`mdmUser`, `mdmPassword` o `mdmApiKey`); colectores si se conservan. | FI-INT-73, FI-INT-75, FI-INT-76, FI-INT-78; PA-INT-14 | O7 | Lecturas remotas solo por importación de archivo. | Jefe técnico |
| DEP-043 | Fabricante del sistema de medidores prepagos | Comercial, técnica | Protocolo de generación de tokens, credenciales (`prepaidVendorUser`, `prepaidVendorKey`) y módulo de seguridad del fabricante. | FI-INT-77; PA-MED-04; CTR-COB-21 | O7 (condición para migrar LAG) | LAG no puede migrar (SUP-004). | Jefe técnico; Gerencia |
| DEP-044 | Telefonía, TV y móvil revendida (centrales CDR, CAS, Claro/Personal) | Técnica, comercial | Formato de CDR y canal; acceso al sistema de acceso condicional; importador de móvil. Solo si la cooperativa presta esos servicios. | FI-INT-84 a FI-INT-86; PA-TEC-13, PA-TEC-14 | O10 | Telefonía y TV fuera del sistema. | Jefe técnico |
| DEP-045 | GPS / AVL de flota | Técnica, comercial | Proveedor y `avlApiKey`. | FI-INT-88; PA-SOC-07 | O10 | Despacho de cuadrillas sin posición. | Jefe técnico |
| DEP-046 | Hardware local: agente, impresoras térmicas, turnero, tótem, lectores | Técnica | Inventario de dispositivos por sucursal; emparejamiento del agente local. | FI-INT-91 a FI-INT-95; PA-INT-09, PA-CRM-14 | O10 (O5 si una sucursal exige impresión térmica de caja) | Caja sin ticket térmico; turnero fuera del sistema. | Responsable de sistemas |
| DEP-047 | Calendario de feriados nacionales y locales | Datos | Feriados nacionales (plataforma) y locales de la cooperativa. | FI-INT-106; PA-WFL-10 | O1 | SLA y ventanas de corte mal calculados. | Responsable de sistemas |

#### Sistema origen, infraestructura y asesoría

| ID | Dependencia | Tipo | Qué se necesita | Ficha / RF | Ola en que se necesita | Riesgo si falta | Responsable (rol) |
|---|---|---|---|---|---|---|---|
| DEP-048 | ProCoop — base de datos de origen y proveedor del sistema | Técnica, comercial, datos | Acceso temporal de solo lectura a la base del tenant (credencial en bóveda); copia para ensayos en ambiente aislado; acuerdo de convivencia y soporte con el proveedor de ProCoop hasta el corte administrativo. | FI-INT-97; T07 F1; DEC-068, DEC-070; PA-NFR-19 | O1 (herramienta base e inventario); O4–O7 (ensayos de cargadores); O11 (corte) | Migración no ensayada; convivencia sin soporte (RSK-009, RSK-011). | Responsable de sistemas; Gerencia (acuerdo con el proveedor) |
| DEP-049 | CoopOnline (portal anterior) | Datos, técnica | Exportación de usuarios, vínculos y adhesiones; control de los dominios de los enlaces impresos para redirigir 12 meses. | FI-INT-101; PA-POR-03; PA-INT-17 | O2 (mapeo); O11 (corte) | Socios sin acceso y enlaces rotos (RSK-027). | Responsable de sistemas |
| DEP-050 | ProCoop 6 / tablas DBF heredadas | Datos | Confirmar si existen históricos DBF en LAG. | FI-INT-105 | O11 | Histórico anterior no consultable. | Responsable de sistemas |
| DEP-051 | Liquidador de sueldos externo y sistema contable externo | Datos, técnica | Formato de exportación del liquidador vigente y del sistema contable, si existen. | FI-INT-99; DEC-058 | O8 | Importación de sueldos de O8 bloqueada. | Contador; responsable de RRHH |
| DEP-052 | Proveedor de nube (AWS sa-east-1), KMS y almacenamiento de objetos | Comercial, técnica | Contrato con cláusulas de transferencia internacional; clave maestra en KMS; almacenamiento y SFTP de plataforma. | FI-INT-102; DEC-004, DEC-062, DEC-074 | O0 | Sin ambientes para construir (RSK-020). | Operador de plataforma |
| DEP-053 | Asesoría legal de la cooperativa | Normativa | Dictámenes de los 8 parámetros (SUP-040 a SUP-047), prescripción (SUP-024), garantías del corte (SUP-022), conservación de datos (SUP-031) y contrato de encargo (DEC-076). | `05-registro-huecos.md`; DEC-052; PA-NFR-06 | Por ola, antes de cada habilitación (primera: O2) | Funcionalidad dependiente deshabilitada o en riesgo legal (RSK-004 a RSK-006). | Gerencia |
| DEP-054 | Contador de la cooperativa | Normativa, datos | Plan de cuentas y reglas de asiento; marco normativo contable; criterios de PA-TES-17, HUECO-CAP-04 y PA-CON-17; conciliación contra ProCoop. | PA-CON-06, PA-CON-15; PA-TES-17; DEC-069 | O4 (fiscal); O5 (núcleo contable) | Núcleo contable sin plan validado (RSK-013, RSK-015). | Gerencia |
| DEP-055 | Normativa interna y tarifaria de la cooperativa | Datos | Estatuto; reglamentos de servicios y de servicios sociales (sepelio, adherentes); cuadros tarifarios vigentes aprobados por el regulador o el municipio; resoluciones del consejo sobre capital y reembolso. | M04 (cuadros); M17 (PA-INS-04, PA-INS-07); M18 (HUECO-SEP-01, PA-SOC-04, PA-SOC-11) | O4 (tarifas de Internet); O5 (capital); O7 (tarifas medidas); O10 (social) | Configuración tarifaria e institucional sin respaldo. | Gerencia; Consejo de administración |

Total: **55 dependencias externas**. Fichas T06 no listadas por estar reemplazadas o descartadas: FI-INT-09, FI-INT-62, FI-INT-74, FI-INT-101 (reemplazada por M19; se lista en DEP-049 solo por la exportación), FI-INT-103 y FI-INT-104. Las pasarelas de extensión bajo demanda FI-INT-46 a FI-INT-53 entran en O11 salvo pedido de un tenant (DEC-015) y no se listan individualmente. FI-INT-98, FI-INT-100 y FI-INT-111 dependen solo de la plataforma (T10, T01).

### B.3 Correspondencia con `09-riesgos-y-raci.md`

`09-riesgos-y-raci.md`, Parte D, resume los supuestos y dependencias clave vinculados a riesgos. Este registro los amplía sin cambiar su sentido:

| `09` Parte D | Este registro |
|---|---|
| SUP-01 | SUP-001 |
| SUP-02 | SUP-002 |
| SUP-03 | SUP-040 a SUP-047 |
| SUP-04 | SUP-024 |
| SUP-05, SUP-06, SUP-11 | SUP-007 |
| SUP-07, SUP-08 | SUP-025 (y SUP-005 para la sincronización) |
| SUP-09 | SUP-020 |
| SUP-10 | SUP-008 |
| DEP-01 (designación de la piloto) | Resuelta por DEC-088; queda la ratificación formal en SUP-002 |
| DEP-02 | DEP-048, DEP-049 |
| DEP-03 | DEP-001 a DEP-004 |
| DEP-04 | DEP-020, DEP-021, DEP-023 |
| DEP-05 | DEP-041 |
| DEP-06 | DEP-039 |
| DEP-07 | DEP-031 a DEP-033 |
| DEP-08 | DEP-036 |
| DEP-09 | DEP-035 |
| DEP-10 | DEP-053 |

---

## Parte C — Qué debe conseguir la cooperativa antes de cada ola

Resumen de las dependencias (DEP) y validaciones (SUP) que la cooperativa piloto debe tener resueltas **antes de iniciar** cada ola. Lo que la plataforma gestiona por sí sola (homologación de plataforma, correo, SMS, mapas, push, nube) no se repite aquí salvo que requiera una acción de la cooperativa.

| Momento | Qué debe conseguir o validar la cooperativa | Referencias |
|---|---|---|
| **Antes de O0** | Ratificación formal de Laguna Larga como piloto e interlocutores designados por rol. Revisión del contrato de encargo y de las cláusulas de transferencia internacional. Relación de entidades jurídicas (razón social, CUIT, condición fiscal) y sucursales con sus usos, para la carga manual de `legalEntities` y `branches`. Validación de la política de PA asumidas. | SUP-001, SUP-002, SUP-008, SUP-050, SUP-051; DEP-052, DEP-053 |
| **Antes de O1** | Acceso de solo lectura a una copia de la base ProCoop para la herramienta de migración base y el inventario (T07 F1). Feriados locales. Decisión de habilitar CiDi y de usar clave de mapas propia o de plataforma. Validación de controles de seguridad (separación de funciones, accesos de soporte) y de la tabla de conservación de datos. | DEP-047, DEP-048, DEP-035, DEP-036; SUP-030, SUP-031 |
| **Antes de O2** | Delegación DNS del dominio o subdominio y registros SPF/DKIM/DMARC. Cuenta de WhatsApp Business verificada (o adhesión al proveedor de plataforma) y modelo de contratación de SMS. Alta de la aplicación en CiDi. Textos legales del portal y consentimientos. **Dictamen legal de los plazos ENACOM (SUP-041)**. Exportación de usuarios de CoopOnline para el mapeo. | DEP-031 a DEP-033, DEP-035, DEP-038, DEP-049, DEP-013; SUP-027 a SUP-029, SUP-032, SUP-041 |
| **Antes de O3** | Accesos API y ambiente de prueba de MikroTik, RADIUS y SmartOLT; confirmar los equipos de LAG. Elección del proveedor de firma digital. Archivos GIS y catastro. Inventario de dispositivos de campo (Android 9+ e iOS 16.4+). Catálogo de equipos en comodato. | DEP-037, DEP-039, DEP-041; SUP-036, SUP-039, SUP-049 |
| **Antes de O4** | Certificado ARCA de homologación por entidad y puntos de venta web service; custodia y vencimiento del certificado actual. Acceso al padrón de IIBB de Córdoba y CVP. Formatos de código de barras por red. Cuadros tarifarios y conceptos de Internet. **Dictamen fiscal y legal del aporte de capital en la factura (SUP-040)**. Validación de la semántica tarifaria y del criterio de diferencias del paralelo. | DEP-001 a DEP-004, DEP-007, DEP-028, DEP-054, DEP-055; SUP-009, SUP-010, SUP-012 a SUP-014, SUP-040, SUP-053, SUP-057 |
| **Antes de O5** | Convenios y accesos de homologación de Red Link y SIRO (archivos y API), y acuerdo de código de barras extendido. Decisión sobre contratar Pagos360 o Mercado Pago. Layouts de débito por CBU y tarjetas, extractos de los dos bancos principales, imprenta. Convenios de terceros. Plan de cuentas validado por el contador y criterio de PA-TES-17. Reglas de capital según el estatuto. | DEP-009, DEP-020 a DEP-026, DEP-029, DEP-030, DEP-054, DEP-055; SUP-016 a SUP-020, SUP-033, SUP-034, SUP-048 |
| **Antes de O6** | **Dictámenes legales de prescripción, preaviso, protecciones contra el corte y ventanas** para Internet. Aceptación expresa de la IA de atención y acuerdo de tratamiento. Plantillas de WhatsApp de mora aprobadas. | DEP-040, DEP-053; SUP-021 a SUP-024 |
| **Antes de O7** | Sistema de medidores prepagos (fabricante, tokens, módulo de seguridad) y telemedición de LAG. Padrones de subsidios. Formatos de ERSeP y ENARGAS, formularios de la distribuidora de gas, registro de electrodependientes. Cuadros tarifarios medidos aprobados. **Dictámenes de emergencias de gas, caudal mínimo de agua y ventanas de corte ERSeP (SUP-042 a SUP-044)**. | DEP-010 a DEP-012, DEP-014, DEP-017, DEP-019, DEP-042, DEP-043, DEP-055; SUP-011, SUP-015, SUP-018, SUP-037, SUP-042 a SUP-044, SUP-054, SUP-056 |
| **Antes de la primera migración real de LAG (corte comercial, tras O7)** | Credenciales de **producción** de ARCA, Red Link, SIRO y demás canales usados; acuerdo de convivencia con el proveedor de ProCoop; plan de comunicación a socios y dominios de CoopOnline para redirigir. Aprobación de los criterios del paralelo. | DEP-001, DEP-002, DEP-020, DEP-021, DEP-048, DEP-049; SUP-004, SUP-005, SUP-025, SUP-026 |
| **Antes de O8** | Layout de la factura del mayorista eléctrico y de gas. Aplicación Interbanking registrada. Formato del liquidador de sueldos externo. Confirmación de los regímenes informativos que presenta y de FECESCOR. | DEP-005, DEP-008, DEP-016, DEP-018, DEP-019, DEP-027, DEP-051 |
| **Antes de O9** | Contrato con el proveedor de firma digital licenciado (recibos de sueldo). Formatos de LSD y SICOSS; tablas y convenios colectivos vigentes. | DEP-006, DEP-039; SUP-035 |
| **Antes de O10** | Plantilla INAES; formatos de CDR y acceso al CAS si presta telefonía o TV; proveedor GPS; inventario de hardware local. Reglamentos sociales. **Dictámenes de mora de telefonía, TV y cobertura social (SUP-045 a SUP-047)**. | DEP-016, DEP-044 a DEP-046, DEP-055; SUP-038, SUP-045 a SUP-047 |
| **Antes de O11 y del corte administrativo** | Confirmación de históricos DBF; pasarelas adicionales que pida la cooperativa; ventana de corte y aprobación del Consejo. | DEP-024, DEP-050; SUP-005, SUP-025 |

---

## Parte D — Observaciones sobre las fuentes

Diferencias detectadas al armar este registro. No se modificó ningún documento: se informan para que el dueño de cada fuente las resuelva. Mientras tanto, prevalece lo indicado en la columna "Rige".

| N.º | Observación | Fuentes | Rige |
|---|---|---|---|
| 1 | El índice y `09-riesgos-y-raci.md` todavía citan DEC-081 ("piloto no definida") en el supuesto transversal, en RSK-012, en DEP-01 y en la tabla de aprobaciones, pero DEC-088 (05-11-2026, vigente) ya designa a Laguna Larga como piloto. | `00-INDICE.md`; `09` (RSK-012, Parte D, Aprobaciones); `01` DEC-088 | DEC-088 |
| 2 | La fila de PA-TAR-14 en `02-preguntas-abiertas.md` mantiene como recomendada "Balance neto MER-001", mientras M04 ya la alineó con DEC-060 (compensación monetaria por defecto; HUE-ELE-03 "Corregido en anexo"). | `02` fila PA-TAR-14; M04 §21 PA-TAR-14; DEC-060 | DEC-060 y M04 |
| 3 | La fila de PA-MIG-17 en `02` remite a la piloto de DEC-081, reemplazada por DEC-088. | `02` fila PA-MIG-17; DEC-088 | DEC-088 (opción A) |
| 4 | Las filas PA-NFR-01 y PA-NFR-02 figuran como "Respondida (DEC-063)" pero su texto recomendado (99,9 % en operación general; RPO ≤ 5 min) difiere de DEC-063 (99,5 % mensual; RPO ≤ 15 min). | `02` filas PA-NFR-01/02; DEC-063 | DEC-063 |
| 5 | La fila PA-INT-20 dice "CiDi como Extensión en O10", mientras DEC-067 y FI-INT-68 fijan mecanismo en O1 y adaptador CiDi en O2. | `02` fila PA-INT-20; DEC-067; FI-INT-68 | DEC-067 |
| 6 | La colección `branches` se crea en O0 (T05 COL-CFG-42), pero su migración desde ProCoop (T04 RF-CFG-142) está en O11 con el origen marcado `[VERIFICAR]`: las sucursales se cargan a mano durante ocho olas. | T04 RF-CFG-142; T05 COL-CFG-42 | Carga manual en O0 y conciliación en la migración (SUP-050) |
| 7 | `09` informa 471 marcas `[VERIFICAR]`; el recuento de este registro da 522 ocurrencias en anexos (515 líneas). La diferencia es de método; conviene fijar un único criterio de conteo. | `09` RSK-007; recuento propio | Recuento por anexo de A.2 |
