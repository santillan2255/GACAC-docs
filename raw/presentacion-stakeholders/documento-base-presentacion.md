# CoopApps — Documento base para la presentación a stakeholders

Documento consolidado para generar, con ChatGPT o Claude, las imágenes de la presentación. Resume en un solo lugar el relevamiento, el análisis funcional, el diseño técnico, el plan de construcción, las necesidades planteadas por el equipo anterior y cómo se atienden, y los temas a decidir juntos.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `docs/especificacion/` (maestra, 31 anexos, registro de decisiones, preguntas abiertas, plan de olas), `docs/entregables-analisis-diseno/`, `procoop-relevamiento/`, `docs/revision-externa/` y los cinco documentos de presentación del equipo anterior (00 Panorama, 01 Arquitectura y stack, 02 Infraestructura y despliegue, 03 Forma de trabajo y agentes, 04 Decisiones de arquitectura) |
| Regla de uso | Todos los números de este documento salen de las fuentes. Ningún gráfico debe agregar, redondear de otra forma ni estimar números que no estén acá |

---

## 0. Cómo usar este documento

### 0.1 Pasos

1. Subir este archivo completo a ChatGPT o a Claude.
2. Pegar el **prompt maestro** de la sección 0.2.
3. Pedir las imágenes de a una: "Generá IMG-01", "Generá IMG-02", etc. Los prompts de cada imagen están en la sección 13.
4. Verificar cada número de cada imagen contra este documento antes de usarla. Un número equivocado frente a los stakeholders cuesta toda la credibilidad.

Dos consejos prácticos:

- **Gráficos con números** (barras, anillos, líneas de tiempo): pedir que se hagan con código (Python con matplotlib en ChatGPT, o HTML/SVG en Claude) y se exporten como PNG de 1920×1080. Los generadores de imágenes deforman los números y las letras.
- **Ilustraciones conceptuales** (iceberg, portada, antes y después): usar el generador de imágenes, con poco texto. Si el texto sale mal, generar la imagen sin texto y agregar los títulos en PowerPoint.

### 0.2 Prompt maestro (pegar primero)

```text
Vas a ayudarme a preparar las imágenes de una presentación ejecutiva para mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. El mensaje central es: "escuchamos sus necesidades, las atendimos, el trabajo de relevamiento, análisis y especificación ya está hecho y controlado, y les proponemos cómo seguir".

Te adjunto el documento base. Reglas obligatorias:
1. Usá SOLO los datos del documento. No inventes, no estimes y no redondees distinto ningún número. Si un dato no está, dejá el espacio vacío y avisame.
2. Todo el texto visible en español de Argentina, formal y claro, sin tecnicismos innecesarios. Usá los textos exactos que indique cada pedido.
3. Formato 16:9, 1920×1080 px, fondo claro.
4. Paleta (respeta el criterio del equipo: grises con un solo acento verde): gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para fondos de tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento (lo atendido, lo hecho, lo destacado). Solo para estados: ámbar #B7791F (a decidir o pendiente) y rojo #B91C1C (riesgo alto o defecto). No uses otros colores.
5. Tipografía sans serif limpia (tipo Inter o Source Sans). Títulos grandes, poco texto, mucho aire.
6. Estilo sobrio y profesional, tipo consultora. Nada de caricaturas, robots, cerebros ni efectos futuristas. Íconos de línea simples.
7. Los estados nunca se distinguen solo por color: acompañalos con texto o ícono.
8. Si el pedido es un gráfico con datos, hacelo con código (Python y matplotlib) y mostrame la imagen final. Si es una ilustración conceptual, usá el generador de imágenes y mantené el texto al mínimo.
9. Después de cada imagen, listá los números que usaste y en qué sección del documento están, para que yo los verifique.
Voy a pedirte las imágenes por su código (IMG-01, IMG-02, ...). Esperá mi pedido.
```

### 0.3 Si se usa Claude en lugar de ChatGPT

Pegar el mismo prompt maestro y agregar: "Generá cada imagen como un artefacto HTML con SVG de 1920×1080, autocontenido, listo para capturar o exportar a PNG". Claude es más preciso con los números y el texto; ChatGPT es mejor para ilustraciones.

---

## 1. El mensaje de la presentación

**Idea central:** el relevamiento, el análisis y la especificación que el plan tradicional preveía hacer en 6 meses ya están hechos, con más profundidad que un relevamiento por entrevistas. Lo que falta es lo que solo pueden aportar ellos: validar, decidir y priorizar.

**Tres mensajes de apoyo:**

1. **Escuchamos.** Cada necesidad y regla que definió el equipo anterior está mapeada contra la especificación: la gran mayoría ya está atendida, proponemos adoptar varias propuestas suyas y las diferencias se plantean para decidir juntos (sección 7).
2. **Está controlado.** Cada requisito es trazable hasta ProCoop, hasta una regla de negocio, una pantalla, una operación de API, un caso de prueba y una instrucción de construcción (secciones 4 y 5).
3. **Hay un camino medible.** Proponemos validar en semanas, no en meses, y calibrar el plazo de construcción con datos reales en lugar de estimarlo a ciegas (secciones 10 y 11).

### 1.1 Guion sugerido de la presentación

| N.º | Diapositiva | Mensaje | Imagen |
|---|---|---|---|
| 1 | Portada | CoopApps: del relevamiento al plan de construcción | IMG-01 |
| 2 | Lo que nos pidieron | Sus prioridades: robustez, auditoría, seguridad, modernidad | IMG-02 |
| 3 | Seis meses contra seis días | El plan tradicional y lo que ya está hecho | IMG-03 |
| 4 | Su plan, fase por fase | Relevar, analizar y especificar: hecho. Validar: con ustedes | IMG-04 |
| 5 | Un relevamiento distinto | No lo que la gente recuerda: lo que el sistema hace | IMG-05 |
| 6 | El relevamiento en números | Lo que se leyó de ProCoop | IMG-06 |
| 7 | Lo que nadie hubiera contado en una entrevista | Defectos ocultos de ProCoop | IMG-07 |
| 8 | Hoy y mañana | Problemas de ProCoop y qué cambia | IMG-08 *(o reemplazar por IMG-D02+D03 y bloque comparativo IMG-C03; guion unificado en `comparativo-funcional-procoop-vs-coopapps-para-presentacion.md` §0.5)* |
| 9 | La especificación completa | De ProCoop a los casos de prueba | IMG-09 |
| 10 | El mapa del sistema | 19 módulos funcionales y 12 transversales | IMG-10 |
| 11 | Dónde está el volumen | Requisitos por módulo | IMG-11 |
| 12 | Cobertura | 100 % en cada entregable | IMG-12 |
| 13 | Escuchamos | 43 necesidades del equipo anterior y su estado | IMG-13 |
| 14 | Detalle de lo que pidieron | Necesidad por necesidad | IMG-14 |
| 15 | Aportes externos incorporados | Contraste del documento NucleoTransversal | IMG-15 |
| 16 | Cómo funciona por dentro | Arquitectura en una imagen | IMG-16 |
| 17 | Seguridad en capas | El aislamiento entre cooperativas | IMG-17 |
| 18 | Nada falla en silencio | Una operación con ARCA de punta a punta | IMG-18 |
| 19 | Lo que necesitamos de ustedes | Decisiones tomadas y por validar | IMG-19 |
| 20 | Temas a decidir juntos | Cuatro divergencias, con opciones | IMG-20 |
| 21 | Hoja de ruta | 12 olas con hitos de negocio | IMG-21 |
| 22 | Reemplazo de ProCoop sin saltos | Corte por etapas | IMG-22 |
| 23 | Riesgos bajo control | 11 riesgos y su mitigación | IMG-23 |
| 24 | El plazo depende de un dato que se puede medir | Sensibilidad y calibración | IMG-24 |
| 25 | Propuesta | Tres pasos para seguir | IMG-25 |

---

## 2. Contexto: qué es CoopApps

**Qué es:** una plataforma de gestión en la nube (SaaS) para cooperativas de servicios públicos y sociales de la Argentina, que reemplaza a ProCoop, el sistema de escritorio que hoy usa la mayoría.

**Visión:** brindar a cada cooperativa una plataforma única, segura y configurable para administrar de punta a punta todos sus servicios, su relación con los socios y su gestión interna, con información confiable, trazable y disponible en cualquier momento y lugar.

**Cooperativa piloto:** Laguna Larga (`LAG`), que opera electricidad (incluido prepago) y gas natural por redes (DEC-088, DEC-089).

### 2.1 Seis ideas de la propuesta de valor

1. Una sola herramienta para toda la cooperativa: comercial, administrativa, atención, técnica de campo, autogestión del socio y comunidad.
2. Todo lo que hace ProCoop, mejorado; no se replican sus debilidades técnicas y de seguridad (DEC-007).
3. Configuración, no programación: servicios, tarifas, conceptos, impuestos y circuitos se configuran con vigencia e historial.
4. El socio en el centro: sitio y aplicación con la marca de la cooperativa para consultar, pagar, reclamar y contratar desde el celular.
5. Control y trazabilidad: cada operación queda registrada con autor, fecha y motivo; los documentos económicos nunca se borran.
6. Seguridad y continuidad profesionales: aislamiento verificado entre cooperativas, doble factor, cifrado, copias automáticas y niveles de servicio comprometidos.

