# CoopApps — Objetivos, alcance y límites (documento inicial para generar imágenes)

**Este es el primer documento que se pega** en Claude o en ChatGPT. Fija el estilo visual de toda la presentación y explica qué es el sistema, para qué sirve, qué incluye y qué no hace. Los demás documentos de la carpeta profundizan cada tema y se pueden pegar después en la misma conversación.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuente | Copia adaptada del documento de alcance funcional v2.0 (`docs/alcance-funcional/GoodApps-Cooperativas-Alcance-Funcional.md`), secciones 1 a 8, 12.1, 13 y 14. Se resumió la redacción sin cambiar el contenido |
| Regla de uso | Todo lo que dice este documento está en el alcance funcional. Las imágenes no deben agregar objetivos, funciones ni compromisos que no estén acá |

---

## 0. Cómo usar este documento

1. Abrir una conversación nueva en Claude (recomendado) o en ChatGPT.
2. Subir este archivo y pegar el prompt maestro de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-O01", "Generá IMG-O02", etc. (sección 13).
4. En la misma conversación, si se quiere profundizar, subir después los demás documentos de la carpeta, en este orden sugerido:
   1. `documento-base-presentacion.md`: el relevamiento, la especificación y el plan;
   2. `dolores-procoop-antes-y-despues.md`: los problemas de hoy y cómo se resuelven;
   3. `alcance-especificacion-modulo-por-modulo.md`: el detalle de cada módulo;
   4. `roles-y-modulos-para-claude.md`: qué tiene cada rol;
   5. `plazos-olas-y-costos.md`: tiempos y costos.

### 0.1 Prompt maestro (pegar primero)

```text
Vas a dibujar las imágenes de una presentación ejecutiva para mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. Este primer documento explica qué es CoopApps: su objetivo, sus principios, su alcance, sus límites, sus aplicaciones, sus usuarios, sus niveles de servicio y sus etapas. El mensaje es: "sabemos exactamente qué vamos a construir, para quién, qué incluye y qué no hace".

Después te voy a pasar otros documentos de la misma presentación; mantené el mismo estilo en todas las imágenes.

Reglas obligatorias:
1. Usá SOLO el contenido del documento. No inventes objetivos, funciones, números ni compromisos. Podés acortar frases sin cambiar su sentido.
2. Texto visible en español de Argentina, formal y claro, sin tecnicismos innecesarios.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px, fondo claro. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento (lo que el sistema hace, lo destacado). Ámbar #B7791F solo para "lo que sigue siendo responsabilidad de la cooperativa" o "a validar". No uses rojo.
5. Tipografía sans serif limpia (Inter o similar). Un título, una frase y bloques ordenados en cuadrícula. Texto de 18 px como mínimo; si no entra, resumí.
6. Orden visual estricto: alineación en cuadrícula, márgenes iguales, el mismo tamaño para todas las tarjetas de una misma imagen y como máximo 3 niveles de jerarquía de texto. Nada de elementos superpuestos ni flechas cruzadas.
7. Estilo sobrio, de consultora, con íconos de línea simples. Nada de robots, cerebros, cohetes ni efectos futuristas.
8. Datos de ejemplo siempre ficticios ("Cooperativa A", "Socio de ejemplo").
9. Después de cada imagen, listá qué secciones del documento usaste.
Voy a pedirte las imágenes por código (IMG-O01, IMG-O02, ...). Esperá mi pedido.
```

---

## 1. Qué es CoopApps

**CoopApps** es una plataforma integral de gestión en la nube, diseñada específicamente para cooperativas de servicios públicos y sociales de la República Argentina. Cubre electricidad, agua, cloacas, gas, Internet, telefonía, televisión, alumbrado público, obras, sepelio, cementerio parque, salud, ambulancias, banco de sangre, vivienda y cualquier otro servicio que la cooperativa preste a su comunidad.

Reúne en una sola herramienta seis bloques:

| Bloque | Qué incluye |
|---|---|
| Gestión comercial y administrativa | Padrón de socios, servicios, medición, tarifas, facturación, impuestos, cobranza, mora, compras, stock, tesorería, contabilidad, sueldos e institucional |
| Atención al socio | Solicitudes, reclamos, turnos, mesa de entradas, canales digitales y asistente inteligente |
| Operación técnica y de campo | Factibilidades, órdenes de trabajo, instalaciones, lecturas, cobranza domiciliaria, redes y mapas |
| Autogestión del socio | Sitio web propio con la marca de la cooperativa y aplicación instalable en el celular para consultar, pagar, reclamar y contratar |
| Relación con la comunidad | Muro de novedades, encuestas, campañas y notificaciones por todos los canales |
| Integración con terceros | Organismo fiscal, bancos, pasarelas de pago, entes recaudadores, reguladores, equipos de red y medidores inteligentes |

Se accede desde cualquier navegador y desde el celular, sin instalar programas en las computadoras de la cooperativa, sin administrar servidores y sin hacer copias de seguridad manuales. Todas las cooperativas usan la misma plataforma, siempre actualizada, y cada una conserva sus datos completamente aislados, su marca, su vocabulario y su configuración.

