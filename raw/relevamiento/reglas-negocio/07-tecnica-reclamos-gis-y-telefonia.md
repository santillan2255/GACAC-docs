# 07 — Técnica, reclamos, GIS/redes, tickets, actividades y telefonía

> Relevamiento de reglas de negocio de Procoop a partir del código descompilado (ILSpy).
> Rutas relativas a `procoop-relevamiento/binarios/decompilado/ReglasNegocio/`.
> Citas en formato `Namespace/Archivo.cs:línea`. No se reproduce código de terceros: se describe en prosa y pseudocódigo breve.
> Modelo de datos de referencia: `binarios/CapaDatos-tablas.md`.

---

## 0. Mapa de fuentes

| Área | Namespace / archivo principal | Tamaño aprox. |
|---|---|---|
| Órdenes de trabajo (OT) y mantenimiento | `ReglasNegocio.Tecnica/clsTecnica.cs` | 4.010 líneas |
| Factibilidades | `ReglasNegocio.Tecnica/clsFactibilidad.cs` | 424 |
| Necesidades de materiales (OM) | `ReglasNegocio.Tecnica/clsTecnica_Necesidad.cs` | 263 |
| Red genérica v2 (GIS interno) | `ReglasNegocio.Tecnica/RedGenerica.cs` | 797 |
| Informes técnicos | `clsInformes_Tecnica.cs`, `clsInformes_Tecnica_Redes.cs`, `clsInformes_Factibilidad.cs` | 2.457 / 322 / 195 |
| Integraciones de corte/telemedición | `clsSitsa.cs`, `clsDiscarTecnica.cs`, `clsTelemedicionTecnica.cs` | — |
| Enums de técnica | `EstadoOrden`, `Transaccion`, `OrigenOrden`, `TipoOrden`, `TipoBloqueo`, `TipoNumeracionUnica`, `TipoRed`… | — |
| Telefonía fija (tasación) | `ReglasNegocio.Telefonia/clsTelefonia.cs` | 2.626 |
| Importadores de CDR | `ReglasNegocio.Telefonia/clsImportacion.cs` | 3.771 |
| Red física telefónica | `ReglasNegocio.Telefonia/clsRed.cs` | 1.547 |
| Telefonía móvil (reventa) | `ReglasNegocio.Telefonia/clsTelefoniaMovil.cs` | 1.376 |
| IVR, SMS, WhatsApp | `clsIVR.cs`, `clsMensaje.cs`, `clsWhatsApp.cs`, `Plantilla*.cs` | — |
| CVLP (llamadas CPP) | `ReglasNegocio.Facturacion/clsCVLP.cs` | 557 |
| Exportaciones GIS por cooperativa | `ReglasNegocio.Varios.GIS/*.cs` (10 coops) | — |
| KML / Google Earth | `ReglasNegocio.Varios.GoogleEarth*` | — |
| Tickets / mesa de ayuda | `ReglasNegocio.Varios.Tickets/clsTickets.cs` (+ `Ticket/clsContacto.cs`) | 3.549 |
| Actividades internas | `ReglasNegocio.Actividades/*.cs` | — |

Dependencias fuertes hacia otros módulos: `clsSocios` (Titulares: conectar/desconectar SERSOC, conceptos a cobrar `CONEXION`), `clsConsumos`, `clsMov_pro` (Stock), `clsComprobante`/`clsComprobanteVenta` (Facturación), `clsTelemediciones` (Varios.Telemed), `clsPMovil_Tecnica` y `clsProcoop_Integra_Tecnica` (apps móviles).

---

## 1. Órdenes de trabajo (tabla `TECNICA`)

### 1.1 Concepto y tipos

Una sola tabla `TECNICA` guarda todas las órdenes; el campo `TIP_INCI` discrimina el tipo:

| `TIP_INCI` | Significado | Evidencia |
|---|---|---|
| 2 | **Orden de Trabajo** (sobre un servicio/cuenta de socio) | `TipoOrden.Trabajo = 2` (`Tecnica/TipoOrden.cs`), `Crear_OT` fija `TIP_INCI = 2` (`clsTecnica.cs:2083`) |
| 3 | **Orden de Mantenimiento** (sobre una obra `OBRAS`, no sobre un socio) | `TipoOrden.Mantenimiento = 3`; en informes el titular es `OBRAS.DES_OBR` (`clsTecnica.cs:2540`) |

Existe además `TipoOrd` (Trabajo = 1, Mantenimiento = 2), usado en `TPTRAB.TIP_ORD` (tipos de trabajo) (`clsTecnica.cs:361`). Son dos enumeraciones con valores distintos para lo mismo: **inconsistencia a no replicar**.

Cada OT se numera de tres formas:
- `COD_SOL`: PK interna, obtenida con `GetMaxValue_Boqueo<TECNICA>("COD_SOL")` (max+1 con bloqueo) (`clsTecnica.cs:2604-2610`).
- `COD_COM/SUC_COM/NUM_COM`: comprobante de talonario (operación por defecto `Orden_de_Trabajo` u `Orden_de_Mantenimiento`) (`clsTecnica.cs:1198-1212`).
- `COD_SLS`: **numeración visible "única"** asignada al cerrar, por año, configurable (ver 1.6).

### 1.2 Operaciones (tabla `TRANSAC`) — "qué se hace"

La operación de la OT es `TECNICA.COD_TRAN` → `TRANSAC`. Los primeros 8 códigos están "cableados" en el enum `Transaccion` (`Tecnica/Transaccion.cs`) y tienen efectos automáticos sobre el servicio al cerrar:

| Código | Operación | Efecto al cerrar (resumen) |
|---|---|---|
| 1 | Alta | Conecta SERSOC, registra matrícula, opcional consumo inicial |
| 2 | Traslado | Cambia domicilio del servicio (y opcionalmente de adherentes) |
| 3 | Desconexión | Desconecta SERSOC + adherentes + beneficiarios; opcional retiro de medidor |
| 4 | Cambio de medidor | Actualiza medidor y `MEDSOC` |
| 5 | Reconexión | Reconecta, posible crédito/débito proporcional |
| 6 | Incidente/Reclamo | Sin efecto automático sobre el servicio |
| 7 | Cambio de estado | Cambia `SERSOC.COD_ESTADO` |
| 8 | Retiro de medidor | Marca `RETIRADO`, limpia medidor |
| *N* (parámetro 2330) | Cambio de categoría | Cambia `COD_CAT`, puede generar proporcional |
| *N* (parámetro 238) | Recarga prepaga (telefonía) | Solo genera OT con descripción del importe |
| otros | Operaciones "libres" definidas por la coop | Solo efectos genéricos (notas, cambio de estado, cargos) |

Atributos relevantes de `TRANSAC` vistos en el código: `COD_SER` (servicio al que pertenece), `TRANSAC_RECLAMO` (la operación se considera reclamo, `clsTecnica.cs:395-398`), `MODIFICA_MATRICULA` (`:1280`), `COD_EST`/`ESTASER` (estado de servicio a aplicar al cerrar, `:1866`), `AGREGAR_OBSERVACION` (nota visible en caja, `:1896`), `ENVIO_SMS` (0 nunca, 1 al generar, 2 al confirmar, 3 siempre) y `METODO_ENVIO` (`:3459-3473`), `REG_EST` (registra estado/lectura, `:1990`), y su relación con `OT_REPORTE` (qué reporte imprimir por servicio+operación, `:405-449`) y `RESOL_OT` (resoluciones posibles por servicio+operación, `:2877-2890`).

### 1.3 Estados y circuito

Enum `EstadoOrden` (`Tecnica/EstadoOrden.cs`): **1 Pendiente, 2 En_Proceso, 3 Cerrada, 4 Eliminada**. Hay además `SUBESTADO` (estadio libre, `Cambiar_Estadio`, `clsTecnica.cs:2558`) y `CONFIRMADO` (bool).

> ⚠️ La clase DTO para la web `OrdenTrabajo.Estado` traduce 1=Pendiente, **2=Cerrada, 3=Confirmada** (`Tecnica/OrdenTrabajo.cs:50-70`), contradiciendo el enum. En el resto del código "cerrar" y "confirmar" son lo mismo (`COD_EST = 3` + `FEC_CONFIR`).

Circuito observado:

```
Crear_OT (COD_EST=1, FECHA/FEC_REG/FEC_OPE=now, copia datos del SERSOC)
   │  (imprimir la OT pasa a En_Proceso, salvo parámetro 2808)      clsInformes_Tecnica.cs:710
   ▼
En_Proceso (2)  ── envío a captor/PMovil (BLOQUEAR=1) o AION (BLOQUEAR=2)
   │
   ▼  PreSave_TECNICA (individual) / PreSave_TECNICA (masiva) / Integra / PMovil
Cerrada (3): FEC_CONFIR, USER_CON, COD_RES, COD_CIN, ID_RLT, COD_TIP, COD_CUA, HORAS…
   │          + efectos sobre SERSOC según operación + COD_SLS + notas + cargos
   ▼
(Eliminada 4: FECHA_BAJA, USUARIO_BAJA; revierte efectos; Restablecer vuelve a 1)
```

- **Creación** (`Crear_OT`, `clsTecnica.cs:2078-2199`): copia del servicio domicilio, medidor (`COD_MED`, `DIG_MED`, `ESTADO`=lectura actual, `FECACT`), catastro concatenado con guiones, GPS (truncado a 20 caracteres, "0" si vacío), certificado de instalador (`NRO_CERT`, `VTO_CERT`, `COD_PROF`), teléfono del titular y la línea telefónica activa (`TEL_SERSOC.COD_NUM`). `MOROSO` se hereda del servicio y `GEST_MORA` indica origen gestión de mora. Si el parámetro 2339 está activo, la observación del servicio pasa a `OBS_ADM`. Si el servicio tenía factibilidad (`SERSOC.COD_SOL`), queda en `COD_FACTIBIL`.
- **Origen** (`OrigenOrden`): Administrador, Titulares (pantalla de socios), GestionMora, Integra_Tecnica (API/app). **Vía de ingreso** `COD_VIA` → `VIAINGTE` (teléfono, mostrador, web…). `TipoIngreso` (Sistema/Manual/Internet) existe como enum.
- **Pasaje a En_Proceso**: `CambiarEstadoEnProceso_TECNICA` solo si estaba Pendiente (`clsTecnica.cs:2418-2428`); se dispara al imprimir.
- **Cierre individual** (`PreSave_TECNICA`, `clsTecnica.cs:1178-1498`): ver 1.4.
- **Cierre/confirmación masiva** (`PreSave_TECNICA(List<TecnicaOrdenes>, DatosConfirmacionMasiva…)`, `clsTecnica.cs:816-1034`): aplica a un lote los mismos datos (fecha, responsable, incidente, resolución, tipo de trabajo, móviles, cuadrilla, horas, personas, observaciones concatenadas y truncadas a 300). Si viene de PMovil, guarda GPS y fecha de cierre del captor, `RESP_ENC` (encuestado) y `MOTIVO_DISCONFORME`. Genera la descripción "Confirmada por el usuario X… mediante confirmación masiva / Procoop Integra". Ejecuta corte en **MikroTik** si el medidor es de sistema 8 y la operación es desconexión (`:843-860`).
- **Eliminación** (`PreDelete_TECNICA`, `clsTecnica.cs:479-573` y masiva `:618-745`): revierte el efecto previo sobre el servicio:
  - Reconexión eliminada → restaura `FEC_BAJA`/`BAJA_ADM` del último histórico con `CONDICION = 4`.
  - Alta eliminada → `FEC_BAJA = hoy`; con parámetro **2753** y servicio que factura cargo fijo en la baja (`CATE_SER.COBRAR_CF_BAJA`), pregunta y deja el servicio en `CONDICION = 5` (**No vigente**).
  - Desconexión eliminada → limpia bajas, `MOROSO = false`, recalcula condición.
  - Siempre crea `NOTA_SUM` "Orden de X eliminada" y opcionalmente **revierte stock** (borra `MOV_PRO` de la OT, previa pregunta) (`EliminarOrden`, `:747-767`).
- **Pendientes duplicadas**: no se permite otra OT pendiente de la misma operación para el mismo servicio (`Existe_OT_Pendiente`, `:1979-1988`; una variante solo mira los **últimos 90 días**).

### 1.4 Efectos del cierre de una OT de trabajo (pseudocódigo)

```
si COD_SOL==0 o es alta de registro → asignar talonario y NUM_COM
aplicar DatosExtraTecnica (opcionales): recorrido de lectura/factura, cantidad,
   domicilio, teléfonos/mails de persona y cuenta, catastro, certificado, obs. de medidor
si Cerrada:
   COD_SLS = Get_New_CODSLS()
   SERSOC.INT_RED/INT_TEL/PROVI/ID_SYS_TEL ← datos de la OT (punto de red, provisorio)
   si TRANSAC.MODIFICA_MATRICULA → SERSOC.MATRICULA
   registrar consumo/lectura (CONS_SER) si corresponde (alta y reconexión siempre)
   telemedición: GetSistemasTelemedicion → ConfirmarOT / CambioMedidor en el sistema externo
       (si es reconexión automática y no hay sistema → vuelve a Pendiente)
   switch operación:
     Alta        → Conectar_SERSOC(FEC_CONFIR); consumo inicial si SERVICIO_EXTRAS.CONSUMO_ALTA
     Traslado    → domicilio del servicio (+ adherentes si DOM_PER)
     Desconexión → retiro medidor opcional (parámetro 2399 limpia NUM_MED y MATRICULA);
                   Desconectar SERSOC + ADHSOC + BENSOC; MOROSO ← OT.MOROSO
     CambioMedidor → nuevo medidor + MEDSOC nuevos
     Reconexión  → Generar_DescuentoReconexion; Reconectar_SERSOC; limpia MOROSO
     CambioEstado→ SERSOC.COD_ESTADO = OT.COD_ESTASER
     RetiroMedidor → RETIRADO, limpia medidor (2399)
     op = p.2330 → aviso consumos pendientes con categoría vieja; proporcional
                   (si día del mes ≤ p.2755 o 2755=0); cambia COD_CAT/COD_CATSER
   Guardar_CambioEstadoAutomatico (estado de servicio por TRANSAC o por SERVICIO_EXTRAS.ESTASER*)
   Guardar_NotaCaja (si TRANSAC.AGREGAR_OBSERVACION → nota visible en caja)
guardar participantes (PARTIORD) y tareas (TAROTM)
guardar SERSOC + historial SERSOC_HST
CONDICION: Desconexión→4, Alta/Reconexión→2
CONFIRMADO=true; SUBESTADO=0
si es nueva → NotificarResponsables(AlGenerarOT=true)
```
Fuente: `clsTecnica.cs:1178-1498`, `:1832-1904`.

Validaciones previas a crear OT por operación (`clsTecnica.cs:2923-3097`):
- General: no sobre servicio nuevo (sin ID), no sobre servicio dado de baja (`CONDICION 4`), no sobre "pendiente de conectar" (`CONDICION 1`) salvo parámetro **2655**.
- Reconexión: solo sobre servicio de baja; no si el titular figura fallecido (`FEC_FAL`) salvo parámetro **2301**; no para planes de vivienda (`TIP_REG = 11`).
- Cambio/Retiro de medidor: el servicio debe tener medidor o datos de guía; retiro solo sobre servicio desconectado.
- Alta: no si ya hay alta o reconexión pendiente.

