# CoopApps — Imágenes exhaustivas: ProCoop (Hoy) vs CoopApps (Con)

> **Obsoleto para generar slides:** las tablas usaban códigos `M16`/`T04`. Usá la megaspec en lenguaje humano [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md) y el prompt **IMG-F** en [`comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`](./comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md).

Catálogo para generar **muchas** diapositivas de comparación funcional **fila por fila**. Cada imagen es una tabla de dos columnas con el **cambio concreto** (no marketing vacío).

| Dato | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Fuente | `comparativo-funcional-procoop-vs-coopapps.md` v1.1 (§2–§6, §3 menú PC-001…120) |
| Códigos de imagen | **IMG-V00** … **IMG-V35** (36 diapositivas de comparación) |
| Formato | HTML+SVG **1920×1080**, tabla legible; máximo **9 filas** por slide |

---

## 0. Prompt maestro (pegar una vez en Claude)

Adjuntá este archivo completo + `comparativo-funcional-procoop-vs-coopapps.md` (opcional pero recomendado).

**Sin adjuntos (solo menú PC):** [`comparativo-funcional-imagenes-exhaustivas-PROMPT-V10-V25-CLAUDE.md`](./comparativo-funcional-imagenes-exhaustivas-PROMPT-V10-V25-CLAUDE.md) — bloque autocontenido IMG-V10…V25.

```text
Sos diseñador de slides ejecutivas para cooperativas de servicios de Argentina.

OBJETIVO: comparación EXHAUSTIVA función por función entre ProCoop (columna "Hoy") y CoopApps (columna "Con CoopApps"). Cada fila debe mostrar QUÉ TIENE cada lado y, si entra, una columna o etiqueta "Cambio" con: Igual · Mejor · Nuevo · Distinto modelo.

REGLAS DE LAYOUT (OBLIGATORIO EN TODAS LAS IMG-V)
1. Encabezado de slide: título + subtítulo con rango (ej. "Menú ProCoop — Consumos · PC-008 a PC-012").
2. Tabla de 4 columnas: Función | Hoy (ProCoop) | Con CoopApps | Cambio
3. Columna "Hoy": gris #6B7280 sobre fondo #F3F4F6.
4. Columna "Con CoopApps": texto #1F2937; destacar mejoras con borde o ícono verde #2E7D32.
5. Columna "Cambio": solo estas etiquetas (texto, no solo color): Igual | Mejor | Nuevo | Modelo distinto | No aplica al socio
6. Pie: "Fuente: relevamiento menú ProCoop DEMO + especificación CoopApps"
7. HTML+SVG 1920×1080; fuente mínima 16px en celdas; si hay más de 9 filas, NO generar: avisar que falta otra slide.
8. Usá SOLO filas del catálogo IMG-V que pida. No inventes funciones.
9. Español Argentina; ProCoop con respeto; sin adjetivos vacíos.

LEYENDA CAMBIO (mapeo interno del catálogo):
- Igual ≈ tipo ≡
- Mejor ≈ tipo ↑
- Nuevo ≈ tipo +
- Modelo distinto ≈ tipo →
- "—" en ProCoop = no lo opera el usuario (infraestructura SaaS)

Cuando escriba "Generá IMG-V15", buscá la sección ## IMG-V15 en el archivo adjunto y renderizá TODAS sus filas.

Confirmá y esperá el primer código (sugerido: IMG-V00, luego IMG-V11 en adelante).
```

---

## 0.1 Orden de generación sugerido (36 imágenes)

| Bloque | Códigos | Qué cubre |
|---|---|---|
| Apertura | V00–V02 | Portada, leyenda, resumen 119/120 |
| Plataforma | V03–V09 | Nube, portal, seguridad, parámetros, integraciones, comunidad, migración |
| Menú completo | V10–V23 | **Las 120 funciones** del menú relevado |
| Módulos | V24–V28 | M01–M19 y T01–T12 resumidos |
| Servicios + cierre | V29–V35 | 17 familias, solo CoopApps, checklist |