### 1.1 Cómo está pensado

- **Un único responsable de cada dato.** El padrón, los contratos, los medidores, la cuenta corriente o el stock tienen un solo módulo responsable; los demás consultan esa información y reaccionan a sus cambios, sin copiarla.
- **Todo cambio importante queda explicado.** Cada factura muestra por qué se cobró cada renglón, cada permiso puede explicarse y cada configuración aplicada a un documento queda registrada con su versión.
- **Procesos masivos seguros.** Facturar, enviar avisos, calcular intereses o conciliar se ejecuta en segundo plano, con progreso visible, pausa, reanudación y bandeja de excepciones. Un proceso interrumpido se retoma sin duplicar resultados.
- **El mismo sistema para la oficina, el campo y el socio.** Todos ven la misma información en el mismo momento.

### 1.2 Primer servicio completo y cooperativa piloto

El primer recorrido que se construye de punta a punta es el del servicio de **Internet**:

- contratación;
- factibilidad;
- visita e instalación;
- equipo en comodato;
- activación;
- facturación;
- pago;
- reclamo;
- mora y suspensión;
- baja.

Le siguen los servicios medidos (electricidad, agua, cloacas y gas) y, por último, la gestión administrativa e institucional completa.

La puesta en marcha real se hace con una **cooperativa piloto** que presta servicios medidos. Su reemplazo comercial se hace cuando están listos los servicios medidos, después de dos ciclos de facturación en paralelo aprobados. Su reemplazo administrativo llega al final del plan.

---

## 2. Objetivos

### 2.1 Objetivo general

Brindar a cada cooperativa una plataforma única, segura y configurable que le permita administrar de punta a punta todos sus servicios, su relación con los socios y su gestión interna, con información confiable, trazable y disponible en cualquier momento y lugar.

### 2.2 Catorce objetivos específicos

| N.º | Objetivo | En una línea |
|---|---|---|
| 1 | Unificar la gestión | Una única plataforma en lugar de sistemas aislados, planillas y procesos manuales |
| 2 | Adaptarse a cada cooperativa sin programar | Cada cooperativa habilita sus servicios y configura tarifas, conceptos, impuestos, textos y circuitos, con vigencias e historial |
| 3 | Facturar con exactitud y control | Factura separada o multiservicio, controles previos, autorización fiscal y cero diferencias entre factura, cuenta corriente y contabilidad |
| 4 | Cobrar por todos los canales | Caja, cobradores, débito automático, entes, pasarelas, QR y pago en línea, con imputación automática |
| 5 | Ofrecer una experiencia digital moderna al socio | Registrarse, contratar, pagar, reclamar y seguir sus gestiones desde el celular, con la marca de su cooperativa |
| 6 | Profesionalizar la atención | Expediente único con número de seguimiento, plazos, avisos y medición de satisfacción |
| 7 | Ordenar la operación técnica | Factibilidades, instalaciones, cortes, lecturas y mantenimiento con una aplicación de campo que funciona sin conexión |
| 8 | Cumplir con la normativa | Facturación electrónica, impuestos, regímenes informativos, reguladores, obligaciones laborales y societarias, y datos personales |
| 9 | Garantizar trazabilidad total | Cada operación con autor, fecha y motivo; los documentos económicos nunca se borran |
| 10 | Brindar información para decidir | Tableros por rol, indicadores con definición precisa, reportes programados y consulta asistida por inteligencia artificial dentro de los permisos |
| 11 | Proteger la información | Aislamiento por cooperativa, doble factor, cifrado, copias automáticas y auditoría permanente |
| 12 | Facilitar la transición | Migrar con conciliación, convivir y reemplazar por etapas sin interrumpir la operación |
| 13 | Garantizar la continuidad del servicio | Una caída de ARCA, de un banco o de una pasarela no detiene la atención ni la facturación |
| 14 | Devolver a la cooperativa el control de sus datos | Exportar, integrar y recibir la información completa si deja el servicio |

---

## 3. Principios que guían el sistema

| Principio | Qué significa para la cooperativa |
|---|---|
| Una sola plataforma | Todos los servicios y áreas sobre la misma información; cada cooperativa habilita solo lo que contrata |
| Configuración, no programación | Servicios, tarifas, conceptos, impuestos, textos y circuitos desde pantallas, con vigencias e historial |
| Vocabulario propio | Cada cooperativa elige cómo llamar a las cosas: socio, usuario o asociado; suministro, conexión o servicio |
| Factura a medida | Factura separada por servicio o multiservicio, igualmente completas |
| Nada se borra | Los documentos económicos se anulan o se revierten; todo cambio deja constancia |
| Inteligencia artificial que asiste | Propone, resume, clasifica y sugiere; nunca ejecuta una acción con efectos sin confirmación de una persona |
| El socio primero | Autogestión pensada para el celular, con una tarea principal clara en cada pantalla |
| Seguridad desde el diseño | Datos aislados, credenciales protegidas, doble factor y mínimo privilegio |
| Solicitar no es ejecutar | Un pedido se vuelve un hecho real solo cuando el área responsable lo confirma |
| Un único responsable por dato | Cada información tiene un solo módulo responsable; los demás la consultan sin duplicarla |
| Explicable | El sistema explica por qué cobró un importe, por qué un usuario puede o no hacer algo y qué configuración se aplicó |
| Hecho confirmado | Un corte, una reconexión, una instalación o un pago se registran solo cuando están confirmados en la realidad |
| Datos de tarjeta fuera del sistema | El sistema nunca recibe ni guarda el número completo de una tarjeta, su vencimiento ni su código de seguridad |
| Los datos son de la cooperativa | Puede consultarlos, exportarlos e integrarlos siempre, y recibirlos completos al terminar el servicio |

