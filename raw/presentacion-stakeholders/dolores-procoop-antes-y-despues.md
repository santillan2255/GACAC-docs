# CoopApps — Los dolores de ProCoop y cómo los resolvemos

Documento complementario del `documento-base-presentacion.md`. Reúne los dolores del sistema actual que se definieron en el primer relevamiento, muestra cómo los resuelve la especificación y trae los prompts para generar un conjunto de imágenes de "antes y después".

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | Prompts originales del primer relevamiento (P-001 a P-020, anexo final de `docs/base-funcional/PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md`), su formalización en la base funcional §64 "Posicionamiento competitivo y solución SaaS en la nube", el relevamiento del código de ProCoop (`procoop-relevamiento/`) y los anexos de `docs/especificacion/` |
| Regla de uso | Todos los datos salen de las fuentes. Ninguna imagen debe agregar números, nombres de cooperativas reales ni datos de socios |

---

## 0. Cómo usar este documento

1. Subir este archivo a ChatGPT o a Claude. Puede subirse solo o junto con el documento base.
2. Pegar el prompt maestro de la sección 0.1.
3. Pedir las imágenes de a una por su código: "Generá IMG-D01", "Generá IMG-D02", etc. (sección 5).
4. Verificar cada texto y cada referencia contra este documento antes de usar la imagen.

Mismo criterio que el documento base: los cuadros y comparaciones con texto se piden con código (Python con matplotlib en ChatGPT, HTML con SVG en Claude) y se exportan en PNG de 1920×1080. Las ilustraciones conceptuales van con el generador de imágenes y con muy poco texto; si el texto sale mal, generar la ilustración sin texto y poner los títulos en PowerPoint.

### 0.1 Prompt maestro (pegar primero)

```text
Vas a ayudarme a preparar un conjunto de imágenes de "antes y después" para una presentación ejecutiva de mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina. El mensaje es: "en el primer relevamiento nos dijeron cuáles eran los dolores del sistema actual (ProCoop); cada uno está resuelto en la especificación del sistema nuevo, con requisitos concretos y una ola de construcción asignada".

Te adjunto el documento. Reglas obligatorias:
1. Usá SOLO los datos del documento. No inventes funciones, números ni nombres. Si algo no está, avisame.
2. Texto visible en español de Argentina, formal y claro, sin tecnicismos innecesarios. Usá los textos exactos que indique cada pedido.
3. Formato 16:9, 1920×1080 px, fondo claro.
4. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento (lo nuevo, lo resuelto). El "antes" va siempre en grises apagados, nunca en rojo chillón: es un competidor respetable. Solo para estados: ámbar #B7791F (a decidir o propuesta de adelantar) y rojo #B91C1C (únicamente para un defecto de seguridad comprobado). La única excepción de color es la imagen IMG-D08, que indica sus propios colores de marca.
5. Tipografía sans serif limpia (tipo Inter o Source Sans). Títulos grandes, poco texto, mucho aire.
6. Estilo sobrio, tipo consultora. Nada de caricaturas, robots, cerebros, efectos futuristas ni personas exageradas. Íconos de línea simples.
7. El "antes" siempre a la izquierda y el "después" a la derecha, con los rótulos "Hoy" y "Con CoopApps".
8. Los estados nunca se distinguen solo por color: acompañalos con texto o ícono.
9. Nunca uses nombres de cooperativas reales, nombres de personas, DNI, CUIT ni direcciones reales. Usá "Cooperativa A", "Cooperativa B", "Cooperativa C" y datos visiblemente ficticios.
10. Si la imagen tiene cuadros o mucho texto, hacela con código y mostrame el resultado. Si es una ilustración, usá el generador de imágenes con texto mínimo.
11. Después de cada imagen, listá los textos y referencias que usaste y en qué sección del documento están.
Voy a pedirte las imágenes por código (IMG-D01, IMG-D02, ...). Esperá mi pedido.
```

---

## 1. Qué se dijo en el primer relevamiento

### 1.1 El diagnóstico original (prompt P-012)

En el primer relevamiento, el solicitante describió así a ProCoop y sus debilidades (versión redactada del prompt P-012, que pedía expresamente "escriba bien eso"):

