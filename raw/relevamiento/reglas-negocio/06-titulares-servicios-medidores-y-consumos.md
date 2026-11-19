# 06 — Titulares, servicios, medidores y consumos

Reglas de negocio de Procoop 10.4.6.722 sobre el padrón de asociados (persona, socio, cuenta, servicio), el ciclo de vida de los servicios, los medidores, la toma de lecturas (manual, captor, app móvil, archivos, telemedición) y el cálculo y la validación de consumos.

**Convenciones**

- Las rutas son relativas a `binarios/decompilado/ReglasNegocio/` y se omite el prefijo `ReglasNegocio.` del namespace. Ejemplo: `Titulares/clsSocios.cs:2576` es `ReglasNegocio.Titulares\clsSocios.cs`, línea 2576.
- El código es de terceros: acá solo se describen reglas, en prosa y con pseudocódigo breve. No se copian bloques de código.
- "V2 N" es el parámetro de sistema que se lee con `Nucleo.Busca_V2_Logica(N)` (o con `_int`, `_Decimal` o `_Caracter`). "PMovil N" es un parámetro de la base de la app móvil (`Busca_V2_Logica_PMovil`). El catálogo completo está en [09 — Parámetros y configuración](09-parametros-y-configuracion.md).
- Las tablas se nombran como en `binarios/CapaDatos-tablas.md`.

---

## 1. Alcance y fuentes

| Namespace | Clases principales |
|---|---|
| `Titulares` | `clsSocios` (≈6000 líneas, núcleo del padrón), `clsSocios_Capital`, `clsPersonas`, `clsTramites`, `clsSegmentacion`, `clsTarifaSocial`, enums `CondicionServicio`, `TipoConceptoCobrar`, `OperacionServicioAutomatico`, `Sistemas_Telemedicion`, `DatosDeMedidor` |
| `Servicios` | `clsServicio`, `ConfiguracionServicios`, `clsCuentas` |
| `Consumos` | `clsConsumos`, `clsInformes_Consumos`, `clsBonificacionEstimados`, `clsTransgresiones`, `clsImportador` |
| `Varios.Telemed` | `clsTelemed` (rutas y lecturas), `clsRutas`, `clsDetalleRuta`, `clsPMovil` (captor USB), `clsTelemediciones` (fábrica de proveedores), `clsImportacion_AC` |
| `Varios.Telemed.Telemedicion` | `SistemaTelemedicion` (clase abstracta) y una subclase por proveedor (`Discar`, `NEXO*`, `Boiero`, `AION`, `MikroTik`, `CashPower`, `Hexing`, etc.) |
| `Varios.PMovil` | `clsPMovil_Base`, `clsPMovil_Telemed`, `clsPMovil_Tecnica`, `clsPMovil_Venta`, `clsPMovil_Sms` (app en la nube) |
| `Facturacion` (solo lo necesario) | `clsConsumosAFacturar` (demanda contratada, energía inyectada) |

El cierre de órdenes de trabajo (OT) que cambia el estado de los servicios vive en `Tecnica/clsTecnica.cs`; acá solo se describe su impacto en el padrón. El detalle está en el documento 07.

---

## 2. Jerarquía del padrón

```
PERSONAS (COD_PER)            persona física o jurídica: documento, CUIT, sexo, nacimiento, fallecimiento
  └─ SOCIOS (COD_SOC)         asociado o titular: NUM_SOC, ACTIVO, ACTIVOBAJA, ALTA, BAJA, CAU_BAJA, REP_ASAMBLEA
       └─ SUMSOC (COD_SUM)    "cuenta" o suministro: domicilio postal, situación IVA (COD_SIT), PRINCIPAL, EMAIL, MOVIL
            └─ SERSOC (ID_SERSOC)  servicio contratado: COD_SER, categoría, medidor, estado, domicilio del servicio
                 ├─ ADHSOC / BENSOC   adherentes y beneficiarios (sepelio, salud, etc.)
                 ├─ MEDSOC            mediciones múltiples (grandes clientes)
                 ├─ CONS_SER          historial de lecturas y consumos
                 └─ FACTIBIL, INTERNET, VIVIENDAS, SERSOC_EXTRAS, SERSOC_HST ...
```

- **Persona.** `clsPersonas.CrearPersona` (`Titulares/clsPersonas.cs:90-137`) crea la persona y, si no se informa CUIT, lo **genera** a partir del DNI y el sexo con `Impuestos.GenerarCuit`. Se guarda en `PERSONAS.CDI`.
- **Socio.** El número interno `COD_SOC` sale de `GetIdSocio` (`clsSocios.cs:703`). Con V2 32 hay dos numeraciones: socios activos (máximo entre `ACTIVO=1`, o también `ACTIVOBAJA=1` si V2 2673) y no activos. Sin V2 32 se usa el máximo global + 1. El número visible `NUM_SOC` sale de `Get_NumeroSiguiente` (`clsSocios.cs:963`, máximo `NUM_SOC` entre activos + 1) y debe ser único (`ValidarNumeroAsociado`, `:2558`).
- **Cuenta (SUMSOC).** Un socio puede tener varias cuentas, pero **exactamente una** debe ser `PRINCIPAL` (`Validar_Titular`, `clsSocios.cs:917`). La cuenta lleva la situación frente al IVA (`COD_SIT` → `SITIVA`), el domicilio postal, el email y el celular. Una cuenta nueva toma `COD_SUM = MAX + 1` (`Guardar_SUMSOC`, `:1142`).
- **Servicio (SERSOC).** El código compuesto `COD_CSE` es el `COD_SUM` con relleno a 7 dígitos más un correlativo de 3 dígitos (`clsSocios.cs:2881`). El servicio lleva su propio domicilio, que puede diferir del de la cuenta, además de la categoría (`COD_CAT` y `COD_CATSER`), clase, actividad, zona/sector/recorrido, grupo de facturación, medidor y estado.
- **Historial.** Las modificaciones de cuentas y servicios se registran en `SUMSOC_HST` y `SERSOC_HST` mediante `GuardarHistorial` (`clsSocios.cs:1262`). Los cambios de `MEDSOC` van a `HIS_MEDSOC` (`clsSocios.cs:4355`, `Consumos/clsConsumos.cs:1659`).
- **Situación IVA por defecto.** `clsPersonas.GetSituacionImpositiva` (`clsPersonas.cs:271-279`) devuelve la situación de la cuenta y, si no hay cuenta, el código 4 (consumidor final).

---

## 3. Altas y validaciones

### 3.1 Validaciones del titular

| Regla | Dónde | Detalle |
|---|---|---|
| Documento duplicado | `Existe_TitularDocumento` `clsSocios.cs:874`; `PermiteDNIDuplicado` `:889` | Por defecto no puede haber dos personas con el mismo tipo y número de documento. V2 2077 lo permite. Con V2 3196 se permite solo si el socio anterior está de baja. |
| Cuenta principal | `Validar_Titular` `:917` | Exactamente una cuenta `PRINCIPAL`. |
| CUIT obligatorio | `Validar_Titular` `:917` | Si `SITIVA.REQ_CUIT` (responsable inscripto, monotributo, exento, etc.), la cuenta exige CUIT. |
| Dígito verificador del CUIT | `Impuestos.ValidaCuit` (en `CapaNucleo`, no en ReglasNegocio) | Se usa desde los controles de UI y en `clsInformes_Titulares.cs:1189-1211`, que además contrasta contra el padrón de ARCA (ex AFIP). |
| Domicilio completo | `Validar_Domicilio` `:1450` | Calle, número, localidad, provincia y código postal. |
| Datos de contacto | `ValidarDatosCuenta` `:1461` | V2 int 2490 = 2 activa la validación. V2 int 744 (celular) y 745 (email): 1 = pregunta y deja seguir; 2 = bloquea. |
| Código existente | `Existe_TitularConCodigo` `:2446` | Evita colisiones de `COD_SOC` en altas manuales. |
| Deuda en el domicilio | `clsSocios_Capital.Validar_DeudaDomicilio` `clsSocios_Capital.cs:227-279` | Busca otras cuentas con el mismo domicilio (calle, número, barrio, localidad, piso, departamento, edificio) o la misma nomenclatura catastral, y avisa si alguna tiene deuda. V2 2669 limita la búsqueda a la deuda vencida a hoy. Sirve para frenar el "cambio de titular para esquivar deuda". |

### 3.2 Validación de un servicio (`ValidarServicio`, `clsSocios.cs:2576-2681`)

Orden aproximado de los chequeos; cada uno corta con un mensaje:

1. Servicio y domicilio informados. Fecha de alta obligatoria si el servicio **no** es "Técnico". En los servicios técnicos la fecha la pone la OT de conexión.
2. Categoría y cantidad. La cantidad aplica a servicios por cantidad o por dispositivos.
3. **Matrícula** única dentro del mismo `COD_SER`, salvo que V2 2250 ("Permitir servicios con Matrícula duplicada", `CapaNucleo/clsVariables.cs:399`) esté activo; con `SERVICIO.MATRICULA_AUTO` se controla siempre (`:2608`). `Existe_MatriculaEnSersoc` (`:2753`) busca la matrícula entre todos los servicios activos solo cuando V2 2250 está apagado. *(Corregido en la segunda pasada: la versión anterior invertía el sentido de V2 2250.)*
4. **Designación catastral** e inmueble obligatorios si `SERVICIO.REG_CATASTRO` o `REG_INMUEBLE`. `ValidarPropiedadCatastral` (`:2716`) evita duplicar la misma parcela.
5. `GRUPO_FACTURA` distinto de -1.
6. Actividad (`REG_ACT`), clase (`REG_CLS`), zona/sector/recorrido (`REG_ZSR`) y dispositivo (`REG_DSP`), cada uno según su flag del `SERVICIO`.
7. **Factibilidad técnica**: si `SERVICIO.FACTI_ALTA`, el alta exige una solicitud de factibilidad (`COD_SOL` de `FACTIBIL`) asociada. Ver `Guardar_FACTIBIL` (`:4360`).
8. **Garante**: si `SERVICIO.REG_GARANTE` y no hay garante, siempre bloquea.
9. **Tarifa social única** (V2 2740): el socio no puede tener más de un servicio en una categoría social. `Es_Categoria_Social` (`:2684`) considera social a la categoría con `CAT_SOC` o cuya descripción contiene "JUBILADOS".

### 3.3 Configuración por servicio

`clsServicio.GetConfiguracionGeneral` y `GetConfiguracion` (`Servicios/clsServicio.cs:261-449`) arman un objeto `ConfiguracionServicios` (`Servicios/ConfiguracionServicios.cs`) que gobierna todo el comportamiento:

- **`TipoRegistracion`** (`ConfiguracionServicios.cs:14`): Energía (1), Otros medidos, Teléfono, Fijos, Fijos con dispositivos, Adherentes, Adherentes según tarifas, Dispositivos y adherentes, Internet, Cantidad, Plan de vivienda, Seguro, Cuotas de obras, Vehículo eléctrico. Define qué pestañas y datos se piden (medidor, adherentes, dispositivos, etc.).
- **`TipoCalculo`** (`:32`): servicio medido, por tramos, gas natural (`TIP_CAL = 3`), agua por inmueble, pack de SMS, etc. Se usa en facturación (documento 01).
- **`TipoCalculo_GrandesClientes`** (`:76`): incluye "por consumo de medidor testigo".
- Flags del `SERVICIO`: `Tecnica` (las altas y bajas pasan por OT), `GENERAR_OT`, `CONSULTA_BAJA`, `GF_DEFECTO` (grupo de facturación por defecto), `REG_STO` (el medidor se registra en stock), `MATRICULA_AUTO`, `FACTI_ALTA`, `REG_*` y `SERVICIO_EXTRAS.CONSUMO_ALTA` (genera una lectura inicial al conectar).

### 3.4 Guardado de la cuenta y sus servicios

`Guardar_SUMSOC` (`clsSocios.cs:1142`) y `Guardar_SERSOC` (privado, `:2862-2972`) persisten en una sola transacción la cuenta, las notas, los trámites, los servicios no facturables (`SUMNOFAC`), los débitos excluidos, los servicios, adherentes, beneficiarios, `MEDSOC`, `INTERNET`, los extras, la factibilidad y las viviendas. Además:

- Mueven el **stock trazable** del medidor (`MoverStock` `:3212`; `Es_Trazable` `:2232`; V2 2416 toma precio y depósito de la trazabilidad).
- Crean la **OT** de conexión con `clsTecnica.Guardar_OT` cuando el servicio es técnico. También crean la OT de cambio de categoría si corresponde (`:3178-3186`, ver §6).
- Si el servicio tiene telemedición, disparan `SistemaTelemedicion.GenerarOT`.
- V2 2286 fuerza el guardado aunque no haya cambios detectados.
- V2 car 3034 activa la integración SITSA (`:1216`, `:1242`).

### 3.5 Altas automáticas de servicios (`ALTASEAU`)

Hay reglas configurables que, ante un evento (`OperacionServicioAutomatico`: 1 alta de servicio, 2 alta de cuenta, 3 baja, 4 reconexión, 5 cambio de categoría, 6 nueva OT, 7 cambio de domicilio), **dan de alta otros servicios** automáticamente. Ejemplo: al conectar energía se agrega alumbrado público o sepelio.

- Filtros de la regla: categoría, propiedad, clase, actividad, localidad, referencia, zona, tipo de medidor y `TIT_SOC` (1 todos, 2 solo socios activos, 3 solo no activos). Ver `Get_ServicioAutomaticos` `clsSocios.cs:1894`.
- `AltasAutomaticas` (`:1917`, `:2019`) evalúa las reglas y `GenerarAltaAutomatica` (`:2030`, `:2063`) crea el `SERSOC` nuevo. El grupo de facturación sale de `SERVICIO.GF_DEFECTO`, salvo que la regla indique `TOMAR_GRUPO` (heredar el grupo del servicio origen).
- V2 int 332 (`:3045`) indica un servicio para el que se generan OTs automáticas al guardar.

### 3.6 Conceptos a cobrar por conexión (`CONEXION`)

