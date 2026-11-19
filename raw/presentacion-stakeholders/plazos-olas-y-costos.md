# CoopApps — Cuánto lleva construirlo con Cursor, cómo son las olas y cuánto cuesta cada módulo

Documento para la presentación y para generar sus imágenes con Claude o ChatGPT. Muestra en cuánto tiempo se llega a un prototipo y al sistema completo, cómo se construye cada ola con la IA de Cursor y el costo aproximado de cada módulo.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | Plan de olas y prompts (`docs/especificacion/03-plan-de-olas-y-prompts.md`); estimación de esfuerzo (`docs/entregables-analisis-diseno/23-estimacion-esfuerzo.md`); modelo de costos de operación (`24-modelo-costos-operacion.md`); prototipo navegable (`25-prototipo-navegable.md`); reparto por módulo calculado con `_trabajo/gen_presentacion_esfuerzo_modulo.py`, que usa el mismo método y los mismos parámetros que el entregable 23 |
| Carácter | **Estimación paramétrica, no cotización ni compromiso de fecha** (DEC-006: las olas no tienen fechas). Las horas salen de la especificación con un método reproducible; la velocidad con IA y la tarifa por hora son supuestos declarados que se calibran con datos reales |

---

## 0. Cómo usar este documento

1. Subir este archivo a Claude o a ChatGPT.
2. Pegar el prompt maestro de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-C01", "Generá IMG-C02", etc. (sección 9).
4. Verificar cada número contra este documento. En plazos y costos un número mal copiado es lo peor que puede pasar en la reunión.

### 0.1 Prompt maestro (pegar primero)

```text
Vas a dibujar las imágenes de plazos y costos de una presentación ejecutiva para mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. El mensaje es: "el esfuerzo está medido requisito por requisito; con la IA de Cursor el plazo depende de una sola variable, la velocidad real del equipo, y esa variable se mide en las primeras semanas en lugar de adivinarla".

Te adjunto el documento. Reglas obligatorias:
1. Usá SOLO los números del documento, con los mismos decimales. No redondees distinto, no sumes ni calcules números nuevos. Si falta un dato, avisame.
2. Todo número de plazo o costo debe llevar al lado su escenario ("conservador", "IA intensiva" u "objetivo con agentes") y la leyenda "estimación, no cotización".
3. Texto visible en español de Argentina, formal y claro. Montos en dólares con el formato "USD 384.660".
4. Generá cada gráfico con código (HTML con SVG en Claude, o Python con matplotlib en ChatGPT), 1920×1080 px, fondo claro.
5. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo. Escenarios: conservador en gris #9CA3AF, IA intensiva en verde #2E7D32, objetivo con agentes en verde claro #81C784. Ámbar #B7791F solo para "a calibrar" o "supuesto". No uses rojo.
6. Tipografía sans serif limpia (Inter o similar). Títulos grandes, poco texto, mucho aire. Íconos de línea simples.
7. Nada de relojes de arena, cohetes, robots ni promesas de velocidad. Estilo sobrio, de consultora.
8. Después de cada imagen, listá los números que usaste y en qué sección del documento están.
Voy a pedirte las imágenes por código. Esperá mi pedido.
```

---

## 1. Resumen en una página

| Pregunta | Respuesta |
|---|---|
| ¿Hay algo para ver ya? | Sí. El **prototipo navegable** ya está hecho: 7 recorridos del piloto y 38 rutas, con datos ficticios. Se puede mostrar mañana |
| ¿Qué es el prototipo funcional? | El **piloto Internet de punta a punta** (olas O0 a O6): un socio se registra, pide Internet, se lo instalan, recibe la factura con CAE, paga en línea, el pago se imputa y se asienta, y la mora funciona con corte y reconexión. Es el primer hito de negocio real del plan (DEC-005) |
| ¿Cuánto esfuerzo es? | 25.644 horas-persona el prototipo funcional y 37.736 el sistema completo, con el supuesto conservador de 2 horas por punto |
| ¿Cuánto tarda con 4 personas? | Prototipo funcional: entre 12,3 meses (objetivo con agentes) y 49,2 meses (conservador); 24,6 meses con IA intensiva. Sistema completo: entre 18,1 y 72,5 meses; 36,3 con IA intensiva |
| ¿Cuánto cuesta? | Con USD 30 por hora (supuesto): prototipo funcional entre USD 192.330 y USD 769.320; sistema completo entre USD 283.020 y USD 1.132.080. Con IA intensiva: USD 384.660 y USD 566.040 |
| ¿De qué depende? | De una sola variable: cuántas horas lleva cada punto de trabajo con Cursor. Se mide en las primeras 2 a 5 semanas con los 4 primeros prompts de O0 |
| ¿Qué proponemos? | Arrancar O0, medir la velocidad real en esas semanas y recién ahí fijar plazo y presupuesto con datos |

---

