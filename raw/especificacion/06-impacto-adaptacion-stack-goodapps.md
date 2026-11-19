# 06 — Directivas, decisiones e impacto (GoodApps stack + adaptación CoopApps)

**Documento único de trabajo:** directivas del equipo, decisiones cerradas, alineación con el acuerdo GoodApps (`analisis-funcional-y-stack.pdf`), matriz de impacto, checklist documental (§12) y registro de seguimiento. Redacción afirmativa en export (**DIR-13**). Cada cierre debe terminar en **DEC** en `01-registro-decisiones.md` y, si corresponde, **PA-STACK-*** en `02-preguntas-abiertas.md`.

| Campo | Valor |
|---|---|
| Versión | 2.12 |
| Fecha | 19-11-2026 |
| Fuentes | PDF GoodApps (6 páginas); informe naming CoopApps; especificación `00`–`05` y anexos |
| Respaldo | `OLD/2026-11-19-pre-naming-coopapps/` (especificación + presentación) |

---

## Resumen ejecutivo — modelo de datos e implementación

> **Lectura obligatoria** antes de anexos: la implementación con GoodApps usa **Azure SQL relacional**, **EF Core** y **.NET 10** (DEC-111). El detalle físico vive en **`07-modelo-relacional-azure-sql.md`**.

| Aspecto | Norma vigente | DEC | Siguiente paso en docs |
|---|---|---|---|
| **Paradigma** | **Azure SQL**; **EF Core**; tablas con **PK, FK y constraints**; historial temporal donde aplique | DEC-111 | Alinear anexos hacia `07-*` |
| **Modelo físico** | **ER completo** en documento aparte **`07-modelo-relacional-azure-sql.md`**: entidades por módulo, **4FN** donde corresponda, integridad referencial explícita | DEC-117 | Completar tablas por módulo (v0.1 creado) |
| **Multitenancy** | **Base compartida** con **`TenantId`**; catálogo en **T01**; subdominio por cooperativa | DEC-110 | T01, T07 migración |
| **Aislamiento** | Lógico por tenant + roles plataforma; sin cruces de negocio entre cooperativas en sesión de tenant | DEC-110, DEC-116 | — |
| **Acceso entre módulos** | Monolito modular: dueño de esquema; APIs y eventos entre módulos | DEC-111, DEC-003 | `07-*` |
| **Semántica funcional** | RF/RN/CU vigentes; trazado físico añadido sin cambiar comportamiento | DEC-117, DIR-05 | §5 anexos |

**Regla de lectura (DIR-13):** en export y presentación, describir solo esta norma; «colección» en anexos = entidad lógica hasta la fila en `07-*`.

---

## Resumen ejecutivo — alcance funcional (no se toca)

> El PDF GoodApps y las DEC de stack **no reabren** el acuerdo de negocio. La adaptación es **técnica y de forma de entrega**, salvo una **DEC nueva** explícita.

### Qué permanece vigente sin reescribir por el cambio de stack

| Capa | Contenido | IDs / ubicación |
|---|---|---|
| **Alcance de módulos** | M01–M19, T01–T12 (incl. T04b), mapa de soluciones, olas de *contenido* (qué entra en cada módulo) | `00` §4, anexos |
| **Requisitos** | RF-*, RNF-* (salvo los que citan stack y se actualicen por DEC-111+) | Secciones §5 de anexos |
| **Reglas de negocio** | RN-*, DEC-011–DEC-108, parámetros `PRM-*`, comportamientos ProCoop→CoopApps | Anexos, `01` |
| **Casos de uso y pruebas** | CU-*, CPA-*, escenarios, criterios de aceptación | Anexos, entregables casos |
| **Pantallas y flujos** | Mapa del sitio (T03 §10.8), capacidades, equivalencias menú ProCoop | T03, `17-*` entregables |
| **Migración funcional** | Qué se migra, mapeos ProCoop, conciliación, cortes, reglas RN-MIG | **T07** (reglas; no el motor SQL literal hasta `07`) |
| **Trazabilidad** | Matriz `04`, decisiones `01`, huecos `05` | Sin borrado masivo |
| **Cobertura ProCoop** | «Todo lo que hace ProCoop está en alcance» (DEC-007, DEC-009) | Intocable salvo DEC nueva |

### Qué sí se adapta (sin cambiar el qué hace el sistema)

| Capa | Tipo de cambio |
|---|---|
| Nombres de marca | CoopApps (DEC-109) |
| Stack, nube, UI toolkit | .NET, Azure SQL, React (DEC-111–113) |
| Forma física de datos | Colección → tabla; `07-*`; modelo conceptual por módulo (DEC-117) |
| Endpoints vs casos de uso | Redacción de *operaciones* para GoodApps; **misma semántica** que RF/API existentes (OpenAPI sigue referencia de diseño en GACAC, D-06) |
| Glosario código | Tabla de equivalencias Party/Tenant (§9); **no** renombrar reglas de negocio en español |
| Plan Cursor / olas de construcción | `03` archivado (DEC-118); **no** elimina requisitos de los anexos |
| Formato de exportación a coodo | Markdown por módulo, PR |

