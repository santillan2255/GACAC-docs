# T03b — Paquete base `screenHelpArticles` (M01 + T02 núcleo)

| Campo | Valor |
|---|---|
| Fecha | 19-11-2026 |
| Dueño lógico | T03 UXD (`screenHelpArticles`, tenant `PLATFORM`, scope `base`) |
| Uso | Semilla producto para export GoodApps; ver RF-UXD-049, RN-UXD-055 |
| Fuente borrador | `_trabajo/screenhelp-borrador-nucleo.md` |
| Inventario | `_trabajo/inventario-screenhelp-m01-t02.md` |
| Estado paquete | `draft` (publicar con `uxd.ayuda.editar` en O1) |

> Este anexo **complementa** `T03-UXD-experiencia-marca-diccionario.md` §7.B.7 y §8.7. No sustituye el modelo de datos; define el contenido base de ayuda para el núcleo de export fase 3.

> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.

**Artículos:** 60 (cobertura completa M01 28 + T02 32).

## `PAN-PER-01` — Búsqueda de titulares y cuentas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-01` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Búsqueda unificada de titulares y cuentas. |
| `quien` | `per.titulares.ver`. |
| `cuando` | Antes de abrir ficha, facturar o transferir. |
| `donde` | Socios y cuentas → Titulares. |
| `porQue` | Acceso rápido sin duplicar personas (CU-03). |
| `como` | Filtros por documento, nombre, número; Enter abre el primero. |
| `casoDeUso.cuId` | `CU-03` |
| `casoDeUso.resumen` | CU-03; CU-TIT-01 |

## `PAN-PER-02` — Ficha 360 del titular

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-02` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Vista integral titular, cuentas, contratos y alertas. |
| `quien` | `per.titulares.ver` (+ permisos por pestaña). |
| `cuando` | Atención, cobranza, trámites, auditoría de cliente. |
| `donde` | Desde búsqueda o menú Titulares. |
| `porQue` | Un solo punto para todo lo del titular (BASE §3). |
| `como` | Use pestañas; acciones en cabecera según permiso. |
| `casoDeUso.cuId` | `CU-PER-01` |
| `casoDeUso.resumen` | CU-PER-01..05; CU-04 |

## `PAN-PER-03` — Personas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-03` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Lista y ficha de personas físicas/jurídicas. |
| `quien` | `per.personas.ver`. |
| `cuando` | Alta, corrección, fusión, privacidad, documento pendiente. |
| `donde` | Socios y cuentas → Personas. |
| `porQue` | Identidad única por tenant (CU-03). |
| `como` | Filtro «documento pendiente» para migración; fusionar desde duplicados. |
| `casoDeUso.cuId` | `CU-03` |
| `casoDeUso.resumen` | CU-03; CU-PER-06; CU-PER-13 |

## `PAN-PER-04` — Alta y edición de persona

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-04` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Alta/édición con anti-duplicado y verificación. |
| `quien` | `per.personas.crear` / `editar`; modo embebido desde otros módulos. |
| `cuando` | Nuevo titular, proveedor, empleado o socio. |
| `donde` | Modal desde PER u otros maestros (DEC-097). |
| `porQue` | Una persona, muchos roles (AGR-006). |
| `como` | Revise candidatos antes de crear; ARCA si aplica. |
| `casoDeUso.cuId` | `CU-03` |
| `casoDeUso.resumen` | CU-03; CU-REG-01 (M19) |

## `PAN-PER-05` — Cuenta

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-05` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Ficha de cuenta de servicios del titular. |
| `quien` | `per.cuentas.ver`. |
| `cuando` | Configurar postal, fiscal, grupos y contratos. |
| `donde` | Desde ficha titular o ruta directa. |
| `porQue` | SUMSOC normalizado (ProCoop). |
| `como` | Revise cuenta principal, entrega de factura y árbol contratos. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04; CU-TIT-01 |

