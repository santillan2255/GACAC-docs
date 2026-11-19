# GoodApps Cooperativas — Casos de prueba de aceptación (artefacto 9.2)

| Campo | Valor |
|---|---|
| Versión | 1.0 (05-11-2026) |
| Estado | Borrador para revisión |
| Deriva de | Anexos M01–M19 y T01–T12 (`docs/especificacion/anexos/`), plan de olas `03` v1.1 y `07-estrategia-pruebas.md` (niveles, suites y nomenclatura) |
| Generación | `_trabajo/gen_casos_prueba.py` (regenerable); insumo de cobertura en `_trabajo/casos-prueba-cobertura.json` |
| Cooperativa piloto | Laguna Larga (`LAG`), DEC-088 (reemplaza a DEC-081) |

> **Norma stack en casos de prueba (C-10).** Cada CP verifica **comportamiento de negocio** citado en el anexo (Dado/Cuando/Entonces). Si el texto menciona Mongo, transacciones Mongoose, Redis/BullMQ o pantallas Vue, es **detalle de redacción del generador** (`gen_casos_prueba.py`); **no obliga** a implementar ese stack. En UAT y automatización GoodApps: API .NET, persistencia Azure SQL, UI React. Barrido masivo del wording se hace por ola o al regenerar desde anexos ya alineados; la auditoría está en `13-auditoria-impacto-entregables.md`.

## 1. Propósito y alcance

Este entregable convierte en casos de prueba de aceptación (CP) todo lo verificable de la especificación: el criterio de aceptación de cada requisito funcional (RF), cada escenario de prueba (ESC) y cada caso de uso (CU) citado en los anexos. Es el insumo de la aceptación de usuario por ola y de la trazabilidad requisito → prueba de `07-estrategia-pruebas.md` §13. No reemplaza a la especificación: ante cualquier diferencia prevalece el anexo de origen, citado en cada CP.

Total generado: **5.710 CP** (4.204 de RF, 814 de ESC, 161 de criterios de aceptación con ID propio, ninguno de escenarios numerados sin ID: los de M06 ya son `ESC-FIS-nn` y 531 de CU) en 32 archivos por anexo, más las suites de regresión por ola y la suite de la cooperativa piloto.

Además del universo pedido (ESC, criterios de RF y CU), se incluyeron los criterios de aceptación del §17 que usan otro prefijo (AC-PER (41), CA-DAT (12), CA-INT (15), CA-WFL (37), TST-IAM (56)), porque son el equivalente de los ESC en esos anexos (M01 tiene un solo ESC y T02, T05, T06 y T11 pocos). Los escenarios de M06 ya tienen ID `ESC-FIS-nn` y se cuentan como ESC (antes eran escenarios numerados sin ID).

## 2. Método

1. **Extracción por script.** `gen_casos_prueba.py` lee los anexos en modo solo lectura: las tablas de RF (columnas Requisito, Prioridad, Ola y Criterio de aceptación), las definiciones de ESC y CU (filas de tabla cuyo primer campo es el ID, párrafos que empiezan con el ID en negrita y encabezados con el ID) y las semillas del §18 de cada anexo.
2. **Un CP por RF**: el criterio de aceptación de la tabla de RF es el "Entonces"; el enunciado del RF es el "Cuando"; el "Dado" usa la semilla ficticia del §18 más afín al RF.
3. **Un CP por definición de ESC o CU en cada anexo**: si un mismo ID está definido en varios anexos (por ejemplo CU-11 en M07 y M14, o ESC-01 en M07 y T08), cada anexo aporta su CP con su resultado esperado, porque verifica un aspecto distinto. Las filas de trazabilidad (§21–§23) no generan CP si el ID tiene otra definición.
4. **Revisión manual** de la muestra de cada tipo de tabla (M04, M07, M08, M09, M10, M14, T03, T05, T08, T12) para ajustar la separación de Dado, Cuando y Entonces, las olas de T12 y los títulos. La redacción del "Cuando" de los CP de RF reproduce el enunciado del anexo (recortado con "…" si es largo); la del "Entonces", el criterio completo.
5. **Datos ficticios**: TEN-001 y TEN-002 (T08 §18) y las semillas de demostración de cada anexo (PER-001 Ana Pérez ficticia, FAC-DEMO-001, CAJ-01, etc.). No se usa ningún dato de la base relevada de LAG; los casos de migración de LAG corren sobre la copia seudonimizada (PA-MIG-15, RF-MIG-095).

