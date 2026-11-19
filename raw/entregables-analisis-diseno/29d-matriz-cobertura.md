# 29d — Matriz de cobertura de los casos de prueba de aceptación

| Campo | Valor |
|---|---|
| Documento | 29d — Casos de prueba de aceptación y criterios por ola (parte 4 de 4) |
| Portada | [`29-criterios-y-casos-aceptacion-por-ola.md`](29-criterios-y-casos-aceptacion-por-ola.md) (formato del caso, criterios comunes, resumen de cobertura, observaciones) |
| Artefactos | 9.2 Casos de prueba de aceptación; 9.3 Criterios de aceptación por ola |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Contenido | Sección 4 detallada: definición, universo y escenarios no cubiertos por ola, y matriz caso → RF/ESC |

## 4.1 Cómo se mide la cobertura

- Universo de una ola: escenarios con ID de referencia de los anexos asignados a esa ola por el plan `03` o por el anexo que los define. Cuando un escenario figura en una ola pero solo es ejecutable en otra, se cuenta en la ola donde se ejecuta y la diferencia está en la sección 5 de la portada (OBS-25-10 a OBS-25-12 y OBS-25-18).
- Cubierto: el ID aparece en el campo "Cubre" de al menos un caso CPA. Un ID citado por casos de otra ola cuenta para la ola de su universo.
- Los RF se cubren a través de los escenarios que los refieren y del control `npm run trace:check` de `07`; esta matriz no reemplaza ese control.
- Las condiciones CS-Ox-NN están cubiertas al 100 % en todas las olas: cada una es citada por al menos un caso P1.

## 4.2 Universo, cobertura y escenarios no cubiertos por ola

### 4.2.1 O0

Universo de 60: T01 §17.2 A1 a A9 y A16 (10); T02 TST-IAM-01 a 05, 10 a 16, 21, 22, 23, 30, 60, 61, 63, 65 y 68 (21); T11 CA-WFL-07 a 11, 30 a 32, 50 a 52 y 56 (12); T06 CA-INT-01, 06, 07, 08, 09, 13 y ESC-INT-07 (7); T03 ESC-UXD-04, 05, 09, 13, 15, 20, 21, 22, 23 y 25 (10). Cubiertos 60 (100,0 %). Sin faltantes.

### 4.2.2 O1

Universo de 125: T01 A10 a A15 (6); T02 TST-IAM-17 a 20, 31 a 44, 50 a 56, 62, 66, 67 y 70 a 75 (34); T04 ESC-CFG-01 a 34 (34); T06 CA-INT-02, 03, 04, 05, 12, 14, 15 y ESC-INT-02 (8); T11 CA-WFL-01 a 04, 12, 13, 15, 33 a 39, 53 a 55, 57 y 58 (19); T03 ESC-UXD-01, 02, 03, 06, 07, 08, 10, 11, 12, 14 y 24 (11); T07 ESC-MIG-01, 07 y 08 (3); T10 ESC-BIA-01 a 04 y 12 a 17 (10). Cubiertos 100 (80,0 %).

No cubiertos (25): A10; TST-IAM-39, 44, 73, 74, 75; ESC-CFG-07, 19, 20, 24, 26, 28, 30; CA-INT-12; CA-WFL-12, 33, 34, 37, 38, 53, 54, 57, 58; ESC-BIA-04, 15.

### 4.2.3 O2

Universo de 136: M01 AC-PER (40); M02 §17.5 ESC-02 y ESC-03 y §17.2 criterios 1 a 10 (12); M09 ESC-CRM-02, 03, 16, 25, NEG-CRM-01 a 05 y 08, TEN-CRM-01 y 05, RET-CRM-01 y 03 (14); M19 PR-POR-13, 14, 16, 21, 24, 25, 27 a 32, 34 a 40 (19); T09 ESC-COM (44); T11 CA-WFL-05, 06, 14, 16 y 17 (5); ESC-SRV-INT-07 y ESC-MIG-10 (2). Cubiertos 109 (80,1 %).

No cubiertos (27): AC-PER-15, 52; M02 §17.2 criterios 5 y 10; NEG-CRM-08; PR-POR-29, 30, 31, 32, 37, 38; ESC-COM-15, 16, 17, 18, 25, 30, 50, 51, 52, 56, 57, 58, 72, 74, 75, 77.

### 4.2.4 O3

Universo de 70 (escenarios ESC-TEC, ESC-STK, ESC-CRM, ESC-COM y PR-POR de técnica del piloto Internet). Cubiertos 67 (95,7 %). No cubiertos (3): ESC-TEC-28, ESC-STK-19, ESC-STK-41.

### 4.2.5 O4

Universo de 85 (ESC-TAR, criterios de M05 §17, ESC-COM y PR-POR de facturación). Cubiertos 83 (97,6 %). No cubiertos (2): ESC-TAR-02; M05 §17 criterio 18.

### 4.2.6 O5

Universo de 125 (ESC-COB-P, T, R, C, E; T-TES; ESC de M15; ESC-UXD y PR-POR de cobranza; ESC-MIG de saldos). Cubiertos 117 (93,6 %). No cubiertos (8): ESC-COB-R06; T-TES-26, 36, 41, 42, 43, 44; ESC-MIG-03.

### 4.2.7 O6

Universo de 78 (ESC-MOR, ESC-SRV-INT-01 a 07, ESC-CRM y NEG-CRM-07, ESC de M02 §17.5, PR-POR del piloto Internet, ESC-INT y ESC-STK de equipos). Cubiertos 77 (98,7 %). No cubierto (1): PR-POR-17.

### 4.2.8 O7

Universo de 110 (ESC-MED-01 a 36, ESC-SRV-ELE, AG, CLO, GAS y ALU de T12 parte 1, ESC-TAR y ESC-MOR de servicios medidos, criterios de M05 §17 y ESC-COB-L de LAG). Cubiertos 106 (96,4 %). No cubiertos (4): ESC-SRV-CLO-03, 06, 07; ESC-SRV-ALU-05.

### 4.2.9 Suite de paralelo de LAG

Universo de 22: los 6 componentes del criterio de T07 §17.4; RF-MIG-070 a 076, 081 y 082; ESC-COB-L05; ESC-TAR-27; CU-MIG-05 y 06; ESC-03 de T09; GO-02 y GO-26 de `08`. Cubiertos 22 (100,0 %).

### 4.2.10 O8

Universo de 76 (ESC-CMP, ESC-CON-06 a 31, ESC-STK-20 a 34 administrativos y ESC-MED-37). Cubiertos 61 (80,3 %). No cubiertos (15): ESC-CMP-14, 15, 18, 19, 20, 24, 25; ESC-CON-24; ESC-STK-23, 24, 25, 26, 27, 31, 32.

### 4.2.11 O9

Universo de 30 (ESC-SUE-01 a 30 relevantes para la salida de O9 y PR-POR-26). Cubiertos 29 (96,7 %). No cubierto (1): PR-POR-26.

### 4.2.12 O10

Universo de 121 (ESC-INS, ESC-SOC, ESC-T12 parte 2, ESC-SRV-TEL y TV, ESC-CRM del turnero, ESC-STK de fabricación, ESC-MOR, ESC-TAR y PR-POR de estas verticales). Cubiertos 95 (78,5 %). No cubiertos (26): ESC-SOC-03, 04, 19, 20, 21, 23, 25; ESC-T12-SEP-04, 07; ESC-T12-OTR-01 a 05; ESC-CRM-19, 20, 21, 22, 24; ESC-STK-33, 34; ESC-MOR-60; ESC-TAR-33, 37, 39; PR-POR-15.