### 2.2 Los problemas de hoy y qué cambia

| Problema de ProCoop | Consecuencia para la cooperativa | Qué cambia |
|---|---|---|
| Instalación local en cada computadora y actualizaciones manuales | Costos de mantenimiento, versiones desparejas, dependencia de técnicos | Servicio en la nube, siempre actualizado, desde el navegador y el celular |
| Una base por cooperativa administrada localmente | La cooperativa carga con servidores, copias y recuperación | Copias automáticas, restauración probada y niveles de servicio comprometidos |
| Contraseñas que pueden descifrarse, usuario de base compartido y credenciales escritas en el programa | Exposición de datos de socios y de credenciales fiscales y bancarias; no se sabe quién hizo qué | Contraseñas no reversibles, doble factor, identidad individual con auditoría y bóveda cifrada de credenciales |
| 1.536 parámetros identificados solo con números | La configuración depende de pocas personas; cambiar una tarifa es riesgoso | Parámetros con nombre, tipo, vigencia e historial |
| Integraciones frágiles con organismos, bancos y entes | Errores en cobranzas, rendiciones y autorizaciones fiscales; corrección manual | Conectores con reintentos controlados, prevención de duplicados y conciliación |
| Portal del socio sobre una copia sincronizada | Información desactualizada y doble mantenimiento | Portal nativo sobre la misma información |
| Experiencia digital casi nula para el socio y el personal de campo | Más carga en mostrador; trabajo de campo en papel | Aplicación del socio con la marca de la cooperativa y aplicación de campo que funciona sin conexión |

### 2.3 Niveles de servicio comprometidos

| Objetivo | Meta |
|---|---|
| Disponibilidad | 99,5 % mensual |
| Pérdida máxima de datos ante un incidente grave (RPO) | 15 minutos |
| Tiempo máximo de recuperación (RTO) | 4 horas por cooperativa; 8 horas la plataforma completa |
| Respuesta de pantallas | 800 milisegundos o menos en el 95 % de las operaciones |
| Facturación masiva | 50.000 suministros en 60 minutos o menos, con progreso visible y reanudación |
| Capacidad | Cooperativas de hasta 150.000 suministros; diseñada para 100 cooperativas, ampliable a 300 |
| Exactitud económica | Cero diferencias de centavos entre comprobante, cuenta corriente y contabilidad |
| Soporte | Lunes a viernes de 8 a 18; incidentes críticos las 24 horas, todos los días |

---

## 3. El relevamiento de ProCoop: la gran diferencia

### 3.1 Relevamiento tradicional contra relevamiento por dentro

| | Relevamiento tradicional | Relevamiento realizado |
|---|---|---|
| Método | Entrevistas, reuniones y observación de pantallas | Lectura del sistema por dentro: programas, modelo de datos, pantallas, menú y configuración |
| Qué obtiene | Lo que la gente recuerda y sabe explicar | Lo que el sistema hace realmente, regla por regla |
| Evidencia | Notas y minutas | Cada regla con la referencia a la línea exacta del código donde está |
| Defectos ocultos | No los detecta: nadie sabe que existen | Los detecta y los documenta |
| Duración prevista | Parte de un plan de 6 meses | Realizado el 3 y 4 de noviembre de 2026 |
| Rol de los usuarios | Fuente principal | Validar y confirmar el uso real (sigue siendo necesario) |

Frase para la presentación: "Un relevamiento tradicional nos cuenta cómo la gente cree que funciona ProCoop. Este nos dice cómo funciona realmente. Ahora necesitamos que ustedes nos confirmen cómo lo usan".

### 3.2 El relevamiento en números

| Indicador | Valor |
|---|---|
| Archivos de los programas de ProCoop analizados | 2.728 |
| Documentos de reglas de negocio | 13 (cálculo de factura, facturación masiva, ARCA e IVA, mora y corte, cobranzas y entes, titulares y medidores, técnica y reclamos, tesorería, contabilidad, compras, stock y sueldos, parámetros, integraciones, particularidades y configuración real de Laguna Larga, pasarelas e interbanking) |
| Referencias a líneas exactas del código fuente dentro de esas reglas | 3.060 |
| Tablas de negocio del modelo de datos | 667 (catálogo depurado: 659 tablas en 31 módulos), más 39 de la aplicación móvil, 31 del portal web y 21 de telemedición |
| Parámetros de ProCoop catalogados uno por uno | 1.536 |
| Funciones de menú relevadas | Unas 150, en 9 módulos de menú |
| Capturas de pantalla | 30 |
| Volumen de facturación observado en la base de demostración | Unos 12.500 comprobantes por emisión mensual |
| Cobertura de ProCoop en el sistema nuevo | El 97,9 % de las unidades relevadas tiene destino trazado; el resto tiene corrección propuesta |

### 3.3 Defectos ocultos encontrados en ProCoop

Ejemplos reales, cada uno con su ubicación en el relevamiento (`procoop-relevamiento/reglas-negocio/`):

| Área | Qué hace ProCoop | Riesgo para la cooperativa | Fuente |
|---|---|---|---|
| Mora | La carga de tasas de interés por mora no detecta superposición entre tasas generales | Puede haber tramos duplicados que **suman interés dos veces** al socio | `04-mora-intereses-y-corte.md`, punto 14 |
| Cobranza | Si dos facturas de la misma cuenta tienen el mismo importe en algún vencimiento, imputa el pago a la más reciente **aunque ya esté paga** | El pago de la factura vieja termina como "cancelado" o duplicado | `05-cobranzas-cajas-y-entes-recaudadores.md` |
| Fiscal | Al regrabar los comprobantes de administración pública, arma la fecha sin comillas en la consulta SQL: el servidor la toma como una división y no borra la selección anterior | Registros fiscales **duplicados** | `03-afip-facturacion-electronica-e-iva.md` |
| Fiscal | En la importación de comprobantes, el control de duplicados compara "distinto" donde debería comparar "igual" | El control de duplicados no funciona | `03-afip-facturacion-electronica-e-iva.md` |
| Mora | Cambiar el garante de un convenio no valida nada ni recalcula la plantilla del convenio | Convenios con garante inconsistente | `04-mora-intereses-y-corte.md` |
| Sueldos | Si un empleado no tiene categoría, el cálculo de vacaciones toma la primera fila de la tabla sin mirar la antigüedad | Días de vacaciones mal calculados | `08-tesoreria-contabilidad-compras-stock-sueldos.md` |
| Seguridad | Contraseñas con cifrado reversible, contraseñas maestras y credenciales escritas en el programa | Exposición de datos y credenciales | Especificación maestra §1.1 y contraste externo §4.2 |

En el relevamiento hay además 22 defectos marcados como tales y numerosas reglas marcadas "[VERIFICAR]" para confirmar con la cooperativa.

### 3.4 Qué no reemplaza este relevamiento

- La validación con los usuarios de Laguna Larga: qué funciones usan de verdad, qué atajos hacen a mano y qué les molesta.
- La validación legal de los parámetros con contenido jurídico y fiscal.
- La confirmación de las reglas marcadas "[VERIFICAR]".

Por eso la propuesta cambia el rol de las entrevistas: ya no son para descubrir sino para validar, en sesiones cortas.

---

## 4. Lo que ya está hecho: la especificación completa

### 4.1 Cronología real del trabajo

| Fecha (noviembre de 2026) | Trabajo |
|---|---|
| 2 y 3 | Arranque y relevamiento de ProCoop; base funcional; definición funcional inicial (borrador del 3/11) |
| 3 y 4 | Reglas de negocio con referencias al código; especificación maestra y registro de decisiones |
| 4 y 5 | Anexos funcionales y técnicos, preguntas abiertas, plan de olas, matriz de trazabilidad |
| 5 y 6 | Entregables de análisis y diseño, alcance funcional, corrección de inconsistencias, tokenización de medios de pago |
| 7 al 10 | Contraste del documento externo NucleoTransversal-Modelo e incorporación de sus aportes |

Total: unos 6 días de trabajo efectivo frente a los 6 meses que el plan tradicional preveía para relevar, analizar y especificar.

### 4.2 Volumen de la especificación

| Artefacto | Cantidad |
|---|---|
| Documento maestro | 1 |
| Anexos | 31: 19 funcionales (M01 a M19) y 12 transversales (T01 a T12) |
| Requisitos funcionales | 4.204 |
| Requisitos no funcionales | 292 |
| Reglas de negocio (filas en los anexos) | Unas 2.680 |
| Parámetros con nombre, tipo y vigencia (filas en los anexos) | Unos 2.490 |
| Decisiones registradas | 108 (106 vigentes) |
| Preguntas de decisión | 593: 98 respondidas, 490 con propuesta recomendada vigente, 5 en otro estado |
| Líneas de documentación | Más de 300.000 |

### 4.3 Entregables de análisis y diseño

