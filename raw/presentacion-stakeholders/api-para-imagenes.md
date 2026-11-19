# CoopApps — La API

Tres imágenes dedicadas a la API del sistema: cuántas operaciones tiene y para quién, qué reglas cumplen todas, y cómo la cooperativa abre sus datos a terceros de forma controlada. Todos los datos salen de la especificación y de los contratos OpenAPI; ninguno promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | `docs/entregables-analisis-diseno/18-contratos-api.md` (4.193 operaciones, 170 documentos OpenAPI, 1.069 esquemas, convenciones), `18-swagger/specs/goodapps-api-completa.json` (conteo por superficie y por método), `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md` (API para terceros `/api/v1/ext`, RF-BIA-070 a RF-BIA-084, RN-BIA-031 y RN-BIA-035), `T08` (RNF-NFR-002, RNF-NFR-007, RNF-NFR-019, RNF-NFR-020) |
| Datos | Todos los nombres de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
2. Pedir las imágenes por código: "Generá IMG-AP01", "Generá IMG-AP02" y "Generá IMG-AP03".
3. Cada imagen trae una **frase para decir** en voz alta mientras se muestra.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar tres diapositivas sobre la API de un sistema para cooperativas de servicios públicos de Argentina. El público mezcla directivos y técnicos: cada imagen tiene que entenderse sin saber programar, y a la vez no decir nada que un técnico pueda objetar.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "potente", "ilimitado", "de última generación"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, rutas ni nombres. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina. Los términos técnicos (OpenAPI, OAuth, webhook) se dejan como están, siempre con su explicación corta al lado.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición limpia: mucho espacio en blanco, un título grande (64 a 80 px), un elemento dominante y como máximo cinco elementos de apoyo. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras. Si aparece una ruta, en tipografía monoespaciada.
7. Íconos de línea simples. Nada de engranajes brillantes, robots ni efectos futuristas.
8. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-AP01 a IMG-AP03).
```

---

## 1. Las tres ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-AP01 | 4.193 operaciones, todas con contrato. | La API está escrita entera antes de programar, y cada operación tiene su ficha |
| IMG-AP02 | Las mismas reglas en cada operación. | Permisos, errores, duplicados y concurrencia se resuelven igual en todo el sistema |
| IMG-AP03 | Los datos de la cooperativa, abiertos con llave. | Terceros pueden usar los datos, solo con permiso, con límites y con registro |

---

## 2. Fichas y prompts

### IMG-AP01 — 4.193 operaciones, todas con contrato.

**Respaldo (`18-contratos-api.md` y `goodapps-api-completa.json`):**
- La API tiene **4.193 operaciones** (cada combinación de método y ruta), definidas en **170 documentos OpenAPI 3.1**, el estándar para describir APIs, con **1.069 esquemas** de datos. Cubren los 29 módulos con API.
- Todas validan contra el estándar y ninguna ruta se repite.
- Para quién es cada operación:

| Superficie | Operaciones | Quién la usa |
|---|---|---|
| Gestión | 3.399 | El personal de la cooperativa desde la aplicación de gestión |
| Plataforma | 198 | El equipo de GoodApps que opera la plataforma |
| API para terceros | 106 | Sistemas autorizados por la cooperativa (BI, municipio, federación) |
| Públicas | 85 | Landing y trámites sin iniciar sesión |
| Portal, app del socio y otras | 405 | Socios, app de campo, acceso y comunicaciones |

- Por tipo: 1.584 consultas, 1.923 altas y acciones, 406 modificaciones parciales, 111 reemplazos y 169 bajas.
- Cada operación tiene su ficha en lenguaje de negocio: qué hace, qué requisito cumple, quién la usa, qué recibe, qué devuelve y qué pantallas la usan. Hay un visor Swagger que se abre con doble clic, sin servidor ni internet.

**Frase para decir:** "Antes de escribir una línea de código, ya está definida cada operación del sistema: qué recibe, qué devuelve y quién puede usarla."

```text
Generá IMG-AP01 con código.
Título grande: "4.193 operaciones, todas con contrato."
Composición: a la izquierda, el número "4.193" enorme en verde con el rótulo "operaciones de API, descriptas en 170 documentos OpenAPI 3.1". Debajo, dos cifras menores en gris carbón: "1.069 esquemas de datos" · "29 módulos".
A la derecha, una barra horizontal apilada a todo el ancho, dividida en cinco tramos proporcionales con su cifra y rótulo:
"Gestión 3.399" (verde, el tramo dominante) · "Portal, app del socio y otras 405" · "Plataforma 198" · "API para terceros 106" · "Públicas 85" (estos cuatro en grises distintos).
Debajo de la barra, una tarjeta tipo ficha ficticia, sobria: "Qué hace · Qué requisito cumple · Quién la usa · Qué recibe · Qué devuelve · Qué pantallas la usan".
Pie: "Validadas contra el estándar · Ninguna ruta repetida · Visor que se abre sin servidor ni internet".
```

### IMG-AP02 — Las mismas reglas en cada operación.

**Respaldo (`18-contratos-api.md` §Convenciones; T08):**
- **Permiso en cada operación:** el 100 % de las operaciones declara qué permiso exige; las públicas están marcadas como tales.
- **La cooperativa sale de la sesión, nunca del pedido:** el dato de a qué cooperativa pertenece cada operación no viaja en lo que se envía, lo pone la sesión del usuario.
- **Errores iguales en todo el sistema:** un solo formato estándar de error, con código, explicación, el campo que falló y un número de seguimiento para soporte.
- **Repetir no duplica:** toda escritura acepta una clave de idempotencia; si el pedido se repite por un corte de conexión, se aplica una sola vez.
- **Nadie pisa el trabajo de otro:** para modificar un registro hay que indicar su versión; si otro lo cambió antes, se avisa en lugar de sobrescribir.
- **Listados con tope:** como máximo 100 filas por página; la meta es responder en 0,4 segundos o menos en el 95 % de los casos.
- **Lo pesado va en segundo plano:** las operaciones largas responden "aceptado" con un número de seguimiento, y toda exportación de más de 10.000 filas es asíncrona.
- **Cuotas por cooperativa:** 600 pedidos por minuto por usuario y 6.000 por cooperativa por defecto; superarlas devuelve "esperá y reintentá", sin afectar a las demás.

**Frase para decir:** "No hay 4.193 formas de hacer las cosas. Hay una sola, y se aplica igual en cada operación."

```text
Generá IMG-AP02 con código.
Título grande: "Las mismas reglas en cada operación."
Composición: una cuadrícula de 4 × 2 tarjetas iguales, cada una con ícono de línea, la regla en negrita y una frase corta en gris:
"Permiso declarado" — "El 100 % de las operaciones dice qué permiso exige" ·
"La cooperativa la pone la sesión" — "Nunca viaja en el pedido" ·
"Un solo formato de error" — "Con código, campo y número de seguimiento" ·
"Repetir no duplica" — "Un pedido repetido se aplica una sola vez" ·
"Nadie pisa a nadie" — "Se modifica indicando la versión" ·
"Listados con tope" — "Hasta 100 filas por página, en 0,4 s" ·
"Lo pesado, en segundo plano" — "Más de 10.000 filas, siempre asíncrono" ·
"Cuotas por cooperativa" — "Lo que hace una no frena a las demás".
Las tarjetas con borde gris claro y el ícono en verde.
Pie: "Una sola forma de hacer las cosas, en las 4.193 operaciones".
```

### IMG-AP03 — Los datos de la cooperativa, abiertos con llave.

**Respaldo (T10 §5 y §11.2.6; T08 RNF-NFR-019):** la API para terceros (`/api/v1/ext`) permite que la cooperativa conecte su propio BI, el municipio, una federación o sus sistemas, con estas condiciones:
- **Cliente registrado:** cada sistema externo se da de alta por cooperativa, con responsable, finalidad, contacto técnico, vigencia y restricciones (por ejemplo, por sucursal o por servicio).
- **Credenciales estándar:** OAuth 2.0 (credenciales de cliente) o, para herramientas de BI, una clave de solo lectura que no puede escribir.
- **Mínimo privilegio:** cada cliente tiene permisos por recurso y acción. Sin el permiso de datos personales, el documento de una persona sale enmascarado. Los permisos de escritura y de datos personales requieren aprobación y finalidad declarada.
- **Límites:** por defecto 60 pedidos por minuto y 50.000 registros por día por cliente, ajustables por plan; la meta es responder en 0,8 segundos o menos por página de hasta 1.000 registros, sin afectar el cobro en caja.
- **Extracción incremental:** el tercero trae solo lo que cambió desde la última vez; las exportaciones masivas son asíncronas y vencen.
- **Avisos salientes firmados** (webhooks): el sistema avisa que algo pasó, sin datos personales en el aviso; el tercero pide el detalle con sus permisos.
- **Versiones estables:** los cambios en la versión 1 solo agregan; lo que se retira se anuncia con anticipación.
- **Registro de cada llamada:** quién, qué, cuándo, con qué resultado y cuántas filas, sin guardar claves ni tokens.
- **Documentación por cooperativa:** cada una ve en su portal de documentación solo los recursos que tiene contratados, con ejemplos ficticios.
- Se construye en la ola O11.

**Frase para decir:** "Los datos son de la cooperativa, y la cooperativa decide quién los usa. Cada sistema externo entra con su llave, ve solo lo que se le permite y deja registro de todo."

```text
Generá IMG-AP03 con código.
Título grande: "Los datos de la cooperativa, abiertos con llave."
Composición: en el centro, un bloque verde "Datos de la Cooperativa A" con una cerradura de línea al frente. A la izquierda, tres tarjetas grises de sistemas externos: "BI propio", "Municipio", "Federación"; cada una con una llave pequeña y una flecha hacia la cerradura con el rótulo "/api/v1/ext" en tipografía monoespaciada.
A la derecha, una columna de cinco condiciones con tilde verde:
"Cliente registrado con responsable y finalidad" ·
"Solo ve lo que se le permite; datos personales enmascarados sin permiso" ·
"60 pedidos por minuto y 50.000 registros por día por defecto" ·
"Trae solo lo que cambió" ·
"Cada llamada queda registrada".
Abajo, una franja gris claro: "Avisos salientes firmados, sin datos personales · Versiones estables con aviso antes de retirar algo".
Pie: "La cooperativa decide quién usa sus datos".
```

---

## 3. Notas para el presentador

- **Dónde va.** IMG-AP01 después de IMG-E02 ("Está todo escrito.") en una reunión general, o al abrir el bloque técnico. IMG-AP03 se complementa con IMG-E11 ("Los datos son de la cooperativa.").
- **Si se puede, mostrar el visor en vivo.** El visor Swagger (`docs/entregables-analisis-diseno/18-swagger/index.html`) se abre con doble clic y permite recorrer cualquier operación. "Probar" está deshabilitado porque todavía no hay sistema detrás; aclararlo antes de que alguien lo intente.
- **Puntos a validar en IMG-AP03.** La autenticación de terceros (PA-BIA-02) y el esquema de permisos por campo (PA-BIA-14) están marcados "A validar"; la imagen muestra lo previsto, sin presentarlo como cerrado.
- **Los 29 módulos con API** son M01 a M19 y los transversales T01 a T04 y T06 a T11. T05 (modelo de datos) y T12 (fichas de servicios) no exponen API propia.
- **"Gestión 3.399"** incluye todas las pantallas del personal. No hace falta explicar la división técnica de rutas; alcanza con decir para quién es cada superficie.
