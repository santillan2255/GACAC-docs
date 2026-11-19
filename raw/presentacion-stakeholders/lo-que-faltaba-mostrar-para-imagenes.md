# CoopApps — Lo que faltaba mostrar

Seis ideas importantes de la especificación que todavía no tenían imagen en la presentación. Cada una se sostiene con un dato de la especificación; ninguna promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `T10-BIA` §15.5.1 (informes regulatorios REP-BIA-015 a REP-BIA-024), `M17-INS` (vida institucional), `M15-CON` §5.5 (motor de asientos automáticos), `01-registro-decisiones.md` (DEC-064, DEC-096 a DEC-103 y DEC-107), `docs/revision-externa/NucleoTransversal-contraste.md` y `NucleoTransversal-rechazados.md` |
| Cómo se eligieron | Se compararon los temas de la especificación con los de todos los documentos de esta carpeta. Estos seis tenían mucho peso en la especificación y ninguna imagen, o casi ninguna mención, en la presentación |
| Datos | Todos los nombres e importes de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Puede usarse en la misma conversación que `lo-esencial-para-imagenes.md`. Si ya pegaste el prompt de estilo de ese documento, saltá directo al pedido.
2. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-N01", "Generá IMG-N02", etc.
4. Cada idea trae una **frase para decir** en voz alta mientras se muestra la imagen.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar seis diapositivas para una reunión con directivos y stakeholders de trayectoria, de una empresa de software para cooperativas de servicios públicos de Argentina. Cada diapositiva transmite una sola idea, con un título corto y contundente y un dato que la respalda.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "increíble", "disruptivo", "el mejor"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, comparaciones ni promesas. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición de alto impacto: mucho espacio en blanco, un título grande (64 a 80 px), un elemento dominante y como máximo cuatro elementos de apoyo. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de robots, cerebros, cohetes, personas sonriendo ni efectos futuristas.
8. Datos de ejemplo siempre ficticios ("Cooperativa A", "Socio de ejemplo", "ARS 0.000").
9. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-N01 a IMG-N06).
```

---

## 1. Las seis ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-N01 | Los informes a los organismos salen del mismo dato. | Cumplir con los reguladores deja de ser un trabajo aparte |
| IMG-N02 | La vida institucional, dentro del sistema. | Asociados, asambleas, actas y excedentes, con la misma seriedad que la factura |
| IMG-N03 | Una cooperativa, varias entidades. Una persona, una sola ficha. | La cooperativa, la mutual y sus socios, tal como son en la realidad |
| IMG-N04 | La contabilidad se escribe sola. | Cada operación genera su asiento; nadie lo carga ni lo retoca a mano |
| IMG-N05 | La migración no arrastra los problemas de hoy. | El paso de datos se controla antes, durante y después |
| IMG-N06 | Escuchamos a todos. Decide la cooperativa. | Los aportes externos se contrastan y entran solo por decisión |

---

## 2. Fichas y prompts

### IMG-N01 — Los informes a los organismos salen del mismo dato.

**Respaldo:** la especificación cataloga un informe por organismo y por servicio (REP-BIA-015 a REP-BIA-024), además de los de INAES y ARCA. Cada informe se arma con los mismos datos de consumos, facturación, reclamos e interrupciones que usa la operación diaria:
- **ENACOM:** Internet, telefonía y televisión (accesos, abonados, reclamos por motivo y plazo de respuesta);
- **organismo provincial de energía y agua** (por ejemplo ERSeP en Córdoba): ventas, consumos, pérdidas, tarifa social, riesgo de corte, calidad de servicio e interrupciones, y calidad del agua;
- **Secretaría de Energía:** energía comprada y vendida, usuarios-generadores y energía inyectada;
- **ENARGAS / ENReGE:** usuarios, volúmenes, facturación, morosidad y reclamos por fuga;
- **municipio:** rendición del alumbrado público y de la concesión de saneamiento;
- **INAES:** Libro de Registro de Asociados, altas y bajas, estados contables y asambleas.

**Frase para decir:** "El informe al regulador ya no se arma en una planilla aparte. Sale de los mismos datos con los que la cooperativa factura y atiende."

```text
Generá IMG-N01 con código.
Título grande: "Los informes a los organismos salen del mismo dato."
Composición: en el centro, un bloque verde "Datos de la Cooperativa A" con cuatro rótulos pequeños dentro: "Consumos · Facturación · Reclamos · Interrupciones". De él salen seis líneas finas hacia seis tarjetas grises dispuestas en semicírculo, cada una con el organismo en negrita y una línea de contenido:
"ENACOM" — "Internet, telefonía y TV"
"Organismo provincial (ej. ERSeP)" — "Energía y agua: ventas, calidad, tarifa social"
"Secretaría de Energía" — "Energía comprada, vendida e inyectada"
"ENARGAS / ENReGE" — "Gas: usuarios, volúmenes, fugas"
"Municipio" — "Alumbrado público y saneamiento"
"INAES" — "Asociados, estados contables y asambleas"
Pie: "Un informe por organismo y por servicio, catalogado en la especificación".
```

### IMG-N02 — La vida institucional, dentro del sistema.

**Respaldo (M17):**
- **Asociados:** número de asociado correlativo, nunca reutilizado; ingreso aprobado por acta y egreso con causa.
- **Libro de Registro de Asociados:** cada edición es inmutable, con folios correlativos y una huella digital (hash) que prueba que no se alteró; las correcciones van en la edición siguiente. El capital integrado del libro coincide con el saldo contable a la misma fecha.
- **Asambleas:** convocatoria con su documentación; el sistema bloquea publicarla con menos días que el mínimo configurado. Padrón versionado (preliminar, observado, definitivo), acreditación con credencial QR y quórum calculado en vivo.
- **Actas:** numeradas por libro (consejo, asamblea, sindicatura), con firma digital; una vez firmada no se edita, se corrige con un acta posterior.
- **Excedentes:** distribución según el esquema aprobado (reserva legal, fondos y retorno a asociados), separando las operaciones con no asociados.
- **Roles:** el consejo aprueba y firma; el síndico ve todo el módulo y firma sus actas.
- Se construye en la ola O10; el registro mínimo de asociados, en O2.

**Frase para decir:** "La asamblea, el padrón y el libro de asociados tienen el mismo rigor que una factura: nada se altera sin dejar rastro."

```text
Generá IMG-N02 con código.
Título grande: "La vida institucional, dentro del sistema."
Composición: una línea horizontal con cinco hitos del ciclo institucional, de izquierda a derecha, cada uno con ícono de línea, nombre y una línea de apoyo:
1. "Asociado" — "Número único, ingreso por acta"
2. "Padrón" — "Versionado: preliminar, observado, definitivo"
3. "Asamblea" — "Acreditación con QR y quórum en vivo"
4. "Acta" — "Firma digital; firmada, no se edita"
5. "Excedentes" — "Reserva, fondos y retorno a asociados"
Arriba de la línea, un libro abierto con un sello verde: "Libro de Registro de Asociados · ediciones inmutables con huella digital".
Abajo, una franja gris claro con dos roles: "Consejo: aprueba y firma" · "Síndico: ve todo y firma sus actas".
Pie: "El capital del libro coincide con la contabilidad a la misma fecha".
```

### IMG-N03 — Una cooperativa, varias entidades. Una persona, una sola ficha.

**Respaldo:**
- **Varias entidades jurídicas por cooperativa** (DEC-064 y DEC-096): una misma cooperativa puede administrar, por ejemplo, la cooperativa y una mutual. Cada entidad tiene su propia emisión de comprobantes, contabilidad, sueldos, libros sociales y numeración de asociados: el asociado N.º 1001 puede existir a la vez en la cooperativa y en la mutual. Los permisos de los usuarios también pueden limitarse por entidad.
- **Persona única** (DEC-097): un vecino que es socio, proveedor, chofer o instalador matriculado es **una sola persona con varios roles**, no cuatro fichas distintas. Toda alta pasa por el mismo control de duplicados.

**Frase para decir:** "La cooperativa y la mutual llevan cada una sus libros, pero el vecino es uno solo, y el sistema lo sabe."

```text
Generá IMG-N03 con código.
Título grande en dos líneas: "Una cooperativa, varias entidades." / "Una persona, una sola ficha."
Composición en dos mitades separadas por una línea vertical fina:
- Izquierda: un bloque grande "Cooperativa A" que contiene dos bloques iguales, "Cooperativa" y "Mutual". Debajo de cada uno, la misma lista corta con tildes verdes: "Comprobantes · Contabilidad · Sueldos · Libros sociales · Numeración de asociados". Entre ambos, una nota pequeña: "Asociado N.º 1001 en las dos".
- Derecha: una tarjeta de persona en el centro, "Socio de ejemplo", con cuatro etiquetas verdes alrededor unidas a ella: "Socio" · "Proveedor" · "Chofer" · "Instalador matriculado".
Pie: "Toda alta pasa por el mismo control de duplicados".
```

### IMG-N04 — La contabilidad se escribe sola.

**Respaldo (M15):**
- Un **motor de asientos automáticos** genera el asiento de cada operación: facturación y cobranza desde la ola O5; luego mora, servicios medidos, compras, stock, tesorería, fiscal y sueldos.
- **Un asiento automático no se edita:** si algo está mal, se corrige la configuración, se revierte y se reprocesa, y queda un asiento nuevo vinculado al original.
- **Las diferencias no se esconden:** solo una diferencia mínima de redondeo, dentro de una tolerancia configurada, va a una cuenta de redondeo; cualquier diferencia mayor deja la operación en error para revisar.
- Cada concepto se imputa a su centro de costo sin carga manual (por ejemplo, el abono de Internet va al centro de costo de Internet).

**Frase para decir:** "El contador deja de pasar asientos y pasa a controlarlos. Y si algo no cierra, el sistema no lo tapa."

```text
Generá IMG-N04 con código.
Título grande: "La contabilidad se escribe sola."
Composición: a la izquierda, una columna de cinco operaciones con ícono de línea: "Factura" · "Cobro" · "Compra" · "Movimiento de caja" · "Liquidación de sueldos". Todas convergen con flechas finas en un engranaje verde central, "Motor de asientos". A la derecha, un libro mayor limpio con dos asientos ficticios ("Debe ARS 0.000 · Haber ARS 0.000") y un candado pequeño: "No editable".
Abajo, tres afirmaciones con tilde verde: "Cada operación, su asiento" · "Se corrige revirtiendo, nunca retocando" · "Las diferencias grandes no se esconden: quedan en error".
Pie: "Cada concepto va a su centro de costo sin carga manual".
```

### IMG-N05 — La migración no arrastra los problemas de hoy.

**Respaldo:**
- **Antes de migrar:** un escaneo de la base de origen busca números de tarjeta y columnas que parezcan contraseñas o credenciales; si encuentra alguno sin clasificar, **la migración se bloquea** (DEC-103). Las contraseñas y claves del sistema actual nunca se migran.
- **Las sucursales las confirma la cooperativa:** el sistema propone la lista y la cooperativa revisa nombres, domicilios y fusiones antes de migrar cajas y puntos de venta (DEC-098).
- **Personas sin documento:** no se descartan ni se inventan datos. Entran marcadas como "documento pendiente", con una tarea de regularización, y no reciben comprobantes que exijan documento hasta regularizarse (DEC-099).
- **Después:** un verificador nocturno recorre las referencias entre los datos de cada cooperativa e informa cualquier referencia rota (DEC-100).
- Para reemplazar la facturación se exigen 2 ciclos aprobados por servicio con 0 diferencias sin explicar (ya mostrado en IMG-22).

**Frase para decir:** "No se trata de copiar la base vieja. Se trata de pasar los datos limpios y saber exactamente qué quedó pendiente."

```text
Generá IMG-N05 con código.
Título grande: "La migración no arrastra los problemas de hoy."
Composición: tres columnas, "Antes", "Durante" y "Después", unidas por una flecha horizontal que las atraviesa de izquierda a derecha:
- "Antes": un escudo con la leyenda "Escaneo de tarjetas y credenciales: si aparece una, se bloquea" y debajo "Las contraseñas no se migran".
- "Durante": dos tarjetas: "Sucursales: las confirma la cooperativa" y, con borde ámbar, "Personas sin documento: entran marcadas y con tarea de regularización".
- "Después": una lupa con "Verificador nocturno de referencias rotas".
Pie: "Para reemplazar la facturación: 2 ciclos aprobados por servicio con 0 diferencias sin explicar".
```

### IMG-N06 — Escuchamos a todos. Decide la cooperativa.

**Respaldo:** el 10-11-2026 se contrastó un documento externo de modelo de datos contra la especificación:
- se evaluaron **112 temas**, uno por cada subsección del documento;
- se incorporaron **11 aportes**, aprobados de a uno, más la corrección de 11 inconsistencias internas que el contraste ayudó a encontrar;
- las **14 propuestas rechazadas** se volvieron a revisar una por una; de esa revisión salieron 4 decisiones nuevas, incluida la adopción de una propuesta externa (el comprobante que ARCA rechaza vuelve a borrador y libera su número, DEC-107);
- en total quedaron **16 decisiones nuevas registradas** (DEC-093 a DEC-108) y 4 preguntas para el contador;
- regla de fondo: el documento externo **no es fuente**; nada entra sin una decisión registrada, y las decisiones prevalecen sobre cualquier otra fuente.

**Frase para decir:** "Cualquiera puede aportar, y lo valoramos. Pero nada entra al diseño sin que alguien con autoridad lo decida y quede escrito."

```text
Generá IMG-N06 con código.
Título grande: "Escuchamos a todos. Decide la cooperativa."
Composición: un embudo horizontal de izquierda a derecha, en tres tramos con su cifra grande:
- Entrada, ancha, gris: "112 temas evaluados".
- Centro: dos salidas: arriba en verde "11 aportes incorporados"; abajo en gris "14 rechazos, revisados uno por uno".
- Salida, estrecha, verde oscuro: "16 decisiones registradas".
A la derecha del embudo, un sello circular verde: "Nada entra sin decisión".
Debajo, una franja gris claro: "Una propuesta rechazada se terminó adoptando tras revisarla · 4 preguntas esperan al contador".
Pie: "El documento externo no es fuente: las decisiones registradas prevalecen".
```

---

## 3. Notas para el presentador

- **Dónde va cada una.** N01 y N04 encajan después de IMG-E05 ("Cada peso, explicado."). N02 y N03 van en el bloque de alcance, cerca del capital social (IMG-S16). N05 va junto a IMG-22 ("Reemplazo de ProCoop sin saltos"). N06 va antes de IMG-L03 ("Leer. Decidir. Construir."), porque muestra en la práctica cómo se decide.
- **Si solo hay lugar para dos:** N01 (reguladores) y N02 (vida institucional). Son los temas que más preocupan a un consejo y que menos se ven en la presentación actual.
- **N01: los formatos oficiales tienen dueño.** La especificación cataloga qué informa cada organismo; los formatos exactos los definen los módulos fiscal, contable e institucional. Algunos regímenes provinciales dependen de cada cooperativa (por eso dice "organismo provincial, por ejemplo ERSeP").
- **N02: hay puntos legales a confirmar.** Los plazos de convocatoria, el quórum, los porcentajes de distribución de excedentes y si algún libro social puede compartirse entre entidades llevan [VERIFICAR] con el asesor legal. La imagen no muestra plazos ni porcentajes por eso.
- **N06 no nombra a los autores** del documento externo.
