# CoopApps — La landing de cada cooperativa, el stack y el modelo de datos

Dieciséis imágenes en cuatro bloques: cómo cada cooperativa tiene su propia landing, qué tecnología se propone, cómo se organizan el backend y el frontend, y cómo es el modelo de datos. Todo sale de la especificación; ninguna imagen promete algo que no esté escrito.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | M19 (landing, portal y app del socio: §1, §5.1, §9.1, §10.2, §18.1), T03 (marca por cooperativa: §7.B), T01 (stack, monorepo, módulos, outbox, colas, multitenancy y ambientes: §7.1 a §7.10), T05 (modelo de datos: §6, §7.0, §7.1, §7.8, §7.9 y §7.10), `00` §5, DEC-110 a DEC-113, DEC-064, DEC-075, DEC-100 y DEC-117 |
| Datos | Todos los nombres, colores y dominios de ejemplo son ficticios ("Cooperativa Ejemplo A", `coop-ejemplo-a`) |

---

## 0. Cómo usar este documento

1. Si la conversación es nueva, pegar primero el prompt de la sección 0.1.
2. Pedir las imágenes por código: "Generá IMG-T01", "Generá IMG-T02", etc.
3. Cada imagen trae una **frase para decir** en voz alta mientras se muestra.
4. Los bloques se pueden usar por separado: la landing (T01 a T04) sirve para una reunión comercial; el stack, el backend y el frontend (T05 a T10) para una reunión técnica; el modelo de datos (T11 a T16) para las dos.

### 0.1 Prompt de estilo (pegar primero)

```text
Vas a dibujar dieciséis diapositivas para una reunión con directivos, stakeholders y responsables técnicos de una empresa de software para cooperativas de servicios públicos de Argentina. Muestran cómo cada cooperativa tiene su propia landing, la tecnología propuesta, la organización del backend y del frontend y el modelo de datos.

El tono es seguro y sereno: el de alguien que ya diseñó el sistema y lo explica con claridad. Nada de adjetivos vacíos ("revolucionario", "increíble", "de última generación"), nada de signos de exclamación, nada de lenguaje publicitario.

Reglas obligatorias:
1. Usá SOLO los textos y números del documento. No inventes cifras, tecnologías, versiones ni promesas. Podés acortar sin cambiar el sentido.
2. Texto visible en español de Argentina. Los nombres de tecnologías vigentes (.NET, Azure SQL, React, Azure, etc.) van tal cual (DEC-111–112).
3. Generá cada imagen con código (HTML con SVG en Claude; Python con matplotlib en ChatGPT), 1920×1080 px. No uses el generador de imágenes para nada que tenga texto.
4. Paleta: gris carbón #2F343A, gris medio #6B7280, gris claro #E5E7EB, blanco #FFFFFF y verde cooperativo #2E7D32 como único acento. Ámbar #B7791F solo donde el documento lo indique. Sin rojo. Excepción: las imágenes de la landing usan los colores de marca de las cooperativas ficticias que indica cada prompt.
5. Diagramas limpios: cajas con esquinas apenas redondeadas, líneas finas, flechas simples, mucho espacio en blanco. Título grande (56 a 72 px), texto mínimo de 20 px. Como máximo un diagrama principal por imagen.
6. Tipografía sans serif limpia (Inter o similar); los nombres técnicos, si aparecen, en monoespaciada pequeña y gris.
7. Íconos de línea simples. Nada de robots, cerebros, cohetes, nubes brillantes, circuitos ni efectos futuristas.
8. En el modelo de datos, NO muestres nombres de campos ni tipos: cada entidad se muestra con su nombre en español y una frase corta que dice qué guarda.
9. Después de cada imagen, listá qué datos del documento usaste.
Esperá mi pedido por código (IMG-T01 a IMG-T16).
```

---

## 1. Las dieciséis imágenes

| Código | Título de la imagen | Idea que deja |
|---|---|---|
| **Bloque A — La landing de cada cooperativa** | | |
| IMG-T01 | Una plataforma. Una landing por cooperativa. | Cada cooperativa tiene su sitio, con su dirección y su marca |
| IMG-T02 | Qué tiene la landing. | Todo lo que el vecino necesita, sin iniciar sesión |
| IMG-T03 | De la landing a la app, sin cambiar de cooperativa. | El recorrido del visitante al socio que se autogestiona |
| IMG-T04 | La cooperativa publica su sitio, sin programadores. | Marca y contenido los maneja la cooperativa, con versiones |
| **Bloque B — El stack tecnológico** | | |
| IMG-T05 | El stack, capa por capa. | Tecnología conocida, probada y de código abierto |
| IMG-T06 | Una base, muchas cooperativas, ningún cruce. | El aislamiento entre cooperativas está en cada capa |
| IMG-T07 | Del código a producción. | Contenedores, ambientes y un camino controlado a producción |
| **Bloque C — Backend y frontend** | | |
| IMG-T08 | Cinco aplicaciones, un solo código. | Cómo se organiza el monorepo |
| IMG-T09 | 28 módulos con fronteras claras. | Un monolito modular: cada módulo es dueño de lo suyo |
| IMG-T10 | Lo pesado no frena al usuario. | Eventos, colas y procesos en segundo plano |
| **Bloque D — El modelo de datos** | | |
| IMG-T11 | 1.058 tablas, ola por ola. | El tamaño del modelo y cómo se construye |
| IMG-T12 | De la persona a la factura. | El corazón comercial del modelo |
| IMG-T13 | De la factura al cobro. | Cuenta corriente, cobranza y mora |
| IMG-T14 | Seis dominios, un solo modelo. | El mapa completo, por áreas |
| IMG-T15 | Reglas que valen para todos los datos. | Las convenciones que protegen la información |
| IMG-T16 | Pensado para crecer. | Volumen, particionado y archivo |

