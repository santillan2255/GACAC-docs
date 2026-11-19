# Pantallas de los anexos M01 a M15 y su ubicación en el mapa

Parte del entregable [22 Mapa de navegación y arquitectura de información](../22-mapa-navegacion.md) (artefacto 4.1). Generado con `_trabajo/gen_22_navegacion.py` desde T03 §10.8 y §10.9 y las pantallas (PAN) de los anexos; revisado a mano. Ante cualquier diferencia prevalece T03 y el anexo dueño de la pantalla.

Cada PAN definido en el anexo, con la ruta que declara el anexo, el portal y su ubicación en el mapa del sitio (ítem `SM-*` de T03). La ruta canónica es la del ítem.

## 1. M01 PER

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-PER-01 | Búsqueda de titulares y cuentas | `/admin/per/titulares` | Admin de la cooperativa | SM-ADM-007 | Principal del ítem |
| PAN-PER-02 | Ficha 360 del titular | `/admin/per/titulares/:holderId` | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-PER-03 | Personas | `/admin/per/personas`, `/:personId` | Admin de la cooperativa | SM-ADM-006 | Principal del ítem |
| PAN-PER-04 | Alta y edición de persona | — | Admin de la cooperativa | SM-ADM-006 | Asociada al ítem |
| PAN-PER-05 | Cuenta | `/admin/per/cuentas/:accountId` | Admin de la cooperativa | SM-ADM-008 | Principal del ítem |
| PAN-PER-06 | Editor de domicilio con mapa | — | Admin de la cooperativa | SM-ADM-010 | Asociada al ítem |
| PAN-PER-07 | Inmuebles | `/admin/per/inmuebles`, `/:premiseId` | Admin de la cooperativa | SM-ADM-010 | Principal del ítem |
| PAN-PER-08 | Puntos de prestación | `/admin/per/puntos`, `/:servicePointId` | Admin de la cooperativa | SM-ADM-260 | Principal del ítem |
| PAN-PER-09 | Relaciones y representaciones | `/` | Admin de la cooperativa | SM-ADM-011 | Principal del ítem |
| PAN-PER-10 | Adherentes y beneficiarios | — | Admin de la cooperativa | SM-ADM-012 | Principal del ítem |
| PAN-PER-11 | Notas | — | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-PER-12 | Bloqueos | — | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-PER-13 | Documentación y requisitos | `/admin/per/documentacion` | Admin de la cooperativa | SM-ADM-013 | Principal del ítem |
| PAN-PER-14 | Asistente de transferencia | `/admin/per/transferencias/nueva` | Admin de la cooperativa | SM-ADM-262 | Asociada al ítem |
| PAN-PER-15 | Transferencias | `/admin/per/transferencias`, `/:transferId` | Admin de la cooperativa | SM-ADM-262 | Principal del ítem |
| PAN-PER-16 | Registrar fallecimiento | — | Admin de la cooperativa | SM-ADM-006 | Asociada al ítem |
| PAN-PER-17 | Baja y reactivación de titular | — | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-PER-18 | Duplicados y fusión | `/admin/per/duplicados` | Admin de la cooperativa | SM-ADM-014 | Principal del ítem |
| PAN-PER-19 | Historial | — | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-PER-20 | Padrón de titulares | `/admin/per/padron` | Admin de la cooperativa | SM-ADM-015 | Principal del ítem |
| PAN-PER-21 | Operaciones especiales | `/admin/per/operaciones-especiales` | Admin de la cooperativa | SM-ADM-263 | Principal del ítem |
| PAN-PER-22 | Configuración del módulo | `/admin/per/configuracion` | Admin de la cooperativa | SM-ADM-016 | Principal del ítem |
| PAN-PER-23 | Privacidad y derechos | `/admin/per/privacidad` | Admin de la cooperativa | SM-ADM-264 | Principal del ítem |
| PAN-PER-24 | Importación | `/admin/per/importar` | Admin de la cooperativa | SM-ADM-265 | Principal del ítem |
| PAN-PER-25 | PWA "Mis datos" | `/app/mis-datos` | PWA socio | SM-PWS-033 | Principal del ítem |
| PAN-PER-26 | PWA "Vincular cuenta" | `/app/vincular` | PWA socio | SM-PWS-004 | Asociada al ítem |
| PAN-PER-27 | PWA "Autorizados y representantes" | `/app/autorizados` | PWA socio | SM-PWS-034 | Asociada al ítem |
| PAN-PER-28 | Mapa de domicilios y puntos | `/admin/per/mapa` | Admin de la cooperativa | SM-ADM-261 | Principal del ítem |

