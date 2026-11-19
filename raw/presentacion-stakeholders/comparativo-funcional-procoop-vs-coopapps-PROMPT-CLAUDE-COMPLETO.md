# Prompt autocontenido para Claude — imágenes IMG-C01 a IMG-C12

**Uso:** copiar todo el bloque ` ```text ` de la sección 1 y pegarlo en Claude.  
**Opcional:** adjuntar solo si vas a generar **IMG-C13–C24** o si querés verificación extra del comparativo completo.

---

## 1. Bloque para pegar en Claude

```text
Sos mi diseñador de presentación ejecutiva (1920×1080, 16:9) para directivos de cooperativas de servicios públicos de Argentina. Producto: CoopApps (SaaS). Referencia: ProCoop (escritorio).

Este mensaje incluye REGLAS + CONTENIDO de cada slide IMG-C01…C12. Usá SOLO lo que figura acá. No inventes cifras ni promesas.

=== REGLAS VISUALES ===
- Español de Argentina, formal, sin "revolucionario/disruptivo".
- ProCoop: respeto; "Hoy" en grises #E5E7EB / texto #6B7280.
- CoopApps: acento #2E7D32; títulos #2F343A; fondo #FFFFFF.
- Ámbar #B7791F: solo viñeta "API de sus datos (plan O11)" en IMG-C06 y si repites API.
- Cada slide: artefacto HTML+SVG 1920×1080, exportable a PNG. NO generador de imágenes si hay números.
- Tipografía sans (Inter); título grande; máx. 4 viñetas; íconos línea simples; mucho aire.
- Datos ficticios: "Cooperativa A". Sin DNI/CUIT reales.
- Tras cada slide, en chat: notas Gerencia (3 líneas) + números citados.

=== NÚMEROS AUTORIZADOS (no uses otros) ===
- Menú ProCoop relevado: 120 funciones; con destino en CoopApps: 119 (112 absorbidas, 7 reemplazadas, 1 descartada "administrar BD", 0 sin destino).
- DEMO facturación: ~12.500 comprobantes por emisión mensual (referencia volumen).
- Módulos especificación: 19 funcionales M01–M19 + 12 transversales T01–T12.
- Requisitos: 4.213 funcionales; 293 no funcionales (aprox., especificación vigente).
- Olas construcción: O0 a O11 (12 olas); mapa de contenido (DEC-118; build vía pipeline GoodApps, no Cursor).
- Stack vigente: .NET 10, Azure SQL, React 19, Microsoft Azure (DEC-111–112).
- Familias de servicio con ficha: 17.
- Roles plantilla: 40.
- Corte comercial piloto: ola O7; corte administrativo ProCoop: ola O11 (DEC-089).
- API externa documentada para la cooperativa: planificada O11; antes exportaciones y reportes.

=== PROHIBIDO EN TEXTO VISIBLE ===
"Mismas pantallas"; "API desde el día 1"; "sin ProCoop"; "reemplazo inmediato"; "tiempo real al milisegundo".

=== CATÁLOGO DE SLIDES (generá solo la que pida; si pido "las 12", una por mensaje) ===

IMG-C01 PORTADA
Título: CoopApps y su cooperativa: mismo negocio, nueva plataforma.
Subtítulo: Comparativo funcional respecto de ProCoop.

IMG-C02 RESPETO
Título: ProCoop hace mucho. Y lo hace bien.
Viñetas: Facturación masiva · Multiservicio · Mora, compras, sueldos · Confianza de años.

IMG-C03 COBERTURA MENÚ (número protagonista)
Título: Lo que ProCoop hace hoy → cubierto en CoopApps.
Número grande: 119 de 120
Subtexto: funciones del menú relevado con destino en la especificación.
Pie: La restante es administrar la base de datos; en la nube lo hace la plataforma.
Opcional secundario (texto chico): 112 equivalentes · 7 con mecanismo mejor · 0 sin destino.