## 2. Cómo se mide el esfuerzo

El esfuerzo no se estimó "a ojo". Cada uno de los 172 prompts de construcción lista los requisitos que implementa, y cada requisito y cada artefacto suma puntos según su complejidad (entregable 23, §1 y §2):

| Qué se construye | Puntos |
|---|---|
| Requisito funcional de prioridad Núcleo | 3,0 |
| Requisito funcional Estándar | 2,0 |
| Requisito funcional de Extensión | 1,0 |
| Requisito ya construido que otro prompt amplía | 0,25 del peso del requisito |
| Requisito no funcional citado | 1,0 |
| Colección de datos (esquema, validaciones, índices y prueba de aislamiento) | 2,0 |
| Pantalla (con estados, filtros, modales y ayuda) | 1,5 |
| Endpoint de API (contrato, validación y prueba) | 0,5 |
| Integración externa (conector con simulador, reintentos e idempotencia) | 6,0 |

**Qué se construye en total:**

| Concepto | Cantidad |
|---|---|
| Prompts de construcción | 172 |
| Requisitos funcionales | 4.213 (especificación vigente; el entregable 23 se calculó con 4.204, antes de las decisiones DEC-093 a DEC-108) |
| Requisitos no funcionales citados | 292 |
| Colecciones de datos | 1.057 |
| Pantallas | 1.051 |
| Endpoints de API | 2.223 |
| Integraciones externas | 106 |
| **Puntos** | **17.504** (entregable 23) |

**De puntos a horas:** horas = puntos × horas por punto. El entregable 23 usa **2,0 horas por punto** como supuesto conservador. Esas horas ya incluyen desarrollo con Cursor, revisión, pruebas automatizadas y PR. Para cada prompt calcula un rango: optimista (0,75 del probable), probable y pesimista (1,6 del probable o más, según las preguntas por validar y las integraciones). Con eso saca el esperado.

**No incluye** (entregable 23, §2): gestión del proyecto, homologaciones externas (ARCA, bancos, entes), migración real de datos de cooperativas, capacitación ni soporte posterior.

---

## 3. Tres escenarios de velocidad con IA

Toda la diferencia de plazo y costo está en una variable: **horas-persona por punto**. Cursor escribe el código siguiendo el prompt; las personas lo dirigen, revisan, prueban y aprueban. Cuanto más trabajo hace el agente con calidad aceptada, menos horas humanas por punto.

| Escenario | Horas por punto | Qué supone | Estado |
|---|---|---|---|
| Conservador | 2,0 | El supuesto del entregable 23: desarrollo asistido con Cursor, con mucha intervención humana | Base documentada |
| IA intensiva | 1,0 | Los agentes de Cursor escriben la mayor parte del código y de las pruebas; las personas revisan y corrigen | Supuesto **a calibrar** |
| Objetivo con agentes | 0,5 | Agentes que ejecutan los prompts casi completos; las personas se concentran en revisión, integración y decisiones | Supuesto **a calibrar** |

Ejemplo para dimensionar: un requisito Núcleo vale 3 puntos. Con 2,0 horas por punto son 6 horas-persona, incluidas sus pruebas y su revisión; con 1,0 son 3 horas, y con 0,5 son 1,5 horas.

**Cómo se calibra.** Los 4 primeros prompts de O0 (monorepo y Docker, CI y pruebas, núcleo compartido, multitenancy y aislamiento) suman 266,2 puntos. Con 4 personas se ejecutan en unas 4,4 semanas en el escenario conservador y en unas 2,2 semanas con IA intensiva. Al terminarlos se divide el tiempo real por los puntos y se obtiene el número verdadero. Con ese dato se recalculan plazo y costo de todas las olas: el script ya existe.

---

## 4. Los niveles de prototipo

| Nivel | Qué es | Estado | Esfuerzo |
|---|---|---|---|
| 1. Prototipo navegable | HTML estático, sin servidor, con 7 recorridos guiados del piloto y 38 rutas: personal, socio y técnico; tema oscuro del sistema de gestión y app del socio. Datos ficticios | **Hecho** (`docs/entregables-analisis-diseno/25-prototipo-navegable/index.html`) | Ya invertido |
| 2. Primer demostrable funcional | Olas O0 y O1: plataforma, seguridad, multitenancy, alta asistida de una cooperativa con usuarios, roles y configuración publicada | Por construir | 7.586 horas (conservador) |
| 3. Prototipo funcional: piloto Internet | Olas O0 a O6: el ciclo completo de un servicio de Internet, desde la solicitud del socio hasta la mora, con factura electrónica y pago en línea reales | Por construir | 25.584 horas (conservador, entregable 23) |
| 4. Sistema completo | Olas O0 a O11: servicios medidos, ERP administrativo, sueldos, institucional y social, BI y API, corte de ProCoop | Por construir | 37.666 horas (conservador, entregable 23) |

