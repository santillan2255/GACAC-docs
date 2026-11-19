# CoopApps — Qué tiene cada rol para su trabajo, comparado con ProCoop, y el detalle de los módulos

Documento para pasar a Claude (o a ChatGPT) y generar las imágenes que muestran, rol por rol, qué herramientas tiene cada persona para su gestión; cómo se compara con ProCoop; que todos los módulos están, y el detalle de cada módulo.

| Dato | Valor |
|---|---|
| Fecha | 10-11-2026 |
| Fuentes | Especificación maestra §7 y §8; T02 §4.1 (catálogo de roles) y §4.3 (matriz rol × módulo); T03 §10.8 y §10.9 (mapa del sitio, 558 ítems) y §22.1 (menú de ProCoop → mapa del sitio); encabezados de los anexos M01 a M19 y T01 a T12; `procoop-relevamiento/definicion-funcional-alcance.md`; inventarios de ProCoop en `procoop-relevamiento/binarios/inventarios/` |
| Regla de uso | Todos los nombres de pantallas, números y niveles de acceso salen de las fuentes. Las imágenes no deben agregar pantallas, roles ni números |

---

## 0. Cómo usar este documento

1. Subir este archivo a Claude.
2. Pegar el prompt maestro de la sección 0.1.
3. Pedir las imágenes por código: "Generá IMG-R01", "Generá IMG-M01", etc. (sección 9).
4. Verificar cada número y cada nombre contra este documento.

Con Claude conviene pedir cada imagen como **artefacto HTML con SVG de 1920×1080**: dibuja bien maquetas de pantallas, menús, matrices y diagramas, y respeta los textos. Después se captura o se exporta a PNG.

### 0.1 Prompt maestro (pegar primero)

```text
Vas a dibujar las imágenes de una presentación ejecutiva para mañana. El público son stakeholders tradicionales de una empresa de software para cooperativas de servicios públicos de Argentina, que conocen muy bien ProCoop, el sistema de escritorio que se va a reemplazar. El mensaje es: "cada persona de la cooperativa tiene en CoopApps las herramientas de su trabajo; todo lo que hoy hace en ProCoop está, ordenado y con más control, y todos los módulos están especificados".

Te adjunto el documento. Reglas obligatorias:
1. Usá SOLO los datos del documento: nombres de roles, nombres de pantallas, niveles de acceso y números. No inventes pantallas, botones con funciones nuevas ni números. Si falta un dato, avisame.
2. Texto visible en español de Argentina, formal y claro.
3. Generá cada imagen como un artefacto HTML autocontenido con SVG, de 1920×1080 px, fondo claro, listo para capturar.
4. Paleta: gris carbón #2F343A para títulos, gris medio #6B7280 para texto secundario, gris claro #E5E7EB para tarjetas, blanco #FFFFFF de fondo, verde cooperativo #2E7D32 como único acento (lo que el rol puede hacer, lo nuevo). Para niveles de acceso usá intensidades de verde (más oscuro = más acceso) y gris claro para "sin acceso". Ámbar #B7791F solo para "aprueba o autoriza". Lo de ProCoop siempre en grises, nunca en rojo: es un competidor respetable.
5. Las maquetas de pantalla del sistema de gestión llevan tema oscuro, como el producto real: fondo #0f1115, tarjetas #171a21, texto #e5e7eb, acento violeta #6b5bf0 (marca del producto). Las maquetas de la app del socio usan el logo genérico "Cooperativa A" y verde #2E7D32 como color de marca. Fuera de las maquetas, se aplica la paleta del punto 4.
6. Tipografía sans serif limpia (Inter o similar). Títulos grandes, poco texto, mucho aire. Íconos de línea simples.
7. Los niveles y estados nunca se distinguen solo por color: acompañalos con la letra del nivel (T, C, A, O, V, P, G) o un texto.
8. Datos de ejemplo siempre ficticios: "Cooperativa A", "Socio Ejemplo", importes redondos genéricos. Nunca nombres, DNI, CUIT ni direcciones reales.
9. Después de cada imagen, listá los datos que usaste y en qué sección del documento están.
Voy a pedirte las imágenes por código. Esperá mi pedido.
```

---

## 1. Los números del bloque

| Concepto | Valor | Fuente |
|---|---|---|
| Roles definidos | 40 | Maestra §7.2, T02 §4.1 |
| Roles de plataforma (equipo GoodApps) | 7 | T02 §4.1 |
| Roles de la cooperativa (personal) | 22 | T02 §4.1 |
| Roles de la comunidad (socios, representantes, adherentes, visitantes, empleados en portal, proveedores) | 6 | T02 §4.1 |
| Roles técnicos (sistema, API, bot, tótem, agente de hardware) | 5 | T02 §4.1 |
| Ítems de menú en todas las aplicaciones | 558 | T03 §10.9.11 |
| Ítems del sistema de gestión, en 18 grupos de menú | 402 | T03 §10.9.11 |
| Módulos especificados | 31 (19 funcionales y 12 transversales) | Documento base §5.1 |
| Requisitos funcionales | 4.204 | Documento base §5.1 |
| Funciones del menú de ProCoop relevadas | 120, en 9 pestañas más la pantalla principal | T03 §22.1 |
| Funciones de ProCoop absorbidas (misma función, mismo propósito) | 112 | T03 §22.1 |
| Funciones de ProCoop reemplazadas por un mecanismo mejor | 7 | T03 §22.1 |
| Funciones de ProCoop descartadas | 1 ("Base de datos": la administra la plataforma) | T03 §22.1 |

**Mensaje:** de las 120 funciones del menú de ProCoop, 119 están en CoopApps (112 iguales en propósito y 7 con un mecanismo mejor). La única que no está es la administración de la base de datos, porque en un servicio en la nube no la hace la cooperativa.

---

## 2. Cómo se decide qué ve y qué hace cada persona

### 2.1 ProCoop y CoopApps

| Aspecto | ProCoop | CoopApps |
|---|---|---|
| Unidad de permiso | Perfil con permisos por opción de menú y por tabla (`PERFILES`, `PERFILES_TABLAS`, `MENUSYS`) | Permiso por acción: ver, crear, editar, anular, aprobar, exportar y configurar, más las acciones propias de cada módulo |
| Qué pantallas ve | Lo define el mismo perfil | Perfil de pantallas, separado del rol funcional |
| Roles de partida | No hay roles predefinidos relevados; cada cooperativa arma sus perfiles | 40 roles plantilla que cada cooperativa usa, copia y ajusta, con el nombre que ella elija |
| Alcance de datos | Usuario asignado a un área, a depósitos y a un punto de venta (`USERS_AREA`, `USERS_DEPOSITO`, punto de venta) | Alcance por sucursal, punto de venta, caja, zona, servicio, cuadrilla, depósito, área, cartera del cobrador o "solo lo asignado" |
| Aprobaciones | Autorización de operaciones por supervisor (`AUTORIZACIONES`) | Autorización de supervisor en el momento o diferida, más separación de funciones: quien crea no aprueba |
| Doble factor | No relevado | Obligatorio para los roles con datos o dinero sensibles; según política para los de mostrador y campo |
| Horario | No relevado | Franja horaria por perfil |
| Auditoría | Auditoría de ingresos y de cambios | Auditoría inmutable de cada cambio, con valor anterior y nuevo |

### 2.2 Los cuatro filtros de CoopApps

Lo que una persona puede hacer es la intersección de cuatro filtros (Maestra §7.1):

1. **Licencia:** qué módulos contrató la cooperativa.
2. **Activación:** qué módulos tiene encendidos la cooperativa.
3. **Rol:** qué acciones tiene permitidas la persona.
4. **Alcance:** sobre qué datos puede hacerlas (sucursal, zona, caja, cartera, etc.).

### 2.3 Niveles de acceso que usa la matriz