### 4.2.13 O11

Universo de 59 (ESC-BIA-05 a 11 y 18 a 38, ESC-MIG de migración repetible y corte, escenarios de APIs de terceros). Cubiertos 51 (86,4 %). No cubiertos (8): ESC-BIA-22, 23, 30, 31, 33, 34, 35, 36.

### 4.2.14 Total

1.097 escenarios en el universo, 977 cubiertos: 89,1 %. Camino crítico del piloto (O0 a O7 y paralelo de LAG): 741 de 811, 91,4 %.

## 4.3 Matriz caso → RF/ESC

Transcripción del campo "Cubre" de cada caso. Las columnas "Prioridad · Tipo" y "Archivo" permiten ubicar el caso.

### 4.3.1 Casos de O0

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O0-001 | Entorno local completo con un comando | `03` §4.2 (1); RNF-NFR-161 (juego canónico desde O0) | P1 · Funcional | `29a` |
| CPA-O0-002 | Login de personal por pre-login y menú filtrado por capability | `03` §4.2 (2); TST-IAM-15, TST-IAM-16, TST-IAM-30; ESC-UXD-13, ESC-UXD-23 | P1 · Funcional | `29a` |
| CPA-O0-003 | Login fallido con mensaje genérico, bloqueo y recuperación | TST-IAM-10, TST-IAM-11, TST-IAM-12, TST-IAM-13, TST-IAM-14, TST-IAM-21; ESC-UXD-22 | P1 · Funcional | `29a` |
| CPA-O0-004 | Aislamiento entre tenants por HTTP, recursos y cambio de ámbito | `03` §4.2 (3); A1, A2, A6, A7, A8, A9, A16 (T01 §17.2); TST-IAM-01, TST-IAM-02, TST-IAM-03, TST-IAM-05; CA-WFL-30; equivalente parcial de AC-13 de `07` | P1 · No funcional (seguridad) | `29a` |
| CPA-O0-005 | Plugin de tenancy, jobs y eventos sin contexto | `03` §4.2 (3); A3, A4, A5 (T01 §17.2); TST-IAM-04; CA-WFL-31, CA-WFL-32; RNF-NFR-149 | P1 · No funcional (seguridad) | `29a` |
| CPA-O0-006 | Auditoría encadenada, outbox y consumo único | `03` §4.2 (4); TST-IAM-60, TST-IAM-61, TST-IAM-63, TST-IAM-68; CA-WFL-50, CA-WFL-51; T01 §17.4 | P1 · Funcional | `29a` |
| CPA-O0-007 | Idempotencia de operaciones con Idempotency-Key | TST-IAM-65; T01 §17.4; RNF-NFR-212 | P1 · No funcional (confiabilidad) | `29a` |
| CPA-O0-008 | Job masivo reanudable y orden de eventos | CA-WFL-52, CA-WFL-56; T01 §17.4; RNF-NFR-215 | P2 · No funcional (confiabilidad) | `29a` |
| CPA-O0-009 | PDF desde plantilla, URL firmada y numeración sin huecos | `03` §4.2 (5); CA-WFL-07, CA-WFL-08, CA-WFL-11 | P1 · Funcional | `29a` |
| CPA-O0-010 | Gestión documental con versiones y cuarentena | CA-WFL-09, CA-WFL-10 | P2 · Funcional | `29a` |
| CPA-O0-011 | Bóveda de secretos sin exposición en logs | `03` §4.2 (5); CA-INT-01, CA-INT-06; TST-IAM-22 | P1 · No funcional (seguridad) | `29a` |
| CPA-O0-012 | Marco de conectores con simulador: reintentos, tiempo de espera y corte de circuito | CA-INT-07, CA-INT-08, CA-INT-09, CA-INT-13 | P2 · No funcional (resiliencia) | `29a` |
| CPA-O0-013 | Shells, diccionario y accesibilidad base | ESC-UXD-04, ESC-UXD-05, ESC-UXD-09, ESC-UXD-15, ESC-UXD-20, ESC-UXD-21, ESC-UXD-25; RNF-NFR-155 | P2 · No funcional (accesibilidad y experiencia) | `29a` |
| CPA-O0-014 | Pipeline de CI bloqueante | `03` §4.2 (6); ESC-INT-07; TST-IAM-23; T01 §17.1; T01 §17.8; RNF-NFR-164, RNF-NFR-165 | P1 · No funcional (calidad) | `29a` |
| CPA-O0-015 | Línea base de carga de login y lectura por ID | CS-O0-07; RNF-NFR-001; RNF-NFR-145 | P1 · No funcional (rendimiento) | `29a` |