---

## 5. Las olas

### 5.1 Qué construye cada ola y qué se puede mostrar al terminarla

| Ola | Contenido | Hito demostrable al terminar | Prompts | Requisitos | Horas (conservador) |
|---|---|---|---|---|---|
| O0 | Fundaciones: monorepo, CI, multitenancy, identidad base, eventos y colas, bóveda, auditoría, archivos, PDF, design system, diccionario, notificaciones | Cooperativa de demostración con ingreso, menú filtrado por permisos y la suite de aislamiento entre cooperativas en verde | 21 | 305 | 3.101 |
| O1 | Plataforma SaaS e identidad completas, configuración versionada, maestros, geografía, conexiones, aprobaciones, expediente, reportes base, herramienta de migración base | Alta asistida de una cooperativa con usuarios, roles y configuración publicada | 20 | 459 | 4.485 |
| O2 | Personas y cuentas, catálogo de servicios, asociados, solicitudes, comunidad, sitio público, registro y portal del socio | Un socio se registra en el sitio y pide Internet | 19 | 617 | 5.350 |
| O3 | Técnica del piloto: factibilidad, agenda, órdenes, instalación, comodato, stock serializado, app de campo sin conexión, aprovisionamiento, reclamos | El servicio queda instalado, con el equipo en comodato y el aprovisionamiento confirmado | 13 | 319 | 2.492 |
| O4 | Tarifas, facturación, ARCA, IVA e Ingresos Brutos de Córdoba, cargos por operación | Primera factura electrónica con CAE | 16 | 425 | 3.882 |
| O5 | Cuenta corriente, caja, entes, débitos, pasarelas, tesorería básica, núcleo contable, capital mínimo | Pago en línea imputado, rendido y asentado | 14 | 470 | 4.395 |
| O6 | Mora, suspensión, corte y reconexión, convenios, garantías, incobrables, IA de atención, omnicanal | **Piloto Internet completo de punta a punta** | 11 | 244 | 1.879 |
| O7 | Servicios medidos: medición, lecturas, telemedición, prepago, tarifas medidas, reguladores, GIS y obras; migración, paralelo y corte comercial | Facturación de energía con lecturas; herramientas de paralelo y corte comercial listas para electricidad, gas y prepago de la piloto | 12 | 298 | 2.662 |
| O8 | ERP administrativo: compras, stock, tesorería y contabilidad completas, regímenes informativos, ventas | Cierre contable mensual | 15 | 465 | 3.673 |
| O9 | Personal y sueldos | Liquidación mensual con F.931 y libro de sueldos digital, dos períodos en paralelo | 9 | 163 | 1.598 |
| O10 | Institucional, servicios sociales, flota, telefonía, TV, fabricación, turnero, agente local | Asamblea y servicios sociales operativos | 14 | 383 | 3.237 |
| O11 | BI, generador de reportes, API para terceros, pasarelas restantes, migración repetible con históricos | Corte administrativo y apagado de ProCoop en una cooperativa | 8 | 65 | 913 |
| **Total** | | | **172** | **4.213** | **37.666** |

Las horas por ola son las del entregable 23 (con 4.204 requisitos). Los requisitos por ola son los del plan vigente (versión 1.2).

### 5.2 Cuándo se llega a cada hito (4 personas, 30 horas productivas por semana cada una)

Meses acumulados desde el inicio, según el escenario:

| Hito al cerrar la ola | Conservador (2,0) | IA intensiva (1,0) | Objetivo con agentes (0,5) |
|---|---|---|---|
| O0 Fundaciones | 6,0 | 3,0 | 1,5 |
| O1 Alta de una cooperativa | 14,6 | 7,3 | 3,6 |
| O2 El socio se registra y pide Internet | 24,9 | 12,4 | 6,2 |
| O3 Servicio instalado | 29,7 | 14,8 | 7,4 |
| O4 Primera factura con CAE | 37,2 | 18,6 | 9,3 |
| O5 Pago en línea imputado y asentado | 45,6 | 22,8 | 11,4 |
| **O6 Prototipo funcional: piloto Internet completo** | **49,2** | **24,6** | **12,3** |
| O7 Servicios medidos y corte comercial | 54,4 | 27,2 | 13,6 |
| O8 Cierre contable mensual | 61,4 | 30,7 | 15,4 |
| O9 Sueldos en paralelo | 64,5 | 32,3 | 16,1 |
| O10 Institucional y social | 70,7 | 35,4 | 17,7 |
| **O11 Sistema completo y apagado de ProCoop** | **72,5** | **36,3** | **18,1** |

Semanas equivalentes (para quien prefiera semanas): prototipo funcional 213,2 / 106,6 / 53,3; sistema completo 313,9 / 157,0 / 78,5.

### 5.3 Con un equipo más grande

