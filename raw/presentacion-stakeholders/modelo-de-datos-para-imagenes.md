# CoopApps — El modelo de datos

Tres imágenes dedicadas al modelo de datos: qué tamaño tiene y cómo está organizado, cómo se garantiza que los datos no queden rotos ni huérfanos, y qué le pasa a un dato desde que nace hasta que la cooperativa se lo lleva. Todos los datos salen de la especificación; ninguno promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Fuentes | T05 (§1, §6, §7.0–§7.10), [`07-catalogo-tablas-sql.md`](../especificacion/07-catalogo-tablas-sql.md), [`07-ddl/README.md`](../especificacion/07-ddl/README.md) (`deploy-coopapps-full.sql`), `01` (DEC-110, DEC-117, DEC-064, DEC-075, DEC-097, DEC-100), T08 (RNF-NFR-260), `18-contratos-api.md` (1.069 esquemas API) |
| Relación con otros documentos | `landing-stack-y-modelo-de-datos-para-imagenes.md` ya tiene seis imágenes del modelo (IMG-T11 a IMG-T16: tablas por ola, de la persona a la factura, de la factura al cobro, seis dominios, reglas comunes y crecimiento). Estas tres no las repiten: las completan |
| Datos | Todos los nombres de ejemplo son ficticios |

---

## 0. Cómo usar este documento

1. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
2. Pedir las imágenes por código: "Generá IMG-MD01", "Generá IMG-MD02" y "Generá IMG-MD03".
3. Cada imagen trae una **frase para decir** en voz alta mientras se muestra.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar tres diapositivas sobre el modelo de datos de un sistema para cooperativas de servicios públicos de Argentina. El público mezcla directivos y técnicos: cada imagen tiene que entenderse sin saber de bases de datos, y a la vez no decir nada que un técnico pueda objetar.

