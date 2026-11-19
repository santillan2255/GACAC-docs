# GoodApps Cooperativas

## Análisis de brechas ProCoop → GoodApps (artefacto 2.3)

| Campo | Valor |
|---|---|
| Artefacto | 2.3 Análisis de brechas ProCoop → GoodApps (índice de entregables `00-INDICE.md`) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión funcional |
| Deriva de | `00-ESPECIFICACION-MAESTRA.md` §1.3 (P9), §4.3, §4.4 y §17 · `01-registro-decisiones.md` · `04-matriz-trazabilidad.md` v1.1 §3 y §4 · anexo T07 §19 y §20 · anexos M01–M19 y T01–T12 · relevamiento de ProCoop (`procoop-relevamiento/README.md`, solo para identificar funciones) |
| Prevalencia | Ante cualquier diferencia prevalece la especificación. Este documento no crea requisitos ni decisiones. |

### Control de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 05-11-2026 | Versión inicial: brechas por dominio, resumen de T07 y de la matriz 04, 26 brechas de fuente e impactos por rol |

### Aprobaciones

| Rol | Nombre | Fecha | Firma |
|---|---|---|---|
| Responsable funcional de la cooperativa piloto | A definir | — | — |
| Líder de análisis GoodApps | A definir | — | — |

---

## Índice

1. Propósito, alcance y criterios
2. Resumen ejecutivo
3. Brechas por dominio
4. Qué no migra: resumen cuantitativo de T07
5. Cobertura de fuentes: resumen de la matriz 04 y las 26 brechas de fuente
6. Impactos en la gestión del cambio por rol
7. Hallazgos y recomendaciones
8. Relación con otros entregables
9. Fuentes consultadas

---

## 1. Propósito, alcance y criterios

### 1.1 Propósito

Este documento compara lo que la cooperativa hace hoy con ProCoop con lo que hará con GoodApps, dominio por dominio, para que la conducción y cada área sepan **qué se conserva, qué cambia, qué deja de existir y qué es nuevo**, y con qué decisión se fundamenta cada cambio. Es insumo directo del plan de capacitación y gestión del cambio ([`08-plan-puesta-en-marcha.md`](08-plan-puesta-en-marcha.md), artefacto 8.4) y de la validación con el cliente.

### 1.2 Punto de partida

- **Todo lo que hace ProCoop está en alcance, mejorado** (DEC-007; maestra §1.3 principio P9). Ningún módulo de ProCoop se pierde; los 29 módulos se reagrupan en los anexos M01–M19 y T01–T11 (maestra §4.3).
- Lo único que no se replica son las **deudas técnicas y de seguridad** de ProCoop, que se reemplazan por la mejora indicada en cada anexo (maestra §4.4).
- ProCoop se toma como **referencia funcional**: la descripción de "ProCoop hoy" proviene del menú relevado en la base de demostración (REL, `procoop-relevamiento/README.md` §1), de la definición funcional (DFA) y del catálogo de tablas (CAT, vía T07 §19). No se transcriben datos de la base ni código.

### 1.3 Tipos de brecha

| Tipo | Criterio |
|---|---|
| **Se mantiene** | GoodApps ofrece una función equivalente. Cambia la tecnología y la interfaz, pero la tarea del usuario es esencialmente la misma |
| **Cambia** | La función existe en ProCoop pero GoodApps la rediseña: cambia una regla, un circuito, un momento o una responsabilidad. Se cita la decisión (DEC) o la contraposición (CTR) que lo fundamenta o, si no hay una decisión específica, el anexo o la regla que define el rediseño |
| **Se elimina** | La función, el mecanismo o los datos de ProCoop no pasan a GoodApps: se descartan por obsoletos o se reemplazan por un mecanismo de plataforma (T07 §19, estrategia "No migrar") |
| **Nuevo** | GoodApps incorpora una capacidad que no tiene equivalente relevado en ProCoop |

---

## 2. Resumen ejecutivo

| Tipo | Brechas | % |
|---|---:|---:|
| Se mantiene | 24 | 18,0 % |
| Cambia | 66 | 49,6 % |
| Se elimina | 16 | 12,0 % |
| Nuevo | 27 | 20,3 % |
| **Total** | **133** | **100 %** |

Cada fila de las tablas de la sección 3 es una brecha. Los porcentajes están redondeados a un decimal.

Ideas principales:

- **Casi la mitad de las brechas son cambios de regla o de circuito**, no de alcance. La mayoría se fundamenta en una DEC o una CTR; el resto, en la mejora que define el anexo dueño al reemplazar una deuda técnica de ProCoop (principio P9). Los más visibles para el usuario son la factura separada por servicio como modalidad por defecto (DEC-034), la reconexión automática al pagar (DEC-014), la imputación de pagos por antigüedad (DEC-048), la prescripción por tipo de obligación (DEC-052) y la contabilidad temprana en un plan no oficial durante la convivencia (DEC-009, DEC-069).
- **Lo que se elimina es infraestructura de ProCoop, no funciones de negocio**: motor de pantallas, menú por reflexión, parámetros sin semántica, módems GSM, sincronización con la base web, tablas temporales y credenciales guardadas en tablas. De las 659 tablas de ProCoop, 582 migran (471 vivas y 111 como histórico) y 77 no se cargan, aunque todas quedan en el archivo de la migración (T07 §19.32; RN-MIG-003).
- **Lo nuevo se concentra en la relación con el socio y en el gobierno del dato**: plataforma multicooperativa, portal y app nativos con marca, comunidad editorial, workflow con bandeja de tareas, firma electrónica, API para terceros, almacén BI, corrida paralela y ambientes de prueba anonimizados.
- **La cobertura de las fuentes es del 98,0 %** (2.201 unidades). Quedan 26 brechas de fuente sin cita: 9 se resuelven declarándolas descartadas, 8 agregando la cita de un contenido que ya existe y 9 requieren completar contenido o reconocer un límite de la fuente. Las de mayor impacto son B-05, B-13, B-14, B-26 y B-01 (sección 5).

---

## 3. Brechas por dominio

### 3.1 Plataforma, instalación y operación

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Plataforma | Aplicación de escritorio instalada en cada puesto, con actualización manual desde el menú Configuración | Plataforma SaaS web y PWA, en contenedores, con actualizaciones centralizadas y alojamiento en AWS sa-east-1 | Cambia | Se accede por navegador o celular; desaparecen las instalaciones y actualizaciones por puesto | DEC-001, DEC-004, DEC-062; maestra §4.4; REL §1 |
| Plataforma | Una base de datos por cooperativa | Base única compartida con `tenantId` obligatorio y aislamiento verificado en cada cambio de código | Cambia | Transparente para el usuario; el soporte del proveedor no ve datos sin acceso temporal consentido | DEC-002; CTR-GLB-02; T01 |
| Plataforma | Copia de seguridad local desde el menú Configuración | Respaldo gestionado con RPO ≤ 15 min y restauración por cooperativa | Cambia | El área de sistemas deja de hacer y custodiar copias | DEC-063; T01; REL §1 |
| Plataforma | Cada cooperativa es una instalación separada, administrada por el proveedor | Consola de plataforma: ciclo de vida de la cooperativa, licencias por módulo, alta asistida, salud y capacidad | Nuevo | La cooperativa habilita módulos por licencia y activación; el alta sigue un checklist | T01; maestra §6 |
| Plataforma | Sin evidencia relevada de ambientes de prueba separados | Ambiente de prueba por cooperativa con datos anonimizados | Nuevo | Capacitación y ensayos sin exponer datos reales de socios | T07 §9.10; AGR-035 |
| Plataforma | Varias empresas administradas en la tabla `EMPRESAS` (visible en Sueldos) | Entidades jurídicas del tenant (`legalEntities`) con emisión, contabilidad y sueldos por entidad desde O0 | Cambia | Cada documento económico indica su entidad; la cuenta corriente se lleva por titular y entidad | DEC-064, DEC-087 |
| Plataforma | Bloqueo de edición concurrente por filas (`BLOQUEO_FILAS`) | Control optimista de versiones | Se elimina | El usuario recibe aviso de conflicto en lugar de quedar bloqueado | T07 §19.29 |

