# CoopApps — El alcance de la especificación, módulo por módulo

Documento para mostrar en la presentación **qué contiene la especificación**, más allá de los números: qué hace cada módulo, qué reglas ya están resueltas, qué ve el socio y dónde estaba eso en ProCoop. Está preparado para subirlo a Claude o a ChatGPT y generar una ficha visual por módulo y varias imágenes de conjunto.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | Alcance funcional v2.0 (`docs/alcance-funcional/GoodApps-Cooperativas-Alcance-Funcional.md`, secciones 5, 9, 10, 11 y 12); anexos M01 a M19 y T01 a T12 (`docs/especificacion/anexos/`); documento base de la presentación (§4 y §5); roles y módulos (§7 y §8) |
| Regla de uso | Todo lo que dice este documento está en la especificación. Las fichas resumen: no agregan funciones. Los datos de ejemplo de las imágenes deben ser ficticios ("Cooperativa A", "Socio de ejemplo") |

---

## 0. Cómo usar este documento

1. Subir este archivo a Claude (recomendado para las fichas, por la precisión del texto) o a ChatGPT.
2. Pegar el prompt maestro de la sección 0.1.
3. Pedir primero las imágenes de conjunto (IMG-A01 a IMG-A08) y después las fichas por módulo con el prompt de plantilla (sección 9.2): "Generá la ficha IMG-F-M05".
4. Verificar cada ficha contra su sección. En las fichas importa más el texto que los números: que no se agregue nada que no esté acá.

### 0.1 Prompt maestro (pegar primero)

```text
Vas a dibujar las imágenes de una presentación ejecutiva para mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. El mensaje es: "la especificación ya cubre todo el negocio de una cooperativa, con un nivel de detalle que no deja huecos: cada módulo tiene sus funciones, sus reglas, lo que ve el socio y sus indicadores".

Te adjunto el documento. Reglas obligatorias:
1. Usá SOLO el contenido del documento. No inventes funciones, no agregues ejemplos que no estén y no cambies ningún número.
2. Texto visible en español de Argentina, formal y claro. Podés acortar frases, pero no cambiar su sentido.
3. Generá cada imagen con código (HTML con SVG en Claude, Python con matplotlib en ChatGPT), 1920×1080 px, fondo claro.
4. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo para "a validar". No uses rojo.
5. Tipografía sans serif limpia (Inter o similar). Jerarquía clara: título, una frase de propósito, bloques con ícono de línea. Mucho aire; si no entra, resumí, no achiques la letra por debajo de 18 px.
6. Estilo sobrio, de consultora. Nada de robots, cerebros, cohetes ni efectos futuristas.
7. Datos de ejemplo siempre ficticios: "Cooperativa A", "Socio de ejemplo", importes redondos de muestra.
8. Después de cada imagen, listá qué secciones del documento usaste.
Voy a pedirte las imágenes por código (IMG-A01, IMG-F-M05, ...). Esperá mi pedido.
```

---

## 1. La especificación en una página

| Qué hay | Cantidad |
|---|---|
| Módulos | 30 anexos con contenido: 19 funcionales (M01 a M19) y 11 transversales (T01 a T11), más T12 con las fichas de control por servicio |
| Familias de servicios cubiertas | 17: Internet, telefonía, televisión, electricidad, agua, cloacas, gas, alumbrado público, obras y contribución por mejoras, sepelio, cementerio parque, banco de sangre, salud y ambulancias, vivienda, tasas por cuenta de terceros, capital social y otros servicios |
| Aplicaciones | 8: sistema de gestión web, portal y aplicación del socio, espacio del empleado, aplicación de campo sin conexión, sitio público, tótem de autogestión, consola de plataforma e interfaz para terceros |
| Roles predefinidos | 40 |
| Requisitos funcionales | 4.213 (especificación vigente; el documento base cita 4.204, la cifra anterior a las decisiones DEC-093 a DEC-108) |
| Requisitos no funcionales | 292 |
| Reglas de negocio | Unas 2.680 |
| Parámetros con nombre, tipo y vigencia | Unos 2.490 |
| Pantallas catalogadas | 1.051, con 558 ítems de menú |
| Operaciones de API | 4.193 en 30 contratos |
| Fichas de integración externa | 115 |
| Casos de prueba de aceptación | 5.710 |
| Recorridos completos de ejemplo | 11 (sección 7) |

**La idea para transmitir:** cada módulo no es una lista de pantallas. Es un conjunto de funciones, reglas que nunca se rompen, lo que ve el socio, indicadores con definición precisa y la ola en la que se construye.

---

## 2. Cómo leer cada ficha

| Campo | Qué dice |
|---|---|
| Para qué | El propósito del módulo en una frase |
| Qué incluye | Los bloques de funciones, resumidos |
| Reglas que nunca se rompen | Una selección de las reglas que el sistema aplica siempre. Son las que muestran que el caso difícil ya está pensado |
| Lo que ve el socio | Lo que llega a la aplicación o al sitio |
| Se mide con | Algunos de los indicadores que el módulo publica |
| Ola | Cuándo se construye (plan de olas O0 a O11) |
| Requisitos | Filas de requisitos funcionales en el anexo |
| En ProCoop | Dónde estaba esa función en el sistema actual, según el relevamiento |
| Para destacar | La frase que se puede decir en voz alta frente a los stakeholders |

---

## 3. Los servicios que cubre

Cada cooperativa habilita solo los que presta. Cada servicio tiene su configuración, productos, planes, categorías, requisitos, estados y reglas, y convive con los demás en la misma cuenta del socio.

| Servicio | Lo que ya está resuelto |
|---|---|
| Internet | Fibra, inalámbrico y cable; planes versionados con promociones; factibilidad con vigencia; instalación con equipo en comodato por número de serie; activación y corte automáticos en los equipos de red, con respaldo manual; suspensión por mora con velocidad reducida o corte; reclamos con los plazos del reglamento TIC; botón de baja público y sin cargo; informes a ENACOM |
| Telefonía | Fija e IP; red de centrales, cajas y pares; tasación de llamadas; números gratuitos; reventa móvil; prepaga con recargas; bloqueo de salientes por mora con entrantes y emergencias siempre habilitadas; número en cuarentena tras la baja |
| Televisión | Cable e IPTV; decodificadores en comodato; paquetes y señales; acceso condicional; grilla mínima por mora; liquidación de derechos de señales |
| Electricidad | Rutas y lecturas; tramos y escalones; demanda contratada y transgresiones; factor de potencia; grandes usuarios; generación distribuida con crédito a favor; telemedición y prepago; certificado del instalador; protección de electrodependientes; ventanas de corte por jurisdicción; informes a ERSeP y a la Secretaría de Energía |
| Agua | Medido o no medido con fecha efectiva; tramos; consorcios con medidor general; autolectura; aviso de posible pérdida; reducción de caudal que respeta el mínimo vital |
| Cloacas | Vinculada al inmueble o al consumo de agua; nunca se habilita solo por tener agua; cuotas de obra; sin suspensión física por mora |
| Gas | Natural, propano por red y envasado; certificado del matriculado, declaración de artefactos e inspección antes de habilitar; corrección de volumen; la reconexión exige inspección aprobada; fugas como urgencia crítica; Zona Fría |
| Alumbrado público | Alta automática con la electricidad; bloque separado en la factura; lo cobrado es deuda con el municipio hasta la rendición |
| Obras y contribución por mejoras | Base aprobada por ordenanza, convenio o asamblea; padrón de beneficiarios; prorrateo explícito; cuotas con ajuste de saldo en la última |
| Sepelio | Grupo familiar, adherentes y carencias; cuota por cantidad, edad y vínculo; subsidio por fallecimiento; la deuda nunca impide una prestación urgente |
| Cementerio parque | Unidades, derechos, titulares, inhumaciones, exhumaciones y traslados; la mora nunca cancela el derecho ni libera la unidad |
| Banco de sangre | Solo administrativo, por convenio; sin datos clínicos; nunca se cobra la sangre al receptor |
| Salud y ambulancias | Traslados programados con móvil y chofer habilitados; autorizaciones por convenio y topes; las emergencias se derivan al prestador |
| Vivienda | Planes y tipologías, adjudicación, aportes sobre el precio vigente, construcción por etapas con vales de materiales |
| Tasas por cuenta de terceros | Siempre colgadas de un servicio propio y con convenio; bloque separado; deuda con el tercero hasta la rendición |
| Capital social | Renglón propio en la factura; integración proporcional a lo pagado; la deuda de capital no suspende servicios |
| Otros servicios | Banco ortopédico, dispenser de agua, seguros, vehículos eléctricos, correo, mensajes de texto, ventas, fabricación, traslados y cualquier prestación que defina la cooperativa |

Opciones comunes a todos los servicios:

- alta provisoria con vencimiento;
- suspensión voluntaria (apagada por defecto);
- cambio de plan desde el período siguiente o con prorrateo;
- factura separada o agrupada multiservicio;
- imputación de pagos por antigüedad;
- protecciones normativas que la cooperativa no puede desactivar;
- mora sin afectación cruzada entre servicios.

---

## 4. Módulos funcionales

### Socios y servicios

#### M01 — Personas, titulares y cuentas

- **Para qué:** una identidad única de cada persona y todas sus relaciones con la cooperativa. Es la fuente que usan todos los demás módulos y la aplicación del socio.
- **Qué incluye:**
  - **Personas.** Búsqueda de coincidencias antes de crear, para que cada persona exista una sola vez. Varias identificaciones con control del dígito del CUIT y del CUIL. Captura del DNI con lector o cámara. Fallecimiento que genera tareas sin cortar servicios. Datos sensibles guardados aparte.
  - **Titulares y cuentas.** Numeración única. La cuenta se organiza en árbol: cuenta, grupos de facturación y servicios. Las marcas que usan otros módulos son no facturar, factura electrónica, excluir del redondeo y débito automático.
  - **Domicilios e inmuebles.** Normalización contra el catálogo nacional de calles. Domicilios rurales sin número. Nomenclatura catastral de seis partes. Puntos de prestación con varios servicios.
  - **Representaciones.** Apoderados y autorizados con alcance por acción (consultar, pagar, pedir la baja), vencimiento y registro de quién actuó por quién.
  - **Bloqueos con efectos concretos:** cobro, facturación, contratación, baja y otros, con vigencia y mensaje para caja.
  - **Transferencias y cambios de titular** con simulación previa de todos sus efectos y posibilidad de reversión.
  - **Ficha integral del socio:** todo lo que la persona tiene con la cooperativa en una sola pantalla, con la línea de tiempo y cómo estaban los datos a una fecha dada.
  - **Privacidad:** acceso, rectificación, supresión y anonimización compatible con la conservación obligatoria.
