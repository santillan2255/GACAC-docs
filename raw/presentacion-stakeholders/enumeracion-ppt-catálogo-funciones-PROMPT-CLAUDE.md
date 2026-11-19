# Prompt — PPT catálogo exhaustivo de funciones (desde enumeración por aplicativo)

**Adjunto obligatorio:** [`enumeracion-funciones-por-aplicativo.md`](./enumeracion-funciones-por-aplicativo.md)

**Opcional (catálogo 1:1 con menú T03, 558 ítems):** carpeta `docs/entregables-analisis-diseno/22-mapa-navegacion/` (`22-01-admin-C01-C10.md`, `22-02-admin-C11-C18.md`) + tablas `SM-PWS-*` en T03 §10.8.

**Alcance del MD adjunto (nov 2026):** gestión web **329** líneas funcionales vs **402** ítems de menú oficiales; faltan sobre todo C05, C11 y C18. El socio tiene **48** líneas vs **49** ítems `SM-PWS`. Si el usuario pide “cada pantalla del menú”, priorizar mapa 22 + T03; si pide “cada línea del MD adjunto”, seguir el MD al pie de la letra.

**Salida deseada:** PowerPoint (o HTML→PNG por slide) **1920×1080**, español Argentina.

---

## A. Bloque para copiar y pegar en Claude (primero)

```text
Sos diseñador de presentaciones para cooperativas de servicios públicos de Argentina.

OBJETIVO: armar una PPT que muestre TODAS Y CADA UNA de las funciones listadas en el documento adjunto "enumeracion-funciones-por-aplicativo.md", sin omitir ninguna línea numerada.

NO es un deck de marketing "lo nuevo vs ProCoop". Es un CATÁLOGO VISUAL: inventario completo por aplicativo y por módulo.

=== AUDIENCIA ===
- Gerencia: entiende alcance del producto ("qué puede hacer el sistema").
- Jefes de área: reconocen su menú y sus pantallas.
- Técnica: puede usar pie diminuto con referencia al doc; no hace falta detalle de implementación en el cuerpo.

=== PROHIBIDO (texto grande visible) ===
Códigos SM-ADM-001, M01, T04, PC-077, RF-, O11, olas, "equivalente en Mxx".
Palabras vacías: revolucionario, disruptivo, el mejor, sin ProCoop.

=== PERMITIDO ===
Nombres de aplicativo: "Sistema de gestión web", "App del socio", "ProCoop.exe", "CoopOnline", etc.
Nombres de módulo tal como en el MD: "C05 Facturación", "Módulo: Cuentas y servicios", pestañas ProCoop.

=== REGLA DE COMPLETITUD (CRÍTICA) ===
1. Recorré el MD adjunto en orden: Parte 1 (CoopApps) → Parte 2 (legacy) → ignorar Parte 3 salvo slide de cierre opcional.
2. Cada función del MD (cada línea numerada, ej. "12. Titulares: …") debe aparecer EXACTAMENTE UNA VEZ en la presentación, con el mismo texto (puedes acortar solo si supera 120 caracteres y entonces usar "…" marcando que es el mismo ítem).
3. No fusionar dos ítems del MD en un solo bullet.
4. No inventar funciones que no estén en el MD (salvo títulos de sección).

=== ESTRATEGIA DE SLIDES (para no hacer 400 diapositivas sueltas) ===
Usá este patrón híbrido (obligatorio):

SLIDE-TIPO 1 — Separador de aplicativo
- Título: nombre del aplicativo (ej. "1. Sistema de gestión web")
- Subtítulo: cantidad total del MD para esa app
- Mini índice: lista de módulos de esa app (solo nombres de módulo, sin funciones)

SLIDE-TIPO 2 — Tabla por módulo
- Título: "Módulo: [nombre]" + aplicativo entre paréntesis si hace falta
- Subtítulo: "N funciones" (copiar del MD)
- Tabla de UNA columna o dos columnas:
  - Col A: número global o local + texto literal de la función (del MD)
  - Col B (opcional, 9px gris): una frase "Para qué sirve" si yo la pido en un segundo paso; por defecto dejá vacío
- Máximo 12 filas por slide; si el módulo tiene más, continuá en "Módulo X — parte B, C…" hasta vaciar TODAS las funciones.

SLIDE-TIPO 3 — Legacy ProCoop
- Misma lógica: por módulo (pestaña / subárea), tablas con cada ítem numerado del MD.

SLIDE-TIPO 0 — Portada
- Título: "Catálogo de funciones — ProCoop y CoopApps"
- Subtítulo: "Una función por fila · orden por aplicativo y módulo"
- Fecha y nota: "Fuente: enumeracion-funciones-por-aplicativo.md"

SLIDE-TIPO Z — Cierre (opcional)
- Tabla resumen: aplicativo | # módulos | # funciones (sumar desde el MD)
- Una línea de honestidad: "Gestión web: listado desglosado 329 líneas; catálogo de menú oficial 402 ítems T03" (solo si consta en el MD)

=== PALETA ===
Fondo claro #F9FAFB; títulos #1F2937; acento CoopApps #2E7D32; legacy ProCoop #6B7280 en subtítulos de Parte 2.
Tipografía sans legible; cuerpo mínimo 14px en tablas; títulos 28–32px.

=== FORMATO DE ENTREGA ===
Primero: outline numerado (lista de todos los slides con código PPT-CAT-001, PPT-CAT-002…) indicando qué funciones (# del MD) incluye cada slide.
Después: cuando yo escriba "Generá PPT-CAT-001" (o "todos los slides en un archivo HTML por slide"), producí ese slide en HTML+SVG 1920×1080 listo para exportar a PNG/PPT.

=== VERIFICACIÓN ===
Al final del outline, tabla de control:
| Aplicativo | Funciones en MD | Funciones asignadas a slides | ¿Coincide? |

Si no coincide, corregí antes de diseñar.

Confirmá que leíste el adjunto y esperá mi "Generá outline" o "Generá todos".
```

---

## B. Comandos que le podés decir después

| Comando | Qué hace |
|---------|----------|
| `Generá outline` | Índice PPT-CAT-* + tabla de control de completitud |
| `Generá PPT-CAT-001` | Solo portada |
| `Generá slides de la app 1 (gestión web) completos` | Todos los módulos C01–C18 del MD, sin saltear |
| `Generá solo Parte 2 ProCoop` | Escritorio + CoopOnline + P-Móvil + Agente + Integra |
| `Exportá en un solo PPTX` | Si el modelo soporta archivo; si no, HTML por slide + instrucción de importar |

---

## C. Variante si querés 402 + 558 ítems de menú (no solo el MD)

Pegá además este párrafo **después** del bloque §A:

```text
AMPLIACIÓN: además del MD, usá los archivos 22-01-admin-C01-C10.md y 22-02-admin-C11-C18.md:
cada fila SM-ADM con columna "Ítem" = una fila obligatoria en la PPT (402 filas en gestión).
Mismas reglas de tablas por módulo (cluster C01–C18), máximo 12 filas por slide.
En socio/empleado/campo/landing: tabla T03 §10.8 (SM-PWS, SM-EMP, etc.) hasta total 558.
```

---

## D. Relación con otros decks

| Deck | Uso |
|------|-----|
| Este (PPT-CAT) | Inventario total — auditoría, capacitación, alcance contractual |
| IMG-F + megaspec | Comparativo ProCoop vs CoopApps por función |
| IMG-N | Marketing "lo nuevo" |