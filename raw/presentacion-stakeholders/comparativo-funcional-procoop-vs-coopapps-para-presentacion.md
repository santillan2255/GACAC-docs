# CoopApps — Del comparativo funcional a la presentación (marketing, gerencia y técnico)

Guía para **armar diapositivas y discurso** a partir del comparativo exhaustivo, **sin perder rigor**. Cada bloque tiene tres capas:

| Capa | Quién la usa | Qué contiene |
|---|---|---|
| **Público** | Marketing, diseño, comunicación | Título de slide, idea en una frase, texto visible sugerido (máx. 15 palabras por viñeta) |
| **Gerencia** | Presidente, gerentes, consejo | Riesgo/beneficio, decisión implícita, “qué preguntar” |
| **Respaldo** | Sistemas, facturación, contador, legal | Números verificables, trazabilidad al comparativo y a la especificación |

| Dato | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Documento fuente (anexo técnico) | [`comparativo-funcional-procoop-vs-coopapps.md`](./comparativo-funcional-procoop-vs-coopapps.md) v1.1 |
| Documentos hermanos | `dolores-procoop-antes-y-despues.md`, `documento-base-presentacion.md`, `lo-esencial-para-imagenes.md` |
| **Comparativo exhaustivo (muchas slides)** | [`comparativo-funcional-imagenes-exhaustivas-hoy-vs-coopapps.md`](./comparativo-funcional-imagenes-exhaustivas-hoy-vs-coopapps.md) — códigos **IMG-V00…V35**, tabla Hoy \| Con CoopApps por función |
| **Megaspec + imágenes funcionales** | [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md) + [`comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`](./comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md) (**IMG-F**, sin códigos M/T en tabla) |
| **Deck marketing “lo nuevo”** | [`lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md`](./lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md) — **IMG-N00…N23** |
| Regla | **No inventar números ni promesas.** Si un dato no está en el comparativo o en el documento base, dejarlo en ámbar “a validar con el equipo”. |

---

## 0. Cómo usar este documento (marketing y diseño)

### 0.1 Flujo recomendado

1. Elegir **una versión** de la presentación (§1: corta / estándar / completa).
2. Por cada slide, copiar la capa **Público** al PowerPoint; pegar **Gerencia** en notas del presentador; guardar **Respaldo** en anexo impreso o PDF de respaldo.
3. Si alguien pide prueba (“¿dónde está escrito?”), abrir el comparativo en la sección citada en **Respaldo**.
4. Para imágenes con IA: usar el prompt maestro §0.2 y los códigos **IMG-C01…** de §2.

### 0.2 Prompt maestro para Claude (copiar y pegar)

Adjuntá en el chat, en este orden:

1. `comparativo-funcional-procoop-vs-coopapps-para-presentacion.md` (este archivo)
2. `comparativo-funcional-procoop-vs-coopapps.md` (anexo técnico)
3. Opcional para bloque dolores / guion completo: `dolores-procoop-antes-y-despues.md`, `documento-base-presentacion.md`

Luego pegá el bloque siguiente.

