# Prompt autocontenido para Claude — imágenes IMG-V10 a IMG-V25 (menú 120 funciones)

> **Reemplazado:** este prompt embebía códigos M/T. Usá [`comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`](./comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md) + [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md).

**Uso:** copiar todo el bloque ` ```text ` de la sección 1 y pegarlo en Claude **sin adjuntar** otros archivos.  
**Cubre:** las **120 funciones** del menú relevado (PC-001…PC-120) en **16 slides** de tabla comparativa.

Catálogo completo (V00–V35): [`comparativo-funcional-imagenes-exhaustivas-hoy-vs-coopapps.md`](./comparativo-funcional-imagenes-exhaustivas-hoy-vs-coopapps.md)

---

## 1. Bloque para pegar en Claude

```text
Sos diseñador de slides ejecutivas (1920×1080, 16:9) para cooperativas de servicios de Argentina.
Comparación EXHAUSTIVA: columna "Hoy (ProCoop)" vs "Con CoopApps". Producto destino: CoopApps (SaaS). Referencia: ProCoop escritorio.

Este mensaje incluye REGLAS + CONTENIDO de IMG-V10…V25. Usá SOLO las filas de la slide que pida. No inventes funciones ni códigos PC.

=== REGLAS DE LAYOUT (OBLIGATORIO) ===
1. Encabezado: título + subtítulo con rango (ej. "Menú ProCoop — Consumos · PC-008 a PC-012").
2. Tabla 4 columnas: Función | Hoy (ProCoop) | Con CoopApps | Cambio
3. "Hoy": fondo celda #F3F4F6, texto #6B7280.
4. "Con CoopApps": texto #1F2937; mejoras con acento verde #2E7D32 (borde, ícono o viñeta).
5. "Cambio": solo estas etiquetas visibles: Igual | Mejor | Nuevo | Modelo distinto | No aplica al socio
6. Pie fijo: "Fuente: relevamiento menú ProCoop DEMO + especificación CoopApps"
7. Artefacto HTML+SVG 1920×1080; fuente mínima 16px en celdas; sans (Inter).
8. Máximo 9 filas por slide (este catálogo ya respeta eso). Renderizá TODAS las filas de la slide pedida.
9. Español Argentina; ProCoop con respeto; sin marketing vacío.
10. Tras cada slide, en chat: 2–3 líneas "Para gerencia" + lista de códigos PC usados.

=== NÚMEROS AUTORIZADOS (opcional en pie secundario) ===
- Menú relevado: 120 funciones; con destino en CoopApps: 119 (112 absorbidas, 7 reemplazadas, 1 infra BD, 0 sin destino).
- Facturación DEMO referencia volumen: ~12.500 comprobantes por emisión mensual (solo si mencionás PC-015).

=== CATÁLOGO IMG-V10…V25 (generá solo la que pida; si pido "V10 al V25", una por mensaje) ===

--- IMG-V10 ---
Título: Al abrir ProCoop
Subtítulo: Inicio de sesión · PC-001 a PC-004
FILAS:
PC-001 Alerta FE pendientes | Modal bloqueante al inicio | Banner + centro de alertas | Mejor
PC-002 Grilla FE pendientes | Pantalla aparte con exportar | Bandeja en flujo fiscal / lotes (M06) | Igual
PC-003 Centro notificaciones | Pantalla principal | Inicio + AlertCenter | Igual
PC-004 Noticias producto | Noticias ProCoop | Novedades versión + avisos cooperativa (T09) | Modelo distinto

--- IMG-V11 ---
Título: Servicios a Titulares — Titulares
Subtítulo: PC-005 a PC-007
FILAS:
PC-005 Administración Titulares | Ficha titular, cuentas, servicios | M01 ficha integral + línea de tiempo | Mejor
PC-006 Administración Personas | Personas separadas de titulares | M01 identidad única, antiduplicado | Mejor
PC-007 Consultas e informes titulares | Listados e informes | M01 + T10 con drill-down a documento | Igual

--- IMG-V12 ---
Título: Consumos
Subtítulo: PC-008 a PC-012
FILAS:
PC-008 Registro de lectura | Carga manual / correcto | M03 + campo: foto, offline, excepciones | Mejor
PC-009 Telemed | Telemed ST y Operaciones | M03 telemedición unificada | Igual
PC-010 Opciones de consumos | Validación y estimados | Reglas: 3er estimado → inspección | Mejor
PC-011 Opciones de telefonía | Tasación / consumos telco | Ficha telefonía T12 / M03 | Igual
PC-012 Informes de consumos | Informes | T10 + M03 | Igual

