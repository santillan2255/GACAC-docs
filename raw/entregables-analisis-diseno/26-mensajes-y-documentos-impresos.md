# GoodApps Cooperativas

## Catálogo de mensajes, textos y plantillas, y diseño de reportes y documentos impresos

**Entregable de Análisis y Diseño Detallado — Artefactos 4.6 (Catálogo de mensajes, textos y plantillas) y 4.7 (Diseño de reportes y documentos impresos)**

| Dato | Valor |
|---|---|
| Producto | GoodApps Cooperativas: plataforma de gestión en la nube (SaaS multi-tenant) que reemplaza a ProCoop en cooperativas de servicios públicos y sociales |
| Documento | Portada, convenciones de tono y redacción, conteos y observaciones del catálogo de mensajes, plantillas, documentos impresos y reportes |
| Artefactos | 4.6 Catálogo de mensajes, textos y plantillas · 4.7 Diseño de reportes y documentos impresos (índice `00-INDICE.md`, sección 4) |
| Partes | `26-mensajes-y-documentos-impresos.md` (esta portada) · [`26a-catalogo-mensajes-y-plantillas.md`](26a-catalogo-mensajes-y-plantillas.md) · [`26b-documentos-impresos-y-reportes.md`](26b-documentos-impresos-y-reportes.md) |
| Cooperativa piloto | **Laguna Larga** (`LAG`), DEC-088 y DEC-089: electricidad (con prepago) y gas natural por redes; Internet es el primer servicio construido de punta a punta con datos sintéticos (DEC-005) |
| Destinatarios | Responsables de área de la cooperativa piloto, equipo de producto, diseño UX, redacción, desarrollo y QA |
| Carácter | Documento **derivado** de la especificación vigente; no la reemplaza. Ante cualquier diferencia prevalecen la especificación maestra (`00`), sus anexos y el registro de decisiones (`01`) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Fuentes principales | T03 (diccionario, reglas UX, errores `err.*`), T08 (errores RFC 9457, límites y rate limit), T09 (motor de comunicaciones, plantillas, variables, consentimiento, catálogo §9.6), T10 (catálogo de reportes §15, tableros §15.7), T11 (catálogo de eventos §12.3, motor de documentos §5.12, plantillas semilla §18.4, códigos de error §17.5, DEC-080), M05 (factura, NC, ND, talones, código de barras, distribución), M06 (QR fiscal, transparencia fiscal, CVP, libros IVA, retenciones), M07 (recibo, cupón, resumen de cuenta), M08 (avisos, intimación, corte), M15 (reportes contables), M16 (recibo de sueldo), T04 (entidades jurídicas, DEC-064), registro de decisiones (DEC-064, DEC-077, DEC-078, DEC-080, DEC-087, DEC-088, DEC-089) |

### Control de versiones

| Versión | Fecha | Descripción del cambio | Autor |
|---|---|---|---|
| 1.0 | 05-11-2026 | Versión inicial: convenciones de tono, catálogo de mensajes de sistema, catálogo de plantillas por canal y evento, maquetas de documentos impresos, catálogo de reportes y observaciones sobre las fuentes | |

### Aprobaciones

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| Elaboró | | | |
| Revisó (producto / UX) | | | |
| Revisó (cooperativa piloto LAG) | | | |
| Aprobó | | | |

---

## Índice general

Esta portada:

- Propósito, alcance y cómo leer el catálogo
- 1. Convenciones de tono y redacción
- Conteos del catálogo
- 6. Observaciones e inconsistencias detectadas
- 7. Fuentes consultadas

Parte A — [`26a-catalogo-mensajes-y-plantillas.md`](26a-catalogo-mensajes-y-plantillas.md) (artefacto 4.6):

- 2. Catálogo de mensajes de sistema (errores, validaciones, confirmaciones y avisos de proceso; errores de API RFC 9457 por módulo)
- 3. Catálogo de plantillas de comunicación por canal y evento disparador (canales, finalidades, variables, plantillas de WhatsApp heredadas, catálogo por evento, textos de ejemplo, mensajes impresos en factura)

Parte B — [`26b-documentos-impresos-y-reportes.md`](26b-documentos-impresos-y-reportes.md) (artefacto 4.7):

- 4. Documentos impresos (convenciones de maqueta, encabezado por entidad jurídica, inventario de plantillas, 19 maquetas con zonas y campos con su origen)
- 5. Catálogo de reportes (contrato semántico, tableros por rol y catálogo con filtros, columnas y destinatario)

---

## Propósito, alcance y cómo leer el catálogo