```text
Sos mi diseñador de presentación ejecutiva para una reunión con directivos de cooperativas de servicios públicos de Argentina. El producto es CoopApps (SaaS en la nube); el sistema de referencia es ProCoop (escritorio).

Te adjunto la guía de presentación del comparativo funcional y el comparativo v1.1. Son la única fuente de textos y números.

MENSAJE CENTRAL (no desviarte):
"ProCoop es respetable y profundo. CoopApps cubre el mismo negocio (119 de 120 funciones del menú relevado), mejora lo que duele (nube, portal en vivo, seguridad, migración por etapas) y suma experiencia digital con la marca de cada cooperativa — sin apagar la operación un viernes."

REGLAS OBLIGATORIAS
1. Usá SOLO datos de los archivos adjuntos. No inventes cifras, módulos, promesas ni nombres de cooperativas reales. Si falta un dato, dejá un hueco con "—" y avisame.
2. Español de Argentina, formal y claro. Sin adjetivos vacíos: nada de "revolucionario", "disruptivo", "líder", "el mejor".
3. ProCoop: siempre con respeto ("sistema de referencia", "lo que usan hoy"). El "antes" en grises apagados; nunca rojo chillón para atacar al competidor.
4. CoopApps / lo nuevo: acento verde cooperativo #2E7D32. Ámbar #B7791F solo para API completa en ola O11 o temas "a decidir". Rojo #B91C1C solo si el documento cita un defecto de seguridad comprobado (no inventar).
5. Paleta general: títulos #2F343A, texto secundario #6B7280, tarjetas #E5E7EB, fondo #FFFFFF.
6. Formato: cada diapositiva como artefacto HTML autocontenido con SVG (o canvas) 1920×1080 px, 16:9, listo para capturar o exportar a PNG. NO uses el generador de imágenes para slides con números o tablas (deforman cifras).
7. Tipografía sans serif (Inter o similar). Título 56–72 px; viñetas ≥20 px; mucho aire; máximo 4 viñetas por slide.
8. Íconos de línea simples. Estilo consultora sobria: sin robots, cerebros, cohetes ni personas caricaturescas.
9. Datos ficticios: "Cooperativa A", "Socio de ejemplo", importes redondos. Nunca DNI, CUIT ni direcciones reales.
10. Estados: nunca solo color; siempre texto o ícono + color.
11. Comparativos "Hoy / Con CoopApps": columna izquierda "Hoy" (gris), derecha "Con CoopApps" (verde suave), salvo que el documento indique otro layout.
12. Después de CADA imagen, en el chat (no en el SVG), entregá tres bloques:
    - Público (lo que va en la slide)
    - Gerencia (notas del orador, 3–5 líneas)
    - Respaldo (sección del comparativo o guía §2)
    - Lista de números usados y su sección fuente

CÓDIGOS DE ESTE BLOQUE (prioridad reunión comparativo)
Genero las diapositivas bajo pedido con estos códigos, tomando textos de la §2 de la guía adjunta:

IMG-C01 Portada comparativo
IMG-C02 Respeto por ProCoop
IMG-C03 Número ancla 119/120 funciones del menú
IMG-C04 Ocho aplicaciones, un solo dato
IMG-C05 Socio: misma información que caja
IMG-C06 Siete dolores (resumen; detalle visual en IMG-D03 si adjunto dolores)
IMG-C07 Facturación y cobranza con control
IMG-C08 Técnica y campo, flujo integral
IMG-C09 Lo nuevo más allá de reemplazar pantallas
IMG-C10 Diecisiete familias de servicio
IMG-C11 Migración: 12 olas O0–O11, sin big bang
IMG-C12 Checklist consejo (6 ítems de la guía §12 del comparativo)

Opcionales si pido versión estándar/completa: IMG-C13 a IMG-C24 (misma guía §2).

GUION UNIFICADO (si pido "deck completa")
Seguí el orden §0.5 de la guía: IMG-C encajan en pasos 5, 8–12, 14, 17, 22; el resto son IMG-01…25, IMG-D, IMG-E, IMG-A según tabla §0.6 — no dupliques el mismo número en dos slides distintas.

PROHIBIDO DECIR EN TEXTO VISIBLE
- "Mismas pantallas" (decir: misma función de negocio)
- "API desde el día 1" (decir: exportaciones ya; API documentada planificada O11, salvo ámbar)
- "Tiempo real al milisegundo"
- "Sin ProCoop" / "reemplazo total inmediato"

PLANTILLA POR PEDIDO
Cuando yo escriba "Generá IMG-C03", hacé:
1. Leer §2 IMG-C03 de la guía (capas Público, Gerencia, Respaldo).
2. Crear HTML/SVG 1920×1080 con el contenido Público.
3. Responder con Gerencia, Respaldo y verificación de números.

Confirmá que leíste los adjuntos y esperá mi primer código (sugerencia: empezar por IMG-C02, luego IMG-C03).
```

### 0.3 Glosario en lenguaje llano (para no errar el discurso)

