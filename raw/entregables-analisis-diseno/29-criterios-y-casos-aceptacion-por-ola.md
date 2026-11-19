# 29 — Casos de prueba de aceptación y criterios de aceptación por ola

| Campo | Valor |
|---|---|
| Documento | 29 — Casos de prueba de aceptación y criterios de aceptación por ola (portada) |
| Artefactos | 9.2 Casos de prueba de aceptación; 9.3 Criterios de aceptación por ola (índice `00-INDICE.md`) |
| Producto | GoodApps Cooperativas |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión del equipo de producto, QA y del referente de la cooperativa piloto |
| Fuentes | Criterios de aceptación de los RF y escenarios ESC- de los anexos de `docs/especificacion/anexos/` (M01 a M19, T01 a T12); `docs/especificacion/03-plan-de-olas-y-prompts.md` (172 prompts, entregables y criterios de salida por ola); T07 §17 (corrida en paralelo); T08 (RNF medibles); `07-estrategia-pruebas.md` (niveles, ambientes, nomenclatura, severidades, casos AC-01 a AC-20); `08-plan-puesta-en-marcha.md` (checklist GO-xx); decisiones DEC-005, DEC-088 y DEC-089 |

## Control de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 05-11-2026 | Primera versión: formato del caso, criterios por ola O0 a O11, 196 casos CPA, suite de paralelo de LAG, matriz de cobertura y observaciones. |

## Archivos que forman el documento

| Archivo | Contenido |
|---|---|
| `29-criterios-y-casos-aceptacion-por-ola.md` (esta portada) | Secciones 0 (propósito y relación con `07`), 1 (formato del caso), 2.0 (criterios comunes y resumen por ola), 4 (resumen de cobertura) y 5 (observaciones e inconsistencias) |
| [`29a-casos-aceptacion-o0-o3.md`](29a-casos-aceptacion-o0-o3.md) | Secciones 2.1 a 2.4: criterios y casos de O0, O1, O2 y O3 |
| [`29b-casos-aceptacion-o4-o7.md`](29b-casos-aceptacion-o4-o7.md) | Secciones 2.5 a 2.8: criterios y casos de O4, O5, O6 y O7 |
| [`29c-casos-aceptacion-o8-o11-paralelo.md`](29c-casos-aceptacion-o8-o11-paralelo.md) | Secciones 2.9 a 2.12 (O8 a O11) y sección 3 (suite de paralelo ProCoop frente a GoodApps para LAG) |
| [`29d-matriz-cobertura.md`](29d-matriz-cobertura.md) | Sección 4 detallada: universo por ola, escenarios no cubiertos y matriz caso → RF/ESC |

---

## 0. Propósito, alcance y relación con la estrategia de pruebas

Este documento traduce los criterios de aceptación de la especificación en casos de prueba de aceptación ejecutables y fija, para cada ola del plan, qué tiene que estar demostrado para darla por terminada. No agrega requisitos: cada caso cita el RF, el escenario (ESC-, TST-, CA-, AC-PER-, PR-POR-, NEG-, TEN-, RET-, T-TES-) o el criterio de salida del plan del que sale. Cuando una fuente no alcanza para definir un resultado esperado, el caso queda sin escribir y la falta va a la sección 5.

Relación con `07-estrategia-pruebas.md`:

| Tema | Regla en este documento |
|---|---|
| Niveles | Se usan los niveles de `07`: unitarias, integración, contrato, extremo a extremo (Playwright con etiquetas `@Ox` y `@piloto-internet`), aceptación de usuario y regresión, más las suites transversales de aislamiento (`npm run test:isolation`), permisos negativos, idempotencia, propiedades y carga (k6). Cada caso indica su nivel. |
| Ambientes | `local`, `ci`, `dev`, `staging`, `sandbox`, `demo`, `prod` y el ambiente aislado de migración, con el uso que les da `07`. La aceptación de usuario se hace en `sandbox` o en el tenant gemelo (RF-PLA-111); la carga se mide en `staging`; los ensayos de migración van al ambiente aislado. |
| Datos | Solo datos ficticios del juego canónico: TEN-001 "Cooperativa Ejemplo A" (`coop-ejemplo-a`, CUIT 30-99999991-0), TEN-002 "Cooperativa Ejemplo B", socia Ana Demo (DNI 00000001), planes INT-100 e INT-300, equipos ONT-DEMO-0001 a ONT-DEMO-0010, hermanos A y B en DIR-CASA-001, lotes LE-01 y LE-02, corrida MIG-DEMO-001, correos `@example.com` y `@ejemplo.test`. Ningún caso usa datos reales, secretos ni código de ProCoop. |
| Severidades | S1 a S4 de `07` §12.1. Un defecto S1 o S2 abierto en un caso impide aprobarlo. |
| Casos AC de `07` | Los casos AC-01 a AC-20 de `07` §15 se ejecutan dentro de los casos CPA que los citan en su campo "Cubre" (por ejemplo, AC-20 dentro de CPA-O7-101 a CPA-O7-114). `07` sigue siendo la fuente del protocolo de aceptación de usuario; acá está el detalle paso a paso. |
| Precedencia | Si un resultado esperado de un caso difiere del texto del ID citado, vale el ID citado y la diferencia se registra como defecto del caso, no del sistema. |

## 1. Formato del caso de prueba de aceptación

### 1.1 Campos obligatorios

| Campo | Contenido |
|---|---|
| ID | `CPA-<ola>-NNN`, con `<ola>` de O0 a O11 y NNN correlativo dentro de la ola. Los casos de la suite de paralelo de LAG usan el bloque CPA-O7-101 a CPA-O7-114. |
| Título | Qué demuestra el caso, en una línea. |
| Cubre | RF, escenarios y criterios de salida (CS-Ox-NN) que el caso demuestra. Es la fuente de la matriz de la sección 4. |
| Precondiciones | Estado previo del sistema, casos que deben haber corrido antes, parámetros y flags. |
| Datos ficticios | Datos concretos del juego canónico o derivados de él. |
| Pasos y resultado esperado | Escenario Gherkin (Dado / Cuando / Entonces / Y) en O0 a O7 y en la suite de paralelo; en O8 a O11, tabla con columnas "Cuando" y "Entonces". |
| Prioridad · Tipo | Ver 1.2 y 1.3. |
| Nivel · Ambiente | Nivel de `07` y ambiente donde se ejecuta. En las tablas de O8 a O11 se aplica el nivel extremo a extremo en `staging`, salvo que el caso diga otra cosa. |

### 1.2 Prioridad

La escala es una convención de este documento para ordenar la ejecución; no es un requisito de la especificación (OBS-25-16).

| Prioridad | Significado | Efecto en la salida de la ola |
|---|---|---|
| P1 | Camino crítico del piloto, aislamiento entre tenants, dinero, fiscal, seguridad o un criterio de salida del plan | Debe aprobarse al 100 %. Bloquea la salida de la ola y, en O7 y la suite de paralelo, la decisión de seguir o no seguir del corte de LAG. |
| P2 | Funcionalidad principal de la ola fuera del camino crítico | Debe aprobarse al 100 % o tener un defecto S3 o S4 con ticket, responsable y ola de corrección. |
| P3 | Variantes y casos secundarios | Puede quedar pendiente con ticket; no bloquea la salida. |

### 1.3 Tipos

| Tipo | Cuándo se usa |
|---|---|
| Funcional | Comportamiento de negocio descrito por un RF o escenario. |
| Regresión | Caso que se vuelve a ejecutar en olas siguientes para demostrar que lo ya aprobado sigue funcionando (por ejemplo, el recorrido del piloto Internet en cada ola posterior a O6). |
| Paralelo | Comparación de resultados entre ProCoop y GoodApps durante la corrida en paralelo (sección 3). |
| No funcional | Rendimiento, carga, disponibilidad, accesibilidad, seguridad u observabilidad medidos contra un RNF de T08. |

### 1.4 Plantilla