---

## 4. Alcance

### 4.1 Siete soluciones en una

| Solución | Contenido |
|---|---|
| Gestión comercial y administrativa | Personas y cuentas, catálogo de servicios, medición, tarifas, facturación, fiscal, cuenta corriente, cobranza, mora y financiación, ventas, compras, stock y bienes de uso, tesorería, contabilidad, sueldos, institucional y servicios sociales |
| Atención y relación con el socio | Solicitudes, reclamos, consultas, mesa de entradas, turnero, canales digitales, asistente virtual, inteligencia artificial supervisada y operación técnica en campo |
| Sitio web y autogestión | Sitio público con la marca de la cooperativa, registro, portal y aplicación del socio, pago en línea y comunidad |
| Plataforma | Alta y ciclo de vida de cada cooperativa, licencias por módulo, ambientes de prueba, soporte controlado y monitoreo |
| Cobranza y medios de pago | Cajas, cobradores, entes recaudadores, débitos automáticos, pasarelas, QR y conciliación |
| Liquidación de impuestos | Facturación electrónica, IVA, Ingresos Brutos, percepciones, retenciones, tasas de terceros y regímenes informativos |
| Información e integración | Reportes, tableros, inteligencia de negocio e interfaz para sistemas de terceros |

### 4.2 Alcance completo, sin exclusiones funcionales

El sistema incluye **todas** las funciones que hoy resuelven los sistemas de gestión de cooperativas de servicios, incluidas las menos frecuentes:

- tasación de llamadas telefónicas;
- televisión y vivienda;
- salud, ambulancias, sepelio, cementerio parque y banco de sangre;
- fabricación propia, flota y seguimiento satelital;
- turnero y conexión con equipamiento local (impresoras, lectores, balanzas, pantallas).

**Lo único que no se reproduce son las debilidades técnicas y de seguridad** de los sistemas actuales:

| Lo que no se reproduce | Por qué se reemplaza |
|---|---|
| Instalación en cada computadora y actualizaciones manuales | Plataforma en la nube siempre actualizada |
| Una base de datos separada por cooperativa, administrada por el usuario | La plataforma administra los datos, aislados por cooperativa |
| Contraseñas que pueden descifrarse y usuarios de base de datos compartidos | Contraseñas protegidas que nadie puede leer, y usuarios individuales |
| Claves y credenciales escritas dentro del programa | Bóveda cifrada |
| Portales del socio que funcionan con copias sincronizadas de los datos | Aplicación del socio sobre la misma información que la oficina |
| Parámetros identificados con números sin significado | Parámetros con nombre, explicación y vigencia |
| Menús armados por el programa sin relación con los permisos | Menú generado desde los permisos |
| Números de tarjeta guardados en las bases de la cooperativa | Datos de tarjeta solo en el proveedor de pagos |

### 4.3 Cómo se organizan los módulos

| Grupo | Módulos |
|---|---|
| Socios y servicios | Personas, titulares y cuentas; catálogo de servicios y contratos; medición y consumos |
| Ciclo económico del socio | Tarifas y motor de cálculo; facturación; fiscal e impuestos; cuenta corriente y cobranza; mora, corte y financiación |
| Atención y operación | Atención al socio; técnica, campo y redes; ventas y presupuestos |
| Administración | Compras y proveedores; stock, bienes de uso y fabricación; tesorería y bancos; contabilidad; personal y sueldos |
| Institucional y social | Institucional; servicios sociales y flota |
| Canales digitales | Sitio público y portal del socio; comunidad y comunicaciones |
| Servicios comunes | Reportes, tableros e integración con terceros; trámites, aprobaciones y documentos; configuración y parametrización; marca, vocabulario y experiencia de uso; integraciones externas |
| Plataforma y transición | Administración de la plataforma; migración y puesta en marcha |

### 4.4 Ninguna función se pierde: se conserva mejorada

Cada función de los sistemas de escritorio se reubica en el módulo responsable de su información. Algunos ejemplos:

| Hoy | Con CoopApps |
|---|---|
| Más de mil quinientos parámetros numéricos | Parámetros con nombre claro, explicación, valor por defecto, vigencia e historial |
| Portal del socio con datos copiados | Aplicación que trabaja sobre la misma información que la oficina, en tiempo real |
| Contraseñas recuperables | Contraseñas protegidas que nadie puede leer, y doble factor |
| Credenciales de bancos, pasarelas y equipos de red escritas en el programa | Bóveda cifrada; las heredadas se regeneran en cada proveedor |
| Procesos masivos que podían duplicar resultados | Procesos reanudables que nunca emiten dos veces la misma factura ni registran dos veces el mismo pago |