- **Reglas que nunca se rompen:**
  - Cambiar el titular no traslada la deuda; el nuevo titular solo la asume con un convenio expreso.
  - Compartir un domicilio no habilita a ver datos, facturas ni deudas ajenas.
  - Los duplicados nunca se fusionan solos: la fusión requiere aprobación y se puede revertir.
  - El código de vinculación de una cuenta tiene 6 dígitos y vence a los 10 minutos. Al sexto intento fallido se bloquea 15 minutos, y la respuesta nunca revela si la cuenta existe.
- **Lo que ve el socio:**
  - "Mis datos", con la actualización de contactos y preferencias.
  - La vinculación verificada de sus cuentas.
  - La gestión de sus personas autorizadas.
  - La descarga de sus datos.
- **Se mide con:** altas y bajas por causa; calidad de datos (identificación, contacto y domicilio verificados); bloqueos con más de 180 días; solicitudes de privacidad en plazo.
- **Ola:** O2, con señales a facturación y cobranza en O4 a O6. **Requisitos:** 175. **En ProCoop:** Servicios a Titulares > Titulares (104 formularios).
- **Para destacar:** "Cada persona existe una sola vez y cada gestión hecha en nombre de otro queda registrada: quién actuó, por quién y con qué permiso".

#### M02 — Catálogo de servicios y contratos

- **Para qué:** definir sin programar qué servicios presta la cooperativa y administrar cada contrato desde la solicitud hasta la baja.
- **Qué incluye:**
  - **Habilitación de servicios** con la oferta separada de la operación: cerrar la oferta frena las altas, pero los contratos siguen.
  - **Configuración versionada de cada servicio** con aprobación de un segundo usuario. El perfil del servicio cubre prestador, jurisdicción, título habilitante, requisitos, facturación y salida.
  - **Requisitos de alta en tres niveles** (no exigir, advertir, exigir): factibilidad, inmueble, matrícula, garante, instalador.
  - **Estructura comercial:** productos, planes con versiones, paquetes, promociones, financiación de la instalación y conceptos con su momento de cobro y su clasificación fiscal.
  - **Contrato con estados completos:** solicitado, en factibilidad, pendiente de instalación, activo, suspendido, rehabilitación en trámite y baja. La fecha solicitada y la efectiva se guardan por separado.
  - **Suspensiones de cuatro tipos:** voluntaria, por mora, técnica y regulatoria.
  - **Cambios de plan, categoría, régimen de medición y domicilio.**
  - **Equipos** en comodato, préstamo, alquiler o venta, vinculados al contrato.
  - **Copia de la configuración de un servicio a otra cooperativa**, sin datos de socios.
- **Reglas que nunca se rompen:**
  - Habilitar un servicio no crea contratos ni cobros.
  - Una versión publicada no se edita: se crea una nueva.
  - Un contrato pasa a activo solo con la instalación y el aprovisionamiento confirmados.
  - Solicitar la baja nunca genera cargo ni se bloquea por deuda.
  - Un servicio suspendido no vuelve a activo solo porque se registró el pago.
- **Lo que ve el socio:**
  - La oferta con sus requisitos, sin necesidad de ingresar.
  - "Mis servicios", con su estado, precio vigente, beneficios con fecha de fin y equipos asignados.
  - Avisos como "Baja solicitada" o "Cambio de plan programado".
- **Se mide con:** altas netas y tasa de baja; tiempo de la solicitud a la activación; equipos en comodato pendientes de devolución; contratos por versión de plan.
- **Ola:** O2. **Requisitos:** 117. **En ProCoop:** tablas de facturación y fichas de servicio.
- **Para destacar:** "Una cooperativa puede lanzar un servicio nuevo configurándolo, sin programar, y apagarlo nunca borra un contrato ni una factura".

#### M03 — Medición y consumos

- **Para qué:** transformar la medición de electricidad, agua y gas en cantidades aprobadas para facturar, con trazabilidad desde el medidor hasta la factura.
- **Qué incluye:**
  - **Medidores:** ficha completa con ensayos y precintos, canales por magnitud y cambio de medidor en una sola operación.
  - **Rutas y lotes de lectura** por zona, calle, rango o polígono en el mapa, con tablero de avance en lista y en mapa y cierre con acta.
  - **Toma de lecturas por todos los medios:** aplicación de campo sin conexión con advertencias y foto, carga manual, archivos de colectoras, telemedición y autolectura del socio con foto.
  - **Validación configurable** (consumo cero, fuera de rango, variación) con bandeja de excepciones: aprobar, corregir, pedir relectura, estimar o derivar a inspección.
  - **Estimaciones con método documentado:** promedio de hasta 12 períodos, mismo período del año anterior o promedio de la categoría.
  - **Demanda contratada y transgresiones; generación distribuida** con balance de energía inyectada; balance energético y pérdidas.
  - **Telemedición:** corte y reconexión remotos y medidores prepagos con recargas conciliadas.
- **Reglas que nunca se rompen:**
  - Una lectura imposible se registra con su motivo, nunca como cero.
  - Solo se factura el consumo aprobado; uno ya facturado se corrige con un ajuste.
  - Al tercer período estimado consecutivo se exige inspección o relectura.
  - Una alerta de consumo no registrado no es un fraude: solo origina una inspección.
- **Lo que ve el socio:**
  - "Mis consumos", con gráfico, comparación con el año anterior y fotos de la lectura.
  - La autolectura con su resultado.
  - "Mi prepago", con saldo y códigos de carga.
- **Se mide con:** porcentaje de lectura y de estimados; medidores sin leer separados de los consumos cero; pérdidas de energía comprada frente a facturada; productividad por lecturista.
- **Ola:** O7. **Requisitos:** 129. **En ProCoop:** Servicios a Titulares > Consumos y Operaciones > Telemed (19 formularios).
- **Para destacar:** "Cada renglón de la factura se puede seguir hasta la lectura, la foto y el lecturista que la tomó".

### Ciclo económico del socio

#### M04 — Tarifas y motor de cálculo

- **Para qué:** calcular cada importe de forma reproducible, explicable y auditable, de modo que cualquier liquidación se pueda volver a calcular con el mismo resultado aunque después cambien los precios.
- **Qué incluye:**
  - **Cuadros tarifarios con versiones, vigencias y doble firma**, vinculados a la norma que los origina (resolución del regulador, ordenanza o decisión del consejo).
  - **Motor de cálculo:**
    - cargos fijos y mínimos;
    - tramos y escalones;
    - demanda y factor de potencia;
    - corrección de volumen de gas;
    - prepaga;
    - generación distribuida;
    - prorrateo de hasta tres versiones tarifarias en un período;
    - cuotas de obra y vivienda.
  - **Reglas y fórmulas configurables y seguras, sin programación**, con editor, prueba con casos reales y asistente de inteligencia artificial que solo propone.
  - **Beneficios con su origen explícito:** subsidio público, tarifa social, bonificación comercial y promoción, con padrones importados y rendición.
  - **Simulador individual y masivo** antes de aplicar una tarifa nueva.
  - **Diferencias retroactivas** como notas de crédito o débito, sin reescribir el comprobante.
  - **Explicación de cada renglón:** qué se cobró, a qué precio, con qué descuento y por qué.
  - **Tasación de llamadas telefónicas.**
- **Reglas que nunca se rompen:**
  - Los mismos datos y la misma versión producen siempre el mismo resultado; no existe importe sin justificación.
  - Quien carga una versión no puede aprobarla.
  - El motor no contiene porcentajes fiscales: los resuelve el módulo fiscal.
  - Ningún subsidio se aplica por defecto, y nunca existe un cargo por pedir la baja.
- **Lo que ve el socio:**
  - La explicación simplificada de su factura.
  - Los cuadros tarifarios vigentes con su norma.
  - El aviso antes del fin de una promoción.
  - El plan de cuotas de obra.
- **Se mide con:** comparativo entre versiones; impacto de cada cambio tarifario en la factura media; beneficios por régimen y por quién los financia; cuentas excluidas del cálculo por causa.
- **Ola:** O4, con tarifas medidas en O7. **Requisitos:** 122. **En ProCoop:** Tablas > Cuadros Tarifarios, Impuestos y Cargos.
- **Para destacar:** "El sistema puede explicar cualquier peso de cualquier factura, y reproducir un cálculo de hace años con el mismo resultado".

#### M05 — Facturación

- **Para qué:** convertir consumos y cargos aprobados en comprobantes emitidos sin duplicación, controlados y trazables.
- **Qué incluye:**
  - **Ciclos y lotes con etapas explícitas:** preparar, prefacturar, revisar excepciones, aprobar, emitir, autorizar, distribuir y cerrar con acta.
  - **Universo congelado:** una tarifa publicada después no altera el lote ya preparado.
  - **Muestra de control automática y comparación con el período anterior.**
  - **Bandeja de excepciones** con motivo, área responsable, acción sugerida y plazo. Los casos con problemas se aíslan y el resto sigue.
  - **Pausa automática ante una falla general**, como un certificado vencido, en lugar de marcar a todos los socios con error.
  - **Factura separada por servicio** (por defecto) o **agrupada multiservicio**, con el detalle de cada servicio preservado.
  - **Emisión por persona jurídica** cuando la cooperativa opera con más de una razón social.
  - **Correcciones:** notas de crédito y débito parciales, refacturación puntual, factura manual y modificaciones masivas con vista previa.
  - **PDF con QR fiscal reproducible.** Códigos de barras configurables (Pago Fácil, Banco de Córdoba, SIRO), validados para no imprimir nunca uno inválido.
  - **Distribución** en papel por rutas, correo, WhatsApp y aplicación, con el resultado de cada envío.