## `PAN-PER-06` — Editor de domicilio

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-06` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Domicilio normalizado con mapa y geocodificación. |
| `quien` | Capability de edición de la entidad dueña. |
| `cuando` | Alta persona/cuenta/inmueble o corrección. |
| `donde` | Modal embebido en formularios PER. |
| `porQue` | Un domicilio reutilizable (CU-GEO-01). |
| `como` | Catálogo T04 + confirmar pin en mapa si aplica. |
| `casoDeUso.cuId` | `CU-GEO-01` |
| `casoDeUso.resumen` | CU-GEO-01 |

## `PAN-PER-07` — Inmuebles

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-07` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Catastro, unidades funcionales y relaciones. |
| `quien` | `per.inmuebles.ver`. |
| `cuando` | Contratos en PH, obras, propiedad horizontal. |
| `donde` | Socios y cuentas → Inmuebles. |
| `porQue` | PROPIEDA sin duplicar persona. |
| `como` | Filtros por nomenclatura/partida; contratos desde M02. |
| `casoDeUso.cuId` | `CU-PER-10` |
| `casoDeUso.resumen` | CU-PER-10 |

## `PAN-PER-08` — Puntos de prestación

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-08` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Lista y ficha de puntos donde se presta el servicio. |
| `quien` | `per.puntosPrestacion.ver`. |
| `cuando` | Alta de contrato, obra o cambio de ubicación física. |
| `donde` | Socios y cuentas → Puntos de prestación. |
| `porQue` | Ubicación del servicio separada del inmueble (CU-04). |
| `como` | Vincule inmueble o domicilio; valide en mapa si aplica. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04 |

## `PAN-PER-09` — Relaciones y representaciones

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-09` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Vínculos legales y comerciales entre personas. |
| `quien` | `per.relaciones.ver` / `crear`. |
| `cuando` | Garantes, apoderados, representantes. |
| `donde` | Pestaña en ficha persona/titular. |
| `porQue` | Quién puede actuar por el titular (CU-PER-04, CU-PER-05). |
| `como` | Elija tipo de vínculo y vigencia; adjunte constancia si exige RN. |
| `casoDeUso.cuId` | `CU-PER-04` |
| `casoDeUso.resumen` | CU-PER-04; CU-PER-05 |

## `PAN-PER-10` — Adherentes y beneficiarios

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-10` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Vista de adherentes del contrato (solo lectura en PER). |
| `quien` | `soc.adherentes.ver`. |
| `cuando` | Consulta desde ficha de cuenta/contrato. |
| `donde` | Pestaña contrato en ficha titular. |
| `porQue` | El alta/baja se gestiona en servicios sociales (M18). |
| `como` | Use el enlace a la pantalla de gestión para modificar. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04 |

## `PAN-PER-11` — Notas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-11` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Notas operativas sobre titular, cuenta o persona. |
| `quien` | `per.notas.ver` / `crear`. |
| `cuando` | Observaciones para caja, facturación o técnica. |
| `donde` | Pestaña Notas en ficha. |
| `porQue` | Avisos visibles sin alterar datos maestros. |
| `como` | Indique alcance y fecha de vigencia si aplica. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04 |

## `PAN-PER-12` — Bloqueos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-12` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Bloqueos de cobro o mensajes en ventanilla. |
| `quien` | `per.bloqueos.ver` / `aplicar` / `levantar`. |
| `cuando` | Mora, fraude, acuerdo interno o decisión judicial. |
| `donde` | Pestaña Bloqueos. |
| `porQue` | Impide cobros indebidos (CU-PER-07). |
| `como` | Motivo obligatorio; revise impacto en caja al levantar. |
| `casoDeUso.cuId` | `CU-PER-07` |
| `casoDeUso.resumen` | CU-PER-07 |

## `PAN-PER-13` — Documentación y requisitos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-13` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Trámites, documentos solicitados y validación. |
| `quien` | `per.documentacion.ver` / `registrar` / `validar`. |
| `cuando` | Alta de servicio, transferencia, reclamo. |
| `donde` | Pestaña o menú Documentación. |
| `porQue` | Checklist antes de operaciones sensibles. |
| `como` | Cargue escaneo y marque estado validado/rechazado. |
| `casoDeUso.cuId` | `CU-PER-11` |
| `casoDeUso.resumen` | CU-PER-11; CU-TIT-01 |