*Detalle por validador (segunda pasada)*:
- `Validar_OrdenTrabajo_Incidente` solo exige que el servicio exista (tenga ID); **no** aplica la validación general, así que se pueden abrir incidentes sobre servicios dados de baja o pendientes de conectar (`clsTecnica.cs:2940-2947`).
- `Validar_OrdenTrabajo_Traslado` y `Validar_OrdenTrabajo_Desconexion` aplican la validación general más "no hay otra OT pendiente de la misma operación" (`:2949-3000`).
- `Validar_OrdenTrabajo_CambioMedidor`: requiere medidor o datos de guía, que el medidor no esté marcado `RETIRADO` y que no haya otra OT pendiente (`:3027-3049`).
- `Validar_OrdenTrabajo_RetirarMedidor`: el servicio debe tener medidor o datos de guía y estar en `CONDICION 4` ("No es posible realizar el retiro del medidor a un servicio activo"). Si el servicio es de telefonía (`TIP_REG == 3`) se exige además que su última línea `TEL_SERSOC` siga abierta; si no, "El medidor de este servicio ya ha sido retirado". Para los demás servicios **no se controla el flag `RETIRADO`**, solo que no haya otra OT de retiro pendiente (`:3051-3076`).
- `Validar_OrdenTrabajo_Reconexion`: también rechaza si ya hay una reconexión pendiente (`:2963-2986`).
- `Validar_OrdenTrabajo_Alta`: no aplica la validación general (permite servicios en `CONDICION 1`), pero el servicio no puede estar en `CONDICION 4` ni tener alta o reconexión pendiente (`:3078-3097`).

### 1.5 Órdenes encadenadas ("Altas y bajas automáticas", tabla `ALTASEAU`)

Al generar una OT se buscan reglas `ALTASEAU` con `TIPO_AS = 6` que matcheen por servicio y, opcionalmente, categoría, localidad, referencia, zona de lectura, actividad, clase, propiedad, tipo de medidor y operación (`GetAltasEauAsociados`, `clsTecnica.cs:1806-1821`). Por cada regla se **clona** la OT con otra operación (`SAS_TRAN`), otro servicio (`COD_SAS`) y otra vía, enlazada por `OT_RELACION` (`CrearOrdenAutomatica`, `:2265-2286`).

Al confirmar, `ConfirmarOrdenSiRelacion` (`:1742-1783`) impone orden: si la regla tiene `CONFIRMAR_ULTIMA = false`, la de origen debe confirmarse primero; si es `true`, primero la de destino. Error si hay 0 o más de una regla aplicable.

Paralelamente, `AltasBajasAutomaticas` (`:2347-2380`) da de baja servicios "dependientes" (`Get_ServicioAutomaticos(..., Baja_Servicio)`): si el servicio dependiente usa Técnica se genera OT de desconexión; si no, se desconecta en el acto (`DesconectarServicio`, `:2566-2593`).

### 1.6 Numeración visible (`COD_SLS`)

`Get_New_CODSLS` (`clsTecnica.cs:2430-2463`):
- Si parámetro **2998** y la OT es reclamo → secuencia por servicio (sin corte anual).
- Si no, parámetro **344** (`TipoNumeracionUnica`): 0 No utilizar (devuelve 0), 1 por año separando reclamos de no-reclamos, 2 por año y operación, 3 por año + reclamo + operación.

### 1.7 Asignación: responsables, cuadrillas, móviles, captores

- **Responsable** (`COD_RES` → `RESPONSA`, con `NOM_RES`, `MAIL_RES`, `TEL_RES`, `COD_DPS` = depósito propio). Se asigna al crear o confirmar (`GuardarResponsableOrden`, `:3332`). `RELACION_ENTIDADES` vincula servicios con responsables (`GetResponsablesServicio`, `:2816-2822`).
- **Cuadrilla** `CUADRI` con integrantes `PARTICUA` (`Save_PARTICUA`, `:245-264`); la OT guarda `COD_CUA` y sus participantes concretos `PARTIORD` (`:333-357`), además de `PERSONAS` (cantidad) y `HORAS`.
- **Móviles/vehículos** `TECNICA_MOVIL` (N a N con `MOVIL`); `COD_MOV` guarda el primero (`GuardarMoviles`, `:3002-3026`).
- **Tareas** `TAROTM` (catálogo `TAREASOM`) para órdenes de mantenimiento (`:364-378`).
- **Tipo de trabajo** `TPTRAB`, **incidente** `CAT_INCI`, **resolución** `RESOL_OT`.
- **Captores / app móvil**: `BLOQUEAR` (`TipoBloqueo`: 0 ninguno, 1 PMovil, 2 AION) separa qué órdenes se confirman masivamente en Procoop vs. en el sistema externo (`Get_OrdenesTrabajo`, `:2535`). Con parámetro **2913** la OT se envía automáticamente al captor al guardarse (`EnviarOrdenAutomaticamente`, `:2732-2776`); si no, puede publicarse en CoopOnline Web. Estado del captor: `EstadoOrdenCaptor` (Sin acción, Pendiente de envío, Enviada, Recibida, En captor).
- **Notificación a responsables** (`NotificarResponsables`, `:3377-3412`): reglas `RESPONSA_NOTIFICA` por servicio + tipo de orden + operaciones (`COD_OPER` separado por `|`) + **días de la semana, franja horaria y feriados** + momento (`NOTIFICAR_AL`: 1 al generar, 0 al enviar). Canal por parámetro **3088** (0 WhatsApp, 1 mail, 2 SMS); con **3105** usa plantilla WhatsApp oficial `generacion_ot`. Esto es lo más parecido a una **guardia/escalamiento** que tiene Procoop.
- **Notificación al socio**: SMS/WhatsApp al generar/confirmar según `TRANSAC.ENVIO_SMS` y parámetro **2693** (`SendSMS`, `:3452-3530`); aviso de cierre de OT de desconexión por SMS/WhatsApp/mail (`NotificarCierreOt`, `:1042-1158`).

### 1.8 Materiales e impacto en stock

Los materiales de una OT **no tienen tabla propia**: son movimientos de stock `MOV_PRO` con una operación específica (`clsMov_pro.Mov_Pro_Operaciones`, `Stock/clsMov_pro.cs:18`):

| `COD_OPER` | Uso en técnica | Enlace a la orden |
|---|---|---|
| 3 `ORD_TRABAJO` | Materiales consumidos en OT (`TIP_INCI=2`) | `MOV_PRO.NUM_COM = TECNICA.COD_SOL` |
| 6 `MANTENIMIENTO` | Materiales en orden de mantenimiento | `COD_COM/SUC_COM/NUM_COM` de la OM; `COD_REF` = obra (`Actualizar_Obra_Mov_Pro`, `:795-808`) |
| 5 `VALES_ES` | Vales de retiro de depósito (`RETI_MAT.NRO_ORD = COD_SOL`) | por comprobante del vale |
| 8 `CONSIGNACION` | También se considera al revertir | `NUM_COM = COD_SOL` |

Fuentes: `Get_Mov_Pro` (`clsTecnica.cs:769-793`), `Validar_Materiales` (`:2778-2790`), `clsValeConsulta` (`:123-197`).

- Desde Integra/PMovil los materiales llegan como `Material_Request` y se generan `MOV_PRO` de **salida** a precio `PROD_SER.PRE_VSI`, desde el depósito indicado o, si es PMovil, el depósito del responsable (`RESPONSA.COD_DPS`), o el **depósito 1** por defecto (`:983-991`).
- Al eliminar la OT pendiente con materiales se ofrece revertir el stock (borrado físico de `MOV_PRO`).
- La impresión de la OT lista hasta 16 renglones de materiales y, con parámetro **2819**, agrega los de vales (`clsInformes_Tecnica.cs:655-707`).
- Medidores/productos trazables: `PROD_TRH` (`Get_CodPTH`, `:3099-3109`) y `clsSocios.precioTrh/CodDepoTrh` (se entrega un medidor con número de serie desde un depósito al cerrar la OT).

**Necesidades de materiales para mantenimiento** (`TECNICA_NECESIDAD`, `clsTecnica_Necesidad.cs`): circuito de 4 cantidades por producto y depósito, cada una con usuario: **solicitada → autorizada (con fecha) → retirada → utilizada** (`Guardar_Necesidades`, `:155-201`). `CargarAutorizados` lista lo autorizado pendiente de retiro y `CargarRetirados` lo retirado pendiente de uso, solo para `TIP_INCI = 3` (`:203-261`).
> ⚠️ Bug: la condición de estado `(COD_EST != 3) | (COD_EST != 4)` es siempre verdadera (`:206`, `:235`).

**Impacto en facturación de los materiales**: en el código de técnica no se encontró facturación automática del material consumido; lo que se factura son los **conceptos configurados** (ver 1.9). Ver *Dudas abiertas*.

### 1.9 Cargos asociados a la OT (tabla `CONEXION`, "conceptos a cobrar")

La tabla `CONEXION` define cargos con `TIPO_CON` (`Titulares/TipoConceptoCobrar.cs`):

| `TIPO_CON` | Momento |
|---|---|
| 1 | Alta de servicio |
| 2 | Alta de cuenta |
| 3 | Alta de titular |
| 4 | Reconexión de servicio |
| 5 | **LUEGO** de ejecutar una OT |
| 6 | **ANTES** de ejecutar una OT |
| 7 | Transferencia de servicio |

Filtros de aplicabilidad (`clsSocios.GetQuery_CONEXION`, `Titulares/clsSocios.cs:558-568`): servicio, socio activo/no (`SOC_CTE` 1 todos, 2 activos, 3 no activos), `MOROSO`, `PREPAGO`, referencia, localidad, categoría, clase, retirado, provisorio, propiedad, estado de servicio, `DESACTIVAR`, `UNA_VEZ`, y para OT además **operación** (`COD_TRAN`) y **solo-reclamo** (`RECLAMO`) (`clsSocios.cs:471-493`). Precio en `CONEXION.NETO`, actualizable masivamente (`GuardarConexiones_Masivas`, `:451-463`).

Reglas:
- OT Pendiente → se ofrecen los conceptos `TIPO_CON = 6` (se cobran al generar, en mostrador).
- OT Cerrada y no confirmada (o cierre desde PMovil) → conceptos `TIPO_CON = 5`.
- Si la OT cambia el estado del servicio, se filtran los conceptos por `CAMBIO_EST` según si el estado nuevo/actual "desconecta" (`ESTASER.DESCONEC`) (`clsTecnica.cs:3697-3718`).
- En cierres masivos/PMovil, `Validar_ConceptosCobrar_Confirmacion` (`clsTecnica.cs:2824-2875`) **genera el comprobante de venta automáticamente** con operación `Cobros_en_Tecnica`, forma de pago **"Próxima facturación"** y fecha según parámetro **65**, ligado a la OT.

**Proporcionales generados por técnica** (no son materiales sino ajustes de cargo fijo):
- *Cambio de categoría* (`Generar_ProporcionalCambioCategoria`, `clsTecnica.cs:1510-1597`): si el servicio o la nueva categoría tienen `PROP_CAMBIO_CAT`, y la confirmación es en el mismo mes, calcula días y diferencia de `CATTARIF.PRE_UNI` entre categorías / días del mes. Servicio "adelantado" (no `VENCIDO`): cobra (nueva − vieja) por los días restantes; "vencido": por los días transcurridos con signo inverso. Parámetro **2587** anula proporcionales negativos; concepto en `SERVICIO_EXTRAS.COD_PRO` o parámetro **2570**; **3111** fija período para vencidos.
- *Reconexión* (`Generar_DescuentoReconexion`, `:1599-1707`; requiere parámetro **2483**): para servicios de cálculo `TIP_CAL = 6` con proporción, **crédito** por los días desconectados dentro del mismo mes, o (parámetro **2661**, si el período no fue facturado) **débito** por los días que restan del mes. Concepto: `SERVICIO_EXTRAS.COD_CON_DESCONECTADO` o parámetro **2485**. Parámetro **2907** cambia la pregunta a Sí/No/Cancelar.
- `AplicarProporcional` (`:1709-1740`): con parámetro **2625** emite un comprobante de venta inmediato; si no, inserta un cargo pendiente en `PRCAGAS` (cargos a incluir en la próxima facturación del servicio).

### 1.10 Informes técnicos

`clsInformes_Tecnica.TipoInforme` (`clsInformes_Tecnica.cs:29-55`): Planilla de control, Planilla de relevamiento, Detalle de orden (impresión), Auditoría, **Reclamos**, **Reincidencias** (por cuenta / cuenta+servicio / cuenta+servicio+operación), Estadísticas, Altas y desconexiones, Trabajos pendientes, Recursos asignados a obras, **Parte diario**, Estado de órdenes enviadas a PMovil. Fechas de filtro: emisión, resolución o nota. Orden por defecto, domicilio o zona-sector-recorrido. Con parámetro **358** la OT impresa incluye un mapa estático del punto GPS (`:1800-1817`). Reporte de OT configurable por parámetro **180** (`:2324`).

### 1.11 Reglas de los informes técnicos (segunda pasada)

- **Despacho** (`Get_Reporte`, `clsInformes_Tecnica.cs:433-444`): un único query base filtrado (`Get_QueryReporte`, timeout 120 s) alimenta el informe elegido; salvo Estadísticas, siempre se devuelve también una vista previa de las órdenes. `Get_ComboTipoInforme` (`:1481`) oculta para órdenes de mantenimiento los informes propios de OT sobre socios (relevamiento, auditoría, reclamos, reincidencias, altas/desconexión, consulta).
- **Estadísticas** (`Get_Reporte_Estadisticas`, `:835-973`): para el período pedido calcula cantidad y **demora promedio en días** de pendientes (estado 1-2), resueltas (3), resueltas con/sin reclamo, resueltas dentro del período, resueltas después del período y no resueltas. La demora se mide de dos formas: desde `FECHA` (fecha de la orden) y desde `FEC_REG` (fecha de ingreso), hasta `FEC_CONFIR` o "ahora", con piso 0. El "período anterior" es el mismo filtro con fecha hasta = fecha desde − 1 s y sin fecha desde (todo lo anterior). Es lo más parecido a un indicador de tiempos de resolución.
- **Reincidencias** (`:975-1038`): se queda con los grupos de más de una orden por cuenta, por cuenta+servicio o por cuenta+servicio+operación, dentro del filtro de fechas.
- **Recursos asignados a obras** (`Get_Reporte_Recursos`, `:1100-1277`): suma tres orígenes por obra: "VALES" (movimientos `MOV_PRO` de operación 5 enlazados a `RETI_MAT`; la obra se toma de `SUC_COM`), "MATERIALES" (operación 6; obra en `COD_REF`), ambos valorizados a `PRE_MOV × (salida − entrada)`, y "HORAS" (horas normales y extras de `PARTIORD` por responsable). Los valores hora normal/extra son los parámetros **2722/2723** (`Get_Importes`, `:1088-1098`); si el usuario marca "actualizar", **el informe sobrescribe esos parámetros** con lo que tipeó (`:1262-1275`). Las horas salen con importe 0 en el dataset (la valorización la hace el reporte). [VERIFICAR] que el diseño del reporte multiplique por esos parámetros.
- **Parte diario** (`Get_ParteDiario`, `:1280-1354`): una fila por nota (`TECNICA_NOTA`) cuya fecha cae en el rango, con responsable de la orden, participante de la intervención, título y texto. Sin fechas usa 01/01/1900 (no devuelve nada).
- **Altas y desconexiones** (`Get_Reporte_AltaDesconexion`, `:1356-1380`) y su exportación (`ExportarArchivo`, `:1444-1480`): CSV `Alta_Desconexion_ddMMyyyy.csv` con separador `;` y columnas OLT, SLOT, PORT, VPORT de `SERSOC.INTERNET` y ACCION = 0 si la operación es Desconexión (3), 1 en cualquier otro caso. Es un archivo de aprovisionamiento masivo para la OLT de internet.
- **Solicitud de OT** (`Get_Reporte_Solicitud_OT`, `:1040-1086`) y **solicitud de cambio de categoría** (`Get_Reporte_CambioCategoria`, `:811-833`): formularios para que firme el socio. El título depende de la operación (traslado, cambio de medidor, reconexión, desconexión, alta) y el traslado usa un diseño propio con el domicilio nuevo.
- **Factibilidades** (`clsInformes_Factibilidad.Get_InformeFactibilidad`, `:73-182`): estado mostrado "Anulado" si `ESTADO = "A"`, si no "Confirmado"/"Pendiente"; "Factible" vacío si anulada o no confirmada; días = confirmación (u hoy) − fecha. Se puede agrupar por barrio. `GetIdsOpeCom` (`:184-194`) arma por concatenación un filtro de comprobantes habilitados para una operación (`OPE_COM`).

