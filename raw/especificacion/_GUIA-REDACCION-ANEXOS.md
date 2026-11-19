# Guía de redacción de los anexos de la Especificación de Alcance CoopApps

Versión 1.1 — 19/11/2026 (stack GoodApps: DEC-110–113, DEC-117; ver `06-impacto-adaptacion-stack-goodapps.md`). Documento de control interno para quien redacte o actualice cualquier anexo. Es obligatorio leerlo completo antes de escribir.

## 1. Qué es esta especificación

Es la especificación de alcance **única y vigente** del sistema SaaS multitenant para cooperativas de servicios. **CoopApps** es la marca comercial del producto (DEC-109); **GoodApps** es solo la empresa desarrolladora y operadora (contratos, consola de plataforma, encargos legales de datos). Debe ser tan completa que un equipo, o Cursor IA trabajando por **olas**, pueda desarrollar todo el sistema **sin consultar otra fuente**. Por eso cada anexo:

- transcribe y consolida (no resume a la ligera) todo requisito, regla, dato, pantalla, parámetro y caso de uso de las fuentes de su ámbito;
- resuelve las contraposiciones entre fuentes según la jerarquía de prevalencia (sección 3) y lo deja escrito;
- convierte cada duda en una **pregunta abierta** con opciones y respuesta recomendada (sección 9).

**Regla de oro: no se pierde ni una línea de información.** Si un dato de la fuente no tiene lugar obvio, va igual al anexo (en "Notas y material adicional") y se registra en la trazabilidad. Si una función legacy se decide **no** replicar, se registra igualmente con su motivo (estado `Descartado` o `Reemplazado por`).

## 2. Fuentes (rutas relativas a `c:\Users\lenovo\Documents\GACAC\`)

| Código | Fuente | Rol |
|---|---|---|
| **BASE** | `docs/base-funcional/PROCOOP_RELEVAMIENTO_Y_BASE_FUNCIONAL.md` (v0.17, secciones 1–107) | **Esqueleto rector.** Requisitos informados por el solicitante y propuestas validadas. |
| **AGR** | `docs/base-funcional/PROCOOP_COMPLEMENTO_ANALISIS_FUNCIONAL_Y_DISENO.md` (AGR-001 a AGR-036; también integrado en BASE §102) | Complemento de diseño: bordes, estados, invariantes. |
| **CNX** | `referencia-connectia/connectia-referencia-para-goodapps.md` | **Formato técnico y UI/UX**: stack, layouts, design system, permisos, muro, novedades, encuestas, offline, BI. |
| **DFA** | `procoop-relevamiento/definicion-funcional-alcance.md` (módulos 1–29) | Benchmark funcional de ProCoop por pantallas y tablas. |
| **FIC** | `procoop-relevamiento/integraciones-fichas.md` (fichas 1–23) | Integraciones externas. |
| **RN-01…RN-13** | `procoop-relevamiento/reglas-negocio/NN-*.md` | Reglas de negocio extraídas del código de ProCoop, con parámetros `Busca_V2_*`. |
| **CAT** | `procoop-relevamiento/binarios/Procoop-catalogo-tablas.md` (659 tablas en 31 módulos) | Modelo de datos legacy testigo. |
| **INV** | `procoop-relevamiento/binarios/inventarios/ProMod_*.md`, `Configuracion.md`, `AutoGestion.md`, `ProcoopNet.md` | Inventario de formularios (pantallas) y métodos de ProCoop. Sirve para verificar cobertura de funciones. |
| **REL** | `procoop-relevamiento/README.md` | Relevamiento por pantallas de la DEMO (menú completo, fichas, comprobantes). |

No se citan ni copian contraseñas, tokens ni código fuente de terceros. Los datos personales de la DEMO no se transcriben (usar datos ficticios).

## 3. Jerarquía de prevalencia ante contraposiciones

1. **Decisiones rectoras DEC-xxx** del documento maestro (`00-ESPECIFICACION-MAESTRA.md` §3). Son decisiones del solicitante y prevalecen sobre todo.
2. **BASE**, en su redacción más reciente (las secciones posteriores que declaran "prevalece" sustituyen a las anteriores; ej. §103 prevalece sobre las frases que excluían factura multiservicio; §104 amplía §28).
3. **AGR** (propuestas del complemento): se adoptan como requisito salvo que contradigan 1 o 2.
4. **CNX** para todo lo técnico, de UI/UX, layout, componentes, permisos y comunidad.
5. **DFA, FIC, RN, CAT, INV, REL**: benchmark del sistema a reemplazar. Todo lo que ProCoop hace **entra en el alcance** (decisión DEC-007) salvo que 1–4 lo contradigan o sea una deuda técnica/seguridad de ProCoop (ej. contraseñas reversibles, una base por cooperativa, sincronización con MySQL externa), en cuyo caso se registra como `Reemplazado por` con la mejora.