| Entregable | Contenido |
|---|---|
| Procesos de negocio | 341 procesos (94 principales y 247 derivados) en 20 macroprocesos; 12 procesos de punta a punta con situación actual y futura |
| Casos de uso | 471, con diagramas por módulo |
| Modelo de datos | 1.058 tablas (Azure SQL) con campos y relaciones, en 61 diagramas |
| Pantallas | 1.051 pantallas catalogadas con ruta, permiso, patrón, campos, acciones, requisitos y ola; 558 ítems de menú |
| Diseño visual | 12 patrones de interfaz, 204 familias de wireframes y 17 pantallas del piloto en detalle |
| Prototipo navegable | 7 recorridos del piloto y 38 rutas, con datos ficticios |
| Contratos de API | 4.193 operaciones en 30 contratos OpenAPI, con un visor navegable y una ficha de propósito por operación |
| Eventos y tareas de fondo | 668 eventos y 506 tareas programadas |
| Diagramas de estados | 615 entidades con su ciclo de vida |
| Diagramas de secuencia | 115 flujos críticos, incluidas las integraciones externas |
| Interfaces externas | 115 fichas de integración (ARCA, bancos, pasarelas, entes, redes, mensajería, mapas, IA) |
| Mensajes y documentos | 152 mensajes del sistema, 225 plantillas de notificación, 19 documentos impresos y 56 reportes |
| Arquitectura | Documento con vistas C4 y 55 registros de decisiones de arquitectura (ADR) |
| Seguridad | Modelo de amenazas con 80 amenazas, sus controles y su riesgo residual |
| Pruebas | 5.710 casos de prueba de aceptación y 196 casos de aceptación de negocio, con criterios de salida por ola |
| Roles | 40 roles predefinidos que cada cooperativa puede copiar y ajustar |
| Migración | Estrategia, mapeo origen a destino, plan de puesta en marcha, convivencia con ProCoop y capacitación |
| Plan de construcción | 12 olas con 172 instrucciones de construcción, cada una con objetivo, requisitos a implementar, entregables y criterio de terminado |
| Estimación y costos | Estimación por instrucción y por ola; modelo de costos de operación en tres escenarios |

### 4.4 Cobertura de los entregables

| Entregable | Universo | Cubierto |
|---|---|---|
| Modelo de datos | 1.058 tablas (Azure SQL) | 100 % |
| Procesos | 341 procesos | 100 % |
| Catálogo de pantallas | 1.051 pantallas | 100 % |
| Wireframes | 204 familias y 12 patrones | 100 % |
| Diagramas de secuencia | 653 eventos con consumidor externo, 115 integraciones y 53 servicios | 100 % |
| Contratos de API | 4.193 operaciones | 100 % |
| Catálogo de eventos | 668 eventos y 506 tareas | 100 % |
| Casos de prueba | 4.204 requisitos, 763 escenarios y 471 casos de uso | 100 % |
| Casos de uso | 4.204 requisitos | 100 % |
| Navegación | 1.051 pantallas y 558 ítems de menú | 100 % |
| Estimación | 172 instrucciones | 100 % |
| Diagramas de estados | 631 entidades con estado | 615 diagramadas; 16 excluidas con motivo |

### 4.5 La cadena de trazabilidad

Cada elemento se puede seguir de punta a punta:

ProCoop (tabla, pantalla o regla con su línea de código) → requisito funcional → regla de negocio y parámetro → colección del modelo de datos → pantalla → operación de API → evento → caso de prueba → instrucción de construcción en su ola.

---

## 5. Alcance funcional

### 5.1 Módulos funcionales y transversales

| Área | Módulos | Requisitos funcionales (filas en el anexo) |
|---|---|---|
| Socios y servicios | M01 Personas, titulares y cuentas | 175 |
| | M02 Catálogo de servicios | 117 |
| | M03 Medición y consumos | 129 |
| Facturación y fiscal | M04 Tarifas y motor de cálculo | 122 |
| | M05 Facturación | 179 |
| | M06 Fiscal e impuestos | 169 |
| Cobranza y mora | M07 Cuenta corriente y cobranza | 195 |
| | M08 Mora y financiación | 224 |
| Atención y técnica | M09 Atención al socio | 194 |
| | M10 Técnica, campo y redes | 239 |
| Gestión administrativa | M11 Ventas y presupuestos | 94 |
| | M12 Compras y proveedores | 115 |
| | M13 Stock, activos y fabricación | 139 |
| | M14 Tesorería y bancos | 188 |
| | M15 Contabilidad | 163 |
| Personas de la organización | M16 Personal y sueldos | 146 |
| Institucional y social | M17 Institucional | 109 |
| | M18 Servicios sociales y flota | 149 |
| Canales | M19 Portal del socio y sitio público | 180 |
| Transversales | T01 Plataforma SaaS | 165 |
| | T02 Identidad, roles y auditoría | 93 |
| | T03 Experiencia, marca y vocabulario | 179 |
| | T04 Configuración y parámetros | 143 |
| | T05 Modelo de datos | — (catálogo lógico; DDL en `07-ddl`) |
| | T06 Integraciones | 86 |
| | T07 Migración desde ProCoop | 78 |
| | T08 No funcionales y seguridad | 25 (y 259 requisitos no funcionales) |
| | T09 Comunidad y comunicaciones | 157 |
| | T10 Reportes, inteligencia de negocio y API | 104 |
| | T11 Flujos de trabajo, eventos y documentos | 157 |
| | T12 Fichas verticales por servicio | — (control de cobertura de punta a punta por servicio) |

Nota: las filas por anexo suman algo más que 4.204 porque incluyen requisitos reemplazados que se conservan con su nota. El total oficial es 4.204.

### 5.2 Servicios cubiertos

| Familia | Servicios |
|---|---|
| Servicios medidos | Electricidad (incluido prepago y generación distribuida), agua, cloacas, gas natural, propano por red y envasado |
| Tecnologías de la información y las comunicaciones | Internet (fibra, inalámbrico, cable), telefonía fija e IP, televisión, correo y paquetes de mensajes |
| Por cuenta de terceros y obras | Alumbrado público, tasas municipales y fondos, obras y contribución por mejoras |
| Sociales y abonos | Sepelio, cementerio parque, salud y ambulancias, banco de sangre (administrativo), seguros y adhesiones |
| Otros | Vivienda, ventas, fabricación propia, traslados y flota, banco ortopédico y prestaciones que defina la cooperativa |
| Institucional | Capital social y cuotas sociales |

### 5.3 Aplicaciones

| Aplicación | Usuarios |
|---|---|
| Sistema de gestión web | Personal administrativo, comercial, técnico y directivo |
| Portal y aplicación del socio | Titulares, representantes y adherentes |
| Espacio del empleado | Personal de la cooperativa (recibos, tareas, aprobaciones) |
| Aplicación de campo, sin conexión | Técnicos, lecturistas y cobradores |
| Sitio público | Público en general (consulta y pago sin ingresar, reclamos, botón de baja) |
| Tótem de autogestión | Socios en las oficinas |
| Consola de plataforma | Equipo operador de GoodApps |
| Interfaz de integración | Sistemas de terceros autorizados |

### 5.4 Integraciones principales

ARCA y organismos tributarios provinciales y municipales; Pagos360, Mercado Pago, SIRO y Red Link en la primera etapa; bancos, débitos automáticos y cheques electrónicos; equipos de red (MikroTik, Radius, SmartOLT); telemedición y prepago; WhatsApp Business, SMS, correo y notificaciones; ingreso con Google y Ciudadano Digital de Córdoba; mapas y normalización de domicilios; proveedores de IA y de firma digital; entes reguladores y organismo de control cooperativo; impresoras fiscales y equipamiento local.

---

## 6. Diseño técnico

### 6.1 Arquitectura en una imagen

- **Un solo sistema desplegable dividido en módulos con límites estrictos (monolito modular).** Un módulo no lee ni escribe datos de otro: usa interfaces públicas o eventos. Una verificación automática impide que un módulo use partes internas de otro.
- **Aplicaciones:** API, procesos de fondo (workers), sistema de gestión web, aplicación del socio y de campo, sitio público.
- **Datos:** una plataforma compartida con los datos de cada cooperativa aislados por un identificador obligatorio (DEC-002).
- **Procesos pesados** (facturación masiva, archivos bancarios, telemedición) en colas, por lotes reanudables.
- **Integraciones** mediante conectores con reintentos controlados, prevención de duplicados y conciliación.
- **Nube:** independiente del proveedor, con contenedores; nunca en servidores de la cooperativa (DEC-004).

### 6.2 Seguridad y aislamiento en capas

1. **Filtro forzado por cooperativa en toda consulta:** una consulta sin cooperativa falla y no devuelve datos (T05; RNF-NFR-238).
2. **Autorización en el servidor en cada pedido:** cooperativa del token, usuario habilitado, permiso de la acción y alcance sobre el registro; denegación por defecto (RNF-NFR-090).
3. **Pruebas automáticas de aislamiento:** recorren el 100 % de las rutas y tareas con dos cooperativas de prueba; una ruta nueva sin su prueba bloquea la entrega (RNF-NFR-148).
4. **Prueba de que el control existe:** si se desactiva el filtro, las pruebas tienen que romperse (RNF-NFR-238).
5. **Aislamiento también en caché, archivos, colas, notificaciones, eventos y registros técnicos** (RNF-NFR-238).
6. **Restauración de una sola cooperativa en 4 horas o menos, sin afectar a las demás,** con simulacro trimestral (RNF-NFR-037).
7. **Límites de uso por cooperativa:** una cooperativa no puede degradar a otra (RF-NFR-025, RN-NFR-025).