### 4.3.2 Casos de O1

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O1-001 | Alta asistida de una cooperativa hasta el estado Prueba | CS-O1-01, CS-O1-02; CU-MT-01 (T01 §17) | P1 · Funcional | `29a` |
| CPA-O1-002 | Licencia, activación, rol y alcance combinados | TST-IAM-31, TST-IAM-32, TST-IAM-33, TST-IAM-34, TST-IAM-35, TST-IAM-40, TST-IAM-41; ESC-UXD-14; ESC-CFG-27 | P1 · Funcional | `29a` |
| CPA-O1-003 | Segundo factor obligatorio y login con Google sin fusión automática | CS-O1-03 (2FA); TST-IAM-17, TST-IAM-18, TST-IAM-19, TST-IAM-20 | P1 · No funcional (seguridad) | `29a` |
| CPA-O1-004 | Rol con alcance por sucursal | CS-O1-03 (alcance); TST-IAM-36, TST-IAM-37, TST-IAM-38, TST-IAM-42, TST-IAM-43 | P1 · Funcional | `29a` |
| CPA-O1-005 | Segregación de funciones y autorizaciones | TST-IAM-50, TST-IAM-51, TST-IAM-52, TST-IAM-53, TST-IAM-54, TST-IAM-55, TST-IAM-56; CA-WFL-35 | P1 · Funcional | `29a` |
| CPA-O1-006 | Publicación de configuración con aprobación de un segundo usuario | CS-O1-03 (publicación); ESC-CFG-01, ESC-CFG-04, ESC-CFG-05, ESC-CFG-08, ESC-CFG-09, ESC-CFG-29 | P1 · Funcional | `29a` |
| CPA-O1-007 | Precedencia de parámetros, vigencias y calendarios | ESC-CFG-02, ESC-CFG-03, ESC-CFG-10, ESC-CFG-11, ESC-CFG-12, ESC-CFG-14 | P2 · Funcional | `29a` |
| CPA-O1-008 | Calles con geocodificación | CS-O1-04; ESC-CFG-06, ESC-CFG-13, ESC-CFG-15 | P1 · Funcional | `29a` |
| CPA-O1-009 | Importaciones de maestros | ESC-CFG-16, ESC-CFG-17, ESC-CFG-18, ESC-CFG-21, ESC-CFG-22, ESC-CFG-23, ESC-CFG-25 | P2 · Funcional | `29a` |
| CPA-O1-010 | Entidades jurídicas del tenant | ESC-CFG-31, ESC-CFG-32, ESC-CFG-33, ESC-CFG-34; DEC-064 | P1 · Funcional | `29a` |
| CPA-O1-011 | Acceso de soporte temporal, consentido y auditado | CS-O1-05; A11, A12, A13, A14 (T01 §17.2); TST-IAM-70, TST-IAM-71, TST-IAM-72; CA-WFL-39; ESC-UXD-24; CA-INT-04 | P1 · No funcional (seguridad) | `29a` |
| CPA-O1-012 | Aprobaciones, delegación y bandeja de tareas | CA-WFL-01, CA-WFL-02, CA-WFL-03, CA-WFL-04, CA-WFL-13, CA-WFL-15, CA-WFL-36, CA-WFL-55 | P2 · Funcional | `29a` |
| CPA-O1-013 | Conexiones de integración, certificados y webhooks firmados | CA-INT-02, CA-INT-03, CA-INT-05, CA-INT-14, CA-INT-15; ESC-INT-02; A15 (T01 §17.2) | P2 · Funcional | `29a` |
| CPA-O1-014 | Reporte base exportado por job con URL firmada | CS-O1-06; ESC-BIA-01, ESC-BIA-02, ESC-BIA-03, ESC-BIA-12, ESC-BIA-13, ESC-BIA-14, ESC-BIA-16, ESC-BIA-17; TST-IAM-66 | P1 · Funcional | `29a` |
| CPA-O1-015 | Editor de marca y diccionario del tenant | ESC-UXD-01, ESC-UXD-02, ESC-UXD-03, ESC-UXD-06, ESC-UXD-07, ESC-UXD-08, ESC-UXD-10, ESC-UXD-11, ESC-UXD-12 | P2 · Funcional | `29a` |
| CPA-O1-016 | Restauración por tenant (parte de O1 de ESC-04) | ESC-04 de T01 §17.6 en su parte de O1 (mecanismo de restauración selectiva); RNF-NFR-037, RNF-NFR-044. La parte de emisión fiscal y cobro se cubre en CPA-O5-006 (AC-15 de `07`, O4–O5). | P2 · No funcional (respaldo) | `29a` |
| CPA-O1-017 | Herramienta de migración base con proyecto, mapeo y corrida reanudable | CS-O1-07; ESC-MIG-01, ESC-MIG-07, ESC-MIG-08; CU-31 de BASE (cuenta sin titular rechazada); RF-MIG-043, RF-MIG-050, RF-MIG-052, RF-MIG-053, RF-MIG-096 | P2 · Funcional | `29a` |
| CPA-O1-018 | Verificación de la cadena de auditoría y rechazo de acciones de IA | TST-IAM-62, TST-IAM-67 | P2 · No funcional (seguridad) | `29a` |

### 4.3.3 Casos de O2

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O2-001 | Registro en el portal con OTP y vinculación por código | CS-O2-01; PR-POR-27, PR-POR-28; AC-PER-34, AC-PER-35 | P1 · Funcional | `29a` |
| CPA-O2-002 | Solicitud de Internet INT-100 como trámite hasta contrato requested | CS-O2-02, CS-O2-03, CS-O2-04; ESC-SRV-INT-01 (parcial: hasta crear el contrato); M02 §17.2 criterios 1, 2 y 6; CA-WFL-06 | P1 · Funcional | `29a` |
| CPA-O2-003 | Hermanos en el mismo domicilio | ESC-SRV-INT-07; ESC-03 de M02 §17.5; AC-PER-07, AC-PER-08; AC-14 de `07` | P1 · Funcional | `29a` |
| CPA-O2-004 | Alta de persona sin duplicados y con validación de CUIT | AC-PER-01, AC-PER-02, AC-PER-03, AC-PER-04, AC-PER-06, AC-PER-40 | P1 · Funcional | `29a` |
| CPA-O2-005 | Cuenta principal única con concurrencia | AC-PER-05, AC-PER-24 | P2 · Funcional | `29a` |
| CPA-O2-006 | Cambio de titularidad idempotente | AC-PER-09, AC-PER-10, AC-PER-11, AC-PER-12 | P1 · Funcional | `29a` |
| CPA-O2-007 | Bloqueos por documentación vencida y fallecimiento | AC-PER-13, AC-PER-14 | P2 · Funcional | `29a` |
| CPA-O2-008 | Relaciones entre personas y apoderados en el portal | AC-PER-16, AC-PER-17; PR-POR-21, PR-POR-25; NEG-CRM-01 | P2 · Funcional | `29a` |
| CPA-O2-009 | Domicilios normalizados y geocodificados | AC-PER-18, AC-PER-19, AC-PER-20 | P2 · Funcional | `29a` |
| CPA-O2-010 | Fusión de personas con doble control e importación | AC-PER-21, AC-PER-22, AC-PER-25 | P2 · Funcional | `29a` |
| CPA-O2-011 | Permisos negativos y aislamiento de personas, contratos y portal | AC-PER-30, AC-PER-31, AC-PER-32, AC-PER-33, AC-PER-36, AC-PER-41, AC-PER-42, AC-PER-43, AC-PER-44; PR-POR-24; ESC-SRV-INT-06 (parcial: contratos de O2) | P1 · No funcional (seguridad) | `29a` |
| CPA-O2-012 | Eventos de personas por outbox | AC-PER-50, AC-PER-51, AC-PER-53 | P2 · Funcional | `29a` |
| CPA-O2-013 | Catálogo: publicación validada y copia entre tenants | CS-O2-05; ESC-02 de M02 §17.5; M02 §17.2 criterios 3, 4, 7, 8 y 9 | P1 · Funcional | `29a` |
| CPA-O2-014 | Expediente CRM: derivación, comando a contratos, duplicado y reapertura | CS-O2-03; ESC-CRM-02, ESC-CRM-03, ESC-CRM-16, ESC-CRM-25; NEG-CRM-02, NEG-CRM-03, NEG-CRM-04, NEG-CRM-05; TEN-CRM-01, TEN-CRM-05; RET-CRM-01, RET-CRM-03 | P1 · Funcional | `29a` |
| CPA-O2-015 | Comunidad: muro y moderación | ESC-COM-01, ESC-COM-02, ESC-COM-03, ESC-COM-04, ESC-COM-05, ESC-COM-06, ESC-COM-07, ESC-COM-08, ESC-COM-09, ESC-COM-10; ESC-COM-53, ESC-COM-54 | P2 · Funcional | `29a` |
| CPA-O2-016 | Campañas y comunicaciones con consentimiento | CS-O2-04; ESC-COM-11, ESC-COM-19, ESC-COM-20, ESC-COM-21, ESC-COM-23, ESC-COM-26, ESC-COM-27, ESC-COM-28, ESC-COM-29, ESC-COM-31, ESC-COM-32; ESC-COM-55, ESC-COM-59; ESC-COM-70, ESC-COM-71, ESC-COM-73 | P2 · Funcional | `29a` |
| CPA-O2-017 | Trámites y formularios versionados | CS-O2-02; CA-WFL-05, CA-WFL-06, CA-WFL-14, CA-WFL-16, CA-WFL-17; PR-POR-13, PR-POR-14 | P2 · Funcional | `29a` |
| CPA-O2-018 | Migración de usuarios del portal | ESC-MIG-10; PR-POR-16; RF-MIG-090 | P2 · Funcional | `29a` |
| CPA-O2-019 | Landing y portal: rendimiento y accesibilidad | CS-O2-07; PR-POR-34, PR-POR-35, PR-POR-36, PR-POR-39, PR-POR-40; RNF-NFR-008; RNF-NFR-155 | P2 · No funcional (rendimiento y accesibilidad) | `29a` |