> "ProCoop es un sistema muy completo, algo antiguo y obsoleto, con algunas fallas, que usa buena parte de las cooperativas de la Argentina. Es un competidor respetable, con debilidades: se instala en una máquina y no está en la nube; obliga a las cooperativas a tener sus propios servidores; no tiene API; no tiene una aplicación para los socios, o la que tiene es muy pobre; la aplicación no tiene la identidad de la cooperativa; tiene fallas de seguridad, y presenta mucha ineficiencia a la hora del soporte. Nuestro objetivo es tener todo eso resuelto en nuestro sistema."

De ahí salen los **siete dolores principales**:

| N.º | Dolor | Qué se pidió a cambio |
|---|---|---|
| D1 | Se instala en una máquina; no está en la nube | Sistema multitenant en la nube |
| D2 | Obliga a la cooperativa a tener servidores propios | Servicio SaaS: la cooperativa no opera servidores |
| D3 | No tiene API | APIs tokenizadas para que la cooperativa use sus datos |
| D4 | No hay aplicación para los socios, o es muy pobre | Autogestión del socio en todo el ciclo del servicio |
| D5 | La aplicación no tiene la identidad de la cooperativa | Marca, colores, logos y landing propios de cada cooperativa |
| D6 | Fallas de seguridad | Estándares actuales de seguridad, verificables |
| D7 | Mucha ineficiencia en el soporte | Soporte con casos, responsables, estado y seguimiento |

### 1.2 Otros dolores y pedidos del mismo relevamiento

Los demás prompts del primer relevamiento no hablan de "debilidades", pero cada uno describe algo que hoy la cooperativa no puede hacer bien:

| N.º | Dolor o pedido | Prompt |
|---|---|---|
| D8 | Los datos de los socios son de la cooperativa y hoy no puede usarlos libremente para sus tableros o su BI ("sus asociados y su info son de ellos") | P-011 |
| D9 | Cada cooperativa habla distinto (socio, asociado, usuario; suministro, conexión) y el sistema impone un único vocabulario | P-013 |
| D10 | Habilitar o apagar servicios por cooperativa (agua, luz, gas, cementerio parque) y copiar la configuración de un servicio de una cooperativa a otra | P-014, P-018 |
| D11 | Cuenta separada por servicio o unificada, con suspensión de servicios por mora configurable | P-007, P-014 |
| D12 | Facturación masiva que deje claramente marcados los casos con problemas (por ejemplo, pide factura A pero no tiene CUIT) | P-014 |
| D13 | La instalación de un servicio como recorrido completo: turno, aviso al socio de que el técnico va en camino, firma, descuento del módem del stock, encuesta de satisfacción y alta con cobro prorrateado | P-015 |
| D14 | Dos titulares con el mismo servicio en el mismo domicilio (dos hermanos con dos conexiones de internet en la misma casa) | P-019 |
| D15 | Doble factor, ingreso con Google y recuperación segura de la contraseña | P-011 |
| D16 | Relación con organismos del Estado como agente de retención | P-011 |
| D17 | Tablero y auditoría de cada cambio en el sistema | P-010 |

### 1.3 Lo que confirmó el relevamiento del código

El relevamiento no se basó solo en lo que se contó: se leyó ProCoop por dentro. Eso confirmó y agregó evidencia concreta a varios dolores:

| Dolor | Lo que se encontró en ProCoop |
|---|---|
| D1 y D2 | Aplicación de escritorio con una base de datos por cooperativa administrada localmente; actualizaciones manuales por computadora |
| D3 y D8 | Hay tablas de claves y usuarios de servicios web (`WS_KEYS`, `WS_USERS`), ligadas al portal, y tablas preparadas para Power BI (`TABLAS_POWERBI`). No se relevó una API documentada, con permisos por recurso y credenciales que la cooperativa administre |
| D4 | El portal web y la app móvil trabajan sobre una copia sincronizada de los datos, no sobre la información real |
| D6 | Contraseñas que pueden descifrarse, usuario de base de datos compartido y credenciales escritas dentro del programa |
| D7 | El soporte se presta por chat web y control remoto con TeamViewer (hay una función del sistema que lo inicia); no hay número de caso ni historial de la intervención dentro del sistema |
| Configuración | 1.536 parámetros identificados solo por número; cambiar una tarifa o un redondeo depende de saber qué significa cada número |

### 1.4 Cómo decirlo sin exagerar