IMG-C04 OCHO APLICACIONES
Título: Una cooperativa, ocho formas de trabajar.
Centro: Una sola información.
Alrededor (8 etiquetas): Gestión web · App del socio (su marca) · Campo sin señal · Empleados · Sitio público · Tótem · Plataforma (proveedor) · Integraciones de datos.

IMG-C05 SOCIO (antes/después)
Título: El socio ve lo mismo que ve caja.
Columna Hoy: Portal sobre copia sincronizada (CoopOnline).
Columna Con CoopApps: Contratar, pagar, reclamar y dar de baja desde el celular con la marca de la cooperativa.

IMG-C06 SIETE DOLORES
Título: Siete dolores, siete respuestas en especificación.
Viñetas: Nube · Sin servidores propios · API de sus datos (plan O11) [etiqueta ámbar opcional] · App del socio · Su marca · Seguridad verificable · Soporte con caso y registro.

IMG-C07 FACTURACIÓN Y COBRANZA
Título: Facturar y cobrar con control.
Viñetas: Lotes con excepciones visibles · Un solo cálculo de intereses · Pago confirmado antes de reconectar · Sin guardar números de tarjeta.

IMG-C08 TÉCNICA Y CAMPO
Título: Del turno a la conformidad, en un solo flujo.
Viñetas: Factibilidad · Visita con estado visible al socio · Una app: técnico, lecturista y cobrador · Equipos rastreados por serie.

IMG-C09 LO NUEVO
Título: Lo que suma, más allá de reemplazar pantallas.
Viñetas: Institucional y asambleas · Comunidad y avisos por zona · Diccionario propio (socio/asociado) · Expediente digital · Indicadores iguales en todo canal.

IMG-C10 DIEcisiete SERVICIOS
Título: Electricidad, gas, agua… y también sepelio, cementerio, vivienda.
Texto: Cada servicio con sus reglas; la ley no se apaga con un parámetro.
Dato visible: 17 familias de servicio.

IMG-C11 MIGRACIÓN
Título: Cambio por etapas.
Viñetas: Convivencia con ProCoop · Comparar factura a factura · Dos ciclos conciliados · Códigos de barras antiguos válidos en transición.
Números: 12 olas (O0–O11) · 172 prompts.

IMG-C12 CHECKLIST CIERRE
Título: ¿Qué pueden validar hoy?
Seis ítems con check visual: Menú cubierto (119/120) · Multiservicio y tasas terceros · Socio paga y reclama · Mora con norma · Migración por etapas · Datos exportables.

=== CÓMO RESPONDÉ ===
Si escribo "Generá IMG-C03":
1) HTML/SVG 1920×1080 con textos exactos de IMG-C03 arriba.
2) En chat: Gerencia (continuidad operativa; riesgo "perdemos módulo" acotado) + lista de números usados.

Confirmá lectura de estas reglas y esperá: "Generá IMG-C01" o el código que pida.
```

---

## 2. ¿Alcanza sin adjuntar archivos?

| Alcance | ¿Solo con este prompt? |
|---|---|
| **IMG-C01 a IMG-C12** (bloque comparativo corto) | **Sí** — textos y números clave van inline arriba. |
| **IMG-C13 a IMG-C24** | **No** — adjuntar `comparativo-funcional-procoop-vs-coopapps-para-presentacion.md` §2. |
| **Deck unificada** (IMG-01, IMG-D, etc.) | **No** — adjuntar `documento-base-presentacion.md` y `dolores-procoop-antes-y-despues.md`. |
| Q&A técnica profunda (120 ítems PC) | Adjuntar `comparativo-funcional-procoop-vs-coopapps.md`. |

---

## 3. Relación con el prompt §0.2 de la guía

| Archivo | Rol |
|---|---|
| `comparativo-funcional-procoop-vs-coopapps-para-presentacion.md` §0.2 | Reglas + códigos; **requiere adjuntos** para el contenido. |
| **Este archivo** | Mismo rol + **contenido C01–C12 embebido**; listo para pegar solo. |