| Letra | Significado |
|---|---|
| T | Total del módulo (ver, operar, aprobar, configurar y exportar) |
| C | Configurar (incluye ver) |
| A | Aprobar, anular o autorizar (incluye ver) |
| O | Operar: ver, crear, editar y ejecutar lo propio del rol |
| V | Ver |
| P | Solo lo propio o lo asignado |
| G | Solo datos agregados, sin datos personales |
| — | Sin acceso |

---

## 3. Las aplicaciones y quién usa cada una

| Aplicación | Quién la usa | Ítems de menú | Equivalente en ProCoop |
|---|---|---|---|
| Sistema de gestión web | Personal administrativo, comercial, técnico y directivo | 402, en 18 grupos | Programa de escritorio con 9 pestañas de menú |
| App del socio (celular y web) | Titulares, representantes y adherentes | 49 | CoopOnline y P-Móvil, sobre una copia sincronizada de los datos |
| App del empleado | Todo el personal | 27 | Sin equivalente relevado |
| App de campo, funciona sin conexión | Técnicos, lecturistas y cobradores | 19 | App móvil de campo (`CapaDatos.PMovil`) |
| Sitio público de la cooperativa | Público en general | 34 | Portal ProCoop WEB |
| Consola de plataforma | Equipo de GoodApps | 25 | No aplica: en ProCoop no hay plataforma |
| Tótem y pantalla del turnero | Socios en las oficinas | 2 | Turnero de Herramientas |
| API para terceros | Sistemas autorizados por la cooperativa | — | Claves de servicios web del portal (`WS_KEYS`, `WS_USERS`) |

### 3.1 Los 18 grupos del menú del sistema de gestión

| Grupo | Módulos | Ítems | Contenido |
|---|---|---|---|
| C01 Inicio | Tableros y bandeja | 10 | Tablero de la cooperativa, Mi bandeja de tareas, Alertas, Avisos, Tablero de control |
| C02 Socios y cuentas | M01 | 17 | Personas, Titulares, Cuentas, Grupos de facturación, Inmuebles y domicilios, Autorizados y representantes, Grupo familiar y adherentes, Documentación del titular, Unificación de duplicados, Consultas e informes |
| C03 Servicios | M02 | 12 | Catálogo de servicios, Planes, Productos y subservicios, Categorías, Particularidades por servicio, Requisitos por servicio, Copiar servicio desde otra cooperativa, Servicios contratados, Altas, bajas y cambios |
| C04 Medición | M03 | 19 | Medidores, Rutas de lectura, Registro de lecturas, Validación de consumos, Estimaciones, Autolecturas de socios, Telemedición, Prepago, Informes |
| C05 Facturación | M04, M05, M06 | 45 | Cuadros tarifarios, Conceptos y cargos, Promociones y bonificaciones, Subsidios y tarifa social, Simulador de cálculo, Ciclos y calendarios, Lotes de facturación, Bandeja de no facturables, Comprobantes emitidos, Pendientes de autorizar en ARCA, Notas de crédito y débito, Distribución y envío, Libros IVA, Percepciones, Regímenes de retención e informativos, Padrones fiscales, Tasas de terceros, Reguladores, ARCA |
| C06 Cobranza | M07 | 14 | Cuenta corriente, Apertura y cierre de caja, Cobranza en caja, Entes recaudadores, Débitos automáticos, Pasarelas de pago, Conciliación de cobranzas, Pagos no identificados, Devoluciones y contracargos, Informes |
| C07 Mora | M08 | 17 | Generar notificaciones, Tratamiento de morosos, Suspensiones, cortes y reconexiones, Instancias y excepciones de mora, Intereses y recargos, Planes de financiación, Garantías, Incobrables, Gestión judicial, Informes |
| C08 Atención | M09 | 22 | Bandeja de atención, Carga rápida de reclamos, Solicitudes comerciales, Reclamos, Trámites web recibidos, Conversaciones, Expedientes, Incidentes, Boxes y turnos, Estadísticas del turnero, Actividades internas, Tipos, estados y SLA, Informes |
| C09 Técnica | M10 | 25 | Agenda y visitas, Factibilidades, Órdenes de trabajo, Despacho y mapa de campo, Cuadrillas y contratistas, Instalaciones, Aprovisionamiento de Internet, Telefonía, TV y otros TIC, Redes y GIS, Obras y mantenimiento, Informes |
| C10 Ventas | M11 | 10 | Presupuestos, Venta de productos, Punto de venta, Informes |
| C11 Administración | M12, M13, M14, M15 | 68 | Compras (proveedores, solicitudes, cotizaciones, órdenes, remitos, comprobantes, pagos, retenciones); Stock (artículos y depósitos, movimientos, equipos serializados y comodatos, trazabilidad, bienes de uso, fabricación, RMA); Tesorería (cuentas, movimientos, valores, cheques, cupones, cierre de cajas, conciliación bancaria, Interbanking, planificación de fondos); Contabilidad (plan de cuentas, ejercicios, centros de costo, asientos, mayor, balance, planes múltiples y simulaciones, presupuesto) |
| C12 Personal | M16 | 19 | Empleados, Empresas empleadoras, Recibos, Novedades, Liquidación masiva, Simulador, Impuesto a las Ganancias, Variables y conceptos, Aumentos, Libro de sueldos digital y F.931, Informes |
| C13 Institucional | M17 | 8 | Padrón de asociados, Capital social, Asambleas, Consejo y actas, Reuniones, INAES |
| C14 Servicios sociales | M18 | 19 | Planes de vivienda, Sepelio, Cementerio parque, Salud y ambulancias, Banco de sangre, Vehículos y choferes, Viajes, Seguimiento GPS |
| C15 Comunidad | T09 | 17 | Publicaciones, Moderación, Boletines, Centro de comunicaciones, Plantillas, Campañas y avisos push, SMS, Saludos automáticos, Encuestas, Audiencias, Eventos y beneficios |
| C16 Sitio y portal | M19 | 13 | Landing de la cooperativa, Usuarios del portal, Trámites web, Archivos en la web, Bajas públicas recibidas, Configuración del portal |
| C17 Reportes | T10 | 13 | Catálogo de reportes, Salas de inteligencia, Editor de reportes, Informes personalizados, Exportaciones programadas, APIs para terceros |
| C18 Configuración | T01, T02, T03, T04, T06, T07, T11 | 54 | Usuarios, Roles, Perfiles de pantallas, Alcances, Auditorías, Sesiones; Datos de la cooperativa, Sucursales, Tablas y parámetros, Geografía y calles; Marca e identidad, Diccionario de términos; Autorización de operaciones, Workflows, Plantillas de documentos; Integraciones, Bóveda de credenciales; Migración desde ProCoop, Paralelo y by-pass; Soporte, Licencia, Respaldos, Ambiente de prueba |

Total: 402 ítems.

### 3.2 La app del socio (49 ítems)

Inicio · Cuentas y servicios · Detalle de servicio · Vincular cuenta · Contratar un servicio · Baja, suspensión o reactivación · Mis facturas y pagos · Detalle de factura · Pagar · Resumen de cuenta · Débito automático y factura digital · Planes de pago y cuotas · Mi deuda y avisos · Mis consumos · Autolectura con foto · Cargar saldo (prepago) · Gestiones, nueva gestión y seguimiento · Visitas · Conformidad de instalación · Turnos · Trámites · Constancias y documentos · Interrupciones y cortes programados · Comunidad, publicaciones, boletines, encuestas, beneficios y agenda · Avisos · Perfil, mis datos, autorizados, preferencias y seguridad · Servicios sociales, cementerio y vivienda · Capital y asambleas · Mis presupuestos y cuotas · Historial ProCoop · Ayuda y asistente.

### 3.3 La app del empleado (27 ítems)

Inicio · Bandeja · Casos asignados · Aprobaciones · Agenda · Avisos · Pendientes sin asignar y excepciones · Indicadores del equipo · Publicar al equipo · Encuestas y boletines · Mis recibos de sueldo · Firmar recibo · Directorio · Vacaciones y licencias · Mis datos y documentos · Mis certificados · Mis evaluaciones · Mi equipo · Firma de pagos · Posición de tesorería · Entregas de depósito · Acreditación en asamblea · Actos en el cementerio parque · Perfil y asistente.