--- IMG-V13 ---
Título: Ventas y facturación
Subtítulo: PC-013 a PC-018
FILAS:
PC-013 Presupuestos | Presupuestos venta | M11: aceptación online → OT | Mejor
PC-014 Venta de productos | POS / venta productos | M11 punto de venta | Igual
PC-015 Facturación | Emisión masiva (~12,5k/comp en DEMO) | M05 lotes, prefactura, excepciones, multiservicio | Mejor
PC-016 Informes ventas y facturación | Informes | T10 | Igual
PC-017 Libro IVA ventas | Libro IVA | M06 libro digital, Mis Comprobantes | Mejor
PC-018 Movimiento de conceptos | Movimiento conceptos | M05 / M04 | Igual

--- IMG-V14 ---
Título: Cobranza
Subtítulo: PC-019 a PC-023
FILAS:
PC-019 Apertura de caja | Apertura caja | M07 | Igual
PC-020 Cobranza local | Cobro en mostrador | M07: QR, medios mixtos, sin PAN | Mejor
PC-021 Opciones de cobranza | Parámetros cobro, entes | M07 + pasarelas, débito, conciliación | Mejor
PC-022 Informes de cobranzas | Informes | T10 | Igual
PC-023 Configuración ST | Subconfig titulares/cobro | T04 parámetros con nombre y vigencia | Mejor

--- IMG-V15 ---
Título: Crédito y mora
Subtítulo: PC-024 a PC-032
FILAS:
PC-024 Emitir plan financiación | Planes de financiación | M08: CFT visible, firma portal | Mejor
PC-025 Informes financiaciones | Informes | T10 | Igual
PC-026 Generar notificaciones 1ª | Notificaciones mora | M08 + constancia de entrega | Mejor
PC-027 Tratamiento notificaciones | Bandeja notificaciones | M08 | Igual
PC-028 Tratamiento morosos | Gestión morosos | M08 motor único de intereses | Mejor
PC-029 Notificaciones mora | Comunicaciones mora | M08 + T09 multicanal | Mejor
PC-030 Causas de baja | Tabla causas | M02 / M08 | Igual
PC-031 Instancias de mora | Config instancias | M08: no ejecuta corte solo | Mejor
PC-032 Excepciones de mora | Excepciones | M08: electro, ventanas legales | Mejor
(Nota: PC-033 Informes mora es primera fila de IMG-V16)

--- IMG-V16 ---
Título: Mora (cierre) y Operaciones
Subtítulo: PC-033 a PC-040
FILAS:
PC-033 Informes de mora | Informes | T10 | Igual
PC-034 Factibilidades | Operaciones > Técnica | M10 vigencia 90 días, cobertura red | Mejor
PC-035 Órdenes de trabajo | Órdenes | M10 + campo; estado visible al socio | Mejor
PC-036 Carga rápida reclamos | Reclamos rápidos | M09 expediente, plazos, incidente común | Mejor
PC-037 Informes técnica | Informes | T10 | Igual
PC-038 Telemed administración | Operaciones > Telemed | M03 unificado | Igual
PC-039 Telemed informes | Informes telemed | M03 / T10 | Igual
PC-040 Telemed configuración | Config telemed | M03 + T04 | Igual

--- IMG-V17 ---
Título: Planes vivienda y Compras
Subtítulo: PC-041 a PC-049
FILAS:
PC-041 Vivienda materiales | Operaciones > Vivienda | M18 vales y etapas | Mejor
PC-042 Vivienda construcción | Construcción vivienda | M18 | Mejor
PC-043 Vivienda informes | Informes | T10 | Igual
PC-044 Solicitudes aprovisionamiento | Compras | M12 circuito formal | Mejor
PC-045 Solicitudes cotización | Cotizaciones | M12 | Igual
PC-046 Órdenes de compra | OC | M12 | Igual
PC-047 Remitos | Remitos | M12 | Igual
PC-048 Comprobantes proveedores | Facturas compra | M12: tres vías; IA → borrador | Mejor
PC-049 Pago a proveedores | Pagos | M12+M14: bloqueo si excepción | Mejor

--- IMG-V18 ---
Título: Stock e informes compras
Subtítulo: PC-050 a PC-058
FILAS:
PC-050 Retenciones compras | Retenciones | M12 + M06 | Igual
PC-051 Stock movimientos | Movimientos stock | M13 custodia cuadrilla | Mejor
PC-052 Trazabilidad | Trazabilidad | M13 serie única (módem, ONU) | Mejor
PC-053 Operaciones especiales stock | Op. especiales | M13 | Igual
PC-054 Bienes de uso | Bienes de uso | M13 | Igual
PC-055 Fabricación | Fabricación | M13 | Igual
PC-056 RMA | RMA | M13 | Igual
PC-057 Informes compras | Informes | T10 / M12 | Igual
PC-058 Informes stock | Informes | T10 / M13 | Igual

