# Plan de validación con el cliente — GoodApps Cooperativas

| Campo | Valor |
|---|---|
| Proyecto | GoodApps Cooperativas — plataforma SaaS multitenant que reemplaza a ProCoop |
| Documento | `13-plan-validacion-cliente.md` |
| Artefacto del índice | 1.7 Plan de validación con el cliente (`00-INDICE.md`) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Cliente | Cooperativa piloto Laguna Larga (`LAG`, DEC-088) |
| Fuentes | `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` (§2.2, §12, §15, §16); `01-registro-decisiones.md`; `02-preguntas-abiertas.md`; `03-plan-de-olas-y-prompts.md` (§1, §16); `05-registro-huecos.md`; §16, §17 y §21 de cada anexo; T07 (fases F1 a F10); T12 (escenarios ESC-SRV y ESC-T12) |
| Prevalencia | Este documento deriva de la especificación y no la reemplaza. Ante cualquier diferencia prevalecen la especificación maestra, sus anexos y el registro de decisiones. |
| Documentos relacionados | `12-supuestos-dependencias.md` (supuestos SUP y dependencias DEP que se validan en las sesiones); `09-riesgos-y-raci.md` (interesados, RACI y riesgos; no se repiten aquí); `05-wireframes-pantallas-piloto.md` (wireframes W-01 a W-17); `07-estrategia-pruebas.md` (pruebas de aceptación del software, distintas de esta validación documental) |

## Control de versiones

| Versión | Fecha | Descripción del cambio | Elaborado por (rol) |
|---|---|---|---|
| 1.0 | 05-11-2026 | Versión inicial: objetivos, participantes, calendario tipo de 23 sesiones en 15 semanas, criterios de aceptación por anexo, tratamiento de observaciones, actas modelo y tabla de seguimiento. | Equipo de producto y desarrollo |

## Aprobaciones

| Rol | Alcance de la aprobación | Estado |
|---|---|---|
| Gerencia de la cooperativa piloto | Plan completo, calendario y participantes | Pendiente |
| Consejo de administración | Calendario y aprobación final del entregable | Pendiente |
| Equipo de producto y desarrollo | Contenido completo | Pendiente |

> **Convenciones.** Los participantes se identifican por **rol genérico**, nunca por nombre. El calendario es **tipo**: usa "Semana 1..15" sin fechas reales (DEC-006: las olas no tienen fechas). En las sesiones solo se usan datos sintéticos (tenant demo TEN-001 y precargas de M02 §18) y configuración de la base relevada `PR_LAG_DEMO`; **nunca datos personales reales**.

## Índice

1. Propósito y alcance
2. Objetivos
3. Reglas de la validación
4. Participantes por rol
5. Agrupamiento de anexos: bloques por dominio y ola
6. Calendario tipo de sesiones
7. Fichas de sesión
8. Criterios de aceptación por anexo
9. Tratamiento de observaciones
10. Acta modelo de sesión
11. Acta modelo de aprobación de anexo
12. Tabla de seguimiento del estado de aprobación
13. Puntos a definir

---

## 1. Propósito y alcance

Este plan organiza la **validación del entregable de análisis y diseño** con la cooperativa piloto: que la cooperativa revise, corrija y apruebe formalmente la especificación (`docs/especificacion/`: maestra, registros y los 36 archivos de anexos) antes de que se construya cada ola.

Alcance:

- **Incluye**: revisión de reglas de negocio (RN), requisitos funcionales (RF), parámetros (PRM), casos de uso (§16 de cada anexo) y escenarios (§17); revisión de las 423 PA asumidas con la opción recomendada (DEC-072); dictamen sobre los 8 parámetros con validación legal (`05-registro-huecos.md`); verificación de los datos de migración marcados `[VERIFICAR]`; validación de los 57 supuestos y la gestión de las 55 dependencias de `12-supuestos-dependencias.md`.
- **No incluye**: las pruebas de aceptación del software construido (estrategia en `07-estrategia-pruebas.md` §11 y §15) ni la conciliación y el paralelo de migración (T07 F9 y F10). Esta validación es **documental** y ocurre antes de construir.

## 2. Objetivos

1. Obtener la **aprobación formal por anexo** (o por tramo de olas en los anexos que abarcan varias) antes de iniciar la ola en la que empiezan sus RF (`03-plan-de-olas-y-prompts.md` §16).
2. **Convertir supuestos en decisiones**: cada PA asumida revisada se confirma o se reemplaza mediante una DEC nueva (DEC-089 en adelante).
3. Obtener el **dictamen legal** de los parámetros normativos antes de habilitar el servicio afectado (SUP-040 a SUP-047, SUP-022, SUP-024, SUP-031).
4. **Verificar los datos de migración** relevados en `PR_LAG_DEMO` contra la operación real de LAG (SUP-048 a SUP-057).
5. **Recorrer los escenarios** de cada dominio con la cooperativa, con datos sintéticos y los wireframes disponibles, para detectar faltantes antes de construir.
6. Asignar **responsables a las dependencias externas** y fijar lo que la cooperativa debe conseguir antes de cada ola (`12`, Parte C).

## 3. Reglas de la validación

1. **Prevalece la especificación.** Una observación no cambia el comportamiento hasta que se registra como DEC (o como corrección del anexo) y se publica la nueva versión del anexo.
2. **Se valida lo que bloquea primero.** El orden de las sesiones sigue la primera ola en que cada anexo tiene RF: primero los que bloquean O0–O2.
3. **Validación justo a tiempo.** Los bloques B a E pueden validarse mientras se construyen olas anteriores, pero un anexo (o su tramo) debe estar `Aprobado` o `Aprobado con observaciones` antes de iniciar la ola correspondiente.
4. **Las PA asumidas se revisan, no se rediscuten desde cero.** Se presenta la opción recomendada y sus alternativas tal como figuran en el §21 del anexo; la cooperativa confirma o elige otra.
5. **Sin datos personales reales ni secretos** en el material, las pantallas o las actas. Las credenciales se mencionan solo por nombre (T06).
6. **Toda observación queda en un acta** con un ID `OBS-Snn-nn` y un responsable.

## 4. Participantes por rol

Las siglas siguen la matriz RACI de `09-riesgos-y-raci.md` (Parte B) y se desagregan los usuarios clave por área.

| Sigla | Rol | Interesado en `09` | Participación en la validación |
|---|---|---|---|
| CA | Consejo de administración | I01 | Apertura, cierres de bloque y aprobación final del entregable. |
| SIN | Sindicatura / auditoría | I02 | Sesiones de seguridad, control interno, contabilidad e institucional. |
| GER | Gerencia | I03 | Patrocinador; aprueba los anexos (A en la actividad 10 de la RACI); preside los cierres de bloque. |
| CON | Contador | I04 | Fiscal, contabilidad, tesorería, migración de saldos, entidades jurídicas. |
| SIS | Responsable de sistemas de la cooperativa | I05 | Plataforma, seguridad, configuración, integraciones, migración y credenciales. |
| JAT | Jefe de atención | I06 | Personas, portal, CRM, comunicaciones, mora. |
| JTE | Jefe técnico | I07 | Catálogo técnico, campo, red, medición, obras. |
| FAC | Responsable de facturación | I08 | Tarifas, facturación, parámetros heredados de facturación. |
| TES | Responsable de tesorería, cajeros y cobradores | I08, I09 | Cobranza, caja, pasarelas, bancos. |
| ADM | Personal administrativo, compras, depósito y RRHH | I11 | ERP administrativo, stock, sueldos. |
| SOC | Responsable de servicios sociales | — (rol a designar por la cooperativa) | Adherentes, sepelio, salud, vivienda, cementerio. |
| LEG | Asesor legal | I13 | Dictámenes de parámetros normativos, prescripción, protección de datos, corte. |
| EPD | Equipo de producto y desarrollo | I14 | Facilita las sesiones, presenta el anexo, registra actas y publica versiones. |
| OPL | Operador de plataforma (incluye al líder de migración) | I15 | Migración, integraciones de plataforma, seguridad y operación. |