Cada persona ve solo los ítems que su rol habilita (por ejemplo, "Firma de pagos" y "Posición de tesorería" son de tesorería y gerencia).

### 3.4 La app de campo (19 ítems, funciona sin conexión)

Hoy · Órdenes · Ejecución de orden · Instalación integral · Cortes y reconexiones · Inspecciones y relevamientos · Reclamo en campo · Incidente con foto y GPS · Rutas de lectura · Toma de lectura · Lectura fuera de ruta · Cobranza en domicilio · Rendición · Stock en vehículo · Reparto de facturas · Mapa · Viajes · Sincronización · Perfil y preferencias.

### 3.5 El sitio público (34 ítems, principales)

Inicio · Servicios y detalle con requisitos · Noticias · Cuadros tarifarios · Pagar sin ingresar · Consultar deuda · Reclamo o solicitud sin ingresar · Seguimiento de gestión por código · Baja de un servicio · Turno online · Estado del servicio y avisos de corte · Trámites y requisitos · Asambleas y convocatorias · Buscar difunto (cementerio parque) · Contacto y sucursales · Registrarme · Ingresar · Instalar la app · Verificar documento · Portal de proveedores · Portal para desarrolladores · Legales y ayuda.

### 3.6 La consola de plataforma (25 ítems)

Dashboard global · Tenants · Alta asistida de tenant · Licencias y packs · Contratos SaaS · Catálogo de módulos · Catálogo global de servicios y plantillas · Tablas comunes · Conectores de integración · Soporte y accesos temporales · Salud del sistema · Colas y jobs · Respaldos y restauración · Ambientes · Versiones del producto · Usuarios de plataforma · Auditoría de plataforma · Diccionario base y plantillas · Design system · Flags globales · Proyectos de migración · Uso por tenant · Avisos de plataforma · Consumo de mensajería · Monitoreo de BI y API.

---

## 4. Fichas por rol: personal de la cooperativa (22 roles)

Para cada rol: para qué está, dónde trabaja, qué grupos de menú usa y con qué nivel (T02 §4.3), las pantallas principales, los controles y su lugar en ProCoop. Los nombres de los roles son los de la plantilla; cada cooperativa puede llamarlos distinto con su diccionario.

### T-ADM — Administrador de la cooperativa

- **Para qué:** configura la cooperativa: usuarios, roles, perfiles, políticas, marca y publicación.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Configuración (T), Identidad y roles (T), todos los módulos (C, configurar), Migración (A), Comunidad (C).
- **Pantallas principales:** Usuarios · Roles · Perfiles de pantallas · Alcances · Datos de la cooperativa · Sucursales y puntos de venta · Parámetros del sistema · Marca e identidad · Diccionario de términos · Autorización de operaciones · Workflows · Integraciones · Licencia y módulos contratados · Respaldos y exportación de datos · Soporte y accesos temporales.
- **Controles:** doble factor obligatorio; la configuración se publica en versiones con historial.
- **En ProCoop:** Configuración > General (Usuarios, Perfiles, Copia de seguridad, Actualizar) y Configuración > Tablas y Parámetros.

### T-USR — Administrador de usuarios y seguridad (opcional)

- **Para qué:** da de alta y de baja usuarios y asigna roles, sin operar el negocio.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Identidad y roles (T, salvo políticas), Seguridad (O).
- **Pantallas principales:** Usuarios · Roles · Perfiles de pantallas · Alcances · Auditoría de ingresos · Sesiones y dispositivos.
- **Controles:** doble factor obligatorio; no ve datos de socios ni de dinero.
- **En ProCoop:** Configuración > General > Usuarios, Perfiles y Auditoría de logueo, mezclados con el resto de la configuración.

### T-GER — Gerente

- **Para qué:** sigue tableros, aprueba lo de alto nivel y tiene lectura general.
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** aprueba (A) en Servicios, Tarifas, Facturación, Fiscal, Cobranza, Mora, Ventas, Compras, Tesorería, Contabilidad, Personal, Configuración y Comunidad; ve (V) el resto; Reportes con exportación.
- **Pantallas principales:** Tablero de la cooperativa · Tablero de control · Alertas · Mi bandeja de tareas · Aprobaciones · Salas de inteligencia · Informes de gestión. En la app del empleado: Aprobaciones, Indicadores del equipo, Posición de tesorería.
- **Controles:** doble factor obligatorio.
- **En ProCoop:** Herramientas > Tablero de Control.

### T-FAC — Facturación

- **Para qué:** ciclos, lotes, comprobantes, notas de crédito y débito, y propuesta de tarifas.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Facturación (T), Tarifas (O), Fiscal (O), Socios y cuentas (O), Atención (O), Ventas (O), Integraciones (O); ve Servicios, Medición, Cobranza y Mora.
- **Pantallas principales:** Cuadros tarifarios · Simulador de cálculo · Ciclos y calendarios · Lotes de facturación · Bandeja de no facturables · Comprobantes emitidos · Pendientes de autorizar en ARCA · Notas de crédito y débito · Movimiento de conceptos · Distribución y envío · Libro IVA Ventas.
- **Controles:** doble factor obligatorio. Propone tarifas pero la aprobación es de gerencia (doble firma).
- **En ProCoop:** Servicios a Titulares > Ventas y Facturación (Facturación, Informes, Libro IVA Ventas, Movimiento de Conceptos).

### T-CAJ — Cajero

- **Para qué:** caja del turno, cobros, arqueo y ventas de mostrador.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Cobranza (O), Facturación (O, comprobantes de mostrador), Mora (O, cotizar recargos y convenios), Ventas (O), Medición (O, carga de prepago); ve Socios y Servicios; reportes propios (P).
- **Pantallas principales:** Apertura y cierre de caja · Cobranza en caja · Cuenta corriente · Punto de venta · Venta de productos · Prepago.
- **Controles:** doble factor según la política de la cooperativa; alcance por caja y punto de venta.
- **En ProCoop:** Servicios a Titulares > Cobranza (Apertura de Caja, Cobranza Local, Opciones de Cobranza).

### T-CBR — Cobrador de campo

- **Para qué:** cobranza domiciliaria de su cartera y rendición.
- **Dónde:** app de campo, sin conexión.
- **Grupos y nivel:** solo lo propio (P) en Socios, Cobranza y Mora; reportes propios.
- **Pantallas principales:** Hoy · Cobranza en domicilio · Rendición · Reparto de facturas · Sincronización.
- **Controles:** alcance por cartera; doble factor según política.
- **En ProCoop:** Cobranza; la app de campo de ProCoop (`PMovil`) tiene alcance a verificar.

### T-TES — Tesorero o financiero

- **Para qué:** bancos, valores, conciliación, pagos y pasarelas.
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** Tesorería (T), Cobranza (T), Mora (A); Integraciones (O); ve Facturación, Fiscal, Compras y Contabilidad.
- **Pantallas principales:** Cuentas bancarias propias · Movimientos bancarios y de tesorería · Valores de terceros · Cheques propios · Cupones de tarjetas · Retenciones recibidas · Cierre de cajas · Conciliación bancaria · Interbanking · Planificación de fondos · Entes recaudadores · Débitos automáticos · Pasarelas de pago · Conciliación de cobranzas · Pagos no identificados. En la app del empleado: Firma de pagos y Posición de tesorería.
- **Controles:** doble factor obligatorio; separación de funciones en pagos.
- **En ProCoop:** pestaña Tesorería (10 funciones).

### T-CON — Contador

- **Para qué:** plan de cuentas, asientos, cierres, fiscal y regímenes.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Contabilidad (T), Fiscal (T), Compras (O), Integraciones (O); ve el resto de lo económico.
- **Pantallas principales:** Plan de cuentas · Ejercicios y períodos · Centros de costo · Asientos · Asientos automáticos · Consultar mayor · Balance general y sumas y saldos · Planes múltiples y simulaciones · Presupuesto económico · Libros IVA · Percepciones · Regímenes de retención · Regímenes informativos · ARCA.
- **Controles:** doble factor obligatorio; períodos cerrados para todos los módulos.
- **En ProCoop:** pestaña Contabilidad (7 funciones) y Libro IVA Ventas.

