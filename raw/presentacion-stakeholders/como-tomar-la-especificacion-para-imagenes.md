# CoopApps — Cómo tomar esta especificación

Tres diapositivas para abrir o cerrar la reunión: qué vamos a ver, cómo hay que leer la especificación y qué sigue después de leerla (decidir y empezar a construir). Cada idea se sostiene con un dato de la especificación; ninguna promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` (estructura, 31 anexos, DEC-001 a DEC-108), `02-preguntas-abiertas.md` (593 preguntas: 98 respondidas, 490 asumidas con la recomendada, 4 pendientes del contador), `03-plan-de-olas-y-prompts.md` v1.2 (172 instrucciones, 12 olas, más de 4.200 requisitos), `docs/revision-externa/NucleoTransversal-contraste.md` (112 temas contrastados) y los demás documentos de esta carpeta |
| Datos | Todos los nombres de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Puede usarse solo o en la misma conversación que `lo-esencial-para-imagenes.md`. Si ya pegaste el prompt de estilo de ese documento, saltá directo al pedido.
2. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-L01", "Generá IMG-L02" y "Generá IMG-L03".
4. Cada idea trae una **frase para decir** en voz alta mientras se muestra la imagen.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar tres diapositivas para una reunión con directivos y stakeholders de trayectoria, de una empresa de software para cooperativas de servicios públicos de Argentina. Explican qué se va a mostrar en la reunión, cómo hay que leer la especificación del sistema y qué pasos siguen: leer, decidir y construir.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y ahora pide la mirada de quien conoce el negocio. Nada de adjetivos vacíos ("revolucionario", "increíble", "disruptivo"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, fechas ni promesas. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición de alto impacto: mucho espacio en blanco, un título grande (64 a 80 px), un elemento dominante y como máximo cuatro elementos de apoyo. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de robots, cerebros, cohetes, personas sonriendo ni efectos futuristas.
8. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-L01 a IMG-L03).
```

---

## 1. Las tres ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-L01 | Lo que vamos a ver. | El recorrido de la reunión, de lo general a lo que necesitamos de ustedes |
| IMG-L02 | No es un resumen. Es el plano. | La especificación se lee en detalle, cada uno en su área |
| IMG-L03 | Leer. Decidir. Construir. | Qué pasa después de leer y cómo se empieza a construir |

---

## 2. Fichas y prompts

### IMG-L01 — Lo que vamos a ver.

**Respaldo:** la reunión recorre cinco bloques, cada uno con su documento en esta carpeta:
1. **Objetivos, alcance y límites:** qué es CoopApps, qué incluye y qué no (`00-objetivos-alcance-y-limites-para-imagenes.md`).
2. **Lo esencial:** las ideas que definen el sistema (`lo-esencial-para-imagenes.md`).
3. **Servicio por servicio:** cómo funciona cada servicio de la cooperativa (`servicio-por-servicio-para-imagenes.md`).
4. **Olas, plazos y costos:** cómo se construye y cómo se mide el plazo (`plazos-olas-y-costos.md`).
5. **Qué necesitamos de ustedes:** leer, decidir y priorizar.

**Frase para decir:** "Vamos de lo general a lo particular, y terminamos en lo que solo ustedes pueden aportar."

```text
Generá IMG-L01 con código.
Título grande: "Lo que vamos a ver."
Composición: un recorrido horizontal de cinco estaciones numeradas, unidas por una línea fina gris, de izquierda a derecha. Cada estación es un círculo con su número y, debajo, un título corto y una línea de apoyo:
1. "Objetivos, alcance y límites" — "Qué es, qué incluye y qué no".
2. "Lo esencial" — "Las ideas que definen el sistema".
3. "Servicio por servicio" — "Cómo funciona cada servicio".
4. "Olas, plazos y costos" — "Cómo se construye y cómo se mide".
5. "Qué necesitamos de ustedes" — "Leer, decidir, priorizar".
Las estaciones 1 a 4 en gris carbón; la estación 5 en verde y un poco más grande: es el destino del recorrido.
Pie pequeño: "Cada bloque tiene su documento de respaldo".
```

### IMG-L02 — No es un resumen. Es el plano.

**Respaldo:** la especificación está pensada para que se pueda construir el sistema sin consultar otra fuente. Se compone de:
- **1 documento maestro**, con la visión, las fuentes y las decisiones rectoras;
- **31 anexos**: 19 de módulos de negocio (personas, facturación, cobranza, tesorería, contabilidad, etc.) y 12 transversales (plataforma, seguridad, migración, integraciones, etc.);
- **108 decisiones registradas** (DEC-001 a DEC-108), que prevalecen sobre cualquier otra fuente;
- **593 preguntas registradas**, cada una con su respuesta recomendada;
- **1 plan de construcción** con 172 instrucciones en 12 olas y más de 4.200 requisitos, cada uno asignado a una instrucción.