Al dar de alta o reconectar se pueden generar cargos (derecho de conexión, sellado, cuota de ingreso). `TipoConceptoCobrar`: 1 alta de servicio, 2 alta de cuenta, 3 alta de titular, 4 reconexión, 5 después de la OT, 6 antes de la OT, 7 transferencia. `Get_CONEXION` (`clsSocios.cs:471`, `:496`) y `GetQuery_CONEXION` (`:558`) filtran por socio activo, moroso, prepago, referencia, localidad, categoría del servicio, clase, medidor retirado, provisorio, propiedad y estado. Con `UNA_VEZ`, `AgregarConceptoCobrar` (`:571`) no repite el mismo producto (`COD_PRO`) dentro del lote de cargos que se está generando, y `Validar_CONEXION_unaVez` (`:464`) impide configurar dos conceptos `UNA_VEZ` con el mismo producto y tipo. *(Precisado en la segunda pasada: no se encontró un control contra cargos cobrados en operaciones anteriores.)* Detalle en §23.1.

---

## 4. Estados del servicio, conexión y desconexión

### 4.1 Estados (`CondicionServicio`, `Titulares/CondicionServicio.cs`)

| Código | Estado | Cómo se deriva (`Get_CondicionSERSOC`, `clsSocios.cs:2377`) |
|---|---|---|
| 1 | Pendiente de conexión | Sin `FEC_ALTA` (alta técnica) |
| 2 | Conectado | `FEC_ALTA` informada, sin baja |
| 3 | Pendiente de desconexión | Tiene `BAJA_ADM` (baja administrativa) y no tiene `FEC_BAJA` |
| 4 | Baja / desconectado | Tiene `FEC_BAJA` |
| 5 | No vigente | Lo asigna la transferencia de servicio (V2 2541) |

- El estado se **deriva de las fechas** y no se guarda como máquina de estados explícita. Hay dos altas: `ALTA_ADM` (administrativa, cuando se carga el contrato) y `FEC_ALTA` (técnica, cuando la OT de conexión se cierra). Hay dos bajas: `BAJA_ADM` (solicitud) y `FEC_BAJA` (efectiva).
- `ValidarCondicion` (`:2398`) normaliza las fechas nulas a la fecha centinela **1901-01-01**.
- "Conectado" a efectos de facturación y lecturas = condición 2 o 3 (`:2476`; también `Consumos/clsConsumos.cs:1721`).

### 4.2 Operaciones

```
Conectar_SERSOC(s, fecha)      → FEC_ALTA = fecha; recalcula CONDICION         (clsSocios.cs:2485)
Desconectar_Adm(s, fecha)      → BAJA_ADM = fecha  (queda "pendiente desconexión") (:2521)
Desconectar_SERSOC(s, fecha)   → FEC_BAJA = fecha; CONDICION = 4                (:2526)
Reconectar_SERSOC(s, alta, f)  → borra FEC_BAJA/BAJA_ADM; FEC_ALTA = alta       (:2492)
```

- **Reconexión** (V2 2707, "Actualizar la Fecha de Alta al reconectar un Servicio No Medido en el mismo mes de la desconexión", `clsVariables.cs:250`). En `Reconectar_SERSOC` (`:2492-2519`), si V2 2707 está **apagado**, el servicio es **no medido** (`SERVICIO.TIP_REG` distinto de 1 y 2) y la última `FEC_BAJA` registrada en `SERSOC_HST` es del mismo mes y año que la reconexión, se restaura la `FEC_ALTA` anterior para no partir el período facturable. Con V2 2707 activo, o en servicios medidos, la reconexión siempre pone la fecha nueva. *(Corregido en la segunda pasada: la versión anterior no mencionaba la restricción a servicios no medidos e invertía el parámetro.)*
- `Desconectar_SERSOC` (`:2526`) además completa `BAJA_ADM` con la misma fecha si estaba vacía.
- Con V2 2713 y V2 car 2264 = "BAT" (cliente BATCOM), la reconexión o desconexión del servicio con **`COD_SER = 1`** (fijo en el código) se informa al sistema BATCOM (`:2508`, `:2533`).
- **Servicio técnico**: la desconexión administrativa no corta. Crea una OT de desconexión y el corte efectivo ocurre al cerrarla (`clsTramites.DesconectarServicio`, `clsTramites.cs:607-624`; `clsTecnica.cs:1361-1381`). Un servicio no técnico se desconecta en el acto, junto con sus adherentes y beneficiarios.
- `Baja_Al_GenerarOT_Desconexion` (`clsSocios.cs:3764`): si `SERVICIO.CONSULTA_BAJA`, pregunta si se da la baja administrativa al generar la OT.
- **Cierre de la OT** (`Tecnica/clsTecnica.cs:1270-1400`). Al cerrar se impacta primero el sistema de telemedición (si falla, la OT no se cierra) y después:
  - Alta: conecta, copia la matrícula y, si `CONSUMO_ALTA`, registra una lectura inicial con consumo 0.
  - Traslado: actualiza el domicilio.
  - Desconexión: marca el medidor como retirado y, con V2 2399, borra `NUM_MED` y la matrícula.
  - Cambio de medidor: ver §12.3.
  - Reconexión: puede generar un descuento por reconexión.

### 4.3 Trámites masivos (`clsTramites`, `Titulares/clsTramites.cs:543-636`)

Hay operaciones en lote sobre listas de `ID_SERSOC` que ejecutan `UPDATE` directos en bloques de 1000: marcar provisorio, cambiar actividad, cambiar clase, cambiar categoría (opcionalmente también en los `CONS_SER` no facturados), cambiar referencia y **baja de servicio**. La baja masiva solo procesa los servicios que pasan `Validar_OrdenTrabajo_Desconexion`.

---

## 5. Bajas de socio

- `PermiteDardeBaja` (`clsSocios.cs:931`): por defecto no se puede dar de baja a un socio con servicios activos (V2 340 lo permite). Con V2 337 tampoco se puede si tiene capital integrado.
- La baja guarda `BAJA`, `CAU_BAJA` y `ACTIVO = 0`. `ACTIVOBAJA` distingue al socio dado de baja que conserva numeración de activo (ver V2 2673 en §2).
- `ModificacionEspecial_Socio` (`:601`) **renumera** un `COD_SOC` en todas las tablas que lo referencian, recorriendo el catálogo de columnas con SQL dinámico. Es una herramienta de corrección de datos. Además (segunda pasada): rechaza el número nuevo si ya existe; mueve los adjuntos del socio (`ADJUNTOS` tipo 2); permite cambiar la fecha de alta; si se borra la fecha de baja "recupera" al socio (borra `BAJA` y `CAU_BAJA`, `ACTIVOBAJA = false`); al activar o desactivar asigna `NUM_SOC = Get_NumeroSiguiente()` o 0 y registra auditoría. Cada cambio se anota en `SOCIOS.OBSERVA`, que se recorta a los últimos 1000 caracteres.

---

## 6. Cambios de categoría y clase

- **Individual con OT** (`OT_CambioCategoria`, `clsSocios.cs:1981`): V2 int 2330 es el código de transacción técnica "cambio de categoría". Requiere `SERVICIO.GENERAR_OT` y no deja crear una segunda OT pendiente del mismo tipo. Con V2 2455 la categoría nueva **no** se aplica de inmediato: se aplica al cerrar la OT, con `TECNICA.N_COD_CAT` (`clsTecnica.cs:1276`).
- **Masivo por deuda** (`Get_Datos_Modificar_Categoria` `:3546`, `Guardar_Modifir_Categoria` `:3631`): elige servicios por monto de deuda o por cantidad de comprobantes impagos y los pasa a otra categoría. Actualiza `SERSOC` y los `CONS_SER` no facturados. `ModificarCategoria` (`:2829`) solo permite el paso a categorías **prepagas**; es el mecanismo de "pasar a prepago al moroso".
- `Actualizar_CategoriaConsumo` (`:2457`) sincroniza la categoría de los consumos pendientes.
- **Segmentación de subsidios y tarifa social** (`clsSegmentacion`, `clsTarifaSocial`):
  - Se importan padrones oficiales en CSV o TXT: RASE energía y gas, RASE por NIS, Buenos Aires, SEF gas, EPRE, zona fría, Decreto 49/2019, resolución 493/25, ERSEP, OCEBA, etc. Ver el enum `Modelo_Importacion`, `clsSegmentacion.cs:98`.
  - Cada categoría puede tener una "categoría con subsidio" (`CATE_SER_EXTRAS.COD_CATSER_SS`) y una "categoría SEF" (`COD_CATSER_SEF`).
  - `Recategorizar` (`clsSegmentacion.cs:1579-1738`) mueve cada servicio importado a la categoría destino, guarda `CAT_ANT`, actualiza los `CONS_SER` no facturados y deja una `NOTA_SUM` "Recategorización". Con V2 2740 deja un solo servicio subsidiado por socio, priorizando jubilado, después la cuenta principal y después el `ID_SERSOC` menor. En gas setea `ESTBEN` según la zona (`CUA_GAS`); para el cliente "ARR" (V2 car 2264) aplica una regla distinta.
  - `ResetCategoria` (`:176-255`) revierte en bloque las categorías subsidiadas a sus categorías base, por niveles o por SEF/decreto según V2 3155. Excluye los servicios marcados `SERSOC_EXTRAS.NO_APLICA_RECATEGORIZACION` y los dados de baja hace más de 60 días.
  - `clsTarifaSocial` exporta los padrones de beneficiarios a los entes (ERSEP 296/166/617, EPRE, OCEBA 265/NIS, DNU 311/2020, Ministerio de Hacienda) e importa sus respuestas (`Titulares/clsTarifaSocial.cs:296-2498`).

---

## 7. Transferencias (`TRANSFER`, `TipoTransferencia`: 1 cuenta, 2 servicio, 3 capital)

- **Cuenta** (`TransferirCuenta`, `clsSocios.cs:1268`): mueve una `SUMSOC` a otro socio. Si el socio origen tiene capital, pregunta si se conserva. `ConservarCapital` (`:1332`) crea una cuenta nueva o usa una existente del origen y registra asientos compensatorios en `CAPITAL`. Con V2 2324, si el origen queda sin cuentas, pregunta si se le da la baja.
- **Capital** (`TransferirCapital`, `:1421`): pasa saldos de `CAPITAL` de un socio a otro con movimientos espejo.
- **Servicio** (`TransferirServicio`, `:3312`):
  - Modo "eliminar": mueve el `SERSOC` tal cual a la cuenta destino.
  - Modo clonado (por defecto): crea un `SERSOC` nuevo en la cuenta destino, con `FEC_ALTA = ahora` salvo que se pida "mantener fecha". El servicio viejo recibe `FEC_BAJA` y, con V2 2541, queda en condición 5 (no vigente).
  - Se transfieren teléfono, beneficiarios, vivienda, `MEDSOC` y propiedades. Los adherentes siguen V2 int 2291 (`:3468-3491`): 1 = los copia dados de baja (histórico), 2 = los copia activos, 3 = los elimina.
  - Si el servicio está en AION, sincroniza el cambio (`:3390`).
- Las transferencias pueden cobrar conceptos de conexión de tipo 7 (§3.6).

---

## 8. Domicilios

- Hay dos niveles: el domicilio **postal** de la cuenta (`SUMSOC`) y el domicilio **del servicio** (`SERSOC`: calle, número, piso, departamento, barrio, localidad, zona/sector/recorrido, nomenclatura catastral `CAT_CIR/CAT_LOT/CAT_MAN/CAT_PAR/CAT_PH/CAT_LT`, GPS).
- `Act_Domicilio_Sersoc` (`clsSocios.cs:3001`) copia el domicilio de la cuenta a sus servicios cuando el usuario lo pide.
- Un **traslado** se hace por OT: al cerrarla, `Actualizar_Domicilio_SERSOC` (`:2197`) toma los campos `NEW_*` de la OT. Si `DOM_PER`, también cambia el domicilio de las personas adherentes (`clsTecnica.cs:1347-1360`).
- `clsCuentas.GetDomicilio` arma el domicilio de impresión. `clsCuentas.PoseeGrupos` (`Servicios/clsCuentas.cs:599`) indica si la cuenta tiene servicios en más de un grupo de facturación.

---

## 9. Capital social y acciones (`clsSocios_Capital`, `Titulares/clsSocios_Capital.cs`)

- La tabla `CAPITAL` registra por socio el capital **suscripto o facturado** (`FACTURADO`), **integrado** (`PAGADO`) y **comprometido** (`COMPVEN`). Los rubros capitalizables se configuran en `RUBCAPI`, como concepto o producto que genera capital.
- El capital se genera desde varias fuentes:
  - Ítems facturados (productos, servicios, cuotas): `Guardar_CAPITAL` `:52`.
  - Comprobantes de venta: `_CompVen` `:87`.
  - Importe de capital del servicio al alta (`SERSOC.IMP_CAPITAL`): `_Servicio` `:108`.
  - Pagos, en proporción pago/total del comprobante: `_Pagos` `:197`.
  - Recálculo por fecha: `_Reccon` `:281`.
  - `Guardar_CAPITAL_Th` (`:146`) corre en un hilo de fondo según `Tipo_Registracion_Capital`: remito, factura, pago, pago y facturas, financiación, revisión. V2 2855 desactiva el registro automático, salvo en el modo "revisión" o para movimientos de más de 20 días.
- `TieneDeudaCapital` (`:400`) decide si el socio está al día para votar en la asamblea. V2 car 2429 es la fecha de la próxima asamblea y V2 dec 2606 el umbral de deuda tolerado.
- **Reserva de capital** (`CAPITAL_RES`): `Reserva` `:568` y `Recuperar` `:495`.
- **Rescate de acciones** (`Rescate_Acciones`, `:636`): genera un comprobante (tipo según V2 car 2792) por el capital a devolver.
- `Capital_CuentaSocio.cs` arma el estado de cuenta de capital.

---

## 10. Adherentes y beneficiarios

- Los adherentes (`ADHSOC`) son personas vinculadas a un servicio, por ejemplo un sepelio o un plan de salud, con su tipo de vínculo (`VINCULOS`, `TipoVinculo`). Los beneficiarios (`BENSOC`) son análogos. Ambos se guardan con `Guardar_ADHSOC` y `Guardar_BENSOC` (`clsSocios.cs:4248-4317`).
- Reglas por condición (`Get_Cod_Adh_Condicion`, `:140`): detectan adherentes con edad fuera del rango de la categoría, ocupación o vínculo no admitidos. Excluyen a los discapacitados (vínculo "DISCA"). `DarBaja_Adherentes_Condicion` (`:204`) y `CambiarCategoria_Adherentes` (`:239`) actúan en lote.
- `Get_Adherentes_MayoriaEdad` (`:356`) lista a los hijos que cumplen 21 años a la fecha.
- Al desconectar o reconectar el servicio se desconectan o reconectan también los adherentes y beneficiarios (`:2121-2185`).
- `clsPersonas.SetFechaFallecimiento` (`clsPersonas.cs:281`) registra el fallecimiento y da de baja los vínculos.
- V2 3058 ("Filtrar quitando adherentes dados de baja por fallecimiento en la ficha", `Servicios/clsServicio.cs:502`, `GetDatosFicha`) oculta en la ficha del servicio a los adherentes dados de baja por fallecimiento. *(Corregido en la segunda pasada: no es una "ficha extendida".)*