### 4.3.4 Casos de O3

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O3-001 | Factibilidad favorable, vencida y anulada | CS-O3-01; ESC-TEC-01, ESC-TEC-02 | P1 · Funcional | `29a` |
| CPA-O3-002 | OT de instalación sin duplicados | CS-O3-01; ESC-TEC-03, ESC-TEC-04 | P1 · Funcional | `29a` |
| CPA-O3-003 | Agenda y reserva de la visita | CS-O3-01; ESC-TEC-05, ESC-TEC-06; PR-POR-09 | P1 · Funcional | `29a` |
| CPA-O3-004 | ONT en custodia del instalador y comodato | CS-O3-02; ESC-STK-01, ESC-STK-03, ESC-STK-16, ESC-STK-37; ESC-TEC-16 | P1 · Funcional | `29a` |
| CPA-O3-005 | Instalación sin conexión con firma y sincronización sin duplicar | CS-O3-02; ESC-TEC-09; ESC-STK-10, ESC-STK-11; ESC-UXD-16; AC-04 de `07`; RNF-NFR-017, RNF-NFR-219 | P1 · Funcional | `29a` |
| CPA-O3-006 | Conflicto de una orden modificada mientras el técnico estaba sin conexión | ESC-03 (T08 §17.1; M10 ESC-TEC-08); ESC-STK-12; ESC-03 de M09 §17.5; AC-03 de `07` | P1 · Funcional | `29a` |
| CPA-O3-007 | Aprovisionamiento confirmado y contrato activo | CS-O3-03; ESC-01 de M02 §17.5; ESC-TEC-10, ESC-TEC-30; ESC-SRV-INT-01 (parcial: hasta la activación); ESC-COM-13, ESC-COM-14; AC-01 de `07` (parte O3) | P1 · Funcional | `29a` |
| CPA-O3-008 | Aprovisionamiento con tiempo de espera agotado | ESC-SRV-INT-02; ESC-TEC-11; AC-02 de `07` | P1 · Funcional | `29a` |
| CPA-O3-009 | Visita fallida | ESC-TEC-07; PR-POR-10 | P2 · Funcional | `29a` |
| CPA-O3-010 | Reclamo "sin servicio" con OT de reparación y encuesta | CS-O3-04; ESC-CRM-01, ESC-CRM-09; ESC-COM-12; RET-CRM-04; PR-POR-19 | P1 · Funcional | `29a` |
| CPA-O3-011 | Incidente de zona con aviso a afectados | ESC-CRM-08, ESC-CRM-10; ESC-COM-34, ESC-COM-35 | P2 · Funcional | `29a` |
| CPA-O3-012 | Reglas de existencias del stock | ESC-STK-02, ESC-STK-04, ESC-STK-05, ESC-STK-06, ESC-STK-07, ESC-STK-08, ESC-STK-09, ESC-STK-13, ESC-STK-14, ESC-STK-15 | P2 · Funcional | `29a` |
| CPA-O3-013 | Cierre de OT con requisitos y anulación | ESC-TEC-12, ESC-TEC-13, ESC-TEC-14, ESC-TEC-15 | P2 · Funcional | `29a` |
| CPA-O3-014 | Permisos y aislamiento de técnica y stock | ESC-SRV-INT-06; ESC-TEC-22, ESC-TEC-23, ESC-TEC-24, ESC-TEC-25, ESC-TEC-26, ESC-TEC-27; ESC-STK-35, ESC-STK-36, ESC-STK-38, ESC-STK-39; AC-13 de `07` | P1 · No funcional (seguridad) | `29a` |
| CPA-O3-015 | Conciliación de custodia y comodatos | CS-O3-06; ESC-TEC-29; ESC-STK-40, ESC-STK-43; RF-MIG-056 | P2 · Funcional | `29a` |
| CPA-O3-016 | Carga de sincronización de campo con 50 dispositivos | CS-O3-07; ESC-STK-42; RNF-NFR-017, RNF-NFR-188 | P2 · No funcional (rendimiento) | `29a` |

### 4.3.5 Casos de O4

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O4-001 | Primer comprobante de Internet de Ana con CAE | CS-O4-01..03; ESC-SRV-INT-01; ESC-TAR-03, ESC-TAR-07; AC-01 y AC-05 de `07` | P1 · Funcional | `29b` |
| CPA-O4-002 | Lote con excepciones, revisión y aprobación con segregación | CS-O4-01; M05 §17 criterios 1 y 9 | P1 · Funcional | `29b` |
| CPA-O4-003 | Autorización masiva, correlatividad e idempotencia ante ARCA | M06 §17 escenarios 1, 7, 35, 36, 37; M05 §17 criterio 6 | P1 · Funcional | `29b` |
| CPA-O4-004 | Respuesta incierta de ARCA | M06 §17 escenario 32; M05 §17 criterio 8; AC-06 de `07`; RNF-NFR-221 | P1 · No funcional (confiabilidad) | `29b` |
| CPA-O4-005 | ARCA no disponible y certificado vencido | ESC-INT-01; M06 §17 escenarios 33, 34; M05 §17 criterio 7 | P1 · No funcional (resiliencia) | `29b` |
| CPA-O4-006 | Prevalidación fiscal | M06 §17 escenarios 2, 3, 4, 5, 6, 10, 12, 18, 19 | P1 · Funcional | `29b` |
| CPA-O4-007 | CAEA en el día de vencimiento | M06 §17 escenario 8 | P2 · Funcional | `29b` |
| CPA-O4-008 | Explicabilidad, determinismo, inmutabilidad y doble firma del motor tarifario | ESC-TAR-12, ESC-TAR-13, ESC-TAR-17, ESC-TAR-18, ESC-TAR-19 | P1 · Funcional | `29b` |
| CPA-O4-009 | Corrección posterior a la emisión (ESC-02) | ESC-02 (T08 §17.1); ESC-TAR-22; ESC-02 de M06 §17.5 | P1 · Funcional | `29b` |
| CPA-O4-010 | Cambio en un período parcialmente procesado (ESC-05) | ESC-05 (T08 §17.1); ESC-TAR-23, ESC-TAR-24; ESC-05 de M06 §17.5; M05 §17 criterio 4 | P1 · Funcional | `29b` |
| CPA-O4-011 | Errores de fórmula, conflictos y sandbox seguro | ESC-TAR-14, ESC-TAR-15, ESC-TAR-16, ESC-TAR-25 | P1 · No funcional (seguridad y robustez) | `29b` |
| CPA-O4-012 | Vencimientos, recargos, anulación y código de barras | M05 §17 criterios 5, 11, 12, 13, 15 | P1 · Funcional | `29b` |
| CPA-O4-013 | Representación, distribución y portal | CS-O4-02; M05 §17 criterio 16; ESC-COM-22, ESC-COM-24, ESC-COM-38, ESC-COM-40, ESC-COM-76; PR-POR-23 | P1 · Funcional | `29b` |
| CPA-O4-014 | Cuadre y cierre del ciclo | M05 §17 criterios 14, 17; ESC-TAR-29 | P1 · Funcional | `29b` |
| CPA-O4-015 | Permisos y aislamiento de tarifas, facturación y fiscal | M05 §17 criterios 9, 10; ESC-TAR-20, ESC-TAR-21; M06 §17 escenarios 21 a 31 | P1 · No funcional (seguridad) | `29b` |
| CPA-O4-016 | Baja sin cargo y equipo no devuelto | ESC-TAR-26, ESC-TAR-31 | P1 · Funcional | `29b` |
| CPA-O4-017 | Entidades jurídicas, clases de ítem y aporte de capital en el comprobante | M05 §17 criterios 21, 22; M06 §17 escenarios 40, 46, 47, 48 | P1 · Funcional | `29b` |
| CPA-O4-018 | Carga del lote de facturación | CS-O4-05; ESC-TAR-30; RNF-NFR-010, RNF-NFR-024, RNF-NFR-145 | P1 · No funcional (rendimiento) | `29b` |
| CPA-O4-019 | Factura agrupada con titulares distintos en la migración | ESC-MIG-02 (T07 §17.3) | P2 · Funcional | `29b` |

