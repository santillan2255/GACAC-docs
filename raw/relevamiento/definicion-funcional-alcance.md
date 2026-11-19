# Definición funcional del alcance — Nuevo sistema de gestión para cooperativas de servicios

Versión: 0.1 (borrador para validar)
Fecha: 3/11/2026
Base: relevamiento directo de Procoop 10.4.6.722 (base DEMO de la Cooperativa Eléctrica Laguna Larga) y modelo de datos extraído de `CapaDatos.dll`.

## 0. Cómo leer este documento

**Objetivo:** reproducir las capacidades funcionales de Procoop en un sistema nuevo, moderno (web/SaaS) y mejor diseñado, sin copiar su código ni su interfaz.

Cada función indica en qué evidencia se apoya:

| Marca | Significado |
|---|---|
| **[P]** | Pantalla abierta y observada en Procoop (con captura en `capturas/`). |
| **[M]** | Opción vista en el menú de Procoop, sin abrir la pantalla. |
| **[T]** | Tabla del modelo de datos de `CapaDatos.dll`. Su significado se deduce del nombre y de sus relaciones; hay que confirmarlo con la base o el código. |
| **[I]** | Inferido a partir de lo anterior. Validar con la cooperativa. |
| **Mejora** | Propuesta de modernización respecto de Procoop. |

**Prioridad de cada módulo:**

| Prioridad | Significado |
|---|---|
| **A** | Imprescindible para el paralelo con la cooperativa piloto: facturar, cobrar y gestionar mora de energía y gas. |
| **B** | Necesario para reemplazar Procoop completamente (by pass). |
| **C** | Complementario; se puede diferir. |

Las prioridades son una propuesta y deben acordarse con la cooperativa.

**Escala de lo relevado:**
- **Funciones:** 9 módulos de menú con unas 150 funciones.
- **Datos:** 667 tablas de negocio, más 39 de la app móvil, 31 del portal web y 21 de telemedición.
- **Volumen de facturación:** en la base DEMO hay unos 12.500 comprobantes por emisión mensual.

---

## 1. Mapa general de módulos

| # | Módulo | Prioridad | Origen en Procoop |
|---|---|---|---|
| 1 | Plataforma, seguridad y auditoría | A | Configuración > General |
| 2 | Parámetros y tablas maestras | A | Configuración > Tablas y Parámetros |
| 3 | Personas, titulares y cuentas | A | Servicios a Titulares > Titulares |
| 4 | Catálogo de servicios, categorías y conexiones | A | Tablas de Facturación, fichas de servicio |
| 5 | Medidores y equipos de medición | A | Ficha de servicio > Medidor |
| 6 | Lecturas, consumos y telemedición | A | Servicios a Titulares > Consumos, Operaciones > Telemed |
| 7 | Cuadros tarifarios y motor de cálculo | A | Tablas > Cuadros Tarifarios, Impuestos, Cargos |
| 8 | Facturación de servicios y comprobantes electrónicos | A | Ventas y Facturación |
| 9 | Cuenta corriente del titular | A | Transversal (deuda vencida, comprobantes) |
| 10 | Cobranza: cajas, medios de pago y entes recaudadores | A | Cobranza, Tablas de Cobranzas |
| 11 | Gestión de mora y corte | A | Crédito y Gestión de Mora |
| 12 | Financiación y planes de pago | B | Crédito > Financiaciones |
| 13 | Ventas, presupuestos y punto de venta | B | Presupuestos, Venta de Productos |
| 14 | Técnica: factibilidades, órdenes de trabajo y reclamos | B | Operaciones > Técnica |
| 15 | Redes e infraestructura (GIS) | C | Tablas `REDES_*`, coordenadas |
| 16 | Compras y proveedores | B | Compras y Stock > Gestión de Compras |
| 17 | Stock, bienes de uso, RMA y fabricación | B | Compras y Stock > Stock, RMA |
| 18 | Tesorería y bancos | B | Tesorería |
| 19 | Contabilidad | B | Contabilidad |
| 20 | Sueldos y personal | C | Sueldos |
| 21 | Atención: mesa de entradas, turnero, comunicaciones | B | Herramientas |
| 22 | Actividades y tareas internas | C | Herramientas > Actividades |
| 23 | Traslados y flota | C | Herramientas > Traslados |
| 24 | Gestión institucional (asociados, capital, asambleas) | C | Tablas `SOCIOS`, `CAPITAL`, `ACTAS`, `CONSEJO` |
| 25 | Servicios sociales y otros servicios | C | Planes de Vivienda, `AMBULANC`, `MEDICOS` |
| 26 | Autogestión del socio (portal y app) | B | Procoop WEB / CoopOnline, `CapaDatos.PWeb` |
| 27 | App móvil de campo | B | `CapaDatos.PMovil` |
| 28 | Reportes, tableros y exportaciones | B | Reportes, Tablero de Control, `TABLAS_POWERBI` |
| 29 | Integraciones externas | A/B | ARCA, EPEC, ENARGAS, RED LINK, SIRO, Pagos360, bancos |

---

## 2. Módulo 1 — Plataforma, seguridad y auditoría (A)

**Objetivo:** controlar quién entra, qué puede hacer y dejar trazabilidad de todo.

### Funciones

**Usuarios** [M] (Configuración > Administración de Usuarios)
- Alta, baja y modificación de usuarios.
- Asignación del usuario a un área y a uno o más depósitos.
- Datos propios de cada usuario: alias y punto de venta asignado. En la sesión DEMO se ve "Usuario COOPERATIVA – Alias COOPONLINE – Punto de Venta 0097".
- Tablas: `USERS`, `USERS_AREA`, `USERS_DEPOSITO`, `USERS_EXTRAS`, `CLAVES` [T].

**Perfiles** [M] (Administración de Perfiles)
- Permisos por opción de menú y por tabla.
- Tablas: `PERFILES`, `PERFILES_TABLAS`, `MENUSYS`, `MENUVAL`, `MODULOS` [T].

**Auditoría** [M] (Auditoría de Logueo)
- Registro de ingresos al sistema.
- Auditoría de cambios en los datos.
- Tablas: `AUDITO`, `AUDITORIA`, `INFO_AUD`, `AUDIT_MAIL`, `AUDIT_IA` [T]. Existe una auditoría específica de IA, lo que indica que Procoop ya incorpora alguna función de IA.

**Autorización de Operaciones** [M]
- Operaciones que requieren la aprobación de un supervisor.
- Tabla: `AUTORIZACIONES` [T].

**Bloqueos**
- Bloqueo de registros mientras se editan: `BLOQUEO_FILAS` [T].
- Modo "Sólo LECTURA" en las fichas [P].

**Copia de seguridad, Base de Datos y Actualizar** [M]
- En Procoop son tareas de una instalación local.
- **Mejora:** en un SaaS estas tareas pasan a ser responsabilidad de la plataforma y no del usuario.

**Firma digital y electrónica de documentos**
- Tablas: `FIRMADIGITAL*`, `FIRMASELECTRONICAS*` [T].

**API para terceros**
- Claves y usuarios de servicios web asociados a cuentas: `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS` [T].

**Configuración general del sistema**
- Tablas: `ConfiguracionesSistema`, `INFO_SYS` [T].

### Mejoras propuestas
- Login moderno con OpenIddict, 2FA y recuperación de contraseña.
- Roles con permisos por acción (ver, crear, modificar, anular, aprobar) y no solo por menú.
- Auditoría inmutable que guarde el valor anterior y el nuevo de cada cambio.
- Aprobaciones configurables con un flujo de dos pasos: quien crea no puede aprobar.
- Multi-cooperativa: una base por cooperativa, según la arquitectura definida.

---

## 3. Módulo 2 — Parámetros y tablas maestras (A)

Procoop organiza su parametrización en "Tablas del sistema" por dominio [P]: Generales, Titulares, Cobranzas, Técnica, Facturación, Gestión de Mora, Telefonía, Viviendas, Sueldos, Tesorería, Contabilidad, Compras, SMS, Actividades y Herramientas. Además tiene Parámetros del Sistema y Parámetros Externos [M].