```gherkin
Escenario: CPA-Ox-NNN <título>
  Dado <precondición con datos ficticios>
  Cuando <acción del usuario o del sistema>
  Entonces <resultado esperado verificable>
  Y <resultado adicional, incluida auditoría o evento cuando el ID citado lo exige>
```

### 1.5 Ejecución y evidencia

- La prueba automatizada que implementa un caso lleva su ID en el nombre (con la forma `CPA-Ox-NNN <título>`), para que `npm run trace:check` relacione caso, RF y prueba.
- La evidencia de cada ejecución (reporte, capturas sin datos personales, informes k6, actas) se guarda en `docs/evidencias/<ola>/`.
- Un caso se aprueba cuando todos los "Entonces" se cumplen en el ambiente indicado y no hay defectos S1 o S2 abiertos asociados.
- Los casos de tipo regresión se incluyen en la suite de regresión de `07` al aprobarse por primera vez.

## 2.0 Criterios comunes de aceptación y resumen por ola

### 2.0.1 Entrada a la ejecución de aceptación de una ola

Se aplican los cinco criterios de entrada de `07` §11.1. Además, los casos de la ola deben estar revisados contra los ID que citan y los datos ficticios cargados con `npm run seed:demo`.

### 2.0.2 Salida común de todas las olas

Una ola se da por terminada cuando se cumplen a la vez:

1. Los criterios de salida comunes de `07` §11.2 y los específicos de `07` §11.3 para esa ola.
2. Las condiciones CS-Ox-NN de la ola (secciones 2.1 a 2.12), que transcriben los criterios de salida del plan `03` para esa ola.
3. Los RF de la ola en estado `Implementado` o `Parcial` con la parte de esa ola cumplida, y `npm run trace:check` sin faltantes (`03` R20; PRO-GEN-02).
4. Los casos CPA de prioridad P1 aprobados al 100 % y los P2 según 1.2.
5. La prueba de carga obligatoria aprobada en O0, O4, O5, O6, O7 y O11 (RNF-NFR-145) y, de O4 a O7 y en O11, la capacidad de tenant grande (RNF-NFR-024).
6. La regresión de las olas anteriores en verde, incluido el recorrido del piloto Internet a partir de O6.

### 2.0.3 Definición de terminado de un prompt y de una ola

Se adopta la definición de terminado de `07` §11.4 (nueve puntos) y la regla R16 del plan. Un prompt no se cierra si sus pruebas no corren en el CI; una ola no se cierra si su prompt de integración (columna "Prompt de integración" de la tabla siguiente) no está aprobado.

### 2.0.4 Resumen por ola

| Ola | Hito | RF | Prompts | Prompt de integración | Carga obligatoria | Casos CPA | Archivo |
|---|---|---|---|---|---|---|---|
| O0 | Fundaciones | 305 | 21 | PRO-O0-21 | Sí: login y lectura por ID | 15 | `29a` |
| O1 | Plataforma, IAM, configuración y workflow | 458 | 20 | PRO-O1-20 | No | 18 | `29a` |
| O2 | Personas, catálogo, landing, portal base, CRM y comunidad | 614 | 19 | PRO-O2-19 | No | 19 | `29a` |
| O3 | Técnica del piloto Internet | 319 | 13 | PRO-O3-13 | No | 16 | `29a` |
| O4 | Tarifas, facturación, ARCA e impuestos básicos | 424 | 16 | PRO-O4-16 | Sí: lote de 20.000 | 19 | `29b` |
| O5 | Cuenta corriente, cobranza, pasarelas, tesorería y núcleo contable | 469 | 14 | PRO-O5-14 | Sí: webhooks 500/min | 18 | `29b` |
| O6 | Mora, corte, reconexión y convenios: cierre del piloto Internet | 244 | 11 | PRO-O6-11 | Sí: mora de 20.000 | 17 | `29b` |
| O7 | Servicios medidos, migración comercial vigente, paralelo y corte comercial de LAG (DEC-089) | 298 (antes 274, DEC-089) | 12 (antes 10) | PRO-O7-10 | Sí: 50.000 lecturas | 21 | `29b` |
| O7 (paralelo LAG) | Suite de paralelo ProCoop frente a GoodApps | — | — | — | — | 14 | `29c` |
| O8 | ERP administrativo y contabilidad completa | 462 | 15 | PRO-O8-15 | No | 11 | `29c` |
| O9 | Personal y sueldos | 163 | 9 | PRO-O9-09 | No | 7 | `29c` |
| O10 | Institucional, servicios sociales, flota, telefonía, TV, fabricación y turnero | 383 | 14 | PRO-O10-14 | No | 10 | `29c` |
| O11 | BI, APIs de terceros, migración repetible y corte administrativo (DEC-089; antes "paralelo y corte") | 65 (antes 90, y 89 tras la corrección del plan; DEC-089) | 8 (antes 10) | PRO-O11-10 | Sí: carga completa | 11 | `29c` |
| **Total** | | **4.204** (antes 4.203) | **172** | | | **196** | |