| Si en marketing decís… | Significa funcionalmente… | No decir (impreciso) |
|---|---|---|
| “La app del socio con la marca de la cooperativa” | M19 portal/PWA + T03 marca por canal | “App nueva mágica” |
| “Misma información en oficina y en el celular” | Sin réplica MySQL CoopOnline; un solo dato | “Tiempo real milisegundo” |
| “Todo el menú cubierto” | 119/120 funciones PC con destino | “Mismas pantallas” |
| “Migración por etapas” | Olas O0–O11; paralelo factura a factura | “Cambio un fin de semana” |
| “Los datos son de la cooperativa” | Exportación tenant + reportes; API O11 | “API desde el día 1” (salvo decisión de adelanto) |
| “Más control” | Reglas, auditoría, aprobaciones, lotes | “Más botones” |

### 0.4 Familias de códigos (una sola reunión, un solo guion)

Todos los documentos de `presentacion-stakeholders` usan prefijos distintos. **No se mezclan en la misma slide** salvo que la tabla de cruces lo indique.

| Prefijo | Documento | Rol en la reunión |
|---|---|---|
| **IMG-01…25** | `documento-base-presentacion.md` | Hilo principal: relevamiento, especificación, arquitectura, olas, propuesta |
| **IMG-D01…14** | `dolores-procoop-antes-y-despues.md` | Bloque emocional y honesto “hoy → CoopApps” (reemplaza IMG-08) |
| **IMG-C01…24** | Este documento | Bloque **comparativo funcional** ProCoop vs CoopApps (menú, módulos, socio) |
| **IMG-E01…12** | `lo-esencial-para-imagenes.md` | Refuerzo de **una idea + un número** entre bloques (opcional, no duplicar mensaje) |
| **IMG-A01…08** | `alcance-especificacion-modulo-por-modulo.md` | Profundizar alcance si preguntan “¿qué trae cada módulo?” |
| **IMG-F-M\*, T\*** | Ídem | Fichas por módulo; **anexo** o reunión técnica larga |

**Regla de oro:** el **documento base** lleva la historia del *proyecto*; **IMG-D** lleva los *dolores*; **IMG-C** lleva la *prueba de cobertura funcional* (“no perdemos el menú”). Los tres deben decir lo mismo en los números críticos: **119/120**, **12 olas**, **API en O11**.

### 0.5 Guion unificado recomendado (reunión ejecutiva con comparativo)

Orden para **una sola presentación** de ~50–60 minutos, sin saltar de narrativa. La columna **Generar** indica qué código pedir a Claude/ChatGPT (puede ser más de una imagen por fila).

| Orden | Bloque | Mensaje en voz alta | Generar (prioridad) | Notas del presentador |
|---|---|---|---|---|
| 1 | Apertura | “Del relevamiento al plan de construcción.” | IMG-01 | Documento base §1.1 |
| 2 | Contexto | “Escuchamos sus prioridades.” | IMG-02 | |
| 3 | Trabajo hecho | “Lo que estaba planificado en meses ya está escrito.” | IMG-03, IMG-E01 | E01 refuerza el contraste tiempo |
| 4 | Método | “No solo entrevistas: leímos el sistema.” | IMG-05, IMG-06 | Iceberg + números ProCoop |
| 5 | Respeto | “ProCoop hace mucho; no venimos a restarle.” | **IMG-C02** | Antes del bloque dolores |
| 6 | Dolores | “Esto nos dijeron que dolía.” | **IMG-D02**, **IMG-D03** | **Sustituye IMG-08** |
| 7 | Antes/después | “Así cambia en la práctica.” | IMG-D04 a IMG-D10 | Corta: solo D04, D07, D08, D10 |
| 8 | Cobertura menú | “Función por función: 119 de 120.” | **IMG-C03** | Número ancla del comparativo |
| 9 | Socio | “Misma información que caja.” | **IMG-C05**, IMG-D07, IMG-A06 | Evitar repetir D07 y C05 mismo título |
| 10 | Operación | “Facturar y cobrar con control.” | **IMG-C07**, IMG-E05, IMG-18 | |
| 11 | Campo | “Del turno a la conformidad.” | **IMG-C08**, IMG-D13 | |
| 12 | Amplitud | “Diecisiete servicios, reglas propias.” | **IMG-C10**, IMG-A02 | |
| 13 | Especificación | “Está todo escrito y trazado.” | IMG-09, IMG-10, IMG-11, IMG-12 | |
| 14 | Comparativo módulos | “De ProCoop a CoopApps, sin huecos.” | **IMG-C04**, IMG-A07 | A07 visual; C04 texto gerencia |
| 15 | Principios | “Casos difíciles ya pensados.” | IMG-A04, IMG-A05, comparativo §10 | |
| 16 | Arquitectura | “Cómo funciona por dentro.” | IMG-16, IMG-17 | |
| 17 | Migración | “Sin apagar un viernes.” | **IMG-C11**, IMG-21, IMG-22 | Mismo mensaje que IMG-22 |
| 18 | Escuchamos | “43 necesidades del equipo anterior.” | IMG-13, IMG-14 | |
| 19 | Decisiones | “Qué falta que decidan ustedes.” | IMG-19, IMG-20 | API adelantada = ámbar |
| 20 | Riesgos y plazo | “Medimos antes de prometer.” | IMG-23, IMG-24, IMG-E12 | |
| 21 | Cierre dolores | “Cada dolor trazado a requisito.” | IMG-D14 | |
| 22 | Cierre comparativo | “Checklist para el consejo.” | **IMG-C12** | Reparte anexo comparativo PDF |
| 23 | Propuesta | “Tres pasos para seguir.” | IMG-25, IMG-E13 o IMG-L02 | `como-tomar-la-especificacion` |