## 3. Formato de un caso de prueba

| Elemento | Contenido |
|---|---|
| ID | `CP-XXX-nnnn`, con XXX = código del anexo (COB, TAR, NFR, SRV…). Rango 0001–0999: un CP por RF con el número del RF (RF-COB-191 → CP-COB-0191); 5001–5999: escenarios ESC; 6001–6999: criterios con ID propio (AC-PER, TST-IAM, CA-DAT, CA-INT, CA-WFL); 7001–7999: escenarios numerados sin ID (solo M06 §17); 8001–9999: casos de uso CU |
| Cubre | RF, RN, RNF, ESC y CU que verifica, más el anexo y la sección de origen; en los CP de RF, el prompt de `03` que lo implementa |
| Ola | CP de RF: la del prompt de `03` que implementa el RF (prevalece sobre la columna del anexo). CP de ESC o CU: la ola declarada en el escenario ("ola Ox"); si no, la última ola de los RF que cita; si no, la de la ficha (T12) o la ola dominante del anexo. ESC-01 a ESC-05 del AGR: O5, O4, O3, O5 y O4 (`07` §15), o posterior si sus RF lo exigen |
| Prioridad | Núcleo o Estándar. RF: la del anexo (Extensión se agrupa como Estándar). ESC, criterio o CU: Núcleo si cita un RF Núcleo, si es de permisos negativos, aislamiento o reintentos (sufijos P, T, R), si es un escenario AGR, del piloto Internet (ESC-SRV-INT), un criterio con ID propio (AC, TST, CA) o pertenece a T01, T02, T07 o T08 sin RF citados; si cita solo RF Estándar o Extensión, Estándar; si no cita RF, Núcleo para los CU numerados de BASE y Estándar para el resto |
| Tipo | funcional, regla, integración, migración o seguridad (sección 4) |
| Precondiciones | Ola desplegada en `staging` o `sandbox`, tenant TEN-001 (y TEN-002 en seguridad), semillas del anexo y capability del rol. En los CP de RF se declaran una vez por archivo |
| Datos de prueba | Semilla ficticia del §18 del anexo o datos del propio escenario |
| Dado / Cuando / Entonces | Contexto, acción y resultado esperado verificable. El "Entonces" es el resultado esperado del CP |

Ejemplo (de [`M07-COB-cuenta-corriente-cobranza.md`](20-casos-prueba/M07-COB-cuenta-corriente-cobranza.md)): **CP-COB-0001** cubre RF-COB-001 y lo implementa PRO-O5-02 (O5, Núcleo, integración). Dado TEN-001 con las obligaciones semilla de M07 §18 (FAC-DEMO-001 de ARS 13.000, entre otras); cuando se registra una obligación por cada servicio de cada comprobante emitido, consumiendo el evento de M05; entonces la suma de obligaciones de un comprobante es igual a su total y reprocesar el mismo evento no crea otra obligación (idempotencia por `eventId`).

## 4. Tipos de caso y nivel de prueba (alineado con `07-estrategia-pruebas.md` §4)

