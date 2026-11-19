# GoodApps Cooperativas

## Parte A — Catálogo de mensajes de sistema y de plantillas de comunicación

**Entregable de Análisis y Diseño Detallado — Artefacto 4.6 (Catálogo de mensajes, textos y plantillas)**

| Dato | Valor |
|---|---|
| Documento | Parte A del entregable de mensajes y documentos impresos: catálogo de mensajes de sistema (sección 2) y catálogo de plantillas de comunicación por canal y evento disparador (sección 3) |
| Portada | [`26-mensajes-y-documentos-impresos.md`](26-mensajes-y-documentos-impresos.md) (convenciones de tono en la sección 1, conteos y observaciones en la sección 6) |
| Artefacto | 4.6 del índice `00-INDICE.md` |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Fuentes | T03 §5.8 a §5.11 y §10.7 (diccionario base: `ui.*`, `estado.*`, `err.*`, `login.*`, `por.*`); T08 RNF-NFR-026, 075, 078, 091, 174 y 210 (errores RFC 9457); T09 §5.8 a §5.13, §7.7, §9.6 a §9.11 y §14 (motor de comunicaciones, variables, consentimiento y catálogo transaccional); T11 §12.3 (catálogo de eventos EVT-xxx) y §17.5 (errores de WFL); T01 §11, T02, M06, M07 §11, M08 y demás anexos para los códigos de error de módulo |

Todos los datos de los ejemplos son ficticios (ver "Datos de ejemplo" en la portada). Las marcas **Definido**, **Propuesto**, `†` y `[VERIFICAR]` se explican en la portada.

---

## 2. Catálogo de mensajes de sistema

### 2.0 Convenciones del catálogo de mensajes

- **Código**: clave del diccionario de T03 (`err.*`, `ui.*`, `login.*`, `estado.*`, `por.*`) para mensajes de interfaz, o `type` del cuerpo `application/problem+json` para errores de API, transcripto tal como figura en el anexo (sobre la heterogeneidad de formatos ver OBS-01).
- **Texto**: texto base en `es-AR`. Las variables van entre llaves (`{campo}`) y los términos de negocio como referencia (`{t:per.titular.one}`), según RF-UXD-146.
- **Estado**: **Definido** (el texto existe en la especificación) o **Propuesto** (redactado aquí; debe cargarse en el diccionario como clave `kind: error` o `kind: message` antes de la ola indicada).
- **Presentación**: errores de campo inline con resumen arriba del formulario (RF-UXD-102); errores de operación en toast o banner de la pantalla; confirmaciones en `ConfirmDialog` (T03 §10.2.4).

#### Cuerpo de error RFC 9457 (ejemplo ficticio)

Todo error de API responde `application/problem+json` con `requestId`, sin stack ni datos internos, y con un mensaje por clave de diccionario en español para los 4xx (RNF-NFR-091). Solo la API externa de T10 fija una URI estable para el `type` (`https://developers.goodapps.coop/problems/<tipo>`); para las API internas no hay URI base definida (OBS-01), por eso el ejemplo usa el código tal como lo nombra M07:

```json
{
  "type": "cob.caja.sesionCerrada",
  "title": "No hay una sesión de caja abierta",
  "status": 409,
  "detail": "Abrí tu caja para cobrar, anular o registrar egresos.",
  "instance": "/api/admin/cob/cash-operations",
  "requestId": "8F2A-11C0-ficticio",
  "messageKey": "err.cob.cajaSesionCerrada"
}
```

La interfaz muestra `detail` (resuelto desde `messageKey`) y, si el error es inesperado (5xx), el texto de `err.generico` con el `requestId` como código de seguimiento. El campo `messageKey` es una propuesta de este entregable para vincular el error con su clave de diccionario.

### 2.1 Errores generales, de sesión y de carga

| N.º | Código | Texto | Cuándo aparece | Estado | Fuente |
|---|---|---|---|---|---|
| MSG-001 | `err.generico` | Algo salió mal. Probá de nuevo en unos minutos. Código: {requestId} | Cualquier error 5xx o no previsto | Definido | T03 §10.7.4; RNF-NFR-091 |
| MSG-002 | `err.red` | No hay conexión. Revisá tu red | Falla de red del cliente (admin o PWA en línea) | Definido | T03 §10.7.4 |
| MSG-003 | `err.sesionExpirada` | Tu sesión expiró. Ingresá de nuevo | Token vencido o sesión revocada | Definido | T03 §10.7.4 |
| MSG-004 | `err.sinPermiso` | No tenés permiso para hacer esto | 403 por falta de capability en una acción | Definido | T03 §10.7.4 |
| MSG-005 | `err.conflicto` | Otra persona modificó este registro. Revisá los cambios | 409 por control optimista al guardar (RNF-NFR-210) | Definido | T03 §10.7.4 |
| MSG-006 | `ui.error.carga` | No pudimos cargar la información | Falla al cargar una lista o un detalle | Definido | T03 §10.7.2 |
| MSG-007 | `ui.sinPermiso.titulo` | No tenés acceso a esta pantalla | Ruta sin capability (pantalla completa) | Definido | T03 §10.7.2 |
| MSG-008 | `ui.sinPermiso.texto` | Si creés que es un error, consultá con el administrador de tu cooperativa | Debajo de MSG-007 | Definido | T03 §10.7.2 |
| MSG-009 | `ui.conflicto.titulo` | Otra persona modificó este registro | Título del diálogo de comparación tras un 409 | Definido | T03 §10.7.2 |
| MSG-010 | `ui.sesion.porExpirar` | Tu sesión va a cerrarse en {segundos} segundos | 60 s antes del bloqueo por inactividad (RF-UXD-121) | Definido | T03 §10.7.2 |
| MSG-011 | `ui.vacio.titulo` | Todavía no hay nada por acá | Lista vacía sin filtros | Definido | T03 §10.7.2 |
| MSG-012 | `ui.vacio.filtros` | No hay resultados con estos filtros | Lista vacía con filtros aplicados | Definido | T03 §10.7.2 |
| MSG-013 | `ui.soloLectura` | Solo lectura | Registro o módulo en modo consulta (por ejemplo, módulo en `historyReadOnly`) | Definido | T03 §10.7.2 |
| MSG-014 | `ui.textoNoDisponible` | Texto no disponible | Clave de diccionario sin valor en producción (nunca se muestra la clave cruda, RF-UXD-147) | Definido | T03 §10.7.2 |
| MSG-015 | `bia.vacio.honesto` | No hay datos suficientes para este indicador en el período elegido | Widget o reporte sin datos para el período | Definido | T03 §10.7.7 |

### 2.2 Validaciones de formulario y de datos

| N.º | Código | Texto | Cuándo aparece | Estado | Fuente |
|---|---|---|---|---|---|
| MSG-016 | `err.campoObligatorio` | Completá {campo} | Campo obligatorio vacío al enviar | Definido | T03 §10.7.4 |
| MSG-017 | `err.formato.dni` | Ingresá el DNI sin puntos (7 u 8 números) | DNI con formato inválido | Definido | T03 §10.7.4 |
| MSG-018 | `err.formato.cuit` | El CUIT no es válido. Revisá el último número | Dígito verificador del CUIT incorrecto (RF-UXD-127) | Definido | T03 §10.7.4 |
| MSG-019 | `err.formato.cbu` | El CBU debe tener 22 números | CBU de largo distinto de 22 (adhesión a débito, reintegros) | Definido | T03 §10.7.4 |
| MSG-020 | `err.formato.email` | Ingresá un email válido | Email mal formado | Definido | T03 §10.7.4 |
| MSG-021 | `err.formato.fecha` | Usá el formato dd-mm-aaaa | Fecha mal escrita | Definido | T03 §10.7.4 |
| MSG-022 | `err.archivo.tamano` | El archivo supera {max} MB | Archivo mayor que el límite del tipo documental o de RNF-NFR-078 | Definido | T03 §10.7.4 |
| MSG-023 | `err.archivo.tipo` | Este tipo de archivo no está permitido. Permitidos: {tipos} | Extensión o contenido fuera de la lista blanca | Definido | T03 §10.7.4 |
| MSG-024 | `err.diccionario.protegido` | Este texto está protegido y no se puede modificar | Edición de leyenda fiscal, legal o de consentimiento | Definido | T03 §10.7.4 |
| MSG-025 | `err.diccionario.ambiguo` | Este texto ya se usa para {otroConcepto}; elegí otro para no confundir | Dos conceptos con el mismo texto en un contexto (RF-UXD-164) | Definido | T03 §10.7.4 |
| MSG-026 | `err.diccionario.largo` | Máximo {max} caracteres | Texto que excede el largo de la clave (RF-UXD-136) | Definido | T03 §10.7.4 |
| MSG-027 | `err.diccionario.variable` | Falta la variable {variable} o usaste una no permitida | Texto de diccionario con variable inválida | Definido | T03 §10.7.4 |
| MSG-028 | `uxd.contraste.advertencia` | Este color tiene poco contraste; usaremos una variante más legible para textos | Color de marca con contraste insuficiente | Definido | T03 §10.7.7 |
| MSG-029 | (sin clave) | Código de barras inválido | Lectura en caja de un código con largo o dígito verificador incorrecto | Definido (texto); clave a asignar | M05 RF-FAC-145 |
| MSG-030 | `estado.sync.error` | Error, reintentaremos | Mutación offline de la PWA de campo que falló y queda en cola | Definido | T03 §10.7.3 |

### 2.3 Ingreso, segundo factor y seguridad