**Versión corta (25 min):** filas 1, 3, 5, 6, 8, 9, 17, 22, 23 — resto en anexo.

**Frase única del bloque comparativo (antes de IMG-C03):**  
*“Ahora la pregunta concreta: ¿perdemos algo del menú que usan hoy? La respuesta está relevada función por función.”*

### 0.6 Tabla de cruces (IMG-C ↔ IMG ↔ IMG-D ↔ IMG-E ↔ IMG-A)

Usar para **no duplicar** slides ni contradecir números. Si dos códigos comparten fila, elegir **uno** en la deck y dejar el otro en anexo.

| IMG-C (comparativo) | Equivalente / complemento | Dolores IMG-D | Esencial IMG-E | Alcance IMG-A | Sección comparativo |
|---|---|---|---|---|---|
| C01 Portada comparativo | IMG-01 (portada general) | D01 portada bloque | — | — | §1 |
| C02 Respeto ProCoop | IMG-05, IMG-06 | D02 | — | — | §1.3 |
| C03 **119/120** | **IMG-12** cobertura | D14 (cierre trazabilidad) | **E04** nada se pierde | **A07** ProCoop→módulos | §0.3, §3 |
| C04 Ocho aplicaciones | IMG-10 mapa | — | — | A01 mapa 30 módulos | §0.2, §4 |
| C05 Socio mismo dato | — | **D07**, **D08** | **E09** bolsillo socio | **A06** socio punta a punta | §2.2, §6.4 |
| C06 Siete dolores | ~~IMG-08~~ usar D | **D03** | — | — | §2 + dolores §2.1 |
| C07 Facturación/cobranza | IMG-18 ARCA flujo | — | **E05** cada peso; **E08** ARCA | F-M05, F-M07 | §3.4–6, §10 |
| C08 Técnica/campo | — | **D13** instalación | — | F-M10 | §3.7, §6.1 |
| C09 Lo nuevo | IMG-09 pirámide RF | D11 vocabulario, D12 parámetros | E02 todo escrito | A04 principios | §6 |
| C10 17 servicios | — | — | E07 ley no config | **A02** servicios | §5 |
| C11 Migración olas | **IMG-21**, **IMG-22** | D14 | — | — | §8.1 |
| C12 Checklist | IMG-25 (parcial) | D14 | E12 medir antes | — | §12 |
| C13 Menú 9 pestañas | IMG-06 números | — | — | — | §3 completo |
| C14 Permisos | IMG-17 seguridad (parcial) | — | — | — | §2.1 |
| C15 Integraciones | IMG-16 arquitectura | D06 datos (API) | **E11** datos coop | — | §9 |
| C16 Contador | — | — | E06 nada se borra | F-M06, F-M15 | §10 |
| C17 Compras | — | — | — | F-M12 | §3.8 |
| C18 Sueldos | — | — | — | F-M16 | §3.10 |
| C19 FAQ | IMG-20 decisiones | — | — | — | §11 |
| C20 Qué no copiamos | IMG-16 | D04 nube, D05 servidores | **E10** sin servidores | — | §7 |
| C21 Números RF | IMG-11 | — | **E02**, E03 pruebas | — | §0.4 |
| C22 Mapa 19+12 | IMG-10 | — | — | A01 | §4, §4.1 |
| C23 Por rol | — | — | — | `roles-y-modulos` | §1.1 + roles doc |
| C24 Anexo 120 PC | — | — | — | — | comparativo §3 |