### 4.5 Servicios que se pueden gestionar

17 familias de servicios, cada una con su configuración, productos, planes, categorías, requisitos, estados y reglas, que conviven en la misma cuenta del socio:

- Internet, telefonía y televisión.
- Electricidad, agua, cloacas y gas.
- Alumbrado público.
- Obras y contribución por mejoras.
- Sepelio, cementerio parque, banco de sangre, salud y ambulancias.
- Vivienda.
- Tasas por cuenta de terceros.
- Capital social.
- Otros servicios: banco ortopédico, dispenser de agua, seguros, vehículos eléctricos, correo, mensajes de texto, ventas, fabricación, traslados y cualquier prestación que defina la cooperativa.

El detalle de cada servicio está en `alcance-especificacion-modulo-por-modulo.md`, sección 3.

---

## 5. Límites del sistema

### 5.1 Lo que el sistema hace y lo que sigue siendo responsabilidad de la cooperativa

| Tema | El sistema hace | Sigue siendo de la cooperativa |
|---|---|---|
| Obligaciones fiscales | Calcula, prepara, valida, registra y concilia; presenta en forma directa solo si existe un servicio oficial y la cooperativa lo activa | La presentación de las declaraciones y la responsabilidad fiscal, con su contador. Generar un archivo no es presentarlo; emitir una instrucción de pago no es pagar |
| Restricciones normativas | Aplica las protecciones que impone la ley (por ejemplo, ante cortes) | Configurar sus condiciones, sin poder desactivar esas protecciones |
| Gestión institucional | Prepara la información de asociados, asambleas, actas y capital, y deja evidencia | Certificar la validez legal de los actos y las decisiones de los órganos sociales |
| Salud y servicios sociales | Gestiona solo lo administrativo | Las historias clínicas, las decisiones clínicas y de aptitud y el despacho de emergencias, que no están en el sistema. Ninguna urgencia queda condicionada por la deuda |
| Cementerio parque | Administra derechos, unidades y actos | El sistema nunca dispone de restos ni de derechos por falta de pago |
| Inteligencia artificial | Propone, clasifica, resume y sugiere; apagada hasta que la cooperativa la acepta; nunca inventa cifras | Toda acción con efectos la confirma una persona con permiso. Nunca ejecuta cobros, cortes, anulaciones, cambios de permisos ni decisiones clínicas; los datos de salud nunca se envían a un proveedor de IA |
| Plazos legales | Trae valores de referencia editables | Validarlos con su asesoría legal antes de la primera aplicación real |
| Datos personales | GoodApps los trata por cuenta de la cooperativa: no los usa para otros fines, no los cede y los devuelve o destruye al terminar | La cooperativa es la responsable de su base y decide las finalidades y la comunicación de incidentes |
| Datos de tarjetas | Nunca los recibe, transmite ni guarda | Se ingresan solo en el formulario del proveedor de pagos, en la terminal certificada o en la procesadora |
| Equipos y cuentas propias | Protege el servicio, los datos y los accesos | El resguardo de computadoras, celulares, correos y claves personales de sus usuarios |

### 5.2 Límites funcionales por diseño

1. **El portal es un canal, no el dueño del proceso.** El socio no cambia tarifas, no aprueba acuerdos excepcionales ni valida un pago por su sola acción.
2. **Ningún dato privado en lo público.** La consulta pública de deuda exige dos datos de identificación y muestra lo mínimo.
3. **Muro editorial.** Publica la cooperativa; los socios leen, reaccionan y comentan.
4. **Votaciones.** Las encuestas no son vinculantes; las votaciones formales van por el módulo institucional.
5. **Deuda y titularidad.** La deuda queda en el titular que la generó; la deuda previa en un domicilio genera una advertencia, nunca un bloqueo.
6. **Visitas técnicas.** El socio ve "En camino", sin seguimiento del técnico en tiempo real.
7. **Factura en cero y total negativo.** Una factura en cero no se emite; un total negativo se resuelve con nota de crédito o crédito a futuro.
8. **Encender no contrata, apagar no borra.** Un módulo desactivado queda en solo consulta del historial.
9. **Altas automáticas.** Solo para servicios obligatorios con fundamento normativo; los opcionales requieren consentimiento.
10. **Una decisión sobre la cooperativa no afecta a sus socios.** Suspender a una cooperativa no da de baja servicios ni borra información.
11. **Acceso por permiso, nunca por coincidencia.** Coincidir en documento, correo o domicilio no da acceso a cuentas ajenas.
12. **Sin contraseñas conocidas por terceros.** No hay contraseñas maestras ni por defecto; el alta y el restablecimiento son siempre por enlace de un solo uso.

### 5.3 Condiciones de funcionamiento