---

## 2. Bloque A — La landing de cada cooperativa

### IMG-T01 — Una plataforma. Una landing por cooperativa.

**Respaldo:** cada cooperativa tiene una landing propia con su marca, accesible por un subdominio `<cooperativa>.<dominio de la plataforma>` y, si lo desea, por su dominio propio. La landing nunca muestra la marca de otra cooperativa (M19 RF-POR-001 y RF-POR-021). Al entrar, el sistema reconoce la cooperativa por la dirección y carga su marca, su vocabulario, su oferta de servicios y su landing publicada (M19 §9.1). Hay además un punto de entrada general con un buscador de cooperativas por nombre o localidad (RF-POR-016).

**Frase para decir:** "Es una sola plataforma, pero el vecino entra al sitio de su cooperativa, con su nombre y sus colores. Nunca ve otra."

```text
Generá IMG-T01 con código.
Título grande: "Una plataforma. Una landing por cooperativa."
Composición: abajo, un bloque horizontal gris carbón, ancho, con el texto "CoopApps · una sola plataforma". De él suben tres líneas finas hacia tres ventanas de navegador iguales en tamaño, en fila:
- Ventana 1: barra de dirección "coop-ejemplo-a.<dominio>", marca "Cooperativa Ejemplo A" en azul #145DA0 con acento verde #2E8B57, portada con el título "Conectate con tu cooperativa" y tarjetas de Internet y Agua.
- Ventana 2: barra de dirección "coop-ejemplo-b.<dominio>", marca "Cooperativa Ejemplo B" en violeta #6A1B9A con acento amarillo #F9A825, tarjetas de Gas y Energía.
- Ventana 3: barra de dirección "www.cooperativa-c.com.ar" con una etiqueta pequeña "dominio propio", marca "Cooperativa C" en gris carbón con acento verde.
Las tres ventanas tienen la misma estructura (portada, servicios, accesos rápidos y botón de baja visible); solo cambian la marca, los colores y los servicios.
A la izquierda, una lupa con el texto pequeño "Buscador de cooperativas por nombre o localidad".
Pie: "Cada cooperativa con su dirección, su marca y sus servicios. Nunca la de otra".
```

### IMG-T02 — Qué tiene la landing.

**Respaldo:** la landing se arma con bloques que la cooperativa activa y ordena (M19 RF-POR-002 y §10.2):
- portada;
- servicios habilitados, cada uno con su ficha: planes con precio vigente e impuestos incluidos, requisitos, cobertura y botón "Contratar";
- accesos rápidos: Ingresar, Registrarme, Pagar, Botón de baja y Turnos;
- consulta de cobertura por domicilio, con alternativa sin mapa;
- noticias;
- avisos de corte programados por zona;
- trámites y requisitos, con los PDF descargables;
- preguntas frecuentes;
- contacto;
- sucursales y horarios;
- páginas legales.

Sin iniciar sesión, el vecino puede:
- consultar cobertura;
- pedir la baja y recibir un código de seguimiento dentro de las 24 h;
- seguir su baja;
- pagar con un código;
- hacer una consulta.

El botón de baja se ve en la portada sin desplazar la pantalla y en el pie de toda página (RF-POR-009 a RF-POR-014). La landing no muestra datos privados de ninguna persona (M19 §2.3).

**Frase para decir:** "El vecino encuentra todo sin crear una cuenta: qué servicios hay, cuánto cuestan, si llega a su casa, cómo hacer un trámite y cómo darse de baja."

```text
Generá IMG-T02 con código.
Título grande: "Qué tiene la landing."
Composición: en el centro, una maqueta grande de la landing de "Cooperativa Ejemplo A" (azul #145DA0, acento #2E8B57), en escritorio, dividida en franjas horizontales rotuladas, de arriba hacia abajo:
"Portada" · "Accesos rápidos: Ingresar · Registrarme · Pagar · Botón de baja · Turnos" · "Servicios con precio vigente e impuestos incluidos" · "¿Llega a tu domicilio? Consulta de cobertura" · "Noticias y avisos de corte" · "Trámites y requisitos" · "Preguntas frecuentes · Contacto · Sucursales y horarios" · "Pie legal".
El botón de baja se destaca con borde ámbar #B7791F arriba, en la portada, y otra vez en el pie.
A la derecha de la maqueta, una columna titulada "Sin iniciar sesión" con cinco tildes verdes: "Consultar cobertura" · "Pedir la baja y recibir un código en 24 h" · "Seguir la baja" · "Pagar con un código" · "Hacer una consulta".
Pie: "Ningún dato privado en la parte pública".
```

### IMG-T03 — De la landing a la app, sin cambiar de cooperativa.

