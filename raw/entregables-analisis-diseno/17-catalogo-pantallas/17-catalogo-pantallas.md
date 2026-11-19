# Catálogo de pantallas

**Entregable de Análisis y Diseño Detallado. Artefacto 4.5 (Catálogo de pantallas).**

| Dato | Valor |
|---|---|
| Producto | GoodApps Cooperativas |
| Documento | Índice del catálogo de pantallas: todas las PAN definidas en los anexos, con ruta, portal, capability, patrón de UI, familia, campos, acciones, RF y ola |
| Carácter | Derivado de la especificación vigente; ante diferencias prevalecen los anexos (§7 y §10), T02, T03 §10.8 y §10.9 y el registro de decisiones |
| Cooperativa piloto | Laguna Larga (`LAG`, DEC-088) |
| Versión | 1.1 (regenerado tras la corrección de la especificación: capabilities canónicas de T02, PAN-POR-105 Comunidad, PAN-UXD-15 a 17, tabbars del portal según M19 §10.1) |
| Fecha | 05-11-2026 |
| Documentos hermanos | [05-wireframes-pantallas-piloto.md](../05-wireframes-pantallas-piloto.md) (wireframes, artefacto 4.2) y sus partes 05a a 05h |

## Contenido del índice

1. Método de construcción
2. Leyenda de columnas
3. Partes del catálogo (una por módulo)
4. Resumen por patrón, portal y ola
5. Inconsistencias detectadas en la especificación
6. Pendientes y limitaciones
7. Tabla de cobertura

## 1. Método de construcción

El catálogo se generó con scripts y se revisó a mano (regla 3 de la ampliación). Los scripts están en `docs/entregables-analisis-diseno/_trabajo/`:

| Script | Qué hace |
|---|---|
| `pan_extraer.py` | Recorre la §10 de los 29 anexos con pantallas (M01 a M19 y T01 a T04, T06 a T11) y extrae cada PAN, tanto de tablas como de fichas con encabezado `### PAN-...`. Genera `pan_crudo.json` |
| `pan_catalogo.py` | Normaliza ruta (reglas AL-01 a AL-06 de T03 §10.9), portal, capability, ola, patrón y RF; cruza con el mapa del sitio (T03 §10.8 y §10.9; las pantallas de otra app, las transversales y las citas anteriores se leen de §10.9.13 y no cuentan como pantallas del ítem; los IDs citados en notas "antes …" no se cuentan) y el plan de olas. Genera `pan_catalogo.json` y la lista de inconsistencias |
| `pan_nombres_manuales.json` | Nombres revisados a mano para las PAN cuyo anexo no trae nombre o trae uno genérico |
| `pan_familias.py` | Asignación explícita (revisada a mano) de cada PAN a una familia `FAM-<COD>-NN` |
| `pan_generar.py` | Escribe este índice, las partes por módulo y los wireframes 05a a 05h |

Reglas aplicadas:

- **Ruta**: la del anexo dueño (AL-01), normalizada con AL-02 (`/admin`), AL-03 (`/admin/plataforma/`), AL-04 (`/app/`), AL-05 (`/app/campo/`) y AL-06 (landing sin `tenantSlug`). Si el anexo no trae una ruta navegable se usa la canónica de T03 §10.9. Cuando ambas difieren se muestran las dos.
- **Capability**: la del anexo (T02, formato `modulo.recurso.accion`); si falta, la de T03 §10.9.
- **Portal**: admin, socio (PWA del socio), empleado (PWA del empleado), campo (PWA de campo), plataforma (consola del proveedor), landing (sitio público), dispositivo (tótem, pantalla de llamados) y transversal (pantallas comunes a varias apps, como login).
- **Ola**: prioridad 1, columna Ola del anexo; 2, ola del ítem del mapa del sitio T03 §10.8 donde la PAN es principal o asociada; 3, rangos de PAN del plan de olas (`03-plan-de-olas-y-prompts.md`); 4, ola mínima de los RF vinculados.
- **Patrón**: según portal, tipo declarado en el anexo y palabras clave del nombre y del contenido (ver [05a-wireframes-patrones.md](../05a-wireframes-patrones.md)).
- **RF**: vínculo explícito cuando el RF cita la PAN o la PAN cita el RF; si no, inferido por similitud de vocabulario dentro del mismo módulo (hasta 3 RF, umbral mínimo). Los inferidos se marcan con `*` y deben confirmarse en la matriz de trazabilidad (`04`).
- **Campos y acciones**: se extraen de las columnas Contenido, Acciones y similares del anexo. Si el anexo no los detalla, se resume el propósito y se indican entre corchetes las acciones por defecto del patrón.