---

## IMG-V00 — Portada del bloque exhaustivo

**Título:** ProCoop y CoopApps: comparación función por función  
**Subtítulo:** 120 ítems del menú relevado · 17 servicios · 8 aplicaciones  
**Sin tabla.**

---

## IMG-V01 — Cómo leer el cambio

**Título:** Qué significa cada columna

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Etiqueta **Igual** | La cooperativa hace lo mismo | Mismo negocio, otra pantalla u organización | Igual |
| Etiqueta **Mejor** | Lo hace hoy | Mismo negocio + controles, trazas o canales | Mejor |
| Etiqueta **Nuevo** | No está en el menú escritorio | Capacidad nueva en especificación | Nuevo |
| Etiqueta **Modelo distinto** | Mecanismo viejo (ej. backup manual) | Mecanismo SaaS (backup plataforma) | Modelo distinto |

---

## IMG-V02 — Resumen de cobertura del menú

**Título:** Menú ProCoop relevado: cobertura en CoopApps

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Funciones catalogadas en menú DEMO | 120 ítems en 9 pestañas | 119 con destino funcional definido | Mejor |
| Absorbidas (mismo propósito) | — | 112 | Igual+ |
| Reemplazadas (mejor mecanismo) | — | 7 | Modelo distinto |
| Sin equivalente para el usuario | Administrar base de datos local | Infraestructura del proveedor SaaS | Modelo distinto |
| Sin hueco en especificación | — | 0 ítems sin destino | Mejor |

**Número grande en slide:** **119 / 120**

---

## IMG-V03 — Plataforma y despliegue

**Título:** Cómo se usa el sistema

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Instalación | ProCoop.exe en cada PC | Navegador + apps web/PWA | Modelo distinto |
| Actualizaciones | Actualizar en cada equipo | Una versión para todos (SaaS) | Modelo distinto |
| Servidores | Servidor/SQL de la cooperativa | Sin servidores propios del tenant | Modelo distinto |
| Copias de seguridad | Menú Copia de Seguridad (usuario) | Backup diario por cooperativa (plataforma) | Modelo distinto |
| Agente de sincronización | Agente Procoop.exe (portal, FE, etc.) | Jobs en nube; sin réplica MySQL | Mejor |
| Ambiente de prueba | Base demo o copia manual | Sandbox por cooperativa (T01) | Nuevo |
| Exportación si se va del proveedor | Backup SQL a mano | Exportación completa del tenant | Nuevo |

---

## IMG-V04 — Portal, app del socio y campo

**Título:** Canales digitales: dato único

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Portal del socio (CoopOnline) | Copia a MySQL externa; desfasaje posible | Misma base que caja y facturación | Mejor |
| Pagos web | Firebase + Agente; confirmación indirecta | Pago confirmado en M07 antes de imputar | Mejor |
| Marca en app del socio | Web genérica del proveedor | Logo, colores, dominio, PWA propia (T03/M19) | Mejor |
| App móvil socio | Funciones limitadas sobre copia | Ciclo: contratar, pagar, reclamar, baja | Mejor |
| P-Móvil (campo) | Sincronización sobre réplica | Una app offline: técnico, lecturista, cobrador | Mejor |
| Consultar deuda en portal vs caja | Puede no coincidir | Un solo saldo | Mejor |
| Tótem / turno web | Turnero parcial en escritorio | Turnero + fila virtual + tótem (M09/M19) | Mejor |

---

## IMG-V05 — Seguridad, usuarios y permisos