**Conflictos resueltos (acordar con marketing):**

| Tema | Decisión en guion unificado |
|---|---|
| Diapositiva 8 documento base (IMG-08) | **No usar**; usar **IMG-D02 + D03** (+ opcional D04–D10) |
| “119/120” vs “100 % cobertura” IMG-12 | Mismo hecho: IMG-12 habla de entregables; **IMG-C03** del menú ProCoop. En voz: “del menú relevado, 119 de 120”. |
| API terceros | **IMG-D06** y **IMG-C15** en ámbar hasta O11; complemento **IMG-AP03** si hay bloque técnico |
| Lo esencial IMG-E | Máximo **3–4** imágenes por reunión (E01, E04, E09, E12) para no repetir bloques |

---

## 1. Tres versiones de la presentación

| Versión | Slides | Duración | Audiencia | Qué omitir |
|---|---|---|---|---|
| **Corta** | 12 (IMG-C01–C12) | 20–25 min | Consejo con poco tiempo | Detalle menú por pestaña |
| **Estándar** | 18 (+ C13–C18) | 40–50 min | Gerencia + jefes de área | Tabla PC ítem por ítem |
| **Completa** | 24 (+ C19–C24) | 60–90 min | Comité de proyecto + TI | Llevar comparativo completo como anexo |

En las tres versiones, cerrar con **checklist §12** del comparativo (slide **IMG-C12**). Si la reunión sigue el **guion unificado §0.5**, C12 va después de IMG-D14 e IMG-22.

**Solo comparativo (sin documento base):** usar §1 versión Corta = IMG-C01…C12 en orden.

---

## 2. Guión slide por slide (tres capas)

Convención: **IMG-Cnn** = código para pedir imagen o slide.

---

### IMG-C01 — Portada

| Capa | Contenido |
|---|---|
| **Público** | **Título:** CoopApps y su cooperativa: mismo negocio, nueva plataforma. **Subtítulo:** Comparativo funcional respecto de ProCoop. |
| **Gerencia** | Enmarcar: no es “tirar ProCoop”, es **evolucionar sin huecos** con plan de olas. |
| **Respaldo** | DEC-007; comparativo §1; documento base §2. |

**Frase oral:** “Les mostramos qué tienen hoy, qué propone CoopApps y cómo se pasa sin frenar la operación.”

---

### IMG-C02 — Respeto por lo que tienen hoy

| Capa | Contenido |
|---|---|
| **Público** | **Título:** ProCoop hace mucho. Y lo hace bien. **Viñetas:** Facturación masiva · Multiservicio · Mora, compras, sueldos · Confianza de años. |
| **Gerencia** | Evita batalla ideológica; abre puerta a “¿qué mejora el modelo?” |
| **Respaldo** | DEMO ~12.500 comprobantes/mes; comparativo §1.3; dolores §1.4. |

**Frase oral:** “No venimos a desmentir su sistema actual: venimos a quitarle fricción al modelo.”

---

### IMG-C03 — La promesa en una slide

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Lo que ProCoop hace hoy → cubierto en CoopApps. **Número grande:** **119 de 120** funciones del menú relevado con destino. **Pie:** La restante es administrar la base de datos: en la nube lo hace la plataforma. |
| **Gerencia** | Mensaje de **continuidad operativa**; el riesgo “perdemos un módulo” queda acotado. |
| **Respaldo** | T03 §22: 112 absorbidas, 7 reemplazadas, 1 descartada, 0 sin destino — comparativo §0.3, §3. |

---

