# GoodApps Cooperativas — Índice y cobertura de la ampliación de secuencias y estados

**Entregable de análisis y diseño — Artefactos 7.3 (diagramas de secuencia) y 7.4 (diagramas de estados), índice de la ampliación**

| Campo | Valor |
|---|---|
| Documento | `06a-indice-cobertura-secuencias-estados.md` |
| Documento base | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (versión 1.1; se conserva íntegro) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T05 §7 (catálogo de colecciones), §7 y §8 de los anexos M01 a M19 y T01 a T11, T11 §12.2 y §12.3 (eventos), §11 y §12 de los anexos (servicios y eventos consumidos), T06 §12.3 a §12.18 (fichas FI-INT) |
| Generación | Script `_trabajo/gen06_build.py`; verificación con `_trabajo/gen06_check.py` |

## 1. Propósito

Este índice organiza la ampliación del entregable 06 a cobertura completa: un diagrama de estados por cada colección con campo de estado o ciclo de vida, un diagrama de secuencia por flujo de negocio hasta cubrir todos los eventos con consumidor en otro módulo, los servicios internos síncronos y todas las fichas de integración FI-INT. El documento base conserva los 10 diagramas de secuencia curados (A1 a A10) y los 12 de estados (B1 a B12); las partes nuevas no los reemplazan y los citan cuando coinciden.

## 2. Partes del entregable

| Parte | Archivo | Contenido | Líneas |
|---|---|---|---|
| Base | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) | Secuencias curadas A1 a A10, estados curados B1 a B12, puntos a confirmar C-01 a C-26 | 1543 |
| B | [`06b-estados-m01-m03.md`](06b-estados-m01-m03.md) | Estados de M01, M02, M03 | 1373 |
| C | [`06c-estados-m03-m05.md`](06c-estados-m03-m05.md) | Estados de M03, M04, M05 | 1361 |
| D | [`06d-estados-m05-m07.md`](06d-estados-m05-m07.md) | Estados de M05, M06, M07 | 1366 |
| E | [`06e-estados-m07-m08.md`](06e-estados-m07-m08.md) | Estados de M07, M08 | 1370 |
| F | [`06f-estados-m09-m10.md`](06f-estados-m09-m10.md) | Estados de M09, M10 | 1379 |
| G | [`06g-estados-m10-m13.md`](06g-estados-m10-m13.md) | Estados de M10, M11, M12, M13 | 1357 |
| H | [`06h-estados-m13-m15.md`](06h-estados-m13-m15.md) | Estados de M13, M14, M15 | 1371 |
| I | [`06i-estados-m15-m16.md`](06i-estados-m15-m16.md) | Estados de M15, M16 | 1252 |
| J | [`06j-estados-m17-m18.md`](06j-estados-m17-m18.md) | Estados de M17, M18 | 1364 |
| K | [`06k-estados-m19-t02.md`](06k-estados-m19-t02.md) | Estados de M19, T01, T02 | 1360 |
| L | [`06l-estados-t02-t06.md`](06l-estados-t02-t06.md) | Estados de T02, T03, T04, T06 | 1371 |
| M | [`06m-estados-t06-t09.md`](06m-estados-t06-t09.md) | Estados de T06, T07, T08, T09 | 1350 |
| N | [`06n-estados-t09-t11.md`](06n-estados-t09-t11.md) | Estados de T09, T10, T11 | 1370 |
| O | [`06o-estados-t11.md`](06o-estados-t11.md) | Estados de T11 | 639 |
| P | [`06p-secuencias-eventos-m01-m03.md`](06p-secuencias-eventos-m01-m03.md) | Secuencias por eventos de M01, M02, M03 | 1325 |
| Q | [`06q-secuencias-eventos-m04-m07.md`](06q-secuencias-eventos-m04-m07.md) | Secuencias por eventos de M04, M05, M06, M07 | 1358 |
| R | [`06r-secuencias-eventos-m08-m10.md`](06r-secuencias-eventos-m08-m10.md) | Secuencias por eventos de M08, M09, M10 | 1245 |
| S | [`06s-secuencias-eventos-m11-m14.md`](06s-secuencias-eventos-m11-m14.md) | Secuencias por eventos de M11, M12, M13, M14 | 1088 |
| T | [`06t-secuencias-eventos-m15-m18.md`](06t-secuencias-eventos-m15-m18.md) | Secuencias por eventos de M15, M16, M17, M18 | 1281 |
| U | [`06u-secuencias-eventos-m19-t04.md`](06u-secuencias-eventos-m19-t04.md) | Secuencias por eventos de M19, T01, T02, T03, T04 | 1186 |
| V | [`06v-secuencias-eventos-t06-t10.md`](06v-secuencias-eventos-t06-t10.md) | Secuencias por eventos de T06, T07, T08, T09, T10 | 1292 |
| W | [`06w-secuencias-eventos-t11.md`](06w-secuencias-eventos-t11.md) | Secuencias por eventos de T11 | 1255 |
| X | [`06x-secuencias-servicios.md`](06x-secuencias-servicios.md) | Servicios internos síncronos (53 servicios) | 445 |
| Y | [`06y-secuencias-integraciones-fi-int.md`](06y-secuencias-integraciones-fi-int.md) | Integraciones externas FI-INT (FI-INT-01 a FI-INT-101) | 1319 |
| Z | [`06z-secuencias-integraciones-fi-int-2.md`](06z-secuencias-integraciones-fi-int-2.md) | Integraciones externas FI-INT (FI-INT-102 a FI-INT-115) | 200 |

