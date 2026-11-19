# Catálogo consolidado de reglas de negocio — GoodApps Cooperativas

Artefacto **2.4** del índice de entregables ([`00-INDICE.md`](00-INDICE.md)). Estado: **Derivable** (generado a partir de las tablas RN-xxx de los anexos). Versión 1.0 (05-11-2026).

## 1. Introducción

**Propósito.** Reunir en un solo documento todas las reglas de negocio (RN) de la especificación para revisarlas con la cooperativa, planificar las pruebas de aceptación y ubicar rápidamente qué reglas aplican a cada servicio vertical.

**Fuente.** Tablas de reglas de negocio de los anexos vigentes al 05-11-2026 en `docs/especificacion/anexos/` (M01–M19 y T01–T11). Se toman como reglas las filas de tabla cuyo identificador tiene la forma `RN-XXX-nnn`. Los anexos T04b y T12 no definen tablas RN propias: T04b es el catálogo de parámetros de ProCoop y T12 son las fichas verticales, que **citan** reglas de otros anexos (esas citas se usan en la matriz de aplicabilidad, §4).

**El texto normativo es el del anexo y prevalece.** La columna "Regla" de este catálogo es un **resumen** (el título en negrita si la regla lo tiene, seguido del comienzo del texto, hasta unos 200 caracteres). Ante cualquier diferencia rige el anexo citado en "Fuente" y, por encima de él, la maestra `00` y el registro de decisiones `01`.

**Cómo leerlo.**

- **ID**: identificador de la regla tal como figura en el anexo.
- **Servicios**: servicios verticales a los que la regla se refiere explícitamente (códigos de las fichas de T12). "Todos" significa que la regla no menciona ningún servicio en particular y, por lo tanto, es transversal.
- **Estado**: las tablas RN de los anexos **no tienen una columna de estado**; el estado se deriva así:
  - **Reemplazada**: la regla o su decisión dice "Reemplazado por …"; la regla quedó sustituida por otra y el anexo la conserva solo como referencia. "Reemplazada (parcial)" indica que se sustituyó una parte (un escenario o un tratamiento) y el resto sigue vigente.
  - **A validar**: la columna de verificación del anexo (`[VERIFICAR]`, "Verificación" o "Verificar") tiene contenido, o la fila menciona `[VERIFICAR]`, "A validar" o "requiere validación". La regla está decidida, pero tiene un punto pendiente de confirmar (con la cooperativa, la normativa o el código de ProCoop).
  - **Adoptada**: regla vigente sin pendientes registrados.
  - Después del punto medio (·) se indica el **tipo de decisión respecto de ProCoop**, tomado de la columna "Decisión": Replicar, Mejorar, Reemplazar (se reemplaza el comportamiento de ProCoop; **no** significa que la regla esté reemplazada), Adoptar (criterio de BASE o de un acuerdo), Nuevo, Delegar (a otro módulo), Descartar, Informado o Pendiente de decisión. M06 usa letras (R, M, Z, D), que se tradujeron a esas palabras. "Otra (ver anexo)" agrupa decisiones redactadas en forma descriptiva.
- **Fuente**: anexo y sección (§) donde está definida la regla.

**Cómo se detectan los servicios.** Se busca en toda la fila de la regla (regla, comportamiento ProCoop, decisión, parámetros y verificación): (a) los códigos de servicio como palabra aislada (INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR) y los huecos `HUECO-<código>-nn`; (b) nombres y términos propios de cada servicio (por ejemplo "internet", "telefonía", "kWh", "agua", "cloacas", "factor calórico", "alumbrado", "sepelio", "cementerio", "banco de sangre", "ambulancia", "vivienda", "tasa municipal", "capital social"); y (c) las reglas que cita cada ficha vertical de T12. La detección es automática por texto: orienta la lectura, pero no sustituye a la ficha del servicio.

## 2. Resumen cuantitativo

Total de reglas de negocio: **2665**, definidas en 30 anexos.

### 2.1 Por anexo

| Anexo | Módulo | Reglas | Adoptadas | A validar | Reemplazadas |
|---|---|---:|---:|---:|---:|
| [M01 PER](#catalogo-m01-per) | Personas, titulares y cuentas | 134 | 112 | 11 | 11 |
| [M02 CAT](#catalogo-m02-cat) | Catálogo de servicios y contratos | 79 | 68 | 4 | 7 |
| [M03 MED](#catalogo-m03-med) | Medición y consumos | 126 | 111 | 13 | 2 |
| [M04 TAR](#catalogo-m04-tar) | Tarifas y motor de cálculo | 251 | 223 | 28 | 0 |
| [M05 FAC](#catalogo-m05-fac) | Facturación | 161 | 145 | 16 | 0 |
| [M06 FIS](#catalogo-m06-fis) | Fiscal e impuestos | 132 | 92 | 40 | 0 |
| [M07 COB](#catalogo-m07-cob) | Cuenta corriente y cobranza | 157 | 126 | 31 | 0 |
| [M08 MOR](#catalogo-m08-mor) | Mora y financiación | 147 | 108 | 39 | 0 |
| [M09 CRM](#catalogo-m09-crm) | Atención (CRM) | 97 | 86 | 11 | 0 |
| [M10 TEC](#catalogo-m10-tec) | Técnica, campo y redes | 116 | 104 | 12 | 0 |
| [M11 VEN](#catalogo-m11-ven) | Ventas y presupuestos | 52 | 48 | 4 | 0 |
| [M12 CMP](#catalogo-m12-cmp) | Compras y proveedores | 75 | 69 | 6 | 0 |
| [M13 STK](#catalogo-m13-stk) | Stock, activos y fabricación | 78 | 76 | 2 | 0 |
| [M14 TES](#catalogo-m14-tes) | Tesorería y bancos | 86 | 75 | 11 | 0 |
| [M15 CON](#catalogo-m15-con) | Contabilidad | 126 | 97 | 29 | 0 |
| [M16 SUE](#catalogo-m16-sue) | Personal y sueldos | 95 | 77 | 18 | 0 |
| [M17 INS](#catalogo-m17-ins) | Institucional | 52 | 37 | 15 | 0 |
| [M18 SOC](#catalogo-m18-soc) | Servicios sociales y flota | 56 | 49 | 7 | 0 |
| [M19 POR](#catalogo-m19-por) | Portal del socio y landing | 78 | 61 | 17 | 0 |
| [T01 PLA](#catalogo-t01-pla) | Plataforma SaaS | 52 | 49 | 3 | 0 |
| [T02 IAM](#catalogo-t02-iam) | Identidad, roles y auditoría | 56 | 54 | 2 | 0 |
| [T03 UXD](#catalogo-t03-uxd) | Experiencia, marca y diccionario | 68 | 62 | 6 | 0 |
| [T04 CFG](#catalogo-t04-cfg) | Configuración y parámetros maestros | 55 | 47 | 8 | 0 |
| [T05 DAT](#catalogo-t05-dat) | Modelo de datos | 12 | 12 | 0 | 0 |
| [T06 INT](#catalogo-t06-int) | Integraciones | 65 | 61 | 4 | 0 |
| [T07 MIG](#catalogo-t07-mig) | Migración desde ProCoop | 55 | 42 | 13 | 0 |
| [T08 NFR](#catalogo-t08-nfr) | No funcionales y seguridad | 27 | 21 | 6 | 0 |
| [T09 COM](#catalogo-t09-com) | Comunidad y comunicaciones | 63 | 51 | 12 | 0 |
| [T10 BIA](#catalogo-t10-bia) | Reportes, BI y APIs | 57 | 52 | 5 | 0 |
| [T11 WFL](#catalogo-t11-wfl) | Workflow, eventos y documentos | 57 | 56 | 1 | 0 |
| **Total** | | **2665** | **2271** | **374** | **20** |

### 2.2 Por estado

| Estado | Reglas | % |
|---|---:|---:|
| Adoptada | 2271 | 85,2 % |
| A validar | 374 | 14,0 % |
| Reemplazada | 18 | 0,7 % |
| Reemplazada (parcial) | 2 | 0,1 % |

### 2.3 Por tipo de decisión respecto de ProCoop

| Decisión | Reglas |
|---|---:|
| Replicar | 1068 |
| Mejorar | 644 |
| Adoptar | 350 |
| Reemplazar | 309 |
| Nuevo | 171 |
| Descartar | 46 |
| Delegar | 44 |
| Informado | 14 |
| Sin decisión propia (la columna dice "Reemplazado por") | 12 |
| Pendiente de decisión | 5 |
| Otra (ver anexo) | 2 |

### 2.4 Por ola

Las tablas RN de los anexos **no tienen columna de ola** (la ola figura en las tablas de requisitos RF). Como referencia, 13 reglas mencionan explícitamente una ola en su texto:

| Ola mencionada | Reglas |
|---|---:|
| O0 | 1 |
| O4 | 1 |
| O5 | 1 |
| O7 | 2 |
| O8 | 4 |
| O9 | 1 |
| O10 | 3 |

La ola de implementación de cada regla es la del requisito que la implementa (`03-plan-de-olas-y-prompts.md`).

## 3. Índice temático

Agrupado por dominio de negocio. Dentro de cada dominio se listan las secciones del anexo que contienen reglas, con la cantidad y el rango de IDs.

### Personas y cuentas (134)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M01](#catalogo-m01-per) | §6.1 Identidad y personas | 18 | RN-PER-001 … RN-PER-018 |
| [M01](#catalogo-m01-per) | §6.2 Contactos | 7 | RN-PER-019 … RN-PER-025 |
| [M01](#catalogo-m01-per) | §6.3 Titulares | 16 | RN-PER-026 … RN-PER-041 |
| [M01](#catalogo-m01-per) | §6.4 Cuentas | 17 | RN-PER-042 … RN-PER-058 |
| [M01](#catalogo-m01-per) | §6.5 Domicilios, inmuebles y puntos de prestación | 19 | RN-PER-059 … RN-PER-077 |
| [M01](#catalogo-m01-per) | §6.6 Relaciones, garantías y adherentes | 15 | RN-PER-078 … RN-PER-092 |
| [M01](#catalogo-m01-per) | §6.7 Notas, bloqueos y documentación | 7 | RN-PER-093 … RN-PER-099 |
| [M01](#catalogo-m01-per) | §6.8 Transferencias y cambio de titularidad | 11 | RN-PER-100 … RN-PER-110 |
| [M01](#catalogo-m01-per) | §6.9 Historia, duplicados, corrección y eliminación | 7 | RN-PER-111 … RN-PER-117 |
| [M01](#catalogo-m01-per) | §6.10 Vínculo usuario–persona y portal | 4 | RN-PER-118 … RN-PER-121 |
| [M01](#catalogo-m01-per) | §6.11 Reglas de otros módulos que PER solo alimenta (referencia RN-06 §3–§9) | 13 | RN-PER-122 … RN-PER-134 |

### Catálogo y contratos (79)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M02](#catalogo-m02-cat) | §6 Reglas de negocio | 79 | RN-CAT-001 … RN-CAT-079 |

### Medición (126)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M03](#catalogo-m03-med) | §6.1 Medidores e instalaciones | 22 | RN-MED-001 … RN-MED-022 |
| [M03](#catalogo-m03-med) | §6.2 Rutas, lotes y tareas | 24 | RN-MED-023 … RN-MED-046 |
| [M03](#catalogo-m03-med) | §6.3 Captura y validación de lecturas | 18 | RN-MED-047 … RN-MED-064 |
| [M03](#catalogo-m03-med) | §6.4 Cálculo, validación y aprobación de consumos | 19 | RN-MED-065 … RN-MED-083 |
| [M03](#catalogo-m03-med) | §6.5 Estimación y regularización | 7 | RN-MED-084 … RN-MED-090 |
| [M03](#catalogo-m03-med) | §6.6 División, prorrateo, distribución | 10 | RN-MED-091 … RN-MED-100 |
| [M03](#catalogo-m03-med) | §6.7 Demanda y transgresiones | 3 | RN-MED-101 … RN-MED-103 |
| [M03](#catalogo-m03-med) | §6.8 Telemedición, prepago y generación distribuida | 15 | RN-MED-104 … RN-MED-118 |
| [M03](#catalogo-m03-med) | §6.9 Medición propia, cambio de clase y transversales | 8 | RN-MED-119 … RN-MED-126 |

### Tarifas (251)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M04](#catalogo-m04-tar) | §6.1 Orquestación y entrada del cálculo (RN-01 §1) | 11 | RN-TAR-001 … RN-TAR-011 |
| [M04](#catalogo-m04-tar) | §6.2 Tipos de cálculo y selección de consumos (RN-01 §2) | 6 | RN-TAR-012 … RN-TAR-017 |
| [M04](#catalogo-m04-tar) | §6.3 Cargo fijo (RN-01 §3) | 8 | RN-TAR-018 … RN-TAR-025 |
| [M04](#catalogo-m04-tar) | §6.4 Servicios medidos: tramos, escalones, factores, mínimos, inyectada, bonificación y prepaga (RN-01 §4) | 18 | RN-TAR-026 … RN-TAR-043 |
| [M04](#catalogo-m04-tar) | §6.5 Servicios fijos, por cantidad y proporcionales (RN-01 §5) | 5 | RN-TAR-044 … RN-TAR-048 |
| [M04](#catalogo-m04-tar) | §6.6 Prorrateo entre versiones tarifarias (RN-01 §6.1–6.3) | 10 | RN-TAR-049 … RN-TAR-058 |
| [M04](#catalogo-m04-tar) | §6.7 Versiones de cuadros y herramientas de copia (RN-01 §6.4) | 11 | RN-TAR-059 … RN-TAR-069 |
| [M04](#catalogo-m04-tar) | §6.8 Cuotas de obras y vivienda (RN-01 §7) | 7 | RN-TAR-070 … RN-TAR-076 |
| [M04](#catalogo-m04-tar) | §6.9 Agua según inmueble (RN-01 §8) | 1 | RN-TAR-077 |
| [M04](#catalogo-m04-tar) | §6.10 Servicios con adherentes (RN-01 §9) | 4 | RN-TAR-078 … RN-TAR-081 |
| [M04](#catalogo-m04-tar) | §6.11 Telefonía: tasación y facturación de llamadas (RN-01 §10; RN-07 §8) | 19 | RN-TAR-082 … RN-TAR-100 |
| [M04](#catalogo-m04-tar) | §6.12 Grandes consumos: energía por banda, demanda y factor de potencia (RN-01 §11; RN-06 §17) | 15 | RN-TAR-101 … RN-TAR-115 |
| [M04](#catalogo-m04-tar) | §6.13 Reglas (cargos adicionales) y fórmulas (RN-01 §12) | 40 | RN-TAR-116 … RN-TAR-155 |
| [M04](#catalogo-m04-tar) | §6.14 Franqueo, anticipos, redondeo y medidor testigo (RN-01 §13–§16) | 10 | RN-TAR-156 … RN-TAR-165 |
| [M04](#catalogo-m04-tar) | §6.15 IVA, percepciones, IIBB y otros tributos en el cálculo (RN-01 §17) | 6 | RN-TAR-166 … RN-TAR-171 |
| [M04](#catalogo-m04-tar) | §6.16 Bonificaciones, subsidios y tarifa social (RN-01 §18; FIC 7; BASE §51–52) | 2 | RN-TAR-172 … RN-TAR-173 |
| [M04](#catalogo-m04-tar) | §6.17 Validaciones y errores (RN-01 §19) | 2 | RN-TAR-174 … RN-TAR-175 |
| [M04](#catalogo-m04-tar) | §6.18 Reglas de clases auxiliares (RN-01 §23) | 20 | RN-TAR-176 … RN-TAR-195 |
| [M04](#catalogo-m04-tar) | §6.19 División, distribución y consumos de terceros que afectan el cálculo (RN-06 §16, §18) | 3 | RN-TAR-196 … RN-TAR-198 |
| [M04](#catalogo-m04-tar) | §6.20 Reglas de BASE y AGR (requisitos del solicitante y propuestas adoptadas) | 41 | RN-TAR-199 … RN-TAR-239 |
| [M04](#catalogo-m04-tar) | §6.21 Piloto Internet: abono, instalación, promociones y cambios (BASE §39.3, §72, §86) | 12 | RN-TAR-240 … RN-TAR-251 |

### Facturación (161)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M05](#catalogo-m05-fac) | §6.1 Configuración, universo y selección | 33 | RN-FAC-001 … RN-FAC-160 |
| [M05](#catalogo-m05-fac) | §6.2 Simulación, armado y emisión | 28 | RN-FAC-031 … RN-FAC-154 |
| [M05](#catalogo-m05-fac) | §6.3 Vencimientos y recargos entre vencimientos | 12 | RN-FAC-058 … RN-FAC-069 |
| [M05](#catalogo-m05-fac) | §6.4 Bloqueo | 4 | RN-FAC-070 … RN-FAC-073 |
| [M05](#catalogo-m05-fac) | §6.5 Anulación, NC, ND y reversión | 21 | RN-FAC-074 … RN-FAC-094 |
| [M05](#catalogo-m05-fac) | §6.6 Recategorización, retroactivos y modificación masiva | 16 | RN-FAC-095 … RN-FAC-110 |
| [M05](#catalogo-m05-fac) | §6.7 Cuotas, terceros e importaciones | 9 | RN-FAC-111 … RN-FAC-161 |
| [M05](#catalogo-m05-fac) | §6.8 Impresión, talones y código de barras | 17 | RN-FAC-116 … RN-FAC-132 |
| [M05](#catalogo-m05-fac) | §6.9 Modalidad, grupos, ciclo y cierre | 11 | RN-FAC-133 … RN-FAC-143 |
| [M05](#catalogo-m05-fac) | §6.10 Reglas transversales | 10 | RN-FAC-144 … RN-FAC-153 |

### Fiscal (132)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M06](#catalogo-m06-fis) | §6.1 Modos, autenticación y credenciales (RN-03 §1–§2) | 13 | RN-FIS-001 … RN-FIS-013 |
| [M06](#catalogo-m06-fis) | §6.2 Cola y autorización CAE (RN-03 §3) | 39 | RN-FIS-014 … RN-FIS-052 |
| [M06](#catalogo-m06-fis) | §6.3 CAEA, CAI y CESP (RN-03 §4) | 12 | RN-FIS-053 … RN-FIS-064 |
| [M06](#catalogo-m06-fis) | §6.4 Padrón y condición IVA (RN-03 §5, §7, §12.1) | 8 | RN-FIS-065 … RN-FIS-072 |
| [M06](#catalogo-m06-fis) | §6.5 IVA, percepciones e IIBB en el cálculo (RN-01 §17) | 13 | RN-FIS-073 … RN-FIS-085 |
| [M06](#catalogo-m06-fis) | §6.6 Libro IVA, Libro IVA Digital y Mis Comprobantes (RN-03 §8–§9, §12.5–§12.6) | 17 | RN-FIS-086 … RN-FIS-102 |
| [M06](#catalogo-m06-fis) | §6.7 Regímenes, exportadores, terceros, reguladores y otros | 30 | RN-FIS-103 … RN-FIS-132 |

### Cobranza (157)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M07](#catalogo-m07-cob) | §6.1 Invariantes monetarias y auxiliar | 13 | RN-COB-001 … RN-COB-013 |
| [M07](#catalogo-m07-cob) | §6.2 Cuentas, resumen y mínimo | 13 | RN-COB-014 … RN-COB-157 |
| [M07](#catalogo-m07-cob) | §6.3 Imputación | 17 | RN-COB-020 … RN-COB-036 |
| [M07](#catalogo-m07-cob) | §6.4 Saldos a favor, anticipos y no identificados | 9 | RN-COB-037 … RN-COB-045 |
| [M07](#catalogo-m07-cob) | §6.5 Caja | 27 | RN-COB-046 … RN-COB-072 |
| [M07](#catalogo-m07-cob) | §6.6 Anulación de cobros | 6 | RN-COB-073 … RN-COB-078 |
| [M07](#catalogo-m07-cob) | §6.7 Entes recaudadores | 22 | RN-COB-079 … RN-COB-100 |
| [M07](#catalogo-m07-cob) | §6.8 Débito automático | 9 | RN-COB-101 … RN-COB-109 |
| [M07](#catalogo-m07-cob) | §6.9 Pasarelas e intenciones de pago | 21 | RN-COB-110 … RN-COB-130 |
| [M07](#catalogo-m07-cob) | §6.10 Devoluciones, contracargos y conciliación | 8 | RN-COB-131 … RN-COB-138 |
| [M07](#catalogo-m07-cob) | §6.11 Cobradores y terceros | 5 | RN-COB-139 … RN-COB-143 |
| [M07](#catalogo-m07-cob) | §6.12 Transición desde ProCoop (formatos de la base relevada LAG) | 7 | RN-COB-144 … RN-COB-150 |

### Mora y corte (147)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M08](#catalogo-m08-mor) | §6.1 Motor de interés y recargo al cobrar | 27 | RN-MOR-001 … RN-MOR-027 |
| [M08](#catalogo-m08-mor) | §6.2 Recargo entre vencimientos al emitir | 9 | RN-MOR-028 … RN-MOR-036 |
| [M08](#catalogo-m08-mor) | §6.3 Diferimiento y documentación | 4 | RN-MOR-037 … RN-MOR-040 |
| [M08](#catalogo-m08-mor) | §6.4 Proceso masivo de intereses a facturar | 7 | RN-MOR-041 … RN-MOR-047 |
| [M08](#catalogo-m08-mor) | §6.5 Bloqueos y caja | 5 | RN-MOR-048 … RN-MOR-052 |
| [M08](#catalogo-m08-mor) | §6.6 Gestión de mora: candidatos, notificaciones, instancias | 24 | RN-MOR-053 … RN-MOR-076 |
| [M08](#catalogo-m08-mor) | §6.7 Tratamiento de morosos, corte y reconexión | 31 | RN-MOR-077 … RN-MOR-145 |
| [M08](#catalogo-m08-mor) | §6.8 Baja, suspensión y reactivación (BASE §53) | 6 | RN-MOR-099 … RN-MOR-104 |
| [M08](#catalogo-m08-mor) | §6.9 Financiación y convenios | 29 | RN-MOR-105 … RN-MOR-147 |
| [M08](#catalogo-m08-mor) | §6.10 Garantías, incobrables, gestión judicial y prescripción | 5 | RN-MOR-132 … RN-MOR-136 |

### Reclamos y técnica (213)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M09](#catalogo-m09-crm) | §6 Reglas de negocio | 97 | RN-CRM-001 … RN-CRM-097 |
| [M10](#catalogo-m10-tec) | §6 Reglas de negocio | 116 | RN-TEC-001 … RN-TEC-116 |

### Ventas (52)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M11](#catalogo-m11-ven) | §6 Reglas de negocio | 52 | RN-VEN-001 … RN-VEN-052 |

### Compras (75)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M12](#catalogo-m12-cmp) | §6 Reglas de negocio | 75 | RN-CMP-001 … RN-CMP-075 |

### Stock (78)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M13](#catalogo-m13-stk) | §6 Reglas de negocio | 78 | RN-STK-001 … RN-STK-078 |

### Tesorería (86)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M14](#catalogo-m14-tes) | §6 Reglas de negocio | 86 | RN-TES-001 … RN-TES-086 |

### Contabilidad (126)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M15](#catalogo-m15-con) | §6.1 Asientos, numeración y validaciones | 21 | RN-CON-001 … RN-CON-021 |
| [M15](#catalogo-m15-con) | §6.2 Resolución de cuentas e imputación automática | 20 | RN-CON-022 … RN-CON-041 |
| [M15](#catalogo-m15-con) | §6.3 Asientos por módulo (detalle de imputación; matriz completa en §9.1) | 34 | RN-CON-042 … RN-CON-126 |
| [M15](#catalogo-m15-con) | §6.4 Centros de costo | 10 | RN-CON-070 … RN-CON-079 |
| [M15](#catalogo-m15-con) | §6.5 Ejercicios, períodos y cierres | 7 | RN-CON-080 … RN-CON-086 |
| [M15](#catalogo-m15-con) | §6.6 Planes múltiples, simulaciones, saldo único | 7 | RN-CON-087 … RN-CON-093 |
| [M15](#catalogo-m15-con) | §6.7 Plan de cuentas, rubros, renumeración y unificación | 6 | RN-CON-094 … RN-CON-099 |
| [M15](#catalogo-m15-con) | §6.8 Ajuste por inflación, libros, presupuesto, capital | 6 | RN-CON-100 … RN-CON-105 |
| [M15](#catalogo-m15-con) | §6.9 Reglas transversales del motor y de los datos contables | 15 | RN-CON-106 … RN-CON-120 |

### Sueldos (95)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M16](#catalogo-m16-sue) | §6.1 Legajo y estructura | 15 | RN-SUE-001 … RN-SUE-015 |
| [M16](#catalogo-m16-sue) | §6.2 Conceptos, variables y fórmulas | 20 | RN-SUE-016 … RN-SUE-035 |
| [M16](#catalogo-m16-sue) | §6.3 Novedades, licencias y vacaciones | 17 | RN-SUE-036 … RN-SUE-052 |
| [M16](#catalogo-m16-sue) | §6.4 Liquidación, SAC, egreso | 16 | RN-SUE-053 … RN-SUE-068 |
| [M16](#catalogo-m16-sue) | §6.5 Ganancias y seguridad social | 12 | RN-SUE-069 … RN-SUE-080 |
| [M16](#catalogo-m16-sue) | §6.6 Recibos, firma, pago, contabilización e importación | 15 | RN-SUE-081 … RN-SUE-095 |

### Institucional (52)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M17](#catalogo-m17-ins) | §6 Reglas de negocio | 52 | RN-INS-001 … RN-INS-052 |

### Social (56)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M18](#catalogo-m18-soc) | §6 Reglas de negocio | 56 | RN-SOC-001 … RN-SOC-056 |

### Portal (78)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [M19](#catalogo-m19-por) | §6 Reglas de negocio | 78 | RN-POR-001 … RN-POR-078 |

### Plataforma, seguridad, configuración, datos, integraciones, migración, comunicaciones, BI y workflow (567)

| Anexo | Sección | Reglas | IDs |
|---|---|---:|---|
| [T01](#catalogo-t01-pla) | §6 Reglas de negocio | 52 | RN-PLA-001 … RN-PLA-052 |
| [T02](#catalogo-t02-iam) | §6 Reglas de negocio | 56 | RN-IAM-001 … RN-IAM-073 |
| [T03](#catalogo-t03-uxd) | §6 Reglas de negocio | 68 | RN-UXD-001 … RN-UXD-068 |
| [T04](#catalogo-t04-cfg) | §6 Reglas de negocio | 55 | RN-CFG-001 … RN-CFG-055 |
| [T05](#catalogo-t05-dat) | §6 Reglas de modelado | 12 | RN-DAT-001 … RN-DAT-012 |
| [T06](#catalogo-t06-int) | §6 Reglas de negocio | 65 | RN-INT-001 … RN-INT-065 |
| [T07](#catalogo-t07-mig) | §6 Reglas de negocio | 55 | RN-MIG-001 … RN-MIG-055 |
| [T08](#catalogo-t08-nfr) | §6 Reglas de negocio transversales | 27 | RN-NFR-001 … RN-NFR-027 |
| [T09](#catalogo-t09-com) | §6 Reglas de negocio | 63 | RN-COM-001 … RN-COM-063 |
| [T10](#catalogo-t10-bia) | §6 Reglas de negocio | 57 | RN-BIA-001 … RN-BIA-057 |
| [T11](#catalogo-t11-wfl) | §6.1 Eventos y jobs | 12 | RN-WFL-001 … RN-WFL-012 |
| [T11](#catalogo-t11-wfl) | §6.2 Operaciones | 8 | RN-WFL-020 … RN-WFL-027 |
| [T11](#catalogo-t11-wfl) | §6.3 Estados y workflow | 10 | RN-WFL-030 … RN-WFL-039 |
| [T11](#catalogo-t11-wfl) | §6.4 Aprobaciones | 12 | RN-WFL-040 … RN-WFL-051 |
| [T11](#catalogo-t11-wfl) | §6.5 Documentos, plantillas, numeración y firma | 15 | RN-WFL-060 … RN-WFL-074 |

## 4. Matriz de aplicabilidad por servicio

Cantidad de reglas que mencionan cada servicio vertical (una regla puede aplicar a varios). "Por texto" cuenta las detectadas en la fila de la regla; "Solo por T12" cuenta las que no mencionan el servicio en su texto pero que la ficha de T12 cita para ese servicio.

| Código | Servicio | Reglas | Por texto | Solo por T12 |
|---|---|---:|---:|---:|
| INT | Internet | 35 | 18 | 17 |
| TEL | Telefonía | 42 | 28 | 14 |
| TV | Televisión | 17 | 9 | 8 |
| ELE | Electricidad | 75 | 48 | 27 |
| AG | Agua | 29 | 14 | 15 |
| CLO | Cloacas | 17 | 9 | 8 |
| GAS | Gas | 33 | 27 | 6 |
| ALU | Alumbrado público | 10 | 5 | 5 |
| OBR | Pavimento y obras | 15 | 8 | 7 |
| SEP | Sepelio | 31 | 8 | 23 |
| CEM | Cementerio parque | 13 | 12 | 1 |
| SAN | Banco de sangre | 17 | 9 | 8 |
| SAL | Ambulancias y salud | 22 | 13 | 9 |
| VIV | Planes de vivienda | 28 | 18 | 10 |
| TAS | Tasas por cuenta de terceros | 17 | 11 | 6 |
| CAP | Capital social como concepto | 18 | 7 | 11 |
| OTR | Otras prestaciones | 8 | 5 | 3 |
| — | **Todos** (sin mención de servicio; transversales) | 2352 | | |

### 4.1 Servicios por anexo

Cantidad de reglas de cada anexo que mencionan cada servicio ("·" = ninguna).

| Anexo | INT | TEL | TV | ELE | AG | CLO | GAS | ALU | OBR | SEP | CEM | SAN | SAL | VIV | TAS | CAP | OTR | Todos |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M01 | 1 | 3 | · | 2 | 4 | 1 | 1 | · | · | · | · | 1 | 1 | 1 | · | 1 | · | 123 |
| M02 | 6 | 2 | 3 | 7 | 4 | 2 | 1 | 3 | 1 | · | · | 1 | · | 1 | 1 | · | · | 59 |
| M03 | 1 | 1 | 1 | 13 | 4 | · | 4 | · | · | · | · | · | · | · | · | · | · | 107 |
| M04 | 4 | 21 | 1 | 29 | 8 | 7 | 7 | 3 | 7 | 3 | 1 | · | 3 | 3 | 1 | · | · | 175 |
| M05 | · | 2 | 2 | 4 | 1 | 1 | 3 | · | · | 1 | 1 | · | · | 1 | · | · | 1 | 146 |
| M06 | · | · | · | 1 | · | · | 2 | 1 | · | · | 1 | · | · | · | 6 | 1 | 1 | 120 |
| M07 | 1 | · | · | 1 | 1 | · | 2 | · | 1 | · | · | · | · | · | 4 | · | · | 151 |
| M08 | 7 | 4 | 3 | 3 | 3 | 3 | 2 | 1 | 2 | 2 | 2 | 3 | 3 | 1 | 3 | 1 | 1 | 123 |
| M09 | 5 | 2 | 2 | 1 | 1 | 1 | 1 | · | · | 1 | · | 1 | 1 | · | · | · | · | 91 |
| M10 | 1 | 6 | · | 1 | 1 | 1 | 3 | · | 2 | · | · | · | · | 1 | · | · | · | 104 |
| M11 | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 52 |
| M12 | · | · | 2 | 2 | · | · | 2 | · | · | · | · | · | · | 1 | · | · | · | 71 |
| M13 | 2 | · | 1 | · | · | · | · | · | · | · | · | · | · | 1 | · | · | · | 75 |
| M14 | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 1 | · | 85 |
| M15 | 1 | · | 1 | 2 | · | · | 1 | 1 | 1 | 2 | 2 | · | · | 1 | · | 3 | 2 | 113 |
| M16 | · | · | · | · | · | · | · | · | · | · | · | · | 1 | · | · | · | · | 94 |
| M17 | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 11 | · | 41 |
| M18 | · | · | · | 1 | · | · | · | · | · | 19 | 6 | 7 | 6 | 16 | · | · | 3 | 9 |
| M19 | 1 | · | · | 2 | · | · | 1 | · | · | · | · | · | · | · | · | · | · | 75 |
| T01 | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 52 |
| T02 | · | · | · | · | · | · | · | · | · | · | · | 1 | 1 | · | · | · | · | 55 |
| T03 | · | · | · | 2 | · | · | · | · | · | · | · | · | · | · | · | · | · | 66 |
| T04 | · | · | · | · | · | · | 1 | · | · | · | · | · | · | · | · | · | · | 54 |
| T05 | 1 | · | · | · | · | · | · | · | · | · | · | · | 1 | · | · | · | · | 10 |
| T06 | 1 | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 64 |
| T07 | 3 | 1 | 1 | 4 | 1 | 1 | 2 | 1 | 1 | 1 | · | · | 1 | 1 | 2 | · | · | 40 |
| T08 | · | · | · | · | · | · | · | · | · | · | · | · | 2 | · | · | · | · | 25 |
| T09 | · | · | · | · | · | · | · | · | · | 2 | · | 1 | 1 | · | · | · | · | 61 |
| T10 | · | · | · | · | 1 | · | · | · | · | · | · | 1 | · | · | · | · | · | 55 |
| T11 | · | · | · | · | · | · | · | · | · | · | · | 1 | 1 | · | · | · | · | 56 |

### 4.2 Reglas por servicio

IDs de las reglas que aplican específicamente a cada servicio, además de las transversales ("Todos").

- **INT — Internet (35):** RN-PER-066, RN-CAT-010, RN-CAT-026, RN-CAT-030, RN-CAT-039, RN-CAT-061, RN-CAT-064, RN-MED-106, RN-TAR-012, RN-TAR-145, RN-TAR-230, RN-TAR-246, RN-COB-023, RN-MOR-083, RN-MOR-085, RN-MOR-092, RN-MOR-100, RN-MOR-101, RN-MOR-104, RN-MOR-137, RN-CRM-004, RN-CRM-006, RN-CRM-007, RN-CRM-008, RN-CRM-031, RN-TEC-077, RN-STK-014, RN-STK-018, RN-CON-036, RN-POR-014, RN-DAT-010, RN-INT-040, RN-MIG-004, RN-MIG-013, RN-MIG-035
- **TEL — Telefonía (42):** RN-PER-020, RN-PER-105, RN-PER-130, RN-CAT-064, RN-CAT-075, RN-MED-022, RN-TAR-012, RN-TAR-082, RN-TAR-083, RN-TAR-084, RN-TAR-085, RN-TAR-086, RN-TAR-087, RN-TAR-088, RN-TAR-089, RN-TAR-090, RN-TAR-091, RN-TAR-092, RN-TAR-093, RN-TAR-094, RN-TAR-095, RN-TAR-096, RN-TAR-097, RN-TAR-098, RN-TAR-099, RN-TAR-142, RN-TAR-236, RN-FAC-088, RN-FAC-116, RN-MOR-055, RN-MOR-082, RN-MOR-083, RN-MOR-137, RN-CRM-007, RN-CRM-008, RN-TEC-017, RN-TEC-096, RN-TEC-100, RN-TEC-103, RN-TEC-105, RN-TEC-113, RN-MIG-005
- **TV — Televisión (17):** RN-CAT-061, RN-CAT-064, RN-CAT-079, RN-MED-106, RN-TAR-012, RN-FAC-125, RN-FAC-160, RN-MOR-082, RN-MOR-101, RN-MOR-138, RN-CRM-007, RN-CRM-008, RN-CMP-074, RN-CMP-075, RN-STK-018, RN-CON-121, RN-MIG-035
- **ELE — Electricidad (75):** RN-PER-017, RN-PER-062, RN-CAT-016, RN-CAT-028, RN-CAT-029, RN-CAT-039, RN-CAT-042, RN-CAT-064, RN-CAT-076, RN-MED-003, RN-MED-012, RN-MED-017, RN-MED-050, RN-MED-072, RN-MED-078, RN-MED-089, RN-MED-101, RN-MED-110, RN-MED-117, RN-MED-118, RN-MED-120, RN-MED-121, RN-TAR-012, RN-TAR-026, RN-TAR-032, RN-TAR-038, RN-TAR-043, RN-TAR-067, RN-TAR-101, RN-TAR-102, RN-TAR-103, RN-TAR-104, RN-TAR-105, RN-TAR-106, RN-TAR-107, RN-TAR-108, RN-TAR-109, RN-TAR-110, RN-TAR-111, RN-TAR-112, RN-TAR-113, RN-TAR-114, RN-TAR-115, RN-TAR-165, RN-TAR-172, RN-TAR-178, RN-TAR-198, RN-TAR-227, RN-TAR-229, RN-TAR-231, RN-TAR-232, RN-FAC-039, RN-FAC-095, RN-FAC-096, RN-FAC-154, RN-FIS-117, RN-COB-023, RN-MOR-025, RN-MOR-084, RN-MOR-145, RN-CRM-007, RN-TEC-114, RN-CMP-073, RN-CMP-074, RN-CON-069, RN-CON-121, RN-SOC-016, RN-POR-034, RN-POR-042, RN-UXD-030, RN-UXD-067, RN-MIG-018, RN-MIG-020, RN-MIG-021, RN-MIG-022
- **AG — Agua (29):** RN-PER-062, RN-PER-072, RN-PER-073, RN-PER-074, RN-CAT-039, RN-CAT-064, RN-CAT-073, RN-CAT-078, RN-MED-017, RN-MED-076, RN-MED-078, RN-MED-090, RN-TAR-012, RN-TAR-015, RN-TAR-070, RN-TAR-076, RN-TAR-228, RN-TAR-229, RN-TAR-247, RN-TAR-250, RN-FAC-158, RN-COB-144, RN-MOR-082, RN-MOR-085, RN-MOR-139, RN-CRM-007, RN-TEC-093, RN-MIG-018, RN-BIA-033
- **CLO — Cloacas (17):** RN-PER-074, RN-CAT-039, RN-CAT-074, RN-TAR-012, RN-TAR-015, RN-TAR-070, RN-TAR-074, RN-TAR-076, RN-TAR-228, RN-TAR-247, RN-FAC-155, RN-MOR-082, RN-MOR-092, RN-MOR-140, RN-CRM-007, RN-TEC-093, RN-MIG-020
- **GAS — Gas (33):** RN-PER-133, RN-CAT-039, RN-MED-017, RN-MED-069, RN-MED-070, RN-MED-076, RN-TAR-012, RN-TAR-035, RN-TAR-036, RN-TAR-041, RN-TAR-174, RN-TAR-179, RN-TAR-229, RN-FAC-097, RN-FAC-098, RN-FAC-114, RN-FIS-114, RN-FIS-115, RN-COB-144, RN-COB-146, RN-MOR-082, RN-MOR-086, RN-CRM-007, RN-TEC-093, RN-TEC-114, RN-TEC-116, RN-CMP-073, RN-CMP-074, RN-CON-121, RN-POR-042, RN-CFG-016, RN-MIG-020, RN-MIG-034
- **ALU — Alumbrado público (10):** RN-CAT-035, RN-CAT-036, RN-CAT-076, RN-TAR-012, RN-TAR-070, RN-TAR-073, RN-FIS-129, RN-MOR-141, RN-CON-066, RN-MIG-020
- **OBR — Pavimento y obras (15):** RN-CAT-072, RN-TAR-005, RN-TAR-070, RN-TAR-071, RN-TAR-072, RN-TAR-073, RN-TAR-074, RN-TAR-076, RN-COB-025, RN-MOR-082, RN-MOR-146, RN-TEC-093, RN-TEC-115, RN-CON-033, RN-MIG-053
- **SEP — Sepelio (31):** RN-TAR-078, RN-TAR-079, RN-TAR-081, RN-FAC-156, RN-MOR-082, RN-MOR-143, RN-CRM-088, RN-CON-122, RN-CON-126, RN-SOC-001, RN-SOC-002, RN-SOC-004, RN-SOC-005, RN-SOC-007, RN-SOC-008, RN-SOC-010, RN-SOC-011, RN-SOC-013, RN-SOC-015, RN-SOC-016, RN-SOC-017, RN-SOC-018, RN-SOC-020, RN-SOC-021, RN-SOC-022, RN-SOC-053, RN-SOC-054, RN-SOC-056, RN-MIG-054, RN-COM-036, RN-COM-059
- **CEM — Cementerio parque (13):** RN-TAR-248, RN-FAC-156, RN-FIS-125, RN-MOR-082, RN-MOR-087, RN-CON-124, RN-CON-126, RN-SOC-023, RN-SOC-024, RN-SOC-025, RN-SOC-026, RN-SOC-027, RN-SOC-056
- **SAN — Banco de sangre (17):** RN-PER-017, RN-CAT-077, RN-MOR-082, RN-MOR-088, RN-MOR-144, RN-CRM-088, RN-SOC-011, RN-SOC-020, RN-SOC-022, RN-SOC-028, RN-SOC-029, RN-SOC-053, RN-SOC-055, RN-IAM-063, RN-COM-059, RN-BIA-016, RN-WFL-073
- **SAL — Ambulancias y salud (22):** RN-PER-017, RN-TAR-078, RN-TAR-081, RN-TAR-249, RN-MOR-082, RN-MOR-139, RN-MOR-143, RN-CRM-088, RN-SUE-093, RN-SOC-020, RN-SOC-021, RN-SOC-022, RN-SOC-030, RN-SOC-031, RN-SOC-050, RN-IAM-063, RN-DAT-009, RN-MIG-038, RN-NFR-010, RN-NFR-019, RN-COM-059, RN-WFL-073
- **VIV — Planes de vivienda (28):** RN-PER-105, RN-CAT-072, RN-TAR-070, RN-TAR-075, RN-TAR-183, RN-FAC-085, RN-MOR-082, RN-TEC-015, RN-CMP-040, RN-STK-026, RN-CON-055, RN-SOC-032, RN-SOC-033, RN-SOC-035, RN-SOC-036, RN-SOC-037, RN-SOC-038, RN-SOC-039, RN-SOC-040, RN-SOC-041, RN-SOC-042, RN-SOC-043, RN-SOC-044, RN-SOC-045, RN-SOC-046, RN-SOC-047, RN-SOC-056, RN-MIG-052
- **TAS — Tasas por cuenta de terceros (17):** RN-CAT-076, RN-TAR-170, RN-FIS-081, RN-FIS-082, RN-FIS-114, RN-FIS-121, RN-FIS-126, RN-FIS-127, RN-COB-023, RN-COB-025, RN-COB-073, RN-COB-142, RN-MOR-082, RN-MOR-141, RN-MOR-142, RN-MIG-051, RN-MIG-055
- **CAP — Capital social como concepto (18):** RN-PER-129, RN-FIS-124, RN-MOR-114, RN-TES-020, RN-CON-028, RN-CON-053, RN-CON-104, RN-INS-012, RN-INS-013, RN-INS-014, RN-INS-015, RN-INS-017, RN-INS-018, RN-INS-019, RN-INS-021, RN-INS-023, RN-INS-024, RN-INS-028
- **OTR — Otras prestaciones (8):** RN-FAC-156, RN-FIS-128, RN-MOR-082, RN-CON-123, RN-CON-126, RN-SOC-051, RN-SOC-052, RN-SOC-056

## 5. Catálogo completo

Una tabla por anexo, ordenada por ID. Están incluidas todas las reglas definidas en los anexos.

<a id="catalogo-m01-per"></a>

### M01 PER — Personas, titulares y cuentas (134 reglas)

Fuente: [`M01-PER-personas-titulares-cuentas.md`](../especificacion/anexos/M01-PER-personas-titulares-cuentas.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-PER-001 | Dentro de un tenant, una persona se registra una sola vez y se reutiliza en todos sus roles, servicios, cuentas e inmuebles. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-002 | Cada cooperativa tiene su padrón propio; una coincidencia de nombre, documento o correo entre cooperativas no autoriza consultar ni fusionar registros. | Todos | Adoptada · Reemplazar | M01 §6.1 |
| RN-PER-003 | Persona, titular, asociado, empleado, usuario de acceso, pagador, ocupante, propietario, representante, beneficiario y adherente son roles distintos; ninguno implica otro. | Todos | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-004 | Ser asociado no activa una prestación; dar de baja un servicio no produce egreso de asociado ni devolución de capital. | Todos | Adoptada · Adoptar | M01 §6.1 |
| RN-PER-005 | Unicidad de identificación por tipo y número dentro del tenant, con excepción solo por política y aprobación. | Todos | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-006 | DNI y CUIT/CUIL de una misma persona se relacionan solo con verificación; no se presume equivalencia. | Todos | A validar · Mejorar | M01 §6.1 |
| RN-PER-007 | El CUIT/CUIL debe tener 11 dígitos, prefijo válido (20, 23, 24, 27 para personas humanas; 30, 33, 34 para jurídicas) y dígito verificador módulo 11 con pesos 5-4-3-2-7-6-5-4-3-2; si el resto da 10 se… | Todos | A validar · Mejorar | M01 §6.1 |
| RN-PER-008 | La CUIT es obligatoria cuando la condición IVA de la cuenta la requiere; se exige al habilitar la contratación efectiva o la emisión, no al registrarse. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-009 | La verificación contra el padrón de ARCA produce un resultado tipado (coincide, discrepa, inexistente, no disponible) y no cambia datos automáticamente; una discrepancia advierte o bloquea según… | Todos | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-010 | El tipo de documento se interpreta por su código ARCA: 96 DNI, 86 CUIL, 80 CUIT. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-011 | Buscar por DNI también encuentra a quien tiene ese DNI dentro de su CUIL/CUIT (posiciones 3 a 10). | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-012 | El tipo de documento propuesto depende de si la persona es física o jurídica. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-013 | Si la política lo exige, una persona debe tener fecha de nacimiento o fecha de alta. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-014 | Registrar el fallecimiento fija la fecha, da de baja las adhesiones y beneficios de la persona (y la adhesión completa del contrato si era su único adherente), lo anota y genera tareas: baja del… | Todos | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-015 | Los adherentes y beneficiarios fallecidos no se reconectan. | Todos | Adoptada · Replicar | M01 §6.1 |
| RN-PER-016 | Reconectar servicios de un titular fallecido requiere política habilitante. | Todos | Adoptada · Delegar | M01 §6.1 |
| RN-PER-017 | Los datos sensibles (salud, electrodependencia, aptitud de donante) se guardan aparte, con acceso restringido, sin uso en BI general ni en el muro. | ELE, SAN, SAL | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-018 | La edad se calcula a la fecha de referencia de cada regla (hoy, fecha de lectura, fecha de proceso); sin fecha de nacimiento la regla de edad no se evalúa y se informa. | Todos | Adoptada · Mejorar | M01 §6.1 |
| RN-PER-019 | La exigencia de celular y correo tiene tres niveles (no controlar, advertir, exigir) y dos momentos (en el alta, siempre), por persona y por cuenta. | Todos | Adoptada · Replicar | M01 §6.2 |
| RN-PER-020 | Si la cuenta no tiene teléfono o correo, se usan los de la persona y luego los cargados en el portal, según el orden de prioridad configurado. | TEL | Adoptada · Mejorar | M01 §6.2 |
| RN-PER-021 | El destino de SMS/WhatsApp se elige así: con "usar celular de la cuenta", el celular de la cuenta; si no, prioridad 0 = portal, luego celular, luego fax; 1 = fax y luego celular; 2 = ambos. Para… | Todos | Adoptada · Replicar | M01 §6.2 |
| RN-PER-022 | Los teléfonos se guardan normalizados (E.164) y se validan como móviles o fijos. | Todos | Adoptada · Mejorar | M01 §6.2 |
| RN-PER-023 | Un contacto cargado desde el portal no se sobrescribe con uno del backoffice si la política de conservación está activa. | Todos | Adoptada · Replicar | M01 §6.2 |
| RN-PER-024 | Si la vía de ingreso exige validar celular o correo, el contacto queda verificado solo tras el código. | Todos | Adoptada · Replicar | M01 §6.2 |
| RN-PER-025 | En el portal puede exigirse teléfono y correo al titular y pedir confirmarlos en cada ingreso. | Todos | Adoptada · Replicar | M01 §6.2 |
| RN-PER-026 | El número de titular sale de una secuencia transaccional del tenant; nunca de MAX+1. | Todos | A validar · Reemplazar | M01 §6.3 |
| RN-PER-027 | Con series separadas, asociados y no asociados numeran en series distintas; el dado de baja que conserva número cuenta como activo. | Todos | Reemplazada (parcial) | M01 §6.3 |
| RN-PER-028 | El número visible del titular es único; puede cargarse a mano si la política lo permite. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-029 | Un titular con cuentas tiene exactamente una cuenta principal. Excepciones configurables: durante una transferencia al agregar titular, y para titulares no asociados (sin cuenta principal, distrito… | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-030 | Un titular activo debe tener al menos una cuenta, salvo en estado "solicitante". | Todos | A validar · Replicar | M01 §6.3 |
| RN-PER-031 | No se da de baja a un titular con contratos activos, salvo política. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-032 | No se da de baja a un titular con capital integrado si la política lo impide; PER consulta a M17. | Todos | Adoptada · Delegar | M01 §6.3 |
| RN-PER-033 | La baja registra fecha efectiva, causa del catálogo, detalle y si conserva el número. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-034 | Puede darse de baja a un titular sin cuentas si la política lo permite. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-035 | Antes de una baja o transferencia se informa si la persona es adherente, beneficiaria o garante en otras cuentas. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-036 | Según política, un titular no asociado no puede tener contratos. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-037 | Según política, a un titular dado de baja no se le factura. | Todos | Adoptada · Delegar | M01 §6.3 |
| RN-PER-038 | Según política, los titulares nuevos se cargan como no asociados por defecto. | Todos | Adoptada · Replicar | M01 §6.3 |
| RN-PER-039 | Recuperar un titular dado de baja es una reactivación explícita con motivo, que agrega un período nuevo; no borra la baja. | Todos | Adoptada · Reemplazar | M01 §6.3 |
| RN-PER-040 | Las observaciones del titular son notas con historial; no un campo de texto que se recorta. | Todos | Adoptada · Descartar | M01 §6.3 |
| RN-PER-041 | Cambiar el número visible de un titular o cuenta no cambia identificadores internos ni referencias; queda auditado y aprobado. | Todos | Adoptada · Reemplazar | M01 §6.3 |
| RN-PER-042 | Una cuenta pertenece a un único titular; no agrupa contratos de distintos titulares, CUIT o DNI. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-043 | Una cuenta nueva toma la fecha de hoy como alta (o la fecha efectiva indicada) y deja el evento en la historia. | Todos | Adoptada · Mejorar | M01 §6.4 |
| RN-PER-044 | La condición IVA de una operación es la de la cuenta; sin cuenta, Consumidor Final. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-045 | El número de cuenta sale de una secuencia del tenant. | Todos | Adoptada · Reemplazar | M01 §6.4 |
| RN-PER-046 | Al transferir una cuenta se advierte si cambia la situación de IIBB. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-047 | La situación de IIBB por defecto de una cuenta nueva sale de la configuración; las cuentas "no resetear" no cambian en la reasignación masiva. | Todos | Adoptada · Delegar | M01 §6.4 |
| RN-PER-048 | Quitar la factura electrónica de una cuenta cuyo servicio lo exige requiere confirmación; puede marcarse automáticamente al alta. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-049 | La exclusión de débito automático por tipo de comprobante es de M07. | Todos | Adoptada · Delegar | M01 §6.4 |
| RN-PER-050 | La marca "no facturar" puede aplicarse a la cuenta o a un contrato; marcar un contrato desmarca la marca de cuenta; cada marca y desmarca guarda usuario y fecha. Solo un contrato por cuenta puede… | Todos | A validar · Mejorar | M01 §6.4 |
| RN-PER-051 | La importación de marcas de facturación interpreta "SI" como facturar. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-052 | El alta de cuenta puede exigir zona, conjunto, distrito y sección (en la principal), grupo contable y empresa postal. | Todos | A validar · Replicar | M01 §6.4 |
| RN-PER-053 | Al ingresar una sección, el distrito puede completarse automáticamente. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-054 | El número de ficha es correlativo por tenant. | Todos | Adoptada · Reemplazar | M01 §6.4 |
| RN-PER-055 | Los contratos de la cuenta se ordenan por grupo de facturación e identificador; puede mostrarse la observación del contrato y desagruparse. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-056 | La ficha indica si la cuenta tiene contratos en más de un grupo de facturación. | Todos | Adoptada · Replicar | M01 §6.4 |
| RN-PER-057 | Todo contrato pertenece a un grupo de facturación válido de su propia cuenta; el grupo por defecto sale de la configuración del servicio; la emisión masiva produce un comprobante por cuenta y grupo. | Todos | Adoptada · Delegar | M01 §6.4 |
| RN-PER-058 | La marca "no cobrar recargo" de una cuenta puede requerir autorización. | Todos | Adoptada · Delegar | M01 §6.4 |
| RN-PER-059 | Un domicilio completo tiene calle, número, localidad, provincia y código postal; se admiten "sin número" y domicilios rurales con referencias, marcados como tales. | Todos | Adoptada · Mejorar | M01 §6.5 |
| RN-PER-060 | No existe unicidad por domicilio + servicio; un domicilio puede tener varios contratos del mismo servicio con titulares distintos. | Todos | A validar · Replicar | M01 §6.5 |
| RN-PER-061 | Compartir domicilio no autoriza mostrar facturas ni gestiones ajenas, agrupar deuda entre personas ni cortar otra conexión. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-062 | Al dar de alta o cambiar de titular en un domicilio o inmueble con deuda de otras cuentas (mismo domicilio o misma nomenclatura catastral), se advierte sin revelar a terceros el detalle; el bloqueo… | ELE, AG | Adoptada · Mejorar | M01 §6.5 |
| RN-PER-063 | El punto de prestación es distinto del domicilio personal, fiscal y postal. Copiar el domicilio de la cuenta a sus contratos solo ocurre por acción explícita o política. | Todos | Adoptada · Replicar | M01 §6.5 |
| RN-PER-064 | El traslado técnico se ejecuta al cerrar la OT: el punto toma el domicilio nuevo de la OT; si la OT lo indica, también cambia el domicilio de las personas adherentes. | Todos | Adoptada · Replicar | M01 §6.5 |
| RN-PER-065 | El domicilio de impresión se arma con el formato configurado (piso, departamento, barrio, código postal). | Todos | Adoptada · Replicar | M01 §6.5 |
| RN-PER-066 | Geocodificar no certifica cobertura técnica, existencia del inmueble, titularidad ni disponibilidad; la posición del dispositivo no es automáticamente el domicilio contratado. | INT | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-067 | El punto tiene estado confirmado, aproximado, pendiente, para revisar o no disponible; no se muestra precisión que no existe ni se inventan coordenadas. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-068 | Confirmar o corregir el punto requiere permiso y registra fuente, momento, actor y motivo; la versión anterior se conserva. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-069 | Si no aparece la calle, se conserva el texto y las referencias y se permite marcar el punto para revisión; nunca se completa con una calle homónima ni con coordenadas inventadas. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-070 | Ante caída o límite del proveedor geográfico, el formulario se guarda y el enriquecimiento queda pendiente. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-071 | No se descarga masivamente la base de calles de Google ni se guarda cualquier resultado sin revisar los términos; el catálogo geográfico compartido está separado de los domicilios privados del tenant. | Todos | Adoptada · Adoptar | M01 §6.5 |
| RN-PER-072 | La nomenclatura catastral tiene seis partes; cada parte vacía vale "0"; las etiquetas por defecto son Cod/Sec/Man/Par/PH/Lote y pueden configurarse, igual que el modo numérico. | AG | Adoptada · Replicar | M01 §6.5 |
| RN-PER-073 | La designación catastral de un contrato debe existir en inmuebles; la búsqueda de coincidencia es por igualdad normalizada (la búsqueda parcial queda solo para el buscador). | AG | Adoptada · Mejorar | M01 §6.5 |
| RN-PER-074 | El inmueble es obligatorio para los servicios que lo exigen; con la política "solicitar siempre propiedades en el alta", el inmueble se pide al alta y no se cambia en la OT. | AG, CLO | Adoptada · Delegar | M01 §6.5 |
| RN-PER-075 | Editar la nomenclatura de un inmueble no exige copiarla a los contratos: los contratos referencian el inmueble y su historia. | Todos | Adoptada · Reemplazar | M01 §6.5 |
| RN-PER-076 | Un inmueble puede alojar varios contratos del mismo servicio; la autorización técnica (acometidas, unidades funcionales, medidores) se valida por servicio. | Todos | Adoptada · Delegar | M01 §6.5 |
| RN-PER-077 | El servicio puede restringirse a localidades habilitadas; la localidad del punto debe estar entre ellas. | Todos | Adoptada · Delegar | M01 §6.5 |
| RN-PER-078 | Toda gestión en nombre de un tercero exige una relación vigente que habilite esa acción, y registra quién actuó y por quién. | Todos | Adoptada · Adoptar | M01 §6.6 |
| RN-PER-079 | Un pago de tercero no transfiere titularidad ni da acceso a otros contratos del titular. | Todos | Adoptada · Adoptar | M01 §6.6 |
| RN-PER-080 | Revocar o vencer una relación retira el acceso futuro sin afectar lo ya actuado. | Todos | Adoptada · Adoptar | M01 §6.6 |
| RN-PER-081 | El garante se exige según el servicio (siempre bloquea en ProCoop), la cuenta (controlar o exigir) y el titular (exigir o validar). | Todos | A validar · Mejorar | M01 §6.6 |
| RN-PER-082 | **Reemplazado por RN-SOC-006 y RN-SOC-007** (M18, dueño único; HUECO-TRV-01). Texto original: Una persona no puede ser adherente activa del mismo servicio en dos contratos, salvo política; si la política… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-083 | **Reemplazado por RN-SOC-001 y RN-SOC-002** (M18, dueño único; HUECO-TRV-01). Texto original: La condición del adherente se evalúa contra la categoría: rango de edad, ocupaciones y vínculos admitidos; los… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-084 | **Reemplazado por RN-SOC-001 y RN-SOC-053 (lotes RF-SOC-015/016)** (M18, dueño único; HUECO-TRV-01). Texto original: La baja y el cambio de categoría de adherentes en lote quedan anotados con el usuario y… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-085 | **Reemplazado por RN-SOC-004** (M18, dueño único; HUECO-TRV-01). Texto original: Los adherentes que cumplen la mayoría de edad configurada (21 años por defecto) se listan y se avisan. | Todos | Reemplazada | M01 §6.6 |
| RN-PER-086 | **Reemplazado por RN-SOC-008 y RN-SOC-009** (M18, dueño único; HUECO-TRV-01). Texto original: Al desconectar o reconectar el contrato, sus adherentes y beneficiarios siguen el mismo estado (salvo… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-087 | **Reemplazado por RN-SOC-012** (M18, dueño único; HUECO-TRV-01). Texto original: En la ficha se ocultan por defecto los adherentes dados de baja por fallecimiento. | Todos | Reemplazada | M01 §6.6 |
| RN-PER-088 | **Reemplazado por RN-SOC-014** (M18, dueño único; HUECO-TRV-01). Texto original: La deuda de un adherente es la suma de saldos de las cuentas donde es titular o persona de la cuenta; puede controlarse al… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-089 | **Reemplazado por RN-SOC-003 (dato de edad para M04; el importe lo calcula M04)** (M18, dueño único; HUECO-TRV-01). Texto original: El importe de la tarifa del adherente se busca por ocupación y rango de… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-090 | **Reemplazado por RN-SOC-005** (M18, dueño único; HUECO-TRV-01). Texto original: Según política, el titular no necesita figurar como adherente. | Todos | Reemplazada | M01 §6.6 |
| RN-PER-091 | **Reemplazado por RN-SOC-013** (M18, dueño único; HUECO-TRV-01). Texto original: Al transferir un contrato, los adherentes y beneficiarios se copian dados de baja (histórico), se copian activos o se dan… | Todos | Reemplazada | M01 §6.6 |
| RN-PER-092 | Un garante, adherente o beneficiario que queda vinculado a una cuenta de baja se informa. | Todos | Adoptada · Replicar | M01 §6.6 |
| RN-PER-093 | Las notas se numeran sin colisiones y cada modificación conserva la versión anterior; el borrado es lógico con motivo. | Todos | Adoptada · Mejorar | M01 §6.7 |
| RN-PER-094 | Las notas automáticas del sistema no son editables ni borrables por el operador. | Todos | Adoptada · Mejorar | M01 §6.7 |
| RN-PER-095 | Un bloqueo declara uno o más efectos de una lista cerrada; cada módulo consulta el efecto que le importa antes de operar; un bloqueo sin efecto no es válido (es una nota). | Todos | Adoptada · Mejorar | M01 §6.7 |
| RN-PER-096 | Aplicar y levantar bloqueos registra causa de catálogo, autor, vigencia y motivo de levantamiento; vencido el plazo, se levanta solo. | Todos | Adoptada · Replicar | M01 §6.7 |
| RN-PER-097 | Un documento presentado está vencido si pasó su fecha de vencimiento o, sin ella, si fecha + días del requisito es anterior a hoy, y no existe otro vigente del mismo tipo para la misma entidad. | Todos | Adoptada · Replicar | M01 §6.7 |
| RN-PER-098 | Las acciones al alta o al vencimiento de un documento son acciones tipadas del catálogo (crear tarea, aplicar o levantar bloqueo, quitar o dar beneficio, notificar); un error en una acción se… | Todos | A validar · Reemplazar | M01 §6.7 |
| RN-PER-099 | Un adjunto hereda los permisos de la entidad a la que se vincula; adjuntos de socio, persona, cuenta y servicio se migran con su tipo. | Todos | Adoptada · Replicar | M01 §6.7 |
| RN-PER-100 | Cambiar el titular no reescribe el pasado: cada cargo y documento conserva el titular vigente cuando se generó. | Todos | Adoptada · Adoptar | M01 §6.8 |
| RN-PER-101 | La deuda del titular anterior no se reasigna automáticamente; solo se asume por convenio expreso de M08 con consentimiento del nuevo responsable. | Todos | Adoptada · Adoptar | M01 §6.8 |
| RN-PER-102 | Transferir una cuenta la mueve con sus contratos al titular destino con fecha efectiva; si el origen tiene capital, se pregunta si se conserva (lo resuelve M17); si el origen queda sin cuentas, se… | Todos | Adoptada · Mejorar | M01 §6.8 |
| RN-PER-103 | Según política, no se transfiere una cuenta con deuda, ni a titulares dados de baja. | Todos | Adoptada · Replicar | M01 §6.8 |
| RN-PER-104 | Transferir un contrato (cambio de titularidad) crea por defecto un contrato nuevo en la cuenta destino con fecha de alta = fecha efectiva (o la original si se pide "mantener fecha"); el contrato de… | Todos | Adoptada · Mejorar | M01 §6.8 |
| RN-PER-105 | En el cambio de titularidad se transfieren línea telefónica, beneficiarios, vivienda, mediciones múltiples y propiedades; los equipos y aprovisionamiento se sincronizan con M10/M13. | TEL, VIV | Adoptada · Delegar | M01 §6.8 |
| RN-PER-106 | Según política, pueden transferirse contratos dados de baja. | Todos | Adoptada · Replicar | M01 §6.8 |
| RN-PER-107 | Las transferencias pueden generar cargos de transferencia (tipo 7) que define M04. | Todos | Adoptada · Delegar | M01 §6.8 |
| RN-PER-108 | Cada transferencia guarda sus ítems (cuenta y contratos incluidos) con identificador común y observación completa. | Todos | Adoptada · Mejorar | M01 §6.8 |
| RN-PER-109 | La transferencia de capital la ejecuta M17 con movimientos espejo. | Todos | Adoptada · Delegar | M01 §6.8 |
| RN-PER-110 | Toda transferencia se simula, se aprueba según política, se ejecuta de forma idempotente y puede revertirse con un hecho nuevo (nunca borrando). | Todos | A validar · Reemplazar | M01 §6.8 |
| RN-PER-111 | Cada cambio conserva fecha efectiva, fecha de registro, origen y motivo; las consultas históricas declaran qué fecha interpretan. | Todos | Adoptada · Reemplazar | M01 §6.9 |
| RN-PER-112 | Corregir un dato que se usó en un documento emitido no modifica ese documento. | Todos | Adoptada · Adoptar | M01 §6.9 |
| RN-PER-113 | Nunca se fusionan personas automáticamente; la fusión requiere caso de duplicado, decisión "misma persona", propuesta y aprobación. | Todos | Adoptada · Reemplazar | M01 §6.9 |
| RN-PER-114 | La persona absorbida queda "fusionada" con puntero a la sobreviviente; las referencias se reasignan por eventos; la reversión restaura las referencias registradas. | Todos | Adoptada · Reemplazar | M01 §6.9 |
| RN-PER-115 | No hay borrado físico de cuentas, titulares ni personas con historia; solo se elimina un borrador sin movimientos. | Todos | Adoptada · Descartar | M01 §6.9 |
| RN-PER-116 | Eliminar una cuenta de acceso no destruye datos de negocio; la supresión se compatibiliza con la conservación fiscal y contable. | Todos | Adoptada · Adoptar | M01 §6.9 |
| RN-PER-117 | La copia de configuración entre tenants nunca traslada datos personales; los ambientes de prueba usan datos ficticios. | Todos | Adoptada · Adoptar | M01 §6.9 |
| RN-PER-118 | El registro crea una identidad de acceso; no aprueba asociación, representación, factibilidad, condición fiscal ni activación. | Todos | Adoptada · Adoptar | M01 §6.10 |
| RN-PER-119 | Un usuario accede a una titularidad solo con vínculo verificado; la coincidencia de nombre, DNI o correo no concede acceso. | Todos | A validar · Reemplazar | M01 §6.10 |
| RN-PER-120 | Cambiar de tenant en la sesión recalcula los vínculos y las cuentas visibles (también descargas, caché y trabajos de fondo). | Todos | Adoptada · Adoptar | M01 §6.10 |
| RN-PER-121 | Pedir CUIT para una emisión que lo requiere no implica exigirlo a toda persona antes de registrarse. | Todos | Adoptada · Adoptar | M01 §6.10 |
| RN-PER-122 | La validación del alta de contrato (servicio y domicilio informados, fecha de alta salvo servicio técnico, categoría y cantidad, matrícula única, catastro e inmueble, grupo de facturación, actividad… | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-123 | El comportamiento por tipo de servicio (`TipoRegistracion`, `TipoCalculo`, flags `REG_*`, `Tecnica`, `GENERAR_OT`, `CONSULTA_BAJA`, `GF_DEFECTO`, `REG_STO`, `MATRICULA_AUTO`, `FACTI_ALTA`… | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-124 | El guardado transaccional de cuenta y contrato (stock trazable, OT de conexión, telemedición, SITSA) se divide: PER guarda la cuenta; M02 (contrato), M10 (OT y aprovisionamiento), M13 (stock… | Todos | Adoptada · Reemplazar | M01 §6.11 |
| RN-PER-125 | Las altas automáticas de servicios por evento (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtro por condición de socio (todos, solo… | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-126 | Los cargos por alta de titular (tipo 3), alta de cuenta (tipo 2) y transferencia (tipo 7), con filtro de localidad y condición de socio, son de M04; PER publica los eventos. | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-127 | Estados del contrato (pendiente de conexión, conectado, pendiente de desconexión, baja, no vigente), conexión, desconexión, reconexión y trámites masivos son de M02/M10; la ficha los muestra. | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-128 | Cambios de categoría y clase, segmentación de subsidios y tarifa social son de M02/M04; generan notas automáticas en PER. | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-129 | Capital social, reservas, rescates, deuda de capital para votar son de M17. | CAP | Adoptada · Delegar | M01 §6.11 |
| RN-PER-130 | La unicidad del número de línea móvil entre contratos conectados del mismo servicio es de M02/M10. | TEL | Adoptada · Delegar | M01 §6.11 |
| RN-PER-131 | El CBU del titular para débito es de M07. | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-132 | La alerta de presupuestos pendientes del titular la provee M11 y se muestra en la ficha. | Todos | Adoptada · Delegar | M01 §6.11 |
| RN-PER-133 | La declaración jurada de artefactos de gas por cuenta (`ARTEFSUMS`) es de M02 (gas). | GAS | Adoptada · Delegar | M01 §6.11 |
| RN-PER-134 | Los candidatos de sorteo entre socios cumplidores y el cruce de padrones externos por CUIT, CDI o DNI extraído del CUIT usan el motor de coincidencia de identificaciones de PER. | Todos | Adoptada · Delegar | M01 §6.11 |

<a id="catalogo-m02-cat"></a>

### M02 CAT — Catálogo de servicios y contratos (79 reglas)

Fuente: [`M02-CAT-catalogo-servicios.md`](../especificacion/anexos/M02-CAT-catalogo-servicios.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-CAT-001 | Un servicio solo puede habilitarse en un tenant si la capacidad está `available` y licenciada. | Todos | Adoptada · Reemplazar | M02 §6 |
| RN-CAT-002 | Habilitar/publicar no genera contratos ni cobros. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-003 | Deshabilitar oferta (`offerStatus=closed`) impide nuevas solicitudes y altas; los contratos existentes siguen su ciclo. Deshabilitar operación (`operationStatus=closed`) solo es posible sin contratos… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-004 | Toda modificación de configuración publicada se hace mediante una nueva versión; la versión publicada es inmutable. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-005 | Una versión no se publica si falla alguna validación bloqueante: plan sin precio vigente en TAR, concepto sin clase fiscal, servicio regulado sin autoridad/título, falta de equivalencia contable… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-006 | La fecha efectiva de una versión puede ser futura; nunca anterior a la última facturación cerrada del servicio salvo versión correctiva aprobada que dispara ajustes en FAC. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-007 | Un plan discontinuado no se ofrece a nuevas contrataciones y conserva condiciones de contratos anteriores. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-008 | Un cambio comercial del plan genera nueva versión; los contratos conservan la versión aceptada hasta un cambio de plan propio o una política de migración aprobada y comunicada. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-009 | Cada concepto facturable pertenece a un único servicio del tenant (salvo conceptos transversales: capital, tasas de terceros, franqueo), conservando su vínculo con el servicio aun en facturas… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-010 | No se crea un servicio de facturación independiente por concepto: instalación y abono de Internet pertenecen a Internet. | INT | Adoptada · Replicar | M02 §6 |
| RN-CAT-011 | Instalación al contado y financiada son alternativas excluyentes en el contrato; elegir una anula la otra. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-012 | Una bonificación comercial no es subsidio estatal; un subsidio exige régimen registrado. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-013 | Promoción: guarda base, porcentaje/importe (TAR), duración, unidad de duración (`calendarMonths`, `billedCycles`, `days`), regla del primer período parcial (consume/no consume) y fin. | Todos | A validar · Replicar | M02 §6 |
| RN-CAT-014 | Un plan solo puede incluir conceptos del mismo servicio o transversales permitidos; un paquete combina planes de servicios habilitados. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-015 | La categoría del contrato es la base estructural; si una lectura trae otra categoría del mismo servicio, prevalece la de la lectura para ese período (regla de TAR; CAT valida que exista). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-016 | Una categoría se considera social solo si tiene `isSocial=true`; se descarta la inferencia por descripción "JUBILADOS". | ELE | Adoptada · Reemplazar | M02 §6 |
| RN-CAT-017 | El estado operativo siempre mapea a un estado canónico; la transición la gobierna el estado canónico. | Todos | Adoptada · Reemplazar | M02 §6 |
| RN-CAT-018 | Las fechas nulas se guardan como `null`; se elimina la fecha centinela. | Todos | Adoptada · Reemplazar | M02 §6 |
| RN-CAT-019 | "Conectado a efectos de facturación y lecturas" = estados canónicos `active`, `suspended` (cuando el servicio declara que la suspensión factura cargos), `pendingTermination`. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-020 | Alta: servicio y domicilio del servicio son obligatorios; fecha de alta obligatoria salvo servicio técnico (la pone el cierre de la OT). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-021 | Alta: categoría obligatoria; cantidad obligatoria en servicios por cantidad o por dispositivos. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-022 | Matrícula única dentro del servicio entre contratos no dados de baja salvo parámetro "permitir duplicada"; si el servicio genera matrícula automática, se controla siempre. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-023 | Designación catastral e inmueble obligatorios si el servicio lo exige; no se duplica la misma parcela en el mismo servicio salvo autorización (subdivisión/unificación, BASE §88). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-024 | Grupo de facturación obligatorio y válido. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-025 | Actividad, clase, ZSR y dispositivo obligatorios según el perfil. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-026 | Factibilidad: si el servicio la exige, el contrato no pasa de `feasibility` a `pendingInstallation` sin factibilidad aprobada por TEC asociada. Por DEC-040 la exigencia es configurable por servicio y… | INT | Adoptada · Replicar | M02 §6 |
| RN-CAT-027 | Garante: si el servicio lo exige, bloquea siempre. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-028 | Tarifa social única: un titular no puede tener más de un contrato social del mismo servicio; si el proceso de segmentación encuentra varios, prioriza jubilado, luego cuenta principal, luego el… | ELE | Adoptada · Replicar | M02 §6 |
| RN-CAT-029 | Certificado de instalador: según parámetro no exigir/advertir/exigir; si se informa número, se exigen profesional y fecha salvo parámetro. El nivel lo fija M10 al cerrar la OT de instalación… | ELE | Adoptada · Replicar | M02 §6 |
| RN-CAT-030 | Deuda en domicilio/parcela: buscar otras cuentas con el mismo domicilio (calle, número, barrio, localidad, piso, departamento, edificio) o misma nomenclatura; según parámetro, total o vencida… | INT | Adoptada · Mejorar | M02 §6 |
| RN-CAT-031 | Titular no activo / dado de baja: según parámetro se impide el alta. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-032 | Dos contratos iguales en la misma cuenta: según parámetro por servicio (medidos/no medidos). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-033 | Guardado del contrato es transaccional con: creación del pedido de OT (servicio técnico), movimiento de stock del medidor/equipo trazable (vía STK), orden de telemedición (vía MED), extras… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-034 | "Forzar guardado aunque no haya cambios" no se replica; el control optimista por `version` reemplaza al guardado rápido. | Todos | Adoptada · Descartar | M02 §6 |
| RN-CAT-035 | Altas automáticas: ante el evento configurado y si se cumplen los filtros, se propone o crea el contrato del servicio destino; grupo de facturación = defecto del destino salvo "tomar grupo" del… | ALU | Adoptada · Replicar | M02 §6 |
| RN-CAT-036 | Una regla automática no crea duplicados: si ya existe contrato no terminado del servicio destino en la misma cuenta y punto, no actúa. | ALU | Adoptada · Mejorar | M02 §6 |
| RN-CAT-037 | Conceptos por evento: con "una sola vez", no se repite el mismo concepto dentro del mismo lote ni (mejora) si ya se cobró para el mismo contrato y evento; no se configuran dos conceptos "una vez" con… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-038 | Conceptos por evento con costo para suspensión/reactivación solo se aplican si la política de MOR los habilita para ese servicio y jurisdicción; la solicitud de baja nunca genera cargo. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-039 | Servicio técnico: la baja administrativa no corta; crea pedido de desconexión a TEC y el contrato pasa a `pendingTermination`; la baja efectiva ocurre al confirmar la OT. Servicio no técnico: la baja… | INT, ELE, AG, CLO, GAS | Adoptada · Replicar | M02 §6 |
| RN-CAT-040 | Al generar OT de desconexión, si el servicio "consulta baja", se pregunta si se registra también la baja administrativa. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-041 | Al confirmar desconexión efectiva, si la baja administrativa estaba vacía se completa con la misma fecha. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-042 | Cierre de OT (eventos de TEC): alta → `active` con fecha efectiva, copia de matrícula, lectura inicial 0 si el servicio lo pide (MED); traslado → domicilio nuevo; desconexión → medidor retirado (MED)… | ELE | Adoptada · Replicar | M02 §6 |
| RN-CAT-043 | Reconexión de no medido en el mismo mes y año de la última baja efectiva: si el parámetro está apagado se restaura la fecha de alta anterior para no partir el período; en medidos o con parámetro… | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-044 | Reconexión a titulares fallecidos: prohibida salvo parámetro. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-045 | **Reemplazado por RF-SOC-019 y PRM-SOC-004/005 (M18, HUECO-TRV-01)**: M18 aplica la cascada al consumir los eventos de estado del contrato. Texto original: Desconexión/reconexión del contrato se propaga a… | Todos | Reemplazada | M02 §6 |
| RN-CAT-046 | Integraciones externas por cambio de estado (BATCOM, Discar, SITSA, AION, telemedición) se configuran por servicio y se ejecutan por outbox con confirmación; nunca con código de servicio fijo. | Todos | Adoptada · Reemplazar | M02 §6 |
| RN-CAT-047 | Cambio de categoría individual: si el servicio genera OT, no se admite una segunda OT pendiente del mismo tipo; la categoría se aplica inmediata, en fecha o al cierre de la OT según… | Todos | A validar · Replicar | M02 §6 |
| RN-CAT-048 | Cambio de categoría dentro del período: si la fecha es posterior al día límite configurado, se cobra proporcional (TAR). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-049 | Cambio masivo por deuda solo a categorías prepagas (paso a prepago del moroso) y solo por orden de MOR con política habilitada. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-050 | Recategorización por segmentación: guarda categoría anterior, actualiza consumos no facturados (MED/TAR), deja nota "Recategorización" en el contrato; excluye marcados "No aplica recategorización" y… | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-051 | Transferencia: siempre se crea contrato nuevo en destino (fecha de alta = fecha de transferencia salvo "mantener fecha"); el original recibe baja efectiva y estado `superseded` (si el parámetro está… | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-052 | (Tratamiento de miembros: Reemplazado por RF-SOC-022 y PRM-SOC-012 de M18 al consumir EVT-CAT-17, HUECO-TRV-01.) Transferencia de adherentes y beneficiarios: copiar dados de baja (histórico) / copiar… | Todos | Reemplazada (parcial) | M02 §6 |
| RN-CAT-053 | Transferencia de contratos dados de baja: solo con parámetro. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-054 | Al transferir a un titular nuevo puede marcarse la cuenta destino como principal según parámetro. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-055 | Traslado de domicilio del servicio solo por OT en servicios técnicos; en no técnicos por comando con permiso; se guarda domicilio anterior con vigencia. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-056 | **Reemplazado por RF-SOC-026 (M18, HUECO-TRV-01)**: Texto original: Adherentes computables: los no dados de baja, excluyendo según marcas del servicio (menores nacidos en el último año al fin del mes… | Todos | Reemplazada | M02 §6 |
| RN-CAT-057 | **Reemplazado por RF-SOC-015, RF-SOC-016 y RF-SOC-018 (M18, HUECO-TRV-01)**: Texto original: Adherentes fuera de rango (edad, ocupación, vínculo no admitido por la categoría) se detectan en lote; se dan de… | Todos | Reemplazada | M02 §6 |
| RN-CAT-058 | **Reemplazado por RF-SOC-017 y JOB-SOC-01 (M18, HUECO-TRV-01)**: Texto original: Aviso de hijos que cumplen 21 años a la fecha (job) y por correo si el parámetro lo indica. | Todos | Reemplazada | M02 §6 |
| RN-CAT-059 | **Reemplazado por RF-SOC-020 y RF-SOC-021 (M18, HUECO-TRV-01)**: Texto original: Fallecimiento registrado en PER da de baja los vínculos (adherente, beneficiario) con fecha de fallecimiento; según… | Todos | Reemplazada | M02 §6 |
| RN-CAT-060 | **Reemplazado por RF-SOC-013 (M18, HUECO-TRV-01)**: Texto original: Adherente que ya existe en el mismo servicio: según parámetro se permite o se consulta si darlo de baja del otro titular. | Todos | Reemplazada | M02 §6 |
| RN-CAT-061 | Equipo en comodato: solo se asigna una unidad serializada disponible en STK del depósito del técnico/servicio; al asignar, STK mueve la unidad a "en comodato"; al devolver, STK la recibe; la baja… | INT, TV | Adoptada · Replicar | M02 §6 |
| RN-CAT-062 | "No facturar": requiere parámetro habilitante, permiso, motivo y vigencia; FAC lista estos contratos en la bandeja de no facturables; al vencer, se reanuda la facturación y se avisa. | Todos | Adoptada · Mejorar | M02 §6 |
| RN-CAT-063 | "Provisorio": contrato transitorio con fecha de vencimiento obligatoria; al vencer, se notifica y se propone baja o conversión a definitivo. "Cobrar provisorio" indica si se factura durante la… | Todos | A validar · Mejorar | M02 §6 |
| RN-CAT-064 | Un contrato no pasa a `active` sin: titular, cuenta, plan/categoría vigente, grupo de facturación, requisitos del perfil cumplidos y, si es técnico, confirmación de instalación. | INT, TEL, TV, ELE, AG | Adoptada · Replicar | M02 §6 |
| RN-CAT-065 | La baja del servicio no da de baja al asociado; la baja del titular con servicios activos está prohibida salvo parámetro (regla de PER que CAT informa). | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-066 | Consulta histórica: toda consulta del contrato "a una fecha" declara si interpreta fecha efectiva o fecha de registro. | Todos | Adoptada · Adoptar | M02 §6 |
| RN-CAT-067 | Cambios dentro del período (plan, categoría, titular, suspensión) guardan cada tramo con su regla y zona horaria del tenant; inclusión de días según la regla del servicio (TAR). | Todos | Adoptada · Adoptar | M02 §6 |
| RN-CAT-068 | Copia entre tenants: nunca se copian datos operativos ni credenciales; toda referencia interna se mapea al destino o queda pendiente; la configuración copiada es independiente (sin sincronización… | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-069 | Copia: marca y diccionario del destino prevalecen; el régimen fiscal y subsidios no se presumen aplicables. | Todos | Adoptada · Replicar | M02 §6 |
| RN-CAT-070 | Las transiciones son idempotentes por `commandId`; un reintento no duplica cargos ni ejecuciones. | Todos | Adoptada · Adoptar | M02 §6 |
| RN-CAT-071 | Un ticket CRM cerrado no cambia por sí solo el contrato ni cancela deuda. | Todos | Adoptada · Adoptar | M02 §6 |
| RN-CAT-072 | Baja de contrato con cuotas relacionadas (financiación, obra, vivienda) según parámetro: permitir, o exigir supervisor mostrando las cuotas; las cuotas no desaparecen. | OBR, VIV | Adoptada · Replicar | M02 §6 |
| RN-CAT-073 | "Facturar sin consumo": en servicios medidos (tipos 1 a 4) conectados o pendientes de desconexión, si no hay consumos se factura cargo fijo con consumo 0; sin la marca, no genera ítems. | AG | Adoptada · Replicar | M02 §6 |
| RN-CAT-074 | Servicio relacionado: si el servicio usa consumo de otro, TAR toma las lecturas del servicio relacionado en la misma cuenta (opcionalmente solo no facturadas). | CLO | Adoptada · Replicar | M02 §6 |
| RN-CAT-075 | Telefonía: el contrato telefónico factura la suma de llamadas tarifadas (TEC/TAR); si no hay llamadas y el parámetro lo indica, el ítem va en 0; CPP e internacionales a conceptos propios configurados… | TEL | Adoptada · Replicar | M02 §6 |
| RN-CAT-076 | **Alumbrado sin doble cobro** (HUE-ALU-02): según el criterio del tenant (PRM-CAT-111), el alumbrado se cobra como contrato ALU accesorio (tipo 6) vinculado al ELE o como regla de tipo impuesto… | ELE, ALU, TAS | Adoptada · Mejorar | M02 §6 |
| RN-CAT-077 | **Sin precio por unidad de sangre** (HUECO-SAN-01): en servicios con capacidad SAN, la publicación rechaza todo concepto facturable cuya base de cálculo sea la unidad de sangre, el hemocomponente o la… | SAN | Adoptada · Mejorar | M02 §6 |
| RN-CAT-078 | **Cambio de régimen de medición** (HUE-AG-03): `changeMeteringRegime` solo se acepta en contratos `active` o `suspended` de servicios con medición opcional; la fecha efectiva no puede ser anterior al… | AG | Adoptada · Mejorar | M02 §6 |
| RN-CAT-079 | **Paquete de grilla mínima de TV** (HUE-TV-03): cada servicio de dominio TV puede tener como máximo un producto de tipo paquete marcado `tvMinimumLineup = true`, en estado `active`; no se puede… | TV | A validar · Nuevo | M02 §6 |

<a id="catalogo-m03-med"></a>

### M03 MED — Medición y consumos (126 reglas)

Fuente: [`M03-MED-medicion-consumos.md`](../especificacion/anexos/M03-MED-medicion-consumos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-MED-001 | Un medidor no puede tener dos instalaciones activas simultáneas. El número de medidor es único por tenant, servicio y marca. | Todos | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-002 | Los dígitos del medidor determinan el máximo del totalizador (10^dígitos − 1). | Todos | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-003 | El factor multiplicador multiplica la diferencia de estados. | ELE | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-004 | Medidor indicado: el estado leído es el consumo del período. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-005 | Lectura con factor: el estado recibido ya está multiplicado y se divide por el factor al registrarlo. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-006 | El tipo de medidor determina servicio, sistema de telemedición, si es prepago, si está disponible para nuevas instalaciones, si admite "indicado" y el redondeo de prepaga. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-007 | La propiedad del medidor (cooperativa, socio, comunitario) se registra y viaja a M04 y M13. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-008 | Último estado, fecha de última lectura y último consumo del punto son valores derivados de las lecturas validadas. | Todos | Adoptada · Reemplazar | M03 §6.1 |
| RN-MED-009 | Si el servicio registra stock, el medidor debe existir como ítem serializado y la instalación genera el movimiento de stock. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-010 | El retiro nunca borra el número del medidor ni la matrícula del servicio. | Todos | Adoptada · Reemplazar | M03 §6.1 |
| RN-MED-011 | El medidor telemedido guarda su identificador en el sistema remoto. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-012 | En grandes usuarios, los canales del punto se derivan de los pares tipo de energía–concepto de la categoría tarifaria. | ELE | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-013 | Los canales se ordenan por concepto. | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-014 | Toda instalación exige fecha efectiva; si la OT no la trae, se propone la fecha de cierre de la OT con advertencia. | Todos | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-015 | Cambio de medidor: lectura final del viejo (estado de retiro de la OT, período por fecha efectiva), alta del nuevo con número, dígitos, factor, tipo y estado inicial, categoría nueva opcional de la… | Todos | Adoptada · Replicar | M03 §6.1 |
| RN-MED-016 | Toda modificación de un canal o instalación deja historial completo. | Todos | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-017 | Compatibilidad de instalación: el tipo de medidor pertenece al servicio del punto; prepago solo en categoría prepaga; bidireccional en punto con GD; telemedido requiere sistema configurado. | ELE, AG, GAS | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-018 | Las instalaciones de un mismo punto y canal principal no se superponen en el tiempo; un medidor en paralelo solo se admite con rol "control/testigo". En servicios medidos hay **un contrato por punto**… | Todos | Adoptada · Mejorar | M03 §6.1 |
| RN-MED-019 | El último consumo cargado por cambio de medidor puede anularse si no está facturado. | Todos | A validar · Replicar | M03 §6.1 |
| RN-MED-020 | Un precinto numerado solo puede estar colocado en un medidor a la vez; su retiro o violación se registra con OT o acta. | Todos | Adoptada · Nuevo | M03 §6.1 |
| RN-MED-021 | Un medidor con último ensayo rechazado no se instala hasta un ensayo aprobado posterior. | Todos | Adoptada · Nuevo | M03 §6.1 |
| RN-MED-022 | Un número de servicio de telefonía móvil guardado como "número de medidor" debe ser único entre servicios conectados. | TEL | Adoptada · Descartar | M03 §6.1 |
| RN-MED-023 | Una ruta incluye uno o más servicios, un criterio de selección (0 zona/sector/recorrido, 1 ruta de calle con rangos y pares/impares, 2 rango de cuentas), zonas y categorías opcionales. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-024 | Orden de recorrido: 0 predeterminado, 1 por titular, 2 por calle y número, 3 por zona y recorrido; opcionalmente por última toma del lecturista. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-025 | Inclusión en la ruta: servicios conectados y pendientes de baja; los de baja solo si no están retirados y la ruta incluye desconectados o el punto es testigo. Se excluyen las categorías prepagas. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-026 | Filtro de telemedidos: incluir solo, excluir o todos. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-027 | Solo se generan tareas para puntos con medidor instalado. Los servicios sin medidor no generan tarea de lectura (pueden generar tarea de relevamiento). | Todos | Adoptada · Reemplazar | M03 §6.2 |
| RN-MED-028 | Un punto no puede estar en dos lotes abiertos del mismo período; el intento bloquea. | Todos | A validar · Replicar | M03 §6.2 |
| RN-MED-029 | El rango esperado de la lectura se calcula al generar la tarea: mín = estado anterior + consumo anterior − consumo anterior × p; máx = estado anterior + consumo anterior + consumo anterior × p. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-030 | Si el último consumo fue estimado, la tarea se marca como lectura real prioritaria. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-031 | Las observaciones postales enviadas al dispositivo son las de la cuenta o las del servicio. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-032 | Se pueden filtrar por fecha de alta los servicios a incluir al generar. | Todos | A validar · Replicar | M03 §6.2 |
| RN-MED-033 | Los datos enviados al dispositivo son configurables: observación postal, lectura anterior, consumo anterior, ZSR, categoría, estado, matrícula, manzana/lote, propiedad, nomenclatura catastral… | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-034 | Ciclo del lote: generado → asignado → descargado/exportado → en curso → recibido → en revisión → confirmado → cerrado; con error por registro; cancelado. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-035 | Confirmación de una lectura: se rechaza si el servicio no tiene fecha de alta, si el medidor cambió desde la generación, si el canal ya no existe, si la fecha anterior no coincide o si el estado… | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-036 | Una observación de lectura puede generar OT automática (por código de transacción), forzar estimado o exigir foto. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-037 | El consumo se asocia a la categoría vigente del servicio en la fecha de la lectura (historia de M01/M02). | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-038 | El período de un consumo lo define el cronograma/ciclo de lectura del servicio, no solo el mes de la fecha de lectura. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-039 | Las fotos de la lectura se vinculan al consumo y se nombran con metadatos. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-040 | Las lecturas del testigo se confirman en el historial del punto testigo. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-041 | Al confirmar se actualizan los valores derivados del punto (último estado, fecha, consumo, GPS). | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-042 | Los lotes confirmados se archivan; nunca se borran. Un lote con lecturas sin procesar no se cancela sin confirmación expresa. | Todos | Adoptada · Mejorar | M03 §6.2 |
| RN-MED-043 | Al exportar un lote, opcionalmente se confirma masivamente su envío. | Todos | A validar · Replicar | M03 §6.2 |
| RN-MED-044 | La exportación a archivo puede ser una por ruta o consolidada. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-045 | La renumeración del recorrido según el orden real de toma es de 5 en 5, desde 0, por zona y sector. | Todos | Adoptada · Replicar | M03 §6.2 |
| RN-MED-046 | Una tarea tiene un solo lecturista vigente; reasignar una tarea ya descargada invalida la copia del dispositivo anterior y genera conflicto si este la sincroniza. | Todos | Adoptada · Nuevo | M03 §6.2 |
| RN-MED-047 | La fecha de lectura es obligatoria y posterior a la última lectura validada del mismo registro. | Todos | Adoptada · Replicar | M03 §6.3 |
| RN-MED-048 | No se registra lectura en un servicio sin medidor ni en un servicio inexistente o de valor 0. | Todos | Adoptada · Replicar | M03 §6.3 |
| RN-MED-049 | Ningún estado (anterior o actual) puede ser negativo. | Todos | Adoptada · Replicar | M03 §6.3 |
| RN-MED-050 | Un consumo negativo solo se acepta en un canal de energía recibida (inyección). | ELE | Adoptada · Reemplazar | M03 §6.3 |
| RN-MED-051 | El estado no puede exceder la cantidad de dígitos del registro. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-052 | Una lectura imposible se registra con motivo codificado; nunca con cero. | Todos | Adoptada · Nuevo | M03 §6.3 |
| RN-MED-053 | En el dispositivo, un estado fuera del rango esperado muestra advertencia y pide reingreso; no bloquea. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-054 | Toda lectura de campo registra GPS, hora del dispositivo, hora de recepción, lecturista y dispositivo; si la distancia al punto supera el umbral, se advierte. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-055 | Una corrección crea una versión nueva y conserva la original con autor, motivo y fecha. | Todos | Adoptada · Reemplazar | M03 §6.3 |
| RN-MED-056 | La autolectura exige foto, ventana vigente, acceso del socio al servicio, no ser menor que la última validada y máximo de autolecturas por período; siempre pasa por validación. | Todos | A validar · Nuevo | M03 §6.3 |
| RN-MED-057 | Las lecturas de OT (retiro, colocación, verificación) toman la fecha efectiva de la OT o, si falta, la de confirmación; la observación se conserva completa. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-058 | La fecha anterior de una lectura es la de la última lectura validada o, si no hay, la fecha de instalación. | Todos | Adoptada · Replicar | M03 §6.3 |
| RN-MED-059 | El consumo adicional es una lectura extra estimada con descripción "Consumo adicional" y requiere motivo y aprobación. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-060 | La importación directa de consumos (sin lectura) requiere perfil de tipo "consumos" y aprobación del lote importado. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-061 | Perfiles de importación: emparejamiento por número de medidor (con relleno a 10 dígitos configurable) o por cuenta; mapeo de conceptos por nombre de producto; formato de decimales; columnas por… | Todos | Adoptada · Reemplazar | M03 §6.3 |
| RN-MED-062 | Toma de estado remota: se consulta al proveedor por cada tarea telemedida o por servicio puntual; en puntos multicanal se pide confirmación; se toma el máximo de hasta 3 registros configurados; la… | Todos | Adoptada · Replicar | M03 §6.3 |
| RN-MED-063 | Las lecturas de telemedición no duplican lecturas manuales: si existe lectura validada del mismo registro en la misma fecha, prevalece la de mayor prioridad de origen y la otra queda como… | Todos | Adoptada · Nuevo | M03 §6.3 |
| RN-MED-064 | Cada lectura guarda su origen: manual, app de campo, colectora/archivo, importación de terceros, telemedición, autolectura, OT, migración. | Todos | Adoptada · Mejorar | M03 §6.3 |
| RN-MED-065 | Fórmula: f = factor del registro; si estado actual = anterior y no indicado → 0; si indicado o consumo adicional → actual × f; si anterior < actual → (actual − anterior) × f; si actual < anterior y… | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-066 | Una lectura menor que la anterior genera excepción bloqueante "lectura menor"; se resuelve como vuelta (si el consumo resultante es plausible), error de captura (corrección) o cambio de medidor no… | Todos | Adoptada · Mejorar | M03 §6.4 |
| RN-MED-067 | La inversa (estado = anterior + consumo / f) se usa para estimar; el estado resultante se marca "estado estimado" y no reemplaza a la última lectura real como base de validación. | Todos | Adoptada · Mejorar | M03 §6.4 |
| RN-MED-068 | Precisión de consumo por servicio y canal: 2 decimales, enteros (también los estados) o 6 decimales; redondeo explícito. | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-069 | Corrección de gas: volumen = neto (o consumo si no hay neto); si hay presión y temperatura, volumen = red4(volumen × presión × temperatura); cantidad = volumen × factor calórico del período ×… | GAS | Reemplazada | M03 §6.4 |
| RN-MED-070 | El factor de gas se busca por mes/año del período: primero por categoría y si no el general; sin factor el consumo queda bloqueado. | GAS | Reemplazada | M03 §6.4 |
| RN-MED-071 | Días de consumo = fecha efectiva actual − fecha efectiva anterior en días calendario de la zona horaria del tenant; el día de la lectura anterior se excluye y el de la actual se incluye. | Todos | Adoptada · Mejorar | M03 §6.4 |
| RN-MED-072 | El consumo del testigo para un intervalo es la suma de sus lecturas con fecha en (desde, hasta], mismo tipo de energía (activa y vacío equivalentes) y concepto; si el testigo no tiene lecturas se usa… | ELE | Adoptada · Replicar | M03 §6.4 |
| RN-MED-073 | Rango esperado de consumo = consumo de referencia ± tolerancia %, con referencia configurable (promedio móvil de N períodos válidos, mismo mes del año anterior, el mayor de ambos) y tolerancia por… | Todos | Adoptada · Mejorar | M03 §6.4 |
| RN-MED-074 | Variación porcentual contra el período anterior = (actual / anterior − 1) × 100, con anterior 0 tomado como 1; el filtro "mayor", "menor" o "entre" se aplica sobre el valor absoluto salvo límite… | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-075 | Desvío de días: se marca si los días de lectura se desvían más de un % de los días esperados del ciclo. | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-076 | Reglas de validación con severidad configurable: consumo cero en conectado; negativo sin canal de inyección; fuera de rango; variación %; desvío de días; lectura repetida N períodos; dígitos; consumo… | AG, GAS | Adoptada · Mejorar | M03 §6.4 |
| RN-MED-077 | Una anomalía no es un error: toda excepción se resuelve con una decisión codificada (aprobar como real con justificación, corregir, relectura, estimar, inspección, bloquear) y queda auditada. | Todos | Adoptada · Nuevo | M03 §6.4 |
| RN-MED-078 | Un consumo con excepción bloqueante abierta no está disponible para liquidar; el servicio aparece "observado" en el lote de M05 con la causa. | ELE, AG | Adoptada · Nuevo | M03 §6.4 |
| RN-MED-079 | Aprobación automática de consumos sin excepciones (configurable); aprobación manual en los demás; doble control para ajustes por encima de un umbral de unidades. | Todos | Adoptada · Nuevo | M03 §6.4 |
| RN-MED-080 | Un consumo facturado es inmutable; cualquier cambio posterior se hace por ajuste que M05 documenta con NC/ND. | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-081 | MED no registra consumos "ya facturados" fuera de M05. | Todos | Adoptada · Reemplazar | M03 §6.4 |
| RN-MED-082 | El cambio de categoría de un consumo solo se permite si no está facturado. | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-083 | El informe de medidores sin leer agrega en 0 a los servicios conectados sin lectura del período, diferenciados de lecturas con consumo 0. | Todos | Adoptada · Replicar | M03 §6.4 |
| RN-MED-084 | Estimación por defecto = promedio simple de los últimos N períodos con consumo real (N ≤ 12), con o sin decimales; cadena de respaldo si no hay historia: mismo período del año anterior → promedio de… | Todos | Adoptada · Mejorar | M03 §6.5 |
| RN-MED-085 | Toda estimación guarda método, base (períodos usados), motivo y autor; según parámetro requiere autorización. | Todos | Adoptada · Mejorar | M03 §6.5 |
| RN-MED-086 | Con "agregar días", la fecha estimada es la última lectura + 1 mes; las propiedades adicionales se suman. | Todos | Adoptada · Replicar | M03 §6.5 |
| RN-MED-087 | Se puede estimar dentro del lote y marcar registros como erróneos. | Todos | Adoptada · Replicar | M03 §6.5 |
| RN-MED-088 | Quedan estimados: lecturas con observación que marca estimado, consumos adicionales, redistribuciones y primeros tramos de división por días máximos. | Todos | A validar · Replicar | M03 §6.5 |
| RN-MED-089 | Regularización de estimados: se buscan los puntos cuya última lectura del rango fue estimada y que luego tuvieron lectura real; períodos a regularizar = meses entre el último período real y el último… | ELE | A validar · Mejorar | M03 §6.5 |
| RN-MED-090 | Un punto con más de N estimaciones consecutivas genera solicitud de inspección/relectura obligatoria a M10. | AG | A validar · Nuevo | M03 §6.5 |
| RN-MED-091 | Se divide en dos períodos una lectura que abarca más del 110 % y menos del 300 % de los días del período; los tramos se agrupan (grupo y segmento 1/2). | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-092 | Modo mitades: el consumo se divide en dos partes iguales. | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-093 | Modo días máximos: consumo diario = total / días; primer tramo = días del período (marcado estimado); segundo tramo = resto; con "limitar consumo" se descarta el segundo tramo; el estado intermedio =… | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-094 | Cambio de medidor en el período: se completa el período con el consumo diario del medidor nuevo (o se recorta el del viejo si se pasó de días) y el resto pasa al período siguiente; el período suma… | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-095 | Prorrateo: consumo = consumo × porcentaje / días de la lectura, redondeado hacia abajo a 3 decimales; el original queda como neto. | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-096 | Los puntos con múltiples canales/medidores (grandes usuarios) quedan excluidos de la división automática y se tratan manualmente. | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-097 | Distribución padre-hijos: por porcentaje (redondeado a 2 decimales, suma 100 %), igualada (el último hijo absorbe la diferencia) o combinada con tope por hijo; cada hijo recibe consumo estimado… | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-098 | En la combinada, si el consumo del padre supera el tope, la distribución no se ejecuta en silencio: se genera excepción para decisión del analista. | Todos | Adoptada · Mejorar | M03 §6.6 |
| RN-MED-099 | No se distribuye a grandes usuarios, a servicios no conectados ni a servicios de otro tipo; un hijo no puede pertenecer a dos distribuciones; no se distribuye dos veces en el mismo período (o mes… | Todos | Adoptada · Replicar | M03 §6.6 |
| RN-MED-100 | La reversión de una distribución anula los consumos de hijos y padre de esa ejecución sin tocar el último estado de lectura. | Todos | Adoptada · Mejorar | M03 §6.6 |
| RN-MED-101 | La demanda contratada se guarda por punto, canal y período; M04 factura la mayor entre contratada y registrada según la tarifa. | ELE | Adoptada · Replicar | M03 §6.7 |
| RN-MED-102 | % de transgresión = demanda × 100 / contratada − 100; se registra primera transgresión, demanda declarada y fecha; la revisión toma los consumos facturados de conceptos de demanda (DP, DV, DFP) de… | Todos | Adoptada · Replicar | M03 §6.7 |
| RN-MED-103 | El reset de la demanda declarada a la contratada requiere aprobación y deja auditoría "RESET_DEM" con el valor anterior. | Todos | Adoptada · Mejorar | M03 §6.7 |
| RN-MED-104 | Los comandos de corte y reconexión remota solo se ejecutan a pedido de una orden vigente de M08 (mora) o M10/M09 (técnica/atención) tras el circuito de BASE §68; el estado del servicio cambia solo… | Todos | Adoptada · Replicar | M03 §6.8 |
| RN-MED-105 | Las llamadas al proveedor son asíncronas con reintentos e idempotencia; una falla no deja abierta la OT ni una transacción: la operación queda "pendiente en proveedor". | Todos | Adoptada · Reemplazar | M03 §6.8 |
| RN-MED-106 | Tres familias separadas: medición (toma de estado y ciclo del medidor), prepago (crédito/token) y aprovisionamiento ISP/TV. MED gestiona las dos primeras; la tercera es de M10. | INT, TV | Adoptada · Reemplazar | M03 §6.8 |
| RN-MED-107 | Catálogo de operaciones del contrato de conector: configuración, alta, cambio de categoría, asignación de medidor, retiro, cambio de medidor, confirmación de OT, corte, reconexión, toma de estado… | Todos | Adoptada · Replicar | M03 §6.8 |
| RN-MED-108 | Cada llamada se audita con solicitud y respuesta saneadas (sin credenciales ni datos personales innecesarios). | Todos | Adoptada · Mejorar | M03 §6.8 |
| RN-MED-109 | Las credenciales de los sistemas se guardan en la bóveda del tenant. | Todos | Adoptada · Reemplazar | M03 §6.8 |
| RN-MED-110 | Un punto prepago no se lee para facturar en el ciclo pospago ni se incluye en el lote de facturación; su facturación ocurre por recarga (M04 §4.8). | ELE | Adoptada · Replicar | M03 §6.8 |
| RN-MED-111 | Flujo de recarga: validar preventa → M07 cobra → MED solicita crédito/token → entrega → confirma estado; si falla tras cobrar, queda en bandeja con reintento idempotente o devolución (M07, AGR-013). | Todos | Adoptada · Mejorar | M03 §6.8 |
| RN-MED-112 | El redondeo de unidades de la recarga lo define el tipo de medidor. | Todos | Adoptada · Replicar | M03 §6.8 |
| RN-MED-113 | Aviso de saldo bajo cuando el saldo informado o los días estimados restantes caen bajo el umbral. | Todos | Adoptada · Nuevo | M03 §6.8 |
| RN-MED-114 | Particularidades Discar: número de contrato = cuenta (V2 2504) o "Id cliente" (V2 2336); validación de preventa (V2 2594); reglas al confirmar ciertas OT (V2 3116); registros activa/reactiva T0..T6 y… | Todos | A validar · Replicar | M03 §6.8 |
| RN-MED-115 | Particularidades NEXO: reconexión forzada del socket (V2 2491), segundos entre reintentos con 5 intentos (V2 2370). | Todos | Adoptada · Reemplazar | M03 §6.8 |
| RN-MED-116 | El sistema "Partner" no está implementado. | Todos | A validar · Descartar | M03 §6.8 |
| RN-MED-117 | La inyección se mide en canal propio de energía recibida con contrato GD vigente; neto = demandada − inyectada por período; MED entrega ambos y el bruto "sin inyectada" para consumo mínimo, cargo… | ELE | A validar · Reemplazar | M03 §6.8 |
| RN-MED-118 | El contrato GD sigue al suministro: cambio de titular y baja se aplican juntos; la baja exige lectura final de ambos canales. | ELE | Adoptada · Nuevo | M03 §6.8 |
| RN-MED-119 | La medición propia registra seis registros fijos (pico, resto, valle, punta, fuera de punta, reactiva); compra activa = pico + resto + valle; cos φ = cos(atan(reactiva / activa)); pérdida = compra −… | Todos | Adoptada · Replicar | M03 §6.9 |
| RN-MED-120 | El servicio de la medición propia se declara explícitamente. | ELE | A validar · Reemplazar | M03 §6.9 |
| RN-MED-121 | La compra de energía no se convierte en recargo al usuario. | ELE | Adoptada · Informado | M03 §6.9 |
| RN-MED-122 | Propuesta de cambio de clase por consumo: solo socios activos sin otro servicio conectado del mismo tipo; tipo 1 excluye si el último consumo no facturado o 4 meses superan el máximo; tipo 2 exige… | Todos | A validar · Mejorar | M03 §6.9 |
| RN-MED-123 | Toda lectura, instalación, consumo y ajuste guarda fecha efectiva, fecha de registro y origen; las consultas históricas declaran qué fecha interpretan. | Todos | Adoptada · Adoptar | M03 §6.9 |
| RN-MED-124 | Calendarios distintos para lectura, liquidación, emisión y vencimiento; fronteras de días y zona horaria del tenant; meses cortos y años bisiestos con resultado reproducible. | Todos | Adoptada · Adoptar | M03 §6.9 |
| RN-MED-125 | Las tareas descargadas están versionadas; al sincronizar, si la versión del servidor cambió, la lectura se recibe igual y se genera conflicto con ambas evidencias y responsable; no se sobrescriben… | Todos | Adoptada · Adoptar | M03 §6.9 |
| RN-MED-126 | El aislamiento entre tenants es total: lecturas, fotos y GPS llevan `tenantId`; no existe base compartida entre cooperativas. | Todos | Adoptada · Reemplazar | M03 §6.9 |

<a id="catalogo-m04-tar"></a>

### M04 TAR — Tarifas y motor de cálculo (251 reglas)

Fuente: [`M04-TAR-tarifas-motor-calculo.md`](../especificacion/anexos/M04-TAR-tarifas-motor-calculo.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-TAR-001 | El cálculo de un lote recorre cuentas; por cuenta, calcula cada servicio seleccionado (los marcados "facturar con otros" al final), evalúa reglas de fase servicio, agrupa por (cuenta, grupo de… | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-002 | Un error de cálculo de un servicio excluye la **cuenta** del lote con error tipado y el lote continúa. | Todos | Adoptada · Mejorar | M04 §6.1 |
| RN-TAR-003 | La entrada por servicio es: contrato, servicio, período, secuencia, rango de fechas de consumo y consumos aprobados pendientes (M03). Con consumo simulado no se leen consumos. | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-004 | Si el contrato no tiene categoría → `TAR-E-CAT-MISSING` ("El servicio X de la cuenta Y no tiene una categoría asignada"); si la categoría no existe en la versión → `TAR-E-CAT-INVALID`. | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-005 | Servicios no medidos (fijos, adherentes, cuotas de obra) se liquidan **una vez por período**: solo si el período no fue liquidado o es el mismo período con secuencia posterior. El control se hace… | OBR | Adoptada · Mejorar | M04 §6.1 |
| RN-TAR-006 | El avance del último período liquidado y la cantidad de liquidaciones del contrato se confirman solo con la emisión (`fac.invoice.issued`) y se revierten con la anulación. | Todos | Adoptada · Mejorar | M04 §6.1 |
| RN-TAR-007 | Se agregan los cargos extraordinarios precargados del contrato para el período o sin período (concepto extraordinario, subtipo 1), una sola vez. | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-008 | Si PRM-TAR-030 tiene concepto, se agrega el cargo por atraso en devolución de productos prestados: días de atraso × precio de atraso del producto. | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-009 | Todos los renglones de un servicio quedan relacionados con el contrato/servicio (`contractId`, `serviceId`; CTR-DAT-30 — antes ~~`serviceContractId`, `serviceCode`~~) y el cálculo devuelve fechas y… | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-010 | Si algún renglón pertenece a una categoría con tipo de comprobante forzado, ese tipo reemplaza al del lote (se informa a M05). | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-011 | Si existen reglas de fase comprobante, anticipos y redondeo se aplican después de evaluarlas; si no, en el mismo paso. | Todos | Adoptada · Replicar | M04 §6.1 |
| RN-TAR-012 | El tipo de cálculo del servicio (`calcType`) selecciona la estrategia: `metered_block` (1), `metered_tiers` (2), `gas` (3), `metered_fixed_by_range` (4), `phone` (5), `fixed` (6), `quantity_block`… | INT, TEL, TV, ELE, AG, CLO, GAS, ALU | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-013 | Medidos (1–4) sin consumos: si `billWithoutConsumption` y condición conectado o pendiente de desconexión, se calcula con consumo 0 (cobra cargo fijo); si no, no genera renglones. | Todos | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-014 | Si el consumo aprobado trae otra categoría del mismo servicio, prevalece la del consumo; si no existe → `TAR-E-CAT-CONSUMPTION`. | Todos | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-015 | Si el servicio está configurado para tomar el consumo de otro servicio de la misma cuenta (ej. cloaca sobre agua), usa esos consumos; PRM-TAR-060/061 los restringen a no liquidados. Si el servicio… | AG, CLO | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-016 | División de consumos: modo 1 toma lecturas del grupo dividido solo si corresponden al período general; modo 2 solo si coinciden período y secuencia. | Todos | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-017 | Condiciones del contrato relevantes para el cálculo: 1 pendiente de conexión, 2 conectado, 3 pendiente de desconexión, 4 baja, 5 no vigente (el catálogo de estados es de M02; TAR usa su… | Todos | Adoptada · Replicar | M04 §6.2 |
| RN-TAR-018 | Se cobra cargo fijo si: condición 2 o 3 (o 1/4 con `chargeFixedWhenPendingOrDown`), no hay primer abono bonificado pendiente, la categoría tiene cantidad ≠ 0, importe ≠ 0 y concepto (de categoría o… | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-019 | Primer abono bonificado: si está marcado, se omite el cargo fijo una sola vez y la marca se apaga **al emitir**. | Todos | Adoptada · Mejorar | M04 §6.3 |
| RN-TAR-020 | Renglón de cargo fijo (`kind=fixed_charge`, subtipo legacy 10): cantidad = cantidad CF × fracción de prorrateo × múltiplo; precio = importe × cotización si el servicio tiene moneda extranjera… | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-021 | Cargo fijo por tramo: con PRM-TAR-040, se busca la fila cuyo tramo (tipo 2) o escalón (tipo 1) × proporción contiene el consumo y, si tiene cargo fijo, se usa ese importe. Proporción = días/días de… | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-022 | Cargo fijo por días: si el servicio tiene `fixedChargeByDays` y hay consumo y días, importe = importe × cantidad CF × días / período del servicio (30 si no está definido). | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-023 | Si no es por días y el servicio tiene proporcional, el cargo fijo pasa por el proporcional de alta/baja (RN-TAR-049/050). | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-024 | Multicategoría (medidores compartidos): si la categoría figura en PRM-TAR-045, se cobra un cargo fijo por cada par (categoría, cantidad) declarado en el contrato; cada cargo usa la cantidad como… | Todos | Adoptada · Mejorar | M04 §6.3 |
| RN-TAR-025 | Prorrateo de cargo fijo: si el servicio lo indica y hay prorrateo entre versiones, se emite un renglón por versión con su importe y cantidad × fracción; si la categoría no existe en la versión… | Todos | Adoptada · Replicar | M04 §6.3 |
| RN-TAR-026 | Tarifa por bloque (tipos 1, 4, 7): una sola fila con `stepMin ≤ consumo < stepMax`; todo el consumo al precio de esa fila (sin progresividad). Tipo 4: cantidad 1 al precio del escalón. Tipo 7 pasa… | ELE | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-027 | En tarifa por bloque con factor por días, el comportamiento legacy multiplica el **consumo facturado** por el factor; GoodApps ofrece dos modos por categoría: `scale_quantity` (legacy) y… | Todos | A validar · Mejorar | M04 §6.4 |
| RN-TAR-028 | El renglón medido guarda la fila de tarifa (`tariffRowId`) y su alícuota de IVA si la fila la define (subtipo legacy 1). | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-029 | Tramos y escalones (tipos 2, 3, 8 y grandes consumos): se elige el **primer tramo** (orden por mínimo) con `tierMin×prop ≤ consumoTramo ≤ tierMax×prop`; consumoTramo = consumo o el del medidor… | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-030 | Con consumo negativo (inyectada neta) se usan solo escalones con mínimo < 0; con positivo, escalones con máximo ≥ 0. | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-031 | Con PRM-TAR-041, la proporción vale 1 para los anchos y, si el consumo supera el máximo del tramo, los renglones llevan la observación "Beneficio por Días". | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-032 | `red2` es redondeo a 2 decimales (half-up); el ancho se escala por la proporción de días y por el factor de tramo (kW en grandes consumos según potencia). | ELE | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-033 | Si ningún tramo contiene el consumo, error tipado `TAR-E-TIER-NOTFOUND` (en ProCoop excepción genérica de secuencia vacía). | Todos | Adoptada · Mejorar | M04 §6.4 |
| RN-TAR-034 | Factor por días: modo 1 con días de referencia > 0 ⇒ factor = días de consumo / días de referencia (PRM-TAR-043 lo anula si días < referencia); modo 2 ⇒ factor = cantidad del contrato (1 si 0), para… | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-035 | Gas: por cada consumo activo, volumen = neto (o consumo si no hay neto); si el factor del período tiene presión y temperatura, volumen = red4(volumen × presión × temperatura); consumo = volumen ×… | GAS | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-036 | PRM-TAR-051 admite: truncar a entero, redondear a 0 decimales, redondear a 2, redondear a 6 y solo dividir; los 5 modos se implementan (ProCoop solo traduce 2 de los modos de redondeo). | GAS | Adoptada · Mejorar | M04 §6.4 |
| RN-TAR-037 | Consumo mínimo: aplica si la categoría tiene concepto, unidades mínimas > 0 y precio por unidad faltante > 0 y hubo lecturas reales; se activa si el consumo **sin inyectada** < mínimo; renglón… | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-038 | Energía inyectada: un consumo activo es inyectado si es < 0 y su medidor está marcado como indicado, o si el estado avanzó. Consumo neto = suma algebraica; consumo sin inyectada = suma de positivos… | ELE | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-039 | Neto negativo: las tramas usan escalones negativos y generan renglones de cantidad negativa (crédito valorizado). Si el comprobante resulta negativo y tiene inyectada, se agrega el concepto de… | Todos | A validar · Replicar | M04 §6.4 |
| RN-TAR-040 | Bonificación de unidades del contrato: se descuentan N unidades del consumo (si el consumo es menor, se bonifica todo); con varias categorías se consume en orden; renglón informativo a precio 0… | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-041 | En gas, las unidades bonificadas se facturan como "Cargo M3 Bloque" al precio de costo de la fila (ponderado por versión si hay prorrateo); si falta la fila de costo → `TAR-E-GAS-COSTROW` (en ProCoop… | GAS | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-042 | Consumo cero (no grandes consumos ni tipo 4): renglón de servicio a precio 0 con la cantidad bonificada y la fila del escalón que contiene 0, para trazabilidad. Con PRM-TAR-064 y prorrateo, renglones… | Todos | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-043 | Prepaga: el escalón se determina con consumo actual + lo ya liquidado en el mes (sin contar entregas de energía); se quitan de los primeros renglones las unidades ya liquidadas; si el cambio de… | ELE | Adoptada · Replicar | M04 §6.4 |
| RN-TAR-044 | Servicios fijos: se agrega el cargo fijo (salvo multicategoría, que factura una vez por par categoría-cantidad). Tipos 6, 14 y 16 toman la primera fila de la categoría; si su precio ≠ 0 emiten el… | Todos | Adoptada · Replicar | M04 §6.5 |
| RN-TAR-045 | Categoría histórica: con PRM-TAR-066, en servicios fijos por mes vencido se usa la categoría anterior si una orden técnica de cambio de categoría (operación PRM-TAR-067) se confirmó después del… | Todos | Adoptada · Replicar | M04 §6.5 |
| RN-TAR-046 | Proporcional de alta/baja (si el servicio lo indica), **mes vencido**: alta en el mes liquidado ⇒ precio × (1 − díaAlta / díasMes); con PRM-TAR-068 (tomar día de reconexión) ⇒ precio × (díasMes −… | Todos | Adoptada · Replicar | M04 §6.5 |
| RN-TAR-047 | **Mes adelantado**: si el alta fue en el mes anterior y ese mes no se liquidó, se agrega un renglón extra por el período anterior a precio × (1 − díaAlta / díasMes), además del mes completo. | Todos | Adoptada · Replicar | M04 §6.5 |
| RN-TAR-048 | El factor proporcional aplicado se guarda en el renglón (`proportionalFactor`) y se expone a fórmulas (`altaBajaFactor()`; 1 si no tiene). | Todos | Adoptada · Replicar | M04 §6.5 |
| RN-TAR-049 | Configuración por servicio y versión: método 0 sin prorrateo, 1 proporcionalidad en consumo, 2 consumo continuando la trama, 3 proporcionalidad en precio unitario; banderas para prorratear cargo… | Todos | Adoptada · Mejorar | M04 §6.6 |
| RN-TAR-050 | Hay prorrateo si la categoría no es prepaga, el método ≠ 0 y alguna versión distinta de la vigente a la fecha actual de lectura estuvo vigente después de la fecha anterior de lectura. | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-051 | Fracciones: días = fechaActual − fechaAnterior; fracción anterior = red6((vigencia − fechaAnterior)/días); actual = 1 − anterior (si fechaActual > vigencia, actual = red6((fechaActual −… | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-052 | Tercera versión: si la anterior tuvo a su vez un cambio dentro del período, se repite el cálculo sobre su porción; se soportan hasta 3 versiones por período. Más de 3 → `TAR-E-PRORATION-TOO-MANY`. | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-053 | Cada renglón guarda las tres fracciones (`fractionCurrent`, `fractionPrevious`, `fractionPrevious2`) y la versión que lo valorizó; fórmulas: `prorationCurrent()`, `prorationPrevious()`… | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-054 | Método 1: cada versión tarifa el consumo **completo** con sus escalones y la cantidad de cada renglón se multiplica por su fracción (renglones separados por versión). | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-055 | Método 2: la versión anterior tarifa consumo × fracción anterior desde el primer escalón; la actual tarifa el total descontando de sus primeros escalones lo ya cobrado por la anterior (el período… | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-056 | Método 3: un único juego de renglones con precio = Σ(precio de la versión × fracción); exige escalones idénticos en todas las versiones, si no `TAR-E-PRORATION-STEPS-MISMATCH` ("Las cantidades de… | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-057 | Si falta la tarifa en una versión del prorrateo → `TAR-E-PRORATION-RATE-MISSING` ("No existen tarifas en el cuadro tarifario a prorratear. Categoría: X" / "No existe tarifa en el cuadro N (tercer… | Todos | Adoptada · Replicar | M04 §6.6 |
| RN-TAR-058 | En tarifa por bloque con 3 versiones (métodos 1 y 2), el renglón de la tercera versión usa **su propio** precio (ProCoop usa el de la segunda: error). | Todos | A validar · Mejorar | M04 §6.6 |
| RN-TAR-059 | En ProCoop un cuadro es la foto cerrada de la tarifa vigente **hasta** su creación y las tablas vivas son la tarifa actual. En GoodApps toda tarifa (incluida la actual) es una versión con… | Todos | Adoptada · Reemplazar | M04 §6.7 |
| RN-TAR-060 | Alta legacy de cuadro (preguntar backup si no hay facturas sin cuadro; `FEC_DESDE` = mayor `FEC_HASTA` existente o hoy − 5 años; `FEC_HASTA` = creación; copia de `SERVICIO`, `CATE_SER`, `CATTARIF`… | Todos | Adoptada · Reemplazar | M04 §6.7 |
| RN-TAR-061 | `HIS_SERVICIO_EXTRAS` se llena desde `SERSOC_EXTRAS` (error de ProCoop); en migración se toman los extras del servicio (`SERVICIO_EXTRAS`) vigentes y se reporta la diferencia. | Todos | A validar · Descartar | M04 §6.7 |
| RN-TAR-062 | ProCoop asocia las facturas con `COD_CUA` vacío al cuadro nuevo (vacío = "tarifa viva"). En GoodApps cada liquidación guarda en el momento del cálculo la versión exacta (id, revisión, hash) de cada… | Todos | Adoptada · Reemplazar | M04 §6.7 |
| RN-TAR-063 | En ProCoop el servicio histórico solo se consulta pero los cargos adicionales históricos se editan. En GoodApps nada de una versión publicada es editable (ni reglas ni fórmulas). | Todos | Adoptada · Reemplazar | M04 §6.7 |
| RN-TAR-064 | Circuito de actualización de precios: (1) copiar la versión vigente a borrador, (2) modificar, (3) fijar vigencia, (4) simular, (5) aprobar; el prorrateo con la versión anterior es automático… | Todos | A validar · Reemplazar | M04 §6.7 |
| RN-TAR-065 | Calcular con una versión forzada (simulación, función de simulación con otra versión, prorrateo) usa exclusivamente precios, categorías activas, filas activas, tarifas de adherentes y reglas de esa… | Todos | Adoptada · Replicar | M04 §6.7 |
| RN-TAR-066 | Clonar categoría: nueva categoría-precio con nombre "(Copia) " + nombre (máx. 40 caracteres en ProCoop; en GoodApps 120) y sus filas. | Todos | Adoptada · Replicar | M04 §6.7 |
| RN-TAR-067 | Actualizar tarifa con otra: copia los precios elegidos (`unitPrice`, `costMem`, `costTne`, `costPist`, `costSubsidy`, `costPrice`) y opcionalmente precios y conceptos de demanda; el emparejamiento es… | ELE | Adoptada · Mejorar | M04 §6.7 |
| RN-TAR-068 | Eliminar y clonar tarifas: reemplaza todas las filas de una categoría por copia de las de otra (en borrador). | Todos | Adoptada · Replicar | M04 §6.7 |
| RN-TAR-069 | Actualizar tarifas coincidentes: copia filas completas emparejadas hasta la menor cantidad conservando identificadores; sin filas → "No se encontraron tarifas para realizar la actualización." | Todos | Adoptada · Replicar | M04 §6.7 |
| RN-TAR-070 | Cuotas de obras (tipo 17): cobra el cargo fijo si corresponde; exige tipo de obra (pavimento, agua, cloacas, alumbrado, vivienda), si falta `TAR-E-WORKS-TYPE` ("Debe indicar el tipo de obra…"). | AG, CLO, ALU, OBR, VIV | Adoptada · Replicar | M04 §6.8 |
| RN-TAR-071 | El plan del contrato (`worksInstallmentPlans`) guarda cuotas totales, cuotas facturadas, unidades por cuota (metros o importe), unidades totales y unidades facturadas; el avance se confirma al… | OBR | Adoptada · Mejorar | M04 §6.8 |
| RN-TAR-072 | Pavimento: si faltan unidades totales se calculan del inmueble asociado por nomenclatura catastral (sin inmueble → `TAR-E-WORKS-PROPERTY` "El servicio no tiene un inmueble relacionado…"); precio por… | OBR | Adoptada · Replicar | M04 §6.8 |
| RN-TAR-073 | Alumbrado: igual que pavimento pero exige unidades totales (`TAR-E-WORKS-METERS` "El servicio no tiene un total de metros asignado…"); ajuste por inflación si la categoría tiene índice: coeficiente ×… | ALU, OBR | Adoptada · Replicar | M04 §6.8 |
| RN-TAR-074 | Cloaca: la cuota es un importe (cantidad 1, precio = unidades por cuota); la última cuota cobra el saldo. | CLO, OBR | Adoptada · Replicar | M04 §6.8 |
| RN-TAR-075 | Vivienda: porcentaje por cuota = mínimo después de adjudicar (si adjudicada) o antes (si no) del plan de M18; en su defecto ~~PRM-TAR-072/073~~ PRM-SOC-019/PRM-SOC-018 (M18; HUECO-VIV-02); tope =… | VIV | Adoptada · Replicar | M04 §6.8 |
| RN-TAR-076 | Obra de agua no tiene algoritmo (solo cargo fijo); la cuota se factura manualmente: renglón con cantidad × (importe/cantidad) que suma la cantidad a unidades facturadas al emitir; sin datos del plan… | AG, CLO, OBR | A validar · Replicar | M04 §6.8 |
| RN-TAR-077 | Una vez por período: coefActualización = `coefUpdate1` si coeficiente zonal ≤ umbral (0,8) si no `coefUpdate2`; cuotaMínima = `minQuota1` si zonal ≤ umbral si no `minQuota2`; importe = red2(TBM ×… | Todos | Adoptada · Replicar | M04 §6.9 |
| RN-TAR-078 | Adherentes que cuentan: sin baja, excluyendo según el servicio menores (nacidos en el último año a fin del mes siguiente), jubilados (ocupación de tipo 2) y personas con discapacidad. | SEP, SAL | Adoptada · Replicar | M04 §6.10 |
| RN-TAR-079 | Tipos 9 y 10: categoría automática = fila cuya cantidad de adherentes coincide; la categoría resultante se **propone** al contrato (efecto diferido); renglón precio × (por unidad ? 1 : cantidad); sin… | SEP | Adoptada · Replicar | M04 §6.10 |
| RN-TAR-080 | Tipos 10 a 13: además, cada adherente según tarifas de adherentes filtradas por servicio, vínculo, ocupación, categoría (0 = cualquiera) y edad entre desde/hasta (edad al último día del período); 11… | Todos | Adoptada · Replicar | M04 §6.10 |
| RN-TAR-081 | Otros tipos: renglón base precio × (por unidad ? 1 : cantidad). Recategorización automática por edad del titular (adherente de vínculo tipo 1) con la fila de tarifa de adherentes de precio 0 y… | SEP, SAL | Adoptada · Replicar | M04 §6.10 |
| RN-TAR-082 | Facturación telefónica (tipo 5): un renglón de servicio con la suma de netos de las llamadas tasadas del período, excluida la clave 100; sin llamadas y con PRM-TAR-080 activo, renglón en 0. | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-083 | Llamadas CPP (clave 100) van al concepto PRM-TAR-081 (subtipo 14); internacionales no facturadas a la fecha van al concepto PRM-TAR-082 (subtipo 2). M04 es el **único dueño** de los conceptos CPP e… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-084 | Tasación por llamada: origen = línea vigente a la fecha de la llamada (cuenta, servicio, plan); destino = prefijo más largo del plan de numeración (M10) → clave, operador, móvil; tipo de llamada… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-085 | Orden de tipo de llamada: (1) destino móvil ⇒ CPP; (2) clave 0 y prefijo local ⇒ Local; (3) clave 0 y prefijo no local ⇒ Urbana; (4) clave 1 y prefijo local ⇒ Urbana; (5) clave 88 o > 100 ⇒… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-086 | Clave tarifaria: si el CDR trae clave ≠ 0 se respeta; la del prefijo solo cuando falta, salvo internacionales con PRM-TAR-084 activo (siempre la del prefijo); sin prefijo ⇒ observación "Clave de… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-087 | Bandas: sin línea atribuida se usa el plan tarifario por defecto (PRM-TAR-085, legacy plan 1); sin asignación de banda para plan+banda ⇒ error "No existe asignacion de banda Horaria"; tramos del… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-088 | Fracciones: por cada tramo, tarifa por (tipo de banda, clave, [tipo]) con fracción (segundos) e importe; con varias filas se aplican escalonadas por número (1ª fracción, siguientes…); fracciones =… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-089 | Prepago: si PRM-TAR-086 y el servicio es el de prepago (PRM-TAR-087) con categoría prepaga vigente a la fecha de la llamada (historia del contrato), tipo += 10. | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-090 | Internacionales (clave 88 o > 100) con PRM-TAR-084: se registran como internacionales valorizadas con la cotización de la moneda de la central (importes de claves internacionales × cotización) y el… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-091 | Destino en la lista de gratuitos ⇒ gratuita, importe 0; origen y destino de la misma central virtual (servicio PRM-TAR-088) ⇒ tipo 6, importe 0. | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-092 | Planes de descuento: filtros por plan, categoría, solo locales, rango de claves, día de semana, franja horaria, rango de duración, cuenta, prefijo; tipos: descontar importe fijo, descontar %, cobrar… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-093 | Consumo mínimo por llamada (PRM-TAR-089); con PRM-TAR-090 no se aplica a claves 0/1. | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-094 | Si el CDR trae importe (> 0), prevalece; con PRM-TAR-091 las llamadas de Telco IP con clave 99 se importan con importe 0. | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-095 | Simulador de tasación de una llamada suelta (plan y clave opcionales) con la misma secuencia que la masiva; usa la línea **vigente a la fecha simulada** (ProCoop usa la línea abierta actual). | TEL | Adoptada · Mejorar | M04 §6.11 |
| RN-TAR-096 | Retasación: solo de llamadas no agrupadas/facturadas; recalcula la clave desde el plan de numeración y tasa con la moneda indicada; conserva el identificador de la llamada y guarda la tasación… | TEL | Adoptada · Mejorar | M04 §6.11 |
| RN-TAR-097 | Función `phoneNetWithCap(topeSegundos, claves…)`: si los segundos totales superan el tope, recalcula el neto en orden cronológico hasta completar el tope y prorratea la última llamada; el tope se… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-098 | CPP/CVLP: la liquidación a la operadora (agrupación por condición de IVA y alícuotas del concepto CPP, comisiones hasta 3, factura o ND de comisión, modo "según cobranzas") es un comprobante de… | TEL | Adoptada · Delegar | M04 §6.11 |
| RN-TAR-099 | Telefonía móvil (reventa): los conceptos del proveedor importados (larga distancia, SMS, varios, minutos de abono/excedentes, servicios varios, descontar SMS contratados, extras; abono proporcional… | TEL | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-100 | La línea del abonado tiene plan tarifario; desvincular el número crea una línea sin número que conserva el plan ("Desvinculación sin OT"); un número no puede estar en uso por otro servicio en la… | Todos | Adoptada · Replicar | M04 §6.11 |
| RN-TAR-101 | Tipos de energía: `A` o vacío activa, `R` reactiva, `DP` demanda en punta, `DFP` demanda fuera de punta, `DV` demanda en valle; el concepto distingue bandas horarias y franjas. kWh y kW nunca se… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-102 | Energía activa: por cada concepto presente en los consumos activos se tarifa el consumo del concepto con las filas del mismo tipo y concepto según `largeCustomerEnergyMode`: 0 precio por cantidad (un… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-103 | Subtipos legacy de renglón: 2 servicio grandes consumos, 6 demanda en punta, 7 demanda fuera de punta, 3 demanda adquirida, 4 demanda corregida, 8 exceso; en GoodApps se usa `kind` explícito… | ELE | Adoptada · Mejorar | M04 §6.12 |
| RN-TAR-104 | Demanda contratada: (1) demanda por período del contrato para el mes y tipo de medición si el contrato lo indica; (2) si no, contratada general del contrato; (3) si no, contratada del medidor por… | ELE | A validar · Replicar | M04 §6.12 |
| RN-TAR-105 | Modalidades de demanda (`demandMode`; "máx" = demanda máxima registrada del período; precio base `demandPrice` con concepto, precio de exceso o segunda demanda `excessDemandPrice` con concepto): 0… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-106 | Prorrateo de demandas (PRM-TAR-093): cada demanda se divide por versión con sus precios base y exceso; método 1 prorratea cantidad, método 3 precio. | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-107 | Con método 2 en demandas prorrateadas ProCoop factura la demanda completa en cada versión (duplicaría). En GoodApps el método 2 en demanda se trata como método 1 (cantidad × fracción) y se advierte… | ELE | A validar · Mejorar | M04 §6.12 |
| RN-TAR-108 | En modalidades 3, 11 y 13 con 3 versiones, el exceso de la tercera usa su propio precio (ProCoop usa el de la segunda). | ELE | A validar · Mejorar | M04 §6.12 |
| RN-TAR-109 | Actualización de la contratada (si la categoría lo indica): si la máxima del período supera contratada × (1 + porcentaje/100), se **propone** nueva contratada = máxima, con fecha y, la primera vez… | ELE | A validar · Mejorar | M04 §6.12 |
| RN-TAR-110 | Transgresiones: % de transgresión = demanda × 100 / contratada − 100; se registra primera transgresión, demanda declarada actual y fecha; un proceso puede restablecer la declarada a la base… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-111 | Factor de potencia: tgφ = reactiva total / activa total (activa con o sin inyectada según PRM-TAR-062); base = Σ neto de renglones de energía y demanda con cantidad ≥ 0 (o solo energía si… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-112 | Métodos: 1 coseno: cosφ = cos(atan(tgφ)) con piso PRM-TAR-095; si cosφ < tope, recargo = base × tope/cosφ − base; si cosφ > tope y no "no bonificar", bonificación = −(base − base × tope/cosφ). 2… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-113 | El renglón de factor de potencia (`kind=power_factor`) guarda método, tope, "no bonificar" y coseno calculado; si no hubo recargo, esos datos se adjuntan al primer renglón de energía. Defaults al… | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-114 | La base del factor de potencia selecciona renglones por `kind` (energía/demanda) y no por número de subtipo (en ProCoop los subtipos de servicio y producto se solapan: 3 demanda adquirida/capital, 4… | ELE | Adoptada · Mejorar | M04 §6.12 |
| RN-TAR-115 | VAD: suma de reglas cuyo concepto es de tipo de producto 20 (valor agregado de distribución), evaluadas por fórmula en el contexto del servicio; error → `TAR-E-VAD` ("Error al Calcular el VAD"). | ELE | Adoptada · Replicar | M04 §6.12 |
| RN-TAR-116 | Una regla tiene: vigencia desde/hasta (fuera de ella vale 0), orden, servicio, tipos de comprobante (vacío = todos), fase (servicio/comprobante), tipo de acción (cargo, recargo, impuesto, recargo… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-117 | Por regla y en orden se calculan: `unit` = si (servicio coincide y filtro) entonces importe, si no 0; `qty` = fórmula de cantidad; `value` = unit × qty; `taxBase` = fórmula de base; `previousTotal` =… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-118 | Cargo (0): renglón de producto con cantidad y precio; `kind=rule_charge` (subtipo 15), o `fixed_charge` (10) si se registra como cargo fijo, o `tariff_component` (16) si es parte de la tarifa; lleva… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-119 | Recargo (1): no crea renglón propio en ProCoop: multiplica el precio sin IVA de los afectados por (1 + valor / neto afectado); con valor negativo es descuento. En GoodApps se registra además un… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-120 | Impuesto (2): renglón de tipo impuesto con el importe en "otros impuestos" y su base imponible; sin IVA; usa solo el unitario como importe (ignora cantidad). Debe referenciar un tributo aprobado de… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-121 | Recargo proporcional en renglones (3, solo fase comprobante): base = Σ(neto con IVA + IIBB + otros impuestos) de renglones que no son "otros" ni cuota; objetivo = red2(base + valor); factor = 1 +… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-122 | Reglas con comprobante aparte (grupo o grupo cero) acumulan sus renglones para un comprobante separado que M05 arma. No se permite marcar "grupo 0" y un grupo a la vez. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-123 | Contexto de fase servicio disponible en fórmulas (sección 9.4.4): cuenta y socio, categoría, servicio, lecturas, comprobante, prorrateo, coseno. `Categoria_ConsumoMinimo` devuelve en ProCoop el… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-124 | ProCoop evalúa fórmulas como columnas calculadas de una grilla DevExpress invisible con funciones registradas globalmente (no permite fases en paralelo). GoodApps usa el intérprete GFL (sección 9.4)… | Todos | Adoptada · Reemplazar | M04 §6.13 |
| RN-TAR-125 | Las reglas se referencian por **código estable** (slug sin espacios ni caracteres especiales), no por nombre; el nombre es libre. Se elimina la restricción de caracteres… | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-126 | ProCoop aborta todo el lote si alguna celda de fórmula da `#Err` ("Se ha producido una inconsistencia al generar la Factura de la cuenta X. Error en …"). GoodApps excluye la cuenta con… | Todos | A validar · Mejorar | M04 §6.13 |
| RN-TAR-127 | Selección de reglas para un cálculo: de la versión aplicable (o de la forzada), orden menor que el pedido (en lote: todas; en el editor: solo las anteriores a la que se edita), fase igual, tipo de… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-128 | `previousTotal` suma los unitarios de **todas** las reglas armadas antes, aunque sean de otro servicio (compatibilidad); GoodApps agrega `previousTotalSameService()`. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-129 | Importe unitario armado: `if(ctx.service.code == regla.servicio && filtro, importe, 0)`; fuera de vigencia la regla no se evalúa (0). `taxBase` existe solo con fórmula de base; `qty` y `value` solo… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-130 | Una regla de fase comprobante **no** puede tener servicio cargado (en ProCoop daría `#Err` porque la fila de comprobante no tiene código de servicio); se valida al guardar; para filtrar por servicio… | Todos | A validar · Mejorar | M04 §6.13 |
| RN-TAR-131 | Vigencia de reglas: control **único** contra la fecha de referencia tarifaria del período liquidado (PRM-TAR-010), no contra la fecha del sistema (ProCoop exige `DESDE ≤ fechaVigencia ≤ HASTA` y… | Todos | A validar · Mejorar | M04 §6.13 |
| RN-TAR-132 | Una regla sin vigencia explícita rige desde la vigencia de su versión hasta su cierre (ProCoop asigna 1900-01-01 a 2200-01-01; con vigencia marcada propone el mes actual). | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-133 | Momento de evaluación (compatibilidad ProCoop): todas las variables de las reglas de un servicio se evalúan con la foto del servicio **antes** de aplicar sus reglas; un recargo de orden 1 no cambia… | Todos | A validar · Replicar | M04 §6.13 |
| RN-TAR-134 | Si una regla usa simulación con otra versión, el editor sugiere ubicarla al final del orden. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-135 | Importe del renglón = unitario; cantidad = `qty` (1 sin fórmula); base imponible = `taxBase` (0 sin fórmula); unitario 0 ⇒ no se genera renglón; signo "resta" cambia el signo del unitario. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-136 | Cantidad 0 con unitario ≠ 0: ProCoop crea el renglón con cantidad 0 (que luego la validación del comprobante rechaza). GoodApps no crea el renglón y registra advertencia `TAR-W-RULE-QTY-ZERO`. | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-137 | Renglón de regla en fase servicio lleva contrato, categoría y servicio; en fase comprobante no lleva servicio ni categoría. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-138 | Recargo con afectación por concepto: afecta renglones de producto del concepto; en fase servicio, si no hay, cualquier renglón con ese concepto (ej. renglones de servicio cuyo concepto es ese); en… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-139 | Recargo proporcional (tipo 3) solo es válido en fase comprobante; en fase servicio no se puede guardar (ProCoop lo ignora sin error). | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-140 | "Una vez por cuenta en el lote": si ya se aplicó a la cuenta, se **saltea solo esa regla** (ProCoop corta el recorrido y omite también las reglas posteriores). Se controla en ambas fases. | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-141 | Un servicio sin contexto de fórmula genera `TAR-E-FORMULA-CONTEXT` ("Se ha producido una inconsistencia al obtener la cuenta…"). | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-142 | Alcance de funciones por fase: ambas fases (sumas, mín/máx, deuda, campos de entidades, facturado, fechas, cotización, simulación con versión, servicio activo, constantes del lote secuencia y rango… | TEL | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-143 | Las funciones de GFL **no** reciben como primer argumento el id de la fila en proceso (ProCoop: `Id_Sersoc`, `Cod_Sum` o `Index`): el contexto es implícito; existen variantes `…Account` para alcance… | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-144 | El catálogo de funciones (9.4.5) replica la semántica de las 30 clases de ProCoop con estas correcciones: `consumptionLoad` acepta a la vez estado y operación (duda 18); `consumptionDays` devuelve… | Todos | A validar · Mejorar | M04 §6.13 |
| RN-TAR-145 | Procedimientos almacenados `FORMULA_CARGO_<TIPO>_<Nombre>` / `FORMULA_CARGOFINAL_<TIPO>_<Nombre>` (tipos INT, STR, DAT, DEC, BIT; resultado = primera columna de la primera fila) no se replican: cada… | INT | A validar · Reemplazar | M04 §6.13 |
| RN-TAR-146 | Nombre único de regla (comparación sin espacios y en mayúsculas, excluida la propia) dentro de la versión; código único dentro del tenant y estable entre versiones. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-147 | No se puede publicar una regla cuyas fórmulas referencian una regla inexistente o no vigente en la misma versión (ProCoop: referencias a cargos con `HASTA` anterior a hoy). | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-148 | Validaciones al guardar: concepto o tributo a imputar/afectar obligatorio; servicio obligatorio cuando aplica; no "grupo 0" y grupo a la vez; tipo 3 solo en fase comprobante; regla de comprobante sin… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-149 | Orden: regla nueva recibe máximo + 1 **dentro de su fase y servicio**; subir/bajar intercambia con el vecino de la misma fase y servicio (ProCoop busca el vecino entre todos los cargos). | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-150 | Clonar regla: nuevo código (sugerido `codigo_copia`), nombre + " - (copia)", orden máximo + 1. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-151 | Renombrar una regla no rompe fórmulas (referencias por código). Cambiar el **código** de una regla en borrador actualiza las referencias de todas las reglas del borrador (incluido `previousTotal`)… | Todos | Adoptada · Mejorar | M04 §6.13 |
| RN-TAR-152 | Búsqueda de regla por referencia: código, nombre exacto, nombre que contiene, nombre sin distinguir mayúsculas. | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-153 | Las reglas de una versión publicada no se editan (ProCoop permite editar `HIS_CARGOS_ADICIONALES`, lo que altera simulaciones y prorrateos con ese cuadro). | Todos | Adoptada · Reemplazar | M04 §6.13 |
| RN-TAR-154 | Datos de prueba del editor: contexto real de los contratos elegidos liquidando el período actual con consumos de los últimos 5 meses sin persistir; para fase comprobante, simulación del comprobante… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-155 | Tablas de ayuda del editor para elegir códigos: servicios, categorías del servicio, ocupaciones, productos sin stock, localidades, referencias, actividades ARCA, clases de servicio, situaciones de… | Todos | Adoptada · Replicar | M04 §6.13 |
| RN-TAR-156 | Franqueo: se cobra el concepto y el importe del servicio de entrega postal de la cuenta (subtipo 17) cuando: la cuenta tiene servicio de entrega y no está exenta de cobrarlo; concepto e importe ≠ 0… | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-157 | Anticipos: si el total > 0 y el proceso no indica "no aplicar anticipos", TAR pide a M07 los anticipos con saldo de la cuenta cuyo tipo de comprobante está vacío o coincide (primero los específicos)… | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-158 | Anticipos de productos (tipo 1): solo con PRM-TAR-123 y solo contra renglones vinculados a los mismos presupuestos; el neto se calcula descontando el IVA de la alícuota del producto. | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-159 | Redondeo de renglones: si la política del tipo de comprobante fija decimales de renglón, cada renglón y los totales se fuerzan a esos decimales; el IVA se redondea por alícuota y los totales se… | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-160 | Redondeo del total: después de anticipos y si el total > 0; configuración tomada del tipo de comprobante (política referenciada) o de la política global: "no redondear" (1), "usar la del tipo" (2) o… | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-161 | Cuentas con "excluir redondeo" no se redondean, salvo redondeo de prepaga. | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-162 | Tipos de redondeo: 1 redondear decimales (totales de los 4 vencimientos a N decimales, sin renglón); 2 redondeo con arrastre; 3 decimales pares (si los centavos son impares, renglón de −ARS 0,01 sin… | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-163 | Redondeo con arrastre (tipo 2): no aplica si la fecha del comprobante coincide con el primer vencimiento (salvo prepaga); si hay saldo de redondeo previo de la cuenta (o por tipo de comprobante si la… | Todos | A validar · Replicar | M04 §6.14 |
| RN-TAR-164 | Redondeo de prepaga: solo si el total > 0, forzando el importe calculado; al final de anticipos y redondeo se piden a M05 los vencimientos recalculados. | Todos | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-165 | Medidor testigo: el contrato puede tener un testigo (M03); se suman sus consumos con fecha actual en (desde, hasta], mismo tipo de energía (activa = vacío) y concepto; **solo elige el tramo**, la… | ELE | Adoptada · Replicar | M04 §6.14 |
| RN-TAR-166 | Alícuota por renglón resuelta por TAR en cascada y entregada a M06: servicio → IVA de la fila de tarifa, si no de la categoría, si no del servicio; IIBB de la categoría, si no del servicio. Producto… | Todos | Adoptada · Replicar | M04 §6.15 |
| RN-TAR-167 | TAR invoca `fis.calculateTaxes` con renglones, situación de IVA e IIBB de la cuenta, exclusión de percepción, padrón por cuenta y fecha; M06 aplica: IVA1 = neto × tasa; IVA2 = neto × segunda tasa si… | Todos | Adoptada · Delegar | M04 §6.15 |
| RN-TAR-168 | Renglones con IVA fijo (cuotas de financiación con su IVA original) conservan su IVA; M06 no lo recalcula. | Todos | Adoptada · Replicar | M04 §6.15 |
| RN-TAR-169 | IIBB (M06): aplica si la alícuota es de "rendir en facturación" y la situación no es exenta; porcentaje por (situación, alícuota); solo si la suma de netos alcanzados ≥ base mínima; variante con… | Todos | Adoptada · Delegar | M04 §6.15 |
| RN-TAR-170 | Otros tributos (tasas municipales, fondos provinciales) se modelan como reglas de tipo impuesto con fórmula y base imponible, normalmente condicionadas por categoría o situación de IVA… | TAS | Adoptada · Mejorar | M04 §6.15 |
| RN-TAR-171 | Total = Σ neto + IVA1 + IVA2 + percepción de IVA + otros tributos + IIBB. | Todos | Adoptada · Replicar | M04 §6.15 |
| RN-TAR-172 | ProCoop no tiene concepto explícito de tarifa social: la resuelve con categorías específicas, bonificación de unidades, primer abono bonificado, cargos con signo "resta", columnas de subsidio leídas… | ELE | A validar · Mejorar | M04 §6.16 |
| RN-TAR-173 | Columnas de costo/subsidio de la fila (`costSubsidy`, `fixedChargeWithSubsidy`, `costPrice`, `costPist` (ex `COSTO_EPEC`), `costMem`, `costTne`, `uniformGasPrice`) no intervienen en el cálculo base… | Todos | Adoptada · Replicar | M04 §6.16 |
| RN-TAR-174 | Todos los mensajes de error del cálculo se convierten en códigos tipados con contexto (catálogo 9.11), con texto por clave de diccionario; los errores sin mensaje propio de ProCoop (tramo… | GAS | Adoptada · Mejorar | M04 §6.17 |
| RN-TAR-175 | Validación del comprobante (cuenta, punto de venta, número o tipo inválidos; sin detalles; renglones con cantidad 0; total negativo) es de M05; TAR garantiza no producir renglones de cantidad 0 y… | Todos | Adoptada · Delegar | M04 §6.17 |
| RN-TAR-176 | Consumos que entran al cálculo: fechas anterior/actual = mínima y máxima de los consumos; estados anterior/actual = primera y última lectura activa; marca "dividida" si algún consumo tiene grupo ≠ 0… | Todos | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-177 | La simulación con consumo numérico aplica la bonificación igual que el cálculo real (en ProCoop la simulación resta de otra forma y puede dar bonificado negativo). | Todos | Adoptada · Mejorar | M04 §6.18 |
| RN-TAR-178 | Totales por tipo de energía: "A" incluye consumos sin tipo; la inyectada se totaliza aparte. | ELE | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-179 | Por categoría: corrección de gas recalcula consumo activo total (descontada bonificación) y consumo sin inyectada; total por (tipo, franja, concepto) con concepto −1 = todos; máximo consumo; consumos… | GAS | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-180 | Reparto de consumos por categoría: cada consumo con la categoría registrada; los de servicio relacionado usan la categoría del contrato propio; con categoría forzada todos a ella; un consumo cuya… | Todos | A validar · Mejorar | M04 §6.18 |
| RN-TAR-181 | Valor de propiedad extra del contrato: se lee como decimal tipado (ProCoop normaliza el separador punto a coma en texto). | Todos | Adoptada · Mejorar | M04 §6.18 |
| RN-TAR-182 | Importe del renglón: neto = (precio − descuento unitario) × cantidad, redondeado a los decimales de renglón si están definidos; neto sin descuento = precio × cantidad. IIBB del renglón cuenta solo si… | Todos | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-183 | Constructores de renglón de otros orígenes (presupuesto con tasas vigentes; renglón leído de comprobante con impuesto de código IVA como IVA fijo; producto con alícuotas propias y conversión de… | VIV | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-184 | Validación de renglón de producto (producto obligatorio, cantidad > 0, stock con parámetros 77/208/354/2068, combos sin control de componentes) es de M11/M13 para ventas; el motor tarifario no valida… | Todos | A validar · Delegar | M04 §6.18 |
| RN-TAR-185 | Totales del comprobante: IVA por alícuota con redondeo por alícuota; "otros tributos" incluye IIBB y se redondea a los decimales del comprobante (ProCoop lo redondea a entero). | Todos | Adoptada · Mejorar | M04 §6.18 |
| RN-TAR-186 | Solo se recalcula el IVA de renglones nuevos; los de IVA fijo lo conservan; percepción de cuotas sale de la cuota salvo subtipos 21–23; percepción de IVA si la suma de percepciones potenciales supera… | Todos | Adoptada · Delegar | M04 §6.18 |
| RN-TAR-187 | Descuento porcentual: descuento unitario = precio × % / 100 − recargo/descuento automático ya aplicado. | Todos | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-188 | IVA por pago parcial (agrupado por alícuota y tasa, dividido por total/importe de proporción con o sin IVA) es de M07. | Todos | Adoptada · Delegar | M04 §6.18 |
| RN-TAR-189 | Carga de cuotas en un comprobante (omite anuladas/facturadas/estado F; contado o detalle con renglones de la venta original; capital por alícuota; alícuota 4 por defecto sin IVA de venta… | Todos | A validar · Delegar | M04 §6.18 |
| RN-TAR-190 | Acumulación de IVA por (tipo, porcentaje): desde un renglón no impuesto se generan filas de alícuota 1, alícuota 2 (si > 0) y percepción (si > 0); base de percepción = neto con IVA − percepción. La… | Todos | A validar · Delegar | M04 §6.18 |
| RN-TAR-191 | Detalle de comprobantes de compra (recotización, detalle simple, clasificación gravado/no gravado/retención/percepción, IVA no tomado) y pendientes de pedidos de compra no pertenecen al motor… | Todos | Adoptada · Descartar | M04 §6.18 |
| RN-TAR-192 | Evolución de conceptos entre dos períodos: variación % = 0 si ambos 0; 100 si el primero es 0; −100 si el segundo es 0; si no (nuevo − base)/base × 100; excluye o toma solo financiaciones según la… | Todos | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-193 | Informe de consumos por tramo y versión: reconstruye consumo y neto de cada escalón por servicio y período excluyendo R, DP y DFP, divide por factor de demanda cuando corresponde y contempla… | Todos | Adoptada · Mejorar | M04 §6.18 |
| RN-TAR-194 | Agregado tarifario por fila de tarifa y versión: usuarios, cuentas y comprobantes. | Todos | Adoptada · Replicar | M04 §6.18 |
| RN-TAR-195 | Métodos sin regla de negocio de ProCoop (accesores, cachés, consultas de interfaz, código muerto `Get_ConsumosCuadroTarifario`, clase `GetCampoServicio` no registrada, declaraciones de tipos… | Todos | Adoptada · Descartar | M04 §6.18 |
| RN-TAR-196 | La división de un consumo que abarca más días que el período (más del 10 % y menos del triple; mitades, por máximo de días, por cambio de medidor, por días) la hace M03 y marca grupo y segmento 1/2… | Todos | Adoptada · Delegar | M04 §6.19 |
| RN-TAR-197 | La distribución de consumos de un servicio padre a hijos (porcentaje, igualada, combinada con tope) la hace M03; los hijos reciben consumos estimados "Redistribución de Consumo" y el padre uno… | Todos | Adoptada · Delegar | M04 §6.19 |
| RN-TAR-198 | No existe tipo de energía propio para la inyección: es energía activa con consumo negativo (multiplicador negativo o medidor indicado); el registro del generador puede venir de telemedición. En el… | ELE | A validar · Replicar | M04 §6.19 |
| RN-TAR-199 | Una tarifa anterior debe seguir siendo reproducible aunque cambien los precios; se conserva copia de las reglas usadas en cada liquidación (versión inmutable + hash). | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-200 | Si no existe tarifa vigente o hay dos versiones incompatibles para el mismo caso, bloquear y pedir revisión. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-201 | Estructura de una regla: identidad (código, nombre, tenant, versión, autor, aprobación); ámbito (servicio, plan, grupo, contrato/suministro, beneficiario); jurisdicción y respaldo (país… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-202 | Precio unitario, cantidad, cargo fijo y escalas se expresan por separado; los beneficios se aplican sobre una parte de la cantidad o del precio sin extenderse automáticamente al total. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-203 | Distinguir beneficio por suministro/ubicación de condición general de la persona. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-204 | Grupos explícitos o por criterios aprobados con historial de altas y bajas. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-205 | Padrones por mecanismos autorizados (archivo, carga, API si existe) sin presuponer acceso a una API estatal; el derecho a un subsidio estatal no lo determina el sistema por su cuenta: requiere… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-206 | Distinguir descuento comercial financiado por la cooperativa, subsidio público y compensación a recuperar; no tratar una bonificación comercial como subsidio estatal ni inventar subsidios por usar un… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-207 | Descuentos acumulables o excluyentes con el orden exacto aplicado visible; topes. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-208 | Tributos por tipo de operación y contribuyente, con base imponible y exenciones válidas; sin suponer tasa única para todos los servicios. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-209 | Distinguir impuesto a facturar, percepción, retención recibida y gasto propio de la cooperativa; no trasladar todos como recargos al socio. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-210 | Tratar prorrateos, cambios de plan, suspensiones, reactivaciones y cambios de regla dentro de un período con criterio explícito por tramo. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-211 | Reglas por producto/subservicio y plan, incluidas promociones por cantidad definida de meses o ciclos. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-212 | Diferenciar facturación anticipada y vencida y determinar el primer período desde la activación efectiva. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-213 | Detallar la versión y los datos utilizados para reproducir cualquier cálculo histórico. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-214 | Simular con un conjunto de contratos antes de publicar, comparar totales e impacto por grupo y servicio. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-215 | Corregir documentos definitivos mediante el circuito de ajustes, sin reescribir sus cálculos originales. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-216 | Si dos reglas incompatibles pueden aplicar, se resuelve por prioridad explícita o revisión; nunca se elige silenciosamente. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-217 | No fijar en código categorías históricas, porcentajes ni bloques permanentes de subsidios; versionar regímenes y vigencias; registrar componente al que se aplica y origen de la acreditación; un… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-218 | Un campo configurable de cargo extra no habilita cualquier tasa o concepto: catálogo aprobado con fundamento, servicio, jurisdicción y documento permitido; un resumen de cuenta no disimula cargos… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-219 | La baja no tiene cargo por solicitarla (Ley 24.240 art. 10 quáter): ningún concepto puede tener disparador "solicitud de baja" ni naturaleza preaviso/mes adelantado por baja; la liquidación de… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-220 | No hay arancel universal de suspensión/reconexión: cada cargo se habilita por servicio y ámbito con fundamento y condiciones de gratuidad. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-221 | Antes de habilitar facturación productiva de un servicio, el checklist de BASE §52.4 (ámbito, prestaciones, tarifas, beneficios, tributos, cargos, bajas, documentos, responsables) debe estar… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-222 | Cada concepto tiene disparador: aprobación, instalación efectiva, inicio de período, evento técnico u otro hito definido; uno de una sola vez no se repite. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-223 | Evitar duplicar una instalación cobrada al contado y financiada, o sus cuotas, en dos módulos: el cargo de instalación tiene un único `chargeOriginId` y la financiación lo referencia. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-224 | Distinguir costo interno de prestar el servicio de importe a cobrar; ningún costo interno se factura sin concepto habilitado. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-225 | Conservar condiciones contratadas e historia de cambios sin aplicar silenciosamente una oferta nueva a contratos previos. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-226 | Al cumplirse la duración de una promoción, el abono vuelve al importe contractual vigente según la regla definida y el cambio se explica. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-227 | Electricidad: no equiparar kWh con kW; no aplicar tarifa mayorista como minorista; no extender un beneficio de una persona a cualquier suministro sin revisar su alcance; compras de energía, cargos de… | ELE | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-228 | Agua: régimen medido/no medido con fecha efectiva; no medidos por bases aprobadas (categorías o características del inmueble) sin lecturas ficticias; cargo fijo, bloques/franquicias y excedentes solo… | AG, CLO | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-229 | Gas: separar volumen medido, factores/correcciones, cantidad resultante y componente energético; versionar método y datos de origen; categorías, períodos de referencia, estacionalidad, cuadros y… | ELE, AG, GAS | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-230 | Internet: medición de tráfico/uso solo genera cargo con fuente definida; un abono de velocidad no convierte cada GB en cargo; facturación de períodos, promoción temporal y prorrateo bajo las reglas… | INT | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-231 | Usuario-generador (Ley 27.424): liquidar demanda e inyección como operaciones separadas en el mismo comprobante con su IVA; tarifa de inyección del régimen; cuenta de créditos (anterior, generado… | ELE | A validar · Adoptar | M04 §6.20 |
| RN-TAR-232 | Grandes usuarios: contratos con condiciones particulares (precio, potencia, plazo, penalidades) aprobados y versionados; lecturas por franja, demanda en punta y fuera de punta, reactiva con cargos… | ELE | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-233 | Publicación íntegra de configuración con dependencias, validaciones, simulación, revisión y fecha efectiva; separar cambios comerciales, fiscales y de presentación (una corrección de etiqueta no… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-234 | Fecha efectiva del hecho y fecha de registro con su origen; qué se corrige en borrador y qué exige ajuste; consultas históricas declaran qué fecha interpretan ("vigente al", "conocido al"). | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-235 | Representación decimal, precisión por concepto, redondeo explícito, moneda; el total no depende de la pantalla o proceso que lo consulte; ningún ajuste sin operación, causa, autor y contrapartida. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-236 | Fronteras de calendario: zona horaria del tenant; día de alta incluido; día de baja incluido como día prestado; meses de 28–31 días reales; año bisiesto; feriados solo afectan vencimientos (M05) y… | TEL | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-237 | Corrección recibida después de emitir: se simula la diferencia, se pide aprobación y documentación y se conserva el original; no se edita su total ni se crea otra obligación completa sin resolver la… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-238 | Cambio de condiciones en un período parcialmente procesado: se mantiene el universo y las versiones aplicadas; la nueva vigencia afecta solo pendientes salvo ajuste aprobado; reejecutar un lote no… | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-239 | No se precargan tarifas, porcentajes fiscales ni subsidios reales de ninguna jurisdicción; los datos de demostración son ficticios y se marcan así. | Todos | Adoptada · Adoptar | M04 §6.20 |
| RN-TAR-240 | El abono (P × Q, Q = 1 por período) se devenga desde la **fecha de activación efectiva** informada por M10; en mes adelantado, el primer comprobante incluye la fracción del mes de alta (días desde la… | Todos | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-241 | Instalación (ARS 30.000 en BASE §39.3 / ARS 20.000 en §72, ficticios) es un cargo por evento de una sola vez disparado por el hito configurado (instalación ejecutada o activación); si el contrato… | Todos | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-242 | Promoción por ciclos: cada comprobante emitido que aplica la promoción consume una unidad (ciclo); el ciclo parcial consume o no según la definición de la promoción (default PRM-TAR-016); al agotarse… | Todos | A validar · Adoptar | M04 §6.21 |
| RN-TAR-243 | Cambio de plan dentro del período: se registran ambos tramos de días con su plan y precio; la promoción del plan anterior termina o se traslada según la regla de la promoción (`onPlanChange`… | Todos | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-244 | Suspensión: durante días suspendidos el abono se liquida según la regla del servicio (`suspensionBilling`: cobrar / no cobrar / cobrar % ); reactivación sin cargo salvo cargo por evento habilitado… | Todos | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-245 | Ejemplo de referencia: abono ARS 25.000 − bonificación promocional 10 % = ARS 22.500; la instalación ARS 30.000 es un cargo distinto que no se suma todos los meses. | Todos | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-246 | Equipo no devuelto: (1) si PRM-TAR-169 = `false` o no hay `eventCharges` aprobado con `trigger = equipment_not_returned` para el tipo de equipo, EVT-STK-07 se registra sin efecto; (2) el cargo solo… | INT | A validar · Mejorar | M04 §6.21 |
| RN-TAR-247 | Servicio relacionado faltante: si un servicio configurado para tomar el consumo de otro (RN-TAR-015; ej. cloaca sobre agua) no encuentra el servicio relacionado, lo encuentra dado de baja o sin… | AG, CLO | Adoptada · Mejorar | M04 §6.21 |
| RN-TAR-248 | Cargo fijo por derecho (HUECO-CEM-01): (1) adquisición: precio del derecho (`productPrices`, `kind = cemetery_right`, por tipo de unidad/sector) al contado como cargo único o financiado como plan… | CEM | Adoptada · Adoptar | M04 §6.21 |
| RN-TAR-249 | Cargo por traslado (HUECO-SAL-01), por cada `soc.trip.completed` (EVT-SOC-07) idempotente por `tripId`: (1) tarifa base según el modo de `tripPricing`: `per_km` = km × `perKmPrice`; `fixed` =… | SAL | A validar · Replicar | M04 §6.21 |
| RN-TAR-250 | Régimen de medición (HUE-AG-03; RN-CAT-078 de M02): el régimen vigente del contrato a cada fecha se toma del historial de M02 (`serviceContractHistory`, EVT-CAT-28). (1) Paso a `metered`: hasta la… | AG | Adoptada · Mejorar | M04 §6.21 |
| RN-TAR-251 | Cupo de correo y pack SMS (DEC-084): (1) el plan del servicio (M02) define `includedQuota` y la unidad (`sms`, `mailbox`, `gb`); el precio del cargo fijo y el `excessUnitPrice` se versionan en… | Todos | A validar · Mejorar | M04 §6.21 |

<a id="catalogo-m05-fac"></a>

### M05 FAC — Facturación (161 reglas)

Fuente: [`M05-FAC-facturacion.md`](../especificacion/anexos/M05-FAC-facturacion.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-FAC-001 | La configuración de una corrida es una plantilla versionada separada de la clasificación comercial. | Todos | Adoptada · Mejorar | M05 §6.1 |
| RN-FAC-002 | Las fechas de la plantilla son expresiones declarativas; el lote guarda la fecha resuelta. | Todos | A validar · Reemplazar | M05 §6.1 |
| RN-FAC-003 | Destinatarios: todas, una, varias (con importación Excel) o cuentas de control. "Cuentas de control" se procesa como "varias" pero queda marcada como muestra. | Todos | A validar · Mejorar | M05 §6.1 |
| RN-FAC-004 | Un lote puede facturar el mismo período más de una vez solo con una **secuencia** distinta y motivo (bimestral partido, refacturación). | Todos | A validar · Mejorar | M05 §6.1 |
| RN-FAC-005 | El orden de emisión define el orden de numeración. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-006 | Opciones del lote: forzar cuadro tarifario histórico con fecha de vigencia, no aplicar anticipos, no cobrar envío, simulación. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-007 | No existe ejecución real sin registro del lote. | Todos | Adoptada · Descartar | M05 §6.1 |
| RN-FAC-008 | "Una cuenta" exige la cuenta; "varias" exige al menos una. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-009 | El período general no puede ser anterior a 5 años y el desde no puede superar al hasta. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-010 | Debe haber servicios o cuotas; cada servicio con período; cada servicio medido con rango de lecturas. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-011 | Si se facturan cuotas sin lista explícita, se exige rango de fechas de cuotas. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-012 | Tipo de factura obligatorio. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-013 | Ningún vencimiento anterior a hoy; Vto1 ≤ Vto2 ≤ Vto3 ≤ Vto4; próximo vencimiento > último vencimiento. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-014 | Vencimientos y próximo vencimiento en día hábil del calendario del tenant. | Todos | A validar · Mejorar | M05 §6.1 |
| RN-FAC-015 | Si la distancia Vto4 − Vto1 supera 60 días, ningún intervalo entre vencimientos consecutivos puede superar 60 días. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-016 | No se emite con fecha anterior al cierre del módulo de facturación. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-017 | Deben estar configurados los conceptos obligatorios para facturar (interés por mora, interés anterior, interés por financiación, impuesto IVA, interés de venta, descuento de venta). | Todos | A validar · Replicar | M05 §6.1 |
| RN-FAC-018 | Para cada condición fiscal debe resolverse un comprobante de débito y uno de crédito para los servicios del lote. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-019 | Prerrequisitos fiscales y de estado: CESP vigente para servicios públicos, padrón IIBB vigente, sin pendientes de autorización antiguos, sin registración de capital en curso, exclusión mutua de la… | Todos | Adoptada · Mejorar | M05 §6.1 |
| RN-FAC-020 | Se excluyen cuentas cuyo último registro "no facturar" está activo. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-021 | Con filtros, el universo "todas" se restringe por conjunto, zonas postales, empresa postal, localidad postal, zona/sector de lectura y categorías, considerando solo servicios conectados. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-022 | Entra una cuenta si tiene algún servicio seleccionado, no marcado "no facturar" y no dado de baja hace más de 6 meses respecto del período, o si tiene cuotas pendientes. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-023 | Un servicio entra si está conectado, o tiene consumos sin facturar (salvo servicios cotizados relacionados), o cargos pendientes del período o sin período, o es baja con cobro proporcional de cargo… | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-024 | En venta de prepaga solo entran categorías prepagas en servicios medidos. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-025 | Con filtro "altas anteriores a", solo entran servicios dados de alta antes de esa fecha. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-026 | Un servicio solo se factura si su último período facturado es anterior al período, o es el mismo con otra secuencia, o tiene consumos o cargos nuevos. La marca vive en el registro de períodos… | Todos | Adoptada · Reemplazar | M05 §6.1 |
| RN-FAC-027 | Cuotas a facturar: sin comprobante, no anuladas ni facturadas; con lista explícita, esas; si no, cuotas normales con vencimiento hasta la fecha hasta y no anteriores a la fecha desde − 10 meses, más… | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-028 | Muestra de control: una cuenta al azar por categoría, una por condición fiscal, una de grandes y una de pequeños consumos. | Todos | Adoptada · Replicar | M05 §6.1 |
| RN-FAC-029 | Un contrato-servicio solo puede pertenecer a un ciclo vigente por servicio y período. | Todos | Adoptada · Nuevo | M05 §6.1 |
| RN-FAC-030 | El universo de un lote preparado es inmutable; cualquier cambio crea una versión nueva con diferencias y motivo. | Todos | Adoptada · Nuevo | M05 §6.1 |
| RN-FAC-031 | La simulación usa el mismo motor que la emisión y no tiene efectos (no numera, no persiste, no consume). | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-032 | Si un servicio de la cuenta da error, la cuenta no se factura y el error queda por servicio. | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-033 | Un fallo de armado de un bloque no corta todo el proceso: si es sistémico, se pausa el lote; si es individual, se aísla el caso. | Todos | Adoptada · Reemplazar | M05 §6.2 |
| RN-FAC-034 | Un servicio "facturar con otros" solo se factura si el comprobante ya tiene ítems de otro servicio; se procesan primero los que no son "con otros". | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-035 | Las cuotas asociadas a un servicio van con ese servicio; las de un tipo de cuota con grupo propio van a ese grupo; el resto al grupo por defecto. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-036 | Los comprobantes candidatos se arman por (cuenta/titular, grupo de facturación); los cargos que una fórmula manda a otro grupo se suman al comprobante de ese grupo o crean uno nuevo. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-037 | Criterio de emisión: algún renglón ≠ 0; o, con la opción, consumos aunque el importe sea 0. ProCoop agregaba un criterio adicional solo en simulación. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-038 | Grupo 0 toma el grupo cuyo tipo es el de la corrida; un grupo con "forzar ND" emite nota de débito; un grupo con tipo propio impone su tipo (salvo prepaga). | Todos | A validar · Replicar | M05 §6.2 |
| RN-FAC-039 | Total negativo: se invierten signos de los renglones y el comprobante pasa a crédito; después de cargos finales, se busca el comprobante "de anulación" del actual. Con concepto de GD configurado y… | ELE | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-040 | Si algún servicio liquida como servicio público ante ARCA: importe < 0 → crédito de servicio público; si no → factura de servicio público (según la matriz de la condición fiscal). | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-041 | Si los servicios del comprobante tienen comprobante propio y todos coinciden, se usa ese. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-042 | Ajuste de signo: importe < 0 y era factura/ND → NC; importe > 0 y era NC → factura. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-043 | MiPyME: si la cuenta es MiPyME y el importe supera el umbral, se usan los comprobantes FCE de la matriz; si no, el comprobante de la clasificación comercial, luego el por defecto, luego el genérico… | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-044 | El comprobante elegido debe estar entre los habilitados para la condición fiscal del receptor; un comprobante restringido a RI y Monotributo no se emite a otros; uno marcado "no válido para RI" no se… | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-045 | Validaciones del comprobante individual: cuenta obligatoria; punto de venta ≠ 0 salvo internos habilitados; número ≠ 0 si no es autonumérico; tipo ≠ 0; año entre 1997 y 2050; al menos un renglón… | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-046 | Al facturar se valida el total del comprobante contra la suma de renglones y tributos con la precisión de AGR-011. | Todos | Adoptada · Nuevo | M05 §6.2 |
| RN-FAC-047 | Punto de venta: (1) interno con PV 0 si está habilitado; (2) PV propio de los servicios, si todos coinciden (si hay dos distintos: excepción); (3) PV del grupo de facturación; (4) PV del canal o… | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-048 | Numeración: la clave es (tipo de numeración, PV); un tipo con "comparte numeración" usa la del relacionado (por ejemplo FA y ND A). | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-049 | El número se asigna dentro de la misma transacción que persiste el comprobante y actualiza el numerador; si el bloque falla, no se consumen números. | Todos | Adoptada · Reemplazar | M05 §6.2 |
| RN-FAC-050 | Un numerador inexistente no se crea implícitamente. | Todos | Adoptada · Reemplazar | M05 §6.2 |
| RN-FAC-051 | Un número ya existente para el tipo (o su relacionado) no se reutiliza; la reparación del numerador es explícita. | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-052 | La numeración del lote es correlativa en el orden de emisión; la numeración forzada solo se permite si el lote genera un único comprobante. | Todos | Adoptada · Replicar | M05 §6.2 |
| RN-FAC-053 | Tipo de autorización resultante según el numerador: CAEA vigente para la fecha si el numerador lo admite; si no hay y también es CAE, queda pendiente de CAE; CAE → pendiente; CAI → asigna CAI y… | Todos | A validar · Replicar | M05 §6.2 |
| RN-FAC-054 | Con autorización CAE, un comprobante con alguna alícuota de base negativa aborta. | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-055 | Los comprobantes pendientes de autorización no se envían automáticamente a los canales hasta autorizarse. | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-056 | La emisión masiva procesa por bloques con transacción por bloque; el progreso se persiste por bloque. | Todos | A validar · Mejorar | M05 §6.2 |
| RN-FAC-057 | El cálculo puede paralelizarse por bloques; la numeración y persistencia respetan el orden de emisión. | Todos | Adoptada · Mejorar | M05 §6.2 |
| RN-FAC-058 | En comprobantes individuales, Vto1 no puede ser anterior a hoy ni posterior a hoy + N días. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-059 | En comprobantes sueltos las cuatro fechas son, por defecto, la fecha de hoy; el usuario puede indicar otras. | Todos | Adoptada · Mejorar | M05 §6.3 |
| RN-FAC-060 | Si un vencimiento no es posterior al anterior, repite el importe del anterior. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-061 | Modo fijo en pesos: Vto2 = T + r; Vto3 = T + 2r; Vto4 = T + 3r, sin IVA. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-062 | Modo porcentaje fijo: Vto2 = T·(1 + r %) + IVA; Vto3 y Vto4 capitalizan sobre el anterior. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-063 | Modo porcentaje variable: T + T·r %·días entre Vto1 y el vencimiento + IVA. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-064 | Trama por importe: se busca la trama cuyo rango de importe contiene T (por tipo de factura o genérica); recargo = T·valor %·días (o importe fijo si el tipo de valor es 1) + IVA. ProCoop calcula Vto3… | Todos | A validar · Mejorar | M05 §6.3 |
| RN-FAC-065 | Trama por vencimiento: la fila con rango 1–1 aplica a Vto2, 2–2 a Vto3, 3–3 a Vto4 (o la primera genérica); recargo = T·valor %·días + IVA. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-066 | Al recargo se le suma el IVA del concepto de interés según la condición fiscal del titular (cálculo de M06). | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-067 | Consistencia: si Total2 < Total, se igualan los tres totales posteriores al total. | Todos | Adoptada · Replicar | M05 §6.3 |
| RN-FAC-068 | Redondeo de los cuatro totales a 2 decimales salvo configuración contraria, cuando la emisión ≠ Vto1 y no es CAE. | Todos | Adoptada · Mejorar | M05 §6.3 |
| RN-FAC-069 | Los recargos entre vencimientos se imprimen y codifican; el interés por mora devengado después del último vencimiento lo calcula M08 y se factura en un documento posterior. | Todos | Adoptada · Nuevo | M05 §6.3 |
| RN-FAC-070 | El estado "pendiente de autorización" no es un bloqueo de cobro y vive en el estado fiscal. | Todos | Adoptada · Reemplazar | M05 §6.4 |
| RN-FAC-071 | Solo se bloquean comprobantes impagos; cada cambio deja historial (fecha, causa, usuario); causa nula = desbloqueo. Se procesa en bloques. | Todos | Adoptada · Replicar | M05 §6.4 |
| RN-FAC-072 | Listar comprobantes bloqueados no modifica datos. | Todos | Adoptada · Descartar | M05 §6.4 |
| RN-FAC-073 | La alternancia bloquear/desbloquear desde cobranzas es una acción explícita con causa. | Todos | Adoptada · Mejorar | M05 §6.4 |
| RN-FAC-074 | No se anula algo ya anulado. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-075 | No se elimina un comprobante; ProCoop permite eliminar si no tiene pagos ni financiaciones. | Todos | Adoptada · Reemplazar | M05 §6.5 |
| RN-FAC-076 | Un comprobante autorizado por ARCA no se anula: se revierte con otro comprobante, previa confirmación. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-077 | Un comprobante incluido en una solicitud de cobro de pasarela activa no se anula hasta que la solicitud esté en estado no cobrado (M07 informa). | Todos | A validar · Replicar | M05 §6.5 |
| RN-FAC-078 | En operaciones masivas, los comprobantes con pagos se excluyen con lista de excluidos; los autorizados se revierten con NC (no se anulan en masa). | Todos | Adoptada · Mejorar | M05 §6.5 |
| RN-FAC-079 | Se excluyen los de fecha anterior o igual al cierre del módulo (en individual, error con la fecha de cierre). | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-080 | Si hay comprobantes pendientes de autorización, la anulación exige doble confirmación y M06 debe confirmar que no fueron autorizados (consulta) antes de anular. | Todos | Adoptada · Mejorar | M05 §6.5 |
| RN-FAC-081 | Las ventas de prepaga se excluyen de la anulación masiva. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-082 | Un comprobante no puede revertirse dos veces: si ya existe una relación con un comprobante de signo opuesto por el mismo total, error. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-083 | Revertir servicios públicos exige CESP vigente; un anticipo ya utilizado no se anula; si toca rubros de capital, se valida con M17. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-084 | Al anular o revertir se libera todo lo consumido (consumos sin factura; prepaga se elimina el consumo de venta; llamadas, internacionales y cargos sin factura; cuotas pendientes; presupuesto a "P"… | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-085 | El período facturado se retrocede eliminando (lógicamente) el registro de `billedPeriods` del comprobante. ProCoop resta 1 a `CNT_FAC` y retrocede período/secuencia; en obras y viviendas descuenta… | VIV | Adoptada · Reemplazar | M05 §6.5 |
| RN-FAC-086 | Si se anula la factura que cobró el último franqueo de la cuenta, se retrocede el envío registrado. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-087 | Se devuelve al acumulador de redondeo de la cuenta (o por tipo de factura) lo que el comprobante había aplicado (M04/M07). | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-088 | Comprobante de reversión: CVLP con número → "CVLP débito"; forzar LSP → crédito SP de la condición fiscal; forzar electrónica → NC por defecto; si el tipo tiene comprobante de anulación → ese; si no… | TEL | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-089 | El comprobante de reversión es un clon con fecha de hoy, vencimientos de hoy o indicados (no anteriores a hoy ni desordenados), los 4 totales = total 1, saldo pleno, número nuevo y renglones… | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-090 | Revertir consumos inserta un consumo espejo negativo con estados invertidos; "permitir volver a facturar" inserta además una copia sin facturar; si no, retrocede el estado de lectura. | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-091 | Revertir stock genera entrada de productos con stock, salvo comprobantes de tipos excluidos configurados. | Todos | Adoptada · Mejorar | M05 §6.5 |
| RN-FAC-092 | La relación manual muestra comprobantes de la misma cuenta, no internos ni anulados, de los últimos N días, y graba las marcas "anulación" e "informar CUIT". | Todos | Adoptada · Replicar | M05 §6.5 |
| RN-FAC-093 | En la masiva, las relaciones se generan con su propia estructura. | Todos | A validar · Descartar | M05 §6.5 |
| RN-FAC-094 | Ninguna corrección edita un comprobante emitido: toda diferencia es NC, ND o refacturación vinculada. | Todos | Adoptada · Nuevo | M05 §6.5 |
| RN-FAC-095 | Energía por ahorro: Ahorro = 100 − actual/anterior·100 (opcionalmente en consumo diario); si ≥ 0, la categoría del mismo grupo cuyo rango contiene el ahorro; si es negativo, se desplaza desde el… | ELE | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-096 | Energía por consumo total: la categoría del mismo grupo de consumo cuyo rango contiene el consumo actual. | ELE | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-097 | Gas por 6/12 períodos: suma de consumos de los últimos 12 períodos (o bimestres, o por fecha de lectura); en modo corregido aplica factor calórico, presión y temperatura; "proporcional 365" lleva a… | GAS | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-098 | Gas por cambio de cuadro: exige cuadros A, B, S y H por categoría ENARGAS; compara con el mismo período del año anterior (o el anterior a ese si no hay datos, salvo "TEMP"); E se mantiene… | GAS | Adoptada · Mejorar | M05 §6.6 |
| RN-FAC-099 | El filtro "nunca recategorizados" se aplica efectivamente. | Todos | A validar · Descartar | M05 §6.6 |
| RN-FAC-100 | La confirmación guarda categoría anterior y nueva, fecha, períodos, consumo y método; actualiza la categoría de consumos no facturados; deja nota en la cuenta; todo atómico. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-101 | Retroactivo proceso 0: sobre consumos facturados del período (y opcionalmente el anterior) con filtros de conceptos, cuenta, zona, bajas y categorías (de la lectura, del servicio o cambio desde… | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-102 | Retroactivo proceso 1: sobre renglones de comprobantes del rango con un concepto o impuesto base, importe fijo o porcentaje. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-103 | Interés del retroactivo = total × días entre emisión y próxima facturación × tasa, con **signo explícito** según la operación sea cobro o devolución. | Todos | A validar · Mejorar | M05 §6.6 |
| RN-FAC-104 | Validaciones del retroactivo: concepto obligatorio; importe, porcentaje o proporcional; proporción ≠ 0 sin importe; rangos coherentes; servicio obligatorio; concepto base en proceso 1; con interés… | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-105 | Los retroactivos generan ítems facturables con comprobante de origen, período base, tramas y tipo de factura, más uno por interés; nunca comprobantes. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-106 | Modificación masiva: fecha nueva = fija u original + N días (opcionalmente al día hábil siguiente), nunca ambas; importes 2–4 = total 1 + valor o total 1 × valor. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-107 | La modificación masiva excluye siempre los comprobantes anteriores al cierre de facturación y los de emisión ≤ máximo entre el cierre de ventas y la otra fecha de cierre; la emisión nueva no puede… | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-108 | Comprobantes autorizados: ProCoop pregunta si incluirlos advirtiendo problemas con ARCA. | Todos | Adoptada · Mejorar | M05 §6.6 |
| RN-FAC-109 | Cada modificación deja auditoría por comprobante con valores anteriores y nuevos. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-110 | La modificación de cuotas (porcentaje, costo, desplazamiento, IVA, tipo de cuota) deja nota por comprobante y movimiento de capital si cambió el capital; usa la tasa correcta para la sobretasa. | Todos | Adoptada · Replicar | M05 §6.6 |
| RN-FAC-111 | Por defecto, ventas y cuotas se facturan en documentos propios; solo se incluyen en la factura del servicio los conceptos vinculados a ese servicio con validación fiscal. | Todos | Adoptada · Mejorar | M05 §6.7 |
| RN-FAC-112 | El renglón de cuota lleva su IVA y percepción (IIBB solo si la base supera el mínimo, M06); al emitir, la cuota queda facturada con el id del comprobante. | Todos | Adoptada · Replicar | M05 §6.7 |
| RN-FAC-113 | Un concepto de terceros solo se incluye con convenio y fundamento vigentes; se exhibe separado del cargo propio. | Todos | Adoptada · Nuevo | M05 §6.7 |
| RN-FAC-114 | Importaciones: se completa titular y condición fiscal, se marcan errores ("CUENTA INEXISTENTE", "CONCEPTO INEXISTENTE") y se calcula el IVA por concepto y condición. CT1 falla si el socio no tiene o… | GAS | Adoptada · Replicar | M05 §6.7 |
| RN-FAC-115 | EME con cantidad 0 no divide por cero y no se calcula el cruce por DNI no usado; FAR no asume códigos de producto consecutivos. | Todos | Adoptada · Descartar | M05 §6.7 |
| RN-FAC-116 | Selección de plantilla: forzada si existe; CVLP; plantilla de la clasificación comercial; la del primer servicio que la tenga; la genérica; prepaga con su plantilla; variantes electrónica… | TEL | Adoptada · Reemplazar | M05 §6.8 |
| RN-FAC-117 | El código de cuenta para redes es la cuenta con 9 dígitos; el domicilio impreso es el histórico de la cuenta a la fecha de emisión. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-118 | Órdenes de impresión disponibles: calle y número, cuenta, ZSR postal, comprobante, alfabético, titular, ZSR de lectura, código postal y cuenta. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-119 | Salidas: todas, solo electrónicas por mail o WhatsApp, no electrónicas, todas por mail, PDF, SMS/WhatsApp. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-120 | Talones: si ya existían se historizan; se agrupan por cuenta, grupo de talón y orden de talón; el talón suma los 4 importes (créditos restan) y toma los vencimientos del primero; los números se… | Todos | Adoptada · Mejorar | M05 §6.8 |
| RN-FAC-121 | Talones-cuota: la última cuota absorbe el redondeo. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-122 | Piezas postales numeradas por zona/sector/recorrido; orden y sub-orden "i/n" por titular y recorrido. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-123 | Formato por defecto y convenio del tenant; si falta alguno, no se imprime código. Los formatos aceptados en lectura son los asignados a recaudadores más el por defecto. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-124 | La lectura rechaza caracteres no numéricos salvo formatos declarados alfanuméricos. | Todos | Adoptada · Mejorar | M05 §6.8 |
| RN-FAC-125 | Decodificación genérica: 41 → comprobante por id; 42 → talón; 40 → notificación (o lote + cuenta); 43 → solicitud de pasarela; 21–23 → socio/cuenta + agrupador + vencimiento; 99 → cuenta +… | TV | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-126 | Importes en centavos con ceros a la izquierda; fechas con formato explícito; juliana AADDD; los créditos se codifican con el valor absoluto. | Todos | Adoptada · Mejorar | M05 §6.8 |
| RN-FAC-127 | Si falta el comprobante, ProCoop deja el código en ceros. | Todos | Adoptada · Reemplazar | M05 §6.8 |
| RN-FAC-128 | Pago Fácil 46: una notificación cae en el modo heredado; Pago Fácil 46_2 y 50_2 no implementan notificación; Banco de Córdoba 50_2 repite el tercer tramo y divide por cero con total 0; Banco de… | Todos | A validar · Descartar | M05 §6.8 |
| RN-FAC-129 | SIRO–Banco Roela 56: empresa 0447 + tipo (0 factura en LAG, 5 notificación, 9 talón) + id 8 + Vto1 AAMMDD + importe 7 + días 2 + importe 7 + días (o días máximos desde el último vencimiento) +… | Todos | A validar · Replicar | M05 §6.8 |
| RN-FAC-130 | QR de pasarela: solo si la solicitud tiene id de QR, no es débito automático y el 2.º vencimiento no pasó; EMVCo con formato 01, dinámico 12, identificador del proveedor, CUIT, MCC, moneda 032, país… | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-131 | La impresión toma la primera solicitud de pasarela no anulada; hasta tres códigos por solicitud. | Todos | Adoptada · Replicar | M05 §6.8 |
| RN-FAC-132 | La variación por cooperativa se expresa como configuración (formatos, plantillas, políticas), nunca por sigla. | Todos | Adoptada · Reemplazar | M05 §6.8 |
| RN-FAC-133 | El grupo de facturación agrupa la presentación fiscal y comercial; no fusiona contratos, deudas ni protecciones; la mora y el corte se evalúan por servicio. | Todos | Adoptada · Replicar | M05 §6.9 |
| RN-FAC-134 | Un grupo no agrupa distintos titulares, CUIT/DNI ni tenants, ni servicios que exigen documento independiente. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-135 | La modalidad efectiva de un caso se resuelve por prioridad: excepción por titular → por cuenta → por servicio → default del tenant, vigente al período. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-136 | Desarmar un grupo rige desde el período siguiente y no reabre períodos cerrados. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-137 | El lote no puede aparentar como facturados casos pendientes; el cierre exige que la suma de estados cuadre con el universo. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-138 | Las excepciones trasladadas al próximo ciclo conservan su id, responsable y antigüedad. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-139 | Un lote cerrado no admite nuevas emisiones; los casos pendientes se emiten en un lote de reproceso vinculado al ciclo siguiente o en uno de reproceso del mismo período si el cierre se reabre. | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-140 | Cambiar la configuración tarifaria o de reglas durante un período parcialmente procesado no reescribe emitidos; los pendientes usan la versión congelada salvo re-preparación aprobada con explicación… | Todos | Adoptada · Nuevo | M05 §6.9 |
| RN-FAC-141 | La propuesta de próxima facturación es fin de mes + 10 o un mes después de la última si fue hace menos de 60 días. | Todos | Adoptada · Replicar | M05 §6.9 |
| RN-FAC-142 | Al cerrar el lote, si la política está activa, cada cuenta con comprobantes bloqueados (causa de cobro) propaga la causa mínima a los comprobantes del día sin bloqueo. | Todos | Adoptada · Replicar | M05 §6.9 |
| RN-FAC-143 | Si hay rubros de capital y la política no lo desactiva, se registra capital sobre lo facturado al cerrar el lote. | Todos | Adoptada · Replicar | M05 §6.9 |
| RN-FAC-144 | Importes en `Decimal128` con `decimal.js`; precios unitarios hasta 6 decimales; importes a 2; redondeo explícito por concepto. | Todos | Adoptada · Reemplazar | M05 §6.10 |
| RN-FAC-145 | El saldo de un comprobante no se guarda como campo editable en FAC; lo deriva M07 de movimientos e imputaciones. | Todos | Adoptada · Reemplazar | M05 §6.10 |
| RN-FAC-146 | Toda operación económica o de integración acepta `Idempotency-Key` y una clave de negocio estable. | Todos | Adoptada · Nuevo | M05 §6.10 |
| RN-FAC-147 | Fechas en UTC y cortes/vencimientos en la zona horaria del tenant. | Todos | Adoptada · Reemplazar | M05 §6.10 |
| RN-FAC-148 | Ninguna consulta se arma concatenando valores de filtros. | Todos | Adoptada · Reemplazar | M05 §6.10 |
| RN-FAC-149 | Las reglas de negocio no muestran diálogos: devuelven advertencias que la UI confirma. | Todos | Adoptada · Reemplazar | M05 §6.10 |
| RN-FAC-150 | Un mismo concepto de error de informes se corrige en el reporte equivalente: IVA del interés con el factor correcto, filtro de sucursal sobre el punto de venta, signo de todas las alícuotas en… | Todos | Adoptada · Descartar | M05 §6.10 |
| RN-FAC-151 | El orden de renglones se recalcula sin huecos ni duplicados. | Todos | Adoptada · Descartar | M05 §6.10 |
| RN-FAC-152 | Un renglón de stock se identifica por producto y precio en todas las operaciones. | Todos | Adoptada · Descartar | M05 §6.10 |
| RN-FAC-153 | Con descuento, el IVA se calcula sobre el neto con descuento. | Todos | Adoptada · Descartar | M05 §6.10 |
| RN-FAC-154 | Revisión previa (HUE-ELE-02): (1) un caso entra en `reviewPending` si alguna cuenta del caso pertenece a una categoría o condición especial de PRM-FAC-161 o si el cálculo de M04 trae `requiresReview`… | ELE | Adoptada · Nuevo | M05 §6.2 |
| RN-FAC-155 | Dependencia de servicios relacionados (HUE-CLO-02): al preparar, por cada contrato cuyo servicio toma el consumo de otro (configuración `REL_SER`/`USA_COT` de M02, RN-TAR-015) se registra la… | CLO | Adoptada · Mejorar | M05 §6.1 |
| RN-FAC-156 | Clases de ítem facturable (`itemClass`): (1) `guaranteeDeposit` (depósito en garantía, por ejemplo del préstamo ortopédico de M18 o la garantía de M08 RF-MOR-179): se exhibe en un bloque propio… | SEP, CEM, OTR | Adoptada · Nuevo | M05 §6.7 |
| RN-FAC-157 | Entidad jurídica del comprobante (DEC-064, DEC-087): cada caso del lote se divide por `legalEntityId` del contrato (`serviceContracts.legalEntityId`, opcional) o, si está vacío, del servicio del… | Todos | Adoptada · Nuevo | M05 §6.7 |
| RN-FAC-158 | Cambio de régimen de medición (EVT-CAT-28; HUE-AG-03): (1) si el evento llega con `effectiveAt` dentro del período de un lote preparado y no emitido, los casos del contrato se marcan afectados y se… | AG | Adoptada · Nuevo | M05 §6.7 |
| RN-FAC-159 | Elegibilidad por hechos de M02/M10 y M18 (decisiones vigentes): (1) un contrato es facturable desde el hecho de activación, es decir, la confirmación técnica de instalación y aprovisionamiento; la… | Todos | Adoptada · Adoptar | M05 §6.1 |
| RN-FAC-160 | Identificadores y tenants especiales: (1) los códigos de pago (`paymentCodes`) usan un identificador nuevo autocontenido; para comprobantes migrados, el decodificador también resuelve por la clave… | TV | Adoptada · Adoptar | M05 §6.1 |
| RN-FAC-161 | Numeración de recibos (RF-FAC-179): (1) el numerador se identifica por `{legalEntityId, voucherTypeId, pointOfSaleId}` y debe existir y estar `active`; (2) el punto de venta debe pertenecer a la… | Todos | A validar · Nuevo | M05 §6.7 |

<a id="catalogo-m06-fis"></a>

### M06 FIS — Fiscal e impuestos (132 reglas)

Fuente: [`M06-FIS-fiscal-impuestos.md`](../especificacion/anexos/M06-FIS-fiscal-impuestos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-FIS-001 | Existen dos modos frente a ARCA: comprobantes propios y pasarela para sistemas externos. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-002 | Un comprobante que requiere CAE nace "emitido pendiente de autorización" y no es fiscalmente válido hasta autorizarse. | Todos | Adoptada · Reemplazar | M06 §6.1 |
| RN-FIS-003 | Los tenants de demostración no pueden autorizar en producción. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-004 | Para autenticar se exige certificado vigente y URLs del ambiente. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-005 | El TA se reutiliza mientras no venza; caché compartido. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-006 | El `uniqueId` del pedido de TA debe ser único. | Todos | Adoptada · Reemplazar | M06 §6.1 |
| RN-FIS-007 | Ventana del loginTicketRequest: generación −10 min, expiración +10 min. | Todos | Adoptada · Replicar | M06 §6.1 |
| RN-FIS-008 | El vencimiento del certificado se registra al firmar y se alerta. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-009 | Certificado vencido: ARCA no autoriza más comprobantes. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-010 | El certificado debe contener la clave privada. | Todos | Adoptada · Reemplazar | M06 §6.1 |
| RN-FIS-011 | El CUIT representado es el configurado. | Todos | Adoptada · Reemplazar | M06 §6.1 |
| RN-FIS-012 | Cliente con TLS 1.2+ y timeout. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-013 | Ningún secreto (token, sign, clave) se muestra en errores ni logs. | Todos | Adoptada · Mejorar | M06 §6.1 |
| RN-FIS-014 | Pendiente = comprobante de un par (tipo × punto) con modalidad CAE y punto no pausado, sin CAE. | Todos | Adoptada · Reemplazar | M06 §6.2 |
| RN-FIS-015 | El importe total informado incluye anticipos. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-016 | Se envía en tandas ordenadas por número, agrupadas por tipo y punto. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-017 | La autorización automática se activa/desactiva por tenant y punto con auditoría. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-018 | Espera sincrónica para ventas/cobranzas que generan factura. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-019 | Alerta de pendientes con antigüedad mayor a N días. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-020 | Exclusión mutua por par para que dos procesos no autoricen lo mismo. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-021 | No se autoriza si hay un comprobante anterior pendiente del mismo par. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-022 | Numeración correlativa: un hueco detiene la tanda informando el primer faltante. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-023 | El código ARCA del tipo debe estar configurado y ser numérico. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-024 | Agrupación en rango solo para códigos 6, 7, 8, 9, 10, 11, 12, 13, 15, 35, 40, 49, 61, 64, consecutivos y bajo el tope; receptor 99/0; importes sumados y alícuotas/tributos fusionados por código. | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-025 | Receptor: CUIT (80) si el comprobante es para RI (clase A); si no, código del tipo de documento. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-026 | Documento no convertible a número. | Todos | A validar · Reemplazar | M06 §6.2 |
| RN-FIS-027 | CUIT con 8 dígitos (DNI). | Todos | Adoptada · Reemplazar | M06 §6.2 |
| RN-FIS-028 | `CondicionIVAReceptorId` desde la condición del receptor. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-029 | Concepto: 1 si hay ítems de producto, 2 si solo servicios, 3 si ambos, 1 si no hay ítems; en lote mezclado, 3. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-030 | Fechas de servicio = primer y último día del período facturado; si no se puede convertir, mes de emisión; vencimiento de pago = primer vencimiento si concepto > 1. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-031 | Moneda PES con cotización 1 salvo moneda extranjera. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-032 | `ImpNeto` = Σ neto de ítems gravados (alícuota ≠ 0, sin impuesto asociado); `ImpOpEx` = Σ ítems con alícuota 0 (excluye tipo 5); `ImpTotConc` = no gravados (impuestos de origen 0, subtipo 0)… | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-033 | Clase C: el exento se suma al neto y `ImpOpEx = 0`. | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-034 | Alícuotas: agrupar ítems de IVA por porcentaje y cruzar con la tabla; descartar base e importe < 0,01; redondeo a 3 decimales al agrupar y 2 al enviar. | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-035 | Tributos: Id por tabla de mapeo explícita; agrupación por (Id, alícuota, descripción). | Todos | A validar · Reemplazar | M06 §6.2 |
| RN-FIS-036 | Impuesto "otros" no gravado. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-037 | Todos los importes a 2 decimales; si `ImpTotal ≤ 0,03` todo exento sin IVA; diferencia positiva < 0,03 se suma al exento. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-038 | FCE MiPyME: vencimiento de pago (anulado en NC y 202); 2101/2102 salvo ND/NC; 27 en 201/206/211; 22 en 203/208/213 según la relación. | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-039 | Asociados: relacionados con código ARCA, no internos, fiscales, autorizados con CAE y no marcados "no mostrar"; CUIT del emisor si la relación lo pide, o del receptor si tiene 11 dígitos. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-040 | `PeriodoAsoc` si hay relaciones pero ninguna autorizada con CAE: desde el período mínimo (no antes de 02-01-2006) hasta fin de ese mes, recortado a la emisión; ND/NC A y B sin asociados: período de… | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-041 | Vista previa del request. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-042 | Resultado `A`: CAE, vencimiento `yyyyMMdd`, observaciones. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-043 | Error 10016 (número/fecha no es el próximo): consultar si ya está autorizado; si coincide el importe, tomarlo; si no, informar el último autorizado. | Todos | A validar · Replicar | M06 §6.2 |
| RN-FIS-044 | Error 10040 (asociados): no reenviar los asociados problemáticos. | Todos | A validar · Mejorar | M06 §6.2 |
| RN-FIS-045 | Errores 10242/10243 (condición IVA del receptor). | Todos | A validar · Reemplazar | M06 §6.2 |
| RN-FIS-046 | Resultado parcial `P` se procesa por detalle; rechazo agrupado → reintento individual. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-047 | Desbloqueo condicionado a otras facturas bloqueadas de la cuenta con saldo. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-048 | Conciliación: por cada comprobante consultar ARCA; CAE distinto; total distinto con tolerancia 0,02 (sumando el rango si fue lote); reparar copiando CAE y vencimiento de ARCA. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-049 | Consultar CAE de un comprobante CAEA lo marca informado. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-050 | Un comprobante del modo pasarela solo se elimina si no tiene CAE. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-051 | Puntos de venta válidos de ARCA: no bloqueados y sin fecha de baja. | Todos | Adoptada · Replicar | M06 §6.2 |
| RN-FIS-052 | Las tablas paramétricas de ARCA se descargan y describen comprobantes y asociados. | Todos | Adoptada · Mejorar | M06 §6.2 |
| RN-FIS-053 | Prioridad de autorización al numerar: CAEA vigente (si el par es CAEA) → CAE → CAI → CESP (servicios públicos). | Todos | Adoptada · Replicar | M06 §6.3 |
| RN-FIS-054 | Tipo de autorización en el comprobante: CAI 1, CAE 2, CESP 3, CAEA 4. | Todos | Adoptada · Replicar | M06 §6.3 |
| RN-FIS-055 | CAEA aplicable: rango de fechas que contiene la fecha del comprobante. | Todos | A validar · Mejorar | M06 §6.3 |
| RN-FIS-056 | CESP aplicable: rango que contiene la fecha y vencimiento ≥ hoy, con el mismo criterio en emisión, masiva y anulación. | Todos | Adoptada · Mejorar | M06 §6.3 |
| RN-FIS-057 | Superposición de CESP: detecta también contención total y distingue CESP de CAEA. | Todos | Adoptada · Mejorar | M06 §6.3 |
| RN-FIS-058 | CAEA se consulta primero y, si no existe, se solicita, por período y orden (1/2). | Todos | A validar · Replicar | M06 §6.3 |
| RN-FIS-059 | Informe CAEA en tandas de comprobantes no informados, agrupados por tipo y punto; queda informado. | Todos | Adoptada · Mejorar | M06 §6.3 |
| RN-FIS-060 | CAEA sin movimiento se informa. | Todos | Adoptada · Mejorar | M06 §6.3 |
| RN-FIS-061 | Uso del CAEA limitado según normativa (contingencia u otras restricciones). | Todos | A validar · Mejorar | M06 §6.3 |
| RN-FIS-062 | CAI: comprobante toma CAI actual y vencimiento; sin web service. | Todos | Adoptada · Replicar | M06 §6.3 |
| RN-FIS-063 | QR: `tipoCodAut` A para CAEA, E en los demás. | Todos | Adoptada · Replicar | M06 §6.3 |
| RN-FIS-064 | Código de barras: CUIT + tipo (2) + punto (4) + CAE + vencimiento (+ dígito). | Todos | A validar · Replicar | M06 §6.3 |
| RN-FIS-065 | Consulta A13: CUIT por documento y datos de persona (apellido, nombre, razón social, domicilios, actividad principal, forma jurídica, estado de clave). | Todos | Adoptada · Mejorar | M06 §6.4 |
| RN-FIS-066 | Validación de CUIT contra padrón al dar de alta personas. | Todos | A validar · Reemplazar | M06 §6.4 |
| RN-FIS-067 | Padrón offline: CUIT (11), razón social (30), IVA pos. 44–45, monotributo pos. 46–47; si monotributo ≠ "NI" → "MT"; IVA "XN"→"EX", "AN"→"NA", vacío→"", otro se copia; condición = la que tiene ese… | Todos | A validar · Replicar | M06 §6.4 |
| RN-FIS-068 | Cruce del padrón offline con proveedores (con opción de actualizar) y titulares; búsqueda de CUIT. | Todos | Adoptada · Mejorar | M06 §6.4 |
| RN-FIS-069 | Actividad ARCA del servicio del titular usada como filtro en cargos; no se informa a WSFE. | Todos | A validar · Mejorar | M06 §6.4 |
| RN-FIS-070 | Condición IVA del receptor se mapea a la tabla ARCA vigente (1 RI, 4 exento, 5 CF, 6 monotributo, 7 no categorizado, 8 proveedor del exterior, 9 cliente del exterior, 10 IVA liberado Ley 19.640, 13… | Todos | A validar · Reemplazar | M06 §6.4 |
| RN-FIS-071 | Tipos de documento: desconocido 99, DNI 96, LE 89, LC 90, pasaporte 94, cédula 91, CUIL 86, interno 99, CUIT 80. | Todos | Adoptada · Replicar | M06 §6.4 |
| RN-FIS-072 | El comprobante interno de cada operación se elige por servicio LQSP → comprobante del servicio → tipo de factura → FCE MiPyME (si supera V2 2515) → default de la condición. | Todos | Adoptada · Replicar | M06 §6.4 |
| RN-FIS-073 | Alícuota de IVA del ítem de servicio: tarifa → categoría → servicio; IIBB: categoría → servicio; producto: propia del producto más percepción del producto. | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-074 | IVA1 = neto × POR_IVA; IVA2 = neto × POR_IVA2 si > 0. | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-075 | Percepción de IVA = (neto + IVA1) × PER_IVA, o neto × PER_IVA si la condición indica "percepción sobre neto". | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-076 | Si la matriz no define percepción, se usa la del producto solo para responsables inscriptos. | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-077 | Nunca se percibe a cuentas marcadas "no cobrar percepción". | Todos | Adoptada · Mejorar | M06 §6.5 |
| RN-FIS-078 | La percepción de la factura se aplica solo si la suma alcanza el mínimo de la condición. | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-079 | Ítems con IVA fijo conservan su IVA (cuotas de financiación). | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-080 | Percepción de IIBB: alícuota "rendir en facturación", situación no exenta, porcentaje de la matriz, solo si netos alcanzados ≥ base mínima; variante con padrón por cuenta; con cálculo 2 se calcula… | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-081 | Otros impuestos (tasas municipales, fondos provinciales) se modelan como cargos adicionales de tipo impuesto con fórmula y base. | TAS | Adoptada · Mejorar | M06 §6.5 |
| RN-FIS-082 | Total de la factura = Σ neto + IVA1 + IVA2 + percepción IVA + otros impuestos + IIBB. | TAS | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-083 | Subsidios y bonificaciones reducen el componente bonificado antes de impuestos; su tratamiento fiscal (IVA sobre lo bonificado) sale de la tabla normativa del régimen. | Todos | A validar · Mejorar | M06 §6.5 |
| RN-FIS-084 | Cuota de venta: IVA y percepción de la cuota; IIBB solo si la base supera el mínimo. | Todos | Adoptada · Replicar | M06 §6.5 |
| RN-FIS-085 | Liquidación de percepciones IIBB según RN 01/2017 Córdoba. | Todos | A validar · Replicar | M06 §6.5 |
| RN-FIS-086 | Criterio percibido: para condiciones con percibido se toma lo cobrado y refinanciado del período; el resto por facturado. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-087 | Criterio facturado y percibido: no cobrado por facturado; cobrado parcial prorrateado por saldo/total; se suman cobros del período de facturas del período y del mes siguiente. | Todos | A validar · Replicar | M06 §6.6 |
| RN-FIS-088 | Criterio cuotas facturadas vencidas: prorratea cada factura por las cuotas que vencen en el período. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-089 | Solo comprobantes fiscales; excluye prescripción de deuda; mensual = fecha ≠ primer vencimiento, diaria = fecha = primer vencimiento. | Todos | Adoptada · Mejorar | M06 §6.6 |
| RN-FIS-090 | Signo positivo en débitos y negativo en créditos. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-091 | Columnas por subtipo de impuesto: no gravado/otros por origen; IVA 1, IVA 2, IVA 3/percepción. | Todos | Adoptada · Reemplazar | M06 §6.6 |
| RN-FIS-092 | Fila de cabecera con estado "A" sin importes. | Todos | A validar · Mejorar | M06 §6.6 |
| RN-FIS-093 | Carátula: alícuotas en 0 y filas sin gravado se omiten; LQSP aparte. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-094 | Percepciones del informe = solo IVA 3. | Todos | Adoptada · Mejorar | M06 §6.6 |
| RN-FIS-095 | Agrupado por tipo reasigna el tipo según grupo IVA. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-096 | Por actividad: rubro del producto/servicio, "OTROS" si no tiene. | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-097 | Fecha de vencimiento en RG 3685 si V2 2692 y filtro por vencimiento. | Todos | A validar · Mejorar | M06 §6.6 |
| RN-FIS-098 | Reglas de formato RG 3685/LID (detalle RF-FIS-120). | Todos | Adoptada · Replicar | M06 §6.6 |
| RN-FIS-099 | Lista de comprobantes B y C para RG 3685 por ítems (sin el 109 en una de las listas). | Todos | Adoptada · Mejorar | M06 §6.6 |
| RN-FIS-100 | Total de ventas en la comparación = exento + gravado + no gravado + IVA1 + percepción, sin IVA2; falla todo el lote si un código no es numérico. | Todos | Adoptada · Mejorar | M06 §6.6 |
| RN-FIS-101 | IVA de compras sin signo en notas de crédito. | Todos | Adoptada · Mejorar | M06 §6.6 |
| RN-FIS-102 | Mis Comprobantes: desde la tercera fila del Excel; si el tipo contiene "Crédito" se niegan importes; tipo de cambio en formato en-US; diferencia > ARS 1; total ≤ 0,03 → todo exento antes de comparar… | Todos | A validar · Mejorar | M06 §6.6 |
| RN-FIS-103 | Archivos de texto en Windows-1252, ancho fijo, ceros a la izquierda, lugar para signo en negativos; CSV con ";". | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-104 | RG 3571: análisis por línea (signo "0" positivo) y por correlatividad (informa solo número − 1). | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-105 | RG 3571 variante 49/2019 (RN 46/2019) con generadores; nombres `rg_3571_ddMMyyyy_hhmmss.txt` / `rg_46_2019_ddMMyyyy.txt`. | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-106 | RG 2177 sin implementar. | Todos | A validar · Descartar | M06 §6.7 |
| RN-FIS-107 | SICORE: ventas con coma decimal (V2 2991); proveedores formato internacional (V2 2539); sin CUIT → 23333333333; proveedores impuesto 0217 régimen 078, o 0767 con 214 para Buenos Aires; sueldos con… | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-108 | Retenciones municipales: registros C/D/P con CUIT y razón social de la empresa; IIBB artículo 020 para RUF y 001 para el resto; Santa Fe con campos más anchos; La Pampa todo del mismo mes y CUIT… | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-109 | SIRCAR: Córdoba y Río Negro, percepciones; 904 agrega constancia; Buenos Aires valida CUIT y aborta con lista; nombre depende de versión. | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-110 | FEDECOBA: saldos contables por cuenta FEDECOBA partidos en N archivos; CUIT fijo en código; contador no reinicia. | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-111 | Retenciones: habilitación global y por proveedor; base con banderas y factor; acumulación; mínimo; escala; retenido previo; devolución. | Todos | Adoptada · Replicar | M06 §6.7 |
| RN-FIS-112 | Sin tramo con valores fijos → crea escala 0–999.999.999 persistida. | Todos | Adoptada · Reemplazar | M06 §6.7 |
| RN-FIS-113 | Numeración anual de certificados por tipo y punto; anulación con estado "A" e importes en cero. | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-114 | Facturación de terceros: Excel/ancho fijo/DBF con clave de cuenta; marca "CUENTA INEXISTENTE", "CONCEPTO INEXISTENTE"; IVA por concepto y condición; grabación como comprobantes con cuotas o facturas… | GAS, TAS | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-115 | ENARGAS: nombre `<distribuidor 5 dígitos>_<número>_<archivo>_<AAAA-MM>_<fecha>.TXT`, tabulado (SUP con coma); archivo de tablas maestras según V2 2603 en la carpeta del ejecutable; categorías… | GAS | A validar · Mejorar | M06 §6.7 |
| RN-FIS-116 | ENACOM: configuración serializada en archivo del servidor; informe DNU 311/2020 (Res. 367/2020) histórico. | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-117 | Comprobantes de administración pública: facturas impagas con consumos de tipo de energía vacío o "A"; reemplazo de selección por período o fecha; borrado defectuoso por fecha sin comillas. | ELE | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-118 | Talones sumados: eliminación conserva historia (no borra definitivamente). | Todos | Adoptada · Replicar | M06 §6.7 |
| RN-FIS-119 | Modo pasarela: CSV sin cabecera con separador V2 2497 (";"), 46 columnas; relacionado de 16 caracteres; CUIT del relacionado de la empresa en 203/208; reemplazo de pendientes; borrado de CSV si todo… | Todos | A validar · Mejorar | M06 §6.7 |
| RN-FIS-120 | Ninguna exportación marca presentado; ningún pago marca pagada la obligación sin movimiento confirmado. | Todos | Adoptada · Adoptar | M06 §6.7 |
| RN-FIS-121 | Un concepto por cuenta de terceros solo se habilita con convenio y fundamento cargados. | TAS | Adoptada · Adoptar | M06 §6.7 |
| RN-FIS-122 | El grupo de facturación no agrupa servicios que una norma, el regulador o el servicio exigen en documento independiente, ni de distintos CUIT/titulares/tenants; la validez fiscal se confirma con el… | Todos | A validar · Replicar | M06 §6.7 |
| RN-FIS-123 | Los intereses devengados se facturan en un documento posterior cuando el régimen fiscal lo exige, sin modificar la factura original. | Todos | Adoptada · Replicar | M06 §6.7 |
| RN-FIS-124 | Aporte de capital (HUECO-CAP-04): un renglón cuyo concepto tiene `conceptFiscalCases.fiscalClass = capitalContribution` (1) no integra `ImpNeto`, `ImpOpEx`, `ImpIVA` ni `ImpTrib`; (2) se informa en… | CAP | A validar · Mejorar | M06 §6.7 |
| RN-FIS-125 | Derechos de sepultura (HUECO-CEM-01, ficha CEM): (1) cada concepto CEM (adquisición, mantenimiento, cada tipo de acto) debe tener un `conceptFiscalCases` adoptado; sin él, la versión tarifaria de M04… | CEM | A validar · Mejorar | M06 §6.7 |
| RN-FIS-126 | Clasificación de tributos y conceptos (HUECO-TAS-03), en este orden: (1) si el beneficiario del importe es la cooperativa (`level = internal`, o tributo que la cooperativa paga como contribuyente y… | TAS | A validar · Mejorar | M06 §6.7 |
| RN-FIS-127 | Saldo de terceros y mora (HUECO-TAS-02): (1) el saldo impago de renglones `thirdPartyCharge`/`thirdPartyTax` se publica a M07/M08 con `thirdPartyAgreementId` y clase; (2) por defecto… | TAS | A validar · Mejorar | M06 §6.7 |
| RN-FIS-128 | Depósito en garantía (HUECO-OTR-04; RN-CON-123 de M15): un renglón con `conceptFiscalCases.caseCode = guaranteeDeposit` tiene `fiscalClass = outsideTaxBase`: (1) no es contraprestación de una venta… | OTR | A validar · Mejorar | M06 §6.7 |
| RN-FIS-129 | Corte por deuda de terceros (HUECO-ALU-01; RN-MOR-141 y RN-MOR-142 de M08): (1) `moraPolicy.allowServiceCut = false` (default): la deuda de conceptos de terceros nunca habilita suspensión ni corte… | ALU | A validar · Mejorar | M06 §6.7 |
| RN-FIS-130 | Emisión por entidad jurídica (DEC-064): el CUIT emisor, el perfil fiscal, la credencial ARCA, el punto de venta, el CESP/CAEA, los libros IVA, las declaraciones y las obligaciones fiscales se… | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-131 | Alineación con T04 (RF-CFG-138; EVT-CFG-19): (1) `fiscalProfiles.legalName` y `cuit` deben coincidir con los datos legales de `legalEntities` de T04 a la fecha de vigencia; (2)… | Todos | Adoptada · Mejorar | M06 §6.7 |
| RN-FIS-132 | Padrones mixtos (PA-FIS-18): (1) `maintainedBy = platform` solo para padrones de acceso público, con versión visible para todos los tenants que los adopten (RN de tablas normativas, RF-FIS-004); (2)… | Todos | A validar · Mejorar | M06 §6.7 |

<a id="catalogo-m07-cob"></a>

### M07 COB — Cuenta corriente y cobranza (157 reglas)

Fuente: [`M07-COB-cuenta-corriente-cobranza.md`](../especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-COB-001 | Todo importe es `Decimal128` con aritmética `decimal.js`; importes a 2 decimales, recargos y prorrateos con regla de redondeo explícita por concepto (half-even por defecto). | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-002 | El saldo de una obligación es `amount − Σ allocations(status=active)`; el campo `openAmount` es una proyección no editable que se recalcula en la misma transacción y se verifica en JOB-COB-14. | Todos | Adoptada · Reemplazar | M07 §6.1 |
| RN-COB-003 | Ningún movimiento ni imputación se borra; la corrección es un movimiento o imputación inversa vinculada (`reversalOf`). | Todos | Adoptada · Reemplazar | M07 §6.1 |
| RN-COB-004 | Cada obligación pertenece a un único titular, cuenta, servicio y documento de origen; el comprobante agrupado genera una obligación por servicio (FAC-008). | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-005 | La moneda es ARS por defecto; el cobro en moneda extranjera se convierte a la moneda de la obligación con la cotización del momento y se guarda importe original y cotización. | Todos | Adoptada · Replicar | M07 §6.1 |
| RN-COB-006 | La fecha efectiva del cobro es la fecha de pago informada por el canal (caja: fecha de operación; ente: fecha de cobro; pasarela: fecha de pago), en la zona horaria del tenant; `recordedAt` es la… | Todos | Adoptada · Replicar | M07 §6.1 |
| RN-COB-007 | Ajustes del auxiliar solo con documento (NC/ND de M05) o ajuste interno autorizado con contrapartida y causa codificada. | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-008 | Un evento de origen (`fac.invoice.issued`, rendición, webhook) se aplica una sola vez: clave de idempotencia por `tenantId` + origen + id externo. | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-009 | Al consumir una NC de M05 vinculada a una factura, se crea un crédito que se imputa primero a la obligación referida (mismo servicio, FAC-009); el excedente queda a favor. | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-010 | Al consumir la anulación de una factura sin pagos, la obligación pasa a Anulada por movimiento inverso; con pagos, M05 debe emitir NC y COB conserva los pagos como saldo a favor. | Todos | Adoptada · Mejorar | M07 §6.1 |
| RN-COB-011 | Una obligación incluida en un convenio de M08 queda en estado En convenio y deja de ser exigible por sí; las cuotas son las nuevas obligaciones. No se cobra dos veces (AGR-014). | Todos | Adoptada · Replicar | M07 §6.1 |
| RN-COB-012 | La consulta de deuda a una fecha pasada = saldo actual + pagos posteriores según fecha elegida (0 fecha de pago, 1 fecha del recibo, 2 fecha de registración). | Todos | Adoptada · Replicar | M07 §6.1 |
| RN-COB-013 | El saldo de cuenta puede ser negativo (a favor) solo por saldos a favor explícitos; un saldo de obligación nunca es negativo. | Todos | Adoptada · Replicar | M07 §6.1 |
| RN-COB-014 | La modalidad de cuenta se resuelve en este orden: excepción por titular > por cuenta > por servicio > default del tenant, vigente a la fecha del período. | Todos | Adoptada · Mejorar | M07 §6.2 |
| RN-COB-015 | Una cuenta unificada agrupa solo obligaciones del mismo titular, tenant y entidad jurídica (RN-COB-151); un titular con varios inmuebles del mismo servicio tiene una cuenta unificada por grupo de… | Todos | A validar · Adoptar | M07 §6.2 |
| RN-COB-016 | El resumen es un snapshot inmutable (número, fecha de corte, obligaciones y saldos a esa fecha); sus totales se recalculan desde el auxiliar al emitir y nunca se editan. | Todos | Adoptada · Reemplazar | M07 §6.2 |
| RN-COB-017 | El mínimo de pago se calcula sobre el saldo elegible (capital vencido, cargos autorizados, menos convenios vigentes y reclamos en trámite) según fórmula configurada; su pago se imputa con la política… | Todos | A validar · Adoptar | M07 §6.2 |
| RN-COB-018 | El incumplimiento del mínimo no ejecuta suspensión: genera evaluación para M08 por servicio, que verifica fundamento, aviso y restricciones (§68). | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-019 | Cambiar la modalidad de cuenta rige desde el período siguiente; no fusiona ni separa documentos emitidos ni resúmenes previos. | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-020 | El motor recibe: cobro (importe, fecha, canal, titular/cuenta), obligaciones seleccionadas o identificadas y política; devuelve imputaciones por obligación y componente y el remanente (saldo a favor… | Todos | Adoptada · Mejorar | M07 §6.3 |
| RN-COB-021 | Política **selección explícita**: imputa a las obligaciones elegidas en el orden elegido; el remanente según RN-COB-030. | Todos | Adoptada · Replicar | M07 §6.3 |
| RN-COB-022 | Política **antigüedad**: ordena por primer vencimiento ascendente (o último vencimiento si se configura), luego fecha de emisión, luego id. | Todos | Adoptada · Mejorar | M07 §6.3 |
| RN-COB-023 | Política **prioridad de servicio**: orden por prioridad configurada de servicio (ej. tasa de terceros, energía, internet) y dentro de cada servicio por antigüedad. | INT, ELE, TAS | Adoptada · Mejorar | M07 §6.3 |
| RN-COB-024 | Política **elección del socio**: el socio elige obligaciones en portal o caja; si no elige, se aplica la política por defecto. | Todos | A validar · Adoptar | M07 §6.3 |
| RN-COB-025 | Dentro de una obligación el orden de componentes es: recargo entre vencimientos, interés por mora, interés de financiación, tributos de terceros si el tenant prioriza, capital. | OBR, TAS | Adoptada · Replicar | M07 §6.3 |
| RN-COB-026 | Si el pago parcial no cubre los recargos e intereses de la obligación, se rechaza el pago parcial en entes (entrega mínima) y en caja se avisa. | Todos | Adoptada · Replicar | M07 §6.3 |
| RN-COB-027 | Deuda notificada (aviso de corte de M08): con la regla activa no se cobra parcialmente; deben incluirse todas las obligaciones notificadas vencidas. | Todos | A validar · Replicar | M07 §6.3 |
| RN-COB-028 | Más antiguas primero: con la regla activa, una obligación no puede cobrarse si existe otra más antigua impaga (global o del mismo servicio), comparando por primer o último vencimiento; excluye… | Todos | A validar · Replicar | M07 §6.3 |
| RN-COB-029 | Cuotas en orden: no se saltea una cuota anterior impaga del mismo plan. | Todos | A validar · Replicar | M07 §6.3 |
| RN-COB-030 | Remanente: si hay importe sin obligación, va a saldo a favor de la cuenta pagadora (política por defecto) o a pendiente de aplicación; nunca a otra cuenta. | Todos | A validar · Mejorar | M07 §6.3 |
| RN-COB-031 | Imputación entre servicios en cuenta unificada: solo si la política lo permite o el socio lo elige expresamente. | Todos | A validar · Adoptar | M07 §6.3 |
| RN-COB-032 | Cancelación automática de créditos: si débitos ≥ créditos, se aplican todos los créditos por orden de primer vencimiento; el último débito puede quedar parcial solo si lo aplicado cubre recargo e… | Todos | Adoptada · Replicar | M07 §6.3 |
| RN-COB-033 | Reasignar una imputación exige reversa de la original y nueva imputación en una transacción, con autorización según T11; prohibido si la obligación original está en un período contable cerrado sin… | Todos | Adoptada · Adoptar | M07 §6.3 |
| RN-COB-034 | Concurrencia: toda imputación verifica la versión de la obligación; si cambió, falla con 409 y se recalcula. | Todos | Adoptada · Replicar | M07 §6.3 |
| RN-COB-035 | El cupón de pago único se imputa con la política del tenant a las obligaciones del cupón; si alguna ya se canceló por otra vía, su parte va a saldo a favor. | Todos | Adoptada · Mejorar | M07 §6.3 |
| RN-COB-036 | Comprobantes de importe cero o pares débito/crédito internos compensables se proponen para regularizar; no se anulan solos. | Todos | Adoptada · Replicar | M07 §6.3 |
| RN-COB-037 | Todo saldo a favor tiene origen, cuenta, servicio (si corresponde), importe, saldo disponible, aplicabilidad automática y vigencia; se consume por imputaciones. | Todos | Adoptada · Mejorar | M07 §6.4 |
| RN-COB-038 | Excedente en ESC-01: se cancela la obligación del pagador identificado y el resto queda a favor o pendiente; nunca se aplica a otro titular ni conviviente. | Todos | Adoptada · Adoptar | M07 §6.4 |
| RN-COB-039 | Pago duplicado en rendición: si el pago anterior vino del mismo ente → "ya importado" informativo sin crédito; si vino de otra vía → saldo a favor por duplicado en la cuenta pagadora. | Todos | Adoptada · Replicar | M07 §6.4 |
| RN-COB-040 | Los saldos a favor por duplicado y por contracargo se crean con imputación no automática por defecto; su aplicación requiere operador o la política. | Todos | Adoptada · Replicar | M07 §6.4 |
| RN-COB-041 | Saldo a favor por redondeo en efectivo: concepto, tipo y comprobantes formales configurados; no se genera si la cuenta adeuda débitos de redondeo previos; vencimiento hoy e imputación no automática. | Todos | A validar · Replicar | M07 §6.4 |
| RN-COB-042 | Un cobro no identificado se crea cuando el canal no permite determinar titular u obligación (comprobante no encontrado, ambiguo, transferencia sin referencia); se identifica con datos verificables y… | Todos | Adoptada · Mejorar | M07 §6.4 |
| RN-COB-043 | Un cobro no identificado no aplicado en N días escala al responsable de tesorería; su devolución requiere expediente (RN-COB-097). | Todos | Adoptada · Adoptar | M07 §6.4 |
| RN-COB-044 | El saldo a favor se aplica a la próxima factura cuando el tenant lo configure; M05 lo muestra en el comprobante. | Todos | Adoptada · Replicar | M07 §6.4 |
| RN-COB-045 | Las transferencias informadas quedan pendientes de verificación; se confirman por conciliación con M14 o por verificación manual con permiso y evidencia. | Todos | Adoptada · Adoptar | M07 §6.4 |
| RN-COB-046 | Una sesión está abierta si no tiene cierre; un usuario puede tener varias sesiones abiertas en cajas distintas, nunca dos en la misma caja. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-047 | El número de caja libre excluye los reservados a entes y a usuarios con caja fija; cada ente y cobrador tiene su caja virtual. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-048 | La sesión se abre con fecha del día del tenant; abrir con fecha distinta exige permiso. | Todos | Adoptada · Mejorar | M07 §6.5 |
| RN-COB-049 | Validaciones de cobro: ver RN-COB-027 a RN-COB-029 más: nota de bloqueo (error), nota de mensaje (aviso desmarcable con permiso), titular notificado (aviso), servicio desconectado (aviso), orden de… | Todos | A validar · Replicar | M07 §6.5 |
| RN-COB-050 | El recargo lo calcula M08 con la fecha de cobro; el cajero con permiso puede cambiar el recargo diario o no cobrarlo; el cambio se registra con motivo. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-051 | Modo de diferir: `NoDiferir` cobra todo; `DiferirInteresMora` cobra recargo entre vencimientos y difiere mora; `DiferirTodo` no cobra recargo. Lo diferido se informa a M08 (`cob.surcharge.deferred`)… | Todos | A validar · Replicar | M07 §6.5 |
| RN-COB-052 | Si una factura ya tiene un pago parcial, en entes se difiere todo el recargo. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-053 | Integridad de la operación: Σ ítems imputados + saldo a favor generado = Σ medios − vuelto; exacto. | Todos | Adoptada · Mejorar | M07 §6.5 |
| RN-COB-054 | Vuelto: solo del efectivo; modos proporcional, desde último ingreso, o sin vuelto (el excedente va a saldo a favor o donación). | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-055 | Recargo por medio de pago: tarjeta según plan de cuotas (tipo y valor), transferencia, valores a fecha (interés diario); se factura como concepto vía M05 y se cobra en la misma operación. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-056 | Descuento en caja: por tipo de factura o servicio, rango de días del mes sin superposición, porcentaje con suma ≤ 100, solo socios opcional; se documenta como bonificación de M05. La regla se lee de… | Todos | A validar · Replicar | M07 §6.5 |
| RN-COB-057 | QR estático por puesto: al cobrar se carga el importe en el QR con una referencia única de transacción; el pago se asocia por referencia, no por fecha + importe; al terminar el QR se limpia. | Todos | Adoptada · Reemplazar | M07 §6.5 |
| RN-COB-058 | QR dinámico: una intención tipo caja por operación; si el importe no cambió se reutiliza la intención en curso; sin comprobantes se crea una intención de prepaga. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-059 | Retención sufrida: requiere tipo, número de certificado, fecha e importe; cancela deuda como medio; no se anula la cobranza si la retención ya se presentó. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-060 | Egreso por pago a proveedor: solo órdenes no anuladas con salida pendiente (y con firmas completas si se configura); reduce el efectivo de la moneda por defecto; con la opción activa marca la orden… | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-061 | Comprobante generado en la caja (recargo cobrado, conceptos, ND de intereses) queda marcado como generado en caja; al anular la cobranza se anula entero salvo que tenga CAE, en cuyo caso M05 emite NC. | Todos | Adoptada · Mejorar | M07 §6.5 |
| RN-COB-062 | Espera de CAE: si el tenant exige autorización fiscal antes de entregar el recibo, la operación queda "pendiente fiscal" y se completa al recibir el CAE; el cobro ya está registrado. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-063 | Límites del cajero: importe máximo por operación, efectivo máximo en caja (alerta de retiro parcial), medios habilitados; superar requiere aprobación. | Todos | Adoptada · Adoptar | M07 §6.5 |
| RN-COB-064 | Arqueo: teórico por medio = Σ detalle de operaciones de la sesión por medio y moneda + movimientos manuales de la sesión; el cajero declara el contado por medio; diferencia por medio = declarado −… | Todos | A validar · Mejorar | M07 §6.5 |
| RN-COB-065 | Control de integridad del cierre: teórico por detalle vs. totales de cabecera de operaciones; toda diferencia es una excepción (no un aviso) y bloquea el cierre hasta explicarla. | Todos | Adoptada · Mejorar | M07 §6.5 |
| RN-COB-066 | Diferencia de arqueo: justificación obligatoria; por encima del umbral requiere aprobación de supervisor; genera movimiento de quebranto (ingreso si sobra, egreso si falta) hacia M14/M15. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-067 | Cierre de varias sesiones o días: solo si en el período hay únicamente efectivo, cuando el tenant lo habilite. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-068 | Al cerrar: cheques pasan a la cartera de M14 (fuera de caja); cupones de débito se presentan; cupones de crédito quedan para presentar en tesorería; retenciones se presentan si se configura… | Todos | A validar · Replicar | M07 §6.5 |
| RN-COB-069 | Reapertura (anulación del cierre): con permiso, solo si M14 no recibió la rendición ni cerró el día; con cierre múltiple reabre todas las sesiones del grupo. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-070 | Si el cierre falla en cualquier paso (por ejemplo una expectativa bancaria), se revierte completo. | Todos | Adoptada · Replicar | M07 §6.5 |
| RN-COB-071 | Cobro de conceptos de conexión: precio = segundo importe si vigente, si no importe fijo o precio del producto; importe editable salvo bloqueo; bonificación por cantidad con contador por cuenta hasta… | Todos | A validar · Replicar | M07 §6.5 |
| RN-COB-072 | Reconexión tras el cobro: COB publica las obligaciones canceladas y servicios del titular; M08 aplica 2926/3147/3113/3163/2713/3106 para decidir orden o reconexión directa. | Todos | A validar · Delegar | M07 §6.5 |
| RN-COB-073 | No se anula si: falta permiso; ya está anulada; el usuario no tiene sesión abierta; en ventanilla la sesión original está cerrada (salvo flujo de anulación con autorización de supervisor y efecto en… | TAS | Adoptada · Replicar | M07 §6.6 |
| RN-COB-074 | Orden inverso: si hay imputaciones posteriores sobre la misma obligación, se exige anular primero las posteriores. | Todos | Adoptada · Replicar | M07 §6.6 |
| RN-COB-075 | Efectos de la anulación, todos por reverso: imputaciones revertidas, recibo Anulado, medios revertidos (efectivo, transferencia, cupón, retención; cheque propio vuelve disponible), expectativa… | Todos | Adoptada · Mejorar | M07 §6.6 |
| RN-COB-076 | La búsqueda de la operación a anular es por número de operación, recibo o comprobante; por rango solo operaciones sin vuelto. | Todos | Adoptada · Replicar | M07 §6.6 |
| RN-COB-077 | El movimiento bancario de un ente se ubica por `operationId` (no por búsqueda de importe, fecha y categoría). | Todos | Adoptada · Reemplazar | M07 §6.6 |
| RN-COB-078 | Prepaga con reversión de facturas: al anular, M03 revierte la carga y COB registra la regularización sin intereses ni medios. | Todos | A validar · Replicar | M07 §6.6 |
| RN-COB-079 | Cada ente se configura como datos (RF-COB-098); el layout se elige por familia y versión, no por código por cooperativa. | Todos | Adoptada · Reemplazar | M07 §6.7 |
| RN-COB-080 | Identificador de pago: prefijo de tipo (aviso de deuda, obligación, cupón, intención) + id interno + dígito verificador, de largo fijo por layout; formas alternativas por ente (id directo, código… | Todos | Adoptada · Mejorar | M07 §6.7 |
| RN-COB-081 | Exportación: solo obligaciones con saldo > 0 y no créditos; aplica filtros (RF-COB-101); con "validar saldo", si la obligación tiene pago parcial, todos los importes por vencimiento pasan a ser el… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-082 | Importes en el archivo en centavos con relleno de ceros; negativo ocupa una posición del largo. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-083 | Índice Red Link único por (período, concepto, identificador) con índice inicial configurable; no se reinforma un comprobante ya informado. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-084 | SIRO: máximo 10 comprobantes por cuenta y período; días extra al último vencimiento solo con diferir = solo mora; excluir período o comprobantes ya informados; nombre de archivo con CUIT del… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-085 | Rendición: se valida convenio de cabecera = convenio del ente y fecha de presentación ≤ hoy; si falla, se rechaza el archivo completo. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-086 | Pie: cantidad de registros (pie − 2 cuando incluye cabecera y pie) e importe total; si no coinciden con lo leído es **advertencia** visible, no error. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-087 | Importe esperado = saldo + recargo entre vencimientos si corresponde (según modo de diferir del ente y fecha de cobro); si el registro trae el recargo explícito se usa ese. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-088 | Pasado el último vencimiento aceptado por el ente (o sin tope si no se configura vencimiento máximo): error "el ente no permite pagos pasados el día…". | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-089 | Importe superior: error salvo tolerancia configurada por ente (advertencia ≤ tolerancia, el excedente va a saldo a favor). Importe inferior: error si el ente no admite entregas; si las admite, error… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-090 | Duplicados dentro del archivo (misma cuenta, comprobante, cuota y primer vencimiento): se marcan y no se aplican las repeticiones; con la opción activa se agrupan como advertencia. | Todos | A validar · Replicar | M07 §6.7 |
| RN-COB-091 | Comprobante anulado, titular notificado y comprobante bloqueado se validan en la rendición; bloqueado se acepta si el tenant lo permite. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-092 | Solo se registran los registros OK y confirmados; los errores quedan en bandeja con su motivo y pueden resolverse (identificar, aplicar, devolver). | Todos | Adoptada · Mejorar | M07 §6.7 |
| RN-COB-093 | Registración de la rendición: medio transferencia por el total rendido a la cuenta del ente, concepto "Cobranza {ente}", fecha de rendición, diferencia del ente, conciliado automático según ente… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-094 | Comisión del ente: importe fijo por comprobante o porcentaje acotado por mínimo y máximo; registrada como gasto financiero; si se traslada, se factura al usuario. | Todos | A validar · Replicar | M07 §6.7 |
| RN-COB-095 | Forma de registración bancaria por ente (por comprobante, fecha de acreditación, caja, pago); si el layout no la informa, se usa la del ente (no "por caja" implícito). | Todos | A validar · Mejorar | M07 §6.7 |
| RN-COB-096 | Rendición SIRO: descartar importe 0; dígito de tipo 5 = aviso de deuda; comprobantes que empiezan con 7 = pago web vinculado a intención; con 8 se descartan; validar convenio y fecha de acreditación… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-097 | Rendición Banelco/Pago Fácil/Rapipago/Cobro Express: cliente por cuenta y comprobante por código de barras o identificador de pago; opción de tomar fecha de rendición = fecha de importación… | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-098 | Novedades de adhesión: alta → adhesión Activa con ente, período, medio y fecha; baja → Cancelada con fecha; modificación → actualiza el medio; solo se aplican si la cuenta no tiene ente o es el mismo… | Todos | A validar · Replicar | M07 §6.7 |
| RN-COB-099 | Morosidad Naranja: valida comercio = convenio; registra tarjeta, importe, vencimiento, presentación y cuenta; emite informe. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-100 | Fecha juliana AAJJJ se interpreta siempre del siglo 2000. | Todos | Adoptada · Replicar | M07 §6.7 |
| RN-COB-101 | La presentación selecciona obligaciones de cuentas con adhesión Activa al ente, excluyendo tipos en exclusión, ya pagadas, en otra presentación activa o bloqueadas. | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-102 | Débito con tarjeta: si el día del primer vencimiento ≥ día de corte (19 por defecto), el débito pasa al mes siguiente. | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-103 | Débito sin rechazos previos se cobra al importe del primer vencimiento aunque se acredite después. | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-104 | Rechazo: la obligación vuelve a Pendiente (si se había anticipado el cobro) o queda Pendiente; se registra código y causa; se notifica; los rechazos definitivos (orden de no pagar, cuenta cerrada… | Todos | Adoptada · Mejorar | M07 §6.8 |
| RN-COB-105 | Códigos de resultado Naranja: 0 aceptado, 8 inexistente, 35 rechazada, 81 baja, 102 importe 0, 145 error de referencia. Débito directo CBU: códigos interbancarios R (R08 orden de no pagar, R09 día no… | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-106 | Estados de adhesión por API (Pagos360): `pending_to_sign` → Pendiente de firma; `signed` → Activa; `canceled` → Cancelada (en sincronización periódica) o Error (en el alta). | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-107 | Una obligación no puede estar en dos presentaciones o intenciones no canceladas; las intenciones web (prepaga y cobranza del portal) solo cuentan si su segundo vencimiento no pasó. | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-108 | Pago voluntario de obligación adherida: según política (no permitir, siempre, solo con recargo); si se pagó antes de presentar, se excluye; si se pagó y además se debitó, el segundo cobro va a saldo… | Todos | Adoptada · Replicar | M07 §6.8 |
| RN-COB-109 | El número de tarjeta se guarda tokenizado (token del ente o del proveedor) y enmascarado; el CBU se guarda cifrado y se muestra enmascarado. | Todos | Adoptada · Reemplazar | M07 §6.8 |
| RN-COB-110 | Estados de intención: Borrador → Emitida (registrada en el proveedor) → Pagada (transacción confirmada) → Imputada; más Vencida, Cancelada, Rechazada, Revertida, Devuelta, Resultado incierto. | Todos | Adoptada · Mejorar | M07 §6.9 |
| RN-COB-111 | La confirmación siempre es por consulta autenticada al proveedor (o rendición firmada del ente); el webhook es solo disparador; el importe del portal nunca se usa. | Todos | Adoptada · Mejorar | M07 §6.9 |
| RN-COB-112 | Deduplicación: índice único (`tenantId`, `connectorId`, `externalPaymentId`); un pago ya registrado se ignora. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-113 | Una intención admite exactamente un pago confirmado sin imputar (en débitos, con comisión); dos pagos sobre la misma intención: el segundo va a saldo a favor y a revisión. | Todos | Adoptada · Mejorar | M07 §6.9 |
| RN-COB-114 | Importe esperado = importe 1 si se pagó antes del primer vencimiento (o débito sin rechazos), si no importe 2; pasado el tercer vencimiento se usa el primero si se configura. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-115 | Distribución del pago entre ítems: cada ítem toma el total del vencimiento según fecha de pago y modo de diferir; si tenía saldo parcial se prorratea; si trae recargo explícito se usa. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-116 | Si la suma de ítems ≠ pago, no se bloquea: se imputa con la política y la diferencia va a revisión (más: saldo a favor; menos: obligación parcial y recargo diferido). | Todos | A validar · Mejorar | M07 §6.9 |
| RN-COB-117 | Reutilización: intención idéntica (importe, pagador, email, nombre, conector, medios y obligaciones) creada dentro de la ventana se reutiliza; no aplica a conectores que no lo soporten. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-118 | Se descartan intenciones ≤ monto mínimo (por defecto ARS 10) y con importe ≥ tope técnico del conector (ej. QR masivo < 100.000.000). | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-119 | Pagos sin intención previa (pago desde la app del proveedor o QR externo): se crea una intención tipo "web" con ítems de la metadata o referencia; si no se identifican, va a no identificados. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-120 | Elección del conector: por canal de pago configurado; si no, conector por defecto del canal (web, caja, QR de caja, terminal); si no hay, offline (cupón para ente). | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-121 | Cobertura de medios por conector: link/botón (Pagos360, SIRO, Mercado Pago, Macro, PayFun, Pagos TIC, SiPago, Helipagos); QR dinámico en caja (Pagos360, SIRO, NaranjaX); QR estático (Pagos360, SIRO)… | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-122 | Pago incierto: ante timeout o error 5xx al crear o confirmar, la intención pasa a Resultado incierto; un job reconsulta por referencia externa; recién con respuesta concluyente se reintenta o se… | Todos | Adoptada · Reemplazar | M07 §6.9 |
| RN-COB-123 | Tras restaurar un respaldo o reprocesar, antes de cualquier reenvío se consultan los identificadores externos existentes en el proveedor (ESC-04). | Todos | Adoptada · Adoptar | M07 §6.9 |
| RN-COB-124 | Rechazo de pasarela (RECHAZADA/ERROR): la intención pasa a Rechazada y el portal vuelve a mostrar la deuda como pagable. | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-125 | Esperas fijas (25 s SIRO, 10 s ProvinciaNet) se reemplazan por consulta asíncrona con backoff. | Todos | Adoptada · Reemplazar | M07 §6.9 |
| RN-COB-126 | Comisiones de la transacción se toman del proveedor (bruta, neta, IVA, neto); si el proveedor no las informa (Mercado Pago por API), se calculan con la tarifa del conector y se marcan como estimadas… | Todos | Adoptada · Mejorar | M07 §6.9 |
| RN-COB-127 | El débito por tarjeta o CBU de Pagos360 se modela como intención tipo débito vinculada al mandato; tipo según largo del medio (22 dígitos = CBU). | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-128 | SIRO: el identificador externo de la intención antepone "8" al número (la rendición SIRO descarta los que empiezan con 8 para no duplicar con el botón). | Todos | Adoptada · Replicar | M07 §6.9 |
| RN-COB-129 | El token de sesión de cada proveedor se cachea con su vencimiento real; nunca sin control de expiración. | Todos | Adoptada · Mejorar | M07 §6.9 |
| RN-COB-130 | Webhooks: endpoint `/api/v1/ext/cob/webhooks/{connector}/{tenantSlug}` con token por conector; responde 2xx tras persistir; procesa asíncrono por cola. | Todos | Adoptada · Reemplazar | M07 §6.9 |
| RN-COB-131 | Devolución: estados Solicitada → Aprobada → En ejecución → Ejecutada → Conciliada (o Rechazada, Cancelada, Fallida); quien solicita no aprueba; la ejecución usa clave de idempotencia; el importe no… | Todos | Adoptada · Adoptar | M07 §6.10 |
| RN-COB-132 | La devolución por el proveedor solo si el conector declara la capacidad; si no, se ejecuta por M14 (transferencia) y se concilia. | Todos | A validar · Adoptar | M07 §6.10 |
| RN-COB-133 | Contracargo: transacción negativa del proveedor; revierte las imputaciones del pago (la obligación vuelve a Pendiente), marca la intención Revertida, opcionalmente crea débitos por interés diario de… | Todos | A validar · Mejorar | M07 §6.10 |
| RN-COB-134 | El débito por reversión usa concepto exento; si el concepto configurado está gravado, se rechaza la configuración. | Todos | Adoptada · Replicar | M07 §6.10 |
| RN-COB-135 | Reversión por cuenta o por factura según configuración; devuelve la lista de cuentas a bloquear. | Todos | Adoptada · Replicar | M07 §6.10 |
| RN-COB-136 | Conciliación de cobranzas por canal y día: pagado (bruto) = Σ transacciones confirmadas; comisión = Σ comisiones; neto esperado = bruto − comisión − retenciones del canal; acreditado = movimiento… | Todos | Adoptada · Mejorar | M07 §6.10 |
| RN-COB-137 | La comisión no reduce el importe cancelado por el socio: se registra como gasto financiero. | Todos | Adoptada · Adoptar | M07 §6.10 |
| RN-COB-138 | Un día de conciliación se cierra con acta; las diferencias no resueltas pasan al día siguiente identificadas. | Todos | Adoptada · Adoptar | M07 §6.10 |
| RN-COB-139 | La lista de cobro congela importes a la fecha prevista; al cobrar en campo, si la fecha real difiere, el recargo se recalcula al sincronizar y la diferencia va a revisión. | Todos | Adoptada · Adoptar | M07 §6.11 |
| RN-COB-140 | Recibo provisorio offline numerado por dispositivo (serie del cobrador + correlativo); al sincronizar se emite el recibo definitivo vinculado. | Todos | Adoptada · Adoptar | M07 §6.11 |
| RN-COB-141 | Duplicados offline: `clientMutationId` único por tenant; reenvío devuelve el resultado original. Si la obligación fue pagada por otro canal entre medio, el cobro offline va a saldo a favor y a… | Todos | Adoptada · Adoptar | M07 §6.11 |
| RN-COB-142 | Cobro por cuenta de terceros: según configuración del tercero no se admiten pagos múltiples del mismo comprobante, importes negativos sin devolución, vencidos o menores al mínimo; se crea una… | TAS | Adoptada · Replicar | M07 §6.11 |
| RN-COB-143 | Comisión remota: recargo de cobranza remota con su concepto e IVA, importe máximo por factura, solo efectivo y cajas habilitadas. | Todos | Adoptada · Replicar | M07 §6.11 |
| RN-COB-144 | Resolutor Red Link LAG: servicio = dígitos 9-10 del identificador de 10 (01 EN, 02 GS, 04 AG, 05 SV; 03 sin tipo); cuenta = primeros 8 dígitos (7 si gas); se interpreta como cuenta+servicio si el… | AG, GAS | A validar · Replicar | M07 §6.12 |
| RN-COB-145 | Búsqueda LAG mejorada: solo obligaciones impagas de esa cuenta y servicio con algún importe por vencimiento = importe pagado y emisión ≤ fecha de cobro; desempate por vencimiento vigente a la fecha… | Todos | Adoptada · Mejorar | M07 §6.12 |
| RN-COB-146 | Si no hay coincidencia por cuenta, se busca por alias (código del sistema anterior) y, para gas, por el identificador original de 10 dígitos. | GAS | A validar · Replicar | M07 §6.12 |
| RN-COB-147 | El identificador se trata como texto (sin desborde de enteros); una línea mal formada se rechaza individualmente, no el archivo completo. | Todos | A validar · Reemplazar | M07 §6.12 |
| RN-COB-148 | Exportación SIRO LAG: convenio normalizado a 10 y con "0" antepuesto (11) para el código de barras 0447 de 56; si el código supera el ancho (importe ≥ ARS 100.000,00 o > 99 días entre vencimientos)… | Todos | A validar · Mejorar | M07 §6.12 |
| RN-COB-149 | Configuración LAG a migrar: Red Link (convenio D67, rendición propia, envío 19/10, caja 101, diferir solo mora, sin tope de vencimiento, sin entregas, mora pasado el último vencimiento, sin comisión… | Todos | A validar · Replicar | M07 §6.12 |
| RN-COB-150 | Las ramas muertas y de otras cooperativas ("FAL", "LAGU", `E_SIRO.cs:26`) no se portan. | Todos | Adoptada · Descartar | M07 §6.12 |
| RN-COB-151 | **Cuenta corriente por titular y entidad jurídica** (DEC-087, PA-DAT-01 asumida la recomendada, DEC-072): la clave de la cuenta es (`holderId`, `legalEntityId`) más la modalidad (servicio o grupo); una… | Todos | A validar · Adoptar | M07 §6.2 |
| RN-COB-152 | **Un recibo por entidad jurídica**: una operación de caja, cobrador, ente o pasarela que cancela deuda de varias entidades emite un recibo por entidad, numerado con el talonario o punto de venta de esa… | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-153 | **Cobro con caja de otra entidad**: cuando la caja pertenece a la entidad A y cobra deuda de la entidad B, el recibo es de B, la sesión registra el ingreso por entidad y el cierre informa a M14 y a M15 los… | Todos | A validar · Adoptar | M07 §6.2 |
| RN-COB-154 | **Historia en línea y consulta diferida** (DEC-087, PA-DAT-02): obligaciones, movimientos, imputaciones, recibos y sus PDF permanecen en línea sin límite; el detalle accesorio de más de 36 meses (líneas… | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-155 | **Cambio de titularidad** (DEC-045): la deuda queda en la cuenta corriente del titular saliente; el alta del nuevo titular abre su propia cuenta corriente desde la fecha del cambio y solo asume deuda… | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-156 | **Cupón de pago por entidad jurídica** (DEC-064, DEC-087): un `paymentCoupon` agrupa solo obligaciones de una misma `legalEntityId`; si el estado de cuenta o la selección del titular incluye deuda de… | Todos | Adoptada · Adoptar | M07 §6.2 |
| RN-COB-157 | **Clase de ítem de la obligación** (`itemClass` de M05, RF-FAC-176, RN-FAC-156): M07 recibe la clase en cada obligación y la conserva en imputaciones, recibos y en `cob.payment.confirmed`. Una obligación… | Todos | Adoptada · Adoptar | M07 §6.2 |

<a id="catalogo-m08-mor"></a>

### M08 MOR — Mora y financiación (147 reglas)

Fuente: [`M08-MOR-mora-financiacion.md`](../especificacion/anexos/M08-MOR-mora-financiacion.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-MOR-001 | Único motor de interés para todos los canales. | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-002 | El interés se habilita por documento salvo: documento sin interés; cuenta sin recargo cuando la política respeta esa marca; titular con condición eximida (jubilado u otra condición configurable)… | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-003 | Descuento por pronto pago: si la fecha de cálculo es anterior al VTO1 y existe tramo para el tipo de documento, aplicar tasa negativa por días desde la emisión; solo a socios. Los tramos de un tipo… | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-004 | Entre VTO1 y último vencimiento: `entreVto = TOTAL_k(vigente) − TOTAL1 − absorbido`, donde absorbido es el recargo ya cobrado en pagos previos según la fecha del último pago; si jubilado y política… | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-005 | Pasado el último vencimiento: fecha base sin pagos = VTO1 (o último vencimiento con la opción "desde último vencimiento"); con pagos parciales = vencimiento que corresponde a la fecha del último… | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-006 | Base sin pagos = TOTAL1 (o TOTAL del último vencimiento con la opción) − impuestos excluidos; con pagos = SALDO − impuestos excluidos × SALDO / TOTAL1; con base por conceptos = suma de ítems de… | Todos | A validar · Mejorar | M08 §6.1 |
| RN-MOR-007 | Método **tasa fija diaria**: `interés = base × tasa × días / 100`. La tasa puede venir del ente recaudador. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-008 | Método **índices**: factor = índice "anterior o igual" a la fecha de cálculo / índice "siguiente o igual" a la fecha base − 1; `interés = base × factor`; tasa diaria equivalente = factor / días × 100… | Todos | A validar · Mejorar | M08 §6.1 |
| RN-MOR-009 | Método **tabla de tasas**: por cada tramo `[desde, hasta]` vigente que se solapa con `[fecha base, fecha de cálculo]`, filtrado por tipo de documento (exacto o general) y servicio… | Todos | A validar · Replicar | M08 §6.1 |
| RN-MOR-010 | No se admiten dos tasas del mismo servicio, tipo de documento y alcance de categorías (incluido "sin categorías") con vigencias superpuestas. | Todos | A validar · Mejorar | M08 §6.1 |
| RN-MOR-011 | El IVA del interés usa el concepto de interés por tipo de documento, o el general, o el de modo financiación; percepción con la del producto; IIBB con el régimen vigente. Si no hay concepto… | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-012 | Con la opción "discriminar" o "desde último vencimiento": `entreVto = (TOTAL4 − TOTAL1 − absorbido) × SALDO / TOTAL1`; si no es "desde último vencimiento", se descuenta del recargo por mora para no… | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-013 | Mínimo de recargo por mora: por defecto, si el recargo calculado es menor que el mínimo, vale 0 ("umbral de exención"); alternativa configurable "piso" (se cobra al menos el mínimo). | Todos | A validar · Mejorar | M08 §6.1 |
| RN-MOR-014 | Gastos administrativos fijos por documento cuando pasó el último vencimiento, solo con concepto habilitado y fundamento registrado. | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-015 | Recargo total = mora + entre vencimientos + gastos; redondeo según regla explícita (1 decimal opcional, modo half-up por defecto). | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-016 | El interés es simple y diario; no se capitaliza; la base nunca incluye interés ya facturado del mismo documento. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-017 | El motor calcula desde `interestSettledUntil` del documento; cada liquidación (cobro en el acto, diferido, corrida masiva, convenio) actualiza esa marca en la misma transacción que el cargo. | Todos | Adoptada · Reemplazar | M08 §6.1 |
| RN-MOR-018 | Ente recaudador puede fijar: recargo desde último vencimiento, modo de diferimiento y cobro al VTO1, y una tasa diaria propia. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-019 | Comprobantes con VTO2 anterior a hoy menos N días se excluyen de caja y consulta salvo permiso. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-020 | Fecha de cálculo fija para caja local: solo con capability `mor.cotizacion.fechaFija` y registrada en el cálculo. | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-021 | Dispensa del recargo en caja: requiere aprobación de supervisor con motivo; el documento conserva el interés como "dispensado" (no lo libera para cobrarlo después). | Todos | Adoptada · Mejorar | M08 §6.1 |
| RN-MOR-022 | Interés en reversiones: `saldo revertido × tasa reversión × días(fecha reversión − fecha pago) / 100`. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-023 | Comprobante de intereses adelantados en facturas: tipo de documento configurable para facturar por adelantado intereses de cuotas. | Todos | A validar · Replicar | M08 §6.1 |
| RN-MOR-024 | Forma de cobro del interés entre vencimientos y presentación (columna separada en caja, interés completo en consulta). | Todos | A validar · Replicar | M08 §6.1 |
| RN-MOR-025 | Punitorios sobre energía: política específica del servicio eléctrico. | ELE | A validar · Replicar | M08 §6.1 |
| RN-MOR-026 | Prepago: al vender crédito, retener intereses de deuda salvo excepción con "no retener" vigente. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-027 | Interés por valores a fecha: tasa diaria × días entre la fecha de cobro y la fecha del valor, con concepto propio. | Todos | Adoptada · Replicar | M08 §6.1 |
| RN-MOR-028 | Variante **ninguno**: `TOTALk = TOTAL1`. | Todos | Adoptada · Replicar | M08 §6.2 |
| RN-MOR-029 | Variante **porcentaje variable**: `TOTALk = TOTAL1 + IVA(TOTAL1 × p% × días(VTOk − VTO1))` (interés simple sobre TOTAL1). | Todos | Adoptada · Replicar | M08 §6.2 |
| RN-MOR-030 | Variante **porcentaje fijo por escalón**: VTO2 = TOTAL1 + IVA(TOTAL1 × p%); VTO3 sobre el total del VTO2; VTO4 sobre el del VTO3 (compuesto por escalón, base con IVA del escalón anterior). | Todos | Adoptada · Replicar | M08 §6.2 |
| RN-MOR-031 | Variante **importe fijo**: suma `v × 1`, `× 2`, `× 3` para VTO2/3/4. ProCoop no aplica IVA. | Todos | A validar · Mejorar | M08 §6.2 |
| RN-MOR-032 | Variante **trama por importe**: se elige la trama del tipo de documento (exacto antes que general, luego por código) cuyo rango contiene el TOTAL1; `interés = importe × valor% × días(VTOk − VTO1)` o… | Todos | A validar · Mejorar | M08 §6.2 |
| RN-MOR-033 | Variante **trama por vencimiento**: la trama con desde = hasta = 1/2/3 corresponde a VTO2/3/4; si falta, primera trama del tipo; sin cascada. | Todos | Adoptada · Replicar | M08 §6.2 |
| RN-MOR-034 | El recargo entre vencimientos se informa en la factura pero se documenta fiscalmente al cobrarse (RF-MOR-020); al cobrar se separa el IVA del importe embebido. | Todos | Adoptada · Replicar | M08 §6.2 |
| RN-MOR-035 | `ExisteMoratas` solo informa tasas específicas del tipo de documento con descripción y sin mirar vigencia. | Todos | Adoptada · Reemplazar | M08 §6.2 |
| RN-MOR-036 | Cuenta contable de intereses en vencimientos 2 y 3 la define M15 por concepto. | Todos | Adoptada · Reemplazar | M08 §6.2 |
| RN-MOR-037 | Modo de diferimiento: 1 no diferir; 2 diferir interés por mora; 3 diferir todo (0 = 1). El ente puede sobrescribirlo. | Todos | Adoptada · Replicar | M08 §6.3 |
| RN-MOR-038 | Lo cobrado en el acto se documenta en un comprobante nuevo por cuenta + situación IVA + situación IIBB (+ tipo de documento si se agrupa), con ítems por documento de origen, subtipo "intereses… | Todos | Adoptada · Replicar | M08 §6.3 |
| RN-MOR-039 | Lo diferido crea un interés diferido (operación débito o crédito si el neto es negativo) con cuota de tipo "intereses diferidos" para la próxima factura, opcionalmente relacionada con el servicio. | Todos | Adoptada · Replicar | M08 §6.3 |
| RN-MOR-040 | Bloquear con intereses genera siempre factura (aunque la política diga ND) con ítem con IVA incluido. | Todos | Adoptada · Mejorar | M08 §6.3 |
| RN-MOR-041 | Selección: documentos de débito, no anulados, sin marca "sin interés"; con "solo sobre cargos": VTO1 en rango; con "pagos entre fechas": VTO1 anterior a hasta (y en la variante con valores, saldados… | Todos | Adoptada · Replicar | M08 §6.4 |
| RN-MOR-042 | Variante estándar: historia de pagos (la emisión cuenta como primer evento, pagos agrupados por día); por tramo: escalones de vencimientos dentro del tramo (IVA incluido) y, pasado el último… | Todos | Adoptada · Replicar | M08 §6.4 |
| RN-MOR-043 | Variante "fecha de pago según valores" (AL): ajustes por pagos y valores anteriores al rango, proporciones acotadas entre 0 % y 100 %. Variante "cheques": interés por cada valor desde la fecha desde… | Todos | A validar · Mejorar | M08 §6.4 |
| RN-MOR-044 | Variante CAU: con "solo impagas", punitorio único `SALDO × tasa / 100` sin días; sin esa opción, tramo VTO1→VTO2 sobre conceptos base × % entre vencimientos y desde VTO2… | Todos | A validar · Mejorar | M08 §6.4 |
| RN-MOR-045 | Preliminar con tramos seleccionables; solo lo seleccionado se factura; totales por documento suman solo tramos seleccionados. | Todos | Adoptada · Replicar | M08 §6.4 |
| RN-MOR-046 | Generación: agrupa por situación IVA, cuenta y titular; un cargo por cuenta; un ítem por documento con el **neto** del interés (el IVA se recalcula al facturar con el concepto elegido); forma de pago… | Todos | Adoptada · Mejorar | M08 §6.4 |
| RN-MOR-047 | Al generar, actualizar `interestSettledUntil` = fecha hasta de la corrida para los documentos incluidos (reemplaza `NOINTERES = 1` y `COD_FAC='Punitorio'`). | Todos | Adoptada · Reemplazar | M08 §6.4 |
| RN-MOR-048 | Asignar o quitar bloqueo por causa en lotes, registrando historial con causa, fecha e **identificador** de usuario; los bloqueos de sistema no se tocan. | Todos | A validar · Mejorar | M08 §6.5 |
| RN-MOR-049 | Si la política lo indica, la caja no permite pagar en forma parcial la deuda de una notificación abierta: deben incluirse todos sus documentos. | Todos | Adoptada · Replicar | M08 §6.5 |
| RN-MOR-050 | Si la política lo indica, la caja exige cobrar primero los documentos más antiguos (por VTO1 o por último vencimiento; general o del mismo servicio). | Todos | Adoptada · Replicar | M08 §6.5 |
| RN-MOR-051 | Aviso en caja y consulta de deuda si el titular está notificado; advertencia si el documento pertenece a un servicio desconectado; control de deuda vencida del titular. | Todos | Adoptada · Replicar | M08 §6.5 |
| RN-MOR-052 | Bloqueo de caja al generar orden de cambio de estado por mora. | Todos | A validar · Replicar | M08 §6.5 |
| RN-MOR-053 | Estados de la notificación: Abierta (0), Pagada (1), Procesada (2, pasó a otra instancia), Excluida (3, baja con causa), En técnica (4). Se agregan: Cerrada y Anulada (por anulación de lote). | Todos | Adoptada · Mejorar | M08 §6.6 |
| RN-MOR-054 | Calificación: Sin calificar, Buena, Regular, Mala. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-055 | Tipos de notificación: documento impreso, correo, SMS, aviso telefónico, talón de pago; se agregan WhatsApp y push. | TEL | Adoptada · Mejorar | M08 §6.6 |
| RN-MOR-056 | Tipos de operación: Generar (desde candidatos) y Procesar (instancias siguientes). | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-057 | Deudas candidatas: documentos no anulados con saldo; opcionalmente excluir créditos y créditos bloqueados; aplicar clase, tipo y rango; opción "sin deuda" invierte el criterio. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-058 | Excepciones que excluyen: vigentes (autorizada, no cancelada o cancelación futura, fecha hasta futura o nula) con "no reclamar"; sin fecha de deuda excluye la cuenta entera; con fecha de deuda… | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-059 | Cuentas con notificación abierta no se vuelven a cargar salvo opciones (ignorar notificación previa; ignorar candidato previo; verificar solo instancia inicial; excluir por mismo tipo de… | Todos | Adoptada · Mejorar | M08 §6.6 |
| RN-MOR-060 | Generar candidatos: notificación en la instancia de candidatos, lote = siguiente número del tenant, un ítem por documento con saldo, deuda = suma de saldos, deuda actualizada = deuda + intereses en… | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-061 | Procesar: solo abiertas; en Generar se toman las de candidatos, en Procesar las demás; filtros de §5.9. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-062 | Al procesar: (1) costo de envío opcional (solo si habilitado); (2) nueva notificación con nuevo lote, instancia destino, vencimiento, modelo, entrega automática según configuración; (3) documentos… | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-063 | Entrega: vencimiento = máx(vencimiento actual, fecha de entrega + días); desmarcar entrega no revierte el vencimiento; entrega automática por configuración o "todas entregadas". | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-064 | Una instancia que exige **constancia** (`evidenceRequired`) solo cuenta como notificada con evidencia válida: acuse de entrega del proveedor, lectura en app, firma de recepción, carta con aviso de… | Todos | Adoptada · Mejorar | M08 §6.6 |
| RN-MOR-065 | Promesa de pago vigente impide el avance de la notificación hasta su fecha; promesa vencida e incumplida se marca incumplida y la notificación vuelve a estar disponible para procesar. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-066 | Bitácora estructurada: cada acción registra fecha, usuario, proceso, observación, estado anterior y nuevo. | Todos | Adoptada · Reemplazar | M08 §6.6 |
| RN-MOR-067 | Anular lote: deshace el lote (notificaciones Anuladas) y reabre las anteriores; solo si no hay efectos posteriores irreversibles (órdenes ejecutadas, cargos emitidos) o tras revertirlos. | Todos | Adoptada · Mejorar | M08 §6.6 |
| RN-MOR-068 | Eliminar notificaciones: solo sin efectos económicos ni técnicos y con motivo; "restablecer" (borrar todas) **no existe**. | Todos | Adoptada · Descartar | M08 §6.6 |
| RN-MOR-069 | Pago: si se pagaron todos los documentos de una notificación abierta o En técnica, pasa a Pagada con fecha y usuario de sistema, en la misma transacción del pago (evento consumido). | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-070 | Validar notificaciones: con la opción activa, marcar "abonada" (deuda actual 0) o "composición cambió" (difiere de la notificada); solo avisa. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-071 | Deuda actualizada de la notificación: recalcula toda la deuda de la cuenta con intereses en modo no diferir y sin créditos; se distinguen documentos notificados y nuevos. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-072 | Impresión agrupada por titular: domicilio, zona, sector, recorrido y empresa postal de la cuenta principal (o menor número); fecha y lote mínimos; deuda sumada; 8 ordenamientos. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-073 | Cuentas sin correo: por defecto faltan ambos (correo de la cuenta y del portal); con "solo correo de la cuenta" mira solo el de la cuenta. Sin celular: falta el móvil de la cuenta y el celular… | Todos | A validar · Mejorar | M08 §6.6 |
| RN-MOR-074 | Instancias marcadas sensible y de corte determinan la condición regulatoria de la cuenta ("R/C" o "A") en exportaciones. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-075 | Plantilla de información del servicio: ignorar valores nulos en la variable de plantilla. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-076 | Incluir resumen de notificaciones al imprimir/generar. | Todos | Adoptada · Replicar | M08 §6.6 |
| RN-MOR-077 | Servicios elegibles para tratamiento: conectados de las cuentas notificadas; error si hay orden pendiente (estado 1 o 2) de la misma transacción. | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-078 | Despacho por acción: categoría nueva → cambio de categoría (efectivo al cumplir la orden); desconexión → con técnica: baja administrativa + orden de desconexión (origen gestión de mora, moroso… | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-079 | La descripción de la orden de reclamo usa la descripción recibida (no la observación técnica) y marca gestión de mora. | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-080 | La orden de cambio de estado lleva origen "gestión de mora" (ProCoop: Titulares) con marcas de moroso. | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-081 | Toda acción de interrupción por mora requiere, antes de emitir la orden: (a) política del servicio que la habilite; (b) instancia previa con constancia si se exige; (c) sin protección bloqueante; (d)… | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-082 | Matriz normativa: cada servicio y jurisdicción tiene restricciones de tipo `normative` (no editables por el tenant) o `tenantPolicy`; tipos: preaviso mínimo (días y canal con constancia), ventana de… | TEL, TV, AG, CLO, GAS, OBR, SEP, CEM, SAN, SAL, VIV, TAS, OTR | A validar · Mejorar | M08 §6.7 |
| RN-MOR-083 | Internet (piloto): suspensión por mora = restricción o suspensión del acceso vía aprovisionamiento remoto (perfil de suspensión o portal cautivo), sin retiro de equipo; baja por mora no retira el… | INT, TEL | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-084 | Electricidad: no se suspende un suministro con electrodependencia acreditada; la evaluación de mora unificada no impone baja definitiva sin verificar el servicio. | ELE | A validar · Mejorar | M08 §6.7 |
| RN-MOR-085 | Agua: baja/desconexión, cargos remanentes y rehabilitación según el marco del servicio, sin copiar la suspensión de Internet. Los modos operativos (reducción de caudal o interrupción) se definen en… | INT, AG | A validar · Mejorar | M08 §6.7 |
| RN-MOR-086 | Gas: la reconexión exige inspección de rehabilitación aprobada; la app muestra "Rehabilitación en trámite" hasta la confirmación; el pago no acredita instalación segura. | GAS | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-087 | Cementerio parque: la mora no autoriza cancelar derechos ni disponer de restos; requiere revisión jurídica/operativa específica; no se habilita "corte". | CEM | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-088 | Banco de sangre: la deuda no puede condicionar la disponibilidad clínica ni la respuesta urgente; no hay suspensión de cobertura sanitaria por mora sin revisión del convenio. La revisión del convenio… | SAN | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-089 | Retiro de medidor en la desconexión: por defecto marcado o preguntar al técnico. | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-090 | No facturar: marcar el servicio para no facturar con causa y vigencia. | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-091 | Al confirmarse un pago: si existe orden de desconexión por mora pendiente y la deuda que la motivó quedó cancelada según el criterio de reconexión, cancelar la orden; si no se reconecta, quitar la… | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-092 | Reconexión automática: servicios suspendidos/desconectados **por un caso de mora** sin orden de reconexión pendiente; deuda que impide reconectar según criterio: 0 toda la deuda, 1 vencida al VTO2… | INT, CLO | A validar · Mejorar | M08 §6.7 |
| RN-MOR-093 | Reconexión sin técnica: marca moroso falso, estado conectado, fecha de alta = hoy (o se conserva según #2707 para no medidos en el mismo mes). | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-094 | Reconexión con técnica: orden "Reconexión generada automáticamente por cobranza"; con confirmación automática solo si existe aprovisionamiento remoto confirmable y la respuesta es exitosa; sin… | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-095 | Cargo de reconexión: regla por servicio, socio activo o no, moroso o no, prepago, zona, localidad, categoría, clase, estado y propiedad; una sola vez; cobrar antes (requisito para emitir la orden) o… | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-096 | Ajuste por días sin servicio: al reconectar servicios de cargo proporcional, crédito por días desconectados del mes o débito por días restantes si el servicio no fue facturado en el período… | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-097 | Validaciones de reconexión: titular fallecido solo si se permite; factibilidad exigida en servicios que informan a técnica. | Todos | Adoptada · Replicar | M08 §6.7 |
| RN-MOR-098 | Integraciones remotas: Discar (conectar/desconectar; operaciones con fecha que, si el usuario la omite, devuelven "éxito" sin impactar), SITSA (contrato por cuenta, suspendido/habilitado), MikroTik… | Todos | Adoptada · Mejorar | M08 §6.7 |
| RN-MOR-099 | Se distinguen: baja contractual, suspensión temporal solicitada por el socio, suspensión por mora, suspensión por otro motivo, reactivación y reconexión; la suspensión no extingue el contrato. | Todos | Adoptada · Mejorar | M08 §6.8 |
| RN-MOR-100 | La solicitud de baja no genera cargo, no exige registro previo para servicios comprendidos (Internet: botón visible, sin trámite previo, código identificador dentro de 24 h por el mismo medio) y no… | INT | Adoptada · Informado | M08 §6.8 |
| RN-MOR-101 | Costos de suspensión y reactivación solo con regla habilitada, respaldada para el servicio y jurisdicción, y aprobada por el responsable normativo; la aceptación del socio se conserva con versión de… | INT, TV | Adoptada · Mejorar | M08 §6.8 |
| RN-MOR-102 | El estado real del servicio cambia solo con la confirmación de ejecución; sin confirmación técnica el caso queda en trámite. | Todos | Adoptada · Mejorar | M08 §6.8 |
| RN-MOR-103 | Durante una suspensión voluntaria, los cargos recurrentes siguen la regla de pausa aprobada del servicio (pausa total, cargo reducido, mínimo); por defecto, si no hay regla, el abono **no** se pausa… | Todos | Adoptada · Informado | M08 §6.8 |
| RN-MOR-104 | Reactivar un contrato cerrado requiere nueva alta cuando el servicio así lo define (Internet: sí). | INT | Adoptada · Informado | M08 §6.8 |
| RN-MOR-105 | Fórmulas por método (C capital a financiar, C' = C − interés por mora si no capitaliza, n cuotas, i tasa por período): 1 sin interés: capital C/n, interés 0; 2 directo: capital C/n, interés fijo… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-106 | Interés directo con quita: la base del interés es el capital **neto** de quita en todos los métodos. | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-107 | Vencimiento de la cuota k = primer vencimiento + período × (k − 1) meses; la cuota 0 (entrega) vence hoy (o la fecha fijada en la política de anticipo). | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-108 | IVA e IIBB del interés por cuota con concepto de financiación (o de venta); con "tasa con IVA" el interés se toma con IVA incluido y se separa; percepción de IVA solo en factura en cuotas con… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-109 | Capital a financiar `C = Neto − Entrega − Quita`; en factura en cuotas con intereses se parte del total con IVA. Entrega en plan de pago: IVA proporcional… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-110 | Distribución del interés anterior y de la mora en las cuotas: proporción sobre `Neto − Quita` aplicada al capital de cada cuota; la quita de interés anterior aplica sobre su porción; la quita de mora… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-111 | Concepto de cuota en factura mensual con alícuota exenta: la cuota se factura exenta con el IVA dentro del neto. | Todos | A validar · Replicar | M08 §6.9 |
| RN-MOR-112 | Quita del 100 % con entrega 0: la quita se reparte en partes iguales al calcular el IVA y la cuota 0 no recibe distribución. | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-113 | Cantidad de cuotas para importe objetivo: `n₀ = piso((Neto − Entrega)/importe)`, acotado a [mín, máx] con aviso; buscar el primer n desde n₀ cuya cuota máxima (más IVA del capital) no supere el… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-114 | Registro del convenio en una transacción: validar submódulo de facturación abierto y capital ≥ 0 (con rollback explícito en error); sustituir obligaciones de origen (quedan "Incluidas en convenio"… | CAP | Adoptada · Mejorar | M08 §6.9 |
| RN-MOR-115 | Obligaciones incluidas: por documento capital (saldo o capital si es cuota), recargo, total, interés entre vencimientos y de mora por separado, saldo y fecha de saldo originales para revertir. Notas… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-116 | Refinanciación: una cuota impaga incluida se descompone en capital (concepto capital), interés anterior (financiación actual + anterior; vuelve a generar interés salvo quita) y mora anterior (se suma… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-117 | Modalidad cuota en factura mensual: cargo pendiente por cuota que la facturación incorpora; entrega y sellado se emiten de inmediato. Modalidad chequera: un documento por cuota con un solo… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-118 | Límites: máximo de convenios por período de control (o en total si las fechas no son válidas); una sola financiación activa del mismo tipo; cuotas mensuales facturadas vencidas impagas del tipo… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-119 | Ajuste por índice al facturar la cuota: factor = índice de hace R meses / índice del mes anterior a la fecha del convenio (R configurable, default 2 como ProCoop); ítem… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-120 | Bonificación por adelanto: si la cuota se factura por adelantado, ítem negativo igual al interés de financiación completo de la cuota con el mismo IVA; concepto de financiación o de venta; concepto… | Todos | Adoptada · Replicar | M08 §6.9 |
| RN-MOR-121 | Anulación: requiere permiso y confirmación; convenio existente; submódulo de financiaciones abierto a la fecha del convenio; en chequera ninguna cuota con pagos (si hay factura de entrega no anulada… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-122 | Recalcular cuotas por situación fiscal: cuotas de chequera emitidas en rango sin ningún pago cuya situación de IVA difiere de la actual (y una es la situación "7") o cuya alícuota de percepción IIBB… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-123 | Caducidad (no existe en ProCoop): el plan define el disparador (N cuotas impagas consecutivas o alternadas, o D días de atraso de la cuota más antigua, o anticipo impago en P días), aviso previo con… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-124 | Anticipo impago: el convenio no entra en vigencia; vencido el plazo, se cae sin anticipo y se restituyen las obligaciones de origen a su estado previo (sin intereses de financiación). | Todos | Adoptada · Informado | M08 §6.9 |
| RN-MOR-125 | CFT: tasa i por período que iguala el capital neto recibido (deuda incluida − anticipo) con el flujo de cuotas (capital + interés + IVA del interés + sellado + cargos); se informa CFT efectivo anual… | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-126 | Un convenio vigente no puede convivir con la exigencia íntegra de su deuda de origen: la deuda de origen no se notifica, no genera interés propio desde la fecha del convenio y no se cobra por… | Todos | Adoptada · Adoptar | M08 §6.9 |
| RN-MOR-127 | Imputación de pagos a cuotas: por orden de vencimiento, primero cuota más antigua; dentro de la cuota: mora de la cuota, interés, IVA, capital (orden configurable por política fiscal, M07). | Todos | Adoptada · Adoptar | M08 §6.9 |
| RN-MOR-128 | Cambiar el garante: exige persona válida y su firma; si cambia de "sin garante" a "con garante" (o al revés), se regenera el texto con la plantilla correspondiente como adenda. | Todos | Adoptada · Mejorar | M08 §6.9 |
| RN-MOR-129 | Heurística de cuotas hermanas de factura en cuotas (misma cuenta, fecha, total y cantidad) se reemplaza por vínculo explícito al documento de venta. | Todos | Adoptada · Reemplazar | M08 §6.9 |
| RN-MOR-130 | Informe de financiaciones "no incluir cancelados": excluye convenios sin cuotas pendientes en **ambas** modalidades (ProCoop deja visibles chequeras totalmente pagas). | Todos | A validar · Mejorar | M08 §6.9 |
| RN-MOR-131 | Informe de cuotas facturadas: la columna de interés anterior se rotula como tal (ProCoop rotula `InteresPorM` con `IAN_FIN`). | Todos | Adoptada · Mejorar | M08 §6.9 |
| RN-MOR-132 | Un depósito en garantía es un pasivo con el socio: se aplica contra deuda solo en la baja o ante incumplimiento con causa y liquidación, y el remanente se devuelve (M14). | Todos | Adoptada · Adoptar | M08 §6.10 |
| RN-MOR-133 | La deuda en gestión externa/judicial no se notifica por la gestión interna ni se incluye en convenios sin autorización del responsable de recupero; los pagos se imputan a la deuda original y… | Todos | Adoptada · Adoptar | M08 §6.10 |
| RN-MOR-134 | Gastos y honorarios: a cargo de la cooperativa salvo título que los traslade (sentencia, convenio firmado); los trasladados se documentan como cargo propio (no como interés). | Todos | A validar · Pendiente de decisión | M08 §6.10 |
| RN-MOR-135 | Incobrable: propuesta con criterio → aprobación (doble control) → estado Incobrable del documento con saldo histórico conservado → evento contable de castigo (M15); recupero posterior revierte… | Todos | Adoptada · Adoptar | M08 §6.10 |
| RN-MOR-136 | Prescripción: plazo por tipo de obligación desde la fecha de cómputo; se interrumpe por reconocimiento (convenio, pago parcial si la política lo considera, promesa firmada) o por demanda; el informe… | Todos | A validar · Mejorar | M08 §6.10 |
| RN-MOR-137 | Telefonía (TEL): la suspensión por mora es un **bloqueo de llamadas salientes** (`restricted`, por defecto) que conserva las entrantes; la interrupción total (`interrupted`) solo si la política del… | INT, TEL | A validar · Nuevo | M08 §6.7 |
| RN-MOR-138 | TV: modos de suspensión por mora `restricted` (**grilla mínima**: el abonado conserva solo el paquete mínimo configurado por el tenant) e `interrupted` (corte total de la señal o deshabilitación del… | TV | A validar · Nuevo | M08 §6.7 |
| RN-MOR-139 | Agua (AG): modos de mora `restricted` (**reducción de caudal** con limitador o válvula, sin bajar del caudal mínimo vital configurado) e `interrupted` (corte, solo si la concesión lo admite); por… | AG, SAL | A validar · Nuevo | M08 §6.7 |
| RN-MOR-140 | Cloacas (CLO): **sin suspensión física** por mora; solo gestión de deuda: avisos, intereses, convenio de pago y gestión extrajudicial o judicial. Restricción `normative` `noSuspension` para… | CLO | A validar · Nuevo | M08 §6.7 |
| RN-MOR-141 | La deuda de **conceptos facturados por cuenta de terceros** (por ejemplo, tasa de alumbrado público u otras tasas municipales) no habilita la suspensión ni el corte del servicio principal con el que… | ALU, TAS | A validar · Nuevo | M08 §6.7 |
| RN-MOR-142 | El saldo de conceptos de terceros **se excluye por defecto del saldo elegible** de mora (RF-MOR-068) y de la base de intereses y recargos propios; se incluye solo si el convenio con el tercero lo… | TAS | A validar · Nuevo | M08 §6.7 |
| RN-MOR-143 | **Cobertura social** (sepelio, salud y prestaciones sociales de M18): restricción `tenantPolicy` `socialCoverageSuspension` con los meses de cuotas impagas que habilitan **suspender la cobertura** (no la… | SEP, SAL | A validar · Nuevo | M08 §6.7 |
| RN-MOR-144 | Banco de sangre, modalidad "aporte del socio": un aporte impago con la antigüedad configurada crea una **tarea de revisión** (T11, tipo `review`) en la bandeja del responsable del servicio social… | SAN | Adoptada · Nuevo | M08 §6.7 |
| RN-MOR-145 | **Plantilla de plataforma de ventanas de corte**: para electricidad en la jurisdicción Córdoba (ERSeP), cargada como restricciones `normative` de `executionWindow` del catálogo de plataforma (API-MOR-51)… | ELE | A validar · Nuevo | M08 §6.7 |
| RN-MOR-146 | Contribución de obra (OBR): el cobro normal de la obra es el plan de cuotas tipo 17 de M04 (`worksInstallmentPlans`; regla de M10). El convenio de M08 **solo** se usa para refinanciar cuotas de obra… | OBR | Adoptada · Nuevo | M08 §6.9 |
| RN-MOR-147 | Cambio de titularidad (DEC-045): la deuda, las notificaciones, los casos de interrupción y los convenios vigentes quedan en la cuenta del **titular saliente**; el nuevo titular solo asume esa deuda… | Todos | A validar · Nuevo | M08 §6.9 |

<a id="catalogo-m09-crm"></a>

### M09 CRM — Atención (CRM) (97 reglas)

Fuente: [`M09-CRM-atencion.md`](../especificacion/anexos/M09-CRM-atencion.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-CRM-001 | Expediente común: una solicitud puede originar varios trabajos y movimientos; cambiar de área no crea otro caso. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-002 | Cerrar un caso no cambia contratos ni cancela deuda; los efectos solo ocurren por comando ejecutado en el módulo dueño. | Todos | Adoptada · Reemplazar | M09 §6 |
| RN-CRM-003 | Resolver un chat no equivale a resolver el problema; cerrar una conversación no cierra el caso. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-004 | Aprobar una solicitud no implica servicio instalado; la prestación es activa solo con el evento de ejecución. | INT | Adoptada · Nuevo | M09 §6 |
| RN-CRM-005 | El socio solo opera sobre personas/cuentas/servicios que tiene autorizados; si elige una ajena se deniega; si no sabe cuál, el caso queda "cuenta a identificar". | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-006 | Una solicitud de alta puede no tener cuenta ni contrato; nunca se inventa un identificador. | INT | Adoptada · Mejorar | M09 §6 |
| RN-CRM-007 | La solicitud de baja no genera cargo, no exige registro previo, pago de deuda ni aceptación de cargos; la deuda se informa aparte. | INT, TEL, TV, ELE, AG, CLO, GAS | Adoptada · Nuevo | M09 §6 |
| RN-CRM-008 | Para servicios alcanzados (Res. 316/2018, ej. Internet) la baja debe poder iniciarse por un botón visible y público; se informa código identificador por el mismo medio dentro de 24 h; si la… | INT, TEL, TV | A validar · Nuevo | M09 §6 |
| RN-CRM-009 | Recibir una solicitud pública no habilita a divulgar datos privados: la consulta pública del caso solo muestra estado y fechas. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-010 | La baja de un servicio no produce baja de asociado ni devolución de capital, y viceversa. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-011 | Suspensión temporal no extingue el contrato; reactivar un contrato cerrado puede requerir nueva alta según el servicio. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-012 | Un costo de suspensión/reactivación solo se ofrece si la regla está habilitada **y** validada para el servicio y jurisdicción; las reglas de demostración están deshabilitadas para producción. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-013 | El caso no informa "reactivado" porque se confirmó el pago de un cargo: espera la confirmación de ejecución. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-014 | Todo comando lleva `Idempotency-Key` derivada de caso + tipo + versión; los reintentos no duplican ejecuciones ni cobros. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-015 | La deuda previa y los documentos históricos se conservan y no impiden solicitar la baja. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-016 | Mensajes visibles y notas internas son tipos distintos; una nota interna nunca se envía al socio ni se expone por API del socio. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-017 | Bot e IA solo acceden a información autorizada del tenant y del socio verificado de la sesión. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-018 | Una sugerencia de IA no confirma bajas, devoluciones, resoluciones de falla, cobros ni decisiones clínicas. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-019 | La derivación inicial corresponde a supervisión; la IA no deriva autónomamente; las reglas deterministas solo proponen salvo habilitación explícita del tenant. | Todos | A validar · Nuevo | M09 §6 |
| RN-CRM-020 | Una sugerencia incorrecta se corrige sin perder el texto original; ambos quedan en el registro. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-021 | Un caso con datos faltantes queda creado e identificado como pendiente de completar; no se rechaza la recepción. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-022 | Casos de un incidente común: la gestión técnica es única; cerrar el incidente lleva los casos a "resuelto pendiente de confirmación"; si un domicilio sigue afectado, ese caso se mantiene o reabre. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-023 | Un aviso fallido queda identificado y genera acción; nunca se declara notificado por haberlo encolado. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-024 | Constancias reguladas (baja, intimaciones) se diferencian de avisos comerciales; "aceptado por el proveedor" no equivale a "entregado" ni a evidencia. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-025 | No hay edición libre de estado: cada transición se valida contra el conjunto de estados y el flujo T11 y se explica por una regla. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-026 | El estado del trámite es distinto del estado real del contrato, equipo, pago y documento; el caso muestra ambos sin mezclarlos. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-027 | Cancelar una visita no cancela la solicitud; anular una solicitud antes de instalar no exige circuito de retiro; si la intervención ya se ejecutó offline, se abre conflicto con ambas evidencias. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-028 | Evidencias con versión aceptada; no se sustituyen silenciosamente; enlaces revocados dejan de funcionar. | Todos | Adoptada · Reemplazar | M09 §6 |
| RN-CRM-029 | Duplicados: al crear, si existe caso abierto con misma cuenta + servicio + subtipo dentro de la ventana, se propone vincular o fusionar; nunca se bloquea la recepción. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-030 | Numeración atómica por contador transaccional; formato según política. | Todos | Adoptada · Reemplazar | M09 §6 |
| RN-CRM-031 | Prioridad: Sin asignar 0, Crítica 1, Alta 25, Normal 50, Baja 75, Muy baja 100; menor valor = más urgente. | INT | Adoptada · Replicar | M09 §6 |
| RN-CRM-032 | Estados visibles ordenados por conjunto, mapeados a un estado base, con banderas: reasignar, vuelve, espera del socio, requiere aprobación, verificación, notificar, pausa SLA. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-033 | Orden de validación al avanzar estado: (1) si está tomado por el usuario se suelta y registra tiempo; (2) si está pausado, se rechaza; (3) volver atrás exige bandera "vuelve" y que no haya horas… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-034 | Reasignación permitida en estados no finales; no si el caso está tomado por otro usuario (salvo supervisor, que lo suelta con nota). | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-035 | Tipos que requieren aprobación no avanzan de "en evaluación" sin decisión T11 de un usuario con `crm.casos.aprobar`. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-036 | Tomar: solo casos asignados a uno mismo; un usuario tiene a lo sumo un caso tomado; al tomar otro elige pausar o soltar el anterior; en verificación registra al verificador. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-037 | Durante una llamada registrada el caso tomado se pausa y se reanuda solo, con nota interna automática. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-038 | Pausar y soltar solo los puede hacer quien tiene tomado el caso. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-039 | "En espera del socio" alterna con el estado asignado y pausa el SLA si la política lo indica; la respuesta del socio por cualquier canal reanuda. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-040 | Cierre: subtipo con bloqueo impide cerrar; tipo de cierre obligatorio; causa obligatoria si el subtipo la registra; nota de cierre; validación interna y del socio opcionales; aviso de cierre según… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-041 | Recuperar un caso cerrado o cancelado exige nota y respeta la ventana de reapertura. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-042 | No se vuelve atrás ni se recupera un caso con horas ya facturadas sin anular primero la facturación en M05. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-043 | Cambios de vencimiento, prioridad o subtipo dejan nota interna automática; si cambia el vencimiento y el contacto tiene canal y no optó por no recibir, se le avisa la reprogramación y se anota "aviso… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-044 | Cancelar registra fecha y usuario de cierre; si cancela alguien distinto del creador se avisa al creador; con presupuesto vinculado se decide rechazado o anulado (comando M11). | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-045 | Fecha compromiso desde presupuesto: aceptado → hoy + (fecha de entrega − fecha de validez) días (30 por defecto); no aceptado → fecha de validez. El cambio avisa al último asignador. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-046 | Bandejas de pendientes excluyen estados finales y "sin asignar" en la vista de todos; la vista de sin responsable excluye tomados o pausados. Agrupación por fecha compromiso… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-047 | Indicador "sin intervención": casos sin evento de trabajo en 7 días y en 8 o más días. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-048 | Desvío de vencimiento = fecha de cierre − fecha compromiso, solo para casos cerrados, con filtro correcto (sin el bug de resultado vacío). | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-049 | Unificar contactos conserva el más antiguo, reapunta casos y marca los demás como fusionados (sin borrado físico). | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-050 | Tiempo: minutos reales = suma de worklogs; minutos a facturar editables (si 0, se usan los reales); bolsas mensuales de soporte y de implementación/venta se descuentan antes de facturar; valor hora y… | Todos | A validar · Mejorar | M09 §6 |
| RN-CRM-051 | Asignar guarda historial y avisa al asignado; puede reiniciar fechas estimadas si cambia el responsable. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-052 | SLA: al crear se resuelve la política más específica (subtipo > tipo; servicio; prioridad); objetivos de primera respuesta y resolución en calendario hábil o corrido; pausa en estados con bandera… | Todos | A validar · Nuevo | M09 §6 |
| RN-CRM-053 | Avisos al socio: cada estado visible define si notifica, plantilla y canales; los avisos respetan preferencias, salvo constancias reguladas. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-054 | Reapertura dentro de la ventana conserva número e incrementa el contador de ciclos; fuera de ventana se crea caso nuevo vinculado como reincidencia. | Todos | A validar · Nuevo | M09 §6 |
| RN-CRM-055 | Reincidencias: grupos de más de un caso por cuenta, por cuenta+servicio o por cuenta+servicio+tipo en el período. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-056 | Estadísticas de demora: desde fecha del caso y desde fecha de registro hasta cierre o "ahora", piso 0; "período anterior" = mismo filtro con todo lo anterior a la fecha desde. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-057 | Numeración de reclamos: sin política única, por reclamo/no reclamo, por tipo, por tipo y reclamo; continua; por servicio en informe. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-058 | Vía de ingreso: por defecto configurable; obligatoria si se habilita; cada vía puede exigir validar celular o email del solicitante. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-059 | Trámite vencido: su fecha de vencimiento pasó o, si no tiene, fecha + días de vencimiento del tipo es anterior a hoy, y no existe otro trámite vigente del mismo tipo para la misma entidad. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-060 | Acciones de trámite al alta y al vencimiento son comandos tipados al módulo dueño; un error en una acción no frena las demás, se registra y se reintenta; marca "accionado". | Todos | A validar · Reemplazar | M09 §6 |
| RN-CRM-061 | Turno: número correlativo por día y área de origen; código visible por nombre (si se habilita), letra + últimos 3 dígitos del documento (si se habilita y hay documento) o letra + número de 3 dígitos… | Todos | A validar · Replicar | M09 §6 |
| RN-CRM-062 | Estados del turno: en espera, llamando, en atención, finalizado; acciones: recepción, en espera, llamado, atendido, derivado, retirado solucionado, retirado sin solución, retirado sin atención; cada… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-063 | Llamar siguiente: transacción con exclusión; toma el próximo en espera de las áreas del usuario, prioritarios primero y luego por hora de ingreso; lo pasa a "llamando" y refresca pantallas. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-064 | Usuario sin áreas asignadas = recepción, ve todas las áreas habilitadas. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-065 | Un box no puede estar abierto dos veces; cerrar es idempotente; al ingresar se carga el último box abierto del usuario. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-066 | Derivar un turno cambia su área actual y conserva el área de origen. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-067 | Tiempo estimado: reparte los turnos pendientes (por prioridad y hora) entre los usuarios con box abierto hoy en el área y suma el tiempo estimado del área de los turnos asignados antes del… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-068 | Estadísticas: cuentan ingresados (acción recepción), atendidos, abandonos (sin atención) y prioritarios; tiempos de espera y atención hasta el movimiento siguiente; opción de excluir movimientos cuyo… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-069 | Últimos llamados: los 5 últimos del día agrupados por box o por turno. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-070 | El box de generación automática se excluye de la lista de boxes abiertos. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-071 | Al cierre del día los turnos en espera pasan a "retirado sin atención" con acción automática. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-072 | Frecuencias: próxima fecha = última + período (semanal 7 d; mensual, bimestral, trimestral, cuatrimestral, semestral, anual por meses calendario; manual cada N días). | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-073 | Se genera la siguiente ocurrencia solo para actividades automáticas y vigentes, cuando próxima fecha − margen anterior ≤ hoy y la próxima fecha no supera la vigencia; numeración atómica; marca… | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-074 | No puede haber dos frecuencias con igual tipo y cantidad de días. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-075 | Destinatarios de recordatorios: unión sin repetidos de responsables y destinatarios adicionales del área y de la actividad. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-076 | Días de envío: 0 = todos los días; 1–7 = día ISO (lunes = 1). | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-077 | Recordatorios una vez por día: el job registra la fecha de último envío por tenant y es idempotente. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-078 | Estado de ocurrencia: cerrada en término si fecha de cierre ≤ fecha + margen posterior; fuera de término si es posterior; próxima a vencer si hoy ∈ [fecha − margen anterior, fecha + margen… | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-079 | Al cerrar una ocurrencia se envía aviso de finalización de forma asíncrona. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-080 | La cita de calendario se crea para el usuario responsable (identificado por usuario, no por email). | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-081 | El bot solo consulta o crea casos; pagos solo por link del proveedor (M07); la baja iniciada por bot sigue el circuito de baja con constancia. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-082 | Fuera de la ventana de 24 h de WhatsApp solo se envían plantillas aprobadas; opt-out bloquea mensajes no transaccionales; demora mínima entre mensajes según proveedor. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-083 | Destino de WhatsApp/SMS: móvil de la cuenta, teléfono web o teléfono de la persona según preferencia y verificación; agrupar facturas por socio cuando corresponda. | Todos | Adoptada · Reemplazar | M09 §6 |
| RN-CRM-084 | Guardias: reglas por servicio, tipo, operaciones, días de semana, franja horaria, feriados y momento (al crear/al derivar); canal según preferencias T09. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-085 | Mesa de entradas/incidente: correo a la cuenta configurada del incidente, a cada interviniente y al titular, cada uno habilitable. | Todos | A validar · Replicar | M09 §6 |
| RN-CRM-086 | Distribución porcentual de una categoría de incidente por sección debe sumar 100 % (validación en M10). | Todos | A validar · Mejorar | M09 §6 |
| RN-CRM-087 | Fallo o respuesta insegura de IA no bloquea la recepción; la clasificación incierta deja el caso sin clasificar en supervisión. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-088 | Casos de servicios sociales y salud se marcan sensibles: acceso restringido, IA deshabilitada por defecto, resúmenes sin datos clínicos. | SEP, SAN, SAL | Adoptada · Nuevo | M09 §6 |
| RN-CRM-089 | Los adjuntos se relacionan con su entidad (caso, mensaje, ocurrencia, trámite) en el expediente T11. | Todos | Adoptada · Reemplazar | M09 §6 |
| RN-CRM-090 | Circular: el universo se filtra por titulares, cuentas, servicios, deudas (tipo y mínimo), mora y adhesión; se congela al generar. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-091 | Cargo por visita improcedente solo con regla aprobada y aviso previo al socio; el CRM no lo genera. | Todos | A validar · Mejorar | M09 §6 |
| RN-CRM-092 | La conformidad registrada en campo no cierra el caso sin regla del tipo; la disconformidad lo devuelve a tratamiento. | Todos | Adoptada · Mejorar | M09 §6 |
| RN-CRM-093 | Una sola encuesta post-cierre por caso; no repetir encuesta al mismo socio dentro del intervalo configurado. | Todos | Adoptada · Replicar | M09 §6 |
| RN-CRM-094 | Un caso resuelto sin respuesta del socio se cierra automáticamente tras el plazo; la respuesta negativa lo reabre. | Todos | A validar · Nuevo | M09 §6 |
| RN-CRM-095 | Recepción de mensajes entrantes: el tenant se determina por el canal registrado (número, casilla, página); mensajes de remitentes no identificados crean interacción "no identificada". | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-096 | Restauración desde backup: no se reenvían avisos ni comandos ya aceptados por proveedores; se concilian por identificador externo. | Todos | Adoptada · Nuevo | M09 §6 |
| RN-CRM-097 | Notas de OT con "visible en caja" y notas de cuenta con bloqueo de caja pertenecen a M10/M01; el CRM las muestra en la vista 360 sin duplicarlas. | Todos | Adoptada · Delegar | M09 §6 |

<a id="catalogo-m10-tec"></a>

### M10 TEC — Técnica, campo y redes (116 reglas)

Fuente: [`M10-TEC-tecnica-campo-redes.md`](../especificacion/anexos/M10-TEC-tecnica-campo-redes.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-TEC-001 | Factibilidad usable en un alta: confirmada, factible, no anulada, dentro de vigencia y sin servicio asociado. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-002 | Anular factibilidad cambia estado a `cancelled` y limpia uso posible; no altera dictamen histórico. | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-003 | Al editar factibilidad sin imagen de mapa no se borra el punto ni archivos; el punto se versiona. | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-004 | Dictamen exige motivo, responsable técnico y estado técnico; el estado técnico solo se informa si hay confirmación. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-005 | Exigencia de factibilidad para alta/reconexión según servicio. PRM-TEC-024 es el único parámetro que la gobierna; M02 (PRM-CAT-013) la lee como dato derivado y no la redefine (HUE-SRV-07). | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-006 | Factibilidad cerrada solo editable con permiso y parámetro, con versión. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-007 | Teléfono y celular se validan por formato E.164 (no truncado). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-008 | Factibilidad no crea catastro de facturación (`GRU_FAC=0`); grupo de factura lo define el contrato. | Todos | Adoptada · Descartar | M10 §6 |
| RN-TEC-009 | Una OT pertenece a una clase única; mantenimiento no exige titular (sí activo/obra). | Todos | A validar · Mejorar | M10 §6 |
| RN-TEC-010 | Estados de OT unificados (§8); "cerrada" y "confirmada" no se mezclan; doble paso opcional. | Todos | A validar · Reemplazar | M10 §6 |
| RN-TEC-011 | Pasaje a "Enviada a campo" al imprimir solo si la configuración lo indica. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-012 | Validación general de creación: servicio existente, no dado de baja (salvo incidente y reconexión), no pendiente de conectar salvo parámetro. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-013 | Incidente/reclamo solo exige servicio existente (admite servicios dados de baja o pendientes). | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-014 | Traslado y desconexión: validación general + sin otra OT pendiente de la misma operación. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-015 | Reconexión: solo servicio desconectado; no titular fallecido salvo parámetro; no planes de vivienda; sin otra reconexión pendiente. | VIV | Adoptada · Replicar | M10 §6 |
| RN-TEC-016 | Cambio de medidor: requiere medidor o datos de guía, no retirado, sin otra OT pendiente. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-017 | Retiro de medidor: requiere medidor o guía, servicio desconectado; en telefonía, última línea abierta; para todos los servicios se controla además el flag retirado. | TEL | Adoptada · Mejorar | M10 §6 |
| RN-TEC-018 | Alta: no si el servicio está dado de baja ni con alta/reconexión pendiente; admite pendiente de conectar. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-019 | No dos OT abiertas de la misma operación para el mismo servicio. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-020 | OT pendiente = no cerrada ni anulada; por cuenta excluye también cerradas. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-021 | Instantánea del servicio al crear (domicilio, medidor, catastro concatenado, GPS, certificado, teléfono, línea, moroso, gestión de mora). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-022 | Observación del servicio se precarga como observación administrativa si parámetro. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-023 | La OT hereda la factibilidad del servicio si existe. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-024 | Efectos por operación al confirmar (§1.4 RN-07): alta → hito de conexión con fecha efectiva; traslado → domicilio (+ adherentes si corresponde); desconexión → desconexión servicio + adherentes +… | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-025 | Condición resultante del servicio: desconexión → desconectado; alta/reconexión → conectado; lo registra el dueño del contrato. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-026 | Estado de servicio automático por operación o por default del servicio (alta, baja, reconexión, cambio de medidor, transferencia). | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-027 | Nota visible en caja/atención si la operación lo indica. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-028 | Lectura obligatoria al cerrar si la operación registra estado y siempre en alta y reconexión de servicios medidos. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-029 | Retiro de medidor limpia número y matrícula si parámetro; marcado por defecto y pregunta configurables. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-030 | Traslado: alertar si no cambió zona-sector-recorrido y preguntar por domicilio postal/recorrido postal. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-031 | Catastro de la OT se descompone en circunscripción, lote, manzana, parcela, PH, LT; teléfono actualizado en el campo correcto (no `FAX`). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-032 | Numeración visible: tipos 0–3 y secuencia continua de reclamos por servicio; asignación atómica. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-033 | Número de comprobante de OT por talonario de la operación (OT/OM) o secuencia del tenant. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-034 | Órdenes encadenadas: regla aplicable por servicio + filtros; clona OT con otra operación/servicio/vía; orden de confirmación origen/destino; error si 0 o >1 regla al confirmar. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-035 | Numeración de órdenes automáticas con secuencia atómica (no `COD_SOL+1`). | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-036 | Anulación revierte efectos por compensación y materiales por movimientos inversos; nota "Orden de X anulada" en la cuenta. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-037 | Anular alta de servicio que factura cargo fijo en la baja deja el servicio "No vigente" previa confirmación. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-038 | Cierre masivo aplica mismos datos, concatena observaciones (sin truncar a 300; límite 4000) y registra "Confirmada por X mediante confirmación masiva". | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-039 | Cierre desde campo guarda GPS, fecha de cierre del dispositivo, receptor/conformidad y motivo de disconformidad. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-040 | Cargos "antes" se ofrecen al generar (OT pendiente); "luego" al cerrar; filtrados por cambio de estado que desconecta. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-041 | En cierres masivos/campo, los cargos "luego" se generan como comprobante a "próxima facturación" con fecha según regla. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-042 | Proporcional por cambio de categoría: mismo mes, días restantes (adelantado) o transcurridos con signo inverso (vencido); sin negativos opcional; tope de día; comprobante inmediato o próxima factura. | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-043 | Proporcional por reconexión: crédito por días desconectados del mes o débito por días restantes si no facturado; opción cerrar sin comprobante. | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-044 | Materiales: entidad propia; descuento desde depósito indicado, custodia del responsable o depósito por defecto; precio de referencia `precioVentaSinImpuestos` del producto. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-045 | Necesidades: cuatro cantidades con usuario y fecha; listados de autorizados pendientes de retiro y retirados pendientes de uso solo para OT abiertas. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-046 | Los materiales no se facturan automáticamente salvo línea facturable por regla/presupuesto. | Todos | A validar · Replicar | M10 §6 |
| RN-TEC-047 | Impresión de OT: hasta N renglones de materiales (sin límite fijo de 16 en PDF), con vales opcionales. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-048 | Un único modelo de impresión por servicio + operación. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-049 | Sincronización de participantes, cuadrilla y tareas por diferencia sin borrado de historial (se registra baja lógica). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-050 | Notificación a responsables según reglas de servicio + tipo de orden + operaciones + días + franja + feriados + momento; canal y plantilla. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-051 | Notificación al socio por operación: nunca / al generar / al confirmar / siempre; teléfono destino móvil → teléfono → teléfono web. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-052 | Bloqueo por campo/sistema externo: OT enviada a campo o a sistema externo no se confirma masivamente en administración. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-053 | Envío automático a campo al guardar según parámetro (reemplaza envío a base MySQL). | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-054 | Estado de la OT respecto de campo: sin acción, pendiente de envío, enviada, recibida, en dispositivo. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-055 | Reserva temporal expira y libera capacidad; confirmación atómica por cupo. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-056 | Capacidad de franja = capacidad del recurso − reservas confirmadas − reservas temporales vigentes; sobrecupo solo con capability. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-057 | Reprogramación/cancelación por el socio solo con anticipación mínima configurable; luego vía atención. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-058 | Visita fallida no activa contrato ni consume equipo; genera nueva visita o cierre según motivo. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-059 | "En camino" no publica coordenadas; solo estado y hora. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-060 | Stock del equipo: reserva (disponible −1), entrega a custodia (sale de depósito), aplicación (sale de custodia, queda en domicilio/contrato), fallida (sin cambio o devolución), retiro (vuelve). No se… | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-061 | Sustitución de equipo efectivo vs reservado: libera el reservado y aplica el efectivo; nunca dos equipos aplicados por una instalación. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-062 | Conformidad: documento con versión y hash; modificación sustantiva posterior genera nueva versión; no sustitución silenciosa. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-063 | Encuesta posterior e independiente; no bloquea activación; respuestas repetidas/corregidas versionadas. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-064 | Hito de activación = instalación probada y confirmada + (si aplica) aprovisionamiento confirmado + (si aplica) revisión supervisora; nunca la fecha de reserva. | Todos | A validar · Nuevo | M10 §6 |
| RN-TEC-065 | Fecha efectiva de activación = fecha/hora real de prueba exitosa en zona horaria del tenant, salvo corrección autorizada. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-066 | Idempotencia: cada mutación de campo y cada comando externo tiene identidad única por tenant; repetir devuelve el resultado original. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-067 | Conflicto: si la versión base de la mutación ≠ versión actual y el cambio afecta estado, asignación, equipo, titular o servicio, se crea conflicto; se aplica la evidencia (fotos, firma, materiales… | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-068 | Responsable de resolución del conflicto: supervisor de la zona/cuadrilla; vencido el plazo, escala al administrador técnico. | Todos | A validar · Nuevo | M10 §6 |
| RN-TEC-069 | Desvío de reloj del dispositivo > umbral marca la mutación para revisión sin rechazarla. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-070 | Corte/reconexión solo con orden de M08 o M09 válida; el comando registra su origen. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-071 | Corte remoto en confirmación de desconexión (MikroTik y otros) se ejecuta como comando asíncrono; falla del sistema externo no aborta silenciosamente: deja la OT en `closing` con paso pendiente o… | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-072 | Reconexión automática sin sistema remoto vigente: la OT queda pendiente para cuadrilla (no se marca reconectada). | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-073 | MikroTik: al cortar se asigna el perfil de desconectado o se elimina el usuario según parámetro; al reconectar se restaura perfil del plan. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-074 | SITSA: alta → alta/modificación de contrato; desconexión → suspendido; reconexión → habilitado; cambio de categoría → modificación; identificador por contrato GoodApps (no cuenta); nombre/apellido… | Todos | A validar · Mejorar | M10 §6 |
| RN-TEC-075 | Discar/telemedición: operaciones que requieren fecha la exigen; cancelación del usuario es "no ejecutado", nunca éxito. | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-076 | Perfil de aprovisionamiento resuelto por plan vigente a la fecha efectiva del cambio. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-077 | Secretos técnicos (claves PPPoE, credenciales de equipos, casillas) nunca se exponen en catálogo público, BI o API; ver secreto requiere capability y deja auditoría. | INT | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-078 | Contratos independientes por conexión en un mismo domicilio: comandos y OT se dirigen al contrato, no a la cuenta. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-079 | Disponibilidad de un punto de red: componente admite conexión; si múltiple, conexiones vigentes < capacidad (rango); si único, sin conexión vigente ni OT abierta que lo use; estado… | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-080 | Componentes y relaciones sin capa son comunes a todas las capas; los elementos se filtran estrictamente por capa. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-081 | Guardado de estructura de red por diferencia sin borrado físico de relaciones/capas usadas. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-082 | Elementos nuevos reciben ID definitivo y los hijos se reapuntan en la misma transacción. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-083 | Conexión de servicio: nace `connected`; al informar fecha de desconexión pasa a `disconnected`; validaciones RN-TEC-079. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-084 | Atributos tipo "referencia" solo contra catálogos en lista blanca; se guarda ID y texto visible. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-085 | Análisis de impacto recorre descendientes del elemento por la jerarquía y relaciones `distribuyeEnHijos`, incluye conexiones vigentes. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-086 | Exportaciones GIS: mapeos por plantilla (conceptos/categorías por banda, formato de cuenta, ruta, fase real del dato — nunca aleatoria), servicio parametrizable (no fijo 1). | Todos | A validar · Reemplazar | M10 §6 |
| RN-TEC-087 | KML con coordenadas de punto decimal invariante. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-088 | Distribución por sección de categoría de incidente y grupo de obra suma exactamente 100 %. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-089 | Informe de recursos por obra valoriza horas con valores vigentes sin sobrescribir parámetros desde el informe. | Todos | A validar · Reemplazar | M10 §6 |
| RN-TEC-090 | Estadísticas: cantidad y demora promedio (días) de pendientes, resueltas, con/sin reclamo, resueltas dentro y después del período, no resueltas; demora desde fecha de orden y desde fecha de ingreso… | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-091 | Reincidencias: grupos con más de una orden por cuenta / cuenta+servicio / cuenta+servicio+operación en el rango. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-092 | Parte diario: una fila por nota en el rango con responsable, participante, título y texto; sin rango no devuelve nada (exigir rango). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-093 | Obras: cobro solo con base aprobada y criterio de prorrateo explícito. | AG, CLO, GAS, OBR | Adoptada · Nuevo | M10 §6 |
| RN-TEC-094 | Inspección: sospecha ≠ infracción; recupero y multa solo con procedimiento, evidencia, descargo y aprobación; nunca automático. | Todos | A validar · Nuevo | M10 §6 |
| RN-TEC-095 | Precinto numerado único por tenant; estados disponible/asignado/colocado/retirado/roto/anulado. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-096 | Pool telefónico: alta de rango crea números disponibles saltando existentes; baja solo de no asignados (lógica). | TEL | Adoptada · Mejorar | M10 §6 |
| RN-TEC-097 | Número en uso: ninguna línea de otro servicio con intervalo de vigencia superpuesto. | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-098 | Desvincular número: cierra la línea con fecha efectiva, limpia número del servicio y crea línea sin número con el mismo plan ("Desvinculación sin OT"). | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-099 | Plan de numeración: búsqueda por prefijo más largo; número de móvil con "15". | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-100 | Importación CDR: lector por modalidad; error de fila aborta archivo con número de fila; lote de cabecera o último + 1; duplicados por clave compuesta. | TEL | A validar · Replicar | M10 §6 |
| RN-TEC-101 | Atribución de origen por número normalizado `0+prefijo+número` vigente a la fecha; 0 → no encontrado; >1 → duplicado. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-102 | Entrantes: destinatario buscado con y sin prefijo; 0 o >1 coincidencias = observación. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-103 | Lote de llamadas reversible solo si ninguna llamada está agrupada/facturada. | TEL | Adoptada · Replicar | M10 §6 |
| RN-TEC-104 | Retasación reutiliza identidad de la llamada (no borra y reinserta con nuevo ID). | Todos | Adoptada · Mejorar | M10 §6 |
| RN-TEC-105 | Recarga prepaga telefónica genera operación `prepaidTopUp` con importe. | TEL | Adoptada · Replicar | M10 §6 |
| RN-TEC-106 | Punto de prestación: confirmado / aproximado / pendiente; no se completa con calle homónima ni coordenadas inventadas. | Todos | Adoptada · Nuevo | M10 §6 |
| RN-TEC-107 | Clave de mapas del tenant obligatoria; sin clave no hay mapa estático (nunca clave fija). | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-108 | Integra/app: no hay API key fija en código; tokens por dispositivo/usuario (T02/T06). | Todos | Adoptada · Reemplazar | M10 §6 |
| RN-TEC-109 | Tickets del proveedor (horas facturables, bolsas de soporte) no son atención al socio. | Todos | Adoptada · Descartar | M10 §6 |
| RN-TEC-110 | Actividades internas recurrentes se especifican en M09 (incluye corrección de filtros "en término/fuera de término" invertidos); los planes preventivos de TEC reutilizan el motor de frecuencias. | Todos | Adoptada · Delegar | M10 §6 |
| RN-TEC-111 | Cambio de categoría al cambiar medidor solo si parámetro. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-112 | Exigir modelo de medidor/dispositivo en servicios que lo requieren en alta. | Todos | Adoptada · Replicar | M10 §6 |
| RN-TEC-113 | Telefonía: operación `move`/`disconnect` cierra/abre `phoneLines` coherentes con la fecha efectiva de la OT. | TEL | Adoptada · Nuevo | M10 §6 |
| RN-TEC-114 | Certificado de instalador: un solo control, PRM-TEC-043, resuelto por servicio y jurisdicción del suministro (y por operación si se configura). Default `require` en ELE con jurisdicción Córdoba (Ley… | ELE, GAS | A validar · Mejorar | M10 §6 |
| RN-TEC-115 | Cobro de la contribución por mejoras: por defecto cada beneficiario paga por un **plan de cuotas tipo 17** (contrato de M02 + `worksInstallmentPlans` de M04, facturado por M05). El convenio de M08… | OBR | Adoptada · Nuevo | M10 §6 |
| RN-TEC-116 | Emergencia de seguridad: la OT de emergencia se asigna a la guardia vigente sin despacho ni supervisión previa; el corte preventivo del suministro o de la zona se ejecuta sin aprobación y genera… | GAS | A validar · Nuevo | M10 §6 |

<a id="catalogo-m11-ven"></a>

### M11 VEN — Ventas y presupuestos (52 reglas)

Fuente: [`M11-VEN-ventas-presupuestos.md`](../especificacion/anexos/M11-VEN-ventas-presupuestos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-VEN-001 | Un hito genera un único cargo; clave de idempotencia `tenantId + sourceType + sourceId + conceptId`. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-002 | El cargo se valoriza con la versión de concepto/tarifa vigente a la fecha efectiva del hito y se congela. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-003 | Cargo financiado ⇒ la alternativa contado queda anulada; nunca coexisten. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-004 | Inclusión en factura del servicio solo si `concept.linkedToServiceCode = contrato.serviceCode` y `concept.fiscalValidatedAt` no nulo; en otro caso, documento propio. | Todos | Adoptada · Reemplazar | M11 §6 |
| RN-VEN-005 | La venta financiada y la refinanciación de deuda son operaciones distintas; un cronograma de M11 nunca contiene deuda previa. | Todos | Adoptada · Reemplazar | M11 §6 |
| RN-VEN-006 | El costo de adquisición de un equipo no genera cargo al socio; solo un concepto habilitado (venta, cargo de comodato, garantía) lo hace. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-007 | No puede existir otro presupuesto vigente, no anulado y sin facturar de la misma cuenta con alguno de los mismos productos. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-008 | Transiciones del presupuesto: Enviar desde borrador (si ya enviado/aceptado solo reenvía); Aceptar desde borrador o enviado; Volver a borrador desde aceptado sin OT ni facturas; Rechazar desde… | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-009 | Vencido = enviado con `validUntil` < hoy (zona del tenant); estado derivado materializado por job. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-010 | Modificar un presupuesto enviado crea una nueva versión en borrador; la aceptación se refiere a una versión inmutable. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-011 | El cambio de cuenta/persona del presupuesto solo antes de aceptar y si está habilitado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-012 | Aceptar sin obra/OT asignada pide confirmación si está habilitado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-013 | Validaciones de cuenta al presupuestar: servicios en condición conectado; servicio no en estado de desconexión; propiedad con valor "SI" cuando se exige. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-014 | Validación de deuda y vencimiento: se considera la deuda vencida al vencimiento configurado (1.º a 4.º). | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-015 | Precio de conjunto con estructura = costo de componentes + costo fijo; venta = costo × (1 + margen). Costo fijo = cantidad del componente de mano de obra (o peso si no hay) × coeficiente de mano de… | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-016 | Prorrateo: flete + molde + ítems "prorratear" se reparten entre los demás ítems por peso; el residuo de redondeo va al último ítem. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-017 | Presupuesto a campo: todos sus productos deben estar habilitados para campo; usa el punto de venta fijo de campo si está configurado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-018 | Presupuesto aceptado crea el caso CRM con tipo, subtipo, prioridad y estado configurables y asunto = referencia o número. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-019 | Un presupuesto con anticipo no se anula sin devolver o reasignar el anticipo. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-020 | Stock: la venta confirmada reserva; el egreso ocurre en la entrega (o al confirmar si así se configura). | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-021 | Una serie vendida debe estar en stock disponible y no asignada a un suministro. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-022 | Riesgo crediticio: si la deuda vencida o el riesgo supera el límite, se advierte o bloquea según configuración; override con permiso. | Todos | A validar · Replicar | M11 §6 |
| RN-VEN-023 | Descuento contado o 1 cuota con su concepto; el IVA del ítem con descuento se calcula sobre el neto **con** descuento. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-024 | Interés de financiación con su concepto; IVA del interés según el concepto. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-025 | Percepción IIBB por cuota solo si la base supera el mínimo del régimen (cálculo en M06). | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-026 | Modelo fiscal de la venta en cuotas configurable por concepto: factura total al vender (con crédito por "factura en cuotas" y crédito fiscal según P2930) o factura por cuota. | Todos | A validar · Pendiente de decisión | M11 §6 |
| RN-VEN-027 | Una cuota facturada queda `billed` con referencia a la factura y no se vuelve a seleccionar; la anulación de la factura la devuelve a `scheduled`. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-028 | Agrupación de cuotas en la factura (solo cuando la inclusión es válida): por servicio → grupo del servicio; por tipo de cuota con grupo → ese grupo; resto → grupo por defecto. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-029 | Las cuotas no requieren ítems de servicio para facturarse: van en documento propio. | Todos | Adoptada · Reemplazar | M11 §6 |
| RN-VEN-030 | Selección de cuotas: `dueDate ≤ hasta` y `dueDate ≥ desde − N meses` (N = 10 por defecto); intereses diferidos si se pide. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-031 | La modificación masiva solo alcanza cuotas sin factura y no anuladas (salvo cambio de tipo, que alcanza facturas de financiación emitidas); deja nota y movimiento de ajuste de capital en una… | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-032 | Cancelación anticipada: interés no devengado = Σ interés de cuotas canceladas no vencidas, salvo plan "sin quita". | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-033 | Devolución: cuotas `scheduled` → `voided`; `billed` impagas → NC; pagadas → saldo a favor o devolución por M07; el stock reingresa solo con la recepción física en M13. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-034 | No se anula ni modifica una venta con fecha ≤ cierre de ventas; con CAE solo por NC. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-035 | Sin vendedor y con la validación de vendedor activa, la venta rápida no se confirma. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-036 | En venta rápida el tipo de cuota no se modifica si está bloqueado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-037 | La diferencia de cotización se registra con su producto. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-038 | En operaciones de caja se emite siempre recibo oficial si está configurado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-039 | Con P727, la venta espera el CAE antes de considerarse emitida y entregable, hasta el tiempo máximo de M05; vencido, rige la contingencia CAEA o el comprobante pendiente no entregable como fiscal… | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-040 | Recargo/descuento por producto: aplica si cumple propiedad y valor de la cuenta, tipo de titular, forma de pago, ausencia de deuda excluida o vencida > N días y cantidad mensual no superada; puede… | Todos | A validar · Replicar | M11 §6 |
| RN-VEN-041 | Actualización por dólar: solo productos con fecha de precio; si hay margen, recalcular venta = costo × (1 + margen); guardar costo anterior; no cambiar la fecha de precio en actualización por dólar. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-042 | Rendición: tipos de transporte con valores distintos; precio por km = flete real / km reales. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-043 | Ventas con concepto "factura en cuotas" se informan como exento o excluidas en el detalle de ventas. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-044 | Ítems financiados separados en el libro IVA ventas si está configurado. | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-045 | Los documentos económicos de M11 nunca se borran: se anulan o revierten con vínculo al original. | Todos | Adoptada · Reemplazar | M11 §6 |
| RN-VEN-046 | Importes en `Decimal128`, precios unitarios hasta 6 decimales, importes a 2, regla de redondeo por concepto. | Todos | Adoptada · Reemplazar | M11 §6 |
| RN-VEN-047 | Aceptación online válida solo si: versión vigente y no vencida, identidad verificada (usuario autenticado con relación sobre la cuenta, o OTP enviado al contacto registrado del destinatario) y… | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-048 | Importaciones con destino venta usan numeración secuencial sin huecos. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-049 | Reconexión: débito si el servicio reconectado no fue facturado en el período (P2661); crédito por días desconectados (P2483) con concepto P2485; cierre de OT sin comprobante permitido (P2907). | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-050 | Presupuesto de factibilidad: método de facturación "factura manual" o "venta de materiales". | Todos | Adoptada · Replicar | M11 §6 |
| RN-VEN-051 | Las acciones masivas (anulación por rango, cambio de estado, modificación de cuotas, actualización de precios) validan permiso y registran usuario y fecha. | Todos | Adoptada · Mejorar | M11 §6 |
| RN-VEN-052 | Mostrar el CFT y la TEA en toda oferta financiada al consumidor final. | Todos | A validar · Mejorar | M11 §6 |

<a id="catalogo-m12-cmp"></a>

### M12 CMP — Compras y proveedores (75 reglas)

Fuente: [`M12-CMP-compras-proveedores.md`](../especificacion/anexos/M12-CMP-compras-proveedores.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-CMP-001 | CUIT único por tenant; condición de IVA obligatoria; un proveedor bloqueado no recibe OC ni OP. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-002 | Rubro de proveedor obligatorio salvo configuración; cuenta contable obligatoria si se exige. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-003 | Validación contra padrón ARCA al alta/modificación si está activa. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-004 | Alta o cambio de CBU requiere aprobación de un usuario distinto del que lo cargó; la OP solo usa CBU aprobados. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-005 | "Paga a otros": sus OP pueden aplicar comprobantes de otros proveedores y se listan juntas. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-006 | Proveedores-empleado ocultos sin capability. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-007 | La SA nace en borrador; al enviarse pasa a aprobación salvo política "sin aprobación" para el monto/área. Nunca se autoaprueba al procesar. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-008 | Doble aprobación: dos usuarios distintos; el segundo no puede ser el primero ni el solicitante. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-009 | Vigencia de SA: pendientes = fecha ≥ hoy − vigencia. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-010 | Una SA con ítems procesados no se elimina; se anula o descarta. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-011 | Permisos de SA unificados (`autoriz_sa` y `autoriza_sa` son el mismo concepto). | Todos | A validar · Mejorar | M12 §6 |
| RN-CMP-012 | Búsqueda de pedido abierto: SA con el ítem sin recibir; si no, OC con saldo > 0 (productos y conceptos). | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-013 | Estados de SA derivados: Pendiente, En proceso (compras la tomó), Procesada (algún ítem recibido), Anulada/Rechazada. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-014 | Importar pendientes: solicitado y recibido se firman según débito/crédito; costo neto = precio si el IVA estaba discriminado, si no `precio / (1 + %IVA/100)` a 6 decimales. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-015 | Alícuota al importar: la del documento origen si P2690/P2791; si no, la del producto. | Todos | A validar · Replicar | M12 §6 |
| RN-CMP-016 | Documentos importables: OC aprobadas no canceladas ni cerradas; cotizaciones no rechazadas. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-017 | Toda importación registra el vínculo ítem origen → ítem destino con cantidad y descuenta el pendiente del origen; deshacer devuelve la cantidad exacta (con decimales). | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-018 | Cotizaciones: una por proveedor, agrupadas; vencimiento por defecto 15 días. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-019 | Estado de cotización: cotizada si todos los ítems tienen costo ≠ 0; evaluada si ningún ítem sin evaluar; procesada si algún ítem con pendiente 0. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-020 | Comparativo solo entre cotizaciones hermanas de la misma SA con precio cargado y sin evaluar (o contratadas si se reevalúa). | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-021 | Evaluación: ítem contratado o descartado; si se cambia la cantidad, se ajusta cantidad y pendiente. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-022 | IVA de la cotización calculado con la situación de IVA de la cooperativa. | Todos | A validar · Replicar | M12 §6 |
| RN-CMP-023 | Concursos y licitaciones: numeración correlativa por modalidad; ofertas selladas hasta la apertura. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-024 | Aprobación de OC por bandas de monto; sin aprobación no se envía, no se recibe ni se importa. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-025 | OC visible para el proveedor en el portal: aprobada, no cancelada ni cerrada. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-026 | Compra compartida: una sola OC con distribución explícita por servicio/centro que suma 100 %; los informes por servicio usan la distribución y el total no se duplica. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-027 | La recepción no mueve stock en M12; el ingreso físico lo confirma M13. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-028 | Remito con número del proveedor si el comprobante informa impuestos; si no, numeración propia. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-029 | No se elimina un ítem de remito ya facturado; un remito facturado totalmente queda cerrado. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-030 | Factura anticipada: la recepción posterior consume el pendiente de la factura (5 → 4) y cierra su saldo. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-031 | Ítem "pendiente" (recibido sin ingreso a stock): pasar de pendiente a recibido genera ingreso; de recibido a pendiente exige ajuste de M13 (no manual sin rastro). | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-032 | Ítems de remito sin precio toman el costo de la factura vinculada como ajuste de costo en M13, sin reescribir el movimiento histórico. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-033 | Validaciones de comprobante: obligatorios, año 1997–2050 reemplazado por rango razonable configurable, períodos abiertos, sin precio 0, tipo permitido por condición IVA (bloqueo o advertencia), no… | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-034 | Diferencia total vs componentes ≤ P2057 (default 0,50). | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-035 | Total = gravado + no gravado + retenciones + percepciones + impuestos + otros créditos + IVA; alícuotas reagrupadas por porcentaje. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-036 | Control del neto con descuento global: recalcular aplicando el % de descuento a gravado, no gravado e IVA excluyendo el ítem de descuento. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-037 | Importar más cantidad que la pendiente de la OC pide confirmación y genera excepción de cantidad. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-038 | Actualización de costo: si no P264, el costo del producto se actualiza con el mayor precio unitario del comprobante (preguntando si P426); costo anterior guardado. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-039 | Descuento global como ítem negativo del concepto P2403 (obligatorio configurarlo). | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-040 | Rubro vivienda P2502 exige productos del rubro P2503. | VIV | Adoptada · Replicar | M12 §6 |
| RN-CMP-041 | La anulación de un comprobante no lo borra; exige que no tenga OP aplicada y período abierto; libera bienes de uso, combustibles, envío web e IA vinculados. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-042 | Comprobantes del portal: único por CUIT + tipo + punto + número; pendiente = sin factura vinculada ni rechazo. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-043 | Estado del comprobante para el proveedor derivado de los estados de §8 (pendiente, registrado, rechazado, habilitado, en pago, pagado). | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-044 | Control de 3 vías por línea: cantidad facturada acumulada ≤ recibida/conformada acumulada × (1 + tolerancia de cantidad); \| precio factura − precio OC \| ≤ máx(tolerancia %, tolerancia monto). | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-045 | Con excepción abierta, la factura no se habilita para pago; con política "pagar lo conciliado", solo se habilita el importe conciliado. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-046 | Habilitación de pago: automática solo por conciliación; manual con capability y motivo. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-047 | Compras sin OC solo en categorías habilitadas; el resto genera excepción. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-048 | Facturas pendientes de pago: saldo ≠ 0, habilitadas, sin excepción abierta, no anuladas. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-049 | En la OP, cada aplicación ≤ saldo; saldo < 0,01 se considera cancelado. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-050 | No se pisa el vencimiento de la factura al pagar. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-051 | Anticipo sin factura: comprobante de anticipo (concepto P2035) que suma y contraparte que resta al aplicarse; requiere ambos tipos de comprobante configurados. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-052 | Adelanto de sueldo a empleado: no se registra en M12; se deriva a M16. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-053 | Retenciones: M12 no calcula; envía a M06 y muestra base, mínimo, escala, acumulado, retenido previo e importe; un reintento no genera otra retención. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-054 | Base imponible (para validar el resultado de M06): por comprobante, solo formales si P410; total o prorrata por pago parcial; por ítem si el tipo es por ítem; IVA presunto… | Todos | A validar · Replicar | M12 §6 |
| RN-CMP-055 | Importe: escala por tramo con excedente; mínimo no imponible (descontado una sola vez al año si "descuento anual"); acumulación mensual/anual; mínimo de retención; devolución si la base acumulada… | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-056 | Retención ajustada manualmente: solo con P2836 activo, capability, motivo y aprobación; se guardan calculado y ajustado. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-057 | Numeración de certificados por tipo y punto de venta con reinicio anual (M06); fecha de información en el mes siguiente si el día supera P2045. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-058 | La OP aprobada no se modifica; cambiarla exige cancelarla y crear otra. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-059 | Anulación de OP: requiere capability; si M14 ya ejecutó, se anula primero la ejecución en M14; repone saldos, anula anticipos (salvo contraparte aplicada en otra OP) y retenciones (estado anulado e… | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-060 | Firma y entrega de la OP son de M14, con permisos también en masivo y registro de usuario y fecha. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-061 | Segregación: solicita ≠ aprueba SA; crea ≠ aprueba OC; aprueba OC ≠ recibe; registra factura ≠ aprueba excepción ≠ aprueba OP. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-062 | Períodos: ninguna operación con fecha en período cerrado de Compras, Stock o Contable. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-063 | Fecha de comprobante de compra no posterior al mes actual si está configurado. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-064 | Previsiones expandidas por periodicidad 1 mensual, 2 bimestral, 3 trimestral, 4 semanal, 5 quincenal dentro del rango. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-065 | Costo de reposición = cantidad de reposición − stock actual, por bultos si el producto se compra en bultos. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-066 | Mis Comprobantes e IA solo crean **borradores**; el registro exige confirmación humana y las mismas validaciones que la carga manual. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-067 | La IA distingue a la cooperativa del emisor usando CUIT y razón social del tenant. | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-068 | Cantidades con la precisión de la unidad de medida; importes Decimal128, precios unitarios hasta 6 decimales. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-069 | Identidad interna por ObjectId; numeración legible por tipo y punto; claves ProCoop compuestas solo en `legacy` (antes `legacyRef`). | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-070 | Credenciales de Interbanking, IA y portales en bóveda, nunca en tablas. | Todos | Adoptada · Reemplazar | M12 §6 |
| RN-CMP-071 | Toda acción masiva valida capability por documento y registra usuario y fecha. | Todos | Adoptada · Mejorar | M12 §6 |
| RN-CMP-072 | Las retenciones practicadas no reducen indebidamente lo cancelado al proveedor: la factura se cancela por el bruto (neto pagado + retenciones). | Todos | Adoptada · Replicar | M12 §6 |
| RN-CMP-073 | Una factura mayorista de energía o gas no se habilita para pago mientras tenga renglones sin control contra la medición propia de M03 o excepciones `meteringMismatch`/`meteringMissing` sin decidir… | ELE, GAS | A validar · Nuevo | M12 §6 |
| RN-CMP-074 | La compra mayorista y los derechos de señales son costo del servicio (RN-CON-069): no se trasladan como recargo ni cargo al usuario y su efecto tarifario, si lo hay, lo decide M04 por su propio… | TV, ELE, GAS | Adoptada · Replicar | M12 §6 |
| RN-CMP-075 | La liquidación de derechos de señales usa únicamente el informe de abonados activos por paquete de M02 a la fecha de corte; M12 no cuenta contratos por su cuenta. Una liquidación aprobada no se… | TV | A validar · Nuevo | M12 §6 |

<a id="catalogo-m13-stk"></a>

### M13 STK — Stock, activos y fabricación (78 reglas)

Fuente: [`M13-STK-stock-activos-fabricacion.md`](../especificacion/anexos/M13-STK-stock-activos-fabricacion.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-STK-001 | Solo los artículos con "lleva stock" generan movimientos de cantidad. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-002 | Un kit se explota en sus componentes al moverse; el kit no tiene saldo propio. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-003 | Una cantidad negativa en un renglón se convierte en el movimiento de sentido inverso y se guarda en positivo. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-004 | Si el artículo usa ubicaciones, un movimiento se desdobla por ubicación. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-005 | Las existencias se derivan del libro de movimientos; los saldos materializados son una proyección verificable. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-006 | Los movimientos no se editan ni se eliminan; se anulan con contramovimiento. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-007 | No se anula un movimiento de un serializado con movimientos posteriores ni la entrada de un bien de uso ya dado de baja; anular una salida restaura el estado anterior de la unidad. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-008 | Los serializados nunca quedan con saldo negativo ni en dos ubicaciones a la vez. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-009 | La política de stock negativo para no serializados se define por tipo de operación (transferencias, vales, consumos, ventas, fabricación) con valores `block` / `warn` / `allow`. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-010 | Si una operación deja el saldo por debajo del mínimo, se advierte (no bloquea). | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-011 | Ninguna operación con fecha efectiva menor o igual a la fecha de cierre de stock se acepta. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-012 | Entregar a una cuadrilla/técnico es transferencia de custodia: sale del depósito de origen y entra al depósito de cuadrilla; no es consumo ni salida de la existencia propia. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-013 | Una entrega queda "pendiente de aceptación" hasta que el receptor la acepta; durante ese lapso la existencia está "en tránsito" y no disponible para el técnico. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-014 | El consumo o la aplicación registrados desde la OT descuentan **solo** la custodia del técnico/cuadrilla; si el material no está en su custodia, se toma del depósito indicado y se registra el origen… | INT | Adoptada · Mejorar | M13 §6 |
| RN-STK-015 | Cada operación de campo lleva `clientMutationId`; el servidor guarda la clave por tenant y devuelve el resultado original ante un reintento. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-016 | Una visita fallida no genera aplicación ni consumo de equipos; los materiales efectivamente usados en una visita fallida (por ejemplo cable tendido) sí pueden consumirse con justificación. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-017 | Si la serie aplicada no coincide con la reservada, se libera la reservada; si la aplicada no está en la custodia del técnico, la aplicación queda "pendiente de validación" y la unidad no se libera de… | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-018 | Una unidad solo puede estar aplicada a un contrato a la vez; una aplicación nueva exige la unidad en estado disponible-en-custodia o reservada para esa OT. | INT, TV | Adoptada · Replicar | M13 §6 |
| RN-STK-019 | La compatibilidad modelo–tecnología–servicio (por ejemplo ONU GPON solo en red GPON) se valida al reservar y aplicar si está configurada. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-020 | El número de serie es único dentro del lote cargado, por artículo; los identificadores secundarios son únicos por tenant y tipo. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-021 | Al ingresar una serie que existe fuera de stock (retirada, devuelta), se pide confirmación y se continúa la misma unidad; si ya está en stock o aplicada, es error. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-022 | Toda entrada de un trazable (salvo transferencia interna) actualiza su costo de unidad. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-023 | La reserva reduce el disponible pero no el físico; disponible = físico en estado disponible − reservas activas. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-024 | Una reserva vence a los N días sin ejecución de la OT, salvo que la OT siga agendada; al vencer se notifica al supervisor. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-025 | La confirmación de una reserva usa control optimista (`version`) sobre el saldo/unidad; ante conflicto, se rechaza la segunda. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-026 | El destino de un consumo es obligatorio y uno solo por renglón: OT, OM, obra, contrato, servicio, unidad de gasto, plan de vivienda, RMA u orden de fabricación. | VIV | Adoptada · Mejorar | M13 §6 |
| RN-STK-027 | El servicio del movimiento se deriva del destino (contrato/OT) o del servicio por defecto del artículo; si una operación abastece varios servicios, se registra una distribución explícita que suma 100… | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-028 | El costo de una salida es el costo vigente al momento según el método; no cambia por ingresos posteriores con fecha efectiva anterior salvo recálculo controlado dentro de un período abierto. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-029 | Un ingreso sin precio toma el precio de la recepción/OC; si no hay, el costo de reposición del artículo; se marca "costo provisorio" hasta la factura. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-030 | Una diferencia entre el costo de recepción y el de factura se registra como movimiento de valor: la parte proporcional a la existencia remanente ajusta el costo; la parte consumida va a costo de… | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-031 | Los productos con saldo negativo no se valorizan y se informan aparte. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-032 | La transferencia entre depósitos no cambia el costo unitario (PPP por tenant) ni genera evento económico, salvo cambio de custodia contable (por ejemplo a domicilio del socio en comodato). | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-033 | Revaluación por índice: factor = índice del mes "hasta" / índice del mes del movimiento (o del mes "desde" si el movimiento es anterior); si falta un índice del período, se aborta; artículos sin… | Todos | A validar · Replicar | M13 §6 |
| RN-STK-034 | La revaluación automática al costo se dispara al actualizar costos de reposición si está configurada, con obra y responsable por defecto. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-035 | La aplicación de un equipo en **comodato** no es consumo: la unidad sigue siendo existencia propia en custodia del socio y se valoriza; la venta sí es salida con costo de mercadería vendida. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-036 | La asignación conserva la modalidad vigente al momento de la entrega; un cambio de modalidad (por ejemplo comodato → venta) es un evento explícito con su documento. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-037 | La baja comercial no cierra la asignación: solo el retiro o la devolución registrada la cierra; mientras tanto la asignación está "pendiente de devolución". | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-038 | Vencido el plazo de devolución, se genera una propuesta de cargo por equipo no devuelto que requiere aprobación; nunca un cargo automático. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-039 | Un equipo retirado queda "pendiente de revisión"; no vuelve a disponible sin decisión de revisión. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-040 | Un ajuste exige motivo, evidencia cuando el motivo lo requiere y aprobación si supera el umbral de cantidad o importe; sin aprobación no afecta saldos. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-041 | Una rendición de cuadrilla solo se cierra con diferencia cero o con ajustes aprobados por cada diferencia. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-042 | En un inventario físico, la diferencia = contado − (instantánea + movimientos posteriores a la instantánea en el alcance contado). | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-043 | La sugerencia de compra = (máximo o punto de pedido + reposición) − (disponible + en tránsito + OC pendientes − reservas), redondeada hacia arriba a bultos; cantidad a reponer = `CAN_REP` − stock… | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-044 | La sugerencia de compra se convierte en requisición de M12 (no en OC); la autorización sigue el circuito de compras. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-045 | El ingreso de stock por compras solo ocurre con recepción física confirmada (M12); la factura sin recepción no mueve stock de bienes. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-046 | Un ítem recibido "pendiente" (sin ingreso a stock) que pasa a recibido genera el ingreso; uno recibido que pasa a pendiente exige un movimiento inverso explícito (no ajuste manual). | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-047 | El alta de un bien de uso desde stock se propone (borrador) para artículos marcados bien de uso; nunca se activa por inferencia. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-048 | Amortización lineal: anual = % amortizable / vida útil; mensual = anual / 12; prorrateo por días en el primer y último mes; se amortiza desde la afectación hasta fin del período, baja o fin de vida… | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-049 | Solo se amortizan bienes afectados, no dados de baja y no totalmente amortizados; la amortización acumulada nunca supera origen + mejoras − disminuciones − valor residual. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-050 | Con valores históricos habilitados, la amortización usa origen y amortización históricos; el ajuste por inflación usa índices por período y puede separar la cuenta de revalúo. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-051 | Al contabilizar una corrida se actualizan acumulados; al revertirla se restauran. La reversión masiva también revierte acumulados. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-052 | No se elimina un bien con amortizaciones; se anula con reversión automática. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-053 | La distribución por centros de costo del bien suma 100 %; sin distribución, se usa el centro por defecto del rubro/sucursal. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-054 | Un RMA de artículo serializado requiere la serie; abrir un RMA cambia el estado de la unidad a "en RMA" y bloquea su reserva. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-055 | Cada cambio de estado del RMA se registra en el historial y, si el estado está marcado "notifica", se envía la plantilla al contacto/proveedor por el centro de comunicaciones (T09). | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-056 | Un reemplazo del proveedor crea una nueva unidad (nueva serie) enlazada a la original; la original queda "baja en proveedor" con su historia. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-057 | Los equipos de clientes en recepción técnica y los de propiedad del socio no forman parte de la existencia propia ni de la valorización. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-058 | Etapas de la orden de fabricación: 0 generada, 1 lanzada, 2 finalizada, 3 anulada, 4 cancelada. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-059 | Anular una orden solo si está generada, o lanzada sin partes, o con todo lo producido reasignado; libera comprometidos y desvincula el comprobante de venta. Cancelar y anular informan error si no se… | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-060 | Un renglón de orden queda fabricado cuando lo producido iguala lo pedido y todos sus partes están finalizados; cuando todos los renglones están completos se registra el fin real. No cambia la etapa… | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-061 | Disponibilidad de componentes para un parte = stock − comprometido en partes abiertos, en decimal. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-062 | Al lanzar el parte se consumen componentes si está configurado; si no, al finalizar; nunca dos veces. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-063 | Al finalizar la orden se netean productos que también son componentes y se ingresan terminados al depósito de producción. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-064 | Una orden admite un parte para un producto si lo incluye y la cantidad pedida menos lo ya cargado en partes cubre la necesaria; además, la orden debe estar lanzada. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-065 | Costo de producto fabricado recursivo con costo (no precio de venta) por defecto; precio de venta sugerido = costo × (1 + margen). | Todos | A validar · Reemplazar | M13 §6 |
| RN-STK-066 | MRP: necesidad de cada componente a fecha de lanzamiento + días del componente; en proceso = órdenes con lanzamiento real; se excluyen componentes con stock − requerido ≥ mínimo. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-067 | El reparto del costo de componentes entre productos terminados de una orden es proporcional a las cantidades. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-068 | Un artículo con disponibilidad por módulo "no disponible" no puede usarse en ningún documento nuevo. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-069 | La matrícula del artículo es única si se habilita la validación. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-070 | Las propiedades extendidas marcadas únicas no se repiten entre unidades. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-071 | Los IDs y números de documento se asignan con secuencias atómicas por tenant, tipo y sucursal, no con máximo + 1. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-072 | Las capabilities se validan en servicio, incluidas operaciones masivas y web. | Todos | Adoptada · Reemplazar | M13 §6 |
| RN-STK-073 | La copia de un servicio no copia stock, series, asignaciones ni saldos; las referencias a depósitos se mapean. | Todos | Adoptada · Replicar | M13 §6 |
| RN-STK-074 | Un servicio marcado "sin stock comercial" no expone artículos de stock como prestación facturable. | Todos | Adoptada · Adoptar | M13 §6 |
| RN-STK-075 | Una unidad con ensayo/inspección obligatoria vencida no se reserva ni aplica si la política lo exige. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-076 | Un lote vencido no se ofrece en consumos ni entregas si el bloqueo está activo; se sugiere FEFO. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-077 | Al cambiar el responsable de un depósito de cuadrilla o técnico, o al desvincular al empleado (M16), se exige rendición cerrada y transferencia del saldo. | Todos | Adoptada · Mejorar | M13 §6 |
| RN-STK-078 | Los eventos económicos llevan `sourceDocumentId` + `eventSeq`; M15 deduplica. Un reintento de un proceso fallido repara el paso faltante sin repetir movimientos ya confirmados. | Todos | Adoptada · Reemplazar | M13 §6 |

<a id="catalogo-m14-tes"></a>

### M14 TES — Tesorería y bancos (86 reglas)

Fuente: [`M14-TES-tesoreria-bancos.md`](../especificacion/anexos/M14-TES-tesoreria-bancos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-TES-001 | Un cobro esperado no es disponibilidad: los importes en tránsito, a acreditar o en cartera no suman al disponible de la cuenta bancaria. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-002 | El saldo de cada cuenta se deriva de sus movimientos válidos (no anulados); no existe saldo editable. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-003 | Todo movimiento pertenece a una operación; una operación balancea ingresos y egresos (o es unilateral por definición de su tipo: depósito, extracción, gasto). | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-004 | El número de operación se toma del talonario "Operación de tesorería" de forma atómica. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-005 | En movimientos bancarios un importe positivo es ingreso (haber del banco) y uno negativo es egreso. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-006 | Si la fecha del ítem no es válida se usa la del movimiento; concepto y observación tienen longitud máxima validada (no truncada en silencio). | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-007 | La cotización es 1 en moneda local; en moneda extranjera se guarda la cotización usada. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-008 | Los importes históricos (debe/haber en moneda de origen) se guardan con el mismo signo en toda vía de registro. | Todos | A validar · Descartar | M14 §6 |
| RN-TES-009 | No se registra ni anula un movimiento con fecha en período cerrado de Bancos o Tesorería. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-010 | Las acciones sensibles exigen capability; las masivas también, y siempre registran usuario y fecha. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-011 | La anulación revierte con movimientos espejo vinculados y nunca borra. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-012 | Anular una operación no anula los cheques propios salvo elección explícita. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-013 | Las consultas de saldo excluyen movimientos anulados y sus reversas de forma consistente. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-014 | Cada movimiento lleva tipo (catálogo cerrado) y categoría (configurable) que determina la regla contable. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-015 | Los medios de pago son: efectivo, cheque propio, eCheq propio, cheque de terceros, eCheq de terceros, transferencia (banco, tarjeta, QR), retención, cupón de tarjeta, débito automático, VEP. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-016 | La fecha probable de acreditación solo aplica a depósitos de valores (y a cupones presentados en la proyección). | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-017 | Una transferencia interna con fechas valor distintas pasa por cuenta de tránsito. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-018 | Cambio de valores solo con los medios de entrada y salida habilitados. | Todos | A validar · Replicar | M14 §6 |
| RN-TES-019 | Al cerrar una caja de cobranza todo su contenido pasa a tesorería en una única operación: efectivo teórico, diferencia como quebranto, valores Recibido → En cartera, cupones (débito autopresentados)… | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-020 | El cierre de caja de cobranza no registra pagos de capital social. | CAP | Adoptada · Reemplazar | M14 §6 |
| RN-TES-021 | Con cierre multi-día solo se consolida efectivo; anular el cierre reabre las cajas de las otras fechas. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-022 | Un número de caja está ocupado si se usó ese día, si es el de un banco o si está asignado a un usuario; se asigna el primero libre; el número 0 no es válido. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-023 | La caja de pagos del día es única por fecha; si no existe o está cerrada y la apertura automática está activa, se reabre o se crea con tope y medios del parámetro; sin apertura automática el pago se… | Todos | A validar · Mejorar | M14 §6 |
| RN-TES-024 | Saldo de caja de pagos = tope − pagos en efectivo del día. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-025 | Efectivo disponible para pagos desde una caja de cobranza = efectivo cobrado − neto de movimientos de esa caja y fecha. | Todos | A validar · Pendiente de decisión | M14 §6 |
| RN-TES-026 | Un pago en efectivo con importe ≤ máximo (o sin máximo) queda como salida pendiente cuando el pago desde caja está activo. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-027 | Un cheque de terceros solo se entrega a un proveedor si está En cartera y habilitado para pagos. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-028 | No se admiten dos cheques con la misma entidad + sucursal + cuenta + número salvo que el anterior esté anulado. | Todos | A validar · Mejorar | M14 §6 |
| RN-TES-029 | Si el librador está bloqueado no se reciben sus cheques; si tiene rechazados sin recuperar se advierte. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-030 | Un cheque vencido (fecha de pago + N días < hoy) no se recibe o se advierte; N por defecto 30. | Todos | A validar · Replicar | M14 §6 |
| RN-TES-031 | Transiciones de valores de terceros según §8; cada cambio registra historial. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-032 | Rechazo de cheque depositado: movimiento en cuenta de rechazados (tipo 60) y reverso en el banco del depósito (tipo 59); rechazo de cheque entregado: tipo 72 con fecha de hoy; recupero: tipo 61. | Todos | A validar · Replicar | M14 §6 |
| RN-TES-033 | Rechazo de valor entregado a proveedor: comprobante al proveedor por el importe con concepto exento obligatorio y gasto opcional. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-034 | Habilitar un valor para pago registra fecha y usuario. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-035 | Un valor solo se modifica en sus datos identificatorios mientras está En cartera. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-036 | Un cheque propio se usa solo en estado Disponible; en eCheq se toma el primer registro libre y se valida que el número no se haya usado en la cuenta y chequera. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-037 | Anular un cheque propio solo desde Disponible; desmarcar solo de Anulado a Disponible; rechazar pasa a Rechazado salvo que ya lo esté. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-038 | Modificar un cheque emitido cambia fecha y observación y replica la fecha en su movimiento bancario. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-039 | Al crear una chequera física se genera un cheque por número; en eCheq la cantidad con número 0; eliminar completa la borra, la parcial anula disponibles. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-040 | Impresión de cheques: beneficiario = nombre de pago de la OP, si no "a la orden" del proveedor, si no razón social; importe en letras; rango obligatorio, desde ≤ hasta, correlativo y coincidente con… | Todos | A validar · Replicar | M14 §6 |
| RN-TES-041 | Los cheques propios emitidos se imputan a "pendiente de débito" de la cuenta si está configurada; si no, a la cuenta del banco. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-042 | Cupones: ciclo cobrado → en tesorería → presentado → cobrado/liquidado; "pendiente de presentación" = no presentado con fecha de tesorería; "pendiente de pago" = presentado no pagado. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-043 | Al liquidar cupones se registra el neto en banco y se genera comprobante de gastos al procesador con comisiones, IVA diferencial, exento, impuestos y retenciones con certificado. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-044 | Anular una presentación de cupones solo con cupones no pagados y si la suma coincide con el movimiento de presentación; igual criterio para retenciones. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-045 | El rechazo de un cupón genera anticipo o deuda al socio (con vendedor y tipo de cuota por defecto, concepto del rechazo, opción de comprobante formal). | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-046 | Retenciones sufridas pendientes = no presentadas y sin fecha de salida; presentar genera un único movimiento por la suma y marca con control de concurrencia; si alguna ya fue presentada, se revierte… | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-047 | Presentar retenciones no equivale a que M06 las haya computado en una DDJJ presentada; el estado de cómputo lo informa M06. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-048 | La rendición de una caja se crea una sola vez y su aceptación produce una sola operación. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-049 | La diferencia de efectivo de la rendición se registra como quebranto de ingreso (sobrante) o egreso (faltante), nunca ajustando cobros. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-050 | Ejecución de pago: la suma de medios = neto a pagar; cada medio genera su movimiento (efectivo/valores en tesorería, transferencia/cheque/VEP en banco). | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-051 | Una transferencia con CBU queda marcada para archivo bancario. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-052 | Firmar requiere permiso, pago no anulado y no firmado; entregar requiere permiso y pago firmado. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-053 | En firma/entrega masiva se informan los rechazados con causa. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-054 | No se anula un pago cuyo efectivo salió de una caja sin anular primero esa salida; la anulación revierte medios, cheques y valores, y notifica a M12. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-055 | Un pago a proveedor está pendiente de salida cuando su importe menos lo movido en tesorería y bancos es distinto de cero. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-056 | Un pago es diferido cuando la fecha del movimiento difiere de la fecha de pago; se clasifica en T (tesorería) y P (pago). | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-057 | El pago neto al tercero y el ingreso de la retención al organismo son movimientos distintos; emitir una instrucción no es pagar. | Todos | Adoptada · Informado | M14 §6 |
| RN-TES-058 | Un archivo generado no es un pago ejecutado: el estado "Ejecutado" requiere débito conciliado o respuesta aceptada del banco. | Todos | Adoptada · Informado | M14 §6 |
| RN-TES-059 | El CBU de origen de un archivo es el de la cuenta seleccionada en el lote. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-060 | Movimientos de Interbanking: se deduplican por cuenta + importe + correlativo + fechas; se traducen códigos de operación a categorías. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-061 | Un grupo de conciliación debe cuadrar (Σ extracto = Σ libro) o la diferencia debe explicarse con un movimiento del mismo acto. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-062 | Desconciliar deshace el grupo completo. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-063 | La conciliación tiene cabecera con saldo de extracto y fecha de corte; marcar movimientos sin saldo de extracto no es conciliar. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-064 | Un crédito bancario no identificado no se imputa a un socio por inferencia; va a pendientes de identificación. | Todos | Adoptada · Informado | M14 §6 |
| RN-TES-065 | La acreditación neta de una pasarela se concilia contra el neto esperado de M07; la comisión ya fue registrada por M07 como gasto separado del cobro del socio. | Todos | Adoptada · Informado | M14 §6 |
| RN-TES-066 | Saldo operativo por fecha valor, contable por fecha de emisión; a futuro, lo vencido se agrupa en hoy. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-067 | La moneda extranjera se valúa con la última cotización ≤ fecha; las cuentas de tipo caja de tesorería se informan como "Tesorería". | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-068 | Proyección de pagos: previsiones fijas expandidas por periodicidad (1 mensual, 2 bimestral, 3 trimestral, 4 semanal, 5 quincenal), facturas con saldo por vencimiento y cheques propios emitidos no… | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-069 | Proyección de tesorería: compras pendientes con saldo a la fecha, cheques propios a pagar con fecha futura y valores en cartera no depositados. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-070 | Los pagos a proveedores que son empleados se ocultan en la proyección a quien no tiene permiso de sueldos. | Todos | A validar · Replicar | M14 §6 |
| RN-TES-071 | Un compromiso se crea por decisión aprobada, se consume al devengar/pagar y se libera al cancelar sin generar ingreso. | Todos | Adoptada · Adoptar | M14 §6 |
| RN-TES-072 | El lote de haberes se ejecuta sin simular facturas al empleado-proveedor. | Todos | A validar · Reemplazar | M14 §6 |
| RN-TES-073 | Varias cuentas por empleado: el neto se reparte por porcentaje; Banco Nación puede usar la cuenta asignada al empleado. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-074 | Anular un pago de haberes revierte tesorería. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-075 | Las credenciales de integraciones (Interbanking, bancos, eCheq) se guardan en la bóveda por tenant; nunca en tablas, parámetros ni logs. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-076 | Las consultas con datos variables usan parámetros (sin SQL/consultas armadas por concatenación). | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-077 | La cuenta bancaria del proveedor se identifica por CUIT y CBU validado; el reemplazo de CUIT se hace por operación auditada de M12. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-078 | La planilla diaria agrupa por tipo con neto y saldo anterior; el comprobante de operación vacía los ingresos en depósitos (tipos 1 y 2). | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-079 | Recargos por cuotas por tarjeta: tipo (porcentaje o importe) y valor por cantidad de cuotas. | Todos | Adoptada · Replicar | M14 §6 |
| RN-TES-080 | La conciliación por Interbanking registra fecha de conciliación propia; los cheques no debitados se calculan sin vínculo con Interbanking cuando está activo. | Todos | Adoptada · Mejorar | M14 §6 |
| RN-TES-081 | Las fechas en días no hábiles se validan contra el calendario del tenant según política. | Todos | A validar · Replicar | M14 §6 |
| RN-TES-082 | Las líneas de extracto importadas son inmutables; una corrección del banco llega como nueva línea. | Todos | Adoptada · Adoptar | M14 §6 |
| RN-TES-083 | Una rendición observada no puede aceptarse parcialmente sin registrar la diferencia; el cajero que la entregó no puede aceptarla. | Todos | Adoptada · Adoptar | M14 §6 |
| RN-TES-084 | Los gastos financieros se clasifican; el impuesto sobre débitos y créditos bancarios y otros cargos no tienen alícuota fija en código. | Todos | Adoptada · Adoptar | M14 §6 |
| RN-TES-085 | Ningún efecto financiero se aplica dos veces por reintentos de eventos, archivos o API. | Todos | Adoptada · Reemplazar | M14 §6 |
| RN-TES-086 | Una rendición de caja con cobros de varias entidades jurídicas se acepta con una operación de tesorería por entidad, cada una sobre una cuenta de esa entidad; nunca se mezclan fondos de entidades… | Todos | Adoptada · Adoptar | M14 §6 |

<a id="catalogo-m15-con"></a>

### M15 CON — Contabilidad (126 reglas)

Fuente: [`M15-CON-contabilidad.md`](../especificacion/anexos/M15-CON-contabilidad.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-CON-001 | Partida doble: en todo asiento la suma del debe iguala la del haber. En asientos manuales la igualdad es exacta. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-002 | En asientos automáticos, una diferencia menor o igual a la tolerancia configurada se imputa al rol de redondeo del módulo (facturación, caja) o al rol "conceptos desconocidos"; mayor a la tolerancia… | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-003 | Un asiento tiene al menos dos renglones, descripción obligatoria, fecha dentro de un ejercicio abierto, período contable no bloqueado y módulo contable abierto. | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-004 | Numeración: id interno inmutable; número visible correlativo por ejercicio (máximo del ejercicio + 1, asignado con contador atómico, no `MAX+1`); si la fecha cambia de ejercicio, se asigna número del… | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-005 | Un renglón sin cuenta resuelta invalida solo el evento al que pertenece; los demás eventos del lote se contabilizan. | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-006 | Solo cuentas imputables, vigentes y del plan operativo del ejercicio reciben renglones oficiales. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-007 | Antes de emitir balances se controla que ninguna cuenta no imputable tenga movimientos o saldo; se listan todas. | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-008 | En asientos resumen se comprimen renglones de igual cuenta, centro, dimensiones y lado; la distribución por centros se recalcula con los decimales configurados. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-009 | Toda alta, modificación, aprobación, anulación y reversión se audita con antes/después, usuario, fecha y origen. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-010 | El origen del asiento es un atributo explícito (`sourceType`: manual, automático, importado, cierre, apertura, ajuste, inflación, reversión, reclasificación, excedentes). | Todos | Adoptada · Reemplazar | M15 §6.1 |
| RN-CON-011 | Cada evento económico se contabiliza como máximo una vez: clave única (`tenantId`, `sourceEventId`) en la bandeja y vínculo explícito evento → asiento; reenvíos, reprocesos y lotes repetidos no… | Todos | Adoptada · Reemplazar | M15 §6.1 |
| RN-CON-012 | Anular o revertir el documento de origen genera un contraasiento vinculado; si el período del original está cerrado, el contraasiento se fecha en el primer período abierto con referencia al original… | Todos | Adoptada · Reemplazar | M15 §6.1 |
| RN-CON-013 | Un asiento contabilizado de período abierto no transcripto en libro rubricado puede anularse lógicamente (queda visible, excluido de saldos); los transcriptos o de períodos cerrados solo admiten… | Todos | A validar · Reemplazar | M15 §6.1 |
| RN-CON-014 | Los asientos de un lote se preparan en borrador, se revisan y se confirman; al confirmar se asigna la numeración definitiva. | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-015 | Asientos de apertura y cierre se identifican por tipo y por su vínculo con el ejercicio; un asiento ya marcado no se remarca. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-016 | Al registrar los centros de un renglón se descartan distribuciones con importe cero y se agrupan las del mismo centro. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-017 | Los asientos importados se numeran por ejercicio igual que los manuales y deben cumplir ejercicio abierto y período no bloqueado; se agrupan por código + descripción + fecha; con centros, una… | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-018 | La anulación masiva excluye apertura y cierre, exige permiso `con.asientos.anularMasivo`, período abierto y no transcripto, valida solo lo seleccionado y revierte los efectos dependientes… | Todos | A validar · Mejorar | M15 §6.1 |
| RN-CON-019 | Renumeración de asientos: por ejercicio, ordenando por fecha con apertura primero, cierre al final y luego orden de registro; formato opcional prefijo de 4 dígitos + correlativo de 4; puede continuar… | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-020 | La renumeración del libro diario para impresión no modifica la numeración guardada. | Todos | Adoptada · Replicar | M15 §6.1 |
| RN-CON-021 | Un asiento manual o de ajuste cuyo importe supera el umbral, o de tipos definidos, requiere aprobación de un usuario distinto del que lo cargó. | Todos | Adoptada · Mejorar | M15 §6.1 |
| RN-CON-022 | Cascada de resolución: (1) cuenta asignada en la entidad de la dimensión; (2) regla de imputación con mayor cantidad de condiciones coincidentes (empate: prioridad; empate total: error de… | Todos | Adoptada · Mejorar | M15 §6.2 |
| RN-CON-023 | Proveedor: cuenta del proveedor → rol "proveedores / compras". | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-024 | IVA por alícuota: rol IVA crédito fiscal (compras) o IVA débito inscripto/no inscripto (ventas) → cuenta de compras/ventas de la alícuota → rubro. | Todos | A validar · Replicar | M15 §6.2 |
| RN-CON-025 | Percepciones: compras → rol percepciones en productos; ventas → cuenta de percepción de la alícuota → rol percepción de ventas de productos → rol percepciones no categorizados → rubro. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-026 | Banco: cuenta pendiente de débito del banco (cheques propios diferidos) → cuenta del banco. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-027 | Tipo de factura (deudores): cuenta del tipo de factura → cuenta de referencia. | Todos | A validar · Replicar | M15 §6.2 |
| RN-CON-028 | Grupo contable de cobranza: grupo 0 → roles facturación, refinanciaciones, cierre de caja, valores en cartera, tarjetas, capital integrado; grupo ≠ 0 → cuentas del grupo (cobranza facturación… | CAP | Adoptada · Replicar | M15 §6.2 |
| RN-CON-029 | Rubro de producto/servicio por uso: compras, ventas, otros, costo de venta, costo de baja, amortización anual, amortización acumulada, valor de origen, disminución, revalúo. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-030 | Venta personalizada por rubro afectado: regla con rubro afectado; si no hay regla, sigue la cascada. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-031 | Retenciones: sufridas (cobranza) → cuenta del tipo de retención de cobro; practicadas (pagos) → cuenta del tipo de retención de pago. | Todos | A validar · Replicar | M15 §6.2 |
| RN-CON-032 | Sueldos: cuenta del concepto; contribuciones → cuenta de contribuciones de la empresa o su cuenta general; personalizado → cuentas debe/haber de la plantilla; sindicato → cuenta general y de cargas. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-033 | Obras: cuenta del grupo de obra (debe) y su contrapartida (haber); incidentes: cuenta de la categoría de incidente. | OBR | A validar · Replicar | M15 §6.2 |
| RN-CON-034 | Tipos de valor (medios de pago) y categorías de movimientos bancarios y de tesorería tienen cuenta propia; sin cuenta, rol genérico. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-035 | Ventas: agrupación por grupo contable, tipo de comprobante, zona y rubro; la regla con más coincidencias define la cuenta; se puede desactivar el uso de grupos contables. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-036 | Modalidad de deudores por servicios: por tipo de factura (1) o por concepto (3, 5, 6); la 5 separa IVA. | INT | A validar · Replicar | M15 §6.2 |
| RN-CON-037 | Deudores por refinanciación: separar o no por tipo de deudor. | Todos | Adoptada · Replicar | M15 §6.2 |
| RN-CON-038 | Financiaciones: tomar el rubro del producto de financiación (variable 308) en asientos de ventas y cobranza. | Todos | A validar · Replicar | M15 §6.2 |
| RN-CON-039 | Los pagos de capital y servicios a contabilizar excluyen anulados y prescriptos y filtran por titulares activos/no activos y por el grupo contable del parámetro recibido. | Todos | Adoptada · Mejorar | M15 §6.2 |
| RN-CON-040 | Validar la configuración antes de operar: la publicación de configuración y el validador nocturno detectan faltantes; al contabilizar, un faltante deja el evento pendiente. | Todos | A validar · Mejorar | M15 §6.2 |
| RN-CON-041 | El emisor del evento no elige cuentas; si un módulo necesita mostrar "asiento contable" (ej. en la OP), consulta a CON el asiento vinculado o la previsualización por reglas. | Todos | Adoptada · Reemplazar | M15 §6.2 |
| RN-CON-042 | Factura de compra: debe compras del rubro por neto + descuento (distribuido por sección); IVA crédito fiscal (rol o alícuota); ítems recibidos sin stock a "compras productos pendientes"; haber… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-043 | IVA no tomado (factura con porcentaje de IVA computable menor a 100 o ítems marcados) se registra como gasto; con centros, el porcentaje de IVA puede cargarse por ítem. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-044 | IVA de compras por centro: según la asignación del impuesto IVA o, si no existe, proporcional a los ítems; el porcentaje de IVA computable de cada sección define la parte que va a crédito fiscal y la… | Todos | A validar · Replicar | M15 §6.3 |
| RN-CON-045 | Ítems de compra sin rubro no se contabilizan: el evento queda pendiente con el detalle del ítem. | Todos | Adoptada · Mejorar | M15 §6.3 |
| RN-CON-046 | Remitos de proveedor: asiento de entrega de materiales con stock contra "compras productos pendientes" solo si ese rol tiene cuenta; opción de incluir todos los remitos; la factura posterior cancela… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-047 | Ítems de compra con obra: se imputan a la cuenta de la obra. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-048 | Retenciones practicadas a proveedores: debe proveedor, haber cuenta del tipo de retención. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-049 | Pago a proveedores: debe proveedor (pago + descuento); haber descuentos obtenidos, caja de pagos (efectivo), valores en cartera o cuenta puente de pago con valores (cheques de terceros), cuenta del… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-050 | Tesorería y bancos generan asientos por tipo de movimiento: cambio de valores (cuenta de movimiento P2076), transferencias entre bancos, ingresos/egresos excepcionales contra la cuenta de la… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-051 | Cobranza: debe caja/valores/tarjetas según grupo contable, retenciones sufridas, bancos de las transferencias y acreditaciones pendientes de entes; haber deudores por tipo de factura (y servicio) o… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-052 | El cobro digital se registra en dos pasos: al confirmar el pago, debe "acreditaciones pendientes" del ente; al acreditar, debe banco, comisiones (y su IVA) y retenciones, haber acreditaciones… | Todos | Adoptada · Mejorar | M15 §6.3 |
| RN-CON-053 | Capital social: se suscribe al facturar o en la afiliación según configuración de M17, y se integra en el pago si así está configurado; el aporte nunca es ingreso por servicios. | CAP | Adoptada · Replicar | M15 §6.3 |
| RN-CON-054 | Stock en OT y OM: materiales al costo informado; horas de participantes valuadas a hora normal/extra contra las cuentas de mano de obra; opción de usar la cuenta de compras del rubro en lugar de la… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-055 | Conciliaciones de stock, vales (incluidos retiros de materiales de viviendas con obra por defecto), costo de mercadería vendida, entregas y retiros de comodato (si se muestra el asiento de comodato)… | VIV | Adoptada · Replicar | M15 §6.3 |
| RN-CON-056 | El costo de los movimientos de stock lo informa STK en el evento (costo perpetuo); CON no valoriza. | Todos | Adoptada · Reemplazar | M15 §6.3 |
| RN-CON-057 | Sueldos: formato 1 = asiento de recibos + asiento de contribuciones; 2 = asiento por sindicato; 3 = asiento personalizado por plantilla. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-058 | Pago de sueldos: el neto se cancela con la orden de pago generada (el empleado es proveedor en ProCoop); los adelantos pendientes se descuentan. | Todos | Adoptada · Mejorar | M15 §6.3 |
| RN-CON-059 | Fabricación: partes en producción → debe productos en proceso, haber cuenta de compras del rubro de cada componente costeado por PEPS (o cantidad × costo); finalizado → reparte el costo entre… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-060 | Bienes de uso: amortización lineal (tasa anual = porcentaje a amortizar / vida útil; mensual = anual / 12; prorrateo por días en meses parciales; mejoras y productos en asientos separados); asientos… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-061 | Revertir o anular un asiento de amortización emite `con.entry.reversed` y STK revierte los acumulados del bien; un bien con amortizaciones contabilizadas no se elimina, se da de baja. | Todos | Adoptada · Mejorar | M15 §6.3 |
| RN-CON-062 | Intereses de financiaciones y ventas en cuotas se reconocen como ganados al vencer/facturar cada cuota; hasta entonces están en "intereses a devengar"; el IVA de los intereses de refinanciaciones se… | Todos | A validar · Replicar | M15 §6.3 |
| RN-CON-063 | Previsión para deudores incobrables y castigo: la previsión se constituye por asiento de ajuste; la declaración de incobrable aplica la previsión contra créditos sin borrar la deuda del historial… | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-064 | Prescripción de deuda: baja de créditos contra la cuenta de prescripción. | Todos | A validar · Replicar | M15 §6.3 |
| RN-CON-065 | Intereses en segundo y tercer vencimiento facturados se acreditan a la cuenta de intereses. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-066 | Conceptos cobrados por cuenta y orden de terceros se registran como pasivo con el tercero y no como ingreso; la rendición cancela el pasivo. | ALU | Adoptada · Replicar | M15 §6.3 |
| RN-CON-067 | El resumen de cuenta o el grupo de facturación no genera obligación ni asiento adicional; solo los documentos fiscales individuales o el comprobante multiservicio. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-068 | Ingreso devengado, costo/gasto y cobro son magnitudes distintas: un pago parcial no reduce el ingreso registrado. | Todos | Adoptada · Replicar | M15 §6.3 |
| RN-CON-069 | Compra de energía, cargos de abastecimiento, red y pérdidas se registran como costos y no como recargo del usuario. | ELE | A validar · Replicar | M15 §6.3 |
| RN-CON-070 | Los centros de costo se activan para todo el sistema o solo para sueldos. | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-071 | Asignación por defecto por tipo de operación y tipo de elemento con porcentaje; tipos de operación: 1 ingresos/facturación, 2 compras, 3 ajuste por inflación, 4 asiento; tipos de elemento: producto… | Todos | A validar · Replicar | M15 §6.4 |
| RN-CON-072 | Si un elemento no tiene asignación específica, la interfaz ofrece todos los centros con 0 % y exige completar 100 % antes de guardar. | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-073 | Porcentaje de sección = valor absoluto de (importe redondeado × 100 / importe del ítem); importes distribuidos suman el importe del renglón; el último centro absorbe la diferencia. | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-074 | Al final de la contabilización, cualquier renglón sin centro de una cuenta que lo admite toma la distribución por defecto de la cuenta; si la cuenta exige centro y no hay defecto, el evento queda… | Todos | Adoptada · Mejorar | M15 §6.4 |
| RN-CON-075 | Los centros habilitados por cuenta restringen los centros aceptados en sus renglones. | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-076 | Bienes de uso, empleados, categorías de incidentes, grupos de obra e ítems de compra tienen distribución propia que prevalece sobre la asignación por defecto; en bienes de uso se muestran primero las… | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-077 | La distribución analítica de costos comunes conserva importe, base, fecha, regla y destinos; el total distribuido iguala el importe asignado; los no asignados quedan identificados; no se vuelve a… | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-078 | Ingresos por sección = ítems facturados × porcentaje de asignación de ingresos; egresos por sección = renglones de cuentas de naturaleza egresos con su distribución. | Todos | Adoptada · Mejorar | M15 §6.4 |
| RN-CON-079 | El servicio puede ser una dimensión o coincidir con un centro, pero no se impone esa equivalencia; la pertenencia al tenant es obligatoria. | Todos | Adoptada · Replicar | M15 §6.4 |
| RN-CON-080 | Ejercicio válido: desde < hasta, número único, sin solapamiento con otro y sin contener a otro. | Todos | Adoptada · Mejorar | M15 §6.5 |
| RN-CON-081 | Toda operación de cualquier módulo con fecha en un período bloqueado para ese módulo, o anterior o igual a su fecha de bloqueo, se rechaza con "La fecha de la operación es anterior a la fecha de… | Todos | Adoptada · Reemplazar | M15 §6.5 |
| RN-CON-082 | Reapertura de período o ejercicio: solicitud con motivo, aprobación (dos usuarios para ejercicio), auditoría; en ejercicio se revierten los asientos de cierre/apertura, no se borran. | Todos | Adoptada · Reemplazar | M15 §6.5 |
| RN-CON-083 | Cierre de ejercicio: sin asientos de cierre previos; resultados (naturaleza ingresos y egresos) se saldan contra la cuenta de resultados de prefijo más largo coincidente o el rol asignación de… | Todos | Adoptada · Replicar | M15 §6.5 |
| RN-CON-084 | Cuentas de orden en el cierre según configuración. | Todos | A validar · Pendiente de decisión | M15 §6.5 |
| RN-CON-085 | Saldos por ejercicio: el saldo de una cuenta a una fecha considera la apertura del ejercicio y los movimientos del ejercicio; el histórico total solo se usa para cuentas sin cierre. | Todos | Adoptada · Mejorar | M15 §6.5 |
| RN-CON-086 | Cierre de período mensual solo si no hay eventos pendientes, borradores, cajas abiertas (si la política lo exige) ni diferencias de conciliación sin justificar. | Todos | Adoptada · Adoptar | M15 §6.5 |
| RN-CON-087 | Un solo plan operativo por ejercicio; los demás planes son representaciones (alternativo, regulatorio) o de simulación. La capacidad de varios planes no implica varios registros oficiales… | Todos | A validar · Adoptar | M15 §6.6 |
| RN-CON-088 | Equivalencias: toda cuenta imputable con movimientos del período debe tener equivalencia para que la proyección o el escenario sea "comparable"; los repartos 1:N suman 100 %; ninguna cuenta destino… | Todos | Adoptada · Adoptar | M15 §6.6 |
| RN-CON-089 | Una cuenta alternativa puede reutilizar un código visible; su identidad incluye plan, versión y ámbito (real o simulado). | Todos | Adoptada · Adoptar | M15 §6.6 |
| RN-CON-090 | Una simulación no emite comprobantes, no genera deuda, no mueve fondos, no envía órdenes a terceros ni contabiliza oficialmente; resultados identificados como simulación. | Todos | Adoptada · Adoptar | M15 §6.6 |
| RN-CON-091 | La promoción de una configuración simulada o alternativa requiere acción explícita, nueva vigencia y auditoría; no convierte resultados simulados en asientos reales. | Todos | Adoptada · Adoptar | M15 §6.6 |
| RN-CON-092 | El saldo contable se deriva exclusivamente de renglones contabilizados; no hay campos de saldo editables; el total no depende de la pantalla o proceso que lo consulte. | Todos | Adoptada · Reemplazar | M15 §6.6 |
| RN-CON-093 | Ningún ajuste de saldo carece de operación, causa, autor y contrapartida. | Todos | Adoptada · Adoptar | M15 §6.6 |
| RN-CON-094 | La jerarquía se define por cuenta padre explícita; la máscara de código es solo formato. Para migrar desde ProCoop, la jerarquía se deriva de los prefijos (11 dígitos = 6 + 5, luego prefijos de 5, 3… | Todos | Adoptada · Reemplazar | M15 §6.7 |
| RN-CON-095 | La naturaleza de cada cuenta es un atributo; para migrar se deriva de los prefijos configurados (Activo P514 "1", Pasivo P508 "2", PN P509 "3", Ganancias P510 "4", Pérdidas P511 "5", Orden P512 "6"). | Todos | A validar · Reemplazar | M15 §6.7 |
| RN-CON-096 | Renumerar una cuenta cambia solo su código visible; como toda referencia es por id, no se reescriben tablas ni parámetros. | Todos | Adoptada · Reemplazar | M15 §6.7 |
| RN-CON-097 | Unificar dos cuentas exige mismo plan y naturaleza, origen sin hijos o con hijos reasignados, aprobación y auditoría; no altera períodos cerrados. | Todos | A validar · Adoptar | M15 §6.7 |
| RN-CON-098 | La reasignación masiva cambia en bloque rubros (productos, servicios, impuestos, conceptos de compra) o cuentas (bancos, roles, proveedores, tipos de factura); cuenta vacía se guarda como nula… | Todos | Adoptada · Replicar | M15 §6.7 |
| RN-CON-099 | Un rubro de producto pertenece como máximo a un rubro de capitalización. | Todos | Adoptada · Replicar | M15 §6.7 |
| RN-CON-100 | Ajuste por inflación: coeficiente = índice del mes de cierre / índice del mes de origen de cada partida (o del inicio del ejercicio para saldos de apertura); diferencia contra RECPAM; solo cuentas… | Todos | A validar · Replicar | M15 §6.8 |
| RN-CON-101 | Revaluación de stock por índice: factor = índice del mes hasta / índice del mes del movimiento (o del mes desde si es anterior); en enero se toma el índice de diciembre del año anterior; productos… | Todos | A validar · Replicar | M15 §6.8 |
| RN-CON-102 | Hojas rubricadas: folios correlativos sin saltos; líneas por hoja configurables; una vez transcripto un asiento, solo contraasiento. | Todos | Adoptada · Replicar | M15 §6.8 |
| RN-CON-103 | Presupuesto, comprometido, devengado y pagado son estados distintos y no se suman como gastos independientes; el compromiso se libera al cancelar la OC sin generar ingresos. | Todos | Adoptada · Adoptar | M15 §6.8 |
| RN-CON-104 | Capital y servicios se explican por separado; la baja de un servicio no produce egreso de asociado ni devolución de capital; cobrar un aporte no lo convierte en ingreso por consumo. El aporte de… | CAP | Adoptada · Adoptar | M15 §6.8 |
| RN-CON-105 | Excedentes: la distribución se contabiliza solo con resolución de asamblea registrada en M17; el cuadro propuesto aplica la normativa vigente validada por el contador (reservas y fondos legales… | Todos | A validar · Adoptar | M15 §6.8 |
| RN-CON-106 | Si un evento económico llega con fecha contable dentro de un período ya bloqueado para el módulo contable (por ejemplo, una acreditación bancaria tardía cuyo módulo de origen seguía abierto), el… | Todos | Adoptada · Mejorar | M15 §6.9 |
| RN-CON-107 | Todo renglón en moneda extranjera guarda moneda, cotización, importe en moneda original e importe en ARS; el equilibrio del asiento se controla en ARS; las diferencias de cambio de saldos monetarios… | Todos | Adoptada · Mejorar | M15 §6.9 |
| RN-CON-108 | Las cuentas marcadas `requiresService` (cuentas de control de créditos, ingresos por servicios, costos directos) exigen la dimensión servicio en cada renglón; un renglón sin servicio deja el evento… | Todos | A validar · Mejorar | M15 §6.9 |
| RN-CON-109 | Planes, roles, reglas, centros y simulaciones pertenecen a un único tenant. Copiar un servicio a otro tenant (AGR-009) no copia cuentas ni reglas: la publicación en el destino exige reglas resueltas… | Todos | Adoptada · Adoptar | M15 §6.9 |
| RN-CON-110 | El plan modelo y las reglas por defecto se ofrecen como plantilla de plataforma (`PLATFORM`); al aplicarla se copian al tenant y desde ese momento son del tenant. | Todos | A validar · Adoptar | M15 §6.9 |
| RN-CON-111 | Una simulación congela (por versión y fecha de corte) las reglas, el plan, el universo de eventos y los supuestos; re-ejecutarla con los mismos insumos produce el mismo resultado. | Todos | Adoptada · Adoptar | M15 §6.9 |
| RN-CON-112 | La proyección de saldos (`ledgerBalances`) se actualiza en la misma transacción que el asiento; un job nocturno la reconstruye desde los renglones y una diferencia genera alerta crítica sin corregir… | Todos | Adoptada · Reemplazar | M15 §6.9 |
| RN-CON-113 | Un asiento automático no es editable. Su corrección es: corregir la configuración, revertir y reprocesar el evento (nuevo asiento vinculado). Los asientos manuales en borrador son editables solo por… | Todos | Adoptada · Reemplazar | M15 §6.9 |
| RN-CON-114 | La cuenta puente del rol `unmappedConceptSuspense` (P2111) solo recibe importes por tolerancia de redondeo; si al cerrar el período tiene saldo distinto de cero, el cierre exige justificación… | Todos | Adoptada · Mejorar | M15 §6.9 |
| RN-CON-115 | Un compromiso presupuestario no genera asiento oficial; vive solo en el registro presupuestario. | Todos | Adoptada · Adoptar | M15 §6.9 |
| RN-CON-116 | La IA puede sugerir cuentas, centros y anomalías; nunca contabiliza, aprueba, cierra ni modifica reglas sin confirmación humana auditada. | Todos | Adoptada · Adoptar | M15 §6.9 |
| RN-CON-117 | Cada asiento guarda fecha contable (`accountingDate`) y fecha de registro (`recordedAt`); todos los reportes permiten elegir cualquiera de las dos, y la de registro nunca se modifica. | Todos | Adoptada · Replicar | M15 §6.9 |
| RN-CON-118 | Los cobros en exceso se registran como anticipos o saldos a favor del asociado y los cobros no identificados en una cuenta transitoria; nunca como ingreso. | Todos | Adoptada · Adoptar | M15 §6.9 |
| RN-CON-119 | Las retenciones sufridas en cobros se reconocen como crédito fiscal al confirmarse el cobro, no al presentarlas; la presentación solo cambia su ubicación de cartera (TES) y el cómputo (FIS). | Todos | Adoptada · Mejorar | M15 §6.9 |
| RN-CON-120 | Libros, asientos y documentación respaldatoria se conservan íntegros como mínimo durante el plazo legal (art. 328 del Código Civil y Comercial: diez años) y no se purgan aunque el tenant se dé de… | Todos | A validar · Adoptar | M15 §6.9 |
| RN-CON-121 | La factura del mayorista de energía o gas (M-126, M-127) y la liquidación de derechos de señales (M-128) se imputan a roles de costo del servicio (`wholesaleEnergyCost`, `wholesaleGasCost`… | TV, ELE, GAS | A validar · Adoptar | M15 §6.3 |
| RN-CON-122 | El subsidio social aprobado (EVT-SOC-04) se registra con rol `socialSubsidy` contra el fondo de subsidio (`socialSubsidyFund`) hasta su saldo y genera el pasivo con los beneficiarios… | SEP | A validar · Adoptar | M15 §6.3 |
| RN-CON-123 | El depósito en garantía cobrado al socio (por ejemplo, el del préstamo ortopédico) es pasivo con el depositante (`guaranteesHeld`) y nunca ingreso; su devolución se registra como crédito a la cuenta… | OTR | Adoptada · Adoptar | M15 §6.3 |
| RN-CON-124 | La venta del derecho de sepultura se reconoce como ingreso del período al otorgarse el derecho y el mantenimiento como ingreso periódico (opción recomendada de PA-CON-17); si el tenant configura… | CEM | A validar · Adoptar | M15 §6.3 |
| RN-CON-125 | Un asiento pertenece a una sola entidad jurídica: todas sus líneas, su ejercicio y su período llevan el mismo `legalEntityId`; un evento cuyo documento de origen involucra dos entidades (cobro… | Todos | A validar · Adoptar | M15 §6.3 |
| RN-CON-126 | **Rol contable por clase de ítem** (`itemClass` de M05, RF-FAC-176, RN-FAC-156; llega en el renglón de `fac.invoice.issued` y en las imputaciones de `cob.payment.confirmed`): `guaranteeDeposit` → haber… | SEP, CEM, OTR | A validar · Adoptar | M15 §6.3 |

<a id="catalogo-m16-sue"></a>

### M16 SUE — Personal y sueldos (95 reglas)

Fuente: [`M16-SUE-personal-sueldos.md`](../especificacion/anexos/M16-SUE-personal-sueldos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-SUE-001 | El legajo es único por empresa empleadora. | Todos | Adoptada · Replicar | M16 §6.1 |
| RN-SUE-002 | Todo empleado está vinculado a una persona de M01; no hay datos personales duplicados en el legajo. | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-003 | El acceso del empleado al portal usa la cuenta de T02 (contraseña con hash, 2FA según política). **Nunca** el documento como clave por defecto. | Todos | Adoptada · Reemplazar | M16 §6.1 |
| RN-SUE-004 | Cambios de categoría, convenio, cargo, área, jornada, modalidad y empresa se registran con fecha efectiva y fecha de registro; el cálculo de un período usa los valores vigentes en ese período. | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-005 | Alerta de cambio de categoría cuando los meses transcurridos desde la fecha de categoría (meses de 30 días) superan los meses configurados en el sindicato o convenio. | Todos | Adoptada · Replicar | M16 §6.1 |
| RN-SUE-006 | La distribución por centros de costo suma 100 % y tiene vigencia; sin distribución, se usa el centro de costo del área. | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-007 | Con varias cuentas de acreditación, la suma de porcentajes es 100 % o hay una cuenta «resto». | Todos | Adoptada · Replicar | M16 §6.1 |
| RN-SUE-008 | La documentación subida por el empleado queda pendiente; al autorizar se registra vencimiento y se mueve a la carpeta autorizada del expediente; al rechazar se conserva el rechazo con motivo y el… | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-009 | Familiares: los datos de Ganancias (F.572, porcentaje a deducir, estudiante, discapacidad) se guardan por año fiscal; actualizar el año en curso marca el familiar como declarado en F.572. | Todos | Adoptada · Replicar | M16 §6.1 |
| RN-SUE-010 | Desvincular registra motivo y fecha y agrega al empleado los conceptos del modelo de egreso del motivo; reincorporar elimina solo los conceptos que agregó la desvinculación y nunca recibos ni… | Todos | A validar · Mejorar | M16 §6.1 |
| RN-SUE-011 | Hasta tres situaciones de revista por mes por empleado, con día de inicio; la primera del mes es obligatoria. | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-012 | Las tablas oficiales (SICOSS, obras sociales, SMVM, topes, Ganancias) son de plataforma; el tenant las adopta y no las edita. Una actualización oficial publica una nueva vigencia, no reescribe la… | Todos | Adoptada · Reemplazar | M16 §6.1 |
| RN-SUE-013 | Un convenio, categoría o escala solo puede usarse en una liquidación si está publicado y su parametrización tiene validación del responsable laboral o contador. | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-014 | El aumento masivo se calcula sobre el básico «puro»: si la escala tenía un porcentaje aplicado, básico puro = importe actual × 100 / porcentaje actual; nuevo = básico puro × (1 + aumento); redondeo a… | Todos | Adoptada · Mejorar | M16 §6.1 |
| RN-SUE-015 | Un grupo de extras «único» admite un solo extra por empleado; el grupo indica si deduce en Ganancias. | Todos | Adoptada · Replicar | M16 §6.1 |
| RN-SUE-016 | Tipos de concepto con código estable: remunerativo (1), no remunerativo (10), deducción (30), retención (40), contribución (60), redondeo (70). Haberes = 1 + 10; descuentos = 30 + 40; las… | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-017 | Cada concepto tiene vigencia, fórmula de cantidad, importe, base y filtro, orden de cálculo y tipos de liquidación (con «no mostrar» en recibo). Fuera de vigencia o no habilitado para el tipo, no se… | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-018 | Conceptos que dan cero no generan renglón salvo «liquidar siempre» con cantidad distinta de cero. | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-019 | Clasificación impositiva del concepto en Ganancias: no afecta, siempre, solo si se cobra en el 75 % de los recibos, 50 %, según porcentaje; y clasificación SICOSS/F.931 (sueldo, adicionales, SAC… | Todos | A validar · Replicar | M16 §6.2 |
| RN-SUE-020 | El nombre de variable o concepto es único; renombrar reemplaza la referencia `[Variables.<anterior>]` / `[Conceptos.<anterior>]` en todas las fórmulas del borrador. | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-021 | Las fórmulas se evalúan en orden de cálculo; una referencia a un concepto de orden mayor o circular es error de validación al guardar, no en la liquidación. | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-022 | Los resultados intermedios en memoria por empleado se invalidan si cambian datos de entrada durante la liquidación; la liquidación toma una **instantánea** de datos al iniciar el cálculo y la guarda… | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-023 | Función `basicoCategoria(categoria, fecha)`: básico vigente de la escala a la fecha. | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-024 | Función `sac(hasta, tipo)`: 50 % de la mayor remuneración mensual del semestre (enero-junio o julio-diciembre) hasta la fecha, sumando conceptos marcados «afecta SAC»; deducciones de tipo 30/40… | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-025 | Funciones de acumulados: total, cantidades o máximo imputado de uno o varios conceptos (o hasta un orden) entre fechas, incluyendo o excluyendo tipos de liquidación; total imputado por tipo de… | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-026 | Función `recibosLiquidados(desde, hasta, tipo?)`: cantidad de períodos con recibo. | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-027 | Funciones de novedades: total de un código en el período y total por tipos acumulado desde el inicio del año fiscal según PRM-SUE-001. | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-028 | Función `adelantos(hasta)`: saldo de adelantos pagados no descontados (planes de tipo adelanto), no de facturas de compra. | Todos | Adoptada · Reemplazar | M16 §6.2 |
| RN-SUE-029 | Función `facturasAdeudadas(desde, hasta)`: saldo vencido de cuentas de servicio vinculadas al empleado; devuelve 0 si no hay autorización vigente o si la función está desactivada. | Todos | A validar · Mejorar | M16 §6.2 |
| RN-SUE-030 | Funciones de Ganancias: retención mensual y de liquidación final, deducciones especiales, cónyuge, ganancia no imponible, total de concepto a efectos de Ganancias (3 = 50 %, 4 = porcentaje del… | Todos | A validar · Replicar | M16 §6.2 |
| RN-SUE-031 | Función `impuestoCedular`: resta al ingreso las novedades marcadas del año; si supera N salarios mínimos × mes aplica la escala de tramos sobre el excedente; escala y N salen de una tabla versionada… | Todos | A validar · Mejorar | M16 §6.2 |
| RN-SUE-032 | Las funciones de fórmula validan cantidad y tipo de argumentos y exponen nombre, descripción y categoría en el editor. | Todos | Adoptada · Replicar | M16 §6.2 |
| RN-SUE-033 | Publicar una versión de configuración exige: validación sintáctica y de dependencias de todas las fórmulas, códigos ARCA y cuentas contables resueltos, simulación del último período con informe de… | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-034 | Un cambio de etiqueta o de visibilidad en recibo no genera nueva versión de cálculo. | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-035 | La IA del editor de fórmulas solo propone; no recibe datos personales ni importes reales de empleados (usa catálogo de nombres y un caso ficticio). | Todos | Adoptada · Mejorar | M16 §6.2 |
| RN-SUE-036 | Novedades por cantidad o importe con cuotas; el tope anual del tipo se valida sumando las novedades del año fiscal. | Todos | Adoptada · Replicar | M16 §6.3 |
| RN-SUE-037 | Las novedades importadas (OT, cuadrilla, flota, Excel, fichadas) nacen en borrador con `sourceRef` único; reimportar el mismo origen actualiza la propuesta en borrador y nunca duplica; si ya fue… | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-038 | Solicitud de licencia: se rechaza si hay otra del mismo tipo pendiente o autorizada que se superpone; se guardan adjuntos; se notifica a los encargados por el canal de T09 (no por el campo fax). | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-039 | Autorización: se rechaza si se superpone con otra autorizada o si los días superan los disponibles; genera **una novedad por mes calendario** con los días de ese mes y el tipo de novedad de la causa… | Todos | Adoptada · Replicar | M16 §6.3 |
| RN-SUE-040 | Días disponibles de vacaciones = días según antigüedad y convenio − solicitudes pendientes − vacaciones tomadas del período. Para otras causas: días del período de la causa − días pedidos no… | Todos | Adoptada · Replicar | M16 §6.3 |
| RN-SUE-041 | Los días hábiles excluyen sábados, domingos **y feriados** (calendario de plataforma más feriados del tenant) y días no laborables del turno. | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-042 | Días de vacaciones por antigüedad al 31/12 del año: LCT art. 150 (14 días corridos hasta 5 años, 21 de 5 a 10, 28 de 10 a 20, 35 más de 20) o los de la escala del convenio si son mayores; con… | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-043 | Las vacaciones se gozan entre el 1 de octubre y el 30 de abril salvo convenio, se comunican con 45 días de anticipación y se pagan al inicio (art. 154–155). El sistema alerta, no bloquea. | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-044 | Año de control de vacaciones pendientes: solo se arrastran saldos del año configurado en adelante. | Todos | Adoptada · Replicar | M16 §6.3 |
| RN-SUE-045 | Licencias especiales LCT art. 158 (nacimiento, matrimonio, fallecimiento, examen) con los días de la tabla; si el convenio da más, prevalece el convenio. Licencia por maternidad (art. 177) con… | Todos | A validar · Mejorar | M16 §6.3 |
| RN-SUE-046 | Enfermedad inculpable (art. 208): plazo pago de 3 meses (antigüedad < 5 años) o 6 meses (≥ 5 años), duplicado con cargas de familia; luego reserva de puesto de 1 año (art. 211). | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-047 | Fichadas: se procesan contra el turno vigente; las manuales quedan marcadas con usuario; una fichada procesada no se reprocesa salvo reapertura. | Todos | Adoptada · Replicar | M16 §6.3 |
| RN-SUE-048 | Horas extra: recargo 50 % en días comunes y 100 % en sábados después de las 13, domingos y feriados (art. 201 LCT), salvo convenio más favorable; alerta al superar el tope mensual y anual de la tabla… | Todos | A validar · Mejorar | M16 §6.3 |
| RN-SUE-049 | Adelantos: no superan el 50 % de la remuneración de un período (art. 130) salvo excepción aprobada; se descuentan en el próximo recibo salvo que el tipo de liquidación esté marcado «no descontar… | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-050 | La retención de Ganancias calculada no se guarda como novedad del mes siguiente; queda en el detalle del recibo. La retención informada manual (antes novedad tipo 27) sustituye el cálculo con motivo… | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-051 | Remuneraciones de otros empleos importadas se cargan como novedad «otros empleos»; las de cajas previsionales provinciales con su tipo propio configurable (no por nombre fijo); se omiten las ya… | Todos | Adoptada · Mejorar | M16 §6.3 |
| RN-SUE-052 | SIRADIG: con PRM-SUE-012 activo, las novedades de diciembre se cargan con fecha de noviembre cuando las escalas están corridas. | Todos | A validar · Replicar | M16 §6.3 |
| RN-SUE-053 | Un recibo por empleado, período, tipo de liquidación y empresa; complementarias y rectificativas se vinculan al original. | Todos | Adoptada · Replicar | M16 §6.4 |
| RN-SUE-054 | La liquidación graba todos los recibos del lote de forma atómica por empleado y registra progreso del lote (reanudable); un fallo en un empleado no invalida a los demás y queda marcado con error. | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-055 | Neto = haberes (remunerativos + no remunerativos) − deducciones − retenciones; redondeo según concepto configurado (al entero superior por defecto ProCoop); con PRM-SUE-018 el redondeo se clasifica… | Todos | Adoptada · Replicar | M16 §6.4 |
| RN-SUE-056 | Plazo de pago: mensual dentro del 4.º día hábil del mes siguiente; quincenal y semanal dentro de los 3 días hábiles (art. 128); el sistema alerta si la fecha de pago lo excede. | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-057 | SAC: cuotas con vencimiento 30 de junio y 18 de diciembre (con plazo de pago de 4 días hábiles); base = 50 % de la mayor remuneración mensual devengada en el semestre; proporcional = base × días… | Todos | Adoptada · Replicar | M16 §6.4 |
| RN-SUE-058 | Vacaciones: valor día del mensualizado = remuneración ÷ 25; del jornalizado, el jornal; conceptos variables por promedio del semestre o año según convenio. | Todos | Adoptada · Replicar | M16 §6.4 |
| RN-SUE-059 | Liquidación final por despido sin causa: preaviso (art. 231: 15 días en período de prueba, 1 mes con antigüedad < 5 años, 2 meses ≥ 5 años) con SAC sobre preaviso; integración del mes de despido… | Todos | A validar · Mejorar | M16 §6.4 |
| RN-SUE-060 | Conceptos indemnizatorios exentos de aportes y de Ganancias según la tabla oficial; no integran la base del SAC. | Todos | Adoptada · Replicar | M16 §6.4 |
| RN-SUE-061 | Una liquidación aprobada no se edita; se corrige con complementaria (diferencias) o rectificativa (reemplazo). Nada se borra: los recibos anulados quedan con estado y motivo. | Todos | Adoptada · Reemplazar | M16 §6.4 |
| RN-SUE-062 | Embargabilidad: hasta 1 SMVM inembargable; entre 1 y 2 SMVM, 10 % de la remuneración neta de aportes; más de 2 SMVM, 20 % (Decreto 484/87); cuotas alimentarias y litis expensas sin esa limitación… | Todos | A validar · Mejorar | M16 §6.4 |
| RN-SUE-063 | Deducciones voluntarias (art. 132) no superan el 20 % del total de la remuneración del período (art. 133), excluidas retenciones legales y judiciales. | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-064 | Control de mínimos: la remuneración de jornada completa no es inferior al básico de convenio de la categoría ni al SMVM (proporcional en jornada parcial); advertencia que exige justificación. | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-065 | Una liquidación solo se aprueba si: no hay novedades en borrador del universo, todos los empleados tienen cuenta de acreditación o medio alternativo, todos los conceptos tienen cuenta contable… | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-066 | Separación de funciones: quien calcula no aprueba; quien aprueba no ejecuta el pago; nadie aprueba ni recalcula su propio recibo (se deriva a otro aprobador). | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-067 | Anular una liquidación aprobada no pagada revierte asiento, saldos de planes de descuento y vacaciones liquidadas; pagada, solo por rectificativa. | Todos | Adoptada · Mejorar | M16 §6.4 |
| RN-SUE-068 | Reapertura de un período cerrado requiere aprobación y motivo; se audita; un período con LSD presentado no se reabre: se usa rectificativa. | Todos | Adoptada · Reemplazar | M16 §6.4 |
| RN-SUE-069 | No puede haber dos tramos solapados de escala de Ganancias del mismo tipo, año y mes, ni dos tramos de deducciones del mismo tipo, año y mes. La carga anual genera los meses con importes acumulados… | Todos | Adoptada · Replicar | M16 §6.5 |
| RN-SUE-070 | Inicio del acumulado de Ganancias: 1 de enero, o diciembre del año anterior / febrero según PRM-SUE-001; si la tabla define un mes desde para la remuneración bruta, se usa ese mes. | Todos | A validar · Replicar | M16 §6.5 |
| RN-SUE-071 | Procede la retención si la remuneración bruta (promedio de los meses con recibo, sumando otros empleos, con prorrateo por doceavas de los recibos «prorratear») supera el mínimo de la tabla vigente… | Todos | A validar · Mejorar | M16 §6.5 |
| RN-SUE-072 | Cálculo acumulativo: retención del mes = impuesto determinado sobre la ganancia neta acumulada a la fecha − retenciones acumuladas; si es negativo, devolución. | Todos | Adoptada · Replicar | M16 §6.5 |
| RN-SUE-073 | La deducción por hijos considera el porcentaje informado en F.572 y la condición (menor, incapacitado) por año. | Todos | Adoptada · Replicar | M16 §6.5 |
| RN-SUE-074 | Liquidación anual al cierre del período fiscal o al egreso; formulario informativo para el empleado y archivo para ARCA con CUIT de la empresa empleadora (no un CUIT único del tenant). | Todos | A validar · Mejorar | M16 §6.5 |
| RN-SUE-075 | Base imponible de aportes y contribuciones topeada con el máximo vigente (distinto en meses con SAC: junio y diciembre) y con mínimo; ambos de tabla oficial. | Todos | Adoptada · Reemplazar | M16 §6.5 |
| RN-SUE-076 | El archivo SICOSS toma los importes por clasificación SICOSS de cada concepto y los datos del empleado del período (situaciones de revista, obra social, adherentes, zona, condición, actividad… | Todos | Adoptada · Replicar | M16 §6.5 |
| RN-SUE-077 | LSD: registros 01 (datos de referencia), 02 (datos del trabajador por liquidación), 03 (conceptos), 04 (datos para cálculo de la DJ F.931) y 05 (otros) según el diseño vigente; con PRM-SUE-019 se… | Todos | A validar · Replicar | M16 §6.5 |
| RN-SUE-078 | SICORE de sueldos informa las retenciones de Ganancias del mes por empleado con régimen e impuesto de la tabla oficial; sujetos retenidos con CUIL. | Todos | A validar · Replicar | M16 §6.5 |
| RN-SUE-079 | Archivo regional de Luz y Fuerza: exige CUIL de 11 dígitos; por empleado informa remunerativo, no remunerativo sin anticipos, SAC, horas extra y aporte; aporte sindical = (remunerativo − conceptos… | Todos | A validar · Mejorar | M16 §6.5 |
| RN-SUE-080 | El sistema calcula aportes y contribuciones para el asiento y el control; la presentación del F.931 se hace en ARCA con el archivo generado y el acuse se carga en el sistema. | Todos | A validar · Mejorar | M16 §6.5 |
| RN-SUE-081 | No se envían a firma recibos con estado de firma distinto de «sin firmar»/«rechazado por error técnico» ni los que ya están en un lote de firma abierto. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-082 | El portal muestra recibos firmados por el empleador; con PRM-SUE-016 también los no firmados digitalmente. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-083 | Se puede notificar al empleado un recibo pendiente de firma; recordatorios cada N días hasta la firma o la no conformidad. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-084 | La no conformidad del empleado registra observación y deja el recibo «firmado en disconformidad»; no impide el pago. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-085 | Pago: la solicitud a M14 lleva un renglón por empleado y cuenta; el empleado **no** se da de alta como proveedor; los adelantos ya pagados se descuentan en el recibo, no en la orden de pago. | Todos | A validar · Reemplazar | M16 §6.6 |
| RN-SUE-086 | Con PRM-SUE-008 la fecha de transferencia del pago es modificable; con PRM-SUE-009 se pide la fecha de pago si no existe. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-087 | Resolución de cuentas contables de sueldos: regla personalizada con más coincidencias de filtros → cuenta del concepto → cuenta de la empresa (contribuciones o general) → cuenta del sindicato… | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-088 | El asiento de sueldos se genera en línea al aprobar la liquidación (evento), con vínculo liquidación ↔ asiento y reversión automática al anular; formato resumido por cuenta, por centro de costo o… | Todos | Adoptada · Reemplazar | M16 §6.6 |
| RN-SUE-089 | La distribución por centros de costo usa los decimales de M15 y ajusta la diferencia de redondeo en el centro de mayor porcentaje. | Todos | Adoptada · Replicar | M16 §6.6 |
| RN-SUE-090 | Una liquidación externa se identifica por empresa + período + tipo + referencia y por hash del archivo; duplicado o total no coincidente detiene la importación. | Todos | Adoptada · Nuevo | M16 §6.6 |
| RN-SUE-091 | Para una empresa y período, liquidación propia e importada son mutuamente excluyentes. | Todos | Adoptada · Nuevo | M16 §6.6 |
| RN-SUE-092 | Los informes de compras y previsiones de pago no muestran pagos de haberes ni datos de empleados a usuarios sin `sue.remuneraciones.ver`. | Todos | Adoptada · Reemplazar | M16 §6.6 |
| RN-SUE-093 | Los datos sensibles (salud, embargos, sanciones, juicios, discapacidad) no se exponen en BI general, APIs para terceros, muro, bot ni IA. | SAL | Adoptada · Mejorar | M16 §6.6 |
| RN-SUE-094 | Suspensiones disciplinarias: no más de 30 días en un año desde la primera (art. 220 LCT); notificación escrita con causa; generan situación de revista de suspensión y novedad sin goce. | Todos | Adoptada · Nuevo | M16 §6.6 |
| RN-SUE-095 | Tareas extra: total = cantidad × unitario; se generan como novedad del ejecutor en el período de la tarea. | Todos | Adoptada · Replicar | M16 §6.6 |

<a id="catalogo-m17-ins"></a>

### M17 INS — Institucional (52 reglas)

Fuente: [`M17-INS-institucional.md`](../especificacion/anexos/M17-INS-institucional.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-INS-001 | Asociado, titular, cliente, pagador, usuario y empleado son relaciones distintas; la membresía no activa servicios ni la baja de servicio extingue la membresía. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-002 | El número de asociado es único, correlativo y no reutilizable. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-003 | Doble numeración socio/cliente. | Todos | Adoptada · Reemplazar | M17 §6 |
| RN-INS-004 | La persona registrada no es asociado hasta la aprobación. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-005 | Servicios que exigen membresía activa. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-006 | No facturar a ex asociados. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-007 | Egreso con servicios activos. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-008 | Egreso con capital integrado. | Todos | A validar · Mejorar | M17 §6 |
| RN-INS-009 | Egreso de personas sin cuenta. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-010 | Transferencias de cuentas a ex asociados. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-011 | Asociado sin cuentas. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-012 | Un rubro de productos pertenece a un solo rubro de capitalización. | CAP | Adoptada · Replicar | M17 §6 |
| RN-INS-013 | Capitalización automática. | CAP | Adoptada · Replicar | M17 §6 |
| RN-INS-014 | Momento de suscripción e integración. | CAP | Adoptada · Replicar | M17 §6 |
| RN-INS-015 | Integración proporcional al pago. | CAP | Adoptada · Replicar | M17 §6 |
| RN-INS-016 | Registración asincrónica de capital. | Todos | Adoptada · Reemplazar | M17 §6 |
| RN-INS-017 | Registración de integración al cerrar la caja. | CAP | Adoptada · Reemplazar | M17 §6 |
| RN-INS-018 | Exclusión entre emisión y registración de capital. | CAP | Adoptada · Mejorar | M17 §6 |
| RN-INS-019 | Reversión de comprobantes con capital. | CAP | Adoptada · Reemplazar | M17 §6 |
| RN-INS-020 | Ajuste de capital al cambiar un comprobante. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-021 | Deuda de capital para votar. | CAP | A validar · Replicar | M17 §6 |
| RN-INS-022 | Reserva de capital. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-023 | Rescate de acciones. | CAP | A validar · Mejorar | M17 §6 |
| RN-INS-024 | Cierre de capital. | CAP | Adoptada · Replicar | M17 §6 |
| RN-INS-025 | Fecha del movimiento de capital facturado. | Todos | A validar · Replicar | M17 §6 |
| RN-INS-026 | Descripciones de movimientos. | Todos | Adoptada · Reemplazar | M17 §6 |
| RN-INS-027 | Transferencia de capital. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-028 | Límite de reembolso anual y orden. | CAP | A validar · Adoptar | M17 §6 |
| RN-INS-029 | Cuotas sociales iguales e indivisibles; integración mínima al suscribir y plazo máximo de integración. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-030 | Un asociado, un voto, con independencia del capital. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-031 | Fecha límite de alta para votar. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-032 | Solo titulares asisten. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-033 | Versión anterior del padrón. | Todos | Adoptada · Descartar | M17 §6 |
| RN-INS-034 | Fecha de asamblea en el título del padrón. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-035 | Quórum de asamblea. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-036 | Anticipación de la convocatoria y comunicación al INAES. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-037 | Asamblea ordinaria dentro del plazo desde el cierre del ejercicio. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-038 | Asambleas de distrito/delegados cuando el número de asociados supera el umbral. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-039 | Distribución de excedentes. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-040 | Honorarios requieren resolución de asamblea y no son sueldo. | Todos | Adoptada · Adoptar | M17 §6 |
| RN-INS-041 | Actas firmadas son inmutables. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-042 | Mandatos sin superposición; mandatario asociado activo; incompatibilidades. | Todos | A validar · Mejorar | M17 §6 |
| RN-INS-043 | La baja de un servicio no es egreso ni reembolso; cobrar un aporte no es ingreso por consumo. | Todos | Adoptada · Adoptar | M17 §6 |
| RN-INS-044 | El padrón preliminar no certifica validez legal ni reemplaza decisiones de órganos. | Todos | Adoptada · Adoptar | M17 §6 |
| RN-INS-045 | Si cambia una condición de elegibilidad, se conserva la versión previa y se requiere revisión. | Todos | Adoptada · Adoptar | M17 §6 |
| RN-INS-046 | Exportación INAES por lotes. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-047 | Capital anterior en el registro de asociados. | Todos | Adoptada · Replicar | M17 §6 |
| RN-INS-048 | Fallecimiento extingue la membresía; derechohabientes acreditados pueden solicitar el reembolso. | Todos | A validar · Mejorar | M17 §6 |
| RN-INS-049 | Validar deuda en el domicilio al ingresar (anti "cambio de titular para esquivar deuda"). | Todos | Adoptada · Delegar | M17 §6 |
| RN-INS-050 | Reingreso y numeración. | Todos | Adoptada · Mejorar | M17 §6 |
| RN-INS-051 | Un asociado con membresía `suspended` no vota ni es elegible, pero conserva capital y antigüedad. | Todos | A validar · Adoptar | M17 §6 |
| RN-INS-052 | Importes con `Decimal128`; capital en ARS salvo configuración. | Todos | Adoptada · Adoptar | M17 §6 |

<a id="catalogo-m18-soc"></a>

### M18 SOC — Servicios sociales y flota (56 reglas)

Fuente: [`M18-SOC-servicios-sociales-flota.md`](../especificacion/anexos/M18-SOC-servicios-sociales-flota.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-SOC-001 | Condición del adherente según requisitos del servicio (edad, ocupación, vínculo). | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-002 | Adherentes con discapacidad quedan fuera de la baja por condición. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-003 | Edad del adherente para tarifa al último día del período. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-004 | Mayoría de edad. | SEP | A validar · Mejorar | M18 §6 |
| RN-SOC-005 | Adherente titular obligatorio. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-006 | Adherente repetido en el mismo servicio. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-007 | Adherente vinculado a otro titular. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-008 | Cascada por desconexión no técnica. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-009 | Reconexión y adherentes. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-010 | Titular fallecido y reconexión. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-011 | Fallecimiento de una persona. | SEP, SAN | Adoptada · Replicar | M18 §6 |
| RN-SOC-012 | Ocultar adherentes fallecidos en la ficha. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-013 | Transferencia de servicio y adherentes. | SEP | Adoptada · Mejorar | M18 §6 |
| RN-SOC-014 | Control de deuda en adherentes. | Todos | A validar · Replicar | M18 §6 |
| RN-SOC-015 | Titular sin servicios que es adherente/beneficiario/garante. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-016 | Alta automática de servicios con adherentes al conectar otro servicio. | ELE, SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-017 | Cantidad de adherentes y categoría. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-018 | Excedente de adherentes. | SEP | Adoptada · Replicar | M18 §6 |
| RN-SOC-019 | Recategorización automática por edad del titular. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-020 | Cobertura a la fecha del evento. | SEP, SAN, SAL | Adoptada · Adoptar | M18 §6 |
| RN-SOC-021 | Carencia. | SEP, SAL | A validar · Adoptar | M18 §6 |
| RN-SOC-022 | La deuda no decide prestaciones sanitarias. | SEP, SAN, SAL | Adoptada · Adoptar | M18 §6 |
| RN-SOC-023 | Unidad de sepultura: un solo derecho vigente; ocupación permanente. | CEM | Adoptada · Adoptar | M18 §6 |
| RN-SOC-024 | Cambiar pagador no transfiere derecho ni elimina ocupación. | CEM | Adoptada · Adoptar | M18 §6 |
| RN-SOC-025 | La mora de cementerio no cancela derechos ni corta otros servicios. | CEM | Adoptada · Adoptar | M18 §6 |
| RN-SOC-026 | Actos de cementerio requieren autorización y documentación. | CEM | A validar · Adoptar | M18 §6 |
| RN-SOC-027 | Capacidad de la unidad. | CEM | Adoptada · Adoptar | M18 §6 |
| RN-SOC-028 | Sin precio por unidad de sangre. | SAN | Adoptada · Adoptar | M18 §6 |
| RN-SOC-029 | Sin aptitud clínica de donantes; edades de donante informativas. | SAN | Adoptada · Mejorar | M18 §6 |
| RN-SOC-030 | Viaje multitramo. | SAL | Adoptada · Replicar | M18 §6 |
| RN-SOC-031 | Edad del trasladado a la fecha del viaje. | SAL | Adoptada · Replicar | M18 §6 |
| RN-SOC-032 | Precio vigente de vivienda. | VIV | Adoptada · Mejorar | M18 §6 |
| RN-SOC-033 | % de aporte por cuota. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-034 | Máximo de aporte anual. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-035 | Aporte superior al máximo. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-036 | Comprobante exclusivo de vivienda. | VIV | A validar · Replicar | M18 §6 |
| RN-SOC-037 | Un plan por cuenta. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-038 | Transferencia de cuotas exige caja abierta. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-039 | Baja solo de planes conectados. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-040 | Comisión y diferencia por rescisión. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-041 | Validación de configuración de vivienda. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-042 | Anulación de cuota descuenta % facturado. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-043 | Vales de vivienda y contabilización a obra por defecto. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-044 | Rubro de proveedor de vivienda exige rubro de productos de construcción. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-045 | Progreso no supera 100 %; materiales no superan asignados salvo autorización. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-046 | Fondo fiduciario por meses adeudados. | VIV | A validar · Pendiente de decisión | M18 §6 |
| RN-SOC-047 | Planes de vivienda no se reconectan. | VIV | Adoptada · Replicar | M18 §6 |
| RN-SOC-048 | Carga de combustible desde factura; anulación libera. | Todos | Adoptada · Replicar | M18 §6 |
| RN-SOC-049 | Posición GPS idempotente por unidad y hora. | Todos | Adoptada · Reemplazar | M18 §6 |
| RN-SOC-050 | Vehículo no apto (documentación vencida, mantenimiento vencido) no se asigna. | SAL | Adoptada · Adoptar | M18 §6 |
| RN-SOC-051 | Dispenser: límite diario y litros por atención; deuda a N días bloquea. | OTR | Adoptada · Replicar | M18 §6 |
| RN-SOC-052 | Servicios candidatos no admiten contratos. | OTR | Adoptada · Adoptar | M18 §6 |
| RN-SOC-053 | Historia sin borrado. | SEP, SAN | Adoptada · Mejorar | M18 §6 |
| RN-SOC-054 | **Carencia de rehabilitación** (HUECO-SEP-01): cuando la cobertura de un contrato estuvo suspendida por mora (condición informada por M08, RN-MOR-143) y se regulariza, las prestaciones no urgentes solo se… | SEP | A validar · Nuevo | M18 §6 |
| RN-SOC-055 | **Aporte del socio impago en banco de sangre** (HUECO-SAN-02): un aporte impago de un convenio con `fundingMode = memberContribution` solo genera la tarea de revisión de RN-MOR-144 (RF-SOC-146); nunca… | SAN | Adoptada · Nuevo | M18 §6 |
| RN-SOC-056 | **Clase de ítem facturable que origina M18** (RN-FAC-156, RF-FAC-176 de M05): cada entrada a facturar que M18 informa (API-SOC-006 `billing-inputs` o el evento que dispara el cargo) lleva `itemClass`: (1)… | SEP, CEM, VIV, OTR | Adoptada · Nuevo | M18 §6 |

<a id="catalogo-m19-por"></a>

### M19 POR — Portal del socio y landing (78 reglas)

Fuente: [`M19-POR-portal-socio-landing.md`](../especificacion/anexos/M19-POR-portal-socio-landing.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-POR-001 | Registrarse crea solo una identidad de acceso con pertenencia al tenant; no crea asociado, titular, cuenta ni contrato. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-002 | La coincidencia de DNI, correo o nombre **no** concede pertenencia ni acceso a una cuenta. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-003 | Conocer un número de cuenta no basta para acceder a información privada; la vinculación exige al menos **dos datos de conocimiento** de documentos de la cuenta o una identidad verificada que coincida… | Todos | A validar · Mejorar | M19 §6 |
| RN-POR-004 | Las respuestas de vinculación, recuperación y consulta pública son genéricas y de tiempo constante (anti-enumeración). | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-005 | Límite de intentos de vinculación: 5 fallidos en 15 min por usuario y 20 por hora por IP; superado, bloqueo de 15 min y alerta de seguridad al usuario. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-006 | Toda nueva vinculación, representación o cambio de alcance se avisa al titular por sus canales verificados con enlace de revocación. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-007 | Cada acceso tiene rol (`titular`, `cotitular`, `representanteLegal`, `autorizado`, `autorizadoConsulta`), acciones permitidas (`consultar`, `pagar`, `gestionar`, `solicitarBaja`, `firmar`), vigencia… | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-008 | La revocación o el vencimiento de un acceso invalidan de inmediato su uso: la siguiente solicitud recibe 403; las URL firmadas emitidas caducan en ≤ 5 min. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-009 | El cambio de ámbito (tenant) o de espacio (socio/empleado) recalcula permisos y purga caché del Service Worker, stores Pinia, IndexedDB del ámbito anterior, descargas en curso y colas locales; los… | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-010 | Los datos del espacio empleado y del espacio socio nunca se mezclan: endpoints distintos (`/api/por/...` vs `/api/por/empleado/...`), stores distintos, menú distinto y alcance `propios` en empleado. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-011 | **Solicitar no equivale a ejecutar**: el estado del servicio solo cambia con el evento del módulo dueño (`cat.contract.activated`, `cat.contract.suspended`, `cat.contract.reactivated`… | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-012 | El estado del trámite y el estado del servicio se presentan **siempre separados**, con etiquetas y colores distintos (ver tabla del §8.9). | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-013 | La solicitud de baja no tiene cargo, no se supedita a registrarse, pagar deuda, aceptar cargos ni responder encuestas; la deuda previa y los documentos históricos se conservan sin ser impedimento. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-014 | Para los servicios marcados en M02 con capacidad "botón de baja" (incluye Internet), la landing recibe la baja sin registro y emite **código identificador dentro de 24 h** por el mismo medio; la… | INT | A validar · Adoptar | M19 §6 |
| RN-POR-015 | El código identificador de baja se genera y muestra **en el momento** de la recepción (cumple holgadamente el plazo) y se reenvía por el medio informado; si el envío falla se genera tarea al operador… | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-016 | La recepción pública no expone datos privados: la respuesta solo incluye el código, la fecha y los datos que aportó el solicitante. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-017 | Una baja pública no identificada se identifica después sin barreras: el operador la vincula al contrato o contacta al solicitante; la fecha de solicitud es la de recepción. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-018 | La baja de un servicio no da de baja el vínculo de asociado. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-019 | Suspensión y reactivación muestran solo costos habilitados y validados para el servicio y la jurisdicción (M08); se registra la aceptación de condiciones con versión y fecha. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-020 | "Reactivado" solo con la confirmación técnica; el pago de un cargo admisible no cambia el estado del servicio. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-021 | Una visita fallida no activa el contrato. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-022 | Los consumos solo se presentan si existe fuente de medición definida; un abono no medido no inventa consumos. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-023 | La reserva de visitas y turnos es atómica en M10/M09: dos reservas simultáneas del último recurso no se confirman ambas. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-024 | Un pago se muestra "Confirmado" solo con evento de M07 (webhook firmado o conciliación); el retorno del navegador desde la pasarela solo muestra "Pendiente de confirmación". | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-025 | Toda creación de checkout, cupón, recarga, adhesión o envío de formulario lleva `Idempotency-Key` (online) o `clientMutationId` (offline); reintentos no duplican. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-026 | Al iniciar el checkout se recalcula la deuda; si cambió respecto de lo mostrado, se informa la diferencia y se rehace la selección (opción "todas las facturas del cupón"). | Todos | A validar · Replicar | M19 §6 |
| RN-POR-027 | El total a pagar no puede ser 0 y debe ser ≥ al importe mínimo configurado. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-028 | No se pagan por el portal facturas bloqueadas ni cuentas bloqueadas para la web; se explica el motivo y el canal alternativo. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-029 | El cupón único vence hoy + N días (si N > 1); al vencer, los recargos se recalculan y se genera uno nuevo. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-030 | Un excedente pagado por un titular o representante no se aplica automáticamente a la deuda de otro titular, aunque compartan domicilio; queda saldo a favor o pendiente según política de M07. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-031 | Pagos parciales de comprobantes agrupados se imputan según la política del tenant (antigüedad, prioridad de servicio o elección del socio); el portal muestra la regla antes de confirmar. | Todos | A validar · Adoptar | M19 §6 |
| RN-POR-032 | Con "diferir intereses", el recargo del pago web es 0 y se factura en el período siguiente (M08). | Todos | A validar · Replicar | M19 §6 |
| RN-POR-033 | Una solicitud de recarga prepaga expira si no se paga en el plazo configurado (600 s por defecto). | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-034 | Recarga prepaga: solo servicios con categoría prepaga y telemedición; rechazada si la cuenta no factura (`NOF_SUM`) o está bloqueada para la web; importe ≥ mínimo de venta; capital = importe −… | ELE | A validar · Replicar | M19 §6 |
| RN-POR-035 | El estado visible de una operación digital solo avanza: generado → pagado → registrado → enviado; nunca retrocede salvo "rechazado" desde generado. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-036 | Tras imputar, se envía factura (prepaga) o recibo (cobranza) con las facturas de intereses generadas, con copia opcional a una casilla del tenant. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-037 | El medio de pago se registra según el resultado de la pasarela: sin identificador externo, efectivo (cupón pagado en red); con identificador, transferencia/tarjeta en la moneda y cuenta de la entidad. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-038 | Las percepciones de IVA e IIBB sobre recargos se calculan con las reglas fiscales vigentes (mínimo imponible, agrupación, discriminación). | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-039 | El portal nunca recibe ni almacena datos completos de tarjeta o CBU fuera del componente tokenizado de la pasarela. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-040 | La adhesión a factura digital exige el medio elegido verificado; la baja de la adhesión es libre e inmediata para el período siguiente no emitido. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-041 | Pago de facturas con débito adherido: no permitir / permitir siempre / permitir solo con recargo de mora. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-042 | DDJJ de artefactos: solo para servicios con plantilla de DDJJ en M02 (PRM-CAT-110: GAS y ELE; en ProCoop, solo energía `COD_SER = 1`); la grilla y la unidad de potencia salen de la plantilla del… | ELE, GAS | Adoptada · Replicar | M19 §6 |
| RN-POR-043 | Adherentes: el servicio debe admitir adherentes; la persona debe existir o se crea con el domicilio del titular; con la regla de adherente único activa, no puede ser adherente del mismo servicio en… | Todos | A validar · Replicar | M19 §6 |
| RN-POR-044 | Conversión de valores del formulario por tipo: texto; número con cultura invariante; fecha ISO; lista (código → descripción); consulta a catálogo permitido (con opción "No registrar"); archivo… | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-045 | Un formulario con "comparar documento" exige que el DNI/CUIL verificado del usuario coincida con el del titular de la persona, cuenta o servicio requerido; si no coincide, se rechaza con mensaje… | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-046 | La ejecución de un formulario invoca un **comando tipado** registrado del módulo dueño; devuelve mensaje, resultado y referencia creada; si es exitoso, la presentación pasa a "aceptada", los adjuntos… | Todos | A validar · Reemplazar | M19 §6 |
| RN-POR-047 | Estados de una presentación: borrador, enviada, observada, aceptada, rechazada, cancelada. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-048 | Cada formulario declara el dato requerido: persona, cuenta o servicio; el asistente exige elegirlo entre los accesos vigentes del usuario (o ninguno para altas). | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-049 | Borradores: guardado automático al cambiar de paso y cada 30 s; vencen a los N días con aviso previo; los adjuntos del borrador viven en almacenamiento privado y se purgan al vencer. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-050 | La expiración de sesión durante un formulario no pierde datos: el reingreso retoma el mismo paso. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-051 | Una publicación solo aparece en la landing si su canal incluye `landing`; copiar una plantilla o cambiar el autor no cambia la audiencia. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-052 | Comentarios y reacciones de socios solo si el tenant y la publicación los habilitan; moderación IA (propone) + humano (decide). | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-053 | Las encuestas nunca bloquean baja, pago, reclamo ni consulta. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-054 | Una comunicación que cumple un hito (constancia de baja, código, intimación) requiere evidencia de entrega; "aceptado por el proveedor" no basta; un fallo genera acción. | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-055 | Avisos comerciales respetan la baja voluntaria del socio; las constancias reguladas y avisos operativos no se pueden desactivar pero sí elegir canal. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-056 | El rol de inicio se calcula en servidor por cuenta seleccionada con prioridad: suspendido > moroso > activo > con baja; sin cuentas: registrado; los roles de empleado y campo se ofrecen como espacios. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-057 | Moroso o suspendido no pierde consulta, pago, reclamo, baja ni descarga de constancias; las nuevas contrataciones siguen la política configurada. | Todos | A validar · Adoptar | M19 §6 |
| RN-POR-058 | Recibos de sueldo: solo los propios; con la opción activa no se descargan antes de firmar; con la otra, no se accede al del mes actual si el anterior no está firmado. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-059 | Los empleados no usuarios del sistema reciben únicamente el perfil de portal del empleado configurado. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-060 | La consulta pública de facturas exige número de cuenta + dato verificador, muestra solo comprobantes impagos con datos enmascarados y tiene límite de consultas por IP. | Todos | A validar · Mejorar | M19 §6 |
| RN-POR-061 | Los PDF se sirven solo por URL firmada de corta vida, ligada a la sesión, nunca por ruta estática pública. | Todos | Adoptada · Reemplazar | M19 §6 |
| RN-POR-062 | Visibilidad de comprobantes: desde la fecha de corte del tenant; solo tipos marcados visibles; comprobantes bloqueados sin PDF si así se configura; historial limitado a N meses en pantalla (el… | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-063 | Si el color de marca no alcanza contraste 4.5:1 (texto) o 3:1 (componentes), se calcula automáticamente un tono accesible para esos usos. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-064 | La IA solo propone (OCR de autolectura, clasificación de reclamos, respuestas del bot); el socio confirma y el operador decide. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-065 | Autolectura: solo servicios habilitados, dentro de la ventana de lectura del ciclo, con foto obligatoria; se valida en M03 como lectura capturada (rango, consumo histórico); el resultado (aceptada… | Todos | A validar · Adoptar | M19 §6 |
| RN-POR-066 | Toda acción del portal registra actor, cuenta, acceso utilizado, IP/dispositivo y `requestId` en la auditoría (T02). | Todos | Adoptada · Mejorar | M19 §6 |
| RN-POR-067 | Una sola versión de landing publicada por tenant; publicar archiva la anterior y permite revertir. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-068 | Un mismo domicilio puede tener varias contrataciones del mismo servicio con titulares distintos; el portal agrupa por cuenta/titular, nunca por domicilio. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-069 | "Ver como socio" desde admin es de solo lectura, exige motivo, queda auditado y no muestra datos de pago tokenizados. | Todos | Adoptada · Reemplazar | M19 §6 |
| RN-POR-070 | Un reclamo técnico genera OT automáticamente solo si el tenant lo configura y la tipología lo requiere. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-071 | Las observaciones internas de casos y órdenes nunca se envían al portal; las observaciones técnicas de la OT se ocultan si se configura. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-072 | Las notificaciones por cuenta tienen vigencia (1 mes por defecto) y estado leído/no leído. | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-073 | Turnos: número correlativo por día y área; con la opción activa, el código visible usa los últimos 3 dígitos del DNI y no se imprime; tiempo estimado por turnos pendientes y boxes abiertos. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-074 | Tótem: dispositivo registrado con caja y sucursal; si la caja del día no está abierta y la política lo permite, se abre automáticamente con observación; el cierre exige clave del dispositivo. | Todos | A validar · Replicar | M19 §6 |
| RN-POR-075 | Teléfono y correo exigidos según el tenant; con reconfirmación activa se piden en cada ingreso; los datos de contacto que el socio actualiza en el portal no se sobrescriben con los del ERP si así se… | Todos | Adoptada · Replicar | M19 §6 |
| RN-POR-076 | Un cambio de datos personales sensibles (DNI, CUIT, titularidad) nunca se aplica desde el portal: genera trámite. Correo, teléfono y preferencias se aplican tras verificación. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-077 | El tenant no puede desactivar restricciones normativas (botón de baja, gratuidad de baja, plazos) por ser administrador. | Todos | Adoptada · Adoptar | M19 §6 |
| RN-POR-078 | Un servicio retirado de la oferta deja de mostrarse para nuevas contrataciones, pero los contratos existentes siguen visibles y operables. | Todos | Adoptada · Adoptar | M19 §6 |

<a id="catalogo-t01-pla"></a>

### T01 PLA — Plataforma SaaS (52 reglas)

Fuente: [`T01-PLA-plataforma-saas.md`](../especificacion/anexos/T01-PLA-plataforma-saas.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-PLA-001 | Unidad de aislamiento = tenant = una cooperativa. Toda operación, documento, reporte, exportación, búsqueda, archivo, job, mensaje e integración pertenece a exactamente un tenant (salvo colecciones… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-002 | El tenant efectivo de un request autenticado es el claim `tid` del token. Si un parámetro de la solicitud referencia otro tenant, se ignora; si referencia un recurso de otro tenant, se responde 404. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-003 | Un usuario con pertenencia a varios tenants elige el ámbito antes de operar; el token se emite para un solo tenant y los permisos se recalculan al cambiarlo (detalle T02, AGR-006). | Todos | Adoptada · Mejorar | T01 §6 |
| RN-PLA-004 | Ninguna consulta a colección de tenant se ejecuta sin contexto de tenant; el error es de desarrollo (falla en pruebas), no se degrada a “todos los tenants”. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-005 | Un índice único de colección de tenant siempre incluye `tenantId` como primer campo: dos tenants pueden tener el mismo número de socio, de comprobante o de caso. | Todos | Adoptada · Replicar | T01 §6 |
| RN-PLA-006 | Los datos de la cooperativa (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) viven en la entidad tenant (identidad) y en T04/M06 (datos fiscales detallados, sucursales, puntos de… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-007 | El CUIT de un tenant de clase `cooperative` en un ambiente es único entre tenants no purgados de ese ambiente; el sandbox de la misma cooperativa vive en otro ambiente y puede repetirlo. | Todos | A validar · Mejorar | T01 §6 |
| RN-PLA-008 | Un módulo solo está disponible si: licencia vigente (fecha actual entre `validFrom` y `validTo`, estado `active`) ∧ activación en modo ≠ `off` ∧ dependencias activas. En `historyReadOnly` solo se… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-009 | La licencia no se deriva de datos técnicos (servidor, base) ni se valida en el cliente. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-010 | Una capacidad pasa a `production` solo con su checklist completo (ítems obligatorios `ok` o `waived` con aprobación) y con el tenant en Listo para habilitar u Operativo. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-011 | Dispensa (`waived`) de un ítem obligatorio: solo Aprobador comercial + Seguridad para ítems de seguridad; motivo y vencimiento obligatorios; los ítems `noDemoData` y `productionCredentials` **no**… | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-012 | Suspender un tenant: (a) bloquea nuevas operaciones del personal según `PRM-PLA-003`; (b) pausa jobs programados del tenant salvo los marcados `legalObligation` (p. ej. informes fiscales… | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-013 | Al reactivar, los jobs programados durante la suspensión no se ejecutan en bloque: se listan en la bandeja del tenant para que decida ejecutar, reprogramar o descartar. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-014 | Cerrar un tenant: En cierre (solo lectura, exportación disponible) durante `PRM-PLA-004` días → Cerrado (sin accesos, datos cifrados retenidos) durante `PRM-PLA-005` días → Purgado con certificado… | Todos | A validar · Nuevo | T01 §6 |
| RN-PLA-015 | Un contrato SaaS vencido no suspende automáticamente: genera alerta y tarea comercial; la suspensión es una decisión registrada con motivo. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-016 | Superar un cupo blando genera alerta al tenant y a Comercial; superar un cupo duro aplica la política de la dimensión (PA-PLA-10); nunca bloquea operaciones en curso, cobros, consultas del socio ni… | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-017 | Precios del SaaS: solo se registran si hay decisión comercial expresa; si faltan, el contrato se aprueba con `price: null` y la prefactura muestra “a definir”. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-018 | Acceso de soporte: requiere caso abierto, modo, alcance mínimo, justificación y vencimiento ≤ `PRM-PLA-009`; observar sin datos personales puede iniciarse con aprobación de plataforma y notificación… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-019 | En sesión de soporte las capabilities efectivas son la intersección entre el grant y un techo de soporte (nunca `iam.*` de administración de usuarios ni cambio de credenciales de la bóveda, salvo… | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-020 | El vencimiento o revocación de un grant invalida inmediatamente los tokens asociados (lista de revocación en Redis por `supportGrantId`). | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-021 | Break-glass: solo para incidentes P1; dos aprobadores de plataforma distintos del agente; duración ≤ `PRM-PLA-011`; notificación inmediata al administrador del tenant; revisión posterior obligatoria. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-022 | Restaurar no altera hechos externos confirmados: si tras el punto restaurado existen CAE, pagos confirmados o mensajes enviados (registro `integrationOperations` de T06 (antes `externalOperations`) y… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-023 | Una restauración completa de un tenant pone al tenant en mantenimiento (solo lectura, jobs pausados), y al terminar la conciliación lo devuelve a su estado previo. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-024 | La auditoría es de solo agregado: ni las restauraciones ni la purga parcial eliminan eventos de auditoría dentro del período de retención; la purga final del tenant los elimina tras exportarlos. | Todos | Adoptada · Mejorar | T01 §6 |
| RN-PLA-025 | Toda operación económica o de integración recibe `Idempotency-Key`; la clave se guarda por `{tenantId, scope, key}` con hash del request: mismo hash → misma respuesta; hash distinto → 422. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-026 | Un evento se publica solo si su transacción confirma (outbox); un consumidor registra `inboxReceipts {consumer, eventId}` en la misma transacción que su efecto. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-027 | Reintentos de eventos y jobs con backoff exponencial y jitter hasta `PRM-PLA-027`/`PRM-PLA-028`; agotados, pasan a `deadLetters` y alerta; nunca se descartan en silencio. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-028 | Un job recibe siempre `tenantId` (o `scope: 'platform'` declarado); los jobs “por todos los tenants” se implementan como *fan-out*: un job planificador global encola un job por tenant activo con el… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-029 | Concurrencia máxima por tenant y cola: si un tenant tiene `PRM-PLA-023` jobs activos en `batch`, sus siguientes jobs esperan aunque haya workers libres; otros tenants no esperan por él. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-030 | Archivos: clasificación obligatoria (`publicBrand`, `internal`, `personal`, `fiscal`, `backup`); solo `publicBrand` (logos, splash, íconos de la PWA, imágenes de landing publicadas) puede servirse… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-031 | Todo archivo subido pasa por verificación de tipo real (magic bytes), tamaño máximo y antivirus antes de quedar disponible (`scanStatus: clean`). | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-032 | La IA del alta y de cualquier módulo solo propone; la confirmación es humana y queda auditada con la propuesta original. | Todos | Adoptada · Replicar | T01 §6 |
| RN-PLA-033 | Las colas de alta prioridad (cobro, pasarelas) tienen workers reservados que no atienden colas `batch`/`export`. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-034 | Ningún ambiente no productivo tiene credenciales productivas de terceros; ningún productivo tiene seeds de demo; el ambiente activo se muestra con banda visible en no productivos (“PRUEBA”, “DEMO”). | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-035 | Promoción de configuración sandbox → producción solo mediante paquete versionado y publicación con aprobación (T04); nunca copia directa de base. | Todos | Adoptada · Nuevo | T01 §6 |
| RN-PLA-036 | Una misma versión de código en todos los tenants del ambiente; las diferencias funcionales entre tenants se expresan con licencias, activaciones, configuración y feature flags, nunca con ramas por… | Todos | A validar · Reemplazar | T01 §6 |
| RN-PLA-037 | Migraciones de esquema idempotentes, registradas en `migrations`, ejecutadas por el pipeline antes de activar la nueva versión; el catálogo de parámetros también se migra por scripts idempotentes… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-038 | Ninguna funcionalidad se invoca por nombre de tipo/ensamblado; todo comando del menú es una ruta declarada (siteMap) con capability. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-039 | Las tareas de fondo que antes corrían en la cooperativa (servicio Windows) corren en la plataforma: cada tarea es un job del módulo dueño, con frecuencia configurable por tenant y monitoreo central. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-040 | La sincronización con bases externas para portal/app desaparece: portal y app consumen la misma API. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-041 | Transferencias de archivos con entes por SFTP o API con registro de cada envío (detalle en T06). | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-042 | La plataforma no ejecuta en el puesto del usuario ningún componente de gestión; el único software local admitido es el **agente de hardware** (impresoras fiscales, lectores, turnero), registrado por… | Todos | Adoptada · Mejorar | T01 §6 |
| RN-PLA-043 | La edición concurrente se resuelve con control optimista (`version`) y respuesta 409 con los cambios del otro usuario; no hay bloqueo de filas persistente. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-044 | La integridad referencial entre módulos la garantiza el módulo dueño (validación en su servicio y eventos), no reglas genéricas configurables en tabla. | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-045 | Cada módulo es dueño exclusivo de sus colecciones; los demás solicitan acciones (comandos de su `index.js`) o consultan proyecciones; nadie escribe estados ajenos. Cerrar un ticket no cambia un… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-046 | Responsables de dato por solución (AGR §5.1): contratación decide sobre contratos (M01/M02), operación confirma actuaciones técnicas (M10), facturación emite documentos (M05), cuenta corriente aplica… | Todos | Adoptada · Adoptar | T01 §6 |
| RN-PLA-047 | El intento fallido relevante se registra distinguido del cambio confirmado; no se confirma un cambio sin su evidencia auditable (transacción con auditoría y outbox). | Todos | Adoptada · Adoptar | T01 §6 |
| RN-PLA-048 | La identidad de acceso es común; los registros de personas/asociados de cada cooperativa permanecen privados y no se fusionan entre tenants por correo o DNI sin acción autorizada. | Todos | Adoptada · Adoptar | T01 §6 |
| RN-PLA-049 | La contraseña SQL, las credenciales SMTP, de publicación web y de prepaga nunca residen en un archivo del puesto; los secretos de tenant viven en la bóveda (T06) y los de plataforma en el gestor de… | Todos | Adoptada · Reemplazar | T01 §6 |
| RN-PLA-050 | Los datos personales de la DEMO de ProCoop no se transcriben ni se cargan en ningún ambiente; la precarga usa datos ficticios. | Todos | Adoptada · Adoptar | T01 §6 |
| RN-PLA-051 | Una copia entre tenants requiere una autorización vigente del tenant origen con alcance que cubra lo copiado; sin ella no hay lectura del origen. La copia nunca transporta datos personales ni datos… | Todos | Adoptada · Adoptar | T01 §6 |
| RN-PLA-052 | Una plantilla de plataforma no contiene precios, importes ni condiciones reguladas, ni referencias a tenants; la adopción crea una copia independiente del tenant. | Todos | Adoptada · Adoptar | T01 §6 |

<a id="catalogo-t02-iam"></a>

### T02 IAM — Identidad, roles y auditoría (56 reglas)

Fuente: [`T02-IAM-identidad-roles-auditoria.md`](../especificacion/anexos/T02-IAM-identidad-roles-auditoria.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-IAM-001 | El tenant de una operación es el `tid` del token; cualquier `tenantId` en body, query o header se ignora; recursos de otro tenant responden 404. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-002 | Una identidad = una persona humana. No se comparten credenciales entre personas; los usuarios genéricos ("caja1") no existen: cada puesto lo usa su persona. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-003 | El correo primario de la identidad es único globalmente y debe verificarse antes de usarse para recuperación; el teléfono no es único (puede ser familiar). | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-004 | El alias de staff (`username`) es único dentro del tenant; el login staff acepta alias (en el tenant del pre-login) o correo. | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-005 | El login de socio resuelve DNI/CUIT → persona del tenant (M01) → pertenencia portal → identidad. Si la persona no tiene pertenencia portal, la respuesta es la misma que credencial inválida. | Todos | A validar · Mejorar | T02 §6 |
| RN-IAM-006 | Las contraseñas se guardan con **argon2id** (parámetros OWASP vigentes) o bcrypt costo ≥ 12 solo como compatibilidad; nunca cifrado reversible. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-007 | No existen contraseñas maestras, de administrador derivadas de la fecha, precargadas con depurador ni fijas en importadores. Cualquier intento de reintroducirlas falla la revisión de seguridad (T08). | Todos | Adoptada · Descartar | T02 §6 |
| RN-IAM-008 | No existe nivel que saltee controles: el rol T-ADM tiene capabilities explícitas y está sujeto a SoD, auditoría y step-up. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-009 | Bloqueo: `PRM-IAM-011` fallos en `PRM-IAM-012` minutos por identidad → bloqueo `PRM-IAM-013` minutos; el contador se reinicia con login correcto; el desbloqueo por recuperación exige factor si está… | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-010 | Rate limit por IP (`PRM-IAM-016`), por identificador (`PRM-IAM-017`) y por tenant (`PRM-IAM-018`) en endpoints públicos; contadores en Redis con ventana deslizante. | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-011 | Respuestas anti-enumeración: login, recuperación, registro y vinculación responden igual (mensaje y tiempo acotado) exista o no la cuenta; el detalle se envía al correo registrado. | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-012 | OTP: 6 dígitos, hasheado, vigencia `PRM-IAM-021` min, `PRM-IAM-022` intentos, reenvío con espera de `PRM-IAM-023` s, un OTP vigente por propósito; consumir invalida. | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-013 | TOTP RFC 6238 (30 s, 6 dígitos, ventana ±1), semilla cifrada con clave del entorno (KMS), nunca exportable ni visible tras el enrolamiento; reutilización del mismo código en la ventana rechazada. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-014 | Códigos de recuperación: 10 de un solo uso, hasheados, regenerables con step-up; al usar uno se notifica. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-015 | Dispositivo confiable: token aleatorio en cookie `HttpOnly` ligado a identidad; vence en `PRM-IAM-025` días; se revoca al cambiar contraseña, al quitar factores o manualmente; no aplica a roles de… | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-016 | Access token: 15 min; claims `sub` (identityId), `tid`, `mid` (membershipId), `ctx`, `sid` (sessionId), `sep` (sessionEpoch combinado), `azv` (authzVersion), `amr`, `acr`, `auth_time`, `mfa_time`… | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-017 | Refresh: opaco 256 bits, hasheado (SHA-256) en `sessions`, rotación en cada uso, ventana de gracia `PRM-IAM-003` s para carreras del cliente, reutilización fuera de gracia → revocar familia + alerta… | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-018 | `sessionEpoch` existe en identidad (cierra todo) y en pertenencia (cierra todo en un tenant); un token con época menor a la vigente es rechazado. | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-019 | Cliente API único (admin y PWA) con interceptor que agrega Bearer y, ante 401 `token_expired` o `authz_changed`, hace **un único refresh compartido** y reintenta una vez; ante 401 de refresh, cierra… | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-020 | **Regla exacta de combinación (permiso efectivo)**: ver detalle a continuación de esta tabla. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-021 | Pantalla visible ⇔ (pantalla en algún perfil asignado vigente) ∧ (módulo licenciado y activo) ∧ (el usuario tiene al menos una de las `requiredAny` de la pantalla) ∧ (dentro de franja). Ver una… | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-022 | Botones y acciones en UI se muestran solo si `can(capability, recurso)` es verdadero; si la acción es U, el botón se muestra con candado y abre la autorización de supervisor. | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-023 | Asignaciones con `validFrom/validTo`; fuera de vigencia no cuentan. Una asignación temporal (reemplazo de vacaciones) vence sola. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-024 | Franja horaria: se evalúa en zona del tenant; si el usuario tiene varios perfiles, la operación está habilitada si al menos un perfil que contiene la pantalla está en franja; fuera de franja aplica… | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-025 | Socio: alcance `rel` = cuentas donde la persona es titular o tiene relación vigente (M01) que incluya la acción; revocar la relación retira el acceso futuro inmediatamente. | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-026 | Pago de tercero no otorga ver: un hermano que paga la factura del otro (por pago sin login o con relación `pagar`) no ve sus otros contratos ni historial (ESC-01, CU-TIT-01). | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-027 | Compartir domicilio no da acceso: la vinculación de cuentas nunca se ofrece por coincidencia de dirección. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-028 | Representación: cada acción en nombre de otro registra `actor` (quien actuó) y `onBehalfOf` (titular), y verifica relación vigente para esa acción. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-029 | Staff operando sobre registros de su propia persona o cuentas propias (contexto staff): las acciones con marca D o U sobre esos registros exigen otro usuario (autorización de supervisor). | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-030 | Visitante registrado sin cuentas vinculadas solo accede a noticias de visitantes, solicitudes de alta, consultas públicas y vinculación. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-031 | Empleado en portal (C-EMP) se crea automáticamente al existir legajo activo en M16 con correo, si el tenant habilita `PRM-IAM-054`; equivale al perfil de var 41. | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-040 | **Pares SoD estáticos por defecto** (incompatibles en la misma pertenencia): `cmp.proveedores.datosBancarios.editar` × `tes.pagos.ejecutar`; `cmp.ordenes.crear` × `cmp.ordenes.aprobar`… | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-041 | SoD dinámica: para cada objeto, `createdBy`/`requestedBy` ≠ `approvedBy`; quien ejecutó un pago no lo concilia; quien capturó una lectura no aprueba su corrección; el beneficiario de una excepción… | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-042 | Excepción SoD estática: requiere justificación, control compensatorio (p. ej., revisión mensual por T-SIN), aprobador distinto con `iam.sod.excepcionAprobar`, vencimiento máximo `PRM-IAM-057` días y… | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-043 | Autorización en el momento: el supervisor se autentica con contraseña + factor (o aprueba desde su PWA con step-up); la concesión es de **un solo uso**, ligada al hash de (capability, recurso… | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-044 | Autorización diferida: vence en `PRM-IAM-035` horas si no se decide; aprobada, el solicitante tiene `PRM-IAM-036` horas para consumirla; rechazos con motivo obligatorio. | Todos | A validar · Mejorar | T02 §6 |
| RN-IAM-045 | Las autorizaciones no cambian permisos: no otorgan capability al solicitante; solo habilitan esa ejecución. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-046 | Anulación de cobranzas de otro usuario: configurable por tenant (bloquear salvo autorización). | Todos | Adoptada · Replicar | T02 §6 |
| RN-IAM-050 | Soporte: sin acceso vigente, cualquier capability de datos del tenant falla para usuarios de plataforma; con acceso vigente, el token de soporte es distinto (`ctx = support`, `sgid`) y cada acción se… | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-051 | Acceso de emergencia (P-SUP): solo ante incidente declarado, notifica en el momento a T-ADM y P-SEC, máximo `PRM-IAM-071` horas, revisión posterior obligatoria. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-052 | Credenciales API: secreto ≥ 256 bits, prefijo visible para identificación, hasheado; mostrado una vez; vencimiento máximo `PRM-IAM-073` días; dos secretos activos durante rotación; nunca se registra… | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-053 | Scopes de API ⊆ capabilities `X` y ⊆ licencia del tenant; nunca incluyen capabilities S de escritura salvo especificación expresa en T10. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-060 | Auditoría en la **misma transacción** Mongo que el cambio (o en outbox durable en la misma transacción); si la auditoría falla, el cambio no se confirma. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-061 | Diferencias: se guardan solo los campos cambiados (`path`, `before`, `after`); campos `secret` → `[REDACTED]`; campos `sensitive` → valor cifrado visible solo con… | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-062 | Cadena de hash: `hash = SHA-256(prevHash + canonical(event))` por tenant y partición diaria; un job diario sella la partición y guarda el hash final en almacenamiento WORM. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-063 | Lecturas auditadas (por defecto): campos sensibles, fichas de salud/banco de sangre, legajos, exportaciones, informes del catálogo, descargas masivas de comprobantes, búsquedas de personas sin filtro… | SAN, SAL | Adoptada · Mejorar | T02 §6 |
| RN-IAM-064 | Auditoría de mensajes: se registra siempre; no se borra por job (reemplazo de vars 3097/3098 que borraban `AUDIT_MAIL` o la pasaban a histórico); la retención la define T08. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-065 | Exportaciones: requieren capability `exportar` del módulo, se generan como job con archivo en almacenamiento privado y URL firmada de vida corta (`PRM-IAM-082` min); se audita filtro, filas y hash… | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-066 | Control optimista: `version` se incrementa en cada escritura; escrituras sin `version` en documentos editables son rechazadas (400) salvo operaciones atómicas de servidor. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-067 | Presencia de edición: documento `editPresence` con TTL 120 s renovado por heartbeat cada 30 s; solo informativo. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-068 | Errores no controlados: se registran en observabilidad (T08) con `requestId`; nunca se envían a correos personales hardcodeados. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-069 | Certificados TLS se validan siempre (SMTP, APIs, IdP). | Todos | Adoptada · Descartar | T02 §6 |
| RN-IAM-070 | IA: toda invocación se audita aunque falle; con salida insegura o incierta, el caso pasa a supervisión humana y el flujo principal (p. ej., recepción del reclamo) no se bloquea. | Todos | Adoptada · Mejorar | T02 §6 |
| RN-IAM-071 | Contenido (mensajes, adjuntos, fotos, documentos) es dato, nunca instrucción: no puede alterar permisos, tenant ni herramientas disponibles para la IA. | Todos | Adoptada · Adoptar | T02 §6 |
| RN-IAM-072 | Login y logout no disparan backups ni tareas pesadas. | Todos | Adoptada · Reemplazar | T02 §6 |
| RN-IAM-073 | Usuarios demo: solo en ambiente demo aislado, con credenciales aleatorias por despliegue; nunca en producción ni en ambientes expuestos. | Todos | Adoptada · Adoptar | T02 §6 |

<a id="catalogo-t03-uxd"></a>

### T03 UXD — Experiencia, marca y diccionario (68 reglas)

Fuente: [`T03-UXD-experiencia-marca-diccionario.md`](../especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-UXD-001 | **Ningún texto visible fijo**: todo texto de UI se obtiene con `dict(clave, variables)`; las únicas excepciones son datos del negocio (nombres de personas, servicios, conceptos) y contenido libre editorial | Todos | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-002 | **Resolución de texto**: `valor = entradaTenant[clave][canal] ?? entradaTenant[clave]['*'] ?? base[clave][canal] ?? base[clave]['*']`; si todo falla, en producción se muestra el texto base de la clave… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-003 | **Referencias a términos**: una etiqueta puede incluir `{t:<termKey>.<forma>}` (forma `one`, `other`, `title`, `short`) y `{g:<termKey> \| <masculino> \| <femenino>}` para concordancia; se resuelven en… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-004 | **Pluralización**: con categorías CLDR de `es` (`one`, `other`; `many` para números ≥ 1.000.000 se mapea a `other`); el 0 usa `other` salvo que la clave defina `=0` | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-005 | **Variables permitidas**: por clave declaradas en el catálogo (`variables[]`); al editar, la UI rechaza variables no declaradas y exige las obligatorias | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-006 | **Longitud máxima**: por clave (`maxLength`); valores más largos se rechazan; para `short` el límite es 12 caracteres (tabbar) y 24 para botones | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-007 | **Textos protegidos** (`protected: true`) no aceptan entrada de tenant; incluyen todo `fis.*.leyenda`, `legal.*`, `cons.*` (consentimientos), denominaciones de comprobantes ARCA y textos regulatorios | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-008 | **Pares no equivalentes**: declarados en el catálogo (`notEquivalentTo[]`): baja definitiva ≠ suspensión temporal; cuenta ≠ contrato ≠ suministro; asociado ≠ titular ≠ usuario registrado; factura ≠ resumen… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-009 | Los **contenidos del diccionario son texto plano**: se escapan al renderizar; no admiten HTML, scripts ni Markdown salvo claves tipo `help` (Markdown restringido sin HTML ni enlaces externos no… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-010 | **Publicación del diccionario**: los cambios se guardan en borrador; al publicar se crea `dictionaryReleases.version = n+1` inmutable con el snapshot completo de entradas del tenant; los clientes reciben… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-011 | **Auditoría del diccionario**: cada cambio registra autor, fecha, clave, canal, valor anterior y posterior, versión de borrador; cada publicación registra autor, versión, cantidad de claves cambiadas y nota | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-012 | **Evolución del catálogo**: una clave nueva del producto aparece con su base; una clave renombrada (`renamedTo`) migra la personalización; una clave deprecada (`deprecatedAt`) deja de mostrarse en el… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-013 | **Congelamiento en documentos**: todo documento generado (PDF de factura, recibo, constancia, email enviado) guarda `dictReleaseVersion`; reimprimir usa esa versión. Con el motor de PDF de DEC-080… | Todos | A validar · Nuevo | T03 §6 |
| RN-UXD-014 | **Contexto de tenant en caché**: las claves de caché de diccionario y marca incluyen `tenantId` + canal + versión; un job o un render de email resuelve el tenant del destinatario | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-015 | **Marca publicada por defecto**: todo tenant tiene siempre una `tenantBranding` publicada (versión 1 creada en el alta con defaults) | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-016 | **Herencia de recursos de marca**: por canal: `pwa-socio` → `pwa` → `app` → producto; `pwa-empleado` → `pwa` → `app` → producto; `pwa-campo` → `pwa-empleado` → … ; `desktop` → `admin` → producto… | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-017 | **Colores derivados**: a partir de `brand` y `brandAccent` se calculan `-rgb`, `-hover` (±8 % luminancia), `-soft` (12 % alfa), `brandContrast` (texto sobre marca: `#ffffff` o `#111019`, el que dé mayor… | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-018 | **Contraste mínimo**: para usos de texto: si `brand` sobre `--canvas`/`--pwa-bg` < 4,5:1, el texto de marca (enlaces, tabs activas) usa `brandAccessible` (ajuste de luminancia hasta cumplir); el color… | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-019 | **Estados semánticos no personalizables**: `ok`/`warn`/`bad`/`info` no los cambia el tenant, para preservar significado y accesibilidad | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-020 | **Tipografías no personalizables**: por tenant en esta versión | Todos | A validar · Adoptar | T03 §6 |
| RN-UXD-021 | **Tema**: `themePolicy` del tenant (`dark` default, `light`, `user`); si `user`, el usuario elige `dark`/`light`/`system`; login y splash siempre oscuros; `.pwa-mod` siempre oscura | Todos | A validar · Adoptar | T03 §6 |
| RN-UXD-022 | **Visibilidad de ítem de menú**: = `licenciado(tenant, modulo) ∧ activado(tenant, modulo) ∧ tieneCapability(usuario, item.capability) ∧ enPerfilPantallas(usuario, item.id) ∧ ¬ocultoPorTenant(item.id, rol)`… | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-023 | **Ocultar un ítem no quita permisos**: y **mostrar un ítem no otorga acciones**: la API siempre verifica capability, tenant y alcance | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-024 | **Enlace directo**: a una ruta no permitida: la UI muestra `dict:ui.sinPermiso.titulo` (No tenés acceso a esta pantalla) con opción de volver; no revela si el recurso existe | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-025 | **Un único `siteMapGroups`**: cada ítem tiene `id` estable (`SM-*`), `route`, `capability`, `module`, `labelKey`, `iconName`, `keywords[]`, `procoopEquivalents[]`, `flags[]`, `badgeSource?`; agregar una… | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-026 | **Ruteo por rol y estado en la PWA**: socio `pendiente de validación` → `/inicio` con banner de completar requisitos; `activo` → `/inicio`; `con deuda vencida` → `/inicio` con banner de deuda y acceso a… | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-027 | **Bloqueo de escritorio**: el tenant puede impedir que roles de campo usen la PWA en pantallas anchas (fuerza móvil) | Todos | A validar · Adoptar | T03 §6 |
| RN-UXD-028 | **Alta en modal**: en la PWA toda alta se abre en `PwaModal` desde el FAB; en admin las altas simples en modal `md`, compuestas en `lg`/`xl`, y entidades con ficha extensa con modal de datos mínimos + ficha | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-029 | **Fecha visible**: `dd-mm-yyyy`; hora `HH:mm` 24 h; zona del tenant; períodos `mm-yyyy`; nunca formato ISO visible | Todos | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-030 | **Números**: separador de miles `.`, decimal `,`; importes con 2 decimales salvo precisión del concepto; cantidades de consumo con la unidad (`kWh`, `m³`); porcentajes con `%` sin espacio | ELE | Adoptada · Adoptar | T03 §6 |
| RN-UXD-031 | **Errores**: los 4xx se muestran inline (validación) o como toast de error con texto del diccionario `err.<codigo>`; los 5xx muestran `dict:err.generico` + `requestId` copiable; nunca detalle técnico | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-032 | **Notificaciones**: cada `kind` se mapea en `notifKinds`; sin entrada, fallback por prefijo de módulo; sin prefijo, ícono y color `info` | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-033 | **Flags de UI**: evaluación `plataforma > tenant > rol`; un flag apagado por plataforma no puede encenderse en el tenant; cada cambio registra motivo y autor | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-034 | **Leyendas fiscales y normativas**: en documentos y pantallas fiscales son textos protegidos versionados por plataforma (no por tenant) | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-035 | **Recursos de marca públicos vs privados**: logos, íconos, splash, fondo de login, imagen de landing son públicos (sirven antes del login); logo para documentos y cabecera de email también públicos (se… | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-036 | **SVG saneado**: los SVG subidos se sanean (sin scripts, `foreignObject`, eventos ni referencias externas) y se rasterizan para íconos | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-037 | **Manifest dinámico**: `name` = `brandName` (máx. 45), `short_name` = `shortName` (máx. 12), `start_url` según app (`/inicio`, `/trabajo`, `/campo/mi-dia`), `scope` `/`, `display: standalone`… | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-038 | **Tres apps instalables por tenant**: desde la misma PWA: "{shortName}" (socio), "{shortName} Equipo" (empleado), "{shortName} Campo" (campo); el texto del sufijo es clave de diccionario | Todos | A validar · Adoptar | T03 §6 |
| RN-UXD-039 | **Una tarea principal por pantalla**: en la PWA socio: una sola acción primaria visible; acciones secundarias en menú contextual | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-040 | **Separar estado del trámite y del servicio**: toda pantalla que muestre un servicio con trámite en curso presenta dos badges diferentes | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-041 | **No representar solicitud como ejecución**: los textos de confirmación de una solicitud usan siempre `dict:estado.solicitud.*` | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-042 | **La landing pública no expone datos privados**: ningún componente de la landing accede a endpoints autenticados; consultas públicas solo devuelven datos no personales o enmascarados | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-043 | **Contenido interno nunca en landing**: el selector de canales de una noticia impide marcar `landing` si la audiencia es de empleados | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-044 | **Exportaciones**: nombre `{shortName}-{pantallaSlug}-{dd-mm-yyyy-HHmm}.{ext}`; encabezados con labels del tenant; hoja/archivo de metadatos con claves estables, filtros aplicados, usuario, fecha y versión… | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-045 | **Exportar e imprimir**: disponibles en todo listado según capability `<mod>.<recurso>.exportar`; impresión vía PDF generado (no impresión del navegador del DOM). El PDF lo genera el motor único de T11… | Todos | Adoptada · Replicar | T03 §6 |
| RN-UXD-046 | **Skeletons y refresco**: primera carga 3 skeletons; refresco con opacidad 0,6 y lista conservada; error de carga con estado de error y "Reintentar" | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-047 | **Confirmación de acciones destructivas**: con `ConfirmDialog`; acciones económicas irreversibles (anular lote, cerrar ejercicio, emitir lote) piden escribir el identificador | Todos | Adoptada · Mejorar | T03 §6 |
| RN-UXD-048 | **Deshacer**: en descartes no económicos (descartar aviso, quitar fijado, archivar borrador): 6 s | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-049 | **IA solo propone**: todo resultado de IA se muestra como borrador con badge `dict:ui.ia.propuesta` y requiere acción humana para persistir o publicar | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-050 | **Offline**: solo se encolan operaciones de campo y respuestas de encuestas definidas como encolables; nunca login, admin ni operaciones con riesgo de duplicado económico; cada ítem con `clientMutationId`… | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-051 | **Banners**: máximo 2 visibles; prioridad fija (RF-UXD-065); un banner descartable vuelve a mostrarse solo si cambia su condición | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-052 | **Instalación de la app**: se ofrece tras el primer login exitoso y en Perfil; si se descarta, no se repite por 30 días; en iOS muestra pasos de "Agregar a inicio" | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-053 | **Accesos fijados**: máx. 12; un fijado cuyo ítem deja de estar permitido se oculta (no se borra) y reaparece si vuelve el permiso | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-054 | **Vistas guardadas**: privadas por defecto; compartidas por tenant con `uxd.vistas.compartir`; una vista compartida nunca amplía el alcance del que la usa | Todos | Adoptada · Nuevo | T03 §6 |
| RN-UXD-055 | **Ayuda contextual**: base del producto por `screenId`; el tenant puede sobrescribir campos (qué/quién/cuándo/dónde/por qué/cómo/caso) sin perder la base; si la base cambia, el editor avisa | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-056 | **Mapas**: todo componente de mapa tiene alternativa textual (dirección, lista de puntos, coordenadas) y no es obligatorio para completar un trámite | Todos | Adoptada · Adoptar | T03 §6 |
| RN-UXD-057 | **Proveedor de mapas**: configurable por tenant (Google por defecto según BASE §77; OSM/Leaflet como alternativa sin costo); coordenadas iniciales, zoom y tipo de mapa por tenant | Todos | A validar · Replicar | T03 §6 |
| RN-UXD-058 | **Sesión por inactividad**: con aviso previo y conservación de borradores | Todos | Adoptada · Replicar | T03 §6 |
| RN-UXD-059 | **No iniciar calendario/correo al arrancar** (optimización de escritorio) no aplica | Todos | Adoptada · Descartar | T03 §6 |
| RN-UXD-060 | **Renombrar formularios de transición y ABM de incidentes**: se cubre con claves de diccionario `crm.incidente.*` | Todos | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-061 | **Copia local de adjuntos**: en carpeta del usuario no aplica (descarga normal del navegador) | Todos | Adoptada · Descartar | T03 §6 |
| RN-UXD-062 | **Grilla con imágenes en el turnero**: es una opción de presentación del módulo turnero | Todos | Adoptada · Delegar | T03 §6 |
| RN-UXD-063 | **Búsqueda de cuenta por defecto en autogestión** (Asociado / Cuenta / Documento / QR) es parámetro del portal | Todos | Adoptada · Delegar | T03 §6 |
| RN-UXD-064 | **Botón de chat online con soporte**: es un flag de UI del tenant que muestra el acceso al canal de soporte/chat (T01 soporte o M09 chat) | Todos | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-065 | **Cabecera de la página del portal** (texto largo) se reemplaza por bloque editable de la landing/portal (M19) con clave `por.cabecera.texto` como fallback | Todos | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-066 | **Estados visibles del pago web al socio** (`ESTADO_VENTA` 0 generado, 1 pagado, 2 registrado, 3 enviado) se presentan con claves `estado.pagoWeb.*` y solo avanzan | Todos | Adoptada · Replicar | T03 §6 |
| RN-UXD-067 | **Mensajes de rechazo al socio** (ej. "El pago fue rechazado por la entidad", "Los importes de la cobranza no coinciden", "El número de documento del socio … no coincide con lo registrado en CiDi", "El… | ELE | Adoptada · Reemplazar | T03 §6 |
| RN-UXD-068 | **Notificaciones al portal** (`NOTI_COOP`: por cuenta, no leída, vigencia 1 mes, asunto, detalle) se presentan en la bandeja de avisos de la PWA con `notifKinds` y textos del diccionario para… | Todos | Adoptada · Replicar | T03 §6 |

<a id="catalogo-t04-cfg"></a>

### T04 CFG — Configuración y parámetros maestros (55 reglas)

Fuente: [`T04-CFG-configuracion-parametros-maestros.md`](../especificacion/anexos/T04-CFG-configuracion-parametros-maestros.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-CFG-001 | Un parámetro tiene un único tipo y un único significado. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-002 | Leer una clave no declarada es un error. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-003 | El valor efectivo se resuelve con precedencia usuario → categoría → servicio → sucursal → tenant → plataforma → default. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-004 | Ningún parámetro `commercial`, `fiscal` o `security` admite ámbito `user`. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-005 | Todo cambio de configuración vigente se hace por versión; no hay edición directa. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-006 | La publicación es atómica: todos los ítems o ninguno. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-007 | Una versión no pasa validación si deja un plan/servicio visible sin precio vigente, una referencia a entidad inexistente/inactiva/de otro tenant, un `secretRef` faltante para una integración… | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-008 | El autor de una versión sensible no puede aprobarla. | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-009 | Una versión `presentation` pura no exige simulación ni revisión comercial; una `commercial` o `fiscal` exige simulación de los contributors afectados. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-010 | Fecha efectiva en el pasado: solo con aprobación y dentro de PRM-CFG-006 días; nunca reescribe documentos emitidos/cerrados; el módulo dueño genera ajustes. | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-011 | Las claves `periodBoundary` solo rigen desde el inicio del período del módulo (ciclo de facturación, período de lectura). | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-012 | Cada documento económico registra la huella de configuración usada (`valueId`/`configVersionId`). | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-013 | La reversión crea una versión nueva; nunca se borra historia. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-014 | Dos versiones que modifican el mismo ítem: la segunda debe recalcular diff antes de publicar. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-015 | La copia de configuración entre tenants llega como borrador del destino; no copia comunidad, operación ni secretos; no crea vínculo de actualización con el origen. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-016 | Una configuración regulada exige fuente, jurisdicción y vigencia. | GAS | Adoptada · Mejorar | T04 §6 |
| RN-CFG-017 | No se guardan secretos en parámetros ni en documentos de tenant; solo `secretRef`. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-018 | Parámetros de módulos no licenciados se comportan como apagados. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-019 | Booleanos con semántica negativa se invierten al migrar ("No mostrar X" → `mostrarX`). | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-020 | Registros maestros referenciados no se borran: se inactivan o se unifican. | Todos | Adoptada · Replicar | T04 §6 |
| RN-CFG-021 | La unificación redirige todas las referencias antes de marcar el duplicado `merged`; es reanudable. | Todos | A validar · Mejorar | T04 §6 |
| RN-CFG-022 | Un registro de plataforma no lo modifica un tenant; puede agregar atributos propios u overlay donde la tabla lo admita. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-023 | Una actualización de tabla de plataforma que afecta cálculos (fiscal, índices) se aplica según el modo de adopción del tenant; las de referencia (geo, documentos) se aplican siempre. | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-024 | Domicilio de prestación ≠ domicilio personal/fiscal/correspondencia; una persona puede tener varios servicios en una ubicación y prestaciones en ubicaciones diferentes. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-025 | Geocodificar no certifica cobertura, existencia del inmueble, titularidad ni disponibilidad; la posición del dispositivo no es el domicilio contratado. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-026 | No se presenta precisión no disponible; un punto sin coincidencia calle/altura es `approximate` o `inReview`. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-027 | Si la calle no aparece, no se completa con otra calle homónima ni con coordenadas inventadas. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-028 | Confirmar o corregir el punto exige capability `cfg.geo.confirmarPunto` y motivo; queda historia. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-029 | El catálogo nacional de calles se obtiene de fuente oficial abierta; Google se usa para geocodificar y visualizar bajo demanda, sin descarga masiva. | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-030 | Un día es hábil si no es fin de semana configurado ni feriado de algún calendario aplicable al contexto (tenant/sucursal/servicio/localidad). | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-031 | Vencimiento en día inhábil: se aplica la regla del módulo/servicio (siguiente hábil por defecto). | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-032 | Agregar o corregir un feriado no cambia vencimientos de documentos ya emitidos. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-033 | Los cálculos temporales usan la zona horaria del tenant, nunca la del servidor. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-034 | Valor de serie ausente: se aplica la regla declarada por el consumidor (último anterior o exacto); nunca cero. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-035 | La revisión de un valor de índice no borra el anterior; los cálculos ya emitidos no cambian. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-036 | Importes de índices y cotizaciones en `Decimal128`; prohibido `Number`. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-037 | Padrón: para un CUIT y fecha se usa la entrada vigente de mayor fecha de publicación; sin entrada → regla del régimen (M06). | Todos | Adoptada · Replicar | T04 §6 |
| RN-CFG-038 | Código de enumeración inmutable; cambios de etiqueta no afectan datos. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-039 | Campo extra obligatorio nuevo no invalida registros existentes: se exige al editar el registro o se pide valor por defecto para completar en bloque. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-040 | Un campo extra no puede duplicar un campo de primera clase del modelo. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-041 | La personalización de formulario nunca vuelve opcional ni oculta un campo requerido por el negocio o la ley; solo endurece o presenta. | Todos | A validar · Mejorar | T04 §6 |
| RN-CFG-042 | Las vistas guardadas no amplían permisos: solo filtran/presentan datos que el usuario ya puede ver. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-043 | Semillas solo en tenants demo/sandbox; datos marcados y separables. | Todos | A validar · Adoptar | T04 §6 |
| RN-CFG-044 | Los importes de la semilla son ficticios y se rotulan "ilustrativos"; no constituyen condiciones comerciales aprobadas. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-045 | La identidad de la cooperativa (razón social, CUIT, domicilio, IIBB, inicio de actividades, logo) no es parámetro: es perfil del tenant. | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-046 | No se envían errores ni datos a casillas externas desde configuración; la observabilidad es de plataforma. | Todos | Adoptada · Descartar | T04 §6 |
| RN-CFG-047 | Toda tabla CAT de dominio de CFG tiene destino de migración; toda tabla CAT fuera de dominio se delega con nombre de anexo. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-048 | Los PRM-IDs del catálogo T04b se asignan con el código del módulo destino y son los que citan los anexos de módulo; un anexo de módulo que necesite un parámetro sin origen ProCoop lo agrega con su… | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-049 | La configuración de cada servicio es independiente por tenant; no hay herencia viva entre tenants. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-050 | Zonas, barrios y distritos son maestros territoriales sin importes; los cargos por zona se configuran en tarifas (M04). | Todos | Adoptada · Reemplazar | T04 §6 |
| RN-CFG-051 | Siempre existe exactamente una entidad jurídica activa con `isDefault = true` por tenant; no se puede inactivar la entidad por defecto sin marcar antes otra. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-052 | El CUIT de una entidad no se edita después de que la entidad tenga documentos económicos: un CUIT distinto es una entidad nueva (PA-CFG-14). Razón social, domicilio y condición fiscal cambian con… | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-053 | Una entidad jurídica o una sucursal referenciada por documentos no se borra: se inactiva; inactiva no se puede asignar a documentos nuevos. | Todos | Adoptada · Mejorar | T04 §6 |
| RN-CFG-054 | Una sucursal pertenece a una sola entidad jurídica a la vez; cambiarla tiene fecha efectiva y no altera documentos emitidos. | Todos | Adoptada · Adoptar | T04 §6 |
| RN-CFG-055 | La entidad jurídica no es un ámbito del motor de parámetros: lo que varía por entidad se configura en el dueño (M06 perfil fiscal, M15 planes, M16 `employer`) o por servicio (PRM-CFG-040). | Todos | Adoptada · Adoptar | T04 §6 |

<a id="catalogo-t05-dat"></a>

### T05 DAT — Modelo de datos (12 reglas)

Fuente: [`T05-DAT-modelo-datos.md`](../especificacion/anexos/T05-DAT-modelo-datos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-DAT-001 | Toda colección de negocio lleva `tenantId` (ObjectId, obligatorio, inmutable) y todo índice compuesto empieza por `tenantId`. | Todos | Adoptada · Reemplazar | T05 §6 |
| RN-DAT-002 | Ninguna consulta, actualización, borrado ni agregación se ejecuta sin contexto de tenant; el plugin `tenancyPlugin` lo fuerza y rechaza la operación si falta. Solo las colecciones globales de §7.1.3… | Todos | Adoptada · Nuevo | T05 §6 |
| RN-DAT-003 | Un módulo solo escribe sus colecciones (ARQ-01); lee las ajenas por servicio de dominio o proyección, nunca por escritura directa. | Todos | Adoptada · Reemplazar | T05 §6 |
| RN-DAT-004 | Los documentos económicos no se borran ni se editan tras emitirse; se corrigen por contrapartida (NC/ND, reverso, contraasiento, movimiento inverso). | Todos | Adoptada · Mejorar | T05 §6 |
| RN-DAT-005 | Dinero y cantidades físicas en `Decimal128`, operados con `decimal.js`; nunca `Number` de JavaScript. | Todos | Adoptada · Mejorar | T05 §6 |
| RN-DAT-006 | Instantes en UTC (`Date`); fechas de negocio sin hora como texto `YYYY-MM-DD` interpretado en la zona del tenant; períodos como `YYYY-MM`. | Todos | Adoptada · Mejorar | T05 §6 |
| RN-DAT-007 | Referencias por `ObjectId`; los documentos emitidos guardan snapshot de los datos que representan. | Todos | Adoptada · Mejorar | T05 §6 |
| RN-DAT-008 | Todo documento económico o fiscal lleva `legalEntityId` desde O0. | Todos | Adoptada · Replicar | T05 §6 |
| RN-DAT-009 | Todo campo con datos personales declara su categoría con `x-pii`; las categorías `SE` (salud, judicial, sindical) y los datos bancarios completos se cifran por campo. | SAL | Adoptada · Reemplazar | T05 §6 |
| RN-DAT-010 | Ningún secreto (contraseña, token, clave privada, certificado) se guarda en colecciones de negocio: solo `credentialRef`/`vaultRef` a la bóveda de T06. | INT | Adoptada · Reemplazar | T05 §6 |
| RN-DAT-011 | Los arreglos embebidos deben estar acotados por diseño; si pueden crecer sin límite se modelan como colección hija. | Todos | Adoptada · Nuevo | T05 §6 |
| RN-DAT-012 | Cada cambio de esquema que afecte datos existentes se hace por migración versionada, idempotente y en modo expandir/contraer. | Todos | Adoptada · Reemplazar | T05 §6 |

<a id="catalogo-t06-int"></a>

### T06 INT — Integraciones (65 reglas)

Fuente: [`T06-INT-integraciones.md`](../especificacion/anexos/T06-INT-integraciones.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-INT-001 | Frontera de módulos: el conector no escribe colecciones de otros módulos. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-002 | Webhook como disparador y reconsulta autenticada antes de efectos. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-003 | Deduplicación de pagos por id externo. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-004 | Reutilizar link/intención idéntica vigente. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-005 | Antes de reintentar un lote fiscal se consulta el último autorizado. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-006 | Ventana de conciliación de pagos por API. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-007 | Confirmación de QR en caja. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-008 | Sin esperas fijas bloqueantes. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-009 | Confirmación solo por consulta autenticada al proveedor. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-010 | QR estático: una referencia por transacción. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-011 | Importe pagado distinto del recalculado. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-012 | Credenciales por conexión y no por proceso. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-013 | Caché de tokens según `expires_in` con margen. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-014 | Cola de correo con estados y lotes. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-015 | La cola no se traba por concurrencia. | Todos | A validar · Descartar | T06 §6 |
| RN-INT-016 | Error explícito si no se puede tomar un recurso. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-017 | Adjuntos referenciados por clave de almacenamiento. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-018 | Reintento por proveedor alternativo de correo. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-019 | Correo con dominio propio del tenant. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-020 | Clave privada del certificado ARCA cifrada. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-021 | Avisos de vencimiento de certificado. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-022 | TA de WSAA reutilizado hasta vencer, compartido. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-023 | CUIT representado explícito. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-024 | Ambiente que no puede emitir. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-025 | Timeout de WSFE. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-026 | Lotes de SMS. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-027 | Ritmo de WhatsApp y número de destino. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-028 | Débito con tarjeta y día de corte. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-029 | Modo explícito, no por prefijo de clave. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-030 | Deduplicación de movimientos bancarios. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-031 | Conciliación bancaria. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-032 | Avisos del portal y pagos web. | Todos | A validar · Reemplazar | T06 §6 |
| RN-INT-033 | Vencimiento de intención de pago. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-034 | Estados monotónicos. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-035 | Persistencia del resultado. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-036 | Recuperación periódica de pendientes. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-037 | Errores HTTP del proveedor. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-038 | Política de reintento. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-039 | Bitácora de telemedición. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-040 | Comandos remotos sobre el servicio. | INT | Adoptada · Replicar | T06 §6 |
| RN-INT-041 | Validaciones de importadores de rendición. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-042 | Archivo de control de exportaciones. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-043 | Pagos fuera de término. | Todos | Adoptada · Adoptar | T06 §6 |
| RN-INT-044 | Secretos en código. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-045 | Ejecución de SQL arbitrario. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-046 | Trámites web ejecutan procedimientos por nombre. | Todos | A validar · Reemplazar | T06 §6 |
| RN-INT-047 | Claves derivadas de la fecha. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-048 | Clave de mapas. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-049 | Servicios sin autenticación. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-050 | Datos de tarjeta en tótem. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-051 | Secreto en campo de negocio. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-052 | Método HTTP documentado. | Todos | A validar · Otra (ver anexo) | T06 §6 |
| RN-INT-053 | Fecha de pago real. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-054 | Comparar importe siempre. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-055 | Importe por vencimiento. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-056 | Devoluciones por API. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-057 | Contracargos y reversiones. | Todos | Adoptada · Otra (ver anexo) | T06 §6 |
| RN-INT-058 | Actualización automática de componentes locales. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-059 | Interop con Office. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-060 | Renovación de escuchas. | Todos | Adoptada · Descartar | T06 §6 |
| RN-INT-061 | Datos que el proveedor exige por canal. | Todos | Adoptada · Replicar | T06 §6 |
| RN-INT-062 | Webhook vía Integra o Agente. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-063 | Errores de rendición a un mail fijo. | Todos | Adoptada · Mejorar | T06 §6 |
| RN-INT-064 | El incremento por concurrencia no bloquea tablas. | Todos | Adoptada · Reemplazar | T06 §6 |
| RN-INT-065 | Un intento de corte/reconexión no se repite sin verificar. | Todos | Adoptada · Adoptar | T06 §6 |

<a id="catalogo-t07-mig"></a>

### T07 MIG — Migración desde ProCoop (55 reglas)

Fuente: [`T07-MIG-migracion-procoop.md`](../especificacion/anexos/T07-MIG-migracion-procoop.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-MIG-001 | Solo lectura en origen. | Todos | Adoptada · Replicar | T07 §6 |
| RN-MIG-002 | Una cooperativa = un proyecto = un tenant. Varias "empresas" de ProCoop (`EMPRESAS`, `SU_EMPRESAS`) se convierten en razones sociales del mismo tenant salvo decisión distinta. Por DEC-064 son… | Todos | A validar · Reemplazar | T07 §6 |
| RN-MIG-003 | Estrategia por tabla: Migrar vivo, Histórico o No migrar (Descartar/Reemplazado por). Toda tabla se archiva en el snapshot. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-004 | Se migra vivo todo lo necesario para operar el día siguiente al corte: maestros, personas, cuentas, contratos activos y dados de baja con deuda, equipos instalados, tarifas vigentes y las necesarias… | INT | Adoptada · Adoptar | T07 §6 |
| RN-MIG-005 | Tarifas: se migran los cuadros vigentes y los necesarios para reproducir períodos abiertos (refacturación, NC/ND sobre períodos no prescriptos). | TEL | Adoptada · Replicar | T07 §6 |
| RN-MIG-006 | Deuda: documento por documento abierto (no saldo neto), conservando número ProCoop, vencimientos (hasta 4), importes por vencimiento, servicio y período, y conciliación por titular y servicio antes… | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-007 | Comprobante agrupado ProCoop (Grupo Factura): se migra como un documento con renglones por servicio y una obligación por servicio en el auxiliar (FAC-008); si los renglones no permiten asignar un… | Todos | Adoptada · Replicar | T07 §6 |
| RN-MIG-008 | Pagos parciales históricos: el saldo por servicio de un comprobante agrupado se calcula aplicando `IT_PAGSO` (cancelaciones reales). Si ProCoop no discrimina el servicio en el pago, se prorratea… | Todos | A validar · Mejorar | T07 §6 |
| RN-MIG-009 | Anulaciones: un registro en tablas `ANU*` se transforma en estado `voided` del documento original + documento/evento de reversión; nunca se duplica. | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-010 | Versiones: `HIS_*`/`*_HST` se transforman a versiones con `validFrom`/`validTo`; si los rangos se solapan se usa la fecha de registro más reciente y se informa advertencia. | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-011 | `*_EXTRAS` se integran al documento principal (1:1) o a atributos configurables tipados. | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-012 | Campos configurables (`DATOSEXT`/`DATOSETB`, `PROPIEITEMS*`) se migran como definiciones de atributos tipados (T04) + valores. | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-013 | Credenciales y secretos (`TELEMEDICION.PASS_TEL`, `MIKROTIK.CONTRASEÑA`, `INTERBANKING.*SECRET/TOKEN/PASS`, `CORREOS_INTERNOS.PASS`, `FIRMASDIGITALES.CLIENT_SECRET/HASH`, `WS_KEYS.API_KEY`… | INT | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-014 | Persona: se deduplica; titular/cuenta/contrato no. Una persona con dos documentos distintos nunca se fusiona automáticamente. | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-015 | El NIP y el número de titular de ProCoop se conservan como identificadores externos visibles y buscables. | Todos | Adoptada · Replicar | T07 §6 |
| RN-MIG-016 | La condición fiscal de `SUMSOC.COD_SIT` pasa a la persona o al contrato según corresponda: si todas las cuentas de un titular tienen la misma situación → persona; si difieren → contrato con… | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-017 | Estados de servicio ProCoop (`ESTASER`, con `DESCONEC`) se mapean al catálogo de estados de BASE §39.5 mediante mapa de valores aprobado por la cooperativa. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-018 | Zona, sector y recorrido (`SUMSOC`, `CONNRUTA`, `CALLES.RUTA/ORDEN`) se migran a rutas de lectura conservando el orden de lectura. | ELE, AG | Adoptada · Replicar | T07 §6 |
| RN-MIG-019 | Observaciones con bloqueo (`NOTA_SUM.BLO_CAJ`, `MSG_CAJ`) se migran como bloqueos operativos con efecto explícito (bloqueo de cobro en caja, mensaje en caja). | Todos | Adoptada · Mejorar | T07 §6 |
| RN-MIG-020 | Medidores: se migra el medidor instalado con última lectura válida (`MEDSOC.FEC_LEC`, `EST_LEC`), factor multiplicador y dígitos; el historial de cambios como histórico. | ELE, CLO, GAS, ALU | Adoptada · Adoptar | T07 §6 |
| RN-MIG-021 | Lecturas: se migran vivas las lecturas del período abierto y los consumos necesarios para promedios/estimaciones (por defecto 12 períodos); el resto histórico. | ELE | Adoptada · Adoptar | T07 §6 |
| RN-MIG-022 | Prepago: el saldo de crédito prepago vigente por medidor se migra vivo con conciliación contra `PREPAGA` y ventas de recarga; las recargas pendientes de acreditar en el medidor se informan. | ELE | Adoptada · Adoptar | T07 §6 |
| RN-MIG-023 | Intereses de mora devengados al corte: GoodApps los recalcula desde cada vencimiento con las tablas de mora migradas (`TABMORA`, `INDICESMORA`, `MORATAS`, `TRAMASREC`) y la diferencia con ProCoop se… | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-024 | Intereses diferidos (`INT_DIFE` pendientes de facturar) se migran vivos como conceptos a facturar en el próximo comprobante. | Todos | Adoptada · Replicar | T07 §6 |
| RN-MIG-025 | Convenios de refinanciación vigentes (`REC_CON`, `IT_RECCO`) se migran vivos con cuotas pendientes; los cancelados/caídos como histórico. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-026 | Excepciones de mora vigentes (`EXC_MORA` con `VIGENCIA` futura) se migran vivas. | Todos | Adoptada · Replicar | T07 §6 |
| RN-MIG-027 | Notificaciones de mora abiertas (`NOTIFICA` no resueltas, `COMPNOTI`) se migran vivas para conservar la instancia y el código de barras de notificación (tipo 5). | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-028 | Numeración fiscal: el último número autorizado por punto de venta y tipo (`COMPPOS.ULT_NUM`) se toma de ARCA (FECompUltimoAutorizado) en el corte y se compara con ProCoop; si difieren, prevalece ARCA. | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-029 | No puede haber comprobantes ProCoop pendientes de autorizar en ARCA al corte (alerta "Hay facturas electrónicas pendientes de autorizar!"). | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-030 | En la corrida paralela GoodApps no solicita CAE/CAEA, no publica deuda a Red Link/SIRO/Pagos360, no envía notificaciones ni genera asientos oficiales. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-031 | Durante la convivencia cada dominio tiene un único sistema de registro; está prohibido registrar el mismo hecho en ambos (ej. cobrar la misma factura en las dos cajas). | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-032 | Los alias de claves heredadas se mantienen hasta el vencimiento del último comprobante ProCoop más un margen; luego se desactivan (no se borran). | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-033 | Resolución de pagos con clave heredada: solo comprobantes impagos; desempate por vencimiento vigente a la fecha de cobro y luego por el más antiguo; si persisten dos candidatos, pago a cuenta con… | Todos | Adoptada · Mejorar | T07 §6 |
| RN-MIG-034 | Facturas de la migración anterior a ProCoop (`USUARIO = 'MIGRA_SP'` o `= COD_SUM` en LAG) se migran con el alias del código anterior; el criterio de exclusión de ENARGAS se reproduce por marca… | GAS | A validar · Replicar | T07 §6 |
| RN-MIG-035 | Equipos en comodato (`SERSOC_PRODUCTOS`) se migran como equipos asignados a contrato, con número de serie de `PROD_TRH`; el stock del depósito excluye esas unidades. | INT, TV | Adoptada · Adoptar | T07 §6 |
| RN-MIG-036 | Contabilidad: saldos de apertura del ejercicio en curso + asientos del ejercicio en curso vivos/tipados; ejercicios cerrados como histórico. | Todos | A validar · Adoptar | T07 §6 |
| RN-MIG-037 | Sueldos: legajos activos, novedades del período abierto y acumulados del año fiscal y del semestre (SAC, Ganancias, vacaciones) vivos; recibos anteriores históricos tipados. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-038 | Datos sensibles de salud (`AMBULANC`, causas, médicos) se migran cifrados a nivel de campo con acceso restringido. | SAL | A validar · Adoptar | T07 §6 |
| RN-MIG-039 | Una corrida queda en `loaded` solo si 0 rechazos bloqueantes o todos excluidos explícitamente con aprobación. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-040 | Tolerancias de conciliación: cantidades 0 diferencia; importes 0,00 ARS por documento salvo diferencias de redondeo explicadas ≤ 0,01 por documento; totales por dominio 0,00 explicados. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-041 | Segregación: quien ejecuta una corrida no aprueba su conciliación; el corte y el rollback requieren doble aprobación y 2FA. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-042 | Reproceso sobre documento modificado operativamente en GoodApps → conflicto, nunca sobrescritura. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-043 | Las cargas en modo `migration` no disparan eventos externos ni notificaciones; los eventos internos se emiten con `migration: true` para que los consumidores los ignoren o los procesen en modo… | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-044 | Los catálogos normativos nacionales (escalas de Ganancias, salario mínimo, alícuotas IVA, tipos de documento ARCA) no se migran desde la cooperativa: se usan las tablas de plataforma y la copia… | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-045 | Padrones externos (`EMPAFIP`, `IIBB_LUA`) no se migran: se reimportan vigentes desde la fuente oficial (M06). | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-046 | Tablas temporales y de trabajo (`TEMPMODIFBONIF`, `MOROSO_TEMPORAL`, `IMP_WORK`, `BLOQUEO_FILAS`, exportaciones técnicas) no se migran. | Todos | Adoptada · Descartar | T07 §6 |
| RN-MIG-047 | El motor de pantallas y menús de ProCoop (`ENTIDA*`, `MENUSYS`, `FORMULARIOS_PERSONALIZACIONES`, `ABM_VALIDACIONES`) no se migra: se reemplaza por `siteMapGroups`, DataTable con vistas guardadas y… | Todos | Adoptada · Reemplazar | T07 §6 |
| RN-MIG-048 | Las fórmulas embebidas de ProCoop (`CARGOS_ADICIONALES.FORMULA_*`, `SU_CONCEPTOS.FORMULA_*`, `SU_VARIABLES.FORMULA`, `TIP_FIN.FOR_CAL`, `REQUISITOS.*QUERY*`, `TRAMITES_ACCIONES.SCRIPT_ACCION`) se… | Todos | A validar · Reemplazar | T07 §6 |
| RN-MIG-049 | Parámetros V2 (`VARIABLE`) se mapean al catálogo PRM (T04b) por número V2; un V2 sin PRM equivalente se registra para decisión. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-050 | La migración nunca comunica al socio cambios de número de cuenta: los números ProCoop se conservan como número visible de cuenta salvo colisión. | Todos | Adoptada · Adoptar | T07 §6 |
| RN-MIG-051 | **Clasificación de tasas y tributos** (HUECO-TAS-03). Cada fila de `IMPUESTO` y cada clase de `CLASESER` (y de `CON_TASAS` solo si el perfilado encuentra una fila usada en facturación; ver la fila de… | TAS | A validar · Adoptar | T07 §6 |
| RN-MIG-052 | **Contrato de cada vivienda** (HUECO-VIV-03). Cada fila de `VIVIENDAS` (clave `ID_SERSOC`) corresponde a **un único** contrato de M02 del servicio de plan de vivienda: se usa el contrato migrado desde ese… | VIV | A validar · Adoptar | T07 §6 |
| RN-MIG-053 | **Plan de cuotas de obra** (HUECO-OBR-05). Las columnas `SERSOC_EXTRAS.CNT_*` (`CNT_CUOTAS`, `CNT_CUOTAS_PAGAS`, `CNT_UNIDADES`, `CNT_UNIDADES_FACTURADAS`, `CNT_UNIDADES_TOTALES`, `CNT_UNIDADES_ORIGINAL`)… | OBR | Adoptada · Adoptar | T07 §6 |
| RN-MIG-054 | **Adherentes y beneficiarios con destino único** (HUECO-TRV-01, HUECO-SEP-02). `ADHSOC` → `serviceDependents` y `BENSOC` → `serviceBeneficiaries`, ambos de M18; ningún registro de estas tablas va a M01, a… | SEP | Adoptada · Adoptar | T07 §6 |
| RN-MIG-055 | **Conceptos de terceros "Fijos" sin servicio propio** (HUECO-TAS-01). Cada concepto de terceros que ProCoop factura como cargo fijo al inmueble o a la cuenta se migra colgado de un contrato propio del… | TAS | Adoptada · Adoptar | T07 §6 |

<a id="catalogo-t08-nfr"></a>

### T08 NFR — No funcionales y seguridad (27 reglas)

Fuente: [`T08-NFR-no-funcionales-seguridad.md`](../especificacion/anexos/T08-NFR-no-funcionales-seguridad.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-NFR-001 | El tenant de toda operación sale del token o de la identidad técnica del job; nunca de un header, query o body. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-002 | Ninguna consulta, agregación, actualización o borrado sobre una colección de negocio se ejecuta sin `tenantId`; el plugin lanza error y la prueba de CI lo detecta. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-003 | Ningún secreto (contraseña, token, clave, certificado, semilla TOTP, clave de API) se guarda en código, repositorio, logs, auditoría, mensajes de error, URL ni almacenamiento del navegador accesible… | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-004 | No existen contraseñas maestras, contraseñas por defecto fijas, puertas traseras ni credenciales de depuración precargadas en ningún ambiente. | Todos | Adoptada · Descartar | T08 §6 |
| RN-NFR-005 | Un importe se representa como `Decimal128`/`decimal.js`; está prohibido `Number` para importes, tasas, alícuotas y cantidades facturables. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-006 | La suma de las partes es exactamente igual al total en todo documento, distribución y prorrateo; el residuo de redondeo se asigna por el método de mayor resto y queda explicado. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-007 | Toda operación económica o de integración es idempotente por `Idempotency-Key` o por clave natural única; un reintento devuelve el mismo resultado y no repite efectos. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-008 | Una confirmación de pago se acepta solo si la verifica el proveedor por canal servidor-a-servidor o webhook firmado; nunca por importe informado por el cliente o el portal. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-009 | Nunca se almacenan número completo de tarjeta, código de seguridad ni vencimiento; los cobros con tarjeta usan formularios alojados o tokenización del proveedor. | Todos | A validar · Reemplazar | T08 §6 |
| RN-NFR-010 | Ningún dato personal se envía a un proveedor de IA sin acuerdo de tratamiento, evaluación previa y redacción de identificadores; los datos de salud nunca se envían. | SAL | A validar · Mejorar | T08 §6 |
| RN-NFR-011 | Mensajes, adjuntos y documentos son **datos**, no instrucciones: no pueden ampliar permisos, cambiar el tenant ni ejecutar acciones (prevención de inyección de prompt). | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-012 | La IA solo propone; ninguna clasificación de IA produce por sí sola una baja, un cobro, un corte ni una decisión clínica. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-013 | La copia de servicios entre tenants y la reutilización de Connectyx nunca trasladan datos personales, credenciales ni secretos. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-014 | Los datos de ambientes no productivos son ficticios; está prohibido copiar datos reales a desarrollo, pruebas o demostración. La precarga de demostración no existe en producción. | Todos | A validar · Adoptar | T08 §6 |
| RN-NFR-015 | Desde un ambiente no productivo no se pueden emitir comprobantes fiscales reales, cobrar ni enviar mensajes a destinatarios reales: se usan homologación/sandbox y listas de destinatarios permitidos. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-016 | Una restauración no deshace una emisión fiscal, un cobro externo ni un mensaje ya confirmados: los reconcilia desde la evidencia externa antes de reanudar (ESC-04). | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-017 | Los documentos económicos nunca se borran (ni por supresión de datos personales): se anulan, revierten o anonimizan en sus campos no obligatorios cuando vence la conservación. | Todos | A validar · Mejorar | T08 §6 |
| RN-NFR-018 | Las fechas de negocio (períodos, vencimientos, cortes, fecha efectiva) se calculan en la zona horaria del tenant; los instantes se guardan en UTC; la hora del cliente se registra pero no se confía en… | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-019 | Ninguna exportación, API o reporte general incluye datos de salud, datos bancarios completos ni documentos adjuntos salvo permiso explícito y finalidad registrada. | SAL | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-020 | Un cambio persistente no se confirma sin su evento de auditoría en la misma transacción (o mecanismo durable equivalente). | Todos | Adoptada · Mejorar | T08 §6 |
| RN-NFR-021 | Los errores técnicos se registran en la observabilidad interna con redacción de datos personales; nunca se envían por correo a casillas externas ni personales. | Todos | A validar · Reemplazar | T08 §6 |
| RN-NFR-022 | Las migraciones de esquema y de catálogos se ejecutan en el pipeline de despliegue, de forma idempotente, nunca al primer login de un usuario. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-023 | Las actualizaciones de binarios son imágenes inmutables firmadas desde un registro; no se reemplazan archivos en uso ni se descargan ejecutables en tiempo de ejecución. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-024 | Las tareas programadas corren en workers con cola (BullMQ), monitoreo y alertas; no en un ejecutable vigilado por otro proceso ni con `setInterval` dentro del API. | Todos | Adoptada · Reemplazar | T08 §6 |
| RN-NFR-025 | Un tenant no puede degradar a otro: toda carga pesada (lotes, exportaciones, BI, importaciones, IA) pasa por colas con cuota por tenant y prioridad. | Todos | Adoptada · Adoptar | T08 §6 |
| RN-NFR-026 | Ningún enlace público entrega un comprobante o documento personal sin control: solo URLs firmadas de corta duración o enlaces de un solo documento revocables. | Todos | A validar · Reemplazar | T08 §6 |
| RN-NFR-027 | Mostrar un texto visible siempre pasa por el diccionario; si falta la etiqueta personalizada se usa el texto base, nunca la clave técnica vacía. | Todos | Adoptada · Adoptar | T08 §6 |

<a id="catalogo-t09-com"></a>

### T09 COM — Comunidad y comunicaciones (63 reglas)

Fuente: [`T09-COM-comunidad-comunicaciones.md`](../especificacion/anexos/T09-COM-comunidad-comunicaciones.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-COM-001 | Solo la cooperativa y empleados autorizados publican en el muro. | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-002 | Comentarios solo si `tenant.commentsEnabled` **y** `post.commentsEnabled` **y** usuario sin sanción vigente **y** reglas de comunidad aceptadas. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-003 | Una reacción por usuario y publicación; cambiarla reemplaza. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-004 | En modo `ai_assisted`: riesgo `low` y sin regla `review/block` → visible; `medium`/`high` o regla `review` → `pending_review`; regla `block` → rechazado con mensaje al autor; error IA →… | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-005 | N reportes distintos sobre un comentario → ocultamiento preventivo y caso de prioridad alta; reportes del propio autor no cuentan. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-006 | Escalamiento sugerido: 1ª infracción confirmada `warning`; 2ª en 90 días `mute` 7 días; 3ª `comment_ban` 30 días; 4ª `permanent_ban` (propuesta, aplicación humana). | Todos | A validar · Nuevo | T09 §6 |
| RN-COM-007 | Sanciones nunca afectan servicios, facturas, pagos, reclamos ni recepción de transaccionales. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-008 | Evidencia de moderación conservada `PRM-COM-015` días aunque el contenido se oculte o el autor lo borre; eliminación definitiva solo por WFL o por ejercicio de derecho de supresión aprobado (AGR-033). | Todos | A validar · Nuevo | T09 §6 |
| RN-COM-009 | Audiencia efectiva = `clampAudienceToGrant(audiencia, grant del emisor)` recalculado en guardar, publicar y enviar. | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-010 | Publicación `landing` requiere aprobación y no puede tener audiencia distinta de `all`. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-011 | Mención solo a quienes ya pueden ver la publicación; máx. 10; sin auto-mención; sin aviso si el comentario está en revisión. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-012 | Destinatario y canal: tipo ∩ preferencias ∩ consentimiento ∩ contacto válido no suprimido ∩ canal habilitado; vacío → alternativa → `undeliverable` + acción. | Todos | A validar · Mejorar | T09 §6 |
| RN-COM-013 | Número destino por tipo: contacto de la cuenta / de la persona / registrado en portal / todos los móviles; para facturas digitales, el móvil de la cuenta y solo comprobantes electrónicos. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-014 | Estados de cola de email ProCoop: 1 pendiente → 4 en proceso → 2 enviado / 3 error; si otro hilo tomó un mail se cancela el lote; posible bug de bandera `EnviandoMails` que traba la cola. | Todos | A validar · Reemplazar | T09 §6 |
| RN-COM-015 | Despacho en lotes con espera entre lotes. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-016 | Reintento único: destinatarios Yahoo por SMTP con reintento por SES; `ServiceNotAvailable` reintenta una vez. | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-017 | Adjunto inexistente → mail en error (“No se encontró el archivo adjunto”); solo se guardaba el nombre del adjunto. | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-018 | En base DEMO no se envían mails. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-019 | Envío sin auditoría (`EnviarMailSinRegistrar`) y desde XML con clave en texto plano. | Todos | Adoptada · Descartar | T09 §6 |
| RN-COM-020 | Casilla SMTP por módulo (compras, pagos a proveedores, notificaciones a titulares, atención, tickets) con remitente y responder-a. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-021 | No validar certificado SMTP. | Todos | Adoptada · Descartar | T09 §6 |
| RN-COM-022 | SES por SMTP solo puertos 25/587/2587, otro se fuerza a 587. | Todos | Adoptada · Delegar | T09 §6 |
| RN-COM-023 | SMS en lotes de 50 por POST a API del proveedor ProCoop con APIKEY fija; módems GSM propios (`MODEMS`, `ENVIOS`, `RESULTADOS`) con desactivación por errores. | Todos | A validar · Reemplazar | T09 §6 |
| RN-COM-024 | Validez de un SMS en días. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-025 | Errores para desactivar mensaje. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-026 | WhatsApp por Trii o API oficial (3105) con plantillas oficiales; envío manual abriendo `api.whatsapp.com`. | Todos | A validar · Replicar | T09 §6 |
| RN-COM-027 | Texto SMS: validar texto y número (`ValidarTextoYNumeroSMS`), máximo de caracteres (V2 2745). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-028 | Plantilla con variables nulas: ignorar nulos en “Info. Servicio” (V2 2359). | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-029 | Notificación al portal por cuenta con vigencia de 1 mes desde hoy (`NOTI_COOP`). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-030 | Notificaciones de cobranza al registrar pago (V2 2665 facturas, 2664 prepaga; tipo de envío 2674; plantilla recibo 2684; adjuntar notas de débito 2698; copia 2499). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-031 | Notificación a responsables según `RESPONSA_NOTIFICA` (servicio, tipo de orden, operaciones, días, franja, feriados, al generar/al enviar) por canal 3088 (WhatsApp/mail/SMS); plantilla oficial… | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-032 | Aviso de cierre de OT de desconexión por SMS/WhatsApp/mail (`NotificarCierreOt`). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-033 | Tickets: estados con `ENVIARMAIL`, mail de cierre, mail “CambioVencimiento” si el contacto tiene mail y no marcó “no mostrar”, plantillas 2478/2479, avisos internos por `PROMAIL` tipos 1–3. | Todos | A validar · Replicar | T09 §6 |
| RN-COM-034 | Actividades: recordatorio por margen anterior, mail de finalización (`MailActividades.htm`), destinatarios = mails de responsables ∪ mails extra del área. | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-035 | Incidentes: correo a cuenta del incidente (2630), a intervinientes (2631), al titular (2632). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-036 | Aviso de adherente que cumple mayoría de edad a un mail interno (3186/3187). | SEP | Adoptada · Replicar | T09 §6 |
| RN-COM-037 | Recibo de sueldo pendiente de firma notificable (3107; `SU_NOTIFICACIONES`). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-038 | Compras: plantillas de solicitud de cotización (2888) y orden de compra (2905); circulares a proveedores (`CIRCUPRO`). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-039 | Mensaje automático al registrar ventas móviles (VAR_PMOVIL 53: no/SMS/WhatsApp). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-040 | Trámites web: mail de aviso de registro de trámite a casilla (VAR_PMOVIL 49), `EnviarMailAvisoTramite`, mails web para reclamos (804) y contactos (812). | Todos | Adoptada · Reemplazar | T09 §6 |
| RN-COM-041 | Errores del sistema por mail (−1, con dirección personal hardcodeada), errores de rendición (3025), supervisión del Agente (2731), control de backup (3115/3125). | Todos | Adoptada · Reemplazar | T09 §6 |
| RN-COM-042 | Purga de `AUDIT_MAIL` a hora fija o histórico (3097/3098). | Todos | A validar · Reemplazar | T09 §6 |
| RN-COM-043 | Identificación del cliente ante el gateway del proveedor por razón social/CUIT (518/519) y servicio Procoop (2426). | Todos | Adoptada · Descartar | T09 §6 |
| RN-COM-044 | Las comunicaciones editoriales no sustituyen tickets ni avisos de un caso. | Todos | Adoptada · Informado | T09 §6 |
| RN-COM-045 | No declarar notificado al asociado por encolar; fallo de entrega produce acción visible. | Todos | Adoptada · Informado | T09 §6 |
| RN-COM-046 | Una intimación o constancia de baja no se considera cumplida solo porque el proveedor aceptó el envío; el módulo dueño define el estado exigido. | Todos | A validar · Adoptar | T09 §6 |
| RN-COM-047 | Encuesta no respondida no bloquea activación; sincronización repetida no genera otra encuesta. | Todos | Adoptada · Informado | T09 §6 |
| RN-COM-048 | Consulta no vinculante nunca produce efectos institucionales; leyenda obligatoria. | Todos | A validar · Adoptar | T09 §6 |
| RN-COM-049 | Un voto por elector (persona asociada por defecto); anonimato real: si `anonymous`, la respuesta no guarda `userId` sino un hash irreversible con sal por encuesta para unicidad. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-050 | Encuesta externa: token firmado por encuesta, una respuesta por `guestKey`, rate limit por IP, captcha si supera umbral. | Todos | Adoptada · Mejorar | T09 §6 |
| RN-COM-051 | Probabilidad de aparición: selección pseudoaleatoria reproducible (semilla = encuestaId + personaId). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-052 | Inscripción a evento sobre cupo → lista de espera; liberación promueve al siguiente y notifica. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-053 | Código de beneficio: único, de un uso, vence con el beneficio. | Todos | Adoptada · Nuevo | T09 §6 |
| RN-COM-054 | Horarios de no molestar aplican a `community`, `marketing`, `operational` no urgentes; exentos `security`, `service_outage` urgente, `regulatory` con plazo. | Todos | A validar · Adoptar | T09 §6 |
| RN-COM-055 | Tope de campañas por destinatario por día/semana (salvo `service_outage`). | Todos | Adoptada · Adoptar | T09 §6 |
| RN-COM-056 | Agrupación de envíos de facturación (por cuenta 2423; por socio 2635; WhatsApp por socio 2954, por cuenta 2955, por socio+teléfono 3051). | Todos | A validar · Replicar | T09 §6 |
| RN-COM-057 | Adjuntar archivo de factura electrónica en el mail (539). | Todos | Adoptada · Replicar | T09 §6 |
| RN-COM-058 | Costo de envío de notificación de mora como comprobante (295/296). | Todos | Adoptada · Delegar | T09 §6 |
| RN-COM-059 | Datos sensibles nunca en muro, campañas ni BI general. | SEP, SAN, SAL | Adoptada · Informado | T09 §6 |
| RN-COM-060 | La comunicación conserva el texto renderizado y la versión de plantilla y diccionario; cambios posteriores no la alteran. | Todos | Adoptada · Adoptar | T09 §6 |
| RN-COM-061 | Ambiente DEMO/sandbox: ningún mensaje sale a destinatarios reales; datos de precarga ficticios (CNX §10 V-13). | Todos | Adoptada · Adoptar | T09 §6 |
| RN-COM-062 | Copia de configuración entre tenants copia plantillas, tipos, reglas de moderación y plantillas de encuesta como definición; nunca respuestas, comunicaciones, consentimientos ni conectores. | Todos | Adoptada · Informado | T09 §6 |
| RN-COM-063 | Recorte de canal por estado de la cuenta: para socios con servicio dado de baja, solo transaccionales de deuda/baja y regulatorias; las campañas `community` siguen si es asociado activo. | Todos | Adoptada · Adoptar | T09 §6 |

<a id="catalogo-t10-bia"></a>

### T10 BIA — Reportes, BI y APIs (57 reglas)

Fuente: [`T10-BIA-reportes-bi-apis.md`](../especificacion/anexos/T10-BIA-reportes-bi-apis.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-BIA-001 | Un reporte es de sólo lectura: nunca modifica datos ni parámetros. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-002 | Aislamiento por tenant en consulta, caché, archivos, jobs, programaciones, IA, API y almacén analítico; el `tenantId` sale del token. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-003 | Permiso efectivo = capability del reporte ∩ alcance; los totales se calculan sólo sobre lo visible; no se informa cuántas filas se ocultaron. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-004 | Todo reporte declara universo, período, tipo de fecha, fecha de corte, fórmula de sus totales y granularidad (BASE §30). | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-005 | Los reportes históricos usan la versión de tarifa, categoría, alícuota y configuración vigente a la fecha del documento, no la actual. | Todos | A validar · Reemplazar | T10 §6 |
| RN-BIA-006 | Saldos "a una fecha" = Σ movimientos del auxiliar con fecha efectiva ≤ corte (y, si se pide, `recordedAt` ≤ fecha de registro). | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-007 | Semántica única: Facturado, Cobrado, Acreditado, Saldo, En proceso (§15.1). | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-008 | No duplicar: un resumen de cuenta no suma con sus facturas; filas por concepto no suman con el total de factura; cada dataset declara su granularidad y medidas aditivas. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-009 | Pagos en proceso o no confirmados se informan separados de los confirmados. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-010 | Variación porcentual = (actual − base) / \|base\| × 100. Si ambos son 0 → 0 %. Si base = 0 y actual ≠ 0 → valor nulo con marca "nuevo" (o "sin base"). | Todos | A validar · Mejorar | T10 §6 |
| RN-BIA-011 | Redondeo: los importes de documentos se suman con el valor almacenado; los ratios se calculan con Decimal exacto y se redondean al mostrar (half-even, 2 decimales en %, 1 decimal en días). | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-012 | Parámetros de fecha obligatorios donde el reporte lo requiera; rango máximo síncrono `PRM-BIA-002` meses. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-013 | Límite síncrono de `PRM-BIA-004` segundos; pasado ese tiempo la corrida pasa a asíncrona sin perder el trabajo. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-014 | No existe consulta textual ni ejecución de procedimientos; los reportes personalizados sólo combinan campos de datasets certificados. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-015 | Nunca se listan contraseñas, claves web, tokens ni secretos en reportes, exportaciones o API. | Todos | Adoptada · Descartar | T10 §6 |
| RN-BIA-016 | Datos personales enmascarados por defecto; desenmascarar requiere `bia.datos_sensibles.ver` y queda en `reportAccessLogs`. | SAN | Adoptada · Mejorar | T10 §6 |
| RN-BIA-017 | Archivos exportados vencen a los `PRM-BIA-008` días; la URL firmada dura `PRM-BIA-007` minutos; cada descarga revalida permiso. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-018 | Programación: corre con los permisos vigentes del propietario y de cada destinatario; destinatario sin permiso se omite y se registra. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-019 | Envío por email: sólo enlace a la app (requiere login) para reportes con datos personales; adjunto permitido únicamente para reportes marcados `sensitivity=none` y ≤ `PRM-BIA-012` MB. | Todos | A validar · Adoptar | T10 §6 |
| RN-BIA-020 | Simulaciones y escenarios siempre identificados; un indicador real nunca incluye datos de escenarios. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-021 | Un indicador certificado es inmutable; cualquier cambio de fórmula crea versión; los snapshots conservan la versión con que se calcularon y no se recalculan salvo "recalcular histórico" auditado. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-022 | Sin datos → nulo ("sin datos"), nunca cero; denominador 0 → nulo. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-023 | No existen indicadores de demostración con valores aleatorios en producción. | Todos | Adoptada · Descartar | T10 §6 |
| RN-BIA-024 | Semáforo: con sentido "mayor es mejor", ok si valor ≥ óptimo, advertencia si umbral ≤ valor < óptimo, crítico si < umbral; inverso con "menor es mejor". | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-025 | Períodos de tendencia: día, semana ISO, mes calendario del tenant, ciclo de facturación, ejercicio contable. | Todos | A validar · Mejorar | T10 §6 |
| RN-BIA-026 | Indicadores globales de plataforma: sólo agregados por tenant sin datos personales; el detalle requiere acceso de soporte temporal. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-027 | Benchmark: sólo ratios (no montos absolutos), por segmento con ≥ `PRM-BIA-051` tenants participantes y ninguno aportando > 40 % del denominador; cada tenant ve su percentil, mediana y cuartiles. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-028 | IA: sólo responde con números provenientes de una consulta semántica ejecutada y registrada; cita KPI/dataset, universo y corte; no envía datos personales al proveedor; toda sugerencia de acción es… | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-029 | API: el tenant sale de la credencial; un ID de otro tenant responde 404 (no 403) para no revelar existencia. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-030 | API: secretos con hash Argon2id; se muestra una vez; prefijo `gak_` (API key) o `gac_` (client id) visible para soporte; rotación con solapamiento `PRM-BIA-042` horas. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-031 | API: mínimo privilegio; los scopes de escritura y `pii:read` requieren aprobación de `bia.api.clientes.aprobar` y finalidad. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-032 | API: nombres de campos estables en inglés camelCase; importes como string decimal + `currency`; fechas ISO 8601 UTC con `timeZone` del tenant; enums documentados. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-033 | API incremental: `updatedSince` + `cursor` opaco con marca de agua de `PRM-BIA-046` segundos de retraso para no perder transacciones en curso; bajas lógicas y anulaciones se entregan como eventos de… | AG | Adoptada · Adoptar | T10 §6 |
| RN-BIA-034 | Webhooks: firma `HMAC-SHA256(secret, "<timestamp>.<body>")` en cabecera `GoodApps-Signature: t=<unix>,v1=<hex>`; tolerancia `PRM-BIA-047` s; entrega al menos una vez; deduplicar por `eventId`; orden… | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-035 | Payload de webhook "delgado": `eventId`, `type`, `occurredAt`, `resource` (tipo + id + URL) y campos no personales; el tercero obtiene el detalle por la API con sus scopes. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-036 | Revocación de credencial o suspensión de cliente efectiva en ≤ `PRM-BIA-043` s (caché de introspección acotada). | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-037 | Logs de API sin token, secreto ni cuerpo de respuesta; se guarda el prefijo de la credencial. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-038 | Datos del almacén analítico son eventualmente consistentes: toda salida analítica muestra frescura; si la frescura supera `PRM-BIA-031` minutos se avisa en pantalla y se alerta a plataforma. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-039 | Proyecciones idempotentes por `eventId` y `version` del agregado; un evento repetido no duplica hechos. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-040 | Reportes regulatorios y fiscales: BIA no altera el layout oficial; el módulo dueño valida antes de generar y registra presentación y acuse. | Todos | Adoptada · Reemplazar | T10 §6 |
| RN-BIA-041 | Datos abiertos: sólo agregados con n ≥ `PRM-BIA-050` por celda, sin datos personales, con licencia, aprobados y versionados. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-042 | Presets y vistas guardadas nunca amplían permisos: al aplicarlos se interseca con el alcance del usuario y se ocultan columnas no permitidas. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-043 | Personalizar un tablero no cambia definiciones ni lo que ven otros. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-044 | Zona horaria: períodos, "hoy" y cortes se calculan en la zona del tenant (`America/Argentina/Cordoba` por defecto). | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-045 | Una selección enviada al módulo dueño (`selectionToken`) vence en `PRM-BIA-014` minutos y el módulo revalida cada ID y su estado antes de actuar. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-046 | Ranking: N parametrizable 5–500; empates por mismo valor se ordenan por identificador. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-047 | Informes con matriz configurable (`INFOCTD/G/N`) validan antes de ejecutar: categorías del servicio sin fila configurada y filas con tramos superpuestos o con huecos. | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-048 | Cada reporte declara si su fuente es operativa (consulta en vivo al módulo, lectura de secundario) o analítica (almacén); los reportes de control y conciliación son siempre operativos. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-049 | Las exportaciones y API de domicilios y mapas respetan el permiso de domicilios por tenant y relación autorizada. | Todos | Adoptada · Adoptar | T10 §6 |
| RN-BIA-050 | Las consultas de reportes a la base operativa usan `readPreference=secondaryPreferred` con `maxStalenessSeconds` `PRM-BIA-032`, salvo reportes de control que exigen primario. | Todos | Adoptada · Mejorar | T10 §6 |
| RN-BIA-051 | Un reporte con tipo de fecha "pago" separa la fecha de cobro de la de registración; el reporte "cobros con fecha distinta" lista los casos en que difieren más de `PRM-BIA-025` días. | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-052 | Convenios de chequera totalmente pagos se excluyen con "no incluir cancelados" (criterio homogéneo con convenios mensuales). | Todos | A validar · Mejorar | T10 §6 |
| RN-BIA-053 | Reincidencias: grupos con más de una orden por cuenta, cuenta+servicio o cuenta+servicio+operación dentro del rango; ventana configurable. | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-054 | Pérdidas: compra activa = pico + resto + valle; cos φ = cos(atan(reactiva/activa)); pérdida = compra − facturado del período; % = pérdida × 100 / compra. | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-055 | Estadísticas de OT: demora en días desde fecha de la orden y desde fecha de ingreso hasta confirmación o "ahora", piso 0; "período anterior" = mismo filtro con fecha hasta = desde − 1 s sin fecha… | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-056 | Deuda a prescribir = comprobantes con saldo y 1º vencimiento < hoy − `meses de prescripción`, agrupados por cuenta. | Todos | Adoptada · Replicar | T10 §6 |
| RN-BIA-057 | Servicios a cortar: meses de deuda = (hoy − 1º vencimiento más antiguo impago) / 30. | Todos | Adoptada · Mejorar | T10 §6 |

<a id="catalogo-t11-wfl"></a>

### T11 WFL — Workflow, eventos y documentos (57 reglas)

Fuente: [`T11-WFL-workflow-eventos-documentos.md`](../especificacion/anexos/T11-WFL-workflow-eventos-documentos.md).

| ID | Regla | Servicios | Estado | Fuente |
|---|---|---|---|---|
| RN-WFL-001 | Un evento se publica solo si la transacción del cambio confirma; nunca se publica "antes" ni "por las dudas". | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-002 | Los eventos son inmutables; una corrección se expresa con un evento nuevo (`.corrected`, `.reversed`, `.voided`), nunca editando el anterior. | Todos | Adoptada · Nuevo | T11 §6.1 |
| RN-WFL-003 | Un consumidor no escribe colecciones de otro módulo: si necesita un efecto ajeno, invoca un comando de `index.js` del dueño. | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-004 | Un consumidor que falla `PRM-PLA-027` veces envía el evento a `deadLetters` (T01); si el tipo está marcado `businessImpact`, se crea además un ítem de bandeja operativa para el rol responsable… | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-005 | Los payloads `public` no contienen datos personales; los `internal` solo los imprescindibles y declarados en el esquema con `piiLevel`. | Todos | Adoptada · Nuevo | T11 §6.1 |
| RN-WFL-006 | Un evento con `schemaVersion` no soportada por el consumidor se rechaza a la bandeja operativa; no se interpreta "lo que se pueda". | Todos | Adoptada · Nuevo | T11 §6.1 |
| RN-WFL-007 | Un job programado no corre fuera de su ventana: si el disparo cae fuera (por ejemplo, tras una caída), se ejecuta al abrirse la próxima ventana o se omite si `skipIfMissed`. | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-008 | Dos ejecuciones del mismo job con la misma clave de negocio no corren en paralelo para un tenant (clave única parcial de `jobRuns`). | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-009 | Un tenant suspendido o en mantenimiento no ejecuta jobs programados; los jobs en curso pausan en el próximo punto de control. | Todos | Adoptada · Nuevo | T11 §6.1 |
| RN-WFL-010 | Las corridas masivas congelan su universo al prepararse; cambios posteriores del universo no entran salvo nueva versión del universo. | Todos | Adoptada · Mejorar | T11 §6.1 |
| RN-WFL-011 | Una corrida con más de `PRM-WFL-008` % de excepciones del mismo motivo en los primeros `PRM-WFL-009` ítems se pausa por sospecha de fallo global. | Todos | Adoptada · Nuevo | T11 §6.1 |
| RN-WFL-012 | La programación de jobs se expresa siempre en hora local del tenant y se guarda con su zona; los cambios de horario oficial no desplazan la hora local de ejecución. | Todos | Adoptada · Reemplazar | T11 §6.1 |
| RN-WFL-020 | Una operación sensible no produce efecto alguno antes de su aprobación; las lecturas pueden mostrar la intención como marca. | Todos | A validar · Mejorar | T11 §6.2 |
| RN-WFL-021 | Una operación aprobada se ejecuta una sola vez: la clave de idempotencia es `operationId` y el módulo dueño la registra en su efecto. | Todos | Adoptada · Nuevo | T11 §6.2 |
| RN-WFL-022 | El resultado de una operación con efecto externo desconocido es `uncertain`; no se reintenta el envío sin consultar antes. | Todos | Adoptada · Reemplazar | T11 §6.2 |
| RN-WFL-023 | Una operación en lote se aprueba como unidad, pero se ejecuta y responde por ítem; un ítem fallido no revierte los exitosos salvo que el tipo declare atomicidad de lote. | Todos | Adoptada · Mejorar | T11 §6.2 |
| RN-WFL-024 | Toda operación revalida las precondiciones del dominio al ejecutar; si no se cumplen, falla sin efecto parcial. | Todos | Adoptada · Nuevo | T11 §6.2 |
| RN-WFL-025 | Una operación aprobada que no se ejecuta en `PRM-WFL-011` horas exige revalidación de la aprobación (los aprobadores la confirman en un clic con la misma huella). | Todos | Adoptada · Nuevo | T11 §6.2 |
| RN-WFL-026 | Una operación revertida no se borra: la reversión es otra operación vinculada (`reversesOperationId`). | Todos | Adoptada · Reemplazar | T11 §6.2 |
| RN-WFL-027 | Los pasos de una saga se compensan en orden inverso solo si el tipo lo declara; si un paso no es compensable, la operación queda `failed` en bandeja operativa con el detalle de lo ya aplicado. | Todos | Adoptada · Nuevo | T11 §6.2 |
| RN-WFL-030 | No hay edición libre de estado: cada cambio es una transición declarada con actor, guarda y efecto. | Todos | Adoptada · Reemplazar | T11 §6.3 |
| RN-WFL-031 | La reversión de una transición es otra transición declarada (con su permiso), nunca un "deshacer" que borra historia. | Todos | Adoptada · Mejorar | T11 §6.3 |
| RN-WFL-032 | Un estado operativo siempre mapea a un único estado canónico; los efectos dependen del canónico, no del nombre configurable. | Todos | Adoptada · Replicar | T11 §6.3 |
| RN-WFL-033 | Las instancias en curso conservan su versión de workflow; migrar instancias exige operación `wfl.instances.migrate` con mapa de nodos. | Todos | Adoptada · Nuevo | T11 §6.3 |
| RN-WFL-034 | Las acciones automáticas de workflow ejecutan comandos con la identidad técnica del módulo y el `actor` iniciador en el contexto; nunca SQL ni código provisto por el tenant. | Todos | Adoptada · Reemplazar | T11 §6.3 |
| RN-WFL-035 | La acción de vencimiento de un trámite se ejecuta exactamente una vez (marca de ejecución con idempotencia). | Todos | Adoptada · Replicar | T11 §6.3 |
| RN-WFL-036 | Un trámite iniciado por el socio no puede pedir datos que el sistema ya tiene validados; los muestra precargados con opción de "informar cambio". | Todos | Adoptada · Mejorar | T11 §6.3 |
| RN-WFL-037 | Una tarea asignada a una persona que pierde el acceso (baja, suspensión, licencia aprobada) vuelve a la cola de su área en el mismo minuto, con aviso al supervisor. | Todos | Adoptada · Nuevo | T11 §6.3 |
| RN-WFL-038 | El SLA se calcula con el calendario del área responsable (T04) y la zona del tenant; los feriados regionales aplican según la sucursal del área. | Todos | Adoptada · Mejorar | T11 §6.3 |
| RN-WFL-039 | Las ocurrencias recurrentes que vencen se cuentan "en término" o "fuera de término" según su fecha de cierre real contra el vencimiento; los filtros usan esa clasificación sin invertirla. | Todos | Adoptada · Mejorar | T11 §6.3 |
| RN-WFL-040 | El solicitante nunca aprueba su solicitud, aunque tenga la capability y el límite; tampoco quien la creó en su nombre. | Todos | Adoptada · Reemplazar | T11 §6.4 |
| RN-WFL-041 | El permiso, alcance, límite y SoD del aprobador se verifican al **decidir** con `authorize()` de T02; si falla, el paso se reasigna según la política. | Todos | Adoptada · Mejorar | T11 §6.4 |
| RN-WFL-042 | Una persona no decide dos pasos de la misma solicitud (doble firma = dos personas distintas). | Todos | Adoptada · Replicar | T11 §6.4 |
| RN-WFL-043 | Cambiar el contenido relevante de una solicitud invalida las decisiones previas (huella de contenido). | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-044 | La política vigente al **enviar** la solicitud es la que rige; una nueva versión de política no altera solicitudes ya enviadas. | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-045 | El importe que define el tramo es el total de la solicitud en moneda del tenant, convertido con la cotización del día de envío (M14 `tes.exchangeRate.published`) si viene en otra moneda. | Todos | Adoptada · Mejorar | T11 §6.4 |
| RN-WFL-046 | Una delegación nunca amplía permisos: el delegado debe tener la capability base del dominio y el límite delegado no supera el del delegante ni el propio. | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-047 | Una delegación no permite aprobar solicitudes donde el delegado es solicitante o beneficiario. | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-048 | El rechazo de cualquier paso obligatorio rechaza la solicitud completa; en paralelo N de M, la solicitud se rechaza cuando ya no es posible alcanzar el quórum. | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-049 | El escalamiento por SLA nunca aprueba automáticamente: puede sumar aprobadores, reasignar o expirar. | Todos | Adoptada · Nuevo | T11 §6.4 |
| RN-WFL-050 | Las firmas conjuntas toman los firmantes **vigentes** a la fecha de la decisión desde el registro de firmantes (M14), con sus límites. | Todos | Adoptada · Mejorar | T11 §6.4 |
| RN-WFL-051 | Una política "sin aprobación" es explícita por tramo y queda registrada como decisión automática con la versión de la política; no hay ausencia silenciosa de control. | Todos | Adoptada · Mejorar | T11 §6.4 |
| RN-WFL-060 | Ningún archivo de negocio se sirve por URL pública ni ruta estática; toda descarga verifica permiso y emite URL firmada de vida corta. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-061 | Un archivo nunca se sobrescribe; reemplazar crea versión. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-062 | La versión aceptada usada en un acto (firma, aprobación, presentación, emisión) queda fijada; anular el documento no la borra mientras dure su retención. | Todos | Adoptada · Nuevo | T11 §6.5 |
| RN-WFL-063 | La purga física solo procede con retención cumplida, sin legal hold, sin vínculo a documentos económicos vigentes y con registro de purga. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-064 | Los plazos de retención de plataforma no se inventan: se cargan como "a validar" con el fundamento normativo pendiente y el valor conservador por defecto (no purgar). | Todos | Adoptada · Nuevo | T11 §6.5 |
| RN-WFL-065 | Un documento emitido (factura, recibo, constancia, certificado, acta firmada) es inmutable: su PDF se genera una vez y la reimpresión se marca como tal. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-066 | Una plantilla solo accede a variables de su contrato de datos; el contrato lo provee el módulo dueño y la plantilla no consulta datos por sí misma. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-067 | Una plantilla de documento fiscal o legal publicada no se edita: se crea versión nueva con aprobación y vigencia desde. | Todos | Adoptada · Reemplazar | T11 §6.5 |
| RN-WFL-068 | Una secuencia `gapless` toma número dentro de la transacción del documento; si la transacción aborta, el número vuelve a estar disponible. | Todos | Adoptada · Mejorar | T11 §6.5 |
| RN-WFL-069 | Un número asignado nunca se reutiliza aunque el documento se anule. | Todos | Adoptada · Replicar | T11 §6.5 |
| RN-WFL-070 | La firma manuscrita digitalizada se presenta siempre como conformidad y nunca se rotula como firma digital. | Todos | Adoptada · Nuevo | T11 §6.5 |
| RN-WFL-071 | Un documento firmado electrónica o digitalmente no admite nuevas versiones sobre la misma solicitud de firma; un cambio exige nueva solicitud. | Todos | Adoptada · Nuevo | T11 §6.5 |
| RN-WFL-072 | El socio solo ve documentos de tipos visibles, en versiones aceptadas o emitidas, de cuentas sobre las que tiene acceso vigente (M19, M01). | Todos | Adoptada · Mejorar | T11 §6.5 |
| RN-WFL-073 | El acceso a documentos `health` (servicios de salud, ambulancias, banco de sangre) requiere `wfl.documentos.verSensibles` y queda siempre registrado. | SAN, SAL | Adoptada · Nuevo | T11 §6.5 |
| RN-WFL-074 | Los enlaces compartidos vencen como máximo a los `PRM-WFL-045` días y se revocan al anular el documento o al revocar el acceso del sujeto. | Todos | Adoptada · Nuevo | T11 §6.5 |

## 6. Reglas reemplazadas

Reglas que el anexo marca como "Reemplazado por …" (20). El anexo las conserva como referencia del comportamiento original; lo vigente es lo que figura en "Reemplazada por". Nótese que varias se reemplazan por requisitos (RF), parámetros (PRM) o decisiones (DEC), no por otra RN.

| ID | Reemplazada por | Alcance | Fuente |
|---|---|---|---|
| RN-PER-027 | DEC-017 | Parcial | M01 §6.3 |
| RN-PER-082 | RN-SOC-006, RN-SOC-007 | Total | M01 §6.6 |
| RN-PER-083 | RN-SOC-001, RN-SOC-002 | Total | M01 §6.6 |
| RN-PER-084 | RN-SOC-001, RN-SOC-053, RF-SOC-015/016 | Total | M01 §6.6 |
| RN-PER-085 | RN-SOC-004 | Total | M01 §6.6 |
| RN-PER-086 | RN-SOC-008, RN-SOC-009 | Total | M01 §6.6 |
| RN-PER-087 | RN-SOC-012 | Total | M01 §6.6 |
| RN-PER-088 | RN-SOC-014 | Total | M01 §6.6 |
| RN-PER-089 | RN-SOC-003 | Total | M01 §6.6 |
| RN-PER-090 | RN-SOC-005 | Total | M01 §6.6 |
| RN-PER-091 | RN-SOC-013 | Total | M01 §6.6 |
| RN-CAT-045 | RF-SOC-019, PRM-SOC-004/005 | Total | M02 §6 |
| RN-CAT-052 | RF-SOC-022, PRM-SOC-012, EVT-CAT-17 | Parcial | M02 §6 |
| RN-CAT-056 | RF-SOC-026 | Total | M02 §6 |
| RN-CAT-057 | RF-SOC-015, RF-SOC-016, RF-SOC-018 | Total | M02 §6 |
| RN-CAT-058 | RF-SOC-017, JOB-SOC-01 | Total | M02 §6 |
| RN-CAT-059 | RF-SOC-020, RF-SOC-021 | Total | M02 §6 |
| RN-CAT-060 | RF-SOC-013 | Total | M02 §6 |
| RN-MED-069 | RN-TAR-035, DEC-085 | Total | M03 §6.4 |
| RN-MED-070 | RN-TAR-035, DEC-085 | Total | M03 §6.4 |

## 7. Verificación y hallazgos

Controles realizados al generar el catálogo:

- **IDs duplicados**: ninguno. Cada ID está definido una sola vez en los anexos y figura una sola vez en este catálogo.
- **Prefijo coherente con el anexo**: todas las reglas usan el prefijo de su anexo (RN-PER en M01, RN-CAT en M02, etc.).
- **Estado**: ninguna tabla RN tiene columna de estado propia; el estado se derivó como se explica en §1. Todas las reglas quedaron con un estado asignado.
- **Decisión sin vocabulario estándar** (7): la columna "Decisión" no usa Replicar/Mejorar/Reemplazar/Adoptar/Nuevo/Delegar/Descartar, o la decisión está pendiente:
  - RN-MOR-134 (Pendiente de decisión): "**A validar (PA-MOR-18)**."
  - RN-VEN-026 (Pendiente de decisión): "A validar (PA-VEN-02)"
  - RN-TES-025 (Pendiente de decisión): "**A validar** (PA-TES-12)"
  - RN-CON-084 (Pendiente de decisión): "A validar."
  - RN-SOC-046 (Pendiente de decisión): "**A validar**."
  - RN-INT-052 (Otra (ver anexo)): "Usar el método documentado por el proveedor."
  - RN-INT-057 (Otra (ver anexo)): "El conector emite `int.payment.reversed`; el tratamiento contable/comercial es de M07."
- **Columnas de este catálogo**: todas las tablas del catálogo tienen 5 columnas y los `|` internos están escapados.
- **Filas del anexo con columnas inconsistentes** (7): tienen más o menos celdas que el encabezado de su tabla. En el catálogo se reconstruyó cada fila; conviene corregir el anexo:
  - RN-TAR-029 (`M04-TAR-tarifas-motor-calculo.md`, línea 339): 14 celdas, el encabezado tiene 6 (`|` sin escapar dentro del texto de la regla).
  - RN-TAR-121 (`M04-TAR-tarifas-motor-calculo.md`, línea 476): 8 celdas, el encabezado tiene 6 (`|` sin escapar dentro del texto de la regla).
  - RN-TAR-163 (`M04-TAR-tarifas-motor-calculo.md`, línea 523): 8 celdas, el encabezado tiene 6 (`|` sin escapar dentro del texto de la regla).
  - RN-CMP-044 (`M12-CMP-compras-proveedores.md`, línea 329): 8 celdas, el encabezado tiene 6 (`|` sin escapar dentro del texto de la regla).
  - RN-SOC-055 (`M18-SOC-servicios-sociales-flota.md`, línea 409): 4 celdas, el encabezado tiene 6 (faltan celdas al final).
  - RN-SOC-056 (`M18-SOC-servicios-sociales-flota.md`, línea 410): 8 celdas, el encabezado tiene 6 (celdas vacías de más al final).
  - RN-UXD-003 (`T03-UXD-experiencia-marca-diccionario.md`, línea 358): 8 celdas, el encabezado tiene 6 (`|` sin escapar dentro del texto de la regla).
- **Tablas sin columna de verificación**: M13, T05. Sus reglas solo se marcan "A validar" si el texto menciona `[VERIFICAR]`, "A validar" o "requiere validación".
- **Saltos de numeración** (IDs no usados dentro del rango del anexo; no es necesariamente un error, pero conviene confirmar que no falte ninguna regla):
  - T02: RN-IAM-032, 033, 034, 035, 036, 037, 038, 039, 047, 048, 049, 054, 055, 056, 057, 058, 059 (17 IDs).
  - T11: RN-WFL-013, 014, 015, 016, 017, 018, 019, 028, 029, 052, 053, 054, 055, 056, 057, 058, 059 (17 IDs).
- **Orden en el anexo**: reglas que aparecen fuera de orden numérico en el archivo fuente (aquí se ordenaron por ID): M05: RN-FAC-031, RN-FAC-057, RN-FAC-158, RN-FAC-116; M07: RN-COB-020; M08: RN-MOR-099, RN-MOR-132; M15: RN-CON-070.
- **Citas de T12**: todas las reglas que citan las fichas verticales existen en algún anexo.
- **Reemplazos**: todas las RN indicadas como reemplazo existen en el catálogo.

