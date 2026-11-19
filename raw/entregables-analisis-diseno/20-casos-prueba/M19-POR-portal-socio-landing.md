# Casos de prueba de aceptación — M19 POR — Landing, portal y app del socio (autogestión)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M19-POR-portal-socio-landing.md`](../../especificacion/anexos/M19-POR-portal-socio-landing.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 180 CP de requisitos funcionales, 0 CP de escenarios ESC y 29 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M19 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Landing pública (M19 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0001 | RF-POR-001; M19 §5.1; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Cada tenant dispone de una landing propia con su marca (T03), accesible por subdominio `<tenantSlug>.<dominioPlataforma>` y, opcionalmente, dominio propio. | Al crear y publicar TEN-001, `https://coop-a.<dominio>/` muestra la marca de TEN-001 y nunca la de otro tenant. |
| CP-POR-0002 | RF-POR-002; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | La landing se compone de bloques configurables: portada (hero), servicios destacados, accesos rápidos (Ingresar, Registrarme, Pagar, Botón de baja, Turnos), noticias, avisos de interrupción, trámites y requisitos, preguntas frecuentes… | El administrador activa/desactiva y ordena bloques; el orden se refleja tras publicar. |
| CP-POR-0003 | RF-POR-003; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Publicación versionada de la landing: borrador → en revisión → publicada; previsualización escritorio/celular; programación de publicación; reversión a la versión anterior. | Solo existe una versión publicada; revertir restaura la anterior en menos de 1 minuto y queda auditado. |
| CP-POR-0004 | RF-POR-004; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Catálogo público con los servicios habilitados del tenant para nuevas contrataciones (M02), sin servicios no ofertados. | TEN-001 (Agua, Electricidad, Cementerio parque) no muestra Gas; TEN-002 sí. |
| CP-POR-0005 | RF-POR-005; M19 §5.1; PRO-O2-16 | O2 | Estándar | regla | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Ficha pública de servicio: descripción, planes publicables con precio vigente e impuestos incluidos, requisitos y documentación, cobertura, condiciones, T&C, preguntas frecuentes y botón "Contratar". | Los precios mostrados coinciden con la tarifa vigente de M04 para la fecha de consulta y declaran si incluyen impuestos. |
| CP-POR-0006 | RF-POR-006; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Consulta de cobertura/factibilidad preliminar por domicilio sin login, con autocompletado de calles y **alternativa sin mapa**. | Ingresando calle y altura se obtiene "con cobertura / a evaluar / sin cobertura" sin operar un mapa. |
| CP-POR-0007 | RF-POR-007; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Noticias públicas (T09, canal `landing`) en lista y detalle, sin datos privados. | Una noticia publicada solo para empleados no aparece en la landing. |
| CP-POR-0008 | RF-POR-008; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Avisos de interrupciones y cortes programados por zona y servicio. | Un aviso con zona "Centro" se muestra con fecha, horario y servicios afectados. |
| CP-POR-0009 | RF-POR-009; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Botón de baja visible en la portada y en el pie de toda página de la landing para los servicios alcanzados. Servicios alcanzados según DEC-057: habilitado en Internet, TV y telefonía, configurable en los demás; el código de seguimiento se… | El botón es visible sin desplazamiento en la portada (escritorio y celular) y en el pie. |
| CP-POR-0010 | RF-POR-010; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con PUB-BAJA-001: Recepción pública de baja de Internet con código `BJ-26-000123` (identificada) | Baja pública sin registro previo: el solicitante elige servicio, se identifica con datos mínimos (DNI/CUIT, número de cuenta o suministro si lo conoce, domicilio) y un medio de contacto; recibe un **código identificador** por el mismo… | La solicitud se registra sin crear usuario; el código se entrega en pantalla y por el medio informado dentro del plazo de PRM-POR-081. |
| CP-POR-0011 | RF-POR-011; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Seguimiento público de la baja por código + documento, mostrando solo estado y fechas. | Con código y DNI correctos se ve "Recibida / En proceso / Ejecutada con fecha efectiva"; con datos incorrectos, respuesta genérica. |
| CP-POR-0012 | RF-POR-012; M19 §5.1; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Consulta y pago de facturas sin login (opcional por tenant): número de cuenta + dato verificador; muestra solo comprobantes impagos y datos enmascarados. | Con el parámetro apagado la ruta responde "no disponible"; encendido, nunca se muestran nombre completo ni domicilio completo. |
| CP-POR-0013 | RF-POR-013; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Sección pública de trámites y requisitos: lista de formularios con descripción, documentación requerida, PDFs descargables y aviso de si requieren sesión. | Un formulario tipo PDF se descarga sin login; uno tipo trámite web lleva a ingresar y retoma el formulario tras el login. |
| CP-POR-0014 | RF-POR-014; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Formulario público de contacto/consulta que crea un caso CRM de tipo consulta y notifica a la casilla configurada. | El caso aparece en la bandeja de M09 con canal `landing`; el solicitante recibe número de seguimiento. |
| CP-POR-0015 | RF-POR-015; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Accesos "Ingresar" y "Registrarme" que mantienen el contexto del tenant (marca, diccionario, servicio elegido). | Desde la ficha de Internet, "Contratar" → registro → vuelve al formulario de Internet con la marca del tenant. |
| CP-POR-0016 | RF-POR-016; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con CEM-BUSCAR-DEMO: Buscador de difuntos habilitado en TEN-001 (PRM-SOC-050 = true) con un registro ficticio "Difunto Demo", sector A, unidad 12 (HUECO-CEM-02) | Punto de entrada genérico de plataforma con buscador de cooperativa por nombre o localidad. | Buscar "Ejemplo" lista TEN-001 y TEN-002 y redirige a su landing. |
| CP-POR-0017 | RF-POR-017; M19 §5.1; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Encuesta externa por enlace con token sin login (T09). | Un token vencido muestra mensaje claro; uno válido permite responder una sola vez. |
| CP-POR-0018 | RF-POR-018; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Páginas legales por tenant: términos, privacidad, declaración de accesibilidad, T&C por servicio, con versión vigente. | Cada página muestra versión y fecha de vigencia. |
| CP-POR-0019 | RF-POR-019; M19 §5.1; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Metadatos SEO, Open Graph, `sitemap.xml` y `robots.txt` por tenant; feed RSS opcional de noticias públicas. | `sitemap.xml` lista solo páginas públicas del tenant. |
| CP-POR-0020 | RF-POR-020; M19 §5.1; PRO-O7-12 | O7 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Redirecciones permanentes desde las URLs de CoopOnline que la cooperativa ya difundió. | Una URL configurada responde 301 a la ruta equivalente. |
| CP-POR-0021 | RF-POR-021; M19 §5.1; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con NOT-001: Noticia pública "Mantenimiento programado de agua" (landing + muro de socios) | Aislamiento de contenido entre tenants y ausencia de datos de cuentas en la landing. | Prueba automatizada: ninguna respuesta pública contiene identificadores de cuentas no aportados por el solicitante. |
| CP-POR-0177 | RF-POR-177; M19 §5.1; PRO-O10-05 | O10 | Estándar | regla | TEN-001 con CEM-BUSCAR-DEMO: Buscador de difuntos habilitado en TEN-001 (PRM-SOC-050 = true) con un registro ficticio "Difunto Demo", sector A, unidad 12 (HUECO-CEM-02) | Buscador público de difuntos en la landing (PAN-POR-104): por apellido y nombre devuelve nombre y ubicación (cementerio, sector, unidad) con datos de M18 (API-SOC-061). Solo se muestra si PRM-SOC-050 = true en algún establecimiento del… | Con PRM-SOC-050 = false la ruta responde "no disponible" y el ítem no figura en el menú; con true, buscar "Demo" lista solo nombre y ubicación. |
### 1.2 Registro, identidad y ámbito (M19 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0022 | RF-POR-022; M19 §5.2; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Registro sencillo desde la landing: correo o celular, contraseña o Google; verificación del medio por OTP/enlace (T02). Ingreso con contraseña o con código OTP de 6 dígitos por correo o SMS, habilitable por tenant, sin enlace mágico… | Una persona sin cuenta en la cooperativa se registra en menos de 2 minutos y queda "Usuario registrado". |
| CP-POR-0023 | RF-POR-023; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | El registro no crea asociado, titular, cuenta ni contrato; el inicio muestra las opciones de contratar y vincular. | Tras registrarse, M01 y M17 no tienen registros nuevos. |
| CP-POR-0024 | RF-POR-024; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Datos mínimos en el registro; los datos fiscales y de domicilio se piden en la etapa del trámite que los requiera. | El registro no exige CUIT; el formulario de contratación lo pide solo si el servicio lo requiere para facturar. |
| CP-POR-0025 | RF-POR-025; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Recuperación de acceso (T02) con respuesta genérica anti-enumeración. | Un correo inexistente recibe la misma respuesta que uno existente. |
| CP-POR-0026 | RF-POR-026; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Ingreso con Google y, si el tenant lo habilita, con identidad federada provincial (CiDi). Por DEC-067 el mecanismo de proveedor federado está en O1 (T02) y CiDi se habilita por tenant al publicar el portal (O2), con nivel mínimo 2 para… | Con 40 apagado no se muestra CiDi; Google no concede pertenencia ni vínculo por coincidencia de correo (checklist 47). |
| CP-POR-0027 | RF-POR-027; M19 §5.2; PRO-O2-16 | O2 | Estándar | regla | TEN-001 con FRM-CAMBIO-TIT: Cambio de titularidad v1 con evidencia obligatoria | Selección explícita del ámbito (tenant), comprobada en servidor y visible en la barra superior; el cambio recalcula permisos y purga caché, descargas y colas locales del ámbito anterior. | Al pasar de TEN-001 a TEN-002, ningún dato de TEN-001 queda en pantalla, caché del Service Worker ni IndexedDB. |
| CP-POR-0028 | RF-POR-028; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Espacios dentro del tenant (socio, empleado, campo) con selector cuando la persona tiene más de uno; cada espacio tiene menú, inicio y almacén de datos propios. | Un socio-empleado ve el selector; al cambiar de espacio se limpian los stores del otro. |
| CP-POR-0029 | RF-POR-029; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Aceptación versionada de términos y privacidad al registrarse y al publicarse una nueva versión (guard de router). | Con nueva versión publicada, el usuario debe aceptarla antes de seguir; queda registrada la versión aceptada. |
| CP-POR-0030 | RF-POR-030; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Exigir y verificar teléfono y/o correo del usuario según el tenant; reconfirmarlos periódicamente al ingresar si se configura. | Con 18 activo, sin correo verificado no se puede adherir a factura digital ni vincular cuentas. |
| CP-POR-0031 | RF-POR-031; M19 §5.2; PRO-O6-08 | O6 | Estándar | seguridad | TEN-001 con USR-MIGR: migrado@example.com, importado de CoopOnline con 2 vínculos `invitado` hasta activar | Activación de usuarios migrados de CoopOnline sin re-registro: al ingresar con su correo/celular conocido reciben OTP, definen contraseña y encuentran sus cuentas vinculadas. | Un usuario migrado entra, valida OTP y ve sus 2 cuentas sin repetir la vinculación. |
| CP-POR-0032 | RF-POR-032; M19 §5.2; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Cierre de sesión por inactividad configurable y "cerrar sesión en todos los dispositivos" (T02). | Tras el tiempo configurado sin actividad se pide reingreso conservando el borrador abierto. |
### 1.3 Vinculación de cuentas, accesos y representaciones (M19 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0033 | RF-POR-033; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Vincular cuenta con código de socio + clave/suministro, con textos de botón, título, campos y observación configurables por tenant. | Los textos se toman de `dict:por.vincular.*` editables por el tenant. |
| CP-POR-0034 | RF-POR-034; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Vincular con número de suministro/medidor + DNI/CUIT del titular. | Con datos correctos se crea el acceso; con DNI que no coincide, se rechaza con mensaje genérico. |
| CP-POR-0035 | RF-POR-035; M19 §5.3; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Vincular con datos de una factura: número de comprobante + importe total + fecha de vencimiento. | La combinación de los tres datos de una factura de los últimos 12 meses habilita la vinculación como `titular` solo si además coincide el DNI informado en el perfil; si no, queda `autorizadoConsulta` pendiente de confirmación del titular. |
| CP-POR-0036 | RF-POR-036; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Vincular por identidad federada verificada (CiDi u otra) cuando el DNI verificado coincide con el titular. Exige CiDi nivel 2 o superior (DEC-067). | Con el método habilitado y DNI verificado igual al del titular, el acceso se crea y se avisa al titular. |
| CP-POR-0037 | RF-POR-037; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con PUB-BAJA-001: Recepción pública de baja de Internet con código `BJ-26-000123` (identificada) | Vinculación asistida: un operador emite desde admin un código de invitación de un solo uso para una cuenta y una persona identificada presencialmente. | El código vence a las 72 h y solo lo puede usar el usuario cuyo DNI coincide. |
| CP-POR-0179 | RF-POR-179; M19 §5.3; PRO-O2-16 | O2 | Estándar | regla | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Vincular con **código al contacto del titular** (DEC-043): el usuario indica la cuenta o el suministro; M19 pide a M01 enviar un código de 6 dígitos de un solo uso al correo o celular verificado del titular (enmascarado en pantalla); el… | Con el código correcto dentro de los 10 minutos se crea el acceso y se avisa al titular; un sexto intento fallido bloquea la vinculación 15 minutos. |
| CP-POR-0038 | RF-POR-038; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Si la verificación es insuficiente, se deniega y se ofrece el circuito de acreditación (presencial, envío de documentación, contacto). | El mensaje no revela si la cuenta existe; ofrece "Solicitar vinculación asistida". |
| CP-POR-0039 | RF-POR-039; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Límite de intentos y anti-enumeración: misma respuesta y tiempo ante cuenta inexistente o datos erróneos; bloqueo temporal; alerta de seguridad. | Al sexto intento fallido en 15 min el usuario queda bloqueado para vincular durante 15 min. |
| CP-POR-0040 | RF-POR-040; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Aviso al titular (por sus canales verificados) de toda nueva vinculación o representación sobre su cuenta, con opción de revocarla. | El titular recibe aviso y un enlace "No fui yo / Revocar". |
| CP-POR-0041 | RF-POR-041; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | "Mis cuentas": cuentas vinculadas con rol (titular, cotitular, representante, autorizado), servicios, saldo, cuenta por defecto, desvincular. | Desvincular retira el acceso futuro y no borra el historial de lo actuado. |
| CP-POR-0042 | RF-POR-042; M19 §5.3; PRO-O2-16 | O2 | Estándar | seguridad | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Alcance por acción en cada acceso: consultar, pagar, gestionar, solicitar baja, firmar. | Un autorizado con "consultar" no ve el botón Pagar; la API devuelve 403 si lo intenta. |
| CP-POR-0043 | RF-POR-043; M19 §5.3; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Representaciones: el titular invita a otra persona (por correo/celular/DNI) con acciones y vigencia; la persona acepta; el titular puede revocar; al vencer se retira el acceso. | Revocar en el portal impide el acceso en la siguiente solicitud de la persona revocada. |
| CP-POR-0044 | RF-POR-044; M19 §5.3; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con REACT-DEMO-ARANCEL: Reactivación posterior al plazo ARS 5.000, **deshabilitada** hasta validación legal | Representación legal, apoderados y personas jurídicas: la persona sube la evidencia (poder, estatuto, designación) y un operador la valida; el acceso nace de la relación validada en M01. | Sin validación del operador no se crea el acceso; la evidencia queda en el expediente. |
| CP-POR-0045 | RF-POR-045; M19 §5.3; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Pagador eventual: pagar un comprobante ajeno con su código de pago o código QR/barras, sin ver datos de la cuenta ni otros contratos. | El pagador ve solo importe, vencimiento y nombre enmascarado de la cooperativa/servicio. |
| CP-POR-0046 | RF-POR-046; M19 §5.3; PRO-O2-16 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Toda gestión en nombre de tercero registra quién actuó y por quién (acceso utilizado). | El caso CRM y el checkout guardan `actorUserId` y `onBehalfOfPersonId`. |
### 1.4 Inicio por rol y navegación (M19 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0047 | RF-POR-047; M19 §5.4; PRO-O2-17 | O2 | Estándar | regla | TEN-001 con USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000 | Landing por rol calculada en servidor: visitante, usuario registrado sin cuenta, socio activo, socio moroso, socio suspendido, socio con baja, representante, empleado, técnico/lecturista/cobrador (redirección a app de campo). | Un usuario con una cuenta suspendida por mora entra a `/app/inicio` con la variante "suspendido". |
| CP-POR-0048 | RF-POR-048; M19 §5.4; PRO-O2-17 | O2 | Estándar | regla | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Inicio del socio: saldo y próximo vencimiento por cuenta, acciones rápidas (Pagar, Reclamar, Contratar, Coordinar visita), trámites en curso, visitas próximas, avisos no leídos, encuestas pendientes, publicación destacada del muro. | Cada tarjeta lleva a su detalle en un toque; sin datos, estado vacío con acción sugerida. |
| CP-POR-0049 | RF-POR-049; M19 §5.4; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000 | Variante moroso: banner con deuda vencida, botones Pagar y Ver convenios; no bloquea consultas, reclamos ni baja. | El banner aparece cuando M08 informa deuda vencida y desaparece al confirmarse el pago. |
| CP-POR-0050 | RF-POR-050; M19 §5.4; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Variante suspendido: estado del servicio, causa, pasos para reconectar, costo habilitado y estado real de la reconexión. | Tras pagar, el banner dice "Pago confirmado — reconexión en trámite" hasta el evento de reconexión. |
| CP-POR-0051 | RF-POR-051; M19 §5.4; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Variante usuario registrado sin cuenta: contratar, vincular cuenta existente, novedades, trámites en curso de alta. | El inicio no muestra secciones vacías de facturas. |
| CP-POR-0052 | RF-POR-052; M19 §5.4; PRO-O2-17 | O2 | Estándar | regla | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Banners configurables por rol, servicio y segmento con vigencia (campañas, avisos de vencimiento, mantenimiento). | Un banner para "morosos de Internet" solo lo ven socios con ese estado. |
| CP-POR-0053 | RF-POR-053; M19 §5.4; PRO-O2-17 | O2 | Estándar | regla | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Selector de cuenta activa: al cambiarla se recalculan inicio, rol y menú. | Con dos cuentas (una al día y otra morosa), el banner sigue a la cuenta seleccionada. |
### 1.5 Mis servicios, contratación y trámites (M19 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0054 | RF-POR-054; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | "Mis servicios": por cuenta, cada contrato con su **estado del servicio** (M01/M02) separado del **estado del trámite** en curso (M09). | Un contrato activo con baja solicitada muestra "Servicio: Activo" y "Trámite de baja: En proceso". |
| CP-POR-0055 | RF-POR-055; M19 §5.5; PRO-O3-06 | O3 | Estándar | regla | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Detalle del servicio: plan, domicilio, medidor, fechas de alta/baja, equipo en comodato, adherentes, fecha efectiva de inicio y detalle del primer cobro (prorrateo, anticipado/vencido). | Tras la activación de Internet se ve fecha efectiva y el importe prorrateado del primer período. |
| CP-POR-0056 | RF-POR-056; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Contratar un servicio habilitado desde el portal con el formulario versionado del servicio (asistente por pasos). | Ana inicia "Internet Fibra 100" y completa el asistente en 4 pasos. |
| CP-POR-0057 | RF-POR-057; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Tipos de campo del motor de formularios: texto, número, fecha, lista, consulta a catálogo, archivo/foto, adherentes, domicilio con calles normalizadas, selección de plan, firma manuscrita en pantalla, aceptación de T&C, grilla de DDJJ… | Cada tipo valida en cliente y servidor con el mismo esquema Zod. |
| CP-POR-0058 | RF-POR-058; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Validación inline, guardado automático de borrador y recuperación de la carga interrumpida. | Cerrar la pestaña en el paso 3 y volver permite continuar en el paso 3. |
| CP-POR-0059 | RF-POR-059; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Adjuntar requisitos (DNI frente y dorso, título o contrato de locación, constancia fiscal) con cámara o archivo, compresión y verificación de tipo/tamaño. | Un PDF de 30 MB se rechaza con el límite explicado; una foto se comprime antes de subir. |
| CP-POR-0060 | RF-POR-060; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Si el servicio exige asociación, el asistente informa e inicia la solicitud de ingreso (M17) sin bloquear el resto del trámite. | El trámite queda "En revisión — asociación pendiente". |
| CP-POR-0061 | RF-POR-061; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Al enviar se crea el caso CRM (M09) de tipo solicitud de alta con su número y una constancia descargable. | La constancia contiene número, fecha, servicio y datos aportados. |
| CP-POR-0062 | RF-POR-062; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Seguimiento del trámite con línea de tiempo: recibido, en revisión, observado, factibilidad, aprobado, visita coordinada, instalado, servicio activo / rechazado / cancelado. | Cada hito muestra fecha y, si corresponde, la próxima acción del socio. |
| CP-POR-0063 | RF-POR-063; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Responder observaciones del operador: aportar documentación faltante o corregir datos sin rehacer el trámite. | El trámite observado se reabre en el campo observado y vuelve a "En revisión". |
| CP-POR-0064 | RF-POR-064; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Cancelar una solicitud de alta antes de su ejecución. | Tras cancelar, la visita reservada se libera en M10. |
| CP-POR-0065 | RF-POR-065; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Solicitar baja de un servicio contratado desde la sesión, sin cargo por solicitarla, con constancia y código. | La baja se registra aunque la cuenta tenga deuda. |
| CP-POR-0066 | RF-POR-066; M19 §5.5; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con SUS-DEMO-GRATIS: Suspensión temporal de Internet hasta 3 meses, ARS 0 | Solicitar suspensión temporal y reactivación mostrando condiciones, costos habilitados y efectos antes de confirmar; registrar aceptación. | Para SUS-DEMO-GRATIS se muestra ARS 0 y la fecha efectiva solicitada. |
| CP-POR-0067 | RF-POR-067; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Trámites de modificación: cambio de plan, cambio de titularidad, cambio de domicilio postal, cambio de categoría, alta de adherentes, como formularios por servicio. | Cada trámite crea su caso con el contrato objeto. |
| CP-POR-0068 | RF-POR-068; M19 §5.5; PRO-O10-13 | O10 | Estándar | regla | TEN-001 con FRM-ADHERENTE: Alta de adherente a Sepelio v1 | Alta de adherentes en servicios que los admiten, validando existencia de la persona y la regla de adherente único por servicio. El trámite lo resuelve M18, dueño único de adherentes (RF-SOC-030, DEC-071), desde PAN-POR-98. | Con 2400 apagado, una persona ya adherente del mismo servicio en otra cuenta es rechazada con explicación. |
| CP-POR-0069 | RF-POR-069; M19 §5.5; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con FRM-DDJJ-ART: DDJJ de artefactos v1 (energía): artefactos eléctricos y vehículos eléctricos, plantilla `electricAppliancesAndVehicles` de M02 (HUE-GAS-01) | Declaraciones juradas **por servicio** con la plantilla que define M02 para cada servicio (PRM-CAT-110, API-CAT-41): **gas**, artefactos a gas con potencia en kcal/h; **energía**, artefactos eléctricos (W) y vehículos eléctricos (dominio… | Con 59 activo, la cuenta sin DDJJ muestra la advertencia en Mis servicios; un contrato GAS muestra la grilla con potencia en kcal/h y rechaza una fila sin potencia. |
| CP-POR-0070 | RF-POR-070; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Activación inmediata solo para acciones declaradas de autoservicio sin intervención (adhesiones, recarga prepaga, cambios de plan digitales configurados); todo lo demás es trámite. | Un cambio de plan de Internet configurado como autoservicio queda aplicado con fecha efectiva del próximo período y se informa así. |
| CP-POR-0071 | RF-POR-071; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | El portal nunca muestra "Activo" o "Dado de baja" hasta recibir el evento del módulo dueño. | Con el caso aprobado pero sin `cat.contract.activated`, el servicio figura "Pendiente de alta". |
| CP-POR-0174 | RF-POR-174; M19 §5.5; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | **Composición de pantallas del socio**: M19 es dueño de la ruta, la navegación y la composición de cada pantalla de `pwa-socio` y `landing`; las pantallas de socio de otros módulos se embeben como componentes en una PAN-POR que declara el… | Cada PAN de canal socio o landing de otro anexo figura en §10.6.A con su PAN-POR contenedora; el mapa del sitio de T03 apunta a la PAN-POR. |
| CP-POR-0176 | RF-POR-176; M19 §5.5; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Bloque **"Plan de cuotas de obra"** en el detalle del contrato (PAN-POR-30) para contratos de obra (tipo 17): cuota actual n/N, cuotas facturadas, saldo, unidades facturadas sobre totales y próxima cuota estimada, en solo lectura desde M04… | Un contrato de obra con 4 de 10 cuotas facturadas muestra "Cuota 5 de 10", el saldo y las unidades; el bloque no aparece en contratos que no son de obra. |
| CP-POR-0178 | RF-POR-178; M19 §5.5; PRO-O10-04 | O10 | Estándar | seguridad | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | **Servicios sociales e institucionales del socio** como tarjetas de M19: Mi grupo (PAN-POR-98), Solicitudes sociales (PAN-POR-99), Cementerio (PAN-POR-100), Vivienda (PAN-POR-101) y Mi asociación (PAN-POR-102), que embeben PAN-SOC-30 a… | Un socio sin servicios sociales no ve las tarjetas; con sepelio activo ve "Mi grupo" con sus integrantes. |
| CP-POR-0180 | RF-POR-180; RN-UXD-006; M19 §5.5; PRO-O2-17 | O2 | Estándar | seguridad | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | **Comunidad en la tabbar del socio** (PAN-POR-105): la tabbar del socio es Inicio · Cuentas y servicios (rótulo corto "Cuentas", RN-UXD-006) · (+) · Gestiones · Comunidad, con Perfil desde el avatar y FAB = Pagar por defecto; Comunidad… | Un socio con `com.wall.ver` y sin `com.surveys.responder` ve Comunidad con Muro y Novedades, sin la pestaña Encuestas; la tabbar no muestra "Facturas" ni "Perfil". |
### 1.6 Visitas e instalación (M19 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0072 | RF-POR-072; M19 §5.6; PRO-O3-06 | O3 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Coordinar visita: ver franjas disponibles compatibles con servicio, domicilio y requisitos (M10) y reservar sin duplicar recursos. | Dos socios que eligen el último turno: uno confirma, el otro recibe "La franja ya no está disponible" y nuevas opciones. |
| CP-POR-0073 | RF-POR-073; M19 §5.6; PRO-O3-06 | O3 | Estándar | regla | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Reprogramar y cancelar la visita según reglas (anticipación mínima, cantidad de reprogramaciones). | Fuera del plazo permitido se ofrece contactar a la cooperativa. |
| CP-POR-0074 | RF-POR-074; M19 §5.6; PRO-O3-06 | O3 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Recordatorios de visita (push/correo/WhatsApp según preferencias). | Se envía recordatorio 24 h antes. |
| CP-POR-0075 | RF-POR-075; M19 §5.6; PRO-O3-06 | O3 | Estándar | regla | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | "El instalador está en camino" con hora estimada; ubicación en mapa solo si el tenant lo habilita. | Cuando M10 emite `tec.visit.statusChanged` con `status = enRoute` el socio recibe aviso y ve la hora estimada. |
| CP-POR-0076 | RF-POR-076; M19 §5.6; PRO-O3-06 | O3 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Revisar el resumen de la instalación (tareas, equipo en comodato con número de serie), firmar conformidad en pantalla y responder la encuesta de satisfacción. | La conformidad firmada queda en el expediente; la encuesta se ofrece sin bloquear. |
| CP-POR-0077 | RF-POR-077; M19 §5.6; PRO-O3-06 | O3 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Ver el resultado de la visita (realizada, fallida, sin acceso, reprogramada) y la próxima acción. | Una visita "sin acceso" ofrece reprogramar y no activa el servicio. |
### 1.7 Facturas y documentos (M19 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0078 | RF-POR-078; M19 §5.7; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | "Mis facturas" por cuenta y servicio con filtros (estado, servicio, período), opción "solo adeudadas" y agrupación por vencimiento configurables. | Con 913 activo, el filtro inicial es "Adeudadas". |
| CP-POR-0079 | RF-POR-079; M19 §5.7; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con FAC-DEMO-002: Comprobante agrupado Agua + Internet ARS 31.500 (Agua 13.500, Internet 18.000) | Detalle de factura separada o comprobante agrupado con **apertura por servicio**: renglones, subtotal, saldo y pagos aplicados por servicio. | En un comprobante con Agua e Internet se ve cuánto corresponde y cuánto se pagó de cada uno. |
| CP-POR-0080 | RF-POR-080; M19 §5.7; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Explicación comprensible de importes: qué es cada concepto, tributos discriminados, prorrateos, bonificaciones, intereses y su base. | Tocando un concepto se abre su explicación con la clave `dict:` del concepto. |
| CP-POR-0081 | RF-POR-081; M19 §5.7; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con PUB-BAJA-001: Recepción pública de baja de Internet con código `BJ-26-000123` (identificada) | Descarga del PDF (URL firmada de corta vida) con CAE, QR fiscal y código de barras. | El enlace caduca a los 5 minutos y no funciona en otra sesión. |
| CP-POR-0082 | RF-POR-082; M19 §5.7; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Si el tenant agrupa, mostrar el resumen de cuenta corriente sin perder el detalle por factura y servicio. | El resumen lista facturas con su servicio y saldo. |
| CP-POR-0083 | RF-POR-083; M19 §5.7; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Movimientos de cuenta corriente (débitos, créditos, pagos, notas de crédito, saldo a favor). | El saldo mostrado coincide con M07 a la fecha. |
| CP-POR-0084 | RF-POR-084; M19 §5.7; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con BAN-001: Banner "Tenés facturas vencidas" para rol `socioMoroso` | Textos configurables de observación en facturas y de vista previa de facturas seleccionadas. | Se editan como claves `dict:por.facturas.observacion` y `dict:por.facturas.vistaPrevia`. |
| CP-POR-0085 | RF-POR-085; M19 §5.7; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Visibilidad: comprobantes desde la fecha de corte configurada, tipos visibles, ocultar PDF de comprobantes bloqueados, historial de N meses. | Un comprobante de tipo no visible no aparece; uno bloqueado aparece sin PDF y con "Consultá en la cooperativa". |
| CP-POR-0086 | RF-POR-086; M19 §5.7; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Adhesión y baja de factura digital por correo y/o WhatsApp con medio verificado. | Con 911 = "mail y teléfono" se exigen ambos verificados. |
| CP-POR-0087 | RF-POR-087; M19 §5.7; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Constancias descargables: libre deuda, constancia de alta, constancia de baja, constancia de trámite, certificado de servicio. | El libre deuda solo se emite si M07 confirma saldo vencido cero. |
| CP-POR-0088 | RF-POR-088; M19 §5.7; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Consultar acuerdos de pago y cuotas (M08) con estado de cada cuota. | La cuota vencida se destaca y permite pagarla. |
### 1.8 Pagos (M19 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0089 | RF-POR-089; M19 §5.8; PRO-O5-13 | O5 | Estándar | integración | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Pagar una o varias facturas (carro) creando un checkout en M07 con `Idempotency-Key`. | Repetir el envío con la misma clave devuelve el mismo checkout. |
| CP-POR-0090 | RF-POR-090; M19 §5.8; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Cupón único: generar un documento de pago con varias facturas y vencimiento propio (hoy + N días); opción de incluir siempre todas las facturas del cupón. | Con 2585 = 3, el cupón generado hoy vence en 3 días. |
| CP-POR-0091 | RF-POR-091; M19 §5.8; PRO-O5-13 | O5 | Estándar | integración | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Medios según pasarelas habilitadas: tarjeta, QR, billetera, transferencia, efectivo con cupón PDF con código de barras. | Con 21 activo y sin entidad por defecto, se ofrece "Descargar cupón para pagar en efectivo". |
| CP-POR-0092 | RF-POR-092; M19 §5.8; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Validar importe mínimo y no permitir pagar facturas bloqueadas ni cuentas bloqueadas para la web, explicando el motivo y el canal alternativo. | Un total menor al mínimo muestra "El importe mínimo es ARS X". |
| CP-POR-0093 | RF-POR-093; M19 §5.8; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con FAC-DEMO-001: Factura de Internet período 11/2026, ARS 18.000, vence 10/12/2026 | Mostrar el recargo por mora calculado al día (M08) o diferido al próximo período según política. | Con 12 activo el recargo se muestra "Se incluirá en tu próxima factura". |
| CP-POR-0094 | RF-POR-094; M19 §5.8; PRO-O5-13 | O5 | Estándar | integración | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Estados visibles del pago: generado, pendiente de confirmación, confirmado, imputado, comprobante enviado, rechazado; el retorno de la pasarela nunca confirma por sí solo. | Si el socio vuelve de la pasarela antes del webhook, ve "Pendiente de confirmación". |
| CP-POR-0095 | RF-POR-095; M19 §5.8; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con BAN-001: Banner "Tenés facturas vencidas" para rol `socioMoroso` | Recibo descargable y enviado por correo tras la imputación, con las facturas de intereses generadas. | El recibo lista facturas pagadas e intereses facturados. |
| CP-POR-0096 | RF-POR-096; M19 §5.8; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Historial de pagos con canal, medio, estado y comprobante. | Se listan pagos de todos los canales (caja, débito, portal). |
| CP-POR-0097 | RF-POR-097; M19 §5.8; PRO-O5-13 | O5 | Estándar | seguridad | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Adhesión y baja de débito automático por tarjeta o CBU con tokenización del proveedor y constancia de alta/baja. | El portal nunca recibe el número completo de tarjeta; la constancia se descarga. |
| CP-POR-0098 | RF-POR-098; M19 §5.8; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con USR-SUSP: suspendido@example.com `titular` de SUM-EN-011 suspendido por mora | Pago de facturas adheridas a débito: no permitir, permitir siempre o solo con recargo de mora. | Con "solo con recargo", una factura adherida sin recargo no es seleccionable. |
| CP-POR-0099 | RF-POR-099; M19 §5.8; PRO-O6-08 | O6 | Estándar | regla | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Control de deuda vencida en la web: aviso y regla configurable para nuevas contrataciones, sin bloquear pago, reclamo ni baja. | Con 37 activo y deuda vencida, "Contratar" muestra el aviso y la política elegida. |
| CP-POR-0100 | RF-POR-100; M19 §5.8; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000 | Pago por representación o pagador eventual; un excedente no se aplica a la deuda de otro titular. | ESC-01: A debe ARS 13.000, paga ARS 15.000; se imputan 13.000 a A y 2.000 quedan según política; la deuda de B no cambia. |
| CP-POR-0101 | RF-POR-101; M19 §5.8; PRO-O5-13 | O5 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Saldo a favor visible; "pago a cuenta" solo si la política de M07 lo habilita. | Con la política apagada no se ofrece importe libre. |
| CP-POR-0102 | RF-POR-102; M19 §5.8; PRO-O8-13 | O8 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Pago de resúmenes de terceros (tarjeta regional u otros convenios por cuenta de terceros). | Deshabilitado por defecto; habilitado, genera checkout de tipo terceros en M07. |
### 1.9 Consumos, autolectura y prepaga (M19 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0103 | RF-POR-103; M19 §5.9; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con FAC-DEMO-001: Factura de Internet período 11/2026, ARS 18.000, vence 10/12/2026 | Historial y gráfico de consumos por servicio medido (12 a 24 períodos), comparación con período anterior y mismo mes del año previo, promedio diario, tabla accesible equivalente al gráfico. | El gráfico tiene tabla alternativa navegable por teclado. |
| CP-POR-0104 | RF-POR-104; M19 §5.9; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | No mostrar consumos para servicios sin fuente de medición. | Internet abono fijo no muestra pestaña de consumos. |
| CP-POR-0105 | RF-POR-105; M19 §5.9; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Deshabilitar la pestaña de consumos por tenant. | Con 31 activo no aparece la pestaña. |
| CP-POR-0106 | RF-POR-106; M19 §5.9; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Botón "Mi Medidor" hacia la consulta del proveedor de telemedición cuando el suministro está integrado. | Si el servicio no está en el proveedor, el botón no aparece. |
| CP-POR-0107 | RF-POR-107; M19 §5.9; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Autolectura con foto: el socio fotografía el medidor, informa el estado (o acepta la propuesta de OCR) dentro de la ventana de lectura; M03 la valida como cualquier lectura capturada. | Una autolectura fuera de rango queda "En revisión" y se explica el resultado. |
| CP-POR-0108 | RF-POR-108; M19 §5.9; PRO-O7-05 | O7 | Estándar | seguridad | TEN-001 con PRE-DEMO-001: Servicio de energía prepaga con crédito ARS 2.300 | Recarga prepaga: elegir servicio prepago, importe (con mínimo y múltiplos), ver capital a acreditar, recargo, bonificación, retención por deuda y energía equivalente; pagar y recibir crédito/token. | Con importe ARS 5.000 y recargo ARS 500, se informa capital ARS 4.500 antes de pagar. |
| CP-POR-0175 | RF-POR-175; M19 §5.9; PRO-O10-09 | O10 | Estándar | seguridad | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | **Detalle de llamadas** por período de una línea telefónica (PAN-POR-103): fecha y hora, número destino enmascarado según política, tipo (local, larga distancia, celular, CPP, internacional), duración e importe tasado; totales por tipo… | Para la línea de TEL-BAS del período 11/2026 la suma de importes coincide con el renglón de llamadas de la factura; un usuario sin acceso a la cuenta recibe 403. |
### 1.10 Gestiones (reclamos, consultas, trámites) (M19 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0109 | RF-POR-109; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Nueva gestión (reclamo, consulta, trámite) con tipología por servicio (M09), descripción, fotos y adjuntos, ubicación opcional (con alternativa textual) y contrato afectado. | Un reclamo "Sin servicio de Internet" con foto crea un caso con número. |
| CP-POR-0110 | RF-POR-110; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Seguimiento de la gestión: número, estado, línea de tiempo, plazo comprometido y responsable visible (área). | El estado cambia al recibir `crm.case.statusChanged`. |
| CP-POR-0111 | RF-POR-111; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Conversación con la cooperativa dentro del caso (chat) y asistente/bot (M09) con traspaso a humano. | Un mensaje del operador llega como aviso y se responde en el caso. |
| CP-POR-0112 | RF-POR-112; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con REACT-DEMO-GRATIS: Reactivación dentro del plazo, ARS 0 | Conformidad al cierre, reapertura dentro del plazo configurado y encuesta de satisfacción. | Rechazar la solución reabre el caso dentro de los 7 días configurados. |
| CP-POR-0113 | RF-POR-113; M19 §5.10; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Un reclamo técnico genera orden de trabajo automáticamente si el tenant lo configura. | Con 58 activo, el reclamo de falla crea la OT en M10 y el socio la ve en la línea de tiempo. |
| CP-POR-0114 | RF-POR-114; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con NOT-002: Aviso interno "Capacitación interna" (solo empleados) | Ocultar observaciones internas de las órdenes y casos. | Ninguna nota marcada interna llega al portal, con independencia de 73 (73 controla además las observaciones técnicas de la OT). |
| CP-POR-0115 | RF-POR-115; M19 §5.10; PRO-O3-12 | O3 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Mostrar al socio sus órdenes de trabajo asociadas (estado, fecha, resultado). | La OT de instalación figura en el detalle del trámite. |
| CP-POR-0116 | RF-POR-116; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Avisos al tenant por correo de nuevos reclamos y trámites web, además de la bandeja CRM. | Con casilla configurada, cada caso del portal genera un correo al tenant. |
| CP-POR-0117 | RF-POR-117; M19 §5.10; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Gestión sin conexión: borrador local con fotos en IndexedDB y envío al recuperar señal con `clientMutationId`. | Un reclamo creado sin señal se envía una sola vez al volver la conexión. |
### 1.11 Turnos de atención presencial (M19 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0118 | RF-POR-118; M19 §5.11; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con KSK-001: Tótem "Sucursal Centro", caja 5, búsqueda por documento, efectivo + QR | Solicitar turno de atención en sucursal por área (fecha y hora, o turno del día) desde el portal. | Con 67 activo se ofrece "Pedir turno"; el número se forma según 3064. |
| CP-POR-0119 | RF-POR-119; M19 §5.11; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Ver número de turno, tiempo estimado de espera y cancelar. | El tiempo estimado se actualiza al refrescar. |
| CP-POR-0120 | RF-POR-120; M19 §5.11; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con KSK-001: Tótem "Sucursal Centro", caja 5, búsqueda por documento, efectivo + QR | Recordatorio del turno y presentación en sucursal con QR. | El QR se lee en el turnero y pasa el turno a "en espera". |
### 1.12 Comunicaciones y comunidad (M19 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0121 | RF-POR-121; M19 §5.12; PRO-O2-17 | O2 | Estándar | regla | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Bandeja de avisos in-app con tipos (factura emitida, vencimiento, corte programado, deuda, visita, reclamo resuelto, trámite observado, pago confirmado), marcar leído y acceso directo al objeto. | Un aviso "Factura emitida" abre el detalle de la factura. |
| CP-POR-0122 | RF-POR-122; M19 §5.12; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Push web con consentimiento, preferencias por categoría y canal, horario de no molestar (T09). | Desactivar "Promociones" no desactiva "Constancias". |
| CP-POR-0123 | RF-POR-123; M19 §5.12; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Diferenciar avisos comerciales, operativos y constancias reguladas; las constancias guardan evidencia de entrega y un fallo genera acción. | Una constancia de baja rebotada genera tarea al operador y queda visible en el portal. |
| CP-POR-0124 | RF-POR-124; M19 §5.12; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Encuestas en el portal (T09) con banner de pendientes que nunca bloquea operaciones esenciales. | Con encuesta pendiente el socio puede pagar y pedir la baja. |
| CP-POR-0125 | RF-POR-125; M19 §5.12; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con NOT-001: Noticia pública "Mantenimiento programado de agua" (landing + muro de socios) | Muro de socios (T09): publicaciones editoriales por audiencia; reacciones y comentarios con moderación cuando el tenant y la publicación lo habilitan. | Con comentarios deshabilitados no se muestra el campo de comentario. |
| CP-POR-0126 | RF-POR-126; M19 §5.12; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Novedades y boletines (T09). | Un boletín publicado para socios de Internet aparece solo a esos socios. |
| CP-POR-0127 | RF-POR-127; M19 §5.12; PRO-O7-11 | O7 | Estándar | migración | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Notificaciones por cuenta con vigencia (por defecto 1 mes) migradas desde ProCoop. | Las notificaciones vencidas no se muestran. |
| CP-POR-0128 | RF-POR-128; M19 §5.12; PRO-O5-13 | O5 | Estándar | regla | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Mensaje automático (SMS/WhatsApp) al registrar un pago o una venta del portal. | Con 53 = WhatsApp se envía la plantilla de pago registrado. |
### 1.13 Portal del empleado (M19 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0129 | RF-POR-129; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Espacio empleado en la misma PWA, con marca de empleados (T03), menú y almacén de datos separados del espacio socio. | Un socio-empleado no ve recibos en el espacio socio ni facturas en el espacio empleado. |
| CP-POR-0130 | RF-POR-130; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Recibos de sueldo: lista, detalle, descarga PDF y firma de conformidad; no descargar antes de firmar; no acceder al mes actual sin firmar el anterior, según tenant. | Con 3166 activo y el recibo anterior sin firmar, el actual muestra "Firmá primero el recibo de septiembre". |
| CP-POR-0131 | RF-POR-131; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Vacaciones: saldo, solicitud con fechas, estado del workflow (M16). | La solicitud aparece en la bandeja del jefe. |
| CP-POR-0132 | RF-POR-132; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Licencias: solicitud por tipo con certificado adjunto, estado. | Una licencia médica sin certificado queda "Falta certificado". |
| CP-POR-0133 | RF-POR-133; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Mis datos de legajo en consulta y solicitud de actualización (domicilio, contacto, cuenta sueldo, familiares). | La actualización crea una solicitud para RR. HH., no modifica el legajo directamente. |
| CP-POR-0134 | RF-POR-134; M19 §5.13; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Muro y avisos internos de empleados (T09, audiencia interna). | Una publicación interna nunca se ve en el espacio socio ni en la landing. |
| CP-POR-0135 | RF-POR-135; M19 §5.13; PRO-O9-06 | O9 | Estándar | seguridad | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Empleados que no son usuarios del sistema acceden solo al portal del empleado con el perfil configurado. | Ese perfil no tiene ninguna capability de admin. |
| CP-POR-0136 | RF-POR-136; M19 §5.13; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Reautenticación o segundo factor para ver recibos y legajo. | Pasados 15 minutos desde el último factor se vuelve a pedir. |
### 1.14 Accesibilidad, UX y tolerancia a errores (M19 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0137 | RF-POR-137; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Objetivo WCAG 2.2 nivel AA verificado en landing, PWA socio y empleado; declaración de accesibilidad publicada sin afirmar conformidad no verificada. | Auditoría automática (axe) sin errores críticos y prueba manual de recorridos esenciales con teclado y lector de pantalla. |
| CP-POR-0138 | RF-POR-138; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo | Navegación completa por teclado, foco visible no oculto (2.4.11), orden lógico, etiquetas y nombres accesibles, objetivos táctiles de al menos 24×24 px (2.5.8). | Los recorridos contratar, pagar, reclamar y baja se completan solo con teclado. |
| CP-POR-0139 | RF-POR-139; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-002: "Cooperativa Ejemplo B", slug `coop-ejemplo-b` (R14; antes `ejemplo-b`), colores #6A1B9A / #F9A825 (contraste ajustado por RN-POR-063), servicios… | Validación de contraste de los colores de marca del tenant con ajuste automático del texto y CTA cuando no alcanzan 4.5:1. | Un color de marca amarillo claro genera texto oscuro en el botón. |
| CP-POR-0140 | RF-POR-140; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita" | Alternativa a mapa y a gestos de arrastre (2.5.7) en toda funcionalidad. | La coordinación de visita y la ubicación del reclamo funcionan sin mapa. |
| CP-POR-0141 | RF-POR-141; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Tolerancia a errores: borradores, recuperación tras expiración de sesión sin perder datos, no repetir información ya aportada (3.3.7). | Al expirar la sesión en el paso 4, el reingreso vuelve al paso 4 con los datos. |
| CP-POR-0142 | RF-POR-142; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con INT-100: Plan "Fibra 100" del seed único de M02 §18 (HUE-SRV-05): 100/50 Mbps, abono ficticio ARS 15.000 con promoción PROMO-INT-50x3 (50 % sobre el abono por… | Mensajes de error claros, junto al campo y en un resumen con enlaces, indicando qué falta. | Nunca se usa `alert()`; el resumen enfoca el primer error. |
| CP-POR-0143 | RF-POR-143; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Lenguaje claro y diccionario del tenant (`dict:`) en todas las etiquetas. | No hay textos fijos en componentes (lint de claves). |
| CP-POR-0144 | RF-POR-144; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Patrones CNX: 3 skeleton cards en cargas, estados vacíos con acción, pull-to-refresh, banner único de pendientes sin conexión. | Una lista vacía muestra ilustración y acción sugerida. |
| CP-POR-0145 | RF-POR-145; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | PWA instalable con manifest dinámico, splash, ícono y `theme-color` por tenant; pasos de instalación para iOS. | Instalar desde TEN-001 crea el ícono "Cooperativa Ejemplo A". |
| CP-POR-0146 | RF-POR-146; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Respeto de `prefers-reduced-motion`, zoom al 200 % y reflujo a 320 px sin pérdida de contenido. | A 320 px no hay desplazamiento horizontal salvo tablas con alternativa. |
| CP-POR-0147 | RF-POR-147; M19 §5.14; PRO-O2-17 | O2 | Estándar | seguridad | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Autenticación accesible (3.3.8): permitir pegar, gestores de contraseñas y autocompletar OTP. | El campo OTP acepta `autocomplete="one-time-code"`. |
| CP-POR-0148 | RF-POR-148; M19 §5.14; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Ayuda contextual por pantalla y acceso a soporte de la cooperativa (chat CRM, teléfono, sucursales). | Cada pantalla tiene "¿Necesitás ayuda?" con contenido del tenant. |
### 1.15 Administración del portal (M19 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0149 | RF-POR-149; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Configuración del portal por tenant (parámetros del §14) con vigencia y auditoría (T04). | Cambiar 913 se refleja en el portal en la siguiente carga. |
| CP-POR-0150 | RF-POR-150; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja… | Editor de la landing por bloques con previsualización escritorio/celular y circuito de publicación. | El editor no permite HTML libre ni scripts. |
| CP-POR-0151 | RF-POR-151; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Constructor de formularios por servicio: campos, tipos, máscaras, obligatoriedad, visibilidad condicional, orden, ayuda, dato requerido (persona, cuenta, servicio), T&C, repetición permitida, PDF asociado, versión. | Publicar una nueva versión no altera las presentaciones hechas con la anterior. |
| CP-POR-0152 | RF-POR-152; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Campos que completa el operador (no visibles al socio) en la presentación. | El operador ve "Datos del formulario" y "Datos que registra el usuario" separados. |
| CP-POR-0153 | RF-POR-153; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Acción de ejecución tipada por formulario (comando del módulo dueño) con resultado (mensaje, aceptado, id creado). | No existe ejecución de código o SQL configurable; solo comandos registrados. |
| CP-POR-0154 | RF-POR-154; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con FRM-CAMBIO-TIT: Cambio de titularidad v1 con evidencia obligatoria | Bandeja de vinculaciones asistidas y pendientes de evidencia, con aprobación/rechazo motivado. | Rechazar notifica al solicitante con motivo. |
| CP-POR-0155 | RF-POR-155; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Accesos al portal de una cuenta: listar usuarios con acceso, rol, alcance, vigencia, último uso; revocar. | Revocar desde admin corta el acceso en la siguiente solicitud. |
| CP-POR-0156 | RF-POR-156; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con PUB-BAJA-001: Recepción pública de baja de Internet con código `BJ-26-000123` (identificada) | Bandeja de recepciones públicas (bajas, contactos) con plazo de código y constancia, identificación y derivación al CRM. | Una baja pública sin código emitido a las 20 h se resalta en rojo. |
| CP-POR-0157 | RF-POR-157; M19 §5.15; PRO-O6-08 | O6 | Estándar | migración | TEN-001 con USR-MIGR: migrado@example.com, importado de CoopOnline con 2 vínculos `invitado` hasta activar | Asistente de migración de usuarios de CoopOnline (cargar volcado, validar, ver conflictos, importar, invitar). | El informe de conciliación cuadra usuarios y vínculos del volcado. |
| CP-POR-0158 | RF-POR-158; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Configuración de banners por rol y segmento. | Vista previa del banner por rol. |
| CP-POR-0159 | RF-POR-159; M19 §5.15; PRO-O11-02 | O11 | Estándar | regla | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Métricas del portal (§15) con exportación. | Los indicadores se recalculan diariamente. |
| CP-POR-0160 | RF-POR-160; M19 §5.15; PRO-O2-17 | O2 | Estándar | funcional | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | "Ver portal como este socio" en solo lectura, auditado, desde la ficha de la cuenta (reemplaza el ingreso directo de escritorio). | La sesión de vista no permite pagar ni enviar; queda en auditoría con motivo. |
| CP-POR-0161 | RF-POR-161; M19 §5.15; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Alta y configuración de tótems de autogestión. | El tótem queda asociado a sucursal y caja. |
### 1.16 Tótem de autogestión presencial (M19 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0162 | RF-POR-162; M19 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Modo tótem: pantalla táctil de inicio con mosaicos (Pagar facturas, Recargar prepaga) y regreso automático al inicio por inactividad. | Tras 60 s sin uso vuelve al inicio y borra los datos de la sesión. |
| CP-POR-0163 | RF-POR-163; M19 §5.16; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Identificación del socio por número de socio, cuenta, documento o código QR de la factura, con opción por defecto configurable. | Con 2790 = "Código QR", la pantalla abre la cámara/lector. |
| CP-POR-0164 | RF-POR-164; M19 §5.16; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000 | Ver deuda, seleccionar comprobantes y cuotas, ver total con recargos y percepciones. | El total coincide con el cálculo de M07/M06. |
| CP-POR-0165 | RF-POR-165; M19 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01) | Pagar con tarjeta (lector), QR o efectivo con lector de billetes vía agente local; anticipo con el excedente de efectivo si se configura. | Un pago en efectivo con billetes por ARS 10.000 sobre deuda de ARS 9.500 registra ARS 500 como anticipo si la política lo permite. |
| CP-POR-0166 | RF-POR-166; M19 §5.16; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con PRE-DEMO-001: Servicio de energía prepaga con crédito ARS 2.300 | Recarga prepaga en el tótem. | Mismo cálculo que RF-POR-108. |
| CP-POR-0167 | RF-POR-167; M19 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet… | Comprobante impreso o enviado por correo a elección. | Elegir correo valida el formato antes de enviar. |
| CP-POR-0168 | RF-POR-168; M19 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con KSK-001: Tótem "Sucursal Centro", caja 5, búsqueda por documento, efectivo + QR | Cierre administrativo del tótem con clave de dispositivo y caja asociada. | Sin clave no se sale del modo tótem. |
### 1.17 Migración desde CoopOnline (M19 §5.17)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-POR-0169 | RF-POR-169; M19 §5.17; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest` | Importar usuarios del portal (correo, celular, nombre, apellido, fecha de alta y validación) y sus cuentas vinculadas. | Cada `WS_USERS_ACCOUNTS` válido genera un `portalAccountAccess` de rol `titular` o `autorizadoConsulta` según coincidencia de documento. |
| CP-POR-0170 | RF-POR-170; M19 §5.17; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite | Importar adhesiones a factura digital y débito automático vigentes. | El canal de entrega de M05 queda igual al de CoopOnline para cada cuenta migrada. |
| CP-POR-0171 | RF-POR-171; M19 §5.17; PRO-O11-06 | O11 | Estándar | funcional | TEN-001 con USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado | Importar trámites web del último año con su estado y adjuntos como histórico consultable. | El socio ve sus trámites anteriores en "Mis gestiones" con etiqueta "Histórico". |
| CP-POR-0172 | RF-POR-172; M19 §5.17; PRO-O11-06 | O11 | Estándar | funcional | TEN-001 con LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18 | Importar formularios de trámite (`REQUISITOS`/`REQUISITOS_ITEMS`) como borradores de formularios para revisión. | Cada requisito importado queda en estado borrador con mapeo de tipos. |
| CP-POR-0173 | RF-POR-173; M19 §5.17; PRO-O6-08 | O6 | Estándar | funcional | TEN-001 con USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100 | Invitar a los usuarios migrados por correo/celular a activar su acceso, con plantilla del tenant. | El informe muestra enviados, entregados, activados. |

## 3. Casos por caso de uso (CU)

**CP-POR-8001 — CU-25. Consultar y pagar una factura**

- Cubre: CU-25; RF-POR-033; RN-POR-003; M19 §16.1
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: FAC-DEMO-001: Factura de Internet período 11/2026, ARS 18.000, vence 10/12/2026
- Dado actor: Asociada titular (Ana) con acceso validado a SUM-AG-001, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) Ingresa y selecciona la cuenta. 2) Consulta FAC-DEMO-001 y, con saldo, inicia el pago por el canal habilitado. 3) Ve el resultado confirmado y descarga el comprobante o registra una consulta.
- Entonces Gestión con acceso restringido a cuentas autorizadas y estado de pago consistente con el backend. Excepción: si intenta vincular una cuenta ajena sin verificación suficiente se deniega y se ofrece el circuito de acreditación.

