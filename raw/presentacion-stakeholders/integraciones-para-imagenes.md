# CoopApps — Integraciones

Tres imágenes dedicadas a las integraciones con terceros: con quién se conecta el sistema, cómo se conecta, y qué pasa cuando un tercero falla. Todos los datos salen de la especificación; ninguno promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `docs/especificacion/anexos/T06-INT-integraciones.md` (§1, §2, §5, §9 y fichas §12.4 a §12.18), `T08` (RNF-NFR-011, RNF-NFR-018, RNF-NFR-041), `01-registro-decisiones.md` (DEC-003, DEC-074) |
| Conteo | 115 fichas de integración (FI-INT), agrupadas en 15 familias. Los conteos por familia salen de las fichas del §12 |
| Datos | Todos los nombres de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
2. Pedir las imágenes por código: "Generá IMG-IN01", "Generá IMG-IN02" y "Generá IMG-IN03".
3. Cada imagen trae una **frase para decir** en voz alta mientras se muestra.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar tres diapositivas sobre las integraciones de un sistema para cooperativas de servicios públicos de Argentina con organismos, bancos, redes de cobranza, pasarelas de pago, proveedores de comunicaciones y equipos técnicos. El público mezcla directivos y técnicos.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "increíble", "robusto", "sin límites"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras ni integraciones. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina. Los nombres de organismos, bancos y proveedores se escriben tal como figuran en el documento, en texto: no dibujes sus logos.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición limpia: mucho espacio en blanco, un título grande (64 a 80 px), un elemento dominante y como máximo cinco elementos de apoyo. Texto mínimo de 20 px (en la grilla de familias se admite 18 px para los ejemplos).
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de enchufes brillantes, robots ni efectos futuristas.
8. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-IN01 a IMG-IN03).
```

---

## 1. Las tres ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-IN01 | 115 integraciones, cada una con su ficha. | El sistema ya sabe con quién se tiene que conectar y cómo |
| IMG-IN02 | Un solo marco para todas. | Sumar un banco o una pasarela es configuración, no un cambio en el sistema |
| IMG-IN03 | Si un tercero falla, no se duplica nada. | Ninguna caída externa genera cobros duplicados ni números fiscales salteados |

---

## 2. Fichas y prompts

### IMG-IN01 — 115 integraciones, cada una con su ficha.

**Respaldo (T06 §12):** cada integración tiene su ficha: qué intercambia, con qué formato, qué errores devuelve, cómo se concilia y qué hacer si falla. Son 115, en 15 familias:

| Familia | Fichas | Ejemplos |
|---|---|---|
| Fiscal nacional (ARCA) | 17 | Autorización CAE, CAEA y CESP, padrones, Libro IVA Digital, SICORE |
| Pasarelas de pago y QR | 13 | Pagos360, Mercado Pago, QR interoperable, DEBIN |
| Datos, legado y plataforma | 11 | Migración desde ProCoop, Power BI, contable externo, SFTP |
| Reguladores, subsidios y terceros | 10 | ERSeP, ENARGAS, ENACOM, Secretaría de Energía, INAES, RASE |
| Redes de cobranza extrabancaria | 9 | Red Link, SIRO, Pago Mis Cuentas, Rapipago, Pago Fácil |
| Red, aprovisionamiento y telefonía | 9 | MikroTik, RADIUS, SmartOLT, centrales telefónicas |
| Otras de la BASE y de ProCoop | 9 | Imprenta de facturas, monitoreo de red, electrodependientes, catastro |
| Fiscal provincial y municipal | 6 | Rentas Córdoba, SIRCAR, ARBA, tasas municipales |
| Comunicaciones | 6 | Correo, WhatsApp, SMS, notificaciones push |
| Identidad, mapas y geografía | 6 | Google, Ciudadano Digital Córdoba, mapas, Georef |
| Medición, telemedición y prepago | 6 | Colectores de lectura, telemedición, medidores prepagos |
| Hardware local | 5 | Impresoras, turnero, lectores, balanzas |
| Bancos | 3 | Interbanking, extractos bancarios |
| Flota, firma e IA | 3 | GPS de flota, firma digital, proveedores de IA |
| Débito automático | 2 | Débito en cuenta (CBU) y con tarjetas |

**Frase para decir:** "No hay una integración 'a ver cómo se hace'. Las 115 tienen su ficha: qué se manda, qué se recibe y qué hacer si falla."

```text
Generá IMG-IN01 con código.
Título grande: "115 integraciones, cada una con su ficha."
Composición: a la izquierda, el número "115" enorme en verde con el rótulo "fichas de integración, en 15 familias". A la derecha, una grilla de 5 × 3 tarjetas, ordenadas de mayor a menor, cada una con el nombre de la familia en negrita, su cifra en verde y dos o tres ejemplos en gris pequeño:
"Fiscal nacional (ARCA)" 17 — CAE, CAEA, padrones ·
"Pasarelas de pago y QR" 13 — Pagos360, Mercado Pago, QR ·
"Datos, legado y plataforma" 11 — ProCoop, Power BI, SFTP ·
"Reguladores y subsidios" 10 — ERSeP, ENACOM, INAES ·
"Cobranza extrabancaria" 9 — Red Link, Rapipago, Pago Fácil ·
"Red y telefonía" 9 — MikroTik, RADIUS, OLT ·
"Otras de la BASE y ProCoop" 9 — imprenta, catastro ·
"Fiscal provincial y municipal" 6 — Rentas Córdoba, ARBA ·
"Comunicaciones" 6 — correo, WhatsApp, SMS ·
"Identidad y mapas" 6 — Google, CiDi, Georef ·
"Medición y prepago" 6 — telemedición, prepagos ·
"Hardware local" 5 — impresoras, turnero ·
"Bancos" 3 — Interbanking ·
"Flota, firma e IA" 3 — GPS, firma digital ·
"Débito automático" 2 — CBU, tarjetas.
Sin logos: solo texto.
Pie: "Cada ficha dice qué se intercambia, en qué formato, cómo se concilia y qué hacer si falla".
```

### IMG-IN02 — Un solo marco para todas.

**Respaldo (T06 §1, §2.3 y §5):** todas las integraciones heredan el mismo marco común, resuelto una sola vez:
- **Bóveda de credenciales** cifrada por cooperativa, con rotación, vencimientos y registro de cada uso; nadie más que el marco de integraciones lee las claves (DEC-074).
- **Certificados digitales** con aviso escalonado antes de que venzan.
- **Modo prueba y modo producción** por cooperativa; pasar a producción requiere aprobación.
- **Cola con reintentos**, control de duplicados (idempotencia), corte automático cuando el tercero no responde (circuit breaker) y límites de velocidad.
- **Bitácora** de cada mensaje enviado y recibido, **sin secretos**.
- **Avisos entrantes firmados** (webhooks) que se guardan antes de procesarse y se deduplican.
- **Archivos por formatos declarados**, en lugar de las unas 504 clases de código que usa ProCoop para cada formato.
- **Conciliación, monitoreo, alertas y contingencia** por conector, con reemplazo manual si hace falta.
- **Agente local** para el hardware de la oficina: turnero, impresoras, lectores y balanza.

Regla de frontera: **un conector nunca escribe los datos de otro módulo**. Entrega un resultado o publica un evento, y el módulo dueño lo aplica con sus propias reglas (DEC-003). Sumar una red de cobranza, una pasarela, un fabricante de medidores o un organismo es **configuración o un adaptador acotado**, nunca un cambio en los módulos de negocio.

**Frase para decir:** "Mañana aparece una pasarela nueva y no hay que tocar la facturación ni la cobranza: se configura un conector y listo."

```text
Generá IMG-IN02 con código.
Título grande: "Un solo marco para todas."
Composición en tres franjas verticales:
- Izquierda, "Módulos de negocio": tres bloques grises apilados, "Facturación", "Cobranza", "Fiscal".
- Centro, un bloque verde alto, "Marco común de integraciones", con nueve renglones con ícono de línea: "Bóveda de credenciales" · "Certificados con aviso de vencimiento" · "Modo prueba y producción" · "Cola con reintentos y sin duplicados" · "Corte automático si el tercero no responde" · "Bitácora sin secretos" · "Avisos entrantes firmados" · "Archivos por formatos declarados" · "Conciliación, alertas y contingencia".
- Derecha, "Terceros": seis tarjetas grises chicas: "ARCA", "Bancos", "Redes de cobranza", "Pasarelas", "Mensajería", "Equipos de red".
Entre módulos y marco, flechas con el rótulo "eventos y resultados"; entre marco y terceros, flechas con el rótulo "conectores".
Abajo, una franja gris claro: "Un conector nunca escribe los datos de otro módulo" · "Sumar una pasarela es configuración, no un cambio en el sistema".
Pie: "Formatos de archivo declarados, en lugar de unas 504 clases de código del sistema actual".
```

### IMG-IN03 — Si un tercero falla, no se duplica nada.

**Respaldo (T06 §5.5, §9 y §12; T08):**
- **Respuesta incierta:** si un tercero no contesta a tiempo, el sistema **consulta el estado antes de reintentar**. Con ARCA, consulta el último comprobante autorizado antes de volver a pedir, así que no hay números salteados ni duplicados.
- **Avisos de pago duplicados o desordenados:** en la prueba, 1.000 notificaciones duplicadas y desordenadas producen **un solo cobro confirmado por pago**. El aviso se acusa en 2 segundos o menos y se procesa después.
- **ARCA lenta:** si tarda más de 5 segundos durante 15 minutos se alerta y se pasa a la contingencia con CAEA.
- **Pasarela caída:** existe un cupón de pago fuera de línea como contingencia.
- **Corte automático:** si un tercero falla seguido, se deja de llamarlo por un rato para no saturarlo, y las operaciones quedan en una bandeja de detenidas, sin perderse.
- **Pérdida de la cola:** si se pierde el servidor de colas, en 15 minutos o menos se reencola todo desde la base, sin duplicar efectos.
- El objetivo de negocio, escrito en la ficha del marco: ninguna caída externa produce cobros duplicados, numeración fiscal salteada ni socios marcados con error por un problema general.

**Frase para decir:** "Los terceros van a fallar. Lo que no puede pasar es que un socio pague dos veces o que la numeración fiscal quede con huecos. El sistema está hecho para eso."

```text
Generá IMG-IN03 con código.
Título grande: "Si un tercero falla, no se duplica nada."
Composición: cuatro filas tipo "situación → respuesta", cada una con un ícono de línea a la izquierda, la situación en gris y, tras una flecha, la respuesta en negro con tilde verde:
1. "El tercero no contesta a tiempo" → "Se consulta el estado antes de reintentar"
2. "Llegan avisos de pago duplicados y desordenados" → "Un solo cobro por pago (probado con 1.000 avisos)"
3. "ARCA tarda más de 5 s durante 15 min" → "Alerta y contingencia con CAEA"
4. "Una pasarela se cae" → "Cupón de pago fuera de línea"
La situación de cada fila con borde ámbar suave; la respuesta con borde verde.
A la derecha, un sello circular verde grande: "0 cobros duplicados · 0 números salteados".
Pie: "Las operaciones detenidas esperan en una bandeja; nada se pierde".
```

---

## 3. Notas para el presentador

- **Dónde va.** IMG-IN01 abre el bloque técnico o va después de IMG-E08 ("Si ARCA se cae, la cooperativa sigue."). IMG-IN03 profundiza esa misma imagen; si hay poco tiempo, mostrar solo una de las dos.
- **El sello de IMG-IN03 es el objetivo de diseño**, escrito en `T06` §1 y verificado por pruebas (la de 1.000 avisos duplicados y la de caos con ARCA). No es una medición en producción todavía.
- **Las 504 clases** son las de ProCoop para leer y generar archivos de bancos y entes. No nombrar al proveedor del sistema actual en voz alta.
- **Algunas fichas dependen de cada cooperativa** (por ejemplo, el organismo provincial o los entes recaudadores que use). La ficha existe; la conexión se habilita por cooperativa.
