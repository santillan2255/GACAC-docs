# Catálogo de endpoints · M16 · Personal y sueldos

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Liquidar los haberes del personal en relación de dependencia de cada cooperativa (tenant), cumplir las obligaciones laborales, de la seguridad social y de Ganancias de 4.ª categoría que la normativa argentina impone al empleador, y registrar su efecto en contabilidad, centros de costo, servicios, tesorería y presupuesto sin depender de otro sistema (BASE §104.2). El módulo cubre el ciclo completo:

1. Legajo del empleado y su relación con una o varias empresas empleadoras del tenant.
2. Estructura laboral parametrizada y versionada por vigencia: sindicatos, convenios colectivos, categorías, escalas, antigüedad, cargos, áreas, jornadas, turnos, guardias, obras sociales y salario mínimo.
3. Variables y conceptos con fórmulas versionadas, simulación previa a la publicación (AGR-009) y aplicación de aumentos.
4. Novedades del período, incluidas las que nacen en partes de cuadrilla, órdenes de trabajo y flota; licencias y vacaciones.
5. Liquidaciones mensuales o quincenales, SAC, vacaciones, final por egreso con indemnizaciones de la LCT 20.744, complementarias y rectificativas, más el simulador.
6. Ganancias de 4.ª categoría (deducciones, F.572 web / SIRADIG, retención mensual, liquidación anual y final, F.1357/F.1359).
7. Seguridad social: aportes, contribuciones, ART y siniestros; Libro de Sueldos Digital, archivo para F.931 (SICOSS), SICORE de sueldos y archivos sindicales.
8. Recibos con el contenido del art. 140 LCT, firma, entrega digital con constancia y portal del empleado.
9. Pago de haberes (solicitud a Tesorería M14, que genera el archivo bancario y concilia) y asientos de sueldos (M15).
10. Certificaciones del art. 80 LCT y egreso.
11. Gestión de RRHH con GLMSUIT RRHH como referencia: evaluaciones, objetivos, sanciones, sumarios, accidentes y juicios laborales.
12. Aprobaciones con separación de funciones (liquidador, aprobador, tesorero) y reportes de costo laboral.

Detalle completo en el anexo M16, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m16-sue).

| Dato | Valor |
|---|---|
| Endpoints | 271 |
| Por método | DELETE 27, GET 98, PATCH 32, POST 110, PUT 4 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 3 |
| Con requisito inferido (a confirmar) | 236 |
| Sin requisito identificable | 32 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 271 | Listar legajos con filtros.; Alta (con búsqueda/creación de persona); Ficha (secciones sensibles según permiso)… |

## Cómo leer cada ficha

Cada endpoint tiene una ficha con estos datos:

| Dato | De dónde sale |
|---|---|
| **Qué hace** | La descripción de la fila API del anexo (§11), seguida de una frase armada con el método HTTP, la forma de la ruta y el nombre de la colección en T05. |
| **Para qué sirve** | El requisito funcional (RF) que el endpoint implementa, con su texto del §5 del anexo. Si la fila API o el anexo lo vinculan, se cita tal cual. Si no, se elige el RF del anexo con más palabras en común y se marca *a confirmar*. |
| **Quién lo usa** | El canal, según el prefijo de la ruta (backoffice, portal del socio, app de campo, consola de plataforma, terceros, público), y el permiso (capability) de T02. |
| **Recibe / Devuelve** | Parámetros, cuerpo y respuesta exitosa del contrato OpenAPI. |
| **Pantallas** | Pantallas del catálogo 4.5 que exigen el mismo permiso. |
| **Ola y fuente** | Ola de construcción y línea de la fila API en el anexo. |

<a id="grupo-1"></a>

## API