**CP-POR-8002 — CU-MAR-01. Alta de tenant con marca y landing (definición dueña: T03 «CU-MAR-01 — Personalizar la marca de la cooperativa»; aquí se cita el caso…**

- Cubre: CU-MAR-01; RF-POR-001; RN-POR-011; M19 §16.1
- Ola: O2 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M19 §18.
- Datos de prueba: TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet, Sepelio Piloto Internet; CU-MAR-01, CU-AUT-01
- Dado actor: Administrador de plataforma y administrador de la cooperativa, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) Alta de TEN-001. 2) La cooperativa dispone de admin y configuración de landing. 3) Carga marca, colores, logos (desktop, móvil, empleados, socios) y splash (T03). 4) Configura la landing (bloques, servicios, acceso a la app). 5) Revisa y publica. 6) Un socio consulta Internet e ingresa a la app. 7) En su sesión consulta servicios y solicita la activación de Internet. 8) Si solicita desactivar, se aplica el circuito y se ve el estado real.
- Entonces Administración y landing con marca; el socio gestiona servicios sin confundir solicitud con ejecución. Controles: no modificar marca de otro tenant; no divulgar cuentas desde la landing; no gestionar contratos ajenos.

**CP-POR-8003 — CU-NOT-01. Publicar noticias por canal**