### Propósito

Reunir en un solo lugar **todo lo que el sistema le dice a una persona**: los mensajes que aparecen en pantalla (errores, validaciones, confirmaciones y avisos), las comunicaciones que salen por correo, SMS, WhatsApp, push y bandeja de avisos, los documentos que se imprimen o se descargan en PDF y los reportes que consumen las áreas. El objetivo es que redacción, UX, desarrollo y la cooperativa piloto validen textos, estructura y origen de cada dato antes de construir cada ola.

### Alcance

- **Incluido:** los mensajes y plantillas que la especificación ya define (T03 §10.7, T09 §9.6), los códigos de error de API declarados en los anexos, las 46 plantillas semilla de documentos de T11 §18.4 (inventario completo y maqueta de las que usa el piloto) y los reportes del catálogo consolidado de T10 §15.4 que necesita la cooperativa piloto entre O1 y O9.
- **Recorte por piloto:** se priorizan los servicios de LAG (electricidad con prepago y gas por redes) y el servicio Internet de DEC-005. El resto del catálogo de T09 y T10 se adopta tal como está en los anexos; aquí se referencia por cantidad.
- **Excluido:** diseño visual final (colores, tipografías e iconografía salen del design system de T03 §7.A y de la marca de cada cooperativa), textos legales que la especificación no fija y contenido de comunidad (muro, encuestas, boletines), que es contenido editorial y no texto de sistema.

### Cómo leer el catálogo

| Marca | Significado |
|---|---|
| **Definido** | El texto, el código o el campo existe tal cual en la especificación; la columna "Fuente" indica dónde |
| **Propuesto** | Texto redactado por este entregable para completar un código o un caso que la especificación declara sin texto. Debe incorporarse al diccionario (T03) o a la plantilla (T09/T11) y validarse con la cooperativa piloto antes de la ola que lo usa |
| `†` junto a una variable | Variable de plantilla que no figura en la lista de RF-COM-134 y se propone registrar en `templateVariables` (T09 §7.7) |
| `[VERIFICAR]` | Dato que depende de un relevamiento de LAG o de una validación legal todavía abierta |
| `[TEXTO LEGAL PENDIENTE: …]` | Zona de un documento cuyo texto exige una definición legal que la especificación no tiene; no se completa para no inventar requisitos (ver sección 6) |

### Datos de ejemplo

**Todos los datos de los ejemplos son ficticios.** No se usan personas, CUIT, domicilios ni números reales. De la base relevada de LAG solo se toma configuración (DEC-088), nunca datos personales. Juego de datos usado en las tres partes:

| Elemento | Valor ficticio |
|---|---|
| Tenant | Cooperativa Demo Villa Ficticia (`TEN-001`, código corto de marca "Coop Demo") |
| Entidad jurídica LE-01 | Cooperativa Demo Villa Ficticia Ltda. — CUIT 30-00000001-0 (ficticio) — IVA Responsable Inscripto — servicios de electricidad y gas |
| Entidad jurídica LE-02 | Demo Conectividad Villa Ficticia S.A. — CUIT 30-00000002-0 (ficticio) — servicio Internet |
| Domicilio legal | Av. Siempre Viva 100, Villa Ficticia, Córdoba (ficticio) |
| Titular | Ana Ejemplo — DNI 20.000.001 (ficticio) — consumidora final |
| Cuenta / suministro | Cuenta 000012345 · suministro eléctrico 100045 · medidor M-900001 |
| Contactos | `ana.ejemplo@ejemplo.test` · +54 9 351 000-0001 |
| Empleada | Laura Demo — legajo 0042 — CUIL 27-00000003-0 (ficticio) |
| Importes | En pesos argentinos (ARS), con dos decimales y coma decimal (`ARS 25.095,00`) |

---

## 1. Convenciones de tono y redacción

Estas convenciones aplican a toda superficie: admin, PWA del socio, PWA de empleado y de campo, landing, correo, SMS, WhatsApp, push, bandeja de avisos y documentos PDF. Las que vienen de la especificación indican su fuente; las marcadas "Convención de este entregable" son una propuesta de estilo derivada de los textos base de T03 §10.7 y deben validarse.

### 1.1 Voz y tratamiento