**Título:** Quién entra y qué puede hacer

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Usuarios | ABM usuarios (Configuración) | ABM + 2FA / passkeys (T02) | Mejor |
| Perfiles | Permiso por menú y tabla | Rol por acción + perfil de pantallas | Modelo distinto |
| Auditoría | Login y cambios | Auditoría encadenada con antes/después | Mejor |
| Contraseñas | Evidencia de débil reversibilidad en código | Hash, políticas, sin contraseña maestra | Mejor |
| Aprobaciones sensibles | Autorización de operaciones puntual | Circuitos T11 (quien crea no aprueba) | Mejor |
| Roles de partida | Perfiles hechos a mano por cooperativa | 40 plantillas ajustables | Mejor |
| Soporte remoto | TeamViewer sin caso en sistema | Caso SUP + acceso temporal auditado | Nuevo |

---

## IMG-V06 — Parámetros y configuración

**Título:** Cómo se configura el negocio

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Parámetros | ~1.536 claves numéricas | ~2.490 con nombre, tipo, vigencia | Mejor |
| Tablas del sistema | Pantallas por dominio | T04 versionado + simulación antes de publicar | Mejor |
| Credenciales bancos/pasarelas | En programa o tablas locales | Bóveda de solo escritura | Mejor |
| Personalización grillas | Forms WinForms custom | Vistas guardadas (no rompe updates) | Modelo distinto |
| Vocabulario (socio/asociado) | Textos fijos | Diccionario por cooperativa (T03) | Nuevo |
| Búsqueda de función | Menú ribbon | Buscar por nombre equivalente ProCoop | Nuevo |

---

## IMG-V07 — Integraciones, datos y API

**Título:** Bancos, ARCA, entes y datos propios

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Ficha de integraciones | Dispersas en código (~23) | 115 fichas con patrón común (T06) | Mejor |
| Reintentos cobro / CAE | Riesgo de duplicar si falla red | Estado "incierto"; consulta antes de repetir | Mejor |
| API para la cooperativa | WS_KEYS, Integra, Power BI | API documentada plan **O11**; antes exportaciones | Mejor |
| Datos para BI propio | Tablas Power BI | Reportes certificados + misma cifra en tablero | Mejor |
| Exportación completa | Backup local | Exportación tenant (T01/T10) | Mejor |
| Hardware local (impresoras) | Acople directo PC | Agente local sin abrir puertos | Mejor |

---

## IMG-V08 — Comunicaciones e institucional

**Título:** Más allá del escritorio

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| SMS | Herramientas > SMS | Centro multicanal T09 (mail, WhatsApp, push) | Mejor |
| Muro / encuestas / campañas | No como módulo de menú | T09 completo | Nuevo |
| Aviso corte por zona | Manual / masivo amplio | Solo afectados por zona | Nuevo |
| Institucional (asambleas, capital) | Tablas sin menú dedicado | M17: libro, asamblea, actas, INAES | Mejor |
| Comunidad NPS en factura | No | Encuesta NPS en factura (T09) | Nuevo |
| Asistente WhatsApp socio | Limitado vía integraciones | M09 con verificación de identidad | Nuevo |

---

## IMG-V09 — Migración y convivencia

**Título:** Pasar sin apagar un viernes

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Estrategia de corte | Suele ser big bang | Olas O0–O11; convivencia | Mejor |
| Paralelo comercial | Manual / a criterio | Factura a factura; 2 ciclos conciliados | Mejor |
| Código de barras facturas viejas | Vigente en papel | Aceptados en transición (M07/T07) | Mejor |
| Corte comercial piloto | — | Ola O7 (DEC-089) | Nuevo |
| Apagado administrativo ProCoop | — | Ola O11 | Nuevo |
| Contabilidad en convivencia | Un solo sistema | Contabilidad paralela hasta cierre (M15) | Nuevo |

---

## IMG-V10 — Inicio de sesión (PC-001 a PC-004)

