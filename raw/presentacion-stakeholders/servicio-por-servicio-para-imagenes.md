# CoopApps — Servicio por servicio (documento para generar imágenes)

Este documento muestra, para cada uno de los 17 servicios que el sistema permite gestionar, cómo se recorre de punta a punta: cómo se contrata, cómo se mide y calcula, cómo se factura y cobra, qué pasa ante la mora, qué operación técnica requiere y qué reglas protegen al socio. Cada servicio tiene su propia imagen detallada.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuente | Alcance funcional v2.0 (`docs/alcance-funcional/GoodApps-Cooperativas-Alcance-Funcional.md`): sección 5 (servicios, recorrido de punta a punta y opciones comunes), sección 10.2 (catálogo y contratos) y sección 11 (recorridos de Internet, energía, agua, mora, débito y sepelio) |
| Equivalencia | La etapa n del alcance funcional corresponde a la ola O(n−1) del plan de construcción |
| Datos | Todos los nombres e importes de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Si en la conversación ya se pegó `00-objetivos-alcance-y-limites-para-imagenes.md`, subir este documento y pedir directamente las imágenes. Si es una conversación nueva, pegar antes el prompt maestro de la sección 0.1.
2. Pedir las imágenes por código: "Generá IMG-S00", "Generá IMG-S01", etc. (lista en la sección 4).
3. Recomendación: una imagen por mensaje, revisarla y recién después pedir la siguiente.

### 0.1 Prompt maestro (si la conversación es nueva)

```text
Vas a dibujar las imágenes de una presentación ejecutiva. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. Este documento describe, servicio por servicio, cómo CoopApps gestiona cada uno de los 17 servicios de una cooperativa, de la contratación a la baja. El mensaje es: "cada servicio está pensado de punta a punta, con sus reglas y sus protecciones".

Reglas obligatorias:
1. Usá SOLO el contenido del documento. No inventes funciones, reglas, números ni organismos. Podés acortar frases sin cambiar su sentido.
2. Texto visible en español de Argentina, formal y claro.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px, fondo claro. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo para protecciones y advertencias ("nunca se corta", "la deuda solo advierte"). No uses rojo.
5. Tipografía sans serif limpia (Inter o similar). Texto de 18 px como mínimo; si no entra, resumí.
6. Orden visual estricto: cuadrícula, márgenes iguales, tarjetas del mismo tamaño dentro de cada fila y como máximo 3 niveles de jerarquía. Nada superpuesto ni flechas cruzadas.
7. Estilo sobrio, de consultora, con íconos de línea simples. Nada de robots ni efectos futuristas.
8. Datos de ejemplo siempre ficticios ("Cooperativa A", "Socio de ejemplo", importes "ARS 0.000").
9. Después de cada imagen, listá qué secciones del documento usaste.

Todas las imágenes de servicio (IMG-S01 a IMG-S17) usan la misma plantilla, descrita en la sección 3 del documento, para que se vean como una serie. Esperá mi pedido.
```

---

## 1. Visión de conjunto

Cada cooperativa habilita los servicios que presta. Cada servicio tiene su propia configuración, sus productos, planes, categorías, requisitos, estados y reglas, y convive con los demás en la misma cuenta del socio.

| Familia | Servicios | Etapa (ola) |
|---|---|---|
| Conectividad | Internet, telefonía, televisión | Internet: etapas 3 a 7 (O2 a O6). Telefonía y televisión: etapa 11 (O10); telefonía como abono desde la etapa 5 (O4) |
| Servicios medidos | Electricidad, agua, cloacas, gas | Etapa 8 (O7) |
| Servicios urbanos y obras | Alumbrado público, obras y contribución por mejoras | Etapa 8 (O7) |
| Servicios sociales | Sepelio, cementerio parque, banco de sangre, salud y ambulancias, vivienda | Etapa 11 (O10) |
| Conceptos asociados | Tasas por cuenta de terceros, capital social | Tasas: etapa 5 (O4). Capital social: mínimo en la etapa 6 (O5), completo en la etapa 11 (O10) |
| Otros servicios | Banco ortopédico, dispenser de agua, seguros, vehículos eléctricos, correo, mensajes de texto, ventas, fabricación, traslados y cualquier prestación que defina la cooperativa | Según el servicio; pueden facturarse antes como abono fijo con activación manual |

### 1.1 Opciones comunes a todos los servicios

| Opción | Regla |
|---|---|
| Provisorio | Alta transitoria con vencimiento obligatorio, facturable en esa condición |
| Suspensión voluntaria | El socio pausa un servicio por un plazo, solo si la cooperativa lo habilita (deshabilitada por defecto). La reactivación no se anuncia hasta que se confirma en los equipos de red |
| Cambio de plan | Rige desde el período siguiente; inmediato con prorrateo solo si la cooperativa lo habilita. La permanencia mínima nunca impide la baja |
| Cambio de titular y traslado | La deuda anterior queda en el titular saliente; la transferencia crea un contrato nuevo. El traslado exige nueva factibilidad si el servicio la requiere |
| Factura separada o agrupada | Por defecto, una factura por servicio; la multiservicio se activa por grupo, con detalle separado y para un mismo titular. Una factura en cero no se emite |
| Obligatorios y opcionales | Las altas automáticas directas proceden solo en servicios obligatorios con fundamento normativo; los opcionales requieren consentimiento |
| Contratos por punto de prestación | En los medidos, un contrato por punto de suministro; en los no medidos, como Internet, varios contratos iguales en la cuenta |
| Deuda en el domicilio | Se informa como advertencia; no impide iniciar la solicitud |
| Imputación de pagos | Por defecto, primero lo más antiguo y los recargos antes que el capital |
| Botón de baja | Obligatorio y público en Internet, telefonía y televisión; configurable en los demás; no existe en cementerio parque |
| Mora sin afectación cruzada | La deuda de un servicio no habilita la suspensión de otro de la misma cuenta |
| Protecciones normativas | Las protecciones por condición (electrodependencia, salud, establecimientos educativos, entidades públicas), los preavisos y las ventanas que fija la norma no pueden modificarse |
| Datos sensibles | Salud, ambulancias, banco de sangre y sepelio tienen acceso restringido, sin inteligencia artificial por defecto, y no se pueden usar para segmentar campañas |

### 1.2 Reglas del contrato que valen para todos

- El contrato se crea en estado **solicitado** al admitir la solicitud. Solicitar no es ejecutar: una gestión cerrada no cambia por sí sola el contrato ni cancela deuda.
- Un contrato pasa a **activo** solo con titular, cuenta, plan y categoría vigentes, requisitos cumplidos y, en los servicios técnicos, la confirmación técnica de la instalación.
- Un servicio suspendido **no vuelve a activo por el solo registro del pago**: queda en "rehabilitación en trámite" hasta la confirmación técnica.
- **Solicitar la baja nunca genera cargo ni se bloquea por deuda.** La baja conserva facturas, deuda e historia.
- **Apagar un servicio nunca borra** contratos, facturas, deuda ni gestiones.
- Toda modificación de un servicio publicado se hace con **una versión nueva**, aprobada por un segundo usuario cuando es un cambio comercial o fiscal.

---

## 2. Fichas servicio por servicio

Cada ficha tiene: para qué sirve, qué incluye, el recorrido de punta a punta en cinco pasos, las reglas que protegen al socio, lo que ve el socio y la etapa.

### S01 — Internet

**Para qué:** gestionar el servicio de Internet de la contratación a la baja, con activación automática en los equipos de red. Es el **primer servicio que se construye de punta a punta**.