El tono es seguro y sereno: el de alguien que ya hizo el trabajo y lo muestra. Nada de adjetivos vacíos ("revolucionario", "increíble", "robusto", "de última generación"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras ni nombres de tablas o campos. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina. Nada de nombres de campos ni código en la imagen, salvo que el prompt lo pida.
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo.
5. Composición limpia: mucho espacio en blanco, un título grande (64 a 80 px), un elemento dominante y como máximo cinco elementos de apoyo. Texto mínimo de 20 px.
6. Tipografía sans serif limpia (Inter o similar), con peso fuerte en títulos y cifras.
7. Íconos de línea simples. Nada de cilindros 3D, nubes brillantes, robots ni efectos futuristas.
8. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-MD01 a IMG-MD03).
```

---

## 1. Las tres ideas

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| IMG-MD01 | 1.058 tablas. Cada una con un solo dueño. | El modelo está completo y ordenado: nadie escribe lo que no le pertenece |
| IMG-MD02 | Sin datos huérfanos. | Cinco mecanismos garantizan que las referencias entre datos no se rompan |
| IMG-MD03 | La vida de un dato. | Cómo nace, cambia, se congela, se conserva y se entrega un dato |

---

## 2. Fichas y prompts

### IMG-MD01 — 1.058 tablas. Cada una con un solo dueño.

**Respaldo (T05 §1, §7.3–§7.10; DEC-117; `07-ddl`):**
- El modelo tiene **1.058 tablas** en **Azure SQL** (29 esquemas por módulo) y **1.069 esquemas** en los contratos de API.
- Cada tabla tiene **un único módulo dueño**, sus claves, sus índices, su clasificación de datos y la ola en que se crea. **Solo el dueño escribe su tabla**: los demás módulos le piden los datos a su servicio o reciben sus eventos.
- Se ordenan en seis dominios: plataforma e identidad; núcleo comercial; medición, tarifa y facturación; cuenta corriente, cobranza y mora; atención, técnica y stock; y ERP administrativo.
- Una sola base compartida por todas las cooperativas, con la cooperativa en cada dato (**DEC-110**). La persona existe una sola vez aunque cumpla varios roles (DEC-097), y todo documento económico lleva la entidad jurídica que lo emite (DEC-064).
- El detalle campo por campo vive en el anexo dueño; T05 es el catálogo lógico; el DDL ejecutable vive en `07-ddl`.

**Frase para decir:** "El modelo no está esbozado: está completo. Más de mil tablas, y cada una tiene un solo dueño que responde por ella."

```text
Generá IMG-MD01 con código.
Título grande: "1.058 tablas. Cada una con un solo dueño."
Composición: en el centro, el número "1.058" enorme en verde con el rótulo "tablas". Alrededor, seis bloques en anillo, cada uno con ícono de línea y su nombre:
"Plataforma e identidad" · "Núcleo comercial" · "Medición, tarifa y facturación" · "Cuenta corriente, cobranza y mora" · "Atención, técnica y stock" · "ERP administrativo".
Dentro de cada bloque, una pequeña insignia gris con forma de llave: "un dueño por tabla".
Debajo, una fila de tres afirmaciones con tilde verde: "Solo el dueño escribe; los demás piden o escuchan" · "La persona existe una sola vez" · "Cada dato lleva su cooperativa".
Pie: "Azure SQL · Esquema por módulo · Claves, índices, clasificación y ola de construcción".
```

### IMG-MD02 — Sin datos huérfanos.

**Respaldo (T05 §7.1.16, DEC-100, DEC-117; `07-ddl`):** en **Azure SQL**, la integridad se combina con **claves foráneas, índices únicos y constraints** en el DDL desplegable (~1.900 referencias declaradas; ciclos documentados con control en despliegue inicial), más **cinco mecanismos de aplicación** que se suman:
1. **Módulo dueño:** antes de guardar una referencia a un dato de otro módulo, se confirma que existe, pertenece a la misma cooperativa y su estado lo permite. Un dato usado por un documento emitido no se borra: se desactiva.
2. **Foto de lo emitido:** una factura guarda los datos tal como eran al emitirse; aunque algo cambie después, se reimprime igual.
3. **Validación en la base:** reglas y FK en tablas económicas exigen referencias obligatorias, aunque alguien escriba sin pasar por el sistema.
4. **Control de versión:** dos personas que modifican el mismo dato a la vez no se pisan; una baja que compite con un alta falla con aviso en lugar de dejar un huérfano.
5. **Verificador nocturno:** cada noche, por cooperativa, recorre todas las referencias declaradas e **informa** cada una que esté rota, sin corregirla, a una bandeja con alerta a operaciones. Si un programador agrega una referencia sin declararla, la construcción del sistema falla.

En la migración, además, se informan los huérfanos del sistema actual antes de cargar y se valida la integridad después de la carga.

**Frase para decir:** "Un dato nunca queda apuntando a la nada. Y si algo raro pasa, el sistema lo avisa a la mañana siguiente; no lo esconde ni lo arregla a ciegas."

```text
Generá IMG-MD02 con código.
Título grande: "Sin datos huérfanos."
Subtítulo: "Cinco controles que se suman. Ninguno corrige a ciegas."
Composición: cinco capas horizontales apiladas, como un filtro, de arriba hacia abajo, cada una con su número, ícono de línea, nombre en negrita y una frase corta:
1. "Módulo dueño" — "Antes de vincular, se confirma que el dato existe y es de la misma cooperativa"
2. "Foto de lo emitido" — "Una factura se reimprime igual aunque algo cambie después"
3. "Validación en la base" — "Las referencias obligatorias se exigen aunque se escriba por fuera"
4. "Control de versión" — "Dos cambios simultáneos no se pisan"
5. "Verificador nocturno" — "Cada noche informa cualquier referencia rota, sin corregirla"
Las capas 1 a 4 en gris claro con borde gris; la capa 5 con borde verde y un ícono de luna pequeño.
A la derecha, una bandeja con un aviso ficticio: "Referencia rota · Cooperativa A · 1 hallazgo · alerta a operaciones".
Pie: "Una referencia nueva sin declarar hace fallar la construcción del sistema".
```

### IMG-MD03 — La vida de un dato.

**Respaldo (T05 §6, §7.1, §7.8.2; T08; T01):**
1. **Nace** con su cooperativa, su entidad jurídica si es económico, su autor y su fecha. Si tiene datos personales, nace clasificado; los sensibles (salud, judiciales, sindicales) y los bancarios se cifran. Ninguna contraseña ni certificado se guarda junto a los datos: van a una bóveda.
2. **Cambia** con control de versión: cada cambio registra quién, cuándo y qué, y dos personas no se pisan.
3. **Se congela al emitirse:** un comprobante guarda la foto de sus datos; no se borra ni se edita, se corrige con un documento contrario.
4. **Se conserva:** facturas, recibos, asientos y movimientos quedan en línea los 10 años. El detalle accesorio de más de 36 meses se archiva cifrado por cooperativa, y el saldo de una cuenta nunca depende del archivo.
5. **Se entrega:** la cooperativa puede exportar sus datos cuando quiera; si deja el servicio, recibe la exportación completa en formatos abiertos, con control de integridad.

Lo que llega del sistema actual conserva la referencia a su registro de origen, para verificar cada dato migrado.

**Frase para decir:** "Cada dato sabe de quién es, quién lo tocó y qué valía cuando se emitió. Y el día que la cooperativa lo pida, se lo lleva completo."

```text
Generá IMG-MD03 con código.
Título grande: "La vida de un dato."
Composición: una línea de tiempo horizontal con cinco etapas, cada una con un círculo numerado, ícono de línea, verbo grande y dos líneas de apoyo:
1. "Nace" — "Con su cooperativa, su autor y su fecha" · "Datos sensibles cifrados; contraseñas en bóveda"
2. "Cambia" — "Quién, cuándo y qué" · "Dos personas no se pisan"
3. "Se congela" — "Lo emitido guarda su foto" · "Se corrige con un documento contrario"
4. "Se conserva" — "Comprobantes y asientos: 10 años en línea" · "Detalle accesorio: archivado y cifrado a los 36 meses"
5. "Se entrega" — "Exportación cuando la cooperativa quiera" · "Completa y en formatos abiertos si se va"
Las etapas 1 a 4 en gris carbón; la etapa 5 en verde.
Debajo de la línea, una franja gris claro: "Lo migrado conserva la referencia a su registro de origen".
Pie: "El saldo de una cuenta nunca depende del archivo".
```

---

## 3. Notas para el presentador

- **Cómo combinarlas con las del documento de landing y stack.** Para un bloque completo de modelo de datos: IMG-MD01, IMG-T14 (seis dominios), IMG-T12 (de la persona a la factura), IMG-MD02, IMG-MD03 e IMG-T16 (pensado para crecer).
- **Integridad relacional.** La base es **Azure SQL** con PK/FK y los cinco mecanismos de IMG-MD02 (DEC-100, DEC-117). Detalle en `07-modelo-relacional-azure-sql.md`.
- **No mostrar campos ni tipos.** Si alguien técnico los pide, se abre `T05` o el §7 del anexo dueño; la imagen no se agranda.
- **"Una sola base compartida"** puede inquietar a un directivo. La respuesta está en IMG-T06 ("Una base, muchas cooperativas, ningún cruce."): el aislamiento está en cada capa y se prueba.