**Título:** Al abrir ProCoop

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-001 Alerta FE pendientes | Modal bloqueante al inicio | Banner + centro de alertas | Mejor |
| PC-002 Grilla FE pendientes | Pantalla aparte con exportar | Bandeja en flujo fiscal / lotes (M06) | Igual |
| PC-003 Centro notificaciones | Pantalla principal | Inicio + AlertCenter | Igual |
| PC-004 Noticias producto | Noticias ProCoop | Novedades versión + avisos cooperativa (T09) | Modelo distinto |

---

## IMG-V11 — Servicios a Titulares: Titulares (PC-005 a PC-007)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-005 Administración Titulares | Ficha titular, cuentas, servicios | M01 ficha integral + línea de tiempo | Mejor |
| PC-006 Administración Personas | Personas separadas de titulares | M01 identidad única, antiduplicado | Mejor |
| PC-007 Consultas e informes titulares | Listados e informes | M01 + T10 con drill-down a documento | Igual |

---

## IMG-V12 — Consumos (PC-008 a PC-012)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-008 Registro de lectura | Carga manual / correcto | M03 + campo: foto, offline, excepciones | Mejor |
| PC-009 Telemed | Telemed ST y Operaciones | M03 telemedición unificada | Igual |
| PC-010 Opciones de consumos | Validación y estimados | Reglas: 3er estimado → inspección | Mejor |
| PC-011 Opciones de telefonía | Tasación / consumos telco | Ficha telefonía T12 / M03 | Igual |
| PC-012 Informes de consumos | Informes | T10 + M03 | Igual |

---

## IMG-V13 — Ventas y facturación (PC-013 a PC-018)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-013 Presupuestos | Presupuestos venta | M11: aceptación online → OT | Mejor |
| PC-014 Venta de productos | POS / venta productos | M11 punto de venta | Igual |
| PC-015 Facturación | Emisión masiva (~12,5k/comp en DEMO) | M05 lotes, prefactura, excepciones, multiservicio | Mejor |
| PC-016 Informes ventas y facturación | Informes | T10 | Igual |
| PC-017 Libro IVA ventas | Libro IVA | M06 libro digital, Mis Comprobantes | Mejor |
| PC-018 Movimiento de conceptos | Movimiento conceptos | M05 / M04 | Igual |

---

## IMG-V14 — Cobranza (PC-019 a PC-023)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-019 Apertura de caja | Apertura caja | M07 | Igual |
| PC-020 Cobranza local | Cobro en mostrador | M07: QR, medios mixtos, sin PAN | Mejor |
| PC-021 Opciones de cobranza | Parámetros cobro, entes | M07 + pasarelas, débito, conciliación | Mejor |
| PC-022 Informes de cobranzas | Informes | T10 | Igual |
| PC-023 Configuración ST | Subconfig titulares/cobro | T04 parámetros con nombre y vigencia | Mejor |

---

## IMG-V15 — Crédito y mora (PC-024 a PC-033)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-024 Emitir plan financiación | Planes de financiación | M08: CFT visible, firma portal | Mejor |
| PC-025 Informes financiaciones | Informes | T10 | Igual |
| PC-026 Generar notificaciones 1ª | Notificaciones mora | M08 + constancia de entrega | Mejor |
| PC-027 Tratamiento notificaciones | Bandeja notificaciones | M08 | Igual |
| PC-028 Tratamiento morosos | Gestión morosos | M08 motor único de intereses | Mejor |
| PC-029 Notificaciones mora | Comunicaciones mora | M08 + T09 multicanal | Mejor |
| PC-030 Causas de baja | Tabla causas | M02 / M08 | Igual |
| PC-031 Instancias de mora | Config instancias | M08: no ejecuta corte solo | Mejor |
| PC-032 Excepciones de mora | Excepciones | M08: electro, ventanas legales | Mejor |

*(Nota: PC-033 Informes mora va en IMG-V16 primera fila)*

---