---

## 11. Grupos de facturación

`SERSOC.GRUPO_FACTURA` agrupa los servicios de una cuenta que se facturan juntos en un mismo comprobante. El valor por defecto sale de `SERVICIO.GF_DEFECTO`, el -1 es inválido (§3.2) y las altas automáticas pueden heredar el grupo del servicio origen (§3.5). La facturación masiva emite un comprobante por cuenta y grupo (documento 02).

---

## 12. Medidores

### 12.1 Datos del medidor en el servicio

| Campo | Significado |
|---|---|
| `NUM_MED` | Número de medidor |
| `DIG_MED` | Cantidad de dígitos enteros. Determina la "vuelta" del medidor; si vale 0 se asume **5** (`clsConsumos.cs:1749`). |
| `FAC_MED` | Factor multiplicador o constante (TI/TV, constante del medidor). Si vale 0 se toma 1. Un valor **negativo** permite consumos negativos (inyección, ver §18). |
| `INDICADO` | El medidor indica el consumo del período en lugar de un acumulado. |
| `LECTURA_CON_FACTOR` | El estado leído ya viene multiplicado; al recibirlo se divide por `FAC_MED`. |
| `TIP_MED` | Tipo de medidor (`TIPMED`), que incluye el sistema de telemedición (`SIS_TEL`). |
| `COD_PROP` | Propiedad o característica (`PROPIESER`), por ejemplo "medidor propio" o "comunitario". |
| `EST_LEC`, `FEC_LEC`, `CON_ANT` | Último estado, fecha de la última lectura y último consumo. |
| `COD_PTH` | Ítem de stock trazable (`PROD_TRH`) que corresponde al medidor físico. |
| `RETIRADO` | El medidor fue retirado (en desconexión o corte). |
| `ID_SYS_TEL` | Identificador del medidor en el sistema de telemedición. |

`DatosDeMedidor.cs` es el DTO que se usa para pasar estos datos.

### 12.2 Mediciones múltiples (`MEDSOC`)

Para las categorías de **grandes clientes** (`CATE_SER.GC`) un mismo servicio tiene varias mediciones. Cada una tiene su concepto facturable (`COD_CON`) y su tipo de energía (`TIP_ENE`): **A** activa, **R** reactiva, **DP** demanda en punta, **DFP** demanda fuera de punta, **DV** demanda en valle. Cada medición tiene sus propios `FAC_MED`, `INDICADO`, `EST_LEC`, `FEC_LEC`, `CON_TOT` y `CONTRATADO`.

- `clsServicio.ActualizarMedSoc` (`Servicios/clsServicio.cs:570`) arma las mediciones según los conceptos de la tarifa de la categoría. `RecuperarConsumo` (`:304`) trae el último consumo de cada medición a una fecha.
- Todas las consultas de lecturas tratan el servicio GC como N lecturas, una por fila de `MEDSOC` (`clsConsumos.GetConsumosPorCuenta`, `clsConsumos.cs:1715-1826`). V2 2520 las ordena por concepto.
- **Medidor testigo** (`MED_TESTIGO`, `CONS_SER_TESTIGO`): un medidor de referencia cuyo consumo se usa para facturar a otros servicios sin medición propia, por ejemplo un barrio con medidor colectivo (`clsConsumos.cs:1787-1824`).

### 12.3 Alta, cambio y retiro de medidor

- **Alta**: al cargar el servicio, o por OT. `ValidarMedidor` (`clsSocios.cs:3715`) y `Existe_MedidorEnSersoc` (`:2762`) evitan que un mismo número de medidor quede en dos servicios. Si el servicio registra stock, el medidor debe existir como ítem trazable y se descuenta del depósito (`MoverStock`).
- **Cambio de medidor por OT**, al cerrar la OT (`clsTecnica.cs:1290-1305`, `1382-1388`):
  1. `PreSave_CONS_SER` registra la **lectura final del medidor viejo** con `clsConsumos.Guardar_CONS_SER(TECNICA, ...)` (`clsConsumos.cs:1610-1657`). El estado de retiro sale de `TECNICA.ESTADO` y el período, de la fecha de confirmación.
  2. `Actualizar_NuevoMedidor_SERSOC` (`clsSocios.cs:2338`) copia los campos `N_*` de la OT (número, dígitos, factor, tipo, estado inicial) y pone `FEC_LEC` en hoy si no viene.
  3. Si el servicio es GC, agrega las `MEDSOC` del medidor nuevo.
  4. En la división de consumos, el período con cambio de medidor suma dos tramos de consumo (`AgrupaDivideConsumos.DividirXdiasMaximoCambioMedidor`, `clsConsumos.cs:568`; ver §23.6).
- **Retiro** (desconexión con retiro): `Actualizar_Medidor_SERSOC` (`:2214`) marca `RETIRADO`. Vacía `NUM_MED` si V2 2399 está activo **o** si el medidor es trazable en stock (`Es_Trazable`, `:2232`, ítem de `PROD_TRH`). Este método no toca la matrícula. *(Corregido en la segunda pasada; el borrado de la matrícula al cerrar la OT de desconexión está en `clsTecnica`, documento 07.)*

---

## 13. Rutas y toma de lecturas

### 13.1 Rutas (`CONNRUTA`, `Varios.Telemed/clsRutas.cs:181-394`)

Una ruta de lectura define:

- Servicios incluidos (`COD_SER1..4`).
- Criterio de selección (`REC_CAL`): 0 por zona/sector/recorrido; 1 por "ruta de calle" (calles y rangos de numeración, con `ORD_CAL` para pares e impares); 2 por rango de cuentas.
- Zonas (`CONNZONA`) y categorías opcionales.
- Orden de recorrido (`ORDEN`): 0 predeterminado, 1 por titular, 2 por calle y número, 3 por zona y recorrido. V2 2590 define el orden de impresión.
- `SERV_DESC`, que incluye servicios desconectados no retirados.
- `TELEMED`, que filtra solo los medidores telemedidos o los excluye.

Siempre se excluyen las **categorías prepagas**. Entran las condiciones 2 y 3, y también la 4 si el servicio no está retirado y está activado `SERV_DESC` o es medidor testigo.

### 13.2 Ciclo de vida de una ruta (`IMP_WORK.CONFIRMADO`)

```
G (generada) → E (exportada a captor/app) → I (importada con lecturas) → C (confirmada)
                                                  ↘ R (con error)
```

1. **Generar** (`clsTelemed.GenerarRutas`, `clsTelemed.cs:341`). Por cada servicio de la ruta crea un registro de trabajo `IMP_WORK` con los datos del servicio, el estado anterior y los **umbrales**:
   `UMB_MIN = EST_ANT + CON_ANT − CON_ANT × p` y `UMB_MAX = EST_ANT + CON_ANT + CON_ANT × p`, donde `p` = V2 dec 439 (%).
   Los servicios sin medidor llevan un pseudo-medidor "sd" + `ID_SERSOC`. Con V2 2809 se usan las observaciones postales de la cuenta.
2. **Guardar** (`GuardarRutas`, `:404`): controla duplicados (V2 3063 activa un log detallado). Una cuenta que ya está en otra ruta abierta **bloquea**. Con V2 2559, si el último consumo fue estimado, el registro se marca `ESTIMADO`.
3. **Exportar** al dispositivo: captor USB, app móvil o archivo (§13.3).
4. **Importar** las lecturas tomadas → estado I. Se calcula el consumo con `SetConsumo` (`:216-227`) y se valida con `CheckearLectura` (§14.2); los registros con error quedan en R.
5. **Revisar** (`clsDetalleRuta`): se filtra por consumo mayor o menor que un valor, con observación, con foto, por lecturista, por fechas y **"solo fuera de rango"** (estado actual fuera de `UMB_MIN..UMB_MAX`, `clsDetalleRuta.cs:285-335`). Los umbrales **no bloquean**: solo sirven para que el operador revise y para el aviso en el dispositivo.
6. **Confirmar** (`ConfirmarRuta`, `clsTelemed.cs:616-870`). Por cada registro:
   - Rechaza si el servicio no tiene fecha de alta, si el medidor cambió desde la generación, si la medición `MEDSOC` ya no existe, si la fecha anterior no coincide o si el estado anterior difiere en más de ±0,01 del `EST_LEC` actual. Esto evita doble carga o carga sobre un medidor cambiado.
   - La **observación de lectura** (`OBSESTAD`) puede generar una **OT automática** (`COD_TRAN`, por ejemplo "medidor roto" → OT de cambio) o forzar `ESTIMADO = 1` (`MARCAR_ESTIMADO`).
   - V2 2682 graba el consumo con la categoría actual del servicio en lugar de la de la ruta.
   - Inserta en `CONS_SER` (`PERIODO = MM/aaaa` de `FEC_ACT`), o en `CONS_SER_TESTIGO` si es testigo. Actualiza `SERSOC` o `MEDSOC` (`FEC_LEC`, `EST_LEC`, `CON_ANT`, GPS).
   - Adjunta las fotos al consumo (V2 2595) y deja `IMP_WORK` en C.
7. **Histórico y limpieza**: `GuardarEnHistorico` (`:596`) copia a `HISWORK`, que también se usa para ordenar la ruta por la última toma del lecturista. `LimpiarRutas` (`:305`) borra la ruta.

### 13.3 Medios de toma

| Medio | Clase / método | Reglas propias |
|---|---|---|
| **Carga manual** | `clsConsumos.GuardarLecturas` `Consumos/clsConsumos.cs:1886` | Por cuenta o servicio. Admite "cargo adicional": una lectura extra con `ESTIMADO = 1` y la descripción "Consumo Adicional". Admite medidor testigo y `LECTURA_CON_FACTOR`. |
| **Captor USB (PSION o Android por cable)** | `clsPMovil.AddRutas` `Varios.Telemed/clsPMovil.cs:582`; `RecibirDatosRuta` `:824`; `clsTelemed.Archivo_ImportacionPSION` `:1816` | Se comunica con Windows Portable Device y una base SQLite (tabla `RUTA`). Envía al equipo `LECMIN` y `LECMAX` (los umbrales) y datos opcionales según V2: 458 observación postal, 468 lectura anterior, 469 consumo anterior, 2293 ZSR, 2297 categoría, 2298 estado, 2331 matrícula, 748 manzana/lote, 3197 propiedad; PMovil 28 para datos catastrales. V2 2098 ordena por la última toma del mismo lecturista. Al recibir, `ValidarLecturasAnteriores` rechaza fechas menores o iguales a la última lectura, las fotos se guardan como adjuntos y, con `LECTURA_CON_FACTOR`, el estado se divide por el factor. V2 2345 limpia la base del equipo. |
| **App móvil en la nube** | `Varios.PMovil/clsPMovil_Telemed.cs` | Base MySQL compartida por todas las cooperativas cliente de Procoop, separadas por el `COD_SUM` de la cooperativa como cliente (V2 car 518/519). Los módulos habilitados están en `CUENTAS_MODULOS`. `Sincronizar_Rutas` (`:34`) sube la ruta (→ E). `SincronizarDatosImpWorkMySql` (`:92`) baja las lecturas (`ESTADO` 1 nuevo / 2 procesado) y las fotos desde `CUENTAS_IMAGEN_RUTA` o desde S3 (bucket "prccooponline") si PMovil 72. `ValidarBorrarRuta` (`:437`) impide borrar rutas con lecturas sin procesar. |
| **Archivos de terceros** | `clsTelemed.TipoArchivosTomaEstado` `clsTelemed.cs:101`; `clsTelemed.ValidarImportacion` `:1691`; `clsDetalleRuta.ImportarLecturas` `clsDetalleRuta.cs:432-1309` | Formatos genéricos (Excel, texto, dbf) y **formatos específicos por cooperativa o fabricante**: Aguas Cordobesas, CEMDO, Ordóñez, Oncativo, Brinkmann, Oliva, San José, 15 de Mayo; y modelos Caucete, Temetra (también agua), Nexus, Thinking, Bovetech, Hexing, Rainbow (V2 int 3074/3075 = columnas), Huinca (agua) y Trelew. Cada uno empareja por número de medidor (con relleno a 10 dígitos) o por cuenta. Algunos mapean conceptos por nombre de producto ("ENERGIA ACTIVA PUNTA", "POTENCIA VALLE", etc.). V2 2087 define el formato de los decimales. `clsImportacion_AC` es la variante de Aguas Cordobesas (V2 int 2054 = servicio). |
| **Importación directa de consumos** | `Consumos/clsImportador.cs:43-224` | No pasa por rutas: ARR (cloacas) y Nexus Electric graban directamente en `CONS_SER` con `Save_Consumos` (`:173`). |
| **Telemedición** | `clsTelemediciones.TomarEstadoTelemedicion` `Varios.Telemed/clsTelemediciones.cs:20`; `ObtenerMediciones` `:170`; `clsTelemed.RecibirTelemediciones` `clsTelemed.cs:544` | Consulta al proveedor la lectura de cada `IMP_WORK` de la ruta, o de un servicio puntual. En GC con múltiples mediciones pide confirmación. Ver §19. |

---

## 14. Cálculo y validación del consumo

### 14.1 Fórmula (`clsTelemed.CalcularConsumo`, `Varios.Telemed/clsTelemed.cs:229-253`)

```
f = (FAC_MED == 0) ? 1 : FAC_MED
si est_act == est_ant y no INDICADO         → 0
si INDICADO o es consumo adicional          → est_act × f
si est_ant < est_act                        → (est_act − est_ant) × f
si no (vuelta de medidor)                   → (max − est_ant + 1 + est_act) × f
     donde max = 99…9 con DIG_MED nueves (5 si DIG_MED = 0)   (GetMaxConsumo :291)
```

- La inversa `CalcularEstadoActual` (`:265`) obtiene el estado a partir de un consumo. Se usa al **estimar** y al registrar consumos sin lectura (`RegistrarConsumo`, `Consumos/clsConsumos.cs:1375-1414`: `EST_ACT = EST_ANT + consumo / f`).
- **Ojo:** cualquier lectura menor a la anterior se interpreta como **vuelta del medidor**, lo que produce un consumo enorme. Solo la revisión por umbrales (§13.2) o el chequeo de dígitos (V2 2088) lo detectan.
- `EliminarConsumo` (`clsConsumos.cs:1429`) borra la lectura y restaura `EST_LEC` y `FEC_LEC` del servicio desde `EST_ANT` y `FEC_ANT`.