- **Reglas que nunca se rompen:**
  - Ningún comprobante emitido se modifica ni se elimina.
  - Un mismo servicio y período no se factura dos veces.
  - Ante una respuesta fiscal incierta, se consulta antes de reintentar; nunca se reemite a ciegas.
  - Quien prepara un lote no puede aprobarlo.
  - Un proceso interrumpido se reanuda sin emitir una factura duplicada.
- **Lo que ve el socio:**
  - Sus comprobantes con estado de pago, PDF y acceso directo a pagar.
  - En la factura agrupada, cuánto corresponde a cada servicio.
  - El aviso de factura disponible por el canal que eligió.
- **Se mide con:** cuadre de cada lote y ciclo; excepciones por motivo y antigüedad; numeración con detección de huecos; entregas por canal y tasa de rebote.
- **Ola:** O4. **Requisitos:** 179. **En ProCoop:** Servicios a Titulares > Ventas y Facturación (82 formularios).
- **Para destacar:** "La facturación masiva tiene universo congelado, muestra de control, bandeja de excepciones y acta de cierre. Si algo se interrumpe, se retoma sin duplicar".

#### M06 — Fiscal e impuestos

- **Para qué:** autorizar comprobantes ante ARCA, calcular los impuestos y preparar las obligaciones fiscales y regulatorias. La presentación y la responsabilidad siguen siendo de la cooperativa y su contador.
- **Qué incluye:**
  - **Tablas normativas versionadas** con fuente y vigencia, mantenidas por la plataforma y adoptadas por cada cooperativa.
  - **Autorización electrónica masiva y resiliente:** CAE, contingencia anticipada, cola con estados visibles y validaciones previas que detienen el comprobante con el motivo exacto.
  - **Gestión del certificado digital,** con avisos a los 30, 14, 7 y 3 días del vencimiento.
  - **Cálculo de impuestos:** IVA, percepciones, Ingresos Brutos de Córdoba desde el inicio (las demás provincias se configuran), tributos municipales y Convenio Multilateral.
  - **Agente de retención y percepción,** con certificados numerados.
  - **Libro IVA Digital** y conciliación con "Mis Comprobantes".
  - **Regímenes informativos** con estados de presentación, acuse y rectificación, y calendario fiscal.
  - **Convenios de cobro por cuenta de terceros** con rendición.
  - **Informes a ERSeP, ENARGAS, ENACOM y la Secretaría de Energía.**
- **Reglas que nunca se rompen:**
  - Ningún porcentaje, mínimo ni vencimiento fiscal está fijo en el sistema: todo sale de una tabla vigente.
  - Un reintento nunca genera otro número ni otra autorización.
  - La clave privada del certificado nunca se guarda en la base ni la ve un usuario.
  - Generar un archivo no equivale a presentarlo.
- **Lo que ve el socio:**
  - En cada comprobante, el CAE, su vencimiento y el QR fiscal.
  - Las percepciones discriminadas y el IVA contenido.
  - Los conceptos de terceros en una sección aparte.
- **Se mide con:** tablero de autorizaciones por estado; tiempo medio de autorización; inciertos abiertos; cumplimiento del calendario de declaraciones.
- **Ola:** O4 (ARCA), con O5 y O8 para el resto. **Requisitos:** 169. **En ProCoop:** Libro IVA Ventas, retenciones y tablas fiscales.
- **Para destacar:** "Si ARCA se cae, la cooperativa sigue facturando con contingencia y nunca pierde ni repite un número".

#### M07 — Cuenta corriente y cobranza

- **Para qué:** ser la única fuente del saldo de cada titular y el único camino por el que entra dinero, explicando cada peso recibido.
- **Qué incluye:**
  - **Cuenta corriente** separada por servicio o unificada, con saldo a una fecha histórica y el recorrido de cada factura hasta sus recibos.
  - **Imputación automática por antigüedad,** con recargos primero, que respeta la elección del socio o del cajero.
  - **Saldos a favor con su origen** y bandeja de cobros no identificados.
  - **Caja presencial:**
    - cobro por código de barras;
    - medios combinados;
    - QR;
    - retenciones sufridas;
    - arqueo y cierre;
    - límites por cajero.
  - **Cobradores en la aplicación de campo,** incluso sin conexión, con tope de efectivo.
  - **Entes recaudadores configurados como datos:** Red Link, SIRO, Pago Fácil, Rapipago y bancos.
  - **Débito automático** por CBU o tarjeta, con rechazos y reintentos controlados.
  - **Pasarelas de pago** (SIRO, Pagos360, Mercado Pago), enlaces de pago por WhatsApp y cupón único.
  - **Conciliación** de cobrado, comisión y neto acreditado; devoluciones y contracargos.
  - **Reconexión automática** al confirmarse el pago, cuando el servicio lo admite.
  - **Reconocimiento de los códigos de barras del sistema anterior** durante la transición.
- **Reglas que nunca se rompen:**
  - El saldo nunca se edita.
  - Un pago pendiente de confirmación no reduce la deuda ni habilita la reconexión; volver a la página de "pago exitoso" no prueba el cobro.
  - Un excedente nunca se aplica a otro titular por inferencia.
  - El sistema nunca recibe ni guarda el número completo de una tarjeta: solo la marca y los últimos 4 dígitos.
- **Lo que ve el socio:**
  - Su deuda por servicio, sus recibos y el estado de cuenta descargable.
  - El pago en línea con "estamos confirmando tu pago".
  - La adhesión al débito automático.
  - La posibilidad de informar una transferencia.
- **Se mide con:** antigüedad de saldos por tramos; cobranza diaria por canal; porcentaje de cobranza digital; tasa de rechazo de débitos; pagos inciertos abiertos.
- **Ola:** O5. **Requisitos:** 195. **En ProCoop:** Servicios a Titulares > Cobranza (90 formularios).
- **Para destacar:** "Un pago se registra una sola vez aunque el proveedor lo informe tres veces, y la cooperativa no guarda ningún número de tarjeta".

#### M08 — Mora, corte y financiación

- **Para qué:** gestionar la deuda vencida con un único motor configurable, respetando los límites normativos de cada servicio, sin cobrar dos veces un interés ni exigir dos veces una deuda.
- **Qué incluye:**
  - **Un único motor de intereses** para caja, entes, pasarelas, portal, procesos masivos y convenios, que devuelve el mismo importe al centavo y lo explica (días, tasa y base).
  - **Política de mora por servicio y categoría** con instancias configurables: candidatos, avisos, corte. La evaluación nunca ejecuta cortes por sí misma.
  - **Notificaciones con constancia de entrega:** un correo rebotado genera la tarea de usar otro canal.
  - **Promesas de pago,** calificación de deudores y excepciones autorizadas.
  - **Protecciones normativas** de electrodependientes, entidades públicas y otros casos, con evidencia y vigencia.
  - **Ventanas de corte** por servicio y jurisdicción (días, horarios, feriados, vísperas), con preaviso obligatorio.
  - **Suspensión parcial:** velocidad reducida o bloqueo de llamadas salientes.
  - **Planes de pago y convenios** con simulador (anticipo, cuotas, tasa y costo financiero total), firma electrónica y caída automática.
  - **Garantías, incobrables, gestión judicial con acceso por estudio y prescripción.**
- **Reglas que nunca se rompen:**
  - Un mismo tramo de interés nunca se cobra dos veces, cualquiera sea el canal.
  - Ningún servicio pasa a cortado o reconectado sin la confirmación de la ejecución real.
  - La deuda del cementerio no permite suspender el agua ni la electricidad, salvo configuración expresa.
  - La deuda incluida en un convenio no se reclama como deuda original.
- **Lo que ve el socio:**
  - Su deuda con el recargo del día y el detalle del cálculo.
  - El riesgo de suspensión con su fecha estimada.
  - La simulación y la firma de un plan de pago en línea.
  - "Reactivación en trámite" hasta la confirmación técnica.
- **Se mide con:** deuda por tramo coincidente con la cuenta corriente; tasa de recupero por instancia; promesas cumplidas; convenios vigentes y caídos.
- **Ola:** O6. **Requisitos:** 224. **En ProCoop:** Crédito y Gestión de Mora (16 formularios).
- **Para destacar:** "El sistema nunca corta a un electrodependiente acreditado, nunca corta fuera de la ventana permitida y nunca da por reconectado un servicio que no se reconectó".

### Atención y operación

#### M09 — Atención al socio

- **Para qué:** centralizar en un expediente único por gestión toda la atención, sea cual sea el canal, y mostrar siempre el avance real.
- **Qué incluye:**
  - **Gestiones con número de seguimiento** que nunca se reutiliza, y tipos ampliables por la cooperativa sin intervención técnica.
  - **Bandejas de supervisión, de área y personales,** con derivación, escalamiento y prioridad de cinco niveles.
  - **Solicitudes comerciales de cualquier servicio:** alta, baja, suspensión, reactivación, cambio de titular, de plan y traslado. "Solicitar no equivale a ejecutar".
  - **Reclamos con plazos de primera respuesta y de resolución,** calendario hábil, pausa mientras se espera al socio y escalamiento.
  - **Incidente común:** una sola gestión técnica para todos los afectados por una misma falla, con avisos de falla, avance y restablecimiento.
  - **Protocolo de urgencias de seguridad** (fuga de gas, riesgo eléctrico, cable caído), con plazos en tiempo corrido.
  - **Canales:** aplicación, WhatsApp, correo, SMS, teléfono, chat web, redes sociales, ventanilla y mesa de entradas, en una bandeja única.
  - **Asistente virtual por WhatsApp:** saldo, segunda copia, enlace de pago, reclamos, turnos y baja. Verifica la identidad y deriva a una persona con el contexto.
  - **Inteligencia artificial supervisada** que clasifica, resume y sugiere; la atención funciona igual si está apagada.
  - **Turnero** con turnos prioritarios, tótem y fila virtual; **mesa de entradas** con expedientes y pases.