## IMG-V16 — Mora (cierre) y Operaciones (PC-033 a PC-040)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-033 Informes de mora | Informes | T10 | Igual |
| PC-034 Factibilidades | Operaciones > Técnica | M10 vigencia 90 días, cobertura red | Mejor |
| PC-035 Órdenes de trabajo | Órdenes | M10 + campo; estado visible al socio | Mejor |
| PC-036 Carga rápida reclamos | Reclamos rápidos | M09 expediente, plazos, incidente común | Mejor |
| PC-037 Informes técnica | Informes | T10 | Igual |
| PC-038 Telemed administración | Operaciones > Telemed | M03 unificado | Igual |
| PC-039 Telemed informes | Informes telemed | M03 / T10 | Igual |
| PC-040 Telemed configuración | Config telemed | M03 + T04 | Igual |

---

## IMG-V17 — Planes vivienda y Compras (PC-041 a PC-050)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-041 Vivienda materiales | Operaciones > Vivienda | M18 vales y etapas | Mejor |
| PC-042 Vivienda construcción | Construcción vivienda | M18 | Mejor |
| PC-043 Vivienda informes | Informes | T10 | Igual |
| PC-044 Solicitudes aprovisionamiento | Compras | M12 circuito formal | Mejor |
| PC-045 Solicitudes cotización | Cotizaciones | M12 | Igual |
| PC-046 Órdenes de compra | OC | M12 | Igual |
| PC-047 Remitos | Remitos | M12 | Igual |
| PC-048 Comprobantes proveedores | Facturas compra | M12: tres vías; IA → borrador | Mejor |
| PC-049 Pago a proveedores | Pagos | M12+M14: bloqueo si excepción | Mejor |

---

## IMG-V18 — Stock e informes compras (PC-050 a PC-060)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-050 Retenciones compras | Retenciones | M12 + M06 | Igual |
| PC-051 Stock movimientos | Movimientos stock | M13 custodia cuadrilla | Mejor |
| PC-052 Trazabilidad | Trazabilidad | M13 serie única (módem, ONU) | Mejor |
| PC-053 Operaciones especiales stock | Op. especiales | M13 | Igual |
| PC-054 Bienes de uso | Bienes de uso | M13 | Igual |
| PC-055 Fabricación | Fabricación | M13 | Igual |
| PC-056 RMA | RMA | M13 | Igual |
| PC-057 Informes compras | Informes | T10 / M12 | Igual |
| PC-058 Informes stock | Informes | T10 / M13 | Igual |

---

## IMG-V19 — Fiscal compras e informes (PC-059 a PC-070)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-059 Libro IVA compras | En menú compras | M06 fiscal | Igual |
| PC-060 Informes correspondencia | Correspondencia | T10 / M12 | Igual |
| PC-061 Movimientos bancarios | Tesorería bancos | M14 conciliación asistida | Mejor |
| PC-062 Cuentas propias | Cuentas | M14 | Igual |
| PC-063 Movimientos tesorería | Movimientos | M14: tránsito ≠ disponible | Mejor |
| PC-064 Valores de terceros | Valores terceros | M14 | Igual |
| PC-065 Cheques propios | Cheques | M14 cheques electrónicos | Mejor |
| PC-066 Cupones tarjetas | Cupones | M14 | Igual |
| PC-067 Retenciones recibidas | Retenciones | M14 | Igual |

---

## IMG-V20 — Tesorería cierre y Sueldos inicio (PC-068 a PC-076)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-068 Cajas pagos proveedores | Cajas pagos | M14 | Igual |
| PC-069 Cierre de cajas | Cierre cajas | M14 | Igual |
| PC-070 Informes tesorería | Informes | T10 | Igual |
| PC-071 Empleados | Sueldos > Empleados | M16 | Igual |
| PC-072 Empresas | Empresas empleadoras | M16 | Igual |
| PC-073 Recibos | Recibos impresos | M16 + portal empleado, firma | Mejor |
| PC-074 Liquidación masiva | Liquidación | M16: quien calcula no aprueba | Mejor |
| PC-075 Simulador | Simulador | M16 | Igual |
| PC-076 Ganancias 4ta cat. | Ganancias | M16 | Igual |