| N.º | Convención | Ejemplo correcto | Evitar | Fuente |
|---|---|---|---|---|
| C-01 | Español rioplatense con **voseo** y tuteo de cercanía ("Ingresá", "Revisá", "Tenés"); idioma único `es-AR` | "Revisá el último número del CUIT" | "Revise", "Usted debe" | T03 §10.7.4 y RF-UXD-168 |
| C-02 | La cooperativa habla en **primera persona del plural** cuando actúa o falla ("bloqueamos", "te enviamos", "no pudimos") | "No pudimos cargar la información" | "El sistema ha fallado" | T03 `ui.error.carga`, `err.login.bloqueado` |
| C-03 | El mensaje **no culpa** a la persona: describe qué pasó y qué puede hacer | "Los importes no coinciden con la deuda actual. Actualizá y volvé a intentar" | "Ingresó un importe incorrecto" | T03 `err.pago.importesNoCoinciden`; RF-UXD-127 |
| C-04 | Registro claro y concreto, sin jerga técnica, sin siglas internas ni nombres de colecciones; los códigos técnicos se muestran solo como referencia para soporte | "Algo salió mal. Probá de nuevo en unos minutos. Código: 8F2A-11C0" | "Error 500 en `cob.receipts`" | T03 `err.generico`; RNF-NFR-091 |
| C-05 | Sin signos de exclamación en errores ni en avisos de deuda o corte; tono neutro y respetuoso en mora | "Tenés ARS 25.095,00 vencido. Pagá ahora para evitar la suspensión" | "¡Atención! ¡Debe pagar ya!" | Convención de este entregable (derivada de `por.banner.deudaVencida`) |
| C-06 | Los textos de la interfaz son contenido, no instrucciones: nunca alteran permisos ni reglas, aunque un tenant escriba algo engañoso | — | — | RF-UXD-163 |

### 1.2 Estructura de cada tipo de mensaje

| N.º | Tipo | Estructura | Ejemplo | Fuente |
|---|---|---|---|---|
| C-07 | Error de validación | **Qué corregir** + **cómo** (formato esperado o rango). Inline junto al campo y resumen arriba del formulario con enlaces; el formulario conserva lo cargado. Nunca `alert()` del navegador | "Ingresá el DNI sin puntos (7 u 8 números)" | RF-UXD-102, RF-UXD-127; T03 `err.formato.dni` |
| C-08 | Error de operación | **Qué pasó** + **qué hacer** + **código de seguimiento** (`requestId`) si es inesperado | "Otra persona modificó este registro. Revisá los cambios" | T03 `err.conflicto`; RNF-NFR-091 |
| C-09 | Confirmación previa | Pregunta con el **efecto concreto** (cuántos, qué cambia, si es reversible); botón con el verbo de la acción ("Emitir 98 facturas"), nunca "Aceptar"; acciones irreversibles piden escribir el identificador | "Para confirmar, escribí LOT-2026-00012" | RF-UXD-108; T03 `ui.confirmar.escribir` |
| C-10 | Resultado de acción | Estado final real y, en masivas, resultado por ítem | "48 aprobadas, 2 con error" | RF-UXD-108 |
| C-11 | Estado de integración | Se distingue **Pendiente**, **Confirmado**, **Falló** y **Resultado incierto**; nunca se muestra "enviado" o "pagado" si solo está en cola o en proceso | "Estamos verificando tu pago" | RF-UXD-110, RF-COM-141; T03 `estado.pago.incierto` |
| C-12 | Estado vacío | Título comercial + acción primaria; nunca solo "Sin datos" | "Todavía no iniciaste gestiones" | RF-UXD-106 |
| C-13 | Proceso largo | Se informa que sigue en segundo plano y que se avisará al terminar | "Procesando… podés seguir trabajando; te avisamos al terminar" | RF-UXD-109; T03 `ui.job.enCurso` |
| C-14 | Seguridad (login y recupero) | Mensajes **genéricos** que no revelan si un usuario o una cuenta existe | "Si los datos son correctos, te enviamos un email con los pasos" | RF-UXD-117; T03 `login.recupero.enviado`; PA-UXD-14 |

### 1.3 Formatos de datos

| N.º | Dato | Formato | Fuente |
|---|---|---|---|
| C-15 | Fecha | `dd-mm-yyyy` en la zona horaria del tenant, desde el helper `formatDate`; fecha y hora `dd-mm-yyyy HH:mm` | RF-UXD-101; RF-COM-134 |
| C-16 | Importe | `ARS` + separador de miles con punto + coma decimal + 2 decimales (`ARS 18.450,00`); en documentos, número en letras cuando el documento lo exige (`numberToWords`) | RF-COM-134 (`money:ARS:2`); RF-WFL-171 |
| C-17 | Plural y género | Formato ICU (`{count, plural, one {# factura vencida} other {# facturas vencidas}}`) y concordancia por género del término (`{g:objeto|Nuevo|Nueva}`); nunca concatenar | RF-UXD-145, RF-UXD-146 |
| C-18 | Identificadores | DNI y CUIT se piden sin puntos ni guiones; se muestran con el formato del documento cuando corresponde | T03 `login.usuario.hint`, `err.formato.dni` |
| C-19 | Datos sensibles | Contactos y CBU enmascarados en vistas y comunicaciones (`****0001`); variables marcadas `sensitive` nunca viajan en SMS, WhatsApp ni push, solo un enlace autenticado | T09 §7.7 `templateVariables.sensitive`; T09 §9.6 regla (d) |