## 3. Cómo se contó cada universo

- **Entidades con estado:** colecciones a crear del catálogo de T05 §7 (estado `C`, `R` o `N`; se descartan las absorbidas `A→`), 1051 de 1108 filas, cuyo dueño es el anexo y que tienen en su §7 un campo de estado o ciclo de vida (`status`, `state`, `stage`, `lifecycleStatus`, `*Status`, `*State`; se descartan fechas, motivos e historiales) o una máquina en su §8. En T08 el modelo de datos y los estados están en §15.1 (con las tablas de campos de §15.1.1) y §15.2, porque su §7 y §8 no son de modelo de datos. Resultado: 631 colecciones.
- **Eventos con consumidor externo:** catálogo de T11 §12.2 y §12.3 (668 EVT), con los tipos canónicos de §12.3; los nombres de §12.4 y las notas "(alias …)" son alias que resuelven al EVT canónico y no se cuentan como eventos aparte. Se descartan los reemplazados y los que no tienen consumidor distinto del productor; los consumidores genéricos ("módulo dueño", "todos") cuentan como externos. Resultado: 653 eventos.
- **Servicios internos síncronos:** llamadas `<mod>.service(s).<nombre>` y `<mod>.<nombre>(` declaradas en el §11 de los anexos (se descartan los nombres que son tipos de evento). Resultado: 53 servicios.
- **Integraciones externas:** fichas FI-INT de T06 §12.3 a §12.18. Resultado: 115 fichas.

## 4. Tabla de cobertura

| Universo | Cómo se contó | Total | Incluidos | Excluidos con motivo | Incluido o justificado |
|---|---|---|---|---|---|
| Entidades con estado diagramadas | Sección 3, primer punto | 631 | 615 | 16 (sección 5.1) | 100 % |
| Eventos con consumidor externo cubiertos por alguna secuencia | Sección 3, segundo punto | 653 | 653 | 0 (los 15 EVT restantes del catálogo quedan fuera del universo, sección 5.2) | 100 % |
| Fichas FI-INT cubiertas | Sección 3, cuarto punto | 115 | 115 | 0 | 100 % |
| Servicios internos síncronos | Sección 3, tercer punto | 53 | 53 | 0 | 100 % |

### 4.1 Entidades por clasificación

| Clasificación | Colecciones | Qué significa |
|---|---|---|
| Diagramada (transiciones del §8) | 539 | Diagrama y tabla con las transiciones del §8 del anexo dueño |
| Diagramada (patrón general) | 57 | Patrón de T05 §7.1.5 o T04 §8.3 aplicado a los valores del §7 |
| Excluida | 16 | Campo de estado sin valores ni máquina en el anexo (inconsistencia INC-06-01) o historial de otra colección |
| Diagramada (máquina compartida con `interestPolicies`) | 9 | El §8 define una sola máquina para un grupo de colecciones |
| Diagramada (solo estados) | 7 | El §7 enumera valores y el §8 no define transiciones; diagrama de estados sin flechas (inconsistencia INC-06-02) |
| Diagramada (máquina compartida con `payrollConfigVersions`) | 1 | El §8 define una sola máquina para un grupo de colecciones |
| Diagramada (máquina compartida con `streets`) | 1 | El §8 define una sola máquina para un grupo de colecciones |
| Diagramada (registro inmutable) | 1 | El §8 declara que el registro se escribe con su estado final y no cambia; se dibuja el alta en cada estado |
| **Total** | **631** | |