**Incluye:** fibra óptica, inalámbrico y cable; planes y velocidades versionados, con promociones; factibilidad técnica con vigencia; instalación; equipos en comodato identificados por número de serie; activación y corte automáticos en los equipos de red, con respaldo manual; reclamos con los plazos del reglamento de clientes de servicios TIC; botón de baja público y sin cargo; informes a ENACOM.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud desde el sitio o en atención; al admitirla se crea el contrato "solicitado", que avanza con la factibilidad favorable (vigencia de 90 días, uso único) |
| Medición y cálculo | Sin medidor: abono fijo por plan y velocidad, con proporcional desde la activación efectiva |
| Facturación y cobro | Empieza con la activación; la primera factura incluye la fracción del mes, el mes siguiente y la instalación |
| Mora y corte | Avisos con constancia de entrega (sin constancia no hay suspensión); velocidad reducida o corte remoto; reconexión automática al pagar |
| Operación técnica | Factibilidad, visita agendada por el socio, instalación con equipo en comodato y activación automática en los equipos de red |

**Reglas que protegen al socio:**
- Si la visita fracasa, no se factura nada.
- La fecha de activación se registra recién cuando el equipo de red confirma.
- Si se cae un nodo, los reclamos de la zona se agrupan en un incidente y los afectados reciben un aviso masivo.
- Botón de baja sin cargo, sin exigir pagar la deuda ni registrarse; constancia dentro de las 24 horas; retiro del equipo por defecto dentro de los 15 días.

**Lo que ve el socio:** consulta de cobertura, solicitud en línea, elección de día y franja para la visita, factura, pago en línea, reclamo con fotos y seguimiento, botón de baja.

**Etapa:** etapas 3 a 7 (olas O2 a O6). En la etapa 7 el recorrido queda completo.

### S02 — Telefonía

**Para qué:** gestionar la telefonía fija, IP, móvil revendida y prepaga, con tasación de llamadas.

**Incluye:** red física de centrales, cajas y pares; numeración y plan de numeración; importación, depuración de duplicados y tasación de llamadas; planes de descuento; números gratuitos; liquidación a las operadoras por llamadas a celulares; telefonía móvil revendida con importación de la facturación del operador; paquetes de mensajes de texto; prepaga con recargas; número en cuarentena tras la baja; botón de baja.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud con número asignado al contrato; la móvil revendida no requiere visita |
| Medición y cálculo | Abono fijo más la suma de las llamadas tasadas; las gratuitas valen cero |
| Facturación y cobro | Factura separada con detalle de llamadas; la prepaga se cobra por recarga |
| Mora y corte | Bloqueo de llamadas salientes |
| Operación técnica | Reserva de número, posición de caja y par; alta en la central, en muchos casos registrada en forma manual |

**Reglas que protegen al socio:**
- Con mora, las llamadas **entrantes y de emergencia siguen siempre habilitadas**.
- El número queda en cuarentena tras la baja antes de reasignarse.
- Botón de baja público.

**Lo que ve el socio:** detalle de llamadas, factura, recargas, botón de baja.

**Etapa:** como abono en la etapa 5 (O4); con detalle de llamadas en la etapa 11 (O10).

### S03 — Televisión

**Para qué:** gestionar televisión por cable e IPTV con sus paquetes, señales y decodificadores.

**Incluye:** cable e IPTV; decodificadores en comodato y puntos adicionales; paquetes y señales adicionales; aprovisionamiento en el sistema de acceso condicional; liquidación de derechos de señales como costo; botón de baja.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud con paquete, señales adicionales y cantidad de puntos |
| Medición y cálculo | Abono por paquete más un cargo por cada decodificador adicional |
| Facturación y cobro | Instalación en la primera factura; cobro por los canales habituales |
| Mora y corte | Grilla mínima o corte de señal, con reconexión por el mismo sistema |
| Operación técnica | Instalación con decodificadores en comodato y activación de la señal |

**Reglas que protegen al socio:**
- Por mora, la cooperativa puede optar por la grilla mínima en lugar del corte de señal.
- Los decodificadores quedan vinculados al contrato con constancia de entrega y devolución.
- Botón de baja público.

**Lo que ve el socio:** paquete y señales contratadas, equipos asignados, factura, botón de baja.

**Etapa:** etapa 11 (O10).

### S04 — Electricidad

**Para qué:** gestionar la energía eléctrica, el servicio medido más complejo, desde la lectura hasta los informes al regulador.

**Incluye:** medidores, rutas y lecturas; tramos y escalones; demanda contratada y transgresiones (se factura la mayor entre contratada y registrada); factor de potencia; grandes usuarios con condiciones aprobadas; generación distribuida con crédito a favor; compra de energía y balance de pérdidas; telemedición y medidores prepagos; certificado del instalador; suministros provisorios; protección de electrodependientes; ventanas de corte por jurisdicción; informes a ERSeP y a la Secretaría de Energía.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud con certificado del instalador y, si corresponde, constancia de electrodependencia; un contrato por punto de suministro |
| Medición y cálculo | Lecturas por ruta con fotos, telemedición o prepago; tramos, demanda, factor de potencia y generación distribuida |
| Facturación y cobro | Lote por ruta con muestra de control, comparación con el período anterior y aprobación; autorización fiscal y distribución por canal |
| Mora y corte | Solo dentro de las ventanas de corte de la jurisdicción |
| Operación técnica | Conexión con lectura inicial, colocación del medidor y atención de emergencias por riesgo eléctrico |

**Reglas que protegen al socio:**
- **Nunca se corta a un electrodependiente acreditado.**
- Un consumo con excepción bloqueante no se liquida; más de dos estimaciones consecutivas generan una inspección obligatoria.
- Si la energía inyectada supera el consumo, el saldo queda como crédito a favor.
- Los prepagos quedan fuera de las rutas y del ciclo pospago.

**Lo que ve el socio:** consumos e historial, factura, crédito por generación, pago, reclamos.

**Etapa:** etapa 8 (O7), con el reemplazo comercial en la cooperativa piloto.

### S05 — Agua

**Para qué:** gestionar el agua potable, medida o no medida, con cortes que respetan el caudal mínimo vital.

**Incluye:** régimen medido o no medido con fecha efectiva; tramos de consumo; consorcios con medidor general distribuido entre unidades; autolectura opcional; aviso de consumo anómalo por posible pérdida; cortes y restricciones con protecciones normativas; informes al regulador.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud con el inmueble obligatorio y el régimen medido o no medido |
| Medición y cálculo | Lectura o autolectura por tramos, o cálculo con los datos aprobados del inmueble (superficie, frente, zona y coeficientes), sin lecturas inventadas |
| Facturación y cobro | Cargo fijo y tramos; puede haber varios ciclos de agua; en cuenta unificada no se imputa entre servicios por inferencia |
| Mora y corte | Reducción de caudal sin bajar del caudal mínimo vital; interrupción total solo si la concesión lo admite |
| Operación técnica | Conexión domiciliaria o extensión de red; reclamos por pérdidas con fotos |

**Reglas que protegen al socio:**
- **Caudal mínimo vital** (valor propuesto: 50 litros por persona y por día, a validar legalmente).
- El agua es esencial: el caso pasa a revisión de un responsable; con protección acreditada (salud, establecimiento educativo o entidad pública) la evaluación queda bloqueada.
- La deuda de otro servicio nunca habilita por sí sola el corte del agua.
- Sin constancia de entrega de la intimación, el proceso no avanza.
- La reconexión es gratuita por defecto.