## `PAN-PER-14` — Asistente de transferencia

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-14` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Wizard de transferencia de titularidad/cuenta. |
| `quien` | `per.transferencias.crear`. |
| `cuando` | Venta, sucesión, mudanza, cambio responsable pago. |
| `donde` | Transferencias → Nueva. |
| `porQue` | Historial conservado (BASE §4). |
| `como` | Simulación antes de confirmar; adjunte documentación. |
| `casoDeUso.cuId` | `CU-PER-11` |
| `casoDeUso.resumen` | CU-PER-11; CU-TIT-01 |

## `PAN-PER-15` — Transferencias (detalle/lista)

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-15` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Seguimiento de transferencias iniciadas. |
| `quien` | `per.transferencias.ver`. |
| `cuando` | Auditoría o reverso autorizado. |
| `donde` | Socios y cuentas → Transferencias. |
| `porQue` | Trazabilidad de cambios de titular. |
| `como` | Revise pasos y constancia; revertir solo con permiso. |
| `casoDeUso.cuId` | `CU-PER-11` |
| `casoDeUso.resumen` | CU-PER-11 |

## `PAN-PER-16` — Registrar fallecimiento

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-16` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Registro de fallecimiento con evidencia. |
| `quien` | `per.personas.registrarFallecimiento`. |
| `cuando` | Comunicación de fallecimiento de titular. |
| `donde` | Acción en ficha titular. |
| `porQue` | Efectos en contratos y cobranza (CU-PER-03). |
| `como` | Adjunte acta/evidencia; revise bloqueos automáticos. |
| `casoDeUso.cuId` | `CU-PER-03` |
| `casoDeUso.resumen` | CU-PER-03 |

## `PAN-PER-17` — Baja y reactivación de titular

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-17` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Baja o reactivación de titular comercial. |
| `quien` | `per.titulares.baja` / `reactivar`. |
| `cuando` | Cierre comercial del vínculo. |
| `donde` | Ficha titular → más acciones. |
| `porQue` | Estado distinto de persona y de socio (M17). |
| `como` | Indique causa; conserve número si política lo permite. |
| `casoDeUso.cuId` | `CU-PER-12` |
| `casoDeUso.resumen` | CU-PER-12 |

## `PAN-PER-18` — Duplicados y fusión

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-18` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Bandeja de posibles duplicados y fusión. |
| `quien` | `per.duplicados.ver`, `per.personas.unificar`. |
| `cuando` | Alertas de coincidencia o migración. |
| `donde` | Socios y cuentas → Duplicados. |
| `porQue` | Una persona por tenant (CU-PER-06). |
| `como` | Compare y decida fusionar o descartar caso. |
| `casoDeUso.cuId` | `CU-PER-06` |
| `casoDeUso.resumen` | CU-PER-06 |

## `PAN-PER-19` — Historial

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-19` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Línea de tiempo de cambios en persona, titular o cuenta. |
| `quien` | `per.historial.ver`. |
| `cuando` | Auditoría, disputa o consulta de estado anterior. |
| `donde` | Pestaña Historia o comparador modal. |
| `porQue` | Explicar qué cambió y cuándo (GOB). |
| `como` | Filtre por entidad y período; compare versiones lado a lado. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-PER-20` — Padrón de titulares

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-20` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Informe parametrizable del padrón de titulares. |
| `quien` | `per.padron.ver` / `exportar`. |
| `cuando` | Secretaría, regulatorio o campañas. |
| `donde` | Socios y cuentas → Padrón. |
| `porQue` | Reemplaza listados ProCoop con columnas guardadas. |
| `como` | Configure filtros y columnas; exporte a Excel si tiene permiso. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04 |