## 2. Leyenda de columnas

| Columna | Contenido |
|---|---|
| ID | Identificador PAN del anexo dueño |
| Nombre | Nombre del anexo; si falta, el ítem del mapa del sitio T03 o el nombre revisado a mano. Entre paréntesis, el estado cuando no es vigente (reemplazado, absorbido, componente embebido) |
| Portal | App en la que se usa la pantalla |
| Ruta | Ruta canónica normalizada; "(T03: ...)" si el mapa del sitio indica otra |
| Capability | Capability requerida para entrar (T02) |
| Patrón | Patrón de UI `PT-NN` (ver 05a) |
| Campos principales | Filtros, columnas, pestañas, campos, pasos o indicadores del anexo, o resumen del contenido |
| Acciones | Acciones del anexo; entre corchetes, las por defecto del patrón |
| RF | RF que implementa; `*` = vínculo inferido |
| Ola | Ola y fuente: A anexo, M mapa del sitio T03, P plan de olas, R RF vinculado |
| Origen | Anexo y línea donde se define la PAN, e ítem del mapa del sitio (SM) principal |

## 3. Partes del catálogo

| Parte | Módulo | Nombre | PAN | Familias | Líneas |
|---|---|---|---|---|---|
| [17-01-M01-PER.md](17-01-M01-PER.md) | M01 PER | Personas, titulares y cuentas | 28 | 5 | 81 |
| [17-02-M02-CAT.md](17-02-M02-CAT.md) | M02 CAT | Catálogo de servicios | 27 | 6 | 86 |
| [17-03-M03-MED.md](17-03-M03-MED.md) | M03 MED | Medición y consumos | 35 | 7 | 100 |
| [17-04-M04-TAR.md](17-04-M04-TAR.md) | M04 TAR | Tarifas y motor de cálculo | 29 | 6 | 88 |
| [17-05-M05-FAC.md](17-05-M05-FAC.md) | M05 FAC | Facturación | 47 | 8 | 118 |
| [17-06-M06-FIS.md](17-06-M06-FIS.md) | M06 FIS | Fiscal e impuestos | 41 | 7 | 106 |
| [17-07-M07-COB.md](17-07-M07-COB.md) | M07 COB | Cuenta corriente y cobranza | 36 | 8 | 107 |
| [17-08-M08-MOR.md](17-08-M08-MOR.md) | M08 MOR | Mora y financiación | 42 | 8 | 113 |
| [17-09-M09-CRM.md](17-09-M09-CRM.md) | M09 CRM | Atención (CRM) | 36 | 8 | 107 |
| [17-10-M10-TEC.md](17-10-M10-TEC.md) | M10 TEC | Técnica, campo y redes | 64 | 10 | 147 |
| [17-11-M11-VEN.md](17-11-M11-VEN.md) | M11 VEN | Ventas y presupuestos | 24 | 6 | 83 |
| [17-12-M12-CMP.md](17-12-M12-CMP.md) | M12 CMP | Compras y proveedores | 26 | 6 | 85 |
| [17-13-M13-STK.md](17-13-M13-STK.md) | M13 STK | Stock, activos y fabricación | 41 | 10 | 124 |
| [17-14-M14-TES.md](17-14-M14-TES.md) | M14 TES | Tesorería y bancos | 42 | 9 | 119 |
| [17-15-M15-CON.md](17-15-M15-CON.md) | M15 CON | Contabilidad | 40 | 8 | 111 |
| [17-16-M16-SUE.md](17-16-M16-SUE.md) | M16 SUE | Personal y sueldos | 47 | 8 | 118 |
| [17-17-M17-INS.md](17-17-M17-INS.md) | M17 INS | Institucional | 33 | 6 | 92 |
| [17-18-M18-SOC.md](17-18-M18-SOC.md) | M18 SOC | Servicios sociales y flota | 35 | 7 | 100 |
| [17-19-M19-POR.md](17-19-M19-POR.md) | M19 POR | Portal del socio y landing | 105 | 14 | 212 |
| [17-20-T01-PLA.md](17-20-T01-PLA.md) | T01 PLA | Plataforma SaaS | 25 | 5 | 78 |
| [17-21-T02-IAM.md](17-21-T02-IAM.md) | T02 IAM | Identidad, roles y auditoría | 32 | 5 | 85 |
| [17-22-T03-UXD.md](17-22-T03-UXD.md) | T03 UXD | Experiencia, marca y diccionario | 17 | 6 | 76 |
| [17-23-T04-CFG.md](17-23-T04-CFG.md) | T04 CFG | Configuración y parámetros | 35 | 6 | 94 |
| [17-24-T06-INT.md](17-24-T06-INT.md) | T06 INT | Integraciones | 20 | 4 | 67 |
| [17-25-T07-MIG.md](17-25-T07-MIG.md) | T07 MIG | Migración desde ProCoop | 23 | 5 | 76 |
| [17-26-T08-NFR.md](17-26-T08-NFR.md) | T08 NFR | No funcionales y seguridad | 18 | 4 | 65 |
| [17-27-T09-COM.md](17-27-T09-COM.md) | T09 COM | Comunidad y comunicaciones | 48 | 10 | 131 |
| [17-28-T10-BIA.md](17-28-T10-BIA.md) | T10 BIA | Reportes, BI y APIs | 25 | 5 | 78 |
| [17-29-T11-WFL.md](17-29-T11-WFL.md) | T11 WFL | Workflow, eventos y documentos | 30 | 7 | 95 |
| **Total** | 29 módulos | | **1.051** | **204** | |