**Lo que ve el socio:** consumos, aviso de posible pérdida, autolectura (si está habilitada), factura y pago.

**Etapa:** etapa 8 (O7).

### S06 — Cloacas

**Para qué:** gestionar el servicio cloacal, vinculado al inmueble o al agua, con sus obras de red.

**Incluye:** servicio vinculado al inmueble o al agua; cálculo sobre el consumo de agua de la misma cuenta cuando corresponde; cuotas de obras de red.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud propia |
| Medición y cálculo | Cargo fijo, cálculo sobre el consumo de agua de la misma cuenta o cuota de obra de red |
| Facturación y cobro | Se calcula después del agua cuando usa su consumo |
| Mora y corte | Sin suspensión física: avisos, intereses, convenio y gestión de cobro |
| Operación técnica | Conexión domiciliaria; reclamos por desborde u obstrucción |

**Reglas que protegen al socio:**
- **Nunca se habilita por el solo hecho de tener agua ni se da de baja con ella.**
- **No hay suspensión física por mora.**

**Lo que ve el socio:** servicio en "Mis servicios", factura, cuotas de obra, reclamos.

**Etapa:** etapa 8 (O7).

### S07 — Gas

**Para qué:** gestionar el gas natural por red, el propano por red y el gas envasado, con inspección antes de habilitar.

**Incluye:** las tres modalidades con su configuración; certificado del matriculado, declaración jurada de artefactos e inspección; corrección de volumen; factores de poder calorífico por período; fugas como urgencia crítica; subsidios de Zona Fría; informes al regulador.

| Paso | Qué pasa |
|---|---|
| Contratación | Certificado del matriculado, declaración jurada de artefactos e inspección antes de habilitar |
| Medición y cálculo | Volumen corregido por presión, temperatura y poder calorífico; sin factor del período, el consumo queda bloqueado |
| Facturación y cobro | Recategorización por los últimos 6 o 12 períodos; subsidios de Zona Fría |
| Mora y corte | El pago no rehabilita por sí solo: la reconexión exige una inspección aprobada |
| Operación técnica | Colocación del medidor y guardia de emergencias por fuga |

**Reglas que protegen al socio:**
- **Las fugas son urgencia crítica.**
- No se factura un consumo sin factor de poder calorífico del período.
- La rehabilitación exige inspección aprobada, por seguridad.

**Lo que ve el socio:** declaración jurada de artefactos desde la aplicación, consumos, factura, reclamo de urgencia.

**Etapa:** etapa 8 (O7).

### S08 — Alumbrado público

**Para qué:** cobrar el alumbrado público por cuenta del municipio o como servicio propio, siempre separado y con convenio.

**Incluye:** tasa por cuenta del municipio o servicio propio; alta automática junto con la electricidad; exhibición separada en la factura; convenio obligatorio; lo cobrado es deuda con el municipio hasta la rendición; sigue el estado del suministro principal.

| Paso | Qué pasa |
|---|---|
| Contratación | Nace por regla automática al dar de alta la electricidad; directa solo si es obligatorio con fundamento normativo |
| Medición y cálculo | Importe fijo o porcentaje sobre el consumo eléctrico del suministro principal |
| Facturación y cobro | Bloque separado de terceros; un pago parcial se reparte en proporción entre lo propio y lo del municipio |
| Mora y corte | No se corta por separado; la deuda del municipio no habilita el corte salvo convenio y norma |
| Operación técnica | Reclamos por luminarias apagadas, derivados al municipio o a la cooperativa según el convenio |

**Reglas que protegen al socio:**
- Siempre visible como bloque separado en la factura.
- Lo cobrado nunca es ingreso propio: es deuda con el municipio hasta rendirla.

**Lo que ve el socio:** el renglón separado en la factura y el reclamo por luminarias.

**Etapa:** etapa 8 (O7).

### S09 — Obras y contribución por mejoras

**Para qué:** financiar obras de pavimento, agua, cloacas y alumbrado entre los vecinos beneficiarios, con prorrateo explícito.

**Incluye:** base aprobada por ordenanza, convenio o asamblea; padrón de beneficiarios; prorrateo con criterio explícito (por defecto, metros de frente); planes de cuotas con ajuste de saldo en la última cuota; seguimiento desde la aplicación del socio.

| Paso | Qué pasa |
|---|---|
| Contratación | Un contrato por beneficiario del padrón, creado al aprobar la contribución |
| Medición y cálculo | Cuota según el prorrateo aprobado; la última ajusta el saldo exacto |
| Facturación y cobro | Cada cuota avanza el plan al emitirse y retrocede si se anula |
| Mora y corte | Se puede refinanciar lo vencido con un convenio; no se suspenden otros servicios |
| Operación técnica | Registro de la obra, su costo y su avance |

**Reglas que protegen al socio:**
- El criterio de prorrateo es explícito y aprobado.
- La deuda de una obra no suspende otros servicios.

**Lo que ve el socio:** su plan de cuotas y el avance de la obra.

**Etapa:** etapa 8 (O7).

### S10 — Sepelio

**Para qué:** gestionar el servicio de sepelio con grupo familiar, adherentes, carencias y subsidio por fallecimiento.

**Incluye:** planes con grupo familiar, adherentes y carencias; cuota según cantidad, edad y vínculo; mayoría de edad; subsidio por fallecimiento; prestador y expediente.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud o alta propuesta al activar otro servicio, siempre con consentimiento; alta de adherentes con vínculo y fecha de nacimiento |
| Medición y cálculo | Cuota por cantidad, edad y vínculo de los adherentes vigentes al último día del período; carencia desde el alta de cada adherente (por ejemplo, 90 días) |
| Facturación y cobro | Factura separada o talón conjunto con otros servicios si la cooperativa lo configura |
| Mora y corte | La deuda solo advierte |
| Operación técnica | Caso de sepelio con prestador, traslado e inhumación; subsidio aprobado por otro usuario y pagado por tesorería |

**Reglas que protegen al socio:**
- **Nunca se rechaza una prestación urgente por deuda.**
- Un adherente con discapacidad acreditada nunca se da de baja por edad.
- Los casos son confidenciales y no se usan para segmentar campañas.
- La historia del grupo nunca se borra.

**Lo que ve el socio:** "Mi grupo" con sus adherentes y coberturas.

**Etapa:** etapa 11 (O10).

### S11 — Cementerio parque

**Para qué:** administrar las unidades de sepultura, sus derechos y sus actos.

**Incluye:** unidades, derechos, titulares y autorizados; inhumaciones, exhumaciones, reducciones y traslados; reserva con vencimiento; adquisición al contado o en cuotas; mantenimiento periódico y cargos por acto; libros exportables; buscador público de difuntos opcional.

| Paso | Qué pasa |
|---|---|
| Contratación | Reserva con vencimiento y formalización con instrumento y documentación |
| Medición y cálculo | Precio de adquisición al contado o en cuotas, mantenimiento periódico y cargo por acto |
| Facturación y cobro | Mantenimiento en el ciclo del servicio y actos como cargos facturables |
| Mora y corte | La mora no cancela el derecho, no libera la unidad ni corta otros servicios |
| Operación técnica | Agenda de actos con autorización y documentación previas |

**Reglas que protegen al socio:**
- **El sistema nunca dispone de restos ni de derechos por falta de pago.**
- No existe baja por botón.

**Lo que ve el socio:** sus derechos, cuotas y mantenimiento; buscador público de difuntos si la cooperativa lo habilita.

**Etapa:** etapa 11 (O10).

### S12 — Banco de sangre