## `PAN-PER-21` — Operaciones especiales

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-21` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Cambios excepcionales con aprobación (no borrado directo). |
| `quien` | `per.operacionesEspeciales.ejecutar`. |
| `cuando` | Corrección masiva o caso autorizado por directorio. |
| `donde` | Socios y cuentas → Operaciones especiales. |
| `porQue` | Sustituye módulos especiales ProCoop con traza. |
| `como` | Complete formulario; espere autorización si la política lo exige. |
| `casoDeUso.cuId` | `CU-PER-11` |
| `casoDeUso.resumen` | CU-PER-11 |

## `PAN-PER-22` — Configuración del módulo

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-22` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Maestros auxiliares de personas y titulares. |
| `quien` | `per.configuracion.configurar`. |
| `cuando` | Parametrización inicial o cambio normativo. |
| `donde` | Configuración → Socios y cuentas. |
| `porQue` | Catálogos que gobiernan formularios del módulo. |
| `como` | Publique cambios vía motor T04 cuando corresponda. |
| `casoDeUso.cuId` | `CU-04` |
| `casoDeUso.resumen` | CU-04 |

## `PAN-PER-23` — Privacidad y derechos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-23` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Bandeja Ley 25.326 (acceso, rectificación, supresión). |
| `quien` | `per.privacidad.gestionar`. |
| `cuando` | Solicitud del titular o auditoría. |
| `donde` | Cumplimiento → Privacidad PER. |
| `porQue` | Derechos del titular (T08). |
| `como` | Vincule persona y plazo; no exportar datos sensibles sin permiso. |
| `casoDeUso.cuId` | `CU-PER-13` |
| `casoDeUso.resumen` | CU-PER-13 |

## `PAN-PER-24` — Importación

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-24` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Carga masiva desde Excel con validación por fila. |
| `quien` | `per.importaciones.crear`. |
| `cuando` | Migración auxiliar o actualización masiva acotada. |
| `donde` | Socios y cuentas → Importar. |
| `porQue` | Reduce carga manual con preview de errores. |
| `como` | Descargue plantilla; corrija filas rechazadas antes de confirmar. |
| `casoDeUso.cuId` | `CU-03` |
| `casoDeUso.resumen` | CU-03 |

## `PAN-PER-25` — PWA Mis datos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-25` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | El socio consulta y actualiza sus datos de contacto. |
| `quien` | `per.me.ver` / `editarContactos`. |
| `cuando` | Autogestión desde la app. |
| `donde` | App → Mis datos. |
| `porQue` | Menos llamados por datos desactualizados (M19). |
| `como` | Cambios sensibles pueden requerir verificación. |
| `casoDeUso.cuId` | `CU-REG-01` |
| `casoDeUso.resumen` | CU-REG-01 (M19) |

## `PAN-PER-26` — PWA Vincular cuenta

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-26` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | El socio vincula su usuario a una cuenta de suministro. |
| `quien` | `per.me.vincular`. |
| `cuando` | Primer ingreso o nueva cuenta en el hogar. |
| `donde` | App → Vincular cuenta. |
| `porQue` | Acceso a facturas y pagos propios (T02). |
| `como` | Pruebe identidad con dato de factura o código enviado. |
| `casoDeUso.cuId` | `CU-REG-01` |
| `casoDeUso.resumen` | CU-REG-01 (M19) |

## `PAN-PER-27` — PWA Autorizados

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-27` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | El titular gestiona quién puede ver o pagar por él. |
| `quien` | `per.me.autorizados.gestionar`. |
| `cuando` | Familiar autorizado a pagar o consultar. |
| `donde` | App → Autorizados. |
| `porQue` | CU-PER-05 sin pasar por caja. |
| `como` | Defina alcance view/pay y vigencia; puede revocar en cualquier momento. |
| `casoDeUso.cuId` | `CU-PER-05` |
| `casoDeUso.resumen` | CU-PER-05 |

## `PAN-PER-28` — Mapa de domicilios y puntos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-PER-28` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Mapa con capas de domicilios y puntos de prestación. |
| `quien` | `per.puntosPrestacion.ver`. |
| `cuando` | Planificación, campo o atención territorial. |
| `donde` | Socios y cuentas → Mapa. |
| `porQue` | Vista geográfica del padrón (CU-GEO-01). |
| `como` | Active capas y haga zoom; enlace a ficha desde marcador. |
| `casoDeUso.cuId` | `CU-GEO-01` |
| `casoDeUso.resumen` | CU-GEO-01 |