- Cubre: CU-NOT-01; RF-POR-007, RF-POR-125, RF-POR-134; RN-POR-051; M19 §16.1
- Ola: O2 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M19 §18.
- Datos de prueba: NOT-001: Noticia pública "Mantenimiento programado de agua" (landing + muro de socios)
- Dado actor: Empleado con rol de publicación, autenticado en TEN-001 con las capabilities de su rol
- Cuando Crea "Mantenimiento programado de agua" para landing y muro de socios; crea "Capacitación interna" solo para empleados (T09).
- Entonces La primera aparece en landing y muro de socios; la segunda solo en el espacio empleado. Excepción: sin permiso de publicación, solo lectura.

**CP-POR-8004 — CU-AUT-01. Ciclo completo de Internet**

- Cubre: CU-AUT-01; RF-POR-056; RN-POR-021; M19 §16.1
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: BAJA-DEMO: Regla de baja de Internet: sin cargo, efectiva a fin de período, retiro de equipo
- Dado actor: Socia ASO-001 (Ana), autenticado en TEN-001 con las capabilities de su rol
- Cuando Consulta INT-100 en la landing → contrata en la app → caso y requisitos → elige franja VIS-DEMO-001 (10-11-2026, 09:00–11:00) → OT-INT-DEMO-001 → instalación y activación con fecha efectiva → consulta factura separada de Internet → paga → reclamo con foto por chat → puede suspender, reactivar o dar de baja.
- Entonces Cada gestión conserva resultado, fechas y relación con facturación. Controles: visita fallida no activa; Internet abono fijo no muestra consumos inventados.