**Para qué:** gestionar la adhesión y la cobertura por convenio, sin datos clínicos.

**Incluye:** adhesión del titular, su grupo y beneficiarios; gestión administrativa de solicitudes; campañas de donación.

| Paso | Qué pasa |
|---|---|
| Contratación | Adhesión a un convenio |
| Medición y cálculo | Gratuito, financiado por la cooperativa o con un aporte fijo; nunca un precio por unidad de sangre |
| Facturación y cobro | Con importe cero no se emite factura |
| Mora y corte | La deuda no condiciona ninguna respuesta |
| Operación técnica | Solicitudes administrativas canalizadas al prestador y campañas de donación |

**Reglas que protegen al socio:**
- **Nunca se cobra la sangre al receptor.**
- Sin datos clínicos en el sistema.
- La deuda no condiciona ninguna respuesta.

**Lo que ve el socio:** su cobertura y las campañas de donación.

**Etapa:** etapa 11 (O10).

### S13 — Salud y ambulancias

**Para qué:** gestionar lo administrativo de la cobertura de salud y los traslados.

**Incluye:** prestadores y profesionales; traslados programados con móviles y choferes habilitados; autorizaciones por convenio y topes por plan; datos sensibles protegidos.

| Paso | Qué pasa |
|---|---|
| Contratación | Contrato con grupo de cobertura y plan con topes |
| Medición y cálculo | Cuota del grupo; traslados no cubiertos por kilómetro o importe fijo, con coseguro |
| Facturación y cobro | El traslado no cubierto se factura al cerrar el viaje |
| Mora y corte | La deuda no decide prestaciones sanitarias ni rechaza un traslado urgente |
| Operación técnica | Agenda de traslados con móvil y chofer habilitados, ejecutados desde la aplicación de campo |

**Reglas que protegen al socio:**
- **Las emergencias se derivan al prestador habilitado.**
- Las historias clínicas y las decisiones clínicas no están en el sistema.
- Los datos de salud nunca se envían a un proveedor de inteligencia artificial.

**Lo que ve el socio:** su grupo, su plan y sus traslados.

**Etapa:** etapa 11 (O10).

### S14 — Vivienda

**Para qué:** gestionar planes de vivienda, desde la inscripción hasta la construcción por etapas.

**Incluye:** planes y tipologías; inscripción y adjudicación; aportes porcentuales sobre el precio vigente de la tipología; comprobante exclusivo; construcción por etapas con materiales y vales; certificados; transferencias y rescisión.

| Paso | Qué pasa |
|---|---|
| Contratación | Inscripción en un plan con tipología; un solo plan por cuenta |
| Medición y cálculo | Aporte porcentual sobre el precio vigente de la tipología, con tope al 100 % |
| Facturación y cobro | Comprobante exclusivo de vivienda; cada pago aumenta el porcentaje aportado |
| Mora y corte | Mora configurable por meses adeudados; el plan no se reconecta como un servicio de red |
| Operación técnica | Construcción por etapas, vales de materiales y certificados aprobados por otro usuario |

**Reglas que protegen al socio:**
- El aporte se expresa en porcentaje del precio vigente, con tope al 100 %.
- Los certificados los aprueba un usuario distinto del que los carga.

**Lo que ve el socio:** su porcentaje aportado y el avance de la construcción.

**Etapa:** etapa 11 (O10).

### S15 — Tasas por cuenta de terceros

**Para qué:** cobrar tasas municipales, fondos y otros conceptos por cuenta y orden de terceros, con rendición.

**Incluye:** siempre asociadas a un servicio propio; convenio obligatorio; bloque separado en la factura; deuda con el tercero y rendición; cobro de comprobantes del tercero por código de barras.

| Paso | Qué pasa |
|---|---|
| Contratación | No se contratan: acompañan al servicio propio que admite el convenio |
| Medición y cálculo | Regla de tipo impuesto vinculada a un tributo aprobado; sin convenio, el renglón queda observado |
| Facturación y cobro | Bloque separado; lo cobrado es deuda con el tercero hasta su rendición |
| Mora y corte | Por defecto no integra el saldo que habilita la suspensión; recargos solo si el convenio los define |
| Operación técnica | No requiere |

**Reglas que protegen al socio:**
- **Nunca se cobran solas.**
- Por defecto, la deuda de una tasa no habilita la suspensión del servicio.

**Lo que ve el socio:** el bloque de terceros separado en su factura.

**Etapa:** etapa 5 (O4).

### S16 — Capital social

**Para qué:** facturar e integrar las cuotas sociales, separadas de la deuda por servicios.

**Incluye:** cuotas sociales como renglón identificado; registro propio separado de la deuda; integración proporcional a lo pagado.

| Paso | Qué pasa |
|---|---|
| Contratación | Suscripción al facturar, al activar un servicio o al aprobar el ingreso, según la configuración |
| Medición y cálculo | No es precio: el importe lo define la regla de suscripción |
| Facturación y cobro | Renglón "Cuota social" con leyenda; integración proporcional a cada pago |
| Mora y corte | Puede excluir del padrón sobre un umbral, pero no suspende servicios |
| Operación técnica | No requiere |

**Reglas que protegen al socio:**
- **La deuda de capital no suspende servicios.**
- Nunca se mezcla con el abono.

**Lo que ve el socio:** el renglón "Cuota social" y su estado de cuenta de capital.

**Etapa:** mínimo en la etapa 6 (O5); completo en la etapa 11 (O10).

### S17 — Otros servicios

**Para qué:** que la cooperativa ofrezca cualquier prestación propia sin programar.

**Incluye:** banco ortopédico, dispenser de agua, seguros y adhesiones, registración de vehículos eléctricos, correo electrónico, paquetes de mensajes de texto, ventas de productos, fabricación (postes, bloques, tableros, pilares), traslados y fletes, y cualquier otra prestación que defina la cooperativa.

| Paso | Qué pasa |
|---|---|
| Contratación | Solicitud tipificada; un servicio sin ficha completa confirmada no admite contratos |
| Medición y cálculo | Abono o cargo por evento; en el dispenser, excedente según los litros del mes |
| Facturación y cobro | Factura separada; los depósitos de garantía se registran como deuda con el socio |
| Mora y corte | Dispenser: la deuda a una cantidad de días bloquea nuevos retiros |
| Operación técnica | Préstamo, devolución y mantenimiento de elementos ortopédicos; retiros de dispenser con límite diario |

**Reglas que protegen al socio:**
- El depósito de garantía es deuda de la cooperativa con el socio.
- Ningún servicio se ofrece sin ficha completa confirmada.

**Lo que ve el socio:** el servicio en "Mis servicios", su factura y sus solicitudes.

**Etapa:** según el servicio; pueden facturarse como abono fijo con activación manual.

---

## 3. Plantilla común de las imágenes de servicio (IMG-S01 a IMG-S17)

Todas las imágenes de servicio usan esta misma disposición, para que se lean como una serie:

| Zona | Posición | Contenido |
|---|---|---|
| Encabezado | Franja superior, 12 % del alto | A la izquierda, ícono de línea del servicio y el nombre en grande. A la derecha, una etiqueta con la familia y otra con la etapa y la ola. Debajo del nombre, la frase "Para qué" en una línea |
| Recorrido | Banda central, 35 % del alto | Cinco tarjetas iguales en fila, unidas por flechas cortas horizontales: Contratación → Medición y cálculo → Facturación y cobro → Mora y corte → Operación técnica. Cada tarjeta con ícono, título y dos líneas tomadas de la tabla de la ficha. Si un paso dice "No requiere", la tarjeta va en gris claro con ese texto |
| Qué incluye | Abajo a la izquierda, 45 % del ancho | Las funciones de "Incluye" como etiquetas tipo píldora, en 3 o 4 filas |
| Reglas que protegen | Abajo al centro, 30 % del ancho | Las reglas de la ficha con un escudo o tilde; las reglas en negrita de la ficha van con borde ámbar |
| Lo que ve el socio | Abajo a la derecha, 25 % del ancho | Silueta simple de un celular con 3 o 4 renglones de la aplicación del socio (datos ficticios: "Cooperativa A", "ARS 0.000") |
| Pie | Franja inferior | "CoopApps · Servicio por servicio · S0x de 17" |

---

## 4. Lista de imágenes

| Código | Imagen | Fuente |
|---|---|---|
| IMG-S00 | Los 17 servicios en una cuenta | Sección 1 |
| IMG-S00B | Opciones y reglas comunes a todos los servicios | Secciones 1.1 y 1.2 |
| IMG-S01 | Internet | Ficha S01 |
| IMG-S02 | Telefonía | Ficha S02 |
| IMG-S03 | Televisión | Ficha S03 |
| IMG-S04 | Electricidad | Ficha S04 |
| IMG-S05 | Agua | Ficha S05 |
| IMG-S06 | Cloacas | Ficha S06 |
| IMG-S07 | Gas | Ficha S07 |
| IMG-S08 | Alumbrado público | Ficha S08 |
| IMG-S09 | Obras y contribución por mejoras | Ficha S09 |
| IMG-S10 | Sepelio | Ficha S10 |
| IMG-S11 | Cementerio parque | Ficha S11 |
| IMG-S12 | Banco de sangre | Ficha S12 |
| IMG-S13 | Salud y ambulancias | Ficha S13 |
| IMG-S14 | Vivienda | Ficha S14 |
| IMG-S15 | Tasas por cuenta de terceros | Ficha S15 |
| IMG-S16 | Capital social | Ficha S16 |
| IMG-S17 | Otros servicios | Ficha S17 |
| IMG-S18 | Cómo se protege al socio en cada servicio | Reglas de todas las fichas |

---

## 5. Prompts de imágenes

### IMG-S00 — Los 17 servicios en una cuenta

```text
Generá IMG-S00 con código.
Título: "17 servicios, una sola cuenta del socio".
Subtítulo: "Cada cooperativa habilita los que presta; cada servicio tiene su configuración, planes, reglas y estados".
En el centro, una tarjeta "Cuenta del socio de ejemplo — Cooperativa A".
Alrededor, seis grupos (tabla de la sección 1), cada uno como un recuadro con su nombre y las tarjetas pequeñas de sus servicios, con ícono y nombre:
- Conectividad: Internet, Telefonía, Televisión.
- Servicios medidos: Electricidad, Agua, Cloacas, Gas.
- Servicios urbanos y obras: Alumbrado público, Obras y contribución por mejoras.
- Servicios sociales: Sepelio, Cementerio parque, Banco de sangre, Salud y ambulancias, Vivienda.
- Conceptos asociados: Tasas por cuenta de terceros, Capital social.
- Otros servicios: Banco ortopédico, Dispenser de agua, Seguros, Vehículos eléctricos, Fabricación y más.
Cada grupo lleva una etiqueta pequeña con su etapa (por ejemplo, "Etapa 8 · O7").
Destacá Internet en verde con la etiqueta "Primer servicio completo".
Pie: "Factura separada por servicio o multiservicio, igualmente completas".
```

### IMG-S00B — Opciones y reglas comunes

```text
Generá IMG-S00B con código: dos partes.
Izquierda (60 %): "Opciones comunes a todos los servicios", una cuadrícula de 4 × 3 con 12 tarjetas iguales tomadas de la tabla 1.1 (Provisorio, Suspensión voluntaria, Cambio de plan, Cambio de titular y traslado, Factura separada o agrupada, Obligatorios y opcionales, Contratos por punto de prestación, Deuda en el domicilio, Imputación de pagos, Botón de baja, Mora sin afectación cruzada, Protecciones normativas), cada una con título y una línea.
Derecha (40 %): "Reglas del contrato", la línea de estados "Solicitado → Activo → Suspendido → Rehabilitación en trámite → Baja" en vertical, y al costado las seis reglas de la sección 1.2 con tilde verde.
Abajo, una franja ámbar: "Datos sensibles: salud, ambulancias, banco de sangre y sepelio con acceso restringido, sin IA por defecto y sin uso para campañas".
Título: "Lo que vale para todos los servicios".
```

### IMG-S01 — Internet

```text
Generá IMG-S01 con código usando la plantilla de la sección 3.
Encabezado: ícono de router o señal; "Internet"; etiquetas "Conectividad" y "Etapas 3 a 7 · O2 a O6"; frase: "De la solicitud a la baja, con activación automática en los equipos de red". Agregá una cinta verde: "Primer servicio completo".
Recorrido (cinco tarjetas):
1. Contratación: "Solicitud en el sitio o en atención · Contrato 'solicitado' · Factibilidad con vigencia de 90 días".
2. Medición y cálculo: "Sin medidor · Abono por plan y velocidad · Proporcional desde la activación".
3. Facturación y cobro: "Empieza con la activación · 1.ª factura: fracción del mes + mes siguiente + instalación".
4. Mora y corte: "Avisos con constancia de entrega · Velocidad reducida o corte remoto · Reconexión automática al pagar".
5. Operación técnica: "Visita agendada por el socio · Equipo en comodato por número de serie · Activación automática".
Qué incluye (píldoras): Fibra óptica, Inalámbrico, Cable, Planes versionados, Promociones, Factibilidad, Comodato, Activación automática, Respaldo manual, Reglamento TIC, Botón de baja, Informes a ENACOM.
Reglas que protegen: "Si la visita fracasa, no se factura" · "Activación registrada solo cuando el equipo confirma" · "Caída de nodo: incidente único y aviso masivo" · en ámbar: "Botón de baja sin cargo y sin exigir la deuda; constancia en 24 h".
Lo que ve el socio (celular): "Cobertura disponible", "Elegí día y franja de visita", "Factura ARS 0.000 · Pagar", "Reclamo #0000 · En curso".
```

### IMG-S02 — Telefonía

```text
Generá IMG-S02 con código usando la plantilla de la sección 3.
Encabezado: ícono de teléfono; "Telefonía"; etiquetas "Conectividad" y "Abono: etapa 5 · O4 | Detalle de llamadas: etapa 11 · O10"; frase: "Fija, IP, móvil revendida y prepaga, con tasación de llamadas".
Recorrido:
1. Contratación: "Número asignado al contrato · La móvil revendida no requiere visita".
2. Medición y cálculo: "Abono fijo + llamadas tasadas · Las gratuitas valen cero".
3. Facturación y cobro: "Factura separada con detalle de llamadas · Prepaga por recarga".
4. Mora y corte: "Bloqueo de llamadas salientes".
5. Operación técnica: "Reserva de número, caja y par · Alta en la central".
Qué incluye: Fija e IP, Centrales, cajas y pares, Plan de numeración, Tasación, Depuración de duplicados, Planes de descuento, Números gratuitos, Liquidación a operadoras, Móvil revendida, Mensajes de texto, Prepaga con recargas, Botón de baja.
Reglas que protegen: en ámbar: "Con mora, las entrantes y las de emergencia siguen habilitadas" · "Número en cuarentena tras la baja" · "Botón de baja público".
Lo que ve el socio: "Detalle de llamadas del mes", "Factura ARS 0.000", "Recargar saldo", "Botón de baja".
```