### T-CMP — Compras

- **Para qué:** solicitudes, órdenes de compra y proveedores.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Compras (T), Stock (O).
- **Pantallas principales:** Proveedores · Solicitudes de aprovisionamiento · Solicitudes de cotización · Órdenes de compra · Remitos de proveedores · Comprobantes de proveedores · Retenciones practicadas · Informes de compras.
- **Controles:** doble factor obligatorio; quien pide no aprueba.
- **En ProCoop:** Compras y Stock > Gestión de Compras.

### T-DEP — Depósito

- **Para qué:** stock, remitos, equipos serializados y devoluciones a proveedores (RMA).
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** Stock (T), Compras (O).
- **Pantallas principales:** Artículos y depósitos · Movimientos de stock · Equipos serializados y comodatos · Trazabilidad · Operaciones especiales · Bienes de uso · Fabricación · RMA. En la app del empleado: Entregas de depósito.
- **Controles:** alcance por depósito.
- **En ProCoop:** Compras y Stock > Stock.

### T-TEC — Técnico de campo

- **Para qué:** órdenes asignadas, instalación, firma, fotos, sin conexión.
- **Dónde:** app de campo.
- **Grupos y nivel:** Técnica (P, sus órdenes), Medición (O), Stock (P, su vehículo), Mora (P, cortes y reconexiones asignados), Atención (P), Flota (O), Compras (O, solo solicitudes).
- **Pantallas principales:** Hoy · Órdenes · Ejecución de orden · Instalación integral · Cortes y reconexiones · Inspecciones y relevamientos · Incidente con foto y GPS · Stock en vehículo · Mapa · Sincronización.
- **Controles:** solo ve lo asignado; el socio ve su estado (en camino, en sitio, realizada).
- **En ProCoop:** Operaciones > Técnica > Órdenes.

### T-LEC — Lecturista

- **Para qué:** rutas asignadas y toma de lecturas, sin conexión.
- **Dónde:** app de campo.
- **Grupos y nivel:** Medición (P), Atención (P).
- **Pantallas principales:** Rutas de lectura · Toma de lectura · Lectura fuera de ruta · Sincronización.
- **Controles:** solo sus rutas.
- **En ProCoop:** Servicios a Titulares > Consumos > Registro de Lectura.

### T-STE — Supervisor técnico

- **Para qué:** agenda, cuadrillas, factibilidad, redes y aprovisionamiento.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Técnica (A), Medición (O), Mora (O, cortes), Compras y Stock (O), Flota (O), Integraciones (O), Comunicaciones (O).
- **Pantallas principales:** Agenda y visitas · Factibilidades · Órdenes de trabajo · Despacho y mapa de campo · Cuadrillas y contratistas · Instalaciones · Aprovisionamiento de Internet · Redes y GIS · Obras y mantenimiento · Informes técnicos.
- **Controles:** doble factor obligatorio.
- **En ProCoop:** Operaciones > Técnica (Factibilidades, Órdenes, Informes).

### T-SCM — Supervisor de consumos

- **Para qué:** valida y corrige consumos con justificación.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Medición (A), Atención (O), Integraciones (O); ve Tarifas y Facturación.
- **Pantallas principales:** Validación de consumos · Estimaciones · Autolecturas de socios · Informes de consumos y telemedición.
- **Controles:** doble factor obligatorio; toda corrección pide motivo y queda auditada.
- **En ProCoop:** Servicios a Titulares > Consumos > Opciones de consumos.

### T-ATE — Comercial o atención al socio

- **Para qué:** personas, solicitudes, reclamos, convenios y ventas de mostrador.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Atención (O), Socios y cuentas (O), Mora (O, convenios), Ventas (O), Técnica (O), Sitio y portal (O); ve Servicios, Tarifas, Facturación y Cobranza.
- **Pantallas principales:** Bandeja de atención · Carga rápida de reclamos · Solicitudes comerciales · Reclamos · Conversaciones · Atención de turnos · Personas · Titulares · Altas, bajas y cambios · Planes de financiación · Presupuestos · Usuarios del portal.
- **Controles:** doble factor según política; las excepciones van a autorización del supervisor.
- **En ProCoop:** Operaciones > Técnica > Carga Rápida de Reclamos; Herramientas > Turnero y Mesa de Entradas; Titulares.

### T-SAT — Supervisor de atención

- **Para qué:** asignación, derivación, plazos de atención (SLA), escalamiento y autorizaciones.
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** aprueba (A) en Atención, Socios y cuentas, Cobranza, Mora, Ventas y Sitio y portal.
- **Pantallas principales:** Bandeja de atención · Expedientes · Incidentes · Tipos, estados y SLA · Estadísticas del turnero · Informes de atención · Bajas públicas recibidas. En la app del empleado: Pendientes sin asignar y excepciones, Indicadores del equipo.
- **Controles:** doble factor obligatorio.
- **En ProCoop:** Herramientas > Mesa de Entradas y Turnero > Estadísticas.

### T-RRHH — Recursos humanos o liquidador

- **Para qué:** legajos, novedades, liquidaciones y recibos.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Personal (T).
- **Pantallas principales:** Empleados · Empresas empleadoras · Recibos · Novedades del período · Liquidación masiva · Simulador de liquidación · Impuesto a las Ganancias · Variables · Conceptos · Aplicar aumentos · Libro de sueldos digital y F.931.
- **Controles:** doble factor obligatorio; los datos de sueldos no los ve el síndico.
- **En ProCoop:** pestaña Sueldos (11 funciones).

### T-SEC — Secretaría institucional

- **Para qué:** asociados, capital, asambleas y actas.
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** Institucional (T).
- **Pantallas principales:** Padrón de asociados · Capital social · Asambleas · Consejo y actas · Reuniones · INAES. En la app del empleado: Acreditación en asamblea.
- **Controles:** doble factor obligatorio.
- **En ProCoop:** sin pestaña propia en el menú relevado; los datos están en tablas (`SOCIOS`, `CAPITAL`, `ACTAS`, `CONSEJO`).

### T-COM — Editor de comunidad o moderador

- **Para qué:** muro, novedades, encuestas y moderación.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** Comunidad (T), Sitio y portal (O), Marca y experiencia (O).
- **Pantallas principales:** Publicaciones · Moderación · Boletines · Centro de comunicaciones · Plantillas · Campañas y avisos push · SMS · Saludos automáticos · Encuestas · Audiencias guardadas · Eventos y beneficios · Landing de la cooperativa.
- **En ProCoop:** Herramientas > SMS. El resto no tiene equivalente en el menú relevado.

### T-SOC — Operador de servicios sociales y salud

- **Para qué:** sepelio, cementerio parque, vivienda, ambulancias y banco de sangre, con datos sensibles.
- **Dónde:** sistema de gestión y app del empleado.
- **Grupos y nivel:** Servicios sociales (T).
- **Pantallas principales:** Planes de vivienda · Sepelio · Cementerio parque · Salud y ambulancias · Banco de sangre · Prestaciones. En la app del empleado: Actos en el cementerio parque.
- **Controles:** doble factor obligatorio; los datos de salud no los ve el síndico.
- **En ProCoop:** Operaciones > Planes de Vivienda.

### T-CJO — Consejero

- **Para qué:** lectura institucional y agregada, votaciones del consejo.
- **Dónde:** sistema de gestión o portal.
- **Grupos y nivel:** datos agregados (G) de tarifas, facturación, cobranza, mora, tesorería y contabilidad, sin datos personales; aprueba en el consejo y en actas.
- **Controles:** doble factor obligatorio.
- **En ProCoop:** sin rol equivalente relevado.

### T-SIN — Síndico o auditor