**CP-POR-8005 — CU-CIC-01. Suspensión temporal y reactivación (definición dueña: M08 «CU-CIC-01 — Suspensión temporal y reactivación de Internet», PA-MOR-21; aquí…**

- Cubre: CU-CIC-01; RF-POR-066; RN-POR-019; M19 §16.1
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: REACT-DEMO-GRATIS: Reactivación dentro del plazo, ARS 0
- Dado actor: Ana, autenticado en TEN-001 con las capabilities de su rol
- Cuando Solicita suspender Internet desde una fecha; ve condiciones (SUS-DEMO-GRATIS, ARS 0); el tenant ejecuta; solicita reactivar; el sistema muestra si es gratuita (REACT-DEMO-GRATIS) o con cargo válido.
- Entonces Vuelve a "Activo" solo con confirmación técnica; el pago de un cargo no anuncia "reactivado".

**CP-POR-8006 — CU-REG-01. Registro y contratación por persona nueva**

- Cubre: CU-REG-01; RF-POR-022; RN-POR-001; M19 §16.1
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite
- Dado actor: Persona nueva (USR-NUEVO-B) en TEN-002, autenticado en TEN-001 con las capabilities de su rol
- Cuando Entra a la landing de B, se registra, elige Gas, completa solicitud y requisitos; si necesita asociarse, se informa y registra.
- Entonces Usuario registrado con solicitud en trámite antes de tener suministro; la cuenta se asigna cuando corresponda.

**CP-POR-8007 — CU-POR-01. Vincular cuenta existente con código de socio y clave**

- Cubre: CU-POR-01; RF-POR-033, RF-POR-039, RF-POR-040; RN-POR-003; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-NUEVO-B: nuevo-b@example.com, registrado en TEN-002 sin cuenta Ninguno; solicitud de Gas en trámite
- Dado Tiene factura con código y clave; actor: Socio registrado, autenticado en TEN-001 con las capabilities de su rol
- Cuando Mis cuentas → FAB → método "Código de socio y clave" → datos → acceso `titular` activo → aviso al titular
- Entonces Se completa «Vincular cuenta existente con código de socio y clave» sin errores, con los efectos que exigen RF-POR-033, RF-POR-039, RF-POR-040, y quedan auditoría y evento del cambio. Alternativo o excepción: Datos erróneos: mensaje genérico; 6.º intento: bloqueo 15 min; documento no coincide: `autorizadoConsulta` pendiente de confirmación

**CP-POR-8008 — CU-POR-02. Vinculación asistida en sucursal**

- Cubre: CU-POR-02; RF-POR-037, RF-POR-154; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado
- Dado Socio identificado presencialmente; actor: Operador + socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Operador emite código (PAN-POR-89) → socio lo canjea en la app → acceso activo
- Entonces Se completa «Vinculación asistida en sucursal» sin errores, con los efectos que exigen RF-POR-037, RF-POR-154, y quedan auditoría y evento del cambio. Alternativo o excepción: Código vencido (72 h) o usado por otro DNI: rechazo

**CP-POR-8009 — CU-POR-03. Activar acceso de usuario migrado de CoopOnline**

- Cubre: CU-POR-03; RF-POR-031, RF-POR-169; M19 §16.2
- Ola: O6 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M19 §18.
- Datos de prueba: USR-MIGR: migrado@example.com, importado de CoopOnline con 2 vínculos `invitado` hasta activar
- Dado Importado y invitado; actor: Usuario de CoopOnline, autenticado en TEN-001 con las capabilities de su rol
- Cuando Abre invitación o `/activar` → OTP → contraseña → ve sus cuentas y adhesiones
- Entonces Se completa «Activar acceso de usuario migrado de CoopOnline» sin errores, con los efectos que exigen RF-POR-031, RF-POR-169, y quedan auditoría y evento del cambio. Alternativo o excepción: Correo compartido por varias personas: conflicto, vinculación asistida

**CP-POR-8010 — CU-POR-04. Baja pública de Internet sin registro**

- Cubre: CU-POR-04; RF-POR-009; RN-POR-013; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: PUB-BAJA-001: Recepción pública de baja de Internet con código `BJ-26-000123` (identificada)
- Dado Servicio con botón de baja; actor: Visitante titular, autenticado en TEN-001 con las capabilities de su rol
- Cuando Botón de baja → servicio → identificación → medio → código en pantalla y por correo → constancia ≤ 72 h → seguimiento por código
- Entonces Se completa «Baja pública de Internet sin registro» sin errores, con los efectos que exigen RF-POR-009, y quedan auditoría y evento del cambio. Alternativo o excepción: No identificable automáticamente: operador identifica; envío fallido: tarea y canal alternativo

**CP-POR-8011 — CU-POR-05. Pagar varias facturas con cupón único en efectivo**

- Cubre: CU-POR-05; RF-POR-089; RN-POR-026; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000
- Dado Pagos habilitados, cupón PDF habilitado; actor: Socio titular, autenticado en TEN-001 con las capabilities de su rol
- Cuando Facturas → seleccionar 3 → Pagar → "Cupón para efectivo" → PDF con código de barras, vence hoy + 3
- Entonces Se completa «Pagar varias facturas con cupón único en efectivo» sin errores, con los efectos que exigen RF-POR-089, y quedan auditoría y evento del cambio. Alternativo o excepción: Deuda cambió: aviso y rehacer; factura bloqueada: no seleccionable

**CP-POR-8012 — CU-POR-06. Pago con tarjeta y confirmación diferida**

- Cubre: CU-POR-06; RF-POR-094, RF-POR-095; RN-POR-024; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100
- Dado Pasarela habilitada; actor: Socio titular, autenticado en TEN-001 con las capabilities de su rol
- Cuando Checkout → pasarela → retorno "Pendiente de confirmación" → webhook → "Confirmado" → "Imputado" → recibo por correo
- Entonces Se completa «Pago con tarjeta y confirmación diferida» sin errores, con los efectos que exigen RF-POR-094, RF-POR-095, y quedan auditoría y evento del cambio. Alternativo o excepción: Rechazo: motivo y reintento con nueva clave; incierto: "En verificación" sin permitir pagar dos veces

**CP-POR-8013 — CU-POR-07. Hermano paga la factura del otro (ESC-01)**

- Cubre: CU-POR-07; RF-POR-045, RF-POR-100; RN-POR-030; relacionados: ESC-01; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01)
- Dado actor: Hermano A con acceso `pagar` a la cuenta de B o pagador eventual, autenticado en TEN-001 con las capabilities de su rol
- Cuando Paga con código la factura de B por ARS 13.000
- Entonces Se completa «Hermano paga la factura del otro (ESC-01)» sin errores, con los efectos que exigen RF-POR-045, RF-POR-100, y quedan auditoría y evento del cambio. Alternativo o excepción: Si paga de más, el excedente no cancela otras deudas ajenas