--- IMG-V19 ---
Título: Fiscal compras y Tesorería
Subtítulo: PC-059 a PC-067
FILAS:
PC-059 Libro IVA compras | En menú compras | M06 fiscal | Igual
PC-060 Informes correspondencia | Correspondencia | T10 / M12 | Igual
PC-061 Movimientos bancarios | Tesorería bancos | M14 conciliación asistida | Mejor
PC-062 Cuentas propias | Cuentas | M14 | Igual
PC-063 Movimientos tesorería | Movimientos | M14: tránsito ≠ disponible | Mejor
PC-064 Valores de terceros | Valores terceros | M14 | Igual
PC-065 Cheques propios | Cheques | M14 cheques electrónicos | Mejor
PC-066 Cupones tarjetas | Cupones | M14 | Igual
PC-067 Retenciones recibidas | Retenciones | M14 | Igual

--- IMG-V20 ---
Título: Tesorería cierre y Sueldos inicio
Subtítulo: PC-068 a PC-076
FILAS:
PC-068 Cajas pagos proveedores | Cajas pagos | M14 | Igual
PC-069 Cierre de cajas | Cierre cajas | M14 | Igual
PC-070 Informes tesorería | Informes | T10 | Igual
PC-071 Empleados | Sueldos > Empleados | M16 | Igual
PC-072 Empresas | Empresas empleadoras | M16 | Igual
PC-073 Recibos | Recibos impresos | M16 + portal empleado, firma | Mejor
PC-074 Liquidación masiva | Liquidación | M16: quien calcula no aprueba | Mejor
PC-075 Simulador | Simulador | M16 | Igual
PC-076 Ganancias 4ta cat. | Ganancias | M16 | Igual

--- IMG-V21 ---
Título: Sueldos config y Contabilidad
Subtítulo: PC-077 a PC-085
FILAS:
PC-077 Variables sueldos | Variables | M16 / T04 | Igual
PC-078 Conceptos | Conceptos | M16 | Igual
PC-079 Aplicar aumentos | Aumentos | M16 | Igual
PC-080 Informes sueldos | Informes | T10 | Igual
PC-081 Libro sueldo digital | Deshabilitado en DEMO | M16 LSD habilitado | Mejor
PC-082 Asientos | Contabilidad manual/auto | M15 asientos desde operaciones | Mejor
PC-083 Consultar mayor | Mayor | M15 | Igual
PC-084 Balance / S&S | Estados | M15 | Igual
PC-085 Asientos automáticos | Automáticos | M15 una vez por operación | Mejor

--- IMG-V22 ---
Título: Contabilidad cierre y Herramientas
Subtítulo: PC-086 a PC-093
FILAS:
PC-086 Herramientas contables | Utilidades | M15 | Igual
PC-087 Informes contables | Informes | T10 | Igual
PC-088 Informes de gestión | Gestión | T10 | Igual
Contabilidad paralela (sin PC) | No existe en ProCoop | M15 convivencia con ProCoop | Nuevo
PC-089 Actividades seguimiento | Actividades | T11 | Igual
PC-090 Actividades informe | Informe actividades | T10 | Igual
PC-091 SMS | SMS aislado | T09 multicanal | Mejor
PC-092 Tablero de control | Tablero | T10 indicadores certificados | Mejor
PC-093 Traslados viajes | Traslados | M18 flota integrada | Mejor

--- IMG-V23 ---
Título: Herramientas atención
Subtítulo: PC-094 a PC-101
FILAS:
PC-094 Traslados informes | Informes | T10 | Igual
PC-095 Turnero box | Box | M09 | Igual
PC-096 Turnero | Turnero presencial | M09 + turno online (M19) | Mejor
PC-097 Selección turnos | Selección | M09 + tótem | Mejor
PC-098 Estadísticas turnero | Estadísticas | T10 | Igual
PC-099 Mesa entradas adm. | Mesa entradas | M09 CRM unificado | Mejor
PC-100 Mesa entradas incidentes | Incidentes | M09 + plazos / incidente masivo | Mejor
PC-101 Mesa entradas informes | Informes | T10 | Igual