### 14.2 Validaciones de la lectura (`CheckearLectura`, `clsTelemed.cs:2136-2180`)

El resultado es `"R"` (error) o `"I"` (importada correcta). Hay error si:

- La fecha de lectura es nula, o es **anterior a la última lectura** del servicio.
- El servicio no tiene medidor.
- Algún estado (anterior o actual) es negativo.
- El consumo es negativo y `FAC_MED > 0`. Con factor negativo se acepta, que es el caso de la inyección.
- Con V2 2088, el estado excede la cantidad de dígitos del medidor.
- El servicio vale 0 o no existe.

**No se valida** contra un mínimo, un máximo ni un promedio histórico: los umbrales son solo informativos.

### 14.3 Consumo anómalo y promedios

- La detección de anomalías es **visual**: el filtro "fuera de rango", los filtros por consumo mayor o menor que un valor y los informes de `clsInformes_Consumos`. Entre esos informes hay dos controles con regla propia: variación porcentual contra el período anterior y desvío de los días de lectura (ver §23.7).
- El promedio de referencia es el de los últimos N períodos (§15). El porcentaje de tolerancia de los umbrales es único para todo el sistema (V2 dec 439), no por categoría.

---

## 15. Estimados y ajuste posterior

- **Estimación** (`clsInformes_Consumos.DetalleGrilla.EstimarConsumo`, `Consumos/clsInformes_Consumos.cs:291-299`): consumo estimado = **promedio simple de los últimos N períodos** disponibles (N elegido por el usuario, máximo 12), con o sin decimales. `EstadoActual` (`:269`) deriva el estado estimado. Si el servicio no tiene ningún período, la división es por cero (ver Dudas).
- `GuardarConsumosEstimados` (`clsConsumos.cs:2179`) graba con `ESTIMADO = 1`. Con "agregar días", la fecha pasa a ser `FEC_LEC` + 1 mes. Las propiedades se suman. También se puede estimar dentro de la ruta (`clsTelemed.GuardarEstimadoImpWork`, `clsTelemed.cs:2202`) y marcar registros como erróneos (`SetearConErrorImpWork`, `:2238`).
- También quedan como estimados las lecturas con observación `MARCAR_ESTIMADO`, los cargos adicionales y las redistribuciones (§16.3).
- **Ajuste cuando llega la lectura real** (`clsBonificacionEstimados.Procesar`, `Consumos/clsBonificacionEstimados.cs:54-165`). Busca los servicios cuya última lectura del rango fue estimada y que después tuvieron una lectura real.

  ```
  PeriodosBonificar = meses entre el último período real y el último estimado
  MetrosBonificar   = MetrosPorMes × PeriodosBonificar / (SEG_TOT ? 2 : 1)
  SERSOC.CONS_BONIF = MetrosBonificar   (lo descuenta la próxima factura)
  NOTA_SUM "Bonificación de N M3"
  ```

  El ajuste es una **bonificación en metros** sobre la siguiente factura, pensada para agua y gas. No se refactura lo estimado: la lectura real, al ser acumulativa, ya incluye lo consumido y la bonificación compensa lo cobrado de más.

---

## 16. División, prorrateo, gas y distribución de consumos

### 16.1 División por período (`clsConsumos.DividirConsumos`, `Consumos/clsConsumos.cs:148`)

Cuando una lectura abarca más días que el período (más del 10% por encima y menos del triple), el consumo se **divide en dos períodos**. Se marcan con `GRUPO` y `SEG_TOT` 1/2. El parámetro `Valores` (0-4) define el modo de redondeo del reparto. Hay variantes:

- `DividirConsumoMitad` (`:287`) divide en mitades.
- `DividirXdiasMaximo` (`:454`) limita por un máximo de días y puede limitar el consumo.
- `DividirXdiasMaximoCambioMedidor` (`:568`) junta dos tramos de medidores distintos.
- `RealizarProrrateo` (`:768`) prorratea por días.

El detalle de cada variante está en §23.6.

Los servicios con múltiples medidores quedan excluidos. El proceso masivo está en `GetConsumos_AgrupadosDivididos` (`:2702`) y `Procesar_Consumos` (`:2953`).

### 16.2 Corrección de gas (`CorregirConsumoGAS`, `clsConsumos.cs:1305-1337`)

```
NETO     = consumo original (m³ leídos)
consumo  = NETO × presión × temperatura × factor calórico (FACTOR_CAL por período/categoría)
           × coeficiente corrector / factor óptimo
redondeo según Facturacion_Tipo_Redondeo_Gas
```

Se puede volver a corregir partiendo de `NETO`.

### 16.3 Distribución de consumos (`DST_CONSUMO`, `clsConsumos.cs:2348-2697`)

Un servicio "padre" (medidor general de un consorcio o un barrio) reparte su consumo entre servicios "hijos":

- Por **porcentaje**.
- **Igualada**: partes iguales, y el último hijo absorbe la diferencia de redondeo.
- **Combinada**: hasta un tope por hijo; si el consumo supera `TOPE`, no se reparte.

Cada hijo recibe un `CONS_SER` estimado "Redistribución de Consumo" y el padre, un consumo negativo compensatorio (`Get_ConsumosDistribuidos`, `:2481-2615`). No se distribuye a servicios GC, a servicios no conectados ni a servicios de otro tipo. V2 2618 evita redistribuir dos veces en el mismo mes.

---

## 17. Demanda y transgresiones

- Las categorías tarifarias con conceptos de demanda (`CATTARIF.TIP_ENE` DP/DV/DFP) facturan la **potencia contratada** (`SERSOC.CON_BASE`) o la registrada, la que sea mayor según la tarifa (documento 01).
- `clsTransgresiones` (`Consumos/clsTransgresiones.cs:58-138`) detecta los servicios cuya demanda registrada supera la contratada:

  ```
  % de transgresión = demanda × 100 / contratada − 100
  ```

  Registra `PRIMER_TRANSGRESION`, `DEC_CON` (demanda declarada actual) y `FEC_DECCON`. `Procesar` (`:121`) puede resetear `DEC_CON = CON_BASE`.
- La demanda contratada por período se guarda en `SERSOC_DEMANDASXPERIODO` (`Guardar`, `clsSocios.cs:4486`) y la consulta `clsConsumosAFacturar.GetTotalContratado` (`Facturacion/clsConsumosAFacturar.cs:142`, `:307`).

---

## 18. Energía inyectada (generación distribuida)

- **No hay un tipo de energía propio para la inyección.** Se modela como una medición `MEDSOC` de energía activa (`TIP_ENE = "A"`) con **consumo negativo**: factor multiplicador negativo, o medidor "indicado". Ver `clsConsumosAFacturar.GetTotalConsumoInyectada`, `Facturacion/clsConsumosAFacturar.cs:289-304`: suma los consumos activos negativos con `est_act > est_ant` o `INDICADO`.
- `CheckearLectura` acepta consumos negativos solo si `FAC_MED < 0` (§14.2).
- En facturación, V2 int 3094 define el **concepto de crédito por energía inyectada** que se usa cuando el total neto da negativo (`clsFacturacionMasiva.cs:203`, `:1289`, `:1581`). V2 2737 interviene en `clsFacturacionServicio.cs:3933` (documento 01).
- Con Discar se puede leer el registro del generador (`LEC_MEDTEL.GENERADOR`).

---

## 19. Telemedición

### 19.1 Arquitectura

La clase abstracta `SistemaTelemedicion` (`Varios.Telemed.Telemedicion/SistemaTelemedicion.cs:40-299`) define las operaciones que cada proveedor puede implementar:

- Configuración: `CargarConfiguracion`.
- Ciclo del medidor: `Alta`, `CambioCategoria`, `AsignacionMedidor`, `RetiroMedidor`, `CambioMedidor`, `ConfirmarOT`.
- Corte: `CorteServicio`, `ReconexionServicio`.
- Lecturas: `TomaEstado` (por servicio u OT, o por lista de `IMP_WORK`), `Get_PropiedadesLectura`, `TomarLectura`.
- Prepago: `ValidarPreVenta`, `CargaCreditoPrepago`, `EstadoCargaCredito`, `HistorialCargas`.
- Varios: `GenerarOT`, `RegistrarAuditoriaTelemedicion`, `Save_Operacion`.

La fábrica es `clsTelemediciones.GetSistema` (`Varios.Telemed/clsTelemediciones.cs:445-538`), según `TIPMED.SIS_TEL` (enum `Titulares/Sistemas_Telemedicion.cs`, valores 0-26). La configuración por sistema (URL, usuario, clave, dato extra) está en la tabla `TELEMEDICION`. Al cerrar una OT se llama al proveedor **antes** de confirmar; si falla, la OT queda abierta (`clsTecnica.cs:1310-1328`).

### 19.2 Proveedores

| SIS_TEL | Sistema | Uso |
|---|---|---|
| 1 | Discar | Medición inteligente y prepago de energía, por HTTP con comandos de ancho fijo: `@ASUM` alta, `@CSERS` cambio de categoría, `@AMED` asignación, `@RMEDI` retiro, `@CREM` carga de crédito, `@ESTCREM` estado (`Discar.cs:1191-1520`). Lee registros de activa y reactiva por tarifa T0..T6 y DemandaMax T0..T6 (÷1000). Toma el máximo de hasta 3 registros configurados (`LEC_MEDTEL.COD_LEC`, `COD_LEC2`, `COD_LEC3`). V2 2504/2336: número de contrato; V2 2594: validar la preventa; V2 3116: reglas al confirmar ciertas OTs. |
| 3 | Partner | La fábrica devuelve `null`: no está implementado. |
| 4, 12 | Boiero, Boiero TSM | Medidores prepagos |
| 5 | AION | Sincronización de servicios y transferencias |
| 6, 7, 10, 13 | NEXO, NEXO SQL, NEXO TCP2, NEXO PLUS | Por socket TCP (V2 2491 fuerza la reconexión del socket) o por SQL (V2 dec 2370 = espera entre reintentos, con 5 intentos) |
| 8 | MikroTik | Aprovisionamiento ISP: alta y corte de clientes de internet (V2 car 2393, V2 2897) |
| 9, 18 | CashPower, CashPower MWS | Prepago (tokens) |
| 11, 16 | Radius Gretix, Radius | ISP |
| 14 | BATCOM | Solo por V2 2713 con V2 car 2264 = "BAT" (§4.2) |
| 15 | Sensa | ISP/TV |
| 17 | SmartOLT | Fibra (OLT) |
| 19 | C_Token | Prepago (tokens) |
| 20 | Hexing | Medidores inteligentes y prepagos |
| 21 | Rainbow | Medidores |
| 22, 24, 25 | QUO, Silexis, Kaptor | Toma de estado por HTTP |
| 23, 26 | Sopnet, Wispro | ISP |
| 2 | Central telefónica | No aplica a esta fábrica |

- **Prepago**: `ValidarPrepaga` (`clsTelemediciones.cs:211`) y `RegistroVentaPrepagaTelemed` (`:228`) validan y registran la carga de crédito al vender (documento 05).
- **No hay curvas de carga.** No se encontró en ReglasNegocio ninguna importación o almacenamiento de perfiles horarios o de intervalos. La telemedición solo trae lecturas de registros acumulados y la demanda máxima por tarifa horaria.

---

## 20. Parámetros V2 relacionados