La base funcional (§64.1 y §64.3) aclara que este diagnóstico es experiencia transmitida, no una auditoría de ProCoop. Para que nadie pueda desmentir la presentación:

- ProCoop **sí tiene** canales para socios (CoopOnline y P-Móvil). El mensaje no es "no tiene app" sino "la app es limitada, trabaja sobre una copia y no lleva la identidad de cada cooperativa".
- Sobre la API, ProCoop tiene claves de servicios web para su portal y tablas para Power BI. El mensaje es "la cooperativa no tiene una API documentada, con permisos por recurso, que ella misma administre", no "ProCoop no tiene ninguna API".
- Sobre la seguridad, mostrar solo lo comprobado en el código (contraseñas descifrables, usuario compartido, credenciales en el programa), sin hablar de incidentes.
- ProCoop es un competidor respetable con mucha profundidad funcional. La propuesta es "todo lo que hace ProCoop, sin sus debilidades" (DEC-007).

---

## 2. Cómo se resuelve cada dolor

### 2.1 Los siete dolores principales

| Dolor | Hoy (ProCoop) | Con CoopApps | Dónde está especificado | Ola |
|---|---|---|---|---|
| D1. No está en la nube | Programa instalado en cada computadora, con actualizaciones manuales y versiones desparejas | Plataforma en la nube, multitenant, desde el navegador y el celular; una sola versión para todos | DEC-002 (base única con `tenantId`), DEC-004 (nube con Docker), RF-PLA-018 (todo índice empieza por cooperativa) | O0 y O1 |
| D2. Servidores propios | La cooperativa compra, mantiene y respalda su servidor | La cooperativa no opera servidores. La plataforma hace copias diarias por cooperativa, monitorea y muestra un tablero de salud | SaaS-001 a SaaS-003 (base funcional §64.4), RF-PLA-119 (copia lógica diaria por cooperativa, cifrada), RNF-NFR-136 (tablero de salud de la cooperativa) | O1 |
| D3. No tiene API | Claves de servicios web ligadas al portal y tablas para Power BI; sin API documentada, con permisos por recurso, que administre la cooperativa | API externa versionada (`/api/v1/ext`), con credenciales por cooperativa que se muestran una sola vez, se guardan con hash, vencen y se revocan; documentación OpenAPI con solo lo que la cooperativa tiene contratado | RF-BIA-072, RF-BIA-076, RF-BIA-077 | **O11** (ver 2.3) |
| D4. App del socio pobre | Portal y app sobre una copia sincronizada, con funciones limitadas | Portal y app nativos sobre la misma información: contratar, sacar turno, ver al técnico en camino, consultar consumos y facturas, pagar, reclamar y dar de baja. Permisos por acción (consultar, pagar, gestionar, dar de baja, firmar) y pago por un tercero sin ver la cuenta | M19 (RF-POR-001, RF-POR-002, RF-POR-042, RF-POR-045), RF-TEC-081 (estado de la visita visible al socio), RF-CRM-105 (avisos de cada cambio del reclamo) | O2 a O5 |
| D5. Sin identidad de la cooperativa | La misma app para todas las cooperativas | Landing propia por cooperativa con subdominio o dominio propio; app instalable con nombre, ícono, pantalla de inicio y colores de la cooperativa; vista previa en celular antes de publicar | RF-POR-001, RF-POR-002, RF-POR-003 (publicación versionada), RF-POR-145 (app instalable con marca por cooperativa), RF-UXD-051 (vista previa) | O1 y O2 |
| D6. Fallas de seguridad | Contraseñas descifrables, usuario de base compartido, credenciales en el programa | Contraseñas no reversibles; doble factor por correo, SMS o aplicación autenticadora, con passkeys como opción; ingreso con Google sin fusionar cuentas por correo; aislamiento verificado entre cooperativas; auditoría inmutable encadenada con hash | RF-IAM-022, RF-IAM-025, RF-IAM-006, RF-IAM-133, RF-PLA-018 y los controles de aislamiento del documento base (§6) | O0 y O1 |
| D7. Soporte ineficiente | Chat y control remoto con TeamViewer, sin caso ni historial | Caso de soporte con número (SUP-…), responsable, prioridad, estado y conversación; separado de los reclamos de los socios; acceso de soporte temporal, con alcance mínimo, justificación y registro de todo lo que se hizo | RF-PLA-100, RF-PLA-101, base funcional §64.5 y CU-SaaS-01, RNF-NFR-136 | O1 |