### IMG-C04 — Ocho aplicaciones, un solo dato

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Una cooperativa, ocho formas de trabajar. **Lista corta:** Gestión web · App del socio (su marca) · Campo sin señal · Empleados · Sitio público · Tótem · (Plataforma) · Datos para integraciones. |
| **Gerencia** | Argumento **integral**: conviene migrar el ecosistema, no solo facturación. |
| **Respaldo** | Comparativo §0.2, §8; alcance §7 aplicaciones. |

**Visual sugerido:** círculo central “Una sola información” y 8 íconos alrededor.

---

### IMG-C05 — El socio (historia simple)

| Capa | Contenido |
|---|---|
| **Público** | **Título:** El socio ve lo mismo que ve caja. **Antes:** portal sobre copia sincronizada. **Después:** contratar, pagar, reclamar y dar de baja desde el celular con **marca de la cooperativa**. |
| **Gerencia** | Menos reclamos por “en la web dice otra cosa”; más cobranza digital. |
| **Respaldo** | Comparativo §2.2, §6.4; dolores D4, D5; M19. |

**Frase oral:** “Hoy muchas veces el portal va ‘detrás’ de la oficina. CoopApps unifica el dato.”

---

### IMG-C06 — Dolores que ya tienen respuesta escrita (7)

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Siete dolores, siete respuestas en especificación. **Viñetas:** Nube · Sin servidores propios · API de sus datos (plan) · App del socio · Su marca · Seguridad verificable · Soporte con caso y registro. |
| **Gerencia** | Conecta con pedidos del primer relevamiento; muestra **trabajo hecho**. |
| **Respaldo** | `dolores-procoop-antes-y-despues.md` §1.1 tabla D1–D7; comparativo §2. |

**Nota presentador (honestidad):** API completa en **O11**; antes, exportaciones y reportes (viñeta ámbar si preguntan).

---

### IMG-C07 — Facturación y cobranza (gerencia operativa)

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Facturar y cobrar con control. **Viñetas:** Lotes con excepciones visibles · Un solo cálculo de intereses · Pago confirmado antes de reconectar · Sin guardar números de tarjeta. |
| **Gerencia** | Menos riesgo fiscal y de cobro duplicado; mejor recupero de mora. |
| **Respaldo** | M05, M07, M08; comparativo §3.4–3.6, §10. |

---

### IMG-C08 — Técnica y campo (historia)

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Del turno a la conformidad, en un solo flujo. **Viñetas:** Factibilidad · Visita con estado visible · Una app para técnico, lecturista y cobrador · Equipos rastreados por serie. |
| **Gerencia** | Primera impresión del socio; menos visitas fallidas sin registro. |
| **Respaldo** | M10, M13; dolores D13; comparativo §3.7, §6.1 ítems 2–3. |

---

### IMG-C09 — Lo nuevo que vende el cambio (no está en el menú)

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Lo que suma, más allá de “reemplazar pantallas”. **Viñetas:** Institucional y asambleas · Comunidad y avisos por zona · Diccionario propio (socio/asociado) · Expediente digital · Indicadores que coinciden en todo canal. |
| **Gerencia** | Justifica inversión **a 10 años**, no solo equivalencia. |
| **Respaldo** | Comparativo §6.1–6.3, M17, T09, T11; lista 49 ítems §6. |

---

### IMG-C10 — Diecisiete servicios, reglas propias

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Electricidad, gas, agua… y también sepelio, cementerio, vivienda. **Mensaje:** Cada servicio con sus reglas; la ley no se “apaga” con un parámetro. |
| **Gerencia** | Multiservicio sin parches; protecciones electrodependientes, mínimo vital, etc. |
| **Respaldo** | Comparativo §5, §10 casos difíciles; T12; alcance §3. |

**Frase oral:** “No es un abono genérico: cada familia de servicio tiene su ficha.”

---

### IMG-C11 — Migración sin apagar un viernes

| Capa | Contenido |
|---|---|
| **Público** | **Título:** Cambio por etapas. **Viñetas:** Convivencia con ProCoop · Comparar factura a factura · Dos ciclos conciliados · Códigos de barras antiguos aún válidos en transición. |
| **Gerencia** | Reduce miedo del consejo; explicita **cuándo** se apaga ProCoop. |
| **Respaldo** | T07; comparativo §8.1 tabla O0–O11; DEC-089 corte comercial O7, administrativo O11. |

