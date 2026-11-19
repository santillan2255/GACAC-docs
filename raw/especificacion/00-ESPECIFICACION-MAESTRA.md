# 00 — Especificación Maestra de Alcance: CoopApps

| Campo | Valor |
|---|---|
| Versión | 1.0 (borrador consolidado) |
| Fecha | 04-11-2026 |
| Estado | Especificación consolidada al 10-11-2026; adaptación de stack y export GoodApps al 19-11-2026 (DEC-110–119; ver `06-impacto-adaptacion-stack-goodapps.md`). 31 anexos completos (M01–M19 y T01–T12), matriz (`04`), huecos (`05`), ER físico en elaboración (`07`) |
| Alcance | Sistema SaaS multitenant integral para cooperativas de servicios (ERP + CRM + autogestión + plataforma + cobranza + pasarelas + impuestos + APIs) que reemplaza a ProCoop |
| Uso | Fuente **única y suficiente** del alcance funcional y de las decisiones. La implementación con GoodApps usa el stack de §5 y el checklist de `06-impacto-adaptacion-stack-goodapps.md`. El mapa por olas O0–O11 está en `03-plan-de-olas-y-prompts.md` como referencia de contenido (DEC-118) |

> **Regla de uso.** Este documento es el índice rector. Define el concepto, las decisiones, la arquitectura, la tecnología, los roles, las aplicaciones, el mapa del sitio, los layouts, las convenciones y las olas de **contenido**. El detalle de cada módulo está en `anexos/`. Ante cualquier conflicto entre un anexo y este documento, **prevalece este documento** (sección 3); ante conflicto entre anexos, prevalece el anexo **dueño del dato** (sección 12 y `T05`). Para stack, nube, UI y entrega a GoodApps, prevalecen **DEC-110–119** y `06`.

## Índice

1. Visión y concepto del producto
2. Fuentes consolidadas y jerarquía de prevalencia
3. Decisiones rectoras (DEC)
4. Alcance funcional: soluciones, servicios y módulos
5. Arquitectura y stack tecnológico
5b. [Adaptación GoodApps e impacto](06-impacto-adaptacion-stack-goodapps.md)
6. Multitenancy y plataforma SaaS
7. Actores, roles y modelo de permisos
8. Aplicaciones y espacios de trabajo
9. Mapa del sitio (resumen)
10. MainLayouts
11. Design system, marca por tenant y diccionario
11b. [Guía UI/UX para desarrollo](GUIA-UI-UX-DESARROLLO.md) (documento exclusivo; detalle normativo en T03)
11c. [Identidad visual CoopApps (producto)](08-identidad-marca-coopapps.md) (DEC-119; assets en `docs/brand/coopapps/`)
12. Índice de módulos y dueños de datos
13. Convenciones transversales de desarrollo
14. Requisitos no funcionales (resumen)
15. Plan de olas (resumen)
16. Cómo usar esta especificación con GoodApps
17. Registro global de contraposiciones resueltas
18. Preguntas abiertas
19. Trazabilidad global de fuentes
20. Glosario general

---

## 1. Visión y concepto del producto

### 1.1 Problema

Las cooperativas de servicios públicos argentinas (electricidad, agua, gas, Internet/TIC, telefonía, TV, sepelio, salud, vivienda y otros servicios sociales) operan con sistemas de escritorio instalados localmente, con una base de datos por cooperativa, parámetros numéricos sin semántica (ProCoop tiene **1.536 parámetros** en una tabla clave/valor), seguridad débil (contraseñas reversibles, usuario SQL compartido, secretos en el código), integraciones frágiles y nula experiencia digital para el socio.

### 1.2 Propuesta

**CoopApps** es la plataforma SaaS multitenant, web y PWA, que cubre la operación integral de la cooperativa. Marca comercial elegida según el informe de naming del equipo (noviembre 2026): nombre corto **CoopApps** (pronunciación rioplatense: *Coop-apps*), bajada de trabajo **«Gestión inteligente para cooperativas»**, desarrollo y operación del servicio por **GoodApps** (empresa prestadora; contratos, encargos de datos personales y relación comercial SaaS).

- **ERP**: personas y cuentas, catálogo de servicios, medición, tarifas, facturación multiservicio, fiscal, cuenta corriente y cobranza, mora y financiación, compras, stock, tesorería, contabilidad, sueldos, institucional y servicios sociales.
- **CRM**: solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot e IA, técnica y campo.
- **Landing y autogestión**: sitio público con marca de la cooperativa, registro, portal y app del socio, pago online, comunidad editorial.
- **Plataforma**: alta y ciclo de vida de cooperativas, licencias por módulo, soporte auditado, ambientes, salud.
- **Cobranza y pasarelas**: cajas, entes recaudadores, débitos, pasarelas de pago, QR y conciliación.
- **Liquidación de impuestos**: ARCA, IVA, IIBB, percepciones, retenciones, tasas de terceros y regímenes informativos.
- **APIs**: API pública para terceros, webhooks y BI.

Es el mapa de las 8 soluciones de BASE §105. El concepto visual y técnico es el de **Connectia** (CNX): admin web oscuro y denso para el personal, PWA con piel propia y branding runtime para socios y empleados de campo, y comunidad tipo muro editorial.

### 1.3 Principios de producto

| # | Principio | Origen |
|---|---|---|
| P1 | Una sola plataforma para todas las cooperativas y todos sus servicios; cada cooperativa habilita solo lo que contrata y configura. | BASE §2, §42, §66 |
| P2 | **Configuración, no programación**: servicios, tarifas, conceptos, impuestos, textos y flujos se parametrizan por tenant con vigencias y versionado. | BASE §39, §81, §84; AGR-009/010 |
| P3 | **Diccionario de términos desde el inicio**: ninguna etiqueta fija; cada tenant adapta su vocabulario (socio/usuario/asociado, suministro/conexión). | BASE §65 |
| P4 | **Factura multiservicio y separada** como modos de primera clase. | BASE §103 (prevalece) |
| P5 | Trazabilidad total: auditoría inmutable; los documentos económicos nunca se borran, se anulan o revierten. | BASE §29; AGR-003 |
| P6 | IA asistente que **propone** y no ejecuta sin confirmación, con permisos y auditoría. | BASE §102; AGR-030; CNX |
| P7 | Experiencia del socio primero: autogestión en celular, una tarea principal por pantalla. | BASE §25, §102.5.6 |
| P8 | Seguridad por diseño: aislamiento de tenant verificable, secretos en bóveda, 2FA, mínimo privilegio. | BASE §60, §97; CNX §10 |
| P9 | Todo lo que hace ProCoop está en alcance, mejorado; las deudas técnicas de ProCoop se reemplazan y no se replican. | DEC-007 |

### 1.4 Piloto de referencia (DEC-005)

El primer flujo completo de punta a punta es el del servicio **Internet**:

1. Contratación.
2. Factibilidad.
3. Visita e instalación.
4. Equipo en comodato.
5. Activación y aprovisionamiento.
6. Facturación.
7. Pago.
8. Reclamo.
9. Mora y suspensión.
10. Baja.

Las olas O2 a O6 lo cierran. Los servicios medidos (electricidad, agua, gas) llegan en O7.

La **cooperativa piloto** (comercial y de migración) es **Laguna Larga** (`LAG`) (DEC-088, que reemplaza a DEC-081; antes "todavía no está definida"). La especificación la sigue nombrando "cooperativa piloto". Su base de ProCoop es también la **base relevada de referencia**: sus configuraciones y formatos se usan para el mapeo, las pruebas de paralelo y los `[VERIFICAR]`. Como opera servicios medidos (electricidad, gas y prepago), su primera migración real ocurre después de O7 (PA-MIG-17) y el corte avanza por etapas hasta O11 (DEC-068).

---

## 2. Fuentes consolidadas y jerarquía de prevalencia

### 2.1 Fuentes

| Código | Fuente | Contenido | Rol en esta especificación |
|---|---|---|---|
| BASE | `docs/base-funcional/PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md` v0.17 | Secciones §1–§107: requisitos informados por el solicitante, propuestas validadas, casos de uso, mercado (§99), MER-001..020 (§100), complemento integrado (§102), factura multiservicio FAC-005..012 (§103), sueldos SUE-001..014 (§104), mapa de soluciones (§105), pendientes (§106), mensajes P-001..P-020 | **Esqueleto rector** |
| AGR | `docs/base-funcional/PROCOOP_COMPLEMENTO_ANALISIS_FUNCIONAL_Y_DISENO.md` | AGR-001..036 (36 fichas), escenarios ESC-01..05, etapas de trabajo A–G | Complemento de diseño: bordes, estados, invariantes |
| CNX | `referencia-connectia/connectia-referencia-para-goodapps.md` | Stack, estructura, multitenant, licencias, auth, design system PWA y admin, muro, novedades, encuestas, audiencia, deudas de seguridad | **Formato técnico y UI/UX** |
| DFA | `procoop-relevamiento/definicion-funcional-alcance.md` | 29 módulos de ProCoop con pantallas, procesos, modelo y prioridades A/B/C | Benchmark funcional |
| FIC | `procoop-relevamiento/integraciones-fichas.md` | 23 secciones de integraciones | Benchmark de integraciones |
| RN-01..13 | `procoop-relevamiento/reglas-negocio/` | Reglas extraídas del código (cálculo de factura, facturación masiva, mora, cobranzas, técnica, ERP administrativo, parámetros, integraciones, pasarelas…) | Benchmark de reglas |
| CAT | `procoop-relevamiento/binarios/Procoop-catalogo-tablas.md` | 659 tablas en 31 secciones | Modelo legacy testigo |
| INV | `procoop-relevamiento/binarios/inventarios/*.md` | Formularios y métodos por módulo | Verificación de cobertura de pantallas |
| REL | `procoop-relevamiento/README.md` | Menú completo (9 pestañas), fichas, comprobantes de la DEMO | Verificación de cobertura de funciones |

### 2.2 Jerarquía de prevalencia

1. **DEC-xxx** (sección 3): decisiones del solicitante.
2. **BASE** en su redacción más reciente. Las secciones que declaran "prevalece" sustituyen a las anteriores: §103 sobre las exclusiones previas de la factura multiservicio y §104 sobre §28.
3. **AGR**: se adopta salvo contradicción con 1 o 2.
4. **CNX**: para lo técnico, la UI/UX, el layout, los componentes, los permisos y la comunidad.
5. **Benchmark ProCoop** (DFA, FIC, RN, CAT, INV, REL): todo entra en alcance (DEC-007) salvo contradicción con 1–4 o que sea deuda técnica o de seguridad; en ese caso se registra como `Reemplazado por`.

Cada contraposición se documenta con un ID `CTR-` en el anexo correspondiente y las globales en la sección 17.

### 2.3 Revisiones externas

Documentos contrastados con esta especificación que **no son fuente**: no entran en la tabla 2.1 ni en la jerarquía 2.2, y lo que aportan solo rige a través de una DEC.

| Documento | Estado | Efecto |
|---|---|---|
| `NucleoTransversal-Modelo` (documento externo; contraste en `docs/revision-externa/NucleoTransversal-contraste.md` y rechazos en `docs/revision-externa/NucleoTransversal-rechazados.md`) | Contrastado el 10-11-2026; no es fuente | Sus aportes aceptados entraron por DEC-093 a DEC-104 (aportes A1 a A11 y correcciones internas); la revisión de los rechazos dio DEC-105 a DEC-108. Los anexos citan la DEC, no el documento. Lo demás sigue rechazado con su motivo |
| GestionApps (sistema base mencionado por el documento externo) | No es fuente hoy (DEC-108) | No forma parte del diseño ni de la especificación porque no hay información disponible; podría analizarse en el futuro con el mismo criterio de contraste y, si aporta, incorporarse como fuente de referencia con su lugar en la jerarquía 2.2 |