| N.º | Código | Texto | Cuándo aparece | Estado | Fuente |
|---|---|---|---|---|---|
| MSG-031 | `err.login.credenciales` | El usuario o la contraseña no son correctos | Credenciales inválidas (sin distinguir usuario inexistente salvo política de T02) | Definido | T03 §10.7.4; PA-UXD-14 |
| MSG-032 | `err.login.bloqueado` | Por seguridad bloqueamos el acceso por {minutos} minutos | Bloqueo por intentos fallidos (RNF-NFR-075) | Definido | T03 §10.7.4 |
| MSG-033 | `login.recupero.enviado` | Si los datos son correctos, te enviamos un email con los pasos | Siempre, tras pedir recuperar contraseña (anti-enumeración) | Definido (protegido) | T03 §10.7.5 |
| MSG-034 | `login.2fa.titulo` | Ingresá el código que te enviamos a {destino} | Paso de segundo factor | Definido | T03 §10.7.5 |
| MSG-035 | `login.2fa.reenviar` | Reenviar código {segundos} | Cuenta regresiva de reenvío (60 s) | Definido | T03 §10.7.5; RF-UXD-113 |
| MSG-036 | `login.2fa.recordarDispositivo` | No volver a pedir en este dispositivo por 30 días | Opción del segundo factor | Definido | T03 §10.7.5 |
| MSG-037 | `login.codigo.hint` | Lo encontrás en tu factura o en la web de tu cooperativa | Ayuda del campo código de cooperativa (acceso por dominio genérico) | Definido | T03 §10.7.5 |
| MSG-038 | `login.usuario.hint` | DNI o CUIT sin puntos ni guiones | Ayuda del campo usuario | Definido | T03 §10.7.5 |
| MSG-039 | `login.terminos.aceptar` | Leí y acepto los términos y condiciones | Términos nuevos pendientes de aceptar (RF-UXD-122) | Definido | T03 §10.7.5 |
| MSG-040 | `plt.accesoTemporal` | Acceso temporal a {tenant}: quedan {minutos} min | Banda del operador de plataforma con acceso de soporte vigente | Definido | T03 §10.7.7 |

### 2.4 Pagos, portal del socio y trámites

| N.º | Código | Texto | Cuándo aparece | Estado | Fuente |
|---|---|---|---|---|---|
| MSG-041 | `err.pago.rechazadoEntidad` | El pago fue rechazado por la entidad | La pasarela o el banco rechazan el pago | Definido | T03 §10.7.4 |
| MSG-042 | `err.pago.importesNoCoinciden` | Los importes no coinciden con la deuda actual. Actualizá y volvé a intentar | La deuda cambió entre la consulta y el pago | Definido | T03 §10.7.4 |
| MSG-043 | `err.pago.importeMinimo` | El importe mínimo para pagar en línea es {importe} | Pago online por debajo del mínimo del tenant | Definido | T03 §10.7.4 |
| MSG-044 | `err.pago.cuentaBloqueada` | Esta cuenta no admite pagos en línea. Comunicate con {marca} | Cuenta con bloqueo de pago web | Definido | T03 §10.7.4 |
| MSG-045 | `err.tramite.documentoNoCoincide` | El documento del {t:per.titular.one} no coincide con el registrado en CiDi | Trámite con identidad CiDi distinta del titular | Definido | T03 §10.7.4 |
| MSG-046 | `err.tramite.servicioNoAdmite` | El {t:cat.servicio.one} seleccionado no admite este trámite | Trámite no habilitado para el servicio | Definido | T03 §10.7.4 |
| MSG-047 | `err.vinculo.cuentaAjena` | No pudimos verificar que esta cuenta sea tuya. Iniciá la acreditación | Vinculación de cuenta sin datos que coincidan | Definido | T03 §10.7.4 |
| MSG-048 | `estado.pago.enProceso` | Pago en proceso | Intención de pago informada sin confirmación | Definido | T03 §10.7.3 |
| MSG-049 | `estado.pago.incierto` | Estamos verificando tu pago | Respuesta perdida o estado incierto de la pasarela | Definido | T03 §10.7.3 |
| MSG-050 | `estado.pago.rechazado` | Pago rechazado | Pago rechazado de forma definitiva | Definido | T03 §10.7.3 |
| MSG-051 | `por.banner.deudaVencida` | Tenés {importe} vencido. Pagá ahora para evitar la suspensión | Inicio de la PWA con deuda vencida | Definido | T03 §10.7.6 |
| MSG-052 | `por.banner.servicioSuspendido` | Tu {t:cat.servicio.one} {servicio} está suspendido | Servicio en estado suspendido | Definido | T03 §10.7.6 |
| MSG-053 | `por.banner.corteProgramado` | Corte programado en tu zona el {fecha} de {desde} a {hasta} | Aviso de interrupción publicado que afecta al socio | Definido | T03 §10.7.6 |
| MSG-054 | `por.banner.validacionPendiente` | Estamos validando tus datos | Registro o acreditación en revisión | Definido | T03 §10.7.6 |
| MSG-055 | `por.banner.cuentaBaja` | Esta cuenta está dada de baja. Podés consultar tus documentos | Cuenta dada de baja con acceso de consulta | Definido | T03 §10.7.6 |
| MSG-056 | `por.deuda.alDia` | Estás al día | Sin deuda vencida | Definido | T03 §10.7.6 |
| MSG-057 | `por.instaladorEnCamino` | {nombre} está en camino. Llega aprox. a las {hora} | Visita técnica en estado `en_route` | Definido | T03 §10.7.6 |

### 2.5 Confirmaciones, resultados y avisos de proceso