## `PAN-IAM-01` — Login staff

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-01` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Pre-login por cooperativa e ingreso staff. |
| `quien` | Público hasta autenticar. |
| `cuando` | Inicio de jornada. |
| `donde` | `/login`. |
| `porQue` | Tenant explícito y MFA (CU-IAM-11). |
| `como` | Código de cooperativa si no hay subdominio; ayuda de formato bajo campos. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11; CU-29 |

## `PAN-IAM-02` — Login socio

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-02` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Ingreso portal/PWA del socio. |
| `quien` | Público / visitante registrado. |
| `cuando` | Autogestión. |
| `donde` | Landing o PWA login. |
| `porQue` | Canal digital (M19). |
| `como` | DNI/CUIT sin puntos; Google/CiDi si habilitados. |
| `casoDeUso.cuId` | `CU-REG-01` |
| `casoDeUso.resumen` | CU-REG-01 (M19) |

## `PAN-IAM-03` — MFA

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-03` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Segundo factor en login o step-up. |
| `quien` | Usuario en flujo de autenticación. |
| `cuando` | Política MFA o acción sensible. |
| `donde` | `/login/mfa`. |
| `porQue` | ASVS / DEC políticas seguridad. |
| `como` | TOTP, recuperación o dispositivo confiable según política. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-04` — Selección de ámbito

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-04` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Elegir cooperativa, contexto y sucursal/PV/caja. |
| `quien` | Sesión autenticada multi-ámbito. |
| `cuando` | Tras login o cambio de contexto. |
| `donde` | Selector en login o topbar. |
| `porQue` | Una identidad, varias pertenencias (CU-IAM-01). |
| `como` | Confirme antes de cambiar si hay cambios sin guardar. |
| `casoDeUso.cuId` | `CU-IAM-01` |
| `casoDeUso.resumen` | CU-IAM-01; CU-IAM-02 |

## `PAN-IAM-05` — Recuperar contraseña

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-05` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Solicitar y completar restablecimiento de contraseña. |
| `quien` | Público con correo o canal habilitado. |
| `cuando` | Olvido de clave o rotación forzada. |
| `donde` | «Olvidé mi contraseña» en login. |
| `porQue` | Autoservicio sin mesa de ayuda. |
| `como` | La respuesta es genérica aunque el mail no exista; cumpla política al elegir clave nueva. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-06` — Invitación y verificación

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-06` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Aceptar invitación de usuario o verificar correo. |
| `quien` | Token público de un solo uso. |
| `cuando` | Alta de staff invitado. |
| `donde` | Enlace del correo de invitación. |
| `porQue` | Identidad creada sin contraseña compartida. |
| `como` | Cree contraseña y complete MFA si el rol lo exige. |
| `casoDeUso.cuId` | `CU-29` |
| `casoDeUso.resumen` | CU-29 |

## `PAN-IAM-07` — Mi seguridad

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-07` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Autogestión de factores, sesiones y cuentas vinculadas. |
| `quien` | `iam.miCuenta.gestionar`. |
| `cuando` | Cambio de dispositivo o endurecimiento personal. |
| `donde` | Perfil → Seguridad. |
| `porQue` | El usuario controla su superficie de ataque. |
| `como` | Regenerar recuperación requiere step-up. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-08` — Bloqueo por inactividad

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-08` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Desbloqueo tras tiempo sin actividad. |
| `quien` | Sesión staff activa bloqueada. |
| `cuando` | Política de inactividad de la cooperativa. |
| `donde` | Overlay en pantalla actual. |
| `porQue` | Protege terminal compartida en caja. |
| `como` | Ingrese contraseña o factor; o cambie de usuario. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-09` — Usuarios staff

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-09` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | ABM e invitación de usuarios internos. |
| `quien` | `iam.usuarios.ver` (+ invitar según rol). |
| `cuando` | Alta cooperativa, rotaciones, auditoría MFA. |
| `donde` | IAM → Usuarios. |
| `porQue` | Mínimo privilegio y trazabilidad. |
| `como` | Invitar → asignar rol y perfil → verificar MFA. |
| `casoDeUso.cuId` | `CU-29` |
| `casoDeUso.resumen` | CU-29; CU-GOB-01 |

## `PAN-IAM-10` — Ficha de usuario

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-10` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Roles, perfiles, permisos efectivos y sesiones. |
| `quien` | `iam.usuarios.ver`. |
| `cuando` | Diagnóstico de acceso o recertificación. |
| `donde` | Desde lista usuarios. |
| `porQue` | Explicar por qué algo está habilitado (AGR-008). |
| `como` | Pestaña Permisos efectivos con traza. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01; CU-IAM-02 |

