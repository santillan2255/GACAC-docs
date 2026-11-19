# Entregables de Análisis y Diseño Detallado — GoodApps Cooperativas

Índice de artefactos para presentar el proyecto como entregable formal de análisis y diseño. Los documentos de esta carpeta **derivan** de la especificación vigente (`docs/especificacion/`) y no la reemplazan: ante cualquier diferencia prevalece la especificación (maestra `00`, anexos y registro de decisiones `01`).

> **Norma de implementación (impacto stack, DEC-111–113, DEC-110).** El **comportamiento** y los contratos de diseño de este paquete siguen vigentes en GACAC. La **implementación** acordada con GoodApps es **.NET 10**, **Azure SQL** (multitenant `TenantId`), **React 19**, **Microsoft Azure**. Donde los entregables citan Node/Mongo/Vue (DEC-001) es **referencia histórica del análisis Connectia** o texto de casos de prueba a alinear de forma incremental; el modelo físico ejecutable es `docs/especificacion/07-ddl/`. Checklist: `06-impacto-adaptacion-stack-goodapps.md` **C-10**; auditoría: `13-auditoria-impacto-entregables.md`.

Estado de cada artefacto:

- **Existente**: el contenido ya está en la especificación; se referencia.
- **Derivable**: se arma reorganizando contenido existente.
- **Nuevo**: requiere elaboración propia.
- **En esta carpeta**: desarrollado como documento de este entregable.

**Cooperativa piloto:** **Laguna Larga** (`LAG`) (DEC-088, que reemplaza a DEC-081). Opera servicios medidos (electricidad, gas y prepago), por lo que su primera migración real ocurre después de la ola O7 (PA-MIG-17), con el prepago disponible, y el corte avanza por etapas hasta O11 (DEC-068).

Versión del índice: 1.5 (05-11-2026; consolidación de las dos series de entregables: una sola versión por tema, la menos completa movida a `_descartados/` sin borrarla, y alta de los artefactos 4.3, 4.6, 4.7, 5.3, 5.6 y 9.3 como documentos 25–29; antes 1.4, regenerado tras la ronda de residuales y la sincronización de la especificación; antes 1.3, regenerado tras la corrección de inconsistencias; antes 1.2, y antes 1.1 sin la ampliación a cobertura completa ni los documentos 17-24). Cada entregable cierra con su tabla de cobertura contra el universo de la especificación; resumen en la sección "Cobertura de los entregables".

## 1. Documentos de gestión del entregable

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 1.1 | Carátula, control de versiones y aprobaciones | **En esta carpeta** | [`10-caratula-control-versiones.md`](10-caratula-control-versiones.md) |
| 1.2 | Glosario de negocio unificado | **En esta carpeta** | [`11-glosario-negocio.md`](11-glosario-negocio.md) (deriva de maestra §20 y T03) |
| 1.3 | Visión y alcance (resumen ejecutivo) | **En esta carpeta** | [`01-resumen-ejecutivo-vision.md`](01-resumen-ejecutivo-vision.md) |
| 1.4 | Mapa de interesados y matriz RACI | **En esta carpeta** | [`09-riesgos-y-raci.md`](09-riesgos-y-raci.md) |
| 1.5 | Registro de riesgos | **En esta carpeta** | [`09-riesgos-y-raci.md`](09-riesgos-y-raci.md) |
| 1.6 | Registro de supuestos y dependencias externas | **En esta carpeta** | [`12-supuestos-dependencias.md`](12-supuestos-dependencias.md) |
| 1.7 | Plan de validación con el cliente | **En esta carpeta** | [`13-plan-validacion-cliente.md`](13-plan-validacion-cliente.md) |

## 2. Análisis de negocio

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 2.1 | Procesos de negocio BPMN (actual y futuro) | **En esta carpeta** | [`04-procesos-bpmn.md`](04-procesos-bpmn.md) (12 procesos de punta a punta) + mapa [`04a`](04a-procesos-mapa-nivel0.md) y partes `04b`–`04v` (341 procesos) |
| 2.2 | Mapa de capacidades por módulo | **En esta carpeta** | [`14-mapa-capacidades.md`](14-mapa-capacidades.md) |
| 2.3 | Análisis de brechas ProCoop → GoodApps | **En esta carpeta** | [`15-analisis-brechas-procoop.md`](15-analisis-brechas-procoop.md) |
| 2.4 | Catálogo consolidado de reglas de negocio | **En esta carpeta** | [`16-catalogo-reglas-negocio.md`](16-catalogo-reglas-negocio.md) |
| 2.5 | Fichas verticales por servicio | Existente | T12 partes 1 y 2 |