### 4.3.6 Casos de O5

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O5-001 | Pago online de Ana con webhook firmado | CS-O5-01; ESC-COB-R01, ESC-COB-R02, ESC-COB-R03; ESC-01 y ESC-04 de M07 §17.6; PR-POR-04, PR-POR-05; CA-INT-10; AC-07 de `07` | P1 · Funcional | `29b` |
| CPA-O5-002 | Rendición de caja online, conciliación bancaria y asientos | CS-O5-02; T-TES-01..07, T-TES-33; ESC-COB-C01, ESC-COB-C02, ESC-COB-C04; ESC-CON-13, ESC-CON-18; CA-INT-11 | P1 · Funcional | `29b` |
| CPA-O5-003 | Cobro presencial con recargo por mora calculado al cobrar | CS-O5-03; ESC-MOR-08, ESC-MOR-12, ESC-MOR-14; ESC-COB-R05, ESC-COB-R08; ESC-COB-P01, ESC-COB-P02, ESC-COB-P07; ESC-UXD-18 | P1 · Funcional | `29b` |
| CPA-O5-004 | Cobro por ente recaudador con archivo ficticio | CS-O5-03; ESC-COB-R04, ESC-COB-R07, ESC-COB-C03, ESC-COB-T03; ESC-INT-03; ESC-MOR-11 | P1 · Funcional | `29b` |
| CPA-O5-005 | Pago excedente de un hermano (ESC-01) | ESC-01 (T08 §17.1); ESC-01 de M01 §17.5; ESC-01 de M06 §17.5; ESC-01 de M15 §17; T-TES-34; PR-POR-02; AC-08 de `07` | P1 · Funcional | `29b` |
| CPA-O5-006 | Restauración con operaciones externas posteriores (ESC-04) | ESC-04 (T01 §17.6; T08 §17.1); T-TES-35; AC-15 de `07`; RNF-NFR-037 | P1 · No funcional (respaldo y consistencia) | `29b` |
| CPA-O5-007 | Invariantes de la cuenta corriente | M07 §17.1 criterios 1 a 6; ESC-COB-R09; RNF-NFR-204, RNF-NFR-211 | P1 · Funcional | `29b` |
| CPA-O5-008 | Asientos automáticos idempotentes y período cerrado | ESC-02 y ESC-03 de M15 §17; ESC-CON-06, ESC-CON-07, ESC-CON-08, ESC-CON-09, ESC-CON-10, ESC-CON-11, ESC-CON-12, ESC-CON-19, ESC-CON-20, ESC-CON-22 | P1 · Funcional | `29b` |
| CPA-O5-009 | Permisos y aislamiento de cobranza, tesorería y contabilidad | ESC-COB-P03, ESC-COB-P04, ESC-COB-P05, ESC-COB-P06, ESC-COB-P08; ESC-COB-T01, ESC-COB-T02, ESC-COB-T04, ESC-COB-T05; T-TES-25, T-TES-27, T-TES-28, T-TES-29, T-TES-30; ESC-04 y ESC-05 de M15 §17; PR-POR-22 | P1 · No funcional (seguridad) | `29b` |
| CPA-O5-010 | Motor de interés y recargos con conjunto dorado | ESC-MOR-01, ESC-MOR-02, ESC-MOR-03, ESC-MOR-04, ESC-MOR-05, ESC-MOR-06, ESC-MOR-07, ESC-MOR-09, ESC-MOR-10 | P1 · Funcional (regresión de cálculo) | `29b` |
| CPA-O5-011 | Cobro único con deuda de dos entidades jurídicas | ESC-COB-E01, ESC-COB-E02, ESC-COB-E03, ESC-COB-E06, ESC-COB-E07; ESC-CON-28, ESC-CON-29; M05 §17 criterio 24 | P1 · Funcional | `29b` |
| CPA-O5-012 | Cambio de titularidad con deuda en la caja | ESC-COB-E04 | P2 · Funcional | `29b` |
| CPA-O5-013 | Capital social integrado en la factura | ESC-INS-03, ESC-INS-04, ESC-INS-05, ESC-INS-22; ESC-T12-CAP-01, ESC-T12-CAP-02, ESC-T12-CAP-03, ESC-T12-CAP-04, ESC-T12-CAP-05 | P1 · Funcional | `29b` |
| CPA-O5-014 | Claves heredadas de ProCoop en caja y entes (preparación de LAG) | ESC-MIG-05, ESC-MIG-06; CU-MIG-08, CU-MIG-09; RF-MIG-047, RF-MIG-083, RF-MIG-084 | P1 · Funcional | `29b` |
| CPA-O5-015 | Cobro y rendición de terceros | M06 §17 escenarios 16, 39; ESC-T12-TAS-02, ESC-T12-TAS-04, ESC-T12-TAS-05 | P2 · Funcional | `29b` |
| CPA-O5-016 | Factura del servicio SaaS a la cooperativa | CS-O5-04; DEC-065; RF-PLA-040 | P2 · Funcional | `29b` |
| CPA-O5-017 | Carga de webhooks y caja concurrente | CS-O5-07; RNF-NFR-005, RNF-NFR-018, RNF-NFR-024, RNF-NFR-224 | P1 · No funcional (rendimiento) | `29b` |
| CPA-O5-018 | Pagar desde la PWA con accesibilidad | ESC-UXD-19; PR-POR-03, PR-POR-06; RNF-NFR-155 | P2 · No funcional (accesibilidad) | `29b` |