**Número para slide:** **12 olas** (O0–O11), **172** prompts de construcción (plan §1).

---

### IMG-C12 — Cierre y checklist

| Capa | Contenido |
|---|---|
| **Público** | **Título:** ¿Qué pueden validar hoy? **Checklist 6 ítems:** Menú cubierto · Multiservicio · Socio paga y reclama · Mora con norma · Migración por etapas · Datos exportables. |
| **Gerencia** | Llamado a **decisión**: validar piloto, prioridades, fecha de paralelo. |
| **Respaldo** | Comparativo §12 completo (12 ítems); comparativo §14 frase cierre. |

---

### Slides opcionales (presentación estándar / completa)

| Código | Título público | Gerencia | Respaldo comparativo |
|---|---|---|---|
| **IMG-C13** | Las 9 pestañas de hoy, reordenadas | Curva de adopción: búsqueda “como en ProCoop” (T03) | §3 por pestaña |
| **IMG-C14** | Permisos: menos “usuario Dios” | 40 roles plantilla; separación de funciones | §2.1, T02 |
| **IMG-C15** | Integraciones bajo control | Bóveda de credenciales; reintentos sin duplicar | §9 |
| **IMG-C16** | Contador y auditoría tranquilos | Nada se borra; libro IVA; auditoría encadenada | §10, M06, M15 |
| **IMG-C17** | Compras y proveedores | Anti-fraude CBU; tres vías | §3.8, M12 |
| **IMG-C18** | Personal y sueldos | Libro sueldo digital; dos meses en paralelo | §3.10, M16, O9 |
| **IMG-C19** | Preguntas que van a hacer | FAQ preparada | §11 |
| **IMG-C20** | Qué no copiamos tal cual (y por qué) | Escritorio → web; réplica → dato único | §7 |
| **IMG-C21** | Números de la especificación | Profundidad del trabajo ya hecho | §0.4: 4.213 RF, 293 RNF, 31 anexos |
| **IMG-C22** | Mapa mental 19 + 12 módulos | Dónde vive cada área | §4, §4.1 DFA 29 |
| **IMG-C23** | Por rol: qué gana cada uno | Matriz consejo/gerencia/áreas | §1.1 + `roles-y-modulos-para-claude.md` |
| **IMG-C24** | Anexo: 120 funciones | “Si dudan de un ítem del menú, está en el PDF” | Comparativo §3 completo |

---

## 3. Matriz “mensaje marketing ↔ respaldo gerencial/técnico”

Para copy de folletos, mail o landing **sin contradecir** a sistemas.

| Mensaje marketing (permitido) | Condición / matiz gerencial | Respaldo técnico (una línea) |
|---|---|---|
| “Cubrimos el ProCoop que usan” | Mismo **negocio**, no mismas pantallas | PC-001…120 → SM-* (T03 §22) |
| “App del socio a su medida” | Requiere publicar marca (T03, M19) | RF-POR marca, PWAs por tenant |
| “En la nube, sin servidores” | SaaS; backup del proveedor + exportación propia | T01 RF-PLA-119, exportación tenant |
| “Facturación masiva segura” | Piloto debe validar volumen real | RNF capacidad 50k suministros/60 min (T08) |
| “Integrado con ARCA, bancos, SIRO…” | Cada cooperativa habilita fichas | T06 115 fichas; modo prueba/producción |
| “Inteligencia artificial que ayuda” | No ejecuta cobros/cortes solo | Principio IA asiste; M09, M04, M12 |
| “Open API para la cooperativa” | **O11** (adelanto RO solo lectura: decisión) | T10 RF-BIA API ext; dolores §2.3 |
| “Institucional completo” | Ola **O10**; mínimo antes en O2/O4 | M17 anexo |
| “Migración acompañada” | Piloto Laguna Larga; 2 ciclos paralelos | T07, DEC-088/089 |

---

## 4. Discurso por perfil (30 segundos cada uno)

Texto listo para notas del presentador o video corporativo.

