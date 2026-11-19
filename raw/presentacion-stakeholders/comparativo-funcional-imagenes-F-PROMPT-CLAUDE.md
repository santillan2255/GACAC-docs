# Prompt Claude — comparativo FUNCIONAL (IMG-F) sin códigos internos

**Problema que corrige:** las IMG-V mostraban `M16`, `T04`, `PC-077` → ilegible para gerencia y usuarios.

**Fuente de verdad:** [`comparativo-funcional-megaspec-unificado.md`](./comparativo-funcional-megaspec-unificado.md) (gerencia + operación + Ref. técnica al final).

---

## 1. Bloque para pegar en Claude (adjuntar la megaspec)

```text
Sos diseñador de slides para cooperativas de servicios de Argentina (1920×1080, HTML+SVG).

OBJETIVO: comparar ProCoop vs CoopApps en LENGUAJE QUE ENTIENDE UN JEFE DE ÁREA.
Audiencias en un solo deck: gerencia (columna "Por qué importa"), operación ("Hoy" / "Con CoopApps"), técnica solo en pie diminuto opcional.

=== PROHIBIDO (texto visible de la tabla) ===
M01, M16, T04, T10, O11, SM-*, DFA, RF-, códigos PC-077 en celdas.
NO usar "clave morse" ni abreviaturas de especificación.

=== OBLIGATORIO ===
- Nombres del menú ProCoop tal como los ve el empleado (columna Función).
- "Hoy en ProCoop": qué hace hoy (1 línea concreta).
- "Con CoopApps": qué hará el equipo (1-2 líneas, verbo + resultado).
- "Cambio": Igual | Mejor | Nuevo | Modelo distinto | No aplica al usuario
- "Por qué importa": 1 línea para consejo/gerencia.

=== LAYOUT ===
Título: área de negocio (ej. "Sueldos y liquidaciones — comparación").
Subtítulo: rango en palabras (ej. "Desde Recibos hasta informes de sueldos").
Tabla 5 columnas, fuente mínima 15px: Función | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa
Máximo 8 filas; si hay más, parte A / parte B.
Colores: Hoy #F3F4F6/#6B7280; Con CoopApps #1F2937; acento #2E7D32 en filas "Mejor".
Pie: "Fuente: relevamiento menú ProCoop DEMO + especificación CoopApps"
Pie técnico (8px, gris, opcional): "Refs. implementación: …" solo si yo lo pido.

=== FUENTE DE TEXTOS ===
Los textos de columnas "Hoy", "Con CoopApps" y "Por qué importa" deben coincidir LITERALMENTE con la megaspec adjunta (§2). No acortar ni sustituir por códigos.

=== CATÁLOGO IMG-F (usar tablas de la megaspec adjunta) ===

IMG-F00 Portada — título: "ProCoop y CoopApps: misma cooperativa, comparación función por función"
Subtítulo: 120 funciones relevadas · 17 servicios · tres lecturas (operación, gerencia, técnica en anexo)

IMG-F01 Leyenda — copiar §0.1 megaspec (etiquetas Cambio)

IMG-F02 Plataforma — copiar §1 megaspec (7 filas)

IMG-F03 … IMG-F18 Menú — cada uno = un bloque §2.1 … §2.16 de la megaspec (TODAS las filas del bloque, textos literales)

IMG-F19 Áreas de negocio — §3 megaspec

IMG-F20 Diecisiete servicios — §4 (partir en A/B si no entra)

IMG-F21 Solo en CoopApps — §5

IMG-F22 Cierre checklist — 6 ítems: 119/120 menú; multiservicio; socio con marca; mora normativa; migración por etapas; exportación de datos

=== EJEMPLO DE FILA BIEN (no copies datos de otras filas) ===
Función: Variables
Hoy: En ProCoop: tabla de variables que ajustan el recibo
Con CoopApps: Variables de liquidación con parámetros con nombre y vigencia
Cambio: Igual
Por qué importa: (vacío o "Menos dependencia de claves numéricas")

=== EJEMPLO DE FILA MAL (nunca) ===
Con CoopApps: M16 / T04

=== RESPUESTA ===
Si escribo "Generá IMG-F10":
1) HTML+SVG con las filas de §2.10 de la megaspec adjunta.
2) Chat: 3 bullets gerencia + 3 bullets jefe de área (sin códigos).

Confirmá y esperá el código IMG-F.
```

---

## 2. Orden sugerido de generación (22 imágenes)

| Código | Lote (tabla lista para la slide) | Megaspec |
|---|---|---|
| F00–F02 | [`comparativo-funcional-imagenes-F-F00-F02-lote.md`](./comparativo-funcional-imagenes-F-F00-F02-lote.md) | §0–§1 |
| F03–F22 | Carpeta [`img-f-lotes/`](./img-f-lotes/README.md) — un archivo por código | §2.1–§2.16, §3–§5 |

**Flujo por imagen:** megaspec + prompt §1 + pedir `Generá IMG-Fxx` (opcional: pegar también el `.md` del lote para título y filas).

---

## 3. Mantenimiento

```text
python scripts/generate-megaspec-comparativo.py
python scripts/export_img_f_lotes.py
```

Regenera la megaspec y los **20 lotes** F03–F22 en `img-f-lotes/`.

**Impacto stack (norma vigente):** [`06-impacto-adaptacion-stack-goodapps.md`](../especificacion/06-impacto-adaptacion-stack-goodapps.md) v1.3 — checklist §12, auditoría `13-auditoria-impacto-stack.md`. En diapositivas de datos usar **tablas Azure SQL** (1.058), no lenguaje Mongo.

---

## 4. Obsoletos

| No usar para imágenes | Usar |
|---|---|
| IMG-V00…V35 | IMG-F00…F22 |
| `comparativo-funcional-imagenes-exhaustivas-PROMPT-V10-V25-CLAUDE.md` | Este archivo + megaspec |
| **Deck “lo nuevo” (más apps, más capacidad)** | [`lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md`](./lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md) — **IMG-N** → lotes [`img-n-lotes/`](./img-n-lotes/README.md) |