- Requiere Internet, salvo la aplicación de campo, que opera sin conexión y sincroniza al recuperarla. Cobros, anulaciones, configuración e ingreso no se hacen sin conexión.
- El equipamiento local (impresoras, lectores, balanzas, turneros) se conecta mediante un agente local que no abre puertos.
- Los servicios de terceros dependen de cada proveedor; si uno no responde, la operación queda pendiente y el resto sigue funcionando.
- Los costos de SMS y WhatsApp dependen del modelo elegido: proveedor propio o servicio de la plataforma con consumo medido.
- La firma es electrónica con código de un solo uso por defecto; recibos de sueldo y actas pueden llevar firma digital con proveedor licenciado.
- Funciona en las dos últimas versiones de Chrome, Edge, Firefox, Safari y Samsung Internet. Las aplicaciones del celular requieren Android 9 o iOS 16.4 en adelante y están pensadas para equipos de gama baja (2 GB) con conexión lenta. Internet Explorer no está soportado.
- Desde los ambientes de prueba no se emiten comprobantes reales, no se cobra ni se envían mensajes a destinatarios reales.
- Hay una ventana de mantenimiento con aviso previo, fuera de los días críticos de cada cooperativa; las actualizaciones habituales no interrumpen el servicio.

---

## 6. Aplicaciones y canales

| Aplicación | Quiénes la usan | Qué ofrece |
|---|---|---|
| Sistema de gestión web | Personal administrativo, comercial, técnico y directivo | Todos los módulos, la configuración, los reportes y los tableros, con menú según los permisos |
| Aplicación del socio | Titulares, representantes, adherentes y visitantes registrados | Cuentas, servicios, facturas, pagos, consumos, reclamos, solicitudes, turnos y comunidad; se instala con el nombre, el ícono y los colores de la cooperativa |
| Espacio del empleado | Personal de la cooperativa | En la misma aplicación del celular, sin mezclar datos: recibos, firma, vacaciones, licencias, tareas y aprobaciones |
| Aplicación de campo | Técnicos, lecturistas y cobradores | Agenda del día, órdenes, rutas, cobranza, materiales del vehículo, fotos, firma y ubicación; funciona sin conexión |
| Sitio público | Público en general | Información, noticias, servicios, tarifas, registro, consulta y pago sin ingresar, solicitudes de alta y botón de baja |
| Tótem de autogestión | Socios en las oficinas | Turnos, consulta y pago presencial |
| Consola de plataforma | Equipo operador de GoodApps | Alta de cooperativas, licencias, soporte, salud del servicio y tablas comunes |
| Interfaz de integración | Sistemas de terceros autorizados | Acceso controlado para inteligencia de negocio, municipios, federaciones y sistemas propios |
| Agente local | Puestos con equipamiento | Conecta turnero, impresoras, lectores y balanzas, siempre iniciando él la conexión |

**Canales con el socio:** aplicación, sitio, WhatsApp, correo, SMS, notificaciones, chat web, teléfono, redes sociales, ventanilla, mesa de entradas, tótem y la factura impresa. Todas las interacciones quedan en el historial único de la persona.

**Menú del sistema de gestión:** 18 áreas.

- Inicio.
- Socios y cuentas, Servicios y Medición.
- Facturación, Cobranza y Mora.
- Atención, Técnica y Ventas.
- Administración y Personal.
- Institucional y Servicios sociales.
- Comunidad y Sitio y portal.
- Reportes y Configuración.

Cada usuario ve solo las áreas que su rol permite.

**Aplicación del socio:** barra inferior con Inicio, Cuentas y servicios, un botón central "+" (por defecto, Pagar), Gestiones y Comunidad.

---

## 7. Usuarios y cómo se decide qué puede hacer cada uno

### 7.1 Cuatro grandes grupos

| Grupo | Ejemplos de roles |
|---|---|
| Equipo de la plataforma | Superadministrador, operaciones, comercial, soporte de primer y segundo nivel, seguridad y auditoría, privacidad. Ninguno accede a datos de una cooperativa sin un acceso de soporte temporal y auditado |
| Personal de la cooperativa | Administrador, gerente, facturación, cajero, cobrador, tesorero, contador, compras, depósito, técnico, lecturista, supervisores, atención, recursos humanos, secretaría, comunidad, servicios sociales, protección de datos, consejero y síndico |
| Comunidad | Socio titular, representante o autorizado, adherente, visitante registrado, empleado en el portal y proveedor |
| Dispositivos y sistemas | Procesos automáticos, usuario de canal, sistemas externos integrados, asistente virtual e inteligencia artificial, tótem y agente local |

Los roles de la cooperativa son **modelos predefinidos** (40 en total) que cada cooperativa usa tal cual, copia o ajusta. No existen usuarios genéricos compartidos como "caja1".

### 7.2 Cuatro filtros en cada operación

1. **Licencia:** el módulo debe estar contratado.
2. **Activación:** la cooperativa debe haberlo activado.
3. **Rol:** el usuario debe tener el permiso para esa acción.
4. **Alcance de datos:** solo sobre los datos que le corresponden (sucursal, zona, servicio, cuadrilla, depósito o propios).

A esto se suman controles complementarios:

- denegación por defecto;
- separación de funciones (quien solicita no aprueba, quien aprueba no paga);
- autorización de supervisor;
- franja horaria;
- explicador de permisos, que dice por qué algo está habilitado o denegado.