Cada contraposición encontrada se documenta en el anexo, en la sección "Contraposiciones resueltas", con: fuentes en conflicto, qué dice cada una, resolución aplicada y regla de prevalencia usada. Si la resolución no es evidente, se convierte en **pregunta abierta**.

## 4. Decisiones rectoras vigentes (resumen; detalle en el maestro)

**Implementación (DIR-13):** para redactar o exportar al repo GoodApps, usar solo la columna **Vigente (build)**. La columna **Histórico (04-11)** conserva el acuerdo original; no contradecir su *funcional*.

| ID | Histórico (04-11) | Vigente (build, DEC-110–113, 117–118) |
|---|---|---|
| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **Azure SQL**, React 19, Vite, TypeScript, Tailwind; ver maestro §5 |
| Multitenancy | DEC-002: base compartida, `tenantId` en cada documento | **DEC-110**: base compartida Azure SQL, **`TenantId`** en tablas de negocio, filtro en EF, índices compuestos; tenant `PLATFORM` |
| Arquitectura | DEC-003: monolito modular + outbox + workers | Igual (**DEC-003**); colas **Azure Queue** + workers .NET |
| Despliegue | DEC-004: Docker agnóstico; AWS referencia | **DEC-112**: **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault) |
| DEC-005–010 | Sin cambio de negocio | Sin cambio; plan `03` = mapa de olas (**DEC-118**, no guía de build) |

## 4b. Guía UI/UX para desarrollo

Cualquier pantalla descrita en un anexo debe ser implementable siguiendo **`GUIA-UI-UX-DESARROLLO.md`** (checklist `PAN-*`, shells, componentes de T03 §10.2, diccionario, `ScreenHelp`). Al redactar filas de la sección Pantallas, indicar `screenId`, capability de ver y layout (admin / PWA / landing); no prescribir componentes que contradigan T03.

## 5. Convenciones técnicas obligatorias para todos los anexos

- **Idioma**: español rioplatense neutro. Nombres de **entidades lógicas** (en anexos aún «colecciones»), propiedades y endpoints en **inglés camelCase** en API JSON; en base: tablas/columnas según `07-modelo-relacional-azure-sql.md` (habitualmente PascalCase en SQL, mapeo EF). Etiquetas de UI en español y **siempre por clave de diccionario** (`dict:<clave>`), nunca texto fijo (BASE §65).
- **Entidades / tablas**: nombre lógico en plural camelCase (`accounts`, `serviceContracts`); físico en esquema del módulo (`per.Accounts`, etc., catálogo `07-catalogo-tablas-sql.md`). Toda fila de negocio: `TenantId`, auditoría (`CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`), `Version` (concurrencia optimista), y cuando corresponda `Status`, vigencias, `RecordedAt` (AGR-010), baja lógica donde aplique; los documentos económicos **nunca** se borran: se anulan o revierten (T05 §7.1.6).
- **Dinero**: tipo **`decimal`** en SQL (precision/scale por concepto en `07`); en API y UI, aritmética con biblioteca decimal en .NET/TypeScript; **prohibido float/double para importes**. Precisión por concepto (AGR-011). Moneda `ARS` por defecto, campo `Currency`.
- **Fechas**: guardadas en UTC; zona horaria del tenant (`America/Argentina/Cordoba` por defecto) para calendarios, vencimientos y cortes (AGR-017). Formato visible `dd-mm-yyyy` (CNX).
- **Permisos (capabilities)**: `modulo.recurso.accion`, ej. `fac.lotes.aprobar`. Acciones estándar: `ver`, `crear`, `editar`, `anular`, `aprobar`, `exportar`, `configurar`, más las propias. Además del permiso, el **alcance** (`scope`) sobre datos: tenant / sucursales / zonas / servicios / cuadrillas / propios (CNX §2.4 adaptado).
- **API REST**: `/api/<modulo>/<recurso>` (PWA/socio) y `/api/admin/<modulo>/<recurso>` (admin), `/api/platform/...` (plataforma), `/api/public/<tenantSlug>/...` (landing sin login), `/api/v1/ext/...` (APIs de terceros con token). Paginación `?page=&size=` → `{ items, total, page, size }`. Errores RFC 9457 (`application/problem+json`) con `requestId`. Validación Zod compartida. Idempotencia con header `Idempotency-Key` en toda operación económica o de integración (AGR-016).
- **Eventos**: `<modulo>.<entidad>.<hecho-en-pasado>`, ej. `fac.invoice.issued`, `cob.payment.confirmed`. Se publican vía outbox en la misma transacción que el cambio.
- **Jobs**: nombre `<modulo>:<proceso>`, ej. `fac:emitir-lote`. Cada job es idempotente, reanudable y registra progreso.
- **IDs de documentación** (estables, nunca se reutilizan):
  - Requisito funcional: `RF-<COD>-NNN` · Regla de negocio: `RN-<COD>-NNN` · Requisito no funcional: `RNF-<COD>-NNN`
  - Caso de uso: `CU-<COD>-NN` · Pantalla: `PAN-<COD>-NN` · Endpoint: `API-<COD>-NN` · Evento: `EVT-<COD>-NN` · Job: `JOB-<COD>-NN`
  - Parámetro de configuración: `PRM-<COD>-NNN` · Pregunta abierta: `PA-<COD>-NN` · Contraposición: `CTR-<COD>-NN`
  - Se conservan siempre los IDs de origen en la columna **Origen** (ej. `BASE §103 FAC-006`, `AGR-012`, `MER-007`, `SUE-005`, `RN-04 §4`, `DFA M11`, `FIC 4.1`, `CAT ENTIDADES`, `V2 #74`, `INV frmCierreDiario`).