### 6.3 Identidad y permisos

- Ingreso con contraseña o código de un solo uso, Google y Ciudadano Digital de Córdoba.
- Doble factor con aplicación autenticadora, correo, llaves de acceso (passkeys) y códigos de recuperación; obligatorio para funciones sensibles. SMS no admitido para el equipo de plataforma ni para los administradores (RF-IAM-044).
- Una identidad con acceso a varias cooperativas, con selector (RF-IAM-010).
- Cuatro filtros en cada operación: licencia contratada, módulo activado, rol del usuario y alcance de datos (sucursal, zona, servicio, cuadrilla o "solo lo mío").
- Separación de funciones: quien solicita no aprueba y quien aprueba no paga.

### 6.4 Auditoría

- Registro inmutable de cada cambio con valor anterior y nuevo, accesos, lecturas de datos sensibles, exportaciones, mensajes e IA (RF-IAM-133).
- Encadenamiento criptográfico por cooperativa y sellado diario en almacenamiento que no se puede modificar (RN-IAM-062): si alguien altera un registro, se detecta.
- Revertir un cambio es una operación nueva, también auditada.

### 6.5 Robustez: nada falla en silencio

- Errores clasificados en categorías normalizadas, incluida "resultado incierto" cuando no se sabe si el tercero aplicó la operación (RF-INT-035).
- Con ARCA, ante ciertos errores, primero se consulta el comprobante y después se reintenta; el tiempo agotado queda como "incierto" y se concilia (RF-FIS-052).
- Eventos publicados solo si la operación de negocio se confirmó (outbox), operaciones idempotentes (repetir no duplica), control de concurrencia y bandeja técnica de eventos fallidos que nunca se descartan.
- Dinero siempre con tipo decimal, nunca con punto flotante; está prohibido por regla automática (RN-NFR-005, RNF-NFR-200).
- Fechas en UTC con interpretación en la zona horaria de la cooperativa (RF-CFG-008).
- Despliegues sin corte y vuelta atrás en 15 minutos o menos (RNF-NFR-033, RNF-NFR-167).
- Generación de PDF aislada, sin red y con límites de tiempo y memoria (DEC-092).

### 6.6 Calidad en cada entrega

Cada cambio pasa por: revisión estática y de seguridad, pruebas unitarias, pruebas de integración con bases reales, pruebas de aislamiento y de permisos, pruebas de contrato de la API y de eventos, construcción de imágenes con su inventario de componentes y pruebas de punta a punta. Si falla una, el cambio no entra (RNF-NFR-140, RNF-NFR-164). Cobertura mínima de 95 % en dinero, tarifas, fiscal, imputación y mora (RNF-NFR-158).

---

## 7. Escuchamos: las necesidades del equipo anterior y cómo se atienden

Fuente: los cinco documentos de presentación del equipo anterior (Panorama, Arquitectura y stack, Infraestructura y despliegue, Forma de trabajo y agentes, Decisiones de arquitectura).

### 7.1 Resumen

| Estado | Cantidad | Significado |
|---|---|---|
| Atendido | 30 | La especificación lo resuelve con el mismo objetivo y un mecanismo equivalente |
| Atendido con otra solución | 2 | Mismo objetivo, otro mecanismo |
| Proponemos adoptar lo de ustedes | 6 | Su propuesta mejora la nuestra y proponemos incorporarla |
| A decidir juntos | 4 | Hay una diferencia real; se plantea con opciones |
| Pendiente compartido | 1 | Está abierto en las dos propuestas |
| **Total** | **43** | |

### 7.2 Detalle, necesidad por necesidad

| N.º | Necesidad planteada | Cómo se atiende | Referencia | Estado |
|---|---|---|---|---|
| 1 | Robustez: nada falla en silencio; toda falla con estado explícito y evidencia | Errores normalizados con "resultado incierto", reconsulta, conciliación y bandeja de fallidos | RF-INT-035; T01; T11 | Atendido |
| 2 | Falla cerrada en saldos, deuda, facturación, cobros y permisos; nunca un valor inventado | Denegación por defecto en permisos; proponemos adoptar su tabla de cinco resultados (vigente, vacío válido, dependencia no disponible, pendiente, dato anterior) como contrato de toda la API | RNF-NFR-090 | Proponemos adoptar |
| 3 | Auditoría exhaustiva: quién, qué, cuándo, desde dónde, intentos fallidos y lo enviado a terceros | Auditoría inmutable con encadenamiento criptográfico, lecturas sensibles, mensajes, IA y llamadas a integraciones | RF-IAM-133; RN-IAM-062 | Atendido |
| 4 | Cada cooperativa aislada en su propia base | Plataforma compartida con aislamiento forzado y verificado en 7 capas y restauración por cooperativa | DEC-002; RNF-NFR-148, 238, 037 | A decidir juntos |
| 5 | Permisos por acción y alcance por registro; la API decide, la interfaz solo oculta | Permiso por acción y alcance sobre el objeto verificados en el servidor en cada pedido | RNF-NFR-090 | Atendido |
| 6 | Interfaz responsive con modo claro y oscuro | Responsive en todas las aplicaciones; tema claro y oscuro conmutables | RF-UXD-001 | Atendido |
| 7 | Multilenguaje | Hoy: español de Argentina más vocabulario propio por cooperativa. Proponemos adoptar la preparación para varios idiomas | PRM-NFR-101; T03 | Proponemos adoptar |
| 8 | La electricidad como servicio principal | Hoy Internet es el primer recorrido de punta a punta y la energía llega en la ola O7 | DEC-005; DEC-089 | A decidir juntos |
| 9 | Migrador propio de ProCoop como parte del producto | Herramienta de migración desde las primeras olas; cada módulo trae su cargador; migración repetible | T07 (78 requisitos) | Atendido |
| 10 | Padrón, usuarios sin contraseñas, deduplicación y conciliación | Unificación del padrón, control de duplicados, personas sin documento, usuarios con invitación de activación, conciliación por dominio | T07; DEC-097; DEC-099; PA-MIG-07 | Atendido |
| 11 | Copia inmutable de lo extraído, linaje por fila y manifiesto por lote | Trazabilidad origen-destino por registro y manifiesto inmutable con hash por lote | T05; T02; T07 | Atendido |
| 12 | Solo en la nube, nunca en servidores de la cooperativa | Nube con contenedores, independiente del proveedor; se puede desplegar en Azure | DEC-004 | Atendido con otra solución |
| 13 | Una cooperativa grande puede correr en su propia suscripción | No contemplado hoy; se puede agregar como modalidad | — | A decidir juntos |
| 14 | Ingreso con contraseña, Google, TOTP y passkeys; MFA exigible por rol | Todos incluidos, con factores permitidos por rol | T02 | Atendido |
| 15 | Sin SMS | SMS prohibido para plataforma y administradores; la lista es un parámetro y puede extenderse a todos | RF-IAM-044; PRM-IAM-028 | Atendido con otra solución |
| 16 | Una cuenta con membresía en varias cooperativas | Identidad con pertenencias en varias cooperativas y selector | RF-IAM-010 | Atendido |
| 17 | Persona distinta de usuario; persona con roles con vigencia | Persona única con roles y vínculos con vigencia; usuario separado de la persona | M01; DEC-097 | Atendido |
| 18 | Monolito modular; un módulo no toca tablas de otro; límites verificados | Monolito modular con fronteras verificadas automáticamente | T01; PRO-O0-01 | Atendido |
| 19 | La variedad entre cooperativas es dato, no código | Configuración versionada; unos 2.490 parámetros con nombre; los 1.536 de ProCoop catalogados | T04; T04b | Atendido |
| 20 | Procesos pesados en workers con colas y lotes reanudables | Tareas en cola por cooperativa; facturación masiva reanudable con progreso | T01; T11 | Atendido |
| 21 | Idempotencia, outbox, reintentos solo transitorios, dead-letter, concurrencia optimista | Todos incluidos desde la ola O0 | T01; T08; PRO-O0-03 | Atendido |
| 22 | Con ARCA, primero consultar y después reintentar | Consulta del comprobante antes de reintentar; tiempo agotado como incierto y conciliación | RF-FIS-052 | Atendido |
| 23 | Diario de intenciones inmutable antes de cada llamada con efecto a ARCA o un banco | Hoy: resultado incierto, reconsulta y conciliación. Proponemos adoptar el diario de intenciones | RF-INT-035 | Proponemos adoptar |
| 24 | Dinero con decimal, nunca punto flotante; redondeo explícito | Tipo decimal obligatorio, regla automática que prohíbe otro tipo, redondeo por concepto | RN-NFR-005; RNF-NFR-200 | Atendido |
| 25 | Instantes en UTC y períodos en la zona de la cooperativa | Fechas en UTC con interpretación en la zona horaria de la cooperativa | RF-CFG-008 | Atendido |
| 26 | Límites de uso por cooperativa | Cuotas por cooperativa visibles en su tablero | RF-NFR-025; RN-NFR-025 | Atendido |
| 27 | Restaurar una cooperativa sin tocar a las otras | Restauración selectiva en 4 horas o menos | RNF-NFR-037 | Atendido |
| 28 | Despliegue sin corte y vuelta atrás rápida | Sin indisponibilidad por despliegue y vuelta atrás en 15 minutos o menos | RNF-NFR-033; RNF-NFR-167 | Atendido |
| 29 | Observabilidad con OpenTelemetry | Registros estructurados, métricas y trazas con identificador de cooperativa y de operación | T08 | Atendido |
| 30 | Contratos de API y pruebas de contrato en cada cambio | 4.193 operaciones en OpenAPI y pruebas de contrato obligatorias en el pipeline | Entregable 7.1; RNF-NFR-164 | Atendido |
| 31 | Documentación viva generada en cada despliegue | Hoy: catálogos generados por scripts (API, pantallas, eventos). Proponemos adoptar el sitio interno de documentación viva | Entregables 17, 18, 19 | Proponemos adoptar |
| 32 | PDF al vuelo, regenerado desde el comprobante autorizado, generación aislada | Generación aislada, sin red y con límites de tiempo y memoria | DEC-092; M05 | Atendido |
| 33 | Definir cuenta, suministro y comprobante | Definidos en el glosario y en el modelo de datos | Entregable 11; M01; M05 | Atendido |
| 34 | Reglas de facturación con casos de referencia al centavo, validadas con la cooperativa | Reglas con referencia al código de ProCoop, casos de prueba y corrida paralela factura por factura con 0 diferencias sin explicar | M04; M05; T07 | Atendido |
| 35 | Modelo de cada módulo: entidades, operaciones, permisos y criterios verificables | 31 anexos, 1.058 tablas (Azure SQL), 4.193 operaciones, 471 casos de uso y criterios de aceptación | Especificación completa | Atendido |
| 36 | Experiencia: flujos de ingreso, MFA, passkeys, roles; cómo se muestran falla, espera, dato anterior y auditoría | 12 patrones, 204 familias de wireframes, prototipo navegable y estados de pantalla | Entregables 05, 25; T03 | Atendido |
| 37 | La paleta la define Estefanía: grises con un acento verde | Proponemos adoptar su paleta; la marca de cada cooperativa sigue siendo configurable | T03 | Proponemos adoptar |
| 38 | Contratos con el front: datos, formatos, permisos por sección y escenarios positivos y negativos | Permiso declarado por ruta, contratos OpenAPI y casos de prueba positivos y negativos | RNF-NFR-090; entregables 18 y 20 | Atendido |
| 39 | Conservación fiscal: comprobante autorizado o también su PDF, y plazo | También abierto en nuestra especificación: consulta al contador | T08; DEC-087 | Pendiente compartido |
| 40 | Especificación antes que velocidad; tareas con objetivo, alcance, terminado verificable y prohibiciones | 172 instrucciones con objetivo, requisitos, entregables y "terminado cuando", más 20 reglas comunes | Plan de olas | Atendido |
| 41 | El glosario fija los nombres | Glosario unificado y diccionario de vocabulario por cooperativa | Entregable 11; T03 | Atendido |
| 42 | Autor y revisor siempre distintos | Hoy: contraste externo con revisiones independientes. Proponemos adoptarlo como regla para cada entrega | Revisión externa | Proponemos adoptar |
| 43 | Stack acordado GoodApps | .NET 10, Azure SQL, React 19, Microsoft Azure | DEC-111, DEC-112, DEC-113 | Atendido |