### 4.3.7 Casos de O6

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O6-001 | Recorrido piloto Internet de punta a punta | CS-O6-01; ESC-SRV-INT-01 a ESC-SRV-INT-07 en un solo recorrido; PR-POR-01 | P1 · Funcional | `29b` |
| CPA-O6-002 | Corrida de mora con evidencias y protecciones | ESC-MOR-13, ESC-MOR-15, ESC-MOR-16, ESC-MOR-17, ESC-MOR-18, ESC-MOR-23, ESC-MOR-24, ESC-MOR-25; ESC-COM-33 | P1 · Funcional | `29b` |
| CPA-O6-003 | Ventana de ejecución y pago antes de ejecutar | ESC-MOR-19, ESC-MOR-20 | P1 · Funcional | `29b` |
| CPA-O6-004 | Suspensión restringida y reconexión automática | ESC-SRV-INT-03; ESC-MOR-21, ESC-MOR-22, ESC-MOR-26; ESC-CRM-06, ESC-CRM-07; ESC-05 de M02 §17.5; PR-POR-11; ESC-INT-05; AC-09 y AC-10 de `07` | P1 · Funcional | `29b` |
| CPA-O6-005 | Baja sin trabas por el botón público | ESC-SRV-INT-04; ESC-CRM-04, ESC-CRM-05; ESC-MOR-27; ESC-04 de M02 §17.5; PR-POR-07, PR-POR-08, PR-POR-20; ESC-STK-17, ESC-STK-18; NEG-CRM-07; AC-11 de `07` | P1 · Funcional | `29b` |
| CPA-O6-006 | Cambio de plan | ESC-SRV-INT-05; AC-12 de `07` | P1 · Funcional | `29b` |
| CPA-O6-007 | Convenio de pago desde la PWA con anticipo | ESC-MOR-29, ESC-MOR-30, ESC-MOR-35, ESC-MOR-36, ESC-MOR-37, ESC-MOR-38, ESC-MOR-46, ESC-MOR-47 | P1 · Funcional | `29b` |
| CPA-O6-008 | Sistemas de amortización, cancelación anticipada y caducidad | ESC-MOR-31, ESC-MOR-32, ESC-MOR-33, ESC-MOR-34 | P1 · Funcional (regresión de cálculo) | `29b` |
| CPA-O6-009 | Incobrables, prescripción y garantías | ESC-MOR-39, ESC-MOR-40, ESC-MOR-41 | P2 · Funcional | `29b` |
| CPA-O6-010 | IA supervisada y bot de atención | ESC-CRM-12, ESC-CRM-13, ESC-CRM-14, ESC-CRM-15; NEG-CRM-09; TEN-CRM-04; escenario 34 de BASE (T08 §17.2) | P1 · Funcional | `29b` |
| CPA-O6-011 | Atención omnicanal por WhatsApp | ESC-CRM-11; ESC-INT-04; RET-CRM-02; TEN-CRM-02; ESC-05 de M09 §17.5 | P2 · Funcional | `29b` |
| CPA-O6-012 | Permisos y aislamiento de mora y financiación | ESC-MOR-28, ESC-MOR-42, ESC-MOR-43, ESC-MOR-44, ESC-MOR-45 | P1 · No funcional (seguridad) | `29b` |
| CPA-O6-013 | Reintentos y conciliación de la mora | ESC-MOR-48, ESC-MOR-49, ESC-MOR-50; ESC-01 a ESC-05 de M08 §17.5 | P1 · No funcional (confiabilidad) | `29b` |
| CPA-O6-014 | Convenios con varias entidades y cambio de titularidad | ESC-MOR-62, ESC-MOR-63 | P2 · Funcional | `29b` |
| CPA-O6-015 | Circular de deuda | ESC-CRM-23 | P3 · Funcional | `29b` |
| CPA-O6-016 | Tablero de cierre del piloto y carga de la corrida de mora | CS-O6-04; tablero de cierre del piloto de T10 §17; RNF-NFR-016, RNF-NFR-024, RNF-NFR-145 | P1 · No funcional (rendimiento) | `29b` |
| CPA-O6-017 | Regresión de O0 a O5 | CS-O6-02; todos los CPA de prioridad P1 de O0 a O5 | P1 · Regresión | `29b` |

### 4.3.8 Casos de O7

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O7-001 | Ruta de lectura de energía sin conexión con foto y rango | CS-O7-01; ESC-MED-03, ESC-MED-04, ESC-MED-05, ESC-MED-06, ESC-MED-07, ESC-MED-08, ESC-MED-35 | P1 · Funcional | `29b` |
| CPA-O7-002 | Cálculo y aprobación de consumos con estimación | CS-O7-02; ESC-MED-12, ESC-MED-13, ESC-MED-29, ESC-MED-30, ESC-MED-31, ESC-MED-32, ESC-MED-33, ESC-MED-34 | P1 · Funcional | `29b` |
| CPA-O7-003 | Lote de energía con cuadro medido escalonado | CS-O7-03; ESC-SRV-ELE-01; ESC-TAR-04, ESC-TAR-05, ESC-TAR-06; M05 §17 criterios 2 y 3 | P1 · Funcional | `29b` |
| CPA-O7-004 | Informe al regulador | CS-O7-04; M06 §17 escenario 9; RF-FIS-144, RF-FIS-147 | P1 · Funcional | `29b` |
| CPA-O7-005 | Factura in situ desde la app | CS-O7-05; RF-FAC-108 | P1 · Funcional | `29b` |
| CPA-O7-006 | Instalación de medidores y lotes de lectura | ESC-MED-01, ESC-MED-02, ESC-MED-09, ESC-MED-10, ESC-MED-11 | P2 · Funcional | `29b` |
| CPA-O7-007 | Prepago de LAG: recarga, token, retención y falla del proveedor | ESC-MED-22; ESC-SRV-ELE-06; RF-COB-075; RF-MED-113, RF-MED-114, RF-MED-115; AC-16 de `07`; GO-25 de `08` | P1 · Funcional | `29b` |
| CPA-O7-008 | Gas de LAG: corrección de volumen y factor faltante | ESC-TAR-38, ESC-TAR-10; ESC-SRV-GAS-01, ESC-SRV-GAS-02, ESC-SRV-GAS-07; ESC-MED-17; DEC-085; AC-17 de `07`; GO-22 de `08` | P1 · Funcional | `29b` |
| CPA-O7-009 | Gas: habilitación, rehabilitación, urgencias y precinto | ESC-SRV-GAS-03, ESC-SRV-GAS-04, ESC-SRV-GAS-05, ESC-SRV-GAS-06 | P1 · Funcional | `29b` |
| CPA-O7-010 | Generación distribuida e inyección | ESC-SRV-ELE-02, ESC-SRV-ELE-03; ESC-TAR-11; ESC-MED-18 | P2 · Funcional | `29b` |
| CPA-O7-011 | Factor de potencia y revisión previa de grandes usuarios | ESC-SRV-ELE-05; ESC-TAR-08; M05 §17 criterio 19 | P2 · Funcional | `29b` |
| CPA-O7-012 | Telemedición: corte y reconexión remotos idempotentes | ESC-SRV-ELE-07; ESC-MED-19, ESC-MED-20, ESC-MED-21, ESC-MED-28 | P1 · Funcional | `29b` |
| CPA-O7-013 | Electrodependientes, ventana del regulador y deuda de terceros | ESC-SRV-ELE-04; ESC-MOR-55, ESC-MOR-58 | P1 · Funcional | `29b` |
| CPA-O7-014 | Rendición Red Link con el formato de LAG | ESC-COB-L01, ESC-COB-L02, ESC-COB-L03; ESC-MIG-04; AC-18 de `07`; GO-27 de `08` | P1 · Funcional | `29b` |
| CPA-O7-015 | SIRO para facturas de ARS 100.000 o más | ESC-COB-L04; AC-19 de `07`; GO-27 de `08`; PA-COB-16 | P1 · Funcional | `29b` |
| CPA-O7-016 | Agua y cloacas medidas y no medidas | ESC-SRV-AG-01 a ESC-SRV-AG-07; ESC-SRV-CLO-01, ESC-SRV-CLO-02, ESC-SRV-CLO-04, ESC-SRV-CLO-05; ESC-TAR-01, ESC-TAR-09, ESC-TAR-32, ESC-TAR-36; ESC-MED-14, ESC-MED-15, ESC-MED-16, ESC-MED-36; M05 §17 criterios 20 y 23; ESC-MOR-53, ESC-MOR-54; PR-POR-12, PR-POR-18 | P2 · Funcional | `29b` |
| CPA-O7-017 | Red GIS, obras y cuotas de obra | ESC-TEC-17, ESC-TEC-18, ESC-TEC-19, ESC-TEC-20; ESC-T12-OBR-01 a ESC-T12-OBR-07 | P2 · Funcional | `29b` |
| CPA-O7-018 | Permisos y aislamiento de medición | ESC-MED-23, ESC-MED-24, ESC-MED-25, ESC-MED-26, ESC-MED-27 | P1 · No funcional (seguridad) | `29b` |
| CPA-O7-019 | Carga de 50.000 lecturas | CS-O7-07; RNF-NFR-024, RNF-NFR-145 | P1 · No funcional (rendimiento) | `29b` |
| CPA-O7-020 | Regresión del piloto Internet sobre la versión de O7 | CS-O7-08; CPA-O6-001 | P1 · Regresión | `29b` |
| CPA-O7-021 | Alumbrado vinculado a electricidad y tasas de terceros | ESC-SRV-ALU-01, ESC-SRV-ALU-02, ESC-SRV-ALU-03, ESC-SRV-ALU-04, ESC-SRV-ALU-06, ESC-SRV-ALU-07; ESC-TAR-13 (regresión) | P2 · Funcional | `29b` |