### Geografía y ubicación [T]
- Ubicación administrativa: `PAISES`, `PROVINC`, `LOCALIDA`, `POSTALES`, `DEPARTA`, `DISTRITO_SECCION`.
- Domicilios: `CALLES`, `BARRIOS`.
- Organización del territorio para lectura y operación: `ZONAS`, `SECCION`.
- Catastro (en la ficha [P]): Cod / Sec / Man / Par / PH / Lote.
- Coordenadas latitud y longitud del servicio [P]. Por ejemplo: −31.769237, −63.790995.

### Calendario [T]
- `CALENDARIO`, `CALENDARIO_TIPO`, `FERIADOS`. Se usan para vencimientos y días hábiles.

### Índices económicos [T]
- `INFLACIO`, `TABINFL` (inflación).
- `COT_DOL` (cotización del dólar).
- `TABMORA`, `INDICESMORA` (índices de recargo por mora).

### Tablas fiscales [T]
- IVA: `SITIVA` (situación frente al IVA), `ALI_IVA*` (alícuotas de IVA).
- Ingresos Brutos: `SITIBR`, `ALI_IBR*`.
- `IIBB_LUA`: padrón de Ingresos Brutos.
- `CVPIIBB`: código de validación provincial.

### Tablas genéricas [T]
- `TABLAS`, `TIPO_TAB`, `GRUTAB`, `GRUPTAB`, `ESTATAB`, `COMBOS`.

### Mejoras propuestas
- Un editor de tablas maestras uniforme, con búsqueda y vigencias.
- Importación de padrones (calles, IIBB) por archivo.
- Versionado de parámetros con fecha de vigencia, en lugar de pisar el valor anterior.

---

## 4. Módulo 3 — Personas, titulares y cuentas (A)

**Objetivo:** registrar quién es el cliente, qué cuentas tiene y dónde se presta cada servicio.

### Jerarquía observada [P]

```
Persona  (física o jurídica: nombre, documento/CUIT, contacto)
 └─ Titular  (N° de titular, NIP, activo)
     └─ Cuenta  (N°, domicilio postal, condición de IVA)
         └─ Grupo de Factura (G.F.)   → define qué servicios salen juntos en un comprobante
             └─ Servicio contratado  (tipo + medidor + estado + categoría)
```

Ejemplo real: el titular 1 es la Municipalidad de Laguna Larga, con varias cuentas. Una de ellas tiene ENERGÍA ELÉCTRICA (alumbrado público, conectado) y GAS NATURAL (de baja).

### Funciones

**Administración de Titulares** [P]
- Búsqueda por Persona, Calle, Documento, Titular, rango de titulares (Entre/y) y Cuenta.
- Opciones de búsqueda "Consultar domicilio de servicios" y "Solo cuentas con servicios activos".
- Acciones: Agregar, Modificar, Baja, Consultar, Imprimir y Operación.
- Grilla: N° de titular, Nombre, Documento, NIP y Activo.

**Administración de Personas** [M]
- Personas separadas de los titulares: una persona puede ser titular, garante, profesional o responsable.

**Ficha del titular** [P]
- Pestañas: Datos Persona, Titular, Cuentas y Servicios.
- Árbol de cuentas, grupos de factura y servicios.
- Panel de Trámites de la Cuenta.
- Observaciones con fecha, título y un indicador de **Bloqueo**.
- Adjuntos.
- Contacto directo por WhatsApp y e-mail.

**Consultas e Informes de titulares** [M].

**Datos de cada cuenta** [P]
- Domicilio, condición de IVA (Consumidor Final, Exento…) y descripción.

**Relaciones** [T]
- `VINCULOS` (vínculos entre personas).
- `RESPONSA` (responsables y garantes).
- `RELACION_ENTIDADES`.

**Datos personales** [T]
- `EST_CIVIL`, `OCUPACIO`.
- `PERSONAS_EXTRAS` (campos adicionales configurables).

**Inmuebles** [T]
- `PROPIEDA`, `PROPIESER` (propiedad y servicio), `USOINM`, `ESTINM`.
- Ítems de propiedad con valores (`PROPIEITEMS*`).

**Adhesiones y beneficios** [T]
- `ADHSOC` (adhesiones del socio, por ejemplo factura por mail o débito automático).
- `BENSOC` (beneficios o tarifa social). Existe una carpeta `tarifasocial` entre los binarios.

**Trámites** [T]
- `TRAMITES`, `TRAMITES_ACCIONES`, `PTRAMITES`, `REQUISITOS`, `REQUISITOS_ITEMS`, `EXPEDIENTES`, `EXPEDIENTES_TRAM`.
- Ligado a "Procoop WEB > Requisitos y Trámites" [M].

**Documentación** [T]
- `ADJUNTOS`, `ARCHIVOS`, `DOCUMENT`, `NOTA_SUM`.

**Historia** [T]
- `SUMSOC_HST`, `SERSOC_HST`: históricos de cuentas y servicios.
- `HISBLOQ`, `CAUBLOQ`: historial de bloqueos y sus causas.

### Tablas núcleo [T]
- `PERSONAS`: persona.
- `SOCIOS`: titular o asociado.
- `SUMSOC`: suministro o cuenta del socio.
- `SERSOC`: servicio contratado. Se relaciona con `ACTAFIP`, `SERSOC_PRODUCTOS`, `SERSOC_REDES` y `SERSOC_DEMANDASXPERIODO`.

### Mejoras propuestas
- **Ficha 360°:** en una sola vista, datos, cuentas, servicios, saldo, últimas facturas, pagos, reclamos, trámites y comunicaciones.
- **Validaciones:** CUIT/CUIL con dígito verificador y consulta al padrón de ARCA.
- **Domicilios normalizados:** mapa en el alta y geocodificación.
- **Bloqueos tipados:** que el bloqueo indique qué impide (facturar, cobrar, dar de baja) en vez de ser una observación libre.
- **Cambio de titularidad:** circuito explícito que preserve la deuda y la historia.

---

## 5. Módulo 4 — Catálogo de servicios, categorías y conexiones (A)

**Objetivo:** definir qué servicios presta la cooperativa y cómo se clasifica cada suministro.

### Tipos de servicio
Vistos en la base [P]: ENERGÍA ELÉCTRICA y GAS NATURAL. En el modelo [T] aparecen además:
- Telefonía: `TEL_*`, `TARTEL`, `SERTEL`.
- Internet: `INTERNET`, `MIKROTIK`, `MODEMS`, `SERVINT`.
- Agua: [I].
- Servicios sociales: `AMBULANC`, `MEDICOS`, `INTERNAC`.
- Vivienda: `VIVIENDAS`, `VIV_*`.

### Funciones

**Definición del servicio** [T][P]
- Tablas: `SERVICIO`, `TIP_SERVI`, `CLASESER`.
- "Clase de servicio" se ve en la ficha [P], por ejemplo "4 TASA HOSPITAL MUNICIPAL".
- Tablas relacionadas a Facturación > Clases de Servicios [M].

**Categorías tarifarias** [P][T]
- Ejemplo: "19 ALUMBRADO PÚBLICO".
- Tablas: `CATE_SER`, `CATE_SER_COEFICIENTES`, `CATE_SER_EXTRAS`, `CATTARIF`.
- Grupos de Categorías [M], `GRP_CAT`.
- Recategorización automática, con la marca "No aplica recategorización" [P].

**Estados del servicio** [P][T]
- Ejemplos: CONECTADO, baja.
- Se registra la fecha del último estado.
- Tablas: `ESTASER`, `OBSESTAD`, `RESESTAD`, `CERESTAD`.

**Datos del servicio contratado** [P]
- Domicilio, referencia, catastro, DD JJ, contrato, inmueble y GIS.
- Actividad (con relación a Actividades ARCA [M]) y garante.
- Grupo de factura y fechas de alta y baja.
- Profesional instalador (`PROFESIO` [T]), número y vencimiento de certificado, e Id de cliente.
- Marcas Provisorio / Cobrar provisorio y "No Facturar".
- "Alta desde CoopOnline", es decir, alta iniciada por el portal.
- Id de factibilidad, matrícula y coordenadas.

**Demanda** [P][T]
- Demanda en pico y fuera de pico, para tarifas con potencia contratada: `SERSOC_DEMANDASXPERIODO`.

**Conexión** [T]
- `CONEXION`, `CONE_BONIF` (bonificación de conexión).