### 1.4 Terminología y diccionario

| N.º | Convención | Fuente |
|---|---|---|
| C-20 | Ningún texto visible es literal en el código: toda etiqueta, mensaje y ayuda es una clave del diccionario; el CI falla si aparece un literal | RF-UXD-141, RF-UXD-142 |
| C-21 | Los términos de negocio se referencian (`{t:per.asociado.one}`), de modo que si la cooperativa dice "Asociado" en lugar de "Socio" el cambio llega a todas las frases | RF-UXD-146, RF-UXD-150 |
| C-22 | Textos **protegidos** no editables por el tenant: leyendas fiscales y normativas, denominaciones ARCA de comprobantes, textos de consentimiento | RF-UXD-156 |
| C-23 | Pares de conceptos **no equivalentes** nunca comparten texto (por ejemplo "Suspendido" y "Dado de baja") | RF-UXD-164; T03 `estado.servicio.suspendido` |
| C-24 | Las comunicaciones se renderizan con el diccionario del tenant del **destinatario** y conservan el texto renderizado; los documentos congelan la versión del diccionario usada al emitirse | RF-UXD-161, RF-UXD-170, RF-COM-153; PA-UXD-07 (se asume opción A) |
| C-25 | Los nombres de servicios, planes y conceptos son datos del catálogo (M02), no claves de diccionario | RF-UXD-166 |

### 1.5 Convenciones por canal

| N.º | Canal | Convención | Fuente |
|---|---|---|---|
| C-26 | Correo | Asunto ≤ 60 caracteres con el hecho principal ("Tu factura de noviembre ya está disponible"); preencabezado con el dato clave (importe y vencimiento); un único botón de acción; pie con razón social de la entidad emisora; link de baja de un clic solo en finalidades `community` y `marketing` | Asunto y preencabezado: convención de este entregable; link de baja: RF-COM-173 |
| C-27 | SMS | Remitente = razón social corta (≤ 11 caracteres alfanuméricos); el editor cuenta caracteres y segmentos (GSM-7 160/153, UCS-2 70/67) y bloquea si supera el máximo. **Recomendación:** como las vocales con tilde `á`, `í`, `ó`, `ú` fuerzan UCS-2, los SMS de más de 70 caracteres se redactan sin esas tildes para no duplicar el costo | Conteo y remitente: RF-COM-135, T09 `senderIdentities`; recomendación de tildes: convención de este entregable |
| C-28 | WhatsApp | Solo plantillas aprobadas por el proveedor, con variables posicionales mapeadas a variables tipadas; el mensaje libre existe solo dentro de la sesión de 24 h iniciada desde atención (M09) | RF-COM-136 |
| C-29 | Push | Título ≤ 40 caracteres y cuerpo ≤ 120, con enlace profundo a la pantalla del hecho | Longitudes: convención de este entregable; enlace: RF-COM-137 |
| C-30 | Bandeja in-app | Título, cuerpo, enlace interno y vigencia (30 días por defecto; no vence mientras la acción siga abierta) | RF-COM-138, RF-COM-203 |
| C-31 | Impreso en factura | Mensajes por área con tope de caracteres: encabezado 120, cuerpo 400, pie 200, dorso 1.500 | PRM-COM-047 |

### 1.6 Convenciones de documentos impresos y PDF