- **Para qué:** lectura amplia y auditoría, sin escribir nada.
- **Dónde:** sistema de gestión.
- **Grupos y nivel:** ve (V) todos los módulos y la auditoría, con exportación de reportes; sin datos de salud ni datos sensibles de sueldos.
- **Controles:** doble factor obligatorio; ninguna acción de escritura.
- **En ProCoop:** sin rol equivalente relevado.

---

## 5. Fichas por rol: comunidad, plataforma y técnicos

### 5.1 Comunidad

| Rol | Dónde | Qué puede hacer |
|---|---|---|
| C-SOC Socio titular | App del socio y sitio público | Ver y editar su contacto, gestionar autorizados; ver consumos y hacer autolectura; ver y descargar sus comprobantes; ver saldo, pagar y adherir al débito; ver deuda y pedir convenio; crear reclamos y consultas, ver los suyos y chatear; trámites, alta y baja; ver su condición de asociado, capital y asambleas; servicios sociales de su grupo; comunidad |
| C-REP Representante o autorizado | App del socio | Lo mismo sobre la cuenta que representa, según la relación vigente y las acciones permitidas (consultar, pagar, gestionar, dar de baja, firmar) |
| C-ADH Adherente o grupo familiar | App del socio | Consulta limitada de sus servicios sociales y coberturas; encuestas |
| C-VIS Visitante registrado | Sitio público y app | Noticias, solicitud de alta, consultas, vincular una cuenta, pago sin ingresar |
| C-EMP Empleado en portal | App del empleado | Ver, firmar y descargar su recibo de sueldo; novedades de RRHH; consultas de RRHH |
| C-PRV Proveedor | Portal de proveedores, solo por invitación | Sus órdenes de compra, carga de facturas y remitos, estado de pagos y retenciones propias |

### 5.2 Plataforma (equipo GoodApps)

Los roles de plataforma **no ven datos de las cooperativas** por ser de la plataforma. Solo entran con un acceso de soporte temporal, con alcance mínimo, justificado y auditado.

| Rol | Qué hace |
|---|---|
| P-SUP Superadministrador | Cooperativas, licencias, roles plantilla, usuarios de plataforma, emergencias |
| P-ADM Operaciones de cooperativas | Alta asistida, configuración base, copia de servicios, migraciones |
| P-COM Comercial de plataforma | Contratos SaaS, packs y licencias, sin datos operativos |
| P-SOP1 Soporte nivel 1 | Casos de soporte y diagnóstico sin datos; pide acceso temporal en modo observar |
| P-SOP2 Soporte nivel 2 | Acceso temporal para observar u operar, acotado y aprobado |
| P-SEC Seguridad y auditoría | Auditoría global, alertas, incidentes, revisión de accesos |
| P-OPS Operaciones técnicas | Salud, colas, ambientes y respaldos, sin datos operativos |

### 5.3 Técnicos

| Rol | Qué hace |
|---|---|
| S-SYS Sistema | Procesos internos con identidad técnica y permisos por proceso |
| S-API Cliente API | Integraciones externas con los permisos que la cooperativa habilite |
| S-BOT Asistente de IA | Actúa con permisos mínimos o en nombre de un usuario, nunca con más permisos que él; solo propone y la persona confirma |
| S-KSK Tótem o turnero | Operaciones públicas del tótem; salir del modo tótem exige autenticación del personal |
| S-AGT Agente de hardware local | Impresoras fiscales, lectores y balanzas, con credencial por puesto |

---

## 6. Matriz rol × módulo (personal de la cooperativa)

Fuente: T02 §4.3. Se muestran los 19 módulos funcionales y los transversales de Comunidad, Reportes y Flujos. Las letras siguen la leyenda de la sección 2.3.

| Módulo | ADM | USR | GER | FAC | CAJ | CBR | TES | CON | CMP | DEP | TEC | LEC | STE | SCM | ATE | SAT | RRHH | SEC | COM | SOC | CJO | SIN |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M01 Personas | T | — | V | O | V | P | V | V | V | — | P | P | V | V | O | A | V | V | — | V | — | V |
| M02 Servicios | C | — | A | V | V | V | V | V | V | V | V | — | V | V | V | V | — | — | — | V | — | V |
| M03 Medición | C | — | V | V | O | — | — | — | — | — | O | P | O | A | V | V | — | — | — | — | — | V |
| M04 Tarifas | C | — | A | O | V | — | V | V | — | — | — | — | — | V | V | V | — | — | — | — | G | V |
| M05 Facturación | C | — | A | T | O | V | V | V | — | — | — | — | — | V | V | V | — | — | — | — | G | V |
| M06 Fiscal | C | — | A | O | — | — | V | T | V | — | — | — | — | — | — | — | V | — | — | — | — | V |
| M07 Cobranza | C | — | A | V | O | P | T | V | — | — | — | — | — | — | V | A | — | — | — | — | G | V |
| M08 Mora | C | — | A | V | O | P | A | V | — | — | P | — | O | — | O | A | — | — | — | — | G | V |
| M09 Atención | C | — | V | O | O | O | O | O | O | O | P | P | O | O | O | A | O | O | O | O | — | V |
| M10 Técnica | C | — | V | V | — | — | — | — | — | V | P | — | A | V | O | V | — | — | — | — | — | V |
| M11 Ventas | C | — | A | O | O | — | V | V | — | V | — | — | V | — | O | A | — | — | — | — | — | V |
| M12 Compras | C | — | A | — | — | — | V | O | T | O | O | O | O | — | O | O | O | O | — | O | — | V |
| M13 Stock | C | — | V | — | — | — | — | V | O | T | P | — | O | — | V | — | — | — | — | — | — | V |
| M14 Tesorería | C | — | A | — | — | — | T | V | V | — | — | — | — | — | — | — | — | — | — | — | G | V |
| M15 Contabilidad | C | — | A | — | — | — | V | T | — | — | — | — | — | — | — | — | — | — | — | — | G | V |
| M16 Sueldos | C | — | A | — | — | — | V | V | — | — | — | — | — | — | — | — | T | — | — | — | — | V |
| M17 Institucional | C | — | V | — | V | — | — | V | — | — | — | — | — | — | V | — | — | T | — | — | A | V |
| M18 Servicios sociales | C | — | V | V | V | — | — | V | — | — | O | — | O | — | V | V | — | — | — | T | — | V |
| M19 Portal | C | — | V | — | — | — | — | — | — | — | — | — | — | — | O | A | — | — | O | — | — | V |
| T09 Comunidad | C | — | A | — | — | — | — | — | — | — | — | — | O | — | O | O | O | O | T | — | V | V |
| T10 Reportes | C | — | V | V | P | P | V | V | V | V | — | — | V | V | V | V | V | V | V | V | G | V |
| T11 Flujos y aprobaciones | C | — | A | O | O | O | O | O | O | O | O | O | O | O | O | O | O | O | O | O | A | V |
| T02 Identidad y roles | T | T | V | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | V |

Notas: en Compras, la "O" de técnico, lecturista, atención, supervisor de atención, RRHH, secretaría y servicios sociales es "solo solicitudes". En Servicios sociales, la "O" de técnico y supervisor técnico es "solo flota". El síndico ve Sueldos sin datos sensibles y Servicios sociales sin datos de salud. El cajero opera Medición solo para prepago.

---

## 7. Detalle de los módulos

### 7.1 Módulos funcionales