Además se diagraman 18 complementos fuera del universo (sección 6): máquinas del §8 sobre colecciones de otro dueño o absorbidas y estados sin colección en T05.

Transiciones dibujadas: 3395; con evento citado en el anexo: 226; con evento inferido por nombre: 320; sin evento: 2849.

### 4.2 Entidades por módulo

| Módulo | Universo | Transiciones del §8 | Compartida | Patrón general | Solo estados o registro inmutable | Excluidas | Parte |
|---|---|---|---|---|---|---|---|
| M01 PER | 12 | 12 | 0 | 0 | 0 | 0 | [06b](06b-estados-m01-m03.md) |
| M02 CAT | 18 | 12 | 0 | 5 | 0 | 1 | [06b](06b-estados-m01-m03.md) |
| M03 MED | 28 | 19 | 0 | 9 | 0 | 0 | [06b](06b-estados-m01-m03.md), [06c](06c-estados-m03-m05.md) |
| M04 TAR | 20 | 11 | 0 | 9 | 0 | 0 | [06c](06c-estados-m03-m05.md) |
| M05 FAC | 24 | 20 | 0 | 4 | 0 | 0 | [06c](06c-estados-m03-m05.md), [06d](06d-estados-m05-m07.md) |
| M06 FIS | 25 | 23 | 0 | 1 | 0 | 1 | [06d](06d-estados-m05-m07.md) |
| M07 COB | 37 | 37 | 0 | 0 | 0 | 0 | [06d](06d-estados-m05-m07.md), [06e](06e-estados-m07-m08.md) |
| M08 MOR | 32 | 22 | 9 | 0 | 1 | 0 | [06e](06e-estados-m07-m08.md) |
| M09 CRM | 16 | 15 | 0 | 0 | 1 | 0 | [06f](06f-estados-m09-m10.md) |
| M10 TEC | 32 | 32 | 0 | 0 | 0 | 0 | [06f](06f-estados-m09-m10.md), [06g](06g-estados-m10-m13.md) |
| M11 VEN | 7 | 7 | 0 | 0 | 0 | 0 | [06g](06g-estados-m10-m13.md) |
| M12 CMP | 13 | 12 | 0 | 1 | 0 | 0 | [06g](06g-estados-m10-m13.md) |
| M13 STK | 19 | 18 | 0 | 0 | 0 | 1 | [06g](06g-estados-m10-m13.md), [06h](06h-estados-m13-m15.md) |
| M14 TES | 27 | 26 | 0 | 0 | 0 | 1 | [06h](06h-estados-m13-m15.md) |
| M15 CON | 23 | 17 | 0 | 6 | 0 | 0 | [06h](06h-estados-m13-m15.md), [06i](06i-estados-m15-m16.md) |
| M16 SUE | 39 | 28 | 1 | 10 | 0 | 0 | [06i](06i-estados-m15-m16.md) |
| M17 INS | 21 | 20 | 0 | 0 | 0 | 1 | [06j](06j-estados-m17-m18.md) |
| M18 SOC | 30 | 29 | 0 | 1 | 0 | 0 | [06j](06j-estados-m17-m18.md) |
| M19 POR | 12 | 12 | 0 | 0 | 0 | 0 | [06k](06k-estados-m19-t02.md) |
| T01 PLA | 23 | 23 | 0 | 0 | 0 | 0 | [06k](06k-estados-m19-t02.md) |
| T02 IAM | 21 | 19 | 0 | 2 | 0 | 0 | [06k](06k-estados-m19-t02.md), [06l](06l-estados-t02-t06.md) |
| T03 UXD | 6 | 5 | 0 | 0 | 0 | 1 | [06l](06l-estados-t02-t06.md) |
| T04 CFG | 21 | 12 | 1 | 2 | 0 | 6 | [06l](06l-estados-t02-t06.md) |
| T06 INT | 15 | 13 | 0 | 1 | 1 | 0 | [06l](06l-estados-t02-t06.md), [06m](06m-estados-t06-t09.md) |
| T07 MIG | 15 | 14 | 0 | 0 | 0 | 1 | [06m](06m-estados-t06-t09.md) |
| T08 NFR | 11 | 11 | 0 | 0 | 0 | 0 | [06m](06m-estados-t06-t09.md) |
| T09 COM | 29 | 29 | 0 | 0 | 0 | 0 | [06m](06m-estados-t06-t09.md), [06n](06n-estados-t09-t11.md) |
| T10 BIA | 21 | 16 | 0 | 3 | 0 | 2 | [06n](06n-estados-t09-t11.md) |
| T11 WFL | 34 | 25 | 0 | 3 | 5 | 1 | [06n](06n-estados-t09-t11.md), [06o](06o-estados-t11.md) |