## 3. Requisitos

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 3.1 | Especificación de requisitos de software (SRS) | Existente | Maestra `00` + anexos M01–M19, T01–T12 |
| 3.2 | Catálogo de casos de uso / historias con criterios de aceptación | **En esta carpeta** | [`21-casos-de-uso.md`](21-casos-de-uso.md) (fichas) y CU/ESC de los anexos |
| 3.3 | Diagramas de casos de uso por módulo | **En esta carpeta** | [`21-casos-de-uso.md`](21-casos-de-uso.md) y `21-casos-de-uso/` |
| 3.4 | Requisitos no funcionales | Existente | T08 |
| 3.5 | Matriz de trazabilidad | Existente | `04-matriz-trazabilidad.md` |
| 3.6 | Priorización y MVP por ola | Existente | `03-plan-de-olas-y-prompts.md` |

## 4. Diseño funcional y de experiencia de usuario

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 4.1 | Mapa de navegación y arquitectura de información | **En esta carpeta** | [`22-mapa-navegacion.md`](22-mapa-navegacion.md) y `22-mapa-navegacion/` |
| 4.2 | Wireframes de pantallas clave | **En esta carpeta** | [`05-wireframes-pantallas-piloto.md`](05-wireframes-pantallas-piloto.md) (17 pantallas del piloto + índice), patrones en [`05a`](05a-wireframes-patrones.md) y familias en `05b`–`05h` |
| 4.3 | Prototipo navegable | **En esta carpeta** | [`25-prototipo-navegable.md`](25-prototipo-navegable.md) y [`25-prototipo-navegable/index.html`](25-prototipo-navegable/index.html) (antes: Nuevo, sin documento) |
| 4.4 | Guía de estilo y sistema de diseño | Existente (parcial) | Maestra §11; T03 |
| 4.5 | Catálogo de pantallas y paneles | **En esta carpeta** | [`17-catalogo-pantallas/17-catalogo-pantallas.md`](17-catalogo-pantallas/17-catalogo-pantallas.md) |
| 4.6 | Catálogo de mensajes, textos y plantillas | **En esta carpeta** | [`26-mensajes-y-documentos-impresos.md`](26-mensajes-y-documentos-impresos.md) y [`26a`](26a-catalogo-mensajes-y-plantillas.md) (antes: Derivable, T09; T03) |
| 4.7 | Diseño de reportes y documentos impresos | **En esta carpeta** | [`26-mensajes-y-documentos-impresos.md`](26-mensajes-y-documentos-impresos.md) y [`26b`](26b-documentos-impresos-y-reportes.md) (antes: Derivable, T10; T11) |

## 5. Diseño de arquitectura

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 5.1 | Documento de arquitectura (C4: contexto, contenedores, componentes, despliegue) | **En esta carpeta** | [`02-arquitectura-c4.md`](02-arquitectura-c4.md) |
| 5.2 | Diagrama de contexto del sistema | **En esta carpeta** | Incluido en 5.1 |
| 5.3 | Registro de decisiones de arquitectura (ADR) | **En esta carpeta** | [`27-registro-adr.md`](27-registro-adr.md), derivado de `01-registro-decisiones.md` (antes: Derivable) |
| 5.4 | Diseño de multi-tenancy y aislamiento | Existente (sin diagrama) | T01; T05; resumen en 5.1 |
| 5.5 | Diagrama de despliegue e infraestructura | **En esta carpeta** | Incluido en 5.1 |
| 5.6 | Diseño de seguridad y modelo de amenazas | **En esta carpeta** | [`28-modelo-amenazas-seguridad.md`](28-modelo-amenazas-seguridad.md), derivado de T02 y T08 (antes: Existente parcial) |

## 6. Diseño de datos

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 6.1 | Modelo conceptual entidad-relación por dominio | **En esta carpeta** | [`03-modelo-entidad-relacion.md`](03-modelo-entidad-relacion.md) (índice), vista por dominio `03a`–`03e` y vista completa por módulo en `03-er/` |
| 6.2 | Modelo lógico y físico (colecciones, campos, índices) | Existente | T05; §7 de cada anexo |
| 6.3 | Diccionario de datos | Existente | T05; T03 |
| 6.4 | Ciclo de vida y retención de datos | Existente | T08; DEC-087 |
| 6.5 | Clasificación de datos personales y sensibles | Existente | T08; T05 |

