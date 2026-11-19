# CoopApps — Comparativo funcional exhaustivo: ProCoop vs CoopApps

Documento para **consejos, gerencias y responsables de área** de cooperativas de servicios. Objetivo: ver **sin huecos** qué hace hoy ProCoop, qué cubre la especificación de CoopApps y **qué gana la cooperativa** al pasarse (en todas sus áreas y canales).

| Dato | Valor |
|---|---|
| Versión del documento | 1.1 (revisión ampliada) |
| Fecha | 19-11-2026 |
| Producto nuevo | **CoopApps** (plataforma SaaS multitenant en la nube) |
| Sistema actual de referencia | **ProCoop** 10.4.6.722 (escritorio WinForms + Agente + CoopOnline / P-Móvil) |
| Fuentes principales | Relevamiento DEMO (`procoop-relevamiento/`); mapeo PC-001…PC-120 (`T03-UXD` §22); DFA 29 módulos; inventarios INV; integraciones (23 fichas); anexos M01–M19 y T01–T12; `alcance-especificacion-modulo-por-modulo.md`; `roles-y-modulos-para-claude.md`; `dolores-procoop-antes-y-despues.md`; plan de olas (`03-plan-de-olas-y-prompts.md`); **DEC-007** |
| Regla de lectura | **Equivalente (≡)** no significa “la misma pantalla”: significa que el **negocio** que hoy resuelve ProCoop queda cubierto, muchas veces con reglas y controles adicionales. |
| **Para presentación / marketing** | Tres capas + **guion unificado** con IMG-01…25, IMG-D y IMG-C: [`comparativo-funcional-procoop-vs-coopapps-para-presentacion.md`](./comparativo-funcional-procoop-vs-coopapps-para-presentacion.md) (**§0.5–0.6**) |
| **Megaspec gerencia + imágenes sin códigos** | [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md) + prompt [`comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`](./comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md) (**IMG-F**) |

### Índice rápido