---

## 3. Decisiones rectoras (DEC)

Decisiones tomadas por el solicitante el 04-11-2026. Prevalecen sobre cualquier fuente.

| ID | Tema | Decisión | Consecuencias principales |
|---|---|---|---|
| DEC-001 | Stack | Connectia tal cual: **Node.js 20 ESM + Express + MongoDB 7** (replica set, transacciones multi-documento) **+ Mongoose 8 + Vue 3.5 + Vite + Pinia + Vue Router + Tailwind**, con las mejoras [MEJORAR] de CNX | Reemplaza las alternativas .NET/Azure/SQL Server de DFA. Agrega Zod, BullMQ+Redis, almacenamiento de objetos privado con URL firmadas, rate limiting, `DataTable` y `ExcelImportWizard` genéricos, motor único de audiencias y bóveda de credenciales por tenant. |
| DEC-002 | Multitenancy | **Base de datos única compartida** con `tenantId` en todo documento | Índices compuestos que empiezan por `tenantId`; tenant tomado del token; plugin Mongoose que impide consultas sin tenant; tenant especial `PLATFORM`. Reemplaza "una base por cooperativa" de ProCoop/DFA. |
| DEC-003 | Arquitectura | **Monolito modular** + outbox de eventos + workers BullMQ | Un backend con módulos de dominio con fronteras estrictas; cada módulo es dueño de sus colecciones; la comunicación entre módulos es por servicio público o por evento. |
| DEC-004 | Despliegue | **Docker agnóstico de nube**; AWS como referencia | Contenedores para API, workers, admin, PWA y landing; Mongo gestionado o replica set; Redis; almacenamiento S3-compatible. |
| DEC-005 | Piloto | **Internet** | Las olas O2–O6 se orientan a cerrar Internet de punta a punta. |
| DEC-006 | Planificación | **Olas sin fechas** | Las fechas de DFA quedan sin efecto; solo hay orden y dependencias. |
| DEC-007 | Alcance | **Todo lo que hace ProCoop** | Incluye telefonía y tasación de CDR, TV, vivienda, salud/ambulancias/sepelio, fabricación, flota/GPS, turnero y agente de hardware; las prioridades C de DFA pasan a olas tardías, no se excluyen. |
| DEC-008 | Comunidad | **Muro editorial** con reacciones y comentarios moderados (IA + humano) | Los socios no publican posteos propios; la moderación es habilitable por tenant y por publicación. |
| DEC-009 | Contabilidad | **Núcleo temprano** (O5) y contabilidad completa en O8 | El motor de asientos automáticos existe desde que hay eventos económicos. |
| DEC-010 | Entregable | Maestro + anexos + plan de olas con prompts + registro de decisiones y preguntas | Estructura de `docs/especificacion/`. |

### 3.0 Stack de implementación vigente (GoodApps, 19-11-2026)

Las filas **DEC-001** a **DEC-004** registran el acuerdo del **04-11-2026** (patrón Connectia). Para **construcción y export** prevalecen **DEC-110** a **DEC-113**, **DEC-117** y **DEC-118**, detalladas en §5, `06-impacto-adaptacion-stack-goodapps.md` y `01` (DEC-111 reemplaza el stack de DEC-001; DEC-110 concreta multitenancy en Azure SQL; DEC-112 reemplaza el despliegue de DEC-004; DEC-118 archiva `03` como guía de build). El funcional (DEC-003 monolito modular, DEC-007 alcance, etc.) **no cambia**.

| DEC histórica | Tema | Reemplazo / vigente en implementación |
|---|---|---|
| DEC-001 | Stack Node + Mongo + Vue | **DEC-111** (.NET 10 + Azure SQL + React 19 + EF Core) |
| DEC-002 (parte física) | `tenantId` en documento, plugin Mongoose | **DEC-110** (`TenantId` en tablas, filtros EF, índices compuestos) — semántica multitenant intacta |
| DEC-004 | Docker agnóstico / AWS referencia | **DEC-112** (Microsoft Azure) |
| DEC-001 (colas) | BullMQ + Redis | **Azure Queue Storage** + workers .NET; Redis en Azure donde aplique (§5) |

Las respuestas a las preguntas abiertas se registran como **DEC-011** en adelante en `01-registro-decisiones.md` y se resumen en 3.1.

### 3.1 Decisiones sobre preguntas abiertas (DEC-011 a DEC-108)

Resumen del registro `01-registro-decisiones.md`, que es la fuente con fecha y fundamento. Las preguntas no consultadas adoptan su opción recomendada (DEC-047 y DEC-072). Prevalecen sobre cualquier anexo.