## `PAN-IAM-11` — Roles

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-11` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Definición de capabilities por rol. |
| `quien` | `iam.roles.ver` / `editar`. |
| `cuando` | Diseño de seguridad del tenant. |
| `donde` | IAM → Roles. |
| `porQue` | Modelo `modulo.recurso.accion` (CU-ACC-01). |
| `como` | Use plantillas plataforma; marque S/D según impacto. |
| `casoDeUso.cuId` | `CU-ACC-01` |
| `casoDeUso.resumen` | CU-ACC-01 |

## `PAN-IAM-12` — Perfiles de pantallas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-12` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Qué menús y pantallas ve cada usuario. |
| `quien` | `iam.perfiles.ver` / `editar`. |
| `cuando` | Onboarding de áreas o restricción horaria. |
| `donde` | IAM → Perfiles. |
| `porQue` | Capa 3 del licenciamiento (BASE §45). |
| `como` | Árbol de pantallas; pruebe vista previa de menú. |
| `casoDeUso.cuId` | `CU-ACC-01` |
| `casoDeUso.resumen` | CU-ACC-01; CU-IAM-09 |

## `PAN-IAM-13` — Segregación de funciones (SoD)

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-13` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Reglas de conflictos, excepciones y recertificación. |
| `quien` | `iam.sod.configurar`. |
| `cuando` | Diseño de controles internos. |
| `donde` | IAM → SoD. |
| `porQue` | Evita combinaciones de permisos peligrosas. |
| `como` | Revise conflictos abiertos antes de aprobar excepciones. |
| `casoDeUso.cuId` | `CU-ACC-01` |
| `casoDeUso.resumen` | CU-ACC-01 |

## `PAN-IAM-14` — Explicador de permisos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-14` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Simula por qué un usuario tiene o no acceso. |
| `quien` | `iam.permisos.explicar`. |
| `cuando` | Soporte y capacitación. |
| `donde` | IAM → Explicar. |
| `porQue` | Transparencia sin suplantar (AGR-008). |
| `como` | Elija usuario + pantalla/capability; lea traza de 11 pasos. |
| `casoDeUso.cuId` | `CU-ACC-01` |
| `casoDeUso.resumen` | CU-ACC-01 |

## `PAN-IAM-15` — Bandeja autorizaciones

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-15` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Aprobar/rechazar acciones que requieren supervisor. |
| `quien` | `iam.autorizaciones.bandeja`. |
| `cuando` | Límites, SoD o fuera de alcance. |
| `donde` | Autorizaciones. |
| `porQue` | Reemplazo ValidarPermiso ProCoop. |
| `como` | Step-up al aprobar; comentario obligatorio. |
| `casoDeUso.cuId` | `CU-IAM-04` |
| `casoDeUso.resumen` | CU-IAM-04 |

## `PAN-IAM-16` — Autorización de supervisor

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-16` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Validación presencial o diferida de acción sensible. |
| `quien` | Supervisor con capability o bandeja. |
| `cuando` | La operación exige segundo par de ojos. |
| `donde` | Modal contextual. |
| `porQue` | Reemplazo ValidarPermiso ProCoop. |
| `como` | Supervisor presente ingresa credenciales; si no, solicite aprobación diferida. |
| `casoDeUso.cuId` | `CU-IAM-04` |
| `casoDeUso.resumen` | CU-IAM-04 |