### 2.2 Los otros dolores del primer relevamiento

| Dolor | Con CoopApps | Dónde está especificado | Ola |
|---|---|---|---|
| D8. Los datos son de la cooperativa | API externa (D3), reportes exportables y exportación completa de la cooperativa en formatos abiertos si decide irse | RF-BIA-076, RF-PLA-051 (exportación completa al cierre), RF-PLA-119 | O1 y O11 |
| D9. El vocabulario de cada cooperativa | Diccionario de términos por cooperativa: pantallas, menús, reportes y notificaciones usan sus palabras; los nombres técnicos de exportaciones y API no cambian | RF-UXD-140, RF-BIA-013 | O0 y O1 |
| D10. Servicios que se prenden y apagan, y copia de configuración | Activación de módulos y servicios por cooperativa; apagar un módulo no borra la historia, la deja en solo lectura; copia de la configuración de un servicio de una cooperativa a otra, eligiendo qué componentes copiar | RF-PLA-069, RF-CAT-105 | O1 y O2 |
| D11. Cuenta separada o unificada | Cuenta separada por servicio o unificada, a elección de la cooperativa; la mora se evalúa igual por servicio y por documento | RF-MOR-066 (la suspensión cruzada entre servicios está como pregunta abierta en M08) | O6 |
| D12. Facturación masiva con problemas marcados | Verificación de requisitos fiscales antes de facturar; el tipo de comprobante lo determinan las reglas, no el usuario | RF-FAC-017, RF-FAC-032 | O4 |
| D13. Instalación como recorrido completo | Estado de la visita visible al socio (confirmada, asignada, en camino, en sitio, realizada); conformidad en el lugar y encuesta de satisfacción posterior por el canal del socio | RF-TEC-081, RF-TEC-095, RF-TEC-123 | O3 |
| D14. Dos titulares en el mismo domicilio | Cada contrato tiene su titular (DNI o CUIT) y su cuenta; un domicilio puede tener varios contratos del mismo servicio con titulares distintos, con privacidad entre ellos | RF-CAT-067, RF-PER-094 | O2 |
| D15. Doble factor, Google y recuperación | Igual que D6 | RF-IAM-022, RF-IAM-025 | O1 |
| D16. Organismos del Estado | Regímenes de percepción y retención configurables y exportación SICORE | RF-FIS-093, RF-FIS-094 | O4 y O8 |
| D17. Tablero y auditoría | Tablero de salud por cooperativa y auditoría inmutable de cada cambio | RNF-NFR-136, RF-IAM-133 | O0 y O1 |

### 2.3 Un punto para plantear con honestidad: la API llega en la última ola

D3 ("no tiene API") fue uno de los siete dolores explícitos, pero la API externa para terceros está planificada en la **ola O11**, la última. Antes de esa ola, la cooperativa ya puede exportar reportes y la exportación completa de sus datos (O1).

Propuesta para la reunión: **adelantar una API de solo lectura** (socios, contratos, facturas, cobranzas y consumos) a la ola en que esos datos ya existen, y dejar para O11 las operaciones de escritura y el portal completo de documentación. Es una decisión de prioridad para tomar con ellos; en las imágenes se marca en ámbar como "Proponemos adelantar".

---

## 3. Dónde encaja en la presentación

| Opción | Uso |
|---|---|
| Recomendada | Reemplazar la diapositiva 8 del documento base ("Hoy y mañana") por IMG-D02 e IMG-D03, y agregar IMG-D04 a IMG-D10 como bloque "Cómo cambiamos el sistema de hoy" inmediatamente después. Cerrar el bloque con IMG-D14 |
| Corta (si hay poco tiempo) | Solo IMG-D02, IMG-D03 e IMG-D14. Las demás quedan como anexo para responder preguntas |
| Para el material que se deja después de la reunión | El conjunto completo, IMG-D01 a IMG-D14 |
| **Guion único con comparativo funcional** | Seguir el orden de `comparativo-funcional-procoop-vs-coopapps-para-presentacion.md` **§0.5** (IMG-D después de IMG-C02; **IMG-C03** con 119/120 después del bloque dolores; **IMG-C12** antes de IMG-25). Cruces IMG-D ↔ IMG-C ↔ IMG en **§0.6** del mismo archivo. |