Roles fijos en cada sesión:

- **Facilitador** (EPD): conduce la agenda y presenta el contenido.
- **Secretario de actas** (EPD): registra observaciones y decisiones en el acta modelo (§10).
- **Validador principal** del anexo (columna "Validador" de §8): firma la conformidad técnica de la sesión.
- **Quórum mínimo**: facilitador, secretario, validador principal y al menos un usuario clave del dominio. Sin quórum, la sesión se reprograma.

## 5. Agrupamiento de anexos: bloques por dominio y ola

| Bloque | Olas que desbloquea | Dominios y anexos | Hito que habilita |
|---|---|---|---|
| **A — Fundaciones y primer contacto del socio** | O0, O1, O2 | Maestra, registros (`01`, `02`, `03`, `05`); plataforma y datos (T01, T05, T08); identidad y experiencia (T02, T03); configuración (T04, T04b partes 1 a 4); workflow, comunicaciones, integraciones base y reportes base (T11, T09, T06 marco, T10 base); migración base (T07); personas, catálogo, portal, CRM de solicitudes y asociados mínimos (M01, M02, M19, M09, M17) | Un socio se registra y solicita Internet (O2) |
| **B — Piloto Internet de punta a punta** | O3, O4, O5, O6 | Técnica, stock serializado y legajo mínimo (M10, M13, M16); tarifas, facturación, ventas de mostrador, fiscal y adherentes (M04, M05, M11, M06, M18); cobranza, tesorería, contabilidad núcleo y capital (M07, M14, M15, M17); mora y atención omnicanal (M08, M09); ficha vertical INT (T12 parte 1) | Piloto Internet completo (O6) |
| **C — Servicios medidos (crítico para migrar LAG)** | O7 | Medición (M03), tarifas medidas (M04), mora de medidos (M08), obras (M10), reguladores (M06), fichas ELE, AG, CLO, GAS y ALU (T12 parte 1), obras (T12 parte 2), migración de medidos (T07) | Facturación de energía con lecturas (O7) y primera migración real de LAG |
| **D — ERP administrativo y sueldos** | O8, O9 | Ventas, compras, stock, tesorería, contabilidad completa y regímenes informativos (M11, M12, M13, M14, M15, M06); sueldos (M16) | Cierre contable mensual (O8) y liquidación con F.931/LSD (O9) |
| **E — Institucional, servicios sociales y corte** | O10, O11 | Institucional (M17), servicios sociales (M18), telefonía y TV (M10, T12 parte 1), fichas sociales (T12 parte 2), BI y APIs (T10), migración repetible, paralelo y corte (T07), integraciones restantes (T06) | Asamblea y servicios sociales (O10); corte por etapas (O11) |

## 6. Calendario tipo de sesiones

| Semana | Sesión | Bloque | Dominio | Anexos | Olas | Duración | Participantes |
|---|---|---|---|---|---|---|---|
| 1 | S00 | A | Apertura y método | Maestra, `01`, `02`, `03`, `05`; `12` y `13` | Todas | 2 h | CA, GER, CON, SIS, JAT, JTE, LEG, EPD, OPL |
| 1 | S01 | A | Plataforma, datos y no funcionales | T01, T05, T08; T04 (entidades jurídicas y sucursales) | O0–O1 | 3 h | GER, CON, SIS, LEG, SIN, EPD, OPL |
| 2 | S02 | A | Identidad, roles y experiencia | T02, T03 | O0–O1 | 3 h | SIS, SIN, JAT, JTE, FAC, EPD |
| 2 | S03 | A | Configuración y parámetros heredados | T04, T04b partes 1 a 4 | O1 (y parámetros de olas posteriores) | 3 h | SIS, FAC, TES, CON, EPD |
| 3 | S04 | A | Workflow, comunicaciones, integraciones base y reportes base | T11, T09, T06 (marco y fichas O0–O2), T10 (tramo O1–O2) | O0–O2 | 3 h | SIS, JAT, LEG, GER, EPD, OPL |
| 3 | S05 | A | Estrategia de migración y acceso al origen | T07 (estrategia, fases F1 a F4, mapeos de O0–O2) | O1–O2 | 2,5 h | SIS, CON, GER, EPD, OPL |
| 4 | S06 | A | Personas, titulares y cuentas | M01 | O2 | 3 h | JAT, TES, LEG, EPD |
| 4 | S07 | A | Catálogo de servicios y contratos | M02; T12 parte 1 (ficha INT, tramo O2) | O2 | 3 h | GER, JTE, FAC, JAT, EPD |
| 5 | S08 | A | Portal del socio, CRM de solicitudes y asociados mínimos | M19, M09 (tramo O2–O3), M17 (tramo O2) | O2 | 3 h | JAT, LEG, SIS, GER, EPD |
| 5 | S09 | A | **Cierre del bloque A** | Anexos del bloque A | O0–O2 | 1,5 h | CA, GER, validadores principales, EPD |
| 6 | S10 | B | Técnica del piloto Internet | M10 (tramo O3), M13 (serializado), M16 (legajo mínimo); fichas T06 de red | O3 | 3 h | JTE, ADM, SIS, EPD, OPL |
| 7 | S11 | B | Tarifas, facturación y ventas de mostrador | M04 (tramo O4), M05, M11 (tramo O4) | O4 | 3 h | FAC, CON, TES, EPD |
| 7 | S12 | B | Fiscal, adherentes y conceptos de terceros | M06 (tramo O4), M18 (adherentes), T12 parte 2 (fichas TAS y CAP) | O4 | 3 h | CON, LEG, SOC, FAC, EPD |
| 8 | S13 | B | Cobranza, caja y tesorería operativa | M07, M14 (tramo O5); fichas T06 de cobranza | O5 | 3 h | TES, CON, SIS, EPD, OPL |
| 8 | S14 | B | Contabilidad núcleo y capital social | M15 (tramo O5), M17 (capital, tramo O5) | O5 | 2,5 h | CON, SIN, CA, EPD |
| 9 | S15 | B | Mora, corte, convenios y atención omnicanal | M08 (tramo O6), M09 (tramo O6) | O6 | 3 h | GER, LEG, JAT, TES, CON, EPD |
| 9 | S16 | B | **Recorrido integral Internet y cierre del bloque B** | T12 parte 1 (ficha INT completa) | O3–O6 | 3 h | CA, GER, JAT, JTE, FAC, TES, CON, EPD |
| 10 | S17 | C | Medición y servicios medidos | M03, M04 (tramo O7); T12 parte 1 (ELE, AG, CLO, GAS, ALU) | O7 | 3 h | JTE, FAC, LEG, CON, EPD |
| 11 | S18 | C | Mora de medidos, obras, reguladores y migración de LAG; **cierre del bloque C** | M08 (tramo O7), M10 (tramo O7), M06 (reguladores), T12 parte 2 (OBR), T07 (mapeos de medidos y prepago) | O7 | 3,5 h | CA, GER, JTE, LEG, CON, SIS, EPD, OPL |
| 12 | S19 | D | ERP administrativo | M11, M12, M13, M14, M15 (tramos O8), M06 (regímenes informativos) | O8 | 3,5 h | CON, ADM, TES, SIN, EPD |
| 13 | S20 | D | Personal y sueldos; **cierre del bloque D** | M16 | O8–O9 | 3 h | ADM, CON, LEG, GER, EPD |
| 14 | S21 | E | Institucional, servicios sociales, telefonía y TV | M17 (tramo O10), M18, M09 y M10 (tramos O10), T12 parte 1 (TEL, TV), T12 parte 2 (SEP, CEM, SAN, SAL, VIV, OTR) | O10 | 3,5 h | CA, SIN, SOC, JTE, JAT, LEG, EPD |
| 15 | S22 | E | BI, APIs, migración repetible y corte; **aprobación global** | T10, T07 (paralelo, by-pass, runbook), T06 (restantes); maestra y `03` | O11 | 3 h | CA, GER, CON, SIS, SIN, EPD, OPL |