---

## 2. Reclamos

En Procoop **un reclamo es una OT** con `TECNICA.RECLAMO = true`; no hay entidad separada en el módulo técnico.

- Una operación puede ser "de reclamo" (`TRANSAC.TRANSAC_RECLAMO`), típicamente la 6 *Incidente/Reclamo* (`clsTecnica.cs:395-403`).
- **Tipificación**: `CAT_INCI` (categoría de incidente) en `COD_CIN` y `RESOL_OT` (resolución) en `ID_RLT` al cerrar. `CAT_INCI_CTSEC` asigna a cada incidente un **% por sección** (`CTSECCION`, probablemente centros de costo / secciones de red) (`Get_Secciones_Incidentes`, `Guardar_Asignaciones`, `clsTecnica.cs:3911-4009`). El mismo patrón se usa para grupos de obra (`clsGrpObra.cs:24-136`).
- **Numeración de reclamo**: `COD_SLS` (parámetros 344/2998) y, en el informe, un número correlativo anual calculado al vuelo (por servicio si parámetro **3031**) (`clsInformes_Tecnica.cs:767-772`).
- **Prioridades**: **no se encontró campo de prioridad** en OT/reclamos. (Sí existen gravedades en Tickets, ver §6.)
- **SLA**: no existe un motor de SLA. Elementos parciales: `TECNICA.VENCE` (fecha de vencimiento, se imprime), la ventana de 90 días para detectar duplicados, el informe de **reincidencias** y las reglas horarias de `RESPONSA_NOTIFICA`. No hay cálculo de tiempo de resolución ni alertas por vencimiento en el código revisado.
- **Cierre**: igual que cualquier OT (incidente + resolución + observaciones técnicas + responsable + horas). Desde PMovil se registra conformidad del socio (`RESP_ENC`, `MOTIVO_DISCONFORME`).
- Cargos solo para reclamos: `CONEXION.RECLAMO` (p.ej. visita improcedente).
- Existe una tabla `RECLAMOS` (+ `RECLAMOS_NOTAS`) relacionada con `SERSOC/SUMSOC/SERVICIO` en el modelo de datos, pero **no se usa en estos namespaces** (probablemente CoopOnline/web o Mesa de Entradas). Ver *Dudas*.

---

## 3. Factibilidades y conexiones nuevas

### 3.1 Factibilidad (`FACTIBIL`, `clsFactibilidad.cs`)

Solicitud previa de conexión, con comprobante propio (talonario del punto de venta del usuario; error si el PV es 0) (`GuardarFactibilidad`, `:175-240`).

Datos: cabecera (servicio, fecha, estado administrativo, observaciones administrativa/comercial/operativa, notas `FACTIBIL_NOTA`), persona (existente o **se crea `PERSONAS` en el momento**), domicilio de conexión, catastro, **calles linderas** (derecha/izquierda/atrás con números), zona-sector-recorrido de lectura, **mapa** (`MAPA` + imagen) y propiedades adicionales (`clsPropiedadesItems`) (`:71-172`).

Estados (`CapaNucleo/Tipos_Estados_Factibilidad.cs`): **1 Pendiente, 2 Cerrado, 3 Anulado, 4 Facturado**. Dimensiones adicionales:
- `ESTADO_ADM`: 0 Provisorio / 1 Definitivo (administrativo).
- `ESTADO_TEC`: 0 Provisorio / 1 Definitivo (técnico), solo si confirmado.
- `FACTIBLE`: SI/NO, `OBS_TEC`, responsable técnico, `SUBESTADO`.

Reglas:
- `CerrarFactibilidad` → `COD_EST = 2`, `CONFIRMADO = true`, registra dictamen técnico (`:289-304`).
- `AnularFactibilidad` → `COD_EST = 3`, `ESTADO = "A"` (`:306-322`).
- Para usarla en un alta: debe estar **confirmada, factible, con fecha ≤ 90 días y sin servicio asociado** (`Get_FACTIBIL_Solicitud`, `:330-333`).
- Auditoría de todas las acciones (ALTA, MODIFICAR, CIERRE, ANULACION) en `AUDITORIA` (`:402-423`).
- El estado "Facturado" se relaciona con `PRESUPU` (presupuesto de obra/conexión).

*Reglas adicionales (segunda pasada)*:
- **Carga de cabecera** (`CargarDatosCabecera`, `clsFactibilidad.cs:71-84`): registra el usuario solicitante, limpia `COD_FACT` y fuerza `COD_EST = 1` salvo que ya estuviera cerrada (2). Solo se agregan las notas nuevas (sin `COD_NOT`).
- **Persona** (`CargarDatosPersona`, `:86-100`): teléfono truncado a 20 caracteres y celular a 40. Si no se elige una persona existente, se crea una `PERSONAS` nueva; en ese caso el domicilio de conexión se copia también a la persona (`CargarDatosDomicilioConexion`, `:102-129`). `CargarDatosCatastro` fija `GRU_FAC = 0` (`:131-140`).
- **Mapa**: solo se crea si hay latitud y longitud. Al editar sin imagen de mapa, **se borran el `MAPA` y su archivo de imagen** (`EditarFactibilidad`, `:242-287`). La edición no vuelve a validar el punto de venta ni renumera.
- **Bug: una factibilidad anulada puede seguir siendo usable para un alta.** `AnularFactibilidad` pone `CONFIRMADO = true` y no toca `FACTIBLE` (`:306-322`), y `Get_FACTIBIL_Solicitud` no filtra por `COD_EST` ni por `ESTADO` (`:330-333`). Si se anula una factibilidad que ya estaba cerrada como factible, sigue apareciendo como válida durante los 90 días.
- Grilla del socio (`Get_FACTIBIL_GridViewDataSource`, `:344-357`): estados Pendiente/Cerrado/Anulado/Facturado; administrativo y técnico Provisorio/Definitivo; técnico y factible vacíos mientras no esté confirmada.

### 3.2 Conexión nueva (alta de servicio)

1. Alta del `SERSOC` en Titulares (pendiente de conectar, `CONDICION 1`), opcionalmente vinculado a la factibilidad (`SERSOC.COD_SOL`).
2. Se crea OT de **Alta** (`Guardar_OT`, `clsTecnica.cs:1995-2060`): numeración con bloqueo, nota en la cuenta, órdenes encadenadas (`ALTASEAU`), SMS al socio y notificación a responsables.
3. Se cobran conceptos `CONEXION` tipo 1/2/3 (alta de servicio/cuenta/titular, según socio nuevo, localidad, activo) y tipo 6 (antes de la OT) (`clsSocios.Get_CONEXION`, `clsSocios.cs:496-556`).
4. Al cerrar la OT: `Conectar_SERSOC`, matrícula, punto de red (`INT_RED` o `SERSOC_REDES`), medidor/estado inicial, `CONDICION 2`, conceptos tipo 5.

---

## 4. Cortes y reconexiones desde técnica

- La desconexión por mora (GestionMora, ver doc de Cobranzas) genera OT `Desconexion` con `MOROSO = true` y `GEST_MORA = true`; la reconexión limpia `MOROSO`.
- Si el servicio **no está configurado para Técnica** (`clsServicio.GetConfiguracion().Tecnica = false`) la baja se aplica directamente sin OT (`DesconectarServicio`, `clsTecnica.cs:2566-2593`).
- `Confirmar_OT_Reconectar` (`:2792-2814`) cierra y reconecta en un solo paso (usado por reconexión automática tras pago).
- **Integraciones de corte remoto** invocadas al confirmar:
  - Telemedición genérica (`clsTelemediciones.GetSistemasTelemedicion` → `ConfirmarOT`/`CambioMedidor`), con ~30 sistemas (`Titulares/Sistemas_Telemedicion.cs`: Discar, AION, NEXO, MikroTik, CashPower, Hexing, SmartOlt, RADIUS…).
  - **MikroTik** (internet): corte en confirmación masiva de desconexión (`clsTecnica.cs:843-860`).
  - **Discar** (medidores prepagos/AMI): conectar, desconectar, desvincular/vincular medidor, tomar lecturas, alta de cuenta, cambio de categoría, carga de crédito (`clsDiscarTecnica.cs:72-258`).
  - **SITSA** (API REST, URL/API key en parámetros **3034/3035**): Alta → alta/modificación de contrato; Desconexión → `estadocontrato=suspendido`; Reconexión → `habilitado`; cambio de categoría (2330) → modificación de contrato (`clsSitsa.cs:158-194`).
  - AION: cambio de categoría genera OT también en AION (`Generar_OrdenTrabajo_Categoria`, `clsTecnica.cs:2649-2705`).

*Detalle de las integraciones (segunda pasada)*:
- **Discar** (`clsDiscarTecnica.cs`): todas las operaciones salvo conectar, desconectar, cambiar categoría y cargar crédito piden una fecha. Si el usuario no la da, se devuelve éxito con el mensaje "Operación cancelada por el usuario", así que **la OT sigue su curso sin haber impactado en Discar** (`:93-110`, `:112-160`, `:162-189`, `:191-223`).
  - *Tomar lecturas*: graba en la OT y en el servicio el ID de suministro Discar (`ID_SYS_TEL`), el número de medidor y el factor; cambia la categoría si viene una. La lectura obtenida se carga en el medidor actual o en el nuevo según el caso.
  - *Alta de cuenta*: guarda el ID devuelto en `SERSOC` y `TECNICA`, junto con el tipo de medidor.
  - *Vincular medidor*: en la OT, el medidor va a `COD_MED`/`TIP_MED` si es el actual, o a `N_COD_MED`/`N_TIP_MED` si es el nuevo.
  - *Cambio de categoría*: usa `N_COD_CAT` de la OT si existe y envía el `TIPO_SER` de la categoría (`:225-245`).
  - *Carga de crédito* (`:247-257`): delega en el prepago de Discar sin tocar Procoop.
- **Telemedición genérica desde la OT** (`clsTelemedicionTecnica.cs`): el sistema se elige por número (`Sistemas_Telemedicion`). La toma de lectura arma un registro temporal `IMP_WORK` (`CONFIRMADO = "G"`) y devuelve lectura, fecha, consumo y lecturas de grandes clientes. Sin fecha devuelve falso; sin servicio, error "No se encontró el servicio." (`:70-102`). También permite consultar datos del medidor y cambiar el usuario o la contraseña del portal del sistema externo (`:104-157`).
- **SITSA** (`clsSitsa.cs`): el identificador externo de cliente **y de contrato** es la cuenta (`COD_SUM`), no el servicio (`:172-183`, `:260-287`). Una cuenta con varios servicios comparte un único contrato. [VERIFICAR] si SITSA se usa solo para un servicio por cuenta.
  - Al dar de alta o modificar el cliente (`AltaModificacion`, `:196-217`) se envían nombre y apellido **vacíos**, junto con mail, teléfonos, CUIT, domicilio, localidad y barrio de la persona.
  - Contrato: servicio + categoría (o la nueva, si la OT tiene `N_COD_CAT`), residencial según `CATE_SER.CAT_RES`, coordenadas GPS del servicio y la observación administrativa de la OT (`:233-256`).
  - La baja (`Baja`, `:219-231`) llama a "baja de contrato" una vez por cada servicio en `CONDICION 4`, siempre con la misma cuenta, y luego da de baja el cliente. Corta en el primer error.
  - La API key viaja en la query string (parámetro **3035**).
- Si el sistema de telemedición devuelve error, el cierre se aborta con mensaje; si la reconexión es automática y el servicio no tiene un sistema de telemedición vigente, la OT **vuelve a Pendiente** sin fecha de confirmación (`:1313-1325`).

---

## 5. Red eléctrica / GIS

### 5.1 Red v1: niveles (`NIV_CAPA`, `NIV_SERV`, `NIV_REDES`)

Árbol de puntos de red por servicio (`clsTecnica.cs:275-331`):
- `NIV_CAPA`: capas por servicio (p.ej. MT/BT).
- `NIV_SERV`: **niveles** de la jerarquía (p.ej. subestación → alimentador → transformador → poste), con ícono, `PER_CONEC` (permite conectar usuarios) y `MULT_CONEC` (admite varios usuarios).
- `NIV_REDES`: nodos instalados con padre (`NIV_REDES2`), descripción, domicilio, `LAT_GPS/LON_GPS`.
- `SERSOC.INT_RED` = nodo al que está conectado el servicio.
- **Disponibilidad**: un nodo está disponible si su nivel no admite conexión, o admite múltiples, o admite una sola y no está usado por otro SERSOC ni por otra OT no cerrada (`Ge_NIV_REDES_Disponibles`, `:291-299`).
- Un nivel nuevo toma el número siguiente al máximo dentro del mismo servicio y capa (`Get_NewNivel_NIV_SERV`, `clsTecnica.cs:326-331`). Por lo tanto los niveles son una jerarquía lineal por capa, no un grafo.

### 5.2 Red genérica v2 (`REDES*`, `RedGenerica.cs`)

Modelo configurable tipo "grafo de componentes" (`TipoRed`: No registra, Genérica V1, Telefonía, Genérica V2):
- `REDES` (red) ↔ `REDES_SERVICIOS` (servicios que la usan) y `REDES_CAPAS`.
- `REDES_COMPONENTES` (tipos de elemento, con ícono) y `REDES_RELACIONES_COMPONENTES` (qué componente puede colgar de cuál) (`Get_Relaciones`, `:179-232`).
- `REDES_RED_INSTALADA`: instancias (nodos) con padre, descripción, rango `ELEMENTO_INICIAL..ELEMENTO_FINAL` (p.ej. bornes/pares), domicilio y estado (`Estado_NodoRed`: Disponible, Utilizado, Dañado, No aplica).
- `REDES_ATRIBUTOS_COMPONENTES` + `REDES_ATRIBUTOS`: **atributos tipados por componente** (carácter, entero, decimal con N decimales, fecha, o referencia a cualquier tabla del sistema por reflexión) (`Get_InfoAtributos`, `:423-511`). Aquí se modelarían potencia de transformador, tensión, etc.
- `SERSOC_REDES`: historial de conexión del servicio al nodo (fecha de conexión/desconexión, estado 1 conectado / 2 desconectado) (`Save_SERSOC_REDES`, `:571-617`). La descripción del punto se arma recorriendo ancestros: "Red | Capa | Nodo → Padre → …" (`:371-399`).
- Informes de red (`clsInformes_Tecnica_Redes.cs`): estructura de red, red instalada, red conectada por servicio, **cuentas sin conexión a red física**, cuentas conectadas por punto, conexiones disponibles.