La frase para abrir el bloque: **"En el primer relevamiento nos dijeron qué les dolía del sistema de hoy. Esto es lo que cambia."**

La frase antes del comparativo de menú (**IMG-C03**): **"¿Perdemos algo de lo que hoy tienen en el menú? Lo relevamos ítem por ítem."**

---

## 4. Lista de imágenes

| Código | Título | Tipo |
|---|---|---|
| IMG-D01 | Cómo cambiamos el sistema de hoy | Ilustración (portada del bloque) |
| IMG-D02 | Lo que nos dijeron | Tarjetas con código |
| IMG-D03 | Siete dolores, siete respuestas | Cuadro con código |
| IMG-D04 | De la computadora a la nube | Ilustración antes y después |
| IMG-D05 | Sin servidores propios | Diagrama antes y después |
| IMG-D06 | Los datos son de la cooperativa | Diagrama con código |
| IMG-D07 | El socio hace todo desde el celular | Maquetas de celular |
| IMG-D08 | Una plataforma, la marca de cada cooperativa | Maquetas de celular |
| IMG-D09 | Seguridad que se puede verificar | Comparación con código |
| IMG-D10 | Soporte con nombre, número y responsable | Flujo antes y después |
| IMG-D11 | Cada cooperativa habla su idioma | Maqueta de pantalla |
| IMG-D12 | Configuración que se entiende | Maqueta antes y después |
| IMG-D13 | Una instalación de punta a punta | Línea de pasos |
| IMG-D14 | Cada dolor, trazado hasta su solución | Cuadro de cierre con código |

---

## 5. Prompts de imágenes

### IMG-D01 — Cómo cambiamos el sistema de hoy

```text
Generá IMG-D01, una ilustración (generador de imágenes) que sirva de portada del bloque.
Composición dividida en dos mitades. Izquierda, en tonos grises apagados: un escritorio de oficina de cooperativa con una computadora de escritorio antigua tipo torre, un servidor pequeño en un rincón con cables, carpetas de papel y un teléfono fijo. Derecha, luminosa, con acento verde #2E7D32: la misma oficina despejada, una notebook liviana, un celular que muestra una app con un logo genérico de cooperativa, y una nube simple dibujada con línea fina que conecta ambos. Sin personas o, como mucho, una silueta de espaldas, sobria.
Texto (agregar solo si sale legible): título arriba "Cómo cambiamos el sistema de hoy"; rótulos chicos "Hoy" a la izquierda y "Con CoopApps" a la derecha.
Estilo: ilustración plana, sobria, de consultora, sin efectos futuristas.
```

### IMG-D02 — Lo que nos dijeron

```text
Generá IMG-D02 con código (Python con matplotlib o HTML con SVG).
Título: "Lo que nos dijeron en el primer relevamiento".
Debajo, en gris medio y en cursiva, la cita: "Es un competidor respetable, con debilidades. Nuestro objetivo es tener todo eso resuelto en nuestro sistema."
Siete tarjetas iguales en gris claro #E5E7EB (fila de 4 y fila de 3), cada una con un ícono de línea y un texto corto:
1. Ícono computadora: "Se instala en una máquina; no está en la nube"
2. Ícono servidor: "Obliga a tener servidores propios"
3. Ícono enchufe o conector: "No tiene API para usar los datos"
4. Ícono celular: "App del socio inexistente o muy pobre"
5. Ícono paleta o insignia: "La app no tiene la identidad de la cooperativa"
6. Ícono candado abierto: "Fallas de seguridad"
7. Ícono auriculares: "Soporte ineficiente"
Sin colores de estado: es el diagnóstico, todo en grises.
Pie de página chico: "Fuente: primer relevamiento, prompt P-012; base funcional §64.3".
```

### IMG-D03 — Siete dolores, siete respuestas