### 3.2 Seguridad, identidad y auditoría

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Seguridad | Contraseñas reversibles y usuario SQL compartido | Contraseñas con hash fuerte, identidad individual y doble factor para el personal | Cambia | Cada persona tiene su usuario; 2FA obligatorio para el personal; las contraseñas no migran y se activan de nuevo (PA-MIG-07) | CTR-GLB-12; T02; T08 |
| Seguridad | Permisos por formulario, menú y perfil; alcance por área, depósito y punto de venta | Capabilities `modulo.recurso.accion`, 40 roles plantilla, alcance de datos, separación de funciones y franja horaria | Cambia | Los perfiles actuales se convierten en roles con una propuesta de mapeo revisada por una persona | Maestra §7; T02; T07 §19.27 |
| Seguridad | Autorización de operaciones como función del menú Configuración | Autorización de supervisor en el momento o diferida, dentro del workflow, con auditoría | Cambia | Los supervisores aprueban desde su bandeja de tareas | Maestra §7.1; T11 |
| Seguridad | Auditoría de logueo | Auditoría inmutable de cambios, accesos, lecturas, mensajes e IA | Cambia | El síndico y la gerencia consultan la historia completa de cada operación | T02; maestra P5 |
| Seguridad | Credenciales de servicios web, Interbanking y correo guardadas en tablas | Bóveda de secretos con cifrado por sobre y clave maestra en KMS | Cambia | La cooperativa vuelve a cargar sus credenciales; nunca se copian desde ProCoop | DEC-074; CTR-MIG-08; RN-MIG-013 |
| Privacidad | Sin gestión explícita de consentimientos relevada | Consentimientos, finalidad, derechos del titular, retención y anonimización (Ley 25.326) | Nuevo | Atención registra consentimientos y atiende pedidos de acceso o supresión | T08; DEC-076 |

### 3.3 Configuración y experiencia

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Configuración | 1.536 parámetros numéricos en una tabla clave/valor sin semántica | Parámetros tipados, con nombre, vigencia, versión y publicación | Cambia | La configuración se entiende sin conocer números de parámetro; los valores se revisan al migrar | CTR-GLB-10; T04; T04b |
| Configuración | Motor de pantallas propio: entidades, columnas, condiciones, criterios y columnas con SQL embebido | Vistas y filtros guardados sobre componentes estándar; el SQL embebido no se ejecuta | Se elimina | Las vistas personalizadas se rehacen; se pierden las personalizaciones de formularios | T07 §19.28 |
| Configuración | Menú construido por reflexión sobre el código | Mapa del sitio, menú y editor de roles generados desde una única declaración | Cambia | El menú muestra solo lo que el rol puede usar | Maestra §4.4, §10; T03 |
| Configuración | Tablas propias de países, provincias, tipos de documento y estados civiles | Tablas comunes de plataforma | Se elimina | La cooperativa deja de mantenerlas | T07 §19.30 |
| Experiencia | Textos fijos en las pantallas (solo CoopOnline tenía textos configurables) | Diccionario de términos por cooperativa con variantes por canal | Nuevo | Cada cooperativa usa su vocabulario (socio, usuario, asociado; suministro, conexión) | BASE §65; T03; maestra §11 |
| Experiencia | Interfaz de escritorio única | Admin web denso, PWA con marca de la cooperativa en tiempo de ejecución, accesibilidad WCAG 2.2 AA | Nuevo | Socios y personal de campo usan el celular con la identidad visual de su cooperativa | T03; maestra §11 |

### 3.4 Personas, titulares y cuentas

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Personas | Administración de titulares y de personas, ficha del titular | Personas, titulares, cuentas, inmuebles y ficha 360 | Se mantiene | Mismas tareas, con vista integrada de servicios, deuda y gestiones | M01; DFA Módulo 3; REL §2 |
| Personas | Numeración de titulares propia de cada instalación | Secuencia única por cooperativa con atributo de tipo; número manual solo en la migración | Cambia | Los números de ProCoop se conservan como alias | DEC-017 |
| Personas | Personas que pueden repetirse | Documento único por cooperativa, con excepción aprobada y auditada; deduplicación asistida al migrar | Cambia | Atención resuelve duplicados en la etapa de saneamiento | DEC-044; PA-MIG-10; CTR-MIG-11 |
| Personas | Cambio de titularidad según práctica de cada cooperativa | La deuda queda en el titular saliente; el nuevo solo la asume por convenio | Cambia | Regla única y explicable al socio | DEC-045 |
| Personas | Deuda previa del domicilio tratada según práctica local | Advertencia con autorización opcional; nunca bloqueo ni traslado de deuda | Cambia | La atención no puede negar el alta por deuda de terceros | DEC-029 |
| Personas | Adherentes y beneficiarios en tablas de socios y servicios | Dueño único en M18; los beneficiarios no son tarifa social | Cambia | Un solo lugar para gestionar el grupo familiar | DEC-071, DEC-086 |
| Personas | Domicilios cargados como texto | Domicilios normalizados con Georef y mapa con Google Maps | Cambia | Altas con autocompletado y georreferencia | DEC-046; PA-MIG-12 |

### 3.5 Catálogo de servicios y contratos

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Catálogo | Servicios, categorías, conexiones y subservicios | Jerarquía servicio → producto → plan versionado → conceptos facturables, publicada con aprobación de otro usuario | Cambia | Los cambios de oferta tienen doble control y vigencia | DEC-012, DEC-021 |
| Catálogo | El servicio se registra cuando se concreta el alta | El contrato nace al admitir la solicitud, en estado Solicitado | Cambia | La solicitud y el contrato se siguen como un mismo recorrido | DEC-011 |
| Catálogo | Altas de conceptos asociados según configuración | Altas automáticas solo con fundamento normativo; las opcionales se proponen con consentimiento | Cambia | Atención explica y registra el consentimiento | DEC-023 |
| Catálogo | Cambios de plan y suspensiones según práctica | Cambio de plan al próximo período (inmediato con prorrateo si se habilita); suspensión voluntaria configurable | Cambia | Reglas visibles para el socio en el portal | DEC-031, DEC-032 |
| Catálogo | Activación del servicio registrada manualmente | Activación por confirmación técnica de instalación y aprovisionamiento, con revisión posterior del supervisor | Cambia | El abono comienza en la activación efectiva | DEC-033 |
| Catálogo | Equipos entregados al socio | Modalidad configurable por plan; comodato por defecto en Internet y TV, valorizado en stock | Cambia | Depósito y técnica registran cada equipo por número de serie | DEC-013 |

### 3.6 Medición y consumos

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Medición | Registro de lecturas, telemedición, opciones e informes de consumos | Medidores, rutas, lotes, validación de consumos, telemedición AMI/MDM | Se mantiene | Mismas tareas, con validación por supervisor y correcciones justificadas | M03; DFA Módulos 5 y 6; REL §3 |
| Medición | Planillas de lecturas a importar y exportación a colectoras | App de lecturista sin conexión con cola idempotente | Cambia | El lecturista carga en el celular; no hay archivos de ida y vuelta | T07 §19.3; CNX §3.7 |
| Medición | Corrección de volumen de gas en el circuito de consumos | La corrección la aplica el motor tarifario con sus factores; medición entrega el volumen medido | Cambia | El supervisor de consumos deja de corregir volúmenes | DEC-085 |
| Medición | Generación distribuida según configuración | Régimen configurable con compensación monetaria por defecto (Ley 27.424) | Cambia | Factura con el detalle de inyección y compensación | DEC-060 |
| Medición | Energía prepaga con recargas, incluidas las online | Prepago en O7 con recarga por portal | Se mantiene | Continuidad del canal más usado online por la cooperativa piloto | M03; DEC-088; brecha B-26 |
| Medición | Sin control de calidad del agua relevado | Puntos de muestreo, muestras, laboratorio y acciones correctivas, habilitable por concesión | Nuevo | El responsable de calidad registra resultados con protocolo adjunto | M10 §5.20; PA-TEC-20 |
| Medición | Autolectura no relevada | Autolectura del socio desde el portal y facturación in situ | Nuevo | El socio informa su lectura; la cooperativa la valida | M03; PRO-O7-05 |

### 3.7 Tarifas y motor de cálculo

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Tarifas | Cuadros tarifarios, conceptos y perfiles de cálculo por servicio | Cuadros versionados con vigencias, reglas, beneficios y perfil tarifario del contrato | Se mantiene | Facturación propone y otra persona aprueba la versión | M04; DFA Módulo 7; RN-01 |
| Tarifas | Fórmulas de cargos en funciones y procedimientos almacenados de cada base | Fórmulas configurables y versionadas en el motor | Cambia | Las fórmulas propias de cada cooperativa deben relevarse y validarse (brecha B-14) | M04; brecha B-14 |
| Tarifas | Tablas de trabajo para preparar cuadros y recalcular bonificaciones | Borrador de versión tarifaria | Se elimina | Se prepara el cuadro como borrador dentro del sistema | T07 §19.2 |
| Tarifas | Sin explicación del cálculo ni simulación previa relevadas | Explicación renglón por renglón, simulación y retroactivos | Nuevo | Atención puede explicar cada importe al socio | M04; PRO-O4-07 |