| ID | Tema | Decisión | Anexos afectados |
|---|---|---|---|
| DEC-011 | PA-CAT-01 Momento de creación del contrato | Al admitir la solicitud en CRM, en estado Solicitado | M02, M09 |
| DEC-012 | PA-CAT-05 Jerarquía del catálogo | Servicio → producto (subservicio = producto adicional) → plan versionado → conceptos facturables | M02, M04, M05 |
| DEC-013 | PA-CAT-10 Modalidad de equipos | Configurable por plan; comodato por defecto en Internet y TV, valorizado en stock | M02, M13, M10 |
| DEC-014 | PA-CFG-P1-05 + PA-CFG-P3-04 Reconexión al pagar | Automática en servicios remotos al confirmarse el pago y sin deuda vencida del servicio; si requiere técnico, OT automática | M07, M08, M10 |
| DEC-015 | PA-CFG-P3-05 Pasarelas en O5 | Pagos360, Mercado Pago, SIRO y Red Link en O5; el resto Extensión en O11 | M07, T06 |
| DEC-016 | PA-VEN-08 Facturación de la instalación del piloto | En la primera factura del ciclo tras la OT confirmada (concepto vinculado) | M11, M05 |
| DEC-017 | PA-CFG-P1-01 Numeración de titulares | Secuencia única por tenant con atributo de tipo; número manual solo en migración | M01, T07 |
| DEC-018 | PA-CFG-P2-06 ARCA sin respuesta en mostrador | Espera del CAE con tiempo máximo; luego contingencia CAEA o comprobante pendiente no entregable como fiscal | M05, M06, M11 |
| DEC-019 | PA-INS-03 Ola del capital social | Mínimo en O5 (rubros, regla, facturado/pagado, estado de cuenta); resto O10 | M17, M05, M07 |
| DEC-020 | PA-CFG-P1-03 Claves de mapas e IA | Provistas por la plataforma, con opción de clave propia del tenant | T01, T06 |
| DEC-021 | PA-CAT-02 Habilitar y publicar servicios | Plataforma habilita según licencia; admin del tenant publica con aprobación de otro usuario en producción | M02, T01 |
| DEC-022 | PA-CAT-03 Apagar oferta con contratos vigentes | Cerrar oferta frena altas; cerrar operación exige plan de salida | M02 |
| DEC-023 | PA-CAT-04 Altas automáticas | Directas solo obligatorios con fundamento normativo; opcionales se proponen con consentimiento | M02, M01 |
| DEC-024 | PA-CAT-06 Banco de sangre | Solo administrativo por convenio, sin datos clínicos | M02, M18 |
| DEC-025 | PA-CAT-07 Copias entre tenants | Autorización explícita del tenant origen | M02, T01 |
| DEC-026 | PA-CAT-08 Plantillas de plataforma | Sí, sin precios ni condiciones reguladas | M02, T01 |
| DEC-027 | PA-CAT-09 Provisorio | Suministro transitorio con vencimiento obligatorio, facturable en esa condición | M02, M05 |
| DEC-028 | PA-CAT-11 Contratos iguales en una cuenta | Permitido en no medidos; en medidos uno por punto de suministro | M02, M03 |
| DEC-029 | PA-CAT-12 Deuda previa en el domicilio | Advertencia con autorización opcional; nunca bloqueo ni traslado de deuda | M02, M07 |
| DEC-030 | PA-CAT-13 Modalidades de gas | Red natural, propano por red y envasado, habilitables por tenant | M02, M03, M04 |
| DEC-031 | PA-CAT-14 Suspensión voluntaria | Configurable por servicio, deshabilitada por defecto | M02, M08 |
| DEC-032 | PA-CAT-15 Vigencia del cambio de plan | Próximo período; inmediato con prorrateo si el tenant lo habilita | M02, M04 |
| DEC-033 | PA-CAT-16 Hecho de activación | Confirmación técnica de instalación y aprovisionamiento; revisión del supervisor posterior | M02, M10, M05 |
| DEC-034 | PA-FAC-01 Modalidad de factura por defecto | Separada por servicio; agrupada multiservicio solo si se activa por grupo | M05 |
| DEC-035 | PA-FAC-04 Asignación del número fiscal | Al emitir, en orden del lote. Comprobante rechazado por ARCA: **reemplazada en ese punto por DEC-107** (vuelve a borrador y libera su número; los posteriores sin CAE se renumeran desde el último autorizado). *Reemplazado (DEC-107, 10-11-2026): "si ARCA rechaza se reenvía el mismo número".* | M05, M06 |
| DEC-036 | PA-FAC-05 Factura con total negativo | Política por servicio; por defecto NC; generación distribuida como crédito a futuro | M05, M03 |
| DEC-037 | PA-FAC-06 Factura en cero | No emitir; registrar "sin cargo", configurable por servicio | M05 |
| DEC-038 | PA-FAC-19 Caída de ARCA en masiva | Emitir y encolar; pausar solo la autorización; CAEA si está habilitado | M05, M06, T06 |
| DEC-039 | PA-TEC-01 Cierre de OT | Dos pasos por defecto en altas, desconexiones, reconexiones y cambios de medidor; configurable por operación | M10 |
| DEC-040 | PA-TEC-04 Factibilidad obligatoria | Configurable por servicio; obligatoria por defecto en Internet y servicios con red | M10, M02 |
| DEC-041 | PA-TEC-09 Aprovisionamiento | Automático asíncrono vía conector con respaldo manual | M10, T06 |
| DEC-042 | PA-TEC-10 Sistemas de red del piloto | MikroTik, Radius y SmartOLT en O3 | M10, T06 |
| DEC-043 | PA-PER-01 Verificación del vínculo usuario-titular | Código de factura + documento, código al contacto o validación presencial, con intentos limitados | M01, M19, T02 |
| DEC-044 | PA-PER-02 Documento duplicado | Único por tenant, con excepción aprobada y auditada | M01 |
| DEC-045 | PA-PER-06 Deuda en cambio de titularidad | Queda en el saliente; el nuevo solo la asume por convenio | M01, M07, M08 |
| DEC-046 | PA-PER-13 Proveedor geográfico | Georef para normalizar/geocodificar; Google Maps para mapa y autocompletado | M01, T04, T06 |
| DEC-047 | Política de preguntas | Se preguntan solo las de alto impacto o que bloquean olas tempranas; las de detalle se asumen con la opción recomendada y quedan `Asumida (recomendada)` para revisión posterior | Todos |
| DEC-048 | PA-COB-01 Imputación de pagos | Por antigüedad, recargos/intereses primero, respetando elección explícita del socio o cajero | M07 |
| DEC-049 | PA-COB-03 Créditos entre servicios | Automático solo dentro del mismo servicio; entre servicios con elección o autorización | M07 |
| DEC-050 | PA-COB-09 Identificador de pago en la migración | Identificador nuevo autocontenido + resolución por clave ProCoop hasta vencer sus facturas | M07, M05, T07 |
| DEC-051 | PA-CFG-P1-04 Interés en pago online de factura vencida | Diferido a la próxima factura, configurable por canal | M07, M08 |
| DEC-052 | PA-CFG-P3-01 Plazo de prescripción de deuda | Plazos **por tipo de obligación** (`prescriptionRules`): **24 meses** para facturas periódicas de servicios (CCyC art. 2562 inc. c) y **60 meses** para el resto (ventas, cuotas de convenio, otros; CCyC art. 2560). Todo es editable por tenant y servicio y requiere validación legal (`validationStatus`) antes de la primera corrida productiva. *Revisada el 04-11-2026: el solicitante había elegido 5 años para todo y, ante la observación sobre el art. 2562, confirmó la diferenciación.* | M08, M07, T04b parte 3 |
| DEC-053 | PA-FIS-03 Certificado ARCA | La plataforma genera clave y CSR (clave privada en bóveda) y admite PFX existente | M06, T06 |
| DEC-054 | PA-FIS-09 Jurisdicciones de IIBB | Córdoba en O4; resto como configuración en O8 | M06 |
| DEC-055 | PA-CRM-06 Proveedor de WhatsApp | Meta Cloud API por defecto, adaptador para Trii | M09, T06, T09 |
| DEC-056 | PA-CRM-09 IA en atención | Clasificar/resumir/sugerir en O6; adjuntos en O10; apagada hasta aceptación del tenant | M09 |
| DEC-057 | PA-CRM-15 Botón de baja | Habilitado en Internet, TV y telefonía; configurable en otros; código en 24 h | M09, M19 |
| DEC-058 | PA-SUE-01 Estrategia de sueldos | O8 importación de liquidador externo; O9 liquidación propia con 2 períodos en paralelo | M16, M15, M14 |
| DEC-059 | PA-TES-16 Tesorería en O5 | Cuentas, rendición, depósitos, extractos y conciliación en O5; valores, cupones, retenciones e Interbanking en O8 | M14 |
| DEC-060 | PA-MED-08 Generación distribuida | Configurable por régimen; default compensación monetaria (Ley 27.424) | M03, M04, M05 |
| DEC-061 | PA-INS-02 Capital social en la factura | Renglón identificado en la factura del servicio con auxiliar separado y leyenda | M17, M05 |
| DEC-062 | PA-PLA-01 Región de alojamiento | AWS sa-east-1 (San Pablo) con cláusulas contractuales de transferencia internacional según la AAIP; diseño agnóstico de nube (DEC-004; antes citaba DEC-008, que es el modelo del muro) | T01, T08 |
| DEC-063 | PA-PLA-02/03 Continuidad y niveles de servicio | Disponibilidad 99,5 % mensual; RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h plataforma completa; p95 interactivo ≤ 800 ms; soporte lunes a viernes 8–18 con P1 24×7 | T01, T08 |
| DEC-064 | PA-PLA-14 Varias personas jurídicas por tenant | Sí: `legalEntities` del tenant (equivalente a `EMPRESAS` de ProCoop), gestionadas en T04, con emisión, contabilidad y sueldos por entidad; `legalEntityId` en los documentos económicos desde O0. Completada por DEC-096 (membresías de asociados, centros de costo, alcance de roles, auditoría y ámbito de parámetros) | T01, T04, T05, M05, M06, M15, M16 |
| DEC-065 | PA-PLA-08/09 Modelo comercial y facturación del SaaS | Packs por tamaño + complementos con cupo por contratos activos; facturación con M05 bajo el tenant `PLATFORM` desde O5 y prefactura exportable en O1 | T01, M05 |
| DEC-066 | PA-IAM-01 Ingreso del socio | Contraseña o código OTP de 6 dígitos por correo/SMS habilitable por tenant; sin enlace mágico | T02, M19 |
| DEC-067 | PA-IAM-02 CiDi Córdoba | Mecanismo de proveedor federado en O1; CiDi habilitable por tenant al publicar el portal (O2); nivel mínimo 2 para vincular cuentas | T02, T06, M19 |
| DEC-068 | PA-MIG-04 Orden de reemplazo de ProCoop | Por etapas: corte comercial (M01–M09) primero; contabilidad, compras, stock, tesorería y sueldos siguen en ProCoop hasta el corte administrativo | T07 |
| DEC-069 | PA-CON-03 y PA-MIG-18 Contabilidad durante la convivencia | Oficial en ProCoop hasta el corte administrativo; CoopApps contabiliza en un plan marcado no oficial, concilia contra ProCoop y se oficializa en el corte | M15, T07 |
| DEC-070 | PA-MIG-01 Profundidad del histórico | Ejercicio en curso + 24 meses en estructuras tipadas; el resto en `legacyRecords` consultables; copia del origen conservada 10 años | T07 |
| DEC-071 | PA-SOC-14 Ola de adherentes | Adherentes y sus entradas a facturar (`billing-inputs`) en O4; el resto de M18 en O10 | M18, M05 |
| DEC-072 | Preguntas no consultadas (política DEC-047) | Toda PA de `02-preguntas-abiertas.md` marcada "Asumida (DEC-072)" adopta su opción recomendada; el usuario puede revisarla en cualquier momento | Todos |
| DEC-073 | Cómo queda especificado cada servicio de punta a punta | Nuevo anexo `T12-SRV-fichas-verticales-servicios.md`: una ficha por cada uno de los 17 dominios de M02 §6.C (INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR) que recorre contrato, medición, tarifa, facturación, fiscal, cobro, mora, técnica, atención, portal, reportes y migración, con IDs exactos de cada anexo. Se arma cuando estén completos todos los anexos y sirve de control de cobertura | T12, M02–M19 |
| DEC-074 | PA-INT-02 Bóveda de secretos | Cifrado por sobre (envelope encryption) propio en MongoDB con clave maestra en AWS KMS, detrás de una interfaz agnóstica de proveedor; nunca se transcriben ni registran valores | T06, T01, T08 |
| DEC-075 | PA-NFR-03 Perfil de capacidad | Tenant estándar 25.000 suministros y grande 150.000; diseño para 100 tenants y hasta 300 sin rediseño | T08, T01 |
| DEC-076 | PA-NFR-07 Rol ante la Ley 25.326 | GoodApps es prestador de servicios de tratamiento por cuenta de la cooperativa (art. 25): contrato tipo de encargo, registro público de subencargados, destrucción o devolución al fin del encargo | T08, T01 |
| DEC-077 | PA-COM-04 Contratación de mensajería | Dos modelos: conector propio del tenant, o proveedor de plataforma revendido con consumo medido como complemento del pack (DEC-065) | T09, T06, T01 |
| DEC-078 | PA-INT-22 y PA-WFL-06 Firma de documentos | Firma electrónica con OTP por defecto (instalación, convenios, trámites); firma digital con proveedor licenciado solo para recibos de sueldo y actas (O8/O9); interfaz de firma propia y proveedor elegido antes de O3 | T11, T06, M16, M17 |
| DEC-079 | PA-WFL-04 Diseñador de trámites | El tenant ajusta plantillas de plataforma en puntos de extensión y crea trámites nuevos solo de tipo "solicitud genérica" que terminan en tarea o caso | T11 |
| DEC-080 | PA-WFL-05 Motor de PDF | HTML + CSS renderizado con Chromium sin interfaz en workers dedicados, con validación PDF/A posterior | T11, T03, T08 |
| DEC-081 | Cooperativa piloto | La cooperativa piloto (comercial y de migración) **no está definida**; los anexos la nombran "cooperativa piloto". Laguna Larga (`LAG`, base `PR_LAG_DEMO`) es solo la **base relevada de referencia** de ProCoop: sus configuraciones, formatos (Red Link, SIRO) y valores se usan para el mapeo, las pruebas de paralelo y los `[VERIFICAR]`, no como piloto. Los requisitos marcados para LAG aplican a toda cooperativa migrada con la misma configuración. **Reemplazada por DEC-088** | T07, M07, T06, todos |
| DEC-082 | PA-CAT-17 Gas envasado | En alcance como variante "envasado" de GAS: venta con stock (M13) y entrega (M10), sin medidor; habilitable por tenant | M02, M13, M10, M04 |
| DEC-083 | PA-CAT-18 Conceptos de terceros sin servicio propio | Siempre cuelgan de un contrato propio del socio con perfil "convenio de terceros" accesorio | M02, M06, M08, T07 |
| DEC-084 | PA-CAT-19 Correo electrónico y pack SMS | Servicios de M02 con aprovisionamiento por T06 y cupo/consumo; habilitables por tenant | M02, T06, M04, M10 |
| DEC-085 | Corrección de volumen de gas (HUE-GAS-03) | La aplica M04 con sus factores; M03 entrega el volumen medido (asumida por coherencia con PA-TAR-19) | M04, M03 |
| DEC-086 | Destino de `BENSOC` (HUECO-SEP-02) | Único destino `serviceBeneficiaries` de M18; no es tarifa social | M18, T07, T05, M02, M04, T09 |
| DEC-087 | PA-DAT-01 y PA-DAT-02 | Cuenta corriente por titular y entidad jurídica con recibo por entidad; histórico de más de 36 meses en consulta diferida (asumidas, DEC-072) | T05, M07, M05, T08 |
| DEC-088 | Cooperativa piloto (reemplaza DEC-081) | La cooperativa piloto comercial y de migración es Laguna Larga (`LAG`), que sigue siendo la base relevada de referencia; Internet sigue siendo el primer servicio construido (DEC-005); primera migración real de LAG después de O7, con prepago disponible, y corte por etapas hasta O11 | 00, T07, M07, T06, 02, 04, todos |
| DEC-089 | Corte comercial y servicios de LAG | Electricidad, gas y prepago de LAG se cortan tras el cierre de O7 con 2 ciclos de paralelo aprobados; otros servicios que aparezcan en el perfilado, al cierre de la ola de su vertical; corte administrativo y apagado de ProCoop en O11 (DEC-068) | T07, M07, 00 |
| DEC-090 | Formato del `type` de errores RFC 9457 | `type` relativo `/problems/<módulo>/<código>` resuelto contra el portal de desarrolladores de T10; reemplaza la forma `https://goodapps.ar/errors/...` de M01 | T08, M01, T07, T10, M06 |
| DEC-091 | Tokenización de tarjetas y alcance PCI DSS | GoodApps nunca recibe ni guarda PAN, vencimiento ni CVV (alcance SAQ A); el débito con tarjeta guarda solo token opaco, marca y últimos 4; procesadoras por archivo solo con número de adherente; los PAN de ProCoop no se migran (identificador existente, tokenización masiva del proveedor o re-adhesión) | M07, T06, T07, T08, T05, M19 |
| DEC-092 | Cierre de brechas del modelo de amenazas | PDF con render aislado; CA privada para certificados del agente (90 días, renovación automática); tenant de webhooks por `endpointKey`; extracción ProCoop solo saliente y cifrada; credenciales heredadas regeneradas; DEK y colecciones globales alineadas con T05; contraseña socio 10 / personal 12, máximo 128; retiro de dominios propios; momento del pentest; semilla de tenants de prueba desde O0 | T08, T06, T07, T01, T05 |
| DEC-093 | Factura agrupada y LQSP (PA-FIS-23) | La factura agrupada no mezcla la liquidación de servicios públicos (LQSP) con la factura común: un documento por tipo de comprobante; dentro de la LQSP solo los conceptos accesorios que el tenant declare con el contador. Corrige RN-FAC-040 | M05, M06 |
| DEC-094 | Vía de autorización de la LQSP (PA-FIS-24) | Se mantiene CESP separado del CAEA; la norma y el efecto de las RG 5003 y 5866/2026 quedan para el contador | M06, M05 |
| DEC-095 | Obligaciones propias de la cooperativa (PA-FIS-25) | Registro genérico en M06 de obligaciones y exenciones propias del tenant como contribuyente, sin precarga de normas; M17 provee la base de capital y M15 contabiliza | M06, M17, M15 |
| DEC-096 | Varias entidades jurídicas: alcance completo (completa DEC-064) | `legalEntityId` en membresías de asociados, centros de costo, alcance de roles y auditoría; ámbito `legalEntity` en los parámetros | M17, M15, T02, T04, T05 |
| DEC-097 | Persona única en todos los maestros | `personId` obligatorio en proveedores, vendedores, choferes y profesionales, con alta asistida de M01 y control de duplicados. Cambia RN-CMP-001 | M12, M11, M18, M01, T07 |
| DEC-098 | Origen de las sucursales en la migración | Las sucursales se derivan de `PTOVENTA.SUC_COM` y las confirma la cooperativa; RF-CFG-142 deja de citar `EMPRESAS` y `CAJASJP` | T04, T07 |
| DEC-099 | Personas migradas sin documento | Estado `documentPending`, fuera del control de duplicados por documento, con tarea de regularización y sin comprobantes que exijan identificarlas por documento | T07, M01, M05 |
| DEC-100 | Verificador de integridad referencial | Proceso nocturno por tenant que informa referencias rotas sin corregirlas, con bandeja y alerta; reemplaza la propuesta de claves foráneas, incompatible con DEC-001 | T05, T08 |
| DEC-101 | Cajas sin rendir en la posición de tesorería | Línea separada "en cajas sin rendir" en la posición diaria de M14, leída del servicio de M07; no se suma a lo rendido | M14, M07 |
| DEC-102 | Uso del suministro en la alícuota de IVA (PA-FIS-26) | Condición opcional de `vatRateMatrix`, desactivada por defecto hasta que confirme el contador | M06, M01 |
| DEC-103 | Supresión de secretos en la migración (amplía DEC-091 y DEC-092) | Más credenciales que no se migran y escaneo previo de tarjetas (Luhn) y credenciales que bloquea la migración hasta clasificar la columna | T07, T08 |
| DEC-104 | Correcciones internas del contraste | Correcciones sin cambio de alcance (`USERS_AREA`, `RESPONSA`, `PROD_SER`, `TIPO_FAC`, prorrateo de M04, `numberSequences`, `recordLinks`, IVR, tablas de M07) | M01, M04, M05, M07, M08, T04, T06, T07, T09 |
| DEC-105 | Fórmulas en tarifas | Se mantienen las fórmulas con preferencia declarativa: justificación obligatoria por regla e informe por tenant de reglas con fórmula | M04 |
| DEC-106 | Tope de vencimientos por comprobante | De 1 a 4 por defecto; el tope es parámetro del tenant, validado contra los formatos de código de barras y los layouts de los entes. Amplía RF-FAC-086 | M05, M07 |
| DEC-107 | Comprobante rechazado por ARCA (reemplaza DEC-035 en ese punto) | Vuelve a borrador y libera su número; los posteriores sin CAE se renumeran desde el último autorizado; nada se imprime, envía ni publica sin CAE, CAEA informado o CESP; auditoría de cada número | M05, M06, M07 |
| DEC-108 | GestionApps como sistema base | No es fuente hoy por falta de información; posible fuente a analizar en el futuro (§2.3) | 00 |