```text
Generá IMG-D03 con código. Es un cuadro de dos columnas con siete filas, usando la tabla de la sección 2.1.
Título: "Siete dolores, siete respuestas".
Columna izquierda "Hoy" (texto gris medio sobre gris claro) y columna derecha "Con CoopApps" (texto gris carbón, con una marca de verificación verde #2E7D32 al inicio). Entre ambas, una flecha fina.
Filas:
1. "Instalado en cada computadora" → "En la nube, desde el navegador y el celular"
2. "Servidores propios de la cooperativa" → "Sin servidores: copias diarias y tablero de salud"
3. "Sin API documentada para la cooperativa" → "API con credenciales propias de cada cooperativa"
4. "App del socio limitada" → "Todo el ciclo del servicio desde el celular"
5. "La misma app para todas" → "Landing y app con la marca de cada cooperativa"
6. "Contraseñas descifrables y usuario compartido" → "Doble factor, Google y auditoría inmutable"
7. "Soporte por control remoto, sin caso" → "Caso con número, responsable y acceso auditado"
A la derecha de cada fila, una etiqueta chica con la ola: O0–O1, O1, O11, O2–O5, O1–O2, O0–O1, O1. La etiqueta de la fila 3 va en ámbar #B7791F con el texto "O11 · Proponemos adelantar"; las demás en verde.
Pie de página: "Detalle y referencias a requisitos: sección 2.1".
```

### IMG-D04 — De la computadora a la nube

```text
Generá IMG-D04, una ilustración (generador de imágenes) de antes y después.
Izquierda "Hoy", en grises: tres computadoras de escritorio en una oficina, cada una con un pequeño cartel de versión distinto (escribir solo "v1", "v2" y "v3"), un CD o un pendrive de instalación y un técnico de espaldas instalando una actualización.
Derecha "Con CoopApps", con acento verde: una nube simple de línea fina; debajo, una notebook, una tablet y un celular mostrando la misma pantalla, con un cartel único "Siempre la misma versión".
Título: "De la computadora a la nube".
Subtítulo chico: "Se usa desde el navegador y el celular. Una sola versión, siempre actualizada."
```

### IMG-D05 — Sin servidores propios

```text
Generá IMG-D05, un diagrama de antes y después (código o generador, lo que salga más limpio).
Izquierda "Hoy": una cooperativa (ícono de edificio) con un servidor propio al lado. Alrededor del servidor, cuatro tareas en gris como etiquetas: "Comprar y renovar el equipo", "Hacer las copias", "Recuperar si falla", "Actualizar el sistema". Todo a cargo de la cooperativa.
Derecha "Con CoopApps": la misma cooperativa, sin servidor, conectada a la plataforma (nube). Las mismas cuatro tareas ahora del lado de la plataforma, en verde, reescritas como: "Infraestructura administrada", "Copia diaria cifrada de cada cooperativa", "Restauración probada", "Actualizaciones sin instalar nada". Del lado de la cooperativa queda solo una etiqueta: "Tablero de salud de su cooperativa".
Título: "La cooperativa ya no necesita servidores".
Pie chico: "SaaS-001 a SaaS-003 · RF-PLA-119 · RNF-NFR-136".
```

### IMG-D06 — Los datos son de la cooperativa

```text
Generá IMG-D06 con código (diagrama).
Título: "Los datos son de la cooperativa".
Subtítulo, como cita: "Sus asociados y su información son de ellos."
Izquierda "Hoy": los datos dentro de un sistema cerrado (caja gris). Salen por "Pantallas y reportes", "Archivos de intercambio", "Tablas para Power BI" y "Claves de servicios web del portal", con la nota "Sin API documentada que administre la cooperativa".
Derecha "Con CoopApps": la plataforma al centro. Tres salidas en verde:
1. "API de la cooperativa" con un ícono de llave y la nota "Credenciales propias, que vencen y se revocan".
2. "Reportes exportables".
3. "Exportación completa en formatos abiertos".
A la derecha, los destinos: "Tablero de la cooperativa", "Herramienta de BI", "Sistemas propios o de terceros".
En la salida "API de la cooperativa", una etiqueta ámbar #B7791F: "Hoy prevista en O11 · Proponemos adelantar la consulta de datos".
Pie chico: "RF-BIA-072, RF-BIA-076, RF-BIA-077, RF-PLA-051".
```

### IMG-D07 — El socio hace todo desde el celular