### 3.8 Facturación

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Facturación | Facturación masiva por lotes y administración de comprobantes | Ciclos, universos, lote congelado, prefacturación con excepciones y aprobación | Se mantiene | Mismas etapas, con control previo y comparación con el período anterior | M05; DFA Módulo 8; RN-02 |
| Facturación | Modalidad de factura según configuración de cada cooperativa | Factura separada por servicio por defecto; agrupada multiservicio solo si se activa por grupo | Cambia | El socio puede recibir más de un comprobante; se informa antes del corte | DEC-034; BASE §103 |
| Facturación | Totales negativos y facturas en cero según configuración | Por defecto nota de crédito ante total negativo; no se emite en cero y se registra "sin cargo" | Cambia | Menos comprobantes sin importe | DEC-036, DEC-037 |
| Facturación | Anulaciones guardadas en tablas espejo | Estado anulado con documento de reversión enlazado; nada se borra | Cambia | La historia del comprobante queda completa | CTR-MIG-09; maestra P5 |
| Facturación | Historia de cambios en tablas separadas | Versiones con vigencia en el mismo documento | Cambia | Consulta de "cómo estaba" en una fecha | CTR-MIG-10 |
| Facturación | Instalación facturada según práctica | Instalación en la primera factura del ciclo tras la OT confirmada | Cambia | Una sola factura de arranque con fracción e instalación | DEC-016 |
| Facturación | Capital social facturado según práctica | Renglón identificado en la factura del servicio con auxiliar separado y leyenda | Cambia | El socio distingue aporte de capital y precio del servicio | DEC-061 |
| Facturación | Conceptos de terceros con o sin servicio propio | Siempre colgados de un contrato propio del socio con perfil "convenio de terceros" | Cambia | Exhibición separada del cargo propio y rendición al organismo | DEC-083 |

### 3.9 Fiscal e impuestos

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Fiscal | Autorización ARCA con alerta de comprobantes pendientes al iniciar sesión | Cola de autorización con estados explícitos, espera con tiempo máximo en mostrador, CAEA de contingencia y reenvío con el mismo número | Cambia | En mostrador la factura no se entrega como fiscal sin CAE; la masiva no se detiene por una caída | DEC-018, DEC-035, DEC-038; REL §1 |
| Fiscal | Certificados ARCA gestionados fuera del sistema | La plataforma genera clave y CSR, con clave privada en bóveda; admite PFX existente | Cambia | El contador carga o genera el certificado desde el sistema | DEC-053 |
| Fiscal | Padrones de ARCA, IIBB y escalas de Ganancias copiados en tablas | Consulta o importación del padrón vigente y tablas normativas de plataforma | Se elimina | No se mantienen copias locales de padrones | T07 §19.5; RN-MIG-044, RN-MIG-045 |
| Fiscal | IIBB según configuración de cada cooperativa | Córdoba en O4 y el resto como configuración en O8 | Cambia | Las cooperativas de otras jurisdicciones esperan a O8 para su configuración completa | DEC-054 |
| Fiscal | Libro IVA ventas y compras | Libros IVA digitales y regímenes informativos | Se mantiene | Mismas salidas, con validación previa | M06; REL §1 |
| Fiscal | Sin modo de facturación electrónica como servicio | Modo pasarela fiscal por API | Nuevo | Terceros pueden emitir a través de la cooperativa | M06; PRO-O11-05; RN-03 (brecha B-15) |

### 3.10 Cuenta corriente, cobranza y pasarelas

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Cobranza | Apertura de caja, cobranza local, opciones e informes de cobranzas | Caja del turno, recibos, arqueo y bloqueos de cobro | Se mantiene | Mismas tareas del cajero | M07; DFA Módulo 10; REL §1 |
| Cobranza | Imputación según configuración y criterio del cajero | Por antigüedad, recargos e intereses primero, respetando la elección explícita del socio o del cajero | Cambia | Regla única y visible en el recibo | DEC-048 |
| Cobranza | Saldos a favor aplicados entre servicios | Automático solo dentro del mismo servicio; entre servicios con elección o autorización | Cambia | El cajero pide confirmación para cruzar servicios | DEC-049 |
| Cobranza | Cuenta corriente del titular | Cuenta corriente por titular y entidad jurídica, con recibo por entidad | Cambia | Un recibo por entidad cuando el socio paga servicios de entidades distintas | DEC-087 |
| Cobranza | Interfaces de cobranza programadas por cooperativa (79 carpetas en el código) | Perfiles de formato configurables por ente | Cambia | La cooperativa configura sus formatos sin desarrollo | FIC 4.4; brecha B-19 |
| Cobranza | Canales de pago electrónico configurados en tablas | Pasarelas Pagos360, Mercado Pago, SIRO y Red Link en O5; el resto en O11 | Cambia | Las cooperativas con otras pasarelas esperan a O11 o usan las prioritarias | DEC-015; T07 §19.7 |
| Cobranza | Código de pago impreso con la clave del suministro de ProCoop | Identificador nuevo autocontenido y resolución por clave ProCoop hasta vencer sus facturas | Cambia | Las facturas emitidas por ProCoop se siguen cobrando después del corte | DEC-050; CTR-MIG-13 |
| Cobranza | Interés al pagar online una factura vencida | Interés diferido a la próxima factura, configurable por canal | Cambia | El socio paga el importe impreso y el interés llega después | DEC-051 |
| Cobranza | Cobranza domiciliaria y entes recaudadores | Cobradores con cartera y rendición, entes con archivos de rendición | Se mantiene | El cobrador trabaja en la PWA de campo | M07; RN-05 |
| Cobranza | Conciliación de pasarelas y entes con trabajo manual | Conciliación de cupones, devoluciones, pasarelas, entes y bancos | Cambia | Tesorería revisa diferencias en lugar de cruzar archivos | M07; M14; PRO-O5-07 |

### 3.11 Mora, corte y financiación

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Mora | Notificaciones por instancia, tratamiento de morosos, excepciones e instancias de mora | Política de mora, candidatos, notificaciones con constancia y protecciones | Se mantiene | Mismo circuito, con constancias digitales | M08; DFA Módulo 11; RN-04; REL §1 |
| Mora | Reconexión después del pago con gestión manual | Reconexión automática en servicios remotos al confirmarse el pago sin deuda vencida; OT automática si requiere técnico | Cambia | El socio recupera el servicio sin llamar; técnica recibe la OT sola | DEC-014 |
| Mora | Corte total del servicio | Modos por servicio: restringido (por ejemplo, bloqueo saliente o grilla mínima) o interrumpido; CLO sin corte físico | Cambia | Valores por defecto a validar legalmente antes de usarlos | M08; HUE-TEL-04, HUE-TV-03, HUE-AG-02, HUE-ELE-05 |
| Mora | Prescripción según práctica de cada cooperativa | 24 meses para facturas periódicas y 60 meses para el resto, editable y con validación legal | Cambia | Asesoría legal valida antes de la primera corrida | DEC-052 |
| Mora | Planes de financiación | Planes de pago, convenios, planes de cuotas y garantías | Se mantiene | Mismas tareas, con simulación y firma electrónica del convenio | M08; DFA Módulo 12; DEC-078 |
| Mora | Tabla temporal de morosos por lote | Candidatos calculados por el proceso de mora | Se elimina | Sin impacto funcional | T07 §19.8 |
| Mora | Suspensión de cobertura social según reglamento local | Suspensión por cuotas impagas y carencia de rehabilitación, deshabilitada por defecto | Nuevo | El operador social aplica una regla explícita | HUECO-SEP-01; M08; M18 |