## 2. M02 CAT

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-CAT-01 | Catálogo global de capacidades. DataTable: código, dominio, estado, madurez... | `/platform/cat/capabilities` | Plataforma | SM-PLT-007 | Principal del ítem |
| PAN-CAT-02 | Matriz tenants × capacidades (CU-CAT-01) con estado, fechas, licencia.... | `/platform/cat/enablement`, `/suscriptores` | Plataforma | SM-PLT-004 | Asociada al ítem |
| PAN-CAT-03 | Servicios del tenant. Columnas: código, nombre, dominio, oferta... | `/admin/cat/services` | Admin de la cooperativa | SM-ADM-017 | Principal del ítem |
| PAN-CAT-04 | Ficha de configuración del servicio en pestañas: General (código, nombre, tipo... | `/admin/cat/services/:id` | Admin de la cooperativa | SM-ADM-022 | Principal del ítem |
| PAN-CAT-05 | Versiones: lista con estado y fecha efectiva; detalle con diff lado a lado... | `/admin/cat/services/:id/versions` | Admin de la cooperativa | SM-ADM-017 | Asociada al ítem |
| PAN-CAT-06 | Productos/subservicios y conceptos facturables por servicio (dos pestañas).... | `/admin/cat/products` | Admin de la cooperativa | SM-ADM-019 | Principal del ítem |
| PAN-CAT-07 | Planes y versiones: código, producto, estado, versión vigente, contratos por... | `/admin/cat/plans` | Admin de la cooperativa | SM-ADM-018 | Principal del ítem |
| PAN-CAT-08 | Categorías y grupos por servicio: código, nombre, grupo, social, prepaga... | `/admin/cat/categories` | Admin de la cooperativa | SM-ADM-020 | Principal del ítem |
| PAN-CAT-09 | Clases de servicio (valores 1 y 2) y propiedades del servicio y personalizadas... | `/admin/cat/classes-properties` | Admin de la cooperativa | SM-ADM-021 | Principal del ítem |
| PAN-CAT-10 | Estados operativos por servicio: código, nombre, canónico, implica desconexión... | `/admin/cat/statuses` | Admin de la cooperativa | SM-ADM-017 | Asociada al ítem |
| PAN-CAT-11 | Reglas de altas automáticas: evento, servicio origen/destino, categoría... | `/admin/cat/auto-rules` | Admin de la cooperativa | SM-ADM-266 | Principal del ítem |
| PAN-CAT-12 | Conceptos por evento y bonificaciones de conexión: tipo de evento, concepto... | `/admin/cat/event-charges` | Admin de la cooperativa | SM-ADM-037 | Asociada al ítem |
| PAN-CAT-13 | Contratos: número, titular (nombre y DNI/CUIT enmascarado según permiso)... | `/admin/cat/contracts` | Admin de la cooperativa | SM-ADM-024 | Principal del ítem |
| PAN-CAT-14 | Ficha del contrato por bloques (RF-CAT-068): Cabecera, Ubicación (mapa)... | `/admin/cat/contracts/:id` | Admin de la cooperativa | SM-ADM-024 | Asociada al ítem |
| PAN-CAT-15 | Asistente de alta (modal xl, pasos): 1 titular y cuenta (búsqueda PER), 2... | `/admin/cat/contracts/new` | Admin de la cooperativa | SM-ADM-024 | Asociada al ítem |
| PAN-CAT-16 | modales en PAN-CAT-14 | — | Admin de la cooperativa | SM-ADM-024 | Asociada al ítem |
| PAN-CAT-17 | Trámites masivos: elegir operación, criterio o lista (importación Excel)... | `/admin/cat/bulk-operations` | Admin de la cooperativa | SM-ADM-025 | Principal del ítem |
| PAN-CAT-18 | Asistente de copia: origen (tenant/servicio/versión autorizados), destino... | `/admin/cat/copies` | Admin de la cooperativa | SM-ADM-023 | Principal del ítem |
| PAN-CAT-19 | Equipos en comodato: por contrato y bandeja global de devoluciones... | `/admin/cat/equipment-loans` | Admin de la cooperativa | SM-ADM-130 | Asociada al ítem |
| PAN-CAT-20 | Reemplazado por PAN-SOC-01 y PAN-SOC-02 (M18, DEC-071, HUECO-TRV-01); la... | `/admin/cat/contracts/:id/members` | Admin de la cooperativa | SM-ADM-012 | Asociada al ítem |
| PAN-CAT-21 | Componente embebido en PAN-POR-31 (M19 es dueño de la ruta /app/contratar y de... | `/servicios/disponibles`, `/app/contratar` | PWA socio | SM-PWS-005 | Asociada al ítem |
| PAN-CAT-22 | Componente embebido en PAN-POR-29 y PAN-POR-30 (M19 es dueño de las rutas... | `/servicios/mios`, `/app/servicios` | PWA socio | SM-PWS-002 | Asociada al ítem |
| PAN-CAT-23 | por.ofertas.ver (pública; antes public.ofertas.ver, originalmente «público») | `/:tenantSlug/servicios`, `/servicios` | Landing | SM-LND-002 | Asociada al ítem |
| PAN-CAT-24 | Tablero: indicadores de sección 15 con filtros por servicio y período. | `/admin/cat/dashboard` | Admin de la cooperativa | SM-ADM-268 | Principal del ítem |
| PAN-CAT-25 | pestaña en PAN-CAT-14 (GAS, ELE; HUE-GAS-01) | — | Admin de la cooperativa | SM-ADM-024 | Asociada al ítem |
| PAN-CAT-26 | Concesiones y fuentes normativas por servicio con vigencia y verificación. | `/admin/cat/concessions` | Admin de la cooperativa | SM-ADM-017 | Asociada al ítem |
| PAN-CAT-27 | Paquetes de prestaciones: planes incluidos, reglas de baja parcial, vigencia. | `/admin/cat/bundles` | Admin de la cooperativa | SM-ADM-267 | Principal del ítem |

## 3. M03 MED

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-MED-01 | Marcas, tipos/modelos, observaciones de lectura y de medidor, resultados... | `/med/config/catalogos` | Admin de la cooperativa | SM-ADM-269 | Principal del ítem |
| PAN-MED-02 | Listado y ficha del medidor con trayectoria, ensayos, precintos, adjuntos. | `/med/medidores`, `/med/medidores/:id` | Admin de la cooperativa | SM-ADM-026 | Principal del ítem |
| PAN-MED-03 | Punto de medición: canales, medidor vigente, instalaciones, ruta, testigo, GD... | `/med/puntos`, `/med/puntos/:id` | Admin de la cooperativa | SM-ADM-026 | Asociada al ítem |
| PAN-MED-04 | desde PAN-MED-02/03 | — | Admin de la cooperativa | SM-ADM-026 | Asociada al ítem |
| PAN-MED-05 | ABM de rutas con vista previa en mapa. | `/med/rutas` | Admin de la cooperativa | SM-ADM-027 | Principal del ítem |
| PAN-MED-06 | Calendario de lectura por servicio/ciclo/ruta y ventanas de autolectura. | `/med/cronograma` | Admin de la cooperativa | SM-ADM-027 | Asociada al ítem |
| PAN-MED-07 | Lotes: generar, asignar, exportar, seguimiento de avance en lista y mapa. | `/med/lotes` | Admin de la cooperativa | SM-ADM-271 | Principal del ítem |
| PAN-MED-08 | Detalle y revisión del lote con filtros, confirmación, cierre. | `/med/lotes/:id` | Admin de la cooperativa | SM-ADM-028 | Asociada al ítem |
| PAN-MED-09 | Registro manual de lecturas. | `/med/lecturas/registro` | Admin de la cooperativa | SM-ADM-028 | Principal del ítem |
| PAN-MED-10 | Importación de archivos y perfiles de mapeo. | `/med/lecturas/importar`, `/med/config/perfiles-importacion` | Admin de la cooperativa | SM-ADM-028 | Asociada al ítem |
| PAN-MED-11 | Bandeja de excepciones de consumo. | `/med/excepciones` | Admin de la cooperativa | SM-ADM-029 | Principal del ítem |
| PAN-MED-12 | Consumos del servicio: historial, gráfico, acciones. | `/med/consumos/servicio/:contractId` | Admin de la cooperativa | SM-ADM-029 | Asociada al ítem |
| PAN-MED-13 | desde PAN-MED-12 | — | Admin de la cooperativa | SM-ADM-029 | Asociada al ítem |
| PAN-MED-14 | Estimación masiva con recálculo, inversión de selección y "sumar mes". | `/med/consumos/estimacion` | Admin de la cooperativa | SM-ADM-030 | Principal del ítem |
| PAN-MED-15 | Regularización de estimados. | `/med/consumos/regularizacion` | Admin de la cooperativa | SM-ADM-030 | Asociada al ítem |
| PAN-MED-16 | División/agrupación/prorrateo masivo. | `/med/consumos/division` | Admin de la cooperativa | SM-ADM-273 | Principal del ítem |
| PAN-MED-17 | ABM y ejecución de distribuciones. | `/med/consumos/distribuciones` | Admin de la cooperativa | SM-ADM-030 | Asociada al ítem |
| PAN-MED-18 | Medidores testigo y sus consumos. | `/med/testigos` | Admin de la cooperativa | SM-ADM-270 | Principal del ítem |
| PAN-MED-19 | Demanda contratada por período y transgresiones. | `/med/demanda` | Admin de la cooperativa | SM-ADM-274 | Principal del ítem |
| PAN-MED-20 | Factores de corrección de gas por período/categoría. Reemplazado por PAN-TAR-09... | `/med/config/factores-gas` | Admin de la cooperativa | SM-ADM-275 | Principal del ítem |
| PAN-MED-21 | Medición propia y pérdidas. | `/med/medicion-propia` | Admin de la cooperativa | SM-ADM-276 | Principal del ítem |
| PAN-MED-22 | Informes y controles de consumo. | `/med/informes` | Admin de la cooperativa | SM-ADM-035 | Principal del ítem |
| PAN-MED-23 | Sistemas de telemedición/prepago y mapeo de registros. | `/med/config/telemedicion` | Admin de la cooperativa | SM-ADM-033 | Principal del ítem |
| PAN-MED-24 | Operaciones y comandos remotos, toma de estado puntual, auditoría. | `/med/telemedicion/operaciones` | Admin de la cooperativa | SM-ADM-032 | Principal del ítem |
| PAN-MED-25 | Cuentas prepagas, recargas, tokens, fallidas, conciliación. | `/med/prepago` | Admin de la cooperativa | SM-ADM-034 | Principal del ítem |
| PAN-MED-26 | Contratos GD y balances. | `/med/generacion-distribuida` | Admin de la cooperativa | SM-ADM-277 | Principal del ítem |
| PAN-MED-27 | Tablero de lecturas y consumos. | `/med/tablero` | Admin de la cooperativa | SM-ADM-035 | Asociada al ítem |
| PAN-MED-28 | Mis rutas/lotes asignados, descarga, avance. | `/campo/lecturas` | PWA campo | SM-PWC-009 | Principal del ítem |
| PAN-MED-29 | Captura de lectura. | `/campo/lecturas/:batchId/:taskId` | PWA campo | SM-PWC-010 | Principal del ítem |
| PAN-MED-30 | banner + /campo/sincronizacion | `/campo/sincronizacion` | PWA campo | SM-PWC-016 | Asociada al ítem |
| PAN-MED-31 | Mis consumos. Componente embebido en PAN-POR-47 (HUE-SRV-04): la ruta y el... | `/mis-servicios/:id/consumos`, `/app/consumos` | PWA socio | SM-PWS-014 | Asociada al ítem |
| PAN-MED-32 | Autolectura. Componente embebido en PAN-POR-48 (HUE-SRV-04): ruta... | `/mis-servicios/:id/autolectura`, `/app/autolectura/:contractId` | Admin de la cooperativa | SM-ADM-031 | Asociada al ítem |
| PAN-MED-33 | Mi prepago. Componente embebido en PAN-POR-49 (HUE-SRV-04): ruta /app/prepaga... | `/mis-servicios/:id/prepago`, `/app/prepaga` | PWA socio | SM-PWS-016 | Asociada al ítem |
| PAN-MED-34 | Conflictos de sincronización offline. | `/med/conflictos` | Admin de la cooperativa | SM-ADM-272 | Principal del ítem |
| PAN-MED-35 | Propuestas de cambio de clase por consumo. | `/med/consumos/cambio-clase` | Admin de la cooperativa | SM-ADM-029 | Asociada al ítem |

## 4. M04 TAR

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-TAR-01 | Listado de versiones de cuadros. | `/admin/tarifas/cuadros` | Admin de la cooperativa | SM-ADM-036 | Principal del ítem |
| PAN-TAR-02 | Editor de versión. | `/admin/tarifas/cuadros/:id` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-03 | Editor de categoría y escalones. | `/admin/tarifas/cuadros/:id/categorias/:cat` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-04 | Actualización masiva de precios. | `/admin/tarifas/cuadros/actualizacion-masiva` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-05 | Importar tarifas desde planilla. | `/admin/tarifas/cuadros/importar` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-06 | Listado de reglas. | `/admin/tarifas/reglas` | Admin de la cooperativa | SM-ADM-038 | Principal del ítem |
| PAN-TAR-07 | tar.reglas.editar, tar.formulas.editar | `/admin/tarifas/reglas/:id` | Admin de la cooperativa | SM-ADM-038 | Asociada al ítem |
| PAN-TAR-08 | Catálogo de funciones y variables GFL. | `/admin/tarifas/funciones` | Admin de la cooperativa | SM-ADM-038 | Asociada al ítem |
| PAN-TAR-09 | Factores de gas por período/zona/categoría. Pantalla única de factores... | `/admin/tarifas/gas/factores` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-10 | Coeficientes por categoría y fecha. | `/admin/tarifas/coeficientes` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-11 | Grupos de beneficio. | `/admin/tarifas/grupos` | Admin de la cooperativa | SM-ADM-039 | Asociada al ítem |
| PAN-TAR-12 | Regímenes, padrones e inscripciones. | `/admin/tarifas/subsidios` | Admin de la cooperativa | SM-ADM-040 | Principal del ítem |
| PAN-TAR-13 | Exportación al organismo. | `/admin/tarifas/subsidios/exportar` | Admin de la cooperativa | SM-ADM-040 | Asociada al ítem |
| PAN-TAR-14 | Promociones y asignaciones. | `/admin/tarifas/promociones` | Admin de la cooperativa | SM-ADM-039 | Principal del ítem |
| PAN-TAR-15 | Simulador individual. | `/admin/tarifas/simulador` | Admin de la cooperativa | SM-ADM-041 | Principal del ítem |
| PAN-TAR-16 | Simulador masivo comparativo. | `/admin/tarifas/simulador/masivo` | Admin de la cooperativa | SM-ADM-041 | Asociada al ítem |
| PAN-TAR-17 | Explicación técnica de un cálculo. | `/admin/tarifas/calculos/:id` | Admin de la cooperativa | SM-ADM-041 | Asociada al ítem |
| PAN-TAR-18 | Catálogo de cargos por evento y bonificaciones. Incluye los disparadores... | `/admin/tarifas/cargos-evento` | Admin de la cooperativa | SM-ADM-037 | Principal del ítem |
| PAN-TAR-19 | Configuración de tasación. | `/admin/tarifas/telefonia` | Admin de la cooperativa | SM-ADM-109 | Asociada al ítem |
| PAN-TAR-20 | Simulador de tasación y retasación. | `/admin/tarifas/telefonia/tasacion` | Admin de la cooperativa | SM-ADM-109 | Asociada al ítem |
| PAN-TAR-21 | Bandeja de aprobaciones. | `/admin/tarifas/aprobaciones` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |
| PAN-TAR-22 | Diferencias retroactivas. | `/admin/tarifas/retroactivos` | Admin de la cooperativa | SM-ADM-041 | Asociada al ítem |
| PAN-TAR-23 | tar.explicacion.ver (antes pwa.factura.explicacion.ver) | `/facturas/:id/detalle` | PWA socio | SM-PWS-008 | Asociada al ítem |
| PAN-TAR-24 | — (pantalla pública sin login, sin capability; antes public.cuadros.ver) | `/tarifas` | Landing | SM-LND-023 | Principal del ítem |
| PAN-TAR-25 | Políticas de redondeo. | `/admin/tarifas/redondeo` | Admin de la cooperativa | SM-ADM-278 | Principal del ítem |
| PAN-TAR-26 | Recálculo masivo de bonificaciones de unidades. | `/admin/tarifas/bonificaciones/recalculo` | Admin de la cooperativa | SM-ADM-039 | Asociada al ítem |
| PAN-TAR-27 | Parámetros del módulo (PRM-TAR). | `/admin/tarifas/configuracion` | Admin de la cooperativa | SM-ADM-279 | Principal del ítem |
| PAN-TAR-28 | Cargos extraordinarios precargados. | `/admin/tarifas/precargados` | Admin de la cooperativa | SM-ADM-037 | Asociada al ítem |
| PAN-TAR-29 | Precios de vivienda por categoría y fecha. Reemplazado por PAN-SOC-17... | `/admin/tarifas/precios-vivienda`, `/soc/vivienda/planes` | Admin de la cooperativa | SM-ADM-036 | Asociada al ítem |

## 5. M05 FAC

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-FAC-01 | Tablero de facturación | `/admin/fac` | Admin de la cooperativa | SM-ADM-280 | Principal del ítem |
| PAN-FAC-02 | Ciclos de facturación | `/admin/fac/ciclos` | Admin de la cooperativa | SM-ADM-042 | Principal del ítem |
| PAN-FAC-03 | Universos y conjuntos | `/admin/fac/universos` | Admin de la cooperativa | SM-ADM-042 | Asociada al ítem |
| PAN-FAC-04 | Plantillas de corrida | `/admin/fac/plantillas` | Admin de la cooperativa | SM-ADM-042 | Asociada al ítem |
| PAN-FAC-05 | Lotes | `/admin/fac/lotes` | Admin de la cooperativa | SM-ADM-043 | Principal del ítem |
| PAN-FAC-06 | Nuevo lote (asistente) | `/admin/fac/lotes/nuevo` | Admin de la cooperativa | SM-ADM-043 | Asociada al ítem |
| PAN-FAC-07 | Detalle de lote | `/admin/fac/lotes/:id` | Admin de la cooperativa | SM-ADM-043 | Asociada al ítem |
| PAN-FAC-08 | Bandeja de excepciones | `/admin/fac/excepciones` | Admin de la cooperativa | SM-ADM-044 | Principal del ítem |
| PAN-FAC-09 | Comprobantes | `/admin/fac/comprobantes` | Admin de la cooperativa | SM-ADM-045 | Principal del ítem |
| PAN-FAC-10 | Detalle de comprobante | `/admin/fac/comprobantes/:id` | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-11 | Factura manual | `/admin/fac/comprobantes/nuevo` | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-12 | Replicar comprobante | — | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-13 | Refacturación puntual | `/admin/fac/refacturacion` | Admin de la cooperativa | SM-ADM-047 | Asociada al ítem |
| PAN-FAC-14 | Anulación y reversión | `/admin/fac/anulaciones` | Admin de la cooperativa | SM-ADM-047 | Principal del ítem |
| PAN-FAC-15 | Relaciones del comprobante | — | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-16 | Bloqueo de comprobantes | `/admin/fac/bloqueos` | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-17 | Causas de bloqueo | `/admin/fac/config/causas-bloqueo` | Admin de la cooperativa | SM-ADM-045 | Asociada al ítem |
| PAN-FAC-18 | Modificación masiva | `/admin/fac/modificacion-masiva` | Admin de la cooperativa | SM-ADM-281 | Principal del ítem |
| PAN-FAC-19 | Recategorización | `/admin/fac/recategorizacion` | Admin de la cooperativa | SM-ADM-282 | Principal del ítem |
| PAN-FAC-20 | Retroactivos | `/admin/fac/retroactivos` | Admin de la cooperativa | SM-ADM-283 | Principal del ítem |
| PAN-FAC-21 | Cargos pendientes | `/admin/fac/cargos` | Admin de la cooperativa | SM-ADM-048 | Principal del ítem |
| PAN-FAC-22 | Importaciones de terceros | `/admin/fac/importaciones` | Admin de la cooperativa | SM-ADM-284 | Principal del ítem |
| PAN-FAC-23 | Tipos de comprobante y matriz | `/admin/fac/config/tipos-comprobante` | Admin de la cooperativa | SM-ADM-287 | Principal del ítem |
| PAN-FAC-24 | Puntos de venta y numeradores | `/admin/fac/config/puntos-venta` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FAC-25 | Grupos de facturación | `/admin/fac/grupos` | Admin de la cooperativa | SM-ADM-009 | Principal del ítem |
| PAN-FAC-26 | Modalidad de facturación | `/admin/fac/config/modalidad` | Admin de la cooperativa | SM-ADM-288 | Principal del ítem |
| PAN-FAC-27 | Tramas de recargo | `/admin/fac/config/tramas` | Admin de la cooperativa | SM-ADM-289 | Principal del ítem |
| PAN-FAC-28 | Diseño de comprobantes | `/admin/fac/config/diseno` | Admin de la cooperativa | SM-ADM-290 | Principal del ítem |
| PAN-FAC-29 | Gráficos y orden de renglones | `/admin/fac/config/graficos` | Admin de la cooperativa | SM-ADM-290 | Asociada al ítem |
| PAN-FAC-30 | Formatos de código de barras | `/admin/fac/config/codigos` | Admin de la cooperativa | SM-ADM-291 | Principal del ítem |
| PAN-FAC-31 | Distribución | `/admin/fac/distribucion` | Admin de la cooperativa | SM-ADM-049 | Principal del ítem |
| PAN-FAC-32 | Talones y documentos de pago | `/admin/fac/talones` | Admin de la cooperativa | SM-ADM-049 | Asociada al ítem |
| PAN-FAC-33 | Rutas de reparto y correos | `/admin/fac/config/reparto` | Admin de la cooperativa | SM-ADM-049 | Asociada al ítem |
| PAN-FAC-34 | Franqueo según facturas | `/admin/fac/franqueo` | Admin de la cooperativa | SM-ADM-049 | Asociada al ítem |
| PAN-FAC-35 | Cierre de ciclo | `/admin/fac/cierres` | Admin de la cooperativa | SM-ADM-285 | Principal del ítem |
| PAN-FAC-36 | Reportes de facturación | `/admin/fac/reportes` | Admin de la cooperativa | SM-ADM-050 | Principal del ítem |
| PAN-FAC-37 | CVLP | `/admin/fac/cvlp` | Admin de la cooperativa | SM-ADM-286 | Principal del ítem |
| PAN-FAC-38 | Comprobantes de administración pública | `/admin/fac/administracion-publica` | Admin de la cooperativa | SM-ADM-295 | Asociada al ítem |
| PAN-FAC-39 | Marcas no facturar | `/admin/fac/no-facturar` | Admin de la cooperativa | SM-ADM-042 | Asociada al ítem |
| PAN-FAC-40 | Preferencias de entrega | — | Admin de la cooperativa | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-FAC-41 | Parámetros de facturación | `/admin/fac/config/parametros` | Admin de la cooperativa | SM-ADM-292 | Principal del ítem |
| PAN-FAC-42 | Motivos de excepción | `/admin/fac/config/motivos-excepcion` | Admin de la cooperativa | SM-ADM-044 | Asociada al ítem |
| PAN-FAC-43 | Mis facturas | `/facturas`, `/app/facturas` | PWA socio | SM-PWS-007 | Asociada al ítem |
| PAN-FAC-44 | Detalle de factura | `/facturas/:id`, `/app/facturas/:invoiceId` | PWA socio | SM-PWS-008 | Asociada al ítem |
| PAN-FAC-45 | Consulta de factura sin login | `/<tenantSlug>/factura`, `/pagar` | Landing | SM-LND-009 | Principal del ítem |
| PAN-FAC-46 | Reparto | `/reparto` | PWA campo | SM-PWC-019 | Principal del ítem |
| PAN-FAC-47 | Cola de revisión previa | `/admin/fac/revision-previa`, `/admin/facturacion/revision-previa` | Admin de la cooperativa | SM-ADM-394 | Principal del ítem |

## 6. M06 FIS

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-FIS-01 | Catálogo de tablas normativas | `/platform/fis/normative-tables` | Plataforma | SM-PLT-008 | Asociada al ítem |
| PAN-FIS-02 | Sincronización de tablas ARCA | `/platform/fis/arca-params` | Plataforma | SM-PLT-008 | Asociada al ítem |
| PAN-FIS-03 | Adopción de versiones por el tenant | `/admin/fis/normative-adoptions` | Admin de la cooperativa | SM-ADM-294 | Principal del ítem |
| PAN-FIS-04 | Perfil fiscal del tenant | `/admin/fis/profile` | Admin de la cooperativa | SM-ADM-293 | Principal del ítem |
| PAN-FIS-05 | Relevamiento fiscal (BASE §52.4) | `/admin/fis/survey` | Admin de la cooperativa | SM-ADM-293 | Asociada al ítem |
| PAN-FIS-06 | Condiciones de agente | `/admin/fis/agent-registrations` | Admin de la cooperativa | SM-ADM-054 | Asociada al ítem |
| PAN-FIS-07 | Certificados y conector ARCA | `/admin/fis/arca/credentials` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-08 | Puntos de venta y modalidades | `/admin/fis/points-of-sale` | Admin de la cooperativa | SM-ADM-059 | Principal del ítem |
| PAN-FIS-09 | Tablero de la cola de autorización | `/admin/fis/authorizations` | Admin de la cooperativa | SM-ADM-046 | Principal del ítem |
| PAN-FIS-10 | Bandeja de excepciones fiscales | `/admin/fis/authorizations/exceptions` | Admin de la cooperativa | SM-ADM-046 | Asociada al ítem |
| PAN-FIS-11 | Vista previa del request | `/admin/fis/authorizations/preview` | Admin de la cooperativa | SM-ADM-046 | Asociada al ítem |
| PAN-FIS-12 | Consultas a ARCA | `/admin/fis/arca/query` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-13 | Inconsistencias con ARCA | `/admin/fis/reconciliation/arca` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-14 | CAEA por quincena | `/admin/fis/caea` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-15 | CESP de LQSP | `/admin/fis/cesp` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-16 | Código de Validación Provincial | `/admin/fis/cvp` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-17 | Condiciones frente al IVA | `/admin/fis/vat/conditions` | Admin de la cooperativa | SM-ADM-053 | Asociada al ítem |
| PAN-FIS-18 | Alícuotas y matriz IVA | `/admin/fis/vat/rates` | Admin de la cooperativa | SM-ADM-053 | Asociada al ítem |
| PAN-FIS-19 | Catálogo de tributos y percepciones | `/admin/fis/taxes` | Admin de la cooperativa | SM-ADM-053 | Principal del ítem |
| PAN-FIS-20 | Ingresos Brutos | `/admin/fis/gross-income` | Admin de la cooperativa | SM-ADM-053 | Asociada al ítem |
| PAN-FIS-21 | Padrones (IIBB, condición ARCA, exclusiones) | `/admin/fis/registries` | Admin de la cooperativa | SM-ADM-055 | Principal del ítem |
| PAN-FIS-22 | Alícuotas determinadas y exclusiones | `/admin/fis/determined-rates` | Admin de la cooperativa | SM-ADM-053 | Asociada al ítem |
| PAN-FIS-23 | Consulta de padrón ARCA | `/admin/fis/padron/lookup` | Admin de la cooperativa | SM-ADM-055 | Asociada al ítem |
| PAN-FIS-24 | Tipos de retención y escalas | `/admin/fis/withholding/types` | Admin de la cooperativa | SM-ADM-054 | Principal del ítem |
| PAN-FIS-25 | Asignaciones a proveedores/productos/conceptos | `/admin/fis/withholding/assignments` | Admin de la cooperativa | SM-ADM-054 | Asociada al ítem |
| PAN-FIS-26 | Retenciones practicadas y certificados | `/admin/fis/withholding/applied` | Admin de la cooperativa | SM-ADM-125 | Principal del ítem |
| PAN-FIS-27 | Tipos de retenciones sufridas | `/admin/fis/withholding/suffered-types` | Admin de la cooperativa | SM-ADM-054 | Asociada al ítem |
| PAN-FIS-28 | Obligaciones fiscales y calendario | `/admin/fis/obligations` | Admin de la cooperativa | SM-ADM-056 | Asociada al ítem |
| PAN-FIS-29 | Libro IVA ventas y compras | `/admin/fis/vat-ledger` | Admin de la cooperativa | SM-ADM-051 | Principal del ítem |
| PAN-FIS-30 | Conciliación con Mis Comprobantes | `/admin/fis/mis-comprobantes` | Admin de la cooperativa | SM-ADM-051 | Asociada al ítem |
| PAN-FIS-31 | Declaraciones y regímenes informativos | `/admin/fis/filings` | Admin de la cooperativa | SM-ADM-056 | Principal del ítem |
| PAN-FIS-32 | Validador de archivos | `/admin/fis/filings/validate` | Admin de la cooperativa | SM-ADM-056 | Asociada al ítem |
| PAN-FIS-33 | Convenios por cuenta de terceros | `/admin/fis/third-parties/agreements` | Admin de la cooperativa | SM-ADM-057 | Principal del ítem |
| PAN-FIS-34 | Rendiciones a terceros | `/admin/fis/third-parties/remittances` | Admin de la cooperativa | SM-ADM-057 | Asociada al ítem |
| PAN-FIS-35 | Informes a reguladores | `/admin/fis/regulatory` | Admin de la cooperativa | SM-ADM-058 | Principal del ítem |
| PAN-FIS-36 | Configuración de conceptos regulatorios | `/admin/fis/regulatory/concept-maps` | Admin de la cooperativa | SM-ADM-058 | Asociada al ítem |
| PAN-FIS-37 | Comprobantes de administración pública | `/admin/fis/public-admin` | Admin de la cooperativa | SM-ADM-295 | Principal del ítem |
| PAN-FIS-38 | Modo pasarela | `/admin/fis/gateway` | Admin de la cooperativa | SM-ADM-296 | Principal del ítem |
| PAN-FIS-39 | Estado del conector fiscal | `/admin/fis/connector` | Admin de la cooperativa | SM-ADM-059 | Asociada al ítem |
| PAN-FIS-40 | fis.*.ver (comodín de visibilidad: alcanza cualquier capability... | `/admin/fis/reports` | Admin de la cooperativa | SM-ADM-297 | Principal del ítem |
| PAN-FIS-41 | (componente en M19) | — | PWA socio | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |

## 7. M07 COB

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-COB-01 | Cuenta corriente del titular | `/cob/cuentas/:currentAccountId`, `/cob/cuentas` | Admin de la cooperativa | SM-ADM-060 | Principal del ítem |
| PAN-COB-02 | Imputaciones y reasignación | `/cob/imputaciones` | Admin de la cooperativa | SM-ADM-060 | Asociada al ítem |
| PAN-COB-03 | Saldos a favor y anticipos | `/cob/creditos` | Admin de la cooperativa | SM-ADM-060 | Asociada al ítem |
| PAN-COB-04 | Bandeja de cobros no identificados | `/cob/no-identificados` | Admin de la cooperativa | SM-ADM-068 | Principal del ítem |
| PAN-COB-05 | Cancelación automática de créditos | `/cob/cancelacion-automatica` | Admin de la cooperativa | SM-ADM-060 | Asociada al ítem |
| PAN-COB-06 | Resúmenes de cuenta y cupón único | `/cob/resumenes` | Admin de la cooperativa | SM-ADM-060 | Asociada al ítem |
| PAN-COB-07 | Configuración de cuenta corriente e imputación | `/cob/config/cuenta-corriente` | Admin de la cooperativa | SM-ADM-060 | Asociada al ítem |
| PAN-COB-08 | Cajas y QR estático | `/cob/config/cajas` | Admin de la cooperativa | SM-ADM-298 | Principal del ítem |
| PAN-COB-09 | Apertura de caja | `/cob/caja/apertura` | Admin de la cooperativa | SM-ADM-061 | Principal del ítem |
| PAN-COB-10 | Cobro en ventanilla | `/cob/caja/cobro` | Admin de la cooperativa | SM-ADM-062 | Principal del ítem |
| PAN-COB-11 | Anulación de cobranza | `/cob/caja/anulaciones` | Admin de la cooperativa | SM-ADM-062 | Asociada al ítem |
| PAN-COB-12 | Cierre y arqueo | `/cob/caja/cierre` | Admin de la cooperativa | SM-ADM-061 | Asociada al ítem |
| PAN-COB-13 | Rendición a tesorería | `/cob/caja/rendiciones` | Admin de la cooperativa | SM-ADM-061 | Asociada al ítem |
| PAN-COB-14 | Recibos | `/cob/recibos` | Admin de la cooperativa | SM-ADM-062 | Asociada al ítem |
| PAN-COB-15 | Medios de pago, tarjetas y recargos | `/cob/config/medios` | Admin de la cooperativa | SM-ADM-063 | Principal del ítem |
| PAN-COB-16 | Descuentos en caja | `/cob/config/descuentos` | Admin de la cooperativa | SM-ADM-063 | Asociada al ítem |
| PAN-COB-17 | Entes recaudadores y layouts | `/cob/config/entes`, `/cob/config/layouts` | Admin de la cooperativa | SM-ADM-064 | Principal del ítem |
| PAN-COB-18 | Archivo de deuda a entes | `/cob/entes/exportaciones` | Admin de la cooperativa | SM-ADM-064 | Asociada al ítem |
| PAN-COB-19 | Importación de rendiciones | `/cob/entes/rendiciones` | Admin de la cooperativa | SM-ADM-064 | Asociada al ítem |
| PAN-COB-20 | Morosidad y novedades de entes | `/cob/entes/novedades` | Admin de la cooperativa | SM-ADM-064 | Asociada al ítem |
| PAN-COB-21 | Adhesiones a débito automático | `/cob/debitos/adhesiones` | Admin de la cooperativa | SM-ADM-065 | Principal del ítem |
| PAN-COB-22 | Presentaciones y rechazos de débito | `/cob/debitos/lotes` | Admin de la cooperativa | SM-ADM-065 | Asociada al ítem |
| PAN-COB-23 | Conectores de pasarelas y canales | `/cob/config/pasarelas` | Admin de la cooperativa | SM-ADM-066 | Principal del ítem |
| PAN-COB-24 | Intenciones de pago | `/cob/pasarelas/intenciones` | Admin de la cooperativa | SM-ADM-208 | Principal del ítem |
| PAN-COB-25 | Link de pago | `/cob/pasarelas/links` | Admin de la cooperativa | SM-ADM-066 | Asociada al ítem |
| PAN-COB-26 | Devoluciones y contracargos | `/cob/devoluciones`, `/cob/contracargos` | Admin de la cooperativa | SM-ADM-069 | Principal del ítem |
| PAN-COB-27 | Conciliación de cobranzas | `/cob/conciliacion` | Admin de la cooperativa | SM-ADM-067 | Principal del ítem |
| PAN-COB-28 | Cobradores y listas de cobro | `/cob/cobradores` | Admin de la cooperativa | SM-ADM-299 | Principal del ítem |
| PAN-COB-29 | PWA del cobrador | `/cobrador` | PWA campo | SM-PWC-012 | Principal del ítem |
| PAN-COB-30 | Cobro por cuenta de terceros | `/cob/config/terceros`, `/cob/bloqueos` | Admin de la cooperativa | SM-ADM-057 | Asociada al ítem |
| PAN-COB-31 | Bloqueos de cobro | `/cob/bloqueos` | Admin de la cooperativa | SM-ADM-063 | Asociada al ítem |
| PAN-COB-32 | Importación de obligaciones externas | `/cob/importaciones` | Admin de la cooperativa | SM-ADM-063 | Asociada al ítem |
| PAN-COB-33 | Cheques recibidos | `/cob/valores` | Admin de la cooperativa | SM-ADM-062 | Asociada al ítem |
| PAN-COB-34 | Bandeja de excepciones de cobranza | `/cob/excepciones` | Admin de la cooperativa | SM-ADM-300 | Principal del ítem |
| PAN-COB-35 | Mi cuenta y pagar (socio) | `/mi-cuenta`, `/mi-cuenta/pagar` | PWA socio | SM-PWS-007 | Asociada al ítem |
| PAN-COB-36 | Reportes de cobranza | `/cob/reportes` | Admin de la cooperativa | SM-ADM-070 | Principal del ítem |

## 8. M08 MOR

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-MOR-01 | Tablero de mora | `/admin/mor/tablero` | Admin de la cooperativa | SM-ADM-301 | Principal del ítem |
| PAN-MOR-02 | mor.politicasInteres.ver, mor.politicasInteres.configurar (antes... | `/admin/mor/politicas-interes` | Admin de la cooperativa | SM-ADM-079 | Principal del ítem |
| PAN-MOR-03 | mor.tasas.ver, mor.tasas.editar (antes mor.tasas.*) | `/admin/mor/tasas` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-04 | mor.indices.ver, mor.indices.importar (antes mor.indices.*) | `/admin/mor/indices` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-05 | Esquemas de recargo entre vencimientos | `/admin/mor/recargo-vencimientos` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-06 | Descuentos por pronto pago | `/admin/mor/pronto-pago` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-07 | Cotizar recargo | `/admin/mor/calculadora` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-08 | mor.interesesFacturar.ver, mor.interesesFacturar.simular... | `/admin/mor/intereses-facturar` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-09 | mor.bloqueos.ver (nueva), mor.bloqueos.crear, mor.bloqueos.aplicarMasivo (antes... | `/admin/mor/bloqueos` | Admin de la cooperativa | SM-ADM-079 | Asociada al ítem |
| PAN-MOR-10 | mor.politicasMora.ver, mor.politicasMora.configurar (antes mor.politicasMora.*) | `/admin/mor/politicas-mora` | Admin de la cooperativa | SM-ADM-076 | Asociada al ítem |
| PAN-MOR-11 | Instancias de mora | `/admin/mor/instancias` | Admin de la cooperativa | SM-ADM-076 | Principal del ítem |
| PAN-MOR-12 | Modelos de aviso | `/admin/mor/modelos-aviso` | Admin de la cooperativa | SM-ADM-074 | Principal del ítem |
| PAN-MOR-13 | Generar candidatos | `/admin/mor/candidatos` | Admin de la cooperativa | SM-ADM-071 | Principal del ítem |
| PAN-MOR-14 | Gestión de notificaciones | `/admin/mor/notificaciones` | Admin de la cooperativa | SM-ADM-072 | Principal del ítem |
| PAN-MOR-15 | — | — | Admin de la cooperativa | SM-ADM-072 | Asociada al ítem |
| PAN-MOR-16 | — | — | Admin de la cooperativa | SM-ADM-072 | Asociada al ítem |
| PAN-MOR-17 | — | — | Admin de la cooperativa | SM-ADM-072 | Asociada al ítem |
| PAN-MOR-18 | — | — | Admin de la cooperativa | SM-ADM-073 | Asociada al ítem |
| PAN-MOR-19 | mor.tratamiento.ver, mor.tratamiento.ejecutar (antes mor.tratamiento.*) | `/admin/mor/tratamiento` | Admin de la cooperativa | SM-ADM-073 | Principal del ítem |
| PAN-MOR-20 | — | — | Admin de la cooperativa | SM-ADM-073 | Asociada al ítem |
| PAN-MOR-21 | Consulta de notificaciones por cuenta | `/admin/mor/notificaciones/consulta` | Admin de la cooperativa | SM-ADM-072 | Asociada al ítem |
| PAN-MOR-22 | Operaciones especiales | `/admin/mor/operaciones-especiales` | Admin de la cooperativa | SM-ADM-302 | Principal del ítem |
| PAN-MOR-23 | mor.excepciones.ver, mor.excepciones.editar (nueva), mor.excepciones.aprobar... | `/admin/mor/excepciones` | Admin de la cooperativa | SM-ADM-077 | Principal del ítem |
| PAN-MOR-24 | mor.protecciones.ver (nueva), mor.protecciones.editar (nueva)... | `/admin/mor/protecciones` | Admin de la cooperativa | SM-ADM-075 | Asociada al ítem |
| PAN-MOR-25 | mor.restricciones.ver, mor.restricciones.configurar (nueva)... | `/admin/mor/restricciones` | Admin de la cooperativa | SM-ADM-075 | Asociada al ítem |
| PAN-MOR-26 | Causas | `/admin/mor/causas` | Admin de la cooperativa | SM-ADM-078 | Principal del ítem |
| PAN-MOR-27 | Casos de interrupción | `/admin/mor/interrupciones` | Admin de la cooperativa | SM-ADM-075 | Principal del ítem |
| PAN-MOR-28 | Reglas de cargos de suspensión/reconexión | `/admin/mor/cargos-interrupcion` | Admin de la cooperativa | SM-ADM-075 | Asociada al ítem |
| PAN-MOR-29 | Planes de pago | `/admin/mor/planes-pago` | Admin de la cooperativa | SM-ADM-080 | Asociada al ítem |
| PAN-MOR-30 | mor.simulador.usar, mor.convenios.crear | `/admin/mor/convenios/nuevo` | Admin de la cooperativa | SM-ADM-080 | Asociada al ítem |
| PAN-MOR-31 | Convenios | `/admin/mor/convenios` | Admin de la cooperativa | SM-ADM-080 | Principal del ítem |
| PAN-MOR-32 | Entidades financieras | `/admin/mor/entidades-financieras` | Admin de la cooperativa | SM-ADM-080 | Asociada al ítem |
| PAN-MOR-33 | mor.garantias.ver, mor.garantias.editar (antes mor.garantias.*) | `/admin/mor/garantias` | Admin de la cooperativa | SM-ADM-081 | Principal del ítem |
| PAN-MOR-34 | mor.gestionExterna.ver, mor.gestionExterna.editar... | `/admin/mor/gestion-externa` | Admin de la cooperativa | SM-ADM-083 | Principal del ítem |
| PAN-MOR-35 | mor.incobrables.ver (nueva), mor.incobrables.proponer, mor.incobrables.aprobar... | `/admin/mor/incobrables` | Admin de la cooperativa | SM-ADM-082 | Principal del ítem |
| PAN-MOR-36 | mor.prescripcion.configurar, mor.prescripcion.proponer... | `/admin/mor/prescripcion` | Admin de la cooperativa | SM-ADM-082 | Asociada al ítem |
| PAN-MOR-37 | mor.informes.ver (nueva), mor.informes.exportar (nueva) (antes mor.*.ver +... | `/admin/mor/informes` | Admin de la cooperativa | SM-ADM-084 | Principal del ítem |
| PAN-MOR-38 | Expedientes de seguimiento de deuda | `/admin/mor/seguimiento` | Admin de la cooperativa | SM-ADM-303 | Principal del ítem |
| PAN-MOR-39 | Componente embebido en PAN-POR-46 (M19 es dueño de la ruta y la composición... | `/app/deuda` | PWA socio | SM-PWS-042 | Principal del ítem |
| PAN-MOR-40 | Componente embebido en PAN-POR-46 (M19 es dueño de la ruta /app/convenios y la... | `/app/convenios` | PWA socio | SM-PWS-013 | Asociada al ítem |
| PAN-MOR-41 | Componente embebido en PAN-POR-37 (M19 es dueño de la ruta... | `/app/servicios/:contractId/:accion`, `/app/servicios/:id/suspension` | PWA socio | SM-PWS-006 | Asociada al ítem |
| PAN-MOR-42 | ext (estudios) | `/api/v1/ext/mor/...` | Admin de la cooperativa | SM-ADM-083 | Asociada al ítem |

## 9. M09 CRM

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-CRM-01 | Bandeja de supervisión | `/crm/supervision` | Admin de la cooperativa | SM-ADM-304 | Principal del ítem |
| PAN-CRM-02 | Bandeja de mi área y mis casos | `/crm/bandeja` | Admin de la cooperativa | SM-ADM-085 | Principal del ítem |
| PAN-CRM-03 | Expediente del caso | `/crm/casos/:id` | Admin de la cooperativa | SM-ADM-085 | Asociada al ítem |
| PAN-CRM-04 | modal global "Nuevo caso" y /crm/carga-rapida | `/crm/carga-rapida` | Admin de la cooperativa | SM-ADM-086 | Principal del ítem |
| PAN-CRM-05 | Vista 360 del socio | `/crm/personas/:personId/360` | Admin de la cooperativa | SM-ADM-007 | Asociada al ítem |
| PAN-CRM-06 | Búsqueda global | `/crm/buscar` | Admin de la cooperativa | SM-ADM-085 | Asociada al ítem |
| PAN-CRM-07 | Listado y mapa de incidentes | `/crm/incidentes` | Admin de la cooperativa | SM-ADM-092 | Principal del ítem |
| PAN-CRM-08 | Detalle de incidente | `/crm/incidentes/:id` | Admin de la cooperativa | SM-ADM-092 | Asociada al ítem |
| PAN-CRM-09 | Libro de mesa de entradas | `/crm/mesa-entradas` | Admin de la cooperativa | SM-ADM-091 | Principal del ítem |
| PAN-CRM-10 | Bandeja omnicanal y consola de agente | `/crm/conversaciones` | Admin de la cooperativa | SM-ADM-090 | Principal del ítem |
| PAN-CRM-11 | Tipos y subtipos de gestión | `/crm/config/tipos` | Admin de la cooperativa | SM-ADM-099 | Principal del ítem |
| PAN-CRM-12 | Conjuntos de estados y transiciones | `/crm/config/estados` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-13 | Áreas, miembros, guardias | `/crm/config/areas` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-14 | Políticas SLA | `/crm/config/sla` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-15 | Reglas de derivación y notificación | `/crm/config/reglas` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-16 | Canales | `/crm/config/canales` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-17 | Bot de autogestión | `/crm/config/bot` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-18 | IA supervisada | `/crm/config/ia` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-19 | Auditoría de IA | `/crm/auditoria-ia` | Admin de la cooperativa | SM-ADM-309 | Principal del ítem |
| PAN-CRM-20 | Respuestas rápidas | `/crm/config/respuestas-rapidas` | Admin de la cooperativa | SM-ADM-099 | Asociada al ítem |
| PAN-CRM-21 | Trámites con vencimiento | `/crm/tramites` | Admin de la cooperativa | SM-ADM-305 | Principal del ítem |
| PAN-CRM-22 | Proyectos, horas y bolsas | `/crm/proyectos` | Admin de la cooperativa | SM-ADM-307 | Principal del ítem |
| PAN-CRM-23 | Recepción y emisión de turnos | `/crm/turnero/recepcion` | Admin de la cooperativa | SM-ADM-095 | Principal del ítem |
| PAN-CRM-24 | Consola de box | `/crm/turnero/box` | Admin de la cooperativa | SM-ADM-094 | Principal del ítem |
| PAN-CRM-25 | landing (ruta pública con token de pantalla) | `/t/:tenantSlug/pantalla/:displayId` | Dispositivo (kiosco) | SM-DSP-002 | Principal del ítem |
| PAN-CRM-26 | landing (kiosco) | `/t/:tenantSlug/totem/:branchId` | Landing | SM-LND-014 | Asociada al ítem |
| PAN-CRM-27 | Administración del turnero | `/crm/turnero/config` | Admin de la cooperativa | SM-ADM-093 | Principal del ítem |
| PAN-CRM-28 | Estadísticas del turnero | `/crm/turnero/estadisticas` | Admin de la cooperativa | SM-ADM-096 | Principal del ítem |
| PAN-CRM-29 | Seguimiento de actividades | `/crm/actividades` | Admin de la cooperativa | SM-ADM-097 | Principal del ítem |
| PAN-CRM-30 | Configuración de actividades | `/crm/config/actividades` | Admin de la cooperativa | SM-ADM-097 | Asociada al ítem |
| PAN-CRM-31 | Calendario interno | `/crm/calendario` | Admin de la cooperativa | SM-ADM-097 | Asociada al ítem |
| PAN-CRM-32 | Circulares | `/crm/circulares` | Admin de la cooperativa | SM-ADM-308 | Principal del ítem |
| PAN-CRM-33 | Tablero operativo | `/crm/tablero` | Admin de la cooperativa | SM-ADM-100 | Principal del ítem |
| PAN-CRM-34 | Sala BI de atención y reclamos | `/bi/salas/reclamos` | Admin de la cooperativa | SM-ADM-100 | Asociada al ítem |
| PAN-CRM-35 | Mis casos (móvil) | `/app/casos` | PWA empleado | SM-PWE-003 | Principal del ítem |
| PAN-CRM-36 | Mis actividades (móvil) | `/app/actividades` | PWA empleado | SM-PWE-005 | Asociada al ítem |

## 10. M10 TEC

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-TEC-01 | Bandeja de factibilidades | `/admin/tec/feasibility` | Admin de la cooperativa | SM-ADM-102 | Principal del ítem |
| PAN-TEC-02 | Ficha de factibilidad | `/admin/tec/feasibility/:id` | Admin de la cooperativa | SM-ADM-102 | Asociada al ítem |
| PAN-TEC-03 | Estimación técnica | `/admin/tec/estimates/:id` | Admin de la cooperativa | SM-ADM-102 | Asociada al ítem |
| PAN-TEC-04 | Tablero de OT | `/admin/tec/work-orders` | Admin de la cooperativa | SM-ADM-103 | Principal del ítem |
| PAN-TEC-05 | Ficha de OT | `/admin/tec/work-orders/:id` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-06 | Asistentes de operación | — | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-07 | Generación masiva | `/admin/tec/work-orders/bulk-create` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-08 | Cierre masivo | `/admin/tec/work-orders/bulk-close` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-09 | Necesidades de materiales | `/admin/tec/materials` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-10 | Despacho | `/admin/tec/dispatch` | Admin de la cooperativa | SM-ADM-104 | Principal del ítem |
| PAN-TEC-11 | Agenda | `/admin/tec/schedule` | Admin de la cooperativa | SM-ADM-101 | Principal del ítem |
| PAN-TEC-12 | Configuración de agenda | `/admin/tec/schedule/config` | Admin de la cooperativa | SM-ADM-101 | Asociada al ítem |
| PAN-TEC-13 | Cuadrillas | `/admin/tec/crews` | Admin de la cooperativa | SM-ADM-105 | Principal del ítem |
| PAN-TEC-14 | Recursos de campo | `/admin/tec/resources` | Admin de la cooperativa | SM-ADM-105 | Asociada al ítem |
| PAN-TEC-15 | Responsables a notificar | `/admin/tec/notification-rules` | Admin de la cooperativa | SM-ADM-316 | Asociada al ítem |
| PAN-TEC-16 | Profesionales certificados | `/admin/tec/installers` | Admin de la cooperativa | SM-ADM-105 | Asociada al ítem |
| PAN-TEC-17 | Tipos de operación | `/admin/tec/catalog/operations` | Admin de la cooperativa | SM-ADM-316 | Principal del ítem |
| PAN-TEC-18 | Tipos de trabajo | `/admin/tec/catalog/work-types` | Admin de la cooperativa | SM-ADM-316 | Asociada al ítem |
| PAN-TEC-19 | Categorías de incidencia | `/admin/tec/catalog/incident-categories` | Admin de la cooperativa | SM-ADM-316 | Asociada al ítem |
| PAN-TEC-20 | Resoluciones | `/admin/tec/catalog/resolutions` | Admin de la cooperativa | SM-ADM-316 | Asociada al ítem |
| PAN-TEC-21 | Tareas y grupos | `/admin/tec/catalog/tasks` | Admin de la cooperativa | SM-ADM-316 | Asociada al ítem |
| PAN-TEC-22 | Plantillas de impresión | `/admin/tec/catalog/print-templates` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-23 | Reglas de OT encadenadas | `/admin/tec/catalog/chained-rules` | Admin de la cooperativa | SM-ADM-103 | Asociada al ítem |
| PAN-TEC-24 | Conflictos de sincronización | `/admin/tec/sync-conflicts` | Admin de la cooperativa | SM-ADM-313 | Principal del ítem |
| PAN-TEC-25 | Bandeja de instalaciones | `/admin/tec/installations` | Admin de la cooperativa | SM-ADM-106 | Principal del ítem |
| PAN-TEC-26 | Formularios de campo | `/admin/tec/field-forms` | Admin de la cooperativa | SM-ADM-317 | Principal del ítem |
| PAN-TEC-27 | Activos y mantenimiento | `/admin/tec/maintenance` | Admin de la cooperativa | SM-ADM-314 | Principal del ítem |
| PAN-TEC-28 | Interrupciones e impacto | `/admin/tec/outages` | Admin de la cooperativa | SM-ADM-311 | Principal del ítem |
| PAN-TEC-29 | Mapa operativo | `/admin/tec/map` | Admin de la cooperativa | SM-ADM-310 | Principal del ítem |
| PAN-TEC-30 | Estructura de redes | `/admin/tec/networks/structure` | Admin de la cooperativa | SM-ADM-111 | Asociada al ítem |
| PAN-TEC-31 | Red instalada | `/admin/tec/networks/elements` | Admin de la cooperativa | SM-ADM-111 | Principal del ítem |
| PAN-TEC-32 | Conexiones servicio–red | `/admin/tec/networks/connections` | Admin de la cooperativa | SM-ADM-111 | Asociada al ítem |
| PAN-TEC-33 | Red v1 (absorbida) | — | — | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-TEC-34 | Exportación GIS | `/admin/tec/networks/exports` | Admin de la cooperativa | SM-ADM-111 | Asociada al ítem |
| PAN-TEC-35 | Equipos de red | `/admin/tec/network-devices` | Admin de la cooperativa | SM-ADM-315 | Principal del ítem |
| PAN-TEC-36 | Sistemas de aprovisionamiento | `/admin/tec/provisioning/systems` | Admin de la cooperativa | SM-ADM-107 | Principal del ítem |
| PAN-TEC-37 | Datos técnicos del servicio | — | Admin de la cooperativa | SM-ADM-107 | Asociada al ítem |
| PAN-TEC-38 | Consola de comandos | `/admin/tec/provisioning/commands` | Admin de la cooperativa | SM-ADM-107 | Asociada al ítem |
| PAN-TEC-39 | Obras y loteos | `/admin/tec/works` | Admin de la cooperativa | SM-ADM-112 | Principal del ítem |
| PAN-TEC-40 | Contribución por mejoras | `/admin/tec/works/:id/levy` | Admin de la cooperativa | SM-ADM-112 | Asociada al ítem |
| PAN-TEC-41 | Inspecciones y fraude | `/admin/tec/inspections` | Admin de la cooperativa | SM-ADM-312 | Principal del ítem |
| PAN-TEC-42 | Red telefónica física | `/admin/tec/phone/plant` | Admin de la cooperativa | SM-ADM-108 | Principal del ítem |
| PAN-TEC-43 | Numeración | `/admin/tec/phone/numbering` | Admin de la cooperativa | SM-ADM-108 | Asociada al ítem |
| PAN-TEC-44 | Líneas | `/admin/tec/phone/lines` | Admin de la cooperativa | SM-ADM-108 | Asociada al ítem |
| PAN-TEC-45 | Importación de CDR | `/admin/tec/phone/cdr` | Admin de la cooperativa | SM-ADM-109 | Principal del ítem |
| PAN-TEC-46 | Telefonía móvil | `/admin/tec/phone/mobile` | Admin de la cooperativa | SM-ADM-108 | Asociada al ítem |
| PAN-TEC-47 | Informes técnicos | `/admin/tec/reports` | Admin de la cooperativa | SM-ADM-113 | Principal del ítem |
| PAN-TEC-48 | Revisión de geolocalización | `/admin/tec/geo-review` | Admin de la cooperativa | SM-ADM-111 | Asociada al ítem |
| PAN-TEC-49 | Carga rápida de reclamo | `/crm/carga-rapida` | Admin de la cooperativa | SM-ADM-086 | Misma ruta que el ítem |
| PAN-TEC-50 | Mi día | `/field/today` | PWA campo | SM-PWC-001 | Principal del ítem |
| PAN-TEC-51 | Ejecución de OT | `/field/work-orders/:id` | PWA campo | SM-PWC-003 | Principal del ítem |
| PAN-TEC-52 | Mi stock | `/field/stock` | PWA campo | SM-PWC-014 | Asociada al ítem |
| PAN-TEC-53 | Cola de sincronización | `/field/sync` | PWA campo | SM-PWC-016 | Principal del ítem |
| PAN-TEC-54 | Inspección | `/field/inspections/:id` | PWA campo | SM-PWC-006 | Principal del ítem |
| PAN-TEC-55 | Crear OT en campo | `/field/work-orders/new` | PWA campo | SM-PWC-008 | Principal del ítem |
| PAN-TEC-56 | Mapa del técnico | `/field/map` | PWA campo | SM-PWC-015 | Principal del ítem |
| PAN-TEC-57 | Reservar visita — componente embebido en PAN-POR-34 (HUE-SRV-04) | `/app/visitas/coordinar/:caseId`, `/portal/visits/book` | PWA socio | SM-PWS-020 | Asociada al ítem |
| PAN-TEC-58 | Seguimiento de visita — componente embebido en PAN-POR-35 (HUE-SRV-04) | `/app/visitas/:visitId`, `/portal/visits/:id` | PWA socio | SM-PWS-020 | Asociada al ítem |
| PAN-TEC-59 | Estado de factibilidad — componente embebido en PAN-POR-34/35 y en la línea de... | `/portal/feasibility/:id` | PWA socio | SM-PWS-019 | Asociada al ítem |
| PAN-TEC-60 | Shell de campo | `/field` | PWA campo | SM-PWC-001 | Asociada al ítem |
| PAN-TEC-61 | Guardias | `/admin/tec/on-call` | Admin de la cooperativa | SM-ADM-399 | Principal del ítem |
| PAN-TEC-62 | Protocolos de emergencia | `/admin/tec/emergency-protocols` | Admin de la cooperativa | SM-ADM-400 | Principal del ítem |
| PAN-TEC-63 | Portabilidad numérica | `/admin/tec/phone/portings` | Admin de la cooperativa | SM-ADM-401 | Principal del ítem |
| PAN-TEC-64 | Calidad del agua | `/admin/tec/water-quality` | Admin de la cooperativa | SM-ADM-402 | Principal del ítem |

## 11. M11 VEN

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-VEN-01 | Cargos por operación (bandeja) | `/ven/cargos` | Admin de la cooperativa | SM-ADM-318 | Principal del ítem |
| PAN-VEN-02 | Presupuestos (listado) | `/ven/presupuestos` | Admin de la cooperativa | SM-ADM-114 | Principal del ítem |
| PAN-VEN-03 | Editor de presupuesto | `/ven/presupuestos/:id` | Admin de la cooperativa | SM-ADM-114 | Asociada al ítem |
| PAN-VEN-04 | Condiciones de venta | `/ven/config/condiciones` | Admin de la cooperativa | SM-ADM-323 | Asociada al ítem |
| PAN-VEN-05 | Aceptación online del presupuesto | `/p/:tenantSlug/presupuesto/:token`, `/presupuestos/:id` | Landing | SM-LND-027 | Principal del ítem |
| PAN-VEN-06 | Mis presupuestos y mis cuotas | `/presupuestos`, `/cuotas` | PWA socio | SM-PWS-049 | Principal del ítem |
| PAN-VEN-07 | Presupuesto y venta en campo | `/ot/:id/presupuesto`, `/ot/:id/venta` | PWA campo | SM-PWC-003 | Asociada al ítem |
| PAN-VEN-08 | Ventas (listado) | `/ven/ventas` | Admin de la cooperativa | SM-ADM-115 | Principal del ítem |
| PAN-VEN-09 | Editor de venta | `/ven/ventas/:id` | Admin de la cooperativa | SM-ADM-115 | Asociada al ítem |
| PAN-VEN-10 | Venta rápida / POS | `/ven/pos/:terminalId` | Admin de la cooperativa | SM-ADM-116 | Asociada al ítem |
| PAN-VEN-11 | Sesiones de POS y terminales | `/ven/pos/sesiones`, `/ven/config/pos` | Admin de la cooperativa | SM-ADM-116 | Principal del ítem |
| PAN-VEN-12 | Entregas pendientes | `/ven/entregas` | Admin de la cooperativa | SM-ADM-115 | Asociada al ítem |
| PAN-VEN-13 | Devoluciones | `/ven/devoluciones` | Admin de la cooperativa | SM-ADM-115 | Asociada al ítem |
| PAN-VEN-14 | Cuotas de venta | `/ven/cuotas` | Admin de la cooperativa | SM-ADM-319 | Principal del ítem |
| PAN-VEN-15 | Modificación masiva de cuotas | `/ven/cuotas/modificacion-masiva` | Admin de la cooperativa | SM-ADM-319 | Asociada al ítem |
| PAN-VEN-16 | Vendedores | `/ven/config/vendedores`, `/` | Admin de la cooperativa | SM-ADM-322 | Principal del ítem |
| PAN-VEN-17 | Listas de precios y actualización masiva | `/ven/precios`, `/ven/precios/actualizar` | Admin de la cooperativa | SM-ADM-321 | Principal del ítem |
| PAN-VEN-18 | Reglas de recargo y descuento | `/ven/config/descuentos` | Admin de la cooperativa | SM-ADM-323 | Asociada al ítem |
| PAN-VEN-19 | Planes de financiación comercial | `/ven/config/planes` | Admin de la cooperativa | SM-ADM-323 | Asociada al ítem |
| PAN-VEN-20 | Rendiciones de viajes | `/ven/rendiciones`, `/` | Admin de la cooperativa | SM-ADM-320 | Principal del ítem |
| PAN-VEN-21 | Flujo continuo (tablero) | `/ven/tablero` | Admin de la cooperativa | SM-ADM-114 | Asociada al ítem |
| PAN-VEN-22 | Anulación de ventas por rango | `/ven/ventas/anular-rango` | Admin de la cooperativa | SM-ADM-115 | Asociada al ítem |
| PAN-VEN-23 | Reportes de ventas | `/ven/reportes` | Admin de la cooperativa | SM-ADM-117 | Principal del ítem |
| PAN-VEN-24 | Configuración de ventas | `/ven/config` | Admin de la cooperativa | SM-ADM-323 | Principal del ítem |

## 12. M12 CMP

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-CMP-01 | Proveedores (listado) | `/cmp/proveedores` | Admin de la cooperativa | SM-ADM-118 | Principal del ítem |
| PAN-CMP-02 | Ficha del proveedor | `/cmp/proveedores/:id` | Admin de la cooperativa | SM-ADM-118 | Asociada al ítem |
| PAN-CMP-03 | Catálogos de compras | `/cmp/config/catalogos` | Admin de la cooperativa | SM-ADM-325 | Asociada al ítem |
| PAN-CMP-04 | Solicitudes de aprovisionamiento | `/cmp/solicitudes`, `/compras/solicitudes` | Admin de la cooperativa | SM-ADM-119 | Principal del ítem |
| PAN-CMP-05 | Editor de solicitud | `/cmp/solicitudes/:id`, `/` | Admin de la cooperativa | SM-ADM-119 | Asociada al ítem |
| PAN-CMP-06 | Cotizaciones y comparativo | `/cmp/cotizaciones`, `/cmp/cotizaciones/grupo/:groupId` | Admin de la cooperativa | SM-ADM-120 | Principal del ítem |
| PAN-CMP-07 | Concursos y licitaciones | `/cmp/concursos/:id` | Admin de la cooperativa | SM-ADM-120 | Asociada al ítem |
| PAN-CMP-08 | Órdenes de compra (listado) | `/cmp/ordenes` | Admin de la cooperativa | SM-ADM-121 | Principal del ítem |
| PAN-CMP-09 | Editor de orden de compra | `/cmp/ordenes/:id` | Admin de la cooperativa | SM-ADM-121 | Asociada al ítem |
| PAN-CMP-10 | Recepciones | `/cmp/recepciones`, `/cmp/recepciones/nueva` | Admin de la cooperativa | SM-ADM-122 | Principal del ítem |
| PAN-CMP-11 | Comprobantes de proveedor (listado) | `/cmp/comprobantes` | Admin de la cooperativa | SM-ADM-123 | Principal del ítem |
| PAN-CMP-12 | Editor de comprobante de proveedor | `/cmp/comprobantes/:id` | Admin de la cooperativa | SM-ADM-123 | Asociada al ítem |
| PAN-CMP-13 | Conciliación de 3 vías | `/cmp/conciliacion`, `/` | Admin de la cooperativa | SM-ADM-123 | Asociada al ítem |
| PAN-CMP-14 | Órdenes de pago (listado) | `/cmp/ordenes-pago` | Admin de la cooperativa | SM-ADM-124 | Principal del ítem |
| PAN-CMP-15 | Editor de orden de pago | `/cmp/ordenes-pago/:id`, `/` | Admin de la cooperativa | SM-ADM-124 | Asociada al ítem |
| PAN-CMP-16 | Cuenta corriente y antigüedad de proveedores | `/cmp/cuenta-corriente` | Admin de la cooperativa | SM-ADM-324 | Principal del ítem |
| PAN-CMP-17 | Bandeja de comprobantes recibidos (portal, ARCA, IA) | `/cmp/recibidos` | Admin de la cooperativa | SM-ADM-123 | Asociada al ítem |
| PAN-CMP-18 | Previsiones de pagos | `/cmp/previsiones` | Admin de la cooperativa | SM-ADM-124 | Asociada al ítem |
| PAN-CMP-19 | Comunicaciones y circulares | `/cmp/comunicaciones` | Admin de la cooperativa | SM-ADM-127 | Principal del ítem |
| PAN-CMP-20 | Políticas de aprobación y tolerancias | `/cmp/config/politicas` | Admin de la cooperativa | SM-ADM-325 | Asociada al ítem |
| PAN-CMP-21 | Configuración de compras | `/cmp/config` | Admin de la cooperativa | SM-ADM-325 | Principal del ítem |
| PAN-CMP-22 | Reportes de compras | `/cmp/reportes` | Admin de la cooperativa | SM-ADM-126 | Principal del ítem |
| PAN-CMP-23 | Portal de proveedores | `/p/:tenantSlug/proveedores` | Landing | SM-LND-030 | Principal del ítem |
| PAN-CMP-24 | Registro simplificado de ingreso (piloto) | `/cmp/ingreso-rapido` | Admin de la cooperativa | SM-ADM-122 | Asociada al ítem |
| PAN-CMP-25 | Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04) | `/cmp/abastecimiento` | Admin de la cooperativa | SM-ADM-397 | Principal del ítem |
| PAN-CMP-26 | Derechos de señales (HUE-TV-01) | `/cmp/derechos-senales` | Admin de la cooperativa | SM-ADM-398 | Principal del ítem |

## 13. M13 STK

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-STK-01 | Lista de artículos. Filtros: tipo, clasificación, rubro, departamento... | `/stk/articulos` | Admin de la cooperativa | SM-ADM-128 | Principal del ítem |
| PAN-STK-02 | Ficha con pestañas: Datos (identificación, marca/modelo/fabricante, unidades y... | `/stk/articulos/:id` | Admin de la cooperativa | SM-ADM-128 | Asociada al ítem |
| PAN-STK-03 | Asistente de actualización masiva de costos de reposición: filtros (rango de... | `/stk/articulos/actualizar-costos` | Admin de la cooperativa | SM-ADM-128 | Asociada al ítem |
| PAN-STK-04 | Maestros en pestañas: Tipos, Clasificaciones (árbol con coeficiente de mano de... | `/stk/maestros` | Admin de la cooperativa | SM-ADM-128 | Asociada al ítem |
| PAN-STK-05 | Lista de depósitos y custodios por tipo (central, sucursal, cuadrilla, técnico... | `/stk/depositos` | Admin de la cooperativa | SM-ADM-326 | Principal del ítem |
| PAN-STK-06 | Árbol de ubicaciones con arrastrar; modal de elemento con alta masiva y... | `/stk/depositos/:id/ubicaciones` | Admin de la cooperativa | SM-ADM-326 | Asociada al ítem |
| PAN-STK-07 | Consulta de disponibilidad: por artículo, servicio, depósito, ubicación, lote... | `/stk/existencias` | Admin de la cooperativa | SM-ADM-327 | Principal del ítem |
| PAN-STK-08 | Kárdex por artículo (y depósito) con saldo, costo unitario e importe; filtro... | `/stk/kardex` | Admin de la cooperativa | SM-ADM-131 | Principal del ítem |
| PAN-STK-09 | Bandeja de documentos de stock por tipo y estado (borrador, pendiente de... | `/stk/documentos` | Admin de la cooperativa | SM-ADM-129 | Principal del ítem |
| PAN-STK-10 | Editor de documento: cabecera (tipo, fecha efectiva, origen, destino con... | `/stk/documentos/nuevo/:tipo` | Admin de la cooperativa | SM-ADM-129 | Asociada al ítem |
| PAN-STK-11 | Búsqueda global de unidades por serie, MAC, GPON SN, matrícula; filtros por... | `/stk/series` | Admin de la cooperativa | SM-ADM-130 | Principal del ítem |
| PAN-STK-12 | Ficha de la unidad: identificadores, estado, propiedad, custodia actual... | `/stk/series/:id` | Admin de la cooperativa | SM-ADM-130 | Asociada al ítem |
| PAN-STK-13 | Reservas por destino con estado y vencimiento; acciones liberar (motivo)... | `/stk/reservas` | Admin de la cooperativa | SM-ADM-328 | Principal del ítem |
| PAN-STK-14 | Tablero de custodias: por cuadrilla/técnico, saldo por artículo y series... | `/stk/cuadrillas` | Admin de la cooperativa | SM-ADM-329 | Principal del ítem |
| PAN-STK-15 | Rendición: tabla inicial + entregado − consumido − aplicado − devuelto =... | `/stk/rendiciones/:id` | Admin de la cooperativa | SM-ADM-329 | Asociada al ítem |
| PAN-STK-16 | Bandeja de conflictos de campo y sustituciones pendientes: OT, técnico... | `/stk/conflictos` | Admin de la cooperativa | SM-ADM-330 | Principal del ítem |
| PAN-STK-17 | Equipos en domicilios: por contrato/cuenta/servicio/modelo/modalidad/estado de... | `/stk/equipos-clientes` | Admin de la cooperativa | SM-ADM-130 | Asociada al ítem |
| PAN-STK-18 | Recepción de equipos en mostrador: buscar contrato o escanear serie, condición... | `/stk/devoluciones/mostrador` | Admin de la cooperativa | SM-ADM-130 | Asociada al ítem |
| PAN-STK-19 | Bandeja de equipos retirados pendientes de revisión; decisión... | `/stk/revision` | Admin de la cooperativa | SM-ADM-130 | Asociada al ítem |
| PAN-STK-20 | Inventarios físicos: planificar (alcance, tipo, ciego), tomar instantánea... | `/stk/inventarios` | Admin de la cooperativa | SM-ADM-331 | Principal del ítem |
| PAN-STK-21 | Sugerencias de compra: artículo, depósito, servicio, disponible, en tránsito... | `/stk/reposicion` | Admin de la cooperativa | SM-ADM-332 | Principal del ítem |
| PAN-STK-22 | Valorización a fecha por método (perpetuo y alternativos), por... | `/stk/valorizacion` | Admin de la cooperativa | SM-ADM-132 | Asociada al ítem |
| PAN-STK-23 | Revaluaciones: nueva (índice/costo/manual), vista previa de factores, faltantes... | `/stk/revaluaciones` | Admin de la cooperativa | SM-ADM-132 | Principal del ítem |
| PAN-STK-24 | Cierre de stock: checklist previo (verificación de saldos, costos provisorios... | `/stk/cierres` | Admin de la cooperativa | SM-ADM-132 | Asociada al ítem |
| PAN-STK-25 | Lista de bienes de uso: número, descripción, rubro, afectación, origen... | `/stk/bienes-uso` | Admin de la cooperativa | SM-ADM-133 | Principal del ítem |
| PAN-STK-26 | Ficha del bien: datos, importes (origen, % amortizable, vida útil, valor... | `/stk/bienes-uso/:id` | Admin de la cooperativa | SM-ADM-133 | Asociada al ítem |
| PAN-STK-27 | Corridas: nueva (período, tipo, simulación), resultado por bien/rubro/centro... | `/stk/amortizaciones` | Admin de la cooperativa | SM-ADM-133 | Asociada al ítem |
| PAN-STK-28 | Bandeja de RMA por estado (kanban y tabla), garantía, proveedor, antigüedad... | `/stk/rma` | Admin de la cooperativa | SM-ADM-135 | Principal del ítem |
| PAN-STK-29 | Caso RMA: datos de recepción y contacto, equipo, problema, diagnóstico... | `/stk/rma/:id` | Admin de la cooperativa | SM-ADM-135 | Asociada al ítem |
| PAN-STK-30 | Recepciones técnicas de equipos de clientes: alta, ítems con estado por ítem... | `/stk/servicio-tecnico` | Admin de la cooperativa | SM-ADM-135 | Asociada al ítem |
| PAN-STK-31 | Estructuras (árbol multinivel), etapas, divisiones, versiones e historia... | `/stk/fabricacion/estructuras` | Admin de la cooperativa | SM-ADM-134 | Asociada al ítem |
| PAN-STK-32 | Órdenes de fabricación: lista por etapa; ficha con productos, componentes... | `/stk/fabricacion/ordenes` | Admin de la cooperativa | SM-ADM-134 | Principal del ítem |
| PAN-STK-33 | Partes de producción: alta desde orden, ítems, componentes con serie, lanzar... | `/stk/fabricacion/partes` | Admin de la cooperativa | SM-ADM-134 | Asociada al ítem |
| PAN-STK-34 | MRP: rango, requerimientos por componente con fecha, en proceso, stock, mínimo... | `/stk/fabricacion/aprovisionamiento` | Admin de la cooperativa | SM-ADM-134 | Asociada al ítem |
| PAN-STK-35 | Catálogo de informes (sección 15) con parámetros, vista previa, exportación y... | `/stk/informes` | Admin de la cooperativa | SM-ADM-136 | Principal del ítem |
| PAN-STK-36 | Parámetros del módulo (sección 14) agrupados: depósitos por defecto, políticas... | `/stk/configuracion` | Admin de la cooperativa | SM-ADM-333 | Principal del ítem |
| PAN-STK-37 | "Mi stock": cards por artículo (cantidad) y por serie (modelo, serie, MAC)... | `/campo/mi-stock` | PWA campo | SM-PWC-014 | Principal del ítem |
| PAN-STK-38 | En la ejecución de la OT (M10): sección Equipos (escanear serie a instalar o... | `/campo/ot/:id/materiales` | PWA campo | SM-PWC-003 | Asociada al ítem |
| PAN-STK-39 | Conteo de inventario o rendición: escaneo continuo, cantidades por artículo... | `/campo/conteo/:id` | PWA campo | SM-PWC-014 | Asociada al ítem |
| PAN-STK-40 | Componente embebido en PAN-POR-30 (/app/servicios/:contractId, bloque... | `/app/servicios/:contractId`, `/mis-servicios/:id/equipos` | PWA socio | SM-PWS-003 | Asociada al ítem |
| PAN-STK-41 | Entrega rápida desde el depósito con celular/lector: elegir técnico, escanear... | `/deposito/entregas` | PWA empleado | SM-PWE-025 | Principal del ítem |

## 14. M14 TES

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-TES-01 | Posición diaria y alertas | `/admin/tes/tablero` | Admin de la cooperativa | SM-ADM-334 | Principal del ítem |
| PAN-TES-02 | Listado de cuentas financieras | `/admin/tes/cuentas` | Admin de la cooperativa | SM-ADM-137 | Principal del ítem |
| PAN-TES-03 | modal en PAN-TES-02 | — | Admin de la cooperativa | SM-ADM-137 | Asociada al ítem |
| PAN-TES-04 | Entidades financieras y sucursales | `/admin/tes/entidades` | Admin de la cooperativa | SM-ADM-137 | Asociada al ítem |
| PAN-TES-05 | Categorías y conceptos | `/admin/tes/categorias` | Admin de la cooperativa | SM-ADM-139 | Asociada al ítem |
| PAN-TES-06 | Libro unificado de movimientos y operaciones | `/admin/tes/movimientos` | Admin de la cooperativa | SM-ADM-139 | Principal del ítem |
| PAN-TES-07 | Libro de bancos / tesorería | `/admin/tes/cuentas/:id/libro` | Admin de la cooperativa | SM-ADM-138 | Principal del ítem |
| PAN-TES-08 | Importaciones de extractos | `/admin/tes/extractos` | Admin de la cooperativa | SM-ADM-138 | Asociada al ítem |
| PAN-TES-09 | Conciliación asistida | `/admin/tes/conciliacion/:cuenta` | Admin de la cooperativa | SM-ADM-146 | Principal del ítem |
| PAN-TES-10 | Reglas de conciliación | `/admin/tes/reglas-conciliacion` | Admin de la cooperativa | SM-ADM-146 | Asociada al ítem |
| PAN-TES-11 | Conexión y cuentas IB | `/admin/tes/interbanking` | Admin de la cooperativa | SM-ADM-147 | Principal del ítem |
| PAN-TES-12 | Saldos IB vs libro | `/admin/tes/interbanking/saldos` | Admin de la cooperativa | SM-ADM-147 | Asociada al ítem |
| PAN-TES-13 | Archivos de pago | `/admin/tes/archivos-pago` | Admin de la cooperativa | SM-ADM-147 | Asociada al ítem |
| PAN-TES-14 | Cartera de valores de terceros | `/admin/tes/valores` | Admin de la cooperativa | SM-ADM-140 | Principal del ítem |
| PAN-TES-15 | modal lg | — | Admin de la cooperativa | SM-ADM-140 | Asociada al ítem |
| PAN-TES-16 | Cuentas de libradores | `/admin/tes/libradores` | Admin de la cooperativa | SM-ADM-140 | Asociada al ítem |
| PAN-TES-17 | Depósitos bancarios | `/admin/tes/depositos` | Admin de la cooperativa | SM-ADM-140 | Asociada al ítem |
| PAN-TES-18 | Chequeras y cheques propios | `/admin/tes/chequeras` | Admin de la cooperativa | SM-ADM-141 | Principal del ítem |
| PAN-TES-19 | Bandeja eCheq | `/admin/tes/echeq` | Admin de la cooperativa | SM-ADM-141 | Asociada al ítem |
| PAN-TES-20 | modal xl en PAN-TES-18 | — | Admin de la cooperativa | SM-ADM-141 | Asociada al ítem |
| PAN-TES-21 | Tarjetas y planes | `/admin/tes/tarjetas` | Admin de la cooperativa | SM-ADM-142 | Asociada al ítem |
| PAN-TES-22 | Cupones | `/admin/tes/cupones` | Admin de la cooperativa | SM-ADM-142 | Principal del ítem |
| PAN-TES-23 | Liquidaciones de tarjeta | `/admin/tes/liquidaciones-tarjeta` | Admin de la cooperativa | SM-ADM-142 | Asociada al ítem |
| PAN-TES-24 | Cartera de retenciones recibidas | `/admin/tes/retenciones-recibidas` | Admin de la cooperativa | SM-ADM-143 | Principal del ítem |
| PAN-TES-25 | Cajas para pagos a proveedores | `/admin/tes/cajas-pago` | Admin de la cooperativa | SM-ADM-144 | Principal del ítem |
| PAN-TES-26 | Bandeja de pagos a ejecutar | `/admin/tes/pagos` | Admin de la cooperativa | SM-ADM-144 | Asociada al ítem |
| PAN-TES-27 | Firma y entrega | `/admin/tes/pagos/firma` | Admin de la cooperativa | SM-ADM-144 | Asociada al ítem |
| PAN-TES-28 | Rendiciones de cajas de cobranza | `/admin/tes/rendiciones` | Admin de la cooperativa | SM-ADM-145 | Asociada al ítem |
| PAN-TES-29 | Arqueo y cierre de caja de tesorería | `/admin/tes/cierre-caja` | Admin de la cooperativa | SM-ADM-145 | Principal del ítem |
| PAN-TES-30 | Monedas y cotizaciones | `/admin/tes/monedas` | Admin de la cooperativa | SM-ADM-335 | Principal del ítem |
| PAN-TES-31 | Tipos de instrumento | `/admin/tes/tipos-valor` | Admin de la cooperativa | SM-ADM-339 | Asociada al ítem |
| PAN-TES-32 | Flujo de fondos proyectado | `/admin/tes/flujo` | Admin de la cooperativa | SM-ADM-148 | Principal del ítem |
| PAN-TES-33 | Previsiones y compromisos | `/admin/tes/previsiones` | Admin de la cooperativa | SM-ADM-148 | Asociada al ítem |
| PAN-TES-34 | Escenarios de liquidez | `/admin/tes/escenarios` | Admin de la cooperativa | SM-ADM-148 | Asociada al ítem |
| PAN-TES-35 | Lotes de pago de haberes | `/admin/tes/haberes` | Admin de la cooperativa | SM-ADM-336 | Principal del ítem |
| PAN-TES-36 | Catálogo de informes | `/admin/tes/informes` | Admin de la cooperativa | SM-ADM-149 | Principal del ítem |
| PAN-TES-37 | Detalle de operación | `/admin/tes/operaciones/:id` | Admin de la cooperativa | SM-ADM-139 | Asociada al ítem |
| PAN-TES-38 | Bandeja de excepciones | `/admin/tes/excepciones` | Admin de la cooperativa | SM-ADM-337 | Principal del ítem |
| PAN-TES-39 | Parámetros de tesorería | `/admin/tes/configuracion` | Admin de la cooperativa | SM-ADM-339 | Principal del ítem |
| PAN-TES-40 | Firma móvil de pagos | `/app/tesoreria/firmas` | PWA empleado | SM-PWE-023 | Principal del ítem |
| PAN-TES-41 | Posición diaria móvil | `/app/tesoreria/posicion` | PWA empleado | SM-PWE-024 | Principal del ítem |
| PAN-TES-42 | Cierre de períodos de Tesorería y Bancos | `/admin/tes/periodos` | Admin de la cooperativa | SM-ADM-338 | Principal del ítem |

## 15. M15 CON

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-CON-01 | Tablero contable | `/con` | Admin de la cooperativa | SM-ADM-340 | Principal del ítem |
| PAN-CON-02 | Configuración contable | `/con/configuracion` | Admin de la cooperativa | SM-ADM-341 | Principal del ítem |
| PAN-CON-03 | Planes de cuentas | `/con/planes` | Admin de la cooperativa | SM-ADM-150 | Principal del ítem |
| PAN-CON-04 | Árbol y ficha de cuentas | `/con/planes/:chartId/cuentas` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-05 | Rubros y subrubros contables | `/con/planes/:chartId/rubros` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-06 | Renumerar y unificar cuentas | `/con/planes/:chartId/cuentas/mantenimiento` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-07 | Roles de cuenta | `/con/planes/:chartId/roles` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-08 | Reglas de imputación y simulador | `/con/reglas` | Admin de la cooperativa | SM-ADM-154 | Principal del ítem |
| PAN-CON-09 | Asignación y reasignación masiva de cuentas | `/con/asignaciones` | Admin de la cooperativa | SM-ADM-154 | Asociada al ítem |
| PAN-CON-10 | Ejercicios | `/con/ejercicios` | Admin de la cooperativa | SM-ADM-151 | Principal del ítem |
| PAN-CON-11 | Períodos y bloqueos por módulo | `/con/periodos` | Admin de la cooperativa | SM-ADM-151 | Asociada al ítem |
| PAN-CON-12 | Diario (asientos) | `/con/asientos` | Admin de la cooperativa | SM-ADM-153 | Principal del ítem |
| PAN-CON-13 | Asiento (alta, edición y detalle) | `/con/asientos/:id` | Admin de la cooperativa | SM-ADM-153 | Asociada al ítem |
| PAN-CON-14 | Plantillas de asiento | `/con/plantillas` | Admin de la cooperativa | SM-ADM-153 | Asociada al ítem |
| PAN-CON-15 | Importación de asientos | `/con/asientos/importar` | Admin de la cooperativa | SM-ADM-153 | Asociada al ítem |
| PAN-CON-16 | Bandeja de eventos contables | `/con/eventos` | Admin de la cooperativa | SM-ADM-154 | Asociada al ítem |
| PAN-CON-17 | Lote de contabilización ("Cierre automático") | `/con/lotes` | Admin de la cooperativa | SM-ADM-154 | Asociada al ítem |
| PAN-CON-18 | Anulación masiva | `/con/asientos/anulacion-masiva` | Admin de la cooperativa | SM-ADM-153 | Asociada al ítem |
| PAN-CON-19 | Renumeración de asientos | `/con/asientos/renumerar` | Admin de la cooperativa | SM-ADM-157 | Asociada al ítem |
| PAN-CON-20 | Mayor | `/con/reportes/mayor` | Admin de la cooperativa | SM-ADM-155 | Principal del ítem |
| PAN-CON-21 | Sumas y saldos | `/con/reportes/sumas-saldos` | Admin de la cooperativa | SM-ADM-156 | Principal del ítem |
| PAN-CON-22 | Catálogo de informes contables | `/con/reportes` | Admin de la cooperativa | SM-ADM-160 | Principal del ítem |
| PAN-CON-23 | Libros rubricados | `/con/libros` | Admin de la cooperativa | SM-ADM-342 | Principal del ítem |
| PAN-CON-24 | Centros de costo y grupos | `/con/centros` | Admin de la cooperativa | SM-ADM-152 | Principal del ítem |
| PAN-CON-25 | Reglas de asignación a centros | `/con/centros/asignaciones` | Admin de la cooperativa | SM-ADM-152 | Asociada al ítem |
| PAN-CON-26 | Modelos y corridas de distribución | `/con/distribuciones` | Admin de la cooperativa | SM-ADM-152 | Asociada al ítem |
| PAN-CON-27 | Resultado por servicio y sección | `/con/reportes/resultado-servicio` | Admin de la cooperativa | SM-ADM-161 | Principal del ítem |
| PAN-CON-28 | Conciliaciones | `/con/conciliaciones` | Admin de la cooperativa | SM-ADM-343 | Principal del ítem |
| PAN-CON-29 | Índices de inflación | `/con/inflacion/indices` | Admin de la cooperativa | SM-ADM-232 | Asociada al ítem |
| PAN-CON-30 | Ajuste por inflación | `/con/inflacion/corridas` | Admin de la cooperativa | SM-ADM-344 | Principal del ítem |
| PAN-CON-31 | Cierre y reapertura de ejercicio; cuentas de resultado | `/con/ejercicios/:id/cierre` | Admin de la cooperativa | SM-ADM-151 | Asociada al ítem |
| PAN-CON-32 | Equivalencias entre planes | `/con/equivalencias` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-33 | Escenarios de simulación | `/con/simulaciones` | Admin de la cooperativa | SM-ADM-158 | Principal del ítem |
| PAN-CON-34 | Presupuestos | `/con/presupuestos` | Admin de la cooperativa | SM-ADM-159 | Principal del ítem |
| PAN-CON-35 | Ejecución presupuestaria y compromisos | `/con/presupuestos/:id/ejecucion` | Admin de la cooperativa | SM-ADM-159 | Asociada al ítem |
| PAN-CON-36 | Estados contables y plantillas | `/con/estados` | Admin de la cooperativa | SM-ADM-156 | Asociada al ítem |
| PAN-CON-37 | Sistema contable externo | `/con/externo` | Admin de la cooperativa | SM-ADM-345 | Principal del ítem |
| PAN-CON-38 | Rubros de capital | `/con/capital-rubros` | Admin de la cooperativa | SM-ADM-150 | Asociada al ítem |
| PAN-CON-39 | Anticipos y saldos a favor a una fecha | `/con/reportes/anticipos` | Admin de la cooperativa | SM-ADM-160 | Asociada al ítem |
| PAN-CON-40 | Salud de la configuración contable | `/con/salud` | Admin de la cooperativa | SM-ADM-157 | Principal del ítem |