---

## 4. Alcance funcional

### 4.1 Soluciones (BASE §105) y su materialización

| Solución | Módulos/anexos que la materializan |
|---|---|
| ERP | M01 PER, M02 CAT, M03 MED, M04 TAR, M05 FAC, M06 FIS, M07 COB, M08 MOR, M11 VEN, M12 CMP, M13 STK, M14 TES, M15 CON, M16 SUE, M17 INS, M18 SOC |
| CRM | M09 CRM, M10 TEC, T09 COM |
| Landing y autogestión | M19 POR, T03 UXD, T09 COM |
| Plataforma SaaS | T01 PLA, T02 IAM, T04 CFG, T08 NFR |
| Cobranza | M07 COB, M08 MOR |
| Pasarelas | M07 COB + T06 INT |
| Liquidación de impuestos | M06 FIS (+ M15 CON para regímenes contables) |
| APIs | T10 BIA, T06 INT |
| Soporte transversal | T05 DAT, T07 MIG, T11 WFL |

### 4.2 Servicios cubiertos (todos configurables por tenant)

| Familia | Servicios | Particularidades | Ola |
|---|---|---|---|
| TIC | Internet (fibra, inalámbrico, cable), telefonía fija/IP con tasación de CDR, TV (cable/IPTV), servicios de datos | Aprovisionamiento (MikroTik/Radius/OLT), equipos en comodato, planes y velocidades | Internet O3–O6; telefonía y TV O10 |
| Medidos | Electricidad (incl. generación distribuida, grandes usuarios, demanda, factor de potencia), agua, gas, cloacas | Medidores, rutas, lecturas, tramos, cargos con fórmulas, reguladores, compra de energía | O7 |
| Fijos/abonos | Sepelio, cementerio parque, ambulancia/emergencias, banco de sangre, seguros/adhesiones, cuotas sociales | Grupo familiar, adherentes, carencias | O10 (cuota social O2–O4) |
| Sociales y otros | Planes de vivienda, salud, actividades, ventas de productos, fabricación (postes, bloques u otros), traslados y flota | Contratos, cuotas, órdenes de producción | O10 |

### 4.3 Correspondencia de los 29 módulos de ProCoop (DFA) con los anexos

Ningún módulo de ProCoop se pierde. Se reagrupan para que cada entidad tenga un único dueño de datos (ARQ-01). La trazabilidad línea por línea está en la sección 22 de cada anexo.

| DFA | Módulo ProCoop | Prioridad ProCoop | Anexo(s) CoopApps | Ola |
|---|---|---|---|---|
| M1 | Plataforma, seguridad y auditoría | A | T01 PLA, T02 IAM | O0–O1 |
| M2 | Parámetros y tablas maestras | A | T04 CFG, T04b (1.536 parámetros) | O1 |
| M3 | Personas, titulares y cuentas | A | M01 PER | O2 |
| M4 | Catálogo de servicios, categorías y conexiones | A | M02 CAT | O2 |
| M5 | Medidores y equipos de medición | A | M03 MED | O7 (equipos TIC en O3 vía M13) |
| M6 | Lecturas, consumos y telemedición | A | M03 MED | O7 |
| M7 | Cuadros tarifarios y motor de cálculo | A | M04 TAR | O4, O7 |
| M8 | Facturación de servicios y comprobantes electrónicos | A | M05 FAC, M06 FIS | O4 |
| M9 | Cuenta corriente del titular | A | M07 COB | O5 |
| M10 | Cobranza: cajas, medios de pago y entes recaudadores | A | M07 COB, T06 INT | O5 |
| M11 | Gestión de mora y corte | A | M08 MOR | O6 |
| M12 | Financiación y planes de pago | B | M08 MOR | O6 |
| M13 | Ventas, presupuestos y punto de venta | B | M11 VEN | O4–O8 |
| M14 | Técnica: factibilidades, órdenes de trabajo y reclamos | B | M10 TEC (reclamos: M09 CRM) | O3 |
| M15 | Redes e infraestructura (GIS) | C | M10 TEC | O3, O7 |
| M16 | Compras y proveedores | B | M12 CMP | O8 |
| M17 | Stock, bienes de uso, RMA y fabricación | B | M13 STK | O3 (serializado), O8, O10 |
| M18 | Tesorería y bancos | B | M14 TES | O8 |
| M19 | Contabilidad | B | M15 CON | O5 (núcleo), O8 |
| M20 | Sueldos y personal | C | M16 SUE | O9 |
| M21 | Atención: mesa de entradas, turnero y comunicaciones | B | M09 CRM, T09 COM | O2–O3, O10 |
| M22 | Actividades y tareas internas | C | M09 CRM, T11 WFL | O1–O2, O10 |
| M23 | Traslados y flota | C | M18 SOC | O10 |
| M24 | Gestión institucional | C | M17 INS | O10 |
| M25 | Servicios sociales y otros servicios | C | M18 SOC | O10 |
| M26 | Autogestión del socio: portal y app | B | M19 POR | O2+ |
| M27 | App móvil de campo | B | M10 TEC (técnico), M03 MED (lecturista), M07 COB (cobrador), T03 UXD (AppShell) | O3, O5, O7 |
| M28 | Reportes, tableros y exportaciones | B | T10 BIA (+ sección 15 de cada anexo) | O1–O11 |
| M29 | Integraciones externas | A/B | T06 INT | O0–O11 |

Las prioridades A/B/C de ProCoop no excluyen nada (DEC-007): solo influyen en la ola.

### 4.4 Exclusiones

No hay exclusiones funcionales (DEC-007). Lo único que no se replica son las **deudas técnicas y de seguridad de ProCoop**, que se reemplazan por la mejora indicada en cada anexo:

- contraseñas reversibles;
- usuario SQL compartido;
- secretos hardcodeados;
- una base de datos por cooperativa;
- sincronización con MySQL externa para CoopOnline;
- instalación local y actualizaciones manuales;
- menú construido por reflexión;
- parámetros numéricos sin semántica.

---

## 5. Arquitectura y stack tecnológico

Norma vigente para implementación con GoodApps: **DEC-111**, **DEC-112**, **DEC-113**, **DEC-117**. Detalle y checklist documental: `06-impacto-adaptacion-stack-goodapps.md`. Modelo físico: `07-modelo-relacional-azure-sql.md`.

### 5.1 Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Backend | **C# / .NET 10**, ASP.NET Core | Monolito modular; servicios de dominio; acceso con **EF Core** |
| Validación | **Zod** en front; validación en API alineada a contratos | Esquemas compartidos donde aplique; errores RFC 9457 |
| Base de datos | **Azure SQL** (base compartida multitenant) | **PK/FK/constraints**; transacciones para operaciones económicas; dinero en `decimal` |
| Colas y jobs | **Azure Queue Storage** + workers; **Redis** donde aplique | Facturación masiva, integraciones, notificaciones, reportes, importaciones |
| Eventos | Outbox transaccional + despachador a colas | Catálogo de eventos y jobs en T11; infraestructura en T01 |
| Archivos | **Azure Blob** privado; URL firmadas de corta duración | Facturas PDF, adjuntos, fotos de campo, exportaciones |
| Frontend admin | **Vite, React 19, TypeScript**, Tailwind 4, shadcn/Radix, TanStack Query, zustand, react-hook-form | Comportamiento y shells según T03 (DEC-113) |
| PWA / Landing | React 19 + Vite; PWA instalable; offline con cola idempotente | Socio, empleado, técnico, lecturista, cobrador; landing pública (M19) |
| Identidad | **OpenIddict** | Sesiones, tokens, 2FA según T02 |
| API | **OpenAPI** generado desde código; contrato de diseño en GACAC (entregables) | Rutas admin, plataforma, público, ext |
| Secretos | Bóveda con cifrado por sobre y **Azure Key Vault** (DEC-074 alineado a Azure) | ARCA, pasarelas, bancos, mensajería por tenant (T06) |
| Firma | Firma electrónica con OTP; firma digital con proveedor licenciado (DEC-078) | T11 |
| Observabilidad | **Application Insights**, logs estructurados, OpenTelemetry | `tenantId`, `requestId`, `userId` (T08) |
| Pruebas | Unitarias, integración con **Azure SQL** (local/container), contrato, e2e Playwright, carga | Aislamiento multitenant en CI obligatorio (T08) |
| Despliegue | **Microsoft Azure** — Container Apps en red privada (DEC-112); local con contenedores | T01; transferencia de datos según AAIP (DEC-062 actualizado con región Azure acordada) |