Total: **23 sesiones en 15 semanas** (unas 67 horas de sesión). La cadencia de dos sesiones por semana es una propuesta: se ajusta con la Gerencia de LAG.

## 7. Fichas de sesión

Preparación común a todas las sesiones (responsable: EPD, con 5 días hábiles de anticipación):

- Envío de las secciones del anexo a revisar: glosario, RF y RN del tramo, parámetros, casos de uso (§16), criterios y escenarios (§17) y preguntas (§21).
- **Lista filtrada de PA asumidas** del anexo (de `02-preguntas-abiertas.md`) con la opción recomendada y las alternativas.
- Lista de **marcas `[VERIFICAR]`** del anexo y de los supuestos SUP y dependencias DEP de `12` que se tratan en la sesión.
- Extracto de configuración de `PR_LAG_DEMO` relacionado (sin datos personales), cuando corresponda.
- Acta modelo (§10) prellenada con el temario.

Preparación común de la cooperativa: lectura previa por el validador principal y los usuarios clave; listado de dudas; documentación interna pedida en la ficha.

### S00 — Apertura y método (Semana 1)

| Campo | Detalle |
|---|---|
| Anexos | Maestra (§1, §4, §12, §15, §18), `01-registro-decisiones.md`, `02-preguntas-abiertas.md` (política), `03-plan-de-olas-y-prompts.md` (§1), `05-registro-huecos.md`; `12` y `13` |
| Objetivos | Presentar el alcance, el plan de olas y este plan; acordar el calendario, los validadores y el circuito de observaciones; ratificar formalmente a LAG como piloto (DEC-088, SUP-002); validar la política de PA asumidas (SUP-001). |
| Preparación previa | Resumen ejecutivo (`01-resumen-ejecutivo-vision.md`); propuesta de validadores por anexo (§8). |
| Material | `01-resumen-ejecutivo-vision.md`; `09-riesgos-y-raci.md` (RACI y riesgos críticos); Parte C de `12`. |
| Duración / participantes | 2 h · CA, GER, CON, SIS, JAT, JTE, LEG, EPD, OPL |

### S01 — Plataforma, datos y no funcionales (Semana 1)

| Campo | Detalle |
|---|---|
| Anexos | T01, T05 (convenciones y clasificación de datos), T08; T04 (entidades jurídicas y sucursales, RF-CFG-134 a RF-CFG-142) |
| Objetivos | Validar tenancy, ambientes y salida del cliente (PA-PLA-04 a PA-PLA-13), niveles de servicio (DEC-063), alojamiento y rol de encargado (DEC-062, DEC-076), conservación de datos (PA-NFR-06) y entidades jurídicas y sucursales de LAG. |
| Preparación previa | Cooperativa: relación de entidades jurídicas y sucursales con sus usos. Asesor legal: lectura de T08 §10.3 y del contrato tipo de encargo. |
| Material | `02-arquitectura-c4.md` (contexto y despliegue); `03a-er-plataforma-personas-catalogo.md`; escenarios de T08 §17. |
| Supuestos y dependencias | SUP-006, SUP-007, SUP-008, SUP-031, SUP-050, SUP-051; DEP-052, DEP-053 |
| Duración / participantes | 3 h · GER, CON, SIS, LEG, SIN, EPD, OPL |

### S02 — Identidad, roles y experiencia (Semana 2)

| Campo | Detalle |
|---|---|
| Anexos | T02, T03 |
| Objetivos | Validar catálogo de roles y capabilities, segundo factor, separación de funciones y auditoría (PA-IAM-01 a PA-IAM-17); marca, diccionario, mapa del sitio y temas (PA-UXD-01 a PA-UXD-17). |
| Preparación previa | Cooperativa: organigrama por rol (sin nombres) y franjas horarias de operación. |
| Material | Wireframes W-01 (login) y W-02 (layout del admin); escenarios ESC-UXD (25). |
| Supuestos y dependencias | SUP-030; DEP-035, DEP-038 |
| Duración / participantes | 3 h · SIS, SIN, JAT, JTE, FAC, EPD |

### S03 — Configuración y parámetros heredados (Semana 2)

| Campo | Detalle |
|---|---|
| Anexos | T04, T04b partes 1 a 4 |
| Objetivos | Validar configuración versionada, revisión de cambios (PA-CFG-01), retroactividad (PA-CFG-08), geografía y calles (PA-CFG-02, PA-CFG-13); revisar la clasificación de los parámetros de ProCoop y los que quedan "a validar" (PA-CFG-07, PA-CFG-P2-01). |
| Preparación previa | EPD: lista de parámetros de `PR_LAG_DEMO` con valor distinto del default. |
| Material | Escenarios ESC-CFG (35); catálogo T04b. |
| Supuestos y dependencias | SUP-014 (parámetros de facturación sin uso); DEP-047 |
| Duración / participantes | 3 h · SIS, FAC, TES, CON, EPD |

### S04 — Workflow, comunicaciones, integraciones base y reportes base (Semana 3)

| Campo | Detalle |
|---|---|
| Anexos | T11, T09, T06 (marco común §5–§9 y fichas de O0–O2: FI-INT-61, 63 a 65, 67, 68, 71, 96, 102, 106), T10 (tramo O1–O2) |
| Objetivos | Validar aprobaciones y delegaciones (PA-WFL-08, PA-WFL-09), retención documental (PA-WFL-03), consentimientos y horario de no molestar (PA-COM-06, PA-COM-07), modelo de mensajería (DEC-077), bóveda (DEC-074) y reportes base. |
| Preparación previa | Cooperativa: canales actuales de comunicación con socios; decisión sobre WhatsApp y SMS propios o de plataforma. |
| Material | Escenarios ESC-COM (58), ESC-BIA (38, tramo inicial), ESC-INT (7). |
| Supuestos y dependencias | SUP-029, SUP-031, SUP-032; DEP-031 a DEP-036 |
| Duración / participantes | 3 h · SIS, JAT, LEG, GER, EPD, OPL |

### S05 — Estrategia de migración y acceso al origen (Semana 3)

| Campo | Detalle |
|---|---|
| Anexos | T07 (estrategia, profundidad del histórico, fases F1 a F4, mapeos de O0–O2) |
| Objetivos | Validar el corte por etapas (DEC-068, DEC-069), profundidad del histórico (DEC-070), calidad de datos (PA-MIG-10 a PA-MIG-14), anonimización (PA-MIG-15) y el acceso de solo lectura al origen; planificar la resolución de los `[VERIFICAR]` por fase. |
| Preparación previa | Cooperativa: contacto con el proveedor de ProCoop para el acceso de solo lectura y la convivencia. |
| Material | Escenarios ESC-MIG (10); `07-estrategia-pruebas.md` §7. |
| Supuestos y dependencias | SUP-004, SUP-005, SUP-025, SUP-026, SUP-055; DEP-048, DEP-049 |
| Duración / participantes | 2,5 h · SIS, CON, GER, EPD, OPL |

### S06 — Personas, titulares y cuentas (Semana 4)

| Campo | Detalle |
|---|---|
| Anexos | M01 |
| Objetivos | Validar alta, verificación del vínculo (DEC-043), duplicados (DEC-044), cambio de titularidad (DEC-045), transferencia, fallecimiento, fusión y conservación (PA-PER-07 a PA-PER-14). |
| Preparación previa | Cooperativa: casos reales de cambio de titularidad y fallecimiento descriptos sin datos personales. |
| Material | Wireframes W-03 (ficha 360) y W-15 (vincular cuenta); casos de uso CU-PER (§16) y criterios §17; `03a-er-plataforma-personas-catalogo.md`. |
| Supuestos y dependencias | SUP-026, SUP-028; DEP-036 |
| Duración / participantes | 3 h · JAT, TES, LEG, EPD |