**CP-POR-8014 — CU-POR-08. Autorizar a un familiar a consultar y pagar**

- Cubre: CU-POR-08; RF-POR-043; RN-POR-007; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01)
- Dado Acceso titular; actor: Titular, autenticado en TEN-001 con las capabilities de su rol
- Cuando Representaciones → Autorizar → contacto, cuenta, acciones `consultar` y `pagar`, vigencia 6 meses → invitado acepta
- Entonces Se completa «Autorizar a un familiar a consultar y pagar» sin errores, con los efectos que exigen RF-POR-043, y quedan auditoría y evento del cambio. Alternativo o excepción: Titular revoca: siguiente solicitud del invitado → 403

**CP-POR-8015 — CU-POR-09. Coordinar y reprogramar visita de instalación**

- Cubre: CU-POR-09; RF-POR-072; RN-POR-021; M19 §16.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: CASE-INT-001: Solicitud de alta Internet de Ana, estado "Aprobado — coordinar visita"
- Dado Caso aprobado; actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Coordinar visita → franja → confirmar → recordatorio → reprogramar dentro del plazo → técnico en camino → conformidad firmada → encuesta
- Entonces Se completa «Coordinar y reprogramar visita de instalación» sin errores, con los efectos que exigen RF-POR-072, y quedan auditoría y evento del cambio. Alternativo o excepción: Última franja tomada: 409 y nuevas opciones; visita sin acceso: reprogramar, servicio sigue pendiente