| Parámetro | Tipo | Efecto observado | Dónde |
|---|---|---|---|
| 32 | lógico | Numeración `COD_SOC` separada para activos y no activos | `clsSocios.cs:706` |
| 2673 | lógico | Con V2 32, cuenta `ACTIVOBAJA` como activo | `clsSocios.cs:708` |
| 2077 | lógico | Permite DNI duplicado | `clsSocios.cs:876`, `:891` |
| 3196 | lógico | DNI duplicado solo si el socio anterior está de baja | `clsSocios.cs:895` |
| 340 | lógico | Permite la baja de un socio con servicios activos | `clsSocios.cs:952`; `clsPMovil_Base.cs:187` |
| 337 | lógico | Bloquea la baja si el socio tiene capital | `clsSocios.cs:956` |
| 2490 / 744 / 745 | entero | Validación de datos de contacto; celular y email (1 pregunta, 2 bloquea) | `clsSocios.cs:1463-1469` |
| 2286 | lógico | Fuerza el guardado del servicio | `clsSocios.cs:1169`, `:2911` |
| 3034 | carácter | Integración SITSA al guardar la cuenta | `clsSocios.cs:1216` |
| 2324 | lógico | Pregunta la baja del socio que queda sin cuentas tras transferir | `clsSocios.cs:1295` |
| 2330 | entero | Código de transacción OT "cambio de categoría" | `clsSocios.cs:3182`; `MikroTik.cs:119` |
| 2455 | lógico | La categoría nueva se aplica al cerrar la OT | `clsSocios.cs:1952` |
| 2399 | lógico | Al retirar el medidor, borra `NUM_MED` y la matrícula | `clsSocios.cs:2226`; `clsTecnica.cs:1367` |
| 2707 | lógico | "Actualizar la Fecha de Alta al reconectar un Servicio No Medido en el mismo mes". Si está **apagado**, la reconexión de un servicio no medido en el mismo mes de la baja restaura la fecha de alta anterior *(corregido)* | `clsSocios.cs:2498` |
| 2713 + car 2264 | lógico + carácter | Integración BATCOM (`COD_SER = 1`); 2264 identifica al cliente (por ejemplo "BAT", "ARR") | `clsSocios.cs:2508`, `:2533` |
| 2250 | lógico | "Permitir servicios con Matrícula duplicada": si está activo, **no** se controla la unicidad de la matrícula (salvo `MATRICULA_AUTO`) *(corregido)* | `clsSocios.cs:2608`, `:2753` |
| 2740 | lógico | Una sola tarifa social por socio | `clsSocios.cs:2674`; `clsSegmentacion.cs:1622` |
| 3155 | lógico | Modo de reset de la segmentación (SEF y subsidio) | `clsSegmentacion.cs:252` |
| 332 | entero | Servicio con OT automática al guardar | `clsSocios.cs:3045` |
| 2416 | lógico | Precio y depósito del stock trazable al mover el medidor | `clsSocios.cs:3273` |
| 2541 | lógico | La transferencia deja el servicio viejo como "no vigente" (5) | `clsSocios.cs:3351` |
| 2291 | entero | Adherentes al transferir: 1 copia de baja, 2 copia activos, 3 elimina | `clsSocios.cs:3470` |
| 2669 | lógico | La deuda del domicilio se evalúa a hoy | `clsSocios_Capital.cs:229` |
| 2855 | lógico | Desactiva el registro automático de capital | `clsSocios_Capital.cs:54-283` |
| 2429 / 2606 | carácter / decimal | Fecha de la próxima asamblea / umbral de deuda de capital | `clsSocios_Capital.cs:403`, `:416` |
| 2792 | carácter | Tipo de comprobante del rescate de acciones | `clsSocios_Capital.cs:661` |
| 3058 | lógico | Oculta en la ficha a los adherentes dados de baja por fallecimiento *(corregido)* | `clsServicio.cs:502` |
| 439 | decimal | % de tolerancia de los umbrales de lectura | `clsTelemed.GenerarRutas` |
| 2809 | lógico | Usa las observaciones postales de la cuenta en la ruta | `clsTelemed.GenerarRutas` |
| 3063 | lógico | "Corregir fecha y cabecera para importación txt"; en `GuardarRutas` también activa el log detallado de duplicados | `clsTelemed.GuardarRutas` (`clsTelemed.cs:422`) |
| 2559 | lógico | Marca como estimado si el último consumo fue estimado | `clsTelemed.GuardarRutas` |
| 2682 | lógico | Confirma con la categoría actual del servicio | `clsTelemed.ConfirmarRuta` |
| 2595 | lógico | Adjunta las fotos de la lectura al consumo | `ConfirmarRuta`; `clsConsumos.cs:3040` |
| 2088 | lógico | Valida el estado contra la cantidad de dígitos | `clsTelemed.CheckearLectura` |
| 2087 | lógico | Formato de decimales en la importación | `clsTelemed` (importación) |
| 2590 | entero | Orden de impresión de la ruta | `clsRutas` |
| 458, 468, 469, 2293, 2297, 2298, 2331, 748, 3197 | lógico | Datos enviados al captor (observación postal, lectura y consumo anterior, ZSR, categoría, estado, matrícula, manzana/lote, propiedad) | `clsPMovil.AddRutas` |
| 2098 | lógico | Orden de la ruta por la última toma del lecturista | `clsPMovil.AddRutas` |
| 2345 | lógico | Limpia la base del captor | `clsPMovil.LimpiarBase` |
| 2241 | carácter | Ruta del captor | `clsPMovil` |
| 518 / 519 | carácter | Identificación de la cooperativa como cliente de Procoop en la nube | `clsPMovil_Base.cs:101`; `clsPMovil_Sms.cs:72` |
| PMovil 28 / PMovil 72 | lógico | Datos catastrales en la app / fotos en S3 | `clsPMovil`; `clsPMovil_Telemed.cs:189`, `:398` |
| 3074 / 3075 | entero | Columnas del archivo Rainbow | `clsDetalleRuta.cs:916-917` |
| 2054 | entero | Servicio de la importación de Aguas Cordobesas | `clsImportacion_AC` |
| 2520 | lógico | Orden de las mediciones por concepto | `clsConsumos.cs:1727` |
| 2618 | lógico | Control de redistribución duplicada por mes (en lugar de por período) | `clsConsumos.cs:2418` |
| 3094 | entero | Concepto de crédito por energía inyectada | `clsFacturacionMasiva.cs:203` |
| 2737 | lógico | Tratamiento de la inyección en la factura del servicio | `clsFacturacionServicio.cs:3933` |
| 2504 / 2336 / 2594 / 3116 | lógico | Discar: número de contrato, preventa, reglas de OT | `Discar.cs:1327-2004` |
| 2491 | lógico | NEXO TCP2: forzar la reconexión del socket | `NEXO_TCP2.cs:146` |
| 2370 | decimal | NEXO SQL: segundos entre reintentos | `NEXO_SQL.cs:269` |
| 2393 / 2897 | carácter / lógico | MikroTik: configuración del perfil y el corte | `MikroTik.cs:78-251` |
| 2399 (precisión) | lógico | Al retirar, vacía `NUM_MED`; también se vacía sin el parámetro si el medidor es trazable | `clsSocios.cs:2214-2232` |
| 914 | ver nota | Catálogo: "días máximo desde último vencimiento para pagar web"; `GenerarClaveWeb` lo lee como **lógico** para elegir clave aleatoria o DNI **[VERIFICAR]** | `clsSocios.cs:5129` |
| 2557 | lógico | Muestra la observación del servicio junto a su descripción en la grilla de la cuenta | `Servicios/clsCuentas.cs:186-235` |
| 2918 | lógico | Descripción del domicilio con piso, departamento, barrio y CP | `Servicios/clsCuentas.cs:721` |
| 759 / 760 | decimal | Alícuota IIBB para no incluidos en el padrón de servicios públicos / de otros servicios | `Servicios/clsCuentas.cs:749` |
| 2923 | lógico | Importador ARBA para percepciones y retenciones de ATER (RN 208/24 y 234/24) | `Servicios/clsCuentas.cs:853` |
| 2824 | entero | Destino de SMS/WhatsApp: 0 registrados desde Cooponline, 1 registrados en el titular, 2 ambos | `clsSocios.cs:5900` |
| 3051 | lógico | Agrupar el envío de WhatsApp de facturación por socio y teléfono (usa el móvil) | `clsSocios.cs:5900` |
| 639 | entero | Tipo de comprobante exclusivo de cuotas de plan de vivienda | `Titulares/clsViviendas.cs:321` |
| 2832-2849, 2868, 2898, 3017, 3130, 3149-3151, 3180-3183 | entero / carácter | OCEBA 544: productos e impuestos que se mapean a cada columna de la DDJJ (cargo fijo, subsidio, potencia, demanda, pérdidas, coseno fi, excesos, bonificaciones, conceptos de ley, generadores) | `clsInformes_Consumos.cs:3938-4219` |
| 3011 / 3012 con 2962 / 2963 | entero | Control previo OCEBA 544: impuesto de ley 5,5 % y 3,5 % contra el porcentaje calculado. 2962/2963 están catalogados como "% coseno de fi T2/T3" pero se usan como alícuota ÷ 1000 **[VERIFICAR]** | `clsInformes_Consumos.cs:3883-3936` |
| 2948 | lógico | "544 OCEBA – (NO DESARROLLADO) Informar consumos bimestrales": se lee pero no cambia nada | `clsInformes_Consumos.cs:3841` |

---

## 21. Implicancias para GoodApps

1. **Modelo de padrón.** Conviene mantener los cuatro niveles (persona → asociado → cuenta → servicio), porque las cooperativas los usan: un asociado tiene varias cuentas y una cuenta, varios servicios con domicilios distintos. Hace falta soportar personas no socias (usuarios o clientes) y la regla de una sola cuenta principal. Se sugiere separar el domicilio postal del domicilio del suministro, con nomenclatura catastral y GPS.
2. **Estado explícito del servicio.** Procoop deriva el estado de cuatro fechas y usa la fecha centinela 1901-01-01. GoodApps debería tener una máquina de estados explícita (pendiente de conexión → conectado → pendiente de baja → baja → no vigente), con eventos fechados, y separar la fecha administrativa de la técnica. Las transiciones de los servicios técnicos ocurren solo al cerrar la OT.
3. **Configuración por tipo de servicio.** El comportamiento depende de `TipoRegistracion`, `TipoCalculo` y unos 20 flags `REG_*`. Se recomienda un "tipo de servicio" configurable con un esquema de datos requeridos (medidor, adherentes, catastro, garante, factibilidad, dispositivos), en lugar de código condicional.
4. **Validaciones parametrizables.** Las de §3 (DNI único con excepciones, CUIT obligatorio según la situación IVA y verificado contra el padrón de ARCA, email y celular con "advertir o bloquear", tarifa social única, deuda en el domicilio) deben ser políticas por tenant con tres niveles: apagado, advertencia y bloqueo.
5. **Reglas de altas automáticas y cargos de conexión.** Es un motor de reglas "evento → acción" (alta de un servicio asociado, concepto a cobrar, OT). Conviene implementarlo genéricamente con filtros declarativos.
6. **Lecturas: un solo pipeline.** Captor, app, archivo, telemedición y carga manual deben converger en un mismo flujo de lote de lectura con estados (generado → enviado → recibido → validado → confirmado). La confirmación debe ser **idempotente** y verificar el estado anterior y el medidor vigente, como hace `ConfirmarRuta`. Los importadores específicos por cooperativa o fabricante deben ser plugins de mapeo configurables, no código.
7. **Validación de consumos más fuerte que Procoop.** Hoy solo hay umbrales informativos con un % global y una vuelta de medidor implícita. Para GoodApps se proponen:
   - Rango esperado por servicio, según el promedio móvil de N períodos, la estacionalidad (mismo mes del año anterior) y un % por categoría.
   - Distinguir "vuelta" de "lectura menor" con confirmación explícita.
   - Reglas configurables de bloqueo o revisión.
   - Una cola de excepciones para el operador.
8. **Estimados con trazabilidad.** Hay que guardar el método de estimación y su base. El ajuste debería poder ser refacturación o bonificación en unidades, según la política de la cooperativa o del ente regulador, y no solo bonificación en m³ como hoy.
9. **Medidores como activo.** Los medidores deben ser entidades propias (número, marca, tipo, dígitos, constante, telemedido, stock y trazabilidad) con un historial de instalaciones en suministros, en lugar de campos del servicio. Así el cambio de medidor genera lectura de retiro + lectura de instalación de forma natural, y desaparece el problema de dos servicios con el mismo medidor.
10. **Mediciones múltiples y energía inyectada.** El modelo debe tener canales o registros por medidor (activa entregada y recibida, reactiva, demanda por banda horaria) en lugar de MEDSOC + factor negativo. La inyección (Ley 27.424 y leyes provinciales) necesita un registro propio de "energía recibida" y reglas de compensación o crédito explícitas.
11. **Telemedición con interfaz de adaptadores.** La interfaz de `SistemaTelemedicion` es un buen punto de partida. Hay que separar tres familias: medición (toma de estado), prepago (crédito y tokens) y aprovisionamiento ISP/TV (MikroTik, Radius, SmartOLT, Wispro). Las llamadas deberían ser asíncronas con reintentos y auditoría, y no bloquear el cierre de la OT con transacciones abiertas. Hay que planificar curvas de carga, que Procoop no tiene.
12. **Segmentación de subsidios.** La importación de padrones RASE, SEF y resoluciones se renueva con cada cambio normativo. Debe resolverse con formatos de importación versionados y un mapeo de categoría base ↔ categoría subsidiada, con reversión masiva y exclusiones por servicio.
13. **Capital social.** Es un subledger por asociado con suscripción, integración, reservas, transferencias y rescates. El cálculo de "al día para la asamblea" depende de una fecha y un umbral, lo que debería ser configuración de la asamblea y no un parámetro global.
14. **Migración.** Hay que mapear las fechas 1901-01-01 a nulos, `COD_CSE` a la clave del servicio, `CONDICION` a estados, `MEDSOC` y `FAC_MED` negativo a canales, `IMP_WORK` y `HISWORK` (solo como histórico) y `CONS_SER` con `ESTIMADO`, `GRUPO` y `SEG_TOT` a lecturas con su tipo.

---

## 22. Dudas abiertas

1. **Algoritmo de `Impuestos.ValidaCuit` y `GenerarCuit`.** Están en `CapaNucleo`, que no se revisó. Falta confirmar si respetan los prefijos 20/23/24/27/30/33/34 y el caso del dígito 10.
2. **`EstimarConsumo` con cero períodos.** El promedio divide por la cantidad de períodos sin chequear que sea mayor que 0 (`clsInformes_Consumos.cs:291-299`). No está claro si la UI lo impide.
3. **Vuelta de medidor sin confirmación.** Una lectura menor a la anterior se toma siempre como vuelta. No está claro si las cooperativas lo compensan operativamente con V2 2088 o con la revisión de umbrales.
4. **`REG_GARANTE` siempre bloquea.** No hay advertencia opcional; falta confirmar si es intencional.
5. **Partner (`SIS_TEL = 3`).** La fábrica devuelve `null`; falta saber si quedan clientes con ese sistema configurado.
6. **BATCOM con `COD_SER = 1` fijo.** Supone que energía es el servicio 1 en ese cliente.
7. **Numeración por MAX + 1** en `COD_SOC`, `COD_SUM`, `ID_MEDSOC`, `COD_ADH`, `COD_CONS`, `COD_SOL`. Hay riesgo de colisiones concurrentes (en algunos casos se usa `GetMaxValue_Boqueo`). Para la migración hay que saber si hay huecos o duplicados históricos.
8. **`Recategorizar` (segmentación)** llama a `CommitTransaction` o `RollBackTransaction` sin que se vea un `BeginTransaction` en el método (`clsSegmentacion.cs:1720-1729`). Falta confirmar si la conexión abre la transacción implícitamente.
9. **Energía inyectada como consumo negativo.** Falta confirmar cómo se configura en la práctica: un medidor bidireccional con dos `MEDSOC`, uno con factor negativo, o un solo registro neto. También falta revisar cómo se informa a los entes (documento 10).
10. **Semántica exacta de varios V2.** 451 (se lee en `GuardarRutas` pero no se usa), 455, 3140, 2087, 3116 y 2737. No hay catálogo de descripciones en el código; hay que contrastarlo con la tabla `V2` de una base real (documento 09).
11. **Umbrales con un % global (V2 439).** Falta confirmar si las cooperativas lo tienen configurado y si esperan rangos por categoría o estacionalidad.
12. **Bonificación de estimados solo en m³.** Falta saber si la usan también en energía o si refacturan, y qué exige cada ente regulador provincial (ERSEP, EPRE, OCEBA).
13. **Base MySQL compartida de la app móvil.** Todas las cooperativas comparten una base separada solo por `COD_SUM`. Falta evaluar qué datos de lecturas, fotos y GPS habría que migrar y si existe obligación de conservarlos.
14. **Lógica de negocio con UI.** Hay `MessageBox` y formularios dentro de las reglas (transferencias, bajas, importaciones). Falta relevar qué decisiones toma hoy el operador en esos diálogos para convertirlas en opciones explícitas de la API.
15. **Curvas de carga y demanda horaria.** No aparecen en el código. Falta confirmar si alguna cooperativa las obtiene por fuera de Procoop (software del fabricante) para grandes usuarios.
16. **`Retirar_Medidor` sin efecto** (`clsSocios.cs:1110`): modifica el servicio pero no llama a `SubmitChanges`. Falta saber si el llamador guarda después o si es código muerto. **[VERIFICAR]**
17. **Rango de edad invertido en `Get_TAR_ADHE_Importe`** (`clsSocios.cs:4807`): la condición pide `EDA_INI >= edad` y `EDA_FIN <= edad`, lo que solo coincide si el rango es de un solo año. Puede ser un error de Procoop que haga caer siempre en el importe por defecto. **[VERIFICAR]**
18. **`Actualizar_ImporteCategoria` pisa `COSTO_SUBSIDIO`** (`Titulares/clsServicios.cs:543`): al actualizar el precio unitario también reemplaza el costo de subsidio. **[VERIFICAR]**
19. **V2 2713 con dos significados.** En el catálogo es "Generar y confirmar OT de alta luego de cobranza de servicio desconectado", pero `clsSocios` lo usa para la integración BATCOM (§4.2). **[VERIFICAR]**
20. **`getCambioGas` ignora el servicio** (`Servicios/clsServicio.cs:474`): recibe `cod_ser` pero limpia `COD_CLS` de todas las categorías de gas con `CUA_GAS = 'P'`. **[VERIFICAR]**
21. **Propósito de `Get_ServiciosClase`** (`clsSocios.cs:5310`): los tipos 1 y 2 y la exclusión por 4 meses en 0 parecen reglas de un cliente puntual (cambio de clase por consumo). Hay que confirmar con qué cooperativa se usa. **[VERIFICAR]**
22. **Acciones de trámites como SQL libre** (`TRAMITES_ACCIONES`, §23.3). Hay que relevar qué scripts tienen configurados las cooperativas para convertirlos en acciones tipadas en GoodApps. **[VERIFICAR]**
23. **Medidores "propios" con `COD_SER = 1` fijo** (`clsConsumos.GuardarMedidorP`, `:2146`): el informe de pérdidas supone que energía es el servicio 1. **[VERIFICAR]**