271 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-SUE-03](#API-SUE-03) | GET | `/api/admin/sue/employees` | Listar legajos con filtros. |
| [API-SUE-05](#API-SUE-05) | POST | `/api/admin/sue/employees` | Alta (con búsqueda/creación de persona) |
| [API-SUE-04](#API-SUE-04) | GET | `/api/admin/sue/employees/{id}` | Ficha (secciones sensibles según permiso) |
| [API-SUE-06](#API-SUE-06) | PATCH | `/api/admin/sue/employees/{id}` | Editar datos no vigentes. |
| [API-SUE-07](#API-SUE-07) | POST | `/api/admin/sue/employees/{id}/assignments` | Cambio laboral con fecha efectiva. |
| [API-SUE-08](#API-SUE-08) | PUT | `/api/admin/sue/employees/{id}/cost-allocations` | Distribución por centros de costo. |
| [API-SUE-09](#API-SUE-09) | GET | `/api/admin/sue/employees/{id}/family-members` | Familiares. |
| [API-SUE-09-b](#API-SUE-09-b) | POST | `/api/admin/sue/employees/{id}/family-members` | Familiares. |
| [API-SUE-09-c](#API-SUE-09-c) | GET | `/api/admin/sue/employees/{id}/family-members/{fid}` | Familiares. |
| [API-SUE-09-d](#API-SUE-09-d) | PATCH | `/api/admin/sue/employees/{id}/family-members/{fid}` | Familiares. |
| [API-SUE-10](#API-SUE-10) | GET | `/api/admin/sue/employees/{id}/pay-accounts` | Cuentas de acreditación. |
| [API-SUE-10-b](#API-SUE-10-b) | POST | `/api/admin/sue/employees/{id}/pay-accounts` | Cuentas de acreditación. |
| [API-SUE-10-c](#API-SUE-10-c) | GET | `/api/admin/sue/employees/{id}/pay-accounts/{aid}` | Cuentas de acreditación. |
| [API-SUE-10-d](#API-SUE-10-d) | PATCH | `/api/admin/sue/employees/{id}/pay-accounts/{aid}` | Cuentas de acreditación. |
| [API-SUE-11](#API-SUE-11) | GET | `/api/admin/sue/employees/{id}/documents` | Documentación. |
| [API-SUE-11-b](#API-SUE-11-b) | POST | `/api/admin/sue/employees/{id}/documents` | Documentación. |
| [API-SUE-12](#API-SUE-12) | POST | `/api/admin/sue/employee-documents/{docId}/authorize` | Autorizar/rechazar documento. |
| [API-SUE-12-b](#API-SUE-12-b) | POST | `/api/admin/sue/employee-documents/{docId}/reject` | Autorizar/rechazar documento. |
| [API-SUE-13](#API-SUE-13) | GET | `/api/admin/sue/employees/{id}/notes` | Observaciones. |
| [API-SUE-13-b](#API-SUE-13-b) | POST | `/api/admin/sue/employees/{id}/notes` | Observaciones. |
| [API-SUE-14](#API-SUE-14) | PUT | `/api/admin/sue/employees/{id}/shifts` | Turnos asignados. |
| [API-SUE-15](#API-SUE-15) | POST | `/api/admin/sue/employees/{id}/employment-status` | Situación de revista. |
| [API-SUE-16](#API-SUE-16) | PUT | `/api/admin/sue/employees/{id}/extras` | Extras. |
| [API-SUE-17](#API-SUE-17) | GET | `/api/admin/sue/employees/{id}/deduction-plans` | Planes de descuento. |
| [API-SUE-17-b](#API-SUE-17-b) | POST | `/api/admin/sue/employees/{id}/deduction-plans` | Planes de descuento. |
| [API-SUE-17-c](#API-SUE-17-c) | GET | `/api/admin/sue/employees/{id}/deduction-plans/{pid}` | Planes de descuento. |
| [API-SUE-17-d](#API-SUE-17-d) | PATCH | `/api/admin/sue/employees/{id}/deduction-plans/{pid}` | Planes de descuento. |
| [API-SUE-18](#API-SUE-18) | PUT | `/api/admin/sue/supervision-links` | Encargados y operarios. |
| [API-SUE-19](#API-SUE-19) | POST | `/api/admin/sue/employees/import` | Importación Excel (preview/confirm) |
| [API-SUE-20](#API-SUE-20) | POST | `/api/admin/sue/employees/{id}/reinstate` | Reincorporar. |
| [API-SUE-21](#API-SUE-21) | GET | `/api/admin/sue/unions` | Sindicatos. |
| [API-SUE-21-b](#API-SUE-21-b) | POST | `/api/admin/sue/unions` | Sindicatos. |
| [API-SUE-21-c](#API-SUE-21-c) | GET | `/api/admin/sue/unions/{id}` | Sindicatos. |
| [API-SUE-21-e](#API-SUE-21-e) | DELETE | `/api/admin/sue/unions/{id}` | Sindicatos. |
| [API-SUE-21-d](#API-SUE-21-d) | PATCH | `/api/admin/sue/unions/{id}` | Sindicatos. |
| [API-SUE-22](#API-SUE-22) | GET | `/api/admin/sue/labor-agreements` | Convenios (+ /:id/validate) |
| [API-SUE-22-b](#API-SUE-22-b) | POST | `/api/admin/sue/labor-agreements` | Convenios (+ /:id/validate) |
| [API-SUE-22-c](#API-SUE-22-c) | GET | `/api/admin/sue/labor-agreements/{id}` | Convenios (+ /:id/validate) |
| [API-SUE-22-e](#API-SUE-22-e) | DELETE | `/api/admin/sue/labor-agreements/{id}` | Convenios (+ /:id/validate) |
| [API-SUE-22-d](#API-SUE-22-d) | PATCH | `/api/admin/sue/labor-agreements/{id}` | Convenios (+ /:id/validate) |
| [API-SUE-23](#API-SUE-23) | GET | `/api/admin/sue/categories` | Categorías. |
| [API-SUE-23-b](#API-SUE-23-b) | POST | `/api/admin/sue/categories` | Categorías. |
| [API-SUE-23-c](#API-SUE-23-c) | GET | `/api/admin/sue/categories/{id}` | Categorías. |
| [API-SUE-23-e](#API-SUE-23-e) | DELETE | `/api/admin/sue/categories/{id}` | Categorías. |
| [API-SUE-23-d](#API-SUE-23-d) | PATCH | `/api/admin/sue/categories/{id}` | Categorías. |
| [API-SUE-24](#API-SUE-24) | GET | `/api/admin/sue/salary-scales` | Escalas. |
| [API-SUE-24-b](#API-SUE-24-b) | POST | `/api/admin/sue/salary-scales` | Escalas. |
| [API-SUE-24-c](#API-SUE-24-c) | GET | `/api/admin/sue/salary-scales/{id}` | Escalas. |
| [API-SUE-24-e](#API-SUE-24-e) | DELETE | `/api/admin/sue/salary-scales/{id}` | Escalas. |
| [API-SUE-24-d](#API-SUE-24-d) | PATCH | `/api/admin/sue/salary-scales/{id}` | Escalas. |
| [API-SUE-24-f](#API-SUE-24-f) | POST | `/api/admin/sue/salary-scales/{id}/submit` | Escalas. |
| [API-SUE-24-g](#API-SUE-24-g) | POST | `/api/admin/sue/salary-scales/{id}/approve` | Escalas. |
| [API-SUE-25](#API-SUE-25) | GET | `/api/admin/sue/seniority-scales` | Antigüedad. |
| [API-SUE-25-b](#API-SUE-25-b) | POST | `/api/admin/sue/seniority-scales` | Antigüedad. |
| [API-SUE-25-c](#API-SUE-25-c) | GET | `/api/admin/sue/seniority-scales/{id}` | Antigüedad. |
| [API-SUE-25-e](#API-SUE-25-e) | DELETE | `/api/admin/sue/seniority-scales/{id}` | Antigüedad. |
| [API-SUE-25-d](#API-SUE-25-d) | PATCH | `/api/admin/sue/seniority-scales/{id}` | Antigüedad. |
| [API-SUE-26](#API-SUE-26) | GET | `/api/admin/sue/positions` | Cargos, áreas, turnos. |
| [API-SUE-26-b](#API-SUE-26-b) | POST | `/api/admin/sue/positions` | Cargos, áreas, turnos. |
| [API-SUE-26-c](#API-SUE-26-c) | GET | `/api/admin/sue/positions/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-e](#API-SUE-26-e) | DELETE | `/api/admin/sue/positions/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-d](#API-SUE-26-d) | PATCH | `/api/admin/sue/positions/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-f](#API-SUE-26-f) | GET | `/api/admin/sue/work-areas` | Cargos, áreas, turnos. |
| [API-SUE-26-g](#API-SUE-26-g) | POST | `/api/admin/sue/work-areas` | Cargos, áreas, turnos. |
| [API-SUE-26-h](#API-SUE-26-h) | GET | `/api/admin/sue/work-areas/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-j](#API-SUE-26-j) | DELETE | `/api/admin/sue/work-areas/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-i](#API-SUE-26-i) | PATCH | `/api/admin/sue/work-areas/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-k](#API-SUE-26-k) | GET | `/api/admin/sue/shifts` | Cargos, áreas, turnos. |
| [API-SUE-26-l](#API-SUE-26-l) | POST | `/api/admin/sue/shifts` | Cargos, áreas, turnos. |
| [API-SUE-26-m](#API-SUE-26-m) | GET | `/api/admin/sue/shifts/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-o](#API-SUE-26-o) | DELETE | `/api/admin/sue/shifts/{id}` | Cargos, áreas, turnos. |
| [API-SUE-26-n](#API-SUE-26-n) | PATCH | `/api/admin/sue/shifts/{id}` | Cargos, áreas, turnos. |
| [API-SUE-27](#API-SUE-27) | GET | `/api/admin/sue/health-insurers` | Obras sociales, motivos. |
| [API-SUE-27-b](#API-SUE-27-b) | POST | `/api/admin/sue/health-insurers` | Obras sociales, motivos. |
| [API-SUE-27-c](#API-SUE-27-c) | GET | `/api/admin/sue/health-insurers/{id}` | Obras sociales, motivos. |
| [API-SUE-27-e](#API-SUE-27-e) | DELETE | `/api/admin/sue/health-insurers/{id}` | Obras sociales, motivos. |
| [API-SUE-27-d](#API-SUE-27-d) | PATCH | `/api/admin/sue/health-insurers/{id}` | Obras sociales, motivos. |
| [API-SUE-27-f](#API-SUE-27-f) | GET | `/api/admin/sue/termination-reasons` | Obras sociales, motivos. |
| [API-SUE-27-g](#API-SUE-27-g) | POST | `/api/admin/sue/termination-reasons` | Obras sociales, motivos. |
| [API-SUE-27-h](#API-SUE-27-h) | GET | `/api/admin/sue/termination-reasons/{id}` | Obras sociales, motivos. |
| [API-SUE-27-j](#API-SUE-27-j) | DELETE | `/api/admin/sue/termination-reasons/{id}` | Obras sociales, motivos. |
| [API-SUE-27-i](#API-SUE-27-i) | PATCH | `/api/admin/sue/termination-reasons/{id}` | Obras sociales, motivos. |
| [API-SUE-28](#API-SUE-28) | GET | `/api/admin/sue/official-tables/{key}` | Tablas oficiales adoptadas. |
| [API-SUE-29](#API-SUE-29) | POST | `/api/admin/sue/official-tables/{key}/adopt` | Adoptar versión. |
| [API-SUE-30](#API-SUE-30) | GET | `/api/admin/sue/variables` | Variables (+ /:id/rename) |
| [API-SUE-30-b](#API-SUE-30-b) | POST | `/api/admin/sue/variables` | Variables (+ /:id/rename) |
| [API-SUE-30-c](#API-SUE-30-c) | GET | `/api/admin/sue/variables/{id}` | Variables (+ /:id/rename) |
| [API-SUE-30-e](#API-SUE-30-e) | DELETE | `/api/admin/sue/variables/{id}` | Variables (+ /:id/rename) |
| [API-SUE-30-d](#API-SUE-30-d) | PATCH | `/api/admin/sue/variables/{id}` | Variables (+ /:id/rename) |
| [API-SUE-31](#API-SUE-31) | GET | `/api/admin/sue/concepts` | Conceptos. |
| [API-SUE-31-b](#API-SUE-31-b) | POST | `/api/admin/sue/concepts` | Conceptos. |
| [API-SUE-31-c](#API-SUE-31-c) | GET | `/api/admin/sue/concepts/{id}` | Conceptos. |
| [API-SUE-31-e](#API-SUE-31-e) | DELETE | `/api/admin/sue/concepts/{id}` | Conceptos. |
| [API-SUE-31-d](#API-SUE-31-d) | PATCH | `/api/admin/sue/concepts/{id}` | Conceptos. |
| [API-SUE-32](#API-SUE-32) | POST | `/api/admin/sue/formulas/validate` | Validar fórmula y dependencias. |
| [API-SUE-33](#API-SUE-33) | POST | `/api/admin/sue/formulas/test` | Probar fórmula sobre un empleado. |
| [API-SUE-34](#API-SUE-34) | POST | `/api/admin/sue/formulas/assist` | Sugerencia de IA (sin datos personales) |
| [API-SUE-35](#API-SUE-35) | GET | `/api/admin/sue/payroll-types` | Tipos de liquidación. |
| [API-SUE-35-b](#API-SUE-35-b) | POST | `/api/admin/sue/payroll-types` | Tipos de liquidación. |
| [API-SUE-35-c](#API-SUE-35-c) | GET | `/api/admin/sue/payroll-types/{id}` | Tipos de liquidación. |
| [API-SUE-35-e](#API-SUE-35-e) | DELETE | `/api/admin/sue/payroll-types/{id}` | Tipos de liquidación. |
| [API-SUE-35-d](#API-SUE-35-d) | PATCH | `/api/admin/sue/payroll-types/{id}` | Tipos de liquidación. |
| [API-SUE-36](#API-SUE-36) | GET | `/api/admin/sue/config-versions` | Versiones. |
| [API-SUE-36-b](#API-SUE-36-b) | POST | `/api/admin/sue/config-versions` | Versiones. |
| [API-SUE-37](#API-SUE-37) | POST | `/api/admin/sue/config-versions/{id}/simulate` | Ciclo de versión. |
| [API-SUE-37-b](#API-SUE-37-b) | POST | `/api/admin/sue/config-versions/{id}/submit` | Ciclo de versión. |
| [API-SUE-37-c](#API-SUE-37-c) | POST | `/api/admin/sue/config-versions/{id}/publish` | Ciclo de versión. |
| [API-SUE-37-d](#API-SUE-37-d) | POST | `/api/admin/sue/config-versions/{id}/discard` | Ciclo de versión. |
| [API-SUE-38](#API-SUE-38) | POST | `/api/admin/sue/salary-increases` | Aplicar aumentos. |
| [API-SUE-38-b](#API-SUE-38-b) | POST | `/api/admin/sue/salary-increases/{id}/preview` | Aplicar aumentos. |
| [API-SUE-38-c](#API-SUE-38-c) | POST | `/api/admin/sue/salary-increases/{id}/apply` | Aplicar aumentos. |
| [API-SUE-39](#API-SUE-39) | GET | `/api/admin/sue/novelty-types` | Tipos. |
| [API-SUE-39-b](#API-SUE-39-b) | POST | `/api/admin/sue/novelty-types` | Tipos. |
| [API-SUE-39-c](#API-SUE-39-c) | GET | `/api/admin/sue/novelty-types/{id}` | Tipos. |
| [API-SUE-39-e](#API-SUE-39-e) | DELETE | `/api/admin/sue/novelty-types/{id}` | Tipos. |
| [API-SUE-39-d](#API-SUE-39-d) | PATCH | `/api/admin/sue/novelty-types/{id}` | Tipos. |
| [API-SUE-39-f](#API-SUE-39-f) | GET | `/api/admin/sue/leave-causes` | Tipos. |
| [API-SUE-39-g](#API-SUE-39-g) | POST | `/api/admin/sue/leave-causes` | Tipos. |
| [API-SUE-39-h](#API-SUE-39-h) | GET | `/api/admin/sue/leave-causes/{id}` | Tipos. |
| [API-SUE-39-j](#API-SUE-39-j) | DELETE | `/api/admin/sue/leave-causes/{id}` | Tipos. |
| [API-SUE-39-i](#API-SUE-39-i) | PATCH | `/api/admin/sue/leave-causes/{id}` | Tipos. |
| [API-SUE-40](#API-SUE-40) | GET | `/api/admin/sue/novelties` | Novedades. |
| [API-SUE-40-b](#API-SUE-40-b) | POST | `/api/admin/sue/novelties` | Novedades. |
| [API-SUE-40-c](#API-SUE-40-c) | PATCH | `/api/admin/sue/novelties` | Novedades. |
| [API-SUE-41](#API-SUE-41) | POST | `/api/admin/sue/novelties/approve` | Acciones masivas. |
| [API-SUE-41-b](#API-SUE-41-b) | POST | `/api/admin/sue/novelties/void` | Acciones masivas. |
| [API-SUE-42](#API-SUE-42) | POST | `/api/admin/sue/novelty-imports` | Importar (Excel, OT, flota, fichadas, anticipos) |
| [API-SUE-42-b](#API-SUE-42-b) | POST | `/api/admin/sue/novelty-imports/{id}/confirm` | Importar (Excel, OT, flota, fichadas, anticipos) |
| [API-SUE-43](#API-SUE-43) | GET | `/api/admin/sue/time-punches` | Fichadas. |
| [API-SUE-43-b](#API-SUE-43-b) | POST | `/api/admin/sue/time-punches` | Fichadas. |
| [API-SUE-43-c](#API-SUE-43-c) | POST | `/api/admin/sue/time-punches/process` | Fichadas. |
| [API-SUE-44](#API-SUE-44) | GET | `/api/admin/sue/extra-tasks` | Tareas extra. |
| [API-SUE-44-b](#API-SUE-44-b) | POST | `/api/admin/sue/extra-tasks` | Tareas extra. |
| [API-SUE-44-c](#API-SUE-44-c) | GET | `/api/admin/sue/extra-tasks/{id}` | Tareas extra. |
| [API-SUE-44-e](#API-SUE-44-e) | DELETE | `/api/admin/sue/extra-tasks/{id}` | Tareas extra. |
| [API-SUE-44-d](#API-SUE-44-d) | PATCH | `/api/admin/sue/extra-tasks/{id}` | Tareas extra. |
| [API-SUE-45](#API-SUE-45) | GET | `/api/admin/sue/leave-requests` | Licencias (admin) |
| [API-SUE-45-b](#API-SUE-45-b) | POST | `/api/admin/sue/leave-requests` | Licencias (admin) |
| [API-SUE-46](#API-SUE-46) | POST | `/api/admin/sue/leave-requests/{id}/approve` | Decisiones. |
| [API-SUE-46-b](#API-SUE-46-b) | POST | `/api/admin/sue/leave-requests/{id}/reject` | Decisiones. |
| [API-SUE-46-c](#API-SUE-46-c) | POST | `/api/admin/sue/leave-requests/{id}/interrupt` | Decisiones. |
| [API-SUE-47](#API-SUE-47) | GET | `/api/admin/sue/vacation-balances` | Saldos. |
| [API-SUE-48](#API-SUE-48) | GET | `/api/admin/sue/pay-periods` | Períodos. |
| [API-SUE-48-b](#API-SUE-48-b) | POST | `/api/admin/sue/pay-periods` | Períodos. |
| [API-SUE-48-c](#API-SUE-48-c) | POST | `/api/admin/sue/pay-periods/{id}/close` | Períodos. |
| [API-SUE-48-d](#API-SUE-48-d) | POST | `/api/admin/sue/pay-periods/{id}/reopen` | Períodos. |
| [API-SUE-49](#API-SUE-49) | GET | `/api/admin/sue/payroll-runs` | Liquidaciones. |
| [API-SUE-49-b](#API-SUE-49-b) | POST | `/api/admin/sue/payroll-runs` | Liquidaciones. |
| [API-SUE-50](#API-SUE-50) | POST | `/api/admin/sue/payroll-runs/{id}/calculate` | Lanzar cálculo (job) |
| [API-SUE-51](#API-SUE-51) | POST | `/api/admin/sue/payroll-runs/{id}/employees/{eid}/recalculate` | Recalcular empleado. |
| [API-SUE-52](#API-SUE-52) | POST | `/api/admin/sue/payroll-runs/{id}/submit` | Ciclo de la liquidación. |
| [API-SUE-52-b](#API-SUE-52-b) | POST | `/api/admin/sue/payroll-runs/{id}/approve` | Ciclo de la liquidación. |
| [API-SUE-52-c](#API-SUE-52-c) | POST | `/api/admin/sue/payroll-runs/{id}/return` | Ciclo de la liquidación. |
| [API-SUE-52-d](#API-SUE-52-d) | POST | `/api/admin/sue/payroll-runs/{id}/void` | Ciclo de la liquidación. |
| [API-SUE-52-e](#API-SUE-52-e) | POST | `/api/admin/sue/payroll-runs/{id}/close` | Ciclo de la liquidación. |
| [API-SUE-53](#API-SUE-53) | GET | `/api/admin/sue/payroll-runs/{id}/checks` | Controles, comparativo, vista previa de asiento. |
| [API-SUE-53-b](#API-SUE-53-b) | GET | `/api/admin/sue/payroll-runs/{id}/comparison` | Controles, comparativo, vista previa de asiento. |
| [API-SUE-53-c](#API-SUE-53-c) | GET | `/api/admin/sue/payroll-runs/{id}/accounting-preview` | Controles, comparativo, vista previa de asiento. |
| [API-SUE-54](#API-SUE-54) | POST | `/api/admin/sue/simulations` | Simulación. |
| [API-SUE-55](#API-SUE-55) | GET | `/api/admin/sue/payslips` | Recibos. |
| [API-SUE-55-b](#API-SUE-55-b) | GET | `/api/admin/sue/payslips/{id}` | Recibos. |
| [API-SUE-55-c](#API-SUE-55-c) | GET | `/api/admin/sue/payslips/{id}/pdf` | Recibos. |
| [API-SUE-55-d](#API-SUE-55-d) | GET | `/api/admin/sue/payslips/{id}/trace` | Recibos. |
| [API-SUE-56](#API-SUE-56) | POST | `/api/admin/sue/payslips/{id}/resend` | Reenviar, rectificar. |
| [API-SUE-56-b](#API-SUE-56-b) | POST | `/api/admin/sue/payslips/{id}/rectify` | Reenviar, rectificar. |
| [API-SUE-57](#API-SUE-57) | POST | `/api/admin/sue/signature-batches` | Lote de firma del empleador (crea las solicitudes en T11 por API-WFL-75) |
| [API-SUE-58](#API-SUE-58) | POST | `/api/admin/sue/terminations` | Egresos. |
| [API-SUE-58-b](#API-SUE-58-b) | POST | `/api/admin/sue/terminations/{id}/simulate` | Egresos. |
| [API-SUE-58-c](#API-SUE-58-c) | POST | `/api/admin/sue/terminations/{id}/approve` | Egresos. |
| [API-SUE-58-d](#API-SUE-58-d) | POST | `/api/admin/sue/terminations/{id}/cancel` | Egresos. |
| [API-SUE-59](#API-SUE-59) | GET | `/api/admin/sue/income-tax/employees/{id}/calculator` | Calculadora. |
| [API-SUE-60](#API-SUE-60) | POST | `/api/admin/sue/income-tax/f572-imports` | Importar SIRADIG. |
| [API-SUE-61](#API-SUE-61) | POST | `/api/admin/sue/income-tax/annual-settlements` | Liquidación anual. |
| [API-SUE-62](#API-SUE-62) | GET | `/api/admin/sue/income-tax/differences` | Diferencias mes a mes (XLSX) |
| [API-SUE-63](#API-SUE-63) | POST | `/api/admin/sue/filings` | Generar LSD, SICOSS, SICORE, F.1357/F.1359, sindicatos, ART. |
| [API-SUE-64](#API-SUE-64) | POST | `/api/admin/sue/filings/{id}/approve` | Aprobar, cargar acuse, rectificar. |
| [API-SUE-64-b](#API-SUE-64-b) | POST | `/api/admin/sue/filings/{id}/acknowledge` | Aprobar, cargar acuse, rectificar. |
| [API-SUE-64-c](#API-SUE-64-c) | POST | `/api/admin/sue/filings/{id}/rectify` | Aprobar, cargar acuse, rectificar. |
| [API-SUE-65](#API-SUE-65) | GET | `/api/admin/sue/filings/{id}/file` | Descargar archivo (URL firmada) |
| [API-SUE-67](#API-SUE-67) | GET | `/api/admin/sue/payment-requests` | Seguimiento. |
| [API-SUE-66](#API-SUE-66) | POST | `/api/admin/sue/payment-requests` | Pago de haberes y obligaciones. |
| [API-SUE-66-b](#API-SUE-66-b) | POST | `/api/admin/sue/payment-requests/{id}/cancel` | Pago de haberes y obligaciones. |
| [API-SUE-66-c](#API-SUE-66-c) | POST | `/api/admin/sue/payment-requests/{id}/retry-rejected` | Pago de haberes y obligaciones. |
| [API-SUE-68](#API-SUE-68) | GET | `/api/admin/sue/accounting-rules` | Reglas contables. |
| [API-SUE-68-b](#API-SUE-68-b) | POST | `/api/admin/sue/accounting-rules` | Reglas contables. |
| [API-SUE-68-c](#API-SUE-68-c) | GET | `/api/admin/sue/accounting-rules/{id}` | Reglas contables. |
| [API-SUE-68-e](#API-SUE-68-e) | DELETE | `/api/admin/sue/accounting-rules/{id}` | Reglas contables. |
| [API-SUE-68-d](#API-SUE-68-d) | PATCH | `/api/admin/sue/accounting-rules/{id}` | Reglas contables. |
| [API-SUE-68-f](#API-SUE-68-f) | POST | `/api/admin/sue/accounting-rules/validate` | Reglas contables. |
| [API-SUE-69](#API-SUE-69) | GET | `/api/admin/sue/certificates` | Certificados y constancias. |
| [API-SUE-69-b](#API-SUE-69-b) | POST | `/api/admin/sue/certificates` | Certificados y constancias. |
| [API-SUE-69-c](#API-SUE-69-c) | POST | `/api/admin/sue/certificates/{id}/issue` | Certificados y constancias. |
| [API-SUE-70](#API-SUE-70) | GET | `/api/admin/sue/hr/performance-templates` | Evaluaciones y objetivos. |
| [API-SUE-70-b](#API-SUE-70-b) | POST | `/api/admin/sue/hr/performance-templates` | Evaluaciones y objetivos. |
| [API-SUE-70-c](#API-SUE-70-c) | GET | `/api/admin/sue/hr/performance-templates/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-e](#API-SUE-70-e) | DELETE | `/api/admin/sue/hr/performance-templates/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-d](#API-SUE-70-d) | PATCH | `/api/admin/sue/hr/performance-templates/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-f](#API-SUE-70-f) | GET | `/api/admin/sue/hr/cycles` | Evaluaciones y objetivos. |
| [API-SUE-70-g](#API-SUE-70-g) | POST | `/api/admin/sue/hr/cycles` | Evaluaciones y objetivos. |
| [API-SUE-70-h](#API-SUE-70-h) | GET | `/api/admin/sue/hr/cycles/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-j](#API-SUE-70-j) | DELETE | `/api/admin/sue/hr/cycles/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-i](#API-SUE-70-i) | PATCH | `/api/admin/sue/hr/cycles/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-k](#API-SUE-70-k) | GET | `/api/admin/sue/hr/reviews` | Evaluaciones y objetivos. |
| [API-SUE-70-l](#API-SUE-70-l) | POST | `/api/admin/sue/hr/reviews` | Evaluaciones y objetivos. |
| [API-SUE-70-m](#API-SUE-70-m) | GET | `/api/admin/sue/hr/reviews/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-o](#API-SUE-70-o) | DELETE | `/api/admin/sue/hr/reviews/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-n](#API-SUE-70-n) | PATCH | `/api/admin/sue/hr/reviews/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-p](#API-SUE-70-p) | GET | `/api/admin/sue/hr/objectives` | Evaluaciones y objetivos. |
| [API-SUE-70-q](#API-SUE-70-q) | POST | `/api/admin/sue/hr/objectives` | Evaluaciones y objetivos. |
| [API-SUE-70-r](#API-SUE-70-r) | GET | `/api/admin/sue/hr/objectives/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-t](#API-SUE-70-t) | DELETE | `/api/admin/sue/hr/objectives/{id}` | Evaluaciones y objetivos. |
| [API-SUE-70-s](#API-SUE-70-s) | PATCH | `/api/admin/sue/hr/objectives/{id}` | Evaluaciones y objetivos. |
| [API-SUE-71](#API-SUE-71) | GET | `/api/admin/sue/hr/disciplinary-actions` | Disciplina. |
| [API-SUE-71-b](#API-SUE-71-b) | POST | `/api/admin/sue/hr/disciplinary-actions` | Disciplina. |
| [API-SUE-71-c](#API-SUE-71-c) | GET | `/api/admin/sue/hr/disciplinary-actions/{id}` | Disciplina. |
| [API-SUE-71-e](#API-SUE-71-e) | DELETE | `/api/admin/sue/hr/disciplinary-actions/{id}` | Disciplina. |
| [API-SUE-71-d](#API-SUE-71-d) | PATCH | `/api/admin/sue/hr/disciplinary-actions/{id}` | Disciplina. |
| [API-SUE-71-f](#API-SUE-71-f) | GET | `/api/admin/sue/hr/inquiries` | Disciplina. |
| [API-SUE-71-g](#API-SUE-71-g) | POST | `/api/admin/sue/hr/inquiries` | Disciplina. |
| [API-SUE-71-h](#API-SUE-71-h) | GET | `/api/admin/sue/hr/inquiries/{id}` | Disciplina. |
| [API-SUE-71-j](#API-SUE-71-j) | DELETE | `/api/admin/sue/hr/inquiries/{id}` | Disciplina. |
| [API-SUE-71-i](#API-SUE-71-i) | PATCH | `/api/admin/sue/hr/inquiries/{id}` | Disciplina. |
| [API-SUE-72](#API-SUE-72) | GET | `/api/admin/sue/hr/work-accidents` | Accidentes. |
| [API-SUE-72-b](#API-SUE-72-b) | POST | `/api/admin/sue/hr/work-accidents` | Accidentes. |
| [API-SUE-72-c](#API-SUE-72-c) | GET | `/api/admin/sue/hr/work-accidents/{id}` | Accidentes. |
| [API-SUE-72-e](#API-SUE-72-e) | DELETE | `/api/admin/sue/hr/work-accidents/{id}` | Accidentes. |
| [API-SUE-72-d](#API-SUE-72-d) | PATCH | `/api/admin/sue/hr/work-accidents/{id}` | Accidentes. |
| [API-SUE-73](#API-SUE-73) | GET | `/api/admin/sue/hr/labor-lawsuits` | Juicios. |
| [API-SUE-73-b](#API-SUE-73-b) | POST | `/api/admin/sue/hr/labor-lawsuits` | Juicios. |
| [API-SUE-73-c](#API-SUE-73-c) | GET | `/api/admin/sue/hr/labor-lawsuits/{id}` | Juicios. |
| [API-SUE-73-e](#API-SUE-73-e) | DELETE | `/api/admin/sue/hr/labor-lawsuits/{id}` | Juicios. |
| [API-SUE-73-d](#API-SUE-73-d) | PATCH | `/api/admin/sue/hr/labor-lawsuits/{id}` | Juicios. |
| [API-SUE-74](#API-SUE-74) | GET | `/api/admin/sue/reports/{reportKey}` | Informes del §15. |
| [API-SUE-75](#API-SUE-75) | POST | `/api/admin/sue/external-payrolls` | CU-28. |
| [API-SUE-75-b](#API-SUE-75-b) | POST | `/api/admin/sue/external-payrolls/{id}/approve` | CU-28. |
| [API-SUE-75-c](#API-SUE-75-c) | POST | `/api/admin/sue/external-payrolls/{id}/void` | CU-28. |
| [API-SUE-76](#API-SUE-76) | GET | `/api/admin/sue/external-payroll-layouts` | Layouts y mapeos. |
| [API-SUE-76-b](#API-SUE-76-b) | POST | `/api/admin/sue/external-payroll-layouts` | Layouts y mapeos. |
| [API-SUE-76-c](#API-SUE-76-c) | GET | `/api/admin/sue/external-payroll-layouts/{id}` | Layouts y mapeos. |
| [API-SUE-76-e](#API-SUE-76-e) | DELETE | `/api/admin/sue/external-payroll-layouts/{id}` | Layouts y mapeos. |
| [API-SUE-76-d](#API-SUE-76-d) | PATCH | `/api/admin/sue/external-payroll-layouts/{id}` | Layouts y mapeos. |
| [API-SUE-77](#API-SUE-77) | POST | `/api/admin/sue/parallel-comparisons` | Paralelo. |
| [API-SUE-78](#API-SUE-78) | GET | `/api/sue/me/payslips` | Mis recibos. |
| [API-SUE-78-b](#API-SUE-78-b) | GET | `/api/sue/me/payslips/{id}/pdf` | Mis recibos. |
| [API-SUE-79](#API-SUE-79) | POST | `/api/sue/me/payslips/{id}/viewed` | Constancia de visto; la firma, la firma en disconformidad y el rechazo se hacen en T11 (API-WFL-77 a API-WFL-79, PAN-WFL-27) |
| [API-SUE-80](#API-SUE-80) | GET | `/api/sue/me/leave-requests` | Licencias propias. |
| [API-SUE-80-b](#API-SUE-80-b) | POST | `/api/sue/me/leave-requests` | Licencias propias. |
| [API-SUE-80-c](#API-SUE-80-c) | GET | `/api/sue/me/vacation-balance` | Licencias propias. |
| [API-SUE-80-d](#API-SUE-80-d) | POST | `/api/sue/me/vacation-balance` | Licencias propias. |
| [API-SUE-81](#API-SUE-81) | GET | `/api/sue/me/profile` | Datos y documentos. |
| [API-SUE-81-b](#API-SUE-81-b) | POST | `/api/sue/me/profile` | Datos y documentos. |
| [API-SUE-81-c](#API-SUE-81-c) | GET | `/api/sue/me/change-requests` | Datos y documentos. |
| [API-SUE-81-d](#API-SUE-81-d) | POST | `/api/sue/me/change-requests` | Datos y documentos. |
| [API-SUE-81-e](#API-SUE-81-e) | GET | `/api/sue/me/documents` | Datos y documentos. |
| [API-SUE-81-f](#API-SUE-81-f) | POST | `/api/sue/me/documents` | Datos y documentos. |
| [API-SUE-82](#API-SUE-82) | GET | `/api/sue/me/certificates` | Constancias. |
| [API-SUE-82-b](#API-SUE-82-b) | POST | `/api/sue/me/certificates` | Constancias. |
| [API-SUE-83](#API-SUE-83) | GET | `/api/sue/team/leave-requests` | Encargado. |
| [API-SUE-83-b](#API-SUE-83-b) | POST | `/api/sue/team/leave-requests` | Encargado. |
| [API-SUE-83-c](#API-SUE-83-c) | GET | `/api/sue/team/novelties` | Encargado. |
| [API-SUE-83-d](#API-SUE-83-d) | POST | `/api/sue/team/novelties` | Encargado. |
| [API-SUE-84](#API-SUE-84) | GET | `/api/sue/me/reviews` | Evaluaciones propias. |
| [API-SUE-84-b](#API-SUE-84-b) | POST | `/api/sue/me/reviews` | Evaluaciones propias. |
| [API-SUE-84-c](#API-SUE-84-c) | GET | `/api/sue/me/objectives` | Evaluaciones propias. |
| [API-SUE-84-d](#API-SUE-84-d) | POST | `/api/sue/me/objectives` | Evaluaciones propias. |
| [API-SUE-85](#API-SUE-85) | GET | `/api/public/{tenantSlug}/sue/verify/{code}` | Verificación de constancia/recibo por código (sin datos sensibles) |
| [API-SUE-86](#API-SUE-86) | GET | `/api/v1/ext/sue/labor-cost` | Costo laboral agregado por centro de costo (sin datos personales) |
| [API-SUE-87](#API-SUE-87) | GET | `/api/platform/sue/official-tables/{key}` | Tablas oficiales (servicio de T04) |
| [API-SUE-87-c](#API-SUE-87-c) | DELETE | `/api/platform/sue/official-tables/{key}` | Tablas oficiales (servicio de T04) |
| [API-SUE-87-b](#API-SUE-87-b) | PATCH | `/api/platform/sue/official-tables/{key}` | Tablas oficiales (servicio de T04) |
| [API-SUE-87-d](#API-SUE-87-d) | POST | `/api/platform/sue/official-tables/{key}/publish` | Tablas oficiales (servicio de T04) |

<a id="API-SUE-03"></a>
#### API-SUE-03 · `GET /api/admin/sue/employees`

- **Qué hace:** Listar legajos con filtros. Lista, con filtros y paginación, los registros de legajos (`employees`).
- **Para qué sirve:** RF-SUE-045: Grillas de configuración que muestran solo conceptos activos por defecto, con filtro para ver inactivos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de legajos (`employees`) con `total`.
- **Pantallas:** PAN-SUE-02 (Listado de empleados), PAN-SUE-03 (Ficha del legajo).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-03)

<a id="API-SUE-05"></a>
#### API-SUE-05 · `POST /api/admin/sue/employees`

- **Qué hace:** Alta (con búsqueda/creación de persona) Da de alta un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-004: Alta de empleado integrada con personas: busca la persona por documento/CUIL en el tenant, la reutiliza o la crea en M01 sin duplicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.crear`.
- **Recibe:** los datos de legajos (`employees`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de legajos (`employees`).
- **Pantallas:** PAN-SUE-04 (Alta en asistente).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-05)

<a id="API-SUE-04"></a>
#### API-SUE-04 · `GET /api/admin/sue/employees/{id}`

- **Qué hace:** Ficha (secciones sensibles según permiso) Obtiene el detalle de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-013: Observaciones del legajo con fecha, usuario y categoría (general o sensible). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Pantallas:** PAN-SUE-02 (Listado de empleados), PAN-SUE-03 (Ficha del legajo).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-04)

<a id="API-SUE-06"></a>
#### API-SUE-06 · `PATCH /api/admin/sue/employees/{id}`

- **Qué hace:** Editar datos no vigentes. Modifica algunos campos de un registro de legajos (`employees`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de legajos (`employees`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2088 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-06)

<a id="API-SUE-07"></a>
#### API-SUE-07 · `POST /api/admin/sue/employees/{id}/assignments`

- **Qué hace:** Cambio laboral con fecha efectiva. Agrega un elemento («assignments») a un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-010: Historial laboral con fecha efectiva y de registro: categoría, convenio, cargo, área, jornada, modalidad, básico fuera de convenio, empresa; consulta «a una fecha». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2089 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-07)

<a id="API-SUE-08"></a>
#### API-SUE-08 · `PUT /api/admin/sue/employees/{id}/cost-allocations`

- **Qué hace:** Distribución por centros de costo. Reemplaza o configura legajos (`employees`).
- **Para qué sirve:** RF-SUE-008: Distribución del costo del empleado por centros de costo (secciones) con porcentaje y vigencia; suma 100 %. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; los datos de legajos (`employees`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2090 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-08)

<a id="API-SUE-09"></a>
#### API-SUE-09 · `GET /api/admin/sue/employees/{id}/family-members`

- **Qué hace:** Familiares. Consulta «family-members» de un registro de legajos (`employees`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.familiares.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-09)

<a id="API-SUE-09-b"></a>
#### API-SUE-09-b · `POST /api/admin/sue/employees/{id}/family-members`

- **Qué hace:** Familiares. Registra «family-members» sobre un registro de legajos (`employees`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.familiares.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-09-b)

<a id="API-SUE-09-c"></a>
#### API-SUE-09-c · `GET /api/admin/sue/employees/{id}/family-members/{fid}`

- **Qué hace:** Familiares. Obtiene el detalle de un registro de legajos (`employees`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.familiares.editar`.
- **Recibe:** en la ruta `id`, `fid`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-09-c)

<a id="API-SUE-09-d"></a>
#### API-SUE-09-d · `PATCH /api/admin/sue/employees/{id}/family-members/{fid}`

- **Qué hace:** Familiares. Modifica algunos campos de un registro de legajos (`employees`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.familiares.editar`.
- **Recibe:** en la ruta `id`, `fid`; solo los campos a cambiar de legajos (`employees`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-09-d)

<a id="API-SUE-10"></a>
#### API-SUE-10 · `GET /api/admin/sue/employees/{id}/pay-accounts`

- **Qué hace:** Cuentas de acreditación. Consulta «pay-accounts» de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-006: Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.cuentasPago.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-10)

<a id="API-SUE-10-b"></a>
#### API-SUE-10-b · `POST /api/admin/sue/employees/{id}/pay-accounts`

- **Qué hace:** Cuentas de acreditación. Registra «pay-accounts» sobre un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-006: Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.cuentasPago.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-10-b)

<a id="API-SUE-10-c"></a>
#### API-SUE-10-c · `GET /api/admin/sue/employees/{id}/pay-accounts/{aid}`

- **Qué hace:** Cuentas de acreditación. Obtiene el detalle de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-006: Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.cuentasPago.editar`.
- **Recibe:** en la ruta `id`, `aid`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-10-c)

<a id="API-SUE-10-d"></a>
#### API-SUE-10-d · `PATCH /api/admin/sue/employees/{id}/pay-accounts/{aid}`

- **Qué hace:** Cuentas de acreditación. Modifica algunos campos de un registro de legajos (`employees`) (solo los enviados).
- **Para qué sirve:** RF-SUE-006: Cuentas de acreditación del empleado (una o varias, con porcentaje o importe), CBU/CVU validado, banco, sucursal, tipo, titularidad, marca de cuenta sueldo (Ley 26.590). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.cuentasPago.editar`.
- **Recibe:** en la ruta `id`, `aid`; solo los campos a cambiar de legajos (`employees`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-10-d)

<a id="API-SUE-11"></a>
#### API-SUE-11 · `GET /api/admin/sue/employees/{id}/documents`

- **Qué hace:** Documentación. Consulta «documents» de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-017: Alertas del legajo: cambio de categoría por antigüedad (meses del sindicato o convenio), fin del período de prueba, vencimiento de contrato a plazo, vencimiento de documentación, reincorporación tras licencia, cumpleaños. · RF-SUE-004: Alta de empleado integrada con personas: busca la persona por documento/CUIL en el tenant, la reutiliza o la crea en M01 sin duplicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2093 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-11)

<a id="API-SUE-11-b"></a>
#### API-SUE-11-b · `POST /api/admin/sue/employees/{id}/documents`

- **Qué hace:** Documentación. Agrega un elemento («documents») a un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-017: Alertas del legajo: cambio de categoría por antigüedad (meses del sindicato o convenio), fin del período de prueba, vencimiento de contrato a plazo, vencimiento de documentación, reincorporación tras licencia, cumpleaños. · RF-SUE-004: Alta de empleado integrada con personas: busca la persona por documento/CUIL en el tenant, la reutiliza o la crea en M01 sin duplicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2093 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-11-b)

<a id="API-SUE-12"></a>
#### API-SUE-12 · `POST /api/admin/sue/employee-documents/{docId}/authorize`

- **Qué hace:** Autorizar/rechazar documento. Autoriza un registro de documentación del legajo (`employeeDocuments`).
- **Para qué sirve:** RF-SUE-007: Documentación del empleado con tipo documental, archivo, fecha de registro, vencimiento y estado (pendiente, autorizada, rechazada); circuito de autorización por RRHH de lo que el empleado sube desde su portal; alertas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.documentos.autorizar`.
- **Recibe:** en la ruta `docId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2094 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-12)

<a id="API-SUE-12-b"></a>
#### API-SUE-12-b · `POST /api/admin/sue/employee-documents/{docId}/reject`

- **Qué hace:** Autorizar/rechazar documento. Rechaza un registro de documentación del legajo (`employeeDocuments`).
- **Para qué sirve:** RF-SUE-007: Documentación del empleado con tipo documental, archivo, fecha de registro, vencimiento y estado (pendiente, autorizada, rechazada); circuito de autorización por RRHH de lo que el empleado sube desde su portal; alertas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.documentos.autorizar`.
- **Recibe:** en la ruta `docId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2094 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-12-b)

<a id="API-SUE-13"></a>
#### API-SUE-13 · `GET /api/admin/sue/employees/{id}/notes`

- **Qué hace:** Observaciones. Consulta «notes» de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-013: Observaciones del legajo con fecha, usuario y categoría (general o sensible). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2095 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-13)

<a id="API-SUE-13-b"></a>
#### API-SUE-13-b · `POST /api/admin/sue/employees/{id}/notes`

- **Qué hace:** Observaciones. Agrega un elemento («notes») a un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-013: Observaciones del legajo con fecha, usuario y categoría (general o sensible). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2095 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-13-b)

<a id="API-SUE-14"></a>
#### API-SUE-14 · `PUT /api/admin/sue/employees/{id}/shifts`

- **Qué hace:** Turnos asignados. Reemplaza o configura turnos de trabajo (`shifts`).
- **Para qué sirve:** RF-SUE-009: Turnos asignados al empleado con vigencia desde/hasta, sobre turnos con horarios por día de semana. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; los datos de turnos de trabajo (`shifts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de turnos de trabajo (`shifts`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2096 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-14)

<a id="API-SUE-15"></a>
#### API-SUE-15 · `POST /api/admin/sue/employees/{id}/employment-status`

- **Qué hace:** Situación de revista. Registra «employment-status» sobre un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-011: Situación de revista por empleado con fecha desde y día de inicio; hasta tres situaciones por mes, como exige el LSD/SICOSS. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2097 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-15)

<a id="API-SUE-16"></a>
#### API-SUE-16 · `PUT /api/admin/sue/employees/{id}/extras`

- **Qué hace:** Extras. Reemplaza o configura grupos de extras (`extraGroups`).
- **Para qué sirve:** RF-SUE-015: Extras por empleado: importes fijos por concepto extra o grupo de extras, con vigencia. · RF-SUE-138: Informes operativos heredados de ProCoop (ver §15) y gráficos por grupos de conceptos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; los datos de grupos de extras (`extraGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de grupos de extras (`extraGroups`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2098 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-16)

<a id="API-SUE-17"></a>
#### API-SUE-17 · `GET /api/admin/sue/employees/{id}/deduction-plans`

- **Qué hace:** Planes de descuento. Lista, con filtros y paginación, los registros de descuentos en cuotas (`deductionPlans`).
- **Para qué sirve:** RF-SUE-016: Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.datosSensibles.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de descuentos en cuotas (`deductionPlans`) con `total`.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-17)

<a id="API-SUE-17-b"></a>
#### API-SUE-17-b · `POST /api/admin/sue/employees/{id}/deduction-plans`

- **Qué hace:** Planes de descuento. Da de alta un registro de descuentos en cuotas (`deductionPlans`).
- **Para qué sirve:** RF-SUE-016: Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; los datos de descuentos en cuotas (`deductionPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de descuentos en cuotas (`deductionPlans`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-17-b)

<a id="API-SUE-17-c"></a>
#### API-SUE-17-c · `GET /api/admin/sue/employees/{id}/deduction-plans/{pid}`

- **Qué hace:** Planes de descuento. Obtiene el detalle de un registro de descuentos en cuotas (`deductionPlans`).
- **Para qué sirve:** RF-SUE-016: Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.datosSensibles.ver`.
- **Recibe:** en la ruta `id`, `pid`.
- **Devuelve:** 200: el registro de descuentos en cuotas (`deductionPlans`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-17-c)

<a id="API-SUE-17-d"></a>
#### API-SUE-17-d · `PATCH /api/admin/sue/employees/{id}/deduction-plans/{pid}`

- **Qué hace:** Planes de descuento. Modifica algunos campos de un registro de descuentos en cuotas (`deductionPlans`) (solo los enviados).
- **Para qué sirve:** RF-SUE-016: Planes de descuento del empleado: embargo (oficio, juzgado, expediente, carátula, monto total, tope, cuenta judicial de depósito), cuota alimentaria (porcentaje o importe, beneficiario, cuenta), préstamo (capital, cuotas, saldo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`, `pid`; solo los campos a cambiar de descuentos en cuotas (`deductionPlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de descuentos en cuotas (`deductionPlans`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-17-d)

<a id="API-SUE-18"></a>
#### API-SUE-18 · `PUT /api/admin/sue/supervision-links`

- **Qué hace:** Encargados y operarios. Reemplaza o configura supervisores (`supervisionLinks`).
- **Para qué sirve:** RF-SUE-012: Relación encargado-operarios con vigencia; define la bandeja del encargado y el alcance «equipo». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** los datos de supervisores (`supervisionLinks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de supervisores (`supervisionLinks`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-18)

<a id="API-SUE-19"></a>
#### API-SUE-19 · `POST /api/admin/sue/employees/import`

- **Qué hace:** Importación Excel (preview/confirm) Importa sobre legajos (`employees`).
- **Para qué sirve:** RF-SUE-018: Importación masiva de empleados desde Excel con modelo descargable y referencias (ExcelImportWizard: subir, previsualizar errores, confirmar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-04 (Alta en asistente).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-19)

<a id="API-SUE-20"></a>
#### API-SUE-20 · `POST /api/admin/sue/employees/{id}/reinstate`

- **Qué hace:** Reincorporar. Registra «reinstate» sobre un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-017: Alertas del legajo: cambio de categoría por antigüedad (meses del sindicato o convenio), fin del período de prueba, vencimiento de contrato a plazo, vencimiento de documentación, reincorporación tras licencia, cumpleaños. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.legajos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2102 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-20)

<a id="API-SUE-21"></a>
#### API-SUE-21 · `GET /api/admin/sue/unions`

- **Qué hace:** Sindicatos. Lista, con filtros y paginación, los registros de sindicatos (`unions`).
- **Para qué sirve:** RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sindicatos (`unions`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-21)

<a id="API-SUE-21-b"></a>
#### API-SUE-21-b · `POST /api/admin/sue/unions`

- **Qué hace:** Sindicatos. Da de alta un registro de sindicatos (`unions`).
- **Para qué sirve:** RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de sindicatos (`unions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sindicatos (`unions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-21-b)

<a id="API-SUE-21-c"></a>
#### API-SUE-21-c · `GET /api/admin/sue/unions/{id}`

- **Qué hace:** Sindicatos. Obtiene el detalle de un registro de sindicatos (`unions`).
- **Para qué sirve:** RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sindicatos (`unions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-21-c)

<a id="API-SUE-21-e"></a>
#### API-SUE-21-e · `DELETE /api/admin/sue/unions/{id}`

- **Qué hace:** Sindicatos. Elimina o da de baja un registro de sindicatos (`unions`).
- **Para qué sirve:** RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-21-e)

<a id="API-SUE-21-d"></a>
#### API-SUE-21-d · `PATCH /api/admin/sue/unions/{id}`

- **Qué hace:** Sindicatos. Modifica algunos campos de un registro de sindicatos (`unions`) (solo los enviados).
- **Para qué sirve:** RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sindicatos (`unions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sindicatos (`unions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-21-d)

<a id="API-SUE-22"></a>
#### API-SUE-22 · `GET /api/admin/sue/labor-agreements`

- **Qué hace:** Convenios (+ /:id/validate) Lista, con filtros y paginación, los registros de convenios colectivos (`laborAgreements`).
- **Para qué sirve:** RF-SUE-027: Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de convenios colectivos (`laborAgreements`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-22)

<a id="API-SUE-22-b"></a>
#### API-SUE-22-b · `POST /api/admin/sue/labor-agreements`

- **Qué hace:** Convenios (+ /:id/validate) Da de alta un registro de convenios colectivos (`laborAgreements`).
- **Para qué sirve:** RF-SUE-027: Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de convenios colectivos (`laborAgreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de convenios colectivos (`laborAgreements`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-22-b)

<a id="API-SUE-22-c"></a>
#### API-SUE-22-c · `GET /api/admin/sue/labor-agreements/{id}`

- **Qué hace:** Convenios (+ /:id/validate) Obtiene el detalle de un registro de convenios colectivos (`laborAgreements`).
- **Para qué sirve:** RF-SUE-027: Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de convenios colectivos (`laborAgreements`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-22-c)

<a id="API-SUE-22-e"></a>
#### API-SUE-22-e · `DELETE /api/admin/sue/labor-agreements/{id}`

- **Qué hace:** Convenios (+ /:id/validate) Elimina o da de baja un registro de convenios colectivos (`laborAgreements`).
- **Para qué sirve:** RF-SUE-027: Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-22-e)

<a id="API-SUE-22-d"></a>
#### API-SUE-22-d · `PATCH /api/admin/sue/labor-agreements/{id}`

- **Qué hace:** Convenios (+ /:id/validate) Modifica algunos campos de un registro de convenios colectivos (`laborAgreements`) (solo los enviados).
- **Para qué sirve:** RF-SUE-027: Convenios colectivos: número de CCT, sindicato, ámbito, vigencia, jornada normal, reglas de antigüedad, licencias especiales, adicionales y conceptos propios, responsable que validó la parametrización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de convenios colectivos (`laborAgreements`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de convenios colectivos (`laborAgreements`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-22-d)

<a id="API-SUE-23"></a>
#### API-SUE-23 · `GET /api/admin/sue/categories`

- **Qué hace:** Categorías. Lista, con filtros y paginación, los registros de categorías salariales (`salaryCategories`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías salariales (`salaryCategories`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-23)

<a id="API-SUE-23-b"></a>
#### API-SUE-23-b · `POST /api/admin/sue/categories`

- **Qué hace:** Categorías. Da de alta un registro de categorías salariales (`salaryCategories`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de categorías salariales (`salaryCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías salariales (`salaryCategories`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-23-b)

<a id="API-SUE-23-c"></a>
#### API-SUE-23-c · `GET /api/admin/sue/categories/{id}`

- **Qué hace:** Categorías. Obtiene el detalle de un registro de categorías salariales (`salaryCategories`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de categorías salariales (`salaryCategories`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-23-c)

<a id="API-SUE-23-e"></a>
#### API-SUE-23-e · `DELETE /api/admin/sue/categories/{id}`

- **Qué hace:** Categorías. Elimina o da de baja un registro de categorías salariales (`salaryCategories`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-23-e)

<a id="API-SUE-23-d"></a>
#### API-SUE-23-d · `PATCH /api/admin/sue/categories/{id}`

- **Qué hace:** Categorías. Modifica algunos campos de un registro de categorías salariales (`salaryCategories`) (solo los enviados).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de categorías salariales (`salaryCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías salariales (`salaryCategories`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-23-d)

<a id="API-SUE-24"></a>
#### API-SUE-24 · `GET /api/admin/sue/salary-scales`

- **Qué hace:** Escalas. Lista, con filtros y paginación, los registros de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de escalas salariales (`salaryScales`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24)

<a id="API-SUE-24-b"></a>
#### API-SUE-24-b · `POST /api/admin/sue/salary-scales`

- **Qué hace:** Escalas. Da de alta un registro de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de escalas salariales (`salaryScales`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de escalas salariales (`salaryScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-b)

<a id="API-SUE-24-c"></a>
#### API-SUE-24-c · `GET /api/admin/sue/salary-scales/{id}`

- **Qué hace:** Escalas. Obtiene el detalle de un registro de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de escalas salariales (`salaryScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-c)

<a id="API-SUE-24-e"></a>
#### API-SUE-24-e · `DELETE /api/admin/sue/salary-scales/{id}`

- **Qué hace:** Escalas. Elimina o da de baja un registro de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.escalas.aprobar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-e)

<a id="API-SUE-24-d"></a>
#### API-SUE-24-d · `PATCH /api/admin/sue/salary-scales/{id}`

- **Qué hace:** Escalas. Modifica algunos campos de un registro de escalas salariales (`salaryScales`) (solo los enviados).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de escalas salariales (`salaryScales`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de escalas salariales (`salaryScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-d)

<a id="API-SUE-24-f"></a>
#### API-SUE-24-f · `POST /api/admin/sue/salary-scales/{id}/submit`

- **Qué hace:** Escalas. Envía a revisión o presenta un registro de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-f)

<a id="API-SUE-24-g"></a>
#### API-SUE-24-g · `POST /api/admin/sue/salary-scales/{id}/approve`

- **Qué hace:** Escalas. Aprueba un registro de escalas salariales (`salaryScales`).
- **Para qué sirve:** RF-SUE-029: Escalas salariales versionadas: valores de básico y adicionales por categoría con fecha efectiva desde, acuerdo que las origina, estado (borrador, aprobada, publicada) y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-24-g)

<a id="API-SUE-25"></a>
#### API-SUE-25 · `GET /api/admin/sue/seniority-scales`

- **Qué hace:** Antigüedad. Lista, con filtros y paginación, los registros de escalas de antigüedad (`seniorityScales`).
- **Para qué sirve:** RF-SUE-030: Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de escalas de antigüedad (`seniorityScales`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-25)

<a id="API-SUE-25-b"></a>
#### API-SUE-25-b · `POST /api/admin/sue/seniority-scales`

- **Qué hace:** Antigüedad. Da de alta un registro de escalas de antigüedad (`seniorityScales`).
- **Para qué sirve:** RF-SUE-030: Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de escalas de antigüedad (`seniorityScales`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de escalas de antigüedad (`seniorityScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-25-b)

<a id="API-SUE-25-c"></a>
#### API-SUE-25-c · `GET /api/admin/sue/seniority-scales/{id}`

- **Qué hace:** Antigüedad. Obtiene el detalle de un registro de escalas de antigüedad (`seniorityScales`).
- **Para qué sirve:** RF-SUE-030: Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de escalas de antigüedad (`seniorityScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-25-c)

<a id="API-SUE-25-e"></a>
#### API-SUE-25-e · `DELETE /api/admin/sue/seniority-scales/{id}`

- **Qué hace:** Antigüedad. Elimina o da de baja un registro de escalas de antigüedad (`seniorityScales`).
- **Para qué sirve:** RF-SUE-030: Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-25-e)

<a id="API-SUE-25-d"></a>
#### API-SUE-25-d · `PATCH /api/admin/sue/seniority-scales/{id}`

- **Qué hace:** Antigüedad. Modifica algunos campos de un registro de escalas de antigüedad (`seniorityScales`) (solo los enviados).
- **Para qué sirve:** RF-SUE-030: Escala de antigüedad por categoría o sindicato: tramo desde/hasta años, porcentaje o importe, días de vacaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de escalas de antigüedad (`seniorityScales`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de escalas de antigüedad (`seniorityScales`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-25-d)

<a id="API-SUE-26"></a>
#### API-SUE-26 · `GET /api/admin/sue/positions`

- **Qué hace:** Cargos, áreas, turnos. Lista, con filtros y paginación, los registros de puestos (`positions`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de puestos (`positions`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26)

<a id="API-SUE-26-b"></a>
#### API-SUE-26-b · `POST /api/admin/sue/positions`

- **Qué hace:** Cargos, áreas, turnos. Da de alta un registro de puestos (`positions`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de puestos (`positions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de puestos (`positions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-b)

<a id="API-SUE-26-c"></a>
#### API-SUE-26-c · `GET /api/admin/sue/positions/{id}`

- **Qué hace:** Cargos, áreas, turnos. Obtiene el detalle de un registro de puestos (`positions`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de puestos (`positions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-c)

<a id="API-SUE-26-e"></a>
#### API-SUE-26-e · `DELETE /api/admin/sue/positions/{id}`

- **Qué hace:** Cargos, áreas, turnos. Elimina o da de baja un registro de puestos (`positions`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-e)

<a id="API-SUE-26-d"></a>
#### API-SUE-26-d · `PATCH /api/admin/sue/positions/{id}`

- **Qué hace:** Cargos, áreas, turnos. Modifica algunos campos de un registro de puestos (`positions`) (solo los enviados).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de puestos (`positions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de puestos (`positions`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-d)

<a id="API-SUE-26-f"></a>
#### API-SUE-26-f · `GET /api/admin/sue/work-areas`

- **Qué hace:** Cargos, áreas, turnos. Lista, con filtros y paginación, los registros de áreas laborales (`workAreas`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de áreas laborales (`workAreas`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-f)

<a id="API-SUE-26-g"></a>
#### API-SUE-26-g · `POST /api/admin/sue/work-areas`

- **Qué hace:** Cargos, áreas, turnos. Da de alta un registro de áreas laborales (`workAreas`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de áreas laborales (`workAreas`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de áreas laborales (`workAreas`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-g)

<a id="API-SUE-26-h"></a>
#### API-SUE-26-h · `GET /api/admin/sue/work-areas/{id}`

- **Qué hace:** Cargos, áreas, turnos. Obtiene el detalle de un registro de áreas laborales (`workAreas`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de áreas laborales (`workAreas`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-h)

<a id="API-SUE-26-j"></a>
#### API-SUE-26-j · `DELETE /api/admin/sue/work-areas/{id}`

- **Qué hace:** Cargos, áreas, turnos. Elimina o da de baja un registro de áreas laborales (`workAreas`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-j)

<a id="API-SUE-26-i"></a>
#### API-SUE-26-i · `PATCH /api/admin/sue/work-areas/{id}`

- **Qué hace:** Cargos, áreas, turnos. Modifica algunos campos de un registro de áreas laborales (`workAreas`) (solo los enviados).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de áreas laborales (`workAreas`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de áreas laborales (`workAreas`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-i)

<a id="API-SUE-26-k"></a>
#### API-SUE-26-k · `GET /api/admin/sue/shifts`

- **Qué hace:** Cargos, áreas, turnos. Lista, con filtros y paginación, los registros de turnos de trabajo (`shifts`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de turnos de trabajo (`shifts`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-k)

<a id="API-SUE-26-l"></a>
#### API-SUE-26-l · `POST /api/admin/sue/shifts`

- **Qué hace:** Cargos, áreas, turnos. Da de alta un registro de turnos de trabajo (`shifts`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de turnos de trabajo (`shifts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos de trabajo (`shifts`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-l)

<a id="API-SUE-26-m"></a>
#### API-SUE-26-m · `GET /api/admin/sue/shifts/{id}`

- **Qué hace:** Cargos, áreas, turnos. Obtiene el detalle de un registro de turnos de trabajo (`shifts`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de turnos de trabajo (`shifts`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-m)

<a id="API-SUE-26-o"></a>
#### API-SUE-26-o · `DELETE /api/admin/sue/shifts/{id}`

- **Qué hace:** Cargos, áreas, turnos. Elimina o da de baja un registro de turnos de trabajo (`shifts`).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-o)

<a id="API-SUE-26-n"></a>
#### API-SUE-26-n · `PATCH /api/admin/sue/shifts/{id}`

- **Qué hace:** Cargos, áreas, turnos. Modifica algunos campos de un registro de turnos de trabajo (`shifts`) (solo los enviados).
- **Para qué sirve:** RF-SUE-031: Cargos/puestos y áreas laborales vinculadas a centros de costo de M15 y a servicios del catálogo M02. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de turnos de trabajo (`shifts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de turnos de trabajo (`shifts`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-26-n)

<a id="API-SUE-27"></a>
#### API-SUE-27 · `GET /api/admin/sue/health-insurers`

- **Qué hace:** Obras sociales, motivos. Consulta `health-insurers`.
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27)

<a id="API-SUE-27-b"></a>
#### API-SUE-27-b · `POST /api/admin/sue/health-insurers`

- **Qué hace:** Obras sociales, motivos. Registra un nuevo elemento u operación en `health-insurers`.
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-b)

<a id="API-SUE-27-c"></a>
#### API-SUE-27-c · `GET /api/admin/sue/health-insurers/{id}`

- **Qué hace:** Obras sociales, motivos. Obtiene el detalle de un registro de `health-insurers`.
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-c)

<a id="API-SUE-27-e"></a>
#### API-SUE-27-e · `DELETE /api/admin/sue/health-insurers/{id}`

- **Qué hace:** Obras sociales, motivos. Elimina o da de baja un registro de `health-insurers`.
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-e)

<a id="API-SUE-27-d"></a>
#### API-SUE-27-d · `PATCH /api/admin/sue/health-insurers/{id}`

- **Qué hace:** Obras sociales, motivos. Modifica algunos campos de un registro de `health-insurers` (solo los enviados).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-d)

<a id="API-SUE-27-f"></a>
#### API-SUE-27-f · `GET /api/admin/sue/termination-reasons`

- **Qué hace:** Obras sociales, motivos. Lista, con filtros y paginación, los registros de causas de egreso (`terminationReasons`).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de causas de egreso (`terminationReasons`) con `total`.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-f)

<a id="API-SUE-27-g"></a>
#### API-SUE-27-g · `POST /api/admin/sue/termination-reasons`

- **Qué hace:** Obras sociales, motivos. Da de alta un registro de causas de egreso (`terminationReasons`).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** los datos de causas de egreso (`terminationReasons`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de causas de egreso (`terminationReasons`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-g)

<a id="API-SUE-27-h"></a>
#### API-SUE-27-h · `GET /api/admin/sue/termination-reasons/{id}`

- **Qué hace:** Obras sociales, motivos. Obtiene el detalle de un registro de causas de egreso (`terminationReasons`).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de causas de egreso (`terminationReasons`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-h)

<a id="API-SUE-27-j"></a>
#### API-SUE-27-j · `DELETE /api/admin/sue/termination-reasons/{id}`

- **Qué hace:** Obras sociales, motivos. Elimina o da de baja un registro de causas de egreso (`terminationReasons`).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-j)

<a id="API-SUE-27-i"></a>
#### API-SUE-27-i · `PATCH /api/admin/sue/termination-reasons/{id}`

- **Qué hace:** Obras sociales, motivos. Modifica algunos campos de un registro de causas de egreso (`terminationReasons`) (solo los enviados).
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de causas de egreso (`terminationReasons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de causas de egreso (`terminationReasons`).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-27-i)

<a id="API-SUE-28"></a>
#### API-SUE-28 · `GET /api/admin/sue/official-tables/{key}`

- **Qué hace:** Tablas oficiales adoptadas. Obtiene el detalle de un registro de `official-tables`.
- **Para qué sirve:** RF-SUE-035: Tablas oficiales de seguridad social de plataforma (actividades, condiciones, modalidades de contratación, situaciones de revista, códigos de siniestrado, beneficios SICOSS, tipos de empleador, zonas, códigos de conceptos ARCA… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reportes.ver`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-01 (Tablero de sueldos), PAN-SUE-11 (Consulta de tablas oficiales adoptadas), PAN-SUE-38 (Informes de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2110 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-28)

<a id="API-SUE-29"></a>
#### API-SUE-29 · `POST /api/admin/sue/official-tables/{key}/adopt`

- **Qué hace:** Adoptar versión. Registra «adopt» sobre un registro de `adopt`.
- **Para qué sirve:** RF-SUE-033: Obras sociales adoptadas por el tenant (código RNOS de la tabla oficial), porcentaje e importe de aporte y retención, adicional por adherente. · RF-SUE-146: Migración de legajos, estructura, conceptos, acumulados del año (Ganancias, SAC, vacaciones) e historial de recibos (§19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.estructura.configurar`.
- **Recibe:** en la ruta `key`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-05 (Empresas empleadoras), PAN-SUE-06 (Sindicatos y convenios), PAN-SUE-07 (Categorías, escalas y antigüedad) y 3 más.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2111 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-29)

<a id="API-SUE-30"></a>
#### API-SUE-30 · `GET /api/admin/sue/variables`

- **Qué hace:** Variables (+ /:id/rename) Lista, con filtros y paginación, los registros de variables de liquidación (`payrollVariables`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.variables.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de variables de liquidación (`payrollVariables`) con `total`.
- **Pantallas:** PAN-SUE-12 (Variables).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-30)

<a id="API-SUE-30-b"></a>
#### API-SUE-30-b · `POST /api/admin/sue/variables`

- **Qué hace:** Variables (+ /:id/rename) Da de alta un registro de variables de liquidación (`payrollVariables`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.variables.configurar`.
- **Recibe:** los datos de variables de liquidación (`payrollVariables`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de variables de liquidación (`payrollVariables`).
- **Pantallas:** PAN-SUE-12 (Variables).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-30-b)

<a id="API-SUE-30-c"></a>
#### API-SUE-30-c · `GET /api/admin/sue/variables/{id}`

- **Qué hace:** Variables (+ /:id/rename) Obtiene el detalle de un registro de variables de liquidación (`payrollVariables`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.variables.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de variables de liquidación (`payrollVariables`).
- **Pantallas:** PAN-SUE-12 (Variables).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-30-c)

<a id="API-SUE-30-e"></a>
#### API-SUE-30-e · `DELETE /api/admin/sue/variables/{id}`

- **Qué hace:** Variables (+ /:id/rename) Elimina o da de baja un registro de variables de liquidación (`payrollVariables`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.variables.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-12 (Variables).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-30-e)

<a id="API-SUE-30-d"></a>
#### API-SUE-30-d · `PATCH /api/admin/sue/variables/{id}`

- **Qué hace:** Variables (+ /:id/rename) Modifica algunos campos de un registro de variables de liquidación (`payrollVariables`) (solo los enviados).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.variables.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de variables de liquidación (`payrollVariables`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de variables de liquidación (`payrollVariables`).
- **Pantallas:** PAN-SUE-12 (Variables).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-30-d)

<a id="API-SUE-31"></a>
#### API-SUE-31 · `GET /api/admin/sue/concepts`

- **Qué hace:** Conceptos. Lista, con filtros y paginación, los registros de conceptos de liquidación (`payrollConcepts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conceptos de liquidación (`payrollConcepts`) con `total`.
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-31)

<a id="API-SUE-31-b"></a>
#### API-SUE-31-b · `POST /api/admin/sue/concepts`

- **Qué hace:** Conceptos. Da de alta un registro de conceptos de liquidación (`payrollConcepts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** los datos de conceptos de liquidación (`payrollConcepts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conceptos de liquidación (`payrollConcepts`).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-31-b)

<a id="API-SUE-31-c"></a>
#### API-SUE-31-c · `GET /api/admin/sue/concepts/{id}`

- **Qué hace:** Conceptos. Obtiene el detalle de un registro de conceptos de liquidación (`payrollConcepts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conceptos de liquidación (`payrollConcepts`).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-31-c)

<a id="API-SUE-31-e"></a>
#### API-SUE-31-e · `DELETE /api/admin/sue/concepts/{id}`

- **Qué hace:** Conceptos. Elimina o da de baja un registro de conceptos de liquidación (`payrollConcepts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-31-e)

<a id="API-SUE-31-d"></a>
#### API-SUE-31-d · `PATCH /api/admin/sue/concepts/{id}`

- **Qué hace:** Conceptos. Modifica algunos campos de un registro de conceptos de liquidación (`payrollConcepts`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de conceptos de liquidación (`payrollConcepts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de conceptos de liquidación (`payrollConcepts`).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-31-d)

<a id="API-SUE-32"></a>
#### API-SUE-32 · `POST /api/admin/sue/formulas/validate`

- **Qué hace:** Validar fórmula y dependencias. Valida sobre `validate`.
- **Para qué sirve:** RF-SUE-040: Editor de fórmulas con árbol de variables, conceptos, datos del empleado, novedades y funciones; validación; prueba sobre un empleado; asistente de IA que solo propone la fórmula y explica sus dependencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-32)

<a id="API-SUE-33"></a>
#### API-SUE-33 · `POST /api/admin/sue/formulas/test`

- **Qué hace:** Probar fórmula sobre un empleado. Prueba sobre `test`.
- **Para qué sirve:** RF-SUE-070: Simulador: cálculo individual o masivo sin efectos, con la configuración vigente o con una versión en borrador; comparativo por empleado y concepto contra el período anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.simular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2115 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-33)

<a id="API-SUE-34"></a>
#### API-SUE-34 · `POST /api/admin/sue/formulas/assist`

- **Qué hace:** Sugerencia de IA (sin datos personales) Registra un nuevo elemento u operación en `assist`.
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2116 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-34)

<a id="API-SUE-35"></a>
#### API-SUE-35 · `GET /api/admin/sue/payroll-types`

- **Qué hace:** Tipos de liquidación. Lista, con filtros y paginación, los registros de tipos de liquidación (`payrollTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposLiquidacion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de liquidación (`payrollTypes`) con `total`.
- **Pantallas:** PAN-SUE-14 (Tipos de liquidación).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-35)

<a id="API-SUE-35-b"></a>
#### API-SUE-35-b · `POST /api/admin/sue/payroll-types`

- **Qué hace:** Tipos de liquidación. Da de alta un registro de tipos de liquidación (`payrollTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposLiquidacion.configurar`.
- **Recibe:** los datos de tipos de liquidación (`payrollTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de liquidación (`payrollTypes`).
- **Pantallas:** PAN-SUE-14 (Tipos de liquidación).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-35-b)

<a id="API-SUE-35-c"></a>
#### API-SUE-35-c · `GET /api/admin/sue/payroll-types/{id}`

- **Qué hace:** Tipos de liquidación. Obtiene el detalle de un registro de tipos de liquidación (`payrollTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposLiquidacion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de liquidación (`payrollTypes`).
- **Pantallas:** PAN-SUE-14 (Tipos de liquidación).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-35-c)

<a id="API-SUE-35-e"></a>
#### API-SUE-35-e · `DELETE /api/admin/sue/payroll-types/{id}`

- **Qué hace:** Tipos de liquidación. Elimina o da de baja un registro de tipos de liquidación (`payrollTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposLiquidacion.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-14 (Tipos de liquidación).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-35-e)

<a id="API-SUE-35-d"></a>
#### API-SUE-35-d · `PATCH /api/admin/sue/payroll-types/{id}`

- **Qué hace:** Tipos de liquidación. Modifica algunos campos de un registro de tipos de liquidación (`payrollTypes`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposLiquidacion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de liquidación (`payrollTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de liquidación (`payrollTypes`).
- **Pantallas:** PAN-SUE-14 (Tipos de liquidación).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-35-d)

<a id="API-SUE-36"></a>
#### API-SUE-36 · `GET /api/admin/sue/config-versions`

- **Qué hace:** Versiones. Lista, con filtros y paginación, los registros de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas de configuración (`payrollConfigVersions`) con `total`.
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2118 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-36)

<a id="API-SUE-36-b"></a>
#### API-SUE-36-b · `POST /api/admin/sue/config-versions`

- **Qué hace:** Versiones. Da de alta un registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.configurar`.
- **Recibe:** los datos de versiones publicadas de configuración (`payrollConfigVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Pantallas:** PAN-SUE-13 (Conceptos y editor de fórmulas).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2118 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-36-b)

<a id="API-SUE-37"></a>
#### API-SUE-37 · `POST /api/admin/sue/config-versions/{id}/simulate`

- **Qué hace:** Ciclo de versión. Simula sin efectos un registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.simular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-37)

<a id="API-SUE-37-b"></a>
#### API-SUE-37-b · `POST /api/admin/sue/config-versions/{id}/submit`

- **Qué hace:** Ciclo de versión. Envía a revisión o presenta un registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.simular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-37-b)

<a id="API-SUE-37-c"></a>
#### API-SUE-37-c · `POST /api/admin/sue/config-versions/{id}/publish`

- **Qué hace:** Ciclo de versión. Publica un registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.simular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-37-c)

<a id="API-SUE-37-d"></a>
#### API-SUE-37-d · `POST /api/admin/sue/config-versions/{id}/discard`

- **Qué hace:** Ciclo de versión. Descarta un registro de versiones publicadas de configuración (`payrollConfigVersions`).
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.conceptos.simular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-37-d)

<a id="API-SUE-38"></a>
#### API-SUE-38 · `POST /api/admin/sue/salary-increases`

- **Qué hace:** Aplicar aumentos. Registra un nuevo elemento u operación en `salary-increases`.
- **Para qué sirve:** RF-SUE-043: Aplicar aumentos: porcentaje o importe sobre los básicos de un sindicato, convenio, conjunto de categorías o grupo de extras, con fecha efectiva y redondeo; genera una nueva versión de escala en borrador para aprobar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.aumentos.aplicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-16 (Aplicar aumentos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-38)

<a id="API-SUE-38-b"></a>
#### API-SUE-38-b · `POST /api/admin/sue/salary-increases/{id}/preview`

- **Qué hace:** Aplicar aumentos. Previsualiza sin efectos un registro de `preview`.
- **Para qué sirve:** RF-SUE-043: Aplicar aumentos: porcentaje o importe sobre los básicos de un sindicato, convenio, conjunto de categorías o grupo de extras, con fecha efectiva y redondeo; genera una nueva versión de escala en borrador para aprobar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.aumentos.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-16 (Aplicar aumentos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-38-b)

<a id="API-SUE-38-c"></a>
#### API-SUE-38-c · `POST /api/admin/sue/salary-increases/{id}/apply`

- **Qué hace:** Aplicar aumentos. Aplica un registro de `apply`.
- **Para qué sirve:** RF-SUE-043: Aplicar aumentos: porcentaje o importe sobre los básicos de un sindicato, convenio, conjunto de categorías o grupo de extras, con fecha efectiva y redondeo; genera una nueva versión de escala en borrador para aprobar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.aumentos.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-16 (Aplicar aumentos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-38-c)

<a id="API-SUE-39"></a>
#### API-SUE-39 · `GET /api/admin/sue/novelty-types`

- **Qué hace:** Tipos. Lista, con filtros y paginación, los registros de tipos de novedad (`noveltyTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de novedad (`noveltyTypes`) con `total`.
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39)

<a id="API-SUE-39-b"></a>
#### API-SUE-39-b · `POST /api/admin/sue/novelty-types`

- **Qué hace:** Tipos. Da de alta un registro de tipos de novedad (`noveltyTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** los datos de tipos de novedad (`noveltyTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de novedad (`noveltyTypes`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-b)

<a id="API-SUE-39-c"></a>
#### API-SUE-39-c · `GET /api/admin/sue/novelty-types/{id}`

- **Qué hace:** Tipos. Obtiene el detalle de un registro de tipos de novedad (`noveltyTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de novedad (`noveltyTypes`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-c)

<a id="API-SUE-39-e"></a>
#### API-SUE-39-e · `DELETE /api/admin/sue/novelty-types/{id}`

- **Qué hace:** Tipos. Elimina o da de baja un registro de tipos de novedad (`noveltyTypes`).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.causasLicencia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-e)

<a id="API-SUE-39-d"></a>
#### API-SUE-39-d · `PATCH /api/admin/sue/novelty-types/{id}`

- **Qué hace:** Tipos. Modifica algunos campos de un registro de tipos de novedad (`noveltyTypes`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de novedad (`noveltyTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de novedad (`noveltyTypes`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-d)

<a id="API-SUE-39-f"></a>
#### API-SUE-39-f · `GET /api/admin/sue/leave-causes`

- **Qué hace:** Tipos. Lista, con filtros y paginación, los registros de causas de licencia (`leaveCauses`).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de causas de licencia (`leaveCauses`) con `total`.
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-f)

<a id="API-SUE-39-g"></a>
#### API-SUE-39-g · `POST /api/admin/sue/leave-causes`

- **Qué hace:** Tipos. Da de alta un registro de causas de licencia (`leaveCauses`).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** los datos de causas de licencia (`leaveCauses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de causas de licencia (`leaveCauses`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-g)

<a id="API-SUE-39-h"></a>
#### API-SUE-39-h · `GET /api/admin/sue/leave-causes/{id}`

- **Qué hace:** Tipos. Obtiene el detalle de un registro de causas de licencia (`leaveCauses`).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de causas de licencia (`leaveCauses`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-h)

<a id="API-SUE-39-j"></a>
#### API-SUE-39-j · `DELETE /api/admin/sue/leave-causes/{id}`

- **Qué hace:** Tipos. Elimina o da de baja un registro de causas de licencia (`leaveCauses`).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.causasLicencia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-j)

<a id="API-SUE-39-i"></a>
#### API-SUE-39-i · `PATCH /api/admin/sue/leave-causes/{id}`

- **Qué hace:** Tipos. Modifica algunos campos de un registro de causas de licencia (`leaveCauses`) (solo los enviados).
- **Para qué sirve:** RF-SUE-058: Causas de licencia: descripción, base legal (LCT o convenio), con o sin goce, días por período (0 = sin límite), corridos o hábiles, es vacaciones, tipo de novedad que genera, situación de revista asociada, requiere certificado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.tiposNovedad.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de causas de licencia (`leaveCauses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de causas de licencia (`leaveCauses`).
- **Pantallas:** PAN-SUE-17 (Tipos de novedad y causas de licencia).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-39-i)

<a id="API-SUE-40"></a>
#### API-SUE-40 · `GET /api/admin/sue/novelties`

- **Qué hace:** Novedades. Lista, con filtros y paginación, los registros de novedades (`novelties`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de novedades (`novelties`) con `total`.
- **Pantallas:** PAN-SUE-18 (Novedades del período), PAN-SUE-20 (Fichadas y horarios).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-40)

<a id="API-SUE-40-b"></a>
#### API-SUE-40-b · `POST /api/admin/sue/novelties`

- **Qué hace:** Novedades. Da de alta un registro de novedades (`novelties`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** los datos de novedades (`novelties`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de novedades (`novelties`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-40-b)

<a id="API-SUE-40-c"></a>
#### API-SUE-40-c · `PATCH /api/admin/sue/novelties`

- **Qué hace:** Novedades. Modifica algunos campos de un registro de novedades (`novelties`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** solo los campos a cambiar de novedades (`novelties`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de novedades (`novelties`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-40-c)

<a id="API-SUE-41"></a>
#### API-SUE-41 · `POST /api/admin/sue/novelties/approve`

- **Qué hace:** Acciones masivas. Aprueba sobre novedades (`novelties`).
- **Para qué sirve:** RF-SUE-047: Carga de novedades del período en grilla masiva por empleado y tipo, con fecha, cantidad o importe, observación, cuotas y referencia a origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-41)

<a id="API-SUE-41-b"></a>
#### API-SUE-41-b · `POST /api/admin/sue/novelties/void`

- **Qué hace:** Acciones masivas. Anula sobre novedades (`novelties`).
- **Para qué sirve:** RF-SUE-047: Carga de novedades del período en grilla masiva por empleado y tipo, con fecha, cantidad o importe, observación, cuotas y referencia a origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-41-b)

<a id="API-SUE-42"></a>
#### API-SUE-42 · `POST /api/admin/sue/novelty-imports`

- **Qué hace:** Importar (Excel, OT, flota, fichadas, anticipos) Registra un nuevo elemento u operación en `novelty-imports`.
- **Para qué sirve:** RF-SUE-048: Importación de novedades desde Excel con ExcelImportWizard. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-19 (Importación de novedades).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2124 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-42)

<a id="API-SUE-42-b"></a>
#### API-SUE-42-b · `POST /api/admin/sue/novelty-imports/{id}/confirm`

- **Qué hace:** Importar (Excel, OT, flota, fichadas, anticipos) Confirma un registro de `confirm`.
- **Para qué sirve:** RF-SUE-048: Importación de novedades desde Excel con ExcelImportWizard. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-19 (Importación de novedades).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2124 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-42-b)

<a id="API-SUE-43"></a>
#### API-SUE-43 · `GET /api/admin/sue/time-punches`

- **Qué hace:** Fichadas. Lista, con filtros y paginación, los registros de fichadas (`timePunches`).
- **Para qué sirve:** RF-SUE-052: Fichadas de reloj: carga manual o importada, procesamiento contra el turno para obtener horas trabajadas, tardanzas, horas no trabajadas y horas extra propuestas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de fichadas (`timePunches`) con `total`.
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-43)

<a id="API-SUE-43-b"></a>
#### API-SUE-43-b · `POST /api/admin/sue/time-punches`

- **Qué hace:** Fichadas. Da de alta un registro de fichadas (`timePunches`).
- **Para qué sirve:** RF-SUE-052: Fichadas de reloj: carga manual o importada, procesamiento contra el turno para obtener horas trabajadas, tardanzas, horas no trabajadas y horas extra propuestas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** los datos de fichadas (`timePunches`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de fichadas (`timePunches`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-43-b)

<a id="API-SUE-43-c"></a>
#### API-SUE-43-c · `POST /api/admin/sue/time-punches/process`

- **Qué hace:** Fichadas. Registra un nuevo elemento u operación en fichadas (`timePunches`).
- **Para qué sirve:** RF-SUE-052: Fichadas de reloj: carga manual o importada, procesamiento contra el turno para obtener horas trabajadas, tardanzas, horas no trabajadas y horas extra propuestas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-43-c)

<a id="API-SUE-44"></a>
#### API-SUE-44 · `GET /api/admin/sue/extra-tasks`

- **Qué hace:** Tareas extra. Lista, con filtros y paginación, los registros de tareas extraordinarias (`extraTasks`).
- **Para qué sirve:** RF-SUE-049: Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tareas extraordinarias (`extraTasks`) con `total`.
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-44)

<a id="API-SUE-44-b"></a>
#### API-SUE-44-b · `POST /api/admin/sue/extra-tasks`

- **Qué hace:** Tareas extra. Da de alta un registro de tareas extraordinarias (`extraTasks`).
- **Para qué sirve:** RF-SUE-049: Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** los datos de tareas extraordinarias (`extraTasks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tareas extraordinarias (`extraTasks`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-44-b)

<a id="API-SUE-44-c"></a>
#### API-SUE-44-c · `GET /api/admin/sue/extra-tasks/{id}`

- **Qué hace:** Tareas extra. Obtiene el detalle de un registro de tareas extraordinarias (`extraTasks`).
- **Para qué sirve:** RF-SUE-049: Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tareas extraordinarias (`extraTasks`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-44-c)

<a id="API-SUE-44-e"></a>
#### API-SUE-44-e · `DELETE /api/admin/sue/extra-tasks/{id}`

- **Qué hace:** Tareas extra. Elimina o da de baja un registro de tareas extraordinarias (`extraTasks`).
- **Para qué sirve:** RF-SUE-049: Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-44-e)

<a id="API-SUE-44-d"></a>
#### API-SUE-44-d · `PATCH /api/admin/sue/extra-tasks/{id}`

- **Qué hace:** Tareas extra. Modifica algunos campos de un registro de tareas extraordinarias (`extraTasks`) (solo los enviados).
- **Para qué sirve:** RF-SUE-049: Novedades propuestas desde partes de cuadrilla y órdenes de trabajo cerradas: horas normales, extra al 50 % y al 100 %, guardias, viáticos y tareas, por empleado y fecha, con vínculo a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.novedades.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tareas extraordinarias (`extraTasks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tareas extraordinarias (`extraTasks`).
- **Pantallas:** PAN-SUE-21 (Tareas extra).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-44-d)

<a id="API-SUE-45"></a>
#### API-SUE-45 · `GET /api/admin/sue/leave-requests`

- **Qué hace:** Licencias (admin) Lista, con filtros y paginación, los registros de licencias (`leaveRequests`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de licencias (`leaveRequests`) con `total`.
- **Pantallas:** PAN-SUE-22 (Bandeja y calendario de licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-45)

<a id="API-SUE-45-b"></a>
#### API-SUE-45-b · `POST /api/admin/sue/leave-requests`

- **Qué hace:** Licencias (admin) Da de alta un registro de licencias (`leaveRequests`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.ver`.
- **Recibe:** los datos de licencias (`leaveRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de licencias (`leaveRequests`).
- **Pantallas:** PAN-SUE-22 (Bandeja y calendario de licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-45-b)

<a id="API-SUE-46"></a>
#### API-SUE-46 · `POST /api/admin/sue/leave-requests/{id}/approve`

- **Qué hace:** Decisiones. Aprueba un registro de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-065: Calendario de licencias autorizadas por equipo y área. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.autorizar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2128 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-46)

<a id="API-SUE-46-b"></a>
#### API-SUE-46-b · `POST /api/admin/sue/leave-requests/{id}/reject`

- **Qué hace:** Decisiones. Rechaza un registro de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-065: Calendario de licencias autorizadas por equipo y área. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.autorizar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2128 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-46-b)

<a id="API-SUE-46-c"></a>
#### API-SUE-46-c · `POST /api/admin/sue/leave-requests/{id}/interrupt`

- **Qué hace:** Decisiones. Registra «interrupt» sobre un registro de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-065: Calendario de licencias autorizadas por equipo y área. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.autorizar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2128 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-46-c)

<a id="API-SUE-47"></a>
#### API-SUE-47 · `GET /api/admin/sue/vacation-balances`

- **Qué hace:** Saldos. Lista, con filtros y paginación, los registros de saldos de vacaciones (`vacationBalances`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.licencias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos de vacaciones (`vacationBalances`) con `total`.
- **Pantallas:** PAN-SUE-22 (Bandeja y calendario de licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2129 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-47)

<a id="API-SUE-48"></a>
#### API-SUE-48 · `GET /api/admin/sue/pay-periods`

- **Qué hace:** Períodos. Lista, con filtros y paginación, los registros de períodos de liquidación (`payPeriods`).
- **Para qué sirve:** RF-SUE-144: Exclusión mutua por empresa y período entre liquidación propia e importada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.cerrar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de períodos de liquidación (`payPeriods`) con `total`.
- **Pantallas:** PAN-SUE-23 (Períodos de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-48)

<a id="API-SUE-48-b"></a>
#### API-SUE-48-b · `POST /api/admin/sue/pay-periods`

- **Qué hace:** Períodos. Da de alta un registro de períodos de liquidación (`payPeriods`).
- **Para qué sirve:** RF-SUE-144: Exclusión mutua por empresa y período entre liquidación propia e importada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.cerrar`.
- **Recibe:** los datos de períodos de liquidación (`payPeriods`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de períodos de liquidación (`payPeriods`).
- **Pantallas:** PAN-SUE-23 (Períodos de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-48-b)

<a id="API-SUE-48-c"></a>
#### API-SUE-48-c · `POST /api/admin/sue/pay-periods/{id}/close`

- **Qué hace:** Períodos. Cierra un registro de períodos de liquidación (`payPeriods`).
- **Para qué sirve:** RF-SUE-144: Exclusión mutua por empresa y período entre liquidación propia e importada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-23 (Períodos de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-48-c)

<a id="API-SUE-48-d"></a>
#### API-SUE-48-d · `POST /api/admin/sue/pay-periods/{id}/reopen`

- **Qué hace:** Períodos. Reabre un registro de períodos de liquidación (`payPeriods`).
- **Para qué sirve:** RF-SUE-144: Exclusión mutua por empresa y período entre liquidación propia e importada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-23 (Períodos de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-48-d)

<a id="API-SUE-49"></a>
#### API-SUE-49 · `GET /api/admin/sue/payroll-runs`

- **Qué hace:** Liquidaciones. Lista, con filtros y paginación, los registros de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de liquidaciones (`payrollRuns`) con `total`.
- **Pantallas:** PAN-SUE-24 (Liquidaciones), PAN-SUE-25 (Detalle de liquidación), PAN-SUE-40 (Paralelo ProCoop).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2131 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-49)

<a id="API-SUE-49-b"></a>
#### API-SUE-49-b · `POST /api/admin/sue/payroll-runs`

- **Qué hace:** Liquidaciones. Da de alta un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.crear`.
- **Recibe:** los datos de liquidaciones (`payrollRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de liquidaciones (`payrollRuns`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2131 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-49-b)

<a id="API-SUE-50"></a>
#### API-SUE-50 · `POST /api/admin/sue/payroll-runs/{id}/calculate`

- **Qué hace:** Lanzar cálculo (job) Calcula un registro de liquidaciones (`payrollRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2132 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-50)

<a id="API-SUE-51"></a>
#### API-SUE-51 · `POST /api/admin/sue/payroll-runs/{id}/employees/{eid}/recalculate`

- **Qué hace:** Recalcular empleado. Recalcula un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-075: Recálculo individual de un empleado dentro de un lote no aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`, `eid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2133 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-51)

<a id="API-SUE-52"></a>
#### API-SUE-52 · `POST /api/admin/sue/payroll-runs/{id}/submit`

- **Qué hace:** Ciclo de la liquidación. Envía a revisión o presenta un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-52)

<a id="API-SUE-52-b"></a>
#### API-SUE-52-b · `POST /api/admin/sue/payroll-runs/{id}/approve`

- **Qué hace:** Ciclo de la liquidación. Aprueba un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-52-b)

<a id="API-SUE-52-c"></a>
#### API-SUE-52-c · `POST /api/admin/sue/payroll-runs/{id}/return`

- **Qué hace:** Ciclo de la liquidación. Devuelve un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-52-c)

<a id="API-SUE-52-d"></a>
#### API-SUE-52-d · `POST /api/admin/sue/payroll-runs/{id}/void`

- **Qué hace:** Ciclo de la liquidación. Anula un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-52-d)

<a id="API-SUE-52-e"></a>
#### API-SUE-52-e · `POST /api/admin/sue/payroll-runs/{id}/close`

- **Qué hace:** Ciclo de la liquidación. Cierra un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-52-e)

<a id="API-SUE-53"></a>
#### API-SUE-53 · `GET /api/admin/sue/payroll-runs/{id}/checks`

- **Qué hace:** Controles, comparativo, vista previa de asiento. Consulta «checks» de un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** RF-SUE-099: Control de totales SICOSS/LSD contra liquidación y asiento por subsistema. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de liquidaciones (`payrollRuns`).
- **Pantallas:** PAN-SUE-24 (Liquidaciones), PAN-SUE-25 (Detalle de liquidación), PAN-SUE-40 (Paralelo ProCoop).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-53)

<a id="API-SUE-53-b"></a>
#### API-SUE-53-b · `GET /api/admin/sue/payroll-runs/{id}/comparison`

- **Qué hace:** Controles, comparativo, vista previa de asiento. Consulta «comparison» de un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** RF-SUE-099: Control de totales SICOSS/LSD contra liquidación y asiento por subsistema. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de liquidaciones (`payrollRuns`).
- **Pantallas:** PAN-SUE-24 (Liquidaciones), PAN-SUE-25 (Detalle de liquidación), PAN-SUE-40 (Paralelo ProCoop).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-53-b)

<a id="API-SUE-53-c"></a>
#### API-SUE-53-c · `GET /api/admin/sue/payroll-runs/{id}/accounting-preview`

- **Qué hace:** Controles, comparativo, vista previa de asiento. Consulta «accounting-preview» de un registro de liquidaciones (`payrollRuns`).
- **Para qué sirve:** RF-SUE-099: Control de totales SICOSS/LSD contra liquidación y asiento por subsistema. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de liquidaciones (`payrollRuns`).
- **Pantallas:** PAN-SUE-24 (Liquidaciones), PAN-SUE-25 (Detalle de liquidación), PAN-SUE-40 (Paralelo ProCoop).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-53-c)

<a id="API-SUE-54"></a>
#### API-SUE-54 · `POST /api/admin/sue/simulations`

- **Qué hace:** Simulación. Registra un nuevo elemento u operación en `simulations`.
- **Para qué sirve:** RF-SUE-041: Versiones de configuración de sueldos: paquete de conceptos, variables, escalas y tipos de liquidación con fecha efectiva; copia a borrador, diferencias, simulación obligatoria contra el último período liquidado, revisión y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.simular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-26 (Simulador).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-54)

<a id="API-SUE-55"></a>
#### API-SUE-55 · `GET /api/admin/sue/payslips`

- **Qué hace:** Recibos. Lista, con filtros y paginación, los registros de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-054: Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recibos de sueldo (`payslips`) con `total`.
- **Pantallas:** PAN-SUE-27 (Recibo de sueldo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-55)

<a id="API-SUE-55-b"></a>
#### API-SUE-55-b · `GET /api/admin/sue/payslips/{id}`

- **Qué hace:** Recibos. Obtiene el detalle de un registro de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-054: Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de recibos de sueldo (`payslips`).
- **Pantallas:** PAN-SUE-27 (Recibo de sueldo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-55-b)

<a id="API-SUE-55-c"></a>
#### API-SUE-55-c · `GET /api/admin/sue/payslips/{id}/pdf`

- **Qué hace:** Recibos. Descarga un archivo de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-054: Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-SUE-27 (Recibo de sueldo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-55-c)

<a id="API-SUE-55-d"></a>
#### API-SUE-55-d · `GET /api/admin/sue/payslips/{id}/trace`

- **Qué hace:** Recibos. Consulta «trace» de un registro de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-054: Adelantos de sueldo: registro (desde SUE o como pago de M14), tope (art. 130 LCT), importación desde archivo, descuento automático en el próximo recibo salvo tipo de liquidación «no descontar adelantos». *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de recibos de sueldo (`payslips`).
- **Pantallas:** PAN-SUE-27 (Recibo de sueldo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-55-d)

<a id="API-SUE-56"></a>
#### API-SUE-56 · `POST /api/admin/sue/payslips/{id}/resend`

- **Qué hace:** Reenviar, rectificar. Reenvía un registro de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-080: Un único recibo por empleado, período, tipo de liquidación y empresa (salvo rectificativas y complementarias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.emitir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-56)

<a id="API-SUE-56-b"></a>
#### API-SUE-56-b · `POST /api/admin/sue/payslips/{id}/rectify`

- **Qué hace:** Reenviar, rectificar. Rectifica un registro de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-080: Un único recibo por empleado, período, tipo de liquidación y empresa (salvo rectificativas y complementarias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.emitir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-56-b)

<a id="API-SUE-57"></a>
#### API-SUE-57 · `POST /api/admin/sue/signature-batches`

- **Qué hace:** Lote de firma del empleador (crea las solicitudes en T11 por API-WFL-75) Registra un nuevo elemento u operación en `signature-batches`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-SUE-105: Firma del empleador y firma o conformidad del empleado delegadas en T11: al emitir, SUE pide la firma a T11 (API-WFL-75) con el perfil SIG-SUE-EMPLEADOR (firma digital con proveedor licenciado vía T06, RF-WFL-198) y luego… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.recibos.emitir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2139 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-57)

<a id="API-SUE-58"></a>
#### API-SUE-58 · `POST /api/admin/sue/terminations`

- **Qué hace:** Egresos. Da de alta un registro de egresos y liquidación final (`terminations`).
- **Para qué sirve:** RF-SUE-089: Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.egresos.crear`.
- **Recibe:** los datos de egresos y liquidación final (`terminations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de egresos y liquidación final (`terminations`).
- **Pantallas:** PAN-SUE-28 (Egresos y liquidación final).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-58)

<a id="API-SUE-58-b"></a>
#### API-SUE-58-b · `POST /api/admin/sue/terminations/{id}/simulate`

- **Qué hace:** Egresos. Simula sin efectos un registro de egresos y liquidación final (`terminations`).
- **Para qué sirve:** RF-SUE-089: Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.egresos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-28 (Egresos y liquidación final).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-58-b)

<a id="API-SUE-58-c"></a>
#### API-SUE-58-c · `POST /api/admin/sue/terminations/{id}/approve`

- **Qué hace:** Egresos. Aprueba un registro de egresos y liquidación final (`terminations`).
- **Para qué sirve:** RF-SUE-089: Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.egresos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-28 (Egresos y liquidación final).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-58-c)

<a id="API-SUE-58-d"></a>
#### API-SUE-58-d · `POST /api/admin/sue/terminations/{id}/cancel`

- **Qué hace:** Egresos. Cancela un registro de egresos y liquidación final (`terminations`).
- **Para qué sirve:** RF-SUE-089: Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.egresos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-28 (Egresos y liquidación final).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-58-d)

<a id="API-SUE-59"></a>
#### API-SUE-59 · `GET /api/admin/sue/income-tax/employees/{id}/calculator`

- **Qué hace:** Calculadora. Consulta «calculator» de un registro de legajos (`employees`).
- **Para qué sirve:** RF-SUE-056: Retención de Ganancias informada manualmente para un período (sustituye el cálculo) con motivo y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.ganancias.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de legajos (`employees`).
- **Pantallas:** PAN-SUE-29 (Ganancias).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2141 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-59)

<a id="API-SUE-60"></a>
#### API-SUE-60 · `POST /api/admin/sue/income-tax/f572-imports`

- **Qué hace:** Importar SIRADIG. Registra un nuevo elemento u operación en `f572-imports`.
- **Para qué sirve:** RF-SUE-086: Importación del F.572 web (SIRADIG) por empleado y período: cargas de familia, deducciones generales, otros empleos, pagos a cuenta, percepciones, con versión del formulario y fecha; P2763 para novedades de diciembre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.ganancias.importarF572`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2142 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-60)

<a id="API-SUE-61"></a>
#### API-SUE-61 · `POST /api/admin/sue/income-tax/annual-settlements`

- **Qué hace:** Liquidación anual. Registra un nuevo elemento u operación en `annual-settlements`.
- **Para qué sirve:** RF-SUE-089: Liquidación anual (al cierre del año fiscal) y final (por egreso) con emisión del formulario informativo (F.1357 o el vigente) para el empleado y su exportación a ARCA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.ganancias.calcular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2143 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-61)

<a id="API-SUE-62"></a>
#### API-SUE-62 · `GET /api/admin/sue/income-tax/differences`

- **Qué hace:** Diferencias mes a mes (XLSX) Consulta `differences`.
- **Para qué sirve:** RF-SUE-088: Calculadora de Ganancias por empleado con cada campo del cálculo y diferencias mes a mes exportables a Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.ganancias.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-29 (Ganancias).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-62)

<a id="API-SUE-63"></a>
#### API-SUE-63 · `POST /api/admin/sue/filings`

- **Qué hace:** Generar LSD, SICOSS, SICORE, F.1357/F.1359, sindicatos, ART. Da de alta un registro de presentaciones (`statutoryFilings`).
- **Para qué sirve:** RF-SUE-103: Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.presentaciones.generar`.
- **Recibe:** los datos de presentaciones (`statutoryFilings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentaciones (`statutoryFilings`).
- **Pantallas:** PAN-SUE-30 (Presentaciones).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2145 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-63)

<a id="API-SUE-64"></a>
#### API-SUE-64 · `POST /api/admin/sue/filings/{id}/approve`

- **Qué hace:** Aprobar, cargar acuse, rectificar. Aprueba un registro de presentaciones (`statutoryFilings`).
- **Para qué sirve:** RF-SUE-103: Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.presentaciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2146 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-64)

<a id="API-SUE-64-b"></a>
#### API-SUE-64-b · `POST /api/admin/sue/filings/{id}/acknowledge`

- **Qué hace:** Aprobar, cargar acuse, rectificar. Toma conocimiento de un registro de presentaciones (`statutoryFilings`).
- **Para qué sirve:** RF-SUE-103: Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.presentaciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2146 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-64-b)

<a id="API-SUE-64-c"></a>
#### API-SUE-64-c · `POST /api/admin/sue/filings/{id}/rectify`

- **Qué hace:** Aprobar, cargar acuse, rectificar. Rectifica un registro de presentaciones (`statutoryFilings`).
- **Para qué sirve:** RF-SUE-103: Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.presentaciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2146 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-64-c)

<a id="API-SUE-65"></a>
#### API-SUE-65 · `GET /api/admin/sue/filings/{id}/file`

- **Qué hace:** Descargar archivo (URL firmada) Descarga un archivo de presentaciones (`statutoryFilings`).
- **Para qué sirve:** RF-SUE-103: Registro de presentaciones: archivo generado (hash), usuario, fecha, acuse de ARCA cargado, VEP y su pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.presentaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2147 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-65)

<a id="API-SUE-67"></a>
#### API-SUE-67 · `GET /api/admin/sue/payment-requests`

- **Qué hace:** Seguimiento. Lista, con filtros y paginación, los registros de solicitudes de pago a M14 (`payrollPaymentRequests`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.pagos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de solicitudes de pago a M14 (`payrollPaymentRequests`) con `total`.
- **Pantallas:** PAN-SUE-31 (Pago de haberes).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2149 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-67)

<a id="API-SUE-66"></a>
#### API-SUE-66 · `POST /api/admin/sue/payment-requests`

- **Qué hace:** Pago de haberes y obligaciones. Da de alta un registro de solicitudes de pago a M14 (`payrollPaymentRequests`).
- **Para qué sirve:** RF-SUE-119: Asientos de pago de haberes y de cancelación de obligaciones (generados por M14 con las cuentas puente que define SUE). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.pagos.solicitar`.
- **Recibe:** los datos de solicitudes de pago a M14 (`payrollPaymentRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de solicitudes de pago a M14 (`payrollPaymentRequests`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2148 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-66)

<a id="API-SUE-66-b"></a>
#### API-SUE-66-b · `POST /api/admin/sue/payment-requests/{id}/cancel`

- **Qué hace:** Pago de haberes y obligaciones. Cancela un registro de solicitudes de pago a M14 (`payrollPaymentRequests`).
- **Para qué sirve:** RF-SUE-119: Asientos de pago de haberes y de cancelación de obligaciones (generados por M14 con las cuentas puente que define SUE). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.pagos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2148 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-66-b)

<a id="API-SUE-66-c"></a>
#### API-SUE-66-c · `POST /api/admin/sue/payment-requests/{id}/retry-rejected`

- **Qué hace:** Pago de haberes y obligaciones. Registra «retry-rejected» sobre un registro de solicitudes de pago a M14 (`payrollPaymentRequests`).
- **Para qué sirve:** RF-SUE-119: Asientos de pago de haberes y de cancelación de obligaciones (generados por M14 con las cuentas puente que define SUE). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.pagos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2148 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-66-c)

<a id="API-SUE-68"></a>
#### API-SUE-68 · `GET /api/admin/sue/accounting-rules`

- **Qué hace:** Reglas contables. Lista, con filtros y paginación, los registros de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de asiento de sueldos (`payrollAccountingRules`) con `total`.
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68)

<a id="API-SUE-68-b"></a>
#### API-SUE-68-b · `POST /api/admin/sue/accounting-rules`

- **Qué hace:** Reglas contables. Da de alta un registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** los datos de reglas de asiento de sueldos (`payrollAccountingRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68-b)

<a id="API-SUE-68-c"></a>
#### API-SUE-68-c · `GET /api/admin/sue/accounting-rules/{id}`

- **Qué hace:** Reglas contables. Obtiene el detalle de un registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68-c)

<a id="API-SUE-68-e"></a>
#### API-SUE-68-e · `DELETE /api/admin/sue/accounting-rules/{id}`

- **Qué hace:** Reglas contables. Elimina o da de baja un registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68-e)

<a id="API-SUE-68-d"></a>
#### API-SUE-68-d · `PATCH /api/admin/sue/accounting-rules/{id}`

- **Qué hace:** Reglas contables. Modifica algunos campos de un registro de reglas de asiento de sueldos (`payrollAccountingRules`) (solo los enviados).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas de asiento de sueldos (`payrollAccountingRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de asiento de sueldos (`payrollAccountingRules`).
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68-d)

<a id="API-SUE-68-f"></a>
#### API-SUE-68-f · `POST /api/admin/sue/accounting-rules/validate`

- **Qué hace:** Reglas contables. Valida sobre reglas de asiento de sueldos (`payrollAccountingRules`).
- **Para qué sirve:** RF-SUE-117: Reglas de imputación contable de sueldos: por concepto, por empresa (incluida cuenta de contribuciones), por sindicato (general y cargas) y personalizadas por filtro (empresa, sindicato, categorías, empleados, sección, cargo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reglasContables.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-32 (Reglas de imputación contable).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2150 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-68-f)

<a id="API-SUE-69"></a>
#### API-SUE-69 · `GET /api/admin/sue/certificates`

- **Qué hace:** Certificados y constancias. Lista, con filtros y paginación, los registros de certificados de trabajo (`employmentCertificates`).
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.certificados.emitir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de certificados de trabajo (`employmentCertificates`) con `total`.
- **Pantallas:** PAN-SUE-33 (Certificados y constancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-69)

<a id="API-SUE-69-b"></a>
#### API-SUE-69-b · `POST /api/admin/sue/certificates`

- **Qué hace:** Certificados y constancias. Da de alta un registro de certificados de trabajo (`employmentCertificates`).
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.certificados.emitir`.
- **Recibe:** los datos de certificados de trabajo (`employmentCertificates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de certificados de trabajo (`employmentCertificates`).
- **Pantallas:** PAN-SUE-33 (Certificados y constancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-69-b)

<a id="API-SUE-69-c"></a>
#### API-SUE-69-c · `POST /api/admin/sue/certificates/{id}/issue`

- **Qué hace:** Certificados y constancias. Emite un registro de certificados de trabajo (`employmentCertificates`).
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.certificados.emitir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-33 (Certificados y constancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2151 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-69-c)

<a id="API-SUE-70"></a>
#### API-SUE-70 · `GET /api/admin/sue/hr/performance-templates`

- **Qué hace:** Evaluaciones y objetivos. Lista, con filtros y paginación, los registros de plantillas de evaluación (`performanceTemplates`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de evaluación (`performanceTemplates`) con `total`.
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70)

<a id="API-SUE-70-b"></a>
#### API-SUE-70-b · `POST /api/admin/sue/hr/performance-templates`

- **Qué hace:** Evaluaciones y objetivos. Da de alta un registro de plantillas de evaluación (`performanceTemplates`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** los datos de plantillas de evaluación (`performanceTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de evaluación (`performanceTemplates`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-b)

<a id="API-SUE-70-c"></a>
#### API-SUE-70-c · `GET /api/admin/sue/hr/performance-templates/{id}`

- **Qué hace:** Evaluaciones y objetivos. Obtiene el detalle de un registro de plantillas de evaluación (`performanceTemplates`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de evaluación (`performanceTemplates`).
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-c)

<a id="API-SUE-70-e"></a>
#### API-SUE-70-e · `DELETE /api/admin/sue/hr/performance-templates/{id}`

- **Qué hace:** Evaluaciones y objetivos. Elimina o da de baja un registro de plantillas de evaluación (`performanceTemplates`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.objetivos.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-e)

<a id="API-SUE-70-d"></a>
#### API-SUE-70-d · `PATCH /api/admin/sue/hr/performance-templates/{id}`

- **Qué hace:** Evaluaciones y objetivos. Modifica algunos campos de un registro de plantillas de evaluación (`performanceTemplates`) (solo los enviados).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantillas de evaluación (`performanceTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantillas de evaluación (`performanceTemplates`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-d)

<a id="API-SUE-70-f"></a>
#### API-SUE-70-f · `GET /api/admin/sue/hr/cycles`

- **Qué hace:** Evaluaciones y objetivos. Lista, con filtros y paginación, los registros de ciclos de evaluación (`performanceCycles`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ciclos de evaluación (`performanceCycles`) con `total`.
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-f)

<a id="API-SUE-70-g"></a>
#### API-SUE-70-g · `POST /api/admin/sue/hr/cycles`

- **Qué hace:** Evaluaciones y objetivos. Da de alta un registro de ciclos de evaluación (`performanceCycles`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** los datos de ciclos de evaluación (`performanceCycles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ciclos de evaluación (`performanceCycles`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-g)

<a id="API-SUE-70-h"></a>
#### API-SUE-70-h · `GET /api/admin/sue/hr/cycles/{id}`

- **Qué hace:** Evaluaciones y objetivos. Obtiene el detalle de un registro de ciclos de evaluación (`performanceCycles`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ciclos de evaluación (`performanceCycles`).
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-h)

<a id="API-SUE-70-j"></a>
#### API-SUE-70-j · `DELETE /api/admin/sue/hr/cycles/{id}`

- **Qué hace:** Evaluaciones y objetivos. Elimina o da de baja un registro de ciclos de evaluación (`performanceCycles`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.objetivos.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-j)

<a id="API-SUE-70-i"></a>
#### API-SUE-70-i · `PATCH /api/admin/sue/hr/cycles/{id}`

- **Qué hace:** Evaluaciones y objetivos. Modifica algunos campos de un registro de ciclos de evaluación (`performanceCycles`) (solo los enviados).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ciclos de evaluación (`performanceCycles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ciclos de evaluación (`performanceCycles`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-i)

<a id="API-SUE-70-k"></a>
#### API-SUE-70-k · `GET /api/admin/sue/hr/reviews`

- **Qué hace:** Evaluaciones y objetivos. Lista, con filtros y paginación, los registros de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de evaluaciones (`performanceReviews`) con `total`.
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-k)

<a id="API-SUE-70-l"></a>
#### API-SUE-70-l · `POST /api/admin/sue/hr/reviews`

- **Qué hace:** Evaluaciones y objetivos. Da de alta un registro de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** los datos de evaluaciones (`performanceReviews`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de evaluaciones (`performanceReviews`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-l)

<a id="API-SUE-70-m"></a>
#### API-SUE-70-m · `GET /api/admin/sue/hr/reviews/{id}`

- **Qué hace:** Evaluaciones y objetivos. Obtiene el detalle de un registro de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de evaluaciones (`performanceReviews`).
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-m)

<a id="API-SUE-70-o"></a>
#### API-SUE-70-o · `DELETE /api/admin/sue/hr/reviews/{id}`

- **Qué hace:** Evaluaciones y objetivos. Elimina o da de baja un registro de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.objetivos.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-o)

<a id="API-SUE-70-n"></a>
#### API-SUE-70-n · `PATCH /api/admin/sue/hr/reviews/{id}`

- **Qué hace:** Evaluaciones y objetivos. Modifica algunos campos de un registro de evaluaciones (`performanceReviews`) (solo los enviados).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de evaluaciones (`performanceReviews`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de evaluaciones (`performanceReviews`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-n)

<a id="API-SUE-70-p"></a>
#### API-SUE-70-p · `GET /api/admin/sue/hr/objectives`

- **Qué hace:** Evaluaciones y objetivos. Lista, con filtros y paginación, los registros de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de objetivos (`objectives`) con `total`.
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-p)

<a id="API-SUE-70-q"></a>
#### API-SUE-70-q · `POST /api/admin/sue/hr/objectives`

- **Qué hace:** Evaluaciones y objetivos. Da de alta un registro de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** los datos de objetivos (`objectives`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de objetivos (`objectives`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-q)

<a id="API-SUE-70-r"></a>
#### API-SUE-70-r · `GET /api/admin/sue/hr/objectives/{id}`

- **Qué hace:** Evaluaciones y objetivos. Obtiene el detalle de un registro de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de objetivos (`objectives`).
- **Pantallas:** PAN-SUE-34 (Evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-r)

<a id="API-SUE-70-t"></a>
#### API-SUE-70-t · `DELETE /api/admin/sue/hr/objectives/{id}`

- **Qué hace:** Evaluaciones y objetivos. Elimina o da de baja un registro de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.objetivos.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-t)

<a id="API-SUE-70-s"></a>
#### API-SUE-70-s · `PATCH /api/admin/sue/hr/objectives/{id}`

- **Qué hace:** Evaluaciones y objetivos. Modifica algunos campos de un registro de objetivos (`objectives`) (solo los enviados).
- **Para qué sirve:** RF-SUE-128: Objetivos individuales o de área con peso, meta, indicador, avance y evaluación al cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.evaluaciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de objetivos (`objectives`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de objetivos (`objectives`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2152 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-70-s)

<a id="API-SUE-71"></a>
#### API-SUE-71 · `GET /api/admin/sue/hr/disciplinary-actions`

- **Qué hace:** Disciplina. Lista, con filtros y paginación, los registros de sanciones (`disciplinaryActions`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sanciones (`disciplinaryActions`) con `total`.
- **Pantallas:** PAN-SUE-35 (Sanciones y sumarios).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71)

<a id="API-SUE-71-b"></a>
#### API-SUE-71-b · `POST /api/admin/sue/hr/disciplinary-actions`

- **Qué hace:** Disciplina. Da de alta un registro de sanciones (`disciplinaryActions`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.editar`.
- **Recibe:** los datos de sanciones (`disciplinaryActions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sanciones (`disciplinaryActions`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-b)

<a id="API-SUE-71-c"></a>
#### API-SUE-71-c · `GET /api/admin/sue/hr/disciplinary-actions/{id}`

- **Qué hace:** Disciplina. Obtiene el detalle de un registro de sanciones (`disciplinaryActions`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sanciones (`disciplinaryActions`).
- **Pantallas:** PAN-SUE-35 (Sanciones y sumarios).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-c)

<a id="API-SUE-71-e"></a>
#### API-SUE-71-e · `DELETE /api/admin/sue/hr/disciplinary-actions/{id}`

- **Qué hace:** Disciplina. Elimina o da de baja un registro de sanciones (`disciplinaryActions`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sumarios.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-e)

<a id="API-SUE-71-d"></a>
#### API-SUE-71-d · `PATCH /api/admin/sue/hr/disciplinary-actions/{id}`

- **Qué hace:** Disciplina. Modifica algunos campos de un registro de sanciones (`disciplinaryActions`) (solo los enviados).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sanciones (`disciplinaryActions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sanciones (`disciplinaryActions`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-d)

<a id="API-SUE-71-f"></a>
#### API-SUE-71-f · `GET /api/admin/sue/hr/inquiries`

- **Qué hace:** Disciplina. Lista, con filtros y paginación, los registros de sumarios (`administrativeInquiries`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sumarios (`administrativeInquiries`) con `total`.
- **Pantallas:** PAN-SUE-35 (Sanciones y sumarios).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-f)

<a id="API-SUE-71-g"></a>
#### API-SUE-71-g · `POST /api/admin/sue/hr/inquiries`

- **Qué hace:** Disciplina. Da de alta un registro de sumarios (`administrativeInquiries`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.editar`.
- **Recibe:** los datos de sumarios (`administrativeInquiries`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sumarios (`administrativeInquiries`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-g)

<a id="API-SUE-71-h"></a>
#### API-SUE-71-h · `GET /api/admin/sue/hr/inquiries/{id}`

- **Qué hace:** Disciplina. Obtiene el detalle de un registro de sumarios (`administrativeInquiries`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sumarios (`administrativeInquiries`).
- **Pantallas:** PAN-SUE-35 (Sanciones y sumarios).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-h)

<a id="API-SUE-71-j"></a>
#### API-SUE-71-j · `DELETE /api/admin/sue/hr/inquiries/{id}`

- **Qué hace:** Disciplina. Elimina o da de baja un registro de sumarios (`administrativeInquiries`).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sumarios.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-j)

<a id="API-SUE-71-i"></a>
#### API-SUE-71-i · `PATCH /api/admin/sue/hr/inquiries/{id}`

- **Qué hace:** Disciplina. Modifica algunos campos de un registro de sumarios (`administrativeInquiries`) (solo los enviados).
- **Para qué sirve:** RF-SUE-129: Sanciones disciplinarias (apercibimiento, suspensión con días) con hecho, fecha, notificación, descargo y vínculo a sumario; la suspensión genera novedad sin goce y situación de revista. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.sanciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sumarios (`administrativeInquiries`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sumarios (`administrativeInquiries`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2153 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-71-i)

<a id="API-SUE-72"></a>
#### API-SUE-72 · `GET /api/admin/sue/hr/work-accidents`

- **Qué hace:** Accidentes. Lista, con filtros y paginación, los registros de accidentes de trabajo (`workAccidents`).
- **Para qué sirve:** RF-SUE-102: ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. · RF-SUE-131: Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.accidentes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de accidentes de trabajo (`workAccidents`) con `total`.
- **Pantallas:** PAN-SUE-36 (Accidentes y ART).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-72)

<a id="API-SUE-72-b"></a>
#### API-SUE-72-b · `POST /api/admin/sue/hr/work-accidents`

- **Qué hace:** Accidentes. Da de alta un registro de accidentes de trabajo (`workAccidents`).
- **Para qué sirve:** RF-SUE-102: ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. · RF-SUE-131: Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.accidentes.editar`.
- **Recibe:** los datos de accidentes de trabajo (`workAccidents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de accidentes de trabajo (`workAccidents`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-72-b)

<a id="API-SUE-72-c"></a>
#### API-SUE-72-c · `GET /api/admin/sue/hr/work-accidents/{id}`

- **Qué hace:** Accidentes. Obtiene el detalle de un registro de accidentes de trabajo (`workAccidents`).
- **Para qué sirve:** RF-SUE-102: ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. · RF-SUE-131: Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.accidentes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de accidentes de trabajo (`workAccidents`).
- **Pantallas:** PAN-SUE-36 (Accidentes y ART).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-72-c)

<a id="API-SUE-72-e"></a>
#### API-SUE-72-e · `DELETE /api/admin/sue/hr/work-accidents/{id}`

- **Qué hace:** Accidentes. Elimina o da de baja un registro de accidentes de trabajo (`workAccidents`).
- **Para qué sirve:** RF-SUE-102: ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. · RF-SUE-131: Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.accidentes.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-72-e)

<a id="API-SUE-72-d"></a>
#### API-SUE-72-d · `PATCH /api/admin/sue/hr/work-accidents/{id}`

- **Qué hace:** Accidentes. Modifica algunos campos de un registro de accidentes de trabajo (`workAccidents`) (solo los enviados).
- **Para qué sirve:** RF-SUE-102: ART: nómina para la aseguradora, alícuotas, códigos de siniestrado, vínculo con accidentes y ILT, reintegros de la ART. · RF-SUE-131: Accidentes laborales y enfermedades profesionales: denuncia, fecha, lugar, testigos, ART, número de siniestro, días de ILT, licencias vinculadas, reintegros de la ART, alta médica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.accidentes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de accidentes de trabajo (`workAccidents`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de accidentes de trabajo (`workAccidents`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2154 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-72-d)

<a id="API-SUE-73"></a>
#### API-SUE-73 · `GET /api/admin/sue/hr/labor-lawsuits`

- **Qué hace:** Juicios. Lista, con filtros y paginación, los registros de juicios laborales (`laborLawsuits`).
- **Para qué sirve:** RF-SUE-132: Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.juicios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de juicios laborales (`laborLawsuits`) con `total`.
- **Pantallas:** PAN-SUE-37 (Juicios laborales).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-73)

<a id="API-SUE-73-b"></a>
#### API-SUE-73-b · `POST /api/admin/sue/hr/labor-lawsuits`

- **Qué hace:** Juicios. Da de alta un registro de juicios laborales (`laborLawsuits`).
- **Para qué sirve:** RF-SUE-132: Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.juicios.editar`.
- **Recibe:** los datos de juicios laborales (`laborLawsuits`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de juicios laborales (`laborLawsuits`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-73-b)

<a id="API-SUE-73-c"></a>
#### API-SUE-73-c · `GET /api/admin/sue/hr/labor-lawsuits/{id}`

- **Qué hace:** Juicios. Obtiene el detalle de un registro de juicios laborales (`laborLawsuits`).
- **Para qué sirve:** RF-SUE-132: Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.juicios.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de juicios laborales (`laborLawsuits`).
- **Pantallas:** PAN-SUE-37 (Juicios laborales).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-73-c)

<a id="API-SUE-73-e"></a>
#### API-SUE-73-e · `DELETE /api/admin/sue/hr/labor-lawsuits/{id}`

- **Qué hace:** Juicios. Elimina o da de baja un registro de juicios laborales (`laborLawsuits`).
- **Para qué sirve:** RF-SUE-132: Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.juicios.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-73-e)

<a id="API-SUE-73-d"></a>
#### API-SUE-73-d · `PATCH /api/admin/sue/hr/labor-lawsuits/{id}`

- **Qué hace:** Juicios. Modifica algunos campos de un registro de juicios laborales (`laborLawsuits`) (solo los enviados).
- **Para qué sirve:** RF-SUE-132: Juicios laborales: expediente, carátula, juzgado, actor, estudio, monto reclamado, estado procesal, provisión contable, audiencias, vínculo a la gestión judicial (MER-006). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.rrhh.juicios.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de juicios laborales (`laborLawsuits`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de juicios laborales (`laborLawsuits`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2155 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-73-d)

<a id="API-SUE-74"></a>
#### API-SUE-74 · `GET /api/admin/sue/reports/{reportKey}`

- **Qué hace:** Informes del §15. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-SUE-138: Informes operativos heredados de ProCoop (ver §15) y gráficos por grupos de conceptos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.reportes.ver`.
- **Recibe:** en la ruta `reportKey`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-01 (Tablero de sueldos), PAN-SUE-11 (Consulta de tablas oficiales adoptadas), PAN-SUE-38 (Informes de sueldos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2156 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-74)

<a id="API-SUE-75"></a>
#### API-SUE-75 · `POST /api/admin/sue/external-payrolls`

- **Qué hace:** CU-28. Registra un nuevo elemento u operación en `external-payrolls`.
- **Para qué sirve:** RF-SUE-121: Asiento de liquidación externa importada (CU-28) con sus totales por concepto y centro de costo. · RF-SUE-140: Importar una liquidación cerrada por un sistema laboral externo: referencia de lote, origen, empresa, período, tipo, totales por concepto y centro de costo, opcionalmente detalle por legajo (neto, CBU) para pagar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-75)

<a id="API-SUE-75-b"></a>
#### API-SUE-75-b · `POST /api/admin/sue/external-payrolls/{id}/approve`

- **Qué hace:** CU-28. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-SUE-121: Asiento de liquidación externa importada (CU-28) con sus totales por concepto y centro de costo. · RF-SUE-140: Importar una liquidación cerrada por un sistema laboral externo: referencia de lote, origen, empresa, período, tipo, totales por concepto y centro de costo, opcionalmente detalle por legajo (neto, CBU) para pagar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-75-b)

<a id="API-SUE-75-c"></a>
#### API-SUE-75-c · `POST /api/admin/sue/external-payrolls/{id}/void`

- **Qué hace:** CU-28. Anula un registro de `void`.
- **Para qué sirve:** RF-SUE-121: Asiento de liquidación externa importada (CU-28) con sus totales por concepto y centro de costo. · RF-SUE-140: Importar una liquidación cerrada por un sistema laboral externo: referencia de lote, origen, empresa, período, tipo, totales por concepto y centro de costo, opcionalmente detalle por legajo (neto, CBU) para pagar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2157 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-75-c)

<a id="API-SUE-76"></a>
#### API-SUE-76 · `GET /api/admin/sue/external-payroll-layouts`

- **Qué hace:** Layouts y mapeos. Lista, con filtros y paginación, los registros de formatos del liquidador externo (`externalPayrollLayouts`).
- **Para qué sirve:** RF-SUE-142: Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de formatos del liquidador externo (`externalPayrollLayouts`) con `total`.
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-76)

<a id="API-SUE-76-b"></a>
#### API-SUE-76-b · `POST /api/admin/sue/external-payroll-layouts`

- **Qué hace:** Layouts y mapeos. Da de alta un registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Para qué sirve:** RF-SUE-142: Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** los datos de formatos del liquidador externo (`externalPayrollLayouts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-76-b)

<a id="API-SUE-76-c"></a>
#### API-SUE-76-c · `GET /api/admin/sue/external-payroll-layouts/{id}`

- **Qué hace:** Layouts y mapeos. Obtiene el detalle de un registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Para qué sirve:** RF-SUE-142: Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-76-c)

<a id="API-SUE-76-e"></a>
#### API-SUE-76-e · `DELETE /api/admin/sue/external-payroll-layouts/{id}`

- **Qué hace:** Layouts y mapeos. Elimina o da de baja un registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Para qué sirve:** RF-SUE-142: Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-76-e)

<a id="API-SUE-76-d"></a>
#### API-SUE-76-d · `PATCH /api/admin/sue/external-payroll-layouts/{id}`

- **Qué hace:** Layouts y mapeos. Modifica algunos campos de un registro de formatos del liquidador externo (`externalPayrollLayouts`) (solo los enviados).
- **Para qué sirve:** RF-SUE-142: Mapeo configurable de conceptos externos a cuentas contables y layout de importación (CSV/XLSX/JSON). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.importacionExterna.importar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de formatos del liquidador externo (`externalPayrollLayouts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de formatos del liquidador externo (`externalPayrollLayouts`).
- **Ola:** O8 · **Fuente:** M16 §11. API, línea 2158 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-76-d)

<a id="API-SUE-77"></a>
#### API-SUE-77 · `POST /api/admin/sue/parallel-comparisons`

- **Qué hace:** Paralelo. Registra un nuevo elemento u operación en `parallel-comparisons`.
- **Para qué sirve:** RF-SUE-145: Paralelo de liquidación ProCoop / GoodApps con comparativo por empleado y concepto durante los períodos que se acuerden. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `sue.liquidaciones.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-24 (Liquidaciones), PAN-SUE-25 (Detalle de liquidación), PAN-SUE-40 (Paralelo ProCoop).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2159 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-77)

<a id="API-SUE-78"></a>
#### API-SUE-78 · `GET /api/sue/me/payslips`

- **Qué hace:** Mis recibos. Lista, con filtros y paginación, los registros de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-107: Portal del empleado: lista de recibos, descarga, firma/conformidad en la interfaz de firma de T11 (PAN-WFL-27); opción de mostrar recibos sin firma digital del empleador (P2886). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.recibos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recibos de sueldo (`payslips`) con `total`.
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2160 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-78)

<a id="API-SUE-78-b"></a>
#### API-SUE-78-b · `GET /api/sue/me/payslips/{id}/pdf`

- **Qué hace:** Mis recibos. Descarga un archivo de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-107: Portal del empleado: lista de recibos, descarga, firma/conformidad en la interfaz de firma de T11 (PAN-WFL-27); opción de mostrar recibos sin firma digital del empleador (P2886). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2160 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-78-b)

<a id="API-SUE-79"></a>
#### API-SUE-79 · `POST /api/sue/me/payslips/{id}/viewed`

- **Qué hace:** Constancia de visto; la firma, la firma en disconformidad y el rechazo se hacen en T11 (API-WFL-77 a API-WFL-79, PAN-WFL-27) Registra «viewed» sobre un registro de recibos de sueldo (`payslips`).
- **Para qué sirve:** RF-SUE-106: Entrega digital con constancia de recepción (fecha, hora, dispositivo, IP, hash), notificación y recordatorios de recibos pendientes de firma (los envía T11 con JOB-WFL-09, según PRM-SUE-024/049). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.recibos.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-41 (Mis recibos de sueldo), PAN-POR-70 (Mis recibos), PAN-POR-71 (Detalle del recibo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2161 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-79)

<a id="API-SUE-80"></a>
#### API-SUE-80 · `GET /api/sue/me/leave-requests`

- **Qué hace:** Licencias propias. Lista, con filtros y paginación, los registros de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.licencias.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de licencias (`leaveRequests`) con `total`.
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2162 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-80)

<a id="API-SUE-80-b"></a>
#### API-SUE-80-b · `POST /api/sue/me/leave-requests`

- **Qué hace:** Licencias propias. Da de alta un registro de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.licencias.solicitar`.
- **Recibe:** los datos de licencias (`leaveRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de licencias (`leaveRequests`).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2162 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-80-b)

<a id="API-SUE-80-c"></a>
#### API-SUE-80-c · `GET /api/sue/me/vacation-balance`

- **Qué hace:** Licencias propias. Lista, con filtros y paginación, los registros de saldos de vacaciones (`vacationBalances`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.licencias.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos de vacaciones (`vacationBalances`) con `total`.
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2162 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-80-c)

<a id="API-SUE-80-d"></a>
#### API-SUE-80-d · `POST /api/sue/me/vacation-balance`

- **Qué hace:** Licencias propias. Da de alta un registro de saldos de vacaciones (`vacationBalances`).
- **Para qué sirve:** RF-SUE-108: Portal: saldo de vacaciones, solicitud y seguimiento de licencias, calendario personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.licencias.solicitar`.
- **Recibe:** los datos de saldos de vacaciones (`vacationBalances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de saldos de vacaciones (`vacationBalances`).
- **Pantallas:** PAN-SUE-42 (Vacaciones y licencias), PAN-POR-72 (Vacaciones), PAN-POR-73 (Licencias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2162 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-80-d)

<a id="API-SUE-81"></a>
#### API-SUE-81 · `GET /api/sue/me/profile`

- **Qué hace:** Datos y documentos. Consulta `profile`.
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-43 (Mis datos y documentos), PAN-POR-74 (Mi legajo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81)

<a id="API-SUE-81-b"></a>
#### API-SUE-81-b · `POST /api/sue/me/profile`

- **Qué hace:** Datos y documentos. Registra un nuevo elemento u operación en `profile`.
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81-b)

<a id="API-SUE-81-c"></a>
#### API-SUE-81-c · `GET /api/sue/me/change-requests`

- **Qué hace:** Datos y documentos. Consulta `change-requests`.
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-43 (Mis datos y documentos), PAN-POR-74 (Mi legajo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81-c)

<a id="API-SUE-81-d"></a>
#### API-SUE-81-d · `POST /api/sue/me/change-requests`

- **Qué hace:** Datos y documentos. Registra un nuevo elemento u operación en `change-requests`.
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81-d)

<a id="API-SUE-81-e"></a>
#### API-SUE-81-e · `GET /api/sue/me/documents`

- **Qué hace:** Datos y documentos. Lista, con filtros y paginación, los registros de documentación del legajo (`employeeDocuments`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de documentación del legajo (`employeeDocuments`) con `total`.
- **Pantallas:** PAN-SUE-43 (Mis datos y documentos), PAN-POR-74 (Mi legajo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81-e)

<a id="API-SUE-81-f"></a>
#### API-SUE-81-f · `POST /api/sue/me/documents`

- **Qué hace:** Datos y documentos. Da de alta un registro de documentación del legajo (`employeeDocuments`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.datos.editar`.
- **Recibe:** los datos de documentación del legajo (`employeeDocuments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentación del legajo (`employeeDocuments`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2163 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-81-f)

<a id="API-SUE-82"></a>
#### API-SUE-82 · `GET /api/sue/me/certificates`

- **Qué hace:** Constancias. Lista, con filtros y paginación, los registros de certificados de trabajo (`employmentCertificates`).
- **Para qué sirve:** RF-SUE-123: Constancias (de trabajo, de haberes, de aportes) a pedido del empleado desde el portal o la administración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.certificados.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de certificados de trabajo (`employmentCertificates`) con `total`.
- **Pantallas:** PAN-SUE-45 (Mis certificados y constancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2164 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-82)

<a id="API-SUE-82-b"></a>
#### API-SUE-82-b · `POST /api/sue/me/certificates`

- **Qué hace:** Constancias. Da de alta un registro de certificados de trabajo (`employmentCertificates`).
- **Para qué sirve:** RF-SUE-123: Constancias (de trabajo, de haberes, de aportes) a pedido del empleado desde el portal o la administración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.certificados.ver`.
- **Recibe:** los datos de certificados de trabajo (`employmentCertificates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de certificados de trabajo (`employmentCertificates`).
- **Pantallas:** PAN-SUE-45 (Mis certificados y constancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2164 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-82-b)

<a id="API-SUE-83"></a>
#### API-SUE-83 · `GET /api/sue/team/leave-requests`

- **Qué hace:** Encargado. Lista, con filtros y paginación, los registros de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-110: Portal del encargado: equipo, licencias y novedades a aprobar, calendario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.equipo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de licencias (`leaveRequests`) con `total`.
- **Pantallas:** PAN-SUE-44 (Mi equipo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-83)

<a id="API-SUE-83-b"></a>
#### API-SUE-83-b · `POST /api/sue/team/leave-requests`

- **Qué hace:** Encargado. Da de alta un registro de licencias (`leaveRequests`).
- **Para qué sirve:** RF-SUE-065: Calendario de licencias autorizadas por equipo y área. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.licencias.autorizar`.
- **Recibe:** los datos de licencias (`leaveRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de licencias (`leaveRequests`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-83-b)

<a id="API-SUE-83-c"></a>
#### API-SUE-83-c · `GET /api/sue/team/novelties`

- **Qué hace:** Encargado. Lista, con filtros y paginación, los registros de novedades (`novelties`).
- **Para qué sirve:** RF-SUE-110: Portal del encargado: equipo, licencias y novedades a aprobar, calendario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.equipo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de novedades (`novelties`) con `total`.
- **Pantallas:** PAN-SUE-44 (Mi equipo).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-83-c)

<a id="API-SUE-83-d"></a>
#### API-SUE-83-d · `POST /api/sue/team/novelties`

- **Qué hace:** Encargado. Da de alta un registro de novedades (`novelties`).
- **Para qué sirve:** RF-SUE-110: Portal del encargado: equipo, licencias y novedades a aprobar, calendario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.licencias.autorizar`.
- **Recibe:** los datos de novedades (`novelties`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de novedades (`novelties`).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2165 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-83-d)

<a id="API-SUE-84"></a>
#### API-SUE-84 · `GET /api/sue/me/reviews`

- **Qué hace:** Evaluaciones propias. Lista, con filtros y paginación, los registros de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.evaluaciones.autoevaluar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de evaluaciones (`performanceReviews`) con `total`.
- **Pantallas:** PAN-SUE-46 (Mis evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2166 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-84)

<a id="API-SUE-84-b"></a>
#### API-SUE-84-b · `POST /api/sue/me/reviews`

- **Qué hace:** Evaluaciones propias. Da de alta un registro de evaluaciones (`performanceReviews`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.evaluaciones.autoevaluar`.
- **Recibe:** los datos de evaluaciones (`performanceReviews`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de evaluaciones (`performanceReviews`).
- **Pantallas:** PAN-SUE-46 (Mis evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2166 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-84-b)

<a id="API-SUE-84-c"></a>
#### API-SUE-84-c · `GET /api/sue/me/objectives`

- **Qué hace:** Evaluaciones propias. Lista, con filtros y paginación, los registros de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.evaluaciones.autoevaluar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de objetivos (`objectives`) con `total`.
- **Pantallas:** PAN-SUE-46 (Mis evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2166 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-84-c)

<a id="API-SUE-84-d"></a>
#### API-SUE-84-d · `POST /api/sue/me/objectives`

- **Qué hace:** Evaluaciones propias. Da de alta un registro de objetivos (`objectives`).
- **Para qué sirve:** RF-SUE-109: Portal: mis datos (lectura), propuesta de cambios, familiares, documentación a subir, certificados y constancias descargables, evaluaciones propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `sue.portal.evaluaciones.autoevaluar`.
- **Recibe:** los datos de objetivos (`objectives`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de objetivos (`objectives`).
- **Pantallas:** PAN-SUE-46 (Mis evaluaciones y objetivos).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2166 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-84-d)

<a id="API-SUE-85"></a>
#### API-SUE-85 · `GET /api/public/{tenantSlug}/sue/verify/{code}`

- **Qué hace:** Verificación de constancia/recibo por código (sin datos sensibles) Obtiene el detalle de un registro de `verify`.
- **Para qué sirve:** RF-SUE-106: Entrega digital con constancia de recepción (fecha, hora, dispositivo, IP, hash), notificación y recordatorios de recibos pendientes de firma (los envía T11 con JOB-WFL-09, según PRM-SUE-024/049). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2167 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-85)

<a id="API-SUE-86"></a>
#### API-SUE-86 · `GET /api/v1/ext/sue/labor-cost`

- **Qué hace:** Costo laboral agregado por centro de costo (sin datos personales) Consulta `labor-cost`.
- **Para qué sirve:** RF-SUE-001: Registro mínimo de relación laboral: persona (M01), empresa empleadora, número de legajo, área, centro de costo, cargo, estado activo/baja, encargado. Utilizable por cuadrillas y órdenes de trabajo antes de la liquidación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `sue.costoLaboral.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M16 §11. API, línea 2168 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-86)

<a id="API-SUE-87"></a>
#### API-SUE-87 · `GET /api/platform/sue/official-tables/{key}`

- **Qué hace:** Tablas oficiales (servicio de T04) Obtiene el detalle de un registro de `official-tables`.
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tablasSueldos.editar`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-47 (Tablas oficiales de sueldos y Ganancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2169 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-87)

<a id="API-SUE-87-c"></a>
#### API-SUE-87-c · `DELETE /api/platform/sue/official-tables/{key}`

- **Qué hace:** Tablas oficiales (servicio de T04) Elimina o da de baja un registro de `official-tables`.
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tablasSueldos.editar`.
- **Recibe:** en la ruta `key`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SUE-47 (Tablas oficiales de sueldos y Ganancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2169 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-87-c)

<a id="API-SUE-87-b"></a>
#### API-SUE-87-b · `PATCH /api/platform/sue/official-tables/{key}`

- **Qué hace:** Tablas oficiales (servicio de T04) Modifica algunos campos de un registro de `official-tables` (solo los enviados).
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tablasSueldos.editar`.
- **Recibe:** en la ruta `key`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-47 (Tablas oficiales de sueldos y Ganancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2169 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-87-b)

<a id="API-SUE-87-d"></a>
#### API-SUE-87-d · `POST /api/platform/sue/official-tables/{key}/publish`

- **Qué hace:** Tablas oficiales (servicio de T04) Publica un registro de `publish`.
- **Para qué sirve:** RF-SUE-122: Certificado de trabajo (art. 80 LCT: tiempo de servicios, naturaleza de tareas, constancia de aportes, calificación profesional) y certificación de servicios y remuneraciones en el formato oficial vigente; emisión al egreso o a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tablasSueldos.editar`.
- **Recibe:** en la ruta `key`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SUE-47 (Tablas oficiales de sueldos y Ganancias).
- **Ola:** O9 · **Fuente:** M16 §11. API, línea 2169 · [Ver en Swagger](../18-swagger/index.html?api=m16-sue#/API/API-SUE-87-d)