**CP-POR-8016 — CU-POR-10. Reclamo con foto sin conexión**

- Cubre: CU-POR-10; RF-POR-109, RF-POR-113, RF-POR-117; RN-POR-025; M19 §16.2
- Ola: O3 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: LND-A-v2: Borrador de TEN-001 con banner de campaña "Internet 300 Mb" en revisión CU-POR-18
- Dado actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Nueva gestión sin señal → borrador en cola → al volver señal se envía una vez → número de caso → OT automática (si configurado)
- Entonces Se completa «Reclamo con foto sin conexión» sin errores, con los efectos que exigen RF-POR-109, RF-POR-113, RF-POR-117, y quedan auditoría y evento del cambio. Alternativo o excepción: Reenvío duplicado: misma respuesta por `clientMutationId`

**CP-POR-8017 — CU-POR-11. Autolectura de agua**

- Cubre: CU-POR-11; RF-POR-107; RN-POR-064; M19 §16.2
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet, Sepelio Piloto Internet; CU-MAR-01, CU-AUT-01
- Dado Ventana abierta; actor: Socio con servicio medido, autenticado en TEN-001 con las capabilities de su rol
- Cuando Autolectura → foto → OCR propone 01234 → confirma → M03 valida → "Aceptada"
- Entonces Se completa «Autolectura de agua» sin errores, con los efectos que exigen RF-POR-107, y quedan auditoría y evento del cambio. Alternativo o excepción: Fuera de rango: "En revisión"; ventana cerrada: próxima fecha