### IMG-S03 — Televisión

```text
Generá IMG-S03 con código usando la plantilla de la sección 3.
Encabezado: ícono de pantalla; "Televisión"; etiquetas "Conectividad" y "Etapa 11 · O10"; frase: "Cable e IPTV con paquetes, señales y decodificadores".
Recorrido:
1. Contratación: "Paquete, señales adicionales y cantidad de puntos".
2. Medición y cálculo: "Abono por paquete + cargo por decodificador adicional".
3. Facturación y cobro: "Instalación en la primera factura · Canales de cobro habituales".
4. Mora y corte: "Grilla mínima o corte de señal · Reconexión por el mismo sistema".
5. Operación técnica: "Instalación con decodificadores en comodato · Activación de la señal".
Qué incluye: Cable, IPTV, Paquetes, Señales adicionales, Puntos adicionales, Decodificadores en comodato, Acceso condicional, Derechos de señales como costo, Botón de baja.
Reglas que protegen: "Por mora, grilla mínima en lugar del corte, si la cooperativa lo elige" · "Decodificadores con constancia de entrega y devolución" · en ámbar: "Botón de baja público".
Lo que ve el socio: "Mi paquete: Básico de ejemplo", "2 decodificadores", "Factura ARS 0.000", "Botón de baja".
```

### IMG-S04 — Electricidad

```text
Generá IMG-S04 con código usando la plantilla de la sección 3.
Encabezado: ícono de rayo o medidor; "Electricidad"; etiquetas "Servicios medidos" y "Etapa 8 · O7"; frase: "De la lectura al informe al regulador, con generación distribuida y grandes usuarios". Cinta gris: "Reemplazo comercial en la cooperativa piloto".
Recorrido:
1. Contratación: "Certificado del instalador · Constancia de electrodependencia si corresponde · Un contrato por punto de suministro".
2. Medición y cálculo: "Lecturas por ruta con fotos, telemedición o prepago · Tramos, demanda, factor de potencia, generación".
3. Facturación y cobro: "Lote por ruta con muestra de control y aprobación · Autorización fiscal".
4. Mora y corte: "Solo dentro de las ventanas de corte de la jurisdicción".
5. Operación técnica: "Conexión con lectura inicial · Medidor · Emergencias por riesgo eléctrico".
Qué incluye: Rutas y lecturas, Tramos y escalones, Demanda contratada, Transgresiones, Factor de potencia, Grandes usuarios, Generación distribuida, Compra de energía, Balance de pérdidas, Telemedición, Prepago, Suministros provisorios, Informes a ERSeP, Informes a la Secretaría de Energía.
Reglas que protegen: en ámbar: "Nunca se corta a un electrodependiente acreditado" · "Consumo con excepción bloqueante no se liquida" · "Más de 2 estimaciones seguidas: inspección obligatoria" · "Inyección mayor que el consumo: crédito a favor".
Lo que ve el socio: "Consumo del mes: 000 kWh", "Comparación con el mes anterior", "Crédito por generación ARS 0.000", "Factura · Pagar".
```

### IMG-S05 — Agua

```text
Generá IMG-S05 con código usando la plantilla de la sección 3.
Encabezado: ícono de gota; "Agua"; etiquetas "Servicios medidos" y "Etapa 8 · O7"; frase: "Medida o no medida, con cortes que respetan el caudal mínimo vital".
Recorrido:
1. Contratación: "Inmueble obligatorio · Régimen medido o no medido".
2. Medición y cálculo: "Lectura o autolectura por tramos · O cálculo con datos aprobados del inmueble, sin lecturas inventadas".
3. Facturación y cobro: "Cargo fijo y tramos · Varios ciclos posibles · Sin imputación entre servicios por inferencia".
4. Mora y corte: "Reducción de caudal sin bajar del mínimo vital · Interrupción solo si la concesión lo admite".
5. Operación técnica: "Conexión domiciliaria o extensión de red · Reclamos por pérdidas con fotos".
Qué incluye: Medido y no medido, Tramos de consumo, Consorcios con medidor general, Autolectura opcional, Aviso de posible pérdida, Restricciones con protecciones, Informes al regulador.
Reglas que protegen: en ámbar: "Caudal mínimo vital: 50 l por persona y por día (valor propuesto, a validar)" · en ámbar: "Con protección acreditada (salud, escuela, entidad pública), no se evalúa el corte" · "La deuda de otro servicio nunca habilita el corte del agua" · "Sin constancia de la intimación, el proceso no avanza" · "Reconexión gratuita por defecto".
Lo que ve el socio: "Consumo: 00 m³", "Aviso: posible pérdida", "Informar autolectura", "Factura ARS 0.000 · Pagar".
```

### IMG-S06 — Cloacas

```text
Generá IMG-S06 con código usando la plantilla de la sección 3.
Encabezado: ícono de caño; "Cloacas"; etiquetas "Servicios medidos" y "Etapa 8 · O7"; frase: "Vinculado al inmueble o al agua, con sus obras de red".
Recorrido:
1. Contratación: "Solicitud propia".
2. Medición y cálculo: "Cargo fijo, sobre el consumo de agua de la misma cuenta o cuota de obra".
3. Facturación y cobro: "Se calcula después del agua cuando usa su consumo".
4. Mora y corte: "Sin suspensión física · Avisos, intereses, convenio y gestión de cobro".
5. Operación técnica: "Conexión domiciliaria · Reclamos por desborde u obstrucción".
Qué incluye: Vinculado al inmueble, Vinculado al agua, Cálculo sobre el consumo de agua, Cuotas de obras de red, Convenios de pago.
Reglas que protegen: en ámbar: "Nunca se habilita por tener agua ni se da de baja con ella" · en ámbar: "Sin suspensión física por mora".
Lo que ve el socio: "Cloacas · Activo", "Cuota de obra 03 de 12", "Factura ARS 0.000", "Reclamo por obstrucción".
```

### IMG-S07 — Gas

```text
Generá IMG-S07 con código usando la plantilla de la sección 3.
Encabezado: ícono de llama; "Gas"; etiquetas "Servicios medidos" y "Etapa 8 · O7"; frase: "Gas natural por red, propano por red y envasado, con inspección antes de habilitar".
Recorrido:
1. Contratación: "Certificado del matriculado · Declaración jurada de artefactos · Inspección".
2. Medición y cálculo: "Volumen corregido por presión, temperatura y poder calorífico · Sin factor del período, consumo bloqueado".
3. Facturación y cobro: "Recategorización por los últimos 6 o 12 períodos · Subsidios de Zona Fría".
4. Mora y corte: "El pago no rehabilita solo: hace falta inspección aprobada".
5. Operación técnica: "Medidor · Guardia de emergencias por fuga".
Qué incluye: Gas natural, Propano por red, Gas envasado, Matriculado, Declaración de artefactos, Inspección, Corrección de volumen, Poder calorífico, Zona Fría, Informes al regulador.
Reglas que protegen: en ámbar: "Las fugas son urgencia crítica" · "No se factura sin factor de poder calorífico del período" · "Rehabilitación solo con inspección aprobada".
Lo que ve el socio: "Declarar artefactos", "Consumo: 00 m³", "Factura ARS 0.000", "Urgencia: olor a gas".
```

### IMG-S08 — Alumbrado público