| Perfil | Texto |
|---|---|
| **Socio (comunicación externa)** | “Va a tener la cooperativa en el celular con su nombre y sus colores: misma deuda, mismas facturas y mismos trámites que en ventanilla, sin esperar a que se sincronice un portal aparte.” |
| **Presidente / consejo** | “No le quitamos funciones al menú que ya conocen: 119 de 120 están cubiertas. El cambio es por etapas, con dos facturaciones comparadas antes de apagar el sistema viejo, y sus datos se pueden exportar si algún día lo necesitan.” |
| **Gerente general** | “Un solo dato para oficina, campo y portal; indicadores que no discuten entre sí; y reglas escritas para los casos difíciles —mora, electrodependientes, multiservicio— que hoy viven en parámetros que pocos dominan.” |
| **Jefe de sistemas** | “Desaparece el Agente y la réplica MySQL de CoopOnline: el portal consume el mismo backend que la gestión. Integraciones con bóveda, idempotencia en cobros y FE, y mapa PC→SM para no perder trazabilidad en la migración.” |
| **Marketing interno** | “Por fin pueden comunicar con marca propia: landing, app instalable, avisos por barrio cuando hay un corte, encuestas y NPS —sin pedir desarrollo a medida cada vez.” |

---

## 5. Objeciones frecuentes — respuesta en tres capas

| Objeción (público) | Respuesta corta (slide) | Gerencia | Respaldo |
|---|---|---|---|
| “¿Perdemos funciones?” | **119/120** del menú relevado. | Pedir lista de 5 funciones críticas propias y cruzar con §3. | Comparativo §3, §12 ítem 1 |
| “El portal ya existe” | Sí: **CoopOnline**. Mejora: **mismo dato** que caja. | Medir reclamos “web distinta a oficina”. | §2.2, integraciones fichas §14.1 |
| “¿Y si el proveedor cierra?” | Exportación completa del tenant. | Cláusula contractual + prueba de export en piloto. | T01, T10; comparativo §11 |
| “Es caro cambiar todo” | Cambio **por olas**; convivencia. | ROI: menos servidores, soporte, doble carga sync. | §8.1 |
| “La API prometida” | Exportaciones ya; API **O11**. | Decidir adelanto read-only. | §6.3 nota; dolores §2.3 |
| “Nuestros perfiles son distintos” | **40 roles** plantilla ajustables. | Taller 1 día por área. | T02; roles-y-modulos |

---

## 6. Qué llevar impreso al lado del marketing

| Material | Para quién |
|---|---|
| [`comparativo-funcional-procoop-vs-coopapps.md`](./comparativo-funcional-procoop-vs-coopapps.md) | Técnico / respaldo en Q&A profunda |
| [`dolores-procoop-antes-y-despues.md`](./dolores-procoop-antes-y-despues.md) | Imágenes antes/después |
| [`alcance-especificacion-modulo-por-modulo.md`](./alcance-especificacion-modulo-por-modulo.md) | Gerencia por área |
| Este documento | Marketing y guion |

---

## 7. Actualización cruzada

| Documento | Relación |
|---|---|
| Comparativo v1.1 | Fuente de verdad funcional |
| **Este archivo** | Capa comunicación + **guion unificado §0.5** + cruces §0.6 |
| `documento-base-presentacion.md` | IMG-01…25; ver nota en §1.1 sobre IMG-08 y bloque IMG-C |
| `dolores-procoop-antes-y-despues.md` | IMG-D01…14; encaje en §0.5 filas 6–7 y 21 |
| `lo-esencial-para-imagenes.md` | IMG-E01…12; usar con moderación (tabla §0.6) |
| `alcance-especificacion-modulo-por-modulo.md` | IMG-A01…08 tras bloque comparativo (§0.5 filas 12–15) |

Si el comparativo cambia de versión, actualizar **IMG-C**, la matriz §3 y la tabla **§0.6**.

---

## 8. Una frase para marketing (pie de campaña)

> **“Mismo negocio que ProCoop. Un solo dato para oficina, campo y socio. Su marca en el celular. Cambio por etapas, no de un día para otro.”**

*(Condiciones: no usar “API completa desde el día 1”; no decir “mismas pantallas”.)*