### S07 — Catálogo de servicios y contratos (Semana 4)

| Campo | Detalle |
|---|---|
| Anexos | M02; T12 parte 1 (ficha INT, tramo O2) |
| Objetivos | Confirmar la jerarquía del catálogo (DEC-012), el contrato de servicio y sus estados, y la oferta de servicios de LAG. M02 no tiene PA asumidas: se revisan sus 7 `[VERIFICAR]` y la precarga demo (M02 §18). |
| Preparación previa | Cooperativa: lista de servicios, productos y planes que ofrece hoy (sin precios si no están aprobados). |
| Material | Wireframes W-04 (alta de contrato) y W-10 (configuración del servicio Internet); escenarios ESC-SRV-INT. |
| Supuestos y dependencias | SUP-003; DEP-055 |
| Duración / participantes | 3 h · GER, JTE, FAC, JAT, EPD |

### S08 — Portal del socio, CRM de solicitudes y asociados mínimos (Semana 5)

| Campo | Detalle |
|---|---|
| Anexos | M19, M09 (tramo O2–O3), M17 (tramo O2) |
| Objetivos | Validar landing, registro y portal (PA-POR-01 a PA-POR-19), solicitudes y reclamos, plazos ENACOM (HUE-INT-03) y asociados mínimos. |
| Preparación previa | Asesor legal: **dictamen de `PRM-CRM-135`** (SUP-041). Cooperativa: textos legales del portal. |
| Material | Wireframes W-08 (bandeja de reclamos), W-11 a W-14 (inicio, factura, pagar, nueva gestión); escenarios ESC-CRM (25) e ESC-INS (tramo O2). |
| Supuestos y dependencias | SUP-027, SUP-029, SUP-041; DEP-013, DEP-049 |
| Duración / participantes | 3 h · JAT, LEG, SIS, GER, EPD |

### S09 — Cierre del bloque A (Semana 5)

| Campo | Detalle |
|---|---|
| Anexos | Todos los del bloque A |
| Objetivos | Revisar observaciones abiertas, confirmar las DEC nuevas del bloque y firmar el acta de aprobación (§11) de cada anexo o tramo O0–O2. |
| Preparación previa | EPD: versiones nuevas de los anexos con las observaciones incorporadas y lista de DEC propuestas. |
| Material | Tabla de seguimiento (§12); actas de S00 a S08. |
| Duración / participantes | 1,5 h · CA, GER, validadores principales del bloque, EPD |

### S10 — Técnica del piloto Internet (Semana 6)

| Campo | Detalle |
|---|---|
| Anexos | M10 (tramo O3), M13 (stock serializado y comodato), M16 (legajo mínimo); fichas T06 FI-INT-69 a FI-INT-72 y FI-INT-79 a FI-INT-81 |
| Objetivos | Validar factibilidad, agenda, OT y cierre en dos pasos (DEC-039, DEC-040), aprovisionamiento (DEC-041, DEC-042), comodato (DEC-013), trabajo sin conexión y dispositivos. |
| Preparación previa | Cooperativa: inventario de equipos de red y de dispositivos de campo; elección del proveedor de firma (DEC-078). |
| Material | Wireframes W-09 (ficha de OT), W-16 y W-17 (PWA de campo); escenarios ESC-TEC (30) e ESC-STK (tramo O3); `03c-er-cobranza-mora-crm-tecnica.md`. |
| Supuestos y dependencias | SUP-036, SUP-039, SUP-049; DEP-037, DEP-039, DEP-041 |
| Duración / participantes | 3 h · JTE, ADM, SIS, EPD, OPL |

### S11 — Tarifas, facturación y ventas de mostrador (Semana 7)

| Campo | Detalle |
|---|---|
| Anexos | M04 (tramo O4), M05, M11 (tramo O4) |
| Objetivos | Validar la semántica tarifaria, precisión y redondeo, el tratamiento de diferencias con ProCoop en el paralelo, la operación del lote y las ventas de mostrador. |
| Preparación previa | Cooperativa: cuadros tarifarios de Internet y conceptos vigentes; diseño actual de factura. EPD: fórmulas de ProCoop a traducir (RN-MIG-048). |
| Material | Wireframes W-05 (comprobantes) y W-06 (revisión del lote); escenarios ESC-TAR (39, tramo O4), ESC-VEN (tramo O4), ESC-SRV-INT-01; `03b-er-medicion-tarifas-facturacion.md`. |
| Supuestos y dependencias | SUP-012, SUP-013, SUP-014, SUP-053; DEP-028, DEP-055 |
| Duración / participantes | 3 h · FAC, CON, TES, EPD |

### S12 — Fiscal, adherentes y conceptos de terceros (Semana 7)

| Campo | Detalle |
|---|---|
| Anexos | M06 (tramo O4), M18 (adherentes y entradas a facturar, DEC-071), T12 parte 2 (fichas TAS y CAP) |
| Objetivos | Validar ARCA, IVA e IIBB Córdoba (DEC-053, DEC-054), numeración y contingencia (DEC-018, DEC-035, DEC-038), conceptos de terceros (DEC-083) y el aporte de capital en la factura (HUECO-CAP-04). |
| Preparación previa | Contador y asesor legal: **dictamen de `PRM-FIS-122`** (SUP-040). Cooperativa: custodia y vencimiento del certificado ARCA; convenios de terceros. |
| Material | Escenarios §17 de M06; ESC-T12-TAS y ESC-T12-CAP. |
| Supuestos y dependencias | SUP-009, SUP-010, SUP-040, SUP-057; DEP-001 a DEP-004, DEP-007, DEP-009 |
| Duración / participantes | 3 h · CON, LEG, SOC, FAC, EPD |

### S13 — Cobranza, caja y tesorería operativa (Semana 8)

| Campo | Detalle |
|---|---|
| Anexos | M07, M14 (tramo O5); fichas T06 FI-INT-34 a FI-INT-45, FI-INT-55 a FI-INT-57, FI-INT-60, FI-INT-107, FI-INT-108 |
| Objetivos | Validar imputación (DEC-048, DEC-049), identificador de pago (DEC-050), reconexión al pagar (DEC-014), pasarelas (DEC-015), rendición y conciliación (DEC-059), prepago adelantado (PA-COB-15) y PA-TES-17. |
| Preparación previa | Cooperativa: convenios de Red Link y SIRO, bancos y formatos de extracto; decisión sobre Pagos360 y Mercado Pago. EPD: perfilado de `DEUDARED` si ya hay acceso al origen. |
| Material | Wireframe W-07 (cobro en ventanilla) y W-13 (pagar); criterios §17 de M07 y M14. |
| Supuestos y dependencias | SUP-016 a SUP-020, SUP-048, SUP-052; DEP-020 a DEP-026, DEP-029, DEP-030 |
| Duración / participantes | 3 h · TES, CON, SIS, EPD, OPL |

### S14 — Contabilidad núcleo y capital social (Semana 8)

| Campo | Detalle |
|---|---|
| Anexos | M15 (tramo O5), M17 (capital, tramo O5) |
| Objetivos | Validar el plan de cuentas, asientos automáticos y contabilidad no oficial durante la convivencia (DEC-009, DEC-069), el marco normativo (PA-CON-06) y el capital mínimo (DEC-019, DEC-061). |
| Preparación previa | Contador: plan de cuentas vigente y criterios de asiento. Consejo: reglas de capital del estatuto. |
| Material | Escenarios ESC-CON (26, tramo O5) e ESC-INS (tramo O5). |
| Supuestos y dependencias | SUP-033, SUP-034; DEP-054, DEP-055 |
| Duración / participantes | 2,5 h · CON, SIN, CA, EPD |