Ocultar un botón no alcanza: los permisos se verifican en el servidor en cada operación.

---

## 8. Niveles de servicio

| Aspecto | Compromiso |
|---|---|
| Disponibilidad | 99,5 % mensual |
| Pérdida máxima de datos ante un incidente grave | Hasta 15 minutos |
| Tiempo máximo de recuperación | 4 horas por cooperativa; 8 horas para la plataforma completa |
| Respuesta de pantallas | 800 milisegundos o menos en el 95 % de las operaciones |
| Facturación masiva | 50.000 suministros en 60 minutos o menos (meta de diseño, a confirmar con la piloto) |
| Capacidad | Cooperativas de hasta 150.000 suministros; plataforma para cien cooperativas, ampliable a trescientas |
| Soporte | Lunes a viernes de 8 a 18; incidentes críticos las 24 horas, todos los días |
| Primera respuesta del soporte | Crítica 1 hora; alta 4 horas hábiles; media 1 día hábil; baja 3 días hábiles |

---

## 9. Contratación y habilitación

- **Paquetes por tamaño** (pequeña, mediana, grande o a medida), con complementos y cupos según los contratos activos.
- **Tres capas independientes:** licencia (qué contrató), activación (qué encendió y en qué modo) y pantallas (qué ve cada usuario).
- **Superar un cupo no detiene la operación:** facturación, cobranza y atención siguen funcionando.
- **Alta de una cooperativa en un día hábil como máximo,** desde la aprobación comercial hasta tener el sistema de gestión habilitado y el sitio publicado con su marca, sin programadores.
- **Estados de la cooperativa:** preparación, prueba, lista para habilitar, operativa, suspendida y cierre. Una función no pasa a producción con un punto obligatorio pendiente ni con datos de demostración.
- **Ambiente de prueba** separado, con servicios de homologación: no se emite, no se cobra ni se envía nada real.
- **Salida:** exportación completa en formatos abiertos con control de integridad, período de solo consulta y destrucción con constancia.
- **Misma versión para todas las cooperativas,** con actualizaciones sin cortes.

---

## 10. Implementación por etapas

Cada etapa entrega funciones completas y utilizables. La etapa n del alcance funcional corresponde a la ola O(n−1) del plan de construcción.

| Etapa | Ola | Contenido | Resultado visible |
|---|---|---|---|
| 1. Fundaciones | O0 | Seguridad, ingreso, aislamiento, auditoría, marca y vocabulario | Cooperativa de demostración con ingreso seguro |
| 2. Plataforma y configuración | O1 | Usuarios, roles, parámetros, tablas maestras, geografía, aprobaciones y documentos | Alta asistida de una cooperativa con su configuración publicada |
| 3. Socios, servicios y portal | O2 | Personas y cuentas, catálogo, sitio, registro, portal, solicitudes y comunidad | Un socio se registra y solicita Internet desde el sitio |
| 4. Técnica de Internet | O3 | Factibilidad, agenda, órdenes, instalación, comodato, stock, campo y aprovisionamiento | El servicio queda instalado y activo |
| 5. Tarifas, facturación y fiscal | O4 | Motor tarifario, facturación, autorización fiscal e impuestos | Primera factura electrónica autorizada |
| 6. Cobranza y tesorería operativa | O5 | Cuenta corriente, caja, pasarelas, débitos, conciliación y contabilidad inicial | Pago en línea imputado y registrado contablemente |
| 7. Mora y atención avanzada | O6 | Mora, corte, reconexión, convenios, IA y atención omnicanal | **Recorrido de Internet completo de punta a punta** |
| 8. Servicios medidos y reemplazo comercial | O7 | Electricidad, agua, cloacas, gas, lecturas, telemedición, prepago, reguladores y obras; paralelo y corte comercial | Facturación de energía con lecturas; reemplazo comercial en la piloto |
| 9. Gestión administrativa | O8 | Compras, stock, tesorería, contabilidad completa y regímenes informativos | Cierre contable mensual |
| 10. Personal y sueldos | O9 | Liquidación propia con todas sus obligaciones | Liquidación mensual con sus declaraciones |
| 11. Institucional y servicios sociales | O10 | Asociados, asambleas, servicios sociales, flota, telefonía, televisión y turnero | Asamblea y servicios sociales operativos |
| 12. Información, integración y reemplazo administrativo | O11 | BI, generador de reportes, interfaz para terceros, pasarelas restantes e históricos | Reemplazo administrativo y apagado del sistema anterior en la piloto |

**Una etapa se da por terminada cuando:**

- sus funciones están construidas, probadas y documentadas;
- cumple los criterios de aceptación y los recorridos de ejemplo;
- las pruebas de aislamiento, permisos y seguridad dan bien;
- los procesos masivos cumplen los tiempos con volúmenes de una cooperativa grande;
- la cooperativa piloto valida el resultado visible.

---

## 11. El alcance en tres frases