**Respaldo:** desde la ficha de un servicio, "Contratar" lleva al registro y después vuelve al formulario de ese servicio, siempre con la marca de la cooperativa (RF-POR-015). La app del socio es una aplicación web instalable en el celular (PWA), con el nombre, el ícono y los colores de la cooperativa (M19 §1 y §9.1). En ella el socio:
- contrata;
- coordina la visita;
- sigue la instalación;
- firma la conformidad;
- ve consumos y facturas;
- paga en línea;
- reclama con fotos;
- suspende, reactiva y da de baja.

Si además es empleado de la cooperativa, en la misma app tiene su espacio de empleado, sin mezclar datos (M19 §1).

**Frase para decir:** "El vecino entra por la landing, se registra y desde ese momento tiene a su cooperativa en el celular. Todo el tiempo ve la misma marca."

```text
Generá IMG-T03 con código.
Título grande: "De la landing a la app, sin cambiar de cooperativa."
Composición: un recorrido de izquierda a derecha en cuatro pantallas unidas por flechas, todas con la marca de "Cooperativa Ejemplo A" (azul #145DA0, acento #2E8B57):
1. Ventana de escritorio: "Ficha de Internet · Plan de ejemplo · ARS 0.000 · Contratar".
2. Celular: "Registrarme" (formulario simple).
3. Celular: "Formulario de Internet" con la nota "vuelve al servicio elegido".
4. Celular más grande: "App del socio" con ícono de la cooperativa en la pantalla de inicio del teléfono y la pantalla de inicio de la app (saldo ARS 0.000, próximo vencimiento, botón "Pagar").
Debajo, una fila de ocho íconos de línea con rótulo: Contratar · Coordinar visita · Seguir la instalación · Firmar conformidad · Consumos y facturas · Pagar · Reclamar con fotos · Dar de baja.
Pie: "La misma marca de punta a punta · Instalable en el celular · Espacio de empleado en la misma app".
```

### IMG-T04 — La cooperativa publica su sitio, sin programadores.

**Respaldo:** la cooperativa administra su marca y su landing desde el sistema.
- **Marca (T03 §7.B):** nombre y sigla, color principal y de acento con control automático de contraste, logos por canal (sistema, app, landing, documentos y correo), logos por sucursal, pantalla de bienvenida, remitente de correos y de SMS, y variantes de marca para cada entidad jurídica en documentos y correos.
- **Landing (RF-POR-003):** pasa de borrador a revisión y de ahí a publicada, se previsualiza en escritorio y en celular, se puede programar la publicación y revertir a la versión anterior en menos de 1 minuto, con auditoría.
- **Versiones:** existe una sola versión publicada a la vez.

**Frase para decir:** "Cambiar una noticia, un banner o el logo no requiere llamar a nadie. Y si algo sale mal, se vuelve a la versión anterior en un minuto."

```text
Generá IMG-T04 con código.
Título grande: "La cooperativa publica su sitio, sin programadores."
Composición en dos mitades:
- Izquierda, "Su marca": una tarjeta de configuración sobria con muestras de color (principal y acento) y un pequeño indicador verde "contraste verificado"; debajo, cinco miniaturas de logo rotuladas "Sistema · App · Landing · Documentos · Correo"; y tres líneas: "Logos por sucursal" · "Pantalla de bienvenida" · "Variantes por entidad jurídica en documentos y correos".
- Derecha, "Su landing": una línea de estados con tres pasos "Borrador → En revisión → Publicada"; debajo, dos miniaturas de vista previa "Escritorio" y "Celular"; y un botón gris con flecha circular "Volver a la versión anterior · menos de 1 minuto".
Pie: "Una sola versión publicada a la vez · Cada cambio queda auditado".
```

---

## 3. Bloque B — El stack tecnológico

### IMG-T05 — El stack, capa por capa.

**Respaldo:** stack acordado con GoodApps (DEC-111, DEC-112; `00` §5, T01).

| Capa | Tecnología |
|---|---|
| Pantallas (sistema, app del socio y landing) | React 19, Vite, TypeScript, Tailwind 4, shadcn/Radix; PWA instalable; mapas con Leaflet |
| Servidor | .NET 10, ASP.NET Core, EF Core; validación alineada a contratos y zod en front |
| Trabajo en segundo plano | Azure Queue Storage; workers .NET; Redis en Azure donde aplique |
| Datos | Azure SQL (base compartida multitenant, transacciones, integridad referencial) |
| Archivos | Azure Blob privado; URLs firmadas de corta duración |
| Seguridad de acceso | OpenIddict, 2FA, sesión federada según T02 |
| Mensajería | Correo, push, WhatsApp y canales acordados en T02/T09 |
| Documentos | Excel, PDF y códigos QR |
| IA | Proveedores con medición por cooperativa; propone, no ejecuta solo (P6) |
| Observación | Application Insights, logs estructurados, OpenTelemetry |
| Pruebas | Unitarias, integración SQL, Playwright, k6 |
| Empaquetado | Contenedores en **Microsoft Azure** (Container Apps) |

UI según design system CoopApps (T03) con componentes shadcn/Radix.

**Frase para decir:** "CoopApps se construye sobre .NET y Azure, con una base relacional segura y pantallas React modernas para el equipo y para el socio."