---

## 23. Reglas adicionales (segunda pasada)

Esta sección agrega las reglas encontradas en la revisión método por método de `Titulares`, `Servicios` y `Consumos`, agrupadas por clase. No repite lo que ya está en §2-§19; cuando amplía algo, lo indica.

### 23.1 `Titulares/clsSocios.cs` — padrón, cuentas y servicios

**Adherentes y vínculos (amplía §10)**

- `PersonaEsAdherente` (`:125`): una persona no puede ser adherente activa del mismo servicio (`COD_SER`) en dos servicios distintos. Si ya lo es, devuelve la cuenta donde está. `Get_Adherente_CODADH` (`:2186`) resuelve el adherente por código.
- `Get_Cod_Adh_Condicion_CambioCat` (`:169`) aplica las mismas reglas de edad, ocupación y vínculo que `Get_Cod_Adh_Condicion` (`:140`), pero contra la categoría destino de un cambio de categoría. A diferencia de aquella, **no excluye** a los discapacitados ("DISCA"). En ambas, una edad 0 (sin fecha de nacimiento) no se evalúa.
- `CambiarCategoria_Adherentes` (`:239`) borra la tarifa de adherente (`COD_TAD`) de los adherentes afectados y cambia `COD_CAT` y `COD_CATSER` del servicio. `DarBaja_Adherentes_Condicion` (`:204`) deja la baja anotada en `OBSERVA` con el usuario. `Get_Adherentes_CambioCat` (`:317`) lista los afectados.
- `Get_DeudaAdherente` (`:283`): la deuda de un adherente es la suma de saldos de las cuentas donde esa persona es titular o persona de la cuenta.
- `Reconectar_Adherentes` y `Reconectar_Beneficiarios` (`:2120`, `:2131`) **no reconectan a los fallecidos** (`FEC_FAL` informada). Las variantes `Desconectar_*` (`:2142`, `:2153`, `:2178`) desconectan a todos.
- `Get_TAR_ADHE_Importe` (`:4807`) busca el importe de la tarifa del adherente por ocupación y rango de edad; la condición de rango está invertida (Duda 22.17).
- `Guardar_ADHSOC`, `Guardar_BENSOC` y `Guardar_MEDSOC` (`:4248`, `:4289`, `:4318`): si una `MEDSOC` nueva no trae `FEC_LEC`, toma `ALTA_ADM` del servicio; los cambios de `MEDSOC` dejan historial en `HIS_MEDSOC`.

**Conceptos de conexión (amplía §3.6)**

- `Get_CONEXION` para OTs (`:471`): si la OT está en estado 1 (pendiente) y no viene de un cierre de la app móvil, aplica los conceptos de tipo 6 ("antes de la OT"). Si la OT no está confirmada y está en estado 3 o se cierra desde la app, aplica los de tipo 5 ("después de la OT"). Filtra además por código de transacción (`COD_TRAN`) y por reclamo.
- `Get_CONEXION` por evento (`:496`): tipo 3 alta de titular (filtra localidad y `SOC_CTE`: 1 todos, 2 socios activos, 3 no activos), tipo 7 transferencia, tipo 2 cuenta nueva, tipo 1 servicio nuevo, tipo 4 servicio reconectado y tipo 6 OTs nuevas (`COD_SOL = 0`).
- `GetQuery_CONEXION` (`:558`): los filtros `DESACTIVAR`, `MOROSO` y `PREPAGO` (categoría con `CATE_SER.PREPAGA`) se evalúan contra el servicio; `PROVISORIO` solo aplica si el servicio cobra provisorio; `COD_PROP = 0` y `COD_EST = 0` significan "todos".
- `GuardarConexiones_Masivas` (`:451`) actualiza el importe `NETO` de varios conceptos a la vez.

**Datos de contacto, bloqueos y relaciones**

- `Validar_TelefonoMovil` (`:923`): en los servicios de telefonía móvil, el número (guardado en `NUM_MED`) debe ser único entre los servicios conectados del mismo `COD_SER`.
- `Get_Telefono` (`:837`) y `Get_Mail` (`:855`): si la cuenta no tiene teléfono o email, usan los registrados en la web (`SUMSOC_EXTRAS.TELE_WEB` y `CORREO_WEB`).
- `GetNumeroDestino` (`:5900`): destino de SMS o WhatsApp. Con V2 3051 se usa el móvil. Si no, según V2 int 2824: 0 = primero el registrado en Cooponline (`TELE_WEB`), después el móvil y después el fax; 1 = primero el fax y después el móvil; 2 = ambos.
- `Requiere_Confirmacion_Desmarcar_FacturaE` (`:911`): si `SERVICIO.REQUIERE_CONFIR_ENVIO_FACTURAE_ALTA`, quitar la factura electrónica pide confirmación.
- `EsRepresentante` (`:974`, `SOCIOS.REP_ASAMBLEA`), `BloquearPagoWeb` (`:980`, `SUMSOC.BLOQUEAR_FAC_WEB`) y `Cuenta_CajaBloqueada` (`:1136`, nota con `NOTA_SUM.BLO_CAJ`) son marcas que bloquean operaciones: pago web y cobro en caja.
- `Get_Relacion_OtraCuenta` (`:1000`): antes de una baja o transferencia informa si la persona es adherente, beneficiaria, garante de un servicio conectado, garante de una cuenta o garante de un titular en otra cuenta.
- `Completar_Sumsoc` (`:1120`): una cuenta nueva toma `ALTA = hoy` y deja la nota "Nueva Cuenta".

**Servicios no facturables y débitos (amplía §3.4)**

- `Guardar_SUMNOFAC` (`:1606`) lleva el historial de marcas de "no facturar" (`SUMNOFAC.ACTIVO`, usuario y fecha de marca y de desmarca).
- `Marcar_NoFacturarServicio` (`:1770`): solo un servicio por cuenta puede quedar marcado como no facturable. Marcar un servicio desmarca la marca a nivel cuenta (`NOF_SUM`) y deja una nota. `Marcar_Facturar` (`:1753`) y `CambiarEstado_SUMNOFAC` (`:1812`) revierten.
- `ImportarCuentas_MarcaFacturar` (`:1685`) importa marcas desde archivo: el valor "SI" significa facturar.
- `Guardar_DebitosExcluidos` (`:1632`): una cuenta puede excluirse del débito automático por tipo de factura (`DEBITO_EXCLUSION` por `COD_TPFC`).

**Servicios: estados, deuda y validaciones (amplía §3.2 y §4)**

- `ValidarCondicion` (`:2398`): si la `CONDICION` guardada difiere de la que se deriva de las fechas, prevalece la guardada y se ajustan las fechas (con la centinela 1901-01-01).
- `NoTiene_ServicioConectado_NoMarcadoCliente` (`:2429`), `TieneDeudaVencida` (`:2439`: algún comprobante con saldo distinto de 0 y hoy posterior al primer vencimiento) y `ValidarCuotasServicio` (`:2563`: bloquea si el servicio tiene cuotas `DEUDAVTA` pendientes con estado vacío).
- `Actualizar_CategoriaConsumo` (`:2457`) rechaza el cambio si el consumo ya está facturado.
- `Validar_Tarifa_Social` (`:2695`): la categoría social (`CAT_SOC` o "JUBILADOS") no cuenta si el servicio está de baja (condición 4).
- `ValidarPropiedadCatastral` (`:2716`): la designación catastral debe existir en `PROPIEDA`; la búsqueda es por "contiene", no por igualdad.
- `ValidarViviendaFecAdj` (`:1497`): la vivienda exige fecha de adjudicación (`VIVIENDAS.FECADJU`).
- `ValidarMedidor` (`:3715`) busca el mismo `NUM_MED` activo en **cualquier** servicio; `Existe_MedidorEnSersoc` (`:2762`) solo dentro del mismo `COD_SER`.
- `Get_Presupuestos` (`:2747`): alerta si el socio tiene presupuestos marcados `PRESUPU.ALERTAR` en estado vacío u "O".
- `Get_DeudaVencida` (`:5077`): deuda vencida de un socio o de una cuenta = comprobantes no anulados (`ESTADO` distinto de "A"), con saldo, no pagados (`PAGA` distinto de "P") y con el vencimiento elegido (1 a 4) anterior a hoy. Los créditos restan.
- `tieneDeudaPrescripta` (`:5814`) detecta pagos hechos con un plan de caja de prescripción (`PLAN_CAJ.PRESCRIPCION`).
- `Baja_Al_GenerarOT_Desconexion` (`:3764`, amplía §4.2): si el servicio está pendiente de desconexión (3) y `SERVICIO.CONSULTA_BAJA`, al generar la OT pasa a baja (4) con `FEC_BAJA = hoy`.
- `Validar_OrdenTrabajo` (`:5773`) verifica que las OTs nuevas hayan quedado grabadas.

**Telefonía**

- `Actualizar_Telefono_SERSOC` (`:2254`) registra en `TEL_SERSOC` cada alta, reconexión, cambio o retiro de línea; el número de línea (`TEL_NUMEROS.NUMERO`) se guarda en `NUM_MED`. `Get_ServicioTelefonia` (`:2370`) identifica el servicio por `TIP_CAL = 5`.
- `Actualizar_NuevoTelefono_SERSOC` (`:2236`) lee la tarifa antes de comprobar que exista. **[VERIFICAR]** si puede fallar con OTs sin tarifa.
- `Actualizar_NuevoMedidor_SERSOC` (`:2338`, amplía §12.3): si la OT trae categoría nueva (`N_COD_CAT`), la aplica junto con el medidor y limpia `CAT_SOC`.

**Notas, trámites y artefactos**

- `Crear_NOTA_SUM` (`:3802`) numera con bloqueo de tabla (`GetMaxValue_Boqueo`) y encadena la nota con la anterior (`NOTA_SUM1`) para conservar el historial (`Get_NOTA_SUM_Historial`, `:3853`).
- Las variantes de `Guardar_NOTA_SUM` (`:3865`, `:3901`, `:3927`, `:3952`) escriben notas automáticas: "OT: transacción", fecha y estado. Las notas borradas pasan a `NOT_ELIMINADAS_HST` (`GuardarHistorialNotas`, `:3725`). `Guardar_NOTA_SUM_SIN_OT` (`:3991`) deja "Alta del servicio" o "Desconexión del servicio" cuando no hay OT.
- `PTRAMITES` (`:4029-4130`): los trámites o documentos presentados pueden colgar del socio, de la cuenta o del servicio.
- `ARTEFSUMS` (`:4170-4240`): declaración jurada de artefactos (gas) por cuenta, con estado (`DDJJEstados`); editar una DDJJ la vuelve al estado 1.
- `Crear_SU_EMP_CBU` (`:4133`) registra el CBU del titular para débito.

**Productos en comodato y demanda**

- `Guardar_SERSOC_PRODUCTOS` (`:4435`): un producto entregado en comodato con el servicio (por ejemplo, un router) genera una **salida de stock** en consignación al entregarse y una entrada al devolverse. El depósito por defecto es el 1 y el precio, el del ítem trazable (`PROD_TRH.PRE_TRH`).
- `Guardar_SERSOC_DEMANDASXPERIODO` (`:4485`) graba la demanda contratada por período (§17).

**Reclamos, transferencias e historial**

- `Guardar_RECLAMOS` (`:4723`) deja historial en `RECLAMOS_HIST` con el motivo "cambio de estado" o "modifican datos". `Save_PARTIINC` (`:4703`) y `Save_RECLAMOS_NOTAS` (`:4755`) completan el reclamo. `Get_Incidentes` (`:5245`) une OTs y reclamos y excluye el estado 4. `Get_Reuniones_Reclamo` (`:5952`) lista las reuniones.
- `Guardar_TRANSFER*` (`:4841-4901`, amplía §7): la observación se recorta (1000 o 200 caracteres) y los servicios de una cuenta transferida quedan registrados con el identificador de la transferencia de la cuenta (`ID_TRANS_CUENTA`). Las consultas `Get_TRANSFER_*` (`:4902-5006`) filtran la cuenta por el campo `SERVICIO`.
- `GetResumenHistorial` y `GetDatosHistorial` (`:5028`, `:5055`) muestran el historial de cambios.

**Clave web, adjuntos y numeración**