### S15 — Mora, corte, convenios y atención omnicanal (Semana 9)

| Campo | Detalle |
|---|---|
| Anexos | M08 (tramo O6), M09 (tramo O6) |
| Objetivos | Validar instancias de mora de Internet, intereses, garantías del corte, convenios, incobrables, prescripción (DEC-052) e IA de atención (DEC-056). |
| Preparación previa | Asesor legal: **dictámenes de prescripción, preaviso, protecciones y ventanas** (SUP-022, SUP-024). Gerencia: aceptación de la IA. |
| Material | Escenarios ESC-MOR (63, tramo O6) e ESC-CRM (tramo O6). |
| Supuestos y dependencias | SUP-021 a SUP-024; DEP-040 |
| Duración / participantes | 3 h · GER, LEG, JAT, TES, CON, EPD |

### S16 — Recorrido integral Internet y cierre del bloque B (Semana 9)

| Campo | Detalle |
|---|---|
| Anexos | T12 parte 1 (ficha INT completa) |
| Objetivos | Recorrer el servicio Internet de punta a punta (solicitud, instalación, factura con CAE, pago, mora y reconexión) con datos sintéticos y aprobar los anexos y tramos O3–O6. |
| Preparación previa | EPD: guion del recorrido con ESC-SRV-INT-01 a ESC-SRV-INT-07 y los wireframes en secuencia. |
| Material | Wireframes W-04, W-09, W-06, W-12, W-13 y W-16/W-17; tabla de seguimiento (§12). |
| Duración / participantes | 3 h · CA, GER, JAT, JTE, FAC, TES, CON, EPD |

### S17 — Medición y servicios medidos (Semana 10)

| Campo | Detalle |
|---|---|
| Anexos | M03, M04 (tramo O7); T12 parte 1 (fichas ELE, AG, CLO, GAS, ALU) |
| Objetivos | Validar rutas, lecturas, estimación, telemedición, prepago, corrección de volumen de gas (DEC-085), generación distribuida (DEC-060), subsidios y gas envasado (DEC-082). |
| Preparación previa | Cooperativa: sistema de prepago y telemedición en uso; cuadros tarifarios medidos aprobados. Asesor legal: **dictámenes de emergencias de gas y caudal mínimo** (SUP-042, SUP-043). |
| Material | Escenarios ESC-MED (37), ESC-TAR (tramo O7), ESC-SRV-ELE, ESC-SRV-AG, ESC-SRV-CLO, ESC-SRV-GAS, ESC-SRV-ALU. |
| Supuestos y dependencias | SUP-015, SUP-018, SUP-037, SUP-042, SUP-043, SUP-056; DEP-010, DEP-042, DEP-043 |
| Duración / participantes | 3 h · JTE, FAC, LEG, CON, EPD |

### S18 — Mora de medidos, obras, reguladores y migración de LAG; cierre del bloque C (Semana 11)

| Campo | Detalle |
|---|---|
| Anexos | M08 (tramo O7), M10 (tramo O7: obras y contribución por mejoras), M06 (reguladores), T12 parte 2 (ficha OBR), T07 (mapeos de medidos, prepago y obras) |
| Objetivos | Validar modos de mora por servicio, ventanas ERSeP (HUE-ELE-05), electrodependientes, obras (HUECO-OBR-01, HUECO-OBR-02), informes ERSeP y ENARGAS, y la preparación de la primera migración real de LAG (PA-MIG-17). Aprobar los tramos O7. |
| Preparación previa | Asesor legal: **dictamen de `PRM-MOR-206`** (SUP-044). EPD: resultado del perfilado de los `[VERIFICAR]` de medidos. |
| Material | Escenarios ESC-MOR (tramo O7, incluye ESC-MOR-53 a ESC-MOR-58), ESC-T12-OBR, ESC-MIG. |
| Supuestos y dependencias | SUP-004, SUP-011, SUP-044, SUP-054; DEP-011, DEP-012, DEP-017, DEP-019 |
| Duración / participantes | 3,5 h · CA, GER, JTE, LEG, CON, SIS, EPD, OPL |

### S19 — ERP administrativo (Semana 12)

| Campo | Detalle |
|---|---|
| Anexos | M11, M12, M13, M14, M15 (tramos O8), M06 (regímenes informativos, tramo O8) |
| Objetivos | Validar compras y control de 3 vías (PA-CMP-04), compra al mayorista (HUE-ELE-01, HUE-GAS-04), stock completo y costeo (PA-STK-01), tesorería completa e Interbanking, contabilidad completa y regímenes informativos. |
| Preparación previa | Cooperativa: layout de facturas del mayorista; aplicación Interbanking; regímenes que presenta hoy. |
| Material | Escenarios ESC-VEN (18), ESC-CMP (25), ESC-STK (43), ESC-CON (tramo O8). |
| Supuestos y dependencias | SUP-019, SUP-033; DEP-005, DEP-008, DEP-018, DEP-027, DEP-051 |
| Duración / participantes | 3,5 h · CON, ADM, TES, SIN, EPD |

### S20 — Personal y sueldos; cierre del bloque D (Semana 13)

| Campo | Detalle |
|---|---|
| Anexos | M16 |
| Objetivos | Validar la estrategia de sueldos (DEC-058), F.931, LSD y SICOSS, firma del recibo y conservación de legajos. Aprobar los tramos O8–O9. |
| Preparación previa | Cooperativa: formato del liquidador externo; convenios colectivos aplicables. |
| Material | Escenarios ESC-SUE (30). |
| Supuestos y dependencias | SUP-035; DEP-006, DEP-039, DEP-051 |
| Duración / participantes | 3 h · ADM, CON, LEG, GER, EPD |

### S21 — Institucional, servicios sociales, telefonía y TV (Semana 14)

| Campo | Detalle |
|---|---|
| Anexos | M17 (tramo O10), M18, M09 y M10 (tramos O10), T12 parte 1 (TEL, TV), T12 parte 2 (SEP, CEM, SAN, SAL, VIV, OTR) |
| Objetivos | Validar asambleas, padrón y reembolso de capital, servicios sociales sin datos clínicos, mora de telefonía, TV y cobertura social. |
| Preparación previa | Asesor legal: **dictámenes de `PRM-MOR-199`, `PRM-MOR-200`, `PRM-MOR-204` y `PRM-SOC-052`** (SUP-045 a SUP-047). Cooperativa: estatuto y reglamentos sociales. |
| Material | Escenarios ESC-INS (22), ESC-SOC (25), ESC-SRV-TEL, ESC-SRV-TV, ESC-T12-SEP, ESC-T12-CEM, ESC-T12-SAN, ESC-T12-SAL, ESC-T12-VIV, ESC-T12-OTR. |
| Supuestos y dependencias | SUP-034, SUP-038, SUP-045 a SUP-047; DEP-016, DEP-044 a DEP-046, DEP-055 |
| Duración / participantes | 3,5 h · CA, SIN, SOC, JTE, JAT, LEG, EPD |

### S22 — BI, APIs, migración repetible y corte; aprobación global (Semana 15)

| Campo | Detalle |
|---|---|
| Anexos | T10, T07 (paralelo, by-pass, runbook de corte), T06 (fichas restantes); maestra y `03` |
| Objetivos | Validar reportes, API de terceros y datos abiertos (PA-BIA-01 a PA-BIA-16), criterios del paralelo (PA-MIG-02), go/no-go del corte (RF-MIG-086) y firmar la aprobación global del entregable. |
| Preparación previa | EPD: tabla de seguimiento completa y lista de observaciones abiertas. |
| Material | Escenarios ESC-BIA, ESC-MIG; `07-estrategia-pruebas.md` §7.4. |
| Supuestos y dependencias | SUP-025; DEP-024, DEP-048, DEP-050 |
| Duración / participantes | 3 h · CA, GER, CON, SIS, SIN, EPD, OPL |