### 5.2 Estructura de referencia (detalle en T01 y repo GoodApps)

```
coodo/  (referencia GoodApps)
  src/
    Api/                       # ASP.NET Core: /api, admin, platform, public, ext
    Modules/<cod>/             # per, cat, med, tar, fac, … — dueño de esquema/tablas
      Domain/  Application/  Infrastructure/  Api/
    Workers/                   # consumidores de colas Azure
  apps/
    admin/                     # React — AdminShell (T03)
    pwa/                       # React PWA — AppShell
    landing/                   # sitio público por tenant
  packages/                    # contratos, enums, capacidades, SDK conectores (T06)
  infra/                       # IaC Azure, scripts migración (T07)
  docs/                        # análisis exportado desde GACAC
```

### 5.3 Reglas de arquitectura

| ID | Regla |
|---|---|
| ARQ-01 | Un módulo solo escribe en sus tablas/esquema; para datos de otro módulo usa su servicio público o reacciona a sus eventos. |
| ARQ-02 | Toda operación económica: transacción SQL + evento outbox + `Idempotency-Key` + auditoría. |
| ARQ-03 | Ningún proceso masivo corre en el request HTTP: se encola en un job con progreso, reanudable e idempotente. |
| ARQ-04 | Toda consulta lleva `TenantId` (filtro global EF); jobs, archivos, caché, exportaciones, búsquedas e IA también se aíslan por tenant (DEC-110). |
| ARQ-05 | Configuración tipada y versionada (T04), nunca constantes mágicas en el código. |
| ARQ-06 | Integraciones solo vía conectores (T06) con credenciales en bóveda. |
| ARQ-07 | UI sin textos fijos: claves de diccionario (T03). |
| ARQ-08 | La IA solo propone; toda acción con efecto requiere confirmación humana y queda auditada. |

---

## 6. Multitenancy y plataforma SaaS (resumen; detalle en T01 y T02)

- **Tenant** = cooperativa. Tenant especial `PLATFORM` para el operador SaaS.
- **Identificación**: subdominio `<slug>.dominio` o código de cooperativa en el pre-login. Tras el login, el `tenantId` sale del JWT y nunca de un header manipulable.
- **Identidad común con pertenencias**: una persona tiene una sola identidad de acceso y pertenencias privadas por tenant (AGR-006). Por ejemplo, puede ser empleada en la cooperativa A y socia en la B. La selección de ámbito es explícita.
- **Ciclo de vida del tenant** (AGR-004): Preparación → Prueba → Listo para habilitar → Operativo → Suspendido administrativo → Cierre/salida. Cada paso tiene checklist de habilitación por capacidad.
- **Licenciamiento en capas** (CNX):
  1. licencia de módulos contratados por la plataforma;
  2. activación por el tenant;
  3. RBAC por rol/perfil;
  4. alcance de datos.
- **Soporte**: acceso temporal, consentido y auditado (AGR-034).
- **Ambientes**: producción y prueba por tenant con datos anonimizados (AGR-035).

---

## 7. Actores, roles y modelo de permisos (resumen; matriz completa en T02)

### 7.1 Modelo

- **Capability** `modulo.recurso.accion`. Las acciones estándar son `ver`, `crear`, `editar`, `anular`, `aprobar`, `exportar` y `configurar`, más las propias de cada módulo.
- **Rol funcional** = conjunto de capabilities. **Perfil de pantallas** = qué ítems de menú ve el usuario (BASE §45). El acceso efectivo es la **intersección** de cuatro filtros:
  1. licencia del tenant;
  2. activación del módulo;
  3. rol;
  4. alcance de datos.
- **Alcance de datos**: tenant / sucursales / puntos de venta / zonas / servicios / cuadrillas / depósitos / propios. Reemplaza USERS_AREA, USERS_DEPOSITO y PTO_VTA de ProCoop.
- **Controles adicionales**:
  - denegación por defecto;
  - separación de funciones;
  - autorización de supervisor en el momento o diferida (reemplaza AUTORIZACIONES de ProCoop);
  - franja horaria por perfil.

### 7.2 Catálogo de roles

Catálogo vigente de T02 §4.1 (CTR-IAM-15): los roles de tenant y comunidad son plantillas de plataforma versionadas que cada cooperativa instancia, clona y ajusta (PA-IAM-09); los nombres visibles salen del diccionario. La matriz rol × capability está en T02 §4.3–§4.4.

| Código | Espacio | Rol | Responsabilidad principal | MFA |
|---|---|---|---|---|
| P-SUP | Plataforma | Superadministrador de plataforma | Tenants, licencias, roles plantilla, usuarios de plataforma, emergencias | Obligatorio, sin SMS |
| P-ADM | Plataforma | Administrador de operaciones de tenants | Alta asistida, configuración base, copia de servicios, migraciones | Obligatorio, sin SMS |
| P-COM | Plataforma | Comercial de plataforma | Contratos SaaS, packs, licencias (sin datos operativos) | Obligatorio |
| P-SOP1 | Plataforma | Soporte plataforma nivel 1 | Tickets, diagnóstico sin datos; solicita acceso temporal en modo observar | Obligatorio |
| P-SOP2 | Plataforma | Soporte plataforma nivel 2 / ingeniería | Acceso temporal observar u operar, acotado y aprobado | Obligatorio, sin SMS |
| P-SEC | Plataforma | Seguridad y auditoría de plataforma | Auditoría global, alertas, incidentes, revisión de accesos | Obligatorio, sin SMS |
| P-OPS | Plataforma | Operaciones técnicas (SRE) | Salud, colas, ambientes, backups (sin datos operativos) | Obligatorio, sin SMS |
| T-ADM | Tenant | Administrador de la cooperativa | Configuración, usuarios, roles, perfiles, políticas, publicación | Obligatorio |
| T-USR | Tenant | Administrador de usuarios y seguridad (opcional) | Alta/baja de usuarios y asignaciones sin operar el negocio (actor CU-29) | Obligatorio |
| T-GER | Tenant | Gerente | Tableros, aprobaciones de alto nivel, lectura general | Obligatorio |
| T-FAC | Tenant | Facturación | Ciclos, lotes, comprobantes, NC/ND, tarifas (propuesta) | Obligatorio |
| T-CAJ | Tenant | Cajero | Caja del turno, cobros, arqueo, ventas de mostrador | Según política (PRM-IAM-020) |
| T-CBR | Tenant | Cobrador (campo) | Cobranza domiciliaria de su cartera, rendición | Según política |
| T-TES | Tenant | Tesorero / Financiero (MT-006) | Bancos, valores, conciliación, pagos, pasarelas | Obligatorio |
| T-CON | Tenant | Contador / Contable (MT-006) | Plan de cuentas, asientos, cierres, fiscal, regímenes | Obligatorio |
| T-CMP | Tenant | Compras | Solicitudes, órdenes de compra, proveedores | Obligatorio |
| T-DEP | Tenant | Depósito | Stock, remitos, equipos serializados, RMA | Según política |
| T-TEC | Tenant | Técnico (campo) | Órdenes asignadas, instalación, firma, fotos, offline | Según política |
| T-LEC | Tenant | Lecturista (campo) | Rutas asignadas y capturas de lectura, offline | Según política |
| T-STE | Tenant | Supervisor técnico | Agenda, cuadrillas, factibilidad, redes/GIS, aprovisionamiento | Obligatorio |
| T-SCM | Tenant | Supervisor de consumos (BASE §39.6) | Validación y corrección justificada de consumos | Obligatorio |
| T-ATE | Tenant | Comercial / Atención al socio | Personas, solicitudes, reclamos, convenios, ventas de mostrador | Según política |
| T-SAT | Tenant | Supervisor de atención | Asignación, derivación, SLA, escalamiento, autorizaciones de atención | Obligatorio |
| T-RRHH | Tenant | RRHH / Liquidador | Legajos, novedades, liquidaciones, recibos | Obligatorio |
| T-SEC | Tenant | Secretaría institucional | Asociados, capital, asambleas, actas | Obligatorio |
| T-COM | Tenant | Editor de comunidad / Moderador (USR-NOT-A) | Muro, novedades, encuestas, moderación | Según política |
| T-SOC | Tenant | Operador de servicios sociales y salud | Sepelio, cementerio, vivienda, ambulancias, banco de sangre (datos sensibles) | Obligatorio |
| T-CJO | Tenant | Consejero | Lectura institucional y agregada, votaciones del consejo | Obligatorio |
| T-SIN | Tenant | Síndico / Auditor (solo lectura) | Lectura amplia + auditoría, sin acciones de escritura | Obligatorio |
| C-SOC | Comunidad | Socio titular | Autogestión de sus cuentas, servicios, pagos, reclamos, comunidad | Opcional + step-up (PA-IAM-03) |
| C-REP | Comunidad | Representante / autorizado | Acciones delegadas por relación vigente (AGR-007) | Opcional + step-up |
| C-ADH | Comunidad | Adherente / grupo familiar | Consulta limitada de servicios sociales propios | Opcional |
| C-VIS | Comunidad | Visitante registrado | Noticias, solicitud de alta, consultas públicas, vinculación de cuentas | Opcional |
| C-EMP | Comunidad | Empleado en portal | Recibos de sueldo, firma de recibo, novedades RRHH | Opcional + step-up para firma |
| C-PRV | Comunidad | Proveedor (portal de proveedores) | Solo por invitación individual del tenant (rol `supplier`, PA-CMP-05): sus órdenes de compra, carga de facturas y remitos, estado de pagos y retenciones propias (M12 RF-CMP-015, RF-CMP-112) | Opcional + step-up para datos bancarios |
| S-SYS | Técnico | Sistema / worker | Jobs internos con identidad técnica y capabilities por job | No aplica |
| S-API | Técnico | Cliente API (integración externa) | Scopes `apiExposable` de `/api/v1/ext` | Credencial técnica |
| S-BOT | Técnico | Bot / asistente IA | Actúa con capabilities mínimas propias o **en nombre** de un usuario, nunca más que él | No aplica |
| S-KSK | Técnico | Dispositivo kiosco/tótem/turnero | Operaciones públicas del kiosco; salida del modo kiosco con autenticación de staff | Enrolamiento de dispositivo |
| S-AGT | Técnico | Agente de hardware local | Impresoras fiscales, lectores, balanzas; credencial de dispositivo por puesto | Enrolamiento de dispositivo |

Total: 40 roles.

---

## 8. Aplicaciones y espacios de trabajo

| App | Usuarios | Tecnología/Layout | Rutas API | Contenido |
|---|---|---|---|---|
| **Admin web** (`apps/admin`) | Personal de la cooperativa | AdminShell, tema oscuro, denso | `/api/admin/*` | Todos los módulos de gestión M01–M18, configuración, reportes |
| **Plataforma** (rutas `meta.platformOnly`) | Operador SaaS | AdminShell en modo plataforma | `/api/platform/*` | Tenants, licencias, soporte, salud, catálogo de módulos, tablas comunes (fiscales, índices, geografía) |
| **PWA socio** (`apps/pwa`, rol socio) | Socios, representantes, adherentes | AppShell `.pwa-mod`, branding del tenant | `/api/*` | Cuentas, facturas, pagos, consumos, reclamos, solicitudes, turnos, comunidad, perfil |
| **PWA empleado** (misma PWA, rol empleado) | Personal | AppShell | `/api/*` | Bandeja de tareas, aprobaciones, comunicaciones internas, recibos de sueldo |
| **PWA campo** (misma PWA, roles técnico/lecturista/cobrador) | Personal de campo | AppShell offline-first | `/api/*` | Órdenes de trabajo, lecturas, cobranza, stock en vehículo |
| **Landing** (`apps/landing`) | Público | Layout público con marca | `/api/public/<slug>/*` | Institucional, noticias, servicios, registro, consulta y pago sin login, solicitudes, baja pública (BASE §53) |
| **API terceros** | Sistemas externos | — | `/api/v1/ext/*` | Recursos expuestos con scopes (T10) |
| **Agente local** | Puestos con hardware | Servicio local | Canal seguro con la API | Turnero, impresoras, balanzas, lectoras (T06, M09) |