| Módulo | Para qué sirve | Grupo de menú | Ítems | Requisitos | Olas principales | En ProCoop |
|---|---|---|---|---|---|---|
| M01 Personas, titulares y cuentas | Identidad única de cada persona y todas sus relaciones con la cooperativa: titularidad, cuentas, domicilios, inmuebles, representantes, documentación y bloqueos. Ficha 360 | C02 | 17 | 175 | O2 (núcleo), O4 a O6 (señales a facturación y cobranza) | Servicios a Titulares > Titulares (104 formularios en `ProMod_Titulares`) |
| M02 Catálogo de servicios | Qué servicios presta cada cooperativa, con qué productos, planes, categorías, requisitos y estados, sin programar; contrato de servicio de punta a punta; copia entre cooperativas | C03 | 12 | 117 | O2 | Tablas de facturación y fichas de servicio |
| M03 Medición y consumos | De la medición física o remota a cantidades aprobadas para facturar: medidores, rutas, lecturas, validación, estimaciones, telemedición y prepago | C04 | 19 | 129 | O7 | Servicios a Titulares > Consumos y Operaciones > Telemed (19 formularios en `ProMod_Consumos`) |
| M04 Tarifas y motor de cálculo | Cálculo reproducible, explicable y auditable de cada concepto, con cuadros versionados, aprobación con doble firma y simulador | C05 | 45 (con M05 y M06) | 122 | O4 | Tablas > Cuadros Tarifarios, Impuestos y Cargos |
| M05 Facturación | Comprobantes sin duplicación por ciclos y lotes, con bandeja de no facturables, notas de crédito y débito, PDF con QR y distribución | C05 | (ver M04) | 179 | O4 | Servicios a Titulares > Ventas y Facturación (82 formularios en `ProMod_Facturacion`) |
| M06 Fiscal e impuestos | ARCA (CAE y CAEA de contingencia), IVA, percepciones, retenciones, regímenes informativos, tasas de terceros y reguladores | C05 | (ver M04) | 169 | O4 (ARCA), O5, O8 | Libro IVA Ventas, Retenciones, tablas fiscales |
| M07 Cuenta corriente y cobranza | Única fuente del saldo y único camino del dinero: cajas, entes recaudadores, débitos, pasarelas y conciliación | C06 | 14 | 195 | O5 | Servicios a Titulares > Cobranza (90 formularios en `ProMod_Cobranzas`) |
| M08 Mora y financiación | Intereses, notificaciones, suspensión, corte, reconexión, planes de pago, garantías, incobrables, gestión judicial y prescripción | C07 | 17 | 224 | O6 | Crédito y Gestión de Mora (16 formularios en `ProMod_GestionMora`) |
| M09 Atención al socio | Expediente único por gestión, por cualquier canal (app, WhatsApp, correo, teléfono, ventanilla con turnero, mesa de entradas, bot), con plazos y avisos | C08 | 22 | 194 | O2, O3, O6 | Herramientas > Mesa de Entradas y Turnero; Carga Rápida de Reclamos |
| M10 Técnica, campo y redes | Factibilidad, agenda, órdenes de trabajo, instalación integral, app de campo sin conexión, aprovisionamiento de Internet, GIS y obras | C09 | 25 | 239 | O3, O6 | Operaciones > Técnica (61 formularios en `ProMod_Tecnica`) |
| M11 Ventas y presupuestos | Lo que se vende o cobra por única vez: presupuestos con aceptación en línea, venta de productos y punto de venta | C10 | 10 | 94 | O4, O6, O8 | Presupuestos y Venta de Productos |
| M12 Compras y proveedores | De la necesidad interna a la obligación de pago, con portal de proveedores | C11 | 68 (con M13 a M15) | 115 | O3 (mínimo), O8 | Compras y Stock > Gestión de Compras |
| M13 Stock, activos y fabricación | Existencia única por ubicación, serie y lote; comodatos de equipos; RMA; bienes de uso; fabricación | C11 | (ver M12) | 139 | O3 | Compras y Stock > Stock |
| M14 Tesorería y bancos | Dinero disponible, en tránsito y comprometido, con posición proyectada, conciliación bancaria e Interbanking | C11 | (ver M12) | 188 | O5 | Tesorería (21 formularios en `ProMod_Tesoreria`) |
| M15 Contabilidad | Efecto contable de todas las operaciones, centros de costo, varios planes de cuentas, escenarios simulados y presupuesto | C11 | (ver M12) | 163 | O5 (núcleo), O6 y siguientes | Contabilidad (24 formularios en `ProMod_Contabilidad`) |
| M16 Personal y sueldos | Liquidación completa con Ganancias, seguridad social, libro de sueldos digital y F.931; recibo firmado en la app | C12 | 19 | 146 | O9 (O3 registro mínimo, O8 importación) | Sueldos |
| M17 Institucional | Asociados, capital social, asambleas, consejo, actas e INAES, separado de lo comercial | C13 | 8 | 109 | O2 (mínimo), O4 y O5 (capital) | Sin pestaña; solo tablas |
| M18 Servicios sociales y flota | Sepelio, cementerio parque, vivienda, salud y ambulancias, banco de sangre, vehículos y viajes | C14 | 19 | 149 | O4 (adherentes), O10 | Operaciones > Planes de Vivienda; Herramientas > Traslados |
| M19 Portal del socio y sitio público | Sitio con la marca de la cooperativa y app única de autogestión para su comunidad | C16 | 13 (más 49 de la app y 34 del sitio) | 180 | O2 a O5 | ProCoop WEB y CoopOnline (71 tipos en `AutoGestion`) |

### 7.2 Módulos transversales

| Módulo | Para qué sirve | Requisitos | Olas principales |
|---|---|---|---|
| T01 Plataforma SaaS | Cooperativas y su ciclo de vida, licencias, módulos, soporte, ambientes y respaldos | 165 | O0, O1 |
| T02 Identidad, roles y auditoría | Quién es cada actor, cómo se autentica, qué puede ver y hacer, y la auditoría | 93 | O0, O1 |
| T03 Experiencia, marca y vocabulario | Cómo se ve, se navega y habla la interfaz en cada cooperativa; mapa del sitio | 179 | O0 |
| T04 Configuración y parámetros | Configuración tipada, versionada y auditable; tablas maestras y geografía | 143 | O0, O1 |
| T05 Modelo de datos | Catálogo único de colecciones, dueños, índices y orden de creación | Catálogo | O0 |
| T06 Integraciones | Marco común de conectores y ficha de cada integración externa | 86 | O0 a O5 |
| T07 Migración desde ProCoop | Traslado de datos, convivencia, corrida en paralelo y by-pass | 78 | O0, O1 |
| T08 No funcionales y seguridad | Cómo debe comportarse todo: seguridad, privacidad, rendimiento, calidad | 25 (y 259 no funcionales) | O0 |
| T09 Comunidad y comunicaciones | Muro, novedades, encuestas, eventos, beneficios, audiencias, notificaciones y campañas | 157 | O0, O2 |
| T10 Reportes, BI y API | Reportes, tableros, exportaciones y API para terceros | 104 | O1 (API en O11) |
| T11 Flujos, eventos y documentos | Tareas, aprobaciones, eventos, plantillas y expediente documental | 157 | O0, O1 |
| T12 Fichas por servicio | Control de punta a punta de cada servicio (Internet, energía, gas, agua, sepelio, etc.) | Control de cobertura | Según servicio |

---

## 8. El menú de ProCoop y dónde quedó cada función

### 8.1 Por pestaña

| Pestaña de ProCoop | Funciones | Dónde quedan en CoopApps |
|---|---|---|
| Servicios a Titulares | 19 | C02 Socios y cuentas, C04 Medición, C05 Facturación, C06 Cobranza, C10 Ventas, C18 Configuración |
| Crédito y Gestión de Mora | 10 | C07 Mora |
| Operaciones | 10 | C09 Técnica, C04 Medición (telemedición), C14 Servicios sociales (vivienda) |
| Compras y Stock | 17 | C11 Administración (Compras y Stock) |
| Tesorería | 10 | C11 Administración (Tesorería) |
| Sueldos | 11 | C12 Personal |
| Contabilidad | 7 | C11 Administración (Contabilidad) |
| Herramientas | 13 | C08 Atención (actividades, turnero, mesa de entradas), C14 (traslados), C15 Comunidad (SMS), C01 Inicio (tablero de control) |
| Configuración | 17 | C18 Configuración, C16 Sitio y portal (ProCoop WEB), C17 Reportes (editor e informes personalizados) |
| Pantalla principal y funciones de todos los listados | 6 | C01 Inicio, exportar e imprimir en todas las tablas, vistas guardadas |
| **Total** | **120** | **112 absorbidas, 7 reemplazadas, 1 descartada** |