## 4. Resumen por patrón, portal y ola

### 4.1 Por patrón

| Patrón | Nombre | PAN | Familias con ese patrón base |
|---|---|---|---|
| PT-01 | Listado con filtros | 344 | 101 |
| PT-02 | Ficha o detalle con pestañas | 71 | 11 |
| PT-03 | Formulario o editor | 78 | 6 |
| PT-04 | Asistente por pasos o proceso masivo | 85 | 9 |
| PT-05 | Tablero, reporte o mapa | 83 | 9 |
| PT-06 | Bandeja de trabajo | 66 | 9 |
| PT-07 | Portal del socio y del empleado (PWA) | 127 | 24 |
| PT-08 | App de campo móvil (offline) | 20 | 4 |
| PT-09 | Configuración versionada | 111 | 18 |
| PT-10 | Página pública (landing) | 40 | 8 |
| PT-11 | Modal, pestaña o componente embebido | 16 | 2 |
| PT-12 | Pantalla completa de operación (POS, tótem, turnero) | 10 | 3 |

### 4.2 Por portal

| Portal | PAN |
|---|---|
| admin | 800 |
| socio | 100 |
| plataforma | 57 |
| landing | 39 |
| empleado | 27 |
| campo | 20 |
| dispositivo | 6 |
| transversal | 2 |

### 4.3 Por ola

| Ola | PAN | Fuente anexo | Fuente T03 | Fuente plan | Fuente RF |
|---|---|---|---|---|---|
| O0 | 39 | 0 | 21 | 0 | 18 |
| O1 | 155 | 0 | 72 | 67 | 16 |
| O2 | 200 | 0 | 165 | 31 | 4 |
| O3 | 76 | 67 | 7 | 2 | 0 |
| O4 | 109 | 0 | 102 | 4 | 3 |
| O5 | 109 | 0 | 65 | 1 | 43 |
| O6 | 41 | 0 | 41 | 0 | 0 |
| O7 | 58 | 13 | 45 | 0 | 0 |
| O8 | 91 | 13 | 26 | 19 | 33 |
| O9 | 52 | 0 | 21 | 31 | 0 |
| O10 | 97 | 10 | 41 | 46 | 0 |
| O11 | 24 | 0 | 18 | 0 | 6 |

