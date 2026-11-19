# Configuración real de Laguna Larga en Procoop

Lectura de solo consulta (`SELECT`) de la base `PR_LAG_DEMO` en la PC demo, hecha el 3/11/2026. Confirma qué ramas del código de Procoop aplican a la Cooperativa Eléctrica Laguna Larga. Complementa a [05 - Cobranzas y entes recaudadores](05-cobranzas-cajas-y-entes-recaudadores.md) (sección 9) y a [09 - Parámetros](09-parametros-y-configuracion.md).

**Advertencia:** `PR_LAG_DEMO` es la base de demostración. Por sus datos (pagos hasta agosto de 2026) parece una copia de producción, pero la configuración actual puede diferir y hay que validarla con la cooperativa antes de migrar. Contiene datos personales reales.

## 1. Sigla de la cooperativa

El parámetro **2264 vale `LAG`**. Consecuencias en el código:

- Aplica la rama exclusiva de Laguna Larga del exportador SIRO, que antepone un "0" al convenio en el código de barras (`PR/E_SIRO.cs:134`).
- Aplica la marca `esLAG` de los informes ENARGAS (`clsEnargas2.cs:1402`): la cooperativa factura gas.
- **No** aplican las ramas `"LAGU"` (`PR/RedLink_1.cs:38-97`) ni `"FAL"`. Esto cierra la duda abierta del documento 05: el prefijo `FAL_` del enum del importador es solo un nombre heredado.

## 2. Entes recaudadores (tabla `BANCOS`)

La base tiene 3 entes:

| Campo | RED LINK | SIRO | DOCUMENTOS A COBRAR |
|---|---|---|---|
| `COD_BAN` | 1 | 2 | 3 |
| `CONVENIO` | D67 | 5150071619 | (vacío) |
| `COD_ARC`: importador de la rendición | **264** `FAL_RedLink`, el propio de LAG (`Entidades.LAG/Red_Link.cs`) | **271** `PR_SIRO_Int`, "Banco Roela (SIRO) - Integrado" (clase `Siro_Integrado`, por API) | 0 (ninguno) |
| `COD_ARC2`: exportador de la deuda | **159** `PR_LINK_08` (clase `E_RedLink_19_10`, "Identificador 10 de 19 dígitos") | **140** `PR_SIRO` (clase `E_SIRO`) | 0 (ninguno) |
| `ARC_CONFIG`: forma de identificar el comprobante | 0 (por defecto) | 0 (por defecto) | 0 |
| `CAJA`: caja virtual | 101 | 102 | 300 |
| `COD_BANT`: cuenta bancaria de acreditación | 2 | 5 | 13 |
| `DIFERIR` | 1: difiere solo la mora y cobra el recargo entre vencimientos | 1 | 0 |
| `PERFUETER` + `FUETERBAN` | True + 5: **acepta pagos sin límite de vencimiento** | True + 5 | True + 5 |
| `PERMITE_ENTREGA`: pagos parciales | No | No | No |
| `COBVTO1` | No | No | No |
| `RECARGO3VTO`: cobra mora pasado el último vencimiento | Sí | Sí | No |
| `CONCILIACION_AUTO` | No | No | No |
| Comisión (`TRASLADAR`, `FORMA_CAL`, `IMPO_*`) | Sin comisión | Sin comisión | Sin comisión |

Sobre `FUETERBAN = 5`: en `Importador_Base.cs:1823` y `:1959`, con `PERFUETER` activo, los valores 0 a 4 eligen el vencimiento máximo aceptado. Cualquier otro valor toma `DateTime.MaxValue`, es decir que no hay tope.

**Lectura:**

- **Red Link**:
  - La rendición se identifica por cuenta, servicio e importe; es el importador propio documentado en el doc 05, sección 9.2.
  - El envío de deuda usa el formato genérico de 19 dígitos con identificador de 10.
  - El convenio (código de ente) es `D67`.
- **SIRO**:
  - El envío se hace por archivo (`E_SIRO`, con la rama LAG del "0").
  - La rendición está configurada con el importador **integrado por API**. Sin embargo, el parámetro 2807 ("Utiliza el servicio de SIRO - API Gestión") vale 0, así que hay que confirmar si la API está realmente operativa o si se rinde por archivo.
- **DOCUMENTOS A COBRAR** no tiene importador ni exportador. Es un "ente" usado como caja o cartera (caja 300) para documentos o cheques, sin interfaz de archivos, como se suponía.
- Ningún ente admite pagos parciales. Todos aceptan pagos fuera de término sin límite y aplican el recargo que corresponda.

## 3. Pasarelas de pago online

Esta sección cruza el [documento 13](13-pasarelas-de-pago-e-interbanking.md) con la base. Los valores de las credenciales no se leyeron; solo se verificó si cada parámetro tiene contenido, por el largo del texto.

**Credenciales cargadas.** Solo SIRO tiene datos:

- Usuario y clave del botón de pago: parámetros 2492 y 2493.
- CUIT y clave de la API de gestión: parámetros 2804 y 2805.

Están **vacías** las de Pagos360 (901, 2922), MercadoPago (2553), NaranjaX (2756), Macro (2765), PayFun (2793), Pagos TIC (2877), SiPago (2956), ProntoPago (2969), ProvinciaNet (3046) y Helipagos (3077). La tabla `INTERBANKING` está vacía, así que **Interbanking no se usa**.