**Productos y conceptos facturables por servicio** [M][T]
- Servicios para Facturar, Productos.
- Tablas: `PROD_SER`, `PROD_SER_REC_DES` (recargos y descuentos), `PROD_SER_RET` (retenciones), `PROD_SER_UBICACION`.

**Altas y Bajas Automáticas de Servicios** [M]
- Tabla: `ALTASEAU` [T].

**Servicios no facturables** [T]
- `SUMNOFAC`.

**Gas** [T][M]
- Artefactos del suministro: `ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS`.
- Factor de corrección y PCS (poder calorífico): `CORREGAS`, `PRCAGAS`.
- Información para ENARGAS: `ENGAS_CANTMESES` y la carpeta `ENARGAS`.
- Opciones de Gas [M].

**Prepago** [M][T]
- Configuración de Prepaga: `PREPAGA`.
- En la base hay facturas de energía en modalidad prepaga [P].

### Mejoras propuestas
- El catálogo de servicios se configura sin programar: atributos por servicio, estados y transiciones permitidas.
- Historial de categoría por vigencia, para facturar cada período con la categoría que correspondía.
- Plantillas de servicio reutilizables entre cooperativas.

---

## 6. Módulo 5 — Medidores y equipos de medición (A)

### Funciones [P][T]

**Ficha del medidor** [P]
- Modelo (ej. 1 Galileo), Id del medidor (ej. 5884320) y tipo (MONOFÁSICO).
- Cantidad de dígitos, factor de multiplicación (1,0000) y HP.
- Unidades bonificadas.
- Medidor testigo.
- Observaciones del medidor.
- Marca "Lectura recibida con factor de multiplicación".

**Tablas** [T]
- `MEDSOC` (medidor instalado en el servicio) y `HIS_MEDSOC` (historial de colocación y retiro).
- `MARMED` (marcas), `TIPMED` (tipos), `ESPE_MED` (especificaciones).
- `MEDIDORP`, `MED_TESTIGO`, `OBSMED`.
- Testigos de consumo: `CONS_SER_TESTIGO`.

**Cambio de medidor**
- Las observaciones de los servicios registran órdenes de trabajo del tipo "CAMBIO DE NUMERO" [P].
- El cambio de medidor genera historia y lectura de retiro y colocación [I].

### Mejoras propuestas
- Inventario de medidores integrado con stock: estado, ubicación y número de serie.
- Cambio de medidor guiado, con lectura final del medidor retirado e inicial del nuevo, y con el consumo partido en el período.

---

## 7. Módulo 6 — Lecturas, consumos y telemedición (A)

### Funciones

**Registro manual de Lecturas** [P]
- Encabezado: fecha, período (mes y año), servicio, titular, cuenta, observación y marca "Consumo Estimado".
- Grilla: servicio, fecha anterior, lectura anterior, consumo anterior, lectura actual, consumo actual, tipo de energía y concepto. El botón "Correcto" confirma.
- Datos del servicio: categoría, característica, N° de medidor, dígitos, domicilio, factor de multiplicación, Cos φ (factor de potencia) e Indicado.
- Historial de consumos: categoría, medidor, fechas y lecturas, días, consumo, período y factura.
- Botón "Consulta de consumos".

**Ruta de lectura** [P][T]
- Zona, Sector y Recorrido de cada servicio. Ejemplo: zona 30, sector 1, recorrido 250.
- Tablas: `CONNRUTA`, `CONNZONA`.

**Lectura en campo** [T]
- App móvil (`CapaDatos.PMovil`, `MOVIL`, `VARIABLE_PMOVIL`).
- Horas de los lectores: `SU_HORAS_LECTOR`.

**Telemedición** [M][T]
- Menús: Telemed > Administración, Informes y Configuración.
- Tablas: `TELEMEDICION`, `TELEMED_COMM`, `LEC_MEDTEL`, `AUDITORIA_TELEMEDICION`, y el namespace `CapaDatos.Telemed.Telemedicion`.

**Consumos** [T]
- `CONS_SER` (consumo por servicio y período), `CONSUMOP`, `DST_CONSUMO` (distribución del consumo).
- Información técnica por banda horaria [I]: `INFOCTD`, `INFOCTN`, `INFOCTG`.
- Bandas: `BANDAS`.

**Otras opciones** [M]
- Opciones de consumos, Informes de Consumos, Opciones de Telefonía (consumo telefónico).

**Control de consumos** [T][I]
- `CTRLCNC`: control de consumo fuera de rango.

### Mejoras propuestas
- **App de lectura offline:** foto obligatoria cuando el consumo está fuera de rango, GPS, novedades codificadas y sincronización.
- **Validación automática:** consumo cero, negativo o fuera de un rango histórico configurable. Bandeja de excepciones antes de facturar.
- **Estimación configurable:** promedio de los últimos N períodos o del mismo período del año anterior.
- **Telemedición:** importación estándar de lecturas desde AMI/MDM.

---

## 8. Módulo 7 — Cuadros tarifarios y motor de cálculo (A)

**Objetivo:** el precio de cada concepto según el servicio, la categoría y la vigencia.

### Funciones

**Administración de Cuadros Tarifarios** [P]
- Listado: Descripción, Código, Usuario, vigencia Desde y Hasta. Acciones: Nuevo, Modificar, Imprimir.
- Los cuadros se versionan por vigencia y se nombran por mes o por norma. Ejemplos: "ABRIL 2026", "196/2023 GAS", "ANTES CAMBIO FODEP 10%", "ANTES DE RG 129 MARZO".

**Detalle histórico por cuadro** [T]
- `CUADROS` se relaciona con:
  - `HIS_CATTARIF`: tarifa por categoría.
  - `HIS_CATE_SER` y `HIS_CATE_SER_EXTRAS`: valores por categoría de servicio.
  - `HIS_IMPUESTO`: alícuotas de impuestos.
  - `HIS_CARGOS_ADICIONALES`: cargos.
  - `HIS_PROD_SER`: precios de productos y servicios.
  - `HIS_SERVICIO` y `HIS_SERVICIO_EXTRAS`.
  - `HIS_TAR_ADHE`: tarifas de adhesiones.
  - `ITEMSFAC_EXTRAS`.
- **Conclusión:** cada cuadro guarda una foto completa de precios e impuestos vigentes, y cada factura queda ligada al cuadro que la valorizó.

**Cargos e impuestos** [M][T]
- Cargos Adicionales: `CARGOS_ADICIONALES`.
- Impuestos: `IMPUESTO`, `IMPUESTOS_X_CAT`.
- Conceptos para Cálculo de Intereses: `CONCEPTOS_INT`.
- Recargos: `RECARGOS`.

**Coeficientes y factores** [T]
- `FACTOR_CAL`, `CATE_SER_COEFICIENTES`, `BANDAS`.

**Bonificaciones** [T]
- `GRATIS`, `TEMPMODIFBONIF`, `CONE_BONIF`.

**Componentes de la factura observados** [P]
- Energía: kWh × precio unitario. Ejemplo: 18,30 × $270,33.
- Tasas de terceros: alumbrado público, Decreto 2298/00 (0,40 %), RG 27/2015, entre otras.
- IVA y otros impuestos.

### Mejoras propuestas
- **Motor de tarifas declarativo:**
  - Cargo fijo.
  - Cargo variable por escalones o bloques.
  - Cargo por demanda (potencia).
  - Mínimos.
  - Tasas como porcentaje o importe fijo, con su base imponible.
  - Topes y bonificaciones.
- **Simulador:** antes de publicar un cuadro nuevo, recalcular un período sobre todo el padrón y comparar contra el cuadro anterior.
- **Aprobación:** circuito de doble firma, quien carga y quien aprueba.
- **Trazabilidad normativa:** cada cuadro se vincula a la resolución (ERSeP, ENARGAS, municipal) con el PDF adjunto.

---

## 9. Módulo 8 — Facturación de servicios y comprobantes electrónicos (A)

### Funciones

**Administración de Comprobantes** [P]
- Navegación por rangos semanales de fecha de emisión, con criterio de agrupación configurable.
- Búsqueda libre y filtros.
- Grilla: fecha, comprobante (tipo + PV + N°, ej. `Spb 0022-00128032`), cuenta, titular, nombre, total y anulada, con fila de totales.
- Acciones: Agregar, Consultar, Elemento, Operaciones, Imprimir y Vista.
- Volumen: 12.499 comprobantes en una semana, por $629.206.692,60 [P].