### 3.12 Atención, comunicaciones y comunidad

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Atención | Mesa de entradas, carga rápida de reclamos, turnero | Mesa de entradas, reclamos e incidentes, turnero y tótem | Se mantiene | Mismas tareas, con turnos desde el portal | M09; REL §1 (Herramientas, Operaciones) |
| Atención | Reclamos y trámites sin expediente único | Expediente único con número de seguimiento, SLA, asignación y escalamiento | Cambia | El socio sigue su gestión; el supervisor ve vencimientos | M09; DEC-011 |
| Atención | Mesa de ayuda con horas bonificadas propias del proveedor | Tickets migrados; las horas bonificadas no se migran | Se elimina | Sin impacto para el socio | T07 §19.21; PA-MIG-14 |
| Atención | Asistente de IA con registro de consultas | IA que clasifica, resume y sugiere; no ejecuta sin confirmación y queda apagada hasta que la cooperativa la acepta | Cambia | El personal confirma cada propuesta; el registro anterior se conserva como auditoría de solo lectura | DEC-056; maestra P6; T07 §19.27 |
| Atención | Mensajería con WhatsApp, correo y SMS | Omnicanal con Meta Cloud API por defecto y adaptador para Trii | Cambia | Conversaciones dentro del expediente del socio | DEC-055 |
| Atención | Causas de baja gestionadas internamente | Botón de baja en Internet, TV y telefonía, configurable en el resto, con código en 24 h | Nuevo | La baja puede pedirse sin ir a la oficina | DEC-057 |
| Comunicaciones | SMS por módem GSM, envíos de correo propios, avisos telefónicos automáticos | Motor de comunicaciones con proveedor propio o revendido y canal de voz | Se elimina | Se dan de baja módems y cuentas de correo locales | DEC-077; T07 §19.31 |
| Comunicaciones | Sin preferencias de canal por socio relevadas | Preferencias y consentimientos por canal, campañas por audiencia | Nuevo | El socio elige cómo recibir avisos | T09 |
| Comunidad | Sin comunidad | Muro editorial con reacciones y comentarios moderados, novedades, encuestas y beneficios | Nuevo | Nuevo rol de editor y moderador | DEC-008; T09 |

### 3.13 Portal del socio y sitio público

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Portal | CoopOnline sobre una base MySQL externa sincronizada | Portal nativo sobre la misma base, sin sincronización | Cambia | La información del socio está siempre actualizada | CTR-GLB-11; CTR-MIG-12 |
| Portal | Registro de sincronización con la web | Sin sincronización | Se elimina | Sin impacto funcional | T07 §19.26 |
| Portal | Portal con funciones acotadas | PWA del socio con marca, vinculación verificada de cuentas, ingreso con contraseña u OTP y CiDi | Nuevo | El socio vincula sus cuentas con código de factura y documento | DEC-043, DEC-066, DEC-067; M19 |
| Portal | ProCoop WEB publicaba requisitos, trámites y archivos | Landing por cooperativa con servicios habilitados, noticias, registro, consulta y pago sin login | Nuevo | El sitio institucional pasa a ser parte del sistema | M19; REL §1 |
| Portal | Trámites web definidos en ProCoop WEB | Trámites configurables desde plantillas de plataforma y solicitudes genéricas | Cambia | La cooperativa ajusta trámites sin desarrollo | DEC-079; T11 |

### 3.14 Técnica, campo y redes

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Técnica | Factibilidades, órdenes de trabajo, reclamos técnicos e informes | Factibilidad, agenda, cuadrillas, OT con materiales y evidencias | Se mantiene | Mismas tareas, con agenda y fotos en el celular | M10; DFA Módulo 14; REL §1 |
| Técnica | Cierre de OT en un paso | Cierre en dos pasos por defecto en altas, desconexiones, reconexiones y cambios de medidor | Cambia | El supervisor confirma el cierre del técnico | DEC-039 |
| Técnica | Factibilidad según práctica | Configurable por servicio; obligatoria por defecto en Internet y servicios con red | Cambia | No se instala sin factibilidad aprobada | DEC-040 |
| Técnica | Gestión de Internet y telefonía con tablas propias | Aprovisionamiento automático asíncrono en MikroTik, Radius y SmartOLT con respaldo manual | Cambia | La activación ocurre al confirmar la instalación | DEC-041, DEC-042 |
| Técnica | Numeración de órdenes automáticas sin bloqueo (genera choques) | Secuencia atómica | Cambia | Desaparecen los números de OT duplicados | RN-07 (brecha B-25) |
| Técnica | Modelo de red duplicado (`NIV_*` y `REDES_*`) | Modelo GIS único | Cambia | Un solo mapa de red | PA-MIG-13; T07 §19.11 |
| Técnica | Exportación de OT a colectoras por grupos | App de campo sin conexión | Se elimina | El técnico deja de depender de exportaciones | T07 §19.10 |
| Técnica | Formatos de impresión por tipo de OT | Plantillas de documentos | Se elimina | Las plantillas se rediseñan una vez | T07 §19.10; T11 |
| Técnica | Sin guardias de emergencia relevadas | Guardias, prioridad de reclamos de seguridad y plazos de respuesta | Nuevo | Turnos de guardia con aviso automático | HUE-GAS-05; M10 |
| Técnica | Sin portabilidad numérica | Portabilidad entrante y saliente, habilitable si la cooperativa tiene numeración propia | Nuevo | Solo aplica a cooperativas con numeración asignada | PA-TEC-19; M10 |
| Telefonía | Opciones de telefonía y tasación de llamadas | Numeración, importación de CDR deduplicada, tasación y liquidación a operadores | Se mantiene | Mismas tareas en O10; reglas a verificar (brecha B-13) | M10; M04; DEC-007 |

### 3.15 Ventas, compras, stock y activos

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Ventas | Presupuestos y venta de productos | Presupuestos, ventas, financiación comercial y POS | Se mantiene | Mismas tareas | M11; DFA Módulo 13 |
| Compras | Solicitudes, cotizaciones, órdenes de compra, remitos, comprobantes, pagos y retenciones | Compras con control de tres vías y retenciones como agente | Se mantiene | Mismas tareas | M12; DFA Módulo 16; REL §1 |
| Compras | Proveedores sin acceso al sistema | Portal de proveedores por invitación: órdenes, facturas, remitos, pagos y retenciones | Nuevo | Menos consultas telefónicas de proveedores | M12; maestra §7.2 (C-PRV) |
| Compras | Carga manual de facturas de proveedor | Asistencia de IA para extraer datos de facturas de compra, con confirmación humana | Nuevo | Compras revisa en lugar de tipear | PRO-O11-05; maestra P6 |
| Stock | Movimientos, trazabilidad, operaciones especiales, bienes de uso, fabricación y RMA | Stock completo, series, bienes de uso, RMA y fabricación | Se mantiene | Mismas tareas, con stock en vehículo | M13; DFA Módulo 17; REL §1 |
| Stock | Tabla de productos por puesto sin uso identificado | No se migra | Se elimina | Se reevalúa si aparecen datos con uso real | T07 §19.15 |

### 3.16 Tesorería, contabilidad, sueldos e institucional

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Tesorería | Bancos, movimientos, valores de terceros, cheques, cupones, retenciones y cierre de cajas | Tesorería con valores, eCheq, tarjetas e Interbanking | Se mantiene | Mismas tareas | M14; DFA Módulo 18; REL §1 |
| Tesorería | Tesorería completa en una sola etapa | Cuentas, rendición, depósitos, extractos y conciliación en O5; valores, cupones, retenciones e Interbanking en O8 | Cambia | Durante la convivencia, parte de la tesorería sigue en ProCoop | DEC-059; DEC-068 |
| Contabilidad | Asientos, mayor, balance y asientos automáticos | Plan de cuentas, ejercicios, centros de costo y asientos automáticos | Se mantiene | Mismas tareas del contador | M15; DFA Módulo 19; REL §1 |
| Contabilidad | Contabilidad oficial en ProCoop | Núcleo contable en O5 en un plan no oficial que concilia contra ProCoop; se oficializa en el corte administrativo | Cambia | El contador concilia dos sistemas durante la convivencia | DEC-009, DEC-069 |
| Sueldos | Liquidación masiva, simulador, Ganancias, variables y conceptos | Liquidación propia con Ganancias, F.931 y Libro de Sueldos Digital | Se mantiene | Mismas tareas del liquidador | M16; DFA Módulo 20; REL §1 |
| Sueldos | Liquidación en el mismo sistema | Importación de un liquidador externo en O8 y liquidación propia en O9 con dos períodos en paralelo | Cambia | RRHH liquida en paralelo dos meses antes de dejar el sistema anterior | DEC-058 |
| Sueldos | Tablas normativas SICOSS y de Ganancias copiadas en la base | Tablas normativas de plataforma | Se elimina | RRHH deja de actualizarlas a mano | T07 §19.18; RN-MIG-044 |
| Sueldos | Recibos impresos | Recibo digital con firma digital y portal del empleado | Nuevo | El empleado firma y consulta desde el celular | DEC-078; M16 |
| Institucional | Consejo, actas e INAES | Asociados, capital, asambleas con votación, actas, excedentes e INAES | Se mantiene | Mismas tareas de secretaría | M17; DFA Módulo 24 |
| Institucional | Permisos sobre reuniones en tabla propia | Alcance de permisos del modelo general | Se elimina | Se reasignan permisos al migrar | T07 §19.24 |