- **Reglas que nunca se rompen:**
  - Cerrar una gestión no modifica contratos, deudas ni comprobantes.
  - La baja no genera cargo y no exige registro previo ni pago.
  - Cerrar un incidente común no cierra solo las gestiones: cada socio confirma la solución.
  - Las notas internas nunca se muestran al socio.
- **Lo que ve el socio:**
  - Sus gestiones con estado, fecha comprometida, mensajes y constancias.
  - El aviso de cada cambio.
  - El aviso de que su reclamo forma parte de un incidente.
  - La encuesta al cerrar.
- **Se mide con:** tiempo de primera respuesta y de resolución; resolución en el primer contacto; satisfacción; bajas con constancia dentro de las 24 horas; resolución por el asistente sin intervención humana.
- **Ola:** O2, O3 y O6. **Requisitos:** 194. **En ProCoop:** Herramientas > Mesa de Entradas y Turnero; Carga Rápida de Reclamos.
- **Para destacar:** "Si se corta la luz en un barrio, hay un solo incidente con todos los afectados y cada uno recibe el aviso de restablecimiento".

#### M10 — Técnica, campo y redes

- **Para qué:** gestionar la operación técnica desde la evaluación en terreno hasta el trabajo ejecutado, revisado y con evidencia.
- **Qué incluye:**
  - **Factibilidad técnica** con consulta de cobertura y capacidad de la red, dictamen con responsable y vigencia de 90 días.
  - **Órdenes de trabajo de todo tipo:** tareas, horas, vehículos, materiales y cierre en dos pasos (ejecución y revisión). Tablero en columnas, lista y mapa con asignación por arrastre.
  - **Agenda y visitas** por zona y franja, con reserva sin doble asignación y estado visible al socio.
  - **Instalación integral:** equipo identificado, prueba de señal y velocidad, conformidad firmada, descuento único del stock y encuesta.
  - **Guardias técnicas** con escalamiento automático y protocolo de emergencia en terreno.
  - **Una sola aplicación de campo sin conexión** para técnicos, lecturistas, cobradores e inspectores. Si hay conflictos de sincronización, se conservan ambas versiones y decide un supervisor.
  - **Redes y mapas** para electricidad, agua, gas y telecomunicaciones, con **análisis de impacto** de una falla que identifica a electrodependientes y grandes usuarios.
  - **Aprovisionamiento automático de Internet y televisión** en los equipos de red, con respaldo manual.
  - **Obras y contribución por mejoras; inspecciones; controles de calidad del agua.**
- **Reglas que nunca se rompen:**
  - El servicio se activa con la instalación probada y el aprovisionamiento confirmado, nunca por la fecha de la cita.
  - Una visita fallida no activa el contrato ni descuenta el equipo.
  - Una sincronización repetida no genera otro cargo ni otra instalación.
  - El socio ve "En camino", pero nunca la ubicación del técnico en tiempo real.
- **Lo que ve el socio:**
  - El resultado de la factibilidad.
  - Los turnos disponibles para su domicilio.
  - El estado de la visita.
  - La conformidad para firmar.
  - Los avisos de interrupciones que lo afectan.
- **Se mide con:** instalaciones resueltas en la primera visita; visitas fallidas por motivo; productividad por cuadrilla; aprovisionamiento con éxito al primer intento.
- **Ola:** O3 y O6. **Requisitos:** 239. **En ProCoop:** Operaciones > Técnica (61 formularios).
- **Para destacar:** "Una sola aplicación de campo sirve al técnico, al lecturista y al cobrador, trabaja una semana sin señal y nunca duplica un equipo ni un cargo".

#### M11 — Ventas y presupuestos

- **Para qué:** gestionar todo lo que se vende o cobra por única vez, fuera de la facturación periódica.
- **Qué incluye:**
  - **Cargos por operaciones** (conexión, instalación, reconexión, cambio de titular), generados cuando ocurre el hecho que los vuelve exigibles.
  - **Simulación del primer cobro** antes de confirmar una contratación.
  - **Presupuestos con aceptación en línea** y versiones. Al aceptarse, se crean la orden de trabajo y la reserva de stock.
  - **Flujo continuo:** presupuesto, aceptación, orden de trabajo, materiales y factura en un único expediente.
  - **Venta de productos** con listas de precios por canal, entregas parciales y devoluciones.
  - **Punto de venta de mostrador** con arqueo y factura electrónica inmediata.
  - **Financiación de ventas** con tasa efectiva anual y costo financiero total.
- **Reglas que nunca se rompen:**
  - Un mismo hecho genera un único cargo, aunque el aviso llegue repetido.
  - La financiación de una venta nunca incluye deuda previa.
  - Quien crea un descuento fuera de política no puede aprobarlo.
- **Lo que ve el socio:**
  - Sus presupuestos para aceptar o rechazar; quien no tiene cuenta lo hace desde un enlace con verificación.
  - La simulación de cuotas con su costo financiero total.
- **Se mide con:** conversión de presupuestos; ventas por producto y vendedor; cartera de cuotas comerciales separada de los convenios de deuda.
- **Ola:** O4, O6 y O8. **Requisitos:** 94. **En ProCoop:** Presupuestos y Venta de Productos.
- **Para destacar:** "Del presupuesto aceptado en el celular a la factura, todo queda en un solo expediente".

### Administración

#### M12 — Compras y proveedores

- **Para qué:** conducir la compra desde la necesidad interna hasta la obligación de pago.
- **Qué incluye:**
  - **Proveedores** con CUIT validado contra ARCA. El cambio de cuenta bancaria requiere aprobación de otro usuario y aviso al proveedor, para prevenir fraudes.
  - **Circuito formal:** solicitud interna, cotización, concurso o licitación, orden de compra, recepción, factura y orden de pago.
  - **Cuadro comparativo de cotizaciones** con justificación si no se elige el menor precio.
  - **Control de tres vías** entre orden, recepción y factura, con bloqueo de pago ante diferencias.
  - **Retenciones calculadas automáticamente** con sus certificados.
  - **Portal de proveedores,** importación desde Mis Comprobantes y lectura de facturas por inteligencia artificial que una persona confirma.
  - **Factura del mayorista de energía y gas** controlada renglón por renglón contra la medición propia.
- **Reglas que nunca se rompen:**
  - Una misma persona no puede solicitar y aprobar, ni aprobar y recibir.
  - Una factura con excepción abierta no entra en una orden de pago.
  - Lo leído por inteligencia artificial solo crea borradores.
- **Lo que ve el proveedor:** sus órdenes, el estado de cada comprobante y sus certificados de retención, desde su portal.
- **Se mide con:** órdenes atrasadas; excepciones de tres vías; desempeño de proveedores; balance de energía comprada frente a facturada.
- **Ola:** O3 (mínimo) y O8. **Requisitos:** 115. **En ProCoop:** Compras y Stock > Gestión de Compras.
- **Para destacar:** "Nadie puede cambiar la cuenta bancaria de un proveedor y pagarle en el mismo acto".

#### M13 — Stock, bienes de uso y fabricación

- **Para qué:** controlar con una existencia única por ubicación, serie y lote todo lo que la cooperativa tiene, custodia, entrega, presta, repara, fabrica o amortiza.
- **Qué incluye:**
  - **Ubicación y responsable de cada unidad en todo momento:** depósito, cuadrilla, técnico, vehículo, proveedor o domicilio del socio.
  - **Doce tipos de depósito** y estados distinguibles: disponible, reservado, en custodia, instalado, en reparación, en cuarentena.
  - **Equipos de clientes** (módem, ONU, decodificador, medidor) con identificadores únicos (serie, MAC) y trayectoria completa.
  - **Entrega a cuadrillas como transferencia de custodia,** con aceptación en la aplicación y rendición que concilia lo entregado, instalado y devuelto.
  - **Inventario cíclico** con conteo a ciegas y escaneo; punto de pedido con sugerencia de compra.
  - **Valorización** con costo promedio ponderado por defecto, PEPS como opción o identificación por serie.
  - **Bienes de uso** con amortización; **garantías y reparaciones**; **fabricación** de tableros, postes, bloques o pilares.
- **Reglas que nunca se rompen:**
  - Entregar materiales a una cuadrilla no es consumo.
  - Nada se descuenta dos veces, aunque se sincronice varias veces.
  - Un equipo con número de serie nunca está en dos lugares ni en dos contratos.
  - El cargo por equipo no devuelto nunca es automático.
- **Lo que ve el socio:** sus equipos en comodato con número de serie y constancia, y cómo devolverlos.
- **Se mide con:** equipos en domicilios y pendientes de devolución; diferencias de rendición por cuadrilla; exactitud de inventario; tasa de falla por modelo.
- **Ola:** O3 (núcleo) y O8. **Requisitos:** 139. **En ProCoop:** Compras y Stock > Stock.
- **Para destacar:** "La cooperativa sabe en todo momento dónde está cada módem y en manos de quién".

#### M14 — Tesorería y bancos

- **Para qué:** administrar el dinero con trazabilidad completa y mostrar qué hay disponible, qué está en tránsito y cuál será la posición proyectada.
- **Qué incluye:**
  - **Cuentas de todo tipo** con firmantes con vigencia y tope.
  - **Saldo operativo, contable y a futuro;** libros de bancos y de tesorería.
  - **Conciliación bancaria asistida** con extractos e Interbanking, y propuestas automáticas de emparejamiento.
  - **Cheques de terceros y propios,** físicos y electrónicos, con su ciclo de vida completo.
  - **Cupones de tarjeta** y retenciones recibidas.
  - **Caja de pagos** y ejecución de órdenes de pago con firma según el monto.
  - **Rendiciones de cajas de cobranza** con conteo y diferencias aprobadas.
  - **Flujo de fondos proyectado** con escenarios de liquidez y compromisos.
  - **Pago de haberes** por archivo bancario.