```text
Generá IMG-S08 con código usando la plantilla de la sección 3.
Encabezado: ícono de farola; "Alumbrado público"; etiquetas "Servicios urbanos y obras" y "Etapa 8 · O7"; frase: "Por cuenta del municipio o servicio propio, siempre separado y con convenio".
Recorrido:
1. Contratación: "Nace automáticamente con la electricidad · Directa solo si es obligatorio por norma".
2. Medición y cálculo: "Importe fijo o porcentaje sobre el consumo eléctrico".
3. Facturación y cobro: "Bloque separado de terceros · Pago parcial repartido en proporción".
4. Mora y corte: "No se corta por separado".
5. Operación técnica: "Reclamos por luminarias apagadas, al municipio o a la cooperativa según convenio".
Qué incluye: Tasa municipal, Servicio propio, Alta automática, Convenio obligatorio, Bloque separado, Rendición al municipio, Sigue al suministro principal.
Reglas que protegen: "Siempre visible separado en la factura" · "Lo cobrado es deuda con el municipio hasta rendirla" · en ámbar: "La deuda del municipio no habilita el corte salvo convenio y norma".
Lo que ve el socio: una factura de ejemplo con el bloque "Por cuenta de terceros: Alumbrado ARS 0.000" separado, y "Reclamar luminaria".
```

### IMG-S09 — Obras y contribución por mejoras

```text
Generá IMG-S09 con código usando la plantilla de la sección 3.
Encabezado: ícono de pavimento o cono de obra; "Obras y contribución por mejoras"; etiquetas "Servicios urbanos y obras" y "Etapa 8 · O7"; frase: "Pavimento, agua, cloacas y alumbrado financiados entre los beneficiarios".
Recorrido:
1. Contratación: "Un contrato por beneficiario, creado al aprobar la contribución".
2. Medición y cálculo: "Cuota según el prorrateo aprobado (por defecto, metros de frente)".
3. Facturación y cobro: "Cada cuota avanza el plan · Si se anula, retrocede · Última cuota ajusta el saldo".
4. Mora y corte: "Refinanciación con convenio · No suspende otros servicios".
5. Operación técnica: "Registro de la obra, su costo y su avance".
Qué incluye: Pavimento, Redes de agua, Cloacas, Alumbrado, Base por ordenanza, convenio o asamblea, Padrón de beneficiarios, Prorrateo explícito, Plan de cuotas.
Reglas que protegen: "Criterio de prorrateo explícito y aprobado" · en ámbar: "La deuda de la obra no suspende otros servicios".
Lo que ve el socio: "Obra: Pavimento calle de ejemplo", "Avance 60 %", "Cuota 05 de 24 · ARS 0.000".
```

### IMG-S10 — Sepelio

```text
Generá IMG-S10 con código usando la plantilla de la sección 3.
Encabezado: ícono de grupo familiar; "Sepelio"; etiquetas "Servicios sociales" y "Etapa 11 · O10"; frase: "Grupo familiar, adherentes, carencias y subsidio por fallecimiento". Agregá un candado pequeño con "Datos sensibles".
Recorrido:
1. Contratación: "Solicitud o propuesta al activar otro servicio, con consentimiento · Alta de adherentes".
2. Medición y cálculo: "Cuota por cantidad, edad y vínculo · Carencia desde el alta de cada adherente".
3. Facturación y cobro: "Factura separada o talón conjunto, según configuración".
4. Mora y corte: "La deuda solo advierte".
5. Operación técnica: "Caso con prestador, traslado e inhumación · Subsidio aprobado por otro usuario".
Qué incluye: Grupo familiar, Adherentes, Carencias, Mayoría de edad, Subsidio por fallecimiento, Prestador, Expediente.
Reglas que protegen: en ámbar: "Nunca se rechaza una prestación urgente por deuda" · "Adherente con discapacidad acreditada: nunca baja por edad" · "Casos confidenciales, sin uso para campañas" · "La historia del grupo nunca se borra".
Lo que ve el socio: "Mi grupo: 4 integrantes", "Cobertura vigente", "Cuota ARS 0.000".
Tono visual especialmente sobrio y respetuoso.
```

### IMG-S11 — Cementerio parque

```text
Generá IMG-S11 con código usando la plantilla de la sección 3.
Encabezado: ícono de árbol o parcela; "Cementerio parque"; etiquetas "Servicios sociales" y "Etapa 11 · O10"; frase: "Unidades, derechos y actos, con su documentación".
Recorrido:
1. Contratación: "Reserva con vencimiento · Formalización con instrumento y documentación".
2. Medición y cálculo: "Adquisición al contado o en cuotas · Mantenimiento periódico · Cargo por acto".
3. Facturación y cobro: "Mantenimiento en el ciclo del servicio · Actos como cargos".
4. Mora y corte: "La mora no cancela el derecho, no libera la unidad ni corta otros servicios".
5. Operación técnica: "Agenda de actos con autorización y documentación previas".
Qué incluye: Unidades de sepultura, Derechos, Titulares y autorizados, Inhumaciones, Exhumaciones, Reducciones, Traslados, Reserva, Mantenimiento, Libros exportables, Buscador público opcional.
Reglas que protegen: en ámbar: "El sistema nunca dispone de restos ni de derechos por falta de pago" · "Sin baja por botón".
Lo que ve el socio: "Mis derechos: Unidad de ejemplo", "Mantenimiento ARS 0.000", "Buscador de difuntos".
Tono visual especialmente sobrio y respetuoso.
```

### IMG-S12 — Banco de sangre

```text
Generá IMG-S12 con código usando la plantilla de la sección 3.
Encabezado: ícono de gota con cruz; "Banco de sangre"; etiquetas "Servicios sociales" y "Etapa 11 · O10"; frase: "Adhesión y cobertura por convenio, sin datos clínicos". Candado pequeño "Datos sensibles".
Recorrido:
1. Contratación: "Adhesión del titular, su grupo y beneficiarios a un convenio".
2. Medición y cálculo: "Gratuito, financiado o aporte fijo · Nunca precio por unidad".
3. Facturación y cobro: "Con importe cero no se emite factura".
4. Mora y corte: "La deuda no condiciona ninguna respuesta".
5. Operación técnica: "Solicitudes al prestador · Campañas de donación".
Qué incluye: Adhesión, Grupo y beneficiarios, Convenio, Solicitudes administrativas, Campañas de donación.
Reglas que protegen: en ámbar: "Nunca se cobra la sangre al receptor" · "Sin datos clínicos" · en ámbar: "La deuda no condiciona ninguna respuesta".
Lo que ve el socio: "Cobertura vigente", "Próxima campaña de donación".
```

### IMG-S13 — Salud y ambulancias

```text
Generá IMG-S13 con código usando la plantilla de la sección 3.
Encabezado: ícono de ambulancia; "Salud y ambulancias"; etiquetas "Servicios sociales" y "Etapa 11 · O10"; frase: "Lo administrativo de la cobertura y los traslados". Candado pequeño "Datos sensibles".
Recorrido:
1. Contratación: "Grupo de cobertura y plan con topes".
2. Medición y cálculo: "Cuota del grupo · Traslado no cubierto por kilómetro o importe fijo, con coseguro".
3. Facturación y cobro: "El traslado no cubierto se factura al cerrar el viaje".
4. Mora y corte: "La deuda no decide prestaciones ni rechaza un traslado urgente".
5. Operación técnica: "Traslados con móvil y chofer habilitados, desde la aplicación de campo".
Qué incluye: Prestadores, Profesionales, Traslados programados, Móviles y choferes habilitados, Autorizaciones por convenio, Topes por plan.
Reglas que protegen: en ámbar: "Las emergencias se derivan al prestador habilitado" · "Sin historias ni decisiones clínicas en el sistema" · "Los datos de salud nunca van a un proveedor de IA".
Lo que ve el socio: "Mi plan de ejemplo", "Traslado programado · fecha de ejemplo", "Coseguro ARS 0.000".
```