### 4.3 Eventos y flujos por módulo productor

| Productor | EVT en T11 | Con consumidor externo | Cubiertos | Flujos (SEC) | Parte |
|---|---|---|---|---|---|
| M01 PER | 26 | 25 | 25 | 4 | [06p](06p-secuencias-eventos-m01-m03.md) |
| M02 CAT | 28 | 27 | 27 | 4 | [06p](06p-secuencias-eventos-m01-m03.md) |
| M03 MED | 30 | 30 | 30 | 5 | [06p](06p-secuencias-eventos-m01-m03.md) |
| M04 TAR | 21 | 21 | 21 | 4 | [06q](06q-secuencias-eventos-m04-m07.md) |
| M05 FAC | 21 | 21 | 21 | 3 | [06q](06q-secuencias-eventos-m04-m07.md) |
| M06 FIS | 25 | 25 | 25 | 4 | [06q](06q-secuencias-eventos-m04-m07.md) |
| M07 COB | 30 | 30 | 30 | 5 | [06q](06q-secuencias-eventos-m04-m07.md) |
| M08 MOR | 21 | 21 | 21 | 4 | [06r](06r-secuencias-eventos-m08-m10.md) |
| M09 CRM | 25 | 25 | 25 | 4 | [06r](06r-secuencias-eventos-m08-m10.md) |
| M10 TEC | 38 | 38 | 38 | 6 | [06r](06r-secuencias-eventos-m08-m10.md) |
| M11 VEN | 15 | 15 | 15 | 4 | [06s](06s-secuencias-eventos-m11-m14.md) |
| M12 CMP | 17 | 17 | 17 | 3 | [06s](06s-secuencias-eventos-m11-m14.md) |
| M13 STK | 24 | 24 | 24 | 4 | [06s](06s-secuencias-eventos-m11-m14.md) |
| M14 TES | 25 | 24 | 24 | 3 | [06s](06s-secuencias-eventos-m11-m14.md) |
| M15 CON | 18 | 17 | 17 | 4 | [06t](06t-secuencias-eventos-m15-m18.md) |
| M16 SUE | 28 | 28 | 28 | 5 | [06t](06t-secuencias-eventos-m15-m18.md) |
| M17 INS | 21 | 21 | 21 | 3 | [06t](06t-secuencias-eventos-m15-m18.md) |
| M18 SOC | 17 | 17 | 17 | 4 | [06t](06t-secuencias-eventos-m15-m18.md) |
| M19 POR | 16 | 16 | 16 | 4 | [06u](06u-secuencias-eventos-m19-t04.md) |
| T01 PLA | 22 | 20 | 20 | 3 | [06u](06u-secuencias-eventos-m19-t04.md) |
| T02 IAM | 16 | 16 | 16 | 2 | [06u](06u-secuencias-eventos-m19-t04.md) |
| T03 UXD | 8 | 7 | 7 | 2 | [06u](06u-secuencias-eventos-m19-t04.md) |
| T04 CFG | 20 | 20 | 20 | 3 | [06u](06u-secuencias-eventos-m19-t04.md) |
| T06 INT | 24 | 24 | 24 | 3 | [06v](06v-secuencias-eventos-t06-t10.md) |
| T07 MIG | 9 | 9 | 9 | 2 | [06v](06v-secuencias-eventos-t06-t10.md) |
| T08 NFR | 17 | 16 | 16 | 2 | [06v](06v-secuencias-eventos-t06-t10.md) |
| T09 COM | 40 | 34 | 34 | 8 | [06v](06v-secuencias-eventos-t06-t10.md) |
| T10 BIA | 18 | 17 | 17 | 3 | [06v](06v-secuencias-eventos-t06-t10.md) |
| T11 WFL | 48 | 48 | 48 | 10 | [06w](06w-secuencias-eventos-t11.md) |