> No existe una entidad explícita "transformador"; es un componente/nivel configurado por cada cooperativa.

*Reglas adicionales de la red v2 (segunda pasada)*:
- **Capas**: los componentes y relaciones sin capa (`ID_CAPA` nulo) son comunes a todas las capas. Al consultar una capa se ven los propios de la capa más los comunes (`Get_Componentes`, `Get_Componentes_Nodo`, `RedGenerica.cs:149-177`). Los nodos instalados, en cambio, se filtran estrictamente por capa (`:234-251`).
- **Guardado de la estructura** (`Presave_Red`, `:513-549`; `Save_Relaciones`, `:551-569`): sincronización por diferencia. Lo que no viene en la pantalla se borra físicamente (servicios de la red, capas, relaciones padre-hijo).
- **Guardado de la red instalada** (`Save_REDES_RED_INSTALADA`, `:619-689`): los nodos nuevos llegan con ID negativo y reciben max+1 con bloqueo; los hijos nuevos se reapuntan al ID definitivo del padre. Los nodos existentes que no vienen en la pantalla **se borran sin verificar si tienen servicios conectados** en `SERSOC_REDES` (lo frenaría solo la integridad referencial de la base). Los atributos se sincronizan igual: insertar, actualizar o borrar según el tipo (`Save_REDES_ATRIBUTOS`, `:691-791`). Para los de tipo "tabla" se guardan el ID y el texto visible.
- **Conexión de servicios** (`Save_SERSOC_REDES`, `:571-617`): las conexiones nuevas nacen con `ESTADO = 1`. Al cargar fecha de desconexión pasan a `ESTADO = 2`. **No se valida** que el nodo admita conexión, que esté libre ni que el servicio no esté ya conectado a otro nodo.
- **Atributos tipo tabla**: la lista de tablas elegibles se arma por reflexión sobre todas las entidades del modelo con clave primaria (`Get_TableInfo`, `:121-146`).
- **Informes de red** (`clsInformes_Tecnica_Redes.cs`):
  - "Red conectada al servicio" sube desde los nodos con conexiones vigentes hasta la raíz e incluye todos los ancestros (`:145-202`).
  - "Cuentas sin conexión a red física" lista servicios conectados (`CONDICION 2`) que no tienen conexión o que tienen **alguna** conexión con fecha de baja. **Bug**: un servicio que se desconectó de un nodo y se reconectó a otro aparece igual como "sin conexión" (`:204-230`).
  - "Conexiones disponibles" son los nodos sin ninguna conexión vigente (`ESTADO 1` y sin fecha de baja). No considera el estado del nodo (Dañado, etc.) ni la capacidad `ELEMENTO_INICIAL..FINAL`: un nodo con un solo servicio conectado ya no figura como disponible aunque admita más (`:264-308`).
  - "Servicios conectados a puntos de red" admite filtrar por un rango de consumos (`CONS_SER.FEC_ACT`) y suma el consumo del rango (`:232-262`).

### 5.3 KML / Google Earth

`ReglasNegocio.Varios.GoogleEarth*` es un serializador KML mínimo (Document, Folder, Placemark, Point, LineString, Style/IconStyle/LineStyle).
- Red v1: genera `Red.kml` con carpeta "Puntos de Conexión" (un placemark por nodo con ícono del nivel) y carpeta "Conexiones" (líneas padre→hijo azules de ancho 3); nodos sin coordenadas se omiten (`clsTecnica.cs:3720-3857`). Coordenadas parseadas con cultura **es-ES** (coma decimal).
- Red telefónica: KML de central, repartidor y cajas (`clsRed.cs:1431-1540`).

### 5.4 Exportaciones "GIS" por cooperativa (`ReglasNegocio.Varios.GIS`)

Clase abstracta `GIS.Exportar(codSer, desde, hasta, porFechaFactura)` con 10 implementaciones a medida (Huanguelén, Puan, San José, Saldungaray, Monte Hermoso, Tornquist, Cler, Mariano Alfonzo, Villa Lía, Espartillar) (`GIS.cs:7-22`). Generan archivos de texto de ancho fijo/CSV para un GIS externo: `Usuarios.txt`, `Consumos.txt`, `Movimientos.txt` (altas/bajas), `Activos.csv` (Tornquist) y **`RTI.txt` para OCEBA** (Saldungaray) con código de distribuidora (parámetro **2823**), categoría `COD_OCEBA`, partido, liquidación (FAC A/B), lecturas y energía pico/resto/valle y potencias (`SALD.cs:244-363`). Las bandas se infieren por `COD_CAT` (90, 93, 94, 95, 96) o `COD_CON` (21-25) **hardcodeados**. `SERSOC_EXTRAS.GIS` marca servicios con dato GIS (`clsInformes_Tecnica.cs:1818`).

#### 5.4.1 Patrón común de los exportadores (segunda pasada)

- **Selección del exportador**: el parámetro **2933** "Selección de exportador GIS" elige la implementación (valores del enum `GIS.Coop`) (`CapaNucleo/clsVariables.cs:732`, `GIS.cs:7-22`). Hay una sola cooperativa por instalación.
- **Salida**: todos escriben en la carpeta temporal del usuario y devuelven esa ruta si se generó al menos un archivo; si no, devuelven nulo. Formato de texto: campos de ancho fijo con relleno y separados por coma. Fechas `dd/MM/yyyy`, salvo San José (`yyyy/MM/dd`).
- **Consumos** (`ObtenerConsumo` de cada clase):
  - *Fuentes*: unen `SERSOC` del servicio pedido, `CONS_SER`, la factura (`FACTURAS` por `ID_FAC`) y la categoría.
  - *Dos modos de fecha*: por fecha de lectura (`CONS_SER.FEC_ACT`) o por fecha de factura (`FACTURAS.FECHA`). En el modo por lectura **el filtro fija `CONS_SER.COD_SER == 1`** además del servicio pedido (p. ej. `HUAN.cs:158`, `ALF.cs:163`, `SALD.cs:144`). En la práctica solo exporta energía, aunque se elija otro servicio. [VERIFICAR] que el servicio de energía sea el 1 en cada coop.
  - *Agrupación*: por cuenta y período. El período "MM/yyyy" se convierte a `yyyyMM`.
  - *Grandes clientes*: se marcan con `GC = S` si el servicio tiene contrato especial, y en ese caso la energía total sale en 0 (solo se informan bandas y potencias).
  - *Tarifa y potencia*: la tarifa informada es `CATE_SER.COD_OCEBA` y la potencia contratada sale de `MEDSOC.CONTRATADO`.
  - *Bandas*: la energía pico/resto/valle y las potencias se identifican por códigos de concepto (`COD_CON`) o de categoría (`COD_CAT`) **fijos en el código y distintos en cada coop**. [VERIFICAR] contra la tabla de conceptos de cada base.
- **Usuarios**: el número "S/N" se exporta como 0. Se usa el CUIT sin guiones o, si falta, el DNI.
- **Movimientos.txt** (Huanguelén, Puan, Monte Hermoso, Tornquist): una línea `A` por cada alta (`FEC_ALTA`) y una `B` por cada baja (`FEC_BAJA`) dentro del rango. El código de propiedad del medidor es "7" si `COD_PROP == 2` y "1" en cualquier otro caso; el último campo es la constante "B".

#### 5.4.2 Diferencias por cooperativa (segunda pasada)

- **Huanguelén** (`HUAN.cs:56` usuarios, `:112` consumos, `:139` consulta, `:196` movimientos; en las demás coops se citan en ese mismo orden):
  - *Usuarios*: la cuenta exportada es `SUMSOC.WEB_SITE` si está cargado (campo reutilizado como "cuenta GIS"), si no `COD_SUM`. Incluye servicios dados de baja (no filtra `FEC_BAJA`).
  - *Catastro y ruta*: la nomenclatura catastral se toma del ítem de propiedad `COD_PROPIEITEM == 9` [VERIFICAR]. La ruta es zona(3)+sector(1)+recorrido(6).
  - *Bandas*: pico `COD_CON 23`; fuera de pico `24/25` con `COD_CAT 10`; resto `24` y valle `25` con `COD_CAT 11`; potencias `21/22`.
- **Mariano Alfonzo** (`ALF.cs:56`, `:117`, `:144`):
  - *Usuarios*: genera dos archivos, `UsuariosConCero.txt` (cuenta rellenada a 10 dígitos) y `Usuarios.txt`, solo con servicios activos. La fecha de alta es `SUMSOC.ALTA` (01/01/2000 si falta).
  - **La fase eléctrica (R/S/RST) se asigna al azar** (`ALF.cs:61`): es un dato inventado y no debe tomarse como real. El cálculo del código de luz desde la observación se hace pero su resultado se descarta.
  - *Bandas*: pico `COD_CON 19/26`, fuera de pico `20`, resto `24`, valle `25`, potencia pico `22`, potencia fuera de pico `21` (al revés que en otras coops).
- **Cler** (`CLER.cs:54`, `:85`, `:129`):
  - *Usuarios*: solo activos. Si el recorrido de lectura (`REC_LEC`) tiene 7 dígitos, se formatea `NN-NNN-NN` y se usa como cuenta y matrícula; si no, `COD_SUM` y `MATRICULA`. Fase fija "R".
  - *Consumos*: se identifican por ese mismo recorrido formateado.
  - *Bandas*: fuera de pico y resto se distinguen por `COD_OCEBA` "T2BT"/"T3BT" con `COD_CON 24`.
- **Espartillar** (`ESPA.cs:54`, `:85`, `:114`): como Cler, pero la cuenta, si tiene 8 dígitos o más, se reformatea así: primer dígito rellenado a 4, resto rellenado a 8 y un "0" final. Misma regla T2BT/T3BT.
- **San José** (`JOSE.cs:54`, `:188`, `:228`):
  - *Usuarios*: solo servicios con ruta de reparto (`RUTA_SR`), formateada en bloques 4-1-4-2. Esa ruta es también la cuenta en Consumos.
  - *Período y bandas*: `TipoPeriodo = "B"` (bimestral). Bandas por `COD_CAT 8` (fuera de pico) y `9/13` (resto/valle).
- **Villa Lía** (`LIA.cs:54`, `:99`, `:126`):
  - *Usuarios*: incluye bajas. Propiedad desde el ítem `COD_PROPIEITEM 7`, con "000000-0" por defecto. Fase fija "RST".
  - *Consumos*: valores truncados a enteros. Bandas `COD_CON 25/31/27/26`, potencias `23/24`, contratada desde `MEDSOC` `23/24`.
- **Monte Hermoso** (`MONT.cs:33`, `:138`, `:202`):
  - *Usuarios*: la cuenta es el número de **socio** (`COD_SOC`), no la cuenta. Matrícula reformateada a partir de sus partes 3 y 4 (`00000.000`).
  - **Bug CUIT**: la condición `CDI != "" || CDI != "0"` es siempre verdadera, así que nunca cae al DNI (`MONT.cs:109`).
  - *Consumos*: el query ignora el servicio pedido (solo `COD_SER == 1`). Agrupa por (cuenta, período, valor de consumo), por lo que dos lecturas con el mismo valor en el mismo período se funden en una.
- **Puan** (`PUAN.cs:35`, `:84`, `:152`):
  - *Consumos*: agrega el **precio de la energía** = suma de `ITEMSFAC.PRE_VSI` del servicio 1; en modo factura excluye ítems con `OBSERVA1 = "0"`. Toma el primer consumo del grupo. Escribe el archivo aunque la lista esté vacía.
  - *Ruta*: zona(2)+recorrido(8) en usuarios, zona(4)+recorrido(9) en movimientos.
- **Saldungaray** (`SALD.cs:88`, `:130`, `:243-363`):
  - *Consumos*: la fecha hasta se extiende a 23:59:59 y el período sale de `FACTURAS.PERIODO`. Bandas por `COD_CAT 90/95/93/96/94`.
  - *`RTI.txt` (OCEBA), formato*: CSV con `;` y cabecera. Distribuidora = parámetro **2823**. Mes, cuenta rellenada a 11, partido = `DEPTO.COD_OCEBA`, liquidación "FAC A (17)" si `COD_COM` es 1 o 96 y "FAC B (18)" en otro caso, más sucursal-número. Lectura inicial = menor `FEC_ANT`, lectura final = mayor `FEC_ACT`.
  - *`RTI.txt`, bandas*: por fecha de consumo, `COD_CON 23/24/25` y potencias desde el estado actual (`EST_ACT`) de `COD_CON 21/22`; por fecha de factura, `COD_CAT 90/93/96/94/95`. Cierra con las constantes "M;R".
  - Hay un filtro sobre el período 202312 que no tiene efecto (código muerto).
- **Tornquist** (`TORN.cs:37`, `:166`, `:194`, `:268`, `:327`):
  - *Consumos*: solo los de tipo de energía vacío o "A" y facturas `COD_COM 96/97`. El precio es la suma de `ITEMSFAC` del servicio 1 excluyendo `OBSERVA1` 0/9/10/15, **prorrateado en partes iguales** entre los consumos de la factura; se procesa en lotes de 2000 IDs.
  - *Usuarios y movimientos*: matrícula de 14 caracteres reformateada; los movimientos usan `SERSOC.EDIFICIO` como identificador.
  - *`Activos.csv`*: UTF-8 con el separador de lista de la cultura del equipo y valores precedidos por tabulador (para que Excel no los convierta). Lista los servicios activos con cuenta(11), edificio(13) y `COD_OCEBA`.

---

## 6. Tickets / mesa de ayuda (`ReglasNegocio.Varios.Tickets`)

> Hallazgo: este módulo es la **mesa de ayuda del propio proveedor de Procoop** hacia sus clientes (cooperativas): tickets por proyecto/módulo del software, horas de soporte e implementación bonificadas por cliente, presupuestos y **facturación de horas** (`TipoTk`: Soporte, Implementación, Desarrollo, Administración, Calidad; `Resultado_Testing`; `clsTickets_Cuentas.Actualizar_Horas`). No es un módulo de atención al usuario de servicios públicos.