---

## IMG-V21 — Sueldos config y Contabilidad (PC-077 a PC-088)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-077 Variables sueldos | Variables | M16 / T04 | Igual |
| PC-078 Conceptos | Conceptos | M16 | Igual |
| PC-079 Aplicar aumentos | Aumentos | M16 | Igual |
| PC-080 Informes sueldos | Informes | T10 | Igual |
| PC-081 Libro sueldo digital | Deshabilitado en DEMO | M16 LSD habilitado | Mejor |
| PC-082 Asientos | Contabilidad manual/auto | M15 asientos desde operaciones | Mejor |
| PC-083 Consultar mayor | Mayor | M15 | Igual |
| PC-084 Balance / S&S | Estados | M15 | Igual |
| PC-085 Asientos automáticos | Automáticos | M15 una vez por operación | Mejor |

---

## IMG-V22 — Contabilidad cierre y Herramientas (PC-086 a PC-098)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-086 Herramientas contables | Utilidades | M15 | Igual |
| PC-087 Informes contables | Informes | T10 | Igual |
| PC-088 Informes de gestión | Gestión | T10 | Igual |
| — Contabilidad paralela | No | M15 convivencia con ProCoop | Nuevo |
| PC-089 Actividades seguimiento | Actividades | T11 | Igual |
| PC-090 Actividades informe | Informe actividades | T10 | Igual |
| PC-091 SMS | SMS aislado | T09 multicanal | Mejor |
| PC-092 Tablero de control | Tablero | T10 indicadores certificados | Mejor |
| PC-093 Traslados viajes | Traslados | M18 flota integrada | Mejor |

---

## IMG-V23 — Herramientas atención (PC-094 a PC-101)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-094 Traslados informes | Informes | T10 | Igual |
| PC-095 Turnero box | Box | M09 | Igual |
| PC-096 Turnero | Turnero presencial | M09 + turno online (M19) | Mejor |
| PC-097 Selección turnos | Selección | M09 + tótem | Mejor |
| PC-098 Estadísticas turnero | Estadísticas | T10 | Igual |
| PC-099 Mesa entradas adm. | Mesa entradas | M09 CRM unificado | Mejor |
| PC-100 Mesa entradas incidentes | Incidentes | M09 + plazos / incidente masivo | Mejor |
| PC-101 Mesa entradas informes | Informes | T10 | Igual |

---

## IMG-V24 — Configuración (PC-102 a PC-120)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-102 Usuarios | Usuarios | T02 + 2FA | Mejor |
| PC-103 Perfiles | Menú + tablas | Roles + pantallas (T02) | Modelo distinto |
| PC-104 Auditoría logueo | Auditoría login | T02 auditoría datos completa | Mejor |
| PC-105 Copia seguridad | Manual usuario | T01 backup SaaS + exportación | Modelo distinto |
| PC-106 Base de datos | Menú (a veces off) | — (infra proveedor) | Modelo distinto |
| PC-107 Actualizar | Actualizar.exe | Release continuo SaaS | Modelo distinto |
| PC-108 Tablas del sistema | Tablas dominio | T04 disperso + "en uso por" | Mejor |
| PC-109 Parámetros sistema | Numéricos | T04 nombrados, vigencia | Mejor |

---

## IMG-V25 — Configuración WEB y reportes (PC-110 a PC-120)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| PC-110 Parámetros externos | Parámetros ext. | T04 bóveda | Mejor |
| PC-111 Autorización operaciones | Supervisor puntual | T11 circuitos | Mejor |
| PC-112 WEB requisitos y trámites | Procoop WEB | M19 + M02 + bandeja M09 | Mejor |
| PC-113 WEB archivos | Archivos web | M19 | Igual |
| PC-114 WEB operaciones | Pagos web config | M19 + M07 confirmación real | Mejor |
| PC-115 Logos facturas WEB | Logos PDF web | T03 marca todos los canales | Mejor |
| PC-116 Editor reportes | Editor | T10 | Igual |
| PC-117 Informes personalizados | Informes pers. | T10 jobs en background | Mejor |
| PC-118 Procesos personalizados | Procesos | T10 / T11 | Mejor |
| PC-119 Exportar listados | Exportar grillas | T03 ExportMenu universal | Igual |
| PC-120 Personalización forms | Forms custom | T03 vistas guardadas | Modelo distinto |