## 7. Diseño de integración y comportamiento

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 7.1 | Contratos de API (OpenAPI) | **En esta carpeta** | [`18-contratos-api.md`](18-contratos-api.md) y `18-openapi/` (OpenAPI 3.1); documentación navegable estilo Swagger en [`18-swagger/index.html`](18-swagger/index.html); para qué sirve cada API y cada endpoint en [`18-catalogo-endpoints.md`](18-catalogo-endpoints.md) |
| 7.2 | Catálogo de eventos (AsyncAPI) | **En esta carpeta** | [`19-catalogo-eventos.md`](19-catalogo-eventos.md) y `19-asyncapi/` (AsyncAPI 3.0) |
| 7.3 | Diagramas de secuencia de flujos críticos | **En esta carpeta** | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md); índice y cobertura en [`06a`](06a-indice-cobertura-secuencias-estados.md); partes `06p`–`06w` (eventos), `06x` (servicios) y `06y`–`06z` (FI-INT) (antes `06o`–`06v`, `06w` y `06x`–`06y`; y antes `06m`–`06v`) |
| 7.4 | Diagramas de estados de entidades clave | **En esta carpeta** | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md); partes `06b`–`06o` (antes `06b`–`06n`, y antes `06b`–`06l`) |
| 7.5 | Fichas de interfaces externas | Existente | T06 (FI-INT); ficha transversal de tokenización y datos de medios de pago en [`30-tokenizacion-medios-de-pago.md`](30-tokenizacion-medios-de-pago.md) (DEC-091) |

## 8. Migración y transición

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 8.1 | Estrategia y plan de migración | Existente | T07 |
| 8.2 | Mapeo origen → destino | Existente | T07; `04-matriz-trazabilidad.md` |
| 8.3 | Plan de puesta en marcha y convivencia | **En esta carpeta** | [`08-plan-puesta-en-marcha.md`](08-plan-puesta-en-marcha.md) |
| 8.4 | Plan de capacitación y gestión del cambio | **En esta carpeta** | [`08-plan-puesta-en-marcha.md`](08-plan-puesta-en-marcha.md) |

## 9. Calidad y aceptación

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 9.1 | Estrategia de pruebas | **En esta carpeta** | [`07-estrategia-pruebas.md`](07-estrategia-pruebas.md) |
| 9.2 | Casos de prueba de aceptación | **En esta carpeta** | [`20-casos-prueba.md`](20-casos-prueba.md) y `20-casos-prueba/` |
| 9.3 | Criterios de aceptación por ola | **En esta carpeta** | [`29-criterios-y-casos-aceptacion-por-ola.md`](29-criterios-y-casos-aceptacion-por-ola.md) (criterios de salida por ola y casos de aceptación de negocio, `29a`–`29d`); complementa a 9.2 (antes: Existente parcial, `03-plan-de-olas-y-prompts.md`) |
| 9.4 | Plan de pruebas de rendimiento y seguridad | **En esta carpeta** | [`07-estrategia-pruebas.md`](07-estrategia-pruebas.md) |

## 10. Estimación y planificación

| N.º | Artefacto | Estado | Fuente / ubicación |
|---|---|---|---|
| 10.1 | Estimación de esfuerzo por ola | **En esta carpeta** | [`23-estimacion-esfuerzo.md`](23-estimacion-esfuerzo.md) |
| 10.2 | Hoja de ruta visual O0–O11 | **En esta carpeta** | Gantt en [`23-estimacion-esfuerzo.md`](23-estimacion-esfuerzo.md); resumen en 1.3 |
| 10.3 | Modelo de costos de operación | **En esta carpeta** | [`24-modelo-costos-operacion.md`](24-modelo-costos-operacion.md) (precios "a cotizar") |

## Documentos de esta carpeta