### 8.2 Las 7 funciones reemplazadas por un mecanismo mejor

| Función de ProCoop | Cómo queda en CoopApps |
|---|---|
| Alerta de inicio "Hay facturas electrónicas pendientes de autorizar!" | Centro de alertas y aviso persistente, sin ventana que bloquee el trabajo |
| Noticias Procoop | Avisos del producto y novedades de versión |
| Configuración > General > Perfiles | Se separa en roles (qué puede hacer) y perfiles de pantallas (qué ve) |
| Configuración > General > Copia de Seguridad | Exportación de los datos de la cooperativa y respaldo administrado por la plataforma |
| Configuración > General > Actualizar | Actualización continua: la cooperativa ve las novedades y no instala nada |
| Configuración > ProCoop WEB (logos de facturas) | Marca e identidad, con recursos por canal |
| Personalización de formularios | Vistas guardadas de las tablas y diccionario de términos |

### 8.3 La función descartada

Configuración > General > Base de Datos (deshabilitada en la demo): en un servicio en la nube, la base de datos la administra la plataforma, no la cooperativa (DEC-002).

### 8.4 Grupos de menú sin pestaña equivalente en ProCoop

- **C13 Institucional:** en ProCoop los asociados, el capital, las actas y el consejo están en tablas, sin menú propio relevado.
- **C15 Comunidad:** de ProCoop solo existe el envío de SMS; el muro, las encuestas, las campañas, las audiencias y los beneficios son nuevos.
- **App del empleado:** sin equivalente relevado.

---

## 9. Prompts de imágenes

### Bloque A: roles

#### IMG-R01 — 40 roles, cuatro espacios

```text
Generá IMG-R01 (artefacto HTML con SVG, 1920×1080).
Título: "40 roles, cada uno con lo suyo".
Cuatro columnas con encabezado y cantidad:
- "Plataforma (equipo GoodApps) · 7": Superadministrador, Operaciones de cooperativas, Comercial, Soporte nivel 1, Soporte nivel 2, Seguridad y auditoría, Operaciones técnicas.
- "Cooperativa · 22": Administrador, Usuarios y seguridad, Gerente, Facturación, Cajero, Cobrador, Tesorero, Contador, Compras, Depósito, Técnico, Lecturista, Supervisor técnico, Supervisor de consumos, Atención al socio, Supervisor de atención, RRHH, Secretaría institucional, Comunidad, Servicios sociales, Consejero, Síndico.
- "Comunidad · 6": Socio titular, Representante, Adherente, Visitante, Empleado en portal, Proveedor.
- "Técnicos · 5": Sistema, Cliente API, Asistente IA, Tótem, Agente de hardware.
Cada rol como una pastilla chica con ícono de línea. La columna Cooperativa es la más ancha y lleva el acento verde.
Pie: "Cada cooperativa usa estos roles como plantilla, los copia, los ajusta y los nombra con sus palabras".
```

#### IMG-R02 — Cómo se decide qué ve cada persona

```text
Generá IMG-R02 (HTML con SVG).
Título: "Qué ve y qué hace cada persona".
Izquierda, "ProCoop", en grises: un solo bloque "Perfil" con dos flechas: "Opciones de menú" y "Tablas". Debajo, tres etiquetas chicas: "Área", "Depósito", "Punto de venta".
Derecha, "CoopApps", en verde: un embudo de cuatro filtros que se van estrechando, con su nombre y una línea de explicación:
1. "Licencia: qué contrató la cooperativa"
2. "Activación: qué tiene encendido"
3. "Rol: qué acciones puede hacer (ver, crear, editar, anular, aprobar, exportar, configurar)"
4. "Alcance: sobre qué datos (sucursal, caja, zona, cartera, lo asignado)"
Al pie del embudo: "Lo que la persona puede hacer".
Al costado del embudo, tres sellos: "Doble factor", "Quien crea no aprueba", "Todo queda auditado".
```

#### IMG-R03 — Siete aplicaciones, cada persona en la suya

```text
Generá IMG-R03 (HTML con SVG). Usá la tabla de la sección 3.
Título: "Cada persona trabaja en la aplicación que necesita".
Siete tarjetas con un dibujo simple del dispositivo (monitor, celular, tablet, tótem), el nombre de la app, quién la usa y la cantidad de ítems de menú:
- Sistema de gestión web · Personal de la cooperativa · 402 ítems en 18 grupos
- App del socio · Titulares, representantes, adherentes · 49
- App del empleado · Todo el personal · 27
- App de campo, sin conexión · Técnicos, lecturistas, cobradores · 19
- Sitio público · Público en general · 34
- Consola de plataforma · Equipo CoopApps · 25
- Tótem y turnero · Socios en la oficina · 2
Total destacado arriba a la derecha: "558 ítems de menú especificados".
Debajo de cada tarjeta, en gris chico, el equivalente en ProCoop de la sección 3 (por ejemplo "ProCoop: programa de escritorio con 9 pestañas").
```

#### IMG-R04 — Matriz rol × módulo

```text
Generá IMG-R04 (HTML con SVG): un mapa de calor con la matriz de la sección 6.
Filas: los 23 módulos de la tabla. Columnas: los 22 roles de la cooperativa, con su abreviatura (ADM, USR, GER, ...) y el nombre completo en un tooltip o en una leyenda abajo.
Cada celda muestra la letra del nivel (T, C, A, O, V, P, G o —) y un color: T verde oscuro #1B5E20, C verde #2E7D32, O verde medio #66BB6A, A ámbar #B7791F, V verde muy claro #C8E6C9, P y G gris verdoso #DDE7DD, — gris claro #F3F4F6.
Título: "Cada rol, solo lo que necesita".
Leyenda con las letras y su significado (sección 2.3).
Resaltar con un borde fino la diagonal de "dueños": FAC en Facturación, TES en Tesorería, CON en Contabilidad y Fiscal, CMP en Compras, DEP en Stock, RRHH en Sueldos, SEC en Institucional, COM en Comunidad, SOC en Servicios sociales.
```

#### IMG-R05 — Plantilla de ficha de rol (una imagen por rol)

```text
Generá IMG-R05 para el rol que te indique (por ejemplo: "IMG-R05 para T-CAJ"). Usá la ficha del rol en la sección 4.
Composición en dos partes:
Izquierda (60 %): maqueta del sistema de gestión en tema oscuro (fondo #0f1115, tarjetas #171a21, acento violeta #6b5bf0), con el menú lateral mostrando SOLO los grupos que el rol usa y, dentro, SOLO las pantallas principales de su ficha. La pantalla central muestra la primera pantalla principal con datos ficticios. Si el rol trabaja en la app de campo o en la app del empleado, en lugar del sistema de gestión dibujá un celular con esa app y sus ítems.
Derecha (40 %), fondo claro:
- Nombre del rol y su "Para qué".
- "Dónde trabaja".
- "Qué puede hacer": los grupos con su letra de nivel.
- "Controles": doble factor, alcance, aprobaciones.
- Recuadro gris al pie: "En ProCoop: <texto de la ficha>".
Título arriba: "<Nombre del rol>: lo que tiene para su trabajo".
```

Roles recomendados para la presentación (uno por imagen): T-CAJ Cajero, T-FAC Facturación, T-ATE Atención al socio, T-TEC Técnico de campo, T-TES Tesorero, T-CON Contador, T-GER Gerente, T-ADM Administrador de la cooperativa. Los demás quedan para el anexo.

#### IMG-R06 — Un día en el campo