```text
Generá IMG-T05 con código.
Título grande: "El stack, capa por capa."
Composición: una pila vertical de seis franjas horizontales anchas, de arriba hacia abajo, cada una con el nombre de la capa a la izquierda (texto gris carbón) y las tecnologías a la derecha como etiquetas redondeadas de borde verde:
1. "Pantallas" — React 19 · Vite · TypeScript · Tailwind · PWA · Leaflet
2. "Servidor" — .NET 10 · ASP.NET Core · EF Core
3. "Segundo plano" — Azure Queue · Workers .NET
4. "Datos" — Azure SQL (multitenant, transacciones)
5. "Archivos" — Azure Blob
6. "Empaquetado y nube" — Microsoft Azure · Container Apps
A la derecha de la pila, una columna vertical fina que atraviesa todas las capas, rotulada "Transversal": Seguridad (OpenIddict, 2FA) · Observación (Application Insights) · Pruebas (integración SQL, Playwright, k6) · IA con medición por cooperativa.
Pie: "Stack GoodApps · Azure · Diseño CoopApps (T03)".
```

### IMG-T06 — Una base, muchas cooperativas, ningún cruce.

**Respaldo:** todas las cooperativas comparten una sola base **Azure SQL**, y cada dato lleva la cooperativa a la que pertenece (**DEC-110**). El aislamiento se controla en cada capa (T01 §7.8):
- **Acceso:** el token de acceso dice de qué cooperativa es el usuario.
- **Consultas:** ninguna consulta se ejecuta sin la cooperativa; si falta, la operación se rechaza.
- **Índices:** todos los índices empiezan por la cooperativa.
- **Transacciones:** una transacción no puede mezclar cooperativas.
- **Archivos, caché, procesos y eventos:** todos llevan la cooperativa.
- **Copias de seguridad:** se restaura una cooperativa sin tocar a las demás.
- **Inteligencia artificial:** solo ve datos de la cooperativa que la usa.

Las pruebas automáticas de aislamiento corren en cada cambio y cubren toda colección nueva (T05 §7.1.2).

**Frase para decir:** "Es una sola base, pero cada dato sabe de quién es. El sistema no deja que una cooperativa vea lo de otra, y lo probamos en cada cambio."

```text
Generá IMG-T06 con código.
Título grande: "Una base, muchas cooperativas, ningún cruce."
Composición: en el centro, un cilindro de base de datos grande en gris carbón rotulado "Una sola base". Dentro, documentos pequeños apilados en tres colores suaves con una etiqueta en cada uno: "Cooperativa A", "Cooperativa B", "Cooperativa C", separados por líneas finas verdes.
Alrededor del cilindro, en círculo, ocho controles con un candado verde pequeño y una línea corta cada uno:
"Acceso: el token dice la cooperativa" · "Consultas: sin cooperativa, se rechaza" · "Índices: empiezan por la cooperativa" · "Transacciones: nunca mezclan" · "Archivos y caché: separados" · "Procesos y eventos: llevan la cooperativa" · "Copias: se restaura una sin tocar las demás" · "IA: solo ve lo de su cooperativa".
Pie: "Pruebas automáticas de aislamiento en cada cambio".
```

### IMG-T07 — Del código a producción.

**Respaldo:** un mismo Dockerfile genera cinco imágenes: API, procesos en segundo plano, sistema de gestión, app del socio y landing (T01 §7.10). Cada cooperativa se resuelve por su dirección:
- `/` es la landing;
- `/app/` es la app del socio;
- `/admin/` es el sistema de gestión;
- `/api` es el servidor.

En local todo se levanta con un solo comando (`docker compose up`). Hay siete ambientes:
- local;
- pruebas automáticas;
- desarrollo;
- preproducción;
- prueba de configuración de cada cooperativa;
- demostración;
- producción.

Cada cambio pasa por estos controles antes de llegar a producción:
1. revisión de código y de fronteras entre módulos;
2. pruebas con base real;
3. suite de aislamiento;
4. escaneo de seguridad;
5. preproducción con pruebas de punta a punta y de carga;
6. aprobación;
7. despliegue por anillos.

**Frase para decir:** "Cada cambio pasa por los mismos controles antes de llegar a la cooperativa, y todas tienen siempre la misma versión."

```text
Generá IMG-T07 con código.
Título grande: "Del código a producción."
Composición en tres franjas horizontales:
1. Arriba, "Cinco imágenes, un solo código": cinco cajas iguales en fila (API · Segundo plano · Sistema de gestión · App del socio · Landing), cada una con un ícono de contenedor.
2. En el medio, "Cada cooperativa, por su dirección": la dirección "coop-ejemplo-a.<dominio>" en monoespaciada y, debajo, cuatro ramas: "/ → Landing" · "/app/ → App del socio" · "/admin/ → Sistema de gestión" · "/api → Servidor".
3. Abajo, "El camino a producción": una línea de pasos con flechas: "Revisión y fronteras" → "Pruebas con base real" → "Aislamiento" → "Seguridad" → "Preproducción y carga" → "Aprobación" → "Producción por anillos". El último paso en verde.
Pie: "Siete ambientes · Un comando para levantar todo en local · La misma versión para todas las cooperativas".
```

---

## 4. Bloque C — Backend y frontend