| Tipo | Criterio de clasificación (en este orden) | Nivel de `07` donde se automatiza | CP |
|---|---|---|---|
| migración | Anexo T07, escenarios de transición LAG (sufijo L), ESC-MIG o CU-MIG, o texto sobre ProCoop, migración, paralelo o corte | Pruebas de migración (§7) y aceptación de usuario de LAG (§15.2) | 214 |
| seguridad | Permisos negativos y aislamiento (sufijos P y T), T02, o texto con 401/403/404, capability, otro tenant, 2FA, cifrado, segregación | Suites transversales de aislamiento y permisos negativos (§4.3) y ASVS (§6.5) | 516 |
| integración | Reintentos (sufijo R), T06, o texto con webhook, conector, ARCA, SFTP, pasarela, entes, idempotencia, sincronización offline, outbox | Integración por módulo, contrato de conectores y de eventos, idempotencia e interrupción (§4.2, §4.3, §5.3, §5.5) | 479 |
| regla | Conciliación (sufijo C) o texto con cálculo, redondeo, prorrateo, imputación, interés, tarifa, impuesto, vencimiento, recargo, fórmula | Unitarias, propiedades y conjuntos dorados de regresión (§4.2, §5.1) | 1.242 |
| funcional | Resto | Integración por módulo, extremo a extremo y aceptación de usuario (§4.2) | 3.259 |

Prioridad: Núcleo 2.562 CP; Estándar 3.148 CP.

## 5. Partes por anexo