### 7.3 Comparación de recuperación ante fallas

| Escenario | Propuesta del equipo anterior | Especificación vigente |
|---|---|---|
| Falla de una zona | RPO 0, RTO menos de 1 h | Sin meta propia por escenario; disponibilidad 99,5 % mensual |
| Error en una cooperativa | RPO minutos, RTO 4 h | RPO 15 min, RTO 4 h por cooperativa |
| Pérdida de la región | RPO hasta 1 h, RTO 24 h | Sin meta propia por escenario; RTO 8 h para la plataforma completa |

La especificación vigente fija metas generales y no las separa por escenario. Separarlas como lo hace el equipo anterior es una mejora que conviene incorporar.

---

## 8. Aportes externos incorporados: el contraste del documento NucleoTransversal

Se revisó el documento externo "NucleoTransversal-Modelo" (1.446 líneas, 17 capítulos, del 6-11-2026) contra toda la especificación y el relevamiento de ProCoop.

### 8.1 Resultado de los 112 temas evaluados

| Veredicto | Cantidad |
|---|---|
| Coincide | 47 |
| Coincide en parte (el documento aporta un detalle) | 44 |
| Contradice una decisión vigente | 15 |
| Error del documento | 3 |
| Nuevo y útil | 1 |
| Nuevo y descartable | 2 |

Además: de sus 58 definiciones pendientes, 49 ya estaban respondidas en la especificación; se detectaron unos 50 errores de hecho sobre ProCoop, casi todos menores.

### 8.2 Lo que se incorporó (10-11-2026)

Las 11 incorporaciones de prioridad alta se aprobaron de a una y quedaron como decisiones DEC-093 a DEC-104:

| Aporte | Qué se incorporó |
|---|---|
| A1 | La factura agrupada no mezcla servicios con liquidación de servicios públicos y servicios de factura común |
| A2 | Validación normativa de la vía de autorización de la liquidación de servicios públicos, con consulta al contador |
| A3 | Registro de obligaciones y exenciones propias de la cooperativa |
| A4 | Varias entidades jurídicas por cooperativa en todo el modelo (cooperativa y mutual a la vez) |
| A5 | Persona única en todos los maestros: proveedores, vendedores, choferes y profesionales |
| A6 | Origen correcto de las sucursales en la migración |
| A7 | Regla para personas sin ningún documento en la migración |
| A8 | Verificador nocturno de integridad referencial |
| A9 | Fondos de cajas sin rendir en la posición diaria de tesorería |
| A10 | Uso del suministro como condición opcional de la alícuota de IVA |
| A11 | Más secretos que la migración suprime y escaneo previo de la base de origen |

### 8.3 Las 14 propuestas rechazadas se revisaron una por una

| Resultado | Cantidad | Detalle |
|---|---|---|
| Se mantiene el rechazo | 10 | Con su fundamento documentado |
| Se adopta la propuesta externa | 1 | El comprobante rechazado por ARCA vuelve a borrador y libera su número (DEC-107) |
| Se ajusta | 2 | Fórmulas en tarifas con preferencia declarativa y justificación obligatoria (DEC-105); tope de vencimientos como parámetro (DEC-106) |
| Queda para analizar a futuro | 1 | GestionApps como sistema base, cuando haya información (DEC-108) |

Mensaje: no se descartó nada sin analizarlo. Lo que aporta se incorpora, lo que no se rechaza con fundamento escrito, y lo dudoso queda registrado.

---

## 9. Decisiones y lo que necesitamos de ustedes

### 9.1 Estado de las decisiones

| Indicador | Valor |
|---|---|
| Decisiones registradas | 108 (106 vigentes) |
| Preguntas de decisión | 593 |
| Respondidas | 98 |
| Con opción recomendada vigente, revisable en cualquier momento | 490 |
| Otro estado | 5 |

Las opciones recomendadas están implementadas detrás de parámetros cambiables, así que revisarlas no obliga a rehacer el análisis.

### 9.2 Validaciones que solo pueden hacer ustedes o la cooperativa

1. Formalizar a Laguna Larga como piloto y confirmar sus servicios y el orden de migración.
2. Validar con la asesoría legal 8 parámetros con contenido jurídico, los plazos de prescripción (24 meses para facturas periódicas y 60 para el resto) y los plazos de conservación de datos.
3. Revisar las decisiones asumidas de mayor impacto, empezando por las de las primeras olas.
4. Fijar la línea de base y las metas de impacto: socios digitales, cobros digitales, tiempo de reclamos, morosidad, ciclo de facturación, satisfacción y costo total.
5. Elegir el proveedor de firma digital.
6. Confirmar los convenios vigentes con entes recaudadores, pasarelas y bancos.
7. Consultar al contador: conservación fiscal, vía de autorización de la liquidación de servicios públicos y alícuota de IVA según el uso del suministro.

### 9.3 Temas a decidir juntos

| Tema | Propuesta del equipo anterior | Especificación vigente | Argumento a favor de lo vigente | Argumento a favor de lo anterior | Cómo proponemos resolverlo |
|---|---|---|---|---|---|
| Datos de cada cooperativa | Acordado nov. 2026 | Azure SQL compartido + `TenantId` + pruebas de aislamiento (DEC-110) | Operación SaaS unificada; migración y BI con reglas de plataforma | — | Vigente en T01, T08 |
| Primer servicio | Energía | Internet de punta a punta y energía en O7 | Ciclo más corto para validar toda la plataforma | La piloto es eléctrica y de gas | Evaluar adelantar energía y gas; la especificación ya cubre ambos |
| Tecnología | Acordado nov. 2026 | .NET 10, Azure SQL, React 19, Azure (DEC-111–113) | Especificación funcional intacta; stack alineado al pipeline GoodApps | — | Vigente en `00` §5 y `06-impacto-adaptacion-stack-goodapps.md` |
| Cooperativa grande con instalación propia | Prevista | No contemplada | — | Requisito de cooperativas grandes | Agregar como modalidad si se confirma la demanda |

