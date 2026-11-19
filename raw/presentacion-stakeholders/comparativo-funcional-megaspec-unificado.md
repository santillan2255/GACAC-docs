# CoopApps — Megaspecificación comparativa ProCoop vs CoopApps (un solo documento)

**Para quién:** consejo y gerencia (columnas legibles), responsables de área (procesos), implementación (columna *Ref.* al final).

| Dato | Valor |
|---|---|
| Versión | 1.1 (textos naturales validados; sin códigos M/T en cuerpo) |
| Fecha | 19-11-2026 |
| Fuente | `comparativo-funcional-procoop-vs-coopapps.md` v1.1 + `scripts/megaspec_natural_texts.py` |
| Imágenes | **IMG-F** — ver `comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md` |

---

## 0. Cómo leer las tres capas (todo en uno)

| Capa | Quién | Qué mirar |
|---|---|---|
| **Operativa** | Caja, técnica, compras, RRHH | *Hoy en ProCoop* y *Con CoopApps* |
| **Gerencial** | Gerencia, consejo | *Cambio* y *Por qué importa* |
| **Técnica** | TI, implementación | *Ref.* (PC-###); §A glosario interno solo si hace falta cruzar con especificación |

### 0.1 Leyenda *Cambio*

| Etiqueta | Significado |
|---|---|
| **Igual** | El negocio sigue igual; cambia pantalla u organización. |
| **Mejor** | Mismo negocio con más control, trazabilidad o canales. |
| **Nuevo** | No estaba en el menú ProCoop; suma capacidad. |
| **Modelo distinto** | Sustituye el mecanismo (ej. backup manual → nube). |
| **No aplica al usuario** | Deja de ser tarea interna de la cooperativa. |

### 0.2 Regla para diapositivas

En la tabla visible **no** van códigos internos (`M16`, `T04`, olas, etc.). Solo oraciones que entiende gerencia y jefes de área. La columna *Ref.* es opcional en PNG.

---

## 1. Transversal: plataforma y canales

| Tema | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa |
|---|---|---|---|---|
| Dónde corre el sistema | Programa en cada PC; servidor propio | Navegador y apps; sin instalar en cada equipo | Modelo distinto | Menos costo de parque y de actualizar. |
| Copias de seguridad | Menú que opera el usuario | Copia automática diaria + restauración probada | Modelo distinto | No depende de que alguien recuerde el backup. |
| Portal del socio | Copia a base aparte (desfasaje posible) | Misma información que ve caja y facturación | Mejor | Menos reclamos por saldos que no coinciden. |
| App de campo | App sobre copia; varias piezas | Una app: técnico, lecturista y cobrador; trabajo sin señal | Mejor | Menos viajes en vano; el socio ve el estado. |
| Parámetros | Miles de claves numéricas | Parámetros con nombre, vigencia e historial | Mejor | No hace falta “el que sabe el número”. |
| Permisos | Perfil = menú + tablas | Rol por acción; plantillas ajustables | Modelo distinto | Menor riesgo de permisos de más. |
| Menú relevado | 120 ítems en 9 pestañas | 119 cubiertos; solo “administrar base” pasa al proveedor | Mejor | No hay módulo sin destino. |

---

## 2. Menú ProCoop: las 120 funciones (lenguaje de negocio)

*Ref.* = trazabilidad implementación. No imprimir en slide salvo pedido explícito.


### 2.1 PC-001…PC-008

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Alerta modal FE pendientes | En ProCoop: Modal bloqueante al inicio | Avisos de comprobantes pendientes en banner y centro de alertas, sin bloquear el inicio. | Mejor | El empleado entra a trabajar sin un modal que lo frene. | PC-001 |
| Grilla comprobantes pendientes autorizar | En ProCoop: Pantalla aparte con exportar | Bandeja para autorizar comprobantes antes de emitir, integrada a los lotes de facturación. | Igual | La autorización fiscal queda en el mismo flujo que la emisión. | PC-002 |
| Centro de notificaciones | En ProCoop: Pantalla principal | Pantalla de inicio con centro de notificaciones unificado. | Igual |  | PC-003 |
| Noticias ProCoop | En ProCoop: opción de menú «Noticias ProCoop» | Novedades del producto y avisos oficiales de la cooperativa al socio y al personal. | Modelo distinto | Los avisos son de la cooperativa, no solo del proveedor del escritorio. | PC-004 |
| Administración de Titulares | En ProCoop: Ficha titular, cuentas, servicios | Ficha única del titular: cuentas, servicios, historial y privacidad entre convivientes. | Mejor | Historial claro y privacidad entre convivientes del mismo domicilio. | PC-005 |
| Administración de Personas | En ProCoop: Personas separadas de titulares | Una sola identidad por persona; control de duplicados de DNI y CUIT. | Mejor | Menos personas duplicadas y menos errores de identificación. | PC-006 |
| Consultas e Informes titulares | En ProCoop: Listados e informes | Consultas e informes de titulares con acceso al documento que originó cada dato. | Igual | Desde el informe se abre el comprobante o gestión de origen. | PC-007 |
| Registro de Lectura | En ProCoop: Carga manual / correcto | Carga de lecturas desde la app de campo con foto, trabajo sin señal y motivo de excepción. | Mejor | El lecturista justifica excepciones con evidencia en campo. | PC-008 |

### 2.2 PC-009…PC-016

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Telemed | En ProCoop: Telemed ST y Operaciones | Administración de telemedición en el mismo circuito que las lecturas. | Igual |  | PC-009 |
| Opciones de consumos | En ProCoop: Validación y estimados | Reglas de validación y estimados; el tercer estimado disparó inspección. | Mejor | Se evita facturar estimados indefinidamente. | PC-010 |
| Opciones de Telefonía | En ProCoop: Tasación / consumos telco | Parámetros de telefonía e internet según reglas de cada servicio. | Igual |  | PC-011 |
| Informes de Consumos | En ProCoop: Informes | Reportes de consumos con el mismo detalle operativo. | Igual |  | PC-012 |
| Presupuestos | En ProCoop: Presupuestos venta | Presupuestos con aceptación online que generan orden de trabajo. | Mejor | El socio acepta el presupuesto sin volver a la oficina. | PC-013 |
| Venta de Productos | En ProCoop: POS / venta productos | Punto de venta de productos en mostrador. | Igual |  | PC-014 |
| Facturación | En ProCoop: Emisión masiva (~12,5k/comp en DEMO) | Emisión masiva por lotes, con prefactura, excepciones visibles y multiservicio. | Mejor | Facturación masiva con control de excepciones y multiservicio. | PC-015 |
| Informes Ventas y Facturación | En ProCoop: Informes | Informes de ventas y facturación desde el centro de reportes. | Igual |  | PC-016 |

### 2.3 PC-017…PC-024

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Libro IVA Ventas | En ProCoop: Libro IVA | Libro IVA ventas digital y enlace a Mis Comprobantes. | Mejor | Cumplimiento fiscal con libro digital. | PC-017 |
| Movimiento de Conceptos | En ProCoop: Movimiento conceptos | Movimiento de conceptos entre tarifas y facturación. | Igual |  | PC-018 |
| Apertura de Caja | En ProCoop: Apertura caja | Apertura de caja diaria con los mismos controles. | Igual |  | PC-019 |
| Cobranza Local | En ProCoop: Cobro en mostrador | Cobro en mostrador con QR y medios mixtos, sin guardar datos de tarjeta. | Mejor | Más medios de cobro sin almacenar tarjeta. | PC-020 |
| Opciones de Cobranza | En ProCoop: Parámetros cobro, entes | Configuración de medios de cobro, pasarelas, débito y conciliación. | Mejor | Integración con pasarelas y conciliación. | PC-021 |
| Informes de Cobranzas | En ProCoop: Informes | Informes de cobranza desde el centro de reportes. | Igual |  | PC-022 |
| Configuración submenú ST | En ProCoop: Subconfig titulares/cobro | Parámetros de titulares y cobranza con nombre, vigencia e historial. | Mejor | Los parámetros se entienden por nombre, no por número. | PC-023 |
| Emitir Plan de Financiación | En ProCoop: Planes de financiación | Planes de financiación con costo total visible y firma del socio en el portal. | Mejor | Transparencia del costo financiero total (CFT). | PC-024 |

### 2.4 PC-025…PC-032

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Informes financiaciones | En ProCoop: Informes | Informes de planes de financiación. | Igual |  | PC-025 |
| Generar Notificaciones (1ª) | En ProCoop: Notificaciones mora | Primera notificación de mora con constancia de entrega por varios canales. | Mejor | Prueba de que la notificación llegó al socio. | PC-026 |
| Tratamiento Notificaciones Generadas | En ProCoop: Bandeja notificaciones | Bandeja de notificaciones generadas y su seguimiento. | Igual |  | PC-027 |
| Tratamiento de Morosos | En ProCoop: Gestión morosos | Gestión de morosos con un único cálculo de intereses. | Mejor | Un solo criterio de intereses en toda la cooperativa. | PC-028 |
| Notificaciones | En ProCoop: Comunicaciones mora | Comunicaciones de mora por mail, SMS y otros canales configurados. | Mejor |  | PC-029 |
| Causas de Baja | En ProCoop: Tabla causas | Tabla de causas de baja de servicio. | Igual |  | PC-030 |
| Instancias de Mora | En ProCoop: Config instancias | Etapas de mora configurables; el corte no se ejecuta solo desde escritorio. | Mejor | El corte requiere confirmación en campo o red. | PC-031 |
| Excepciones de Mora | En ProCoop: Excepciones | Excepciones de mora (electrodependientes, ventanas legales, etc.). | Mejor | Respeto a normas y casos especiales. | PC-032 |

### 2.5 PC-033…PC-040

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Informes de Mora | En ProCoop: Informes | Informes de mora y gestión de cobranza. | Igual |  | PC-033 |
| Factibilidades | En ProCoop: Operaciones > Técnica | Estudios de factibilidad con vigencia de noventa días y cobertura de red. | Mejor | El técnico no instala sobre un estudio vencido. | PC-034 |
| Órdenes | En ProCoop: opción de menú «Órdenes» | Órdenes de trabajo en oficina y en campo; el socio ve el estado. | Mejor | El socio deja de llamar para preguntar si vino el técnico. | PC-035 |
| Carga Rápida de Reclamos | En ProCoop: Reclamos rápidos | Carga rápida de reclamos con expediente y plazos de respuesta. | Mejor | Reclamos con plazo y expediente único. | PC-036 |
| Informes Técnica | En ProCoop: Informes | Informes del área técnica. | Igual |  | PC-037 |
| Telemed Administración | En ProCoop: Operaciones > Telemed | Administración de telemedición operativa. | Igual |  | PC-038 |
| Telemed Informes | En ProCoop: Informes telemed | Informes de telemedición. | Igual |  | PC-039 |
| Telemed Configuración | En ProCoop: Config telemed | Configuración de telemedición y parámetros asociados. | Igual |  | PC-040 |

### 2.6 PC-041…PC-048

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Vivienda Materiales | En ProCoop: Operaciones > Vivienda | Planes de vivienda — materiales y vales por etapa. | Mejor |  | PC-041 |
| Vivienda Construcción | En ProCoop: Construcción vivienda | Planes de vivienda — obra y seguimiento de construcción. | Mejor |  | PC-042 |
| Vivienda Informes | En ProCoop: Informes | Informes de planes de vivienda. | Igual |  | PC-043 |
| Solicitudes Aprovisionamiento | En ProCoop: Compras | Solicitudes de compra con circuito formal y separación de funciones. | Mejor | Quien compra no es quien aprueba solo. | PC-044 |
| Solicitudes Cotización | En ProCoop: Cotizaciones | Solicitudes de cotización a proveedores. | Igual |  | PC-045 |
| Órdenes de Compra | En ProCoop: opción de menú «Órdenes de Compra» | Órdenes de compra. | Igual |  | PC-046 |
| Remitos | En ProCoop: opción de menú «Remitos» | Remitos de ingreso y salida. | Igual |  | PC-047 |
| Comprobantes Proveedores | En ProCoop: Facturas compra | Facturas de proveedores con comparación en tres vías; la IA sugiere borrador. | Mejor | Menos carga manual al cargar facturas de proveedor. | PC-048 |

### 2.7 PC-049…PC-056

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Pago a Proveedores | En ProCoop: Pagos | Pagos a proveedores bloqueados si hay una excepción abierta. | Mejor | No se paga si hay una excepción sin resolver. | PC-049 |
| Retenciones compras | En ProCoop: Retenciones | Retenciones en compras vinculadas al módulo fiscal. | Igual |  | PC-050 |
| Stock Movimientos | En ProCoop: Movimientos stock | Movimientos de stock con custodia por cuadrilla. | Mejor | El material queda asignado a la cuadrilla correcta. | PC-051 |
| Trazabilidad | En ProCoop: opción de menú «Trazabilidad» | Trazabilidad por número de serie (módem, ONU, etc.). | Mejor | Se sabe qué equipo está en qué domicilio. | PC-052 |
| Operaciones Especiales | En ProCoop: Op. especiales | Operaciones especiales de stock. | Igual |  | PC-053 |
| Bienes de Uso | En ProCoop: opción de menú «Bienes de Uso» | Registro de bienes de uso. | Igual |  | PC-054 |
| Fabricación | En ProCoop: opción de menú «Fabricación» | Órdenes de fabricación. | Igual |  | PC-055 |
| RMA | En ProCoop: opción de menú «RMA» | Gestión de garantías y devoluciones (RMA). | Igual |  | PC-056 |

### 2.8 PC-057…PC-064

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Informes Compras | En ProCoop: Informes | Informes de compras. | Igual |  | PC-057 |
| Informes Stock | En ProCoop: Informes | Informes de stock y depósitos. | Igual |  | PC-058 |
| Libro IVA Compras | En ProCoop: En menú compras | Libro IVA compras en el módulo fiscal. | Igual | Reubicado en fiscal | PC-059 |
| Informes Correspondencia | En ProCoop: Correspondencia | Informes de correspondencia con proveedores. | Igual |  | PC-060 |
| Movimientos Bancarios | En ProCoop: Tesorería bancos | Movimientos bancarios con conciliación asistida. | Mejor | La conciliación bancaria es más rápida. | PC-061 |
| Cuentas Propias | En ProCoop: Cuentas | Cuentas bancarias propias de la cooperativa. | Igual |  | PC-062 |
| Movimientos Tesorería | En ProCoop: Movimientos | Movimientos de tesorería distinguiendo fondos en tránsito y disponibles. | Mejor | Se distingue plata en tránsito de plata disponible. | PC-063 |
| Valores de Terceros | En ProCoop: Valores terceros | Valores de terceros en custodia. | Igual |  | PC-064 |

### 2.9 PC-065…PC-072

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Cheques Propios | En ProCoop: Cheques | Emisión de cheques propios, incluido cheque electrónico. | Mejor | Cheque electrónico donde la norma lo permita. | PC-065 |
| Cupones de Tarjetas | En ProCoop: Cupones | Cupones de tarjetas de crédito y débito. | Igual |  | PC-066 |
| Retenciones Recibidas | En ProCoop: Retenciones | Retenciones recibidas. | Igual |  | PC-067 |
| Cajas Pagos a Proveedores | En ProCoop: Cajas pagos | Cajas de pago a proveedores. | Igual |  | PC-068 |
| Cierre de Cajas | En ProCoop: Cierre cajas | Cierre de cajas con arqueo. | Igual |  | PC-069 |
| Informes Tesorería | En ProCoop: Informes | Informes de tesorería. | Igual |  | PC-070 |
| Empleados | En ProCoop: Sueldos > Empleados | Legajos de empleados y datos laborales. | Igual |  | PC-071 |
| Empresas | En ProCoop: Empresas empleadoras | Empresas empleadoras y datos asociados. | Igual |  | PC-072 |

### 2.10 PC-073…PC-080

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Recibos | En ProCoop: Recibos impresos | Recibos digitales; el empleado firma desde su espacio personal. | Mejor | El empleado conforma el recibo digitalmente. | PC-073 |
| Liquidación Masiva | En ProCoop: Liquidación | Liquidación masiva con control: quien calcula no aprueba. | Mejor | Control interno en liquidaciones sensibles. | PC-074 |
| Simulador | En ProCoop: opción de menú «Simulador» | Simulador de liquidación antes del cierre. | Igual |  | PC-075 |
| Impuesto a las Ganancias | En ProCoop: Ganancias | Liquidación y presentación del impuesto a las ganancias (4.ª categoría). | Igual |  | PC-076 |
| Variables | En ProCoop: opción de menú «Variables» | Variables de liquidación con parámetros con nombre y vigencia, sin claves numéricas. | Igual |  | PC-077 |
| Conceptos | En ProCoop: opción de menú «Conceptos» | Conceptos de haberes y descuentos en pantallas web. | Igual |  | PC-078 |
| Aplicar Aumentos | En ProCoop: Aumentos | Aplicación masiva de aumentos sobre la nómina. | Igual |  | PC-079 |
| Informes de Sueldos | En ProCoop: Informes | Informes de sueldos desde el centro de reportes. | Igual |  | PC-080 |

### 2.11 PC-081…PC-088

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Libro sueldo digital (off en DEMO) | En ProCoop: Deshabilitado en DEMO | Libro Sueldo Digital habilitado y presentación ante ARCA. | Mejor | Libro sueldo operativo aunque en la DEMO estuviera apagado. | PC-081 |
| Asientos | En ProCoop: Contabilidad manual/auto | Asientos contables generados automáticamente desde facturación, cobranza y compras. | Mejor | Menos asientos manuales desde caja y compras. | PC-082 |
| Consultar Mayor | En ProCoop: Mayor | Consulta del libro mayor. | Igual |  | PC-083 |
| Balance / Sumas y Saldos | En ProCoop: Estados | Balance y sumas y saldos. | Igual |  | PC-084 |
| Asientos Automáticos | En ProCoop: Automáticos | Reglas de asientos automáticos: un asiento por operación, sin duplicar. | Mejor | No se duplican asientos por la misma operación. | PC-085 |
| Herramientas contables | En ProCoop: Utilidades | Utilidades contables (cerrar períodos, reprocesos, etc.). | Igual |  | PC-086 |
| Informes Contables | En ProCoop: Informes | Informes contables. | Igual |  | PC-087 |
| Informes de Gestión | En ProCoop: Gestión | Informes de gestión para dirección. | Igual |  | PC-088 |

### 2.12 PC-089…PC-095

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Contabilidad paralela convivencia | En ProCoop: opción de menú «Contabilidad paralela convivencia» | Contabilidad en paralelo con ProCoop durante la migración, sin romper el ejercicio. | Nuevo | Migrar contabilidad sin cortar el ejercicio. | — |
| Actividades Seguimiento | En ProCoop: Actividades | Seguimiento de actividades con circuitos de aprobación. | Igual |  | PC-089 |
| Actividades Informe | En ProCoop: Informe actividades | Informe de actividades en curso. | Igual |  | PC-090 |
| SMS | En ProCoop: SMS aislado | Envío de SMS integrado a comunicaciones multicanal (mail, avisos, campañas). | Mejor | Un solo canal para avisos, no solo SMS aislado. | PC-091 |
| Tablero de Control | En ProCoop: Tablero | Tablero de control con indicadores que coinciden con los reportes oficiales. | Mejor | Los números del tablero coinciden con los de gerencia. | PC-092 |
| Traslados Viajes | En ProCoop: Traslados | Traslados y viajes con flota integrada. | Mejor | Flota integrada | PC-093 |
| Traslados Informes | En ProCoop: Informes | Informes de traslados y viajes. | Igual |  | PC-094 |
| Turnero Box | En ProCoop: Box | Configuración de boxes del turnero presencial. | Igual |  | PC-095 |

### 2.13 PC-096…PC-103

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Turnero | En ProCoop: Turnero presencial | Turnos presenciales y reserva online para el socio. | Mejor | El socio reserva turno desde el celular. | PC-096 |
| Selección de Turnos | En ProCoop: Selección | Selección de turnos en mostrador y en tótem de autogestión. | Mejor | Turnos en tótem sin intervención del cajero. | PC-097 |
| Estadísticas Turnero | En ProCoop: Estadísticas | Estadísticas de uso del turnero. | Igual |  | PC-098 |
| Mesa Entradas Administración | En ProCoop: Mesa entradas | Administración de la mesa de entradas (tipos, prioridades, etc.). | Mejor |  | PC-099 |
| Mesa Entradas Incidentes | En ProCoop: Incidentes | Gestión de incidentes masivos; nombre del trámite configurable. | Mejor | Un corte masivo no abre miles de expedientes iguales. | PC-100 |
| Mesa Entradas Informes | En ProCoop: Informes | Informes de la mesa de entradas. | Igual |  | PC-101 |
| Usuarios | En ProCoop: opción de menú «Usuarios» | Usuarios del sistema con doble factor de autenticación. | Mejor | Acceso más seguro que solo usuario y contraseña. | PC-102 |
| Perfiles | En ProCoop: Menú + tablas | Roles por acción y conjuntos de pantallas, no solo por menú. | Modelo distinto | Permisos granulares y menos riesgo. | PC-103 |

### 2.14 PC-104…PC-111

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Auditoría Logueo | En ProCoop: Auditoría login | Auditoría de ingresos y de cambios en datos sensibles. | Mejor | Trazabilidad ante auditoría. | PC-104 |
| Copia de Seguridad | En ProCoop: Manual usuario | Copias de seguridad automáticas y exportación completa de los datos de la cooperativa. | Modelo distinto | Sin depender de que alguien haga backup a mano. | PC-105 |
| Base de Datos | En ProCoop: Menú (a veces off) | Administración de base de datos: la realiza el proveedor de la nube (no es menú del usuario). | No aplica al usuario | La cooperativa no administra servidores SQL. | PC-106 |
| Actualizar | En ProCoop: Actualizar.exe | Actualizaciones continuas sin ejecutar instalador en cada PC. | Modelo distinto | Todos en la misma versión sin visitar cada PC. | PC-107 |
| Tablas del sistema | En ProCoop: Tablas dominio | Tablas maestras con aviso de «en uso por» antes de borrar. | Mejor | Evita borrar tablas que aún usa otro proceso. | PC-108 |
| Parámetros del Sistema | En ProCoop: Numéricos | Parámetros del sistema con nombre, tipo, vigencia e historial. | Mejor | Cambios de parámetro rastreables. | PC-109 |
| Parámetros Externos | En ProCoop: Parámetros ext. | Parámetros de integraciones externas en bóveda segura. | Mejor | Credenciales externas fuera del código fuente. | PC-110 |
| Autorización Operaciones | En ProCoop: Supervisor puntual | Circuitos de autorización por monto, doble firma y bandeja unificada. | Mejor | Aprobaciones escalables por monto y rol. | PC-111 |

### 2.15 PC-112…PC-119

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| WEB Requisitos y Trámites | En ProCoop: Procoop WEB | Trámites web del socio, requisitos y bandeja del operador. | Mejor | Trámites web alineados con atención en mostrador. | PC-112 |
| WEB Archivos | En ProCoop: Archivos web | Archivos publicados en el portal del socio. | Igual |  | PC-113 |
| WEB Operaciones | En ProCoop: Pagos web config | Configuración de operaciones web; el pago se confirma antes de imputar. | Mejor | El pago web no se imputa hasta estar confirmado. | PC-114 |
| Logos facturas WEB | En ProCoop: Logos PDF web | Logos y marca de la cooperativa en facturas PDF y todos los canales. | Mejor | Marca propia en factura, portal y app. | PC-115 |
| Editor Reportes | En ProCoop: Editor | Editor de reportes personalizados. | Igual |  | PC-116 |
| Informes Personalizados | En ProCoop: Informes pers. | Informes pesados ejecutados en segundo plano. | Mejor | Reportes grandes sin trabar la pantalla. | PC-117 |
| Procesos Personalizados | En ProCoop: Procesos | Procesos personalizados vinculados a informes y autorizaciones. | Mejor |  | PC-118 |
| Exportar/Imprimir listados | En ProCoop: Exportar grillas | Exportar e imprimir cualquier listado desde un menú único. | Igual |  | PC-119 |

### 2.16 PC-120…PC-120

| Función (menú ProCoop) | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa | Ref. |
|---|---|---|---|---|---|
| Personalización formularios | En ProCoop: Forms custom | Personalización de pantallas con vistas guardadas (sustituye formularios a medida del escritorio). | Modelo distinto | Menos mantenimiento que formularios WinForms custom. | PC-120 |


---

## 3. Áreas de negocio CoopApps (más allá del menú escritorio)

| Área | Hoy en ProCoop (cómo se resuelve) | Con CoopApps | Cambio | Por qué importa |
|---|---|---|---|---|
| Socios y titulares | Muchas pantallas en “Servicios a Titulares” | Ficha única, historial y privacidad entre convivientes | Mejor | Menos duplicados de persona y menos reclamos por datos desactualizados. |
| Catálogo de servicios | Tablas dispersas | Cada servicio con reglas propias (17 familias) sin programar | Mejor | Electricidad, gas y sepelio no comparten la misma “casilla”. |
| Lecturas y facturación | Lectura → factura con saltos | Trazabilidad de la lectura hasta el comprobante | Mejor | Explicar el importe sin abrir cinco programas. |
| Caja y pagos web | Agente y sincronización indirecta; tarjeta en tablas | Pago confirmado antes de imputar y reconectar | Mejor | Menos errores de cobro y menos riesgo de datos de tarjeta. |
| Mora y cortes | Varios menús | Un solo cálculo de intereses; corte solo si está confirmado en campo | Mejor | Cumplir norma sin cortes “fantasma”. |
| Técnica y campo | Operaciones + app móvil sobre copia | Órdenes con mapa; una sola app; estado visible al socio | Mejor | Menos llamadas “¿vino el técnico?”. |
| Compras y stock | Circuito en menú Compras | Portal proveedor; bloqueo si hay excepción; serie del módem o ONU | Mejor | Saber qué equipo está en qué domicilio. |
| Contabilidad y sueldos | Menús propios; libro sueldo a veces apagado | Asientos desde operaciones; libro digital habilitado; sueldos con controles de aprobación | Mejor | Menos reprocesos entre áreas. |
| Portal y marca | CoopOnline genérico | App y portal con logo y colores de la cooperativa | Mejor | El socio reconoce “su” cooperativa. |

---

## 4. Los 17 servicios que la cooperativa puede prestar

| Servicio | Hoy en ProCoop | Con CoopApps | Cambio |
|---|---|---|---|
| Electricidad | Sí (visto en DEMO) | Reglas de electrodependencia, generación distribuida y ventanas de corte | Mejor |
| Gas | Sí | Reconexión con inspección cuando corresponde | Mejor |
| Agua | Sí | Mínimo vital y reglas específicas | Mejor |
| Cloacas | Sí | No asumir “tiene agua = tiene cloaca” | Igual |
| Internet / TV / Teléfono | Tablas + técnica | Misma ficha con aprovisionamiento de red | Mejor |
| Alumbrado público | En factura | Bloque y rendición separados | Igual |
| Obras / contribución | Cuotas en factura | Cuotas con ajuste en la última | Igual |
| Sepelio | Tablas | Urgencias no bloqueadas solo por deuda | Mejor |
| Cementerio / parque | Tablas | Mora no libera la unidad sin regla clara | Mejor |
| Vivienda | Menú planes | Etapas, vales y seguimiento | Mejor |
| Capital social | Tablas | Integrado al pago en factura | Mejor |
| Salud / ambulancias / sangre | Tablas | Administración sin fingir clínica | Mejor |
| Tasas de terceros | En comprobante | Bloque separado y rendición | Igual |
| Otros (ortopedia, etc.) | Parcial | Configurable por familia de servicio | Mejor |

---

## 5. Lo que suma CoopApps aunque no tenga botón en ProCoop

| Capacidad | Hoy | Con CoopApps | Cambio |
|---|---|---|---|
| Sitio público por bloques | Web genérica del proveedor | Dominio propio, borrador/publicación | Nuevo |
| Asamblea con quórum en vivo | Actas manuales | Credencial y quórum en tiempo real | Nuevo |
| Incidente masivo (corte zona) | Miles de reclamos duplicados | Un incidente, muchos socios vinculados | Nuevo |
| Bóveda de credenciales | Claves en el programa | Credenciales segregadas prueba/producción | Nuevo |
| Indicadores iguales en todos lados | Excel distinto al tablero | Mismo número certificado en portal y gerencia | Nuevo |
| Caso de soporte | Acceso remoto sin número | Caso numerado y auditado | Nuevo |

---

## A. Glosario técnico (no usar en slides)

| Código interno | Nombre legible |
|---|---|

| M01 | Socios y titulares |
| M02 | Catálogo de servicios |
| M03 | Lecturas y consumos |
| M04 | Tarifas |
| M05 | Facturación |
| M06 | Fiscal y comprobantes electrónicos |
| M07 | Caja y cobranza |
| M08 | Financiación y mora |
| M09 | Atención, reclamos y turnos |
| M10 | Técnica y órdenes de trabajo |
| M11 | Presupuestos y ventas |
| M12 | Compras y proveedores |
| M13 | Stock y depósitos |
| M14 | Tesorería |
| M15 | Contabilidad |
| M16 | Sueldos y liquidaciones |
| M17 | Institucional y asambleas |
| M18 | Vivienda, sepelio y flota |
| M19 | Portal y app del socio |
| T01 | Plataforma en la nube |
| T02 | Usuarios y permisos |
| T03 | Marca y experiencia de uso |
| T04 | Parámetros del sistema |
| T05 | Modelo de datos |
| T06 | Integraciones externas |
| T07 | Migración desde procoop |
| T08 | Seguridad y cumplimiento |
| T09 | Comunicaciones al socio |
| T10 | Informes y tableros |
| T11 | Aprobaciones y autorizaciones |
| T12 | Reglas por tipo de servicio |

---

## B. Documentos relacionados

| Archivo | Rol |
|---|---|
| `comparativo-funcional-megaspec-unificado.md` | **Esta megaspec** — gerencia + operación + ref. |
| `comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md` | Prompt para generar **IMG-F** sin códigos |
| `scripts/megaspec_natural_texts.py` | Textos «Con CoopApps» por función (mantenimiento) |
| `comparativo-funcional-procoop-vs-coopapps.md` | Detalle técnico con códigos (respaldo) |
| `lo-nuevo-coopapps-vs-procoop-PROMPT-COMPLETO-CLAUDE.md` | Deck **IMG-N**: más aplicativos y capacidades vs legacy |
