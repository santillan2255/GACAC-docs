# Prompt autocontenido — PPT de preguntas de decisión por equipo (~500)

**Objetivo:** presentación para que **cada equipo** (cooperativa piloto + GoodApps) **revise, ratifique o responda** las preguntas abiertas (PA-*) con su **opción recomendada** vigente.

**Volumen (nov 2026):** ~**590–600** filas `PA-*` en el registro; ~**103** ya respondidas (DEC); ~**490** con recomendación **asumida** (DEC-072) a **revisar**; pocas **Pendiente** o **contador/legal**.

**Política (DEC-047):** al solicitante solo se presentan preguntas de **alto impacto** o que **bloquean olas tempranas**; el resto **rige la Recomendada** hasta que el equipo la ratifique o la cambie.

---

## Qué adjuntar a Claude (obligatorio)

| Prioridad | Archivo |
|-----------|---------|
| **1 — Fuente de verdad** | [`docs/especificacion/02-preguntas-abiertas.md`](../especificacion/02-preguntas-abiertas.md) |
| 2 — Contexto ejecutivo | [`documento-base-presentacion.md`](./documento-base-presentacion.md) (§4.2, IMG-19, sección 10) |
| 3 — DEC ya cerradas | [`docs/especificacion/01-registro-decisiones.md`](../especificacion/01-registro-decisiones.md) |

**Rutas Windows:**  
`c:\Users\lenovo\Documents\GACAC\docs\especificacion\02-preguntas-abiertas.md`

Este archivo de prompt **no sustituye** el adjunto 1: la PPT debe listar **cada fila** de la tabla `| PA | Anexo | Título | Recomendada | Estado |`.

---

## A. Bloque para copiar y pegar en Claude (autocontenido)