| N.º | Convención | Fuente |
|---|---|---|
| C-32 | Un documento emitido se genera una vez, se guarda con hash SHA-256 y se sirve siempre igual; reimprimir crea una reimpresión marcada, nunca lo reemplaza | RF-WFL-176, RF-FAC-137 |
| C-33 | Marcas de agua estándar: **BORRADOR**, **ANULADO**, **COPIA**, **SIMULACIÓN**; reimpresión con la leyenda **DUPLICADO** | RF-WFL-177, RF-FAC-138, RF-MED-119 |
| C-34 | Formatos A4, Carta, Oficio y ticket de 80 mm; PDF/A-2b para documentos de archivo (fiscales y legales) | RF-WFL-175 (DEC-080) |
| C-35 | Encabezado con la **entidad jurídica emisora** del documento (DEC-064), no con la del tenant genérico | RF-CFG-134, RF-CFG-137; M05 `invoices.legalEntityId` |
| C-36 | El bloque fiscal (CAE, QR, leyendas de ARCA) no es editable por el tenant; el tenant personaliza pie y textos en zonas editables | T11 §18.4; RF-WFL-179 |
| C-37 | Las plantillas de documentos fiscales y legales se publican con aprobación | RF-WFL-174 |
| C-38 | Tipografía de documentos: lista cerrada de tres tipografías autoalojadas con licencia libre (se asume la opción recomendada de PA-UXD-17) | PA-UXD-17 |
| C-39 | Los documentos verificables llevan código y QR de verificación pública que muestra tipo, fecha, emisor y hash, sin datos personales | RF-WFL-201, RF-COB-089 |

### 1.7 Accesibilidad de los textos

| N.º | Convención | Fuente |
|---|---|---|
| C-40 | Los mensajes de error se asocian al campo (`aria-describedby`) y los toasts, progresos y estados offline se anuncian por regiones `aria-live` | RF-UXD-126, RF-UXD-134 |
| C-41 | Los textos respetan límites de largo por clave (un botón con límite 24 rechaza un texto de 60) y no rompen la maqueta | RF-UXD-136 |
| C-42 | Imágenes de marca con texto alternativo del diccionario ("Logo de {marca}"); ilustraciones decorativas con `alt=""` | RF-UXD-138 |
| C-43 | El campo de código OTP acepta pegado y autocompletado; nunca se exige transcribir sin permitir pegar | RF-UXD-130 |

---

## Conteos del catálogo

| Elemento | Cantidad | Detalle | Dónde |
|---|---|---|---|
| Convenciones de tono y redacción | 43 | C-01 a C-43 | Sección 1 (esta portada) |
| Mensajes de sistema | **152** | MSG-001 a MSG-152: 65 de interfaz con texto definido en T03 o en el anexo dueño y 87 con texto **propuesto** (16 confirmaciones y avisos de pantalla y 71 errores de API declarados sin texto) | Sección 2 (parte A) |
| Errores de API RFC 9457 (incluidos en los 152) | 71 | 6 transversales de T08, 13 de T01, 5 de T02, 17 de T11, 3 de T03, 5 de M06, 10 de M07, 3 de M08 y 9 de otros módulos (M01, M03, M10, M13, M15, M17 y T10) | Sección 2.6 (parte A) |
| Tipos de comunicación catalogados | **70** | Tipos del catálogo de T09 §9.6 que usa el piloto (O1 a O10), con evento disparador, canales y variables | Sección 3.5 (parte A) |
| Plantillas por canal (tipo × canal) | **225** | Suma de los canales admitidos por los 70 tipos | Sección 3.5 (parte A) |
| Plantillas de WhatsApp heredadas de ProCoop | 6 | Mapeadas a tipos de comunicación (incluidas en las 225) | Sección 3.4 (parte A) |
| Textos de ejemplo redactados | 24 | Plantillas completas con datos ficticios | Sección 3.6 (parte A) |
| Documentos impresos con maqueta | **19** | DOC-01 a DOC-19 | Sección 4 (parte B) |
| Plantillas de documentos inventariadas | 46 + 2 | Las 46 semilla de T11 §18.4 y 2 documentos que la especificación pide sin plantilla semilla | Sección 4.3 (parte B) |
| Reportes catalogados con filtros, columnas y destinatario | **56** | Subconjunto del catálogo de T10 §15.4 que usa el piloto | Sección 5.3 (parte B) |
| Tableros por rol | 12 | Tableros de T10 §15.7 que usa el piloto | Sección 5.2 (parte B) |
| Observaciones e inconsistencias | 20 | OBS-01 a OBS-20 | Sección 6 (esta portada) |

---

## 6. Observaciones e inconsistencias detectadas

Se registran para su tratamiento en la especificación. **No se corrigió ningún anexo**; este entregable trabaja con lo que está escrito y, donde falta un dato legal, deja la zona marcada como pendiente.