### 4.3.9 Casos de la suite de paralelo de LAG

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O7-101 | Preparación del paralelo y delta diario | T07 §9.6 puntos 1 y 2; RF-MIG-081; T07 §17.2 (dominios PER, SUM, MED, TAR, FIS y FAC conciliados) | P1 · Paralelo | `29c` |
| CPA-O7-102 | Simulación del ciclo sin efectos externos | RF-MIG-070; RN-MIG-030; T07 §9.6 punto 3; ESC-03 de T09 §17.4 | P1 · Paralelo | `29c` |
| CPA-O7-103 | Importación de lo emitido por ProCoop y emparejamiento | RF-MIG-071; T07 §9.6 puntos 4 y 5; T07 §17.4 (emparejamiento ≥ 99,9 %) | P1 · Paralelo | `29c` |
| CPA-O7-104 | Comparación factura por factura de electricidad | RF-MIG-072; T07 §9.6 punto 6; T07 §17.4 (coincidencia por factura); RN-MIG-040 | P1 · Paralelo | `29c` |
| CPA-O7-105 | Comparación de gas con corrección de volumen | RF-MIG-072; ESC-TAR-38 (regresión dentro del paralelo); T07 §9.7 (gas desde el día 1) | P1 · Paralelo | `29c` |
| CPA-O7-106 | Comparación del prepago | T07 §9.8 punto 8; T07 §17.2 (saldo prepago por medidor); RF-MIG-072 | P1 · Paralelo | `29c` |
| CPA-O7-107 | Comprobantes agrupados | CU-MIG-06; T07 §9.6 punto 6 (subtotal por servicio, FAC-007) | P2 · Paralelo | `29c` |
| CPA-O7-108 | Clasificación obligatoria de cada diferencia | RF-MIG-073; T07 §8.6, §9.6 punto 7; T07 §17.4 (100 % explicado; PRM-MIG-042) | P1 · Paralelo | `29c` |
| CPA-O7-109 | Mora, cobranzas imputadas y asientos simulados | RF-MIG-074; RF-MIG-082; T07 §9.6 punto 8; T07 §17.4 (mora, cobranzas y asientos conciliados); DEC-069 | P1 · Paralelo | `29c` |
| CPA-O7-110 | Cobranza por día y saldos por cuenta | ESC-COB-L05; AC-20 de `07` | P1 · Paralelo | `29c` |
| CPA-O7-111 | Tablero del paralelo como evidencia | RF-MIG-075; GO-02 de `08` | P2 · Paralelo | `29c` |
| CPA-O7-112 | Aprobación por servicio con dos ciclos consecutivos | RF-MIG-076; T07 §9.6 punto 9, §17.4 (ciclos consecutivos); PRM-MIG-041; CU-MIG-05; GO-26 de `08`; AC-20 de `07` | P1 · Paralelo | `29c` |
| CPA-O7-113 | Diferencias por corrección conocida de ProCoop | ESC-TAR-27 | P2 · Paralelo | `29c` |
| CPA-O7-114 | Segregación y aislamiento durante el paralelo | T07 §17.1; RN-MIG-041; T07 §9.11 punto 1 | P1 · No funcional (seguridad) | `29c` |

### 4.3.10 Casos de O8

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O8-001 | Compra con recepción parcial y control de 3 vías | CS-O8-01; ESC-CMP-01, ESC-CMP-02, ESC-CMP-03, ESC-CMP-04, ESC-CMP-05, ESC-CMP-09, ESC-CMP-10, ESC-CMP-16 | P1 · Funcional | `29c` |
| CPA-O8-002 | Orden de pago con retenciones y pago bancario | CS-O8-01; ESC-CMP-11, ESC-CMP-12, ESC-CMP-13; M06 §17 escenarios 11 y 38; T-TES-12, T-TES-19, T-TES-20, T-TES-21, T-TES-22, T-TES-23, T-TES-31, T-TES-32 | P1 · Funcional | `29c` |
| CPA-O8-003 | Valores de terceros y cheques | T-TES-08, T-TES-09, T-TES-10, T-TES-11, T-TES-13, T-TES-14, T-TES-15 | P2 · Funcional | `29c` |
| CPA-O8-004 | Valorización de stock y amortización de bienes de uso | CS-O8-02; ESC-STK-20, ESC-STK-21, ESC-STK-22, ESC-STK-28, ESC-STK-29, ESC-STK-30; ESC-CON-17 | P1 · Funcional | `29c` |
| CPA-O8-005 | Importación de una liquidación de sueldos externa | CS-O8-02; ESC-SUE-09, ESC-SUE-10; CU-28 | P1 · Funcional | `29c` |
| CPA-O8-006 | Libro IVA digital y SICORE | CS-O8-02; M06 §17 escenarios 13, 14, 15, 17 | P1 · Funcional | `29c` |
| CPA-O8-007 | Cierre contable mensual | CS-O8-03; ESC-CON-14, ESC-CON-15, ESC-CON-16 | P1 · Funcional | `29c` |
| CPA-O8-008 | Compra mayorista de energía y pérdidas (parte administrativa de LAG) | ESC-CMP-21, ESC-CMP-22, ESC-CMP-23; ESC-CON-23; ESC-MED-37 | P2 · Funcional | `29c` |
| CPA-O8-009 | Permisos, segregación y aislamiento de compras y tesorería | ESC-CMP-06, ESC-CMP-07, ESC-CMP-08, ESC-CMP-17; ESC-CON-21; T-TES-16, T-TES-17, T-TES-18, T-TES-24 | P1 · No funcional (seguridad) | `29c` |
| CPA-O8-010 | Flujo de fondos y liquidez | T-TES-38, T-TES-39, T-TES-45 | P3 · Funcional | `29c` |
| CPA-O8-011 | Carga de asientos masivos | CS-O8-04; RNF-NFR-145 | P2 · No funcional (rendimiento) | `29c` |