| Equipo | Escenario | Prototipo funcional (semanas) | Sistema completo (semanas) |
|---|---|---|---|
| 4 personas | Conservador | 213,2 | 313,9 |
| 4 personas | IA intensiva | 106,6 | 157,0 |
| 4 personas | Objetivo con agentes | 53,3 | 78,5 |
| 6 personas | Conservador | 142,1 | 209,3 |
| 6 personas | IA intensiva | 71,1 | 104,6 |
| 6 personas | Objetivo con agentes | 35,5 | 52,3 |

Un equipo más grande acorta el plazo pero **no baja el costo**: las horas son las mismas. Además el plazo no escala en forma lineal (coordinación, revisiones, dependencias), así que las cifras de 6 personas son un piso. El entregable 23 (§6) identifica qué se puede hacer en paralelo: O7 con O8 si hay dos equipos, y O9 con parte de O10.

### 5.4 Cómo se trabaja una ola con Cursor

1. **Un prompt por vez, en orden.** Cada uno de los 172 prompts tiene cuatro partes fijas: OBJETIVO, IMPLEMENTAR (los requisitos exactos), ENTREGABLES y TERMINADO CUANDO. Cursor lee solo lo que el prompt indica de la especificación.
2. **Reglas comunes R1 a R20**, iguales para todos los prompts. Por ejemplo:
   - no se inventa nada: si falta un dato, se registra la pregunta y se implementa la opción recomendada como parámetro;
   - todo texto de pantalla sale del diccionario;
   - el dinero nunca se maneja como número de coma flotante;
   - toda operación económica es idempotente y queda auditada.
3. **Pruebas obligatorias en cada prompt:**
   - pruebas unitarias;
   - pruebas de integración con base de datos real;
   - permisos negativos;
   - aislamiento entre cooperativas;
   - idempotencia;
   - recorrido de punta a punta.

   Cada prueba cita el requisito que verifica.
4. **Una rama y un PR por prompt.** El PR lista qué se implementó, qué preguntas se asumieron y qué pruebas se agregaron. Una persona lo revisa y lo aprueba. Si falla la suite de aislamiento, no se fusiona.
5. **Trazabilidad automática.** Un control (`trace:check`) falla si un requisito no tiene prueba o si una prueba cita un requisito inexistente.
6. **Cierre de ola.** El último prompt de cada ola integra todo, corre el recorrido completo y verifica el hito. Recién entonces empieza la ola siguiente.

**Equipo sugerido de 4 personas** (propuesta, no está en la especificación): un líder técnico que revisa la arquitectura y aprueba los PR; dos desarrolladores que conducen los agentes de Cursor y corrigen; y una persona de calidad y negocio que valida los recorridos con la cooperativa y responde las preguntas abiertas.

---

## 6. Costo por módulo

### 6.1 Supuestos de costo

| Supuesto | Valor | Estado |
|---|---|---|
| Costo de una hora-persona de desarrollo | **USD 30** | **Supuesto a reemplazar** por la tarifa real del equipo. Todos los costos de esta sección son horas × tarifa, así que cambiarla es una regla de tres |
| Reparto por módulo | Las horas de cada prompt se reparten entre los módulos según lo que construye de cada uno (requisitos, pantallas, endpoints, colecciones e integraciones); los prompts de cierre de ola, según la mezcla de su ola | Método declarado (`gen_presentacion_esfuerzo_modulo.py`) |
| Requisitos no funcionales | Se asignan a T08 | Método declarado |
| Colecciones del modelo de datos | Se asignan al módulo dueño de cada colección; por eso T05 no aparece con costo propio | Método declarado |

El reparto por módulo usa la especificación vigente (4.213 requisitos): suma 37.736 horas, 0,2 % más que las 37.666 del entregable 23.

### 6.2 Sistema completo, por módulo

Horas esperadas en el escenario conservador y costo en los tres escenarios, con USD 30 por hora.