- **Prioridad dentro del alcance**: `Núcleo` (sin esto el flujo no funciona), `Estándar` (necesario para reemplazar ProCoop), `Extensión` (diferible). Más la **ola** asignada (sección 7).
- **Estado del requisito**: `Informado` (lo pidió el solicitante), `Adoptado` (propuesta AGR/benchmark aceptada en esta especificación), `A validar` (depende de una pregunta abierta), `Reemplazado por <ID>`, `Descartado (motivo)`.

### Códigos de anexo

| Código | Anexo | Archivo |
|---|---|---|
| PLA | T01 Plataforma SaaS, tenants, licencias, soporte, ambientes, backups | `anexos/T01-PLA-plataforma-saas.md` |
| IAM | T02 Identidad, autenticación, roles, perfiles, alcance, auditoría | `anexos/T02-IAM-identidad-roles-auditoria.md` |
| UXD | T03 UI/UX, design system, marca, diccionario, layouts, mapa del sitio | `anexos/T03-UXD-experiencia-marca-diccionario.md` |
| CFG | T04 Configuración versionada, parámetros, tablas maestras, geografía | `anexos/T04-CFG-configuracion-parametros-maestros.md` (+ `T04b-CFG-catalogo-parametros-procoop.md`) |
| DAT | T05 Modelo de datos canónico y responsables | `anexos/T05-DAT-modelo-datos.md` |
| INT | T06 Marco de integraciones y fichas | `anexos/T06-INT-integraciones.md` |
| MIG | T07 Migración, paralelo y by-pass de ProCoop | `anexos/T07-MIG-migracion-procoop.md` |
| NFR | T08 No funcionales, seguridad, privacidad, pruebas, ambientes | `anexos/T08-NFR-no-funcionales-seguridad.md` |
| COM | T09 Comunidad y comunicaciones (muro, novedades, encuestas, notificaciones, audiencia) | `anexos/T09-COM-comunidad-comunicaciones.md` |
| BIA | T10 Reportes, BI, tableros y APIs para terceros | `anexos/T10-BIA-reportes-bi-apis.md` |
| WFL | T11 Workflow, estados, eventos, jobs, autorizaciones, expediente documental | `anexos/T11-WFL-workflow-eventos-documentos.md` |
| SRV | T12 Fichas verticales por servicio (INT, TEL, TV, ELE, AG, CLO, GAS, ALU, OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR): recorrido extremo a extremo con referencias a IDs de cada anexo (DEC-073) | `anexos/T12-SRV-fichas-verticales-servicios-parte1.md` (INT, TEL, TV, ELE, AG, CLO, GAS, ALU y huecos transversales) y `anexos/T12-SRV-fichas-verticales-servicios-parte2.md` (OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR) |
| PER | M01 Personas, titulares, asociados, cuentas, inmuebles, domicilios | `anexos/M01-PER-personas-titulares-cuentas.md` |
| CAT | M02 Catálogo de servicios, productos, planes, categorías, particularidades por servicio | `anexos/M02-CAT-catalogo-servicios.md` |
| MED | M03 Medidores, lecturas, consumos, telemedición, prepago | `anexos/M03-MED-medicion-consumos.md` |
| TAR | M04 Tarifas y motor de cálculo | `anexos/M04-TAR-tarifas-motor-calculo.md` |
| FAC | M05 Facturación, ciclos, lotes y comprobantes | `anexos/M05-FAC-facturacion.md` |
| FIS | M06 Fiscal e impuestos (ARCA, IVA, percepciones, retenciones, regímenes, terceros, reguladores) | `anexos/M06-FIS-fiscal-impuestos.md` |
| COB | M07 Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas, conciliación | `anexos/M07-COB-cuenta-corriente-cobranza.md` |
| MOR | M08 Mora, intereses, suspensión, corte, reconexión, financiación, garantías, incobrables | `anexos/M08-MOR-mora-financiacion.md` |
| CRM | M09 CRM y atención (solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot, IA, actividades internas) | `anexos/M09-CRM-atencion.md` |
| TEC | M10 Técnica, campo, agenda, instalación, GIS/redes, obras, aprovisionamiento TIC, telefonía | `anexos/M10-TEC-tecnica-campo-redes.md` |
| VEN | M11 Ventas, presupuestos, POS | `anexos/M11-VEN-ventas-presupuestos.md` |
| CMP | M12 Compras y proveedores | `anexos/M12-CMP-compras-proveedores.md` |
| STK | M13 Stock, equipos serializados, bienes de uso, RMA, fabricación | `anexos/M13-STK-stock-activos-fabricacion.md` |
| TES | M14 Tesorería y bancos | `anexos/M14-TES-tesoreria-bancos.md` |
| CON | M15 Contabilidad, centros de costo, planes múltiples, presupuestos | `anexos/M15-CON-contabilidad.md` |
| SUE | M16 Personal y sueldos | `anexos/M16-SUE-personal-sueldos.md` |
| INS | M17 Gestión institucional (asociados, capital, asambleas, consejo, INAES) | `anexos/M17-INS-institucional.md` |
| SOC | M18 Servicios sociales y otros (vivienda, salud/ambulancias, sepelio, cementerio parque, banco de sangre), flota y traslados | `anexos/M18-SOC-servicios-sociales-flota.md` |
| POR | M19 Landing, portal y app del socio (autogestión) | `anexos/M19-POR-portal-socio-landing.md` |