Total: 115 flujos de eventos, 16 diagramas de servicios internos y 24 diagramas de integraciones. Los 55 EVT que ya aparecen en las secuencias curadas A1 a A10 del documento base también están en un flujo de las partes nuevas (columna "También en" de la cobertura de cada parte).

## 5. Exclusiones con motivo

### 5.1 Colecciones con campo de estado sin diagrama

| Módulo | Colección | Motivo |
|---|---|---|
| M02 | COL-CAT-14 `serviceStatuses` | El §7 declara `canonicalStatus` sin valores y el §8 no define su máquina de estados. |
| M06 | COL-FIS-04 `fiscalProfiles` | El §7 declara `mipymeStatus` sin valores y el §8 no define su máquina de estados. |
| M13 | COL-STK-14 `serialUnitEvents` | El §7 declara `fromStatus`, `toStatus` sin valores y el §8 no define su máquina de estados. |
| M14 | COL-TES-23 `checkEvents` | El §7 declara `fromState`, `toState` sin valores y el §8 no define su máquina de estados. |
| M17 | COL-INS-02 `membershipEvents` | Campos `fromStatus`/`toStatus` de historia: registran transiciones de `memberships` (diagramada); no es un ciclo propio. |
| T03 | COL-UXD-11 `pwaNavConfigs` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-10 `localities` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-15 `neighborhoods` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-16 `zones` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-18 `geocodeRequests` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-20 `holidays` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T04 | COL-CFG-21 `economicIndexSeries` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T07 | COL-MIG-16 `coexistenceSyncs` | El §7 declara `lastStatus` sin valores y el §8 no define su máquina de estados. |
| T10 | COL-BIA-22 `apiUsageLogs` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T10 | COL-BIA-23 `apiUsageDaily` | El §7 declara `status` sin valores y el §8 no define su máquina de estados. |
| T11 | COL-WFL-08 `operationTypes` | El §7 declara `cat.contract.forceStatus` sin valores y el §8 no define su máquina de estados. |

### 5.2 Eventos del catálogo fuera del universo

| Evento | Productor | Motivo |
|---|---|---|
| EVT-PER-19 `per.adherent.added` | M01 | Reemplazado en la especificación; no se publica |
| EVT-CAT-23 `cat.contract.memberAdded` | M02 | Reemplazado en la especificación; no se publica |
| EVT-TES-04 `tes.statement.imported` | M14 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-CON-11 `con.config.published` | M15 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-PLA-13 `pla.backup.completed` | T01 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-PLA-21 `pla.branch.created` | T01 | Reemplazado en la especificación; no se publica |
| EVT-UXD-08 `uxd.catalog.updated` | T03 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-NFR-11 `nfr.key.rotated` | T08 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-03 `com.post.decided` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-06 `com.comment.replied` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-08 `com.mention.created` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-09 `com.report.created` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-10 `com.report.resolved` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-COM-12 `com.sanction.appealDecided` | T09 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |
| EVT-BIA-08 `bia.indicator.certified` | T10 | Sin consumidor en otro módulo (solo el productor o sin consumidores declarados) |

## 6. Complementos fuera del universo

