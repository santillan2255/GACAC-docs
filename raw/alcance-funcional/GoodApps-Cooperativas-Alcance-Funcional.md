# GoodApps Cooperativas

## Documento de alcance funcional del sistema

| Dato | Valor |
|---|---|
| Documento | Alcance funcional completo del sistema |
| Destinatarios | Consejos de administración, gerencias, responsables de área y personal de cooperativas de servicios |
| Versión | 2.0 |
| Fecha | Noviembre de 2026 |
| Carácter | Descripción funcional del sistema a construir, en lenguaje de usuario |

### Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 4 de noviembre de 2026 | Primera versión del alcance funcional. |
| 2.0 | 6 de noviembre de 2026 | Ampliación con el detalle de la especificación consolidada: reglas que aplica cada módulo, lo que ve el socio, información e indicadores y etapa de habilitación de cada módulo; recorrido de punta a punta de cada servicio; nuevos recorridos de ejemplo; roles, ingreso y seguridad con más detalle; protección de datos de tarjetas; niveles de capacidad y continuidad; modalidad de contratación; plan de etapas actualizado con el reemplazo comercial al terminar los servicios medidos y el reemplazo administrativo al final; glosario ampliado. Se conserva todo el contenido de la versión 1.0; cuando un punto cambió, se lo corrigió en el lugar. |

---

## Índice

1. Presentación
2. Objetivos del sistema
3. Principios que guían el sistema
4. Alcance general
5. Servicios que el sistema permite gestionar
6. Límites del sistema
7. Aplicaciones y canales de acceso
8. Usuarios y roles
9. Formas de ingreso y seguridad del acceso
10. Módulos funcionales
11. Recorridos completos de ejemplo
12. Niveles de servicio, seguridad y privacidad
13. Modalidad de contratación y habilitación
14. Puesta en marcha e implementación por etapas
15. Glosario

---

## 1. Presentación

**GoodApps Cooperativas** es una plataforma integral de gestión en la nube, diseñada específicamente para cooperativas de servicios públicos y sociales de la República Argentina: electricidad, agua, cloacas, gas, Internet, telefonía, televisión, alumbrado público, obras, sepelio, cementerio parque, salud, ambulancias, banco de sangre, vivienda y cualquier otro servicio que la cooperativa preste a su comunidad.

El sistema reúne en una sola herramienta todo lo que una cooperativa necesita para funcionar:

- la **gestión comercial y administrativa** (padrón de socios, servicios, medición, tarifas, facturación, impuestos, cobranza, mora, compras, stock, tesorería, contabilidad, sueldos e institucional);
- la **atención al socio** (solicitudes, reclamos, turnos, mesa de entradas, canales digitales y asistente inteligente);
- la **operación técnica y de campo** (factibilidades, órdenes de trabajo, instalaciones, lecturas, cobranza domiciliaria, redes y mapas);
- la **autogestión del socio** (sitio web propio con la marca de la cooperativa y aplicación instalable en el celular para consultar, pagar, reclamar y contratar);
- la **relación con la comunidad** (muro de novedades, encuestas, campañas y notificaciones por todos los canales);
- la **integración con terceros** (organismo fiscal, bancos, pasarelas de pago, entes recaudadores, reguladores, equipos de red y medidores inteligentes).

Se accede desde cualquier navegador y desde el celular, sin instalar programas en las computadoras de la cooperativa, sin administrar servidores y sin realizar copias de seguridad manuales. Todas las cooperativas usan la misma plataforma, siempre actualizada, y cada una conserva sus datos completamente aislados, su marca, su vocabulario y su configuración.

El sistema cubre la totalidad de las funciones que hoy resuelven los sistemas de gestión de escritorio que utilizan las cooperativas, las mejora y elimina sus debilidades conocidas: instalación local, actualizaciones manuales, contraseñas inseguras, parámetros difíciles de entender, integraciones frágiles y ausencia de experiencia digital para el socio.

### 1.1 Cómo está pensado el sistema

- **Un expediente para cada cosa y un único responsable de cada dato**: el padrón de personas, los contratos, los medidores, la cuenta corriente o el stock tienen un único módulo responsable. Los demás módulos consultan esa información y reaccionan a sus cambios, sin copiarla ni volver a cargarla.
- **Todo cambio importante queda explicado**: cada factura muestra por qué se cobró cada renglón; cada permiso puede explicarse; cada configuración aplicada a un documento queda registrada con su versión.
- **Procesos masivos seguros**: facturar, enviar avisos, calcular intereses o conciliar se ejecutan en segundo plano, con progreso visible, pausa, reanudación y una bandeja de excepciones. Un proceso interrumpido se retoma sin duplicar resultados.
- **El mismo sistema para la oficina, el campo y el socio**: el personal trabaja en el sistema de gestión web; los técnicos, lecturistas y cobradores, en la aplicación de campo que funciona sin conexión; los socios, en su aplicación y en el sitio de la cooperativa. Todos ven la misma información en el mismo momento.

### 1.2 Primer servicio completo y cooperativa piloto

El primer recorrido que se construye de punta a punta es el del servicio de **Internet**: contratación, factibilidad, visita e instalación, equipo en comodato, activación, facturación, pago, reclamo, mora y suspensión, y baja. Le siguen los servicios medidos (electricidad, agua, cloacas y gas) y, por último, la gestión administrativa e institucional completa.

La puesta en marcha real se hace con una **cooperativa piloto** que presta servicios medidos. Por eso, su reemplazo comercial se realiza cuando están listos los servicios medidos, después de dos ciclos de facturación en paralelo aprobados, y su reemplazo administrativo al final del plan (sección 14).

### 1.3 Valores de referencia

Algunos plazos, límites y valores por defecto que figuran en este documento son propuestas que la cooperativa o su asesoría deben confirmar antes de su primera aplicación productiva. En el texto se indican como "propuesto", "por defecto", "configurable" o "si la cooperativa lo habilita".

---

## 2. Objetivos del sistema

### 2.1 Objetivo general

Brindar a cada cooperativa una plataforma única, segura y configurable que le permita administrar de punta a punta todos sus servicios, su relación con los socios y su gestión interna, con información confiable, trazable y disponible en cualquier momento y lugar.

### 2.2 Objetivos específicos

1. **Unificar la gestión**: reemplazar sistemas aislados, planillas y procesos manuales por una única plataforma que comparte la misma información en todas las áreas.
2. **Adaptarse a cada cooperativa sin programar**: que cada cooperativa habilite solo los servicios que presta y configure sus tarifas, conceptos, impuestos, textos, formularios y circuitos de aprobación por sí misma, con fechas de vigencia e historial de cambios.
3. **Facturar con exactitud y control**: emitir facturas separadas por servicio o agrupadas en un único comprobante multiservicio, con controles previos, autorización fiscal electrónica y cero diferencias entre factura, cuenta corriente y contabilidad.
4. **Cobrar por todos los canales**: caja presencial, cobradores, débito automático, entes recaudadores, pasarelas de pago, códigos QR y pago en línea desde el portal, con acreditación confirmada e imputación automática.
5. **Ofrecer una experiencia digital moderna al socio**: que el socio pueda registrarse, contratar, pagar, reclamar, seguir sus gestiones y comunicarse con la cooperativa desde su celular, con la marca de su cooperativa.
6. **Profesionalizar la atención**: centralizar todas las gestiones en un expediente único con número de seguimiento, plazos de respuesta, avisos automáticos y medición de satisfacción.
7. **Ordenar la operación técnica**: planificar y ejecutar factibilidades, instalaciones, cortes, reconexiones, lecturas y mantenimientos con una aplicación de campo que funciona aun sin conexión.
8. **Cumplir con la normativa**: facturación electrónica, impuestos nacionales, provinciales y municipales, regímenes informativos, informes a entes reguladores, obligaciones laborales y societarias, y protección de datos personales.
9. **Garantizar trazabilidad total**: que cada operación quede registrada con su autor, fecha y motivo; que los documentos económicos nunca se borren, sino que se anulen o se reviertan con su respaldo.
10. **Brindar información para decidir**: tableros por rol, indicadores con definición precisa, reportes programados y consulta asistida por inteligencia artificial, siempre dentro de los permisos de cada usuario.
11. **Proteger la información**: aislamiento completo de los datos de cada cooperativa, doble factor de autenticación para el personal, cifrado, copias de seguridad automáticas y auditoría permanente.
12. **Facilitar la transición**: migrar los datos del sistema actual con controles de conciliación, permitir un período de convivencia y realizar el reemplazo por etapas sin interrumpir la operación diaria.
13. **Garantizar la continuidad del servicio**: que una caída del organismo fiscal, de un banco o de una pasarela no detenga la atención ni la facturación, con contingencias, reintentos controlados y avisos.
14. **Devolver a la cooperativa el control de sus datos**: que pueda exportar su información, integrarla con sus propias herramientas y recibirla completa si decide dejar el servicio.

---

## 3. Principios que guían el sistema

| Principio | Qué significa para la cooperativa |
|---|---|
| Una sola plataforma | Todos los servicios y todas las áreas trabajan sobre la misma información. Cada cooperativa habilita solo lo que contrata y necesita. |
| Configuración, no programación | Servicios, tarifas, conceptos, impuestos, textos y circuitos se definen desde pantallas de configuración, con vigencias e historial. |
| Vocabulario propio | Cada cooperativa elige cómo llamar a las cosas: socio, usuario o asociado; suministro, conexión o servicio. El sistema muestra siempre los términos elegidos. |
| Factura a medida | La factura separada por servicio y la factura multiservicio son modalidades igualmente completas, elegibles por la cooperativa. |
| Nada se borra | Los documentos económicos se anulan o se revierten, nunca se eliminan. Todo cambio deja constancia. |
| Inteligencia artificial que asiste | La inteligencia artificial propone, resume, clasifica y sugiere; nunca ejecuta una acción con efectos sin la confirmación de una persona autorizada. |
| El socio primero | La autogestión está pensada para el celular, con una tarea principal clara en cada pantalla. |
| Seguridad desde el diseño | Datos aislados por cooperativa, credenciales protegidas, doble factor y mínimo privilegio. |
| Solicitar no es ejecutar | Un pedido del socio o del personal se transforma en un hecho real solo cuando el área responsable lo confirma. |
| Un único responsable por dato | Cada información tiene un solo módulo responsable; los demás la consultan y reaccionan a sus cambios, sin duplicarla. |
| Explicable | El sistema puede explicar por qué cobró un importe, por qué un usuario puede o no hacer algo y qué configuración se aplicó en cada documento. |
| Hecho confirmado | Un corte, una reconexión, una instalación o un pago se registran como ocurridos solo cuando están confirmados en la realidad (en el terreno, en el equipo de red o por el proveedor de pagos). |
| Datos de tarjeta fuera del sistema | El sistema nunca recibe ni guarda el número completo de una tarjeta, su vencimiento ni su código de seguridad: los carga el socio en el formulario seguro del proveedor de pagos. |
| Los datos son de la cooperativa | La cooperativa puede consultar, exportar e integrar su información en cualquier momento, y recibirla completa al finalizar el servicio. |

---

## 4. Alcance general

### 4.1 Soluciones que integra el sistema

| Solución | Contenido |
|---|---|
| Gestión comercial y administrativa | Personas y cuentas, catálogo de servicios, medición, tarifas, facturación, fiscal, cuenta corriente, cobranza, mora y financiación, ventas, compras, stock y bienes de uso, tesorería, contabilidad, sueldos, institucional y servicios sociales. |
| Atención y relación con el socio | Solicitudes, reclamos, consultas, mesa de entradas, turnero, canales digitales, asistente virtual, inteligencia artificial supervisada y operación técnica en campo. |
| Sitio web y autogestión | Sitio público con la marca de la cooperativa, registro, portal y aplicación del socio, pago en línea y comunidad. |
| Plataforma | Alta y ciclo de vida de cada cooperativa, licencias por módulo, ambientes de prueba, soporte controlado y monitoreo de salud. |
| Cobranza y medios de pago | Cajas, cobradores, entes recaudadores, débitos automáticos, pasarelas de pago, códigos QR y conciliación. |
| Liquidación de impuestos | Facturación electrónica, IVA, Ingresos Brutos, percepciones, retenciones, tasas de terceros y regímenes informativos. |
| Información e integración | Reportes, tableros, inteligencia de negocio y una interfaz de integración para sistemas de terceros. |

### 4.2 Alcance funcional completo

El sistema incluye **todas** las funciones que actualmente resuelven los sistemas de gestión de cooperativas de servicios, sin exclusiones funcionales, incluyendo las funciones menos frecuentes: tasación de llamadas telefónicas, televisión, vivienda, salud, ambulancias, sepelio, cementerio parque, banco de sangre, fabricación propia, flota y seguimiento satelital, turnero y conexión con equipamiento local (impresoras, lectores, balanzas, pantallas).

Lo único que no se reproduce de los sistemas actuales son sus debilidades técnicas y de seguridad, que se reemplazan por soluciones modernas:

- instalación en cada computadora y actualizaciones manuales;
- una base de datos separada por cooperativa administrada por el usuario;
- contraseñas que pueden descifrarse y usuarios de base de datos compartidos;
- claves y credenciales escritas dentro del programa;
- portales del socio que funcionan con copias de los datos sincronizadas;
- parámetros identificados con números sin significado;
- menús armados por el propio programa sin relación con los permisos;
- números de tarjeta guardados en las bases de datos de la cooperativa.

### 4.3 Cómo se organizan los módulos

Los módulos funcionales de la sección 10 se agrupan así:

| Grupo | Módulos |
|---|---|
| Socios y servicios | Personas, titulares y cuentas; catálogo de servicios y contratos; medición y consumos. |
| Ciclo económico del socio | Tarifas y motor de cálculo; facturación; fiscal e impuestos; cuenta corriente y cobranza; mora, corte y financiación. |
| Atención y operación | Atención al socio; técnica, campo y redes; ventas y presupuestos. |
| Administración | Compras y proveedores; stock, bienes de uso y fabricación; tesorería y bancos; contabilidad; personal y sueldos. |
| Institucional y social | Institucional; servicios sociales y flota. |
| Canales digitales | Sitio público y portal del socio; comunidad y comunicaciones. |
| Servicios comunes | Reportes, tableros e integración con terceros; trámites, aprobaciones y documentos; configuración y parametrización; marca, vocabulario y experiencia de uso; integraciones externas. |
| Plataforma y transición | Administración de la plataforma; migración y puesta en marcha. |

### 4.4 Funciones del sistema actual que se conservan mejoradas

Ninguna función de los sistemas de escritorio se pierde: cada una se reubica en el módulo responsable de su información. Algunos ejemplos de cómo se mejoran:

- los **más de mil quinientos parámetros numéricos** se convierten en parámetros con nombre claro, explicación, valor por defecto, vigencia e historial;
- el **portal del socio con datos copiados** se reemplaza por una aplicación que trabaja sobre la misma información que la oficina, en tiempo real;
- las **contraseñas recuperables** se reemplazan por contraseñas protegidas que nadie puede leer y por doble factor de autenticación;
- las **credenciales de bancos, pasarelas y equipos de red** dejan de estar escritas en el programa y pasan a una bóveda cifrada; las heredadas se regeneran en cada proveedor;
- los **procesos masivos que podían duplicar resultados** se reemplazan por procesos reanudables que nunca emiten dos veces la misma factura ni registran dos veces el mismo pago.

---

## 5. Servicios que el sistema permite gestionar

Cada cooperativa habilita los servicios que presta. Cada servicio tiene su propia configuración, sus productos, planes, categorías, requisitos, estados y reglas, y puede convivir con los demás en la misma cuenta del socio.

| Servicio | Particularidades cubiertas |
|---|---|
| Internet | Fibra óptica, inalámbrico y cable; planes y velocidades versionados, con promociones; factibilidad técnica con vigencia; instalación; equipos en comodato identificados por número de serie; activación y corte automáticos en los equipos de red, con respaldo manual si el equipo no responde; suspensión por mora con velocidad reducida o corte; reclamos con los plazos del reglamento de clientes de servicios TIC; botón de baja público y sin cargo; informes a ENACOM. |
| Telefonía | Telefonía fija e IP; red física de centrales, cajas y pares; numeración y plan de numeración; importación, depuración de duplicados y tasación de llamadas; planes de descuento; números gratuitos; liquidación a las operadoras por llamadas a celulares; telefonía móvil revendida con importación de la facturación del operador; paquetes de mensajes de texto y telefonía prepaga con recargas; bloqueo de llamadas salientes por mora, con llamadas entrantes y de emergencia siempre habilitadas; número en cuarentena tras la baja; detalle de llamadas para el socio; botón de baja. |
| Televisión | Cable e IPTV; decodificadores en comodato y puntos adicionales; paquetes y señales adicionales; aprovisionamiento en el sistema de acceso condicional; suspensión por mora con grilla mínima o corte de señal; liquidación de derechos de señales como costo; botón de baja. |
| Electricidad | Medidores, rutas y lecturas; tramos y escalones; demanda contratada y transgresiones (se factura la mayor entre contratada y registrada); factor de potencia; grandes usuarios con condiciones particulares aprobadas; generación distribuida de usuarios generadores, con crédito a favor cuando la inyección supera el consumo; compra de energía y balance de pérdidas; telemedición y medidores prepagos (fuera de las rutas y del ciclo pospago); certificado del instalador habilitado; suministros provisorios; protección de usuarios electrodependientes; ventanas de corte por jurisdicción; informes a ERSeP y a la Secretaría de Energía. |
| Agua | Medición o cálculo según datos del inmueble (régimen medido o no medido con fecha efectiva); tramos de consumo; consorcios con medidor general distribuido entre unidades; autolectura opcional; aviso de consumo anómalo por posible pérdida; cortes y restricciones con protecciones normativas, con reducción de caudal que respeta un caudal mínimo vital; informes al regulador. |
| Cloacas | Servicio vinculado al inmueble o al agua, calculado sobre el consumo de agua de la misma cuenta cuando corresponde; nunca se habilita por el solo hecho de tener agua ni se da de baja con ella; cuotas de obras de red; sin suspensión física por mora. |
| Gas | Gas natural por red, propano por red y gas envasado, cada modalidad con su propia configuración; certificado del matriculado, declaración jurada de artefactos e inspección antes de habilitar; corrección de volumen; factores de poder calorífico por período; rehabilitación tras la mora solo con inspección aprobada; fugas como urgencia crítica; subsidios de Zona Fría; informes al regulador. |
| Alumbrado público | Tasa por cuenta del municipio o servicio propio; alta automática junto con el suministro eléctrico; exhibición separada en la factura; convenio obligatorio; lo cobrado es deuda con el municipio hasta la rendición al tercero; sigue el estado del suministro principal. |
| Obras y contribución por mejoras | Pavimento, redes de agua, cloacas y alumbrado; base aprobada por ordenanza, convenio o asamblea; padrón de beneficiarios; prorrateo con criterio explícito (por defecto, metros de frente); planes de cuotas con ajuste de saldo en la última cuota; seguimiento del plan desde la aplicación del socio. |
| Sepelio | Planes con grupo familiar, adherentes y carencias; cuota según la cantidad, la edad y el vínculo de los adherentes; mayoría de edad; subsidio por fallecimiento; prestador y expediente; la deuda nunca impide atender una prestación urgente. |
| Cementerio parque | Unidades de sepultura, derechos, titulares, autorizados, inhumaciones, exhumaciones, reducciones y traslados; reserva con vencimiento; adquisición al contado o en cuotas, mantenimiento periódico y cargos por acto; la mora nunca cancela el derecho ni libera la unidad; libros exportables; buscador público de difuntos opcional. |
| Banco de sangre | Adhesión y cobertura por convenio, gestión administrativa de solicitudes y campañas de donación, sin datos clínicos y sin cobrar nunca la sangre al receptor. |
| Salud y ambulancias | Prestadores, profesionales, traslados programados con móviles y choferes habilitados, autorizaciones por convenio y topes por plan, con datos sensibles protegidos; las emergencias se derivan al prestador habilitado. |
| Vivienda | Planes y tipologías, inscripción, adjudicación, aportes porcentuales sobre el precio vigente de la tipología, comprobante exclusivo de vivienda, construcción por etapas con materiales y vales, certificados, transferencias y rescisión. |
| Tasas por cuenta de terceros | Tasas municipales, fondos y otros conceptos cobrados por cuenta y orden de terceros, siempre asociados a un servicio propio del socio, con convenio obligatorio, bloque separado en la factura, deuda con el tercero y rendición; cobro de comprobantes del tercero por código de barras. |
| Capital social | Cuotas sociales facturadas como renglón identificado de la factura, con registro propio separado de la deuda por servicios; integración proporcional a lo pagado; la deuda de capital no suspende servicios. |
| Otros servicios | Banco ortopédico, dispenser de agua, seguros y adhesiones, registración de vehículos eléctricos, correo electrónico, paquetes de mensajes de texto, ventas de productos, fabricación (postes, bloques, tableros, pilares), traslados y fletes, y cualquier otra prestación que la cooperativa defina. |

Cualquier servicio puede ofrecerse en forma **provisoria** (con vencimiento obligatorio), admitir **suspensión voluntaria** si la cooperativa lo habilita y aplicar **cambios de plan** desde el período siguiente o en forma inmediata con prorrateo.

### 5.1 Cómo se recorre cada servicio de punta a punta

La tabla resume, para cada servicio, cómo se contrata, cómo se mide y calcula, cómo se factura y cobra, qué ocurre ante la mora y qué operación técnica requiere. Los importes, plazos y modalidades son configurables por cada cooperativa salvo que se indique lo contrario.

| Servicio | Contratación | Medición y cálculo | Facturación y cobro | Mora y corte | Operación técnica |
|---|---|---|---|---|---|
| Internet | Solicitud desde el sitio o en atención; al admitirla se crea el contrato en estado "solicitado", que avanza con la factibilidad favorable. | Sin medidor: abono fijo por plan y velocidad, con proporcional desde la activación efectiva. | La facturación empieza con la activación; la primera factura incluye la fracción del mes, el mes siguiente y la instalación. | Avisos con constancia de entrega; suspensión con velocidad reducida o corte, y reconexión automática al pagar. | Factibilidad, visita agendada por el socio, instalación con equipo en comodato y activación automática en los equipos de red. |
| Telefonía | Solicitud con número asignado al contrato; la telefonía móvil revendida no requiere visita. | Abono fijo más la suma de las llamadas tasadas; las llamadas gratuitas valen cero. | Factura separada por servicio con detalle de llamadas; la telefonía prepaga se cobra por recarga. | Bloqueo de llamadas salientes; entrantes y emergencias siempre habilitadas. | Reserva de número, posición de caja y par; alta en la central, en muchos casos registrada en forma manual. |
| Televisión | Solicitud con paquete, señales adicionales y cantidad de puntos. | Abono por paquete más un cargo por cada decodificador adicional. | Instalación en la primera factura; cobro por los canales habituales. | Grilla mínima o corte de señal, con reconexión por el mismo sistema. | Instalación con decodificadores en comodato y activación de la señal. |
| Electricidad | Solicitud con certificado del instalador y, si corresponde, constancia de electrodependencia; un contrato por punto de suministro. | Lecturas por ruta, telemedición o prepago; tramos, demanda, factor de potencia y generación distribuida. | Lote por ruta con revisión y aprobación; el total negativo por generación queda como crédito a favor. | Ventanas de corte por jurisdicción; nunca se corta a un electrodependiente acreditado. | Conexión con lectura inicial, colocación del medidor y atención de emergencias por riesgo eléctrico. |
| Agua | Solicitud con el inmueble obligatorio y el régimen medido o no medido. | Lectura o autolectura por tramos, o cálculo con los datos aprobados del inmueble, sin lecturas inventadas. | Puede haber varios ciclos de agua; en cuenta unificada no se imputa entre servicios por inferencia. | Reducción de caudal sin bajar del caudal mínimo vital; interrupción solo si la concesión lo admite. | Conexión domiciliaria o extensión de red; reclamos por pérdidas con fotos. |
| Cloacas | Solicitud propia; nunca se habilita por el solo hecho de tener agua. | Cargo fijo, cálculo sobre el consumo de agua de la misma cuenta o cuota de obra de red. | Se calcula después del agua cuando usa su consumo. | Sin suspensión física: avisos, intereses, convenio y gestión de cobro. | Conexión domiciliaria; reclamos por desborde u obstrucción. |
| Gas | Certificado del matriculado, declaración jurada de artefactos e inspección antes de habilitar. | Volumen corregido por presión, temperatura y poder calorífico; sin factor del período, el consumo queda bloqueado. | Recategorización por los últimos 6 o 12 períodos; subsidios de Zona Fría. | El pago no rehabilita por sí solo: la reconexión exige una inspección aprobada. | Colocación del medidor y guardia de emergencias por fuga. |
| Alumbrado público | Nace por regla automática al dar de alta la electricidad; directa solo si es obligatorio con fundamento normativo. | Importe fijo o porcentaje sobre el consumo eléctrico del suministro principal. | Bloque separado de terceros; pago parcial repartido en proporción entre lo propio y lo del municipio. | No se corta por separado; la deuda del municipio no habilita el corte salvo convenio y norma. | Reclamos por luminarias apagadas, derivados al municipio o a la cooperativa según el convenio. |
| Obras y contribución por mejoras | Un contrato por beneficiario del padrón, creado al aprobar la contribución. | Cuota según el prorrateo aprobado; la última cuota ajusta el saldo exacto. | Cada cuota avanza el plan al emitirse y retrocede si se anula. | Se puede refinanciar lo vencido con un convenio; no se suspenden otros servicios. | Registro de la obra, su costo y su avance. |
| Sepelio | Solicitud o alta propuesta al activar otro servicio, siempre con consentimiento; alta de adherentes. | Cuota por cantidad, edad y vínculo de los adherentes vigentes al último día del período. | Factura separada o talón conjunto con otros servicios si la cooperativa lo configura. | La deuda solo advierte; nunca se rechaza una prestación urgente por deuda. | Caso de sepelio con prestador, traslado e inhumación; subsidio con aprobación de otro usuario. |
| Cementerio parque | Reserva con vencimiento, formalización con instrumento y documentación. | Precio de adquisición al contado o en cuotas, mantenimiento periódico y cargo por acto. | Mantenimiento en el ciclo del servicio y actos como cargos facturables. | La mora no cancela el derecho, no libera la unidad ni corta otros servicios. | Agenda de inhumaciones, exhumaciones, reducciones y traslados, con autorización y documentación previas. |
| Banco de sangre | Adhesión del titular, su grupo y beneficiarios a un convenio. | Gratuito, financiado por la cooperativa o con un aporte fijo; nunca un precio por unidad de sangre. | Con importe cero no se emite factura. | La deuda no condiciona ninguna respuesta. | Solicitudes administrativas canalizadas al prestador y campañas de donación. |
| Salud y ambulancias | Contrato con grupo de cobertura y plan con topes. | Cuota del grupo; traslados no cubiertos por kilómetro o importe fijo, con coseguro. | El traslado no cubierto se factura al cerrar el viaje. | La deuda no decide prestaciones sanitarias ni rechaza un traslado urgente. | Agenda de traslados con móvil y chofer habilitados, ejecutados desde la aplicación de campo. |
| Vivienda | Inscripción en un plan con tipología; un solo plan por cuenta. | Aporte porcentual sobre el precio vigente de la tipología, con tope al 100 %. | Comprobante exclusivo de vivienda; cada pago aumenta el porcentaje aportado. | Mora configurable por meses adeudados; el plan no se reconecta como un servicio de red. | Construcción por etapas, vales de materiales y certificados aprobados por otro usuario. |
| Tasas por cuenta de terceros | No se contratan: acompañan al servicio propio que admite el convenio. | Regla de tipo impuesto vinculada a un tributo aprobado; sin convenio, el renglón queda observado. | Bloque separado en la factura; lo cobrado es deuda con el tercero hasta su rendición. | Por defecto no integra el saldo que habilita la suspensión; recargos solo si el convenio los define. | No requiere. |
| Capital social | Suscripción al facturar, al activar un servicio o al aprobar el ingreso, según la configuración. | No es precio: el importe lo define la regla de suscripción. | Renglón "Cuota social" con leyenda; integración proporcional a cada pago. | Puede excluir del padrón sobre un umbral, pero no suspende servicios. | No requiere. |
| Otros servicios | Solicitud tipificada; un servicio sin ficha completa confirmada no admite contratos. | Abono o cargo por evento; en el dispenser, excedente según los litros del mes. | Factura separada; los depósitos de garantía se registran como deuda con el socio. | Dispenser: la deuda a una cantidad de días bloquea nuevos retiros. | Préstamo, devolución y mantenimiento de elementos ortopédicos; retiros de dispenser con límite diario. |

### 5.2 Opciones comunes a todos los servicios

- **Provisorio**: un suministro puede darse de alta en forma transitoria, con vencimiento obligatorio, y facturarse en esa condición.
- **Suspensión voluntaria**: el socio puede pausar un servicio por un plazo, con o sin cargo, solo si la cooperativa lo habilita para ese servicio; está deshabilitada por defecto. La reactivación no se anuncia hasta que se confirma en los equipos de red.
- **Cambio de plan**: rige desde el período siguiente; en forma inmediata con prorrateo solo si la cooperativa lo habilita. La permanencia mínima nunca impide la baja.
- **Cambio de titular y traslado**: en la transferencia, la deuda anterior queda en el titular saliente. El traslado de domicilio exige una nueva factibilidad cuando el servicio la requiere.
- **Factura separada o agrupada**: por defecto se emite una factura por servicio; la factura agrupada multiservicio se activa por grupo, con detalle separado por servicio y siempre para un mismo titular. Una factura que queda en cero no se emite.
- **Servicios obligatorios y opcionales**: las altas automáticas directas proceden solo para servicios obligatorios con fundamento normativo; los opcionales se proponen y requieren el consentimiento del socio.
- **Contratos por punto de prestación**: en los servicios medidos hay un contrato por punto de suministro; en los no medidos, como Internet, la cuenta puede tener varios contratos iguales.
- **Deuda en el domicilio**: la deuda existente en el domicilio solicitado se informa como advertencia y no impide, por sí sola, iniciar la solicitud.
- **Tasas de terceros**: siempre cuelgan de un servicio propio del socio y requieren un convenio vigente con el organismo beneficiario; nunca se cobran solas.
- **Capital social**: se factura en un renglón propio, separado del precio del servicio, y nunca se mezcla con el abono.
- **Imputación de pagos**: por defecto se cancelan primero las deudas más antiguas, con los recargos antes que el capital; los saldos a favor entre servicios se aplican con elección.
- **Botón de baja**: es obligatorio y público en Internet, telefonía y televisión; en los demás servicios es configurable. En cementerio parque no existe baja por botón.
- **Mora sin afectación cruzada**: por defecto, la deuda de un servicio no habilita la suspensión de otro servicio de la misma cuenta.
- **Protecciones normativas**: las protecciones por condición (electrodependencia, salud, establecimientos educativos, entidades públicas), los preavisos y las ventanas de ejecución que fija la norma no pueden ser modificados por la cooperativa.
- **Datos sensibles**: los servicios de salud, ambulancias, banco de sangre y sepelio tienen acceso restringido, sin inteligencia artificial por defecto, y se prohíbe segmentar campañas a partir de sus beneficiarios.
- **Etapas de habilitación**: el recorrido completo de Internet se habilita en las etapas 3 a 7; los servicios medidos, en la etapa 8; telefonía, televisión y los servicios sociales, en la etapa 11. Algunos servicios pueden facturarse antes como abono fijo con activación manual.

---

## 6. Límites del sistema

Esta sección define con precisión qué no hace el sistema, qué responsabilidades conserva la cooperativa y qué condiciones rigen su funcionamiento.

### 6.1 Límites de responsabilidad

1. **Obligaciones fiscales**: el sistema calcula, prepara, valida, registra y concilia la información fiscal. La presentación de las declaraciones y la responsabilidad fiscal corresponden a la cooperativa y a su profesional contable. El sistema solo presenta en forma directa cuando el organismo dispone de un servicio oficial habilitado y la cooperativa lo activa expresamente; en los demás casos genera el archivo y registra el acuse que el responsable adjunta. Generar un archivo no equivale a presentarlo, y emitir una instrucción de pago no equivale a pagar.
2. **Restricciones normativas**: la cooperativa puede configurar sus condiciones, pero ningún administrador puede desactivar las restricciones que impone la normativa vigente (por ejemplo, protecciones ante cortes o condiciones fiscales).
3. **Gestión institucional**: el sistema prepara la información de asociados, asambleas, actas y capital y deja evidencia de lo actuado, pero no certifica la validez legal de los actos ni reemplaza las decisiones de los órganos sociales.
4. **Servicios de salud y sociales**: el sistema gestiona solo los aspectos administrativos. No lleva historias clínicas, no toma decisiones clínicas ni de aptitud, no despacha emergencias y el banco de sangre se administra únicamente por convenio, sin datos clínicos. Ninguna prestación de urgencia queda condicionada por la deuda ni por una regla comercial.
5. **Cementerio parque**: el sistema no dispone de restos ni de derechos de sepultura por falta de pago.
6. **Inteligencia artificial**: propone, clasifica, resume y sugiere. Toda acción con efectos requiere la confirmación de una persona con permiso y queda registrada. La inteligencia artificial permanece apagada hasta que la cooperativa la acepta, y en la consulta de datos nunca inventa cifras: responde sobre información certificada y dentro de los permisos del usuario. Nunca ejecuta por sí sola cobros, cortes, anulaciones, cambios de permisos ni decisiones clínicas, y los datos de salud nunca se envían a un proveedor de inteligencia artificial.
7. **Plazos de prescripción y criterios legales**: los plazos y criterios con contenido jurídico vienen precargados con valores de referencia, son editables por la cooperativa y deben ser validados por su asesoría legal antes de su primera aplicación productiva. Lo mismo rige para los plazos de conservación de datos personales y documentos (sección 12.3).
8. **Responsabilidad sobre los datos personales**: cada cooperativa es la responsable de su base de datos y decide las finalidades del tratamiento. GoodApps actúa como prestador de servicios de tratamiento por cuenta de la cooperativa: no usa los datos para otros fines, no los cede y, al terminar el servicio, los devuelve o los destruye. La comunicación de un incidente a los titulares y a la autoridad de control la decide la cooperativa, con la información que le entrega la plataforma.
9. **Datos de tarjetas de pago**: el sistema nunca recibe, transmite ni guarda el número completo de una tarjeta, su fecha de vencimiento ni su código de seguridad. Esos datos se ingresan únicamente en el formulario del proveedor de pagos, en la terminal certificada del adquirente o en el sistema de la procesadora de tarjetas. Si una procesadora exige el número completo de la tarjeta para generar un archivo de débito automático, el sistema no genera ese archivo y la adhesión se tramita por una pasarela de pago o en el sistema de la procesadora.
10. **Seguridad de los equipos y cuentas propias de la cooperativa**: la plataforma protege el servicio, los datos y los accesos; el resguardo de las computadoras, celulares, casillas de correo y claves personales de sus usuarios corresponde a la cooperativa y a cada persona.

### 6.2 Límites funcionales por diseño

1. **El portal es un canal, no el dueño del proceso**: el socio no puede cambiar tarifas, aprobar acuerdos excepcionales ni validar un pago por su sola acción. Toda alta, suspensión, reactivación o baja solicitada desde el portal se tramita hasta que el área responsable confirma el hecho.
2. **Ningún dato privado en lo público**: el sitio público y las consultas sin ingreso nunca muestran datos que identifiquen a una persona más allá de lo que el propio solicitante aportó. La consulta pública de deuda exige dos datos de identificación (por ejemplo, número de cuenta y documento) y muestra solo la información mínima.
3. **Muro editorial**: en la comunidad publica la cooperativa y su personal autorizado. Los socios leen, reaccionan y comentan, con moderación habilitable; no publican posteos propios.
4. **Votaciones**: las encuestas y consultas de la comunidad no son vinculantes. Las votaciones formales con efecto institucional se gestionan exclusivamente en el módulo institucional.
5. **Deuda y titularidad**: la deuda queda siempre en el titular que la generó. El cambio de titular no traslada la deuda al nuevo titular, salvo convenio expreso de asunción. La existencia de deuda previa en un domicilio genera una advertencia, nunca un bloqueo automático.
6. **Seguimiento de visitas técnicas**: el socio ve el estado de su visita (por ejemplo, "En camino"), sin seguimiento del técnico en el mapa en tiempo real.
7. **Factura en cero y total negativo**: una factura sin importe no se emite y queda registrada como "sin cargo"; un total negativo se resuelve por defecto con nota de crédito o crédito a futuro, según la política de cada servicio.
8. **Encender no contrata, apagar no borra**: habilitar un servicio no crea obligaciones para los socios; deshabilitarlo no da de baja contratos, no oculta facturas ni elimina expedientes. Un módulo desactivado queda en modo de solo consulta del historial, con consulta y exportación pero sin nuevas operaciones. Cerrar la operación de un servicio con contratos vigentes exige un plan de salida.
9. **Altas automáticas**: solo se dan de alta automáticamente los servicios obligatorios con fundamento normativo. Los opcionales se proponen y requieren el consentimiento del socio.
10. **Una decisión sobre la cooperativa no afecta a sus socios**: si la plataforma suspende a una cooperativa (por ejemplo, por deuda del servicio o por un riesgo de seguridad), no da de baja servicios ni contratos de los socios ni borra información. Los efectos sobre los socios los decide siempre la cooperativa en sus propios módulos.
11. **Acceso por permiso, nunca por coincidencia**: coincidir en el documento, el correo, el teléfono o el domicilio no da acceso a cuentas ajenas, y pagar la factura de otra persona no permite ver sus otros servicios ni su historial.
12. **Sin contraseñas conocidas por terceros**: no existen contraseñas maestras, contraseñas por defecto ni usuarios que salteen los controles. Ningún administrador puede fijar la contraseña de otro usuario: el alta y el restablecimiento se hacen siempre por invitación o enlace de un solo uso.

### 6.3 Condiciones de funcionamiento

1. El uso del sistema requiere conexión a Internet, salvo la aplicación de campo (técnicos, lecturistas y cobradores), que opera sin conexión y sincroniza al recuperarla. Las operaciones de cobro y pago, las anulaciones, los cambios de configuración y el ingreso al sistema no se realizan sin conexión.
2. El equipamiento local (impresoras fiscales y de tickets, lectores de códigos, balanzas, pantallas y tótems del turnero) se conecta mediante un agente local instalado en el puesto correspondiente. El agente solo inicia conexiones hacia la plataforma, no abre puertos en el puesto y se identifica con un certificado propio del dispositivo (sección 12.2).
3. Los servicios de terceros (organismo fiscal, bancos, pasarelas, mensajería, mapas, equipos de red, medidores inteligentes) están sujetos a la disponibilidad de cada proveedor y a los convenios que la cooperativa mantenga con ellos. El sistema prevé contingencias y reintentos controlados ante sus caídas: si un tercero no responde, la operación queda pendiente o con resultado incierto y el resto del sistema sigue funcionando.
4. Los costos de mensajería (SMS y WhatsApp) dependen del modelo elegido: proveedor propio de la cooperativa o servicio de la plataforma con consumo medido (sección 13.3).
5. La firma de documentos se realiza por defecto con firma electrónica mediante código de un solo uso (conformidades de instalación, convenios y trámites). Los recibos de sueldo y las actas pueden firmarse con firma digital a través de un proveedor licenciado.
6. Los niveles de servicio comprometidos se detallan en la sección 12.
7. **Navegadores y dispositivos**: el sistema funciona en las dos últimas versiones de Chrome, Edge, Firefox, Safari y Samsung Internet. Las aplicaciones del celular están previstas para Android 9 o superior e iOS 16.4 o superior, y para equipos de gama baja (2 GB de memoria) con conexión móvil lenta. El sistema de gestión se usa desde pantallas de 1024 píxeles de ancho y está optimizado a partir de 1280. Internet Explorer no está soportado.
8. **Ambientes de prueba**: desde los ambientes de prueba y de demostración no se pueden emitir comprobantes fiscales reales, cobrar ni enviar mensajes a destinatarios reales; se usan los servicios de homologación de cada proveedor y listas de destinatarios permitidos.
9. **Mantenimiento programado**: la plataforma prevé una ventana de mantenimiento con aviso previo, fuera de los días críticos de cada cooperativa (sección 12.6). Las actualizaciones habituales se instalan sin interrumpir el servicio.

---

## 7. Aplicaciones y canales de acceso

El sistema se compone de varias aplicaciones, todas sobre la misma información y con la marca de cada cooperativa donde corresponde.

| Aplicación | Quiénes la usan | Qué ofrece |
|---|---|---|
| Sistema de gestión web | Personal administrativo, comercial, técnico y directivo de la cooperativa | Todos los módulos de gestión, configuración, reportes y tableros, con menú adaptado a los permisos de cada usuario. |
| Aplicación del socio | Socios titulares, representantes autorizados, adherentes y visitantes registrados | Cuentas, servicios, facturas, pagos, consumos, reclamos, solicitudes, turnos, comunidad y perfil. Se instala en el celular con el nombre, el ícono y los colores de la cooperativa. |
| Espacio del empleado | Personal de la cooperativa | En la misma aplicación del celular, sin mezclar datos con su rol de socio: recibos de sueldo, firma de recibos, vacaciones, licencias, tareas, aprobaciones y comunicaciones internas. |
| Aplicación de campo | Técnicos, lecturistas y cobradores | Agenda del día, órdenes de trabajo, rutas de lectura, cartera de cobranza, materiales en el vehículo, fotos, firma y ubicación. Funciona sin conexión. |
| Sitio público | Público en general | Información institucional, noticias, servicios disponibles, cuadros tarifarios, registro, consulta y pago sin ingresar (si la cooperativa lo habilita), solicitudes de alta, consultas y contactos con número de seguimiento, y botón de baja. Los reclamos con fotos y seguimiento se hacen desde la aplicación del socio. |
| Tótem de autogestión | Socios en las oficinas de la cooperativa | Turnos, consulta y pago presencial en modo kiosco. |
| Consola de plataforma | Equipo operador de GoodApps | Alta y seguimiento de cooperativas, licencias, soporte, salud del servicio y tablas comunes (fiscales, índices, geografía). |
| Interfaz de integración | Sistemas de terceros autorizados por la cooperativa | Acceso controlado a datos y operaciones para sistemas de inteligencia de negocio, municipios, federaciones, bots u otros sistemas propios. |
| Agente local | Puestos de la cooperativa con equipamiento conectado | Programa instalado en el puesto que conecta el turnero, las impresoras fiscales y de tickets, los lectores y las balanzas con el sistema, siempre iniciando él la conexión y con un certificado propio del dispositivo. |

### 7.1 Navegación del sistema de gestión

El menú del sistema de gestión se organiza en las siguientes áreas, y cada usuario ve únicamente las que su rol le permite:

| Área | Contenido |
|---|---|
| Inicio | Tablero según el rol, bandeja de tareas, notificaciones y accesos favoritos. |
| Socios y cuentas | Personas, titulares, cuentas, inmuebles, domicilios, grupo familiar y documentación. |
| Servicios | Catálogo, planes, categorías, conexiones y suministros, altas, bajas y cambios. |
| Medición | Medidores, rutas, lecturas, validación de consumos, telemedición y prepago. |
| Facturación | Tarifas, ciclos, lotes, comprobantes, distribución y fiscal. |
| Cobranza | Cuenta corriente, caja, entes, débitos, pasarelas y conciliación. |
| Mora | Instancias, intereses, cortes y reconexiones, convenios y gestión judicial. |
| Atención | Solicitudes, reclamos, consultas, mesa de entradas, turnero, canales y asistente virtual. |
| Técnica | Agenda, órdenes de trabajo, cuadrillas, redes y mapas, obras, aprovisionamiento y telefonía. |
| Ventas | Presupuestos, ventas y punto de venta de mostrador. |
| Administración | Compras y proveedores, stock y bienes de uso, tesorería y contabilidad. |
| Personal | Legajos, liquidaciones y portal del empleado. |
| Institucional | Asociados, capital social, asambleas, consejo e informes al organismo de control cooperativo. |
| Servicios sociales | Sepelio, cementerio, salud y ambulancias, banco de sangre, vivienda, flota y traslados. |
| Comunidad | Muro, novedades, encuestas, campañas, plantillas, audiencias y moderación. |
| Sitio y portal | Contenidos del sitio público y configuración del portal del socio. |
| Reportes | Catálogo de reportes, tableros, exportaciones e inteligencia de negocio. |
| Configuración | Parámetros, tablas maestras, geografía, vocabulario, marca, circuitos, integraciones, usuarios, roles y auditoría. |

Un buscador "Mapa del sitio" permite encontrar cualquier pantalla por su nombre. Cada pantalla incluye una ayuda que explica qué hace, quién la usa, cuándo, dónde, por qué y cómo.

Elementos comunes de todas las pantallas del sistema de gestión:

- **Barra superior** con el logo de la cooperativa, el selector de contexto de trabajo (sucursal, punto de venta o caja), el buscador, el mapa del sitio, los accesos fijados, las notificaciones y el menú del usuario.
- **Menú lateral** generado a partir de los permisos del usuario: el menú, el mapa del sitio y el editor de roles usan la misma definición, por lo que nunca aparece una opción que el usuario no puede usar.
- **Encabezado fijo** de cada pantalla con título, subtítulo y acciones principales.
- **Listados** con filtros, orden, columnas configurables, exportación y vistas guardadas.
- **Altas y modificaciones en ventanas emergentes** e importaciones guiadas desde planillas con vista previa y validación fila por fila.
- **Historial de cambios** de cada registro, con autor, fecha y valores anterior y nuevo.

### 7.2 Navegación de la aplicación del socio

La aplicación del socio se organiza en una barra inferior de cinco posiciones: **Inicio** (saldo, próximo vencimiento, alertas y novedades), **Cuentas y servicios**, un **botón central "+"**, **Gestiones** (reclamos, solicitudes y turnos) y **Comunidad**. El botón central ofrece la acción principal de cada pantalla: por defecto **Pagar**; en Gestiones, "Nueva gestión"; en Servicios, "Contratar"; en Cuentas, "Vincular cuenta". El **Perfil** se abre desde la imagen del usuario en la parte superior. La cooperativa puede reemplazar Comunidad por otra sección si no usa el muro.

*Corrección de la versión 2.0: la versión 1.0 enumeraba seis secciones (Inicio, Cuentas y servicios, Pagar, Gestiones, Comunidad y Perfil); se alinea con la barra de cinco posiciones, con Pagar como acción del botón central y Perfil desde la parte superior.*

Además, la aplicación muestra avisos destacados en la parte superior cuando corresponde: trabajo sin conexión, interrupciones del servicio programadas en la zona del socio y deuda vencida.

### 7.3 Navegación de la aplicación de campo

La aplicación de campo se organiza en cinco secciones: **Hoy** (agenda), **Órdenes, Rutas o Cobranza** según el rol, **Nuevo** (registro rápido según el contexto), **Stock en el vehículo** y **Sincronización**.

La aplicación guarda en el dispositivo el trabajo del día y todo lo que el técnico, lecturista o cobrador registra sin conexión. Al recuperar la señal, envía los registros en orden y sin duplicarlos; si alguien modificó lo mismo en la oficina, muestra el conflicto para resolverlo, sin perder ninguno de los dos datos.

### 7.4 Canales de comunicación con el socio

El socio puede comunicarse con la cooperativa y recibir avisos por los siguientes canales, según los que la cooperativa habilite: aplicación del socio y sitio público, WhatsApp, correo electrónico, SMS, notificaciones en el celular, chat web, teléfono, redes sociales, ventanilla y mesa de entradas, tótem de autogestión y la propia factura impresa. Todas las interacciones quedan en el historial único de la persona, cualquiera sea el canal.

---

## 8. Usuarios y roles

El sistema distingue cuatro grandes grupos de usuarios: el equipo de la plataforma, el personal de cada cooperativa, la comunidad de la cooperativa y los dispositivos o sistemas que operan en forma automática.

Los roles de la cooperativa y de la comunidad se entregan como **modelos predefinidos** que cada cooperativa puede usar tal cual, copiar y ajustar a su organización. Los nombres visibles de cada rol pueden adaptarse al vocabulario de la cooperativa. Un mismo usuario puede tener varios roles, y una misma persona puede, por ejemplo, ser empleada de una cooperativa y socia de otra con una única identidad de acceso.

Los modelos predefinidos los mantiene la plataforma y no se modifican directamente: la cooperativa los copia y ajusta, o crea roles propios. Un rol que deja de usarse se retira sin borrarse, de modo que su historial se conserva. Cada persona usa su propio usuario; no existen usuarios genéricos compartidos (por ejemplo, "caja1").

Cuando una persona es a la vez empleada y socia de la misma cooperativa, tiene dos espacios separados que alterna en forma explícita: como empleada no ve "Mis cuentas" y como socia no ve el sistema de gestión. Si desde su función de personal necesita operar sobre registros propios (por ejemplo, una bonificación en su propia cuenta), la acción requiere la intervención de otro usuario.

### 8.1 Equipo de la plataforma

Ningún rol de la plataforma accede a los datos operativos de las cooperativas por el solo hecho de tenerlo: solo puede hacerlo mediante un acceso de soporte temporal y auditado (sección 9.6). El doble factor es obligatorio para todo el equipo de la plataforma.

| Rol | Funciones | Doble factor |
|---|---|---|
| Superadministrador de plataforma | Administra cooperativas, licencias, roles modelo, usuarios de la plataforma y situaciones de emergencia. Existen al menos dos personas con este rol. | Obligatorio, sin SMS. |
| Administrador de operaciones | Realiza el alta asistida de cooperativas, la configuración inicial, la copia de configuraciones de servicios y las migraciones, sobre las cooperativas que tiene asignadas. | Obligatorio, sin SMS. |
| Comercial de plataforma | Gestiona contratos de servicio, paquetes y licencias, sin acceso a datos operativos de las cooperativas. | Obligatorio. |
| Aprobador comercial o dirección | Aprueba contratos y licencias y decide el paso de una cooperativa a operación, su suspensión o su cierre. | Obligatorio. |
| Responsable de catálogo de producto | Mantiene el catálogo de módulos que se ofrecen y la composición de los paquetes. | Obligatorio. |
| Finanzas de plataforma | Consulta contratos y consumos y prepara la facturación del servicio a las cooperativas, sin datos operativos. | Obligatorio. |
| Soporte de primer nivel | Atiende consultas y diagnostica sin acceder a datos; solicita acceso temporal en modo observación cuando es necesario. | Obligatorio. |
| Soporte de segundo nivel | Accede en forma temporal, acotada y aprobada, en modo observación u operación. Puede reintentar o cancelar procesos automáticos detenidos. | Obligatorio, sin SMS. |
| Seguridad y auditoría | Supervisa la auditoría global, las alertas, los incidentes y la revisión periódica de accesos. Actúa como segundo aprobador en accesos de emergencia y restauraciones. | Obligatorio, sin SMS. |
| Responsable de privacidad de la plataforma | Mantiene el registro de subencargados y los modelos de registro de tratamientos, sin acceso a datos de los titulares. | Obligatorio. |
| Operaciones técnicas | Supervisa la salud del servicio, los procesos automáticos, los ambientes y las copias de seguridad, sin acceso a datos operativos. | Obligatorio, sin SMS. |

### 8.2 Personal de la cooperativa

El doble factor es obligatorio para los roles marcados como "Obligatorio" y para cualquier usuario que tenga permisos sensibles (por ejemplo, anular, aprobar o mover dinero). En los roles marcados "Según política", la cooperativa decide si lo exige.

| Rol | Funciones | Doble factor |
|---|---|---|
| Administrador de la cooperativa | Configura el sistema, los usuarios, los roles, los perfiles de pantallas, las políticas y la publicación de servicios y contenidos. Aprueba los accesos de soporte de la plataforma. | Obligatorio, sin SMS. |
| Administrador de usuarios y seguridad | Da de alta y de baja usuarios y asigna roles, sin operar el negocio. Rol opcional. | Obligatorio, sin SMS. |
| Gerente | Consulta tableros, aprueba operaciones de alto nivel y tiene lectura general. | Obligatorio. |
| Facturación | Gestiona ciclos, lotes, comprobantes, notas de crédito y débito, y propone cambios de tarifas. | Obligatorio. |
| Cajero | Opera la caja de su turno: cobros, arqueo, cierre y ventas de mostrador. | Según política. |
| Cobrador | Realiza la cobranza domiciliaria de su cartera y rinde lo cobrado. | Según política. |
| Tesorero | Administra bancos, valores, conciliaciones, pagos y pasarelas. | Obligatorio. |
| Contador | Administra el plan de cuentas, los asientos, los cierres, la información fiscal y los regímenes informativos. | Obligatorio. |
| Compras | Gestiona solicitudes, cotizaciones, órdenes de compra y proveedores. | Obligatorio. |
| Depósito | Administra stock, remitos, equipos con número de serie y devoluciones a proveedores. | Según política. |
| Técnico | Ejecuta las órdenes asignadas: instalaciones, cortes, reconexiones, reparaciones, con fotos, firma y trabajo sin conexión. | Según política. |
| Lecturista | Recorre las rutas asignadas y registra lecturas, aun sin conexión. | Según política. |
| Supervisor técnico | Organiza agenda y cuadrillas, dictamina factibilidades, administra redes y mapas y controla el aprovisionamiento. | Obligatorio. |
| Supervisor de consumos | Valida y corrige con justificación los consumos antes de facturar. | Obligatorio. |
| Atención al socio | Atiende personas, registra solicitudes y reclamos, arma convenios y realiza ventas de mostrador. Registra también los pedidos de acceso, rectificación o supresión de datos que el titular presenta en forma presencial, telefónica o por correo. | Según política. |
| Supervisor de atención | Asigna y deriva gestiones, controla plazos, escala casos y autoriza excepciones de atención. | Obligatorio. |
| Recursos humanos y liquidación | Gestiona legajos, novedades, liquidaciones de sueldos y recibos. | Obligatorio. |
| Secretaría institucional | Administra asociados, capital social, asambleas y actas. | Obligatorio. |
| Editor y moderador de comunidad | Publica en el muro y en novedades, gestiona encuestas y modera comentarios. Solo envía comunicaciones dentro de su propio alcance (por ejemplo, a una zona). | Según política. |
| Servicios sociales y salud | Opera sepelio, cementerio, vivienda, ambulancias y banco de sangre, con acceso a datos sensibles protegidos. | Obligatorio. |
| Responsable de protección de datos personales | Mantiene el registro de tratamientos, los avisos de privacidad, los consentimientos, los plazos de conservación y los bloqueos legales, y aprueba las respuestas a las solicitudes de los titulares. Solo accede a datos de una persona dentro de una solicitud o tarea asignada. | Obligatorio. |
| Consejero | Consulta información institucional y agregada y participa de las votaciones del consejo. Por defecto ve tableros con datos agregados, sin datos personales, y aprueba actas. | Obligatorio. |
| Síndico o auditor | Tiene lectura amplia y acceso a la auditoría, sin posibilidad de modificar información. Por defecto no ve datos de salud ni legajos individuales, salvo pedido justificado mediante un acceso temporal aprobado por el administrador. | Obligatorio. |

Cualquier usuario del personal puede registrar una incidencia ante el soporte de la plataforma si el administrador le asigna ese permiso; las incidencias de plataforma no se mezclan con los reclamos de los socios.

### 8.3 Comunidad de la cooperativa

Para la comunidad, el doble factor es opcional, pero el sistema exige una verificación reforzada antes de las acciones sensibles: baja de un servicio, cambio de titularidad, alta de un representante, cambio del medio de pago, cambio de correo o teléfono y firma de documentos.

| Rol | Funciones |
|---|---|
| Socio titular | Autogestiona sus cuentas, servicios, pagos, reclamos y solicitudes, y participa de la comunidad. Ve su condición de asociado, su capital y las asambleas, y gestiona sus propios representantes. |
| Representante o autorizado | Actúa en nombre de un titular, solo en las acciones autorizadas y mientras la autorización esté vigente. Cada acción queda registrada con quién actuó y en nombre de quién. |
| Adherente o integrante del grupo familiar | Consulta en forma limitada los servicios sociales que lo incluyen. |
| Visitante registrado | Lee noticias, solicita el alta de servicios, realiza consultas públicas y vincula sus cuentas. Hasta vincular una cuenta no ve facturas ni datos de ninguna cuenta. |
| Empleado en el portal | Consulta y firma sus recibos de sueldo, solicita vacaciones y licencias y recibe novedades del área de personal. La cooperativa puede crear este acceso en forma automática para cada empleado con legajo activo y correo registrado; tras la baja laboral, conserva el acceso a sus recibos durante el plazo que fije la cooperativa (un año por defecto). |
| Proveedor | Ingresa solo por invitación individual de la cooperativa: consulta sus órdenes de compra, carga facturas y remitos y sigue el estado de sus pagos y retenciones. Cambiar sus datos bancarios exige verificación reforzada. |

### 8.4 Dispositivos y sistemas

| Rol | Funciones |
|---|---|
| Procesos automáticos del sistema | Ejecutan tareas programadas (facturación masiva, envíos, conciliaciones) con permisos propios y acotados. La auditoría registra el proceso que actuó y la persona que lo inició o aprobó (por ejemplo, quien aprobó un lote de facturación). |
| Usuario de canal | Identidad técnica con la que se registran las operaciones originadas en el portal del socio y en las pasarelas de pago, con una caja técnica propia. Cada cobro muestra el canal y el socio que pagó. |
| Sistema externo integrado | Accede a la interfaz de integración solo a los recursos autorizados por la cooperativa. Cada sistema tiene un responsable y una finalidad declarados, una credencial que se muestra una sola vez, vence como máximo a los doce meses, se renueva sin interrumpir el servicio y se revoca en menos de un minuto. |
| Asistente virtual e inteligencia artificial | Opera con permisos mínimos propios o en nombre de un usuario, nunca con más permisos que ese usuario. Nunca recibe permisos sensibles. |
| Tótem, kiosco o pantalla de turnero | Realiza operaciones públicas de autogestión presencial; salir del modo kiosco requiere la autenticación de personal autorizado. Cada equipo se registra como dispositivo de la cooperativa y su acceso puede revocarse; no existe una clave fija de cierre. |
| Agente de equipamiento local | Conecta impresoras fiscales, lectores, balanzas y pantallas del puesto, con una credencial propia del dispositivo: un certificado individual, vinculado a la cooperativa y a la sucursal, que se renueva en forma automática y puede revocarse desde el sistema de gestión (sección 12.2). |

### 8.5 Cómo se determina lo que cada usuario puede hacer

Lo que un usuario puede ver y hacer resulta de la combinación de cuatro filtros, todos verificados por el sistema en cada operación:

1. **Licencia**: el módulo debe estar contratado por la cooperativa.
2. **Activación**: la cooperativa debe haber activado el módulo.
3. **Rol**: el usuario debe tener el permiso para esa acción (ver, crear, editar, anular, aprobar, exportar, configurar y acciones propias de cada módulo).
4. **Alcance de datos**: el usuario opera solo sobre los datos que le corresponden: toda la cooperativa, determinadas sucursales, puntos de venta, zonas, servicios, cuadrillas, depósitos o solo sus propios registros.

A esto se agregan controles complementarios:

- **denegación por defecto**: lo que no está expresamente permitido está prohibido;
- **separación de funciones**: quien solicita no aprueba, quien aprueba no paga;
- **autorización de supervisor**, en el momento o diferida, para operaciones que superan el límite del usuario;
- **franja horaria** de operación por perfil;
- **explicador de permisos**: para cualquier usuario puede explicarse por qué una pantalla, un registro o una acción están habilitados o denegados.

Ocultar un botón no alcanza: los permisos se verifican en el servidor en cada operación, también en las integraciones con terceros.

**Roles y perfiles de pantallas.** El sistema separa dos conceptos: el **perfil de pantallas** determina qué menús y pantallas ve el usuario, en qué aplicaciones (sistema de gestión, aplicación del socio, espacio del empleado, aplicación de campo) y en qué franja horaria; el **rol** determina qué acciones puede ejecutar. Ver una pantalla no habilita por sí solo sus acciones, y tener un permiso no muestra una pantalla que el perfil no incluye. Las fichas que el usuario puede ver pero no modificar se abren en modo "Solo lectura".

**Ejemplos de permisos.** Los permisos son acciones concretas sobre cada función. Algunos ejemplos:

- ver la cuenta corriente de un socio, registrar un cobro, anular un recibo u otorgar un descuento;
- simular un lote de facturación, aprobarlo y emitir notas de crédito;
- editar un cuadro tarifario y publicarlo;
- capturar lecturas y validar consumos;
- ver datos sensibles (por ejemplo, datos de salud, CBU completos o salarios), que se muestran enmascarados a quien no tiene el permiso específico y cuya consulta queda registrada;
- exportar información, que exige un permiso propio en cada módulo.

**Ejemplos de alcance de datos.** Cada asignación de rol lleva su propio alcance, y el usuario puede tener varias:

- un cajero de la sucursal Centro que además atiende al público en la sucursal Norte cobra solo en Centro y atiende solo en Norte;
- un lecturista opera solo sobre la ruta que tiene asignada;
- un supervisor del servicio de agua no ve la información del banco de sangre;
- un empleado de depósito opera sobre el depósito central y sobre el stock de un vehículo determinado;
- un cobrador ve solo su cartera;
- un técnico ve solo las órdenes que tiene asignadas.

El alcance se aplica también a listados, búsquedas, reportes, exportaciones, descargas y notificaciones: un reporte exportado por el cajero de Centro no contiene cobros de Norte, y un editor de comunidad con alcance en una zona no puede enviar una comunicación a toda la base de socios.

**Regla de combinación.** Cuando un usuario tiene varios roles, recibe la suma de sus permisos, cada uno con el alcance de la asignación que lo otorga. Una **denegación explícita** en un rol o en una asignación prevalece siempre sobre cualquier concesión. Las asignaciones pueden tener vigencia: una asignación temporal (por ejemplo, el reemplazo de un compañero durante sus vacaciones) vence sola.

**Límites de importe.** Algunos permisos se limitan por importe en cada asignación. Por ejemplo, un cajero puede anular cobros hasta $ 50.000; para anular uno de $ 80.000 debe pedir la autorización de un supervisor con un límite suficiente.

**Autorización de supervisor.** Cuando un usuario intenta una acción que no tiene permitida o que excede su límite, su alcance o su franja horaria, puede pedir autorización a un supervisor:

- **en el momento**: el supervisor se identifica con su contraseña y su segundo factor en el mismo puesto, o aprueba desde su celular; la autorización vale para esa sola acción, con ese importe y ese destino, durante cinco minutos por defecto;
- **diferida**: la solicitud queda en la bandeja de los supervisores con permiso y alcance suficientes; si nadie la decide, vence en 24 horas por defecto, y una vez aprobada el solicitante tiene ocho horas para usarla.

Una autorización no amplía los permisos del solicitante; solo habilita esa ejecución puntual. El supervisor debe ser una persona distinta del solicitante, y el rechazo exige un motivo. Toda autorización queda en la auditoría con solicitante, aprobador, forma de identificación, acción, importe, motivo y resultado.

**Separación de funciones.** El sistema aplica dos tipos de controles:

- **sobre cada operación**, siempre bloqueante: quien crea o solicita un registro no puede aprobarlo, quien registra un cobro no aprueba su propia anulación, quien ejecutó un pago no lo concilia y quien capturó una lectura no aprueba su corrección;
- **sobre la combinación de roles**, con pares incompatibles predefinidos (por ejemplo, editar los datos bancarios de proveedores y ejecutar pagos; preparar y aprobar pagos; registrar cobros y aprobar rendiciones; calcular y aprobar liquidaciones de sueldos; editar y publicar cuadros tarifarios). Como las cooperativas pequeñas tienen pocas personas, por defecto el sistema advierte el conflicto y exige una excepción aprobada por otro usuario, con justificación, un control compensatorio (por ejemplo, una revisión mensual del síndico) y un vencimiento máximo de 180 días. La cooperativa puede configurar que el conflicto bloquee la asignación.

**Franja horaria.** Fuera de la franja de su perfil, el usuario puede ingresar al sistema, pero las pantallas de operación quedan bloqueadas; un supervisor puede autorizar una operación puntual. La franja se evalúa en la zona horaria de la cooperativa.

**Gobierno de los accesos.**

- Nadie puede asignarse roles ni ampliar su propio alcance, y solo se pueden delegar permisos que el delegante tiene, con un alcance igual o menor al propio.
- Los cambios de roles, perfiles, alcance o estado se aplican en menos de un minuto en todas las sesiones activas, incluso en la aplicación de campo al reconectarse.
- Cada seis meses, por defecto, el administrador o el gerente confirma o retira las asignaciones con permisos sensibles; las que no se confirman en plazo se suspenden.
- Los usuarios del personal que no ingresan durante 90 días se suspenden en forma automática, con aviso siete días antes; el administrador puede reactivarlos.
- La carga masiva de usuarios desde una planilla muestra una vista previa con errores y genera invitaciones, nunca contraseñas.

---

## 9. Formas de ingreso y seguridad del acceso

### 9.1 Identificación de la cooperativa

Cada cooperativa dispone de su propia dirección web, formada con su nombre, o se identifica ingresando su código antes del inicio de sesión. Tras el ingreso, el sistema determina la cooperativa a partir de la sesión del usuario y nunca a partir de datos que puedan manipularse desde el navegador.

- Además de la dirección provista por la plataforma, la cooperativa puede usar un dominio propio, previa verificación de titularidad y con su certificado de seguridad gestionado por la plataforma.
- Antes del inicio de sesión, la pantalla muestra el logo, los colores y las formas de ingreso habilitadas por la cooperativa, sin revelar nunca si un usuario existe.
- Un código de cooperativa inexistente recibe la misma respuesta genérica que cualquier otro error.
- Quien pertenece a varias cooperativas elige con cuál opera mediante un selector que muestra solo el logo y el nombre de cada una. Cambiar de cooperativa o de espacio (personal o socio) inicia un contexto nuevo: se recalculan los permisos y se descartan los datos visibles del contexto anterior.
- Una cooperativa nunca puede consultar ni deducir a qué otras cooperativas pertenece una persona.

### 9.2 Ingreso del personal

- **Usuario o correo y contraseña**, con contraseñas protegidas mediante algoritmos que no permiten recuperarlas. El nombre de usuario es único dentro de cada cooperativa; el correo es el identificador común de la persona en toda la plataforma.
- **Doble factor de autenticación**: código por correo electrónico, código por SMS, aplicación autenticadora en el celular, llaves de acceso del dispositivo (huella o reconocimiento facial) como opción, y códigos de recuperación de un solo uso. Es obligatorio para el personal con funciones sensibles y para todo el equipo de la plataforma. El SMS no se admite como segundo factor para el equipo de la plataforma, el administrador de la cooperativa ni el administrador de usuarios; las llaves de acceso se recomiendan especialmente para esos roles. Al asignar a un usuario un rol con permisos sensibles, el sistema le exige registrar su segundo factor en el siguiente ingreso, antes de operar.
- **Dispositivo confiable**: opción de no solicitar el segundo factor en un dispositivo conocido durante un período configurable (30 días como máximo y por defecto; la cooperativa puede deshabilitarlo), revocable por el usuario y por el administrador. Se revoca también al cambiar la contraseña o los factores, y no está disponible para el equipo de la plataforma.
- **Ingreso con la cuenta corporativa** de la cooperativa (por ejemplo, Microsoft o Google Workspace), configurable por el administrador, con dominios permitidos y solo para usuarios previamente invitados. Ingresar con una cuenta corporativa no reemplaza el segundo factor, salvo que el proveedor de la cooperativa informe que ya lo exigió y la cooperativa lo acepte expresamente.
- **Invitación por correo**: el administrador invita al usuario, que acepta y crea su acceso; la invitación vence en un plazo configurable (72 horas por defecto). Reenviar una invitación anula la anterior.
- **Contexto de trabajo**: al ingresar, el usuario elige la sucursal, el punto de venta o la caja con la que opera, dentro de los que tiene permitidos. El sistema propone valores por defecto por usuario y por puesto, y el contexto puede cambiarse desde la barra superior.
- **Al ingresar**, cada usuario llega a la pantalla de inicio que corresponde a su rol (por ejemplo, la agenda del día para un técnico o la ruta para un lecturista).

**Política de contraseñas.** Sigue las recomendaciones internacionales vigentes para la autenticación digital:

- longitud mínima de 12 caracteres para el personal y de 10 caracteres para los socios; la cooperativa puede exigir más, pero no menos;
- longitud máxima admitida de 128 caracteres, de modo que se pueden usar frases completas como contraseña;
- sin reglas arbitrarias de composición (no se obliga a combinar mayúsculas, números y símbolos) y sin cambios periódicos obligatorios;
- bloqueo de contraseñas conocidas como comprometidas en filtraciones públicas y de palabras propias de la cooperativa (por ejemplo, su nombre o su localidad) o del usuario; por ejemplo, "Cooperativa2026" se rechaza y una frase de cuatro palabras se acepta;
- medidor de fortaleza visible al crearla o cambiarla;
- las contraseñas del sistema actual de la cooperativa no se trasladan: cada usuario crea la suya al aceptar la invitación.

**Recuperación del acceso.**

- La recuperación de contraseña usa un enlace de un solo uso y vigencia corta, pide el segundo factor si el usuario lo tiene registrado y nunca desactiva el doble factor.
- Al cambiar la contraseña, el sistema avisa al usuario y, por defecto, cierra sus demás sesiones.
- Si una persona pierde su segundo factor, puede usar uno de sus diez códigos de recuperación. Si tampoco los tiene, el administrador puede restablecer el acceso mediante un procedimiento reforzado: verifica la identidad con evidencia, el sistema aplica un período de espera (24 horas por defecto) y avisa a todos los medios de contacto registrados. Un correo o un pedido al soporte no alcanzan.

### 9.3 Ingreso del socio

- **Documento o CUIT y contraseña**: el socio ingresa con su número de documento o de CUIT, sin puntos ni guiones, y su contraseña, dentro de la cooperativa elegida. La cooperativa puede habilitar también el ingreso con correo electrónico. Bajo el campo se muestra la ayuda de formato.
- **Ingreso sin contraseña** mediante un código de seis dígitos enviado por correo o SMS, habilitable por cada cooperativa. El código vence a los diez minutos, admite cinco intentos y solo puede reenviarse tras un minuto de espera. No se usan enlaces de ingreso por correo.
- **Ingreso con Google**, con vinculación explícita y segura; el sistema nunca asocia cuentas solo por coincidir el correo. El primer ingreso con Google pide iniciar sesión con la cuenta existente o completar la vinculación con una prueba.
- **Ciudadano Digital de Córdoba (CiDi)**, habilitable por cada cooperativa, exigiendo un nivel de verificación de identidad suficiente para vincular cuentas (nivel 2 como mínimo). El vínculo se crea solo si el CUIL informado por CiDi coincide con el documento de una persona de la cooperativa y el socio lo confirma con un factor adicional o ya tiene una sesión iniciada.
- **Segundo factor opcional** para el socio, con verificación reforzada obligatoria para acciones sensibles (por ejemplo, cambiar datos de pago o firmar).
- **Recordarme**: el socio elige si la sesión se mantiene en ese dispositivo o termina al cerrar el navegador.
- Al ingresar, la aplicación lleva al socio a la pantalla que corresponde a su situación (por ejemplo, con un aviso destacado si tiene deuda vencida o un servicio suspendido) y le ofrece instalar la aplicación en su celular.

### 9.4 Vinculación del socio con sus cuentas

Registrarse no da acceso automático a ninguna cuenta. Para ver y operar sus cuentas y servicios, el socio debe vincularlas mediante una verificación suficiente, a elección de la cooperativa:

- código impreso en una factura más su número de documento;
- código enviado al correo o teléfono ya registrado en la cooperativa;
- validación presencial en la oficina.

Los intentos de vinculación son limitados: por defecto, la factura usada como prueba debe tener como máximo seis meses de antigüedad y, tras tres intentos fallidos, la vinculación se bloquea durante 24 horas. Los usuarios del portal del socio anterior se incorporan sin volver a registrarse y con sus cuentas ya vinculadas; por seguridad, sus contraseñas anteriores no se trasladan y cada usuario crea una nueva mediante una invitación de activación. Las representaciones (familiares, apoderados, administradores de consorcios, autorizados) se otorgan con vigencia, alcance por acción y evidencia.

- Compartir un domicilio nunca habilita la vinculación de una cuenta: por ejemplo, dos hermanos que viven en la misma casa ven cada uno solo sus propias cuentas.
- Pagar la factura de otra persona no da acceso a sus otros servicios ni a su historial.
- Al revocarse una representación, el representante pierde de inmediato el acceso futuro a esa cuenta.
- Cada acción realizada en nombre de otro queda registrada con quién actuó y en nombre de qué titular.

### 9.5 Protección de las sesiones

- Sesiones de corta duración que se renuevan en forma segura, con detección de uso indebido. La credencial de trabajo dura 15 minutos y se renueva en forma automática; con la opción "Recordarme", la sesión puede mantenerse hasta 30 días de uso continuado y hasta 60 días como máximo absoluto (la cooperativa puede ampliar este máximo hasta 90). Para los administradores, la sesión dura como máximo 12 horas. Si alguien intenta reutilizar una credencial de renovación ya usada, el sistema cierra todas las sesiones relacionadas y emite una alerta de seguridad.
- Bloqueo por inactividad configurable, sin perder el trabajo en curso. Por defecto, el sistema de gestión y el espacio del personal se bloquean a los 30 minutos sin actividad (la cooperativa puede fijar entre 5 y 120 minutos); para desbloquear se pide la contraseña o el segundo factor. Los formularios largos guardan un borrador en forma automática, de modo que una recarga o una sesión vencida no hacen perder lo cargado.
- Listado de sesiones activas con posibilidad de cerrarlas individualmente o en todos los dispositivos. El listado muestra el dispositivo, la ubicación aproximada y el último uso. El administrador puede ver y cerrar las sesiones de los usuarios de su cooperativa.
- Verificación reforzada antes de acciones sensibles. Si el último segundo factor tiene más de diez minutos (la cooperativa puede fijar hasta quince), el sistema lo vuelve a pedir.
- Límite de intentos en ingreso, códigos, recuperación, registro y consultas públicas, con verificación adicional ante comportamientos automatizados. Cinco intentos fallidos en 15 minutos bloquean temporalmente el usuario durante 15 minutos (valores ajustables por la cooperativa dentro de márgenes seguros); el desbloqueo se produce por tiempo, por recuperación o por el administrador, y el usuario recibe un aviso. Tras tres intentos fallidos se agrega un desafío contra programas automáticos.
- Recuperación de contraseña que no revela si una cuenta existe. Los errores de credenciales son siempre genéricos ("usuario o contraseña incorrectos"), mientras que los errores de formato se explican (por ejemplo, "el documento va sin puntos").
- Aplicación de cambios de permisos en menos de un minuto en todas las sesiones activas.
- Al finalizar la relación laboral de un empleado se revocan automáticamente sus accesos de personal, conservando su acceso como socio si corresponde. Se revocan también sus sesiones, sus dispositivos confiables y su trabajo pendiente de sincronizar en la aplicación de campo, y las credenciales de integración de las que era responsable se reasignan.
- Las credenciales de sesión nunca se guardan en el almacenamiento del navegador accesible a otros programas, y la aplicación de campo borra los datos locales al cerrar la sesión o cuando el servidor la revoca.
- La hora de toda operación la fija el servidor; la hora del dispositivo del usuario nunca se usa para la auditoría ni para las sesiones.

### 9.6 Acceso de soporte

El equipo de soporte de la plataforma no accede a los datos de la cooperativa salvo mediante un **acceso temporal, consentido, acotado y auditado**, en modo observación u operación, que la cooperativa puede ver y revocar.

- **Solicitud**: cada acceso se vincula a una incidencia registrada y declara el modo, las funciones y los datos mínimos necesarios, la justificación y el vencimiento (ocho horas como máximo).
- **Modo observación**: solo permite consultar, con los datos personales enmascarados por defecto. Si no involucra datos personales, lo aprueba la plataforma y se avisa a la cooperativa.
- **Modo operación o configuración**: permite realizar únicamente las acciones autorizadas y requiere la aprobación del administrador de la cooperativa.
- **Trazabilidad**: cada acción realizada durante el acceso queda registrada con la identidad del agente de soporte y de la cooperativa. No se comparten contraseñas ni se actúa en nombre de un usuario sin dejar rastro.
- **Control de la cooperativa**: el administrador ve en todo momento los accesos vigentes y pasados y cada actuación realizada, y puede revocar un acceso activo; al vencer o revocarse, el acceso deja de funcionar en menos de un minuto.
- **Acceso de emergencia**: ante un incidente crítico declarado, el superadministrador puede acceder sin la aprobación previa de la cooperativa solo con la doble aprobación de soporte de segundo nivel y de seguridad de la plataforma, por un máximo de cuatro horas. El administrador de la cooperativa recibe el aviso en menos de un minuto y el acceso tiene revisión posterior obligatoria.
- **Diagnóstico sin datos**: el soporte cuenta con herramientas de seguimiento de cada operación que no muestran datos personales, de modo que la mayor parte de las consultas técnicas se resuelve sin solicitar acceso.
- Para la infraestructura de la plataforma rige un procedimiento de emergencia equivalente: doble aprobación, sesión grabada, vigencia máxima de cuatro horas y revisión posterior dentro de los cinco días hábiles.

### 9.7 Auditoría

El sistema registra en forma inmutable los cambios (con el valor anterior y el nuevo), los ingresos y egresos, las lecturas de datos sensibles, las exportaciones, los mensajes enviados, las autorizaciones y las acciones de la inteligencia artificial. Nunca se registran contraseñas, códigos ni credenciales.

- **Cambios**: cada cambio de datos, configuración, reglas, roles o permisos registra quién lo hizo (persona o proceso automático, y quién lo inició), cuándo, desde qué canal, sobre qué registro, el valor anterior y el nuevo, el motivo y la autorización si la hubo. Un cambio que no puede registrarse en la auditoría no se confirma.
- **Intentos denegados**: también se registran los intentos de operaciones sin permiso y los rechazos sobre operaciones sensibles, diferenciados de los cambios confirmados.
- **Accesos**: ingresos correctos y fallidos, uso del segundo factor, cierres de sesión, bloqueos y desbloqueos, cambios de contraseña y de factores, dispositivos confiables, cambios de cooperativa o de espacio y accesos de soporte, con dirección de red, dispositivo y ubicación aproximada.
- **Lecturas sensibles**: consulta de datos de salud, datos bancarios completos y documentos de identidad, legajos, exportaciones (con filtros, cantidad de filas y huella del archivo), descargas masivas y búsquedas amplias de personas.
- **Mensajes**: cada correo, SMS, WhatsApp o notificación con su destinatario enmascarado, plantilla, motivo, estado de entrega y respuesta del proveedor.
- **Inteligencia artificial**: cada uso con su función, la sugerencia emitida y la decisión de la persona (aceptada, editada o rechazada).
- **Inmutabilidad verificable**: los registros no se modifican ni se borran; están encadenados de modo que cualquier alteración se detecta en la verificación diaria y genera una alerta. Revertir un cambio es una operación nueva, también auditada.
- **Consulta**: la auditoría se consulta con permiso, con filtros por registro, persona, fecha, operación, módulo y resultado, y cada ficha ofrece su propio historial (por ejemplo, el historial de una tarifa muestra que un valor pasó de 30 a 20, quién lo cambió y cuándo).
- **Alertas de seguridad**: ráfagas de intentos fallidos, ingresos desde un país inusual, reutilización de credenciales, accesos de emergencia, desactivación del doble factor, exportaciones masivas y fallas en la verificación de la auditoría generan alertas para seguridad de la plataforma y para el administrador de la cooperativa.
- **Edición simultánea**: si dos usuarios editan la misma ficha, el sistema avisa que otra persona la está editando y, al guardar, el segundo recibe un aviso de conflicto con las diferencias, en lugar de sobrescribir el trabajo del primero.
- **Auditoría del sistema actual**: los registros de auditoría del sistema actual de la cooperativa se incorporan como histórico de solo lectura, con acceso restringido.

---

## 10. Módulos funcionales

Cada módulo es responsable de un conjunto de información y la comparte con los demás. Lo que un módulo registra está disponible de inmediato para los otros, sin duplicar datos ni procesos.

### 10.1 Personas, titulares y cuentas

**Propósito**: mantener una identidad única y consistente de cada persona física o jurídica y de todas sus relaciones con la cooperativa (titularidad, cuentas, domicilios, inmuebles, representaciones y documentación), como fuente única de datos que usan todos los demás módulos y la aplicación del socio.

**Funciones principales**

**Personas e identificación**

- Alta, modificación, fallecimiento y archivo de personas, con documento, CUIT o CUIL, verificación del CUIT contra el padrón fiscal, contactos, preferencias y consentimientos.
- Búsqueda de coincidencias antes de crear una persona (documento, CUIT o CUIL, nombre aproximado, fecha de nacimiento, contacto y domicilio), para que cada persona se registre una sola vez y se reutilice en todos sus servicios, cuentas e inmuebles.
- Datos propios de las personas humanas (apellidos, nombres, sexo registral, nacimiento, estado civil, ocupación y nacionalidad) y de las personas jurídicas (razón social, nombre de fantasía, tipo de organización y fecha de constitución), además de datos laborales y de los campos adicionales que defina la cooperativa.
- Varias identificaciones por persona (DNI, CUIT, CUIL, pasaporte, cédula extranjera y otras), con control del dígito verificador del CUIT y del CUIL al momento de la carga e historial de cada verificación realizada.
- Captura asistida de los datos del DNI mediante lector de código de barras o cámara, que el operador confirma antes de guardar.
- Registro del fallecimiento con fecha y evidencia, que genera las tareas pendientes (baja del titular, transferencia de servicios, cambio de garante) sin cortar ningún servicio; puede revertirse con aprobación si se registró por error.
- Datos sensibles (electrodependencia, datos de salud, aptitud de donante) guardados por separado, visibles solo con un permiso específico y excluidos de exportaciones e informes generales.
- Registro de profesionales instaladores matriculados, con matrícula, certificado y vencimiento, para asignarlos a los servicios que los requieren.

**Titulares y cuentas**

- Titulares con número único por cooperativa, estado, alta, baja con causa, reactivación y garante.
- Numeración automática y única de titulares; la carga manual del número se admite solo al migrar los datos del sistema actual de la cooperativa, para conservar la numeración existente.
- Estados del titular (solicitante, activo y dado de baja); la reactivación agrega un período nuevo sin borrar la baja anterior.
- Vínculo de asociado (número, estado y fecha de ingreso) que se muestra desde el módulo institucional: ser titular de servicios y ser asociado son condiciones independientes.
- Cuentas del titular con domicilio postal, condición frente al IVA, datos de Ingresos Brutos, forma de entrega de la factura, zona y recorrido de reparto.
- Una cuenta principal por titular, contactos propios de cada cuenta para facturas y avisos, número de ficha, distrito y sección, grupo contable y empresa postal, cada dato exigible según la política de la cooperativa.
- Estructura de la cuenta en árbol: cuenta, grupos de facturación y servicios contratados, con su estado y categoría.
- Marcas de la cuenta que usan otros módulos: factura electrónica (con confirmación para quitarla), no facturar, excluir del redondeo, no cobrar recargo (con autorización) y adhesión al débito automático, que se gestiona en cobranza.
- Impresiones desde la ficha con plantillas de la cooperativa: ficha del titular y de la cuenta, contrato, fianza, solicitud de alta o baja y estado de deuda.

**Domicilios, inmuebles y puntos de prestación**

- Domicilios normalizados contra el catálogo nacional de calles, con ubicación en el mapa confirmada, aproximada o pendiente.
- Domicilios por rol (real, fiscal informado por ARCA, postal y laboral), con el texto original conservado, domicilios rurales sin número (ruta, kilómetro, paraje, lote) e historial de cada corrección de ubicación.
- Alternativa accesible al mapa (carga por texto, referencias y teclado); si el proveedor de mapas no responde, el domicilio se guarda igual y la ubicación se completa después.
- Inmuebles con datos catastrales, unidades funcionales, uso, propietarios y ocupantes.
- Nomenclatura catastral de seis partes con nombres configurables, búsqueda por nomenclatura, partida, domicilio o persona, y control que impide duplicar una misma parcela.
- Puntos de prestación que pueden alojar varios servicios, incluso de distintos titulares.

**Relaciones y representaciones**

- Relaciones entre personas: representaciones, autorizaciones, apoderamientos, garantías y responsables, con vigencia y evidencia.
- Alcance por acción de cada autorización (consultar, pagar, solicitar gestiones, solicitar la baja, actualizar datos, recibir avisos), con verificación por un supervisor de los poderes y de las representaciones de organizaciones, y vencimiento automático con aviso previo.
- Registro, en cada gestión hecha en nombre de otra persona, de quién actuó, por quién y con qué relación.

**Notas, bloqueos y documentación**

- Observaciones con historial, bloqueos con efectos explícitos, requisitos documentales y documentación con vencimiento.
- Notas con visibilidad interna, para caja o para el portal; las notas automáticas del sistema (cuenta creada, alta o baja de servicio, recategorización, transferencia) no se pueden editar.
- Bloqueos con efectos concretos elegidos de una lista (cobro en caja, pago en línea, facturación, nuevas contrataciones, baja, transferencia, reconexión, modificación de datos), con causa, mensaje para caja, vigencia y levantamiento automático al vencer.
- Requisitos documentales configurables con días de vigencia y acciones automáticas al presentarse o al vencer (crear una tarea, aplicar o levantar un bloqueo, quitar un beneficio, avisar).

**Transferencias y cambios de titular**

- Transferencias de cuenta, cambios de titularidad y mudanzas, con simulación previa, aprobación y posibilidad de reversión.
- Simulación que muestra todos los efectos antes de confirmar: deuda que permanece en el titular anterior, cargos por transferencia, cambios de Ingresos Brutos, débitos automáticos, grupo de facturación, relaciones y bloqueos.
- Transferencia por sucesión con la documentación que defina la cooperativa, cambio del responsable de pago sin cambiar al titular e inicio de la transferencia de capital social, que ejecuta el módulo institucional.
- Registro de transferencias consultable, con constancia reimprimible.
- Historia completa: cambiar de titular nunca reescribe el pasado; cada cargo conserva quién era el titular cuando se generó.

**Ficha, búsqueda, duplicados y privacidad**

- **Ficha integral del socio**: en una sola pantalla, todo lo que la persona tiene con la cooperativa (servicios, saldo, facturas, gestiones, órdenes técnicas, capital social, servicios sociales).
- Búsqueda de titulares por nombre, documento, CUIT, número de titular, cuenta, calle, domicilio del servicio, matrícula, medidor, teléfono o correo, con columnas configurables y vistas guardadas.
- Línea de tiempo con fecha efectiva y fecha de registro de cada cambio, y consulta de cómo estaban los datos a una fecha determinada.
- Detección de posibles duplicados y fusión solo con autorización.
- Gestión de privacidad: solicitudes de acceso, rectificación, actualización y supresión de datos, y anonimización compatible con la conservación obligatoria.
- Vinculación del usuario de la aplicación del socio con sus cuentas mediante verificación (código de la factura y documento, código enviado al contacto ya registrado o validación presencial), nunca por simple coincidencia de nombre, documento o correo.
- Padrón, informes, etiquetas y exportaciones, con filtros guardados, credenciales y registro de quién exportó qué información.
- Importación masiva de personas, titulares, cuentas e inmuebles desde planilla, con vista previa de errores, y correcciones especiales (renumerar, corregir una fecha de alta) con permiso propio, motivo y aprobación.

**Reglas que aplica el sistema**

- Cada persona existe una sola vez en la cooperativa: un mismo documento no puede repetirse, salvo excepción aprobada y registrada con motivo. Los padrones de cooperativas distintas nunca se cruzan ni se fusionan.
- El CUIT se exige recién cuando la condición frente al IVA de la cuenta lo requiere, al habilitar la contratación o al emitir; registrarse no lo exige. El CUIL calculado a partir del DNI se propone como "no verificado" y no se usa con fines fiscales hasta verificarlo, y la consulta al padrón de ARCA advierte diferencias sin modificar datos automáticamente.
- Una cuenta pertenece a un solo titular y no agrupa servicios de titulares distintos. Un mismo domicilio o inmueble puede tener varios servicios, incluso del mismo tipo y de titulares distintos, y compartir domicilio no habilita a ver datos, facturas ni deudas ajenas.
- Cambiar el titular no traslada la deuda: queda en el titular anterior, y el nuevo solo la asume mediante un convenio expreso. Ante deuda de otras cuentas en el mismo domicilio o parcela, el sistema advierte sin revelar el detalle y puede pedir autorización, pero nunca bloquea ni traslada esa deuda.
- No se da de baja a un titular con servicios activos ni, si la política lo indica, con capital social integrado; dar de baja un servicio no da de baja la condición de asociado.
- Toda transferencia se simula antes de confirmarse, se aprueba según la política de la cooperativa, no se duplica ante reintentos y se revierte con un hecho nuevo, nunca borrando el anterior.
- Nada que tenga historia se borra: personas, titulares y cuentas se dan de baja, se archivan o se anonimizan, conservando lo que exige la normativa fiscal y contable. Corregir un dato usado en un documento emitido no modifica ese documento.
- Los duplicados nunca se fusionan automáticamente: la fusión requiere una decisión registrada y aprobación, y puede revertirse.
- Una gestión en nombre de otra persona exige una relación vigente que habilite esa acción; un pago hecho por un tercero no le otorga derechos ni acceso a los servicios del titular.
- El código de vinculación que se envía al contacto verificado del titular tiene 6 dígitos, es de un solo uso y vence a los 10 minutos; al sexto intento fallido la vinculación se bloquea durante 15 minutos, y la respuesta nunca revela si la cuenta existe.

**Lo que ve el socio**

- "Mis datos": consulta de los datos personales y actualización de contactos, domicilio postal y preferencias de comunicación; los cambios de nombre o de identificación se presentan como solicitud que revisa la cooperativa.
- Vinculación de sus cuentas mediante verificación y vista exclusiva de sus titularidades y de las cuentas que otras personas le autorizaron, para las acciones concedidas.
- Gestión de personas autorizadas para consultar o pagar; los alcances mayores requieren validación de la cooperativa.
- Solicitudes de acceso, rectificación, actualización y supresión de sus datos personales, con exportación de sus datos en un formato legible.
- Confirmación de la ubicación del domicilio en el mapa o con la ubicación del dispositivo, solo con su permiso y con alternativa por texto.

**Información e indicadores**

- Padrón de titulares a una fecha, por estado, condición de asociado, servicio, localidad, zona o distrito.
- Altas y bajas de titulares por mes, causa y sucursal, con su saldo neto.
- Calidad de datos: porcentaje de personas con identificación verificada, contacto verificado y domicilio confirmado, y diferencias abiertas con ARCA.
- Cuentas por estado y estructura (sin servicios vigentes, con varios grupos de facturación).
- Documentación presentada, pendiente, por vencer y vencida; bloqueos vigentes por efecto y antigüedad, con señalamiento de los que llevan más de 180 días sin vencimiento.
- Transferencias por tipo y estado, relaciones por vencer, casos de duplicados y solicitudes sobre datos personales resueltas en plazo y fuera de plazo.
- Estado de la ubicación de los domicilios (confirmados, aproximados, pendientes) e inmuebles por uso, estado y localidad.

**Etapa de habilitación**: etapa 3 (Socios, servicios y portal) para el núcleo del módulo; en la etapa 5 se suman la verificación contra el padrón de ARCA, el cambio de titularidad de servicios y las señales a facturación; en la etapa 6, las marcas de cobranza y débito automático; en la etapa 7, las transferencias con todos sus efectos económicos; y en la etapa 12, la migración repetible y los informes avanzados.

**Usuarios principales**: atención al socio, facturación, supervisión, socios desde el portal; también catastro e inmuebles, cajeros (consulta de bloqueos y mensajes para caja), responsable de privacidad y auditoría.

### 10.2 Catálogo de servicios y contratos

**Propósito**: definir, sin programar, qué servicios presta la cooperativa, con qué productos, planes, categorías, requisitos y reglas, y administrar el contrato de cada socio desde la solicitud hasta la baja, conservando su historia completa.

**Funciones principales**

**Habilitación y configuración de servicios**

- Habilitación de los servicios que la cooperativa presta, dentro de los contratados.
- Separación entre la oferta para nuevas contrataciones y la operación de los contratos existentes: cerrar la oferta impide altas nuevas, mientras los servicios vigentes continúan su ciclo y su facturación.
- Servicios disponibles para habilitar: Internet, telefonía fija y móvil, televisión, energía eléctrica, agua, cloacas, gas (natural, propano por red y envasado), alumbrado público, obras y pavimento, sepelio, cementerio parque, banco de sangre, ambulancias y salud, vivienda, tasas por cuenta de terceros, capital social y otras prestaciones (seguro, vehículo eléctrico, dispenser de agua, correo electrónico, paquete de mensajes de texto, banco ortopédico, traslados).
- Configuración propia de cada servicio, versionada y publicada en forma íntegra, con aprobación de un segundo usuario antes de aplicarse; la aprobación por un usuario distinto del autor se exige para los cambios comerciales o fiscales en producción, y un cambio que solo modifica una etiqueta no requiere revisión tarifaria.
- Perfil de cada servicio: prestador y jurisdicción (autoridad de aplicación, título habilitante, concesión), unidad de prestación, requisitos de alta, facturación, ciclo comercial, operación, cambios y salida, atención y control; cada aspecto admite "no aplica" cuando no corresponde al servicio.
- Requisitos de alta configurables en tres niveles (no exigir, advertir, exigir): factibilidad previa, inmueble, nomenclatura catastral, matrícula, garante, profesional instalador, zona y recorrido, entre otros.
- Indicación de si el servicio es técnico (altas, bajas y reconexiones mediante orden de trabajo) y de qué operación técnica corresponde a cada evento.
- Documentos y plantillas por servicio: contrato de alta, fianza, constancia de baja, declaración jurada y constancias de entrega y devolución de equipos.
- Canales habilitados por servicio y por operación: sitio público, aplicación del socio, mostrador, teléfono, asistente automático y botón de baja.
- Copia de la configuración de un servicio a otra cooperativa con autorización expresa de la cooperativa de origen, sin copiar datos de socios, contratos, deuda ni credenciales; en el destino queda como borrador independiente para revisar, completar y publicar.
- Plantillas de servicio provistas por la plataforma, sin precios ni condiciones reguladas, para lanzar servicios nuevos.

**Estructura comercial**

- Estructura comercial: servicio, productos y productos adicionales, planes con versiones, paquetes que combinan servicios, conceptos facturables, categorías, clases y propiedades del servicio.
- Conceptos facturables tipificados (una sola vez, recurrente, por cantidad, por evento, cuota, ajuste, tasa de terceros, aporte de capital), cada uno con su momento de cobro (aprobación, instalación efectiva, activación, inicio de período o evento) y su clasificación fiscal y contable.
- Planes con los atributos de cada servicio (por ejemplo, tecnología y velocidad en Internet), versiones históricas y discontinuación: un plan discontinuado no se ofrece más, pero los contratos existentes conservan sus condiciones.
- Promociones como componentes del plan, con vigencia de venta, base, duración (meses, ciclos facturados o fecha) y compatibilidad con otros beneficios; el importe lo calcula el motor de tarifas.
- Financiación de la instalación como alternativa excluyente del pago al contado.
- Categorías con atributos regulatorios y sociales explícitos (social, prepaga, generador, código del regulador) y grupos de categorías; clases y propiedades del servicio (por ejemplo, la tensión en electricidad).
- Paquetes que, al contratarse, generan un contrato por cada servicio, vinculados entre sí.

**Contrato de servicio**

- Estados del contrato (solicitado, activo, suspendido, baja y los estados operativos que defina la cooperativa) con su historia completa.
- Estados intermedios que completan el recorrido: en factibilidad, pendiente de instalación, rehabilitación en trámite, baja en trámite, anulado y no vigente (reemplazado por una transferencia); cada estado operativo propio de la cooperativa (por ejemplo, conectado o cortado) se asocia siempre a un estado del sistema.
- Fecha solicitada y fecha efectiva separadas para el alta, la suspensión, la reactivación y la baja; cada cambio de estado registra fecha, actor, origen y motivo.
- Ficha del contrato: servicio, plan y versión, categoría, domicilio y ubicación del servicio, inmueble, matrícula, grupo de facturación, garante, profesional instalador, zona y recorrido, y los datos de medición que aporta el módulo de medición.
- Condiciones contratadas guardadas en el contrato: versión del plan, componentes, promociones, financiación elegida y aceptación con fecha, canal y evidencia.
- Marcas del contrato: no facturar (con permiso, motivo y vigencia), provisorio (con vencimiento obligatorio y facturable en esa condición), no aplicar recategorización, alta desde el portal y factura electrónica por defecto.
- Suspensiones diferenciadas: voluntaria a pedido del socio (configurable por servicio y deshabilitada por defecto), por mora, técnica o de seguridad y regulatoria, cada una con duración, motivo y modo (servicio restringido o interrumpido).
- Cambios de plan, de categoría y de clase; transferencias; traslado del domicilio del servicio.
- Cambio de plan con vigencia desde el próximo período, o inmediato con prorrateo si la cooperativa lo habilita; cambio de categoría inmediato, en una fecha programada o al cerrarse la orden de trabajo.
- Cambio del régimen de medición del contrato (medido o no medido) con fecha efectiva, motivo y evidencia, en los servicios que lo admiten, como el agua.
- Cambios masivos de categoría solicitados por otros módulos (paso a prepago por deuda, recategorización por segmentación), con simulación previa y reversión mientras no se haya facturado con la nueva categoría.
- Trámites masivos sobre listas de contratos (marcar provisorio, cambiar actividad, clase, categoría o referencia, dar de baja), con resultado informado por contrato.
- Anulación del contrato antes de su activación (desistimiento, factibilidad negativa) sin exigir el retiro de equipos que no llegaron a instalarse.
- Equipos entregados en comodato, préstamo, alquiler o venta, vinculados al contrato; la modalidad se define por plan, el comodato es la modalidad por defecto en Internet y televisión, y también se admite el equipo propio del socio.
- Control de los equipos entregados: unidad identificada del stock, constancias firmadas de entrega y devolución, y bandeja de equipos pendientes de devolución tras la baja.
- Declaración de artefactos, condiciones especiales para grandes usuarios y suministros provisorios.
- Declaración jurada de artefactos por servicio, con historial: artefactos a gas con su potencia y artefactos eléctricos, incluidos los vehículos eléctricos, que el socio puede presentar desde la aplicación.
- Cargos por evento (conexión, reconexión, cambio de titular) y sus bonificaciones.
- Reglas de altas automáticas, con consentimiento para los servicios opcionales.
- Particularidades de cada servicio: número de línea en telefonía, perfil técnico en Internet (sin exponer contraseñas), contratos de obra creados para cada beneficiario al aprobarse el prorrateo de una obra, y límites diarios en el dispenser de agua.

**Oferta al socio**

- Publicación de la oferta en el sitio público y en la aplicación del socio, y vista "Mis servicios".
- Inicio de solicitudes de alta, baja, suspensión, reactivación o cambio de plan desde la oferta o desde el contrato; la solicitud la gestiona el módulo de atención y no modifica el contrato hasta su ejecución.

**Reglas que aplica el sistema**

- Habilitar o publicar un servicio no crea contratos ni cobros; cerrar la oferta frena las altas nuevas, y cerrar la operación de un servicio con contratos vigentes exige un plan de salida aprobado. Apagar un servicio nunca borra contratos, facturas, deuda ni gestiones.
- Toda modificación de un servicio publicado se hace con una versión nueva y la versión publicada no se edita. No se publica un plan sin precio vigente, un concepto sin clasificación fiscal ni un servicio regulado sin autoridad de aplicación y título habilitante.
- El contrato se crea en estado solicitado cuando se admite la solicitud. Solicitar no equivale a ejecutar: un reclamo o una gestión cerrada no cambia por sí sola el contrato ni cancela deuda.
- Un contrato pasa a activo solo con titular, cuenta, plan y categoría vigentes, grupo de facturación, requisitos cumplidos y, en los servicios técnicos, la confirmación técnica de la instalación y del aprovisionamiento.
- Solicitar la baja nunca genera cargo ni se bloquea por deuda. La baja conserva facturas, deuda e historia, deja los equipos pendientes de devolución sin frenar la baja comercial y no afecta la condición de asociado; una baja efectiva no se revierte, y reactivar el servicio exige un alta nueva.
- Las altas automáticas se crean directamente solo en los servicios obligatorios con fundamento normativo; los opcionales se proponen y requieren el consentimiento del titular. Una regla automática nunca duplica un contrato existente.
- Un servicio suspendido no vuelve a activo por el solo registro del pago: queda en "rehabilitación en trámite" hasta la confirmación técnica cuando el servicio la requiere. Los cargos por reconexión solo se aplican si la política de mora los habilita.
- La transferencia crea siempre un contrato nuevo para el titular destino y deja el original como no vigente, con su deuda y su historia. En los servicios no medidos se admiten contratos iguales en una misma cuenta; en los medidos, uno por punto de suministro.
- Una categoría se considera social solo si está marcada expresamente como tal. La deuda previa de otras cuentas en el mismo domicilio genera una advertencia con autorización opcional, nunca un bloqueo ni un traslado de deuda.
- En una copia entre cooperativas, la marca y el vocabulario del destino prevalecen, y el régimen fiscal y los subsidios del origen no se presumen aplicables.

**Lo que ve el socio**

- Oferta de servicios y planes con sus requisitos y canales para solicitarlos, en el sitio público y sin necesidad de ingresar.
- "Mis servicios": cada contrato con su estado, condiciones, precio vigente, beneficios temporales con su fecha de finalización y equipos asignados.
- Inicio de solicitudes de alta, baja, suspensión, reactivación o cambio de plan, según lo habilitado en cada servicio; en Internet, televisión y telefonía, la baja está disponible mediante el botón de baja.
- Indicaciones visibles como "Baja solicitada" o "Cambio de plan programado" mientras el trámite avanza.
- Presentación de la declaración jurada de artefactos.

**Información e indicadores**

- Contratos por estado, servicio, plan, categoría y zona a una fecha determinada.
- Altas netas, tasa de baja y tiempo desde la solicitud hasta la activación, con el recorrido por etapa (factibilidad, instalación) y las anulaciones de cada una.
- Servicios suspendidos por motivo, modo y antigüedad.
- Equipos en comodato entregados, pendientes de devolución, vencidos y perdidos.
- Contratos por versión de plan (incluidos los planes discontinuados con contratos vigentes) y promociones por finalizar.
- Marcas de excepción (no facturar, provisorio) vigentes, vencidas y por vencer, y resultados de las altas automáticas.
- Socios con varios servicios, padrón regulatorio por categoría, abonados activos por paquete a una fecha de corte y auditoría de los cambios de configuración.

**Etapa de habilitación**: etapa 3 para el catálogo, la habilitación, los planes, las categorías, los estados, el contrato, la copia entre cooperativas y la oferta en el sitio y en la aplicación; etapa 4 para la activación de Internet y los equipos en comodato; etapa 5 para los conceptos facturables, los paquetes, las tasas de terceros y la telefonía como abono; etapa 7 para la suspensión y la reconexión por mora; etapa 8 para las particularidades de electricidad, agua, cloacas, gas, alumbrado, obras, generación distribuida y grandes usuarios; etapa 11 para sepelio, cementerio parque, banco de sangre, salud, vivienda, televisión y telefonía con detalle de llamadas; y etapa 12 para la migración repetible.

**Usuarios principales**: administrador de la cooperativa, atención al socio, facturación; también el responsable comercial (productos, planes y promociones), el responsable fiscal y contable (aprobación de cambios), los supervisores (activaciones, suspensiones, bajas y transferencias), el área técnica (equipos en comodato) y los socios desde el portal.

### 10.3 Medición y consumos

**Propósito**: transformar la medición de los servicios medidos (electricidad, agua, gas y cualquier otro servicio medible que habilite la cooperativa) en cantidades aprobadas para facturar, con trazabilidad completa desde el medidor hasta la factura.

**Funciones principales**

**Medidores e instalaciones**

- Ficha de cada medidor: número, marca, modelo, dígitos, constante, registros, precintos, ensayos y trayectoria de instalaciones.
- Datos complementarios del medidor: clase de exactitud, año, propiedad (de la cooperativa, del socio o comunitario), condición de telemedido o prepago y vínculo con la unidad registrada en el stock.
- Marcas y modelos de medidor por servicio, registros para medidores de varias tarifas o magnitudes y carga masiva desde planilla, controlada contra el stock.
- Ensayos con resultado y certificado; precintos colocados, retirados o violados; fotografías y certificados adjuntos.
- Puntos de medición vinculados al servicio contratado, con canales separados por magnitud: energía activa entregada y recibida, reactiva, demanda por banda horaria, energía por franja, volumen de agua y volumen de gas.
- Instalación, retiro y cambio de medidor con lecturas de colocación y retiro y continuidad del consumo.
- Cambio de medidor como una sola operación (retiro e instalación), con las lecturas, precintos y fotos recibidas desde el cierre de la orden de trabajo.
- Anulación de una instalación o un retiro cargado por error, mientras sus consumos no estén facturados.
- Medición de gas natural y de propano por red; el gas envasado no utiliza medidor.

**Rutas y lotes de lectura**

- Rutas, cronogramas y lotes de lectura asignados a lecturistas, con seguimiento del avance, reasignación y cierre.
- Rutas armadas por zona, sector y recorrido, por calle y numeración, por rango de cuentas o por polígono en el mapa, con orden de recorrido configurable y propuesta de renumeración según el orden real de la última toma.
- Cronograma de lectura por servicio y ruta, con generación automática de lotes y aviso si falta asignar lecturista.
- Descarga del lote a la aplicación de campo, exportación a archivo para colectoras de terceros e impresión de planillas para lectura en papel.
- Tablero de avance en lista y en mapa: tareas pendientes, leídas, con observación, fuera de rango, con foto y en conflicto, por lecturista.
- Cierre del lote con acta (leídos, estimados, no leídos y excepciones) y reapertura con motivo mientras no haya consumos facturados.
- Registro de la jornada y de la productividad de cada lecturista.

**Toma de lecturas**

- Toma de lecturas por todos los medios: aplicación de campo sin conexión, carga manual, archivos de terceros, telemedición y autolectura del socio con foto.
- Aplicación de campo sin conexión con advertencias antes de guardar (fuera de rango, menor que la anterior, más dígitos que el medidor, cero en servicio conectado), foto obligatoria cuando corresponde, ubicación y hora; la sincronización no duplica lecturas y los conflictos se resuelven sin sobrescribir datos.
- Motivo codificado cuando no se puede leer (inaccesible, medidor roto, domicilio cerrado, medidor no encontrado), sin registrar un cero.
- Novedades informadas por el lecturista (medidor roto, conexión directa, pérdida) que el área técnica convierte en órdenes de trabajo.
- Carga manual en oficina, consumo adicional con autorización e importación desde archivos de terceros mediante formatos configurables sin desarrollo, con formatos precargados para los fabricantes y sistemas de lectura de uso habitual.
- Distinción entre lectura capturada, lectura validada y consumo aprobado; nunca se borra el dato original ni quién lo relevó.

**Consumos, validación y estimaciones**

- Cálculo de consumos con vuelta de medidor y factor de multiplicación; en gas, el módulo entrega el volumen medido sin corregir y el coeficiente corrector del punto, y la corrección por factor calórico, presión y temperatura la aplica el motor de tarifas.
- Validación contra el comportamiento esperado, bandeja de excepciones, aprobación y bloqueo.
- Reglas de validación configurables por servicio y categoría, con severidad informativa, de revisión o bloqueante: consumo cero en servicio conectado, fuera del rango esperado, variación contra el período anterior, desvío de días, lectura repetida, consumo en servicio desconectado, demanda mayor que la contratada e inyección sin contrato.
- Acciones de la bandeja de excepciones: aprobar con justificación codificada, corregir, pedir relectura, estimar, derivar a inspección o bloquear; los consumos con inconsistencias relevantes llegan a facturación como observados con su causa, sin detener al resto.
- Estimaciones con método documentado, autorización y regularización al llegar la lectura real.
- Métodos de estimación configurables: promedio de hasta 12 períodos válidos, mismo período del año anterior, promedio de la categoría o consumo mínimo del régimen, con método y base guardados en cada estimación.
- Corrección de lecturas o consumos no facturados como versión nueva con motivo; los consumos ya facturados solo se corrigen mediante un ajuste.
- División por período, prorrateo por días, distribución entre medidor principal y secundarios, y medidor testigo.
- Distribución del consumo de un medidor general (consorcio o barrio) entre sus puntos por porcentaje, en partes iguales o con tope por punto, reversible mientras no se facture.
- Trazabilidad desde cada renglón de la factura hasta las lecturas, las fotos y el lecturista, o hasta la estimación que lo originó.

**Demanda, generación y medición propia**

- Demanda contratada y detección de transgresiones.
- Cálculo del porcentaje de transgresión, revisión de los últimos seis períodos, restablecimiento de la demanda declarada con aprobación y aviso al socio y a atención comercial para gestionar un aumento de potencia.
- Generación distribuida: contrato del usuario generador, medidor bidireccional y balance de energía inyectada.
- Canales separados de energía demandada e inyectada y balance por período (demandada, inyectada y neta), que se entrega a facturación y cobranza; el cambio de titular y la baja del contrato de generación siguen a los del suministro.
- Medición propia de la cooperativa en puntos de compra y frontera, con balance energético e informe de pérdidas.
- Volumen comprado por período en los puntos de compra y frontera, disponible para controlar la factura del proveedor mayorista de energía o gas.
- Propuesta de cambios de clase o categoría según el rango de consumo, que se aplica solo con aprobación.

**Telemedición y prepago**

- Telemedición: toma de estado masiva o puntual, operaciones remotas y corte y reconexión remotos.
- Sistemas de telemedición configurables por cooperativa, con credenciales protegidas, correspondencia entre los registros remotos y los canales del punto, y registro auditado de cada operación.
- Medidores prepagos: estado de la cuenta prepaga, cargas de crédito, historial y avisos de saldo bajo.
- Validación previa de cada recarga ante el proveedor, emisión del crédito o código después de confirmado el cobro y conciliación diaria con las recargas cobradas.
- Alertas de posibles consumos no registrados, que el área técnica convierte en inspecciones.
- Informes de consumos, medidores sin leer, grandes consumos, pérdidas y productividad de lecturistas.

**Reglas que aplica el sistema**

- Nunca se borra una lectura ni el registro de quién la tomó: toda corrección crea una versión nueva con motivo, y un lote confirmado se archiva, no se elimina.
- Una lectura no es un consumo para facturar: solo se factura el consumo aprobado. Un consumo ya facturado no se modifica ni se anula; se corrige mediante un ajuste que facturación convierte en nota de crédito o de débito.
- Una lectura imposible se registra con su motivo, nunca como cero. Una lectura menor que la anterior exige clasificarla (vuelta de medidor, error de captura o cambio de medidor no registrado), y la vuelta se aplica solo con la confirmación de un usuario autorizado.
- Toda estimación lleva motivo y, según la cooperativa, autorización; al llegar la lectura real se regulariza la diferencia. Al tercer período estimado consecutivo (valor por defecto) se solicita una inspección o relectura obligatoria.
- Un medidor no puede estar instalado en dos puntos a la vez, ni dos medidores principales en el mismo canal; un medidor con su último ensayo rechazado no se instala, y un precinto no puede figurar colocado en dos medidores. En los servicios medidos hay un contrato por punto de suministro.
- La energía y la demanda se registran siempre en canales distintos; un consumo negativo solo se acepta en el canal de energía inyectada, y sin contrato de generación aprobado no se liquida inyección.
- Una alerta de consumo no registrado no es un fraude: nunca genera recupero ni multa por sí sola; solo origina una inspección.
- Los medidores prepagos no se leen para facturar en el ciclo pospago; el crédito se solicita al proveedor solo después de confirmado el cobro, y un reintento nunca genera un segundo código.
- El corte y la reconexión remotos se ejecutan solo con una orden vigente de mora o del área técnica, y el estado del servicio cambia únicamente con la confirmación del resultado; si el sistema de telemedición falla, la operación queda pendiente sin bloquear el cierre de la orden técnica.

**Lo que ve el socio**

- "Mis consumos": historial por servicio, gráfico, comparación con el año anterior, consumos estimados identificados y fotos de la lectura si la cooperativa lo habilita.
- Autolectura con foto dentro de la ventana de días informada, con aviso del resultado (aceptada, en revisión o rechazada con motivo).
- "Mi prepago": saldo informado, últimas recargas, códigos de carga y avisos de saldo bajo; la compra se realiza por los canales de cobro.
- Aviso de transgresión de la demanda contratada, para gestionar un aumento de potencia.

**Información e indicadores**

- Porcentaje de lectura y porcentaje de consumos estimados por período.
- Medidores sin leer, separados de los leídos con consumo cero.
- Variación porcentual, desvío de días, grandes consumos y consumos por categoría y por tramo.
- Excepciones abiertas por regla, severidad y antigüedad.
- Productividad de lecturistas: tareas por hora, porcentaje con foto, lecturas fuera de rango y conflictos.
- Pérdidas: energía comprada frente a facturada, con porcentaje mensual, anual y por zona.
- Éxito de la telemedición, comandos remotos, recargas prepagas y su conciliación, balance de generación distribuida, transgresiones y regularizaciones.
- Conjuntos de datos de consumo para los informes a los reguladores, que arma el módulo fiscal.

**Etapa de habilitación**: etapa 8 (Servicios medidos) para todo el módulo; la información del volumen comprado para controlar la factura del proveedor mayorista se suma en la etapa 9, y los informes avanzados y la migración repetible, en la etapa 12. Ninguna función de este módulo es necesaria para el recorrido completo de Internet.

**Usuarios principales**: lecturistas, supervisor de consumos, facturación, socios (consumos y autolectura); también el área técnica (cambios de medidor e inspecciones), los responsables de telemedición, la gerencia técnica (pérdidas y balance energético) y los socios con medidor prepago.

### 10.4 Tarifas y motor de cálculo

**Propósito**: calcular en forma reproducible, explicable y auditable el importe de cada concepto que se factura en cualquier servicio, a partir de una cantidad con origen identificado, un cuadro tarifario aprobado y reglas configurables, de modo que cada liquidación pueda explicarse y volver a calcularse con el mismo resultado aunque luego cambien los precios.

**Funciones principales**

**Cuadros tarifarios y precios**

- Cuadros tarifarios con versiones, vigencias, aprobación con doble firma, comparación entre versiones y vínculo con la norma que los origina (resolución del regulador, ordenanza municipal o decisión del consejo).
- Creación de una versión nueva copiando otra, con diferencias campo por campo e importes antes y después; importación de precios desde planilla y actualización masiva por porcentaje o importe sobre versiones en borrador.
- Control de vigencias: no se superponen versiones del mismo alcance, y las versiones programadas se activan solas al comenzar su vigencia, cerrando la anterior.
- Simulación obligatoria antes de enviar a aprobación y doble firma: quien carga o envía la versión no puede aprobarla; la cooperativa puede exigir una tercera firma.
- Vigencias retroactivas con motivo y aprobación específica, que activan la detección de las liquidaciones afectadas.
- Precios por servicio, categoría, tramos y escalones de consumo, adherentes, productos y cargos por evento.
- Parámetros de cálculo por servicio y categoría: tipo de cálculo, mes vencido o adelantado, cargo fijo, consumo mínimo, factura mínima, factor por días y tipo de comprobante.
- Tarifas de adherentes por edad, vínculo y ocupación, con cantidad de adherentes sin cargo; coeficientes por categoría y factores de corrección de gas por período.
- Impresión y exportación de cada versión con sus precios, reglas, normas y firmas.
- Publicación de los cuadros tarifarios vigentes en el sitio público, si la cooperativa lo habilita, solo con los precios marcados como públicos.

**Motor de cálculo**

- Cargos fijos, consumos mínimos, bonificaciones de unidades, demanda y factor de potencia.
- Abonos fijos por plan desde la activación efectiva, servicios por cantidad, tarifa medida por bloque o por tramos y escalones, servicios con adherentes, agua según los datos del inmueble y cuotas de obras de pavimento, alumbrado, cloaca, agua y vivienda.
- Corrección del volumen de gas por factor calórico, presión, temperatura y coeficiente corrector del punto, guardando por separado el volumen medido, los factores aplicados y la cantidad resultante.
- Tarifa prepaga con escalón determinado por el consumo acumulado del mes.
- Grandes consumos: energía por banda horaria, distintas modalidades de demanda, factor de potencia y contratos especiales, con revisión previa obligatoria de la liquidación cuando supera el importe configurado.
- Crédito por energía inyectada de usuarios generadores, según el régimen configurado: compensación monetaria por defecto, o balance neto como opción.
- Prorrateos por días en altas, bajas, cambios de plan y suspensiones, y entre versiones tarifarias dentro de un mismo período.
- Prorrateo de hasta tres versiones tarifarias en un período, con método configurable, también para el cargo fijo, el consumo mínimo y la demanda; prorrateo de ambos planes en un cambio de plan y de ambos regímenes en un cambio de régimen de medición.
- Instalación como cargo de una sola vez al confirmarse la instalación, sin duplicarse con su financiación; cargo por equipo no devuelto, deshabilitado por defecto y aplicable solo con regla aprobada.
- Cargos extraordinarios cargados para el período y cargos por evento (conexión, reconexión, visita, cambio de medidor, transferencia) con bonificaciones por cuenta.
- Franqueo, aplicación de anticipos y redondeo con arrastre al período siguiente.
- Exención del franqueo para quienes reciben la factura electrónica; la aplicación de anticipos se propone y cobranza la registra al emitirse el comprobante.
- Cálculo de impuestos mediante el módulo fiscal.
- Tributos de terceros (tasas municipales, fondos provinciales, alumbrado público) vinculados a tributos aprobados, con control que impide cobrar dos veces el alumbrado al mismo suministro.
- Errores identificados por cuenta que no frenan el lote: la cuenta con problemas queda excluida con su causa y el resto se calcula.

**Reglas, beneficios y promociones**

- Cargos adicionales definidos mediante fórmulas configurables y seguras, sin programación.
- Editor de fórmulas con validación, valor de cada parte de la expresión y prueba con casos de ejemplo y con datos reales; un asistente de inteligencia artificial puede proponer fórmulas, que el usuario valida y prueba antes de guardarlas.
- Reglas sin fórmula (porcentaje, importe fijo, escala, bloque, mínimo, máximo, umbral) para la mayoría de los casos.
- Prioridad, acumulación, exclusión y topes entre reglas; los conflictos se informan y bloquean la publicación.
- Beneficios: grupos de excepción, regímenes de subsidio con padrones importados, tarifa social y promociones.
- Origen obligatorio de todo beneficio (subsidio público, tarifa social, bonificación comercial, compensación a recuperar o promoción) y de quién lo financia.
- Regímenes de subsidio versionados e importación de padrones por número de suministro, documento o cuenta, con coincidencias, no coincidencias y duplicados; recategorización o inscripción aprobada y restablecimiento posterior de la categoría anterior.
- Rendición de lo bonificado o subsidiado y archivos de compensación para los organismos.
- Promociones asignadas al contrato con sus condiciones guardadas, conteo de ciclos al emitir, finalización automática y aviso previo al socio.
- Excepciones individuales autorizadas, con motivo, aprobación y vigencia.

**Simulación, explicación y diferencias**

- **Simulador** individual y masivo para comparar el efecto de una nueva tarifa antes de aplicarla.
- Simulación individual con un contrato real o ficticio, consumo real o supuesto y cualquier versión; simulación masiva por filtros, con resultados por servicio, categoría, zona y distribución de las variaciones; simulación de recargas prepagas y de promociones por ciclos.
- Cálculo de diferencias por cambios retroactivos.
- Diferencias simuladas, aprobadas y entregadas a facturación como notas de crédito o de débito, sin reescribir el comprobante original.
- **Explicación de cada renglón**: qué se cobró, a qué precio, con qué descuento y por qué, disponible para el personal y, si la cooperativa lo habilita, para el socio.
- Reproducción de cualquier cálculo histórico con su versión y sus datos originales, con el mismo resultado.
- Lista de verificación tarifaria por servicio (alcance, tarifas, beneficios, tributos, cargos, documentos y responsables) aprobada antes de facturar en producción.
- Tasación de llamadas telefónicas por bandas horarias, destinos, fracciones, descuentos y mínimos.
- Retasación de llamadas no facturadas conservando la tasación anterior, y simulación de una llamada individual.
- Incorporación de los cuadros históricos y traducción de las fórmulas del sistema actual de la cooperativa, con pruebas de equivalencia.

**Reglas que aplica el sistema**

- Un cuadro publicado no se modifica: toda corrección requiere una revisión nueva (si todavía no se usó en comprobantes emitidos) o una versión nueva.
- Una versión de un servicio regulado no se envía a aprobación sin la norma que la respalda, y ninguna versión se publica si le falta alguna dependencia (conceptos, impuestos, categorías): se publica completa o no se publica.
- Mismos datos de entrada y misma versión producen siempre el mismo resultado; cada renglón conserva su explicación completa y no existe importe sin justificación.
- El cálculo no modifica datos de otros módulos: sus efectos (avance de cuotas, ciclos de promoción, saldo de redondeo, aplicación de anticipos) se confirman recién al emitirse el comprobante y se revierten si se anula. Las simulaciones nunca dejan efectos.
- Solo se calculan consumos aprobados por el módulo de medición; si no hay versión vigente o hay dos posibles para el mismo caso, el cálculo de esa cuenta se detiene con su causa.
- Subsidio público, tarifa social, bonificación comercial, compensación a recuperar, tributo y cargo propio se mantienen separados; ningún subsidio se aplica por defecto y un beneficio sobre un bloque de consumo no se extiende al total.
- Nunca existe un cargo por solicitar la baja; los cargos de reconexión o suspensión solo se habilitan con fundamento cargado. No se habilita un cargo extra sin fundamento, ni los costos internos o la compra de energía se trasladan como recargos al socio.
- El motor no contiene porcentajes fiscales: los impuestos los resuelve el módulo fiscal, y una regla de tipo impuesto solo se publica vinculada a un tributo aprobado.
- Las fórmulas se ejecutan en un entorno cerrado, sin acceso a otros datos ni sistemas, y se versionan junto con los precios; una promoción asignada a un contrato no cambia aunque cambie la oferta vigente.
- Los precios unitarios admiten hasta 6 decimales, los importes se expresan con 2 y cada concepto tiene su regla de redondeo explícita.

**Lo que ve el socio**

- Explicación simplificada de cada factura (precio, cantidad, tramos, beneficios con su vencimiento y tributos), sin costos internos ni fórmulas, si la cooperativa lo habilita.
- Cuadros tarifarios vigentes publicados en el sitio, con su vigencia y la norma que los respalda, si la cooperativa lo habilita.
- Aviso previo al fin de una promoción.
- Plan de cuotas de obra (cuota actual, cuotas facturadas, saldo y próxima cuota estimada) y detalle tasado de las llamadas telefónicas.

**Información e indicadores**

- Cuadro vigente a una fecha y comparativo entre versiones, con variación porcentual por fila.
- Resultado de simulaciones masivas: totales y variaciones por servicio, categoría, grupo y tramo.
- Consumos y netos por tramo, escalón y versión, y agregado por fila tarifaria.
- Evolución de conceptos entre dos períodos e impacto de cada cambio tarifario en la factura media.
- Beneficios y subsidios otorgados por régimen y origen del financiamiento; control del padrón frente a la facturación; promociones activas, por vencer y su costo.
- Cuentas excluidas del cálculo por causa y por lote, y diferencias retroactivas con el estado de sus ajustes.
- Tributos por categoría, tasación telefónica, factor de potencia, redondeo y arrastre, usuarios generadores y auditoría de versiones con firmas, normas y simulaciones.

**Etapa de habilitación**: etapa 5 (Tarifas, facturación y fiscal) para el núcleo del motor (cuadros con doble firma, cargos fijos y por evento, prorrateos de servicios no medidos, promociones de Internet, reglas, impuestos, franqueo, anticipos, redondeo, explicación, simulador y diferencias retroactivas) y para el cobro básico por adherente; el cargo por equipo no devuelto se habilita ya en la etapa 4; etapa 8 para las tarifas medidas (tramos, mínimos, gas, prepaga, generación distribuida, grandes consumos, subsidios y tarifa social, cuotas de obra), para la incorporación de los cuadros y fórmulas históricos y para la comparación en paralelo, factura por factura, con el sistema actual de la cooperativa; y etapa 11 para las tarifas de adherentes por edad, vínculo y ocupación, la tasación telefónica, las cuotas de vivienda, los derechos de cementerio, los traslados y los servicios con cupo (correo electrónico y paquete de mensajes).

**Usuarios principales**: facturación, gerencia, contador, consejo; también los responsables de tarifas que cargan las versiones, los aprobadores de la doble firma, atención al socio (explicación de la factura) y los socios desde el portal.

### 10.5 Facturación

**Propósito**: convertir los consumos y cargos aprobados en comprobantes emitidos sin duplicación, controlados y trazables, separando siempre el cálculo comercial de la emisión definitiva del comprobante.

**Funciones principales**

**Ciclos y lotes**

- Ciclos de facturación por servicio con fechas de corte, emisión y vencimientos, y universos de cuentas (por zona, ruta, categoría o lista).
- Uno o más ciclos por servicio, cada uno con su universo; el sistema impide que un mismo servicio de un contrato quede incluido en dos ciclos vigentes del mismo período.
- Fechas del ciclo expresadas como reglas ("día hábil 5 del mes", "fin de mes más 10 días", "fecha fija") y resueltas con el calendario de días hábiles y feriados de la cooperativa; cada lote conserva la fecha concreta que se aplicó.
- Creación automática del lote en borrador en la fecha prevista del ciclo, con aviso al responsable; el sistema nunca prepara ni emite sin una acción o una aprobación humana.
- Lotes de facturación masiva con etapas explícitas: preparar, prefacturar, revisar excepciones, aprobar, emitir, autorizar fiscalmente, distribuir y cerrar el ciclo con un acta.
- **Universo congelado**: al preparar el lote, el sistema fija las cuentas incluidas, los consumos aprobados y las versiones de tarifas y reglas aplicables; una tarifa publicada después no altera ese lote, y cualquier alta o baja de cuentas en el lote genera una versión nueva con su motivo.
- Marcas de "no facturar" por cuenta o por servicio, con vigencia, motivo y usuario responsable; los casos marcados quedan excluidos del lote con su causa visible.
- Muestra de control, comparación con el período anterior y bandeja de excepciones antes de emitir. La muestra se arma en forma automática (una cuenta por categoría, una por condición fiscal, una de grandes y otra de pequeños consumos) y la comparación señala las variaciones que superan el porcentaje o el importe configurado.
- **Bandeja de excepciones** con el motivo tipificado, el área dueña del dato a corregir (datos del titular, lecturas, tarifas, datos fiscales, contrato), el responsable, la acción sugerida y el plazo; los casos con problemas se aíslan y el resto del lote continúa.
- Pausa automática del lote ante una falla general (por ejemplo, certificado fiscal vencido o integración caída), en lugar de marcar con error a todos los socios.
- Aprobación con un resumen obligatorio (universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones y muestra revisada), doble aprobación por encima del importe que defina la cooperativa y aprobación parcial de los casos aptos mientras se corrigen los demás.
- Cola de revisión previa, opcional, para grandes usuarios, usuarios generadores, contratos con acuerdos especiales y cálculos de importe elevado: esos casos no se envían a autorización fiscal hasta que un revisor los apruebe.
- Reproceso de los casos pendientes vinculado al lote original, verificando antes que cada caso no haya sido emitido.
- Cierre del ciclo con un acta que cuadra el universo (emitidos, emitidos con observaciones, pendientes, excluidos con causa, inciertos y rechazados), con las excepciones trasladadas al ciclo siguiente y la posibilidad de reabrirlo con motivo y aprobación.

**Comprobante y numeración**

- **Factura separada por servicio** (modalidad por defecto) o **factura agrupada multiservicio** mediante grupos de facturación, con el detalle, el saldo y las protecciones de cada servicio preservados.
- Grupos de facturación con titular, servicios incluidos, domicilio de reparto, punto de venta o talonario, periodicidad, vencimientos y canal de entrega; el contador de la cooperativa valida cada combinación antes de habilitarla, y un grupo nunca reúne titulares distintos ni servicios que exigen documento propio.
- Emisión por persona jurídica: cuando la cooperativa presta servicios a través de más de una razón social, cada comprobante, talón y numeración pertenece a una sola de ellas, con su punto de venta y su CUIT, aunque los servicios compartan grupo de facturación.
- Tipos y letras de comprobante, puntos de venta, numeración correlativa y control de correlatividad. El tipo y la letra surgen de la condición fiscal del emisor y del receptor y de la normativa, no de la preferencia del usuario.
- Numeración asignada al emitir, en el orden de emisión elegido (cuenta, orden alfabético, ruta de reparto o calle y número), sin huecos ni duplicados; si el organismo fiscal rechaza un comprobante, se corrige y se reenvía con el mismo número.
- Hasta cuatro vencimientos con sus recargos impresos en el comprobante, más el próximo vencimiento; el recargo de cada vencimiento puede ser un importe fijo, un porcentaje o una escala por rango de importe, con su IVA calculado por el módulo fiscal.
- Política configurable por servicio para los casos especiales: un comprobante con importe cero no se emite y queda registrado como "sin cargo", y un total negativo se emite como nota de crédito o, en generación distribuida, como crédito a favor para períodos futuros.

**Correcciones y cargos**

- Bloqueo y desbloqueo, anulación, notas de crédito y débito, refacturación, factura manual, réplica de comprobantes, modificaciones masivas, recategorización y retroactivos.
- Anulación solo de comprobantes no autorizados fiscalmente y sin pagos; los autorizados o con pagos se revierten con una nota de crédito asociada. Al anular o revertir, el sistema libera lo que el comprobante había tomado (consumos, cargos pendientes, cuotas, anticipos) para que pueda volver a facturarse.
- Notas de crédito y débito parciales por servicio, renglón o importe, con causa y documentación; en un comprobante agrupado, corregir un servicio no altera los renglones de los demás.
- Refacturación puntual de un servicio y período sin reprocesar el lote, con el comprobante original y el nuevo vinculados.
- Factura manual con borrador guardable, controles de vencimientos y fechas, y emisión de varios comprobantes consecutivos con vencimientos mensuales.
- Modificaciones masivas de vencimientos con vista previa, aprobación y auditoría por comprobante; en comprobantes autorizados solo se modifican datos no fiscales.
- Cola única de cargos pendientes de facturar provenientes de otros módulos (ventas, cuotas, terceros).
- Importación de cargos de terceros desde planillas o archivos (alumbrado público, emergencias médicas, farmacia, tasas y otros), con validación previa y errores visibles por fila; los conceptos por cuenta de terceros solo se facturan con convenio vigente y se exhiben en un bloque separado.
- Por defecto, las ventas de productos y sus cuotas se facturan en documentos propios y se presentan juntas en el resumen de cuenta; solo se incluyen en la factura del servicio los conceptos vinculados a ese servicio y validados fiscalmente.

**Representación y distribución**

- Diseño del comprobante con gráfico de consumos, talones, código de barras configurable y código QR fiscal.
- PDF del comprobante con QR fiscal, conservado de forma que pueda reproducirse idéntico; las reimpresiones llevan la marca "duplicado".
- Formatos de código de barras definidos por configuración (Pago Fácil, Banco de Córdoba, SIRO y otros), con validación de largo: si un importe no entra en el formato, se usa el formato alternativo o se registra una excepción, nunca se imprime un código inválido.
- Talones que reúnen varios comprobantes de una cuenta con un solo código de pago, y partición de un comprobante en talones-cuota.
- **Distribución** por papel con rutas de reparto y empresas postales, correo electrónico, WhatsApp, aplicación y portal, con registro del resultado de cada envío.
- Preferencias de entrega por titular o cuenta y adhesión a la factura digital; solo se distribuyen comprobantes ya autorizados o que no requieren autorización, y un correo rebotado en forma reiterada se deriva al reparto en papel.
- Impresión masiva o exportación a imprenta en el orden de la ruta, con piezas postales numeradas, mensajes por segmento, planilla de reparto y registro de entrega o devolución por el repartidor desde la aplicación de campo, incluso sin conexión.
- Facturación en el lugar al momento de la lectura, para las cooperativas que la utilicen, con un rango de numeración reservado para el dispositivo y conciliación al sincronizar.
- Reanudación segura de procesos interrumpidos: nunca se emite una factura duplicada.

**Reglas que aplica el sistema**

- Ningún comprobante emitido se modifica ni se elimina: toda corrección se hace con nota de crédito, nota de débito o refacturación vinculada, y la anulación es siempre lógica.
- Un mismo servicio y período no se factura dos veces; volver a facturarlo exige una secuencia explícita con motivo (por ejemplo, un bimestre partido o una refacturación).
- Ante una respuesta fiscal incierta, el sistema consulta el resultado antes de reintentar; nunca reemite ni renumera a ciegas.
- Una factura A sin CUIT válido del receptor queda como excepción "no apta para emisión"; no se cambia a factura B sin validación y trazabilidad.
- Quien prepara un lote no puede aprobarlo y quien solicita una nota de crédito por encima del umbral no puede aprobarla (separación configurable, activa por defecto). Ningún usuario saltea validaciones: toda excepción requiere motivo, aprobación y queda auditada.
- No se emite, modifica ni anula con fecha anterior al cierre del módulo de facturación; los vencimientos caen en días hábiles, en orden creciente y nunca antes de la fecha de emisión.
- El saldo de cada comprobante no se guarda en la factura: lo informa la cuenta corriente.
- La cooperativa configura y aprueba sus propias escalas de recargo entre vencimientos; el sistema no trae valores productivos precargados.
- Cambiar la modalidad de facturación o un grupo rige desde el período siguiente y no reemite ni fusiona comprobantes anteriores.

**Lo que ve el socio**

- La lista de comprobantes de sus cuentas, con apertura por servicio, estado de pago, vencimiento e importe vigente según la fecha, descarga del PDF y acceso directo a pagar.
- En la factura agrupada, cuánto corresponde a cada servicio y qué se pagó de cada uno.
- El aviso de factura disponible por correo electrónico, WhatsApp o notificación de la aplicación, según los canales que elija, y la opción de adherir a la factura digital.
- El gráfico de consumos de los últimos períodos y, si la cooperativa lo habilita, la explicación de cada renglón.
- La consulta de un comprobante sin ingresar a la aplicación, con datos mínimos de identificación, si la cooperativa la habilita.

**Información e indicadores**

- Facturación por período, servicio, concepto, categoría y condición fiscal, con neto, IVA, otros tributos y cantidad de comprobantes.
- Cuadre de cada lote y ciclo, y comparación de cada caso con el período anterior.
- Excepciones abiertas por motivo, responsable y antigüedad, con las vencidas destacadas.
- Comprobantes pendientes de autorización fiscal por punto de venta y antigüedad.
- Numeración utilizada por tipo y punto de venta, con detección de huecos.
- Comprobantes bloqueados por causa, y notas de crédito, notas de débito y anulaciones por motivo, usuario y aprobador.
- Entregas por canal y estado, tasa de rebote y devoluciones de papel por ruta.
- Diferencias entre períodos por cuenta y por concepto, y movimiento por concepto.

**Etapa de habilitación**: núcleo en la etapa 5 (Tarifas, facturación y fiscal); lectura de códigos en caja, bloqueo de cobro y cupón de pago único en la etapa 6; bloqueo con cobro de intereses en la etapa 7; revisión previa de grandes usuarios, recategorización, retroactivos sobre consumos medidos y facturación en el lugar en la etapa 8; cuentas de venta y líquido producto y telefonía revendida en la etapa 11; consulta de comprobantes por terceros e informes avanzados en la etapa 12.

**Usuarios principales**: facturación, gerencia, socios (consulta y descarga), jefe comercial (aprobación de lotes y cierres), contador (notas de crédito, anulaciones y validación fiscal de grupos), distribución e impresión, repartidores y atención al socio (reimpresión, reenvío y preferencias de entrega).

### 10.6 Fiscal e impuestos

**Propósito**: autorizar los comprobantes ante el organismo fiscal, calcular los impuestos y preparar todas las obligaciones fiscales y regulatorias. El sistema calcula, prepara, valida, registra y concilia; la presentación y la responsabilidad fiscal siguen siendo de la cooperativa y de su contador.

**Funciones principales**

**Tablas normativas y perfil fiscal**

- Tablas normativas fiscales versionadas con fuente y vigencia, mantenidas por la plataforma y adoptadas por cada cooperativa. La adopción la aprueba el responsable fiscal con fecha efectiva, y una nueva versión puede simularse sobre un período antes de adoptarla.
- Tablas que la cooperativa amplía con filas propias (tributos municipales, conceptos regulatorios, alícuotas determinadas), siempre con fundamento cargado y sin poder editar las filas de la plataforma.
- Relevamiento fiscal de la cooperativa (CUIT, condición, jurisdicción, servicios, tributos con su fundamento y modalidad de emisión), aprobado como requisito para facturar en producción.
- Perfil fiscal por persona jurídica de la cooperativa, con su CUIT, certificado digital, puntos de venta, libros de IVA, regímenes y obligaciones propios.
- Determinación de la condición frente al IVA, validación de la clase de comprobante y consulta de padrones.
- Validación del CUIT y consulta del padrón de ARCA para proponer razón social, domicilio fiscal y condición frente al IVA al dar de alta un titular o un proveedor, conservando la consulta como evidencia; a partir del DNI se proponen los CUIT asociados para que el usuario elija.

**Autorización electrónica**

- Autorización electrónica de comprobantes ante ARCA (por comprobante, anticipada para contingencias, para talonarios y para liquidaciones de servicios públicos), en forma masiva, resiliente y conciliable.
- Gestión del certificado digital: el sistema genera la solicitud y protege la clave privada, o incorpora un certificado existente. Avisa a los 30, 14, 7 y 3 días del vencimiento y, con el certificado vencido, detiene los envíos con un mensaje claro sin marcar con error cada factura.
- Ante una caída del organismo fiscal: se emite y se encola la autorización, con contingencia anticipada si está habilitada; en mostrador se espera la autorización un tiempo máximo y, de no obtenerse, se aplica la contingencia.
- **Cola de autorización** con estados visibles (pendiente, autorizado, autorizado con observaciones, rechazado, incierto, detenido) y un tablero por punto de venta, tipo y fecha con acciones de reintentar, consultar o derivar a corrección.
- Validaciones previas al envío que detienen el comprobante con el motivo exacto (por ejemplo, alícuota sin código fiscal, dato faltante del receptor o comprobante anterior pendiente) en lugar de descartarlo en silencio.
- Contraste de la numeración local con la del organismo fiscal antes de cada envío y conciliación periódica de autorizaciones e importes, con reparación solo mediante propuesta aprobada.
- Pausa de un punto de venta, control de vencimiento de los talonarios con código de autorización impreso y aviso de comprobantes pendientes de autorizar con más de 3 días (configurable).
- Datos del código QR fiscal y transparencia fiscal (IVA contenido en los comprobantes a consumidor final), entregados a facturación para su impresión.
- Conservación de la evidencia de cada envío y respuesta del organismo fiscal, sin datos de credenciales.

**Cálculo de impuestos**

- Cálculo de IVA, percepciones de IVA e Ingresos Brutos, tributos provinciales y municipales y conceptos de terceros, con explicación de cada cálculo.
- Padrones de alícuotas de Ingresos Brutos por CUIT, con alícuota para no incluidos y alícuota determinada manual por cuenta; antes de facturar se verifica la vigencia del padrón.
- Ingresos Brutos de Córdoba desde el inicio y de las demás jurisdicciones como configuración. Córdoba se habilita junto con la facturación; las demás provincias se incorporan configurando su padrón, régimen y formato, sin desarrollos a medida.
- Código de Validación Provincial por punto de venta y período, impreso con su leyenda en el comprobante.
- Tratamientos fiscales especiales por concepto: el aporte de capital facturado junto al servicio como concepto no gravado (encuadre a validar con el contador de cada cooperativa), el depósito en garantía fuera de la base imponible y los derechos de sepultura con el tratamiento que se defina para cada concepto.
- Informe de bases imponibles y percepciones por jurisdicción para cooperativas en Convenio Multilateral.

**Agente, libros y declaraciones**

- Actuación como **agente de retención y percepción**: regímenes, motor de retenciones a proveedores, certificados y obligaciones. Contempla escalas, mínimos, acumulación de pagos, certificados de exclusión vigentes y certificados de retención numerados por año; la obligación de cada período se paga desde tesorería y se concilia con contabilidad.
- Catálogo y validación de las retenciones sufridas que registra la cobranza (tipo, régimen, certificado y CUIT del agente).
- Libros de IVA ventas y compras, Libro IVA Digital y conciliación con los comprobantes informados al organismo. El libro de ventas admite los criterios facturado y percibido; el cierre de cada período queda inmutable y solo se reabre con autorización; la conciliación con "Mis Comprobantes" informa faltantes de cada lado y diferencias por encima de la tolerancia.
- Regímenes informativos nacionales y provinciales, con registro de presentación, acuse y rectificación. Cada declaración pasa por los estados generada, validada, aprobada, presentada (con acuse), aceptada o rechazada y rectificada; un calendario fiscal avisa los vencimientos a los responsables.
- Convenios de cobro por cuenta y orden de terceros (tasas municipales, alumbrado, fondos), con exhibición separada en la factura y rendición al tercero. Sin convenio y fundamento vigentes, el concepto no puede facturarse; lo cobrado se registra como deuda con el tercero y no como ingreso propio.
- Informes a entes reguladores de energía, gas, comunicaciones, energía provincial y federaciones de cooperativas (ERSeP, ENARGAS, ENACOM y Secretaría de Energía, entre otros), con el mismo registro de presentación y acuse.
- Selección de comprobantes de organismos públicos y otras cuentas liquidadas en bloque, para su cobro conjunto en caja.
- Autorización de comprobantes generados por otros sistemas de la cooperativa, opcional, mediante interfaz o archivo.

**Reglas que aplica el sistema**

- El sistema no presenta declaraciones en nombre de la cooperativa, salvo que exista un servicio oficial habilitado y la cooperativa lo active expresamente; generar un archivo no equivale a presentarlo, y toda pantalla y archivo de declaración muestra la leyenda de responsabilidad.
- Ningún porcentaje, mínimo, código o vencimiento fiscal está fijo en el sistema: todos surgen de una tabla vigente adoptada por la cooperativa, y un cambio posterior no reescribe comprobantes ya emitidos.
- La cooperativa puede agregar tributos con fundamento, pero no puede desactivar restricciones normativas ni trasladar al socio tributos propios sin respaldo.
- Un reintento de autorización nunca genera otro número ni otra autorización, y un comprobante con resultado incierto se consulta antes de volver a enviarlo.
- Nunca se informa un CUIT genérico ni uno calculado sin confirmación; un consumidor final sin documento solo se admite por debajo del umbral de identificación vigente, y un reintento nunca cambia la condición frente al IVA del receptor.
- Aprobar, presentar, rectificar, reabrir y adoptar tablas exigen verificación reforzada y quedan auditados; la cooperativa puede exigir que quien genera una declaración no sea quien la aprueba.
- La clave privada del certificado nunca se guarda en la base de datos ni la ve un usuario, y las credenciales fiscales están separadas de cualquier otro acceso al sistema.
- Una cooperativa de demostración solo opera contra el ambiente de pruebas del organismo fiscal.

**Lo que ve el socio**

- En cada comprobante, el código de autorización, su vencimiento y el código QR fiscal para verificarlo.
- Las percepciones discriminadas y, en comprobantes a consumidor final, el IVA contenido.
- Los conceptos cobrados por cuenta de terceros en una sección separada, con el organismo al que corresponden.

**Información e indicadores**

- Tablero de autorizaciones con cantidad e importe por estado, punto de venta y tipo, tiempo medio de autorización, porcentaje de rechazo e inciertos abiertos.
- Libro IVA ventas y compras con su carátula, y posición mensual de IVA como insumo para el contador.
- Percepciones practicadas, retenciones practicadas y retenciones sufridas por régimen, jurisdicción y sujeto.
- Conciliación con el organismo fiscal y con "Mis Comprobantes".
- Rendición por convenio de terceros: facturado, cobrado, comisión, neto a rendir y pendiente de cobro.
- Calendario y cumplimiento de declaraciones (a tiempo, vencidas, rechazadas, rectificadas).
- Vencimientos de certificados, talonarios, autorizaciones anticipadas y padrones, y diferencias de condición fiscal detectadas en los padrones.

**Etapa de habilitación**: núcleo en la etapa 5 (autorización ante ARCA con contingencia, condición frente al IVA, IVA, percepciones de IVA e Ingresos Brutos de Córdoba, padrones, convenios de terceros, tablas normativas y libro de IVA ventas por lo facturado); rendición a terceros, retenciones sufridas, efectos contables y comprobantes de organismos públicos en la etapa 6; liquidaciones de servicios públicos, energía inyectada e informes a entes reguladores en la etapa 8; Libro IVA Digital, conciliación con "Mis Comprobantes", regímenes informativos, retenciones como agente y demás jurisdicciones de Ingresos Brutos en la etapa 9; autorización para sistemas externos en la etapa 12.

**Usuarios principales**: contador, facturación, tesorería, responsable fiscal de la cooperativa, compras y pagos (retenciones a proveedores), responsable regulatorio, equipo normativo de la plataforma (tablas fiscales) y consejo y auditoría (solo consulta).

### 10.7 Cuenta corriente y cobranza

**Propósito**: ser la única fuente del saldo de cada titular y el único camino por el que ingresa dinero al sistema, explicando cada peso recibido como cancelación, crédito o pendiente.

**Funciones principales**

**Cuenta corriente**

- Cuenta corriente por titular, separada por servicio o unificada según la política de la cooperativa, con saldo derivado de los movimientos y nunca editable.
- Una cuenta corriente por titular y por persona jurídica de la cooperativa cuando esta opera con más de una razón social; la consulta y el portal muestran cada cuenta con su subtotal y un total general informativo.
- Una obligación por cada servicio dentro de cada comprobante, con sus vencimientos y sus componentes (capital, recargos, tributos y conceptos de terceros); los movimientos son inmutables y toda corrección es un movimiento de reversión vinculado.
- Consulta por titular, cuenta, contrato, servicio y documento, con saldo a una fecha histórica, antigüedad de la deuda y recorrido completo desde cada factura hasta sus recibos y operaciones de caja.
- Resumen de cuenta con las facturas incluidas, el pendiente por servicio y el mínimo de pago que defina la cooperativa (pagar el mínimo no cancela el resto), y estado de cuenta descargable en PDF o planilla.
- Imputación automática de pagos por antigüedad, con recargos e intereses primero, respetando la elección explícita del socio o del cajero. Los créditos se aplican automáticamente dentro del mismo servicio y entre servicios solo con elección o autorización. Cada imputación muestra la regla aplicada, el orden y el autor.
- Saldos a favor con su origen (excedente, anticipo, pago duplicado, nota de crédito, reversión), anticipos manuales y bandeja de cobros no identificados con responsable y antigüedad.
- Bloqueo de comprobantes para el cobro, individual o masivo, con motivo y vigencia, y notas de cuenta que impiden cobrar o muestran un aviso en caja.
- Verificación diaria de integridad del saldo y conciliación con la contabilidad.

**Caja y cobradores**

- **Caja presencial**: apertura, cobro por código de barras, medios de pago combinados, QR, descuentos, retenciones sufridas, anulación, arqueo y cierre con registro de diferencias.
- Búsqueda de la deuda por código de barras, identificador de pago, comprobante, cuenta, titular, DNI o CUIT, y advertencias al seleccionar la cuenta (comprobante bloqueado, deuda notificada, servicio desconectado, deuda vencida en otras cuentas, saldo a favor disponible).
- Recargo calculado a la fecha de cobro por el módulo de mora; cambiarlo o no cobrarlo requiere permiso y queda registrado.
- Cobro de varias cuentas en una sola operación, con un recibo por cuenta; cuando la deuda corresponde a distintas personas jurídicas, se emite siempre un recibo por cada una con su propia numeración.
- Recibos en PDF y ticket con QR de validación, reimpresión registrada y envío por correo electrónico, WhatsApp o SMS.
- Límites por cajero (importe máximo por operación, medios habilitados, efectivo máximo en caja) con aprobación del supervisor al superarlos; una caja solo se reabre si tesorería todavía no recibió su rendición.
- **Cobradores** con cartera, cobranza fuera de la oficina y rendición. El cobrador opera desde la aplicación de campo, incluso sin conexión, con recibo provisorio numerado y un tope de efectivo en su poder que bloquea nuevos cobros hasta rendir.

**Canales externos**

- **Entes recaudadores** por archivo o por conexión en línea. Red Link, SIRO, Pago Fácil, Rapipago, Cobro Express, bancos y procesadoras de tarjetas se configuran como datos, sin desarrollos a medida; el archivo de deuda se genera tras cada lote de facturación y la rendición se revisa antes de confirmarla.
- Identificador de pago propio y estable para cada factura, cupón, cuota o aviso de deuda, que permite imputar la rendición sin depender del importe.
- **Débito automático** por CBU o tarjeta, con adhesión y baja desde el portal. Los débitos rechazados vuelven a la deuda con su código de causa, se avisa al socio y se reintentan de forma controlada, sin reintentar los rechazos definitivos.
- **Datos de tarjeta**: el sistema nunca recibe ni guarda el número completo de la tarjeta, su vencimiento ni el código de seguridad. Esos datos se cargan únicamente en los formularios del proveedor de pagos y el sistema conserva solo un identificador, la marca y los últimos 4 dígitos. Cuando el operador da de alta una adhesión con tarjeta, envía al socio un enlace para completarla en el formulario del proveedor.
- **Pasarelas de pago** con enlace de pago, botón, QR y tarjetas guardadas en forma segura por el proveedor de pagos. SIRO, Pagos360 y Mercado Pago están disponibles desde el inicio de la cobranza; las demás pasarelas se incorporan cuando una cooperativa las solicita.
- Enlaces de pago enviables por WhatsApp, correo electrónico o SMS desde caja, cuenta corriente, atención al socio o portal; QR en facturas y en caja; y pago sin ingresar al portal mediante el identificador de pago, si la cooperativa lo habilita.
- Cupón de pago único para varias facturas.
- Garantía de que un pago se registra una sola vez aunque el proveedor lo informe varias veces, y de que un pago con resultado incierto no se reintenta sin conciliar.
- Conciliación separada del importe cobrado, la comisión del proveedor y el neto acreditado.
- Devoluciones y contracargos con su efecto comercial y financiero. Cada devolución tiene su expediente con causa, aprobación y ejecución; un contracargo reabre la deuda sin borrar el recibo original.
- Rendición de fondos a tesorería, con entrega de cheques a la cartera de valores y aviso de la acreditación esperada de cada ente o pasarela para la conciliación bancaria.
- Cobranza por cuenta de terceros (municipios y otros emisores) con comisión y rendición al tercero.
- Reconexión automática al confirmarse el pago en servicios que se reconectan en forma remota, cuando no queda deuda vencida del servicio; si se requiere un técnico, se genera la orden de trabajo automáticamente.
- Reconocimiento, durante la transición, de los códigos de barras, identificadores y formatos de archivo del sistema actual de la cooperativa, para que las facturas emitidas antes del cambio se sigan cobrando.
- Resumen de cuenta y recibos disponibles para el socio.

**Reglas que aplica el sistema**

- El saldo nunca se edita: solo cambia por documentos emitidos o ajustes autorizados con causa, autor y contrapartida.
- Un pago pendiente de confirmación (enlace iniciado, transferencia informada, débito presentado) se muestra pero no reduce la deuda ni habilita la reconexión. Volver a la página de "pago exitoso" no prueba el cobro, y todo aviso de un proveedor se confirma consultándolo antes de registrarlo.
- Un excedente o saldo a favor nunca se aplica a otro titular, conviviente o servicio por inferencia; para identificar un cobro hace falta un dato verificable (identificador de pago, cuenta, documento del pagador o referencia bancaria), no basta un nombre, un domicilio o una imagen.
- El socio cancela su deuda por el importe que pagó; la comisión del canal se registra aparte como gasto de la cooperativa.
- Un pago de un ente o pasarela sobre un comprobante ya cancelado por otra vía queda como saldo a favor de la cuenta pagadora y se lista en el resultado de la importación.
- La anulación de un cobro no borra nada: el recibo queda anulado, el saldo se repone por movimientos y la operación requiere autorización.
- Quien solicita una devolución no puede aprobarla, y una diferencia de arqueo por encima del umbral no la aprueba quien la declaró.
- La deuda anterior asociada al domicilio o al suministro de otro titular se muestra como advertencia; nunca bloquea el cobro ni se traslada.
- El CBU de las adhesiones se guarda protegido y se muestra enmascarado; de las tarjetas solo se conservan el identificador del proveedor, la marca y los últimos 4 dígitos.

**Lo que ve el socio**

- Su deuda por servicio, qué pagó de cada uno, sus recibos y el estado de cuenta descargable.
- El pago en línea de facturas, resumen, cupón único, cuotas y venta prepaga, con el mensaje "estamos confirmando tu pago" hasta la confirmación del proveedor.
- La adhesión y la baja del débito automático; si elige tarjeta, la carga en el formulario del proveedor de pagos y luego ve solo la marca y los últimos 4 dígitos.
- La posibilidad de informar una transferencia adjuntando el comprobante, que queda pendiente hasta su verificación.
- El recibo de cada pago por el canal que haya elegido.

**Información e indicadores**

- Antigüedad de saldos por tramos (0-30, 31-60, 61-90, 91-180 y más de 180 días) y cartera por servicio y período.
- Cobranza diaria por canal, medio y servicio, con recargos e intereses cobrados por separado.
- Planilla de caja, arqueos y diferencias, recibos anulados y cambios de recargo.
- Rendiciones de entes, conciliación de cobranzas (cobrado, comisión, impuestos y neto esperado contra acreditado) y comisiones por canal.
- Débito automático con tasa de rechazo, adhesiones activas y enlaces de pago con tasa de conversión.
- Saldos a favor y cobros no identificados por antigüedad, devoluciones y contracargos, cobradores y terceros.
- Indicadores de gestión: cobranza del día contra el promedio, porcentaje de cobranza digital, días promedio de cobro y pagos inciertos abiertos.

**Etapa de habilitación**: núcleo completo en la etapa 6 (Cobranza y tesorería operativa), incluidos Red Link, SIRO, Pagos360 y Mercado Pago; integración con mora, suspensión y reconexión en la etapa 7; cobro de venta prepaga, puntos de cobro remotos y conversión de talones del sistema actual en la etapa 8; egresos de caja para pago a proveedores en la etapa 9; cuotas de vivienda, servicios sociales y comisiones de cobradores en la etapa 11; pasarelas restantes en la etapa 12 o antes si una cooperativa las solicita.

**Usuarios principales**: cajeros, cobradores, tesorería, atención al socio, socios, supervisores de caja, responsables de cuenta corriente y de cobranzas externas, y contador (consulta y conciliación).

### 10.8 Mora, corte y financiación

**Propósito**: gestionar la deuda vencida con un único motor configurable, respetando los límites normativos de cada servicio, y formalizar su regularización sin cobrar dos veces un mismo interés ni exigir dos veces una misma deuda.

**Funciones principales**

**Intereses y recargos**

- Cálculo de intereses y recargos al emitir, al cobrar o consultar la deuda y en procesos masivos, con tasas fijas, tablas por vigencia o índices, por servicio, categoría y tipo de documento.
- Un único motor de cálculo para caja, entes recaudadores, pasarelas, portal, procesos masivos y convenios, que devuelve el mismo importe al centavo para la misma deuda y la misma fecha y lo explica en lenguaje claro (días, tasa y base).
- Recargo entre vencimientos calculado al emitir e impreso en la factura, con su IVA; lo efectivamente cobrado se documenta en un comprobante posterior, sin modificar la factura original.
- Intereses por pago fuera de término trasladados a la próxima factura, configurable por canal. En el pago en línea de una factura vencida, el interés se traslada por defecto a la próxima factura.
- Proceso masivo de intereses a facturar con informe preliminar, en el que el operador puede excluir documentos o tramos antes de generar los cargos.
- Mínimos, redondeo, exenciones (por ejemplo, jubilados u otra condición que defina la cooperativa), descuento por pronto pago y gastos administrativos, estos últimos solo si están habilitados con fundamento.
- Bloqueo de comprobantes por causa, con historial, y desbloqueo con cobro de intereses.

**Gestión de la mora**

- Política de mora por servicio y categoría con instancias configurables (candidatos, primer aviso, segundo aviso, corte y las que defina la cooperativa). Cada política fija días desde el vencimiento, monto y cantidad mínima de documentos, canales por instancia, plazos de gracia e intimación y acción final permitida.
- Saldo considerado para la mora definido por la cooperativa; los conceptos cobrados por cuenta de terceros quedan excluidos por defecto y solo se incluyen si el convenio con el tercero lo autoriza.
- Evaluación de mora periódica o a demanda que genera candidatos, avisos o propuestas de interrupción; la evaluación nunca ejecuta cortes por sí misma.
- Notificaciones de deuda con contenido, canal, plantilla y constancia de entrega. Cada instancia define qué constancia exige: un aviso que necesita constancia no se considera notificado solo porque el mensaje fue enviado, y un correo rebotado genera la tarea de usar otro canal.
- Detección previa de las cuentas sin correo electrónico o sin celular, para derivarlas a otro canal antes del envío.
- Promesas de pago, calificación de deudores y excepciones. La promesa detiene el avance hasta su fecha; si no se cumple, el circuito se retoma. Las excepciones comerciales ("no reclamar", "no cobrar interés") rigen solo después de ser autorizadas.
- **Protecciones normativas**: electrodependientes, entidades públicas y demás casos protegidos, que bloquean o derivan a revisión la suspensión. Cada protección se registra con su evidencia y vigencia, y el sistema avisa antes de su vencimiento.
- Protección temporal de los documentos con reclamo de facturación en trámite y de los pagos informados pendientes de acreditar.

**Suspensión, corte y reconexión**

- Suspensión, corte, reconexión, baja por mora, suspensión voluntaria y reactivación, ejecutadas en terreno o en forma remota (equipos de red, telemedición, prepago) y registradas solo cuando la ejecución real está confirmada.
- Ventanas de ejecución por servicio y jurisdicción (días y horarios permitidos, feriados y vísperas, emergencias declaradas) y preaviso mínimo con constancia antes de suspender; una orden fuera de ventana se reprograma.
- Cancelación automática de la orden de corte pendiente si el socio paga antes de su ejecución.
- Reconexión automática al regularizar, para los servicios suspendidos por mora; si el equipo remoto informa un error, la orden vuelve a pendiente y el servicio no se marca como reconectado.
- Cargo de reconexión solo si está habilitado con fundamento (por defecto, la reconexión es gratuita) y crédito por los días sin servicio en los abonos proporcionales, según la política.
- Modos de suspensión parcial cuando el servicio los admite (por ejemplo, reducción de velocidad o restricción de llamadas salientes).
- Baja solicitada desde el portal, la aplicación o el sitio público, sin cargo y sin condicionarla al pago de la deuda; suspensión voluntaria temporal habilitable por servicio y deshabilitada por defecto.

**Financiación y recupero**

- **Planes de pago y convenios** con simulador (anticipo, cuotas, tasa, costo financiero total), distintos sistemas de amortización, quitas, sellado, ajuste por índice, firma, caída automática, refinanciación, cancelación anticipada y anulación.
- Convenios con anticipo que quedan pendientes hasta su pago confirmado, condiciones especiales fuera del plan sujetas a aprobación, firma presencial o aceptación electrónica con código de verificación, y cuotas incluidas en la factura mensual o emitidas como documentos propios.
- Rehabilitación con aprobación de un convenio caído que se regulariza dentro del plazo de la política, y recálculo de cuotas impagas ante cambios de condición fiscal.
- Planes de cuotas de entidades financieras (tarjetas, bancos) con coeficientes y plazos; el mismo motor de cuotas se ofrece a las ventas financiadas sin mezclarlas con la regularización de deuda.
- Garantías y garantes. El depósito en garantía se aplica a la deuda o se devuelve en la baja, por defecto como crédito en la cuenta del socio.
- Incobrables, gestión externa y judicial, y prescripción de deuda con plazos diferenciados por tipo de obligación, sin borrar la historia económica.
- Expedientes de gestión externa con acceso de cada estudio solo a sus casos; los gastos y honorarios se trasladan al deudor solo con título que lo respalde.
- Segmentación de la deuda y expedientes de seguimiento con contactos, compromisos y próximos pasos.
- Tableros e informes de mora y financiación.

**Reglas que aplica el sistema**

- Un mismo tramo de interés de un documento nunca se cobra dos veces, cualquiera sea el canal o proceso que lo calcule.
- La deuda incluida en un convenio vigente no se reclama ni se notifica como deuda original: se reclaman las cuotas.
- Ningún servicio pasa a suspendido, cortado, reconectado o reactivado por la sola emisión de una orden o la sola confirmación de un pago: hace falta la confirmación de la ejecución real.
- La cooperativa configura sus condiciones, pero ninguna regla propia puede desactivar una restricción normativa.
- La solicitud de baja nunca genera cargo ni se condiciona al pago de la deuda; la deuda previa y los documentos históricos se conservan.
- En la cuenta unificada, la deuda de un servicio no habilita por sí sola la suspensión de otro (por ejemplo, la deuda de cementerio parque no permite suspender el agua o la electricidad), salvo que la cooperativa lo configure expresamente.
- La deuda de conceptos de terceros, como la tasa de alumbrado, no lleva a la instancia de corte del servicio salvo que el convenio lo habilite con una norma validada.
- La baja administrativa por mora requiere una política que la habilite, la instancia de corte cumplida y aprobación; nunca se aplica en forma masiva por saldo acumulado.
- La deuda prescripta o declarada incobrable no genera intereses ni avisos de mora, y ningún documento económico se borra: se anula o revierte con causa, autor y contrapartida.

**Lo que ve el socio**

- Su deuda vencida con el recargo calculado al día, el detalle del cálculo y los importes de cada vencimiento.
- Sus avisos de mora con la instancia, el vencimiento y la constancia, y el riesgo de suspensión con su fecha estimada.
- La simulación y la solicitud de un plan de pago entre los habilitados para autogestión, con aceptación, firma y pago del anticipo en línea.
- El registro de una promesa de pago, si la cooperativa lo permite.
- La solicitud de baja, suspensión voluntaria o reactivación, con el estado real del trámite ("reactivación en trámite" hasta la confirmación técnica).
- Sus convenios, las cuotas próximas a vencer y la cancelación anticipada con la bonificación correspondiente.

**Información e indicadores**

- Deuda vencida por tramo de antigüedad y composición de la deuda, coincidente con el saldo de la cuenta corriente a la fecha de corte.
- Cuentas por instancia, tasa de recupero por instancia y promesas cumplidas.
- Servicios a cortar por lote con meses de deuda, y cortes ejecutados, cancelados o bloqueados, con los tiempos de reconexión.
- Titulares notificados, notificaciones pendientes y excepciones por mora.
- Convenios vigentes y caídos, financiaciones por plan y cuotas adeudadas a una fecha.
- Deuda a prescribir e incobrables declarados y recuperados.
- Exportación de la condición de mora por cuenta para el ente regulador, cuando corresponda (por ejemplo, cuentas en riesgo de corte).

**Etapa de habilitación**: principal en la etapa 7 (Mora y atención avanzada, que cierra el recorrido completo de Internet); recargo entre vencimientos al emitir en la etapa 5; cálculo del recargo en caja y traslado de intereses en la etapa 6; particularidades de servicios medidos (ventanas de corte de electricidad, retiro de medidor y exportación al ente regulador) en la etapa 8; intereses sobre cheques diferidos y previsión contable de incobrables en la etapa 9; suspensión parcial de telefonía y televisión y efectos sobre la cobertura de servicios sociales en la etapa 11.

**Usuarios principales**: cobranza, atención al socio, gerencia, técnica (ejecución de cortes), socios (convenios y reactivación), responsables de recupero y estudios externos (gestión judicial), y consejo o gerencia para la aprobación de condiciones especiales, incobrables y prescripciones.

### 10.9 Atención al socio

**Propósito**: centralizar en un expediente único por gestión toda la atención que brinda la cooperativa a socios, usuarios, solicitantes sin cuenta y terceros, cualquiera sea el canal de ingreso, y mostrar en todo momento el avance real de cada gestión.

**Funciones principales**

**Gestiones y bandejas**

- Gestiones con número de seguimiento que el socio consulta y el personal atiende. El número es único en la cooperativa, nunca se reutiliza y su formato es configurable (continuo, por servicio y año, por tipo o separando reclamos del resto).
- Tipos de gestión ampliables por la cooperativa sin intervención técnica: solicitud comercial, reclamo técnico, reclamo comercial o de facturación, consulta, pedido, mesa de entradas, sugerencia o felicitación, con sus motivos, requisitos, prioridad y plazos.
- Vínculo de cada gestión con la persona, la cuenta, el servicio, el contrato, el inmueble o el comprobante que corresponda, validando que pertenezcan al solicitante.
- Conversación de la gestión que distingue los mensajes visibles para el socio de las notas internas del personal, con adjuntos (fotos y documentos) que se versionan y nunca se reemplazan en forma silenciosa.
- Bandejas de supervisión, de área y personales, con derivación y escalamiento. Toda gestión nueva ingresa a supervisión, que la clasifica y la deriva a un área; el área asigna un responsable, puede devolverla con motivo y el expediente conserva el mismo número e historial aunque cambie de área.
- Prioridad de cada gestión (crítica, alta, normal, baja, muy baja), tomada del motivo y corregible por supervisión.
- Listados agrupados por vencimiento (vencidas, hoy, mañana, próximos siete días, futuras y sin fecha), cola personal ordenable y acciones masivas (derivar, asignar, cambiar prioridad, vincular a un incidente o cerrar en lote).
- Solicitud de datos o documentación faltante con lista de faltantes, plazo y recordatorio, manteniendo la gestión pendiente y explicada al socio.
- Cierre con tipo de cierre (conforme, conforme con observaciones, sin solución, improcedente), causa cuando el motivo la exige, verificación opcional por una persona distinta de quien resolvió y conformidad del socio. La reapertura conserva el número dentro del plazo configurado; fuera de ese plazo se crea una gestión nueva vinculada.
- Respuestas rápidas con datos de la gestión, etiquetas libres y campos adicionales por tipo de gestión.
- Historial unificado de interacciones por persona, cuenta y servicio, con una vista integral del socio que reúne gestiones, conversaciones, turnos, comunicaciones y encuestas.
- Búsqueda global por número de gestión, persona, documento, cuenta, teléfono, correo electrónico o número de expediente.

**Solicitudes comerciales**

- **Solicitudes comerciales** de cualquier servicio: alta, baja (incluida la recepción pública sin registro), suspensión temporal, reactivación, cambio de titular, cambio de plan o categoría, traslado, cambio de equipo o medidor, adhesiones y actualización de datos.
- Requisitos propios por servicio y tipo de solicitud (datos obligatorios, documentación, factibilidad, aceptación de condiciones, firma). Una solicitud de alta puede registrarse aunque el solicitante todavía no tenga cuenta ni contrato.
- **Solicitar no equivale a ejecutar**: al admitirse una solicitud de alta se crea el contrato en estado solicitado, y cada efecto (activación, baja, cambio de titular, orden de trabajo, ajuste de factura) se pide al área responsable; la gestión muestra el resultado real y distingue la fecha solicitada de la fecha efectiva.
- Evaluación y aprobación con circuito de autorizaciones cuando el tipo de solicitud lo requiere, con seguimiento de cada pedido enviado a otras áreas y alerta si alguno falla.
- Información de cargos y condiciones antes de confirmar las solicitudes aranceladas, con registro de la aceptación del socio.
- Desistimiento o cancelación antes de la ejecución, con efectos según el avance (por ejemplo, cancelar una visita pendiente sin exigir retiro de equipos no instalados).
- Constancia descargable de toda solicitud con número, fecha, contenido, canal y código de verificación.
- Trámites presentados con vencimiento (por ejemplo, constancias para acceder a un beneficio), con aviso y acción al vencer, e informe de trámites presentados, no presentados y vencidos.
- Formularios imprimibles para firma del socio en mostrador (orden de trabajo, cambio de categoría, traslado).
- **Botón de baja** habilitado para Internet, televisión y telefonía, configurable en los demás servicios, con entrega de un código de seguimiento dentro de las 24 horas. El código se genera en el momento de la solicitud y se envía por el mismo medio por el que se pidió la baja.

**Reclamos e incidentes**

- **Reclamos** con plazos de respuesta, prioridad, avisos al socio de cada cambio, agrupación de afectados en un incidente común, detección de duplicados, reapertura, reincidencia y encuesta de satisfacción.
- Plazos de atención por tipo, motivo, prioridad y servicio, con objetivos de primera respuesta y de resolución, calendario hábil de la cooperativa, pausa mientras se espera al socio, alerta al acercarse el vencimiento y escalamiento al vencer.
- Solicitud de una orden de trabajo vinculada desde un reclamo técnico, con el estado de la orden visible en la gestión; los reclamos de facturación derivan en revisiones, ajustes o notas de crédito que emite facturación con aprobación.
- **Incidente común**: una sola gestión técnica para todos los afectados por una misma falla, con detección sugerida por concentración de reclamos en una zona o elemento de red, cálculo de los afectados y avisos de falla, avance y restablecimiento.
- **Protocolo de urgencias de seguridad** (fuga de gas, riesgo eléctrico, cable caído, pérdida grave de agua): prioridad crítica, aviso inmediato a la guardia técnica, mensaje de seguridad al socio con el teléfono de emergencia y plazos en tiempo corrido, incluidos feriados y horario nocturno.
- Reclamos de cloacas y alumbrado derivados según el convenio del servicio: los resuelve la cooperativa con una orden de trabajo o se derivan al municipio, registrando su respuesta.
- Plantilla precargada de plazos para reclamos de Internet, televisión y telefonía según el reglamento de clientes de servicios TIC, que la cooperativa adopta y ajusta, y campos específicos para reclamos exigidos por los reguladores.
- Carga rápida de reclamos desde la ficha del titular, resultado favorable o desfavorable al socio y registro de la conformidad o disconformidad informada en terreno.

**Canales, asistente e inteligencia artificial**

- **Canales de ingreso**: aplicación y portal del socio, WhatsApp, correo electrónico, SMS, teléfono, chat web, redes sociales, ventanilla y mesa de entradas.
- Bandeja única de conversaciones de todos los canales, con asignación a agentes, tiempo de espera y vínculo con la gestión; los correos con el número de gestión en el asunto se agregan a la gestión existente.
- **Asistente virtual** con WhatsApp Business y plantillas aprobadas. Consulta saldo, entrega segunda copia de factura y enlace de pago, abre reclamos e informa su estado, turnos y cortes programados, inicia el circuito de baja y responde preguntas frecuentes. Antes de mostrar información privada verifica la identidad del socio, y deriva a una persona con todo el contexto cuando no entiende el pedido o el socio lo solicita.
- Avisos salientes por WhatsApp con plantillas (gestión recibida, estado actualizado, documentación pendiente, resuelto, encuesta, turno llamado, incidente zonal, constancia de baja), respetando las preferencias de contacto y el horario de no molestar en los avisos que no son urgentes.
- Registro de llamadas de atención con motivo y resultado, e integración opcional con la central telefónica para identificar al socio que llama; atención telefónica automática opcional para consultas simples.
- **Inteligencia artificial supervisada** que clasifica, resume y sugiere respuestas, y analiza adjuntos. Solo propone: cada sugerencia queda registrada junto con la decisión de la persona, y la atención funciona con normalidad si la inteligencia artificial está desactivada o no responde.

**Atención presencial, documentación y tareas internas**

- **Atención presencial con turnero**: áreas, puestos, llamados en pantalla, derivaciones, turnos en línea y estadísticas.
- Turnos prioritarios (embarazo, discapacidad, adultos mayores y otros que defina la cooperativa), tiempo estimado de espera, pantallas con aviso por voz, tótem de autoservicio, fila virtual desde la aplicación o WhatsApp y reserva de turno con día y hora. La atención de ventanilla sin turnero está disponible desde el inicio.
- **Mesa de entradas** documental para notas de organismos, juzgados y proveedores, con número de expediente, pases internos con acuse de recibo, plazos de respuesta con alerta y registro de salidas, y libro de mesa de entradas exportable.
- Actividades y tareas internas recurrentes con recordatorios y tablero de control, con frecuencias configurables, márgenes de aviso, cierre con evidencia y aprobación opcional, y tareas puntuales vinculadas a una gestión.
- Circulares y correspondencia con plantillas, sobre universos filtrados de titulares, cuentas, servicios o deudas, por impresión, correo electrónico, SMS o WhatsApp, con informe de entrega.

**Reglas que aplica el sistema**

- Cerrar una gestión no modifica contratos, deudas ni comprobantes: esos cambios solo ocurren cuando el área responsable los ejecuta, y la gestión refleja el resultado.
- La solicitud de baja no genera cargo, no exige registro previo, pago de deuda ni aceptación de cargos; la deuda se informa aparte y se conserva.
- La baja de un servicio no da de baja el vínculo de asociado, ni la baja de asociado da de baja los servicios.
- La suspensión temporal a pedido del socio y sus eventuales costos solo se ofrecen en los servicios donde la cooperativa la habilitó; por defecto está deshabilitada.
- Una gestión con datos faltantes se recibe igual y queda identificada como pendiente de completar; si el socio no sabe identificar su cuenta, la gestión queda en supervisión para identificarla.
- Las notas internas nunca se muestran al socio, y la consulta pública de una gestión solo informa estado y fechas.
- Los duplicados se detectan dentro de una ventana configurable (90 días por defecto) y se propone vincularlos o fusionarlos, sin bloquear la recepción.
- Cerrar un incidente común no cierra solo las gestiones vinculadas: cada socio confirma la solución o su gestión sigue abierta si el domicilio continúa afectado.
- La inteligencia artificial se habilita únicamente con la aceptación de la cooperativa, nunca decide bajas, cobros, devoluciones ni temas de salud, y las gestiones de servicios sociales se tratan como sensibles, con acceso restringido.
- Las gestiones y mensajes nunca se borran; una gestión resuelta sin respuesta del socio se cierra automáticamente tras el plazo configurado (siete días por defecto).

**Lo que ve el socio**

- Sus gestiones con número, estado, fecha comprometida, mensajes visibles, adjuntos y constancias, con posibilidad de responder, adjuntar o desistir.
- Avisos de cada cambio de estado por su canal preferido y la lista de lo que falta presentar, con su plazo.
- La consulta del estado de una gestión iniciada sin registro, mediante el número y un código de verificación.
- El aviso de que su reclamo forma parte de un incidente común y las novedades de ese incidente.
- La encuesta de satisfacción al cerrar la gestión y, donde esté habilitado, la reserva de turnos y la fila virtual.

**Información e indicadores**

- Gestiones abiertas por estado, área, servicio y prioridad, con antigüedad y pendientes sin intervención por usuario.
- Tiempo de primera respuesta y de resolución, y cumplimiento de los plazos de atención comprometidos.
- Reincidencias, tasa de reapertura y resolución en el primer contacto.
- Satisfacción de los socios según las encuestas posteriores al cierre.
- Volumen por canal, servicio, tipo y motivo; incidentes con cantidad de afectados y duración.
- Bajas recibidas por canal y porcentaje de constancias entregadas dentro de las 24 horas.
- Resolución por el asistente virtual sin intervención humana y tasa de aceptación de las sugerencias de inteligencia artificial.
- Estadísticas del turnero, cumplimiento de actividades internas, mesa de entradas e indicadores de calidad de atención exigidos por los reguladores.

**Etapa de habilitación**: núcleo en la etapa 3 (gestiones, solicitudes comerciales, botón de baja, constancias y atención de ventanilla); reclamos, plazos de atención e incidentes en la etapa 4; atención por todos los canales, asistente virtual e inteligencia artificial en la etapa 7; trámites con vencimiento, reclamos regulatorios y urgencias de gas y electricidad en la etapa 8; turnero, mesa de entradas, actividades internas, integración telefónica, redes sociales y lectura de adjuntos por inteligencia artificial en la etapa 11.

**Usuarios principales**: atención al socio, supervisor de atención, todas las áreas que resuelven gestiones, socios. También recepcionistas y operadores de puesto del turnero, operador de mesa de entradas, responsables de actividades internas, operador de comunicaciones, auditores y solicitantes sin registro (baja y consulta pública).

### 10.10 Técnica, campo y redes

**Propósito**: gestionar la operación técnica desde que una solicitud necesita evaluarse en terreno hasta que el trabajo está ejecutado, revisado y con evidencia, y entregar a las demás áreas el hecho técnico con su fecha efectiva.

**Funciones principales**

**Factibilidad y órdenes de trabajo**

- **Factibilidad técnica** de conexiones, traslados y reconexiones, con inspección, dictamen y vigencia; obligatoria por defecto en Internet y servicios con red. El sistema consulta la cobertura y la capacidad disponible de la red, el dictamen exige motivo y responsable, la vigencia es de 90 días por defecto y una factibilidad anulada o ya usada no habilita un alta.
- Estimación técnica y presupuesto de conexión con materiales, mano de obra y obra necesaria, con plantillas reutilizables por servicio y tecnología; la estimación se envía al área comercial para emitir el presupuesto al socio.
- **Órdenes de trabajo** de todo tipo (sobre servicios, mantenimiento, derivadas de reclamos, inspecciones), con tareas, participantes, horas, vehículos, materiales, resolución y órdenes encadenadas. Cierre en dos pasos (ejecución y revisión del supervisor) en altas, desconexiones, reconexiones y cambios de medidor.
- Catálogo de operaciones técnicas configurable por servicio (alta, traslado, desconexión, reconexión, cambio y retiro de medidor, cambio de categoría o plan, cambio y retiro de equipo, inspección, reducción de caudal, entrega de gas envasado), cada una con su efecto, sus requisitos y sus avisos al socio.
- Origen de la orden registrado: administración, ficha del titular, atención al socio, mora, aplicación de campo, observación de lectura o reglas automáticas.
- Validaciones previas que impiden órdenes incoherentes (por ejemplo, reconectar un servicio que no está desconectado) y órdenes pendientes duplicadas de la misma operación para el mismo servicio.
- Prioridad y fecha objetivo de cada orden, heredadas del plazo del reclamo cuando la orden nace de una gestión de atención.
- Tablero de órdenes en columnas, lista y mapa, con asignación por arrastre a cuadrillas y filtros por estado, operación, zona, servicio y antigüedad; generación, cierre y anulación masivos con resultado por orden.
- Anulación de órdenes con reversión de los efectos ya aplicados y devolución de materiales mediante movimientos inversos, sin borrar registros.
- Cargos asociados a la orden (por ejemplo, derecho de conexión o visita improcedente) propuestos según las reglas tarifarias y enviados a facturación; técnica no calcula importes.
- Modelos de impresión por servicio y operación, formularios para firma del socio y mapa del punto de prestación opcional.

**Agenda, instalación y campo**

- **Agenda y visitas** por zonas y franjas horarias, con capacidad por recurso, reserva sin doble asignación, reprogramación y estado visible al socio. La franja elegida queda reservada durante unos minutos (15 por defecto) mientras se confirma, y el socio puede reprogramar o cancelar con una anticipación mínima (24 horas por defecto).
- Resultado de cada visita: realizada, fallida con motivo (sin acceso, ausente, falta de material, condición técnica, clima, rechazo), reprogramada o cancelada; una visita fallida no activa el servicio ni descuenta el equipo.
- **Instalación integral**: cita, equipo identificado en custodia del instalador, prueba, conformidad firmada por el socio, descuento único del stock, encuesta posterior y fecha efectiva de activación del servicio.
- Pruebas de instalación por tecnología (potencia de señal, velocidad, Wi-Fi), registro de sustitución cuando el equipo instalado difiere del reservado y vínculo del equipo con el contrato en la modalidad del plan, con comodato por defecto en Internet y televisión.
- Conformidad del receptor identificado (nombre, documento, relación con el titular) sobre una versión del detalle de instalación que queda inalterable; la disconformidad o la ausencia de firma tienen su propio procedimiento.
- Bandeja de instalaciones pendientes de cita, citadas, en curso, ejecutadas sin activación, con conflicto, activadas y con encuesta pendiente.
- Retiro posterior del equipo por baja, cambio o falla, con condición del equipo y devolución al depósito; devolver el equipo no equivale a la baja comercial.
- Cuadrillas, recursos de campo, profesionales matriculados y reglas de aviso por horario y feriados. El control del certificado de instalador es configurable por servicio y jurisdicción, y exige certificado vigente por defecto en electricidad en Córdoba y en gas.
- **Guardias técnicas** por servicio y zona, con titular, suplente y jefe de guardia, escalamiento automático si nadie acepta la urgencia y protocolo de emergencia con pasos obligatorios en terreno (arribo, verificación, corte preventivo, normalización y acta).
- **Aplicación de campo sin conexión** con fotos, ubicación, firma, materiales y resolución de conflictos de sincronización. Una sola aplicación sirve a técnicos, lecturistas, cobradores e inspectores, con la agenda del día, el mapa de visitas, formularios configurables y el registro de materiales desde la custodia del técnico.
- Conflictos de sincronización: si la orden cambió mientras el técnico trabajaba sin conexión (cancelada, reasignada, equipo o titular modificado), se conservan ambas versiones y un supervisor decide, sin sobrescribir.
- Registro y revocación remota de los dispositivos de campo, que elimina los datos guardados en el equipo revocado.

**Cortes, mantenimiento y redes**

- Cortes y reconexiones en terreno o remotos, decididos por mora o por atención. El resultado de cada orden (ejecutada o no ejecutada con motivo) vuelve al área que la decidió, y la reconexión remota es automática al confirmarse el pago cuando el servicio lo admite.
- Suspensión restringida cuando la política de mora lo define: reducción de caudal de agua sin bajar del mínimo vital, bloqueo de llamadas salientes en telefonía o grilla mínima en televisión.
- Mantenimiento de infraestructura: inventario técnico, planes preventivos, averías, interrupciones planificadas y costo por activo, con generación automática de las órdenes preventivas y aviso masivo a los contratos afectados por una interrupción planificada.
- **Redes y mapas** configurables para electricidad, agua, gas y telecomunicaciones, con red georreferenciada, vínculo de cada servicio con la red y **análisis de impacto** ante la falla de un elemento, con aviso masivo a los afectados.
- Red definida por la cooperativa: tipos de componente, capas, relaciones permitidas y atributos propios; los elementos con servicios conectados no se borran, se retiran con fecha y motivo; edición sobre el mapa y exportación en formatos geográficos de uso común.
- El análisis de impacto identifica, además de los contratos y titulares aguas abajo, los servicios críticos como electrodependientes y grandes usuarios.
- Equipos de red y centrales, con ubicación, capacidad de puertos para factibilidad y asignación, monitoreo de su estado vinculado a incidentes de zona y credenciales guardadas en forma protegida.
- Obras, loteos y contribución por mejoras con presupuesto, avance, costeo y padrón de beneficiarios. El prorrateo (por metros de frente, superficie, partes iguales o unidades) requiere una base aprobada (ordenanza, convenio o asamblea) y genera un plan de cuotas por beneficiario.
- Inspecciones por consumo no registrado con acta, fotos, precintos, descargo y propuesta de recupero aprobada.
- Controles de calidad del agua, habilitables por concesión: puntos y plan de muestreo, resultados de laboratorio con protocolo adjunto y acción correctiva obligatoria ante un resultado fuera de límite.

**Aprovisionamiento, telefonía y ubicación**

- **Aprovisionamiento automático de Internet y televisión** en los equipos de red (alta, corte, reconexión, cambio de plan y baja), con respaldo manual. Cada plan comercial se traduce en un perfil técnico; los pedidos se reintentan sin duplicarse y, si la integración falla, se genera una tarea manual con su evidencia.
- Diagnóstico del servicio desde la ficha (estado de la conexión, señal del equipo, última conexión) para el personal técnico y de atención con permiso.
- Telefonía: centrales, repartidores, numeración, líneas del abonado e importación de registros de llamadas de más de veinte modelos de central. Incluye la atribución de cada llamada a la línea vigente, la detección de duplicados, los archivos de operadoras, la reventa de telefonía móvil y la guía telefónica de quienes desean figurar.
- Ubicación de cada servicio en el mapa para factibilidad, agenda y órdenes. El punto de prestación se marca como confirmado, aproximado o pendiente, su corrección queda registrada y el sistema nunca inventa coordenadas.

**Reglas que aplica el sistema**

- Ningún corte ni reconexión se ejecuta sin una orden válida de mora o de atención al socio, y cada acción registra su origen.
- El servicio se activa con la instalación probada y el aprovisionamiento confirmado; nunca por la sola fecha de la cita. La revisión del supervisor es posterior y no demora la fecha efectiva de activación.
- Una visita fallida no activa el contrato ni descuenta el equipo, y una instalación nunca aplica dos equipos.
- Una sincronización repetida desde la aplicación de campo no genera otro cargo, otra instalación ni otra encuesta.
- El socio ve el estado "En camino" del técnico, pero nunca su ubicación en tiempo real.
- La encuesta de satisfacción es posterior e independiente de la activación; una calificación baja (2 o menos en una escala de 1 a 5, por defecto) abre una gestión de seguimiento.
- Una sospecha de consumo no registrado no es una infracción: el recupero exige procedimiento, evidencia, descargo del usuario y aprobación, y nunca es automático.
- La contribución por mejoras solo se cobra con base aprobada y criterio de prorrateo explícito.
- Las claves de acceso de los equipos y servicios nunca se muestran en catálogos, informes ni consultas externas; verlas requiere permiso y queda registrado.
- Las órdenes, notas, actas y evidencias no se borran: se anulan o se versionan con su historia.

**Lo que ve el socio**

- El resultado de la factibilidad, con su motivo.
- Los turnos disponibles para su domicilio, la confirmación de la cita, el recordatorio y la posibilidad de reprogramar o cancelar con la anticipación permitida.
- El estado de la visita (confirmada, asignada, en camino, en sitio, realizada, fallida o reprogramada) y las notas públicas de su orden de trabajo.
- El detalle de la instalación para firmar su conformidad y la encuesta posterior.
- Los avisos de interrupciones planificadas, fallas zonales y emergencias que lo afectan.
- El detalle de llamadas atribuidas a su línea, con el destino parcialmente oculto.

**Información e indicadores**

- Órdenes por estado, antigüedad y cumplimiento de la fecha objetivo, con tiempo medio de resolución.
- Instalaciones resueltas en la primera visita, visitas fallidas por motivo, puntualidad y ocupación de la agenda.
- Productividad por técnico y cuadrilla, costo de cada orden (materiales, horas y vehículos) y consumo de materiales.
- Factibilidades por resultado y tiempo de dictamen, y satisfacción posterior a la instalación.
- Sincronización de campo y conflictos abiertos, y aprovisionamiento con su tasa de éxito al primer intento.
- Cortes y reconexiones ejecutados por modalidad y tiempo entre la orden y la ejecución.
- Interrupciones con duración y contratos afectados, ocupación de la red, cumplimiento del mantenimiento preventivo, obras, inspecciones, calidad del agua y tiempos de respuesta de las guardias.
- Importación de registros de llamadas y exportaciones geográficas y regulatorias configurables.

**Etapa de habilitación**: núcleo en la etapa 4 (factibilidad, agenda, órdenes de trabajo, instalación, comodato, aplicación de campo, equipos de red y aprovisionamiento de Internet); cortes y reconexiones en la etapa 7; mantenimiento, redes y mapas de los servicios medidos, obras, inspecciones, calidad del agua y guardias de gas y electricidad en la etapa 8; entrega de gas envasado en la etapa 9; telefonía y aprovisionamiento de televisión en la etapa 11.

**Usuarios principales**: técnicos, supervisor técnico, atención al socio, socios (coordinación de visitas y conformidad). También cuadrillas y guardias, lecturistas, cobradores e inspectores que usan la aplicación de campo, responsables de red y mantenimiento, depósito y área de obras.

### 10.11 Ventas y presupuestos

**Propósito**: gestionar todo lo que la cooperativa vende o cobra por única vez, fuera de la facturación periódica del servicio, con trazabilidad desde el origen de la operación hasta su comprobante, su entrega y su cobro.

**Funciones principales**

**Cargos por operaciones con titulares**

- Cargos por operaciones con titulares (derecho de conexión, instalación, reconexión, cambio de titular, traslado), cobrados con el servicio, al contado o financiados. La instalación de Internet se factura en la primera factura posterior a la orden de trabajo confirmada.
- Generación automática del cargo cuando ocurre el hecho que lo vuelve exigible (aprobación de la solicitud, orden de trabajo confirmada, instalación probada o inicio de período), además de la carga manual con permiso.
- Valorización con la tarifa vigente a la fecha de ese hecho; un cambio tarifario posterior no modifica el cargo ya valorizado.
- Bonificación o anulación del cargo antes de facturarlo, con motivo y aprobación según el monto; después de facturado, la corrección se hace con nota de crédito.
- Cargos y créditos de reconexión: débito si el servicio reconectado no se facturó en el período y crédito por los días sin servicio, según la configuración.
- Simulación del primer cobro antes de confirmar una contratación, con el abono proporcional y la instalación.

**Presupuestos**

- **Presupuestos** con condiciones de venta, envío, **aceptación en línea** y conversión automática en orden de trabajo y factura.
- Presupuestos dirigidos a una cuenta, a una persona registrada o a un interesado sin cuenta, con validez, vendedor, condición de venta, moneda, notas y vínculo opcional con una obra o una orden de trabajo.
- Ítems agrupados en conjuntos (por ejemplo, "Tablero" o "Acometida"), precio sugerido a partir del costo de los componentes y el margen, y prorrateo de flete y molde entre los ítems.
- Validaciones configurables al presupuestar (servicios activos, deuda, propiedades de la cuenta), como advertencia o bloqueo, y control de que no exista otro presupuesto vigente de la misma cuenta con los mismos productos.
- Versiones: modificar un presupuesto enviado crea una nueva versión, la anterior queda consultable y la aceptación siempre corresponde a una versión exacta.
- Vencimiento automático al pasar la fecha de validez y renovación con precios actualizados.
- Al aceptarse, creación de la gestión de atención y de la orden de trabajo con la mano de obra y los materiales, y reserva del stock comprometido.
- **Flujo continuo** presupuesto, aceptación, orden de trabajo, consumo de materiales y factura en un único expediente: las diferencias entre lo presupuestado y lo ejecutado se facturan según la condición aceptada (precio cerrado o a liquidar) y las que superan la tolerancia requieren aprobación.
- Presupuestos y ventas en terreno desde la aplicación de campo, con productos habilitados para ese canal y sin duplicados al sincronizar.
- Anticipos sobre un presupuesto, aplicados al facturar.
- Alerta en la ficha de atención cuando la cuenta tiene un presupuesto pendiente.

**Ventas, entregas y mostrador**

- Venta de productos y servicios adicionales: pedidos, disponibilidad, entregas parciales, devoluciones, listas de precios, descuentos y recargos, vendedores.
- Listas de precios por vigencia, moneda y canal (mostrador, campo, portal), independientes de las tarifas de los servicios, con actualización masiva por porcentaje, coeficiente, cotización del dólar o monto fijo y vista previa antes de confirmar.
- Reglas de descuento o recargo por producto según el tipo de titular, la forma de pago, la deuda y la cantidad comprada en el mes.
- Reserva de stock al confirmar la venta y egreso al entregar; consulta de lo vendido y no entregado; control de que un equipo serializado esté disponible y no instalado en otro servicio.
- Control del riesgo crediticio antes de vender a crédito, con autorización de excepciones.
- Devoluciones con reingreso al stock, nota de crédito y ajuste de las cuotas según su estado de cobro.
- **Punto de venta de mostrador**.
- El punto de venta trabaja con apertura y cierre de sesión con arqueo, lector de código de barras, cobro con varios medios y emisión inmediata de la factura electrónica y el ticket.
- Venta rápida de mostrador en una sola pantalla, con cuenta y vendedor por defecto.
- Rendición de viajes y fletes.
- Vendedores con sus datos y vínculo opcional con un usuario o empleado, e informe de ventas y presupuestos por vendedor.

**Financiación y facturación**

- Financiación de ventas con cronograma de cuotas, intereses e impuestos por cuota y cancelación anticipada.
- Planes de financiación configurables (cuotas, anticipo mínimo, tasa, método, sellado, cuota máxima) y simulación con tasa nominal, tasa efectiva anual y costo financiero total antes de confirmar.
- Estados de cada cuota (programada, facturada, cobrada parcialmente, cobrada, cancelada anticipadamente o anulada), con el cobro informado por la cuenta corriente.
- Reglas de inclusión de ventas y cuotas en la factura del servicio o en documentos propios. Por defecto se emiten en documentos propios que se presentan juntos en el resumen de cuenta; dentro de la factura del servicio solo viajan los conceptos vinculados a ese servicio y con validación fiscal registrada por la cooperativa.
- Modificación masiva de cuotas pendientes (importe, vencimientos, alícuotas) con permiso, nota en la cuenta y registro del ajuste.
- Espera de la autorización fiscal antes de entregar una venta como facturada, con el tiempo máximo y la contingencia que define facturación.

**Reglas que aplica el sistema**

- Un mismo hecho genera un único cargo, aunque el aviso llegue repetido o la aplicación de campo sincronice dos veces.
- Un cargo financiado anula la alternativa de cobrarlo al contado: nunca coexisten dos formas de cobro para la misma operación.
- La financiación de una venta nueva es una operación distinta de la regularización de deuda anterior: tiene otra numeración, otros reportes y otras reglas, y nunca incluye deuda previa.
- El costo de adquirir un equipo no se transforma por sí solo en un cargo al socio; su cobro depende de la modalidad del producto (venta, comodato u otra).
- Quien crea un presupuesto o una venta con descuento fuera de política no puede aprobarlo.
- Solo se acepta en línea una versión vigente y no vencida, con identidad verificada (socio autenticado o código enviado al contacto registrado), y se guarda la evidencia de la aceptación.
- Toda oferta financiada al consumidor final muestra la tasa efectiva anual y el costo financiero total.
- Los documentos de venta nunca se borran: se anulan o se revierten con vínculo al original, y no se modifican operaciones de un período de ventas cerrado.
- Las acciones masivas (anulación por rango, cambio de estado, modificación de cuotas, actualización de precios) exigen permiso y registran usuario y fecha.

**Lo que ve el socio**

- Cada cargo por operación con su origen, estado, modalidad de cobro y cronograma de cuotas.
- Sus presupuestos, con el documento, la validez y la posibilidad de aceptarlos o rechazarlos con motivo; quien no tiene cuenta lo hace desde un enlace personal con verificación.
- Avisos de presupuesto enviado, próximo a vencer y aceptado, de orden de trabajo programada, de factura emitida y de cuota por vencer.
- La simulación del plan de cuotas con su costo financiero total antes de aceptar.

**Información e indicadores**

- Cargos por operación pendientes y facturados, por tipo y servicio.
- Presupuestos por estado y vendedor, y conversión (aceptados sobre enviados) con el tiempo medio hasta la aceptación.
- Ventas por producto, rubro, servicio, sucursal, vendedor y forma de pago.
- Productos facturados y no entregados, devoluciones por motivo y comprobantes pendientes de facturar.
- Cuotas facturadas y pendientes, y cartera de cuotas comerciales por antigüedad, separada de los convenios de deuda.
- Liquidación de crédito de cada venta financiada, arqueo del punto de venta y rendición de viajes.

**Etapa de habilitación**: núcleo en la etapa 5 (cargos por operaciones con titulares, entre ellos la instalación de Internet, planes de financiación, cronograma de cuotas y reglas de inclusión en la factura); cargos y créditos de reconexión en la etapa 7; cargos de conexión de los servicios medidos en la etapa 8; presupuestos con aceptación en línea, venta de productos, punto de venta de mostrador, cancelación anticipada y rendición de viajes en la etapa 9; impresión de tickets con el hardware de mostrador en la etapa 11.

**Usuarios principales**: atención al socio, cajeros, vendedores, socios (aceptación de presupuestos). También supervisor comercial, administrativos de facturación, aprobadores, técnicos de campo que presupuestan en terreno, depósito y logística, e interesados sin cuenta que reciben un presupuesto.

### 10.12 Compras y proveedores

**Propósito**: conducir la adquisición de bienes y servicios desde la necesidad interna hasta la obligación de pago, con documentos y estados explícitos en cada paso y la relación completa con cada proveedor.

**Funciones principales**

**Proveedores**

- Proveedores con datos fiscales, cuentas bancarias validadas, regímenes de retención, rubros, personas autorizadas, valoraciones y correspondencia.
- Validación del CUIT y consulta opcional del padrón de ARCA al dar de alta o modificar un proveedor; un proveedor bloqueado no recibe órdenes de compra ni órdenes de pago.
- Cuentas bancarias del proveedor cuyo alta o cambio requiere la aprobación de otro usuario y se avisa al proveedor, como prevención de fraude.
- Documentación del proveedor con vencimiento (constancias, seguros, habilitaciones) y alertas; un documento obligatorio vencido puede bloquear nuevas órdenes si la cooperativa lo define.
- Cuenta corriente del proveedor con comprobantes, pagos, anticipos y notas de crédito, saldos vencidos y a vencer a una fecha de corte.
- Indicadores automáticos de cumplimiento del proveedor (entregas a término, diferencias de cantidad y precio, devoluciones), además de las valoraciones del personal.
- Proveedores que también son socios o empleados: vínculo con su ficha y, en el caso de los empleados, datos visibles solo con permiso.

**Circuito de compra**

- Circuito formal: solicitud interna, pedido de cotización, concurso o licitación, orden de compra (incluidas órdenes abiertas con liberaciones), recepción, comprobante del proveedor y orden de pago.
- Solicitudes internas originadas manualmente, por punto de reposición del stock, por materiales faltantes de una orden de trabajo u obra, o por fabricación, con criticidad, fecha requerida y aviso si ya existe un pedido abierto del mismo producto.
- Pedidos de cotización a varios proveedores, carga de precios por el comprador o por el proveedor en su portal, cuadro comparativo por ítem y justificación cuando no se adjudica el menor precio.
- Concursos y licitaciones con invitación, pliego, ofertas cerradas hasta la fecha de apertura, acta de apertura y planilla de adjudicación.
- Envío de la orden de compra al proveedor por correo electrónico y por el portal, con confirmación de recepción y fecha comprometida; modificar una orden aprobada crea una nueva versión que vuelve a aprobación si cambia el importe, el proveedor o las condiciones.
- Recepción parcial contra una o varias órdenes, conformidad de servicios sin entrega material, tolerancia configurable para excesos de entrega y devoluciones al proveedor.
- Compras asignadas a servicios, destinos, órdenes de trabajo, obras y centros de costo.
- Distribución explícita de las compras compartidas entre servicios, que suma el 100 % sin duplicar el total en los informes por servicio.
- Aprobaciones por monto y nivel con separación de funciones, con doble aprobación opcional de las solicitudes internas.

**Comprobantes, control y pago**

- Registro de facturas, notas de débito y crédito, tickets y recibos de proveedores con importes por alícuota, percepciones e impuestos, controles de totales y de duplicados, consulta de la autorización del comprobante en ARCA y período contable abierto.
- **Control de tres vías** entre orden de compra, recepción y factura, con tolerancias y bloqueo de pago ante diferencias.
- Cada diferencia fuera de tolerancia genera una excepción con su tipo, importe en disputa, causa y decisión aprobada (aceptar, reclamar nota de crédito o rechazar); también se admite la factura anticipada, retenida hasta la recepción.
- Compras sin orden previa solo para categorías definidas (servicios públicos, impuestos, caja chica, gastos menores), con aprobación posterior e informe de facturas sin orden.
- Órdenes de pago con aplicación de facturas, anticipos y retenciones calculadas automáticamente.
- La orden de pago muestra, por régimen, la base, el mínimo, la escala, lo acumulado y el importe retenido, y el neto a pagar; al aprobarse se emiten los certificados de retención y la orden pasa a tesorería, que ejecuta el pago.
- Anticipos a proveedores sin factura y su aplicación posterior; anulación de órdenes de pago que repone exactamente los saldos y anula las retenciones sin borrarlas.
- Previsiones de pagos periódicos (alquileres, servicios) para la proyección de tesorería y publicación del compromiso de fondos al aprobar cada orden de compra.

**Carga automatizada y compras especiales**

- Carga automatizada: importación de comprobantes informados al organismo fiscal, **portal de proveedores** y lectura de facturas por inteligencia artificial que una persona confirma.
- Los comprobantes de Mis Comprobantes de ARCA que no figuran en el sistema se cargan como borradores para revisión, con un informe de diferencias entre lo registrado y lo informado.
- En el portal, cada proveedor ingresa con usuario propio por invitación, presenta cotizaciones y comprobantes con su archivo, ve sus órdenes y el estado de cada comprobante y descarga sus certificados de retención y constancias de pago.
- Registro de la factura del mayorista de energía y gas, y liquidación de derechos de señales de televisión.
- La factura mayorista se controla renglón por renglón contra la medición propia de la cooperativa en el mismo punto y período, con tolerancia configurable, y alimenta el balance mensual de energía o gas comprado frente a facturado, con el porcentaje de pérdidas.
- Los derechos de señales se liquidan por programadora y paquete según los abonados activos a la fecha de corte, con mínimo garantizado, y la factura posterior de la programadora se concilia contra esa liquidación.

**Reglas que aplica el sistema**

- Aprobar una orden de compra no equivale a recibir la mercadería: la compra autoriza el pedido, la recepción confirma la entrega, la factura registra la obligación y tesorería paga.
- Una misma persona no puede, sobre una misma operación, solicitar y aprobar, crear y aprobar la orden, aprobarla y recibirla, ni registrar la factura y aprobar su excepción o el pago.
- Una factura con una excepción abierta no se incluye en una orden de pago, y una orden de pago nunca usa una cuenta bancaria con cambio pendiente de aprobación.
- La recepción no mueve el stock por sí misma: el ingreso físico lo confirma el depósito.
- Los comprobantes importados desde ARCA o leídos por inteligencia artificial solo crean borradores; ningún comprobante se registra sin la confirmación de una persona.
- Los comprobantes y las órdenes de pago nunca se borran: se anulan con motivo, y no se pisa el vencimiento original de la factura al pagarla.
- El ajuste manual de una retención exige permiso, motivo y aprobación, y conserva el valor calculado junto al ajustado.
- La factura mayorista no se habilita para pago mientras tenga renglones sin controlar contra la medición propia o diferencias sin decidir, y ese costo nunca se traslada como cargo al usuario desde compras.
- Las acciones masivas (aprobar solicitudes u órdenes, habilitar pagos) exigen el mismo permiso que la acción individual y registran usuario y fecha por documento.

**Información e indicadores**

- Solicitudes por estado y aprobación, comparativos de cotizaciones y órdenes de compra pendientes de recepción o atrasadas.
- Recepciones pendientes de facturar, facturas sin orden de compra y excepciones del control de tres vías por tipo, importe y antigüedad.
- Cuenta corriente y antigüedad de saldos de proveedores por vencimiento original.
- Compras por servicio, centro de costo, rubro, proveedor y producto, sin duplicar las compras compartidas.
- Importes comprometidos, devengados y pagados, previsiones de pagos y pagos pendientes o diferidos.
- Desempeño de proveedores, retenciones practicadas, costo de reposición y consumo de combustible.
- Comprobantes informados en ARCA frente a los registrados, balance de energía y gas comprado frente a facturado, y liquidaciones de derechos de señales.

**Etapa de habilitación**: un padrón mínimo de proveedores y el ingreso de equipos serializados de Internet en la etapa 4; circuito completo de compras, control de tres vías, órdenes de pago, portal de proveedores y facturas de mayoristas de energía y gas en la etapa 9; integración con sueldos en la etapa 10; liquidación de derechos de señales de televisión en la etapa 11; lectura de facturas por inteligencia artificial, opcional, en la etapa 12. Hasta el reemplazo administrativo, las compras de una cooperativa que migra pueden seguir en su sistema actual.

**Usuarios principales**: compras, depósito, tesorería, contador, gerencia, proveedores. También solicitantes de todas las áreas, aprobadores por monto, responsables de servicio que dan conformidad, administración de cuentas a pagar, responsable de pagos y auditores.

### 10.13 Stock, bienes de uso y fabricación

**Propósito**: controlar con una existencia única por ubicación, número de serie y lote todo lo que la cooperativa tiene, custodia, entrega, consume, presta, vende, repara, fabrica o amortiza: materiales de red y de obra, equipos de clientes, herramientas, repuestos y bienes de uso.

**Funciones principales**

**Artículos, depósitos y movimientos**

- Ficha del artículo con código, tipo, clasificación, rubro, unidad de stock, marca, modelo, código de barras, características técnicas y adjuntos, indicando si lleva stock, si se controla por número de serie o por lote, si es bien de uso, fabricable, kit o elegible para comodato.
- Unidades de compra, de stock y de consumo con su equivalencia (por ejemplo, una caja de cien conectores ingresa cien unidades); kits que se descomponen en sus componentes al moverse; importación masiva de artículos, series y saldos iniciales desde planilla con vista previa de errores.
- Ubicación y responsable de cada unidad en todo momento: depósito, sucursal, cuadrilla, técnico, vehículo, proveedor, reparación o domicilio del socio.
- Depósitos de distintos tipos (central, sucursal, cuadrilla, técnico, vehículo, producción, tránsito, reparación, en proveedor, cuarentena, consignación y descarte), con ubicaciones internas jerárquicas, depósitos por defecto por sucursal y por usuario, y acceso de cada usuario limitado a sus depósitos.
- Remitos, transferencias entre depósitos, inventarios y ajustes.
- Transferencias con tránsito opcional, recepción parcial con registro de diferencias y constancia de quién recibió físicamente cada entrega.
- Estados de la existencia distinguibles en todo momento: disponible, reservado, en tránsito, en custodia de cuadrilla o técnico, instalado en el domicilio del socio, en reparación, en proveedor, en cuarentena, consignado, consumido o dado de baja.
- Consulta de disponibilidad por artículo, servicio, depósito y cuadrilla; kárdex por artículo con saldo y costo; impresión y escaneo de etiquetas con código de barras o QR desde la administración y desde la aplicación de campo.

**Equipos de clientes y trabajo de campo**

- Seguimiento de los equipos de clientes (módem, ONU, router, decodificador, medidor) con hitos de reserva, entrega al instalador, instalación y retiro, sin descontar dos veces, también cuando el técnico trabaja sin conexión.
- Identificadores únicos por equipo (número de serie, dirección MAC, número de serie de la ONU, número de medidor o matrícula) y búsqueda por cualquiera de ellos desde la administración, la aplicación de campo y la atención al socio.
- Trayectoria completa de cada equipo: ingreso, reservas, entregas, instalaciones, retiros, reparaciones, inspecciones, ensayos y adjuntos, con fecha, responsable y documento de respaldo.
- Reservas de materiales y equipos para órdenes de trabajo, obras, presupuestos o fabricación, que reducen el disponible sin mover la existencia física y se liberan al cancelar o reprogramar el trabajo.
- Entrega a cuadrillas y técnicos como transferencia de custodia, con aceptación en la aplicación de campo; cada técnico consulta su propio stock también sin conexión.
- Registro desde la orden de trabajo del consumo de materiales y de la instalación de equipos escaneando la serie; al instalar, los identificadores del equipo pasan automáticamente al aprovisionamiento de la red.
- Tratamiento de la visita fallida, sustitución de un equipo por otro con validación del supervisor, devolución de sobrantes y rendición de cuadrilla que concilia lo entregado, consumido, instalado y devuelto.
- Modalidad del equipo (comodato, préstamo, alquiler, venta o propiedad del socio) y su historia completa.
- Comodato por defecto en Internet y televisión, configurable por plan, con constancia vinculada a la conformidad de instalación firmada por el socio.
- Cambio de equipo en una sola orden de trabajo, retiro en bajas y cortes con registro de la condición del equipo y sus accesorios, devolución en mostrador con comprobante y bandeja de equipos pendientes de devolución con plazo.
- Propuesta de cargo por equipo no devuelto, valorizado al costo de reposición o al importe que la cooperativa configure, que solo genera deuda después de su aprobación y facturación.
- Registro opcional de los equipos propiedad del socio (dirección MAC y número de serie) para soporte y aprovisionamiento, sin incluirlos en el stock valorizado.
- Movimientos de envases llenos y vacíos en la entrega de gas envasado, con saldo de envases por contrato, cuando la cooperativa habilita esa modalidad.

**Inventario, reposición y valorización**

- Inventario físico total, parcial o cíclico por depósito, ubicación, rubro o cuadrilla, con conteo opcionalmente a ciegas desde la administración o desde la aplicación con escaneo, y listado de series encontradas y faltantes.
- Ajustes con motivo tipificado (faltante, sobrante, rotura, vencimiento, robo, error de carga o diferencia de inventario), evidencia adjunta y aprobación según umbral de cantidad o importe.
- Stock mínimo, máximo y punto de pedido por artículo y depósito, con sugerencia de compra redondeada a bultos, proveedor habitual y últimas compras, que se envía a compras como solicitud.
- Lotes con fecha de fabricación y de vencimiento, sugerencia de consumo del vencimiento más próximo y bloqueo configurable de lotes vencidos.
- Valorización con método de costeo aprobado: costo promedio ponderado por defecto, primero entrado primero salido como opción e identificación por número de serie para los equipos, según lo que defina y valide la cooperativa.
- Costo actualizado en cada movimiento, ajuste por diferencias entre el precio de recepción y el de la factura sin reescribir movimientos anteriores, revaluación por índice, cierre de stock por período y valorización a una fecha con métodos alternativos solo para análisis.
- Asociación del stock y su consumo a los servicios de la cooperativa.
- Destino obligatorio en cada consumo (orden de trabajo, orden de mantenimiento, obra, contrato, servicio, centro de costo o unidad de gasto) y unidades de gasto para el consumo interno de las áreas.

**Bienes de uso**

- **Bienes de uso** con amortización, mejoras, bajas y distribución por centros de costo.
- Ficha del bien con número, serie, fecha de compra y de afectación, factura de compra, valor de origen, vida útil, valor residual, amortización acumulada, sucursal, ubicación física y responsable, con historial de cada cambio.
- Alta desde el ingreso de stock de un artículo marcado como bien de uso, como borrador que el responsable confirma, o en forma manual.
- Amortización lineal mensual con prorrateo por días en los meses parciales, corrida simulable y reversible, y valores históricos y ajustados por inflación.
- Baja por venta, destrucción, robo, obsolescencia o donación con valor de recupero y resultado; cuadro de bienes de uso y cuadro de amortizaciones por rubro y ejercicio.

**Garantías, reparaciones y fabricación**

- **Garantías y reparaciones** con proveedores vinculadas al número de serie, y recepción técnica de equipos de clientes.
- Casos de garantía y reparación con estados configurables, historial y aviso al proveedor o al contacto en cada cambio de estado; retorno reparado, reemplazo por una unidad nueva enlazada a la original o rechazo.
- Garantía del proveedor y garantía de venta al socio por número de serie, con aviso de garantía vigente al abrir un caso.
- Revisión de los equipos retirados con decisión de reutilizar, reparar, enviar a garantía o descartar, y disposición final con constancia.
- **Fabricación**: estructuras de productos, etapas, órdenes y partes de producción para cooperativas que fabrican medidores armados, tableros, postes, bloques o pilares.
- Órdenes de fabricación generadas, lanzadas, finalizadas, canceladas o anuladas; costo del producto igual a componentes más mano de obra más costo fijo; numeración de series de los productos fabricados; cálculo de necesidades de componentes que genera solicitudes de compra por proveedor.
- Materiales para planes de vivienda con reserva por tipología, retiro y devolución.

**Reglas que aplica el sistema**

- Entregar materiales o equipos a una cuadrilla no es consumo: la existencia sigue siendo de la cooperativa, a cargo del técnico. Un equipo en comodato sigue siendo existencia propia y se valoriza; solo el consumo o la venta dan de baja la existencia.
- Nada se descuenta dos veces: cada operación de campo se registra una sola vez aunque se sincronice varias veces, y el consumo desde la orden de trabajo descuenta solo de la custodia del técnico, nunca otra vez del depósito central.
- Ningún movimiento se edita ni se borra; se anula con un movimiento inverso, con motivo y permiso. No se aceptan operaciones con fecha en un período de stock cerrado.
- Un equipo con número de serie nunca queda en dos ubicaciones ni instalado en dos contratos a la vez; para el resto de los artículos, la cooperativa define por tipo de operación si el saldo negativo se bloquea, se advierte o se permite.
- Los ajustes y las diferencias de inventario o de rendición de cuadrilla requieren motivo, evidencia y aprobación según umbral; sin aprobación no modifican la existencia. Antes de cambiar el responsable de un depósito de cuadrilla o desvincular a un técnico se exige la rendición cerrada.
- Un equipo retirado queda pendiente de revisión y no vuelve a estar disponible sin una decisión registrada. La baja comercial del servicio no cierra la asignación del equipo: solo la cierra el retiro o la devolución, y el cargo por equipo no devuelto nunca es automático.
- El ingreso de mercadería por compras solo ocurre con la recepción física confirmada, y la sugerencia de compra se convierte en solicitud de compra, nunca en orden de compra directa.
- El alta de un bien de uso desde el stock se propone como borrador y nunca se activa por inferencia; un bien con amortizaciones registradas no se elimina, se anula con reversión automática.

**Lo que ve el socio**

- Los equipos que tiene en comodato o préstamo: modelo, número de serie, fecha de entrega, modalidad y constancia firmada.
- Cómo y dónde devolver el equipo cuando da de baja el servicio, y el comprobante de devolución cuando lo entrega en la oficina.
- Únicamente los equipos de sus propios contratos.

**Información e indicadores**

- Existencias por estado y por custodia (depósitos, cuadrillas, domicilios de socios y proveedores), kárdex por artículo y trayectoria de cada equipo.
- Equipos en domicilios por servicio, modelo, modalidad y zona; equipos pendientes de devolución con días de atraso y valor de reposición; saldo en custodia por cuadrilla.
- Materiales reservados, entregados, consumidos y devueltos por orden de trabajo, con su costo; consumos por destino y stock y consumo por servicio, donde la suma de los servicios iguala el total.
- Valorización de existencias y su conciliación con contabilidad; artículos bajo mínimo con sugerencias; ajustes, resultado de inventarios y lotes por vencer.
- Cuadro de bienes de uso, cuadro de amortizaciones y amortización por centro de costo.
- Casos de garantía por estado y proveedor, tasa de falla por modelo de equipo y recepciones técnicas.
- En fabricación: órdenes y su avance, insumos pendientes de utilizar, productos dañados y series generadas.
- Indicadores de rotación, días de cobertura, exactitud de inventario, diferencias de rendición por cuadrilla y tiempo promedio de reparación.

**Etapa de habilitación**: núcleo de stock (artículos, depósitos incluidos los de cuadrilla y el domicilio del socio, movimientos, series, reservas, consumo desde la aplicación de campo, comodato, retiro y devolución) en la etapa 4; venta de equipos en la etapa 5; cargo por equipo no devuelto en la etapa 7; stock completo, inventarios, valorización, bienes de uso, garantías y reparaciones en la etapa 9; fabricación y materiales de vivienda en la etapa 11; recepción de vales desde sistemas externos y migración repetible en la etapa 12.

**Usuarios principales**: depósito, técnicos, compras, contador; también jefes de cuadrilla, responsables de bienes de uso, servicio técnico, jefe de planta de fabricación, atención al socio y auditores (solo consulta).

### 10.14 Tesorería y bancos

**Propósito**: administrar el dinero de la cooperativa con trazabilidad completa, desde el hecho que lo origina hasta su acreditación o débito bancario y su efecto contable, y mostrar cuánto hay disponible, qué está en tránsito, qué compromisos vienen y cuál será la posición proyectada.

**Funciones principales**

**Cuentas y movimientos**

- Cuentas bancarias y demás cuentas financieras.
- Tipos de cuenta: cuenta corriente, caja de ahorro, cuenta en moneda extranjera, cuenta virtual, caja de tesorería por sucursal, caja de pagos, cuenta para valores rechazados y cuenta de tránsito.
- Datos de cada cuenta bancaria: entidad, sucursal, número, CBU validado, alias, moneda, firmantes autorizados con vigencia y tope, y medios que admite (cheque, cheque electrónico, transferencia, VEP, débito automático, depósito o archivo de pagos); el saldo inicial se registra como movimiento de apertura.
- Movimientos de tesorería y bancarios.
- Operaciones guiadas paso a paso que combinan ingresos y egresos: depósitos, transferencias entre cuentas propias, extracciones, ingresos y egresos excepcionales, cambio de valores, diferencias de caja, gastos bancarios, intereses y débitos automáticos.
- Saldo operativo (por fecha valor), saldo contable (por fecha de emisión) y saldo a futuro de cada cuenta, libro de bancos y libro de tesorería, con numeración de operaciones sin saltos ni duplicados.
- Clasificación de los gastos financieros (comisiones, mantenimiento, impuesto sobre los débitos y créditos bancarios, IVA sobre comisiones, intereses y otros cargos) sin alícuotas fijas en el sistema.
- Períodos de bancos y de tesorería con cierre y reapertura controlada, y validación de feriados según la política de la cooperativa.

**Conciliación bancaria**

- **Conciliación bancaria asistida** con importación de extractos y conexión con la banca electrónica empresarial.
- Importación de extractos en planilla, CSV o texto con perfiles por banco, detección de líneas duplicadas y control de continuidad entre el saldo final de un extracto y el inicial del siguiente.
- Propuestas automáticas de emparejamiento por reglas configurables (importe, fecha, referencia, CUIT del ordenante, número de cheque o de transferencia) que el usuario confirma, y conciliación manual de grupos de varias líneas.
- Creación de movimientos desde líneas del extracto no registradas (gastos, intereses, débitos automáticos) y envío de los créditos no identificados a la bandeja de pagos pendientes de identificación de cobranza.
- Conciliación de la acreditación neta de cada pasarela o ente recaudador contra el neto esperado, de los depósitos, de los débitos de cheques propios y de los archivos de pago.
- Cierre de la conciliación de cada período con reporte firmado y partidas pendientes por antigüedad; reapertura solo con permiso del supervisor.
- Conexión con Interbanking para consultar saldos, descargar diariamente los movimientos de las cuentas vinculadas y traducir sus códigos de operación a las categorías de la cooperativa.

**Valores, tarjetas y retenciones**

- Cheques de terceros físicos y electrónicos, cheques propios, chequeras y cheques electrónicos emitidos.
- Ciclo de vida del cheque de terceros (recibido, en cartera, depositado, acreditado, entregado a proveedor, rechazado, recuperado), con control de cheques duplicados, libradores bloqueados y cheques vencidos, y aviso a cobranza para la nota de débito al socio cuando un cheque es rechazado.
- Chequeras físicas y electrónicas; emisión, impresión, reemplazo, anulación y débito de cheques propios; aceptación o repudio, endoso, depósito, custodia y negociación de cheques electrónicos.
- Cupones de tarjetas y sus liquidaciones.
- Presentación de cupones en lotes, registro de la liquidación con neto acreditado, comisiones, impuestos y retenciones, y aviso a cobranza cuando un cupón es rechazado.
- Retenciones recibidas y su destino.
- Cartera de retenciones sufridas con número de certificado, sin duplicados, y presentación al área impositiva para su cómputo en las declaraciones juradas.

**Cajas, rendiciones y pagos**

- Cajas para pagos a proveedores y ejecución de las órdenes de pago.
- Caja de pagos diaria con tope de efectivo y medios habilitados, entrega posterior del efectivo con constancia del proveedor, arqueo y cierre.
- Bandeja de órdenes de pago aprobadas por compras, con pago en efectivo, valores de terceros, cheque propio, cheque electrónico, transferencia, VEP o débito; firma por firmantes vigentes según reglas por monto; entrega; archivos de transferencias para la banca electrónica, y anulación con aviso a compras.
- Pago a los organismos de las obligaciones fiscales que determina el área impositiva y ejecución de los reintegros a socios aprobados por cobranza.
- Rendiciones de cajas de cobranza y depósitos.
- Rendición creada automáticamente al cerrar cada caja de cobranza, recepción con conteo del efectivo y verificación de cada valor, aceptación u observación, y registro de la diferencia de caja con aprobación.
- Depósitos bancarios con boleta y fecha probable de acreditación, transferencias entre cajas de tesorería y cierre diario de cada caja de tesorería con arqueo por moneda.

**Monedas, flujo de fondos y compromisos**

- Monedas y cotizaciones.
- Cotización diaria obtenida de ARCA u otra fuente configurada, con carga manual aprobada si la fuente falla, y valuación de los saldos en moneda extranjera.
- **Flujo de fondos** proyectado y compromisos de fondos.
- Posición diaria y proyección de cobros y pagos a partir de vencimientos a cobrar, acreditaciones pendientes, valores en cartera, facturas de proveedores, órdenes de pago, cheques diferidos, obligaciones fiscales, haberes, previsiones periódicas y compromisos, agrupable por día, semana o mes, cuenta, sucursal y servicio.
- Escenarios de liquidez con supuestos explícitos que no alteran los datos reales, alertas de saldo proyectado por debajo del mínimo y comparación de proyecciones guardadas con lo efectivamente ocurrido.
- Compromisos de fondos al aprobarse una orden de compra, que se consumen al registrar la factura y el pago y se liberan si la orden se cancela.
- Pago de haberes mediante archivo bancario.
- Ejecución del lote de haberes aprobado por sueldos, con reparto del neto entre varias cuentas del empleado, registro de rechazos por empleado y su reproceso; los importes individuales solo los ve quien tiene permiso de sueldos.
- Distinción permanente entre disponible, en tránsito, en cartera, a cobrar y proyectado; el pago neto al proveedor y el ingreso de las retenciones al organismo son movimientos distintos.
- Bandeja de excepciones (archivos sin respuesta, líneas sin clasificar, acreditaciones no identificadas, diferencias de rendición) y avisos a los responsables; firma de pagos y consulta de la posición diaria desde la aplicación del personal, con verificación reforzada.

**Reglas que aplica el sistema**

- Un cobro esperado no es dinero disponible: los importes en tránsito, a acreditar o en cartera nunca suman al disponible del banco. Un depósito resta de la caja de tesorería y solo suma al banco cuando se concilia su acreditación.
- Los saldos se calculan siempre desde los movimientos; no existen saldos editables. Nada se borra: toda anulación es una reversión vinculada al movimiento original.
- Ninguna operación se ejecuta dos veces por un reintento: pagos, archivos, importaciones y conciliaciones quedan protegidos contra duplicados.
- Separación de funciones: quien carga un pago no puede firmarlo, el cajero que entregó una rendición no puede aceptarla y quien desconcilia necesita un segundo aprobador para cerrar esa conciliación.
- Generar un archivo de pago no es pagar: el pago figura como ejecutado solo cuando el banco lo acepta o se concilia el débito.
- Tesorería nunca modifica la deuda del socio ni el saldo del proveedor: ejecuta y concilia, y cobranza o compras aplican el efecto.
- Un crédito bancario no identificado nunca se imputa a un socio por un nombre o un importe parecido; queda pendiente de identificación con responsable y antigüedad.
- Un grupo de conciliación debe cuadrar exactamente, y la conciliación de un período solo se cierra con diferencia no explicada igual a cero.
- Los fondos de distintas personas jurídicas de la cooperativa nunca se mezclan en una misma operación ni en una misma cuenta.
- Las credenciales de los bancos y de Interbanking se guardan resguardadas y nunca se muestran ni quedan registradas, tampoco para el personal de soporte.

**Información e indicadores**

- Planilla diaria de tesorería, composición de cartera (efectivo, valores, cupones y retenciones), disponibilidades y saldos de bancos operativos, contables y a futuro.
- Libro de bancos, movimientos conciliados y no conciliados, reporte de conciliación con partidas pendientes por antigüedad y depósitos a acreditar.
- Cheques propios y transferencias no debitados por semana, listados de valores por estado, cupones por estado y retenciones recibidas por tipo y agente.
- Cajas abiertas y cerradas, pagos pendientes de salida y pagos diferidos, y gastos financieros por clase y cuenta.
- Flujo de fondos y previsiones, y comprometido, devengado y pagado por servicio y centro de costo, sin sumarlos entre sí.
- Indicadores de días de caja, antigüedad de las partidas pendientes, tiempo de rendición de las cajas, desvío del flujo proyectado y diferencia entre lo cobrado por pasarelas y lo acreditado neto.

**Etapa de habilitación**: núcleo de tesorería (cuentas bancarias propias, movimientos básicos, rendición de cajas de cobranza, caja de tesorería, depósitos, importación de extractos y conciliación asistida de la cobranza, en pesos) en la etapa 6; tesorería completa (valores de terceros, cheques propios y electrónicos, cupones, retenciones, cajas de pagos, ejecución de órdenes de pago, Interbanking, otras monedas, flujo de fondos, escenarios y compromisos) en la etapa 9; pago de haberes de la liquidación propia en la etapa 10, y desde la etapa 9 para las liquidaciones importadas; informes avanzados en la etapa 12.

**Usuarios principales**: tesorero, contador, gerencia; también auxiliares de tesorería, cajeros de pagos, firmantes autorizados, consejo de administración y auditores (solo consulta).

### 10.15 Contabilidad

**Propósito**: registrar, explicar y exponer el efecto económico de todas las operaciones de la cooperativa, en partida doble y con trazabilidad desde cada informe hasta el documento y la operación que lo originaron.

**Funciones principales**

**Asientos automáticos**

- **Asientos automáticos** en partida doble generados una sola vez por cada operación económica de cualquier módulo, con reglas de imputación configurables por servicio, concepto, medio de pago y centro de costo, en tiempo real o por resumen diario.
- Los módulos informan importes ya clasificados y la contabilidad elige las cuentas con sus reglas; cada renglón muestra qué regla lo resolvió, y un simulador permite probar una operación de ejemplo sin registrar nada.
- Operación que llega sin cuenta resuelta: queda pendiente de configuración sin frenar la operación de origen, se reprocesa al corregir la regla y bloquea el cierre del período mientras siga pendiente.
- Control de cuentas sin asignar a demanda, al publicar configuración y cada noche; la publicación de un servicio, concepto, medio de pago o banco nuevo advierte o se detiene si no tiene regla contable.
- Resumen diario o por rango preparado como borrador, con previsualización, confirmación o descarte, y reversión automática del asiento cuando se anula el documento de origen.
- Tratamiento contable propio de cada circuito: facturación por servicio y concepto, cobranza en dos pasos con acreditaciones pendientes, comisiones y retenciones, compras con IVA computable por centro de costo, pagos, tesorería, stock y equipos en comodato, bienes de uso, sueldos, convenios con intereses a devengar, incobrables y prescripción, impuestos, capital social, fabricación y compra de energía o gas registrada como costo.

**Asientos manuales, plan de cuentas y períodos**

- Asientos manuales con aprobación.
- Asientos manuales con al menos dos renglones, debe igual a haber, adjuntos de respaldo y distribución por centro de costo; plantillas de asientos recurrentes con reversión automática para provisiones; importación desde planilla con validación previa.
- Anulación masiva con permiso específico y renumeración de asientos solo en los rangos no transcriptos a libros rubricados.
- Plan de cuentas, ejercicios y períodos con bloqueo y reapertura controlada.
- Plan de cuentas jerárquico con naturaleza de cada cuenta, rubro y subrubro de exposición, cuentas imputables y agrupadoras, cuentas alcanzadas por el ajuste por inflación y uso obligatorio, opcional o prohibido de centro de costo; plan modelo para cooperativas de servicios e importación desde planilla.
- Renumeración y unificación de cuentas conservando su historia, y reasignación masiva de cuentas y rubros con auditoría.
- Ejercicios regulares e irregulares, varios ejercicios abiertos a la vez, períodos mensuales con bloqueo por módulo que todos los módulos respetan, y lista de control para el cierre mensual.

**Centros de costo y conciliaciones**

- Centros de costo con asignaciones, grupos y distribución de costos comunes.
- Asignación por defecto por concepto, producto o cuenta, modelos de distribución reutilizables, distribución propia de bienes de uso y empleados, y distribución de costos comunes por porcentaje o por indicadores (suministros activos, kWh, m³, horas, metros de red o ingresos) sin duplicar el gasto.
- Centros de costo activables para toda la contabilidad o solo para sueldos, con nombre adaptable a la terminología de la cooperativa (por ejemplo, "sección").
- Conciliación permanente con la cuenta corriente de socios, caja, bancos, proveedores, impuestos, stock, bienes de uso, sueldos y capital.
- Cuentas de control de créditos por servicio que explican el saldo de cada servicio, y justificación de cada diferencia con responsable, causa y, si corresponde, ajuste autorizado.
- Recorrido completo desde un informe hasta el asiento, el documento y la operación de origen, y en sentido inverso.

**Libros, estados contables y cierre**

- Mayor, sumas y saldos, balances, estados contables con el formato exigido para cooperativas, estado de resultados por sección, ajuste por inflación y libros para rubricar.
- Libro diario, libro diario rubricado y libro de inventarios y balances con impresión de hojas numeradas y continuidad de folio.
- Estados de situación patrimonial, de resultados, de evolución del patrimonio neto y de flujo de efectivo, con notas, anexos de bienes de uso y de gastos, y comparación con el ejercicio anterior.
- Ajuste por inflación por índice sobre las cuentas alcanzadas, con previsualización y detención si falta el índice de algún mes.
- Cierre de ejercicio con asientos de refundición de resultados, cierre patrimonial y apertura del ejercicio siguiente; reapertura con doble aprobación mediante reversión de esos asientos.

**Planes múltiples, simulación y presupuesto**

- Varios planes de cuentas con equivalencias y escenarios simulados separados de los registros oficiales.
- Equivalencias uno a uno, uno a varios con porcentajes o varios a uno; proyección de los asientos oficiales a planes alternativos o regulatorios, y detección de cuentas sin equivalencia.
- Escenarios simulados con supuestos explícitos (cambio de estructura, reparto de costos comunes, variación de tarifas o de costos), repetibles, comparables entre sí y con lo real, e identificados como simulación en toda salida.
- Presupuesto por cuenta, centro de costo y servicio, con comparación entre presupuestado, comprometido, devengado y pagado.
- Presupuesto con versiones y reformulaciones, copia del ejercicio anterior con ajuste y estacionalidad, y control al aprobar una orden de compra que advierte, pide autorización o bloquea según la política de la cooperativa.

**Capital, entidades y transición**

- Tratamiento contable diferenciado del capital social y de los excedentes cooperativos.
- Suscripción e integración del capital desde la factura o la afiliación, sin que la cuota social se registre como ingreso por servicios; distribución de excedentes según la resolución de la asamblea, con su cuadro de distribución.
- Varias personas jurídicas dentro de una misma cooperativa, con emisión, contabilidad y sueldos por entidad.
- Libros, numeración de asientos, ejercicios y estados contables propios de cada entidad, cuentas entre entidades cuando una cobra o paga por otra, e informes consolidados que no alteran los libros de cada una.
- Contabilidad durante la convivencia con el sistema actual: mientras dure, la contabilidad oficial sigue en el sistema actual de la cooperativa; GoodApps contabiliza en un plan marcado como no oficial, lo concilia contra el sistema actual y se convierte en oficial en el reemplazo administrativo.
- Intercambio de asientos con sistemas contables externos mediante archivos configurables, sin duplicar lo ya exportado, y entrega de saldos para las exportaciones a organismos reguladores.
- Tablero contable con estado de los períodos, operaciones pendientes de configuración, borradores, conciliaciones con diferencias y alertas de cierre.

**Reglas que aplica el sistema**

- Todo asiento cumple la partida doble y cada operación económica se contabiliza una sola vez, aunque se reenvíe o se reprocese.
- Ningún otro módulo elige cuentas contables. Un asiento automático no se edita: se corrige la regla, se revierte y se vuelve a procesar.
- Nada contabilizado se borra en un período cerrado ni después de transcripto al libro rubricado: solo se corrige con un contraasiento vinculado. Una operación que llega tarde se fecha en el primer período abierto con una leyenda que lo indica, sin reabrir períodos.
- Los saldos surgen solo de los asientos registrados y se verifican cada noche; una diferencia genera una alerta crítica y nunca se corrige en silencio.
- Un asiento manual o de ajuste por encima del umbral configurado lo aprueba un usuario distinto del que lo cargó, y la reapertura de un ejercicio requiere dos aprobaciones.
- Las simulaciones no emiten comprobantes, no generan deuda, no mueven fondos ni contabilizan oficialmente; un escenario nunca se convierte en asientos reales.
- El aporte de capital nunca es ingreso por servicios, los conceptos cobrados por cuenta de terceros son deuda con el tercero, los cobros en exceso son saldos a favor del socio y los no identificados van a una cuenta transitoria.
- Presupuestado, comprometido, devengado y pagado se muestran por separado y nunca se suman como gasto.
- Durante la convivencia con el sistema actual, la contabilidad oficial es la del sistema actual; la de GoodApps es no oficial hasta el reemplazo administrativo.
- Los libros, asientos y documentación de respaldo se conservan como mínimo diez años y no se eliminan aunque la cooperativa deje la plataforma.

**Información e indicadores**

- Libro diario, mayor de una o varias cuentas, sumas y saldos, balance por rubros y transacciones por cuenta y documento.
- Estados contables, anexo de bienes de uso y de gastos, y control previo a balances con cada problema y su enlace.
- Resultado por servicio y por sección con ingresos directos, costos directos y costos comunes distribuidos.
- Ejecución presupuestaria con desvíos y conciliación de cada auxiliar contra su cuenta de control.
- Anticipos y saldos a favor de socios a una fecha y cuadro de distribución de excedentes.
- Indicadores de gestión publicados con su fórmula: servicios conectados, servicio tomado frente a facturado, cobranza por caja frente a banco, cobranza frente a facturado al primer vencimiento y composición de la deuda por servicio y antigüedad.
- Todo informe indica fecha de corte, universo y si se trata de datos reales o simulados, y se exporta a planilla, CSV o PDF.

**Etapa de habilitación**: núcleo contable (plan de cuentas, ejercicios y períodos, centros de costo, asientos automáticos de facturación y cobranza, asientos manuales, mayor, sumas y saldos, capital social mínimo e intercambio con sistemas externos) en la etapa 6; asientos de mora, convenios e incobrables en la etapa 7; asientos de servicios medidos y compra de energía en la etapa 8; contabilidad completa (compras, stock, bienes de uso, tesorería, impuestos, cierres, estados contables, ajuste por inflación, libros rubricados, planes múltiples, simulaciones y presupuestos) en la etapa 9, incluidos los asientos de sueldos importados; asientos de la liquidación propia de sueldos en la etapa 10; capital social completo, excedentes, servicios sociales y fabricación en la etapa 11; inteligencia de negocio y migración repetible en la etapa 12. Durante la convivencia la contabilidad de GoodApps es no oficial hasta el reemplazo administrativo.

**Usuarios principales**: contador, gerencia, síndico, auditores; también auxiliares contables, responsables de costos y de presupuesto, consejo de administración y estudio contable externo (solo consulta).

### 10.16 Personal y sueldos

**Propósito**: liquidar los haberes del personal en relación de dependencia y cumplir las obligaciones laborales, de seguridad social e impuesto a las ganancias, sin depender de otro sistema, registrando su efecto en contabilidad, centros de costo, servicios, tesorería y presupuesto.

**Funciones principales**

**Legajo y estructura laboral**

- Legajo del empleado con una o varias empresas empleadoras.
- Datos personales tomados del registro único de personas, datos laborales, familiares a cargo por año fiscal, cuentas de acreditación con CBU validado, documentación con vencimientos, situación de revista, historial laboral consultable a una fecha y distribución del costo por centros de costo.
- Registro mínimo del empleado (empresa, área, centro de costo, cargo y encargado) disponible antes de la liquidación, para que cuadrillas y órdenes de trabajo usen solo empleados activos.
- Cada empresa empleadora es una persona jurídica de la cooperativa: liquidaciones, presentaciones, pagos y asientos se generan por separado para cada una.
- Estructura laboral versionada: sindicatos, convenios colectivos, categorías, escalas, antigüedad, cargos, áreas, jornadas, turnos, guardias y obras sociales.
- Convenios con la validación registrada del responsable que los parametrizó, escalas salariales con fecha efectiva y aprobación, y tablas oficiales (topes, alícuotas, salario mínimo, escalas de Ganancias, códigos de ARCA) mantenidas por la plataforma y adoptadas por la cooperativa.

**Conceptos, novedades y licencias**

- Conceptos y variables con fórmulas, simulación previa y aplicación de aumentos.
- Editor de fórmulas con validación y prueba sobre un empleado; un asistente de inteligencia artificial solo propone fórmulas, sin enviar datos personales; cada versión de la configuración se publica después de una simulación revisada por otro usuario.
- Novedades del período, incluidas las originadas en partes de cuadrilla, órdenes de trabajo y flota; licencias y vacaciones.
- Carga de novedades en grilla o desde planilla, en cuotas, con horas extra y guardias propuestas desde las órdenes de trabajo, tareas pagadas por unidad (lecturas, cortes, reconexiones), adelantos de sueldo y, opcionalmente, fichadas de reloj; el encargado aprueba las de su equipo.
- Causas de licencia con base legal, días y certificado requerido; solicitud desde el portal del empleado, autorización del encargado, saldo de vacaciones y cómputo de días hábiles excluyendo feriados.

**Liquidación**

- Liquidaciones mensuales o quincenales, aguinaldo, vacaciones, liquidación final con indemnizaciones, complementarias y rectificativas, con simulador.
- Detalle de cálculo de cada renglón del recibo, controles previos a la aprobación (variaciones mayores al umbral, neto negativo, empleado sin cuenta o sin centro de costo, remuneración por debajo del mínimo) y un único recibo por empleado, período, tipo de liquidación y empresa.
- Liquidación final según el motivo de egreso, con preaviso, integración del mes, indemnización por antigüedad, vacaciones no gozadas y aguinaldo proporcional; complementarias para retroactivos de paritarias y rectificativas que reemplazan un recibo sin borrarlo.
- Embargos y cuotas alimentarias con escala de embargabilidad y orden de prelación, control del límite legal de deducciones y descuento de deudas de servicios solo con autorización escrita del empleado.
- Provisiones mensuales de aguinaldo y vacaciones para contabilidad y presupuesto.
- Impuesto a las ganancias de cuarta categoría: deducciones, retención mensual y liquidación anual y final.
- Importación del formulario de deducciones que presenta el empleado en ARCA, calculadora que explica cada importe de la retención, devolución de retenciones en exceso y formulario anual para el empleado.

**Obligaciones, recibos y pagos**

- Seguridad social: aportes, contribuciones, aseguradora de riesgos del trabajo y siniestros; Libro de Sueldos Digital, archivo para la declaración jurada de seguridad social y archivos sindicales.
- Archivo de retenciones de Ganancias del personal, control de totales contra la liquidación y el asiento, y registro de cada presentación con el acuse cargado por la cooperativa.
- **Recibos** con el contenido legal, firma digital y entrega digital con constancia en el portal del empleado.
- Firma digital del empleador mediante un proveedor licenciado y firma electrónica o conformidad del empleado con código de verificación; registro de la no conformidad con observación y recordatorios de recibos pendientes de firma.
- Portal del empleado en la aplicación del socio y del personal: recibos, vacaciones, licencias, datos con propuesta de cambio, documentación y certificados; portal del encargado con su equipo y las aprobaciones pendientes; una misma cuenta puede ser socio y empleado sin mezclar datos.
- Solicitud de pago de haberes a tesorería y asientos de sueldos.
- Solicitud de pago por liquidación aprobada con el neto repartido entre las cuentas del empleado, rechazos por empleado sin anular la liquidación, y obligaciones derivadas (seguridad social, sindicatos, depósitos judiciales, seguro de vida) enviadas a tesorería.
- Asiento de devengamiento por centro de costo y servicio al aprobar cada liquidación, con reglas de imputación por concepto, empresa y sindicato.
- Certificados de trabajo y egreso.
- Certificado de trabajo y certificación de servicios y remuneraciones al egreso, constancias con código de verificación, registro del alta y la baja ante ARCA y lista de tareas de egreso (devolución de equipos y herramientas, revocación de accesos).

**Recursos humanos, control y transición**

- Gestión de recursos humanos: evaluaciones, objetivos, sanciones, sumarios, accidentes y juicios laborales.
- Evaluaciones de desempeño con ciclos y varios evaluadores, objetivos con peso y avance, sanciones que generan la novedad y la situación de revista, accidentes vinculados a la aseguradora y juicios laborales con su provisión contable.
- Aprobaciones con separación de funciones y reportes de costo laboral.
- Importación de liquidaciones cerradas por un liquidador externo, que se contabilizan y se pagan sin recalcular salarios; es el primer paso de la transición y queda disponible como alternativa para la cooperativa que conserve su sistema laboral.
- Liquidación propia con dos períodos en paralelo con el sistema actual y comparativo por empleado y concepto antes del reemplazo, con migración de legajos, estructura, conceptos y acumulados del año.

**Reglas que aplica el sistema**

- Separación de funciones obligatoria: quien calcula una liquidación no la aprueba, quien la aprueba no ejecuta el pago y nadie aprueba ni modifica su propio legajo, novedad o recibo.
- El sistema provee la mecánica de cálculo y las tablas oficiales, pero no interpreta convenios: la parametrización la valida el responsable laboral o el contador, y un convenio sin validación registrada no se publica.
- Nada produce efectos hasta su aprobación: las novedades en borrador no se liquidan y una simulación no consume números de recibo, no mueve saldos de descuentos ni genera asientos.
- Un recibo emitido nunca se borra: se corrige con una liquidación rectificativa, y los archivos de un período ya presentado no se regeneran sin ella.
- Los datos sensibles (salud, licencias médicas, embargos, cuotas alimentarias, sanciones, sumarios, accidentes y juicios) requieren un permiso propio, cada lectura queda registrada y no figuran en los reportes generales.
- Para cada empresa y período existe una sola liquidación: la propia o la importada, nunca ambas; un archivo importado dos veces no genera un segundo asiento ni un segundo pago.
- El sistema prepara los archivos oficiales, pero la presentación y el pago de las declaraciones juradas corresponden a la cooperativa y a su contador.
- El módulo no liquida a los asociados de cooperativas de trabajo como empleados ni los honorarios de consejeros y síndicos.

**Información e indicadores**

- Costo laboral por servicio y centro de costo (remuneraciones, contribuciones, aseguradora, seguro de vida y provisiones), por período y comparativo.
- Ausentismo, horas extra y guardias por empleado, área y orden de trabajo, rotación, dotación y antigüedad.
- Proyección de costo laboral a doce meses con escalas futuras y aumentos previstos, para el presupuesto.
- Nómina, conceptos liquidados, libro de sueldos, remuneraciones por banco, provisiones y cuenta corriente del empleado (adelantos, préstamos y embargos).
- Totales de seguridad social contra la liquidación, liquidación anual de Ganancias y diferencias mes a mes.
- Estado de firma de recibos (pendientes, firmados, disconformes) y comparativo de liquidaciones entre períodos.

**Etapa de habilitación**: registro mínimo del empleado para cuadrillas y órdenes de trabajo en la etapa 4; importación de liquidaciones externas con su asiento y su pago en la etapa 9; módulo completo con liquidación propia en la etapa 10, con dos períodos en paralelo antes de reemplazar al sistema anterior.

**Usuarios principales**: recursos humanos, liquidador, tesorería, contador, empleados; también aprobadores, encargados de equipo, asesor legal, contador externo y auditores (solo consulta).

### 10.17 Institucional

**Propósito**: gestionar la relación institucional entre cada persona y su cooperativa, conforme a la Ley 20.337 y a la normativa del organismo nacional de control cooperativo, en forma trazable y separada de la relación comercial por servicios. El sistema prepara la información y deja evidencia; no certifica validez legal ni reemplaza las decisiones de los órganos de la cooperativa.

**Funciones principales**

**Asociados**

- Registro de asociados con número, antigüedad, estado, ingreso aprobado por acta y egreso con causa, y Libro de Registro de Asociados.
- **Número de asociado** único, correlativo y nunca reutilizado, asignado al aprobarse el ingreso e independiente del número de cuenta; la corrección de un número requiere aprobación y conserva el número anterior como referencia.
- Estados institucionales con historia completa: solicitante, pendiente de aprobación, activo, suspendido, renuncia solicitada, egresado por renuncia, excluido, fallecido, rechazado y extinguido (personas jurídicas); cada cambio guarda fecha efectiva, fecha de registro, responsable, causa y documento.
- Distinción entre **asociado** y **cliente no asociado**: una persona puede contratar servicios sin ser asociada, salvo en los servicios que la cooperativa configure como exclusivos para asociados.
- Asociados personas jurídicas con representante legal designado y vigencia de la representación.
- Solicitudes de ingreso llevadas al orden del día del consejo, en forma individual o en lote, con resolución aprobada, rechazada con motivo u observada.
- Egreso por renuncia, exclusión, fallecimiento o extinción, con validaciones configurables (servicios activos, capital integrado); exclusión con notificación fehaciente y plazo de apelación ante la asamblea; reingreso con conservación o no del número anterior, según la configuración.
- Fallecimiento informado desde la ficha de la persona, con alerta a secretaría e inicio del trámite de reembolso a los derechohabientes.
- **Credencial de asociado** impresa y digital, individual o masiva, con código QR que permite verificar si la condición está vigente sin exponer otros datos.
- Distritos electorales para asambleas de distrito, con asignación por zona, localidad o manual, y registro de delegados.
- Emisión del Libro de Registro de Asociados como edición foliada e inalterable; las correcciones se registran en la edición siguiente.
- Certificados de cuotas sociales numerados, etiquetas y listados postales para convocatorias.

**Capital social**

- **Capital social**: cuotas suscriptas, facturadas, integradas, comprometidas, reservadas, transferidas y reembolsadas, con registro propio, cobro dentro de la factura del servicio con renglón y leyenda propios, y estado de cuenta.
- Rubros de capital y definición de qué conceptos o servicios generan capital y en qué proporción; importe o cantidad de cuotas a suscribir al contratar un servicio.
- Reglas de suscripción versionadas (mínimo al ingreso, por servicio o por categoría), valor nominal de la cuota social versionado y momento de suscripción configurable: en la afiliación o al facturar.
- **Integración proporcional al pago**: al confirmarse un pago, se integra la parte de capital que corresponde a la proporción pagada del comprobante.
- Reversión de capital por anulación de facturas, notas de crédito, reversión de pagos o anulación de convenios mediante movimientos inversos vinculados, sin borrar ningún registro.
- Reservas de capital y su recupero, transferencias de cuotas entre asociados con aprobación del consejo, carga manual con motivo y aprobación, e importación masiva para migración o regularización.
- **Rescate o reembolso de capital** al egreso: cálculo, compensación con deuda exigible previa autorización, límite anual del estatuto, cola por orden de solicitud, aprobación del consejo y pago por tesorería.
- Cierre de capital a una fecha, que impide movimientos anteriores salvo reapertura autorizada, y revisión periódica que detecta y propone ajustes sin duplicar movimientos.
- Distribución de excedentes y retornos aprobada por asamblea.
- Simulación de la distribución con el esquema configurado (reserva legal, fondos de acción asistencial y de educación, interés a cuotas sociales si el estatuto lo autoriza, retorno a asociados) y criterio de retorno por uso de los servicios, por capital integrado u otro aprobado; ejecución por asociado como capitalización, crédito en cuenta o pago, con constancia individual.

**Órganos, reuniones y asambleas**

- Órganos sociales: consejo de administración, sindicatura, comisiones y junta electoral, con sus mandatos.
- Mandatos con cargo, titular o suplente, vigencia y asamblea que los eligió; control de superposiciones e incompatibilidades configurables; alertas de vencimiento; nómina de autoridades vigente e histórica y firmantes autorizados.
- Reuniones, asambleas, convocatorias, padrones, asistencia, poderes, delegados, votaciones formales, actas y resoluciones.
- Reuniones del consejo, de la sindicatura, de comisiones y asambleas ordinarias, extraordinarias, de distrito y de delegados, presenciales, a distancia o mixtas, con orden del día vinculable a reclamos y expedientes, y permisos de acceso para reuniones reservadas.
- **Padrón versionado** con fecha de corte y criterios de habilitación configurables (fecha límite de alta, deuda de capital con umbral tolerado, facturas impagas, distrito, entre otros); cada asociado excluido muestra el motivo; exhibición, reclamos de inclusión y aprobación del padrón definitivo.
- Acreditación en la asamblea por credencial o documento, poderes validados, cálculo del quórum en vivo, primer y segundo llamado, y votación formal con la mayoría requerida y escrutinio por lista.
- Junta electoral con presentación, oficialización e impugnación de listas de candidatos.
- Actas numeradas por libro, generadas desde el orden del día, con firma digital de los firmantes requeridos; seguimiento de resoluciones con responsable y plazo; expediente documental por asamblea (memoria, estados contables, informes, padrón).
- Honorarios de consejeros y síndicos.
- Registro de la retribución aprobada por asamblea, liquidación por período con las retenciones correspondientes y reintegro de gastos con comprobantes; los honorarios no se procesan como sueldo.
- Informes al organismo nacional de control cooperativo.
- Catálogo de informes con período, vencimiento, generación, validación, presentación y acuse; exportación de altas y bajas por lotes con los códigos de geografía y documentos que exige el organismo.
- Solicitud de ingreso como asociado desde el portal y sección "Mi asociación".

**Reglas que aplica el sistema**

- La baja de un servicio no produce el egreso del asociado ni la devolución de su capital; cuando un asociado queda sin servicios, el sistema alerta a secretaría pero no cambia su estado.
- El egreso no da de baja servicios en forma automática: según la configuración, exige su baja o transferencia previa, o permite continuar como cliente no asociado.
- El capital social se registra y se muestra separado de la deuda por servicios; cobrar un aporte de capital no es un ingreso por consumo.
- Ningún movimiento de capital se borra: las correcciones se hacen con movimientos inversos vinculados al documento de origen.
- Un asociado tiene un solo voto, con independencia de su capital; un asociado suspendido no vota ni es elegible, pero conserva su capital y su antigüedad.
- No se ejecuta una distribución de excedentes ni se liquida un honorario sin la resolución de asamblea que los aprueba.
- Las actas firmadas no se pueden modificar; las correcciones se registran en un acta posterior o en una fe de erratas vinculada.
- Si cambia un criterio de habilitación del padrón, se genera una nueva versión y la anterior queda consultable; el padrón preliminar lleva una leyenda que indica que no tiene validez definitiva.
- Separación de funciones: quien registra un rescate no lo aprueba, quien carga capital manual no aprueba el ajuste, y los firmantes de un acta deben tener mandato vigente o haber presidido la reunión.

**Lo que ve el socio**

- Estado, número de asociado, antigüedad y capital social con su estado de cuenta.
- Credencial digital con código QR de validez.
- Convocatorias, documentos institucionales públicos y resultados publicados (autoridades electas, resoluciones no reservadas).
- Consulta del padrón propio ("¿estoy habilitado?") y reclamo de inclusión dentro del plazo.
- Solicitudes de ingreso, de egreso y de otorgamiento de poder para votar, cuando el estatuto lo admite.
- Un cliente no asociado ve la opción para asociarse y no ve información de capital.

**Información e indicadores**

- Libro de Registro de Asociados y altas y bajas del período por causa.
- Estado de cuenta y resumen de capital social por rubro (suscripto, facturado, integrado, reservado y reembolsado), deuda de capital y conciliación con la contabilidad.
- Rescates en curso y uso del límite anual de reembolso.
- Padrón por distrito con excluidos y su motivo, asistencia a asamblea, poderes, delegados y resultado de cada votación.
- Nómina de autoridades y vencimientos de mandatos.
- Distribución de excedentes por asociado, servicio y destino.
- Honorarios liquidados, resoluciones abiertas y asociados por categoría y antigüedad.
- Asociados sin servicios y clientes no asociados.

**Etapa de habilitación**: núcleo en la etapa 3 (registro mínimo de la relación institucional, número de asociado, distinción con el cliente no asociado y resumen en la ficha); capital social mínimo en la etapa 6 (rubros, reglas, cobro en la factura, integración por pago y estado de cuenta), con el capital incluido en convenios en la etapa 7; funcionalidad completa en la etapa 11 (Institucional y servicios sociales).

**Usuarios principales**: secretaría institucional, consejeros, síndicos, junta electoral, acreditadores de asamblea, administración de capital, contador, tesorería, auditores externos y socios.

### 10.18 Servicios sociales y flota

**Propósito**: gestionar los servicios cooperativos no medidos, cada uno con sus reglas propias y no como un abono mensual genérico, y los recursos móviles de la cooperativa. El sistema registra hechos administrativos y deja evidencia: no toma decisiones clínicas ni de aptitud, no despacha emergencias y no dispone de restos ni de derechos de sepultura por falta de pago.

**Funciones principales**

**Coberturas y adherentes**

- **Grupos de cobertura**: adherentes y beneficiarios (familiares, convivientes, personas a cargo) con altas, bajas, vínculos, edades, mayoría de edad y fallecimiento.
- **Planes de cobertura** por servicio: prestaciones incluidas, vínculos admitidos, edades por vínculo, cantidad máxima de adherentes, carencias, alcance territorial, exclusiones, requisitos documentales con vencimiento y vigencia.
- Validaciones de alta del adherente: requisitos del plan, persona ya adherente del mismo servicio u otro titular, y advertencia configurable cuando el titular tiene deuda vencida.
- Baja masiva de adherentes que dejaron de cumplir la edad, el vínculo o la ocupación, y recategorización masiva, siempre con vista previa y confirmación; aviso previo de la mayoría de edad.
- Efectos automáticos sobre el grupo ante la desconexión, la reconexión, la transferencia del servicio o el fallecimiento del titular o de un adherente.
- Alta automática de un servicio social al conectar un servicio base, cuando la ficha del servicio lo prevé (por ejemplo, sepelio al conectar energía).
- Datos para la facturación: cantidad de adherentes vigentes en el período por vínculo, edad y categoría, incluido el tratamiento de los adherentes excedentes.
- Importación de adherentes desde planilla con vista previa de errores y las mismas validaciones del alta individual.

**Prestaciones**

- **Solicitud de prestación** única para sepelio, subsidio, banco de sangre, traslado, internación u ortopedia, con verificación de la cobertura a la fecha del evento (contrato y adherente vigentes, carencia cumplida, prestación incluida y topes), autorización o rechazo con motivo y derivación de excepciones a un responsable.
- Registro de prestadores y convenios (empresas fúnebres, redes de bancos de sangre, establecimientos de salud, empresas de ambulancias, constructores) con vigencia, costo y modalidad de financiamiento.
- **Sepelio y subsidio por fallecimiento**: planes, carencias, solicitudes, prestador, expediente y pago.
- Caso de sepelio con fallecido, solicitante, prestador, servicios brindados, cobertura territorial, adicionales a cargo del solicitante y vínculo con el cementerio parque cuando la inhumación es en la cooperativa; subsidio con reglamento versionado, beneficiarios con porcentaje, aprobación y pago por tesorería.
- Seguros de sepelio o vida por cuenta de terceros, con aseguradora y número de póliza, sin cálculo actuarial.

**Cementerio parque**

- **Cementerio parque**: establecimiento, reglamento, unidades de sepultura, derechos, titulares y autorizados, ocupaciones y actos.
- Catálogo físico por sectores, manzanas, filas y unidades (parcela, nicho, urnario), con capacidad por niveles y estados separados de disponibilidad, reserva, derecho adjudicado y ocupación; reservas con vencimiento.
- Derecho de sepultura con titular, cotitulares, modalidad, instrumento, vigencia y autorizados; separación entre contratante, titular, pagador, fallecido y autorizados.
- Actos de inhumación, exhumación, reducción y traslado con permiso, autorización y documentación; turnos con control documental previo; cesión, transferencia, sucesión y extinción de derechos con revisión jurídica.
- Obligaciones económicas de adquisición, mantenimiento y actos; plano del parque con el estado de cada unidad; registros de inhumaciones y de titulares.

**Salud y traslados**

- **Banco de sangre** por convenio: adhesión, cobertura, solicitudes y campañas de donación.
- El banco de sangre es solo administrativo: las solicitudes se canalizan al prestador habilitado y las campañas se limitan a la coordinación de turnos, sin registrar datos clínicos ni decidir la aptitud de los donantes.
- **Salud administrativa**: prestadores, profesionales, ambulancias, traslados y autorizaciones por convenio.
- Viajes de ambulancia y traslados sanitarios con persona trasladada, origen, destino, establecimiento, móvil, chofer, profesionales acompañantes, tramos múltiples y kilómetros; traslados no sanitarios de personas; agenda de traslados programados con detección de conflictos; facturación del traslado no cubierto por kilómetro o importe fijo.
- El motivo del traslado se registra como categoría administrativa, nunca como diagnóstico; ante una emergencia, el sistema muestra el contacto del prestador y no la agenda.

**Vivienda**

- **Planes de vivienda**: planes y tipologías, precios, inscripción, adjudicación, aportes, construcción por etapas, materiales, retiros, certificados, cambios de plan, transferencias y rescisión.
- Aporte por cuota como porcentaje del precio vigente de la tipología, con mínimos antes y después de la adjudicación y máximo anual; actualización masiva de precios con aprobación; comprobante exclusivo para las cuotas de vivienda.
- Etapas y actividades de obra con horas y costo, avance por vivienda, materiales reservados y retirados con vale contra el stock, certificados de obra para liquidar al constructor, y entrega total o parcial.
- Rescisión con comisión y cálculo del saldo a devolver o compensar.

**Otros servicios**

- Otros servicios: banco ortopédico, dispenser de agua, registración de vehículos eléctricos, seguros y extensiones definidas por la cooperativa.
- Banco ortopédico como préstamo con plazo, devolución, mantenimiento y depósito en garantía que se devuelve al finalizar, sin tratarlo como venta; dispenser con límite diario de litros y excedente mensual; registración de vehículos eléctricos y de equipos vinculados al contrato.
- Nuevos servicios sociales configurables como tipo, plan y formulario de solicitud, sin desarrollo, cuando encajan en el modelo de solicitud de prestación.

**Flota**

- **Flota y traslados**: vehículos, choferes, documentación y vencimientos, mantenimiento, uso por orden de trabajo, combustible, viajes, rendiciones y seguimiento satelital.
- Vehículos propios o contratados con costo por kilómetro; choferes vinculados al legajo del empleado o externos, con licencia y vencimiento; asignación de conductor con vigencia.
- Mantenimiento preventivo por kilómetros o tiempo y correctivo; cargas de combustible manuales o desde la factura de compra, con rendimiento real comparado con el esperado.
- Rendición de viajes con kilómetros reales, flete, peajes, viáticos y combustible, con aprobación; novedades para sueldos (horas de chofer y viáticos).
- Aplicación de campo del chofer con viajes asignados, kilómetros, carga de combustible con foto del comprobante y lista de control del vehículo, también sin conexión.
- Seguimiento satelital opcional mediante dispositivos integrados, con recorridos y kilometraje por día, viaje u orden de trabajo.

**Reglas que aplica el sistema**

- La cobertura se evalúa a la fecha del evento; si una persona no estaba incorporada a esa fecha, la solicitud pasa a revisión y no se modifica la cobertura en forma retroactiva.
- La deuda del titular nunca rechaza por sí sola una prestación urgente o sanitaria: solo genera una advertencia y la decisión la toma un responsable. El aporte impago en el banco de sangre no suspende la cobertura.
- Cuando una cobertura suspendida por mora se rehabilita, las prestaciones no urgentes pueden quedar sujetas a una carencia de rehabilitación configurable, sin reiniciar la carencia original ni la antigüedad.
- No existe precio por unidad de sangre ni por transfusión; los costos del convenio se registran como gasto, separados de cualquier cargo al socio.
- Una unidad de sepultura ocupada nunca se libera ni se dispone por falta de pago; la deuda de cementerio no corta otros servicios y solo habilita la gestión de cobranza.
- Cambiar el pagador de un derecho de sepultura no cambia el titular ni la ocupación.
- Los adherentes con discapacidad acreditada no se dan de baja por edad.
- Los grupos, ocupaciones y solicitudes nunca se borran: cada baja conserva su fecha y causa.
- Una cuenta no puede tener dos planes de vivienda, el aporte acumulado nunca supera el 100 % del valor y los planes de vivienda no se reconectan como un servicio de red.
- Un vehículo con documentación o mantenimiento vencido, o un chofer con licencia vencida, no se asignan; quien carga una rendición o certifica un avance de obra no puede aprobarlo.

**Lo que ve el socio**

- Su grupo de cobertura con integrantes, vínculos y coberturas vigentes, y la solicitud de altas y bajas de adherentes con documentación, que se hacen efectivas tras la validación del operador.
- Solicitudes de prestación con su estado y respuesta, sin datos clínicos.
- Derechos de sepultura con sus obligaciones y saldos.
- Plan de vivienda con tipología, porcentaje aportado, cuotas y estado de la construcción.
- Turnos de donación de sangre en las campañas habilitadas.
- La ubicación de los móviles nunca se muestra en vivo al socio.

**Información e indicadores**

- Adherentes por servicio, plan, vínculo, edad y estado; próximos a la mayoría de edad y cantidades para facturación.
- Solicitudes de prestación por tipo y estado, con tiempos de gestión y prestaciones utilizadas frente a los topes.
- Costos de convenios y prestadores, y costo por beneficiario.
- Disponibilidad del cementerio, registro de inhumaciones, registro de titulares y deuda de cementerio.
- Informe general de traslados con filtros por persona, establecimiento, móvil, chofer y característica del viaje.
- Aporte teórico frente al facturado, estado de los planes de vivienda, desvío de la construcción y materiales utilizados.
- Costos de flota por vehículo y por kilómetro, rendimiento de combustible, vencimientos y rendiciones.
- Préstamos ortopédicos activos y vencidos, y retiros del dispenser.

**Etapa de habilitación**: registro de adherentes y datos que la facturación necesita de ellos en la etapa 5; catálogo mínimo de vehículos y choferes en la etapa 9, si la gestión técnica necesita asignar móviles a las órdenes de trabajo; resto del módulo en la etapa 11 (Institucional y servicios sociales).

**Usuarios principales**: servicios sociales y salud, banco de sangre, administración del cementerio y su responsable jurídico, responsables de planes de vivienda y de obra, atención al socio, responsables de flota, choferes, socios y adherentes.

### 10.19 Sitio público y portal del socio

**Propósito**: dar a cada cooperativa una presencia digital propia y a cada persona de su comunidad una aplicación única e instalable de autogestión, con la marca y el vocabulario de la cooperativa. El portal es un canal: no cambia tarifas, no aprueba acuerdos excepcionales ni da por realizado un hecho hasta que el área responsable lo confirma.

**Funciones del sitio público**

- Página institucional con la marca de la cooperativa, noticias y servicios habilitados.
- Cuadros tarifarios publicados.
- Registro de nuevos usuarios, aunque todavía no sean socios ni tengan servicios.
- Consulta y pago de facturas sin ingresar, si la cooperativa lo habilita: se identifica la cuenta con un dato verificador y solo se muestran comprobantes impagos con datos enmascarados.
- Solicitudes de alta de servicios con formularios específicos por servicio.
- Reclamos y consultas: el sitio recibe consultas y contactos sin ingresar, con número de seguimiento; los reclamos con fotos y seguimiento completo se gestionan desde la aplicación del socio.
- **Botón de baja** visible en la portada y al pie de todas las páginas, habilitado en Internet, televisión y telefonía y configurable en los demás servicios; recibe la baja sin registro previo, entrega un código identificador dentro de las 24 horas y una constancia dentro de las 72 horas, y permite seguir su estado con el código y el documento.
- Buscador público de difuntos del cementerio parque, si la cooperativa lo habilita; muestra solo el nombre y la ubicación, nunca titulares ni deudas.

**Funciones de la aplicación del socio**

- Vinculación verificada de cuentas propias y de cuentas autorizadas.
- **Ciclo completo del servicio**: contratar, coordinar la visita técnica, seguir la instalación, firmar la conformidad, consultar consumos, ver facturas (separadas o agrupadas con detalle por servicio), pagar en línea con confirmación real, reclamar con fotos, suspender, reactivar y dar de baja.
- Estado de cuenta, recibos, cupón de pago, adhesión al débito automático y elección de la factura digital.
- Autolectura del medidor y carga de crédito prepago.
- Planes de pago, convenios y costos de reactivación.
- Equipos asignados, servicios sociales, grupo familiar, cementerio y vivienda.
- Turnos para atención presencial.
- Notificaciones, encuestas, muro y novedades de la cooperativa.
- Preferencias de comunicación y consentimientos.
- Actuación en nombre de otro solo con autorización vigente.
- Espacio del empleado en la misma aplicación.
- Borradores y recuperación de cargas interrumpidas.
- Modo tótem para autogestión presencial, opcional, en sucursales: pago de facturas y carga de crédito prepago con tarjeta, QR o efectivo, identificación por número de socio, documento o QR de la factura, y regreso automático al inicio por inactividad.

**Contenido y publicación del sitio**

- Sitio armado por bloques configurables (portada, servicios destacados, accesos rápidos, noticias, avisos de interrupción, trámites, preguntas frecuentes, sucursales y horarios), con circuito de borrador, revisión y publicación, vista previa en computadora y celular, y reversión a la versión anterior.
- Dirección propia formada con el nombre de la cooperativa y, opcionalmente, dominio propio.
- Ficha pública de cada servicio con planes, precio vigente con impuestos incluidos, requisitos, condiciones y botón para contratar.
- Consulta preliminar de cobertura por domicilio, con alternativa sin mapa.
- Avisos de cortes programados e interrupciones por zona y servicio, y sección de trámites y requisitos con formularios descargables.
- Páginas legales con versión vigente: términos, privacidad, accesibilidad y condiciones por servicio.

**Acceso y cuentas**

- Ingreso con contraseña o con un código de seis dígitos enviado por correo o SMS, habilitable por la cooperativa, sin enlaces de ingreso automático; ingreso con Google y, si la cooperativa lo habilita, con Ciudadano Digital de Córdoba (CiDi) con nivel de verificación 2 o superior para vincular cuentas.
- Vinculación por código de una factura más el documento del titular, por código enviado a un contacto verificado del titular, por identidad federada coincidente o por validación presencial con código de un solo uso emitido por un operador.
- Cada acceso tiene un rol (titular, cotitular, representante legal o autorizado), acciones permitidas (consultar, pagar, gestionar, solicitar la baja, firmar) y vigencia; el titular recibe un aviso de toda nueva vinculación con opción de revocarla.
- Representaciones otorgadas por el titular por invitación, apoderados y personas jurídicas con evidencia validada por un operador, y pago por un tercero con el código de pago, sin ver datos de la cuenta.
- Incorporación de los usuarios del portal anterior sin volver a registrarse, con sus cuentas vinculadas y sus adhesiones a factura digital y débito automático.

**Trámites, facturas y pagos**

- Formularios por servicio con asistente por pasos, adjuntos tomados con la cámara, guardado automático y respuesta a las observaciones del operador sin rehacer el trámite; si el servicio exige ser asociado, se inicia la solicitud de ingreso sin frenar el resto.
- Seguimiento de cada trámite con línea de tiempo, separado del estado real del servicio.
- Trámites de modificación (cambio de plan, de titularidad, de domicilio postal, de categoría y alta de adherentes) y declaraciones juradas de artefactos por servicio.
- Detalle de facturas con explicación comprensible de cada concepto, descarga del documento por enlace temporal, movimientos de cuenta corriente y constancias (libre deuda, alta, baja, trámite).
- Pago de una o varias facturas, cupón único con varias facturas y vencimiento propio, y medios según las pasarelas habilitadas (tarjeta, QR, billetera, transferencia, efectivo con cupón); el portal nunca recibe ni guarda los datos de la tarjeta.
- Detalle de llamadas de líneas telefónicas, plan de cuotas de obras e historial de consumos con gráfico y tabla equivalente.
- Gestiones con conversación dentro del caso, asistente con traspaso a una persona, conformidad al cierre, reapertura dentro del plazo y carga sin conexión que se envía al recuperar la señal.

**Reglas que aplica el sistema**

- Registrarse no crea asociado, titular, cuenta ni contrato, y la coincidencia de documento, correo o nombre nunca concede acceso a una cuenta.
- Los intentos de vinculación son limitados (cinco fallidos en quince minutos bloquean temporalmente la vinculación) y las respuestas no revelan si una cuenta existe.
- Solicitar no equivale a ejecutar: el servicio figura como activo, suspendido, reactivado o dado de baja solo cuando el área responsable confirma el hecho, y el estado del trámite se muestra siempre separado del estado del servicio.
- Un pago figura como confirmado solo cuando la cobranza lo confirma; al volver de la pasarela se muestra "pendiente de confirmación".
- La solicitud de baja no tiene cargo y no se condiciona a registrarse, pagar deudas, aceptar cargos ni responder encuestas; la cooperativa puede acortar los plazos del botón de baja, nunca alargarlos.
- El socio con deuda o suspendido conserva la consulta, el pago, los reclamos, la baja y las constancias; las nuevas contrataciones siguen la política de la cooperativa.
- Las encuestas nunca bloquean operaciones esenciales.
- Un cambio de datos sensibles (documento, CUIT, titularidad) siempre genera un trámite; los cambios de correo y teléfono se aplican tras su verificación.
- Los datos del espacio del socio y del espacio del empleado nunca se mezclan, y al cambiar de cooperativa o de espacio se limpia toda la información del contexto anterior.
- Objetivo de accesibilidad WCAG 2.2 AA verificado: navegación completa por teclado, alternativa a mapas y gestos, contraste corregido automáticamente sobre los colores de la marca y recuperación de los datos ante la expiración de la sesión.

**Lo que ve el socio**

- Un inicio adaptado a su situación (registrado sin cuentas, al día, con deuda, suspendido, con baja, representante o empleado), con saldo, próximo vencimiento, acciones rápidas, trámites en curso, visitas próximas y avisos sin leer.
- "Mis cuentas" con el rol que tiene en cada una, sus servicios y la posibilidad de desvincularse sin perder la historia de lo actuado.
- Cada servicio con su estado real y, por separado, el estado del trámite en curso.
- Tarjetas de servicios sociales y de "Mi asociación" solo cuando la cooperativa presta esos servicios y la persona tiene acceso a ellos.
- La marca, los colores y el vocabulario de su cooperativa en toda la aplicación, instalable en el celular.

**Información e indicadores**

- Usuarios registrados y tasa de vinculación de cuentas.
- Adopción de la factura digital y participación del pago en línea en la cobranza total.
- Tiempo de contratación por el portal y abandono de formularios.
- Bajas recibidas por el botón de baja con código y constancia en plazo.
- Vinculaciones fallidas y bloqueos.
- Proporción de gestiones iniciadas por autogestión y satisfacción posterior a la instalación y al reclamo.
- Pagos sin confirmar, activación de usuarios migrados y disponibilidad de los tótems.

**Etapa de habilitación**: núcleo en la etapa 3 (sitio público, registro, vinculación, portal base, contratación con formularios, gestiones, botón de baja y comunidad); visitas, instalación y conformidad en la etapa 4; facturas y factura digital en la etapa 5; pagos en línea, cupón único, débito automático y representaciones en la etapa 6; mora, convenios, suspensión y reactivación e incorporación de los usuarios del portal anterior en la etapa 7; consumos, autolectura y crédito prepago en la etapa 8; espacio del empleado en la etapa 10; turnos, tótem y servicios sociales e institucionales en la etapa 11; métricas avanzadas en la etapa 12.

**Usuarios principales**: socios, representantes, adherentes, visitantes y empleados; en la administración, operadores de atención, administradores de marca y contenidos, y administradores funcionales del portal.

### 10.20 Comunidad y comunicaciones

**Propósito**: brindar a cada cooperativa un sistema único de relación con su comunidad y de comunicación por todos los canales, que distingue la comunicación editorial, la notificación de un caso y la constancia regulada.

**Funciones principales**

**Muro y novedades**

- **Muro editorial** de la cooperativa con reacciones y comentarios de los socios, moderados por inteligencia artificial y por personas, habilitable por cooperativa y por publicación, con reglas, cola de revisión, reportes de contenido y sanciones.
- Noticias públicas en el sitio, muro del socio y muro del empleado.
- Publicaciones con tipo (noticia, aviso, corte programado, asamblea, beneficio, evento, institucional), programación, fijado con vencimiento, expiración, aprobación editorial configurable (obligatoria para el sitio público) y vista previa en celular.
- Opciones por publicación: avisar a la audiencia, permitir reacciones, permitir comentarios y elegir el modo de moderación.
- Moderación con reglas automáticas (términos prohibidos, datos personales, enlaces, frecuencia), análisis de texto e imágenes por inteligencia artificial que solo propone, cola de revisión única, respuesta institucional destacada y derivación al área de atención cuando un comentario es un reclamo de servicio.
- Sanciones escalonadas (advertencia, silencio temporal, suspensión de comentarios, bloqueo de la comunidad) con apelación revisada por otro moderador; reglas de comunidad versionadas que el socio acepta antes de su primer comentario.
- Boletines periódicos con variantes por audiencia, revisión previa y envío por correo y en la aplicación.

**Participación**

- **Encuestas** de satisfacción, calidad, censo, posteriores a un reclamo o a una instalación, votaciones rápidas y consultas no vinculantes.
- Constructor con más de treinta tipos de pregunta, lógica condicional, puntajes, consentimiento versionado, respuestas anónimas, recordatorios, enlace externo y QR (incluido el QR impreso en la factura), y respuesta sin conexión.
- Encuestas automáticas posteriores a la instalación, al cierre de un reclamo o de una orden de trabajo, con alertas por insatisfacción que se derivan al área de atención.
- Resultados por pregunta, por zona y por grupo, participación, NPS y satisfacción, con lectura asistida por inteligencia artificial opcional.
- **Agenda de eventos** con inscripción y recordatorios, y **beneficios para socios** con condiciones y canje.
- Eventos con cupo, lista de espera con promoción automática, acompañantes y registro de asistencia por QR; beneficios con elegibilidad por audiencia, cupo, código de canje único y validación por el comercio adherido.

**Audiencias y comunicaciones**

- **Audiencias**: una única forma de definir a quién se dirige cada comunicación (por servicio, zona, localidad, categoría, estado de deuda, rol, sucursal y otros atributos), con vista previa del alcance antes de publicar o enviar.
- La vista previa informa personas, cuentas y servicios alcanzados, el desglose por canal, los excluidos por motivo (sin contacto, baja voluntaria, horario, fuera del alcance del emisor) y el costo estimado; se puede elegir si el destino es la persona, la cuenta o el servicio, y guardar segmentos reutilizables.
- **Comunicaciones multicanal**: correo electrónico, SMS, WhatsApp, notificaciones en el celular, bandeja dentro de la aplicación e impresión en la factura; plantillas con variables, respeto de preferencias y consentimientos, horarios de no molestar, canal alternativo y constancia de entrega (enviado, aceptado por el proveedor, entregado, leído, fallido).
- **Contratación de la mensajería** en dos modelos a elección de la cooperativa: con su propio proveedor de SMS, WhatsApp Business o correo, o con el proveedor que ofrece la plataforma, con consumo medido y facturado como complemento del plan contratado.
- Plantillas versionadas por tipo de comunicación y canal, con vista previa y envío de prueba; plantillas de WhatsApp aprobadas por el proveedor; contador de caracteres y partes en SMS.
- Envío manual individual desde la ficha de la persona o la cuenta y envío rápido de facturas y recibos desde su vista previa, registrados en la historia de la persona.
- **Notificaciones automáticas** ante cada hecho relevante: factura emitida, vencimiento próximo, pago acreditado, corte programado, reclamo actualizado, turno, visita, técnico en camino.
- Avisos internos a los responsables de cada área según tipo de orden, servicio, días y franja horaria, y bandeja de avisos con marca de leído, descarte con opción de deshacer e indicador de pendientes.
- **Campañas masivas** programadas con métricas (enviados, entregados, abiertos, clics, rebotes, bajas) y control de costo por canal.
- Campañas con aprobación según su finalidad, tamaño o costo, prueba previa a una lista interna, prueba de dos asuntos alternativos y mensajes impresos en la factura por segmento.
- **Avisos de interrupción del servicio por zona**, programados o imprevistos, enviados solo a los afectados.
- Avisos de interrupción generados desde la gestión técnica, con afectación por ramal, transformador o nodo de red, publicación en el muro y en el sitio y aviso de restablecimiento.
- Preferencias por finalidad y canal, registro inalterable de consentimientos y bajas, enlace de baja de un clic en los correos promocionales y lista de contactos suprimidos por rebote, número inválido o queja.

**Reglas que aplica el sistema**

- Los socios no publican posteos propios: solo leen, reaccionan, comentan y reportan. Los comentarios están deshabilitados por defecto y requieren que la cooperativa y la publicación los habiliten.
- La inteligencia artificial solo propone; una persona decide en los casos de riesgo medio o alto, y sin inteligencia artificial la moderación sigue funcionando con reglas y revisión humana.
- Ocultar un comentario no elimina la evidencia: se conserva con acceso restringido durante el plazo de retención y su eliminación definitiva requiere aprobación.
- Una sanción de comunidad nunca afecta los servicios, las facturas, los pagos, los reclamos ni la recepción de avisos de la cuenta.
- Nadie puede dirigir una comunicación fuera de su propio alcance de datos; el recorte se aplica al guardar, publicar y enviar.
- Está prohibido segmentar o publicar por datos sensibles (salud, electrodependencia, banco de sangre, beneficiarios de sepelio).
- Una comunicación nunca se da por entregada por haberse puesto en cola o haber sido aceptada por el proveedor; si una comunicación que cumple un hito (intimación, constancia de baja) no se entrega, se genera una acción visible.
- Los avisos de seguridad y los regulatorios no se pueden desactivar (solo elegir canal); los operativos se pueden limitar por canal manteniendo al menos uno; los promocionales requieren consentimiento expreso para SMS, WhatsApp y correo.
- Los horarios de no molestar y los topes de envíos por persona no se aplican a los avisos de seguridad, de interrupción urgente ni a los regulatorios con plazo.
- Las consultas no vinculantes llevan esa leyenda y nunca producen efectos institucionales; las votaciones formales de asamblea pertenecen a la gestión institucional.

**Lo que ve el socio**

- Muro y novedades de su cooperativa según su audiencia, con reacciones y comentarios cuando están habilitados.
- Encuestas pendientes, iniciadas y finalizadas, con un aviso que nunca bloquea otras operaciones.
- Agenda de eventos con inscripción y beneficios disponibles con su código de canje.
- Bandeja de avisos con acceso directo a la factura, el reclamo o la visita correspondiente.
- Preferencias de comunicación por finalidad y canal, con su historial de consentimientos.
- Avisos de cortes programados en su zona.

**Información e indicadores**

- Tasas de entrega, lectura, clics, rebotes, quejas y bajas por canal y por campaña.
- Contactabilidad de los titulares y comunicaciones sin canal disponible.
- Costo de mensajería por canal, finalidad y área emisora.
- Alcance y participación de cada publicación.
- Tablero de moderación: tiempo de primera decisión, porcentaje de ocultos, coincidencia entre la inteligencia artificial y las personas, reportes abiertos y sanciones vigentes.
- Participación en encuestas, NPS y satisfacción posterior a la instalación por cuadrilla y servicio.
- Inscripción y asistencia a eventos, y canje de beneficios.
- Avisos de corte programado publicados con la anticipación mínima configurada.

**Etapa de habilitación**: base de avisos dentro de la aplicación en la etapa 1; comunidad completa, audiencias, comunicaciones multicanal, campañas y avisos de interrupción en la etapa 3; las notificaciones automáticas se habilitan en la etapa del área que las origina; encuestas posteriores a la instalación y avisos por afectación de red en la etapa 4; mensajes impresos en la factura y adhesión a la factura digital en la etapa 5; cartas impresas, exportación a discadores telefónicos y control de hitos de entrega en la etapa 7; análisis avanzado de encuestas con inteligencia artificial en la etapa 12.

**Usuarios principales**: editor y moderador de comunidad, responsable de comunidad, operadores de comunicaciones y aprobadores de campañas, gestores de encuestas, eventos y beneficios, atención al socio, gerencia, socios y empleados.

### 10.21 Reportes, tableros e integración con terceros

**Propósito**: ofrecer una capa única, controlada y reproducible de consulta de la información, en la que un mismo indicador o reporte arroja el mismo valor en la pantalla, en la exportación, en los tableros y en la interfaz para terceros, para un mismo universo y una misma fecha de corte.

**Funciones principales**

**Reportes**

- **Catálogo completo de reportes** de todas las áreas, con parámetros, filtros y permisos. Cada reporte tiene una ficha con su propósito, su nivel de detalle, sus columnas y una ayuda con la definición, la fórmula y un ejemplo; el catálogo se puede buscar por texto, marcar favoritos y ver los recientes, y solo muestra los reportes que el usuario puede ejecutar.
- Ejecución en pantalla o en segundo plano, con exportación a planilla, archivo de texto, PDF o formatos específicos. Los reportes extensos pasan automáticamente a segundo plano, muestran su avance, pueden cancelarse o reintentarse con los mismos parámetros y avisan al usuario cuando el archivo está listo.
- Reportes programados por correo, configuraciones guardadas y vistas personalizadas. Las programaciones admiten frecuencia diaria, semanal, mensual (incluido el primer día hábil según el calendario de la cooperativa) o por hecho (cierre de lote, de caja o de período), y usan parámetros relativos como "mes anterior" o "último período cerrado" para no tener que editarlas cada mes.
- **Encabezado obligatorio** en toda salida: cooperativa, reporte y versión, parámetros, universo, fecha de corte, tipo de fecha utilizado (emisión, vencimiento, pago, acreditación, contable, entre otros), origen y antigüedad del dato, usuario y fecha de generación.
- **Llegada al detalle** desde cada total o indicador hasta los registros que lo componen y el documento de origen.
- Reportes "a una fecha" para saldos, deuda, cartera, stock y anticipos, calculados con la fecha efectiva de cada movimiento, de modo que un pago registrado después del corte no altera el saldo a esa fecha.
- Exportación de cualquier listado del sistema a planilla, archivo de texto o PDF, con formato regional (separador punto y coma y coma decimal) o técnico, importes sin pérdida de centavos y protección contra fórmulas maliciosas en las celdas.
- Archivos de ancho fijo o con separador configurables por la cooperativa (columnas, largo, relleno, valores fijos y nombre del archivo) para contadores externos, sistemas geográficos, entes y bancos que no tengan un formato oficial.
- Vista en mapa y exportación a formatos geográficos para los reportes con ubicación, y rankings con cantidad configurable de posiciones.
- Catálogo de informes regulatorios por organismo y servicio, con su período y vencimiento; el formato oficial lo aporta el módulo responsable y el reporte se ejecuta con el mismo motor común.
- Reportes de control y conciliación entre cuenta corriente, facturación, cobranza, tesorería y contabilidad, y reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores o servicios duplicados).

**Tableros e indicadores**

- **Generador de reportes** para que la cooperativa arme sus propios informes sobre datos certificados, sin conocimientos técnicos: elige un conjunto de datos, campos, filtros, agrupaciones, totales, formato condicional y gráfico. Los informes propios pasan por borrador, revisión y publicación con aprobación de una persona distinta del autor, y existe una galería de modelos copiables provista por la plataforma.
- **Tableros por rol** (plataforma, gerencia, facturación, cobranzas, mora, técnica, atención, compras, tesorería, contabilidad, personal, institucional) con indicadores de definición precisa, alertas y acceso al detalle.
- **Catálogo de indicadores certificados**: cada indicador declara su fórmula, el universo y los estados incluidos, la fecha que lo imputa, la frecuencia de actualización, la unidad y el permiso necesario para ver el detalle. Un cambio de fórmula crea una versión nueva y no altera los valores históricos.
- Comparación contra el período anterior, el mismo período del año anterior, el objetivo y el umbral, con semáforo (correcto, advertencia o crítico), tendencias diarias y de cierre mensual, y filtros globales por período, servicio, sucursal, zona y categoría.
- **Alertas sobre indicadores** con severidad, destinatarios, canales, agrupación de repeticiones, reconocimiento, resolución y escalamiento.
- Tablero de pendientes por área (casos sin asignar, turnos fallidos, tareas vencidas, conciliaciones pendientes, configuraciones sin aprobar) y tablero móvil con los indicadores del rol en la aplicación del empleado.
- Personalización del tablero por cada usuario (fijar, ocultar y reordenar indicadores) sin cambiar lo que ven los demás.
- Salas de análisis e **inteligencia artificial analítica** que responde preguntas en lenguaje natural respetando los permisos y sin inventar cifras: cada respuesta cita el indicador o conjunto de datos usado, el universo y la fecha de corte, y si no puede responder lo informa.
- Almacén de datos para análisis, separado de la operación diaria, que se actualiza en forma continua y se concilia todos los días contra los datos operativos, con la antigüedad del dato visible en cada pantalla.
- **Comparación anónima opcional** entre cooperativas.
- Publicación opcional de datos abiertos en el sitio de la cooperativa (cantidad de usuarios por servicio, tarifas vigentes, indicadores de calidad de servicio y de atención), solo con información agregada y aprobada.

**Interfaz para terceros**

- **Interfaz de integración para terceros** con credenciales por cooperativa, permisos por recurso, límites de uso, documentación, extracción incremental, exportaciones masivas y avisos automáticos firmados. La cooperativa dispone siempre de sus datos.
- **Registro de sistemas autorizados**: la cooperativa da de alta cada sistema externo (su propia herramienta de análisis, un municipio, una federación, un asistente virtual) con responsable, finalidad, contacto técnico, vigencia y, opcionalmente, restricción a ciertas sucursales o servicios. El alta queda pendiente hasta que un usuario con permiso la aprueba, y puede suspenderse o reactivarse en cualquier momento.
- **Permisos de solo lectura por área**: facturación, cobranza, cuenta corriente, mora, atención, órdenes de trabajo, consumos, contabilidad, compras y stock, tesorería, institucional, indicadores y conjuntos de datos. Cada sistema recibe solo los permisos que necesita y nunca accede a tablas internas ni a consultas libres.
- **Datos personales con permiso separado**: sin ese permiso, documentos, teléfonos, correos y domicilios se entregan enmascarados. El permiso exige una finalidad registrada, la aprobación de una persona distinta de quien dio de alta el sistema y una vigencia máxima de un año. La información de sueldos se entrega solo en forma agregada, nunca recibos individuales.
- **Claves de acceso** que se muestran una única vez, se renuevan con un período de convivencia, vencen como máximo al año y se revocan con efecto en menos de un minuto.
- **Límites de uso** por sistema y por cooperativa (por defecto, 600 consultas por minuto y un cupo diario por sistema), ajustables según el plan contratado, para que la interfaz nunca afecte la facturación ni la atención.
- **Registro de uso visible para la cooperativa**: consultas por sistema y por recurso, errores, volumen entregado y consumo del cupo, sin guardar nunca claves ni secretos.
- Extracción incremental de solo lo modificado desde la última consulta, con las bajas y anulaciones informadas como cambios de estado; exportaciones masivas con vencimiento y descarga protegida; conexión con herramientas de inteligencia de negocio de uso común mediante una clave de solo lectura.
- Avisos automáticos firmados opcionales a los sistemas suscritos ante hechos relevantes, con reintentos y reenvío manual; el aviso no incluye datos personales y el detalle se consulta con los permisos del sistema.
- Documentación publicada con ejemplos ficticios, entorno de prueba con datos de demostración y aviso mínimo de seis meses antes de retirar una versión de la interfaz.
- Paquete completo de salida con todos los datos de la cooperativa, su diccionario de datos y sus controles de integridad, para el caso de cambio de proveedor.

**Reglas que aplica el sistema**

- Un reporte o un tablero nunca modifica datos. Cuando un usuario necesita actuar sobre una selección (notificar, generar órdenes de trabajo), el reporte entrega la selección al módulo responsable, que vuelve a validar cada registro y exige su propio permiso.
- Cada usuario ve solo las filas de su alcance (sucursal, zona, servicio, cuadrilla o propios) y los totales se calculan únicamente sobre lo que puede ver.
- Los datos personales se muestran enmascarados por defecto; verlos completos requiere un permiso específico y cada exportación, descarga o desenmascarado queda registrado.
- Los términos facturado, cobrado, acreditado, en proceso y saldo tienen una sola definición en todo el sistema; los pagos en proceso o sin confirmar se informan siempre separados de los confirmados.
- Sin datos se muestra "sin datos para el universo elegido", nunca un cero; una variación contra una base en cero se marca como "nuevo" y no como un porcentaje engañoso.
- Los reportes históricos usan la tarifa, la categoría y la configuración vigentes a la fecha de cada documento, y las simulaciones se identifican siempre con una marca visible y nunca se mezclan con datos reales.
- Los archivos exportados se descargan con un enlace de pocos minutos que vuelve a verificar el permiso, y se eliminan a los 7 días; el registro de la exportación se conserva.
- Los envíos por correo de reportes con datos personales incluyen solo un enlace que exige ingresar al sistema. Una programación corre con los permisos vigentes de su dueño y de cada destinatario, y se suspende tras 3 fallos consecutivos o si su dueño pierde el permiso.
- La interfaz para terceros es de solo lectura; las únicas altas posibles son solicitudes (alta de persona o de cuenta, reclamo) que el área responsable procesa con su circuito habitual. Si la cooperativa se suspende, el acceso se corta.
- La comparación entre cooperativas requiere adhesión voluntaria, usa solo proporciones (nunca montos), exige al menos 5 cooperativas por grupo y ninguna puede aportar más del 40 % del total; los datos abiertos exigen un mínimo de 10 casos por celda.

**Información e indicadores**

- Uso de la plataforma de reportes: más ejecutados, usuarios, duración y tasa de fallos.
- Accesos a reportes con datos personales, por usuario, reporte y acción.
- Exportaciones por estado, formato y tamaño, incluidas las vencidas sin descargar.
- Programaciones y entregas: enviadas, omitidas por falta de permiso, fallidas y rebotadas.
- Alertas de indicadores por regla y severidad, con tiempos de reconocimiento y de resolución.
- Uso de la interfaz para terceros por sistema y recurso, y entregas de avisos automáticos.
- Conciliación diaria entre los datos operativos y el almacén de análisis, y antigüedad de cada conjunto de datos.
- Preguntas a la inteligencia artificial por sala, respondidas o rechazadas por motivo, valoración y costo.

**Etapa de habilitación**: el motor de reportes, el catálogo, las exportaciones, el tablero de plataforma y el registro de accesos se habilitan en la etapa 2; los reportes programados, el tablero de la cooperativa y las alertas, en la etapa 3; cada reporte del catálogo llega con la etapa de su módulo; el almacén de análisis, las salas, la inteligencia artificial, el generador de reportes, la interfaz para terceros, los avisos automáticos, la comparación entre cooperativas y los datos abiertos, en la etapa 12.

**Usuarios principales**: todos los roles según sus permisos, sistemas de terceros autorizados; en particular gerencia y consejo, responsables de área, analistas o responsables de datos, síndico y auditores, y el administrador de la cooperativa, que autoriza y controla a los sistemas externos.

### 10.22 Trámites, aprobaciones y documentos

**Propósito**: brindar a todos los módulos un mecanismo común de circuitos, aprobaciones, tareas y gestión documental, para que cada acción sensible quede controlada, cada trámite tenga responsable y plazo, y cada documento se conserve íntegro y trazable.

**Funciones principales**

**Operaciones y aprobaciones**

- **Operaciones sensibles con aprobación** (anular un recibo, reintegrar, condonar intereses, publicar una tarifa, reabrir un período, fusionar personas): ninguna produce efectos antes de aprobarse. Cada operación tiene número propio, motivo, importe, estado visible (pendiente, confirmada, fallida o con resultado incierto) y su historia queda en el expediente del sujeto.
- Aprobaciones simples, multinivel, en paralelo, por tramos de monto, por riesgo, con doble firma o firma conjunta, vencimiento, escalamiento y delegación. También se admiten aprobaciones por quórum (por ejemplo, dos de tres firmantes) y votaciones de comité con quórum y mayoría para el consejo.
- **Políticas de aprobación** por tipo de operación, con versión y vigencia, que definen los pasos según importe, área, sucursal, servicio, categoría y riesgo, y un simulador que muestra quién aprobaría y en qué orden antes de publicar la política.
- Aprobación desde la bandeja o desde el celular, incluida la decisión en bloque de solicitudes similares, con resultado individual por cada una.
- Delegación temporal de aprobaciones con fecha de inicio y fin, alcance y límite de importe; la decisión muestra el nombre del delegado y del delegante.
- Operaciones en lote (por ejemplo, condonar intereses a treinta cuentas) con una sola aprobación y resultado por cada ítem, sin que un ítem fallido afecte a los demás.

**Trámites, tareas y agenda**

- **Circuitos de trámites configurables** con estados, responsables por rol o área, plazos, vencimientos, escalamiento, formularios dinámicos y adjuntos. La cooperativa ajusta los modelos de la plataforma y crea trámites nuevos de solicitud genérica.
- Ajuste de modelos dentro de los puntos habilitados (responsables, plazos, formularios y textos); los trámites genéricos que crea la cooperativa terminan siempre en una tarea o en un caso de atención. Cada versión de un circuito se valida y puede simularse con datos de prueba antes de publicarse.
- **Formularios dinámicos** con tipos de dato controlados (importes, fechas, CUIT, CUIL o DNI con validación, domicilio normalizado, ubicación, archivos, firma, tablas repetibles, aceptación de términos), campos visibles u obligatorios según otras respuestas, por canal y por rol, y campos que completa solo el personal.
- Inicio de trámites desde la aplicación del socio, desde el sistema de gestión o automáticamente ante un hecho, con número y constancia; los datos que el sistema ya tiene validados se muestran precargados.
- Plazos en días hábiles según los calendarios de la cooperativa, con aviso previo, pausa mientras se espera al socio o a un tercero, guardias de escalamiento fuera de horario y recálculo de los plazos no vencidos cuando se agrega un feriado.
- **Bandeja unificada del empleado**: tareas, aprobaciones, gestiones asignadas, órdenes de trabajo, excepciones de procesos y operaciones detenidas.
- Bandeja agrupada por vencimiento (vencidos, hoy, mañana, próximos 7 días, futuro), con prioridad, filtros, vistas guardadas, acciones directas (aprobar, rechazar, completar, reasignar, posponer, comentar) y vista de supervisión con la carga de cada persona y reasignación masiva.
- Tareas sueltas con responsable, vencimiento, repetición periódica, lista de verificación, evidencia obligatoria al completarlas y comentarios con menciones, en reemplazo del correo interno.
- Reasignación automática de las tareas de una persona que se da de baja, se suspende o toma licencia.
- **Agenda integrada** con los calendarios de todos los módulos.
- Procesos masivos y programados con progreso visible, pausa, reanudación y bandeja de excepciones.
- Pausa automática de un proceso masivo ante una falla general (por ejemplo, un organismo externo caído) y reproceso solo de los ítems con excepción, sin repetir los ya resueltos.

**Documentos, numeración y firma**

- **Repositorio documental** privado por cooperativa con tipos de documento, versiones, metadatos, nivel de sensibilidad, plazos de conservación, retención por causas legales y enlaces revocables.
- Control de cada archivo al subirlo (tipo real, tamaño y antivirus), versiones que nunca se sobrescriben, vínculo de un mismo documento con varios sujetos y aviso de vencimiento de documentos (por ejemplo, la documentación de un proveedor).
- Generación de documentos PDF (facturas, recibos, certificados, actas) con formato de archivo de largo plazo (PDF/A), generados en forma aislada y segura a partir de plantillas con la marca de la cooperativa, copias, marcas de agua, códigos QR y de barras.
- Plantillas versionadas con vista previa, en las que la cooperativa edita las zonas permitidas (pie, textos) sin alterar los bloques fiscales; las plantillas de documentos fiscales y legales se publican solo con aprobación.
- **Numeración de documentos** por sucursal, punto de venta, tipo de documento o año, sin huecos donde la norma lo exige y con registro de cada número anulado.
- Firma electrónica con código de un solo uso, que es la opción por defecto para conformidades de instalación, convenios y trámites; firma digital con proveedor licenciado reservada a los recibos de sueldo y a las actas.
- Conformidad con firma manuscrita capturada en pantalla (en campo o en mostrador), identificada siempre como conformidad y nunca como firma digital, con la imagen del trazo, la fecha, la identificación declarada y la ubicación si se autoriza.
- Varios firmantes en orden o en paralelo, con vencimiento, recordatorios y rechazo con motivo.
- Verificación pública de documentos emitidos o firmados mediante un código o un QR, que muestra tipo, fecha, emisor y huella del documento sin datos personales.
- **Expediente digital** de cada persona, cuenta, contrato, suministro, empleado, proveedor o caso, con línea de tiempo de documentos, operaciones, aprobaciones, trámites y comunicaciones, y exportación auditada.
- Expediente formal numerado con carátula y foliatura para la mesa de entradas, con pases entre áreas y acuse de recepción.

**Reglas que aplica el sistema**

- Ninguna operación sensible tiene efecto antes de aprobarse; al ejecutarse se vuelven a verificar sus condiciones (saldo, estado, período abierto) y, si cambiaron, falla sin aplicar cambios parciales. Una operación aprobada que no se ejecuta en 24 horas exige confirmar la aprobación.
- El solicitante nunca aprueba su propia solicitud, una misma persona no decide dos pasos de la misma solicitud y los límites de importe del aprobador se controlan al decidir.
- Si cambia el contenido relevante de una solicitud (importe, destino, cuenta bancaria), las aprobaciones anteriores caducan.
- El vencimiento de un paso puede sumar aprobadores, reasignar o hacer vencer la solicitud, pero nunca aprueba automáticamente; una política "sin aprobación" debe estar declarada en forma explícita y queda registrada.
- Una delegación nunca amplía permisos, dura como máximo 90 días y no permite decidir solicitudes en las que el delegado es solicitante o beneficiario.
- Ningún archivo se sobrescribe ni se borra por un usuario: las anulaciones son lógicas y la eliminación definitiva solo ocurre con el plazo de conservación cumplido, sin retención legal y con aprobación. Mientras no se confirmen los plazos legales de cada tipo de documento, se conserva todo.
- Un documento emitido es inmutable: se genera una única vez y cada reimpresión se identifica como tal. Un número asignado nunca se reutiliza, aunque el documento se anule.
- Toda descarga verifica el permiso y usa un enlace de vida corta; los accesos a documentos personales, fiscales, restringidos o de salud quedan registrados, y los enlaces compartidos vencen como máximo a los 30 días.
- El código de firma vence a los 10 minutos y admite 3 intentos; un documento firmado no admite nuevas versiones dentro de la misma firma.

**Lo que ve el socio**

- "Mis trámites" con los trámites habilitados por la cooperativa, número y constancia de inicio, estado, plazo y comentarios públicos, sin ver las notas internas.
- Borradores de trámites que se conservan 30 días, con aviso antes de vencer.
- "Mis documentos" con sus facturas, contratos, constancias y documentos firmados, solo de las cuentas a las que tiene acceso y de los tipos marcados como visibles.
- Lista de documentación obligatoria de cada trámite, con su estado: presentada, validada, vencida o faltante.
- Firma de conformidades y convenios con un código recibido en su celular o correo.
- Verificación de un certificado o constancia escaneando su código QR.

**Información e indicadores**

- Pendientes por responsable y por área, con antigüedad y vencidos.
- Aprobaciones por política: solicitadas, aprobadas, rechazadas, vencidas y tiempo medio por paso.
- Controles de separación de funciones: intentos bloqueados de autoaprobación y decisiones por delegación.
- Operaciones por tipo y estado, incluidas las de resultado incierto.
- Trámites por circuito, tiempo medio por etapa y cumplimiento de plazos por área.
- Procesos masivos: universo, procesados, excepciones por motivo y duración.
- Documentos por tipo, accesos a documentos sensibles, pendientes de eliminación y retenciones legales.
- Firmas solicitadas, completadas en término, rechazadas y vencidas, y libro de registro de la mesa de entradas.

**Etapa de habilitación**: el repositorio documental, las plantillas de documentos PDF, la numeración y los procesos masivos se habilitan en la etapa 1; las operaciones con aprobación, las políticas, la bandeja unificada, las tareas y el expediente digital, en la etapa 2; los circuitos de trámites, los formularios dinámicos, los plazos y la agenda, en la etapa 3; la conformidad con firma en campo, en la etapa 4; la generación masiva de comprobantes y la aprobación de plantillas fiscales, en la etapa 5; la firma digital de actas y recibos de sueldo, en las etapas 9 y 10; el expediente formal y la mesa de entradas, en la etapa 11.

**Usuarios principales**: todo el personal; en particular supervisores y responsables de área, aprobadores y firmantes autorizados, administración y mesa de entradas, consejo de administración, y socios que inician trámites y consultan sus documentos.

### 10.23 Configuración y parametrización

**Propósito**: permitir que cada cooperativa configure el sistema sin programar, con control de versiones y trazabilidad, de modo que cada cambio se valide, se simule, se apruebe y se aplique completo desde una fecha efectiva, y que siempre pueda explicarse qué configuración se usó en cada documento.

**Funciones principales**

**Parámetros y versiones**

- Parámetros con nombres claros, tipo, validación, dependencias, valor por defecto, ámbito (plataforma, cooperativa, sucursal, servicio, categoría, usuario) y vigencia.
- Valor efectivo visible: para cada parámetro, el sistema muestra qué valor rige en una sucursal, un servicio o una categoría y de qué ámbito proviene, aplicando siempre el más específico.
- Clasificación de cada cambio como comercial, fiscal, operativo, de presentación, de seguridad o técnico, que determina si requiere simulación y revisión; una corrección de presentación no dispara revisiones comerciales innecesarias.
- **Versiones de configuración** con borrador, validación, simulación, revisión, aprobación, programación, publicación y reversión, sin dejar referencias rotas por cambios parciales.
- Comparación de cada borrador con la configuración vigente (valor anterior y nuevo de cada ítem), detección de dos borradores que modifican lo mismo y simulación sin efectos (por ejemplo, la primera factura de un plan, el interés de una deuda de ejemplo o la tarifa de una categoría).
- Publicación programada para una fecha y hora futuras, cancelación de una versión programada antes de que rija y reversión mediante una versión nueva que restituye los valores anteriores.
- Historia completa de valores: qué configuración se usó en cada documento.
- Consulta de la configuración vigente a una fecha y de lo que se conocía en una fecha determinada, con registro de autor, revisor, motivo y valores anteriores y nuevos de cada cambio.
- Registro de la norma, la jurisdicción y la vigencia de cada configuración regulada.
- Perfil de configuración de cada servicio con su porcentaje de completitud por dimensión (prestador, titularidad, oferta, facturación, cobro, operación, atención, entre otras), con la opción de marcar "no aplica" con motivo.

**Tablas maestras y maestros comunes**

- Editor uniforme de tablas maestras con búsqueda, vigencias, uso, unificación de duplicados, importación y exportación.
- Consulta "en uso por" antes de inactivar o unificar un registro, con la cantidad de referencias por módulo, y códigos externos por registro para organismos y entes.
- Importación de padrones y precarga de catálogos de ejemplo.
- Importación guiada desde planillas o archivos de texto con vista previa de errores por fila, modos de alta, actualización o reemplazo de vigencia, ejecución en segundo plano y archivo de errores descargable.
- Maestros comunes mantenidos por la plataforma: geografía argentina completa con catálogo nacional de calles, calendarios y feriados, índices económicos, cotizaciones, tasas y tablas fiscales.
- Adopción de los maestros de la plataforma por cada cooperativa: las tablas que afectan cálculos (fiscales, índices) se aplican con aviso previo según el modo elegido por la cooperativa, y la cooperativa puede agregar registros propios donde la tabla lo admite (por ejemplo, un feriado municipal o una localidad rural).
- Geografía propia de la cooperativa: barrios, zonas, distritos, secciones catastrales, calles locales para loteos nuevos o zonas rurales (con propuesta de incorporación al catálogo nacional) y nombres históricos o populares de calles.
- **Normalización y ubicación de domicilios** con el servicio oficial de georreferenciación y un mapa para confirmar o corregir el punto de prestación, con registro de la fuente, la precisión, el momento, el responsable y el motivo.
- Calendarios nacional, provincial, municipal y propios de la cooperativa, con cálculo de días hábiles en la zona horaria de la cooperativa, que usan todos los módulos para vencimientos y plazos.
- Series de índices (inflación, cotizaciones, tasas para mora y otros) con fuente, ingesta automática de las oficiales, alerta si falta un valor esperado, carga de series propias y revisiones que no borran el valor anterior.
- Catálogo de monedas con sus atributos de cobro y redondeo.

**Personalización y estructura de la cooperativa**

- Campos adicionales tipados, personalización acotada de formularios y vistas guardadas.
- Listas configurables (estado civil, ocupación, canales de contacto, motivos de baja, entre otras) con código estable, de modo que cambiar una etiqueta no altera los datos guardados.
- Campos adicionales por entidad (persona, cuenta, contrato, inmueble, orden de trabajo, reclamo, producto, proveedor, empleado, bien de uso) con tipo, obligatoriedad, validaciones, visibilidad por canal y uso en búsquedas, listados, exportaciones e importaciones.
- Personalización de formularios para ocultar campos opcionales, volver obligatorio un campo opcional, fijar valores por defecto, cambiar etiquetas y ordenar campos, aplicada por igual en pantalla y en las validaciones del sistema.
- Varias personas jurídicas dentro de una misma cooperativa.
- Personas jurídicas con razón social, CUIT, condición frente al IVA, régimen de Ingresos Brutos, domicilio legal e inicio de actividades, con emisión de comprobantes, contabilidad y sueldos separados por cada una. Al crear la cooperativa se genera su persona jurídica principal; cada documento económico se asigna a la persona jurídica indicada, a la emisora del servicio, a la de la sucursal o a la principal, en ese orden.
- Sucursales con su persona jurídica, domicilio, usos (atención, caja, depósito, punto de venta, base técnica), horarios y calendario local, y puestos de trabajo con sus dispositivos.
- Credenciales de integraciones guardadas en una bóveda cifrada, nunca visibles.
- Vista de la configuración técnica de la cooperativa que lista las credenciales requeridas por los módulos activos con su estado (configurada, faltante o por vencer), sin mostrar nunca su valor.

**Reglas que aplica el sistema**

- No existe edición directa de un valor vigente: todo cambio se hace en una versión que se valida y se publica completa o no se publica.
- Una versión no se publica si deja un plan visible sin precio vigente, una referencia inexistente, inactiva o de otra cooperativa, una credencial faltante para una integración habilitada o una dependencia incumplida.
- Los cambios comerciales, fiscales y de seguridad requieren por defecto la aprobación de un usuario distinto del autor.
- Una fecha efectiva en el pasado se admite solo con aprobación y hasta 31 días hacia atrás por defecto; nunca reescribe documentos emitidos o cerrados, y el módulo responsable genera los ajustes que correspondan.
- Publicar un cambio no modifica contratos ni documentos ya emitidos; si afecta contratos vigentes, la versión declara si se aplica solo a los nuevos, a todos desde una fecha o si requiere una acción.
- El ámbito "usuario" se usa solo para preferencias personales; ningún parámetro comercial, fiscal o de seguridad puede variar por usuario.
- Un registro maestro en uso no se borra: se inactiva o se unifica. Agregar o corregir un feriado o un índice no cambia los vencimientos ni los importes de documentos ya emitidos; un valor faltante de un índice nunca se reemplaza por cero.
- Geocodificar un domicilio no certifica la cobertura, la existencia del inmueble ni la titularidad; el sistema nunca informa una precisión que no tiene ni completa una calle inexistente con otra homónima.
- La personalización nunca oculta ni vuelve opcional un campo exigido por la ley o por el negocio, y las vistas guardadas nunca amplían lo que el usuario puede ver.
- Siempre existe exactamente una persona jurídica principal activa; el CUIT de una persona jurídica con documentos emitidos no se modifica (un CUIT distinto es una persona jurídica nueva). Los catálogos de ejemplo se aplican solo en cooperativas de demostración o de prueba, rotulados como ilustrativos.

**Lo que ve el socio**

- Búsqueda de su domicilio en el catálogo de calles, con mapa opcional para ubicar el punto y siempre con la alternativa de completarlo sin mapa.
- Uso de la ubicación de su celular solo si da permiso, sin que esa posición se tome como domicilio contratado.

**Información e indicadores**

- Registro de cambios de configuración con valores anteriores y nuevos, autor, revisor, fecha efectiva y de registro.
- Configuración vigente a una fecha, con la fecha interpretada en el encabezado.
- Tiempo de ciclo de las versiones y versiones rechazadas o fallidas con sus motivos.
- Control de integridad: valores inválidos, referencias rotas y credenciales faltantes o por vencer.
- Completitud de los perfiles de configuración por servicio.
- Calidad de la georreferenciación (puntos confirmados, aproximados y pendientes) y consumo mensual de ubicaciones frente al cupo.
- Cobertura de padrones, adopciones de tablas de la plataforma pendientes e importaciones con sus errores.
- Uso de los campos adicionales por entidad.

**Etapa de habilitación**: el registro de parámetros, las personas jurídicas y las sucursales se habilitan en la etapa 1; las versiones de configuración, las tablas maestras, la geografía y los calendarios, en la etapa 2; los campos adicionales, la personalización de formularios, los catálogos de ejemplo y el perfil por servicio, en la etapa 3; los padrones y las monedas, en la etapa 5; los índices económicos, en la etapa 6; las tablas de entes reguladores y la migración de la configuración del sistema actual de la cooperativa, en la etapa 8; las tablas legales de sueldos, en la etapa 10.

**Usuarios principales**: administrador de la cooperativa, responsables de área; también revisores y aprobadores de configuración, el responsable fiscal, operadores de tablas maestras, auditores en consulta, y la plataforma, que mantiene los maestros comunes.

### 10.24 Marca, vocabulario y experiencia de uso

**Propósito**: que cada cooperativa tenga su propia aplicación y su propio lenguaje sin desarrollos a medida, con una experiencia uniforme, accesible y fácil de usar en todas las aplicaciones.

**Funciones principales**

**Marca**

- Marca de la cooperativa aplicada en todas las aplicaciones: nombre, colores, logos, pantalla de inicio, ícono instalable y color del navegador, con validación de contraste.
- Recursos diferenciados por canal (sistema de gestión, aplicación del socio, aplicación del empleado, aplicación de campo, sitio público, documentos y correo), con la posibilidad de usar una misma imagen en varios canales y herencia automática cuando un canal no tiene imagen propia.
- Control automático de formatos, tamaños y transparencias de las imágenes, generación de todas las variantes de íconos a partir de un original y logos por sucursal opcionales.
- Si un color de la cooperativa no alcanza el contraste mínimo, el sistema calcula una variante accesible para textos y lo advierte, sin impedir su uso decorativo.
- Previsualización de la marca antes de publicarla en el sistema de gestión, la aplicación del socio, el ingreso, la pantalla de inicio, el sitio público, el ícono instalado, el correo y la factura, en tema claro y oscuro.
- Publicación versionada de la marca con reversión a la versión anterior en un paso, y nombre del remitente por canal (correo, SMS) tomado de la marca.
- Tres aplicaciones instalables por cooperativa desde la misma aplicación web (socios, equipo y campo), cada una con el nombre y el ícono de la cooperativa, sin necesidad de publicarlas en tiendas.
- Pantalla de ingreso con la marca de la cooperativa cargada antes de autenticarse, resuelta por la dirección de la cooperativa o por su código.

**Vocabulario**

- **Diccionario de términos**: la cooperativa adapta todas las etiquetas a su vocabulario, con variantes por canal y publicación versionada.
- Términos de negocio con singular, plural, forma corta y género gramatical, de modo que cambiar "Socio" por "Asociado" actualiza todas las etiquetas que lo usan con la concordancia correcta ("Nuevo asociado", "Nueva gestión").
- Previsualización en contexto, aviso de textos demasiado largos, búsqueda de dónde se usa cada término y registro de cada cambio con autor, fecha, valor anterior y nuevo.
- Importación y exportación del diccionario en planilla y diccionarios modelo por tipo de cooperativa (eléctrica, de agua, telefónica, entre otras), con doble control de publicación opcional.
- Aplicación del vocabulario a pantallas, menús, ayudas, documentos, reportes, exportaciones, correos, SMS, WhatsApp y notificaciones, con el diccionario de la cooperativa de cada destinatario.

**Experiencia de uso**

- Sistema de gestión con tema oscuro por defecto y tema claro opcional, diseñado para trabajo intensivo.
- Aplicación del socio pensada para el celular, con el tema que defina la cooperativa (oscuro por defecto, claro o a elección del usuario), pantallas de ingreso y de inicio siempre oscuras y sitio público claro por defecto.
- Accesibilidad según el estándar internacional WCAG 2.2 nivel AA en todas las aplicaciones, verificada con teclado y lectores de pantalla en los recorridos esenciales.
- Ayuda contextual en cada pantalla.
- Ayuda que explica qué hace la pantalla, quién la usa, cuándo, dónde, por qué y cómo, con un caso de uso; la cooperativa puede complementar el texto base.
- Altas y modificaciones en ventanas emergentes, importaciones guiadas desde planillas, listados con filtros, orden y exportación.
- **Mapa del sitio** con buscador de todas las pantallas permitidas, que también encuentra las funciones por el nombre que tenían en el sistema actual de la cooperativa, accesos fijados por el usuario (hasta 12), menú lateral, buscador general de personas, cuentas, comprobantes y órdenes, y centro de alertas.
- Selector de contexto para cambiar de cooperativa, sucursal, servicio o período sin cerrar la sesión.
- Una tarea principal clara por pantalla en la aplicación del socio, con el estado de cada trámite separado del estado del servicio, y una bandeja del empleado que muestra la siguiente acción y su responsable.
- Fechas en formato día-mes-año, importes con separador de miles y coma decimal, mensajes de error junto al campo con indicación de cómo corregirlos y confirmación con escritura del identificador para acciones económicas irreversibles.
- Borradores y recuperación de cargas interrumpidas, opción de deshacer durante unos segundos en descartes no económicos y avisos de progreso en los procesos largos, que continúan aunque se cierre la pantalla.
- Preferencias de cada usuario: tema, densidad de las tablas, tamaño de texto (100 %, 115 % o 130 %), reducción de movimiento, accesos fijados y vistas guardadas, sincronizadas entre dispositivos.

**Reglas que aplica el sistema**

- Ninguna pantalla muestra textos fijos: todo texto visible proviene del diccionario, salvo los datos del negocio (nombres de personas, servicios o conceptos) y el contenido editorial.
- Los nombres de servicios, planes, productos y conceptos se editan en el catálogo, no en el diccionario.
- Las leyendas fiscales, normativas, legales y de consentimiento son textos protegidos que la cooperativa no puede modificar.
- Dos conceptos distintos no pueden tener el mismo nombre visible: baja definitiva y suspensión temporal, cuenta y contrato, asociado y titular, factura y resumen de cuenta, solicitud y servicio activo, reclamo y solicitud comercial.
- Cambiar una etiqueta no modifica códigos, permisos, identificadores ni nombres técnicos de las exportaciones e integraciones, y no reescribe noticias, mensajes ni textos históricos ya publicados.
- Cada documento emitido conserva la versión del diccionario y de la marca con que se generó, de modo que la reimpresión es idéntica.
- Los colores de estado (correcto, advertencia, error) y las tipografías no se personalizan, para preservar su significado y la legibilidad; el color nunca es el único indicador de un estado.
- Mostrar u ocultar una pantalla en el menú no otorga ni quita permisos: cada acción vuelve a verificarse en el servidor, y un enlace directo a una pantalla no permitida no revela si el dato existe.
- Todo mapa y todo gesto táctil (arrastrar, firmar, deslizar) tienen una alternativa equivalente, y ningún trámite exige usar el mapa.
- Toda propuesta generada por inteligencia artificial se muestra como borrador y requiere confirmación de una persona. El sistema funciona en español de Argentina.

**Lo que ve el socio**

- Una aplicación con el nombre, el ícono, los colores y la pantalla de inicio de su cooperativa, instalable en su celular.
- Inicio con su última factura, los cortes programados en su zona, encuestas y gestiones abiertas, y una barra inferior con Inicio, Cuentas, botón de alta, Gestiones y Comunidad.
- Avisos destacados en la parte superior (pendientes sin conexión, encuestas, deuda vencida o servicio suspendido, cortes programados), con un máximo de dos visibles a la vez.
- Textos con el vocabulario propio de la cooperativa y explicación de "¿por qué pago esto?" en cada factura.
- Ajuste del tamaño del texto y del tema, si la cooperativa lo permite.
- Oferta de instalación tras el primer ingreso, que no se repite durante 30 días si se descarta.

**Información e indicadores**

- Términos sin texto definido detectados en uso.
- Grado de personalización del diccionario de la cooperativa.
- Publicaciones y reversiones de marca y diccionario por período.
- Cumplimiento de contraste de la marca publicada.
- Utilidad de las ayudas según la valoración de los usuarios.
- Instalaciones de las aplicaciones del socio, del equipo y de campo.
- Búsquedas en el mapa del sitio sin resultado, para mejorar los términos de búsqueda.
- Pendientes sin conexión con más de 24 horas en la aplicación de campo.

**Etapa de habilitación**: la marca por defecto de cada cooperativa, el mecanismo del diccionario, los temas, los componentes comunes y los criterios de accesibilidad se habilitan en la etapa 1; el editor de marca y de diccionario, la previsualización, la validación de contraste y la ayuda editable, en la etapa 2; el sitio público y la experiencia completa de la aplicación del socio, en la etapa 3; la conservación de la versión del diccionario en los documentos emitidos, en la etapa 5.

**Usuarios principales**: administrador de la cooperativa, responsable de comunicación o de marca, todo el personal y los socios, que usan las aplicaciones con la marca y el vocabulario de su cooperativa.

### 10.25 Integraciones externas

**Propósito**: conectar el sistema con todos los organismos, proveedores y equipos que la cooperativa necesita, con una arquitectura común, segura y monitoreada, de modo que sumar una red de cobranza, una pasarela, un fabricante de medidores o un organismo sea una tarea de configuración y que ninguna falla externa produzca cobros duplicados, numeración fiscal salteada ni socios afectados por un problema ajeno.

**Integraciones contempladas**

| Ámbito | Integraciones |
|---|---|
| Fiscal | ARCA: autenticación, autorización de comprobantes, padrones, constancias, comprobantes recibidos y regímenes informativos; organismos tributarios provinciales y municipales. Incluye la autorización anticipada para contingencias, la factura de exportación, la factura de crédito electrónica MiPyME, la constatación de comprobantes, la importación de comprobantes recibidos, el Libro IVA Digital, los regímenes de retenciones y percepciones, el padrón de Ingresos Brutos y el código de validación de Rentas Córdoba, el Convenio Multilateral, ARBA y otras jurisdicciones, y las retenciones y tasas municipales. |
| Cobranza | Pagos360, Mercado Pago, SIRO, Red Link, otras pasarelas y entes recaudadores, débitos automáticos bancarios y de tarjetas. Incluye Banelco y Pago Mis Cuentas, Rapipago, Pago Fácil, bancos recaudadores por archivo, el QR interoperable de transferencias, DEBIN, el cupón para pagar sin conexión y las pasarelas secundarias (Macro Click de Pago, NaranjaX, PayFun, Pagos TIC, SiPago, Helipagos, ProntoPago y ProvinciaNet), además de la cobranza fuera de oficina y los puntos de venta remotos de energía prepaga. |
| Bancos | Extractos bancarios, banca electrónica empresarial, archivos de pago de haberes y de proveedores, cheques electrónicos. Incluye la consulta de saldos y movimientos en Interbanking y la generación de archivos de pago que la cooperativa firma en su banca electrónica. |
| Redes de Internet y televisión | MikroTik, Radius, SmartOLT, Wispro y otras plataformas de gestión de red y aprovisionamiento. Incluye el monitoreo de red y de equipos, y los sistemas de acceso condicional de televisión. |
| Telefonía | Registros de llamadas de centrales, operadoras de telefonía móvil. Incluye la reventa de telefonía móvil y la atención telefónica automatizada. |
| Medición | Sistemas de telemedición y de medidores prepagos. Incluye los colectores portátiles de lectura, los sistemas de medición y gestión remota y la generación de recargas para medidores prepagos. |
| Mensajería | WhatsApp Business, SMS, correo electrónico y notificaciones en el celular. |
| Identidad | Google, cuentas corporativas, Ciudadano Digital de Córdoba. |
| Mapas | Normalización de domicilios con el servicio oficial de georreferenciación y mapas con autocompletado de direcciones. Incluye la importación de planos de redes y la consulta al sistema geográfico o catastral propio de la cooperativa. |
| Inteligencia artificial | Proveedores de inteligencia artificial para atención, moderación, lectura de documentos y análisis. |
| Firma | Proveedores licenciados de firma digital. |
| Reguladores y federaciones | Entes de energía, gas y comunicaciones, organismos de control cooperativo y federaciones. Incluye ERSeP, ENARGAS, ENACOM, la Secretaría de Energía y CAMMESA, otros entes provinciales, INAES, FECESCOR, los padrones de subsidios y segmentación de energía y gas, y el registro de electrodependientes. |
| Abastecimiento | Facturas de compra mayorista de energía de la distribuidora provincial y facturas de compra de gas, e intercambio de formularios con la distribuidora de gas. |
| Tasas y cargos de terceros | Tasas municipales, aportes a bomberos, bancos de sangre y otros conceptos que la cooperativa cobra por cuenta de terceros. |
| Flota | Localización satelital de vehículos. |
| Información y otros sistemas | Herramientas externas de análisis de datos, sistemas contables externos, exportación integral de los datos de la cooperativa, importación de planillas y archivos heredados, calendario de feriados nacionales y cotización de monedas. |
| Impresión y distribución | Imprentas y servicios de distribución física de facturas. |
| Equipamiento local | Impresoras fiscales y de tickets, lectores de códigos y de documentos, balanzas, pantallas y tótems de turnero. Incluye lectores de tarjeta, validadores de billetes, escáneres y dispensadores. |

**Características comunes**

**Conexiones y configuración**
- Configuración por cooperativa con modo prueba y modo producción.
- Varias conexiones con un mismo proveedor (por ejemplo, dos convenios con una misma red de cobranza, varios puntos de venta o varias razones sociales), cada una con su propio alcance: servicios, sucursales, cajas, canales o zonas.
- Cada conexión se ofrece solo si la cooperativa tiene contratado el módulo correspondiente; sin licencia no puede crearse ni ejecutarse.
- Botón **Probar conexión** que verifica el acceso al proveedor y registra el resultado.
- Ficha de ayuda por proveedor: qué hace, qué datos pide, cómo obtener las credenciales y cómo usar su ambiente de prueba.
- Cadena de respaldo configurable (por ejemplo, la pasarela del canal del socio, luego la pasarela por defecto y, como último recurso, el cupón para pagar sin conexión).
- Pausa y reanudación manual de una conexión, de un tipo de operación o de un punto de venta.
- Suspensión o desactivación de una conexión sin perder su historia.
- Copia de la configuración de una conexión hacia otra cooperativa autorizada, siempre sin credenciales ni datos de operación.
- Consumo por cooperativa de mensajes, consultas de mapas, inteligencia artificial y consultas a ARCA, para el control de cupos y la facturación del servicio.

**Credenciales y certificados**
- Bóveda cifrada de credenciales con rotación y aviso de vencimiento de certificados.
- Credenciales de solo escritura: una vez cargadas, nadie puede volver a verlas; se muestran solo el nombre, la fecha de carga, el autor, el vencimiento y una huella que identifica la versión.
- Rotación sin interrupciones: la credencial nueva convive con la anterior hasta que se prueba con éxito.
- Generación de la solicitud de certificado ante ARCA desde el propio sistema, sin que la clave privada salga de la bóveda; alternativamente, carga de un certificado existente.
- Avisos de vencimiento de certificados y credenciales a los 30, 14, 7, 3 y 1 días, y al vencer, en el sistema, por correo y en el tablero.
- Varios certificados por conexión (el vigente y el próximo) para renovar sin cortes.
- Registro de cada uso de una credencial (qué proceso o usuario la usó, cuándo y para qué), sin mostrar su valor.

**Ejecución confiable**
- Reintentos controlados, prevención de operaciones duplicadas y bandeja de operaciones detenidas.
- Toda operación externa nace junto con el hecho que la origina: si el sistema se interrumpe, la operación se ejecuta igual al reanudar.
- Clasificación de los errores en causas comprensibles (falla transitoria, credencial vencida, rechazo del organismo, validación, resultado incierto, entre otras), con la acción sugerida.
- **Resultado incierto**: cuando no se sabe si el proveedor aplicó una operación, el sistema consulta su estado antes de reintentar.
- Corte automático de llamadas a un proveedor que falla en forma reiterada, con prueba periódica de recuperación, para no agotar reintentos de miles de operaciones.
- Límites de envío por proveedor y prioridad de las operaciones del momento (caja, portal, cobro con QR) sobre los procesos masivos.
- Seguimiento de punta a punta: desde un comprobante se accede a todas sus operaciones externas y mensajes.

**Registro, avisos y archivos**
- Registro de cada intercambio sin exponer credenciales.
- El registro elimina claves, datos de tarjeta y otros datos sensibles antes de guardarse; el contenido completo de un intercambio solo lo ve quien tiene ese permiso, y su consulta queda registrada.
- Recepción segura de avisos de proveedores y reconsulta ante dudas.
- Cada aviso entrante se verifica con la firma o el secreto del proveedor, se guarda antes de procesarse y se descarta si llega repetido.
- Intercambio de archivos con formatos configurables.
- Formatos de archivo definidos por configuración, con dígitos verificadores, totales de control y previsualización con errores por línea; un mismo archivo procesado dos veces no duplica pagos.
- Estados diferenciados: un archivo generado no es un archivo entregado, y un archivo entregado no es un archivo aceptado por el organismo.
- Transferencia de archivos por canal cifrado; los canales sin cifrar están prohibidos salvo excepción aprobada y registrada.

**Conciliación, monitoreo y contingencia**
- Conciliación, monitoreo, alertas y procedimientos de contingencia manual.
- Conciliaciones por tipo: pagos informados frente a pagos confirmados, deuda publicada frente a deuda aceptada, comprobantes autorizados frente a lo registrado en ARCA, movimientos bancarios frente a libros, y mensajes enviados frente a entregados.
- Pagos realizados directamente desde la aplicación de un proveedor, sin intención de pago previa, quedan en una bandeja de revisión y no se pierden.
- Importe bruto, comisión, IVA de la comisión y neto informados por separado a la cobranza.
- Semáforo por conexión con salud, último éxito, tasa de error, demoras, operaciones pendientes y vencimientos próximos.
- Declaración de contingencia por conexión con el modo alternativo previsto: autorización anticipada de ARCA, archivo manual con redes y entes, envío diferido de mensajes, proveedor alternativo de correo, registro manual de pagos con evidencia u operación manual en campo.
- Resolución manual de una operación externa con evidencia adjunta y, cuando corresponde, aprobación de otra persona; el cierre de una contingencia exige conciliar todo lo ocurrido durante ella.
- Calendario de ejecuciones programadas por conexión, en la zona horaria de la cooperativa, con historial y ejecución manual.

**Agente local para equipamiento**
- Programa instalado en una computadora de la sucursal que comunica el sistema con impresoras, lectores, balanzas, turneros y colectores.
- Se vincula con un código de un solo uso, se conecta siempre desde adentro hacia afuera por canal cifrado y no abre puertos de entrada en la red de la cooperativa.
- Cada dispositivo usa un certificado propio que se renueva solo y que puede revocarse en minutos.
- Si el agente se desconecta, el sistema avisa y ofrece alternativas: imprimir en PDF desde el navegador o llamar turnos solo en pantalla.

**Reglas que aplica el sistema**

- Un aviso de pago es solo un disparador: antes de imputar un cobro, el sistema reconsulta el estado del pago al proveedor con sus propias credenciales; el regreso del socio a la página de "pago exitoso" nunca confirma un pago.
- Los avisos entrantes de proveedores se asocian a la cooperativa por la conexión configurada a la que pertenecen, nunca por la dirección a la que llegan; si no coinciden, el aviso se rechaza sin procesarse y queda registrado.
- Un mismo pago informado varias veces produce una sola acreditación; ante un corte durante la autorización de un comprobante, el sistema consulta el último número autorizado y nunca asigna un segundo número al mismo comprobante.
- Un certificado vencido, revocado o rechazado detiene la cola de la conexión y deja los comprobantes pendientes, nunca rechazados.
- Ningún componente del sistema recibe, transmite ni guarda el número completo de tarjeta, su vencimiento ni su código de seguridad: los datos de tarjeta se capturan solo en el formulario del proveedor de pagos, en la terminal certificada del adquirente o en el sistema de la procesadora.
- Las conexiones en modo prueba muestran la marca "MODO PRUEBA" en pantallas y documentos, y los ambientes de prueba de la plataforma no pueden operar conexiones en producción.
- Pasar una conexión fiscal, de pagos, de débito o de red a producción, o cambiar su configuración en producción, requiere aprobación de otra persona.
- Las credenciales heredadas de sistemas anteriores se consideran comprometidas: no se importan y deben regenerarse en cada proveedor antes de operar en producción.
- Una orden de corte o reconexión remota se ejecuta solo después de la decisión del circuito de mora o de atención, y si su resultado es incierto se verifica el estado del equipo antes de repetirla.
- La verificación de la identidad de los servidores externos está siempre activa y no puede desactivarse; a cada proveedor se le envían solo los datos estrictamente necesarios.

**Lo que ve el socio**

- Al pagar en línea, el estado "pago en verificación" hasta que el proveedor confirma la acreditación.
- Los medios de pago y la cantidad de cuotas que la cooperativa habilitó para cada canal.
- El formulario seguro del proveedor de pagos para ingresar los datos de su tarjeta, que nunca pasan por la cooperativa.
- Los avisos por WhatsApp, SMS, correo o notificación en el celular, según sus preferencias.
- El ingreso con su cuenta de Google o de Ciudadano Digital, si la cooperativa lo habilita.

**Información e indicadores**

- Disponibilidad, tasa de error y demoras por conexión y por proveedor.
- Operaciones pendientes, en reintento e inciertas, con su antigüedad; la meta es cerrar el día sin operaciones inciertas abiertas.
- Comprobantes pendientes de autorización por punto de venta y comprobantes autorizados en contingencia pendientes de informar.
- Cobranza por canal con comisión y neto, intenciones de pago vencidas sin pagar, rendiciones esperadas no recibidas y rechazos de débito por motivo y banco.
- Diferencias de conciliación abiertas por conexión y antigüedad.
- Entregabilidad de mensajes por canal: enviados, entregados, leídos y rebotados.
- Certificados y credenciales por vencer en los próximos 30 días, contingencias declaradas y su duración, y órdenes remotas de corte o reconexión enviadas, confirmadas e inciertas.
- Agentes locales en línea o fuera de línea por sucursal y consumo de servicios externos por cooperativa.

**Etapa de habilitación**: el marco común se habilita en las etapas 1 y 2; cada integración se incorpora con el módulo que la usa: identidad y mensajería en las etapas 2 y 3, redes de Internet en la etapa 4, ARCA y Rentas en la etapa 5, Pagos360, Mercado Pago, SIRO, Red Link, débitos y extractos bancarios en la etapa 6, inteligencia artificial de atención en la etapa 7 (apagada hasta que la cooperativa la acepte), medición, reguladores y abastecimiento en la etapa 8, Interbanking y regímenes informativos en la etapa 9, presentaciones de sueldos en la etapa 10, equipamiento local en la etapa 11 (la impresión de caja puede adelantarse a la etapa 6) y las pasarelas secundarias en la etapa 12, o antes si una cooperativa las necesita.

**Usuarios principales**: administrador y responsable de integraciones de la cooperativa, responsable fiscal o contador, tesorero y responsable de cobranza, responsable técnico de red y medición, auditor, y equipo de operaciones de la plataforma.

### 10.26 Administración de la plataforma

**Propósito**: operar el servicio para todas las cooperativas con seguridad, continuidad y control, sin que ninguna cooperativa tenga que instalar software de gestión, administrar servidores ni hacer copias de seguridad.

**Funciones principales**

**Alta y ciclo de vida de cada cooperativa**
- Alta asistida de cooperativas, con propuesta automática de logo, colores y textos.
- El asistente recorre identidad, contactos, marca, módulos y plan, dominio y región, administrador inicial y confirmación, con borrador recuperable; la razón social y el domicilio fiscal pueden precargarse desde el padrón de ARCA y siempre los confirma una persona.
- La propuesta automática de marca incluye paleta validada con contraste accesible y sugerencias de vocabulario ("socio", "asociado", "usuario"); nada se aplica sin confirmación humana, y la propuesta automática puede desactivarse.
- Ciclo de vida de cada cooperativa: preparación, prueba, lista para habilitar, operativa, suspendida administrativamente y cierre, con listas de verificación por capacidad.
- Las listas de verificación cubren identidad, servicios, tarifas, emisión, pagos, usuarios, contactos, saldos iniciales, comunicaciones, sitio público y aspectos legales, con ítems automáticos y manuales con evidencia, y un tablero de avance visible para la cooperativa.
- Suspensión administrativa (por deuda del servicio, incumplimiento, pedido de la cooperativa o riesgo de seguridad) y reactivación sin ejecutar en bloque los procesos programados durante la suspensión.
- Cierre ordenado: aviso, exportación completa de los datos en formatos abiertos, período de solo lectura, archivo cifrado y eliminación definitiva con certificado al vencer la retención.

**Licencias, contratos y uso**
- Catálogo de módulos, licencias, contratos, cupos y medición de uso.
- Licenciamiento en tres niveles: qué módulos contrató la cooperativa, cuáles tiene encendidos y en qué modo (prueba, producción o solo consulta histórica), y qué pantallas usa cada persona según su rol.
- Paquetes por tamaño de cooperativa con complementos opcionales y cupos según la cantidad de contratos activos.
- Cupos por dimensión (contratos activos, usuarios, almacenamiento, mensajes, consultas de terceros, inteligencia artificial, ambientes de prueba), con aviso al 80 % y política acordada al superar el límite.
- Contrato del servicio con plan, módulos, cupos, vigencia, región, niveles de servicio, condiciones de salida y contrato de encargo de tratamiento de datos personales.
- Situación comercial visible para el administrador de la cooperativa: plan, módulos, cupos, consumo y vigencia.
- Facturación del servicio a las cooperativas.

**Ambientes y pruebas**
- Ambiente de prueba por cooperativa con datos anonimizados.
- En el ambiente de prueba se usan integraciones de homologación, los correos se redirigen a destinatarios autorizados y no hay emisiones, cobros ni envíos a socios reales; la configuración probada pasa a producción mediante un paquete versionado y aprobado.
- Los datos personales reales no se copian a ambientes de prueba salvo copia anonimizada aprobada; la precarga de demostración nunca existe en producción.

**Continuidad y operación**
- Copias de seguridad y restauración individual por cooperativa.
- Copia continua con recuperación a un punto en el tiempo, copia diaria independiente de cada cooperativa y documentos fiscales con conservación protegida contra borrado.
- Ensayos periódicos de restauración con evidencia de integridad, y restauración de consulta en un ambiente aparte ("qué tenía la cooperativa ayer") sin tocar producción.
- Monitoreo de salud, procesos automáticos e integraciones, con alertas.
- Bandeja técnica de procesos detenidos, con reintento manual y descarte justificado; los casos con impacto en la operación también se muestran a la cooperativa.
- Aislamiento de carga: el proceso masivo de una cooperativa no demora la caja ni el portal de otra, y los cobros tienen prioridad sobre los procesos masivos.
- Incidentes de plataforma con severidad, cooperativas afectadas, página de estado y análisis posterior.
- Actualizaciones automáticas sin intervención de los usuarios.
- Despliegues sin corte del servicio, habilitación gradual de funciones por grupos de cooperativas, avisos de mantenimiento anticipados y notas de versión ("Lo nuevo") visibles en el sistema.

**Soporte**
- Soporte con acceso temporal auditado.
- Casos de soporte con número de seguimiento, prioridad, responsable, conversación, evidencias y plazos de respuesta, separados de los reclamos de los socios; los casos pueden vincularse a un incidente general.
- Acceso de soporte con modo (observar, operar o configurar), alcance mínimo, justificación y vencimiento; para operar o configurar se requiere la aprobación del administrador de la cooperativa.
- La cooperativa consulta todas las intervenciones de soporte y puede revocar un acceso vigente.
- Acceso de emergencia solo para incidentes críticos, con doble aprobación dentro de la plataforma y aviso inmediato a la cooperativa.

**Reglas que aplica el sistema**

- Cada cooperativa opera con sus datos aislados; una solicitud que intenta acceder a datos de otra cooperativa se responde como si el dato no existiera.
- El personal de la plataforma no tiene acceso a datos de negocio de las cooperativas por el solo hecho de pertenecer a ella: solo mediante un acceso temporal de soporte, vinculado a un caso, con alcance mínimo y vencimiento.
- En un acceso de soporte de observación, los datos personales se muestran enmascarados; toda acción conserva la identidad del agente y nunca se comparten contraseñas.
- Una capacidad pasa a producción solo con su lista de verificación completa; los ítems "sin datos de demostración" y "credenciales de producción cargadas" no admiten dispensa.
- Suspender una cooperativa no da de baja servicios ni contratos de socios, no borra datos y no detiene las obligaciones legales comprometidas, como los informes fiscales; un contrato del servicio vencido genera una alerta, no una suspensión automática.
- Superar un cupo nunca bloquea operaciones en curso, cobros, consultas del socio ni la emisión de documentos de contratos existentes.
- Desactivar un módulo no oculta ni borra la historia: pasa a modo de consulta, donde se pueden ver y exportar los documentos, pero no registrar operaciones nuevas.
- Una restauración no deshace emisiones fiscales, cobros ni mensajes ya confirmados con terceros: se concilian, nunca se repiten; restaurar requiere doble aprobación y la auditoría nunca se revierte.
- Todas las cooperativas usan la misma versión del sistema; las diferencias se expresan con licencias, activaciones y configuración, nunca con versiones a medida.
- La plataforma no fija precios ni límites sin decisión comercial expresa.

**Información e indicadores**

- Cooperativas por estado, listas de verificación incompletas y habilitaciones demoradas.
- Disponibilidad mensual por cooperativa, tiempos de respuesta y tasa de errores.
- Procesos automáticos fallidos o detenidos y bandeja técnica abierta.
- Última copia de seguridad por cooperativa y ensayos de restauración vencidos.
- Certificados por vencer, accesos de soporte vigentes (con los de emergencia destacados) y casos abiertos por prioridad con su cumplimiento de plazos.
- Tiempo de resolución y satisfacción del soporte.
- Uso frente a cupo por cooperativa y contratos del servicio por vencer.
- Para la cooperativa: consumo frente a cupo, avance de la habilitación, casos de soporte y disponibilidad de su servicio. Ningún indicador de la plataforma muestra datos personales ni importes contables de las cooperativas.

**Etapa de habilitación**: aislamiento, ambientes, monitoreo básico y actualizaciones automáticas en la etapa 1; alta asistida, ciclo de vida, licencias, contratos, soporte, copias de seguridad y restauración en la etapa 2; facturación fiscal del servicio a las cooperativas en la etapa 6 (con prefactura exportable desde la etapa 2); control de consumo de la interfaz para terceros en la etapa 12.

**Usuarios principales**: equipo de la plataforma (implementación, comercial, soporte, operaciones, seguridad y finanzas) y administrador de la cooperativa.

### 10.27 Migración y puesta en marcha

**Propósito**: trasladar los datos del sistema actual de la cooperativa sin interrumpir la operación y sin perder trazabilidad de ningún saldo, documento, equipo instalado ni dato histórico, con un reemplazo por etapas que en cada momento deja un solo sistema responsable de cada área.

**Funciones principales**

**Preparación y calidad de datos**
- Proyecto de migración por cooperativa con sus fuentes, responsables, plan por etapas y acta de aceptación.
- Inventario y diagnóstico de calidad de los datos (documentos inválidos, duplicados, domicilios y calles).
- Inventario de todas las tablas del sistema actual con su destino y estrategia, detección de módulos sin uso y de migraciones anteriores ya presentes en los datos.
- Validación de CUIT y CUIL por dígito verificador, de documentos, correos y celulares; los datos inválidos se cargan marcados y van a una cola de saneamiento, sin frenar la migración.
- Propuestas de unificación de personas duplicadas con puntaje, siempre con aprobación humana; las cuentas y los contratos nunca se unifican por coincidir la persona o el domicilio.
- Normalización de domicilios contra el callejero de la cooperativa y consolidación de catálogos duplicados.
- Cola de saneamiento asignable al personal de la cooperativa, con indicación de si cada problema se corrige en el sistema actual o en la zona intermedia.

**Extracción, transformación y carga**
- Mapeo, limpieza, extracción, transformación, carga y validación con informes de rechazos y reprocesos seguros.
- Extracción de solo lectura de la base del sistema actual, del portal anterior, de los adjuntos y PDF, y de archivos heredados en planillas y otros formatos.
- Cada extracción se congela como una copia inmutable, fechada, cifrada y con huella de control.
- Reglas de transformación versionadas, comunes a todas las cooperativas y con ajustes propios de cada una.
- Carga a través de las mismas reglas de cada módulo, sin enviar correos, mensajes ni deuda a los entes durante la carga.
- Importes exactos al centavo y fechas convertidas sin cambiar ningún vencimiento de día.
- Reproceso idempotente: repetir una carga no duplica nada, y si un dato ya fue modificado en el sistema nuevo se informa un conflicto en lugar de sobrescribirlo.
- Conservación de los identificadores anteriores para la búsqueda y la trazabilidad.
- Número de cuenta, número de socio y número de titular del sistema actual se conservan como números visibles y buscables.

**Conciliación e histórico**
- **Conciliación por dominio**: personas y cuentas, suministros, medidores y lecturas, cuadros tarifarios, deuda y cuenta corriente, comprobantes históricos, cobranzas, financiaciones, stock, contabilidad, proveedores, sueldos e institucional.
- Cada conciliación compara cantidades y sumas de control con tolerancia cero (salvo redondeos de hasta un centavo por documento, explicados), requiere la aprobación de un responsable de la cooperativa distinto de quien ejecutó la carga y se guarda firmada como evidencia.
- La deuda se migra documento por documento, con sus hasta cuatro vencimientos, y su total coincide con el saldo contable de deudores por servicios.
- Histórico: ejercicio en curso más veinticuatro meses en estructura completa; el resto en consulta histórica; copia del origen conservada por diez años.
- El detalle accesorio de cobranzas (rendiciones por renglón, intenciones de pago y transacciones de pasarela) se carga completo de los últimos treinta y seis meses y lo anterior pasa al archivo; recibos, imputaciones y saldos nunca se archivan.
- Los comprobantes históricos se ven con la marca "migrado del sistema anterior", no pueden editarse ni anularse, y su duplicado lleva la leyenda correspondiente.

**Corrida paralela, convivencia y reemplazo**
- **Corrida paralela** con comparación factura por factura antes del reemplazo.
- En la corrida paralela el sistema calcula los mismos ciclos que el sistema actual sin autorizar comprobantes en ARCA, sin publicar deuda y sin notificar; compara cantidades, importes por concepto, impuestos, vencimientos y apertura por servicio, y clasifica cada diferencia con su responsable.
- Convivencia con el sistema anterior y reemplazo por etapas: primero el reemplazo comercial de cada servicio y, al final, el administrativo.
- **Reemplazo comercial**: personas, cuentas, contratos, tarifas, medición, facturación, fiscal de ventas, cobranza, mora, atención, técnica, portal y comunicaciones pasan al sistema nuevo; para electricidad, gas por redes y energía prepaga ocurre al cerrar la etapa de servicios medidos, después de dos ciclos de facturación en paralelo aprobados y un ensayo de corte; los demás servicios se reemplazan al cerrar la etapa de su servicio, con el mismo criterio.
- **Reemplazo administrativo**: contabilidad, compras, stock, tesorería y sueldos pasan al sistema nuevo en la última etapa, junto con el apagado del sistema anterior, que luego queda solo para consulta.
- Durante la convivencia, la contabilidad oficial sigue en el sistema anterior: el sistema nuevo contabiliza en un plan marcado como no oficial, envía asientos resumidos diarios al sistema anterior, concilia contra él y se oficializa en el reemplazo administrativo.
- Plan de corte con pasos, responsables, criterios para avanzar o detenerse y ventana definida; congelamiento del área que se reemplaza, actualización final de datos, conciliación final y acta de aceptación firmada.
- Reconocimiento de los códigos de pago de las facturas emitidas por el sistema anterior hasta su vencimiento.
- Las facturas nuevas llevan un identificador de pago propio; los cobros que llegan por entes o caja con códigos anteriores se imputan solo a comprobantes impagos y, ante ambigüedad, se registran como pago a cuenta con aviso.
- Incorporación de los usuarios del portal anterior sin nuevo registro.
- Los socios reciben una invitación de activación y encuentran sus cuentas ya vinculadas y sus adhesiones a la factura digital, sin que se migren contraseñas.
- Plan de vuelta atrás ante contingencias.
- La vuelta atrás conserva todo lo registrado en el sistema nuevo después del corte para volver a cargarlo en el sistema anterior; después de la primera emisión fiscal real o del primer cobro por entes en el sistema nuevo, solo se admite corregir hacia adelante.
- Ambientes de prueba con datos anonimizados de forma irreversible, conservando las relaciones entre registros para poder ensayar.

**Reglas que aplica el sistema**

- El sistema anterior solo se lee: la migración nunca escribe en su base.
- La extracción de datos sale de la red de la cooperativa solo por una conexión cifrada iniciada desde adentro, o mediante una copia cifrada subida con un enlace de un solo uso; el servidor de la cooperativa nunca se expone a Internet.
- Las credenciales del sistema anterior nunca se migran ni se copian: se regeneran en cada proveedor y solo el valor nuevo se carga en la bóveda.
- Los números de tarjeta del sistema anterior no se migran ni salen de su base: las adhesiones con identificador del proveedor se conservan y el resto requiere una nueva adhesión del socio; mientras tanto, el sistema anterior sigue debitándolas hasta el reemplazo comercial.
- Durante la convivencia, cada área tiene un único sistema responsable; está prohibido registrar el mismo hecho en ambos sistemas, por ejemplo cobrar la misma factura en las dos cajas.
- No se avanza al reemplazo con comprobantes del sistema anterior pendientes de autorización en ARCA; el último número autorizado por punto de venta se toma de ARCA.
- El corte y la vuelta atrás requieren doble aprobación y verificación reforzada de identidad; quien ejecuta una carga no aprueba su conciliación.
- Los datos de salud se migran cifrados y con acceso restringido; ningún dato personal real llega a ambientes de desarrollo o de prueba ajenos a la cooperativa.

**Lo que ve el socio**

- Su número de cuenta de siempre; la migración no le cambia el número salvo colisión.
- El acceso al nuevo portal con una invitación de activación y sus cuentas ya vinculadas, sin registrarse de nuevo.
- Sus comprobantes y pagos de los últimos veinticuatro meses, con el PDF original cuando existe.
- La posibilidad de pagar las facturas emitidas por el sistema anterior con sus códigos originales hasta su vencimiento.
- Si tenía débito con tarjeta sin identificador del proveedor, un pedido para renovar su adhesión desde el portal.

**Información e indicadores**

- Inventario de tablas con su estrategia y perfilado de calidad por tabla y columna.
- Índice de calidad por dominio y avance del saneamiento por tipo de problema y responsable.
- Rechazos y advertencias por corrida, exportables.
- Conciliación por dominio, deuda por titular y servicio y antigüedad de la deuda migrada.
- Tablero de la corrida paralela: comprobantes comparados, iguales, dentro de tolerancia, explicados y pendientes, con su tendencia por ciclo.
- Uso de los códigos de pago anteriores después del corte: resueltos, ambiguos y no resueltos.
- Registro de lo ocurrido después del corte para una eventual vuelta atrás y acta de aceptación, todo guardado como evidencia en el expediente.

**Etapa de habilitación**: la herramienta de migración se habilita en las etapas 1 y 2, y cada dominio se migra y ensaya en la etapa de su módulo; la corrida paralela y el reemplazo comercial de electricidad, gas y prepago se hacen al cerrar la etapa 8; el ensayo integral, el histórico en el portal, el reemplazo administrativo y el apagado del sistema anterior, en la etapa 12.

**Usuarios principales**: equipo de implementación de la plataforma, analistas de datos y responsables funcionales de la cooperativa, contador, y gerencia o consejo de administración para las aprobaciones del paralelo, del corte y de la vuelta atrás.

---

## 11. Recorridos completos de ejemplo

Los nombres, datos e importes de los recorridos son ficticios y tienen solo fines ilustrativos.

### 11.1 Contratación de Internet de punta a punta

1. Una persona entra al sitio de la cooperativa, consulta la cobertura (que es orientativa y no reemplaza la factibilidad), se registra y solicita Internet completando el formulario del servicio.
2. La solicitud ingresa a atención con número de seguimiento; al admitirse, se crea el contrato en estado "solicitado". Si existe deuda en el domicilio, el sistema la informa como advertencia.
3. El área técnica realiza la factibilidad y la dictamina; el dictamen favorable tiene una vigencia de 90 días y es de uso único. Solo con dictamen favorable el contrato pasa a "pendiente de instalación".
4. El socio elige día y franja para la visita desde su celular.
5. El técnico recibe la orden en su aplicación, retira el equipo identificado por número de serie, instala, prueba y obtiene la conformidad firmada del socio, aun sin conexión. Si la visita fracasa, el equipo vuelve a la custodia del técnico y no se factura nada.
6. El sistema activa el servicio automáticamente en los equipos de red y registra la fecha efectiva de activación recién cuando el equipo confirma la operación; el equipo queda en comodato vinculado al contrato. Si la activación automática falla, el centro de operaciones de la red la completa en forma manual.
7. La facturación empieza con la activación: la primera factura incluye el abono proporcional desde la fecha de activación, el abono del mes siguiente y el cargo de instalación, con autorización fiscal electrónica.
8. El socio recibe la factura por el canal elegido y la paga en línea; el pago se imputa, se registra contablemente y se concilia.
9. Ante un problema, el socio reclama con fotos y sigue el estado de su reclamo. Si se cae un nodo de la red, los reclamos de la zona se agrupan en un incidente y los socios afectados reciben un aviso masivo.
10. Si deja de pagar, recibe los avisos de mora configurados, con constancia de entrega; sin esa constancia no hay suspensión. Llegado el caso, el servicio se suspende en forma remota (con velocidad reducida o corte) y se reconecta automáticamente al pagar; si paga antes de la ejecución, la orden se cancela.
11. Si decide irse, utiliza el botón de baja, sin cargo y sin que se le exija pagar la deuda ni registrarse, y recibe un código de constancia dentro de las 24 horas. Se coordina el retiro del equipo (por defecto, dentro de los 15 días) y se emite la liquidación final; devolver el equipo no equivale, por sí solo, a una baja procesada.

### 11.2 Ciclo mensual de energía

1. Se generan las rutas de lectura y se asignan a los lecturistas, o se toma el estado por telemedición. Los medidores prepagos quedan fuera de las rutas y del ciclo pospago.
2. Los lecturistas registran las lecturas con su aplicación, con fotos y observaciones.
3. El supervisor de consumos revisa las excepciones, valida, estima o corrige con justificación. Un consumo con una excepción bloqueante no se liquida, y más de dos estimaciones consecutivas (valor por defecto) generan una inspección obligatoria.
4. Facturación prepara el lote, revisa la muestra de control y la comparación con el período anterior, y lo aprueba.
5. El sistema calcula con el cuadro tarifario vigente, subsidios, tarifa social, demanda y factor de potencia de los grandes usuarios, generación distribuida, impuestos y tasas de terceros, y emite. Si la energía inyectada por un usuario generador supera su consumo, el saldo queda como crédito a favor para la próxima factura.
6. Los comprobantes se autorizan ante el organismo fiscal, se distribuyen por cada canal y se cierra el ciclo con su acta.
7. Contabilidad recibe los asientos automáticos y fiscal prepara los libros y los informes regulatorios, incluido el informe de pérdidas a partir de la energía comprada y la facturada.

### 11.3 Cambio tarifario

1. El regulador publica una resolución.
2. Facturación carga la nueva versión del cuadro tarifario con su vigencia y la norma de respaldo.
3. El simulador compara la nueva tarifa con la vigente sobre todo el padrón.
4. Dos usuarios autorizados aprueban la versión.
5. La tarifa se aplica en la siguiente facturación, con prorrateo entre versiones dentro del período si corresponde, y se publica en el sitio, donde el cuadro tarifario vigente es de exhibición obligatoria en los servicios regulados.

### 11.4 Compra hasta el pago

1. Un área genera una solicitud interna asignada a un servicio y centro de costo.
2. Compras pide cotizaciones y emite la orden de compra aprobada según el monto.
3. Depósito registra la recepción.
4. Se carga la factura del proveedor (importada del organismo fiscal, cargada por el proveedor en su portal o leída por inteligencia artificial y confirmada).
5. El control de tres vías habilita el pago.
6. Se emite la orden de pago con las retenciones calculadas; tesorería la ejecuta y contabilidad registra cada paso.

### 11.5 Ciclo mensual de agua con cortes protegidos

1. Se generan las rutas de lectura de los suministros medidos y se asignan a los lecturistas; si la cooperativa lo habilita, el socio puede informar su autolectura desde la aplicación.
2. Para los suministros no medidos, el sistema calcula el cargo con los datos aprobados del inmueble (superficie, frente, zona y coeficientes), sin inventar lecturas.
3. En los consorcios, el consumo del medidor general se distribuye entre las unidades funcionales según el criterio configurado.
4. El supervisor de consumos revisa las excepciones; ante un consumo anómalo, el socio recibe un aviso de posible pérdida. Un consumo con excepción bloqueante no se liquida.
5. Facturación aprueba el lote; el sistema calcula el cargo fijo y los tramos de consumo, y luego las cloacas sobre el consumo de agua aprobado de la misma cuenta, junto con las tasas de terceros. Los comprobantes se autorizan ante el organismo fiscal y se distribuyen.
6. Una socia ficticia, Marta Ejemplo, no paga su factura de agua. Recibe los avisos de la política de mora y luego una intimación con preaviso; sin constancia de entrega, el proceso no avanza y se genera una tarea para intentar otro canal.
7. Al vencer la intimación, el sistema evalúa la mora servicio por servicio. El agua es un servicio esencial con preaviso normativo, por lo que el caso pasa a revisión de un responsable; si el suministro tiene una protección acreditada (salud, establecimiento educativo o entidad pública), la evaluación queda bloqueada con su motivo. La deuda de otro servicio, como el cementerio parque, nunca habilita por sí sola el corte del agua.
8. Si la medida procede, el modo por defecto es la reducción de caudal, que nunca baja del caudal mínimo vital configurado (valor propuesto: 50 litros por persona y por día, que la concesión puede modificar y que requiere validación legal). La interrupción total solo es posible si la concesión la admite.
9. La orden de trabajo se programa dentro de la ventana de ejecución permitida (días hábiles y horarios configurados, sin feriados ni vísperas cuando la norma lo establece) y el técnico la ejecuta con su aplicación.
10. Si la socia paga antes de la ejecución, la orden se cancela; si paga después, la rehabilitación sigue el marco del servicio. El cargo de reconexión solo se cobra si existe una regla con fundamento registrado y aprobado; por defecto es gratuito.
11. El ciclo se cierra con su acta, contabilidad recibe los asientos y fiscal genera los informes para el regulador del servicio de agua.

### 11.6 Socio en mora que firma un convenio de pago

1. Un socio ficticio, Jorge Ejemplo, tiene una deuda vencida de ARS 60.000 (importe ficticio). Consulta su deuda en la aplicación del socio o se acerca a la cooperativa.
2. El gestor de deuda abre el simulador, selecciona las facturas a incluir y el sistema verifica que ninguna esté en otro convenio vigente, en gestión judicial o con un reclamo abierto.
3. El simulador muestra los planes habilitados con su anticipo, cuotas, interés y costo financiero total. El socio elige un anticipo de ARS 15.000 y tres cuotas de ARS 15.000 sin interés. También puede simular y aceptar el convenio por su cuenta desde la aplicación, si la cooperativa lo habilita.
4. El socio firma el convenio con un código que recibe en su celular, o en forma presencial en una tableta. El convenio queda pendiente de anticipo.
5. Al confirmarse el pago del anticipo, el convenio se activa: las facturas incluidas quedan sustituidas, dejan de exigirse y de generar mora, y si el convenio incluye cuotas sociales, el capital se registra en su auxiliar. Con el pago confirmado, el sistema evalúa la reconexión de los servicios suspendidos por esa deuda según la política de la cooperativa.
6. Las cuotas se emiten según la modalidad del plan y el socio las paga por cualquier canal habilitado; el gestor sigue los pagos y vencimientos.
7. Si el anticipo no se paga en el plazo configurado, el convenio caduca y las facturas originales vuelven a exigirse; nunca queda como cumplido.
8. Si el socio se atrasa, recibe un aviso de caída; con la cantidad de cuotas impagas que fije el plan, el convenio cae: el saldo pasa a ser exigible, se pierden las quitas proporcionales y las facturas originales no reviven. Si paga lo vencido dentro del plazo configurado, un supervisor puede rehabilitarlo.
9. En cualquier momento, el socio puede cotizar la cancelación anticipada desde la aplicación: paga el saldo de capital, sin intereses futuros y con la bonificación configurada, y las cuotas restantes se anulan.
10. El tablero de mora muestra los convenios vigentes y caídos, y la tasa de recupero.

### 11.7 Débito automático y pago por ente recaudador hasta la conciliación

1. Una socia ficticia, Silvia Ejemplo, adhiere al débito automático desde la aplicación del socio o en el mostrador. El sistema valida el CBU de 22 dígitos o registra la tarjeta en forma protegida, sin guardar el número completo; la adhesión debita recién cuando queda activa.
2. La socia puede excluir del débito algunos servicios. Sus facturas muestran la leyenda de débito y, por defecto, no se publican a otros entes recaudadores.
3. Al emitirse el lote de facturación, el sistema genera automáticamente el archivo de deuda para los entes (Red Link, Pago Fácil, Rapipago, SIRO, entre otros). Cada factura lleva un identificador de pago con dígito verificador, y volver a exportar el mismo período no duplica la deuda publicada.
4. Facturación genera la presentación de débitos con la fecha de débito y la regla de corte (por ejemplo, con corte el día 19 y vencimiento el día 20, la tarjeta se debita el mes siguiente). Una factura no puede estar al mismo tiempo en dos presentaciones.
5. Llega la rendición del débito: los débitos aceptados se registran como cobro al primer vencimiento, sin recargo; los rechazados vuelven a la deuda visible con su código y la socia recibe un aviso. Los rechazos se reintentan en forma controlada, salvo los definitivos, como una orden de no pagar.
6. Otro socio paga su factura en un ente recaudador. El ente envía la rendición y el sistema valida el convenio, los totales y cada registro (duplicados, facturas anuladas, ya pagadas por otra vía, importes fuera de tolerancia). El resultado se presenta para revisar antes de confirmar; los errores pasan a una bandeja de excepciones sin frenar el resto, y el mismo archivo no puede importarse dos veces.
7. Al confirmar, cada pago se imputa a la factura que identifica; si la factura ya estaba pagada, el importe queda como saldo a favor. La rendición se registra con la comisión del ente y se informa a tesorería la acreditación esperada por el importe neto.
8. Tesorería importa el extracto bancario y el sistema empareja cada acreditación con lo esperado. Las diferencias se explican o se registran en el mismo acto, y la conciliación solo se cierra con diferencia cero y su acta.
9. Contabilidad recibe los asientos de cada paso. Si alguno de los socios tenía un servicio suspendido por mora, el pago confirmado dispara la evaluación de reconexión.

### 11.8 Alta de un servicio de sepelio con grupo familiar

1. Al activarse la electricidad de un socio ficticio, Carlos Ejemplo, el sistema le propone sumar el servicio de sepelio; la incorporación requiere su consentimiento. También puede solicitarlo directamente desde el sitio o la aplicación.
2. Al admitirse la solicitud, se crea el contrato con el plan familiar elegido (por ejemplo, ARS 8.000 por grupo, importe ficticio).
3. El operador o el propio socio da de alta a los adherentes (cónyuge e hijos) con vínculo y fecha de nacimiento. El sistema valida las edades y los requisitos del plan; si una persona ya es adherente de otro titular, ofrece darla de baja allí. La deuda del socio solo genera una advertencia.
4. La carencia corre desde el alta de cada adherente, según el plazo del plan (por ejemplo, 90 días).
5. La cuota mensual se calcula con la cantidad, la edad y el vínculo de los adherentes vigentes al último día del período, y se emite en factura separada o en un talón conjunto con los demás servicios si la cooperativa lo configura.
6. Cuando un hijo alcanza la mayoría de edad, el responsable recibe un aviso y, tras una vista previa, lo da de baja o lo recategoriza por lote; un adherente con discapacidad acreditada nunca se da de baja por edad.
7. Ante el fallecimiento de un integrante del grupo, la familia solicita la prestación. El sistema verifica la cobertura a la fecha del evento (contrato y adherente vigentes, carencia cumplida y convenio vigente con la empresa fúnebre). Una prestación urgente nunca se rechaza en forma automática por deuda.
8. Se abre el caso de sepelio con el prestador, el traslado y, si corresponde, el acto de inhumación en el cementerio parque. Los adicionales a cargo del solicitante se facturan como ítems del servicio.
9. Si el plan incluye subsidio por fallecimiento, se abre el expediente con los beneficiarios; otro usuario lo aprueba y tesorería emite la orden de pago. El reclamo tiene un plazo configurable (por defecto, 180 días).
10. El integrante fallecido se da de baja con su causa; la historia del grupo nunca se borra. El socio ve "Mi grupo" y sus coberturas en la aplicación; los casos son confidenciales y no pueden usarse para segmentar campañas.

### 11.9 Liquidación mensual de sueldos

1. Se abre el período de sueldos. Las horas de guardia de las cuadrillas se importan desde las órdenes de trabajo cerradas del mes, y se suman las licencias, las vacaciones aprobadas desde la aplicación del empleado y las demás novedades.
2. Cada encargado aprueba las novedades de su equipo; las que quedan en borrador no se toman en la liquidación.
3. El liquidador aplica la escala vigente del convenio colectivo; si una paritaria se publicó con efecto retroactivo, el sistema propone una liquidación complementaria con el período de devengamiento correcto.
4. Se importan los formularios de deducciones que los empleados presentaron ante ARCA, y el sistema calcula la retención de Ganancias en forma acumulativa, con devolución cuando corresponde.
5. El liquidador simula la liquidación de los 18 empleados (cantidad ficticia) y la compara con el período anterior, sin consumir números de recibo ni generar efectos.
6. Los controles previos detectan variaciones sobre el umbral, netos negativos, empleados sin cuenta de acreditación, remuneraciones debajo del mínimo de convenio, descuentos voluntarios por encima del límite legal y embargos a aplicar. Un control bloqueante impide enviar a aprobación.
7. El contador aprueba la liquidación; el usuario que la calculó no puede aprobarla.
8. Se generan los recibos con el contenido que exige la Ley de Contrato de Trabajo, firmados digitalmente por el empleador. Cada empleado los recibe en su aplicación y los firma con un código, o deja constancia de su disconformidad.
9. Tesorería envía el archivo bancario y confirma las acreditaciones; si un CBU es rechazado, se corrige con aprobación y se reenvía solo ese pago.
10. Contabilidad recibe el asiento por centro de costo (por ejemplo, distribución, administración e Internet), junto con las provisiones de aguinaldo y vacaciones.
11. Se generan el Libro de Sueldos Digital, la declaración de seguridad social, las retenciones de Ganancias y los archivos sindicales; el control de totales debe dar cero diferencias, y cada presentación queda registrada con su acuse y su obligación de pago en tesorería.
12. Si la cooperativa lo habilita y el empleado lo autorizó, la deuda de sus servicios se descuenta en el recibo dentro de los límites legales y se registra como cobro en su cuenta.

### 11.10 Asamblea anual

1. Sesenta días antes del vencimiento de los mandatos (valor por defecto), secretaría recibe la alerta para preparar la asamblea de renovación.
2. Se arma el expediente de la asamblea con la memoria, los estados contables, los informes del síndico y del auditor, y el proyecto de distribución de excedentes, previamente simulado.
3. Secretaría genera el padrón con una fecha de corte y los criterios de habilitación aprobados (por ejemplo, antigüedad y deuda de capital por encima de un umbral). El padrón pasa de preliminar a observado y a definitivo; cada excluido muestra su motivo y, si cambia un criterio, se crea una nueva versión que conserva la anterior.
4. Los asociados consultan desde la aplicación si están habilitados y pueden reclamar su inclusión dentro del plazo; un reclamo resuelto a favor genera una nueva versión del padrón.
5. Se publica la convocatoria con el orden del día por el muro, el sitio, el correo, WhatsApp y la cartelera, y se comunica al INAES y al órgano local. El sistema bloquea la publicación si no se respeta el plazo mínimo configurado.
6. La junta electoral recibe las listas de candidatos con sus avales, resuelve las impugnaciones y oficializa las listas; solo las oficializadas se votan.
7. El día de la asamblea, los acreditadores leen la credencial con código QR o el documento de cada asociado, registran los poderes dentro del tope permitido y el sistema calcula el quórum en vivo. Sin quórum al primer llamado, se pasa al segundo llamado tras la espera configurada. La asamblea puede ser presencial, a distancia o mixta, según la normativa vigente.
8. Cada tema y cada elección se votan con la modalidad y la mayoría configuradas; cada asociado vota una sola vez, más sus poderes válidos, y se registra el escrutinio.
9. El acta se genera desde el orden del día y las resoluciones, se firma en forma digital y queda bloqueada; una corrección solo es posible mediante un acta posterior. Los libros de actas y de asistencia se exportan foliados.
10. Se registran los nuevos mandatos y la nómina de autoridades. La distribución de excedentes se ejecuta solo con la resolución aprobada por la asamblea.
11. La presentación posterior a la asamblea ante el INAES y el órgano local queda como tarea con vencimiento y acuse, y los resultados se publican para los asociados, salvo las resoluciones marcadas como reservadas.

### 11.11 Migración y reemplazo del sistema anterior

1. **Inventario**: el equipo de implementación registra todas las fuentes del sistema actual de la cooperativa (base de datos, portal, adjuntos y planillas) y las extrae en modo de solo lectura, sin exponer el servidor de la cooperativa a Internet. El inventario cuenta los registros de cada tabla y detecta los módulos que no se usan.
2. **Diagnóstico**: el sistema analiza la calidad de los datos (documentos y CUIT inválidos, personas duplicadas, domicilios, cuentas sin titular) y arma una cola de saneamiento. Las correcciones se hacen en el sistema actual o en el área intermedia de la migración, y las fusiones de personas requieren aprobación.
3. **Decisión sobre el histórico**: lo operativo se migra vivo; los comprobantes, recibos, lecturas y asientos del ejercicio en curso y de los 24 meses anteriores quedan como histórico de solo lectura; el resto se conserva archivado.
4. **Ensayos**: la migración completa se ensaya en un ambiente de ensayo de la cooperativa y se repite hasta no tener rechazos bloqueantes. En cada ensayo se concilian la deuda por titular y servicio, los saldos a favor, los convenios, el stock y la contabilidad. Los ambientes de prueba usan datos anonimizados.
5. **Facturación en paralelo**: el sistema simula cada ciclo de facturación sin autorización fiscal ni publicación, y lo compara factura por factura con lo emitido por el sistema actual. Cada diferencia se clasifica y se explica. Un servicio queda aprobado con dos ciclos consecutivos sin diferencias sin explicar (valor por defecto).
6. **Ensayo de corte**: se ensaya el corte comercial completo dentro de la ventana planificada, con conciliación de saldos y con el plan de retorno probado.
7. **Reemplazo comercial**: al terminar la etapa de servicios medidos se realiza el corte comercial: aviso a socios y entes, verificación de que no queden comprobantes pendientes de autorización, cierre de cajas, congelamiento, carga final, conciliaciones aprobadas, registro del último número fiscal por punto de venta y decisión final con doble aprobación. Luego se activan la emisión fiscal, la publicación a entes, los débitos, las pasarelas y el portal, se invita a los socios y se firma el acta de aceptación.
8. **Convivencia**: el sistema actual queda de solo lectura para lo comercial, mientras la contabilidad oficial, las compras, el stock, la tesorería y los sueldos siguen allí. El sistema le envía diariamente los asientos resumidos, las cobranzas y los retiros de materiales. Rige un único sistema de registro por área, y los pagos que llegan con códigos del sistema anterior se resuelven por equivalencias; ante una coincidencia ambigua, el pago queda a cuenta para que cobranzas lo revise.
9. **Plan de retorno**: hasta la primera emisión fiscal real o el primer cobro por entes, la cooperativa puede volver al sistema actual, con los hechos posteriores al corte recargados. Después solo se corrige hacia adelante, sin deshacer hechos fiscales ni cobros. Toda decisión de retorno requiere doble aprobación.
10. **Reemplazo administrativo**: en la última etapa, tras el ensayo de corte administrativo con balance conciliado, pasan al nuevo sistema las compras, el stock, la tesorería, la contabilidad y las retenciones, y luego los sueldos, la gestión institucional y los servicios sociales que no se hayan pasado antes.
11. **Apagado**: el sistema anterior queda solo para consulta hasta el cierre del ejercicio y luego se archiva. Los socios ven en el portal sus facturas de los últimos 24 meses con el PDF original.

---

## 12. Niveles de servicio, seguridad y privacidad

### 12.1 Niveles de servicio

| Aspecto | Compromiso |
|---|---|
| Disponibilidad | 99,5 % mensual (equivale a unas 3 horas y 39 minutos de indisponibilidad por mes como máximo), sin contar los mantenimientos programados dentro de la ventana acordada. Se mide con sondas automáticas desde dos ubicaciones cada minuto, con informe mensual por cooperativa. |
| Pérdida máxima de datos ante un incidente grave | Hasta 15 minutos. Ante la caída de un servidor de base de datos no se pierde ninguna operación confirmada. |
| Tiempo máximo de recuperación | 4 horas por cooperativa y 8 horas para la plataforma completa. |
| Tiempo de respuesta de pantallas | 800 milisegundos o menos en el 95 % de las operaciones interactivas. |
| Facturación masiva | 50.000 suministros en 60 minutos o menos, con progreso visible y reanudación. Es una meta de diseño que se confirma con las mediciones de la cooperativa piloto (sección 12.7). |
| Capacidad | Cooperativas de hasta 150.000 suministros; plataforma diseñada para cien cooperativas y ampliable a trescientas. |
| Soporte | Lunes a viernes de 8 a 18 horas; incidentes críticos las 24 horas, todos los días. |
| Alojamiento | Infraestructura en la nube en la región de San Pablo, con cláusulas contractuales de transferencia internacional de datos conformes a la autoridad argentina de protección de datos. |

**Tiempos de primera respuesta del soporte, según la gravedad de la incidencia:**

| Gravedad | Ejemplo | Primera respuesta |
|---|---|---|
| Crítica | La operación está detenida: no se puede cobrar ni facturar. | 1 hora, las 24 horas, todos los días; solución o plan de acción comunicado dentro del día. |
| Alta | Una función principal funciona en forma degradada. | 4 horas hábiles. |
| Media | Una función secundaria presenta fallas con alternativa disponible. | 1 día hábil. |
| Baja | Consultas, mejoras o fallas menores. | 3 días hábiles. |

Cada incidencia recibe un número de seguimiento, se clasifica por gravedad y se informa su avance hasta la solución. Cuando varias incidencias responden a un mismo problema general de la plataforma, se vinculan y todas reciben el aviso de resolución. La plataforma informa los incidentes y los mantenimientos en una página de estado, con aviso en el sistema de gestión y por correo a los administradores.

### 12.2 Seguridad

- Aislamiento completo de los datos de cada cooperativa, verificado con pruebas automáticas antes de cada actualización.
- Cumplimiento de estándares internacionales de seguridad de aplicaciones.
- Cifrado de la información en tránsito y almacenada, y cifrado adicional de los datos sensibles.
- Bóveda de credenciales con claves maestras gestionadas en servicios especializados.
- Doble factor para el personal, protección contra intentos automatizados y carga segura de archivos con control antivirus.
- Archivos privados accesibles solo mediante enlaces temporales firmados.
- Auditoría inmutable de todas las operaciones.

**Marco de referencia.** El sistema toma como base el estándar internacional de verificación de seguridad de aplicaciones de OWASP (ASVS 5.0, nivel 2) y aplica un nivel más exigente en la bóveda de credenciales, la firma de las sesiones, la auditoría y los datos de salud. La lista de verificación se revisa en cada etapa; tomar el estándar como referencia no constituye una certificación. Cada módulo y cada integración nueva cuentan con un análisis de amenazas antes de construirse.

**Aislamiento entre cooperativas.** Todas las cooperativas comparten la plataforma, pero cada operación se ejecuta exclusivamente sobre los datos de la cooperativa del usuario. Una batería de pruebas automáticas verifica, en cada cambio del sistema, que un usuario de una cooperativa no pueda listar, leer, buscar, modificar, exportar, descargar archivos ni disparar procesos sobre otra cooperativa; una función nueva sin esa prueba impide liberar la versión. Un pedido sobre información de otra cooperativa recibe la misma respuesta que un registro inexistente. Una cooperativa no puede degradar el servicio de las demás: los procesos pesados (lotes, exportaciones, reportes, importaciones e inteligencia artificial) tienen cuotas y prioridades por cooperativa.

**Cifrado.**

- En tránsito: toda comunicación viaja cifrada con TLS 1.2 como mínimo (1.3 preferido), también dentro de la plataforma.
- Almacenado: las bases de datos, los archivos y las copias de seguridad se guardan cifrados.
- Datos sensibles: además, se cifran campo por campo con una clave propia de cada cooperativa para cada categoría de información, de modo que un dato cifrado de una cooperativa no puede descifrarse en otra ni copiarse a otro registro:

| Categoría | Ejemplos de datos protegidos |
|---|---|
| Salud | Prestaciones de salud y ambulancias, banco de sangre, condición de electrodependencia, certificados médicos del personal, discapacidad para tarifa social. Los documentos de salud se guardan, además, en un espacio separado con su propia clave. |
| Laboral | CUIL y datos de familiares a cargo del legajo, salarios y datos del recibo de sueldo. |
| Judicial | Información de la gestión judicial de deudas y de los bloqueos legales. |
| Financiero | CBU, CVU y números de cuenta bancaria completos, identificadores de tarjeta para débito automático. |
| Secretos | Credenciales de integraciones, certificados del organismo fiscal, semillas de la aplicación autenticadora y códigos de recuperación. |

- El documento y el CUIT de los titulares no se cifran campo por campo, porque se usan para buscar y para cumplir obligaciones fiscales, pero se protegen con el cifrado general, los permisos y el enmascaramiento en pantallas y registros. Las búsquedas exactas sobre datos cifrados (por ejemplo, por CBU) se resuelven sin descifrar la base.
- Las claves se renuevan periódicamente (una vez por año como mínimo y ante cualquier incidente), sin interrumpir el servicio, y una renovación de emergencia se completa en menos de cuatro horas. Se usan solo algoritmos criptográficos estándar.

**Bóveda de credenciales.** Las credenciales de cada cooperativa (certificados y claves del organismo fiscal, pasarelas, entes, bancos, correo, SMS, WhatsApp, telemedición y equipos de red) se guardan en una bóveda propia de la cooperativa. Una vez cargado, el valor nunca vuelve a mostrarse: solo se ven su huella y sus últimos caracteres, y existe la opción "probar conexión". Cada alta, cambio, uso y prueba se audita, y cada proceso solo puede leer la credencial de su cooperativa y de su integración. El sistema avisa a los 30, 15 y 7 días del vencimiento de certificados y credenciales. Las credenciales del sistema actual de la cooperativa no se trasladan: se generan nuevas en cada proveedor.

**Protección de los datos de tarjetas.**

- Ningún componente del sistema recibe, transmite ni guarda el número completo de una tarjeta, su vencimiento ni su código de seguridad: ni los servidores, ni el agente local, ni la bóveda, ni los registros técnicos, ni la migración.
- Los datos de la tarjeta se ingresan únicamente en el formulario provisto por la pasarela de pago, en la terminal certificada del adquirente o en el sistema de la procesadora. Cada proveedor debe contar con la certificación vigente de la norma internacional de seguridad de datos de tarjetas (PCI DSS).
- Las páginas del portal y del tótem que contienen el formulario del proveedor aplican controles estrictos sobre el contenido que pueden cargar y detectan cualquier cambio no autorizado.
- Para el débito automático con tarjeta, el sistema guarda solo el identificador que entrega la pasarela o la procesadora, la marca y los últimos cuatro dígitos. En los pagos únicos (pago en línea, enlace de pago, QR, caja o tótem) se guarda solo la marca, los últimos cuatro dígitos y el código de autorización.
- Como no se guarda el vencimiento, una tarjeta vencida se detecta por el rechazo o por el aviso de la pasarela, y el sistema pide al socio que la actualice en el formulario del proveedor.
- En la migración, el número de tarjeta del sistema actual no se extrae: solo se calculan en origen la marca y los últimos cuatro dígitos. Si la procesadora o la pasarela ya identifican al adherente, ese identificador se traslada; en otro caso, se pide al socio una nueva adhesión, mientras el sistema actual sigue debitando hasta el reemplazo.

**Confirmación de pagos.** Un pago se considera confirmado solo cuando lo verifica el proveedor por un canal directo con la plataforma o mediante un aviso firmado; nunca por el importe que informa el navegador o el portal. Los avisos de los proveedores se validan con su firma, se descartan las repeticiones y, ante un aviso duplicado o desordenado, se registra un único cobro.

**Archivos.**

- Solo se aceptan los tipos de archivo previstos para cada uso, verificados por su contenido y no por su nombre: imágenes de hasta 10 MB, PDF de hasta 20 MB y planillas sin macros de hasta 25 MB. Se rechazan ejecutables, programas y archivos comprimidos anidados.
- Cada archivo pasa por un control antivirus en un espacio de cuarentena; mientras tanto figura "En análisis" y no puede descargarse. Si el antivirus no está disponible, el archivo queda pendiente sin bloquear la operación.
- Las imágenes se procesan para eliminar contenido oculto, y a las fotos publicadas en la comunidad o en reclamos se les quita la ubicación; en las evidencias de campo la ubicación se conserva protegida, porque es un dato requerido.
- Los archivos privados se descargan solo mediante enlaces firmados de un único archivo, emitidos tras verificar la cooperativa, el permiso y el alcance, con una vigencia de cinco minutos como máximo.
- Los enlaces a comprobantes enviados por correo o WhatsApp abren un único documento, pueden revocarse y vencen; vencido el plazo, el socio debe iniciar sesión.
- Las exportaciones se generan en segundo plano, llevan una marca con el usuario y la fecha, quedan registradas y el archivo se elimina a las 24 horas. No se usan contraseñas fijas en los PDF.

**Generación segura de documentos.** Los comprobantes, constancias, recibos y reportes en PDF se generan en un entorno aislado y separado del resto del sistema: sin acceso a Internet, sin ejecutar programas incluidos en la página, con las plantillas, fuentes e imágenes provistas de antemano y con límites de tiempo y memoria. Cada documento emitido guarda una huella digital que permite verificar en cualquier momento que no fue alterado; si se modifica un solo carácter del archivo almacenado, la verificación falla y se genera una alerta. Cuando el régimen lo exige, los documentos se firman digitalmente con los certificados de la cooperativa guardados en la bóveda.

**Agente local con certificado propio por dispositivo.**

- El agente que conecta el equipamiento del puesto (turnero, impresoras térmicas y fiscales, lectores, balanzas y tótems) solo inicia conexiones hacia la plataforma y no deja puertos abiertos en el puesto.
- Cada dispositivo se identifica con un certificado individual emitido por una autoridad privada de la plataforma, con un emisor propio para cada cooperativa. El certificado se genera al emparejar el dispositivo desde el sistema de gestión, a partir de una solicitud creada en el propio puesto, sin que la clave privada salga nunca de él.
- El certificado tiene una vigencia de 90 días y se renueva en forma automática a partir de los 30 días previos al vencimiento. Revocarlo desde el sistema de gestión corta las conexiones abiertas en menos de cinco minutos.
- Cada agente queda vinculado a una cooperativa y a una sucursal, ejecuta solo los comandos de una lista declarada, recibe únicamente actualizaciones firmadas y verificadas, guarda cifrada su cola local ante cortes de red e informa su estado cada minuto en el tablero de la cooperativa. Nunca almacena datos de tarjetas ni credenciales de bases de datos.

**Sesiones y antiautomatización.** Las sesiones se firman con claves que se renuevan cada 90 días; las cookies de sesión están protegidas contra el acceso desde programas de la página y contra el uso desde otros sitios. Los formularios públicos (registro, recuperación, consulta pública de deuda, baja, contacto y pago sin ingreso) tienen límites de uso por dirección de red y por cuenta, y activan un desafío contra programas automáticos en forma progresiva, respetuoso de la privacidad y accesible.

**Pruebas y mantenimiento de la seguridad.**

- Análisis automático del código, de los componentes de terceros y de secretos expuestos en cada cambio, y análisis dinámico en cada versión.
- Plazos de corrección de vulnerabilidades desde su publicación: críticas en 7 días como máximo, altas en 30 días y medias en 90 días.
- Pruebas de penetración externas antes de la primera puesta en producción con datos reales de socios, nuevamente antes del reemplazo comercial del sistema actual de la cooperativa, una vez por año y tras cambios importantes en el ingreso, los pagos o el aislamiento entre cooperativas. No se habilita una puesta en marcha con hallazgos críticos o altos abiertos.
- Separación estricta entre los ambientes productivos y los de prueba: las credenciales productivas no son accesibles desde los de prueba, y en ellos se usan solo datos ficticios.
- Las versiones del sistema se publican firmadas y con el inventario de sus componentes; nunca se descargan ni reemplazan programas en los puestos de los usuarios.

**Incidentes de seguridad.** La plataforma detecta, contiene y evalúa cada incidente, identifica las cooperativas y los titulares afectados y notifica a cada cooperativa para que, como responsable, decida la comunicación a los titulares y a la autoridad de control. Los plazos propuestos son un aviso inicial dentro de las 24 horas desde la confirmación, un informe preliminar dentro de las 72 horas y un informe final dentro de los 15 días. Cada incidente cierra con un análisis de causas, acciones y responsables. La plataforma publica un canal de contacto para el reporte responsable de vulnerabilidades.

### 12.3 Privacidad y protección de datos personales

- Cumplimiento de la Ley 25.326 de Protección de Datos Personales y de la normativa de la autoridad de aplicación.
- GoodApps actúa como prestador de servicios de tratamiento de datos por cuenta de la cooperativa, con contrato de encargo, registro público de subencargados y devolución o destrucción de los datos al finalizar el servicio.
- Gestión de consentimientos por finalidad y canal.
- Atención de los derechos de acceso, rectificación, actualización y supresión.
- Plazos de conservación, anonimización y retención por causas legales.
- Tratamiento reforzado de los datos de salud.
- Minimización de datos en integraciones, reportes, asistente virtual e inteligencia artificial.

**Herramientas para la cooperativa.**

- **Inventario de datos personales** de todo el sistema, con su categoría, sensibilidad, finalidad, base legal, plazo de conservación, protección y exposición en integraciones, reportes e inteligencia artificial.
- **Registro de actividades de tratamiento** precargado con un modelo (gestión del suministro, facturación y cobranza, atención, técnica y campo, comunicaciones institucionales y promocionales, comunidad, servicios sociales y salud, personal y sueldos, asociados, inteligencia artificial), editable y exportable en planilla o PDF.
- **Avisos de privacidad** versionados por canal (sitio público, registro, aplicación y formulario presencial); cada consentimiento queda ligado a la versión del aviso aceptada.
- **Registro de consentimientos** con finalidad, canal, fecha y evidencia; el socio puede revocar un consentimiento en un solo paso y, en menos de cinco minutos, deja de recibir las comunicaciones alcanzadas.
- **Separación entre comunicaciones institucionales y promocionales**: las promocionales requieren consentimiento, respetan la oposición del socio y consultan el Registro Nacional "No Llame" cuando corresponde.
- **Espacio "Mis datos y privacidad"** en la aplicación del socio y del empleado, para ver sus datos, descargar un informe, pedir correcciones, revocar consentimientos y seguir sus solicitudes.

**Solicitudes de los titulares.** Las solicitudes ingresan por la aplicación, el sitio público, en forma presencial o por correo, y se gestionan en una bandeja con plazos visibles y alertas al 70 % del plazo:

- acceso: respuesta dentro de los 10 días corridos, con un informe generado en forma automática, en lenguaje claro, que incluye todos los datos del titular en esa cooperativa y excluye los de terceros;
- rectificación, actualización y supresión: dentro de los 5 días hábiles;
- la identidad se verifica en forma proporcional (sesión con segundo factor, datos de la cuenta o presentación en la oficina);
- la supresión es compatible con las obligaciones de conservación: si hay un plazo legal vigente o un bloqueo legal, el dato se bloquea y solo se usa para esa obligación, y se suprime o se anonimiza al vencer. Por ejemplo, suprimir los datos de un socio con facturas de hace tres años no borra esas facturas, pero anonimiza los datos de contacto no obligatorios;
- las supresiones se reaplican en forma automática si alguna vez se restaura una copia de seguridad anterior.

**Conservación de la información.** Los plazos se proponen por categoría, son configurables por la cooperativa dentro de mínimos y máximos y deben validarse con su asesoría legal, fiscal y contable antes de la primera aplicación real. Algunos valores de referencia:

| Categoría | Plazo propuesto | Al vencer |
|---|---|---|
| Comprobantes, recibos, asientos y documentación respaldatoria | 10 años desde el cierre del ejercicio | Se conserva el documento y se anonimizan los datos de contacto no fiscales. |
| Contratos de suministro, solicitudes y conformidades firmadas | 10 años desde el fin del contrato | Se anonimizan. |
| Reclamos, conversaciones y adjuntos de atención | 5 años desde el cierre del caso | Se anonimiza el texto y se eliminan los adjuntos. |
| Personas registradas sin vínculo con la cooperativa | 24 meses de inactividad | Se suprimen. |
| Auditoría de accesos y eventos de seguridad | 2 años en línea y 3 años en archivo | Se eliminan. |
| Legajos de personal y liquidaciones | 10 años desde el egreso | Se anonimizan, salvo bloqueo legal. |
| Registros institucionales (asociados, capital, actas, asambleas) y derechos de cementerio | Permanente | No se suprimen; el acceso queda restringido. |

Ningún documento económico se borra, ni siquiera ante un pedido de supresión: se anula, se revierte o se anonimiza en sus datos no obligatorios cuando vence la conservación. La primera aplicación de cada plazo requiere aprobación y un informe previo del impacto. Los bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) se registran con motivo, responsable y vigencia, y se aprueban entre dos personas.

**Datos de salud y otros datos sensibles.** Se guardan separados de la información comercial (la cuenta del socio solo ve, por ejemplo, "condición acreditada: sí" y su vigencia), se cifran con su propia clave, solo los ve quien tiene el permiso específico y cada consulta queda registrada; abrir una ficha sensible fuera de una tarea asignada exige indicar el motivo. Se excluyen de los reportes generales, las integraciones, las exportaciones genéricas, la comunidad, el asistente virtual y la inteligencia artificial, y las notificaciones no muestran su contenido (por ejemplo, "Hay una novedad en su prestación", sin diagnóstico).

**Minimización.** Las integraciones, los reportes, el asistente virtual y la inteligencia artificial reciben solo los datos necesarios para su finalidad; por defecto, las integraciones no exponen documento, CUIT, teléfono, correo ni domicilio completo. Los reportes agregados ocultan los cruces con menos de cinco titulares para evitar la identificación de personas. Las notificaciones en la pantalla bloqueada del celular no muestran importes de deuda ni datos sensibles, según lo configure la cooperativa. La aplicación de campo descarga solo los datos de las tareas asignadas, que vencen a los siete días.

**Inteligencia artificial y datos personales.** Solo se usan proveedores con acuerdo de tratamiento que no entrenan sus modelos con los datos de las cooperativas; los identificadores se ocultan antes del envío, la función se habilita por cooperativa y los datos de salud nunca se envían.

**Menores de edad.** Los datos de menores (adherentes, beneficiarios, hijos en legajos) se tratan con el consentimiento de su representante cuando corresponde, no se usan en comunicaciones promocionales ni en la comunidad, y el sistema avisa cuando alcanzan la mayoría de edad para regularizar titularidad y consentimiento.

**Subencargados y alojamiento.** Cada cooperativa ve el registro vigente de subencargados de la plataforma (proveedor, servicio, datos tratados, país y garantía de transferencia) y su historial, y recibe un aviso con al menos 30 días de anticipación antes de que se incorpore uno nuevo.

**Fin del servicio.** Al terminar el contrato, la plataforma entrega la exportación completa de los datos de la cooperativa y los destruye en producción dentro de los 30 días posteriores a que la cooperativa acepte la exportación, salvo que la cooperativa autorice expresamente conservarlos cifrados hasta dos años; en las copias de seguridad, se eliminan al vencer su plazo de retención. La destrucción se acredita con una constancia.

**Privacidad desde el diseño.** Toda función nueva que trate datos sensibles, perfile socios, use inteligencia artificial o ubicación continua, o comparta datos con terceros, cuenta con una evaluación de impacto antes de construirse. El sitio público usa solo las cookies estrictamente necesarias, salvo consentimiento, y el sistema no usa cookies de terceros ni identificadores publicitarios.

### 12.4 Exactitud y confiabilidad

- Cálculos monetarios exactos, sin diferencias de centavos entre comprobante, cuenta corriente y contabilidad.
- Ninguna operación se ejecuta dos veces por un reintento.
- Ante respuestas inciertas de terceros, se consulta antes de reintentar.
- Fechas y horas fijadas por el servidor, con la zona horaria de la cooperativa.
- La suma de las partes es siempre igual al total en cada comprobante, distribución y prorrateo; la diferencia de redondeo se asigna con un criterio fijo y queda explicada.
- Los importes se expresan con su moneda; las operaciones en otra moneda guardan la moneda original, el tipo de cambio, su fuente y su fecha, y nunca se suman importes de monedas distintas sin conversión explícita.
- Los procesos masivos guardan su avance y, si se interrumpen, se reanudan desde el último punto sin duplicar comprobantes, cobros ni mensajes.
- Las fechas de negocio (períodos, vencimientos, cortes, fechas efectivas) se calculan en la zona horaria de la cooperativa (Córdoba por defecto, configurable por cooperativa y sucursal) y con su calendario de feriados nacionales, provinciales y locales para los plazos en días hábiles.
- Los números, importes y fechas se muestran con el formato argentino (por ejemplo, $ 1.234,56 y 31-12-2026), y el sistema valida los dígitos verificadores de CUIT, CUIL, CBU y CVU.
- Una constancia regulada (intimación, aviso de corte, constancia de baja) no se da por cumplida con la sola aceptación del proveedor de mensajería: requiere evidencia de entrega o genera una tarea alternativa.

### 12.5 Accesibilidad

- El sitio público, la aplicación del socio, el espacio del empleado, la aplicación de campo y el sistema de gestión tienen como objetivo el nivel AA de las pautas de accesibilidad WCAG 2.2, teniendo en cuenta la Ley 26.653 de accesibilidad web. No se declara la conformidad sin verificarla.
- Los recorridos esenciales pueden completarse solo con el teclado, con foco visible, etiquetas en todos los campos y mensajes de error claros.
- En cada etapa se verifican manualmente los recorridos esenciales con lectores de pantalla en computadora, Android e iPhone, con ampliación al 200 % y en pantallas de hasta 320 píxeles de ancho.
- Al publicar los colores de su marca, la cooperativa recibe un control automático de contraste: el sistema bloquea o ajusta las combinaciones que no alcanzan el mínimo exigido (4,5 a 1 para el texto). Los textos personalizados largos no deforman las pantallas.
- Existen alternativas al mapa (por ejemplo, para elegir un domicilio) y a los gestos táctiles.
- Los formularios largos conservan un borrador y, ante un error de validación, mantienen todos los datos cargados y llevan el foco al primer campo con error.
- Toda acción que demora más de un segundo muestra un indicador de progreso; si demora más de diez, continúa en segundo plano, el usuario puede seguir trabajando y recibe un aviso al terminar.
- Los comprobantes enviados al socio se generan como PDF accesibles cuando la herramienta de generación lo permite, legibles al imprimirse en blanco y negro y con códigos de barras y QR fiscales de lectura asegurada.
- La aplicación del socio ofrece un modo de datos reducidos que evita descargar las imágenes de la comunidad.

### 12.6 Continuidad y copias de seguridad

- **Copias automáticas**: la plataforma realiza las copias de seguridad; los usuarios no tienen que hacerlas. La base de datos se respalda en forma continua, con recuperación a cualquier momento de los últimos 7 días, más copias diarias que se conservan 35 días, semanales que se conservan 12 semanas y mensuales que se conservan 13 meses. Además, se hace una copia diaria separada por cooperativa, cifrada y verificable.
- **Documentos y archivos**: se guardan con historial de versiones, se replican en otra región y quedan protegidos contra el borrado durante al menos 35 días los comprobantes y los documentos firmados. Un comprobante borrado por error se recupera en menos de una hora.
- **Protección de las copias**: se cifran con claves distintas de las de producción, se guardan en un espacio separado al que la plataforma productiva solo puede escribir, no pueden borrarse durante su retención y leerlas requiere la aprobación de dos personas.
- **Las copias sirven para recuperar, no para conservar**: la conservación legal de diez años de facturas, recibos, asientos y movimientos la dan los propios datos, que permanecen disponibles durante todo ese plazo.
- **Restauración de una sola cooperativa**: ante un error humano, un borrado masivo o una carga defectuosa, los datos de una cooperativa pueden recuperarse a un momento determinado en menos de cuatro horas, sin afectar a las demás cooperativas y con un plan de reincorporación aprobado por la cooperativa.
- **Conciliación posterior a una restauración**: antes de reanudar los procesos, el sistema consulta al organismo fiscal (último comprobante autorizado), a las pasarelas, a los entes de cobranza, a la mensajería y a los equipos de red, para que ninguna factura, cobro o mensaje ya realizado se repita ni se pierda.
- **Simulacros**: la restauración se prueba todos los meses para la plataforma, cada tres meses con la cooperativa piloto y una vez por año en forma completa con medición de tiempos y acta. Los procedimientos de recuperación están documentados y cada uno se ensaya al menos una vez por año.
- **Alta disponibilidad**: la base de datos funciona replicada en tres zonas; la caída de un servidor se resuelve en un minuto y la de una zona completa en 15 minutos, sin perder operaciones confirmadas.
- **Desastre regional**: ante la pérdida de la región principal, el servicio se restablece en una región secundaria con una pérdida máxima de una hora de datos y en un plazo de 24 horas, a partir de la etapa de información, integración y reemplazo.
- **Operación ante caídas de terceros**: si el organismo fiscal, una pasarela, la mensajería o los mapas no responden, el sistema encola las operaciones y sigue atendiendo; por ejemplo, la caja puede seguir cobrando y la factura queda pendiente de autorización, sin figurar como emitida. El tablero de la cooperativa muestra la integración afectada en menos de dos minutos.
- **Mantenimiento programado**: la ventana propuesta es el domingo de 2 a 6 horas, con un máximo de cuatro horas por mes y aviso con al menos 72 horas de anticipación. Cada cooperativa declara sus días críticos (facturación masiva, primeros vencimientos, cierre de caja de fin de mes), en los que solo se instalan correcciones urgentes aprobadas.
- **Actualizaciones sin corte**: las actualizaciones habituales se instalan sin interrumpir el servicio y, si una versión nueva presenta errores, se vuelve automáticamente a la anterior.

### 12.7 Rendimiento y capacidad

**Perfil de referencia.** El sistema se diseña y se prueba con dos perfiles de cooperativa, que se recalibran con las mediciones de la cooperativa piloto:

| Dimensión | Cooperativa estándar | Cooperativa grande |
|---|---|---|
| Suministros y servicios contratados activos | 25.000 | 150.000 |
| Personas y titulares | 20.000 | 120.000 |
| Comprobantes por ciclo mensual | 30.000 | 180.000 |
| Movimientos de cuenta corriente por año | 1.000.000 | 6.000.000 |
| Usuarios administrativos simultáneos | 30 | 150 |
| Socios activos en el día de mayor vencimiento | 5.000 | 30.000 |
| Técnicos y lecturistas simultáneos en la aplicación de campo | 10 | 60 |
| Lecturas por ciclo (servicios medidos) | 20.000 | 150.000 |
| Archivos nuevos por año (fotos, PDF y adjuntos) | 15 GB | 80 GB |
| Mensajes salientes en el día pico (correo, notificaciones, SMS y WhatsApp) | 30.000 | 200.000 |

La plataforma se diseña para cien cooperativas y puede crecer hasta trescientas sin cambios de diseño. La cooperativa grande, con cinco años de historia, debe cumplir todas las metas de respuesta.

**Tiempos de respuesta interactivos** (en el 95 % de las operaciones, sin contar la demora de servicios externos como el organismo fiscal o las pasarelas):

| Operación | Meta |
|---|---|
| Abrir una ficha o el detalle de un comprobante | 200 milisegundos o menos. |
| Listados paginados con filtros | 400 milisegundos o menos. |
| Búsqueda de una persona, cuenta o suministro por documento, CUIT, número de socio, nombre, domicilio, medidor o comprobante | 500 milisegundos o menos, aun en una cooperativa grande. |
| Cobro en caja, imputación, anulación de recibo | 800 milisegundos o menos; recibo listo para imprimir en 2 segundos. |
| Ficha integral del socio y cuenta corriente con saldos por servicio | 1 segundo o menos. |
| Tableros | 2 segundos o menos. |
| Reportes | 5 segundos o menos; si demoran más, se generan en segundo plano. Las exportaciones de más de 10.000 filas se generan siempre en segundo plano. |

**Procesos masivos** (metas de diseño):

| Proceso | Meta |
|---|---|
| Facturación masiva (cálculo, comprobantes, asientos y cuenta corriente) | 50.000 suministros en 60 minutos; 150.000 en 3 horas. |
| Autorización fiscal de un lote | 50.000 comprobantes en 2 horas, cuando el organismo fiscal responde con normalidad; si se demora, se alerta y se aplica la contingencia prevista. |
| Generación de los PDF y distribución | PDF de 50.000 comprobantes en 60 minutos; distribución en 4 horas, respetando los límites del proveedor y el horario de no molestar de la cooperativa. |
| Evaluación de mora | 150.000 cuentas en 30 minutos. |
| Archivo de débito automático | 50.000 adhesiones en 10 minutos. |
| Imputación de una rendición de cobranza | 50.000 pagos en 15 minutos. |
| Importación de lecturas y validación de consumos | 150.000 lecturas en 20 minutos; validación en 30 minutos. |
| Liquidación de sueldos | 500 empleados en 5 minutos. |

**Aplicaciones del celular y aplicación de campo.**

- La aplicación del socio está pensada para celulares de gama baja y conexión móvil lenta: la pantalla principal carga en 2,5 segundos o menos.
- La aplicación de campo permite trabajar al menos siete días sin conexión, con al menos 1.000 tareas descargadas y 300 fotos por dispositivo, y avisa cuando el almacenamiento disponible baja del 20 % o cuando lleva más de 48 horas sin sincronizar.
- La sincronización de 200 operaciones de campo se completa en 10 segundos o menos; las fotos se comprimen y se suben en segundo plano, con reanudación.
- Si un trabajo de campo entra en conflicto con un cambio en el servidor, se conserva la evidencia con la hora real de la intervención, el caso se deriva a un responsable y nunca se duplica un equipo, una activación ni un cargo.

**Protección ante picos.** Cada cooperativa tiene cuotas de uso (procesos simultáneos, exportaciones, consultas de integración e inteligencia artificial) que impiden que una afecte a las demás. Ante el doble de la carga pico, el sistema sigue atendiendo las operaciones críticas (pagos, avisos de pasarelas y aprovisionamiento) y posterga primero los procesos masivos, con un mensaje claro al usuario.

---

## 13. Modalidad de contratación y habilitación

- **Paquetes por tamaño** de la cooperativa, con **complementos** opcionales y cupos según la cantidad de contratos activos.
- **Licencia por módulo**: cada cooperativa contrata los módulos que necesita y puede ampliarlos en cualquier momento.
- **Activación por la cooperativa**: los módulos contratados se activan cuando la cooperativa está lista para usarlos.
- **Mensajería**: con proveedor propio de la cooperativa o con el servicio de la plataforma, con consumo medido.
- **Claves de mapas e inteligencia artificial**: provistas por la plataforma, con opción de utilizar claves propias de la cooperativa.
- **Ambiente de prueba** incluido para validar configuraciones antes de aplicarlas.
- **Actualizaciones incluidas**, sin instalaciones ni intervención de los usuarios.

### 13.1 Paquetes, complementos y cupos

- Los **paquetes** agrupan módulos y cupos de uso por defecto según el tamaño de la cooperativa (pequeña, mediana, grande o a medida). Como referencia se prevén paquetes de tipo básico, estándar y total; su composición la define el catálogo de producto de la plataforma.
- Los **complementos** se suman al paquete: módulos o servicios verticales adicionales, mensajería de la plataforma con consumo medido, ambientes de prueba adicionales o mayor capacidad en alguna dimensión.
- El **cupo principal** se mide por la cantidad de contratos de servicio activos. El contrato puede fijar además cupos de usuarios internos, almacenamiento, mensajes salientes por mes, consultas de sistemas integrados por mes, uso de inteligencia artificial por mes y ambientes de prueba.
- Cada cupo tiene un **límite de aviso** y un **límite máximo**. El sistema avisa a la cooperativa y a la plataforma al alcanzar el 80 % y el 100 %.
- **Superar un cupo no detiene la operación**: la facturación, la cobranza y la atención siguen funcionando. Según la política propuesta, solo se limitan las nuevas altas de la dimensión excedida (por ejemplo, nuevos contratos) hasta ampliar el cupo.
- El administrador de la cooperativa ve en todo momento su paquete, sus módulos, sus cupos, su consumo y la vigencia del contrato.
- Los precios no forman parte de la configuración del sistema hasta que exista una decisión comercial expresa: la plataforma no fija importes ni límites por su cuenta, y un cupo sin valor acordado se informa como "sin límite acordado".
- Los cambios de paquete o de cupos se registran con su fecha de vigencia y no modifican en forma retroactiva el consumo ya medido.

### 13.2 Licencia, activación y pantallas

La disponibilidad de cada función se decide en tres capas independientes:

1. **Licencia**: qué módulos contrató la cooperativa, con su origen (paquete, complemento, prueba o cortesía), su vigencia y sus cupos. Un módulo sin licencia vigente no puede activarse.
2. **Activación**: qué módulos licenciados están encendidos y en qué modo: apagado, prueba, producción o solo consulta del historial. Pasar un módulo a producción exige completar su lista de habilitación.
3. **Pantallas**: qué ve cada usuario según sus perfiles y permisos (sección 8.5).

- Cada producto del catálogo se vende como una unidad: las pantallas que existen solo por ese producto forman parte de él y no se cobran aparte.
- Algunos módulos dependen de otros; por ejemplo, la facturación requiere tarifas y fiscal, y la mora requiere cobranza. El sistema impide activar un módulo si sus dependencias no están activas.
- Los servicios verticales (Internet, electricidad, agua, gas, cementerio parque, banco de sangre, telefonía, televisión, sepelio, salud y ambulancias, vivienda y otros) se licencian como módulos. Habilitarlos no crea ninguna oferta: la oferta la publica la cooperativa en su catálogo de servicios.
- Una cooperativa puede dejar de ofrecer un servicio a nuevos socios y seguir operando y facturando los contratos vigentes.
- Toda habilitación, deshabilitación o cambio de alcance de un módulo queda auditada.

### 13.3 Mensajería

La cooperativa elige uno de dos modelos para el envío de SMS y WhatsApp:

- **Proveedor propio**: la cooperativa contrata directamente con su proveedor de mensajería y carga sus credenciales en la bóveda; los costos de los mensajes los factura el proveedor a la cooperativa.
- **Servicio de la plataforma**: la plataforma provee el servicio como complemento del paquete, con consumo medido por mensaje y por canal, visible para la cooperativa.

En ambos modelos, la cooperativa puede fijar un tope mensual de gasto en SMS, WhatsApp e inteligencia artificial. Al llegar al tope, la inteligencia artificial se desactiva sin interrumpir los procesos y los mensajes no esenciales se pausan con aviso al administrador; los mensajes críticos (avisos de corte, vencimientos y constancias) no se pausan sin una decisión de la cooperativa. El sistema avisa al alcanzar el 80 % del tope.

### 13.4 Habilitación de la cooperativa

Cada cooperativa recorre estados sucesivos, y cada cambio de estado queda registrado con responsable, motivo, fecha y evidencia:

| Estado | Qué significa |
|---|---|
| Preparación | Se cargan la marca, el catálogo, la configuración y los usuarios. No se puede emitir, cobrar ni enviar comunicaciones reales. |
| Prueba | La cooperativa trabaja en su ambiente de prueba, con integraciones de homologación; los datos de prueba se marcan y no pasan a producción. |
| Listo para habilitar | Las listas de habilitación de las funciones a utilizar están completas. |
| Operativo | La cooperativa opera con datos y servicios reales. |
| Suspendido administrativo | Suspensión por deuda del servicio, incumplimiento, pedido de la cooperativa o riesgo de seguridad (sección 13.7). |
| Cierre | Salida ordenada de la cooperativa: en cierre, cerrada y, al final, datos eliminados con constancia. |

- **Alta asistida**: un asistente guía el alta en pasos (identidad, contactos, marca, módulos y paquete, dirección web, administrador inicial y confirmación). A partir del logo o del sitio web de la cooperativa, la inteligencia artificial propone colores, nombre corto, íconos y vocabulario (por ejemplo, "socio", "asociado" o "usuario"), y nada se aplica sin confirmación de una persona. La razón social y el domicilio fiscal pueden precargarse desde el padrón del organismo fiscal a partir del CUIT, siempre editables. Los colores propuestos se ajustan para cumplir el contraste mínimo de accesibilidad.
- **Plazo**: desde la aprobación comercial hasta tener el sistema de gestión habilitado y el sitio público publicado con la marca y el vocabulario base transcurre un día hábil como máximo, sin intervención de programadores.
- **Listas de habilitación por función**: cubren identidad, servicios, tarifas, emisión, pagos, usuarios, contactos, saldos iniciales, comunicaciones, sitio público y aspectos legales. Algunos puntos los verifica el sistema en forma automática y otros los confirma la cooperativa con evidencia. Una función no pasa a producción con un punto obligatorio pendiente, salvo una dispensa aprobada y auditada, y nunca con datos de demostración cargados.
- **Tablero de habilitación**: la cooperativa ve el avance de cada lista, los pendientes y sus responsables.
- **Tres dimensiones independientes**: el estado técnico de la cooperativa, su situación comercial con la plataforma y la prestación de servicios a sus socios son independientes. Un contrato con la plataforma vencido no cambia el estado de los servicios de los socios.
- **Varias entidades jurídicas**: una cooperativa puede administrar en el mismo espacio varias personas jurídicas vinculadas (por ejemplo, una mutual), con emisión, contabilidad y sueldos por entidad.

### 13.5 Ambiente de prueba

- Cada cooperativa dispone de un ambiente de prueba separado del productivo, con una copia gemela de su espacio, para probar configuraciones nuevas (tarifas, ciclos, reglas) antes de publicarlas.
- En el ambiente de prueba se usan los servicios de homologación del organismo fiscal, las pasarelas y la mensajería, los correos se dirigen solo a destinatarios autorizados y no es posible cargar credenciales productivas: no se emite, no se cobra ni se envía nada real.
- Se carga por defecto con datos ficticios. Una copia anonimizada de los datos reales solo se permite con la aprobación del administrador de la cooperativa y de seguridad de la plataforma.
- La configuración probada se traslada a producción como un paquete versionado, verificado y aprobado; además, muchas configuraciones admiten una simulación directa en producción, sin efectos reales.
- Toda publicación de configuración puede revertirse a la versión anterior sin perder las operaciones realizadas en el intervalo.

### 13.6 Facturación del servicio

- La facturación de la plataforma a las cooperativas está separada de la facturación que cada cooperativa hace a sus socios.
- La plataforma mide cada día el consumo de cada cooperativa por dimensión (contratos activos, usuarios, almacenamiento, mensajes, consultas de integración, inteligencia artificial), y el consumo mensual está disponible el segundo día de cada mes.
- Desde la etapa de plataforma y configuración se emite una prefactura mensual por contrato, exportable. Desde la etapa de cobranza y tesorería operativa, la plataforma emite sus facturas electrónicas con el propio módulo de facturación del sistema.
- El contrato con la cooperativa registra el paquete, los módulos, los cupos, la vigencia, la renovación, la región de alojamiento, los niveles de servicio, las condiciones de salida y el contrato de encargo de tratamiento de datos personales, con sus versiones y el documento firmado.

### 13.7 Suspensión, reactivación y salida

- **Suspensión administrativa**: no da de baja servicios ni contratos de los socios ni borra información. Según la política propuesta, durante la suspensión los socios pueden seguir consultando y pagando, y las nuevas solicitudes quedan bloqueadas.
- **Reactivación**: la cooperativa vuelve a operar desde el estado actual; los procesos programados durante la suspensión (por ejemplo, un ciclo de facturación) no se ejecutan dos veces, sino que quedan en una bandeja para que la cooperativa decida.
- **Salida**: la cooperativa recibe un aviso y la exportación completa de sus datos en formatos abiertos, con sus archivos originales y un control de integridad que permite verificarla, sin incluir credenciales. Según la política propuesta, sigue un período de 90 días de solo consulta; luego se cierran los accesos y los datos se eliminan al vencer la retención, con constancia de destrucción (sección 12.3). La custodia de la documentación fiscal queda a cargo de la cooperativa con la exportación entregada.

### 13.8 Actualizaciones y dirección web

- Todas las cooperativas usan la misma versión del sistema. Las funciones nuevas se habilitan en forma gradual (primero en la plataforma, luego en cooperativas piloto y finalmente en todas) y pueden encenderse por cooperativa.
- Las actualizaciones se instalan sin cortes, sin instaladores en los puestos y sin intervención de los usuarios. El administrador ve en el sistema las novedades de cada versión y los avisos de mantenimiento.
- Cada cooperativa accede con una dirección formada con su nombre dentro del dominio de la plataforma y puede usar, en forma opcional, un dominio propio verificado. Si deja de usar un dominio propio, la plataforma lo retira en forma controlada.

---

## 14. Puesta en marcha e implementación por etapas

El sistema se construye y se habilita en etapas sucesivas. Cada etapa entrega funciones completas y utilizables. El primer recorrido de punta a punta es el del servicio de Internet; luego se incorporan los servicios medidos y, finalmente, la gestión administrativa e institucional completa.

| Etapa | Contenido | Resultado visible |
|---|---|---|
| 1. Fundaciones | Bases de seguridad, ingreso, aislamiento por cooperativa, auditoría, marca y vocabulario; personas jurídicas y sucursales de la cooperativa. | Una cooperativa de demostración con ingreso seguro. |
| 2. Plataforma y configuración | Usuarios, roles, permisos, parámetros, tablas maestras, geografía, aprobaciones y repositorio documental. | Alta asistida de una cooperativa con su configuración publicada. |
| 3. Socios, servicios y portal | Personas y cuentas, catálogo de servicios, sitio público, registro, portal, solicitudes y comunidad. | Un socio se registra y solicita Internet desde el sitio. |
| 4. Técnica de Internet | Factibilidad, agenda, órdenes de trabajo, instalación, comodato, stock de equipos, aplicación de campo y aprovisionamiento; legajo mínimo del personal técnico. | El servicio queda instalado y activo. |
| 5. Tarifas, facturación y fiscal | Motor tarifario, facturación, autorización fiscal electrónica, impuestos y adherentes. | Primera factura electrónica autorizada. |
| 6. Cobranza y tesorería operativa | Cuenta corriente, caja, pasarelas, débitos, conciliación, tesorería operativa, contabilidad inicial y capital social. | Pago en línea imputado y registrado contablemente. |
| 7. Mora y atención avanzada | Mora, suspensión, corte, reconexión, convenios, incobrables, inteligencia artificial y atención omnicanal. | Recorrido de Internet completo de punta a punta. |
| 8. Servicios medidos y reemplazo comercial | Electricidad, agua, cloacas, gas, alumbrado, lecturas, telemedición, prepago, tarifas medidas, reguladores y obras; migración de la información comercial vigente, facturación en paralelo, ensayo de corte y reemplazo comercial por servicio. | Facturación de energía con lecturas; reemplazo comercial de electricidad, gas y prepago de la cooperativa piloto. |
| 9. Gestión administrativa | Compras, stock completo, tesorería, contabilidad completa y regímenes informativos; importación de liquidaciones de sueldos externas. | Cierre contable mensual. |
| 10. Personal y sueldos | Liquidación propia de sueldos con todas sus obligaciones. | Liquidación mensual con sus declaraciones. |
| 11. Institucional y servicios sociales | Asociados, asambleas, servicios sociales, flota, telefonía, televisión, fabricación, turnero y actividades. | Asamblea y servicios sociales operativos. |
| 12. Información, integración y reemplazo administrativo | Inteligencia de negocio, generador de reportes, interfaz para terceros, pasarelas restantes, migración repetible e históricos. | Reemplazo administrativo y apagado del sistema anterior en la cooperativa piloto. |

*Corrección de la versión 2.0: en la versión 1.0, la etapa 8 no incluía la migración ni el reemplazo comercial, y la etapa 12 decía "migración repetible y corrida paralela" con el resultado "Reemplazo del sistema anterior: primero el área comercial y luego la administrativa". La corrida paralela y el reemplazo comercial se adelantan a la etapa 8, porque la cooperativa piloto presta servicios medidos; en la etapa 12 quedan el reemplazo administrativo y el apagado del sistema anterior.*

### 14.1 Primer servicio completo: Internet

Las etapas 3 a 7 cierran el recorrido completo del servicio de Internet: el socio lo solicita desde el sitio (etapa 3), se instala y se activa (etapa 4), se factura con autorización fiscal (etapa 5), se cobra y se registra contablemente (etapa 6) y, finalmente, se gestionan la mora, la suspensión, la reconexión y la atención por todos los canales (etapa 7). Al terminar la etapa 7, una cooperativa puede operar Internet en el sistema de punta a punta.

### 14.2 Servicios medidos y reemplazo comercial

La etapa 8 incorpora los servicios medidos y, con ellos, el reemplazo comercial del sistema anterior en la cooperativa piloto:

1. Se migra la información comercial vigente (personas, cuentas, contratos, medidores, lecturas, tarifas, deuda y cuenta corriente) con conciliación por dominio.
2. Se factura **en paralelo** en los dos sistemas y se compara factura por factura. Se requieren **dos ciclos consecutivos aprobados** por la cooperativa.
3. Se realiza un **ensayo de corte** completo, con plan de vuelta atrás.
4. Electricidad, gas y prepago pasan a operar en el nuevo sistema al cerrar la etapa. Los demás servicios que preste la cooperativa piloto pasan cuando está lista la etapa de su servicio.
5. Las facturas emitidas por el sistema anterior siguen pudiendo pagarse con sus códigos hasta su vencimiento.

### 14.3 Convivencia y reemplazo administrativo

Durante la convivencia, contabilidad, compras, stock, tesorería y sueldos siguen operando en el sistema anterior, que conserva la **contabilidad oficial**. El nuevo sistema registra contablemente todas sus operaciones en un plan marcado como no oficial, que se concilia contra el sistema anterior. En la etapa 12 se realiza el reemplazo administrativo: la contabilidad del nuevo sistema pasa a ser la oficial y el sistema anterior se apaga, conservando una copia de su información por diez años.

### 14.4 Criterios para dar por terminada una etapa

- Todas las funciones de la etapa están construidas, probadas y documentadas, con sus permisos y su ayuda en pantalla.
- Se cumplen los criterios de aceptación definidos para la etapa, incluidos los recorridos de ejemplo correspondientes.
- Las pruebas automáticas de aislamiento entre cooperativas, de permisos y de seguridad dan resultado satisfactorio.
- Los procesos masivos de la etapa cumplen los tiempos comprometidos con volúmenes de una cooperativa grande.
- La cooperativa piloto valida el resultado visible de la etapa antes de habilitarla en producción.

---

## 15. Glosario

| Término | Significado |
|---|---|
| Cooperativa | Cliente de la plataforma; cada cooperativa opera con sus datos aislados, su marca y su configuración. |
| Persona | Individuo o entidad con identificación fiscal (DNI, CUIT o CUIL). |
| Titular | Persona responsable de una o más cuentas de servicios. |
| Asociado o socio | Persona con vínculo institucional con la cooperativa (capital social y voto). |
| Cuenta | Unidad de facturación y de cuenta corriente de un titular. |
| Suministro o conexión | Servicio prestado en un domicilio para una cuenta. |
| Contrato de servicio | Vínculo entre un titular, una cuenta, un servicio con su plan y un punto de prestación. |
| Plan | Oferta comercial de un servicio con sus condiciones, versionada en el tiempo. |
| Categoría | Clasificación tarifaria o regulatoria del suministro (residencial, comercial, rural, tarifa social, entre otras). |
| Concepto | Ítem facturable: cargo fijo, consumo, cuota, impuesto o tasa. |
| Ciclo de facturación | Período y calendario de corte, emisión y vencimientos de un servicio. |
| Lote | Ejecución de facturación masiva sobre un conjunto de cuentas. |
| Factura agrupada multiservicio | Comprobante único que incluye varios servicios de una misma cuenta, con detalle separado por servicio. |
| Ente recaudador | Tercero que cobra por cuenta de la cooperativa. |
| Pasarela de pago | Servicio que permite pagar en línea con tarjeta, transferencia o QR. |
| Comodato | Préstamo de un equipo de la cooperativa al socio mientras dure el servicio. |
| Factibilidad | Evaluación técnica que determina si es posible prestar un servicio en un domicilio. |
| Orden de trabajo | Instrucción para realizar una tarea técnica, con su registro de ejecución. |
| Aprovisionamiento | Activación, modificación o corte del servicio en los equipos de red, en forma automática. |
| Telemedición | Lectura y operación remota de medidores inteligentes. |
| Generación distribuida | Energía producida por el propio usuario e inyectada a la red. |
| Doble factor | Verificación adicional al ingresar, mediante un código o un dispositivo. |
| Verificación reforzada | Nueva verificación de identidad exigida antes de una acción sensible. |
| Alcance de datos | Conjunto de registros sobre los que un usuario puede operar (sucursal, zona, servicio, cuadrilla o propios). |
| Diccionario | Vocabulario propio de cada cooperativa aplicado en todas las pantallas y documentos. |
| Audiencia | Conjunto de destinatarios de una publicación, encuesta, campaña o aviso. |
| Acceso de soporte | Permiso temporal, aprobado, acotado y auditado que recibe un agente de la plataforma para observar u operar en una cooperativa. |
| Acceso temporal de soporte | Autorización acotada en modo, alcance y tiempo para que el soporte de la plataforma observe u opere en una cooperativa. |
| Adherente | Integrante del grupo familiar o beneficiario incorporado al servicio de un titular, como en sepelio o salud. |
| Adhesión al débito automático | Autorización del socio para que sus facturas se debiten de una cuenta bancaria o de una tarjeta. |
| Agente local | Programa instalado en una computadora de la sucursal que comunica el sistema con impresoras, lectores, balanzas y turneros. |
| Ambiente de prueba | Copia separada del espacio de la cooperativa para probar configuraciones sin emitir, cobrar ni enviar nada real. |
| Análisis de impacto | Cálculo de los servicios, contratos y titulares que dependen de un elemento de la red y quedan afectados si ese elemento falla o se interrumpe. |
| Asiento automático | Registro contable que el sistema genera a partir de una operación de otro módulo, según reglas configuradas por la cooperativa. |
| Autorización de supervisor | Aprobación de un solo uso, en el momento o diferida, que habilita una acción puntual que el usuario no tiene permitida o que excede su límite. |
| Autorización fiscal | Código que otorga ARCA a cada comprobante electrónico y que lo convierte en válido ante el organismo. |
| Bandeja unificada | Lista única de tareas, aprobaciones, gestiones y excepciones pendientes de cada empleado. |
| Bien de uso | Bien propio de la cooperativa de uso prolongado (vehículo, equipo de red, herramienta) que se amortiza a lo largo de su vida útil. |
| Bloqueo | Restricción con efectos concretos (por ejemplo, impedir el cobro en caja o una transferencia) aplicada a una persona, cuenta o servicio, con causa, vigencia y autor. |
| Botón de baja | Acceso visible del sitio público para solicitar la baja de un servicio sin registro previo, con código de seguimiento y constancia. |
| Capital integrado | Parte del capital social suscripto que el asociado efectivamente pagó. |
| Carencia | Plazo desde el alta de cada adherente durante el cual todavía no tiene cobertura. |
| Caudal mínimo vital | Cantidad mínima de agua que se garantiza aun cuando el servicio se restringe por mora. |
| Centro de costo | Unidad interna de análisis (sección, área o servicio) a la que se asignan ingresos y gastos. |
| Cheque electrónico (eCheq) | Cheque que se emite, endosa, deposita y cobra por canales electrónicos bancarios. |
| Cliente no asociado | Persona que contrata servicios de la cooperativa sin tener relación institucional como asociado. |
| Complemento | Módulo, servicio o capacidad adicional que se suma al paquete contratado (por ejemplo, la mensajería de la plataforma con consumo medido). |
| Conciliación bancaria | Comparación entre el extracto del banco y los registros de la cooperativa a una fecha, con cada diferencia explicada. |
| Conexión | Configuración de un proveedor externo para una cooperativa, con su alcance, sus credenciales y su modo de prueba o producción. |
| Constancia de baja | Comprobante con código identificador que recibe quien solicita la baja de un servicio, por el mismo medio por el que la pidió. |
| Constancia de entrega | Evidencia del contenido, destinatario, fechas y estados de entrega de una comunicación. |
| Consumo aprobado | Cantidad medida o estimada que superó los controles y queda habilitada para facturar. |
| Contingencia | Modalidad de autorización anticipada que permite seguir emitiendo comprobantes válidos cuando el organismo fiscal no responde, informándolos después. |
| Contribución por mejoras | Cobro de una obra a los beneficiarios, prorrateado con un criterio aprobado y facturado en cuotas. |
| Control de tres vías | Comparación de cantidades y precios entre la orden de compra, la recepción y la factura del proveedor antes de habilitar el pago. |
| Convenio de pago | Acuerdo firmado por el socio que reemplaza deudas vencidas por un anticipo y un plan de cuotas. |
| Convivencia | Período en que el sistema anterior y el nuevo operan a la vez, con un único sistema responsable de cada área. |
| Corrida paralela | Período en que el sistema nuevo calcula los mismos ciclos que el sistema actual, sin efecto fiscal, para comparar factura por factura. |
| Cuadrilla | Grupo de técnicos que trabaja en conjunto, con zona, servicios, vehículo y capacidad diaria. |
| Cuadro tarifario | Versión aprobada de precios y reglas de cálculo, con vigencia y respaldo normativo. |
| Cuota social | Unidad de capital social, de igual valor nominal e indivisible, que suscribe e integra el asociado. |
| Cupo | Límite de uso contratado en una dimensión, principalmente la cantidad de contratos de servicio activos; tiene un límite de aviso y un límite máximo. |
| Custodia | Responsable actual de un material o equipo (depósito, cuadrilla, técnico, socio o proveedor), aunque la propiedad siga siendo de la cooperativa. |
| Derecho de sepultura | Derecho adquirido sobre una unidad del cementerio parque, con titular, modalidad y vigencia. |
| Dispositivo confiable | Equipo en el que el usuario aceptó no repetir el segundo factor durante un plazo, revocable en cualquier momento. |
| Doble firma | Aprobación de un cambio por un usuario distinto del que lo cargó o lo envió. |
| Estado operativo | Nombre propio que la cooperativa da al estado de un servicio (por ejemplo, conectado o cortado), asociado siempre a un estado del sistema. |
| Estimación | Consumo calculado sin lectura real, con método y motivo registrados, que se regulariza cuando se obtiene la lectura. |
| Expediente digital | Reunión de los documentos, operaciones, trámites y comunicaciones de una persona, cuenta, contrato u otro sujeto, con su línea de tiempo. |
| Facturación en paralelo | Etapa de la migración en la que el nuevo sistema simula la facturación y la compara, factura por factura, con la del sistema anterior antes de reemplazarlo. |
| Fecha efectiva | Fecha desde la que rige un valor, un documento o un movimiento, distinta de la fecha en que se registró en el sistema. |
| Firma electrónica | Firma realizada con un código de un solo uso enviado al firmante, con constancia y huella del documento. |
| Gestión (expediente de atención) | Registro único de una solicitud, reclamo, consulta o presentación, con número de seguimiento, conversación, historial y resultado, que se conserva aunque cambie de área. |
| Guardia técnica | Turno de disponibilidad de personal técnico, fuera del horario habitual, para atender urgencias de seguridad. |
| Hito de activación | Momento en que la instalación quedó probada y el servicio aprovisionado; fija la fecha efectiva desde la que el servicio está activo. |
| Identificador de pago | Código propio de cada factura, cupón o cuota que permite reconocer un pago recibido por cualquier canal. |
| Identificador de tarjeta | Código que entrega la pasarela o la procesadora para representar una tarjeta adherida al débito automático, sin revelar su número completo. |
| Imputación | Aplicación de un pago o de un crédito a una o más obligaciones concretas. |
| Incidente común | Falla que afecta a varios socios a la vez y se resuelve con una sola gestión técnica, a la que se vinculan los reclamos individuales. |
| Indicador certificado | Indicador con fórmula, universo y fecha de corte definidos y versionados, que vale lo mismo en todas las salidas del sistema. |
| Instancia de mora | Cada etapa del proceso de gestión de deuda vencida (aviso, intimación, riesgo de corte, corte), con sus plazos y canales. |
| Libro de Sueldos Digital | Registro obligatorio de las remuneraciones que el empleador presenta ante ARCA en formato digital. |
| Liquidación rectificativa | Liquidación que reemplaza un recibo emitido con error; el original queda anulado y vinculado, nunca se borra. |
| Lista de verificación de habilitación | Controles automáticos y manuales que deben cumplirse para que una capacidad pase a producción. |
| Medidor testigo | Medidor de referencia cuyo consumo se usa para determinar el tramo tarifario de los servicios asociados a él. |
| Nota de crédito o de débito | Comprobante que disminuye o aumenta lo facturado en un comprobante anterior, al que queda vinculado. |
| Operación sensible | Acción con impacto económico o de control que solo produce efectos después de ser aprobada. |
| Orden de pago | Documento que reúne las facturas y anticipos a pagar a un proveedor, las retenciones practicadas y el neto que tesorería debe abonar. |
| Padrón | Lista versionada de asociados habilitados para participar en una asamblea, con fecha de corte y criterios de habilitación. |
| Padrón de asociados | Lista versionada de los asociados habilitados para participar y votar en una asamblea. |
| Paquete | Conjunto predefinido de módulos y cupos de uso que la cooperativa contrata según su tamaño. |
| Persona jurídica emisora | Cada entidad con CUIT propio dentro de una cooperativa (por ejemplo, la cooperativa y una mutual vinculada) que emite comprobantes, lleva contabilidad y emplea personal. |
| Plazo de atención | Tiempo comprometido para la primera respuesta y la resolución de una gestión, con alertas y escalamiento al vencer. |
| Posición diaria | Dinero disponible a una fecha por cuenta y moneda, separado de lo que está en tránsito, en cartera o a acreditar. |
| Prestador de servicios de tratamiento | Rol de GoodApps ante la Ley 25.326: trata los datos por cuenta de la cooperativa, sin usarlos para otros fines, y los devuelve o destruye al terminar el servicio. |
| Protección normativa | Condición acreditada (electrodependencia, salud, establecimiento educativo, entidad pública) que impide o condiciona la suspensión de un servicio por deuda. |
| Punto de prestación | Lugar donde se brinda uno o varios servicios, incluso de titulares distintos; puede no coincidir con el domicilio personal, fiscal o postal del titular. |
| Punto de venta | Lugar de emisión habilitado ante el organismo fiscal, con su propia numeración por tipo de comprobante. |
| Reemplazo administrativo | Paso de contabilidad, compras, stock, tesorería y sueldos al sistema nuevo y apagado del sistema anterior. |
| Reemplazo comercial | Paso de la gestión comercial de un servicio al sistema nuevo, después del paralelo aprobado y del ensayo de corte. |
| Rendición | Informe con el que un ente recaudador, un cajero o la propia cooperativa da cuenta de lo cobrado para su imputación o su entrega a un tercero. |
| Rendición de cuadrilla | Conciliación entre lo entregado a una cuadrilla y lo que consumió, instaló y devolvió; las diferencias requieren un ajuste aprobado. |
| Representación | Autorización vigente que un titular otorga a otra persona para actuar sobre su cuenta con acciones determinadas. |
| Resultado incierto | Situación en la que no se sabe si un proveedor aplicó una operación; el sistema consulta su estado antes de reintentar. |
| Ruta de lectura | Conjunto ordenado de puntos de medición que recorre un lecturista en cada período. |
| Saldo a favor | Importe disponible a favor del titular, con su origen identificado, que se aplica a deudas según la política de la cooperativa. |
| Separación de funciones | Control que impide que una misma persona realice dos pasos incompatibles, por ejemplo solicitar y aprobar, o aprobar y pagar. |
| Tabla maestra | Catálogo de valores de referencia (localidades, calles, feriados, listas) que usan todos los módulos. |
| Texto protegido | Texto legal, fiscal o normativo que la cooperativa no puede modificar en su diccionario. |
| Transgresión de demanda | Situación en la que la demanda de potencia registrada supera la potencia contratada. |
| Versión de configuración | Conjunto de cambios de configuración que se valida, se simula, se aprueba y se publica completo, con una fecha desde la que rige. |