## 6. Plantilla obligatoria de cada anexo de módulo

Usar exactamente estos títulos y este orden (los transversales pueden adaptar 7–15 a su naturaleza, manteniendo 1–6 y 16–22):

```
# <Código anexo> <COD> — <Nombre>

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP / CRM / Landing-autogestión / Plataforma / Cobranza / Pasarelas / Impuestos / APIs |
| Olas | O<n>… |
| Dueño de datos | qué entidades son propiedad de este módulo |
| Fuentes consolidadas | lista exacta de secciones (BASE §x, AGR-xxx, DFA Mx, FIC x, RN-xx §y, CAT §n, V2 módulo, INV archivos, CNX §z) |

## 1. Objetivo
## 2. Límite y responsabilidades (qué hace, qué NO hace, qué delega y a quién)
## 3. Glosario del módulo (término, definición, clave de diccionario, término ProCoop equivalente)
## 4. Actores, permisos y alcance (tabla: rol, capabilities `cod.recurso.accion`, alcance de datos)
## 5. Requisitos funcionales (tabla: ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación)
## 6. Reglas de negocio (tabla o fichas: ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps: Replicar / Mejorar / Reemplazar / Descartar | Parámetros | [VERIFICAR] si aplica)
## 7. Modelo de datos (por colección: propósito, campos con tipo y obligatoriedad, enums, índices, vigencias, relaciones; mapeo a tablas ProCoop origen)
## 8. Estados y transiciones (por entidad: estado origen → destino, actor, precondición, efectos, reversión — AGR-003)
## 9. Procesos y flujos (paso a paso, incluidos batch/jobs JOB-xxx, reintentos, cancelación, recuperación)
## 10. Pantallas (por pantalla: PAN-ID, app [admin|pwa-socio|pwa-empleado|pwa-campo|landing|plataforma], ruta, capability, propósito, layout CNX, filtros, columnas/campos, acciones, modales, estados vacíos, ayuda contextual; equivalencia con formularios ProCoop INV)
## 11. API (tabla: API-ID | Método | Ruta | Capability | Descripción | Idempotente)
## 12. Eventos y jobs (emitidos, consumidos, jobs batch con frecuencia)
## 13. Integraciones (referencia a T06 y particularidades del módulo)
## 14. Parámetros de configuración (tabla: PRM-ID | Clave | Tipo | Ámbito: plataforma/tenant/servicio/categoría | Default | Descripción | Origen V2 #n)
## 15. Reportes, indicadores y exportaciones (fórmula, universo, fecha de corte — AGR-022)
## 16. Casos de uso (CU originales de BASE con su ID original + nuevos)
## 17. Criterios de aceptación y escenarios de prueba (incluye permisos negativos, aislamiento de tenant, reintentos, conciliación; ESC-01..05 cuando apliquen)
## 18. Datos de precarga de demostración (ficticios)
## 19. Migración desde ProCoop (tabla origen → colección destino, transformación, validación de conciliación)
## 20. Contraposiciones resueltas (CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia)
## 21. Preguntas abiertas (formato de la sección 9 de esta guía)
## 22. Trazabilidad de fuentes (checklist: cada sección/regla/tabla/formulario/parámetro de la fuente → ID(s) de este anexo donde quedó, o `Descartado: motivo`)
```