| Archivo | Contenido | Estado |
|---|---|---|
| `00-INDICE.md` | Este índice | v1.5 (antes v1.4, y antes v1.2) |
| `01-resumen-ejecutivo-vision.md` | Resumen ejecutivo, visión, alcance, beneficios, riesgos y hoja de ruta (artefacto 1.3) | v1.0 (8 objetivos de impacto "a definir") |
| `02-arquitectura-c4.md` | Documento de arquitectura con vistas C4, contexto y despliegue (artefactos 5.1, 5.2, 5.5) | v1.0 (9 diagramas; 10 inconsistencias entre anexos como deuda técnica) |
| `03-modelo-entidad-relacion.md` | Modelo entidad-relación: índice de las dos vistas y cobertura (artefacto 6.1) | v2.0 (antes v1.0) |
| `03-er/` | ER por módulo dueño: 30 archivos, 61 diagramas, las 1.057 colecciones a crear con campos y relaciones (antes 29, 60 y 1.053) | v2.1 |
| `03a-er-plataforma-personas-catalogo.md` | ER parte A: plataforma, personas y catálogo | v1.0 |
| `03b-er-medicion-tarifas-facturacion.md` | ER parte B: medición, tarifas y facturación | v1.0 |
| `03c-er-cobranza-mora-crm-tecnica.md` | ER parte C: cobranza, mora, CRM y técnica | v1.0 |
| `03d-er-erp-administrativo.md` | ER parte D: ERP administrativo | v1.0 |
| `03e-er-institucional-social-portal-transversales.md` | ER parte E: institucional, social, portal y transversales | v1.0 |
| `04-procesos-bpmn.md` | Procesos de negocio clave de punta a punta, situación actual y futura (artefacto 2.1) | v1.2 (antes v1.0) |
| `04a-procesos-mapa-nivel0.md` | Mapa de procesos nivel 0 (20 macroprocesos) y nivel 1, inventario de los 341 procesos y exclusiones | v1.0 |
| `04b-` a `04v-` | Procesos por dominio: 94 P-xxx y 247 PRC-xxx con carriles, pasos, eventos y excepciones | v1.0 |
| `05-wireframes-pantallas-piloto.md` | Wireframes de las pantallas del piloto e índice del artefacto 4.2 | v1.2 (17 pantallas; antes v1.1) |
| `05a-wireframes-patrones.md` | 12 patrones de UI con wireframe, reglas de layout y componentes | v1.0 |
| `05b-` a `05h-` | Wireframes por familia de pantallas (204 familias; antes 202) | v1.1 |
| `06-secuencias-y-estados.md` | Diagramas de secuencia de flujos críticos y de estados de entidades clave (artefactos 7.3, 7.4) | v1.1 (antes v1.0) |
| `06a-indice-cobertura-secuencias-estados.md` | Índice, cobertura e inconsistencias de estados y secuencias | v1.0 |
| `06b-` a `06o-` | Diagramas de estados por módulo (615 colecciones; antes `06b-` a `06n-` con 582, y antes `06b-` a `06l-` con 463) | v1.2 |
| `06p-` a `06z-` | Secuencias por eventos (115 flujos, `06p`-`06w`), servicios internos (`06x`) e integraciones FI-INT (`06y`-`06z`) (antes `06o-` a `06y-`, y antes `06m-` a `06v-` con 110 flujos) | v1.2 |
| `07-estrategia-pruebas.md` | Estrategia de pruebas y criterios de aceptación (artefactos 9.1, 9.4) | v1.0 |
| `08-plan-puesta-en-marcha.md` | Plan de puesta en marcha, convivencia con ProCoop y capacitación (artefactos 8.3, 8.4) | v1.0 |
| `09-riesgos-y-raci.md` | Registro de riesgos, mapa de interesados y matriz RACI (artefactos 1.4, 1.5) | v1.0 |
| `10-caratula-control-versiones.md` | Carátula, control de versiones y aprobaciones (artefacto 1.1) | v1.0 |
| `11-glosario-negocio.md` | Glosario de negocio unificado (artefacto 1.2) | v1.0 |
| `12-supuestos-dependencias.md` | Supuestos y dependencias externas (artefacto 1.6) | v1.0 |
| `13-plan-validacion-cliente.md` | Plan de validación con el cliente (artefacto 1.7) | v1.0 |
| `14-mapa-capacidades.md` | Mapa de capacidades por módulo (artefacto 2.2) | v1.0 |
| `15-analisis-brechas-procoop.md` | Análisis de brechas ProCoop → GoodApps (artefacto 2.3) | v1.0 |
| `16-catalogo-reglas-negocio.md` | Catálogo consolidado de reglas de negocio (artefacto 2.4) | v1.0 |
| `17-catalogo-pantallas/` | Catálogo de las 1.051 pantallas (antes 1.047) con ruta, capability, patrón, familia, campos, acciones, RF y ola (artefacto 4.5) | v1.0 |
| `18-contratos-api.md` y `18-openapi/` | Contratos OpenAPI 3.1 por módulo, API externa T10 y contratos internos (artefacto 7.1) | v1.1 (antes v1.0, sin visor Swagger) |
| `18-swagger/` | Documentación navegable estilo Swagger (Swagger UI, sin servidor): 30 contratos consolidados y uno completo con las 4.193 operaciones (antes 4.189), cada una con su ficha de propósito (artefacto 7.1) | v1.1 (antes v1.0, sin ficha de propósito) |
| `18-catalogo-endpoints.md` y `18-catalogo-endpoints/` | Catálogo legible de la API: para qué sirve cada una de las 30 APIs y, por cada uno de los 4.193 endpoints, qué hace, para qué sirve, quién lo usa, qué recibe, qué devuelve y qué pantallas lo usan (artefacto 7.1) | v1.0 |
| `19-catalogo-eventos.md` y `19-asyncapi/` | Catálogo AsyncAPI 3.0 por productor, sobre del outbox y jobs por cola (artefacto 7.2) | v1.0 |
| `20-casos-prueba.md` y `20-casos-prueba/` | 5.710 casos de prueba de aceptación (antes 5.709), suites por ola y suite de la piloto (artefacto 9.2) | v1.0 |
| `21-casos-de-uso.md` y `21-casos-de-uso/` | Diagramas y fichas de casos de uso por módulo (artefactos 3.2, 3.3) | v1.0 |
| `22-mapa-navegacion.md` y `22-mapa-navegacion/` | Mapa de navegación por portal (artefacto 4.1) | v1.0 |
| `23-estimacion-esfuerzo.md` | Estimación PERT por prompt y ola y hoja de ruta (artefactos 10.1, 10.2) | v1.0 (parámetros de equipo ajustables) |
| `24-modelo-costos-operacion.md` | Modelo de costos de operación por cooperativa, tres escenarios (artefacto 10.3) | v1.0 (precios "a cotizar") |
| `25-prototipo-navegable.md` y `25-prototipo-navegable/` | Prototipo HTML estático sin servidor: 7 recorridos del piloto y 38 rutas, datos ficticios (artefacto 4.3) | v1.0 (antes `19-prototipo-navegable`) |
| `26-mensajes-y-documentos-impresos.md`, `26a-` y `26b-` | 152 mensajes de sistema, 225 plantillas de notificación, 19 documentos impresos y 56 reportes (artefactos 4.6, 4.7) | v1.0 (antes `20-`, `20a-` y `20b-`) |
| `27-registro-adr.md` | 55 ADR derivados del registro de decisiones (artefacto 5.3) | v1.0 (antes `21-registro-adr.md`) |
| `28-modelo-amenazas-seguridad.md` | Modelo de amenazas STRIDE con 80 amenazas, controles y riesgo residual (artefacto 5.6) | v1.0 (antes `22-modelo-amenazas-seguridad.md`) |
| `29-criterios-y-casos-aceptacion-por-ola.md` y `29a-` a `29d-` | Criterios de salida por ola O0–O11, 196 casos de aceptación de negocio y suite de paralelo de LAG (artefacto 9.3) | v1.0 (antes `25-` a `25d-`) |
| `30-tokenizacion-medios-de-pago.md` | Tokenización de tarjetas y protección del CBU: qué se guarda, flujo por proveedor, 4 diagramas de secuencia (adhesión, cobro mensual, alta por operador, migración), controles y pendientes de construcción (complemento de 7.3 y 7.5; DEC-091) | v1.0 |
| `_descartados/` | Versiones duplicadas y menos completas, conservadas sin borrar: casos de uso `17*` (reemplazado por `21`), navegación y pantallas `18-navegacion*` (por `22` y `17-catalogo-pantallas`), OpenAPI `23-*` (por `18`), AsyncAPI `24-*` (por `19`) y estimación `26-estimacion-hoja-ruta-costos.md` (por `23` y `24`) | No vigentes |