1. [Mensaje ejecutivo](#1-mensaje-ejecutivo-para-la-cooperativa) · 1.2 [En 60 segundos](#12-en-60-segundos) · 1.3 [Qué sí reconocemos de ProCoop](#13-qué-sí-reconocemos-de-procoop-tón-honesto)
2. [Dimensiones transversales](#2-comparativo-por-dimensión-lo-transversal) · 2.1 [Roles y permisos](#21-roles-y-permisos) · 2.2 [Canales digitales (CoopOnline)](#22-canales-digitales-procoop-vs-coopapps)
3. [Menú ProCoop 120 ítems](#3-comparativo-ítem-por-ítem-menú-procoop-120-funciones) (todas las filas PC-001…PC-120)
4. [Módulos CoopApps](#4-comparativo-por-módulo-coopapps-negocio-completo) · 4.1 [Mapa DFA 29→M/T](#41-mapa-dfa-29-módulos--anexos-coopapps)
5. [17 familias de servicio](#5-servicios-que-la-cooperativa-puede-prestar-17-familias)
6. [Lo nuevo y ampliado](#6-funciones-nuevas-o-muy-ampliadas) · 6.4 [Autogestión socio](#64-autogestión-del-socio-trámites-portal)
7. [Qué no se replica tal cual](#7-lo-que-procoop-hace-y-coopapps-no-replica-tal-cual-a-propósito)
8. [Visión integral y olas](#8-por-qué-conviene-pasarse-en-todos-los-aplicativos) · 8.1 [Plan O0–O11](#81-plan-de-habilitación-olas-o0o11)
9. [Integraciones](#9-integraciones-externas)
10. [Principios que atraviesan todo](#10-principios-que-atraviesan-todo-el-sistema)
11. [Preguntas frecuentes](#11-preguntas-frecuentes-de-la-cooperativa)
12. [Checklist](#12-checklist-de-tranquilidad)
13. [Referencias](#13-referencias-para-profundizar)

---

## 0. Cómo leer este documento

### 0.1 Leyenda de la columna «Tipo»

| Tipo | Significado |
|---|---|
| **≡** | Cobertura funcional equivalente: la cooperativa puede hacer lo mismo (u operación equivalente de negocio). |
| **↑** | Lo de ProCoop **más** controles, trazabilidad, canales o reglas que hoy faltan o son frágiles. |
| **+** | Capacidad **nueva** respecto del menú ProCoop relevado (no tiene ítem equivalente en las 9 pestañas). |
| **→** | Sustitución deliberada del modelo anterior (por arquitectura SaaS, seguridad o experiencia de uso). |
| **—** | Deliberadamente fuera del alcance del tenant (pasa a infraestructura gestionada). |

### 0.2 Las ocho aplicaciones de CoopApps (frente a ProCoop)

| Aplicación CoopApps | ProCoop hoy | Qué cambia para la cooperativa |
|---|---|---|
| Sistema de gestión web (personal) | ProCoop.exe en cada PC | Sin instalación local; misma versión para todos; acceso desde navegador. |
| Portal y app del socio | CoopOnline / web del proveedor | **Mismos datos en tiempo real** que la oficina; marca propia; app instalable. |
| Espacio del empleado | Recibos y consultas limitadas | Recibos, licencias, documentación, sin mezclar datos del socio. |
| App de campo (offline) | P-Móvil sobre copia MySQL | Técnico, lecturista, cobrador e inspector en **una** app; conflictos supervisados. |
| Sitio público / landing | Web genérica compartida | Bloques, borrador/publicación, dominio propio, oferta y contratación. |
| Tótem de autogestión | Parcial en turnero | Modo tótem en sucursales. |
| Consola de plataforma | No existe | Operación del proveedor SaaS (no sustituye el día a día de la cooperativa). |
| API para terceros de la cooperativa | WS_KEYS / Integra sin API documentada por recurso | API versionada con permisos que administra la cooperativa (ola **O11**; ver [§6.3](#63-para-integraciones-y-datos)). |

### 0.3 Garantía de cobertura del menú relevado

| Resultado del mapeo formal (T03 §22.1) | Cantidad |
|---|---|
| Funciones absorbidas (mismo propósito) | **112** |
| Funciones reemplazadas (mecanismo mejor) | **7** |
| Funciones descartadas | **1** (administrar la base local) |
| **Sin destino** | **0** |

Cualquier función que hoy un empleado encuentra en ProCoop tiene trazabilidad a CoopApps: ítems `SM-*` del mapa del sitio (**558** ítems de menú en todas las apps; **402** en gestión web) y **1.051** pantallas catalogadas.

### 0.4 Números que respaldan el comparativo (solo fuentes del proyecto)

| Concepto | ProCoop (relevamiento) | CoopApps (especificación) |
|---|---|---|
| Pestañas de menú en escritorio | 9 + pantalla principal | 18 grupos en gestión web (reorganizado por proceso) |
| Funciones de menú catalogadas | 120 | 119 equivalentes + 1 infraestructura |
| Tablas de negocio (CAT) | 659 en 31 secciones | 1.058 tablas con dueño único (T05 + `07-ddl` Azure SQL) |
| Formularios inventariados (INV) | Por módulo (ej. Titulares 104, Facturación 82, Cobranza 90, Técnica 61) | Cubiertos por requisitos + pantallas catalogadas |
| Módulos de especificación | — | 19 funcionales (M01–M19) + 12 transversales (T01–T12) |
| Requisitos funcionales | — | **4.213** |
| Requisitos no funcionales | — | **293** |
| Reglas de negocio escritas | Extraídas del código (RN-01…13) | ~2.680 |
| Fichas de integración | 23 secciones (relevamiento) | 115 fichas (T06) |
| Roles plantilla | Perfiles armados a mano por cooperativa | **40** roles predefinidos ajustables (T02) |
| Familias de servicio con ficha de control | Implícitas en tablas | **17** (T12) |

### 0.5 Uso recomendado en reunión

| Audiencia | Leer primero | Usar en la mesa |
|---|---|---|
| Consejo (30 min) | §1, §1.3, §8, §12 | Checklist §12 |
| Gerencia operativa | §3 de su pestaña, §4 fila de su módulo, §10 | Matriz §4 |
| Responsable de cambio / TI | §2.2, §8.1, §9, T07 en referencias | Plan de olas |
| Comercial / atención | §6.1, §6.4, M09/M19 en §4 | FAQ §11 |

---

## 1. Mensaje ejecutivo para la cooperativa

**ProCoop es un sistema profundo y respetable**: en la DEMO se observaron ~12.500 comprobantes por emisión mensual, factura multiservicio con tasas de terceros, prepago, mora, compras, tesorería, contabilidad y sueldos. Las cooperativas lo conocen y confían en él.

**CoopApps no propone “menos negocio”**: propone **el mismo alcance funcional**, en la nube, con **ocho canales** coherentes, **reglas escritas** y un **plan de migración por etapas** sin apagar la operación un viernes.

**Compromiso de alcance (DEC-007):** *todo lo que hace ProCoop, sin sus debilidades conocidas* (instalación local, copias manuales, credenciales en el programa, portal sobre copia, parámetros opacos, soporte sin caso).

### 1.1 Por qué conviene el cambio — una frase por audiencia

| Audiencia | Beneficio central |
|---|---|
| Consejo y presidencia | Menos riesgo operativo y reputacional: seguridad verificable, datos aislados, exportación completa si algún día se va del proveedor, cumplimiento normativo trazable. |
| Gerencia general | Una sola información para oficina, campo y socio; decisiones con indicadores certificados; menos dependencia de “el que sabe el número del parámetro”. |
| Área comercial y atención | Expediente único por gestión; plazos; incidentes masivos; portal con marca; baja y reclamos sin fricción innecesaria. |
| Facturación, cobranza y mora | Lotes con universo congelado, excepciones visibles, un solo motor de intereses, corte solo **confirmado** en campo o red. |
| Técnica y campo | Instalación de punta a punta visible al socio; una app offline; stock por serie; redes y impacto de fallas. |
| Compras, stock y administración | Circuitos con separación de funciones; portal de proveedores; contabilidad automática desde cada operación. |
| Socio | Contratar, pagar, ver consumos y reclamar **desde el celular con la marca de su cooperativa**, sobre la misma cuenta que ve caja. |
| Contador y auditoría | Nada se borra; cada renglón de factura explicable; auditoría inmutable; libro IVA y regímenes con estados de presentación. |

### 1.2 En 60 segundos

| Pregunta | Respuesta corta |
|---|---|
| ¿Perdemos funciones del menú? | **No:** 119 de 120 cubiertas; la restante es administrar la BD (pasa al proveedor). |
| ¿El socio sigue pagando online? | **Sí**, con confirmación real de cobro y marca de la cooperativa (sin réplica MySQL). |
| ¿Y facturación masiva de energía/gas? | **Sí**, con controles de lote que ProCoop no formaliza igual (universo congelado, excepciones). |
| ¿Cuándo podemos apagar ProCoop? | Tras **dos ciclos** conciliados en paralelo (corte comercial piloto en **O7**; administrativo en **O11**). |
| ¿Qué es lo más nuevo? | Portal en vivo, comunidad, institucional completo, bóveda de credenciales, API de la cooperativa (O11). |

### 1.3 Qué sí reconocemos de ProCoop (tón honesto)

Para que nadie pueda desmentir la presentación (criterio de `dolores-procoop-antes-y-despues.md` §1.4):

| Tema | Formulación correcta |
|---|---|
| App del socio | ProCoop **sí tiene** CoopOnline y P-Móvil. No es “no tiene app”; es **app limitada sobre copia**, sin identidad fuerte de cada cooperativa. |
| API | ProCoop tiene **Integra**, WS_* y tablas Power BI. No es “cero API”; es **sin API documentada por recurso que la cooperativa administre** para sus propios integradores. |
| Seguridad | Citar solo lo **comprobado en código** (contraseñas reversibles, credenciales en variables, Firebase/APIKEY fijas en integraciones), no incidentes inventados. |
| Profundidad | ProCoop es **competidor respetable**; CoopApps compite en **mismo alcance + modelo nube + socio en el circuito**. |

---

## 2. Comparativo por dimensión (lo transversal)

| Dimensión | ProCoop (hoy) | CoopApps (especificación) | Tipo |
|---|---|---|---|
| Modelo de despliegue | Instalado en servidores/PC de cada cooperativa; actualizaciones por equipo | SaaS multitenant; una versión; navegador y móvil | → |
| Copias de seguridad | Menú “Copia de Seguridad” a cargo del usuario | Copia lógica diaria por cooperativa; PITR; ensayos de restauración (T01) | → |
| Parámetros | ~1.536 claves numéricas (`Busca_V2_*`) | ~2.490 parámetros con **nombre, tipo, vigencia, historial** (T04) | ↑ |
| Permisos | Perfiles por opción de menú y tabla | Roles por **acción**; 40 roles base (T02) | ↑ |
| Auditoría | Registros de login y cambios | Auditoría **inmutable encadenada** con valor anterior y nuevo (T02) | ↑ |
| Aprobaciones | Autorización de operaciones puntual | Circuitos multinivel, por monto, doble firma, bandeja unificada (T11) | ↑ |
| Identidad del socio | Portal compartido entre cooperativas | Marca por canal; **tres PWAs** instalables por cooperativa (T03, M19) | ↑ |
| Vocabulario | Textos fijos del sistema | Diccionario por cooperativa (T03) | + |
| Portal / autogestión | CoopOnline sobre **réplica** (ver §2.2) | Misma base operativa que caja (M19) | ↑ |
| API y datos propios | Integra + WS_* + Power BI | Exportaciones; API `/api/v1/ext` en O11 (T10) | ↑ |
| Integraciones | Credenciales en programa / tablas | Bóveda; modo prueba/producción; sin duplicar cobros (T06) | ↑ |
| Comunicaciones | SMS en Herramientas | Muro, encuestas, campañas, avisos por zona (T09) | + |
| Soporte del proveedor | Chat / TeamViewer sin caso | Caso numerado, acceso temporal auditado (T01) | + |
| Migración | Cambio “big bang” habitual | Paralelo factura a factura; códigos de barras legacy (T07) | + |
| Seguridad | Evidencia en relevamiento de código | OWASP ASVS L2, 2FA, cifrado por campo sensible (T08) | ↑ |
| Institucional | Tablas dispersas; sin menú dedicado | M17 completo (Ley 20.337, INAES) | ↑ |
| Fichas por servicio | Tablas y parametrización | T12: 17 familias con recorrido controlado | + |
| Personalización grillas | `FORMULARIOS_PERSONALIZACIONES` | Vistas guardadas (T03) | → |
| Agente de sincronización | `Agente Procoop.exe` (CoopOnline, backups, FE pendiente) | Sin réplica; jobs en nube con colas y reintentos (T01, T06) | → |

### 2.1 Roles y permisos

| Aspecto | ProCoop | CoopApps |
|---|---|---|
| Unidad de permiso | Perfil: menú + tablas (`PERFILES`, `PERFILES_TABLAS`) | **Acción**: ver, crear, editar, anular, aprobar, exportar, configurar |
| Qué pantallas ve | Mismo perfil | **Perfil de pantallas** separado del rol funcional |
| Roles de partida | Cada cooperativa arma perfiles desde cero | **40 plantillas** copiables y renombrables |
| Alcance de datos | Área, depósitos, punto de venta | Sucursal, caja, zona, servicio, cuadrilla, cartera cobrador, “solo asignado” |
| Doble factor | No relevado como estándar | Obligatorio en roles sensibles; passkeys opcionales |
| Aprobaciones | `AUTORIZACIONES` en el momento | Autorización + **T11** (quien crea no aprueba) |
| Auditoría | Login y cambios | Cada cambio con **antes/después**; lecturas sensibles registradas |

Detalle por rol y pantalla: [`roles-y-modulos-para-claude.md`](./roles-y-modulos-para-claude.md).

### 2.2 Canales digitales: ProCoop vs CoopApps

Esta tabla explica **por qué el socio y caja a veces “no coinciden” hoy** y qué cambia.

| Canal | Cómo funciona en ProCoop (relevamiento) | Cómo funciona en CoopApps | Tipo |
|---|---|---|---|
| Portal CoopOnline | `Agente` **copia** titulares, facturas, pagos, consumos a **MySQL externo** del proveedor; PDF por FTP/S3; pagos web vía **Firebase** escuchada por el Agente; confirmación consultando pasarela | Portal es **parte del mismo sistema**; no hay base intermedia | ↑ |
| Pagos online | Webhook dispara Firebase; ProCoop **no expone HTTP**; riesgo de desfasaje si la sync falla | Estado “confirmando” hasta acreditación en M07; reconsulta al proveedor antes de imputar | ↑ |
| P-Móvil (campo) | Sincronización similar a portal sobre réplica | API directa; offline con resolución de conflictos supervisada | ↑ |
| Trámites web | Definidos en ProCoop WEB; respuestas en API CoopOnline; lectura batch | Definición + bandeja operador en M19/M09; mismo dato que atención | ↑ |
| Migración de usuarios portal | Depende de dueño de MySQL/Firebase | T07: vinculación sin re-registro cuando hay datos exportables | + |

---

## 3. Comparativo ítem por ítem: menú ProCoop (120 funciones)

Origen: relevamiento DEMO (`procoop-relevamiento/README.md`). Destino: `T03-UXD` §22 (`SM-*`).

**Resumen por tipo (sobre las 120 filas):** la mayoría son **↑** o **≡** en la columna de valor; las **→** concentran en Configuración (SaaS, marca, vistas); la única **—** es PC-106.

### 3.1 Inicio y alertas

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-001 | Alerta modal FE pendientes | Centro de alertas + banner | ↑ | No bloquea el inicio de sesión. |
| PC-002 | Grilla comprobantes pendientes autorizar | Bandeja autorización fiscal (M06) | ≡ | Integrado a lotes. |
| PC-003 | Centro de notificaciones | Inicio + AlertCenter | ≡ | |
| PC-004 | Noticias ProCoop | Avisos producto + novedades versión | → | Novedades **de la cooperativa** en T09/M19. |

### 3.2 Servicios a Titulares — Titulares

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-005 | Administración de Titulares | M01 ficha integral | ↑ | Línea de tiempo; privacidad entre convivientes. |
| PC-006 | Administración de Personas | M01 identidad única | ↑ | Antiduplicado DNI/CUIT. |
| PC-007 | Consultas e Informes titulares | M01 + T10 | ≡ | Drill-down al documento origen. |

### 3.3 Servicios a Titulares — Consumos

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-008 | Registro de Lectura | M03 + app campo | ↑ | Foto, offline, excepciones con motivo. |
| PC-009 | Telemed | M03 | ≡ | |
| PC-010 | Opciones de consumos | M03 validación/estimaciones | ↑ | Tercer estimado → inspección. |
| PC-011 | Opciones de Telefonía | T12 telefonía | ≡ | |
| PC-012 | Informes de Consumos | T10 + M03 | ≡ | |

### 3.4 Servicios a Titulares — Ventas y Facturación

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-013 | Presupuestos | M11 | ↑ | Aceptación online → OT. |
| PC-014 | Venta de Productos | M11 POS | ≡ | |
| PC-015 | Facturación | M05 + M04 + M06 | ↑ | Lotes, prefactura, excepciones, multiservicio. |
| PC-016 | Informes Ventas y Facturación | T10 | ≡ | |
| PC-017 | Libro IVA Ventas | M06 | ↑ | Libro digital, Mis Comprobantes. |
| PC-018 | Movimiento de Conceptos | M05/M04 | ≡ | |

### 3.5 Servicios a Titulares — Cobranza

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-019 | Apertura de Caja | M07 | ≡ | |
| PC-020 | Cobranza Local | M07 | ↑ | QR, medios combinados, sin PAN. |
| PC-021 | Opciones de Cobranza | M07 + T04 | ↑ | Pasarelas, débito, conciliación. |
| PC-022 | Informes de Cobranzas | T10 | ≡ | |
| PC-023 | Configuración submenú ST | T04 por dominio | ↑ | Parámetros con nombre y vigencia. |

### 3.6 Crédito y Gestión de Mora

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-024 | Emitir Plan de Financiación | M08 | ↑ | CFT visible; firma portal. |
| PC-025 | Informes financiaciones | T10 | ≡ | |
| PC-026 | Generar Notificaciones (1ª) | M08 | ↑ | Constancia de entrega multicanal. |
| PC-027 | Tratamiento Notificaciones Generadas | M08 | ≡ | |
| PC-028 | Tratamiento de Morosos | M08 | ↑ | Un motor de intereses. |
| PC-029 | Notificaciones | M08 + T09 | ↑ | |
| PC-030 | Causas de Baja | M02/M08 | ≡ | |
| PC-031 | Instancias de Mora | M08 | ↑ | No ejecuta corte solo. |
| PC-032 | Excepciones de Mora | M08 | ↑ | Electrodependientes, ventanas legales. |
| PC-033 | Informes de Mora | T10 | ≡ | |

### 3.7 Operaciones

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-034 | Factibilidades | M10 | ↑ | Vigencia 90 días. |
| PC-035 | Órdenes | M10 + campo | ↑ | Estado visible al socio. |
| PC-036 | Carga Rápida de Reclamos | M09 | ↑ | Expediente y plazos. |
| PC-037 | Informes Técnica | T10 | ≡ | |
| PC-038 | Telemed Administración | M03 | ≡ | |
| PC-039 | Telemed Informes | M03/T10 | ≡ | |
| PC-040 | Telemed Configuración | M03/T04 | ≡ | |
| PC-041 | Vivienda Materiales | M18 | ↑ | |
| PC-042 | Vivienda Construcción | M18 | ↑ | |
| PC-043 | Vivienda Informes | T10 | ≡ | |

### 3.8 Compras y Stock

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-044 | Solicitudes Aprovisionamiento | M12 | ↑ | Separación de funciones. |
| PC-045 | Solicitudes Cotización | M12 | ≡ | |
| PC-046 | Órdenes de Compra | M12 | ≡ | |
| PC-047 | Remitos | M12 | ≡ | |
| PC-048 | Comprobantes Proveedores | M12 | ↑ | Tres vías; IA → borrador. |
| PC-049 | Pago a Proveedores | M12+M14 | ↑ | Bloqueo con excepción abierta. |
| PC-050 | Retenciones compras | M12+M06 | ≡ | |
| PC-051 | Stock Movimientos | M13 | ↑ | Custodia cuadrilla. |
| PC-052 | Trazabilidad | M13 | ↑ | Serie única. |
| PC-053 | Operaciones Especiales | M13 | ≡ | |
| PC-054 | Bienes de Uso | M13 | ≡ | |
| PC-055 | Fabricación | M13 | ≡ | |
| PC-056 | RMA | M13 | ≡ | |
| PC-057 | Informes Compras | T10/M12 | ≡ | |
| PC-058 | Informes Stock | T10/M13 | ≡ | |
| PC-059 | Libro IVA Compras | M06 | ≡ | Reubicado en fiscal. |
| PC-060 | Informes Correspondencia | T10/M12 | ≡ | |

### 3.9 Tesorería

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-061 | Movimientos Bancarios | M14 | ↑ | Conciliación asistida. |
| PC-062 | Cuentas Propias | M14 | ≡ | |
| PC-063 | Movimientos Tesorería | M14 | ↑ | Tránsito ≠ disponible. |
| PC-064 | Valores de Terceros | M14 | ≡ | |
| PC-065 | Cheques Propios | M14 | ↑ | Cheques electrónicos. |
| PC-066 | Cupones de Tarjetas | M14 | ≡ | |
| PC-067 | Retenciones Recibidas | M14 | ≡ | |
| PC-068 | Cajas Pagos a Proveedores | M14 | ≡ | |
| PC-069 | Cierre de Cajas | M14 | ≡ | |
| PC-070 | Informes Tesorería | T10 | ≡ | |

### 3.10 Sueldos

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-071 | Empleados | M16 | ≡ | |
| PC-072 | Empresas | M16 | ≡ | |
| PC-073 | Recibos | M16 + portal empleado | ↑ | Firma/conformidad en app. |
| PC-074 | Liquidación Masiva | M16 | ↑ | Quien calcula no aprueba. |
| PC-075 | Simulador | M16 | ≡ | |
| PC-076 | Impuesto a las Ganancias | M16 | ≡ | |
| PC-077 | Variables | M16/T04 | ≡ | |
| PC-078 | Conceptos | M16 | ≡ | |
| PC-079 | Aplicar Aumentos | M16 | ≡ | |
| PC-080 | Informes de Sueldos | T10 | ≡ | |
| PC-081 | Libro sueldo digital (off en DEMO) | M16 | ↑ | Habilitado en producto. |

### 3.11 Contabilidad

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-082 | Asientos | M15 | ↑ | Automáticos desde operaciones. |
| PC-083 | Consultar Mayor | M15 | ≡ | |
| PC-084 | Balance / Sumas y Saldos | M15 | ≡ | |
| PC-085 | Asientos Automáticos | M15 | ↑ | Una vez por operación. |
| PC-086 | Herramientas contables | M15 | ≡ | |
| PC-087 | Informes Contables | T10 | ≡ | |
| PC-088 | Informes de Gestión | T10 | ≡ | |
| — | Contabilidad paralela convivencia | M15 | + | Migrar sin romper ejercicio. |

### 3.12 Herramientas

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-089 | Actividades Seguimiento | T11 | ≡ | |
| PC-090 | Actividades Informe | T10 | ≡ | |
| PC-091 | SMS | T09 | ↑ | Multicanal. |
| PC-092 | Tablero de Control | T10 | ↑ | Indicadores certificados. |
| PC-093 | Traslados Viajes | M18 | ↑ | Flota integrada. |
| PC-094 | Traslados Informes | T10 | ≡ | |
| PC-095 | Turnero Box | M09 | ≡ | |
| PC-096 | Turnero | M09/M19 | ↑ | Turno online. |
| PC-097 | Selección de Turnos | M09/M19/tótem | ↑ | |
| PC-098 | Estadísticas Turnero | T10 | ≡ | |
| PC-099 | Mesa Entradas Administración | M09 | ↑ | |
| PC-100 | Mesa Entradas Incidentes | M09 | ↑ | Nombre configurable. |
| PC-101 | Mesa Entradas Informes | T10 | ≡ | |

### 3.13 Configuración

| ID | Función en ProCoop | En CoopApps | Tipo | Qué gana la cooperativa |
|---|---|---|---|---|
| PC-102 | Usuarios | T02 | ↑ | 2FA. |
| PC-103 | Perfiles | T02 roles + pantallas | → | Acciones, no solo menú. |
| PC-104 | Auditoría Logueo | T02 | ↑ | Auditoría de datos. |
| PC-105 | Copia de Seguridad | T01 export + backup | → | Sin operar BD. |
| PC-106 | Base de Datos | Infraestructura | — | |
| PC-107 | Actualizar | T01 versiones | → | Actualización continua. |
| PC-108 | Tablas del sistema | T04 distribuido | ↑ | “En uso por” antes de borrar. |
| PC-109 | Parámetros del Sistema | T04 | ↑ | |
| PC-110 | Parámetros Externos | T04 bóveda | ↑ | |
| PC-111 | Autorización Operaciones | T11 | ↑ | Circuitos configurables. |
| PC-112 | WEB Requisitos y Trámites | M19/M02/M09 | ↑ | |
| PC-113 | WEB Archivos | M19 | ≡ | |
| PC-114 | WEB Operaciones | M19/M07 | ↑ | Pago confirmado. |
| PC-115 | Logos facturas WEB | T03 marca | ↑ | Todos los canales. |
| PC-116 | Editor Reportes | T10 | ≡ | |
| PC-117 | Informes Personalizados | T10 | ↑ | Background jobs. |
| PC-118 | Procesos Personalizados | T10/T11 | ↑ | |
| PC-119 | Exportar/Imprimir listados | T03 ExportMenu | ≡ | |
| PC-120 | Personalización formularios | T03 vistas guardadas | → | |

### 3.14 Las 7 funciones «reemplazadas» (detalle)

| ID | Antes (ProCoop) | Después (CoopApps) | Motivo |
|---|---|---|---|
| PC-004 | Noticias del producto | Comunicación de la cooperativa | El canal es de la cooperativa, no del proveedor del escritorio. |
| PC-103 | Un perfil = menú + tablas | Rol + perfil de pantallas | Permisos por acción y menor riesgo. |
| PC-105 | Backup manual | Backup SaaS + exportación tenant | Modelo nube. |
| PC-107 | Actualizar.exe | Release continuo | |
| PC-115 | Solo logos en PDF web | Marca omnicanal | |
| PC-120 | Forms WinForms custom | Vistas guardadas | Mantenibilidad. |
| (+transversal) | Administrar SQL Server | — | PC-106. |

---

## 4. Comparativo por módulo CoopApps (negocio completo)

| Módulo | En ProCoop | CoopApps cubre | Tipo | Ventaja clave | RF (aprox.) | Ola principal |
|---|---|---|---|---|---|---|
| **M01** | ST Titulares (~104 INV) | Identidad, cuentas, representaciones, privacidad | ↑ | Dos titulares, un domicilio, privacidad. | 175 | O2 |
| **M02** | Tablas + fichas servicio | 17 familias, versiones, copia config | ↑ | Servicios on/off sin programar. | 117 | O2 |
| **M03** | Consumos + Telemed | Rutas, prepago, GD, excepciones | ↑ | Lectura → factura trazable. | 129 | O7 |
| **M04** | Cuadros tarifarios | Motor reproducible, simulador | ↑ | Explica cualquier peso. | 122 | O4/O7 |
| **M05** | Facturación (~82 INV) | Lotes, multiservicio, distribución | ↑ | Masiva sin duplicar. | 179 | O4 |
| **M06** | IVA, retenciones | ARCA resiliente, regímenes | ↑ | Contingencia fiscal. | 169 | O4–O8 |
| **M07** | Cobranza (~90 INV) | CC, entes, pasarelas, conciliación | ↑ | Sin guardar tarjeta. | 195 | O5 |
| **M08** | Mora (~16 INV) | Motor único, cortes normativos | ↑ | Corte confirmado. | 224 | O6 |
| **M09** | Mesa, turnero, reclamos | CRM omnicanal, incidentes | ↑ | Incidente masivo único. | 194 | O2–O6 |
| **M10** | Técnica (~61 INV) | OT, mapas, aprovisionamiento red | ↑ | Una app campo. | 239 | O3 |
| **M11** | Presupuestos, ventas | Expediente presupuesto→factura | ↑ | |
| **M12** | Compras | Portal proveedor, anti-fraude CBU | ↑ | | 115 | O8 |
| **M13** | Stock, RMA | Series, custodia | ↑ | Dónde está cada ONT. | 139 | O3/O8 |
| **M14** | Tesorería (~21 INV) | Conciliación, flujo proyectado | ↑ | | 188 | O5/O8 |
| **M15** | Contabilidad (~24 INV) | Asientos automáticos | ↑ | Balance → comprobante. | 163 | O5+ |
| **M16** | Sueldos | LSD, F.931, portal empleado | ↑ | 2 meses paralelos. | 146 | O9 |
| **M17** | Tablas institucional | Asambleas, capital, actas | ↑ | Quórum en vivo. | 109 | O10 |
| **M18** | Vivienda, traslados | Social + flota completo | ↑ | | 149 | O10 |
| **M19** | WEB + CoopOnline | Portal en vivo, marca, WCAG | ↑ | Misma data que caja. | 180 | O2–O5 |
| **T01** | — | SaaS, sandbox, soporte | + | Sin servidores propios. | 165 | O0–O1 |
| **T02** | Usuarios/perfiles | IAM moderno | ↑ | | 93 | O0–O1 |
| **T03** | Logos WEB | Marca + diccionario + 558 ítems | ↑ | Buscar como en ProCoop. | 179 | O0 |
| **T04** | Tablas/parámetros | Versionado | ↑ | | 143 | O0–O1 |
| **T05** | CAT 659 tablas | Modelo con dueño | → | | — | O0 |
| **T06** | Disperso | 115 fichas integración | ↑ | Bóveda credenciales. | 86 | O0–O5 |
| **T07** | — | Migración paralela | + | | 78 | O0–O11 |
| **T08** | Implícito | SLA, OWASP, Ley 25.326 | + | | 25+259 RNF | O0+ |
| **T09** | SMS | Comunidad multicanal | + | | 157 | O2 |
| **T10** | Informes + Power BI | BI + API O11 | ↑ | Datos de la cooperativa. | 104 | O11 |
| **T11** | Autorizaciones | Workflow + documentos | ↑ | | 157 | O0–O1 |
| **T12** | Implícito | 17 fichas servicio | + | Sin huecos verticales. | — | Transversal |

### 4.1 Mapa DFA 29 módulos → anexos CoopApps

Benchmark funcional del relevamiento (`definicion-funcional-alcance.md` §1), cruzado con la especificación:

| # DFA | Módulo DFA | Prioridad DFA | Anexo(s) CoopApps |
|---|---|---|---|
| 1 | Plataforma, seguridad | A | T01, T02, T08 |
| 2 | Parámetros y maestros | A | T04 |
| 3 | Personas, titulares, cuentas | A | M01 |
| 4 | Catálogo y conexiones | A | M02, T12 |
| 5 | Medidores y equipos | A | M03, M13 |
| 6 | Lecturas y telemedición | A | M03, M10 |
| 7 | Tarifas y motor | A | M04 |
| 8 | Facturación y FE | A | M05, M06 |
| 9 | Cuenta corriente | A | M07 |
| 10 | Cobranza | A | M07 |
| 11 | Mora y corte | A | M08 |
| 12 | Financiación | B | M08, M11 |
| 13 | Ventas y POS | B | M11 |
| 14 | Técnica y reclamos | B | M10, M09 |
| 15 | Redes / GIS | C | M10 |
| 16 | Compras | B | M12 |
| 17 | Stock, RMA, fabricación | B | M13 |
| 18 | Tesorería | B | M14 |
| 19 | Contabilidad | B | M15 |
| 20 | Sueldos | C | M16 |
| 21 | Atención, turnero | B | M09 |
| 22 | Actividades | C | T11 |
| 23 | Traslados y flota | C | M18 |
| 24 | Institucional | C | M17 |
| 25 | Servicios sociales | C | M18 |
| 26 | Autogestión socio | B | M19 |
| 27 | App campo | B | M10 (PWA campo) |
| 28 | Reportes y BI | B | T10 |
| 29 | Integraciones | A/B | T06 |

**Los 29 módulos DFA tienen anexo destino.** Prioridad C en DFA no significa “fuera de CoopApps”: significa que puede **habilitarse después** en el plan de olas (ej. institucional O10).

---

## 5. Servicios que la cooperativa puede prestar (17 familias)

| Servicio | ProCoop | CoopApps | Tipo | Mejora explícita en especificación |
|---|---|---|---|---|
| Internet | Sí | T12 + M10 | ↑ | Aprovisionamiento red + visita al socio. |
| Telefonía | Sí | T12 | ↑ | Mora: entrantes y emergencias. |
| Televisión | Sí | T12 | ↑ | Comodato trazado. |
| Electricidad | Sí (DEMO) | T12 | ↑ | Electrodependientes; GD; ventanas corte. |
| Agua | Sí | T12 | ↑ | Mínimo vital. |
| Cloacas | Sí | T12 | ↑ | No solo por tener agua. |
| Gas | Sí | T12 | ↑ | Reconexión con inspección. |
| Alumbrado público | Sí | T12 | ≡ | Bloque separado en factura. |
| Obras / contribución | Sí | T12 | ≡ | |
| Sepelio | Tablas | M18 | ↑ | Urgencia sin bloqueo por deuda. |
| Cementerio parque | Tablas | M18 | ↑ | Mora no libera unidad. |
| Banco de sangre | Tablas | M18 | ↑ | Sin datos clínicos. |
| Salud / ambulancias | Tablas | M18 | ↑ | Solo administrativo. |
| Vivienda | Menú planes | M18 | ↑ | Vales y etapas. |
| Tasas terceros | En factura DEMO | M02/M06 | ≡ | Rendición al ente. |
| Capital social | Tablas | M17/M15 | ↑ | Integración al pagar. |
| Otros | Parcial | M02 | ↑ | Sin código. |

Opciones **comunes a todas las familias** (ausentes como principio unificado en ProCoop, presentes en T12): alta provisoria, suspensión voluntaria, cambio de plan, factura separada o agrupada, imputación por antigüedad, protecciones normativas no desactivables.

---

## 6. Funciones nuevas o muy ampliadas

### 6.1 Para el socio y la comunidad

1. Landing con dominio propio y publicación versionada (M19).
2. Contratación digital con factibilidad y turno (M02, M10, M19).
3. Visita técnica con estados visibles (M10, M19).
4. Pago con confirmación real (M07, M19).
5. Baja regulatoria 24/72 h (M19).
6. Autolectura y prepago conciliado (M03, M19).
7. Representantes con permisos por acción (M01, M19).
8. Pago por tercero sin ver cuenta ajena (M07).
9. Muro, encuestas, eventos (T09).
10. Avisos de corte solo a afectados (T09, M10).
11. NPS en factura (T09).
12. Tótem y fila virtual (M09, M19).
13. Ciudadano Digital / Google sin fusionar cuentas por mail (T02, M19).
14. Consulta y pago **sin ingresar** con datos enmascarados (M19).
15. WCAG 2.2 AA verificado (T08, M19).

### 6.2 Para la gestión y el personal

16. SaaS sin servidores locales (T01).
17. Sandbox por cooperativa (T01).
18. Diccionario con concordancia gramatical (T03).
19. Buscador “como en ProCoop” (T03).
20. Parámetros simulables antes de publicar (T04).
21. Bandeja aprobaciones unificada (T11).
22. Expediente digital (T11).
23. Firma electrónica/digital con QR (T11).
24. Soporte con acceso temporal revocable (T01).
25. Exportación completa al cierre (T01, T10).
26. Contabilidad 1:1 desde operaciones (M15).
27. Anti-fraude cambio CBU proveedor (M12).
28. Portal proveedor (M12).
29. IA en compras → solo borrador (M12).
30. Conflictos sync campo supervisados (M13, M10).
31. Incidente común (M09).
32. Asistente WhatsApp con verificación (M09).
33. IA asiste, no ejecuta (varios).
34. Asambleas con quórum en vivo (M17).
35. Credencial asociado QR (M17).
36. Paralelo factura a factura (T07).
37. Barcodes legacy en transición (M07, T07).
38. Contabilidad no oficial en convivencia (M15).
39. Importación sueldos externa antes de liquidar propio (M16, O8→O9).
40. Tablero de salud del tenant (T01, T08).

### 6.3 Para integraciones y datos

41. Bóveda credenciales write-only (T06).
42. Probar conexión por integración (T06).
43. Estado “incierto” antes de reintentar CAE/cobro (T06, M06, M07).
44. API OpenAPI por cooperativa — **O11** (T10).
45. Indicadores certificados (T10).
46. Agente local impresoras/lectores (T06).
47. Tablas fiscales mantenidas por plataforma (M06).
48. Adaptadores únicos para aprovisionamiento TIC (M10, T06; reemplaza dispersión MikroTik/Radius/OLT en código).
49. Sin credenciales Firebase/MySQL hardcodeadas en cliente (elimina patrón relevado CoopOnline).

> **Nota honesta (API):** la API externa completa está en **O11**. Antes: exportaciones, reportes programados y exportación del tenant. Opción a validar: adelantar **API de solo lectura** antes de O11 (`dolores-procoop-antes-y-despues.md` §2.3).

### 6.4 Autogestión del socio: trámites y portal

CoopApps especifica **71 tipos de autogestión** referenciados frente a CoopOnline (M19). Comparativo de capacidades:

| Capacidad | ProCoop / CoopOnline | CoopApps M19 |
|---|---|---|
| Ver facturas y PDF | Sí (en réplica) | Sí (origen único) |
| Pagar / prepaga web | Sí vía Agente + Firebase | Sí con confirmación M07 |
| Trámites y DDJJ gas | Sí (batch desde API proveedor) | Definición + bandeja operador |
| Alta servicio / contratación | Parcial | Ciclo completo con turno |
| Estado visita técnica | Limitado | Estados completos |
| Baja con plazos legales | Variable por config | RF explícitos 24/72 h |
| Marca cooperativa en app | No | PWAs con nombre e ícono propios |
| Empleado vs socio | Mezclado | Espacio separado |
| Vinculación de cuentas | Con riesgos de sync | Código 6 dígitos, anti-enumeración |

---

## 7. Lo que ProCoop hace y CoopApps no replica tal cual (a propósito)

| Aspecto ProCoop | Por qué cambia | Qué gana la cooperativa |
|---|---|---|
| Escritorio WinForms | Web + PWAs | Menos TI; una versión. |
| SQL Server local del tenant | **Azure SQL** gestionado (multitenant compartido, DEC-110) | Sin DBA de cooperativa. |
| Agente 24/7 en un PC | Jobs en nube | Sin “la PC del Agente se apagó”. |
| Réplica MySQL CoopOnline | Eliminada | Saldo portal = saldo caja. |
| Perfiles = menú | Roles = acciones | Menos usuarios omnipotentes. |
| TeamViewer sin caso | Soporte ticket auditado | Trazabilidad. |
| Custom forms profundo | Vistas guardadas | Updates seguros. |

**No se pierde capacidad de negocio:** se cambia el **mecanismo** por uno mantenible a escala.

---

## 8. Por qué conviene pasarse en todos los aplicativos

| Área | Solo facturación migrada | Conjunto CoopApps |
|---|---|---|
| Socio | Portal desfasado | App con marca, pago y reclamo coherentes |
| Caja | Doble motor de intereses | M08 único |
| Técnica | Excel / papel | OT cierra stock y contrato |
| Compras | Fuera de sistema | Tres vías y contabilidad al día |
| Dirección | Tableros contradictorios | T10 certificado |
| Consejo | Actas y capital aparte | M17 integrado |

### 8.1 Plan de habilitación (olas O0–O11)

Resumen de `03-plan-de-olas-y-prompts.md` §1 — **qué puede usar la cooperativa en cada etapa**:

| Ola | Qué se habilita (hitos de negocio) | Relación con ProCoop |
|---|---|---|
| O0 | Fundaciones: login, menú, diccionario, auditoría base | Convive; solo pruebas internas |
| O1 | Alta cooperativa, roles, parámetros, migración base | Preparación piloto |
| O2 | Personas, catálogo, portal/landing, CRM solicitudes | Socio empieza a interactuar (Internet solicitado) |
| O3 | Técnica piloto, campo offline, stock serializado | Reemplaza parte de P-Móvil para piloto |
| O4 | Tarifas, facturación, ARCA, primera FE con CAE | Paralelo comercial posible (sin corte aún) |
| O5 | Cobranza, caja, pasarelas, tesorería/contabilidad núcleo | Pagos web en **mismo** saldo que caja |
| O6 | Mora, convenios, omnicanal | **Internet punta a punta** completo |
| O7 | Medidos (electridad, gas, agua), paralelo, **corte comercial piloto** | Sustituye ciclo comercial medido (DEC-089) |
| O8 | ERP administrativo completo | Compras/stock/contabilidad/sueldos import |
| O9 | Liquidación sueldos propia | Paralelo 2 períodos |
| O10 | Institucional, sociales, telefonía/TV ampliado | Reemplaza tablas + planes vivienda |
| O11 | BI, API terceros, corte **administrativo**, apagado ProCoop | Fin convivencia |

**172 prompts** de construcción; **4.213 RF** y **293 RNF** trazados al plan.

---

## 9. Integraciones externas

ProCoop concentra integraciones en código, tablas y el Agente (`integraciones-fichas.md`, RN-10). CoopApps las formaliza en **115 fichas** (T06) con patrones comunes.

| Familia | Ejemplos ProCoop (relevado) | CoopApps T06/M* | Tipo |
|---|---|---|---|
| Fiscal | ARCA, certificados en BD | M06 + jobs resilientes | ↑ |
| Cobranza | Red Link, SIRO, Pago Fácil, Pagos360, MP, DEBIN | M07 configurables | ↑ |
| Portal/pagos web | Firebase, MySQL, Integra | Eliminados como réplica; M19+M07 nativos | → |
| Telemedición / prepago | Múltiples DLL por marca | M03 adaptadores | ≡ |
| TIC aprovisionamiento | MikroTik, Radius, SmartOLT, Wispro… | M10 interfaz única | ↑ |
| Bancos | Interbanking, extractos | M14 conciliación asistida | ↑ |
| Mensajería | SMS, mail, WhatsApp disperso | T09 centro multicanal | ↑ |
| Reguladores | ERSeP, ENARGAS, ENACOM, informes | M06/M03 fichas | ≡ |
| Firma digital | Tablas FIRMA* | T11 proveedor configurable | ↑ |
| GIS | Exportadores por cooperativa | M10 mapas + impacto fallas | ↑ |
| BI | TABLAS_POWERBI | T10 + API O11 | ↑ |
| Hardware local | Impresoras, lectores | Agente local sin abrir puertos | ↑ |

**Principio CoopApps:** una falla externa **no** duplica cobros, **no** saltea numeración fiscal y **no** deja pagos en estado ambiguo sin bandeja “incierto”.

---

## 10. Principios que atraviesan todo el sistema

Reglas de negocio que ProCoop cumple **a veces** por parametrización opaca; en CoopApps están **escritas** y con casos de prueba.

| Principio | ProCoop (riesgo habitual) | CoopApps |
|---|---|---|
| Nada se borra | Anulaciones con menor trazabilidad | Anular/revertir con auditoría |
| Solicitar ≠ ejecutar | Alta desde web puede desincronizar | Bandejas de confirmación |
| Hecho confirmado | Corte/reconexión a veces solo administrativo | Confirmación campo/red/pasarela |
| Explicable | Difícil reconstruir tarifa antigua | M04 versionado + explicación renglón |
| Nunca dos veces | Reintentos Agente pueden duplicar | Idempotencia explícita |
| Separación funciones | Autorizaciones puntuales | T11 sistemático |
| Datos tarjeta fuera | Dependía de pasarela | Nunca PAN en tenant |
| Protecciones legales | Parametrizables sin candado | No desactivables (T12) |

**Casos difíciles ya resueltos en especificación** (muestra para reunión):

- Deuda cementerio no corta agua/luz (salvo config expresa).
- Electrodependiente acreditado no se corta.
- Gas: reconexión con inspección.
- Agua: reducción respeta mínimo vital.
- Telefonía en mora: salientes bloqueadas, emergencias no.
- Baja sin cargo ni exigir pago previo.
- Cambio titular no arrastra deuda.
- Convivientes no ven deuda ajena.
- Lectura imposible ≠ consumo cero.

---

## 11. Preguntas frecuentes de la cooperativa

| Pregunta | Respuesta basada en especificación |
|---|---|
| ¿Tenemos que apagar ProCoop de golpe? | No. Paralelo y olas; corte comercial piloto O7; administrativo O11. |
| ¿Perdemos personalización de grillas? | Cambia a vistas guardadas; menos frágil en actualizaciones. |
| ¿Los códigos de barras de facturas viejas siguen sirviendo? | Sí en transición (M07, T07). |
| ¿Qué pasa si nos vamos del proveedor SaaS? | Exportación completa tenant (T01). |
| ¿Podemos seguir con Power BI? | Sí vía exportaciones; API lectura O11 (o adelanto a decidir). |
| ¿P-Móvil deja de existir el día 1? | Se reemplaza por app campo en olas según área (piloto O3). |
| ¿Y si ARCA falla a mitad de facturación masiva? | Contingencia M06; lote pausable M05. |
| ¿Institucional queda afuera otra vez? | M17 en O10; antes hay registro mínimo asociado O2/O4. |
| ¿ProCoop tenía IA? | Tabla `AUDIT_IA` en legacy; en CoopApps IA supervisada explícita, apagable. |
| ¿Seguimos pudiendo operar sin internet en campo? | Sí; app offline M10 con sync supervisada. |

---

## 12. Checklist de tranquilidad

- [ ] **Menú actual:** 120/120 con destino (§3).
- [ ] **29 módulos DFA:** todos mapeados (§4.1).
- [ ] **Multiservicio y tasas terceros:** DEMO + M05/M06.
- [ ] **Socio paga y reclama:** M19 + M07 + M09; sin réplica MySQL (§2.2).
- [ ] **Mora normativa:** M08 + T12.
- [ ] **Migración sin big bang:** T07, olas §8.1.
- [ ] **Datos propios:** exportación + API (O11).
- [ ] **Novedades más allá del menú:** §6 (49 ítems).
- [ ] **Integraciones críticas piloto:** prepago web, SIRO, ARCA — fichas T06.
- [ ] **Detalle legal/técnico:** anexos M/T; 4.213 RF.
- [ ] **Roles del personal:** 40 plantillas ([roles y módulos](./roles-y-modulos-para-claude.md)).
- [ ] **Honestidad comercial:** §1.3 (no subestimar ProCoop).

---

## 13. Referencias para profundizar

| Documento | Uso |
|---|---|
| [dolores-procoop-antes-y-despues.md](./dolores-procoop-antes-y-despues.md) | Dolores P-001…P-020 |
| [alcance-especificacion-modulo-por-modulo.md](./alcance-especificacion-modulo-por-modulo.md) | Fichas M/T para presentación |
| [roles-y-modulos-para-claude.md](./roles-y-modulos-para-claude.md) | Rol × módulo × ProCoop |
| [documento-base-presentacion.md](./documento-base-presentacion.md) | Números y arquitectura |
| `procoop-relevamiento/README.md` | Menú DEMO |
| `procoop-relevamiento/definicion-funcional-alcance.md` | DFA 29 módulos |
| `procoop-relevamiento/integraciones-fichas.md` | CoopOnline, pasarelas, Agente |
| `procoop-relevamiento/reglas-negocio/10-integraciones-externas.md` | Detalle Firebase/MySQL |
| `docs/especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md` §22 | PC-001…PC-120 |
| `docs/especificacion/03-plan-de-olas-y-prompts.md` | Olas O0–O11 |
| `docs/alcance-funcional/GoodApps-Cooperativas-Alcance-Funcional.md` | Lenguaje usuario v2.0 |
| `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` | Marco rector |

---

## 14. Frase de cierre (presentación oral)

> **“No le pedimos a la cooperativa que renuncie a lo que ya funciona en ProCoop. Le proponemos lo mismo en profundidad —lo comprobamos función por función en 120 ítems de menú y 29 módulos de benchmark— en la nube, con el socio dentro del circuito sobre los mismos datos que ve caja, con reglas escritas para los casos difíciles y con un plan de migración por olas que no apaga la operación un viernes. Lo nuevo —marca, comunidad, institucional, datos exportables y API propia— es lo que hace rentable el cambio para la próxima década.”**