```text
Generá IMG-D07 en HTML con SVG o con un generador que respete el texto. Muestra el ciclo del socio en un celular.
Título: "El socio hace todo desde el celular".
Seis maquetas de celular en fila, unidas por una flecha, cada una con una pantalla simple y un título debajo:
1. "Contrata el servicio" (pantalla con la tarjeta "Internet 100 Mb" y el botón "Contratar")
2. "Elige el turno" (calendario con un día marcado)
3. "Ve al técnico en camino" (estado "En camino" resaltado en una lista: Confirmada, Asignada, En camino, En sitio, Realizada)
4. "Consulta consumo y factura" (gráfico de barras chico y una factura)
5. "Paga" (botón "Pagar")
6. "Reclama o da de baja" (botones "Nuevo reclamo" y "Dar de baja")
Las pantallas usan un logo genérico "Cooperativa A" y el verde #2E7D32 como color de marca.
Arriba a la izquierda, en un recuadro gris chico, el "Hoy": "Portal y app sobre una copia sincronizada, con funciones limitadas".
Pie chico: "M19 · RF-POR-002 · RF-TEC-081 · RF-CRM-105".
Datos visiblemente ficticios; ningún nombre ni importe real.
```

### IMG-D08 — Una plataforma, la marca de cada cooperativa

```text
Generá IMG-D08 en HTML con SVG o con generador de imágenes. Excepción de paleta solo en esta imagen: cada celular usa el color de su cooperativa.
Título: "Una plataforma, la marca de cada cooperativa".
Izquierda, chico y en gris, el "Hoy": un celular con una app genérica, la misma para todas, con el texto "La misma app para todas las cooperativas".
Derecha, tres celulares iguales en estructura pero con marca distinta:
- "Cooperativa A", color azul #1E5AA8, logo de una gota.
- "Cooperativa B", color verde #2E7D32, logo de un rayo.
- "Cooperativa C", color bordó #8E2C48, logo de una casa.
Cada uno con su nombre, su ícono en la pantalla de inicio, su pantalla de bienvenida y su dirección web (escribir "cooperativa-a.ejemplo", "cooperativa-b.ejemplo", "cooperativa-c.ejemplo").
Debajo, tres etiquetas: "Landing propia", "App instalable con su ícono y sus colores", "Vista previa antes de publicar".
Pie chico: "RF-POR-001 · RF-POR-145 · RF-UXD-051".
```

### IMG-D09 — Seguridad que se puede verificar

```text
Generá IMG-D09 con código. Comparación en dos columnas.
Título: "Seguridad que se puede verificar".
Columna "Hoy (comprobado en el código)", con ícono de candado abierto. Tres renglones, con un marcador rojo #B91C1C y la palabra "Defecto":
1. "Contraseñas que pueden descifrarse"
2. "Un mismo usuario de base de datos para todos"
3. "Credenciales escritas dentro del programa"
Columna "Con CoopApps", con ícono de escudo. Seis renglones con marca de verificación verde:
1. "Contraseñas no reversibles"
2. "Doble factor: correo, SMS o aplicación; passkeys como opción"
3. "Ingreso con Google, sin unir cuentas por el correo"
4. "Cada cooperativa aislada, con controles automáticos"
5. "Credenciales fiscales y bancarias en bóveda cifrada"
6. "Auditoría que no se puede borrar ni modificar"
Pie chico: "RF-IAM-022 · RF-IAM-025 · RF-IAM-006 · RF-IAM-133 · RF-PLA-018".
No mencionar incidentes ni ataques.
```

### IMG-D10 — Soporte con nombre, número y responsable

```text
Generá IMG-D10 con código. Dos flujos horizontales, uno arriba del otro.
Título: "Soporte con nombre, número y responsable".
Flujo de arriba "Hoy", en grises: "La cooperativa llama o escribe" → "El técnico toma control remoto de la PC" → "Se resuelve o no" → "No queda registro en el sistema". El último paso con un ícono de signo de pregunta.
Flujo de abajo "Con CoopApps", en verde: "La cooperativa abre un caso (SUP-0001)" → "Responsable, prioridad y estado" → "Acceso temporal, con alcance mínimo y justificado" → "Todo lo hecho queda auditado" → "Solución comunicada y caso cerrado".
Nota a la derecha, en gris: "Separado de los reclamos de los socios".
Pie chico: "RF-PLA-100 · RF-PLA-101 · Base funcional §64.5".
```

### IMG-D11 — Cada cooperativa habla su idioma