**CP-POR-8018 — CU-POR-12. Recarga prepaga**

- Cubre: CU-POR-12; RF-POR-108; RN-POR-033; M19 §16.2
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: PRE-DEMO-001: Servicio de energía prepaga con crédito ARS 2.300
- Dado Prepaga habilitada; actor: Socio con servicio prepago, autenticado en TEN-001 con las capabilities de su rol
- Cuando Prepaga → ARS 5.000 → capital ARS 4.500 (recargo ARS 500) → pagar → crédito acreditado → factura de autogestión
- Entonces Se completa «Recarga prepaga» sin errores, con los efectos que exigen RF-POR-108, y quedan auditoría y evento del cambio. Alternativo o excepción: Solicitud vencida (600 s): nueva cotización

**CP-POR-8019 — CU-POR-13. Adherirse a factura digital y débito automático**

- Cubre: CU-POR-13; RF-POR-086, RF-POR-097; RN-POR-039; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M19 §18.
- Datos de prueba: USR-ANA: ana@example.com, celular verificado ficticio, socia ASO-001 de TEN-001 `titular` de SUM-AG-001 (Agua) y del contrato INT-100
- Dado Correo verificado; actor: Socio titular, autenticado en TEN-001 con las capabilities de su rol
- Cuando Factura digital → correo → confirmado; Débito → componente tokenizado → constancia
- Entonces Se completa «Adherirse a factura digital y débito automático» sin errores, con los efectos que exigen RF-POR-086, RF-POR-097, y quedan auditoría y evento del cambio. Alternativo o excepción: Correo sin verificar: verificar primero