## 8. Criterios de aceptación por anexo

### 8.1 Lista de control común

Un anexo (o un tramo de olas de un anexo) se acepta cuando se cumplen **todos** los puntos aplicables:

| N.º | Criterio | Evidencia |
|---|---|---|
| C1 | **Reglas validadas**: RF, RN y parámetros del tramo revisados con el validador principal; sin observaciones bloqueantes abiertas. | Acta de sesión con la lista de secciones revisadas. |
| C2 | **PA asumidas revisadas**: cada PA asumida del anexo fue confirmada o reemplazada, con su DEC registrada. | Lista de PA con resultado y DEC (DEC-089 en adelante). |
| C3 | **Parámetros legales confirmados**: los parámetros con validación legal del anexo tienen dictamen del asesor legal (aprobado, ajustado o "no habilitar hasta"). | Dictamen adjunto al acta; valor confirmado del PRM. |
| C4 | **Datos de migración verificados**: las marcas `[VERIFICAR]` del tramo están resueltas o tienen fase de T07 (F1 a F4) y responsable asignados. | Lista de `[VERIFICAR]` con estado. |
| C5 | **Escenarios recorridos**: los escenarios del §17 del anexo (y los ESC-SRV o ESC-T12 aplicables) se recorrieron con datos sintéticos y los wireframes disponibles. | Lista de escenarios recorridos y resultado. |
| C6 | **Dependencias asignadas**: las dependencias externas de la ola tienen responsable y fecha objetivo (`12`, Parte B). | Tabla DEP con responsable confirmado. |
| C7 | **Versión publicada**: las observaciones aceptadas están incorporadas en una versión nueva del anexo. | Número de versión y control de cambios del anexo. |

Resultado posible: **Aprobado** (C1 a C7 cumplidos), **Aprobado con observaciones** (solo quedan observaciones menores con responsable y plazo, sin impacto en la ola siguiente) o **Rechazado** (hay observaciones bloqueantes; requiere nueva sesión).

### 8.2 Criterios específicos por anexo

"PA asumidas" y "`[VERIFICAR]`" son los recuentos de `12-supuestos-dependencias.md` §A.2. "Escenarios" indica la cantidad de IDs ESC propios del anexo; donde dice "§17", el anexo usa criterios por RF y escenarios BASE sin numeración ESC propia.

| Anexo | Sesiones | PA asumidas (C2) | Parámetros legales (C3) | `[VERIFICAR]` (C4) | Escenarios (C5) | Validador principal |
|---|---|---|---|---|---|---|
| Maestra `00` y registros `01`, `02`, `03`, `05` | S00, S09, S22 | Política DEC-072 (SUP-001) | — | 7 (maestra, registros y matriz) | Hitos de salida por ola (maestra §15) | GER |
| T01 PLA | S01 | 8 | — | 3 | §17 | SIS |
| T02 IAM | S02 | 15 | — | 10 | §17 (BASE §102.6) | SIS |
| T03 UXD | S02 | 17 | — | 1 | 25 ESC-UXD | JAT |
| T04 CFG | S01, S03 | 12 | — | 20 (incluye origen de sucursales) | 35 ESC-CFG | SIS |
| T04b parte 1 | S03 | 4 | — | 0 | — | FAC |
| T04b parte 2 | S03 | 5 | — | 20 | — | FAC |
| T04b parte 3 | S03 | 3 | Prescripción (DEC-052, origen en PA-CFG-P3-01) | 8 | — | FAC |
| T04b parte 4 | S03 | 6 | — | 10 | — | SIS |
| T05 DAT | S01 | 2 (resueltas además por DEC-087) | — | 33 | §17 | SIS |
| T06 INT | S04, S10, S13, S22 | 15 | — | 43 | 7 ESC-INT | SIS |
| T07 MIG | S05, S18, S22 | 16 | — | 18 (incluye `DEUDARED`, `SERSOC_PRODUCTOS`) | 10 ESC-MIG | OPL (líder de migración), con CON |
| T08 NFR | S01 | 16 | Conservación de datos (PA-NFR-06) | 30 | §17 | SIS, con LEG |
| T09 COM | S04 | 14 | — | 2 | 58 ESC-COM | JAT |
| T10 BIA | S04, S22 | 16 | — | 3 | 38 ESC-BIA | GER |
| T11 WFL | S04 | 18 | Retención documental (PA-WFL-03) | 6 | §17 (escenarios integrales del maestro) | SIS |
| T12 parte 1 | S07, S16, S17, S21 | 0 | Hereda los de M08, M09 y M10 | 0 | 58 ESC-SRV | GER |
| T12 parte 2 | S12, S18, S21 | 0 | Hereda los de M08 y M18 | 5 | 58 ESC-T12 | GER |
| M01 PER | S06 | 10 | Conservación de datos personales (PA-PER-14) | 24 | §17 (CU-PER) | JAT |
| M02 CAT | S07 | 0 | — | 7 | §17 (ESC de la guía) | GER |
| M03 MED | S17 | 12 | — | 19 | 37 ESC-MED | JTE |
| M04 TAR | S11, S17 | 19 | — | 43 | 39 ESC-TAR | FAC |
| M05 FAC | S11 | 15 | — | 17 | §17 | FAC |
| M06 FIS | S12, S18, S19 | 15 | `PRM-FIS-122` (HUECO-CAP-04) | 10 | §17 (BASE) | CON |
| M07 COB | S13 | 14 | — | 20 | §17 | TES |
| M08 MOR | S15, S18 | 20 | `PRM-MOR-199`, `PRM-MOR-200`, `PRM-MOR-201`, `PRM-MOR-204`, `PRM-MOR-206`; prescripción (DEC-052) | 31 | 63 ESC-MOR | GER, con LEG |
| M09 CRM | S08, S15, S21 | 15 | `PRM-CRM-133` (HUE-GAS-05), `PRM-CRM-135` (HUE-INT-03) | 1 | 25 ESC-CRM | JAT |
| M10 TEC | S10, S18, S21 | 14 | `PRM-TEC-152` a `PRM-TEC-154` (HUE-GAS-05) | 3 | 30 ESC-TEC | JTE |
| M11 VEN | S11, S19 | 10 | — | 3 | 18 ESC-VEN | FAC |
| M12 CMP | S19 | 15 | — | 3 | 25 ESC-CMP | ADM |
| M13 STK | S10, S19 | 9 | — | 5 | 43 ESC-STK | ADM |
| M14 TES | S13, S19 | 16 (incluye PA-TES-17) | — | 17 | §17 | TES, con CON |
| M15 CON | S14, S19 | 16 | — | 29 | 26 ESC-CON | CON |
| M16 SUE | S10, S20 | 14 | — | 34 | 30 ESC-SUE | ADM, con CON |
| M17 INS | S08, S14, S21 | 9 | — | 28 | 22 ESC-INS | CA |
| M18 SOC | S12, S21 | 14 | `PRM-SOC-052` (HUECO-SEP-01) | 5 | 25 ESC-SOC | SOC |
| M19 POR | S08 | 19 | — | 11 | §17 | JAT |

## 9. Tratamiento de observaciones

### 9.1 Registro

Cada observación se registra en el acta de la sesión con:

| Campo | Contenido |
|---|---|
| ID | `OBS-Snn-nn` (sesión y número correlativo). |
| Anexo y referencia | Anexo, sección e ID afectado (RF, RN, PRM, PA, ESC, `[VERIFICAR]`). |
| Descripción | Qué observa la cooperativa, en sus palabras. |
| Tipo | Ver 9.2. |
| Severidad | **Bloqueante** (impide aprobar el anexo o iniciar la ola), **Mayor** (cambia una regla o un importe), **Menor** (redacción, ejemplo, presentación). |
| Responsable y plazo | Rol que la resuelve y plazo relativo (por ejemplo, "antes de S09"). |
| Resolución | Referencia a la DEC, PA, hueco o versión del anexo que la cierra. |