- **Qué es:** una plataforma única en la nube para gestionar de punta a punta todos los servicios de una cooperativa, su relación con los socios y su gestión interna.
- **Qué incluye:** todas las funciones que hoy resuelven los sistemas de gestión de cooperativas, sin exclusiones, más la experiencia digital del socio, la comunidad y la integración con terceros.
- **Qué no hace:** no reemplaza las decisiones de la cooperativa, de su contador ni de sus órganos sociales; no toma decisiones clínicas; no guarda datos de tarjetas; y la inteligencia artificial nunca actúa sin una persona.

---

## 12. Lista de imágenes

| Código | Imagen | Secciones |
|---|---|---|
| IMG-O01 | Qué es CoopApps | 1 |
| IMG-O02 | Cómo está pensado | 1.1 |
| IMG-O03 | Objetivo general y 14 objetivos específicos | 2 |
| IMG-O04 | Principios | 3 |
| IMG-O05 | Siete soluciones en una | 4.1 |
| IMG-O06 | Todo lo que hacen hoy, sin sus debilidades | 4.2 |
| IMG-O07 | Ninguna función se pierde | 4.4 |
| IMG-O08 | Cómo se organizan los módulos | 4.3 |
| IMG-O09 | Lo que hace el sistema y lo que sigue siendo de la cooperativa | 5.1 |
| IMG-O10 | Límites por diseño | 5.2 |
| IMG-O11 | Aplicaciones y canales | 6 |
| IMG-O12 | Usuarios y los cuatro filtros | 7 |
| IMG-O13 | Niveles de servicio | 8 |
| IMG-O14 | Contratación y habilitación | 9 |
| IMG-O15 | Doce etapas, cada una con un resultado visible | 10 |
| IMG-O16 | El alcance en tres frases | 11 |

---

## 13. Prompts de imágenes

### IMG-O01 — Qué es CoopApps

```text
Generá IMG-O01 con código.
Título: "Una sola plataforma para toda la cooperativa".
Subtítulo: la primera oración de la sección 1, resumida a una línea.
Seis tarjetas iguales en una cuadrícula de 3 × 2, una por bloque de la tabla de la sección 1, cada una con ícono de línea, el nombre del bloque y una línea de contenido.
Franja inferior en gris claro con tres afirmaciones con tilde verde: "Sin instalar programas" · "Sin administrar servidores" · "Sin copias de seguridad manuales".
```

### IMG-O02 — Cómo está pensado

```text
Generá IMG-O02 con código.
Título: "Cómo está pensado".
Cuatro columnas iguales, una por punto de la sección 1.1, cada una con ícono, título en negrita y una frase.
Debajo, una banda verde suave: "Primer recorrido completo: Internet. Después, servicios medidos. Al final, la gestión administrativa e institucional" (sección 1.2).
```

### IMG-O03 — Objetivos

```text
Generá IMG-O03 con código.
Arriba, en un recuadro destacado: "Objetivo general" y el texto de la sección 2.1.
Debajo, una cuadrícula de 14 tarjetas iguales (7 × 2) con el número, el nombre del objetivo y la columna "En una línea" de la tabla 2.2.
Título: "Para qué se construye".
```

### IMG-O04 — Principios

```text
Generá IMG-O04 con código.
Título: "Los principios que guían el sistema".
Cuadrícula de 14 tarjetas iguales (7 × 2) con ícono, el nombre del principio y una versión de una línea de "Qué significa para la cooperativa" (sección 3).
Destacá con borde verde cuatro tarjetas: "Nada se borra", "Solicitar no es ejecutar", "Hecho confirmado" y "Los datos son de la cooperativa".
```

### IMG-O05 — Siete soluciones en una

```text
Generá IMG-O05 con código: un círculo central "CoopApps" rodeado de siete tarjetas iguales dispuestas en anillo, una por solución de la tabla 4.1, cada una con ícono, nombre y una línea con tres o cuatro elementos del contenido.
Título: "Siete soluciones en una sola plataforma".
Pie: "Cada cooperativa habilita solo lo que contrata y necesita".
```

### IMG-O06 — Todo lo que hacen hoy, sin sus debilidades

```text
Generá IMG-O06 con código: dos mitades.
Izquierda, en verde, "Se incluye todo": el texto de la sección 4.2 y la lista de funciones menos frecuentes como etiquetas (tasación de llamadas, televisión, vivienda, salud, ambulancias, sepelio, cementerio parque, banco de sangre, fabricación, flota, turnero, equipamiento local).
Derecha, en gris, "No se reproduce": las ocho filas de la tabla de la sección 4.2, cada una con "lo que no se reproduce" tachado suavemente y debajo "por qué se reemplaza" en verde.
Título: "Todo lo que hacen hoy los sistemas de cooperativas, sin sus debilidades".
```

### IMG-O07 — Ninguna función se pierde

```text
Generá IMG-O07 con código: cinco filas de antes y después (tabla 4.4), con la columna "Hoy" en gris a la izquierda, una flecha corta y la columna "Con CoopApps" en verde a la derecha.
Título: "Ninguna función se pierde: se conserva mejorada".
```

### IMG-O08 — Cómo se organizan los módulos