### 4.3.11 Casos de O9

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O9-001 | Dos períodos en paralelo con la liquidación externa | CS-O9-01; ESC-SUE-08, ESC-SUE-30; DEC-058 | P1 · Paralelo | `29c` |
| CPA-O9-002 | F.931, LSD y recibos firmados en el portal | CS-O9-02; ESC-SUE-22, ESC-SUE-24, ESC-SUE-25 | P1 · Funcional | `29c` |
| CPA-O9-003 | Pago de haberes y asiento | CS-O9-03; ESC-SUE-03, ESC-SUE-06; T-TES-40 | P1 · Funcional | `29c` |
| CPA-O9-004 | Segregación y datos sensibles | ESC-SUE-01, ESC-SUE-02, ESC-SUE-04, ESC-SUE-05, ESC-SUE-27, ESC-SUE-28 | P1 · No funcional (seguridad) | `29c` |
| CPA-O9-005 | Conjunto dorado de cálculo de haberes | ESC-SUE-13, ESC-SUE-14, ESC-SUE-15, ESC-SUE-16, ESC-SUE-17, ESC-SUE-18, ESC-SUE-19, ESC-SUE-20, ESC-SUE-21 | P1 · Funcional (regresión de cálculo) | `29c` |
| CPA-O9-006 | Reanudación, versiones y período cerrado | ESC-SUE-07, ESC-SUE-11, ESC-SUE-12, ESC-SUE-23, ESC-SUE-26, ESC-SUE-29 | P2 · Funcional | `29c` |
| CPA-O9-007 | Carga de liquidación de 500 empleados | CS-O9-04; RNF-NFR-145 | P2 · No funcional (rendimiento) | `29c` |

### 4.3.12 Casos de O10

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O10-001 | Asamblea ordinaria completa | CS-O10-01; ESC-INS-08, ESC-INS-09, ESC-INS-10, ESC-INS-11, ESC-INS-12, ESC-INS-13, ESC-INS-20 | P1 · Funcional | `29c` |
| CPA-O10-002 | Distribución de excedentes con asiento | CS-O10-02; ESC-INS-17 | P1 · Funcional | `29c` |
| CPA-O10-003 | Sepelio con verificación de cobertura | CS-O10-03; ESC-SOC-01, ESC-SOC-02, ESC-SOC-24; ESC-T12-SEP-01, ESC-T12-SEP-02, ESC-T12-SEP-03, ESC-T12-SEP-05, ESC-T12-SEP-06; ESC-MOR-56, ESC-MOR-61 | P1 · Funcional | `29c` |
| CPA-O10-004 | Plan de vivienda que factura cuotas | CS-O10-03; ESC-SOC-13, ESC-SOC-15, ESC-SOC-16, ESC-SOC-17; ESC-T12-VIV-01 a ESC-T12-VIV-07 | P1 · Funcional | `29c` |
| CPA-O10-005 | Turno en tótem atendido por turnero | CS-O10-04; ESC-CRM-17, ESC-CRM-18; NEG-CRM-06; TEN-CRM-06; PR-POR-33 | P1 · Funcional | `29c` |
| CPA-O10-006 | Línea telefónica tasada y facturada | CS-O10-05; ESC-SRV-TEL-01 a ESC-SRV-TEL-07; ESC-TAR-28; ESC-TEC-21; ESC-MOR-51 | P1 · Funcional | `29c` |
| CPA-O10-007 | Televisión con decodificador en comodato | ESC-SRV-TV-01 a ESC-SRV-TV-06; ESC-MOR-52 | P2 · Funcional | `29c` |
| CPA-O10-008 | Registro de asociados y capital | ESC-INS-01, ESC-INS-02, ESC-INS-06, ESC-INS-07, ESC-INS-14, ESC-INS-15, ESC-INS-16, ESC-INS-18, ESC-INS-19, ESC-INS-21; ESC-T12-CAP-06, ESC-T12-CAP-07 | P2 · Funcional | `29c` |
| CPA-O10-009 | Cementerio, banco de sangre y traslados | ESC-SOC-05, ESC-SOC-06, ESC-SOC-07, ESC-SOC-08, ESC-SOC-09, ESC-SOC-10, ESC-SOC-11, ESC-SOC-12, ESC-SOC-14, ESC-SOC-18, ESC-SOC-22; ESC-T12-CEM-01 a ESC-T12-CEM-06; ESC-T12-SAN-01 a ESC-T12-SAN-06; ESC-T12-SAL-01 a ESC-T12-SAL-06; ESC-TAR-34, ESC-TAR-35; ESC-MOR-57 | P2 · Funcional | `29c` |
| CPA-O10-010 | Carga de votación remota | CS-O10-07; RNF-NFR-145 | P1 · No funcional (rendimiento) | `29c` |

### 4.3.13 Casos de O11

| Caso | Título | Cubre | Prioridad · Tipo | Archivo |
|---|---|---|---|---|
| CPA-O11-001 | Migración completa repetible | CS-O11-01; T07 §17.1 (los 8 criterios transversales); ESC-MIG-01 (regresión); RF-MIG-043 | P1 · Funcional | `29c` |
| CPA-O11-002 | Conciliación y muestreo por dominio | T07 §17.2 (todas las filas por dominio) | P1 · Funcional | `29c` |
| CPA-O11-003 | Ensayo de corte comercial con rollback (servicios que sigan en ProCoop; LAG al cerrar O7, DEC-089) | CS-O11-03; CU-MIG-10, CU-MIG-11; RF-MIG-086, RF-MIG-087, RF-MIG-088, RF-MIG-089; GO-03 de `08` | P1 · Funcional | `29c` |
| CPA-O11-004 | Rollback bloqueado después de la primera emisión fiscal | ESC-MIG-09 | P1 · Funcional | `29c` |
| CPA-O11-005 | Ensayo de corte administrativo | CS-O11-03; RF-MIG-057; GO-24 de `08` | P1 · Funcional | `29c` |
| CPA-O11-006 | Histórico en el portal y archivo | CU-MIG-13, CU-MIG-14; RF-MIG-061, RF-MIG-063, RF-MIG-064; ESC-COB-E05 | P2 · Funcional | `29c` |
| CPA-O11-007 | API de terceros con clave y cuota | CS-O11-04; ESC-BIA-24, ESC-BIA-25, ESC-BIA-26, ESC-BIA-27, ESC-BIA-28, ESC-BIA-29, ESC-BIA-37 | P1 · Funcional | `29c` |
| CPA-O11-008 | Reportes y BI certificados | ESC-BIA-05, ESC-BIA-06, ESC-BIA-07, ESC-BIA-08, ESC-BIA-09, ESC-BIA-10, ESC-BIA-11, ESC-BIA-18, ESC-BIA-19, ESC-BIA-20, ESC-BIA-21, ESC-BIA-32, ESC-BIA-38 | P2 · Funcional | `29c` |
| CPA-O11-009 | Modo pasarela fiscal | M06 §17 escenario 20 | P2 · Funcional | `29c` |
| CPA-O11-010 | Versiones migradas sin reescritura | Fila "ESC-01..05" de T07 §17.3 aplicada a ESC-05 | P2 · Funcional | `29c` |
| CPA-O11-011 | Regresión final y carga completa | CS-O11-05; RNF-NFR-024, RNF-NFR-145 | P1 · Regresión | `29c` |