- **Reglas que nunca se rompen:**
  - Un cobro esperado no es dinero disponible.
  - Quien carga un pago no puede firmarlo.
  - Generar un archivo de pago no es pagar.
  - Una conciliación solo se cierra con diferencia no explicada igual a cero.
- **Se mide con:** días de caja; partidas pendientes por antigüedad; desvío del flujo proyectado; diferencia entre lo cobrado por pasarelas y lo acreditado neto.
- **Ola:** O5 (núcleo) y O8. **Requisitos:** 188. **En ProCoop:** Tesorería (21 formularios).
- **Para destacar:** "El tesorero ve hoy cuánto dinero va a tener el mes que viene, y nada en tránsito se cuenta como disponible".

#### M15 — Contabilidad

- **Para qué:** registrar y exponer el efecto económico de todas las operaciones, en partida doble, con trazabilidad desde cada informe hasta el documento de origen.
- **Qué incluye:**
  - **Asientos automáticos** generados una sola vez por cada operación de cualquier módulo, con reglas configurables y simulador.
  - **Operaciones sin cuenta resuelta:** quedan pendientes sin frenar la operación de origen y bloquean el cierre.
  - **Plan de cuentas jerárquico** con plan modelo para cooperativas de servicios.
  - **Varios ejercicios abiertos** y períodos con bloqueo por módulo.
  - **Centros de costo** con distribución de costos comunes por indicadores (suministros, kWh, m³, horas).
  - **Conciliación permanente** con socios, bancos, proveedores, stock, sueldos y capital.
  - **Estados contables en formato de cooperativas,** ajuste por inflación, libros rubricados con folio y cierre de ejercicio.
  - **Varios planes de cuentas con equivalencias;** escenarios simulados separados de lo oficial; presupuesto con comprometido, devengado y pagado.
  - **Capital social y excedentes** con tratamiento diferenciado; varias personas jurídicas.
  - **Contabilidad no oficial durante la convivencia** con ProCoop, conciliada contra él.
- **Reglas que nunca se rompen:**
  - Cada operación se contabiliza una sola vez.
  - Ningún otro módulo elige cuentas contables.
  - Nada contabilizado se borra en un período cerrado.
  - El aporte de capital nunca es ingreso por servicios.
  - Los saldos se verifican cada noche.
- **Se mide con:** resultado por servicio y por sección; ejecución presupuestaria; conciliación de cada auxiliar contra su cuenta de control.
- **Ola:** O5 (núcleo), O6 y siguientes. **Requisitos:** 163. **En ProCoop:** Contabilidad (24 formularios).
- **Para destacar:** "Desde cualquier número del balance se llega al asiento, al documento y a la operación que lo originó".

#### M16 — Personal y sueldos

- **Para qué:** liquidar haberes y cumplir las obligaciones laborales, de seguridad social y de Ganancias sin depender de otro sistema.
- **Qué incluye:**
  - **Legajo** con una o varias empresas empleadoras.
  - **Estructura laboral versionada:** convenios, categorías, escalas, jornadas, guardias y obras sociales.
  - **Conceptos con fórmulas** y simulación revisada por otro usuario.
  - **Novedades,** incluidas las horas extra y guardias propuestas desde las órdenes de trabajo; licencias y vacaciones.
  - **Liquidaciones:** mensual, quincenal, aguinaldo, final con indemnizaciones, complementarias y rectificativas. Detalle de cálculo de cada renglón.
  - **Embargos y cuotas alimentarias** con escala de embargabilidad.
  - **Ganancias de cuarta categoría:** formulario de deducciones de ARCA y calculadora explicada.
  - **Libro de Sueldos Digital, F.931 y archivos sindicales.**
  - **Recibos con firma digital** y conformidad en la aplicación del empleado.
  - **Evaluaciones de desempeño,** sanciones, accidentes y juicios.
  - **Transición en dos pasos:** primero importación de liquidaciones externas; después liquidación propia con dos períodos en paralelo.
- **Reglas que nunca se rompen:**
  - Quien calcula no aprueba y quien aprueba no paga.
  - Nadie aprueba su propio legajo ni su propio recibo.
  - Un recibo emitido nunca se borra.
  - Los datos sensibles (salud, embargos, sanciones) requieren un permiso propio.
- **Lo que ve el empleado:** sus recibos, vacaciones, licencias, documentación y certificados, en la misma aplicación del socio, sin mezclar datos.
- **Se mide con:** costo laboral por servicio; ausentismo; horas extra por orden de trabajo; proyección de costo laboral a doce meses.
- **Ola:** O9 (registro mínimo en O3 e importación en O8). **Requisitos:** 146. **En ProCoop:** Sueldos.
- **Para destacar:** "La liquidación propia se valida con dos meses en paralelo antes de reemplazar al sistema actual".

### Institucional y social

#### M17 — Institucional

- **Para qué:** gestionar la relación institucional de cada persona con su cooperativa, conforme a la Ley 20.337 y al INAES, separada de la relación comercial.
- **Qué incluye:**
  - **Registro de asociados** con número único, correlativo y nunca reutilizado. Se distingue el asociado del cliente no asociado.
  - **Libro de Registro de Asociados** foliado e inalterable.
  - **Credencial digital con QR** de validez.
  - **Capital social completo:**
    - suscripción;
    - integración proporcional al pago;
    - reservas;
    - transferencias;
    - rescate con límite anual del estatuto.
  - **Distribución de excedentes** simulada y aprobada por la asamblea.
  - **Órganos sociales** con mandatos, incompatibilidades y alertas de vencimiento.
  - **Asambleas:**
    - padrón versionado con criterios de habilitación;
    - acreditación por credencial;
    - poderes;
    - quórum en vivo;
    - votación formal;
    - junta electoral con listas.
  - **Actas numeradas con firma digital,** honorarios de consejeros e informes al INAES.
- **Reglas que nunca se rompen:**
  - La baja de un servicio no produce el egreso del asociado.
  - Un asociado tiene un solo voto, sea cual sea su capital.
  - Las actas firmadas no se modifican.
  - No se distribuyen excedentes sin resolución de la asamblea.
- **Lo que ve el socio:**
  - Su número de asociado, su capital y su credencial digital.
  - Las convocatorias.
  - "¿Estoy habilitado?" en el padrón.
- **Se mide con:** padrón por distrito con excluidos y su motivo; rescates y uso del límite anual; vencimientos de mandatos.
- **Ola:** O2 (mínimo), O4 y O5 (capital) y O10. **Requisitos:** 109. **En ProCoop:** sin pestaña de menú propia; solo tablas.
- **Para destacar:** "La asamblea se acredita con la credencial del celular y el quórum se ve en vivo".

#### M18 — Servicios sociales y flota

- **Para qué:** gestionar los servicios cooperativos no medidos con sus reglas propias, y los recursos móviles. El sistema registra hechos administrativos: no toma decisiones clínicas ni despacha emergencias.
- **Qué incluye:**
  - **Grupos de cobertura** con adherentes, vínculos, edades, mayoría de edad y carencias.
  - **Planes de cobertura** con prestaciones, topes y alcance territorial.
  - **Solicitud de prestación única** (sepelio, subsidio, banco de sangre, traslado, ortopedia), con verificación de la cobertura a la fecha del evento.
  - **Sepelio y subsidio por fallecimiento,** con prestador y expediente.
  - **Cementerio parque:** catálogo por sectores, manzanas y unidades; derechos, actos, plano del parque y registros.
  - **Banco de sangre administrativo; salud y traslados** con móvil, chofer y tramos.
  - **Vivienda:** tipologías, adjudicación, aportes, etapas de obra, vales de materiales y certificados.
  - **Banco ortopédico, dispenser y vehículos eléctricos.**
  - **Flota:** vehículos, choferes, mantenimiento, combustible con rendimiento real, rendiciones y seguimiento satelital.
- **Reglas que nunca se rompen:**
  - La deuda nunca rechaza por sí sola una prestación urgente.
  - Una unidad de sepultura ocupada nunca se libera por falta de pago.
  - No existe precio por unidad de sangre.
  - Un vehículo con documentación vencida no se asigna.
- **Lo que ve el socio:**
  - Su grupo de cobertura.
  - Sus solicitudes de prestación, sin datos clínicos.
  - Sus derechos de sepultura.
  - Su plan de vivienda con el porcentaje aportado.
- **Se mide con:** adherentes por plan y vínculo; prestaciones frente a topes; disponibilidad del cementerio; costo de flota por kilómetro.
- **Ola:** O4 (adherentes) y O10. **Requisitos:** 149. **En ProCoop:** Operaciones > Planes de Vivienda; Herramientas > Traslados.
- **Para destacar:** "Hasta el cementerio parque, el banco de sangre y la vivienda tienen sus reglas propias, no un abono genérico".

### Canales digitales

#### M19 — Sitio público y portal del socio

- **Para qué:** dar a cada cooperativa su presencia digital y a cada socio una aplicación instalable de autogestión, con la marca y el vocabulario de la cooperativa.
- **Qué incluye:**
  - **Sitio público por bloques configurables,** con borrador, revisión y publicación; dirección propia o dominio propio.
  - **Ficha pública de cada servicio** con precio con impuestos, requisitos y botón para contratar; consulta preliminar de cobertura.
  - **Consulta y pago de facturas sin ingresar,** con datos enmascarados.
  - **Botón de baja** en la portada y al pie de todas las páginas: código dentro de las 24 horas y constancia dentro de las 72.
  - **Ingreso** con contraseña, código de seis dígitos, Google o Ciudadano Digital de Córdoba.
  - **Ciclo completo del servicio en el celular:**
    - contratar;
    - elegir la visita;
    - firmar la conformidad;
    - ver consumos y facturas;
    - pagar;
    - reclamar con fotos;
    - suspender;
    - dar de baja.
  - **Autolectura, carga de prepago, planes de pago, turnos, servicios sociales y espacio del empleado.**
  - **Modo tótem** en las sucursales.
  - **Incorporación de los usuarios del portal anterior** sin volver a registrarse.