| ID propio | Módulo | Máquina | Tipo | Fuente | Situación en T05 | Parte |
|---|---|---|---|---|---|---|
| EST-PER-13 | M01 | `adherents.status` | Colección de otro dueño o absorbida | M01 §8.7 | En T05: COL-PER-11 A→COL-SOC-01 / COL-SOC-02 (dueño M01) | [06b](06b-estados-m01-m03.md) |
| EST-PER-14 | M01 | `dataSubjectRequests.status` | Colección de otro dueño o absorbida | M01 §8.12 | En T05: COL-NFR-05 C (dueño T08); COL-PER-20 A→COL-NFR-05 (dueño M01) | [06b](06b-estados-m01-m03.md) |
| EST-PER-15 | M01 | `personUserLinks.status` | Colección de otro dueño o absorbida | M01 §8.13 | En T05: COL-PER-21 A→COL-IAM-04 (dueño M01) | [06b](06b-estados-m01-m03.md) |
| EST-CAT-18 | M02 | `generationAgreements.status` | Colección de otro dueño o absorbida | M02 §8.3 | En T05: COL-CAT-24 A→COL-MED-35 (dueño M02) | [06b](06b-estados-m01-m03.md) |
| EST-FAC-25 | M05 | `invoiceBlockHistory.status` | Colección de otro dueño o absorbida | M05 §8.7 | En T05: COL-FAC-16 A→COL-MOR-12 (dueño M05) | [06d](06d-estados-m05-m07.md) |
| EST-FIS-25 | M06 | `pointsOfSale.status` | Colección de otro dueño o absorbida | M06 §8.11 | En T05: COL-FAC-20 A→COL-FIS-09 (dueño M05); COL-FIS-09 C (antes `R`) (dueño M06) | [06d](06d-estados-m05-m07.md) |
| EST-MOR-33 | M08 | `debtCollectionAgencies.status` | Colección de otro dueño o absorbida | M08 §8.15 | En T05: COL-MOR-34 C (antes `R`) (dueño M08) | [06e](06e-estados-m07-m08.md) |
| EST-MOR-34 | M08 | `financingInstitutionPlans.status` | Colección de otro dueño o absorbida | M08 §8.15 | En T05: COL-MOR-27 C (antes `R`) (dueño M08) | [06e](06e-estados-m07-m08.md) |
| EST-STK-19 | M13 | `contractEquipmentAssignments.status` | Colección de otro dueño o absorbida | M13 §8.4 | En T05: COL-CAT-20 C (dueño M02) | [06h](06h-estados-m13-m15.md) |
| EST-INS-21 | M17 | `associateMemberships.status` | Colección de otro dueño o absorbida | M17 §8.1 | En T05: COL-INS-01 C (antes `R`) (dueño M17) | [06j](06j-estados-m17-m18.md) |
| EST-PLA-24 | T01 | `supportAccessGrants.status` | Colección de otro dueño o absorbida | T01 §8.6 | En T05: COL-PLA-12 A→COL-IAM-20 (dueño T01); COL-IAM-20 C (dueño T02) | [06k](06k-estados-m19-t02.md) |
| EST-UXD-06 | T03 | Cola offline de la PWA (presentación, sin colección) | Estado sin colección | T03 §8.5 | Sin colección en T05 | [06l](06l-estados-t02-t06.md) |
| EST-UXD-07 | T03 | Flags de UI `uiFeatureFlags` (sin colección en T05) | Estado sin colección | T03 §8.6 | Sin colección en T05 | [06l](06l-estados-t02-t06.md) |
| EST-CFG-16 | T04 | Subdocumento compartido `geoReference` (embebido en M01, M09, M10) | Estado sin colección | T04 §8.5 | Sin colección en T05 | [06l](06l-estados-t02-t06.md) |
| EST-INT-16 | T06 | Circuit breaker por conexión (Redis, sin colección) | Estado sin colección | T06 §8.11 | Sin colección en T05 | [06m](06m-estados-t06-t09.md) |
| EST-NFR-12 | T08 | `alerts.status` | Colección de otro dueño o absorbida | T08 §15.2 | En T05: COL-PLA-16 C (dueño T01) | [06m](06m-estados-t06-t09.md) |
| EST-BIA-20 | T10 | `apiClients.status` | Colección de otro dueño o absorbida | T10 §8.6 | En T05: COL-IAM-22 C (dueño T02); COL-BIA-20 A→COL-IAM-22 (dueño T10) | [06n](06n-estados-t09-t11.md) |
| EST-BIA-21 | T10 | `apiCredentials.status` | Colección de otro dueño o absorbida | T10 §8.7, T10 §8.12 | En T05: COL-IAM-23 C (dueño T02); COL-BIA-21 A→COL-IAM-23 (dueño T10) | [06n](06n-estados-t09-t11.md) |

## 7. Inconsistencias detectadas en la especificación

La especificación no se modificó. Las inconsistencias se listan para su resolución por los responsables de cada anexo; complementan los puntos C-01 a C-26 del documento base.