### 9.2 Destino según el tipo

| Tipo de observación | Destino en la especificación | Efecto |
|---|---|---|
| **Aclaración** sin cambio de contenido | Ninguno; queda en el acta. | Se cierra en la misma sesión. |
| **Confirmación de una PA asumida** | Nueva DEC en `01-registro-decisiones.md` (DEC-089 en adelante); la PA pasa a `Respondida (DEC-xxx)` en `02-preguntas-abiertas.md` y en el §21 del anexo. | El supuesto de `12` pasa a `Validado`. |
| **Cambio de una PA asumida** (otra opción) | Nueva DEC con la opción elegida; actualización de la PA en `02` y en el §21 del anexo; ajuste de RF, RN o PRM afectados; si cambia la ola, actualización de `03-plan-de-olas-y-prompts.md` y de `04-matriz-trazabilidad.md`. | El supuesto pasa a `Invalidado`; se revisa el riesgo en `09`. |
| **Cambio de una decisión vigente** | Nueva DEC que marca la anterior `Reemplazada por DEC-xxx` (nunca se borra; `01`, encabezado). | Igual que el anterior. |
| **Pregunta nueva** | Nueva PA al final de `02-preguntas-abiertas.md` con opción recomendada, y en el §21 del anexo; si es de detalle, rige la recomendada (DEC-072). | Entra en la próxima sesión del dominio. |
| **Faltante o contradicción entre anexos** | Nuevo hueco en `05-registro-huecos.md` con propuesta, gravedad y ola. | Se resuelve como "Corregido en anexo" o pasa a PA. |
| **Dictamen legal** | Valor confirmado del PRM en el anexo dueño y estado del hueco en `05`; si el dictamen cambia la regla, DEC nueva. | El supuesto SUP-040 a SUP-047 pasa a `Validado` o `Invalidado`. |
| **Dato de migración verificado** | Se reemplaza la marca `[VERIFICAR]` por el dato relevado en el anexo dueño (y en T07 si es de mapeo). | El supuesto SUP-048 a SUP-057 pasa a `Validado`. |
| **Corrección editorial** | Nueva versión menor del anexo. | — |

### 9.3 Versionado de los anexos

Todos los anexos están en la versión 1.0 con estado "Especificación consolidada – pendiente de validar preguntas abiertas" (T12: "Borrador para revisión"). Regla propuesta:

- **1.x** (versión menor): correcciones editoriales y observaciones que no cambian reglas.
- **Versión mayor** (2.0): cuando la validación cambia reglas, importes, olas o el modelo de datos del anexo.
- Cada versión nueva registra en su control de cambios los `OBS-Snn-nn`, DEC, PA y huecos que incorpora.
- El estado del anexo pasa a **"Aprobado (versión n, acta APR-nn)"** al firmarse el acta de aprobación.

Los cambios en la especificación los realiza el Equipo de producto y desarrollo después de cada sesión; este plan no modifica ningún documento.

## 10. Acta modelo de sesión

```text
ACTA DE SESIÓN DE VALIDACIÓN — GoodApps Cooperativas
Acta N.º: ACT-{{Snn}}                        Sesión: {{Snn}} — {{NOMBRE DE LA SESIÓN}}
Semana del plan: {{Semana N}}               Fecha y hora: {{DD-MM-AAAA HH:MM}}
Modalidad: {{presencial | virtual | híbrida}}  Duración real: {{h}}
Cooperativa: {{RAZÓN SOCIAL}} (tenant {{CÓDIGO}})

1. PARTICIPANTES (por rol; sin datos de contacto)
   | Rol (sigla) | Función en la sesión          | Presente (Sí/No) |
   | {{GER}}     | {{Validador principal}}       | {{Sí}}           |
   | {{EPD}}     | Facilitador                   | {{Sí}}           |
   | {{EPD}}     | Secretario de actas           | {{Sí}}           |
   Quórum: {{Cumplido | No cumplido → sesión reprogramada}}

2. ANEXOS Y SECCIONES REVISADAS
   | Anexo | Versión | Secciones / tramo de olas | Resultado de la revisión |
   | {{Mnn}} | {{1.0}} | {{§5 RF-xxx-001..050; §6; §17}} | {{Revisado | Parcial}} |

3. PA ASUMIDAS REVISADAS
   | PA | Opción recomendada | Resultado (Confirmada / Cambiada a opción X / Diferida) | DEC propuesta |
   | {{PA-xxx-nn}} | {{A}} | {{Confirmada}} | {{DEC-0nn}} |

4. PARÁMETROS CON VALIDACIÓN LEGAL
   | Hueco | PRM | Valor por defecto | Dictamen (Aprobado / Ajustado a ... / No habilitar hasta ...) | Referencia del dictamen |
   | {{HUE-xxx-nn}} | {{PRM-xxx-nnn}} | {{valor}} | {{...}} | {{DICT-nn}} |

5. DATOS DE MIGRACIÓN [VERIFICAR]
   | Referencia | Dato relevado en PR_LAG_DEMO | Confirmación de la cooperativa | Fase T07 / responsable |
   | {{T07 §19 fila ...}} | {{...}} | {{Confirmado | Distinto: ... | A perfilar}} | {{F2 / OPL}} |

6. ESCENARIOS RECORRIDOS
   | Escenario | Material usado (wireframe, datos sintéticos) | Resultado (Conforme / Con observación OBS-...) |
   | {{ESC-xxx-nn}} | {{W-nn; TEN-001}} | {{Conforme}} |

7. SUPUESTOS Y DEPENDENCIAS TRATADOS
   | ID (SUP / DEP) | Resultado | Responsable confirmado | Fecha objetivo relativa |
   | {{SUP-0nn}} | {{Validado | Invalidado | En validación}} | {{rol}} | {{antes de Ox}} |

8. OBSERVACIONES
   | ID | Anexo / referencia | Descripción | Tipo | Severidad | Responsable | Plazo |
   | OBS-{{Snn}}-01 | {{...}} | {{...}} | {{...}} | {{Bloqueante | Mayor | Menor}} | {{rol}} | {{...}} |

9. DECISIONES TOMADAS EN LA SESIÓN (a registrar en 01-registro-decisiones.md)
   | DEC propuesta | Pregunta / tema | Opción elegida | Anexos afectados |
   | {{DEC-0nn}} | {{...}} | {{...}} | {{...}} |

10. CONFORMIDAD DE LA SESIÓN
   Resultado: {{Sesión conforme | Conforme con observaciones | Requiere nueva sesión}}
   Próxima acción: {{...}}
   Firma (rol) — Validador principal: {{________}}   Facilitador: {{________}}
```

## 11. Acta modelo de aprobación de anexo