Los documentos 25–29 se generaron antes de la sincronización de residuales de la especificación del 05-11-2026; sus identificadores (CU, RF, PAN, EVT) se verificaron contra la serie vigente.

**Regenerados tras DEC-089 (05-11-2026):** `20-casos-prueba` y `23-estimacion-esfuerzo` con sus generadores (el de `23` excluye los prompts marcados como reemplazados), y `29` a `29d` ajustados a mano. Antes figuraban como "Pendiente de regenerar": el plan `03` §21.7 pasó 24 RF de migración, paralelo y corte comercial de O11 a O7 (O7 queda con 12 prompts, 298 RF y 1 RNF; O11 con 8 prompts, 65 RF y 6 RNF; PRO-O7-11 y PRO-O7-12 reemplazan a PRO-O11-07 y PRO-O11-08). Los entregables que agrupan por ola o por prompt (`20-casos-prueba`, `23-estimacion-esfuerzo`, `29c` y `29d`) ya muestran la asignación nueva (antes: "todavía muestran la asignación anterior").

## Cobertura de los entregables

| Entregable | Universo en la especificación | Cubierto | Pendiente de confirmar |
|---|---|---|---|
| 6.1 Modelo ER | 1.057 colecciones a crear (T05; antes 1.053) | 1.057 (100 %); 51 absorbidas listadas con destino | 142 relaciones inferidas por nombre (antes 205, y antes 549); 75 referencias sin destino declarado (antes 211, y antes 437); 106 referencias polimórficas como nota, no como FK |
| 2.1 Procesos | 341 procesos (§9 de 28 anexos; 32 subsecciones excluidas con motivo) | 341 (100 %) | 247 PRC derivados automáticamente y revisados por muestra |
| 4.5 Catálogo de pantallas | 1.051 PAN (antes 1.047) | 1.051 (100 %) | Vínculo PAN–RF inferido en parte (detalle en `17`; antes 708) |
| 4.2 Wireframes | 204 familias y 12 patrones (antes 202) | 204 y 12 (100 %) | Campos detallados solo en 338 PAN de los anexos |
| 7.4 Estados | 631 colecciones con estado (antes 625, y antes 573) | 615 diagramadas; 16 excluidas con motivo (antes 582 y 43, y antes 463 y 110) | Transiciones con evento inferido y 25 máquinas sin estado inicial declarado (antes 205) (detalle en `06a` §7) |
| 7.3 Secuencias | 653 eventos con consumidor externo, 115 FI-INT, 53 servicios (antes 643 y 55, y antes 618 y 49) | 100 % en 115 flujos (antes 110) | — |
| 7.1 OpenAPI | 2.223 filas API (4.193 operaciones; antes 4.189, y antes 4.227, sin filas reemplazadas ni referencias duplicadas) | 100 % | Vínculo operación–RF en 89,9 % de las operaciones, casi siempre inferido (antes 89,5 %, y antes 86,2 %) |
| 7.2 AsyncAPI | 668 eventos (antes 658), 506 jobs; 279 alias como canales deprecados | 100 % | Tipos de payload inferidos por nombre |
| 9.2 Casos de prueba | 4.204 RF, 763 escenarios (715 ESC + 48 de M06), 471 CU (antes 467, y antes 4.203, 715 y 464) | 100 % | RF sin criterio de aceptación: ver `20` (antes 150; M04, M14, M16 y M18 completados) |
| 3.3 Casos de uso | 4.204 RF; 471 CU (antes 467, y antes 4.203) | 100 % | — (antes: 4 CU con el mismo ID en dos anexos; renumerados como CU-TES-17, CU-PLA-15, CU-IAM-11 y CU-UXD-07) |
| 4.1 Navegación | 1.051 PAN, 558 ítems de menú (antes 1.047 y 549) | 100 % | 2 ítems sin pantalla principal (antes 10): PAN-COM-16 sin ítem y SM-PWS-028 sin PAN principal |
| 10.1 Estimación | 172 prompts | 100 % | Velocidad del equipo como supuesto |

Las inconsistencias de la especificación detectadas al ampliar los entregables están consolidadas en `_trabajo/inconsistencias-especificacion.md` y en la sección de inconsistencias de cada entregable. El 05-11-2026 se corrigieron en `docs/especificacion/` (antes: "no se corrigieron") y los entregables se regeneraron; los residuales detectados al regenerar se corrigieron y sincronizaron entre anexos el mismo día (`docs/especificacion/_trabajo/residuales-sincronizacion.md`; antes: "los residuales que quedan están en `docs/especificacion/_trabajo/correccion-inconsistencias-pendientes-cierre.md`") y los entregables se regeneraron otra vez con generadores que ignoran las notas "antes", respetan "no es referencia" y las referencias polimórficas, y leen T08 §15.