| ID | Tema | Detalle | Dónde se ve |
|---|---|---|---|
| INC-06-01 | Campo de estado sin valores | 15 colecciones declaran un campo de estado en el §7 sin enumerar valores y su §8 no define la máquina (lista en la sección 5.1). | Sección 5.1 |
| INC-06-02 | Estados sin transiciones | 7 colecciones enumeran estados en el §7 pero el §8 no define transiciones, disparadores ni eventos; se dibujan solo los estados. | Clasificación "solo estados" en la cobertura de cada parte |
| INC-06-03 | Diferencias entre §7 y §8 | 18 máquinas usan estados que no están entre los valores del §7, o el §7 declara valores a los que ninguna transición del §8 llega ni de los que sale (tabla 7.1). | Tabla 7.1 |
| INC-06-04 | Máquinas sobre colecciones de otro dueño | 14 máquinas del §8 describen colecciones que T05 asigna a otro dueño, absorbe en otra colección o no cataloga. | Sección 6 |
| INC-06-05 | Estados sin colección | 4 máquinas describen estados que no se persisten en una colección de T05 (circuito en Redis, cola offline, `uiFeatureFlags` sin colección, subdocumento `geoReference`). | Sección 6 |
| INC-06-06 | Consumidores no listados en T11 | 4 efectos declarados en el §12 "Eventos consumidos" de un anexo corresponden a un EVT que T11 §12.3 no asigna a ese consumidor o que no existe en el catálogo (tabla 7.2). | Tabla 7.2 |
| INC-06-07 | Consumidores genéricos | 1 eventos tienen consumidores genéricos ("módulo dueño del tipo", "todos") en lugar de módulos concretos; la secuencia los dibuja como GEN. | Participante GEN en las secuencias |
| INC-06-08 | Estado inicial no explícito | 25 máquinas no indican el estado de alta; el diagrama toma el primer valor del §7 o de la máquina. | Flecha "alta (estado inicial no explícito)" |
| INC-06-09 | Servicios sin consumidor declarado | 12 servicios internos del §11 no dicen qué módulo los invoca. | Participante "Consumidores no declarados" en la parte de servicios |
| INC-06-10 | Subestados en paralelo | M05 §8.2 define `authorizationPhase` y `distributionPhase` en la misma sección que `billingRuns.status`; el §7 no los declara como campos de estado. Se dibujan como máquina aparte. | EST-FAC de `billingRuns` |
| INC-06-11 | Tipos de evento fuera de la convención | 0 tipos de 0 EVT de T11 §12.3 no siguen `<mod>.<agregado>.<hecho>` en camelCase: tienen cuatro segmentos o guiones (tabla 7.3). | Tabla 7.3 |
| INC-06-12 | T05 §8.1 frente al anexo dueño | 2 de las colecciones de las 42 filas de T05 §8.1 (copia de referencia de valores de `status`) no coinciden con el §7 y el §8 del anexo dueño, que prevalece (tabla 7.4). | Tabla 7.4 |

### 7.1 Diferencias de estados entre el §7 y el §8

| Módulo | Colección | Campo | Estados del §8 que el §7 no declara | Valores del §7 que ninguna transición del §8 alcanza | Fuente |
|---|---|---|---|---|---|
| M07 | COL-COB-27 `agencySettlements` | `status` | `applied`, `creditCreated`, `ignored`, `pending`, `rejectedDebit`, `unidentified` | — | M07 §8.5 |
| M07 | COL-COB-31 `directDebitBatches` | `status` | `accepted`, `rejected`, `retryScheduled` | `closed`, `settled` | M07 §8.8, M07 §8.19 |
| M10 | COL-TEC-68 `mobileUsageImports` | `status` | — | `importedBy` | M10 §8.16 |
| T01 | COL-PLA-32 `schemaMigrations` | `status` | — | `expand`, `phase` | T01 §8.12 |
| T02 | COL-IAM-04 `memberships` | `status` | — | `blocked`, `linked`, `registered` | T02 §8.2, T02 §8.11 |
| T02 | COL-IAM-13 `sessions` | `status` | `absoluteExpiresAt`, `expiresAt` | — | T02 §8.4, T02 §8.11 |
| T04 | COL-CFG-12 `streets` | `status` | `approved`, `proposed`, `rejected` | `inactive` | T04 §8.4, T04 §8.11 |
| T06 | COL-INT-03 `integrationSecrets` | `status` | — | `disabled`, `rotating` | T06 §8.2, T06 §8.13 |
| T07 | COL-MIG-02 `legacySnapshots` | `status` | `expired`, `extracting`, `failed`, `ready` | `cancelled`, `completed`, `draft`, `executing`, `go`, `planned`, `rolledBack` | T07 §8.7 |
| T07 | COL-MIG-09 `legacyIdMap` | `status` | `active`, `superseded` | — | T07 §8.7 |
| T08 | COL-NFR-02 `processingActivities` | `status` | — | `publicado`, `reemplazado` | T08 §15.2 |
| T08 | COL-NFR-03 `privacyNotices` | `status` | — | `otorgado`, `revocado`, `vencido` | T08 §15.2 |
| T08 | COL-NFR-10 `securityIncidents` | `status` | — | `cancelado`, `enCurso`, `programado`, `resuelto` | T08 §15.2 |
| T09 | COL-COM-19 `newsletterRecipients` | `deliveryStatus` | — | `accepted`, `bounced`, `cancelled`, `clicked`, `complained`, `delivered`, `expired`, `failed`, `opened`, `queued`, `read`, `sent_to_provide`… | T09 §8.0, T09 §8.6.1 |
| T10 | COL-BIA-11 `indicatorDefinitions` | `status` | — | `active`, `paused` | T10 §8.5, T10 §8.12 |
| T10 | COL-BIA-15 `kpiAlertRules` | `status` | — | `acknowledged`, `muted`, `open`, `resolved` | T10 §8.11 |
| T11 | COL-WFL-32 `agendaFeeds` | `status` | `expired` | — | T11 §8.11.10 |
| T11 | COL-WFL-45 `numberingSequences` | `status` | `assigned`, `voided` | — | T11 §8.11.12 |

