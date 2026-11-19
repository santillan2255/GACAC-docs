# Suite de la cooperativa piloto Laguna Larga (LAG)

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md). Cooperativa piloto: Laguna Larga (`LAG`), DEC-088 (reemplaza a DEC-081). Internet se valida primero con datos sintéticos (DEC-005); la migración real de LAG ocurre después de O7 con el prepago disponible (PA-MIG-17, PA-COB-15) y el corte avanza por etapas hasta O11 (DEC-068). Nunca se usan datos personales de la base relevada de LAG: en ensayos (E0) la copia seudonimizada de forma irreversible (PA-MIG-15, RF-MIG-095); en el paralelo (E1) el tenant de LAG con delta diario.

## 1. Casos de aceptación del piloto (AC de `07` §15) y sus CP

| AC | Escenario de origen | CP que lo ejecutan | Ola |
|---|---|---|---|
| AC-01 | ESC-SRV-INT-01 | CP-SRV-5001 | O6 |
| AC-02 | ESC-SRV-INT-02 | CP-SRV-5002 | O3 |
| AC-03 | ESC-TEC-08 | CP-TEC-5008 | O3 |
| AC-04 | ESC-TEC-09 | CP-TEC-5009 | O3 |
| AC-05 | ESC-TAR-03 | CP-TAR-5003 | O4 |
| AC-06 | ESC-FIS-32 (M06 §17; `07` §15 lo cita como "Escenario 32") | CP-FIS-5032 | O4 |
| AC-07 | ESC-COB-R01 | CP-COB-5016 | O5 |
| AC-08 | ESC-01 | CP-PER-5001, CP-CAT-5001, CP-FIS-5049, CP-COB-5001, CP-MOR-5064, CP-CRM-5026, CP-CON-5001, CP-IAM-5001, CP-INT-5001, CP-MIG-5011, CP-NFR-5001, CP-COM-5059, CP-WFL-5001 | O5 |
| AC-09 | ESC-SRV-INT-03 | CP-SRV-5003 | O6 |
| AC-10 | ESC-MOR-21 | CP-MOR-5021 | O6 |
| AC-11 | ESC-SRV-INT-04 | CP-SRV-5004 | O6 |
| AC-12 | ESC-SRV-INT-05 | CP-SRV-5005 | O6 |
| AC-13 | ESC-SRV-INT-06 | CP-SRV-5006 | O6 |
| AC-14 | ESC-SRV-INT-07 | CP-SRV-5007 | O6 |
| AC-15 | ESC-04 | CP-CAT-5004, CP-FAC-5002, CP-FIS-5051, CP-COB-5002, CP-MOR-5067, CP-CRM-5029, CP-TEC-5011, CP-STK-5041, CP-CON-5004, CP-PLA-5001, CP-IAM-5003, CP-INT-5004, CP-NFR-5004, CP-COM-5062, CP-WFL-5004 | O5 |
| AC-16 | ESC-MED-22 | CP-MED-5022 | O7 |
| AC-17 | ESC-TAR-38 | CP-TAR-5038 | O4 |
| AC-18 | ESC-COB-L01 | CP-COB-5029 | O5 |
| AC-19 | ESC-COB-L04 | CP-COB-5032 | O5 |
| AC-20 | ESC-COB-L05 | CP-COB-5033 | O5 |

## 2. Etapas de la suite

| Etapa | Ambiente y datos | Composición | Aprobación |
|---|---|---|---|
| P1 Internet sintético (O2–O6) | TEN-001 con datos ficticios | AC-01 a AC-15 y CP de la sección 3.1 | Criterio de salida de O6 (DEC-005) |
| P2 Ensayo de migración LAG (E0, después de O7) | Copia seudonimizada de LAG | AC-16 a AC-19 y CP de la sección 3.2 y 3.3 | Usuarios clave de LAG y equipo de migración; go/no-go GO-02, GO-25 a GO-27 (`08`) |
| P3 Paralelo LAG (E1) | Tenant de LAG con delta diario | AC-20 y CP de migración de la sección 3.3 | 2 ciclos consecutivos sin diferencias sin explicar (PRM-MIG-041, PRM-MIG-042) |
| P4 Corte por etapas (hasta O11) | Producción de LAG | Regresión acumulada de O11 (`90-suites-regresion-por-ola.md`) más esta suite | Acta de aceptación (RF-MIG-087) |

## 3. CP incluidos en la suite piloto

### 3.1 Internet de punta a punta con datos sintéticos

Total: 107 CP.

| Anexo | CP |
|---|---|
| M01 | CP-PER-5001, 6001 a 6041, 8001 a 8018 |
| M02 | CP-CAT-5001 a 5005, 8001 |
| M09 | CP-CRM-5001 a 5004, 5008 a 5010, 5012, 5014 a 5016, 5025 a 5030, 8001 a 8002, 8004 a 8005, 8007 a 8008, 8012, 8018 a 8020, 8025 |
| M10 | CP-TEC-5008, 5016, 8001, 8003 a 8005 |
| T12 | CP-SRV-5001 a 5007 |

### 3.2 Servicios medidos de LAG: electricidad, gas y prepago

Total: 24 CP.

| Anexo | CP |
|---|---|
| M03 | CP-MED-8001 a 8004, 8006 |
| M04 | CP-TAR-8001 |
| M07 | CP-COB-5029, 5033, 8007 |
| T12 | CP-SRV-5021 a 5028, 5043 a 5049 |

### 3.3 Migración y paralelo de LAG

Total: 153 CP.

| Anexo | CP |
|---|---|
| M02 | CP-CAT-0017, 0072 |
| M04 | CP-TAR-0101, 5027, 8015 |
| M05 | CP-FAC-0142 a 0143, 0148 |
| M06 | CP-FIS-5042 |
| M07 | CP-COB-0059, 0099, 0132, 0186, 5030 a 5032 |
| M08 | CP-MOR-0218, 5022 |
| M09 | CP-CRM-5020 |
| M10 | CP-TEC-0023, 0103, 5002 |
| M11 | CP-VEN-5008 |
| M12 | CP-CMP-0143, 5006 |
| M13 | CP-STK-5029 |
| M14 | CP-TES-0050 |
| M15 | CP-CON-0010, 0027, 0036 |
| M16 | CP-SUE-0115, 0146 |
| M17 | CP-INS-0036 |
| T01 | CP-PLA-0036, 0063, 0147 a 0148, 0154 |
| T03 | CP-UXD-0043, 0055, 0159, 0172 |
| T04 | CP-CFG-0007, 0016, 0041, 0111, 0120, 0123, 0132, 0142, 5024, 8007, 8013 |
| T05 | CP-DAT-8003 |
| T06 | CP-INT-0001, 0023, 0059, 0061 |
| T07 | CP-MIG-0001 a 0006, 0010 a 0011, 0015 a 0016, 0020 a 0024, 0027, 0030 a 0047, 0050 a 0058, 0060, 0062, 0070 a 0073, 0075 a 0076, 0080 a 0081, 0083 a 0084, 0086 a 0090, 0095 a 0096, 0098, 5001 a 5011, 8001 a 8015 |
| T09 | CP-COM-0106, 0136, 5061 |
| T10 | CP-BIA-0026, 5035 |
| T11 | CP-WFL-0071 |