| N.º | Código | Texto | Cuándo aparece | Estado | Fuente |
|---|---|---|---|---|---|
| MSG-058 | `ui.cambiosSinGuardar` | Tenés cambios sin guardar. ¿Querés salir igual? | Salir de un formulario modificado | Definido | T03 §10.7.2 |
| MSG-059 | `ui.borrador.recuperar` | Tenés un borrador sin terminar. ¿Querés recuperarlo? | Volver a un formulario de más de 5 campos o a un trámite interrumpido (RF-UXD-107) | Definido | T03 §10.7.2 |
| MSG-060 | `ui.confirmar.escribir` | Para confirmar, escribí {identificador} | Acciones irreversibles (anular lote, ejecutar corte masivo) | Definido | T03 §10.7.2 |
| MSG-061 | `ui.job.enCurso` | Procesando… podés seguir trabajando; te avisamos al terminar | Lotes, importaciones, cierres (RF-UXD-109) | Definido | T03 §10.7.2 |
| MSG-062 | `ui.importar.resumen` | {validas} filas válidas, {errores} con errores | Paso 2 del asistente de importación de Excel | Definido | T03 §10.7.2 |
| MSG-063 | `ui.offline.banner` | Sin conexión. {count, plural, one {# envío pendiente} other {# envíos pendientes}} | PWA sin conexión con cola offline | Definido | T03 §10.7.2 |
| MSG-064 | `ui.ia.revisar` | Revisá antes de confirmar | Toda propuesta de IA (la IA solo propone) | Definido | T03 §10.7.2 |
| MSG-065 | `fis.disclaimer.responsabilidad` | El sistema calcula y prepara; la presentación y responsabilidad son del contribuyente y su contador | Pantallas de declaraciones fiscales y cabecera de cada archivo generado | Definido (protegido) | M06 RF-FIS-008 |
| MSG-066 | `ui.toast.guardado` (clave propuesta) | Guardado | Toast tras guardar, anunciado por `aria-live` | Propuesto (texto del criterio de RF-UXD-134) | T03 RF-UXD-134 |
| MSG-067 | `ui.masivo.resultado` (clave propuesta) | {ok, plural, one {# procesado} other {# procesados}}, {error, plural, one {# con error} other {# con error}}. Ver detalle | Fin de una acción masiva (por ejemplo, "48 procesados, 2 con error") | Propuesto | T03 RF-UXD-108 |
| MSG-068 | `ui.avisos.descartado` (clave propuesta) | Aviso descartado. Deshacer | Descarte de un aviso en la bandeja, con 6 s para deshacer | Propuesto | T09 RF-COM-200 |
| MSG-069 | `com.envio.enCola` (clave propuesta) | En cola para enviar | Comunicación en `queued`; nunca se muestra "enviado" en ese estado | Propuesto | T09 RF-COM-141 |
| MSG-070 | `com.plantilla.variableInexistente` (clave propuesta) | La plantilla usa {variable}, que no existe para este tipo de comunicación. Corregila para poder publicarla | Publicar una plantilla con una variable no registrada | Propuesto | T09 RF-COM-134 |
| MSG-071 | `fac.plantilla.previsualizacionRequerida` (clave propuesta) | Antes de publicar, previsualizá la plantilla al menos una vez | Publicar una plantilla de comprobante sin previsualización | Propuesto | M05 RF-FAC-139 |
| MSG-072 | `wfl.plantilla.confirmarPublicacion` (clave propuesta) | Esta plantilla es de un documento fiscal o legal. Se enviará a aprobación y no se aplicará a documentos ya emitidos | Publicar plantilla de factura, NC, ND, recibo, intimación, contrato o acta | Propuesto | T11 RF-WFL-174, RF-WFL-176 |
| MSG-073 | `fac.lote.confirmarEmision` (clave propuesta) | Vas a emitir {count} comprobantes del lote {lote} por {importe}. Los que no se autoricen quedarán pendientes en la bandeja. ¿Emitir? | Emisión de un lote aprobado | Propuesto | M05 §5.6, RF-FIS-063 |
| MSG-074 | `fac.lote.confirmarAprobacion` (clave propuesta) | Aprobás el lote {lote}: {count} casos, {excepciones} excepciones abiertas. Quien preparó el lote no puede aprobarlo | Aprobación del lote (POL-FAC-APROBAR-LOTE) | Propuesto | T11 §18.2; M05 §5.5 |
| MSG-075 | `fac.comprobante.confirmarAnulacion` (clave propuesta) | Anular la factura {numero} genera una nota de crédito por {importe}. El comprobante original se conserva con la marca ANULADO. ¿Continuar? | Anulación o reversión de un comprobante | Propuesto | M05 §5.12; RF-WFL-177 |
| MSG-076 | `cob.recibo.confirmarAnulacion` (clave propuesta) | Anular el recibo {numero} por {importe} reabre la deuda imputada. Necesita la autorización de un supervisor | Anulación de recibo (POL-COB-ANULAR-RECIBO) | Propuesto | T11 §18.2; T02 `authorization_required` |
| MSG-077 | `cob.caja.confirmarCierreConDiferencia` (clave propuesta) | La caja cierra con una diferencia de {importe} en {medio}. Escribí la justificación para continuar | Cierre de sesión de caja con diferencia | Propuesto | M07 §7.10 (`differences.justification`) |
| MSG-078 | `mor.corte.confirmarEjecucion` (clave propuesta) | Vas a programar la suspensión de {count} servicios en la próxima ventana habilitada ({fecha}). Los servicios con protección vigente o sin constancia de aviso no se incluyen | Programación de cortes por mora | Propuesto | M08 RF-MOR-102, RF-MOR-119, RF-MOR-120 |
| MSG-079 | `mor.corte.bloqueadoProteccion` (clave propuesta) | No se puede suspender este servicio: tiene una protección vigente ({proteccion}) hasta el {fecha} | Evaluación normativa con decisión `blocked` | Propuesto | M08 RF-MOR-111, ESC de electrodependiente |
| MSG-080 | `com.campana.confirmarEnvio` (clave propuesta) | La campaña llegará a {count} personas por {canales}, con un costo estimado de {importe}. Se enviará a aprobación | Lanzar una campaña (POL-COM-CAMPANA) | Propuesto | T09 RF-COM-190, RF-COM-191 |
| MSG-081 | `tar.cuadro.confirmarPublicacion` (clave propuesta) | Publicás el cuadro tarifario {version} con vigencia desde el {fecha}. Se aplicará a los lotes que se preparen desde esa fecha | Publicar un cuadro tarifario (POL-TAR-PUBLICAR-CUADRO) | Propuesto | T11 §18.2; M04 |

### 2.6 Errores de API (RFC 9457) por módulo

Todos los textos de esta sección son **Propuestos** (OBS-02): la especificación declara el código y el caso, pero no el texto para la persona. Se proponen con las convenciones C-07 y C-08 de la portada.

#### 2.6.1 Transversales de plataforma (T08)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-082 | (sin `type` definido) | 404 | Recurso inexistente o de otro tenant; respuesta uniforme que no revela existencia | No encontramos lo que buscás. Puede que no exista o que no tengas acceso | RNF-NFR-091 |
| MSG-083 | (sin `type` definido) | 409 | `version` del documento no coincide (control optimista) | Otra persona modificó este registro mientras lo editabas. Recargá o compará los cambios | RNF-NFR-210 |
| MSG-084 | (sin `type` definido) | 413 | Cuerpo o lote de sincronización por encima del límite | El envío es demasiado grande. Probá con menos datos por vez | RNF-NFR-026 |
| MSG-085 | (sin `type` definido) | 415 | Tipo de archivo fuera de la lista blanca (por contenido real) | Este tipo de archivo no está permitido | RNF-NFR-078 |
| MSG-086 | (sin `type` definido) | 426 | Versión de la app menor que la mínima soportada | Hay una versión nueva de la app. La actualizamos sin perder lo que tenés pendiente | RNF-NFR-174 |
| MSG-087 | (sin `type` definido) | 429 | Límite de pedidos superado (incluye `Retry-After`) | Hiciste muchos intentos seguidos. Esperá {segundos} segundos y probá de nuevo | RNF-NFR-075 |

#### 2.6.2 Plataforma SaaS (T01)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-088 | `tenant-context-missing` | 500 | Solo en desarrollo: pedido sin contexto de tenant | (técnico, no se muestra en producción) | T01 §11 |
| MSG-089 | `tenant-suspended` | 423 | Tenant en modo de solo lectura por suspensión | La cooperativa está en modo consulta. Podés ver y exportar, pero no hacer cambios | T01 §11, §9 |
| MSG-090 | `tenant-closed` | 410 | Tenant cerrado | Esta cooperativa ya no opera en la plataforma | T01 §11 |
| MSG-091 | `module-not-licensed` | 403 | Módulo no contratado | Esta función no está incluida en el plan de tu cooperativa | T01 §11 |
| MSG-092 | `module-inactive` | 403 | Módulo contratado pero no activado | Esta función todavía no está activada en tu cooperativa | T01 §11 |
| MSG-093 | `module-read-only` | 409 | Módulo en consulta histórica (por ejemplo, emitir en `historyReadOnly`) | Este módulo está en modo consulta. No se pueden registrar operaciones nuevas | T01 §11, §9 |
| MSG-094 | `checklist-incomplete` | 409 | Activación con tareas de puesta en marcha pendientes (`items[]`) | Faltan pasos para activar esta función: {items} | T01 §11 |
| MSG-095 | `dependency-inactive` | 409 | Módulo del que depende está inactivo | Primero hay que activar {modulo} | T01 §11 |
| MSG-096 | `quota-exceeded` | 429 / 409 | Cupo del plan agotado | Alcanzaste el cupo de {dimension} de tu plan | T01 §11 |
| MSG-097 | `idempotency-conflict` | 422 | Misma clave de idempotencia con otro contenido | Esta operación ya se registró con otros datos. Revisá antes de repetirla | T01 §11 |
| MSG-098 | `support-grant-expired` | 401 | Acceso de soporte vencido | Tu acceso temporal de soporte venció | T01 §11 |
| MSG-099 | `transition-not-allowed` | 409 | Cambio de estado no permitido | No se puede pasar de {estadoActual} a {estadoNuevo} | T01 §11 |
| MSG-100 | `version-conflict` | 409 | Control optimista en objetos de plataforma | Otra persona modificó este registro. Revisá los cambios | T01 §11 |

#### 2.6.3 Identidad y autorizaciones (T02)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-101 | `sod_self_approval` | 403 | Aprobar una autorización propia | No podés aprobar una solicitud que iniciaste vos | T02 RF-IAM-090 |
| MSG-102 | `authorization_required` | 403 | Acción que exige autorización previa (incluye resumen) | Esta acción necesita autorización. ¿Querés pedírsela a un supervisor? | T02 (flujo de autorización de supervisor) |
| MSG-103 | `version_conflict` | 409 | Control optimista en IAM | Otra persona modificó este registro. Revisá los cambios | T02 (lista de errores de la API) |
| MSG-104 | `no_capability` | 403 | Llamada directa a la API sin capability | No tenés permiso para hacer esto | T02 (evaluación de capabilities) |
| MSG-105 | `outside_window` | 403 | Operación fuera de la franja horaria del usuario | Esta operación está fuera de tu horario habilitado. Un supervisor puede autorizarla | T02 (franjas horarias, PA-IAM-05; TST-IAM-41) |

#### 2.6.4 Workflow, documentos y firma (T11)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-106 | `wfl/sod-violation` | 403 | El usuario ya participó en la misma solicitud | Ya participaste en esta solicitud; tiene que decidir otra persona | T11 §17.5 |
| MSG-107 | `wfl/out-of-scope` | 403 | Pedido fuera de la sucursal o el área del aprobador | Esta solicitud es de una sucursal o área fuera de tu alcance | T11 §17.5 |
| MSG-108 | `wfl/delegation-expired` | 403 | Delegación no vigente | Tu delegación para decidir esto ya no está vigente | T11 §17.5 |
| MSG-109 | `wfl/step-already-decided` | 409 | Paso ya decidido | Este paso ya fue decidido | T11 §17.5 |
| MSG-110 | `wfl/task-claimed` | 409 | Otra persona tomó la tarea | Otra persona tomó esta tarea hace un momento | T11 §17.5 |
| MSG-111 | `wfl/fingerprint-mismatch` | 409 | El pedido cambió después de aprobado | El pedido cambió después de aprobarse. Hace falta una aprobación nueva | T11 §17.5 |
| MSG-112 | `wfl/invalid-transition` | 409 | Transición no permitida | No se puede hacer este cambio desde el estado actual | T11 §17.5 |
| MSG-113 | `wfl/legal-hold` | 409 | Documento bajo retención legal | Este documento está bajo retención legal y no se puede anular ni eliminar | T11 §17.5 |
| MSG-114 | `wfl/sequence-exhausted` | 409 | Numerador en su máximo | Se agotó la numeración de {secuencia}. Avisá al administrador | T11 §17.5 |
| MSG-115 | `wfl/form-invalid` | 422 | Formulario dinámico con errores por campo | Revisá los campos marcados | T11 §17.5 |
| MSG-116 | `wfl/mandatory-node` | 422 | Definición de trámite sin un paso obligatorio | Este paso es obligatorio y no se puede quitar del trámite | T11 §17.5 |
| MSG-117 | `wfl/schedule-window` | 422 | Programación fuera de ventana | La fecha elegida está fuera de la ventana permitida | T11 §17.5 |
| MSG-118 | `wfl/template-data-missing` | 422 | Falta una variable obligatoria del contrato de datos | No se pudo generar el documento: falta {variable} | T11 §17.5 |
| MSG-119 | `wfl/file-not-allowed` | 422 | Tipo o tamaño no admitido para el tipo documental | Este archivo no es válido para {tipoDocumental}. Permitidos: {tipos}, hasta {max} MB | T11 §17.5 |
| MSG-120 | `wfl/quarantined` | 423 | Versión en cuarentena por antivirus | El archivo está en revisión de seguridad y todavía no se puede descargar | T11 §17.5 |
| MSG-121 | `wfl/otp-invalid` | 401 | Código OTP de firma inválido o vencido | El código no es correcto o venció. Pedí uno nuevo | T11 §17.5 |
| MSG-122 | `wfl/share-link-gone` | 410 | Enlace compartido vencido o revocado | Este enlace ya no está disponible | T11 §17.5 |

#### 2.6.5 Marca y diccionario (T03)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-123 | `uxd.publish.forbidden` | 403 | Editor de marca sin permiso de publicar | Podés editar el borrador, pero publicarlo requiere otro permiso | T03 ESC-UXD-02 |
| MSG-124 | `uxd.error.dobleControl` | 409 | La misma persona que editó intenta publicar (PRM-UXD-021) | Otra persona tiene que revisar y publicar este cambio | T03 ESC-UXD-03 (OBS-03) |
| MSG-125 | `uxd.dictionary.protectedKey` | 422 | Edición por API de una clave protegida | Este texto está protegido y no se puede modificar | T03 ESC-UXD-11 |

#### 2.6.6 Fiscal (M06)

M06 §11 no fija el código HTTP de los cuatro errores de ARCA (columna "—"); lo mismo ocurre con los tres de M08 (sección 2.6.8).

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-126 | `fis/arca-rejected` | — | ARCA rechazó el comprobante (código ARCA en `extensions`) | ARCA rechazó el comprobante {numero}: {motivoArca}. Quedó en la bandeja para corregir | M06 §11 |
| MSG-127 | `fis/arca-unavailable` | — | ARCA no responde | ARCA no responde en este momento. El comprobante queda pendiente o pasa a contingencia | M06 §11; DEC-018 |
| MSG-128 | `fis/credential-expired` | — | Certificado o credencial ARCA vencidos | El certificado de ARCA de {entidad} venció. Hay que renovarlo para autorizar comprobantes | M06 §11 |
| MSG-129 | `fis/prevalidation-failed` | — | Dato fiscal inválido antes de enviar (por ejemplo, alícuota inexistente) | El comprobante tiene datos fiscales inválidos: {detalle}. Quedó detenido para corregir | M06 §11, §17 |
| MSG-130 | `fis/forbidden` | 403 | Operación fiscal sin capability (por ejemplo, subir certificado) | No tenés permiso para configurar ARCA | M06 §17 (caso 21) |

#### 2.6.7 Cuenta corriente y cobranza (M07)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-131 | `cob.idempotencia.conflicto` | 422 | Misma `Idempotency-Key` con otro cuerpo | Esta operación ya se registró con otros datos. Revisá antes de repetirla | M07 §11 |
| MSG-132 | `cob.caja.sesionCerrada` | 409 | Cobrar, anular o egresar sin sesión de caja abierta | Abrí tu caja para cobrar, anular o registrar egresos | M07 RF-COB-057, §11 |
| MSG-133 | `cob.obligacion.saldoCambiado` | 409 | Dos cajeros cobran la misma obligación a la vez | El saldo de esta deuda cambió hace un momento. Actualizá el importe y volvé a confirmar | M07 §11, ESC-COB-R08 |
| MSG-134 | `cob.imputacion.reglaIncumplida` | 422 | Imputación que saltea el orden configurado | Hay que cancelar primero {documento}, que es más antiguo | M07 §11, RF-COB-034 |
| MSG-135 | `cob.integridad.mediosNoCuadran` | 422 | La suma de medios no cuadra con el total | Los medios de pago suman {sumaMedios} y el total es {total}. Revisá los importes | M07 §11 |
| MSG-136 | `cob.rendicion.duplicada` | 409 | Archivo de rendición ya procesado (aunque tenga otro nombre) | Esta rendición ya fue procesada el {fecha} | M07 §11, ESC-COB-R07 |
| MSG-137 | `cob.obligacion.bloqueada` | 423 | Obligación con bloqueo de cobro | Esta deuda está bloqueada para cobro: {motivo} | M07 §11 |
| MSG-138 | `cob.anulacion.impedida` | 409 | Anulación no permitida por el estado del recibo | Este recibo no se puede anular: {motivo} | M07 §11 |
| MSG-139 | `cob.caja.anularOtroUsuario` | 403 | Anular la operación de otro cajero sin supervisor | Solo un supervisor puede anular operaciones de otro cajero | M07 ESC-COB-P03 |
| MSG-140 | `POS_CONFLICT` | 409 | Punto de venta de otra entidad jurídica en la numeración del recibo | El punto de venta no corresponde a la entidad del recibo | M07 RF-COB-087 |

#### 2.6.8 Mora y financiación (M08)

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-141 | `mor/mode-not-allowed` | — | Política con un modo de suspensión no admitido por el servicio o el tenant | Este servicio no admite el modo de suspensión elegido | M08 RF-MOR-222, ESC-MOR-53 |
| MSG-142 | `mor/works-levy-not-eligible` | — | Convenio que incluye cuotas de obra no vencidas | El convenio solo puede incluir cuotas de obra vencidas | M08 RN-MOR-146, ESC-MOR-59 |
| MSG-143 | `mor/agreement-mixed-legal-entities` | — | Convenio con deuda de dos entidades jurídicas | Un convenio no puede mezclar deudas de distintas entidades. Generá uno por entidad | M08 §7, ESC-MOR-62 |

#### 2.6.9 Otros módulos

| N.º | Código | HTTP | Cuándo aparece | Texto propuesto | Fuente |
|---|---|---|---|---|---|
| MSG-144 | `per/relationship-scope` | 403 | Un autorizado intenta una acción fuera de su relación (por ejemplo, pedir la baja con permiso solo de pago) | Tu autorización sobre esta cuenta no incluye esta gestión. Pedísela al {t:per.titular.one} | M01 AC-PER-16 |
| MSG-145 | `med.meter.alreadyInstalled` | 409 | Instalar un medidor ya instalado en otro punto | Este medidor ya está instalado en otro suministro | M03 ESC-MED-01 |
| MSG-146 | `tec.workOrder.duplicate` | 409 | Crear una OT igual a otra abierta del mismo contrato | Ya hay una orden abierta de este tipo para este contrato: {ot} | M10 API-TEC-07, ESC-TEC-03 |
| MSG-147 | `tec.booking.noCapacity` | 409 | Reserva de agenda sin cupo | Ya no quedan turnos en esa franja. Elegí otra | M10 API-TEC-18 |
| MSG-148 | `stk.versionConflict` | 409 | Reserva concurrente de stock | Esa unidad se reservó recién. Actualizá la disponibilidad | M13 ESC-STK-14 |
| MSG-149 | `ins.meeting.reserved` | 403 | Reunión reservada sin permiso | No tenés acceso a esta reunión | M17 ESC-INS-13 |
| MSG-150 | `con.errors.periodClosed` | 409 | Asiento manual en período contable cerrado | El período {periodo} está cerrado. Registrá el asiento en un período abierto | M15 ESC-03 (OBS-03) |
| MSG-151 | `client-suspended` | 403 | Cliente de API externa suspendido | El acceso de esta aplicación está suspendido | T10 §8.6, RF-BIA-086 |
| MSG-152 | `insufficient-scope` | 403 | Token de API sin el alcance pedido (por ejemplo, intentar escribir) | El acceso de esta aplicación no incluye esta operación | T10 ESC-BIA-08 |

Resumen de la sección 2: **152 mensajes** (MSG-001 a MSG-152): 65 con texto definido en la especificación (MSG-001 a MSG-065) y 87 con texto propuesto (16 de pantalla, MSG-066 a MSG-081, y 71 errores de API, MSG-082 a MSG-152).

---

## 3. Catálogo de plantillas de comunicación por canal y evento disparador

### 3.0 Cómo funciona una plantilla

Cada **tipo de comunicación** (`communicationTypes`, RF-COM-131) se dispara por un evento de dominio del catálogo de T11 §12.3 (`EVT-xxx`) o por un comando, y tiene una **plantilla por canal** (`messageTemplates`), versionada por tenant (borrador → publicada → retirada, RF-COM-132). El motor de T09 resuelve destinatario, canal (intersección de canales del tipo, preferencias, consentimiento, contacto disponible y canal habilitado), renderiza con las variables tipadas y el diccionario del tenant del destinatario, y registra la comunicación con su constancia (P-COM-06, T09 §9.7). Las plantillas de plataforma son heredables y cada tenant las activa, desactiva (si la finalidad lo permite) y personaliza (RF-COM-180).

### 3.1 Canales y restricciones

| Canal | Código | Restricciones de contenido | Conector / entrega | Fuente |
|---|---|---|---|---|
| Correo | `email` | Editor por bloques con tema del tenant, adjuntos por referencia privada (PDF del módulo dueño) o enlace firmado, preview y envío de prueba; link de baja de un clic en `community` y `marketing` | T06 (SES o SMTP) | RF-COM-133, RF-COM-173 |
| SMS | `sms` | Contador de caracteres y segmentos (GSM-7 160/153, UCS-2 70/67), máximo configurable, remitente alfanumérico ≤ 11, acortador de enlaces propio | T06 (proveedor a definir, PA-COM-13) | RF-COM-135 |
| WhatsApp | `whatsapp` | Solo plantillas aprobadas por el proveedor (categoría `utility`, `marketing` o `authentication`), variables posicionales, número E.164; mensaje libre solo en sesión de 24 h desde M09 | T06 (`meta_cloud` o `trii`) | RF-COM-136 |
| Push | `push` | Título, cuerpo, imagen, enlace profundo, badge; suscripciones por dispositivo (VAPID) | Web Push PWA | RF-COM-137 |
| Bandeja in-app | `in_app` | Título, cuerpo, enlace interno, `notifKind` para ícono y color, vigencia | Colección propia | RF-COM-138, RF-COM-202 |
| Mensaje impreso en factura | `print_invoice` | Texto por área (encabezado 120, cuerpo 400, pie 200, dorso 1.500 caracteres) y QR opcional; requiere aprobación | M05 al generar el PDF | RF-COM-195, PRM-COM-047, PA-COM-15 |
| Carta impresa | `print_letter` | Carta o notificación impresa entregada por M05 o M08 (avisos e intimaciones), con las mismas variables que el correo | Motor de documentos (T11) | RF-COM-130, RF-COM-152 (OBS-09) |
| Archivo para discador | `ivr_export` | Exportación de contactos para IVR desde una audiencia | Archivo (O6) | RF-COM-148 |

### 3.2 Finalidades y reglas de baja

| Finalidad | Abrev. | Opt-out del destinatario | Horario de no molestar | Ejemplos | Fuente |
|---|---|---|---|---|---|
| Seguridad | `sec` | No se puede desactivar; se elige canal entre los admitidos | Exenta | Código OTP, bloqueo, cambio de contraseña | RF-COM-171, RF-COM-143 |
| Regulada | `reg` | No se puede desactivar | Exenta cuando hay plazo legal | Intimación, aviso de corte por mora, convocatoria a asamblea | RF-COM-171 |
| Transaccional | `trx` | Por canal, con al menos un canal activo (ver OBS-16) | RF-COM-143 no la menciona | Factura emitida, pago confirmado | RF-COM-171 |
| Operativa | `ope` | Por canal, con al menos un canal activo | Aplica | Avisos internos, recordatorios | RF-COM-171 |
| Interrupción del servicio | `out` | Por canal, con al menos un canal activo | Exenta cuando es urgente | Corte programado, restablecimiento | RF-COM-171, RF-COM-143 |
| Comunidad | `com` | Opt-in explícito y desactivable | Aplica | Publicaciones, eventos | RF-COM-171 |
| Comercial | `marketing` | Opt-in explícito y desactivable | Aplica | Campañas comerciales | RF-COM-171 |

Palabras de baja por SMS o WhatsApp: registran opt-out solo de `marketing` y `community` en ese canal (P-COM-10). La lista exacta tiene una diferencia entre fuentes (OBS-04).

### 3.3 Registro de variables de plantilla

Formato por tipo: dinero `money:ARS:2`, fecha `date:dd-mm-yyyy` (RF-COM-134). Política de nulos por variable: vacío, valor por defecto, omitir línea o bloquear envío. Las variables `sensitive` nunca van en SMS, WhatsApp ni push (T09 §7.7).

| Ruta | Tipo | Módulo proveedor | Ejemplo (ficticio) | Nulo | Sensible | Estado |
|---|---|---|---|---|---|---|
| `tenant.nombre` | texto | T01/T03 | Cooperativa Demo Villa Ficticia | bloquear | No | RF-COM-134 |
| `tenant.razonSocialCorta` | texto | T03 | Coop Demo | bloquear | No | RF-COM-134 |
| `entidad.razonSocial` † | texto | T04 `legalEntities` | Cooperativa Demo Villa Ficticia Ltda. | por defecto (`tenant.nombre`) | No | Propuesta |
| `persona.nombre` | texto | M01 | Ana | por defecto ("Hola") | No | RF-COM-134 |
| `cuenta.numero` | texto | M01 | 000012345 | bloquear | No | RF-COM-134 |
| `servicio.nombre` | texto | M02 | Electricidad | omitir línea | No | RF-COM-134 |
| `contacto.enmascarado` † | texto | M01 | ****0001 | bloquear | No | Propuesta |
| `otp.codigo` † | texto | T02 | 482913 | bloquear | Sí (solo canal elegido para el OTP) | Propuesta |
| `otp.minutosVigencia` † | número | T02 | 10 | por defecto (10) | No | Propuesta |
| `seguridad.fechaHora` † | fecha-hora | T02 | 05-11-2026 09:41 | bloquear | No | Propuesta |
| `seguridad.dispositivo` † | texto | T02 | Chrome en Windows | vacío | No | Propuesta |
| `reclamo.numero` | texto | M09 | REC-2026-000731 | bloquear | No | RF-COM-134 |
| `reclamo.tipo` † | texto | M09 | Sin servicio | vacío | No | Propuesta |
| `reclamo.estado` † | texto | M09 | En revisión | bloquear | No | Propuesta |
| `ot.numero` † | texto | M10 | OT-2026-004512 | bloquear | No | Propuesta |
| `visita.fecha` † | fecha | M10 | 10-11-2026 | bloquear | No | Propuesta |
| `visita.franja` | texto | M10 | 9 a 13 h | bloquear | No | RF-COM-134 |
| `visita.eta` † | texto | M10 | 10:40 | omitir línea | No | Propuesta |
| `tecnico.nombre` † | texto | M10 | Martín | por defecto ("El técnico") | No | Propuesta |
| `corte.fecha` | fecha | T09/M10 | 12-11-2026 | bloquear | No | RF-COM-134 |
| `corte.horaDesde` † / `corte.horaHasta` † | texto | T09 | 08:00 / 12:00 | bloquear | No | Propuesta |
| `corte.zona` † | texto | T09 | Barrio Centro | bloquear | No | Propuesta |
| `corte.motivo` † | texto | T09 | Mantenimiento de red | vacío | No | Propuesta |
| `factura.numero` † | texto | M05 | B 0002-00001001 | bloquear | No | Propuesta |
| `factura.periodo` † | texto | M05 | 10-2026 | omitir línea | No | Propuesta |
| `factura.total` | dinero | M05 | ARS 25.095,00 | bloquear | No | RF-COM-134 |
| `factura.vencimiento1` | fecha | M05 | 20-11-2026 | bloquear | No | RF-COM-134 |
| `factura.vencimiento2` † | fecha | M05 | 30-11-2026 | omitir línea | No | Propuesta |
| `nc.numero` † / `nc.importe` † | texto / dinero | M05 | B 0002-00000057 / ARS 3.000,00 | bloquear | No | Propuesta |
| `deuda.total` | dinero | M07/M08 | ARS 41.230,00 | bloquear | No | RF-COM-134 |
| `deuda.vencida` † | dinero | M07 | ARS 25.095,00 | bloquear | No | Propuesta |
| `aviso.vencimiento` † | fecha | M08 | 25-11-2026 | bloquear | No | Propuesta |
| `suspension.fecha` † | fecha | M08 | 02-12-2026 | bloquear | No | Propuesta |
| `pago.importe` | dinero | M07 | ARS 25.095,00 | bloquear | No | RF-COM-134 |
| `pago.fecha` † | fecha | M07 | 18-11-2026 | bloquear | No | Propuesta |
| `pago.medio` † | texto | M07 | Tarjeta de débito | vacío | No | Propuesta |
| `recibo.numero` † | texto | M07 | X 0003-00004567 | bloquear | No | Propuesta |
| `debito.motivoRechazo` † | texto | M07 | Fondos insuficientes | vacío | No | Propuesta |
| `cuota.numero` † / `cuota.importe` † / `cuota.vencimiento` † | texto / dinero / fecha | M08 | 3 de 6 / ARS 7.200,00 / 10-12-2026 | bloquear | No | Propuesta |
| `prepago.importe` † | dinero | M07/M03 | ARS 10.000,00 | bloquear | No | Propuesta |
| `prepago.token` † | texto | M03 | 1234 5678 9012 3456 7890 | bloquear | Sí (enmascarado en el evento EVT-MED-23; completo solo al titular o autorizado, RF-MED-121) | Propuesta |
| `prepago.saldo` † | dinero o unidades | M03 | 35 kWh | bloquear | No | Propuesta |
| `medidor.numero` † | texto | M03/M10 | M-900001 | bloquear | No | Propuesta |
| `sueldo.periodo` † | texto | M16 | 10-2026 | bloquear | No | Propuesta |
| `asamblea.fecha` † / `asamblea.lugar` † | fecha / texto | M17 | 15-12-2026 / Salón social | bloquear | No | Propuesta |
| `link.factura` | enlace | M05 | https://coopdemo.ejemplo.test/f/AB12 | bloquear | No | RF-COM-134 |
| `link.pago` | enlace | M07 | https://coopdemo.ejemplo.test/p/CD34 | omitir línea | No | RF-COM-134 |
| `link.recibo` † / `link.documento` † | enlace | M07 / T11 | https://coopdemo.ejemplo.test/r/EF56 | bloquear | No | Propuesta |
| `link.app` † | enlace | M19 | https://coopdemo.ejemplo.test/app | por defecto | No | Propuesta |
| `link.baja` † | enlace | T09 | https://coopdemo.ejemplo.test/baja/GH78 | bloquear (solo `com`/`marketing`) | No | Propuesta (RF-COM-173) |

### 3.4 Plantillas de WhatsApp heredadas de ProCoop

RF-COM-136 pide plantillas iniciales equivalentes a las de ProCoop. Se mapean así (la categoría del proveedor es una propuesta y depende de su aprobación):

| Plantilla ProCoop | Tipo de comunicación GoodApps | Evento disparador | Variables posicionales propuestas | Categoría propuesta |
|---|---|---|---|---|
| `generacion_ot` | `tec.workOrder.created` | EVT-TEC-04 `tec.workOrder.created` | {{1}} `persona.nombre`, {{2}} `ot.numero`, {{3}} `servicio.nombre` | utility |
| `link_pago_solicitado` | `cob.paymentLink.statusChanged` | EVT-COB-20 `cob.paymentIntent.statusChanged` | {{1}} `persona.nombre`, {{2}} `pago.importe`, {{3}} `link.pago` | utility |
| `detalle_comprobantes` | `fac.invoice.issued` | EVT-FAC-07 + EVT-FIS-01 | {{1}} `persona.nombre`, {{2}} `factura.periodo`, {{3}} `factura.total`, {{4}} `factura.vencimiento1`, {{5}} `link.factura` | utility |
| `confirmacion_de_pago` | `cob.payment.confirmed` | EVT-COB-04 `cob.payment.confirmed` | {{1}} `persona.nombre`, {{2}} `pago.importe`, {{3}} `recibo.numero`, {{4}} `link.recibo` | utility |
| `recarga_prepaga` | `med.prepaidTopUp.delivered` | EVT-MED-23 `med.prepaidTopUp.delivered` | {{1}} `persona.nombre`, {{2}} `prepago.importe`, {{3}} `prepago.token`, {{4}} `medidor.numero` | utility |
| `cambio_dispositivo_medicion` | `med.meter.changed` | EVT-TEC-22 `tec.meter.changed` | {{1}} `persona.nombre`, {{2}} `medidor.numero`, {{3}} `cuenta.numero` | utility |

### 3.5 Catálogo de plantillas por evento disparador (alcance del piloto)

Subconjunto del catálogo transaccional de T09 §9.6 que usa la cooperativa piloto entre O1 y O10. Columnas: **Dest.** (`S` socio o titular, `U` usuario autorizado, `E` empleado, `T` administrador del tenant, `X` público sin login); **Canales** en orden de preferencia y alternativa (`E` correo, `S` SMS, `W` WhatsApp, `P` push, `A` in-app, `I` impreso); **N.º** cantidad de plantillas por canal; **Opt-out** y **Hito** según el catálogo (el hito es el estado mínimo que el módulo emisor considera cumplido). La plantilla por defecto tiene el mismo código que el tipo. Variables con `†` según la sección 3.3.

#### 3.5.1 Identidad, plataforma e integraciones (O1)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `iam.identity.welcome` | EVT-IAM-01 `iam.identity.activated` | S/E | trx | E, A | 2 | no | accepted | `persona.nombre`, `tenant.nombre`, `link.app` † |
| `iam.otp.code` | Comando de T02 (2FA, verificación, recupero) | S/E | sec | S, E, W | 3 | no | accepted | `otp.codigo` †, `otp.minutosVigencia` †, `tenant.razonSocialCorta` |
| `iam.identity.locked` | EVT-IAM-02 `iam.identity.locked` | S/E | sec | E, S, A | 3 | no | accepted | `persona.nombre`, `seguridad.fechaHora` †, `link.app` † |
| `iam.mfa.changed` | EVT-IAM-08 `iam.mfa.enrolled` / `removed` | S/E | sec | E, S, A | 3 | no | accepted | `persona.nombre`, `seguridad.fechaHora` †, `seguridad.dispositivo` † |
| `iam.password.changed` | EVT-IAM-09 `iam.password.changed` / `resetCompleted` | S/E | sec | E, A | 2 | no | accepted | `persona.nombre`, `seguridad.fechaHora` † |
| `iam.authorization.requested` | EVT-IAM-10 `iam.authorization.requested` | E | ope | P, A, E | 3 | canal | delivered | `persona.nombre` (solicitante), acción, enlace a la bandeja |
| `iam.authorization.decided` | EVT-IAM-10 `granted` / `rejected` / `expired` | E | ope | A, P | 2 | canal | delivered | acción, decisión, aprobador |
| `int.connection.blocked` | EVT-INT-02 `int.connection.blocked` / EVT-INT-04 `int.circuit.opened` | T/E | ope | E, A, P | 3 | no | accepted | nombre de la integración, desde cuándo |
| `int.credential.expiring` | EVT-INT-05 `int.certificate.expiring` / `expired` | T/E | ope | E, A | 2 | no | accepted | credencial, `entidad.razonSocial` †, fecha de vencimiento |

#### 3.5.2 Personas, portal, atención e interrupciones (O2)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `per.contact.verification` | EVT-PER-25 `per.contact.changed` (verificación pendiente) | S | sec | E o S (canal del contacto nuevo) | 2 | no | accepted | `otp.codigo` †, `tenant.razonSocialCorta` |
| `per.contact.changed` | EVT-PER-25 (aviso al contacto anterior) | S | sec | E, S, A | 3 | no | accepted | `persona.nombre`, `contacto.enmascarado` †, `seguridad.fechaHora` † |
| `por.accountAccess.granted` | EVT-POR-01 | S | sec | E, A | 2 | no | accepted | `persona.nombre`, `cuenta.numero` |
| `por.linkAttempt.blocked` | EVT-POR-05 | U | sec | E, S | 2 | no | accepted | `cuenta.numero` (enmascarada), `seguridad.fechaHora` † |
| `por.publicSubmission.receipt` | EVT-POR-10 `por.publicSubmission.receiptIssued` | X/S | reg | mismo medio de ingreso, E | 2 | no | delivered | número de constancia, `servicio.nombre`, `link.documento` † |
| `crm.case.created` | EVT-CRM-01 `crm.case.created` | S | trx | A, P, W, E, S | 5 | canal | accepted | `persona.nombre`, `reclamo.numero`, `reclamo.tipo` † |
| `crm.case.statusChanged` | EVT-CRM-05 (estados notificables) | S | trx | A, P, W, E | 4 | canal | delivered | `reclamo.numero`, `reclamo.estado` † |
| `crm.case.resolved` | EVT-CRM-08 `crm.case.resolved` | S | trx | A, P, W, E, S | 5 | canal | delivered | `reclamo.numero`, resolución |
| `crm.cancellation.receipt` | EVT-CRM-14 `crm.cancellationRequest.received` | S | reg | mismo medio, E, A | 3 | no | delivered | número de constancia, `servicio.nombre`, `link.documento` † |
| `crm.incident.notice` | EVT-CRM-16 `crm.incident.confirmed` / `updated` / `restored` | S afectados | out | P, A, W, S, E | 5 | canal | accepted | `servicio.nombre`, `corte.zona` †, estado |
| `com.outage.scheduled` | EVT-COM-22 / EVT-TEC-23 `tec.outage.notified` | S afectados | out | P, A, W, S, E | 5 | canal | accepted | `servicio.nombre`, `corte.fecha`, `corte.horaDesde` †, `corte.horaHasta` †, `corte.zona` †, `corte.motivo` † |
| `com.outage.started` | EVT-COM-23 / EVT-TEC-24 `tec.networkDevice.down` | S afectados | out | P, A, S, W | 4 | canal | accepted | `servicio.nombre`, `corte.zona` † |
| `com.outage.restored` | EVT-COM-25 / EVT-TEC-23 `tec.outage.finished` / EVT-CRM-16 `restored` | S afectados | out | P, A, W | 3 | canal | delivered | `servicio.nombre`, `corte.zona` † |
| `com.preference.unsubscribed` | EVT-COM-30 | S | trx | mismo canal | 1 | no | accepted | `tenant.razonSocialCorta`, canal y finalidad dados de baja |

#### 3.5.3 Técnica, catálogo y equipos (O3)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `tec.feasibility.verdict` | EVT-TEC-02 `tec.feasibility.verdictIssued` | S | trx | A, W, E, S | 4 | canal | delivered | `servicio.nombre`, resultado, próximos pasos |
| `tec.workOrder.created` | EVT-TEC-04 `tec.workOrder.created` | S | trx | W, S, A | 3 | canal | accepted | `persona.nombre`, `ot.numero` †, `servicio.nombre` |
| `tec.visit.reminder` | EVT-TEC-13 `tec.visit.statusChanged` = `scheduled` (D-1) | S | trx | W, S, P, A | 4 | canal | accepted | `visita.fecha` †, `visita.franja`, domicilio de servicio |
| `tec.visit.onTheWay` | EVT-TEC-13 = `en_route` | S | trx | P, W, S | 3 | canal | accepted | `tecnico.nombre` †, `visita.eta` † |
| `tec.visit.failed` | EVT-TEC-14 `tec.visit.failed` | S | trx | W, A, S | 3 | canal | accepted | motivo, enlace para reprogramar |
| `tec.workOrder.closed` | EVT-TEC-07 | S | trx | A, W, S, E | 4 | canal | accepted | `ot.numero` †, resultado |
| `tec.installation.activated` | EVT-TEC-16 `tec.installation.activationConfirmed` | S | trx | A, E, W | 3 | canal | delivered | `servicio.nombre`, fecha de activación, enlace a encuesta |
| `tec.emergency.notice` | EVT-TEC-35 `tec.emergency.declared` | S + afectados | sec | S, W, P, A | 4 | no | delivered | tipo de emergencia, qué hacer, teléfono de guardia |
| `cat.contract.activated` | `cat.contract.activated` (EVT-CAT-09 en T11) | S | trx | E, A | 2 | canal | accepted | `servicio.nombre`, plan, fecha de inicio |
| `cat.contract.reactivated` | `cat.contract.reactivated` (EVT-CAT-12) / EVT-TEC-19 `tec.reconnection.executed` | S | trx | W, S, A, P | 4 | canal | accepted | `servicio.nombre`, fecha |
| `cat.contract.terminated` | `cat.contract.terminated` (EVT-CAT-15) | S | reg | E, A, I | 3 | no | delivered | `servicio.nombre`, fecha de baja, equipos a devolver |
| `stk.equipment.returnOverdue` | EVT-STK-07 | S | trx | W, E, S, A | 4 | canal | delivered | equipo, fecha límite, lugar de devolución |

#### 3.5.4 Facturación, fiscal y cobranza (O4 y O5)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `fac.invoice.issued` | EVT-FAC-07 `fac.invoice.issued` + EVT-FIS-01 `fis.invoice.authorized` (se envía tras autorizar) | S | trx | E, W, A, P | 4 | canal (adhesión digital, RF-COM-174) | delivered | `persona.nombre`, `factura.numero` †, `factura.periodo` †, `factura.total`, `factura.vencimiento1`, `link.factura`, `link.pago`; adjunto PDF por referencia |
| `fac.invoice.published` | EVT-FAC-14 `fac.invoice.published` | S | trx | P, A | 2 | canal | delivered | `factura.periodo` †, `link.factura` |
| `fac.invoice.dueReminder` | JOB-COM-16 sobre EVT-COB-01 `cob.obligation.registered` (días de PRM-COM-062 y día del vencimiento; se cancela con EVT-COB-02) | S | trx | P, W, A, E, S | 5 | sí (OBS-16) | delivered | `factura.total`, `factura.vencimiento1`, `link.pago` |
| `fac.invoice.annulled` | EVT-FAC-08 / EVT-FAC-09 `fac.invoice.reversed` | S | trx | E, A | 2 | no | delivered | `factura.numero` †, motivo |
| `fac.creditNote.issued` | EVT-FAC-10 `fac.creditNote.issued` | S | trx | E, A | 2 | canal | delivered | `nc.numero` †, `nc.importe` †, `factura.numero` † de origen |
| `fac.debitNote.issued` | EVT-FAC-11 (incluye ND de intereses) | S | trx | E, A | 2 | canal | delivered | número e importe de la ND, concepto |
| `fac.paymentSlip.generated` | EVT-FAC-18 `fac.paymentSlip.generated` | S | trx | E, W, A | 3 | canal | accepted | importe, vencimientos, `link.pago` |
| `fac.billingRun.paused` | EVT-FAC-04 / EVT-FIS-21 `fis.authorization.globalFailure` | E | ope | A, P, E | 3 | no | accepted | lote, causa |
| `fis.authorization.rejected` | EVT-FIS-02 / EVT-FIS-03 `detained` | E | ope | A, E | 2 | canal | delivered | comprobante, motivo de ARCA |
| `fis.contingency.changed` | EVT-FIS-07 | E | ope | A, E, P | 3 | no | accepted | puntos de venta, modo (CAEA) |
| `cob.payment.confirmed` | EVT-COB-04 `cob.payment.confirmed` | S | trx | según PRM-COM-P3-001 y preferencias (E, W, S, P, A) | 5 | canal | accepted | `persona.nombre`, `pago.importe`, `pago.fecha` †, `recibo.numero` †, `link.recibo` †; un mensaje por recibo y entidad jurídica |
| `cob.paymentLink.statusChanged` | EVT-COB-20 `cob.paymentIntent.statusChanged` | S | trx | W, E, A | 3 | canal | accepted | `pago.importe`, `link.pago` |
| `cob.directDebit.rejected` | EVT-COB-16 `cob.directDebit.rejected` | S | trx | E, W, A, S | 4 | canal | delivered | `factura.total`, `debito.motivoRechazo` †, `link.pago` |
| `cob.chargeback.applied` | EVT-COB-18 | S | trx | E, A | 2 | no | delivered | importe, deuda reabierta |
| `cob.refund.executed` | EVT-COB-19 | S | trx | E, A | 2 | canal | accepted | importe, destino enmascarado |
| `cob.creditBalance.created` | EVT-COB-09 `cob.creditBalance.created` | S | trx | A, E | 2 | sí (OBS-16) | delivered | importe del saldo a favor |

#### 3.5.5 Mora, suspensión y financiación (O6)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `mor.notice.reminder` | EVT-MOR-09 `mor.notice.dispatchRequested` (instancia de aviso) | S | trx | W, E, S, P, A, I | 6 | canal | delivered | `persona.nombre`, `deuda.vencida` †, `aviso.vencimiento` †, `link.pago` |
| `mor.notice.intimation` | EVT-MOR-09 (instancia con evidencia exigida: intimación o preaviso) | S | reg | I, E, W, S (según el modelo de M08) | 4 | no | según `evidenceRequired` (delivered o physical_ack) | `deuda.total`, `deuda.vencida` †, `aviso.vencimiento` †, `suspension.fecha` †, servicios incluidos |
| `mor.interruption.scheduled` | EVT-MOR-12 `mor.interruption.scheduled` | S | reg | W, S, E, P, A | 5 | no | delivered | `servicio.nombre`, `suspension.fecha` †, `deuda.total`, `link.pago` |
| `mor.interruption.executed` | EVT-MOR-13 `mor.interruption.executed` | S | reg | W, S, E, P, A | 5 | no | accepted | `servicio.nombre`, medios de pago, cómo reactivar, `link.pago` |
| `mor.interruption.cancelled` | EVT-MOR-13 `.cancelled` | S | trx | W, A | 2 | canal | accepted | `servicio.nombre` |
| `mor.promise.changed` | EVT-MOR-11 `mor.promise.registered` / `broken` | S | trx | W, S, A | 3 | canal | accepted | fecha e importe prometidos |
| `mor.agreement.changed` | EVT-MOR-14 `created` / `activated` / `completed` / `defaulted` / `rehabilitated` | S | trx | E, W, A | 3 | canal | delivered | número de convenio, enlace de firma cuando corresponde |
| `mor.installment.due` | EVT-MOR-15 `mor.installment.due` | S | trx | W, P, A, E | 4 | sí (OBS-16) | delivered | `cuota.numero` †, `cuota.importe` †, `cuota.vencimiento` † |
| `mor.installment.overdue` | EVT-MOR-15 `mor.installment.overdue` | S | trx | W, S, A, E | 4 | canal | delivered | `cuota.numero` †, `cuota.importe` †, `link.pago` |
| `mor.reconnection.done` | EVT-TEC-19 `tec.reconnection.executed` con origen M08 | S | trx | W, S, P, A | 4 | canal | accepted | `servicio.nombre`, fecha |

#### 3.5.6 Medición y prepago (O7)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `med.prepaidTopUp.delivered` | EVT-MED-23 `med.prepaidTopUp.delivered` | S | trx | W, S, A, P | 4 | no | delivered | `prepago.importe` †, `prepago.token` †, `medidor.numero` † |
| `med.prepaidTopUp.failed` | EVT-MED-24 | S | trx | W, S, A | 3 | no | delivered | `prepago.importe` †, qué hacer (reintento o devolución) |
| `med.prepaidAccount.lowBalance` | EVT-MED-25 `med.prepaidAccount.lowBalance` | S | trx | P, W, S, A | 4 | canal | delivered | `prepago.saldo` †, `link.pago` |
| `med.selfReadingWindow.opened` | EVT-MED-26 | S | ope | P, A, W | 3 | sí | delivered | fechas de la ventana, enlace |
| `med.demand.transgression` | EVT-MED-18 `med.demand.transgressionDetected` | S (grandes usuarios) | trx | E, A | 2 | canal | delivered | `medidor.numero` †, demanda registrada y contratada |
| `med.meter.changed` | EVT-TEC-22 `tec.meter.changed` | S | trx | W, A, E | 3 | canal | accepted | `medidor.numero` †, `cuenta.numero` |

#### 3.5.7 Sueldos e institucional (O9 y O10)

| Código de tipo | Evento disparador (T11) | Dest. | Finalidad | Canales | N.º | Opt-out | Hito | Variables principales |
|---|---|---|---|---|---|---|---|---|
| `sue.payslip.issued` | EVT-SUE-14 `sue.payslip.issued` | E | trx | P, A, E | 3 | canal | delivered | `persona.nombre`, `sueldo.periodo` †, `link.documento` † (nunca importes en push, regla d de T09 §9.6) |
| `sue.payslip.voided` | EVT-SUE-16 | E | trx | A, E | 2 | no | delivered | `sueldo.periodo` † |
| `ins.meeting.convened` | EVT-INS-14 `ins.meeting.convened` | S (asociados) | reg | E, A, P, W, I | 5 | no | delivered | `asamblea.fecha` †, `asamblea.lugar` †, orden del día, `link.documento` † |

Resumen de la sección 3.5: **70 tipos de comunicación** y **225 plantillas por canal** (O1: 9 tipos y 23 plantillas; O2: 14 y 46; O3: 12 y 41; O4–O5: 16 y 46; O6: 10 y 40; O7: 6 y 19; O9–O10: 3 y 10). El resto del catálogo de T09 §9.6 (comunidad, ventas, compras, servicios sociales, avisos internos de configuración y tarifas) se adopta como está en el anexo.

### 3.6 Textos de ejemplo por canal (datos ficticios)

Ejemplos de plantilla publicada. Las variables se muestran resueltas con datos ficticios y, entre corchetes, la ruta de la variable. Los SMS siguen la recomendación C-27 de la portada (sin tildes para mantenerse en GSM-7).

#### PLT-01 · `iam.otp.code` · SMS

```text
COOPDEMO: tu codigo es 482913 [otp.codigo]. Vence en 10 min [otp.minutosVigencia]. No lo compartas con nadie.
```
Codificación GSM-7, 108 caracteres, 1 segmento.

#### PLT-02 · `iam.identity.locked` · Correo

```text
Asunto: Bloqueamos el acceso a tu cuenta por seguridad
Preencabezado: Detectamos varios intentos de ingreso el 05-11-2026 09:41

Hola, Ana [persona.nombre]:

Por seguridad bloqueamos temporalmente el acceso a tu cuenta de Coop Demo [tenant.razonSocialCorta]
después de varios intentos de ingreso fallidos el 05-11-2026 a las 09:41 [seguridad.fechaHora].

Si fuiste vos, esperá unos minutos y probá de nuevo, o recuperá tu contraseña.
Si no fuiste vos, cambiá tu contraseña en cuanto puedas.

[ Recuperar mi contraseña ]  → link.app

Cooperativa Demo Villa Ficticia Ltda. [entidad.razonSocial]
Este es un aviso de seguridad y no se puede desactivar.
```

#### PLT-03 · `per.contact.verification` · SMS

```text
COOPDEMO: para confirmar este celular ingresa el codigo 731205 [otp.codigo]. Si no lo pediste, ignora este mensaje.
```
Codificación GSM-7, 113 caracteres, 1 segmento.

#### PLT-04 · `crm.case.created` · WhatsApp

```text
Hola, Ana {{1}}. Recibimos tu reclamo REC-2026-000731 {{2}} por "Sin servicio" {{3}}.
Te vamos a avisar por este medio cada vez que cambie su estado.
Podés seguirlo en la app de Coop Demo.
```
Variables: {{1}} `persona.nombre`, {{2}} `reclamo.numero`, {{3}} `reclamo.tipo` †.

#### PLT-05 · `crm.case.resolved` · Push

```text
Título: Resolvimos tu reclamo
Cuerpo: El reclamo REC-2026-000731 quedó resuelto. Contanos si quedó todo bien.
Enlace: /app/gestiones/REC-2026-000731
```

#### PLT-06 · `com.outage.scheduled` · Push

```text
Título: Corte programado en tu zona
Cuerpo: Electricidad: 12-11-2026 de 08:00 a 12:00 en Barrio Centro por mantenimiento de red.
Enlace: /app/avisos/cortes
```

#### PLT-07 · `com.outage.scheduled` · SMS

```text
COOPDEMO: corte programado de Electricidad el 12-11-2026 de 08:00 a 12:00 en Barrio Centro. Motivo: mantenimiento de red.
```
Codificación GSM-7, 118 caracteres, 1 segmento. Anticipación mínima de publicación: PRM-COM-060 (48 h por defecto; la regulación por servicio está pendiente de relevar).

#### PLT-08 · `tec.visit.reminder` · WhatsApp

```text
Hola, Ana {{1}}. Te recordamos la visita técnica de Internet {{2}} para mañana, 10-11-2026 {{3}}, entre las 9 y las 13 h {{4}},
en Av. Siempre Viva 100 {{5}}. Si no vas a estar, reprogramala desde la app.
```
Variables: {{1}} `persona.nombre`, {{2}} `servicio.nombre`, {{3}} `visita.fecha` †, {{4}} `visita.franja`, {{5}} domicilio de servicio (variable a registrar).

#### PLT-09 · `tec.visit.onTheWay` · Push

```text
Título: El técnico está en camino
Cuerpo: Martín está en camino. Llega aprox. a las 10:40.
Enlace: /app/gestiones/OT-2026-004512
```
Texto alineado con `por.instaladorEnCamino` (T03).

#### PLT-10 · `tec.installation.activated` · Correo

```text
Asunto: Tu servicio de Internet ya está activo
Preencabezado: Desde el 10-11-2026 podés usarlo

Hola, Ana:

Tu servicio de Internet [servicio.nombre] quedó activo el 10-11-2026.
Tu primera factura va a incluir el período desde esa fecha.

¿Cómo fue la instalación? Respondé una encuesta de un minuto.
[ Responder la encuesta ]

Demo Conectividad Villa Ficticia S.A. [entidad.razonSocial]
```

#### PLT-11 · `fac.invoice.issued` · Correo

```text
Asunto: Tu factura de 10-2026 ya está disponible
Preencabezado: Total ARS 25.095,00 · vence el 20-11-2026

Hola, Ana [persona.nombre]:

Ya está tu factura de Electricidad del período 10-2026 [factura.periodo].

  Factura B 0002-00001001 [factura.numero]
  Cuenta 000012345 [cuenta.numero]
  Total: ARS 25.095,00 [factura.total]
  Vence: 20-11-2026 [factura.vencimiento1]

[ Pagar ahora ]  → link.pago
[ Ver la factura ]  → link.factura

Te adjuntamos el PDF de la factura.

Cooperativa Demo Villa Ficticia Ltda. [entidad.razonSocial]
Recibís este correo porque adheriste a la factura digital. Podés cambiar cómo recibirla desde la app.
```
Adjunto: `invoice_pdf` por referencia (o enlace firmado si PRM-FAC-131 = false).

#### PLT-12 · `fac.invoice.issued` · WhatsApp (plantilla `detalle_comprobantes`)

```text
Hola, Ana {{1}}. Ya está tu factura del período 10-2026 {{2}} por ARS 25.095,00 {{3}}, con vencimiento el 20-11-2026 {{4}}.
Podés verla y pagarla acá: https://coopdemo.ejemplo.test/f/AB12 {{5}}
```

#### PLT-13 · `fac.invoice.dueReminder` · Push

```text
Título: Tu factura vence en 3 días
Cuerpo: ARS 25.095,00 vence el 20-11-2026. Pagala desde la app en un minuto.
Enlace: /app/facturas
```
Se cancela si llega EVT-COB-02 `cob.obligation.settled` antes del envío.

#### PLT-14 · `fac.creditNote.issued` · Correo

```text
Asunto: Te emitimos una nota de crédito por ARS 3.000,00
Preencabezado: Corresponde a la factura B 0002-00001001

Hola, Ana:

Emitimos la nota de crédito B 0002-00000057 [nc.numero] por ARS 3.000,00 [nc.importe],
asociada a la factura B 0002-00001001 [factura.numero].
El importe se aplica a tu cuenta según corresponda.

[ Ver la nota de crédito ]

Cooperativa Demo Villa Ficticia Ltda.
```

#### PLT-15 · `cob.payment.confirmed` · WhatsApp (plantilla `confirmacion_de_pago`)

```text
Hola, Ana {{1}}. Recibimos tu pago de ARS 25.095,00 {{2}}. Recibo X 0003-00004567 {{3}}.
Podés descargarlo acá: https://coopdemo.ejemplo.test/r/EF56 {{4}}. ¡Gracias!
```

#### PLT-16 · `cob.payment.confirmed` · Correo (cobro con dos entidades jurídicas)

```text
Asunto: Recibimos tu pago de ARS 13.000,00
Preencabezado: Te enviamos 2 recibos, uno por cada entidad

Hola, Ana:

El 18-11-2026 [pago.fecha] registramos tu pago de ARS 13.000,00.
Como incluye servicios de dos entidades, te emitimos un recibo por cada una:

  Cooperativa Demo Villa Ficticia Ltda. — Recibo X 0003-00004567 — ARS 8.000,00 (Electricidad)
  Demo Conectividad Villa Ficticia S.A. — Recibo X 0001-00000912 — ARS 5.000,00 (Internet)

Te adjuntamos los dos recibos en PDF.
```
Caso de RF-COB-193 (un cobro, un recibo por entidad jurídica). La agrupación de los dos recibos en un solo mensaje sigue RF-COM-147.

#### PLT-17 · `cob.directDebit.rejected` · Correo

```text
Asunto: No pudimos debitar tu factura de 10-2026
Preencabezado: El banco informó: fondos insuficientes

Hola, Ana:

El débito automático de tu factura por ARS 25.095,00 [factura.total] fue rechazado por el banco.
Motivo informado: fondos insuficientes [debito.motivoRechazo].

Para evitar recargos, pagala antes del 20-11-2026 [factura.vencimiento1].

[ Pagar ahora ]  → link.pago
```

#### PLT-18 · `mor.notice.reminder` · WhatsApp

```text
Hola, Ana {{1}}. Te recordamos que tenés un saldo vencido de ARS 25.095,00 {{2}} en la cuenta 000012345 {{3}}.
Si ya pagaste, desestimá este mensaje. Podés pagar acá: https://coopdemo.ejemplo.test/p/CD34 {{4}}
```

#### PLT-19 · `mor.notice.intimation` · Correo

```text
Asunto: Intimación de pago — cuenta 000012345
Preencabezado: Saldo vencido ARS 41.230,00

Ana Ejemplo [persona.nombre completo]
Cuenta 000012345 — Electricidad

Registramos un saldo vencido de ARS 41.230,00 [deuda.total] correspondiente a los comprobantes que se detallan
en el documento adjunto.

[TEXTO LEGAL PENDIENTE: fórmula de intimación, plazo de pago y consecuencias, según PA-MOR-06 y PA-COM-05]

Plazo para regularizar: hasta el 25-11-2026 [aviso.vencimiento].

[ Pagar ahora ]  → link.pago

Adjunto: intimación en PDF (DOC-11).
```
Exige constancia de entrega (`evidenceRequired`); si el correo rebota, M08 genera tarea de canal alternativo (RF-MOR-091).

#### PLT-20 · `mor.interruption.scheduled` · SMS

```text
COOPDEMO: el servicio de Electricidad de la cuenta 000012345 se suspendera desde el 02-12-2026 por deuda de $41.230,00. Paga en coopdemo.ejemplo.test/p/CD34
```
Codificación GSM-7, 152 caracteres, 1 segmento. En SMS el importe se abrevia con el signo `$` para no superar un segmento.

#### PLT-21 · `mor.interruption.executed` · WhatsApp

```text
Hola, Ana {{1}}. Suspendimos el servicio de Electricidad {{2}} de la cuenta 000012345 {{3}} por deuda vencida.
Para reactivarlo, pagá ARS 41.230,00 {{4}} en la app, en caja o con el código de tu factura.
Al confirmarse el pago, se programa la reconexión.
```

#### PLT-22 · `med.prepaidTopUp.delivered` · WhatsApp (plantilla `recarga_prepaga`)

```text
Hola, Ana {{1}}. Tu recarga de ARS 10.000,00 {{2}} está lista.
Código para el medidor M-900001 {{4}}: 1234 5678 9012 3456 7890 {{3}}
Ingresalo en el teclado del medidor. También lo tenés en la app, en "Mi prepago".
```
El token completo solo se envía al titular o autorizado (RF-MED-121).

#### PLT-23 · `med.prepaidAccount.lowBalance` · Push

```text
Título: Te queda poco saldo de energía
Cuerpo: Quedan 35 kWh en tu medidor M-900001. Recargá desde la app.
Enlace: /app/prepago
```

#### PLT-24 · `sue.payslip.issued` · Bandeja in-app (PWA de empleado)

```text
Título: Tu recibo de sueldo de 10-2026 está disponible
Cuerpo: Ya podés verlo y firmarlo desde Mi trabajo.
Enlace: /app/trabajo/recibos/2026-10
Vigencia: hasta que se firme (acción pendiente, RF-COM-203)
```
Sin importes en el texto: el recibo es un dato sensible y se abre con sesión autenticada.

### 3.7 Mensajes impresos en factura y cartas

| Elemento | Regla | Fuente |
|---|---|---|
| Áreas de impresión | Encabezado (120), cuerpo (400), pie (200) y dorso (1.500 caracteres) | PRM-COM-047 |
| Selección | M05 consulta a T09 los mensajes aplicables por comprobante (cuenta, servicios, período) ordenados por prioridad y recortados al área | P-COM-09 (T09 §9.10) |
| QR opcional | Enlace firmado a encuesta, beneficio o publicación | RF-COM-195 |
| Aprobación | El mensaje impreso requiere aprobación antes de entrar a un lote | P-COM-09 |
| Registro | Se registra una comunicación `print_invoice` por comprobante, `delivered` cuando M05 marca la factura entregada | P-COM-09 |
| Cartas de mora y circulares | Plantillas con las mismas variables que el correo, PDF por el motor de documentos | RF-COM-152 (OBS-09) |
| Estado | Mensajes impresos en factura "A validar" (PA-COM-15) | RF-COM-195 |

Ejemplo ficticio de mensaje de cuerpo (área de 400 caracteres):

```text
Adherite a la factura digital y recibila por correo o WhatsApp el mismo día de la emisión. Es gratis y la podés pedir desde la app o en cualquier oficina de atención.
```

### 3.8 Reglas de publicación de plantillas

| N.º | Regla | Fuente |
|---|---|---|
| R-01 | Las plantillas se versionan; cada comunicación guarda la versión usada y cambiar una plantilla no altera comunicaciones ya generadas | RF-COM-132 |
| R-02 | Una plantilla con una variable inexistente no se puede publicar (mensaje MSG-070) | RF-COM-134 |
| R-03 | Una plantilla de WhatsApp no aprobada por el proveedor no se usa en envíos | RF-COM-136 |
| R-04 | El editor de SMS bloquea si el texto supera el máximo configurado | RF-COM-135 |
| R-05 | Preview con datos ficticios o de un destinatario autorizado y envío de prueba antes de publicar | RF-COM-133 |
| R-06 | Un error de render no envía texto roto: la comunicación queda `failed` con `failureClass = policy` y se alerta al administrador de plantillas | T09 §9.7 paso 5 |
| R-07 | En ambientes no productivos y tenants `sandbox` el envío real se reemplaza por captura, salvo lista blanca | RN-COM-061 |
| R-08 | Los tipos `sec` y `reg` no se pueden desactivar ni en el tenant ni por el destinatario | T09 §9.6 regla (a) |
| R-09 | Un tipo desactivado no genera comunicaciones, pero el evento sigue registrándose | T09 §9.6 regla (b) |
| R-10 | Los datos sensibles (por ejemplo, salud y sepelio de M18) no viajan en SMS, WhatsApp ni push: solo un enlace autenticado | T09 §9.6 regla (d) |