---

## 9. Mapa del sitio (resumen; mapa completo con rutas y capabilities en T03)

### 9.1 Admin: clusters y grupos

| Cluster | Grupos (anexo) |
|---|---|
| Inicio | Tablero por rol, bandeja de tareas (T11), notificaciones, accesos fijados |
| Socios y cuentas | Personas, titulares, cuentas, inmuebles/domicilios, grupo familiar, documentación (M01) |
| Servicios | Catálogo, planes, categorías, conexiones/suministros, altas/bajas/cambios (M02) |
| Medición | Medidores, rutas, lecturas, validación, telemedición, prepago (M03) |
| Facturación | Tarifas y cuadros (M04), ciclos, lotes, comprobantes, distribución (M05), fiscal (M06) |
| Cobranza | Cuenta corriente, caja, entes, débitos, pasarelas, conciliación (M07) |
| Mora | Instancias, intereses, cortes/reconexiones, convenios, judicial (M08) |
| Atención | Solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot (M09) |
| Técnica | Agenda, órdenes de trabajo, cuadrillas, redes/GIS, obras, aprovisionamiento, telefonía (M10) |
| Ventas | Presupuestos, ventas, POS (M11) |
| Administración | Compras y proveedores (M12), stock y activos (M13), tesorería (M14), contabilidad (M15) |
| Personal | Legajos, liquidaciones, portal del empleado (M16) |
| Institucional | Asociados, capital, asambleas, consejo, INAES (M17) |
| Servicios sociales | Sepelio, cementerio, salud/ambulancias, banco de sangre, vivienda, flota/traslados (M18) |
| Comunidad | Muro, novedades, encuestas, campañas, plantillas, audiencias, moderación (T09) |
| Sitio y portal | Landing, contenidos, configuración del portal (M19) |
| Reportes | Catálogo de reportes, tableros, exportaciones, BI (T10) |
| Configuración | Parámetros, tablas maestras, geografía, diccionario, marca, workflows, integraciones, usuarios y roles, auditoría (T02, T03, T04, T06, T11) |

### 9.2 PWA socio (tabbar)

Tabbar de cinco posiciones con botón flotante (FAB) central, según T03 §10.1.4, RF-UXD-066 y CTR-UXD-12 (mapa del sitio `SM-PWS-001`, `002`, `017` y `026` de T03 §10.8):

1. **Inicio** (`/inicio`): saldo, próximo vencimiento, alertas y novedades.
2. **Cuentas y servicios** (`/servicios`).
3. **FAB "+"** central: por defecto **Pagar** en Inicio y Facturas; su acción cambia por pantalla (`useCreateAction`): "Nueva gestión" en Gestiones, "Contratar" en Servicios, "Vincular cuenta" en Cuentas.
4. **Gestiones** (`/gestiones`): reclamos, solicitudes y turnos.
5. **Comunidad** (`/comunidad`).

**Perfil** no ocupa una posición de la tabbar: se abre desde el avatar de la topbar. El tenant puede reemplazar Comunidad (slot 4 de T03) por configuración (RF-UXD-177), sin otorgar permisos.

*Reemplazado (corrección 05-11-2026):* la lista anterior enumeraba seis destinos (Inicio, Cuentas y servicios, Pagar como FAB, Gestiones, Comunidad y Perfil) para cinco posiciones; se alinea a T03, dueño del mapa del sitio (§9). La tabbar que lista M19 §10 ("Inicio · Servicios · (+) · Facturas · Perfil") no coincidía con T03; *resuelto (cierre de residuales 05-11-2026):* M19 la alineó con RF-POR-180 (Inicio · Cuentas y servicios · (+) · Gestiones · Comunidad, con PAN-POR-105 `/app/comunidad`; PA-POR-20). Antes: "no coincide con T03 y la debe alinear el dueño de M19". El rótulo corto de la posición 2 es "Cuentas" (RN-UXD-006, máximo 12 caracteres; T03 §10.1.4).

El detalle está en M19 y T03.

### 9.3 PWA campo (tabbar)

1. **Hoy**: agenda.
2. **Órdenes / Rutas / Cobranza**, según el rol.
3. **Nuevo** (FAB contextual).
4. **Stock en vehículo**.
5. **Sincronización**.

El detalle está en M10, M03, M07 y T03.

---

## 10. MainLayouts (detalle en T03)

