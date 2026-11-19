# CoopApps — Cuántos usuarios y qué tan rápido

Una imagen que muestra la capacidad y la velocidad del sistema en números: cuántos socios, empleados y técnicos soporta, y en cuántos segundos responde. Todos los datos salen de la especificación; ninguno promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md` §7.1 (perfil de carga de referencia, DEC-075), §7.2 (tiempos de respuesta, RNF-NFR-001 a RNF-NFR-008), §7.3 (procesos masivos, RNF-NFR-010 a RNF-NFR-016), RNF-NFR-021 (separación de cargas) y RNF-NFR-030 (disponibilidad, DEC-063); `02-preguntas-abiertas.md` PA-NFR-04 |
| Carácter | **Metas de diseño, no mediciones.** El perfil de carga es la referencia para construir y probar desde la ola O0 y se recalibra con lo que se mida en la cooperativa piloto |
| Datos | Todos los nombres de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Puede usarse en la misma conversación que `lo-esencial-para-imagenes.md`. Si ya pegaste el prompt de estilo de ese documento, saltá directo al pedido.
2. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
3. Pedir la imagen por código: "Generá IMG-R01".
4. La imagen trae una **frase para decir** en voz alta mientras se muestra.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar una diapositiva para una reunión con directivos y stakeholders de trayectoria, de una empresa de software para cooperativas de servicios públicos de Argentina. La diapositiva muestra la capacidad y la velocidad del sistema con cifras concretas.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "increíble", "ultrarrápido", "el mejor"), nada de signos de exclamación, nada de lenguaje publicitario. La fuerza está en el número.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, comparaciones ni promesas. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina.
3. Generá la imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Sin rojo.
5. Composición limpia: mucho espacio en blanco, un título grande (64 a 80 px), las cifras dominan. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de robots, cohetes, velocímetros exagerados ni efectos futuristas.
8. Después de la imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-R01).
```

---

## 1. Ficha y prompt

### IMG-R01 — Cuántos usuarios y qué tan rápido.

**Respaldo (T08 §7, perfil de carga de referencia adoptado por DEC-075):**

Cantidad, por cooperativa y en toda la plataforma (diseño para 100 cooperativas, escalable a 300 sin rediseñar):

| Dimensión | Cooperativa estándar | Cooperativa grande | Plataforma (100 cooperativas) |
|---|---|---|---|
| Suministros activos | 25.000 | 150.000 | 3.000.000 |
| Personas o titulares | 20.000 | 120.000 | 2.400.000 |
| Comprobantes por mes | 30.000 | 180.000 | 3.600.000 |
| Empleados usando el sistema a la vez | 30 | 150 | 2.088 |
| Socios activos el día pico de vencimiento | 5.000 | 30.000 | 360.000 |
| Técnicos y lecturistas en la calle a la vez | 10 | 60 | 720 |

Con 300 cooperativas, la plataforma llega a 9 millones de suministros y 6.264 empleados conectados a la vez, sin rediseño. El pico de la plataforma no es la suma de los picos de cada cooperativa, porque sus vencimientos no coinciden.

Velocidad, medida al 100 % de la carga pico (en el 95 % de los casos):
- abrir una ficha: 0,2 segundos;
- buscar un socio por documento, nombre, domicilio o medidor: 0,5 segundos en una cooperativa grande;
- cobrar en caja: 0,8 segundos, con el recibo listo para imprimir en 2 segundos y 30 cajas cobrando a la vez;
- ficha completa del socio con su cuenta corriente: 1 segundo;
- app del socio en un celular de gama baja con 4G lenta: la pantalla útil aparece en 2,5 segundos.

Procesos masivos:
- facturar 50.000 suministros: 60 minutos o menos;
- autorizar en ARCA ese lote: 2 horas o menos, si ARCA responde normal;
- generar los PDF y distribuirlos: 1 hora y 4 horas;
- en una jornada se factura, se autoriza y se distribuye.

Reglas:
- lo pesado de una cooperativa no frena a las demás: un proceso masivo saturado sube como máximo un 10 % el tiempo de las pantallas;
- si una pantalla no llega a su meta, se convierte en un proceso con barra de progreso en lugar de relajar la meta;
- cada meta tiene su prueba de carga automática, y la entrega no sale si no la cumple;
- disponibilidad del 99,5 % mensual.

**Frase para decir:** "No le decimos 'es rápido'. Le decimos cuántos segundos, con cuánta gente conectada, y lo probamos en cada entrega."

```text
Generá IMG-R01 con código.
Título grande: "Cuántos usuarios y qué tan rápido."
Composición en dos mitades:
- Izquierda, "Cuántos": tres columnas de cifras grandes, "Cooperativa estándar", "Cooperativa grande" y, más destacada en verde, "Plataforma · 100 cooperativas". Filas con rótulo a la izquierda:
  "Suministros activos": 25.000 · 150.000 · 3.000.000
  "Empleados conectados a la vez": 30 · 150 · 2.088
  "Socios el día pico de vencimiento": 5.000 · 30.000 · 360.000
  "Técnicos en la calle a la vez": 10 · 60 · 720
  Debajo, en gris: "Escala a 300 cooperativas y 9 millones de suministros sin rediseño".
- Derecha, "Qué tan rápido": una lista de tiempos con un cronómetro de línea pequeño al lado de cada uno, la cifra en verde y grande:
  "0,2 s" abrir una ficha
  "0,5 s" buscar un socio
  "0,8 s" cobrar en caja (30 cajas a la vez)
  "2,5 s" app del socio en un celular de gama baja
  "60 min" facturar 50.000 suministros
Abajo, una franja gris claro con tres afirmaciones con tilde verde: "Medido con la carga pico" · "Lo pesado de una cooperativa no frena a las demás" · "Cada entrega pasa su prueba de carga".
Pie pequeño: "Perfil de referencia de ingeniería · se recalibra con las mediciones de la cooperativa piloto".
```

---

## 2. Notas para el presentador

- **Son metas de diseño, no mediciones.** Si alguien pregunta "¿ya lo midieron?", la respuesta es: "Todavía no hay sistema que medir; cada meta tiene su prueba de carga y la primera medición llega con la ola O0".
- **Las metas de facturación masiva** están asumidas con la opción recomendada (PA-NFR-04) y se pueden revisar.
- **Dónde va.** Encaja junto a IMG-E08 ("Si ARCA se cae, la cooperativa sigue.") o después de IMG-T10 ("Lo pesado no frena al usuario.").
- **No sumar los picos.** Los 2.088 empleados y 360.000 socios de la plataforma ya están corregidos por la simultaneidad real (0,6 de la suma de los picos de cada cooperativa); no multiplicar las columnas por cooperativa.