Reglas principales (`clsTickets.cs`):
- **Workflow configurable**: `TICKETS_TIPOS` → `TICKETS_SUBTIPOS` → `TICKETS_ESTADOS` ordenados (`ORDEN`) y mapeados a 4 estados base: 1 Pendiente, 2 En proceso, 3 Cerrado, 4 Cancelado (`:88-94`). Cada estado puede `REASIGNAR`, ser de `TESTING`, permitir `VUELVE` atrás y disparar `ENVIARMAIL` (`Esprocesable`, `:1289-1356`).
- **Gravedad** (prioridad): Sin asignar 0, Crítico 1, Alta 25, Normal 50, Baja 75, Muy baja 100 (`:78-86`), con `FEC_VENC` y minutos estimados.
- Pendiente → requiere permiso `Tk_Autorizar` para autorizar (`:1472-1503`). En proceso → si el próximo estado es de testing asigna tester y fecha estimada de test a **2 días hábiles** (`:1508-1516`). Cierre: valida que el subtipo no tenga `BLOQUEAR_CIERRE`, pide tipo de cierre (OK / OK con observaciones), validación interna y del cliente, nota de cierre; marca el presupuesto relacionado como "P"; mail de cierre opcional (`:1432-1568`). Cerrado/Cancelado → se pueden **recuperar** dejando nota (`:1570-1607`). No se puede volver atrás un ticket facturado.
- **Registro de tiempo**: notas `TICKETS_NOTAS` con inicio/fin; tomar, pausar, soltar, retomar; un usuario solo puede tener un ticket "tomado" (`TomarTicket`, `PoseeTicketTomado`, `PausarTicket`, `SoltarTicket`, `:1647-1860`). Orden de cola por usuario (`ORDEN`).
- **Facturación de horas** (`GetTicketsFacturar`, `Aplicar_Bonificaciones`, `GenerarDeudaVta`, `:2896-3236`): minutos reales = suma de notas; minutos a facturar editables; bolsa mensual de horas de **soporte** (`SOCIOS.BONIF_SOPORTE`) y de **implementación/venta** (`TICKETS_RESPONSABLES.BONIF_VENTA`, se descuenta) según `TICKETS_TIPOS.TIPO_BONIFICACION` (1 mensual, 2 venta). Genera comprobante de venta por cuenta, con producto hardcodeado **464** para horas sin producto y bonificación a valor hora del parámetro **2488**.
- **IA**: `clsAnalisisNotasTicket.AnalizarNotas` resume las notas (texto RTF + imágenes) con un modelo **gpt-4o** (`clsAnalisisNotasTicket.cs:36`).
- Contactos del cliente con datos de acceso remoto (`ID_REMOTO`, `CLAVE`, forma de conexión) (`Ticket/clsContacto.cs:66-79`) — ⚠️ credenciales guardadas en claro.

### 6.1 Reglas adicionales de tickets (segunda pasada)

**Catálogos y estados auxiliares** (`clsTickets.cs:570-652`): tipos, subtipos, estados y módulos se cachean en memoria. Los estados de un ticket son los del grupo de estados (`COD_TIPOESTADO`) de su tipo, ordenados por `ORDEN`. Se definen estados "especiales" por su estado base:
- estado de cierre: base 3;
- "en espera del cliente": base 2 con `ESPERA_CLIENTE`;
- "asignado": base 2 sin `ESPERA_CLIENTE`.

El subtipo indica si al cerrar se registra la causa (`REGISTRA_CAUSA`).

**Avance de estado** (`Esprocesable`, `:1288-1356`), en orden:
1. Si el ticket está tomado, primero se suelta (`SoltarTicket`).
2. Si está pausado, error "No es posible Procesar un ticket Pausado".
3. Volver atrás exige `VUELVE` en el estado y que el ticket no esté facturado. Desde cancelado, "volver" va al último estado previo que no sea de cierre.
4. Un ticket cerrado no se procesa.
5. Cancelar lleva al estado base 4 del mismo grupo; si no existe, error.
6. Avanzar lleva al siguiente `ORDEN`; si no hay, error "alcanzó su estado final".
7. Se fuerza reasignación si el estado destino tiene `REASIGNAR`, o si es de testing y no hay tester.

**Asignación, cola y tiempo**:
- *Reasignar* (`ReasignarTicket`, `:1618`/`:1968`): no se permite si el ticket está pausado o tomado, y solo en estado base 2. El usuario −1 significa "sin asignar".
  - Antes de asignar, `CambiosAlReasignar` (`:2320-2482`) deja notas internas automáticas cuando cambian el vencimiento, la gravedad o el subtipo. Si cambia el vencimiento y el contacto tiene mail (y no marcó "no mostrar"), ofrece enviarle el correo "CambioVencimiento" y anota "Correo Reprogramación ENVIADO/CANCELADO". También actualiza `INFORMAR_FUNC`, minutos estimados y módulo.
  - *AsignarTicket* (`:2012-2042`) guarda el historial en `TICKETS_ASIGNACIONES`, puede volver las fechas estimadas al centinela 01/01/1900 y avisa al asignado por `PROMAIL` (tipo de notificación 2).
- *Tomar* (`TomarTicket`, `:1647-1706`): solo un ticket asignado a uno mismo. Si ya se tiene otro tomado, se elige entre interrumpirlo (pausa) o soltarlo. En estado de testing registra al tester (`USER_TESTING`).
  - Durante una llamada telefónica el ticket tomado se pausa y se reanuda solo, con la nota interna "Pausado Automáticamente…" (`PausarTicketTomado`, `:1707-1740`).
  - Pausar y soltar exigen ser el usuario que lo tiene (`:1765`, `:1849`).
  - "Espera cliente" alterna entre el estado de espera y el asignado (`:1741-1764`).
- *Cola personal* (`ObjetoTicketOPTOrden`, `:788`; `CambiarOrden`, `:2043-2085`): con ajuste 0 el ticket pasa al primer lugar y corre los demás; con ±N se intercambia con el vecino. Al listar los propios tickets en proceso, `GetTickets` renumera `ORDEN` de 1 a n con SQL concatenado (`:900-1006`). Número siguiente = max+1 (`GetProximoOrden`, `:1611`).
- *Tiempo estimado a facturar* (`EstimarTiempo`, `:308`): si el ticket se factura, se usan los minutos a facturar cargados, o si son 0 los minutos utilizados. `GetTiempo` (`:695`) lo muestra como "X Hs Y Min". El detalle de tiempo por usuario sale de las notas con inicio/fin (`Get_DetalleTiempo`, `:2227`/`:2234`; `GetTiempoTicket`, `:2262`).

**Cancelación y validación**:
- *Cancelar* (`CancelarTicket`, `:1357-1386`):
  - registra fecha y usuario de cierre;
  - manda mail a la dirección interna configurada como entrada 5, con una dirección fija de respaldo en el código;
  - si quien cancela no es el creador, le avisa por `PROMAIL` (tipo 3, `AvisarCancelacion`);
  - si hay presupuesto vinculado, pregunta si queda Rechazado o Anulado (`clsPresupuesto.Rechazar_Anular_Presupu`).
- *Validar* (`ValidaTicket`, `:1387-1421`): solo tickets cerrados; graba tipo de cierre, validación interna y validación del cliente.

**Presupuestos y vencimiento**:
- `RelacionarPresupuesto` (`:845-867`) desvincula el presupuesto anterior y vincula el nuevo.
- `ModificarVencimientoTicket` (`:874-894`):
  - presupuesto aceptado: vencimiento = hoy + (fecha de entrega − fecha de validez) días, 30 por defecto;
  - si no, vencimiento = fecha de validez del presupuesto.
- `CambioFechaVencimiento` (`:3404`) avisa por `PROMAIL` (tipo 1) al último usuario que asignó.

**Listados** (`GetListaTickets`, `:1063-1141`): reintenta hasta 3 veces ante errores transitorios, esperando 350 ms × intento. Agrupa por fin estimado: Vencidos / Hoy / Mañana / Próximos 7 días / Futuro / Sin fecha (centinela 1900). Los pendientes "de todos" excluyen estados base 3/4 y "SIN ASIGNAR"; los pendientes sin usuario excluyen los tomados o pausados.

**Cliente**: `GetDatosSocio` (`:1156`) marca "facturar" si la cuenta no tiene un registro vigente de no facturar (`SUMNOFAC`). `ActualizarCuenta` (`:895`) escribe la observación de la cuenta. `UnificarContactos` (`:2483-2523`) conserva el contacto de menor ID, le reapunta los tickets y borra los demás.

**Mails y avisos** (`EnviarMailTemplate`, `:2524`):
- *Destinatarios*: la dirección interna configurada como entrada 7 más el contacto, o una casilla "no responder" fija.
- *Plantillas HTML*: alta, cierre, modificación, cambio de vencimiento, presupuesto enviado (adjunta el PDF del presupuesto, informe del parámetro de reporte **210**, `GetInformePresupuesto`, `:2750`, `:2797`) y presupuesto rechazado.
- *Otros avisos*: las funcionalidades nuevas van a la entrada interna 6 y por `PROMAIL` a todos los usuarios internos (`EnviarCorreoConFuncionalidad`, `:2824`). [VERIFICAR] qué direcciones hay cargadas en esas entradas en la base del proveedor.

**Importación de prestaciones heredadas** (`ImportarPrestaciones`, `:2086-2226`): migra desde una base DBF por OLEDB.
- *Conversión*: horas ×60 a minutos; los códigos de prestación menores a 800 se guardan negativos; los IDs que chocan se renumeran max+1.
- *Valores fijos*: gravedad 50 (normal); facturar = no "sin cargo"; resultado 1 → tipo de cierre 1.
- *Altas y recortes*: crea los contactos faltantes y corta el asunto a 100 caracteres.
- *Errores*: "Usuario no encontrado" / "Evento no encontrado".

**Otros**:
- *Datos extra* (`GuardarExtras`, `:2283`): descripción y ruta de acceso del ticket en `TICKETS_EXTRAS`, con SQL armado escapando comillas.
- *Facturación de horas* (`GetDetalleFacturado`, `:3237`/`:3267`): informe "Prestación de Servicios" por factura, con los minutos de cada ticket en su primera nota. `GetProximoCliente` (`:2816`) navega al siguiente cliente con tickets cerrados sin facturar.
- *Nota de cierre* (`Actualizar_NotaCierre`, `:813`): actualiza por SQL concatenado (riesgo de inyección).
- *IA* (`clsAnalisisNotasTicket.FormatearComoNota`, `:93`): el resultado del análisis se guarda como nota, con la acción sugerida ("Pasar a Desarrollo", "Consulta de funcionamiento" o "No determinada") y la información faltante.

**Administración y cuentas**:
- *Calendario* (`clsTickets_Administracion.GetDatosCalendario`, `:44`): muestra los tickets en proceso; usa las fechas de testing si está en testing, y la fecha fin se extiende a las 23:59. Al guardar cambios se marca `VALIDA_ADMINISTRACION = 1` (`GuardarCambios`, `:83`) y la cola se reordena con los validados primero, por inicio estimado (`Ordenar`, `:115`).
- *Responsables por cuenta* (`clsTickets_Cuentas.ActualizarResponsable`/`ActualizarProyecto`, `:58`/`:80`): alta o actualización de `TICKETS_RESPONSABLES`; las horas bonificadas se guardan ×60.

**Informes** (`clsInformes_Tickets.cs`):
- *Desvío de estimaciones* (`GetDesviosEstimaciones`, `:387`): solo cuenta notas de usuarios del área 2 (desarrollo, fijo en el código) y fuera de testing; cuenta las devoluciones desde testing.
- *Desvío de fecha de vencimiento* (`GetDesvioFechaVto`, `:492-594`):
  - solo considera tickets cerrados, aunque se elija otro estado;
  - desvío = fecha de cierre − vencimiento;
  - **bug**: si no hay ninguno "desviado", el filtro queda en "solo desviados" y el resultado sale vacío;
  - la opción "excluir Procoop" fija la cuenta 136.
- *Pendientes por usuario* (`:596`, `:668`): separa "sin intervención" de 7 días y de 8 o más.
- *Tickets a informar* (`Get_Informar_Tickets`, `:875`): al procesarlos, `INFORMAR_FUNC` pasa de 1 a 2.
- *Reclamados* (`:921`): notas marcadas `RECLAMO` en tickets no facturados.
- *Cambios de vencimiento* (`:998`): se detectan buscando el texto de la nota automática.
- *Resto*: operaciones por usuario (creados, notas, asignaciones, cerrados, cancelados) y control por período.

---

## 7. Actividades internas (`ReglasNegocio.Actividades`)

Agenda de tareas recurrentes de la cooperativa (vencimientos regulatorios, mantenimientos programados, etc.):
- `ACT_AREAS` (área con responsable y mails extra) → `ACT_TIPOS` (tipo con frecuencia, `MARGEN_ANT`, `MARGEN_POS`, día de envío, plantilla Word) → `ACTIV` (actividad con responsable, mails extra, `FEC_HASTA`, `TIP_GEN` 1 = automática) → `ACTIV_SEG` (ocurrencias/seguimientos con fecha, cierre, revisión, observación, usuario y responsable de cierre).
- Frecuencias (`TiposFrecuencia`): semanal, mensual, bimestral, trimestral, cuatrimestral, semestral, anual o manual cada N días (`clsActividades.GetFechaActividad`, `clsActividades.cs:74-88`).
- Generación automática: cuando la próxima fecha menos el margen anterior ya llegó, se crea la siguiente ocurrencia y una cita en `CALENDARIO` del usuario cuyo mail coincide con el responsable (`clsActividades.cs:33-61`, `clsSeguimiento.cs:97-109`).
- Envío diario de recordatorios (una vez por día, control en parámetro **681**): por actividad, por responsable y por área con resumen de días de atraso promedio (`clsSeguimiento.cs:33-247`).
- Estados de listado (`Estados_Actividades`): activas, vencidas (fecha + margen posterior < hoy), cerradas, cerradas en término / fuera de término (`clsSeguimiento.cs:308-328`).
  - ⚠️ **Corrección (segunda pasada): los filtros "en término" y "fuera de término" están invertidos.** El estado 4 (`Cerradas_En_Termino`) selecciona las cerradas con fecha + margen posterior **≤ fecha de cierre**, es decir las cerradas tarde. El estado 5 selecciona las cerradas antes del límite (`clsSeguimiento.cs:312`).
  - Columna de estado del listado: "Cerrada"; "Próxima a Vencer" si hoy está entre fecha − margen anterior y fecha + margen posterior; "Vencida" si se pasó; "Pendiente" en otro caso (`:321`).

### 7.1 Reglas adicionales de actividades (segunda pasada)

- **Generación de la ocurrencia** (`clsActividades.GenerarSeguimiento`, `clsActividades.cs:32-73`):
  - *Cuándo no se crea*: si la próxima fecha supera la vigencia de la actividad (`FEC_HASTA`). La sobrecarga que recibe código 0 no hace nada.
  - *Numeración*: la ocurrencia en `ACTIV_SEG` se numera max+1 y se marca automática (`MANUAL_ACT = 0`).
  - *Calendario*: se crea la cita en `CALENDARIO` solo si algún usuario (`USERS.CORREO`) tiene el mismo mail que el responsable (`MAIL_RES`); el vencimiento de la cita es fecha + margen posterior.
- **Disparo automático** (`clsSeguimiento.cs:97-109`): solo actividades con generación automática (`TIP_GEN == 1`) y vigentes (`FEC_HASTA` ≥ hoy).
- **Frecuencias** (`clsFrecuencias.ValidarExistencia`, `clsFrecuencias.cs:26`): no puede haber dos frecuencias con el mismo tipo y cantidad de días; error "Ya existe una frecuencia con los mismos parametros…".
- **Destinatarios** (`clsResponsa.GetlstMails`, `clsResponsa.cs:13`): unión sin repetidos de los mails de responsables y de los mails extra de las áreas, separados por coma.
- **Días de envío de recordatorios** (`clsSeguimiento.cs:159-247`, `GetNroDeDia` `:249`): `DIAS_ENVIO = 0` significa todos los días. Otro valor es el día ISO de la semana (1 lunes … 7 domingo) en que se envía. El parámetro **681** es de tipo fecha (último envío), no carácter.
- **Mail de finalización** (`EnviarMailFinalizacion`, `:110-158`): al cerrar una ocurrencia se envía en un hilo aparte con la plantilla `MailActividades.htm`.
- **Planilla impresa** (`GenerarPlantilla`, `:278-306`): combinación de correspondencia con la plantilla Word del tipo (`ACT_TIPOS.PLANTILLA`) o la predeterminada `Plantillas\Plantilla_Actividades.dot`. Estado impreso: "Pendiente", "Cerrada con Revision" o "Cerrada".
- Métodos sin regla de negocio: `clsActividades.GetGridDataSource`, `GetlstActividades`, `clsAreas.GetGridDataSource`, `GetlstAreas`, `clsFrecuencias.GetGridDataSource`, `GetlstFrecuencias`, `clsResponsa.GetlstResponsa`, `clsTipos.GetGridDataSource`, `GetlstTipos`.