| Layout | Estructura | Comportamiento clave |
|---|---|---|
| **AdminShell** | Topbar (logo del producto, logo del tenant, selector de contexto tenant/sucursal, buscador, Mapa del sitio, accesos fijados, notificaciones, usuario) + menú lateral generado desde `siteMapGroups` + área de contenido | El menú, el mapa del sitio y el editor de roles usan la **misma** declaración; los ítems se filtran por capability. |
| **Página admin** | `AdminStickyHeader` (título, subtítulo, acciones) + `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso) + filtros + `DataTable` + modales `sm/md/lg/xl` | Altas y ediciones en modal; importaciones con `ExcelImportWizard`. |
| **Plataforma** | AdminShell con contexto `PLATFORM` y estética diferenciada | Rutas `meta.platformOnly`. |
| **AppShell (PWA)** | Topbar con marca del tenant + banners (offline, avisos de corte, deuda) + contenido + tabbar con FAB "+" contextual | Phone shell centrado en escritorio. |
| **Listados PWA** | Cards con anatomía fija, 3 skeletons de carga, estados vacíos con acción | Alta siempre en modal desde el FAB. |
| **Landing** | Header con marca + hero + servicios habilitados + noticias + accesos (registro, pagar, reclamos) + footer institucional | Contenido administrado en M19; branding runtime. |

---

## 11. Design system, marca y diccionario (detalle en T03)

- **Admin**: tema oscuro por defecto con tokens CNX §4.1, tema claro opcional, tipografías Space Grotesk (títulos), IBM Plex Sans (texto) e IBM Plex Mono (importes, lecturas y códigos). Estados `ok/warn/bad`.
- **PWA**: piel `.pwa-mod` con los tokens CNX §3.1, fondo con glow, tema claro/oscuro y tipografía Sora.
- **Marca por tenant en runtime**:
  - `applyBrandingCssVars`;
  - `applyTenantPwaIdentity`;
  - manifest dinámico y `theme-color`;
  - logos jerárquicos, splash e imágenes por canal.
- **Componentes base**:
  - generales: `DataTable`, `ExcelImportWizard`, Toasts, `ConfirmDialog`;
  - de dominio: `AudiencePicker`, `MoneyInput`/`MoneyDisplay`, `DateRange`, `AddressPicker` con mapa, `EntityPicker`, `StatusBadge`;
  - de soporte: `AuditTimeline`, `FileUploader` privado, `SignaturePad`, `OfflineBanner`, `KpiGrid`.
- **Accesibilidad**: WCAG 2.2 AA (AGR-032).
- **Diccionario** (BASE §65):
  - claves `dict:<clave>` con fallback de plataforma;
  - variables y pluralización;
  - variantes por canal;
  - publicación versionada por tenant.
  - Reemplaza los textos VAR_PMOVIL de CoopOnline.

### 11.1 Guía operativa para equipos de desarrollo

Para implementar **cualquier** pantalla o flujo sin reinterpretar T03 en cada módulo, usar el apartado exclusivo **[`GUIA-UI-UX-DESARROLLO.md`](GUIA-UI-UX-DESARROLLO.md)**:

- jerarquía documental (esta guía → T03 → anexo del módulo);
- shells obligatorios por app;
- checklist por `PAN-*`;
- reglas no negociables, catálogo de componentes, accesibilidad, anti‑patrones;
- ayuda (`ScreenHelp` vs FAQ de portal/bot);
- stack React (DEC-113) sin alterar las reglas de experiencia.

T03 sigue siendo la fuente normativa de tokens, RF-UXD-* y mapa del sitio; la guía condensa lo que todo PR de front debe cumplir.

### 11.2 Identidad visual del producto (DEC-119)

Naming (DEC-109), paleta, logotipos del **producto** CoopApps, checklist de entrega y semilla del tenant `PLATFORM`: **[`08-identidad-marca-coopapps.md`](08-identidad-marca-coopapps.md)** y archivos en **`docs/brand/coopapps/`**. No confundir con la marca editable de cada cooperativa (`tenantBrandings`, T03 §7.B.1).

---

## 12. Índice de módulos y dueños de datos

| Anexo | Código | Nombre | Dueño de (entidades principales) | Olas |
|---|---|---|---|---|
| T01 | PLA | Plataforma SaaS | tenants, licencias, contratos SaaS, moduleCatalog, ambientes, accesos de soporte; infraestructura de eventos `outboxEvents`, `inboxReceipts`, `jobRuns` (T05 COL-PLA-24) | O0–O1 |
| T02 | IAM | Identidad, roles, auditoría | identities, memberships (el usuario del personal es `memberships.staff`; no existe colección `users`), roles, perfiles, sesiones, auditLogs (cambios) + auditAccess, auditReads, auditMessages, auditAi (CTR-IAM-16) | O0–O1 |
| T03 | UXD | UX, marca, diccionario | branding, dictionaryEntries, siteMap | O0–O1 |
| T04 | CFG | Configuración y maestros | configVersions, parameters, legalEntities (personas jurídicas del tenant, DEC-064; `legalEntityId` en documentos económicos desde O0), tablas maestras, geografía, calles, calendarios, índices | O0–O1 |
| T05 | DAT | Modelo de datos canónico | (no es dueño y no tiene colecciones nuevas propias: consolida 1.108 filas de colecciones de los demás anexos (antes 1.104), de las que se crean 1.057 (antes 1.053; 39 en la base analítica `bi_*`); en el cierre de la corrección de inconsistencias, 05-11-2026 se suman `costCenterModels` (M15), `bundleSubscriptions` (M02), `fiscalClasses` (M06) y `collectionAccountingGroups` (M07), con dueño, clasificación, índices y ola; nombres canónicos y contraposiciones CTR-DAT; prevalece sobre los nombres de esta tabla) | O0 (convenciones) |
| T06 | INT | Integraciones | connectors, connectorConfigs, integrationSecrets (bóveda, DEC-074; antes citada como `vaultSecrets`), integrationLogs, webhooks | O0–O11 |
| T07 | MIG | Migración ProCoop | migrationRuns, mappings, legacyIds | O1, O11 |
| T08 | NFR | No funcionales y seguridad | (requisitos; consentimientos y retención compartidos con T09/T02) | O0+ |
| T09 | COM | Comunidad y comunicaciones | posts, comments, reactions, news, surveys, audiences, templates, campaigns, notifications, preferences | O2+ |
| T10 | BIA | Reportes, BI, APIs | reportDefinitions, reportRuns, dashboards, apiClients | O1–O11 |
| T11 | WFL | Workflow, eventos, documentos | catálogo de eventos `eventTypes` (668 IDs EVT, antes 658, T11 §12.10; con alias) y de jobs (506 IDs JOB); workflows, tasks, approvals, documents, documentTemplates, perfiles de firma (DEC-078). La colección `outboxEvents` la provee T01 | O0–O2 |
| T12 | SRV | Fichas verticales por servicio (DEC-073), en dos partes: `T12-SRV-fichas-verticales-servicios-parte1.md` (INT, TEL, TV, ELE, AG, CLO, GAS, ALU) y `-parte2.md` (OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR) | (no es dueño; recorre cada servicio de punta a punta referenciando M02–M19; sus huecos van a `05-registro-huecos.md`) | — |
| M01 | PER | Personas, titulares, cuentas | persons, accounts, properties, addresses, relationships | O2 |
| M02 | CAT | Catálogo de servicios | services, products, plans, categories, serviceContracts/connections | O2 |
| M03 | MED | Medición y consumos | meters, routes, readings, consumptions | O7 |
| M04 | TAR | Tarifas y motor de cálculo | tariffs, tariffVersions, concepts, formulas | O4, O7 |
| M05 | FAC | Facturación | billingCycles, billingBatches, invoices, invoiceLines | O4 |
| M06 | FIS | Fiscal e impuestos | taxRules, taxPadrons, fiscalPoints, caeRequests, regimes | O4, O8 |
| M07 | COB | Cuenta corriente y cobranza | ledgerEntries, payments, receipts, cashboxes, collectionAgents, debits | O5 |
| M08 | MOR | Mora y financiación | arrearsCases, interestRuns, cutoffOrders, agreements, guarantees | O6 |
| M09 | CRM | CRM y atención | requests, claims, tickets, intake, queues/turns, channels | O2–O3, O6 (IA y omnicanal, DEC-056), O10 |
| M10 | TEC | Técnica y campo | workOrders, crews, schedules, networkAssets, provisioning, telephony | O3, O10 |
| M11 | VEN | Ventas y POS | quotes, sales, posSessions | O4–O8 |
| M12 | CMP | Compras y proveedores | suppliers, purchaseRequests, purchaseOrders, supplierInvoices (incluye la factura del mayorista de energía y gas), liquidación de derechos de señales | O3 (dos RF de soporte), O8 |
| M13 | STK | Stock, activos, fabricación | items, warehouses, stockMoves, serials, fixedAssets, productionOrders | O3 (serializado), O8, O10 |
| M14 | TES | Tesorería y bancos | bankAccounts, treasuryMoves, checks/valores, reconciliations | O5, O8 (DEC-059) |
| M15 | CON | Contabilidad | chartOfAccounts, fiscalYears, costCenters, journalEntries, postingRules | O5 (núcleo), O8 |
| M16 | SUE | Personal y sueldos | employees, payrollConcepts, payrollRuns, payslips | O3 (legajo mínimo), O8 (importación externa), O9 (DEC-058) |
| M17 | INS | Institucional | members (asociados), capitalMovements y capitalBalances, assemblies, boardMinutes | O5 (capital mínimo, DEC-019), O10 |
| M18 | SOC | Servicios sociales y flota | socialPlans, adherentes y beneficiarios (`serviceDependents`, `serviceBeneficiaries`, dueño único, DEC-071/DEC-086), housingPlans y housingPrices, transportTrips, burialRights, contractRegistrations, vehicles | O4 (adherentes y billing-inputs, DEC-071), O10 |
| M19 | POR | Landing y portal del socio | sitePages, portalConfig, selfServiceSessions | O2+ |

El modelo de datos completo y la asignación de cada colección a su dueño se consolida en `anexos/T05-DAT-modelo-datos.md`. Esta tabla resume las entidades principales; ante cualquier diferencia de nombre o de dueño, prevalece el catálogo de T05 (§7) con sus contraposiciones CTR-DAT (§20).

---

## 13. Convenciones transversales de desarrollo

Son obligatorias para todo código generado. Detalle en `_GUIA-REDACCION-ANEXOS.md` §5.

| Tema | Convención |
|---|---|
| Idioma | Código, colecciones, campos y endpoints en inglés camelCase; UI en español vía `dict:<clave>` |
| Documento base | `tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`; según el caso `status`, `validFrom`/`validTo`, `recordedAt` y `deletedAt` (nunca en documentos económicos) |
| Dinero | `Decimal128` + `decimal.js`; precisión y redondeo por concepto (AGR-011); `currency` (ARS por defecto) |
| Fechas | UTC almacenado; zona del tenant (`America/Argentina/Cordoba` por defecto); visible `dd-mm-yyyy` |
| Capabilities | `modulo.recurso.accion` + alcance |
| API | `/api`, `/api/admin`, `/api/platform`, `/api/public/<tenantSlug>`, `/api/v1/ext`; paginación `{items,total,page,size}`; errores RFC 9457 con `requestId`; `Idempotency-Key` |
| Eventos | `<mod>.<entidad>.<pasado>` vía outbox |
| Jobs | `<mod>:<proceso>`, idempotentes, reanudables, con progreso |
| IDs de documentación | RF-, RN-, RNF-, CU-, PAN-, API-, EVT-, JOB-, PRM-, PA-, CTR- + `<COD>-NNN` |
| Prioridad / estado | Núcleo / Estándar / Extensión · Informado / Adoptado / A validar / Reemplazado por / Descartado |
| Pruebas | Toda funcionalidad con pruebas de permisos negativos y de aislamiento de tenant |

---

## 14. Requisitos no funcionales (resumen; detalle medible en T08)

| Área | Meta resumida |
|---|---|
| Seguridad | OWASP ASVS nivel 2; 2FA para el personal; bóveda de secretos; cifrado en tránsito y en reposo; rate limiting; uploads seguros; sin secretos en el código |
| Aislamiento | Pruebas automáticas de aislamiento multitenant en CI que bloquean el merge |
| Privacidad | Ley 25.326: consentimientos, finalidad, derechos de acceso/rectificación/supresión, retención y anonimización |
| Rendimiento | Pantallas interactivas p95 ≤ 800 ms (DEC-063); facturación masiva por job con progreso y reanudación (50.000 suministros ≤ 60 min, T08 PA-NFR-04) |
| Capacidad | Tenant estándar 25.000 suministros y grande 150.000; diseño para 100 tenants y hasta 300 sin rediseño (DEC-075) |
| Disponibilidad | 99,5 % mensual comprometido; RPO ≤ 15 min; RTO ≤ 4 h por tenant y ≤ 8 h plataforma completa; soporte lunes a viernes 8–18 con P1 24×7 (DEC-063) |
| Alojamiento | **Microsoft Azure** (DEC-112); cláusulas de transferencia según la AAIP (DEC-062); GoodApps es prestador de tratamiento, art. 25 Ley 25.326 (DEC-076) |
| Secretos | Bóveda con cifrado por sobre y clave maestra en **Azure Key Vault** (DEC-074) |
| Observabilidad | Logs estructurados con tenant/request, métricas, trazas y alertas de jobs e integraciones |
| Exactitud | Cero diferencias de centavos entre comprobante, cuenta corriente y contabilidad |
| Offline | PWA de campo operativa sin conexión, con cola idempotente |
| Accesibilidad | WCAG 2.2 AA |

---

## 15. Plan de olas (resumen de **contenido**; detalle en `03-plan-de-olas-y-prompts.md`, referencia histórica DEC-118)

| Ola | Contenido | Hito de salida |
|---|---|---|
| O0 | Fundaciones: monorepo, Docker, CI, librerías compartidas, shells, design system, auth básica, tenancy, auditoría, outbox/BullMQ, almacenamiento, diccionario/branding base, notificaciones base, entidades jurídicas del tenant y sucursales (`legalEntities` y `branches`, REQ-DEC-064 cubierto por RF-CFG-134..138 y 140; `legalEntityId` obligatorio por RF-CFG-136; `workstations` en O1 y perfil fiscal `fiscalProfiles` de M06 en O4) | Un tenant de demo con login, menú vacío y pruebas de aislamiento verdes |
| O1 | Plataforma e IAM completos, configuración versionada, parámetros, maestros, geografía, workflow de autorizaciones, expediente documental | Alta asistida de una cooperativa con usuarios, roles y configuración publicada |
| O2 | Personas/cuentas, catálogo de servicios, landing, registro y portal base, CRM de solicitudes, comunidad | Un socio se registra y solicita Internet desde la landing |
| O3 | Técnica para Internet: factibilidad, agenda, OT, instalación, comodato, stock serializado, app de campo offline, aprovisionamiento; legajo mínimo de personal (DEC-058) | El servicio queda instalado y activo |
| O4 | Motor tarifario, facturación, ARCA, impuestos básicos; adherentes y sus entradas a facturar (DEC-071) | Primera factura electrónica con CAE |
| O5 | Cuenta corriente, caja, pasarelas prioritarias (DEC-015), débitos, conciliación, tesorería operativa (DEC-059), núcleo contable (DEC-009) y capital social mínimo (DEC-019) | Pago online imputado y asentado |
| O6 | Mora, suspensión/corte/reconexión, convenios, incobrables; IA y omnicanal de atención (DEC-056) | **Piloto Internet completo de punta a punta** |
| O7 | Servicios medidos (electricidad, agua, cloacas, gas, alumbrado), lecturas, telemedición, tarifas medidas, reguladores, obras y contribución por mejoras; migración comercial vigente, paralelo, by-pass y corte comercial por servicio (DEC-089) | Facturación de energía con lecturas; corte comercial de electricidad, gas y prepago de la piloto al cerrar la ola (DEC-089) |
| O8 | ERP administrativo: compras, stock completo, tesorería, contabilidad completa, regímenes informativos; importación de sueldos externos (DEC-058) | Cierre contable mensual |
| O9 | Personal y sueldos | Liquidación mensual con F.931/LSD |
| O10 | Institucional, servicios sociales, flota, telefonía, TV, fabricación, turnero, actividades | Asamblea y servicios sociales operativos |
| O11 | BI, generador de reportes, APIs de terceros, pasarelas restantes, migración repetible e históricos (DEC-089; antes también "paralelo y by-pass", que pasan a O7) | Corte administrativo y apagado de ProCoop en una cooperativa (DEC-068, DEC-089; antes "Corte de ProCoop por etapas en una cooperativa: primero comercial y luego administrativo") |

El plan detallado (versión 1.2 del 10-11-2026; antes 1.1) tiene 172 prompts (más 3 generales) que cubren los 4.213 RF (antes 4.204, versión 1.2: se suman 9 RF de DEC-093 a DEC-108; antes 4.203; se suma RF-POR-180 de M19, Comunidad en la tabbar del socio, en O2, cierre de la corrección de inconsistencias, 05-11-2026) y los 293 RNF de los anexos (antes 292; se suma RNF-NFR-260, DEC-100), cada uno asignado a exactamente un prompt (recontado por script leyendo los anexos; §18 y §19 del plan documentan las reasignaciones y las 16 contradicciones de ola, y §21 y §22 los cambios de las versiones 1.1 y 1.2). Reparto de RF por ola: O0 305, O1 459 (antes 458), O2 617 (antes 614 y 613), O3 319, O4 425 (antes 424), O5 470 (antes 469), O6 244, O7 298 (DEC-089; antes 274), O8 465 (antes 462), O9 163, O10 383, O11 65 (DEC-089; antes 89). Reparto de prompts por ola: O0 21, O1 20, O2 19, O3 13, O4 16, O5 14, O6 11, O7 12 (DEC-089: se suman PRO-O7-11 y PRO-O7-12; antes 10), O8 15, O9 9, O10 14, O11 8 (DEC-089: PRO-O11-07 y PRO-O11-08 quedan reemplazados; antes 10). RNF por ola: O0 144, O1 73 (antes 72), O2 15, O3 9, O4 23, O5 13, O6 2, O7 1 (DEC-089: RNF-NFR-154; antes 0), O8 1, O9 0, O10 6, O11 6 (antes 7). Los 83 RF agregados al resolver los huecos de cobertura (`05-registro-huecos.md`) se asignaron a la ola indicada en el propio RF, sin prompts nuevos; DEC-082 a DEC-087 están reflejadas en los prompts que corresponden, y DEC-093 a DEC-107 en los prompts que cambian (plan §22; DEC-108 no afecta al plan). *Reemplazado (versión 1.0 del plan): 4.120 RF, con O0 299, O1 457, O2 607, O3 315, O4 419, O5 463, O6 241, O7 256, O8 454, O9 161, O10 360, O11 88.* *Reemplazado (corrección 05-11-2026 del plan, §21.5): O5 468 y O11 90; RF-CON-160 empieza en O5 (saldos de apertura) y su migración completa queda como extensión en O11. El total (4.203 RF y 292 RNF) y los prompts por ola no cambian.*

---

## 16. Cómo usar esta especificación con GoodApps

1. **Archivo maestro**: GACAC (`docs/especificacion/`) conserva alcance, RF/RN, pantallas, casos de prueba y trazabilidad.
2. **Export**: por módulo en Markdown al repo GoodApps (`coodo`), con PR y sin PII; pipeline y agentes según acuerdo GoodApps (DEC-118).
3. **Unidad de trabajo**: un módulo o bloque transversal (p. ej. M01 + T02) con su anexo, casos de uso, OpenAPI de diseño y matriz de ayuda (§6.1–6.2 de `06`).
4. **Stack**: implementación según §5 de este documento y `07-modelo-relacional-azure-sql.md`; el **funcional** no se reinterpreta sin nueva DEC.
5. **Definición de terminado** (diseño): criterios de aceptación del anexo; trazabilidad RF/RN; inventario ScreenHelp/FAQ donde aplique; decisión cerrada en `01` si hubo cambio de comportamiento.
6. **Preguntas abiertas**: registrar en `02-preguntas-abiertas.md`; hasta cerrar, rige la opción recomendada.
7. **Checklist de alineación documental**: `06-impacto-adaptacion-stack-goodapps.md` §12.

---

## 17. Registro global de contraposiciones resueltas

| CTR | Fuentes en conflicto | Conflicto | Resolución | Prevalencia |
|---|---|---|---|---|
| CTR-GLB-01 | DFA vs CNX vs BASE §58 | Stack tecnológico | .NET 10, Azure SQL, React (DEC-111, DEC-112, DEC-113) | DEC |
| CTR-GLB-02 | ProCoop/DFA (una base por cooperativa) vs BASE §2 multitenant | Modelo de tenancy | Base única con `tenantId` (DEC-002) | DEC |
| CTR-GLB-03 | DFA (etapas con fechas) vs pedido de olas | Planificación | Olas sin fechas (DEC-006) | DEC |
| CTR-GLB-04 | DFA (Sueldos prioridad C) vs BASE §104 | Alcance de sueldos | En alcance completo SUE-001..014 (O9) | BASE (§104 prevalece) |
| CTR-GLB-05 | BASE (frases tempranas que excluían factura multiservicio) vs BASE §103 | Factura multiservicio | Ambos modos: agrupada multiservicio y separada (FAC-005..012) | BASE más reciente |
| CTR-GLB-06 | DFA (contabilidad tardía) vs integridad económica | Momento de la contabilidad | Núcleo temprano en O5, completa en O8 (DEC-009) | DEC |
| CTR-GLB-07 | Supuestos iniciales (piloto energía) vs decisión | Piloto | Internet (DEC-005) | DEC |
| CTR-GLB-08 | DFA prioridades B/C (módulos marginales) vs DEC-007 | Alcance de módulos marginales | Todos en alcance, en olas tardías | DEC |
| CTR-GLB-09 | CNX (muro abierto a publicaciones de usuarios) vs necesidad institucional | Modelo del muro | Editorial con comentarios moderados (DEC-008) | DEC |
| CTR-GLB-10 | ProCoop (VARIABLE clave/valor numérica) vs BASE §81/AGR-009 | Parametrización | Parámetros tipados, semánticos y versionados (T04, T04b) | BASE/AGR |
| CTR-GLB-11 | ProCoop (CoopOnline con MySQL sincronizada) vs plataforma única | Portal del socio | Portal nativo sobre la misma base (M19) | BASE |
| CTR-GLB-12 | ProCoop (contraseñas reversibles, usuario SQL compartido, secretos en código) | Seguridad | Hash fuerte, identidad por usuario, bóveda (T02, T06, T08) | Deuda técnica: reemplazada |

Las contraposiciones de cada módulo están en la sección 20 de su anexo.

---

## 18. Preguntas abiertas

Las preguntas se consolidan en `02-preguntas-abiertas.md`, agrupadas por anexo y por ola bloqueada, con opciones y respuesta recomendada. Se presentan al solicitante en tandas interactivas. Mientras no se responden, rige la opción recomendada y los requisitos afectados quedan `A validar`.

Estado al 04-11-2026: cuestionario **cerrado** con 516 preguntas (las §21 de todos los anexos, T05 y los huecos de decisión de `05-registro-huecos.md`); 93 respondidas por el solicitante (DEC-011 a DEC-084) y 423 asumidas con la opción recomendada (DEC-072, DEC-087). Las preguntas que surjan de aquí en adelante se agregan al final de la tabla con el mismo criterio (DEC-047). Actualización por el cierre de la corrección de inconsistencias, 05-11-2026: 555 preguntas (antes 516), 98 respondidas (antes 93), 456 asumidas (antes 423) y 1 reemplazada; se agregan las 38 PA que los anexos registraron durante la corrección y pasan a respondidas PA-IAM-12, PA-CFG-02, PA-CFG-04, PA-MOR-20 y PA-POR-04, cuyos anexos ya aplican la DEC correspondiente. Actualización por la ronda de residuales (05-11-2026): 585 preguntas (antes 555), 98 respondidas (sin cambios), 486 asumidas (antes 456) y 1 reemplazada; se agregan las 30 PA de cierre de residuales de los anexos. Actualización por la sincronización posterior (05-11-2026): 589 preguntas (antes 585), 490 asumidas (antes 486); se agregan PA-IAM-19, PA-UXD-19, PA-DAT-05 y PA-WFL-24. Actualización del 10-11-2026: 593 preguntas (antes 589); se agregan PA-FIS-23 a PA-FIS-26 (de DEC-093, DEC-094, DEC-095 y DEC-102), en estado `Pendiente (contador)`: el sistema implementa la opción recomendada detrás de un parámetro y no precarga normas hasta la respuesta del contador.

Huecos de cobertura: `05-registro-huecos.md` registra 77 huecos detectados por las fichas verticales de T12 (27 de gravedad alta, 38 media, 12 baja; 31 de coherencia, 40 faltantes, 6 de decisión). Los de coherencia y faltantes se corrigen en el anexo responsable; los de decisión pasan a PA.

---

## 19. Trazabilidad global de fuentes

La matriz completa está en `04-matriz-trazabilidad.md`. Cubre:

- BASE §1–§107 completo;
- AGR-001..036 y ESC-01..05;
- CNX por sección;
- DFA módulos 1–29;
- FIC 1–23;
- RN-01..13 por sección;
- CAT: las 659 tablas, vía T07;
- los 1.536 parámetros V2, vía T04b partes 1–4;
- el menú completo de ProCoop, vía T03.

Para cada elemento se indica en qué anexo e ID quedó, o el motivo de `Descartado`/`Reemplazado`.

Resultado de la matriz 1.1 (05-11-2026; antes, matriz 1.0: 97,9 %, 1.659 directas y 20 débiles): 2.201 unidades de fuente, 98,0 % con destino (1.661 citadas directamente y 402 por su sección padre), 94 descartadas o reemplazadas, 18 con trazabilidad débil y 26 brechas, cada una con su corrección propuesta en la matriz (§4). Las 659 tablas de ProCoop están resueltas en T07. La matriz se regenera con el procedimiento de su §14 después de cada cambio importante de anexos.

---

## 20. Glosario general

| Término | Definición | Clave de diccionario | Equivalente ProCoop |
|---|---|---|---|
| CoopApps | Marca comercial del producto SaaS (esta especificación). Todo texto visible al usuario del producto usa esta denominación salvo personalización del tenant | `dict:product.name` (CoopApps) | — |
| GoodApps | Empresa desarrolladora y operadora de la plataforma; contratos SaaS, equipo de consola de plataforma y responsable legal como encargado del tratamiento de datos (DEC-076, DEC-109) | `dict:vendor.name` (GoodApps) | — |
| Tenant | Cooperativa cliente de la plataforma | `dict:tenant` | Empresa / base de datos |
| Persona | Individuo o entidad con identidad fiscal (DNI/CUIT) | `dict:persona` | PERSONAS |
| Titular | Persona responsable de una cuenta | `dict:titular` | TITULARES |
| Asociado / Socio | Persona con vínculo institucional (capital, voto) | `dict:socio` | ASOCIADOS |
| Cuenta | Unidad de facturación y cuenta corriente de un titular | `dict:cuenta` | CUENTAS / suministro |
| Conexión / Suministro | Instancia de un servicio en un inmueble para una cuenta | `dict:suministro` | SUMINISTROS / SERVICIOS_CUENTA |
| Ciclo de facturación | Período y cronograma de emisión | `dict:ciclo` | PERIODOS / LOTES |
| Lote | Ejecución de facturación masiva sobre un universo | `dict:lote` | LOTES |
| Concepto | Ítem facturable (cargo fijo, consumo, impuesto, tasa) | `dict:concepto` | CONCEPTOS |
| Ente recaudador | Tercero que cobra por cuenta de la cooperativa | `dict:enteRecaudador` | ENTES |
| Capability | Permiso atómico `modulo.recurso.accion` | — | Permiso por formulario |
| Ola | Incremento de desarrollo ordenado sin fecha | — | Etapa |

El glosario de cada módulo está en la sección 3 de su anexo.

**Nota sobre numeraciones.** "DFA M14", "DFA M18" y similares citan la numeración de los 29 módulos de ProCoop en la DFA (sección 4.3), que **no** coincide con los anexos `M01..M19` de esta especificación. Un código de anexo siempre va acompañado de su sigla (`M14 TES`, `T11 WFL`).

---

## Anexo de documentos de la especificación

| Documento | Contenido |
|---|---|
| `00-ESPECIFICACION-MAESTRA.md` | Este documento |
| `01-registro-decisiones.md` | DEC-001..010 y siguientes, con fecha y fundamento |
| `02-preguntas-abiertas.md` | Preguntas consolidadas con opciones y recomendación |
| `03-plan-de-olas-y-prompts.md` | Olas O0–O11, dependencias, entregables, prompts para Cursor |
| `04-matriz-trazabilidad.md` | Fuente → anexo/ID |
| `05-registro-huecos.md` | Huecos de cobertura y contradicciones entre anexos detectados por las fichas verticales (T12), con propuesta y estado |
| `_GUIA-REDACCION-ANEXOS.md` | Convenciones y plantilla |
| `../revision-externa/NucleoTransversal-contraste.md` y `NucleoTransversal-rechazados.md` | Contraste del documento externo `NucleoTransversal-Modelo`; no es fuente (§2.3) |
| `anexos/T01..T11`, `T04b` partes 1–4 | Anexos transversales |
| `anexos/M01..M19` | Anexos de módulo |