### IMG-T08 — Cinco aplicaciones, un solo código.

**Respaldo:** todo vive en un solo repositorio (monorepo; T01 §7.3).

| Pieza | Qué es |
|---|---|
| `apps/api` | El servidor: recibe los pedidos, valida permisos y ejecuta las operaciones |
| `apps/worker` | Los procesos en segundo plano: lotes, integraciones, notificaciones, exportaciones |
| `apps/admin` | El sistema de gestión que usa el personal de la cooperativa |
| `apps/pwa` | La app del socio, del empleado y de campo, instalable en el celular |
| `apps/landing` | El sitio público de cada cooperativa |

Hay además cuatro paquetes compartidos:
- **contratos de datos:** los mismos esquemas en servidor y pantallas, más dinero, fechas y catálogos;
- **diseño visual propio:** tablas, asistente de importación de Excel, ventanas y avisos;
- **diccionario de textos:** cada cooperativa puede usar su propio vocabulario;
- **conectores de integración.**

El servidor y los procesos en segundo plano usan exactamente los mismos módulos.

**Frase para decir:** "Hay una sola fuente de código. El servidor, las pantallas y la app comparten las mismas reglas, así no se contradicen."

```text
Generá IMG-T08 con código.
Título grande: "Cinco aplicaciones, un solo código."
Composición: un gran rectángulo con borde gris rotulado "Un solo repositorio". Dentro, dos filas:
- Fila superior, "Backend": dos cajas grandes gris carbón, "Servidor (API)" y "Procesos en segundo plano", unidas por una franja verde "mismos módulos".
- Fila del medio, "Frontend": tres cajas en verde claro, "Sistema de gestión", "App del socio, empleado y campo" y "Landing pública".
- Fila inferior, "Compartido por todos": cuatro cajas finas, "Contratos de datos" · "Diseño visual propio" · "Diccionario de textos" · "Conectores de integración", con líneas finas que suben hacia el backend y el frontend.
Pie: "Las mismas reglas en el servidor y en las pantallas".
```

### IMG-T09 — 28 módulos con fronteras claras.

**Respaldo:** el backend es un **monolito modular** (DEC-003; T01 §7.2 y §7.4). Es un solo sistema dividido en 28 módulos: 19 de negocio y 9 de plataforma.
- **Negocio:** personas, catálogo, medición, tarifas, facturación, fiscal, cobranza, mora, atención, técnica, ventas, compras, stock, tesorería, contabilidad, sueldos, institucional, servicios sociales y portal.
- **Plataforma:** plataforma, identidad, marca, configuración, integraciones, migración, workflow, comunicaciones y reportes.

Las reglas entre módulos son estas:
- **Cada módulo es dueño de sus datos:** solo él los escribe.
- **Los módulos se hablan por dos vías:** un pedido directo o un evento.
- **Las fronteras se controlan solas:** una revisión automática impide que un módulo toque los datos de otro.
- **El sistema puede separarse si hace falta:** si un módulo necesita crecer aparte, se separa sin reescribir a los demás.

**Frase para decir:** "Es un solo sistema, fácil de operar, pero dividido por dentro como si fueran 28. Ningún módulo toca los datos de otro."

```text
Generá IMG-T09 con código.
Título grande: "28 módulos con fronteras claras."
Composición: una cuadrícula de 28 fichas pequeñas, todas del mismo tamaño, agrupadas en dos zonas:
- Zona grande "Negocio · 19" (fichas con borde verde): Personas · Catálogo · Medición · Tarifas · Facturación · Fiscal · Cobranza · Mora · Atención · Técnica · Ventas · Compras · Stock · Tesorería · Contabilidad · Sueldos · Institucional · Servicios sociales · Portal.
- Zona "Plataforma · 9" (fichas en gris carbón): Plataforma · Identidad · Marca · Configuración · Integraciones · Migración · Workflow · Comunicaciones · Reportes.
Entre dos fichas de ejemplo (Facturación y Cobranza), dos flechas finas rotuladas "pedido directo" y "evento"; y un candado pequeño sobre Facturación con la nota "sus datos solo los escribe él".
A la derecha, tres afirmaciones con tilde verde: "Cada módulo es dueño de sus datos" · "Se hablan por pedidos o eventos" · "Una revisión automática controla las fronteras".
Pie: "Un solo sistema para operar · Separable si algún día un módulo necesita crecer aparte".
```

### IMG-T10 — Lo pesado no frena al usuario.

**Respaldo:** ningún proceso masivo corre mientras el usuario espera (T01 ARQ-PLA-11).
- **Mismo momento:** cuando un módulo hace un cambio, guarda el cambio y el evento que lo anuncia juntos. Si uno falla, falla el otro (outbox).
- **Sin duplicados:** los consumidores procesan cada evento una sola vez, aunque llegue dos veces.
- **Ocho colas:** el trabajo se reparte según su tipo:
  - interactivo;
  - integraciones (ARCA, pasarelas, bancos);
  - eventos;
  - notificaciones;
  - lotes (facturación, mora);
  - exportaciones;
  - IA;
  - mantenimiento.
- **Límite por cooperativa:** cada cola tiene un tope por cooperativa, para que una cooperativa grande no frene a las demás.
- **Control de los procesos largos:** se pausan, se cancelan y se retoman desde donde quedaron.
- **Fallas:** si algo falla, se reintenta. Si sigue fallando, pasa a una bandeja y genera una alerta (T01 §7.6).