- **Reglas que nunca se rompen:**
  - Registrarse no crea asociado, cuenta ni contrato, y la coincidencia de datos nunca da acceso a una cuenta.
  - El estado del trámite siempre se muestra separado del estado real del servicio.
  - Un pago figura como confirmado solo cuando la cobranza lo confirma.
  - El socio con deuda conserva la consulta, el pago, los reclamos y la baja.
  - Accesibilidad WCAG 2.2 AA verificada.
- **Lo que ve el socio:** un inicio adaptado a su situación (al día, con deuda, suspendido, representante o empleado) con saldo, vencimiento, acciones rápidas, trámites y visitas.
- **Se mide con:** tasa de vinculación; adopción de la factura digital; participación del pago en línea; abandono de formularios.
- **Ola:** O2 a O5. **Requisitos:** 180. **En ProCoop:** ProCoop WEB y CoopOnline (71 tipos de autogestión).
- **Para destacar:** "El socio contrata, paga, reclama y da de baja desde el celular, con la marca de su cooperativa, sobre los mismos datos que ve la oficina".

---

## 5. Módulos transversales

Estos módulos no se ven como un menú propio: son los que hacen que todo lo anterior sea seguro, configurable y confiable.

#### T01 — Plataforma SaaS

- **Para qué:** operar el servicio para todas las cooperativas sin que ninguna instale software, administre servidores ni haga copias de seguridad.
- **Qué incluye:**
  - **Alta asistida de cooperativas,** con propuesta automática de logo, colores y vocabulario que una persona confirma.
  - **Ciclo de vida:** preparación, prueba, operativa, suspendida y cierre, con listas de verificación por capacidad.
  - **Licencias en tres niveles:** módulos contratados, módulos encendidos y pantallas por rol. Cupos con aviso al 80 %.
  - **Ambiente de prueba por cooperativa** con datos anonimizados y sin emisiones reales.
  - **Copias continuas** con recuperación a un punto en el tiempo, copia diaria por cooperativa y ensayos de restauración.
  - **Aislamiento de carga:** el proceso masivo de una cooperativa no demora la caja de otra.
  - **Actualizaciones sin corte,** habilitación gradual y notas de versión.
  - **Soporte con acceso temporal, consentido y auditado,** que la cooperativa ve y revoca.
  - **Cierre ordenado** con exportación completa en formatos abiertos.
- **Reglas que nunca se rompen:**
  - Un pedido sobre datos de otra cooperativa se responde como si el dato no existiera.
  - Suspender una cooperativa no da de baja servicios de sus socios.
  - Superar un cupo nunca bloquea cobros ni consultas del socio.
  - Todas las cooperativas usan la misma versión.
- **Ola:** O0 y O1. **Requisitos:** 165. **En ProCoop:** sin equivalente; es un sistema instalado en cada cooperativa.
- **Para destacar:** "Cien cooperativas en la misma plataforma, cada una con sus datos aislados y verificados con pruebas automáticas en cada cambio".

#### T02 — Identidad, roles y auditoría

- **Para qué:** quién es cada persona, cómo ingresa, qué puede ver y hacer, y el registro de todo lo que hace.
- **Qué incluye:**
  - **Ingreso del personal** con doble factor: correo, autenticador, llaves de acceso o SMS (no admitido para administradores).
  - **Contraseñas de 12 caracteres como mínimo,** sin reglas arbitrarias y con bloqueo de contraseñas filtradas: "Cooperativa2026" se rechaza.
  - **Ingreso del socio** con documento, código de seis dígitos, Google o Ciudadano Digital, y vinculación verificada de cuentas.
  - **Sesiones cortas que se renuevan solas;** bloqueo por inactividad sin perder el trabajo; cambios de permisos aplicados en menos de un minuto.
  - **40 roles predefinidos** que cada cooperativa copia y ajusta.
  - **Acceso de soporte** de 8 horas como máximo, con modo observación enmascarado.
  - **Auditoría inmutable y encadenada:** cambios con valor anterior y nuevo, accesos, lecturas sensibles, exportaciones, mensajes y decisiones sobre la inteligencia artificial.
- **Reglas que nunca se rompen:**
  - No existen contraseñas maestras ni usuarios que salteen los controles.
  - Ningún administrador fija la contraseña de otro.
  - Un cambio que no puede registrarse en la auditoría no se confirma.
- **Ola:** O0 y O1. **Requisitos:** 93. **En ProCoop:** Configuración > General > Perfiles (en CoopApps se separa en roles y perfiles de pantallas).
- **Para destacar:** "Cada permiso se puede explicar, y cada cambio dice quién, cuándo, desde dónde y qué valor tenía antes".

#### T03 — Marca, vocabulario y experiencia de uso

- **Para qué:** que cada cooperativa tenga su propia aplicación y su propio lenguaje sin desarrollos a medida.
- **Qué incluye:**
  - **Marca por canal:** gestión, socio, empleado, campo, sitio, documentos y correo. Incluye validación de contraste y previsualización en tema claro y oscuro.
  - **Tres aplicaciones instalables por cooperativa,** sin publicarlas en tiendas.
  - **Diccionario de términos** con singular, plural y género: cambiar "Socio" por "Asociado" actualiza todo con la concordancia correcta.
  - **Tema oscuro** para el trabajo intensivo; aplicación del socio pensada para el celular.
  - **Ayuda contextual en cada pantalla;** mapa del sitio que encuentra las funciones por su nombre en ProCoop.
  - **Preferencias por usuario:** tema, densidad y tamaño de texto.
- **Reglas que nunca se rompen:**
  - Ninguna pantalla muestra textos fijos.
  - Las leyendas fiscales y legales no se pueden modificar.
  - Mostrar u ocultar una pantalla no da ni quita permisos.
  - Todo mapa y todo gesto tiene una alternativa.
- **Ola:** O0. **Requisitos:** 179. **En ProCoop:** ProCoop WEB (logos de facturas) y personalización de formularios.
- **Para destacar:** "El empleado busca la función como la llamaba en ProCoop y el sistema la encuentra".

#### T04 — Configuración y parámetros

- **Para qué:** configurar sin programar, con versiones, simulación, aprobación y fecha efectiva, y poder explicar qué configuración se usó en cada documento.
- **Qué incluye:**
  - **Parámetros** con nombre claro, tipo, validación, valor por defecto, ámbito y vigencia, y el valor efectivo visible con su origen.
  - **Versiones de configuración:**
    - borrador;
    - simulación;
    - aprobación;
    - publicación programada;
    - reversión.
  - **Configuración vigente a una fecha.**
  - **Tablas maestras** con "en uso por" antes de inactivar.
  - **Geografía argentina completa** con catálogo nacional de calles, calendarios y feriados, índices y cotizaciones.
  - **Campos adicionales tipados,** personalización acotada de formularios y varias personas jurídicas.
  - **Bóveda de credenciales,** nunca visibles.
- **Reglas que nunca se rompen:**
  - No existe edición directa de un valor vigente: se publica completo o no se publica.
  - Una fecha retroactiva nunca reescribe documentos emitidos.
  - Un índice faltante nunca se reemplaza por cero.
- **Ola:** O0 y O1. **Requisitos:** 143. **En ProCoop:** Configuración y tablas.
- **Para destacar:** "Los más de mil quinientos parámetros numéricos de ProCoop se convierten en parámetros con nombre, explicación, vigencia e historial".

#### T05 — Modelo de datos

- **Para qué:** el catálogo único de las 1.057 colecciones, con su módulo dueño, índices y orden de creación.
- **Ola:** O0. **Para destacar:** "Cada dato tiene un solo módulo dueño; los demás lo consultan, no lo copian".

#### T06 — Integraciones externas

- **Para qué:** conectar con organismos, proveedores y equipos con una arquitectura común. Sumar un proveedor nuevo es una tarea de configuración, y ninguna falla externa duplica cobros ni saltea numeración fiscal.
- **Qué incluye:**
  - **Integraciones contempladas:**
    - Fiscal: ARCA y organismos provinciales y municipales.
    - Cobranza: Pagos360, Mercado Pago, SIRO, Red Link, Banelco, Rapipago, Pago Fácil y DEBIN.
    - Bancos e Interbanking.
    - Redes de Internet: MikroTik, Radius, SmartOLT y Wispro.
    - Telefonía, telemedición y prepago.
    - Mensajería: WhatsApp, SMS y correo.
    - Identidad: Google y Ciudadano Digital.
    - Mapas, inteligencia artificial y firma digital.
    - Reguladores: ERSeP, ENARGAS, ENACOM, CAMMESA e INAES.
    - Abastecimiento, flota y equipamiento local.
  - **Configuración por cooperativa** con modo prueba y producción, y botón "Probar conexión".
  - **Bóveda de credenciales de solo escritura,** con rotación sin cortes.
  - **Ejecución confiable:**
    - reintentos controlados;
    - prevención de duplicados;
    - "resultado incierto" que se consulta antes de reintentar;
    - corte automático ante un proveedor que falla.
  - **Semáforo por conexión** y declaración de contingencia.
  - **Agente local** para impresoras, lectores y turneros, que no abre puertos.
- **Reglas que nunca se rompen:**
  - Un aviso de pago es solo un disparador: se reconsulta al proveedor antes de imputar.
  - Las credenciales heredadas se consideran comprometidas y se regeneran.
  - Ningún componente guarda datos completos de tarjeta.
- **Ola:** O0 a O5. **Requisitos:** 86. **En ProCoop:** WS_KEYS, WS_USERS, TABLAS_POWERBI y credenciales dentro del programa.
- **Para destacar:** "Las credenciales de bancos y pasarelas dejan de estar escritas en el programa y pasan a una bóveda que nadie puede leer".