---

## 8. Telefonía

### 8.1 Abonados, numeración y líneas

- **Prefijos** `TEL_PREFIJO` (característica local) y **pool de números** `TEL_NUMEROS` (alta/baja por rango desde-hasta, validación de superposición, disponible/asignado) (`clsTelefonia.cs:1024-1135`).
- **Línea del abonado** `TEL_SERSOC`: vincula un `SERSOC` de telefonía con un `COD_NUM`, fechas de alta/baja (vigencia usada para atribuir llamadas) y **plan tarifario** `COD_TAR` → `TARTEL` (`:1148-1217`). Un número no puede estar en uso por otro servicio en la misma fecha (`Validar_NumeroEnUso`). Desvincular medidor = cerrar `TEL_SERSOC` (`:1199`).
- **Prepago**: la categoría `CATE_SER.PREPAGA` define telefonía prepaga (`Validar_TelefonoPrepago`, `:976-987`); la recarga genera una OT con operación del parámetro **238** (`:989-1000`).
- **Guía telefónica** (`clsInformes_GuiaTelefonica.cs`): tradicional, compacta A/B, Excel; filtra titulares que desean figurar.
- **Red física** (`clsRed.cs`): `TEL_CENTRAL` (con `MODALIDAD` = formato de CDR, prefijo, moneda) → puertos de central → `TEL_REPARTIDOR` → grupos de entrada/salida → regletas → posiciones; `TEL_CAJAS` → regletas → posiciones; `TEL_DSLAM` → puertos. Estados de puerto: Disponible, No disponible, Inactivo; conexiones entrante/saliente y conexión masiva (`:69-95`, `:531-645`). El servicio queda conectado a una posición de caja (`TEL_POS_REG_CAJA` → `SERSOC`, `TECNICA`), elegible al crear la OT (`Get_PuntoConexionDisponibles`, `:1361`).

### 8.2 Plan de numeración (`CARACTER`) y claves (`CLAVES`)

- `CARACTER` = prefijos de destino (número completo, localidad, indicativo, bloque, operador `OPERADOR`, servicio `TEL_SERVICIO`, modalidad `TEL_MODALIDAD` con flag `MOVIL`, `CLAVE` tarifaria, `LOCAL`). Se importa desde la planilla de numeración (ENACOM): número = `0`+indicativo+bloque, o `0`+indicativo+`15`+bloque si es móvil (`Save_CARACTER`, `clsTelefonia.cs:446-498`).
- Búsqueda de destino por **prefijo más largo** con un stored procedure que se crea si no existe (`Get_PrefijoLlamada` y funciones `Get_*LlamadaFunc`, `Crear_StoreCaracter`, `:2241-2252`).
- Claves con semántica fija en el código: **0 local, 1 urbana, 88 o >100 internacional, 99 gratuita** (`Tasacion_Set_TipoLLamada`, `:1930-1934`).
- Tipos de llamada (`TipoLLamada`, `:391-409`): Local 0, Urbana 1, Interurbana 2, Internacional 3, Por operadora 4, Gratuita 5, Especial 6 (central virtual), CPP 7; **prepago = tipo + 10**.

### 8.3 Importación de CDR

`Importar_LLAMADAS` (`clsTelefonia.cs:1258-1389`) lee archivos de un directorio filtrando por extensión según la **modalidad de la central** (~35 formatos en `clsRed.ModalidadCentral`, `clsRed.cs:97-205`: LAMA ESD 3000 y variantes, Lucent, Huawei .SAL, Iskratel, Adtran, Softswitch (HRU/HRR/Tecnored/PIGU/saliente), Frappa, TR, Broadsoft XML, Central IP, Telco IP (agrupada, CSV con `,` o `;`), NEC, Alcatel, Cordect, CDR Excel, y descargas online sin archivo: Gretix, Tecnored Sunsip, AION, Central Online). El despacho está en `clsImportacion.Importar_LLAMADAS` (`clsImportacion.cs:66-117`).

- Llamadas **salientes** → `LLAMADAS` (con `LOTE` por central) y se tasan (salvo Telco IP que trae importes).
- Llamadas **entrantes** → `ENTRANTE`; se atribuye el destinatario buscando el número con y sin prefijo (0 o >1 coincidencias = observación) (`SetDestino_ENTRANTE`, `clsTelefonia.cs:510-558`).
- **Duplicados**: con parámetro **2302** se detectan por (origen, destino, fecha, segundos) y se pregunta si reprocesar; las ya existentes reutilizan `COD_LLA` (`clsImportacion.cs:119-303`).
- Atribución del origen: número normalizado `0`+prefijo+número vigente a la fecha de la llamada; 0 → "origen no encontrado", >1 → "duplicado" (`Tasacion_Set_OrigenLlamada`, `clsTelefonia.cs:1788-1878`).
- Asignación manual de llamadas no atribuidas a una línea (`AsignarLlamada`, `:2521-2582`) y borrado por lote solo si no están agrupadas/facturadas (`GRUPO = 0`) (`EliminarLlamadasLlamadas`, `:2395-2458`).

### 8.4 Tasación (pseudocódigo)

`Tasacion_LLAMADAS` (`clsTelefonia.cs:1403-1459`), datos de `Get_DatosTasacion` (`:1752-1786`):

```
para cada llamada:
  origen  ← TEL_SERSOC vigente (cuenta, servicio, plan COD_TAR)
  destino ← CARACTER por prefijo más largo → CLAVE, operador, ¿móvil?(CPP)
  tipo    ← Local/Urbana/Interurbana/Internacional/Gratuita/CPP según clave y flag LOCAL
  tramos  ← partir la duración por BANDAS horarias (día 1..7; feriado ⇒ bandas de domingo;
             cruce de medianoche soportado)                                 :1590-1698
  tipoBanda ← TARESP(plan, banda, [tipo llamada]) (fallback sin tipo)       :1544-1588
  importe ← por cada tramo: TARCLA(tipoBanda, clave, [tipo]) con FRACCION e IMPORTE;
             si hay varias TARCLA se aplican escalonadas por NUMERO (1ª fracción, siguientes…)
             fracciones = ceil(seg / FRACCION) (mín. 1); se guarda TEL_FRACCIONES   :2036-2134
  si prepago (p.236, servicio prepago p.332, categoría vigente a la fecha por SERSOC_HST) → tipo += 10
  si internacional (clave 88 o >100) y p.62 → se copia a INTERNAC con cotización de moneda;
       en LLAMADAS el NETO queda en 0                                        :633-645, :1767-1774
  si destino ∈ GRATIS → gratuita, importe 0
  si origen y destino son números de la misma "central virtual" (servicio p.82) → tipo 6, 0
  si no: descuentos PLANDES + consumo mínimo
  si el CDR traía importe (TotalImportado>0) → prevalece
```

**Planes de descuento** `PLANDES` (`Tasacion_Set_Descuento`, `:2136-2231`): filtros por plan, categoría, solo locales, rango de claves, día de semana, franja horaria, rango de duración, cuenta específica, prefijo; tipos: descontar importe fijo, descontar %, cobrar solo los primeros N segundos, cobrar importe fijo, cobrar 50 % después de N segundos; tope `MAXIMO`.

**Consumo mínimo por llamada**: parámetro **64**; si **471** está activo, no se aplica a claves 0/1 (locales/urbanas) (`:2233-2239`).

Las llamadas tasadas quedan con `GRUPO = 0` hasta que la facturación las agrupa en un consumo (`CONS_SER.GRUPO`, `CLAVE = 100`) — ver `clsCVLP.cs:430-436` y documento de Facturación.

### 8.5 CPP y CVLP (`LLA_CEL`, `clsCVLP.cs`)

**CPP** ("Calling Party Pays"): llamadas de abonados de la coop hacia celulares. El importe lo define la **operadora móvil**; la coop lo cobra al socio y luego **liquida a la operadora** emitiendo una **CVLP** (Cuenta de Venta y Líquido Producto, comprobante AFIP de quien vende por cuenta de terceros).

- Importación de archivos de operadora por modelo `ARCHIVOS.REF_ARC`: CPP, CP2 (Nextel), CP4, CP5, CP6 (`Importar_CPP`, `clsTelefonia.cs:2292-2353`); campos `COD_OPE`, origen, destino, fecha, segundos, segundos redondeados `SEC_CPP`, **`IMP_CPP`**, lote del operador `LOT_OPE`; operador por defecto parámetro **2295** (`clsImportacion.cs:3525-3650`). Telco IP también genera `LLA_CEL` a partir de llamadas de tipo CPP (`clsImportacion.cs:2105-2200`).
- `clsCVLP.GetResultados` (`clsCVLP.cs:99-118`) tiene dos modos:
  - `TipoProceso = 0` (**CPP**, `ProcesarCPP`, `:444-496`): llamadas del operador, opcionalmente por rango de fechas, lote, período facturado o **"según cobranzas"** (solo llamadas cuyo consumo fue facturado y **cobrado**, prorrateando por `TOTAL1/PAGADO`). Agrupa por condición de IVA del socio y alícuotas (`ALI_IVA_CF` del concepto parámetro **19**): neto, IVA, sobretasa, percepción (salvo "excluir no categorizados").
  - `TipoProceso ≠ 0` (`ProcesarServicios`, `:498-556`): CVLP por servicios/productos/impuestos facturados por cuenta de terceros (excluye comprobantes CVLP previos; signo según débito/crédito).
- `GenerarCVLP` (`:120-412`): crea `FACTURAS` (todos los vencimientos = fecha, saldo = total, `NRO_CUO` = lote) con un ítem por condición de IVA más ítems de impuesto (código IVA parámetro **543**). Las **comisiones** de la coop (hasta 3: % e importe) se restan como ítems negativos (`SUBTIPO 5`) y se facturan aparte a la operadora (Factura o, con parámetro **79**, Nota de Débito); conceptos: comisión 1 parámetro **70** (o el indicado), comisiones 2 y 3 parámetro **353**. Al grabar marca `LLA_CEL.ID_FAC`; si la cantidad actualizada no coincide (llamada ya liquidada) **revierte todo** (`:383-395`).

### 8.6 Internacionales y larga distancia

- Internacionales de la central: `INTERNAC` derivado de `LLAMADAS` (con cotización `COT_PES` de la moneda de la central; los importes de claves internacionales en `TARCLA` se multiplican por la cotización) (`clsTelefonia.cs:1767-1774`, `:597-645`).
- Internacionales de **operador/carrier**: importación de archivo propio o modelo TRL (`Importar_Internacionales`, `:2355-2393`), carga manual por operadora (`OPERADORA = true`) con control de repetidos (`:647-681`). Concepto de facturación parámetro **24** (`clsInformes_Llamadas.cs:828`).
- Larga distancia nacional = claves interurbanas tasadas localmente (no se encontró un circuito aparte).

### 8.7 Interconexión

No se encontró una liquidación de interconexión explícita (cargos de terminación entre operadores). Lo más cercano: el registro de **entrantes** por central (`ENTRANTE`), el operador destino de cada llamada (`COD_OPE`), los campos `NET_COO`/`SUB_COO` en `LLAMADAS`/`INTERNAC` (posible "neto cooperativa") y el informe **Llamadas por operador** (`clsInformes_Telefonia.Informes_Telefonia`: Llamadas CNC, Categorías CNC, Realizadas, No asignadas, No agrupadas, No facturadas, Números en central, **Conectados sin tráfico**, Por operador, Números disponibles). Los informes "CNC" alimentan reportes al regulador.

### 8.8 Telefonía móvil (reventa Claro/Personal) — `clsTelefoniaMovil.cs`

- Conceptos `SERTEL` por servicio y tipo (`TipoConceptos`, `:35-67`): larga distancia, SMS, varios, minutos de abono, minutos excedentes, servicios varios Claro, descontar SMS contratados, extras; y para telefonía fija: abono proporcional, reintegro, cargo administrativo, servicio extra (proporcional). Importe: indicado por el proveedor, por el concepto o fijo.
- Importación de la factura del proveedor (Claro/Personal) por línea, asignación al servicio, **clearing** entre líneas del mismo socio: minutos libres de un abono absorben excedentes de otra; SMS contratados no usados compensan excedentes (`Importar_Clearing_Minutos/Mensajes`, `:1167-1256`). Servicio "pack" parámetro **2253**.
- Resultado: cargos pendientes en `PRCAGAS` por período con `TIPO_SERTEL`, abono y SMS del plan (`Save_PRCAGAS`, `:1258-1306`).

### 8.9 Mensajería (SMS / WhatsApp / IVR)

- SMS/WhatsApp se encolan en tabla de mensajes (`clsMensaje.GuardarSms`) y un servicio externo los envía; identificación del cliente Procoop por parámetros **518/519**; normalización de número para WhatsApp (`ValidarNumeroWsp`).
- WhatsApp vía **Trii** (token **2870**, host **2873**, canal **2874**), con plantillas oficiales: `generacion_ot`, `link_pago_solicitado`, `detalle_comprobantes`, `confirmacion_de_pago`, `recarga_prepaga`, `cambio_dispositivo_medicion` (`EnumPlantillasWhatsApp.cs`). Selección del teléfono destino por parámetros **2824/3051/3121** (móvil de la cuenta, teléfono web, fax de la persona, según adhesión a factura electrónica) (`clsPlantillasWhatsApp.cs:133-150`).
- IVR: generación de archivos de contactos para discadores (`ModeloIVR`: IVR Logística, TeleAnnouncer Lite, texto en fila/columna, texto + audio, Minerva, IVR SPE, Excel…) (`clsIVR.cs:16-27`, `:346-796`).

### 8.10 Reglas adicionales de tasación y facturación telefónica (segunda pasada)

- **Tipo de llamada, precisión** (`Tasacion_Set_TipoLLamada`, `clsTelefonia.cs:1930-1934`). El orden de evaluación es:
  1. destino con modalidad móvil ⇒ CPP;
  2. clave 0 y prefijo `LOCAL` ⇒ Local;
  3. clave 0 y prefijo no local ⇒ **Urbana**;
  4. clave 1 y prefijo local ⇒ Urbana;
  5. clave 88 o >100 ⇒ Internacional;
  6. clave 99 ⇒ Gratuita;
  7. cualquier otro caso ⇒ Interurbana.

  "Clave 0 = local" depende entonces del flag `LOCAL` del prefijo destino.