O0 a O7 forman el camino crítico del piloto (Internet como primer servicio según DEC-005, y servicios medidos de LAG según DEC-088 y DEC-089), por eso sus casos están en Gherkin y con más detalle. O8 a O11 tienen los casos clave en tabla.

## Suite de paralelo de LAG (ubicación de la sección 3)

La sección 3 está en [`29c-casos-aceptacion-o8-o11-paralelo.md`](29c-casos-aceptacion-o8-o11-paralelo.md). Define el alcance, el momento (después de O7, etapa E1), el criterio de aprobación por servicio de T07 §17.4 y los 14 casos CPA-O7-101 a CPA-O7-114 para electricidad, gas y prepago. Su aprobación es la evidencia de las condiciones GO-02 y GO-26 del checklist de `08` para el corte comercial.

## 4. Resumen de la matriz de cobertura

Definición: el universo de cada ola son los escenarios con ID de referencia (ESC-, TST-, CA-, AC-PER-, PR-POR-, NEG-, TEN-, RET-, T-TES-, A1 a A16 y criterios numerados de M02, M05 y M06) asignados a esa ola; un escenario está cubierto si al menos un caso CPA lo cita en "Cubre". Los RF se cubren a través de esos escenarios y de `npm run trace:check`; las condiciones CS-Ox-NN de cada ola están cubiertas al 100 % en todas las olas. El detalle (universo, faltantes y matriz caso por caso) está en [`29d-matriz-cobertura.md`](29d-matriz-cobertura.md).

| Ola | Casos | Escenarios del universo | Cubiertos | Cobertura |
|---|---|---|---|---|
| O0 | 15 | 60 | 60 | 100,0 % |
| O1 | 18 | 125 | 100 | 80,0 % |
| O2 | 19 | 136 | 109 | 80,1 % |
| O3 | 16 | 70 | 67 | 95,7 % |
| O4 | 19 | 85 | 83 | 97,6 % |
| O5 | 18 | 125 | 117 | 93,6 % |
| O6 | 17 | 78 | 77 | 98,7 % |
| O7 | 21 | 110 | 106 | 96,4 % |
| Paralelo LAG | 14 | 22 | 22 | 100,0 % |
| O8 | 11 | 76 | 61 | 80,3 % |
| O9 | 7 | 30 | 29 | 96,7 % |
| O10 | 10 | 121 | 95 | 78,5 % |
| O11 | 11 | 59 | 51 | 86,4 % |
| **Total** | **196** | **1.097** | **977** | **89,1 %** |

Para el camino crítico (O0 a O7 y paralelo) la cobertura es 741 de 811 escenarios (91,4 %); lo no cubierto de O1 y O2 son variantes de configuración, comunidad y portal que no están en el recorrido del piloto y quedan como deuda de casos para la versión 1.1.

## 5. Observaciones e inconsistencias detectadas

Lo que sigue se registra sin corregir la especificación. Cada observación indica cómo la tratan los casos de este documento.