| Archivo | Anexo | CP de RF | CP de ESC y criterios | CP de CU | Total | Líneas |
|---|---|---|---|---|---|---|
| [`M01-PER-personas-titulares-cuentas.md`](20-casos-prueba/M01-PER-personas-titulares-cuentas.md) | M01 | 173 | 42 | 18 | 233 | 854 |
| [`M02-CAT-catalogo-servicios.md`](20-casos-prueba/M02-CAT-catalogo-servicios.md) | M02 | 116 | 5 | 23 | 144 | 449 |
| [`M03-MED-medicion-consumos.md`](20-casos-prueba/M03-MED-medicion-consumos.md) | M03 | 129 | 37 | 21 | 187 | 778 |
| [`M04-TAR-tarifas-motor-calculo.md`](20-casos-prueba/M04-TAR-tarifas-motor-calculo.md) | M04 | 122 | 39 | 15 | 176 | 699 |
| [`M05-FAC-facturacion.md`](20-casos-prueba/M05-FAC-facturacion.md) | M05 | 179 | 3 | 22 | 204 | 526 |
| [`M06-FIS-fiscal-impuestos.md`](20-casos-prueba/M06-FIS-fiscal-impuestos.md) | M06 | 168 | 53 | 20 | 241 | 987 |
| [`M07-COB-cuenta-corriente-cobranza.md`](20-casos-prueba/M07-COB-cuenta-corriente-cobranza.md) | M07 | 194 | 40 | 22 | 256 | 899 |
| [`M08-MOR-mora-financiacion.md`](20-casos-prueba/M08-MOR-mora-financiacion.md) | M08 | 224 | 68 | 13 | 305 | 1135 |
| [`M09-CRM-atencion.md`](20-casos-prueba/M09-CRM-atencion.md) | M09 | 193 | 30 | 25 | 248 | 796 |
| [`M10-TEC-tecnica-campo-redes.md`](20-casos-prueba/M10-TEC-tecnica-campo-redes.md) | M10 | 239 | 30 | 18 | 287 | 816 |
| [`M11-VEN-ventas-presupuestos.md`](20-casos-prueba/M11-VEN-ventas-presupuestos.md) | M11 | 94 | 18 | 8 | 120 | 395 |
| [`M12-CMP-compras-proveedores.md`](20-casos-prueba/M12-CMP-compras-proveedores.md) | M12 | 115 | 25 | 9 | 149 | 520 |
| [`M13-STK-stock-activos-fabricacion.md`](20-casos-prueba/M13-STK-stock-activos-fabricacion.md) | M13 | 139 | 43 | 24 | 206 | 882 |
| [`M14-TES-tesoreria-bancos.md`](20-casos-prueba/M14-TES-tesoreria-bancos.md) | M14 | 188 | 0 | 22 | 210 | 499 |
| [`M15-CON-contabilidad.md`](20-casos-prueba/M15-CON-contabilidad.md) | M15 | 162 | 31 | 21 | 214 | 763 |
| [`M16-SUE-personal-sueldos.md`](20-casos-prueba/M16-SUE-personal-sueldos.md) | M16 | 146 | 30 | 16 | 192 | 691 |
| [`M17-INS-institucional.md`](20-casos-prueba/M17-INS-institucional.md) | M17 | 108 | 22 | 15 | 145 | 531 |
| [`M18-SOC-servicios-sociales-flota.md`](20-casos-prueba/M18-SOC-servicios-sociales-flota.md) | M18 | 149 | 25 | 18 | 192 | 640 |
| [`M19-POR-portal-socio-landing.md`](20-casos-prueba/M19-POR-portal-socio-landing.md) | M19 | 180 | 0 | 29 | 209 | 553 |
| [`T01-PLA-plataforma-saas.md`](20-casos-prueba/T01-PLA-plataforma-saas.md) | T01 | 165 | 1 | 18 | 184 | 440 |
| [`T02-IAM-identidad-roles-auditoria.md`](20-casos-prueba/T02-IAM-identidad-roles-auditoria.md) | T02 | 93 | 59 | 16 | 168 | 888 |
| [`T03-UXD-experiencia-marca-diccionario.md`](20-casos-prueba/T03-UXD-experiencia-marca-diccionario.md) | T03 | 179 | 25 | 14 | 218 | 634 |
| [`T04-CFG-configuracion-parametros-maestros.md`](20-casos-prueba/T04-CFG-configuracion-parametros-maestros.md) | T04 | 143 | 35 | 15 | 193 | 728 |
| [`T05-DAT-modelo-datos.md`](20-casos-prueba/T05-DAT-modelo-datos.md) | T05 | 0 | 12 | 5 | 17 | 182 |
| [`T06-INT-integraciones.md`](20-casos-prueba/T06-INT-integraciones.md) | T06 | 86 | 27 | 15 | 128 | 563 |
| [`T07-MIG-migracion-procoop.md`](20-casos-prueba/T07-MIG-migracion-procoop.md) | T07 | 78 | 11 | 15 | 104 | 395 |
| [`T08-NFR-no-funcionales-seguridad.md`](20-casos-prueba/T08-NFR-no-funcionales-seguridad.md) | T08 | 25 | 5 | 16 | 46 | 256 |
| [`T09-COM-comunidad-comunicaciones.md`](20-casos-prueba/T09-COM-comunidad-comunicaciones.md) | T09 | 157 | 63 | 24 | 244 | 1096 |
| [`T10-BIA-reportes-bi-apis.md`](20-casos-prueba/T10-BIA-reportes-bi-apis.md) | T10 | 103 | 38 | 16 | 157 | 664 |
| [`T11-WFL-workflow-eventos-documentos.md`](20-casos-prueba/T11-WFL-workflow-eventos-documentos.md) | T11 | 157 | 42 | 18 | 217 | 838 |
| [`T12-SRV-fichas-verticales-servicios-parte1.md`](20-casos-prueba/T12-SRV-fichas-verticales-servicios-parte1.md) | T12 | 0 | 58 | 0 | 58 | 590 |
| [`T12-SRV-fichas-verticales-servicios-parte2.md`](20-casos-prueba/T12-SRV-fichas-verticales-servicios-parte2.md) | T12 | 0 | 58 | 0 | 58 | 590 |
| **Total** | | **4.204** | **975** | **531** | **5.710** | |

Los cuatro archivos de T04b (catálogo de parámetros ProCoop) no tienen RF, ESC ni CU: sus parámetros se prueban a través de los RF y escenarios de los anexos que los usan.

## 6. Suites

- [`90-suites-regresion-por-ola.md`](20-casos-prueba/90-suites-regresion-por-ola.md): suite incremental de cada ola O0–O11, regla de composición de la regresión acumulada, humo por PR y nocturno.
- [`91-suite-piloto-lag.md`](20-casos-prueba/91-suite-piloto-lag.md): suite de la cooperativa piloto Laguna Larga, con los AC-01 a AC-20 de `07` §15 enlazados a sus CP y 284 CP agrupados en Internet sintético, servicios medidos y prepago de LAG, y migración y paralelo.

