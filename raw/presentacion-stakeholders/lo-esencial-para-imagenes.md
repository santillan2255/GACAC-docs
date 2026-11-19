# CoopApps — Lo esencial

Doce ideas, una imagen cada una. Cada idea se sostiene con un dato de la especificación o del alcance funcional; ninguna promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `documento-base-presentacion.md` (números de la especificación y del trabajo realizado), `GoodApps-Cooperativas-Alcance-Funcional.md` (principios, límites, niveles de servicio y servicios), `dolores-procoop-antes-y-despues.md` y `roles-y-modulos-para-claude.md` (funciones del sistema actual) |
| Datos | Todos los nombres e importes de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Puede usarse solo o después de `00-objetivos-alcance-y-limites-para-imagenes.md`, en la misma conversación.
2. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-E01", "Generá IMG-E02", etc.
4. Cada idea trae también una **frase para decir** en voz alta mientras se muestra la imagen.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar doce diapositivas para una reunión con directivos y stakeholders de trayectoria, de una empresa de software para cooperativas de servicios públicos de Argentina. Cada diapositiva transmite una sola idea, con un título corto y contundente y un dato que la respalda.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "increíble", "disruptivo", "el mejor"), nada de signos de exclamación, nada de lenguaje publicitario. La fuerza está en el dato y en la frase corta, no en el adorno.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, comparaciones ni promesas. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición de alto impacto: mucho espacio en blanco, un título grande (64 a 80 px), un número o un contraste dominante y como máximo tres elementos de apoyo. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de robots, cerebros, cohetes, personas sonriendo ni efectos futuristas.
8. Datos de ejemplo siempre ficticios ("Cooperativa A", "Socio de ejemplo", "ARS 0.000").
9. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-E01 a IMG-E12).
```

---

## 1. Las doce ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-E01 | Seis meses. Seis días. | El análisis ya está hecho |
| IMG-E02 | Está todo escrito. | Nada queda librado a la interpretación |
| IMG-E03 | Cada requisito tiene su prueba. | Lo escrito se puede verificar |
| IMG-E04 | Nada de lo que hoy funciona se pierde. | La transición no le quita nada a la cooperativa |
| IMG-E05 | Cada peso, explicado. | La factura se defiende sola |
| IMG-E06 | Nada se borra. | Control y auditoría totales |
| IMG-E07 | La ley no se configura. | Las protecciones normativas son fijas |
| IMG-E08 | Si ARCA se cae, la cooperativa sigue. | Continuidad |
| IMG-E09 | La cooperativa, en el bolsillo del socio. | Experiencia digital con marca propia |
| IMG-E10 | Sin servidores. Sin instalaciones. Sin copias a mano. | Menos carga operativa |
| IMG-E11 | Los datos son de la cooperativa. | Libertad y control de su información |
| IMG-E12 | Primero medimos. Después prometemos. | Riesgo controlado; el plazo se calibra con datos |

Cierre opcional: **IMG-E13 — Lo que falta lo aportan ustedes.**

---

## 2. Fichas y prompts

### IMG-E01 — Seis meses. Seis días.

**Respaldo:** el plan tradicional preveía 6 meses (26 semanas) para relevar, analizar y especificar. El trabajo se hizo en unos 6 días de trabajo efectivo, en noviembre de 2026: unas 25 veces más rápido.

**Frase para decir:** "Lo que estaba planificado para seis meses ya está hecho. Ahora lo que necesitamos es su mirada."

```text
Generá IMG-E01 con código.
Título grande: "Seis meses. Seis días."
Composición: dos barras horizontales enormes, una sobre otra, en escala real de semanas (0 a 26).
- Barra 1, gris medio, a todo el ancho: "Plan tradicional: relevar, analizar y especificar" y, al final, "6 meses".
- Barra 2, verde, de 1/26 del ancho: "Trabajo realizado" y, al final, "6 días".
El contraste de largo es el mensaje: no agregues más elementos.
Pie pequeño: "Relevamiento, análisis y especificación completos · noviembre de 2026".
```

### IMG-E02 — Está todo escrito.

**Respaldo:** la especificación tiene:
- más de 4.200 requisitos funcionales y 292 no funcionales;
- unas 2.680 reglas de negocio y unos 2.490 parámetros con nombre;
- 1.051 pantallas y 558 ítems de menú;
- 4.193 operaciones de API;
- 115 integraciones;
- 471 casos de uso y 341 procesos;
- 5.710 casos de prueba;
- 31 anexos.

**Frase para decir:** "No hay que imaginarse el sistema: está escrito, pantalla por pantalla y regla por regla."

```text
Generá IMG-E02 con código.
Título grande: "Está todo escrito."
Subtítulo: "Pantalla por pantalla. Regla por regla. Prueba por prueba."
Composición: una cuadrícula de 4 × 2 cifras grandes en verde, con su rótulo debajo en gris:
"+4.200" requisitos funcionales · "2.680" reglas de negocio · "2.490" parámetros con nombre · "1.051" pantallas · "4.193" operaciones de API · "115" integraciones · "471" casos de uso · "5.710" casos de prueba.
Debajo, una línea fina gris: "292 requisitos no funcionales · 558 ítems de menú · 341 procesos · 31 anexos".
Las cifras tienen que dominar la imagen; nada de gráficos.
```

### IMG-E03 — Cada requisito tiene su prueba.

**Respaldo:** el 100 % de los requisitos tiene trazabilidad a casos de uso y a casos de prueba; las 1.051 pantallas y las 4.193 operaciones de API están cubiertas al 100 %. Hay 5.710 casos de prueba de aceptación y 196 casos de aceptación de negocio, con criterios de salida por ola.

**Frase para decir:** "Cada cosa que prometemos tiene una prueba escrita que dice cómo comprobarla."

```text
Generá IMG-E03 con código.
Título grande: "Cada requisito tiene su prueba."
Composición: una cadena horizontal de cuatro eslabones unidos, de izquierda a derecha: "Requisito" → "Caso de uso" → "Pantalla y API" → "Caso de prueba". Debajo de cada eslabón, su cifra: "+4.200", "471", "1.051 · 4.193", "5.710".
A la derecha, un sello circular verde grande: "100 % trazado".
Pie: "196 casos de aceptación de negocio · Criterios de salida en cada ola".
```

### IMG-E04 — Nada de lo que hoy funciona se pierde.

**Respaldo:** de las 120 funciones del menú del sistema actual, 112 se absorben en un módulo, 7 se reemplazan por una solución mejor y 1 se descarta. Los 1.536 parámetros numéricos del sistema actual están catalogados y pasan a ser parámetros con nombre. El alcance incluye todas las funciones, también las menos frecuentes.

**Frase para decir:** "Revisamos función por función lo que la cooperativa usa hoy. Ninguna se queda sin destino."

```text
Generá IMG-E04 con código.
Título grande: "Nada de lo que hoy funciona se pierde."
Composición: a la izquierda, un número enorme "120" con el rótulo "funciones del sistema actual". A la derecha, tres bloques apilados con su cifra grande:
- verde: "112 · se conservan en su módulo";
- verde más claro: "7 · se reemplazan por algo mejor";
- gris: "1 · se descarta".
Debajo, una banda gris claro: "1.536 parámetros numéricos catalogados → parámetros con nombre, explicación y vigencia".
```

### IMG-E05 — Cada peso, explicado.

**Respaldo:** cada factura muestra por qué se cobró cada renglón y qué configuración se aplicó, con su versión. La facturación tiene controles previos y cero diferencias entre factura, cuenta corriente y contabilidad.

**Frase para decir:** "Cuando un socio pregunta por qué pagó lo que pagó, la respuesta está en la misma factura."

```text
Generá IMG-E05 con código.
Título grande: "Cada peso, explicado."
Composición: a la izquierda, una factura ficticia limpia de "Cooperativa A" con cuatro renglones (por ejemplo: "Abono Internet ARS 0.000", "Proporcional desde la activación ARS 0.000", "Instalación ARS 0.000", "Cuota social ARS 0.000"). Del segundo renglón sale una línea fina hacia la derecha, a una tarjeta "Por qué se cobró": "Activación efectiva: día 12 · Plan de ejemplo, versión 3 · Regla: proporcional por días".
Abajo, tres tildes verdes: "Controles antes de emitir" · "Cero diferencias entre factura, cuenta corriente y contabilidad" · "Configuración registrada con su versión".
```

### IMG-E06 — Nada se borra.

**Respaldo:** los documentos económicos nunca se borran: se anulan o se revierten. Cada operación registra autor, fecha y motivo, en una auditoría inmutable. Apagar un módulo o un servicio no borra la historia: la deja en solo consulta.

**Frase para decir:** "En este sistema siempre se puede saber quién hizo qué, cuándo y por qué."

```text
Generá IMG-E06 con código.
Título grande: "Nada se borra."
Subtítulo: "Se anula, se revierte, se deja constancia."
Composición: una línea de tiempo vertical sobria con cuatro registros ficticios, cada uno con "quién · cuándo · qué · por qué" (por ejemplo: "Usuario de ejemplo · 10/11 09:14 · Anuló la factura 0001-00000000 · Motivo: error de domicilio"; "Usuario de ejemplo · 10/11 09:16 · Emitió nota de crédito"; etc.).
A la derecha, tres afirmaciones grandes con tilde verde: "Autor, fecha y motivo en cada operación" · "Auditoría que no se puede alterar" · "Apagar un servicio no borra su historia".
```

### IMG-E07 — La ley no se configura.

**Respaldo:** las protecciones por condición, los preavisos y las ventanas que fija la norma no pueden ser modificados por la cooperativa. Algunos ejemplos:
- nunca se corta la electricidad a un electrodependiente acreditado;
- el agua respeta un caudal mínimo vital;
- en telefonía, las llamadas de emergencia siempre funcionan;
- una prestación urgente de sepelio o salud nunca se rechaza por deuda;
- el cementerio nunca dispone de restos por falta de pago;
- la baja de Internet, telefonía y televisión es pública y sin cargo.

**Frase para decir:** "Hay cosas que el sistema no deja hacer, aunque alguien quiera. Eso protege al socio y protege a la cooperativa."

```text
Generá IMG-E07 con código.
Título grande: "La ley no se configura."
Subtítulo: "Las protecciones que fija la norma están en el sistema y nadie las puede desactivar."
Composición: seis tarjetas iguales en cuadrícula de 3 × 2, con borde ámbar e ícono de escudo:
"Nunca se corta a un electrodependiente" · "El agua respeta el caudal mínimo vital" · "Las llamadas de emergencia siempre funcionan" · "Una urgencia nunca se rechaza por deuda" · "Nunca se dispone de restos por falta de pago" · "La baja de Internet, telefonía y TV es pública y sin cargo".
Pie: "Protege al socio. Protege a la cooperativa."
```

### IMG-E08 — Si ARCA se cae, la cooperativa sigue.

**Respaldo:** una caída del organismo fiscal, de un banco o de una pasarela no detiene la atención ni la facturación: la operación queda pendiente y se completa al volver el servicio. Los procesos masivos se pausan y se reanudan sin duplicar facturas ni pagos. Disponibilidad del 99,5 % mensual, pérdida máxima de datos de 15 minutos y recuperación de una cooperativa en 4 horas.

**Frase para decir:** "Los proveedores externos van a fallar alguna vez. La cooperativa no se detiene por eso."

```text
Generá IMG-E08 con código.
Título grande: "Si ARCA se cae, la cooperativa sigue."
Composición: en el centro, un bloque verde "Cooperativa A: atiende, factura, cobra". Alrededor, cuatro proveedores en gris (ARCA, Banco, Pasarela de pagos, Mensajería); uno de ellos con un ícono de desconexión y la etiqueta "sin respuesta → queda pendiente y se completa al volver".
Abajo, una franja con tres cifras grandes: "99,5 % disponibilidad" · "15 min pérdida máxima de datos" · "4 h para recuperar una cooperativa".
Pie: "Los procesos masivos se pausan y se retoman sin duplicar facturas ni pagos".
```

### IMG-E09 — La cooperativa, en el bolsillo del socio.

**Respaldo:** la aplicación del socio se instala con el nombre, el ícono y los colores de cada cooperativa. Desde ahí el socio contrata, elige el turno de la visita, ve al técnico "en camino", consulta consumos y facturas, paga, reclama con fotos, firma y da de baja. Está pensada para celulares de gama baja y conexión lenta.

**Frase para decir:** "El socio ya no tiene que ir a la oficina. Y lo que ve es su cooperativa, no un sistema ajeno."

```text
Generá IMG-E09 con código.
Título grande: "La cooperativa, en el bolsillo del socio."
Composición: tres celulares en fila, del mismo tamaño, cada uno con la marca de una cooperativa ficticia distinta (Cooperativa A en verde, Cooperativa B en azul petróleo, Cooperativa C en bordó suave), con la misma pantalla de inicio: saldo "ARS 0.000", próximo vencimiento, botón central "Pagar" y barra inferior (Inicio, Cuentas y servicios, +, Gestiones, Comunidad).
Debajo, una fila de siete íconos con rótulo: Contratar · Elegir turno · Técnico en camino · Consumos · Pagar · Reclamar con fotos · Dar de baja.
Pie: "Una plataforma. La marca de cada cooperativa."
Excepción a la paleta: solo los colores de marca de los tres celulares pueden salir del verde.
```

### IMG-E10 — Sin servidores. Sin instalaciones. Sin copias a mano.

**Respaldo:** se usa desde el navegador y el celular, sin instalar programas, sin administrar servidores y sin hacer copias de seguridad manuales. Todas las cooperativas tienen la misma versión, siempre actualizada y sin cortes. El alta de una cooperativa lleva un día hábil como máximo, sin programadores.

**Frase para decir:** "La cooperativa deja de ocuparse de la informática y se ocupa de sus socios."

```text
Generá IMG-E10 con código.
Título grande en tres líneas: "Sin servidores. / Sin instalaciones. / Sin copias a mano."
Composición: a la izquierda el título; a la derecha, una columna de cuatro afirmaciones grandes con tilde verde:
"Desde el navegador y el celular" · "Misma versión para todas, siempre actualizada" · "Copias de seguridad automáticas" · "Una cooperativa nueva en un día hábil, sin programadores".
Pie: "La cooperativa se ocupa de sus socios, no de la informática."
```

### IMG-E11 — Los datos son de la cooperativa.

**Respaldo:** la cooperativa puede consultar, exportar e integrar sus datos siempre, mediante reportes, tableros e interfaz de integración con credenciales propias. Si deja el servicio, recibe la exportación completa en formatos abiertos, con control de integridad, y un período de solo consulta. CoopApps trata los datos personales por cuenta de la cooperativa: no los usa para otros fines ni los cede.

**Frase para decir:** "La información de los socios es de la cooperativa. Hoy y el día que decida irse."

```text
Generá IMG-E11 con código.
Título grande: "Los datos son de la cooperativa."
Subtítulo: "Hoy, mañana y el día que decida irse."
Composición: en el centro, un ícono de llave grande en verde sobre un bloque "Datos de la Cooperativa A". De él salen tres caminos con rótulo: "Reportes y tableros" · "Integración con sus propios sistemas" · "Exportación completa en formatos abiertos".
Abajo, una banda gris claro: "CoopApps trata los datos por cuenta de la cooperativa: no los usa para otros fines ni los cede".
```

### IMG-E12 — Primero medimos. Después prometemos.

**Respaldo:** la estimación conservadora de la construcción da 17.504 puntos de complejidad, con un supuesto de 2 horas por punto que hay que calibrar. La propuesta es construir las primeras instrucciones de la ola O0 durante 2 o 3 semanas, medir las horas reales por punto y volver con una fecha basada en datos. Cada etapa entrega un resultado visible que la cooperativa piloto valida.

**Frase para decir:** "No vamos a darles una fecha inventada. En tres semanas les traemos una fecha medida."

```text
Generá IMG-E12 con código.
Título grande: "Primero medimos. Después prometemos."
Composición: tres pasos grandes en fila, unidos por flechas cortas:
1. "Construir" — "Las primeras instrucciones de la ola O0, durante 2 o 3 semanas".
2. "Medir" — "Horas reales por punto: cada instrucción ya tiene su puntaje".
3. "Comprometer" — "Una fecha basada en datos, no en supuestos".
Debajo, una línea fina con "17.504 puntos de complejidad ya calculados · 172 instrucciones · 12 olas".
Pie: "Cada etapa entrega un resultado visible que valida la cooperativa piloto".
No muestres ninguna cifra de semanas ni de meses de construcción.
```

### IMG-E13 — Lo que falta lo aportan ustedes (cierre opcional)

**Respaldo:** el relevamiento, el análisis y la especificación ya están hechos. Lo que falta es lo que solo puede aportar quien conoce el negocio: validar, decidir y priorizar.

**Frase para decir:** "El trabajo pesado está hecho. Lo que necesitamos ahora es lo que solo ustedes saben."

```text
Generá IMG-E13 con código.
Título grande: "Lo que falta lo aportan ustedes."
Composición: a la izquierda, una columna gris con tres tildes: "Relevado" · "Analizado" · "Especificado".
A la derecha, una columna verde, más grande, con tres verbos: "Validar" · "Decidir" · "Priorizar".
Entre ambas, una línea vertical fina.
Pie: "Su experiencia es la pieza que completa el trabajo."
```

---

## 3. Notas para el presentador

- **Orden sugerido para abrir con fuerza:** E01, E02 y E04. Para cerrar: E12 y E13.
- **Si solo hay lugar para cinco:** E01, E02, E04, E07 y E12.
- **La frase para decir va con la imagen, no en la imagen.** La diapositiva queda limpia y el presentador pone la voz.
- **Requisitos funcionales.** El documento base dice 4.204 y el cálculo más reciente da 4.213; por eso las imágenes dicen "más de 4.200", que es cierto con cualquiera de los dos.
- **E12 no debe mostrar las 314 semanas** de la estimación sin calibrar; el mensaje es que el plazo se mide antes de comprometerlo.
- **No nombrar al sistema actual ni a sus autores en las imágenes.** Las comparaciones dicen "el sistema actual", para que nadie en la sala se sienta atacado.