### 3.17 Servicios sociales, flota y actividades

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Servicios sociales | Sepelio, ambulancias y salud, planes de vivienda (materiales y construcción), otras prestaciones | Planes de cobertura, sepelio, salud, banco de sangre administrativo, vivienda y otras prestaciones | Se mantiene | Mismas tareas, con dominio sensible y alcance por servicio | M18; DFA Módulo 25; REL §1 |
| Servicios sociales | Sin tablas de cementerio parque relevadas | Unidades, derechos de sepultura, titulares, autorizados, ocupaciones y actos | Nuevo | Carga inicial con plantillas de importación | M18; T07 §19.33 |
| Flota | Traslados: viajes e informes | Flota, combustibles, viajes, rendiciones y GPS | Se mantiene | Mismas tareas, con GPS | M18; DFA Módulo 23; REL §1 |
| Actividades | Actividades y seguimiento | Tareas internas en la bandeja del empleado | Se mantiene | Las tareas llegan a la bandeja | M09; T11; DFA Módulo 22 |
| Hardware | Agente para impresoras, lectoras y balanzas | Agente local con credencial de dispositivo por puesto | Se mantiene | Mismos periféricos, enrolados por puesto | DEC-007; T06; maestra §7.2 (S-AGT) |

### 3.18 Reportes, integración, procesos y documentos

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Reportes | Tablero de control con grupos, gráficos y estados | Tableros por rol con umbrales de indicadores | Cambia | Los indicadores se redefinen tomando los actuales como insumo | T07 §19.25; T10 |
| Reportes | Editor de reportes, informes personalizados y esquemas de informes | Catálogo de reportes, vistas guardadas, reportes programados y generador | Cambia | Los informes propios se reproducen desde el inventario | T07 §19.25, §19.6; T10 |
| Reportes | Publicación de tablas a Power BI | Exportación analítica y almacén BI | Cambia | Las herramientas externas se conectan al almacén analítico | T07 §19.25; T10 |
| Reportes | Sin almacén analítico | Almacén analítico, modelo dimensional y salas BI | Nuevo | Análisis de gestión sin afectar la operación | T10; PRO-O11-01 |
| Integración | Servicios web con claves en tabla y archivos de intercambio definidos en tablas | Conectores con credenciales en bóveda y monitoreo | Cambia | Integraciones visibles y monitoreadas | T06; T07 §19.26, §19.28 |
| Integración | Sin API pública para terceros | API con scopes, medición de uso y webhooks | Nuevo | Terceros se integran sin acceso a la base | T10; T06 |
| Procesos | Acciones automáticas de trámites por script y procesos personalizados | Acciones de workflow; el script nunca se ejecuta | Se elimina | Los automatismos se reconfiguran desde el inventario | T07 §19.1; RN-MIG-048 |
| Procesos | Sin motor de workflow | Workflow con máquinas de estado, aprobaciones, delegaciones y bandeja de tareas | Nuevo | Cada usuario trabaja desde su bandeja | T11 |
| Documentos | Comprobantes impresos y adjuntos | Expediente documental con hash, retención y PDF/A | Nuevo | Documentos firmados y consultables | T11; DEC-080 |
| Documentos | Firma manuscrita | Firma electrónica con OTP en instalación, convenios y trámites | Nuevo | El socio firma en el celular del técnico o en el portal | DEC-078 |

### 3.19 Migración, histórico y transición

| Dominio | ProCoop hoy | GoodApps | Tipo | Impacto en usuarios | Fuente |
|---|---|---|---|---|---|
| Histórico | Todo el histórico en la base operativa | Ejercicio en curso y 24 meses en estructuras tipadas; el resto en `legacyRecords` consultables; copia del origen por 10 años | Cambia | Consultas antiguas en una vista de histórico | DEC-070; T07 §9.4 |
| Transición | Reemplazo de sistema sin herramientas de convivencia | Corrida paralela con facturación comparada, by-pass, corte por etapas y plan de retorno | Nuevo | Dos sistemas en paralelo durante la transición | T07 §9.6–§9.11; DEC-068 |
| Transición | Tablas de integridad, módulos y novedades del proveedor | Se usan como insumo de validación y se archivan | Se elimina | Sin impacto funcional | T07 §19.29 |

---

## 4. Qué no migra: resumen cuantitativo de T07

### 4.1 Totales

Las **659 tablas** del catálogo de ProCoop tienen una fila propia en la matriz de T07 §19 con destino, anexo dueño, ola y estrategia. Toda tabla, cualquiera sea su estrategia, queda en el snapshot archivado de la migración (RN-MIG-003).

| Estrategia | Significado | Tablas | % |
|---|---|---:|---:|
| Migrar vivo | Operativa; puede incluir una parte histórica tipada | 471 | 71,5 % |
| Histórico | Solo lectura, tipada en la colección del dueño o en `legacyRecords` | 111 | 16,8 % |
| No migrar · Reemplazado por | La función pasa a un mecanismo de GoodApps | 52 | 7,9 % |
| No migrar · Descartar | Sin función de negocio vigente | 25 | 3,8 % |
| **Total** | | **659** | **100 %** |

Fuente: T07 §19.32 (ajuste de las fases 2 y 3) y `04-matriz-trazabilidad.md` §3 (Cubierta 582, Descartada 25, Reemplazada 52).

### 4.2 Por sección del catálogo

Recuento base de T07 §19.32 (total / vivo / histórico / no migrar). El ajuste posterior no cambió la estrategia por sección, salvo la tabla `AUDIT_IA` de la sección 27 (ver la observación 4.5).

| §CAT | Sección | Total | Vivo | Hist. | No |
|---|---|---:|---:|---:|---:|
| 1 | Socios, cuentas y servicios | 24 | 19 | 4 | 1 |
| 2 | Servicios, categorías y tarifas | 48 | 43 | 3 | 2 |
| 3 | Medición y consumos | 24 | 18 | 4 | 2 |
| 4 | Facturación | 35 | 23 | 12 | 0 |
| 5 | Fiscal, ARCA e impuestos | 26 | 16 | 7 | 3 |
| 6 | Cobranza y caja | 21 | 8 | 12 | 1 |
| 7 | Entes recaudadores y pagos electrónicos | 13 | 9 | 3 | 1 |
| 8 | Mora y notificaciones | 17 | 13 | 3 | 1 |
| 9 | Financiación y convenios | 6 | 6 | 0 | 0 |
| 10 | Técnica, reclamos y obras | 38 | 29 | 5 | 4 |
| 11 | Redes (GIS) | 12 | 12 | 0 | 0 |
| 12 | Telefonía e Internet | 39 | 33 | 6 | 0 |
| 13 | Ventas de productos y presupuestos | 13 | 10 | 3 | 0 |
| 14 | Compras y proveedores | 34 | 31 | 3 | 0 |
| 15 | Stock, bienes de uso y fabricación | 38 | 28 | 9 | 1 |
| 16 | Tesorería y bancos | 23 | 13 | 9 | 1 |
| 17 | Contabilidad | 24 | 23 | 1 | 0 |
| 18 | Sueldos | 56 | 38 | 4 | 14 |
| 19 | Planes de vivienda | 11 | 7 | 4 | 0 |
| 20 | Ambulancias y salud | 5 | 3 | 2 | 0 |
| 21 | Mesa de ayuda (tickets) | 14 | 12 | 1 | 1 |
| 22 | Turnero | 7 | 4 | 3 | 0 |
| 23 | Actividades y agenda | 10 | 10 | 0 | 0 |
| 24 | Institucional | 7 | 6 | 0 | 1 |
| 25 | Informes y tablero | 12 | 3 | 1 | 8 |
| 26 | Web, CoopOnline y APIs | 8 | 5 | 1 | 2 |
| 27 | Usuarios, seguridad y auditoría | 20 | 9 | 7 | 4 |
| 28 | Configuración y motor de pantallas | 31 | 15 | 1 | 15 |
| 29 | Sistema (general) | 10 | 6 | 0 | 4 |
| 30 | Maestros generales | 15 | 10 | 0 | 5 |
| 31 | Comunicaciones | 18 | 8 | 3 | 7 |
| | **Total (recuento base)** | **659** | **470** | **111** | **78** |