| ID | Observación | Fuentes involucradas | Tratamiento en este documento |
|---|---|---|---|
| OBS-25-01 | Los RF de corrida en paralelo y corte (RF-MIG-070 a RF-MIG-076 y RF-MIG-080 a RF-MIG-089) están asignados a O11 en T07 (incluida la columna "Por ola" de §9.1) y en el plan, pero DEC-089 exige el paralelo de electricidad, gas y prepago y el corte comercial de LAG después de O7. Ningún prompt de O7 adelanta esas capacidades. | DEC-089; T07 §9.1; `03` O11 | La suite de paralelo se identifica como CPA-O7-101 a CPA-O7-114 y se ejecuta al cerrar O7; su ejecución depende de que esas capacidades estén disponibles antes de O11. **Resuelta (05-11-2026):** el plan `03` §21.7 pasa esos RF, RF-MIG-006 y la migración de datos vigentes comerciales a O7 (PRO-O7-11 y PRO-O7-12). |
| OBS-25-02 | El criterio de salida de O11 (`03` §15.2) habla de "un ciclo" de paralelo y de una copia de ejemplo, mientras PRM-MIG-041 y PA-MIG-02 fijan 2 ciclos consecutivos aprobados por servicio. | `03` §15.2; T07 PRM-MIG-041 | CS-O11-02 y la suite de paralelo exigen 2 ciclos por servicio. **Resuelta (05-11-2026):** `03` §11.2 y §15.2 exigen los ciclos de PRM-MIG-041 (default 2). |
| OBS-25-03 | El plan y `07` citan la sección de escenarios de Internet de T12 parte 1 como §1.6, cuando está en §1.7, y ubican los escenarios de energía, agua, telefonía y TV en T12 parte 2 (`03` §11.8, PRO-O7-10, PRO-O10-14, `07` §11.3), cuando están en T12 parte 1 §2.7 a §8.7. | `03`; `07`; T12 | Los casos citan los ID ESC-SRV-xx con su ubicación real. **Resuelta (05-11-2026):** el plan cita T12 parte 1 §1.7 y las fichas de energía, agua, cloacas, gas, telefonía y TV en parte 1; `07` corregido igual. |
| OBS-25-04 | ESC-SRV-INT-01 usa importes 25.000, 30.000 y 60.000, distintos de ESC-TAR-03, M02 §18 y M04 9.3.9 (primer comprobante de INT-100 de 30.000,00). Coincide con OBS-01 de `07`. | T12 §1.7; M02 §18; M04 | Los casos usan los valores del juego canónico de M02 §18 (5.000 − 2.500 + 15.000 − 7.500 + 20.000 = 30.000,00). **Resuelta:** ESC-SRV-INT-01 ya usa el seed único de M02 §18. |
| OBS-25-05 | ESC-SRV-GAS-02 y ESC-SRV-GAS-07 describen consumo bloqueado, esquema que DEC-085, RN-TAR-035 y ESC-MED-17 reemplazaron. | T12 §7.7; DEC-085; M04; M03 | Los casos de gas siguen DEC-085 y ESC-MED-17. **Resuelta (05-11-2026):** ESC-SRV-GAS-02 y 07 siguen RN-TAR-035 (DEC-085). |
| OBS-25-06 | Los identificadores ESC-01 a ESC-05 se reutilizan con significados distintos en M01, M02, M05, M06, M07 (§17.6: ESC-01 pago duplicado, ESC-04 caída del proveedor), M15, T08, T09 y T11. Además, AC-08 de `07` cita M07 §17.6 para el caso de hermanos, que está en otros anexos. | Varios anexos; `07` AC-08 | Los casos citan siempre "ESC-0x de <anexo> §<sección>". |
| OBS-25-07 | El plan §9.8 describe ESC-SRV-INT-02 y ESC-SRV-INT-03 como escenarios de pagos y §10.2 lista contenidos que no coinciden con T12. Coincide con OBS-05 de `07`. | `03` §9.8, §10.2; T12 §1.7 | Se usa el contenido de T12. |
| OBS-25-08 | RF-COB-075 dice que si falla la carga de crédito prepago "se revierte", mientras RF-MED-115, ESC-MED-22 y AC-16 envían la recarga fallida a una bandeja sin emitir un segundo token; RF-MED-113 figura "a validar" (PA-MED-04). | M07; M03; `07` AC-16; `08` GO-25 | Los casos de prepago siguen ESC-MED-22 y GO-25; la definición de RF-MED-113 queda pendiente de PA-MED-04. **Resuelta:** RF-COB-075 ya no dice "se revierte"; la recarga fallida sigue RF-MED-115 y ESC-MED-22. |
| OBS-25-09 | ESC-MED-21 da la orden de trabajo por cerrada y ESC-SRV-ELE-07 indica que la orden no cierra (PRM-CAT-041). | M03; T12 §4.7 | CPA-O7-012 verifica la operación remota pendiente con reintentos (común a ambos) y deja el estado final de la orden de trabajo sujeto a la aclaración de esta observación. **Resuelta (05-11-2026):** ESC-MED-21 distingue PRM-CAT-041 (default `true`: la OT no cierra), igual que ESC-SRV-ELE-07. |
| OBS-25-10 | ESC-MED-37 está en M03 (O7), pero el RF que lo sostiene (RF-MED-129) está asignado a O8. | M03; `03` | El escenario se cubre en CPA-O8-008, junto con la compra mayorista de energía. **Sin cambio:** un escenario puede estar en el anexo y ejecutarse en la ola de su RF (O8); no es contradicción. |
| OBS-25-11 | El plan §4.8 asigna ESC-UXD-01 a ESC-UXD-25 a O0, aunque el editor de marca y el diccionario que prueban varios de ellos son de O1. | `03` §4.8; T03 | Los escenarios de marca y diccionario se cubren en O1 (CPA-O1-015). |
| OBS-25-12 | ESC-04 de T01 figura en O1, pero requiere pago y CAE, que llegan en O4 y O5. | T01 §17; `03` | Se parte en CPA-O1-016 (parte de plataforma) y CPA-O5-006 (completo, AC-15 de `07`). |
| OBS-25-13 | ESC-SUE-30 y RN-SUE-091 rechazan una liquidación propia y otra externa del mismo período, mientras el criterio de salida de O9 pide dos períodos en paralelo con el sistema anterior. | M16; `03` O9 | CPA-O9-001 compara los dos períodos contra la importación externa y verifica a la vez el rechazo de ESC-SUE-30; cómo conviven ambos requisitos en el paralelo de sueldos queda a definir. |
| OBS-25-14 | Nombre, slug y CUIT de TEN-001 difieren entre anexos (ya registrado como C-16 en el plan §19). | T01 §18; otros anexos; `03` §19 | Se usan los datos de T01 §18. **Resuelta (05-11-2026):** M02, T05, T12, T03 y M19 usan R14 del plan (`coop-ejemplo-a` "Cooperativa Ejemplo A" y `coop-ejemplo-b` "Cooperativa Ejemplo B"). |
| OBS-25-15 | La duración del hipercuidado y los plazos de corrección de defectos posteriores al corte figuran "a definir". | `08`; T07 | Los casos de corte no fijan plazos; solo verifican que el procedimiento exista y se registre. |
| OBS-25-16 | La escala de prioridad P1 a P3 de la sección 1.2 es una convención de este documento, no un requisito de la especificación. | — | Se propone para revisión con QA. |
| OBS-25-17 | T07 §9.6 punto 9 remite a §17.6, que no contiene lo referido. Coincide con OBS-04 de `07`. | T07 | Se usa el criterio de T07 §17.4. **Resuelta (05-11-2026):** T07 §9.6 punto 9 remite a §17.4. |
| OBS-25-18 | Los escenarios PR-POR-15 (formulario de adherentes), PR-POR-26 (espacio de empleado), PR-POR-32 ("ver como socio"), PR-POR-37 (visita sin mapa) y PR-POR-38 (auditoría axe) no tienen ola explícita en M19 ni en el plan. | M19 §17; `03` | Se asignan a O10, O9, O2, O2 y O2 para medir la cobertura y quedan sin caso en esta versión. |
