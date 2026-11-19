# 04 — Matriz de trazabilidad de fuentes

| Campo | Valor |
|---|---|
| Versión | 1.2 (10-11-2026: DEC-093 a DEC-108, PA-FIS-23 a PA-FIS-26 y plan de olas v1.2; los cambios están en la sección 22). *Reemplazado (v1.1):* 1.1 (reemplaza la 1.0 del 04-11-2026; los cambios están en la sección 20). Actualizada el 05-11-2026 por el cierre de la corrección de inconsistencias (sección 21) |
| Fecha | 10-11-2026 (antes 05-11-2026) |
| Estado | Regenerada por script según la sección 14 sobre los anexos, el plan de olas v1.1 y los registros vigentes al 05-11-2026. Siguen abiertas las brechas de fuente de la sección 4 y las citas de decisiones de 5.3. El 10-11-2026 se actualizaron las secciones 1, 5.1, 5.3, 15, 18 y 22 sobre los anexos y el plan v1.2; las matrices de fuentes (secciones 3 a 13) no se regeneraron porque ninguna unidad de fuente cambia de estado. *Reemplazado (v1.0): "Generada por script sobre los anexos vigentes a la fecha; pendiente de cerrar las brechas de la sección 4".* |
| Propósito | Demostrar que ninguna sección, módulo, función, regla ni tabla de las fuentes se perdió al consolidar la especificación (requisito del solicitante: "sin perder info ni un módulo ni una función") y que cada requisito (RF y RNF) tiene exactamente un prompt de construcción en el plan de olas |
| Referencias | `00-ESPECIFICACION-MAESTRA.md` §2 (fuentes y prevalencia), §17 (contraposiciones globales), §19 (trazabilidad global); `_GUIA-REDACCION-ANEXOS.md` §1 (regla de oro) y §4 (sección 22 de cada anexo); `01-registro-decisiones.md`; `02-preguntas-abiertas.md`; `03-plan-de-olas-y-prompts.md` v1.2 (§0, §17, §18, §21, §22); `05-registro-huecos.md` |
| Fuentes trazadas | BASE, COMPLEMENTO (AGR), CNX, DFA, FIC, RN-00 a RN-13 y CAT (659 tablas). Además: plan de olas v1.2 (**174** prompts `PRO-O*`, 4.213 RF y 293 RNF; antes v1.1 con 4.204 RF y 292 RNF, y antes 4.203 RF), registro de huecos (77 huecos únicos), DEC-001 a DEC-088 (DEC-088 incorporada el 05-11-2026) y DEC-093 a DEC-108 (incorporadas el 10-11-2026, sección 22), PA nuevas de los huecos y PA-FIS-23 a PA-FIS-26, y eventos nuevos o reemplazados de T11. Fuente revisada que no es fuente de requisitos: el documento externo `NucleoTransversal-Modelo` (sus aportes entraron por DEC-093 a DEC-104; sección 22.1) |
| Anexos leídos | M01–M19, T01–T04, T04b partes 1–4, T05, T06–T11, T12 partes 1–2, en su estado del 10-11-2026 para las secciones 5.1, 15, 18 y 22 (antes 05-11-2026). *Reemplazado (v1.0): T05 figuraba "en redacción a la fecha".* |

## Índice

1. Objetivo y alcance
2. Método y criterios
3. Resumen de cobertura por fuente
4. Brechas
5. Matriz de decisiones
6. Matriz inversa: anexo → fuentes
7. Matriz BASE
8. Matriz COMPLEMENTO (AGR)
9. Matriz Connectia (CNX)
10. Matriz DFA
11. Matriz FIC
12. Matrices RN-00 a RN-13
13. Matriz del catálogo de tablas ProCoop (CAT)
14. Cómo mantener esta matriz
15. Trazabilidad RF y RNF → prompt (plan de olas v1.2)
16. Huecos de `05-registro-huecos.md` → ubicación en los anexos y en el plan
17. Decisiones DEC-082 a DEC-087
18. Preguntas abiertas nuevas
19. Eventos nuevos o reemplazados de T11
20. Cambios de la versión 1.1
21. Cierre de la corrección de inconsistencias (05-11-2026)
22. Cambios de la versión 1.2 (DEC-093 a DEC-108, 10-11-2026)

---

## 1. Objetivo y alcance

Esta matriz es la prueba de exhaustividad de la especificación. Para cada **unidad de fuente** indica en qué anexo(s) y en qué identificadores quedó, o el motivo por el que se descartó o reemplazó. Toda unidad que no tiene destino se declara **SIN COBERTURA** y se lista en la sección 4 con el anexo que debería cubrirla y una propuesta.

Unidades trazadas:

| Fuente | Ruta | Unidad |
|---|---|---|
| BASE | `docs/base-funcional/PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md` | Cada encabezado, de todos los niveles (§1–§107, subsecciones, fichas MER, AGR, ESC y mensajes P-001..P-020) |
| AGR | `docs/base-funcional/PROCOOP_COMPLEMENTO_ANALISIS_FUNCIONAL_Y_DISENO.md` | Cada encabezado (§1–§11, fichas AGR-001..036, ESC-01..05) |
| CNX | `referencia-connectia/connectia-referencia-para-goodapps.md` | Cada encabezado (§1–§12 y subsecciones) |
| DFA | `procoop-relevamiento/definicion-funcional-alcance.md` | Cada encabezado (§0–§34; los módulos 1–29 son las secciones §2–§30) |
| FIC | `procoop-relevamiento/integraciones-fichas.md` | Cada ficha y subficha (§0–§23) |
| RN-00..13 | `procoop-relevamiento/reglas-negocio/*.md` | Cada encabezado de cada archivo |
| CAT | `procoop-relevamiento/binarios/Procoop-catalogo-tablas.md` | Cada una de las 659 tablas |
| PLAN | `docs/especificacion/03-plan-de-olas-y-prompts.md` v1.2 (antes v1.1) | Cada RF y RNF definido en los anexos, frente a la línea IMPLEMENTAR de los **174** prompts `PRO-O*` (sección 15) |
| HUE | `docs/especificacion/05-registro-huecos.md` | Cada hueco único (77), con la ubicación de su corrección y el prompt que la construye (sección 16) |
| DEC, PA, EVT | `01-registro-decisiones.md`, `02-preguntas-abiertas.md`, T11 | DEC-001 a DEC-087 (secciones 5 y 17) y DEC-093 a DEC-108 (secciones 5 y 22), PA nuevas de los huecos y PA-FIS-23 a PA-FIS-26 (sección 18) y eventos nuevos o reemplazados de T11 (sección 19) |
| REV (fuente revisada) | `docs/revision-externa/NucleoTransversal-contraste.md` y `NucleoTransversal-rechazados.md` (documento externo `NucleoTransversal-Modelo`) | No es fuente de requisitos y no se trazan sus unidades: se contrastó con la especificación y sus aportes entraron por DEC-093 a DEC-104; la revisión de los rechazos dio DEC-105 a DEC-108 (sección 22.1). GestionApps no es fuente (DEC-108) |

Quedan fuera de esta versión, porque ya tienen su propia matriz exhaustiva en un anexo: los 1.536 parámetros V2 (una fila por parámetro en T04b partes 1–4), los formularios INV y el menú de la DEMO (REL), cuya cobertura de pantallas está en T03 (mapa del sitio) y en la sección 22 de cada anexo.

## 2. Método y criterios

La matriz se generó con scripts de PowerShell (fuentes) y de Python (plan de olas y registros), sin carga manual, en cuatro pasos. *Reemplazado (v1.0): "con scripts de PowerShell, sin carga manual, en tres pasos".*

1. **Extracción de unidades.** Se leyó cada fuente y se registró cada encabezado Markdown (`#` a `######`) con su nivel, número (§), título, línea y jerarquía. En el catálogo se registró cada fila de tabla de cada una de sus 31 secciones.
2. **Índice de referencias de los anexos.** Se recorrió cada línea de cada anexo y se reconocieron:
   - citas con marcador de fuente: `BASE §n`, `AGR §n`, `CNX §n`, `DFA Mn` / `DFA Módulo n` / `DFA §n` (incluido "mejoras"), `FIC n.m`, `RN-xx §n.m`, con listas (`§3.1, §3.2`), rangos (`§86–§95`, `§8.1 a §8.13`, `M1–M29`) y rangos de líneas (`DFA Módulo 4 (líneas 242-312)`);
   - identificadores de la base sin marcador: `AGR-nnn`, `ESC-01..05`, `MER-nnn`, `P-0nn`, `CU-…` y los IDs de requisitos definidos en BASE (`CIC-001`, `FAC-005`, `SUE-003`, `TIT-003`, etc., con rangos `FAC-005..012`), cada uno asignado a la sección de BASE donde se define;
   - referencias textuales a secciones RN sin número (`RN-11 Implicancias / Dudas`, `RN-11 resumen`), resueltas por el título de la sección;
   - nombres de tabla ProCoop entre comillas invertidas (`` `CAUSAS` ``, `` `NPEDIDO` ``) y las filas de la matriz de migración T07 §19.

   Para cada cita se guardó el anexo y el identificador de la fila donde aparece (el ID de la primera columna de las tablas RF, RN, PRM, CTR, PA, PAN, etc.; en la sección 22, los IDs de la columna de cobertura; si no hay ID, la sección del anexo). Una cita dentro de la fila "Fuentes consolidadas" de la ficha inicial del anexo se marca como **encabezado**. Una cita en la sección 22 cuya fila dice "Descartado" o "Reemplazado" se marca con ese estado.
3. **Clasificación.** Cada unidad recibió uno de estos estados:

| Estado | Criterio |
|---|---|
| Cubierta | La unidad (por su número, su ID o su rango) se cita en al menos una fila con ID de un anexo, fuera de la ficha inicial |
| Cubierta (por sección) | La unidad no se cita sola, pero su sección padre sí se cita en una fila con ID (típico de los subtítulos "Objetivo", "Alcance funcional", "Caso de uso", "Funciones", "Mejoras propuestas"). No se hereda desde el contenedor BASE §102, que siempre se cita junto a una ficha AGR concreta |
| Cubierta (por subsecciones) | La unidad no se cita sola, pero sus subsecciones sí |
| Débil (solo encabezado) | La única evidencia es la fila "Fuentes consolidadas" de la ficha inicial del anexo. No se cuenta como cubierta: se lista en 4.2 para reforzarla |
| Descartada (motivo) | La sección 22 de un anexo la declara descartada con su motivo, o es un metadato de la fuente sin requisito (historial de cambios, "cómo leer este documento", bibliografía, índice, control de revisión) |
| Reemplazada (motivo) | La sección 22 de un anexo la declara reemplazada; en el catálogo de tablas, T07 §19 la marca `Reemplazado por …` |
| SIN COBERTURA | No se encontró ninguna cita. Se lista en 4.1 con el anexo que debería cubrirla |

4. **Requisitos, plan y registros.** Se leyeron las tablas de requisitos de todos los anexos (filas cuya primera columna es `RF-<COD>-NNN` o `RNF-<COD>-NNN` en tablas con columnas `ID` y `Ola`; una barra dentro de código o escapada no separa columnas) y la línea `IMPLEMENTAR:` de cada prompt del plan, con las reglas de lectura de la sección 15 (implementación, extensión y "parte Ox de"). Así se controla que cada RF y RNF tenga exactamente un prompt. Se cruzaron además los huecos, las DEC nuevas, las PA nuevas y los eventos nuevos con los anexos y el plan (secciones 16 a 19).

Criterios adicionales:

- **Tablas del catálogo.** Se toman de la matriz T07 §19 (una fila por tabla con destino, anexo dueño, ola y estrategia): `Migrar vivo` e `Histórico` → Cubierta; `No migrar` con destino `Reemplazado por …` → Reemplazada; `No migrar` con `Descartar` → Descartada con el motivo de la columna Observaciones. Además se listan los anexos que citan la tabla en su modelo de datos (§7), migración (§19) o trazabilidad (§22).
- **Equivalencia AGR ↔ BASE §102.** BASE §102 integra el complemento completo, así que una cita `AGR §n` cubre también BASE §102.n y viceversa; las fichas `AGR-nnn` y los escenarios `ESC-0n` cubren las dos copias.
- **Citas a subnumeraciones.** Se detectaron 128 citas distintas (541 apariciones) a números que no son encabezados de la fuente sino párrafos o ítems numerados dentro de una sección (por ejemplo `RN-02 §16.1`, `RN-08 §13.1`, `RN-09 §7.6`). Se asignaron a la sección que las contiene. Las citas a secciones que no existen en la fuente se listan en 4.3.
- **Porcentajes.** "% cobertura" = (cubiertas de cualquier tipo + descartadas + reemplazadas) / unidades. "% cobertura estricta" excluye las cubiertas por herencia. Las débiles y las brechas no suman.
- **Prevalencia.** La matriz no resuelve contraposiciones: muestra dónde quedó cada unidad. Las resoluciones están en la sección 20 de cada anexo y en `00-ESPECIFICACION-MAESTRA.md` §17, según la jerarquía de §2.2 (DEC > BASE > AGR > CNX > benchmark ProCoop).
- **Datos personales.** La matriz solo transcribe títulos de secciones, nombres de tablas e IDs; no contiene datos de la DEMO ni credenciales.

Lectura de las columnas de las matrices 7 a 13: **Unidad de fuente** muestra el número de sección (o la sección padre entre paréntesis), el título y la línea de la fuente (`L123`); los subniveles se indican con `›`. **Anexo(s)** lista los anexos con citas (máximo siete). **IDs** muestra hasta tres IDs por anexo para los cuatro primeros anexos (`encab.` = ficha inicial; `…` = hay más). **Estado** según la tabla anterior.

## 3. Resumen de cobertura por fuente

| Fuente | Unidades | Cubiertas (directa) | Cubiertas (heredada) | Débiles (solo encabezado) | Descartadas / reemplazadas | Brechas (SIN COBERTURA) | % cobertura | % cobertura estricta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| BASE — Relevamiento y base funcional | 621 | 340 | 263 | 5 | 8 | 5 | 98,4 % | 56,0 % |
| COMPLEMENTO (AGR) — Análisis funcional y diseño | 61 | 52 | 2 | 0 | 2 | 5 | 91,8 % | 88,5 % |
| CNX — Referencia Connectia | 53 | 51 | 1 | 0 | 1 | 0 | 100,0 % | 98,1 % |
| DFA — Definición funcional del alcance | 96 | 56 | 39 | 0 | 1 | 0 | 100,0 % | 59,4 % |
| FIC — Fichas de integraciones | 60 | 53 | 5 | 1 | 1 | 0 | 98,3 % | 90,0 % |
| RN-00 `00-indice.md` | 4 | 0 | 0 | 0 | 0 | 4 | 0,0 % | 0,0 % |
| RN-01 `01-calculo-factura-servicios.md` | 68 | 66 | 1 | 1 | 0 | 0 | 98,5 % | 97,1 % |
| RN-02 `02-facturacion-masiva-y-comprobantes.md` | 57 | 53 | 4 | 0 | 0 | 0 | 100,0 % | 93,0 % |
| RN-03 `03-afip-facturacion-electronica-e-iva.md` | 40 | 35 | 1 | 1 | 1 | 2 | 92,5 % | 90,0 % |
| RN-04 `04-mora-intereses-y-corte.md` | 48 | 44 | 3 | 1 | 0 | 0 | 97,9 % | 91,7 % |
| RN-05 `05-cobranzas-cajas-y-entes-recaudadores.md` | 52 | 39 | 5 | 0 | 0 | 8 | 84,6 % | 75,0 % |
| RN-06 `06-titulares-servicios-medidores-y-consumos.md` | 56 | 51 | 4 | 1 | 0 | 0 | 98,2 % | 91,1 % |
| RN-07 `07-tecnica-reclamos-gis-y-telefonia.md` | 45 | 39 | 4 | 0 | 1 | 1 | 97,8 % | 88,9 % |
| RN-08 `08-tesoreria-contabilidad-compras-stock-sueldos.md` | 124 | 79 | 44 | 0 | 1 | 0 | 100,0 % | 64,5 % |
| RN-09 `09-parametros-y-configuracion.md` | 56 | 35 | 20 | 0 | 1 | 0 | 100,0 % | 64,3 % |
| RN-10 `10-integraciones-externas.md` | 34 | 32 | 1 | 1 | 0 | 0 | 97,1 % | 94,1 % |
| RN-11 `11-especificas-laguna-larga.md` | 17 | 12 | 3 | 1 | 0 | 1 | 88,2 % | 70,6 % |
| RN-12 `12-configuracion-real-laguna-larga.md` | 7 | 7 | 0 | 0 | 0 | 0 | 100,0 % | 100,0 % |
| RN-13 `13-pasarelas-de-pago-e-interbanking.md` | 43 | 35 | 2 | 6 | 0 | 0 | 86,0 % | 81,4 % |
| **Subtotal unidades de texto** | **1542** | **1079** | **402** | **18** | **17** | **26** | **97,1 %** | **71,1 %** |
| CAT — Catálogo de tablas ProCoop (`Procoop-catalogo-tablas.md`) | 659 | 582 | 0 | 0 | 77 | 0 | 100,0 % | 100,0 % |
| **Total general** | **2201** | **1661** | **402** | **18** | **94** | **26** | **98,0 %** | **79,7 %** |

Tablas del catálogo por estado: Cubierta 582 · Descartada 25 · Reemplazada 52. Las 659 tablas tienen fila propia en la matriz T07 §19; 659 de ellas además se citan en al menos otro anexo (modelo de datos §7, migración §19 o trazabilidad §22).

Lectura rápida: el 98,0 % de las 2.201 unidades tiene destino (cubierta, descartada o reemplazada); 26 unidades no tienen ninguna cita (sección 4.1) y 18 solo se declaran en la ficha inicial de un anexo (sección 4.2). Las 659 tablas del catálogo tienen destino en T07. La cobertura estricta (sin herencia) es más baja en BASE y DFA porque sus subtítulos genéricos ("Objetivo", "Funciones", "Mejoras propuestas") se citan a nivel de sección, que es la granularidad que usan los anexos.

Cambios de estado frente a la versión 1.0: RN-07 §0 "Mapa de fuentes" pasó de débil a Descartada (M10 §22); RN-07 §3.2 "Conexión nueva (alta de servicio)" pasó de débil a Cubierta; la tabla `AUDIT_IA` pasó de Descartada a Cubierta (T07 la migra a `legacyAuditRecords` como auditoría de solo lectura, CTR-DAT-04). Ninguna unidad perdió cobertura.

*Reemplazado (v1.0): total general 1.659 cubiertas directas, 20 débiles, 97,9 % de cobertura y 79,6 % estricta; subtotal de texto 1.078 directas, 16 descartadas, 97,0 % y 70,9 %; RN-07 con 38 directas, 2 débiles y 93,3 %; tablas Cubierta 581 · Descartada 26 · Reemplazada 52.*

## 4. Brechas

### 4.1 Unidades SIN COBERTURA

Ninguna de estas unidades tiene cita en los anexos. Cada propuesta indica dónde debería quedar; la edición la hace el dueño del anexo (este documento no modifica anexos).

Verificación v1.1 (05-11-2026): las 26 unidades siguen sin cita. Se repitieron las búsquedas de texto de la columna Propuesta y los resultados no cambiaron: "simulaciones separadas" sigue con una sola mención (T01), la Res. INAES 3442/2018 y la escala "P0" no aparecen en ningún anexo, el tope 99.999,99 aparece una vez en M05 sin cita y el riesgo de imputación por importes repetidos no figura en M07. Para B-14, `FORMULA_CARGO*` y los procedimientos almacenados se mencionan en M04 (16), T11 (3), T04 (2), M19 (1) y T10 (1). *Reemplazado (v1.0): "M04 ya trata `FORMULA_CARGO*` y los procedimientos almacenados (15 menciones)".* Ningún hueco de `05-registro-huecos.md` ni RF nuevo del plan v1.1 cita estas unidades.

| # | Unidad de fuente | Contenido (resumen) | Anexo sugerido | Propuesta | Impacto |
|---|---|---|---|---|---|
| B-01 | BASE · Advertencia principal para la definición de arquitectura (L7) | Revisión expresa de arquitectura del sistema integral (ERP + CRM + autogestión + facturación + técnica + comunicación + APIs): qué comparte identidad y datos, límites, integración, no duplicación, aislamiento por tenant, auditoría y **simulaciones separadas de producción**. Requisito transversal: diccionario de términos por tenant desde el inicio | T01 PLA (arquitectura) y T03 UXD (diccionario) | Agregar en T01 §22 la fila "BASE Advertencia principal" apuntando a los RF de arquitectura que ya materializan BASE §58 ARQ-001, y en T03 §22 apuntando a los RF del diccionario (BASE §65). Verificar que "simulaciones separadas de producción" tenga RF explícito en T01/T04 (la búsqueda de texto solo lo encuentra una vez, en T01). El diccionario por tenant sí está desarrollado (T03, 139 menciones) | Alto: requisito rector de arquitectura |
| B-02 | BASE · Propósito y alcance (L15) | Alcance del producto (SaaS multitenant, catálogo habilitable, ERP, autogestión, facturación argentina…), niveles "confirmado / informado por el solicitante / propuesta", actualizaciones 0.15 y 0.17 | `00-ESPECIFICACION-MAESTRA.md` §1 y §2.1 | Citar la unidad en la maestra §1 (visión) o declararla `Descartada: metadato introductorio`. Conservar la distinción de tres niveles de certeza, que hoy no figura en la guía de redacción | Bajo |
| B-03 | BASE §96 Revisión de coherencia del documento — versión 0.15 (L4697) | Revisión interna de la versión 0.15 | `00-ESPECIFICACION-MAESTRA.md` §17 | Registrar §96 como fuente de contraposiciones globales (ver B-05) | Medio |
| B-04 | BASE §96 › Alcance de la revisión (L4699) | Resultado de coherencia general | `00-ESPECIFICACION-MAESTRA.md` §17 | Igual que B-03 | Bajo |
| B-05 | BASE §96 › Hallazgos de estructura y su tratamiento (L4703) | Reglas de prevalencia internas: §84–§93 prevalecen sobre §32; §48 (solicitar el servicio) prevalece sobre §25/§43 (activar o desactivar desde la app); falta de fundamento legal universal para facturar separado (P-014, Res. INAES 3442/2018 sin efecto); entidades agregadas a §33; Telefonía y TV como extensiones; IDs pendientes; priorización §97.12 | `00-ESPECIFICACION-MAESTRA.md` §17; M02 §20; M19 §20; M05 §20 | Agregar CTR globales para "§48 sobre §25/§43" y "§84–§93 sobre §32", y citar §96 en la §22 de M02, M05 y M19. Comprobar que M19 aplique "solicitar" como base y la ejecución inmediata solo como alternativa por servicio. La Res. INAES 3442/2018 no se menciona en ningún anexo | Alto: contiene prevalencias que hoy no están trazadas |
| B-06 | AGR §1 Propósito y criterio de revisión (L8) | Tres diagnósticos (no explicitado, detalle insuficiente, pendiente ya identificado), escala de prioridad P0/P1/P2 y regla "ninguna propuesta se considera aprobada por aparecer aquí" | `03-plan-de-olas-y-prompts.md` y `01-registro-decisiones.md` | Citar la regla de no aprobación junto a DEC-047/DEC-072 y usar P0/P1/P2 como criterio de orden en el plan de olas | Medio |
| B-07 | AGR §2 Diagnóstico principal (L28) | Puntos determinantes de arquitectura: identidad multitenant, dueños de datos, estados y eventos entre módulos, historia con fechas efectivas, integridad monetaria; vacíos operativos (pagos excedentes, moderación) | T01 PLA | Agregar fila en T01 §22 → RF/RN que materializan AGR-002, AGR-003, AGR-006, AGR-010, AGR-011 (ya cubiertas una por una) | Bajo |
| B-08 | AGR §2.1 Qué ya está y no hace falta volver a inventar (L36) | Tabla de capacidades de la base con el aporte que falta | T01 PLA | Declarar `Descartada: resumen sin requisito propio; el aporte se desarrolla en AGR-001..036` en T01 §22 | Bajo |
| B-09 | AGR §3 Matriz de propuestas y trazabilidad (L49) | Para cada AGR: prioridad P0/P1/P2, diagnóstico y secciones de la base relacionadas | `03-plan-de-olas-y-prompts.md`; §22 de cada anexo | Incorporar la prioridad P0/P1/P2 de cada AGR en el plan de olas y citar "AGR §3" en las §22 que ya listan fichas AGR | Medio |
| B-10 | AGR §9 Cómo incorporar estas propuestas sin perder control del alcance (L614) | Procedimiento y plantilla para convertir propuestas en decisiones | `01-registro-decisiones.md`; `_GUIA-REDACCION-ANEXOS.md` | Citarla como origen del formato de registro de decisiones y preguntas | Bajo |
| B-11 | RN-00 (documento) Reglas de negocio de Procoop extraídas del código (L1) | Índice del conjunto RN | T07 MIG | Declarar `Descartada: índice` | Bajo |
| B-12 | RN-00 › Documentos (L9) | Tabla de los 13 documentos RN | T07 MIG | Declarar `Descartada: índice` | Bajo |
| B-13 | RN-00 › Cobertura del código (L27) | Cobertura medida del código descompilado por área: ARCA 50 % de métodos, Telefonía 30 %, núcleo/configuración/plantillas/tablero 25 %, formularios de `Configuracion` 17 %, `ProcoopNet` 29 % | `05-registro-huecos.md`; T04/T04b, M06, M04 (telefonía), T03 | Registrar como hueco de relevamiento: las reglas de esas áreas pueden no estar en la especificación porque no se extrajeron del código. Proponer una tercera pasada de extracción o la validación con la cooperativa | **Alto**: límite de exhaustividad de la fuente |
| B-14 | RN-00 › Qué quedó afuera y por qué (L50) | Exclusiones deliberadas (interfaces de otras cooperativas, proxies WSDL, SDK) y **segunda pasada inconclusa**: reglas de formularios de `Configuracion` y `ProcoopNet`, plantillas y tablero (RN-09), métodos de facturación masiva (RN-02), validaciones de pantallas de mora, tasas y planes (RN-04), telemedición y app móvil (RN-06), resúmenes de RN-08 y RN-10, informes de titulares; funciones `FORMULA_CARGO*` y procedimientos almacenados en la base de cada cooperativa | T07 MIG (lectura de procedimientos almacenados), M04 TAR (fórmulas de cargos), T04b, M08, M03 | M04 ya trata `FORMULA_CARGO*` y los procedimientos almacenados (15 menciones); falta la tarea de extracción en T07 sobre la base de la cooperativa piloto y registrar cada área inconclusa como hueco en `05-registro-huecos.md` con el anexo dueño | **Alto** |
| B-15 | RN-03 › Implicancias para CoopApps (L581) | 13 recomendaciones de diseño ARCA: certificados por tenant en bóveda con alertas de vencimiento, caché de ticket WSAA con bloqueo distribuido, cola de autorización con estados explícitos y serialización por CUIT/tipo/punto de venta, lotes B/C configurables, condición IVA del receptor (RG 5616), decimales, mapeo explícito de tributos, CAEA con **informe sin movimiento**, CESP/LQSP, padrón A13/constancia, Libro IVA en cuatro criterios, modo pasarela como API, QR RG 4892 | M06 FIS y T06 INT | Agregar fila en M06 §22 y T06 §22 mapeando cada recomendación a su RF/RN; el contenido existe en M06 ("sin movimiento" 8 menciones, "modo solo factura electrónica" 26, lote a consumidor final 1), así que la acción es citar RN-03 "Implicancias" en esos RF y confirmar que cada una de las 13 recomendaciones tenga destino | Medio: contenido presente, falta la cita |
| B-16 | RN-03 › Dudas abiertas (L611) | 9 dudas: CESP vigente, condición `VTO_CESP` del CAEA, parámetro 2427, uso del padrón A13, carpetas IN/OUT, estado "A" del Libro IVA, errores 10040/10242/10243 y cuatro defectos del código a no replicar | M06 FIS §21 y §6 | Convertir las dudas de negocio en PA-FIS y los defectos en reglas `Descartar` (no replicar) con cita RN-03. M06 ya menciona `VTO_CESP` y el parámetro 2427, sin vincularlos a la duda | Medio |
| B-17 | RN-05 §7.3 MercadoPago (L507) | Creación de solicitud, preferencia/link, consulta y registro de pagos, rendición, exportación por archivo | M07 COB y T06 INT | Citar RN-05 §7.3 junto a RN-13 en los RF de Mercado Pago (pasarela de O5 por DEC-015); el contenido está en M07 (13 menciones) y T06 (9) | Bajo: falta la cita |
| B-18 | RN-05 §7.4 Otras pasarelas (L519) | Patrón común de 9 pasarelas: Macro, PayFun, Pagos TIC, SiPago, Helipagos, ProvinciaNet, ProntoPago, NaranjaX, OffLine (`API = 3`, confirmación manual o por archivo) | T06 INT (catálogo de conectores, O11 por DEC-015) | Las nueve aparecen por nombre en M07 y T06; falta citar RN-05 §7.4 en sus fichas de conector y confirmar el estado `Extensión` (O11) de cada una | Bajo: falta la cita |
| B-19 | RN-05 §8 Tabla por cooperativa (L539) | 79 carpetas de interfaces de cobranza por cooperativa cliente de ProCoop | T06 INT §22 | Declarar `Descartada: formatos de otras cooperativas; se reemplazan por perfiles de formato configurables` (FIC 4.4) | Bajo |
| B-20 | RN-05 §9 Detalle especial: Laguna Larga (LAG) (L646) | Interfaz Red Link propia de LAG, SIRO con "0" antepuesto, rama ENARGAS | M07 COB, T06 INT, T07 MIG | Citar RN-05 §9 junto a RN-11 §1 en los RF del importador Red Link y SIRO; tener en cuenta DEC-081 (cooperativa piloto no definida; reemplazada por DEC-088: la piloto es LAG, por lo que estas interfaces son de la piloto) | Medio |
| B-21 | RN-05 §9.1 Qué hay en el código (L648) | Un importador, sin exportador propio; envío por exportador genérico | M07 COB, T06 INT | Igual que B-20 | Bajo |
| B-22 | RN-05 §9.2 Rendición Red Link de LAG (L656) | Estructura del archivo de rendición | T06 INT | Igual que B-20; la estructura de registro va al perfil de formato del conector | Medio |
| B-23 | RN-05 §9.3 Lo que la DEMO y el código sugieren para la configuración de LAG (L700) | Configuración inferida de entes y formatos | T07 MIG, T04 CFG | Citar en T07 (configuración inicial de la piloto) junto a RN-12 | Bajo |
| B-24 | RN-05 §12 Dudas abiertas (L786) | 9 dudas: configuración de `BANCOS`, sigla, "Documentos a cobrar", identificador Red Link, imputación por importe repetido, distribución automática en caja, pasarelas activas, comisiones y conciliación, siglas solo en enums | M07 COB §21 | Convertir en PA-COB las que siguen abiertas y marcar como resueltas las que cierran RN-11 y RN-12 (sigla, "Documentos a cobrar" como caja, pasarela SIRO). El riesgo de imputación por importes repetidos no se encontró en ningún anexo | Medio |
| B-25 | RN-07 › Reglas adicionales (segunda pasada) (L692) | Vales y materiales por OT/OM, sincronización por diferencia, órdenes pendientes, registro de lectura obligatorio en Alta y Reconexión, cambio de recorrido, catastro de la OT, consumo anterior, descripción acumulativa, nota de cambio de estado visible en caja, **numeración de órdenes automáticas sin bloqueo** (choques), orden especial | M10 TEC | Agregar RN-TEC con cita RN-07 "Reglas adicionales": lectura obligatoria al cerrar Alta/Reconexión, nota visible en caja, y reemplazo de la numeración sin bloqueo por secuencia atómica (`Reemplazar`). M10 ya menciona `Registra_EstadoMedidor`, `GenerarOrdenAutomatica`, la nota visible en caja y el cambio de recorrido; falta revisar el resto (vales por OT/OM, sincronización por diferencia, catastro, consumo anterior) y citar la sección | Medio |
| B-26 | RN-11 › Confirmado en la base demo (documento 12) (L35) | Configuración confirmada de LAG: rama SIRO aplicable, importador Red Link propio, **tope de $99.999,99 por vencimiento del código de barras SIRO**, "Documentos a cobrar" como caja, entes sin pagos parciales y con pagos fuera de término, pasarela SIRO como único botón, **70 % de las solicitudes online son recargas de energía prepaga** | M07 COB, M05 FAC (código de barras), T06 INT, T07 MIG; PA en M03/M07 | Citar en M05/M07 el tope por vencimiento del código de barras SIRO y la política de pagos parciales por ente. Registrar como pregunta la conclusión "el piloto necesita prepago desde el inicio", que choca con DEC-005 (piloto Internet) y DEC-081 (piloto no definida). El tope 99.999,99 aparece una vez en M05 sin cita. Actualización 05-11-2026: con DEC-088 la piloto es LAG; el prepago debe estar disponible al migrar LAG (después de O7; CTR-COB-21, PA-COB-15) | **Alto** |

### 4.2 Trazabilidad débil (solo declarada en la ficha inicial)

Estas unidades figuran en la fila "Fuentes consolidadas" de un anexo, pero ninguna fila con ID las cita. Su contenido puede estar en el anexo; falta la cita que lo demuestre. La columna "Evidencia adicional" resume una búsqueda de texto en los anexos.

| Unidad de fuente | Anexo que la declara en "Fuentes consolidadas" | Evidencia adicional | Acción propuesta |
|---|---|---|---|
| BASE §102.1 Propósito y criterio de revisión (L5192) | M02, M03, M13, M16, T01, T07, T11 | Las 36 fichas AGR (§102.4) sí se citan una por una; el criterio de revisión, los tres diagnósticos y la escala P0/P1/P2 no aparecen en ningún anexo (ver B-06) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| BASE §102.2 Diagnóstico principal (L5212) | M02, M03, M13, M16, T01, T07, T11 | Copia integrada de AGR §2 (ver B-07) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| BASE §102.2.1 Qué ya está y no hace falta volver a inventar (L5220) | M02, M03, M13, M16, T01, T07, T11 | Copia integrada de AGR §2.1 (ver B-08) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| BASE §102.3 Matriz de propuestas y trazabilidad (L5233) | M02, M03, M13, M16, T01, T07, T11 | Copia integrada de AGR §3; la búsqueda de "P0" no encuentra resultados en los anexos (ver B-09) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| BASE §102.9 Cómo incorporar estas propuestas sin perder control del alcance (L5798) | M02, M03, M13, M16, T01, T07, T11 | Copia integrada de AGR §9; el formato se aplica de hecho en `01-registro-decisiones.md` (ver B-10) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| FIC Hallazgo principal (§0) (L26) | T06 | T06 menciona el hallazgo una sola vez; el pedido de la lista de integraciones en uso es FIC §23, que sí está cubierta | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-01 §22 Dudas abiertas (L1093) | M04 | M04 menciona "dudas abiertas de RN" una vez, sin vincular cada duda con su PA-TAR | Vincular cada duda de RN-01 §22 con su PA-TAR (o marcarla resuelta) en M04 §21–§22. |
| RN-03 §11 Resumen de parámetros `Busca_V2_*` (L410) | M06 | El catálogo `Busca_V2_*` completo está en T04b partes 1–4; M06 no cita RN-03 §11 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-04 §2 Modelo de datos involucrado (L24) | M08 | Las tablas del modelo (`MORATAS`, `TABMORA`) se citan en M08 (29 menciones), T04, T05 y T07 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-06 §1 Alcance y fuentes (L14) | M01 | Sección de alcance y fuentes del propio documento RN; puede marcarse `Descartada: metadato` | Declarar `Descartada: metadato de la fuente` en M01 §22. |
| RN-10 §10 Mapas y GIS (L296) | M10, T06 | M10 y T06 desarrollan GIS y mapas sin citar RN-10 §10 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-11 §1.4 Rama "LAGU" de la rendición Red Link genérica (`PR/RedLink_1.cs`) (L168) | M07 | "LAGU" aparece en M07 (2 menciones) sin cita a RN-11 §1.4. *Reemplazado (v1.0): "aparece en M05, M06, M07, T02 y T07 (11 menciones)", conteo que incluía variantes en minúscula* | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §8 PayFun (L255) | M07, T06 | "PayFun" aparece en M07, T04b y T06 (23 menciones) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §11 Helipagos (L272) | M07, T06 | "Helipagos" aparece en M05, M07, M19, T04b y T06 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §13 ProntoPago (QR en facturas) (L283) | M07, T06 | "ProntoPago" aparece en M05, M07, M08, T04b y T06 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §18 Resto de `ProMod_WebService` (L360) | M07, T06 | `ProMod_WebService` se cita en M07 y T06 (3 menciones) | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §19.4 No replicar (L391) | M07, T06 | "No replicar" aparece en M06, M07, T04b y T06 sin vínculo con RN-13 §19.4 | Agregar la fila de la unidad en la §22 del anexo y citarla en la columna Origen de los RF/RN que la materializan. |
| RN-13 §20 Dudas abiertas (L397) | M07, T06 | No se encontró vínculo entre estas dudas y las PA de M07 o T06 | Vincular cada duda con su PA-COB / PA-INT (o marcarla resuelta) en M07 y T06. |

*Reemplazado (v1.0): la lista tenía 20 unidades; RN-07 §0 "Mapa de fuentes" (L10) y RN-07 §3.2 "Conexión nueva (alta de servicio)" (L289) salieron porque M10 ya las declara descartada y cubierta. La evidencia de RN-04 §2 y RN-11 §1.4 se recontó.*

Resumen de las brechas de 4.1 y 4.2: de las 26 unidades sin cobertura, 9 son metadatos o resúmenes que basta con declarar descartados (B-02, B-04, B-08, B-10, B-11, B-12, B-19, B-21, B-23); en 8 el contenido ya está en los anexos y falta solo la cita de origen (B-15, B-17, B-18, B-20, B-22, B-24 parcial, B-25 parcial, B-26 parcial); y 9 tienen contenido que no se encontró en los anexos o que es un límite de la propia fuente (B-01, B-03, B-05, B-06, B-07, B-09, B-13, B-14, B-16). Las de mayor impacto son B-05 (prevalencias internas de BASE §96), B-13 y B-14 (extracción del código inconclusa y fórmulas en procedimientos almacenados), B-26 (configuración confirmada de la DEMO, con un posible conflicto de piloto) y B-01 (advertencia de arquitectura).

### 4.3 Citas inconsistentes en los anexos

Citas de los anexos a secciones que no existen en la fuente citada. No restan cobertura, porque cada una se resolvió con el contexto, pero conviene corregirlas para que la trazabilidad sea verificable.

| Cita en el anexo | Anexo e ID | Problema | Corrección sugerida |
|---|---|---|---|
| RN-09 §14 | M13 encabezado | La fuente no tiene la sección §14 | RN-09 tiene 8 secciones. Por el contexto (V2 #373, #2525, #2565…) se refiere al grupo de parámetros STOCK de RN-09 §6.4: citar `RN-09 §6.4 STOCK` o directamente `V2 #n` |
| RN-10 §25 | M19 RF-POR-094 | La fuente no tiene la sección §25 | El texto de la fila es "§25 CU-25": es `BASE §25` (portal y aplicación del asociado). Corregir el marcador de fuente |
| CNX §25 | M19 RF-POR-122, M19 RF-POR-124 | La fuente no tiene la sección §25 | CNX llega hasta §12. Por el texto ("preferencias de comunicación") corresponde a `BASE §25` o a `CNX §2.7`. Corregir la cita |
| DFA §30, §31, §32, §33 y §34 (con título) | T07 §22 y RF-MIG-004, RF-MIG-014, RF-MIG-073 | **Resuelta en v1.1 de esta matriz:** T07 ya cita según la numeración vigente (`DFA §33`, `DFA §34 punto 4`, `DFA §33 (nota) y FIC 21`) y conserva las citas viejas entre comillas como "antes citadas como". *Reemplazado (v1.0):* T07 las cita con títulos que no corresponden a esas secciones de la DFA vigente: "§30 Estrategia de implementación por etapas", "§31 Migración de datos", "§32 Convivencia", "§33 Paralelo", "§34.4 módulos sin uso". En la DFA, §30 es el Módulo 29 (Integraciones externas), §31 los procesos transversales, §32 el modelo de datos de referencia, §33 la propuesta de etapas (incluye el criterio de aceptación del paralelo) y §34 los pendientes (el punto 4 pide validar qué módulos se usan) | Reescribir las citas de T07 según la numeración vigente: etapas y paralelo → `DFA §33`; módulos sin uso → `DFA §34` punto 4; migración y convivencia → `DFA §33` (nota) y `FIC 21`. La matriz cuenta estas secciones como cubiertas porque además las citan otros anexos (ver sección 10) |

RN-09 §14 ya solo aparece en la ficha inicial de M13. *Reemplazado (v1.0): "M13 encabezado, M13 RF-STK-028, RF-STK-029, RF-STK-032, RF-STK-034, RF-STK-043 (+14)".*

## 5. Matriz de decisiones

### 5.1 DEC → anexos

Para cada decisión de `01-registro-decisiones.md` se buscó su ID en todos los anexos (con listas `DEC-002 / 003` y rangos). Para las DEC-011 en adelante, que nacen de preguntas abiertas, se buscó además el ID de la PA de origen en los anexos declarados en la columna "Anexos afectados" del registro.

Estados:

- **Citada**: todos los anexos declarados existentes citan la DEC (para DEC-001..010, DEC-047 y DEC-072, que no declaran anexos, basta con que algún anexo la cite).
- **Reflejada solo vía PA (falta citar la DEC)**: los anexos declarados que no citan la DEC sí contienen la PA de origen, que en general sigue redactada como pregunta con la opción recomendada. Hay que pasarla a "Respondida (DEC-xxx)" y ajustar los requisitos marcados `A validar (PA-xxx)`.
- **Sin reflejo en anexos declarados**: al menos un anexo declarado no menciona ni la DEC ni su PA.
- **Sin reflejo**: ningún anexo menciona la DEC ni su PA.

La búsqueda es por identificador. Que un anexo no cite la DEC no prueba que su contenido contradiga la decisión; la sección 5.2 muestra una verificación de contenido de las de mayor impacto.

| DEC | Tema | Anexos que citan la DEC (n.º de menciones) | Anexos declarados que solo tratan la PA de origen | Anexos declarados sin ningún reflejo | Estado |
|---|---|---|---|---|---|
| DEC-001 | Stack tecnológico | M02 (2), M03 (1), M04 (2), M05 (1), M06 (2), M07 (3), M08 (1), M09 (1), M10 (4), M13 (1), M14 (3), M16 (1), M19 (4), T01 (11), T02 (2), T04b (4), T05 (1), T06 (2), T07 (2), T08 (11), T09 (1), T10 (2), T12 (3) | — | — | Citada |
| DEC-002 | Modelo de tenancy | M01 (2), M03 (4), M04 (2), M05 (1), M06 (2), M07 (2), M08 (1), M09 (3), M10 (1), M11 (2), M12 (2), M14 (1), M15 (2), M16 (2), M17 (1), M18 (1), M19 (1), T01 (21), T02 (5), T03 (2), T04 (4), T04b (2), T05 (6), T06 (1), T07 (8), T08 (13), T09 (1), T10 (7), T11 (1), T12 (3) | — | — | Citada |
| DEC-003 | Estilo de arquitectura | M01 (2), M02 (4), M03 (3), M04 (5), M06 (1), M07 (2), M08 (1), M09 (2), M12 (1), M13 (4), M14 (4), M15 (2), M16 (4), M19 (4), T01 (12), T03 (2), T06 (5), T07 (4), T08 (13), T09 (6), T10 (2), T11 (11), T12 (2) | — | — | Citada |
| DEC-004 | Nube | M07 (1), M09 (1), M11 (1), M19 (1), T01 (13), T08 (12), T09 (1), T10 (1), T12 (2) | — | — | Citada |
| DEC-005 | Piloto | M02 (2), M04 (2), M07 (2), M08 (2), M09 (1), M10 (2), M13 (1), M19 (2), T01 (3), T07 (4), T08 (2), T12 (3) | — | — | Citada |
| DEC-006 | Fechas | M04 (1), M09 (1), M16 (1), T01 (2), T07 (7), T08 (1), T11 (2), T12 (2) | — | — | Citada |
| DEC-007 | Alcance de módulos marginales | M02 (7), M03 (1), M04 (2), M05 (2), M08 (1), M09 (2), M11 (2), M12 (1), M13 (1), M15 (1), M16 (2), M17 (3), M18 (2), T01 (2), T02 (1), T03 (2), T04 (5), T04b (8), T05 (1), T06 (8), T08 (4), T12 (2) | — | — | Citada |
| DEC-008 | Modelo del muro | M09 (1), M17 (1), M19 (8), T02 (1), T08 (1), T09 (20), T12 (2) | — | — | Citada |
| DEC-009 | Momento de la contabilidad | M06 (1), M07 (1), M09 (1), M11 (1), M12 (6), M13 (5), M14 (6), M15 (4), M16 (4), T01 (2), T07 (7), T08 (1), T12 (2) | — | — | Citada |
| DEC-010 | Formato del entregable | M09 (1), T08 (3), T12 (2) | — | — | Citada |
| DEC-011 | PA-CAT-01 Momento de creación del contrato | M02 (2), M09 (3), M17 (1), M18 (1), T05 (2), T07 (1), T12 (17) | — | — | Citada |
| DEC-012 | PA-CAT-05 Jerarquía del catálogo | M02 (2), M04 (2), M05 (3), M17 (1), M18 (1), T05 (2), T07 (1), T12 (5) | — | — | Citada |
| DEC-013 | PA-CAT-10 Modalidad de equipos | M02 (9), M04 (2), M10 (4), M13 (5), T12 (10) | — | — | Citada |
| DEC-014 | PA-CFG-P1-05 + PA-CFG-P3-04 Reconexión al pagar | M07 (2), M08 (2), M10 (4), T06 (1), T12 (5) | — | — | Citada |
| DEC-015 | PA-CFG-P3-05 Pasarelas en O5 | M07 (2), T06 (13), T12 (2) | — | — | Citada |
| DEC-016 | PA-VEN-08 Facturación de la instalación del piloto | M05 (3), M11 (2), T12 (8) | — | — | Citada |
| DEC-017 | PA-CFG-P1-01 Numeración de titulares | M01 (9), T05 (2), T07 (1), T12 (2) | — | — | Citada |
| DEC-018 | PA-CFG-P2-06 ARCA sin respuesta en mostrador | M05 (2), M06 (3), M11 (4), T06 (2), T12 (3) | — | — | Citada |
| DEC-019 | PA-INS-03 Ola del capital social | M05 (3), M07 (4), M15 (2), M17 (6), T12 (6) | — | — | Citada |
| DEC-020 | PA-CFG-P1-03 Claves de mapas e IA | T01 (2), T04 (4), T06 (7), T12 (2) | — | — | Citada |
| DEC-021 | PA-CAT-02 Habilitar y publicar servicios | M02 (3), T01 (3), T12 (5) | — | — | Citada |
| DEC-022 | PA-CAT-03 Apagar oferta con contratos vigentes | M02 (3), T12 (2) | — | — | Citada |
| DEC-023 | PA-CAT-04 Altas automáticas | M01 (1), M02 (3), T05 (1), T12 (11) | — | — | Citada |
| DEC-024 | PA-CAT-06 Banco de sangre | M02 (2), M18 (5), T06 (1), T12 (4) | — | — | Citada |
| DEC-025 | PA-CAT-07 Copias entre tenants | M02 (3), T01 (5), T12 (2) | — | — | Citada |
| DEC-026 | PA-CAT-08 Plantillas de plataforma | M02 (5), T01 (5), T12 (2) | — | — | Citada |
| DEC-027 | PA-CAT-09 Provisorio | M02 (3), M05 (3), T12 (3) | — | — | Citada |
| DEC-028 | PA-CAT-11 Contratos iguales en una cuenta | M02 (4), M03 (2), T12 (8) | — | — | Citada |
| DEC-029 | PA-CAT-12 Deuda previa en el domicilio | M02 (3), M07 (5), M08 (1), T12 (12) | — | — | Citada |
| DEC-030 | PA-CAT-13 Modalidades de gas | M02 (2), M03 (2), M04 (2), T12 (7) | — | — | Citada |
| DEC-031 | PA-CAT-14 Suspensión voluntaria | M02 (2), M08 (2), T12 (5) | — | — | Citada |
| DEC-032 | PA-CAT-15 Vigencia del cambio de plan | M02 (3), M04 (3), T12 (8) | — | — | Citada |
| DEC-033 | PA-CAT-16 Hecho de activación | M02 (2), M05 (3), M10 (2), T12 (8) | — | — | Citada |
| DEC-034 | PA-FAC-01 Modalidad de factura por defecto | M05 (4), T12 (14) | — | — | Citada |
| DEC-035 | PA-FAC-04 Asignación del número fiscal | M05 (4), M06 (3), T12 (3) | — | — | Citada; reemplazada en el comprobante rechazado por ARCA por DEC-107 (10-11-2026) |
| DEC-036 | PA-FAC-05 Factura con total negativo | M03 (2), M05 (3), T12 (5) | — | — | Citada |
| DEC-037 | PA-FAC-06 Factura en cero | M05 (3), T12 (13) | — | — | Citada |
| DEC-038 | PA-FAC-19 Caída de ARCA en masiva | M05 (2), M06 (3), T06 (2), T12 (8) | — | — | Citada |
| DEC-039 | PA-TEC-01 Cierre de OT | M10 (2), T12 (5) | — | — | Citada |
| DEC-040 | PA-TEC-04 Factibilidad obligatoria | M02 (3), M10 (4), T12 (7) | — | — | Citada |
| DEC-041 | PA-TEC-09 Aprovisionamiento | M10 (2), T06 (1), T12 (7) | — | — | Citada |
| DEC-042 | PA-TEC-10 Sistemas de red del piloto | M10 (2), T06 (3), T12 (5) | — | — | Citada |
| DEC-043 | PA-PER-01 Verificación del vínculo usuario-titular | M01 (11), M19 (6), T02 (5), T05 (1), T12 (2) | — | — | Citada |
| DEC-044 | PA-PER-02 Documento duplicado | M01 (4), T12 (2) | — | — | Citada |
| DEC-045 | PA-PER-06 Deuda en cambio de titularidad | M01 (3), M07 (5), M08 (4), T12 (14) | — | — | Citada |
| DEC-046 | PA-PER-13 Proveedor geográfico | M01 (3), T04 (10), T06 (10), T12 (2) | — | — | Citada |
| DEC-047 | Política de preguntas | T06 (2), T12 (2) | — | — | Citada |
| DEC-048 | PA-COB-01 Imputación de pagos | M07 (4), T12 (7) | — | — | Citada |
| DEC-049 | PA-COB-03 Créditos entre servicios | M07 (4), T12 (5) | — | — | Citada |
| DEC-050 | PA-COB-09 Identificador de pago en la migración | M05 (3), M07 (4), T05 (5), T06 (2), T07 (5), T12 (2) | — | — | Citada |
| DEC-051 | PA-CFG-P1-04 Interés en pago online de factura vencida | M07 (2), M08 (2), T06 (1), T12 (3) | — | — | Citada |
| DEC-052 | PA-CFG-P3-01 Plazo de prescripción de deuda | M07 (2), M08 (4), T04b (1), T05 (3), T09 (2), T12 (2) | — | — | Citada |
| DEC-053 | PA-FIS-03 Certificado ARCA | M06 (5), T06 (2), T12 (3) | — | — | Citada |
| DEC-054 | PA-FIS-09 Jurisdicciones de IIBB | M06 (5), T06 (2), T12 (4) | — | — | Citada |
| DEC-055 | PA-CRM-06 Proveedor de WhatsApp | M09 (2), T06 (2), T09 (7), T12 (4) | — | — | Citada |
| DEC-056 | PA-CRM-09 IA en atención | M09 (2), T06 (5), T09 (3), T12 (4) | — | — | Citada |
| DEC-057 | PA-CRM-15 Botón de baja | M09 (5), M19 (3), T12 (15) | — | — | Citada |
| DEC-058 | PA-SUE-01 Estrategia de sueldos | M14 (1), M15 (3), M16 (3), T05 (3), T06 (2), T12 (2) | — | — | Citada |
| DEC-059 | PA-TES-16 Tesorería en O5 | M14 (1), T05 (2), T06 (5), T12 (2) | — | — | Citada |
| DEC-060 | PA-MED-08 Generación distribuida | M02 (6), M03 (4), M04 (13), M05 (2), T05 (2), T12 (10) | — | — | Citada |
| DEC-061 | PA-INS-02 Capital social en la factura | M05 (3), M17 (4), T12 (9) | — | — | Citada |
| DEC-062 | PA-PLA-01 Región de alojamiento | T01 (6), T08 (3), T12 (2) | — | — | Citada |
| DEC-063 | PA-PLA-02/03 Continuidad y niveles de servicio | T01 (8), T08 (18), T12 (2) | — | — | Citada |
| DEC-064 | PA-PLA-14 Varias personas jurídicas por tenant | M02 (5), M05 (20), M06 (28), M07 (12), M08 (3), M11 (1), M12 (2), M14 (7), M15 (15), M16 (9), T01 (15), T02 (1), T03 (1), T04 (37), T04b (11), T05 (16), T06 (3), T07 (7), T10 (2), T11 (7), T12 (5) | — | — | Citada |
| DEC-065 | PA-PLA-08/09 Modelo comercial y facturación del SaaS | M05 (3), T01 (8), T05 (4), T06 (3), T09 (1), T12 (2) | — | — | Citada |
| DEC-066 | PA-IAM-01 Ingreso del socio | M19 (2), T02 (3), T12 (2) | — | — | Citada |
| DEC-067 | PA-IAM-02 CiDi Córdoba | M19 (8), T02 (2), T06 (5), T12 (2) | — | — | Citada |
| DEC-068 | PA-MIG-04 Orden de reemplazo de ProCoop | M15 (1), T06 (1), T07 (8), T12 (4) | — | — | Citada |
| DEC-069 | PA-CON-03 y PA-MIG-18 Contabilidad durante la convivencia | M15 (4), T05 (1), T07 (4), T12 (5) | — | — | Citada |
| DEC-070 | PA-MIG-01 Profundidad del histórico | M12 (1), T05 (8), T07 (14), T12 (3) | — | — | Citada |
| DEC-071 | PA-SOC-14 Ola de adherentes | M01 (5), M02 (11), M04 (3), M05 (3), M18 (6), M19 (3), T05 (7), T07 (3), T11 (3), T12 (10) | — | — | Citada |
| DEC-072 | Preguntas no consultadas (política DEC-047) | M02 (3), M04 (1), M06 (2), M07 (1), M10 (2), M14 (1), M15 (1), T04 (1), T04b (1), T12 (38) | — | — | Citada |
| DEC-073 | Cómo queda especificado cada servicio de punta a punta | M02 (1), T12 (6) | — | M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19 | **Sin reflejo en anexos declarados** |
| DEC-074 | PA-INT-02 Bóveda de secretos | M02 (2), M03 (4), M06 (3), M19 (1), T01 (4), T05 (8), T06 (5), T08 (1) | — | — | Citada |
| DEC-075 | PA-NFR-03 Perfil de capacidad | T01 (2), T05 (5), T08 (1) | — | — | Citada |
| DEC-076 | PA-NFR-07 Rol ante la Ley 25.326 | T01 (2), T05 (3), T08 (3) | — | — | Citada |
| DEC-077 | PA-COM-04 Contratación de mensajería | T01 (3), T06 (4), T09 (4) | — | — | Citada |
| DEC-078 | PA-INT-22 y PA-WFL-06 Firma de documentos | M16 (7), M17 (8), T04 (1), T06 (6), T11 (6) | — | — | Citada |
| DEC-079 | PA-WFL-04 Diseñador de trámites | — | T11 | — | Reflejada solo vía PA (falta citar la DEC) |
| DEC-080 | PA-WFL-05 Motor de PDF | T03 (2), T08 (1) | T11 | — | Reflejada solo vía PA (falta citar la DEC) |
| DEC-081 | Cooperativa piloto | M07 (1), T06 (2), T07 (4) | — | — | Citada; reemplazada por DEC-088 |
| DEC-088 | Cooperativa piloto: Laguna Larga (reemplaza DEC-081) | M07 (1), T06 (2), T07 (4) | — | — | Citada (05-11-2026) |
| DEC-082 | PA-CAT-17 Gas envasado (HUE-GAS-02) | M02 (5), M03 (2), M04 (4), M10 (3), M13 (3), T11 (1), T12 (1) | — | — | Citada |
| DEC-083 | PA-CAT-18 Conceptos de terceros sin servicio propio (HUECO-TAS-01) | M02 (5), M06 (3), M08 (3), T05 (3), T12 (1) | — | T07 | **Sin reflejo en anexos declarados** |
| DEC-084 | PA-CAT-19 Correo electrónico y pack SMS (HUECO-OTR-03) | M02 (7), M04 (10), M10 (7), T05 (1), T06 (4), T11 (2), T12 (1) | — | — | Citada |
| DEC-085 | Corrección de volumen de gas (HUE-GAS-03, PA-TAR-19) | M02 (2), M03 (16), M04 (9), M12 (6), T05 (8), T06 (2), T07 (2), T12 (3) | — | — | Citada |
| DEC-086 | Destino único de `BENSOC` (HUECO-SEP-02) | M02 (9), M04 (4), T05 (11), T07 (3), T09 (7), T12 (1) | — | M18 | **Sin reflejo en anexos declarados** |
| DEC-087 | PA-DAT-01 y PA-DAT-02 (T05) | M04 (1), M05 (12), M07 (28), M08 (3), M10 (2), M14 (3), M15 (9), M19 (5), T04 (1), T05 (15), T06 (2), T07 (2), T08 (3), T11 (1) | — | — | Citada |
| DEC-093 | Factura agrupada sin mezclar LQSP y factura común (PA-FIS-23) | M02 (7), M05 (11), M06 (13), T03 (4), T05 (8), T11 (2) | — | — | Citada (10-11-2026) |
| DEC-094 | Vía de autorización de la LQSP: CESP (PA-FIS-24) | M05 (1), M06 (11), T05 (2) | — | — | Citada (10-11-2026) |
| DEC-095 | Obligaciones y exenciones propias de la cooperativa (PA-FIS-25) | M06 (30), M14 (11), M15 (18), M17 (14), T05 (21), T09 (1), T11 (11) | — | — | Citada (10-11-2026) |
| DEC-096 | Varias entidades jurídicas por tenant: alcance completo (completa DEC-064) | M01 (12), M15 (13), M17 (85), T02 (21), T03 (4), T04 (15), T05 (41), T07 (6), T10 (17), T11 (9) | — | — | Citada (10-11-2026) |
| DEC-097 | Persona única en todos los maestros (cambia RN-CMP-001) | M01 (26), M06 (7), M11 (16), M12 (30), M16 (11), M18 (20), T03 (9), T05 (20), T07 (10) | — | — | Citada (10-11-2026) |
| DEC-098 | Sucursales desde `PTOVENTA.SUC_COM` (corrige RF-CFG-142) | T04 (10), T05 (5), T07 (11) | — | — | Citada (10-11-2026) |
| DEC-099 | Personas migradas sin documento (`documentPending`) | M01 (25), M02 (2), M05 (10), M06 (5), M09 (7), M11 (1), M16 (1), M18 (2), T03 (6), T05 (5), T07 (11), T11 (3) | — | — | Citada (10-11-2026) |
| DEC-100 | Verificador de integridad referencial | T05 (9), T08 (9), T11 (11) | — | — | Citada (10-11-2026) |
| DEC-101 | Cajas sin rendir en la posición de tesorería | M07 (7), M14 (10), T03 (2) | — | — | Citada (10-11-2026) |
| DEC-102 | Uso del suministro como condición de la alícuota de IVA (PA-FIS-26) | M01 (6), M06 (14), T05 (7), T07 (6) | — | — | Citada (10-11-2026) |
| DEC-103 | Supresión de secretos y escaneo previo en la migración (amplía DEC-091 y DEC-092) | T05 (4), T07 (24), T08 (6), T11 (3) | — | — | Citada (10-11-2026) |
| DEC-104 | Correcciones internas del contraste del documento externo | M01 (9), M04 (3), M05 (5), M07 (2), M08 (7), M10 (3), T02 (6), T05 (8), T06 (8), T07 (12), T09 (7) | — | T04 (aplica la corrección de RF-CFG-142 citando DEC-098) | Citada; falta la cita en T04 |
| DEC-105 | Fórmulas en tarifas con preferencia declarativa y justificación | M04 (20), T03 (2), T05 (4) | — | — | Citada (10-11-2026) |
| DEC-106 | Tope de vencimientos como parámetro del tenant | M05 (38), M07 (24), M08 (6), T05 (10), T06 (5) | — | — | Citada (10-11-2026) |
| DEC-107 | Comprobante rechazado por ARCA vuelve a borrador y libera su número (reemplaza DEC-035 en ese punto) | M03 (1), M05 (70), M06 (26), M07 (33), M08 (6), M11 (1), M14 (1), M19 (7), T02 (3), T03 (2), T05 (16), T11 (6) | — | — | Citada (10-11-2026) |
| DEC-108 | GestionApps no es fuente | T05 (2), T11 (2) | — | — (declara solo el maestro) | Citada en el maestro; sin anexos declarados |

### 5.2 Verificación de contenido de decisiones de alto impacto

Búsqueda de texto de la consecuencia principal de la decisión en los anexos declarados, repetida el 05-11-2026. La columna v1.0 conserva el resultado anterior.

| DEC | Término buscado | Resultado v1.1 | Lectura v1.1 | Resultado v1.0 (reemplazado) |
|---|---|---|---|---|
| DEC-064 Varias personas jurídicas por tenant | `legalEntit` (`legalEntities`, `legalEntityId`) | T04: 47, M05: 33, M06: 46, M15: 32, M16: 47; los cinco citan DEC-064 | **Brecha cerrada**: T04 RF-CFG-134..143 (PRO-O0-13, PRO-O1-11, PRO-O9-01/02, PRO-O7-11; antes PRO-O11-06, DEC-089), M06 RF-FIS-167, M05 RF-FAC-177/179, M15 RF-CON-162; REQ-DEC-064 del plan queda cubierto por RF (plan §18 y §19 C-01) | 0 menciones en T04, M05, M06, M15 y M16: brecha real |
| DEC-043 Verificación del vínculo usuario-titular | "código de factura"; DEC-043 | M19: 2 y 6 citas; T02: 3 y 5 citas | **Brecha cerrada**: método de código al contacto verificado en M01 RF-PER-173 y M19 RF-POR-179 (PRO-O2-04 y PRO-O2-16) | 0 menciones en M19 y T02: brecha probable |
| DEC-014 Reconexión automática al pagar | "reconexión automática"; DEC-014 | M08: 5, M10: 2, M07: 0 (M07 cita DEC-014 en RF-COB-078) | Aplicada en M07, M08 y M10; el disparo al confirmar el pago está en RF-COB-078 | M08: 6, M10: 2, M07: 0; faltaba el disparo en M07 |
| DEC-052 Prescripción por tipo de obligación | "prescripción"; DEC-052 | M07: 11 y 2 citas | Contenido y cita presentes | M07: 4, sin cita |
| DEC-066 Ingreso del socio con OTP | "OTP"; DEC-066 | M19: 22 y 2 citas | Contenido y cita presentes | M19: 19, sin cita |
| DEC-080 Motor de PDF | "Chromium"; DEC-080 | T08: 3 y 1 cita; T03: 2 y 2 citas; T11: 0 y 0 (PA-WFL-05 en RF-WFL-175 "A validar") | Falta en T11, dueño del render de documentos: pasar PA-WFL-05 a "Respondida (DEC-080)" y quitar el "A validar" de RF-WFL-175 | T08: 2, T03: 0 |
| DEC-081 Cooperativa piloto no definida (reemplazada por DEC-088: piloto LAG) | "cooperativa piloto"; DEC-081 | T06: 16 y 2 citas | Contenido y cita presentes; T06 §12.3 actualizado a DEC-088 | T06: 13, sin cita |
| DEC-034 Factura separada por servicio por defecto | "separada por servicio"; DEC-034 | M05: 2 y 4 citas | Contenido y cita presentes | M05: 0 (solo la PA-FAC-01) |
| DEC-079 Diseñador de trámites | DEC-079; PA-WFL-04 | T11: 0 y 2 (RF-WFL-076 "A validar (PA-WFL-04)") | Falta citar la DEC en T11 y cerrar el "A validar" | (no verificada en v1.0) |
| DEC-083 Conceptos de terceros sobre contrato propio | DEC-083; "convenio de terceros"; HUECO-TAS-01 | T07: 0, 0 y 0; T07 migra `TERCEROS` a `thirdPartyAgreements` y clasifica tributos con RN-MIG-051 (HUECO-TAS-03) | **Brecha de cita y de regla de migración** en T07: falta indicar que los conceptos "Fijos" de terceros se migran colgados de un contrato accesorio propio del socio | (DEC nueva) |
| DEC-086 Destino único de `BENSOC` | DEC-086; `BENSOC`; `serviceBeneficiaries` | M18: 0, 8 y 6; RF-SOC-024 dice "M18 es el destino único de `BENSOC` (HUECO-SEP-02)" | Contenido presente en M18; falta citar DEC-086 en RF-SOC-024 y en M18 §22 | (DEC nueva) |

### 5.3 Decisiones sin reflejo

- Ninguna decisión carece por completo de reflejo: las 87 se citan al menos en un anexo.
- **82 decisiones están citadas** en todos los anexos declarados (o, si no declaran anexos, en al menos uno).
- **2 decisiones se reflejan solo vía su PA**: DEC-079 y DEC-080, ambas en T11 (RF-WFL-076 y RF-WFL-175 siguen "A validar"; ver 5.2).
- **3 decisiones no tienen reflejo en al menos uno de los anexos declarados**: DEC-073 (declara M02–M19 porque T12 los recorre; solo M02 la cita, y no es una brecha), DEC-083 (falta en T07) y DEC-086 (falta la cita en M18, con el contenido presente).
- *Reemplazado (v1.0, sobre 81 decisiones): 13 citadas, 20 solo vía PA y 48 sin reflejo en al menos un anexo declarado, con brechas reales de contenido en DEC-064 y DEC-043, hoy cerradas.*
- **Versión 1.2 (10-11-2026)**: se agregan DEC-093 a DEC-108 (16 decisiones). 14 están citadas en todos sus anexos declarados; DEC-104 falta en T04, que aplica su corrección de RF-CFG-142 citando DEC-098; DEC-108 solo declara el maestro y la mencionan T05 y T11. Los conteos de arriba (87 decisiones) no cambian. DEC-089 a DEC-092 (05-11-2026) todavía no tienen fila en 5.1: quedan para la próxima regeneración.

Propuesta: en cada anexo afectado, pasar la PA a "Respondida (DEC-xxx)", reemplazar `A validar (PA-xxx)` por la decisión en los RF/RN y agregar la DEC a la fila correspondiente de la §22.

## 6. Matriz inversa: anexo → fuentes

Cantidad de citas de cada fuente por anexo (una cita = una mención con marcador de fuente o un ID de la base en una línea), archivos RN citados, unidades de fuente que el anexo cubre directamente y tablas del catálogo de las que es dueño según T07 §19.

| Anexo | BASE | AGR | CNX | DFA | FIC | RN (archivos citados) | Unidades de fuente cubiertas directamente | Tablas CAT de las que es dueño (T07) |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| M01 | 264 | 76 | 6 | 65 | 0 | RN-06 (89), RN-09 (2) | 96 | 11 |
| M02 | 364 | 70 | 7 | 22 | 0 | RN-01 (28), RN-06 (91), RN-09 (9) | 123 | 24 |
| M03 | 199 | 47 | 13 | 32 | 21 | RN-01 (18), RN-06 (222), RN-09 (8), RN-10 (9) | 113 | 24 |
| M04 | 245 | 77 | 7 | 31 | 10 | RN-01 (330), RN-06 (15), RN-07 (37), RN-09 (3) | 141 | 31 |
| M05 | 256 | 79 | 8 | 22 | 5 | RN-01 (1), RN-02 (233), RN-05 (2), RN-09 (4), RN-11 (10) | 137 | 30 |
| M06 | 184 | 62 | 3 | 13 | 77 | RN-01 (26), RN-02 (32), RN-03 (202), RN-08 (23), RN-09 (38), RN-11 (8) | 143 | 35 |
| M07 | 241 | 74 | 4 | 22 | 11 | RN-01 (1), RN-05 (182), RN-09 (2), RN-11 (25), RN-12 (14), RN-13 (51) | 160 | 31 |
| M08 | 283 | 78 | 4 | 37 | 0 | RN-04 (226), RN-07 (10) | 112 | 22 |
| M09 | 330 | 84 | 36 | 60 | 32 | RN-06 (19), RN-07 (137), RN-09 (32), RN-10 (37) | 111 | 40 |
| M10 | 264 | 74 | 21 | 39 | 16 | RN-07 (144), RN-08 (1), RN-09 (2), RN-10 (10) | 125 | 69 |
| M11 | 137 | 25 | 4 | 28 | 7 | RN-02 (23), RN-08 (38), RN-09 (38) | 85 | 11 |
| M12 | 117 | 54 | 4 | 17 | 14 | RN-08 (80), RN-09 (47) | 81 | 34 |
| M13 | 174 | 64 | 16 | 19 | 0 | RN-08 (148), RN-09 (25) | 100 | 40 |
| M14 | 131 | 67 | 6 | 24 | 20 | RN-08 (231), RN-09 (27), RN-13 (47) | 98 | 20 |
| M15 | 238 | 80 | 7 | 19 | 10 | RN-05 (7), RN-06 (3), RN-08 (192), RN-09 (38) | 138 | 26 |
| M16 | 265 | 67 | 5 | 25 | 18 | RN-08 (72), RN-09 (4) | 88 | 53 |
| M17 | 109 | 49 | 2 | 16 | 0 | RN-02 (12), RN-04 (6), RN-05 (5), RN-06 (37), RN-08 (8), RN-09 (2), RN-10 (1) | 69 | 10 |
| M18 | 187 | 41 | 4 | 19 | 0 | RN-01 (13), RN-02 (4), RN-05 (3), RN-06 (37), RN-07 (6), RN-08 (7), RN-09 (1), RN-10 (10) | 67 | 26 |
| M19 | 215 | 81 | 53 | 19 | 11 | RN-09 (3), RN-10 (66) | 97 | 2 |
| T01 | 265 | 189 | 88 | 14 | 13 | RN-09 (46) | 148 | 2 |
| T02 | 264 | 86 | 56 | 31 | 0 | RN-09 (64), RN-10 (10), RN-13 (2) | 88 | 14 |
| T03 | 347 | 45 | 340 | 43 | 0 | RN-09 (38), RN-10 (22) | 123 | 0 |
| T04 | 160 | 69 | 14 | 39 | 0 | RN-04 (2), RN-09 (69) | 76 | 54 |
| T04b-p1 | 0 | 1 | 0 | 0 | 0 | RN-09 (4) | 7 | 0 |
| T04b-p2 | 3 | 0 | 1 | 0 | 0 | RN-01 (22), RN-02 (3), RN-09 (6) | 25 | 0 |
| T04b-p3 | 1 | 1 | 2 | 0 | 0 | RN-04 (5), RN-05 (6), RN-09 (12) | 14 | 0 |
| T04b-p4 | 1 | 0 | 2 | 0 | 0 | RN-07 (3), RN-08 (4), RN-09 (4) | 7 | 0 |
| T05 | 28 | 1 | 0 | 0 | 0 | RN-01 (1), RN-08 (1) | 14 | 0 |
| T06 | 156 | 57 | 23 | 9 | 147 | RN-03 (29), RN-10 (102), RN-12 (24), RN-13 (72) | 219 | 11 |
| T07 | 118 | 56 | 7 | 52 | 34 | RN-01 (3), RN-03 (2), RN-04 (2), RN-06 (3), RN-11 (35) | 65 | 3 |
| T08 | 320 | 207 | 134 | 19 | 0 | RN-09 (63), RN-10 (15), RN-13 (22) | 128 | 0 |
| T09 | 117 | 90 | 173 | 15 | 2 | RN-04 (13), RN-07 (23), RN-09 (28), RN-10 (38) | 115 | 21 |
| T10 | 210 | 52 | 24 | 18 | 18 | RN-01 (5), RN-04 (6), RN-05 (6), RN-06 (5), RN-07 (14), RN-08 (4), RN-10 (11), RN-11 (2) | 115 | 11 |
| T11 | 183 | 122 | 31 | 33 | 25 | RN-04 (4), RN-06 (8), RN-07 (19), RN-08 (9), RN-09 (7), RN-10 (26) | 126 | 14 |
| T12-p1 | 54 | 1 | 0 | 0 | 0 | — | 14 | 0 |
| T12-p2 | 45 | 1 | 0 | 0 | 0 | — | 9 | 0 |

## 7. Matriz BASE

Fuente: `docs/base-funcional/PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md` (rectora).

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) ProCoop: relevamiento público y base funcional para un sistema propio (L1) | M15, T10, T07, M01, M02, M03, M04 (+29) | ver subsecciones | Cubierta (por subsecciones) |
| Advertencia principal para la definición de arquitectura (L7) | — | — | **SIN COBERTURA** |
| Propósito y alcance (L15) | — | — | **SIN COBERTURA** |
| §1 Módulos y complementos publicados por ProCoop (L33) | M02, T01, T03 | M02: encab., RF-CAT-067, RF-CAT-110 … · T01: encab., RF-PLA-116, §7.4.1 · T03: SM-ADM-116, SM-ADM-204, SM-PWS-012 … | Cubierta |
| §2 Organización propuesta del sistema propio (L60) | M05, M11, T01, T11 | M05: encab., §22: Adoptado (con §103) · M11: encab., RF-VEN-104, CTR-VEN-02 … · T01: encab., RF-PLA-001, RF-PLA-024 … · T11: encab., RF-WFL-210, CU-WFL-08 | Cubierta |
| › Estructura multitenant — requisito informado (§2) (L70) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Marca y landing por cooperativa — requisito informado (§2) (L83) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Facturación por servicio y agrupación opcional — requisito informado (§2) (L89) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Autogestión y ERP — ampliación informada (§2) (L95) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Servicios habilitables y alta pública — ampliación informada (§2) (L99) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Configuración independiente, copia de servicios y comunidad (§2) (L105) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Titularidad y particularidades por servicio — ampliación informada (§2) (L111) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| › Espacios de trabajo (§2) (L117) | M05, M11, T01, T11 | hereda de §2 | Cubierta (por sección) |
| §3 Personas, asociados y relaciones (L133) | M01, M16, M17, M19, T09 | M01: encab., §1, §2.3 … · M16: RF-SUE-004, CTR-SUE-13 · M17: encab., RF-INS-001, RF-INS-004 … · M19: encab., §1, RF-POR-001 … · (+1 anexos) | Cubierta |
| › Objetivo (§3) (L135) | M01, M16, M17, M19, T09 | hereda de §3 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§3) (L139) | M01, M16, M17, M19, T09 | hereda de §3 | Cubierta (por sección) |
| › Alcance funcional (§3) (L142) | M01, M16, M17, M19, T09 | hereda de §3 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-03 (§3) (L163) | M01, M07, M10, M15, M19, T01, T02 (+1) | M01: RF-PER-002, RF-PER-156, §9.1 … · M07: §16.1, §18 · M10: §16 · M15: §16, §18 · (+4 anexos) | Cubierta |
| › Datos y valores de ejemplo para precarga (§3) (L179) | M01, M16, M17, M19, T09 | hereda de §3 | Cubierta (por sección) |
| §4 Inmuebles, contratos y suministros (L188) | M01, T10 | M01: encab., §1, RF-PER-073 … · T10: CTR-BIA-05 | Cubierta |
| › Objetivo (§4) (L190) | M01, T10 | hereda de §4 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§4) (L194) | M01, T10 | hereda de §4 | Cubierta (por sección) |
| › Alcance funcional (§4) (L197) | M01, T10 | hereda de §4 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-04 (§4) (L219) | M01, M07, M09, T02, T04 | M01: §9.8, §16, PER-001 … · M07: §16.1, §18 · M09: §16, §18 · T02: TEN-001 · (+1 anexos) | Cubierta |
| › Datos y valores de ejemplo para precarga (§4) (L235) | M01, T10 | hereda de §4 | Cubierta (por sección) |
| §5 Catálogo de prestaciones y planes (L244) | M02, M14 | M02: encab., RF-CAT-031, RF-CAT-036 … · M14: CTR-TES-08 | Cubierta |
| › Objetivo (§5) (L246) | M02, M14 | hereda de §5 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§5) (L250) | M02, M14 | hereda de §5 | Cubierta (por sección) |
| › Alcance funcional (§5) (L253) | M02, M14 | hereda de §5 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-05 (§5) (L275) | M02 | M02: encab., RF-CAT-041, RF-CAT-043 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§5) (L291) | M02, M04, M09, M10, M11, M13, M19 (+2) | M02: RF-CAT-033, RF-CAT-041, RF-CAT-051 … · M04: §9.3, ESC-TAR-31, §18 · M09: §16, §18 · M10: §18 · (+5 anexos) | Cubierta |
| §6 Tarifas y motor de cálculo (L300) | M04, M11, T12-p2 | M04: encab., §1, §2.3 … · M11: RF-VEN-003 · T12-p2: §2 | Cubierta |
| › Objetivo (§6) (L302) | M04, M11, T12-p2 | hereda de §6 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§6) (L306) | M04, M11, T12-p2 | hereda de §6 | Cubierta (por sección) |
| › Alcance funcional (§6) (L309) | M04, M11, T12-p2 | hereda de §6 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-06 (§6) (L333) | M04 | M04: encab., RF-TAR-003, RF-TAR-092 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§6) (L349) | M04, M11, T12-p2 | hereda de §6 | Cubierta (por sección) |
| §7 Equipos y medidores (L359) | M03, M06, M13 | M03: encab., §1, §2.3 … · M06: RF-FIS-001, RF-FIS-002, RF-FIS-008 … · M13: encab., RF-STK-001, RF-STK-044 … | Cubierta |
| › Objetivo (§7) (L361) | M03, M06, M13 | hereda de §7 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§7) (L365) | M03, M06, M13 | hereda de §7 | Cubierta (por sección) |
| › Alcance funcional (§7) (L368) | M03, M06, M13 | hereda de §7 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-07 (§7) (L386) | M03, M07, M13 | M03: encab., RF-MED-018, §16 … · M07: §16.1 · M13: encab., RF-STK-047, RF-STK-050 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§7) (L402) | M03, M06, M13 | hereda de §7 | Cubierta (por sección) |
| §8 Lecturas y relevamiento en campo (L411) | M03 | M03: encab., §1, §2.3 … | Cubierta |
| › Objetivo (§8) (L413) | M03 | hereda de §8 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§8) (L417) | M03 | hereda de §8 | Cubierta (por sección) |
| › Alcance funcional (§8) (L420) | M03 | hereda de §8 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-08 (§8) (L440) | M03 | M03: encab., RF-MED-043, RF-MED-046 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§8) (L456) | M03 | hereda de §8 | Cubierta (por sección) |
| §9 Control de consumos (L465) | M03 | M03: encab., §1, §2.3 … | Cubierta |
| › Objetivo (§9) (L467) | M03 | hereda de §9 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§9) (L471) | M03 | hereda de §9 | Cubierta (por sección) |
| › Alcance funcional (§9) (L474) | M03 | hereda de §9 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-09 (§9) (L491) | M03 | M03: encab., RF-MED-061, RF-MED-066 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§9) (L507) | M03 | hereda de §9 | Cubierta (por sección) |
| §10 Liquidación y facturación (L516) | M05, M06, T06 | M05: encab., §1, RF-FAC-001 … · M06: §16 · T06: RF-INT-038, §12.4, FI-INT-02 | Cubierta |
| › Objetivo (§10) (L518) | M05, M06, T06 | hereda de §10 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§10) (L522) | M05, M06, T06 | hereda de §10 | Cubierta (por sección) |
| › Alcance funcional (§10) (L529) | M05, M06, T06 | hereda de §10 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-10 (§10) (L557) | M05, M06 | M05: encab., RF-FAC-059, §16 … · M06: §16, RF-FIS-039, RN-FIS-040 | Cubierta |
| › Datos y valores de ejemplo para precarga (§10) (L573) | M05, M06, T06 | hereda de §10 | Cubierta (por sección) |
| §11 Cuenta corriente (L582) | M07 | M07: encab., RF-COB-001, RF-COB-002 … | Cubierta |
| › Objetivo (§11) (L584) | M07 | hereda de §11 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§11) (L588) | M07 | hereda de §11 | Cubierta (por sección) |
| › Alcance funcional (§11) (L591) | M07 | hereda de §11 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-11 (§11) (L616) | M07 | M07: RF-COB-010, §9.3, §10 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§11) (L632) | M07 | hereda de §11 | Cubierta (por sección) |
| §12 Cajas y recepción de pagos (L641) | M07 | M07: encab., RF-COB-035, RF-COB-056 … | Cubierta |
| › Objetivo (§12) (L643) | M07 | hereda de §12 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§12) (L647) | M07 | hereda de §12 | Cubierta (por sección) |
| › Alcance funcional (§12) (L650) | M07 | hereda de §12 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-12 (§12) (L671) | M07 | M07: RF-COB-056, RF-COB-080, §9.5 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§12) (L687) | M07 | hereda de §12 | Cubierta (por sección) |
| §13 Integraciones de cobro y conciliación (L696) | M07, M14, T06 | M07: encab., §1, RF-COB-141 … · M14: encab., §1, RF-TES-043 … · T06: encab., RF-INT-037, RF-INT-057 … | Cubierta |
| › Objetivo (§13) (L698) | M07, M14, T06 | hereda de §13 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§13) (L702) | M07, M14, T06 | hereda de §13 | Cubierta (por sección) |
| › Alcance funcional (§13) (L705) | M07, M14, T06 | hereda de §13 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-13 (§13) (L723) | M07, M14, T06 | M07: RF-COB-141, RF-COB-147, RF-COB-159 … · M14: encab., §1, RF-TES-043 … (§16 CU-TES-17, antes CU-13, ronda de residuales 05-11-2026) · T06: RF-INT-037, RF-INT-069, §16.1 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§13) (L739) | M07, M14, T06 | hereda de §13 | Cubierta (por sección) |
| §14 Gestión de deuda y acuerdos (L748) | M08, M15, T05 | M08: encab., §4, RF-MOR-073 … · M15: RF-CON-074 · T05: COL-MOR-39 | Cubierta |
| › Objetivo (§14) (L750) | M08, M15, T05 | hereda de §14 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§14) (L754) | M08, M15, T05 | hereda de §14 | Cubierta (por sección) |
| › Alcance funcional (§14) (L757) | M08, M15, T05 | hereda de §14 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-14 (§14) (L776) | M08 | M08: encab., RF-MOR-145, RF-MOR-150 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§14) (L792) | M08 | M08: §16, ESC-MOR-29, ESC-MOR-30 … | Cubierta |
| §15 Solicitudes comerciales y atención (L801) | M09, T11 | M09: encab., §1, RF-CRM-002 … · T11: encab., RF-WFL-215, RF-WFL-210 … | Cubierta |
| › Objetivo (§15) (L803) | M09, T11 | hereda de §15 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§15) (L807) | M09, T11 | hereda de §15 | Cubierta (por sección) |
| › Alcance funcional (§15) (L810) | M09, T11 | hereda de §15 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-15 (§15) (L831) | M09 | M09: RF-CRM-015, RF-CRM-060, §9.2 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§15) (L847) | M09, T11 | hereda de §15 | Cubierta (por sección) |
| §16 Reclamos e incidentes (L856) | M09, T11 | M09: encab., §1, RF-CRM-001 … · T11: encab., RF-WFL-211, RF-WFL-210 … | Cubierta |
| › Objetivo (§16) (L858) | M09, T11 | hereda de §16 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§16) (L862) | M09, T11 | hereda de §16 | Cubierta (por sección) |
| › Alcance funcional (§16) (L865) | M09, T11 | hereda de §16 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-16 (§16) (L890) | M09 | M09: RF-CRM-106, RF-CRM-110, RN-CRM-022 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§16) (L906) | M09, T11 | hereda de §16 | Cubierta (por sección) |
| §17 Factibilidad, conexiones y órdenes técnicas (L915) | M10, M13, M16 | M10: encab., §2.2, RF-TEC-001 … · M13: encab. · M16: RF-SUE-001, RF-SUE-049 | Cubierta |
| › Objetivo (§17) (L917) | M10, M13, M16 | hereda de §17 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§17) (L921) | M10, M13, M16 | hereda de §17 | Cubierta (por sección) |
| › Alcance funcional (§17) (L924) | M10, M13, M16 | hereda de §17 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-17 (§17) (L948) | M10, M13 | M10: §16, §18, RF-TEC-022 … · M13: RF-STK-047, RF-STK-055, RF-STK-070 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§17) (L964) | M10, M13, M16 | hereda de §17 | Cubierta (por sección) |
| §18 Mantenimiento, infraestructura y mapas (L973) | M10 | M10: encab., §1, §2.2 … | Cubierta |
| › Objetivo (§18) (L975) | M10 | hereda de §18 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§18) (L979) | M10 | hereda de §18 | Cubierta (por sección) |
| › Alcance funcional (§18) (L982) | M10 | hereda de §18 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-18 (§18) (L1000) | M10 | M10: RF-TEC-138, RF-TEC-140, RF-TEC-141 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§18) (L1016) | M10 | hereda de §18 | Cubierta (por sección) |
| §19 Compras y proveedores (L1025) | M11, M12, T06 | M11: CTR-VEN-09 · M12: encab., §1, §2 … · T06: §12.4, FI-INT-11, RF-INT-020 | Cubierta |
| › Objetivo (§19) (L1027) | M11, M12, T06 | hereda de §19 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§19) (L1031) | M11, M12, T06 | hereda de §19 | Cubierta (por sección) |
| › Alcance funcional (§19) (L1034) | M11, M12, T06 | hereda de §19 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-19 (§19) (L1056) | M12 | M12: encab., RF-CMP-060, RF-CMP-091 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§19) (L1072) | M12 | M12: encab., §9.1, §16 … | Cubierta |
| §20 Inventario y materiales (L1081) | M11, M12, M13 | M11: RN-VEN-006, RF-VEN-066 · M12: encab., CTR-CMP-05 · M13: encab., §2.3, RF-STK-001 … | Cubierta |
| › Objetivo (§20) (L1083) | M11, M12, M13 | hereda de §20 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§20) (L1087) | M11, M12, M13 | hereda de §20 | Cubierta (por sección) |
| › Alcance funcional (§20) (L1090) | M11, M12, M13 | hereda de §20 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-20 (§20) (L1114) | M13 | M13: encab., RF-STK-054, RF-STK-065 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§20) (L1130) | M11, M12, M13 | hereda de §20 | Cubierta (por sección) |
| §21 Tesorería y planificación de fondos (L1139) | M12, M14, M15, T03 | M12: encab. · M14: encab., §1, §3 … · M15: RF-CON-079, RF-CON-148 · T03: SM-ADM-148 | Cubierta |
| › Objetivo (§21) (L1141) | M12, M14, M15, T03 | hereda de §21 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§21) (L1145) | M12, M14, M15, T03 | hereda de §21 | Cubierta (por sección) |
| › Alcance funcional (§21) (L1148) | M12, M14, M15, T03 | hereda de §21 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-21 (§21) (L1168) | M14 | M14: encab., RF-TES-043, RF-TES-145 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§21) (L1184) | M12, M14, M15, T03 | hereda de §21 | Cubierta (por sección) |
| §22 Contabilidad y análisis económico (L1193) | M15 | M15: encab., §1, §2.2 … | Cubierta |
| › Objetivo (§22) (L1195) | M15 | hereda de §22 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§22) (L1199) | M15 | hereda de §22 | Cubierta (por sección) |
| › Alcance funcional (§22) (L1202) | M15 | hereda de §22 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-22 (§22) (L1228) | M15 | M15: encab., RF-CON-067, RN-CON-052 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§22) (L1244) | M15 | hereda de §22 | Cubierta (por sección) |
| §23 Ventas adicionales y financiación comercial (L1253) | M08, M11, M15 | M08: encab., §2.2, RF-MOR-159 … · M11: §2, RF-VEN-050, RF-VEN-051 … · M15: RF-CON-078 | Cubierta |
| › Objetivo (§23) (L1255) | M08, M11, M15 | hereda de §23 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§23) (L1259) | M08, M11, M15 | hereda de §23 | Cubierta (por sección) |
| › Alcance funcional (§23) (L1262) | M08, M11, M15 | hereda de §23 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-23 (§23) (L1280) | M11 | M11: encab., RF-VEN-063, RF-VEN-080 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§23) (L1296) | M11 | M11: §16, §18, §22: §16 CU-23; §18 | Cubierta |
| §24 Servicios sociales y beneficiarios (L1305) | M18, T03 | M18: encab., §1, §2.2 … · T03: SM-PWS-038 | Cubierta |
| › Objetivo (§24) (L1307) | M18, T03 | hereda de §24 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§24) (L1311) | M18, T03 | hereda de §24 | Cubierta (por sección) |
| › Alcance funcional (§24) (L1316) | M18, T03 | hereda de §24 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-24 (§24) (L1335) | M18, T12-p2 | M18: encab., RF-SOC-031, §9.2 … · T12-p2: §3 | Cubierta |
| › Datos y valores de ejemplo para precarga (§24) (L1351) | M18, T12-p2 | M18: encab., §18, RF-SOC-001 … · T12-p2: §2 | Cubierta |
| §25 Portal y aplicación del asociado (L1360) | M09, M13, M17, M18, M19, T03, T09 | M09: CTR-CRM-13 · M13: RF-STK-079, §16 · M17: RF-INS-106, PAN-INS-30, PAN-INS-32 · M18: RF-SOC-030, RF-SOC-038, RF-SOC-143 … · (+3 anexos) | Cubierta |
| › Objetivo (§25) (L1362) | M09, M13, M17, M18, M19, T03, T09 | hereda de §25 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§25) (L1366) | M09, M13, M17, M18, M19, T03, T09 | hereda de §25 | Cubierta (por sección) |
| › Alcance funcional (§25) (L1369) | M09, M13, M17, M18, M19, T03, T09 | hereda de §25 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-25 (§25) (L1405) | M19, T03 | M19: RF-POR-038, RF-POR-094, §16.1 … · T03: §10.7.4, SM-PWS-010, §16 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§25) (L1421) | M09, M13, M17, M18, M19, T03, T09 | hereda de §25 | Cubierta (por sección) |
| §26 Tareas internas, atención presencial y comunicaciones (L1430) | M09, T09, T11 | M09: encab., RF-CRM-019, RF-CRM-109 … · T09: encab., §2.3, §4 … · T11: encab., RF-WFL-072, RF-WFL-100 … | Cubierta |
| › Objetivo (§26) (L1432) | M09, T09, T11 | hereda de §26 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§26) (L1436) | M09, T09, T11 | hereda de §26 | Cubierta (por sección) |
| › Alcance funcional (§26) (L1439) | M09, T09, T11 | hereda de §26 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-26 (§26) (L1456) | M09, T09, T11 | M09: RF-CRM-140, RF-CRM-236, §16 (CU-CRM-21, antes CU-26; el CU-26 lo define T09, cierre 05-11-2026) … · T09: encab., §2.3, §16.1 … · T11: §16.1 | Cubierta |
| › Datos y valores de ejemplo para precarga (§26) (L1472) | M09, T09, T11 | hereda de §26 | Cubierta (por sección) |
| §27 Gestión cooperativa institucional (L1481) | M16, M17, T03, T11 | M16: §2.2 · M17: encab., §1, RF-INS-012 … · T03: SM-PWS-039 · T11: encab., TPL-INS-03 | Cubierta |
| › Objetivo (§27) (L1483) | M16, M17, T03, T11 | hereda de §27 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§27) (L1487) | M16, M17, T03, T11 | hereda de §27 | Cubierta (por sección) |
| › Alcance funcional (§27) (L1490) | M16, M17, T03, T11 | hereda de §27 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-27 (§27) (L1507) | M17, T11 | M17: encab., RF-INS-076, RF-INS-078 … · T11: §16.1, TPL-INS-03 | Cubierta |
| › Datos y valores de ejemplo para precarga (§27) (L1523) | M16, M17, T03, T11 | hereda de §27 | Cubierta (por sección) |
| §28 Personal y liquidaciones laborales (L1532) | M16 | M16: encab., RF-SUE-121, RF-SUE-140 … | Cubierta |
| › Objetivo (§28) (L1534) | M16 | hereda de §28 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§28) (L1540) | M16 | hereda de §28 | Cubierta (por sección) |
| › Alcance funcional (§28) (L1543) | M16 | hereda de §28 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-28 (§28) (L1552) | M14, M16 | M14: RF-TES-160 · M16: encab., §1, §3 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§28) (L1568) | M16 | hereda de §28 | Cubierta (por sección) |
| §29 Seguridad, permisos y auditoría (L1577) | M13, T02, T06, T08, T11 | M13: RF-STK-137 · T02: encab., §1, RF-IAM-007 … · T06: encab., RF-INT-020, FI-INT-11 · T08: encab., §4, RF-NFR-024 … · (+1 anexos) | Cubierta |
| › Objetivo (§29) (L1579) | M13, T02, T06, T08, T11 | hereda de §29 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§29) (L1583) | M13, T02, T06, T08, T11 | hereda de §29 | Cubierta (por sección) |
| › Alcance funcional (§29) (L1586) | M13, T02, T06, T08, T11 | hereda de §29 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-29 (§29) (L1622) | T02, T08, T11 | T02: encab., §4.1, §4.4 … · T08: encab., RNF-NFR-150, §16.1 … · T11: §9.4, §16.1, RF-WFL-110 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§29) (L1638) | M13, T02, T06, T08, T11 | hereda de §29 | Cubierta (por sección) |
| §30 Reportes y tableros (L1649) | T03, T10 | T03: encab., RF-UXD-080, §10.2.5 … · T10: encab., §2.2, RF-BIA-001 … | Cubierta |
| › Objetivo (§30) (L1651) | T03, T10 | hereda de §30 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§30) (L1655) | T03, T10 | hereda de §30 | Cubierta (por sección) |
| › Alcance funcional (§30) (L1658) | T03, T10 | hereda de §30 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-30 (§30) (L1680) | T10 | T10: encab., RF-BIA-008, RF-BIA-093 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§30) (L1696) | T03, T10 | hereda de §30 | Cubierta (por sección) |
| §31 Integraciones, importaciones y migración (L1705) | T06, T07, T10 | T06: encab., RF-INT-037, RF-INT-047 … · T07: encab., §1, §2.3 … · T10: encab., RF-BIA-070, RF-BIA-092 | Cubierta |
| › Objetivo (§31) (L1707) | T06, T07, T10 | hereda de §31 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§31) (L1711) | T06, T07, T10 | hereda de §31 | Cubierta (por sección) |
| › Alcance funcional (§31) (L1714) | T06, T07, T10 | hereda de §31 | Cubierta (por sección) |
| › Caso de uso de ejemplo — CU-31 (§31) (L1735) | T06, T07 | T06: RF-INT-063, §8.7, §12.17 … · T07: encab., RF-MIG-027, RF-MIG-099 … | Cubierta |
| › Datos y valores de ejemplo para precarga (§31) (L1751) | T06, T07, T10 | hereda de §31 | Cubierta (por sección) |
| §32 Particularidades según el servicio (L1760) | M02 | M02: encab., RF-CAT-098, §6.C.2 … | Cubierta |
| §33 Entidades principales del modelo (L1776) | M01, M13, M15, M17, M18, T10, T11 | M01: encab., RF-PER-039, RF-PER-093 … · M13: encab., RF-STK-016, RF-STK-017 · M15: encab., §3, §22: §3 · M17: encab., RF-INS-001, RF-INS-062 … · (+3 anexos) | Cubierta |
| §34 Escenarios de validación funcional (L1853) | M13, M15, T08, T10 | M13: encab. · M15: encab., RN-CON-067, ESC-CON-06 … · T08: RNF-NFR-003, RNF-NFR-013, RNF-NFR-018 … · T10: encab., RF-BIA-004, RF-BIA-013 … | Cubierta |
| §35 Estrategia inicial de desarrollo (L1953) | M19, T01, T07 | M19: encab. · T01: RF-PLA-162, CTR-PLA-11 · T07: encab. | Cubierta |
| §36 Fuentes del relevamiento público (L1973) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §37 Pendientes para continuar el trabajo (L1983) | M01, M02, M03, M04, M05, M07, M10 | M01: encab., PA-PER-01, PA-PER-11 … · M02: encab., §22: DEC-001 (piloto Internet); 4; 9; 10;... · M03: encab., §22: Informativo; los requisitos citados s..., MER-00... · M04: encab. · (+3 anexos) | Cubierta |
| §38 Historial de cambios (L1999) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §39 Catálogos y parámetros de ejemplo para precarga (L2021) | M15, T04 | M15: RF-CON-023 · T04: encab., §1, §2.1 … | Cubierta |
| › §39.1 Finalidad y reglas de precarga (L2023) | M02, M05, T04 | M02: RF-CAT-035, RF-CAT-016 · M05: RF-FAC-168 · T04: RF-CFG-013, RF-CFG-026, RF-CFG-031 … | Cubierta |
| › §39.2 Servicios, unidades y formas de liquidación (L2034) | M02, T04 | M02: encab., §6.C.2, §6.C.3 … · T04: RF-CFG-059, RN-CFG-044, §18.2 | Cubierta |
| › §39.3 Conceptos que pueden configurar una liquidación (L2050) | M04, M11, T04 | M04: encab., §2.2, RF-TAR-085 … · M11: §22: §18 · T04: RF-CFG-059, RF-CFG-062, §18.3 | Cubierta |
| › §39.4 Medios de cobro y confirmación (L2066) | M07, T04, T06 | M07: encab., RF-COB-047, RF-COB-053 … · T04: RF-CFG-059, §18.4 · T06: encab., FI-INT-106 | Cubierta |
| › §39.5 Estados seleccionables de ejemplo (L2079) | M07, M09, T04, T07, T11 | M07: encab., RF-COB-003, RF-COB-004 · M09: encab., RF-CRM-021, RN-CRM-004 … · T04: RF-CFG-059, RF-CFG-107, §18.5 · T07: RF-MIG-039, RN-MIG-017 · (+1 anexos) | Cubierta |
| › §39.6 Roles y valores sugeridos (L2095) | M01, M07, M14, M15, T02, T04 | M01: encab., §4, RF-PER-162 … · M07: encab., §4 · M14: encab., CTR-TES-03 · M15: encab., §22: §4 · (+2 anexos) | Cubierta |
| §40 Ejemplo integrado: agua, liquidación y dos cobros (L2109) | M04, M05, M07 | M04: encab. · M05: encab., §16, §22: Adoptado · M07: encab., RF-COB-010, §16.1 … | Cubierta |
| › §40.1 Objetivo del circuito (L2111) | M04, M05, M07 | hereda de §40 | Cubierta (por sección) |
| › §40.2 Datos iniciales (L2115) | M04, M05, M07 | hereda de §40 | Cubierta (por sección) |
| › §40.3 Pasos y resultados (L2130) | M14, M15 | M14: encab., RF-TES-043 · M15: encab., §22: P-CON-04 (cierre mensual) | Cubierta |
| › §40.4 Valores sugeridos en las pantallas (L2148) | M04, M07 | M04: RF-TAR-092 · M07: RF-COB-035, RF-COB-143 | Cubierta |
| › §40.5 Comprobaciones del ejemplo (L2159) | M07 | M07: RF-COB-165, RN-COB-137 | Cubierta |
| §41 Definiciones pendientes sobre límites y ejemplos (L2174) | M01, M03, M04, M09, M19, T02, T04 | M01: encab., PA-PER-01, PA-PER-11 … · M03: encab., §22: Límites en §2–§4; datos ficticios en... · M04: encab. · M09: encab., §22: §2.2, §2.3 · (+3 anexos) | Cubierta |
| §42 Cooperativas como tenants, usuarios y roles — requisitos informados (L2191) | M16, T02, T03 | M16: CTR-SUE-13 · T02: encab. · T03: RF-UXD-079, SM-PLT-016 | Cubierta |
| › §42.1 Origen y estado (L2193) | M16, T02, T03 | hereda de §42 | Cubierta (por sección) |
| › §42.2 Requisitos recibidos (L2197) | M15, M17, T01, T02 | M15: encab., §4, §22: §4 · M17: RF-INS-105 · T01: §3, RF-PLA-016, RF-PLA-036 … · T02: §4.1, RF-IAM-002, RF-IAM-062 … | Cubierta |
| › §42.3 Objetivo (L2210) | T01 | T01: RF-PLA-016 | Cubierta |
| › §42.4 Límite (L2214) | T01, T02 | T01: RF-PLA-037, RF-PLA-038, CTR-PLA-03 · T02: RF-IAM-007, RF-IAM-111, CTR-IAM-19 … | Cubierta |
| › §42.5 Alcance funcional inicial (L2220) | T01, T02 | T01: RF-PLA-028, RF-PLA-041 · T02: RF-IAM-070 | Cubierta |
| › §42.6 Perfiles y pertenencia (L2233) | M15, T02 | M15: encab., §4, §22: §4 · T02: RF-IAM-001 | Cubierta |
| › §42.7 Caso de uso de ejemplo — CU-MT-01 (L2246) | T01, T02 | T01: RF-PLA-019, RF-PLA-033, RF-PLA-041 … · T02: encab., RF-IAM-007, RF-IAM-047 … | Cubierta |
| › §42.8 Datos ilustrativos de precarga (L2263) | M01, M02, M05, M06, M09, M10, M11 (+16) | M01: §16, AC-PER-40, AC-PER-41 … · M02: RF-CAT-003, RF-CAT-110, §9.6 … · M05: RF-FAC-001, §17, §18 · M06: RF-FIS-168, §16, §17.3 … · (+19 anexos) | Cubierta |
| › §42.9 Definiciones pendientes para próximas aportaciones (L2278) | T01, T02 | T01: RF-PLA-053 · T02: RF-IAM-001, RF-IAM-005, RF-IAM-047 … | Cubierta |
| §43 Marca y landing configurable por cooperativa — requisitos informados (L2291) | M09, M19, T03, T09, T10 | M09: CTR-CRM-13 · M19: encab., CTR-POR-01, CTR-POR-02 … · T03: encab., §1, RF-UXD-021 … · T09: encab., RF-COM-001, PAN-COM-53 · (+1 anexos) | Cubierta |
| › §43.1 Origen y requisitos recibidos (L2293) | M19, T03 | M19: RF-POR-001, RF-POR-002, RF-POR-015 … · T03: encab., RF-UXD-021, RF-UXD-022 … | Cubierta |
| › §43.2 Objetivo (L2309) | M09, M19, T03, T09, T10 | hereda de §43 | Cubierta (por sección) |
| › §43.3 Límite y relación con otros módulos (L2313) | M19, T03 | M19: RN-POR-011 · T03: RF-UXD-075, RN-UXD-008, RN-UXD-040 … | Cubierta |
| › §43.4 Alcance funcional (L2323) | M19, T03 | M19: RF-POR-001, RF-POR-052, PAN-POR-93 · T03: RF-UXD-024, RF-UXD-033, RF-UXD-035 … | Cubierta |
| › §43.5 Recursos de identidad por canal (L2341) | T03 | T03: RF-UXD-023, RN-UXD-038, CTR-UXD-13 … | Cubierta |
| › §43.6 Caso de uso de ejemplo — CU-MAR-01 (L2354) | M19, T03 | M19: §2.3, §16.1, TEN-001 … · T03: encab., RF-UXD-035, RN-UXD-042 … | Cubierta |
| › §43.7 Datos y valores ilustrativos de precarga (L2373) | T03 | T03: §10.1.5, §18, §22: 18 | Cubierta |
| › §43.8 Ejemplos del recorrido de servicios (L2394) | T03 | T03: RF-UXD-075, §10.1.5, §10.7.6 … | Cubierta |
| › §43.9 Definiciones pendientes (L2404) | T03 | T03: RF-UXD-030 | Cubierta |
| §44 Facturación separada por servicio y cuenta corriente configurable — requisitos informados (L2421) | M05, M07, M11, M14, M15, M19, T03 | M05: encab., RF-FAC-065, RF-FAC-076 … · M07: encab., §16.1, CTR-COB-01 · M11: RF-VEN-007, RN-VEN-004, CTR-VEN-01 · M14: RF-TES-040 · (+3 anexos) | Cubierta |
| › §44.1 Origen y requisitos recibidos (L2423) | M05, M07 | M05: encab., §1, RF-FAC-064 … · M07: encab., §1, RF-COB-021 … | Cubierta |
| › §44.2 Objetivo (L2436) | M05, M07, M11, M14, M15, M19, T03 | hereda de §44 | Cubierta (por sección) |
| › §44.3 Límite y relación con otros módulos (L2440) | M05, M07 | M05: RF-FAC-075 · M07: RF-COB-022, RF-COB-027 | Cubierta |
| › §44.4 Alcance funcional (L2448) | M05, M07 | M05: RF-FAC-054, RF-FAC-076 · M07: RF-COB-022, RF-COB-023, RF-COB-175 | Cubierta |
| › §44.5 Ejemplo con valores de demostración (L2462) | M07 | M07: RF-COB-038 | Cubierta |
| › §44.6 Caso de uso de ejemplo — CU-FAC-01 (L2477) | M05, M07 | M05: encab., RF-FAC-074, §9.1 … · M07: RF-COB-025, §16.1, CU-FAC-01 … | Cubierta |
| › §44.7 Datos y configuración ilustrativa de precarga (L2495) | M05, M07, M11, M14, M15, M19, T03 | hereda de §44 | Cubierta (por sección) |
| › §44.8 Definiciones pendientes (L2508) | M05, M07 | M05: RF-FAC-075 · M07: RF-COB-038 | Cubierta |
| §45 Usuarios, roles funcionales y perfiles de pantallas — requisito informado (L2522) | T02, T03, T09 | T02: encab., RF-IAM-063, RF-IAM-064 … · T03: encab., §4, RF-UXD-174 … · T09: §4, RF-COM-007, PRM-COM-007 | Cubierta |
| › Objetivo (§45) (L2524) | T02, T03, T09 | hereda de §45 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§45) (L2528) | T02, T03, T09 | hereda de §45 | Cubierta (por sección) |
| › Alcance y requisitos informados (§45) (L2534) | T02, T03 | T02: encab., RF-IAM-062, RF-IAM-063 … · T03: encab., §4, RN-UXD-022 … | Cubierta |
| › Caso de uso — CU-ACC-01 (§45) (L2545) | T02, T03 | T02: encab., §4.4, §10 … · T03: encab., RN-UXD-023, RN-UXD-024 … (§16 CU-UXD-07, antes CU-ACC-01 parte UX; dueño T02, ronda de residuales 05-11-2026) | Cubierta |
| › Ejemplos de configuración propuestos (§45) (L2558) | T02, T03, T09 | hereda de §45 | Cubierta (por sección) |
| §46 Noticias en landing y muro de apps — requisito informado (L2569) | M19, T03, T09 | M19: encab., §1, §2.3 … · T03: encab., RF-UXD-076, RN-UXD-042 … · T09: encab., §2.3, RF-COM-001 … | Cubierta |
| › Objetivo (§46) (L2571) | M19, T03, T09 | hereda de §46 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§46) (L2575) | M19, T03, T09 | hereda de §46 | Cubierta (por sección) |
| › Alcance y requisitos informados (§46) (L2579) | M19, T03, T09 | M19: RF-POR-007, RF-POR-125, RF-POR-134 … · T03: encab., RF-UXD-076, §10.1.5 … · T09: encab., §1, RF-COM-001 … | Cubierta |
| › Caso de uso — CU-NOT-01 (§46) (L2589) | M19, T09 | M19: §16.1, RF-POR-007, CU-NOT-01 … · T09: encab., RF-COM-003, §16.1 … | Cubierta |
| › Datos ilustrativos (§46) (L2600) | M19, T03, T09 | hereda de §46 | Cubierta (por sección) |
| §47 CRM integral de pedidos, reclamos y atención — requisito informado (L2612) | M09, M10, M11, T03, T06, T09, T11 | M09: encab., §1, §2.2 … · M10: RF-TEC-231, RN-TEC-116 · M11: RF-VEN-113 · T03: SM-LND-011, SM-LND-012 · (+3 anexos) | Cubierta |
| › Objetivo (§47) (L2614) | M09, M10, M11, T03, T06, T09, T11 | hereda de §47 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§47) (L2618) | M09, M10, M11, T03, T06, T09, T11 | hereda de §47 | Cubierta (por sección) |
| › Alcance y requisitos informados (§47) (L2624) | M09 | M09: §1, §3, RF-CRM-001 … | Cubierta |
| › Información del caso y bandejas (§47) (L2650) | M09, M10, M11, T03, T06, T09, T11 | hereda de §47 | Cubierta (por sección) |
| › Caso de uso — CU-CRM-01 (§47) (L2668) | M09, T12-p1 | M09: RF-CRM-009, RF-CRM-038, RF-CRM-204 … · T12-p1: §0.3, §5.3 | Cubierta |
| › Datos ilustrativos de precarga (§47) (L2684) | M09, M10, M11, T03, T06, T09, T11 | hereda de §47 | Cubierta (por sección) |
| › Pendientes de especificación (§47) (L2698) | M09, M10, M11, T03, T06, T09, T11 | hereda de §47 | Cubierta (por sección) |
| §48 Solicitudes de alta y baja de cualquier servicio — requisito informado (L2711) | M02, M09, M19, T03 | M02: encab., §2.3, RF-CAT-025 … · M09: encab., §1, RF-CRM-004 … · M19: encab., §2.3, RN-POR-011 … · T03: SM-ADM-025, SM-PWS-005 | Cubierta |
| › Objetivo (§48) (L2713) | M02, M09, M19, T03 | hereda de §48 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§48) (L2717) | M02, M09, M19, T03 | hereda de §48 | Cubierta (por sección) |
| › Alcance y requisitos informados (§48) (L2723) | M02, M09, M10, M19 | M02: encab., RF-CAT-112, RF-CAT-025 … · M09: RF-CRM-060, RF-CRM-061, §16 … · M10: §16 · M19: RF-POR-056, RF-POR-061, RF-POR-065 | Cubierta |
| › Caso de uso — CU-SOL-01 (§48) (L2739) | M02, M09, T12-p1 | M02: encab., §9.2, §16 … · M09: RF-CRM-060, §9.2, §16 … · T12-p1: §1.3 | Cubierta |
| › Ejemplos de opciones seleccionables (§48) (L2751) | M02, M09, M19, T03 | hereda de §48 | Cubierta (por sección) |
| §49 Consolidación de las últimas aportaciones (L2767) | T09 | T09: CTR-COM-01 | Cubierta |
| §50 Autogestión integral del tenant y del socio — requisito informado (L2774) | M01, M10, M11, M19, T06 | M01: RF-PER-161 · M10: encab., §2.2, RF-TEC-017 … · M11: RF-VEN-032 · M19: encab., §1, RN-POR-021 … · (+1 anexos) | Cubierta |
| › Objetivo (§50) (L2776) | M01, M10, M11, M19, T06 | hereda de §50 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§50) (L2780) | M01, M10, M11, M19, T06 | hereda de §50 | Cubierta (por sección) |
| › Alcance recibido y desarrollo funcional (§50) (L2784) | M10, M19 | M10: encab., RF-TEC-017, RF-TEC-075 … · M19: §1, RF-POR-072, RF-POR-077 … | Cubierta |
| › Agenda y visitas: alcance propuesto para materializar el requisito (§50) (L2797) | M01, M10, M11, M19, T06 | hereda de §50 | Cubierta (por sección) |
| › Caso de uso — CU-AUT-01 (§50) (L2810) | M10, M19 | M10: encab., §9.1, §16 … · M19: §16.1, PR-POR-01, TEN-001 … | Cubierta |
| §51 Motor de facturación P × Q y reglas de excepción — requisito informado (L2820) | M04 | M04: encab., §2.3, RF-TAR-004 … | Cubierta |
| › Objetivo (§51) (L2822) | M04 | hereda de §51 | Cubierta (por sección) |
| › Límite (§51) (L2826) | M04 | hereda de §51 | Cubierta (por sección) |
| › Requisitos informados (§51) (L2830) | M04, M09, T11 | M04: encab., RF-TAR-033, RF-TAR-056 … · M09: §16, §18 · T11: RF-WFL-138, §9.7, §16.1 … | Cubierta |
| › Estructura propuesta de una regla (§51) (L2841) | M04 | hereda de §51 | Cubierta (por sección) |
| › Reglas y funciones propuestas (§51) (L2858) | M04 | hereda de §51 | Cubierta (por sección) |
| › Caso de uso — CU-TAR-02 (§51) (L2876) | M04 | M04: encab., RF-TAR-067, RF-TAR-071 … | Cubierta |
| › Ejemplo adicional de subsidio por bloque, puramente didáctico (§51) (L2897) | M04 | hereda de §51 | Cubierta (por sección) |
| §52 Investigación para el mercado argentino y consecuencias funcionales (L2901) | M04, M05, M06, M11, M14, M17, M19 (+1) | M04: encab., §2.3, §6.16 … · M05: RF-FAC-118 · M06: encab. · M11: RF-VEN-007, CTR-VEN-01, CTR-VEN-05 … · (+4 anexos) | Cubierta |
| › Fecha, alcance y criterio (§52) (L2903) | M04, M05, M06, M11, M14, M17, M19 (+1) | hereda de §52 | Cubierta (por sección) |
| › §52.1 Subsidios y cambios de vigencia (L2907) | M04, M06 | M04: RF-TAR-078, RN-TAR-217 · M06: §1, RF-FIS-001, RF-FIS-009 | Cubierta |
| › §52.2 Impuestos, transparencia y comprobantes (L2915) | M04, M06, M08, M09 | M04: RF-TAR-014, RF-TAR-056, RF-TAR-057 … · M06: §1, RF-FIS-001, RF-FIS-003 … · M08: RF-MOR-028, RN-MOR-014, CTR-MOR-05 … · M09: RF-CRM-117 | Cubierta |
| › §52.3 Bajas y costos (L2925) | M04, M08, M09, M19, T11 | M04: RF-TAR-029, RN-TAR-219, RN-TAR-220 … · M08: encab., §1, §2.3 … · M09: encab., §3, RF-CRM-066 … · M19: encab., RN-POR-013, RN-POR-016 … · (+1 anexos) | Cubierta |
| › §52.4 Datos a relevar por cooperativa antes de habilitar facturación (L2935) | M04, M06, M08, M19, T05 | M04: RF-TAR-108, RN-TAR-221 · M06: §2.3, RF-FIS-002, RF-FIS-003 … · M08: §2.3, RF-MOR-074, RF-MOR-112 … · M19: RN-POR-077 · (+1 anexos) | Cubierta |
| §53 Baja, suspensión y reactivación — requisito informado (L2951) | M02, M05, M07, M08, M09, M19, T03 (+4) | M02: encab., RF-CAT-025, RF-CAT-030 … · M05: RF-FAC-163 · M07: RF-COB-152 · M08: encab., §1, §2.3 … · (+7 anexos) | Cubierta |
| › Objetivo (§53) (L2953) | M02, M05, M07, M08, M09, M19, T03 (+4) | hereda de §53 | Cubierta (por sección) |
| › Límite (§53) (L2957) | M02, M05, M07, M08, M09, M19, T03 (+4) | hereda de §53 | Cubierta (por sección) |
| › Alcance recibido y desarrollo (§53) (L2963) | M02, M08, M09, M19 | M02: encab., RF-CAT-065, RF-CAT-088 … · M08: encab., RF-MOR-070, RF-MOR-131 … · M09: RF-CRM-061, RF-CRM-068, RF-CRM-069 … · M19: RF-POR-009, RF-POR-065, RF-POR-066 … | Cubierta |
| › Caso de uso — CU-CIC-01 (§53) (L2981) | M02, M08, M09, M19 | M02: encab., §9.3, §16 · M08: encab., RF-MOR-211, PAN-MOR-41 … · M09: RF-CRM-068, RF-CRM-069, §9.4 … · M19: §16.1, RF-POR-066, RN-POR-019 … | Cubierta |
| §54 Dashboards de plataforma y tenant, alertas y auditoría de cada cambio (L2989) | M01, M02, M08, M11, M12, M13, M15 (+7) | M01: RF-PER-153 · M02: RF-CAT-006, RF-CAT-113 · M08: RF-MOR-216, REP-MOR-27, CTR-MOR-08 … · M11: RF-VEN-116 · (+10 anexos) | Cubierta |
| › Objetivo (§54) (L2991) | M01, M02, M08, M11, M12, M13, M15 (+7) | hereda de §54 | Cubierta (por sección) |
| › Límite y permisos (§54) (L2995) | M01, M02, M08, M11, M12, M13, M15 (+7) | hereda de §54 | Cubierta (por sección) |
| › Requisitos recibidos y desarrollo propuesto (§54) (L2999) | M02, T01, T02, T06, T08, T10, T11 | M02: RF-CAT-006 · T01: RF-PLA-043, RF-PLA-086, RF-PLA-089 … · T02: encab., §4.4, RF-IAM-130 … · T06: RF-INT-007, RF-INT-071, RF-INT-072 … · (+3 anexos) | Cubierta |
| › Registro de auditoría (§54) (L3016) | M01, M02, M08, M11, M12, M13, M15 (+7) | hereda de §54 | Cubierta (por sección) |
| › Caso de uso — CU-GOB-01 (§54) (L3031) | T01, T02, T08, T10, T11 | T01: §16.1, RF-PLA-086, RF-PLA-038 … · T02: encab., §4.4, RF-IAM-138 … · T08: encab., RNF-NFR-117, §16.1 … · T10: encab., §15.7, §16 … · (+1 anexos) | Cubierta |
| §55 ERP integral y múltiples planes de cuentas por cooperativa (L3037) | M13, M15, M16, T03, T06, T10 | M13: encab. · M15: encab., §1, §2.2 … · M16: RF-SUE-120 · T03: SM-ADM-158 · (+2 anexos) | Cubierta |
| › Objetivo (§55) (L3039) | M13, M15, M16, T03, T06, T10 | hereda de §55 | Cubierta (por sección) |
| › Límite y conceptos (§55) (L3043) | M13, M15, M16, T03, T06, T10 | hereda de §55 | Cubierta (por sección) |
| › Requisitos recibidos (§55) (L3049) | M15, T06 | M15: encab., RF-CON-007, RF-CON-106 … · T06: encab. | Cubierta |
| › Planes, equivalencias y simulaciones: desarrollo funcional (§55) (L3061) | M13, M15, M16, T03, T06, T10 | hereda de §55 | Cubierta (por sección) |
| › Caso de uso — CU-ERP-01 (§55) (L3076) | M15, T10 | M15: encab., RF-CON-106, §9.10 … · T10: encab., §16, §18 … | Cubierta |
| §56 Fuentes oficiales de la investigación argentina (L3095) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §57 Definiciones pendientes de esta ampliación (L3109) | M01, M04, M05, M06, M07, M08, M09 (+5) | M01: encab., PA-PER-01, PA-PER-11 … · M04: encab. · M05: encab., §22: Adoptado · M06: encab., RF-FIS-006, CTR-FIS-01 … · (+8 anexos) | Cubierta |
| §58 Revisión expresa de arquitectura: gestión de cooperativas, ERP y CRM (L3126) | M09, T01, T02, T08, T10, T11 | M09: §22: §2 límite; resuelto por DEC del maest... · T01: RF-PLA-004, RF-PLA-035, RF-PLA-148 … (§16 CU-PLA-15, antes CU-ARQ-01; dueño de CU-ARQ-01 T11, ronda de residuales 05-11-2026) · T02: encab. · T08: §16.1, RNF-NFR-212 · (+2 anexos) | Cubierta |
| › Requisito informado — ARQ-001 (§58) (L3128) | T01, T10 | T01: encab., RF-PLA-004, RF-PLA-035 … · T10: encab., RF-BIA-060 | Cubierta |
| › Objetivo y límite (§58) (L3132) | M09, T01, T02, T08, T10, T11 | hereda de §58 | Cubierta (por sección) |
| › Temas obligatorios para la revisión (§58) (L3136) | M09, T01, T02, T08, T10, T11 | hereda de §58 | Cubierta (por sección) |
| §59 APIs tokenizadas para datos de la cooperativa — requisito informado (L3158) | M05, T02, T06, T08, T10 | M05: RF-FAC-169 · T02: encab., RF-IAM-113, RF-IAM-114 … · T06: encab., RF-INT-016, RF-INT-017 … · T08: RF-NFR-025, RNF-NFR-019, RNF-NFR-022 … · (+1 anexos) | Cubierta |
| › Objetivo (§59) (L3160) | M05, T02, T06, T08, T10 | hereda de §59 | Cubierta (por sección) |
| › Límite (§59) (L3164) | M05, T02, T06, T08, T10 | hereda de §59 | Cubierta (por sección) |
| › Requisitos recibidos (§59) (L3170) | T02, T08, T10 | T02: encab., RF-IAM-113, RN-IAM-052 … · T08: encab., RNF-NFR-019, CTR-NFR-16 · T10: encab., RF-BIA-070, CU-API-01 … | Cubierta |
| › Alcance funcional propuesto (§59) (L3178) | M05, T02, T06, T08, T10 | hereda de §59 | Cubierta (por sección) |
| › Datos candidatos a exponer, pendientes de permiso y contrato de API (§59) (L3193) | M05, T02, T06, T08, T10 | hereda de §59 | Cubierta (por sección) |
| › Caso de uso — CU-API-01 (§59) (L3203) | T02, T06, T08, T10 | T02: encab., RF-IAM-113, §16 … · T06: §16.1 · T08: encab., §16.1, RNF-NFR-019 … · T10: encab., RF-BIA-070, §16 … | Cubierta |
| §60 Seguridad actual, 2FA, Google y recuperación de acceso (L3209) | T01, T02, T03, T06, T08, T10 | T01: RNF-PLA-006 · T02: encab., §2.3, RF-IAM-006 … · T03: RF-UXD-118, §13 · T06: encab., RF-INT-018, FI-INT-05 · (+2 anexos) | Cubierta |
| › Objetivo (§60) (L3211) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Requisitos informados (§60) (L3215) | T02, T08 | T02: encab., RF-IAM-022, RF-IAM-025 … · T08: encab., RNF-NFR-050, RNF-NFR-066 … | Cubierta |
| › Referencias verificadas al 3/11/2026 (§60) (L3225) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Doble factor y sesión (§60) (L3231) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Acceso con Google (§60) (L3242) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Cambio y recuperación de contraseña local (§60) (L3248) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Protección transversal propuesta (§60) (L3258) | T01, T02, T03, T06, T08, T10 | hereda de §60 | Cubierta (por sección) |
| › Caso de uso — CU-SEG-01 (§60) (L3268) | T02, T08 | T02: encab., §10, §16 (CU-IAM-11, antes CU-SEG-01; dueño T08, ronda de residuales 05-11-2026) … · T08: encab., RNF-NFR-231, RNF-NFR-115 … | Cubierta |
| §61 Módulo de organismos gubernamentales y actuación como agente de retención (L3274) | M06, M12, M15, T06, T10 | M06: encab., §1, §2.3 … · M12: encab., RF-CMP-101, §16 … · M15: encab., RF-CON-077, RF-CON-096 … · T06: encab., RF-INT-064, §12.4 … · (+1 anexos) | Cubierta |
| › Objetivo (§61) (L3276) | M06, M12, M15, T06, T10 | hereda de §61 | Cubierta (por sección) |
| › Requisito informado y límite (§61) (L3280) | M06, M12 | M06: encab., §1, RF-FIS-014 … · M12: encab., RF-CMP-100, CU-FIS-01 … | Cubierta |
| › Verificación de fuentes oficiales (§61) (L3286) | M06, M12, M15, T06, T10 | hereda de §61 | Cubierta (por sección) |
| › Alcance funcional propuesto (§61) (L3292) | M06, M12, M15, T06, T10 | hereda de §61 | Cubierta (por sección) |
| › Organización e interfaces (§61) (L3308) | M06, M12, M15, T06, T10 | hereda de §61 | Cubierta (por sección) |
| › Caso de uso — CU-FIS-01 (§61) (L3321) | M06, M12, M14, M15 | M06: encab., §2.3, RF-FIS-100 … · M12: encab., §1, RF-CMP-101 … · M14: encab., RF-TES-122, §16 … · M15: RF-CON-077, M-48, §16 … | Cubierta |
| §62 Fuentes de seguridad, identidad y regímenes fiscales (L3336) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §63 Decisiones pendientes de esta ampliación (L3350) | M01, M06, M09, T02 | M01: encab., PA-PER-01, PA-PER-11 … · M06: encab., RF-FIS-006 · M09: encab., §22: §2 límite; resuelto por DEC del maest... · T02: encab. | Cubierta |
| §64 Posicionamiento competitivo y solución SaaS en la nube (L3366) | T01 | T01: §1, §1.2, CTR-PLA-07 … | Cubierta |
| › §64.1 Contexto y diagnóstico aportado (L3368) | T01 | hereda de §64 | Cubierta (por sección) |
| › §64.2 Redacción de la oportunidad del producto (L3374) | T01 | T01: RF-PLA-001 | Cubierta |
| › §64.3 Referencias recibidas y respuesta requerida (L3382) | T01 | T01: §1.2 | Cubierta |
| › §64.4 Requisitos propios que se incorporan (L3396) | T01, T08 | T01: RF-PLA-080, RF-PLA-157 · T08: RNF-NFR-030, RF-NFR-019, CTR-NFR-01 | Cubierta |
| › §64.5 Operación y soporte de la plataforma — desarrollo propuesto (L3408) | T01, T08 | T01: §2.2, §5.I, RF-PLA-096 … · T08: RF-NFR-019, RNF-NFR-030, RNF-NFR-032 … | Cubierta |
| › §64.6 Caso de uso — CU-SaaS-01 (L3420) | T01, T08 | T01: §16.1, §21 · T08: §16.1, RNF-NFR-030, RF-NFR-019 … | Cubierta |
| › §64.7 Validación competitiva y decisiones pendientes (L3428) | T01, T07 | T01: §1.2, RF-PLA-107 · T07: encab., §1 | Cubierta |
| §65 Diccionario de términos y etiquetas de interfaz por tenant (L3440) | M01, M05, M08, M11, M12, M15, M17 (+10) | M01: RF-PER-170 · M05: RF-FAC-172 · M08: RF-MOR-214 · M11: RF-VEN-116 · (+13 anexos) | Cubierta |
| › §65.1 Prioridad y requisito informado (L3442) | T03 | T03: encab., RF-UXD-140, RF-UXD-141 … | Cubierta |
| › §65.2 Objetivo (L3453) | T03 | T03: RF-UXD-168, PA-UXD-06 | Cubierta |
| › §65.3 Límite y relación con otros módulos (L3457) | T03 | T03: §3, RF-UXD-156, RF-UXD-157 … | Cubierta |
| › §65.4 Alcance funcional propuesto (L3465) | T03 | T03: §3, RF-UXD-034, RF-UXD-136 … | Cubierta |
| › §65.5 Ejemplos de términos por cooperativa (L3482) | T03 | T03: §3, RN-UXD-008, §10.7.1 … | Cubierta |
| › §65.6 Ejemplos de etiquetas de interfaz (L3497) | T03 | T03: §3, RF-UXD-146, RF-UXD-163 … | Cubierta |
| › §65.7 Caso de uso — CU-DIC-01 (L3511) | T03 | T03: encab., RF-UXD-152, RF-UXD-154 … | Cubierta |
| › §65.8 Consideraciones obligatorias para arquitectura y desarrollo (L3526) | T03 | T03: RF-UXD-040, RF-UXD-147, RF-UXD-157 … | Cubierta |
| › §65.9 Decisiones pendientes (L3539) | T03 | T03: RF-UXD-148, RF-UXD-161, RF-UXD-165 … | Cubierta |
| §66 Catálogo de servicios propios y habilitación por cooperativa (L3552) | M02, M19, T01, T03, T06, T10 | M02: encab., §1, §2.3 … · M19: encab., RN-POR-078 · T01: §2.3, RF-PLA-048, RF-PLA-063 … · T03: §10.1.5, SM-PLT-007 · (+2 anexos) | Cubierta |
| › Objetivo y requisito informado (§66) (L3554) | M02, M19, T01 | M02: encab., §1, RF-CAT-001 … · M19: RF-POR-004, RN-POR-078 · T01: RF-PLA-063, RF-PLA-070, RF-PLA-048 … | Cubierta |
| › Límite y distinciones (§66) (L3564) | M02, M19, T01, T03, T06, T10 | hereda de §66 | Cubierta (por sección) |
| › Alcance funcional propuesto (§66) (L3570) | M02, M19, T01, T03, T06, T10 | hereda de §66 | Cubierta (por sección) |
| › Datos y caso de uso — CU-CAT-01 (§66) (L3582) | M02, T01 | M02: encab., RF-CAT-007, §9.1 … · T01: §16.1, RF-PLA-063, CU-CAT-01 … | Cubierta |
| §67 Registro sencillo y contratación por cualquier persona (L3595) | M01, M17, M19, T03 | M01: encab., RF-PER-024, RF-PER-159 … · M17: RF-INS-005 · M19: encab., §1, RN-POR-001 … · T03: RF-UXD-120, SM-LND-006 | Cubierta |
| › Objetivo (§67) (L3597) | M01, M17, M19, T03 | hereda de §67 | Cubierta (por sección) |
| › Requisito y límite (§67) (L3601) | M01, M19 | M01: encab., RF-PER-159, RN-PER-118 … · M19: §1, RF-POR-022, RF-POR-023 … | Cubierta |
| › Alcance propuesto (§67) (L3605) | M01, M17, M19, T03 | hereda de §67 | Cubierta (por sección) |
| › Caso de uso — CU-REG-01 (§67) (L3618) | M01, M19 | M01: encab., §16, TEN-002 … · M19: §16.1, TEN-002, LND-B-v1 … | Cubierta |
| §68 Cuentas separadas o unificadas, mínimo de pago y mora configurable (L3624) | M01, M03, M07, M08, M10, T05 | M01: encab., RF-PER-071 · M03: encab., RF-MED-108, RN-MED-104 · M07: encab., RF-COB-028, RF-COB-029 … · M08: encab., §1, §3 … · (+2 anexos) | Cubierta |
| › Objetivo y requisito recibido (§68) (L3626) | M01, M07, M08, M09 | M01: encab., RF-PER-071 · M07: encab., §1, §3 … · M08: encab., RF-MOR-066, RF-MOR-067 … · M09: §18 | Cubierta |
| › Límite normativo y precisión de la solicitud (§68) (L3637) | M01, M03, M07, M08, M10, T05 | hereda de §68 | Cubierta (por sección) |
| › Parámetros propuestos (§68) (L3645) | M01, M03, M07, M08, M10, T05 | hereda de §68 | Cubierta (por sección) |
| › Caso de uso — CU-CTA-01 (§68) (L3661) | M07, M08 | M07: RF-COB-029, §16.1, §18 … · M08: encab., §3, RF-MOR-069 … | Cubierta |
| §69 Ciclos de corte, universos de clientes y facturación batch (L3675) | M03, M05, M06, T03, T08, T09, T11 | M03: RF-MED-067 · M05: encab., RF-FAC-001, RF-FAC-002 … · M06: encab., §1, RF-FIS-042 … · T03: SM-ADM-044 · (+3 anexos) | Cubierta |
| › Objetivo (§69) (L3677) | M03, M05, M06, T03, T08, T09, T11 | hereda de §69 | Cubierta (por sección) |
| › Requisitos recibidos (§69) (L3681) | M05, T11 | M05: encab., RF-FAC-001, RF-FAC-002 … · T11: encab., §1, RF-WFL-021 … | Cubierta |
| › Límite y definiciones (§69) (L3690) | M03, M05, M06, T03, T08, T09, T11 | hereda de §69 | Cubierta (por sección) |
| › Configuración y ejemplo (§69) (L3696) | M03, M05, M06, T03, T08, T09, T11 | hereda de §69 | Cubierta (por sección) |
| › Alcance funcional propuesto (§69) (L3707) | M03, M05, M06, T03, T08, T09, T11 | hereda de §69 | Cubierta (por sección) |
| › Validación fiscal de la factura A (§69) (L3724) | M03, M05, M06, T03, T08, T09, T11 | hereda de §69 | Cubierta (por sección) |
| › Caso de uso — CU-LOT-01 (§69) (L3732) | M05, M06, T11 | M05: encab., RF-FAC-039, RF-FAC-044 … · M06: encab., RF-FIS-042, §16 … · T11: encab., RF-WFL-026, §9.3 … | Cubierta |
| › Campos ilustrativos de la bandeja de excepciones (§69) (L3746) | M05, M06 | M05: RF-FAC-035, RF-FAC-038, RF-FAC-042 … · M06: §16, §18 | Cubierta |
| §70 Precisiones normativas y fuentes de esta ampliación (L3755) | M02, M05, M06, M08, M11 | M02: CTR-CAT-04 · M05: encab., §22: Adoptado · M06: encab., RF-FIS-042, RF-FIS-077 … · M08: encab., §1, RF-MOR-102 … · (+1 anexos) | Cubierta |
| §71 Pendientes específicos de catálogo, cuentas y lotes (L3771) | M01, M02, M04, M05, M07, M08, M19 (+1) | M01: encab., RF-PER-071 · M02: encab., RF-CAT-005, §21 … · M04: encab., RN-TAR-220 · M05: encab., RF-FAC-001, RF-FAC-004 … · (+4 anexos) | Cubierta |
| §72 Productos, subservicios y composición económica de cada servicio (L3787) | M02, M04, M11, M13, T09 | M02: encab., §1, RF-CAT-036 … · M04: encab., RF-TAR-029, RF-TAR-043 … · M11: RF-VEN-001, RF-VEN-002, RF-VEN-003 … · M13: encab., RF-STK-072 · (+1 anexos) | Cubierta |
| › Objetivo y requisito informado (§72) (L3789) | M02, M04, M11 | M02: encab., §1, RF-CAT-036 … · M04: encab., RF-TAR-029, RF-TAR-082 … · M11: encab., RF-VEN-001, RF-VEN-005 … | Cubierta |
| › Límite y modelo conceptual (§72) (L3800) | M02, M04, M11, M13, T09 | hereda de §72 | Cubierta (por sección) |
| › Alcance funcional propuesto (§72) (L3806) | M02, M04, M11, M13, T09 | hereda de §72 | Cubierta (por sección) |
| › Ejemplo de composición de Internet — datos ficticios (§72) (L3821) | M02, M04, M11, M13, T09 | hereda de §72 | Cubierta (por sección) |
| › Caso de uso — CU-PRO-01 (§72) (L3837) | M02, M04, M11 | M02: encab., RF-CAT-046, RN-CAT-011 … · M04: encab., RF-TAR-082, RF-TAR-084 … · M11: encab., RF-VEN-006, §16 … | Cubierta |
| §73 Instalación integral, equipo, conformidad, encuesta y activación (L3845) | M04, M10, M11, M13, M16, M18, T03 (+2) | M04: RN-TAR-212, RN-TAR-240, PRM-TAR-012 · M10: encab., §1, §2.2 … · M11: RF-VEN-004, RF-VEN-005, RF-VEN-011 … · M13: encab., §1, §2.3 … · (+5 anexos) | Cubierta |
| › Objetivo (§73) (L3847) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Requisitos recibidos (§73) (L3851) | M10, M13, T09 | M10: encab., RF-TEC-081, RF-TEC-085 … · M13: encab., §1, RF-STK-059 … · T09: encab., RF-COM-084, §9.5 … | Cubierta |
| › Límite y responsabilidades (§73) (L3863) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Flujo operativo propuesto (§73) (L3869) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Stock y equipo: evitar doble descuento (§73) (L3886) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Firma y conformidad: datos propuestos (§73) (L3898) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Encuesta de satisfacción: alcance propuesto (§73) (L3902) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Activación y facturación: parámetros a definir (§73) (L3914) | M04, M10, M11, M13, M16, M18, T03 (+2) | hereda de §73 | Cubierta (por sección) |
| › Caso de uso integrado — CU-INS-01 (§73) (L3930) | M10, M11, M13, M17, T09 | M10: §9.1, §16, RF-TEC-085 … · M11: encab., RF-VEN-011, §16 … · M13: §9.2, §16, RF-STK-054 … · M17: §16 (CU-INS-15, antes CU-INS-01; el CU-INS-01 lo define M10, cierre 05-11-2026) · (+1 anexos) | Cubierta |
| §74 Pendientes sobre composición comercial e instalación (L3953) | M02, M04, M10, M11, M13 | M02: encab., RF-CAT-040, RF-CAT-051 … · M04: encab., RF-TAR-115, RN-TAR-246 · M10: encab. · M11: PA-VEN-08, PA-VEN-09 · (+1 anexos) | Cubierta |
| §75 ERP contable, centros de costos y cuentas corrientes por servicio (L3968) | M07, M12, M14, M15, M16, T10 | M07: encab., RF-COB-015, RF-COB-173 … · M12: encab. · M14: encab., RF-TES-017, RF-TES-036 … · M15: encab., §1, §3 … · (+2 anexos) | Cubierta |
| › Objetivo y requisito informado (§75) (L3970) | M07, M15 | M07: encab., RF-COB-005, RF-COB-008 · M15: encab., RF-CON-081, RF-CON-092 … | Cubierta |
| › Límite y conceptos (§75) (L3984) | M07, M12, M14, M15, M16, T10 | hereda de §75 | Cubierta (por sección) |
| › Alcance funcional propuesto (§75) (L3992) | M07, M12, M14, M15, M16, T10 | hereda de §75 | Cubierta (por sección) |
| › Conciliaciones y controles (§75) (L4008) | M07, M12, M14, M15, M16, T10 | hereda de §75 | Cubierta (por sección) |
| › Caso de uso conciliado — CU-CON-01 (§75) (L4017) | M14, M15 | M14: encab., §16, RF-TES-036 … · M15: encab., RF-CON-090, RF-CON-093 … | Cubierta |
| › Ejemplos de precarga (§75) (L4041) | M07, M12, M14, M15, M16, T10 | hereda de §75 | Cubierta (por sección) |
| §76 Definiciones pendientes de contabilidad y costos (L4054) | M14, M15 | M14: encab., RF-TES-049 · M15: encab., RF-CON-031, RF-CON-119 … | Cubierta |
| §77 Catálogo nacional de calles y ubicación del servicio en Google Maps (L4068) | M01, M10, T03, T04, T06 | M01: encab., RF-PER-073, RF-PER-074 … · M10: encab., §1, §2.2 … · T03: RF-UXD-089, RN-UXD-057, §10.2.3 … · T04: encab., §1, RF-CFG-065 … · (+1 anexos) | Cubierta |
| › Objetivo y requisitos informados (§77) (L4070) | M01, M10, T04 | M01: encab., RF-PER-073, RF-PER-076 … · M10: encab., RF-TEC-215, RN-TEC-059 … · T04: encab., RF-CFG-067, RF-CFG-073 … | Cubierta |
| › Fuentes verificadas y cobertura (§77) (L4080) | M01, M10, T03, T04, T06 | hereda de §77 | Cubierta (por sección) |
| › Límite y relación con otros módulos (§77) (L4088) | M01, M10, T03, T04, T06 | hereda de §77 | Cubierta (por sección) |
| › Alcance funcional propuesto (§77) (L4094) | M01, M10, T03, T04, T06 | hereda de §77 | Cubierta (por sección) |
| › Caso de uso — CU-GEO-01 (§77) (L4113) | M01, M10, T04, T06 | M01: encab., RF-PER-079, RN-PER-069 … · M10: RF-TEC-174, §16, RF-TEC-215 … · T04: encab., RN-CFG-027, §9.9 … · T06: FI-INT-69, PRM-INT-054, CTR-INT-20 | Cubierta |
| §78 Compras y stock por servicio e integración financiera del ERP (L4121) | M10, M11, M12, M13, M14, M15 | M10: §16, §21 · M11: §2, RN-VEN-006 · M12: encab., §1, §2 … · M13: encab., §1, §2.3 … · (+2 anexos) | Cubierta |
| › Objetivo y requisitos reafirmados (§78) (L4123) | M12, M13, M14, M15 | M12: encab., §1, RF-CMP-051 … · M13: encab., §1, RF-STK-009 … · M14: encab., RF-TES-126, RF-TES-113 … · M15: encab., RF-CON-092, CU-OPE-01 … | Cubierta |
| › Compras y stock: alcance y límite (§78) (L4134) | M10, M11, M12, M13, M14, M15 | hereda de §78 | Cubierta (por sección) |
| › Circuito financiero integrado (§78) (L4147) | M10, M11, M12, M13, M14, M15 | hereda de §78 | Cubierta (por sección) |
| › Caso de uso — CU-OPE-01 (§78) (L4160) | M10, M12, M13, M14, M15 | M10: RN-TEC-060, §16 · M12: encab., RF-CMP-018, RF-CMP-067 … · M13: encab., RF-STK-131, §16 … · M14: encab., §16, RF-TES-113 … · (+1 anexos) | Cubierta |
| §79 Fuentes geográficas y de mapas (L4168) | M10, T04 | M10: encab. · T04: encab., §1, RF-CFG-068 … | Cubierta |
| §80 Pendientes de geografía y compras por servicio (L4179) | M02, M10, M12, M13, M14, T04 | M02: encab., RF-CAT-067, RN-CAT-023 · M10: encab. · M12: encab., RF-CMP-030, RF-CMP-051 … · M13: encab. · (+2 anexos) | Cubierta |
| §81 Configuración independiente y copia de servicios entre tenants (L4192) | M02, M11, M12, M13, T01, T03, T04 (+2) | M02: encab., §1, §2.1 … · M11: RF-VEN-117 · M12: RF-CMP-146 · M13: encab., RF-STK-082, RN-STK-073 … · (+5 anexos) | Cubierta |
| › Objetivo y requisitos informados (§81) (L4194) | M02, T04 | M02: encab., §1, RF-CAT-104 … · T04: encab., RF-CFG-041, RF-CFG-124 … | Cubierta |
| › Límite y distinciones (§81) (L4204) | M02, M11, M12, M13, T01, T03, T04 (+2) | hereda de §81 | Cubierta (por sección) |
| › Alcance funcional propuesto (§81) (L4212) | M02, M11, M12, M13, T01, T03, T04 (+2) | hereda de §81 | Cubierta (por sección) |
| › Componentes de ejemplo (§81) (L4228) | M02, M11, M12, M13, T01, T03, T04 (+2) | hereda de §81 | Cubierta (por sección) |
| › Caso de uso — CU-COP-01 (§81) (L4241) | M02, T04, T12-p1 | M02: encab., §9.6, §16 … · T04: RF-CFG-029, §16, RF-CFG-041 … · T12-p1: §1.2 | Cubierta |
| §82 Connectyx como referencia prioritaria del componente de comunidad (L4255) | M19, T09 | M19: encab., RF-POR-124, RN-POR-053 · T09: §2.3, §16.1, CU-COM-01 … | Cubierta |
| › Requisito informado — COM-001 (§82) (L4257) | T09 | T09: encab., §16.1, CU-COM-01 … | Cubierta |
| › Ubicación del proyecto indicada por el solicitante (§82) (L4261) | M19, T09 | hereda de §82 | Cubierta (por sección) |
| › Objetivo y límite (§82) (L4271) | M19, T09 | hereda de §82 | Cubierta (por sección) |
| › Ámbitos prioritarios de revisión (§82) (L4277) | M19, T09 | hereda de §82 | Cubierta (por sección) |
| › Caso de uso de revisión — CU-COM-01 (§82) (L4293) | T09 | T09: encab., §16.1, CU-COM-01 … | Cubierta |
| › Pendientes específicos (§82) (L4299) | M19, T09 | hereda de §82 | Cubierta (por sección) |
| §83 Titular DNI/CUIT y contratos independientes en un domicilio (L4311) | M01, M02, M19, T02, T03, T10 | M01: RF-PER-015, RF-PER-021, RF-PER-024 … · M02: RF-CAT-067, CTR-CAT-15, §21 · M19: RN-POR-068 · T02: encab., §2.2, RF-IAM-024 … · (+2 anexos) | Cubierta |
| › Objetivo y requisitos recibidos (§83) (L4313) | M01, T02, T07 | M01: encab., §1, §2.3 … · T02: encab., RF-IAM-024, RN-IAM-025 … · T07: RF-MIG-023, RN-MIG-014, CTR-MIG-11 … | Cubierta |
| › Modelo y límites (§83) (L4323) | M01, M02, M19, T02, T03, T10 | hereda de §83 | Cubierta (por sección) |
| › Caso de uso — CU-TIT-01 (§83) (L4334) | M01, T02 | M01: encab., §9.7, §16 … · T02: RN-IAM-026, RF-IAM-024, RN-IAM-025 … | Cubierta |
| §84 Núcleo común y reglas propias de cada servicio (L4350) | M02, T04, T12-p1, T12-p2 | M02: encab., §1, §2.1 … · T04: §2.1, RF-CFG-043, RF-CFG-124 … · T12-p1: §0.2, §1.2, §2.2 … · T12-p2: §2 | Cubierta |
| › Requisito confirmado (§84) (L4352) | M02, T04, T12-p1, T12-p2 | hereda de §84 | Cubierta (por sección) |
| › Perfil de configuración propuesto (§84) (L4358) | M02, T04, T12-p1, T12-p2 | hereda de §84 | Cubierta (por sección) |
| §85 Investigación: autoridades, Córdoba y vigencia de las fuentes (L4378) | M02, M06 | M02: encab., §1, RF-CAT-014 … · M06: encab., RF-FIS-011, RF-FIS-012 … | Cubierta |
| › Método y alcance (§85) (L4380) | M02, M06 | hereda de §85 | Cubierta (por sección) |
| › Mapa de responsabilidades (§85) (L4386) | M02, M06 | hereda de §85 | Cubierta (por sección) |
| §86 Particularidades de Internet (L4399) | M02, M04, M08, M10, M13, T06 | M02: encab., §1, RF-CAT-026 … · M04: encab., RF-TAR-104, RF-TAR-105 … · M08: encab., §1, RN-MOR-082 … · M10: encab., §1, §2.2 … · (+2 anexos) | Cubierta |
| › Base verificada (§86) (L4401) | M02, M04, M08, M10, M13, T06 | hereda de §86 | Cubierta (por sección) |
| › Objetivo y límite del módulo (§86) (L4405) | M02, M04, M08, M10, M13, T06 | hereda de §86 | Cubierta (por sección) |
| › Alcance funcional propuesto (§86) (L4409) | M02, M04, M08, M10, M13, T06 | hereda de §86 | Cubierta (por sección) |
| › Casos y controles (§86) (L4424) | M02, M04, M08, M10, M13, T06 | hereda de §86 | Cubierta (por sección) |
| §87 Particularidades de electricidad en Córdoba (L4432) | M02, M03, M04, M08, M12, M15, T06 | M02: encab., §1, RF-CAT-040 … · M03: encab., §2.3, RF-MED-012 … · M04: encab., RF-TAR-044, RF-TAR-109 … · M08: encab., §1, RF-MOR-111 … · (+3 anexos) | Cubierta |
| › Base verificada (§87) (L4434) | M02, M03, M04, M08, M12, M15, T06 | hereda de §87 | Cubierta (por sección) |
| › Objetivo y límite (§87) (L4440) | M02, M03, M04, M08, M12, M15, T06 | hereda de §87 | Cubierta (por sección) |
| › Alcance funcional propuesto (§87) (L4444) | M02, M03, M04, M08, M12, M15, T06 | hereda de §87 | Cubierta (por sección) |
| › Compras y costos versus tarifa al usuario (§87) (L4461) | M02, M03, M04, M08, M12, M15, T06 | hereda de §87 | Cubierta (por sección) |
| › Caso de uso — CU-ESP-ELE (§87) (L4465) | M02, M03, M04, T12-p1 | M02: encab., §16, RF-CAT-096 · M03: §16, RF-MED-012, RN-MED-121 · M04: encab., §16.1, RN-TAR-101 … · T12-p1: §4.3 | Cubierta |
| §88 Particularidades de agua potable y saneamiento en Córdoba (L4473) | M02, M03, M04, M08, T12-p1 | M02: encab., §1, RN-CAT-023 … · M03: encab., RF-MED-012, §16 … · M04: encab., RF-TAR-048, RN-TAR-228 … · M08: encab., §1, RN-MOR-082 … · (+1 anexos) | Cubierta |
| › Base verificada (§88) (L4475) | M02, M03, M04, M08, T12-p1 | hereda de §88 | Cubierta (por sección) |
| › Objetivo y límite (§88) (L4479) | M02, M03, M04, M08, T12-p1 | hereda de §88 | Cubierta (por sección) |
| › Alcance funcional propuesto (§88) (L4483) | M02, M03, M04, M08, T12-p1 | hereda de §88 | Cubierta (por sección) |
| › Caso de uso — CU-ESP-AG (§88) (L4500) | M02, M03, M04, T12-p1 | M02: encab., §16, §22: 6.C.5 … · M03: §16, RF-MED-012, RN-MED-027 · M04: encab., §16.1, RN-TAR-076 · T12-p1: §5.3 | Cubierta |
| §89 Particularidades de gas (L4508) | M02, M03, M04, M08, T06 | M02: encab., §1, RF-CAT-066 … · M03: encab., RF-MED-063, §7.4 … · M04: encab., RF-TAR-040, RN-TAR-035 … · M08: encab., §1, §2.3 … · (+1 anexos) | Cubierta |
| › Base verificada (§89) (L4510) | M02, M03, M04, M08, T06 | hereda de §89 | Cubierta (por sección) |
| › Objetivo y límite (§89) (L4514) | M02, M03, M04, M08, T06 | hereda de §89 | Cubierta (por sección) |
| › Alcance funcional propuesto (§89) (L4518) | M02, M03, M04, M08, T06 | hereda de §89 | Cubierta (por sección) |
| › Caso de uso — CU-ESP-GAS (§89) (L4532) | M02, M03, M04, T12-p1 | M02: encab., §16, RF-CAT-095 … · M03: §16, RF-MED-063, RN-MED-069 · M04: encab., §16.1, RN-TAR-035 · T12-p1: §7.1, §7.3, ESC-SRV-GAS-03 | Cubierta |
| §90 Particularidades de cementerio parque (L4540) | M02, M08, M13, M18, T04 | M02: encab., §1, RF-CAT-008 … · M08: encab., §1, RN-MOR-082 … · M13: encab., RF-STK-132 · M18: encab., §1, RF-SOC-043 … · (+1 anexos) | Cubierta |
| › Base verificada (§90) (L4542) | M02, M08, M13, M18, T04 | hereda de §90 | Cubierta (por sección) |
| › Objetivo y límite (§90) (L4546) | M02, M08, M13, M18, T04 | hereda de §90 | Cubierta (por sección) |
| › Alcance funcional propuesto (§90) (L4550) | M02, M08, M13, M18, T04 | hereda de §90 | Cubierta (por sección) |
| › Caso de uso — CU-ESP-CEM (§90) (L4565) | M02, M18, T12-p2 | M02: encab., §16, PRM-CAT-097 · M18: encab., RF-SOC-052, §9.4 … · T12-p2: §1, §3 | Cubierta |
| §91 Particularidades de banco de sangre cooperativo (L4573) | M02, M08, M13, M18, T04, T09 | M02: encab., §1, §6.C.12 … · M08: encab., §1, RN-MOR-082 … · M13: encab., RF-STK-132, RN-STK-074 … · M18: encab., §1, §2.2 … · (+2 anexos) | Cubierta |
| › Base verificada (§91) (L4575) | M02, M08, M13, M18, T04, T09 | hereda de §91 | Cubierta (por sección) |
| › Objetivo y alcance inicial propuesto (§91) (L4581) | M02, M08, M13, M18, T04, T09 | hereda de §91 | Cubierta (por sección) |
| › Límites expresos (§91) (L4595) | M02, M08, M13, M18, T04, T09 | hereda de §91 | Cubierta (por sección) |
| › Caso de uso — CU-ESP-SAN (§91) (L4599) | M02, M18, T12-p2 | M02: encab., §16, §21 … · M18: encab., RF-SOC-004, RF-SOC-068 … · T12-p2: §1, §3 | Cubierta |
| §92 Otros servicios cooperativos y extensiones a relevar (L4605) | M02, M15, M18 | M02: encab., §1, RF-CAT-001 … · M15: RN-CON-122 · M18: encab., §1, RF-SOC-001 … | Cubierta |
| §93 Reglas transversales que cada servicio debe concretar (L4621) | M02, M18, T04 | M02: encab., §1, RF-CAT-015 … · M18: encab., §1, RF-SOC-002 … · T04: §2.1, RF-CFG-044, RF-CFG-101 … | Cubierta |
| › Nuevos requisitos identificados (§93) (L4633) | M02, M18, T04 | M02: encab., RF-CAT-014, RF-CAT-013 … · M18: encab., §1, RF-SOC-002 … · T04: encab., RF-CFG-044, RF-CFG-101 … | Cubierta |
| §94 Fuentes de la investigación por servicios (L4644) | M02 | M02: encab., §1, §22: serviceConcessions.sources; 6.C | Cubierta |
| §95 Validación pendiente y siguientes insumos por servicio (L4677) | M02, M18 | M02: encab., §1, RF-CAT-009 … · M18: encab., PA-SOC-03, PA-SOC-05 … | Cubierta |
| §96 Revisión de coherencia del documento — versión 0.15 (L4697) | — | — | **SIN COBERTURA** |
| › Alcance de la revisión (§96) (L4699) | — | — | **SIN COBERTURA** |
| › Hallazgos de estructura y su tratamiento (§96) (L4703) | — | — | **SIN COBERTURA** |
| §97 Requisitos complementarios identificados en la revisión (L4717) | T09 | T09: §2.3, RF-COM-119, RF-COM-163 … | Cubierta |
| › §97.1 Protección de datos personales (L4721) | M01, M16, M17, M18, T02, T08, T10 (+1) | M01: RF-PER-014, RF-PER-028, RF-PER-037 … · M16: encab., §4, RF-SUE-020 … · M17: encab., RF-INS-005, RF-INS-103 · M18: encab., RF-SOC-037, RF-SOC-069 … · (+4 anexos) | Cubierta |
| › §97.2 Factura electrónica e integración con ARCA (L4740) | M05, M06, T06, T08, T11 | M05: encab., RF-FAC-059, RF-FAC-062 … · M06: encab., §1, RF-FIS-024 … · T06: encab., RF-INT-015, RF-INT-024 … · T08: RNF-NFR-011, RNF-NFR-047, RNF-NFR-199 … · (+1 anexos) | Cubierta |
| › §97.3 Vencimientos múltiples, recargos e intereses (L4756) | M05, M06, M08, T06, T08 | M05: encab., RF-FAC-086, RF-FAC-087 … · M06: RN-FIS-123 · M08: encab., RF-MOR-004, RF-MOR-011 … · T06: FI-INT-01, RN-INT-040 · (+1 anexos) | Cubierta |
| › §97.4 Conceptos por cuenta y orden de terceros (L4770) | M05, M06, M15, T06 | M05: encab., RF-FAC-120, RN-FAC-113 … · M06: encab., §1, RF-FIS-003 … · M15: encab., RF-CON-077, RN-CON-066 … · T06: encab., FI-INT-01, RN-INT-040 | Cubierta |
| › §97.5 Energía prepaga y telemedición (L4783) | M03, T06 | M03: encab., RF-MED-106, RF-MED-108 … · T06: encab., RN-INT-040, §12.13 … | Cubierta |
| › §97.6 Canales de cobro del mercado argentino (L4791) | M07, T06 | M07: encab., RF-COB-053, CTR-COB-18 · T06: encab., FI-INT-01, RN-INT-040 | Cubierta |
| › §97.7 Capital social y aportes cooperativos (L4800) | M15, M17, T06, T07 | M15: encab., §1, RF-CON-075 … · M17: encab., §1, RF-INS-032 … · T06: FI-INT-01, RN-INT-040 · T07: §19.1 | Cubierta |
| › §97.8 Requisitos no funcionales (L4809) | T01, T07, T08, T10, T11 | T01: RF-PLA-030, RF-PLA-035, RF-PLA-083 … · T07: encab., RF-MIG-062, §16 … · T08: §7.1, RNF-NFR-001, RNF-NFR-008 … · T10: encab., RF-BIA-024, RF-BIA-033 … · (+1 anexos) | Cubierta |
| › §97.9 Ambientes, configuración y pruebas por tenant (L4825) | T01, T07, T08, T10 | T01: §1, RF-PLA-045, RF-PLA-047 … · T07: encab., RF-MIG-096, §9.10 … · T08: RN-NFR-014, RNF-NFR-099, RNF-NFR-170 … · T10: RF-BIA-085, RF-BIA-014, RN-BIA-016 … | Cubierta |
| › §97.10 Migración desde ProCoop (L4831) | M05, T01, T07, T11 | M05: encab., §22: Adoptado · T01: §9.2, §19.4 · T07: encab., §2.3, §3 … · T11: encab. | Cubierta |
| › §97.11 Comercialización de la plataforma (L4849) | T01, T07, T08 | T01: §1, §1.2, §2.1 … · T07: CTR-MIG-04 · T08: RNF-NFR-250, PRM-NFR-096 | Cubierta |
| › §97.12 Priorización propuesta para la primera versión (L4853) | M11, M13, M15, M19, T01, T07, T08 | M11: RF-VEN-084 · M13: encab. · M15: encab., RF-CON-150, RF-CON-152 · M19: encab., RF-POR-108, RN-POR-033 · (+3 anexos) | Cubierta |
| §98 Pendientes de la revisión 0.15 (L4866) | M01, M02, M03, M04, M05, M06, M07 (+14) | M01: RF-PER-029, PA-PER-05, PA-PER-14 · M02: encab., §6.C.15, §6.C.16 … · M03: encab., §21, PA-MED-04 … · M04: encab. · (+17 anexos) | Cubierta |
| §99 Relevamiento del mercado argentino de sistemas para cooperativas (L4881) | M03, M13, T01 | M03: §13.1 · M13: encab., RF-STK-110 · T01: §1, §1.2, CTR-PLA-14 | Cubierta |
| › §99.1 Método y criterio (L4883) | M03, M13, T01 | hereda de §99 | Cubierta (por sección) |
| › §99.2 Sistemas relevados (L4887) | M03, M13, T01 | hereda de §99 | Cubierta (por sección) |
| › §99.3 Matriz comparativa (L4906) | M11, M16, T01, T10 | M11: RF-VEN-084 · M16: encab. · T01: RF-PLA-072 · T10: encab., RF-BIA-041 | Cubierta |
| › §99.4 Conclusiones del relevamiento (L4956) | M16, T01 | M16: encab., CTR-SUE-02 · T01: §1.2 | Cubierta |
| §100 Requisitos incorporados por el relevamiento de mercado (L4966) | M15, M17, M18, T06, T09, T10, T11 | M15: encab., RN-CON-105, PRM-CON-060 … · M17: encab., RF-INS-021, RF-INS-029 · M18: encab., CTR-SOC-10, CTR-SOC-09 · T06: encab., §12.18, RN-INT-040 … · (+3 anexos) | Cubierta |
| › MER-001. Usuario-generador de energía renovable (generación distribuida) (§100) (L4970) | M02, M03, M04, M06, T05, T10, T12-p1 | M02: encab., RF-CAT-096, §6.C.4 … · M03: encab., §1, RF-MED-013 … · M04: encab., RF-TAR-045, RN-TAR-039 … · M06: encab., §2.2, RF-FIS-073 … · (+3 anexos) | Cubierta |
| › MER-002. Comprobante de servicios públicos y regímenes informativos (§100) (L4990) | M05, M06, T10 | M05: encab., §22: Informado (referencia) · M06: encab., §1, RF-FIS-073 … · T10: encab., RF-BIA-090, RF-BIA-035 … | Cubierta |
| › MER-003. Grandes usuarios y contratos especiales (§100) (L4996) | M02, M03, M04, M05, T05, T12-p1 | M02: encab., RF-CAT-097, §6.C.4 … · M03: encab., RF-MED-004, RF-MED-013 … · M04: encab., RF-TAR-044, RF-TAR-114 … · M05: RF-FAC-174, RN-FAC-154, PAN-FAC-47 · (+2 anexos) | Cubierta |
| › MER-004. Consumo no registrado, fraude e inspecciones (§100) (L5002) | M03, M10 | M03: encab., §2.3, RF-MED-126 … · M10: encab., §1, §5.14 … | Cubierta |
| › MER-005. Garantías y garantes (§100) (L5010) | M07, M08 | M07: §22: 5.2, 5.8, 5.10 · M08: encab., §1, §3 … | Cubierta |
| › MER-006. Incobrables, gestión judicial y prescripción (§100) (L5015) | M07, M08, M15, M16 | M07: §22: 5.2, 5.8, 5.10 · M08: encab., §1, §3 … · M15: encab., RF-CON-074, RN-CON-063 … · M16: encab., §2.2, §2.3 … | Cubierta |
| › MER-007. Cobradores y cobranza fuera de oficina (§100) (L5022) | M03, M07, T05, T06 | M03: encab., RF-MED-114 · M07: encab., §1, §3 … · T05: COL-COB-18 · T06: §12.18, RN-INT-040, FI-INT-75 … | Cubierta |
| › MER-008. Impresión y reparto de facturas (§100) (L5028) | M05, T06, T09 | M05: encab., §1, RF-FAC-154 … · T06: §12.18, RN-INT-040, FI-INT-75 … · T09: encab., §2.2, §22: print_invoice/print_letter … | Cubierta |
| › MER-009. Obras, loteos y contribución por mejoras (§100) (L5036) | M10, M11, M15, M18 | M10: encab., §1, §3 … · M11: encab., RF-VEN-047, RF-VEN-035 · M15: encab., RN-CON-105, PRM-CON-060 … · M18: encab., CTR-SOC-10 | Cubierta |
| › MER-010. Ventas y cuotas incluidas en la factura del servicio (§100) (L5044) | M05, M11, M17, M18 | M05: encab., RF-FAC-118, RN-FAC-035 … · M11: encab., §1, RF-VEN-005 … · M17: RF-INS-040, CTR-INS-05, §21 … · M18: §21, PA-SOC-13 | Cubierta |
| › MER-011. Capital social, excedentes y Libro de asociados (§100) (L5051) | M15, M17 | M15: encab., §1, RF-CON-075 … · M17: encab., §1, RF-INS-021 … | Cubierta |
| › MER-012. Workflow de autorizaciones (§100) (L5060) | M05, M09, M11, M12, M15, M16, T06 (+3) | M05: RF-FAC-043 · M09: encab., RF-CRM-077, RN-CRM-035 … · M11: encab., RF-VEN-008, PRM-VEN-004 · M12: encab., RF-CMP-032, RF-CMP-052 … · (+6 anexos) | Cubierta |
| › MER-013. Generador de reportes para el tenant (§100) (L5068) | T05, T06, T10, T11 | T05: COL-BIA-18 · T06: RN-INT-040, FI-INT-75, FI-INT-107 … · T10: encab., §1, RF-BIA-035 … · T11: encab., RF-WFL-026 | Cubierta |
| › MER-014. Informes a entes reguladores (§100) (L5076) | M06, M09, M17, T06, T10 | M06: encab., §1, RF-FIS-143 … · M09: RF-CRM-114, RF-CRM-258, RF-CRM-257 · M17: encab., RF-INS-028, RF-INS-071 … · T06: encab., RN-INT-040, FI-INT-75 … · (+1 anexos) | Cubierta |
| › MER-015. Flota y vehículos (§100) (L5084) | M10, M16, M18, T06 | M10: encab., §2.2, §2.3 … · M16: encab., RF-SUE-050 · M18: encab., §1, §2.2 … · T06: encab., RN-INT-040, FI-INT-75 … | Cubierta |
| › MER-016. Canales de atención adicionales (§100) (L5090) | M05, M09, T06, T09, T11 | M05: encab., RF-FAC-156, §22: Adoptado · M09: encab., §1, §3 … · T06: encab., RN-INT-040, FI-INT-75 … · T09: encab., §13, RF-COM-136 · (+1 anexos) | Cubierta |
| › MER-017. Telecomunicaciones: telefonía y red de internet (§100) (L5096) | M02, M10, T06 | M02: encab., RF-CAT-098, §6.C.1 … · M10: encab., §1, RF-TEC-132 … · T06: encab., RN-INT-040, §12.18 … | Cubierta |
| › MER-018. Lecturas y facturación: variantes adicionales (§100) (L5101) | M03, M05, M19, T06 | M03: encab., RF-MED-028, RF-MED-057 … · M05: encab., RF-FAC-170, §22: Adoptado · M19: encab., §3, RF-POR-107 … · T06: RN-INT-040, FI-INT-75, FI-INT-107 … | Cubierta |
| › MER-019. Mejoras a cobranza y mora ya definidas (§100) (L5107) | M05, M07, M08, M10, T06 | M05: encab., RF-FAC-135, RF-FAC-151 … · M07: encab., §3, RF-COB-023 … · M08: encab., RF-MOR-041, RF-MOR-117 … · M10: encab., RF-TEC-132, RF-TEC-135 … · (+1 anexos) | Cubierta |
| › MER-020. Activos, garantías de equipos y salida del cliente (§100) (L5115) | M10, M13, T01, T06, T10 | M10: encab., RF-TEC-147, §22: §2.3 (M13 … · M13: encab., §1, §2.2 … · T01: §1.2, RF-PLA-051, RF-PLA-119 … · T06: encab., §12.18, RN-INT-040 … · (+1 anexos) | Cubierta |
| §101 Pendientes y fuentes del relevamiento de mercado (L5121) | M01, M02, M03, M04, M05, M06, M07 (+11) | M01: PA-PER-05, PA-PER-14, RF-PER-029 · M02: encab., PRM-CAT-081 · M03: encab., §21, PA-MED-08 … · M04: encab. · (+14 anexos) | Cubierta |
| › Pendientes (§101) (L5123) | M01, M02, M03, M04, M05, M06, M07 (+11) | hereda de §101 | Cubierta (por sección) |
| › Fuentes (§101) (L5132) | M01, M02, M03, M04, M05, M06, M07 (+11) | hereda de §101 | Cubierta (por sección) |
| §102 Complemento de análisis funcional y diseño — AGR-001 a AGR-036 (L5155) | M02, M03, M13, M15, M16, M17, T01 (+4) | M02: encab., §6.C.9 · M03: encab., §17, §22: §17 (escenarios transversales) · M13: encab. · M15: RF-CON-006, RN-CON-118 · (+7 anexos) | Cubierta |
| › Origen e incorporación (§102) (L5157) | — | — | Descartada (metadato de la fuente, sin requisito) |
| › Correspondencia de referencias (§102) (L5161) | — | — | Descartada (metadato de la fuente, sin requisito) |
| › §102.1 Propósito y criterio de revisión (L5192) | M02, M03, M13, M16, T01, T07, T11 | M02: encab. · M03: encab. · M13: encab. · M16: encab. · (+3 anexos) | Débil (solo encabezado) |
| › §102.2 Diagnóstico principal (L5212) | M02, M03, M13, M16, T01, T07, T11 | M02: encab. · M03: encab. · M13: encab. · M16: encab. · (+3 anexos) | Débil (solo encabezado) |
| › › §102.2.1 Qué ya está y no hace falta volver a inventar (L5220) | M02, M03, M13, M16, T01, T07, T11 | M02: encab. · M03: encab. · M13: encab. · M16: encab. · (+3 anexos) | Débil (solo encabezado) |
| › §102.3 Matriz de propuestas y trazabilidad (L5233) | M02, M03, M13, M16, T01, T07, T11 | M02: encab. · M03: encab. · M13: encab. · M16: encab. · (+3 anexos) | Débil (solo encabezado) |
| › §102.4 Fichas de ampliación recomendadas (L5276) | T01, M16, T03, T06, T08, M01, M15 (+26) | ver subsecciones | Cubierta (por subsecciones) |
| › › AGR-001 — Consolidar requisitos y decisiones en un catálogo único (§102.4) (L5280) | T01, T10 | T01: encab., RF-PLA-163 · T10: RF-BIA-016, RN-BIA-005, KPI-CMP-05 … | Cubierta |
| › › AGR-002 — Responsable de cada dato y límite entre ERP, CRM y operación (§102.4) (L5292) | M01, M02, M09, M15, M16, T01, T11 | M01: encab., RF-PER-124, RF-PER-172 … · M02: encab., §2.1, §2.3 … · M09: encab., §1, §2.2 … · M15: encab., §2.1, RF-CON-052 · (+3 anexos) | Cubierta |
| › › AGR-003 — Modelos de estados y reversión por proceso (§102.4) (L5304) | M01, M02, M04, M08, M09, M10, M11 (+9) | M01: encab., RF-PER-010, RF-PER-011 … · M02: encab., RF-CAT-061, RF-CAT-091 … · M04: RF-TAR-011, §8, CTR-TAR-07 … · M08: encab., RF-MOR-117, §8 … · (+12 anexos) | Cubierta |
| › › AGR-004 — Ciclo de vida completo de la cooperativa y preparación para producción (§102.4) (L5316) | T01, T02, T10 | T01: encab., §1, §2.2 … · T02: §4.4 · T10: RF-BIA-086 | Cubierta |
| › › AGR-005 — Contrato comercial SaaS y habilitación de capacidades (§102.4) (L5328) | M02, T01 | M02: encab., §2.3, RF-CAT-002 … · T01: encab., §1, RF-PLA-051 … | Cubierta |
| › › AGR-006 — Identidad de acceso, pertenencia y selección de cooperativa (§102.4) (L5340) | M01, M16, M19, T01, T02 | M01: encab., RF-PER-002, RF-PER-157 … · M16: encab., §2.2, RF-SUE-021 … · M19: encab., §1, RF-POR-027 … · T01: RN-PLA-003 · (+1 anexos) | Cubierta |
| › › AGR-007 — Representaciones, titulares, beneficiarios y cambios de responsabilidad (§102.4) (L5352) | M01, M02, M17, M18, M19, T02 | M01: encab., §2.1, RF-PER-099 … · M02: §4, §7.18, CTR-CAT-03 … · M17: encab., RF-INS-008, RF-INS-083 … · M18: encab., RF-SOC-054, RF-SOC-020 · (+2 anexos) | Cubierta |
| › › AGR-008 — Regla exacta de combinación entre roles y perfiles (§102.4) (L5364) | M01, M02, M16, M17, M18, T02, T12-p2 | M01: §4, RF-PER-102 · M02: §4, RF-CAT-035, RF-CAT-031 · M16: §4, RN-SUE-066 · M17: §4, RF-INS-069, ESC-INS-14 … · (+3 anexos) | Cubierta |
| › › AGR-009 — Publicación segura de configuración y paquetes de servicio (§102.4) (L5376) | M02, M04, M05, M15, M16, T01, T02 (+3) | M02: encab., §2.1, §3 … · M04: encab., RF-TAR-002, RF-TAR-007 … · M05: encab., RF-FAC-045, §22: Adoptado · M15: encab., RF-CON-006, RN-CON-109 … · (+6 anexos) | Cubierta |
| › › AGR-010 — Historia con fecha efectiva y fecha de registro (§102.4) (L5388) | M01, M02, M03, M04, M05, M06, M07 (+15) | M01: encab., RF-PER-028, RF-PER-151 … · M02: encab., RF-CAT-034, RF-CAT-057 … · M03: encab., RF-MED-070, RN-MED-014 … · M04: encab., §1, RF-TAR-008 … · (+18 anexos) | Cubierta |
| › › AGR-011 — Invariantes monetarias y única fuente del saldo (§102.4) (L5400) | M02, M03, M04, M05, M06, M07, M08 (+10) | M02: §7.6 · M03: RN-MED-068 · M04: encab., §2.3, RF-TAR-058 … · M05: encab., §2.2, RF-FAC-070 … · (+13 anexos) | Cubierta |
| › › AGR-012 — Pagos excedentes, anticipos y cobros sin identificar (§102.4) (L5412) | M06, M07, M08, M14, M15, M19, T07 | M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: encab., §1, RF-COB-038 … · M08: RF-MOR-115, RF-MOR-168, RF-MOR-036 · M14: encab., §1, RF-TES-040 … · (+3 anexos) | Cubierta |
| › › AGR-013 — Devoluciones y reversos con sus dos efectos (§102.4) (L5424) | M03, M05, M06, M07, M08, M14 | M03: RN-MED-111 · M05: encab., RF-FAC-104, RF-FAC-106 … · M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: encab., §1, RF-COB-157 … · (+2 anexos) | Cubierta |
| › › AGR-014 — Vida completa de convenios y financiación (§102.4) (L5436) | M06, M07, M08, M11, M15 | M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: RN-COB-011 · M08: encab., §1, §2.3 … · M11: encab., RF-VEN-091 · (+1 anexos) | Cubierta |
| › › AGR-015 — Cierre y aprobación de cada ciclo de facturación (§102.4) (L5448) | M03, M05, M06, M07, M15, T06, T08 (+1) | M03: RF-MED-038, ESC-MED-34 · M05: encab., RF-FAC-008, RF-FAC-019 … · M06: RF-FIS-117 · M07: RF-COB-172 · (+4 anexos) | Cubierta |
| › › AGR-016 — Ejecución fiable de acciones entre componentes (§102.4) (L5460) | M01, M02, M03, M04, M05, M06, M07 (+16) | M01: RF-PER-136 · M02: RN-CAT-070 · M03: RF-MED-020, RF-MED-047, RN-MED-105 … · M04: RF-TAR-060 · (+19 anexos) | Cubierta |
| › › AGR-017 — Calendarios, prorrateos y cambios dentro del período (§102.4) (L5472) | M02, M03, M04, M05, M06, T01, T04b-p1 (+6) | M02: encab., RF-CAT-045, RN-CAT-013 … · M03: encab., RF-MED-028, RN-MED-038 … · M04: encab., §2.3, RF-TAR-010 … · M05: encab., RF-FAC-001, RF-FAC-006 … · (+9 anexos) | Cubierta |
| › › AGR-018 — Migración y cambio operativo desde el sistema anterior (§102.4) (L5484) | M05, M06, M13, T04, T06, T07, T08 | M05: encab., §19, §22: Adoptado · M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M13: RF-STK-136 · T04: RF-CFG-132 · (+3 anexos) | Cubierta |
| › › AGR-019 — Recuperación y restauración por tenant (§102.4) (L5496) | M06, T01, T06, T07, T08, T10, T11 | M06: §9.18, §22: Descartado en M06: dueños M07, M05 … · T01: encab., §1, §3 … · T06: encab., RF-INT-030, CTR-INT-08 · T07: encab., §2.2, RF-MIG-089 … · (+3 anexos) | Cubierta |
| › › AGR-020 — Capacidad, rendimiento y aislamiento de carga (§102.4) (L5508) | M06, T01, T06, T08, T11 | M06: §12.3, §22: §12.3 · T01: encab., §1, RF-PLA-035 … · T06: encab., RF-INT-013, RF-INT-033 … · T08: encab., §1, RF-NFR-025 … · (+1 anexos) | Cubierta |
| › › AGR-021 — Operación de APIs y conectores, además de su desarrollo (§102.4) (L5520) | M03, M06, M07, M08, T06, T08, T10 (+1) | M03: RF-MED-109, RF-MED-112 · M06: encab., RF-FIS-031, RN-FIS-013 … · M07: encab., RF-COB-149, RN-COB-136 … · M08: REP-MOR-28 · (+4 anexos) | Cubierta |
| › › AGR-022 — Contrato semántico para dashboards y BI (§102.4) (L5532) | M01, M02, M03, M04, M06, M07, M08 (+16) | M01: §15 · M02: §15, RN-CAT-066 · M03: RF-MED-124, §15 · M04: §15, §22: Sección 15 · (+19 anexos) | Cubierta |
| › › AGR-023 — Expediente documental y conservación de evidencia (§102.4) (L5544) | M03, M06, M09, M10, M13, M15, T08 (+3) | M03: RF-MED-006 · M06: encab., RF-FIS-064, RF-FIS-159 · M09: encab., RF-CRM-006, RNF-CRM-005 … · M10: encab., §2.3, RF-TEC-013 … · (+6 anexos) | Cubierta |
| › › AGR-024 — Comunicaciones, entrega y constancias (§102.4) (L5556) | M08, M09, M10, M19, T06, T08, T09 (+1) | M08: encab., §1, §2.2 … · M09: encab., RF-CRM-105, RF-CRM-187 … · M10: §2.3, RF-TEC-077, EVT-TEC-13 · M19: encab., RF-POR-123, RN-POR-015 … · (+4 anexos) | Cubierta |
| › › AGR-025 — Visitas y operación sin conexión con conflictos (§102.4) (L5568) | M03, M10, M13, T08, T11 | M03: encab., RF-MED-048, RN-MED-046 … · M10: encab., §1, RF-TEC-074 … · M13: encab., §1, RF-STK-055 … · T08: encab., RNF-NFR-017, PRM-NFR-051 … · (+1 anexos) | Cubierta |
| › › AGR-026 — Valorización, activos y reparación de equipos (§102.4) (L5580) | M10, M11, M12, M13, M15 | M10: encab., §2.3, RN-TEC-060 … · M11: encab. · M12: encab., RF-CMP-061, RF-CMP-077 … · M13: encab., §1, RF-STK-017 … · (+1 anexos) | Cubierta |
| › › AGR-027 — Control de compra, recepción y factura de proveedor (§102.4) (L5592) | M12, M13 | M12: encab., §1, RF-CMP-062 … · M13: encab., RF-STK-087, RN-STK-044 … | Cubierta |
| › › AGR-028 — Presupuestos y compromisos de fondos (§102.4) (L5604) | M12, M14, M15, M16, T10 | M12: encab., RF-CMP-056, RF-CMP-057 … · M14: encab., §1, §2.1 … · M15: encab., §1, §3 … · M16: encab., §2.3, RF-SUE-137 … · (+1 anexos) | Cubierta |
| › › AGR-029 — Capital y relación institucional del asociado (§102.4) (L5616) | M01, M09, M15, M17 | M01: encab., RF-PER-044, RN-PER-004 … · M09: RF-CRM-074, RF-CRM-083, RN-CRM-010 · M15: encab., §1, RF-CON-075 … · M17: encab., §1, §2.2 … | Cubierta |
| › › AGR-030 — Gobierno de la IA y verificación de sus resultados (§102.4) (L5628) | M09, M15, M18, T01, T02, T08, T09 | M09: encab., §1, RF-CRM-175 … · M15: RF-CON-158, RN-CON-116, PRM-CON-045 · M18: encab., §1, RF-SOC-036 … · T01: RF-PLA-029 · (+3 anexos) | Cubierta |
| › › AGR-031 — Moderación y ciclo de vida de la comunidad (§102.4) (L5640) | M19, T08, T09, T11 | M19: encab., RF-POR-125, RN-POR-051 … · T08: RNF-NFR-080, PRM-NFR-050 · T09: encab., §2.1, RF-COM-024 … · T11: encab., RF-WFL-006 | Cubierta |
| › › AGR-032 — Accesibilidad y autogestión tolerante a errores (§102.4) (L5652) | M01, M17, M19, T01, T03, T08, T09 | M01: RF-PER-085, RF-PER-161 · M17: RF-INS-081 · M19: encab., §1, RF-POR-006 … · T01: RF-PLA-058 · (+3 anexos) | Cubierta |
| › › AGR-033 — Ciclo de privacidad, conservación y salida de datos (§102.4) (L5664) | M01, M16, M17, M18, T01, T02, T06 (+3) | M01: encab., RF-PER-150, RF-PER-163 … · M16: encab., §4, RF-SUE-020 … · M17: encab., RF-INS-022, RF-INS-103 · M18: encab., RF-SOC-037, RF-SOC-058 … · (+6 anexos) | Cubierta |
| › › AGR-034 — Soporte con acceso temporal y responsabilidad (§102.4) (L5676) | M01, M15, M16, M17, M18, T01, T02 (+5) | M01: §4 · M15: §4 · M16: §4 · M17: §4, RF-INS-104 · (+8 anexos) | Cubierta |
| › › AGR-035 — Entornos, pruebas y evidencias antes de cada entrega (§102.4) (L5688) | M16, T01, T03, T06, T08 | M16: encab., ESC-SUE-28, §18 … · T01: encab., §1, RF-PLA-034 … · T03: SM-ADM-254, SM-PLT-014, SM-PLT-010 · T06: encab., RF-INT-021, RF-INT-029 … · (+1 anexos) | Cubierta |
| › › AGR-036 — Plan de entrega y aceptación de la cooperativa piloto (§102.4) (L5700) | T01 | T01: encab., RF-PLA-034, RF-PLA-054 … | Cubierta |
| › §102.5 Decisiones de diseño que recomiendo adoptar como hipótesis iniciales (L5712) | T01, T08 | T01: CTR-PLA-05 · T08: RNF-NFR-243 | Cubierta |
| › › §102.5.1 Diseñar módulos con responsabilidades claras antes de distribuirlos (L5716) | M15, T01, T08, T11 | M15: §2.1, RF-CON-052 · T01: RF-PLA-004, RF-PLA-161, RN-PLA-046 … · T08: RNF-NFR-240 · T11: encab. | Cubierta |
| › › §102.5.2 Identidad de acceso y relación de negocio separadas (L5722) | T01, T03, T11 | T01: RN-PLA-048, §7.2, ARQ-PLA-09 · T03: RF-UXD-042, RF-UXD-115, §10.2.1 · T11: encab. | Cubierta |
| › › §102.5.3 Un auxiliar comercial trazable y resúmenes derivados (L5726) | M15, T01, T11 | M15: encab., RF-CON-052 · T01: §7.2, ARQ-PLA-06 · T11: encab., RF-WFL-016 | Cubierta |
| › › §102.5.4 Configuración por versiones publicadas, no campos sueltos (L5732) | T01, T08, T11 | T01: RF-PLA-115, §7.2, ARQ-PLA-08 · T08: RNF-NFR-256, RNF-NFR-240 · T11: encab. | Cubierta |
| › › §102.5.5 Automatización con estados observables (L5736) | T01, T03, T08, T11 | T01: RF-PLA-009, RF-PLA-140, RF-PLA-141 … · T03: RF-UXD-110, §10.2.2 · T08: RNF-NFR-240 · T11: encab., §1, §3 … | Cubierta |
| › › §102.5.6 Autogestión con una tarea principal clara por pantalla (L5740) | T01, T03, T11 | T01: ARQ-PLA-10 · T03: encab., §1, RF-UXD-072 … · T11: encab. | Cubierta |
| › §102.6 Cinco escenarios que conviene usar para verificar el diseño (L5746) | M14, M17, M18, T02, T08 | M14: encab. · M17: ESC-INS-22 · M18: ESC-SOC-23 · T02: §17.6 · (+1 anexos) | Cubierta |
| › › ESC-01 — Pago excedente de un hermano (§102.6) (L5748) | M01, M02, M03, M06, M07, M08, M09 (+19) | M01: encab., §3, RF-PER-107 … · M02: §17.1, §18, RF-CAT-036 … · M03: §17, §22: §17 (escenarios transversales) · M06: §17.5, CU-FIS-17, §22: Descartado en M06: dueños M07 … · (+22 anexos) | Cubierta |
| › › ESC-02 — Corrección recibida después de emitir (§102.6) (L5752) | M02, M03, M04, M05, M06, M08, M09 (+18) | M02: §17.1, RF-CAT-104, RN-CAT-068 … · M03: §17, §22: §17 (escenarios transversales) · M04: encab., §2.1, RF-TAR-096 … · M05: encab., RF-FAC-104, RN-FAC-094 … · (+21 anexos) | Cubierta |
| › › ESC-03 — Instalación offline en conflicto (§102.6) (L5756) | M02, M03, M06, M08, M09, M10, M11 (+17) | M02: §17.1, §18, §21 … · M03: §17, §22: §17 (escenarios transversales) · M06: §17.5, §22: Descartado: no aplica a M06 (instalac... · M08: §17.5, §22: §17.5 · (+20 anexos) | Cubierta |
| › › ESC-04 — Recuperación con operaciones externas posteriores a la copia (§102.6) (L5760) | M02, M03, M05, M06, M07, M08, M09 (+19) | M02: §17.1, §18, RF-CAT-030 … · M03: §17, §22: §17 (escenarios transversales) · M05: encab., RF-FAC-059, RN-FAC-080 … · M06: §8.1, §9.18, §12.2 … · (+22 anexos) | Cubierta |
| › › ESC-05 — Cambio de condiciones en un período parcialmente procesado (§102.6) (L5764) | M02, M03, M04, M05, M06, M08, M09 (+16) | M02: §17.1, §18 · M03: §17, §22: §17 (escenarios transversales) · M04: encab., §2.1, RF-TAR-009 … · M05: encab., RF-FAC-019, RF-FAC-045 … · (+19 anexos) | Cubierta |
| › §102.7 Orden recomendado de trabajo (L5770) | T01, T07 | T01: RF-PLA-034, RF-PLA-054, RF-PLA-162 · T07: encab., RF-MIG-076, RF-MIG-087 … | Cubierta |
| › §102.8 Agenda de relevamiento para cerrar los faltantes (L5784) | M14, M17 | M14: encab., RF-TES-127, §21 · M17: encab., §22: §4 | Cubierta |
| › §102.9 Cómo incorporar estas propuestas sin perder control del alcance (L5798) | M02, M03, M13, M16, T01, T07, T11 | M02: encab. · M03: encab. · M13: encab. · M16: encab. · (+3 anexos) | Débil (solo encabezado) |
| › › Plantilla de decisión (§102.9) (L5807) | — | — | Descartada (metadato de la fuente, sin requisito) |
| › §102.10 Referencias y límites de este análisis (L5821) | T01 | T01: RF-PLA-015, RF-PLA-024, RF-PLA-033 … | Cubierta |
| › §102.11 Control de la revisión (L5833) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §103 Factura multiservicio y grupos de facturación — decisión de la versión 0.17 (L5847) | M01, M04, M05, M07, M11, M15, M19 (+4) | M01: RN-PER-057, RF-PER-069 · M04: §9.2, CTR-TAR-13 · M05: encab., §1, RF-FAC-051 … · M07: encab., RF-COB-001, RF-COB-019 … · (+7 anexos) | Cubierta |
| › §103.1 Decisión del solicitante y evidencia (L5849) | M05 | M05: RF-FAC-076, RN-FAC-136 | Cubierta |
| › §103.2 Objetivo (L5866) | M01, M04, M05, M07, M11, M15, M19 (+4) | hereda de §103 | Cubierta (por sección) |
| › §103.3 Límite (L5870) | M01, M05, M06, T07 | M01: §2.3, RN-PER-042 · M05: RF-FAC-067, RF-FAC-068, RN-FAC-133 … · M06: encab., RF-FIS-073, RN-FIS-122 · T07: §9.5 | Cubierta |
| › §103.4 Requisitos (L5877) | M01, M05, M07, M15, M19, T05, T07 | M01: encab., §2.2, RN-PER-057 … · M05: encab., §2.2, RF-FAC-051 … · M07: encab., §1, §3 … · M15: PA-CON-03, PA-CON-06 · (+3 anexos) | Cubierta |
| › §103.5 Caso de uso — CU-103 (L5890) | M05, M07 | M05: encab., RF-FAC-071, §16 … · M07: encab., RF-COB-019, RN-COB-023 … | Cubierta |
| › §103.6 Relación con el cupón de pago único (L5902) | M05, M07 | M05: RF-FAC-151 · M07: RF-COB-039, RF-COB-154 | Cubierta |
| §104 Personal y liquidación de sueldos — incorporación al alcance (L5906) | M06, M14, M15, M16, M19, T06, T10 | M06: encab., RF-FIS-111, §21 · M14: encab., RF-TES-160, RF-TES-163 … · M15: encab., RF-CON-073, RF-CON-099 … · M16: encab., CTR-SUE-01, CTR-SUE-02 · (+3 anexos) | Cubierta |
| › §104.1 Decisión y referencia de mercado (L5908) | M16 | M16: RF-SUE-140, RF-SUE-144 | Cubierta |
| › §104.2 Objetivo (L5917) | M16 | M16: §1 | Cubierta |
| › §104.3 Límite (L5921) | M16, M17, M18 | M16: §2.1, §2.2, §4 … · M17: encab., §1, §2.2 … · M18: encab., RF-SOC-136 | Cubierta |
| › §104.4 Alcance funcional (L5929) | M06, M14, M15, M16, M18, T10 | M06: encab., §2.2, RF-FIS-111 … · M14: encab., §4, RF-TES-117 … · M15: encab., RF-CON-073, RF-CON-149 … · M16: encab., §4, §5.1 … · (+2 anexos) | Cubierta |
| › §104.5 Caso de uso — CU-104 (L5948) | M15, M16 | M15: RF-CON-073, M-96, §16 … · M16: encab., RF-SUE-016, RF-SUE-049 … | Cubierta |
| › §104.6 Prioridad (L5959) | M16 | M16: RF-SUE-001, RF-SUE-145, CTR-SUE-19 … | Cubierta |
| §105 Mapa de soluciones a diseñar y especificar (L5963) | M01, M02, M03, M04, M05, M06, M07 (+26) | M01: encab. · M02: encab. · M03: encab. · M04: encab. · (+29 anexos) | Cubierta |
| §106 Pendientes de la versión 0.17 (L5982) | M01, M02, M03, M04, M05, M06, M07 (+13) | M01: PA-PER-05, PA-PER-14, RF-PER-029 · M02: encab., §22: M05 FAC (CAT provee billingGroupDefau... · M03: encab., RN-MED-124 · M04: encab. · (+16 anexos) | Cubierta |
| §107 Anexo A — Mensajes originales del solicitante en este hilo (L5996) | M15, T10 | M15: encab., PA-CON-03 · T10: REP-SUE-001, RF-BIA-070 | Cubierta |
| › Finalidad y criterio de transcripción (§107) (L5998) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › Índice de mensajes (§107) (L6006) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-001 — Consulta inicial sobre ProCoop (§107) (L6031) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-002 — Investigación funcional exhaustiva como referencia (§107) (L6037) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-003 — Creación del documento Markdown (§107) (L6043) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-004 — Objetivo, límite, alcance, casos de uso y ejemplos (§107) (L6049) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-005 — Multitenancy, cooperativas, usuarios y roles (§107) (L6055) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-006 — Marca, aplicaciones y landing por cooperativa (§107) (L6061) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-007 — Facturación separada y agrupación de cuenta corriente (§107) (L6067) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-008 — Reiteración de marca, aplicaciones y landing (§107) (L6073) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-009 — Roles, perfiles, noticias, CRM y solicitudes de servicios (§107) (L6079) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-010 — Self service, tarifas, ciclo de servicio, auditoría y ERP (§107) (L6085) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-011 — Arquitectura, APIs, seguridad y organismos gubernamentales (§107) (L6091) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-012 — Diagnóstico competitivo y objetivo SaaS (§107) (L6097) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-013 — Diccionario de términos y etiquetas de interfaz (§107) (L6103) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-014 — Catálogo por tenant, registro, mora y facturación batch (§107) (L6109) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-015 — Productos, conceptos e instalación integral (§107) (L6115) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-016 — Centros de costos y circuito contable del ERP (§107) (L6121) | M15 | M15: encab., PA-CON-03 | Cubierta |
| › P-017 — Calles, geolocalización, compras, stock y tesorería (§107) (L6127) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-018 — Copia de configuración y referencia de Connectyx (§107) (L6133) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-019 — Titularidad e investigación de particularidades por servicio (§107) (L6139) | M15, T10 | hereda de §107 | Cubierta (por sección) |
| › P-020 — Solicitud del presente anexo (§107) (L6145) | M15, T10 | hereda de §107 | Cubierta (por sección) |

## 8. Matriz COMPLEMENTO (AGR)

Fuente: `docs/base-funcional/PROCOOP_COMPLEMENTO_ANALISIS_FUNCIONAL_Y_DISENO.md`. Cada sección equivale a BASE §102.n.

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Complemento de análisis funcional y diseño del sistema de cooperativas (L1) | T01, M14, M17, T07, M18, T02, T08 (+27) | ver subsecciones | Cubierta (por subsecciones) |
| §1 Propósito y criterio de revisión (L8) | — | — | **SIN COBERTURA** |
| §2 Diagnóstico principal (L28) | — | — | **SIN COBERTURA** |
| › §2.1 Qué ya está y no hace falta volver a inventar (L36) | — | — | **SIN COBERTURA** |
| §3 Matriz de propuestas y trazabilidad (L49) | — | — | **SIN COBERTURA** |
| §4 Fichas de ampliación recomendadas (L92) | T01, M16, T03, T06, T08, M01, M15 (+26) | ver subsecciones | Cubierta (por subsecciones) |
| › AGR-001 — Consolidar requisitos y decisiones en un catálogo único (§4) (L96) | T01, T10 | T01: encab., RF-PLA-163 · T10: RF-BIA-016, RN-BIA-005, KPI-CMP-05 … | Cubierta |
| › AGR-002 — Responsable de cada dato y límite entre ERP, CRM y operación (§4) (L108) | M01, M02, M09, M15, M16, T01, T11 | M01: encab., RF-PER-124, RF-PER-172 … · M02: encab., §2.1, §2.3 … · M09: encab., §1, §2.2 … · M15: encab., §2.1, RF-CON-052 · (+3 anexos) | Cubierta |
| › AGR-003 — Modelos de estados y reversión por proceso (§4) (L120) | M01, M02, M04, M08, M09, M10, M11 (+9) | M01: encab., RF-PER-010, RF-PER-011 … · M02: encab., RF-CAT-061, RF-CAT-091 … · M04: RF-TAR-011, §8, CTR-TAR-07 … · M08: encab., RF-MOR-117, §8 … · (+12 anexos) | Cubierta |
| › AGR-004 — Ciclo de vida completo de la cooperativa y preparación para producción (§4) (L132) | T01, T02, T10 | T01: encab., §1, §2.2 … · T02: §4.4 · T10: RF-BIA-086 | Cubierta |
| › AGR-005 — Contrato comercial SaaS y habilitación de capacidades (§4) (L144) | M02, T01 | M02: encab., §2.3, RF-CAT-002 … · T01: encab., §1, RF-PLA-051 … | Cubierta |
| › AGR-006 — Identidad de acceso, pertenencia y selección de cooperativa (§4) (L156) | M01, M16, M19, T01, T02 | M01: encab., RF-PER-002, RF-PER-157 … · M16: encab., §2.2, RF-SUE-021 … · M19: encab., §1, RF-POR-027 … · T01: RN-PLA-003 · (+1 anexos) | Cubierta |
| › AGR-007 — Representaciones, titulares, beneficiarios y cambios de responsabilidad (§4) (L168) | M01, M02, M17, M18, M19, T02 | M01: encab., §2.1, RF-PER-099 … · M02: §4, §7.18, CTR-CAT-03 … · M17: encab., RF-INS-008, RF-INS-083 … · M18: encab., RF-SOC-054, RF-SOC-020 · (+2 anexos) | Cubierta |
| › AGR-008 — Regla exacta de combinación entre roles y perfiles (§4) (L180) | M01, M02, M16, M17, M18, T02, T12-p2 | M01: §4, RF-PER-102 · M02: §4, RF-CAT-035, RF-CAT-031 · M16: §4, RN-SUE-066 · M17: §4, RF-INS-069, ESC-INS-14 … · (+3 anexos) | Cubierta |
| › AGR-009 — Publicación segura de configuración y paquetes de servicio (§4) (L192) | M02, M04, M05, M15, M16, T01, T02 (+3) | M02: encab., §2.1, §3 … · M04: encab., RF-TAR-002, RF-TAR-007 … · M05: encab., RF-FAC-045, §22: Adoptado · M15: encab., RF-CON-006, RN-CON-109 … · (+6 anexos) | Cubierta |
| › AGR-010 — Historia con fecha efectiva y fecha de registro (§4) (L204) | M01, M02, M03, M04, M05, M06, M07 (+15) | M01: encab., RF-PER-028, RF-PER-151 … · M02: encab., RF-CAT-034, RF-CAT-057 … · M03: encab., RF-MED-070, RN-MED-014 … · M04: encab., §1, RF-TAR-008 … · (+18 anexos) | Cubierta |
| › AGR-011 — Invariantes monetarias y única fuente del saldo (§4) (L216) | M02, M03, M04, M05, M06, M07, M08 (+10) | M02: §7.6 · M03: RN-MED-068 · M04: encab., §2.3, RF-TAR-058 … · M05: encab., §2.2, RF-FAC-070 … · (+13 anexos) | Cubierta |
| › AGR-012 — Pagos excedentes, anticipos y cobros sin identificar (§4) (L228) | M06, M07, M08, M14, M15, M19, T07 | M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: encab., §1, RF-COB-038 … · M08: RF-MOR-115, RF-MOR-168, RF-MOR-036 · M14: encab., §1, RF-TES-040 … · (+3 anexos) | Cubierta |
| › AGR-013 — Devoluciones y reversos con sus dos efectos (§4) (L240) | M03, M05, M06, M07, M08, M14 | M03: RN-MED-111 · M05: encab., RF-FAC-104, RF-FAC-106 … · M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: encab., §1, RF-COB-157 … · (+2 anexos) | Cubierta |
| › AGR-014 — Vida completa de convenios y financiación (§4) (L252) | M06, M07, M08, M11, M15 | M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M07: RN-COB-011 · M08: encab., §1, §2.3 … · M11: encab., RF-VEN-091 · (+1 anexos) | Cubierta |
| › AGR-015 — Cierre y aprobación de cada ciclo de facturación (§4) (L264) | M03, M05, M06, M07, M15, T06, T08 (+1) | M03: RF-MED-038, ESC-MED-34 · M05: encab., RF-FAC-008, RF-FAC-019 … · M06: RF-FIS-117 · M07: RF-COB-172 · (+4 anexos) | Cubierta |
| › AGR-016 — Ejecución fiable de acciones entre componentes (§4) (L276) | M01, M02, M03, M04, M05, M06, M07 (+16) | M01: RF-PER-136 · M02: RN-CAT-070 · M03: RF-MED-020, RF-MED-047, RN-MED-105 … · M04: RF-TAR-060 · (+19 anexos) | Cubierta |
| › AGR-017 — Calendarios, prorrateos y cambios dentro del período (§4) (L288) | M02, M03, M04, M05, M06, T01, T04b-p1 (+6) | M02: encab., RF-CAT-045, RN-CAT-013 … · M03: encab., RF-MED-028, RN-MED-038 … · M04: encab., §2.3, RF-TAR-010 … · M05: encab., RF-FAC-001, RF-FAC-006 … · (+9 anexos) | Cubierta |
| › AGR-018 — Migración y cambio operativo desde el sistema anterior (§4) (L300) | M05, M06, M13, T04, T06, T07, T08 | M05: encab., §19, §22: Adoptado · M06: §22: Descartado en M06: dueños M07, M05, T07 y T08; M06 solo los co... · M13: RF-STK-136 · T04: RF-CFG-132 · (+3 anexos) | Cubierta |
| › AGR-019 — Recuperación y restauración por tenant (§4) (L312) | M06, T01, T06, T07, T08, T10, T11 | M06: §9.18, §22: Descartado en M06: dueños M07, M05 … · T01: encab., §1, §3 … · T06: encab., RF-INT-030, CTR-INT-08 · T07: encab., §2.2, RF-MIG-089 … · (+3 anexos) | Cubierta |
| › AGR-020 — Capacidad, rendimiento y aislamiento de carga (§4) (L324) | M06, T01, T06, T08, T11 | M06: §12.3, §22: §12.3 · T01: encab., §1, RF-PLA-035 … · T06: encab., RF-INT-013, RF-INT-033 … · T08: encab., §1, RF-NFR-025 … · (+1 anexos) | Cubierta |
| › AGR-021 — Operación de APIs y conectores, además de su desarrollo (§4) (L336) | M03, M06, M07, M08, T06, T08, T10 (+1) | M03: RF-MED-109, RF-MED-112 · M06: encab., RF-FIS-031, RN-FIS-013 … · M07: encab., RF-COB-149, RN-COB-136 … · M08: REP-MOR-28 · (+4 anexos) | Cubierta |
| › AGR-022 — Contrato semántico para dashboards y BI (§4) (L348) | M01, M02, M03, M04, M06, M07, M08 (+16) | M01: §15 · M02: §15, RN-CAT-066 · M03: RF-MED-124, §15 · M04: §15, §22: Sección 15 · (+19 anexos) | Cubierta |
| › AGR-023 — Expediente documental y conservación de evidencia (§4) (L360) | M03, M06, M09, M10, M13, M15, T08 (+3) | M03: RF-MED-006 · M06: encab., RF-FIS-064, RF-FIS-159 · M09: encab., RF-CRM-006, RNF-CRM-005 … · M10: encab., §2.3, RF-TEC-013 … · (+6 anexos) | Cubierta |
| › AGR-024 — Comunicaciones, entrega y constancias (§4) (L372) | M08, M09, M10, M19, T06, T08, T09 (+1) | M08: encab., §1, §2.2 … · M09: encab., RF-CRM-105, RF-CRM-187 … · M10: §2.3, RF-TEC-077, EVT-TEC-13 · M19: encab., RF-POR-123, RN-POR-015 … · (+4 anexos) | Cubierta |
| › AGR-025 — Visitas y operación sin conexión con conflictos (§4) (L384) | M03, M10, M13, T08, T11 | M03: encab., RF-MED-048, RN-MED-046 … · M10: encab., §1, RF-TEC-074 … · M13: encab., §1, RF-STK-055 … · T08: encab., RNF-NFR-017, PRM-NFR-051 … · (+1 anexos) | Cubierta |
| › AGR-026 — Valorización, activos y reparación de equipos (§4) (L396) | M10, M11, M12, M13, M15 | M10: encab., §2.3, RN-TEC-060 … · M11: encab. · M12: encab., RF-CMP-061, RF-CMP-077 … · M13: encab., §1, RF-STK-017 … · (+1 anexos) | Cubierta |
| › AGR-027 — Control de compra, recepción y factura de proveedor (§4) (L408) | M12, M13 | M12: encab., §1, RF-CMP-062 … · M13: encab., RF-STK-087, RN-STK-044 … | Cubierta |
| › AGR-028 — Presupuestos y compromisos de fondos (§4) (L420) | M12, M14, M15, M16, T10 | M12: encab., RF-CMP-056, RF-CMP-057 … · M14: encab., §1, §2.1 … · M15: encab., §1, §3 … · M16: encab., §2.3, RF-SUE-137 … · (+1 anexos) | Cubierta |
| › AGR-029 — Capital y relación institucional del asociado (§4) (L432) | M01, M09, M15, M17 | M01: encab., RF-PER-044, RN-PER-004 … · M09: RF-CRM-074, RF-CRM-083, RN-CRM-010 · M15: encab., §1, RF-CON-075 … · M17: encab., §1, §2.2 … | Cubierta |
| › AGR-030 — Gobierno de la IA y verificación de sus resultados (§4) (L444) | M09, M15, M18, T01, T02, T08, T09 | M09: encab., §1, RF-CRM-175 … · M15: RF-CON-158, RN-CON-116, PRM-CON-045 · M18: encab., §1, RF-SOC-036 … · T01: RF-PLA-029 · (+3 anexos) | Cubierta |
| › AGR-031 — Moderación y ciclo de vida de la comunidad (§4) (L456) | M19, T08, T09, T11 | M19: encab., RF-POR-125, RN-POR-051 … · T08: RNF-NFR-080, PRM-NFR-050 · T09: encab., §2.1, RF-COM-024 … · T11: encab., RF-WFL-006 | Cubierta |
| › AGR-032 — Accesibilidad y autogestión tolerante a errores (§4) (L468) | M01, M17, M19, T01, T03, T08, T09 | M01: RF-PER-085, RF-PER-161 · M17: RF-INS-081 · M19: encab., §1, RF-POR-006 … · T01: RF-PLA-058 · (+3 anexos) | Cubierta |
| › AGR-033 — Ciclo de privacidad, conservación y salida de datos (§4) (L480) | M01, M16, M17, M18, T01, T02, T06 (+3) | M01: encab., RF-PER-150, RF-PER-163 … · M16: encab., §4, RF-SUE-020 … · M17: encab., RF-INS-022, RF-INS-103 · M18: encab., RF-SOC-037, RF-SOC-058 … · (+6 anexos) | Cubierta |
| › AGR-034 — Soporte con acceso temporal y responsabilidad (§4) (L492) | M01, M15, M16, M17, M18, T01, T02 (+5) | M01: §4 · M15: §4 · M16: §4 · M17: §4, RF-INS-104 · (+8 anexos) | Cubierta |
| › AGR-035 — Entornos, pruebas y evidencias antes de cada entrega (§4) (L504) | M16, T01, T03, T06, T08 | M16: encab., ESC-SUE-28, §18 … · T01: encab., §1, RF-PLA-034 … · T03: SM-ADM-254, SM-PLT-014, SM-PLT-010 · T06: encab., RF-INT-021, RF-INT-029 … · (+1 anexos) | Cubierta |
| › AGR-036 — Plan de entrega y aceptación de la cooperativa piloto (§4) (L516) | T01 | T01: encab., RF-PLA-034, RF-PLA-054 … | Cubierta |
| §5 Decisiones de diseño que recomiendo adoptar como hipótesis iniciales (L528) | T01, T08 | T01: CTR-PLA-05 · T08: RNF-NFR-243 | Cubierta |
| › §5.1 Diseñar módulos con responsabilidades claras antes de distribuirlos (L532) | M15, T01, T08, T11 | M15: §2.1, RF-CON-052 · T01: RF-PLA-004, RF-PLA-161, RN-PLA-046 … · T08: RNF-NFR-240 · T11: encab. | Cubierta |
| › §5.2 Identidad de acceso y relación de negocio separadas (L538) | T01, T03, T11 | T01: RN-PLA-048, §7.2, ARQ-PLA-09 · T03: RF-UXD-042, RF-UXD-115, §10.2.1 · T11: encab. | Cubierta |
| › §5.3 Un auxiliar comercial trazable y resúmenes derivados (L542) | M15, T01, T11 | M15: encab., RF-CON-052 · T01: §7.2, ARQ-PLA-06 · T11: encab., RF-WFL-016 | Cubierta |
| › §5.4 Configuración por versiones publicadas, no campos sueltos (L548) | T01, T08, T11 | T01: RF-PLA-115, §7.2, ARQ-PLA-08 · T08: RNF-NFR-256, RNF-NFR-240 · T11: encab. | Cubierta |
| › §5.5 Automatización con estados observables (L552) | T01, T03, T08, T11 | T01: RF-PLA-009, RF-PLA-140, RF-PLA-141 … · T03: RF-UXD-110, §10.2.2 · T08: RNF-NFR-240 · T11: encab., §1, §3 … | Cubierta |
| › §5.6 Autogestión con una tarea principal clara por pantalla (L556) | T01, T03, T11 | T01: ARQ-PLA-10 · T03: encab., §1, RF-UXD-072 … · T11: encab. | Cubierta |
| §6 Cinco escenarios que conviene usar para verificar el diseño (L562) | M14, M17, M18, T02, T08 | M14: encab. · M17: ESC-INS-22 · M18: ESC-SOC-23 · T02: §17.6 · (+1 anexos) | Cubierta |
| › ESC-01 — Pago excedente de un hermano (§6) (L564) | M01, M02, M03, M06, M07, M08, M09 (+19) | M01: encab., §3, RF-PER-107 … · M02: §17.1, §18, RF-CAT-036 … · M03: §17, §22: §17 (escenarios transversales) · M06: §17.5, CU-FIS-17, §22: Descartado en M06: dueños M07 … · (+22 anexos) | Cubierta |
| › ESC-02 — Corrección recibida después de emitir (§6) (L568) | M02, M03, M04, M05, M06, M08, M09 (+18) | M02: §17.1, RF-CAT-104, RN-CAT-068 … · M03: §17, §22: §17 (escenarios transversales) · M04: encab., §2.1, RF-TAR-096 … · M05: encab., RF-FAC-104, RN-FAC-094 … · (+21 anexos) | Cubierta |
| › ESC-03 — Instalación offline en conflicto (§6) (L572) | M02, M03, M06, M08, M09, M10, M11 (+17) | M02: §17.1, §18, §21 … · M03: §17, §22: §17 (escenarios transversales) · M06: §17.5, §22: Descartado: no aplica a M06 (instalac... · M08: §17.5, §22: §17.5 · (+20 anexos) | Cubierta |
| › ESC-04 — Recuperación con operaciones externas posteriores a la copia (§6) (L576) | M02, M03, M05, M06, M07, M08, M09 (+19) | M02: §17.1, §18, RF-CAT-030 … · M03: §17, §22: §17 (escenarios transversales) · M05: encab., RF-FAC-059, RN-FAC-080 … · M06: §8.1, §9.18, §12.2 … · (+22 anexos) | Cubierta |
| › ESC-05 — Cambio de condiciones en un período parcialmente procesado (§6) (L580) | M02, M03, M04, M05, M06, M08, M09 (+16) | M02: §17.1, §18 · M03: §17, §22: §17 (escenarios transversales) · M04: encab., §2.1, RF-TAR-009 … · M05: encab., RF-FAC-019, RF-FAC-045 … · (+19 anexos) | Cubierta |
| §7 Orden recomendado de trabajo (L586) | T01, T07 | T01: RF-PLA-034, RF-PLA-054, RF-PLA-162 · T07: encab., RF-MIG-076, RF-MIG-087 … | Cubierta |
| §8 Agenda de relevamiento para cerrar los faltantes (L600) | M14, M17 | M14: encab., RF-TES-127, §21 · M17: encab., §22: §4 | Cubierta |
| §9 Cómo incorporar estas propuestas sin perder control del alcance (L614) | — | — | **SIN COBERTURA** |
| › Plantilla de decisión (§9) (L623) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §10 Referencias y límites de este análisis (L637) | T01 | T01: RF-PLA-015, RF-PLA-024, RF-PLA-033 … | Cubierta |
| §11 Control de la revisión (L649) | — | — | Descartada (metadato de la fuente, sin requisito) |

## 9. Matriz Connectia (CNX)

Fuente: `referencia-connectia/connectia-referencia-para-goodapps.md` (formato técnico, UI/UX, roles, mapa del sitio y layout).

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Connectia como referencia para el ERP de cooperativas (CoopApps) (L1) | T01, T03, T08, M09, T02, T06, T09 (+14) | ver subsecciones | Cubierta (por subsecciones) |
| §1 Resumen ejecutivo (L18) | T01, T03 | T01: encab., CTR-PLA-04 · T03: encab., §22: 2, 7.A | Cubierta |
| §2 Stack y arquitectura (L34) | T01 | T01: encab., CTR-PLA-04 | Cubierta |
| › §2.1 Versiones (L36) | T01, T03, T06, T08 | T01: RF-PLA-002, RF-PLA-061, RF-PLA-132 … · T03: RF-UXD-009, RF-UXD-010, RN-UXD-057 … · T06: RF-INT-086, §12.15, RF-INT-033 · T08: encab., RNF-NFR-073, RNF-NFR-078 … | Cubierta |
| › §2.2 Estructura del repositorio (L59) | T01, T08, T11 | T01: RF-PLA-003, RF-PLA-006 · T08: RNF-NFR-141, RNF-NFR-143, RNF-NFR-241 … · T11: encab. | Cubierta |
| › §2.3 Multi-empresa (multi-tenant) (L83) | M09, T01, T02, T03, T04, T08, T10 (+1) | M09: encab., §22: §4; §10 · T01: RF-PLA-017, RF-PLA-018, RF-PLA-019 … · T02: encab., RF-IAM-020, CTR-IAM-01 · T03: encab., RF-UXD-036, §22: 10.1 · (+4 anexos) | Cubierta |
| › §2.4 Licenciamiento y permisos (tres capas) (L92) | M01, M02, M08, M09, M13, M14, M16 (+9) | M01: encab., §22: Sección 4 (alcance por rol) · M02: encab., RF-CAT-002 · M08: encab., RF-MOR-185 · M09: encab., §4, §22: §4; §10 · (+12 anexos) | Cubierta |
| › §2.5 Autenticación (L105) | M19, T01, T02, T03, T06, T08, T11 | M19: encab., RF-POR-025, RF-POR-032 … · T01: RF-PLA-133, §7.1, CTR-PLA-05 · T02: encab., RF-IAM-021, RF-IAM-022 … · T03: RF-UXD-113, RF-UXD-117, RF-UXD-118 … · (+3 anexos) | Cubierta |
| › §2.6 Patrones de backend (L114) | M09, M19, T01, T03, T04, T06, T08 (+2) | M09: encab., §22: §4; §10 · M19: RF-POR-081, RN-POR-061 · T01: RF-PLA-010, RF-PLA-012, RF-PLA-014 … · T03: RN-UXD-031, §10.3.2, §10.7.4 … · (+5 anexos) | Cubierta |
| › §2.7 Notificaciones (L124) | M09, M19, T01, T03, T06, T08, T09 (+2) | M09: encab., RF-CRM-187, §13 … · M19: encab., RF-POR-121, RF-POR-122 … · T01: RF-PLA-091, §7.1, CTR-PLA-05 · T03: encab., §13, §22: 13 … · (+5 anexos) | Cubierta |
| › §2.8 Despliegue (L136) | T01, T06, T08 | T01: RF-PLA-013, RNF-PLA-001, RNF-PLA-009 … · T06: §12.12, RF-INT-033 · T08: encab., RNF-NFR-027, RNF-NFR-067 … | Cubierta |
| §3 PWA móvil (usuario final) — UI/UX (L147) | M09, M13, M16, T03, T08, T11 | M09: §10 · M13: RF-STK-035, §10 · M16: encab. · T03: encab. · (+2 anexos) | Cubierta |
| › §3.1 Design system [COPIAR] (L151) | M08, M14, M19, T01, T03 | M08: encab. · M14: encab. · M19: encab., PRM-POR-099, RF-POR-144 … · T01: RF-PLA-058 · (+1 anexos) | Cubierta |
| › §3.2 Branding por empresa (multi-marca) [COPIAR] (L183) | M19, T01, T03, T08 | M19: encab., RF-POR-139, RF-POR-145 … · T01: encab., RF-PLA-057 · T03: §1, RF-UXD-023, RF-UXD-025 … · T08: RNF-NFR-186 | Cubierta |
| › §3.3 App shell y navegación [COPIAR] (L192) | M09, M19, T02, T03, T09 | M09: encab., PAN-CRM-01 · M19: encab., RF-POR-029, RF-POR-047 … · T02: encab., RF-IAM-039, §10 · T03: §3, RF-UXD-017, RF-UXD-063 … · (+1 anexos) | Cubierta |
| › §3.4 Componentes molde (portar primero) [COPIAR] (L213) | M19, T03, T09 | M19: encab., RF-POR-124, RF-POR-144 … · T03: RF-UXD-009, RF-UXD-029, RF-UXD-065 … · T09: encab., RF-COM-083 | Cubierta |
| › §3.5 Reglas de UX documentadas (`CONNECTIA-PWA-UI-SPEC.md`) [COPIAR] (L231) | M01, M19, T03, T08, T09 | M01: encab., PAN-PER-25 · M19: encab., RF-POR-142, RF-POR-144 · T03: §3, RF-UXD-088, RF-UXD-098 … · T08: RNF-NFR-248 · (+1 anexos) | Cubierta |
| › §3.6 Login UX [COPIAR] (L241) | M19, T02, T03 | M19: encab. · T02: encab., RF-IAM-003, RF-IAM-010 … · T03: RF-UXD-029, RF-UXD-036, RF-UXD-062 … | Cubierta |
| › §3.7 Offline (clave para el técnico de campo) [COPIAR] [MEJORAR] (L252) | M03, M09, M10, M13, M19, T01, T03 (+1) | M03: encab., RF-MED-043, RF-MED-047 … · M09: encab., PAN-CRM-01 · M10: encab., RF-TEC-114, RF-TEC-115 … · M13: encab., §1, RF-STK-060 … · (+4 anexos) | Cubierta |
| › §3.8 Inventario de pantallas PWA (referencia) (L262) | M10, M19, T02, T03, T09 | M10: encab., RF-TEC-084, RF-TEC-112 … · M19: encab., RF-POR-017, RF-POR-028 … · T02: encab., RF-IAM-039 · T03: §3, RF-UXD-063, RF-UXD-070 … · (+1 anexos) | Cubierta |
| §4 Panel de administración web (L280) | M09, M10, M13, M16, M19, T03, T08 | M09: §10 · M10: §10 · M13: encab., RF-STK-011, §10 · M16: encab., CTR-SUE-26 · (+3 anexos) | Cubierta |
| › §4.1 Design system del admin [COPIAR] (L284) | M08, M10, M14, T01, T03, T08 | M08: encab. · M10: §22: §10.1 · M14: encab., §10 · T01: RF-PLA-058 · (+2 anexos) | Cubierta |
| › §4.2 Layout y patrones [COPIAR] (L300) | M01, M02, M05, M09, M10, M19, T01 (+6) | M01: encab., RF-PER-168, PAN-PER-24 · M02: §22: 10 · M05: encab., RF-FAC-139, §22: Adoptado · M09: encab., §1, RF-CRM-036 … · (+9 anexos) | Cubierta |
| › §4.3 Dos niveles [COPIAR] (L311) | M02, M05, M10, T01, T02, T03, T10 (+1) | M02: PAN-CAT-02, §22: 10 · M05: §22: Adoptado · M10: §22: §10.1 · T01: encab., RF-PLA-037, RF-PLA-041 … · (+4 anexos) | Cubierta |
| › §4.4 Pantallas del admin (referencia) (L316) | M05, M09, M10, T03, T04, T09, T11 | M05: §22: Adoptado · M09: encab., RF-CRM-043, RF-CRM-071 … · M10: encab., RF-TEC-059, §22: §10.1 · T03: RF-UXD-046, RF-UXD-177, SM-ADM-246 … · (+3 anexos) | Cubierta |
| › §4.5 BI [COPIAR] (L331) | M05, M09, T01, T03, T06, T08, T10 | M05: §22: Adoptado · M09: encab., RF-CRM-052, PAN-CRM-34 … · T01: RF-PLA-029 · T03: §3, RF-UXD-010, RF-UXD-096 … · (+3 anexos) | Cubierta |
| › §4.6 Lo que el admin hace mal (hacerlo mejor) [MEJORAR] (L343) | M05, M09, T01, T03, T04, T06, T08 (+2) | M05: encab., RF-FAC-014, §22: Adoptado · M09: RF-CRM-045 · T01: encab., RF-PLA-014, §7.5 · T03: RF-UXD-047, RF-UXD-082, RF-UXD-083 … · (+5 anexos) | Cubierta |
| §5 MURO — [COPIAR] (prioridad alta) (L354) | T09 | T09: encab., CTR-COM-01 | Cubierta |
| › §5.1 Qué hace (L356) | T01, T03, T09 | T01: §7.1 · T03: RF-UXD-074, RF-UXD-176, §7.B.9 … · T09: RF-COM-004, RF-COM-006, RF-COM-009 … | Cubierta |
| › §5.2 Modelo de datos (L375) | T09 | T09: RF-COM-005, RF-COM-006, RF-COM-013 … | Cubierta |
| › §5.3 API (L426) | T09 | T09: RF-COM-023, RF-COM-026, RF-COM-045 … | Cubierta |
| › §5.4 Archivos a copiar (L434) | T03, T09 | T03: §10.2.4, §10.2.6 · T09: RF-COM-037 | Cubierta |
| › §5.5 Reacciones, comentarios y menciones (L440) | T09 | T09: RF-COM-030, RF-COM-034, RN-COM-003 … | Cubierta |
| › §5.6 Adaptación a la cooperativa (L445) | T03, T09 | T03: encab., §10.7.6, SM-PWS-001 … · T09: RF-COM-005, RF-COM-017, RF-COM-020 … | Cubierta |
| §6 NOVEDADES — [COPIAR] (prioridad alta) (L454) | M19, T09 | M19: RF-POR-126, RF-POR-125 · T09: encab., RF-COM-173, §22: §5.4 … | Cubierta |
| › §6.1 Boletín / revista (`Newsletter` + `NewsletterRule`) (L458) | T03, T09 | T03: SM-PWS-029, SM-PWE-012, PRM-UXD-019 … · T09: RF-COM-060, RF-COM-061, RF-COM-062 … | Cubierta |
| › §6.2 Centro de comunicaciones (`Communication*`) (L474) | M05, M09, T09 | M05: encab., RF-FAC-156, RF-FAC-158 … · M09: encab., RF-CRM-105 · T09: RF-COM-130, RF-COM-131, RF-COM-132 … | Cubierta |
| › §6.3 Avisos y push (`AppNotification` + `PushCampaign`) (L485) | M09, T03, T09 | M09: encab., RF-CRM-105 · T03: RF-UXD-084, RN-UXD-048, §10.2.1 … · T09: RF-COM-137, RF-COM-138, RF-COM-190 … | Cubierta |
| › §6.4 Archivos a copiar (L492) | T03, T09 | T03: §10.2.4, §10.2.6 · T09: RF-COM-133 | Cubierta |
| §7 ENCUESTAS — [COPIAR] (prioridad alta) (L500) | M19, T09 | M19: RF-POR-124 · T09: encab., RF-COM-088, PAN-COM-10 … | Cubierta |
| › §7.1 Qué hace (L504) | T03, T09 | T03: encab., SM-PWS-030, SM-PWE-010 … · T09: RF-COM-018, RF-COM-070, RF-COM-074 … | Cubierta |
| › §7.2 Tipos de pregunta (31, en `backend/src/lib/surveyQuestions.js`) (L527) | T03, T09 | T03: §10.2.3 · T09: RF-COM-071, RF-COM-072, RF-COM-073 | Cubierta |
| › §7.3 Modelo de datos (L547) | T09 | T09: RF-COM-072, RF-COM-094, RF-COM-117 … | Cubierta |
| › §7.4 API (L605) | T09 | T09: RN-COM-050 | Cubierta |
| › §7.5 Analítica e "inteligencia de encuestas" (L612) | T09, T10 | T09: RF-COM-057, RF-COM-090, PRM-COM-077 · T10: encab., RF-BIA-065, RF-BIA-068 … | Cubierta |
| › §7.6 Archivos a copiar (L618) | T03 | T03: §10.2.4, §10.2.6 | Cubierta |
| › §7.7 Usos en la cooperativa (L624) | M09, M10, T09 | M09: encab., RF-CRM-119, PRM-CRM-054 · M10: encab., RF-TEC-129, PAN-TEC-26 … · T09: RF-COM-081, RF-COM-084, RF-COM-089 … | Cubierta |
| › §7.8 Encuestas vs relevamientos (L633) | M03, M10, T03, T09 | M03: encab., RF-MED-032, RN-MED-054 … · M10: encab., RF-TEC-129, §7.14 … · T03: SM-PWC-006, SM-PWS-030, SM-PWE-011 · T09: RF-COM-092 | Cubierta |
| §8 Audiencia y segmentación — [ADAPTAR] [MEJORAR] (L639) | M09, T02, T03, T09 | M09: encab., §4, RF-CRM-108 … · T02: encab., RF-IAM-071 · T03: encab., RF-UXD-004, RF-UXD-086 … · T09: encab., §2.3, RF-COM-079 … | Cubierta |
| §9 Qué no llevar [NO LLEVAR] (L664) | T01, T06, T09 | T01: encab. · T06: RF-INT-033 · T09: encab., CTR-COM-06 | Cubierta |
| §10 Deudas de seguridad a no repetir [MEJORAR] (L673) | M09, T01, T02, T03, T06, T08, T09 (+2) | M09: encab., RNF-CRM-003 · T01: encab., §1.2, RF-PLA-008 … · T02: encab., RF-IAM-034, RF-IAM-133 … · T03: encab., RF-UXD-035, RF-UXD-093 … · (+5 anexos) | Cubierta |
| §11 Si se elige este camino: orden sugerido (L693) | T01, T03, T08 | T01: encab. · T03: encab., §22: 20 (contraposiciones con el prototipo) · T08: §22: Asignación a O0 (encabezado, §2.1) | Cubierta |
| §12 Documentos fuente en Connectia (L703) | — | — | Descartada (metadato de la fuente, sin requisito) |

## 10. Matriz DFA

Fuente: `procoop-relevamiento/definicion-funcional-alcance.md`. Las secciones §2 a §30 son los módulos 1 a 29 de ProCoop.

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Definición funcional del alcance — Nuevo sistema de gestión para cooperativas de servicios (L1) | T07, T08, T01, T04, M01, M10, T09 (+22) | ver subsecciones | Cubierta (por subsecciones) |
| §0 Cómo leer este documento (L7) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §1 Mapa general de módulos (L38) | M16, T03 | M16: encab. · T03: encab., RF-UXD-171, §22: 10.8.1 (clusters) | Cubierta |
| §2 Módulo 1 — Plataforma, seguridad y auditoría (A) (L74) | T01, T02, T03, T08, T11 | T01: RF-PLA-067, RF-PLA-117, RF-PLA-146 … · T02: encab., RF-IAM-009, RF-IAM-021 … · T03: encab., RF-UXD-060, RF-UXD-061 … · T08: encab., RN-NFR-010, RNF-NFR-098 … · (+1 anexos) | Cubierta |
| › Funciones (§2) (L78) | T01, T02, T03, T08, T11 | hereda de §2 | Cubierta (por sección) |
| › Mejoras propuestas (§2) (L116) | T02, T03, T08 | T02: RF-IAM-090, RF-IAM-130, CTR-IAM-01 … · T03: SM-PLT-013 · T08: CTR-NFR-11, CTR-NFR-12 | Cubierta |
| §3 Módulo 2 — Parámetros y tablas maestras (A) (L125) | M01, T04, T11 | M01: RF-PER-168 · T04: encab., RF-CFG-001, RF-CFG-026 … · T11: encab., RF-WFL-140 | Cubierta |
| › Geografía y ubicación [T] (§3) (L129) | M01, T04, T11 | hereda de §3 | Cubierta (por sección) |
| › Calendario [T] (§3) (L136) | M01, T04, T11 | hereda de §3 | Cubierta (por sección) |
| › Índices económicos [T] (§3) (L139) | M01, T04, T11 | hereda de §3 | Cubierta (por sección) |
| › Tablas fiscales [T] (§3) (L144) | M01, T04, T11 | hereda de §3 | Cubierta (por sección) |
| › Tablas genéricas [T] (§3) (L150) | M01, T04, T11 | hereda de §3 | Cubierta (por sección) |
| › Mejoras propuestas (§3) (L153) | T04 | T04: RF-CFG-001, RF-CFG-026, RF-CFG-045 … | Cubierta |
| §4 Módulo 3 — Personas, titulares y cuentas (A) (L160) | M01, T09, T11 | M01: encab., RF-PER-001, RF-PER-005 … · T09: encab., RF-COM-149, PAN-COM-30 · T11: encab., RF-WFL-070, RF-WFL-210 | Cubierta |
| › Jerarquía observada [P] (§4) (L164) | M01, T09, T11 | hereda de §4 | Cubierta (por sección) |
| › Funciones (§4) (L176) | M01, T09, T11 | hereda de §4 | Cubierta (por sección) |
| › Tablas núcleo [T] (§4) (L228) | M01, T09, T11 | hereda de §4 | Cubierta (por sección) |
| › Mejoras propuestas (§4) (L234) | M01 | M01: encab., RF-PER-019, RF-PER-020 … | Cubierta |
| §5 Módulo 4 — Catálogo de servicios, categorías y conexiones (A) (L243) | M02, T01, T03 | M02: encab., RF-CAT-010, RF-CAT-057 … · T01: RF-PLA-165 · T03: SM-ADM-017 | Cubierta |
| › Tipos de servicio (§5) (L247) | M02 | M02: RF-CAT-010, CTR-CAT-06 | Cubierta |
| › Funciones (§5) (L255) | M02 | M02: RF-CAT-010, CTR-CAT-06 | Cubierta |
| › Mejoras propuestas (§5) (L308) | M02, T01 | M02: RF-CAT-057, RF-CAT-109, RF-CAT-010 … · T01: RF-PLA-165 | Cubierta |
| §6 Módulo 5 — Medidores y equipos de medición (A) (L315) | M03, T03 | M03: encab., RF-MED-001, RF-MED-002 … · T03: SM-ADM-026 | Cubierta |
| › Funciones [P][T] (§6) (L317) | M03, T03 | hereda de §6 | Cubierta (por sección) |
| › Mejoras propuestas (§6) (L337) | M03 | M03: RF-MED-018 | Cubierta |
| §7 Módulo 6 — Lecturas, consumos y telemedición (A) (L343) | M03, M06 | M03: encab., RF-MED-012, RF-MED-023 … · M06: §22.7 | Cubierta |
| › Funciones (§7) (L345) | M03, M06 | hereda de §7 | Cubierta (por sección) |
| › Mejoras propuestas (§7) (L377) | M03 | M03: RF-MED-043, RF-MED-045, RF-MED-064 … | Cubierta |
| §8 Módulo 7 — Cuadros tarifarios y motor de cálculo (A) (L385) | M04, T11 | M04: encab., §3, RF-TAR-001 … · T11: encab., RF-WFL-111, §7.3 … | Cubierta |
| › Funciones (§8) (L389) | M04, T11 | hereda de §8 | Cubierta (por sección) |
| › Mejoras propuestas (§8) (L424) | M04, T11 | hereda de §8 | Cubierta (por sección) |
| §9 Módulo 8 — Facturación de servicios y comprobantes electrónicos (A) (L438) | M05, T09, T10, T11 | M05: encab., RF-FAC-006, RF-FAC-025 … · T09: RF-COM-195, §21 · T10: RF-BIA-099 · T11: encab., RF-WFL-191, RN-WFL-022 | Cubierta |
| › Funciones (§9) (L440) | M05 | M05: encab., CTR-FAC-08 | Cubierta |
| › Mejoras propuestas (§9) (L511) | M05, T10 | M05: encab., RF-FAC-025, RF-FAC-058 … · T10: RF-BIA-099 | Cubierta |
| §10 Módulo 9 — Cuenta corriente del titular (A) (L527) | M07, T03 | M07: encab., RF-COB-001, RF-COB-002 … · T03: SM-ADM-060 | Cubierta |
| › Funciones [P][T][I] (§10) (L529) | M07, T03 | hereda de §10 | Cubierta (por sección) |
| › Mejoras propuestas (§10) (L547) | M07 | M07: RF-COB-002, RF-COB-024, RF-COB-032 | Cubierta |
| §11 Módulo 10 — Cobranza: cajas, medios de pago y entes recaudadores (A) (L556) | M07 | M07: RF-COB-046, RF-COB-058, RF-COB-070 … | Cubierta |
| › Funciones (§11) (L558) | M07 | hereda de §11 | Cubierta (por sección) |
| › Mejoras propuestas (§11) (L604) | M07 | M07: RF-COB-046, RF-COB-058, RF-COB-085 … | Cubierta |
| §12 Módulo 11 — Gestión de mora y corte (A) (L615) | M08, T03, T09 | M08: encab., §3, RF-MOR-005 … · T03: SM-ADM-075 · T09: RF-COM-164 | Cubierta |
| › Funciones (§12) (L617) | M08, T03, T09 | hereda de §12 | Cubierta (por sección) |
| › Flujo inferido [I] (§12) (L644) | M08, T03, T09 | hereda de §12 | Cubierta (por sección) |
| › Mejoras propuestas (§12) (L658) | M08 | M08: RF-MOR-065, RF-MOR-089, RN-MOR-055 … | Cubierta |
| §13 Módulo 12 — Financiación y planes de pago (B) (L666) | M08, M11 | M08: encab., §3, RF-MOR-142 … · M11: encab., RF-VEN-082 | Cubierta |
| › Funciones [M][T] (§13) (L668) | M08, M11 | hereda de §13 | Cubierta (por sección) |
| › Mejoras propuestas (§13) (L680) | M08, M11 | M08: RF-MOR-142, RF-MOR-156, RF-MOR-209 · M11: encab., RF-VEN-082 | Cubierta |
| §14 Módulo 13 — Ventas, presupuestos y punto de venta (B) (L687) | M11 | M11: encab., §3, RF-VEN-001 … | Cubierta |
| › Funciones [M][T] (§14) (L689) | M11 | hereda de §14 | Cubierta (por sección) |
| › Mejoras propuestas (§14) (L708) | M11 | M11: RF-VEN-032, RF-VEN-036, RF-VEN-110 … | Cubierta |
| §15 Módulo 14 — Técnica: factibilidades, órdenes de trabajo y reclamos (B) (L713) | M09, M10, M11, T11 | M09: encab., §1, RF-CRM-016 … · M10: encab., RF-TEC-001, RF-TEC-011 … · M11: RF-VEN-112 · T11: §3, RF-WFL-196, §9.10 … | Cubierta |
| › Funciones (§15) (L715) | M09, M10, M11, T11 | hereda de §15 | Cubierta (por sección) |
| › Mejoras propuestas (§15) (L742) | M09, M10, M11 | M09: §1, RF-CRM-016, RF-CRM-103 … · M10: RF-TEC-011, RF-TEC-059, RF-TEC-116 … · M11: RF-VEN-112 | Cubierta |
| §16 Módulo 15 — Redes e infraestructura (GIS) (C) (L751) | M10, T03 | M10: §3, RF-TEC-144, RF-TEC-145 … · T03: SM-ADM-111 | Cubierta |
| › Funciones [T][P] (§16) (L753) | M10, T03 | hereda de §16 | Cubierta (por sección) |
| › Mejoras propuestas (§16) (L769) | M10 | M10: RF-TEC-144, RF-TEC-145, RF-TEC-146 … | Cubierta |
| §17 Módulo 16 — Compras y proveedores (B) (L775) | M12 | M12: encab., §3, RF-CMP-001 … | Cubierta |
| › Circuito [M][T] (§17) (L777) | M12 | hereda de §17 | Cubierta (por sección) |
| › Funciones (§17) (L789) | M12 | hereda de §17 | Cubierta (por sección) |
| › Mejoras propuestas (§17) (L808) | M12 | M12: RF-CMP-120, §13 | Cubierta |
| §18 Módulo 17 — Stock, bienes de uso, RMA y fabricación (B) (L816) | M13 | M13: encab., RF-STK-004, RF-STK-005 … | Cubierta |
| › Funciones [M][T] (§18) (L818) | M13 | hereda de §18 | Cubierta (por sección) |
| › Mejoras propuestas (§18) (L847) | M13 | M13: RF-STK-060, RF-STK-061, RF-STK-087 … | Cubierta |
| §19 Módulo 18 — Tesorería y bancos (B) (L854) | M14, M15 | M14: encab., RF-TES-001, RF-TES-033 … · M15: RF-CON-148 | Cubierta |
| › Funciones [M][T] (§19) (L856) | M14, M15 | hereda de §19 | Cubierta (por sección) |
| › Mejoras propuestas (§19) (L883) | M14 | M14: PAN-TES-19 | Cubierta |
| §20 Módulo 19 — Contabilidad (B) (L890) | M15 | M15: encab., §1, RF-CON-002 … | Cubierta |
| › Funciones [M][T] (§20) (L892) | M15 | hereda de §20 | Cubierta (por sección) |
| › Mejoras propuestas (§20) (L924) | M15 | M15: encab., RF-CON-002, RF-CON-053 … | Cubierta |
| §21 Módulo 20 — Sueldos y personal (C) (L931) | M16, T11 | M16: RF-SUE-002, RF-SUE-009, RF-SUE-010 … · T11: RF-WFL-137, RF-WFL-197, RF-WFL-214 … | Cubierta |
| › Funciones [M][T] (§21) (L933) | M16, T11 | hereda de §21 | Cubierta (por sección) |
| › Mejoras propuestas (§21) (L970) | M16, T11 | hereda de §21 | Cubierta (por sección) |
| §22 Módulo 21 — Atención: mesa de entradas, turnero y comunicaciones (B) (L976) | M09, T03, T09, T11 | M09: §1, §3, RF-CRM-035 … · T03: RF-UXD-055, SM-ADM-004, SM-ADM-090 … · T09: RF-COM-130, PAN-COM-18 · T11: §3, RF-WFL-170, RF-WFL-179 … | Cubierta |
| › Funciones (§22) (L978) | M09, T03, T09, T11 | hereda de §22 | Cubierta (por sección) |
| › Mejoras propuestas (§22) (L1017) | M09, T03 | M09: §1, RF-CRM-035, RF-CRM-151 … · T03: SM-LND-014 | Cubierta |
| §23 Módulo 22 — Actividades y tareas internas (C) (L1024) | M09, T11 | M09: RF-CRM-234, RF-CRM-237, PAN-CRM-29 … · T11: RF-WFL-143 | Cubierta |
| › Funciones [M][T] (§23) (L1026) | M09, T11 | hereda de §23 | Cubierta (por sección) |
| §24 Módulo 23 — Traslados y flota (C) (L1035) | M18, T03 | M18: encab., RF-SOC-074, RF-SOC-127 … · T03: SM-PWC-017 | Cubierta |
| › Funciones [M][T] (§24) (L1037) | M18, T03 | hereda de §24 | Cubierta (por sección) |
| §25 Módulo 24 — Gestión institucional (C) (L1046) | M17, T03, T11 | M17: encab., RF-INS-001, RF-INS-003 … · T03: SM-ADM-174 · T11: RF-WFL-122 | Cubierta |
| › Funciones [T][I] (§25) (L1048) | M17, T03, T11 | hereda de §25 | Cubierta (por sección) |
| › Mejoras propuestas (§25) (L1054) | M17, T03, T11 | hereda de §25 | Cubierta (por sección) |
| §26 Módulo 25 — Servicios sociales y otros servicios (C) (L1060) | M02, M18, T03 | M02: encab., §6.C.1, §6.C.2 … · M18: RF-SOC-081, RF-SOC-085, PAN-SOC-16 … · T03: SM-ADM-107 | Cubierta |
| › Funciones [M][T] (§26) (L1062) | M02, M18, T03 | hereda de §26 | Cubierta (por sección) |
| §27 Módulo 26 — Autogestión del socio: portal y app (B) (L1086) | M19, T03, T09 | M19: encab., RF-POR-013, RF-POR-035 … · T03: §7.B.1, SM-PWS-015 · T09: RF-COM-174, PAN-COM-42 | Cubierta |
| › Funciones [M][T][P] (§27) (L1088) | M19, T03, T09 | hereda de §27 | Cubierta (por sección) |
| › Funciones esperadas en el sistema nuevo [I] (§27) (L1103) | M19, T03, T09 | hereda de §27 | Cubierta (por sección) |
| §28 Módulo 27 — App móvil de campo (B) (L1111) | M10, T03 | M10: RF-TEC-112, RF-TEC-224 · T03: SM-PWC-002, SM-PWC-012 | Cubierta |
| §29 Módulo 28 — Reportes, tableros y exportaciones (B) (L1119) | T03, T10 | T03: RF-UXD-082, RN-UXD-045, §10.2.2 … · T10: encab., §2.1, RF-BIA-001 … | Cubierta |
| › Funciones [M][T] (§29) (L1121) | T03, T10 | hereda de §29 | Cubierta (por sección) |
| › Mejoras propuestas (§29) (L1130) | T03, T10 | hereda de §29 | Cubierta (por sección) |
| §30 Módulo 29 — Integraciones externas (A/B) (L1140) | T03, T06, T07, T09 | T03: SM-ADM-147 · T06: encab., §12.5, §12.10 … · T07: encab., RF-MIG-014, §13 … · T09: §22: §13 | Cubierta |
| §31 Procesos transversales clave (flujo de punta a punta) (L1166) | M01, M10, T07, T09 | M01: encab., RN-PER-122 · M10: RF-TEC-018, §22: §9.1 · T07: CTR-MIG-01, §22: §9.2–§9.5, RF-MIG-033 … · T09: encab., §22: P-COM-06; §9.6.4–9.6.5 | Cubierta |
| §32 Modelo de datos de referencia (resumen) (L1213) | T04, T07, T08 | T04: encab., RF-CFG-047, RF-CFG-108 … · T07: encab., RF-MIG-033, RF-MIG-034 … · T08: encab., RN-NFR-017 | Cubierta |
| §33 Propuesta de etapas, a validar (L1241) | T01, T07, T08 | T01: encab., §19.4, CTR-PLA-10 · T07: encab., §1, §3 … · T08: encab., RNF-NFR-153 | Cubierta |
| §34 Pendientes para cerrar la definición (L1257) | T07, T08 | T07: encab., RF-MIG-004, §9.2 … · T08: §22: Descartado para T08: pendientes funci... | Cubierta |

## 11. Matriz FIC

Fuente: `procoop-relevamiento/integraciones-fichas.md`.

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Fichas de integraciones externas (L1) | T06, T01, T07, T11, M09, M11, M12 (+11) | ver subsecciones | Cubierta (por subsecciones) |
| §0 Cómo leer este documento (L7) | — | — | Descartada (metadato de la fuente, sin requisito) |
| › Hallazgo principal (§0) (L26) | T06 | T06: encab. | Débil (solo encabezado) |
| §1 Resumen (L34) | T06 | T06: encab., CTR-INT-16 | Cubierta |
| §2 Fiscal nacional (ARCA) (L61) | M06, M12, T06 | ver subsecciones | Cubierta (por subsecciones) |
| › §2.1 Factura electrónica — WSAA + WSFEv1 (L63) | M06, T06 | M06: encab., §1, RF-FIS-004 … · T06: RF-INT-038, RN-INT-005, §12.4 | Cubierta |
| › §2.2 Padrón de contribuyentes — A13 y constancia (L76) | M06, T06 | M06: encab., RF-FIS-016, RF-FIS-018 … · T06: §12.4, CTR-INT-05 | Cubierta |
| › §2.3 Regímenes informativos y libros digitales (L86) | M06, T06 | M06: encab., §1, RF-FIS-007 … · T06: §12.4, §12.5 | Cubierta |
| › §2.4 Mis Comprobantes (importación) (L101) | M06, M12, T06 | M06: encab., RF-FIS-122, §13 · M12: encab., RF-CMP-120, RF-CMP-121 … · T06: §12.4 | Cubierta |
| §3 Fiscal provincial (L113) | M06, T06 | ver subsecciones | Cubierta (por subsecciones) |
| › §3.1 Rentas Córdoba — Ingresos Brutos, CVP y SIRCAR (L115) | M06, T06 | M06: encab., RF-FIS-087, RF-FIS-088 … · T06: §12.5 | Cubierta |
| › §3.2 Otras provincias (L128) | M06, T06 | M06: encab., RF-FIS-087, RF-FIS-092 … · T06: §12.5 | Cubierta |
| §4 Cobranza por redes (L136) | M07, M10, T06 | M07: §22: Sección 13 · M10: encab., RF-TEC-128, CTR-TEC-13 … · T06: encab., RF-INT-059, RF-INT-066 … | Cubierta |
| › §4.1 Red Link (L140) | M07, T06 | M07: encab., RF-COB-104, RF-COB-115 · T06: RF-INT-002, RF-INT-062, RN-INT-042 … | Cubierta |
| › §4.2 SIRO (Banco Roela) (L150) | M07, T06 | M07: encab. · T06: §12.7, CTR-INT-01 | Cubierta |
| › §4.3 Código de barras de la factura (L160) | M05, M07, T06 | M05: encab., RF-FAC-140, RF-FAC-148 … · M07: encab., RF-COB-059 · T06: RF-INT-061, §12.7 | Cubierta |
| › §4.4 Otras redes y entes recaudadores (L168) | M07, T06 | M07: encab., RF-COB-099 · T06: RF-INT-001, RF-INT-059, §12.7 … | Cubierta |
| §5 Pagos digitales (L176) | M07, T06 | M07: §22: Sección 13 · T06: encab. | Cubierta |
| › §5.1 Pagos360 (L178) | M07, T06 | M07: encab. · T06: §12.8 | Cubierta |
| › §5.2 Mercado Pago, Macro y otros botones (L189) | M07, T06 | M07: encab., RF-COB-131 · T06: RF-INT-001, §12.8, CTR-INT-03 | Cubierta |
| §6 Débito automático (L197) | M07, T06 | M07: encab., RF-COB-115, RF-COB-119 … · T06: encab., §12.9, CTR-INT-21 | Cubierta |
| §7 Subsidios y tarifa social (L209) | M04, M06, T06 | M04: encab., RF-TAR-078, RF-TAR-079 … · M06: encab., §13, RF-FIS-144 · T06: encab., §12.6 | Cubierta |
| §8 Reguladores (L221) | M06, T06, T10 | M06: §1, RF-FIS-143 · T06: encab., §12.6 · T10: encab., §13, RF-BIA-088 | Cubierta |
| › §8.1 ERSeP (Ente Regulador de Servicios Públicos de Córdoba) (L223) | M06, T06 | M06: encab., RF-FIS-144, §13 … · T06: §12.6 | Cubierta |
| › §8.2 ENARGAS (L231) | M06, T06 | M06: encab., RF-FIS-145, §13 … · T06: §12.6 | Cubierta |
| › §8.3 ENACOM (L239) | M06, T06 | M06: encab., RF-FIS-146, §13 · T06: §12.6 | Cubierta |
| › §8.4 Secretaría de Energía (L244) | M06, T06 | M06: encab., RF-FIS-147, §13 · T06: §12.6 | Cubierta |
| §9 Federación y terceros (L252) | M10, T06 | M10: RF-TEC-182 · T06: encab. | Cubierta |
| › §9.1 FECESCOR (L254) | M06, T06 | M06: encab., §1, RF-FIS-140 … · T06: §12.6 | Cubierta |
| › §9.2 Rendición de tasas de terceros (L262) | M06, T06 | M06: encab., §1, RF-FIS-134 … · T06: §12.6 | Cubierta |
| › §9.3 EPEC (L269) | M06, M12, T06 | M06: encab., §2.2, §7.36 … · M12: RF-CMP-085 · T06: §12.6, CTR-INT-18 | Cubierta |
| §10 Lectura de medidores (L278) | M10, T06 | M10: CTR-TEC-34, RF-TEC-148 · T06: encab. | Cubierta |
| › §10.1 Lectores portátiles y app de lecturas (L280) | M03, T06 | M03: encab., RF-MED-033, RF-MED-043 … · T06: §12.13 | Cubierta |
| › §10.2 Telemedición (AMI/MDM) (L292) | M03, T06 | M03: encab., RF-MED-106, RF-MED-107 … · T06: §12.13, CTR-INT-04 | Cubierta |
| › §10.3 Medidores prepagos (L300) | M03, T06 | M03: encab., RF-MED-113, RF-MED-115 … · T06: §12.13, §12.18 | Cubierta |
| §11 Bancos y tesorería (L311) | M14, T06 | M14: RF-TES-089 · T06: encab. | Cubierta |
| › §11.1 Interbanking (L313) | M12, M14, T06 | M12: encab., §13, CTR-CMP-12 · M14: encab., RF-TES-051, RF-TES-054 … · T06: §12.10, CTR-INT-06 | Cubierta |
| › §11.2 Extractos bancarios (L322) | M14, T06 | M14: encab., RF-TES-033, PAN-TES-08 … · T06: §12.10, CTR-INT-25 | Cubierta |
| › §11.3 Cotización de monedas (L330) | M14, T06 | M14: encab., RF-TES-141, RF-TES-142 … · T06: §12.4 | Cubierta |
| §12 Sueldos (L338) | M16, T06 | M16: RF-SUE-086, RF-SUE-097, RF-SUE-100 … · T06: encab., §12.4 | Cubierta |
| §13 Comunicaciones (L349) | M06, T06 | M06: §22: FIC 9.3 en §13 (referencia M12/M03) · T06: encab. | Cubierta |
| › §13.1 E-mail (L351) | M09, T06, T11 | M09: RF-CRM-177, §13 · T06: RN-INT-019, §12.11, CTR-INT-13 · T11: encab. | Cubierta |
| › §13.2 WhatsApp (L360) | M09, T06 | M09: encab., RF-CRM-172, RF-CRM-173 … · T06: §12.11, CTR-INT-09 | Cubierta |
| › §13.3 SMS (L369) | M09, T06 | M09: encab., RF-CRM-178, §13 · T06: §12.11, CTR-INT-10 | Cubierta |
| › §13.4 IVR y llamadas automáticas (L375) | M09, T06 | M09: encab., RF-CRM-180, §13 · T06: §12.11, FI-INT-69, FI-INT-113 … | Cubierta |
| §14 Portal, app y API (L383) | T06, T07, T10, M10, M19, T11 | ver subsecciones | Cubierta (por subsecciones) |
| › §14.1 Portal del socio (CoopOnline) (L385) | M10, M19, T06, T07, T11 | M10: RF-TEC-227, §22: §5.3, §5.11 … · M19: encab., §1, §2.3 … · T06: §12.17 · T07: RF-MIG-012, RF-MIG-063, RF-MIG-090 … · (+1 anexos) | Cubierta |
| › §14.2 App de campo (técnica y ventas) (L392) | M10, T06, T07 | M10: §22: §5.3, §5.11, §5.15 … · T06: §12.13 · T07: RF-MIG-012, §13, §22: Matriz §19.28 (MODEINT … | Cubierta |
| › §14.3 API para terceros (L398) | T06, T07, T10 | T06: §12.17, CTR-INT-07 · T07: §22: Matriz §19.28 (MODEINT, FORMAINT, EXPORTADOR) … · T10: RF-BIA-071, RF-BIA-077, RF-BIA-083 … | Cubierta |
| §15 Firma digital y electrónica (L408) | M10, M16, T06, T11 | M10: §22: §5.3, §5.11, §5.15 … · M16: RF-SUE-105, §13, §21 … · T06: encab., §12.15 · T11: encab., RF-WFL-111, RF-WFL-195 … | Cubierta |
| §16 GIS y mapas (L419) | M10, T06, T10 | M10: RF-TEC-160, §22: §5.3, §5.11 … · T06: encab., §12.12, §12.18 … · T10: RF-BIA-020, RF-BIA-101, §13 … | Cubierta |
| §17 Servicios TIC (telefonía, internet, TV) (L429) | M10, T06 | M10: RF-TEC-182, RF-TEC-194, RF-TEC-205 … · T06: encab., RF-INT-001, §12.14 … | Cubierta |
| §18 Análisis y contabilidad externa (L441) | M15, T06, T07, T10 | ver subsecciones | Cubierta (por subsecciones) |
| › §18.1 Power BI y herramientas de análisis (L443) | T06, T10 | T06: §12.17 · T10: RF-BIA-060, RF-BIA-102, §13 … | Cubierta |
| › §18.2 Sistema contable externo (L449) | M15, T06, T07, T10 | M15: encab., RF-CON-045, RF-CON-139 … · T06: §12.17 · T07: RF-MIG-074, RF-MIG-082, §13 … · T10: RF-BIA-101, §13, RF-BIA-088 | Cubierta |
| §19 Hardware local (L457) | M09, M11, T06 | M09: encab., RF-CRM-153, RF-CRM-155 … · M11: encab., §2, RF-VEN-105 … · T06: encab., RF-INT-084, §12.16 … | Cubierta |
| §20 Inteligencia artificial (L465) | M09, M11, M12, T06 | M09: encab., RF-CRM-203, §13 … · M11: encab. · M12: encab., RF-CMP-130, §13 … · T06: encab., RF-INT-086, §12.15 | Cubierta |
| §21 Migración desde Procoop (L473) | T06, T07, T11 | T06: encab., §12.17 · T07: §1, §2.1, §2.3 … · T11: encab., RF-WFL-150, RF-WFL-175 … | Cubierta |
| §22 Infraestructura que reemplaza procesos de Procoop (L487) | T01, T06, T07, T11 | T01: encab., RF-PLA-010, RF-PLA-012 … · T06: encab., RF-INT-062, RF-INT-065 … · T07: CTR-MIG-12 · T11: encab., §3, RN-WFL-007 … | Cubierta |
| §23 Lista de pedidos a la cooperativa (L501) | T06 | T06: encab., §7.9, §12.4 … | Cubierta |

## 12. Matrices RN-00 a RN-13

Fuente: `procoop-relevamiento/reglas-negocio/`. Una subsección por archivo.

### 12.1 RN-00 — `00-indice.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Reglas de negocio de Procoop extraídas del código (L1) | — | — | **SIN COBERTURA** |
| Documentos (L9) | — | — | **SIN COBERTURA** |
| Cobertura del código (L27) | — | — | **SIN COBERTURA** |
| Qué quedó afuera y por qué (L50) | — | — | **SIN COBERTURA** |

### 12.2 RN-01 — `01-calculo-factura-servicios.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Cálculo de la factura de un servicio (L1) | M04, T10, T04b-p2, M06, M03, M07, T05 (+4) | ver subsecciones | Cubierta (por subsecciones) |
| §1 Flujo general (L29) | M04 | M04: encab., §6.1 | Cubierta |
| › §1.1 Orquestación (facturación masiva) (L31) | M04 | M04: RF-TAR-059, RF-TAR-063, RN-TAR-001 … | Cubierta |
| › §1.2 `GetItemsServicio`: armado de ítems de un servicio (L50) | M04, T04b-p2 | M04: RF-TAR-051, RF-TAR-052, RN-TAR-003 … · T04b-p2: §5.1 | Cubierta |
| › §1.3 `GetFactura`: armado del comprobante (L63) | M04 | M04: RF-TAR-062, RN-TAR-010, RN-TAR-011 | Cubierta |
| §2 Tipos de servicio (`SERVICIO.TIP_CAL`) (L75) | M02, M04, M05 | M02: encab., RF-CAT-017, RF-CAT-021 … · M04: encab., RF-TAR-020, RF-TAR-034 … · M05: RN-FAC-155 | Cubierta |
| §3 Cargo fijo (L111) | M04 | M04: encab., RF-TAR-021, RF-TAR-036 … | Cubierta |
| › §3.1 Cuándo se cobra (L115) | M04 | M04: RF-TAR-039, RN-TAR-018, RN-TAR-019 … | Cubierta |
| › §3.2 Importe del cargo fijo (`GetImporteCF`) (L126) | M04 | M04: RN-TAR-021, RN-TAR-022, RN-TAR-023 … | Cubierta |
| › §3.3 Medidores compartidos (multicategoría) (L145) | M04, T04b-p2 | M04: RN-TAR-024 · T04b-p2: §5.1 | Cubierta |
| › §3.4 Prorrateo del cargo fijo (L149) | M04 | M04: RN-TAR-025 | Cubierta |
| §4 Servicios medidos: tramos, escalones y factores (L155) | M03, M04 | M03: encab., RN-MED-069, RF-MED-063 … · M04: encab., RF-TAR-021, RF-TAR-022 … | Cubierta |
| › §4.1 Tarifa por bloque (tipos 1, 4 y 7) (L157) | M04 | M04: RN-TAR-026, RN-TAR-027, RN-TAR-028 … | Cubierta |
| › §4.2 Tramos y escalones progresivos (tipos 2, 3 y 8, y grandes consumos) (L168) | M04, T04b-p2 | M04: RN-TAR-029, RN-TAR-030, RN-TAR-031 … · T04b-p2: §5.1 | Cubierta |
| › §4.3 Factor proporcional por días (L199) | M03, M04, T04b-p2 | M03: RN-MED-071 · M04: RN-TAR-027, RN-TAR-034, CTR-TAR-17 … · T04b-p2: §5.1 | Cubierta |
| › §4.4 Gas natural (tipo 3) (L211) | M03, M04, T04b-p2 | M03: RF-MED-063, RN-MED-069, RN-MED-070 … · M04: RF-TAR-026, RF-TAR-040, RN-TAR-035 … · T04b-p2: §5.1 | Cubierta |
| › §4.5 Consumo mínimo (L226) | M04, T04b-p2 | M04: RF-TAR-038, RN-TAR-037 · T04b-p2: §5.1 | Cubierta |
| › §4.6 Energía inyectada (prosumidores) (L236) | M03, M04, T04b-p2 | M03: RF-MED-097, RN-MED-117, §7.6 · M04: RF-TAR-045, RF-TAR-063, RN-TAR-038 … · T04b-p2: §5.1 | Cubierta |
| › §4.7 Consumo en cero y bonificación de consumo (`SERSOC.CONS_BONIF`) (L247) | M04, T04b-p2 | M04: RF-TAR-039, RF-TAR-040, RN-TAR-040 … · T04b-p2: §5.1 | Cubierta |
| › §4.8 Categorías prepagas (`CATE_SER.PREPAGA`) (L258) | M03, M04, T04b-p2 | M03: RF-MED-117, RN-MED-110 · M04: RF-TAR-041, RN-TAR-043 · T04b-p2: §5.1 | Cubierta |
| §5 Servicios fijos, por cantidad y proporcionales (L269) | M04, T04b-p2 | M04: encab., RF-TAR-020, RF-TAR-034 … · T04b-p2: §5.1 | Cubierta |
| › §5.1 Proporcional de alta y baja (L279) | M04, T04b-p2 | M04: RF-TAR-043, RN-TAR-046, RN-TAR-047 … · T04b-p2: §5.1 | Cubierta |
| §6 Prorrateo entre cuadros tarifarios (L292) | M04 | M04: encab., RF-TAR-042, CTR-TAR-09 | Cubierta |
| › §6.1 Configuración (en `SERVICIO`, y por cuadro en `HIS_SERVICIO`) (L296) | M04 | M04: RF-TAR-020, §6.6, RN-TAR-049 | Cubierta |
| › §6.2 Cálculo de las fracciones (L308) | M04 | M04: §6.6, RN-TAR-050, RN-TAR-051 … | Cubierta |
| › §6.3 Métodos (L324) | M04 | M04: §6.6, RN-TAR-054, RN-TAR-055 … | Cubierta |
| › §6.4 Cuadros tarifarios: alta, históricos y actualización de precios (segunda pasada) (L331) | M04 | M04: RF-TAR-002, RF-TAR-017, RF-TAR-018 … | Cubierta |
| §7 Cuotas de obras (tipo 17) (L362) | M04, M18, T07 | M04: encab., RF-TAR-025, RF-TAR-031 … · M18: encab., RF-SOC-086, RF-SOC-091 … · T07: RN-MIG-053 | Cubierta |
| §8 Agua según inmueble (tipo 15) (L398) | M04 | M04: encab., RF-TAR-020, RF-TAR-048 … | Cubierta |
| §9 Servicios con adherentes (tipos 9 a 13) (L412) | M02, M04, M18 | M02: encab., RF-CAT-022, RF-CAT-055 … · M04: encab., RF-TAR-020, RF-TAR-024 … · M18: encab., RF-SOC-016, RF-SOC-018 … | Cubierta |
| §10 Telefonía (tipo 5) (L437) | M02, M04 | M02: encab., RN-CAT-075, §6.C.2 … · M04: encab., RF-TAR-050, §6.11 … | Cubierta |
| §11 Grandes consumos (`CATE_SER.GC`) (L447) | M04 | M04: encab., RF-TAR-021, RF-TAR-044 … | Cubierta |
| › §11.1 Energía activa (L461) | M04 | M04: RN-TAR-102, RN-TAR-103, CTR-TAR-16 | Cubierta |
| › §11.2 Demanda (L475) | M04, T04b-p2 | M04: RN-TAR-104, RN-TAR-105, RN-TAR-106 … · T04b-p2: §5.1 | Cubierta |
| › §11.3 Factor de potencia (coseno fi) (L509) | M04, T04b-p2 | M04: RN-TAR-111, RN-TAR-112, RN-TAR-113 … · T04b-p2: §5.1 | Cubierta |
| §12 Cargos adicionales y fórmulas (L534) | M04 | M04: encab., RF-TAR-102, §6.13 | Cubierta |
| › §12.1 Definición (`CARGOS_ADICIONALES`, histórico por cuadro en `HIS_CARGOS_ADICIONALES`) (L536) | M04 | M04: RF-TAR-065, RF-TAR-072, RN-TAR-116 | Cubierta |
| › §12.2 Evaluación (L554) | M04 | M04: RF-TAR-065, RN-TAR-117 | Cubierta |
| › §12.3 Aplicación del resultado (L565) | M04 | M04: RF-TAR-062, RF-TAR-065, RF-TAR-066 … | Cubierta |
| › §12.4 Datos y funciones disponibles en las fórmulas (L579) | M04 | M04: RF-TAR-065, RF-TAR-068, RN-TAR-123 … | Cubierta |
| › §12.5 Motor de evaluación de las fórmulas (segunda pasada) (L603) | M04 | M04: RF-TAR-061, RF-TAR-065, RF-TAR-068 … | Cubierta |
| › §12.6 Aplicación: detalles verificados (segunda pasada) (L644) | M04 | M04: RF-TAR-068, RN-TAR-120, RN-TAR-121 … | Cubierta |
| › §12.7 Catálogo de funciones propias (segunda pasada) (L666) | M04 | M04: RF-TAR-068, RF-TAR-087, RF-TAR-092 … | Cubierta |
| › §12.8 Mantenimiento de cargos adicionales (segunda pasada) (L758) | M04 | M04: RF-TAR-069, RF-TAR-094, RN-TAR-063 … | Cubierta |
| › §12.9 Variables de contexto completas de la fase servicio (segunda pasada) (L779) | M04 | M04: RN-TAR-045, RN-TAR-123, §9.4 | Cubierta |
| §13 Franqueo (L803) | M04 | M04: encab., RF-TAR-053, §6.14 … | Cubierta |
| §14 Anticipos (L817) | M04, T04b-p2 | M04: encab., RF-TAR-054, §6.14 … · T04b-p2: §5.2 | Cubierta |
| §15 Redondeo (L828) | M04, M07, T04b-p2, T05, T07 | M04: encab., RF-TAR-055, RF-TAR-112 … · M07: §7.22 · T04b-p2: §5.1 · T05: CTR-DAT-42 · (+1 anexos) | Cubierta |
| §16 Medidor testigo (L864) | M03, M04 | M03: encab., RF-MED-087, RN-MED-072 · M04: encab., §6.14, RN-TAR-165 | Cubierta |
| §17 IVA, percepciones e Ingresos Brutos (L879) | M04, M06 | M04: encab., RF-TAR-021, RF-TAR-056 … · M06: encab., §1, §6.5 | Cubierta |
| › §17.1 Alícuota de cada ítem (L881) | M04, M06 | M04: RN-TAR-166 · M06: RF-FIS-078, RF-FIS-080, RN-FIS-073 | Cubierta |
| › §17.2 Cálculo (L888) | M04, M06 | M04: RF-TAR-057, RN-TAR-167, RN-TAR-168 … · M06: RF-FIS-079, RF-FIS-081, RF-FIS-082 … | Cubierta |
| §18 Bonificaciones, subsidios y tarifa social (L914) | M04, M06 | M04: encab., §6.16, RN-TAR-172 … · M06: encab., RN-FIS-083 | Cubierta |
| §19 Validaciones y errores (L927) | M04 | M04: encab., RF-TAR-059, RN-TAR-033 … | Cubierta |
| §20 Parámetros de configuración que condicionan el cálculo (L986) | M04, T04b-p2 | M04: encab., RF-TAR-020, RF-TAR-021 … · T04b-p2: encab., §8 | Cubierta |
| §21 Implicancias para CoopApps (L1060) | M04 | M04: encab., §2.3, RF-TAR-032 … | Cubierta |
| §22 Dudas abiertas (L1093) | M04 | M04: encab. | Débil (solo encabezado) |
| §23 Reglas adicionales (segunda pasada) (L1135) | M04 | M04: encab., §6.18, §19.4 | Cubierta |
| › §23.1 `clsConsumosAFacturar` (consumos que entran a la factura) (L1139) | M04 | M04: RN-TAR-104, RN-TAR-109, RN-TAR-176 … | Cubierta |
| › §23.2 `clsFacturacionServicio`: métodos no cubiertos antes (L1170) | M04 | M04: RN-TAR-075, RN-TAR-164, RN-TAR-181 | Cubierta |
| › §23.3 `ItemsComprobante` (ítem del comprobante) (L1177) | M04, T04b-p2 | M04: RN-TAR-182, RN-TAR-183, RN-TAR-184 · T04b-p2: §5.10 | Cubierta |
| › §23.4 `ItemsComprobanteCollection` (colección de ítems) (L1211) | M04, T04b-p2 | M04: RN-TAR-185, RN-TAR-186, RN-TAR-187 … · T04b-p2: §5.4, §5.10 | Cubierta |
| › §23.5 `ItemIVA` y `clsComprobanteFactura.AgregarItemIVA` (L1234) | M04 | M04: RN-TAR-190 | Cubierta |
| › §23.6 `clsDetalleComprobante` (detalle de comprobantes de compra) (L1238) | M04 | M04: RN-TAR-191 | Cubierta |
| › §23.7 `clsDetallesPendientes` (pendientes de pedidos de compra) (L1252) | M04 | M04: RN-TAR-191 | Cubierta |
| › §23.8 `clsEvolucionConceptos` (informe de evolución entre dos períodos) (L1258) | M04, T10 | M04: RF-TAR-100, RN-TAR-192 · T10: encab., RN-BIA-010, CTR-BIA-04 … | Cubierta |
| › §23.9 Informes relacionados con tarifas (L1268) | M04, T10 | M04: RF-TAR-100, RN-TAR-193, RN-TAR-194 · T10: encab., RN-BIA-005, CTR-BIA-04 | Cubierta |
| › §23.10 Métodos sin regla de negocio (L1276) | M04 | M04: RN-TAR-195 | Cubierta |

### 12.3 RN-02 — `02-facturacion-masiva-y-comprobantes.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Facturación masiva y comprobantes (L1) | M05, M11, T04b-p2, M06, M17, M18 | ver subsecciones | Cubierta (por subsecciones) |
| §1 Conceptos y vocabulario (L15) | M05 | M05: encab., RF-FAC-012, RF-FAC-066 … | Cubierta |
| §2 Facturación masiva mensual (L33) | M05 | M05: encab., §22.3 | Cubierta |
| › §2.1 Configuración: el "tipo de factura" como plantilla (L37) | M05, M11 | M05: RF-FAC-003, RF-FAC-007, RF-FAC-009 … · M11: encab., RN-VEN-027, RF-VEN-084 | Cubierta |
| › §2.2 Validaciones previas (L56) | M05 | M05: RF-FAC-006, RF-FAC-015, RF-FAC-016 … | Cubierta |
| › §2.3 Selección de cuentas (L84) | M05, M11 | M05: RF-FAC-003, RF-FAC-011, RF-FAC-020 … · M11: encab., RF-VEN-086, RN-VEN-001 … | Cubierta |
| › §2.4 Simulación (L119) | M05 | M05: RF-FAC-025, RF-FAC-026, RF-FAC-055 … | Cubierta |
| › §2.5 Generación: algoritmo principal (L127) | M05, M11 | M05: RF-FAC-028, RF-FAC-047, RF-FAC-117 … · M11: encab., RF-VEN-084, RF-VEN-085 … | Cubierta |
| › §2.6 Armado de comprobantes (`ObtenerFacturas`) (L164) | M05 | M05: RF-FAC-028, RF-FAC-029, RF-FAC-030 … | Cubierta |
| › §2.7 Persistencia, lotes y transacciones (L186) | M05 | M05: RN-FAC-033, RN-FAC-049, RN-FAC-056 | Cubierta |
| › §2.8 Hilos y avance (L200) | M05 | M05: RF-FAC-047, RN-FAC-057 | Cubierta |
| › §2.9 Log de la corrida y cierre (L207) | M05 | M05: RF-FAC-010, RF-FAC-024, RF-FAC-050 … | Cubierta |
| §3 Tipos de comprobante y letras (L221) | M05 | ver subsecciones | Cubierta (por subsecciones) |
| › §3.1 Modelo (L223) | M05 | M05: RF-FAC-077 | Cubierta |
| › §3.2 Resolución del comprobante — `GetComprobanteOperacion` (L229) | M05 | M05: RF-FAC-032, RF-FAC-078, RF-FAC-079 … | Cubierta |
| › §3.3 Validaciones de un comprobante individual (L251) | M05 | M05: RF-FAC-034, RF-FAC-088, RF-FAC-127 … | Cubierta |
| §4 Numeración y puntos de venta (L271) | M05 | M05: encab., RF-FAC-080 | Cubierta |
| › §4.1 Numerador `COMPPOS` (L273) | M05 | M05: RF-FAC-081, RF-FAC-084, RN-FAC-048 … | Cubierta |
| › §4.2 Punto de venta — `GetPuntoVenta` (L280) | M05 | M05: RF-FAC-033, RF-FAC-080, RN-FAC-047 | Cubierta |
| › §4.3 Numeración en la masiva (L293) | M05 | M05: RF-FAC-048, RF-FAC-083, RN-FAC-049 … | Cubierta |
| › §4.4 Tipo de autorización resultante (L315) | M05 | M05: RF-FAC-062, RF-FAC-081, RN-FAC-053 … | Cubierta |
| §5 Vencimientos (L329) | M05 | M05: encab., RF-FAC-086 | Cubierta |
| › §5.1 Fechas (L331) | M05 | M05: RF-FAC-092, RN-FAC-059 | Cubierta |
| › §5.2 Importes del 2º, 3º y 4º vencimiento (L335) | M05 | M05: RF-FAC-087, RF-FAC-089, RN-FAC-060 … | Cubierta |
| §6 Bloqueo de facturas (L355) | M05, M17 | M05: encab., RF-FAC-057, RF-FAC-093 … · M17: CTR-INS-10, RN-INS-013, RN-INS-016 … | Cubierta |
| §7 Anulación, notas de crédito y reversión (L372) | M05, M17, M18 | M05: encab. · M17: RF-INS-042, RN-INS-013, RN-INS-016 … · M18: encab., RF-SOC-096, RN-SOC-042 | Cubierta |
| › §7.1 Validaciones (`ValidarAnulacion`, `clsAnulacionFacturas.cs:386-515`) (L376) | M05 | M05: RF-FAC-098, RF-FAC-100, RF-FAC-103 … | Cubierta |
| › §7.2 Anular vs. revertir (L400) | M05 | M05: RF-FAC-098, RF-FAC-099, RF-FAC-101 … | Cubierta |
| › §7.3 Efectos sobre el servicio facturado (L424) | M05 | M05: RF-FAC-101, RN-FAC-026, RN-FAC-085 … | Cubierta |
| › §7.4 Comprobante de reversión (NC/ND) (L430) | M05 | M05: RF-FAC-099, RF-FAC-102, RF-FAC-103 … | Cubierta |
| › §7.5 Relación manual entre comprobantes (L455) | M05 | M05: RF-FAC-099, RF-FAC-105, RN-FAC-092 | Cubierta |
| §8 Recategorización (L461) | M05 | M05: encab., RF-FAC-108, RF-FAC-109 … | Cubierta |
| §9 Retroactivos (L479) | M05 | M05: encab., RF-FAC-111, RF-FAC-116 … | Cubierta |
| §10 Modificación masiva (L496) | M05, M11 | ver subsecciones | Cubierta (por subsecciones) |
| › §10.1 Facturas emitidas (`clsModificacionFacturas`) (L498) | M05, M11 | M05: RF-FAC-112, RF-FAC-113, RF-FAC-166 … · M11: RF-VEN-062, RF-VEN-114, RN-VEN-034 … | Cubierta |
| › §10.2 Cuotas de ventas (`clsModificacionCuotas`) (L509) | M05, M11 | M05: RF-FAC-115, RN-FAC-110 · M11: encab., RF-VEN-088, RN-VEN-031 … | Cubierta |
| §11 Facturación de cuotas y de terceros (L524) | M05, M06 | M05: encab., RF-FAC-116, §22.3 · M06: encab. | Cubierta |
| › §11.1 Cuotas de ventas dentro de la masiva (L526) | M05, M06, M11 | M05: RF-FAC-117, RF-FAC-161, RN-FAC-111 … · M06: RN-FIS-084 · M11: encab., RF-VEN-081, RN-VEN-025 | Cubierta |
| › §11.2 Importaciones de terceros (`clsFacturacionCuotasTerceros`) (L532) | M05, M06, M11 | M05: RF-FAC-121, RN-FAC-114 · M06: RF-FIS-137, RN-FIS-114 · M11: encab., RF-VEN-093, RN-VEN-025 … | Cubierta |
| › §11.3 Servicios de terceros (`clsFacturacionServiciosTerceros`) (L552) | M05, M06 | M05: RF-FAC-121, RF-FAC-124 · M06: RF-FIS-137, RN-FIS-114 | Cubierta |
| › §11.4 Datos extra de terceros en la factura (`clsFacturas_DatosExtras`) (L556) | M05, M06 | M05: RF-FAC-123 · M06: RF-FIS-137, RN-FIS-114 | Cubierta |
| §12 Impresión, talones y código de barras (L562) | M05 | ver subsecciones | Cubierta (por subsecciones) |
| › §12.1 Selección del reporte (L564) | M05 | M05: RF-FAC-049, RF-FAC-134, RF-FAC-135 … | Cubierta |
| › §12.2 Talones (agrupación de facturas para pagar juntas) (L580) | M05 | M05: RF-FAC-012, RF-FAC-149, RF-FAC-150 … | Cubierta |
| › §12.3 Código de barras: arquitectura (L593) | M05 | M05: RF-FAC-140, RF-FAC-141, RF-FAC-143 … | Cubierta |
| › §12.4 Formatos genéricos (estructura) (L618) | M05 | M05: RF-FAC-140, RF-FAC-142 | Cubierta |
| › › §12.4.1 Resto de los formatos genéricos (segunda pasada) (L631) | M05 | M05: RF-FAC-142, RF-FAC-144, RN-FAC-126 … | Cubierta |
| › §12.5 Cómo varía por cooperativa (L664) | M05 | M05: RF-FAC-140, RF-FAC-142, RF-FAC-146 | Cubierta |
| › §12.6 Pagos360 (L682) | M05 | M05: RF-FAC-146, RN-FAC-077, RN-FAC-130 … | Cubierta |
| §13 Interfaces con entes reguladores (L692) | M05, M06 | M05: encab., CTR-FAC-16 · M06: encab. | Cubierta |
| › §13.1 ENARGAS (gas) (L694) | M06 | M06: RF-FIS-145, RN-FIS-115, CTR-FIS-14 … | Cubierta |
| › §13.2 ENACOM (telecomunicaciones) (L700) | M06 | M06: RF-FIS-146, RN-FIS-116, §21 … | Cubierta |
| › §13.3 Otros archivos (`ReglasNegocio.Facturacion.Archivos`) (L705) | M06 | M06: RF-FIS-125, RF-FIS-094, RN-FIS-099 | Cubierta |
| › › §13.3.1 Detalle de `Archivos` (segunda pasada) (L712) | M06 | M06: RF-FIS-094, RF-FIS-111, RF-FIS-121 … | Cubierta |
| §14 Parámetros `Busca_V2_*` que condicionan el proceso (L762) | M05, M11, T04b-p2 | M05: encab., RN-FAC-132 · M11: encab., RF-VEN-059, RN-VEN-023 · T04b-p2: encab., §7, §8 | Cubierta |
| §15 Implicancias para CoopApps (L842) | M05, M11 | M05: encab., RF-FAC-007, RF-FAC-009 … · M11: encab., RN-VEN-023 | Cubierta |
| §16 Dudas abiertas (L866) | M05, M11 | M05: encab., RF-FAC-007, RF-FAC-122 … · M11: encab., RF-VEN-107, RF-VEN-115 … | Cubierta |

### 12.4 RN-03 — `03-afip-facturacion-electronica-e-iva.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — AFIP/ARCA: facturación electrónica, padrón e IVA (L1) | M06, T06 | ver subsecciones | Cubierta (por subsecciones) |
| Fuentes revisadas (§03) (L7) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §1 Dos modos de operación (L29) | M06 | M06: encab., RF-FIS-154, §6.1 … | Cubierta |
| §2 Autenticación WSAA (L36) | M06, T06 | M06: encab., §1, §6.1 · T06: encab., RF-INT-006, §12.4 … | Cubierta |
| › §2.1 Configuración (L38) | M06, T06 | M06: RF-FIS-024, RF-FIS-028, RN-FIS-003 … · T06: RF-INT-024, RF-INT-028, RN-INT-020 … | Cubierta |
| › §2.2 Ticket de acceso y caché (L56) | M06, T06 | M06: RF-FIS-027, RF-FIS-029, RF-FIS-030 … · T06: RF-INT-022, RF-INT-027, RF-INT-036 … | Cubierta |
| › §2.3 Avisos de vencimiento (L84) | M06, T06 | M06: RF-FIS-026, RN-FIS-008 · T06: RF-INT-025, RN-INT-021 | Cubierta |
| §3 Autorización con CAE (FECAESolicitar) (L88) | M06, T06 | M06: encab., §1, §6.2 · T06: §12.4, FI-INT-01, RN-INT-020 | Cubierta |
| › §3.1 Cola de pendientes y disparadores (L90) | M06, T06 | M06: RF-FIS-035, RF-FIS-039, RF-FIS-040 … · T06: RF-INT-042 | Cubierta |
| › §3.2 Bloqueo y validaciones previas (L106) | M06 | M06: RF-FIS-041, RN-FIS-020, RN-FIS-021 … | Cubierta |
| › §3.3 Agrupación en lotes (L125) | M06 | M06: RF-FIS-054, RN-FIS-024, §21 | Cubierta |
| › §3.4 Armado del detalle (`GetDetRequest` para `FACTURAS`, `:2349-2627`) (L139) | M06 | M06: RF-FIS-017, RF-FIS-043, RF-FIS-044 … | Cubierta |
| › §3.5 Respuesta, errores y reintentos (L200) | M06 | M06: RF-FIS-037, RF-FIS-051, RF-FIS-052 … | Cubierta |
| › §3.6 Consultas auxiliares (L218) | M06 | M06: RF-FIS-004, RF-FIS-023, RF-FIS-030 … | Cubierta |
| › §3.7 Inconsistencias (conciliación contra AFIP) (L225) | M06 | M06: RF-FIS-059, RN-FIS-048, RN-FIS-049 … | Cubierta |
| §4 CAEA, CAI y CESP (L238) | M06, T06 | M06: encab., §1, §6.3 · T06: encab., §12.4, CTR-INT-19 … | Cubierta |
| › §4.1 Qué autorización recibe cada comprobante al emitirse (L240) | M06 | M06: RF-FIS-034, RF-FIS-061, RF-FIS-066 … | Cubierta |
| › §4.2 CESP (L260) | M06 | M06: RF-FIS-071, RF-FIS-072, RF-FIS-074 … | Cubierta |
| › §4.3 CAEA (L273) | M06 | M06: RF-FIS-065, RF-FIS-067, RF-FIS-068 … | Cubierta |
| › §4.4 CAI (L279) | M06 | M06: RF-FIS-036, RN-FIS-062 | Cubierta |
| §5 Padrón de contribuyentes (L283) | M06, T06 | M06: encab., RF-FIS-015, RF-FIS-016 … · T06: encab., §12.4, CTR-INT-05 … | Cubierta |
| §6 Carpetas IN/OUT (modo solo factura electrónica) (L303) | M06, T06 | M06: encab., RF-FIS-154, RF-FIS-155 … · T06: encab. | Cubierta |
| §7 Mapeos a códigos AFIP (L322) | M06 | M06: encab., RF-FIS-061, RF-FIS-075 … | Cubierta |
| §8 Libro IVA Ventas (L339) | M06 | M06: encab., §6.6, CTR-FIS-02 | Cubierta |
| › §8.1 Criterios y tipos de informe (L341) | M06 | M06: RF-FIS-112, RF-FIS-113, RN-FIS-086 … | Cubierta |
| › §8.2 Reglas de armado (L353) | M06 | M06: RF-FIS-114, RF-FIS-115, RF-FIS-116 … | Cubierta |
| › §8.3 Exportaciones (`ExportarArchivos`, `:2463-2518`; `TipoArchivos.cs`) (L366) | M06 | M06: RF-FIS-093, RF-FIS-119, RF-FIS-120 … | Cubierta |
| §9 Libro IVA Compras y Libro IVA Digital (L390) | M06 | M06: encab., RF-FIS-118, RF-FIS-119 … | Cubierta |
| §10 Comprobantes de administración pública (L401) | M06 | M06: encab., RF-FIS-151, RF-FIS-152 … | Cubierta |
| §11 Resumen de parámetros `Busca_V2_*` (L410) | M06 | M06: encab. | Débil (solo encabezado) |
| §12 Reglas adicionales (segunda pasada) (L435) | M06 | M06: encab., CTR-FIS-05 | Cubierta |
| › §12.1 Mapeo a códigos ARCA tal como lo implementa el código (L439) | M06 | M06: RF-FIS-022, RF-FIS-043, RF-FIS-046 … | Cubierta |
| › §12.2 Tributos: conclusión sobre el mapeo de Id (L482) | M06 | M06: RF-FIS-047, RF-FIS-093, RN-FIS-035 … | Cubierta |
| › §12.3 `clsFacturacionElectronica`: métodos y detalles no documentados (L503) | M06 | M06: RF-FIS-045, RF-FIS-051, RF-FIS-055 … | Cubierta |
| › §12.4 Proxies SOAP: qué se usa realmente (L515) | M06 | M06: RF-FIS-004, RF-FIS-030, RF-FIS-050 … | Cubierta |
| › §12.5 `clsLibroIVA`: armado de informes (L541) | M06 | M06: RF-FIS-095, RF-FIS-113, RF-FIS-115 … | Cubierta |
| › §12.6 `clsLibroIVAdigital`: informes y detalles de la comparación (L555) | M06 | M06: RF-FIS-122, RF-FIS-123, §6.6 … | Cubierta |
| › §12.7 `clsFacturacionVarios`: talones sumados, configuración de impuestos y otros (L566) | M06 | M06: RF-FIS-142, RF-FIS-152, RN-FIS-117 … | Cubierta |
| Implicancias para CoopApps (§03) (L581) | — | — | **SIN COBERTURA** |
| Dudas abiertas (§03) (L611) | — | — | **SIN COBERTURA** |

### 12.5 RN-04 — `04-mora-intereses-y-corte.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Mora, intereses y corte (L1) | M08, T04b-p3, T10, T09 | ver subsecciones | Cubierta (por subsecciones) |
| §1 Mapa general (L7) | M08 | M08: encab., §1, RN-MOR-001 | Cubierta |
| §2 Modelo de datos involucrado (L24) | M08 | M08: encab. | Débil (solo encabezado) |
| §3 Recargo entre vencimientos al emitir la factura (L46) | M08 | ver subsecciones | Cubierta (por subsecciones) |
| › §3.1 Cálculo de `TOTAL2..TOTAL4` (L48) | M08 | M08: RF-MOR-011, RF-MOR-012 | Cubierta |
| › §3.2 Qué pasa con ese recargo al cobrar (L65) | M08 | M08: RF-MOR-017, RN-MOR-034 | Cubierta |
| › §3.3 Detalle de cada variante (segunda pasada) (L69) | M08 | M08: RF-MOR-013, RF-MOR-014, RN-MOR-011 … | Cubierta |
| §4 Recargo por mora al cobrar (motor principal) (L81) | M08 | M08: encab., RF-MOR-004, RF-MOR-207 … | Cubierta |
| › §4.1 Variables de cálculo (L83) | M08 | M08: RF-MOR-032, RF-MOR-033, RN-MOR-018 … | Cubierta |
| › §4.2 Habilitación del interés por factura (L115) | M08 | M08: RF-MOR-008, RF-MOR-022, RF-MOR-030 … | Cubierta |
| › §4.3 Algoritmo `Get_Recargo(InfoInteres, variables)` (`clsCobranzas.cs:1814-2102`) (L127) | M08 | M08: RF-MOR-002, RF-MOR-005, RF-MOR-006 … | Cubierta |
| › §4.4 Diferimiento del interés (L169) | M08 | M08: RF-MOR-020, RF-MOR-041, RF-MOR-042 … | Cubierta |
| › §4.5 Validaciones de carga de tasas y descuentos (segunda pasada) (L192) | M08 | M08: RN-MOR-003, RN-MOR-010 | Cubierta |
| §5 Proceso masivo "Intereses a facturar" (`clsFacturarIntereses`) (L202) | M08 | M08: encab., REP-MOR-15 | Cubierta |
| › §5.1 Filtros y variantes (L204) | M08 | M08: RF-MOR-049 | Cubierta |
| › §5.2 Selección de facturas (L217) | M08 | M08: RF-MOR-050, RN-MOR-041 | Cubierta |
| › §5.3 Variante estándar (`Get_InteresEstandar`, `:846-995`) (L221) | M08 | M08: RF-MOR-051, RF-MOR-052, RF-MOR-053 … | Cubierta |
| › §5.4 Variante CAU (`:245-432`) (L234) | M08 | M08: RF-MOR-054, RN-MOR-044, PRM-MOR-056 … | Cubierta |
| › §5.5 Generación de los comprobantes de interés (L243) | M08 | M08: RF-MOR-056, RF-MOR-057, RN-MOR-046 … | Cubierta |
| › §5.6 Precisiones (segunda pasada) (L254) | M08 | M08: RF-MOR-050, RF-MOR-055, RF-MOR-058 … | Cubierta |
| §6 Otros puntos de interés y bloqueo (L271) | M08 | M08: encab., RF-MOR-038, RF-MOR-040 … | Cubierta |
| §7 Gestión de mora (L280) | M08 | M08: encab., CTR-MOR-02 | Cubierta |
| › §7.1 Estados y enums (`ReglasNegocio.Cobranzas/clsGestionMora.cs`) (L282) | M08, T09 | M08: RF-MOR-088, RF-MOR-089, RF-MOR-095 … · T09: encab., RF-COM-164 | Cubierta |
| › §7.2 Selección de candidatos (`ReglasNegocio.Titulares/clsCirculares.cs`) (L289) | M08 | M08: RF-MOR-077, RF-MOR-078, RF-MOR-079 … | Cubierta |
| › §7.3 Avance de instancias (L299) | M08, T09 | M08: RF-MOR-063, RF-MOR-076, RF-MOR-083 … · T09: RN-COM-058 | Cubierta |
| › §7.4 Tratamiento de morosos: corte (L331) | M08 | M08: RF-MOR-099, RF-MOR-100, RF-MOR-101 … | Cubierta |
| › §7.5 Reconexión (L346) | M08 | M08: RF-MOR-122, RF-MOR-123, RF-MOR-126 … | Cubierta |
| › §7.6 Consultas, canales y órdenes de trabajo (segunda pasada, `clsGestionMora`) (L366) | M08, T09 | M08: RF-MOR-090, RF-MOR-095, RF-MOR-098 … · T09: encab., RF-COM-115, RF-COM-175 … | Cubierta |
| §8 Financiación y planes de pago (L406) | M08 | M08: encab., §22.4 | Cubierta |
| › §8.1 Planes (`PLAN_CUO`, `DatosPlanCuotas.cs`) (L408) | M08 | M08: RF-MOR-143, RF-MOR-164, RF-MOR-171 … | Cubierta |
| › §8.2 Armado de cuotas (`clsFormasDePago`, `:337-613`) (L435) | M08 | hereda de §8 | Cubierta (por sección) |
| › §8.3 Registro del convenio (`ReglasNegocio.Cobranzas/clsFinanciacion.cs`) (L441) | M08 | M08: RF-MOR-146, RF-MOR-148, RF-MOR-149 … | Cubierta |
| › §8.4 Datos del plan (`DatosPlanCuotas.CargarDatosPlan`, segunda pasada) (L455) | M08 | M08: RF-MOR-163, RF-MOR-171, RF-MOR-172 … | Cubierta |
| › §8.5 Fórmulas de cada sistema de amortización (`clsCaidaCuotas`, segunda pasada) (L482) | M08 | M08: RF-MOR-143, RN-MOR-105, RN-MOR-106 … | Cubierta |
| › §8.6 Armado de cuotas: entrega, quitas, IVA y sellado (`clsFormasDePago.GetCuotas`, segunda pasada) (L514) | M08 | M08: RF-MOR-144, RF-MOR-150, RF-MOR-164 … | Cubierta |
| › §8.7 Refinanciación (segunda pasada) (L560) | M08 | M08: RF-MOR-152, RF-MOR-158, RN-MOR-115 … | Cubierta |
| › §8.8 Ajustes de cuota al facturarla: índice, cotización y adelanto (segunda pasada) (L576) | M08 | M08: RF-MOR-159, RF-MOR-161, RF-MOR-176 … | Cubierta |
| › §8.9 Validaciones y parámetros de financiación (segunda pasada) (L592) | M08 | M08: RF-MOR-016, RF-MOR-148, RF-MOR-151 | Cubierta |
| › §8.10 Anulación de convenios (detalle, segunda pasada) (L617) | M08 | M08: RF-MOR-160, RF-MOR-215, RN-MOR-121 | Cubierta |
| › §8.11 Recalcular cuotas por cambio de situación fiscal (segunda pasada) (L636) | M08 | M08: RF-MOR-162 | Cubierta |
| › §8.12 Consultas e informes de financiación (segunda pasada) (L647) | M08, T10 | M08: RF-MOR-155, RF-MOR-169, RF-MOR-177 … · T10: encab., RN-BIA-052, REP-MOR-004 | Cubierta |
| › §8.13 Caída o caducidad del plan (L674) | M08 | M08: §3, RF-MOR-156, RN-MOR-123 | Cubierta |
| §9 Prescripción de deuda (L685) | M08, T10 | M08: encab., RF-MOR-194, RF-MOR-195 … · T10: encab., RN-BIA-056, RN-BIA-052 … | Cubierta |
| §10 Informes de mora (`ReglasNegocio.Cobranzas/clsInformes_Mora.cs`) (L690) | M08, T10 | M08: encab., RF-MOR-114, RF-MOR-198 … · T10: encab., RN-BIA-057, CTR-BIA-14 … | Cubierta |
| §11 Tabla de parámetros (L710) | M08, T04b-p3 | M08: encab., CTR-MOR-01 · T04b-p3: encab., §2, CTR-CFG-P3-02 … | Cubierta |
| §12 Implicancias para CoopApps (L775) | M08 | M08: encab., RF-MOR-001, RF-MOR-007 … | Cubierta |
| §13 Dudas abiertas (L788) | M08 | M08: encab., RF-MOR-009, RF-MOR-027 … | Cubierta |
| §14 Revisión de métodos (segunda pasada) (L809) | M08 | M08: encab., RF-MOR-194 | Cubierta |

### 12.6 RN-05 — `05-cobranzas-cajas-y-entes-recaudadores.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Cobranzas, cajas y entes recaudadores (L1) | M07, T10, M18, M17, M05, T04b-p3, M15 | ver subsecciones | Cubierta (por subsecciones) |
| §1 Panorama (L16) | M07 | M07: RF-COB-031 | Cubierta |
| §2 Caja: apertura, operación y cierre (L37) | M07 | M07: RF-COB-055, RF-COB-057, RF-COB-068 … | Cubierta |
| §3 Cobro en ventanilla (L58) | M07, M17, M15 | ver subsecciones | Cubierta (por subsecciones) |
| › §3.1 Consulta de deuda y orden de los comprobantes (L60) | M07 | M07: RF-COB-060 | Cubierta |
| › §3.2 Orden de aplicación obligatorio (validaciones de caja) (L72) | M07 | M07: RF-COB-013, RF-COB-018, RF-COB-034 … | Cubierta |
| › §3.3 Pago parcial, entrega y anticipos (L88) | M07 | M07: RF-COB-033, RF-COB-051, RF-COB-062 … | Cubierta |
| › §3.4 Registración del pago (`RegistrarPago`) (L101) | M07, M15 | M07: RF-COB-041, RF-COB-065, RF-COB-076 … · M15: encab., RF-CON-067, CTR-CON-17 | Cubierta |
| › §3.5 Anulación de una cobranza (L142) | M07, M17 | M07: RF-COB-057, RF-COB-079, RN-COB-003 … · M17: RF-INS-042 | Cubierta |
| §4 Entes recaudadores: arquitectura común (L167) | M07 | M07: §22.2 | Cubierta |
| › §4.1 Configuración del ente (`BANCOS`) (L169) | M07 | M07: RF-COB-098 | Cubierta |
| › §4.2 Selección del formato por reflexión (L190) | M07 | M07: RF-COB-099, RN-COB-079 | Cubierta |
| › §4.3 Identificador de comprobante (prefijo de 2 dígitos) (L197) | M07 | M07: RF-COB-100, RF-COB-155, RF-COB-185 … | Cubierta |
| › §4.4 Exportación (envío de deuda) — `Exportador_Base` (L218) | M07 | M07: RF-COB-101, RF-COB-102, RF-COB-127 … | Cubierta |
| › §4.5 Importación (rendición) — `Importador_Base` (L231) | M07 | M07: RF-COB-106, RN-COB-006, RN-COB-085 | Cubierta |
| › §4.6 Validaciones por comprobante (`LoadComprobantes_Simple`, `Importador_Base.cs:1884-2022`) (L243) | M07 | M07: RF-COB-012, RF-COB-049, RF-COB-107 … | Cubierta |
| › §4.7 Registración de la rendición y conciliación (L262) | M07, M15 | M07: RF-COB-108, RF-COB-109, RF-COB-114 … · M15: encab., RF-CON-067, CTR-CON-17 | Cubierta |
| §5 Entes y formatos genéricos importantes (L281) | M07 | M07: RF-COB-099, §22.2 | Cubierta |
| › §5.1 Red Link (pago por home banking o cajero de la red Link) (L283) | M07 | M07: RF-COB-103 | Cubierta |
| › §5.2 SIRO (Banco Roela) — archivo y API (L328) | M07 | M07: RF-COB-105, RN-COB-084, RN-COB-096 | Cubierta |
| › §5.3 Banelco (PagoMisCuentas), Pago Fácil, Rapipago y Cobro Express (L383) | M07 | M07: RN-COB-097 | Cubierta |
| › §5.4 Pagos duplicados y anticipos en entes (L396) | M07 | M07: RF-COB-049, RN-COB-030, CTR-COB-06 | Cubierta |
| §6 Débito automático (tarjetas y CBU) (L407) | M07 | ver subsecciones | Cubierta (por subsecciones) |
| › §6.1 Adhesión (datos en la cuenta) (L409) | M07 | M07: RF-COB-112, RF-COB-119, RF-COB-120 … | Cubierta |
| › §6.2 Presentación y rendición de débitos (L429) | M07 | M07: RF-COB-099, RF-COB-122, RF-COB-123 … | Cubierta |
| §7 Pagos online y entidades digitales (L452) | M07 | ver subsecciones | Cubierta (por subsecciones) |
| › §7.1 Modelo común `EntidadDigital` (L454) | M07 | M07: RF-COB-134, RF-COB-136, RN-COB-117 | Cubierta |
| › §7.2 Pagos360 (L477) | M07 | M07: RF-COB-137, RN-COB-006, RN-COB-113 … | Cubierta |
| › §7.3 MercadoPago (L507) | — | — | **SIN COBERTURA** |
| › §7.4 Otras pasarelas (L519) | — | — | **SIN COBERTURA** |
| §8 Tabla por cooperativa (L539) | — | — | **SIN COBERTURA** |
| §9 Detalle especial: Laguna Larga (LAG) (L646) | — | — | **SIN COBERTURA** |
| › §9.1 Qué hay en el código (L648) | — | — | **SIN COBERTURA** |
| › §9.2 Rendición Red Link de LAG (`Entidades.LAG/Red_Link.cs`) (L656) | — | — | **SIN COBERTURA** |
| › §9.3 Lo que la DEMO y el código sugieren para la configuración de LAG (L700) | — | — | **SIN COBERTURA** |
| §10 Parámetros `Nucleo.Busca_V2_*(N)` relacionados (L710) | M17, T04b-p3 | M17: encab. · T04b-p3: encab., §2, §5.13 … | Cubierta |
| §11 Implicancias para CoopApps (L772) | M07 | M07: RF-COB-031, RF-COB-098, RF-COB-099 … | Cubierta |
| §12 Dudas abiertas (L786) | — | — | **SIN COBERTURA** |
| §13 Reglas adicionales (segunda pasada) (L800) | M07, T10, M18, M17, M05 | ver subsecciones | Cubierta (por subsecciones) |
| › §13.1 Caja: apertura, cierre, arqueo y diferencias (L804) | M07 | M07: RF-COB-016, RF-COB-056, RF-COB-080 … | Cubierta |
| › §13.2 Botonera y validaciones de la caja (`Cobranzas/clsCobranzaCaja.cs`) (L836) | M07 | M07: RF-COB-009, RF-COB-012, RF-COB-034 … | Cubierta |
| › §13.3 Pago a proveedor y otras operaciones dentro del cobro (`Cobranzas/clsRegistracionCobranza.cs`) (L861) | M05, M07 | M05: RN-FAC-161 · M07: RF-COB-072, RF-COB-087, RN-COB-060 | Cubierta |
| › §13.4 Anulación de cobros y sus efectos (`Cobranzas/clsAnulacionCobranza.cs`) (L872) | M07, M17 | M07: RF-COB-079, RN-COB-003, RN-COB-016 … · M17: RF-INS-042 | Cubierta |
| › §13.5 Imputación automática, anticipos y créditos (`Cobranzas/clsCobranzas.cs`) (L893) | M07 | M07: RF-COB-014, RF-COB-017, RF-COB-040 … | Cubierta |
| › §13.6 Convenios de pago desde la caja y cuotas (`clsFormasDePago`, `clsCaidaCuotas`, `clsDeudaCuot... (L921) | M07 | M07: RF-COB-136, RN-COB-011, RN-COB-117 | Cubierta |
| › §13.7 Entidades digitales: reglas adicionales (`EntidadDigital` y subclases) (L930) | M07 | M07: RF-COB-068, RF-COB-129, RF-COB-146 … | Cubierta |
| › §13.8 Venta de energía prepaga en la caja (`Cobranzas/clsPrepaga.cs`) (L981) | M07 | M07: RF-COB-075, RF-COB-183 | Cubierta |
| › §13.9 Cobranza por cuenta de terceros (`Cobranzas/clsTerceros.cs`) (L1002) | M07, M18 | M07: RF-COB-177, RN-COB-142 · M18: encab. | Cubierta |
| › §13.10 Entes recaudadores: reglas adicionales (L1013) | M07 | M07: RF-COB-099, RF-COB-103, RF-COB-111 … | Cubierta |
| › §13.11 Informes de cobranzas (`Cobranzas/clsInformes_Cobranzas.cs`) (L1046) | M07, T10 | M07: RF-COB-007, RF-COB-189, RN-COB-012 · T10: encab., RF-BIA-094, RF-BIA-095 … | Cubierta |
| › §13.12 Cheques en la cobranza (resumen transversal) (L1056) | M07 | M07: RF-COB-162 | Cubierta |
| › §13.13 Implicancias adicionales para CoopApps (L1062) | M07 | M07: RF-COB-040, RF-COB-079, RF-COB-080 … | Cubierta |

### 12.7 RN-06 — `06-titulares-servicios-medidores-y-consumos.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Titulares, servicios, medidores y consumos (L1) | M01, M03, T10, M09, T11, M04, M02 (+3) | ver subsecciones | Cubierta (por subsecciones) |
| §1 Alcance y fuentes (L14) | M01 | M01: encab. | Débil (solo encabezado) |
| §2 Jerarquía del padrón (L30) | M01, M17 | M01: encab., RF-PER-022, RF-PER-035 … · M17: encab., RF-INS-002, RF-INS-007 … | Cubierta |
| §3 Altas y validaciones (L52) | M01, M02 | M01: encab., §6.11 · M02: encab., CTR-CAT-01 | Cubierta |
| › §3.1 Validaciones del titular (L54) | M01, M02, M17 | M01: RF-PER-019, RF-PER-020, RF-PER-024 … · M02: RF-CAT-076, RN-CAT-030, RF-CAT-016 … · M17: RN-INS-049 | Cubierta |
| › §3.2 Validación de un servicio (`ValidarServicio`, `clsSocios.cs:2576-2681`) (L67) | M01, M02 | M01: RF-PER-092, RF-PER-101, RN-PER-057 … · M02: RF-CAT-018, RF-CAT-020, RF-CAT-071 … | Cubierta |
| › §3.3 Configuración por servicio (L81) | M01, M02, M18, T07 | M01: RN-PER-123 · M02: RF-CAT-010, RF-CAT-016, RF-CAT-017 … · M18: encab., RF-SOC-002, RF-SOC-048 … · T07: RN-MIG-052 | Cubierta |
| › §3.4 Guardado de la cuenta y sus servicios (L90) | M01, M02 | M01: RN-PER-124 · M02: RN-CAT-033, RF-CAT-016, RN-CAT-020 | Cubierta |
| › §3.5 Altas automáticas de servicios (`ALTASEAU`) (L100) | M01, M02, M18 | M01: RN-PER-125 · M02: RF-CAT-020, RF-CAT-086, RN-CAT-035 … · M18: encab., RF-SOC-029, RN-SOC-016 | Cubierta |
| › §3.6 Conceptos a cobrar por conexión (`CONEXION`) (L108) | M01, M02 | M01: RN-PER-126 · M02: RF-CAT-050, RN-CAT-037, RF-CAT-016 … | Cubierta |
| §4 Estados del servicio, conexión y desconexión (L114) | M01, M02, M18 | M01: encab., §6.11, RN-PER-127 … · M02: encab. · M18: encab., RF-SOC-019, RN-SOC-008 … | Cubierta |
| › §4.1 Estados (`CondicionServicio`, `Titulares/CondicionServicio.cs`) (L116) | M02 | M02: RF-CAT-063, RN-CAT-018, RN-CAT-019 … | Cubierta |
| › §4.2 Operaciones (L130) | M02 | M02: RF-CAT-019, RF-CAT-090, RN-CAT-039 … | Cubierta |
| › §4.3 Trámites masivos (`clsTramites`, `Titulares/clsTramites.cs:543-636`) (L151) | M02, M09 | M02: RF-CAT-087, PAN-CAT-17, RF-CAT-063 … · M09: encab., RF-CRM-085 | Cubierta |
| §5 Bajas de socio (L157) | M01, M02, M09, M17, M18 | M01: encab., RF-PER-043, RF-PER-045 … · M02: encab., RN-CAT-065, RF-CAT-088 · M09: RN-CRM-010 · M17: encab., RF-INS-010, RF-INS-011 … · (+1 anexos) | Cubierta |
| §6 Cambios de categoría y clase (L165) | M01, M02 | M01: encab., RF-PER-120, §6.11 … · M02: encab., RF-CAT-019, RF-CAT-055 … | Cubierta |
| §7 Transferencias (`TRANSFER`, `TipoTransferencia`: 1 cuenta, 2 servicio, 3 capital) (L179) | M01, M02, M17, M18 | M01: encab., RF-PER-132, RF-PER-133 … · M02: encab., RF-CAT-084, RN-CAT-051 … · M17: encab., RF-INS-049, RF-INS-050 … · M18: encab., RF-SOC-022, RF-SOC-107 … | Cubierta |
| §8 Domicilios (L192) | M01, M02 | M01: encab., RF-PER-069, RF-PER-083 … · M02: encab., RF-CAT-085, RN-CAT-055 … | Cubierta |
| §9 Capital social y acciones (`clsSocios_Capital`, `Titulares/clsSocios_Capital.cs`) (L201) | M01, M02, M17 | M01: encab., §6.11, RN-PER-129 · M02: §6.C.16 · M17: encab., §3, RF-INS-030 … | Cubierta |
| §10 Adherentes y beneficiarios (L218) | M01, M02, M17, M18, T07 | M01: encab., RF-PER-009, RF-PER-109 … · M02: encab., RF-CAT-022, RF-CAT-080 … · M17: RF-INS-013, RN-INS-048 · M18: encab., RF-SOC-001, RF-SOC-011 … · (+1 anexos) | Cubierta |
| §11 Grupos de facturación (L229) | M01, M02 | M01: encab., RF-PER-069, RN-PER-057 · M02: encab., RF-CAT-020, RN-CAT-024 | Cubierta |
| §12 Medidores (L235) | M01, M03 | M01: §22.4 · M03: encab., §22.3 | Cubierta |
| › §12.1 Datos del medidor en el servicio (L237) | M03 | M03: RF-MED-003, RF-MED-024, RN-MED-002 … | Cubierta |
| › §12.2 Mediciones múltiples (`MEDSOC`) (L255) | M03 | M03: RF-MED-004, RF-MED-013, RF-MED-014 … | Cubierta |
| › §12.3 Alta, cambio y retiro de medidor (L263) | M03 | M03: RF-MED-016, RF-MED-017, RF-MED-018 … | Cubierta |
| §13 Rutas y toma de lecturas (L275) | M03 | M03: encab., §22.3 | Cubierta |
| › §13.1 Rutas (`CONNRUTA`, `Varios.Telemed/clsRutas.cs:181-394`) (L277) | M03 | M03: RF-MED-025, RF-MED-026, RN-MED-023 … | Cubierta |
| › §13.2 Ciclo de vida de una ruta (`IMP_WORK.CONFIRMADO`) (L290) | M03 | M03: RF-MED-029, RF-MED-030, RF-MED-035 … | Cubierta |
| › §13.3 Medios de toma (L312) | M03 | M03: RF-MED-033, RF-MED-039, RF-MED-044 … | Cubierta |
| §14 Cálculo y validación del consumo (L325) | M03 | M03: encab., §22.3 | Cubierta |
| › §14.1 Fórmula (`clsTelemed.CalcularConsumo`, `Varios.Telemed/clsTelemed.cs:229-253`) (L327) | M03 | M03: RF-MED-061, RF-MED-062, RN-MED-004 … | Cubierta |
| › §14.2 Validaciones de la lectura (`CheckearLectura`, `clsTelemed.cs:2136-2180`) (L342) | M03 | M03: RN-MED-047, RN-MED-048, RN-MED-049 … | Cubierta |
| › §14.3 Consumo anómalo y promedios (L355) | M03 | M03: RF-MED-064, RN-MED-073, RN-MED-076 … | Cubierta |
| §15 Estimados y ajuste posterior (L362) | M03 | M03: encab., RF-MED-074, RF-MED-076 … | Cubierta |
| §16 División, prorrateo, gas y distribución de consumos (L380) | M03, M04 | M03: encab., §22.3 · M04: encab., §6.19 | Cubierta |
| › §16.1 División por período (`clsConsumos.DividirConsumos`, `Consumos/clsConsumos.cs:148`) (L382) | M03, M04 | M03: RF-MED-082, RF-MED-083, RN-MED-091 … · M04: RN-TAR-196, PRM-TAR-140 | Cubierta |
| › §16.2 Corrección de gas (`CorregirConsumoGAS`, `clsConsumos.cs:1305-1337`) (L395) | M03, M04 | M03: RF-MED-063, RN-MED-069, CTR-MED-06 · M04: RN-TAR-035 | Cubierta |
| › §16.3 Distribución de consumos (`DST_CONSUMO`, `clsConsumos.cs:2348-2697`) (L406) | M03, M04 | M03: RF-MED-085, RN-MED-088, RN-MED-097 … · M04: RN-TAR-197 | Cubierta |
| §17 Demanda y transgresiones (L418) | M03, M04 | M03: encab., RF-MED-089, RF-MED-090 … · M04: encab., §6.12, RN-TAR-110 … | Cubierta |
| §18 Energía inyectada (generación distribuida) (L432) | M03, M04 | M03: encab., RF-MED-096, RN-MED-003 … · M04: encab., RN-TAR-038, §6.19 … | Cubierta |
| §19 Telemedición (L441) | M03 | M03: encab., §13.1, §15 … | Cubierta |
| › §19.1 Arquitectura (L443) | M03 | M03: RF-MED-103, RF-MED-105, RF-MED-107 … | Cubierta |
| › §19.2 Proveedores (L456) | M03 | M03: RF-MED-004, RF-MED-090, RF-MED-104 … | Cubierta |
| §20 Parámetros V2 relacionados (L483) | M01, M03 | M01: encab. · M03: encab., RN-MED-009, RN-MED-010 … | Cubierta |
| §21 Implicancias para CoopApps (L554) | M01, M03 | M01: encab., RF-PER-170 · M03: encab., §1, RF-MED-013 … | Cubierta |
| §22 Dudas abiertas (L577) | M01, M03 | M01: encab. · M03: encab., §22.3 | Cubierta |
| §23 Reglas adicionales (segunda pasada) (L605) | M01, M03 | M01: encab. · M03: §22.3 | Cubierta |
| › §23.1 `Titulares/clsSocios.cs` — padrón, cuentas y servicios (L609) | M01, M03, M09 | M01: RF-PER-034, RF-PER-053, RF-PER-055 … · M03: encab., RF-MED-018, RF-MED-019 … · M09: encab., RF-CRM-080, RF-CRM-113 … | Cubierta |
| › §23.2 `Titulares/OpcionesEspeciales.cs` — operaciones especiales de corrección (L709) | M01, M03 | M01: RF-PER-009, RF-PER-057, RF-PER-120 … · M03: RN-MED-008 | Cubierta |
| › §23.3 `Titulares/clsTramites.cs` — trámites y acciones automáticas (amplía §4.3) (L721) | M01, M09, T11 | M01: RF-PER-130 · M09: encab., RF-CRM-080, RF-CRM-081 … · T11: encab., RF-WFL-073, RF-WFL-075 … | Cubierta |
| › §23.4 `Titulares/clsSocios_Capital.cs` (amplía §9) (L732) | M01, M03 | hereda de §23 | Cubierta (por sección) |
| › §23.5 `Titulares/clsPersonas.cs` y `Titulares/clsServicios.cs` (L748) | M01, M03 | M01: RF-PER-018, RF-PER-058, RF-PER-155 · M03: RF-MED-010 | Cubierta |
| › §23.6 `Servicios/clsServicio.cs`, `Servicios/clsCuentas.cs` y división de consumos (L770) | M01, M03 | M01: RF-PER-059, RF-PER-070, RF-PER-083 … · M03: encab., RF-MED-014, RF-MED-082 … | Cubierta |
| › §23.7 `Consumos` — registración, controles e informes (L799) | M01, M03, T10 | M01: §22.4 · M03: encab., RF-MED-129, RF-MED-027 … · T10: encab., RF-BIA-098, RN-BIA-047 … | Cubierta |
| › §23.8 Otras clases de `Titulares` (L837) | M01, M03 | hereda de §23 | Cubierta (por sección) |
| › §23.9 Lo que quedó fuera de esta pasada (L842) | M01, M03 | hereda de §23 | Cubierta (por sección) |

### 12.8 RN-07 — `07-tecnica-reclamos-gis-y-telefonia.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Técnica, reclamos, GIS/redes, tickets, actividades y telefonía (L1) | M09, M10, T04b-p4, M04, T09, T11, M08 (+1) | ver subsecciones | Cubierta (por subsecciones) |
| §0 Mapa de fuentes (L10) | M10 | Descartada: metadato de la fuente | Descartada (motivo en IDs) |
| §1 Órdenes de trabajo (tabla `TECNICA`) (L36) | M09, M10 | M09: RF-CRM-005, RF-CRM-020, RF-CRM-046 … · M10: encab. | Cubierta |
| › §1.1 Concepto y tipos (L38) | M10 | M10: RF-TEC-022, RF-TEC-029, RF-TEC-170 … | Cubierta |
| › §1.2 Operaciones (tabla `TRANSAC`) — "qué se hace" (L54) | M10 | M10: RF-TEC-023, RF-TEC-024 | Cubierta |
| › §1.3 Estados y circuito (L74) | M10 | M10: RF-TEC-025, RF-TEC-026, RF-TEC-028 … | Cubierta |
| › §1.4 Efectos del cierre de una OT de trabajo (pseudocódigo) (L107) | M10 | M10: RF-TEC-027, RF-TEC-036, RF-TEC-038 … | Cubierta |
| › §1.5 Órdenes encadenadas ("Altas y bajas automáticas", tabla `ALTASEAU`) (L155) | M10 | M10: RF-TEC-047, RF-TEC-048 | Cubierta |
| › §1.6 Numeración visible (`COD_SLS`) (L163) | M10 | M10: RF-TEC-029, CTR-TEC-19 | Cubierta |
| › §1.7 Asignación: responsables, cuadrillas, móviles, captores (L169) | M10 | M10: RF-TEC-030, RF-TEC-031, RF-TEC-052 … | Cubierta |
| › §1.8 Materiales e impacto en stock (L180) | M10 | M10: RF-TEC-064, RF-TEC-065, RF-TEC-066 … | Cubierta |
| › §1.9 Cargos asociados a la OT (tabla `CONEXION`, "conceptos a cobrar") (L203) | M10 | M10: RF-TEC-062, RF-TEC-063 | Cubierta |
| › §1.10 Informes técnicos (L230) | M09, M10, T10 | M09: encab., RF-CRM-022, RF-CRM-120 … · M10: RF-TEC-056, RF-TEC-224, CTR-TEC-20 … · T10: encab., RN-BIA-001, REP-TEC-025 | Cubierta |
| › §1.11 Reglas de los informes técnicos (segunda pasada) (L234) | M09, M10, T10 | M09: encab., RF-CRM-022, RF-CRM-072 … · M10: RF-TEC-016, RF-TEC-055, RF-TEC-056 … · T10: encab., RF-BIA-005, RF-BIA-026 … | Cubierta |
| §2 Reclamos (L247) | M09, M10 | M09: encab., RF-CRM-039, RF-CRM-101 … · M10: encab., RF-TEC-060, RF-TEC-061 … | Cubierta |
| §3 Factibilidades y conexiones nuevas (L262) | M10, M09 | ver subsecciones | Cubierta (por subsecciones) |
| › §3.1 Factibilidad (`FACTIBIL`, `clsFactibilidad.cs`) (L264) | M09, M10 | M09: RN-CRM-006 · M10: RF-TEC-001, RF-TEC-002, RF-TEC-003 … | Cubierta |
| › §3.2 Conexión nueva (alta de servicio) (L289) | M10 | M10: RF-TEC-001 | Cubierta |
| §4 Cortes y reconexiones desde técnica (L298) | M08, M10 | M08: encab., RF-MOR-103, RF-MOR-124 … · M10: encab., RF-TEC-049, RF-TEC-132 … | Cubierta |
| §5 Red eléctrica / GIS (L327) | M10, T11 | M10: encab., CTR-TEC-21 · T11: encab., RF-WFL-066, RF-WFL-101 … | Cubierta |
| › §5.1 Red v1: niveles (`NIV_CAPA`, `NIV_SERV`, `NIV_REDES`) (L329) | M10 | M10: RF-TEC-007, RF-TEC-155, RF-TEC-159 | Cubierta |
| › §5.2 Red genérica v2 (`REDES*`, `RedGenerica.cs`) (L339) | M10 | M10: RF-TEC-007, RF-TEC-148, RF-TEC-149 … | Cubierta |
| › §5.3 KML / Google Earth (L363) | M10 | M10: RF-TEC-160, RF-TEC-199 | Cubierta |
| › §5.4 Exportaciones "GIS" por cooperativa (`ReglasNegocio.Varios.GIS`) (L369) | M10 | M10: RF-TEC-161, RN-TEC-086, CTR-TEC-32 | Cubierta |
| › › §5.4.1 Patrón común de los exportadores (segunda pasada) (L373) | M10 | hereda de §5.4 | Cubierta (por sección) |
| › › §5.4.2 Diferencias por cooperativa (segunda pasada) (L387) | M10 | hereda de §5.4 | Cubierta (por sección) |
| §6 Tickets / mesa de ayuda (`ReglasNegocio.Varios.Tickets`) (L427) | M09, M10, T09, T11 | M09: encab., RF-CRM-024, RF-CRM-025 … · M10: encab. · T09: RN-COM-033 · T11: encab., RF-WFL-063, RF-WFL-072 … | Cubierta |
| › §6.1 Reglas adicionales de tickets (segunda pasada) (L440) | M09 | M09: encab., RF-CRM-010, RF-CRM-026 … | Cubierta |
| §7 Actividades internas (`ReglasNegocio.Actividades`) (L524) | M09, M10, T09, T11 | M09: encab., RF-CRM-220, RF-CRM-221 … · M10: encab., RF-TEC-140 · T09: RN-COM-034 · T11: encab., RF-WFL-101, RF-WFL-180 … | Cubierta |
| › §7.1 Reglas adicionales de actividades (segunda pasada) (L535) | M09 | M09: encab., RF-CRM-222, RF-CRM-225 … | Cubierta |
| §8 Telefonía (L551) | M04, M10 | M04: encab., RF-TAR-050, RF-TAR-097 … · M10: encab., §22.3 | Cubierta |
| › §8.1 Abonados, numeración y líneas (L553) | M04, M10 | M04: RN-TAR-100 · M10: RF-TEC-197, RF-TEC-198, RF-TEC-200 … | Cubierta |
| › §8.2 Plan de numeración (`CARACTER`) y claves (`CLAVES`) (L561) | M04, M10 | M04: RN-TAR-085, RN-TAR-084 · M10: RF-TEC-204 | Cubierta |
| › §8.3 Importación de CDR (L568) | M04, M10 | M04: JOB-TAR-09 · M10: RF-TEC-205, RF-TEC-206, RF-TEC-207 | Cubierta |
| › §8.4 Tasación (pseudocódigo) (L578) | M04, M10 | M04: RF-TAR-098, RN-TAR-084, RN-TAR-088 … · M10: RF-TEC-211 | Cubierta |
| › §8.5 CPP y CVLP (`LLA_CEL`, `clsCVLP.cs`) (L608) | M04, M10 | M04: RN-TAR-098, RN-TAR-083 · M10: RF-TEC-209 | Cubierta |
| › §8.6 Internacionales y larga distancia (L618) | M04, M10 | M04: RN-TAR-090 · M10: RF-TEC-209 | Cubierta |
| › §8.7 Interconexión (L624) | M04, M10 | M04: §22: M10 (liquidación entre operadores); s... · M10: RF-TEC-213 | Cubierta |
| › §8.8 Telefonía móvil (reventa Claro/Personal) — `clsTelefoniaMovil.cs` (L628) | M04, M10 | M04: RN-TAR-099, CTR-DAT-38 · M10: RF-TEC-210, §22.3 | Cubierta |
| › §8.9 Mensajería (SMS / WhatsApp / IVR) (L634) | M04, M09, T09 | M04: RF-TAR-122, RN-TAR-012, PRM-TAR-092 · M09: encab., RF-CRM-173, RF-CRM-181 … · T09: encab., RF-COM-130, RF-COM-136 … | Cubierta |
| › §8.10 Reglas adicionales de tasación y facturación telefónica (segunda pasada) (L640) | M04, M10 | M04: RF-TAR-098, RF-TAR-099, RN-TAR-085 … · M10: RF-TEC-200, RF-TEC-201, RF-TEC-202 … | Cubierta |
| Reglas adicionales (segunda pasada) (§07) (L692) | — | — | **SIN COBERTURA** |
| §9 Parámetros `Nucleo.Busca_V2_*(N)` relacionados (L734) | M09, M10, T04b-p4 | M09: encab., §22: §14 · M10: encab. · T04b-p4: encab., §2 | Cubierta |
| §10 Implicancias para CoopApps (L799) | M09, M10 | M09: encab., RF-CRM-103, RF-CRM-104 … · M10: encab., RF-TEC-022, RF-TEC-023 … | Cubierta |
| §11 Dudas abiertas (L819) | M09, M10 | M09: encab., RF-CRM-114, RN-CRM-086 … · M10: encab., RF-TEC-071, RN-TEC-009 … | Cubierta |

### 12.9 RN-08 — `08-tesoreria-contabilidad-compras-stock-sueldos.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Tesorería, contabilidad, compras, stock, fabricación y sueldos (L1) | M14, M16, M15, M13, M11, M12, T11 (+5) | ver subsecciones | Cubierta (por subsecciones) |
| Índice (§08) (L7) | — | — | Descartada (metadato de la fuente, sin requisito) |
| §1 Visión general y mecanismos transversales (L27) | M12, M13, M14, M15, M11 | ver subsecciones | Cubierta (por subsecciones) |
| › §1.1 Cierre de módulos por fecha (L29) | M11, M12, M13, M14, M15 | M11: RF-VEN-114 · M12: encab., RF-CMP-142 · M13: encab., RF-STK-030, RF-STK-093 … · M14: encab., RF-TES-027, RN-TES-009 · (+1 anexos) | Cubierta |
| › §1.2 Contabilidad desacoplada (L51) | M12, M13, M14, M15 | M12: RF-CMP-144, CTR-CMP-08 · M13: encab. · M14: encab., RF-TES-031, CTR-TES-07 · M15: encab., RF-CON-002, RF-CON-027 … | Cubierta |
| › §1.3 Identificadores compuestos (L55) | M12, M13, M14, M15 | M12: encab., RF-CMP-143, CTR-CMP-13 · M13: encab., RN-STK-025, RN-STK-071 · M14: encab., RF-TES-016, CTR-TES-10 · M15: encab., RN-CON-004, RF-CON-027 … | Cubierta |
| › §1.4 Permisos por “controles” (L65) | M12, M13, M14, M15 | M12: encab., RF-CMP-011 · M13: encab., §4, RN-STK-072 … · M14: encab., RF-TES-028, RN-TES-010 · M15: encab., RF-CON-159, RF-CON-027 … | Cubierta |
| §2 Tesorería (L71) | M14 | ver subsecciones | Cubierta (por subsecciones) |
| › §2.1 Modelo: dos libros (L73) | M14 | M14: encab., RF-TES-004, RF-TES-009 … | Cubierta |
| › §2.2 Cajas de cobranza y cierre de caja (L84) | M14 | M14: encab., RF-TES-092, RF-TES-106 … | Cubierta |
| › §2.3 Caja de pagos (L99) | M14 | M14: encab., RF-TES-107, RF-TES-108 … | Cubierta |
| › §2.4 Cheques de terceros (cartera) (L103) | M14 | M14: encab., RF-TES-044, RF-TES-062 … | Cubierta |
| › §2.5 Cheques propios (chequeras) y e-cheq (L113) | M14 | M14: encab., RF-TES-002, RF-TES-009 … | Cubierta |
| › §2.6 Tarjetas y cupones (L122) | M14 | M14: encab., RF-TES-093, RF-TES-095 … | Cubierta |
| › §2.7 Retenciones sufridas (cobranza) (L126) | M14 | M14: encab., RF-TES-101, RF-TES-102 … | Cubierta |
| › §2.8 Movimientos extraordinarios y entre bancos (L130) | M14 | M14: encab., RF-TES-014, RF-TES-020 | Cubierta |
| › §2.9 Conciliación bancaria (L134) | M14 | M14: encab., RF-TES-035, RF-TES-042 … | Cubierta |
| §3 Retenciones a proveedores (Ganancias, IIBB, IVA, SUSS) (L144) | M06, M12 | M06: encab., CTR-FIS-18 · M12: encab., RF-CMP-101 | Cubierta |
| › §3.1 Habilitación (L148) | M06 | M06: RF-FIS-097, RF-FIS-098, RN-FIS-111 | Cubierta |
| › §3.2 Base imponible (`CalcularBaseImponible`, `Retenciones.cs:216-484`) (L152) | M06, M12 | M06: RF-FIS-097, RF-FIS-098, RF-FIS-099 … · M12: RN-CMP-054 | Cubierta |
| › §3.3 Cálculo del importe (`ObtenerRetencion`, `Retenciones.cs:107-214`) (L164) | M06, M12 | M06: RF-FIS-097, RF-FIS-100, RF-FIS-101 … · M12: RF-CMP-105, RN-CMP-055 | Cubierta |
| › §3.4 Numeración y anulación (L181) | M06, M12 | M06: RF-FIS-104, RF-FIS-105, RN-FIS-113 · M12: RF-CMP-105 | Cubierta |
| › §3.5 Exportaciones (L185) | M06 | M06: RF-FIS-094, RF-FIS-107, RF-FIS-125 | Cubierta |
| §4 Órdenes de pago a proveedores (L191) | M12, M14, M11, T05 | ver subsecciones | Cubierta (por subsecciones) |
| › §4.1 Facturas pendientes y “permitir pago” (L193) | M12, M14 | M12: RF-CMP-092, RF-CMP-100, RF-CMP-122 · M14: encab., RF-TES-113 | Cubierta |
| › §4.2 Alta de la OP (`GuardarOrdenDePago`, `clsPagoFacturas.cs:175-216`) (L197) | M12, M14 | M12: RF-CMP-025, RF-CMP-082, RF-CMP-100 … · M14: encab., RF-TES-056, RF-TES-067 … | Cubierta |
| › §4.3 Firma y entrega (L210) | M11, M12, M14, T05 | M11: §4, RN-VEN-051 · M12: §4, RF-CMP-104 · M14: encab., RF-TES-008, RF-TES-117 … · T05: CTR-DAT-78 | Cubierta |
| › §4.4 Anulación (`Anular`, `:704-958`) (L217) | M12, M14 | M12: RF-CMP-086, RF-CMP-106, RF-CMP-110 … · M14: encab., RF-TES-112, RF-TES-120 … | Cubierta |
| §5 Contabilidad (L223) | M13, M14, M15, M17 | M13: CTR-STK-08 · M14: CTR-TES-10, CTR-TES-14, CTR-TES-19 · M15: encab., §1 · M17: encab., RF-INS-029, RN-INS-012 … | Cubierta |
| › §5.1 Plan de cuentas y ejercicios (L225) | M15 | M15: RF-CON-010, RF-CON-011, RF-CON-012 … | Cubierta |
| › §5.2 Asientos (`clsAsiento`) (L231) | M15 | M15: RF-CON-036, RF-CON-039, RF-CON-040 … | Cubierta |
| › §5.3 Centros de costo (“secciones”) (L241) | M15 | M15: RF-CON-015, RF-CON-068, RF-CON-083 … | Cubierta |
| › §5.4 Cierre de ejercicio (L250) | M15 | M15: RF-CON-026, RF-CON-040, RF-CON-132 … | Cubierta |
| › §5.5 Informes y balances (L260) | M15, T10 | M15: RF-CON-112, RF-CON-114, RF-CON-115 … · T10: encab., RN-BIA-040, REP-TES-001 … | Cubierta |
| §6 Asientos automáticos (“Cierre automático”) (L266) | M15 | M15: encab., §1, RF-CON-065 | Cubierta |
| › §6.1 Mecánica general (`clsCierreDiario`) (L268) | M15 | M15: RF-CON-002, RF-CON-004, RF-CON-005 … | Cubierta |
| › §6.2 Compras (`GenerarAsientoCompras`, `:2096-2114`) (L276) | M12, M15 | M12: encab., RF-CMP-144, CTR-CMP-08 · M15: RF-CON-003, RF-CON-061, RF-CON-068 … | Cubierta |
| › §6.3 Tesorería y bancos (L295) | M15 | M15: RF-CON-070, RN-CON-034, RN-CON-050 … | Cubierta |
| › §6.4 Ventas y cobranzas (referencia) (L299) | M15, M17 | M15: RF-CON-053, RF-CON-054, RF-CON-056 … · M17: encab., RF-INS-034, RF-INS-056 … | Cubierta |
| › §6.5 Stock (L303) | M13, M15, M16 | M13: encab., RF-STK-070, RF-STK-094 … · M15: RF-CON-071, RN-CON-054, RN-CON-055 … · M16: §22.5 | Cubierta |
| › §6.6 Sueldos (L307) | M15, M16 | M15: RF-CON-041, RF-CON-073, RN-CON-057 … · M16: CTR-SUE-23 | Cubierta |
| › §6.7 Fabricación (L311) | M15 | M15: RF-CON-051, RF-CON-080, RN-CON-022 … | Cubierta |
| §7 Compras: circuito SA → cotización → OC → remito → factura (L317) | M12 | M12: encab., CTR-CMP-01 | Cubierta |
| › §7.1 Estructura común (L319) | M12 | M12: RF-CMP-093, CTR-CMP-04, §21 | Cubierta |
| › §7.2 Solicitud de aprovisionamiento (SA) (L323) | M12, T11 | M12: RF-CMP-030, RF-CMP-032, RF-CMP-034 · T11: encab., RF-WFL-111, RF-WFL-113 … | Cubierta |
| › §7.3 Solicitud de cotización (L331) | M12 | M12: RF-CMP-024, RF-CMP-040, RF-CMP-041 … | Cubierta |
| › §7.4 Orden de compra (OC) (L337) | M12 | M12: RF-CMP-050, RF-CMP-052, RF-CMP-059 | Cubierta |
| › §7.5 Remito de proveedor (L343) | M12, M13 | M12: RF-CMP-025, RF-CMP-060, RF-CMP-061 … · M13: encab. | Cubierta |
| › §7.6 Factura de proveedor (L347) | M12, M13, M15 | M12: RF-CMP-070, RF-CMP-071, RF-CMP-072 … · M13: encab., RF-STK-090, RN-STK-030 … · M15: RN-CON-012 | Cubierta |
| › §7.7 Presupuestos (ventas de obras) (L361) | M11, M12 | M11: encab., RF-VEN-026, RF-VEN-030 … · M12: CTR-CMP-07, CTR-CMP-17, CTR-CMP-20 | Cubierta |
| §8 Stock (L367) | M13, M16 | M13: encab. · M16: §22.5 | Cubierta |
| › §8.1 Movimientos (L369) | M13 | M13: RF-STK-002, RF-STK-008, RF-STK-023 … | Cubierta |
| › §8.2 Documentos de stock (L382) | M13 | M13: RF-STK-024, RF-STK-033, RF-STK-036 … | Cubierta |
| › §8.3 Depósitos y ubicaciones (L390) | M13 | M13: RF-STK-018, RF-STK-019, RF-STK-020 | Cubierta |
| › §8.4 Valorización (L394) | M13, M15 | M13: RF-STK-013, RF-STK-051, RF-STK-089 … · M15: RF-CON-130, RN-CON-056 | Cubierta |
| §9 Bienes de uso (L404) | M13, M15 | M13: encab., RF-STK-006, RF-STK-096 … · M15: encab., RF-CON-072, RF-CON-129 … | Cubierta |
| §10 Fabricación (L414) | M13 | M13: encab., §16 | Cubierta |
| › §10.1 Estructura de producto (L416) | M13 | M13: RF-STK-116, RF-STK-125 | Cubierta |
| › §10.2 Orden de fabricación (`ORDEFAB`) (L420) | M13 | M13: RF-STK-119, RF-STK-120, RF-STK-121 … | Cubierta |
| › §10.3 Partes de producción (`OF_PARTE_PRODUCCION`) (L427) | M13 | M13: RF-STK-122, RN-STK-062 | Cubierta |
| › §10.4 Asientos de fabricación (L433) | M13, M15 | M13: RF-STK-125, RF-STK-127, RN-STK-067 · M15: encab., RF-CON-076, RN-CON-059 … | Cubierta |
| §11 Sueldos (L439) | M16, M14, M15 | ver subsecciones | Cubierta (por subsecciones) |
| › §11.1 Modelo (L441) | M16 | M16: RF-SUE-015, RF-SUE-043 | Cubierta |
| › §11.2 Conceptos (L447) | M16 | M16: RF-SUE-038, RN-SUE-016 | Cubierta |
| › §11.3 Liquidación (L455) | M16 | M16: RF-SUE-039, RF-SUE-044, RF-SUE-056 … | Cubierta |
| › §11.4 Novedades, licencias y firma de recibos (L464) | M16 | M16: RF-SUE-047, RF-SUE-048, RF-SUE-052 … | Cubierta |
| › §11.5 Pago de sueldos (L468) | M14, M15, M16 | M14: encab., RF-TES-160, RF-TES-161 … · M15: encab., RF-CON-073, RN-CON-058 · M16: RF-SUE-054, RF-SUE-112, CTR-SUE-04 … | Cubierta |
| › §11.6 F.931 (SICOSS), Libro de Sueldos Digital y F.1359 (L472) | M16 | M16: RF-SUE-035, RF-SUE-089, RF-SUE-096 … | Cubierta |
| §12 Parámetros relacionados (L481) | T04b-p4 | T04b-p4: encab., §2 | Cubierta |
| › §12.1 Tesorería y pagos (L485) | M12, M14, M16 | M12: encab. · M14: encab., RF-TES-056, RF-TES-107 … · M16: encab. | Cubierta |
| › §12.2 Retenciones a proveedores (L520) | T04b-p4 | hereda de §12 | Cubierta (por sección) |
| › §12.3 Contabilidad y cierre automático (L530) | M13, M15, M16 | M13: encab., RF-STK-133, PRM-STK-060 · M15: encab., RF-CON-001, RN-CON-058 · M16: encab., CTR-SUE-07 | Cubierta |
| › §12.4 Compras y stock (L561) | M12, M13, M16 | M12: encab. · M13: encab., RF-STK-033, RF-STK-070 … · M16: encab. | Cubierta |
| › §12.5 Sueldos (L590) | M14, M16 | M14: encab., RF-TES-161, RN-TES-073 … · M16: encab. | Cubierta |
| §13 Implicancias para CoopApps (L609) | M12, M13, M14, M15, M16 | M12: encab. · M13: encab., §2.3, RF-STK-089 … · M14: encab., §4, RF-TES-008 … · M15: encab., §1, §2.1 … · (+1 anexos) | Cubierta |
| §14 Dudas abiertas (L625) | M12, M13, M14, M15, M16 | M12: encab., RN-CMP-054, CTR-CMP-01 · M13: encab., §21 · M14: encab., RF-TES-008, §21 · M15: encab., PA-CON-01, PA-CON-07 … · (+1 anexos) | Cubierta |
| §15 Reglas adicionales (segunda pasada) (L644) | M14 | M14: §22.4 | Cubierta |
| › §15.1 Tesorería (L648) | M14, M15, T10 | M14: encab., RF-TES-002, RF-TES-007 … · M15: encab., RF-CON-018, RF-CON-049 … · T10: encab., RN-BIA-040, REP-TES-001 … | Cubierta |
| › › `clsCajaPago` (caja de pagos) (§15.1) (L650) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsCajas` (cajas de cobranza) (§15.1) (L657) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsChequeras` (cheques propios) (§15.1) (L664) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsConciliacion`, `clsRetencio`, `clsTarjetas` (§15.1) (L672) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsTesoreria` (§15.1) (L678) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsValores` (cheques de terceros) (§15.1) (L692) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsInformes_Tesoreria` (§15.1) (L700) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › › `clsInterbanking` (conciliación) (§15.1) (L713) | M14, M15, T10 | hereda de §15.1 | Cubierta (por sección) |
| › §15.2 Contabilidad (L720) | M13, M14, M15, M16, T10 | M13: RF-STK-006, RF-STK-105, RN-STK-051 · M14: RF-TES-084, RF-TES-135, RF-TES-139 … · M15: encab., RF-CON-004, RF-CON-010 … · M16: encab., RF-SUE-026, RF-SUE-117 · (+1 anexos) | Cubierta |
| › › `clsAsiento` (§15.2) (L722) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsAsignarCuentasYRubros` (reasignación masiva) (§15.2) (L731) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsCtEjer` (ejercicios) (§15.2) (L735) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsCuentas_Asignadas` (resolución de cuentas) (§15.2) (L740) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsContabilidad` (§15.2) (L762) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsCierreDiario` (complementos) (§15.2) (L775) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › › `clsInformes_Contabilidad` (§15.2) (L781) | M13, M14, M15, M16, T10 | hereda de §15.2 | Cubierta (por sección) |
| › §15.3 Compras (L793) | M11, M12, M13, M14, M15, T11 | M11: encab., RF-VEN-020, RF-VEN-021 … · M12: encab., §4, RF-CMP-024 … · M13: encab., §4, RF-STK-003 … · M14: encab., RF-TES-109, RF-TES-121 … · (+2 anexos) | Cubierta |
| › › Tipos de documento en `COMPRAS_RELACION` (§15.3) (L795) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › Reglas comunes al importar pendientes (§15.3) (L799) | M14 | M14: §22.4 | Cubierta |
| › › `clsSAprov` (solicitud de aprovisionamiento) (§15.3) (L807) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsSCotiz` (solicitud de cotización) (§15.3) (L819) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsNPedido` (orden de compra) (§15.3) (L829) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsComp_Com` (remito de proveedor) y `clsIvaCom` (factura) (§15.3) (L835) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `frmComprobantes_Handler` (complementos a 7.6) (§15.3) (L844) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsPagoFacturas` (complementos a 4) (§15.3) (L852) | T04b-p4 | T04b-p4: §5.5 | Cubierta |
| › › `clsBienesUso` y `clsLeerComprobante` (§15.3) (L860) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsProdSer` (productos, en lo que afecta a compras y precios) (§15.3) (L867) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsPresupuesto` (complementos a 7.7) (§15.3) (L877) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › › `clsInformes_Compras` (informes con regla propia) (§15.3) (L901) | M11, M12, M13, M14, M15, T11 | hereda de §15.3 | Cubierta (por sección) |
| › §15.4 Stock (L912) | M11, M13, M15, M16 | M11: encab., RF-VEN-055, RF-VEN-056 … · M13: encab., RF-STK-001, RF-STK-002 … · M15: encab., RF-CON-130, RF-CON-131 … · M16: §22.5 | Cubierta |
| › › `clsMov_pro` (movimientos de stock; complementos a 8) (§15.4) (L914) | M11, M13, M15, M16 | hereda de §15.4 | Cubierta (por sección) |
| › › `clsRevaluacion` (§15.4) (L938) | M11, M13, M15, M16 | hereda de §15.4 | Cubierta (por sección) |
| › › `clsTrazabilidad` (§15.4) (L944) | M11, M13, M15, M16 | hereda de §15.4 | Cubierta (por sección) |
| › §15.5 Fabricación (L950) | M13 | M13: encab., RF-STK-034, RF-STK-087 … | Cubierta |
| › › `clsOrdeFab` (órdenes de fabricación; complementos a 10) (§15.5) (L952) | M13 | hereda de §15.5 | Cubierta (por sección) |
| › › `frmOrdenAprovisionamiento_Handler` (aprovisionamiento de fabricación) (§15.5) (L970) | M13 | hereda de §15.5 | Cubierta (por sección) |
| › › `clsOfParteProduccion` (partes de producción) (§15.5) (L978) | M13 | hereda de §15.5 | Cubierta (por sección) |
| › §15.6 Sueldos (L990) | M14, M15, M16 | M14: RF-TES-165, RN-TES-074, CTR-TES-19 · M15: encab., RF-CON-049, RN-CON-061 … · M16: encab., RF-SUE-003, RF-SUE-005 … | Cubierta |
| › › Funciones del lenguaje de fórmulas (`clsFormulas_Sueldo`) (§15.6) (L992) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › `clsGanancias` (§15.6) (L1018) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › `clsEmpleados` (§15.6) (L1026) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › `clsCategorias`, `clsTramas` y `clsVariables` (§15.6) (L1037) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › `clsNovedades` (licencias y novedades) (§15.6) (L1045) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › `clsSueldos` (recibos) (§15.6) (L1052) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › › Exportaciones (`clsInformes_Sueldo`) (§15.6) (L1062) | M14, M15, M16 | hereda de §15.6 | Cubierta (por sección) |
| › §15.7 Parámetros incorporados en esta pasada (L1067) | M14, M16 | M14: encab., RF-TES-154, RF-TES-161 … · M16: encab., RF-SUE-091 | Cubierta |

### 12.10 RN-09 — `09-parametros-y-configuracion.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Parámetros (`Busca_V2_*`), configuración, seguridad y arquitectura de ProcoopNet (L1) | T01, T04, T08, T02, M02, M03, T04b-p2 (+21) | ver subsecciones | Cubierta (por subsecciones) |
| §1 Resumen ejecutivo (L11) | T04b-p2, T04 | T04b-p2: §7 · T04: encab., RF-CFG-014, RF-CFG-120 … | Cubierta |
| §2 Cómo se guardan los parámetros (L21) | T04b-p1, T04b-p2, T04b-p3, T04b-p4 | T04b-p1: encab., §2 · T04b-p2: encab., §2 · T04b-p3: encab. · T04b-p4: encab., §2 | Cubierta |
| › §2.1 Tablas (L23) | M15, T04b-p3, T04 | M15: encab., §22.3 · T04b-p3: §13 · T04: encab., RF-CFG-004, RF-CFG-007 … | Cubierta |
| › §2.2 Lectura y escritura (L41) | M13, T04b-p3, T04 | M13: encab., RF-STK-020 · T04b-p3: §13 · T04: encab., RF-CFG-003, RF-CFG-022 … | Cubierta |
| › §2.3 Alta y migración del catálogo (L51) | T04b-p3, T04 | T04b-p3: §13 · T04: encab., RF-CFG-002, RF-CFG-015 | Cubierta |
| › §2.4 Edición por el usuario (L57) | T04b-p3, T04 | T04b-p3: §13 · T04: encab., RF-CFG-005, RF-CFG-006 … | Cubierta |
| §3 Multiempresa, sucursal y puesto (L65) | M13, T01, T02, T04b-p1, T04, T08 | M13: encab., §4, RF-STK-020 … · T01: encab., RN-PLA-001, RN-PLA-002 … · T02: encab., RF-IAM-003, RF-IAM-009 … · T04b-p1: §2, §8.2 · (+2 anexos) | Cubierta |
| §4 Usuarios, permisos, seguridad y auditoría (L76) | T01, T02, T04b-p1 | T01: encab. · T02: encab. · T04b-p1: §2 | Cubierta |
| › §4.1 Usuarios y login (L78) | T01, T02, T04, T08 | T01: §1.2, RF-PLA-103, RN-PLA-018 · T02: §2.3, RF-IAM-041, RN-IAM-006 … · T04: RF-CFG-122 · T08: encab., RN-NFR-004, RNF-NFR-059 … | Cubierta |
| › §4.2 Perfiles y permisos (L86) | T02, T04, T08, T11 | T02: RF-IAM-063, RF-IAM-068, RF-IAM-092 … · T04: §22: §4 (capabilities); T02 · T08: encab., §9.13, RNF-NFR-090 · T11: encab., RF-WFL-121, RN-WFL-020 … | Cubierta |
| › §4.3 Auditoría (L94) | T01, T02, T04, T08, T11 | T01: RF-PLA-143, RN-PLA-024, RN-PLA-027 … · T02: RF-IAM-136, RN-IAM-060, RN-IAM-068 … · T04: RN-CFG-046, RF-CFG-042 · T08: encab., RN-NFR-020, §9.13 … · (+1 anexos) | Cubierta |
| §5 Arquitectura de ProcoopNet (L108) | T01, T02 | T01: encab., CTR-PLA-15 · T02: RF-IAM-046, RN-IAM-002 | Cubierta |
| › §5.1 Capas y ensamblados (L110) | T08 | Contexto; sin requisito NFR propio (Descartado: arquitectura reemplazada por DEC-003) | Descartada (motivo en IDs) |
| › §5.2 Arranque (L118) | T01, T04, T08 | T01: RF-PLA-155, RNF-PLA-006, RNF-PLA-007 · T04: RN-CFG-033 · T08: encab., RN-NFR-018, RNF-NFR-053 … | Cubierta |
| › §5.3 Conexión a la base (L125) | T01, T04, T08 | T01: §1.2, RNF-PLA-001, RNF-PLA-005 … · T04: encab., RF-CFG-014, RF-CFG-120 … · T08: encab., RN-NFR-003, RNF-NFR-059 … | Cubierta |
| › §5.4 Licenciamiento (L131) | M02, T01, T04, T08 | M02: RN-CAT-001 · T01: RN-PLA-008, RN-PLA-009, PRM-PLA-008 … · T04: encab., RF-CFG-120, RN-CFG-018 … · T08: encab., §9.13, §22: §9.13 → T01 | Cubierta |
| › §5.5 Menú y carga de módulos por reflexión (L136) | T01, T04, T08 | T01: RF-PLA-155, RN-PLA-038 · T04: encab., RF-CFG-114 · T08: §9.13, RNF-NFR-238, RNF-NFR-258 | Cubierta |
| › §5.6 Tareas al abrir el formulario principal (L146) | T01, T08 | T01: RF-PLA-093, RF-PLA-108, RF-PLA-152 … · T08: encab., RF-NFR-017, RNF-NFR-038 … | Cubierta |
| › §5.7 Actualizaciones (L150) | T01, T04, T08 | T01: RF-PLA-146, RF-PLA-147, RN-PLA-037 · T04: RF-CFG-123 · T08: encab., RN-NFR-022, RN-NFR-023 … | Cubierta |
| › §5.8 Agente (tareas programadas) (L155) | T01, T08 | T01: RF-PLA-093, RF-PLA-117, RF-PLA-154 … · T08: encab., RN-NFR-024, §9.13 … | Cubierta |
| §6 Catálogo de parámetros (L161) | M02, M03, T02, T04b-p2, T04b-p4, T04 | M02: encab. · M03: CTR-MED-18 · T02: encab. · T04b-p2: encab., §8 · (+2 anexos) | Cubierta |
| › §6.1 Cómo leer el catálogo (L163) | T04b-p3, T04 | T04b-p3: encab. · T04: encab., RF-CFG-130 | Cubierta |
| › §6.2 Totales por módulo (L171) | T04b-p1, T04b-p3, T04b-p4, T04 | T04b-p1: §8.1 · T04b-p3: encab., §13 · T04b-p4: encab., §2, §6.1 · T04: encab., §14.4, RF-CFG-130 | Cubierta |
| › §6.3 Parámetros más influyentes (lectura rápida) (L201) | M01, M02, M05, M06, M12, M13, M14 (+3) | M01: encab., §22.5 · M02: §22: 14 (todas las claves V2 listadas y de... · M05: encab., §22.6 · M06: encab., PRM-FIS-001 · (+6 anexos) | Cubierta |
| › §6.4 Listado completo por módulo (L213) | M02, M13, M14, T04b-p1, T04b-p3, T04 | M02: encab. · M13: RF-STK-028, RF-STK-029, RF-STK-032 … · M14: encab. · T04b-p1: encab. · (+2 anexos) | Cubierta |
| › › SISTEMA (8 parámetros, 8 con uso directo en código) (§6.4) (L215) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › CONFIGURACION (107 parámetros, 65 con uso directo en código) (§6.4) (L228) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › TITULARES (312 parámetros, 193 con uso directo en código) (§6.4) (L340) | M01, M11, M17, M18 | M01: encab. · M11: encab. · M17: encab., §22.4 · M18: encab. | Cubierta |
| › › VENTAS_Y_FACTURACION (313 parámetros, 199 con uso directo en código) (§6.4) (L657) | M04, M05, M11 | M04: encab., §22: Sección 14 (PRM-TAR) y lista de parám... · M05: encab. · M11: encab. | Cubierta |
| › › COBRANZA (265 parámetros, 186 con uso directo en código) (§6.4) (L975) | M07, M11 | M07: §22: Sección 14 · M11: encab. | Cubierta |
| › › GESTION_DE_MORA (23 parámetros, 13 con uso directo en código) (§6.4) (L1245) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › FINANCIACIONES (21 parámetros, 12 con uso directo en código) (§6.4) (L1273) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › CONSUMOS (4 parámetros, 1 con uso directo en código) (§6.4) (L1299) | M03, M05 | M03: RN-MED-019 · M05: §14.7 | Cubierta |
| › › TECNICA (95 parámetros, 36 con uso directo en código) (§6.4) (L1308) | M09, M10, M11 | M09: encab. · M10: encab. · M11: encab., RF-VEN-009, RN-VEN-049 | Cubierta |
| › › TELEMED (45 parámetros, 31 con uso directo en código) (§6.4) (L1408) | M03 | M03: RN-MED-032, RN-MED-033 | Cubierta |
| › › TELEFONIA (16 parámetros, 13 con uso directo en código) (§6.4) (L1458) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › SMS (11 parámetros, 7 con uso directo en código) (§6.4) (L1479) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › COMPRAS (109 parámetros, 46 con uso directo en código) (§6.4) (L1495) | M12, M15 | M12: encab., RF-CMP-148, §22.4 · M15: RN-CON-041 | Cubierta |
| › › STOCK (14 parámetros, 5 con uso directo en código) (§6.4) (L1609) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › FABRICACION (4 parámetros, 1 con uso directo en código) (§6.4) (L1628) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › CONTABILIDAD (87 parámetros, 37 con uso directo en código) (§6.4) (L1637) | M15 | M15: RF-CON-001, RF-CON-004, RF-CON-029 … | Cubierta |
| › › TESORERIA (33 parámetros, 16 con uso directo en código) (§6.4) (L1729) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › SUELDOS (28 parámetros, 18 con uso directo en código) (§6.4) (L1767) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › VIVIENDA (14 parámetros, 9 con uso directo en código) (§6.4) (L1800) | M02, M18 | M02: §6.C.14 · M18: encab. | Cubierta |
| › › TURNERO (11 parámetros, 7 con uso directo en código) (§6.4) (L1819) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › TICKETS (3 parámetros, 1 con uso directo en código) (§6.4) (L1835) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › MESA_DE_ENTRADAS (3 parámetros, 0 con uso directo en código) (§6.4) (L1843) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › ACTIVIDADES (1 parámetros, 1 con uso directo en código) (§6.4) (L1851) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › (no catalogada) CapaNucleo (1 parámetros, 1 con uso directo en código) (§6.4) (L1857) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › (no catalogada) RN.Cobranzas (4 parámetros, 4 con uso directo en código) (§6.4) (L1863) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › (no catalogada) RN.Facturacion (2 parámetros, 2 con uso directo en código) (§6.4) (L1872) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › (no catalogada) RN.Varios.Generales (1 parámetros, 1 con uso directo en código) (§6.4) (L1879) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| › › (no catalogada) RN.Varios.PMovil (1 parámetros, 1 con uso directo en código) (§6.4) (L1885) | M02, M13, M14, T04b-p1, T04b-p3, T04 | hereda de §6.4 | Cubierta (por sección) |
| §7 Implicancias para CoopApps (L1893) | T01, T02, T04, T08 | T01: encab., RF-PLA-010, RF-PLA-147 … · T02: encab. · T04: encab., RF-CFG-001, RF-CFG-002 … · T08: encab., RNF-NFR-060, RNF-NFR-097 … | Cubierta |
| §8 Dudas abiertas (L1906) | T01, T04, T08 | T01: encab., RF-PLA-143 · T04: encab., RF-CFG-133, §14.4 … · T08: encab., RN-NFR-021, §9.13 | Cubierta |

### 12.11 RN-10 — `10-integraciones-externas.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Integraciones externas de Procoop 10 (L1) | M03, M10, T06 | M03: §13.4 · M10: encab., RF-TEC-160, RF-TEC-222 … · T06: encab., RN-INT-048, §12.12 … | Cubierta |
| §1 Panorama (L9) | T06, T09 | T06: encab. · T09: encab., §22: §2, §13 | Cubierta |
| §2 Correo electrónico (L34) | T06, T09, T11 | T06: encab., RF-INT-080, RF-INT-085 … · T09: encab., RF-COM-132, RN-COM-019 … · T11: encab., RN-WFL-001, RN-WFL-061 … | Cubierta |
| › §2.1 Reglas de envío y cola de correo (segunda pasada) (L46) | T06, T09 | T06: RF-INT-030, RF-INT-040, RN-INT-014 … · T09: encab., RN-COM-014, RN-COM-016 … | Cubierta |
| §3 CoopOnline (portal web y app de socios) (L73) | M19, T03, T06 | M19: encab., RF-POR-160, RN-POR-010 … · T03: encab. · T06: encab., §2.3, RF-INT-046 … | Cubierta |
| › §3.1 Identificación de la cooperativa y canales de entrada (segunda pasada) (L85) | T06 | T06: RF-INT-055, RN-INT-032, RN-INT-060 | Cubierta |
| › §3.2 Datos que publica Procoop hacia el portal (L92) | M19, T03, T06 | M19: RF-POR-054, RF-POR-055, RF-POR-068 … · T03: RN-UXD-066, SM-PWS-010 · T06: RN-INT-034 | Cubierta |
| › §3.3 Operaciones que acepta el portal y sus validaciones (L104) | M19, T03, T06 | M19: RF-POR-090, RF-POR-091, RF-POR-092 … · T03: RN-UXD-067, §10.7.4, SM-ADM-034 … · T06: RN-INT-001, RN-INT-033 | Cubierta |
| › §3.4 Autorización y registración del pago (L130) | M19, T03, T06 | M19: RF-POR-095, RF-POR-108, RN-POR-024 … · T03: RN-UXD-067, §10.7.4, SM-PWS-023 · T06: RF-INT-045, RN-INT-001, RN-INT-011 … | Cubierta |
| › §3.5 Trámites web y declaración jurada de artefactos (`RN.Varios.CoopOnline/clsTramitesWEB.cs`) (L162) | M19, T03, T06, T11 | M19: RF-POR-013, RF-POR-036, RF-POR-057 … · T03: RN-UXD-067, §10.7.3, §10.7.4 … · T06: RN-INT-046 · T11: encab., RF-WFL-073, RF-WFL-090 … | Cubierta |
| › §3.6 Notificaciones al portal (L195) | M10, M19, T03, T09 | M10: RN-TEC-073, CTR-TEC-16 · M19: RF-POR-121, RF-POR-127, RN-POR-072 … · T03: RN-UXD-068, SM-PWS-031 · T09: encab., RF-COM-138, RF-COM-203 … | Cubierta |
| §4 PMovil / Captor (app de campo) (L201) | M03, M10, T06, T09 | M03: encab., RF-MED-033, PA-MED-11 · M10: encab. · T06: encab., §12.13 · T09: encab., RF-COM-130, RN-COM-039 | Cubierta |
| §5 SMS y WhatsApp (L211) | M09, T06, T09 | M09: encab., RF-CRM-178, RF-CRM-185 … · T06: encab., RF-INT-040, RF-INT-085 … · T09: encab., RF-COM-154, RN-COM-023 … | Cubierta |
| §6 Pasarelas de pago, botones y QR (L219) | T06 | T06: encab., RF-INT-004 | Cubierta |
| › §6.1 Operaciones invocadas y mapeo del resultado a la cobranza (segunda pasada) (L228) | T06 | T06: RN-INT-037, RN-INT-053, RN-INT-054 … | Cubierta |
| §7 Entes recaudadores, débitos y bancos (L254) | T06 | T06: encab., RF-INT-059 | Cubierta |
| §8 AFIP, reguladores y fiscos (L261) | T06 | T06: encab., RF-INT-025, §12.4 | Cubierta |
| §9 Telemedición, prepago y aprovisionamiento de internet (L273) | M03, M10, T06 | M03: encab., RN-MED-109, §13.1 … · M10: encab., RF-TEC-165, RF-TEC-182 · T06: encab., RN-INT-040, RN-INT-065 … | Cubierta |
| §10 Mapas y GIS (L296) | M10, T06 | M10: encab. · T06: encab. | Débil (solo encabezado) |
| §11 Otras integraciones (L304) | M10, M19, T06 | M10: RN-TEC-073, CTR-TEC-16 · M19: encab., §13 · T06: encab., RF-INT-084, RN-INT-059 … | Cubierta |
| §12 Integra (API local) y Agente (L319) | M19, T06, T09, T10 | M19: encab. · T06: encab., §2.3, RF-INT-046 … · T09: encab., §22: JOB-COM (BullMQ) — Reemplazado por §9.12 · T10: encab., §10, RF-BIA-003 … | Cubierta |
| › §12.1 Tareas del Agente vinculadas a integraciones (segunda pasada) (L325) | T06, T09, T10 | T06: RF-INT-068, RF-INT-077, RN-INT-036 … · T09: encab., §22: JOB-COM (BullMQ) — Reemplazado por §9.12 · T10: RN-BIA-009 | Cubierta |
| §13 Secretos hardcodeados (solo ubicación) (L342) | M19, T02, T06, T08, T09, T10 | M19: encab. · T02: encab., §2.3, RF-IAM-027 … · T06: encab., RF-INT-016, RF-INT-020 … · T08: encab., §3, RN-NFR-003 … · (+2 anexos) | Cubierta |
| §14 Implicancias para CoopApps (L369) | M19, T06, T08, T09, T10 | M19: encab., §2.3, RF-POR-020 … · T06: encab., RF-INT-001, RF-INT-015 … · T08: encab., RN-NFR-026, RNF-NFR-012 … · T09: encab., §1, RF-COM-155 · (+1 anexos) | Cubierta |
| §15 Dudas abiertas (L381) | M19, T06, T09 | M19: encab., RF-POR-031, RF-POR-170 … · T06: encab., RN-INT-032, RN-INT-046 · T09: encab., RF-COM-154, RN-COM-014 | Cubierta |
| §16 Reglas adicionales (segunda pasada): clases raíz de `ReglasNegocio.Varios` (L398) | M03, M19, T06 | M03: RF-MED-059, RN-MED-039, PAN-MED-24 · M19: encab., RF-POR-118, RF-POR-119 … · T06: encab., §12.9 | Cubierta |
| › §16.1 Turnero de atención al público (`clsTurnero`) (L402) | M09, T06 | M09: encab., RF-CRM-142, RF-CRM-143 … · T06: RF-INT-084, §12.16 | Cubierta |
| › §16.2 Adjuntos (`clsAdjuntos`) (L421) | M03, M09, T11 | M03: encab., RF-MED-059, RN-MED-039 · M09: encab., RN-CRM-028, RN-CRM-089 · T11: encab., RF-WFL-152, RF-WFL-159 … | Cubierta |
| › §16.3 Calendario, agenda y correo interno (L432) | T09, T11 | T09: encab., RF-COM-205, CTR-COM-24 · T11: encab., RF-WFL-139, RF-WFL-140 … | Cubierta |
| › §16.4 Navegador genérico de entidades (`clsEntidades`) (L450) | T10, T11 | T10: encab., RF-BIA-040, RF-BIA-003 … · T11: encab., PAN-WFL-05, CTR-WFL-11 | Cubierta |
| › §16.5 Informes (L460) | M03, T10 | M03: encab. · T10: encab., RF-BIA-003, RF-BIA-042 … | Cubierta |
| › §16.6 Importación de archivos y procesos SQL (`clsImportacionArchivos`) (L468) | T06, T10 | T06: RN-INT-045, §12.4, §12.17 · T10: RF-BIA-042, RN-BIA-014, RF-BIA-003 | Cubierta |
| › §16.7 Fórmulas, mapas y escáner (L478) | M03, M19, T06 | hereda de §16 | Cubierta (por sección) |
| › §16.8 Novedades y encuestas del proveedor (`clsRss`) (L485) | T09 | T09: encab., §2.1, RF-COM-093 … | Cubierta |

### 12.12 RN-11 — `11-especificas-laguna-larga.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Reglas específicas de la Cooperativa Eléctrica de Laguna Larga (LAG) (L1) | T07, M07, M05, M06, T10 | ver subsecciones | Cubierta (por subsecciones) |
| Resumen ejecutivo (§11) (L14) | M07 | M07: RF-COB-187 | Cubierta |
| Confirmado en la base demo (documento 12) (§11) (L35) | — | — | **SIN COBERTURA** |
| §1 Interfaz de cobranza de LAG (L48) | M07 | ver subsecciones | Cubierta (por subsecciones) |
| › §1.1 Importador `Entidades.LAG/Red_Link.cs` (modelo 264) (L50) | M07 | M07: encab., RF-COB-106, RF-COB-184 … | Cubierta |
| › §1.2 Envío de deuda a Red Link (L131) | M07 | M07: encab., RF-COB-186 | Cubierta |
| › §1.3 SIRO (Banco Roela) en LAG (L135) | M07 | M07: encab., RF-COB-186, RN-COB-096 … | Cubierta |
| › §1.4 Rama "LAGU" de la rendición Red Link genérica (`PR/RedLink_1.cs`) (L168) | M07 | M07: encab. | Débil (solo encabezado) |
| §2 Código de barras de Laguna Larga (L182) | M05 | M05: encab., §22: Adoptado | Cubierta |
| › §2.1 Qué formato usa LAG (L184) | M05 | hereda de §2 | Cubierta (por sección) |
| › §2.2 Estructura del código SIRO – Banco Roela (56 dígitos) (L191) | M05 | M05: RF-FAC-142, RF-FAC-144, RF-FAC-147 … | Cubierta |
| › §2.3 Lectura del código SIRO (caja y rendición) (L227) | M05, T07 | M05: RF-FAC-145, RN-FAC-129 · T07: RN-MIG-027, §19.4 | Cubierta |
| §3 Ramas condicionadas por cooperativa que alcanzan a LAG (L240) | M05, T07 | M05: encab., RN-FAC-132, §22: Adoptado; búsqueda por cuenta + impor... · T07: encab., §3, RF-MIG-007 … | Cubierta |
| §4 Reportes, exportaciones a entes y gas (L262) | M05, M06, T07, T10 | M05: encab., §22: Adoptado; búsqueda por cuenta + impor... · M06: encab., RF-FIS-140, RF-FIS-144 … · T07: §19.2 · T10: encab., KPI-SUE-01, PA-BIA-14 | Cubierta |
| §5 Datos a confirmar en `PR_LAG_DEMO` (L289) | M07, T07 | M07: encab. · T07: encab., RF-MIG-001, RF-MIG-007 … | Cubierta |
| Implicancias para CoopApps (by-pass y transición) (§11) (L332) | M07, T07 | M07: RF-COB-059, RF-COB-100, RF-COB-171 … · T07: RF-MIG-047, RF-MIG-073, RF-MIG-083 … | Cubierta |
| Dudas abiertas (§11) (L352) | T07 | T07: PA-MIG-05, PA-MIG-16 | Cubierta |

### 12.13 RN-12 — `12-configuracion-real-laguna-larga.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) Configuración real de Laguna Larga en Procoop (L1) | M07, T06 | M07: §22.5 · T06: §22.3 | Cubierta |
| §1 Sigla de la cooperativa (L7) | T06 | T06: encab., RF-INT-060 | Cubierta |
| §2 Entes recaudadores (tabla `BANCOS`) (L15) | M07, T06 | M07: RF-COB-113, RF-COB-118, RF-COB-184 … · T06: encab., RF-INT-002, RF-INT-066 … | Cubierta |
| §3 Pasarelas de pago online (L50) | M07, T06 | M07: RF-COB-075, RF-COB-132, RF-COB-151 · T06: encab., RN-INT-033, §7.17 … | Cubierta |
| §4 Parámetros relevantes (L80) | T06 | T06: encab., §12.4, §12.9 | Cubierta |
| §5 Implicancias para CoopApps (L105) | M07, T06 | M07: RF-COB-152, RF-COB-186 · T06: encab. | Cubierta |
| §6 Dudas abiertas (L118) | M07, T06 | M07: RF-COB-188 · T06: encab. | Cubierta |

### 12.14 RN-13 — `13-pasarelas-de-pago-e-interbanking.md`

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| (documento) — Pasarelas de pago e Interbanking (L1) | M07, T06 | M07: encab., RN-COB-118 · T06: encab., RF-INT-022, §12.8 | Cubierta |
| §1 Panorama (L17) | M07, T06 | M07: encab., RF-COB-132 · T06: encab. | Cubierta |
| §2 Arquitectura común de `ProMod_WebService` (L44) | M07, T06 | M07: encab. · T06: encab., §12.8 | Cubierta |
| › §2.1 Patrón de transporte (L46) | M07, T06 | M07: RN-COB-122 · T06: RF-INT-028, RF-INT-034, RF-INT-035 … | Cubierta |
| › §2.2 Ciclo de vida común de una solicitud (L64) | M07, T06 | M07: RF-COB-134, RN-COB-110 · T06: RF-INT-005, RN-INT-004 | Cubierta |
| › §2.3 Cómo se entera Procoop de un pago: webhook, polling o archivo (L86) | M07, T06 | M07: RF-COB-139, RF-COB-140, RF-COB-150 … · T06: RF-INT-053, RF-INT-054, RF-INT-056 … | Cubierta |
| › §2.4 Elección de la pasarela (L94) | M07, T06 | M07: RN-COB-120 · T06: RF-INT-010 | Cubierta |
| §3 Pagos360 (L100) | M07, T06 | M07: encab. · T06: encab., §12.8 | Cubierta |
| › §3.1 Ambiente, autenticación y transporte (L104) | M07, T06 | hereda de §3 | Cubierta (por sección) |
| › §3.2 Endpoints (`PMW/Pagos360/Functions.cs`) (L112) | M07, T06 | M07: RF-COB-147 · T06: RF-INT-069, RN-INT-052 | Cubierta |
| › §3.3 Flujo de link de pago (L140) | M07, T06 | M07: RF-COB-135, RF-COB-138, RF-COB-140 … · T06: RF-INT-068, RN-INT-003, RN-INT-061 | Cubierta |
| › §3.4 QR en caja (L164) | M07, T06 | M07: RF-COB-068, RN-COB-057, CTR-COB-10 · T06: RN-INT-010 | Cubierta |
| › §3.5 Débito automático (tarjeta y CBU) (L169) | M07, T06 | M07: RF-COB-120, RF-COB-122, RF-COB-128 · T06: RN-INT-028 | Cubierta |
| › §3.6 Contracargos, reversiones y anulaciones (L176) | M07, T06 | M07: RF-COB-159, RF-COB-161, RN-COB-131 … · T06: RN-INT-056, RN-INT-057 | Cubierta |
| › §3.7 Tótem de autogestión (L182) | M07, T06 | M07: RF-COB-144, CTR-COB-18 · T06: RF-INT-081, RN-INT-050, §12.16 … | Cubierta |
| §4 SIRO (Banco Roela) (L188) | M07, T06 | M07: encab. · T06: encab., §12.7, CTR-INT-01 | Cubierta |
| › §4.1 Ambiente y autenticación (L192) | M07, T06 | M07: RN-COB-129 · T06: RF-INT-022, RN-INT-013 | Cubierta |
| › §4.2 Endpoints (`PMW/SIRO/Functions.cs:22-60`) (L198) | M07 | M07: RF-COB-105 | Cubierta |
| › §4.3 Flujo (L212) | M07, T06 | M07: RN-COB-119, RN-COB-124, RN-COB-125 · T06: RN-INT-003, RN-INT-008, RN-INT-064 | Cubierta |
| §5 MercadoPago (L221) | M07, T06 | M07: encab., RN-COB-126 · T06: encab., RN-INT-003, §12.8 | Cubierta |
| §6 Macro – Click de Pago (PlusPagos) (L232) | M07, T06 | M07: encab. · T06: encab., RN-INT-051, §12.8 … | Cubierta |
| §7 NaranjaX (Ranty) (L246) | M07, T06 | M07: encab., RN-COB-129 · T06: encab., RF-INT-022, RN-INT-013 … | Cubierta |
| §8 PayFun (L255) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |
| §9 Pagos TIC (PayPerTIC) (L261) | M07, T06 | M07: encab. · T06: encab., RF-INT-022, RN-INT-013 | Cubierta |
| §10 SiPago (Geopagos) (L266) | M07, T06 | M07: encab. · T06: encab., RN-INT-053, §12.8 | Cubierta |
| §11 Helipagos (L272) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |
| §12 ProvinciaNet (Banco Provincia, QR) (L276) | M07, T06 | M07: encab., RN-COB-111, RN-COB-125 … · T06: encab., RF-INT-006, RN-INT-008 … | Cubierta |
| §13 ProntoPago (QR en facturas) (L283) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |
| §14 OffLine y resumen de tarjeta de terceros (L288) | M07, T06 | M07: encab., RF-COB-178 · T06: encab., RN-INT-049, §12.8 | Cubierta |
| §15 Cobertura por tipo de medio (L293) | M07, T06 | M07: encab., RF-COB-146, RN-COB-121 · T06: encab., RN-INT-056 | Cubierta |
| §16 Interbanking (L310) | M14, T06 | M14: CTR-TES-02, §21 · T06: encab., §12.10, CTR-INT-06 … | Cubierta |
| › §16.1 API (`PMW/Interbanking/`) (L314) | M14, T06 | M14: encab., RF-TES-051, RF-TES-054 … · T06: RF-INT-022, RN-INT-013, CTR-INT-22 | Cubierta |
| › §16.2 Saldos y movimientos (`RN.Tes/clsInterbanking.cs`) (L321) | M14, T06 | M14: encab., RF-TES-010, RF-TES-034 … · T06: RN-INT-030, CTR-INT-22 | Cubierta |
| › §16.3 Conciliación bancaria (L327) | M14, T06 | M14: encab., RF-TES-038, RF-TES-041 … · T06: RF-INT-067, RN-INT-031, CTR-INT-22 | Cubierta |
| › §16.4 Archivos de pago (proveedores y sueldos) (L333) | M14, T06 | M14: encab., RF-TES-046, RF-TES-056 … · T06: §12.10, CTR-INT-22 | Cubierta |
| §17 Hallazgos de seguridad (L341) | M07, M14, T02, T06, T08 | M07: encab., §1, RF-COB-133 … · M14: encab., RF-TES-051, RF-TES-060 … · T02: encab., RN-IAM-052, RF-IAM-074 … · T06: encab., RF-INT-023, RF-INT-048 … · (+1 anexos) | Cubierta |
| §18 Resto de `ProMod_WebService` (L360) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |
| §19 Implicancias para CoopApps (L366) | M07, T06 | ver subsecciones | Cubierta (por subsecciones) |
| › §19.1 Prioridades (L368) | M07 | M07: RF-COB-132 | Cubierta |
| › §19.2 Diseño genérico propuesto (L375) | M07, T06 | M07: RF-COB-131, RF-COB-133, RF-COB-134 … · T06: RF-INT-001, RF-INT-015, RF-INT-037 | Cubierta |
| › §19.3 Webhooks vs. polling (L383) | M07, T06 | M07: RF-COB-139, RF-COB-140, RF-COB-150 · T06: RF-INT-034, RF-INT-053, RF-INT-056 … | Cubierta |
| › §19.4 No replicar (L391) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |
| §20 Dudas abiertas (L397) | M07, T06 | M07: encab. · T06: encab. | Débil (solo encabezado) |

## 13. Matriz del catálogo de tablas ProCoop (CAT)

Fuente: `procoop-relevamiento/binarios/Procoop-catalogo-tablas.md` (659 tablas en 31 secciones). **Anexo(s)**: dueño según T07 §19 y demás anexos que citan la tabla. **IDs**: fila de T07 §19 con destino, estrategia y ola.

### 13.1 CAT §1 — Socios, cuentas y servicios (24 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ADHSOC` | M18 (dueño), M01, M02, T09, T12-p2, M07, T05, (+3) | T07 §19.1 → `serviceDependents` (+ `dependentEvents`) · Migrar vivo · O4 | Cubierta |
| `BENSOC` | M18 (dueño), T05, M01, M02, M04, T09, T12-p2 | T07 §19.1 → `serviceBeneficiaries` · Migrar vivo · O4 | Cubierta |
| `CAPITAL` | M17 (dueño), M15, M07, T12-p2, M01, T05, T04, (+2) | T07 §19.1 → `capitalMovements` · Migrar vivo · O10 | Cubierta |
| `CAPITAL_RES` | M17 (dueño), T12-p2, M15, M01, T05 | T07 §19.1 → `capitalReserves` (+ validación de `capitalBalances`) · Migrar vivo · O10 | Cubierta |
| `NOT_ELIMINADAS_HST` | M01 (dueño) | T07 §19.1 → Histórico (legacyRecords) · Histórico · O2 | Cubierta |
| `NOTA_SUM` | M01 (dueño), M09, T05, M03 | T07 §19.1 → `accountNotes` · Migrar vivo · O2 | Cubierta |
| `PERSONAS` | M01 (dueño), T09, M09, M08, M10, T05 | T07 §19.1 → `persons` · Migrar vivo · O2 | Cubierta |
| `PERSONAS_EXTRAS` | M01 (dueño), T09, T04 | T07 §19.1 → `persons.employmentInfo` · Migrar vivo · O2 | Cubierta |
| `PROPIEDA` | M01 (dueño), T05 | T07 §19.1 → `properties` · Migrar vivo · O2 | Cubierta |
| `PTRAMITES` | M09 (dueño), M01, T11, T05, M16 | T07 §19.1 → `requests` · Migrar vivo · O2 | Cubierta |
| `RUBCAPI` | M17 (dueño), M15, T12-p2, T05, M01, M02 | T07 §19.1 → `capitalItems` · Migrar vivo · O10 | Cubierta |
| `SERSOC` | M02 (dueño), M01, M03, T05, T12-p2, T12-p1, M05, (+10) | T07 §19.1 → `serviceContracts` · Migrar vivo · O2 | Cubierta |
| `SERSOC_EXTRAS` | M04 / M02 (dueño), M02, M01, M04, T12-p2, M03, M10, (+3) | T07 §19.1 → `worksInstallmentPlans` (columnas `CNT_*`) + `serviceContracts.extr... · Migrar vivo · O7 / O2 | Cubierta |
| `SERSOC_HST` | M02 (dueño), M01, T05 | T07 §19.1 → `serviceContracts` (versiones) · Histórico · O2 | Cubierta |
| `SERSOC_PRODUCTOS` | M13 / M18 (dueño), M13, M02, M01, T12-p2, T12-p1, T05, (+1) | T07 §19.1 → `loanedEquipment` (+ `orthopedicItems`/`orthopedicLoans` de M18 par... · Migrar vivo · O3 / O10 | Cubierta |
| `SOCIOS` | M01 (dueño), M17, T05, T04b-p2, T03, M19, M04, (+2) | T07 §19.1 → `holders` (+ `members` en M17) · Migrar vivo · O2 | Cubierta |
| `SUMSOC` | M01 (dueño), T05, M07, M04, M08, T09, M06, (+2) | T07 §19.1 → `accounts` · Migrar vivo · O2 | Cubierta |
| `SUMSOC_EXTRAS` | M01 (dueño), M07, M04, T04 | T07 §19.1 → `accounts` (contacto y adhesiones) · Migrar vivo · O2 | Cubierta |
| `SUMSOC_HST` | M01 (dueño) | T07 §19.1 → `accounts` (versiones) · Histórico · O2 | Cubierta |
| `TRAMITES` | M09 (dueño), M01, T11, T05 | T07 §19.1 → `requestTypes` · Migrar vivo · O2 | Cubierta |
| `TRAMITES_ACCIONES` | T11 (dueño), M09, M01, T05 | T07 §19.1 → Reemplazado por acciones de workflow (T11) · No migrar · O1 | Reemplazada (Reemplazado por acciones de workflow (T11)) |
| `TRANSFER` | M01 / M13 / M17 (dueño), M01, M17, T05, M13, M09, M02 | T07 §19.1 → `transfers` (M01, titularidad); filas de stock → `stockDocuments` (... · Histórico · O2 (titularidad); O3 (stock); O10 (capital) | Cubierta |
| `VIAINGTE` | M09 (dueño), M10, T05, T09, M01 | T07 §19.1 → `crmChannels` (antes `intakeChannels`; CTR-DAT-77, COL-CRM-23) · Migrar vivo · O2 | Cubierta |
| `VINCULOS` | T04 (dueño), M01, M02, M18, T05 | T07 §19.1 → `relationshipTypes` · Migrar vivo · O1 | Cubierta |

### 13.2 CAT §2 — Servicios, categorías y tarifas (48 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ALTASEAU` | M02 (dueño), M10, M04, M18, M01, T05 | T07 §19.2 → `autoServiceTemplates` · Migrar vivo · O2 | Cubierta |
| `ARTEFACTO` | M02 (dueño), M04, T12-p1, M19, T05 | T07 §19.2 → `appliances` · Migrar vivo · O7 | Cubierta |
| `ARTEFSUMS` | M02 (dueño), M19, M04, M01, T05, T12-p1 | T07 §19.2 → `contractDeclaredAppliances` · Migrar vivo · O7 | Cubierta |
| `CARGOS_ADICIONALES` | M04 (dueño), M02, T05 | T07 §19.2 → `additionalCharges` · Migrar vivo · O7 | Cubierta |
| `CATE_SER` | M02 (dueño), M04, T05, M03, T04b-p2, T03, M10, (+3) | T07 §19.2 → `tariffCategories` · Migrar vivo · O2 | Cubierta |
| `CATE_SER_COEFICIENTES` | M04 (dueño), M02, T05 | T07 §19.2 → `categoryCoefficients` · Migrar vivo · O4 | Cubierta |
| `CATE_SER_EXTRAS` | M02 (dueño), M04, M18, T05, T12-p2, T12-p1, T04, (+1) | T07 §19.2 → `tariffCategories.extras` · Migrar vivo · O2 | Cubierta |
| `CATTARIF` | M04 (dueño), M02, T05 | T07 §19.2 → `tariffRates` · Migrar vivo · O4 | Cubierta |
| `CATTMC` | M04 (dueño), M02, T05 | T07 §19.2 → Reemplazado por borrador de versión tarifaria (M04) · No migrar · O4 | Reemplazada (Reemplazado por borrador de versión tarifaria (M04)) |
| `CLASESER` | M02 (dueño), T12-p2, M06, M04, T05 | T07 §19.2 → `serviceClasses` · Migrar vivo · O2 | Cubierta |
| `CON_TASAS` | M12 (antes M06 / M02) (dueño), T12-p2, M06, M12, T05, M04, M02 | T07 §19.2 → `purchaseConcepts` (concepto de compra con tasa y columna del libro... · Migrar vivo · O8 (antes O4) | Cubierta |
| `CONCESIO` | T04 (dueño), M02, M04, T05 | T07 §19.2 → `concessions` · Migrar vivo · O1 | Cubierta |
| `CONE_BONIF` | M02 (dueño), M04, T05, M07 | T07 §19.2 → `connectionChargeWaivers` · Migrar vivo · O3 | Cubierta |
| `CONEXION` | M02 (dueño), M04, M08, M10, M09, T05 | T07 §19.2 → `connectionCharges` · Migrar vivo · O3 | Cubierta |
| `CORREGAS` | M04 (dueño), M02, T05, T12-p1, M03 | T07 §19.2 → `gasCalorificFactors` · Migrar vivo · O7 | Cubierta |
| `CUADRI` | M04 (dueño), M10, M02, T05 | T07 §19.2 → `tariffSchedules` · Migrar vivo · O4 | Cubierta |
| `CUADROS` | M04 (dueño), M02, T05 | T07 §19.2 → `tariffScheduleVersions` · Migrar vivo · O4 | Cubierta |
| `DESCPOS` | M04 (dueño), M11, M02, T05 | T07 §19.2 → `discountRules` · Migrar vivo · O4 | Cubierta |
| `ESTASER` | M02 (dueño), M04, M10, T05 | T07 §19.2 → `serviceStates` · Migrar vivo · O2 | Cubierta |
| `ESTINM` | T04 (dueño), M01, M04, M02 | T07 §19.2 → `propertyStates` · Migrar vivo · O1 | Cubierta |
| `FACT_EPEC` | M12 (dueño), M04, M06, T05, T06, M02, T12-p1 | T07 §19.2 → `supplierInvoices.wholesaleSupply` · Histórico · O8 | Cubierta |
| `FACTOR_CAL` | M04 (dueño), M03, M02, T05, T12-p1 | T07 §19.2 → `gasCalorificFactors` · Migrar vivo · O7 | Cubierta |
| `GRP_CAT` | M02 (dueño), M04, T12-p1, T05 | T07 §19.2 → `categoryGroups` · Migrar vivo · O2 | Cubierta |
| `HIS_ARTEFSUMS` | M02 (dueño), M04, M19, T12-p1, T05 | T07 §19.2 → `contractDeclaredAppliances` (versiones; antes `declaredAppliances`) · Histórico · O7 | Cubierta |
| `HIS_CARGOS_ADICIONALES` | M04 (dueño), M02 | T07 §19.2 → `additionalCharges` (versiones) · Migrar vivo · O7 | Cubierta |
| `HIS_CATE_SER` | M04 (dueño), M02 | T07 §19.2 → `tariffCategories` (versiones por cuadro) · Migrar vivo · O4 | Cubierta |
| `HIS_CATE_SER_EXTRAS` | M04 (dueño), M02, T04 | T07 §19.2 → `tariffCategories` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_CATTARIF` | M04 (dueño), M02, T05 | T07 §19.2 → `tariffRates` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_IMPUESTO` | M06 (dueño), M04, M02 | T07 §19.2 → `taxes` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_PROD_SER` | M04 (dueño), M02, T05 | T07 §19.2 → `productPrices` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_SERVICIO` | M02 (dueño), M04 | T07 §19.2 → `services` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_SERVICIO_EXTRAS` | M02 (dueño), M04, T04 | T07 §19.2 → `services` (versiones) · Migrar vivo · O4 | Cubierta |
| `HIS_TAR_ADHE` | M04 (dueño), M18, T12-p2, M02 | T07 §19.2 → `adherentRates` (versiones; nombre canónico COL-TAR-05, antes `depe... · Migrar vivo · O4 | Cubierta |
| `IMPUESTO` | M06 (dueño), T12-p2, M04, T05, T04b-p1, T04b-p2, M02 | T07 §19.2 → `taxes` · Migrar vivo · O4 | Cubierta |
| `IMPUESTOS_X_CAT` | M06 (dueño), M04, M02, T10 | T07 §19.2 → `taxApplicability` · Migrar vivo · O4 | Cubierta |
| `PRCAGAS` | M05 (dueño), M04, M11, T05, M02, M03, T12-p1 | T07 §19.2 → `billableItems` (`pending`) · Migrar vivo · O4 | Cubierta |
| `PROD_SER` | M02 (dueño), T04b-p2, T04b-p3, T04b-p1, M04, M13, T05, (+3) | T07 §19.2 → `products` · Migrar vivo · O2 | Cubierta |
| `PROD_SER_REC_DES` | M04 (dueño), T05, M02 | T07 §19.2 → `productSurchargeRules` · Migrar vivo · O4 | Cubierta |
| `PROPIESER` | M02 (dueño), M04, M01, T12-p1, T05, M03 | T07 §19.2 → `serviceProperties` · Migrar vivo · O7 | Cubierta |
| `RECARGOS` | M04 (dueño), M02, T05 | T07 §19.2 → `surchargeRules` · Migrar vivo · O4 | Cubierta |
| `REFEREN` | T04 (dueño), M04, M02 | T07 §19.2 → `locationReferences` · Migrar vivo · O1 | Cubierta |
| `SERVICIO` | M02 (dueño), M04, T04b-p2, T04b-p1, T05, M17, M05, (+1) | T07 §19.2 → `services` · Migrar vivo · O2 | Cubierta |
| `SERVICIO_EXTRAS` | M02 (dueño), M04, M10, T05, T04 | T07 §19.2 → `services` (estados por defecto) · Migrar vivo · O2 | Cubierta |
| `TAR_ADHE` | M04 (dueño), M18, T12-p2, M02, T05 | T07 §19.2 → `adherentRates` (nombre canónico COL-TAR-05, antes `dependentTariffs`) · Migrar vivo · O4 | Cubierta |
| `TEMPMODIFBONIF` | M04 (dueño), M02, T05 | T07 §19.2 → Descartar · No migrar · O4 | Descartada (Tabla temporal (RN-MIG-046).) |
| `TIP_SERVI` | M02 (dueño), M04, T05 | T07 §19.2 → `serviceTypes` · Migrar vivo · O2 | Cubierta |
| `TIPOLOTE` | M13 (antes T04; CTR-DAT-46) (dueño), M04, M13, T05, M02 | T07 §19.2 → `lotTypes` · Migrar vivo · O3 (antes O1) | Cubierta |
| `USOINM` | T04 (dueño), M01, M04, M02 | T07 §19.2 → `propertyUses` · Migrar vivo · O1 | Cubierta |

### 13.3 CAT §3 — Medición y consumos (24 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `AUDITORIA_TELEMEDICION` | M03 (dueño), T06, T05 | T07 §19.3 → Descartar · No migrar · O7 | Descartada (Log técnico; queda en archivo.) |
| `CERESTAD` | M03 (dueño), M02, T05 | T07 §19.3 → `readingCertificateCodes` · Migrar vivo · O7 | Cubierta |
| `CONNRUTA` | M03 (dueño), T05 | T07 §19.3 → `readingRoutes` · Migrar vivo · O7 | Cubierta |
| `CONNZONA` | M03 (dueño), T05 | T07 §19.3 → `readingRoutes.zones` · Migrar vivo · O7 | Cubierta |
| `CONS_SER` | M03 (dueño), T12-p2, T05, M04, M18 | T07 §19.3 → `readings` + `consumptions` · Migrar vivo · O7 | Cubierta |
| `CONS_SER_TESTIGO` | M03 (dueño), M04, T05 | T07 §19.3 → `controlMeterReadings` · Histórico · O7 | Cubierta |
| `CONSUMOP` | M03 (dueño), T05 | T07 §19.3 → `ownMeterReadings` · Migrar vivo · O7 | Cubierta |
| `DISPOSI` | M03 (dueño), T05 | T07 §19.3 → `meters` · Migrar vivo · O7 | Cubierta |
| `DST_CONSUMO` | M03 (dueño), T05 | T07 §19.3 → `consumptionDistributions` · Migrar vivo · O7 | Cubierta |
| `HIS_MEDSOC` | M03 (dueño), T05 | T07 §19.3 → `meterInstallations` (cerradas) · Histórico · O7 | Cubierta |
| `HISWORK` | M03 (dueño), M09, T05 | T07 §19.3 → Histórico (legacyRecords) · Histórico · O7 | Cubierta |
| `IMP_WORK` | M03 (dueño), M09, T05 | T07 §19.3 → Descartar · No migrar · O7 | Descartada (Tabla de trabajo; durante el paralelo se lee como delta (PA-MIG-03).) |
| `LEC_MEDTEL` | M03 (dueño), M01, T05 | T07 §19.3 → `telemetryRegisterMaps` · Migrar vivo · O7 | Cubierta |
| `MARMED` | M03 (dueño), T05 | T07 §19.3 → `meterBrands` · Migrar vivo · O7 | Cubierta |
| `MED_TESTIGO` | M03 (dueño), M04, T05 | T07 §19.3 → `controlMeters` · Migrar vivo · O7 | Cubierta |
| `MEDIDORP` | M03 (dueño), T05 | T07 §19.3 → `ownMeters` · Migrar vivo · O7 | Cubierta |
| `MEDSOC` | M03 (dueño), M04, T05, M01 | T07 §19.3 → `meterInstallations` (vigentes) · Migrar vivo · O7 | Cubierta |
| `OBSESTAD` | M03 (dueño), M02, M10, T05 | T07 §19.3 → `readingObservationCodes` · Migrar vivo · O7 | Cubierta |
| `OBSMED` | M03 (dueño), T05 | T07 §19.3 → `meterObservationCodes` · Migrar vivo · O7 | Cubierta |
| `RESESTAD` | M03 (dueño), M02, T05 | T07 §19.3 → `readingResultCodes` · Migrar vivo · O7 | Cubierta |
| `SERSOC_DEMANDASXPERIODO` | M03 (dueño), M02, M04, T05, M01 | T07 §19.3 → `demandRecords` · Migrar vivo · O7 | Cubierta |
| `TELEMED_COMM` | M03 (dueño), M10, T06, T05 | T07 §19.3 → `remoteMeterCommands` · Histórico · O7 | Cubierta |
| `TELEMEDICION` | M03 (dueño), M10, T05, T06 | T07 §19.3 → `telemetrySystems` + bóveda (T06) · Migrar vivo · O7 | Cubierta |
| `TIPMED` | M03 (dueño), T05 | T07 §19.3 → `meterTypes` · Migrar vivo · O7 | Cubierta |

### 13.4 CAT §4 — Facturación (35 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ANTICIPOS` | M07 (dueño), M05, T05, M04 | T07 §19.4 → `creditBalances` · Migrar vivo · O5 | Cubierta |
| `ANTIFACTU` | M07 (dueño), M05, M04, T05 | T07 §19.4 → `creditBalanceApplications` · Histórico · O5 | Cubierta |
| `ANUFAC` | M05 (dueño), M07, T05 | T07 §19.4 → `invoices` (estado `voided`) · Histórico · O4 | Cubierta |
| `ANUITEMSFAC` | M05 (dueño), T05 | T07 §19.4 → `invoices.lines` (de anuladas) · Histórico · O4 | Cubierta |
| `ANUITEMSFAC_EXTRAS` | M05 (dueño), T04 | T07 §19.4 → `invoices.lines` (de anuladas) · Histórico · O4 | Cubierta |
| `CAUBLOQ` | M08 (dueño), M01, M05, T05 | T07 §19.4 → `holdReasons` · Migrar vivo · O5 | Cubierta |
| `CLASIFICACION_ITEMS` | M13 (dueño), M05, T05 | T07 §19.4 → `itemClassifications` · Migrar vivo · O3 | Cubierta |
| `COMPROB` | M05 (dueño), T04b-p1, T05, T04b-p2, T11, T04b-p3 | T07 §19.4 → `documentTypes` · Migrar vivo · O4 | Cubierta |
| `COMPROBANTES_ADM` | M05 (dueño), M06, T05 | T07 §19.4 → Histórico (legacyRecords) · Histórico · O4 | Cubierta |
| `CONJUNTO` | M05 (dueño), T05 | T07 §19.4 → `billingSets` · Migrar vivo · O4 | Cubierta |
| `CREDITOS_NOAUTOMATICOS` | M05 (dueño), M07, T05 | T07 §19.4 → `invoices.flags` · Histórico · O4 | Cubierta |
| `FAC_EXTRAS` | M05 (dueño), T04, T05 | T07 §19.4 → `invoices.paymentCodes` + `legacyKeyAliases` · Migrar vivo · O4 | Cubierta |
| `FAC_EXTRAS_ITEMS` | M05 (dueño), T05 | T07 §19.4 → `invoices.printExtras` · Migrar vivo · O4 | Cubierta |
| `FACTMES` | M05 (dueño), T05 | T07 §19.4 → `billingRuns` (históricos) · Histórico · O4 | Cubierta |
| `FACTMES_COMP` | M05 (dueño), T05 | T07 §19.4 → `billingRuns.documentRanges` · Histórico · O4 | Cubierta |
| `FACTMES_CTAS` | M05 (dueño), T05 | T07 §19.4 → `billingRuns.accounts` · Histórico · O4 | Cubierta |
| `FACTURAS` | M05 (dueño), M07, T05, M08, M06, M17, M01, (+1) | T07 §19.4 → `invoices` · Migrar vivo · O4 | Cubierta |
| `FACTURAS_EXTRAS` | M05 (dueño), T04, T05 | T07 §19.4 → `invoices.currency` · Migrar vivo · O4 | Cubierta |
| `GRUPOS_FACTURA` | M05 (dueño), T05 | T07 §19.4 → `billingGroups` · Migrar vivo · O4 | Cubierta |
| `GRUPOS_GRAFICO` | M05 (dueño), T05 | T07 §19.4 → `invoiceLayouts.consumptionChartGroups` · Migrar vivo · O4 | Cubierta |
| `HISBLOQ` | M08 (dueño), M01, M05, T05 | T07 §19.4 → `documentHolds` (historial) · Histórico · O5 | Cubierta |
| `ITEMSFAC` | M05 (dueño), M04 | T07 §19.4 → `invoices.lines` · Migrar vivo · O4 | Cubierta |
| `ITEMSFAC_EXTRAS` | M05 (dueño), M04, T04 | T07 §19.4 → `invoices.lines` · Migrar vivo · O4 | Cubierta |
| `ITEMSORD` | M05 (dueño), M10, T05 | T07 §19.4 → `invoiceLayouts.lineOrder` · Migrar vivo · O4 | Cubierta |
| `OB_FACT` | M05 (dueño), T05 | T07 §19.4 → `invoices.notes` · Migrar vivo · O4 | Cubierta |
| `PARSERFA` | M05 (dueño), T05 | T07 §19.4 → `billingCycles.serviceParams` · Migrar vivo · O4 | Cubierta |
| `POSTALES` | M05 (dueño), M04, T04, T05 | T07 §19.4 → `postalCarriers` · Migrar vivo · O4 | Cubierta |
| `PREPAGA` | M05 (dueño), M02, M04 | T07 §19.4 → `prepaidSales` · Migrar vivo · O7 | Cubierta |
| `RELACION_COMP` | M05 (dueño), M06, T05 | T07 §19.4 → `documentLinks` · Migrar vivo · O4 | Cubierta |
| `SFACTME` | M05 (dueño), T05 | T07 §19.4 → `billingRuns.services` · Histórico · O4 | Cubierta |
| `SUMNOFAC` | M01 (dueño), M05, T05, M02 | T07 §19.4 → `blocks` (efecto no facturar) · Migrar vivo · O2 | Cubierta |
| `TALONFAC` | M05 (dueño), M07, T05 | T07 §19.4 → `paymentStubs` · Migrar vivo · O4 | Cubierta |
| `TALONFAC_HST` | M05 (dueño), T05 | T07 §19.4 → `paymentStubs` (versiones) · Histórico · O4 | Cubierta |
| `TIP_COMP` | M05 (dueño), T05 | T07 §19.4 → `documentTypeGroups` · Migrar vivo · O4 | Cubierta |
| `TIPO_FAC` | M05 (dueño), T04b-p2, M04, M15, T04b-p3, M08, T05, (+3) | T07 §19.4 → `billingCycles` · Migrar vivo · O4 | Cubierta |

### 13.5 CAT §5 — Fiscal / ARCA / impuestos (26 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ACTAFIP` | M06 (dueño), T06, M01, T05 | T07 §19.5 → `economicActivities` · Migrar vivo · O4 | Cubierta |
| `ALI_IBR` | M06 (dueño), T04, T05, M04 | T07 §19.5 → `grossIncomeRates` · Migrar vivo · O4 | Cubierta |
| `ALI_IBR_CF` | M06 (dueño), T04, M04 | T07 §19.5 → `grossIncomeRates.byCondition` · Migrar vivo · O4 | Cubierta |
| `ALI_IBR_COMP` | M06 (dueño), T04, M04 | T07 §19.5 → `grossIncomeRates.byDocumentType` · Migrar vivo · O4 | Cubierta |
| `ALI_IVA` | M06 (dueño), M15, T04, T05, M11 | T07 §19.5 → `vatRates` (tenant: cuentas) · Migrar vivo · O4 | Cubierta |
| `ALI_IVA_CF` | M06 (dueño), T04, M04, T05 | T07 §19.5 → `vatRates.byCondition` · Migrar vivo · O4 | Cubierta |
| `CAT_RETG` | M06 (dueño), M12, T05 | T07 §19.5 → Reemplazado por tabla normativa de plataforma · No migrar · O8 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `CESPAFIP` | M06 (dueño), T06, T05 | T07 §19.5 → `caeaCodes` · Histórico · O4 | Cubierta |
| `COMPPOS` | M06 (dueño), M05, M11, T11, T05, T04 | T07 §19.5 → `fiscalNumbering` · Migrar vivo · O4 | Cubierta |
| `CVPIIBB` | M06 (dueño), T04, T06, T05 | T07 §19.5 → `provincialValidationCodes` · Migrar vivo · O4 | Cubierta |
| `ELECTRONICA_FC` | M06 (dueño), T06, T05 | T07 §19.5 → `invoices.fiscalAuthorization` · Histórico · O4 | Cubierta |
| `ELECTRONICA_IVA` | M06 (dueño), T06 | T07 §19.5 → `invoices.fiscalAuthorization.vat` · Histórico · O4 | Cubierta |
| `ELECTRONICA_RELCOMP` | M06 (dueño), T06 | T07 §19.5 → `invoices.fiscalAuthorization.related` · Histórico · O4 | Cubierta |
| `ELECTRONICA_TRIB` | M06 (dueño), T06 | T07 §19.5 → `invoices.fiscalAuthorization.taxes` · Histórico · O4 | Cubierta |
| `EMPAFIP` | M06 (dueño), T06, T05 | T07 §19.5 → Reemplazado por consulta de padrón ARCA (M06) · No migrar · O4 | Reemplazada (Reemplazado por consulta de padrón ARCA (M06)) |
| `ENGAS_CANTMESES` | M06 (dueño), M02, T10, T06, T12-p1 | T07 §19.5 → `regulatoryReports` (históricos) · Histórico · O7 | Cubierta |
| `IIBB_LUA` | M06 (dueño), T04, T05, T06, M04, M01 | T07 §19.5 → Reemplazado por importación del padrón vigente (M06) · No migrar · O4 | Reemplazada (Reemplazado por importación del padrón vigente (M06)) |
| `IVAVTA` | M06 (dueño), M11, T05, M08 | T07 §19.5 → `vatSalesBook` · Histórico · O4 | Cubierta |
| `PROD_SER_RET` | M06 (dueño), M12, M02, T05 | T07 §19.5 → `withholdingApplicability` · Migrar vivo · O8 | Cubierta |
| `PTOVENTA` | M06 (dueño), M05, T11, T02, T06, T05, T04, (+3) | T07 §19.5 → `pointsOfSale` · Migrar vivo · O4 | Cubierta |
| `RET_COM` | M06 (dueño), M12, T05 | T07 §19.5 → `withholdingsIssued` · Migrar vivo · O8 | Cubierta |
| `RETE_TIPO` | M06 (dueño), M15, T05, M12 | T07 §19.5 → `withholdingTypes` · Migrar vivo · O8 | Cubierta |
| `RETE_TIPO_BASE` | M06 (dueño), M12, T05 | T07 §19.5 → `withholdingTypes.bases` · Migrar vivo · O8 | Cubierta |
| `RETS_TIPO` | M06 (dueño), M15, M14, T05, M12 | T07 §19.5 → `sufferedWithholdingTypes` · Migrar vivo · O5 | Cubierta |
| `SITIBR` | M06 (dueño), T04, T04b-p1, M04, T05 | T07 §19.5 → `grossIncomeConditions` · Migrar vivo · O4 | Cubierta |
| `SITIVA` | M06 (dueño), T04, M05, M01, M12, T05, T04b-p1, (+2) | T07 §19.5 → `taxConditions` · Migrar vivo · O4 | Cubierta |

### 13.6 CAT §6 — Cobranza y caja (21 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ANUIT_PAGSO` | M07 (dueño), T05 | T07 §19.6 → `receipts.allocations` (anulados) · Histórico · O5 | Cubierta |
| `ANUPAG_SOC` | M07 (dueño), T05 | T07 §19.6 → `receipts` (estado `voided`) · Histórico · O5 | Cubierta |
| `ANUPLAN_CAJ` | M07 (dueño), T05 | T07 §19.6 → `cashMovements` (anulados) · Histórico · O5 | Cubierta |
| `CAJAS` | M07 (dueño), M14, T05 | T07 §19.6 → `cashSessions` · Histórico · O5 | Cubierta |
| `CAJAS_QR` | M07 (dueño), T05, T06 | T07 §19.6 → `cashRegisters.qr` · Migrar vivo · O5 | Cubierta |
| `CAJASJP` | M07 (dueño), T04, T05 | T07 §19.6 → `cashRegisters` · Migrar vivo · O5 | Cubierta |
| `COBRANZA_LOG` | M07 (dueño) | T07 §19.6 → Histórico (legacyRecords) · Histórico · O5 | Cubierta |
| `CUPONTAR` | M14 (dueño), M07, T05 | T07 §19.6 → `cardVouchers` · Migrar vivo · O8 | Cubierta |
| `DESCUENTO_CAJA` | M07 (dueño), M08, T05 | T07 §19.6 → `cashDiscountRules` · Migrar vivo · O5 | Cubierta |
| `EFEC_OP` | M07 (dueño), M14, T05 | T07 §19.6 → `cashMovements.cash` · Histórico · O5 | Cubierta |
| `ESQUEMAS_INFORMES_COBRANZAS` | T10 (dueño), M07 | T07 §19.6 → Reemplazado por vistas guardadas e informes (T10) · No migrar · O11 | Reemplazada (Reemplazado por vistas guardadas e informes (T10)) |
| `IT_PAGSO` | M07 (dueño), T05 | T07 §19.6 → `receipts.allocations` · Histórico · O5 | Cubierta |
| `PAG_SOC` | M07 (dueño), T05 | T07 §19.6 → `receipts` · Histórico · O5 | Cubierta |
| `PLAN_CAJ` | M07 (dueño), M14, T05 | T07 §19.6 → `cashMovements` · Histórico · O5 | Cubierta |
| `RETENCIO` | M07 (dueño), M14, T05 | T07 §19.6 → `withholdingsSuffered` · Histórico · O5 | Cubierta |
| `TALONFAC_PAGO` | M07 (dueño), M05, T05 | T07 §19.6 → `receipts.allocations.stubId` · Histórico · O5 | Cubierta |
| `TARJETAS` | M07 (dueño), M14, T05 | T07 §19.6 → `paymentCards` · Migrar vivo · O5 | Cubierta |
| `TARJETAS_RECARGO` | M07 (dueño), M14, T05 | T07 §19.6 → `paymentCards.installmentSurcharges` · Migrar vivo · O5 | Cubierta |
| `TIP_VAL` | M07 (dueño), M15, M14, T05 | T07 §19.6 → `paymentMethods` · Migrar vivo · O5 | Cubierta |
| `TRAN_OP` | M07 (dueño), M14, T05 | T07 §19.6 → `cashMovements.transfers` · Histórico · O5 | Cubierta |
| `VALORES` | M14 (dueño), M07, T05 | T07 §19.6 → `thirdPartyChecks` · Migrar vivo · O8 | Cubierta |

### 13.7 CAT §7 — Entes recaudadores y pagos electrónicos (13 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `BANCOS` | M07 (dueño), T05, M14, T06, M05 | T07 §19.7 → `collectionAgents` · Migrar vivo · O5 | Cubierta |
| `CANALES_PAGOS` | M07 (dueño), T06, M19 | T07 §19.7 → Reemplazado por pasarelas configuradas (M07/T06) · No migrar · O5 | Reemplazada (Reemplazado por pasarelas configuradas (M07/T06)) |
| `DEBITO_EXCLUSION` | M07 (dueño), M01 | T07 §19.7 → `directDebitExclusions` · Migrar vivo · O5 | Cubierta |
| `DEUDARED` | M07 (dueño), M04, T05, T06 | T07 §19.7 → `agencyPublishedDebts` · Migrar vivo · O5 | Cubierta |
| `DEUDARED_TIPO` | M07 (dueño), M04, T05, T06 | T07 §19.7 → `agencyPublishedDebts` (tipo) · Migrar vivo · O5 | Cubierta |
| `FACTURAS_TERCEROS` | M06 (dueño), M07, T12-p2, T06, T05 | T07 §19.7 → `thirdPartyCollections` · Migrar vivo · O5 | Cubierta |
| `PAGOS360` | M07 (dueño), T06, M19, T08, T05 | T07 §19.7 → `paymentGatewayRequests` · Migrar vivo · O5 | Cubierta |
| `PAGOS360_EXTRAS` | M07 (dueño), T04, T05, T06, M19 | T07 §19.7 → `paymentGatewayRequests.metadata` · Histórico · O5 | Cubierta |
| `PAGOS360_ITEMS` | M07 (dueño), T05, T06 | T07 §19.7 → `paymentGatewayRequests.items` · Migrar vivo · O5 | Cubierta |
| `PAGOS360_PAGOS` | M07 (dueño), T06, T05, M19 | T07 §19.7 → `gatewayPayments` · Histórico · O5 | Cubierta |
| `RED_LINK` | M07 (dueño), T05, T06 | T07 §19.7 → `networkDebtPublications` + `legacyKeyAliases` · Migrar vivo · O5 | Cubierta |
| `SIRO_BASEDEUDA` | M07 (dueño), T06 | T07 §19.7 → `networkDebtPublications` (SIRO) · Histórico · O5 | Cubierta |
| `TERCEROS` | M06 (dueño), M07, T04b-p1, T05, T06, T12-p2 | T07 §19.7 → `thirdPartyAgreements` · Migrar vivo · O5 | Cubierta |

### 13.8 CAT §8 — Mora y notificaciones (17 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `CAUSAS` | T04 (dueño), M08 | T07 §19.8 → `causes` · Migrar vivo · O1 | Cubierta |
| `CIRCUCTA` | M08 (dueño) | T07 §19.8 → Histórico (legacyRecords) · Histórico · O6 | Cubierta |
| `CIRCULAR` | T09 (dueño), M09, M08, T11 | T07 §19.8 → `messageTemplates` (mora) · Migrar vivo · O6 | Cubierta |
| `COMPNOTI` | M08 (dueño), M07, T05 | T07 §19.8 → `delinquencyNotices.documents` · Migrar vivo · O6 | Cubierta |
| `CONCEPTOS_INT` | M08 (dueño), T04b-p3 | T07 §19.8 → `interestConcepts` · Migrar vivo · O6 | Cubierta |
| `EXC_MORA` | M08 (dueño) | T07 §19.8 → `delinquencyExceptions` · Migrar vivo · O6 | Cubierta |
| `INDICESMORA` | M08 (dueño), T04, T05 | T07 §19.8 → `interestIndexes` · Migrar vivo · O6 | Cubierta |
| `INSTANCI` | M08 (dueño), T04b-p3 | T07 §19.8 → `delinquencyInstances` · Migrar vivo · O6 | Cubierta |
| `INT_DIFE` | M08 (dueño), T05 | T07 §19.8 → `deferredInterest` · Migrar vivo · O6 | Cubierta |
| `IT_PAGSO_INTERES` | M08 (dueño), M07, T05 | T07 §19.8 → `receipts.allocations.interest` · Histórico · O6 | Cubierta |
| `IT_PAGSO_INTERES_TRAMAS` | M08 (dueño), M07, T05 | T07 §19.8 → `receipts.allocations.interest.brackets` · Histórico · O6 | Cubierta |
| `MORATAS` | M08 (dueño) | T07 §19.8 → `interestRates` · Migrar vivo · O6 | Cubierta |
| `MORATAS_CATSER` | M08 (dueño) | T07 §19.8 → `interestRates.categories` · Migrar vivo · O6 | Cubierta |
| `MOROSO_TEMPORAL` | M08 (dueño) | T07 §19.8 → Descartar · No migrar · O6 | Descartada (Temporal (RN-MIG-046).) |
| `NOTIFICA` | M08 (dueño), T05, T09 | T07 §19.8 → `delinquencyNotices` · Migrar vivo · O6 | Cubierta |
| `TABMORA` | M08 (dueño), T04, T05 | T07 §19.8 → `interestRateTables` · Migrar vivo · O6 | Cubierta |
| `TRAMASREC` | M08 (dueño), M05, T05 | T07 §19.8 → `surchargeBrackets` · Migrar vivo · O6 | Cubierta |

### 13.9 CAT §9 — Financiación y convenios (6 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `DEUDAVTA` | M08 (dueño), M11, T05, M07, M05 | T07 §19.9 → `installmentReceivables` · Migrar vivo · O6 | Cubierta |
| `FORMAPA` | T04 (dueño), M07, M08, T05 | T07 §19.9 → `paymentTerms` · Migrar vivo · O1 | Cubierta |
| `IT_RECCO` | M08 (dueño), T05, M07 | T07 §19.9 → `paymentPlans.items` · Migrar vivo · O6 | Cubierta |
| `PLAN_CUO` | M08 (dueño) | T07 §19.9 → `financingPlans` · Migrar vivo · O6 | Cubierta |
| `REC_CON` | M08 (dueño), T05, M07 | T07 §19.9 → `paymentPlans` · Migrar vivo · O6 | Cubierta |
| `TIP_FIN` | M08 (dueño), T05 | T07 §19.9 → `financingPlans.calculationMethod` · Migrar vivo · O6 | Cubierta |

### 13.10 CAT §10 — Técnica, reclamos y obras (38 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `AVL_REG` | M18 (dueño), M10, T06, T05, T03 | T07 §19.10 → Histórico (legacyRecords) · Histórico · O10 | Cubierta |
| `CAT_INCI` | M10 (dueño), M15, M09, T05 | T07 §19.10 → `workCategories` · Migrar vivo · O8 | Cubierta |
| `CHOFERES` | M18 (dueño), M10, T05, T03 | T07 §19.10 → `drivers` · Migrar vivo · O10 | Cubierta |
| `CLAS_INC` | M10 (dueño), M09, T11 | T07 §19.10 → `workClasses` · Migrar vivo · O8 | Cubierta |
| `EXPEDIENTES` | M10 (dueño), T11, T05, M01 | T07 §19.10 → `technicalFiles` · Migrar vivo · O7 | Cubierta |
| `EXPEDIENTES_TRAM` | M10 (dueño), T11, M01, M09, T05 | T07 §19.10 → `technicalFiles.steps` · Migrar vivo · O7 | Cubierta |
| `FACTIBIL` | M10 (dueño), M02, M09, T05 | T07 §19.10 → `feasibilityRequests` · Migrar vivo · O3 | Cubierta |
| `FACTIBIL_NOTA` | M10 (dueño) | T07 §19.10 → `feasibilityRequests.notes` · Migrar vivo · O3 | Cubierta |
| `FALLAS` | M10 (dueño), M09 | T07 §19.10 → `failureTypes` · Migrar vivo · O3 | Cubierta |
| `GRPOBRA` | M10 (dueño), M15, T12-p2, T05 | T07 §19.10 → `workGroups` · Migrar vivo · O7 | Cubierta |
| `GRPTAREA` | M10 (dueño) | T07 §19.10 → `taskGroups` · Migrar vivo · O3 | Cubierta |
| `MOVIL` | M18 (dueño), M10, M01, M03, M04, T05, T06, (+1) | T07 §19.10 → `vehicles` · Migrar vivo · O10 | Cubierta |
| `OBRAS` | M10 (dueño), T12-p2 | T07 §19.10 → `works` · Migrar vivo · O7 | Cubierta |
| `OT_REPORTE` | T11 (dueño), T10, M10, T05 | T07 §19.10 → Reemplazado por plantillas de documento (T11) · No migrar · O3 | Reemplazada (Reemplazado por plantillas de documento (T11)) |
| `PARTICUA` | M10 (dueño), M09 | T07 §19.10 → `crews.members` · Migrar vivo · O3 | Cubierta |
| `PARTIINC` | M10 (dueño), M09 | T07 §19.10 → `works.participants` · Histórico · O8 | Cubierta |
| `PARTIORD` | M10 (dueño), M09 | T07 §19.10 → `workOrders.laborHours` · Histórico · O3 | Cubierta |
| `PROFESIO` | M10 (dueño), M02, M01, T12-p2, T05 | T07 §19.10 → `licensedProfessionals` · Migrar vivo · O7 | Cubierta |
| `RECLAMOS` | M09 (dueño), M10, T05 | T07 §19.10 → `claims` · Migrar vivo · O2 | Cubierta |
| `RECLAMOS_HIST` | M09 (dueño), M10, T05 | T07 §19.10 → `claims.statusHistory` · Histórico · O2 | Cubierta |
| `RECLAMOS_NOTAS` | M09 (dueño), M10, T05 | T07 §19.10 → `claims.notes` · Migrar vivo · O2 | Cubierta |
| `RESOL_OT` | M10 (dueño), M09 | T07 §19.10 → `workOrderResolutions` · Migrar vivo · O3 | Cubierta |
| `RESPONSA` | M10 (dueño), M01, M09, M12 | T07 §19.10 → `fieldResources` (+ propuesta de `users` T02) · Migrar vivo · O3 | Cubierta |
| `RESPONSA_NOTIFICA` | T09 (dueño), M09, T11, M10, M08, T05 | T07 §19.10 → `notificationRules` · Migrar vivo · O3 | Cubierta |
| `RUB_REC` | M09 (dueño), T09, M10 | T07 §19.10 → `claimCategories` · Migrar vivo · O2 | Cubierta |
| `TAREAS` | M10 (dueño), T05 | T07 §19.10 → `tasks` · Migrar vivo · O3 | Cubierta |
| `TAREASOM` | M10 (dueño), T05 | T07 §19.10 → `tasks` (por grupo/servicio) · Migrar vivo · O3 | Cubierta |
| `TAROTM` | M10 (dueño) | T07 §19.10 → `workOrders.tasks` · Migrar vivo · O3 | Cubierta |
| `TECNGREXP` | M10 (dueño) | T07 §19.10 → Reemplazado por app de campo offline (M10/CNX §3.7) · No migrar · O3 | Reemplazada (Reemplazado por app de campo offline (M10/CNX §3.7)) |
| `TECNICA` | M10 (dueño), M09, M08, M02, T05 | T07 §19.10 → `workOrders` · Migrar vivo · O3 | Cubierta |
| `TECNICA_EXTRAS` | M10 (dueño), T05, M09, T04 | T07 §19.10 → `workOrders.damageClaim` · Migrar vivo · O3 | Cubierta |
| `TECNICA_MOVIL` | M10 (dueño) | T07 §19.10 → `workOrders.vehicles` · Histórico · O3 | Cubierta |
| `TECNICA_NECESIDAD` | M10 (dueño), M09 | T07 §19.10 → `workOrders.materials` · Migrar vivo · O3 | Cubierta |
| `TECNICA_NOTA` | M10 (dueño) | T07 §19.10 → `workOrders.notes` · Migrar vivo · O3 | Cubierta |
| `TECNOTEXP` | M10 (dueño) | T07 §19.10 → Reemplazado por app de campo offline · No migrar · O3 | Reemplazada (Reemplazado por app de campo offline) |
| `TECNSEEXP` | M10 (dueño) | T07 §19.10 → Reemplazado por app de campo offline · No migrar · O3 | Reemplazada (Reemplazado por app de campo offline) |
| `TPTRAB` | M10 (dueño), T05 | T07 §19.10 → `workOrderTypes` · Migrar vivo · O3 | Cubierta |
| `TRANSAC` | M10 (dueño), T11, T09, M09, T04b-p1 | T07 §19.10 → `workOrderTypes.transitions` · Migrar vivo · O3 | Cubierta |

### 13.11 CAT §11 — Redes (GIS) (12 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `NIV_CAPA` | M10 (dueño) | T07 §19.11 → `networkLayers` · Migrar vivo · O3 | Cubierta |
| `NIV_REDES` | M10 (dueño), T05 | T07 §19.11 → `networkElements` · Migrar vivo · O3 | Cubierta |
| `NIV_SERV` | M10 (dueño) | T07 §19.11 → `networkComponentTypes` · Migrar vivo · O3 | Cubierta |
| `REDES` | M10 (dueño), T05 | T07 §19.11 → `networks` · Migrar vivo · O3 | Cubierta |
| `REDES_ATRIBUTOS` | M10 (dueño), T05 | T07 §19.11 → `networkElements.attributes` · Migrar vivo · O3 | Cubierta |
| `REDES_ATRIBUTOS_COMPONENTES` | M10 (dueño) | T07 §19.11 → `networkComponentTypes.attributeDefs` · Migrar vivo · O3 | Cubierta |
| `REDES_CAPAS` | M10 (dueño) | T07 §19.11 → `networkLayers` · Migrar vivo · O3 | Cubierta |
| `REDES_COMPONENTES` | M10 (dueño) | T07 §19.11 → `networkComponentTypes` · Migrar vivo · O3 | Cubierta |
| `REDES_RED_INSTALADA` | M10 (dueño) | T07 §19.11 → `networkElements` · Migrar vivo · O3 | Cubierta |
| `REDES_RELACIONES_COMPONENTES` | M10 (dueño) | T07 §19.11 → `networkComponentTypes.allowedChildren` · Migrar vivo · O3 | Cubierta |
| `REDES_SERVICIOS` | M10 (dueño) | T07 §19.11 → `networks.services` · Migrar vivo · O3 | Cubierta |
| `SERSOC_REDES` | M10 (dueño), M02, M01 | T07 §19.11 → `networkConnections` · Migrar vivo · O3 | Cubierta |

### 13.12 CAT §12 — Telefonía e internet (39 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `BANCLA` | M04 (dueño), M14, M10, M02, M09 | T07 §19.12 → `phoneRatingKeys` · Migrar vivo · O10 | Cubierta |
| `BANDAS` | M04 (dueño), M10, M03, M09, M02 | T07 §19.12 → `phoneTimeBands` · Migrar vivo · O10 | Cubierta |
| `CARACTER` | M10 (dueño), T04b-p2, T04b-p1, T04, M04, M02 | T07 §19.12 → `phoneNumberingBlocks` · Migrar vivo · O10 | Cubierta |
| `CENTRALT` | M10 (dueño), M02, T12-p1 | T07 §19.12 → `phoneSwitches` · Migrar vivo · O10 | Cubierta |
| `CLAVES` | M04 (dueño), T02, M10, T01, M02 | T07 §19.12 → `phoneRatingKeys` · Migrar vivo · O10 | Cubierta |
| `CORREOSINT` | M10 (dueño), M02, T06, M09, T12-p2 | T07 §19.12 → `provisionedMailboxes` · Migrar vivo · O10 | Cubierta |
| `ENTRANTE` | M10 (dueño), M09, M02 | T07 §19.12 → `callRecords` (entrantes) · Histórico · O10 | Cubierta |
| `GRATIS` | M04 (dueño), M02, M10, M09 | T07 §19.12 → `phoneFreeNumbers` · Migrar vivo · O10 | Cubierta |
| `INTERNAC` | M10 (dueño), M18, M02, T05, T03, T04b-p2, M09, (+1) | T07 §19.12 → `callRecords` · Histórico · O10 | Cubierta |
| `INTERNET` | M10 (dueño), M02, T05, T12-p1 | T07 §19.12 → `internetProvisioning` · Migrar vivo · O3 | Cubierta |
| `LLA_CEL` | M10 (dueño), M02, M09, M05, T05 | T07 §19.12 → `callRecords` (CPP) · Histórico · O10 | Cubierta |
| `LLAMADAS` | M10 (dueño), M09, M02, T05, M04 | T07 §19.12 → `callRecords` · Histórico · O10 | Cubierta |
| `MIKROTIK` | M10 (dueño), M02, T12-p1, T03, T12-p2, T06 | T07 §19.12 → `provisioningDevices` + bóveda (T06) · Migrar vivo · O3 | Cubierta |
| `OPERADOR` | M10 (dueño), M02 | T07 §19.12 → `phoneCarriers` · Migrar vivo · O10 | Cubierta |
| `PLANDES` | M04 (dueño), M02, M10 | T07 §19.12 → `phoneDiscountPlans` · Migrar vivo · O10 | Cubierta |
| `RECHAZOS` | M10 (dueño), M07, T05, M02, M09 | T07 §19.12 → Histórico (legacyRecords) · Histórico · O10 | Cubierta |
| `SERTEL` | M04 (dueño), M02, T05, M10, T12-p1 | T07 §19.12 → `phoneServiceConcepts` · Migrar vivo · O10 | Cubierta |
| `TARCLA` | M04 (dueño), M10, M02 | T07 §19.12 → `phoneRates` · Migrar vivo · O10 | Cubierta |
| `TARESP` | M04 (dueño), M10, M02 | T07 §19.12 → `phoneRates.special` · Migrar vivo · O10 | Cubierta |
| `TARTEL` | M04 (dueño), M02, M10 | T07 §19.12 → `phoneTariffs` · Migrar vivo · O10 | Cubierta |
| `TEL_CAJAS` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (cajas) · Migrar vivo · O10 | Cubierta |
| `TEL_CENTRAL` | M10 (dueño), M02, T12-p1 | T07 §19.12 → `phoneSwitches` · Migrar vivo · O10 | Cubierta |
| `TEL_DSLAM` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (DSLAM) · Migrar vivo · O10 | Cubierta |
| `TEL_FRACCIONES` | M10 (dueño), M04, M02, M09 | T07 §19.12 → `callRecords.fractions` · Histórico · O10 | Cubierta |
| `TEL_GRUPOS_REPARTIDOR` | M10 (dueño), M02, M09 | T07 §19.12 → `phonePlant` (grupos) · Migrar vivo · O10 | Cubierta |
| `TEL_MODALIDAD` | M10 (dueño), M02, T12-p1 | T07 §19.12 → `phoneModalities` · Migrar vivo · O10 | Cubierta |
| `TEL_NUMEROS` | M10 (dueño), M02, T12-p1 | T07 §19.12 → `phoneNumbers` · Migrar vivo · O10 | Cubierta |
| `TEL_POS_REG_CAJA` | M10 (dueño), M11, M02 | T07 §19.12 → `phonePlant` (posiciones) · Migrar vivo · O10 | Cubierta |
| `TEL_POS_REG_GRUPOS` | M10 (dueño), M11, M02 | T07 §19.12 → `phonePlant` (posiciones) · Migrar vivo · O10 | Cubierta |
| `TEL_PREFIJO` | M10 (dueño), M02 | T07 §19.12 → `phonePrefixes` · Migrar vivo · O10 | Cubierta |
| `TEL_PUERTOS_CENTRAL` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (puertos) · Migrar vivo · O10 | Cubierta |
| `TEL_PUERTOS_DSLAM` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (puertos) · Migrar vivo · O10 | Cubierta |
| `TEL_REGLETAS_CAJAS` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (regletas) · Migrar vivo · O10 | Cubierta |
| `TEL_REGLETAS_GRUPOS` | M10 (dueño), M02 | T07 §19.12 → `phonePlant` (regletas) · Migrar vivo · O10 | Cubierta |
| `TEL_REPARTIDOR` | M10 (dueño), M02, M09 | T07 §19.12 → `phonePlant` (repartidores) · Migrar vivo · O10 | Cubierta |
| `TEL_SERSOC` | M10 (dueño), M02, T05, T12-p1 | T07 §19.12 → `phoneLines` · Migrar vivo · O10 | Cubierta |
| `TEL_SERVICIO` | M10 (dueño), M02, T05, T12-p1 | T07 §19.12 → `phoneServiceTypes` · Migrar vivo · O10 | Cubierta |
| `TIPOBAN` | M04 (dueño), M14, M10, M02 | T07 §19.12 → `phoneTimeBands.types` · Migrar vivo · O10 | Cubierta |
| `TIPOLLAM` | M04 (dueño), M09, M10, M02 | T07 §19.12 → `phoneCallTypes` · Migrar vivo · O10 | Cubierta |

### 13.13 CAT §13 — Ventas de productos y presupuestos (13 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `COMP_VEN` | M11 (dueño), M08, T05 | T07 §19.13 → `salesDocuments` · Migrar vivo · O8 | Cubierta |
| `COMP_VEN_RENDICION` | M18 (dueño), M11, T05 | T07 §19.13 → `tripSettlements` (`source.kind = salesDocument`) · Histórico · O8 (antes O10; COL-SOC-50) | Cubierta |
| `COMP_VEN_RENDICION_ITEMS` | M18 (dueño), M11, T05 | T07 §19.13 → `tripSettlements.items` (antes `tripSettlements.fuel`, nombre de M1... · Histórico · O8 (antes O10) | Cubierta |
| `IT_COMPV` | M11 (dueño), T05 | T07 §19.13 → `salesDocuments.lines` · Migrar vivo · O8 | Cubierta |
| `MAQUINAS` | M13 (dueño), M11, M18, T03, T05 | T07 §19.13 → `equipmentUnits` · Migrar vivo · O8 | Cubierta |
| `OB_COMPV` | M11 (dueño), T05 | T07 §19.13 → `salesDocuments.shipping` · Migrar vivo · O8 | Cubierta |
| `PRESUIT` | M11 (dueño), T05 | T07 §19.13 → `quotes.lines` · Migrar vivo · O8 | Cubierta |
| `PRESUIT_CONJUNTOS` | M11 (dueño), T05 | T07 §19.13 → `quotes.bundles` · Migrar vivo · O8 | Cubierta |
| `PRESUPU` | M11 (dueño), M10, M01, T05 | T07 §19.13 → `quotes` · Migrar vivo · O8 | Cubierta |
| `PRESUPU_COMPROBANTES` | M11 (dueño), M04, T05 | T07 §19.13 → `documentLinks` · Histórico · O8 | Cubierta |
| `PRESUPU_CONDICION` | M11 (dueño), T05 | T07 §19.13 → `salesConditions` · Migrar vivo · O8 | Cubierta |
| `PRESUPU_NOTAS` | M11 (dueño), T05 | T07 §19.13 → `quotes.notes` · Migrar vivo · O8 | Cubierta |
| `VENDEDOR` | M11 (dueño), T04b-p2, T05, T04b-p3 | T07 §19.13 → `salespeople` · Migrar vivo · O8 | Cubierta |

### 13.14 CAT §14 — Compras y proveedores (34 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `CMPORDE` | M11 (dueño), M12, T05 | T07 §19.14 → `documentLinks` · Histórico · O8 | Cubierta |
| `COMBUSTIBLES` | M18 (dueño), M12, T05 | T07 §19.14 → `fuelTypes` · Migrar vivo · O8 (antes O10; COL-SOC-48) | Cubierta |
| `COMP_COM` | M12 (dueño), T05 | T07 §19.14 → `purchaseReceipts` · Migrar vivo · O8 | Cubierta |
| `COMPRAS_RELACION` | M12 (dueño), T05 | T07 §19.14 → `documentChains` · Migrar vivo · O8 | Cubierta |
| `CON_COM` | M12 (dueño), M14, T05 | T07 §19.14 → `purchaseConcepts` · Migrar vivo · O8 | Cubierta |
| `CON_COM_RET` | M12 (dueño), M06, T05 | T07 §19.14 → `purchaseConcepts.withholdings` · Migrar vivo · O8 | Cubierta |
| `DESTINATARIO_SAPROV` | M12 (dueño), T05 | T07 §19.14 → `purchaseRequestRecipients` · Migrar vivo · O8 | Cubierta |
| `FPALIC_IVA` | M12 (dueño), M06, M07, T05 | T07 §19.14 → `supplierInvoices.vat` · Migrar vivo · O8 | Cubierta |
| `FPITEMS` | M12 (dueño), T05, M07 | T07 §19.14 → `supplierInvoices.lines` · Migrar vivo · O8 | Cubierta |
| `IT_APROV` | M12 (dueño) | T07 §19.14 → `purchaseRequests.lines` · Migrar vivo · O8 | Cubierta |
| `IT_COMPC` | M12 (dueño), T05 | T07 §19.14 → `purchaseReceipts.lines` · Migrar vivo · O8 | Cubierta |
| `IT_NPED` | M12 (dueño), T05 | T07 §19.14 → `purchaseOrders.lines` (pedidos) · Migrar vivo · O8 | Cubierta |
| `IT_SCOTIZ` | M12 (dueño) | T07 §19.14 → `quotationRequests.lines` · Migrar vivo · O8 | Cubierta |
| `IVACOM` | M12 (dueño), M06, T05 | T07 §19.14 → `supplierInvoices` · Migrar vivo · O8 | Cubierta |
| `IVACOM_COMBUSTIBLES` | M18 (dueño), M12, T05 | T07 §19.14 → `fuelLoads` (con `purchaseInvoiceRef` al comprobante de M12) · Histórico · O8 (antes O10; COL-SOC-49) | Cubierta |
| `IVACOM_WEB` | M12 (dueño), T05 | T07 §19.14 → `supplierPortalSubmissions` · Migrar vivo · O8 | Cubierta |
| `NPEDIDO` | M12 (dueño), T05 | T07 §19.14 → `purchaseOrders` (pedidos) · Migrar vivo · O8 | Cubierta |
| `OBS_PRO` | M12 (dueño), T05 | T07 §19.14 → `suppliers.notes` · Migrar vivo · O8 | Cubierta |
| `OCOMPRA` | M12 (dueño), T11, T05 | T07 §19.14 → `purchaseOrders` · Migrar vivo · O8 | Cubierta |
| `PREV_COM` | M12 (dueño), M14, T05 | T07 §19.14 → `purchaseForecasts` · Migrar vivo · O8 | Cubierta |
| `PROVEED` | M12 (dueño), M15, T05 | T07 §19.14 → `suppliers` · Migrar vivo · O8 | Cubierta |
| `PROVEED_AUT` | M12 (dueño), T05 | T07 §19.14 → `suppliers.authorizedPersons` · Migrar vivo · O8 | Cubierta |
| `PROVEED_CBU` | M12 (dueño), T05 | T07 §19.14 → `suppliers.bankAccounts` · Migrar vivo · O8 | Cubierta |
| `PROVEED_RET` | M12 (dueño), M06, T05 | T07 §19.14 → `suppliers.withholdings` · Migrar vivo · O8 | Cubierta |
| `PROVEED_TIPPROD` | M12 (dueño), T05 | T07 §19.14 → `suppliers.productTypes` · Migrar vivo · O8 | Cubierta |
| `PROVEED_VALORACIONES` | M12 (dueño), T05 | T07 §19.14 → `supplierEvaluations` · Histórico · O8 | Cubierta |
| `PROVSUM` | M12 (dueño), T05 | T07 §19.14 → `suppliers.accountLinks` · Migrar vivo · O8 | Cubierta |
| `RPSPROV` | M12 (dueño), T05 | T07 §19.14 → `supplierCategories` · Migrar vivo · O8 | Cubierta |
| `RPSXPROV` | M12 (dueño), T05 | T07 §19.14 → `suppliers.categories` · Migrar vivo · O8 | Cubierta |
| `RUBPROV` | M12 (dueño), T05 | T07 §19.14 → `supplierCategories` · Migrar vivo · O8 | Cubierta |
| `RUBXPRO` | M12 (dueño), T05 | T07 §19.14 → `suppliers.categories` · Migrar vivo · O8 | Cubierta |
| `SAPROV` | M12 (dueño), T11, T05 | T07 §19.14 → `purchaseRequests` · Migrar vivo · O8 | Cubierta |
| `SCOTIZ` | M12 (dueño) | T07 §19.14 → `quotationRequests` · Migrar vivo · O8 | Cubierta |
| `UNIDADES_GASTOS` | M13 (antes M12; CTR-DAT-54) (dueño), M12, M13, T05 | T07 §19.14 → `expenseUnits` · Migrar vivo · O8 | Cubierta |

### 13.15 CAT §15 — Stock, bienes de uso y fabricación (38 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `BIENES_USO` | M13 (dueño), M15, T05 | T07 §19.15 → `fixedAssets` · Migrar vivo · O8 | Cubierta |
| `BIENES_USO_AMORT` | M13 (dueño), M15, T05 | T07 §19.15 → `depreciations` · Histórico · O8 | Cubierta |
| `BIENES_USO_CTSEC` | M15 (dueño), M13 | T07 §19.15 → `fixedAssets.costAllocation` · Migrar vivo · O8 | Cubierta |
| `BIENES_USO_DISM` | M13 (dueño), M15, T05 | T07 §19.15 → `fixedAssets.impairments` · Migrar vivo · O8 | Cubierta |
| `BIENES_USO_HST` | M13 (dueño), M15, T05 | T07 §19.15 → `fixedAssets` (versiones) · Histórico · O8 | Cubierta |
| `COMBOS` | M02 (dueño), T04, M13, T05 | T07 §19.15 → `products.bundle` · Migrar vivo · O2 | Cubierta |
| `DEPAPROD` | M13 (dueño), T05 | T07 §19.15 → `productDepartments` · Migrar vivo · O8 | Cubierta |
| `DEPOSITO` | M13 (dueño), T05 | T07 §19.15 → `warehouses` · Migrar vivo · O3 | Cubierta |
| `ESTADOS_RECEP` | M13 (dueño), M12, T05 | T07 §19.15 → `equipmentReceptionStates` · Migrar vivo · O8 | Cubierta |
| `ETAFAB` | M13 (dueño), T05 | T07 §19.15 → `manufacturingStages` · Migrar vivo · O10 | Cubierta |
| `HIS_PRODFAB` | M13 (dueño), T05 | T07 §19.15 → `billsOfMaterials` (versiones) · Histórico · O10 | Cubierta |
| `HIS_PRODFAB_DIVISIONES` | M13 (dueño), T05 | T07 §19.15 → `billsOfMaterials.divisions` (versiones) · Histórico · O10 | Cubierta |
| `IT_RETM` | M13 (dueño), M07, T05 | T07 §19.15 → `materialWithdrawals.lines` · Migrar vivo · O8 | Cubierta |
| `ITRE_EST` | M13 (dueño), T05 | T07 §19.15 → `equipmentReceptions.items.statusHistory` · Histórico · O8 | Cubierta |
| `ITRE_PRO` | M13 (dueño), T05 | T07 §19.15 → `equipmentReceptions.items` · Migrar vivo · O8 | Cubierta |
| `MOV_PRO` | M13 (dueño), M10, T05 | T07 §19.15 → `stockMovements` · Histórico · O8 | Cubierta |
| `MOV_PRO_EXTRAS` | M13 (dueño), T04 | T07 §19.15 → `stockMovements.receivedBy` · Histórico · O8 | Cubierta |
| `MOV_TRH` | M13 (dueño), M14, T05 | T07 §19.15 → `serializedUnits.movements` · Histórico · O3 | Cubierta |
| `OF_PARTE_COMPONENTE` | M13 (dueño), T05 | T07 §19.15 → `productionReports.components` · Migrar vivo · O10 | Cubierta |
| `OF_PARTE_ITEM` | M13 (dueño), T05 | T07 §19.15 → `productionReports.items` · Migrar vivo · O10 | Cubierta |
| `OF_PARTE_PRODUCCION` | M13 (dueño), T05 | T07 §19.15 → `productionReports` · Migrar vivo · O10 | Cubierta |
| `ORCOFAB` | M13 (dueño), T05 | T07 §19.15 → `manufacturingOrders.components` · Migrar vivo · O10 | Cubierta |
| `ORDAFAB` | M13 (dueño), T05 | T07 §19.15 → `manufacturingOrders.progress` · Migrar vivo · O10 | Cubierta |
| `ORDEFAB` | M13 (dueño), T05 | T07 §19.15 → `manufacturingOrders` · Migrar vivo · O10 | Cubierta |
| `ORDEFAB_EXT` | M13 (dueño), T05 | T07 §19.15 → `manufacturingOrders.extensions` · Migrar vivo · O10 | Cubierta |
| `ORPRFAB` | M13 (dueño), T05 | T07 §19.15 → `manufacturingOrders.outputs` · Migrar vivo · O10 | Cubierta |
| `PROD_SER_UBICACION` | M13 (dueño), M02, T05 | T07 §19.15 → `stockLocations.capacity` · Migrar vivo · O8 | Cubierta |
| `PROD_TRH` | M13 (dueño), M10, T05, M03 | T07 §19.15 → `serializedUnits` · Migrar vivo · O3 | Cubierta |
| `PRODFAB` | M13 (dueño), T05 | T07 §19.15 → `billsOfMaterials` · Migrar vivo · O10 | Cubierta |
| `PRODFAB_DIVISIONES` | M13 (dueño), T05 | T07 §19.15 → `billsOfMaterials.divisions` · Migrar vivo · O10 | Cubierta |
| `PRODPUES` | M13 (dueño) | T07 §19.15 → Descartar · No migrar · O8 | Descartada (Uso no identificado [VERIFICAR]; si tiene datos con uso real, se reevalúa en F1.) |
| `RECEPCIONES` | M13 (dueño), M12, T05 | T07 §19.15 → `equipmentReceptions` · Migrar vivo · O8 | Cubierta |
| `RETI_MAT` | M13 (dueño), M10, T05 | T07 §19.15 → `materialWithdrawals` · Migrar vivo · O8 | Cubierta |
| `RMA_HISTORIAL` | M13 (dueño), T05 | T07 §19.15 → `rmaCases.statusHistory` · Histórico · O8 | Cubierta |
| `RMA_PRODUCTOS` | M13 (dueño), T05 | T07 §19.15 → `rmaCases` · Migrar vivo · O8 | Cubierta |
| `RUB_PYS` | M02 (dueño), M15, M13, T05 | T07 §19.15 → `productCategories` · Migrar vivo · O2 | Cubierta |
| `TIP_PROD` | M02 (dueño), M13, T05 | T07 §19.15 → `productTypes` · Migrar vivo · O2 | Cubierta |
| `UBICACIONES` | M13 (dueño), M10, T05 | T07 §19.15 → `stockLocations` · Migrar vivo · O3 | Cubierta |

### 13.16 CAT §16 — Tesorería y bancos (23 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `BANKOS` | M14 (dueño), M15, T05 | T07 §19.16 → `bankAccounts` · Migrar vivo · O8 | Cubierta |
| `CAJAPAGO` | M14 (dueño), T05 | T07 §19.16 → `paymentDesks.sessions` · Histórico · O8 | Cubierta |
| `CAT_BANC` | M14 (dueño), M15, T05, M12, T04b-p3 | T07 §19.16 → `bankMovementCategories` · Migrar vivo · O8 | Cubierta |
| `CATB_MOVS` | M14 (dueño), T05 | T07 §19.16 → `bankMovementCategories.links` · Migrar vivo · O8 | Cubierta |
| `CHEQUERAS` | M14 (dueño), T05 | T07 §19.16 → `ownChecks` · Migrar vivo · O8 | Cubierta |
| `CONTES` | M14 (dueño), T05 | T07 §19.16 → `treasuryConcepts` · Migrar vivo · O8 | Cubierta |
| `COT_DOL` | T04 (dueño), M14, T05 | T07 §19.16 → `exchangeRates` · Migrar vivo · O1 | Cubierta |
| `CTASUCE` | M14 (dueño), T05 | T07 §19.16 → `bankAccounts.collectionAccounts` · Migrar vivo · O5 | Cubierta |
| `ENTFIN` | M14 (antes `banks` de T04, O1) (dueño), M08, M14, T05 | T07 §19.16 → `financialInstitutions` · Migrar vivo · O5 | Cubierta |
| `INTERBANKING` | T06 (dueño), M14, M12, T08 | T07 §19.16 → Reemplazado por bóveda de credenciales (T06) · No migrar · O8 | Reemplazada (Reemplazado por bóveda de credenciales (T06)) |
| `MOV_INTERBANKING` | M14 (dueño), M12, T06, T05 | T07 §19.16 → `bankStatementLines` · Histórico · O8 | Cubierta |
| `PAGOTAR` | M14 (dueño), T05, M07 | T07 §19.16 → `cardSettlements` · Histórico · O8 | Cubierta |
| `PPAGOS` | M12 / M14 (dueño), M08, M12, M14, T05 | T07 §19.16 → `paymentOrders` (cabecera, M12) + `paymentExecutions` (firma, entre... · Histórico · O8 | Cubierta |
| `PPAGOS_FIRMANTES` | M14 (dueño), T11, M08, T05, M12 | T07 §19.16 → `treasuryAccountSigners` · Migrar vivo · O5 (antes O8; COL-TES-04) | Cubierta |
| `PPAGOS_FIRMAS` | M14 / T11 (dueño), M08, M14, M12, T05, T11 | T07 §19.16 → `paymentExecutions` (firmas) y `signatureRequests` (T11) · Histórico · O8 | Cubierta |
| `PPITEMS` | M12 (antes M14; CTR-DAT-52) (dueño), M12, M08, M14, T05 | T07 §19.16 → `paymentOrders.items` · Histórico · O8 | Cubierta |
| `RESBAN` | M14 (dueño), M15, M07, T05 | T07 §19.16 → `bankMovements` · Migrar vivo · O8 | Cubierta |
| `RESBAN_MOVINT` | M14 (dueño), T06 | T07 §19.16 → `bankReconciliations` · Histórico · O8 | Cubierta |
| `SUCENT` | T04 (dueño), M14, T05 | T07 §19.16 → `banks.branches` · Migrar vivo · O1 | Cubierta |
| `TESORE` | M14 (dueño), T05, M15 | T07 §19.16 → `treasuryMovements` · Histórico · O8 | Cubierta |
| `TIP_MON` | T04 (dueño), M14, M15, M12, T05, T04b-p3 | T07 §19.16 → `currencies` · Migrar vivo · O1 | Cubierta |
| `VAL_ESTA` | M14 (dueño), T05 | T07 §19.16 → `checkStates` · Migrar vivo · O8 | Cubierta |
| `VAL_MVTO` | M14 (dueño) | T07 §19.16 → `thirdPartyChecks.statusHistory` · Histórico · O8 | Cubierta |

### 13.17 CAT §17 — Contabilidad (24 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `CAT_INCI_CTSEC` | M15 (dueño), M10 | T07 §19.17 → `costAllocationRules` · Migrar vivo · O8 | Cubierta |
| `CIERRE` | M15 (dueño), M07, M14, T05 | T07 §19.17 → `journalEntries` (cierre) · Histórico · O8 | Cubierta |
| `CTASIEN` | M15 (dueño) | T07 §19.17 → `journalEntries` · Migrar vivo · O5 | Cubierta |
| `CTCUENTA_ASIGNA` | M15 (dueño) | T07 §19.17 → `postingRules` · Migrar vivo · O5 | Cubierta |
| `CTEJER` | M15 (dueño), T05 | T07 §19.17 → `fiscalYears` · Migrar vivo · O5 | Cubierta |
| `CTITASIE` | M15 (dueño) | T07 §19.17 → `journalEntries.lines` · Migrar vivo · O5 | Cubierta |
| `CTITASIE_SECCIONES` | M15 (dueño) | T07 §19.17 → `journalEntries.lines.costCenters` · Migrar vivo · O5 | Cubierta |
| `CTPLAN` | M15 (dueño), T05 | T07 §19.17 → `chartOfAccounts` · Migrar vivo · O5 | Cubierta |
| `CTPLAN_SUBRUBROS` | M15 (dueño) | T07 §19.17 → `chartOfAccounts.subcategories` · Migrar vivo · O5 | Cubierta |
| `CTRLCNC` | M15 (dueño), M03, T05 | T07 §19.17 → `postingRules.productControls` · Migrar vivo · O5 | Cubierta |
| `CTSECC_X_CTA` | M15 (dueño) | T07 §19.17 → `chartOfAccounts.allowedCostCenters` · Migrar vivo · O5 | Cubierta |
| `CTSECCION` | M15 (dueño), M10, M12, T05 | T07 §19.17 → `costCenters` · Migrar vivo · O5 | Cubierta |
| `CTSECCION_ASIGNA` | M15 (dueño), M12 | T07 §19.17 → `costAllocationRules` · Migrar vivo · O5 | Cubierta |
| `CTSECCION_GP_ASIGNA` | M15 (dueño), M12, T05 | T07 §19.17 → `costCenterGroups.members` · Migrar vivo · O5 | Cubierta |
| `CTSECCION_GRUPOS` | M15 (dueño), M12, T05 | T07 §19.17 → `costCenterGroups` · Migrar vivo · O5 | Cubierta |
| `CTSRUBROS` | M15 (dueño) | T07 §19.17 → `accountCategories` · Migrar vivo · O5 | Cubierta |
| `FPITEMS_CTSEC` | M15 (dueño) | T07 §19.17 → `supplierInvoices.lines.costCenters` · Migrar vivo · O8 | Cubierta |
| `GRPOBRA_CTSEC` | M15 (dueño) | T07 §19.17 → `costAllocationRules` · Migrar vivo · O8 | Cubierta |
| `GRU_CON` | M15 (dueño), T05 | T07 §19.17 → `postingRules` (cobranza) · Migrar vivo · O5 | Cubierta |
| `INFLACIO` | T04 (antes `inflationIndexes` de M15, O8; CTR-DAT-29) (dueño), T04, M15, M08, T05, M04 | T07 §19.17 → `economicIndexValues` · Migrar vivo · O1 | Cubierta |
| `RESULTA` | M15 (dueño), M09 | T07 §19.17 → `chartOfAccounts.resultMapping` · Migrar vivo · O8 | Cubierta |
| `SECCION` | M15 (dueño), T04 | T07 §19.17 → `costCenters` · Migrar vivo · O5 | Cubierta |
| `SISCONT` | M15 (dueño), T06, T05 | T07 §19.17 → `postingRules` · Migrar vivo · O5 | Cubierta |
| `TABINFL` | T04 (antes `inflationIndexes.tables` de M15, O8; CTR-DAT-29) (dueño), T04, M15, M08, T05 | T07 §19.17 → `economicIndexSeries` · Migrar vivo · O1 | Cubierta |

### 13.18 CAT §18 — Sueldos (56 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `SU_ACTIVIDADES` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa SICOSS de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa SICOSS de plataforma) |
| `SU_ANTIGUE` | M16 (dueño), M17 | T07 §19.18 → `seniorityScales` · Migrar vivo · O9 | Cubierta |
| `SU_ASIENTOS` | M15 (dueño), M16, T05 | T07 §19.18 → `postingRules` (sueldos) · Migrar vivo · O9 | Cubierta |
| `SU_AUDIT_TRA_INTERBANKING` | M16 (dueño), M14, T06, T05 | T07 §19.18 → Histórico (legacyRecords) · Histórico · O9 | Cubierta |
| `SU_BENEFICIOS_SICOSS` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_CARGO` | M16 (dueño) | T07 §19.18 → `jobPositions` · Migrar vivo · O9 | Cubierta |
| `SU_CATE` | M16 (dueño) | T07 §19.18 → `salaryCategories` · Migrar vivo · O9 | Cubierta |
| `SU_CONCEPTO_TIPO` | M16 (dueño) | T07 §19.18 → `payrollConcepts.receiptTypes` · Migrar vivo · O9 | Cubierta |
| `SU_CONCEPTOS` | M16 (dueño), M15, T05 | T07 §19.18 → `payrollConcepts` · Migrar vivo · O9 | Cubierta |
| `SU_CONDICION` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_CONTRATACION` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_DEDUCCIONES` | M16 (dueño) | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_DEDUCCIONES_ESPECIAL` | M16 (dueño) | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_DEDUCCIONES_TIPOS` | M16 (dueño) | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_DESVIC_EXTRAS` | M16 (dueño), T04 | T07 §19.18 → `terminationReasons.extras` · Migrar vivo · O9 | Cubierta |
| `SU_DESVICULACION` | M16 (dueño) | T07 §19.18 → `terminationReasons` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_CBU` | M16 (dueño), M14, T05, M01 | T07 §19.18 → `employees.bankAccounts` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_EXTRAS` | M16 (dueño), T04, T05 | T07 §19.18 → `employees.fixedExtras` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_FAMILIARES` | M16 (dueño), T05 | T07 §19.18 → `employees.dependents` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_FAMILIARES_EXTRAS` | M16 (dueño), T04, T05 | T07 §19.18 → `employees.dependents.yearly` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_HISCAT_EMP` | M16 (dueño), T05 | T07 §19.18 → `employees` (versiones de categoría) · Histórico · O9 | Cubierta |
| `SU_EMP_NOVEDADES` | M16 (dueño) | T07 §19.18 → `payrollNews` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_OBS` | M16 (dueño) | T07 §19.18 → `employees.notes` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_OPER` | M16 (dueño), T05 | T07 §19.18 → `employees.supervisor` · Migrar vivo · O9 | Cubierta |
| `SU_EMP_TURNOS` | M16 (dueño) | T07 §19.18 → `employees.shifts` · Migrar vivo · O9 | Cubierta |
| `SU_EMPLEADOS` | M16 (dueño), T05 | T07 §19.18 → `employees` · Migrar vivo · O9 | Cubierta |
| `SU_EMPLEADOS_DOCUMENTOS` | M16 (dueño), T11 | T07 §19.18 → `employees.documents` · Migrar vivo · O9 | Cubierta |
| `SU_EMPLEADOS_SEC` | M16 (dueño), T05 | T07 §19.18 → `employees.costAllocation` · Migrar vivo · O9 | Cubierta |
| `SU_EMPLEADOS_SUMSOC` | M16 (dueño) | T07 §19.18 → `employees.serviceAccounts` · Migrar vivo · O9 | Cubierta |
| `SU_EMPRESAS` | T04 (antes T01; DEC-064, CTR-DAT-48) (dueño), M16, T04, M15, T05, T02, T01 | T07 §19.18 → `legalEntities` (empleador) · Migrar vivo · O9 | Cubierta |
| `SU_EXTRAS` | M16 (dueño), T04, T05 | T07 §19.18 → `payrollExtras` · Migrar vivo · O9 | Cubierta |
| `SU_EXTRAS_GRUPOS` | M16 (dueño), T05 | T07 §19.18 → `payrollExtras.groups` · Migrar vivo · O9 | Cubierta |
| `SU_GRUPO_GRAFICO` | T10 (dueño), M16, T05 | T07 §19.18 → Reemplazado por tableros (T10) · No migrar · O11 | Reemplazada (Reemplazado por tableros (T10)) |
| `SU_HORAS_LECTOR` | M16 (dueño), M03, T05 | T07 §19.18 → `timeClockPunches` · Histórico · O9 | Cubierta |
| `SU_LICENCIAS` | M16 (dueño), T11 | T07 §19.18 → `leaves` · Migrar vivo · O9 | Cubierta |
| `SU_LICENCIAS_CAUSAS` | M16 (dueño) | T07 §19.18 → `leaveTypes` · Migrar vivo · O9 | Cubierta |
| `SU_NOTIFICACIONES` | M16 (dueño), T09 | T07 §19.18 → `employeeNotifications` · Histórico · O9 | Cubierta |
| `SU_OBRA` | M16 (dueño), T04, T05 | T07 §19.18 → `healthInsurers` · Migrar vivo · O9 | Cubierta |
| `SU_SALARIO_MINIMO` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_SINDICATO` | M16 (dueño), M15, T05 | T07 §19.18 → `unions` · Migrar vivo · O9 | Cubierta |
| `SU_SINIESTRADO` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_SIT_REVISTA_EMPLEADO` | M16 (dueño), T05 | T07 §19.18 → `employees.employmentStatus` · Migrar vivo · O9 | Cubierta |
| `SU_SITUACION_REVISTA` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_SUELDOS` | M16 (dueño) | T07 §19.18 → `payslips` · Migrar vivo · O9 | Cubierta |
| `SU_SUELDOS_DETGAN` | M16 (dueño) | T07 §19.18 → `payslips.incomeTax` · Migrar vivo · O9 | Cubierta |
| `SU_SUELDOSIT` | M16 (dueño) | T07 §19.18 → `payslips.lines` · Migrar vivo · O9 | Cubierta |
| `SU_TAREAS_EXTRAS` | M16 (dueño), T04 | T07 §19.18 → `payrollPieceWork` · Migrar vivo · O9 | Cubierta |
| `SU_TAREAS_EXTRAS_EMPLEADOS` | M16 (dueño) | T07 §19.18 → `payrollPieceWork.employees` · Migrar vivo · O9 | Cubierta |
| `SU_TIPO_NOVEDADES` | M16 (dueño) | T07 §19.18 → `payrollNewsTypes` · Migrar vivo · O9 | Cubierta |
| `SU_TIPO_RECIBOS` | M16 (dueño) | T07 §19.18 → `payslipTypes` · Migrar vivo · O9 | Cubierta |
| `SU_TIPOEMPLEADOR` | M16 (dueño), T04, T05 | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_TRAMAS` | M16 (dueño) | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_TRAMAS_TIPOS` | M16 (dueño) | T07 §19.18 → Reemplazado por tabla normativa de plataforma · No migrar · O9 | Reemplazada (Reemplazado por tabla normativa de plataforma) |
| `SU_TURNOS` | M16 (dueño) | T07 §19.18 → `shifts` · Migrar vivo · O9 | Cubierta |
| `SU_TURNOSIT` | M16 (dueño) | T07 §19.18 → `shifts.schedule` · Migrar vivo · O9 | Cubierta |
| `SU_VARIABLES` | M16 (dueño), T05 | T07 §19.18 → `payrollVariables` · Migrar vivo · O9 | Cubierta |

### 13.19 CAT §19 — Planes de vivienda (11 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `PLANESVIV` | M18 (dueño), M02, T12-p2, M04, T03, T05 | T07 §19.19 → `housingPlans` · Migrar vivo · O10 | Cubierta |
| `PRECIOSVIV` | M18 (dueño), M04, T12-p2, T05, M02 | T07 §19.19 → `housingPrices` · Migrar vivo · O10 | Cubierta |
| `VIV_ACTIVIDAD` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingActivities` · Migrar vivo · O10 | Cubierta |
| `VIV_ETAPA` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingStages` · Migrar vivo · O10 | Cubierta |
| `VIV_MAT` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingMaterialAllocations` · Histórico · O10 | Cubierta |
| `VIV_MATACT` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingActivityMaterials` · Migrar vivo · O10 | Cubierta |
| `VIV_PROGMAT` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingProgressMaterials` · Histórico · O10 | Cubierta |
| `VIV_PROGRESO` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingProgress` · Migrar vivo · O10 | Cubierta |
| `VIV_RET_IT` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingMaterialWithdrawals.items` · Histórico · O10 | Cubierta |
| `VIV_RETM` | M18 (dueño), T12-p2, T05 | T07 §19.19 → `housingMaterialWithdrawals` (el movimiento de stock asociado lo mi... · Histórico · O10 | Cubierta |
| `VIVIENDAS` | M18 (dueño), M02, T12-p2, T05 | T07 §19.19 → `housingUnits` (+ contrato `serviceContracts` de M02) · Migrar vivo · O10 | Cubierta |

### 13.20 CAT §20 — Ambulancias / salud (5 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `AMBUCARACTE` | M18 (dueño), T12-p2, T05 | T07 §19.20 → `tripCharacteristics` · Migrar vivo · O10 | Cubierta |
| `AMBULANC` | M18 (dueño), T12-p2, M02, T05, T03 | T07 §19.20 → `transportTrips` (`kind = sanitary`) + `tripLegs` · Histórico · O10 | Cubierta |
| `AMBUMED` | M18 (dueño), T12-p2, T05 | T07 §19.20 → `transportTrips.professionalIds` · Histórico · O10 | Cubierta |
| `ESPE_MED` | M18 (dueño), M03, T12-p2, T05 | T07 §19.20 → `medicalSpecialties` · Migrar vivo · O10 | Cubierta |
| `MEDICOS` | M18 (dueño), M02, T12-p2, T03, T05 | T07 §19.20 → `medicalProfessionals` · Migrar vivo · O10 | Cubierta |

### 13.21 CAT §21 — Mesa de ayuda (tickets) (14 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `TICKETS` | M09 (dueño), T11, T05 | T07 §19.21 → `tickets` · Migrar vivo · O2 | Cubierta |
| `TICKETS_ASIGNACIONES` | M09 (dueño), T05 | T07 §19.21 → `tickets.assignments` · Histórico · O2 | Cubierta |
| `TICKETS_CONTACTOS` | M09 (dueño) | T07 §19.21 → `tickets.contacts` · Migrar vivo · O2 | Cubierta |
| `TICKETS_ESTADOS` | M09 (dueño), T09, T11 | T07 §19.21 → `ticketStates` · Migrar vivo · O2 | Cubierta |
| `TICKETS_EXTRAS` | M09 (dueño), T04 | T07 §19.21 → `tickets.extras` · Migrar vivo · O2 | Cubierta |
| `TICKETS_HSBONIF` | M09 (dueño) | T07 §19.21 → Descartar · No migrar · O2 | Descartada (Uso propio del proveedor de software [VERIFICAR] (PA-MIG-14).) |
| `TICKETS_MEDIOSATENCION` | M09 (dueño), T05 | T07 §19.21 → `crmChannels` (antes `intakeChannels`; CTR-DAT-77) · Migrar vivo · O2 | Cubierta |
| `TICKETS_MODULOS` | M09 (dueño) | T07 §19.21 → `ticketCategories` · Migrar vivo · O2 | Cubierta |
| `TICKETS_NOTAS` | M09 (dueño), T05 | T07 §19.21 → `tickets.notes` · Migrar vivo · O2 | Cubierta |
| `TICKETS_PROYECTO` | M09 (dueño) | T07 §19.21 → `ticketCategories` (nivel superior) · Migrar vivo · O2 | Cubierta |
| `TICKETS_RESPONSABLES` | M09 (dueño) | T07 §19.21 → `ticketQueues.members` · Migrar vivo · O2 | Cubierta |
| `TICKETS_SUBTIPOS` | M09 (dueño) | T07 §19.21 → `ticketTypes.subtypes` · Migrar vivo · O2 | Cubierta |
| `TICKETS_TIPOS` | M09 (dueño) | T07 §19.21 → `ticketTypes` · Migrar vivo · O2 | Cubierta |
| `TICKETS_TIPOSESTADOS` | M09 (dueño) | T07 §19.21 → `ticketStates.groups` · Migrar vivo · O2 | Cubierta |

### 13.22 CAT §22 — Turnero (7 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `TUR_AREAS` | M09 (dueño) | T07 §19.22 → `serviceDeskAreas` · Migrar vivo · O10 | Cubierta |
| `TUR_AREAS_USERS` | M09 (dueño) | T07 §19.22 → `serviceDeskAreas.users` · Migrar vivo · O10 | Cubierta |
| `TUR_BOX` | M09 (dueño), T05 | T07 §19.22 → `serviceDesks` · Migrar vivo · O10 | Cubierta |
| `TUR_BOX_HISTORIAL` | M09 (dueño), T05 | T07 §19.22 → Histórico (legacyRecords) · Histórico · O10 | Cubierta |
| `TUR_TIPO_BOX` | M09 (dueño) | T07 §19.22 → `serviceDeskTypes` · Migrar vivo · O10 | Cubierta |
| `TURNOS` | M09 (dueño), T06, T05 | T07 §19.22 → `queueTickets` · Histórico · O10 | Cubierta |
| `TURNOS_HISTORIAL` | M09 (dueño), T06 | T07 §19.22 → Histórico (legacyRecords) · Histórico · O10 | Cubierta |

### 13.23 CAT §23 — Actividades y agenda (10 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ACT_AREAS` | M09 (dueño), T09 | T07 §19.23 → `activityAreas` · Migrar vivo · O10 | Cubierta |
| `ACT_FREC` | M09 (dueño), T05 | T07 §19.23 → `activityFrequencies` · Migrar vivo · O10 | Cubierta |
| `ACT_RBR` | M09 (dueño) | T07 §19.23 → `activityCategories` · Migrar vivo · O10 | Cubierta |
| `ACT_TIPOS` | M09 (dueño), T09, T11 | T07 §19.23 → `activityTypes` · Migrar vivo · O10 | Cubierta |
| `ACTIPREV` | M09 (dueño) | T07 §19.23 → `internalActivities.prerequisites` · Migrar vivo · O10 | Cubierta |
| `ACTIV` | M09 (dueño), T09 | T07 §19.23 → `internalActivities` · Migrar vivo · O10 | Cubierta |
| `ACTIV_SEG` | M09 (dueño), T05 | T07 §19.23 → `internalActivities.occurrences` · Migrar vivo · O10 | Cubierta |
| `CALENDARIO` | M09 (dueño), T11, T04, M05, T05, T09 | T07 §19.23 → `calendarEvents` · Migrar vivo · O10 | Cubierta |
| `CALENDARIO_TIPO` | M09 (dueño), T04, T11 | T07 §19.23 → `calendarEventTypes` · Migrar vivo · O10 | Cubierta |
| `TIP_EVEN` | M09 (dueño), T11 | T07 §19.23 → `calendarEventTypes` · Migrar vivo · O10 | Cubierta |

### 13.24 CAT §24 — Institucional (consejo, actas, INAES) (7 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ACTAS` | M17 (dueño), T03, T11, T05 | T07 §19.24 → `minutes` · Migrar vivo · O10 | Cubierta |
| `CAT_INAES` | M17 (dueño), M15, T05, T03 | T07 §19.24 → `inaesCategories` · Migrar vivo · O10 | Cubierta |
| `CONSEJO` | M17 (dueño), T05, T03 | T07 §19.24 → `boardMembers` · Migrar vivo · O10 | Cubierta |
| `REUNIONES` | M17 (dueño), T05 | T07 §19.24 → `meetings` · Migrar vivo · O10 | Cubierta |
| `REUNIONES_ASIST` | M17 (dueño), T05 | T07 §19.24 → `meetings.attendees` · Migrar vivo · O10 | Cubierta |
| `REUNIONES_PERMISOS` | T02 (dueño), M17, T05 | T07 §19.24 → Reemplazado por alcance de permisos (T02) · No migrar · O10 | Reemplazada (Reemplazado por alcance de permisos (T02)) |
| `REUNIONES_TEMAS` | M17 (dueño), T05 | T07 §19.24 → `meetings.agenda` · Migrar vivo · O10 | Cubierta |

### 13.25 CAT §25 — Informes y tablero (12 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ESTATAB` | T10 (dueño), T04 | T07 §19.25 → Reemplazado por umbrales de KPI (T10) · No migrar · O11 | Reemplazada (Reemplazado por umbrales de KPI (T10)) |
| `GRAFTAB` | T10 (dueño), M05, T05 | T07 §19.25 → Reemplazado por tableros (T10) · No migrar · O11 | Reemplazada (Reemplazado por tableros (T10)) |
| `GRUPTAB` | T10 (dueño), T04 | T07 §19.25 → Reemplazado por tableros (T10) · No migrar · O11 | Reemplazada (Reemplazado por tableros (T10)) |
| `GRUTAB` | T10 (dueño), T04 | T07 §19.25 → Reemplazado por tableros (T10) · No migrar · O11 | Reemplazada (Reemplazado por tableros (T10)) |
| `INFO_SYS` | T10 (dueño), T02, T01, T08 | T07 §19.25 → Reemplazado por catálogo de reportes (§15) · No migrar · O11 | Reemplazada (Reemplazado por catálogo de reportes (§15)) |
| `INFOCTD` | M06 (dueño), T10, M03, T06 | T07 §19.25 → `regulatoryReportConfigs` · Migrar vivo · O7 | Cubierta |
| `INFOCTG` | M06 (dueño), T10, M03 | T07 §19.25 → `regulatoryReportConfigs.rows` · Migrar vivo · O7 | Cubierta |
| `INFOCTN` | M06 (dueño), T10, M03 | T07 §19.25 → `regulatoryReportConfigs.columns` · Migrar vivo · O7 | Cubierta |
| `TABLAS_POWERBI` | T10 (dueño), T04, T06, T03 | T07 §19.25 → Reemplazado por exportación analítica (T10) · No migrar · O11 | Reemplazada (Reemplazado por exportación analítica (T10)) |
| `TABLERO` | T10 (dueño), M09 | T07 §19.25 → `kpiDefinitions` · No migrar · O11 | Descartada (Se redefinen; la definición sirve de insumo funcional.) |
| `TENDTAB` | T10 (dueño), M09 | T07 §19.25 → `kpiSnapshots` (histórico) · Histórico · O11 | Cubierta |
| `TIPO_TAB` | T10 (dueño), T04, M09 | T07 §19.25 → Reemplazado por tableros (T10) · No migrar · O11 | Reemplazada (Reemplazado por tableros (T10)) |

### 13.26 CAT §26 — Web / CoopOnline / APIs (8 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `REQUISITOS` | M09 (dueño), M19, M01, T11, T10, T05 | T07 §19.26 → `procedureTypes.requirements` · Migrar vivo · O2 | Cubierta |
| `REQUISITOS_ITEMS` | M09 (dueño), M19, M01, T11, T10 | T07 §19.26 → `procedureTypes.formFields` · Migrar vivo · O2 | Cubierta |
| `RSSFEED` | T09 (dueño), M19, T10 | T07 §19.26 → Histórico (legacyRecords) · Histórico · O2 | Cubierta |
| `WEB_LOG` | M19 (dueño), T10, T03 | T07 §19.26 → Descartar · No migrar · O2 | Descartada (La sincronización con el portal desaparece (CTR-MIG-12).) |
| `WEB_NOVEDADES` | T09 (dueño), M19, T10 | T07 §19.26 → `portalNews` · Migrar vivo · O2 | Cubierta |
| `WS_KEYS` | T06 (dueño), T10, T02, T05, M19, T01, T08, (+1) | T07 §19.26 → Reemplazado por credenciales de integración (T06) en bóveda · No migrar · O1 | Reemplazada (Reemplazado por credenciales de integración (T06) en bóveda) |
| `WS_USERS` | T02 (dueño), M19, T09, T10, T08, T03, T06 | T07 §19.26 → `users` (portal) · Migrar vivo · O2 | Cubierta |
| `WS_USERS_ACCOUNTS` | M19 (dueño), T02, T10, T08, T06 | T07 §19.26 → `portalAccountLinks` · Migrar vivo · O2 | Cubierta |

### 13.27 CAT §27 — Usuarios, seguridad y auditoría (20 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `AUDIT_IA` | T02 (dueño), M12, T06, M09, T05, T08, T01 | T07 §19.27 → `legacyAuditRecords` · Histórico · O11 | Cubierta |
| `AUDITO` | T02 (dueño), T08, T01, T05 | T07 §19.27 → `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) · Histórico · O11 (antes O1) | Cubierta |
| `AUDITORIA` | T02 (dueño), T08, T01, T05, T03, T04b-p1, T04 | T07 §19.27 → `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) · Histórico · O11 (antes O1) | Cubierta |
| `AUTORIZACIONES` | T11 (dueño), T02, T05, T01, T08 | T07 §19.27 → `approvalRequests` · Histórico · O1 | Cubierta |
| `FIRMADIGITAL` | T11 (dueño), T06, T02 | T07 §19.27 → `signatureRequests` · Histórico · O1 | Cubierta |
| `FIRMADIGITAL_ITEMS` | T11 (dueño), T06, T02 | T07 §19.27 → `signatureRequests.documents` · Histórico · O1 | Cubierta |
| `FIRMADIGITAL_USUARIOS` | T11 (dueño), T02, T06 | T07 §19.27 → `signatureProviders.users` · Migrar vivo · O1 | Cubierta |
| `FIRMASDIGITALES` | T11 (dueño), T02, T06 | T07 §19.27 → `signatureProviders` · Migrar vivo · O1 | Cubierta |
| `FIRMASELECTRONICAS` | T11 (dueño), M14, T02 | T07 §19.27 → `electronicSignatures` · Histórico · O1 | Cubierta |
| `FIRMASELECTRONICAS_DOC_USUARIOS` | T11 (dueño), T02 | T07 §19.27 → `signableDocumentTypes.signers` · Migrar vivo · O1 | Cubierta |
| `FIRMASELECTRONICAS_DOCUMENTOS` | T11 (dueño), M14, T02 | T07 §19.27 → `signableDocumentTypes` · Migrar vivo · O1 | Cubierta |
| `INFO_AUD` | T02 (dueño), T10, T08, T01, T03, T05 | T07 §19.27 → `legacyAuditRecords` (antes "Histórico (legacyRecords)"; COL-IAM-29) · Histórico · O11 (antes O1) | Cubierta |
| `MENUSYS` | T02 (dueño), T03, T01, T08 | T07 §19.27 → Reemplazado por navegación de plataforma · No migrar · O1 | Reemplazada (Reemplazado por navegación de plataforma) |
| `MENUVAL` | T02 (dueño), T03, T01, T08 | T07 §19.27 → Reemplazado por capacidades (T02) · No migrar · O1 | Reemplazada (Reemplazado por capacidades (T02)) |
| `PERFILES` | T02 (dueño), T03, T05, T08 | T07 §19.27 → `roles` · Migrar vivo · O1 | Cubierta |
| `PERFILES_TABLAS` | T02 (dueño), T10, T04, T01 | T07 §19.27 → Reemplazado por capacidades (T02) · No migrar · O1 | Reemplazada (Reemplazado por capacidades (T02)) |
| `USERS` | T02 (dueño), T05, T04, T08, M13, M19, M07, (+1) | T07 §19.27 → `users` · Migrar vivo · O1 | Cubierta |
| `USERS_AREA` | T01 (dueño), T02, T03 | T07 §19.27 → `orgUnits` · Migrar vivo · O1 | Cubierta |
| `USERS_DEPOSITO` | T02 (dueño), M13, T03 | T07 §19.27 → `users.scopes` (depósito) · Migrar vivo · O1 | Cubierta |
| `USERS_EXTRAS` | T02 (dueño), T04 | T07 §19.27 → `users.preferences` · Migrar vivo · O1 | Cubierta |

### 13.28 CAT §28 — Configuración y motor de pantallas (31 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ABM_VALIDACIONES` | T04 (dueño), T05, T01 | T07 §19.28 → Reemplazado por validaciones del dominio · No migrar · O1 | Reemplazada (Reemplazado por validaciones del dominio) |
| `ARCHIVOS` | T06 (dueño), T04, T01, M01 | T07 §19.28 → Reemplazado por conectores (T06) · No migrar · O1 | Reemplazada (Reemplazado por conectores (T06)) |
| `DATOSETB` | T04 (dueño), T01 | T07 §19.28 → `customFieldValues` · Migrar vivo · O1 | Cubierta |
| `DATOSEXT` | T04 (dueño), M13, T05, T01 | T07 §19.28 → `customFieldDefinitions` · Migrar vivo · O1 | Cubierta |
| `DATOSINT` | T06 (dueño), T04, T01 | T07 §19.28 → Reemplazado por conectores (T06) · No migrar · O1 | Reemplazada (Reemplazado por conectores (T06)) |
| `EMPRESAS` | T04 (antes T01; DEC-064, CTR-DAT-48) (dueño), T04, T05, T01, M06, M15, M07 | T07 §19.28 → `legalEntities` · Migrar vivo · O0 (antes O1; COL-CFG-41 de T05) | Cubierta |
| `ENTIDA_ESTADOS` | T04 (dueño), T11, M07, T01 | T07 §19.28 → `stateCatalogs` · Migrar vivo · O1 | Cubierta |
| `ENTIDACOL` | T04 (dueño), T10, T01 | T07 §19.28 → Reemplazado por vistas guardadas · No migrar · O1 | Reemplazada (Reemplazado por vistas guardadas) |
| `ENTIDACOL_EXTRA` | T04 (dueño), T01 | T07 §19.28 → Descartar · No migrar · O1 | Descartada (SQL embebido no se ejecuta.) |
| `ENTIDACON` | T04 (dueño), T10, M07, T01 | T07 §19.28 → Reemplazado por filtros guardados · No migrar · O1 | Reemplazada (Reemplazado por filtros guardados) |
| `ENTIDACOU` | T04 (dueño), T10, T09, T01, M07 | T07 §19.28 → Reemplazado por filtros guardados · No migrar · O1 | Reemplazada (Reemplazado por filtros guardados) |
| `ENTIDACRIT` | T04 (dueño), T10, M07, T01 | T07 §19.28 → Reemplazado por vistas guardadas · No migrar · O1 | Reemplazada (Reemplazado por vistas guardadas) |
| `ENTIDADCIR` | T11 (dueño), M07, T04, T01 | T07 §19.28 → Histórico (legacyRecords) · Histórico · O1 | Cubierta |
| `ENTIDADES` | T04 (dueño), T10, M07, T05, T01 | T07 §19.28 → Reemplazado por vistas guardadas · No migrar · O1 | Reemplazada (Reemplazado por vistas guardadas) |
| `ENTIDAEST` | T04 (dueño), T11, M07, T01 | T07 §19.28 → Reemplazado por vistas guardadas · No migrar · O1 | Reemplazada (Reemplazado por vistas guardadas) |
| `ENTIDAGRUP` | T04 (dueño), M07, T01 | T07 §19.28 → Reemplazado por navegación · No migrar · O1 | Reemplazada (Reemplazado por navegación) |
| `ENTIDAMEN` | T04 (dueño), M07, T01 | T07 §19.28 → Reemplazado por acciones de plataforma · No migrar · O1 | Reemplazada (Reemplazado por acciones de plataforma) |
| `EXPORTADOR` | T06 (dueño), T10, T01, T04, T03 | T07 §19.28 → `exportDefinitions` · Migrar vivo · O1 | Cubierta |
| `EXPORTADOR_COLUMNAS` | T06 (dueño), T10, T04, T01 | T07 §19.28 → `exportDefinitions.columns` · Migrar vivo · O1 | Cubierta |
| `FORMAINT` | T06 (dueño), T04, T01 | T07 §19.28 → `fileLayouts.fields` · Migrar vivo · O1 | Cubierta |
| `FORMULARIOS_PERSONALIZACIONES` | T04 (dueño), T03, T10, T01, T05 | T07 §19.28 → Descartar · No migrar · O1 | Descartada (Propias de la UI de ProCoop.) |
| `MODEINT` | T06 (dueño), T01, T04 | T07 §19.28 → `fileLayouts` · Migrar vivo · O1 | Cubierta |
| `PROPIEITEMS` | T04 (dueño), T01 | T07 §19.28 → `customFieldDefinitions` · Migrar vivo · O1 | Cubierta |
| `PROPIEITEMS_ASIGNACIONES` | T04 (dueño), T01 | T07 §19.28 → `customFieldValues` · Migrar vivo · O1 | Cubierta |
| `PROPIEITEMS_VALORES` | T04 (dueño), T01 | T07 §19.28 → `customFieldDefinitions.options` · Migrar vivo · O1 | Cubierta |
| `REPORTES` | T04 (dueño), T10, T01 | T07 §19.28 → Descartar · No migrar · O1 | Descartada () |
| `SERVINT` | T06 (dueño), M10, M02, T04, T12-p2, T01 | T07 §19.28 → `fileLayouts.services` · Migrar vivo · O1 | Cubierta |
| `TIP_ARC` | T06 (dueño), T04, T01 | T07 §19.28 → Reemplazado por conectores (T06) · No migrar · O1 | Reemplazada (Reemplazado por conectores (T06)) |
| `TIPOMOD` | T06 (dueño), T04, T01 | T07 §19.28 → `fileLayouts.type` · Migrar vivo · O1 | Cubierta |
| `VARIABLE` | T04 (dueño), M15, T05, T04b-p2, T04b-p4, T04b-p1, T08, (+6) | T07 §19.28 → Parámetros PRM de cada anexo, valores en `parameterValues` de T04 (... · Migrar vivo · O1 | Cubierta |
| `VARIABLE_PMOVIL` | T04 (dueño), T04b-p2, M19, T04b-p4, T04b-p1, T01, M03, (+4) | T07 §19.28 → Parámetros PRM de apps (T04) · Migrar vivo · O1 | Cubierta |

### 13.29 CAT §29 — Sistema (general) (10 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `ADJUNTOS` | T11 (dueño), T01, M09, M01, T05, T09, T04 | T07 §19.29 → `attachments` (expediente) · Migrar vivo · O1 | Cubierta |
| `BLOQUEO_FILAS` | T04 (dueño), T02, T01, T08, T03, T11 | T07 §19.29 → Descartar · No migrar · O1 | Descartada (La plataforma usa control optimista.) |
| `EQUIPOS` | T01 (dueño), T04, T02, M10, T05 | T07 §19.29 → `devices` · Migrar vivo · O1 | Cubierta |
| `ESTADOS` | T04 (dueño), T11, T01 | T07 §19.29 → `stateCatalogs` · Migrar vivo · O1 | Cubierta |
| `INTEGRIDAD` | T07 (dueño), T04, T01 | T07 §19.29 → Descartar (insumo de validación) · No migrar · O0 | Descartada (Alimenta los chequeos de integridad del staging (§9.5).) |
| `MODULOS` | T07 (dueño), T01, T04, T05, T02, T08, M19 | T07 §19.29 → Descartar · No migrar · O0 | Descartada (Se registra en `legacySnapshots` como versión de origen.) |
| `OPE_COM` | T04 (dueño), M12, T01, T11 | T07 §19.29 → `documentTypes.operations` · Migrar vivo · O1 | Cubierta |
| `OPERACIONES` | T04 (dueño), T11, T01, M16 | T07 §19.29 → `stateCatalogs` (operaciones) · Migrar vivo · O1 | Cubierta |
| `PROCOOPAR_ADJUNTOS` | T07 (dueño), T11, T01, T04 | T07 §19.29 → Descartar · No migrar · O0 | Descartada () |
| `RELACION_ENTIDADES` | T11 (dueño), M01, T01, M10, T05, T04 | T07 §19.29 → `recordLinks` · Migrar vivo · O1 | Cubierta |

### 13.30 CAT §30 — Maestros generales (geografía, documentos) (15 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `BARRIOS` | T04 (dueño), M01, T05 | T07 §19.30 → `geo.neighborhoods` · Migrar vivo · O1 | Cubierta |
| `CALLES` | T04 (dueño), M01, T05 | T07 §19.30 → `geo.streets` · Migrar vivo · O1 | Cubierta |
| `DEPARTA` | T04 (dueño), M01 | T07 §19.30 → `geo.departments` · Migrar vivo · O1 | Cubierta |
| `DEPTO` | T04 (dueño), M01, M17 | T07 §19.30 → `geo.departments` · Migrar vivo · O1 | Cubierta |
| `DISTRITO_SECCION` | T04 (dueño), M01, T05 | T07 §19.30 → `geo.cadastralDistricts` · Migrar vivo · O1 | Cubierta |
| `DOCUMENT` | T04 (dueño), M01, M17, M06 | T07 §19.30 → Tabla normativa de plataforma · No migrar · O1 | Descartada (Mapa de valores (RN-MIG-044).) |
| `EST_CIVIL` | T04 (dueño), M01 | T07 §19.30 → Tabla de plataforma · No migrar · O1 | Descartada (Mapa de valores.) |
| `FERIADOS` | T04 (dueño), M01, T05 | T07 §19.30 → `holidays` · Migrar vivo · O1 | Cubierta |
| `LOCALIDA` | T04 (dueño), M01, M17, T05 | T07 §19.30 → `geo.localities` · Migrar vivo · O1 | Cubierta |
| `MAPA` | T04 (dueño), M10, M01 | T07 §19.30 → Descartar · No migrar · O1 | Descartada (Centro/zoom se configura en GIS.) |
| `OCUPACIO` | T04 (dueño), M01 | T07 §19.30 → `occupations` · Migrar vivo · O1 | Cubierta |
| `PAISES` | T04 (dueño), M01, T05 | T07 §19.30 → Tabla de plataforma · No migrar · O1 | Descartada (Mapa de valores.) |
| `PROVINC` | T04 (dueño), M01, M17 | T07 §19.30 → Tabla de plataforma · No migrar · O1 | Descartada (Mapa de valores.) |
| `RNQCALL` | T04 (dueño), M01, M09 | T07 §19.30 → `geo.streets` · Migrar vivo · O1 | Cubierta |
| `ZONAS` | T04 (dueño), M01, T05, M03 | T07 §19.30 → `geo.zones` · Migrar vivo · O1 | Cubierta |

### 13.31 CAT §31 — Comunicaciones (mail, SMS, WhatsApp) (18 tablas)

| Unidad de fuente | Anexo(s) | IDs | Estado |
|---|---|---|---|
| `AUDIT_MAIL` | T02 (dueño), T09, T01, T06, T11, T08, T05, (+1) | T07 §19.31 → `legacyAuditRecords` (antes "Histórico (legacyRecords)" de T09, O2;... · Histórico · O11 | Cubierta |
| `CIRCUPRO` | T09 (dueño), M12, M09, T05 | T07 §19.31 → `messageTemplates` · Migrar vivo · O2 | Cubierta |
| `CORREOS_INTERNOS` | T09 (dueño), T06, M09, T02, T08 | T07 §19.31 → Reemplazado por canales de T09 con secretos en bóveda · No migrar · O1 | Reemplazada (Reemplazado por canales de T09 con secretos en bóveda) |
| `ENCUESTAS` | T09 (dueño), M09, T05, T03 | T07 §19.31 → `surveys` · Migrar vivo · O2 | Cubierta |
| `ENVIOS` | T09 (dueño), M09, T06, T03 | T07 §19.31 → Descartar · No migrar · O2 | Descartada () |
| `IVR` | T09 (dueño), T06, M09 | T07 §19.31 → Reemplazado por canal de voz (T09) · No migrar · O2 | Reemplazada (Reemplazado por canal de voz (T09)) |
| `MENSAJES` | T09 (dueño), M09, T06, T05 | T07 §19.31 → Histórico (legacyRecords) · Histórico · O2 | Cubierta |
| `MODEMS` | T09 (dueño), M10, M02, M09, T12-p2, T06 | T07 §19.31 → Descartar · No migrar · O2 | Descartada (Reemplazado por proveedor de SMS.) |
| `NOTI_COOP` | T09 (dueño), M19, T03, M08, M09, T06 | T07 §19.31 → `portalNotifications` · Migrar vivo · O2 | Cubierta |
| `PLANTILLA` | T09 (dueño), T04b-p1, M09, T11, T04b-p3, T04b-p2, T03, (+4) | T07 §19.31 → `messageTemplates` · Migrar vivo · O2 | Cubierta |
| `PLANTILLA_WSP` | T09 (dueño), M09, T11, T03, T06 | T07 §19.31 → `messageTemplates` (WhatsApp) · Migrar vivo · O2 | Cubierta |
| `PROMAIL` | T09 (dueño), T11, T06, M09 | T07 §19.31 → Descartar · No migrar · O2 | Descartada () |
| `RESPUESTAS` | T09 (dueño), M09 | T07 §19.31 → `surveys.responses` · Migrar vivo · O2 | Cubierta |
| `RESULTADOS` | T09 (dueño), M09, T06 | T07 §19.31 → Descartar · No migrar · O2 | Descartada () |
| `SENDMAIL` | T09 (dueño), M09, T06, T03 | T07 §19.31 → Descartar · No migrar · O2 | Descartada () |
| `TELEFON` | T09 (dueño), M09 | T07 §19.31 → Histórico (legacyRecords) · Histórico · O2 | Cubierta |
| `VARIABLEPLANT` | T09 (dueño), T11, M09, T03, T06, T04 | T07 §19.31 → `messageTemplates.variables` · Migrar vivo · O2 | Cubierta |
| `VARIABLES_PLANTILLA_WSP` | T09 (dueño), M09, T06 | T07 §19.31 → `messageTemplates.variables` · Migrar vivo · O2 | Cubierta |

## 14. Cómo mantener esta matriz

- La matriz se regenera, no se edita a mano: cada vez que un anexo cambia su sección 22 o sus columnas Origen, se vuelve a ejecutar la extracción (unidades de fuente), el índice de referencias de los anexos y la clasificación descritos en la sección 2.
- Cada vez que cambia `03-plan-de-olas-y-prompts.md` o un anexo agrega, quita o cambia de ola un RF o RNF, se repite el control de la sección 15: lectura de las tablas de requisitos de los anexos y de la línea `IMPLEMENTAR:` de cada prompt, con informe de faltantes, duplicados, IDs inexistentes y diferencias de ola. Es el mismo control que automatiza `npm run trace:check` (PRO-O0-02, plan §17.3).
- Cuando `05-registro-huecos.md`, `01-registro-decisiones.md`, `02-preguntas-abiertas.md` o el catálogo de eventos de T11 cambian, se regeneran las secciones 16 a 19 y la matriz 5.1.
- Una brecha se cierra cuando el anexo dueño agrega la cita (en la fila del RF/RN que la materializa y en su §22) o la declara `Descartado`/`Reemplazado por` con su motivo en la §22. La siguiente regeneración la mueve de estado.
- Las citas deben usar la numeración vigente de la fuente (`RN-xx §n.m`, `DFA Mn` o `DFA §n`, `FIC n.m`, `CNX §n.m`, `BASE §n`). Las citas de la sección 4.3 son las que hoy no cumplen esta regla.
- Las decisiones nuevas (DEC-088 en adelante) se incorporan a las secciones 5 y 17 en la misma regeneración; cada anexo afectado debe citar la DEC y pasar su PA a "Respondida". *Reemplazado (v1.0): "Las decisiones nuevas (DEC-082 en adelante) se incorporan a la sección 5"; DEC-082 a DEC-087 ya están incorporadas.*
- Un valor que cambia entre versiones no se borra: se reemplaza y se deja el anterior marcado como *Reemplazado (vX)*; la lista de cambios de cada versión va en la sección 20 (v1.1) y en la sección 22 (v1.2).
- Esta versión no traza los parámetros V2, los formularios INV ni el menú REL, que tienen su propia matriz en T04b y T03.

## 15. Trazabilidad RF y RNF → prompt (plan de olas v1.2)

Fuente: `03-plan-de-olas-y-prompts.md` versión 1.2 (recuento **19-11-2026**: **174** bloques `PRO-O*`, **172** ejecutables sin PRO-O11-07/08; **4 PRO-GEN** en `03-norma`). Se recorrieron por script las tablas de requisitos de los 29 anexos con RF (columna `ID` con `Ola`) y la línea `IMPLEMENTAR:` de cada prompt. Reglas de lectura de la línea, iguales a las del plan (§0.1 y §17.1):

- Un ID cuenta como **implementado** en el prompt cuando aparece en `IMPLEMENTAR:` fuera de un tramo "extensión de …" / "extensiones de …"; el texto entre paréntesis o corchetes es aclaración y no asigna (por ejemplo "(RF-COB-176 reemplazado en v1.1: pasó a O5)").
- "parte Ox de RF-…" asigna el RF al prompt de la ola más temprana y cuenta como extensión en las siguientes (caso RF-TES-128).
- Las extensiones no se cuentan de nuevo. La regla de control es: cada RF y RNF definido en un anexo tiene **exactamente un** prompt que lo implementa.

### 15.1 Resultado de la verificación

| Control | Resultado |
|---|---|
| RF definidos en los anexos | 4.213 (antes 4.204 y 4.203; 29 anexos; T04b, T05 y T12 no tienen tabla de RF) |
| RNF definidos en los anexos | 293 (antes 292; T01, T04, T08, T11, M09) |
| Prompts con línea IMPLEMENTAR | 174 (172 ejecutables) |
| RF y RNF con exactamente un prompt | 4.506 de 4.506 (antes 4.496 y 4.495) |
| Faltantes (sin prompt) | 0 |
| Duplicados (en más de un prompt como implementación) | 0 |
| IDs de la línea IMPLEMENTAR inexistentes en los anexos | 0 |
| IDs citados como extensión inexistentes en los anexos | 0 |
| IDs RF/RNF citados en cualquier parte del plan e inexistentes | 1: RF-XXX-999 (ejemplo de la prueba de `trace:check` en PRO-O0-02, inexistente a propósito) |
| Conteo de RF por prompt frente a la tabla de cada ola del plan | coincide en los 174 bloques PRO-O |
| Filas duplicadas de definición (mismo ID dos veces en tablas con Ola) | 0 |

### 15.2 Totales por ola

| Ola | Prompts | RF que empiezan en la ola | RNF | Plan §1 (prompts / RF / RNF) | Coincide |
|---|---:|---:|---:|---|---|
| O0 | 21 | 305 | 144 | 21 / 305 / 144 | Sí |
| O1 | 20 | 459 (antes 458) | 73 (antes 72) | 20 / 459 / 73 | Sí |
| O2 | 19 | 617 (antes 614 y 613) | 15 | 19 / 617 / 15 | Sí |
| O3 | 13 | 319 | 9 | 13 / 319 / 9 | Sí |
| O4 | 16 | 425 (antes 424) | 23 | 16 / 425 / 23 | Sí |
| O5 | 14 | 470 (antes 469; y antes 468, RF-CON-160, plan §21.5) | 13 | 14 / 470 / 13 | Sí |
| O6 | 11 | 244 | 2 | 11 / 244 / 2 | Sí |
| O7 | 12 | 298 (antes 274; DEC-089, plan §21.7) | 1 (antes 0) | 12 / 298 / 1 | Sí |
| O8 | 15 | 465 (antes 462) | 1 | 15 / 465 / 1 | Sí |
| O9 | 9 | 163 | 0 | 9 / 163 / 0 | Sí |
| O10 | 14 | 383 | 6 | 14 / 383 / 6 | Sí |
| O11 | 8 | 65 (antes 89, DEC-089, plan §21.7; y antes 90, RF-CON-160, plan §21.5) | 6 (antes 7) | 8 / 65 / 6 | Sí |
| **Total** | **172** | **4.213** (antes 4.204 y 4.203) | **293** (antes 292) | 172 / 4.213 / 293 | Sí |

### 15.3 Totales por anexo

| Anexo | RF en el anexo | RNF en el anexo | Con un prompt | Faltantes | Duplicados | Prompts que lo implementan | Plan §17.1 (RF / asignados / faltantes) |
|---|---:|---:|---:|---:|---:|---|---|
| T01 | 165 | 15 | 180 | 0 | 0 | 21 | 165 / 165 / 0 |
| T02 | 93 | — | 93 | 0 | 0 | 7 | 93 / 93 / 0 |
| T03 | 179 | — | 179 | 0 | 0 | 12 | 179 / 179 / 0 |
| T04 | 143 | 8 | 151 | 0 | 0 | 13 | 143 / 143 / 0 |
| T06 | 86 | — | 86 | 0 | 0 | 11 | 86 / 86 / 0 |
| T07 | 78 | — | 78 | 0 | 0 | 10 | 78 / 78 / 0 |
| T08 | 25 | 259 (antes 258) | 284 | 0 | 0 | 40 | 25 / 25 / 0 |
| T09 | 157 | — | 157 | 0 | 0 | 11 | 157 / 157 / 0 |
| T10 | 104 (antes 103) | — | 104 | 0 | 0 | 10 | 104 / 104 / 0 |
| T11 | 157 | 5 | 162 | 0 | 0 | 23 | 157 / 157 / 0 |
| M01 | 175 (antes 173) | — | 175 | 0 | 0 | 13 | 175 / 175 / 0 |
| M02 | 117 (antes 116) | — | 117 | 0 | 0 | 10 | 117 / 117 / 0 |
| M03 | 129 | — | 129 | 0 | 0 | 6 | 129 / 129 / 0 |
| M04 | 122 | — | 122 | 0 | 0 | 9 | 122 / 122 / 0 |
| M05 | 179 | — | 179 | 0 | 0 | 13 | 179 / 179 / 0 |
| M06 | 169 (antes 168) | — | 169 | 0 | 0 | 17 | 169 / 169 / 0 |
| M07 | 195 (antes 194) | — | 195 | 0 | 0 | 10 | 195 / 195 / 0 |
| M08 | 224 | — | 224 | 0 | 0 | 14 | 224 / 224 / 0 |
| M09 | 194 (antes 193) | 6 | 200 | 0 | 0 | 12 | 194 / 194 / 0 |
| M10 | 239 | — | 239 | 0 | 0 | 16 | 239 / 239 / 0 |
| M11 | 94 | — | 94 | 0 | 0 | 7 | 94 / 94 / 0 |
| M12 | 115 | — | 115 | 0 | 0 | 7 | 115 / 115 / 0 |
| M13 | 139 | — | 139 | 0 | 0 | 9 | 139 / 139 / 0 |
| M14 | 188 | — | 188 | 0 | 0 | 6 | 188 / 188 / 0 |
| M15 | 163 (antes 162) | — | 163 | 0 | 0 | 11 | 163 / 163 / 0 |
| M16 | 146 | — | 146 | 0 | 0 | 10 | 146 / 146 / 0 |
| M17 | 109 (antes 108) | — | 109 | 0 | 0 | 7 (antes 6; PRO-O8-04) | 109 / 109 / 0 |
| M18 | 149 | — | 149 | 0 | 0 | 7 | 149 / 149 / 0 |
| M19 | 180 (antes 179) | — | 180 | 0 | 0 | 17 | 180 / 180 / 0 |
| **Total** | **4.213** (antes 4.204 y 4.203) | **293** (antes 292) | **4.506** (antes 4.496) | **0** | **0** | | **4.213 / 4.213 / 0** |

### 15.4 Ola del prompt distinta de la primera ola del anexo

El plan asigna cada RF a la primera ola que indica la columna `Ola` del anexo (§0.1). Estos son los casos en que la ola del prompt no coincide con la primera ola legible de la celda, con su justificación en el plan. Ninguno es un faltante ni un duplicado.

| ID | Anexo | Ola en el anexo | Prompt (ola) | Fundamento en el plan | Observación |
|---|---|---|---|---|---|
| RF-CAT-010 | M02 | según ficha | PRO-O2-09 (O2) | §18: Habilitación por tenant del catálogo; las fichas de T12 indican la ola de cada servicio, pero el mecanismo es de O2 | La celda no indica una ola |
| RF-CRM-254 | M09 | — | PRO-O11-06 (O11) | §18: Se conserva como verificación de que la funcionalidad reemplazante existe y se migran sus datos | La celda no indica una ola (estado reemplazado) |
| RF-VEN-106 | M11 | — | PRO-O4-13 (O4) | §18: Ídem: se verifica el reemplazo en la ola del anexo | La celda no indica una ola (estado reemplazado) |
| RF-CON-160 | M15 | O11 (O5 para saldos de apertura) | PRO-O5-11 (O5; antes PRO-O11-06) | Plan §18 y §21.5: reasignado a la ola más temprana de la celda | Celda con dos olas: por la regla §0.1 empieza en O5 y la migración completa queda como extensión en PRO-O11-06 (corregido en el plan §21.5; antes el plan tomaba O11 como inicio) |
| RF-UXD-163 | T03 | O6 (DEC-056; antes `O9+ (cuando haya bot)`) | PRO-O6-09 (O6) | §18: DEC-056 adelanta el bot y el omnicanal a O6 | Reasignación declarada; desde el cierre 05-11-2026 la celda de T03 coincide con el prompt |
| RF-MIG-060 | T07 | por dominio | PRO-O11-06 (O11) | §18: Archivo histórico por dominio; los mapeos por dominio se agregan en cada ola, el archivo consultable completo en O11 | La celda no indica una ola |
| RNF-NFR-100 | T08 | O10 (electrodependencia en O7, legajo en O9) | PRO-O2-03 (O2) | §18: Datos sensibles de personas: se construye con RF-PER-014 (O2) | El plan §18 dice "Sin ola"; T08 hoy indica O10 (electrodependencia en O7, legajo en O9). Revisar la fila de §18 o la del anexo |
| RF-COM-180 | T09 | por emisor | PRO-O2-15 (O2) | §18: Marco de notificaciones transaccionales; cada módulo emisor agrega sus avisos en su ola | La celda no indica una ola |

### 15.5 RF nuevos de la versión 1.1 (huecos de las fases 1 a 3)

El plan §21.1 lista 83 RF nuevos. Verificación: 83 existen en la tabla de RF de su anexo y 83 están en la línea IMPLEMENTAR del prompt que indica §21.1. Además §21.1 declara 5 extensiones (RF con ola dividida por servicio), que figuran como extensión en el prompt indicado: 5 de 5.

| Prompt | RF nuevos (v1.1) | Ola del anexo | Verificación |
|---|---|---|---|
| PRO-O0-13 | RF-CFG-134..138, 140 | O0 | Correcto |
| PRO-O1-11 | RF-CFG-141 | O1 | Correcto |
| PRO-O2-04 | RF-PER-173 | O2 | Correcto |
| PRO-O2-09 | RF-PLA-165; RF-UXD-179 | O2 | Correcto |
| PRO-O2-10 | RF-PLA-164 | O2 | Correcto |
| PRO-O2-16 | RF-POR-179 | O2 | Correcto |
| PRO-O2-17 | RF-POR-174 | O2 | Correcto |
| PRO-O3-01 | RF-TEC-231 | O7 (GAS, ELE); O3 para el resto de lo... | Correcto |
| PRO-O3-03 | RF-TAR-115 | O3 | Correcto |
| PRO-O3-11 | RF-CRM-258, 260 | O3; O7 (GAS, ELE); O3 resto | Correcto |
| PRO-O4-01 | RF-FIS-167, 168 | O4 | Correcto |
| PRO-O4-04 | RF-FIS-161 | O4 | Correcto |
| PRO-O4-10 | RF-FAC-177, 179 | O4 | Correcto |
| PRO-O5-02 | RF-COB-191, 192 | O5 | Correcto |
| PRO-O5-04 | RF-COB-193 | O5 | Correcto |
| PRO-O5-07 | RF-COB-194 | O5 | Correcto |
| PRO-O5-10 | RF-CON-162 | O5 | Correcto |
| PRO-O6-02 | RF-FIS-164; RF-MOR-223 | O6; O6 (saldo elegible) / O7 (corte) | Correcto |
| PRO-O6-04 | RF-FIS-166 | O6 | Correcto |
| PRO-O7-01 | RF-CAT-114; RF-MED-128 | O7 | Correcto |
| PRO-O7-05 | RF-POR-176 | O7 | Correcto |
| PRO-O7-06 | RF-TAR-116, 119, 121 | O7 | Correcto |
| PRO-O7-07 | RF-FAC-174, 175, 178 | O7 | Correcto |
| PRO-O7-08 | RF-CAT-115; RF-TEC-232, 233, 235, 236 | O7 | Correcto |
| PRO-O7-09 | RF-MOR-221, 222; RF-TEC-238; RF-CRM-259 | O10 (TEL, TV) / O7 (AG, CLO); O7; O7 (AG) / O10 (TEL, TV) | Correcto |
| PRO-O8-02 | RF-CMP-149..153; RF-MED-129 | O8 | Correcto |
| PRO-O8-05 | RF-TEC-239; RF-STK-139 | O8 | Correcto |
| PRO-O9-01 | RF-CFG-139 | O9 | Correcto |
| PRO-O9-02 | RF-CFG-143 | O9 | Correcto |
| PRO-O10-02 | RF-CON-161 | O10 | Correcto |
| PRO-O10-04 | RF-SOC-146, 148, 149; RF-MOR-224; RF-POR-178; RF-MIG-099 | O10 | Correcto |
| PRO-O10-05 | RF-TAR-117; RF-FIS-162; RF-POR-177 | O10 | Correcto |
| PRO-O10-06 | RF-SOC-147 | O10 | Correcto |
| PRO-O10-08 | RF-TAR-118 | O10 | Correcto |
| PRO-O10-09 | RF-CAT-116; RF-CMP-154, 155; RF-TEC-234, 237; RF-TAR-120, 122; RF-POR-175 | O10 | Correcto |
| PRO-O10-13 | RF-FAC-176; RF-FIS-165; RF-COB-190 | O10 | Correcto |
| PRO-O7-11 (DEC-089; antes PRO-O11-06) | RF-CFG-142; RF-FIS-163 | O7 (DEC-089; antes O11) | Correcto |

### 15.6 RF reasignados de ola en la versión 1.1

| RF | Ola en el anexo (hoy) | Prompt v1.0 | Prompt v1.1 según el plan | Prompt que lo implementa (verificado) | Extensión en | Resultado |
|---|---|---|---|---|---|---|
| RF-COB-176 | O5 (antes O10) | PRO-O10-13 | PRO-O5-07 | PRO-O5-07 | — | Correcto |
| RF-CON-098 | O5 (antes O10) | PRO-O10-02 | PRO-O5-12 | PRO-O5-12 | — | Correcto |
| RF-CON-025 | O10 | PRO-O5-10 (reasignado por C-03) | PRO-O10-02, con extensión en PRO-O5-10 | PRO-O10-02 | PRO-O5-10 | Correcto |
| RF-CON-075 | O10 | PRO-O5-11 (reasignado por C-03) | PRO-O10-02, con extensión en PRO-O5-11 | PRO-O10-02 | PRO-O5-11 | Correcto |

*Reemplazado (versión 1.0 de esta matriz): no existía control RF → prompt; la versión 1.0 solo trazaba fuentes → anexos.*

### 15.7 Matriz prompt → RF y RNF

Una fila por prompt. "Implementa" es la lista completa (con rangos) de los IDs que el prompt construye; cada ID aparece en una sola fila de esta tabla. "Extiende" son RF de olas anteriores que el prompt amplía sin volver a contarlos.

| Prompt | Título | RF | RNF | Implementa | Extiende |
|---|---|---:|---:|---|---|
| PRO-O0-01 | Monorepo, monolito modular, Docker y ambientes | 19 | 11 | RF-PLA-001..008, 013, 109, 110, 146, 147, 154, 155, 161, 163; RF-CFG-122, 123; RNF-PLA-001..010, 015 | — |
| PRO-O0-02 | CI/CD, estrategia de pruebas y trazabilidad | 4 | 37 | RF-PLA-113, 114; RF-NFR-022; RF-INT-083; RNF-NFR-092..094, 140..145, 147..149, 151, 152, 155, 158, 160..171, 174, 178, 240..245, 249 | — |
| PRO-O0-03 | Núcleo compartido: Zod, errores RFC 9457, paginación, dinero, fechas, control optimista... | 4 | 23 | RF-PLA-014, 015; RF-IAM-046, 139; RNF-NFR-082..087, 090, 091, 192..194, 200, 201, 206, 210..215, 226..228 | — |
| PRO-O0-04 | Multitenancy forzada y aislamiento | 21 | 6 | RF-PLA-016..028, 030, 032..034, 036, 037, 130, 133; RNF-NFR-020, 021, 023, 025..027 | — |
| PRO-O0-05 | Observabilidad, salud y continuidad base | 6 | 26 | RF-PLA-136, 137, 139, 142, 143; RF-INT-073; RNF-NFR-001, 002, 004, 008, 009, 013, 014, 030, 033, 035, 038..041, 048, 120..124, 126..128, 130, 138, 139 | — |
| PRO-O0-06 | Seguridad HTTP, cifrado y cargas seguras | 3 | 25 | RF-NFR-020, 021, 024; RNF-NFR-050..056, 058, 059, 072..075, 078..081, 096, 097, 099, 105, 235..238 | — |
| PRO-O0-07 | Outbox y bus de eventos de dominio | 13 | 3 | RF-PLA-009; RF-WFL-001..009, 015..017; RNF-WFL-001, 004, 005 | — |
| PRO-O0-08 | Jobs BullMQ, programación por tenant y patrón de operaciones | 10 | 0 | RF-PLA-010, 011; RF-WFL-020..022, 024..026, 040, 043 | — |
| PRO-O0-09 | Almacenamiento privado S3 y repositorio documental base | 8 | 0 | RF-PLA-012; RF-WFL-150..154, 157, 159 | — |
| PRO-O0-10 | Bóveda de secretos (DEC-074) y marco de integraciones | 26 | 2 | RF-INT-001, 005, 015, 021, 030..037, 039..041, 044, 046..049, 052, 078..080, 082, 085; RNF-NFR-067, 070 | — |
| PRO-O0-11 | IAM base: identidades, pertenencias, login staff, sesión y capabilities | 21 | 1 | RF-IAM-001..003, 006..008, 020, 021, 030, 032..036, 040, 041, 045, 060, 061, 110, 115; RNF-NFR-060 | — |
| PRO-O0-12 | Auditoría inmutable | 7 | 5 | RF-IAM-130..134, 136; RF-PLA-095; RNF-NFR-110..112, 118, 119 | — |
| PRO-O0-13 | Registro de parámetros tipados y `legalEntities` (DEC-064) | 14 | 0 | RF-CFG-001..005, 007..009, 134..138, 140 | — |
| PRO-O0-14 | Design system admin y PWA, tokens y branding runtime base | 26 | 0 | RF-UXD-001..007, 009..019, 021, 025..027, 029, 035, 036, 040 | — |
| PRO-O0-15 | Layouts: AdminShell, AppShell, landing, plataforma, login UX y mapa del sitio | 40 | 1 | RF-UXD-041..045, 047..050, 052..056, 058..071, 079, 112..117, 171, 172, 175, 176, 178; RNF-NFR-186 | — |
| PRO-O0-16 | Componentes genéricos, reglas UX y accesibilidad | 40 | 4 | RF-UXD-081..085, 087, 088, 090..093, 097..106, 108..110, 123..135, 137..139; RNF-NFR-180, 183..185 | — |
| PRO-O0-17 | Diccionario de términos base | 19 | 0 | RF-UXD-140..142, 144..147, 149..151, 155..160, 166, 168, 169 | — |
| PRO-O0-18 | Plantillas, motor PDF (DEC-080) y numeración de documentos | 9 | 0 | RF-WFL-170..172, 175, 179, 185..188 | — |
| PRO-O0-19 | Notificaciones base y bandeja in-app | 8 | 0 | RF-COM-138, 141, 145, 181, 200..203 | — |
| PRO-O0-20 | Convenciones de migración `legacy` | 7 | 0 | RF-MIG-011, 016, 036, 037, 041, 042, 098 | — |
| PRO-O0-21 | Integración de O0: demo y suite de aislamiento | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O1-01 | Ciclo de vida del tenant y tenant PLATFORM | 20 | 0 | RF-PLA-029, 031, 035, 038, 039, 041..055 | — |
| PRO-O1-02 | Licenciamiento en capas y catálogo de módulos | 14 | 0 | RF-PLA-063..075, 162 | — |
| PRO-O1-03 | Contrato SaaS, medición de uso y prefactura (DEC-065) | 8 | 0 | RF-PLA-076..081, 084, 085 | — |
| PRO-O1-04 | Alta asistida con IA y ambientes por tenant | 11 | 0 | RF-PLA-056..062, 111, 112, 115, 116 | — |
| PRO-O1-05 | Soporte de plataforma con acceso temporal auditado | 18 | 0 | RF-PLA-096..108; RF-IAM-111..114, 116 | — |
| PRO-O1-06 | Tableros, alertas, operación, capacidad y actualizaciones | 24 | 18 | RF-PLA-086..094, 129, 131, 132, 134, 135, 138, 140, 141, 144, 145, 148..152; RNF-PLA-011, 012, 014; RNF-NFR-007, 015, 022, 028, 029, 125, 129, 131..136, 172, 173 | — |
| PRO-O1-07 | Backups, restauración por tenant y salida de datos | 17 | 9 | RF-PLA-117..128, 156..160; RNF-NFR-031, 032, 034, 036, 037, 042, 043, 045, 049 | — |
| PRO-O1-08 | Autenticación completa: 2FA, Google, federado (CiDi), OTP del socio | 26 | 7 | RF-IAM-004, 005, 009, 010, 022..029, 031, 037..039, 042..044, 047..049; RF-UXD-118, 119, 121, 122; RNF-NFR-061..066, 077 | RF-IAM-021, 110 |
| PRO-O1-09 | Roles, perfiles, alcance, separación de funciones y auditoría avanzada | 36 | 8 | RF-IAM-062..079, 090..096, 135, 137, 138, 140..143, 150..153; RNF-NFR-113..117, 231..233 | RF-IAM-133 |
| PRO-O1-10 | Configuración versionada, ámbitos y publicación | 38 | 7 | RF-CFG-006, 010..016, 018..040, 042..044, 120, 121, 124, 128; RNF-CFG-001..005, 007, 008 | — |
| PRO-O1-11 | Tablas maestras, enumeraciones, importaciones y reemplazo del motor de pantallas | 26 | 1 | RF-CFG-045..055, 057, 058, 100, 104..107, 114..117, 130, 131, 133, 141; RNF-NFR-089 | — |
| PRO-O1-12 | Geografía, calles, mapas (DEC-046) y calendarios | 25 | 0 | RF-CFG-065..089 | — |
| PRO-O1-13 | Editor de marca, diccionario versionado y preferencias | 32 | 2 | RF-UXD-008, 020, 022..024, 028, 030..034, 037..039, 046, 051, 057, 080, 096, 107, 136, 143, 148, 152..154, 162, 164, 165, 173, 174, 177; RNF-NFR-182, 196 | RF-UXD-049, 141 |
| PRO-O1-14 | Conexiones de integración, credenciales, certificados y monitoreo | 25 | 2 | RF-INT-002..004, 006, 007, 009, 011..014, 016..020, 028, 029, 042, 043, 050, 051, 070..072, 077; RNF-NFR-068, 069 | — |
| PRO-O1-15 | Eventos y jobs avanzados, operaciones aprobables y máquinas de estado | 20 | 2 | RF-WFL-010, 011, 013, 023, 029, 030, 041, 042, 044, 045, 048..051, 060..062, 064, 065, 079; RNF-NFR-222, 260 | — |
| PRO-O1-16 | Aprobaciones, delegaciones, bandeja del empleado, retención y expediente | 30 | 1 | RF-WFL-110..121, 123, 124, 130..136, 138, 139, 160, 161, 173, 190, 210, 211, 213; RNF-WFL-003 | — |
| PRO-O1-17 | Motor de reportes base y preferencias de notificación | 38 | 0 | RF-BIA-001..009, 011..014, 016, 021..029, 032..034, 040, 046..048, 052, 058, 094, 100, 104; RF-COM-176, 204, 205 | — |
| PRO-O1-18 | Privacidad (Ley 25.326) y requisitos de seguridad operativos | 19 | 16 | RF-NFR-001..004, 006..011, 013..019, 023, 025; RNF-NFR-095, 103, 107..109, 150, 157, 246, 247, 250, 252, 254..257, 259 | — |
| PRO-O1-19 | Herramienta de migración base | 32 | 0 | RF-MIG-001..005, 010, 013..015, 020, 024, 025, 027, 028, 030..032, 035, 040, 043..046, 050..053, 058, 062, 095..097 | — |
| PRO-O1-20 | Integración de O1: alta asistida de una cooperativa | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O2-01 | Trámites configurables, formularios dinámicos, SLA, agenda y documental avanzada | 40 | 0 | RF-WFL-063, 070..078, 080..082, 090..096, 100..102, 104, 105, 137, 140..145, 155, 156, 158, 162, 164, 201, 214, 215 | — |
| PRO-O2-02 | Campos extra tipados, precargas y perfil de configuración por servicio | 21 | 0 | RF-CFG-017, 041, 059..064, 097, 108..113, 118, 119, 125..127, 129 | — |
| PRO-O2-03 | Personas e identificación fiscal | 26 | 2 | RF-PER-001..015, 017..019, 021..028; RNF-NFR-098, 100 | — |
| PRO-O2-04 | Contactos, consentimientos, titulares y cuentas | 36 | 0 | RF-PER-030..048, 050, 052, 054..058, 060, 061, 063, 064, 068..072, 173 | — |
| PRO-O2-05 | Domicilios, geolocalización, inmuebles y puntos de prestación | 22 | 0 | RF-PER-073..094 | — |
| PRO-O2-06 | Relaciones, notas, bloqueos, documentación y transferencias | 27 | 0 | RF-PER-099..106, 108, 118..125, 128..132, 135..139 | — |
| PRO-O2-07 | Ficha 360, padrón, historia, duplicados, privacidad e importación | 33 | 0 | RF-PER-142..172, 174, 175 | — |
| PRO-O2-08 | Registro básico de asociados (M17) | 11 | 0 | RF-INS-001..004, 009, 015, 017, 099, 104, 105, 107 | — |
| PRO-O2-09 | Catálogo de servicios, perfil por servicio y versionado | 35 | 0 | RF-CAT-001..020, 023..035; RF-PLA-165; RF-UXD-179 | — |
| PRO-O2-10 | Productos, planes, categorías, estados y contrato de servicio | 47 | 0 | RF-CAT-036..043, 045, 047, 049, 053..055, 057, 061..065, 067..070, 072..074, 076..078, 082, 084, 092, 094, 104..113; RF-STK-082, 132; RF-PLA-164 | — |
| PRO-O2-11 | CRM: expediente, bandejas y tickets | 36 | 3 | RF-CRM-001..016, 018, 023..025, 031, 034..039, 043, 045, 047, 048, 158, 170, 186, 255, 261; RNF-CRM-001, 003, 005 | — |
| PRO-O2-12 | CRM: solicitudes comerciales | 13 | 0 | RF-CRM-060..067, 076..079, 083 | — |
| PRO-O2-13 | Comunidad: muro, reacciones y moderación | 52 | 0 | RF-COM-001..026, 030..037, 040..057 | — |
| PRO-O2-14 | Boletines, encuestas, eventos, beneficios y audiencias | 40 | 0 | RF-COM-060..063, 070..083, 088..091, 093, 100..106, 110..119 | — |
| PRO-O2-15 | Motor de comunicaciones multicanal, preferencias y campañas | 37 | 0 | RF-COM-130..137, 139, 140, 142..144, 146, 149, 151, 153..156, 160, 162, 170..173, 175, 180, 190..194, 197; RF-INT-008, 058, 086 | — |
| PRO-O2-16 | Landing pública, registro y vinculación de cuentas | 44 | 1 | RF-POR-001..011, 013..019, 021..030, 032..034, 036..042, 046, 179; RF-UXD-076..078, 120; RNF-NFR-076 | — |
| PRO-O2-17 | Portal del socio: inicio, servicios, gestiones, comunidad y administración | 65 | 9 | RF-POR-047, 048, 051..054, 056..065, 067, 070, 071, 109..112, 114, 116, 117, 121..126, 134, 137..156, 158, 160, 174, 180; RF-UXD-072..075, 086, 089, 167, 170; RNF-NFR-003, 137, 181, 191, 195, 234, 248, 251, 253 | — |
| PRO-O2-18 | Reportes programados, privacidad del socio y mapeos de migración | 32 | 0 | RF-BIA-010, 017..019, 030, 031, 035..039, 049..051, 053..057, 059, 097, 103; RF-NFR-005, 012; RF-MIG-012, 021..023, 026, 034, 039, 090 | — |
| PRO-O2-19 | Integración de O2: el socio se registra y solicita Internet | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O3-01 | Cuadrillas, recursos, tipos de trabajo y legajo mínimo | 11 | 0 | RF-SUE-001; RF-TEC-102..105, 107..111, 231 | — |
| PRO-O3-02 | Stock: artículos, depósitos y movimientos | 29 | 0 | RF-STK-001..004, 006, 009, 011, 013, 015..017, 020..028, 030, 031, 034, 035, 038..042 | — |
| PRO-O3-03 | Stock: series, reservas, custodia de cuadrilla y comodatos | 46 | 0 | RF-STK-044..047, 049..069, 071..077, 079, 081, 084, 089, 094, 113, 131, 135..137; RF-CMP-018, 067; RF-CON-071; RF-TAR-115 | — |
| PRO-O3-04 | Factibilidad y estimación técnica | 24 | 0 | RF-TEC-001..021; RF-PER-016, 096, 098 | — |
| PRO-O3-05 | Órdenes de trabajo y materiales | 45 | 0 | RF-TEC-022..034, 036..039, 042..060, 062, 064, 065, 067..069, 071; RF-WFL-066, 103 | — |
| PRO-O3-06 | Agenda, visitas y portal de visitas | 20 | 0 | RF-TEC-073..084; RF-POR-055, 072..077; RF-WFL-097 | — |
| PRO-O3-07 | Instalación integral, firma y activación del contrato | 31 | 0 | RF-TEC-085..093, 095..101; RF-WFL-195, 196; RF-COM-084..087, 092; RF-CAT-050, 051, 079, 081, 085, 088, 091, 099 | — |
| PRO-O3-08 | App de campo offline-first | 20 | 9 | RF-TEC-112..119, 121..130; RF-UXD-094, 095; RNF-NFR-017, 156, 187..190, 219, 220; RNF-PLA-013 | — |
| PRO-O3-09 | Equipos de red y aprovisionamiento de Internet | 16 | 0 | RF-TEC-155, 164..167, 182..186, 188..193 | — |
| PRO-O3-10 | Geolocalización operativa e informes técnicos | 16 | 0 | RF-TEC-215..229; RF-BIA-020 | — |
| PRO-O3-11 | Reclamos e incidentes | 29 | 0 | RF-CRM-100, 101, 103..113, 115, 116, 118..124, 258, 260; RF-COM-120, 161, 163, 183, 184 | — |
| PRO-O3-12 | Completar expediente, solicitudes y canales del CRM | 31 | 0 | RF-CRM-017, 019..022, 029, 030, 032, 033, 046, 049, 051..053, 068, 070..075, 082, 084, 173, 184, 185, 187, 236, 256; RF-POR-113, 115 | — |
| PRO-O3-13 | Integración de O3: instalación y reclamo del piloto Internet | 1 | 0 | RF-MIG-056 | — |
| PRO-O4-01 | Tablas normativas, perfil fiscal del tenant y padrones | 27 | 0 | RF-FIS-001..006, 008..011, 013..017, 021, 023, 167, 168; RF-CFG-056, 095, 098, 099, 101, 102; RF-INT-061, 064 | — |
| PRO-O4-02 | Credenciales ARCA, certificados y WSAA | 15 | 1 | RF-FIS-024..032; RF-INT-022..027; RNF-NFR-071 | — |
| PRO-O4-03 | Puntos de venta, cola CAE (WSFEv1) y CAEA | 40 | 5 | RF-FIS-033..048, 050..070; RF-INT-038, 074, 076; RNF-NFR-044, 047, 216, 217, 221 | — |
| PRO-O4-04 | IVA, IIBB, percepciones básicas, libros y conceptos de terceros | 28 | 0 | RF-FIS-075..081, 083, 085..088, 090, 092, 093, 095, 112, 115, 116, 134, 135, 137, 141, 159..161; RF-PER-020, 029 | — |
| PRO-O4-05 | Cuadros tarifarios versionados y precios | 24 | 0 | RF-TAR-001..016, 018..022, 027, 029, 030 | — |
| PRO-O4-06 | Motor de cálculo, reglas, fórmulas y beneficios | 36 | 5 | RF-TAR-032..036, 039, 042, 043, 051, 053..069, 071..073, 075, 076, 082..086; RNF-NFR-202..204, 209, 223 | — |
| PRO-O4-07 | Explicabilidad, simulación, retroactivos y perfil tarifario del contrato | 28 | 0 | RF-TAR-088..096, 100, 103..108, 110, 112, 113; RF-CAT-044, 046, 048, 052, 071, 086, 087, 098, 117 | RF-CAT-017, 039, 043, 045, 050, 081 |
| PRO-O4-08 | Ciclos, universos y lote congelado | 27 | 4 | RF-FAC-001..024; RF-WFL-027, 028, 031; RNF-NFR-010..012, 024 | — |
| PRO-O4-09 | Prefacturación, excepciones y aprobación | 24 | 0 | RF-FAC-025..046; RF-WFL-046, 047 | — |
| PRO-O4-10 | Emisión, estado fiscal, modalidades y numeración | 41 | 3 | RF-FAC-047..055, 057..075, 077..085, 177, 179; RF-WFL-189, 191; RNF-NFR-146, 153, 159 | — |
| PRO-O4-11 | Vencimientos, bloqueo, notas, recategorización, ítems y factura manual | 36 | 0 | RF-FAC-086..093, 098..105, 112..114, 116..122, 126..129, 131, 132; RF-MOR-011..014 | — |
| PRO-O4-12 | PDF, QR, talones, distribución y cierre de ciclo | 41 | 3 | RF-FAC-134..144, 147..150, 153..168, 172, 173; RF-WFL-174, 176..178; RF-COM-147, 150, 174, 195; RNF-NFR-179, 199, 230 | — |
| PRO-O4-13 | Cargos por operación y financiación comercial | 26 | 0 | RF-VEN-001..008, 010, 011, 080..086, 091, 092, 106, 114, 116; RF-TEC-063, 094; RF-STK-080; RF-CRM-102 | — |
| PRO-O4-14 | Adherentes mínimos (DEC-071) | 9 | 0 | RF-SOC-011..014, 026, 140..142, 145 | — |
| PRO-O4-15 | Portal de facturas, efectos en personas, reportes y mapeos | 23 | 2 | RF-POR-035, 078..081, 084..087; RF-PER-049, 059, 066, 126, 133, 141; RF-UXD-111, 161; RF-BIA-090, 096, 099; RF-MIG-007, 033, 038; RNF-CFG-006; RNF-WFL-002 | — |
| PRO-O4-16 | Integración de O4: primera factura con CAE | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O5-01 | Motor común de interés, recargos al cobrar e índices | 37 | 0 | RF-MOR-001..005, 007..010, 017..023, 026, 027, 029..034, 036, 041..044, 046, 047; RF-CFG-090..094, 096 | — |
| PRO-O5-02 | Auxiliar comercial, saldos y resumen de cuenta | 34 | 0 | RF-COB-001..030, 191, 192; RF-PER-062, 065 | — |
| PRO-O5-03 | Imputación, saldos a favor y cobros no identificados | 27 | 0 | RF-COB-031..054; RF-PER-107, 127, 140 | — |
| PRO-O5-04 | Caja, recibos y bloqueos de cobro | 38 | 7 | RF-COB-055..071, 073, 076..090, 193; RF-FAC-094, 096, 097, 145; RNF-NFR-005, 006, 205, 218, 224, 225, 229 | — |
| PRO-O5-05 | Cobradores y entes recaudadores | 31 | 0 | RF-COB-091..093, 097..118; RF-INT-059, 060, 062, 063, 065, 066 | — |
| PRO-O5-06 | Débito automático, pagos online y pasarelas prioritarias (DEC-015) | 48 | 2 | RF-COB-119..153; RF-INT-010, 045, 053..057, 067..069, 075, 081; RF-FAC-146; RNF-NFR-057, 088 | — |
| PRO-O5-07 | Cupón, devoluciones, conciliación, efectos contables, terceros y transición | 58 | 4 | RF-COB-154, 156..177, 179..189, 194, 195; RF-FAC-076, 106, 130, 151, 152; RF-FIS-082, 084, 089, 110, 136, 138, 139, 151..153; RF-MIG-047, 054, 055, 057, 083..085; RNF-NFR-016, 018, 197, 198 | — |
| PRO-O5-08 | Tesorería básica: cuentas, movimientos y conciliación bancaria | 38 | 0 | RF-TES-001..006, 009, 011, 013..018, 020..022, 025, 027, 028, 030..044, 047, 048, 050 | — |
| PRO-O5-09 | Rendiciones, cierre de cajas, cotizaciones e informes de tesorería | 33 | 0 | RF-TES-123, 126..130, 132..140, 144, 145, 166, 168..170, 175, 176, 178..186, 188 | — |
| PRO-O5-10 | Núcleo contable: configuración, plan de cuentas, ejercicios y centros de costo | 30 | 0 | RF-CON-001..007, 009..013, 015, 017, 022, 023, 027..033, 081, 083, 084, 086, 087, 091, 162 | RF-CON-025 |
| PRO-O5-11 | Asientos manuales y automáticos, conciliaciones e informes base | 57 | 0 | RF-CON-035..040, 042..045, 048, 050..067, 092..094, 100..102, 112, 114, 115, 121, 124..126, 139..141, 153..157, 159, 160; RF-FIS-157; RF-BIA-015, 092, 093, 095 | RF-CON-075; RF-STK-094; RF-BIA-104 (parte O5, v1.2) |
| PRO-O5-12 | Capital social mínimo (DEC-019) | 18 | 0 | RF-INS-029..031, 034..038, 040, 042..046, 056; RF-CON-098, 150, 151 | — |
| PRO-O5-13 | Pagos en el portal y facturación del SaaS (DEC-065) | 21 | 0 | RF-POR-012, 043..045, 082, 083, 089..098, 100, 101, 128; RF-PLA-040, 082 | — |
| PRO-O5-14 | Integración de O5: pago online imputado, rendido y asentado | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O6-01 | Intereses masivos, bloqueos y recargos restantes | 25 | 1 | RF-MOR-006, 016, 024, 025, 028, 035, 040, 045, 048..052, 054..064; RF-FAC-095; RNF-NFR-208 | — |
| PRO-O6-02 | Política de mora, instancias y candidatos | 20 | 0 | RF-MOR-065..082, 223; RF-FIS-164 | — |
| PRO-O6-03 | Notificaciones con constancia, tratamiento de morosos y protecciones | 38 | 0 | RF-MOR-083..116; RF-COM-148, 152, 182, 196 | — |
| PRO-O6-04 | Corte y reconexión con aprovisionamiento | 27 | 0 | RF-MOR-117..128, 130; RF-TEC-132..137, 187; RF-VEN-009; RF-STK-078; RF-CAT-066, 083, 089, 090; RF-FIS-166 | RF-CAT-046, 065, 088 |
| PRO-O6-05 | Baja, suspensión y reactivación | 12 | 0 | RF-MOR-131..140; RF-PER-051, 067 | — |
| PRO-O6-06 | Planes de pago y convenios | 31 | 0 | RF-MOR-141..170; RF-INS-041 | — |
| PRO-O6-07 | Planes de cuotas, garantías, incobrables y prescripción | 26 | 0 | RF-MOR-171..181, 183..189, 191..197; RF-CON-074 | — |
| PRO-O6-08 | Informes, portal de mora, auditoría y migración desde CoopOnline | 31 | 0 | RF-MOR-198..201, 203..218, 220; RF-POR-031, 049, 050, 066, 088, 099, 157, 169, 170, 173 | — |
| PRO-O6-09 | IA supervisada y canales omnicanal (DEC-055, DEC-056) | 23 | 1 | RF-CRM-171, 172, 174..178, 182, 188, 200..202, 204..213; RF-UXD-163; RNF-CRM-002 | — |
| PRO-O6-10 | CRM: cierre de piloto, circulares y plantillas | 11 | 0 | RF-CRM-027, 028, 042, 050, 069, 117, 250..253; RF-COM-164 | — |
| PRO-O6-11 | Integración de O6: piloto Internet de punta a punta | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O7-01 | Medidores, puntos de medición e instalaciones | 37 | 0 | RF-MED-001..024, 128; RF-PER-095, 097; RF-CAT-021, 056, 058, 060, 075, 093, 095..097, 114 | RF-CAT-017, 054, 055, 082, 083, 086 |
| PRO-O7-02 | Rutas, lotes, captura de lecturas y app de lecturista | 37 | 0 | RF-MED-025..060; RF-TEC-120 | — |
| PRO-O7-03 | Cálculo y validación de consumos, estimaciones, prorrateos y demanda | 33 | 0 | RF-MED-061..093 | — |
| PRO-O7-04 | Inyección, medición propia, telemedición AMI/MDM y prepago | 26 | 0 | RF-MED-094..119 | — |
| PRO-O7-05 | Portal de consumos, autolectura y facturación in situ | 17 | 0 | RF-MED-120..127; RF-POR-069, 103..108, 176; RF-WFL-098 | — |
| PRO-O7-06 | Tarifas medidas | 30 | 0 | RF-TAR-017, 023, 025, 026, 028, 031, 037, 038, 040, 041, 044..046, 048, 049, 070, 074, 077..081, 087, 109, 111, 114, 116, 119, 121; RF-CFG-103 | RF-TAR-019, 021, 022, 036, 039, 042, 068, 094, 100 |
| PRO-O7-07 | Facturación medida, CESP/LQSP e informes a reguladores | 25 | 0 | RF-FAC-108..111, 123, 170, 171, 174, 175, 178; RF-FIS-012, 071..074, 128, 143..150; RF-BIA-098 | — |
| PRO-O7-08 | Red GIS, mantenimiento, obras, inspecciones y costeo de OT | 52 | 0 | RF-TEC-035, 040, 041, 061, 066, 072, 106, 138..154, 156..163, 168..181, 196, 232, 233, 235, 236; RF-CAT-115 | RF-TEC-155, 231 |
| PRO-O7-09 | Mora, cobranza en campo, CRM y ventas de medidos | 17 | 0 | RF-MOR-015, 038, 039, 129, 202, 221, 222; RF-COB-075, 095, 096; RF-CRM-080, 081, 085, 114, 259; RF-VEN-013; RF-TEC-238 | RF-CRM-260; RF-MOR-130, 223 |
| PRO-O7-11 | Migración comercial vigente y corrida paralela (DEC-089; reemplaza a PRO-O11-07) | 15 | 1 | RF-CFG-132, 142; RF-TAR-101, 102; RF-FIS-163; RF-COB-155; RF-POR-127; RF-MIG-070..076; RF-MOR-219; RNF-NFR-154 | RNF-NFR-016 |
| PRO-O7-12 | Congelamiento, by-pass, corte comercial por servicio y rollback (DEC-068, DEC-089; reemplaza a PRO-O11-08) | 9 | 0 | RF-MIG-006, 080..082, 086..089; RF-POR-020 | - |
| PRO-O7-10 | Integración de O7: facturación de energía con lecturas, paralelo y ensayo de corte comercial | 0 | 0 | - (prompt de integración o verificación; se ejecuta después de PRO-O7-11 y PRO-O7-12) | - |
| PRO-O8-01 | Proveedores, catálogos, solicitudes y cotizaciones | 40 | 0 | RF-CMP-001..017, 020..026, 030..045 | — |
| PRO-O8-02 | Órdenes de compra, recepción, comprobantes de proveedor y 3 vías | 44 | 0 | RF-CMP-050..066, 070..085, 090..094, 149..153; RF-MED-129 | — |
| PRO-O8-03 | Órdenes de pago, Mis Comprobantes, informes y retenciones como agente | 36 | 0 | RF-CMP-100..108, 111, 112, 120..122, 140..148; RF-FIS-097..109 | — |
| PRO-O8-04 | Fiscal administrativo: agentes, percepciones, libros IVA digitales y regímenes | 31 | 0 | RF-FIS-007, 018..020, 022, 049, 091, 094, 096, 113, 114, 117..127, 129..133, 140, 142, 169; RF-INS-109 | RF-FIS-112; RF-INS-053 (parte anticipada: cierre mínimo de capital, v1.2) |
| PRO-O8-05 | Stock completo: artículos, movimientos, inventario, mínimos y valorización | 29 | 0 | RF-STK-005, 007, 008, 010, 012, 014, 018, 019, 029, 032, 033, 036, 037, 048, 070, 083, 085..088, 090..093, 095, 138, 139; RF-TEC-070, 239 | RF-STK-006, 024, 040, 131, 135 |
| PRO-O8-06 | Bienes de uso, RMA y stock por unidad de gasto | 21 | 0 | RF-STK-096..112, 114, 115, 130, 134 | — |
| PRO-O8-07 | Tesorería: maestros restantes, extractos e Interbanking | 22 | 0 | RF-TES-007, 008, 010, 012, 019, 023, 024, 026, 029, 045, 046, 049, 051..060 | RF-TES-014, 015 |
| PRO-O8-08 | Valores de terceros, cheques, eCheq, tarjetas y retenciones recibidas | 46 | 0 | RF-TES-061..106 | — |
| PRO-O8-09 | Pagos a proveedores, cotizaciones, flujo de fondos, compromisos e informes | 43 | 0 | RF-TES-107..122, 124, 125, 131, 141..143, 146..159, 167, 171..174, 177, 187 | RF-TES-128, 140, 145 |
| PRO-O8-10 | Contabilidad: planes, asientos, motor y centros de costo restantes | 31 | 0 | RF-CON-008, 014, 016, 018..021, 024, 026, 034, 041, 046, 047, 049, 068..070, 072, 077..080, 082, 085, 088..090, 095..097, 163 | RF-CON-007, 071, 094 |
| PRO-O8-11 | Múltiples planes, estados contables, ajuste por inflación, cierre, libros y presupuestos | 34 | 0 | RF-CON-103..111, 113, 116..119, 122, 123, 127..133, 135..138, 142..148 | — |
| PRO-O8-12 | Presupuestos de venta | 28 | 0 | RF-VEN-012, 020..046 | — |
| PRO-O8-13 | Venta de productos, financiación, vendedores, POS y efectos restantes | 48 | 0 | RF-VEN-050..070, 087..090, 093, 094, 100..102, 104, 107, 108, 110..113, 115, 117; RF-COB-072; RF-POR-102; RF-FAC-107, 115, 133; RF-MOR-037, 053, 182, 190 | — |
| PRO-O8-14 | Importación de sueldos externa, firma de pagos y flota contable (DEC-058, DEC-078) | 12 | 1 | RF-SUE-121, 140..144; RF-WFL-198..200; RF-SOC-118, 119; RF-BIA-101; RNF-NFR-207 | — |
| PRO-O8-15 | Integración de O8: cierre contable mensual | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O9-01 | Legajo completo, multiempleador y estructura laboral | 36 | 0 | RF-SUE-002..036; RF-CFG-139 | — |
| PRO-O9-02 | Conceptos, fórmulas, novedades, licencias y vacaciones | 30 | 0 | RF-SUE-037..065; RF-CFG-143 | — |
| PRO-O9-03 | Liquidaciones | 19 | 0 | RF-SUE-066..084 | — |
| PRO-O9-04 | Ganancias de 4.ª categoría | 11 | 0 | RF-SUE-085..095 | — |
| PRO-O9-05 | Seguridad social: F.931 y Libro de Sueldos Digital | 8 | 0 | RF-SUE-096..103 | — |
| PRO-O9-06 | Recibos y portal del empleado | 17 | 0 | RF-SUE-104..111; RF-POR-129..133, 135, 136; RF-WFL-197, 202 | — |
| PRO-O9-07 | Pago de haberes y contabilización | 22 | 0 | RF-SUE-112..120; RF-TES-160..165; RF-CON-073, 099, 149; RF-CMP-086, 109, 110; RF-FIS-111 | — |
| PRO-O9-08 | Certificaciones, egreso, RRHH, aprobaciones, reportes y paralelo | 20 | 0 | RF-SUE-122..139, 145, 146 | — |
| PRO-O9-09 | Integración de O9: dos períodos en paralelo | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O10-01 | Registro de asociados completo y Libro de Registro e INAES | 21 | 0 | RF-INS-005..008, 010..014, 016, 018..028 | RF-BIA-104 (parte O10, v1.2) |
| PRO-O10-02 | Capital social completo, excedentes y retornos | 29 | 0 | RF-INS-032, 033, 039, 047..055, 057..066; RF-CON-025, 075, 076, 120, 134, 152, 161 | RF-CON-065, 150, 151 |
| PRO-O10-03 | Órganos sociales, asambleas, votaciones, actas y honorarios | 41 | 0 | RF-INS-067..098, 100..103, 106, 108; RF-WFL-122, 180, 212 | — |
| PRO-O10-04 | Planes de cobertura, prestadores, adherentes y prestaciones | 52 | 0 | RF-SOC-001..010, 015..025, 027..038, 146, 148, 149; RF-PER-053, 109..117, 134; RF-CAT-022, 080; RF-MOR-224; RF-POR-178; RF-MIG-099 | — |
| PRO-O10-05 | Sepelio y cementerio parque | 29 | 0 | RF-SOC-039..064; RF-TAR-117; RF-FIS-162; RF-POR-177 | — |
| PRO-O10-06 | Banco de sangre y salud | 21 | 3 | RF-SOC-065..084, 147; RNF-NFR-101, 102, 104 | — |
| PRO-O10-07 | Vivienda y otros servicios | 38 | 0 | RF-SOC-085..117; RF-CAT-059, 100..103 | — |
| PRO-O10-08 | Flota, combustibles, viajes, rendiciones y GPS | 23 | 0 | RF-SOC-120..139, 143, 144; RF-TAR-118 | — |
| PRO-O10-09 | Telefonía y TV avanzadas | 36 | 0 | RF-TEC-131, 194, 195, 197..214, 234, 237; RF-TAR-024, 047, 050, 052, 097..099, 120, 122; RF-CAT-116; RF-CMP-154, 155; RF-POR-175 | RF-MOR-222; RF-TAR-049; RF-TEC-238 |
| PRO-O10-10 | Fabricación | 17 | 0 | RF-STK-116..129, 133; RF-VEN-047, 105 | RF-STK-024 |
| PRO-O10-11 | Mesa de entradas, turnero y tótem | 40 | 0 | RF-CRM-130..136, 140..157; RF-POR-118..120, 161..168; RF-INT-084; RF-WFL-220..222 | — |
| PRO-O10-12 | Actividades y tareas internas, omnicanal restante | 26 | 2 | RF-CRM-026, 040, 041, 044, 179..181, 183, 203, 220..235, 237; RNF-CRM-004, 006 | — |
| PRO-O10-13 | Facturación y cobranza de terceros restantes | 10 | 1 | RF-FAC-056, 124, 125, 176; RF-COB-074, 094, 178, 190; RF-POR-068; RNF-NFR-258; RF-FIS-165 | — |
| PRO-O10-14 | Integración de O10: asamblea y servicios sociales | 0 | 0 | — (prompt de integración o verificación) | — |
| PRO-O11-01 | Almacén analítico y modelo dimensional | 12 | 0 | RF-BIA-060..069; RF-FIS-158; RF-CRM-257 | RF-BIA-104 (parte O11, v1.2) |
| PRO-O11-02 | Generador de reportes y salas BI (DEC-089: suma RNF-NFR-106, antes en PRO-O11-08) | 9 | 1 | RF-BIA-041..045, 089, 091, 102; RF-POR-159; RNF-NFR-106 | RF-UXD-096 |
| PRO-O11-03 | API para terceros, medición y tableros avanzados (DEC-089: suma RNF-NFR-019, antes en PRO-O11-07) | 26 | 4 | RF-BIA-070..088; RF-PLA-083, 153; RF-WFL-014; RF-FAC-169; RF-TEC-230; RF-STK-043; RF-COM-094; RNF-NFR-175..177; RNF-NFR-019 | - |
| PRO-O11-04 | Pasarelas y billeteras restantes (DEC-015) | 0 | 0 | — (prompt de integración o verificación) | RF-COB-132; RF-FAC-146 |
| PRO-O11-05 | Modo pasarela fiscal, IA de compras y auditoría de plataforma | 9 | 0 | RF-FIS-154..156; RF-CMP-130, 131; RF-CON-158; RF-VEN-103; RF-IAM-144; RF-WFL-012 | RF-CON-123; RF-INT-023 |
| PRO-O11-06 | Migración por dominio: históricos y equivalencias (DEC-089: antes también RF-MIG-006, RF-CFG-132 y 142, RF-TAR-101 y 102, RF-COB-155, RF-POR-020 y 127 y RF-FIS-163, que pasan a PRO-O7-11 y PRO-O7-12) | 9 | 0 | RF-MIG-060, 061, 063, 064; RF-CRM-125, 254; RF-POR-171, 172; RF-WFL-163 | RF-CAT-113; RF-COM-090; RF-MOR-218; RF-STK-136; RF-CON-160 (antes en Implementa con 19 RF; plan §21.5) |
| PRO-O11-07 | *Reemplazado por PRO-O7-11 (DEC-089)*: corrida paralela y facturación comparada; antes 8 RF y 2 RNF, que pasan a PRO-O7-11 (RNF-NFR-019 a PRO-O11-03) | 0 | 0 | - | - |
| PRO-O11-08 | *Reemplazado por PRO-O7-12 (DEC-089)*: by-pass, convivencia, corte por etapas y rollback (DEC-068); antes 7 RF y 2 RNF, que pasan a PRO-O7-12 (RNF a PRO-O11-02 y PRO-O11-10) | 0 | 0 | - | - |
| PRO-O11-09 | Ensayo de corte comercial de los servicios que sigan en ProCoop (DEC-089; antes "(M01-M09)") | 0 | 0 | - (prompt de integración o verificación) | - |
| PRO-O11-10 | Ensayo de corte administrativo y cierre del plan (DEC-089: suma RNF-NFR-046, antes en PRO-O11-08) | 0 | 1 | RNF-NFR-046 | - |

## 16. Huecos de `05-registro-huecos.md` → ubicación en los anexos y en el plan

Se leyeron 85 filas: 77 huecos únicos (77 IDs distintos) y 8 filas índice por ficha que repiten huecos transversales. Estado: Corregido en anexo 71 (de ellos 8 con parámetro con default propuesto que requiere validación legal), Decisión 6 (pasaron a PA).

Para cada hueco se extrajeron los IDs de la celda de estado (la ubicación de la corrección) y se verificó: (1) que cada ID exista en algún anexo; (2) que cada RF exista en la tabla de RF de su anexo y (3) qué prompt del plan v1.1 lo implementa. La columna "Prompts" suma los prompts que implementan esos RF y los que citan el hueco por su ID.

| Hueco | Gravedad · Tipo · Ola | Estado | Anexos | IDs de la corrección | RF → prompt | Prompts | Verificación |
|---|---|---|---|---|---|---|---|
| HUECO-TRV-01 | Alta · Coherencia · O2 | Corregido en anexo | M18, M01, M02, T07, T05, T11 | RF-SOC-149, RF-PER-109..117, RN-PER-082..091, PRM-PER-064..072, EVT-PER-19, JOB-PER-06, RF-CAT-080, PAN-CAT-20, API-CAT-40, PRM-CAT-060..067, JOB-CAT-11, EVT-CAT-23, RN-MIG-054, COL-CAT-23 (+2) | PRO-O10-04: RF-SOC-149; RF-PER-109..117; RF-CAT-080 | PRO-O4-14, PRO-O10-04 | Correcta |
| HUECO-TRV-02 | Alta · Coherencia · O2 | Corregido en anexo | M02, M17, M18, T11 | — | — | PRO-O0-07 | Correcta |
| HUECO-TRV-03 | Alta · Coherencia · O2 | Corregido en anexo | M02, T11 | EVT-CAT-01..25, CTR-WFL-04 | — | — | Correcta |
| HUECO-TRV-04 | Alta · Coherencia · O2 | Corregido en anexo | M19, M02, T03 | RF-POR-174, PAN-POR-98..103, API-POR-126/127, PAN-CAT-21/22/23, PAN-POR-31, SM-PWS-038/039, SM-PWS-046..048 | PRO-O2-17: RF-POR-174 | PRO-O2-17 | Correcta |
| HUE-SRV-01 | Alta · Coherencia · O2 | Corregido en anexo | T11, M02, T09, M10 | — | — | PRO-O0-07 | Correcta |
| HUE-SRV-02 | Alta · Coherencia · O2 | Corregido en anexo | M02, T11 | EVT-CAT-01..25, EVT-CAT-26/27 | — | — | Correcta |
| HUE-SRV-04 | Alta · Coherencia · O2 | Corregido en anexo | M19, M02, M03, M05, M08, M10, M13 | RF-POR-174, PAN-POR-98..103, PAN-CAT-21..23, PAN-MED-31..33, PAN-FAC-43..45, PAN-MOR-39..41, PAN-TEC-57..59, PAN-STK-40 | PRO-O2-17: RF-POR-174 | PRO-O2-17 | Correcta |
| HUE-SRV-07 | Alta · Coherencia · O3 | Corregido en anexo | M10, M02 | PRM-TEC-024, RF-TEC-011, RN-TEC-005, PRM-CAT-013 | PRO-O3-04: RF-TEC-011 | PRO-O3-04 | Correcta |
| HUECO-CAP-04 | Alta · Faltante · O4 | Corregido en anexo (parámetro con default; validación legal) | M06 | RF-FIS-161, RN-FIS-124, PRM-FIS-122 | PRO-O4-04: RF-FIS-161 | PRO-O4-04 | Correcta |
| HUECO-TAS-01 | Alta · Decisión · O4 | Decisión | — | PA-CAT-18, DEC-083 | — | — | Correcta |
| HUECO-CAP-01 | Alta · Coherencia · O5 | Corregido en anexo | M15 | RF-CON-098, RF-CON-150, RF-CON-151, RF-CON-161, RF-CON-075 | PRO-O5-12: RF-CON-098, 150, 151; PRO-O10-02: RF-CON-075, 161 | PRO-O5-11, PRO-O5-12, PRO-O10-02 | Correcta |
| HUECO-TAS-02 | Alta · Faltante · O6 | Corregido en anexo | M06, M08 | RF-FIS-164, RN-FIS-127, RN-MOR-142, RF-MOR-068, PRM-MOR-202/203 | PRO-O6-02: RF-FIS-164; RF-MOR-068 | PRO-O6-02 | Correcta |
| HUE-ALU-01 | Alta · Faltante · O7 | Corregido en anexo | M08 | RN-MOR-141, RF-MOR-223, PRM-MOR-202, ESC-MOR-55 | PRO-O6-02: RF-MOR-223 | PRO-O6-02, PRO-O7-09 | Correcta |
| HUE-ALU-02 | Alta · Coherencia · O7 | Corregido en anexo | M02, M04 | RN-CAT-076, PRM-CAT-111, RF-TAR-057 | PRO-O4-06: RF-TAR-057 | PRO-O4-06 | Correcta |
| HUE-CLO-01 | Alta · Faltante · O7 | Corregido en anexo | M08 | RN-MOR-140, RF-MOR-222, ESC-MOR-54 | PRO-O7-09: RF-MOR-222 | PRO-O7-09, PRO-O10-09 | Correcta |
| HUECO-OBR-01 | Alta · Faltante · O7 | Corregido en anexo | M10, M02, M04, T09, T11 | RF-TEC-173, EVT-TEC-25, RF-CAT-115, JOB-CAT-13, RF-TAR-116, JOB-TAR-14 | PRO-O7-08: RF-TEC-173; RF-CAT-115; PRO-O7-06: RF-TAR-116 | PRO-O7-06, PRO-O7-08 | Correcta |
| HUE-ELE-03 | Alta · Coherencia · O7 | Corregido en anexo | M04 | PA-TAR-14, RF-TAR-045, RN-TAR-231 | PRO-O7-06: RF-TAR-045 | PRO-O7-06 | Correcta |
| HUE-GAS-03 | Alta · Coherencia · O7 | Corregido en anexo | M04, M03 | PRM-TAR-168, RN-TAR-035, PAN-TAR-09, CTR-TAR-38, PA-TAR-19, PAN-MED-20, PRM-MED-070..072, API-MED-66, CTR-MED-06 | — | — | Correcta |
| HUE-GAS-05 | Alta · Faltante · O7 | Corregido en anexo (parámetro con default; validación legal) | M10, M09, T09, T11 | RF-TEC-231..233, RN-TEC-116, PRM-TEC-152, PRM-TEC-153/154, EVT-TEC-35/36, JOB-TEC-17, RF-CRM-260, PRM-CRM-133 | PRO-O3-01: RF-TEC-231; PRO-O7-08: RF-TEC-232, 233; PRO-O3-11: RF-CRM-260 | PRO-O3-01, PRO-O3-11, PRO-O7-08, PRO-O7-09 | Correcta |
| HUECO-CEM-01 | Alta · Faltante · O10 | Corregido en anexo | M04, M06, T11 | RF-TAR-117, RN-TAR-248, ESC-TAR-34, RF-FIS-162, RN-FIS-125, EVT-SOC-06 | PRO-O10-05: RF-TAR-117; RF-FIS-162 | PRO-O10-05 | Correcta |
| HUECO-SAL-01 | Alta · Faltante · O10 | Corregido en anexo | M04, M18, T11 | RF-TAR-118, RN-TAR-249, PRM-TAR-170, ESC-TAR-35, EVT-SOC-07 | PRO-O10-08: RF-TAR-118 | PRO-O10-08 | Correcta |
| HUECO-SEP-01 | Alta · Faltante · O10 | Corregido en anexo (parámetro con default; validación legal) | M08, M18, T11 | RN-MOR-143, RF-MOR-224, PRM-MOR-204, EVT-MOR-21, ESC-MOR-56, RF-SOC-032, RN-SOC-054, PRM-SOC-052 | PRO-O10-04: RF-MOR-224; RF-SOC-032 | PRO-O10-04 | Correcta |
| HUECO-VIV-01 | Alta · Coherencia · O10 | Corregido en anexo | M04 | RN-TAR-075 | — | — | Correcta |
| HUECO-VIV-02 | Alta · Coherencia · O10 | Corregido en anexo | M04, T07, M18 | RN-TAR-075, PAN-TAR-29, PAN-SOC-17, PRM-TAR-072/073, PRM-SOC-019/018 | — | — | Correcta |
| HUE-TEL-04 | Alta · Faltante · O10 | Corregido en anexo (parámetro con default; validación legal) | M08 | RN-MOR-137, RF-MOR-222, PRM-MOR-199, ESC-MOR-51 | PRO-O7-09: RF-MOR-222 | PRO-O7-09, PRO-O10-09 | Correcta |
| HUE-TV-03 | Alta · Faltante · O10 | Corregido en anexo (parámetro con default; validación legal) | M08, M02 | RN-MOR-138, RF-MOR-222, PRM-MOR-200, RN-CAT-079, ESC-MOR-52 | PRO-O7-09: RF-MOR-222 | PRO-O7-09, PRO-O10-09 | Correcta |
| HUE-TV-04 | Alta · Faltante · O10 | Corregido en anexo | M10, T06 | RF-TEC-183, RF-TEC-194, FI-INT-86 | PRO-O3-09: RF-TEC-183; PRO-O10-09: RF-TEC-194 | PRO-O3-09, PRO-O10-09 | Correcta |
| HUE-SRV-09 | Media · Faltante · O1 | Corregido en anexo | T03, M02 | RF-UXD-179 | PRO-O2-09: RF-UXD-179 | PRO-O2-09 | Correcta |
| HUE-INT-03 | Media · Faltante · O2 | Corregido en anexo (parámetro con default; validación legal) | M09 | RF-CRM-258, PRM-CRM-132, PRM-CRM-135 | PRO-O3-11: RF-CRM-258 | PRO-O3-11 | Correcta |
| HUE-SRV-05 | Media · Coherencia · O2 | Corregido en anexo | M02, M19, M04 | ESC-TAR-03 | — | — | Correcta |
| HUE-SRV-06 | Media · Coherencia · O2 | Corregido en anexo | T09, T11 | JOB-COM-34..41 | — | PRO-O0-19 | Correcta |
| HUE-INT-01 | Media · Faltante · O3 | Corregido en anexo | M04, T11 | RF-TAR-115, RN-TAR-246, PRM-TAR-169, ESC-TAR-31, EVT-STK-07/08 | PRO-O3-03: RF-TAR-115 | PRO-O3-03 | Correcta |
| HUE-INT-02 | Media · Coherencia · O3 | Corregido en anexo | M04, T11 | JOB-TAR-11, JOB-CAT-10, EVT-TAR-012 | — | — | Correcta |
| HUECO-CAP-02 | Media · Coherencia · O5 | Corregido en anexo | M07 | RF-COB-176 | PRO-O5-07: RF-COB-176 | PRO-O5-07 | Correcta |
| HUE-AG-01 | Media · Decisión · O7 | Decisión | — | PA-TEC-20, DEC-072 | — | — | Correcta |
| HUE-AG-02 | Media · Faltante · O7 | Corregido en anexo (parámetro con default; validación legal) | M08 | RN-MOR-139, RN-MOR-085, PRM-MOR-201, ESC-MOR-53 | — | — | Correcta |
| HUE-AG-03 | Media · Faltante · O7 | Corregido en anexo | M02, M03, T11 | RF-CAT-114, RN-CAT-078, EVT-CAT-28, API-CAT-35, RF-MED-128, ESC-MED-36 | PRO-O7-01: RF-CAT-114; RF-MED-128 | PRO-O7-01 | Correcta |
| HUE-CLO-02 | Media · Faltante · O7 | Corregido en anexo | M04, M05 | RN-TAR-247, ESC-TAR-32, RF-FAC-175, RN-FAC-155, JOB-FAC-01 | PRO-O7-07: RF-FAC-175 | PRO-O7-07 | Correcta |
| HUECO-OBR-02 | Media · Faltante · O7 | Corregido en anexo | M10, M08 | RN-TEC-115, PRM-TEC-155, RN-MOR-146, PRM-MOR-207, ESC-MOR-59 | — | — | Correcta |
| HUECO-OBR-04 | Media · Coherencia · O7 | Corregido en anexo | T07 | — | — | PRO-O7-08, PRO-O11-06 | Correcta |
| HUECO-OBR-05 | Media · Coherencia · O7 | Corregido en anexo | M04, T07 | RN-TAR-071, RN-MIG-053 | — | — | Correcta |
| HUE-ELE-02 | Media · Faltante · O7 | Corregido en anexo | M05 | RF-FAC-174, RN-FAC-154, PRM-FAC-161/162, PAN-FAC-47, API-FAC-158/159 | PRO-O7-07: RF-FAC-174 | PRO-O7-07 | Correcta |
| HUE-ELE-04 | Media · Coherencia · O7 | Corregido en anexo | M10, M02 | PRM-TEC-043, RF-TEC-106, RN-TEC-114, PRM-CAT-015 | PRO-O7-08: RF-TEC-106 | PRO-O7-08 | Correcta |
| HUE-ELE-05 | Media · Faltante · O7 | Corregido en anexo (parámetro con default; validación legal) | M08 | RN-MOR-145, RF-MOR-221, RF-MOR-119, PRM-MOR-206, ESC-MOR-58 | PRO-O7-09: RF-MOR-221; PRO-O6-04: RF-MOR-119 | PRO-O6-04, PRO-O7-09 | Correcta |
| HUE-GAS-01 | Media · Coherencia · O7 | Corregido en anexo | M02, M19 | RF-CAT-095, PRM-CAT-096/110, PAN-CAT-25, API-CAT-41, RN-POR-042, CU-POR-14, API-POR-125 | PRO-O7-01: RF-CAT-095 | PRO-O7-01 | Correcta |
| HUE-GAS-02 | Media · Decisión · O7 | Decisión | — | PA-CAT-17, DEC-082 | — | — | Correcta |
| HUE-ELE-01 | Media · Faltante · O8 | Corregido en anexo | M12, M03, M15, T11 | RF-CMP-149..151, RF-CMP-153, RN-CMP-073/074, JOB-CMP-10, EVT-CMP-16, PAN-CMP-25, RF-MED-129, API-MED-78, PRM-CON-186, RN-CON-121 | PRO-O8-02: RF-CMP-149..151, 153; RF-MED-129 | PRO-O8-02 | Correcta |
| HUE-GAS-04 | Media · Faltante · O8 | Corregido en anexo | M12, M03, M15 | RF-CMP-152, PRM-CMP-114, ESC-CMP-22, RF-MED-129, PRM-CON-187 | PRO-O8-02: RF-CMP-152; RF-MED-129 | PRO-O8-02 | Correcta |
| HUE-SRV-08 | Media · Faltante · O8 | Corregido en anexo | T10, T12 | REP-BIA-015..024, RF-BIA-090 | PRO-O4-15: RF-BIA-090 | PRO-O4-15 | Correcta |
| HUECO-CEM-03 | Media · Faltante · O10 | Corregido en anexo | T07, M18 | RF-MIG-099 | PRO-O10-04: RF-MIG-099 | PRO-O10-04 | Correcta |
| HUECO-CEM-04 | Media · Decisión · O10 | Decisión | — | PA-CON-17, DEC-072 | — | — | Correcta |
| HUECO-OTR-03 | Media · Decisión · O10 | Decisión | — | PA-CAT-19, DEC-084 | — | — | Correcta |
| HUECO-OTR-04 | Media · Faltante · O10 | Corregido en anexo | M15, M07, M08, M18, T11 | RN-CON-123, PRM-CON-169, RF-COB-190, RF-MOR-179, EVT-MOR-16, RF-SOC-113 | PRO-O10-13: RF-COB-190; PRO-O6-07: RF-MOR-179; PRO-O10-07: RF-SOC-113 | PRO-O6-07, PRO-O10-07, PRO-O10-13 | Correcta |
| HUECO-OTR-05 | Media · Coherencia · O10 | Corregido en anexo | M18, T05 | RF-SOC-148, API-SOC-062, RF-SOC-115, RF-SOC-116, COL-SOC-53 | PRO-O10-04: RF-SOC-148; PRO-O10-07: RF-SOC-115, 116 | PRO-O10-04, PRO-O10-07 | Correcta |
| HUECO-SAN-02 | Media · Faltante · O10 | Corregido en anexo | M08, M18, T11 | RN-MOR-144, RN-MOR-088, RF-MOR-224, PRM-MOR-205, ESC-MOR-57, RF-SOC-146, RN-SOC-055 | PRO-O10-04: RF-MOR-224; RF-SOC-146 | PRO-O10-04 | Correcta |
| HUECO-SEP-02 | Media · Coherencia · O10 | Corregido en anexo | M18, T07, M02, M04, T09, T05 | RF-SOC-024, CTR-SOC-03, RN-MIG-054, RF-COM-106, CTR-COM-18, COL-SOC-02, CTR-DAT-27 | PRO-O10-04: RF-SOC-024; PRO-O2-14: RF-COM-106 | PRO-O2-14, PRO-O10-04 | Correcta |
| HUECO-SEP-03 | Media · Faltante · O10 | Corregido en anexo | M15, M18, T11 | RN-CON-122, PRM-CON-189..191, PRM-CON-194, ESC-CON-25, EVT-SOC-04 | — | — | Correcta |
| HUECO-TRV-06 | Media · Coherencia · O10 | Corregido en anexo | M18, T07, T11 | RF-SOC-088, EVT-SOC-05 | PRO-O10-07: RF-SOC-088 | PRO-O10-07 | Correcta |
| HUECO-VIV-03 | Media · Faltante · O10 | Corregido en anexo | T07 | RN-MIG-052, PRM-MIG-063 | — | — | Correcta |
| HUE-TEL-01 | Media · Coherencia · O10 | Corregido en anexo | T06, M10 | JOB-INT-23, JOB-TEC-09 | — | — | Correcta |
| HUE-TEL-03 | Media · Coherencia · O10 | Corregido en anexo | M04, M02 | RN-TAR-083, PRM-TAR-081/082, PRM-CAT-091/092 | — | — | Correcta |
| HUE-TEL-05 | Media · Decisión · O10 | Decisión | — | PA-TEC-19, DEC-072 | — | — | Correcta |
| HUE-TV-01 | Media · Faltante · O10 | Corregido en anexo | M12, M02, M15, T11 | RF-CMP-154/155, RN-CMP-075, JOB-CMP-09, EVT-CMP-17, PAN-CMP-26, API-CMP-123/124, PRM-CMP-115/116, RF-CAT-116, API-CAT-56, PRM-CON-188 | PRO-O10-09: RF-CMP-154, 155; RF-CAT-116 | PRO-O10-09 | Correcta |
| HUECO-CAP-03 | Media · Coherencia · O11 | Corregido en anexo | M17, T07 | — | — | — | Correcta |
| HUECO-TAS-03 | Media · Faltante · O11 | Corregido en anexo | M06, T07, M12, M02, T05 | RF-FIS-163, RN-FIS-126, RN-MIG-051, COL-CMP-05 | PRO-O7-11: RF-FIS-163 (DEC-089; antes PRO-O11-06) | PRO-O7-11 | Correcta |
| HUE-SRV-03 | Baja · Coherencia · O3 | Corregido en anexo | M10, M02, T05 | — | — | — | Correcta |
| HUE-ALU-03 | Baja · Faltante · O7 | Corregido en anexo | T03, M09, M02 | RF-UXD-179, RF-CRM-259, PRM-CRM-134, PRM-CAT-111 | PRO-O2-09: RF-UXD-179; PRO-O7-09: RF-CRM-259 | PRO-O2-09, PRO-O7-09 | Correcta |
| HUE-CLO-03 | Baja · Faltante · O7 | Corregido en anexo | T03, M09 | RF-UXD-179, RF-CRM-259 | PRO-O2-09: RF-UXD-179; PRO-O7-09: RF-CRM-259 | PRO-O2-09, PRO-O7-09 | Correcta |
| HUECO-OBR-03 | Baja · Faltante · O7 | Corregido en anexo | M19, M04 | RF-POR-176, PAN-POR-30, API-POR-123, RF-TAR-119, API-TAR-066 | PRO-O7-05: RF-POR-176; PRO-O7-06: RF-TAR-119 | PRO-O7-05, PRO-O7-06 | Correcta |
| HUECO-CEM-02 | Baja · Faltante · O10 | Corregido en anexo | M19, T03 | RF-POR-177, PAN-POR-104, API-POR-124, SM-LND-034 | PRO-O10-05: RF-POR-177 | PRO-O10-05 | Correcta |
| HUECO-OTR-02 | Baja · Faltante · O10 | Corregido en anexo | M18, M02 | RF-SOC-147 | PRO-O10-06: RF-SOC-147 | PRO-O10-06 | Correcta |
| HUECO-SAL-02 | Baja · Coherencia · O10 | Corregido en anexo | T07 | — | — | — | Correcta |
| HUECO-SAN-01 | Baja · Faltante · O10 | Corregido en anexo | M02 | RN-CAT-077 | — | — | Correcta |
| HUE-TEL-02 | Baja · Faltante · O10 | Corregido en anexo | M19, M10, M04 | RF-POR-175, PAN-POR-103, API-POR-122, RF-TEC-237, API-TEC-55, RF-TAR-120, API-TAR-067 | PRO-O10-09: RF-POR-175; RF-TEC-237; RF-TAR-120 | PRO-O10-09 | Correcta |
| HUE-TV-02 | Baja · Coherencia · O10 | Corregido en anexo | M02 | PRM-CAT-093 | — | — | Correcta |
| HUECO-OTR-01 | Baja · Faltante · O11 | Corregido en anexo | T07, M18 | RF-MIG-099 | PRO-O10-04: RF-MIG-099 | PRO-O10-04 | Correcta |
| HUECO-TRV-05 | Baja · Faltante · O11 | Corregido en anexo | T10 | REP-SOC-01..23, REP-INS-01..20 | — | — | Correcta |

Resultado: 77 de 77 huecos tienen todos los IDs de su ubicación presentes en los anexos.

Las 8 filas índice por ficha (T12 parte 1 §0.4) solo repiten huecos transversales ya listados (HUE-SRV-01, HUE-SRV-04, HUE-SRV-05, HUE-SRV-06, HUE-SRV-07, HUE-SRV-08); no agregan huecos.

## 17. Decisiones DEC-082 a DEC-087

Detalle de las decisiones nuevas: anexos declarados en el registro, anexos que la citan, filas con ID que la materializan y prompts del plan v1.1 que la aplican. La fila de cada una en la matriz 5.1 tiene el estado consolidado.

| DEC | Tema | Anexos declarados | Anexos que la citan (menciones) | Declarados sin cita | Filas con ID que la citan (muestra) | Prompts que la citan | Estado |
|---|---|---|---|---|---|---|---|
| DEC-082 | PA-CAT-17 Gas envasado (HUE-GAS-02) | M02, M13, M10, M04 | M02 (5), M03 (2), M04 (4), M10 (2), M13 (2), T11 (1), T12 (1) | — | M03 RF-MED-012, M04 RN-TAR-035, M10 RF-TEC-239, M13 RF-STK-139, T11 EVT-TEC-07, T12 HUE-GAS-02 | PRO-O2-09, PRO-O8-05 | Citada en todos los anexos declarados |
| DEC-083 | PA-CAT-18 Conceptos de terceros sin servicio propio (HUECO-TAS-01) | M02, M06, M08, T07 | M02 (5), M06 (3), M08 (3), T05 (2), T12 (1) | T07 | M06 RN-FIS-129, M08 RN-MOR-141, M08 RN-MOR-142, T05 COL-FIS-37, T12 HUECO-TAS-01 | PRO-O2-10, PRO-O4-04, PRO-O6-02 | Falta la cita en T07 |
| DEC-084 | PA-CAT-19 Correo electrónico y pack SMS (HUECO-OTR-03) | M02, T06, M04, M10 | M02 (5), M04 (8), M10 (6), T05 (1), T06 (4), T11 (2), T12 (1) | — | M02 RF-CAT-100, M04 RF-TAR-122, M04 RN-TAR-251, M04 PRM-TAR-171, M04 ESC-TAR-39, M10 RF-TEC-195, M10 API-TEC-56, M10 EVT-TEC-38 … | PRO-O2-09, PRO-O10-09 | Citada en todos los anexos declarados |
| DEC-085 | Corrección de volumen de gas (HUE-GAS-03, PA-TAR-19) | M04, M03 | M02 (2), M03 (13), M04 (6), M12 (5), T05 (7), T06 (2), T07 (2), T12 (3) | — | M03 RF-MED-129, M03 RF-MED-063, M03 RN-MED-069, M03 RN-MED-070, M03 ESC-MED-17, M03 CTR-MED-06, M04 RN-TAR-035, M04 ESC-TAR-38 … | PRO-O7-03, PRO-O7-06 | Citada en todos los anexos declarados |
| DEC-086 | Destino único de `BENSOC` (HUECO-SEP-02) | M18, T07, T05, M02, M04, T09 | M02 (9), M04 (4), T05 (7), T07 (2), T09 (5), T12 (1) | M18 | T05 COL-PER-11, T05 COL-CAT-23, T05 COL-TAR-14, T05 COL-SOC-02, T05 CTR-DAT-27, T05 CTR-DAT-76, T07 RN-MIG-054, T09 RF-COM-106 … | PRO-O10-04, PRO-O11-06 | Falta la cita en M18 |
| DEC-087 | PA-DAT-01 y PA-DAT-02 (T05) | T05, M07, M05, T08 | M04 (1), M05 (9), M07 (22), M08 (3), M10 (2), M14 (3), M15 (7), M19 (4), T04 (1), T05 (14), T06 (2), T07 (2), T08 (2), T11 (1) | — | M04 API-TAR-067, M05 RF-FAC-177, M05 RF-FAC-179, M05 RF-FAC-151, M05 RN-FAC-157, M05 RN-FAC-161, M05 EVT-FAC-07, M07 RF-COB-018 … | PRO-O4-10, PRO-O5-02, PRO-O5-04, PRO-O5-10, PRO-O11-06 | Citada en todos los anexos declarados |

## 18. Preguntas abiertas nuevas

El plan no cita estas PA por ID (aplica R7 y R8 sobre el estado de cada PA en `02-preguntas-abiertas.md`); por eso la columna de prompts muestra los que implementan los RF que la citan. Desde el cierre 05-11-2026 se agregan al final las 38 PA que los anexos registraron durante la corrección de inconsistencias (todas `Asumida (DEC-072)`), y después las 30 PA de la ronda de residuales y las 4 de la sincronización posterior del mismo día. El 10-11-2026 se agregan al final PA-FIS-23 a PA-FIS-26, que surgen de DEC-093, DEC-094, DEC-095 y DEC-102 (sección 22).

| PA | Anexo dueño | Tema | Estado en `02-preguntas-abiertas.md` | Hueco de origen | Menciones en el anexo dueño | Otros anexos que la citan | RF que la citan → prompt | Resultado |
|---|---|---|---|---|---:|---|---|---|
| PA-CAT-17 | M02 | Gas envasado (HUE-GAS-02) | Respondida (DEC-082) | HUE-GAS-02 | 6 | T12 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-18 | M02 | Conceptos de terceros sin servicio propio (HUECO-TAS-01) | Respondida (DEC-083) | HUECO-TAS-01 | 3 | T12 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-19 | M02 | Correo electrónico y pack SMS (HUECO-OTR-03) | Respondida (DEC-084) | HUECO-OTR-03 | 7 | M04, T12 | PRO-O10-07: RF-CAT-100; PRO-O10-09: RF-TAR-122 | Trazada (dueño la registra) |
| PA-TEC-19 | M10 | Portabilidad numérica (HUE-TEL-05) | Asumida (DEC-072) | HUE-TEL-05 | 9 | T05, T12 | PRO-O10-09: RF-TEC-234 | Trazada (dueño la registra) |
| PA-TEC-20 | M10 | Calidad del agua (HUE-AG-01) | Asumida (DEC-072) | HUE-AG-01 | 10 | T02, T10, T12 | PRO-O7-08: RF-TEC-235, 236 | Trazada (dueño la registra) |
| PA-CON-17 | M15 | Tratamiento contable de la venta del derecho de sepultura (HUECO-CE... | Asumida (DEC-072) | HUECO-CEM-04 | 8 | M06, T12 | PRO-O10-05: RF-FIS-162 | Trazada (dueño la registra) |
| PA-FIS-18 | M06 | Mantenimiento de padrones de IIBB (ex PA-CFG-05) | Asumida (DEC-072) | — | 6 | — | PRO-O4-01: RF-FIS-168 | Trazada (dueño la registra) |
| PA-TES-17 | M14 | Diferencia de arqueo en una rendición con varias entidades jurídicas | Asumida (DEC-072) | — | 1 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-DAT-01 | T05 | Cuenta corriente y cobro con varias entidades jurídicas | Asumida (DEC-072, DEC-087) | — | 7 | M07 | PRO-O5-02: RF-COB-192 | Trazada (dueño la registra) |
| PA-DAT-02 | T05 | Detalle histórico de más de 36 meses | Asumida (DEC-072, DEC-087) | — | 7 | M07 | PRO-O5-02: RF-COB-191 | Trazada (dueño la registra) |
| PA-PER-17 | M01 | Destino de `accounts.accountingGroupId` y `personIdentifierIndex.exceptionId` | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | M07, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-PER-18 | M01 | Destino de `exceptionId` y estados de `premises` | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-20 | M02 | Dueño de los CU compartidos CU-MER-01, CU-PRO-01, CU-CIC-01, CU-ESP-CEM y CU-ESP-SAN | Asumida (DEC-072) | — (corrección de inconsistencias) | 6 | M04, M08 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-21 | M02 | Destino de referencias de `billableConcepts`, `serviceContracts` y `serviceConcessions`, y estados propuestos del §8 | Asumida (DEC-072) | — (corrección de inconsistencias) | 11 | M06, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-22 | M02 | Destino de `externalClientId`, `bundleSubscriptionId` y `activityId` | Asumida (DEC-072) | — (corrección de inconsistencias) | 9 | M06, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MED-14 | M03 | Estados de `meteringSystems` | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TAR-20 | M04 | Destino de `taxRateIds`, `adjustmentRequestIds` y `m02ChangeIds`, y estados propuestos del §8 | Asumida (DEC-072) | — (corrección de inconsistencias) | 5 | M05, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FAC-21 | M05 | Destino de `invoices.sellerId` y estados propuestos del §8 | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FAC-22 | M05 | Destino de `adjustmentRequestIds` de M04 | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | M04, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FIS-19 | M06 | Capability de exportación de reportes fiscales | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | T02 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FIS-20 | M06 | Destino de `normativeAdoptions.simulationId` y `gatewayDocuments.externalSystemId` | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FIS-21 | M06 | Colección `fiscalClasses`, catálogo de actividades y estados de `provincialValidationCodes` | Asumida (DEC-072) | — (corrección de inconsistencias) | 5 | M02, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COB-19 | M07 | Estados de colecciones sin máquina de estados | Asumida (DEC-072) | — (corrección de inconsistencias) | 7 | M08, M09, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COB-20 | M07 | Colección `collectionAccountingGroups` | Asumida (DEC-072) | — (corrección de inconsistencias) | 5 | M01, T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MOR-21 | M08 | Anexo dueño de CU-CIC-01 (suspensión temporal y reactivación) | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | M02, M09, M19 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CRM-19 | M09 | Anexo dueño de CU-SOL-01 (alta de Internet y baja de TV) | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TEC-21 | M10 | Vocabulario de capabilities de M10 | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | T02 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TEC-22 | M10 | Estados de `technicalProcedures` | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-STK-10 | M13 | Estados de `fixedAssetValueChanges` y `mrpRuns` | Asumida (DEC-072) | — (corrección de inconsistencias) | 6 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TES-18 | M14 | Estados de `cashFlowScenarios` | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CON-18 | M15 | Colección del modelo de centro de costo (`costCenterModelId`) | Asumida (DEC-072) | — (corrección de inconsistencias) | 5 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SUE-16 | M16 | Dueño de las pantallas del empleado | Asumida (DEC-072) | — (corrección de inconsistencias) | 7 | M19, T03 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SUE-17 | M16 | Estados de `payslipNotifications`, `performanceReviews` y `objectives` | Asumida (DEC-072) | — (corrección de inconsistencias) | 7 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-INS-12 | M17 | Nombre del campo que apunta al padrón de asociados | Asumida (DEC-072) | — (corrección de inconsistencias) | 13 | M01 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SOC-16 | M18 | Referencia al artículo de stock en vivienda | Asumida (DEC-072) | — (corrección de inconsistencias) | 11 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SOC-17 | M18 | API-SOC-006: endpoint HTTP o servicio interno | Asumida (DEC-072) | — (corrección de inconsistencias) | 1 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SOC-18 | M18 | Estados de `providerAgreements`, `donationCampaigns` y `housingPlans` | Asumida (DEC-072) | — (corrección de inconsistencias) | 7 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-POR-20 | M19 | Tabbar del socio y pantalla Comunidad | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | T03 | PRO-O0-15: RF-UXD-066; PRO-O2-17: RF-POR-180 | Trazada (dueño la registra) |
| PA-POR-21 | M19 | Versiones de formularios del portal | Asumida (DEC-072) | — (corrección de inconsistencias) | 8 | T05, T11 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CFG-14 | T04 | Cambio de CUIT o de entidad emisora con documentos emitidos | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | T04b | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-DAT-03 | T05 | Errores de unicidad y de campos en el catálogo de T09 | Asumida (DEC-072) | — (corrección de inconsistencias) | 8 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-INT-26 | T06 | Estados de `aiUsageLogs` | Asumida (DEC-072) | — (corrección de inconsistencias) | 4 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MIG-20 | T07 | Dónde se guarda el acta de aceptación de la migración | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | T11 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-NFR-22 | T08 | Factor de simultaneidad del pico de plataforma | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-NFR-23 | T08 | Copias anuales de 10 años | Asumida (DEC-072) | — (corrección de inconsistencias) | 2 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COM-17 | T09 | Estados de los avisos de plataforma (`platformNotices`) | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COM-18 | T09 | Tipo de comunicación en plantillas de campaña y de texto libre | Asumida (DEC-072) | — (corrección de inconsistencias) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-WFL-22 | T11 | Destino de `responsibleAreaId` | Asumida (DEC-072) | — (corrección de inconsistencias) | 1 | T05 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-PER-19 | M01 | Residuales del 05-11-2026: estados, referencias y nombres | Asumida (DEC-072) | — (ronda de residuales) | 4 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CAT-23 | M02 | Residuales del 05-11-2026: estados y referencias | Asumida (DEC-072) | — (ronda de residuales) | 5 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MED-15 | M03 | Residuales del 05-11-2026: estados y referencias | Asumida (DEC-072) | — (ronda de residuales) | 5 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TAR-21 | M04 | Residuales del 05-11-2026: estados, referencias y nombres | Asumida (DEC-072) | — (ronda de residuales) | 2 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FAC-23 | M05 | Residuales del 05-11-2026: estados, referencias y API reemplazada | Asumida (DEC-072) | — (ronda de residuales) | 5 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FIS-22 | M06 | Residuales del 05-11-2026: estados, servicios internos y referencias | Asumida (DEC-072) | — (ronda de residuales) | 5 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COB-21 | M07 | Residuales del 05-11-2026: referencias, nombres canónicos y estados | Asumida (DEC-072) | — (ronda de residuales) | 25 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MOR-22 | M08 | Residuales del 05-11-2026: referencias, nombres canónicos, estados y alias | Asumida (DEC-072) | — (ronda de residuales) | 41 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CRM-20 | M09 | Residuales del 05-11-2026: referencias, nombres de T05 y estados | Asumida (DEC-072) | — (ronda de residuales) | 26 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-TEC-23 | M10 | Residuales del 05-11-2026: referencias, estados, rutas de API, comando de OT y alias | Asumida (DEC-072) | — (ronda de residuales) | 82 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-VEN-12 | M11 | Residuales del 05-11-2026: referencias, estados y API reemplazadas | Asumida (DEC-072) | — (ronda de residuales) | 33 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CMP-16 | M12 | Residuales del 05-11-2026: estados, referencias y nombres de campo | Asumida (DEC-072) | — (ronda de residuales) | 18 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-STK-11 | M13 | Residuales del 05-11-2026: estados, referencias, nombres de campo y evento bajo mínimo | Asumida (DEC-072) | — (ronda de residuales) | 25 | — | PRO-O8-05: RF-STK-029 | Trazada (dueño la registra) |
| PA-TES-19 | M14 | Residuales del 05-11-2026: estados, referencias, nombres de campo, CU duplicado y capability de API | Asumida (DEC-072) | — (ronda de residuales) | 21 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CON-19 | M15 | Residuales del 05-11-2026: estados, referencias, nombres de campo y eventos de M17 | Asumida (DEC-072) | — (ronda de residuales) | 19 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SUE-18 | M16 | Residuales del 05-11-2026: estados, referencias y nombres de campo | Asumida (DEC-072) | — (ronda de residuales) | 43 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-INS-13 | M17 | Residuales del 05-11-2026: estados, referencias, nombres de campo y tipos de evento | Asumida (DEC-072) | — (ronda de residuales) | 25 | M15, M19 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-SOC-19 | M18 | Residuales del 05-11-2026: estados, referencias, nombres de campo y evento GPS | Asumida (DEC-072) | — (ronda de residuales) | 13 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-POR-22 | M19 | Residuales del 05-11-2026: estados, referencias, rótulo corto y nombre de PAN-POR-105 | Asumida (DEC-072) | — (ronda de residuales) | 7 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-PLA-15 | T01 | Cierre de residuales del anexo (estados, referencias, API, colas y CU) | Asumida (DEC-072) | — (ronda de residuales) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-IAM-18 | T02 | Cierre de residuales del anexo (capabilities, estados, referencias y CU) | Asumida (DEC-072) | — (ronda de residuales) | 11 | T01, T03, T04 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-UXD-18 | T03 | Cierre de residuales del anexo (mapa del sitio, tabbar, estados, API y CU) | Asumida (DEC-072) | — (ronda de residuales) | 4 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-CFG-15 | T04 | Cierre de residuales del anexo (pantalla sin ruta, servicios, API, estados y tablas de campos) | Asumida (DEC-072) | — (ronda de residuales) | 4 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-DAT-04 | T05 | Destinos de referencia pendientes y alineación del catálogo con los anexos dueños | Asumida (DEC-072) | — (ronda de residuales) | 24 | M04, M16 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-INT-27 | T06 | Cierre de residuales del anexo (tipos de evento, estados, referencias y API) | Asumida (DEC-072) | — (ronda de residuales) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-MIG-21 | T07 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | Asumida (DEC-072) | — (ronda de residuales) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-NFR-24 | T08 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | Asumida (DEC-072) | — (ronda de residuales) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-COM-19 | T09 | Cierre de residuales: carga rápida de reclamos por SMS, destinos de referencia y estados | Asumida (DEC-072) | — (ronda de residuales) | 14 | — | PRO-O2-15: RF-COM-156 | Trazada (dueño la registra) |
| PA-BIA-17 | T10 | Cierre de residuales del anexo (estados, referencias, tablas de campos y API) | Asumida (DEC-072) | — (ronda de residuales) | 3 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-WFL-23 | T11 | Cierre de residuales: nombres de eventos, alias con un solo canónico y máquinas de estado | Asumida (DEC-072) | — (ronda de residuales) | 96 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-IAM-19 | T02 | Sincronización posterior a la ronda de residuales: capabilities reemplazadas, servicios internos y comando de OT | Asumida (DEC-072) | — (sincronización posterior a los residuales) | 8 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-UXD-19 | T03 | Sincronización posterior a la ronda de residuales: mapa del portal y rótulo corto | Asumida (DEC-072) | — (sincronización posterior a los residuales) | 4 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-DAT-05 | T05 | Sincronización posterior a la ronda de residuales: catálogo de colecciones | Asumida (DEC-072) | — (sincronización posterior a los residuales) | 55 | M18 | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-WFL-24 | T11 | Sincronización posterior a la ronda de residuales: alias de M13 y comando de OT en EVT-CRM-13 | Asumida (DEC-072) | — (sincronización posterior a los residuales) | 24 | — | — | Trazada en el dueño; ningún RF la cita (solo PA, RN, PRM o §21) |
| PA-FIS-23 | M06 | Conceptos accesorios admitidos dentro de la LQSP en la factura agrupada (DEC-093) | Pendiente (contador) | — (contraste de `NucleoTransversal-Modelo`, DEC-093) | 9 | M02, M05, T05 | PRO-O4-04: RF-FIS-076; PRO-O4-07: RF-CAT-117; PRO-O4-10: RF-FAC-067 | Trazada (dueño la registra) |
| PA-FIS-24 | M06 | Norma que obliga a usar la LQSP, vía de autorización y efecto de las RG 5003 y 5866/2026 (DEC-094) | Pendiente (contador) | — (contraste de `NucleoTransversal-Modelo`, DEC-094) | 7 | M05 | PRO-O4-03: RF-FIS-043; PRO-O7-07: RF-FIS-071 | Trazada (dueño la registra) |
| PA-FIS-25 | M06 | Obligaciones y exenciones propias de la cooperativa (DEC-095) | Pendiente (contador) | — (contraste de `NucleoTransversal-Modelo`, DEC-095) | 7 | M17 | PRO-O8-04: RF-FIS-169; RF-INS-109 | Trazada (dueño la registra) |
| PA-FIS-26 | M06 | Alícuota de IVA del 27 % a responsables inscriptos según el uso del suministro (DEC-102) | Pendiente (contador) | — (contraste de `NucleoTransversal-Modelo`, DEC-102) | 7 | M01, T05 | PRO-O2-05: RF-PER-089; PRO-O4-04: RF-FIS-079 | Trazada (dueño la registra) |

## 19. Eventos nuevos o reemplazados de T11

El plan construye cada evento en el primer prompt que construye un RF que lo necesita (§0.4); la columna de prompts muestra los que implementan los RF que citan el evento.

| Evento | Nombre | Anexo productor (fila de definición) | Catálogo T11 | Consumidores que lo citan | RF que lo citan → prompt | Estado |
|---|---|---|---|---|---|---|
| EVT-FIS-24 | `fis.thirdPartyAgreement.published` | M06 (sí) | sí | M08 | Se construye con el RF que crea la colección emisora (§0.4): PRO-O6-04: RF-FIS-166; PRO-O6-02: RF-FIS-164 | Definido y catalogado |
| EVT-CFG-19 | `cfg.legalEntity.created` / `.updated` / `.deactivated` | T04 (sí) | sí | M06, M15, T01 | PRO-O4-01: RF-FIS-167 · se construye con el RF que crea la colección emisora (§0.4): PRO-O0-13: RF-CFG-134, 135 | Definido y catalogado |
| EVT-CFG-20 | `cfg.branch.created` / `.updated` / `.deactivated` | T04 (sí) | sí | M06, M07, T01, T03 | Se construye con el RF que crea la colección emisora (§0.4): PRO-O0-13: RF-CFG-140 | Definido y catalogado |
| EVT-PLA-21 | `pla.branch.created` / `.updated` | T01 (sí) | sí | M07, T03, T04 | — | Reemplazado por EVT-CFG-20 (marcado en T01 y T11; alias hasta el cierre de O2) |

## 20. Cambios de la versión 1.1

| Sección | Cambio | Valor de la versión 1.0 (reemplazado) |
|---|---|---|
| Encabezado | Versión 1.1 del 05-11-2026; se agregan como insumos el plan de olas v1.1, el registro de huecos, DEC-082..087, PA y eventos nuevos | Versión 1.0 del 04-11-2026, solo fuentes → anexos |
| 1 y 2 | Nuevas unidades trazadas (PLAN, HUE, DEC/PA/EVT) y paso 4 del método | Tres pasos, solo PowerShell |
| 3 | 1.661 cubiertas directas, 18 débiles, 98,0 % de cobertura y 79,7 % estricta; tablas Cubierta 582 · Descartada 25 · Reemplazada 52 | 1.659, 20, 97,9 %, 79,6 %; Cubierta 581 · Descartada 26 |
| 4.1 | 26 brechas, sin cambios; se recontó la evidencia | 26 brechas |
| 4.2 | 18 unidades débiles | 20 (salen RN-07 §0 y RN-07 §3.2) |
| 4.3 | RN-09 §14 solo en la ficha inicial de M13; la cita DFA §30–§34 de T07 está corregida | RN-09 §14 en 20 filas de M13; DFA §30–§34 sin corregir |
| 5.1 | 87 decisiones (se agregan DEC-082 a DEC-087): 82 citadas, 2 solo vía PA, 3 sin reflejo en algún anexo declarado | 81 decisiones: 13, 20 y 48 |
| 5.2 | Se cierran las brechas de contenido de DEC-064 y DEC-043; se agregan DEC-079, DEC-083 y DEC-086 | DEC-064 y DEC-043 como brechas |
| 6 a 13 | Regeneradas sobre los anexos del 05-11-2026 | Anexos del 04-11-2026 |
| 14 | Se agregan el control RF/RNF → prompt, la regeneración de 16 a 19 y la regla de reemplazo | — |
| 15 a 19 | Secciones nuevas: RF/RNF → prompt, huecos, DEC-082..087, PA nuevas y eventos de T11 | No existían |

## 21. Cierre de la corrección de inconsistencias (05-11-2026)

Insumo: `_trabajo/correccion-inconsistencias-pendientes-cierre.md`. Las filas de §15 se recalcularon con `_trabajo/plan_recuento.py` y `_trabajo/matriz_verif_157.py` (lectura de `anexos/*.md` y del plan; los respaldos `_trabajo/backup-*` no se leen); §18 con `_trabajo/cierre_final_matriz.py`. Las matrices de fuentes (secciones 3 a 13) no se regeneraron: ninguna unidad de fuente cambia de estado por estos cambios (los anexos siguen citando las mismas secciones de BASE).

### 21.1 Casos de uso renumerados y dueños de CU compartidos

| CU vigente | Anexo | Antes | Dueño del ID anterior | Fundamento | Efecto en esta matriz |
|---|---|---|---|---|---|
| CU-CAT-13 | M02 §16 | CU-MER-01 (de M02) | M03 §16 (CU-MER-01, usuario-generador) | PA-CAT-20 | Sin cambio de estado; BASE no tiene fila propia de CU-MER-01 en la sección 7 |
| CU-CRM-21 | M09 §16 | CU-26 (de M09) | T09 (CU-26 de BASE §26) | Pendiente de cierre (CU duplicados) | Fila BASE §26 "CU-26": M09 sigue citando BASE §26; se anota el ID nuevo |
| CU-INS-15 | M17 §16 | CU-INS-01 (de M17) | M10 (CU-INS-01 de BASE §73, instalación integral) | Pendiente de cierre (CU duplicados) | Fila BASE §73 "CU-INS-01": M17 sigue citando BASE §73; se anota el ID nuevo |
| CU-CIC-01 | M08 §16 (dueño) | Definiciones parciales en M02, M09 y M19 | — | PA-MOR-21 (reemplaza para este CU la opción de PA-CAT-20) | M02, M09 y M19 citan la parte que les toca |
| CU-SOL-01 | M09 §16 (dueño) | Definiciones parciales en M02 y M09 | — | PA-CRM-19 | M02 cita su parte de contrato |

### 21.2 Requisito y pantalla nuevos

| RF | Pantalla | Anexo | Ola | Prompt | Fuente | Estado |
|---|---|---|---|---|---|---|
| RF-POR-180 (Comunidad en la tabbar del socio) | PAN-POR-105 `/app/comunidad` | M19 | O2 | PRO-O2-17 | PA-POR-20; maestro §9.2; T03 RF-UXD-066, CTR-UXD-12 | Trazado: el RF cita la PAN y la PA, y el prompt lo implementa (plan §21.6) |

### 21.3 Colecciones nuevas

Esta matriz no tiene una sección de colecciones: las colecciones se trazan en T05 y las tablas de ProCoop en la sección 13 desde T07 §19. Se registran aquí para la próxima regeneración.

| Colección | T05 | Dueño | Ola | PA | Tabla ProCoop | Efecto en la sección 13 |
|---|---|---|---|---|---|---|
| `costCenterModels` | COL-CON-39 | M15 §7.19.1 | O5 | PA-CON-18 | — | Ninguno |
| `bundleSubscriptions` | COL-CAT-29 | M02 §7.29 | O4 | PA-CAT-22 | — (no existe en ProCoop) | Ninguno (`COMBOS` sigue → `products.bundle`) |
| `fiscalClasses` | COL-FIS-47 | M06 §7.38 | O2 | PA-FIS-21 | — | Ninguno |
| `collectionAccountingGroups` | COL-COB-47 | M07 §7.36 | O5 | PA-COB-20 | `GRU_CON` | La fila `GRU_CON` sigue el destino de T07 §19.17 (`postingRules`); T05 y M15 ya la mandan a `collectionAccountingGroups` (cuentas en `entityAccountAssignments`). Pendiente de T07 |

### 21.4 Cifras

| Sección | Valor vigente | Valor anterior (reemplazado) |
|---|---|---|
| Encabezado, 15.1 a 15.3 | 4.204 RF; 4.496 RF y RNF con un prompt; O2 614; M19 180 | 4.203; 4.495; O2 613; M19 179 |
| 15.2 | O5 469 y O11 89 (alineado con el plan §21.5, que esta matriz no había tomado) | O5 468 y O11 90 |
| 15.4 | RF-CON-160 en PRO-O5-11; RF-UXD-163 con celda `O6 (DEC-056)` en T03 | PRO-O11-06; `O9+ (cuando haya bot)` |
| 15.7 | PRO-O2-17 65 RF (con RF-POR-180); PRO-O5-11 57 (con RF-CON-160); PRO-O11-06 18 (RF-CON-160 como extensión). Verificación: **174** bloques PRO-O alineados con el plan (19-11-2026) | 64, 56 y 19 |
| 18 | 48 PA (10 de los huecos y 38 de la corrección) | 10 |

### 21.5 Ronda de residuales (05-11-2026)

Recuento con `_trabajo/plan_recuento.py` (**4.213 RF** y **293 RNF**, 0 faltantes en IMPLEMENTAR). Verificación prompt ↔ RF: misma lectura §15.0; herramientas históricas `matriz_verif_157.py` sustituidas por `plan_recuento.py` (19-11-2026).

| CU vigente | Anexo | Antes | Dueño del ID anterior | Fundamento | Efecto en esta matriz |
|---|---|---|---|---|---|
| CU-TES-17 | M14 §16 | CU-13 (de M14, parte tesorería) | BASE §13 (M07 y T06 citan su parte) | PA-TES-19 | Fila BASE §13 "CU-13": M14 sigue citando BASE §13; se anota el ID nuevo |
| CU-PLA-15 | T01 §16 | CU-ARQ-01 (parte PLA) | T11 | PA-PLA-15 | Fila BASE §58: T01 sigue citando BASE §58; se anota el ID nuevo |
| CU-IAM-11 | T02 §16 | CU-SEG-01 | T08 | PA-IAM-18 | Fila BASE §60 "CU-SEG-01": se anota el ID nuevo |
| CU-UXD-07 | T03 §16 | CU-ACC-01 (parte UX) | T02 | PA-UXD-18 | Fila BASE §45 "CU-ACC-01": se anota el ID nuevo |

Pantallas de T03 asignadas a RF existentes (PA-UXD-18; sin RF nuevos):

| PAN | App | Ruta | RF | Prompt | Estado |
|---|---|---|---|---|---|
| PAN-UXD-15 | PWA socio y empleado | `/app/asistente` (topbar, ícono del asistente) | RF-UXD-064 | PRO-O0-15 | Trazada: la PAN cita el RF y el RF está en un solo prompt |
| PAN-UXD-16 | PWA empleado | `/app/empleado/directorio` | RF-UXD-063 | PRO-O0-15 | Trazada: la PAN cita el RF y el RF está en un solo prompt |
| PAN-UXD-17 | admin | `/admin/inicio/alertas` | RF-UXD-055 | PRO-O0-15 | Trazada: la PAN cita el RF y el RF está en un solo prompt |

| Sección | Valor vigente | Valor anterior (reemplazado) |
|---|---|---|
| 18 | 78 PA (10 de los huecos, 38 de la corrección y 30 de la ronda de residuales) | 48 |
| 18 (sincronización posterior) | 82 PA (se agregan PA-IAM-19, PA-UXD-19, PA-DAT-05 y PA-WFL-24) | 78 |
| 15.2, 15.5 y 15.7 (DEC-089, plan §21.7) | O7 12 prompts, 298 RF y 1 RNF; O11 8 prompts efectivos, 65 RF y 6 RNF; PRO-O7-11 (15 RF) y PRO-O7-12 (9 RF) nuevos; PRO-O11-06 9 RF; PRO-O11-07 y PRO-O11-08 reemplazados | O7 10 / 274 / 0; O11 10 / 89 / 7; PRO-O11-06 18 |

## 22. Cambios de la versión 1.2 (DEC-093 a DEC-108, 10-11-2026)

Insumo: DEC-093 a DEC-108 y PA-FIS-23 a PA-FIS-26, aprobadas por el solicitante el 10-11-2026, y el plan de olas v1.2 (`03-plan-de-olas-y-prompts.md` §22). Recuento de RF y RNF con `_trabajo/plan_recuento.py` (4.213 RF y 293 RNF, 0 faltantes, 0 duplicados, 0 IDs inexistentes y 0 diferencias entre el conteo por prompt y las tablas del plan). Las menciones de las decisiones y de las PA se contaron sobre `anexos/*.md` el 10-11-2026, mientras otro subagente cerraba detalles en M15, T02, T11, T05, T03, M06, M08, M02, M05 y M07: pueden variar en la próxima regeneración. Las matrices de fuentes (secciones 3 a 13) no se regeneraron.

### 22.1 Fuente revisada que no es fuente de requisitos

El documento externo `NucleoTransversal-Modelo` se contrastó con la especificación (`docs/revision-externa/NucleoTransversal-contraste.md`, con los aportes rechazados y su motivo en `NucleoTransversal-rechazados.md`). No es fuente de requisitos y no tiene lugar en la jerarquía de prevalencia del maestro §2: esta matriz no traza sus unidades. Sus aportes aceptados entraron por decisiones: A1 a A11 por DEC-093 a DEC-103 y las inconsistencias internas de la sección 6 del informe por DEC-104; la revisión de los rechazos 2, 4, 8 y 9 dio DEC-108, DEC-105, DEC-106 y DEC-107. Cada RF, RN o colección que materializa un aporte cita su DEC, no el documento externo. GestionApps no es fuente hoy: queda como posible fuente a analizar si se obtiene su documentación (DEC-108).

### 22.2 RF y RNF nuevos → prompt

| ID | Anexo | Ola en el anexo | DEC | Prompt que lo implementa | Extensiones |
|---|---|---|---|---|---|
| RF-BIA-104 | T10 | O1 (auditoría) / O5 (centros de costo) / O10 (asociados) | DEC-096 | PRO-O1-17 | PRO-O5-11 (parte O5), PRO-O10-01 (parte O10), PRO-O11-01 (almacén analítico) |
| RNF-NFR-260 | T08 | O1 | DEC-100 | PRO-O1-15 | — (alerta en PRO-O1-06) |
| RF-PER-174 | M01 | O2 | DEC-097 | PRO-O2-07 | — |
| RF-PER-175 | M01 | O2 | DEC-099 | PRO-O2-07 | — |
| RF-CRM-261 | M09 | O2 | DEC-099 | PRO-O2-11 | — |
| RF-CAT-117 | M02 | O4 | DEC-093 | PRO-O4-07 | — |
| RF-COB-195 | M07 | O5 | DEC-101 | PRO-O5-07 | — |
| RF-FIS-169 | M06 | O8 | DEC-095 | PRO-O8-04 | — |
| RF-INS-109 | M17 | O8 (prerrequisito del registro de obligaciones propias de M06) | DEC-095, DEC-096 | PRO-O8-04 | PRO-O8-04 anticipa un cierre mínimo de capital como parte de RF-INS-053, que sigue en PRO-O10-02 |
| RF-CON-163 | M15 | O8 | DEC-095 | PRO-O8-10 | — |

Verificación: los 10 existen en la tabla de su anexo con la ola indicada y están en la línea `IMPLEMENTAR` de un solo prompt, de la primera ola de su celda (regla §0.1 del plan). Ningún otro RF o RNF de los anexos que cita DEC-093 a DEC-108 queda sin prompt: los existentes que cambiaron de texto conservan ola y prompt.

### 22.3 Decisiones DEC-093 a DEC-108

| DEC | Anexos declarados | Declarados sin cita | RF/RNF nuevos | Prompts del plan v1.2 que la mencionan | Estado |
|---|---|---|---|---|---|
| DEC-093 | M05, M06 | — | RF-CAT-117 | PRO-O4-04, PRO-O4-07, PRO-O4-09, PRO-O4-10, PRO-O7-07 | Citada |
| DEC-094 | M06, M05 | — | — | PRO-O4-03, PRO-O7-07 | Citada |
| DEC-095 | M06, M17, M15 | — | RF-FIS-169, RF-INS-109, RF-CON-163 | PRO-O8-04, PRO-O8-09, PRO-O8-10, PRO-O10-02 | Citada |
| DEC-096 | M17, M15, T02, T04, T05 | — | RF-BIA-104, RF-INS-109 | PRO-O0-12, PRO-O1-09, PRO-O1-10, PRO-O1-17, PRO-O2-04, PRO-O2-08, PRO-O2-18, PRO-O5-10, PRO-O5-11, PRO-O5-12, PRO-O8-04, PRO-O10-01, PRO-O10-02, PRO-O10-03, PRO-O11-01 | Citada |
| DEC-097 | M12, M11, M18, M01, T07 | — | RF-PER-174 | PRO-O2-03, PRO-O2-07, PRO-O2-18, PRO-O3-03, PRO-O8-01, PRO-O8-03, PRO-O8-13, PRO-O8-14, PRO-O9-01, PRO-O10-04 | Citada |
| DEC-098 | T04, T07 | — | — | PRO-O0-13, PRO-O7-11, PRO-O11-06 | Citada |
| DEC-099 | T07, M01, M05 | — | RF-PER-175, RF-CRM-261 | PRO-O2-07, PRO-O2-11, PRO-O2-18, PRO-O4-03, PRO-O4-09, PRO-O7-11, PRO-O9-01, PRO-O11-06 | Citada |
| DEC-100 | T05, T08 | — | RNF-NFR-260 | PRO-O1-06, PRO-O1-15 | Citada |
| DEC-101 | M14, M07 | — | RF-COB-195 | PRO-O5-07, PRO-O5-09 | Citada |
| DEC-102 | M06, M01 | — | — | PRO-O2-05, PRO-O4-04 | Citada |
| DEC-103 | T07, T08 | — | — | PRO-O1-19, PRO-O7-11, PRO-O11-06 | Citada |
| DEC-104 | M01, M04, M05, M07, M08, T04, T06, T07, T09 | T04 | — | PRO-O2-06, PRO-O2-15, PRO-O4-10, PRO-O6-03, PRO-O11-06 | Falta la cita en T04 (aplica la corrección con DEC-098) |
| DEC-105 | M04 | — | — | PRO-O4-06, PRO-O4-07, PRO-O7-11 | Citada |
| DEC-106 | M05, M07 | — | — | PRO-O4-11, PRO-O4-12, PRO-O5-02, PRO-O5-05 | Citada |
| DEC-107 | M05, M06, M07 | — | — | PRO-O0-12, PRO-O4-03, PRO-O4-10, PRO-O4-12, PRO-O4-15, PRO-O5-02, PRO-O5-04, PRO-O5-05, PRO-O6-02, PRO-O7-07, PRO-O8-09 | Citada; reemplaza DEC-035 en el comprobante rechazado (5.1) |
| DEC-108 | 00 | — | — | — | Solo en el maestro (§2 y §3.1); T05 y T11 la mencionan |

Las menciones por anexo están en la matriz 5.1.

### 22.4 Cifras

| Sección | Valor vigente | Valor anterior (reemplazado) |
|---|---|---|
| Encabezado, 15.1 | 4.213 RF y 293 RNF; 4.506 RF y RNF con un prompt; plan v1.2 | 4.204 RF y 292 RNF; 4.496; plan v1.1 |
| 15.2 | O1 459 RF y 73 RNF; O2 617; O4 425; O5 470; O8 465 | O1 458 y 72; O2 614; O4 424; O5 469; O8 462 |
| 15.3 | T08 259 RNF; T10 104; M01 175; M02 117; M06 169; M07 195; M09 194; M15 163; M17 109 (7 prompts) | T08 258; T10 103; M01 173; M02 116; M06 168; M07 194; M09 193; M15 162; M17 108 (6 prompts) |
| 15.7 | PRO-O1-15 20 RF y 2 RNF; PRO-O1-17 38; PRO-O2-07 33; PRO-O2-11 36; PRO-O4-07 28; PRO-O5-07 58; PRO-O8-04 31; PRO-O8-10 31; extensiones nuevas en PRO-O5-11, PRO-O8-04, PRO-O10-01 y PRO-O11-01 | 1 RNF; 37; 31; 35; 27; 57; 29; 30 |
| 5.1 | Filas hasta DEC-088 más 16 filas nuevas (DEC-093 a DEC-108); DEC-035 marcada como reemplazada en un punto por DEC-107 | Filas hasta DEC-088 |
| 18 | 86 PA (se agregan PA-FIS-23 a PA-FIS-26) | 82 |