| Ola | CP de la ola | De RF | De ESC | De CU | Núcleo |
|---|---|---|---|---|---|
| O0 | 400 | 305 | 59 | 36 | 320 |
| O1 | 701 | 458 | 149 | 94 | 494 |
| O2 | 784 | 614 | 96 | 74 | 428 |
| O3 | 478 | 319 | 104 | 55 | 174 |
| O4 | 590 | 424 | 106 | 60 | 269 |
| O5 | 622 | 469 | 100 | 53 | 367 |
| O6 | 339 | 244 | 76 | 19 | 135 |
| O7 | 402 | 298 | 77 | 27 | 128 |
| O8 | 554 | 462 | 51 | 41 | 47 |
| O9 | 209 | 163 | 30 | 16 | 98 |
| O10 | 526 | 383 | 101 | 42 | 75 |
| O11 | 105 | 65 | 26 | 14 | 27 |

## 7. Inconsistencias detectadas en la especificación

No se corrigieron en `docs/especificacion/` (regla 1). Se listan para su tratamiento por el responsable de cada anexo.

| N.º | Inconsistencia | Fuente | Tratamiento en este entregable |
|---|---|---|---|
| INC-CP-01 | 0 RF tienen "-" en la columna Criterio de aceptación, aunque `07` §13.2 supone un criterio por RF. Por anexo:  | Tablas de RF de los anexos citados | El CP verifica el enunciado del RF y lo marca "sin criterio explícito"; conviene completar el criterio en el anexo |
| INC-CP-02 | La ola de la columna del anexo difiere de la del prompt de `03` que implementa el RF en 0 casos: . El plan v1.1 (§1) reparte O5 = 469 y O10 = 383 RF, pero contando los RF por el prompt que los implementa resultan O5 = 469 y O10 = 383 | Anexos M15 y T03; `03` §1 y §21 | Prevalece el prompt de `03`; los CP usan esa ola |
| INC-CP-03 | La columna Ola no tiene una ola reconocible en 5 RF: RF-CAT-010 (`según ficha`); RF-CRM-254 (`—`); RF-VEN-106 (`—`); RF-MIG-060 (`por dominio`); RF-COM-180 (`por emisor`) | Tablas de RF | Se usa la ola del prompt de `03` |
| INC-CP-04 | Los valores del primer comprobante del piloto Internet difieren entre ESC-SRV-INT-01 (T12 parte 1: abono ARS 25.000, instalación ARS 30.000, total ARS 60.000) y ESC-TAR-03 (M04 §17); ya observado como OBS-01 en `07` §16.2 | T12 parte 1 §1.7; M04 §17 | Los CP-SRV y CP-TAR correspondientes conservan cada uno los valores de su anexo; debe fijarse un único conjunto dorado antes de automatizarlos |
| INC-CP-05 | Resuelta en la especificación: M06 §17 ya identifica sus escenarios como `ESC-FIS-nn` (antes 1 a 48 sin ID). Queda la cita por número de AC-06 en `07` §15 ("Escenario 32"), que M06 §17 declara equivalente a `ESC-FIS-32` | M06 §17; `07` §15.1 | Los escenarios de M06 pasan al rango 5001–5999 como el resto; el rango 7001–7999 queda sin uso. AC-06 se enlaza con el CP de `ESC-FIS-32` |
| INC-CP-06 | Formatos heterogéneos de escenarios entre anexos (columnas "Escenario / Esperado", "Dado / Cuando / Entonces" en una o tres columnas, "Aplicación en M08", párrafos en negrita, encabezados); 38 CU tienen fila o encabezado propio en más de un anexo: tras la corrección del 05-11-2026 cada uno declara su anexo dueño y los demás detallan solo su parte, pero el formato de esas filas no distingue definición de cita | Sección 16 y 17 de los anexos | Un CP por definición (dueño y partes); la guía de redacción podría fijar un formato único |
| INC-CP-07 | IDs que parecen escenarios pero son encabezados o prefijos: `ESC-ID`, `CU-ID` (encabezados de columna), `ESC-SRV` (prefijo genérico en T12), `ESC-FIS` (prefijo del texto "`ESC-FIS-nn`" de M06 §17) y `CU-MIG` (prefijo del rango CU-MIG-01..14 en T07). Hay CU sin número (CU-SUE en M14; CU-ESP-AG, CU-ESP-ELE, CU-ESP-GAS, CU-ESP-CEM y CU-ESP-SAN) | M04, M05, M07, M08, M13, M14, M15, M16, T03, T04, T07, T09, T12 | Excluidos del universo los cinco prefijos; los CU sin número se incluyen |