---

## IMG-V26 — Módulos: socios, catálogo, medición (M01–M03)

**Título:** Bloque socios y medición

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Personas y titulares (~104 forms INV) | Titulares + personas | M01 identidad, privacidad convivientes | Mejor |
| Catálogo y contratos | Tablas + fichas servicio | M02 17 familias versionadas | Mejor |
| Copiar config otro servicio/cooperativa | Manual / consultoría | M02 copia asistida componentes | Nuevo |
| Lecturas y telemed | Consumos + Telemed menús | M03 trazabilidad hasta factura | Mejor |
| Autolectura socio | Limitada portal copia | M03 + M19 con foto | Mejor |

---

## IMG-V27 — Ciclo económico (M04–M08)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Tarifas y motor | Cuadros tablas | M04 explicación por renglón, simulador | Mejor |
| Facturación masiva | Ventas y facturación | M05 lotes, universo congelado, acta | Mejor |
| Fiscal ARCA | Libro IVA + tablas | M06 contingencia, certificados con aviso | Mejor |
| Cobranza y caja | Cobranza ~90 forms | M07 pasarelas, sin PAN, conciliación | Mejor |
| Mora y corte | Crédito y mora | M08 corte confirmado, un motor intereses | Mejor |
| Convenios en portal | Parcial web | M08 firma plan en portal | Mejor |

---

## IMG-V28 — Atención, técnica, compras (M09–M13)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| CRM y reclamos | Mesa + carga rápida | M09 omnicanal, incidente común | Mejor |
| Órdenes y campo | Operaciones técnica | M10 app offline + mapa | Mejor |
| Ventas / presupuestos | Presupuestos menú | M11 expediente hasta factura | Mejor |
| Compras proveedores | Gestión compras | M12 portal proveedor, anti-fraude CBU | Mejor |
| Stock series | Stock / trazabilidad | M13 equipo en domicilio por serie | Mejor |

---

## IMG-V29 — Administración y portal (M14–M19)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Tesorería | Tesorería menú | M14 flujo de fondos proyectado | Mejor |
| Contabilidad | Contabilidad | M15 asiento automático, paralela | Mejor |
| Sueldos | Sueldos | M16 LSD, 2 meses paralelos | Mejor |
| Institucional | Tablas dispersas | M17 asamblea, capital, actas | Mejor |
| Social / flota | Vivienda + traslados | M18 sepelio, cementerio, flota | Mejor |
| Portal socio | CoopOnline + WEB | M19 marca, baja 24/72h, WCAG | Mejor |

---

## IMG-V30 — Transversales T01–T06 (plataforma a integraciones)

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Plataforma SaaS | No existe como producto | T01 alta asistida, sandbox, soporte | Nuevo |
| IAM / auditoría | Config usuarios | T02 completo | Mejor |
| Marca y UX | Logos WEB | T03 558 ítems menú, búsqueda ProCoop | Mejor |
| Config versionada | Parámetros | T04 simulación publicación | Mejor |
| Modelo datos | 659 tablas CAT | T05 dueño único por dato | Mejor |
| Integraciones | Código disperso | T06 115 fichas, bóveda | Mejor |

---