### IMG-S14 — Vivienda

```text
Generá IMG-S14 con código usando la plantilla de la sección 3.
Encabezado: ícono de casa; "Vivienda"; etiquetas "Servicios sociales" y "Etapa 11 · O10"; frase: "Planes de vivienda, de la inscripción a la construcción por etapas".
Recorrido:
1. Contratación: "Inscripción en un plan con tipología · Un solo plan por cuenta".
2. Medición y cálculo: "Aporte porcentual sobre el precio vigente, con tope al 100 %".
3. Facturación y cobro: "Comprobante exclusivo · Cada pago suma porcentaje".
4. Mora y corte: "Mora configurable por meses adeudados".
5. Operación técnica: "Construcción por etapas · Vales de materiales · Certificados aprobados por otro usuario".
Qué incluye: Planes y tipologías, Inscripción, Adjudicación, Aportes porcentuales, Comprobante exclusivo, Construcción por etapas, Materiales y vales, Certificados, Transferencias, Rescisión.
Reglas que protegen: "Aporte en porcentaje del precio vigente, tope 100 %" · "Certificados aprobados por un usuario distinto del que carga".
Lo que ve el socio: una barra de avance "Aportado: 42 %", "Etapa de obra: 2 de 5", "Próximo aporte ARS 0.000".
```

### IMG-S15 — Tasas por cuenta de terceros

```text
Generá IMG-S15 con código usando la plantilla de la sección 3.
Encabezado: ícono de edificio municipal; "Tasas por cuenta de terceros"; etiquetas "Conceptos asociados" y "Etapa 5 · O4"; frase: "Tasas municipales y fondos cobrados por cuenta y orden de terceros, con rendición".
Recorrido:
1. Contratación: "No se contratan: acompañan al servicio propio con convenio".
2. Medición y cálculo: "Regla de tipo impuesto sobre un tributo aprobado · Sin convenio, renglón observado".
3. Facturación y cobro: "Bloque separado · Deuda con el tercero hasta la rendición".
4. Mora y corte: "Por defecto no habilita la suspensión".
5. Operación técnica: tarjeta gris "No requiere".
Qué incluye: Tasas municipales, Fondos, Convenio obligatorio, Bloque separado, Rendición al tercero, Cobro por código de barras.
Reglas que protegen: en ámbar: "Nunca se cobran solas" · "Por defecto no habilitan la suspensión del servicio" · "Recargos solo si el convenio los define".
Lo que ve el socio: factura de ejemplo con dos bloques: "Servicios de la Cooperativa A" y "Por cuenta de terceros".
```

### IMG-S16 — Capital social

```text
Generá IMG-S16 con código usando la plantilla de la sección 3.
Encabezado: ícono de manos o moneda; "Capital social"; etiquetas "Conceptos asociados" y "Mínimo: etapa 6 · O5 | Completo: etapa 11 · O10"; frase: "Cuotas sociales separadas de la deuda por servicios".
Recorrido:
1. Contratación: "Suscripción al facturar, al activar un servicio o al aprobar el ingreso".
2. Medición y cálculo: "No es precio: el importe lo define la regla de suscripción".
3. Facturación y cobro: "Renglón 'Cuota social' con leyenda · Integración proporcional a cada pago".
4. Mora y corte: "Puede excluir del padrón sobre un umbral".
5. Operación técnica: tarjeta gris "No requiere".
Qué incluye: Cuotas sociales, Renglón propio en la factura, Registro separado, Integración proporcional.
Reglas que protegen: en ámbar: "La deuda de capital no suspende servicios" · "Nunca se mezcla con el abono".
Lo que ve el socio: "Cuota social ARS 0.000", "Capital integrado: ARS 0.000".
```

### IMG-S17 — Otros servicios

```text
Generá IMG-S17 con código usando la plantilla de la sección 3, con una variante: en la zona "Qué incluye", mostrá una cuadrícula de 10 íconos pequeños con nombre (banco ortopédico, dispenser de agua, seguros, vehículos eléctricos, correo electrónico, mensajes de texto, ventas, fabricación de postes y bloques, traslados y fletes, "y cualquier prestación que defina la cooperativa").
Encabezado: ícono de cuadrícula; "Otros servicios"; etiquetas "Otros servicios" y "Según el servicio"; frase: "Cualquier prestación propia, sin programar".
Recorrido:
1. Contratación: "Solicitud tipificada · Sin ficha completa confirmada no hay contratos".
2. Medición y cálculo: "Abono o cargo por evento · Dispenser: excedente por litros del mes".
3. Facturación y cobro: "Factura separada · Depósitos de garantía como deuda con el socio".
4. Mora y corte: "Dispenser: la deuda a cierta cantidad de días bloquea nuevos retiros".
5. Operación técnica: "Préstamo, devolución y mantenimiento ortopédico · Retiros con límite diario".
Reglas que protegen: "El depósito de garantía es deuda con el socio" · "Ningún servicio se ofrece sin ficha completa".
Lo que ve el socio: "Silla de ruedas en préstamo · devolución fecha de ejemplo", "Dispenser: 00 l este mes".
```

### IMG-S18 — Cómo se protege al socio en cada servicio

```text
Generá IMG-S18 con código.
Título: "En cada servicio, una protección que no se negocia".
Cuadrícula de 4 × 4 + 1 con 17 tarjetas iguales, una por servicio, cada una con ícono, nombre y su regla principal en una línea (borde ámbar):
Internet: "Baja sin cargo y sin exigir la deuda" · Telefonía: "Emergencias siempre habilitadas" · Televisión: "Botón de baja público" · Electricidad: "Nunca se corta a un electrodependiente" · Agua: "Caudal mínimo vital" · Cloacas: "Sin suspensión física por mora" · Gas: "Reconexión solo con inspección" · Alumbrado: "Siempre separado y con convenio" · Obras: "No suspende otros servicios" · Sepelio: "Nunca se rechaza una urgencia por deuda" · Cementerio parque: "Nunca se dispone de restos por falta de pago" · Banco de sangre: "Nunca se cobra la sangre" · Salud y ambulancias: "Emergencias al prestador habilitado" · Vivienda: "Certificados con doble aprobación" · Tasas de terceros: "Nunca se cobran solas" · Capital social: "No suspende servicios" · Otros: "Garantía como deuda con el socio".
Pie: "Las protecciones que fija la norma no pueden ser modificadas por la cooperativa".
```

---

## 6. Notas para el presentador

- **Orden sugerido:** IMG-S00 (el mapa), IMG-S01 (Internet, el primero), IMG-S04 (electricidad, el más complejo), IMG-S05 (agua, el de mayores protecciones), uno social (IMG-S10, sepelio) e IMG-S18 como cierre.
- **Si el tiempo es corto:** IMG-S00 e IMG-S18 resumen los 17 servicios en dos diapositivas; las demás quedan como anexo.
- **Los valores "propuestos" o "por defecto"** (90 días de factibilidad, 50 litros de caudal mínimo, 15 días de retiro de equipos, carencias) son referencias que la cooperativa o su asesoría legal confirman antes de la primera aplicación real.
- **Las etapas no tienen fecha comprometida.** Para tiempos y costos, pasar a `plazos-olas-y-costos.md`.