| Módulo | Ola principal | Horas (conservador) | Costo conservador (2,0) | Costo IA intensiva (1,0) | Costo objetivo con agentes (0,5) |
|---|---|---|---|---|---|
| T01 Plataforma SaaS | O0–O1 | 1.428 | USD 42.840 | USD 21.420 | USD 10.710 |
| T02 Identidad, roles y auditoría | O0–O1 | 958 | USD 28.740 | USD 14.370 | USD 7.185 |
| T03 Experiencia, marca y vocabulario | O0 | 1.331 | USD 39.930 | USD 19.965 | USD 9.982 |
| T04 Configuración y parámetros | O1 | 1.382 | USD 41.460 | USD 20.730 | USD 10.365 |
| T06 Integraciones | O0–O1 | 962 | USD 28.860 | USD 14.430 | USD 7.215 |
| T07 Migración desde ProCoop | O1 | 761 | USD 22.830 | USD 11.415 | USD 5.708 |
| T08 No funcionales y seguridad | O0–O1 | 1.068 | USD 32.040 | USD 16.020 | USD 8.010 |
| T09 Comunidad y comunicaciones | O2 | 1.507 | USD 45.210 | USD 22.605 | USD 11.302 |
| T10 Reportes, BI y API | O1, O11 | 1.144 | USD 34.320 | USD 17.160 | USD 8.580 |
| T11 Flujos, eventos y documentos | O0–O2 | 1.420 | USD 42.600 | USD 21.300 | USD 10.650 |
| M01 Personas, titulares y cuentas | O2 | 1.376 | USD 41.280 | USD 20.640 | USD 10.320 |
| M02 Catálogo de servicios | O2 | 1.010 | USD 30.300 | USD 15.150 | USD 7.575 |
| M03 Medición y consumos | O7 | 1.168 | USD 35.040 | USD 17.520 | USD 8.760 |
| M04 Tarifas y motor de cálculo | O4, O7 | 1.052 | USD 31.560 | USD 15.780 | USD 7.890 |
| M05 Facturación | O4 | 1.556 | USD 46.680 | USD 23.340 | USD 11.670 |
| M06 Fiscal e impuestos | O4, O8 | 1.598 | USD 47.940 | USD 23.970 | USD 11.985 |
| M07 Cuenta corriente y cobranza | O5 | 2.015 | USD 60.450 | USD 30.225 | USD 15.112 |
| M08 Mora y financiación | O6 | 1.757 | USD 52.710 | USD 26.355 | USD 13.178 |
| M09 Atención al socio | O2, O3, O10 | 1.438 | USD 43.140 | USD 21.570 | USD 10.785 |
| M10 Técnica, campo y redes | O3, O7 | 2.114 | USD 63.420 | USD 31.710 | USD 15.855 |
| M11 Ventas y presupuestos | O4, O8 | 708 | USD 21.240 | USD 10.620 | USD 5.310 |
| M12 Compras y proveedores | O8 | 953 | USD 28.590 | USD 14.295 | USD 7.148 |
| M13 Stock, activos y fabricación | O3, O8 | 1.019 | USD 30.570 | USD 15.285 | USD 7.642 |
| M14 Tesorería y bancos | O5, O8 | 1.522 | USD 45.660 | USD 22.830 | USD 11.415 |
| M15 Contabilidad | O5, O8 | 1.347 | USD 40.410 | USD 20.205 | USD 10.102 |
| M16 Personal y sueldos | O9 | 1.482 | USD 44.460 | USD 22.230 | USD 11.115 |
| M17 Institucional | O10 | 967 | USD 29.010 | USD 14.505 | USD 7.252 |
| M18 Servicios sociales y flota | O10 | 1.221 | USD 36.630 | USD 18.315 | USD 9.158 |
| M19 Portal del socio y sitio público | O2 | 1.472 | USD 44.160 | USD 22.080 | USD 11.040 |
| **Total** | | **37.736** | **USD 1.132.080** | **USD 566.040** | **USD 283.020** |

"Ola principal" son las olas que concentran al menos el 20 % de las horas del módulo.

### 6.3 Prototipo funcional (olas O0 a O6), por módulo

Solo la parte de cada módulo que se construye hasta el piloto Internet completo.