## IMG-V31 — Transversales T07–T12

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Migración T07 | A criterio | Paralelo, idempotente, T07 | Nuevo |
| NFR seguridad T08 | Implícito | SLA, OWASP, Ley 25.326 | Nuevo |
| Comunidad T09 | SMS | Muro, encuestas, campañas | Nuevo |
| BI / API T10 | Informes + Power BI | Indicadores certificados; API O11 | Mejor |
| Workflow T11 | Autorizaciones | Expediente, firma, documentos | Mejor |
| Fichas servicio T12 | Implícito tablas | 17 recorridos controlados | Nuevo |

---

## IMG-V32 — 17 servicios (parte 1)

**Título:** Servicios medidos y redes

| Servicio | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Electricidad | Sí (DEMO) | T12: electro, GD, ventanas corte | Mejor |
| Gas | Sí | T12: reconexión con inspección | Mejor |
| Agua | Sí | T12: mínimo vital | Mejor |
| Cloacas | Sí | T12: no solo por tener agua | Mejor |
| Internet / TV / Tel | Tablas + técnica | T12 + aprovisionamiento red | Mejor |
| Alumbrado público | Sí en factura | Bloque separado, rendición | Igual |
| Obras / contribución | Sí | Cuotas con ajuste última | Igual |

---

## IMG-V33 — 17 servicios (parte 2)

**Título:** Servicios sociales e institucionales

| Servicio | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Sepelio | Tablas | M18: urgencia no bloqueada por deuda | Mejor |
| Cementerio parque | Tablas | M18: mora no libera unidad | Mejor |
| Vivienda | Menú planes | M18 etapas y vales | Mejor |
| Capital social | Tablas | M17 + factura integración al pago | Mejor |
| Salud / ambulancias / sangre | Tablas | M18 administrativo sin clínica | Mejor |
| Tasas terceros | En comprobante DEMO | Bloque separado, rendición | Igual |
| Otros (ortopedia, etc.) | Parcial | M02 configurable | Mejor |

---

## IMG-V34 — Solo en CoopApps (no es ítem de menú escritorio)

**Título:** Qué gana la cooperativa aunque no tenga botón en ProCoop

| Función | Hoy (ProCoop) | Con CoopApps | Cambio |
|---|---|---|---|
| Landing pública por bloques | Web genérica | M19 dominio propio | Nuevo |
| Asamblea con quórum en vivo | Manual / actas aparte | M17 credencial QR | Nuevo |
| Incidente masivo único | Reclamos duplicados | M09 un incidente, N socios | Nuevo |
| Bóveda credenciales | En programa | T04/T06 | Nuevo |
| Indicador mismo valor en Excel y tablero | Varias fuentes | T10 certificado | Nuevo |
| Caso soporte auditado | TeamViewer | T01 SUP numerado | Nuevo |
| Prepago web conciliado con campo | Agente + Firebase | M07 confirmación | Mejor |

---

## IMG-V35 — Cierre: qué validar

**Título:** Si pasamos a CoopApps, esto queda cubierto

Checklist visual (6 ítems con Ícono ✓):

1. Menú relevado: **119/120**  
2. Multiservicio y tasas en factura (como DEMO)  
3. Socio: pagar y reclamar en app con **marca propia**  
4. Mora con **reglas normativas** escritas (T12)  
5. Migración **por olas**, no big bang  
6. **Exportación** de datos de la cooperativa  

---

## 1. Instrucciones para el humano

1. Pegá el **prompt maestro §0** en Claude con este archivo adjunto.
2. Generá en orden **IMG-V00** → **IMG-V35** (una por mensaje; son 36 PNG).
3. Si una tabla se ve ilegible, pedí dividir esa V en V-a / V-b (máx. 7 filas).
4. Uní las imágenes en PowerPoint en el orden §0.1; el bloque **V10–V25** es la prueba exhaustiva del menú.

**Relación con IMG-C:** las IMG-C son resumen ejecutivo; las **IMG-V** son el comparativo detallado que pediste. Podés usar C al inicio y V como cuerpo de la reunión técnica/comité.