## `PAN-IAM-17` — Auditoría de cambios

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-17` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Consulta del registro inmutable de cambios. |
| `quien` | `iam.auditoria.cambios.ver`. |
| `cuando` | Investigación o control interno. |
| `donde` | Auditoría → Cambios. |
| `porQue` | GOB / CU-GOB-01. |
| `como` | Filtre por módulo y fecha; exportar con permiso. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-18` — Auditoría de accesos

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-18` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Consulta de inicios de sesión y resultados. |
| `quien` | `iam.auditoria.accesos.ver`. |
| `cuando` | Investigación de acceso indebido. |
| `donde` | Auditoría → Accesos. |
| `porQue` | Trazabilidad de autenticación. |
| `como` | Filtre por usuario, IP o rango de fechas. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-19` — Auditoría de lecturas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-19` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Registro de consultas a datos sensibles y exportaciones. |
| `quien` | `iam.auditoria.lecturas.ver`. |
| `cuando` | Control de acceso a información clasificada. |
| `donde` | Auditoría → Lecturas. |
| `porQue` | Ley 25.326 y políticas internas. |
| `como` | Revise informe o exportación con hash registrado. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-20` — Auditoría de mensajes

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-20` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Trazabilidad de correos, SMS y notificaciones. |
| `quien` | `iam.auditoria.mensajes.ver`. |
| `cuando` | El socio dice no haber recibido aviso. |
| `donde` | Auditoría → Mensajes. |
| `porQue` | Prueba de entrega al canal. |
| `como` | Destinatario parcialmente enmascarado; enlace a detalle T09 si aplica. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-21` — Auditoría de IA

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-21` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Invocaciones de IA con decisión humana y costo. |
| `quien` | `iam.auditoria.ia.ver`. |
| `cuando` | Revisión de uso de asistente. |
| `donde` | Auditoría → IA. |
| `porQue` | IA propone, no ejecuta sola (P6). |
| `como` | Abra detalle para ver entrada minimizada y salida. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-22` — Políticas de seguridad

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-22` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | MFA, contraseña, sesión y login socio del tenant. |
| `quien` | `iam.politicas.ver` / `configurar`. |
| `cuando` | Endurecer seguridad o habilitar canales. |
| `donde` | IAM → Políticas. |
| `porQue` | Centraliza parámetros de T02 publicados vía T04. |
| `como` | Simule impacto en roles antes de publicar. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-23` — SSO e identidad federada

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-23` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Proveedores OIDC, Google, CiDi y prueba de conexión. |
| `quien` | `iam.idp.configurar`. |
| `cuando` | Habilitar login corporativo o CiDi. |
| `donde` | IAM → SSO. |
| `porQue` | Menos contraseñas locales; mapeo de atributos. |
| `como` | Secreto en bóveda; pruebe antes de activar en producción. |
| `casoDeUso.cuId` | `CU-IAM-11` |
| `casoDeUso.resumen` | CU-IAM-11 |

## `PAN-IAM-24` — Clientes API

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-24` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Alta de clientes API, scopes y rotación de secreto. |
| `quien` | `iam.apiClientes.ver` / `gestionar`. |
| `cuando` | Integración con terceros. |
| `donde` | IAM → API clientes. |
| `porQue` | Acceso máquina con trazabilidad de uso. |
| `como` | Copie secreto una sola vez; rote ante compromiso. |
| `casoDeUso.cuId` | `CU-ACC-01` |
| `casoDeUso.resumen` | CU-ACC-01 |

## `PAN-IAM-25` — Usuarios del portal

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-25` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Accesos de socios al portal (sin ver contraseñas). |
| `quien` | `iam.portal.usuarios.ver`. |
| `cuando` | Soporte o bloqueo de acceso abusivo. |
| `donde` | IAM → Usuarios portal. |
| `porQue` | M01 relaciones; IAM solo acceso digital. |
| `como` | Desvincular cuenta requiere motivo auditado. |
| `casoDeUso.cuId` | `CU-29` |
| `casoDeUso.resumen` | CU-29 |

## `PAN-IAM-26` — IAM plataforma

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-26` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Usuarios y plantillas de rol de plataforma GoodApps. |
| `quien` | Roles `iam.plataforma.*`. |
| `cuando` | Onboarding de cooperativa o actualización plantilla. |
| `donde` | Consola plataforma. |
| `porQue` | Roles semilla sin mezclar datos de tenant. |
| `como` | Publique versión; cada tenant adopta cuando quiera. |
| `casoDeUso.cuId` | `CU-IAM-05` |
| `casoDeUso.resumen` | CU-IAM-05 |