| Módulo | Horas en O0–O6 (conservador) | Costo conservador (2,0) | Costo IA intensiva (1,0) | Costo objetivo con agentes (0,5) |
|---|---|---|---|---|
| T01 Plataforma SaaS | 1.402 | USD 42.060 | USD 21.030 | USD 10.515 |
| T02 Identidad, roles y auditoría | 947 | USD 28.410 | USD 14.205 | USD 7.102 |
| T03 Experiencia, marca y vocabulario | 1.331 | USD 39.930 | USD 19.965 | USD 9.982 |
| T04 Configuración y parámetros | 1.301 | USD 39.030 | USD 19.515 | USD 9.758 |
| T06 Integraciones | 904 | USD 27.120 | USD 13.560 | USD 6.780 |
| T07 Migración desde ProCoop | 569 | USD 17.070 | USD 8.535 | USD 4.268 |
| T08 No funcionales y seguridad | 1.031 | USD 30.930 | USD 15.465 | USD 7.732 |
| T09 Comunidad y comunicaciones | 1.502 | USD 45.060 | USD 22.530 | USD 11.265 |
| T10 Reportes, BI y API | 616 | USD 18.480 | USD 9.240 | USD 4.620 |
| T11 Flujos, eventos y documentos | 1.323 | USD 39.690 | USD 19.845 | USD 9.922 |
| M01 Personas, titulares y cuentas | 1.292 | USD 38.760 | USD 19.380 | USD 9.690 |
| M02 Catálogo de servicios | 840 | USD 25.200 | USD 12.600 | USD 6.300 |
| M03 Medición y consumos | 0 | USD 0 | USD 0 | USD 0 |
| M04 Tarifas y motor de cálculo | 703 | USD 21.090 | USD 10.545 | USD 5.272 |
| M05 Facturación | 1.446 | USD 43.380 | USD 21.690 | USD 10.845 |
| M06 Fiscal e impuestos | 868 | USD 26.040 | USD 13.020 | USD 6.510 |
| M07 Cuenta corriente y cobranza | 1.810 | USD 54.300 | USD 27.150 | USD 13.575 |
| M08 Mora y financiación | 1.689 | USD 50.670 | USD 25.335 | USD 12.668 |
| M09 Atención al socio | 1.034 | USD 31.020 | USD 15.510 | USD 7.755 |
| M10 Técnica, campo y redes | 1.291 | USD 38.730 | USD 19.365 | USD 9.682 |
| M11 Ventas y presupuestos | 203 | USD 6.090 | USD 3.045 | USD 1.522 |
| M12 Compras y proveedores | 18 | USD 540 | USD 270 | USD 135 |
| M13 Stock, activos y fabricación | 516 | USD 15.480 | USD 7.740 | USD 3.870 |
| M14 Tesorería y bancos | 662 | USD 19.860 | USD 9.930 | USD 4.965 |
| M15 Contabilidad | 797 | USD 23.910 | USD 11.955 | USD 5.978 |
| M16 Personal y sueldos | 31 | USD 930 | USD 465 | USD 232 |
| M17 Institucional | 286 | USD 8.580 | USD 4.290 | USD 2.145 |
| M18 Servicios sociales y flota | 86 | USD 2.580 | USD 1.290 | USD 645 |
| M19 Portal del socio y sitio público | 1.146 | USD 34.380 | USD 17.190 | USD 8.595 |
| **Total** | **25.644** | **USD 769.320** | **USD 384.660** | **USD 192.330** |

Lectura: el prototipo funcional ya contiene casi toda la plataforma (T01 a T11) y el circuito comercial completo (M01, M02, M05, M07, M08, M19). Lo que queda para después son los servicios medidos (M03), el ERP administrativo completo (M12, M14, M15), sueldos (M16), institucional y social (M17, M18) y la API para terceros.

### 6.4 Si la tarifa no es USD 30

| Tarifa por hora | Prototipo conservador | Prototipo IA intensiva | Prototipo objetivo | Sistema completo conservador | Sistema completo IA intensiva | Sistema completo objetivo |
|---|---|---|---|---|---|---|
| USD 20 | USD 512.880 | USD 256.440 | USD 128.220 | USD 754.720 | USD 377.360 | USD 188.680 |
| USD 30 | USD 769.320 | USD 384.660 | USD 192.330 | USD 1.132.080 | USD 566.040 | USD 283.020 |
| USD 45 | USD 1.153.980 | USD 576.990 | USD 288.495 | USD 1.698.120 | USD 849.060 | USD 424.530 |

### 6.5 Otros costos durante la construcción

| Concepto | Referencia | Fuente y estado |
|---|---|---|
| Licencias de Cursor y consumo de modelos de IA | USD 300 por persona y mes (4 personas: USD 1.200 por mes) | **Supuesto a cotizar**. Comparado con la mano de obra es menor: con IA intensiva, el prototipo funcional en 24,6 meses suma unos USD 29.520 |
| Ambientes de desarrollo, pruebas, demo y CI en la nube | Hasta USD 2.500 por mes | Entregable 24, costo fijo "ambientes no productivos", **a cotizar**. Al principio es bastante menos |
| Gestión del proyecto, homologaciones, migración real de datos, capacitación | No estimado | Excluido del entregable 23; se agrega según la organización |

### 6.6 Después de construir: costo de operar una cooperativa

Costo mensual de referencia de operación en la nube por cooperativa (entregable 24, valores a cotizar):

| Cooperativa | Suministros | Total mensual | Sin lo trasladable (mensajería, IA y conectores que puede pagar la cooperativa directamente) | Por suministro y mes |
|---|---|---|---|---|
| Chica | 5.000 | USD 481 | USD 209 | USD 0,096 |
| Mediana | 25.000 | USD 1.986 | USD 726 | USD 0,079 |
| Grande | 150.000 | USD 10.996 | USD 3.310 | USD 0,073 |

---

## 7. Comparación con el plan original

| Aspecto | Plan original de los stakeholders | Este plan |
|---|---|---|
| Relevamiento, análisis y especificación | 6 meses | Hecho |
| Construcción | 18 sprints entre el 2/11/2026 y el 9/7/2027, con paralelo el 1/3/2027 y by-pass el 1/7/2027 | 12 olas medidas en horas, requisito por requisito |
| Base del plazo | Calendario fijado de antemano | Horas medidas, multiplicadas por una velocidad que se calibra con datos reales |
| Primer hito de negocio | Paralelo en marzo de 2027 | Piloto Internet completo al cerrar O6; corte comercial de la piloto al cerrar O7 |