Cómo leerla:
1. **Empezar por el documento maestro**, para entender el todo.
2. **Ir al anexo del área propia:** cada uno lee en detalle el que conoce (el responsable comercial, facturación y cobranza; el contador, fiscal y contabilidad; el responsable técnico, técnica y redes).
3. **Revisar las decisiones que se tomaron con la opción recomendada**, que pueden revisarse en cualquier momento.
4. **Anotar lo que no esté bien o falte**: cada observación se convierte en una pregunta o en una decisión nueva, como se hizo con la revisión externa de 112 temas.

**Frase para decir:** "Esto no es un folleto. Es el plano del sistema, y cada uno de ustedes conoce mejor que nadie la habitación que le toca."

```text
Generá IMG-L02 con código.
Título grande: "No es un resumen. Es el plano."
Subtítulo: "Se lee en detalle. Cada uno, en su área."
Composición en dos mitades:
- Izquierda: una pila sobria de documentos, de arriba hacia abajo, cada uno con su cifra grande en verde:
  "1" documento maestro · "31" anexos (19 de negocio y 12 transversales) · "108" decisiones registradas · "593" preguntas con su respuesta recomendada · "172" instrucciones de construcción en 12 olas.
- Derecha: cuatro pasos numerados, en columna, con ícono de línea:
  1. "Empezar por el documento maestro"
  2. "Ir al anexo del área propia"
  3. "Revisar las decisiones tomadas con la recomendada"
  4. "Anotar lo que no esté bien o falte"
Pie: "Cada observación se convierte en una pregunta o en una decisión registrada".
```

### IMG-L03 — Leer. Decidir. Construir.

**Respaldo:**
- **Leer:** cada área revisa su anexo en detalle.
- **Decidir:** de las 593 preguntas registradas, 98 las respondió el solicitante y 490 se asumieron con la opción recomendada para no frenar el trabajo; todas pueden revisarse. Quedan 4 preguntas fiscales que esperan al contador. Cada decisión queda registrada con fecha y motivo, y prevalece sobre cualquier otra fuente.
- **Construir:** se empieza por la ola O0 (las bases de la plataforma), durante 2 o 3 semanas, se miden las horas reales por punto de complejidad y se vuelve con una fecha basada en datos. Cada ola entrega un resultado visible que valida la cooperativa piloto.

**Frase para decir:** "Ustedes leen y deciden. Nosotros empezamos a construir por la base, medimos y volvemos con una fecha que se pueda cumplir."

```text
Generá IMG-L03 con código.
Título grande: "Leer. Decidir. Construir."
Composición: tres columnas grandes, unidas por flechas cortas de izquierda a derecha. Cada columna tiene un ícono de línea arriba, un verbo grande y dos o tres líneas de apoyo:
1. "Leer" (ícono de documento abierto) — "Cada área revisa su anexo en detalle".
2. "Decidir" (ícono de balanza) — "98 respondidas · 490 asumidas con la recomendada, revisables" y, en ámbar, "4 preguntas fiscales esperan al contador". Debajo: "Cada decisión queda registrada y prevalece".
3. "Construir" (ícono de bloques apilados) — "Ola O0: las bases, 2 o 3 semanas" · "Medir horas reales por punto" · "Volver con una fecha basada en datos".
Las columnas 1 y 2 en gris carbón; la columna 3 en verde.
Pie: "Cada ola entrega un resultado visible que valida la cooperativa piloto".
No muestres ninguna cifra de semanas ni de meses de construcción total.
```

---

## 3. Notas para el presentador

- **Dónde va cada una.** IMG-L01 abre la reunión, antes de los demás documentos. IMG-L02 e IMG-L03 cierran, después de IMG-E12 ("Primero medimos. Después prometemos."). También pueden reemplazar a IMG-E13 ("Lo que falta lo aportan ustedes.").
- **El ámbar de IMG-L03** marca lo único que no depende del equipo: las preguntas que esperan al contador.
- **"490 asumidas" no es "490 sin resolver".** Están resueltas con la opción recomendada y el sistema se especificó con ellas. Si alguien quiere revisar una, se revisa, y la decisión nueva se registra.
- **Quién lee qué.** Conviene llevar preparado, para cada asistente, el anexo de su área y las decisiones asumidas que lo afectan.
- **No mostrar el plazo total de construcción** sin calibrar; el mensaje es que el plazo se mide con la ola O0 antes de comprometerlo.