- `GenerarClaveWeb` (`:5125`) y `ObtenerClaveWeb` (`:5146`): la clave de la oficina virtual es aleatoria de 10 caracteres o el DNI, según V2 914 (ver §20, **[VERIFICAR]**). No se documenta el valor.
- `Get_InfoAdjuntos` (`:5211`): los adjuntos se tipan por entidad: 2 socio, 14 persona, 1 cuenta, 12 servicio.
- `getSetNroFicha` (`:1571`): número de ficha correlativo en `SUMSOC_EXTRAS.NROFICHA` (máximo + 1). `GetUltimoAsociado` (`:5107`) y `GetUltimoCodSoc` (`:5115`) dan los últimos números.
- `Get_Propieda_Nomenclatura` (`:4670`): la nomenclatura catastral tiene 6 partes y cada parte vacía vale "0".

**Procesos masivos y de corrección**

- `Get_ServiciosClase` (`:5310`) y `CambiarClaseServicio` (`:5487`): proponen el cambio de clase de servicios cuyo consumo cae en un rango. Solo consideran socios activos sin otro servicio conectado del mismo tipo. Tipo 1 excluye si el último consumo no facturado o 4 meses superan el máximo; tipo 2 exige que el domicilio del servicio coincida con el de la cuenta y excluye si el último mes supera el máximo. Ambos excluyen 4 meses seguidos en 0 (Duda 22.21).
- `UnificarEntidades` (`:5496`, con `:5511`, `:5553`, `:5601`, `:5635`): unifica localidades, calles, barrios, cuentas contables y contactos duplicados. Conserva el identificador menor, reasigna las referencias por SQL, borra los demás y registra auditoría. `InsertarZona` (`:5583`) crea zonas.
- `ImportarNotas_Cuentas` (`:1509`) importa notas con fecha en formato `ddMMyyyy`.

**Sorteos y beneficios**

- `Get_CandidatosSorteo` (`:5672`): candidatos al sorteo entre socios cumplidores. Toma facturas de débito con primer vencimiento en el rango (en modo diario, emitidas el mismo día del vencimiento), filtra activos o no activos, excluye fallecidos si se pide, excluye a los socios con más de N facturas vencidas y, opcionalmente, a quienes tengan financiaciones impagas (`CLASE` 1) o cuotas pendientes. La variante "Web" toma las facturas pagadas por la web.
- `ImportarRG60` (`:5823`) y `Get_InformeBeneficiariosRG60` (`:5868`): cruce del padrón de la Ayuda Covid (RG 60/2021) por CUIT, CDI o DNI extraído del CUIT.

**Recorridos**

- `GetGridView_RecorridosLectura` (`:741`) y `Get_RecorridosLectura` (`:782`): recorridos de lectura de servicios conectados con zona de lectura distinta de 0. `GetGridView_RecorridosFactura` (`:800`): recorridos de reparto de cuentas sin baja administrativa por zona de facturación.

**Métodos sin regla de negocio** (consultas o asignaciones directas): `Get_CATE_SER` (3 sobrecargas), `get_CATTARIF`, `GetGridDataSource_CONEXION`, `GetLista_Conexion`, `Existe_DISTRITO_SECCION_Seccion`, `Get_DISTRITO_SECCION`, `GetSuministroXSersoc`, `ActualizaMail`, `ActualizaMail_Cuenta`, `GetSociosXPersona`, `GetSocioXSuministro`, `Get_SOCIOS`, `Get_SocioXPersona`, `Get_DatosSuministro`, `Get_SUMSOC`, `TieneOtroSuministro`, `Get_CategoriaSersoc`, `Get_EstadoSersoc`, `Get_SERSOC` (5 sobrecargas), `Get_SERSOC_SUMSOC` (con "solo conectados" = condición 2-3), `Get_Sersoc_Productos`, `Get_Sersoc_ProductoXProducto`, `ActualizarUbicacionServicio`, `Get_NOTA_SUM`, `Get_ARTEFACTO` (2), `Get_ARTEFSUMS`, `Get_ARTEFSUMS_Marcas`, `Get_Internet`, `Get_GridView_PROPIEDA`, `Get_GridView_PROPIEDA_Buscador`, `Get_PROPIEDA` (2), `Editar_PROPIEDA`, `Get_PROPIESER`, `Get_TAR_ADHE_X_Ocupacion`, `Get_VINCULOS`, `Get_Incidente`, `Get_TecnicaByCodSol`, `Get_InformeSorteo`, `GetGridView_Consulta`, `EnUso_CATE_SER` (la categoría está en uso si algún servicio sin baja la tiene).

### 23.2 `Titulares/OpcionesEspeciales.cs` — operaciones especiales de corrección

Son herramientas de soporte con validaciones mínimas, pero cambian datos sensibles:

- `Validar_CambioCodSum` (`:100`), `Validar_Eliminar` (`:111`), `Validar_EditarSersoc` (`:122`: fechas posteriores a 1900) y `Validar_AltaBajaSercoc` (`:133`: la condición nueva debe ser distinta y requiere confirmación).
- `CambiarCuenta` (`:149`): renumera un `COD_SUM` en unas 60 tablas dentro de una transacción.
- `EliminarCuenta` (`:183`): **borrado físico en cascada** de la cuenta, incluidas facturas, consumos y capital.
- `EditarSersoc` (`:213`): edita a mano las fechas de alta y baja, la última facturación, la última lectura y el último estado. `CON_ANT` pasa a ser el último consumo registrado o el estado de lectura. Deja la nota "Modificación especial" e historial en `SERSOC_HST`.
- `AltaBajaSersoc` (`:275`): fuerza la condición del servicio. Lo impide si hay una OT pendiente que choque: de baja (`COD_TRAN` 3) para dar de baja, de conexión (1) para conectar, o cualquiera para "no vigente". Deja la nota "Operación especial".
- `Registrar_Fallecimiento` (`:338`): registra `FEC_FAL`, da de baja las adhesiones de la persona (y el servicio, si era el único adherente) y sus beneficios, lo anota en el socio y avisa las tareas pendientes: baja del titular, transferencia de servicios y cambio de garante.
- `Get_InfoPersona` (`:56`) es una consulta.

### 23.3 `Titulares/clsTramites.cs` — trámites y acciones automáticas (amplía §4.3)

- Tipos de acción (`Tipo_Acciones`): 1 cuenta, 2 servicio, 3 proveedores, 4 empleados. Estados del filtro: 1 presentados, 2 no presentados, 3 sin trámite.
- `Get_TramitesPresentados` (`:176`): un trámite está **vencido** si su `FECHA_VTO` pasó o, si no tiene, si `FECHA + TRAMITES.DIAS_VENCE` es anterior a hoy, y además no existe otro trámite vigente del mismo tipo para la misma entidad. Filtra por titular, servicio, empleado o proveedor.
- `Get_TramitesNOPresentados` (`:322`): servicios o proveedores a los que les falta el trámite.
- **Acciones configurables en SQL**: `EjecutarAcciones_Automaticas` (`:433`) y `Ejecutar_AccionExtra` (`:474`) ejecutan el script de `TRAMITES_ACCIONES.SCRIPT_ACCION`, reemplazando `{0}` por la cuenta, el servicio o el proveedor y `{1}` por los valores. Marcan `PTRAMITES.ACCIONADO` y registran auditoría. La acción extra omite a los proveedores que ya tienen la retención del tipo (`PROVEED_RET`).
- `VerificaryEjecutar_AccionesAltaVto` (`:694`): cada trámite puede tener un script al **alta** (`ACCION_ALTA`) y otro al **vencimiento** (`ACCION_VTO`). `{0}` es el id del trámite y `{1}`, la cuenta (tipo 0), el empleado (tipo 2) o el proveedor. Tras el alta, `ACCIONADO = false`; tras el vencimiento, `true`. Un error en un script no frena los demás: se registra y se sigue.
- `Get_Acciones_Extras` (`:740`): para titulares ofrece las acciones de tipo 1 y 2; para proveedores, las de tipo 3.
- `Guardar_TramitesProveedor` (`:639`) numera con bloqueo de tabla y, si la tabla está bloqueada, cancela.
- **Métodos sin regla de negocio**: `Get_Tramites`, `Get_Informe`, `Operacion_MarcarProvisorio`, `Operacion_CambiarActividad`, `Operacion_CambiarClase`, `Operacion_CambiarCategoria`, `Operacion_CambiarReferencia` (UPDATE directos ya descriptos en §4.3).

### 23.4 `Titulares/clsSocios_Capital.cs` (amplía §9)

- **Origen de cada registro de `CAPITAL`.** Todos los procesos solo toman conceptos de rubros capitalizables (`RUBCAPI`), comprobantes de clase 0 (no financiaciones) y son **idempotentes**: no insertan si ya existe el registro de capital para el mismo comprobante y concepto.
  - Facturas (`Guardar_CAPITAL`, `:52`): `FACTURADO` = importe del ítem (las notas de crédito restan). `COMPVEN` = el mismo importe cuando el ítem no es una cuota o el servicio no tiene importe de capital propio (`SERVICIO.IMP_CAPITAL = 0`). Las cuotas de ventas financiadas aportan la parte proporcional: descuento × (capital + IVA de la cuota) / total del comprobante × importe del producto.
  - Remitos y ventas (`_CompVen`, `:87`): `COMPVEN` = importe neto con descuento, para ventas no anuladas.
  - Alta del servicio (`_Servicio`, `:108`): `COMPVEN` = `SERSOC.IMP_CAPITAL`, por servicio dado de alta en el rango.
  - Pagos (`_Pagos`, `:197`): `PAGADO` = entrega / total de la factura × importe del concepto.
  - Financiaciones (`_Reccon`, `:281`): igual que los pagos, con el saldo refinanciado (`IT_RECCO.SALDO`).
- `Guardar_CAPITAL_Th` (`:146`) corre en segundo plano y, si se generaron más de 1000 facturas, reindexa antes las tablas de facturas.
- `Guardar_CAPITAL_Comprometido` (`:372`) registra un compromiso de capital del servicio y actualiza `SERSOC.IMP_CAPITAL`. `Generar_ImporteCapital_Sersoc` (`:121`) hace lo mismo en lote.
- `TieneDeudaCapital` (`:400`, amplía): la deuda es la suma de `FACTURADO − PAGADO` de los registros cuyo vencimiento (el segundo vencimiento de la factura o, si no hay factura, el `VTO1` o la fecha del registro) es anterior a la fecha de la asamblea (V2 car 2429), sin facturas anuladas. Si supera el umbral V2 dec 2606, el socio tiene deuda. Si V2 2429 no es una fecha válida, nadie tiene deuda.
- **Reserva y recupero** (`Registrar_CapitalReserva`, `:568`; `Recuperar_CapitalReserva`, `:495`): la reserva genera un movimiento negativo en `CAPITAL` y otro positivo en `CAPITAL_RES` con un comprobante numerado, en una transacción. El recupero hace el movimiento inverso y borra la reserva.
- `Existe_ComprobantePendiente` (`:330`): una OT en estado 1 o 2 con un comprobante de venta relacionado (`CMPORDE`) cuyo anticipo (cuota 0) sigue impago se informa como pendiente. `Relacionar_CompVen_OT` (`:307`) crea esa relación.
- `Posee_Servicios_Conectados` (`:553`) ante un error devuelve "sí", para no permitir la operación.
- **Métodos sin regla de negocio**: `Cuenta_Posee_Servicio`, `Guardar_CAPITAL` (sobrecarga de registro directo, `:355`), `GetCuentas_Socio`, `GetCapita_CuentaSocio`, `GetCapitalReserva_Socio`, `GetTransferencia`.

### 23.5 `Titulares/clsPersonas.cs` y `Titulares/clsServicios.cs`

**Personas**

- `EsDni` (`clsPersonas.cs:234`): el tipo de documento es DNI si su código AFIP es 96. `GetDocument` (`:366`) distingue CUIL (86) y CUIT (80).
- `Verificar_Persona_Cargada` (`:316`): busca la persona por DNI; si el documento es CUIL y el buscado es DNI, extrae el DNI del CUIL. `Verificar_Parentesco_Faltante` (`:342`) controla las cargas de familia en sueldos (`SU_EMP_FAMILIARES`).
- `Actualizar_Domicilio_PERSONAS` (`:242`) toma el domicilio nuevo de la OT de traslado.
- **Sin regla**: `GetPersona*` (`:138-215`), `GetPersonaXNombreDocumento` (`:215`, opción "solo no socios"), `ExisteDesignacionCatastral`, `Get_Ocupacion_X_Tipo`, `CargarPersona`.

**Configuración de servicios y cuadros tarifarios** (`Titulares/clsServicios.cs`)

- `Clonar_Categoria` (`:85`): copia la categoría con el sufijo "(Copia)" (máximo 40 caracteres) y su historial tarifario por cuadro (`HIS_CATE_SER`, `HIS_CATTARIF` por `COD_CUA`).
- `GuardarServicio` (`:120`): al guardar el servicio borra las propiedades, tarifas, coeficientes, tarifas de adherentes, categorías y planes o precios de vivienda que ya no estén en pantalla, y las lecturas de telemedición (`LEC_MEDTEL`) de tarifas borradas. Guarda los extras de categoría (subsidio, SEF, MikroTik, ARBA, prorrateo) y el reporte de OT.
- `GuardarServicioHistorico` (`:351`) y `ConvertirHistorico` (`:514`) guardan cuadros tarifarios históricos por `COD_CUA`.
- `Actualizar_ImporteCategoria` (`:543`): aumento masivo de tarifas por porcentaje, suma o valor fijo sobre precio unitario, precio sin impuestos y costos (TNE, MEM, EPEC, subsidio). Ver Duda 22.18.
- `ValidarEliminarCategoria` (`:604`): no se puede borrar una categoría usada en un servicio o en un ítem facturado (`ITEMSFAC` tipo 2).
- `ValidarEstructuraDosTarifas` (`:622`): dos tarifas son compatibles si tienen la misma cantidad de tramos con los mismos topes (`CON_TMAX`, `CON_MAX`). `ActualizarTarifaConOtra` (`:674`), `EliminarYClonarTarifas` (`:736`) y `ActualizarTarifasCoincidentesConOtra` (`:784`) copian valores tramo a tramo por posición, ordenando por tope y mínimo, incluidos los importes y códigos de descuento.
- `ExportarTarifas` (`:856`), `ImportarTarifas` (`:910`), `CsvToDataTable` (`:974`), `TarifasImportadas` (`:996`) y `PisarTarifasImportadas` (`:1017`): exportan e importan el cuadro en CSV con el separador regional; al importar se puede pisar todo o actualizar solo las tarifas coincidentes.
- `GuardarRelacion_Localidades` y `_Responsables` (`:1085`, `:1103`): relacionan el servicio con las localidades habilitadas y responsables (`RELACION_ENTIDADES`). Ver `ValidarLocalidadHabilitada` en §23.6.
- `Cargar_GrillaDispositivos` (`:1163`): carga un rango de números de serie de dispositivos y rechaza los que ya existen. `Controlar_Stock_Dispositivos` (`:1182`): la cantidad debe coincidir con el comprobante de compra.
- **Sin regla**: `ExisteId`, `GetServicios`, `GetServicio`, `ExisteServicio`, `GetServiciosMedidos`, `GetServiciosNoMedidos`, `GetCategoria` (2), `Get_Servicios`, `ObtenerPuntoDeVenta`, `GetDispositivo_*` (6), `Get_Postales`, `Obtener_Conexion`.