La especificación funcional (requisitos, reglas, procesos, pantallas, casos de uso y casos de prueba) no depende de estas decisiones: sirve igual con cualquiera de las opciones.

---

## 10. Plan de construcción y hoja de ruta

### 10.1 Las 12 olas

| Ola | Qué entrega | Hito de salida | Instrucciones | Requisitos nuevos |
|---|---|---|---|---|
| O0 | Fundaciones: seguridad, ingreso, aislamiento, auditoría, marca y vocabulario | Cooperativa de demostración con ingreso seguro y aislamiento verificado | 21 | 305 |
| O1 | Plataforma y configuración: usuarios, roles, parámetros, maestros, aprobaciones, documentos, migración base | Alta asistida de una cooperativa con su configuración publicada | 20 | 458 |
| O2 | Socios, servicios y portal | Un socio se registra y solicita un servicio desde el sitio | 19 | 614 |
| O3 | Técnica: factibilidad, órdenes de trabajo, instalación, campo, activación | El servicio queda instalado y activo | 13 | 319 |
| O4 | Tarifas, facturación y fiscal | Primera factura electrónica autorizada | 16 | 424 |
| O5 | Cobranza y tesorería operativa, núcleo contable | Pago en línea imputado y registrado contablemente | 14 | 469 |
| O6 | Mora y atención avanzada | Recorrido completo de punta a punta | 11 | 244 |
| O7 | Servicios medidos, corrida paralela y corte comercial | Facturación de energía con lecturas; corte comercial de electricidad, gas y prepago de Laguna Larga | 12 | 298 |
| O8 | Gestión administrativa | Cierre contable mensual | 15 | 462 |
| O9 | Personal y sueldos | Liquidación mensual con sus declaraciones | 9 | 163 |
| O10 | Institucional y servicios sociales | Asamblea y servicios sociales operativos | 14 | 383 |
| O11 | Información, integración y reemplazo | Corte administrativo y apagado de ProCoop | 8 | 65 |
| **Total** | | | **172** | **4.204** |

### 10.2 Correspondencia con las fases del equipo anterior

| Fase del equipo anterior | Estado según sus documentos | Olas equivalentes |
|---|---|---|
| 1. Fundaciones | En curso (documentación) | O0 |
| 2. Plataforma | Plan aceptado, sin código | O0 y O1 |
| 3. Seguridad | No iniciada | O0 y O1 |
| 4. Personas y padrón | No iniciada | O2 |
| 5. Migrador de ProCoop | No iniciada | Base en O0 y O1, migración real después de O7, repetible en O11 |
| 6. Energía | No iniciada | O4, O5, O6 y O7 |

Estado declarado por el equipo anterior: sin código de negocio, nada desplegado y el entorno de agentes de IA sin instalar.

### 10.3 Reemplazo de ProCoop por etapas

| Etapa | CoopApps es el sistema de registro de | ProCoop sigue con |
|---|---|---|
| Ensayos | Nada (pruebas en ambiente de ensayo) | Todo |
| Paralelo comercial | Nada (CoopApps simula y compara factura por factura) | Todo |
| Corte comercial | Personas, cuentas, contratos, tarifas, medición, facturación, fiscal de ventas, cuenta corriente, cobranza, mora, atención, técnica, portal | Compras, stock, tesorería, contabilidad oficial, sueldos, institucional y social |
| Corte administrativo | Además: compras, stock, tesorería, contabilidad y retenciones | Sueldos, institucional y social si no se cortaron |
| Apagado | Todo | Solo consulta hasta el cierre del ejercicio |

Criterio para reemplazar la facturación: 2 ciclos consecutivos aprobados por servicio, con 0 diferencias sin explicar y 99,9 % o más de facturas emparejadas. Hay plan de vuelta atrás con doble aprobación hasta la primera emisión fiscal real.

---

## 11. El plazo: un dato que se puede medir

### 11.1 Lo que hay hoy

- Ninguno de los dos planes tiene fechas de construcción comprometidas. Los documentos del equipo anterior no tienen duraciones; la especificación vigente ordena por olas sin fechas (DEC-006).
- El borrador inicial del 3/11 citaba paralelo completo el 1/3/2027 y reemplazo de ProCoop el 1/7/2027; esas fechas quedaron sin efecto.
- La estimación de la especificación da 17.504 puntos de complejidad y 37.666 horas-persona esperadas (rango de 26.256 a 59.711), con un supuesto de 2 horas por punto: unas 314 semanas con 4 personas.
- Con los mismos supuestos, el alcance del equipo anterior hasta energía equivale a entre 20.400 y 25.800 horas, entre 170 y 215 semanas con 4 personas. Con supuestos iguales, ninguno de los dos llega a 2027.

### 11.2 Por qué ese número no es la realidad

Todo depende de un supuesto: 2 horas por punto, un valor cercano al desarrollo tradicional, que el propio documento pide calibrar con las primeras instrucciones de O0. El plazo es proporcional a ese valor:

| Horas por punto | Semanas totales con 4 personas |
|---|---|
| 3,0 | 470,8 |
| 2,5 | 392,4 |
| 2,0 (supuesto actual) | 313,9 |
| 1,5 | 235,4 |
| 1,0 | 157,0 |
| 0,5 | 78,5 |

Si el análisis se hizo unas 25 veces más rápido que lo planeado, es razonable esperar que la construcción asistida quede por debajo de 2 horas por punto. Es una hipótesis: por eso se propone medirla.

### 11.3 Propuesta de calibración

1. Construir las primeras instrucciones de la ola O0 durante 2 o 3 semanas.
2. Medir las horas reales por punto: cada instrucción ya tiene su puntaje calculado.
3. Recalcular el plazo completo con el script existente y volver con una fecha basada en datos.

---

## 12. Riesgos y mitigación

| N.º | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R-01 | Calidad de los datos heredados de ProCoop | Alto | Diagnóstico de calidad, cola de saneamiento con aprobación humana, conciliaciones y corrida paralela con 2 ciclos aprobados |
| R-02 | Validaciones legales pendientes | Alto | Parámetros editables y marcados; validación legal obligatoria antes del uso productivo |
| R-03 | Reglas heredadas por confirmar ("[VERIFICAR]") | Medio | Verificación con la piloto y corrida paralela factura por factura |
| R-04 | Dependencia de servicios externos | Alto | Reintentos controlados, prevención de duplicados, operación degradada y contingencia fiscal |
| R-05 | Adopción de usuarios | Alto | Ayuda contextual, vocabulario propio, ambiente de prueba, capacitación y gestión del cambio |
| R-06 | Alcance amplio | Alto | Olas con hitos verificables y trazabilidad de cada requisito |
| R-07 | Piloto con servicios medidos | Medio | Ensayos de migración tempranos; primera migración real después de O7 |
| R-08 | Decisiones asumidas que pueden cambiar | Medio | Opciones detrás de parámetros; revisión priorizada antes de cada ola |
| R-09 | Convivencia de dos sistemas | Medio | Un único sistema de registro por dominio; ProCoop en solo lectura para lo cortado |
| R-10 | Privacidad y alojamiento fuera del país | Medio | Cláusulas contractuales de transferencia y contrato de encargo de tratamiento |
| R-11 | Metas de rendimiento sin medición real | Medio | Pruebas de carga antes de cerrar las olas clave y recalibración con la piloto |

Resumen: 5 riesgos de impacto alto y 6 de impacto medio, todos con mitigación definida. La especificación no asigna probabilidad a los riesgos: los gráficos no deben inventarla.

---

## 13. Prompts de las imágenes

Pedir cada una por su código después de pegar el prompt maestro. Todas en 16:9, 1920×1080, con la paleta del prompt maestro.

### IMG-01 — Portada

- **Tipo:** ilustración conceptual (generador de imágenes).
- **Prompt:** "Ilustración sobria y profesional para la portada de una presentación ejecutiva. Un pueblo argentino de llanura al atardecer suave, con tendido eléctrico, red de agua y fibra óptica representados como líneas finas verdes que confluyen en un edificio de cooperativa de servicios sencillo. Estilo ilustración plana con trazos limpios, paleta de grises con un único acento verde #2E7D32, mucho espacio libre a la izquierda para el título. Sin personas en primer plano, sin robots, sin efectos futuristas."
- **Texto en la imagen:** título "CoopApps", subtítulo "Del relevamiento al plan de construcción", y abajo "Noviembre de 2026". Si el generador deforma el texto, generarla sin texto.

### IMG-02 — Lo que nos pidieron