```text
ACTA DE APROBACIÓN — GoodApps Cooperativas
Acta N.º: APR-{{nn}}                         Fecha: {{DD-MM-AAAA}}
Cooperativa: {{RAZÓN SOCIAL}} (tenant {{CÓDIGO}})
Bloque: {{A | B | C | D | E}}               Sesión de cierre: {{Snn}}

1. OBJETO DE LA APROBACIÓN
   | Anexo | Versión aprobada | Tramo de olas aprobado | Actas de sesión que respaldan |
   | {{Mnn / Tnn}} | {{1.1}} | {{O0–O2 | completo}} | {{ACT-S06, ACT-S09}} |

2. LISTA DE CONTROL (§8.1 del plan de validación)
   | Criterio | Cumplido (Sí / No / No aplica) | Evidencia |
   | C1 Reglas validadas | {{Sí}} | {{ACT-...}} |
   | C2 PA asumidas revisadas ({{n}} de {{N}}) | {{Sí}} | {{DEC-0nn a DEC-0nn}} |
   | C3 Parámetros legales confirmados | {{Sí | No aplica}} | {{DICT-nn}} |
   | C4 Datos de migración verificados ({{n}} de {{N}} [VERIFICAR]) | {{Sí}} | {{...}} |
   | C5 Escenarios recorridos ({{n}} de {{N}}) | {{Sí}} | {{...}} |
   | C6 Dependencias asignadas | {{Sí}} | {{DEP-0nn...}} |
   | C7 Versión publicada | {{Sí}} | {{versión y control de cambios}} |

3. OBSERVACIONES ABIERTAS ACEPTADAS (solo menores)
   | ID | Descripción | Responsable | Plazo | Impacto en la ola siguiente |
   | {{OBS-Snn-nn}} | {{...}} | {{rol}} | {{...}} | {{Ninguno}} |

4. DECISIONES INCORPORADAS
   {{DEC-0nn, DEC-0nn, ...}} — registradas en 01-registro-decisiones.md

5. DICTAMEN
   Estado resultante: {{Aprobado | Aprobado con observaciones | Rechazado}}
   Habilita el inicio de la ola: {{Ox}}
   Condiciones: {{...}}

6. FIRMAS (por rol)
   Gerencia (aprobador):                        {{________}}
   Validador principal del anexo ({{sigla}}):    {{________}}
   Asesor legal (si hubo parámetros legales):    {{________}}
   Equipo de producto y desarrollo:             {{________}}
   Toma de conocimiento del Consejo (cierres de bloque y aprobación global): {{________}}
```

## 12. Tabla de seguimiento del estado de aprobación

Estado inicial de todos los anexos: **Pendiente**. Estados posibles: `Pendiente` → `En revisión` → `Aprobado con observaciones` / `Aprobado` / `Rechazado` (vuelve a `En revisión`). "Primera ola que bloquea" es la primera ola con RF del anexo (`03` §16).

| Anexo | Versión actual | Bloque | Primera ola que bloquea | Sesiones | Estado | Tramo aprobado | Acta de aprobación | Observaciones abiertas |
|---|---|---|---|---|---|---|---|---|
| `00` Maestra | — | A | O0 | S00, S09, S22 | Pendiente | — | — | — |
| `01`, `02`, `05` Registros | — | A | O0 | S00 y todas | Pendiente | — | — | — |
| `03` Plan de olas | 1.1 | A | O0 | S00, S22 | Pendiente | — | — | — |
| T01 PLA | 1.0 | A | O0 | S01 | Pendiente | — | — | — |
| T02 IAM | 1.0 | A | O0 | S02 | Pendiente | — | — | — |
| T03 UXD | 1.0 | A | O0 | S02 | Pendiente | — | — | — |
| T04 CFG | 1.0 | A | O0 | S01, S03 | Pendiente | — | — | — |
| T04b parte 1 | 1.0 | A | O1 | S03 | Pendiente | — | — | — |
| T04b parte 2 | 1.0 | A | O1 | S03 | Pendiente | — | — | — |
| T04b parte 3 | 1.0 | A | O1 | S03 | Pendiente | — | — | — |
| T04b parte 4 | 1.0 | A | O1 | S03 | Pendiente | — | — | — |
| T05 DAT | 1.0 | A | O0 | S01 | Pendiente | — | — | — |
| T06 INT | 1.0 | A | O0 | S04, S10, S13, S22 | Pendiente | — | — | — |
| T07 MIG | 1.0 | A | O0 | S05, S18, S22 | Pendiente | — | — | — |
| T08 NFR | 1.0 | A | O0 | S01 | Pendiente | — | — | — |
| T09 COM | 1.0 | A | O0 | S04 | Pendiente | — | — | — |
| T10 BIA | 1.0 | A | O1 | S04, S22 | Pendiente | — | — | — |
| T11 WFL | 1.0 | A | O0 | S04 | Pendiente | — | — | — |
| T12 parte 1 | 1.0 | A–E | O2 (ficha INT) | S07, S16, S17, S21 | Pendiente | — | — | — |
| T12 parte 2 | 1.0 | B–E | O4 (fichas TAS y CAP) | S12, S18, S21 | Pendiente | — | — | — |
| M01 PER | 1.0 | A | O2 | S06 | Pendiente | — | — | — |
| M02 CAT | 1.0 | A | O2 | S07 | Pendiente | — | — | — |
| M03 MED | 1.0 | C | O7 | S17 | Pendiente | — | — | — |
| M04 TAR | 1.0 | B | O3 | S11, S17 | Pendiente | — | — | — |
| M05 FAC | 1.0 | B | O4 | S11 | Pendiente | — | — | — |
| M06 FIS | 1.0 | B | O4 | S12, S18, S19 | Pendiente | — | — | — |
| M07 COB | 1.0 | B | O5 | S13 | Pendiente | — | — | — |
| M08 MOR | 1.0 | B | O4 | S15, S18 | Pendiente | — | — | — |
| M09 CRM | 1.0 | A | O2 | S08, S15, S21 | Pendiente | — | — | — |
| M10 TEC | 1.0 | B | O3 | S10, S18, S21 | Pendiente | — | — | — |
| M11 VEN | 1.0 | B | O4 | S11, S19 | Pendiente | — | — | — |
| M12 CMP | 1.0 | B | O3 | S10, S19 | Pendiente | — | — | — |
| M13 STK | 1.0 | B | O2 | S07, S10, S19 | Pendiente | — | — | — |
| M14 TES | 1.0 | B | O5 | S13, S19 | Pendiente | — | — | — |
| M15 CON | 1.0 | B | O3 | S14, S19 | Pendiente | — | — | — |
| M16 SUE | 1.0 | B | O3 | S10, S20 | Pendiente | — | — | — |
| M17 INS | 1.0 | A | O2 | S08, S14, S21 | Pendiente | — | — | — |
| M18 SOC | 1.0 | B | O4 | S12, S21 | Pendiente | — | — | — |
| M19 POR | 1.0 | A | O2 | S08 | Pendiente | — | — | — |

Notas sobre la tabla:

- M04 (1 RF en O3), M08 (4 RF en O4), M12 (2 RF de soporte en O3), M13 (2 RF en O2), M15 (1 RF en O3) y M16 (1 RF en O3, legajo mínimo) tienen RF aislados antes de su ola principal (`03` §16). Esos RF se revisan en la sesión de la ola en que empiezan (por ejemplo, los 2 RF de M13 en O2 se tratan en S07 junto con el catálogo, y los de M12 en S10) aunque el anexo se apruebe por tramos más adelante.
- El estado `Aprobado` de un anexo con varios tramos se alcanza con el último tramo; hasta entonces la columna "Tramo aprobado" muestra el avance (por ejemplo, "O2–O3").

## 13. Puntos a definir

| N.º | Punto | Con quién |
|---|---|---|
| 1 | Cadencia real de sesiones (el plan supone dos por semana) y su encaje con las ventanas de facturación y vencimientos de LAG. | Gerencia |
| 2 | Designación de los validadores principales y del responsable de servicios sociales (rol sin equivalente en `09`). | Gerencia |
| 3 | Plazo máximo entre la sesión y la publicación de la versión nueva del anexo. | Equipo de producto y desarrollo, con la Gerencia |
| 4 | Forma de firma de las actas (firma electrónica con OTP de la plataforma, DEC-078, o firma ológrafa escaneada). | Gerencia; asesor legal |
| 5 | Material adicional: `04-procesos-bpmn.md`, `06-secuencias-y-estados.md` y `08-plan-puesta-en-marcha.md` figuran en el índice pero no estaban en la carpeta al 05-11-2026; se suman al material de las sesiones cuando estén disponibles. | Equipo de producto y desarrollo |