**CP-POR-8020 — CU-POR-14. Presentar DDJJ de artefactos**

- Cubre: CU-POR-14; RF-POR-069, RF-CAT-095; RN-POR-042; M19 §16.2
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: FRM-DDJJ-ART: DDJJ de artefactos v1 (energía): artefactos eléctricos y vehículos eléctricos, plantilla `electricAppliancesAndVehicles` de M02 (HUE-GAS-01)
- Dado Plantilla de DDJJ del servicio en M02 (PRM-CAT-110) y formulario publicado; actor: Socio de gas o de energía (HUE-GAS-01; texto original: "Socio de energía"), autenticado en TEN-001 con las capabilities de su rol
- Cuando DDJJ → grilla según la plantilla del servicio (gas: potencia en kcal/h; energía: artefactos eléctricos y vehículos eléctricos) → presentar → operador acepta en PAN-CAT-25 → artefactos vigentes pasan a histórico
- Entonces Se completa «Presentar DDJJ de artefactos» sin errores, con los efectos que exigen RF-POR-069, RF-CAT-095, y quedan auditoría y evento del cambio. Alternativo o excepción: Servicio sin plantilla de DDJJ: no se ofrece (texto original: "Servicio no energía: no se ofrece"); fila de gas sin potencia: se rechaza en el campo

**CP-POR-8021 — CU-POR-15. Pedir turno de atención presencial**

- Cubre: CU-POR-15; RF-POR-118; RN-POR-073; M19 §16.2
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado
- Dado Turnos habilitados; actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Turnos → sucursal, área, hora → número y tiempo estimado → QR en sucursal
- Entonces Se completa «Pedir turno de atención presencial» sin errores, con los efectos que exigen RF-POR-118, y quedan auditoría y evento del cambio. Alternativo o excepción: Sin disponibilidad: próximo día

**CP-POR-8022 — CU-POR-16. Firmar recibo de sueldo**

- Cubre: CU-POR-16; RF-POR-129, RF-POR-130, RF-POR-136; RN-POR-010; M19 §16.2
- Ola: O9 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O9 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-EMP: empleado@example.com, socio de TEN-001 y empleado Espacio socio + espacio empleado
- Dado Espacio empleado habilitado; actor: Empleado-socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Cambia a "Mi trabajo" → reautenticación → recibo de octubre → firmar con OTP → descargar
- Entonces Se completa «Firmar recibo de sueldo» sin errores, con los efectos que exigen RF-POR-129, RF-POR-130, RF-POR-136, y quedan auditoría y evento del cambio. Alternativo o excepción: Recibo anterior sin firmar con 3166 activo: bloqueo explicado

**CP-POR-8023 — CU-POR-17. Inicio de socio moroso y suspendido**

- Cubre: CU-POR-17; RF-POR-047, RF-POR-049, RF-POR-050; RN-POR-056; M19 §16.2
- Ola: O6 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O6 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-MOROSO: moroso@example.com `titular` de SUM-EN-010 con deuda vencida ARS 48.000
- Dado Deuda vencida / suspensión por mora; actor: Socio, autenticado en TEN-001 con las capabilities de su rol
- Cuando Ingresa → banner crítico → paga → "Pago confirmado — reconexión en trámite" → evento de reconexión → banner desaparece
- Entonces Se completa «Inicio de socio moroso y suspendido» sin errores, con los efectos que exigen RF-POR-047, RF-POR-049, RF-POR-050, y quedan auditoría y evento del cambio. Alternativo o excepción: Puede pedir la baja con deuda

**CP-POR-8024 — CU-POR-18. Publicar nueva versión de landing**

- Cubre: CU-POR-18; RF-POR-002, RF-POR-003, RF-POR-150; RN-POR-067; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja, pie legal PAN-POR-01
- Dado actor: Administrador de contenidos + publicador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Editor → bloques → revisión → aprobar → programar → publicación automática → revertir si hace falta
- Entonces Se completa «Publicar nueva versión de landing» sin errores, con los efectos que exigen RF-POR-002, RF-POR-003, RF-POR-150, y quedan auditoría y evento del cambio. Alternativo o excepción: Quitar botón de baja con Internet ofertado: validación lo impide

**CP-POR-8025 — CU-POR-19. Crear formulario de alta de un servicio**

- Cubre: CU-POR-19; RF-POR-151; RN-POR-046; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: FRM-INT-ALTA: Formulario "Contratar Internet" v1: domicilio, plan, DNI frente/dorso, título o contrato de locación, aceptación T&C; comando `crm.openServiceRequest`
- Dado Servicio habilitado; actor: Administrador funcional, autenticado en TEN-001 con las capabilities de su rol
- Cuando Formularios → nuevo → pasos/campos → comando `crm.openServiceRequest` → publicar v1
- Entonces Se completa «Crear formulario de alta de un servicio» sin errores, con los efectos que exigen RF-POR-151, y quedan auditoría y evento del cambio. Alternativo o excepción: Cambios posteriores → v2; presentaciones de v1 intactas

**CP-POR-8026 — CU-POR-20. Pagar factura sin ingresar**

- Cubre: CU-POR-20; RF-POR-012; RN-POR-060; M19 §16.2
- Ola: O5 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: USR-HNO: hermano-a@example.com `autorizado` con `consultar` + `pagar` sobre SUM-AG-002 por 6 meses (ESC-01)
- Dado PRM-POR-052 activo; actor: Visitante, autenticado en TEN-001 con las capabilities de su rol
- Cuando `/pagar` → cuenta + verificador → impagas enmascaradas → pagar como invitado
- Entonces Se completa «Pagar factura sin ingresar» sin errores, con los efectos que exigen RF-POR-012, y quedan auditoría y evento del cambio. Alternativo o excepción: Datos erróneos: respuesta genérica; límite por IP

**CP-POR-8027 — CU-POR-21. Cambiar de cooperativa**

- Cubre: CU-POR-21; RF-POR-027; RN-POR-009; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: TEN-001: "Cooperativa Ejemplo A", slug `coop-ejemplo-a` (R14 del plan; antes `ejemplo-a`), colores #145DA0 / #2E8B57, servicios Energía, Agua, Internet, Sepelio Piloto Internet; CU-MAR-01, CU-AUT-01
- Dado Dos pertenencias; actor: Persona socia de TEN-001 y TEN-002, autenticado en TEN-001 con las capabilities de su rol
- Cuando Selector de ámbito → TEN-002 → se purgan datos de TEN-001 → inicio de TEN-002
- Entonces Se completa «Cambiar de cooperativa» sin errores, con los efectos que exigen RF-POR-027, y quedan auditoría y evento del cambio

**CP-POR-8028 — CU-POR-22. Pago en tótem con efectivo**

- Cubre: CU-POR-22; RF-POR-162; RN-POR-074; M19 §16.2
- Ola: O10 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: KSK-001: Tótem "Sucursal Centro", caja 5, búsqueda por documento, efectivo + QR
- Dado Tótem activo; actor: Socio en sucursal, autenticado en TEN-001 con las capabilities de su rol
- Cuando Tótem → documento → deuda → efectivo en billetero → recibo impreso
- Entonces Se completa «Pago en tótem con efectivo» sin errores, con los efectos que exigen RF-POR-162, y quedan auditoría y evento del cambio. Alternativo o excepción: Excedente: anticipo si permitido; periférico con error: fuera de servicio

**CP-POR-8029 — CU-POR-23. Ver portal como socio**

- Cubre: CU-POR-23; RF-POR-160; RN-POR-069; M19 §16.2
- Ola: O2 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M19 §18.
- Datos de prueba: LND-A-v1: Landing de TEN-001 publicada: hero "Conectate con tu cooperativa", accesos rápidos, servicios destacados (Internet, Agua), noticias, botón de baja, pie legal PAN-POR-01
- Dado Llamada del socio; actor: Operador de atención, autenticado en TEN-001 con las capabilities de su rol
- Cuando Ficha de cuenta → "Ver como socio" → motivo → vista solo lectura
- Entonces Se completa «Ver portal como socio» sin errores, con los efectos que exigen RF-POR-160, y quedan auditoría y evento del cambio. Alternativo o excepción: Intento de pagar: botón deshabilitado
