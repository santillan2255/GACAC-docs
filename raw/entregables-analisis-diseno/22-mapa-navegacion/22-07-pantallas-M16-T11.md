# Pantallas de los anexos M16 a T11 y su ubicación en el mapa

Parte del entregable [22 Mapa de navegación y arquitectura de información](../22-mapa-navegacion.md) (artefacto 4.1). Generado con `_trabajo/gen_22_navegacion.py` desde T03 §10.8 y §10.9 y las pantallas (PAN) de los anexos; revisado a mano. Ante cualquier diferencia prevalece T03 y el anexo dueño de la pantalla.

Cada PAN definido en el anexo, con la ruta que declara el anexo, el portal y su ubicación en el mapa del sitio (ítem `SM-*` de T03). La ruta canónica es la del ítem.

## 1. M16 SUE

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-SUE-01 | Tablero de sueldos | `/sue` | Admin de la cooperativa | SM-ADM-346 | Principal del ítem |
| PAN-SUE-02 | Listado de empleados | `/sue/empleados` | Admin de la cooperativa | SM-ADM-162 | Principal del ítem |
| PAN-SUE-03 | Ficha del legajo | `/sue/empleados/:id` | Admin de la cooperativa | SM-ADM-162 | Asociada al ítem |
| PAN-SUE-04 | Alta en asistente | `/sue/empleados/nuevo` | Admin de la cooperativa | SM-ADM-162 | Asociada al ítem |
| PAN-SUE-05 | Empresas empleadoras | `/sue/empresas` | Admin de la cooperativa | SM-ADM-163 | Principal del ítem |
| PAN-SUE-06 | Sindicatos y convenios | `/sue/config/sindicatos-convenios` | Admin de la cooperativa | SM-ADM-163 | Asociada al ítem |
| PAN-SUE-07 | Categorías, escalas y antigüedad | `/sue/config/categorias-escalas` | Admin de la cooperativa | SM-ADM-163 | Asociada al ítem |
| PAN-SUE-08 | Cargos y áreas | `/sue/config/cargos-areas` | Admin de la cooperativa | SM-ADM-163 | Asociada al ítem |
| PAN-SUE-09 | Turnos y jornadas | `/sue/config/turnos` | Admin de la cooperativa | SM-ADM-163 | Asociada al ítem |
| PAN-SUE-10 | Obras sociales adoptadas y motivos de egreso | `/sue/config/obras-sociales` | Admin de la cooperativa | SM-ADM-163 | Asociada al ítem |
| PAN-SUE-11 | Consulta de tablas oficiales adoptadas | `/sue/config/tablas-oficiales` | Admin de la cooperativa | SM-ADM-173 | Asociada al ítem |
| PAN-SUE-12 | Variables | `/sue/config/variables` | Admin de la cooperativa | SM-ADM-169 | Principal del ítem |
| PAN-SUE-13 | Conceptos y editor de fórmulas | `/sue/config/conceptos` | Admin de la cooperativa | SM-ADM-170 | Principal del ítem |
| PAN-SUE-14 | Tipos de liquidación | `/sue/config/tipos-liquidacion` | Admin de la cooperativa | SM-ADM-166 | Asociada al ítem |
| PAN-SUE-15 | Versiones de configuración | `/sue/config/versiones` | Admin de la cooperativa | SM-ADM-170 | Asociada al ítem |
| PAN-SUE-16 | Aplicar aumentos | `/sue/config/aumentos` | Admin de la cooperativa | SM-ADM-171 | Principal del ítem |
| PAN-SUE-17 | Tipos de novedad y causas de licencia | `/sue/config/tipos-novedad` | Admin de la cooperativa | SM-ADM-165 | Asociada al ítem |
| PAN-SUE-18 | Novedades del período | `/sue/novedades` | Admin de la cooperativa | SM-ADM-165 | Principal del ítem |
| PAN-SUE-19 | Importación de novedades | `/sue/novedades/importar` | Admin de la cooperativa | SM-ADM-165 | Asociada al ítem |
| PAN-SUE-20 | Fichadas y horarios | `/sue/fichadas` | Admin de la cooperativa | SM-ADM-165 | Asociada al ítem |
| PAN-SUE-21 | Tareas extra | `/sue/tareas-extra` | Admin de la cooperativa | SM-ADM-165 | Asociada al ítem |
| PAN-SUE-22 | Bandeja y calendario de licencias | `/sue/licencias` | Admin de la cooperativa | SM-ADM-347 | Principal del ítem |
| PAN-SUE-23 | Períodos de sueldos | `/sue/periodos` | Admin de la cooperativa | SM-ADM-166 | Asociada al ítem |
| PAN-SUE-24 | Liquidaciones | `/sue/liquidaciones` | Admin de la cooperativa | SM-ADM-166 | Principal del ítem |
| PAN-SUE-25 | Detalle de liquidación | `/sue/liquidaciones/:id` | Admin de la cooperativa | SM-ADM-166 | Asociada al ítem |
| PAN-SUE-26 | Simulador | `/sue/simulador` | Admin de la cooperativa | SM-ADM-167 | Principal del ítem |
| PAN-SUE-27 | Recibo | `/sue/recibos/:id` | Admin de la cooperativa | SM-ADM-164 | Principal del ítem |
| PAN-SUE-28 | Egresos y liquidación final | `/sue/egresos` | Admin de la cooperativa | SM-ADM-162 | Asociada al ítem |
| PAN-SUE-29 | Ganancias | `/sue/ganancias` | Admin de la cooperativa | SM-ADM-168 | Principal del ítem |
| PAN-SUE-30 | Presentaciones | `/sue/presentaciones` | Admin de la cooperativa | SM-ADM-172 | Principal del ítem |
| PAN-SUE-31 | Pago de haberes | `/sue/pagos` | Admin de la cooperativa | SM-ADM-348 | Principal del ítem |
| PAN-SUE-32 | Reglas de imputación contable | `/sue/config/contabilidad` | Admin de la cooperativa | SM-ADM-350 | Principal del ítem |
| PAN-SUE-33 | Certificados y constancias | `/sue/certificados` | Admin de la cooperativa | SM-ADM-351 | Principal del ítem |
| PAN-SUE-34 | Evaluaciones y objetivos | `/sue/rrhh/evaluaciones` | Admin de la cooperativa | SM-ADM-352 | Principal del ítem |
| PAN-SUE-35 | Sanciones y sumarios | `/sue/rrhh/disciplina` | Admin de la cooperativa | SM-ADM-352 | Asociada al ítem |
| PAN-SUE-36 | Accidentes y ART | `/sue/rrhh/accidentes` | Admin de la cooperativa | SM-ADM-352 | Asociada al ítem |
| PAN-SUE-37 | Juicios laborales | `/sue/rrhh/juicios` | Admin de la cooperativa | SM-ADM-352 | Asociada al ítem |
| PAN-SUE-38 | Informes de sueldos | `/sue/informes` | Admin de la cooperativa | SM-ADM-173 | Principal del ítem |
| PAN-SUE-39 | Liquidación externa (CU-28) | `/sue/importacion-externa` | Admin de la cooperativa | SM-ADM-349 | Principal del ítem |
| PAN-SUE-40 | Paralelo ProCoop | `/sue/paralelo` | Admin de la cooperativa | SM-ADM-166 | Asociada al ítem |
| PAN-SUE-41 | Mis recibos | `/empleado/recibos`, `/app/empleado/recibos` | PWA empleado | SM-PWE-013 | Principal del ítem |
| PAN-SUE-42 | Vacaciones y licencias | `/empleado/licencias`, `/app/empleado/vacaciones` | PWA empleado | SM-PWE-018 | Principal del ítem |
| PAN-SUE-43 | Mis datos y documentos | `/empleado/datos`, `/app/empleado/legajo` | PWA empleado | SM-PWE-019 | Principal del ítem |
| PAN-SUE-44 | Mi equipo (encargado) | `/empleado/equipo`, `/app/empleado/equipo` | PWA empleado | SM-PWE-022 | Principal del ítem |
| PAN-SUE-45 | Mis certificados y constancias | `/empleado/certificados`, `/app/empleado/certificados` | PWA empleado | SM-PWE-020 | Principal del ítem |
| PAN-SUE-46 | Mis evaluaciones y objetivos | `/empleado/evaluaciones`, `/app/empleado/evaluaciones` | PWA empleado | SM-PWE-021 | Principal del ítem |
| PAN-SUE-47 | Tablas oficiales de sueldos y Ganancias (pantalla de T04, especificada aquí por... | `/platform/tablas-sueldos` | Plataforma | SM-PLT-008 | Asociada al ítem |

## 2. M17 INS

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-INS-01 | Listado de asociados | `/ins/asociados` | Admin de la cooperativa | SM-ADM-174 | Principal del ítem |
| PAN-INS-02 | Ficha institucional | `/ins/asociados/:id` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-03 | Bandeja de solicitudes de ingreso | `/ins/solicitudes` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-04 | Trámites de egreso y exclusión | `/ins/egresos` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-05 | Libro de Registro de Asociados | `/ins/libro` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-06 | Rubros, reglas de suscripción y valor de cuota social | `/ins/config/capital` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-07 | Movimientos de capital | `/ins/capital/movimientos` | Admin de la cooperativa | SM-ADM-175 | Principal del ítem |
| PAN-INS-08 | Estado de cuenta de capital | `/ins/asociados/:id/capital` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-09 | Reservas y recuperos | `/ins/capital/reservas` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-10 | Transferencias de capital entre asociados | `/ins/capital/transferencias` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-11 | Rescates/reembolsos | `/ins/capital/rescates` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-12 | Cierres, revisión y conciliación | `/ins/capital/cierres` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-13 | Importación de capital (ExcelImportWizard de T07) | `/ins/capital/importar` | Admin de la cooperativa | SM-ADM-175 | Asociada al ítem |
| PAN-INS-14 | Distribución de excedentes | `/ins/excedentes` | Admin de la cooperativa | SM-ADM-353 | Principal del ítem |
| PAN-INS-15 | Órganos, cargos y mandatos | `/ins/organos` | Admin de la cooperativa | SM-ADM-177 | Principal del ítem |
| PAN-INS-16 | Agenda de reuniones | `/ins/reuniones` | Admin de la cooperativa | SM-ADM-178 | Principal del ítem |
| PAN-INS-17 | Detalle de reunión | `/ins/reuniones/:id` | Admin de la cooperativa | SM-ADM-178 | Asociada al ítem |
| PAN-INS-18 | Expediente de asamblea | `/ins/asambleas/:id` | Admin de la cooperativa | SM-ADM-176 | Principal del ítem |
| PAN-INS-19 | Padrones | `/ins/padrones` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-20 | Acreditación en el acto | `/app/ins/acreditacion/:meetingId` | PWA empleado | SM-PWE-026 | Principal del ítem |
| PAN-INS-21 | Votaciones y escrutinio | `/ins/asambleas/:id/votaciones` | Admin de la cooperativa | SM-ADM-176 | Asociada al ítem |
| PAN-INS-22 | Listas y junta electoral | `/ins/asambleas/:id/listas` | Admin de la cooperativa | SM-ADM-176 | Asociada al ítem |
| PAN-INS-23 | Libros de actas | `/ins/actas` | Admin de la cooperativa | SM-ADM-177 | Asociada al ítem |
| PAN-INS-24 | Seguimiento de resoluciones | `/ins/resoluciones` | Admin de la cooperativa | SM-ADM-177 | Asociada al ítem |
| PAN-INS-25 | Honorarios institucionales | `/ins/honorarios` | Admin de la cooperativa | SM-ADM-177 | Asociada al ítem |
| PAN-INS-26 | Presentaciones INAES | `/ins/inaes` | Admin de la cooperativa | SM-ADM-179 | Principal del ítem |
| PAN-INS-27 | Credenciales | `/ins/credenciales` | Admin de la cooperativa | SM-ADM-174 | Asociada al ítem |
| PAN-INS-28 | Configuración institucional | `/ins/config` | Admin de la cooperativa | SM-ADM-354 | Principal del ítem |
| PAN-INS-29 | Distritos electorales | `/ins/config/distritos` | Admin de la cooperativa | SM-ADM-176 | Asociada al ítem |
| PAN-INS-30 | Mi asociación — Componente embebido en PAN-POR-102 de M19 (M19 es dueño de la... | `/app/mi-asociacion` | PWA socio | SM-PWS-039 | Asociada al ítem |
| PAN-INS-31 | Convocatorias y padrón propio | `/app/asambleas` | PWA socio | SM-PWS-039 | Asociada al ítem |
| PAN-INS-32 | Solicitud de ingreso | `/app/asociarme` | PWA socio | SM-PWS-039 | Asociada al ítem |
| PAN-INS-33 | public: true (antes: público) | `/<tenantSlug>/asambleas` | Landing | SM-LND-024 | Principal del ítem |

## 3. M18 SOC

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-SOC-01 | Grupo de cobertura de un contrato | `/soc/contratos/:id/grupo` | Admin de la cooperativa | SM-ADM-012 | Asociada al ítem |
| PAN-SOC-02 | Bajas por condición, mayoría de edad y recategorización masiva | `/soc/adherentes/revision` | Admin de la cooperativa | SM-ADM-356 | Principal del ítem |
| PAN-SOC-03 | Planes de cobertura | `/soc/config/planes` | Admin de la cooperativa | SM-ADM-357 | Principal del ítem |
| PAN-SOC-04 | Prestadores y convenios | `/soc/prestadores` | Admin de la cooperativa | SM-ADM-186 | Asociada al ítem |
| PAN-SOC-05 | Bandeja de solicitudes de prestación | `/soc/solicitudes` | Admin de la cooperativa | SM-ADM-355 | Principal del ítem |
| PAN-SOC-06 | Detalle de solicitud | `/soc/solicitudes/:id` | Admin de la cooperativa | SM-ADM-355 | Asociada al ítem |
| PAN-SOC-07 | Caso de sepelio | `/soc/sepelios/:id` | Admin de la cooperativa | SM-ADM-184 | Principal del ítem |
| PAN-SOC-08 | Subsidios por fallecimiento | `/soc/subsidios` | Admin de la cooperativa | SM-ADM-358 | Principal del ítem |
| PAN-SOC-09 | Plano y catálogo de unidades | `/soc/cementerio/:cemeteryId/plano` | Admin de la cooperativa | SM-ADM-185 | Principal del ítem |
| PAN-SOC-10 | Ficha del derecho de sepultura | `/soc/cementerio/derechos/:id` | Admin de la cooperativa | SM-ADM-185 | Asociada al ítem |
| PAN-SOC-11 | Agenda de actos | `/soc/cementerio/actos` | Admin de la cooperativa | SM-ADM-185 | Asociada al ítem |
| PAN-SOC-12 | Establecimientos, reglamentos, sectores y tipos de unidad | `/soc/cementerio/config` | Admin de la cooperativa | SM-ADM-185 | Asociada al ítem |
| PAN-SOC-13 | Banco de sangre | `/soc/sangre` | Admin de la cooperativa | SM-ADM-187 | Principal del ítem |
| PAN-SOC-14 | Agenda y registro de traslados | `/soc/traslados` | Admin de la cooperativa | SM-ADM-189 | Principal del ítem |
| PAN-SOC-15 | Informe general de traslados | `/soc/traslados/informes` | Admin de la cooperativa | SM-ADM-190 | Principal del ítem |
| PAN-SOC-16 | Autorizaciones de internación y prácticas | `/soc/autorizaciones` | Admin de la cooperativa | SM-ADM-186 | Principal del ítem |
| PAN-SOC-17 | Planes, tipologías, precios, etapas y actividades | `/soc/vivienda/planes` | Admin de la cooperativa | SM-ADM-180 | Principal del ítem |
| PAN-SOC-18 | Viviendas inscriptas | `/soc/vivienda/unidades` | Admin de la cooperativa | SM-ADM-180 | Asociada al ítem |
| PAN-SOC-19 | Ficha de la vivienda | `/soc/vivienda/unidades/:id` | Admin de la cooperativa | SM-ADM-180 | Asociada al ítem |
| PAN-SOC-20 | Certificados de obra | `/soc/vivienda/certificados` | Admin de la cooperativa | SM-ADM-182 | Principal del ítem |
| PAN-SOC-21 | Informes de vivienda | `/soc/vivienda/informes` | Admin de la cooperativa | SM-ADM-183 | Principal del ítem |
| PAN-SOC-22 | Vehículos | `/soc/flota/vehiculos` | Admin de la cooperativa | SM-ADM-188 | Principal del ítem |
| PAN-SOC-23 | Choferes | `/soc/flota/choferes` | Admin de la cooperativa | SM-ADM-188 | Asociada al ítem |
| PAN-SOC-24 | Combustibles y cargas | `/soc/flota/combustible` | Admin de la cooperativa | SM-ADM-188 | Asociada al ítem |
| PAN-SOC-25 | Rendiciones de viaje | `/soc/flota/rendiciones` | Admin de la cooperativa | SM-ADM-190 | Asociada al ítem |
| PAN-SOC-26 | Recorridos GPS | `/soc/flota/gps` | Admin de la cooperativa | SM-ADM-191 | Principal del ítem |
| PAN-SOC-27 | Banco ortopédico | `/soc/otros/ortopedia` | Admin de la cooperativa | SM-ADM-359 | Principal del ítem |
| PAN-SOC-28 | Retiros de dispenser | `/soc/otros/dispenser` | Admin de la cooperativa | SM-ADM-360 | Principal del ítem |
| PAN-SOC-29 | Parámetros del módulo | `/soc/config` | Admin de la cooperativa | SM-ADM-361 | Principal del ítem |
| PAN-SOC-30 | Mi grupo y coberturas — Componente embebido en PAN-POR-98 de M19 (M19 es dueño... | `/app/mi-grupo` | PWA socio | SM-PWS-038 | Asociada al ítem |
| PAN-SOC-31 | Solicitudes de prestación — Componente embebido en PAN-POR-99 de M19 (M19 es... | `/app/solicitudes-sociales` | PWA socio | SM-PWS-038 | Asociada al ítem |
| PAN-SOC-32 | Mis derechos de sepultura — Componente embebido en PAN-POR-100 de M19 (M19 es... | `/app/cementerio` | PWA socio | SM-PWS-038 | Asociada al ítem |
| PAN-SOC-33 | Mi plan de vivienda — Componente embebido en PAN-POR-101 de M19 (M19 es dueño... | `/app/vivienda` | PWA socio | SM-PWS-038 | Asociada al ítem |
| PAN-SOC-34 | Viajes del chofer | `/app/campo/viajes` | PWA campo | SM-PWC-017 | Principal del ítem |
| PAN-SOC-35 | Registro de actos en el parque | `/app/soc/cementerio/actos` | PWA empleado | SM-PWE-027 | Principal del ítem |

## 4. M19 POR

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-POR-01 | public: true (antes: Pública) | `/` | Landing | SM-LND-001 | Principal del ítem |
| PAN-POR-02 | public: true (antes: Pública) | `/servicios` | Landing | SM-LND-002 | Principal del ítem |
| PAN-POR-03 | public: true (antes: Pública) | `/servicios/:serviceCode` | Landing | SM-LND-003 | Principal del ítem |
| PAN-POR-04 | public: true (antes: Pública) | `/cobertura` | Landing | SM-LND-020 | Principal del ítem |
| PAN-POR-05 | public: true (antes: Pública) | `/noticias` | Landing | SM-LND-004 | Principal del ítem |
| PAN-POR-06 | public: true (antes: Pública) | `/noticias/:slug` | Landing | SM-LND-005 | Principal del ítem |
| PAN-POR-07 | public: true (antes: Pública) | `/avisos-de-corte` | Landing | SM-LND-021 | Principal del ítem |
| PAN-POR-08 | public: true (antes: Pública) | `/tramites` | Landing | SM-LND-015 | Principal del ítem |
| PAN-POR-09 | public: true (antes: Pública) | `/baja` | Landing | SM-LND-013 | Principal del ítem |
| PAN-POR-10 | public: true (antes: Pública (token de sesión efímero)) | `/baja/recibida/:code` | Landing | SM-LND-012 | Asociada al ítem |
| PAN-POR-100 | soc.mi.ver (+ por.portal.ver) | `/app/cementerio` | PWA socio | SM-PWS-047 | Principal del ítem |
| PAN-POR-101 | soc.mi.ver (+ por.portal.ver) | `/app/vivienda` | PWA socio | SM-PWS-048 | Principal del ítem |
| PAN-POR-102 | ins.mi.ver (+ por.portal.ver) | `/app/mi-asociacion` | PWA socio | SM-PWS-039 | Principal del ítem |
| PAN-POR-103 | por.consumos.ver + acceso consultar | `/app/servicios/:contractId/llamadas` | PWA socio | SM-PWS-003 | Asociada al ítem |
| PAN-POR-104 | public: true (antes: Pública (solo si PRM-SOC-050 = true; HUECO-CEM-02)) | `/cementerio/buscar` | Landing | SM-LND-034 | Principal del ítem |
| PAN-POR-105 | por.portal.ver; cada pestaña exige además la capability de T09 (com.wall.ver... | `/app/comunidad` | PWA socio | SM-PWS-026 | Principal del ítem |
| PAN-POR-11 | public: true (antes: Pública) | `/baja/seguimiento` | Landing | SM-LND-012 | Principal del ítem |
| PAN-POR-12 | public: true (antes: Pública (si PRM-POR-052)) | `/pagar` | Landing | SM-LND-010 | Principal del ítem |
| PAN-POR-13 | public: true (antes: Pública) | `/contacto` | Landing | SM-LND-011 | Principal del ítem |
| PAN-POR-14 | public: true (antes: Pública) | `/sucursales` | Landing | SM-LND-017 | Asociada al ítem |
| PAN-POR-15 | public: true (antes: Pública) | `/ayuda` | Landing | SM-LND-022 | Principal del ítem |
| PAN-POR-16 | public: true (antes: Pública) | `/legal/:tipo` | Landing | SM-LND-018 | Principal del ítem |
| PAN-POR-17 | public: true (antes: Pública con token) | `/e/:token` | Landing | SM-LND-016 | Asociada al ítem |
| PAN-POR-18 | public: true (antes: Pública) | `/registro` | Landing | SM-LND-006 | Principal del ítem |
| PAN-POR-19 | public: true (antes: Pública) | `/ingresar`, `/recuperar` | Landing | SM-LND-007 | Principal del ítem |
| PAN-POR-20 | public: true (antes: Pública) | `/activar` | Landing | SM-LND-006 | Asociada al ítem |
| PAN-POR-21 | public: true (antes: Pública) | `/cooperativas` | Landing | SM-LND-031 | Principal del ítem |
| PAN-POR-22 | public: true (antes: Pública) | `/pagar/codigo` | Landing | SM-LND-010 | Asociada al ítem |
| PAN-POR-23 | por.portal.ver (antes: Sesión) | `/app` | PWA socio | SM-PWS-001 | Asociada al ítem |
| PAN-POR-24 | por.portal.ver (antes: Sesión) | `/app/terminos` | PWA socio | SM-PWS-001 | Asociada al ítem |
| PAN-POR-25 | Variante por rol (§10.8): saldo/vencimiento, acciones rápidas, trámites en... | `/app/inicio` | PWA socio | SM-PWS-001 | Principal del ítem |
| PAN-POR-26 | Cards de cuentas: número, titular, rol de acceso, servicios, saldo, badge de... | `/app/cuentas` | PWA socio | SM-PWS-002 | Principal del ítem |
| PAN-POR-27 | Método (pestañas): Código de socio y clave; Suministro y documento; Datos de... | `/app/cuentas/vincular` | PWA socio | SM-PWS-004 | Principal del ítem |
| PAN-POR-28 | Titular, domicilio postal, servicios, saldo, accesos de terceros (si soy... | `/app/cuentas/:accountId` | PWA socio | SM-PWS-002 | Asociada al ítem |
| PAN-POR-29 | Cards por contrato: servicio, plan, domicilio, estado del servicio (rail) y... | `/app/servicios` | PWA socio | SM-PWS-002 | Asociada al ítem |
| PAN-POR-30 | Plan, domicilio, medidor, alta/baja, fecha efectiva, primer cobro, equipo en... | `/app/servicios/:contractId` | PWA socio | SM-PWS-003 | Principal del ítem |
| PAN-POR-31 | Catálogo habilitado con planes; aviso de deuda vencida si PRM-POR-071 | `/app/contratar` | PWA socio | SM-PWS-005 | Principal del ítem |
| PAN-POR-32 | por.gestiones.crear (además, audience y requiredAction del formulario) (antes... | `/app/tramites/nuevo/:formCode`, `/` | PWA socio | SM-PWS-018 | Asociada al ítem |
| PAN-POR-33 | Número, tipo, estado, línea de tiempo, plazo, mensajes, adjuntos, observaciones... | `/app/gestiones/:caseId` | PWA socio | SM-PWS-019 | Principal del ítem |
| PAN-POR-34 | Días disponibles y franjas (lista accesible; calendario opcional). Componentes... | `/app/visitas/coordinar/:caseId` | PWA socio | SM-PWS-020 | Asociada al ítem |
| PAN-POR-35 | Fecha/franja, estado, técnico (nombre), ETA, instrucciones de preparación... | `/app/visitas/:visitId` | PWA socio | SM-PWS-020 | Principal del ítem |
| PAN-POR-36 | por.visitas.gestionar + acción firmar | `/app/visitas/:visitId/conformidad` | PWA socio | SM-PWS-021 | Principal del ítem |
| PAN-POR-37 | Condiciones: fecha efectiva elegible, costo habilitado (ARS 0 en baja)... | `/app/servicios/:contractId/:accion` | PWA socio | SM-PWS-006 | Principal del ítem |
| PAN-POR-38 | Pestañas Adeudadas / Todas; cards: servicio(s), período, vencimiento, importe... | `/app/facturas` | PWA socio | SM-PWS-007 | Principal del ítem |
| PAN-POR-39 | Encabezado fiscal, vencimientos, apertura por servicio (renglones, lecturas... | `/app/facturas/:invoiceId` | PWA socio | SM-PWS-008 | Principal del ítem |
| PAN-POR-40 | Facturas seleccionadas, recargos al día o diferidos, percepciones, total, regla... | `/app/pagar` | PWA socio | SM-PWS-009 | Principal del ítem |
| PAN-POR-41 | Estado (stepper: generado → pendiente → confirmado → imputado → comprobante... | `/app/pagos/:checkoutId` | PWA socio | SM-PWS-010 | Principal del ítem |
| PAN-POR-42 | Historial de pagos de todos los canales | `/app/pagos` | PWA socio | SM-PWS-010 | Asociada al ítem |
| PAN-POR-43 | Movimientos débito/crédito, saldo, saldo a favor; resumen de cuenta si... | `/app/cuentas/:accountId/movimientos` | PWA socio | SM-PWS-011 | Principal del ítem |
| PAN-POR-44 | Estado de adhesión por cuenta/servicio, medio enmascarado | `/app/debito-automatico` | PWA socio | SM-PWS-012 | Principal del ítem |
| PAN-POR-45 | Estado por cuenta, canales (correo, WhatsApp), medio verificado | `/app/factura-digital` | PWA socio | SM-PWS-012 | Asociada al ítem |
| PAN-POR-46 | Convenios con cuotas, estado, próximas cuotas. Componentes embebidos... | `/app/convenios` | PWA socio | SM-PWS-013 | Principal del ítem |
| PAN-POR-47 | Gráfico de barras por período + tabla, comparaciones, promedio diario, tipo de... | `/app/consumos(/:contractId)` | PWA socio | SM-PWS-014 | Principal del ítem |
| PAN-POR-48 | Ventana vigente, instrucciones, cámara con guía, valor propuesto por OCR... | `/app/autolectura/:contractId` | PWA socio | SM-PWS-015 | Principal del ítem |
| PAN-POR-49 | Servicios prepagos, saldo/crédito, importes sugeridos, cálculo (capital... | `/app/prepaga` | PWA socio | SM-PWS-016 | Principal del ítem |
| PAN-POR-50 | Pestañas Abiertas / Cerradas / Históricas (migradas); cards con tipo, número... | `/app/gestiones` | PWA socio | SM-PWS-017 | Principal del ítem |
| PAN-POR-51 | Tipo (Reclamo, Consulta, Trámite → elige formulario), servicio/contrato, motivo... | `/app/gestiones/nueva` | PWA socio | SM-PWS-018 | Principal del ítem |
| PAN-POR-52 | Turnos vigentes con número, área, sucursal, tiempo estimado, QR | `/app/turnos` | PWA socio | SM-PWS-022 | Principal del ítem |
| PAN-POR-53 | com.inbox.ver (+ por.portal.ver) | `/app/avisos` | PWA socio | SM-PWS-031 | Principal del ítem |
| PAN-POR-54 | com.surveys.responder (+ por.portal.ver) | `/app/encuestas(/:id)` | PWA socio | SM-PWS-030 | Principal del ítem |
| PAN-POR-55 | com.wall.ver (+ por.portal.ver) | `/app/muro(/:id)` | PWA socio | SM-PWS-027 | Principal del ítem |
| PAN-POR-56 | com.wall.ver (+ por.portal.ver) | `/app/novedades(/:id)` | PWA socio | SM-PWS-029 | Principal del ítem |
| PAN-POR-57 | Pestañas "Autoricé" (personas, cuentas, acciones, vigencia, estado) y "Me... | `/app/representaciones` | PWA socio | SM-PWS-034 | Principal del ítem |
| PAN-POR-58 | Modal: contacto, cuentas/contratos, acciones (casillas), vigencia; aceptación... | `/app/invitacion/:token` | PWA socio | SM-PWS-034 | Asociada al ítem |
| PAN-POR-59 | Nombre, documento (solo lectura), correo y celular (verificables), domicilio... | `/app/perfil` | PWA socio | SM-PWS-032 | Principal del ítem |
| PAN-POR-60 | com.preferences.editar (+ por.portal.ver) | `/app/perfil/comunicaciones` | PWA socio | SM-PWS-035 | Principal del ítem |
| PAN-POR-61 | iam.miCuenta.gestionar (antes: Sesión) | `/app/perfil/seguridad` | PWA socio | SM-PWS-037 | Principal del ítem |
| PAN-POR-62 | por.preferencias.editar (antes: Sesión) | `/app/perfil/apariencia` | PWA socio | SM-PWS-036 | Principal del ítem |
| PAN-POR-63 | Borradores con tipo, paso, vencimiento | `/app/borradores` | PWA socio | SM-PWS-018 | Asociada al ítem |
| PAN-POR-64 | Constancias emitidas (alta, baja, trámite, libre deuda, conformidad, adhesiones) | `/app/constancias` | PWA socio | SM-PWS-024 | Principal del ítem |
| PAN-POR-65 | por.portal.ver (antes: Sesión) | `/app/ayuda` | PWA socio | SM-PWS-040 | Principal del ítem |
| PAN-POR-66 | Grilla armada con la plantilla del servicio (PRM-CAT-110 vía API-POR-125... | `/app/ddjj/:contractId` | PWA socio | SM-PWS-003 | Asociada al ítem |
| PAN-POR-67 | Adherentes con vínculo y fecha de alta (componente PAN-SOC-30 filtrado por... | `/app/servicios/:contractId/adherentes` | PWA socio | SM-PWS-003 | Asociada al ítem |
| PAN-POR-68 | Interrupciones que afectan las zonas de mis suministros | `/app/avisos-de-corte` | PWA socio | SM-PWS-025 | Principal del ítem |
| PAN-POR-69 | M16 SUE, T09 COM | `/app/empleado` | PWA empleado | SM-PWE-001 | Principal del ítem |
| PAN-POR-70 | M16 SUE | `/app/empleado/recibos` | PWA empleado | SM-PWE-013 | Asociada al ítem |
| PAN-POR-71 | M16 SUE, T11 WFL | `/app/empleado/recibos/:id` | PWA empleado | SM-PWE-014 | Asociada al ítem |
| PAN-POR-72 | M16 SUE | `/app/empleado/vacaciones` | PWA empleado | SM-PWE-018 | Asociada al ítem |
| PAN-POR-73 | M16 SUE | `/app/empleado/licencias` | PWA empleado | SM-PWE-018 | Asociada al ítem |
| PAN-POR-74 | M16 SUE | `/app/empleado/legajo` | PWA empleado | SM-PWE-019 | Asociada al ítem |
| PAN-POR-75 | com.wall.verInterno (+ por.empleado.ver) | `/app/empleado/muro` | PWA empleado | SM-PWE-001 | Asociada al ítem |
| PAN-POR-76 | com.inbox.ver (+ por.empleado.ver) | `/app/empleado/avisos` | PWA empleado | SM-PWE-006 | Principal del ítem |
| PAN-POR-77 | Capabilities M10/M03/M07 | `/app/campo` | PWA campo | SM-PWC-001 | Asociada al ítem |
| PAN-POR-78 | pwa-socio (tótem) | `/totem` | Dispositivo (kiosco) | SM-DSP-001 | Principal del ítem |
| PAN-POR-79 | pwa-socio (tótem) | `/totem/identificar` | Dispositivo (kiosco) | SM-DSP-001 | Asociada al ítem |
| PAN-POR-80 | pwa-socio (tótem) | `/totem/deuda` | Dispositivo (kiosco) | SM-DSP-001 | Asociada al ítem |
| PAN-POR-81 | pwa-socio (tótem) | `/totem/pago` | Dispositivo (kiosco) | SM-DSP-001 | Asociada al ítem |
| PAN-POR-82 | pwa-socio (tótem) | `/totem/prepaga` | Dispositivo (kiosco) | SM-DSP-001 | Asociada al ítem |
| PAN-POR-83 | pwa-socio (tótem) | `/totem/fin` | Dispositivo (kiosco) | SM-DSP-001 | Asociada al ítem |
| PAN-POR-84 | Parámetros PRM-POR-* agrupados (Acceso, Vinculación, Facturas, Pagos, Consumos... | `/admin/portal/configuracion` | Admin de la cooperativa | SM-ADM-210 | Principal del ítem |
| PAN-POR-85 | Editor por bloques (lista ordenable con alternativa por botones subir/bajar)... | `/admin/portal/landing` | Admin de la cooperativa | SM-ADM-204 | Principal del ítem |
| PAN-POR-86 | DataTable de versiones (número, estado, autor, fechas) | `/admin/portal/landing/versiones` | Admin de la cooperativa | SM-ADM-204 | Asociada al ítem |
| PAN-POR-87 | DataTable: código, nombre, servicio, tipo, audiencia, versión, estado... | `/admin/portal/formularios` | Admin de la cooperativa | SM-ADM-206 | Principal del ítem |
| PAN-POR-88 | Constructor: datos generales (tipo, sujeto requerido, repetición, comparar... | `/admin/portal/formularios/:id` | Admin de la cooperativa | SM-ADM-206 | Asociada al ítem |
| PAN-POR-89 | Bandeja de accesos pendienteVerificacion/asistidos: usuario, cuenta, método... | `/admin/portal/vinculaciones` | Admin de la cooperativa | SM-ADM-367 | Principal del ítem |
| PAN-POR-90 | Por cuenta: usuarios con acceso, rol, acciones, vigencia, origen, último uso... | `/admin/portal/accesos` | Admin de la cooperativa | SM-ADM-011 | Asociada al ítem |
| PAN-POR-91 | Bajas y contactos públicos: código, servicio, estado, plazos (semáforo 24 h /... | `/admin/portal/recepcion-publica` | Admin de la cooperativa | SM-ADM-209 | Principal del ítem |
| PAN-POR-92 | Asistente: subir volcado → validar → ver errores/conflictos → importar →... | `/admin/portal/migracion` | Admin de la cooperativa | SM-ADM-372 | Principal del ítem |
| PAN-POR-93 | DataTable de banners con audiencia y vigencia; preview por rol | `/admin/portal/banners` | Admin de la cooperativa | SM-ADM-368 | Principal del ítem |
| PAN-POR-94 | Indicadores del §15 con filtros de período, servicio, canal | `/admin/portal/metricas` | Admin de la cooperativa | SM-ADM-369 | Principal del ítem |
| PAN-POR-95 | Marco "celular" con la PWA en modo solo lectura de la cuenta; banda superior... | `/admin/portal/vista-socio/:accountId` | Admin de la cooperativa | SM-ADM-370 | Principal del ítem |
| PAN-POR-96 | DataTable de tótems: sucursal, caja, estado, último heartbeat, medios | `/admin/portal/totems` | Admin de la cooperativa | SM-ADM-371 | Principal del ítem |
| PAN-POR-97 | Presentaciones por formulario/estado; detalle con "Datos del formulario" y... | `/admin/portal/presentaciones` | Admin de la cooperativa | SM-ADM-089 | Principal del ítem |
| PAN-POR-98 | soc.mi.ver (+ por.portal.ver) | `/app/mi-grupo` | PWA socio | SM-PWS-038 | Principal del ítem |
| PAN-POR-99 | soc.mi.solicitar (+ por.portal.ver) | `/app/solicitudes-sociales` | PWA socio | SM-PWS-046 | Principal del ítem |

## 5. T01 PLA

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-PLA-01 | Dashboard global (GOB-001) | `/admin/plataforma/dashboard` | Plataforma | SM-PLT-001 | Principal del ítem |
| PAN-PLA-02 | Listado de tenants | `/admin/plataforma/tenants` | Plataforma | SM-PLT-002 | Principal del ítem |
| PAN-PLA-03 | Ficha del tenant | `/admin/plataforma/tenants/:id` | Plataforma | SM-PLT-002 | Asociada al ítem |
| PAN-PLA-04 | Alta asistida (§9.1) | `/admin/plataforma/tenants/alta` | Plataforma | SM-PLT-003 | Principal del ítem |
| PAN-PLA-05 | Catálogo de módulos vendibles | `/admin/plataforma/catalogo` | Plataforma | SM-PLT-006 | Principal del ítem |
| PAN-PLA-06 | Planes/packs | `/admin/plataforma/planes` | Plataforma | SM-PLT-004 | Principal del ítem |
| PAN-PLA-07 | Contratos SaaS | `/admin/plataforma/contratos` | Plataforma | SM-PLT-005 | Principal del ítem |
| PAN-PLA-08 | pla.soporte.accesos.ver (antes pla.accesos.ver) | `/admin/plataforma/soporte/accesos` | Plataforma | SM-PLT-010 | Asociada al ítem |
| PAN-PLA-09 | Salud de colas, jobs, outbox y bandeja técnica | `/admin/plataforma/operacion/jobs` | Plataforma | SM-PLT-012 | Principal del ítem |
| PAN-PLA-10 | Backups | `/admin/plataforma/operacion/backups` | Plataforma | SM-PLT-013 | Principal del ítem |
| PAN-PLA-11 | Restauraciones | `/admin/plataforma/operacion/restauraciones` | Plataforma | SM-PLT-013 | Asociada al ítem |
| PAN-PLA-12 | Alertas y reglas | `/admin/plataforma/alertas` | Plataforma | SM-PLT-011 | Asociada al ítem |
| PAN-PLA-13 | Incidentes de plataforma | `/admin/plataforma/incidentes` | Plataforma | SM-PLT-011 | Asociada al ítem |
| PAN-PLA-14 | plataforma y admin | `/admin/plataforma/sandboxes`, `/admin/pla/sandbox` | Plataforma | SM-PLT-014 | Principal del ítem |
| PAN-PLA-15 | Mi suscripción | `/admin/pla/suscripcion` | Admin de la cooperativa | SM-ADM-252 | Principal del ítem |
| PAN-PLA-16 | Habilitación de la cooperativa | `/admin/pla/habilitacion` | Admin de la cooperativa | SM-ADM-252 | Asociada al ítem |
| PAN-PLA-17 | Casos de soporte de plataforma | `/admin/pla/soporte` | Admin de la cooperativa | SM-ADM-251 | Principal del ítem |
| PAN-PLA-18 | pla.soporte.accesos.ver (antes pla.accesosSoporte.ver) | `/admin/pla/accesos-soporte` | Admin de la cooperativa | SM-ADM-251 | Asociada al ítem |
| PAN-PLA-19 | Lo nuevo y avisos | `/admin/pla/novedades` | Admin de la cooperativa | SM-ADM-393 | Principal del ítem |
| PAN-PLA-20 | Releases y feature flags | `/admin/plataforma/releases` | Plataforma | SM-PLT-015 | Principal del ítem |
| PAN-PLA-21 | Bandeja de soporte de plataforma | `/admin/plataforma/soporte/casos` | Plataforma | SM-PLT-010 | Principal del ítem |
| PAN-PLA-22 | Uso por tenant | `/admin/plataforma/uso` | Plataforma | SM-PLT-022 | Principal del ítem |
| PAN-PLA-23 | Exportación completa de datos | `/admin/pla/exportaciones` | Admin de la cooperativa | SM-ADM-253 | Principal del ítem |
| PAN-PLA-24 | landing (pública) | `/estado` | Landing | SM-LND-032 | Principal del ítem |
| PAN-PLA-25 | Inventario técnico | `/admin/plataforma/sistema` | Plataforma | SM-PLT-011 | Asociada al ítem |

## 6. T02 IAM

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-IAM-01 | pública | `/login` | Landing | SM-LND-007 | Misma ruta que el ítem |
| PAN-IAM-02 | pwa-socio, landing | `/login` | Landing | SM-LND-007 | Asociada al ítem |
| PAN-IAM-03 | transacción de login | `/login/mfa` | Landing | SM-LND-007 | Asociada al ítem |
| PAN-IAM-04 | sesión | `/select-scope` | Landing | SM-LND-007 | Asociada al ítem |
| PAN-IAM-05 | pública | `/forgot-password`, `/reset-password` | Landing | SM-LND-008 | Asociada al ítem |
| PAN-IAM-06 | pública con token | `/invite/:token`, `/verify-email/:token` | Landing | SM-LND-006 | Asociada al ítem |
| PAN-IAM-07 | Mi seguridad: cambiar contraseña; factores (alta, predeterminado, baja con... | `/perfil/seguridad` | PWA socio | SM-PWS-037 | Asociada al ítem |
| PAN-IAM-08 | overlay | — | Admin de la cooperativa | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-IAM-09 | DataTable de staff: nombre, alias, correo (enmascarado parcial), estado, roles... | `/admin/iam/usuarios` | Admin de la cooperativa | SM-ADM-218 | Principal del ítem |
| PAN-IAM-10 | Ficha: pestañas Datos (alias, legajo, área, contexto operativo por defecto... | `/admin/iam/usuarios/:id` | Admin de la cooperativa | SM-ADM-221 | Principal del ítem |
| PAN-IAM-11 | Lista de roles (plantilla/propio, usuarios asignados, capabilities S); editor... | `/admin/iam/roles`, `/admin/iam/roles/:id` | Admin de la cooperativa | SM-ADM-219 | Principal del ítem |
| PAN-IAM-12 | Editor de perfiles: apps habilitadas; árbol de pantallas por app (check en... | `/admin/iam/perfiles`, `/:id` | Admin de la cooperativa | SM-ADM-220 | Principal del ítem |
| PAN-IAM-13 | Pestañas: Reglas (pares, tipo, bloquear/advertir), Conflictos actuales... | `/admin/iam/sod` | Admin de la cooperativa | SM-ADM-379 | Principal del ítem |
| PAN-IAM-14 | Explicador/simulador: elegir usuario + pantalla/capability + (opcional)... | `/admin/iam/explicar` | Admin de la cooperativa | SM-ADM-380 | Principal del ítem |
| PAN-IAM-15 | Bandeja: pendientes que puedo decidir (acción, solicitante, importe, motivo... | `/admin/autorizaciones` | Admin de la cooperativa | SM-ADM-259 | Principal del ítem |
| PAN-IAM-16 | modal md | — | Admin de la cooperativa | SM-ADM-259 | Asociada al ítem |
| PAN-IAM-17 | DataTable: fecha, actor (tipo), módulo, objeto, operación, resultado, motivo... | `/admin/auditoria/cambios` | Admin de la cooperativa | SM-ADM-223 | Principal del ítem |
| PAN-IAM-18 | Eventos de acceso: fecha, usuario, evento, método, resultado, IP, dispositivo... | `/admin/auditoria/accesos` | Admin de la cooperativa | SM-ADM-222 | Principal del ítem |
| PAN-IAM-19 | Lecturas sensibles, informes vistos, exportaciones (filas, archivo, hash... | `/admin/auditoria/lecturas` | Admin de la cooperativa | SM-ADM-223 | Asociada al ítem |
| PAN-IAM-20 | Mensajes por canal, destinatario enmascarado, plantilla, objeto, estado... | `/admin/auditoria/mensajes` | Admin de la cooperativa | SM-ADM-223 | Asociada al ítem |
| PAN-IAM-21 | Invocaciones de IA: función, modelo, usuario, confianza, señales, decisión... | `/admin/auditoria/ia` | Admin de la cooperativa | SM-ADM-223 | Asociada al ítem |
| PAN-IAM-22 | Políticas del tenant: MFA por rol y para socios, métodos permitidos... | `/admin/iam/politicas` | Admin de la cooperativa | SM-ADM-381 | Principal del ítem |
| PAN-IAM-23 | Proveedores: alta OIDC (discovery URL, clientId, secreto a bóveda, scopes... | `/admin/iam/sso` | Admin de la cooperativa | SM-ADM-382 | Principal del ítem |
| PAN-IAM-24 | Clientes API: nombre, responsable, scopes, estado, último uso, consumo; crear... | `/admin/iam/api-clientes` | Admin de la cooperativa | SM-ADM-217 | Asociada al ítem |
| PAN-IAM-25 | Accesos al portal: persona, documento enmascarado, estado, nivel de... | `/admin/iam/portal-usuarios` | Admin de la cooperativa | SM-ADM-205 | Principal del ítem |
| PAN-IAM-26 | Usuarios y roles de plataforma; editor de roles y perfiles plantilla con... | `/platform/iam/usuarios`, `/platform/iam/roles-plantilla` | Plataforma | SM-PLT-016 | Principal del ítem |
| PAN-IAM-27 | plataforma + admin | `/platform/soporte/accesos`, `/admin/iam/soporte` | Plataforma | SM-PLT-010 | Asociada al ítem |
| PAN-IAM-28 | Auditoría de plataforma, alertas de seguridad (reconocer, resolver), integridad... | `/platform/seguridad` | Plataforma | SM-PLT-017 | Principal del ítem |
| PAN-IAM-29 | Sesiones activas del tenant: usuario, contexto, dispositivo, IP, inicio, último... | `/admin/iam/sesiones` | Admin de la cooperativa | SM-ADM-224 | Principal del ítem |
| PAN-IAM-30 | componente | — | Admin de la cooperativa | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-IAM-31 | modal xl | — | Admin de la cooperativa | SM-ADM-218 | Asociada al ítem |
| PAN-IAM-32 | Vinculación de cuenta del socio: DNI/CUIT, número de cuenta/suministro, prueba... | `/vincular-cuenta` | PWA socio | SM-PWS-004 | Asociada al ítem |

## 7. T03 UXD

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-UXD-01 | uxd.marca.ver (editar/publicar por acción) | `/configuracion/experiencia/marca` | Admin de la cooperativa | SM-ADM-234 | Principal del ítem |
| PAN-UXD-02 | Editar y publicar el diccionario | `/configuracion/experiencia/diccionario` | Admin de la cooperativa | SM-ADM-235 | Principal del ítem |
| PAN-UXD-03 | Historial de releases | `/configuracion/experiencia/diccionario/publicaciones` | Admin de la cooperativa | SM-ADM-236 | Principal del ítem |
| PAN-UXD-04 | modal global | — | Admin de la cooperativa | SM-ADM-239 | Asociada al ítem |
| PAN-UXD-05 | Navegación de la PWA por rol y accesos sugeridos del admin por rol | `/configuracion/experiencia/navegacion` | Admin de la cooperativa | SM-ADM-237 | Principal del ítem |
| PAN-UXD-06 | Sobrescribir ayudas contextuales | `/configuracion/experiencia/ayudas` | Admin de la cooperativa | SM-ADM-238 | Principal del ítem |
| PAN-UXD-07 | Flags de UI del tenant | `/configuracion/experiencia/flags` | Admin de la cooperativa | SM-ADM-239 | Principal del ítem |
| PAN-UXD-08 | PWA socio y admin (menú avatar; antes "admin y PWA") | `/app/perfil/apariencia`, `/perfil/preferencias` | PWA socio | SM-PWS-036 | Asociada al ítem |
| PAN-UXD-09 | uxd.plataforma.diccionarioBase.ver (antes plt.uxd.diccionarioBase.ver) | `/plataforma/experiencia/diccionario-base` | Plataforma | SM-PLT-018 | Principal del ítem |
| PAN-UXD-10 | uxd.plataforma.tokens.ver (antes plt.uxd.tokens.ver) | `/plataforma/experiencia/design-system` | Plataforma | SM-PLT-019 | Principal del ítem |
| PAN-UXD-11 | uxd.plataforma.flags.configurar (antes plt.uxd.flags.configurar) | `/plataforma/experiencia/flags` | Plataforma | SM-PLT-020 | Principal del ítem |
| PAN-UXD-12 | todas | `/sin-acceso` | Landing | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-UXD-13 | todas | `/login` | Landing | SM-LND-007 | Misma ruta que el ítem |
| PAN-UXD-14 | landing (y PWA instalada; antes "PWA") | `/instalar` | Landing | SM-LND-019 | Principal del ítem |
| PAN-UXD-15 | PWA socio y empleado | `/app/asistente` | PWA socio | SM-PWS-041 | Principal del ítem |
| PAN-UXD-16 | PWA empleado | `/app/empleado/directorio` | PWA empleado | SM-PWE-015 | Principal del ítem |
| PAN-UXD-17 | Alertas activas (ítem SM-ADM-003). RF-UXD-055 (centro de alertas); ola O0... | `/admin/inicio/alertas` | Admin de la cooperativa | SM-ADM-003 | Principal del ítem |

## 8. T04 CFG

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-CFG-01 | Centro de configuración: estado general del tenant. | `/admin/cfg` | Admin de la cooperativa | SM-ADM-225 | Principal del ítem |
| PAN-CFG-02 | admin /admin/cfg/parametros | `/admin/cfg/parametros` | Admin de la cooperativa | SM-ADM-228 | Principal del ítem |
| PAN-CFG-03 | admin /admin/cfg/parametros/:key | `/admin/cfg/parametros/:key` | Admin de la cooperativa | SM-ADM-228 | Asociada al ítem |
| PAN-CFG-04 | admin /admin/cfg/versiones | `/admin/cfg/versiones` | Admin de la cooperativa | SM-ADM-233 | Principal del ítem |
| PAN-CFG-05 | admin /admin/cfg/versiones/:id | `/admin/cfg/versiones/:id` | Admin de la cooperativa | SM-ADM-233 | Asociada al ítem |
| PAN-CFG-06 | admin /admin/cfg/historia | `/admin/cfg/historia` | Admin de la cooperativa | SM-ADM-233 | Asociada al ítem |
| PAN-CFG-07 | admin /admin/cfg/tablas | `/admin/cfg/tablas` | Admin de la cooperativa | SM-ADM-227 | Principal del ítem |
| PAN-CFG-08 | admin /admin/cfg/tablas/:code | `/admin/cfg/tablas/:code` | Admin de la cooperativa | SM-ADM-227 | Asociada al ítem |
| PAN-CFG-09 | admin /admin/cfg/importaciones | `/admin/cfg/importaciones` | Admin de la cooperativa | SM-ADM-227 | Asociada al ítem |
| PAN-CFG-10 | admin /admin/cfg/padrones | `/admin/cfg/padrones` | Admin de la cooperativa | SM-ADM-055 | Asociada al ítem |
| PAN-CFG-11 | admin /admin/cfg/geografia | `/admin/cfg/geografia` | Admin de la cooperativa | SM-ADM-230 | Principal del ítem |
| PAN-CFG-12 | admin /admin/cfg/calles | `/admin/cfg/calles` | Admin de la cooperativa | SM-ADM-230 | Asociada al ítem |
| PAN-CFG-13 | admin /admin/cfg/territorio | `/admin/cfg/territorio` | Admin de la cooperativa | SM-ADM-230 | Asociada al ítem |
| PAN-CFG-14 | componente admin/pwa GeoAddressPicker + pantalla /admin/cfg/mapa | `/admin/cfg/mapa` | Admin de la cooperativa | SM-ADM-230 | Asociada al ítem |
| PAN-CFG-15 | admin /admin/cfg/georreferencias/revision | `/admin/cfg/georreferencias/revision` | Admin de la cooperativa | SM-ADM-230 | Asociada al ítem |
| PAN-CFG-16 | admin /admin/cfg/calendarios | `/admin/cfg/calendarios` | Admin de la cooperativa | SM-ADM-231 | Principal del ítem |
| PAN-CFG-17 | admin /admin/cfg/indices | `/admin/cfg/indices`, `/` | Admin de la cooperativa | SM-ADM-232 | Principal del ítem |
| PAN-CFG-18 | admin /admin/cfg/monedas | `/admin/cfg/monedas` | Admin de la cooperativa | SM-ADM-383 | Principal del ítem |
| PAN-CFG-19 | admin /admin/cfg/fiscal | `/admin/cfg/fiscal` | Admin de la cooperativa | SM-ADM-055 | Asociada al ítem |
| PAN-CFG-20 | admin /admin/cfg/enumeraciones | `/admin/cfg/enumeraciones` | Admin de la cooperativa | SM-ADM-384 | Principal del ítem |
| PAN-CFG-21 | admin /admin/cfg/campos-extra | `/admin/cfg/campos-extra` | Admin de la cooperativa | SM-ADM-385 | Principal del ítem |
| PAN-CFG-22 | admin /admin/cfg/formularios | `/admin/cfg/formularios` | Admin de la cooperativa | SM-ADM-386 | Principal del ítem |
| PAN-CFG-23 | admin (panel en cada DataTable) + /admin/cfg/vistas | `/admin/cfg/vistas` | Admin de la cooperativa | SM-ADM-387 | Principal del ítem |
| PAN-CFG-24 | plataforma /platform/cfg/semillas y admin demo /admin/cfg/semillas | `/platform/cfg/semillas`, `/admin/cfg/semillas` | Plataforma | SM-PLT-007 | Asociada al ítem |
| PAN-CFG-25 | plataforma /platform/cfg/registro | `/platform/cfg/registro` | Plataforma | SM-PLT-008 | Asociada al ítem |
| PAN-CFG-26 | plataforma /platform/cfg/tablas | `/platform/cfg/tablas` | Plataforma | SM-PLT-008 | Principal del ítem |
| PAN-CFG-27 | plataforma /platform/cfg/equivalencias | `/platform/cfg/equivalencias` | Plataforma | SM-PLT-008 | Asociada al ítem |
| PAN-CFG-28 | admin /admin/cfg/tecnica | `/admin/cfg/tecnica` | Admin de la cooperativa | SM-ADM-229 | Principal del ítem |
| PAN-CFG-29 | admin /admin/cfg/perfiles-servicio | `/admin/cfg/perfiles-servicio` | Admin de la cooperativa | SM-ADM-228 | Asociada al ítem |
| PAN-CFG-30 | admin, modal sin ruta propia: se abre desde el contador "en uso por" de... | `/admin/cfg/tablas/:code` | Admin de la cooperativa | SM-ADM-227 | Asociada al ítem |
| PAN-CFG-31 | pwa-socio y landing, componente sin ruta propia que se monta en las rutas de... | `/app/tramites/nuevo/:formCode`, `/app/contratar` | PWA socio | SM-PWS-005 | Misma ruta que el ítem |
| PAN-CFG-32 | pwa-campo, componente sin ruta propia: botón "Confirmar ubicación" de la ficha... | `/app/campo/work-orders/:id` | Admin de la cooperativa | SM-ADM-230 | Asociada al ítem |
| PAN-CFG-33 | admin /admin/cfg/entidades-juridicas | `/admin/cfg/entidades-juridicas` | Admin de la cooperativa | SM-ADM-395 | Principal del ítem |
| PAN-CFG-34 | admin /admin/cfg/sucursales | `/admin/cfg/sucursales` | Admin de la cooperativa | SM-ADM-226 | Principal del ítem |
| PAN-CFG-35 | admin /admin/cfg/puestos | `/admin/cfg/puestos` | Admin de la cooperativa | SM-ADM-396 | Principal del ítem |

## 9. T06 INT

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-INT-01 | Catálogo de proveedores y versiones de adaptadores | `/admin/plataforma/integraciones/proveedores` | Plataforma | SM-PLT-009 | Principal del ítem |
| PAN-INT-02 | Ver integraciones disponibles para la licencia del tenant y su ficha | `/admin/integraciones/catalogo` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-03 | Alta y gestión de conexiones | `/admin/integraciones/conexiones`, `/:id` | Admin de la cooperativa | SM-ADM-245 | Principal del ítem |
| PAN-INT-04 | Tablero del tenant | `/admin/integraciones/tablero` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-05 | int.monitoreo.ver (plataforma) | `/admin/plataforma/integraciones/tablero` | Plataforma | SM-PLT-009 | Asociada al ítem |
| PAN-INT-06 | Vista consolidada de la bóveda | `/admin/integraciones/credenciales` | Admin de la cooperativa | SM-ADM-246 | Principal del ítem |
| PAN-INT-07 | Certificados y asistente ARCA | `/admin/integraciones/certificados` | Admin de la cooperativa | SM-ADM-246 | Asociada al ítem |
| PAN-INT-08 | Seguimiento de operaciones | `/admin/integraciones/operaciones`, `/:id` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-09 | Bandeja de operaciones detenidas | `/admin/integraciones/bandeja` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-10 | int.bitacora.ver (+ int.bitacora.verPayload) | `/admin/integraciones/bitacora` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-11 | Bandeja de webhooks | `/admin/integraciones/webhooks` | Admin de la cooperativa | SM-ADM-247 | Principal del ítem |
| PAN-INT-12 | Intercambio de archivos | `/admin/integraciones/archivos` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-13 | int.proveedores.configurar (plataforma) / int.archivos.ver (tenant) | `/admin/integraciones/layouts`, `/` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-14 | Conciliaciones por conector | `/admin/integraciones/conciliaciones` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-15 | Alertas | `/admin/integraciones/alertas` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-16 | Contingencias | `/admin/integraciones/contingencias` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-17 | Agentes locales | `/admin/integraciones/agentes` | Admin de la cooperativa | SM-ADM-248 | Principal del ítem |
| PAN-INT-18 | Consumo y cuotas | `/admin/integraciones/consumo` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-19 | Búsqueda de identificadores externos | `/admin/integraciones/identificadores` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |
| PAN-INT-20 | Uso de IA | `/admin/integraciones/ia` | Admin de la cooperativa | SM-ADM-245 | Asociada al ítem |

## 10. T07 MIG

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-MIG-01 | Listado de proyectos por cooperativa | `/platform/migrations` | Plataforma | SM-PLT-021 | Principal del ítem |
| PAN-MIG-02 | Tablero del proyecto | `/platform/migrations/:id` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-03 | Fuentes y accesos | `/platform/migrations/:id/sources` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-04 | Inventario de 659 tablas | `/platform/migrations/:id/inventory` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-05 | Snapshots | `/platform/migrations/:id/snapshots` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-06 | Perfilado de calidad | `/admin/migration/profiling` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-07 | Conjuntos y reglas de mapeo | `/platform/migrations/mapping-sets` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-08 | Mapas de valores | `/admin/migration/value-maps` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-09 | Corridas | `/platform/migrations/:id/runs` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-10 | Rechazos y advertencias | `/admin/migration/issues` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-11 | Saneamiento de personas y duplicados | `/admin/migration/quality/persons` | Admin de la cooperativa | SM-ADM-014 | Asociada al ítem |
| PAN-MIG-12 | Normalización de domicilios y calles | `/admin/migration/quality/addresses`, `/` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-13 | Conciliaciones por dominio | `/admin/migration/reconciliations` | Admin de la cooperativa | SM-ADM-249 | Principal del ítem |
| PAN-MIG-14 | Tablero de corrida paralela | `/admin/migration/parallel` | Admin de la cooperativa | SM-ADM-250 | Principal del ítem |
| PAN-MIG-15 | Comparación de una factura | `/admin/migration/parallel/:runId/compare/:id` | Admin de la cooperativa | SM-ADM-250 | Asociada al ítem |
| PAN-MIG-16 | Convivencia y by-pass | `/admin/migration/coexistence` | Admin de la cooperativa | SM-ADM-250 | Asociada al ítem |
| PAN-MIG-17 | Plan de corte | `/admin/migration/cutover` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-18 | Rollback | `/admin/migration/rollback` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-19 | Alias de claves heredadas | `/admin/migration/key-aliases` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |
| PAN-MIG-20 | pestaña "Histórico ProCoop" en fichas de persona, cuenta, contrato, proveedor... | — | Admin de la cooperativa | — | Sin ítem propio: modal, pestaña o componente (T03 AL-07) |
| PAN-MIG-21 | Sesión del socio; solo sus cuentas (relación autorizada de M01) (antes "portal") | `/app/history` | PWA socio | SM-PWS-045 | Principal del ítem |
| PAN-MIG-22 | Perfiles de anonimización | `/platform/migrations/anonymization` | Plataforma | SM-PLT-021 | Asociada al ítem |
| PAN-MIG-23 | Acta de aceptación | `/admin/migration/acceptance` | Admin de la cooperativa | SM-ADM-249 | Asociada al ítem |

## 11. T08 NFR

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-NFR-01 | Registro de tratamientos: DataTable (código, finalidad, base legal, categorías... | `/admin/privacidad/tratamientos` | Admin de la cooperativa | SM-ADM-389 | Principal del ítem |
| PAN-NFR-02 | Inventario de datos por módulo/colección/campo con filtros por sensibilidad y... | `/admin/privacidad/inventario` | Admin de la cooperativa | SM-ADM-389 | Asociada al ítem |
| PAN-NFR-03 | Avisos por canal y versión, vista previa "celular", publicar (ConfirmDialog)... | `/admin/privacidad/avisos` | Admin de la cooperativa | SM-ADM-389 | Asociada al ítem |
| PAN-NFR-04 | Consulta por persona o finalidad, historial, evidencia, exportación auditada. | `/admin/privacidad/consentimientos` | Admin de la cooperativa | SM-ADM-390 | Principal del ítem |
| PAN-NFR-05 | Bandeja con semáforo de plazo, filtros por tipo/estado/canal, ficha con... | `/admin/privacidad/solicitudes` | Admin de la cooperativa | SM-ADM-391 | Principal del ítem |
| PAN-NFR-06 | Políticas (tabla 10.3) con mínimos/máximos de plataforma, vista previa de... | `/admin/privacidad/conservacion` | Admin de la cooperativa | SM-ADM-389 | Asociada al ítem |
| PAN-NFR-07 | Tablero de salud del tenant (RF-NFR-017): procesos, emisión fiscal, cobranzas... | `/admin/salud` | Admin de la cooperativa | SM-ADM-392 | Principal del ítem |
| PAN-NFR-08 | Incidentes de plataforma que afectan al tenant con su cronología y... | `/admin/salud/incidentes` | Admin de la cooperativa | SM-ADM-392 | Asociada al ítem |
| PAN-NFR-09 | pwa-socio / pwa-empleado | `/app/mis-datos` | PWA socio | SM-PWS-033 | Asociada al ítem |
| PAN-NFR-10 | pública | `/<tenantSlug>/privacidad` | Landing | SM-LND-018 | Asociada al ítem |
| PAN-NFR-11 | Tablero de salud global (RF-NFR-016, RNF-NFR-135). | `/admin/plataforma/salud` | Plataforma | SM-PLT-011 | Principal del ítem |
| PAN-NFR-12 | Gestión de incidentes, notificación por tenant, post-mortem. | `/admin/plataforma/incidentes` | Plataforma | SM-PLT-011 | Asociada al ítem |
| PAN-NFR-13 | Inventario de backups, simulacros (plan, ejecución, mediciones, actas)... | `/admin/plataforma/continuidad` | Plataforma | SM-PLT-013 | Asociada al ítem |
| PAN-NFR-14 | Claves (metadatos), próxima rotación, rotación con doble aprobación. | `/admin/plataforma/claves` | Plataforma | SM-PLT-017 | Asociada al ítem |
| PAN-NFR-15 | Reglas de alerta y SLO, eventos activos, reconocimiento y silenciamiento. | `/admin/plataforma/alertas` | Plataforma | SM-PLT-011 | Asociada al ítem |
| PAN-NFR-16 | Evidencias por versión, matriz ASVS, vulnerabilidades abiertas, aprobación de... | `/admin/plataforma/evidencias` | Plataforma | SM-PLT-017 | Asociada al ítem |
| PAN-NFR-17 | Registro de subencargados y avisos a tenants. | `/admin/plataforma/subencargados` | Plataforma | SM-PLT-017 | Asociada al ítem |
| PAN-NFR-18 | landing (plataforma) | `/estado` | Landing | SM-LND-032 | Asociada al ítem |

## 12. T09 COM

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-COM-01 | DataTable de publicaciones: título, tipo, canales (chips), estado, autor... | `/admin/com/publicaciones` | Admin de la cooperativa | SM-ADM-192 | Principal del ítem |
| PAN-COM-02 | Editor: título, cuerpo enriquecido, tipo, categoría, sección, medios (portada... | `/admin/com/publicaciones/:id` | Admin de la cooperativa | SM-ADM-192 | Asociada al ítem |
| PAN-COM-03 | Pestañas: Categorías (árbol con orden, color, ícono), Plantillas de... | `/admin/com/categorias` | Admin de la cooperativa | SM-ADM-193 | Principal del ítem |
| PAN-COM-04 | Cola única: tarjetas/tabla con extracto, publicación, autor (con historial de... | `/admin/com/moderacion` | Admin de la cooperativa | SM-ADM-194 | Principal del ítem |
| PAN-COM-05 | Pestañas: Política (habilitación de comentarios, modo por defecto, IA on/off y... | `/admin/com/moderacion/configuracion` | Admin de la cooperativa | SM-ADM-194 | Asociada al ítem |
| PAN-COM-06 | DataTable de sanciones: usuario, tipo, motivo, vigencia, estado, apelación... | `/admin/com/sanciones` | Admin de la cooperativa | SM-ADM-194 | Asociada al ítem |
| PAN-COM-07 | Tablero (§15): volumen, primera decisión, % ocultos, coincidencia IA vs humano... | `/admin/com/moderacion/tablero` | Admin de la cooperativa | SM-ADM-194 | Asociada al ítem |
| PAN-COM-08 | Listado con estado, regla, asunto, variantes, destinatarios, métricas. Detalle... | `/admin/com/boletines` | Admin de la cooperativa | SM-ADM-195 | Principal del ítem |
| PAN-COM-09 | ABM de reglas (cadencia, formato, selección, audiencia, revisión) con preview... | `/admin/com/boletines/reglas` | Admin de la cooperativa | SM-ADM-195 | Asociada al ítem |
| PAN-COM-10 | DataTable: nombre, tipo (survey/poll/consultation), finalidad, estado... | `/admin/com/encuestas`, `/` | Admin de la cooperativa | SM-ADM-201 | Principal del ítem |
| PAN-COM-11 | Constructor: panel de preguntas (31 tipos con QuestionTypePicker), páginas... | `/admin/com/encuestas/:id/editar` | Admin de la cooperativa | SM-ADM-201 | Asociada al ítem |
| PAN-COM-12 | Resultados por pregunta y grupo, participación, cruce de dos preguntas... | `/admin/com/encuestas/:id/resultados` | Admin de la cooperativa | SM-ADM-202 | Principal del ítem |
| PAN-COM-13 | Plantillas del tenant y heredadas de plataforma (post-instalación... | `/admin/com/encuestas/plantillas` | Admin de la cooperativa | SM-ADM-201 | Asociada al ítem |
| PAN-COM-14 | DataTable de eventos e inscripciones; detalle con lista de inscriptos, espera... | `/admin/com/eventos` | Admin de la cooperativa | SM-ADM-362 | Principal del ítem |
| PAN-COM-15 | Beneficios (estado, vigencia, cupo, canjes) y comercios adheridos; detalle con... | `/admin/com/beneficios` | Admin de la cooperativa | SM-ADM-363 | Principal del ítem |
| PAN-COM-16 | Validación de canje: lector QR o ingreso de código; muestra beneficio, persona... | `/admin/com/beneficios/validar`, `/v/:token` | Admin de la cooperativa | — | Con ruta y sin ítem en el mapa |
| PAN-COM-17 | Segmentos guardados (dueño, visibilidad, evaluación, último conteo) y listas... | `/admin/com/segmentos`, `/` | Admin de la cooperativa | SM-ADM-203 | Principal del ítem |
| PAN-COM-18 | Catálogo de tipos de comunicación (§9.6): código, módulo, disparador... | `/admin/com/catalogo` | Admin de la cooperativa | SM-ADM-196 | Asociada al ítem |
| PAN-COM-19 | Listado por tipo × canal × idioma con versión vigente. Editor por canal: email... | `/admin/com/plantillas`, `/:id` | Admin de la cooperativa | SM-ADM-197 | Principal del ítem |
| PAN-COM-20 | Registro de variables: ruta, etiqueta, tipo, formato, módulo, ejemplo, política... | `/admin/com/variables` | Admin de la cooperativa | SM-ADM-197 | Asociada al ítem |
| PAN-COM-21 | DataTable: nombre, finalidad, canales, estado, programación, audiencia... | `/admin/com/campanas` | Admin de la cooperativa | SM-ADM-198 | Principal del ítem |
| PAN-COM-22 | Composer por pasos: 1) finalidad y nombre, 2) audiencia + vista previa de... | `/admin/com/campanas/:id` | Admin de la cooperativa | SM-ADM-198 | Asociada al ítem |
| PAN-COM-23 | Mensajes impresos en factura: texto, área, prioridad, audiencia, servicios... | `/admin/com/mensajes-factura` | Admin de la cooperativa | SM-ADM-196 | Asociada al ítem |
| PAN-COM-24 | Historial de comunicaciones: fecha, tipo, canal, destinatario (enmascarado... | `/admin/com/historial` | Admin de la cooperativa | SM-ADM-196 | Principal del ítem |
| PAN-COM-25 | Por persona: matriz finalidad × canal, canal preferido, no molestar, adhesión a... | `/admin/com/preferencias` | Admin de la cooperativa | SM-ADM-366 | Principal del ítem |
| PAN-COM-26 | Por canal: habilitado, conector T06 y proveedor (email SES/SMTP; SMS API — sin... | `/admin/com/canales` | Admin de la cooperativa | SM-ADM-365 | Principal del ítem |
| PAN-COM-27 | Avisos de interrupción: tipo, servicios, área (mapa), ventana, estado... | `/admin/com/avisos-corte` | Admin de la cooperativa | SM-ADM-364 | Principal del ítem |
| PAN-COM-28 | Consumo de mensajería: por período, canal, finalidad, módulo y tipo; costo... | `/admin/com/consumo` | Admin de la cooperativa | SM-ADM-199 | Asociada al ítem |
| PAN-COM-29 | Reglas de notificación a responsables: tipo, filtros (servicio, tipo de orden... | `/admin/com/notificaciones-internas` | Admin de la cooperativa | SM-ADM-196 | Asociada al ítem |
| PAN-COM-30 | Envío individual: destinatario (contactos verificados del objeto), canal... | `/admin/com/envio-manual` | Admin de la cooperativa | SM-ADM-196 | Asociada al ítem |
| PAN-COM-31 | Exportación de audiencia: modelos IVR (IVR Logística, TeleAnnouncer Lite, texto... | `/admin/com/exportaciones` | Admin de la cooperativa | SM-ADM-198 | Asociada al ítem |
| PAN-COM-32 | Campana del AdminShell (panel lateral) + /admin/avisos | `/admin/avisos` | Admin de la cooperativa | SM-ADM-004 | Principal del ítem |
| PAN-COM-33 | Avisos de plataforma a tenants: tipo, destino (todos/plan/lista), roles... | `/admin/plataforma/avisos`, `/admin/platform/avisos` | Plataforma | SM-PLT-023 | Principal del ítem |
| PAN-COM-34 | Consumo global por tenant, canal y proveedor; salud de conectores de... | `/admin/plataforma/mensajeria`, `/admin/platform/mensajeria` | Plataforma | SM-PLT-024 | Principal del ítem |
| PAN-COM-40 | pwa-socio / pwa-empleado | `/app/muro`, `/app/empleado/muro` | PWA socio | SM-PWS-026 | Asociada al ítem |
| PAN-COM-41 | Detalle con comentarios (1 nivel), respuesta institucional destacada... | `/app/muro/:id` | PWA socio | SM-PWS-027 | Asociada al ítem |
| PAN-COM-42 | Bandeja Todas / No leídas / Leídas / Enviados (supervisor) con notifKinds... | `/app/avisos`, `/app/empleado/avisos` | PWA socio | SM-PWS-031 | Asociada al ítem |
| PAN-COM-43 | Pendientes / Iniciadas / Finalizadas; respuesta con un campo por tipo... | `/app/encuestas(/:id)` | PWA empleado | SM-PWE-011 | Principal del ítem |
| PAN-COM-44 | Boletines recibidos; detalle tipo revista con “Abrir en el muro”. | `/app/novedades(/:id)` | PWA empleado | SM-PWE-012 | Principal del ítem |
| PAN-COM-45 | Agenda: eventos de la cooperativa + citas del socio (visitas M10, turnos M09). | `/app/agenda` | PWA socio | SM-PWS-043 | Principal del ítem |
| PAN-COM-46 | Beneficios elegibles con condiciones, vigencia, cupo; “Mis códigos”. | `/app/beneficios(/:id)` | PWA socio | SM-PWS-044 | Principal del ítem |
| PAN-COM-47 | Matriz finalidad × canal (las no desactivables explicadas y bloqueadas), canal... | `/app/perfil/comunicaciones` | PWA socio | SM-PWS-035 | Asociada al ítem |
| PAN-COM-48 | pwa / landing | `/app/avisos-de-corte`, `/avisos-de-corte` | PWA socio | SM-PWS-025 | Asociada al ítem |
| PAN-COM-49 | Pública (token) | `/e/:token` | Landing | SM-LND-016 | Principal del ítem |
| PAN-COM-50 | Pública (token) | `/comunicaciones/:token` | Landing | SM-LND-025 | Principal del ítem |
| PAN-COM-51 | Reglas de comunidad vigentes; estado de mis sanciones; apelar. | `/app/comunidad/reglas` | PWA socio | SM-PWS-026 | Asociada al ítem |
| PAN-COM-52 | FAB en /app/empleado/muro y /app/empleado/avisos | `/app/empleado/muro`, `/app/empleado/avisos` | PWA empleado | SM-PWE-009 | Principal del ítem |
| PAN-COM-53 | Pública | `/noticias(/:slug)` | Landing | SM-LND-004 | Asociada al ítem |

## 13. T10 BIA

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-BIA-01 | Catálogo de reportes | `/admin/reportes`, `/admin/<modulo>/reportes` | Admin de la cooperativa | SM-ADM-211 | Principal del ítem |
| PAN-BIA-02 | Ejecución de reporte | `/admin/reportes/:code` | Admin de la cooperativa | SM-ADM-211 | Asociada al ítem |
| PAN-BIA-03 | Mis corridas | `/admin/reportes/corridas` | Admin de la cooperativa | SM-ADM-211 | Asociada al ítem |
| PAN-BIA-04 | Mis exportaciones | `/admin/reportes/exportaciones`, `/` | Admin de la cooperativa | SM-ADM-216 | Principal del ítem |
| PAN-BIA-05 | Programaciones | `/admin/reportes/programaciones` | Admin de la cooperativa | SM-ADM-215 | Principal del ítem |
| PAN-BIA-06 | Presets y vistas guardadas | `/admin/reportes/presets` | Admin de la cooperativa | SM-ADM-211 | Asociada al ítem |
| PAN-BIA-07 | Configuración del catálogo del tenant | `/admin/reportes/configuracion`, `/` | Admin de la cooperativa | SM-ADM-373 | Principal del ítem |
| PAN-BIA-08 | Layouts de archivo | `/admin/reportes/layouts` | Admin de la cooperativa | SM-ADM-213 | Asociada al ítem |
| PAN-BIA-09 | Generador de reportes del tenant | `/admin/reportes/disenador` | Admin de la cooperativa | SM-ADM-213 | Principal del ítem |
| PAN-BIA-10 | Tablero por rol | `/admin/tableros/:code` | Admin de la cooperativa | SM-ADM-001 | Principal del ítem |
| PAN-BIA-11 | Diseñador de tableros | `/admin/tableros/disenar`, `/` | Admin de la cooperativa | SM-ADM-374 | Principal del ítem |
| PAN-BIA-12 | Sala BI | `/admin/bi/:room` | Admin de la cooperativa | SM-ADM-212 | Principal del ítem |
| PAN-BIA-13 | Catálogo de indicadores | `/admin/indicadores`, `/` | Admin de la cooperativa | SM-ADM-375 | Principal del ítem |
| PAN-BIA-14 | Alertas de indicadores | `/admin/indicadores/alertas` | Admin de la cooperativa | SM-ADM-003 | Asociada al ítem |
| PAN-BIA-15 | Clientes de API | `/admin/api/clientes` | Admin de la cooperativa | SM-ADM-217 | Principal del ítem |
| PAN-BIA-16 | Uso y cuotas de API | `/admin/api/uso` | Admin de la cooperativa | SM-ADM-217 | Asociada al ítem |
| PAN-BIA-17 | Webhooks salientes y entregas | `/admin/api/webhooks` | Admin de la cooperativa | SM-ADM-217 | Asociada al ítem |
| PAN-BIA-18 | Datasets semánticos | `/admin/bi/datasets`, `/api/v1/ext/datasets/:code/rows` | Admin de la cooperativa | SM-ADM-212 | Asociada al ítem |
| PAN-BIA-19 | Auditoría de accesos a reportes | `/admin/reportes/auditoria`, `/` | Admin de la cooperativa | SM-ADM-376 | Principal del ítem |
| PAN-BIA-20 | Benchmark entre cooperativas | `/admin/bi/benchmark` | Admin de la cooperativa | SM-ADM-377 | Principal del ítem |
| PAN-BIA-21 | Datos abiertos | `/admin/bi/datos-abiertos` | Admin de la cooperativa | SM-ADM-378 | Principal del ítem |
| PAN-BIA-22 | Catálogo regulatorio | `/admin/reportes/regulatorios` | Admin de la cooperativa | SM-ADM-211 | Asociada al ítem |
| PAN-BIA-23 | Monitoreo de BI y API (plataforma) | `/admin/platform/bia` | Plataforma | SM-PLT-025 | Principal del ítem |
| PAN-BIA-24 | Portal para desarrolladores | `/developers`, `/developers/:tenantSlug` | Landing | SM-LND-033 | Principal del ítem |
| PAN-BIA-25 | Tablero móvil (PWA empleado) | `/app/tablero` | PWA empleado | SM-PWE-008 | Principal del ítem |

## 14. T11 WFL

| PAN | Título | Ruta declarada en el anexo | Portal | Ítem del mapa | Relación |
|---|---|---|---|---|---|
| PAN-WFL-01 | Bandeja unificada. Zona de filtros (tipo, módulo, prioridad, área, sujeto).... | `/inicio/bandeja`, `/aprobaciones` | Admin de la cooperativa | SM-ADM-002 | Principal del ítem |
| PAN-WFL-02 | Supervisión: carga por persona, vencidos por área, gráfico de antigüedad... | `/inicio/bandeja/equipo` | Admin de la cooperativa | SM-ADM-255 | Principal del ítem |
| PAN-WFL-03 | Detalle de tarea: datos, sujeto vinculado, checklist, formulario, adjuntos... | `/inicio/tareas/:id` | Admin de la cooperativa | SM-ADM-002 | Asociada al ítem |
| PAN-WFL-04 | Agenda unificada con vistas día, semana, mes y lista; capas por fuente con... | `/inicio/agenda`, `/agenda` | Admin de la cooperativa | SM-ADM-256 | Principal del ítem |
| PAN-WFL-05 | Catálogo de máquinas de estado por módulo, con diagrama de solo lectura... | `/configuracion/estados` | Admin de la cooperativa | SM-ADM-241 | Asociada al ítem |
| PAN-WFL-06 | Lista de definiciones (código, módulo, canal, versión vigente, borrador... | `/configuracion/workflows` | Admin de la cooperativa | SM-ADM-241 | Principal del ítem |
| PAN-WFL-07 | Diseñador de formularios: paleta de tipos de campo, propiedades (validaciones... | `/configuracion/formularios` | Admin de la cooperativa | SM-ADM-206 | Asociada al ítem |
| PAN-WFL-08 | wfl.tareas.ver (+ capability del dominio) | `/tramites/instancias` | Admin de la cooperativa | SM-ADM-306 | Principal del ítem |
| PAN-WFL-09 | Políticas de aprobación: lista y editor de reglas (tramos de importe, atributos... | `/configuracion/aprobaciones` | Admin de la cooperativa | SM-ADM-240 | Asociada al ítem |
| PAN-WFL-10 | Detalle de aprobación: resumen funcional, comparación antes/después cuando... | `/inicio/aprobaciones/:id` | PWA empleado | SM-PWE-004 | Asociada al ítem |
| PAN-WFL-11 | Mis delegaciones (dadas y recibidas); nueva delegación (modal md: delegado... | `/inicio/delegaciones` | Admin de la cooperativa | SM-ADM-257 | Principal del ítem |
| PAN-WFL-12 | Tipos de operación del tenant: política asignada, plazos, evidencia, MFA. | `/configuracion/operaciones` | Admin de la cooperativa | SM-ADM-240 | Principal del ítem |
| PAN-WFL-13 | Operaciones: número, tipo, sujeto, importe, solicitante, estado (Pendiente... | `/operaciones` | Admin de la cooperativa | SM-ADM-388 | Principal del ítem |
| PAN-WFL-14 | Expediente por sujeto: cabecera del sujeto, pestañas Documentos (por tipo, con... | `/expedientes/:subjectType/:id` | Admin de la cooperativa | SM-ADM-243 | Asociada al ítem |
| PAN-WFL-15 | Expedientes formales: número, tipo, carátula, estado, responsable, folios.... | `/expedientes/formales` | Admin de la cooperativa | SM-ADM-243 | Principal del ítem |
| PAN-WFL-16 | Tipos documentales: sensibilidad, retención, extensiones, visibilidad para el... | `/configuracion/documentos/tipos` | Admin de la cooperativa | SM-ADM-242 | Asociada al ítem |
| PAN-WFL-17 | Plantillas: código, tipo documental, módulo, versión vigente, borrador... | `/configuracion/plantillas` | Admin de la cooperativa | SM-ADM-242 | Principal del ítem |
| PAN-WFL-18 | Secuencias: código, alcance, máscara, próximo, política de huecos, umbral.... | `/configuracion/numeracion` | Admin de la cooperativa | SM-ADM-242 | Asociada al ítem |
| PAN-WFL-19 | Perfiles de firma (nivel, proveedor T06, OTP, evidencias, texto legal... | `/configuracion/firmas` | Admin de la cooperativa | SM-ADM-242 | Asociada al ítem |
| PAN-WFL-20 | Catálogo de eventos del tenant: tipo, productor, consumidores activos, versión... | `/configuracion/eventos` | Admin de la cooperativa | SM-ADM-241 | Asociada al ítem |
| PAN-WFL-21 | Jobs del tenant: pestañas Programaciones (cron en hora local, ventana, próxima... | `/configuracion/procesos` | Admin de la cooperativa | SM-ADM-244 | Principal del ítem |
| PAN-WFL-22 | Bandeja operativa: ítems con título funcional, severidad, responsable, sujeto y... | `/inicio/bandeja-operativa` | Admin de la cooperativa | SM-ADM-258 | Principal del ítem |
| PAN-WFL-23 | Bandeja en tarjetas con grupos por vencimiento, FAB "+" (nueva tarea)... | `/bandeja`, `/aprobaciones` | PWA empleado | SM-PWE-002 | Principal del ítem |
| PAN-WFL-24 | Agenda del día y de la semana en tarjetas. | `/agenda`, `/agenda` | PWA empleado | SM-PWE-005 | Principal del ítem |
| PAN-WFL-25 | por.tramites.iniciar (sesión de socio; antes "Sesión de socio") | `/tramites`, `/solicitudes` | PWA socio | SM-PWS-023 | Principal del ítem |
| PAN-WFL-26 | pwa-socio / pwa-empleado | `/documentos`, `/docs` | PWA socio | SM-PWS-024 | Asociada al ítem |
| PAN-WFL-27 | pwa-socio / pwa-empleado | `/firmar/:id` | PWA socio | SM-PWS-024 | Asociada al ítem |
| PAN-WFL-28 | tec.ordenes.ejecutar (rol T-TEC; antes "Técnico") | `/ot/:id/conformidad` | PWA campo | SM-PWC-003 | Asociada al ítem |
| PAN-WFL-29 | Público | `/verificar` | Landing | SM-LND-028 | Principal del ítem |
| PAN-WFL-30 | Público con token | `/d/:token` | Landing | SM-LND-029 | Principal del ítem |