```text
Generá IMG-D11 en HTML con SVG. Maqueta de la misma pantalla para dos cooperativas, lado a lado.
Título: "Cada cooperativa habla su idioma".
Pantalla izquierda, "Cooperativa A": menú con "Socios", "Suministros", "Reclamos".
Pantalla derecha, "Cooperativa B": la misma pantalla con "Asociados", "Conexiones", "Pedidos".
Entre las dos, una etiqueta: "Misma pantalla, mismo sistema, otras palabras".
Debajo, una línea chica: "Los nombres técnicos de exportaciones y API no cambian".
Pie chico: "Diccionario de términos por cooperativa · RF-UXD-140 · RF-BIA-013".
```

### IMG-D12 — Configuración que se entiende

```text
Generá IMG-D12 en HTML con SVG. Antes y después de una pantalla de configuración.
Título: "Configuración que se entiende".
Izquierda "Hoy": una grilla gris con columnas "Parámetro" y "Valor" y filas "3054 | 1", "3069 | 0", "3056 | 2", "739 | 1". Debajo: "1.536 parámetros identificados solo por número".
Derecha "Con CoopApps": una tarjeta con los campos "Nombre", "Descripción", "Tipo de dato", "Vigente desde", "Modificado por" y "Historial de cambios", con valores ficticios genéricos (por ejemplo "Redondeo en cobranza", "Vigente desde 01/01/2027"). Marca de verificación verde.
Subtítulo: "Cambiar una tarifa o un redondeo deja de depender de pocas personas".
```

### IMG-D13 — Una instalación de punta a punta

```text
Generá IMG-D13 con código. Línea de pasos horizontal, numerada.
Título: "Una instalación de punta a punta".
Subtítulo: "Ejemplo: alta de internet".
Pasos:
1. "El socio contrata desde la app"
2. "Elige el turno"
3. "Ve que el técnico está en camino"
4. "El técnico instala y el socio da conformidad"
5. "El módem sale del stock del técnico"
6. "El servicio se activa y se factura desde ese día"
7. "El socio responde la encuesta de satisfacción"
Cada paso con un ícono de línea. Todos en verde salvo la línea de unión, en gris.
Pie chico: "RF-TEC-081 · RF-TEC-095 · RF-TEC-123 · Ola O3".
```

### IMG-D14 — Cada dolor, trazado hasta su solución

```text
Generá IMG-D14 con código. Cuadro de cierre del bloque.
Título: "Cada dolor, trazado hasta su solución".
Cuadro de cuatro columnas: "Dolor" | "Requisitos" | "Ola" | "Estado".
Filas (usá la tabla de la sección 2.1):
- "No está en la nube" | "DEC-002, DEC-004, RF-PLA-018" | "O0–O1" | "Especificado"
- "Servidores propios" | "SaaS-001 a 003, RF-PLA-119, RNF-NFR-136" | "O1" | "Especificado"
- "Sin API" | "RF-BIA-072, 076, 077" | "O11" | "Proponemos adelantar"
- "App del socio pobre" | "M19, RF-TEC-081, RF-CRM-105" | "O2–O5" | "Especificado"
- "Sin identidad propia" | "RF-POR-001, 145, RF-UXD-051" | "O1–O2" | "Especificado"
- "Fallas de seguridad" | "RF-IAM-022, 025, 133" | "O0–O1" | "Especificado"
- "Soporte ineficiente" | "RF-PLA-100, 101" | "O1" | "Especificado"
"Especificado" con marca verde; "Proponemos adelantar" en ámbar #B7791F con ícono de reloj.
Frase final grande, abajo: "Lo que nos pidieron en el primer relevamiento ya está especificado, con requisito, ola y prueba."
```

---

## 6. Notas para el presentador

- **Abrir con la cita.** Leer la cita de IMG-D02 muestra que el punto de partida fueron sus palabras, no las nuestras.
- **No pegarle a ProCoop.** Siempre "competidor respetable". Si alguien defiende CoopOnline o P-Móvil, la respuesta es: "Existen, y por eso comparamos profundidad y marca propia, no existencia" (sección 1.4).
- **Seguridad: solo lo comprobado.** Si preguntan cómo se sabe, la respuesta es "lo leímos en el código", no "nos contaron".
- **La API, de frente.** Plantear vos mismo que está en O11 y proponer adelantarla. Demuestra que el plan se revisa contra lo que pidieron, no que se esconde lo que falta.
- **Cerrar con IMG-D14.** Siete dolores, siete respuestas, cada una con requisito y ola: es la prueba de que se escuchó.