**Frase para decir:** "Cuando la cooperativa factura veinticinco mil cuentas, la persona que atiende en el mostrador no lo nota."

```text
Generá IMG-T10 con código.
Título grande: "Lo pesado no frena al usuario."
Composición de izquierda a derecha:
1. Una caja "Cambio en un módulo" con dos hojas dentro, "el dato" y "su evento", y la etiqueta "se guardan juntos".
2. Una flecha hacia un embudo "Despachador" y, de él, ocho carriles horizontales apilados, cada uno con su nombre: Interactivo · Integraciones · Eventos · Notificaciones · Lotes · Exportaciones · IA · Mantenimiento. El carril de Lotes es más ancho y lleva la nota "facturación y mora".
3. A la derecha de los carriles, tres afirmaciones con tilde verde: "Cada evento se procesa una sola vez" · "Tope por cooperativa: una grande no frena a las demás" · "Pausar, cancelar y retomar donde quedó".
Abajo, en ámbar, una caja chica: "Si falla: reintento; si sigue fallando, bandeja y alerta".
Pie: "Ningún proceso masivo corre mientras el usuario espera".
```

---

## 5. Bloque D — El modelo de datos

### IMG-T11 — 1.058 tablas, ola por ola.

**Respaldo:** el modelo tiene **1.058 tablas** en Azure SQL (`07-catalogo-tablas-sql.md`, DDL en `07-ddl`). Cada una tiene un módulo dueño, sus claves, sus índices, su clasificación de datos y su ola de creación (T05 §1 y §7.9). Se crean a medida que se construye cada ola:

| Ola | Tablas |
|---|---|
| O0 Cimientos | 63 |
| O1 Plataforma, identidad y configuración | 134 |
| O2 Personas, catálogo, atención y comunidad | 138 |
| O3 Internet: técnica y equipos | 64 |
| O4 Tarifas, facturación y ARCA | 96 |
| O5 Cobranza y núcleo contable | 104 |
| O6 Mora | 35 |
| O7 Servicios medidos | 72 |
| O8 ERP administrativo | 100 |
| O9 Sueldos | 65 |
| O10 Institucional, social, telefonía y fabricación | 125 |
| O11 BI, migración y paralelo | 62 |

**Frase para decir:** "El modelo de datos está completo: más de mil tablas, cada una con su dueño y su momento de construcción."

```text
Generá IMG-T11 con código.
Título grande: "1.058 tablas, ola por ola."
Composición: a la izquierda, el número "1.058" enorme en verde con el rótulo "tablas, cada una con su dueño". A la derecha, un gráfico de barras verticales sobrio, una barra por ola, en gris carbón, con la cifra arriba y el nombre corto debajo:
O0 Cimientos 63 · O1 Plataforma 134 · O2 Personas y atención 138 · O3 Internet 64 · O4 Facturación y ARCA 96 · O5 Cobranza y contabilidad 104 · O6 Mora 35 · O7 Servicios medidos 72 · O8 ERP 100 · O9 Sueldos 65 · O10 Institucional y social 125 · O11 BI y migración 62.
Sin ejes recargados ni cuadrícula; solo las barras y sus cifras.
Pie: "Cada tabla se crea en la ola de su módulo, con sus índices y sus pruebas de aislamiento".
```

### IMG-T12 — De la persona a la factura.

**Respaldo:** el núcleo comercial del modelo (T05 §7.10), explicado sin campos:
- **Persona:** cualquier persona física o jurídica, una sola vez en el sistema aunque cumpla varios roles (socio, proveedor, chofer…) (DEC-097).
- **Titular:** la persona como responsable de cuentas.
- **Cuenta o suministro:** agrupa los servicios de un titular en un lugar.
- **Inmueble y punto de servicio:** dónde se presta el servicio.
- **Contrato de servicio:** un servicio concreto con su plan vigente. Cada contrato puede tener equipos asignados y personas adheridas.
- **Punto de medición, lectura y consumo:** lo que marca el medidor y lo que se consumió.
- **Cálculo:** aplica el cuadro tarifario al consumo.
- **Renglón facturable:** cada concepto a cobrar.
- **Factura:** el documento emitido, con su autorización fiscal de ARCA y su talón de pago.

**Frase para decir:** "Así se arma una factura: una persona, su cuenta, sus servicios, lo que consumió, la tarifa que se aplicó y el comprobante autorizado por ARCA. Cada paso queda guardado."

```text
Generá IMG-T12 con código.
Título grande: "De la persona a la factura."
Composición: una cadena de tarjetas unidas por flechas finas, en forma de "U" invertida para que entre en la diapositiva. Cada tarjeta tiene un ícono de línea, el nombre en negrita y UNA frase corta debajo (sin nombres de campos):
"Persona — una sola vez, aunque cumpla varios roles" → "Titular — responsable de las cuentas" → "Cuenta — los servicios de un titular en un lugar" → "Inmueble — dónde se presta" → "Contrato de servicio — un servicio con su plan vigente" → "Medición — lecturas y consumos" → "Cálculo — la tarifa aplicada al consumo" → "Renglón facturable — cada concepto a cobrar" → "Factura — el comprobante emitido".
De "Factura" salen dos tarjetas chicas: "Autorización fiscal de ARCA" y "Talón de pago". De "Contrato de servicio" salen dos tarjetas chicas: "Equipos asignados" y "Personas adheridas".
Las tarjetas del recorrido en blanco con borde gris; "Factura" con borde verde grueso.
Pie: "Cada paso queda guardado y explica el siguiente".
```

