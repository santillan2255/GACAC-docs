# Catálogo de endpoints · M08 · Mora, intereses, suspensión, corte, reconexión, financiación y convenios, garantías, incobrables, gestión judicial y prescripción

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Especificar, sin necesidad de otra fuente, el módulo que:

1. Calcula intereses y recargos con un único motor parametrizable y auditable, en los tres momentos en que ProCoop los calcula (RN-04 §1): (a) al emitir (importes de los vencimientos 2 a 4, "recargo entre vencimientos"), (b) al cobrar o consultar deuda en caja, entes, pasarelas y portal (recargo por mora por tasa fija diaria, tabla de tasas por vigencia —MORATAS— o índices —TABMORA/INDICESMORA—, por…
2. Gestiona la mora como una máquina de estados configurable por servicio y categoría: política de mora (BASE §68), instancias (Candidatos, 1.ª, 2.ª, sensible, corte y las que defina el tenant), lotes, notificaciones con contenido, canal, plantilla y constancia de entrega (AGR-024), promesas de pago, calificación, excepciones y protecciones normativas (electrodependientes, entidades públicas y…
3. Orquesta la suspensión, el corte, la reconexión, la baja por mora, la suspensión voluntaria y la reactivación (BASE §53) respetando los límites normativos por servicio y jurisdicción (BASE §52.3, §68, §70, §86–§91): evalúa cada servicio afectado, bloquea o deriva a revisión, genera las órdenes hacia Técnica (M10) y el aprovisionamiento remoto (T06: MikroTik/RADIUS/OLT para Internet; telemedición…
4. Formaliza la regularización de deuda: planes de pago y convenios con simulador (anticipo, cuotas, tasa, CFT), sistemas de amortización (sin interés, directo, francés, alemán, americano, cuotas con saldo), quitas, sellado, ajuste por índice, firmantes y firma, caída automática, reexigibilidad, refinanciación, cancelación anticipada y anulación, sin doble exigencia (AGR-014); planes de cuotas y…
5. Administra garantías y garantes (MER-005), incobrables y gestión externa/judicial (MER-006) y la prescripción de deuda, sin borrar jamás la historia económica.
6. Publica informes y tableros de mora y financiación con fórmula, universo y fecha de corte (AGR-022).

Detalle completo en el anexo M08, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m08-mor).

| Dato | Valor |
|---|---|
| Endpoints | 184 |
| Por método | GET 65, PATCH 20, POST 98, PUT 1 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 7 |
| Con requisito inferido (a confirmar) | 177 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 184 | Listar políticas de interés.; Crear borrador / nueva versión.; Editar borrador.… |

## Cómo leer cada ficha

Cada endpoint tiene una ficha con estos datos:

| Dato | De dónde sale |
|---|---|
| **Qué hace** | La descripción de la fila API del anexo (§11), seguida de una frase armada con el método HTTP, la forma de la ruta y el nombre de la colección en T05. |
| **Para qué sirve** | El requisito funcional (RF) que el endpoint implementa, con su texto del §5 del anexo. Si la fila API o el anexo lo vinculan, se cita tal cual. Si no, se elige el RF del anexo con más palabras en común y se marca *a confirmar*. |
| **Quién lo usa** | El canal, según el prefijo de la ruta (backoffice, portal del socio, app de campo, consola de plataforma, terceros, público), y el permiso (capability) de T02. |
| **Recibe / Devuelve** | Parámetros, cuerpo y respuesta exitosa del contrato OpenAPI. |
| **Pantallas** | Pantallas del catálogo 4.5 que exigen el mismo permiso. |
| **Ola y fuente** | Ola de construcción y línea de la fila API en el anexo. |

<a id="grupo-1"></a>

## API

184 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-MOR-01](#API-MOR-01) | GET | `/api/admin/mor/interest-policies` | Listar políticas de interés. |
| [API-MOR-02](#API-MOR-02) | POST | `/api/admin/mor/interest-policies` | Crear borrador / nueva versión. |
| [API-MOR-03](#API-MOR-03) | PATCH | `/api/admin/mor/interest-policies/{id}` | Editar borrador. |
| [API-MOR-04](#API-MOR-04) | POST | `/api/admin/mor/interest-policies/{id}/publish` | Publicar (valida cobertura fiscal y prioridades) |
| [API-MOR-05](#API-MOR-05) | GET | `/api/admin/mor/rate-tables` | Listar / crear tablas de tasas. |
| [API-MOR-05-b](#API-MOR-05-b) | POST | `/api/admin/mor/rate-tables` | Listar / crear tablas de tasas. |
| [API-MOR-06](#API-MOR-06) | PUT | `/api/admin/mor/rate-tables/{id}/rates` | Reemplazar tramos (valida superposición) |
| [API-MOR-07](#API-MOR-07) | POST | `/api/admin/mor/rate-tables/{id}/publish` | Publicar. |
| [API-MOR-08](#API-MOR-08) | GET | `/api/admin/mor/index-tables` | Listar / crear tablas de índices. |
| [API-MOR-08-b](#API-MOR-08-b) | POST | `/api/admin/mor/index-tables` | Listar / crear tablas de índices. |
| [API-MOR-09](#API-MOR-09) | POST | `/api/admin/mor/index-tables/{id}/values/import` | Importar valores (preview y confirmación) |
| [API-MOR-10](#API-MOR-10) | GET | `/api/admin/mor/due-date-schemes` | ABM de esquemas de recargo entre vencimientos. |
| [API-MOR-10-b](#API-MOR-10-b) | POST | `/api/admin/mor/due-date-schemes` | ABM de esquemas de recargo entre vencimientos. |
| [API-MOR-10-c](#API-MOR-10-c) | GET | `/api/admin/mor/due-date-schemes/{id}` | ABM de esquemas de recargo entre vencimientos. |
| [API-MOR-10-d](#API-MOR-10-d) | PATCH | `/api/admin/mor/due-date-schemes/{id}` | ABM de esquemas de recargo entre vencimientos. |
| [API-MOR-11](#API-MOR-11) | POST | `/api/admin/mor/due-date-schemes/{id}/simulate` | Simular TOTAL2..4 para un importe. |
| [API-MOR-12](#API-MOR-12) | GET | `/api/admin/mor/early-payment-discounts` | ABM de descuentos por pronto pago. |
| [API-MOR-12-b](#API-MOR-12-b) | POST | `/api/admin/mor/early-payment-discounts` | ABM de descuentos por pronto pago. |
| [API-MOR-12-c](#API-MOR-12-c) | GET | `/api/admin/mor/early-payment-discounts/{id}` | ABM de descuentos por pronto pago. |
| [API-MOR-12-d](#API-MOR-12-d) | PATCH | `/api/admin/mor/early-payment-discounts/{id}` | ABM de descuentos por pronto pago. |
| [API-MOR-13](#API-MOR-13) | POST | `/api/admin/mor/quotes` | Cotizar recargo de documentos a una fecha. |
| [API-MOR-14](#API-MOR-14) | GET | `/api/admin/mor/calculations/{id}` | Ver cálculo registrado con tramos. |
| [API-MOR-15](#API-MOR-15) | POST | `/api/admin/mor/quotes/{id}/waiver` | Solicitar dispensa del recargo. |
| [API-MOR-16](#API-MOR-16) | POST | `/api/admin/mor/waivers/{id}/approve` | Aprobar/rechazar dispensa. |
| [API-MOR-17](#API-MOR-17) | GET | `/api/admin/mor/interest-runs` | Listar / crear corrida (draft + preview) |
| [API-MOR-17-b](#API-MOR-17-b) | POST | `/api/admin/mor/interest-runs` | Listar / crear corrida (draft + preview) |
| [API-MOR-18](#API-MOR-18) | GET | `/api/admin/mor/interest-runs/{id}/items` | Preliminar paginado. |
| [API-MOR-19](#API-MOR-19) | PATCH | `/api/admin/mor/interest-runs/{id}/items/selection` | Tildar/destildar documentos o tramos. |
| [API-MOR-20](#API-MOR-20) | POST | `/api/admin/mor/interest-runs/{id}/approve` | Aprobar corrida. |
| [API-MOR-21](#API-MOR-21) | POST | `/api/admin/mor/interest-runs/{id}/generate` | Generar cargos (job) |
| [API-MOR-22](#API-MOR-22) | POST | `/api/admin/mor/interest-runs/{id}/cancel` | Cancelar corrida. |
| [API-MOR-23](#API-MOR-23) | GET | `/api/admin/mor/holds` | Listar / aplicar bloqueos (individual o masivo) |
| [API-MOR-23-b](#API-MOR-23-b) | POST | `/api/admin/mor/holds` | Listar / aplicar bloqueos (individual o masivo) |
| [API-MOR-24](#API-MOR-24) | POST | `/api/admin/mor/holds/{id}/release` | Liberar bloqueo (opcional con interés) |
| [API-MOR-25](#API-MOR-25) | GET | `/api/admin/mor/hold-reasons` | ABM de causas de bloqueo. |
| [API-MOR-25-b](#API-MOR-25-b) | POST | `/api/admin/mor/hold-reasons` | ABM de causas de bloqueo. |
| [API-MOR-25-c](#API-MOR-25-c) | GET | `/api/admin/mor/hold-reasons/{id}` | ABM de causas de bloqueo. |
| [API-MOR-25-d](#API-MOR-25-d) | PATCH | `/api/admin/mor/hold-reasons/{id}` | ABM de causas de bloqueo. |
| [API-MOR-26](#API-MOR-26) | GET | `/api/admin/mor/delinquency-policies` | ABM de políticas de mora. |
| [API-MOR-26-b](#API-MOR-26-b) | POST | `/api/admin/mor/delinquency-policies` | ABM de políticas de mora. |
| [API-MOR-26-c](#API-MOR-26-c) | GET | `/api/admin/mor/delinquency-policies/{id}` | ABM de políticas de mora. |
| [API-MOR-26-d](#API-MOR-26-d) | PATCH | `/api/admin/mor/delinquency-policies/{id}` | ABM de políticas de mora. |
| [API-MOR-27](#API-MOR-27) | POST | `/api/admin/mor/delinquency-policies/{id}/publish` | Publicar política. |
| [API-MOR-29](#API-MOR-29) | GET | `/api/admin/mor/evaluations` | Consultar evaluaciones. |
| [API-MOR-28](#API-MOR-28) | POST | `/api/admin/mor/evaluations` | Evaluar una cuenta o universo a una fecha. |
| [API-MOR-29-b](#API-MOR-29-b) | GET | `/api/admin/mor/evaluations/{id}` | Consultar evaluaciones. |
| [API-MOR-30](#API-MOR-30) | GET | `/api/admin/mor/stages` | ABM de instancias. |
| [API-MOR-30-b](#API-MOR-30-b) | POST | `/api/admin/mor/stages` | ABM de instancias. |
| [API-MOR-30-c](#API-MOR-30-c) | GET | `/api/admin/mor/stages/{id}` | ABM de instancias. |
| [API-MOR-30-d](#API-MOR-30-d) | PATCH | `/api/admin/mor/stages/{id}` | ABM de instancias. |
| [API-MOR-31](#API-MOR-31) | GET | `/api/admin/mor/notice-models` | ABM de modelos de aviso (versionados) |
| [API-MOR-31-b](#API-MOR-31-b) | POST | `/api/admin/mor/notice-models` | ABM de modelos de aviso (versionados) |
| [API-MOR-31-c](#API-MOR-31-c) | GET | `/api/admin/mor/notice-models/{id}` | ABM de modelos de aviso (versionados) |
| [API-MOR-31-d](#API-MOR-31-d) | PATCH | `/api/admin/mor/notice-models/{id}` | ABM de modelos de aviso (versionados) |
| [API-MOR-32](#API-MOR-32) | POST | `/api/admin/mor/candidates/preview` | Previsualizar candidatos con exclusiones. |
| [API-MOR-33](#API-MOR-33) | POST | `/api/admin/mor/batches` | Crear lote (generar candidatos o procesar instancia) |
| [API-MOR-34](#API-MOR-34) | POST | `/api/admin/mor/batches/{id}/annul` | Anular lote. |
| [API-MOR-35](#API-MOR-35) | GET | `/api/admin/mor/notices` | Buscar notificaciones (filtros de RF-MOR-083) |
| [API-MOR-36](#API-MOR-36) | GET | `/api/admin/mor/notices/{id}` | Ficha con ítems, deuda actualizada, bitácora. |
| [API-MOR-37](#API-MOR-37) | POST | `/api/admin/mor/notices/delivery` | Marcar/desmarcar entrega con evidencia (lote de ids) |
| [API-MOR-38](#API-MOR-38) | POST | `/api/admin/mor/notices/{id}/promise` | Registrar promesa de pago. |
| [API-MOR-39](#API-MOR-39) | POST | `/api/admin/mor/notices/{id}/rating` | Calificar. |
| [API-MOR-40](#API-MOR-40) | POST | `/api/admin/mor/notices/exclude` | Dar de baja con causa (lote) |
| [API-MOR-41](#API-MOR-41) | POST | `/api/admin/mor/notices/close` | Cerrar notificaciones (lote, bloqueo opcional) |
| [API-MOR-42](#API-MOR-42) | POST | `/api/admin/mor/notices/print` | Generar PDF agrupado por titular u individual. |
| [API-MOR-43](#API-MOR-43) | POST | `/api/admin/mor/notices/export` | Exportar circulares / archivo para envío masivo. |
| [API-MOR-44](#API-MOR-44) | GET | `/api/admin/mor/notices/missing-recipients` | Cuentas sin correo o celular para un canal. |
| [API-MOR-45](#API-MOR-45) | POST | `/api/admin/mor/special-operations/notices/{id}/resolve` | Resolver o eliminar (lógico) notificación sin efectos. |
| [API-MOR-45-b](#API-MOR-45-b) | POST | `/api/admin/mor/special-operations/notices/{id}/delete` | Resolver o eliminar (lógico) notificación sin efectos. |
| [API-MOR-46](#API-MOR-46) | GET | `/api/admin/mor/exceptions` | ABM de excepciones. |
| [API-MOR-46-b](#API-MOR-46-b) | POST | `/api/admin/mor/exceptions` | ABM de excepciones. |
| [API-MOR-46-c](#API-MOR-46-c) | GET | `/api/admin/mor/exceptions/{id}` | ABM de excepciones. |
| [API-MOR-46-d](#API-MOR-46-d) | PATCH | `/api/admin/mor/exceptions/{id}` | ABM de excepciones. |
| [API-MOR-47](#API-MOR-47) | POST | `/api/admin/mor/exceptions/{id}/authorize` | Autorizar / desautorizar. |
| [API-MOR-47-b](#API-MOR-47-b) | POST | `/api/admin/mor/exceptions/{id}/revoke` | Autorizar / desautorizar. |
| [API-MOR-48](#API-MOR-48) | GET | `/api/admin/mor/protections` | ABM de protecciones normativas. |
| [API-MOR-48-b](#API-MOR-48-b) | POST | `/api/admin/mor/protections` | ABM de protecciones normativas. |
| [API-MOR-48-c](#API-MOR-48-c) | GET | `/api/admin/mor/protections/{id}` | ABM de protecciones normativas. |
| [API-MOR-48-d](#API-MOR-48-d) | PATCH | `/api/admin/mor/protections/{id}` | ABM de protecciones normativas. |
| [API-MOR-49](#API-MOR-49) | POST | `/api/admin/mor/protections/{id}/verify` | Verificar protección. |
| [API-MOR-50](#API-MOR-50) | GET | `/api/admin/mor/restriction-rules` | ABM de matriz (las normative solo con capability normativa) |
| [API-MOR-50-b](#API-MOR-50-b) | POST | `/api/admin/mor/restriction-rules` | ABM de matriz (las normative solo con capability normativa) |
| [API-MOR-50-c](#API-MOR-50-c) | GET | `/api/admin/mor/restriction-rules/{id}` | ABM de matriz (las normative solo con capability normativa) |
| [API-MOR-50-d](#API-MOR-50-d) | PATCH | `/api/admin/mor/restriction-rules/{id}` | ABM de matriz (las normative solo con capability normativa) |
| [API-MOR-51](#API-MOR-51) | GET | `/api/platform/mor/restriction-rules` | Catálogo normativo base por jurisdicción. |
| [API-MOR-51-b](#API-MOR-51-b) | POST | `/api/platform/mor/restriction-rules` | Catálogo normativo base por jurisdicción. |
| [API-MOR-51-c](#API-MOR-51-c) | GET | `/api/platform/mor/restriction-rules/{id}` | Catálogo normativo base por jurisdicción. |
| [API-MOR-51-d](#API-MOR-51-d) | PATCH | `/api/platform/mor/restriction-rules/{id}` | Catálogo normativo base por jurisdicción. |
| [API-MOR-52](#API-MOR-52) | GET | `/api/admin/mor/reasons` | ABM de causas. |
| [API-MOR-52-b](#API-MOR-52-b) | POST | `/api/admin/mor/reasons` | ABM de causas. |
| [API-MOR-52-c](#API-MOR-52-c) | GET | `/api/admin/mor/reasons/{id}` | ABM de causas. |
| [API-MOR-52-d](#API-MOR-52-d) | PATCH | `/api/admin/mor/reasons/{id}` | ABM de causas. |
| [API-MOR-53](#API-MOR-53) | GET | `/api/admin/mor/treatment/services` | Servicios elegibles de notificaciones vencidas. |
| [API-MOR-55](#API-MOR-55) | GET | `/api/admin/mor/interruption-cases` | Listar / ficha. |
| [API-MOR-54](#API-MOR-54) | POST | `/api/admin/mor/interruption-cases` | Crear caso(s) de interrupción (evalúa) |
| [API-MOR-55-b](#API-MOR-55-b) | GET | `/api/admin/mor/interruption-cases/{id}` | Listar / ficha. |
| [API-MOR-56](#API-MOR-56) | POST | `/api/admin/mor/interruption-cases/{id}/approve` | Aprobar / rechazar. |
| [API-MOR-56-b](#API-MOR-56-b) | POST | `/api/admin/mor/interruption-cases/{id}/reject` | Aprobar / rechazar. |
| [API-MOR-57](#API-MOR-57) | POST | `/api/admin/mor/interruption-cases/{id}/cancel` | Cancelar, reprogramar, reintentar. |
| [API-MOR-57-b](#API-MOR-57-b) | POST | `/api/admin/mor/interruption-cases/{id}/reschedule` | Cancelar, reprogramar, reintentar. |
| [API-MOR-57-c](#API-MOR-57-c) | POST | `/api/admin/mor/interruption-cases/{id}/retry` | Cancelar, reprogramar, reintentar. |
| [API-MOR-58](#API-MOR-58) | POST | `/api/admin/mor/interruption-cases/{id}/confirm-direct` | Confirmar ejecución directa (servicios sin técnica) |
| [API-MOR-59](#API-MOR-59) | GET | `/api/admin/mor/interruption-charge-rules` | ABM de reglas de cargos. |
| [API-MOR-59-b](#API-MOR-59-b) | POST | `/api/admin/mor/interruption-charge-rules` | ABM de reglas de cargos. |
| [API-MOR-59-c](#API-MOR-59-c) | GET | `/api/admin/mor/interruption-charge-rules/{id}` | ABM de reglas de cargos. |
| [API-MOR-59-d](#API-MOR-59-d) | PATCH | `/api/admin/mor/interruption-charge-rules/{id}` | ABM de reglas de cargos. |
| [API-MOR-60](#API-MOR-60) | GET | `/api/admin/mor/payment-plans` | ABM de planes. |
| [API-MOR-60-b](#API-MOR-60-b) | POST | `/api/admin/mor/payment-plans` | ABM de planes. |
| [API-MOR-60-c](#API-MOR-60-c) | GET | `/api/admin/mor/payment-plans/{id}` | ABM de planes. |
| [API-MOR-60-d](#API-MOR-60-d) | PATCH | `/api/admin/mor/payment-plans/{id}` | ABM de planes. |
| [API-MOR-61](#API-MOR-61) | GET | `/api/admin/mor/financial-entities` | ABM de entidades financieras. |
| [API-MOR-61-b](#API-MOR-61-b) | POST | `/api/admin/mor/financial-entities` | ABM de entidades financieras. |
| [API-MOR-61-c](#API-MOR-61-c) | GET | `/api/admin/mor/financial-entities/{id}` | ABM de entidades financieras. |
| [API-MOR-61-d](#API-MOR-61-d) | PATCH | `/api/admin/mor/financial-entities/{id}` | ABM de entidades financieras. |
| [API-MOR-62](#API-MOR-62) | POST | `/api/admin/mor/simulations` | Simular convenio. |
| [API-MOR-64](#API-MOR-64) | GET | `/api/admin/mor/agreements` | Listar / ficha. |
| [API-MOR-63](#API-MOR-63) | POST | `/api/admin/mor/agreements` | Crear convenio desde simulación. |
| [API-MOR-64-b](#API-MOR-64-b) | GET | `/api/admin/mor/agreements/{id}` | Listar / ficha. |
| [API-MOR-65](#API-MOR-65) | POST | `/api/admin/mor/agreements/{id}/submit-approval` | Workflow de condiciones especiales. |
| [API-MOR-65-b](#API-MOR-65-b) | POST | `/api/admin/mor/agreements/{id}/approve` | Workflow de condiciones especiales. |
| [API-MOR-65-c](#API-MOR-65-c) | POST | `/api/admin/mor/agreements/{id}/reject` | Workflow de condiciones especiales. |
| [API-MOR-66](#API-MOR-66) | POST | `/api/admin/mor/agreements/{id}/send-for-signature` | Enviar enlace de firma (OTP) |
| [API-MOR-67](#API-MOR-67) | POST | `/api/admin/mor/agreements/{id}/signatures` | Registrar firma presencial. |
| [API-MOR-68](#API-MOR-68) | POST | `/api/admin/mor/agreements/{id}/early-cancellation/quote` | Cotizar y confirmar cancelación anticipada. |
| [API-MOR-68-b](#API-MOR-68-b) | POST | `/api/admin/mor/agreements/{id}/early-cancellation/confirm` | Cotizar y confirmar cancelación anticipada. |
| [API-MOR-69](#API-MOR-69) | POST | `/api/admin/mor/agreements/{id}/default` | Declarar caducidad / rehabilitar. |
| [API-MOR-69-b](#API-MOR-69-b) | POST | `/api/admin/mor/agreements/{id}/rehabilitate` | Declarar caducidad / rehabilitar. |
| [API-MOR-70](#API-MOR-70) | POST | `/api/admin/mor/agreements/{id}/annul` | Anular (valida RN-MOR-121) |
| [API-MOR-71](#API-MOR-71) | POST | `/api/admin/mor/agreements/{id}/guarantor` | Cambiar garante. |
| [API-MOR-72](#API-MOR-72) | POST | `/api/admin/mor/agreements/fiscal-recalculation` | Detectar y recalcular cuotas por cambio fiscal. |
| [API-MOR-73](#API-MOR-73) | GET | `/api/admin/mor/agreements/{id}/documents/{kind}` | PDF convenio, talonario o liquidación. |
| [API-MOR-74](#API-MOR-74) | GET | `/api/admin/mor/guarantees` | ABM y acciones de garantías. |
| [API-MOR-74-b](#API-MOR-74-b) | POST | `/api/admin/mor/guarantees` | ABM y acciones de garantías. |
| [API-MOR-74-c](#API-MOR-74-c) | GET | `/api/admin/mor/guarantees/{id}` | ABM y acciones de garantías. |
| [API-MOR-74-d](#API-MOR-74-d) | PATCH | `/api/admin/mor/guarantees/{id}` | ABM y acciones de garantías. |
| [API-MOR-75](#API-MOR-75) | POST | `/api/admin/mor/guarantees/{id}/execute` | Acciones sobre garantía. |
| [API-MOR-75-b](#API-MOR-75-b) | POST | `/api/admin/mor/guarantees/{id}/apply` | Acciones sobre garantía. |
| [API-MOR-75-c](#API-MOR-75-c) | POST | `/api/admin/mor/guarantees/{id}/refund` | Acciones sobre garantía. |
| [API-MOR-75-d](#API-MOR-75-d) | POST | `/api/admin/mor/guarantees/{id}/release` | Acciones sobre garantía. |
| [API-MOR-76](#API-MOR-76) | GET | `/api/admin/mor/collection-agencies` | ABM de estudios. |
| [API-MOR-76-b](#API-MOR-76-b) | POST | `/api/admin/mor/collection-agencies` | ABM de estudios. |
| [API-MOR-76-c](#API-MOR-76-c) | GET | `/api/admin/mor/collection-agencies/{id}` | ABM de estudios. |
| [API-MOR-76-d](#API-MOR-76-d) | PATCH | `/api/admin/mor/collection-agencies/{id}` | ABM de estudios. |
| [API-MOR-77](#API-MOR-77) | GET | `/api/admin/mor/collection-cases` | Expedientes externos/judiciales. |
| [API-MOR-77-b](#API-MOR-77-b) | POST | `/api/admin/mor/collection-cases` | Expedientes externos/judiciales. |
| [API-MOR-77-c](#API-MOR-77-c) | GET | `/api/admin/mor/collection-cases/{id}` | Expedientes externos/judiciales. |
| [API-MOR-77-d](#API-MOR-77-d) | PATCH | `/api/admin/mor/collection-cases/{id}` | Expedientes externos/judiciales. |
| [API-MOR-78](#API-MOR-78) | POST | `/api/admin/mor/collection-cases/{id}/events` | Movimientos del expediente. |
| [API-MOR-78-b](#API-MOR-78-b) | POST | `/api/admin/mor/collection-cases/{id}/costs` | Movimientos del expediente. |
| [API-MOR-78-c](#API-MOR-78-c) | POST | `/api/admin/mor/collection-cases/{id}/close` | Movimientos del expediente. |
| [API-MOR-79](#API-MOR-79) | GET | `/api/admin/mor/write-offs` | Proponer incobrables. |
| [API-MOR-79-b](#API-MOR-79-b) | POST | `/api/admin/mor/write-offs` | Proponer incobrables. |
| [API-MOR-80](#API-MOR-80) | POST | `/api/admin/mor/write-offs/{id}/approve` | Aprobar / rechazar / revertir. |
| [API-MOR-80-b](#API-MOR-80-b) | POST | `/api/admin/mor/write-offs/{id}/reject` | Aprobar / rechazar / revertir. |
| [API-MOR-80-c](#API-MOR-80-c) | POST | `/api/admin/mor/write-offs/{id}/revert` | Aprobar / rechazar / revertir. |
| [API-MOR-81](#API-MOR-81) | GET | `/api/admin/mor/prescription-rules` | Reglas de prescripción. |
| [API-MOR-81-b](#API-MOR-81-b) | POST | `/api/admin/mor/prescription-rules` | Reglas de prescripción. |
| [API-MOR-81-c](#API-MOR-81-c) | GET | `/api/admin/mor/prescription-rules/{id}` | Reglas de prescripción. |
| [API-MOR-81-d](#API-MOR-81-d) | PATCH | `/api/admin/mor/prescription-rules/{id}` | Reglas de prescripción. |
| [API-MOR-82](#API-MOR-82) | POST | `/api/admin/mor/prescription-runs` | Corridas de prescripción. |
| [API-MOR-82-b](#API-MOR-82-b) | POST | `/api/admin/mor/prescription-runs/{id}/propose` | Corridas de prescripción. |
| [API-MOR-82-c](#API-MOR-82-c) | POST | `/api/admin/mor/prescription-runs/{id}/approve` | Corridas de prescripción. |
| [API-MOR-82-d](#API-MOR-82-d) | POST | `/api/admin/mor/prescription-runs/{id}/execute` | Corridas de prescripción. |
| [API-MOR-83](#API-MOR-83) | GET | `/api/admin/mor/reports/{reportCode}` | Ejecutar informe con filtros y fecha de corte. |
| [API-MOR-84](#API-MOR-84) | POST | `/api/admin/mor/reports/{reportCode}/export` | Exportar informe (asíncrono) |
| [API-MOR-85](#API-MOR-85) | GET | `/api/admin/mor/follow-ups` | Expedientes de seguimiento y contactos. |
| [API-MOR-85-b](#API-MOR-85-b) | POST | `/api/admin/mor/follow-ups` | Expedientes de seguimiento y contactos. |
| [API-MOR-85-c](#API-MOR-85-c) | POST | `/api/admin/mor/follow-ups/{id}/contacts` | Expedientes de seguimiento y contactos. |
| [API-MOR-86](#API-MOR-86) | GET | `/api/mor/my-debt` | Deuda vencida del socio con cotización a hoy. |
| [API-MOR-87](#API-MOR-87) | GET | `/api/mor/my-notices` | Avisos del socio con constancias. |
| [API-MOR-88](#API-MOR-88) | POST | `/api/mor/simulations` | Simular con planes habilitados para portal. |
| [API-MOR-90](#API-MOR-90) | GET | `/api/mor/agreements` | Convenios y cuotas del socio. |
| [API-MOR-89](#API-MOR-89) | POST | `/api/mor/agreements` | Solicitar, aceptar (OTP) y firmar convenio. |
| [API-MOR-89-b](#API-MOR-89-b) | POST | `/api/mor/agreements/{id}/accept` | Solicitar, aceptar (OTP) y firmar convenio. |
| [API-MOR-89-c](#API-MOR-89-c) | POST | `/api/mor/agreements/{id}/sign` | Solicitar, aceptar (OTP) y firmar convenio. |
| [API-MOR-90-b](#API-MOR-90-b) | GET | `/api/mor/agreements/{id}` | Convenios y cuotas del socio. |
| [API-MOR-91](#API-MOR-91) | POST | `/api/mor/agreements/{id}/early-cancellation` | Cancelación anticipada desde app. |
| [API-MOR-92](#API-MOR-92) | POST | `/api/mor/notices/{id}/promise` | Promesa de pago del socio. |
| [API-MOR-93](#API-MOR-93) | GET | `/api/mor/services/{id}/interruption-options` | Opciones de suspensión/reactivación habilitadas y costos. |
| [API-MOR-94](#API-MOR-94) | POST | `/api/mor/services/{id}/interruption-requests` | Solicitar suspensión voluntaria o reactivación. |
| [API-MOR-95](#API-MOR-95) | GET | `/api/mor/interruption-requests/{id}` | Estado del caso. |
| [API-MOR-96](#API-MOR-96) | GET | `/api/v1/ext/mor/collection-cases` | Expedientes asignados. |
| [API-MOR-97](#API-MOR-97) | POST | `/api/v1/ext/mor/collection-cases/{id}/events` | Registrar avance/costo. |
| [API-MOR-98](#API-MOR-98) | GET | `/api/v1/ext/mor/delinquency-status` | Condición de mora por cuenta (exportación regulatoria) |

<a id="API-MOR-01"></a>
#### API-MOR-01 · `GET /api/admin/mor/interest-policies`

- **Qué hace:** Listar políticas de interés. Lista, con filtros y paginación, los registros de políticas de interés (`interestPolicies`).
- **Para qué sirve:** RF-MOR-090: Antes de enviar por correo o SMS, listar las cuentas sin dirección o sin celular (por defecto, sin ambos correos: el de la cuenta y el del portal) y permitir descartarlas o derivarlas a otro canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasInteres.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de interés (`interestPolicies`) con `total`.
- **Pantallas:** PAN-MOR-02 (Políticas de interés).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2076 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-01)

<a id="API-MOR-02"></a>
#### API-MOR-02 · `POST /api/admin/mor/interest-policies`

- **Qué hace:** Crear borrador / nueva versión. Da de alta un registro de políticas de interés (`interestPolicies`).
- **Para qué sirve:** RF-MOR-084: Al procesar: crear nueva notificación con nuevo lote, instancia destino, vencimiento, modelo/plantilla y entrega automática según configuración; incluir los documentos impagos de la anterior o toda la deuda vencida; recalcular… · RF-MOR-074: Versionar, auditar y publicar la política con fecha efectiva; un cambio no altera evaluaciones ya cerradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasInteres.configurar`.
- **Recibe:** los datos de políticas de interés (`interestPolicies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de políticas de interés (`interestPolicies`).
- **Pantallas:** PAN-MOR-02 (Políticas de interés).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2077 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-02)

<a id="API-MOR-03"></a>
#### API-MOR-03 · `PATCH /api/admin/mor/interest-policies/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de políticas de interés (`interestPolicies`) (solo los enviados).
- **Para qué sirve:** RF-MOR-215: Operaciones especiales auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasInteres.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de políticas de interés (`interestPolicies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de políticas de interés (`interestPolicies`).
- **Pantallas:** PAN-MOR-02 (Políticas de interés).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2078 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-03)

<a id="API-MOR-04"></a>
#### API-MOR-04 · `POST /api/admin/mor/interest-policies/{id}/publish`

- **Qué hace:** Publicar (valida cobertura fiscal y prioridades) Publica un registro de políticas de interés (`interestPolicies`).
- **Para qué sirve:** RF-MOR-152: Permitir imputar el convenio a otra cuenta (con titular y situación fiscal de la cuenta destino) solo si la política lo habilita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasInteres.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-02 (Políticas de interés).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2079 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-04)

<a id="API-MOR-05"></a>
#### API-MOR-05 · `GET /api/admin/mor/rate-tables`

- **Qué hace:** Listar / crear tablas de tasas. Lista, con filtros y paginación, los registros de tablas de tasas por vigencia (`interestRateTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tasas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tablas de tasas por vigencia (`interestRateTables`) con `total`.
- **Pantallas:** PAN-MOR-03 (Tablas de tasas por vigencia).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-05)

<a id="API-MOR-05-b"></a>
#### API-MOR-05-b · `POST /api/admin/mor/rate-tables`

- **Qué hace:** Listar / crear tablas de tasas. Da de alta un registro de tablas de tasas por vigencia (`interestRateTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tasas.ver`.
- **Recibe:** los datos de tablas de tasas por vigencia (`interestRateTables`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tablas de tasas por vigencia (`interestRateTables`).
- **Pantallas:** PAN-MOR-03 (Tablas de tasas por vigencia).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-05-b)

<a id="API-MOR-06"></a>
#### API-MOR-06 · `PUT /api/admin/mor/rate-tables/{id}/rates`

- **Qué hace:** Reemplazar tramos (valida superposición) Reemplaza o configura tablas de tasas por vigencia (`interestRateTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tasas.editar`.
- **Recibe:** en la ruta `id`; los datos de tablas de tasas por vigencia (`interestRateTables`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de tablas de tasas por vigencia (`interestRateTables`).
- **Pantallas:** PAN-MOR-03 (Tablas de tasas por vigencia).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2081 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-06)

<a id="API-MOR-07"></a>
#### API-MOR-07 · `POST /api/admin/mor/rate-tables/{id}/publish`

- **Qué hace:** Publicar. Publica un registro de tablas de tasas por vigencia (`interestRateTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tasas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-03 (Tablas de tasas por vigencia).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2082 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-07)

<a id="API-MOR-08"></a>
#### API-MOR-08 · `GET /api/admin/mor/index-tables`

- **Qué hace:** Listar / crear tablas de índices. Lista, con filtros y paginación, los registros de índices de recargo por mora propios (`interestIndexTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.indices.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de índices de recargo por mora propios (`interestIndexTables`) con `total`.
- **Pantallas:** PAN-MOR-04 (Tablas de índices).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2083 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-08)

<a id="API-MOR-08-b"></a>
#### API-MOR-08-b · `POST /api/admin/mor/index-tables`

- **Qué hace:** Listar / crear tablas de índices. Da de alta un registro de índices de recargo por mora propios (`interestIndexTables`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.indices.ver`.
- **Recibe:** los datos de índices de recargo por mora propios (`interestIndexTables`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de índices de recargo por mora propios (`interestIndexTables`).
- **Pantallas:** PAN-MOR-04 (Tablas de índices).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2083 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-08-b)

<a id="API-MOR-09"></a>
#### API-MOR-09 · `POST /api/admin/mor/index-tables/{id}/values/import`

- **Qué hace:** Importar valores (preview y confirmación) Importa sobre valores de índice (`interestIndexValues`).
- **Para qué sirve:** RF-MOR-217: Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.indices.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-04 (Tablas de índices).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2084 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-09)

<a id="API-MOR-10"></a>
#### API-MOR-10 · `GET /api/admin/mor/due-date-schemes`

- **Qué hace:** ABM de esquemas de recargo entre vencimientos. Consulta `due-date-schemes`.
- **Para qué sirve:** RF-MOR-013: Administrar tramas de recargo por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tramasRecargo.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-05 (Esquemas de recargo entre vencimientos).
- **Ola:** O4 · **Fuente:** M08 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-10)

<a id="API-MOR-10-b"></a>
#### API-MOR-10-b · `POST /api/admin/mor/due-date-schemes`

- **Qué hace:** ABM de esquemas de recargo entre vencimientos. Registra un nuevo elemento u operación en `due-date-schemes`.
- **Para qué sirve:** RF-MOR-013: Administrar tramas de recargo por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tramasRecargo.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-05 (Esquemas de recargo entre vencimientos).
- **Ola:** O4 · **Fuente:** M08 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-10-b)

<a id="API-MOR-10-c"></a>
#### API-MOR-10-c · `GET /api/admin/mor/due-date-schemes/{id}`

- **Qué hace:** ABM de esquemas de recargo entre vencimientos. Obtiene el detalle de un registro de `due-date-schemes`.
- **Para qué sirve:** RF-MOR-013: Administrar tramas de recargo por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tramasRecargo.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-05 (Esquemas de recargo entre vencimientos).
- **Ola:** O4 · **Fuente:** M08 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-10-c)

<a id="API-MOR-10-d"></a>
#### API-MOR-10-d · `PATCH /api/admin/mor/due-date-schemes/{id}`

- **Qué hace:** ABM de esquemas de recargo entre vencimientos. Modifica algunos campos de un registro de `due-date-schemes` (solo los enviados).
- **Para qué sirve:** RF-MOR-013: Administrar tramas de recargo por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tramasRecargo.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-05 (Esquemas de recargo entre vencimientos).
- **Ola:** O4 · **Fuente:** M08 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-10-d)

<a id="API-MOR-11"></a>
#### API-MOR-11 · `POST /api/admin/mor/due-date-schemes/{id}/simulate`

- **Qué hace:** Simular TOTAL2..4 para un importe. Simula sin efectos un registro de `simulate`.
- **Para qué sirve:** RF-MOR-013: Administrar tramas de recargo por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tramasRecargo.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-05 (Esquemas de recargo entre vencimientos).
- **Ola:** O4 · **Fuente:** M08 §11. API, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-11)

<a id="API-MOR-12"></a>
#### API-MOR-12 · `GET /api/admin/mor/early-payment-discounts`

- **Qué hace:** ABM de descuentos por pronto pago. Consulta `early-payment-discounts`.
- **Para qué sirve:** RF-MOR-031: Aplicar descuento por pronto pago antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.descuentosProntoPago.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-06 (Descuentos por pronto pago).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-12)

<a id="API-MOR-12-b"></a>
#### API-MOR-12-b · `POST /api/admin/mor/early-payment-discounts`

- **Qué hace:** ABM de descuentos por pronto pago. Registra un nuevo elemento u operación en `early-payment-discounts`.
- **Para qué sirve:** RF-MOR-031: Aplicar descuento por pronto pago antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.descuentosProntoPago.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-06 (Descuentos por pronto pago).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-12-b)

<a id="API-MOR-12-c"></a>
#### API-MOR-12-c · `GET /api/admin/mor/early-payment-discounts/{id}`

- **Qué hace:** ABM de descuentos por pronto pago. Obtiene el detalle de un registro de `early-payment-discounts`.
- **Para qué sirve:** RF-MOR-031: Aplicar descuento por pronto pago antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.descuentosProntoPago.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-06 (Descuentos por pronto pago).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-12-c)

<a id="API-MOR-12-d"></a>
#### API-MOR-12-d · `PATCH /api/admin/mor/early-payment-discounts/{id}`

- **Qué hace:** ABM de descuentos por pronto pago. Modifica algunos campos de un registro de `early-payment-discounts` (solo los enviados).
- **Para qué sirve:** RF-MOR-031: Aplicar descuento por pronto pago antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.descuentosProntoPago.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-06 (Descuentos por pronto pago).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-12-d)

<a id="API-MOR-13"></a>
#### API-MOR-13 · `POST /api/admin/mor/quotes`

- **Qué hace:** Cotizar recargo de documentos a una fecha. Registra un nuevo elemento u operación en `quotes`.
- **Para qué sirve:** RF-MOR-207: El socio ve su deuda vencida con recargo cotizado a hoy, el detalle del cálculo y los importes por vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cotizacion.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-07 (Cotizar recargo).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2088 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-13)

<a id="API-MOR-14"></a>
#### API-MOR-14 · `GET /api/admin/mor/calculations/{id}`

- **Qué hace:** Ver cálculo registrado con tramos. Obtiene el detalle de un registro de cálculos de interés inmutables (`interestCalculations`).
- **Para qué sirve:** RF-MOR-051: Calcular el interés por tramos entre pagos sucesivos con el saldo vigente en cada tramo: escalones entre vencimientos dentro del tramo y, luego del último vencimiento, saldo × días × tasa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cotizacion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cálculos de interés inmutables (`interestCalculations`).
- **Pantallas:** PAN-MOR-07 (Cotizar recargo).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2089 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-14)

<a id="API-MOR-15"></a>
#### API-MOR-15 · `POST /api/admin/mor/quotes/{id}/waiver`

- **Qué hace:** Solicitar dispensa del recargo. Registra «waiver» sobre un registro de `waiver`.
- **Para qué sirve:** RF-MOR-034: Permitir la dispensa del recargo en caja con solicitud del cajero y aprobación del supervisor, motivo y registro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.dispensaRecargo.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2090 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-15)

<a id="API-MOR-16"></a>
#### API-MOR-16 · `POST /api/admin/mor/waivers/{id}/approve`

- **Qué hace:** Aprobar/rechazar dispensa. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-MOR-034: Permitir la dispensa del recargo en caja con solicitud del cajero y aprobación del supervisor, motivo y registro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.dispensaRecargo.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-16)

<a id="API-MOR-17"></a>
#### API-MOR-17 · `GET /api/admin/mor/interest-runs`

- **Qué hace:** Listar / crear corrida (draft + preview) Lista, con filtros y paginación, los registros de `interest-runs`.
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-17)

<a id="API-MOR-17-b"></a>
#### API-MOR-17-b · `POST /api/admin/mor/interest-runs`

- **Qué hace:** Listar / crear corrida (draft + preview) Registra un nuevo elemento u operación en `interest-runs`.
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-17-b)

<a id="API-MOR-18"></a>
#### API-MOR-18 · `GET /api/admin/mor/interest-runs/{id}/items`

- **Qué hace:** Preliminar paginado. Lista, con filtros y paginación, los registros de ítems de la corrida (`interestBillingRunItems`).
- **Para qué sirve:** RF-MOR-055: Generar preliminar con detalle por documento y tramo; el operador puede destildar tramos o documentos; solo lo seleccionado se factura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ítems de la corrida (`interestBillingRunItems`) con `total`.
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2093 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-18)

<a id="API-MOR-19"></a>
#### API-MOR-19 · `PATCH /api/admin/mor/interest-runs/{id}/items/selection`

- **Qué hace:** Tildar/destildar documentos o tramos. Modifica algunos campos de un registro de ítems de la corrida (`interestBillingRunItems`) (solo los enviados).
- **Para qué sirve:** RF-MOR-055: Generar preliminar con detalle por documento y tramo; el operador puede destildar tramos o documentos; solo lo seleccionado se factura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.simular`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ítems de la corrida (`interestBillingRunItems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ítems de la corrida (`interestBillingRunItems`).
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2094 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-19)

<a id="API-MOR-20"></a>
#### API-MOR-20 · `POST /api/admin/mor/interest-runs/{id}/approve`

- **Qué hace:** Aprobar corrida. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2095 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-20)

<a id="API-MOR-21"></a>
#### API-MOR-21 · `POST /api/admin/mor/interest-runs/{id}/generate`

- **Qué hace:** Generar cargos (job) Genera un registro de `generate`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-049: Ejecutar una corrida de intereses a facturar con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2096 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-21)

<a id="API-MOR-22"></a>
#### API-MOR-22 · `POST /api/admin/mor/interest-runs/{id}/cancel`

- **Qué hace:** Cancelar corrida. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interesesFacturar.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-08 (Corridas de intereses a facturar).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2097 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-22)

<a id="API-MOR-23"></a>
#### API-MOR-23 · `GET /api/admin/mor/holds`

- **Qué hace:** Listar / aplicar bloqueos (individual o masivo) Lista, con filtros y paginación, los registros de bloqueos de documentos (`documentHolds`).
- **Para qué sirve:** RF-MOR-059: Bloquear y desbloquear documentos por causa (catálogo), individual o masivamente, con historial (causa, fecha, usuario). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.bloqueos.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bloqueos de documentos (`documentHolds`) con `total`.
- **Pantallas:** PAN-MOR-09 (Bloqueos de documentos).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2098 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-23)

<a id="API-MOR-23-b"></a>
#### API-MOR-23-b · `POST /api/admin/mor/holds`

- **Qué hace:** Listar / aplicar bloqueos (individual o masivo) Da de alta un registro de bloqueos de documentos (`documentHolds`).
- **Para qué sirve:** RF-MOR-059: Bloquear y desbloquear documentos por causa (catálogo), individual o masivamente, con historial (causa, fecha, usuario). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.bloqueos.crear`.
- **Recibe:** los datos de bloqueos de documentos (`documentHolds`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de bloqueos de documentos (`documentHolds`).
- **Pantallas:** PAN-MOR-09 (Bloqueos de documentos).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2098 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-23-b)

<a id="API-MOR-24"></a>
#### API-MOR-24 · `POST /api/admin/mor/holds/{id}/release`

- **Qué hace:** Liberar bloqueo (opcional con interés) Libera un registro de bloqueos de documentos (`documentHolds`).
- **Para qué sirve:** RF-MOR-061: Desbloquear con interés: al liberar, calcular un porcentaje configurado y generar el cargo con concepto y tipo de documento propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.bloqueos.liberar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-09 (Bloqueos de documentos).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-24)

<a id="API-MOR-25"></a>
#### API-MOR-25 · `GET /api/admin/mor/hold-reasons`

- **Qué hace:** ABM de causas de bloqueo. Lista, con filtros y paginación, los registros de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`) con `total`.
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-25)

<a id="API-MOR-25-b"></a>
#### API-MOR-25-b · `POST /api/admin/mor/hold-reasons`

- **Qué hace:** ABM de causas de bloqueo. Da de alta un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** los datos de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-25-b)

<a id="API-MOR-25-c"></a>
#### API-MOR-25-c · `GET /api/admin/mor/hold-reasons/{id}`

- **Qué hace:** ABM de causas de bloqueo. Obtiene el detalle de un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-25-c)

<a id="API-MOR-25-d"></a>
#### API-MOR-25-d · `PATCH /api/admin/mor/hold-reasons/{id}`

- **Qué hace:** ABM de causas de bloqueo. Modifica algunos campos de un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`) (solo los enviados).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-25-d)

<a id="API-MOR-26"></a>
#### API-MOR-26 · `GET /api/admin/mor/delinquency-policies`

- **Qué hace:** ABM de políticas de mora. Lista, con filtros y paginación, los registros de políticas de mora (`delinquencyPolicies`).
- **Para qué sirve:** RF-MOR-026: Separar el interés entre vencimientos del interés por mora cuando la política lo indica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasMora.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de mora (`delinquencyPolicies`) con `total`.
- **Pantallas:** PAN-MOR-10 (Políticas de mora por servicio y categoría).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-26)

<a id="API-MOR-26-b"></a>
#### API-MOR-26-b · `POST /api/admin/mor/delinquency-policies`

- **Qué hace:** ABM de políticas de mora. Da de alta un registro de políticas de mora (`delinquencyPolicies`).
- **Para qué sirve:** RF-MOR-026: Separar el interés entre vencimientos del interés por mora cuando la política lo indica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasMora.configurar`.
- **Recibe:** los datos de políticas de mora (`delinquencyPolicies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de políticas de mora (`delinquencyPolicies`).
- **Pantallas:** PAN-MOR-10 (Políticas de mora por servicio y categoría).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-26-b)

<a id="API-MOR-26-c"></a>
#### API-MOR-26-c · `GET /api/admin/mor/delinquency-policies/{id}`

- **Qué hace:** ABM de políticas de mora. Obtiene el detalle de un registro de políticas de mora (`delinquencyPolicies`).
- **Para qué sirve:** RF-MOR-026: Separar el interés entre vencimientos del interés por mora cuando la política lo indica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasMora.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de políticas de mora (`delinquencyPolicies`).
- **Pantallas:** PAN-MOR-10 (Políticas de mora por servicio y categoría).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-26-c)

<a id="API-MOR-26-d"></a>
#### API-MOR-26-d · `PATCH /api/admin/mor/delinquency-policies/{id}`

- **Qué hace:** ABM de políticas de mora. Modifica algunos campos de un registro de políticas de mora (`delinquencyPolicies`) (solo los enviados).
- **Para qué sirve:** RF-MOR-026: Separar el interés entre vencimientos del interés por mora cuando la política lo indica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasMora.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de políticas de mora (`delinquencyPolicies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de políticas de mora (`delinquencyPolicies`).
- **Pantallas:** PAN-MOR-10 (Políticas de mora por servicio y categoría).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-26-d)

<a id="API-MOR-27"></a>
#### API-MOR-27 · `POST /api/admin/mor/delinquency-policies/{id}/publish`

- **Qué hace:** Publicar política. Publica un registro de políticas de mora (`delinquencyPolicies`).
- **Para qué sirve:** RF-MOR-074: Versionar, auditar y publicar la política con fecha efectiva; un cambio no altera evaluaciones ya cerradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.politicasMora.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-10 (Políticas de mora por servicio y categoría).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2102 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-27)

<a id="API-MOR-29"></a>
#### API-MOR-29 · `GET /api/admin/mor/evaluations`

- **Qué hace:** Consultar evaluaciones. Lista, con filtros y paginación, los registros de evaluaciones de mora (`delinquencyEvaluations`).
- **Para qué sirve:** RF-MOR-191: Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.evaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de evaluaciones de mora (`delinquencyEvaluations`) con `total`.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-29)

<a id="API-MOR-28"></a>
#### API-MOR-28 · `POST /api/admin/mor/evaluations`

- **Qué hace:** Evaluar una cuenta o universo a una fecha. Da de alta un registro de evaluaciones de mora (`delinquencyEvaluations`).
- **Para qué sirve:** RF-MOR-072: Ejecutar la evaluación de mora (job o a demanda) por cuenta y fecha, conservando obligaciones consideradas, pagos confirmados e imputación exacta por factura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.evaluaciones.ejecutar`.
- **Recibe:** los datos de evaluaciones de mora (`delinquencyEvaluations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de evaluaciones de mora (`delinquencyEvaluations`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-28)

<a id="API-MOR-29-b"></a>
#### API-MOR-29-b · `GET /api/admin/mor/evaluations/{id}`

- **Qué hace:** Consultar evaluaciones. Obtiene el detalle de un registro de evaluaciones de mora (`delinquencyEvaluations`).
- **Para qué sirve:** RF-MOR-191: Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.evaluaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de evaluaciones de mora (`delinquencyEvaluations`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-29-b)

<a id="API-MOR-30"></a>
#### API-MOR-30 · `GET /api/admin/mor/stages`

- **Qué hace:** ABM de instancias. Lista, con filtros y paginación, los registros de instancias de mora (`delinquencyStages`).
- **Para qué sirve:** RF-MOR-076: Marcar en las instancias cuál es la de candidatos, la inicial de mora, la sensible (riesgo de corte) y la de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.instancias.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de instancias de mora (`delinquencyStages`) con `total`.
- **Pantallas:** PAN-MOR-11 (Instancias de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-30)

<a id="API-MOR-30-b"></a>
#### API-MOR-30-b · `POST /api/admin/mor/stages`

- **Qué hace:** ABM de instancias. Da de alta un registro de instancias de mora (`delinquencyStages`).
- **Para qué sirve:** RF-MOR-076: Marcar en las instancias cuál es la de candidatos, la inicial de mora, la sensible (riesgo de corte) y la de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.instancias.configurar`.
- **Recibe:** los datos de instancias de mora (`delinquencyStages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de instancias de mora (`delinquencyStages`).
- **Pantallas:** PAN-MOR-11 (Instancias de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-30-b)

<a id="API-MOR-30-c"></a>
#### API-MOR-30-c · `GET /api/admin/mor/stages/{id}`

- **Qué hace:** ABM de instancias. Obtiene el detalle de un registro de instancias de mora (`delinquencyStages`).
- **Para qué sirve:** RF-MOR-076: Marcar en las instancias cuál es la de candidatos, la inicial de mora, la sensible (riesgo de corte) y la de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.instancias.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de instancias de mora (`delinquencyStages`).
- **Pantallas:** PAN-MOR-11 (Instancias de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-30-c)

<a id="API-MOR-30-d"></a>
#### API-MOR-30-d · `PATCH /api/admin/mor/stages/{id}`

- **Qué hace:** ABM de instancias. Modifica algunos campos de un registro de instancias de mora (`delinquencyStages`) (solo los enviados).
- **Para qué sirve:** RF-MOR-076: Marcar en las instancias cuál es la de candidatos, la inicial de mora, la sensible (riesgo de corte) y la de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.instancias.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de instancias de mora (`delinquencyStages`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de instancias de mora (`delinquencyStages`).
- **Pantallas:** PAN-MOR-11 (Instancias de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-30-d)

<a id="API-MOR-31"></a>
#### API-MOR-31 · `GET /api/admin/mor/notice-models`

- **Qué hace:** ABM de modelos de aviso (versionados) Lista, con filtros y paginación, los registros de modelos de aviso (`delinquencyNoticeModels`).
- **Para qué sirve:** RF-MOR-088: Definir modelos de aviso por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.modelosAviso.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de aviso (`delinquencyNoticeModels`) con `total`.
- **Pantallas:** PAN-MOR-12 (Modelos de aviso).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-31)

<a id="API-MOR-31-b"></a>
#### API-MOR-31-b · `POST /api/admin/mor/notice-models`

- **Qué hace:** ABM de modelos de aviso (versionados) Da de alta un registro de modelos de aviso (`delinquencyNoticeModels`).
- **Para qué sirve:** RF-MOR-088: Definir modelos de aviso por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.modelosAviso.configurar`.
- **Recibe:** los datos de modelos de aviso (`delinquencyNoticeModels`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de modelos de aviso (`delinquencyNoticeModels`).
- **Pantallas:** PAN-MOR-12 (Modelos de aviso).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-31-b)

<a id="API-MOR-31-c"></a>
#### API-MOR-31-c · `GET /api/admin/mor/notice-models/{id}`

- **Qué hace:** ABM de modelos de aviso (versionados) Obtiene el detalle de un registro de modelos de aviso (`delinquencyNoticeModels`).
- **Para qué sirve:** RF-MOR-088: Definir modelos de aviso por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.modelosAviso.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de modelos de aviso (`delinquencyNoticeModels`).
- **Pantallas:** PAN-MOR-12 (Modelos de aviso).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-31-c)

<a id="API-MOR-31-d"></a>
#### API-MOR-31-d · `PATCH /api/admin/mor/notice-models/{id}`

- **Qué hace:** ABM de modelos de aviso (versionados) Modifica algunos campos de un registro de modelos de aviso (`delinquencyNoticeModels`) (solo los enviados).
- **Para qué sirve:** RF-MOR-088: Definir modelos de aviso por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.modelosAviso.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de modelos de aviso (`delinquencyNoticeModels`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de aviso (`delinquencyNoticeModels`).
- **Pantallas:** PAN-MOR-12 (Modelos de aviso).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-31-d)

<a id="API-MOR-32"></a>
#### API-MOR-32 · `POST /api/admin/mor/candidates/preview`

- **Qué hace:** Previsualizar candidatos con exclusiones. Previsualiza sin efectos sobre `preview`.
- **Para qué sirve:** RF-MOR-073: La evaluación no ejecuta cortes: genera candidatos, notificaciones o propuestas de interrupción según la política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.candidatos.generar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-13 (Generar notificaciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-32)

<a id="API-MOR-33"></a>
#### API-MOR-33 · `POST /api/admin/mor/batches`

- **Qué hace:** Crear lote (generar candidatos o procesar instancia) Registra un nuevo elemento u operación en lotes de mora (`delinquencyBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-080: Crear la notificación de candidato con lote nuevo, documentos incluidos con su saldo, deuda (suma de saldos) y deuda actualizada (con intereses sin diferir); no crear si la deuda es 0. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.candidatos.generar`.
- **Recibe:** los datos de lotes de mora (`delinquencyBatches`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-MOR-13 (Generar notificaciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-33)

<a id="API-MOR-34"></a>
#### API-MOR-34 · `POST /api/admin/mor/batches/{id}/annul`

- **Qué hace:** Anular lote. Anula un registro de lotes de mora (`delinquencyBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-215: Operaciones especiales auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.lotes.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-34)

<a id="API-MOR-35"></a>
#### API-MOR-35 · `GET /api/admin/mor/notices`

- **Qué hace:** Buscar notificaciones (filtros de RF-MOR-083) Lista, con filtros y paginación, los registros de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-083: Procesar notificaciones abiertas hacia la instancia destino con filtros: vencidas al (vencimiento de la notificación), fecha, lote, cuenta, servicio, tipo de documento, barrio, localidad, empresa postal, deuda anterior a una…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de notificaciones de mora con promesa embebida (`delinquencyNotices`) con `total`.
- **Pantallas:** PAN-MOR-14 (Gestión de notificaciones), PAN-MOR-21 (Consulta de notificaciones por cuenta).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2110 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-35)

<a id="API-MOR-36"></a>
#### API-MOR-36 · `GET /api/admin/mor/notices/{id}`

- **Qué hace:** Ficha con ítems, deuda actualizada, bitácora. Obtiene el detalle de un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-045: En cuotas de convenio, los ítems de interés se copian por subtipo (financiación actual, anterior, mora) y se relacionan con el convenio. · RF-MOR-085: Agregar una nota en la cuenta "Notificación de mora" (y "Notificación cerrada" al cerrar) visible en la ficha del titular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Pantallas:** PAN-MOR-14 (Gestión de notificaciones), PAN-MOR-21 (Consulta de notificaciones por cuenta).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2111 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-36)

<a id="API-MOR-37"></a>
#### API-MOR-37 · `POST /api/admin/mor/notices/delivery`

- **Qué hace:** Marcar/desmarcar entrega con evidencia (lote de ids) Registra un nuevo elemento u operación en notificaciones de mora con promesa embebida (`delinquencyNotices`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-092: Marcar entrega manual o automática (y "todas entregadas"); con la entrega, el vencimiento de la notificación pasa a fecha de entrega + días configurados, solo extendiéndolo; desmarcar no revierte el vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.marcarEntrega`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-MOR-16 (Marcar entrega y constancias).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-37)

<a id="API-MOR-38"></a>
#### API-MOR-38 · `POST /api/admin/mor/notices/{id}/promise`

- **Qué hace:** Registrar promesa de pago. Registra una promesa de pago sobre un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-210: El socio registra una promesa de pago si la política lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.promesa`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-38)

<a id="API-MOR-39"></a>
#### API-MOR-39 · `POST /api/admin/mor/notices/{id}/rating`

- **Qué hace:** Calificar. Registra «rating» sobre un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-095: Calificar al deudor (Sin calificar, Buena, Regular, Mala) y consultar el historial de notificaciones calificadas como antecedente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.calificar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-17 (Antecedentes y calificación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-39)

<a id="API-MOR-40"></a>
#### API-MOR-40 · `POST /api/admin/mor/notices/exclude`

- **Qué hace:** Dar de baja con causa (lote) Excluye sobre notificaciones de mora con promesa embebida (`delinquencyNotices`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-096: Dar de baja una notificación con causa (Excluida), cerrar notificaciones (con bloqueo de caja opcional), anular un lote (reabre el anterior) y eliminar notificaciones sin efectos económicos, todo auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.darBaja`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2115 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-40)

<a id="API-MOR-41"></a>
#### API-MOR-41 · `POST /api/admin/mor/notices/close`

- **Qué hace:** Cerrar notificaciones (lote, bloqueo opcional) Cierra sobre notificaciones de mora con promesa embebida (`delinquencyNotices`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-096: Dar de baja una notificación con causa (Excluida), cerrar notificaciones (con bloqueo de caja opcional), anular un lote (reabre el anterior) y eliminar notificaciones sin efectos económicos, todo auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.cerrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2116 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-41)

<a id="API-MOR-42"></a>
#### API-MOR-42 · `POST /api/admin/mor/notices/print`

- **Qué hace:** Generar PDF agrupado por titular u individual. Imprime sobre notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-056: Generar un cargo por cuenta (agrupado por situación de IVA, cuenta y titular) con un ítem por documento, destinado a la próxima factura; procesar en bloques con progreso, reanudable e idempotente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.imprimir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-42)

<a id="API-MOR-43"></a>
#### API-MOR-43 · `POST /api/admin/mor/notices/export`

- **Qué hace:** Exportar circulares / archivo para envío masivo. Exporta sobre notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-203: Exportación a herramientas de envío masivo (cuenta, cantidad de comprobantes, deuda, deuda actualizada, correo) cuando el envío no se haga por T09. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2118 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-43)

<a id="API-MOR-44"></a>
#### API-MOR-44 · `GET /api/admin/mor/notices/missing-recipients`

- **Qué hace:** Cuentas sin correo o celular para un canal. Consulta notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-090: Antes de enviar por correo o SMS, listar las cuentas sin dirección o sin celular (por defecto, sin ambos correos: el de la cuenta y el del portal) y permitir descartarlas o derivarlas a otro canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.notificaciones.procesar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Pantallas:** PAN-MOR-15 (Notificar/avanzar instancia).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-44)

<a id="API-MOR-45"></a>
#### API-MOR-45 · `POST /api/admin/mor/special-operations/notices/{id}/resolve`

- **Qué hace:** Resolver o eliminar (lógico) notificación sin efectos. Resuelve un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-215: Operaciones especiales auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.operacionesEspeciales.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-22 (Operaciones especiales).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-45)

<a id="API-MOR-45-b"></a>
#### API-MOR-45-b · `POST /api/admin/mor/special-operations/notices/{id}/delete`

- **Qué hace:** Resolver o eliminar (lógico) notificación sin efectos. Elimina un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-215: Operaciones especiales auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.operacionesEspeciales.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-22 (Operaciones especiales).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-45-b)

<a id="API-MOR-46"></a>
#### API-MOR-46 · `GET /api/admin/mor/exceptions`

- **Qué hace:** ABM de excepciones. Lista, con filtros y paginación, los registros de excepciones de mora (`delinquencyExceptions`).
- **Para qué sirve:** RF-MOR-078: Excluir cuentas con excepción de mora vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de excepciones de mora (`delinquencyExceptions`) con `total`.
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-46)

<a id="API-MOR-46-b"></a>
#### API-MOR-46-b · `POST /api/admin/mor/exceptions`

- **Qué hace:** ABM de excepciones. Da de alta un registro de excepciones de mora (`delinquencyExceptions`).
- **Para qué sirve:** RF-MOR-078: Excluir cuentas con excepción de mora vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.editar`.
- **Recibe:** los datos de excepciones de mora (`delinquencyExceptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de excepciones de mora (`delinquencyExceptions`).
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-46-b)

<a id="API-MOR-46-c"></a>
#### API-MOR-46-c · `GET /api/admin/mor/exceptions/{id}`

- **Qué hace:** ABM de excepciones. Obtiene el detalle de un registro de excepciones de mora (`delinquencyExceptions`).
- **Para qué sirve:** RF-MOR-078: Excluir cuentas con excepción de mora vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de excepciones de mora (`delinquencyExceptions`).
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-46-c)

<a id="API-MOR-46-d"></a>
#### API-MOR-46-d · `PATCH /api/admin/mor/exceptions/{id}`

- **Qué hace:** ABM de excepciones. Modifica algunos campos de un registro de excepciones de mora (`delinquencyExceptions`) (solo los enviados).
- **Para qué sirve:** RF-MOR-078: Excluir cuentas con excepción de mora vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de excepciones de mora (`delinquencyExceptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de excepciones de mora (`delinquencyExceptions`).
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-46-d)

<a id="API-MOR-47"></a>
#### API-MOR-47 · `POST /api/admin/mor/exceptions/{id}/authorize`

- **Qué hace:** Autorizar / desautorizar. Autoriza un registro de excepciones de mora (`delinquencyExceptions`).
- **Para qué sirve:** RF-MOR-110: Autorizar y desautorizar excepciones (doble control), con nota en la cuenta e impresión opcional del informe al confirmar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-47)

<a id="API-MOR-47-b"></a>
#### API-MOR-47-b · `POST /api/admin/mor/exceptions/{id}/revoke`

- **Qué hace:** Autorizar / desautorizar. Revoca un registro de excepciones de mora (`delinquencyExceptions`).
- **Para qué sirve:** RF-MOR-110: Autorizar y desautorizar excepciones (doble control), con nota en la cuenta e impresión opcional del informe al confirmar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.excepciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-23 (Excepciones de mora).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-47-b)

<a id="API-MOR-48"></a>
#### API-MOR-48 · `GET /api/admin/mor/protections`

- **Qué hace:** ABM de protecciones normativas. Lista, con filtros y paginación, los registros de protecciones normativas acreditadas (`serviceProtections`).
- **Para qué sirve:** RF-MOR-111: Administrar protecciones normativas acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.protecciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de protecciones normativas acreditadas (`serviceProtections`) con `total`.
- **Pantallas:** PAN-MOR-24 (Protecciones normativas).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-48)

<a id="API-MOR-48-b"></a>
#### API-MOR-48-b · `POST /api/admin/mor/protections`

- **Qué hace:** ABM de protecciones normativas. Da de alta un registro de protecciones normativas acreditadas (`serviceProtections`).
- **Para qué sirve:** RF-MOR-111: Administrar protecciones normativas acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.protecciones.editar`.
- **Recibe:** los datos de protecciones normativas acreditadas (`serviceProtections`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de protecciones normativas acreditadas (`serviceProtections`).
- **Pantallas:** PAN-MOR-24 (Protecciones normativas).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-48-b)

<a id="API-MOR-48-c"></a>
#### API-MOR-48-c · `GET /api/admin/mor/protections/{id}`

- **Qué hace:** ABM de protecciones normativas. Obtiene el detalle de un registro de protecciones normativas acreditadas (`serviceProtections`).
- **Para qué sirve:** RF-MOR-111: Administrar protecciones normativas acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.protecciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de protecciones normativas acreditadas (`serviceProtections`).
- **Pantallas:** PAN-MOR-24 (Protecciones normativas).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-48-c)

<a id="API-MOR-48-d"></a>
#### API-MOR-48-d · `PATCH /api/admin/mor/protections/{id}`

- **Qué hace:** ABM de protecciones normativas. Modifica algunos campos de un registro de protecciones normativas acreditadas (`serviceProtections`) (solo los enviados).
- **Para qué sirve:** RF-MOR-111: Administrar protecciones normativas acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.protecciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de protecciones normativas acreditadas (`serviceProtections`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de protecciones normativas acreditadas (`serviceProtections`).
- **Pantallas:** PAN-MOR-24 (Protecciones normativas).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-48-d)

<a id="API-MOR-49"></a>
#### API-MOR-49 · `POST /api/admin/mor/protections/{id}/verify`

- **Qué hace:** Verificar protección. Verifica un registro de protecciones normativas acreditadas (`serviceProtections`).
- **Para qué sirve:** RF-MOR-102: Toda acción pasa por la evaluación normativa del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. · RF-MOR-111: Administrar protecciones normativas acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.protecciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-24 (Protecciones normativas).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2124 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-49)

<a id="API-MOR-50"></a>
#### API-MOR-50 · `GET /api/admin/mor/restriction-rules`

- **Qué hace:** ABM de matriz (las normative solo con capability normativa) Lista, con filtros y paginación, los registros de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-102: Toda acción pasa por la evaluación normativa del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.restricciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de matriz de restricciones de suspensión (`suspensionRestrictionRules`) con `total`.
- **Pantallas:** PAN-MOR-25 (Matriz de restricciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-50)

<a id="API-MOR-50-b"></a>
#### API-MOR-50-b · `POST /api/admin/mor/restriction-rules`

- **Qué hace:** ABM de matriz (las normative solo con capability normativa) Da de alta un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-102: Toda acción pasa por la evaluación normativa del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.restricciones.configurar`.
- **Recibe:** los datos de matriz de restricciones de suspensión (`suspensionRestrictionRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Pantallas:** PAN-MOR-25 (Matriz de restricciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-50-b)

<a id="API-MOR-50-c"></a>
#### API-MOR-50-c · `GET /api/admin/mor/restriction-rules/{id}`

- **Qué hace:** ABM de matriz (las normative solo con capability normativa) Obtiene el detalle de un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-102: Toda acción pasa por la evaluación normativa del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.restricciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Pantallas:** PAN-MOR-25 (Matriz de restricciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-50-c)

<a id="API-MOR-50-d"></a>
#### API-MOR-50-d · `PATCH /api/admin/mor/restriction-rules/{id}`

- **Qué hace:** ABM de matriz (las normative solo con capability normativa) Modifica algunos campos de un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`) (solo los enviados).
- **Para qué sirve:** RF-MOR-102: Toda acción pasa por la evaluación normativa del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.restricciones.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de matriz de restricciones de suspensión (`suspensionRestrictionRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Pantallas:** PAN-MOR-25 (Matriz de restricciones).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-50-d)

<a id="API-MOR-51"></a>
#### API-MOR-51 · `GET /api/platform/mor/restriction-rules`

- **Qué hace:** Catálogo normativo base por jurisdicción. Lista, con filtros y paginación, los registros de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-221: Precargar en el catálogo normativo de plataforma (API-MOR-51) la plantilla de ventana de corte ERSeP para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica…
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mor.plataforma.restricciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de matriz de restricciones de suspensión (`suspensionRestrictionRules`) con `total`.
- **Ola:** O7 · **Fuente:** M08 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-51)

<a id="API-MOR-51-b"></a>
#### API-MOR-51-b · `POST /api/platform/mor/restriction-rules`

- **Qué hace:** Catálogo normativo base por jurisdicción. Da de alta un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-221: Precargar en el catálogo normativo de plataforma (API-MOR-51) la plantilla de ventana de corte ERSeP para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica…
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mor.plataforma.restricciones.configurar`.
- **Recibe:** los datos de matriz de restricciones de suspensión (`suspensionRestrictionRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Ola:** O7 · **Fuente:** M08 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-51-b)

<a id="API-MOR-51-c"></a>
#### API-MOR-51-c · `GET /api/platform/mor/restriction-rules/{id}`

- **Qué hace:** Catálogo normativo base por jurisdicción. Obtiene el detalle de un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Para qué sirve:** RF-MOR-221: Precargar en el catálogo normativo de plataforma (API-MOR-51) la plantilla de ventana de corte ERSeP para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica…
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mor.plataforma.restricciones.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Ola:** O7 · **Fuente:** M08 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-51-c)

<a id="API-MOR-51-d"></a>
#### API-MOR-51-d · `PATCH /api/platform/mor/restriction-rules/{id}`

- **Qué hace:** Catálogo normativo base por jurisdicción. Modifica algunos campos de un registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`) (solo los enviados).
- **Para qué sirve:** RF-MOR-221: Precargar en el catálogo normativo de plataforma (API-MOR-51) la plantilla de ventana de corte ERSeP para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica…
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mor.plataforma.restricciones.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de matriz de restricciones de suspensión (`suspensionRestrictionRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de matriz de restricciones de suspensión (`suspensionRestrictionRules`).
- **Ola:** O7 · **Fuente:** M08 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-51-d)

<a id="API-MOR-52"></a>
#### API-MOR-52 · `GET /api/admin/mor/reasons`

- **Qué hace:** ABM de causas. Lista, con filtros y paginación, los registros de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`) con `total`.
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-52)

<a id="API-MOR-52-b"></a>
#### API-MOR-52-b · `POST /api/admin/mor/reasons`

- **Qué hace:** ABM de causas. Da de alta un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** los datos de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-52-b)

<a id="API-MOR-52-c"></a>
#### API-MOR-52-c · `GET /api/admin/mor/reasons/{id}`

- **Qué hace:** ABM de causas. Obtiene el detalle de un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-52-c)

<a id="API-MOR-52-d"></a>
#### API-MOR-52-d · `PATCH /api/admin/mor/reasons/{id}`

- **Qué hace:** ABM de causas. Modifica algunos campos de un registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`) (solo los enviados).
- **Para qué sirve:** RF-MOR-116: Administrar causas codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.causas.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de motivos de bloqueo de documento, cuenta o contrato (`holdReasons`).
- **Pantallas:** PAN-FAC-17 (Causas de bloqueo), PAN-MOR-26 (Causas de baja).
- **Ola:** O5 · **Fuente:** M08 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-52-d)

<a id="API-MOR-53"></a>
#### API-MOR-53 · `GET /api/admin/mor/treatment/services`

- **Qué hace:** Servicios elegibles de notificaciones vencidas. Consulta `services`.
- **Para qué sirve:** RF-MOR-068: Definir el saldo elegible para mora: capital vencido, cargos autorizados, exclusiones, convenios y créditos. Los conceptos de terceros se excluyen por defecto y solo se incluyen si el convenio con el tercero lo autoriza… · RF-MOR-122: Reconexión automática al regularizar: evaluar con el criterio de deuda configurado (toda, vencida al VTO1, vencida al último vencimiento, solo del mismo servicio/tipo, o sin notificaciones abiertas con deuda del servicio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tratamiento.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-19 (Tratamiento de morosos).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2128 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-53)

<a id="API-MOR-55"></a>
#### API-MOR-55 · `GET /api/admin/mor/interruption-cases`

- **Qué hace:** Listar / ficha. Lista, con filtros y paginación, los registros de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de suspensión, corte, reconexión, baja por mora (`interruptionCases`) con `total`.
- **Pantallas:** PAN-MOR-27 (Casos de interrupción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-55)

<a id="API-MOR-54"></a>
#### API-MOR-54 · `POST /api/admin/mor/interruption-cases`

- **Qué hace:** Crear caso(s) de interrupción (evalúa) Da de alta un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-073: La evaluación no ejecuta cortes: genera candidatos, notificaciones o propuestas de interrupción según la política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tratamiento.ejecutar`.
- **Recibe:** los datos de suspensión, corte, reconexión, baja por mora (`interruptionCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Pantallas:** PAN-MOR-19 (Tratamiento de morosos), PAN-MOR-20 (Orden de interrupción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2129 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-54)

<a id="API-MOR-55-b"></a>
#### API-MOR-55-b · `GET /api/admin/mor/interruption-cases/{id}`

- **Qué hace:** Listar / ficha. Obtiene el detalle de un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Pantallas:** PAN-MOR-27 (Casos de interrupción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-55-b)

<a id="API-MOR-56"></a>
#### API-MOR-56 · `POST /api/admin/mor/interruption-cases/{id}/approve`

- **Qué hace:** Aprobar / rechazar. Aprueba un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2131 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-56)

<a id="API-MOR-56-b"></a>
#### API-MOR-56-b · `POST /api/admin/mor/interruption-cases/{id}/reject`

- **Qué hace:** Aprobar / rechazar. Rechaza un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2131 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-56-b)

<a id="API-MOR-57"></a>
#### API-MOR-57 · `POST /api/admin/mor/interruption-cases/{id}/cancel`

- **Qué hace:** Cancelar, reprogramar, reintentar. Cancela un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2132 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-57)

<a id="API-MOR-57-b"></a>
#### API-MOR-57-b · `POST /api/admin/mor/interruption-cases/{id}/reschedule`

- **Qué hace:** Cancelar, reprogramar, reintentar. Reprograma un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2132 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-57-b)

<a id="API-MOR-57-c"></a>
#### API-MOR-57-c · `POST /api/admin/mor/interruption-cases/{id}/retry`

- **Qué hace:** Cancelar, reprogramar, reintentar. Reintenta un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-123: La reconexión automática aplica solo a servicios suspendidos por mora vinculados a un caso de interrupción (no por ventana de días). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.interrupciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2132 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-57-c)

<a id="API-MOR-58"></a>
#### API-MOR-58 · `POST /api/admin/mor/interruption-cases/{id}/confirm-direct`

- **Qué hace:** Confirmar ejecución directa (servicios sin técnica) Confirma en forma directa un registro de suspensión, corte, reconexión, baja por mora (`interruptionCases`).
- **Para qué sirve:** RF-MOR-103: Si el servicio requiere técnica, generar orden de trabajo hacia M10 con origen "gestión de mora", marca de moroso y vínculo a la notificación y al caso; si no requiere técnica, ejecutar el cambio directo (servicio, adherentes y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.tratamiento.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-19 (Tratamiento de morosos), PAN-MOR-20 (Orden de interrupción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2133 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-58)

<a id="API-MOR-59"></a>
#### API-MOR-59 · `GET /api/admin/mor/interruption-charge-rules`

- **Qué hace:** ABM de reglas de cargos. Lista, con filtros y paginación, los registros de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Para qué sirve:** RF-MOR-139: Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cargosInterrupcion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cargos de suspensión y reconexión (`interruptionChargeRules`) con `total`.
- **Pantallas:** PAN-MOR-28 (Reglas de cargos de suspensión/reconexión).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-59)

<a id="API-MOR-59-b"></a>
#### API-MOR-59-b · `POST /api/admin/mor/interruption-charge-rules`

- **Qué hace:** ABM de reglas de cargos. Da de alta un registro de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Para qué sirve:** RF-MOR-139: Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cargosInterrupcion.configurar`.
- **Recibe:** los datos de cargos de suspensión y reconexión (`interruptionChargeRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Pantallas:** PAN-MOR-28 (Reglas de cargos de suspensión/reconexión).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-59-b)

<a id="API-MOR-59-c"></a>
#### API-MOR-59-c · `GET /api/admin/mor/interruption-charge-rules/{id}`

- **Qué hace:** ABM de reglas de cargos. Obtiene el detalle de un registro de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Para qué sirve:** RF-MOR-139: Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cargosInterrupcion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Pantallas:** PAN-MOR-28 (Reglas de cargos de suspensión/reconexión).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-59-c)

<a id="API-MOR-59-d"></a>
#### API-MOR-59-d · `PATCH /api/admin/mor/interruption-charge-rules/{id}`

- **Qué hace:** ABM de reglas de cargos. Modifica algunos campos de un registro de cargos de suspensión y reconexión (`interruptionChargeRules`) (solo los enviados).
- **Para qué sirve:** RF-MOR-139: Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.cargosInterrupcion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cargos de suspensión y reconexión (`interruptionChargeRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cargos de suspensión y reconexión (`interruptionChargeRules`).
- **Pantallas:** PAN-MOR-28 (Reglas de cargos de suspensión/reconexión).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-59-d)

<a id="API-MOR-60"></a>
#### API-MOR-60 · `GET /api/admin/mor/payment-plans`

- **Qué hace:** ABM de planes. Lista, con filtros y paginación, los registros de planes y tipos de financiación (`paymentPlans`).
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.planesPago.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes y tipos de financiación (`paymentPlans`) con `total`.
- **Pantallas:** PAN-MOR-29 (Planes de pago).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-60)

<a id="API-MOR-60-b"></a>
#### API-MOR-60-b · `POST /api/admin/mor/payment-plans`

- **Qué hace:** ABM de planes. Da de alta un registro de planes y tipos de financiación (`paymentPlans`).
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.planesPago.configurar`.
- **Recibe:** los datos de planes y tipos de financiación (`paymentPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes y tipos de financiación (`paymentPlans`).
- **Pantallas:** PAN-MOR-29 (Planes de pago).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-60-b)

<a id="API-MOR-60-c"></a>
#### API-MOR-60-c · `GET /api/admin/mor/payment-plans/{id}`

- **Qué hace:** ABM de planes. Obtiene el detalle de un registro de planes y tipos de financiación (`paymentPlans`).
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.planesPago.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de planes y tipos de financiación (`paymentPlans`).
- **Pantallas:** PAN-MOR-29 (Planes de pago).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-60-c)

<a id="API-MOR-60-d"></a>
#### API-MOR-60-d · `PATCH /api/admin/mor/payment-plans/{id}`

- **Qué hace:** ABM de planes. Modifica algunos campos de un registro de planes y tipos de financiación (`paymentPlans`) (solo los enviados).
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.planesPago.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de planes y tipos de financiación (`paymentPlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes y tipos de financiación (`paymentPlans`).
- **Pantallas:** PAN-MOR-29 (Planes de pago).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-60-d)

<a id="API-MOR-61"></a>
#### API-MOR-61 · `GET /api/admin/mor/financial-entities`

- **Qué hace:** ABM de entidades financieras. Consulta `financial-entities`.
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.entidadesFinancieras.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-32 (Entidades financieras).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-61)

<a id="API-MOR-61-b"></a>
#### API-MOR-61-b · `POST /api/admin/mor/financial-entities`

- **Qué hace:** ABM de entidades financieras. Registra un nuevo elemento u operación en `financial-entities`.
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.entidadesFinancieras.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-32 (Entidades financieras).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-61-b)

<a id="API-MOR-61-c"></a>
#### API-MOR-61-c · `GET /api/admin/mor/financial-entities/{id}`

- **Qué hace:** ABM de entidades financieras. Obtiene el detalle de un registro de `financial-entities`.
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.entidadesFinancieras.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-32 (Entidades financieras).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-61-c)

<a id="API-MOR-61-d"></a>
#### API-MOR-61-d · `PATCH /api/admin/mor/financial-entities/{id}`

- **Qué hace:** ABM de entidades financieras. Modifica algunos campos de un registro de `financial-entities` (solo los enviados).
- **Para qué sirve:** RF-MOR-174: ABM de entidades financieras (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.entidadesFinancieras.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-32 (Entidades financieras).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-61-d)

<a id="API-MOR-62"></a>
#### API-MOR-62 · `POST /api/admin/mor/simulations`

- **Qué hace:** Simular convenio. Da de alta un registro de simulaciones de convenio (`agreementSimulations`).
- **Para qué sirve:** RF-MOR-004: Permitir cotizaciones sin efecto (consulta de deuda, portal, simulador) con validez hasta el fin del día del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.simulador.usar`.
- **Recibe:** los datos de simulaciones de convenio (`agreementSimulations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de simulaciones de convenio (`agreementSimulations`).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-62)

<a id="API-MOR-64"></a>
#### API-MOR-64 · `GET /api/admin/mor/agreements`

- **Qué hace:** Listar / ficha. Lista, con filtros y paginación, los registros de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-085: Agregar una nota en la cuenta "Notificación de mora" (y "Notificación cerrada" al cerrar) visible en la ficha del titular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de convenios con firmantes embebidos (`agreements`) con `total`.
- **Pantallas:** PAN-MOR-31 (Planes de financiación), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2139 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-64)

<a id="API-MOR-63"></a>
#### API-MOR-63 · `POST /api/admin/mor/agreements`

- **Qué hace:** Crear convenio desde simulación. Da de alta un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-004: Permitir cotizaciones sin efecto (consulta de deuda, portal, simulador) con validez hasta el fin del día del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.crear`.
- **Recibe:** los datos de convenios con firmantes embebidos (`agreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de convenios con firmantes embebidos (`agreements`).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-63)

<a id="API-MOR-64-b"></a>
#### API-MOR-64-b · `GET /api/admin/mor/agreements/{id}`

- **Qué hace:** Listar / ficha. Obtiene el detalle de un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-085: Agregar una nota en la cuenta "Notificación de mora" (y "Notificación cerrada" al cerrar) visible en la ficha del titular. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de convenios con firmantes embebidos (`agreements`).
- **Pantallas:** PAN-MOR-31 (Planes de financiación), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2139 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-64-b)

<a id="API-MOR-65"></a>
#### API-MOR-65 · `POST /api/admin/mor/agreements/{id}/submit-approval`

- **Qué hace:** Workflow de condiciones especiales. Envía a aprobación un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-147: Aprobar condiciones especiales fuera del plan (más cuotas, mayor quita, menor anticipo, tasa distinta) mediante workflow T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-65)

<a id="API-MOR-65-b"></a>
#### API-MOR-65-b · `POST /api/admin/mor/agreements/{id}/approve`

- **Qué hace:** Workflow de condiciones especiales. Aprueba un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-147: Aprobar condiciones especiales fuera del plan (más cuotas, mayor quita, menor anticipo, tasa distinta) mediante workflow T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-65-b)

<a id="API-MOR-65-c"></a>
#### API-MOR-65-c · `POST /api/admin/mor/agreements/{id}/reject`

- **Qué hace:** Workflow de condiciones especiales. Rechaza un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-147: Aprobar condiciones especiales fuera del plan (más cuotas, mayor quita, menor anticipo, tasa distinta) mediante workflow T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-65-c)

<a id="API-MOR-66"></a>
#### API-MOR-66 · `POST /api/admin/mor/agreements/{id}/send-for-signature`

- **Qué hace:** Enviar enlace de firma (OTP) Envía a firma un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-154: Registrar firmantes (titular, codeudor, garantes, representante) y sus firmas (presencial en tableta, aceptación electrónica con OTP y evidencia, firma digital como extensión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.enviarFirma`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2141 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-66)

<a id="API-MOR-67"></a>
#### API-MOR-67 · `POST /api/admin/mor/agreements/{id}/signatures`

- **Qué hace:** Registrar firma presencial. Agrega un elemento («signatures») a un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-154: Registrar firmantes (titular, codeudor, garantes, representante) y sus firmas (presencial en tableta, aceptación electrónica con OTP y evidencia, firma digital como extensión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.registrarFirma`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2142 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-67)

<a id="API-MOR-68"></a>
#### API-MOR-68 · `POST /api/admin/mor/agreements/{id}/early-cancellation/quote`

- **Qué hace:** Cotizar y confirmar cancelación anticipada. Cotiza sobre convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-212: El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.cancelarAnticipado`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2143 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-68)

<a id="API-MOR-68-b"></a>
#### API-MOR-68-b · `POST /api/admin/mor/agreements/{id}/early-cancellation/confirm`

- **Qué hace:** Cotizar y confirmar cancelación anticipada. Confirma sobre convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-212: El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.cancelarAnticipado`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2143 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-68-b)

<a id="API-MOR-69"></a>
#### API-MOR-69 · `POST /api/admin/mor/agreements/{id}/default`

- **Qué hace:** Declarar caducidad / rehabilitar. Registra «default» sobre un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-157: Rehabilitar un convenio caído con aprobación si se regulariza dentro del plazo de la política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.declararCaducidad`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-69)

<a id="API-MOR-69-b"></a>
#### API-MOR-69-b · `POST /api/admin/mor/agreements/{id}/rehabilitate`

- **Qué hace:** Declarar caducidad / rehabilitar. Rehabilita un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-157: Rehabilitar un convenio caído con aprobación si se regulariza dentro del plazo de la política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.declararCaducidad`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-69-b)

<a id="API-MOR-70"></a>
#### API-MOR-70 · `POST /api/admin/mor/agreements/{id}/annul`

- **Qué hace:** Anular (valida RN-MOR-121) Anula un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-215: Operaciones especiales auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2145 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-70)

<a id="API-MOR-71"></a>
#### API-MOR-71 · `POST /api/admin/mor/agreements/{id}/guarantor`

- **Qué hace:** Cambiar garante. Registra «guarantor» sobre un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-180: Cambiar el garante de un convenio con validación (persona válida, firma del nuevo garante) y regenerar la plantilla si cambia el tipo con/sin garante. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2146 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-71)

<a id="API-MOR-72"></a>
#### API-MOR-72 · `POST /api/admin/mor/agreements/fiscal-recalculation`

- **Qué hace:** Detectar y recalcular cuotas por cambio fiscal. Registra un nuevo elemento u operación en convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-162: Recalcular cuotas impagas por cambio de situación de IVA o de alícuota de percepción IIBB del padrón: manteniendo netos (cambia el total) o manteniendo el total (reajusta netos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2147 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-72)

<a id="API-MOR-73"></a>
#### API-MOR-73 · `GET /api/admin/mor/agreements/{id}/documents/{kind}`

- **Qué hace:** PDF convenio, talonario o liquidación. Obtiene el detalle de un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-169: Consultas: cuotas del convenio (todas o a pagar), liquidación de crédito o talonario de cuotas, comprobantes financiados del convenio, conceptos financiados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.convenios.imprimir`.
- **Recibe:** en la ruta `id`, `kind`.
- **Devuelve:** 200: el registro de convenios con firmantes embebidos (`agreements`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2148 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-73)

<a id="API-MOR-74"></a>
#### API-MOR-74 · `GET /api/admin/mor/guarantees`

- **Qué hace:** ABM y acciones de garantías. Lista, con filtros y paginación, los registros de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de garantías y garantes (`guarantees`) con `total`.
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2149 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-74)

<a id="API-MOR-74-b"></a>
#### API-MOR-74-b · `POST /api/admin/mor/guarantees`

- **Qué hace:** ABM y acciones de garantías. Da de alta un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** los datos de garantías y garantes (`guarantees`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de garantías y garantes (`guarantees`).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2149 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-74-b)

<a id="API-MOR-74-c"></a>
#### API-MOR-74-c · `GET /api/admin/mor/guarantees/{id}`

- **Qué hace:** ABM y acciones de garantías. Obtiene el detalle de un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de garantías y garantes (`guarantees`).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2149 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-74-c)

<a id="API-MOR-74-d"></a>
#### API-MOR-74-d · `PATCH /api/admin/mor/guarantees/{id}`

- **Qué hace:** ABM y acciones de garantías. Modifica algunos campos de un registro de garantías y garantes (`guarantees`) (solo los enviados).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de garantías y garantes (`guarantees`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de garantías y garantes (`guarantees`).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2149 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-74-d)

<a id="API-MOR-75"></a>
#### API-MOR-75 · `POST /api/admin/mor/guarantees/{id}/execute`

- **Qué hace:** Acciones sobre garantía. Ejecuta un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-75)

<a id="API-MOR-75-b"></a>
#### API-MOR-75-b · `POST /api/admin/mor/guarantees/{id}/apply`

- **Qué hace:** Acciones sobre garantía. Aplica un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-75-b)

<a id="API-MOR-75-c"></a>
#### API-MOR-75-c · `POST /api/admin/mor/guarantees/{id}/refund`

- **Qué hace:** Acciones sobre garantía. Devuelve el dinero de un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-75-c)

<a id="API-MOR-75-d"></a>
#### API-MOR-75-d · `POST /api/admin/mor/guarantees/{id}/release`

- **Qué hace:** Acciones sobre garantía. Libera un registro de garantías y garantes (`guarantees`).
- **Para qué sirve:** RF-MOR-101: Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.garantias.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-33 (Garantías y garantes).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-75-d)

<a id="API-MOR-76"></a>
#### API-MOR-76 · `GET /api/admin/mor/collection-agencies`

- **Qué hace:** ABM de estudios. Lista, con filtros y paginación, los registros de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.estudios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de estudios y agencias de gestión de deuda (`debtCollectionAgencies`) con `total`.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-76)

<a id="API-MOR-76-b"></a>
#### API-MOR-76-b · `POST /api/admin/mor/collection-agencies`

- **Qué hace:** ABM de estudios. Da de alta un registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.estudios.configurar`.
- **Recibe:** los datos de estudios y agencias de gestión de deuda (`debtCollectionAgencies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-76-b)

<a id="API-MOR-76-c"></a>
#### API-MOR-76-c · `GET /api/admin/mor/collection-agencies/{id}`

- **Qué hace:** ABM de estudios. Obtiene el detalle de un registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.estudios.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-76-c)

<a id="API-MOR-76-d"></a>
#### API-MOR-76-d · `PATCH /api/admin/mor/collection-agencies/{id}`

- **Qué hace:** ABM de estudios. Modifica algunos campos de un registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`) (solo los enviados).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.estudios.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de estudios y agencias de gestión de deuda (`debtCollectionAgencies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de estudios y agencias de gestión de deuda (`debtCollectionAgencies`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-76-d)

<a id="API-MOR-77"></a>
#### API-MOR-77 · `GET /api/admin/mor/collection-cases`

- **Qué hace:** Expedientes externos/judiciales. Lista, con filtros y paginación, los registros de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de expedientes de gestión externa y judicial (`collectionCases`) con `total`.
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-77)

<a id="API-MOR-77-b"></a>
#### API-MOR-77-b · `POST /api/admin/mor/collection-cases`

- **Qué hace:** Expedientes externos/judiciales. Da de alta un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.editar`.
- **Recibe:** los datos de expedientes de gestión externa y judicial (`collectionCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-77-b)

<a id="API-MOR-77-c"></a>
#### API-MOR-77-c · `GET /api/admin/mor/collection-cases/{id}`

- **Qué hace:** Expedientes externos/judiciales. Obtiene el detalle de un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-77-c)

<a id="API-MOR-77-d"></a>
#### API-MOR-77-d · `PATCH /api/admin/mor/collection-cases/{id}`

- **Qué hace:** Expedientes externos/judiciales. Modifica algunos campos de un registro de expedientes de gestión externa y judicial (`collectionCases`) (solo los enviados).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de expedientes de gestión externa y judicial (`collectionCases`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-77-d)

<a id="API-MOR-78"></a>
#### API-MOR-78 · `POST /api/admin/mor/collection-cases/{id}/events`

- **Qué hace:** Movimientos del expediente. Agrega un elemento («events») a un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-78)

<a id="API-MOR-78-b"></a>
#### API-MOR-78-b · `POST /api/admin/mor/collection-cases/{id}/costs`

- **Qué hace:** Movimientos del expediente. Registra «costs» sobre un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-78-b)

<a id="API-MOR-78-c"></a>
#### API-MOR-78-c · `POST /api/admin/mor/collection-cases/{id}/close`

- **Qué hace:** Movimientos del expediente. Cierra un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.gestionExterna.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-34 (Gestión externa y judicial).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-78-c)

<a id="API-MOR-79"></a>
#### API-MOR-79 · `GET /api/admin/mor/write-offs`

- **Qué hace:** Proponer incobrables. Lista, con filtros y paginación, los registros de incobrables (`writeOffs`).
- **Para qué sirve:** RF-MOR-191: Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. · RF-MOR-187: Cerrar el expediente por pago, convenio, incobrable, prescripción o desistimiento, con causa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.incobrables.proponer`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de incobrables (`writeOffs`) con `total`.
- **Pantallas:** PAN-MOR-35 (Incobrables).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-79)

<a id="API-MOR-79-b"></a>
#### API-MOR-79-b · `POST /api/admin/mor/write-offs`

- **Qué hace:** Proponer incobrables. Da de alta un registro de incobrables (`writeOffs`).
- **Para qué sirve:** RF-MOR-191: Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. · RF-MOR-187: Cerrar el expediente por pago, convenio, incobrable, prescripción o desistimiento, con causa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.incobrables.proponer`.
- **Recibe:** los datos de incobrables (`writeOffs`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de incobrables (`writeOffs`).
- **Pantallas:** PAN-MOR-35 (Incobrables).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-79-b)

<a id="API-MOR-80"></a>
#### API-MOR-80 · `POST /api/admin/mor/write-offs/{id}/approve`

- **Qué hace:** Aprobar / rechazar / revertir. Aprueba un registro de incobrables (`writeOffs`).
- **Para qué sirve:** RF-MOR-189: Revertir un incobrable ante recupero, imputando el recupero a la deuda original y publicando el evento contable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.incobrables.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-35 (Incobrables).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-80)

<a id="API-MOR-80-b"></a>
#### API-MOR-80-b · `POST /api/admin/mor/write-offs/{id}/reject`

- **Qué hace:** Aprobar / rechazar / revertir. Rechaza un registro de incobrables (`writeOffs`).
- **Para qué sirve:** RF-MOR-189: Revertir un incobrable ante recupero, imputando el recupero a la deuda original y publicando el evento contable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.incobrables.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-35 (Incobrables).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-80-b)

<a id="API-MOR-80-c"></a>
#### API-MOR-80-c · `POST /api/admin/mor/write-offs/{id}/revert`

- **Qué hace:** Aprobar / rechazar / revertir. Revierte un registro de incobrables (`writeOffs`).
- **Para qué sirve:** RF-MOR-189: Revertir un incobrable ante recupero, imputando el recupero a la deuda original y publicando el evento contable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.incobrables.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-35 (Incobrables).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-80-c)

<a id="API-MOR-81"></a>
#### API-MOR-81 · `GET /api/admin/mor/prescription-rules`

- **Qué hace:** Reglas de prescripción. Lista, con filtros y paginación, los registros de plazos por tipo de obligación (`prescriptionRules`).
- **Para qué sirve:** RF-MOR-193: Configurar plazos de prescripción por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plazos por tipo de obligación (`prescriptionRules`) con `total`.
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2156 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-81)

<a id="API-MOR-81-b"></a>
#### API-MOR-81-b · `POST /api/admin/mor/prescription-rules`

- **Qué hace:** Reglas de prescripción. Da de alta un registro de plazos por tipo de obligación (`prescriptionRules`).
- **Para qué sirve:** RF-MOR-193: Configurar plazos de prescripción por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.configurar`.
- **Recibe:** los datos de plazos por tipo de obligación (`prescriptionRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plazos por tipo de obligación (`prescriptionRules`).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2156 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-81-b)

<a id="API-MOR-81-c"></a>
#### API-MOR-81-c · `GET /api/admin/mor/prescription-rules/{id}`

- **Qué hace:** Reglas de prescripción. Obtiene el detalle de un registro de plazos por tipo de obligación (`prescriptionRules`).
- **Para qué sirve:** RF-MOR-193: Configurar plazos de prescripción por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plazos por tipo de obligación (`prescriptionRules`).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2156 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-81-c)

<a id="API-MOR-81-d"></a>
#### API-MOR-81-d · `PATCH /api/admin/mor/prescription-rules/{id}`

- **Qué hace:** Reglas de prescripción. Modifica algunos campos de un registro de plazos por tipo de obligación (`prescriptionRules`) (solo los enviados).
- **Para qué sirve:** RF-MOR-193: Configurar plazos de prescripción por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plazos por tipo de obligación (`prescriptionRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plazos por tipo de obligación (`prescriptionRules`).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2156 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-81-d)

<a id="API-MOR-82"></a>
#### API-MOR-82 · `POST /api/admin/mor/prescription-runs`

- **Qué hace:** Corridas de prescripción. Da de alta un registro de corridas de prescripción (`prescriptionRuns`).
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.proponer`.
- **Recibe:** los datos de corridas de prescripción (`prescriptionRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de corridas de prescripción (`prescriptionRuns`).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-82)

<a id="API-MOR-82-b"></a>
#### API-MOR-82-b · `POST /api/admin/mor/prescription-runs/{id}/propose`

- **Qué hace:** Corridas de prescripción. Propone un registro de corridas de prescripción (`prescriptionRuns`).
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.proponer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-82-b)

<a id="API-MOR-82-c"></a>
#### API-MOR-82-c · `POST /api/admin/mor/prescription-runs/{id}/approve`

- **Qué hace:** Corridas de prescripción. Aprueba un registro de corridas de prescripción (`prescriptionRuns`).
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.proponer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-82-c)

<a id="API-MOR-82-d"></a>
#### API-MOR-82-d · `POST /api/admin/mor/prescription-runs/{id}/execute`

- **Qué hace:** Corridas de prescripción. Ejecuta un registro de corridas de prescripción (`prescriptionRuns`).
- **Para qué sirve:** RF-MOR-058: La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.prescripcion.proponer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-36 (Prescripción).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-82-d)

<a id="API-MOR-83"></a>
#### API-MOR-83 · `GET /api/admin/mor/reports/{reportCode}`

- **Qué hace:** Ejecutar informe con filtros y fecha de corte. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-MOR-049: Ejecutar una corrida de intereses a facturar con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.informes.ver`.
- **Recibe:** en la ruta `reportCode`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-37 (Informes de mora y financiación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-83)

<a id="API-MOR-84"></a>
#### API-MOR-84 · `POST /api/admin/mor/reports/{reportCode}/export`

- **Qué hace:** Exportar informe (asíncrono) Exporta un registro de `export`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MOR-220: Aislamiento de tenant en todas las colecciones, jobs y exportaciones del módulo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.informes.exportar`.
- **Recibe:** en la ruta `reportCode`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-MOR-37 (Informes de mora y financiación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2159 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-84)

<a id="API-MOR-85"></a>
#### API-MOR-85 · `GET /api/admin/mor/follow-ups`

- **Qué hace:** Expedientes de seguimiento y contactos. Lista, con filtros y paginación, los registros de expedientes de seguimiento de deuda (`collectionFollowUps`).
- **Para qué sirve:** RF-MOR-141: Segmentar deuda por antigüedad, monto y situación y administrar expedientes de seguimiento con contactos, compromisos, respuestas y próximos pasos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.deuda.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de expedientes de seguimiento de deuda (`collectionFollowUps`) con `total`.
- **Pantallas:** PAN-MOR-01 (Tablero de mora), PAN-MOR-18 (Deuda notificada / actualizada), PAN-MOR-38 (Expedientes de seguimiento de deuda).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2160 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-85)

<a id="API-MOR-85-b"></a>
#### API-MOR-85-b · `POST /api/admin/mor/follow-ups`

- **Qué hace:** Expedientes de seguimiento y contactos. Da de alta un registro de expedientes de seguimiento de deuda (`collectionFollowUps`).
- **Para qué sirve:** RF-MOR-141: Segmentar deuda por antigüedad, monto y situación y administrar expedientes de seguimiento con contactos, compromisos, respuestas y próximos pasos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.deuda.ver`.
- **Recibe:** los datos de expedientes de seguimiento de deuda (`collectionFollowUps`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de expedientes de seguimiento de deuda (`collectionFollowUps`).
- **Pantallas:** PAN-MOR-01 (Tablero de mora), PAN-MOR-18 (Deuda notificada / actualizada), PAN-MOR-38 (Expedientes de seguimiento de deuda).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2160 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-85-b)

<a id="API-MOR-85-c"></a>
#### API-MOR-85-c · `POST /api/admin/mor/follow-ups/{id}/contacts`

- **Qué hace:** Expedientes de seguimiento y contactos. Agrega un elemento («contacts») a un registro de expedientes de seguimiento de deuda (`collectionFollowUps`).
- **Para qué sirve:** RF-MOR-141: Segmentar deuda por antigüedad, monto y situación y administrar expedientes de seguimiento con contactos, compromisos, respuestas y próximos pasos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mor.deuda.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-01 (Tablero de mora), PAN-MOR-18 (Deuda notificada / actualizada), PAN-MOR-38 (Expedientes de seguimiento de deuda).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2160 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-85-c)

<a id="API-MOR-86"></a>
#### API-MOR-86 · `GET /api/mor/my-debt`

- **Qué hace:** Deuda vencida del socio con cotización a hoy. Consulta `my-debt`.
- **Para qué sirve:** RF-MOR-049: Ejecutar una corrida de intereses a facturar con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés… · RF-MOR-077: Generar candidatos con filtros de cuenta (geografía, zona, sector, recorrido), servicio, estado y categoría del servicio, clase de deuda (financiación o no), tipos de documento, fecha de deuda por emisión o VTO1, rango de montos…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.miDeuda.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-39 (Mi deuda y avisos).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2161 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-86)

<a id="API-MOR-87"></a>
#### API-MOR-87 · `GET /api/mor/my-notices`

- **Qué hace:** Avisos del socio con constancias. Consulta `my-notices`.
- **Para qué sirve:** RF-MOR-208: El socio ve sus avisos de mora, instancia, vencimiento y constancia, y el riesgo de suspensión con fecha estimada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.misAvisos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2162 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-87)

<a id="API-MOR-88"></a>
#### API-MOR-88 · `POST /api/mor/simulations`

- **Qué hace:** Simular con planes habilitados para portal. Da de alta un registro de simulaciones de convenio (`agreementSimulations`).
- **Para qué sirve:** RF-MOR-209: El socio simula y solicita un plan dentro de los planes habilitados para autogestión; acepta y firma; paga el anticipo en línea. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.simulador.usar`.
- **Recibe:** los datos de simulaciones de convenio (`agreementSimulations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de simulaciones de convenio (`agreementSimulations`).
- **Pantallas:** PAN-MOR-30 (Simulador y alta de convenio), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-88)

<a id="API-MOR-90"></a>
#### API-MOR-90 · `GET /api/mor/agreements`

- **Qué hace:** Convenios y cuotas del socio. Lista, con filtros y paginación, los registros de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-212: El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de convenios con firmantes embebidos (`agreements`) con `total`.
- **Pantallas:** PAN-MOR-31 (Planes de financiación), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-90)

<a id="API-MOR-89"></a>
#### API-MOR-89 · `POST /api/mor/agreements`

- **Qué hace:** Solicitar, aceptar (OTP) y firmar convenio. Da de alta un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-132: No supeditar la solicitud de baja a pagar deuda, completar un registro o aceptar un cargo; conservar deuda previa y documentos históricos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.solicitar`.
- **Recibe:** los datos de convenios con firmantes embebidos (`agreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de convenios con firmantes embebidos (`agreements`).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2164 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-89)

<a id="API-MOR-89-b"></a>
#### API-MOR-89-b · `POST /api/mor/agreements/{id}/accept`

- **Qué hace:** Solicitar, aceptar (OTP) y firmar convenio. Acepta un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-132: No supeditar la solicitud de baja a pagar deuda, completar un registro o aceptar un cargo; conservar deuda previa y documentos históricos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2164 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-89-b)

<a id="API-MOR-89-c"></a>
#### API-MOR-89-c · `POST /api/mor/agreements/{id}/sign`

- **Qué hace:** Solicitar, aceptar (OTP) y firmar convenio. Firma un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-132: No supeditar la solicitud de baja a pagar deuda, completar un registro o aceptar un cargo; conservar deuda previa y documentos históricos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2164 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-89-c)

<a id="API-MOR-90-b"></a>
#### API-MOR-90-b · `GET /api/mor/agreements/{id}`

- **Qué hace:** Convenios y cuotas del socio. Obtiene el detalle de un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-212: El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de convenios con firmantes embebidos (`agreements`).
- **Pantallas:** PAN-MOR-31 (Planes de financiación), PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-90-b)

<a id="API-MOR-91"></a>
#### API-MOR-91 · `POST /api/mor/agreements/{id}/early-cancellation`

- **Qué hace:** Cancelación anticipada desde app. Cancela anticipadamente un registro de convenios con firmantes embebidos (`agreements`).
- **Para qué sirve:** RF-MOR-212: El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.convenios.cancelarAnticipado`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-40 (Simular, aceptar y firmar convenio).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2166 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-91)

<a id="API-MOR-92"></a>
#### API-MOR-92 · `POST /api/mor/notices/{id}/promise`

- **Qué hace:** Promesa de pago del socio. Registra una promesa de pago sobre un registro de notificaciones de mora con promesa embebida (`delinquencyNotices`).
- **Para qué sirve:** RF-MOR-210: El socio registra una promesa de pago si la política lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.promesa.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2167 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-92)

<a id="API-MOR-93"></a>
#### API-MOR-93 · `GET /api/mor/services/{id}/interruption-options`

- **Qué hace:** Opciones de suspensión/reactivación habilitadas y costos. Consulta «interruption-options» de un registro de `interruption-options`.
- **Para qué sirve:** RF-MOR-211: El socio solicita suspensión voluntaria o reactivación y ve el estado real del caso ("Reactivación en trámite" hasta confirmación). La suspensión voluntaria se habilita por servicio en M02 y está deshabilitada por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.interrupciones.solicitar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-41 (Suspensión voluntaria y reactivación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2168 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-93)

<a id="API-MOR-94"></a>
#### API-MOR-94 · `POST /api/mor/services/{id}/interruption-requests`

- **Qué hace:** Solicitar suspensión voluntaria o reactivación. Registra «interruption-requests» sobre un registro de `interruption-requests`.
- **Para qué sirve:** RF-MOR-211: El socio solicita suspensión voluntaria o reactivación y ve el estado real del caso ("Reactivación en trámite" hasta confirmación). La suspensión voluntaria se habilita por servicio en M02 y está deshabilitada por defecto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.interrupciones.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-41 (Suspensión voluntaria y reactivación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2169 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-94)

<a id="API-MOR-95"></a>
#### API-MOR-95 · `GET /api/mor/interruption-requests/{id}`

- **Qué hace:** Estado del caso. Obtiene el detalle de un registro de `interruption-requests`.
- **Para qué sirve:** RF-MOR-049: Ejecutar una corrida de intereses a facturar con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés… · RF-MOR-077: Generar candidatos con filtros de cuenta (geografía, zona, sector, recorrido), servicio, estado y categoría del servicio, clase de deuda (financiación o no), tipos de documento, fecha de deuda por emisión o VTO1, rango de montos…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `mor.interrupciones.solicitar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MOR-41 (Suspensión voluntaria y reactivación).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2170 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-95)

<a id="API-MOR-96"></a>
#### API-MOR-96 · `GET /api/v1/ext/mor/collection-cases`

- **Qué hace:** Expedientes asignados. Lista, con filtros y paginación, los registros de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-183: Derivar deuda a gestión externa o judicial con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `mor.ext.expedientes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de expedientes de gestión externa y judicial (`collectionCases`) con `total`.
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2171 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-96)

<a id="API-MOR-97"></a>
#### API-MOR-97 · `POST /api/v1/ext/mor/collection-cases/{id}/events`

- **Qué hace:** Registrar avance/costo. Agrega un elemento («events») a un registro de expedientes de gestión externa y judicial (`collectionCases`).
- **Para qué sirve:** RF-MOR-185: Portal o API para estudios externos con alcance a sus expedientes: consultar deuda actualizada, registrar avances y gastos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `mor.ext.expedientes.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M08 §11. API, línea 2172 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-97)

<a id="API-MOR-98"></a>
#### API-MOR-98 · `GET /api/v1/ext/mor/delinquency-status`

- **Qué hace:** Condición de mora por cuenta (exportación regulatoria) Consulta `delinquency-status`.
- **Para qué sirve:** RF-MOR-202: Exportación regulatoria de condición de mora por cuenta (ej. ERSeP: "R/C" en riesgo de corte o "A"), parametrizable por regulador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `mor.ext.condicionMora.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M08 §11. API, línea 2173 · [Ver en Swagger](../18-swagger/index.html?api=m08-mor#/API/API-MOR-98)