#### T07 — Migración y puesta en marcha

- **Para qué:** trasladar los datos de ProCoop sin interrumpir la operación ni perder trazabilidad, con un reemplazo por etapas.
- **Qué incluye:**
  - **Inventario y diagnóstico de calidad de datos,** con una cola de saneamiento asignable.
  - **Extracción de solo lectura** congelada como copia inmutable y cifrada.
  - **Carga por las mismas reglas de cada módulo,** sin enviar mensajes ni deuda a los entes.
  - **Reproceso idempotente.**
  - **Conciliación por dominio con tolerancia cero,** aprobada por un responsable distinto de quien cargó.
  - **Histórico:** ejercicio en curso más 24 meses completos.
  - **Corrida paralela factura por factura,** sin autorizar en ARCA.
  - **Reemplazo comercial** después de dos ciclos en paralelo aprobados; reemplazo administrativo al final.
  - **Plan de vuelta atrás.**
- **Reglas que nunca se rompen:**
  - El sistema anterior solo se lee.
  - Las credenciales y los números de tarjeta nunca se migran.
  - Durante la convivencia, cada área tiene un solo sistema responsable.
- **Lo que ve el socio:**
  - Su número de cuenta de siempre.
  - El acceso al nuevo portal con las cuentas ya vinculadas.
  - Sus facturas viejas pagables con sus códigos originales hasta el vencimiento.
- **Ola:** O0, O1 y por dominio en cada ola; corte comercial en O7 y apagado en O11. **Requisitos:** 78.
- **Para destacar:** "Antes de cambiar de sistema se compara factura por factura durante dos ciclos".

#### T08 — No funcionales y seguridad

- **Para qué:** cómo debe comportarse todo el sistema.
- **Qué incluye:**
  - **Niveles de servicio:**
    - disponibilidad del 99,5 % mensual;
    - pérdida máxima de datos de 15 minutos;
    - recuperación en 4 horas por cooperativa;
    - pantallas en 800 milisegundos o menos en el 95 % de las operaciones.
  - **Capacidad:**
    - facturación de 50.000 suministros en 60 minutos;
    - cooperativas de hasta 150.000 suministros;
    - plataforma para cien cooperativas, ampliable a trescientas.
  - **Seguridad con referencia OWASP ASVS 5.0 nivel 2:**
    - cifrado en tránsito y almacenado;
    - cifrado campo por campo de salud, datos laborales, judiciales y financieros, con clave propia de cada cooperativa;
    - pruebas de penetración antes de producción.
  - **Privacidad:**
    - Ley 25.326;
    - consentimientos por finalidad;
    - "Mis datos y privacidad";
    - plazos de conservación por categoría.
  - **Continuidad:** base replicada en tres zonas y simulacros de restauración.
  - **Accesibilidad WCAG 2.2 AA.**
- **Ola:** O0, aplicado en todas. **Requisitos:** 25 funcionales y 259 no funcionales.
- **Para destacar:** "Los datos de salud se cifran con su propia clave y nunca llegan a la inteligencia artificial".

#### T09 — Comunidad y comunicaciones

- **Para qué:** un sistema único de relación con la comunidad y de comunicación por todos los canales.
- **Qué incluye:**
  - **Muro editorial** con reacciones y comentarios moderados por inteligencia artificial y personas.
  - **Encuestas** con más de treinta tipos de pregunta, lógica condicional, NPS y QR impreso en la factura.
  - **Eventos con cupo y asistencia por QR;** beneficios para socios con canje.
  - **Audiencias** con vista previa del alcance y del costo antes de enviar.
  - **Comunicaciones multicanal** con constancia de entrega y horarios de no molestar.
  - **Campañas** con métricas y control de costo.
  - **Avisos de interrupción por zona** enviados solo a los afectados.
- **Reglas que nunca se rompen:**
  - Está prohibido segmentar por datos sensibles.
  - Una sanción de comunidad nunca afecta los servicios.
  - Los avisos de seguridad no se pueden desactivar.
- **Ola:** O0 y O2. **Requisitos:** 157. **En ProCoop:** solo el envío de SMS; el resto es nuevo.
- **Para destacar:** "Un corte programado avisa solo a los vecinos afectados, por el canal que cada uno eligió".

#### T10 — Reportes, tableros e integración con terceros

- **Para qué:** una capa única de consulta en la que un indicador da el mismo valor en pantalla, en la exportación, en el tablero y en la interfaz para terceros.
- **Qué incluye:**
  - **Catálogo de reportes** con ficha y definición; ejecución en segundo plano; reportes programados.
  - **Encabezado obligatorio** con universo y fecha de corte; llegada al detalle desde cada total.
  - **Generador de reportes sin conocimientos técnicos,** con aprobación.
  - **Tableros por rol** con indicadores certificados y alertas.
  - **Inteligencia artificial analítica** que no inventa cifras y cita su fuente.
  - **Interfaz para terceros de solo lectura:**
    - permisos por área;
    - datos personales con permiso separado;
    - claves que vencen al año;
    - límites de uso;
    - paquete completo de salida.
- **Reglas que nunca se rompen:**
  - Un reporte nunca modifica datos.
  - Sin datos se muestra "sin datos", nunca un cero.
  - Cada usuario ve solo las filas de su alcance.
- **Ola:** O1, con la interfaz para terceros en O11. **Requisitos:** 104. **En ProCoop:** editor e informes personalizados; TABLAS_POWERBI.
- **Para destacar:** "Los datos son de la cooperativa: puede consultarlos, integrarlos y llevárselos completos".

#### T11 — Trámites, aprobaciones y documentos

- **Para qué:** un mecanismo común de circuitos, aprobaciones, tareas y documentos para todos los módulos.
- **Qué incluye:**
  - **Operaciones sensibles con aprobación:** anular un recibo, condonar intereses, publicar una tarifa, reabrir un período.
  - **Aprobaciones:**
    - multinivel;
    - por monto;
    - con doble firma;
    - por quórum;
    - con delegación temporal.
  - **Circuitos de trámites configurables** con formularios dinámicos y plazos en días hábiles.
  - **Bandeja unificada del empleado.**
  - **Repositorio documental** con versiones y antivirus.
  - **PDF de largo plazo;** numeración sin huecos.
  - **Firma electrónica con código y firma digital;** verificación pública por QR.
  - **Expediente digital** de cada persona, cuenta, contrato o caso.
- **Reglas que nunca se rompen:**
  - El solicitante nunca aprueba su propia solicitud.
  - El vencimiento de un paso nunca aprueba automáticamente.
  - Un documento emitido es inmutable.
- **Ola:** O0 y O1. **Requisitos:** 157.
- **Para destacar:** "Ninguna operación sensible tiene efecto antes de aprobarse, y nadie aprueba lo que pidió".

#### T12 — Fichas por servicio

- **Para qué:** controlar que cada servicio de la sección 3 esté cubierto de punta a punta: contratación, cálculo, facturación, cobro, mora y operación técnica.
- **Para destacar:** "Cada servicio tiene su ficha de control: si falta una pieza, se ve".

---

## 6. Lo que atraviesa todo el sistema

Estos principios aparecen en casi todas las fichas. Son los que más impresionan a quien conoce el negocio:

| Principio | Qué significa | Dónde se ve |
|---|---|---|
| Nada se borra | Los documentos económicos se anulan o se revierten con su respaldo | Facturación, cobranza, contabilidad, stock, sueldos, institucional |
| Solicitar no es ejecutar | Un pedido se vuelve hecho solo cuando el área responsable lo confirma | Atención, catálogo, portal |
| Hecho confirmado | Un corte, una instalación o un pago se registran solo cuando se confirman en la realidad | Técnica, mora, cobranza, integraciones |
| Explicable | El sistema explica por qué cobró un importe y por qué un usuario puede o no hacer algo | Tarifas, mora, identidad |
| Nunca dos veces | Ningún reintento duplica una factura, un cobro, un cargo o un mensaje | Facturación, cobranza, campo, integraciones |
| Separación de funciones | Quien carga no aprueba; quien aprueba no paga | Compras, tesorería, sueldos, facturación, trámites |
| Configuración, no programación | Tarifas, servicios, textos y circuitos se definen con versiones y vigencias | Catálogo, tarifas, configuración, marca |
| Protecciones normativas | Ninguna regla propia desactiva una protección de la ley | Mora, técnica, servicios sociales |
| Datos de tarjeta fuera del sistema | Solo marca y últimos 4 dígitos | Cobranza, portal, migración |
| Inteligencia artificial que asiste | Propone, resume y clasifica; nunca ejecuta sin una persona | Atención, tarifas, compras, comunidad, reportes |

**Casos difíciles que ya están resueltos** (para una imagen o para responder preguntas):

- La deuda del cementerio no permite cortar el agua.
- A un electrodependiente acreditado nunca se le corta el servicio.
- El pago no reconecta el gas: hace falta una inspección aprobada.
- La reducción de caudal de agua nunca baja del mínimo vital.
- En telefonía, las llamadas entrantes y de emergencia siguen habilitadas durante la mora.
- Pedir la baja nunca tiene cargo ni exige pagar la deuda.
- Cambiar de titular no traslada la deuda.
- Compartir domicilio no da acceso a cuentas ajenas.
- La mora no libera una unidad del cementerio.
- Un cobro con resultado incierto se consulta antes de reintentar.
- Una lectura imposible se registra con su motivo, nunca como cero.

---

## 7. Recorridos completos de ejemplo

El alcance funcional describe 11 recorridos de punta a punta, con datos ficticios (§11):

1. Contratación de Internet de punta a punta.
2. Ciclo mensual de energía.
3. Cambio tarifario.
4. Compra hasta el pago.
5. Ciclo mensual de agua con cortes protegidos.
6. Socio en mora que firma un convenio de pago.
7. Débito automático y pago por ente recaudador hasta la conciliación.
8. Alta de un servicio de sepelio con grupo familiar.
9. Liquidación mensual de sueldos.
10. Asamblea anual.
11. Migración y reemplazo del sistema anterior.