**Detalle del comprobante** ("Registro de Facturas Manuales") [P]
- Cabecera:
  - Tipo (ej. "97 - LIQ. DE SERV. B"), punto de venta, número y letra, fecha.
  - Cuenta y domicilio, titular y vendedor.
  - Cuota (ej. PR = PREPAGO), depósito y período.
  - **Deuda vencida** del titular y marca "Registrar Pago".
- Renglones: descripción, cantidad, precio unitario, impuestos, IVA y neto.
- Totales: sub neto, descuento %, neto, percepciones, IVA, otros impuestos y total.
- **Hasta 4 vencimientos**, cada uno con su fecha y su total con recargo.
- "Replicar Comprobante".

**Facturación masiva** [M][T]
- Configurar Facturación Masiva [M].
- Lote de facturación mensual: `FACTMES`, `FACTMES_COMP`, `FACTMES_CTAS`, `SFACTME`.

**Conjuntos y grupos** [M][T]
- Conjuntos de Facturación (`CONJUNTO`), Grupos de Facturación, Grupos de Factura (`GRUPOS_FACTURA`).

**Diseño de la factura** [M][T]
- Órdenes de impresión en Facturas.
- Grupos de impresión de gráfico en facturas: `GRUPOS_GRAFICO`, `GRAFTAB` (gráfico de consumos en la factura).

**Vencimientos** [M][T]
- Tramas de vencimientos de Facturas: `TRAMASREC`, `CALENDARIO`.

**Tipos de comprobante y talonarios** [M][T]
- Tipos de Comprobantes: `TIP_COMP`, `TIPO_FAC`, `COMPROB`.
- Puntos de venta: `PTOVENTA`.
- Talonarios: `TALONFAC`, `TALONFAC_HST`, `TALONFAC_PAGO`.

**Factura electrónica ARCA** [P][M][T]
- Alerta al iniciar: "Hay facturas electrónicas pendientes de autorizar" y grilla "Comprobantes Pendientes de Autorizar" [P].
- Tablas: `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP`, `EMPAFIP`.
- Códigos de Autorización ARCA (CAEA, CESP) [M]: `CESPAFIP`.
- Actividades ARCA: `ACTAFIP`.

**Código de Validación Provincial (CVP)** [M][T]
- `CVPIIBB`.

**Anulación** [T]
- `ANUFAC`, `ANUITEMSFAC`, `ANUITEMSFAC_EXTRAS`. La anulación queda en tablas espejo.

**Causas de Bloqueo de Comprobantes** [M]
- Tabla `CAUBLOQ` [T].

**Facturación por cuenta de terceros** [T]
- `FACTURAS_TERCEROS`: tasas municipales, hospital y otras.

**Relación entre comprobantes** [T]
- `RELACION_COMP`: por ejemplo, una nota de crédito que referencia a su factura.

**Libro IVA Ventas** [M]
- Tabla `IVAVTA` [T].

**Informes de Ventas y Facturación, Movimiento de Conceptos** [M].

**Energía comprada a EPEC** [T]
- `FACT_EPEC`. Indica la integración con la distribuidora provincial de Córdoba, que vende energía a la cooperativa [I].

**Informe ENACOM** [M]
- Configuración de Conceptos para informe ENACOM (servicios TIC).

### Mejoras propuestas
- **Facturación como proceso por lotes con estados:**
  1. Preparar.
  2. Pre-facturar (borrador).
  3. Revisar excepciones.
  4. Aprobar.
  5. Emitir y autorizar en ARCA.
  6. Distribuir.
- **Autorización asíncrona en ARCA** por cola (Queue Storage), con reintentos y tablero de pendientes. Elimina la alerta manual de "pendientes de autorizar".
- **PDF con QR de ARCA** generado con QuestPDF.
- **Distribución:** envío por e-mail o WhatsApp y publicación en el portal.
- **Anulación por nota de crédito asociada,** nunca por borrado.
- **Re-facturación de un servicio puntual** sin re-procesar el lote.

---

## 10. Módulo 9 — Cuenta corriente del titular (A)

### Funciones [P][T][I]

**Deuda vencida** [P]
- Se muestra en cada comprobante, en rojo.

**Deuda por comprobante** [T]
- `DEUDAVTA`: deuda por venta o comprobante.
- `FACTURAS` se relaciona con `IT_RECCO` (ítems de recibos de cobro), `IT_PAGSO` (ítems de pagos del socio), `CAPITAL` y `COMPNOTI` (comprobantes notificados).

**Anticipos y saldos a favor** [T]
- `ANTICIPOS`, `ANTIFACTU`.

**Recargos por pago fuera de término** [T]
- `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS`.

**Créditos no automáticos** [T]
- `CREDITOS_NOAUTOMATICOS`.

### Mejoras propuestas
- **Libro mayor del cliente** como única fuente de verdad: cada débito (factura, nota de débito, interés) y cada crédito (pago, nota de crédito, anticipo) es un asiento.
- **Saldo derivado** de ese libro, nunca editable a mano.
- **Imputación configurable:** a la deuda más antigua primero, o a la que elija el titular.
- **Pagos excedentes** como saldo a favor.
- **Estado de cuenta** descargable por el socio.

---

## 11. Módulo 10 — Cobranza: cajas, medios de pago y entes recaudadores (A)

### Funciones

**Caja** [M][T]
- Apertura de Caja, Cobranza Local y Cierre de Cajas.
- Tablas: `CAJAS`, `CAJASJP`, `PLAN_CAJ`, `ANUPLAN_CAJ`, `CIERRE`.

**Cobro** [T]
- `PAG_SOC` (pago del socio), `IT_PAGSO` (ítems del pago).
- Anulación: `ANUPAG_SOC`, `ANUIT_PAGSO`.

**Medios de pago** [T]
- `FORMAPA`, `FPITEMS`, `FPALIC_IVA`.
- Tarjetas: `TARJETAS`, `TARJETAS_RECARGO`, `PAGOTAR`, `CUPONTAR`.
- QR: `CAJAS_QR`.
- `CANALES_PAGOS`.

**Descuentos en caja** [P][T]
- Administración de Descuentos en Caja: `DESCUENTO_CAJA`.

**Entes recaudadores** [P][T]
- En la DEMO: DOCUMENTOS A COBRAR, RED LINK y SIRO.
- Tablas: `ENTIDADES`, `ENTIDACOL*`, `ENTIDACON`, `ENTIDACOU`, `ENTIDACRIT`, `ENTIDADCIR`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN`, `ENTIDA_ESTADOS`.
- Empresas Tercerizadas [M].

**Intercambio de archivos con los entes** [P]
- Generar Archivo para Entidad Recaudadora.
- Importar Archivo de Novedades.
- Importar Archivo de Morosidad.
- Tablas [T]: `RED_LINK`, `DEUDARED`, `DEUDARED_TIPO`, `SIRO_BASEDEUDA`, `RECHAZOS`.

**Débito automático** [P][T]
- Importar y exportar archivos de débitos automáticos. Exclusiones: `DEBITO_EXCLUSION`.
- Carpeta `Debitos` entre los binarios.

**Pagos online** [T]
- Pagos360: `PAGOS360`, `PAGOS360_ITEMS`, `PAGOS360_PAGOS`, `PAGOS360_EXTRAS`.

**Retenciones sufridas en cobros** [M][T]
- Retenciones Recibidas: `RETENCIO`, `IT_RETM`.

**Opciones e Informes de Cobranza** [M][T]
- `ESQUEMAS_INFORMES_COBRANZAS`, `COBRANZA_LOG`.

**Recibos** [T]
- `REC_CON`, `IT_RECCO`.

### Mejoras propuestas
- **Conectores por ente** (RED LINK, SIRO, Pagos360, bancos):
  - Generación automática del archivo de deuda tras cada facturación.
  - Ingesta automática de la rendición.
  - Conciliación con diferencias explícitas.
- **Pago online en el portal:** botón de pago, QR interoperable y link de pago por WhatsApp.
- **Caja web:** cobro por código de barras de la factura, arqueo y cierre con diferencias.
- **Bandeja de pagos no identificados.**

---

## 12. Módulo 11 — Gestión de mora y corte (A)

### Funciones

**Instancias de mora** [P]
- 1 CANDIDATOS, 2 PRIMER INSTANCIA, 3 SEGUNDA INSTANCIA.
- Tablas: `INSTANCI` [T] y Instancias de Mora [M].

**Generar Notificaciones (1ª instancia)** [M]
- Tablas: `NOTIFICA`, `COMPNOTI`, `RESPONSA_NOTIFICA`, `NOTI_COOP` [T].

**Tratamiento de Notificaciones Generadas y Tratamiento de Morosos** [M]
- Tabla: `MOROSO_TEMPORAL` [T].

**Excepciones de Mora** [M]
- Tabla: `EXC_MORA` [T].

**Causas de Baja** [M]
- Tabla: `CAUSAS` [T].

**Tasas e índices de recargo** [P][T]
- Administración de Tasas de Mora.
- Tablas de Índices para Recargo por Mora: `TABMORA`, `INDICESMORA`.
- Tasa por servicio y categoría: `MORATAS`, `MORATAS_CATSER`.

**Operaciones Especiales de mora** [M].

**Informes de Gestión de Mora** [M].

### Flujo inferido [I]

```
Factura vencida
  → Candidato
  → Notificación de 1ª instancia (aviso)
  → 2ª instancia (intimación)
  → Orden de corte (técnica)
  → Corte
  → Reconexión al pagar o financiar