### 7.2 Efectos declarados por consumidores que T11 no lista

| Consumidor | Evento | Situación | Efecto declarado |
|---|---|---|---|
| M10 | EVT-COB-04 `cob.payment.confirmed` | T11 no lista a M10 como consumidor | Reevaluar bloqueo por pagos pendientes (PRM-TEC-075). |
| T10 | EVT-COB-04 `cob.payment.confirmed` | T11 no lista a T10 como consumidor | Proyecciones `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_ledgerEntry` (suscripción directa a los canónicos; ante… |
| T10 | EVT-COB-05 `cob.receipt.voided` | T11 no lista a T10 como consumidor | Proyecciones `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_ledgerEntry` (suscripción directa a los canónicos; ante… |
| T10 | EVT-COB-06 `cob.allocation.reversed` | T11 no lista a T10 como consumidor | Proyecciones `bi_fact_payment`, `bi_fact_allocation` y `bi_fact_ledgerEntry` (suscripción directa a los canónicos; ante… |

### 7.3 Tipos de evento fuera de la convención

| Evento | Productor | Tipo en T11 |
|---|---|---|

### 7.4 Diferencias entre T05 §8.1 y el anexo dueño

| Dueño | Colección | Fuente en T05 §8.1 | Valores de T05 §8.1 que el anexo no tiene | Estados del anexo que T05 §8.1 no lista |
|---|---|---|---|---|
| M08 | `debtCollectionAgencies` | No está en el universo de entidades con estado del anexo dueño | `active`, `suspended`, `inactive` | — |
| M12 | `matchExceptions` | M12 §8.7 (PA-CMP-16) | `decision` | — |

## 8. Lo no cubierto

- Las 16 colecciones excluidas de la sección 5.1 no tienen diagrama porque el anexo no da valores ni transiciones; se resuelven con INC-06-01.
- Los 15 EVT de la sección 5.2 no tienen secuencia porque están reemplazados o no tienen consumidor en otro módulo; su emisión queda documentada en el diagrama de estados del productor cuando el §8 los cita.
- Las transiciones de las colecciones "solo estados" (INC-06-02) y los eventos "inferidos por nombre" deben confirmarse con el responsable de cada anexo.

## 9. Generación y verificación

- `_trabajo/gen06_build.py` genera todas las partes y este índice a partir de la especificación (solo lectura).
- `_trabajo/gen06_lib.py` y `_trabajo/gen06_states.py` son los módulos de extracción (lectura de tablas, catálogo, eventos, servicios y fichas; parser de máquinas de estados del §8), en código fuente. Las versiones compiladas anteriores (`.pyc`) quedan solo como respaldo en `_trabajo/gen06_respaldo/`; `_trabajo/gen06_equiv.py` comprueba que el código fuente da los mismos resultados que esas versiones compiladas.
- `_trabajo/gen06_check.py` verifica cada parte: UTF-8 sin BOM, menos de 1.500 líneas, encabezados únicos, sintaxis básica de los bloques Mermaid y tamaño de los diagramas (menos de 45 nodos).
- `_trabajo/gen06_data.json` guarda los datos de cobertura usados en este índice.