## 7. Olas (asignar cada requisito a una)

| Ola | Contenido |
|---|---|
| O0 | Fundaciones: monorepo, Docker, CI, convenciones, librerías compartidas (money, fechas, Zod), shells AdminShell/AppShell, design system, DataTable, ExcelImportWizard, toasts/confirm, auth básica, tenancy plugin, auditoría genérica, outbox + BullMQ, almacenamiento privado, diccionario y branding base, notificaciones base. |
| O1 | Plataforma SaaS e IAM completos: tenants y ciclo de vida, licencias/capabilities, roles/perfiles/alcance, usuarios, 2FA, Google, soporte con acceso temporal, configuración versionada y publicación, parámetros, tablas maestras, geografía/calles, workflow de autorizaciones, expediente documental. |
| O2 | Personas/titulares/cuentas/inmuebles, catálogo de servicios/productos/planes, habilitación por tenant, copia de servicios entre tenants, landing pública, registro y portal base del socio, CRM de solicitudes (alta/baja), comunidad (muro, novedades, encuestas, centro de comunicaciones). |
| O3 | Técnica para el piloto Internet: factibilidad, agenda y visitas, órdenes de trabajo, instalación integral (equipo en comodato, firma, encuesta), stock serializado de equipos, app de campo offline, aprovisionamiento de Internet (MikroTik/Radius/OLT). |
| O4 | Motor tarifario (P×Q, fijos, planes, prorrateos, promociones) + facturación (ciclos, lotes, separada/agrupada, numeración, vencimientos, anulación/NC/ND, PDF, QR, código de barras, distribución) + ARCA (WSAA/WSFEv1, CAE/CAEA, padrón) + impuestos básicos (IVA, percepciones IIBB, tasas de terceros). |
| O5 | Cuenta corriente (auxiliar, imputación, saldos a favor, no identificados), cobranza en caja, pasarelas (Pagos360, Mercado Pago, SIRO, otros), redes (Red Link, SIRO), débitos automáticos, conciliación, devoluciones/contracargos; **núcleo contable** (plan de cuentas, ejercicios, centros de costo, asientos automáticos). |
| O6 | Mora (intereses, recargos, instancias, notificaciones), suspensión/corte/reconexión integrados con técnica y aprovisionamiento, convenios y planes de pago, garantías, incobrables, gestión judicial. **Cierre del piloto Internet extremo a extremo.** |
| O7 | Servicios medidos: medidores, rutas, app de lecturas, validación de consumos, estimaciones, telemedición, prepago; tarifas medidas (tramos, demanda, factor de potencia, cargos adicionales con fórmulas, prorrateo entre cuadros), electricidad, agua, gas, generación distribuida, grandes usuarios, subsidios/segmentación/tarifa social, reguladores (ERSeP, ENARGAS, ENACOM, Secretaría de Energía), compra de energía (EPEC). |
| O8 | ERP administrativo: compras, proveedores, retenciones, stock completo, bienes de uso, RMA, tesorería y bancos, Interbanking, valores, contabilidad completa (cierres, balances, INAES, múltiples planes y simulaciones), presupuestos, regímenes informativos (CITI/RG3685, SICORE, SIRCAR, libros IVA digitales). |
| O9 | Personal y sueldos (legajos, liquidaciones, SAC, Ganancias, F.931, LSD, recibos, portal del empleado, RRHH GLM). |
| O10 | Institucional (asociados, capital, asambleas, consejo, actas, INAES), servicios sociales (sepelio, cementerio parque, banco de sangre, salud/ambulancias, planes de vivienda), flota y traslados (GPS), telefonía (centrales, CDR, tasación), TV/otros TIC, fabricación, turnero y agente de hardware local, actividades internas. |
| O11 | Reportes avanzados, BI (salas, cubos certificados, IA), generador de reportes del tenant, APIs para terceros, migración repetible desde ProCoop, paralelo factura por factura y by-pass. |