### 23.6 `Servicios/clsServicio.cs`, `Servicios/clsCuentas.cs` y división de consumos

**Servicio**

- **Cuotas de obra** (`Cuotas_Obra`): pavimento (`GetTotalPavimento`, `:164`, `:228`) = suma de frente × ancho de calle de cada frente + longitud de bocacalle × % de bocacalle, uniendo con `PROPIEDA` por nomenclatura. Agua (`GetImporteTotalAgua`, `:186`) = conexiones × coeficiente + superficie × (instalaciones básicas × % + redes primarias × %); cada porcentaje solo se aplica si está entre 0 y 100. `GetTotalAgua` (`:200`, `:223`) toma la superficie.
- `GetMaxMatricula` (`:450`): matrícula siguiente = máximo numérico + 1 por servicio.
- `getCambioGas` (`:474`): ver Duda 22.20.
- `ActualizarMedSoc` (`:570`, amplía §12.2): crea una `MEDSOC` por cada par tipo de energía-concepto de las categorías GC, con la fecha de lectura del servicio.
- `Get_ServiciosSensa` (`:610`): los servicios de TV de Sensa se identifican por `CATE_SER.TIPO_SER`, con valores separados por "|".
- `Get_LiquidaServiciosPublicos` (`:711`): el servicio liquida como servicio público ante AFIP si `LIQ_AFIP > 0`.
- `ValidarLocalidadHabilitada` (`:738`): si el servicio tiene localidades relacionadas, la del domicilio debe estar entre ellas.
- Opciones de reconexión (enum cerca de `:150`): generar OT, generar OT y reconectar, reconectar, cambiar estado, generar OT de cambio de estado.
- **Sin regla**: `Get_CodSer_byTipReg`, `GetDatosFicha` (salvo V2 3058), `GetTarifaSimple`, `ActualizarClase`, `RecuperarMediciones`, `Get_Moneda`, `GetTipoFac_Relacionado`, `GetTar_Adhe`, `GetAdherente`, `GetSersoc`.

**Cuentas e Ingresos Brutos**

- `DetalleCuenta` (`clsCuentas.cs:186-235`): los servicios de la cuenta se ordenan por grupo de facturación e `ID_SERSOC`; con V2 2557 se muestra la observación del servicio. `GetDescripcion` (`:721`) agrega piso, departamento, barrio y CP con V2 2918.
- **Padrón de IIBB**: `RegistrarIi_BB` (`:633`) genera dos registros por cuenta: "S" (servicios) y "P" (percepción), con un número de inscripción formado por el régimen y la cuenta a 10 dígitos y el CUIT del socio o su CDI. `ImportarIIBB_RN_012017` (`:749`) reemplaza el padrón (`IIBB_LUA`), cruza por CUIT y a los no incluidos les aplica las alícuotas por defecto (V2 dec 759 y 760), tipo "NI" y situación 6. `ImportarIIBB_BsAs` (`:853`) usa con V2 2923 el formato de ATER con alícuotas de percepción y retención.
- `ReasignarIngresoBrutos` (`:1078`): asigna la situación (`COD_SIB`) y el número de IIBB según el padrón o en forma masiva, salvo a las cuentas marcadas `NO_RESET`. `ValidacionAdvertencia_IIBB` (`:1129`) avisa al transferir si la situación cambia; `Get_CuentaDestino` (`:1118`) da el destino de la última transferencia.
- `ImportarMovTesore` (`:955`): migración de movimientos de tesorería por tablas temporales y un procedimiento almacenado.
- **Sin regla**: `PoseeGrupos` (§8), `Get_MailCuentaSeleccionada`, `AgregaEmail`, `GetDetalleCuentas`, `GetDatosIbBb_Lua`, `GetCondicionIIBB_LUA`.

**División de consumos** (`Consumos/clsConsumos.cs`, clase `AgrupaDivideConsumos`, amplía §16.1)

- `DividirXdiasMaximo` (`:454`): si la lectura abarca más días que el período, el consumo diario (consumo total / días) se reparte en un primer tramo de exactamente los días del período, **marcado estimado**, y un segundo tramo con el resto. Con "limitar consumo" se descarta el segundo tramo: solo se factura el equivalente al período. El estado intermedio se calcula dividiendo por el factor multiplicador.
- `DividirXdiasMaximoCambioMedidor` (`:568`): con dos lecturas de medidores distintos en el período, completa el período con el consumo diario del medidor nuevo (o recorta el del viejo si se pasó de días) y deja el resto para el período siguiente.
- `RealizarProrrateo` (`:768`): consumo = consumo × porcentaje / días de la lectura, redondeado hacia abajo a 3 decimales. El consumo original queda en `NETO`.
- Modo de redondeo `Valores`: 0 = 2 decimales, 2 = enteros (también los estados), 4 = 6 decimales.

### 23.7 `Consumos` — registración, controles e informes

**Registración y testigos** (`clsConsumos.cs`)

- `RegistrarConsumo` (`:1375`, amplía §14.1): un consumo sin lectura puede registrarse ya **facturado** (`FACTURADO = "F"`) si se indica un tipo de comprobante; en ese caso se le asigna punto de venta y número.
- `Crear_CONS_SER` (`:1490`): la fecha anterior es la última lectura o, si no hay, la fecha de alta; la descripción se recorta a 80 caracteres. `Guardar_CONS_SER` desde OT (`:1610`) toma la fecha de la OT o la de confirmación y recorta la observación a 40.
- `CargarMedsocNuevo` (`:1659`) y `CargarMedsocPNuevo` (`:1681`): solo guardan historial si cambia la potencia contratada, el estado o el consumo total.
- `GuardarConsumosEstimadosTestigo` (`:2249`): igual que el estimado común (§15), pero sobre el medidor testigo, partiendo de su última lectura.
- `GetUltimoConsumoNoFacturado` (`:2312`) devuelve la última lectura solo si no está facturada; `ConsumoFacturado` (`:2333`): facturada = tiene factura asociada o `FACTURADO = "F"`.
- `EsServicioPrepago` (`:1880`): categoría con `PREPAGA`.
- `Existe_DST_CONSUMO` (`:2348`): un servicio no puede ser hijo de dos distribuciones. `Guardar_DST_CONSUMO` (`:2370`) redondea el porcentaje a 2 decimales; tope, combinada e igualada se guardan iguales para todos los hijos. `Guardar_ConsumosDistribuidos` (`:2616`) numera padre e hijos con el número del padre en `NUM_COM` y **no graba el padre si su consumo es 0**. `EliminarDistribucion` (`:2688`) borra los hijos con el mismo `NUM_COM` grabados con un minuto de diferencia, sin tocar el último estado.

**Medidores propios y pérdidas**

- `CargarMedidorP`, `GuardarMedidorP`, `GetConsumosP` y `GuardarConsumoP` (`:2096`, `:2146`, `:1828`, `:2021`): la cooperativa registra la **energía que compra** en seis registros fijos: pico, resto, valle, punta, fuera de punta y reactiva (`MEDIDORP`, `CONSUMOP`). Ver Duda 22.23.
- `Get_Informe_Perdidas` (`clsInformes_Consumos.cs:3484`): compra de energía activa = pico + resto + valle; cos φ = cos(atan(reactiva / activa)); pérdida = compra − consumo facturado del servicio en el período, y % de pérdida = pérdida × 100 / compra. Hay una variante anual de 13 períodos y otra por zonas; el resumen se titula "para el ERSEP".

**Controles de consumo** (`clsInformes_Consumos.cs`)

- `CalcularDiferenciaPorcentualConsumo` (`:2307`): compara el consumo actual con el del período anterior por servicio y concepto: % = (actual / anterior − 1) × 100, con anterior 0 tomado como 1. El filtro "mayor a", "menor a" o "entre" se aplica sobre el valor absoluto, salvo un límite negativo. Descarta los servicios con ambos consumos en 0.
- `CalcularDiferenciaPorcentualDias` (`:2462`): marca los servicios cuyos días de lectura se desvían más de un % de los días esperados.
- `Get_ControlMedidores` (`:3117`): lista las lecturas del período de los servicios conectados (condición 2) y agrega en 0 a los que no tienen lectura, para detectar medidores sin leer.
- `ActualizarRecorrido` (`:3197`): renumera el recorrido de lectura según el orden real de la toma (por zona, sector y fecha), de 5 en 5 y desde 0 en cada zona y sector.

**Informes a entes reguladores** (`clsInformes_Consumos.cs`, `clsConsumos.cs`)

- Los informes por tramos y categorías se configuran en `INFOCTD`, `INFOCTG` (filas: categoría, tarifa, tramo de consumo, marcas "no informar a OCEBA", "tarifa bimestral" y "completar como convencional") e `INFOCTN` (columnas: producto, servicio o impuesto, con subtipo) (`clsConsumos.cs:3149-3322`). `GetCategoriasFaltantes` (`:3201`) avisa qué categorías del servicio no están configuradas y `GetErroresTramas` (`:3221`) detecta filas con tramos inconsistentes.
- **OCEBA 544**: `CompletarDeclaracionJurada` y `CompletarPlanillaDDJJ` (`:3731`, `:3751`) completan la planilla oficial con la facturación por categoría y tramo, mapeando conceptos con los V2 de §20. `ChequeosPrevios544` (`:3868`) controla antes: facturas con más de una categoría de energía (`GetFacturasMultiplesCategorias`, `:4058`) y diferencias entre el impuesto de ley facturado y el calculado sobre los conceptos configurados (`GetConceptosFacturadosYCalculados`, `:3883`). Las diferencias se exportan a CSV. **[VERIFICAR]** alícuotas (§20).
- **Compensación de subsidios** (Res. 431/24 y 65/25): `CompletarPlanillaRes_431_24` y `_65_25` (`:3771`, `:3791`, `:4222`, `:4251`) completan la planilla con los datos de `GetDatosCompensacion` (`:4280`: consumos de energía activa y conceptos con cuadro tarifario, por fecha de emisión, vencimiento o lectura).
- El detalle de los entes y el formato de los archivos corresponde al documento 10.

**Otros procesos de `Consumos`**

- `clsTransgresiones.GetTransgresiones` (`clsTransgresiones.cs:58`, amplía §17): revisa los consumos facturados de los conceptos de demanda (DP, DV, DFP) desde 6 meses antes, de servicios con primera transgresión registrada; filtra por fecha de primera o última transgresión. `Procesar` (`:121`) deja auditoría "RESET_DEM" con el valor anterior.
- `clsBonificacionEstimados.GetConsumosBonificar` (`clsBonificacionEstimados.cs:85`, amplía §15): opcionalmente solo lecturas telemedidas (`COD_OBS ≠ 0`) y del medidor actual. El redondeo de los metros es al alejarse de cero si `SEG_TOT < 2` y bancario en otro caso.
- `clsLlamadas` (`clsLlamadas.cs:264-460`): agrupa las llamadas de telefonía (`LLAMADAS`, `LLA_CEL`) del período en consumos (`CONS_SER`), marcando su `GRUPO`. Las llamadas sin origen (`COD_TSE`) se informan y pueden excluirse. `AgruparLlamadasGratis` (`:356`) genera consumos para los números gratuitos (`GRATIS`). `DesagruparLlamadas` (`:413`) revierte el agrupamiento solo si los consumos no están facturados.
- **Sin regla**: `Get_CONS_SER` (varias), `Get_CONS_SER_TESTIGO`, `Get_CONS_SER_UltimaCompra`, `Get_FactorCalorico`, `EliminarConsumo` (§14.1), `GetGrandesConsumos`, `Get_DST_CONSUMO_byPadre`, `Get_InformeDistribucionConsumos`, `Get_FilaExcel`, `Get_ColumnaExcel`, `Guardar_/Editar_/Eliminar_INFOCTG`, `Guardar_/Eliminar_INFOCTN`, `Get_TipForm`, `TieneConsTest`, `ObtenerConsumos_EnergiaActiva`, `GetPeriodos`, `Get_ConsumosPorCategoriaFiltros`, `Exportar_Excel`, los informes de `clsInformes_GrandesConsumos` y las consultas `Get_LLAMADAS`, `Get_LLA_CEL`, `Get_INTERNAC`, `Get_DetalleLLamadas` y `Get_InformeNoAgrupadas`.

### 23.8 Otras clases de `Titulares`

- `clsViviendas.ValidarComprobanteNoVivienda` (`clsViviendas.cs:321`): el tipo de comprobante de cuotas de vivienda (V2 639) y los productos de los planes de vivienda son de uso exclusivo del plan. `Validar_Transferncia` (`:332`): una cuenta no puede tener dos planes de vivienda (`TIP_REG = 11`) y transferir cuotas exige una caja abierta del usuario. `Validar_BajaPlan` (`:338`): solo se da de baja un plan conectado.
- `clsWEB.RegistrarPagosFacturasWeb` y `MarcarPagoPendiente` (`clsWEB.cs:2943`, `:2982`): en la oficina virtual una factura pasa de "Pendiente de Pago" a "Procesando su Pago" al iniciar el pago y vuelve si el pago no se concreta.

### 23.9 Lo que quedó fuera de esta pasada

- **Titulares**: revisados solo por muestreo `clsViviendas` (construcción, materiales y certificados), `clsWEB` (sincronización con la oficina virtual), `clsCirculares` (circulares, morosos, archivos SINTYS, RASE, EPRE, OCEBA y nota DR CSE 33/2026), `clsEvolucionDeuda`, `clsPadronTitular`, `clsBuscaInfoSocio`, `clsSegmentacion` (salvo lo de §6) y los `clsInformes_*`. Son mayormente consultas, exportaciones e informes; los archivos a entes corresponden al documento 10.
- **Varios.PMovil, Varios.Telemed y Telemedicion** (alcance B, prioridad baja): no se revisaron método por método. Quedan las reglas por familia de §13 y §19.