Cuatro secciones concentran el 56 % de lo que no migra: configuración y motor de pantallas (15), sueldos (14, casi todas tablas normativas), informes y tablero (8) y comunicaciones (7).

### 4.3 Por motivo (las 77 tablas que no migran)

| Motivo | Ejemplos de tablas | Destino en GoodApps | Tablas |
|---|---|---|---:|
| Tablas normativas o maestros comunes | `SU_SITUACION_REVISTA`, `SU_TRAMAS`, `CAT_RETG`, `EMPAFIP`, `IIBB_LUA`, `PAISES`, `PROVINC` | Tablas normativas de plataforma, padrones vigentes (se usan para conciliar) | 20 |
| Motor de pantallas, menú y permisos propios | `ENTIDADES`, `ENTIDACOL`, `ENTIDACOL_EXTRA`, `ABM_VALIDACIONES`, `MENUSYS`, `MENUVAL`, `PERFILES_TABLAS`, `REUNIONES_PERMISOS` | Vistas y filtros guardados, mapa del sitio, capabilities y alcance (T02, T03, T04) | 16 |
| Tablero e informes | `TABLERO`, `GRAFTAB`, `INFO_SYS`, `TABLAS_POWERBI`, `ESQUEMAS_INFORMES_COBRANZAS` | Tableros, catálogo de reportes y exportación analítica (T10) | 10 |
| Logs, configuración y tablas del sistema ProCoop | `AUDITORIA_TELEMEDICION`, `WEB_LOG`, `BLOQUEO_FILAS`, `INTEGRIDAD`, `MODULOS`, `MAPA` | Se archivan; algunas alimentan los chequeos de la migración | 7 |
| Comunicaciones de infraestructura propia | `MODEMS`, `ENVIOS`, `IVR`, `SENDMAIL`, `PROMAIL`, `RESULTADOS` | Proveedores de mensajería y canal de voz (T09) | 6 |
| Tablas temporales y de trabajo | `TEMPMODIFBONIF`, `IMP_WORK`, `MOROSO_TEMPORAL`, `CATTMC` | Procesos y borradores del propio sistema | 4 |
| Interfaces y canales | `ARCHIVOS`, `DATOSINT`, `TIP_ARC`, `CANALES_PAGOS` | Conectores y pasarelas configuradas (T06, M07) | 4 |
| Secretos y credenciales | `WS_KEYS`, `INTERBANKING`, `CORREOS_INTERNOS` | Bóveda de secretos; nunca se leen ni se copian (RN-MIG-013) | 3 |
| Exportación a colectoras | `TECNGREXP`, `TECNOTEXP`, `TECNSEEXP` | App de campo sin conexión (M10) | 3 |
| Automatismos y formatos de impresión | `TRAMITES_ACCIONES`, `OT_REPORTE` | Acciones de workflow y plantillas de documentos (T11) | 2 |
| Uso no identificado o propio del proveedor | `PRODPUES`, `TICKETS_HSBONIF` | Se reevalúan si aparecen datos con uso real (F1) | 2 |
| **Total** | | | **77** |

### 4.4 Por ola de carga

Ola en que se construye y prueba el cargador de cada tabla (T07 §19.32, ajuste de las fases 2 y 3). La ejecución real sobre la cooperativa ocurre en el ensayo integral, el paralelo y el corte de O11.

| O0 | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | Total |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 4 | 83 | 70 | 46 | 70 | 56 | 21 | 43 | 99 | 55 | 96 | 16 | 659 |

### 4.5 Observación sobre los totales de T07

El recuento base de T07 §19.32 da 470 / 111 / 78. Después, la tabla `AUDIT_IA` pasó de "No migrar" a "Histórico" (CTR-DAT-04; `04` §3), lo que daría 470 / 112 / 77. Sin embargo, el párrafo de ajuste de T07 §19.32 informa 471 / 111 / 77, cifra que coincide con la matriz 04 (582 cubiertas = 471 + 111). La diferencia de una tabla entre "Migrar vivo" e "Histórico" no cambia el total ni lo que no migra, pero conviene que el dueño de T07 confirme el recuento por estrategia. Este documento usa las cifras vigentes de T07 y de la matriz 04.

---

## 5. Cobertura de fuentes: resumen de la matriz 04 y las 26 brechas de fuente

### 5.1 Resumen de cobertura

La matriz de trazabilidad verifica que cada unidad de las fuentes (secciones de la base funcional, fichas del complemento, secciones de Connectia, de la DFA, de las fichas de integraciones, de las reglas de negocio y las 659 tablas) tenga un destino en la especificación.

| Fuente | Unidades | Con destino | Brechas | % cobertura |
|---|---:|---:|---:|---:|
| BASE (relevamiento y base funcional) | 621 | 611 | 5 | 98,4 % |
| AGR (complemento de análisis) | 61 | 56 | 5 | 91,8 % |
| CNX (referencia Connectia) | 53 | 53 | 0 | 100,0 % |
| DFA (definición funcional de ProCoop) | 96 | 96 | 0 | 100,0 % |
| FIC (fichas de integraciones) | 60 | 59 | 0 | 98,3 % |
| RN-00 a RN-13 (reglas extraídas del código) | 651 | 623 | 16 | 95,7 % |
| CAT (659 tablas) | 659 | 659 | 0 | 100,0 % |
| **Total** | **2.201** | **2.157** | **26** | **98,0 %** |

"Con destino" suma las unidades cubiertas (1.661 directas y 402 por su sección padre) y las 94 descartadas o reemplazadas. Las 18 unidades con trazabilidad débil (solo declaradas en la ficha inicial de un anexo) no suman cobertura, pero tampoco son brechas. La cobertura estricta, sin herencia de la sección padre, es del 79,7 %. Fuente: `04-matriz-trazabilidad.md` v1.1 §3. *La maestra §19 todavía cita la versión 1.0 de la matriz (97,9 %).*

### 5.2 Las 26 brechas de fuente y su tratamiento

Tratamiento según `04` §4.1 (resumen al pie de la sección):

- **Declarar descartada**: metadato o resumen sin requisito propio; basta con registrarlo en la §22 del anexo.
- **Agregar cita**: el contenido ya está en los anexos; falta citar la fuente en los RF/RN.
- **Completar contenido**: el contenido no se encontró en los anexos o es un límite de la propia fuente; requiere redactar requisitos, registrar un hueco o validar con la cooperativa.