### Qué **no** cuenta como «cambio funcional» permitido por este documento

- Eliminar o acotar módulos, RF o RN «porque el stack cambió».
- Sustituir reglas de facturación, cobranza, migración o permisos por equivalentes más simples sin DEC.
- Reinterpretar DEC cerradas (DEC-001–108) sin nueva DEC que diga *Reemplaza DEC-xxx*.

**Directiva rectora:** **DIR-05** + **DIR-11** (abajo). Si GoodApps pide un cambio de comportamiento, entra por `02-preguntas-abiertas.md` → DEC, no por refactor de stack.

---

## Índice

1. [Directivas vigentes](#1-directivas-vigentes)  
2. [Decisiones ya cerradas](#2-decisiones-ya-cerradas)  
3. [Cuestionario de decisiones (D-01 a D-12)](#3-cuestionario-de-decisiones-d-01-a-d-12)  
4. [Acuerdos con GoodApps](#4-acuerdos-con-goodapps)  
5. [Stack y plataforma adoptados (alineación GoodApps)](#5-stack-y-plataforma-adoptados-alineación-goodapps)  
6. [Qué del PDF adoptamos sin choque](#6-qué-del-pdf-adoptamos-sin-choque)  
6.1. [IA, ayuda compilada y mejor uso del sistema](#61-ia-ayuda-compilada-y-mejor-uso-del-sistema-reunión)  
6.2. [FAQ y cobertura de ayuda en todo el sistema](#62-faq-y-cobertura-de-ayuda-en-todo-el-sistema)  
7. [Matriz de impacto por artefacto](#7-matriz-de-impacto-por-artefacto)  
8. [Plan de trabajo por fases](#8-plan-de-trabajo-por-fases)  
9. [Glosario código ↔ especificación](#9-glosario-código--especificación)  
10. [Registro de respuestas (completar tras el cuestionario)](#10-registro-de-respuestas)  
11. [Bitácora del documento](#11-bitácora-del-documento)  
12. [Checklist de alineación documental](#12-checklist-de-alineación-documental)  
13. [Auditoría automatizada](#13-auditoría-automatizada) → `13-auditoria-impacto-stack.md`

---

## 1. Directivas vigentes

Reglas de trabajo mientras adaptamos el análisis. No reemplazan una DEC salvo que se indique.

| ID | Directiva | Estado |
|---|---|---|
| **DIR-01** | La marca del producto en toda la especificación canónica es **CoopApps**; **GoodApps** solo como empresa (legal, consola de plataforma, contratos, PCI, encargo Ley 25.326). | Vigente (ver DEC-109) |
| **DIR-02** | Antes de cambios masivos en documentación, copiar la versión actual a **`OLD/<fecha>-<motivo>/`** (como `2026-11-19-pre-naming-coopapps`). | Vigente |
| **DIR-03** | Nada del PDF GoodApps se considera adoptado en la spec hasta quedar en **DEC** o marcado explícito en este `06`. | Vigente |
| **DIR-04** | **Azure SQL** compartido con aislamiento por **`TenantId`** (DEC-110); resolución de cooperativa por **subdominio**. Catálogo de tenants en **T01** en el mismo almacén. | Vigente |
| **DIR-10** | Nuevas piezas de diseño físico se documentan como **tablas/esquema SQL** en `07-*` o modelo conceptual alineado a EF Core (DEC-111, DEC-117). | Vigente |
| **DIR-13** | En documentación de export y presentación: **redacción afirmativa** solo de la norma vigente (DEC-110–119); sin listar alternativas descartadas ni contradicciones con stacks anteriores. Histórico en `OLD/` y bitácora DEC. | Vigente |
| **DIR-05** | **No se toca el funcional:** alcance, RF, RN, DEC de negocio (011–108), pantallas, casos de prueba, reglas de migración y cobertura ProCoop permanecen **salvo DEC nueva**. Solo se adapta capa técnica, marca, modelo físico SQL y formato de entrega. Ver [Resumen funcional](#resumen-ejecutivo--alcance-funcional-no-se-toca). | Vigente |
| **DIR-11** | Cualquier cambio de **comportamiento** pedido por GoodApps (stack o no) exige **PA + DEC**; el documento `06` **no** autoriza recortes funcionales. | Vigente |
| **DIR-12** | Llevar en la adaptación GoodApps los **puntos de ayuda compilados**, el **mapa FAQ vs ScreenHelp** ([§6.2](#62-faq-y-cobertura-de-ayuda-en-todo-el-sistema)) y la **IA de uso** (ScreenHelp, diccionario, M19/M09 FAQ, asistente): mejora adopción; ver [§6.1](#61-ia-ayuda-compilada-y-mejor-uso-del-sistema-reunión). | Vigente |
| **DIR-06** | GACAC (`docs/especificacion/`) sigue siendo **archivo maestro** hasta acordar export por módulo al repo GoodApps (`coodo`). | Vigente |
| **DIR-07** | Construcción y export: **pipeline GoodApps** (DEC-118). `03-plan-de-olas-y-prompts.md` = mapa de **contenido** por olas. | Vigente |
| **DIR-08** | Entregables `entregables-analisis-diseno/` no se reescriben en bloque hasta cerrar decisión sobre rol de **OpenAPI** (conflicto C5). | Vigente |
| **DIR-09** | Las respuestas del cuestionario interactivo de este documento se vuelcan a §10 y disparan DEC/PA correspondientes. | Vigente |

---

## 2. Decisiones ya cerradas

| ID | Fecha | Tema | Resumen | Dónde vive |
|---|---|---|---|---|
| **DEC-109** | 19-11-2026 | Marca CoopApps | Producto CoopApps; GoodApps empresa | `01`, T03 |
| **DEC-110** | 19-11-2026 | Multitenant compartido | Azure SQL + `TenantId` + subdominio | `01`, `00` §6, `07` |
| **DEC-111** | 19-11-2026 | Stack .NET + Azure SQL + React | Norma de §5 maestro | `01`, `00` §5, T01 banner |
| **DEC-112** | 19-11-2026 | Solo Azure | Nube de referencia | `01`, T01/T08 |
| **DEC-113** | 19-11-2026 | Front React 19 | T03 a reescribir hacia stack GoodApps | `01`, T03 |
| **DEC-116** | 19-11-2026 | BI cross-tenant | Solo rol plataforma | `01`, T10 |
| **DEC-117** | 19-11-2026 | ER relacional aparte | 4NF, PK/FK, `07-modelo-relacional-azure-sql.md` | `01`, T05, `07` v0.1 |
| **DEC-114** | 19-11-2026 | Mantener T04 + T04b | Motor central; parámetros en §14 de cada Mxx | `01`, T04 |
| **DEC-118** | 19-11-2026 | Pipeline GoodApps | Export por módulo; `03` = mapa de olas | `01`, `03`, `00` §16 |

---

## 3. Cuestionario de decisiones (D-01 a D-12)

Todas las **D-xx están cerradas** salvo seguimiento operativo (crear `07-*`, reescribir T03, PA-STACK-02). Detalle en [§10](#10-registro-de-respuestas).

| ID | Estado | Resultado |
|---|---|---|
| D-01 … D-04, D-06, D-08–D-12 | Cerrada | Ver §10 |
| D-05 | Cerrada | Mantener T04 → **DEC-114** |
| D-07 | Cerrada | Solo GoodApps → **DEC-118** |

#### Nota D-02

Stack **.NET + Azure SQL + React** en spec; ER físico (**DEC-117**); multitenant compartido (**DEC-110**).

---

## 4. Acuerdos con GoodApps

### 4.1 Contexto para D-05 — ¿Qué es T04 hoy?

**T04 CFG** no es solo «un montón de parámetros sueltos». Hoy hace tres cosas en la spec:

1. **Motor de configuración versionada** (borrador → publicado, auditoría, vigencias) para cualquier parámetro tipado del tenant.  
2. **Catálogo y mapeo** de los **1.536 parámetros ProCoop** (`T04b`, fila por fila, destino `PRM-*`).  
3. **Maestros transversales** (geografía, calles, índices económicos, etc.) que muchos módulos consumen.

El PDF GoodApps dice: *«No hay un módulo de configuración global. Cada parámetro de T04 va al módulo que lo usa.»*  
Eso **no obliga** a borrar el motor: puede significar solo **reubicar la definición** de cada parámetro en M05, M07, etc., dejando T04 como **infraestructura de publicación** (como hoy RF-CFG).

**La decisión D-05 es:** ¿conservamos T04 como motor + catálogo central, repartimos todo a módulos, o un híbrido por fases?

### 4.2 Contexto para D-07 — ¿Qué es el plan `03` hoy?

**`03-plan-de-olas-y-prompts.md`** mapea el **contenido** por olas O0–O11 (DEC-118). La **entrega** sigue el pipeline GoodApps acordado (tareas, agentes, PR).

### 4.3 Modelo de plataforma (texto para minuta)

> CoopApps opera en **Azure** con **Azure SQL** compartido, aislamiento por **`TenantId`**, resolución por **subdominio** y catálogo de cooperativas en **T01** en el mismo almacén. La configuración versionada central (**T04** + **T04b**) conserva el catálogo ProCoop y el motor de publicación (**DEC-114**).

---

## 5. Stack y plataforma adoptados (alineación GoodApps)

| Tema | Norma en GACAC / export | DEC |
|---|---|---|
| Backend | .NET 10, ASP.NET Core, EF Core | DEC-111 |
| Datos | Azure SQL, esquema por módulo, `07-*` | DEC-111, DEC-117, DEC-110 |
| Front | React 19, Vite, shadcn/Radix, T03 comportamiento | DEC-113 |
| Nube | Microsoft Azure (Container Apps, Blob, Queue, Key Vault, Insights) | DEC-112 |
| Identidad | OpenIddict (detalle T02; PA-STACK-02 canales 2FA) | DEC-111 |
| Configuración | T04 motor + T04b catálogo central | DEC-114 |
| API | OpenAPI en código + contratos de diseño en GACAC | D-06 |
| BI cross-coop | Solo rol plataforma | DEC-116 |
| Entrega | Pipeline GoodApps; GACAC maestro funcional | DEC-118 |
| Ayuda / IA | ScreenHelp, FAQ M19/M09, inventario §6.1–6.2 | DIR-12 |

---

## 6. Qué del PDF adoptamos sin choque

| Tema | Encaje | Esfuerzo |
|---|---|---|
| Módulos, RF, pantallas, casos, preguntas | Ya en anexos | Bajo |
| Monolito modular + dueño de datos + eventos | DEC-003, T05 | Bajo |
| Casos de uso operativos (no solo endpoints) | Parcial | Medio / módulo |
| Reglas §04 PDF (dinero, fechas, fallas, masivos, integraciones) | Mayoría escrita | Medio |
| Roles sugeridos + `modulo.recurso.accion` | T02 | Bajo–medio |
| Migración ProCoop | T07 | Bajo |
| CoopApps | DEC-109 | Hecho |
| Markdown por módulo, PR, sin PII | Proceso export | Medio |
| IA y ayuda para mejor uso (reunión) | T03, M09, P6; export §6.1 | Medio en empaquetado, no en RF |

---

## 6.1 IA, ayuda compilada y mejor uso del sistema (reunión)

Pedido de la reunión (parafraseado): **llevar de ProCoop lo compilado / sistematizado (ayuda + IA) para mejorar el uso del sistema** en la entrega del análisis a GoodApps.

| Idea de la reunión | En la spec actual | ¿Se toca el funcional? | Adaptación |
|---|---|---|---|
| **Ayuda por pantalla** (qué / quién / cuándo / dónde / por qué / cómo + CU) | **T03** `ScreenHelp`, RF-UXD-049/131/155; `screenId` por PAN-* | **No** | En export: artículos base + enlace a CU; textos ProCoop → `dict:` / T07 |
| **Textos compilados** (diccionario por tenant/canal) | **T03** paquetes publicados (JOB-UXD-02/03), RF-UXD-169 | **No** | Export: claves por app; i18n React (DEC-113) |
| **Asistente IA de uso** (guía, consultas; no ejecutar solo) | **P6**; **M09** bot + IA supervisada; M12/T09; S-BOT; `aiUsage` (T01) | **No** | Casos de uso: qué **propone** IA vs qué **confirma** la persona + auditoría |
| **Más IA que la spec** | Solo vía nueva DEC | — | **PA-STACK-07** si la reunión pedía ampliar alcance |

**Impacto:** capa de **entrega y empaquetado** (fase **3b** del plan), no reescritura de RN/RF. Inventario «pantalla → ayuda → CU → ¿IA?» junto con **M01 + T02**: ver `_trabajo/inventario-screenhelp-m01-t02.md` (60 `screenId`, generado 19-11-2026).

---

## 6.2 FAQ y cobertura de ayuda en todo el sistema

**Necesidad (reunión / stakeholders):** que el análisis a GoodApps deje claro **cómo se cubre la ayuda al usuario** en todo CoopApps — incluido lo que en ProCoop estaba **compilado** — y que no se asuma un único «módulo FAQ del ERP» que hoy **no** está en la spec.

### Cómo está modelado hoy (sin cambiar RF)

| Audiencia / canal | Mecanismo | Dónde en spec | ¿Es FAQ clásica? |
|---|---|---|---|
| **Backoffice y operación** (casi todas las PAN-* admin) | **`ScreenHelp`** (`?`): qué / quién / cuándo / dónde / por qué / cómo + enlace a CU; base producto + override tenant | **T03** RF-UXD-049/131/155; `screenHelpArticles`; PAN-UXD-06 (`Ayuda/FAQ` = **contextual**, no listado global) | **No** — ayuda **por pantalla**, cobertura «de todo el sistema» vía **un artículo por `screenId`** |
| **Socio / público** | Bloque **`faq`**, `/ayuda`, FAQ en ficha de servicio | **M19** RF-POR-002/005; PAN-POR-01/03/15/65 | **Sí** — preguntas por tema del tenant |
| **Autogestión conversacional** | Intención **`faq`** + lista Q&A (`answerKey`) | **M09** RF-CRM-174; PAN-CRM-17 | **Sí** — alimenta bot / WhatsApp |

**Conclusión para el impacto:** la cobertura «en todo el sistema» del **admin** se cumple con **ScreenHelp en cada pantalla** del mapa del sitio (T03 §10.8), no con una sección FAQ única. La **FAQ explícita** vive en **portal/PWA (M19)** y **bot (M09)**. El export a GoodApps debe **nombrar las tres capas** para evitar que implementación busque un solo CMS FAQ inexistente.

Referencias de desarrollo: `GUIA-UI-UX-DESARROLLO.md` (tabla ayuda/FAQ).

### Qué hacemos en la adaptación (tener en cuenta)

| Acción | Entregable | ¿Nuevo RF? |
|---|---|---|
| Matriz **cobertura**: cada `PAN-*` → ¿tiene `screenId` + borrador ScreenHelp? | Anexo al export o hoja en fase **3b** | No |
| Cruce **FAQ M19** / **bot M09** con mismas claves `dict:` donde el tema sea común | Paquete diccionario + T07 textos migrados | No |
| Si GoodApps pide **FAQ global admin** además de ScreenHelp | **PA-STACK-07** → DEC antes de diseñar | Sí (solo si se aprueba) |

**Criterio DIR-12:** documentar la necesidad y el mapa anterior en el paquete de análisis; **no** reinterpretar «FAQ en todo el sistema» como recorte de ScreenHelp ni como omisión de M19/M09.

---

## 7. Matriz de impacto por artefacto

Estado: `Pendiente` | `En curso` | `Hecho` | `No aplica`.

| Artefacto | Depende de | Acción | Estado |
|---|---|---|---|
| `00-ESPECIFICACION-MAESTRA.md` | D-02, D-03, D-04, DIR-04 | §5 Azure/React/.NET; §16 GoodApps; enlace `06` | Hecho (19-11) |
| `01-registro-decisiones.md` | D-01, D-02… | DEC-110–119 redacción afirmativa | Hecho (19-11) |
| `02-preguntas-abiertas.md` | D-02, D-08 | Bloque PA-STACK-* | Parcial |
| `03-plan-de-olas-y-prompts.md` | DEC-118 | Banner histórico + mapa olas | Hecho (19-11) |
| `07-modelo-relacional-azure-sql.md` + `07-catalogo-tablas-sql.md` + `07-ddl/` | DEC-117 | Capa B §2.0–2.5 (núcleo transversal + `uxd`) ~165 tablas | **Capa C hecha**; B incremental por olas |
| `T05-DAT` | D-02, D-11 | §6.1 + §7.0 → `07-*`; catálogo 1.058 | **Parcial hecho** (§7.1 cuerpo histórico) |
| `T04` / `T04b` | D-05, DEC-114 | §7.0 + capa B `07` §2.3; T04b catálogo sin mover | **Parcial hecho** (cuerpo §7 incremental) |
| `T01` | DIR-04, D-03 | §7.0 + §7.11→`pla` §2.0; §7.1–7.10 histórico | **Parcial hecho** |
| `T02` | D-08, D-11 | §7.0 OpenIddict + `iam.*`; CTR-IAM-02; PA-STACK-02 pendiente | **Parcial hecho** |
| `T03` | D-04, DEC-109 | §7.B.0 + capa B `07` §2.5; tokens en código | **Parcial hecho** |
| `T07` | DIR-04, D-02 | §7.0 pipeline Azure SQL/Blob; origen ProCoop intacto | **Parcial hecho** |
| `entregables-analisis-diseno/` | D-06, C-10 | Política §12.3 + cabeceras clave | **Parcial hecho** |
| `presentacion-stakeholders/` | D-02–D-04, DIR-13 | **IMG-F** (`img-f-lotes/`); **IMG-N** (`img-n-lotes/`); modelo IMG-MD/T | En curso (generación slides en Claude) |
| M01 + T02 export | D-10, §9 | Banners; inventario ayuda; glosario §9 | En curso |
| T03 ayuda + M09 IA | §6.1, DIR-12 | T03b **60/60** M01+T02; revisión `dict:` | En curso (contenido base hecho) |
| M19 FAQ + matriz ScreenHelp | §6.2, DIR-12 | Cobertura PAN-* + portal `/ayuda` | Pendiente (otros módulos) |
| `GUIA-UI-UX-DESARROLLO.md` | §6.2 | Alinear con impacto (ya resume FAQ vs ScreenHelp) | Parcial |
| `08-identidad-marca-coopapps.md` + `docs/brand/coopapps/` | DEC-119 | Paleta, checklist, SVG v1; semilla PLATFORM en build | Hecho |

---

## 8. Plan de trabajo por fases

1. **DEC-110** multitenant Azure SQL (`TenantId`).  
2. **D-01 → D-12** volcados en §10, `01`, `02`.  
3. **M01 + T02** + glosario §9 (D-10, D-11).  
3b. **Ayuda + IA (§6.1–6.2, DIR-12):** matriz ScreenHelp, FAQ M19/M09.  
4. **T05** + **`07-*`** trazado físico módulo a módulo.  
5. **T04** motor + T04b (**DEC-114**).  
6. **T03** React + DIR-13 en presentación.  
7. **Export coodo** (DEC-118).

---

## 9. Glosario código ↔ especificación

Borrador; cerrar con **D-11**.

| Negocio (spec) | Código (PDF) | T05 actual | Notas |
|---|---|---|---|
| Cooperativa | `Tenant` | `tenants` | DEC-002, DEC-110 |
| Persona | `Party` | `persons` | Término negocio; código `Party` |
| Titular comercial | `Holder` | `holders` | M01; ProCoop SOCIO |
| Cuenta de servicios | `Account` | `accounts` | M01; ProCoop SUMSOC |
| Punto de prestación | `SupplyPoint` | `servicePoints` | M01 |
| Inmueble | `Premise` | `premises` | M01 |
| Usuario staff / portal | `User` / membership | `memberships`, T02 | OpenIddict |
| Rol funcional | `Role` | `roles` | Capabilities `modulo.recurso.accion` |
| Perfil de pantallas | `ScreenProfile` | `screenProfiles` | T02 |
| Alcance de datos | `DataScope` | assignments | T02 |
| Identidad plataforma | `Identity` | `identities` | Una por persona (AGR-006) |

---

## 10. Registro de respuestas

_Completar después del cuestionario interactivo (fecha, responsable, opción elegida, DEC/PA generada)._

| ID | Fecha | Responsable | Opción elegida | DEC / PA | Notas |
|---|---|---|---|---|---|
| D-01 | 19-11-2026 | Solicitante | Formalizar DEC-110 ahora | DEC-110 | Multitenant compartido |
| D-02 | 19-11-2026 | Solicitante | .NET + Azure SQL + spec alineada; ER aparte 4NF/PK/FK | DEC-111, DEC-117 | Reemplaza stack DEC-001 |
| D-03 | 19-11-2026 | Solicitante | Solo Azure en spec | DEC-112 | |
| D-04 | 19-11-2026 | Solicitante | Adoptar React 19 | DEC-113 | Reescribir T03 |
| D-05 | 19-11-2026 | Solicitante | Mantener T04 motor + T04b central | DEC-114 | Ver §4.1 |
| D-06 | 19-11-2026 | Solicitante | OpenAPI normativo en GACAC | (D-06) | PDF dice referencia; mantener entregables |
| D-07 | 19-11-2026 | Solicitante | Solo pipeline GoodApps; 03 archivado | DEC-118 | Ver §4.2 |
| D-08 | 19-11-2026 | Solicitante | Diferir cambios T02 / SMS | PA-STACK-02 | |
| D-09 | 19-11-2026 | Solicitante | Solo rol plataforma | DEC-116 | |
| D-10 | 19-11-2026 | Solicitante | M01 + T02 primero | Plan §8 | |
| D-11 | 19-11-2026 | Solicitante | Tabla equivalencias §9 | §9 | |
| D-12 | 19-11-2026 | Solicitante | Volcar cada respuesta a 01/02/06 | DIR-09 | Hecho (seguimiento en matriz §7) |

---

## 11. Bitácora del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 19-11-2026 | Impacto inicial; rechazo multi-BD. |
| 0.2 | 19-11-2026 | Directivas DIR-01–09; decisiones D-01–D-12; índice y §10 registro de respuestas. |
| 0.3 | 19-11-2026 | §4.1–4.2 contexto D-05/D-07; §10 con respuestas; DEC-110–117 en `01`. |
| 0.4 | 19-11-2026 | Resumen ejecutivo: base **relacional** vigente; DIR-10; regla de transición Mongo→SQL. |
| 0.5 | 19-11-2026 | Resumen **funcional no se toca**; DIR-05 ampliada; DIR-11. |
| 0.6 | 19-11-2026 | §6.1 IA y ayuda compilada (reunión); DIR-12; fase 3b en plan. |
| 0.7 | 19-11-2026 | §6.2 necesidad FAQ vs ScreenHelp; matriz cobertura; DIR-12 ampliada. |
| 0.8 | 19-11-2026 | DIR-13 redacción afirmativa; §5 stack adoptado; §12 checklist; alinea `00`, `01`, `03`, `07`, presentación. |
| 0.9 | 19-11-2026 | Fase 3 iniciada: M01+T02 banners; §9 glosario; inventario ScreenHelp; `07` per/iam. |
| 1.0 | 19-11-2026 | Reinicio aplicación impacto: banners en 37 anexos; `00` §3.0; `_GUIA` 1.1; T05 §7.0; `13-auditoria-impacto-stack.md`; scripts `_trabajo/`. |
| 1.1 | 19-11-2026 | `07` v0.7 esquema **pla** (DDL); T03 banner unificado; C-06 cerrado; C-04 parcial. |
| 1.2 | 19-11-2026 | **C-04/C-08 cerrados:** DDL 1.058 tablas, UX 878, FK 201 (~1912) / 203 (~942), `FK-CYCLES.md`; auditoría §13 regenerada; matriz §7 y presentación modelo alineados. |
| 1.3 | 19-11-2026 | Fase **3b** núcleo: `screenhelp-borrador-nucleo` + `T03-UXD-screenhelp-base-m01-t02` **60/60**; `sync_inventario_screenhelp.py`. |
| 1.4 | 19-11-2026 | Presentación: `export_img_f_lotes.py`, `export_img_n_lotes.py` (decks IMG-F e IMG-N por archivo). |
| 1.5 | 19-11-2026 | §12.0–12.1 tablero impacto; **C-10** en curso; `13-auditoria-impacto-entregables.md`. |
| 1.6 | 19-11-2026 | **C-10** política §12.3; normas en entregables (índice, OpenAPI, 07-pruebas, C4, STRIDE, 20-CP). |
| 1.7 | 19-11-2026 | **T05:** §6.1 norma física RN-DAT; §7.0 capas A/B/C DDL. |
| 1.8 | 19-11-2026 | **T07:** §7.0 destino Azure; §1 y principios de carga alineados a DEC-110/111. |
| 1.9 | 19-11-2026 | **T04:** §7.0 motor `cfg` + DEC-114; RNF/CTR DEC-110. |
| 2.0 | 19-11-2026 | **T02:** §7.0 OpenIddict/`iam.*`; CTR-IAM-01/02; auditoría transacción SQL. |
| 2.1 | 19-11-2026 | **C-04:** `07` §2.2 esquema `iam` (31 tablas); catálogo capa B. |
| 2.2 | 19-11-2026 | **C-04:** `07` §2.3 esquema `cfg` (45 tablas T04). |
| 2.3 | 19-11-2026 | **C-04:** `07` §2.4 esquema `cat` (25 tablas M02). |
| 2.4 | 19-11-2026 | **T03:** §7.B.0; **C-04** `07` §2.5 `uxd`. |
| 2.5 | 19-11-2026 | **T01:** §7.0 stack vigente; CTR-PLA 01/02/04/05; §7.11→`pla`. |
| 2.6 | 19-11-2026 | **C-04:** `07` §2.6 esquema `med` (34 tablas M03). |
| 2.7 | 19-11-2026 | **C-04:** `07` §2.7 esquema `fac` (38 tablas M05). |
| 2.8 | 19-11-2026 | **C-04:** `07` §2.8 esquema `tar` (35 tablas M04). |
| 2.9 | 19-11-2026 | **C-04:** `07` §2.9–2.10 `fis` + `cob`. |
| 2.10 | 19-11-2026 | **C-04:** `07` §2.11 esquema `mor` (39 tablas M08). |
| 2.11 | 19-11-2026 | **C-04:** `07` §2.12 esquema `crm` (42 tablas M09). |
| 2.12 | 19-11-2026 | **C-04:** `07` §2.13 esquema `tec` (75 tablas M10). |
---

## 12. Checklist de alineación documental

### 12.0 Qué es este impacto (y qué no)

| Pregunta | Respuesta |
|---|---|
| **¿Para qué sirve el `06`?** | Una sola bitácora para adaptar la **especificación canónica** al acuerdo GoodApps (**DEC-109–119**): stack Azure/.NET/SQL/React, modelo físico, multitenancy compartido, ayuda, export — **sin reescribir RF/RN/CU** (DIR-05). |
| **¿Qué es el checklist §12?** | Criterios **Hecho / Pendiente** para saber si cada capa documental ya dice solo la norma vigente en export (DIR-13). No es un plan de slides ni de implementación en código. |
| **¿Qué es la matriz §7?** | Estado **por artefacto** (T05, T04, entregables…) con acciones concretas; puede ir «En curso» aunque varios ítems del §12 estén hechos. |
| **¿Qué NO cuenta como impacto?** | Generar PNG/HTML en Claude (IMG-F, IMG-N, IMG-MD): apoya **C-07 presentación**, no cierra el checklist de spec. |
| **¿Dónde miro el progreso hoy?** | Tablero §12.1 + auditoría `13-auditoria-impacto-stack.md` (anexos) y `13-auditoria-impacto-entregables.md` (C-10). |

### 12.1 Tablero (próximo trabajo checklist)

| Prioridad | Ítem | Estado | Siguiente paso concreto |
|:---:|---|---|---|
| 1 | **C-10** entregables + OpenAPI | **Parcial hecho** | Política §12.3; 6 cabeceras; barrido CP solo si GoodApps lo pide por ola. |
| 2 | **C-05** cuerpo anexos | Hecho (banner); **barrido** incremental | Por módulo: reemplazar norma Mongo en cuerpo §5–§7 o nota «histórico»; ver `13-auditoria`. |
| 3 | **C-04** capa B `07` | Capa C hecha | Volcar siguiente módulo en `07-modelo-relacional` §2 (`iam`, `cfg`…). |
| 4 | Matriz **T05** | **Parcial hecho** | §6.1 + §7.0 inventario 07; barrido Mongo en §7.1.x incremental (como C-05). |
| 5 | Matriz **T07** | **Parcial hecho** | §7.0 destino Azure; §1 sin Mongo; §7.1+ lógico incremental. |
| 5b | Matriz **T04** | **Parcial hecho** | §7.0 DEC-114 + `cfg` en `07`; §7.1+ lógico incremental. |
| 5c | Matriz **T02** | **Parcial hecho** | §7.0 + RN auditoría SQL; §7.1+ lógico; PA-STACK-02 (2FA) con GoodApps. |
| 5d | **C-04 capa B `iam`** | **Hecho** | §2.2 completo (31 tablas); catálogo enlazado. |
| 5e | **C-04 capa B `cfg`** | **Hecho** | §2.3 (45 tablas); absorciones `fis`/`uxd`/T11. |
| 5f | **C-04 capa B `cat`** | **Hecho** | §2.4 (25 tablas M02). |
| 5g | **T03** / **C-04 `uxd`** | **Parcial hecho** | §7.B.0 + §2.5; barrido §7.B incremental. |
| 5h | Matriz **T01** | **Parcial hecho** | §7.0; RF §5.B histórico incremental. |
| 5i | Capa B **`med`** | **Hecho** | §2.6 (34 tablas M03). |
| 5j | Capa B **`fac`** | **Hecho** | §2.7 (38 tablas M05). |
| 5k | Capa B **`tar`** | **Hecho** | §2.8 (35 tablas M04). |
| 5l | Capa B **`fis` / `cob`** | **Hecho** | §2.9–2.10 (48+45 tablas). |
| 5m | Capa B **`mor`** | **Hecho** | §2.11 (39 tablas M08). |
| 5n | Capa B **`crm`** | **Hecho** | §2.12 (42 tablas M09). |
| 5o | Capa B **`tec`** | **Hecho** | §2.13 (75 tablas M10). |
| 5p | Capa B **`tes`…** | Pendiente | Resto olas M11–M19. |
| 6 | **C-09** dict ayuda | Hecho T03b | Claves `dict:` en publicación O1 (no bloquea checklist core). |

Marcar **Hecho** en la tabla §12 cuando el criterio de cada fila se cumpla en export.

### 12.3 Política C-10 — entregables y casos de prueba (19-11-2026)

1. **OpenAPI** (`18-contratos-api`, `18-openapi/`): contrato de **diseño** en GACAC (D-06); implementación ASP.NET Core; esquemas = entidades lógicas → tablas `07-ddl`.
2. **Arquitectura / amenazas / pruebas** (C4, STRIDE, estrategia): diagramas y menciones Mongo/Node = análisis Connectia; **norma objetivo** = Azure SQL + .NET + React (bloques citados en índice y cabeceras).
3. **5.710 CP**: no se reescriben en bloque; el **comportamiento** aceptado es el del RF/RN; el motor físico en ejecución es el de DEC-111. Nuevos CP y regeneraciones deben usar redacción Azure/EF/Playwright.
4. **Cierre C-10** = política publicada + auditoría estable; reescritura línea a línea solo si GoodApps lo exige por módulo en export.

### 12.2 Ítems del checklist

| # | Artefacto | Criterio | Estado |
|---|---|---|---|
| C-01 | `00` §3.0, §5, §14, §16 | Tabla de reemplazo DEC-001→111; stack Azure en §5 | Hecho (§3 fila histórica conservada) |
| C-02 | `01` DEC-110–118 | DEC-001/004 marcadas reemplazadas | Hecho |
| C-03 | `03` encabezado | Mapa de olas; no como guía de build | Hecho |
| C-04 | `07-*` A/B/C + catálogo | A=1.058; B=§2 núcleo; **C=`07-ddl` 1.058 tablas** (`deploy-coopapps-full.sql`); enriquecer B sigue opcional | **Capa C hecha** (B incremental) |
| C-05 | Todos los anexos M/T | Banner DEC-111 (36+ T01); T05 §7.0 | Hecho (cuerpo anexos: barrido incremental) |
| C-06 | T03 | React (banner DEC-113); referencias CNX `.vue` = benchmark; T03b ayuda | Hecho (RF sin prescripción Vue) |
| C-07 | `presentacion-stakeholders` stack/datos | Azure, SQL, React en IMG-T05/MD02; tablas 1.058 (no Mongo en export) | Hecho (barrido menor en `documento-base` hecho 19-11 v1.2) |
| C-08 | Anexos Mxx (físico) | Colección → tabla en `07-ddl` (**1.027/1.027 con §7**, 0 fallback) | **Hecho** |
| C-09 | §6.1–6.2 ayuda/FAQ | Paquete T03b **60 artículos** M01/T02 + inventario sincronizado | Hecho (dict pendiente) |
| C-10 | `entregables-analisis-diseno` | OpenAPI diseño (D-06); política §12.3 + cabeceras; físico `07-ddl` | **Parcial hecho** (política documentada; CP histórico aceptado; barrido opcional) |

---

## 13. Auditoría automatizada

Regenerar tras cambios masivos:

```text
python docs/especificacion/_trabajo/audit_impacto_stack.py
python docs/especificacion/_trabajo/apply_anexo_banners.py
python docs/especificacion/_trabajo/generate_t03_screenhelp_annex.py
python docs/especificacion/_trabajo/sync_inventario_screenhelp.py
python docs/especificacion/_trabajo/audit_entregables_stack.py
```

| Informe | Ámbito |
|---|---|
| **`13-auditoria-impacto-stack.md`** | Anexos, maestro, guía, `07`, presentación (sin `OLD`) |
| **`13-auditoria-impacto-entregables.md`** | `docs/entregables-analisis-diseno/` (**C-10**) |

Residuos Mongo/Node en **cuerpo** = barrido incremental; norma vigente = banner + maestro `00` §5 + `06` §12.