El paralelo del 1/3/2027 y el by-pass del 1/7/2027 no se pueden cumplir en ningún escenario: hoy no hay código de negocio, y aun en el escenario objetivo con agentes el corte comercial (O7) llega a los 13,6 meses de empezar.

---

## 8. Riesgos de esta estimación

| Riesgo | Efecto | Cómo se controla |
|---|---|---|
| La velocidad real con IA es distinta de la supuesta | El plazo y el costo cambian en forma proporcional | Se mide en los 4 primeros prompts de O0 y se recalcula todo con el script |
| Preguntas abiertas que se responden distinto de lo asumido | Retrabajo; ya está considerado en el pesimista | Las opciones asumidas quedan como parámetros: cambiar la decisión es configuración, no código |
| Homologaciones de terceros (ARCA, bancos, pasarelas) | Esperas que no dependen del equipo | Conectores con simulador desde el día uno; gestiones de homologación en paralelo |
| Equipo que crece demasiado rápido | Más coordinación, menos velocidad por persona | Crecer después de calibrar y por olas que se puedan paralelizar |
| Tomar estas cifras como cotización | Expectativas equivocadas | Todo número va con su escenario y la leyenda "estimación, no cotización" |

---

## 9. Prompts de imágenes

### IMG-C01 — Lo que ya hay y lo que viene

```text
Generá IMG-C01 con código (HTML con SVG).
Título: "Del prototipo navegable al sistema completo".
Cuatro escalones de izquierda a derecha, cada uno más alto (tabla de la sección 4):
1. "Prototipo navegable" · "7 recorridos, 38 rutas" · sello verde "Hecho".
2. "Primer demostrable" · "O0–O1 · alta de una cooperativa".
3. "Prototipo funcional" · "O0–O6 · piloto Internet de punta a punta" · destacado con borde verde.
4. "Sistema completo" · "O0–O11 · apagado de ProCoop".
Debajo de los escalones 3 y 4, los meses con 4 personas en los tres escenarios (sección 5.2): escalón 3: "12,3 · 24,6 · 49,2 meses"; escalón 4: "18,1 · 36,3 · 72,5 meses", con la leyenda de colores de escenario.
Pie: "Estimación, no cotización. El escenario real se mide en las primeras semanas".
```

### IMG-C02 — Las 12 olas y sus hitos

```text
Generá IMG-C02 con código: una línea de tiempo horizontal con las 12 olas (tabla de la sección 5.1).
Cada ola es un tramo con su código, nombre corto y, debajo, el hito demostrable en una línea.
Usá como escala los meses acumulados del escenario IA intensiva (sección 5.2: 3,0 · 7,3 · 12,4 · 14,8 · 18,6 · 22,8 · 24,6 · 27,2 · 30,7 · 32,3 · 35,4 · 36,3).
Marcá con una bandera verde el cierre de O6 ("Prototipo funcional: piloto Internet completo") y con otra el cierre de O11 ("Sistema completo").
Arriba a la derecha: "Escenario IA intensiva, 4 personas. Estimación, no cotización".
```

### IMG-C03 — El plazo según la velocidad real

```text
Generá IMG-C03 con código: barras horizontales agrupadas.
Título: "El plazo depende de una sola variable".
Dos grupos: "Prototipo funcional (O0–O6)" y "Sistema completo (O0–O11)". En cada grupo, tres barras con los meses de la sección 5.2: conservador (49,2 y 72,5), IA intensiva (24,6 y 36,3) y objetivo con agentes (12,3 y 18,1), con los colores de escenario y el valor al final de cada barra.
A la derecha, recuadro ámbar: "Horas por punto: 2,0 · 1,0 · 0,5. Se mide con los primeros 4 prompts de O0 (266,2 puntos)".
Pie: "4 personas, 30 horas productivas por semana. Estimación, no cotización".
```

### IMG-C04 — Cómo se construye una ola con Cursor

```text
Generá IMG-C04 con código: diagrama de ciclo (sección 5.4).
Título: "Cómo se construye cada ola con Cursor".
Seis pasos en círculo, con ícono de línea:
1. "Prompt con objetivo, requisitos exactos y criterio de terminado"
2. "Cursor escribe código y pruebas siguiendo las reglas R1 a R20"
3. "Pruebas automáticas: permisos, aislamiento, idempotencia, recorrido completo"
4. "Una persona revisa y aprueba el PR"
5. "Trazabilidad: cada requisito con su prueba"
6. "Siguiente prompt"
Al costado, una caja aparte: "Cierre de ola: integración, recorrido completo y hito demostrable".
Abajo, una franja con los números: "172 prompts · 4.213 requisitos · 1.051 pantallas · 2.223 endpoints · 106 integraciones".
```

### IMG-C05 — Costo por módulo