## 8. Pendientes y límites

1. Los CP de RF son de aceptación funcional del criterio; los casos negativos de cada capability y los de aislamiento por ruta se generan desde los catálogos (suites transversales de `07` §4.3) y no se repiten aquí como CP individuales.
2. Los RNF de T08 (292) no forman parte de este universo: se verifican con las suites de CI, carga, seguridad y simulacros de `07` §6; los CP que los citan los listan en "Cubre".
3. Las RN no tienen universo propio en este entregable: se citan cuando el RF o el escenario las menciona (309 RN distintas citadas). Su verificación completa se apoya en `16-catalogo-reglas-negocio.md`.
4. La numeración de los CP de ESC y CU depende del orden de aparición en el anexo: si el anexo cambia, regenerar con el script y revisar las suites. La de los CP de RF es estable (sigue el número del RF).
5. Fechas, responsables nominales y herramienta de gestión de casos son **a definir** (`07` §16.1, AD-01 a AD-04).

## 9. Tabla de cobertura

| Universo | Cómo se contó | Total en la especificación | Con CP | Cobertura | Excluidos con motivo |
|---|---|---|---|---|---|
| RF | Filas de tabla con ID `RF-XXX-nnn` en una tabla con columnas Requisito y Criterio de los 29 anexos con RF (`03` v1.1 declara 4.204, antes 4.203, por RF-POR-180 nuevo en O2) | 4.204 | 4.204 | 100,0 % | 0. 385 RF tienen además CP de escenario o caso de uso |
| ESC | IDs distintos `ESC-…` citados en los 36 archivos de anexos, sin `ESC-ID`, `ESC-SRV` ni `ESC-FIS`; incluye los 48 `ESC-FIS-nn` de M06, antes escenarios numerados sin ID; todos tienen al menos una definición (fila, párrafo o encabezado). El recuento por script supera la estimación inicial de ~594 del pedido | 763 | 763 | 100,0 % | 0. 5 ESC (ESC-01 a ESC-05 del AGR) tienen CP en más de un anexo |
| Criterios con ID propio | IDs distintos `AC-PER-nn`, `CA-DAT-nn`, `CA-INT-nn`, `CA-WFL-nn`, `TST-IAM-nn` citados en los anexos | 161 | 161 | 100,0 % | 0 |
| Escenarios numerados sin ID | Filas numeradas de las tablas de escenarios del §17 (solo M06: 1 a 0) | 0 | 0 | — | 0 |
| CU | IDs distintos `CU-…` citados en los anexos, sin `CU-ID` ni `CU-MIG` (los ~466 iniciales incluían esos dos); 32 son CU numerados de BASE (CU-03 a CU-104) | 471 | 471 | 100,0 % | 0. 38 CU tienen CP en más de un anexo |
| Anexos | Archivos de `docs/especificacion/anexos/` | 36 | 32 | — | 4 (T04b partes 1 a 4: sin RF, ESC ni CU) |

Meta de la regla 7: 100 % del universo incluido. Resultado: RF con CP 4.204 / 4.204; ESC con CP 763 / 763; CU con CP 471 / 471; adicionales: criterios con ID 161 / 161 y escenarios numerados 0 / 0.