### IMG-T13 — De la factura al cobro.

**Respaldo:** la cuenta corriente, la cobranza y la mora (T05 §7.10):
- **Deuda:** cada factura genera una o más deudas en la cuenta corriente del socio, y cada movimiento queda registrado.
- **Cobro en caja:** el cajero abre una caja, registra los cobros y emite el recibo. El recibo se imputa contra las deudas que cancela.
- **Cobro en línea:** el pago entra por la pasarela y termina en la misma caja.
- **Convenio de pago:** refinancia deudas en cuotas que se facturan.
- **Mora:** el aviso de mora puede escalar a un caso de corte, y el corte genera órdenes de trabajo para la cuadrilla.

**Frase para decir:** "Cada peso cobrado sabe qué deuda canceló, y cada deuda sabe de qué factura vino."

```text
Generá IMG-T13 con código.
Título grande: "De la factura al cobro."
Composición: en el centro, una tarjeta grande "Deuda — lo que el socio debe, de qué factura viene". A su izquierda, "Factura" con una flecha "origina". Arriba, "Cuenta corriente — el saldo y todos sus movimientos", unida a "Deuda".
A la derecha, dos caminos que llegan a la deuda:
- "Caja → Cobro → Recibo → Imputación — qué deuda se canceló"
- "Pago en línea → Pasarela → misma caja"
Abajo, dos ramas en gris:
- "Convenio de pago — refinancia deudas en cuotas"
- "Aviso de mora → Caso de corte → Orden de trabajo" (este camino con borde ámbar #B7791F).
Cada tarjeta con su frase corta, sin nombres de campos.
Pie: "Cada peso cobrado sabe qué deuda canceló".
```

### IMG-T14 — Seis dominios, un solo modelo.

**Respaldo:** el mapa de relaciones del modelo se ordena en seis dominios (T05 §7.10).

| Dominio | Qué contiene |
|---|---|
| Plataforma e identidad | Cada cooperativa con sus entidades jurídicas (cooperativa, mutual), sus sucursales y puestos. Cada persona que entra al sistema tiene un acceso por cooperativa, con roles asignados |
| Núcleo comercial | Personas, titulares, cuentas, inmuebles, contratos de servicio, equipos, adherentes y asociados (uno por entidad jurídica) |
| Medición, tarifa y facturación | Medidores, lecturas, consumos, cuadros tarifarios, cálculos, facturas y su autorización fiscal |
| Cuenta corriente, cobranza y mora | Deudas, movimientos, cajas, recibos, imputaciones, pagos en línea, convenios, avisos y cortes |
| Atención, técnica y stock | Casos de atención, órdenes de trabajo, materiales, movimientos de stock, equipos con número de serie y red |
| ERP administrativo | Proveedores, compras, facturas de proveedor, pagos, tesorería, asientos contables, empleados y recibos de sueldo |

Todo documento económico o fiscal lleva la entidad jurídica que lo emite (DEC-064).

**Frase para decir:** "Son seis grandes áreas que conversan entre sí. Una factura de agua, un recibo de sueldo y un asiento contable viven en el mismo modelo y se cruzan sin errores."

```text
Generá IMG-T14 con código.
Título grande: "Seis dominios, un solo modelo."
Composición: seis bloques grandes dispuestos en hexágono alrededor de un círculo central verde "La cooperativa y sus entidades jurídicas". Cada bloque tiene un ícono de línea, su nombre y tres o cuatro entidades en palabras simples:
1. "Plataforma e identidad" — Cooperativa · Entidades jurídicas · Sucursales · Accesos y roles
2. "Núcleo comercial" — Personas · Cuentas · Contratos de servicio · Asociados
3. "Medición, tarifa y facturación" — Medidores y lecturas · Tarifas · Facturas · Autorización ARCA
4. "Cuenta corriente y cobranza" — Deudas · Cajas y recibos · Pagos en línea · Convenios y mora
5. "Atención, técnica y stock" — Casos · Órdenes de trabajo · Materiales · Equipos y red
6. "ERP administrativo" — Proveedores y compras · Tesorería · Contabilidad · Sueldos
Entre bloques vecinos, líneas finas grises que muestran que se relacionan (por ejemplo, de "Núcleo comercial" a "Facturación", de "Facturación" a "Cobranza", de "Cobranza" a "ERP administrativo").
Pie: "Todo documento económico lleva la entidad jurídica que lo emite".
```

### IMG-T15 — Reglas que valen para todos los datos.

**Respaldo:** son las convenciones obligatorias para todas las tablas (T05 §6 y §7.1; DEC-117).