```text
Generá IMG-O08 con código: ocho bloques horizontales apilados, uno por grupo de la tabla 4.3, con el nombre del grupo a la izquierda y sus módulos como etiquetas a la derecha. Los dos últimos ("Servicios comunes" y "Plataforma y transición") en gris más oscuro, como base.
Título: "Ocho grupos de módulos sobre una base común".
Pie: "17 familias de servicios conviven en la misma cuenta del socio" (sección 4.5).
```

### IMG-O09 — Lo que hace el sistema y lo que sigue siendo de la cooperativa

```text
Generá IMG-O09 con código: tabla visual de tres columnas con las diez filas de la sección 5.1: "Tema" (con ícono), "El sistema hace" (verde) y "Sigue siendo de la cooperativa" (ámbar). Una línea por celda; resumí si hace falta.
Título: "Límites claros de responsabilidad".
Pie: "Generar un archivo no es presentarlo. Emitir una instrucción de pago no es pagar".
```

### IMG-O10 — Límites por diseño

```text
Generá IMG-O10 con código: doce tarjetas iguales en cuadrícula de 4 × 3, una por límite de la sección 5.2, con un número, el título en negrita y una línea.
Título: "Límites que protegen al socio y a la cooperativa".
```

### IMG-O11 — Aplicaciones y canales

```text
Generá IMG-O11 con código: en el centro, un bloque "Misma información, en el mismo momento". Alrededor, nueve tarjetas iguales, una por aplicación de la tabla de la sección 6, cada una con ícono (computadora, celular, casco, globo, tótem, engranaje, enchufe), nombre, "quiénes la usan" y una línea de "qué ofrece".
Abajo, una franja con los canales del socio como etiquetas pequeñas.
Título: "Nueve aplicaciones sobre una sola información".
```

### IMG-O12 — Usuarios y los cuatro filtros

```text
Generá IMG-O12 con código: dos partes.
Izquierda: cuatro tarjetas apiladas, una por grupo de usuarios de la tabla 7.1, con cuatro o cinco ejemplos de roles cada una; debajo, "40 roles predefinidos que cada cooperativa copia y ajusta".
Derecha: un embudo de cuatro escalones con los filtros de la sección 7.2 (Licencia, Activación, Rol, Alcance de datos), y al pie del embudo "Acción permitida". Al costado, en gris, los controles complementarios.
Título: "Cada persona ve y hace solo lo que le corresponde".
Pie: "Ocultar un botón no alcanza: los permisos se verifican en el servidor en cada operación".
```

### IMG-O13 — Niveles de servicio

```text
Generá IMG-O13 con código: tablero de 8 indicadores grandes en cuadrícula de 4 × 2, uno por fila de la tabla de la sección 8, con el valor grande arriba (por ejemplo, "99,5 %", "15 min", "4 h", "800 ms", "50.000 en 60 min", "150.000 suministros") y el aspecto abajo.
Título: "Niveles de servicio comprometidos".
Pie: "La facturación masiva es una meta de diseño que se confirma con la cooperativa piloto".
```

### IMG-O14 — Contratación y habilitación

```text
Generá IMG-O14 con código: dos partes.
Arriba: tres capas apiladas "Licencia → Activación → Pantallas" con una línea cada una (sección 9).
Abajo: línea de estados de la cooperativa en seis pasos (preparación, prueba, lista para habilitar, operativa, suspendida, cierre), con "operativa" destacada en verde.
Al costado, tres sellos: "Alta en un día hábil, sin programadores", "Superar un cupo no detiene la operación", "Exportación completa al salir".
Título: "Contratar y habilitar, sin sorpresas".
```

### IMG-O15 — Doce etapas

```text
Generá IMG-O15 con código: línea de tiempo horizontal con las 12 etapas de la sección 10, cada una con su número, su nombre corto, su ola (O0 a O11) y, debajo, el "Resultado visible" en una línea.
Marcá con una bandera verde la etapa 7 ("Recorrido de Internet completo de punta a punta"), la 8 ("Reemplazo comercial en la piloto") y la 12 ("Apagado del sistema anterior").
Título: "Doce etapas, cada una con un resultado que se puede ver".
Sin fechas: las etapas no tienen fecha comprometida.
```

### IMG-O16 — El alcance en tres frases

```text
Generá IMG-O16 con código: tres bloques grandes en fila, "Qué es", "Qué incluye" y "Qué no hace", con el texto de la sección 11. El tercero con borde ámbar.
Título: "El alcance, en tres frases".
Pensada como diapositiva de cierre de este bloque.
```

---

## 14. Notas para el presentador

- **Abrir con IMG-O01 y cerrar con IMG-O16.** En el medio, elegir según el público: con gerentes, objetivos (O03) y límites (O09); con técnicos, aplicaciones (O11) y niveles de servicio (O13).
- **Los límites dan confianza.** Mostrar lo que el sistema no hace (O09 y O10) transmite que el alcance está pensado, no inflado.
- **Las etapas no tienen fecha.** Si preguntan cuándo, pasar al documento de plazos: el plazo se calibra con la velocidad real del equipo.
- **Los valores "propuestos" o "por defecto"** (plazos, límites, cupos) son referencias que la cooperativa o su asesoría confirman antes de la primera aplicación real.