```text
Sos diseñador de presentaciones ejecutivas (1920×1080, HTML+SVG exportable a PNG/PPT) para una cooperativa de servicios públicos de Argentina y el equipo GoodApps.

OBJETIVO DEL DECK
Armar una PPT para que CADA EQUIPO revise las preguntas de decisión (códigos PA-*) del proyecto CoopApps: qué hay que ratificar, cambiar o responder. No es marketing: es agenda de decisión / workshop.

FUENTE DE DATOS (obligatorio)
Usá la tabla completa del archivo adjunto "02-preguntas-abiertas.md":
columnas: PA | Anexo | Título | Recomendada | Estado.
Cada fila PA = una función/pregunta de decisión. NO inventes preguntas. NO omitas filas.

CIFRAS ANCLA (del propio registro; validá contando filas PA al parsear el adjunto)
- Total preguntas: ~590 (puede variar si el MD creció).
- Respondida (DEC-xxx): ~100 — mostrar en verde, slide resumen; no pedir acción salvo confirmación.
- Asumida (DEC-072) o equivalente "recomendación vigente": ~490 — slides principales: acción = "Ratificar o cambiar".
- Pendiente / contador / legal / stack: destacar en ámbar o rojo suave — acción = "Responder antes de ola X" si el texto del Estado lo indica.

POLÍTICA DEC-047 (texto en portada o slide 2)
"Solo algunas preguntas bloquean el inicio; el resto opera con la opción Recomendada hasta que el equipo la revise."

=== EQUIPOS (agrupación para la PPT) ===
No uses códigos de anexo (M05, T09) como título visible grande; usá el nombre de equipo abajo.
Asigná cada PA al equipo por el PREFIJO del código PA (ej. PA-FAC-12 → equipo Facturación).

| Equipo responsable | Prefijos PA | Quién suele responder |
|--------------------|-------------|------------------------|
| Configuración y datos maestros | CFG, CFG-P1…P4, DAT, UXD | Admin cooperativa + implementación |
| Socios, cuentas y portal | PER, CAT, POR | Comercial + portal |
| Medición y tarifas | MED, TAR | Lecturas + facturación |
| Facturación | FAC | Facturación |
| Fiscal y organismos | FIS | **Contador** + facturación |
| Cobranza | COB | Caja / cobranzas |
| Mora y crédito | MOR | Crédito / jurídico |
| Atención y CRM | CRM | Mesa de entradas |
| Técnica y obras | TEC | Obras / instalaciones |
| Ventas y POS | VEN | Comercial / mostrador |
| Compras | CMP | Compras |
| Stock y depósitos | STK | Depósito |
| Tesorería | TES | Tesorería |
| Contabilidad | CON | **Contador** |
| Sueldos y RRHH | SUE | RRHH |
| Institucional | INS | Secretaría / consejo |
| Servicios sociales | SOC | Área social |
| Plataforma SaaS | PLA | GoodApps + admin cooperativa |
| Seguridad e identidad | IAM | TI + admin |
| Integraciones | INT | TI + implementación |
| Migración ProCoop | MIG | Migración + TI |
| No funcionales / rendimiento | NFR | TI + GoodApps |
| Comunidad y comunicaciones | COM | Comunicación |
| Reportes e inteligencia | BIA | Gerencia + BI |
| Workflows y aprobaciones | WFL | Admin + gerencia |
| Stack y marca (negociación) | STACK, BRD | GoodApps + dirección |
| Parámetros migración T04b | (filas CFG-P*) | Migración + área dueña |

Si un PA no encaja, usá la columna "Anexo" del adjunto y el mapa de módulos: M01 socios, M02 catálogo, M03 medición, M04 tarifas, M05 facturación, M06 fiscal, M07 cobranza, M08 mora, M09 CRM, M10 técnica, M11 ventas, M12 compras, M13 stock, M14 tesorería, M15 contabilidad, M16 sueldos, M17 institucional, M18 sociales, M19 portal.

=== PROHIBIDO (texto grande) ===
RF-, RN-, DEC- en títulos de slide (sí permitido en pie 8px).
Jerga: "tenant" → "cooperativa"; "solicitante" → "dirección de la cooperativa".

=== LAYOUT POR SLIDE ===

PPT-DEC-000 Portada
- Título: "Preguntas de decisión por equipo"
- Subtítulo: "Revisión de ~490 recomendaciones + cierre de pendientes"
- Pie: Fuente 02-preguntas-abiertas.md · nov 2026

PPT-DEC-001 Cómo usar el deck
- 3 pasos: (1) Leer pregunta y recomendada (2) Marcar Ratificar / Cambiar / Pendiente (3) Registrar en acta → DEC en 01-registro-decisiones
- Leyenda de colores: Verde=respondida; Ámbar=asumida a revisar; Gris=otro; Rojo=contador/legal urgente

PPT-DEC-002 Dashboard por equipo
- Tabla: Equipo | # PA total | # respondidas | # a revisar | # pendiente
- Contar desde el adjunto; no estimes.

PPT-DEC-003 Dashboard por estado
- Anillo o barras: Respondida / Asumida / Pendiente / Reemplazada
- Centro: total PA

PPT-DEC-010 … PPT-DEC-0xx Por cada EQUIPO (ver tabla de equipos)
SLIDE SEPARADOR equipo:
- Título del equipo + "N preguntas"
- Subtítulo: roles que deben estar en la reunión

SLIDES DE DETALLE (repetir hasta cubrir TODAS las PA del equipo):
- Título: "Equipo [nombre] — preguntas [rango o parte A/B]"
- Tabla 5 columnas, fuente mínimo 11–12px:
  | PA (pie chico) | Pregunta (Título) | Opción recomendada | Estado | Acción equipo |
- Máximo **8 preguntas por slide** (legibilidad).
- Columna "Acción equipo": dejar checkbox visual "□ Ratificar  □ Cambiar  □ No aplica" + línea en blanco "Nueva decisión:"
- Para Estado "Respondida (DEC-…)" acción = "Cerrada (solo lectura)".
- Para "Pendiente (contador)" acción = "Requiere contador".

PPT-DEC-900 Cierre — solo pendientes bloqueantes
- Listar todas las PA con Estado que contenga Pendiente, contador, legal, STACK sin DEC (parsear adjunto).

PPT-DEC-901 Próximos pasos
- Texto fijo: "1. Acta por equipo 2. Subir respuestas al registro 3. Alta de DEC 4. Priorizar piloto Laguna Larga"

=== FORMATO DE ENTREGA ===
1) Primero: "Generá outline" → lista numerada PPT-DEC-* con conteo de slides y tabla de control:
   | Equipo | # PA en adjunto | # PA en slides | OK? |
   | TOTAL | debe coincidir |
2) Luego: "Generá PPT-DEC-xxx" o "Generá todo el equipo Cobranza".
3) Cada slide HTML+SVG 1920×1080.

=== COMPLETITUD ===
Al terminar el outline, si # PA en slides < # filas PA del adjunto, ERROR: agregar slides hasta cubrir 100 %.

Paleta: títulos #2F343A; verde #2E7D32 respondida; ámbar #B7791F a revisar; gris #6B7280 texto; fondo #FFFFFF.

Confirmá que parseaste el adjunto 02-preguntas-abiertas.md y esperá "Generá outline".
```

---

## B. Comandos útiles después de pegar

| Orden | Comando |
|-------|---------|
| 1 | `Generá outline` |
| 2 | `Generá PPT-DEC-000 a PPT-DEC-003` |
| 3 | `Generá todos los slides del equipo Facturación` (ejemplo) |
| 4 | `Generá todos los equipos en orden` |
| 5 | `Generá solo PA con Pendiente o contador` |

---

## C. Equipos vs. “~500”

| Concepto | Número |
|----------|--------|
| Preguntas a **revisar** en taller (recomendación asumida) | **~490** |
| Total registro PA | **~590–601** (+ bloque STACK al final del MD) |
| Ya **respondidas** | **~103** |

La PPT puede tener **dos modos** (pedilo en un mensaje):

- **Modo A (taller):** solo filas con acción "Ratificar o cambiar" (~490) + portada + pendientes.
- **Modo B (auditoría):** **todas** las filas PA del adjunto (~600).

---

## D. Relación con otras presentaciones

| Deck | Diferencia |
|------|------------|
| **PPT-DEC** (este) | Preguntas PA-* por equipo |
| **PPT-CAT** | Catálogo de funciones / menú |
| **IMG-19** en documento-base | Resumen ejecutivo (anillo 593), no lista completa |

---

## E. Si Claude no entra todo el MD

1. Partir el adjunto por secciones (guardar `02-preguntas-parte1.md` hasta mitad de tabla) **o**
2. Pedir por equipo: `Generá outline solo para prefijo PA-COB` leyendo el adjunto **o**
3. Exportar CSV desde script (futuro): `python scripts/export-pa-por-equipo.py`