| # | Unidad de fuente | Contenido | Anexo sugerido | Tratamiento | Impacto |
|---|---|---|---|---|---|
| B-01 | BASE · Advertencia principal para la arquitectura | Revisión de arquitectura del sistema integral, aislamiento y simulaciones separadas de producción; diccionario por cooperativa desde el inicio | T01, T03 | Completar contenido: requisito explícito de simulación separada; citar la unidad en T01 y T03 | Alto |
| B-02 | BASE · Propósito y alcance | Alcance del producto y niveles de certeza de la base | Maestra §1, §2.1 | Declarar descartada (metadato introductorio) | Bajo |
| B-03 | BASE §96 · Revisión de coherencia v0.15 | Revisión interna de la versión 0.15 | Maestra §17 | Completar contenido: registrar §96 como fuente de contraposiciones globales | Medio |
| B-04 | BASE §96 · Alcance de la revisión | Resultado de coherencia general | Maestra §17 | Declarar descartada | Bajo |
| B-05 | BASE §96 · Hallazgos de estructura | Prevalencias internas (§84–§93 sobre §32; §48 "solicitar" sobre §25/§43 "activar desde la app"); fundamento de la factura separada (Res. INAES 3442/2018, sin efecto) | Maestra §17; M02, M05, M19 | Completar contenido: agregar CTR globales y verificar que M19 aplique "solicitar" como base | Alto |
| B-06 | AGR §1 · Propósito y criterio | Escala P0/P1/P2 y regla "ninguna propuesta se aprueba por aparecer aquí" | `03`, `01` | Completar contenido: citar la regla junto a DEC-047/DEC-072 y usar P0/P1/P2 en el plan | Medio |
| B-07 | AGR §2 · Diagnóstico principal | Puntos determinantes de arquitectura y vacíos operativos | T01 | Completar contenido: fila en T01 §22 hacia los RF que ya materializan AGR-002, 003, 006, 010 y 011 | Bajo |
| B-08 | AGR §2.1 · Qué ya está | Tabla resumen de capacidades de la base | T01 | Declarar descartada (resumen) | Bajo |
| B-09 | AGR §3 · Matriz de propuestas | Prioridad P0/P1/P2 de cada ficha AGR | `03`; §22 de cada anexo | Completar contenido: incorporar la prioridad al plan de olas | Medio |
| B-10 | AGR §9 · Cómo incorporar propuestas | Procedimiento para convertir propuestas en decisiones | `01`; guía de redacción | Declarar descartada (citar como origen del formato) | Bajo |
| B-11 | RN-00 · Documento índice | Índice del conjunto de reglas | T07 | Declarar descartada (índice) | Bajo |
| B-12 | RN-00 · Documentos | Tabla de los 13 documentos de reglas | T07 | Declarar descartada (índice) | Bajo |
| B-13 | RN-00 · Cobertura del código | Cobertura parcial del código descompilado: ARCA 50 %, telefonía 30 %, núcleo y configuración 25 %, formularios de configuración 17 % | `05`; T04/T04b, M06, M04, T03 | Completar contenido: registrar como hueco de relevamiento; tercera pasada de extracción o validación con la cooperativa | Alto |
| B-14 | RN-00 · Qué quedó afuera | Segunda pasada inconclusa (configuración, plantillas, tablero, facturación masiva, mora, telemedición, app móvil) y fórmulas en funciones y procedimientos almacenados | T07, M04, T04b, M08, M03 | Completar contenido: tarea de extracción en T07 sobre la base de la cooperativa piloto y un hueco por área inconclusa | Alto |
| B-15 | RN-03 · Implicancias para GoodApps | 13 recomendaciones de diseño ARCA (certificados, cola por punto de venta, CAEA sin movimiento, modo pasarela, QR) | M06, T06 | Agregar cita: el contenido existe en M06 | Medio |
| B-16 | RN-03 · Dudas abiertas | Nueve dudas fiscales y cuatro defectos del código a no replicar | M06 §21 y §6 | Completar contenido: convertir dudas en PA-FIS y defectos en reglas "no replicar" | Medio |
| B-17 | RN-05 §7.3 · Mercado Pago | Solicitud, preferencia, consulta, registro y rendición de pagos | M07, T06 | Agregar cita (pasarela de O5, DEC-015) | Bajo |
| B-18 | RN-05 §7.4 · Otras pasarelas | Patrón común de nueve pasarelas | T06 | Agregar cita y confirmar su estado Extensión en O11 | Bajo |
| B-19 | RN-05 §8 · Tabla por cooperativa | 79 carpetas de interfaces de cobranza de otras cooperativas | T06 §22 | Declarar descartada: se reemplazan por perfiles de formato configurables | Bajo |
| B-20 | RN-05 §9 · Laguna Larga | Interfaz Red Link propia, SIRO con cero antepuesto, rama ENARGAS | M07, T06, T07 | Agregar cita en los RF de Red Link y SIRO; la cooperativa piloto ya está definida (DEC-088) | Medio |
| B-21 | RN-05 §9.1 · Qué hay en el código | Un importador sin exportador propio | M07, T06 | Declarar descartada (cubierta por B-20) | Bajo |
| B-22 | RN-05 §9.2 · Rendición Red Link | Estructura del archivo de rendición de la cooperativa piloto | T06 | Agregar cita y llevar la estructura al perfil de formato del conector | Medio |
| B-23 | RN-05 §9.3 · Configuración sugerida | Configuración inferida de entes y formatos | T07, T04 | Declarar descartada: citar en la configuración inicial de la piloto junto a RN-12 | Bajo |
| B-24 | RN-05 §12 · Dudas abiertas | Nueve dudas de cobranza, entre ellas la imputación por importes repetidos | M07 §21 | Agregar cita en las resueltas y completar contenido en la imputación por importes repetidos, que no figura en ningún anexo | Medio |
| B-25 | RN-07 · Reglas adicionales | Vales y materiales por OT, sincronización por diferencia, lectura obligatoria al cerrar alta y reconexión, nota visible en caja, numeración sin bloqueo | M10 | Agregar cita en lo ya cubierto y completar las reglas no revisadas (vales, sincronización, catastro, consumo anterior) | Medio |
| B-26 | RN-11 · Confirmado en la base demo | Configuración confirmada de la cooperativa piloto: tope de código de barras SIRO por vencimiento, entes sin pagos parciales, SIRO como único botón, 70 % de solicitudes online son recargas prepagas | M07, M05, T06, T07 | Agregar cita en M05 y M07; el conflicto de piloto quedó resuelto por DEC-088 (primera migración real después de O7, con prepago disponible) | Alto |

Distribución del tratamiento: **9 declarar descartada** (B-02, B-04, B-08, B-10, B-11, B-12, B-19, B-21, B-23), **8 agregar cita** (B-15, B-17, B-18, B-20, B-22 y, en parte, B-24, B-25 y B-26) y **9 completar contenido** (B-01, B-03, B-05, B-06, B-07, B-09, B-13, B-14, B-16).

Por fuente: 5 de BASE (B-01 a B-05), 5 de AGR (B-06 a B-10), 4 de RN-00 (B-11 a B-14), 2 de RN-03 (B-15, B-16), 8 de RN-05 (B-17 a B-24), 1 de RN-07 (B-25) y 1 de RN-11 (B-26).

---

## 6. Impactos en la gestión del cambio por rol

Roles del catálogo de T02 (maestra §7.2). La tabla resume qué cambia en el trabajo diario; la estrategia de capacitación, la convivencia con ProCoop y el calendario están en [`08-plan-puesta-en-marcha.md`](08-plan-puesta-en-marcha.md) (artefactos 8.3 y 8.4), y la asignación de responsabilidades en [`09-riesgos-y-raci.md`](09-riesgos-y-raci.md).

### 6.1 Conducción y control

| Rol | Qué deja de hacer | Qué cambia | Qué es nuevo | Fuente |
|---|---|---|---|---|
| Consejero (T-CJO) | Pedir informes impresos | Lectura institucional y agregada en tableros | Votaciones del consejo en el sistema | T02; M17; T10 |
| Gerente (T-GER) | Consolidar planillas de cada área | Tableros por rol con indicadores redefinidos a partir del tablero actual | Aprobaciones de alto nivel desde la bandeja; BI en O11 | T10; T11 |
| Síndico o auditor (T-SIN) | Pedir extracciones a sistemas | Lectura amplia sin escritura | Auditoría inmutable de cambios, accesos, lecturas e IA | T02 |

### 6.2 Administración y finanzas

| Rol | Qué deja de hacer | Qué cambia | Qué es nuevo | Fuente |
|---|---|---|---|---|
| Facturación (T-FAC) | Mantener parámetros numéricos y tablas de trabajo de tarifas | Propone tarifas y otra persona aprueba; factura separada por servicio por defecto; NC ante total negativo; no se emiten facturas en cero | Prefacturación con excepciones, simulación y explicación del cálculo; corrida paralela comparada con ProCoop | DEC-034, DEC-036, DEC-037; M04; M05; T07 |
| Cajero (T-CAJ) | Decidir la imputación caso por caso | Imputación por antigüedad con elección explícita; cruce entre servicios con autorización; recibo por entidad jurídica | Cobro de facturas de ProCoop por su código hasta vencer | DEC-048, DEC-049, DEC-050, DEC-087 |
| Cobrador (T-CBR) | Trabajar con planillas | Cartera y rendición en la PWA de campo | Cobro sin conexión con sincronización | M07; T03 |
| Tesorero (T-TES) | Cruzar a mano archivos de pasarelas y entes | Conciliación asistida de pasarelas, entes y bancos; tesorería operativa desde O5 | Credenciales bancarias en bóveda | DEC-059, DEC-074; M14 |
| Contador (T-CON) | Mantener padrones copiados | Contabilidad oficial en ProCoop y plan no oficial en GoodApps durante la convivencia | Conciliación entre sistemas; certificados ARCA generados desde el sistema; validación legal de prescripción y de la exposición fiscal del capital | DEC-009, DEC-052, DEC-053, DEC-069; HUECO-CAP-04 |
| Compras (T-CMP) | Tipear facturas de proveedor | Control de tres vías | Portal de proveedores e IA de extracción de facturas | M12; PRO-O11-05 |
| Depósito (T-DEP) | Exportar stock a colectoras | Equipos serializados con comodato valorizado | Stock en vehículo de cuadrilla | DEC-013; M13 |
| RRHH y liquidador (T-RRHH) | Actualizar tablas SICOSS y Ganancias | Importación del liquidador externo en O8; liquidación propia en O9 con dos períodos en paralelo | Recibo digital con firma digital y portal del empleado | DEC-058, DEC-078 |
| Secretaría institucional (T-SEC) | Llevar el libro de asociados fuera del sistema | Asociados y capital integrados con la factura | Asambleas con votación y actas con firma digital | M17; DEC-061, DEC-078 |