--- IMG-V24 ---
Título: Configuración del sistema
Subtítulo: PC-102 a PC-109
FILAS:
PC-102 Usuarios | Usuarios | T02 + 2FA | Mejor
PC-103 Perfiles | Menú + tablas | Roles + pantallas (T02) | Modelo distinto
PC-104 Auditoría logueo | Auditoría login | T02 auditoría datos completa | Mejor
PC-105 Copia seguridad | Manual usuario | T01 backup SaaS + exportación | Modelo distinto
PC-106 Base de datos | Menú (a veces off) | — (infra proveedor) | Modelo distinto
PC-107 Actualizar | Actualizar.exe | Release continuo SaaS | Modelo distinto
PC-108 Tablas del sistema | Tablas dominio | T04 disperso + "en uso por" | Mejor
PC-109 Parámetros sistema | Numéricos | T04 nombrados, vigencia | Mejor

--- IMG-V25 (parte A; son 2 slides por límite de 9 filas) ---
Título: Configuración WEB y reportes (1/2)
Subtítulo: PC-110 a PC-117
FILAS:
PC-110 Parámetros externos | Parámetros ext. | T04 bóveda | Mejor
PC-111 Autorización operaciones | Supervisor puntual | T11 circuitos | Mejor
PC-112 WEB requisitos y trámites | Procoop WEB | M19 + M02 + bandeja M09 | Mejor
PC-113 WEB archivos | Archivos web | M19 | Igual
PC-114 WEB operaciones | Pagos web config | M19 + M07 confirmación real | Mejor
PC-115 Logos facturas WEB | Logos PDF web | T03 marca todos los canales | Mejor
PC-116 Editor reportes | Editor | T10 | Igual
PC-117 Informes personalizados | Informes pers. | T10 jobs en background | Mejor

--- IMG-V25 (parte B) ---
Título: Configuración WEB y reportes (2/2)
Subtítulo: PC-118 a PC-120
FILAS:
PC-118 Procesos personalizados | Procesos | T10 / T11 | Mejor
PC-119 Exportar listados | Exportar grillas | T03 ExportMenu universal | Igual
PC-120 Personalización forms | Forms custom | T03 vistas guardadas | Modelo distinto

=== CÓMO RESPONDÉ ===
Si escribo "Generá IMG-V12":
1) HTML/SVG 1920×1080 con la tabla completa de IMG-V12 (todas las FILAS listadas).
2) En chat: "Para gerencia" (2–3 líneas) + PCs citados.

Si escribo "Generá IMG-V25":
1) Dos artefactos: IMG-V25 parte A y parte B (ver bloques arriba).
2) Mismo pie y estilo en ambos.

Confirmá lectura de estas reglas y esperá: "Generá IMG-V10" o el código que pida.
```

---

## 2. ¿Alcanza sin adjuntar archivos?

| Alcance | ¿Solo con este prompt? |
|---|---|
| **IMG-V10 a IMG-V25** (120 funciones PC) | **Sí** — todas las filas van inline. |
| **IMG-V00–V09** (plataforma, leyenda, 119/120) | **No** — usar catálogo completo o adjuntar `comparativo-funcional-imagenes-exhaustivas-hoy-vs-coopapps.md`. |
| **IMG-V26–V35** (módulos, servicios, cierre) | **No** — mismo catálogo completo. |
| **IMG-C01–C12** (deck corto) | Usar `comparativo-funcional-procoop-vs-coopapps-PROMPT-CLAUDE-COMPLETO.md`. |

---

## 3. Orden sugerido de generación

1. Pegar el bloque §1 una sola vez en Claude.
2. Pedir en serie: `Generá IMG-V10` … `Generá IMG-V25` (16 imágenes).
3. Opcional antes: IMG-C03 o IMG-V02 para el mensaje 119/120; opcional después: catálogo V26–V35 para módulos y 17 servicios.

---

## 4. Control de cobertura PC

| Slide | Rango PC | Cantidad filas |
|---|---|---|
| V10 | 001–004 | 4 |
| V11 | 005–007 | 3 |
| V12 | 008–012 | 5 |
| V13 | 013–018 | 6 |
| V14 | 019–023 | 5 |
| V15 | 024–032 | 9 |
| V16 | 033–040 | 8 |
| V17 | 041–049 | 9 |
| V18 | 050–058 | 9 |
| V19 | 059–067 | 9 |
| V20 | 068–076 | 9 |
| V21 | 077–085 | 9 |
| V22 | 086–093 + paralela | 9 |
| V23 | 094–101 | 8 |
| V24 | 102–109 | 8 |
| V25 | 110–120 | 11 (2 PNG: parte A + parte B) |

**Total códigos PC-001…PC-120:** 120 (+ 1 fila sin PC: contabilidad paralela en V22).