Si un requisito de un módulo de ola tardía es prerrequisito de una ola anterior, se asigna a la ola anterior (ej. stock serializado de equipos en O3 aunque stock completo sea O8).

## 8. Pantallas: patrón Connectia obligatorio

- **Admin web** (`apps/admin`): AdminShell con topbar (logo producto, logo tenant, selector de contexto, Mapa del sitio, accesos fijados), menú declarativo único `siteMapGroups` (clusters → grupos → ítems con capability), `AdminStickyHeader` (título, subtítulo, acciones), `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` genérico (columnas configurables, orden, filtros, paginación, exportar XLSX/CSV/PDF, selección masiva, vistas guardadas), modales `sm/md/lg/xl`, `ExcelImportWizard` (subir → preview con errores → confirmar), toasts y `ConfirmDialog`, previews "celular", IA solo propone. Tema oscuro por defecto con tokens CNX §4.1; tipografías Space Grotesk / IBM Plex Sans / IBM Plex Mono (importes y lecturas).
- **PWA** (`apps/pwa`, una sola app con landing por rol: socio, empleado, técnico, lecturista, cobrador): AppShell (topbar, banners, contenido, tabbar con FAB "+"), piel oscura `.pwa-mod` con tokens CNX §3.1, branding runtime por tenant, manifest dinámico, cards de listado con anatomía fija, alta siempre en modal desde FAB, 3 skeleton cards, errores inline, offline con cola única IndexedDB + `clientMutationId`.
- **Landing** (`apps/landing` o rutas públicas): marca, noticias, servicios habilitados, registro, consulta pública, pago sin login cuando aplique, baja pública cuando corresponda (BASE §53).
- **Plataforma** (rutas `meta.platformOnly` en admin): tenants, licencias, soporte, salud, dashboards globales.
- Cada pantalla se especifica con PAN-ID y se mapea a los formularios ProCoop que reemplaza (INV) para asegurar cobertura.

## 9. Formato de preguntas abiertas

Cada duda real (no resoluble con la jerarquía de la sección 3) se escribe así, para luego presentarse al solicitante en formato interactivo de opción múltiple:

```
### PA-<COD>-NN — <título corto>
- **Pregunta:** <redacción clara, una sola decisión>
- **Contexto:** <por qué importa, qué fuentes chocan o qué falta>
- **Opciones:**
  - A) <opción> **(Recomendada)** — <consecuencia>
  - B) <opción> — <consecuencia>
  - C) <opción> — <consecuencia>
- **Impacto si no se responde:** <qué se asume por defecto; siempre se asume la Recomendada>
- **Bloquea:** <IDs de requisitos/olas afectados>
```

Mientras no se responda, el anexo **asume la opción recomendada** y marca los requisitos afectados como `A validar (PA-xxx)`. Las preguntas deben ser de decisión del solicitante (negocio, alcance, prioridad, política); no preguntar lo que ya está resuelto por fuentes o por las DEC.

## 10. Calidad mínima exigida

- Cada anexo de módulo debe tener, como orden de magnitud, decenas de RF y RN (los módulos grandes, más de 60–100), todas las colecciones con campos, todas las pantallas del módulo y todos los formularios ProCoop relevantes mapeados.
- Nada de "etc.", "entre otros" o "similares" sin enumerar: si la fuente enumera, se enumera todo.
- Los ejemplos numéricos son ficticios y en ARS.
- La sección 22 (trazabilidad) es la prueba de exhaustividad: debe listar **cada** sección de BASE, AGR, DFA, FIC, RN, CAT e INV asignada al anexo, con su destino.