| N.º | Tema | Observación | Fuentes | Efecto en este entregable |
|---|---|---|---|---|
| OBS-01 | Formato de los códigos de error | Los anexos usan al menos seis formatos para el `type` de RFC 9457: barra y guiones (`wfl/sod-violation`, `fis/arca-rejected`, `mor/mode-not-allowed`, `per/relationship-scope`), punto y camelCase (`cob.caja.sesionCerrada`, `tec.workOrder.duplicate`, `med.meter.alreadyInstalled`, `uxd.publish.forbidden`), guion bajo (`sod_self_approval`, `version_conflict`), guiones sin prefijo de módulo (`tenant-suspended`, `client-suspended`), mayúsculas (`POS_CONFLICT`) y clave de diccionario (`dict:con.errors.periodClosed`). T08 RNF-NFR-091 exige RFC 9457 pero no fija el formato ni la URI base del `type`; solo T10 fija una URI estable (`https://developers.goodapps.coop/problems/<tipo>`), y únicamente para la API externa. M10 además informa sus errores en un campo `code` en lugar de `type` | T01 §11; T02; T03 §17.2; T08 RNF-NFR-091; T10; T11 §17.5; M06; M07 §11; M08; M10; M13; M15; M17 | Se transcriben los códigos tal cual; la sección 2.6 agrupa por módulo |
| OBS-02 | Textos de los errores de módulo | RNF-NFR-091 pide que los 4xx muestren un mensaje por clave de diccionario en español, pero T03 §10.7.4 solo define 26 errores genéricos. Ninguno de los 71 códigos de API catalogados tiene texto para el usuario | T08 RNF-NFR-091; T03 §10.7.4 | Los 71 textos de la sección 2.6 son **propuestos** |
| OBS-03 | Claves de diccionario citadas sin definir | `uxd.error.dobleControl` (ESC-UXD-03) y `con.errors.periodClosed` (M15 ESC-03) se usan como mensajes, pero no figuran en el catálogo base de T03 (§10.7) ni en las claves agregadas (§10.9.10) | T03 §17.2; M15 §17 | Se catalogan con texto propuesto |
| OBS-04 | Palabras de baja por SMS y WhatsApp | El proceso P-COM-10 lista `BAJA`, `STOP`, `NO`, `CANCELAR`; el valor por defecto de PRM-COM-064 es `BAJA`, `STOP`, `CANCELAR`, `SALIR`. Además, `NO` como palabra de baja puede capturar respuestas comunes a otras preguntas | T09 §9.11; T09 §14 PRM-COM-064 | El ejemplo de confirmación de baja no fija la lista |
| OBS-05 | Consumidores de eventos sin T09 | En el catálogo consolidado de eventos de T11 §12.3, los consumidores de EVT-FAC-07 `fac.invoice.issued`, EVT-FIS-01 `fis.invoice.authorized`, EVT-FAC-10 `fac.creditNote.issued`, EVT-COB-04 `cob.payment.confirmed`, EVT-COB-16 `cob.directDebit.rejected`, EVT-COB-20 `cob.paymentIntent.statusChanged` y EVT-MOR-12 (`mor.interruption.scheduled`) no incluyen a T09, aunque T09 §9.6 los usa como disparadores de comunicaciones. Lo mismo ocurre con EVT-CAT-09 `cat.contract.activated`, EVT-CAT-12 `cat.contract.reactivated` y EVT-CAT-15 `cat.contract.terminated`, que T09 §9.6 cita por nombre sin su identificador EVT | T11 §12.3; T09 §9.6.3, §9.6.4, §9.6.5 | Se toma T09 §9.6 como fuente del disparador |
| OBS-06 | "M10" donde correspondería T09 | Los consumidores de EVT-COB-04, EVT-COB-16 y EVT-COB-20 incluyen a M10 (técnica), y el job JOB-COB-11 de M07 dice que el resumen de cuenta se entrega "por M10 a los canales del grupo". Por función, la entrega por canales es de T09 (y la reconexión tras pago sí es de M10, lo que puede explicar solo el caso de EVT-COB-04) | T11 §12.3; M07 §9 (JOB-COB-11) | DOC-08 indica la entrega por T09 y deja la observación |
| OBS-07 | Dueño del talón y del cupón | M05 mapea `TALONFAC` a `paymentSlips` (talón sumado y talón por cuota) y la plantilla TPL-FAC-04 "Talón y cupón de pago" tiene como dueño a M05; M07 mapea también `TALONFAC` (cuota 0 = talón sumado) a `paymentCoupons` y RF-FAC-151 dice que el cupón único lo emite M07. Quedan dos dueños posibles para el talón sumado y una plantilla con dueño distinto del emisor del cupón | M05 §7.7, RF-FAC-149, RF-FAC-151; M07 §7.29, §19; T11 §18.4 | DOC-04 (talón, M05) y DOC-05 (cupón, M07) se dibujan por separado |
| OBS-08 | Documentos sin plantilla semilla | La especificación pide imprimir el **comprobante de recarga prepaga** con su token (RF-MED-119) y la **constancia de comunicación** en PDF con hash (RF-COM-146, JOB-COM-17), pero ninguno está entre las 46 plantillas semilla de T11 §18.4. El recarga prepaga es crítico para LAG (CTR-COB-21) | M03 RF-MED-115, RF-MED-119; T09 RF-COM-146; T11 §18.4 | DOC-16 y DOC-17 se dibujan con código de plantilla "sin asignar" |
| OBS-09 | Dos motores de render para cartas | RF-COM-152 dice que las cartas de mora y circulares se generan en PDF "usando el motor de render de COM"; T11 RF-WFL-170 a 175 y DEC-080 definen un único motor de documentos HTML → PDF en T11 | T09 RF-COM-152; T11 §5.12; DEC-080 | Se asume el motor de T11 para todo PDF |
| OBS-10 | Ola de las plantillas de mora | T11 §18.4 asigna ola O5 a TPL-MOR-01 a 05 y aclara que "la ola de cada plantilla es la del módulo dueño", pero el módulo de mora M08 está en O6 (sus tipos de comunicación de T09 §9.6.5 también son O6) | T11 §18.4; M08; T09 §9.6.5 | Las maquetas DOC-10 a DOC-12 indican O6 con la observación |
| OBS-11 | Contenido fiscal obligatorio del comprobante | M05 RF-FAC-135 remite los "datos fiscales exigidos" a M06, y M06 define datos del QR (RF-FIS-061), CAE y vencimiento, CVP (RF-FIS-090), transparencia fiscal (RF-FIS-062) y la sección de aporte de capital (RF-FIS-161), pero no hay un listado cerrado del contenido obligatorio de la representación impresa por letra y tipo de comprobante (leyendas, condición de venta, datos del receptor exigibles, período facturado) | M05 RF-FAC-135; M06 §5.5 | El bloque fiscal de las maquetas solo lista lo especificado y deja `[TEXTO LEGAL PENDIENTE]` |
| OBS-12 | Contenido regulatorio de facturas de servicios públicos | Para electricidad y gas de LAG solo está prevista la tabla normativa de rubros permitidos por jurisdicción (RF-FIS-012, Ley provincial 10739, O7). No hay relevamiento de los datos que ERSeP o ENARGAS exigen imprimir en la factura (por ejemplo, datos de categoría, consumo o reclamos) | M06 RF-FIS-012; T12 parte 1 (ficha de agua); DEC-089 | Los bloques por servicio de DOC-01 llevan `[VERIFICAR]` |
| OBS-13 | Textos legales de mora y corte | El preaviso mínimo, la constancia exigida y las ventanas de corte están "A validar" (PA-MOR-06, PA-MOR-10, PA-COM-05; la plantilla ERSeP de PRM-MOR-206 está `toValidate`). No hay texto legal para el aviso de deuda, la intimación ni el aviso de corte | M08 RF-MOR-088, RF-MOR-120, RN-MOR-145; T09 PA-COM-05 | DOC-10 a DOC-12 dejan zonas `[TEXTO LEGAL PENDIENTE]` |
| OBS-14 | Precedencia de marca en documentos | La marca de un documento se resuelve por la variante de la entidad jurídica emisora (`legalEntities.brandingVariantKey` → `tenantBrandings.variants`) o, sin variante, por la marca base del tenant (T03 §7.B). Por otro lado, los logos por sucursal (`branchOverrides`, PA-UXD-10, todavía "A validar") heredan "sucursal → tenant" (RN-UXD-016). No está definido qué logo lleva un documento emitido en una sucursal con logo propio por una entidad que tiene variante de marca | T03 RF-UXD-028, RN-UXD-016, §7.B (`variants`, `branchOverrides`), PA-UXD-10; T04 §7.14 | Las maquetas usan la variante de la entidad (o la marca base) e ignoran el logo de sucursal |
| OBS-15 | Texto del concepto sin descripción duplicado | El texto que se imprime cuando un concepto no tiene descripción (V2 2318) está a la vez como parámetro `fac.print.unknownConceptText` (PRM-FAC-153, M05) y como clave `fac.concepto.desconocido` (T03 §10.9.10, canales `admin` y `documentos`) | M05 §14.7; T03 §10.9.10 | Se cita la clave de diccionario |
| OBS-16 | Opt-out "sí" en tipos transaccionales | RF-COM-171 dice que la finalidad `transactional` se puede desactivar por canal pero con al menos un canal activo; sin embargo, el catálogo marca opt-out total ("sí") en tipos `trx` como `fac.invoice.dueReminder`, `tar.promotion.ended`, `cob.creditBalance.created` y `mor.installment.due` | T09 RF-COM-171; T09 §9.6.4, §9.6.5 | La sección 3.5 transcribe el valor del catálogo |
| OBS-17 | Constancia de libre deuda sin contenido | TPL-COB-03 existe y SIG-CERT-FISCAL prevé firmarla, pero ningún requisito de M07 define su alcance (por cuenta, por servicio o por entidad jurídica), su vigencia ni cómo trata los pagos en proceso | T11 §18.4, §18.5; M07 §5 | DOC-09 marca esos campos como `[VERIFICAR]` |
| OBS-18 | Registro de variables incompleto | RF-COM-134 enumera 14 variables de ejemplo; el resto de las que necesitan los 70 tipos no está registrado por tipo de comunicación | T09 RF-COM-134, §7.7 | Las variables adicionales se marcan con `†` |
| OBS-19 | Entidad jurídica como filtro de reportes | Los libros IVA, la contabilidad y los recibos son por entidad jurídica (RF-FIS-167, DEC-064, DEC-087), pero `reportDefinitions.scopeDimensions` de T10 solo admite sucursal, zona, servicio, cuadrilla, propio y caja | T10 §7.1; M06 RF-FIS-167 | La sección 5.3 agrega el filtro "entidad jurídica" donde lo exige el anexo dueño |
| OBS-20 | Ola de la firma del recibo de sueldo | El perfil SIG-SUE-EMPLEADOR (firma digital) indica "DEC-078; O8", mientras TPL-SUE-01 y M16 están en O9; además, la admisión del recibo digital sigue marcada `[VERIFICAR]` en M16 | T11 §18.4, §18.5; M16 §21; DEC-078 | DOC-15 indica O9 y la observación |