**Solicitudes de pago (tabla `PAGOS360`).** Hay 128.776 solicitudes, todas con API 1 (SIRO). Van desde el 18/07/2023 hasta el 06/08/2026, lo que indica que la base demo es una copia de producción de agosto de 2026 y que **sus datos son reales**.

Por tipo de solicitud (enum `EntidadDigital.Tipo`):

| Tipo | Solicitudes | Imputadas | Registradas sin pago | Pendientes | Rechazadas |
|---|---|---|---|---|---|
| 7 – Prepaga CoopOnline (energía prepaga desde el portal o la app) | 89.842 | 52.899 | 35.400 | 1.236 | 306 |
| 9 – Cobranza CoopOnline (facturas pagadas desde el portal o la app) | 38.322 | 23.776 | 13.942 | 479 | 124 |
| 6 – Web | 612 | 612 | 0 | 0 | 0 |

Además, hay una solicitud en estado "Pagado" sin imputar en cada uno de los tipos 7 y 9. Ninguna solicitud tiene QR.

**Lectura:**

- La única pasarela online de Laguna Larga es el **botón de pago SIRO**, usado desde CoopOnline.
- Casi 7 de cada 10 solicitudes son de **energía prepaga**, así que la cooperativa tiene medidores prepagos en uso. Esto hay que tenerlo en cuenta en el alcance del piloto.
- Cerca del 38 % de las solicitudes queda "Registrada" sin pago: son links generados que el usuario no pagó. GoodApps debería vencerlas o limpiarlas.
- Están cargadas las credenciales de la API de gestión de SIRO, pero el parámetro 2807 que la activa vale 0. Probablemente se configuró y nunca se activó, o se desactivó.

## 4. Parámetros relevantes

| Parámetro | Valor | Significado (catálogo del doc 09) |
|---|---|---|
| 2264 | `LAG` | Sigla de la cooperativa |
| 2085 | 10.4.6.722 | Versión de la capa de datos |
| 518 | COOPERATIVA ELECTRICA LAGUNA L… | Razón social |
| 74 | 1 ("Variable Porcentaje") | Tipo de recargo por pago fuera de término en la factura |
| 1011 | 3 | Diferir **todos** los intereses a la próxima factura |
| 273 | No | Los intereses se emiten como nota de débito, no como factura |
| 600 | 0,1 | Recargo diario en caja (tasa diaria fija) |
| 609 | 0 | Sin interés mínimo en caja |
| 606 / 307 | 1 | Concepto de "INTERES POR MORA" (código de producto 1) |
| 719 | 9 | Concepto de "COBRANZA REMOTA" |
| 2292 | 1 (Estándar) | Variante estándar del cálculo de intereses de facturas impagas |
| 2202 | 1 (CANDIDATOS) | Instancia inicial de la gestión de mora |
| 321, 324, 375, 462 | No | No exige cobrar primero las facturas más antiguas ni la deuda notificada completa |
| 2263 | Sí | Permite facturas en cuotas |
| 727 | Sí | La venta y la cobranza esperan la autorización de ARCA |
| 2712 | 5000 | Máximo de comprobantes por lote de facturación electrónica |
| 2515 | 3.958.316 | Importe desde el cual se emite Factura de Crédito MiPyME |
| 2315 | 50 | Cuentas por grupo en la facturación masiva |
| 2807 | No | No usa la API de gestión de SIRO |
| 3094 | 0 | Sin concepto de anticipo por energía inyectada: **no hay prosumidores configurados** |

## 5. Implicancias para GoodApps

- La migración de la cobranza de Laguna Larga necesita, como mínimo:
  - el formato Red Link de envío (19/10);
  - el importador Red Link propio, con identificación por cuenta, servicio e importe;
  - el exportador SIRO con el "0" antepuesto al convenio;
  - la rendición SIRO, por API o por archivo según se confirme.
- Hay que soportar pagos fuera de término sin tope, recargo por mora pasado el último vencimiento y diferimiento de todos los intereses a la próxima factura (parámetro 1011 = 3).
- No hacen falta pagos parciales en entes ni comisiones trasladadas al usuario.
- Las cuotas (2263) y la espera de CAE en caja (727) sí están activas.
- **Pasarelas:** para el piloto alcanza con el botón de pago SIRO, que cubre la cobranza de facturas y la recarga de energía prepaga desde el portal y la app. Pagos360, MercadoPago, las demás pasarelas e Interbanking no son necesarios para LAG.
- **Energía prepaga:** es el uso principal del pago online, así que el portal y la app de GoodApps deben soportarla desde el inicio.

## 6. Dudas abiertas

- Confirmar si la configuración de producción coincide con esta base demo.
- SIRO: importador 271 por API con el parámetro 2807 en 0. ¿Cómo rinde hoy realmente la cooperativa?
- Tasa diaria de 0,1 % (parámetro 600): confirmar si es la tasa vigente o un valor de prueba.
- Energía prepaga: ¿qué sistema de medidores prepagos usa Laguna Larga y cómo se integra con Procoop al acreditar una recarga?
- Hay 2 solicitudes "Pagado" sin imputar: ¿es un caso normal o quedaron colgadas?
- Sin prosumidores configurados (3094 = 0): confirmar si Laguna Larga tiene usuarios con generación distribuida.