---

## 8. Lista de imágenes

| Código | Imagen | Uso en la presentación |
|---|---|---|
| IMG-A01 | Mapa de los 30 módulos por área | Apertura del bloque de alcance |
| IMG-A02 | Los 17 servicios cubiertos | Mostrar amplitud |
| IMG-A03 | Anatomía de un módulo (ejemplo M05) | Explicar cómo leer las fichas |
| IMG-A04 | Lo que atraviesa todo el sistema | Principios |
| IMG-A05 | Casos difíciles ya resueltos | Credibilidad ante expertos del negocio |
| IMG-A06 | El socio en el celular, de punta a punta | Experiencia del socio |
| IMG-A07 | De ProCoop a CoopApps, módulo por módulo | Continuidad: nada se pierde |
| IMG-A08 | Los 11 recorridos completos | Cierre del bloque |
| IMG-F-M01 a IMG-F-M19 | Ficha de cada módulo funcional | Anexo visual o profundización si preguntan |
| IMG-F-T01 a IMG-F-T11 | Ficha de cada módulo transversal | Ídem |

Sugerencia: en la presentación proyectar IMG-A01 a IMG-A08 y tener las 30 fichas como anexo, para abrir la que pidan.

---

## 9. Prompts de imágenes

### 9.1 Imágenes de conjunto

#### IMG-A01 — Mapa de los 30 módulos

```text
Generá IMG-A01 con código (HTML con SVG).
Título: "Todo el negocio de una cooperativa, en 30 módulos".
Mosaico de tarjetas agrupadas por área, con el título de cada grupo arriba (secciones 4 y 5):
- Socios y servicios: M01 Personas, titulares y cuentas · M02 Catálogo de servicios y contratos · M03 Medición y consumos.
- Ciclo económico del socio: M04 Tarifas · M05 Facturación · M06 Fiscal · M07 Cuenta corriente y cobranza · M08 Mora y financiación.
- Atención y operación: M09 Atención al socio · M10 Técnica, campo y redes · M11 Ventas y presupuestos.
- Administración: M12 Compras · M13 Stock y bienes de uso · M14 Tesorería · M15 Contabilidad · M16 Personal y sueldos.
- Institucional y social: M17 Institucional · M18 Servicios sociales y flota.
- Canales digitales: M19 Sitio y portal del socio · T09 Comunidad y comunicaciones.
- Servicios comunes y plataforma (franja inferior, en gris más oscuro, como base que sostiene todo): T01 Plataforma · T02 Identidad y auditoría · T03 Marca y vocabulario · T04 Configuración · T05 Modelo de datos · T06 Integraciones · T07 Migración · T08 Seguridad y calidad · T10 Reportes y API · T11 Trámites y documentos.
Cada tarjeta: código, nombre corto y, en chico, la cantidad de requisitos de su ficha.
Pie: "4.213 requisitos funcionales · 1.051 pantallas · 4.193 operaciones de API · 5.710 casos de prueba".
```

#### IMG-A02 — Los 17 servicios

```text
Generá IMG-A02 con código.
Título: "Cada servicio, con sus propias reglas".
Cuadrícula de 17 tarjetas con ícono de línea, nombre y una sola línea con lo más distintivo de la tabla de la sección 3. Ejemplos de la línea: Internet "Activación automática en los equipos de red"; Electricidad "Generación distribuida y protección de electrodependientes"; Gas "La reconexión exige inspección aprobada"; Agua "Nunca por debajo del caudal mínimo vital"; Cementerio parque "La mora nunca libera la unidad". Para los demás, tomá la frase de la tabla.
Pie: "Cada cooperativa habilita solo los servicios que presta".
```

#### IMG-A03 — Anatomía de un módulo

```text
Generá IMG-A03 con código, usando la ficha de M05 Facturación (sección 4).
Título: "Así está especificado cada módulo".
Diagrama de la ficha con flechas que nombran cada parte: "Para qué" (la frase), "Qué incluye" (4 bloques resumidos), "Reglas que nunca se rompen" (3), "Lo que ve el socio" (mockup de celular simple con la lista de facturas de "Socio de ejemplo"), "Se mide con" (3 indicadores), y una franja con "Ola O4 · 179 requisitos · En ProCoop: 82 formularios".
Pie: "Lo mismo, para los 30 módulos".
```

#### IMG-A04 — Lo que atraviesa todo

```text
Generá IMG-A04 con código.
Título: "Diez principios que el sistema aplica siempre".
Diez tarjetas en dos filas con ícono, nombre del principio y la frase "Qué significa" de la tabla de la sección 6. Debajo de cada tarjeta, en gris chico, "Dónde se ve".
```

#### IMG-A05 — Casos difíciles ya resueltos

```text
Generá IMG-A05 con código.
Título: "Los casos difíciles ya están resueltos".
Lista de los 11 casos de la sección 6 ("Casos difíciles que ya están resueltos"), cada uno con un tilde verde y el ícono del servicio que corresponda. Distribuilos en dos columnas.
Pie: "Cada uno es una regla escrita en la especificación, con su prueba de aceptación".
```

#### IMG-A06 — El socio en el celular

```text
Generá IMG-A06 con código: una secuencia horizontal de 8 pantallas de celular simplificadas, con la marca ficticia "Cooperativa A" en verde, siguiendo la ficha de M19 (sección 4):
1. Contratar Internet. 2. Elegir día y franja de la visita. 3. "Técnico en camino". 4. Firmar la conformidad. 5. Ver la factura con su explicación. 6. Pagar: "Estamos confirmando tu pago". 7. Reclamar con foto. 8. Botón de baja con código de seguimiento.
Título: "Todo el ciclo del servicio, desde el celular".
Pie: "Sobre los mismos datos que ve la oficina, en el mismo momento".
Datos ficticios; sin nombres reales.
```

#### IMG-A07 — De ProCoop a CoopApps

```text
Generá IMG-A07 con código: tabla visual de dos columnas unidas por flechas.
Título: "Nada se pierde: cada función de ProCoop tiene su lugar".
Columna izquierda "En ProCoop" y derecha "En CoopApps", con estas filas (campo "En ProCoop" de cada ficha):
Titulares (104 formularios) → M01 · Consumos (19) → M03 · Ventas y Facturación (82) → M05 · Cobranza (90) → M07 · Gestión de Mora (16) → M08 · Técnica (61) → M10 · Tesorería (21) → M14 · Contabilidad (24) → M15 · ProCoop WEB y CoopOnline (71 tipos de autogestión) → M19 · Solo SMS → T09 Comunidad completa · Sin menú propio → M17 Institucional.
Pie: "120 funciones del menú de ProCoop: 112 absorbidas, 7 reemplazadas por un mecanismo mejor y 1 descartada (la base de datos la administra la plataforma)".
```

#### IMG-A08 — Los 11 recorridos

```text
Generá IMG-A08 con código: 11 tarjetas numeradas con los recorridos de la sección 7, cada una con un ícono de línea.
Título: "Once recorridos de punta a punta, ya escritos".
Destacá en verde el 1 ("Contratación de Internet de punta a punta"), porque es el piloto.
```

### 9.2 Plantilla para las fichas por módulo

Pegar este prompt una vez y después pedir cada ficha por su código (por ejemplo, "Generá IMG-F-M07").

```text
Vas a generar fichas de módulo con un diseño idéntico entre sí. Cuando te pida "IMG-F-<código>", tomá la ficha de ese módulo de las secciones 4 o 5 del documento y armá una imagen de 1920×1080 con código (HTML con SVG), fondo blanco:
- Franja superior: a la izquierda el código y el nombre del módulo (grande, gris carbón); a la derecha tres etiquetas: "Ola <ola>", "<requisitos> requisitos" y el grupo del módulo.
- Debajo, la frase "Para qué" en gris medio, en una línea o dos.
- Columna izquierda (60 %): "Qué incluye", con hasta 6 bloques en tarjetas grises con ícono de línea; cada tarjeta lleva el nombre del bloque en negrita y una línea de resumen.
- Columna derecha (40 %), arriba: "Reglas que nunca se rompen", hasta 4, con tilde verde.
- Columna derecha, abajo: "Lo que ve el socio" (o "el empleado" o "el proveedor", según la ficha) dentro de un contorno simple de celular, con 3 renglones. Si la ficha no tiene ese campo, mostrá "Se mide con" con 3 indicadores.
- Pie: a la izquierda "En ProCoop: <dato>"; a la derecha, en verde y entre comillas, la frase "Para destacar".
Reglas: no agregues funciones que no estén en la ficha; si hay más bloques de los que entran, agrupá los afines sin inventar nombres nuevos; texto de 18 px como mínimo.
Confirmá que entendiste y esperá el primer código.
```

### 9.3 Orden sugerido para generar las fichas

Por prioridad para la reunión: M05, M07, M08, M10, M19, M09, M01, M02, M04, M06, T01, T02, T06, T07, T08. Después, el resto.

---

## 10. Notas para el presentador

- **No leer las fichas.** Mostrar IMG-A01 y decir: "cada uno de estos 30 módulos tiene una ficha como esta". Abrir una sola, la de Facturación o la de Mora, que son las que mejor conoce un público de cooperativas.
- **Usar los casos difíciles (IMG-A05) como prueba.** A quien conoce el negocio le convence más "la deuda del cementerio no corta el agua" que cualquier número.
- **Si preguntan por una función puntual,** buscarla en este documento o en el alcance funcional (§10). Casi seguro está, con su regla.
- **Ser preciso con lo que viene de ProCoop.** El campo "En ProCoop" dice dónde estaba la función; no afirma que ProCoop lo hiciera mal. Las debilidades técnicas de ProCoop están en el documento de dolores.
- **Alcance no es plazo.** Si la conversación va hacia cuándo está cada módulo, pasar al documento de plazos y costos: la ola de cada ficha dice en qué orden se construye.