- **Clave tarifaria** (`Tasacion_Set_ClaveLlamada`, `:1880-1928`):
  - *Clave*: si el CDR ya trae una clave distinta de 0, se respeta. La del prefijo destino solo se usa cuando falta, salvo las internacionales con el parámetro **62** activo, que siempre toman la del prefijo.
  - *Sin prefijo*: si no se encuentra prefijo, la llamada queda con la observación "Clave de llamada no encontrada" y no se tasa.
  - *Datos que se graban*: operador, marca CPP y el prefijo propio del abonado si el destino tiene indicativo.
  - Durante una importación los destinos ya resueltos se cachean.
- **Banda y tipo de banda** (`Tasacion_Get_TiempoTipoBandas`, `:1544-1588`):
  - *Plan*: sin línea atribuida se usa el plan tarifario 1 por defecto.
  - *Sin tarifa*: si no hay `TARESP` para plan + banda (ni específica del tipo de llamada ni genérica), la llamada queda en error "No existe asignacion de banda Horaria".
  - *Tramos*: los tramos del mismo tipo de banda se suman. Si toda la llamada cae en un solo tipo, se graba en `COD_TPB`.
- **Grilla de bandas** (`Tasacion_Get_BandasHorarias`, `:1716-1742`; `Save_BandasHorarias`, `:2266-2290`): la pantalla agrupa `TARESP` por hora de fin y asume **exactamente 7 filas por franja**, una por día. Las bandas tienen que tener los mismos cortes horarios todos los días; si no, la grilla falla.
  - Al habilitar un plan o un tipo de llamada, `Save_TARESP` (`:957-974`) crea una fila por cada banda existente con tipo de banda 1.
  - `Delete_TARESP` borra las del tipo de llamada.
  - `Get_TARCLA_NumeroFraccion` (`:939-947`) numera la siguiente fracción escalonada (máximo + 1 por clave y tipo de banda).
- **Simulador de tasación** (`Tasacion_LLAMADA`, `:1461-1526`): tasa una llamada suelta con plan y clave opcionales, usando la línea **actualmente abierta** del servicio (no la vigente a la fecha simulada). Sigue la misma secuencia que la tasación masiva: clave, tipo, bandas, fracciones, prepago, internacional, gratuita, central virtual, descuentos y mínimo; el importe del CDR prevalece.
- **Retasación** (`ReTasacion_LLAMADAS`, `:1250-1256`; `Tasacion_LLAMADAS`, `:1391-1401`): trabaja sobre copias, **borra la clave** de cada llamada para recalcularla desde el plan de numeración y tasa con la moneda indicada. Al grabar (`Save_LLAMADAS`, `:809-883`), las llamadas que ya tenían ID se **borran y reinsertan con un `COD_LLA` nuevo**, junto con sus fracciones e internacionales. Se hace en lotes de 500 con SQL armado por concatenación y el destino se trunca a 20 caracteres. `Get_LLAMADAS` (`:787-807`) solo devuelve llamadas no agrupadas (`GRUPO = 0`), así que no se puede retasar lo ya facturado.
- **CPP**: `Save_LLA_CEL` (`:728-785`) renumera también las que no están agrupadas y reemplaza las existentes con borrado e inserción masiva.
- **Atribución por número** (`Tasacion_Get_NumeroSersoc`, `:1528-1542`): número = prefijo (con "0" adelante si no lo tiene) + número de línea, con vigencia por fecha de alta y baja de `TEL_SERSOC`.
- **Numeración y líneas**:
  - *Pool*: el alta de rango (`Save_TEL_NUMEROS`, `:1087-1108`) crea números en estado 1 y salta los que ya existen. La baja de rango los borra físicamente (`:1111-1117`); antes se controla que no estén asignados (`Existe_TEL_SERSOC_Telefono`, `:1143-1146`).
  - *Número en uso* (`Validar_NumeroEnUso`, `:1133-1136`): cualquier línea abierta de otro servicio bloquea el número, sin importar la fecha.
  - *Desvincular* (`DesvincularMedidor`, `:1199-1217`): cierra la línea abierta con fecha de hoy, limpia `SERSOC.NUM_MED` y crea una línea nueva **sin número** con el mismo plan y la observación "Desvinculación sin OT". El servicio conserva así su plan tarifario.
  - *OT*: `GetNumerosEnOT` (`:2615-2625`) reserva los números propuestos en OT no cerradas ni eliminadas (`N_COD_NUM`).
- **Cotización** (`Save_Cotizacion`, `:2584-2589`): actualiza `TIP_MON.COT_PES`, que se usa para valorizar las internacionales.
- **Importadores de CDR por central** (agrupado): `clsImportacion` tiene un lector por modelo de central, elegido según `TEL_CENTRAL.MODALIDAD`. Formatos:
  - *Salientes* (`clsImportacion.cs:66-117`): LAMA/ESD 3000 y sus variantes Cordect, Alcatel y OLI; Softswitch (Tecnored, PIGU); Tecnored Sunsip y Gretix sin archivo, descargados por fechas; BZ; AMB; Alcatel Cler; NEC; CDR genérico; y otros.
  - *Entrantes* (`Importar_ENTRANTES`, `:31-64`): Tecnored, Sunsip, BZ, Gretix, Adtran, Iskratel, AION, Lucent, AMA/OLI. Para "Central Online" no hay entrantes.
  - *Carrier y CPP*: internacionales de carrier modelo TRL (`:3714`) y archivos CPP de operadoras CP4/CP5 (`:3483`, `:3570`).

  Reglas comunes de los lectores:
  - leen la fecha de registro y el lote de la cabecera, o calculan el lote como último lote de la central + 1;
  - anteponen "0" al origen si no lo tiene;
  - asignan la central;
  - según la central, toman segundos y clave del archivo (`IMP_SEGUNDOS`, `IMP_CLAVE`);
  - un error en una fila aborta el archivo con "Error en fila N" (ej. `Importar_LAMA`, `:371-410`).

  Parámetros específicos: el importador Lucent excluye los números listados en el parámetro **2444** (`:1186`). En Telco IP, el parámetro **2346** asigna importe 0 a las llamadas importadas con clave 99 (`:1372`). La planilla de prefijos (`Importar_Prefijos`, `:339-369`) da de alta operadores, servicios y modalidades nuevos (sin distinguir mayúsculas) antes de cargar `CARACTER`.
- Fuera de alcance de esta pasada (sin reglas de tasación o facturación): ABM de red física (`clsRed`), IVR, SMS y WhatsApp (`clsMensaje`, `clsWhatsApp`, gestor, plantillas, `VariablesRegistry`), guía telefónica, informes de llamadas y de telefonía, e importación de conceptos de telefonía móvil (Claro/Personal), cuyo circuito ya está resumido en 8.8.

---

## Reglas adicionales (segunda pasada)

Reglas de métodos de `ReglasNegocio.Tecnica` que no encajan en las secciones anteriores. Las citas son de `ReglasNegocio.Tecnica/clsTecnica.cs`, salvo que se indique otra.

**Materiales, vales y reportes por operación**
- `ObtenerRetiMat` (`:138`, `:153`) devuelve los vales `RETI_MAT` de la orden (`NRO_ORD`). `ObtenerMateriales` (`:171`) devuelve los `MOV_PRO` de operación 3 si es OT o de operación 6 si es OM. `VerificarVales`/`VerificarMateriales` (`:187`, `:192`) solo cuentan registros, para avisar si la orden tiene vales o materiales.
- `Save_PARTICUA`, `Save_PARTIORD`, `Save_TAROTM` y `Save_OT_REPORTE` (`:245`, `:332`, `:363`, `:429`) sincronizan por diferencia (borran lo que ya no está e insertan lo nuevo con max+1). `Existe_OT_REPORTE` (`:404`) impide asignar dos reportes a la misma combinación de servicio + operación.
- `Existen_OrdenesPendientes` (`:469`) busca órdenes sin confirmar, no eliminadas y de la misma operación. `Existe_OrdenesTrabajoPendientes` (`:2287`) considera pendiente toda OT sin `FEC_CONFIR` con estado ≠ 4; la variante por cuenta (`:2292`) excluye también el estado 3.

**Cierre y datos del servicio**
- `Registra_EstadoMedidor` (`:1822`) indica si el cierre debe registrar lectura: sí cuando la operación lo pide (`REG_EST`) y siempre en Alta y Reconexión.
- `EsIgualRecorrido` (`:1499`) compara zona, sector y recorrido, para saber si cambió la ruta de lectura.
- `ActualizarDatosOpcionales` (`:1913`) parte el catastro de la OT por "-" en circunscripción, lote, manzana, parcela, PH y LT, y actualiza teléfono y fax de la persona. `Actualizartelefono` (`:3187`) guarda el teléfono en `FAX`.
- `CargarConsumoAnterior` (`:3685`) busca el consumo del mismo medidor cuyo estado actual coincide con la lectura de la OT, para encadenar lecturas.
- `GetMedidores` (`:2464`) lista medidores desde la tabla de trabajo de importación (`IMP_WORK`); si una fila no tiene medidor usa "sd" + ID.

**Generación de órdenes**
- `Guardar_OT_Descripcion` (`:2061`) **agrega** texto a `DES_SOL`, no lo reemplaza.
- `Guardar_OT` masivo de cambio de estado (`:2299`) crea la nota "Orden de cambio de estado" visible en caja y ejecuta en una transacción nueva.
- `GenerarOrdenAutomatica` (`:2387`) numera con `COD_SOL` + 1, + 2… a partir de la orden de origen, **sin bloqueo**. Si se crean varias órdenes en el mismo lote o desde dos puestos, los números pueden chocar.
- `Save_TECNICA` (`:2594`), orden "especial": numera max+1 con bloqueo, usa el comprobante por defecto de la operación y deja la nota "Orden de Trabajo Especial".
- `GenerarOrden` (`:2891`) crea una OT a partir de una observación de lectura (`OBSESTAD.COD_TRAN`), es decir el lecturista reporta una anomalía y se genera la orden. Numera max+1 **sin bloqueo**.
- `GetGridDataSource_RESOL_OT` (`:2876`) ofrece las resoluciones del servicio más las genéricas (sin servicio).

**Notificaciones y web**
- `CargarUltimaOrden`/`NotificarNuevaOrden` (`:3110`, `:3136`): sondeo periódico. Avisa al usuario cuando otro usuario creó OT pendientes nuevas desde la última consulta.
- `ObtenerDetalleOrden` (`:3156`): ícono de antigüedad de la orden (≤10, 11-20, 21-30, >30 días) y estado en el captor.
- `ObtenerOrdenesDeTrabajoWeb`/`ObtenerOrdenesDeTrabajo`/`ObtenerOTWeb` (`:3204-3330`): consultas para la web. Solo la versión web filtra pendientes.
- `GenerarMensajesNotificacion` (`:3531`) arma el texto de aviso a responsables. En desconexión y reconexión agrega "Retirar/No retirar medidor" o "Medidor instalado/no instalado". El teléfono del socio es el móvil, si no el teléfono y si no el teléfono web. `GenerarMensajeNotificacionPlantilla` (`:3594`) usa la plantilla Trii `generacion_ot`.
- `Get_ServiciosNotificados` (`:3858-3909`): para cada servicio de las cuentas elegidas muestra la última OT de trabajo **pendiente o en proceso** de la operación indicada (número, fecha, estado, estado de servicio a aplicar). Sirve para ver a quién ya se le generó la orden, por ejemplo en cortes masivos.

**Reclamos y obras**
- `Modificar_Asignaciones` de incidentes (`:3983`) y de grupos de obra (`clsGrpObra.cs:98-124`) sincronizan los porcentajes por sección. **No se valida que sumen 100 %.** `Eliminar_GrpObrasyAsignaciones` (`clsGrpObra.cs:126-137`) borra el grupo y sus asignaciones.
- `Get_TRANSAC_RegEst` (`:1990`) da las operaciones que registran estado.
- `TransacReclamo` / `ObtenerEstadoReclamoGuardadoDesdeTecnica` (`:394`, `:399`): una operación es de reclamo según `TRANSAC_RECLAMO`.

**Necesidades de materiales** (`clsTecnica_Necesidad.cs`): una línea nueva registra al usuario solicitante (`:101-115`). La grilla trae, por producto y depósito, las cuatro cantidades con sus usuarios y fechas; la cantidad utilizada es 0 si está vacía (`:125-153`).

**Métodos sin regla de negocio** (lecturas o grillas): `clsTecnica.Get_NIV_CAPA`, `Ge_NIV_REDES`, `Get_COD_CAPA`, `Get_NIV_REDES`, `Get_NIV_SERV`, `Get_Participantes`, `GetGridDataSource_TPTRAB`, `Get_ServiciosTransaccion`, `GetTransacciones`, `Get_OT_REPORTE` (×2), `Get_OT_REPORTE_Servicio`, `Get_OT_REPORTE_Operacion`, `Get_TECNICA`, `Get_TECNICA2`, `Get_Orden`, `Get_Estado`, `GetOrdenMantenimiento_MovPro`, `GetMoviles`, `Get_Conexiones`; `clsFactibilidad.GetFactibilidad` (×2), `Get_FACTIBIL_Persona`, `Get_Factibilidad`, `Get_AuditFactibilidad`; `clsGrpObra.Get_Secciones_GrpObras`; `clsInformes_Tecnica_Redes.Get_Informe` (despachador), `Get_Icons`; `clsSitsa.AltaModificacionCliente`, `BajaCliente`, `BajaContrato`, `AltaModificacionContrato`, `HabilitacionCorteServicio` (envoltorios REST); `clsTecnica_Necesidad.ModificarNecesidad`; `RedGenerica.Get_Componentes_Nodo`, `Get_Servicios`, `Get_REDES_RED_INSTALADA`, `Get_Redes`, `Get_Atributos`, `Get_Atributos_Comprobante`, `Get_ConexionServicio`, `Get_DescripcionConexionServicio` (×2), `Get_ConexionesServicios`, `Get_Servicios_Redes`; `clsTickets.RecargarDatos`, `getTipos`, `getSubTipos`, `getModulos`, `RecargarModulos`, `ObjetoTicketOPT`, `GetTicketReasignar`, `Actualizar_Nota`, `Get_NotaCierre`, `Get_ResponsablesDeCuenta`, `obtenerPresupuesto`, `GetCodigoPresupuesto`, `GetNumeroSocio`, `GetTksDeProyecto`, `GetTksAsignados`, `GetTksReportados`, `GetTks`, `getSocioConSigla`, `getCuentaSocios`, `GetEstadoBase`, `GetDatosTk`, `ActualizarDescripcionNotaAlSoltar`, `GetContactos`, `GetContactoFromMail`, `GetNotaVacia`, `AgregarNota`, `AnotarEnTicket`, `GenerarItem_Bonificacion`, `Get_Ticket_Tomado`, `ObtenerTicketTomado`, `ValidarTkTomadoPausado`, `TieneAsingada_FechasEstimadas`; `clsTickets_Administracion.GetUsers`; `clsTickets_Asignacion.Informacion_Asignacion`; `clsTickets_Cuentas.GetDetalleCuentas`, `Get_Responsable`; `clsInformes_Tickets.GetDetalleDeNotas_Usuarios`, `GetDetalleDeNotas_Facturas`, `GetOperaciones_Usuarios`, `GetTksDevueltosValidacion`, `Get_ControlTickets_Periodo`, `GetListados`.

---

## 9. Parámetros `Nucleo.Busca_V2_*(N)` relacionados

Significado inferido del uso; "?" = a confirmar con la tabla de parámetros.