```

Las excepciones de mora excluyen cuentas del proceso, por ejemplo entidades públicas o electrodependientes.

### Mejoras propuestas
- **Política de mora configurable** por servicio y categoría: días, montos mínimos, instancias, canal de aviso.
- **Exclusiones normativas** (electrodependientes, entre otras) y aprobación del corte.
- **Integración con Técnica:** el corte y la reconexión generan órdenes de trabajo automáticamente.
- **Avisos con constancia de entrega:** e-mail, SMS, WhatsApp y carta.

---

## 13. Módulo 12 — Financiación y planes de pago (B)

### Funciones [M][T]

**Emitir Plan de Financiación e Informes de Financiaciones** [M]
- Tablas: `PPAGOS` (plan de pagos), `PPITEMS`, `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS` [T]. El plan lleva firma del titular y de los garantes.

**Planes de cuotas** [M][T]
- Planes de Cuotas: `PLAN_CUO`.
- Entidades financieras: `ENTFIN`, `TIP_FIN`.

**Financiación de ventas** [M][I]
- Cuotas cargadas en la factura del servicio.

### Mejoras propuestas
- **Simulador de plan:** anticipo, cuotas, tasa y CFT.
- **Firma digital** del convenio.
- **Caída automática del plan** por cuotas impagas y re-exigibilidad de la deuda.

---

## 14. Módulo 13 — Ventas, presupuestos y punto de venta (B)

### Funciones [M][T]

**Presupuestos** [M]
- Tablas: `PRESUPU`, `PRESUIT`, `PRESUIT_CONJUNTOS`, `PRESUPU_CONDICION`, `PRESUPU_NOTAS`, `PRESUPU_COMPROBANTES`.
- Condiciones de Venta para Presupuestos [M].

**Venta de Productos** [M]
- Comprobantes de venta y su rendición: `COMP_VEN`, `IT_COMPV`, `OB_COMPV`, `COMP_VEN_RENDICION*`.

**Vendedores** [M][T]
- `VENDEDOR`.

**POS** [T]
- `COMPPOS`, `DESCPOS`.
- Telefonía POS: `TEL_POS_REG_*`.

**Conceptos por cobrar en operaciones con titulares** [M]
- Por ejemplo derechos de conexión o reconexión, que se facturan con el servicio.

### Mejoras propuestas
- Presupuesto, aceptación online, orden de trabajo y factura, en un flujo continuo.

---

## 15. Módulo 14 — Técnica: factibilidades, órdenes de trabajo y reclamos (B)

### Funciones

**Administración de Factibilidades** [M]
- Tablas: `FACTIBIL`, `FACTIBIL_NOTA` [T].
- El servicio guarda el "Id Factibilidad" de la factibilidad que lo originó [P].

**Administración de Órdenes de trabajo** [M]
- Tablas: `TECNICA`, `TECNICA_EXTRAS`, `TECNICA_NOTA`, `TECNICA_NECESIDAD`, `ITEMSORD` (materiales), `RESOL_OT` (resolución), `OT_REPORTE` [T].

**Carga Rápida de Reclamos** [M]
- Tablas: `RECLAMOS`, `RECLAMOS_HIST`, `RECLAMOS_NOTAS`, `FALLAS` [T].

**Tareas y cuadrillas** [T]
- `TAREAS`, `TAREASOM`, `GRPTAREA`, `CUADRI` (cuadrillas), `OPERADOR`, `TPTRAB`.

**Ejecución en campo** [T]
- App móvil: `TECNICA_MOVIL`.
- Materiales retirados: `RETI_MAT`.

**Obras** [T]
- `OBRAS`, `GRPOBRA`.

**Clasificación técnica y expedientes** [T]
- `TECNGREXP`, `TECNOTEXP`, `TECNSEEXP`.

**Informes técnicos** [M].

### Mejoras propuestas
- **Tablero de órdenes:** kanban y mapa, con asignación a cuadrillas.
- **App de campo:** fotos, firma del cliente, materiales usados que descuentan stock, y cierre con lectura de medidor.
- **Reclamos:** SLA por tipo y aviso al socio de cada cambio de estado.
- **Integración con mora:** corte y reconexión.
- **Factibilidad como paso previo obligatorio** del alta de servicio.

---

## 16. Módulo 15 — Redes e infraestructura (GIS) (C)

### Funciones [T][P]

**Red eléctrica** [T]
- Componentes, atributos, capas, relaciones y red instalada: `REDES`, `REDES_ATRIBUTOS`, `REDES_ATRIBUTOS_COMPONENTES`, `REDES_CAPAS`, `REDES_COMPONENTES`, `REDES_RED_INSTALADA`, `REDES_RELACIONES_COMPONENTES`.

**Vínculo servicio–red** [T]
- `REDES_SERVICIOS`, `SERSOC_REDES`. Indica, por ejemplo, de qué transformador cuelga cada suministro.
- Niveles: `NIV_CAPA`, `NIV_REDES`, `NIV_SERV`.

**Mapa** [P][T]
- `MAPA`, `UBICACIONES` y las coordenadas de cada servicio.
- Campo "GIS" en la ficha.

**Equipos de red** [T]
- `EQUIPOS`, `CENTRALT`.

### Mejoras propuestas
- **Mapa web** de suministros, red, reclamos y órdenes.
- **Análisis de impacto:** qué socios se afectan ante el corte de un transformador, con aviso masivo.

---

## 17. Módulo 16 — Compras y proveedores (B)

### Circuito [M][T]

```
Solicitud de Aprovisionamiento (SAPROV / IT_APROV)
  → Solicitud de Cotización (SCOTIZ / IT_SCOTIZ)
  → Orden de Compra (OCOMPRA / CMPORDE)
  → Nota de Pedido (NPEDIDO / IT_NPED)
  → Remito de Proveedor / Recepción (RECEPCIONES / ESTADOS_RECEP)
  → Comprobante de Proveedor (COMP_COM / IT_COMPC / MOV_PRO)
  → Pago a Proveedores, con Retenciones (CON_COM_RET / RET_COM)