## `PAN-IAM-27` — Soporte temporal

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-27` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Aprobar o revocar acceso de soporte GoodApps al tenant. |
| `quien` | Admin tenant y rol plataforma según flujo. |
| `cuando` | Incidente o configuración asistida. |
| `donde` | IAM soporte / plataforma. |
| `porQue` | AGR-034 consentimiento auditado. |
| `como` | Ventana acotada; revise actuaciones al cierre. |
| `casoDeUso.cuId` | `CU-IAM-05` |
| `casoDeUso.resumen` | CU-IAM-05 |

## `PAN-IAM-28` — Seguridad plataforma

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-28` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Auditoría cross-tenant, alertas e integridad de cadenas. |
| `quien` | `iam.plataforma.auditoria.ver`. |
| `cuando` | Operación GoodApps o incidente grave. |
| `donde` | Plataforma → Seguridad. |
| `porQue` | DEC-116 solo rol plataforma en BI/seguridad global. |
| `como` | Reconozca alerta y documente resolución. |
| `casoDeUso.cuId` | `CU-IAM-05` |
| `casoDeUso.resumen` | CU-IAM-05 |

## `PAN-IAM-29` — Sesiones activas

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-29` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Listado y cierre de sesiones del tenant. |
| `quien` | `iam.sesiones.ver`. |
| `cuando` | Robo de sesión sospechado o fin de jornada compartida. |
| `donde` | IAM → Sesiones. |
| `porQue` | Equivalente a conexiones abiertas ProCoop. |
| `como` | Cierre una sesión o todas las de un usuario. |
| `casoDeUso.cuId` | `CU-GOB-01` |
| `casoDeUso.resumen` | CU-GOB-01 |

## `PAN-IAM-30` — Conflicto de edición

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-30` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Aviso de edición simultánea y resolución de conflicto. |
| `quien` | Sesión en formulario con optimistic lock. |
| `cuando` | Dos usuarios guardan el mismo registro. |
| `donde` | Banner o modal 409. |
| `porQue` | Evita pérdida silenciosa de cambios. |
| `como` | Compare diff; recargue o reaplique cambios no conflictivos. |
| `casoDeUso.cuId` | `CU-IAM-02` |
| `casoDeUso.resumen` | CU-IAM-02 |

## `PAN-IAM-31` — Importar usuarios

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-31` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Carga masiva de usuarios staff desde Excel. |
| `quien` | `iam.usuarios.importar`. |
| `cuando` | Apertura de sucursal o migración de legajos. |
| `donde` | Wizard desde lista de usuarios. |
| `porQue` | Onboarding rápido con validación por fila. |
| `como` | Use plantilla; corrija errores antes de confirmar. |
| `casoDeUso.cuId` | `CU-29` |
| `casoDeUso.resumen` | CU-29 |

## `PAN-IAM-32` — Vincular cuenta (portal)

| Campo | Contenido |
|---|---|
| `screenId` | `PAN-IAM-32` |
| `scope` | `base` |
| `status` | `draft` |
| `que` | Flujo de vinculación DNI/cuenta con prueba de titularidad. |
| `quien` | `por.cuentas.vincular`. |
| `cuando` | Socio agrega suministro en portal. |
| `donde` | `/vincular-cuenta`. |
| `porQue` | Paridad con PAN-PER-26 en contexto portal. |
| `como` | Textos personalizables por tenant; no comparta códigos por teléfono inseguro. |
| `casoDeUso.cuId` | `CU-REG-01` |
| `casoDeUso.resumen` | CU-REG-01 (M19) |