| N | Tipo | Significado | Uso |
|---|---|---|---|
| 18 | int | Servicio de telefonía para detalle de llamadas | `clsInformes_Llamadas.cs:168,1377` |
| 19 | int | Concepto (producto) de llamadas CPP / consumo telefónico | `clsCVLP.cs:451`, `clsInformes_Llamadas.cs:963` |
| 24 | int | Concepto de llamadas internacionales | `clsInformes_Llamadas.cs:828` |
| 62 | bool | Tasar internacionales (INTERNAC con cotización) | `clsTelefonia.cs:1763` |
| 64 | decimal | Consumo mínimo por llamada | `clsTelefonia.cs:1766` |
| 65 | int | Día/regla de próxima facturación (cargos de técnica) | `clsTecnica.cs:2861` |
| 70 | int | Concepto comisión 1 de CVLP | `clsCVLP.cs:282,287` |
| 79 | bool | Comisiones CVLP como Nota de Débito (vs Factura) | `clsCVLP.cs:277` |
| 82 | int | Servicio "central virtual" (llamadas internas gratis) | `clsTelefonia.cs:1702` |
| 180 | char | Nombre del reporte de impresión de OT | `clsInformes_Tecnica.cs:2324` |
| 236 | bool | Telefonía prepaga habilitada | `clsTelefonia.cs:1764,2317` |
| 238 | int | Operación de OT para recarga prepaga | `clsTelefonia.cs:991` |
| 332 | int | Servicio prepago | `clsTelefonia.cs:1762,2316` |
| 344 | int | Tipo de numeración única de OT (`TipoNumeracionUnica`) | `clsTecnica.cs:2443` |
| 353 | int | Concepto comisiones 2 y 3 de CVLP | `clsCVLP.cs:320-352` |
| 358 | bool | Mapa (Google Static) en impresión de OT | `clsInformes_Tecnica.cs:1800,2184` |
| 471 | bool | No aplicar consumo mínimo a locales/urbanas | `clsTelefonia.cs:1765` |
| 518/519 | char | Identificación del cliente Procoop (gateway SMS/WhatsApp) | `clsMensaje.cs:148`, `clsWhatsApp.cs:107` |
| 543 | int | Código de impuesto IVA para ítems CVLP | `clsCVLP.cs:189` |
| 681 | fecha | Fecha del último envío de recordatorios de actividades ("Fecha de Ultimo envio de Mails", `clsVariables.cs:980`; corregido en segunda pasada: es tipo fecha) | `clsSeguimiento.cs:37,79` |
| 2253 | int | Servicio "pack" de telefonía móvil | `clsTelefoniaMovil.cs:961,1077` |
| 2295 | int | Operador por defecto en importación CPP | `clsImportacion.cs:3638` |
| 2301 | bool | Permitir reconexión con titular fallecido | `clsTecnica.cs:2969` |
| 2302 | bool | Validar llamadas duplicadas al importar | `clsImportacion.cs:125,182,247` |
| 2330 | int | Operación técnica de cambio de categoría | `clsTecnica.cs:992,1421,2654`, `clsSitsa.cs:181` |
| 2339 | bool | Copiar observación del servicio a la OT | `clsTecnica.cs:2080` |
| 2346 | bool | Asignar importe 0 a las llamadas Telco IP importadas con clave 99 (`clsVariables.cs:1403`) | `clsImportacion.cs:1372` |
| 2399 | bool | Al retirar medidor, limpiar número y matrícula | `clsTecnica.cs:1367,1414` |
| 2444 | char | Números telefónicos a excluir en el importador Lucent, separados por coma (`clsVariables.cs:1404`) | `clsImportacion.cs:1186` |
| 2483 | bool | Generar descuento/débito proporcional por reconexión | `clsTecnica.cs:1605` |
| 2485 | int | Concepto del descuento por reconexión | `clsTecnica.cs:1613,1635` |
| 2488 | decimal | Valor hora para bonificación de tickets | `clsTickets.cs:3145` |
| 210 | char | Reporte del presupuesto adjunto al mail de tickets | `clsTickets.cs:2797` |
| 2722/2723 | decimal | Importe de hora normal / hora extra (informe de recursos por obra; el informe puede sobrescribirlos) | `clsInformes_Tecnica.cs:1088-1098,1262-1275` |
| 2570 | int | Concepto del proporcional por cambio de categoría | `clsTecnica.cs:1529,1535` |
| 2587 | bool | No generar proporcional negativo | `clsTecnica.cs:1586` |
| 2625 | bool | Proporcional como comprobante inmediato (vs `PRCAGAS`) | `clsTecnica.cs:1711` |
| 2655 | bool | Permitir OT sobre servicio pendiente de conectar | `clsTecnica.cs:2929` |
| 2661 | bool | Reconexión: débito por días restantes si el período no se facturó | `clsTecnica.cs:1650` |
| 2693 | bool | Envío de SMS habilitado | `clsTecnica.cs:3470`, `clsMensaje.cs:229` |
| 2753 | bool | Eliminar OT de alta deja servicio "No vigente" (facturar baja) | `clsTecnica.cs:517,635` |
| 2755 | int | Día tope del mes para proporcional por cambio de categoría (0 = sin tope) | `clsTecnica.cs:1427` |
| 2808 | bool | No pasar la OT a "En proceso" al imprimir | `clsInformes_Tecnica.cs:710` |
| 2819 | bool | Incluir vales en materiales impresos | `clsInformes_Tecnica.cs:656` |
| 2823 | char | Código de distribuidora (RTI OCEBA) | `SALD.cs:339` |
| 2933 | enum | Selección de exportador GIS (`GIS.Coop`) | `clsVariables.cs:732` |
| 2824/3051/3121 | int/bool | Selección de teléfono destino de WhatsApp | `clsPlantillasWhatsApp.cs:133-150` |
| 2870/2873/2874 | char | Trii WhatsApp: token, host, canal | `clsWhatsApp.cs:82,231,122` |
| 2907 | bool | "Permitir cerrar órdenes sin generar comprobantes por reconexión" (`clsVariables.cs:730`): habilita la opción de cerrar sin generar el comprobante (pregunta Sí/No/Cancelar) | `clsTecnica.cs:1675` |
| 2913 | bool | "Enviar automáticamente las órdenes creadas a la base MySQL" (`clsVariables.cs:731`), es decir al captor/app móvil | `clsTecnica.cs:2734` |
| 2998 | bool | Numeración de reclamos por servicio | `clsTecnica.cs:2437` |
| 3031 | bool | Número de reclamo por servicio en informe | `clsInformes_Tecnica.cs:767` |
| 3034/3035 | char | SITSA: URL y API key | `clsSitsa.cs:152,155` |
| 3088 | int | Canal de notificación a responsables (0 WhatsApp, 1 mail, 2 SMS) | `clsTecnica.cs:3630` |
| 3105 | bool | WhatsApp oficial con plantillas | `clsTecnica.cs:3416,3458` |
| 3111 | bool | Período en proporcional de cambio de categoría (servicios vencidos) | `clsTecnica.cs:1592` |

---

## 10. Implicancias para GoodApps

1. **Separar "orden" de "reclamo" y de "mantenimiento"** con un modelo común (`WorkOrder` con `kind`: trabajo sobre servicio / mantenimiento sobre activo/obra / reclamo) pero con enums únicos y coherentes. Unificar estados (Pendiente, Asignada, En curso, Cerrada, Anulada) y **no mezclar "cerrada" con "confirmada"**; si se necesita doble paso (ejecución en campo vs. validación administrativa), modelarlo explícitamente.
2. **Catálogo de operaciones con efectos declarativos**: en Procoop los efectos de Alta/Baja/Reconexión/etc. están cableados por código (1..8) y por parámetros (2330, 238). En GoodApps conviene un catálogo `operation_type` con un "efecto" tipado (conectar, desconectar, cambiar medidor, cambiar categoría, cambiar estado, ninguno) + flags (modifica matrícula, nota en caja, notifica al socio en creación/cierre, estado de servicio resultante).
3. **Órdenes encadenadas** (ALTASEAU) como reglas de workflow: "al crear OT X en servicio S con condiciones C, crear OT Y", con dependencia de cierre (origen primero / destino primero). Es una necesidad real (p.ej. alta de energía ⇒ alta de alumbrado/sepelio).
4. **Cargos por OT** (`CONEXION`): mantener el concepto "cargo antes / después de ejecutar" con reglas de aplicabilidad (servicio, categoría, operación, moroso, prepago, localidad, solo reclamo) y emisión a "próxima factura" o cobro inmediato. Los **proporcionales** (cambio de categoría, reconexión) deben ser una función de dominio de Facturación invocada por Técnica, no lógica dentro del módulo técnico.
5. **Materiales con entidad propia** (`work_order_material`) que genere los movimientos de stock, en lugar de inferirlos por `NUM_COM = COD_SOL`. Incluir el circuito solicitado→autorizado→retirado→utilizado (necesidades) y la reversa de stock al anular. Decidir explícitamente si los materiales se facturan al socio (Procoop no lo hace automáticamente).
6. **SLA y prioridad nativos** para reclamos (inexistentes en Procoop): prioridad, tiempo objetivo por tipo de incidente, vencimiento, alertas, y métricas de resolución y reincidencia; mantener tipificación (incidente, resolución, sección de red con % de asignación) por exigencia de los entes reguladores (OCEBA/ENRE y equivalentes provinciales: interrupciones, calidad de servicio).
7. **Asignación y movilidad**: cuadrillas, integrantes, vehículos, responsables con depósito propio, reglas de notificación por horario/feriado; la app de campo debe capturar GPS, materiales, conformidad del socio y fotos. Prever un **bloqueo por sistema externo** (como `BLOQUEAR`) para evitar doble cierre.
8. **Integraciones de corte remoto** detrás de una interfaz única (`RemoteDisconnectProvider`: conectar, desconectar, cambiar medidor, cambiar plan, cargar crédito), con modo asincrónico y reintentos; en Procoop hay ~30 sistemas y un error del sistema externo aborta el cierre de la OT.
9. **Red/GIS**: adoptar directamente el modelo de **red genérica v2** (componentes tipados, relaciones permitidas, nodos instalados con atributos tipados e historial de conexión del servicio) sobre PostGIS, con capas y geometrías reales (no solo puntos lat/lon como strings con coma decimal). Exportar GeoJSON/KML. Las exportaciones por cooperativa (RTI OCEBA, archivos para GIS externos) deben ser **plantillas configurables**, no clases por cliente con códigos de categoría hardcodeados.
10. **Telefonía**: es un submódulo grande y especializado (35 formatos de CDR, tasación por bandas/fracciones escalonadas, descuentos, CPP/CVLP, reventa móvil con clearing). Recomendación: (a) definir si GoodApps lo cubre en el MVP; (b) si sí, separar **mediación** (parsers de CDR como plugins) de **rating** (motor de tasación declarativo) y de **billing** (agrupación en consumos); (c) usar el plan de numeración ENACOM con búsqueda por prefijo más largo (índice trie o `LIKE` con índice invertido), no stored procedures creados en runtime.
11. **CVLP/CPP**: modelar "venta por cuenta de terceros" como capacidad genérica de Facturación (también sirve para cobranzas de terceros, sepelio, etc.), con liquidación por cobrado o por facturado, comisiones y control de no doble liquidación (`ID_FAC` en el detalle).
12. **Tickets**: el módulo de Procoop es la **mesa de ayuda del proveedor** (soporte y horas facturables), no atención a usuarios. Para GoodApps hay dos necesidades distintas: (a) **atención al usuario/socio** (omnicanal: mostrador, teléfono, web, WhatsApp) que derive en reclamos/OT; (b) soporte interno SaaS (probablemente herramienta externa). No migrar `TICKETS` como si fuera atención al socio.
13. **Actividades internas**: simple y útil (tareas recurrentes con márgenes y recordatorios); implementarlo como "tareas programadas" del core con calendario y notificaciones.
14. **Parámetros**: más de 50 parámetros numéricos afectan este dominio; en GoodApps deben ser configuración tipada por tenant con nombre y documentación, agrupada por módulo.
15. **Seguridad/calidad a no replicar**: SQL armado por concatenación (`UpdateFrom`, `DeleteFrom`, `ExecuteCommand` con listas), PK por max+1, credenciales de acceso remoto en claro (`TICKETS_CONTACTOS.CLAVE`), diálogos de UI (`MessageBox`/`Preguntar`) dentro de reglas de negocio, y producto 464 hardcodeado.

---

## 11. Dudas abiertas

1. **Estados de OT**: ¿qué significa realmente `COD_EST = 2` en la base de cada cooperativa? El enum dice "En proceso" pero el DTO web lo muestra como "Cerrada". Verificar con datos reales y con CoopOnline.
2. ¿Qué es `TIP_INCI = 1`? Solo se ven 2 (trabajo) y 3 (mantenimiento). ¿Existen registros históricos con 1?
3. **Tabla `RECLAMOS` / `RECLAMOS_NOTAS`**: ¿qué módulo la usa (CoopOnline web, Mesa de Entradas)? ¿Genera OT en `TECNICA` o es un circuito paralelo?
4. **Facturación de materiales**: ¿las cooperativas cobran al socio los materiales usados en una OT (p.ej. conexión nueva)? En el código técnico solo se cobran conceptos `CONEXION`. ¿Se hace vía presupuesto (`PRESUPU`) o factura manual?
5. **SLA regulatorio**: ¿qué informes de calidad de servicio (interrupciones, tiempos de reposición) exige OCEBA/otros entes y de dónde salen hoy? No se encontraron en estos namespaces.
6. `CTSECCION` / `CAT_INCI_CTSEC.POR_ASIGNACION`: ¿son secciones de red, centros de costo contables o ambos? ¿Se usa para imputar costos de reclamos?
7. Red v1 (`NIV_*`) vs. v2 (`REDES*`): ¿cuántas cooperativas usan cada una? ¿Alguna tiene cargados transformadores/alimentadores con coordenadas reales?
8. Exportaciones GIS por cooperativa: ¿a qué sistema GIS externo van (proveedor) y siguen vigentes? ¿El RTI de OCEBA se genera solo para Saldungaray?
9. **Interconexión**: ¿cómo liquidan las cooperativas telefónicas los cargos de interconexión con otros operadores? ¿Qué significan `NET_COO`/`SUB_COO`? ¿Se usa `ENTRANTE` para liquidar terminación?
10. CPP: ¿qué operadores siguen enviando archivos (CP2 Nextel ya no existe)? ¿La CVLP "según cobranzas" es la modalidad mayoritaria?
11. ~~Parámetros **2346** y **2444** (importadores): significado exacto.~~ Resuelto en segunda pasada con `clsVariables.cs:1403-1404` (ver §9).
12. Telefonía móvil (Claro/Personal): ¿sigue vigente la reventa? ¿Cuántas cooperativas la usan?
13. Tickets: ¿alguna cooperativa usa el módulo de tickets para atención a socios, o es exclusivo del proveedor? (El uso de horas bonificadas y producto 464 sugiere exclusivo del proveedor.)
14. ¿Cuál es el alcance de telefonía en el MVP de GoodApps (fija con central propia, VoIP, solo reventa)? Define si se migran tarifas `TARTEL/TARESP/TARCLA/BANDAS/PLANDES`.
15. Integraciones de corte (Discar, SITSA, MikroTik, AION, etc.): ¿cuáles están activas en las cooperativas objetivo de la primera ola de migración?