```

### Funciones

**Proveedores** [T]
- `PROVEED`, `PROVEED_CBU`, `PROVEED_RET`, `PROVEED_TIPPROD`, `PROVEED_AUT`, `PROVEED_VALORACIONES` (evaluación de proveedores).
- Rubros: `RUBPROV`, `RUBXPRO`.
- Circuito y observaciones: `CIRCUPRO`, `OBS_PRO`.

**Retenciones a Proveedores** [M][T]
- Ganancias, IVA e IIBB: `RETE_TIPO`, `RETE_TIPO_BASE`, `RETS_TIPO`, `CAT_RETG`.
- Ligado a SICORE / SIRE [I].

**Libro de IVA Compras** [M][T]
- `IVACOM`, `IVACOM_COMBUSTIBLES`, `IVACOM_WEB`.

**Otros** [M][T]
- Informes de Compras, Correspondencia.
- `COMPRAS_RELACION`, `OPE_COM`, `CON_COM`.
- `RPSPROV`, `RPSXPROV`.

### Mejoras propuestas
- **Aprobaciones por monto.**
- **Control de 3 vías:** orden de compra, recepción y factura.
- **Importación de comprobantes recibidos** desde ARCA ("Mis Comprobantes").
- **Pago por transferencia** con archivo para Interbanking.

---

## 18. Módulo 17 — Stock, bienes de uso, RMA y fabricación (B)

### Funciones [M][T]

**Movimientos de Stock** [M]
- Depósitos: `DEPOSITO`, `DEPAPROD`.
- Transferencias: `TRANSFER`.
- Tipos de producto: `TIP_PROD`, `CLASIFICACION_ITEMS`.

**Trazabilidad** [M]
- Números de serie y lotes: `TIPOLOTE` [T].

**Operaciones Especiales** [M].

**Bienes de Uso** [M][T]
- `BIENES_USO`, `BIENES_USO_AMORT` (amortizaciones), `BIENES_USO_DISM` (bajas), `BIENES_USO_HST`, `BIENES_USO_CTSEC` (imputación contable).

**Fabricación** [M][T]
- Productos fabricados y sus divisiones: `PRODFAB`, `PRODFAB_DIVISIONES`, `HIS_PRODFAB`.
- Órdenes de fabricación: `ORDEFAB`, `ORDEFAB_EXT`, `ORDAFAB`, `ORCOFAB`, `ORPRFAB`.
- Etapas: `ETAFAB`.
- Partes: `OF_PARTE_COMPONENTE`, `OF_PARTE_ITEM`, `OF_PARTE_PRODUCCION`.

**RMA (devoluciones y reparaciones)** [M][T]
- `RMA_PRODUCTOS`, `RMA_HISTORIAL`.

**Informes de Stock** [M].

**Unidades de gasto** [T]
- `UNIDADES_GASTOS`.

### Mejoras propuestas
- **Consumo de materiales desde la orden de trabajo** en la app de campo.
- **Stock mínimo** con sugerencia de compra.
- **Medidores y equipos serializados** con su ubicación: depósito, cuadrilla o domicilio del socio.

---

## 19. Módulo 18 — Tesorería y bancos (B)

### Funciones [M][T]

**Bancos** [M][T]
- Movimientos Bancarios y Cuentas Bancarias Propias.
- Tablas: `BANCOS`, `BANKOS`, `Banco`, `BANCLA`, `CAT_BANC`, `TIPOBAN`, `CATB_MOVS`.

**Conciliación bancaria** [T]
- `RESBAN`, `RESBAN_MOVINT`.

**Interbanking** [T]
- `INTERBANKING`, `MOV_INTERBANKING`, `SU_AUDIT_TRA_INTERBANKING`.

**Movimientos en Tesorería** [M][T]
- `TESORE`, `MOV_TRH`, `TRAN_OP`, `EFEC_OP`, `CONTES`.

**Valores** [M][T]
- Valores de Terceros, Cheques Propios, Cupones de Tarjetas.
- Tablas: `VALORES`, `VAL_ESTA`, `VAL_MVTO`, `CHEQUERAS`, `TIP_VAL`, `CUPONTAR`.

**Monedas** [T]
- `TIP_MON`, `COT_DOL`.

**Cajas para Pagos a Proveedores** [M][T]
- `CAJAPAGO`.

**Cierre de Cajas e Informes de Tesorería** [M].

### Mejoras propuestas
- **Importación de extractos** con conciliación asistida.
- **eCheq.**
- **Flujo de fondos proyectado** a partir de vencimientos a cobrar y a pagar.

---

## 20. Módulo 19 — Contabilidad (B)

### Funciones [M][T]

**Asientos** [M][T]
- `CTASIEN`, `CTITASIE`, `CTITASIE_SECCIONES`.

**Consultar Mayor y Balance General / Sumas y Saldos** [M].

**Plan de cuentas** [T]
- `CTPLAN`, `CTPLAN_SUBRUBROS`, `CTSRUBROS`.

**Ejercicios** [T]
- `CTEJER`.

**Centros de costo o secciones** [T]
- `CTSECCION`, `CTSECCION_ASIGNA`, `CTSECCION_GRUPOS`, `CTSECCION_GP_ASIGNA`, `CTSECC_X_CTA`.

**Asientos Automáticos** [M][T]
- Cada módulo tiene su imputación contable:
  - Asignación de cuentas: `CTCUENTA_ASIGNA`.
  - Bienes de uso: `BIENES_USO_CTSEC`.
  - Medios de pago: `FPITEMS_CTSEC`.
  - Obras: `GRPOBRA_CTSEC`.
  - Incidentes: `CAT_INCI_CTSEC`.

**Categorías INAES** [T]
- `CAT_INAES`, para la información al organismo de control de cooperativas.

**Herramientas, Informes Contables e Informes de Gestión** [M].

**Sistema contable externo** [T]
- `SISCONT`: probable integración o exportación a otro sistema contable.

### Mejoras propuestas
- **Contabilización en tiempo real** desde cada evento (factura, cobro, pago, liquidación), con reglas configurables.
- **Cierre de período** con bloqueo.
- **Estados contables** en formato INAES.

---

## 21. Módulo 20 — Sueldos y personal (C)

### Funciones [M][T]

**Empleados** [M][T]
- `SU_EMPLEADOS`, `SU_EMPLEADOS_DOCUMENTOS`, `SU_EMPLEADOS_SEC`.
- Familiares: `SU_EMP_FAMILIARES`.
- CBU: `SU_EMP_CBU`.
- Novedades: `SU_EMP_NOVEDADES`.
- Turnos: `SU_EMP_TURNOS`, `SU_TURNOS`.
- Historial de categoría: `SU_EMP_HISCAT_EMP`.
- Situación de revista: `SU_SITUACION_REVISTA`.
- Licencias: `SU_LICENCIAS`.

**Empresas empleadoras** [M][T]
- `SU_EMPRESAS`, `SU_TIPOEMPLEADOR`.

**Recibos de sueldo** [M][T]
- `SU_SUELDOS`, `SU_SUELDOSIT`, `SU_TIPO_RECIBOS`.

**Liquidación Masiva y Simulador** [M].

**Impuesto a las Ganancias** [M][T]
- `SU_DEDUCCIONES*`, `SU_SUELDOS_DETGAN`.

**Configuración** [M][T]
- Variables, Conceptos y Aplicar Aumentos: `SU_VARIABLES`, `SU_CONCEPTOS`, `SU_CONCEPTO_TIPO`.
- Categorías, cargos, sindicatos y salario mínimo: `SU_CATE`, `SU_CARGO`, `SU_SINDICATO`, `SU_SALARIO_MINIMO`.

**Seguridad social** [T]
- SICOSS: `SU_BENEFICIOS_SICOSS`.
- ART / siniestros: `SU_SINIESTRADO`.

**Asientos de sueldos** [T]
- `SU_ASIENTOS`.

**Libro de sueldos digital** [M]
- Deshabilitado en la DEMO.

### Mejoras propuestas
- Evaluar si conviene integrar un liquidador de sueldos externo en lugar de construirlo.
- Portal del empleado con recibos y firma digital.

---

## 22. Módulo 21 — Atención: mesa de entradas, turnero y comunicaciones (B)

### Funciones

**Mesa de Entradas** [M][T]
- Administración, Consulta de Incidentes e Informes.
- Sistema de tickets:
  - Tipos, subtipos y estados: `TICKETS`, `TICKETS_TIPOS`, `TICKETS_SUBTIPOS`, `TICKETS_ESTADOS`, `TICKETS_TIPOSESTADOS`.
  - Responsables y asignaciones: `TICKETS_RESPONSABLES`, `TICKETS_ASIGNACIONES`.
  - Contactos y notas: `TICKETS_CONTACTOS`, `TICKETS_NOTAS`.
  - Medios de atención y módulos: `TICKETS_MEDIOSATENCION`, `TICKETS_MODULOS`.
  - Proyectos y horas bonificadas: `TICKETS_PROYECTO`, `TICKETS_HSBONIF`.
- Incidentes: `CAT_INCI`, `CLAS_INC`, `PARTIINC`.

**Turnero** [M][T]
- Administración de Box, Turnero, Selección de Turnos y Estadísticas.
- Tablas: `TURNOS`, `TURNOS_HISTORIAL`, `TUR_AREAS`, `TUR_AREAS_USERS`, `TUR_BOX`, `TUR_BOX_HISTORIAL`, `TUR_TIPO_BOX`.

**Telefonía y llamadas** [T]
- `LLAMADAS`, `TIPOLLAM`, `IVR`, `RNQCALL`, `ENTRANTE`.

**SMS** [M]
- Administración de SMS.

**Correo y mensajería** [T]
- `SENDMAIL`, `PROMAIL`, `CORREOSINT`, `CORREOS_INTERNOS`, `MENSAJES`, `ENVIOS`, `MailTemplates`.

**WhatsApp** [P][T]
- Botón en la ficha del titular [P].
- Plantillas: `PLANTILLA_WSP`, `VARIABLES_PLANTILLA_WSP` [T].

**Plantillas de documentos** [T]
- `PLANTILLA`, `VARIABLEPLANT`, `CIRCULAR`.

**Encuestas** [T]
- `ENCUESTAS`, `RESPUESTAS`, `RESULTA`, `RESULTADOS`.

**Noticias y centro de notificaciones** [P][T]
- Panel "Próximamente / Noticias Procoop" y "Centro de notificaciones" en la pantalla principal [P].
- Tablas: `RSSFEED`, `WEB_NOVEDADES`.

### Mejoras propuestas
- **CRM unificado:** todas las interacciones del socio (llamada, WhatsApp, mail, ventanilla, portal) en un solo historial ligado a la cuenta.
- **WhatsApp Business API** con plantillas aprobadas y bot de autogestión: saldo, segunda vía de factura, reclamo.
- **Turnero web** con turno online.

---

## 23. Módulo 22 — Actividades y tareas internas (C)

### Funciones [M][T]
- Seguimiento e Informe.
- Tablas: `ACTIV`, `ACTIV_SEG`, `ACT_AREAS`, `ACT_FREC`, `ACT_RBR`, `ACT_TIPOS`, `ACTIPREV` (actividades preventivas), `HISWORK`, `IMP_WORK`.

**Tablero de Control** [M][T]
- `TABLERO`.

---

## 24. Módulo 23 — Traslados y flota (C)

### Funciones [M][T]
- Administración de Viajes, Informes, Rendiciones de Viajes [M].
- Choferes y vehículos: `CHOFERES`, `MAQUINAS`.
- Combustibles: `COMBUSTIBLES`, `IVACOM_COMBUSTIBLES`.
- Seguimiento GPS: `AVL_REG` y la DLL `AVL.dll`.
- Ambulancias, ligado a los servicios sociales: `AMBULANC`, `AMBUCARACTE`, `AMBUMED`.

---

## 25. Módulo 24 — Gestión institucional (C)

### Funciones [T][I]
- **Asociados:** registro, número de asociado y antigüedad: `SOCIOS`, `SU_ANTIGUE`.
- **Capital social:** suscripción e integración, cobrada en la factura: `CAPITAL`, `CAPITAL_RES`, `RUBCAPI`. `FACTURAS` y `SERVICIO` se relacionan con `CAPITAL`.
- **Consejo de administración y actas:** `CONSEJO`, `ACTAS`.
- **Reuniones y asambleas:** `REUNIONES`, `REUNIONES_ASIST`, `REUNIONES_PERMISOS`, `REUNIONES_TEMAS`.

### Mejoras propuestas
- Padrón de asociados para asambleas.
- Convocatoria y registro de asistencia.

---

## 26. Módulo 25 — Servicios sociales y otros servicios (C)

### Funciones [M][T]

**Planes de Vivienda** [M][T]
- Materiales para Viviendas, Construcción de Vivienda e Informes.
- Tablas:
  - `PLANESVIV`, `VIVIENDAS`, `PRECIOSVIV`.
  - Etapas, actividades y progreso: `VIV_ETAPA`, `VIV_ACTIVIDAD`, `VIV_PROGRESO`.
  - Materiales: `VIV_MAT`, `VIV_MATACT`, `VIV_PROGMAT`.
  - Retiros de materiales: `VIV_RETM`, `VIV_RET_IT`.

**Servicios de salud y emergencias** [T]
- `AMBULANC`, `MEDICOS`, `INTERNAC`.

**Telefonía** [M][T]
- Centrales y DSLAM: `TEL_CENTRAL`, `TEL_DSLAM`.
- Repartidores y regletas: `TEL_REPARTIDOR`, `TEL_REGLETAS_*`.
- Números, prefijos y tarifas: `TEL_NUMEROS`, `TEL_PREFIJO`, `TARTEL`.
- Llamadas facturables: `LLA_CEL`.

**Internet** [T]
- `INTERNET`, `MIKROTIK` (integración con routers MikroTik para habilitar o cortar), `MODEMS`, `SERVINT`.

---

## 27. Módulo 26 — Autogestión del socio: portal y app (B)

### Funciones [M][T][P]

**Procoop WEB / CoopOnline** [M][T]
- Menús: Requisitos y Trámites, Archivos en la Web, Operaciones.
- El namespace `CapaDatos.PWeb` (31 tipos) contiene:
  - Cuentas, servicios, medidores, órdenes, presupuestos, ventas, transacciones, imágenes de ruta e incidentes: `CUENTAS_*`.
  - Usuarios y módulos: `USERS`, `MODULOS`.
  - Logos de factura y novedades: `WEB_Logos_Facturas`, `WEB_Novedades`.

**Alta de servicio desde el portal** [P]
- Marca "Alta desde CoopOnline" en la ficha del servicio.

**Registro de uso** [T]
- `WEB_LOG`.

### Funciones esperadas en el sistema nuevo [I]
- **Cuentas y facturas:** registro y vinculación de cuentas; consulta y descarga de facturas.
- **Pagos:** pago online y adhesión a débito automático y a factura digital.
- **Consumos y lecturas:** historial y gráfico de consumo; autolectura con foto.
- **Gestiones:** reclamos con seguimiento, trámites (alta, baja, cambio de titularidad) con adjuntos, turnos y notificaciones.

---

## 28. Módulo 27 — App móvil de campo (B)

- El namespace `CapaDatos.PMovil` (39 tipos) cubre la toma de lecturas y la ejecución de órdenes [T].

**Mejora:** una sola app offline-first con perfiles de lecturista, técnico y cobrador.

---

## 29. Módulo 28 — Reportes, tableros y exportaciones (B)

### Funciones [M][T]
- Editor de Reportes, Informes Personalizados y Procesos Personalizados [M].
- Tablas: `REPORTES`, `FORMULARIOS_PERSONALIZACIONES`.
- Carpetas `Reportes` y `Reportes_Empresa`: reportes por cooperativa.
- Exportador configurable de columnas: `EXPORTADOR`, `EXPORTADOR_COLUMNAS`.
- Tablas expuestas a Power BI: `TABLAS_POWERBI`.
- Tablero de Control [M].
- Todos los listados del sistema tienen Exportar e Imprimir [P].

### Mejoras propuestas
- **Tableros por rol:**
  - Gerencia: facturación, cobranza, mora y pérdidas.
  - Comercial.
  - Técnica.
- **Reportes estándar:** padrón, emisión, cobranza por ente, morosidad por antigüedad, libro IVA y consumos por categoría.
- **Exportación a Excel y CSV** en cualquier grilla, más una API de datos para BI.

---

## 30. Módulo 29 — Integraciones externas (A/B)

El detalle de cada integración (medio, frecuencia, dependencias y pendientes) está en [integraciones-fichas.md](integraciones-fichas.md).

| Integración | Evidencia | Uso | Prioridad |
|---|---|---|---|
| ARCA (ex AFIP): factura electrónica, CAEA, CESP, padrón | [P][M][T] `ELECTRONICA_*`, `CESPAFIP`, `EMPAFIP`, `ACTAFIP` | Autorización de comprobantes | A |
| Rentas provincial (CVP, padrón IIBB) | [M][T] `CVPIIBB`, `IIBB_LUA` | Validación provincial y percepciones | A |
| RED LINK | [P][T] `RED_LINK`, `DEUDARED` | Cobranza por red | A |
| SIRO | [P][T] `SIRO_BASEDEUDA` | Cobranza por red | A |
| Pagos360 | [T] `PAGOS360*` | Pago online | A |
| Débito automático bancario | [P][T] carpeta `Debitos` | Débitos | A |
| EPEC | [T] `FACT_EPEC` | Compra de energía y conciliación | B |
| ENARGAS | [M][T] `ENGAS_CANTMESES`, carpeta `ENARGAS` | Información regulatoria de gas | B |
| ENACOM | [M] | Información de servicios TIC | C |
| INAES | [T] `CAT_INAES` | Organismo de cooperativas | B |
| Interbanking | [T] | Pagos y transferencias | B |
| Telemedición | [M][T] `TELEMED_*` | Lecturas remotas | B |
| MikroTik | [T] | Corte y habilitación de internet | C |
| Power BI | [T] `TABLAS_POWERBI` | Análisis | C |
| WhatsApp, SMS, e-mail | [P][T] | Comunicaciones | B |
| Sistema contable externo | [T] `SISCONT` | Exportación contable | C |
| Importación de padrones y DBF | [T] referencia a `NDbfReader`, carpeta `Importacion` | Migraciones o archivos legados | B |

---

## 31. Procesos transversales clave (flujo de punta a punta)

1. **Alta de un suministro:**
   1. Solicitud (ventanilla o portal).
   2. Factibilidad técnica.
   3. Presupuesto de conexión.
   4. Orden de trabajo de conexión con colocación de medidor.
   5. Servicio CONECTADO con categoría, ruta y grupo de factura.
   6. Primera factura con el cargo de conexión.
2. **Ciclo mensual de facturación:**
   1. Rutas de lectura (app o telemedición).
   2. Validación de consumos.
   3. Pre-facturación con el cuadro tarifario vigente.
   4. Revisión de excepciones.
   5. Emisión y autorización en ARCA.
   6. Distribución (impresión, mail, portal).
   7. Archivo de deuda a RED LINK y SIRO.
3. **Cobro:**
   1. Caja, portal o ente.
   2. Rendición e importación.
   3. Imputación en la cuenta corriente.
   4. Asiento contable.
   5. Depósito y conciliación bancaria.
4. **Mora:**
   1. Vencimientos.
   2. Recargos por índice.
   3. Candidatos.
   4. Notificaciones de 1ª y 2ª instancia.
   5. Orden de corte, o plan de pago.
   6. Reconexión.
5. **Cambio tarifario:**
   1. Resolución del regulador.
   2. Nuevo cuadro con vigencia.
   3. Simulación.
   4. Aprobación.
   5. Aplicación en la próxima facturación.
6. **Compra de materiales:**
   1. Solicitud.
   2. Cotización.
   3. Orden de compra.
   4. Recepción en stock.
   5. Factura del proveedor.
   6. Pago con retenciones.
   7. Asiento.

---

## 32. Modelo de datos de referencia (resumen)

Agrupación de las 667 tablas de `CapaDatos` en dominios. El inventario completo está en [`binarios/CapaDatos-inventario.md`](binarios/CapaDatos-inventario.md).

| Dominio | Tablas principales |
|---|---|
| Personas y cuentas | `PERSONAS`, `SOCIOS`, `SUMSOC`, `SERSOC`, `RESPONSA`, `VINCULOS`, `PROPIEDA` |
| Catálogo de servicios | `SERVICIO`, `CLASESER`, `CATE_SER`, `CATTARIF`, `ESTASER`, `PROD_SER`, `CONEXION` |
| Tarifas | `CUADROS`, `HIS_CATTARIF`, `HIS_CATE_SER`, `HIS_IMPUESTO`, `HIS_CARGOS_ADICIONALES`, `IMPUESTO`, `CARGOS_ADICIONALES` |
| Medición | `MEDSOC`, `HIS_MEDSOC`, `MARMED`, `TIPMED`, `CONS_SER`, `TELEMEDICION`, `CONNRUTA` |
| Facturación | `FACTURAS`, `ITEMSFAC`, `FACTMES`, `TALONFAC`, `PTOVENTA`, `TIP_COMP`, `ELECTRONICA_*`, `ANUFAC` |
| Cuenta corriente y cobranza | `DEUDAVTA`, `PAG_SOC`, `IT_PAGSO`, `CAJAS`, `FORMAPA`, `ENTIDADES`, `RED_LINK`, `SIRO_BASEDEUDA`, `PAGOS360` |
| Mora y financiación | `TABMORA`, `INDICESMORA`, `MORATAS`, `EXC_MORA`, `INSTANCI`, `NOTIFICA`, `PPAGOS`, `PLAN_CUO` |
| Técnica y redes | `TECNICA`, `RECLAMOS`, `FACTIBIL`, `OBRAS`, `CUADRI`, `REDES_*` |
| Compras y stock | `PROVEED`, `SAPROV`, `SCOTIZ`, `OCOMPRA`, `RECEPCIONES`, `COMP_COM`, `DEPOSITO`, `BIENES_USO`, `ORDEFAB` |
| Tesorería | `BANCOS`, `VALORES`, `CHEQUERAS`, `TESORE`, `RESBAN`, `INTERBANKING` |
| Contabilidad | `CTPLAN`, `CTASIEN`, `CTITASIE`, `CTEJER`, `CTSECCION` |
| Sueldos | `SU_EMPLEADOS`, `SU_SUELDOS`, `SU_CONCEPTOS`, `SU_VARIABLES` |
| Atención | `TICKETS*`, `TURNOS`, `LLAMADAS`, `ENCUESTAS`, `PLANTILLA_WSP` |
| Seguridad | `USERS`, `PERFILES`, `MENUSYS`, `AUDITORIA`, `AUTORIZACIONES` |

**Patrones del modelo de Procoop a tener en cuenta en el diseño nuevo:**
- **Anulaciones en tablas espejo** (`ANUFAC`, `ANUPAG_SOC`). Mejora: estado más documento de reversión.
- **Históricos en tablas separadas** (`HIS_*`, `*_HST`). Mejora: vigencias (fecha desde/hasta) en el mismo modelo.
- **Campos configurables en tablas `*_EXTRAS`.** Mejora: atributos configurables tipados.

---

## 33. Propuesta de etapas, a validar

| Etapa | Módulos | Hito |
|---|---|---|
| 1 — Núcleo comercial | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Facturar en paralelo con Procoop y comparar los resultados factura por factura |
| 2 — Cobro y mora | 10, 11, 29 (ARCA, RED LINK, SIRO, Pagos360, débitos) | Paralelo completo desde el 1/3/2027 |
| 3 — Operación | 12, 13, 14, 21, 26, 27, 28 | Atención y técnica fuera de Procoop |
| 4 — Administración | 16, 17, 18, 19 | By pass de Procoop el 1/7/2027 |
| 5 — Complementarios | 15, 20, 22, 23, 24, 25 | Según la necesidad de cada cooperativa |

**Nota:** el plan del proyecto pone Contabilidad primero. Hay que decidir si la etapa 4 se adelanta o si se contabiliza vía exportación durante el paralelo.

**Criterio de aceptación del paralelo:** para el mismo período y el mismo padrón, cada factura del sistema nuevo coincide con la de Procoop en cantidades, importes por concepto, impuestos y vencimientos. Toda diferencia debe estar explicada.

---

## 34. Pendientes para cerrar la definición

1. **Lógica de cálculo:** descompilar el ejecutable principal y las DLL de negocio. Pedir la carpeta `SISTEMA_PRD` completa. En particular, el detalle de los cuadros tarifarios, que solo se ve en modo "Modificar".
2. **Datos reales de parametrización:** consultas de solo lectura a la base sobre `CUADROS` / `HIS_*`, `IMPUESTO`, `CATE_SER`, `CONJUNTO`, `GRUPOS_FACTURA`, `TABMORA` y `TRAMASREC`.
3. **Pantallas no abiertas:**
   - Cobranza local y apertura de caja (abrir una caja graba datos).
   - Facturación masiva.
   - Telemed.
   - Financiaciones.
   - Órdenes de trabajo.
   - Compras.
   - Contabilidad.
4. **Validar con la cooperativa piloto** qué módulos usan hoy. La DEMO muestra módulos habilitados, pero no necesariamente usados: vivienda, ambulancias y telefonía.
5. **Formatos de los archivos** de RED LINK, SIRO, débitos y EPEC. Pedir ejemplos anonimizados.