- **Tipo:** infografía (código o HTML).
- **Mensaje:** las cuatro prioridades del equipo anterior, cada una con cómo se atiende.
- **Composición:** cuatro tarjetas en fila, cada una con un ícono de línea, el nombre de la prioridad y una frase.
- **Texto exacto:**
  - Robustez: "Nada falla en silencio: incierto, reconsulta y conciliación".
  - Auditoría: "Registro inmutable con encadenamiento criptográfico".
  - Seguridad: "Aislamiento verificado en 7 capas entre cooperativas".
  - Modernidad: "Web y celular, claro y oscuro, con la marca de cada cooperativa".
- **Título:** "Lo que nos pidieron, y cómo lo atendemos".

### IMG-03 — Seis meses contra seis días

- **Tipo:** gráfico de barras horizontales (código).
- **Datos:** barra 1 "Plan tradicional: relevar, analizar y especificar" = 26 semanas (6 meses). Barra 2 "Trabajo realizado" = 1 semana (unos 6 días, del 2 al 7 de noviembre de 2026).
- **Composición:** barra 1 en gris medio, barra 2 en verde. Escala en semanas de 0 a 26. Etiquetas al final de cada barra: "6 meses" y "6 días".
- **Título:** "El análisis que estaba planificado en 6 meses, hecho en 6 días".
- **Nota al pie:** "Incluye relevamiento de ProCoop, especificación completa y entregables de análisis y diseño".

### IMG-04 — Su plan, fase por fase

- **Tipo:** tablero de estado (código o HTML).
- **Composición:** cuatro columnas que representan las fases del plan tradicional, de izquierda a derecha, cada una con un ícono, su estado y una línea de evidencia.
- **Texto exacto:**
  - "Relevar" — estado "Hecho" en verde — "2.728 archivos de ProCoop, 3.060 referencias al código".
  - "Analizar" — "Hecho" en verde — "341 procesos, 97,9 % de ProCoop trazado".
  - "Especificar" — "Hecho" en verde — "4.204 requisitos, 31 anexos, 5.710 casos de prueba".
  - "Validar" — "Con ustedes" en ámbar — "98 decisiones respondidas, 490 propuestas para revisar".
- **Título:** "Su plan, fase por fase".

### IMG-05 — Un relevamiento distinto (iceberg)

- **Tipo:** ilustración conceptual (generador de imágenes), con texto mínimo.
- **Prompt:** "Ilustración plana y sobria de un iceberg en el agua, vista lateral. La parte visible es pequeña; la parte sumergida es enorme y muestra, como capas internas estilizadas, líneas de código, tablas de datos y engranajes en gris. Paleta de grises con acento verde #2E7D32 en la línea de flotación. Fondo blanco. Estilo consultora, sin dramatismo."
- **Texto (agregar en PowerPoint si sale mal):** arriba del agua "Lo que cuenta una entrevista"; abajo del agua "Lo que hace realmente el sistema: 3.060 referencias al código, 1.536 parámetros, 667 tablas, defectos ocultos".
- **Título:** "No relevamos lo que la gente recuerda: relevamos lo que el sistema hace".

### IMG-06 — El relevamiento en números

- **Tipo:** infografía de indicadores (código o HTML).
- **Composición:** seis tarjetas grandes en dos filas de tres, con el número en verde y la descripción en gris.
- **Datos exactos:** "2.728" archivos de ProCoop analizados; "3.060" referencias a líneas exactas de código; "667" tablas de negocio; "1.536" parámetros catalogados uno por uno; "13" documentos de reglas de negocio; "97,9 %" de ProCoop con destino trazado.
- **Título:** "El relevamiento en números".

### IMG-07 — Defectos ocultos de ProCoop

- **Tipo:** tarjetas (código o HTML).
- **Composición:** cuatro tarjetas con borde izquierdo rojo, cada una con área, qué pasa y riesgo.
- **Texto exacto:**
  - "Mora" — "Tasas de interés superpuestas que nadie detecta" — "El socio puede pagar interés dos veces".
  - "Cobranza" — "El pago se imputa a la factura más reciente aunque ya esté paga" — "Pagos mal aplicados".
  - "Fiscal" — "Un error en una consulta impide borrar la selección anterior" — "Registros fiscales duplicados".
  - "Sueldos" — "Sin categoría, las vacaciones ignoran la antigüedad" — "Días mal calculados".
- **Título:** "Lo que nadie hubiera contado en una entrevista".
- **Pie:** "Cada hallazgo tiene su referencia exacta en el código de ProCoop".

### IMG-08 — Hoy y mañana

- **Tipo:** comparación en dos columnas (código o HTML).
- **Composición:** columna izquierda "ProCoop hoy" en gris; columna derecha "CoopApps" con acento verde; siete filas con un ícono cada una.
- **Texto exacto (izquierda → derecha):** "Instalación en cada computadora" → "En la nube, siempre actualizado"; "Servidores y copias a cargo de la cooperativa" → "Copias automáticas y restauración probada"; "Contraseñas que pueden descifrarse" → "Doble factor y bóveda cifrada"; "1.536 parámetros con números" → "Parámetros con nombre, vigencia e historial"; "Integraciones frágiles" → "Reintentos controlados y conciliación"; "Portal sobre una copia de los datos" → "Portal sobre la misma información"; "Trabajo de campo en papel" → "Aplicación de campo sin conexión".
- **Título:** "Hoy y mañana".

### IMG-09 — La especificación completa (pirámide)

- **Tipo:** pirámide o embudo invertido (código o HTML).
- **Composición:** capas de arriba hacia abajo, de lo más general a lo más detallado, con el número a la derecha de cada capa.
- **Datos exactos:** "Documento maestro: 1"; "Anexos: 31"; "Procesos: 341"; "Casos de uso: 471"; "Pantallas: 1.051"; "Colecciones de datos: 1.057"; "Requisitos funcionales: 4.204"; "Operaciones de API: 4.193"; "Casos de prueba: 5.710".
- **Título:** "Una especificación completa y trazable".
- **Pie:** "Cada requisito se puede seguir desde ProCoop hasta su caso de prueba".

### IMG-10 — El mapa del sistema

- **Tipo:** mapa de bloques (código o HTML).
- **Composición:** bloques agrupados por área, con el nombre corto de cada módulo, usando la tabla de la sección 5.1. Áreas: Socios y servicios (M01, M02, M03); Facturación y fiscal (M04, M05, M06); Cobranza y mora (M07, M08); Atención y técnica (M09, M10); Gestión administrativa (M11 a M15); Personas (M16); Institucional y social (M17, M18); Canales (M19). Debajo, una franja ancha "Transversales" con T01 a T12.
- **Título:** "19 módulos funcionales sobre 12 capacidades transversales".

### IMG-11 — Requisitos por módulo

- **Tipo:** gráfico de barras horizontales ordenado de mayor a menor (código).
- **Datos:** la columna "Requisitos funcionales" de la tabla de la sección 5.1, solo los 19 módulos M01 a M19.
- **Composición:** barras grises; resaltar en verde las cinco mayores. Etiqueta con el número al final de cada barra.
- **Título:** "Dónde está el volumen funcional".
- **Pie:** "Total de la especificación: 4.204 requisitos funcionales".

### IMG-12 — Cobertura de los entregables

- **Tipo:** barras de progreso (código).
- **Datos:** las filas de la sección 4.4, cada una al 100 %, salvo "Diagramas de estados", que muestra "615 de 631; 16 excluidas con motivo".
- **Composición:** una barra verde completa por entregable con el universo a la derecha (por ejemplo, "1.058 tablas (Azure SQL)").
- **Título:** "Cobertura completa, entregable por entregable".

### IMG-13 — Escuchamos (resumen)

- **Tipo:** gráfico de anillo con leyenda (código).
- **Datos exactos:** Atendido 30; Atendido con otra solución 2; Proponemos adoptar lo de ustedes 6; A decidir juntos 4; Pendiente compartido 1. Total 43.
- **Colores:** Atendido en verde; otra solución en verde claro; proponemos adoptar en gris carbón; a decidir en ámbar; pendiente en gris medio. Cada sector con su número y su nombre.
- **Centro del anillo:** "43 necesidades".
- **Título:** "Escuchamos: sus 43 necesidades, una por una".

### IMG-14 — Detalle de lo que pidieron

- **Tipo:** tabla visual (HTML en Claude, o código).
- **Datos:** la tabla de la sección 7.2, solo las columnas "Necesidad planteada" y "Estado". Agrupar en seis bloques: Prioridades (1 a 7), Producto (8 a 13), Identidad (14 a 17), Arquitectura (18 a 32), Temas abiertos (33 a 39) y Forma de trabajo y tecnología (40 a 43).
- **Composición:** el estado como etiqueta con texto y color. Si no entra en una imagen, dividir en dos imágenes (IMG-14a y IMG-14b).
- **Título:** "Lo que pidieron, punto por punto".

### IMG-15 — Aportes externos incorporados

- **Tipo:** dos gráficos lado a lado (código).
- **Izquierda:** barras de los 112 temas: Coincide 47; Coincide en parte 44; Contradice una decisión 15; Error del documento 3; Nuevo y útil 1; Nuevo y descartable 2.
- **Derecha:** tres tarjetas: "11 aportes incorporados (DEC-093 a DEC-104)"; "14 rechazos revisados uno por uno"; "1 propuesta externa adoptada: el comprobante rechazado por ARCA vuelve a borrador".
- **Título:** "Ninguna propuesta se descartó sin analizarla".