```text
Generá IMG-R06 (HTML con SVG). Tres celulares lado a lado con la app de campo (sección 3.4):
- "Técnico": pantalla "Hoy" con tres órdenes (Instalación, Corte, Inspección) y abajo los ítems Órdenes, Mapa, Stock en vehículo, Sincronización.
- "Lecturista": pantalla "Rutas de lectura" con una ruta y un avance "32 de 120" (dato ficticio, rotulado como ejemplo) y el botón "Toma de lectura".
- "Cobrador": pantalla "Cobranza en domicilio" con una lista de cuentas de ejemplo y el botón "Rendición".
Cada celular con un indicador "Sin conexión: los datos se guardan y se sincronizan después".
Título: "En el campo, cada uno con lo suyo, aunque no haya señal".
Pie en gris: "ProCoop: app móvil de campo (PMovil)".
```

#### IMG-R07 — El socio y el empleado

```text
Generá IMG-R07 (HTML con SVG). Dos celulares grandes.
Izquierda "App del socio" (logo "Cooperativa A", verde #2E7D32): pantalla de inicio con tarjetas "Mis servicios", "Mis facturas y pagos", "Pagar", "Gestiones", "Mis consumos", "Turnos", "Comunidad". Debajo del celular: "49 ítems: del alta a la baja, sin ir a la oficina".
Derecha "App del empleado": pantalla de inicio con "Bandeja", "Aprobaciones", "Casos asignados", "Mis recibos de sueldo", "Firmar recibo", "Vacaciones y licencias". Debajo: "27 ítems: cada empleado ve lo que su rol habilita".
Título: "Dos apps más para la comunidad de la cooperativa".
Pie en gris: "ProCoop: CoopOnline y P-Móvil para socios, sobre una copia de los datos; sin app del empleado relevada".
```

#### IMG-R08 — Lo que el equipo GoodApps no puede ver

```text
Generá IMG-R08 (HTML con SVG).
Título: "El equipo de la plataforma no ve los datos de la cooperativa".
Centro: un muro o línea divisoria. A la izquierda, los 7 roles de plataforma (sección 5.2). A la derecha, la cooperativa con sus datos (socios, facturas, dinero).
Una sola puerta en el muro rotulada "Acceso de soporte temporal" con cuatro condiciones: "Vinculado a un caso", "Alcance mínimo", "Justificado y aprobado", "Todo queda auditado".
```

### Bloque B: módulos y comparación con ProCoop

#### IMG-M01 — Todos los módulos están

```text
Generá IMG-M01 (HTML con SVG). Mapa de módulos con las tablas de las secciones 7.1 y 7.2.
Título: "Los 31 módulos, especificados".
Arriba, en seis bloques por área, los 19 módulos funcionales con su código, nombre corto y cantidad de requisitos:
- Socios y servicios: M01 (175), M02 (117), M03 (129)
- Facturación y fiscal: M04 (122), M05 (179), M06 (169)
- Cobranza y mora: M07 (195), M08 (224)
- Atención y técnica: M09 (194), M10 (239)
- Gestión administrativa: M11 (94), M12 (115), M13 (139), M14 (188), M15 (163)
- Personas, institucional y social: M16 (146), M17 (109), M18 (149)
Una banda "Canales": M19 (180).
Abajo, una base ancha con los 12 transversales: T01 a T12 con su nombre corto.
Cada módulo con una marca verde "Especificado".
Dato destacado: "4.204 requisitos funcionales".
```

#### IMG-M02 — De las 9 pestañas de ProCoop a los 18 grupos de CoopApps

```text
Generá IMG-M02 (HTML con SVG): diagrama de flujo de izquierda a derecha (tipo Sankey simple) con la tabla 8.1.
Izquierda, en grises: las 9 pestañas de ProCoop más "Pantalla principal", con su cantidad de funciones (19, 10, 10, 17, 10, 11, 7, 13, 17, 6).
Derecha, en verde: los 18 grupos del menú de CoopApps (C01 a C18) con su cantidad de ítems (sección 3.1).
Flujos según la columna "Dónde quedan" de la tabla 8.1.
C13 Institucional y C15 Comunidad marcados con la etiqueta "Nuevo: sin pestaña en ProCoop" (C15 recibe solo el flujo de SMS).
Título: "Todo lo de ProCoop tiene su lugar, y hay más".
```

#### IMG-M03 — 120 funciones de ProCoop: 119 están

```text
Generá IMG-M03 (HTML con SVG). Gráfico de anillo con tres porciones:
- 112 "Absorbidas: la misma función, ordenada" (verde #2E7D32)
- 7 "Reemplazadas por un mecanismo mejor" (verde claro #66BB6A)
- 1 "Descartada: la base de datos la administra la plataforma" (gris)
En el centro: "120 funciones del menú de ProCoop".
A la derecha, la lista de las 7 reemplazadas con su "cómo queda" en una línea (tabla 8.2).
Título: "De las 120 funciones del menú de ProCoop, 119 están en CoopApps".
```

#### IMG-M04 — Plantilla de ficha de módulo (una imagen por módulo)

```text
Generá IMG-M04 para el módulo que te indique (por ejemplo: "IMG-M04 para M07"). Usá su fila de la tabla 7.1 y su grupo de menú de la tabla 3.1.
Composición:
- Arriba: código y nombre del módulo, y su "Para qué sirve" en una frase.
- Izquierda: maqueta del menú lateral del sistema de gestión en tema oscuro con el grupo del módulo desplegado y todas sus pantallas (tabla 3.1).
- Centro: tres indicadores grandes: "Requisitos", "Ítems de menú", "Olas".
- Derecha: "Quién lo usa": los roles con nivel T, O o A en ese módulo según la matriz de la sección 6, con su letra.
- Abajo, recuadro gris: "En ProCoop: <columna En ProCoop>".
```

Módulos recomendados para la presentación: M05 Facturación, M07 Cobranza, M08 Mora, M09 Atención, M10 Técnica y M19 Portal. El resto queda para el anexo.

#### IMG-M05 — El menú completo del sistema de gestión

```text
Generá IMG-M05 (HTML con SVG). Un póster con el menú completo de la tabla 3.1.
Título: "El sistema de gestión completo: 18 grupos, 402 ítems".
18 columnas o tarjetas compactas (en 3 filas de 6), cada una con el nombre del grupo, la cantidad de ítems y la lista de pantallas en letra chica.
Tema claro, acento verde en los nombres de grupo. Debe leerse de lejos que "está todo", aunque no se lea cada ítem.
```

#### IMG-M06 — Lo nuevo que ProCoop no tenía

```text
Generá IMG-M06 (HTML con SVG).
Título: "Lo que se suma a lo que ya hacía ProCoop".
Seis tarjetas con ícono y una línea:
1. "App del empleado: recibos, aprobaciones, casos y vacaciones" (27 ítems)
2. "Comunidad: muro, encuestas, campañas, audiencias y beneficios" (C15)
3. "Institucional con menú propio: asociados, capital, asambleas, actas, INAES" (C13)
4. "Separación de roles y perfiles de pantallas, con alcance por datos"
5. "Consola de plataforma: soporte con caso y acceso auditado" (25 ítems)
6. "Sitio público con pago, reclamos y baja sin ingresar" (34 ítems)
Todo en verde, sin comparar contra ProCoop en rojo.
```

---

## 10. Notas para el presentador

- **Abrir con IMG-M03.** "De las 120 funciones del menú de ProCoop, 119 están; la que falta es la base de datos, que ya no administran ustedes." Es la frase que más tranquiliza a quien conoce ProCoop.
- **Mostrar los roles por las personas reales.** Preguntar "¿quién es el cajero acá?" y mostrar su ficha (IMG-R05 para T-CAJ). Cada uno se reconoce en su pantalla.
- **No prometer pantallas terminadas.** Las maquetas muestran lo especificado: nombres de pantallas y permisos reales, con diseño ilustrativo.
- **Si preguntan por un rol que no ven:** los 40 roles son plantillas; cada cooperativa los copia, los ajusta y les pone sus nombres.
- **Si preguntan por la app de campo de ProCoop:** existe (`PMovil`). La diferencia es que en CoopApps trabaja sin conexión sobre la misma información y con la instalación integral.