## 5. Inconsistencias detectadas en la especificación

No se corrigieron en `docs/especificacion/` (regla 1). El detalle por PAN está al final de cada parte.

| Tipo | Cantidad | Detalle |
|---|---|---|
| Rangos del plan de olas que exceden las PAN definidas | 0 | — |
| T03 §10.9 cita PAN que no existen | 0 | — |
| PAN citada como principal de un ítem del mapa del sitio con otra app o recurso | 1 | PAN-IAM-07 en SM-PWS-037. Detalle en cada parte |
| Capability del anexo distinta de la de T03 §10.9 | 0 | — |
| Ruta del anexo normalizada distinta de la canónica de T03 | 0 | — |
| PAN sin ruta navegable | 0 | — |
| PAN sin capability ni regla de acceso en el anexo | 0 |  |
| Plan de olas con menos PAN que el anexo | 0 | — |
| RF que citan PAN | — | Las tablas de RF casi no citan PAN. Los vínculos explícitos (352 PAN) salen de filas del anexo que citan a la vez PAN y RF (equivalencias, fichas de pantalla); el resto son inferidos y deben validarse en `04` |

## 6. Pendientes y limitaciones

- Los vínculos RF inferidos (`*`) son una propuesta: deben confirmarse al completar la matriz `04-matriz-trazabilidad`.
- 713 PAN no detallan campos en el anexo: se muestra el resumen del propósito; el detalle se cerrará en el diseño de cada pantalla.
- 507 PAN no detallan acciones: se indican las acciones por defecto del patrón entre corchetes.
- Las PAN reemplazadas, absorbidas o embebidas se conservan en el catálogo con su estado (regla 4).

## 7. Tabla de cobertura

Universo: 1.051 PAN definidas en la §10 de 29 anexos (M01 a M19, T01 a T04 y T06 a T11; T05 y T12 no definen pantallas). Se contó cada ID `PAN-<COD>-NN` con definición propia (fila de tabla o ficha `### PAN-...`); las menciones o redefiniciones en otras tablas no suman. No hay IDs repetidos entre anexos.

| Indicador | Incluidos | Total | Cobertura | Excluidos y motivo |
|---|---|---|---|---|
| PAN en el catálogo | 1.051 | 1.051 | 100,0 % | — |
| PAN con patrón asignado | 1.051 | 1.051 | 100,0 % | — |
| PAN con familia asignada | 1.051 | 1.051 | 100,0 % | — |
| PAN con patrón y familia | 1.051 | 1.051 | 100,0 % | — |
| PAN con ruta navegable propia | 1.018 | 1.051 | 96,9 % | 33 modales, pestañas o componentes que se abren desde otra pantalla y no tienen ruta propia (AL-07) |
| PAN con capability `modulo.recurso.accion` | 1.000 | 1.051 | 95,1 % | 51 con regla de acceso sin capability (pública, sesión, token, dispositivo o contextual, según el anexo); 0 sin dato |
| PAN con capability o regla de acceso declarada | 1.051 | 1.051 | 100,0 % | — |
| PAN con ola | 1.051 | 1.051 | 100,0 % | — |
| PAN con al menos un RF (explícito o inferido) | 1.051 | 1.051 | 100,0 % | — |
| PAN con RF explícito | 352 | 1.051 | 33,5 % | El resto tiene RF inferido; ver sección 5 |
| PAN con campos detallados por el anexo | 338 | 1.051 | 32,2 % | El resto muestra el resumen del propósito |
| PAN con acciones detalladas por el anexo | 544 | 1.051 | 51,8 % | El resto muestra las acciones del patrón |

| Indicador | Incluidos | Total | Cobertura |
|---|---|---|---|
| Módulos con parte propia | 29 | 29 | 100,0 % |
| Familias de pantallas definidas | 204 | 204 | 100,0 % |