### IMG-16 — Arquitectura en una imagen

- **Tipo:** diagrama (HTML/SVG o código).
- **Composición:** a la izquierda, usuarios (personal, socios, campo, público, terceros); en el centro, un bloque "CoopApps" con dentro las aplicaciones (gestión web, portal y app del socio, app de campo, sitio público, API) sobre una franja "Módulos con límites estrictos"; debajo, "Procesos de fondo y colas" y "Datos aislados por cooperativa"; a la derecha, integraciones (ARCA, bancos y pasarelas, entes, redes, mensajería, mapas, IA y firma).
- **Título:** "Cómo funciona por dentro".
- **Evitar:** nombres de productos tecnológicos (para no abrir la discusión de stack en esta diapositiva).

### IMG-17 — Seguridad en capas

- **Tipo:** diagrama de capas concéntricas (código o HTML).
- **Composición:** siete anillos de afuera hacia adentro, con los datos de la cooperativa en el centro.
- **Texto exacto (de afuera hacia adentro):** "1. Límites de uso por cooperativa"; "2. Restauración de una sola cooperativa en 4 horas o menos"; "3. Aislamiento también en caché, archivos, colas y registros"; "4. Prueba de que el control existe"; "5. Pruebas de aislamiento en el 100 % de las rutas"; "6. Autorización en el servidor en cada pedido"; "7. Filtro forzado por cooperativa en toda consulta". Centro: "Datos de la cooperativa".
- **Título:** "Siete capas entre los datos de una cooperativa y otra".

### IMG-18 — Nada falla en silencio

- **Tipo:** diagrama de flujo (código o HTML).
- **Composición:** de izquierda a derecha: "Se emite la factura" → "Se envía a ARCA" → bifurcación en tres: "Autorizada: CAE registrado" (verde); "Rechazada: vuelve a borrador y libera el número" (ámbar); "Sin respuesta: queda como incierta" (ámbar) → "Se consulta a ARCA antes de reintentar" → "Se concilia". Debajo, una franja gris: "Cada paso queda en la auditoría inmutable".
- **Título:** "Nada falla en silencio".

### IMG-19 — Lo que necesitamos de ustedes

- **Tipo:** anillo y lista (código).
- **Izquierda, anillo:** 593 preguntas de decisión: 98 respondidas (verde), 490 con propuesta recomendada para revisar (ámbar), 5 en otro estado (gris). Centro: "593".
- **Derecha, lista numerada con el texto exacto:** "1. Formalizar Laguna Larga como piloto"; "2. Validación legal de 8 parámetros y plazos"; "3. Revisar las decisiones de mayor impacto"; "4. Fijar metas de impacto"; "5. Elegir el proveedor de firma digital"; "6. Confirmar convenios de cobro"; "7. Consultas al contador".
- **Título:** "Lo que solo ustedes pueden decidir".

### IMG-20 — Temas a decidir juntos

- **Tipo:** cuatro tarjetas en cuadrícula de dos por dos (HTML o código).
- **Texto exacto por tarjeta:** título del tema, "Opción A" y "Opción B", y "Cómo decidirlo".
  - "Datos de cada cooperativa" — A: "Una base por cooperativa" — B: "Plataforma compartida con aislamiento verificado" — "ADR nuevo".
  - "Primer servicio" — A: "Energía primero" — B: "Internet primero, energía en O7" — "Evaluar adelantar energía".
  - "Tecnología" — ".NET 10, Azure SQL, React 19, Microsoft Azure" (DEC-111–113; ver `06-impacto-adaptacion-stack-goodapps.md`).
  - "Cooperativa grande con instalación propia" — A: "Prevista" — B: "No contemplada" — "Agregar si hay demanda".
- **Colores:** borde ámbar en las cuatro tarjetas. No marcar ganador.
- **Título:** "Cuatro temas para decidir juntos".

### IMG-21 — Hoja de ruta

- **Tipo:** línea de tiempo horizontal sin fechas (código o HTML).
- **Datos:** las 12 olas de la sección 10.1 con su hito de salida resumido. Agrupar visualmente en cuatro tramos: "Bases" (O0, O1), "Recorrido completo" (O2 a O6), "Servicios medidos y gestión" (O7 a O10) y "Reemplazo de ProCoop" (O11).
- **Composición:** un punto por ola con su código y el hito en una línea. Destacar en verde O4 "Primera factura electrónica autorizada", O7 "Corte comercial de Laguna Larga" y O11 "Apagado de ProCoop".
- **Título:** "12 olas, cada una con un hito de negocio verificable".
- **Pie:** "Secuencia relativa, sin fechas: el plazo se calibra con la medición de la ola O0".

### IMG-22 — Reemplazo de ProCoop sin saltos

- **Tipo:** diagrama de bandas (código).
- **Datos:** las cinco etapas de la sección 10.3: Ensayos, Paralelo comercial, Corte comercial, Corte administrativo y Apagado.
- **Composición:** dos bandas horizontales, "CoopApps" (verde) que crece de izquierda a derecha y "ProCoop" (gris) que se achica, con las etapas como columnas.
- **Título:** "El reemplazo de ProCoop, por etapas y sin saltos".
- **Pie:** "Para reemplazar la facturación: 2 ciclos aprobados por servicio con 0 diferencias sin explicar".

### IMG-23 — Riesgos bajo control

- **Tipo:** tablero de dos columnas (código o HTML). No es un mapa de calor, porque la especificación no asigna probabilidad.
- **Datos:** columna "Impacto alto" con R-01, R-02, R-04, R-05, R-06; columna "Impacto medio" con R-03, R-07, R-08, R-09, R-10, R-11 (sección 12). Cada riesgo con su nombre corto y su mitigación en una línea.
- **Título:** "11 riesgos identificados, todos con mitigación".

### IMG-24 — El plazo depende de un dato que se puede medir

- **Tipo:** gráfico de barras verticales (código).
- **Datos:** tabla de la sección 11.2: 3,0 → 470,8; 2,5 → 392,4; 2,0 → 313,9; 1,5 → 235,4; 1,0 → 157,0; 0,5 → 78,5 (semanas con 4 personas).
- **Composición:** barras grises; la de 2,0 con la etiqueta "Supuesto actual, sin medir". Eje X "Horas por punto de complejidad"; eje Y "Semanas".
- **Título:** "El plazo depende de un solo dato, y se puede medir".
- **Pie:** "Propuesta: medirlo construyendo las primeras instrucciones de la ola O0".

### IMG-25 — Propuesta

- **Tipo:** tres pasos horizontales con flechas (código o HTML).
- **Texto exacto:**
  - "1. Validar" — "Sesiones cortas con la cooperativa y los stakeholders para confirmar lo especificado".
  - "2. Calibrar" — "Construir las primeras instrucciones de O0 y medir la velocidad real".
  - "3. Decidir" — "Cerrar los cuatro temas abiertos con ADR y fijar el plazo con datos".
- **Título:** "Cómo seguimos".
- **Pie:** "El análisis está hecho. Lo que falta es lo que solo ustedes pueden aportar".

---

## 14. Notas para el presentador (no proyectar)

### 14.1 Preguntas difíciles y respuestas cortas

| Pregunta | Respuesta |
|---|---|
| ¿Esto lo escribió una máquina? ¿Quién lo validó? | La IA produjo un análisis trazable contra el código de ProCoop, con referencias exactas. La validación es justamente lo que proponemos hacer con ustedes. |
| ¿Cuánto tarda la construcción? | Hay una estimación conservadora sin calibrar. Proponemos medir la velocidad real en 2 o 3 semanas y volver con una fecha basada en datos. |
| ¿Por qué una base compartida, si un filtro olvidado expone datos? | El filtro no se puede olvidar: es forzado, hay pruebas en el 100 % de las rutas que bloquean la entrega y una prueba que demuestra que el control existe. Igual lo proponemos decidir con un ADR. |
| ¿Por qué no empezar por energía si la piloto es eléctrica? | Es un punto válido y lo ponemos sobre la mesa; la especificación de energía y gas ya está completa. |
| ¿Y si queremos cambiar una decisión? | Las opciones asumidas están detrás de parámetros; cambiarlas no obliga a rehacer el análisis. |
| ¿Se descompiló ProCoop? ¿Es legal? | Llevar la respuesta consultada con la asesoría legal antes de la reunión. |
| ¿Los datos quedan fuera del país? | Sí, con cláusulas contractuales de transferencia conformes a la autoridad argentina y contrato de encargo de tratamiento (DEC-062, DEC-076). |
| ¿Qué pasa con ProCoop mientras tanto? | Corte por etapas, un solo sistema responsable de cada dominio y plan de vuelta atrás con doble aprobación. |

### 14.2 Qué no hacer

- No presentar el trabajo como un reemplazo de su plan, sino como su plan adelantado.
- No mostrar la cifra de 314 semanas sin la explicación de la calibración.
- No discutir tecnología en las primeras diapositivas: dejarlo para la de temas a decidir.
- No mostrar los documentos completos: mencionarlos y ofrecer abrir cualquier tema.