### 6.3 Atención y comercial

| Rol | Qué deja de hacer | Qué cambia | Qué es nuevo | Fuente |
|---|---|---|---|---|
| Atención al socio (T-ATE) | Dar de alta personas duplicadas; negar altas por deuda de terceros | Documento único con excepción aprobada; advertencia de deuda previa sin bloqueo; contrato desde la solicitud admitida | Expediente único con SLA, consentimientos, vinculación de cuentas del portal, asistencia de IA bajo confirmación | DEC-011, DEC-029, DEC-043, DEC-044, DEC-056 |
| Supervisor de atención (T-SAT) | Seguir reclamos por fuera del sistema | Asignación, derivación y escalamiento con plazos regulatorios | Tablero de vencimientos de SLA y autorizaciones de atención | M09; HUE-INT-03 |
| Editor y moderador de comunidad (T-COM) | — (rol nuevo) | — | Muro editorial, novedades, encuestas, campañas y moderación de comentarios | DEC-008; T09 |
| Operador de servicios sociales (T-SOC) | Manejar adherentes en varios lugares | Adherentes y beneficiarios con dueño único | Cementerio parque, suspensión de cobertura por impagos, alcance por servicio para datos sensibles | DEC-071, DEC-086; M18 |

### 6.4 Técnica y campo

| Rol | Qué deja de hacer | Qué cambia | Qué es nuevo | Fuente |
|---|---|---|---|---|
| Técnico (T-TEC) | Exportar e importar órdenes a colectoras; pedir la activación por teléfono | OT en el celular sin conexión; cierre en dos pasos | Firma del socio con OTP, fotos y materiales en el momento; activación automática de la red | DEC-039, DEC-041, DEC-078; M10 |
| Lecturista (T-LEC) | Usar planillas de lecturas a importar | Rutas y capturas en la app sin conexión | Validaciones en el momento de la captura | M03 |
| Supervisor técnico (T-STE) | Coordinar agenda por fuera del sistema; corregir números de OT duplicados | Factibilidad obligatoria configurable; supervisión del cierre | Guardias de emergencia, modelo GIS único, revisión posterior de activaciones | DEC-033, DEC-040; HUE-GAS-05; PA-MIG-13 |
| Supervisor de consumos (T-SCM) | Corregir volúmenes de gas | Validación de consumos con corrección justificada | Telemedición y autolectura del socio | DEC-085; M03 |

### 6.5 Administración del sistema, socios y otros actores

| Rol | Qué deja de hacer | Qué cambia | Qué es nuevo | Fuente |
|---|---|---|---|---|
| Administrador de la cooperativa (T-ADM) | Instalar y actualizar puestos; hacer copias de seguridad; mantener el motor de pantallas | Roles en lugar de perfiles por formulario; parámetros tipados y versionados | Publicación de oferta con aprobación, diccionario, marca, trámites configurables, carga de credenciales en bóveda | DEC-021, DEC-074, DEC-079; T02; T04 |
| Administrador de usuarios (T-USR) | Gestionar usuarios compartidos | Usuarios individuales con 2FA | Rol separado de la operación del negocio | T02 |
| Socio titular (C-SOC) | Ir a la oficina para consultar, pagar o reclamar | Puede recibir una factura por servicio; interés de pago online vencido en la próxima factura | Portal y app con marca, vinculación verificada, botón de baja, reconexión automática al pagar, comunidad | DEC-014, DEC-034, DEC-043, DEC-051, DEC-057 |
| Empleado en el portal (C-EMP) | Retirar recibos impresos | — | Recibo digital y firma | DEC-078 |
| Proveedor (C-PRV) | Consultar pagos por teléfono | — | Portal de proveedores por invitación | M12 |
| Equipo de plataforma (P-*) | — | — | Alta asistida, licencias, soporte con acceso temporal consentido y auditado | T01; T02 |

---

## 7. Hallazgos y recomendaciones

1. **La brecha principal es de regla, no de alcance.** Las 66 brechas de tipo "Cambia" están fundamentadas en decisiones, contraposiciones resueltas o reglas de los anexos; ninguna función de negocio de ProCoop queda sin destino. Recomendación: presentar al consejo y a cada área la lista de cambios de regla de la sección 3 antes de la capacitación, empezando por facturación, cobranza y mora.
2. **Las fuentes del código de ProCoop son incompletas en áreas críticas** (B-13, B-14): ARCA, telefonía, configuración y fórmulas de cargo en procedimientos almacenados. Recomendación: agregar en T07 una tarea de extracción sobre la base de la cooperativa piloto antes de O4 y validar los resultados en la corrida paralela.
3. **La configuración confirmada de la cooperativa piloto no está trazada del todo** (B-20, B-22, B-24, B-26): formatos Red Link y SIRO, tope del código de barras, pagos parciales por ente e imputación por importes repetidos. Recomendación: cerrarlas antes de O5, porque condicionan la cobranza de la primera migración real.
4. **Las prevalencias internas de la base funcional no están trazadas** (B-05): en particular, "solicitar" el servicio como base frente a "activar desde la app". Recomendación: agregar las CTR globales en la maestra y verificar M19.
5. **Hay una diferencia de una tabla en los totales por estrategia de T07** (sección 4.5). No afecta lo que no migra, pero conviene confirmarla.
6. **La pérdida de personalizaciones es el impacto más sensible para los usuarios avanzados**: vistas del motor de pantallas, informes personalizados y tablero de control no migran y se reconstruyen desde el inventario (T07 §19.25, §19.28). Recomendación: relevar con la cooperativa piloto cuáles usa realmente (DFA §34, punto 4) y priorizar su reconstrucción.
7. **La convivencia agrega trabajo temporal** al contador, a facturación y a RRHH (contabilidad no oficial, facturación comparada, dos períodos de sueldos en paralelo). Recomendación: dimensionarlo en el plan de puesta en marcha.

---

## 8. Relación con otros entregables

| Entregable | Relación |
|---|---|
| [`14-mapa-capacidades.md`](14-mapa-capacidades.md) (2.2) | Capacidades de negocio, ola de habilitación y cobertura; las capacidades parciales se originan en las brechas de la sección 5 |
| [`01-resumen-ejecutivo-vision.md`](01-resumen-ejecutivo-vision.md) (1.3) | Lo que no se replica de ProCoop y los límites de responsabilidad |
| [`04-procesos-bpmn.md`](04-procesos-bpmn.md) (2.1) | Procesos actuales y futuros que materializan los cambios de la sección 3 |
| [`07-estrategia-pruebas.md`](07-estrategia-pruebas.md) §7 (9.1) | Pruebas de migración, conciliación y corrida paralela |
| [`08-plan-puesta-en-marcha.md`](08-plan-puesta-en-marcha.md) (8.3, 8.4) | Convivencia, capacitación y gestión del cambio que usan la sección 6 |
| [`09-riesgos-y-raci.md`](09-riesgos-y-raci.md) (1.4, 1.5) | Riesgos asociados a las brechas de fuente y responsables |

---

## 9. Fuentes consultadas

| Fuente | Uso en este documento |
|---|---|
| `docs/especificacion/00-ESPECIFICACION-MAESTRA.md` §1.3, §3, §4.3, §4.4, §7.2, §17, §19 | Principio P9, decisiones, correspondencia de módulos, exclusiones, roles y contraposiciones globales |
| `docs/especificacion/01-registro-decisiones.md` | DEC citadas en la columna Fuente |
| `docs/especificacion/04-matriz-trazabilidad.md` v1.1 §3, §4.1 | Cobertura de fuentes y 26 brechas con su propuesta |
| `docs/especificacion/05-registro-huecos.md` | Huecos resueltos con valores por defecto a validar |
| `docs/especificacion/anexos/T07-MIG-migracion-procoop.md` §9, §19, §20 | Estrategia por tabla, resumen cuantitativo y contraposiciones de migración |
| `docs/especificacion/anexos/M01`–`M19`, `T01`–`T12` | Funciones de GoodApps por dominio |
| `docs/especificacion/03-plan-de-olas-y-prompts.md` v1.1 | Prompts PRO-Ox-nn citados |
| `procoop-relevamiento/README.md` §1 | Menú relevado de ProCoop (nueve pestañas), usado solo para identificar funciones |

Este documento no contiene datos personales, credenciales ni código de ProCoop. Los nombres de tablas de ProCoop se citan solo como identificadores de trazabilidad, tal como figuran en T07.