---

## 7. Fuentes consultadas

| Fuente | Secciones usadas |
|---|---|
| `docs/especificacion/01-registro-decisiones.md` | DEC-005, DEC-064, DEC-077, DEC-078, DEC-080, DEC-087, DEC-088, DEC-089 |
| T03 UXD | §5.8 a §5.11 (reglas UX, login, accesibilidad, diccionario), §10.7 (catálogo base del diccionario: `ui.*`, `estado.*`, `err.*`, `login.*`, `por.*`), §10.9.10, §17.2, PA-UXD-07, PA-UXD-10, PA-UXD-14, PA-UXD-17 |
| T08 NFR | RNF-NFR-026, RNF-NFR-075, RNF-NFR-078, RNF-NFR-091, RNF-NFR-174, RNF-NFR-210 |
| T09 COM | §5.8 a §5.13, §7.7, §9.6 (catálogo transaccional), §9.7 a §9.11, §14 (PRM-COM-032, 047, 060, 062, 063, 064), §15 |
| T10 BIA | §7.1, §15.1 a §15.4, §15.7, §15.8 |
| T11 WFL | §5.11 a §5.14, §12.3 (catálogo de eventos), §17.5, §18.4, §18.5 |
| T01 PLA, T02 IAM, T04 CFG | Códigos de error (T01 §11, T02 §9 y §17), entidades jurídicas (T04 RF-CFG-134 a 137 y §7.14, incluida `brandingVariantKey`) |
| M03 MED | RF-MED-115, RF-MED-119, RF-MED-121 |
| M05 FAC | §5.16 a §5.19, §6.8, §7.3, §7.7, §7.8, §14.5 a §14.7, §15 |
| M06 FIS | RF-FIS-008, RF-FIS-012, RF-FIS-061, RF-FIS-062, RF-FIS-090, RF-FIS-112 a 122, RF-FIS-161, RF-FIS-167, §9.8, §9.9 |
| M07 COB | RF-COB-023, RF-COB-086 a 090, RF-COB-154, RF-COB-193, §7.8, §7.12, §7.29, §11, §15 |
| M08 MOR | RF-MOR-080 a 099, RF-MOR-120, RF-MOR-221, §15 (REP-MOR), PA-MOR-06, PA-MOR-10 |
| M15 CON, M16 SUE | Reportes contables (vía T10 §15.4.6); RF-SUE-104 (recibo art. 140 LCT), libro de sueldos |
| Entregables previos | `05-wireframes-pantallas-piloto.md` (convención de portada y datos de demostración), `11-glosario-negocio.md` (terminología) |