```text
Generá IMG-C05 con código: barras horizontales ordenadas de mayor a menor con los 29 módulos de la tabla 6.2, usando la columna "Costo IA intensiva (1,0)".
Cada barra con el código y nombre corto del módulo y el monto al final ("USD 31.710").
Colores: transversales (T) en verde oscuro #1B5E20, funcionales (M) en verde #2E7D32.
Total destacado arriba a la derecha: "Sistema completo: USD 566.040 (IA intensiva)".
Debajo, en gris: "Conservador USD 1.132.080 · Objetivo con agentes USD 283.020".
Recuadro ámbar: "Supuesto: USD 30 por hora. Estimación, no cotización".
```

### IMG-C06 — Qué entra en el prototipo funcional

```text
Generá IMG-C06 con código: barras horizontales apiladas por módulo (los 29 módulos de las tablas 6.2 y 6.3), con las horas del escenario conservador.
Cada barra tiene dos partes: "En el prototipo (O0–O6)" en verde, con las horas de la tabla 6.3, y "Después (O7–O11)" en gris claro, con la diferencia entre la tabla 6.2 y la 6.3.
Título: "El prototipo funcional ya trae la plataforma y el circuito comercial completo".
Totales arriba: "Prototipo: 25.644 horas · Sistema completo: 37.736 horas".
Pie: "Horas esperadas, escenario conservador".
```

### IMG-C07 — Costo del prototipo y del sistema en tres escenarios

```text
Generá IMG-C07 con código: dos tarjetas grandes lado a lado.
Tarjeta 1 "Prototipo funcional (O0–O6)": tres filas, una por escenario, con el monto (tabla 6.3): conservador USD 769.320, IA intensiva USD 384.660, objetivo con agentes USD 192.330.
Tarjeta 2 "Sistema completo (O0–O11)": conservador USD 1.132.080, IA intensiva USD 566.040, objetivo con agentes USD 283.020.
Debajo, una línea ámbar: "Supuesto: USD 30 por hora. Para otra tarifa, ver sección 6.4".
Pie: "No incluye gestión del proyecto, homologaciones, migración real ni capacitación. Estimación, no cotización".
```

### IMG-C08 — Medir antes de prometer

```text
Generá IMG-C08 con código.
Título: "Primero medimos, después comprometemos".
Tres pasos de izquierda a derecha:
1. "Construimos los primeros 4 prompts de O0" · "266,2 puntos" · "2 a 5 semanas".
2. "Medimos las horas reales por punto".
3. "Recalculamos plazo y costo de las 12 olas con el mismo método" · "el script ya existe".
Debajo, contraste en gris: "Plan tradicional: fechas fijadas antes de empezar". En verde: "Este plan: fechas calculadas con la velocidad medida".
```

### IMG-C09 — Operar después de construir

```text
Generá IMG-C09 con código: tres columnas (tabla 6.6).
Título: "Cuánto cuesta operar una cooperativa en la nube".
Columnas "Chica (5.000 suministros)", "Mediana (25.000)" y "Grande (150.000)", cada una con el total mensual grande (USD 481, USD 1.986, USD 10.996), debajo "sin lo trasladable" (USD 209, USD 726, USD 3.310) y "por suministro y mes" (USD 0,096, USD 0,079, USD 0,073).
Nota al pie: "Lo trasladable es mensajería, IA y conectores que la cooperativa puede contratar directamente. Valores de referencia a cotizar".
```

### IMG-C10 — Resumen para la última diapositiva

```text
Generá IMG-C10 con código. Tres números grandes en fila, cada uno con su rótulo:
- "25.644 horas" · "prototipo funcional, medido requisito por requisito"
- "24,6 meses" · "con 4 personas y IA intensiva (entre 12,3 y 49,2 según la velocidad real)"
- "USD 384.660" · "con IA intensiva y USD 30 por hora (entre USD 192.330 y USD 769.320)"
Debajo, la frase: "Proponemos arrancar O0, medir la velocidad en las primeras semanas y fijar plazo y presupuesto con datos".
Pie: "Estimación, no cotización".
```

---

## 10. Notas para el presentador

- **Mostrar primero el prototipo navegable.** Abrir `25-prototipo-navegable/index.html` en vivo vale más que cualquier gráfico de plazos.
- **No elegir un escenario por ellos.** Mostrar los tres y decir: "en 2 a 5 semanas sabemos cuál es el nuestro". Es lo más honesto y lo más difícil de rebatir.
- **El costo no baja con más gente.** Más personas acortan el plazo, pero las horas son las mismas.
- **La tarifa de USD 30 es un supuesto.** Si preguntan, se reemplaza por la tarifa real con la tabla 6.4.
- **Las fechas del plan original.** Si las mencionan, la sección 7 lo dice sin rodeos: no se pueden cumplir en ningún escenario, porque todavía no hay código de negocio. Lo que se ofrece a cambio es un plan medido.