| Regla | Qué protege |
|---|---|
| Cada dato lleva su cooperativa | Que nunca se mezclen cooperativas |
| El dinero se guarda con precisión decimal exacta, nunca como número aproximado | Que no aparezcan centavos de diferencia |
| Los documentos económicos no se borran ni se editan: se corrigen con un documento contrario | Que la historia contable sea siempre la misma |
| Lo emitido guarda una foto de los datos de ese momento | Que una factura vieja se reimprima igual aunque el socio se haya mudado |
| Cada cambio registra quién, cuándo y qué cambió, y dos personas no pueden pisarse | Auditoría y trabajo simultáneo seguro |
| Los datos personales están clasificados; los sensibles (salud, electrodependencia, sindicales, judiciales) y los bancarios se cifran | Privacidad (Ley 25.326) |
| Ninguna contraseña ni certificado se guarda en los datos del negocio: van a una bóveda cifrada | Que un acceso a la base no exponga credenciales |
| Lo migrado del sistema actual conserva la referencia a su registro de origen | Poder verificar cada dato migrado |
| Las referencias se declaran en Azure SQL (FK e índices) donde el dueño lo define, más cinco mecanismos en aplicación y un verificador nocturno que informa sin corregir (DEC-100, DEC-117) | Que no queden datos huérfanos |

**Frase para decir:** "Estas reglas no se eligen módulo por módulo: valen para todo el sistema, desde el primer día."

```text
Generá IMG-T15 con código.
Título grande: "Reglas que valen para todos los datos."
Composición: una cuadrícula de 3 × 3 tarjetas iguales, cada una con un ícono de línea, una regla corta en negrita y, debajo, qué protege en gris:
"Cada dato lleva su cooperativa" — nunca se mezclan ·
"Dinero con precisión exacta" — sin centavos de diferencia ·
"Lo económico no se borra" — se corrige con un documento contrario ·
"Foto de lo emitido" — una factura vieja se reimprime igual ·
"Quién, cuándo y qué" — y nadie pisa el trabajo de otro ·
"Datos sensibles cifrados" — salud, bancarios, judiciales ·
"Credenciales en bóveda" — nunca en los datos del negocio ·
"Traza de lo migrado" — cada dato con su origen ·
"Referencias verificadas cada noche" — se informa, no se corrige solo.
Las tarjetas con borde gris claro y el ícono en verde.
Pie: "Obligatorias para las 1.058 tablas, desde la ola O0".
```

### IMG-T16 — Pensado para crecer.

**Respaldo:** el modelo está dimensionado para crecer (DEC-075; T05 §7.8.2).
- **Tamaño de las cooperativas:** una estándar tiene 25.000 suministros y una grande, 150.000.
- **Cantidad de cooperativas:** el diseño es para 100 cooperativas y llega hasta 300 sin rediseño.
- **Volumen de facturas:** una cooperativa estándar emite unas 0,4 millones de facturas por año y una grande, 2,3 millones.
- **Crecimiento:** las tablas de alto volumen nacen con índices por cooperativa y partición lógica por tenant; el modelo escala en Azure SQL sin reescribir relaciones (DEC-075).
- **Archivo en frío:** el detalle accesorio de más de 36 meses se archiva cifrado por cooperativa.
- **Lo que no se archiva:** facturas, recibos, asientos y movimientos quedan en línea los 10 años, y el saldo de una cuenta nunca depende del archivo.

**Frase para decir:** "No diseñamos para la primera cooperativa: diseñamos para cien, y el modelo aguanta trescientas sin rehacerlo."

```text
Generá IMG-T16 con código.
Título grande: "Pensado para crecer."
Composición en tres columnas:
1. "Tamaño": dos círculos, uno chico "25.000 suministros · cooperativa estándar" y uno grande "150.000 · cooperativa grande"; debajo, "0,4 M y 2,3 M facturas por año".
2. "Escala": una fila de 100 puntos pequeños verdes y, a continuación, puntos grises hasta completar 300, con el rótulo "Diseñado para 100 · hasta 300 sin rediseño". Debajo, "Preparado para repartirse por cooperativa; las grandes en su propio espacio".
3. "Archivo": una línea de tiempo de 10 años; los primeros 36 meses en verde "en línea", el resto en gris "detalle accesorio archivado y cifrado". Encima de toda la línea, una franja verde fina: "Facturas, recibos, asientos y movimientos: en línea los 10 años".
Pie: "El saldo de una cuenta nunca depende del archivo".
```

---

## 6. Notas para el presentador

- **Para una reunión comercial:** T01, T02, T03 y T04, y para cerrar T12 y T15.
- **Para una reunión técnica:** T05 a T10 completos, y después T11, T14, T15 y T16.
- **Si solo hay lugar para cinco:** T01, T05, T09, T12 y T15.
- **El dominio propio de la cooperativa** está previsto, pero queda a validar (PA-POR-12 y PA-PLA-11). En T01 aparece como una opción, no como un hecho.
- **Los colores de las cooperativas de ejemplo** son los de la precarga ficticia de M19 §18.1. La tercera cooperativa de T01 es solo ilustrativa.
- **En el modelo de datos no se muestran campos ni tipos.** El detalle campo por campo vive en el §7 de cada anexo dueño, y T05 tiene el catálogo completo. Si alguien técnico lo pide, se muestra el anexo y no se agranda la imagen.
- **Las cifras de volumen de T16** son órdenes de magnitud para dimensionar el modelo, no metas de rendimiento (T05 §7.8.2).
