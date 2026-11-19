# Reglas de negocio de Procoop extraídas del código

Documentos generados a partir del código C# descompilado de Procoop 10.4.6.722 (`binarios/decompilado/`). Cada documento describe las reglas en prosa y cita la clase, el método y el archivo:línea de donde salen, para poder verificarlas.

Complementan al relevamiento funcional por pantallas ([`../README.md`](../README.md)) y a la [definición funcional del alcance](../definicion-funcional-alcance.md).

**[VERIFICAR]** marca las reglas cuyo comportamiento depende de datos o parámetros que solo se confirman en la base de la cooperativa.

## Documentos

| # | Documento | Tema |
|---|---|---|
| 01 | [Cálculo de la factura de servicios](01-calculo-factura-servicios.md) | Cargo fijo, tramos, prorrateo, demanda, factor de potencia, lenguaje de fórmulas de cargos adicionales, cuadros tarifarios, impuestos, redondeo |
| 02 | [Facturación masiva y comprobantes](02-facturacion-masiva-y-comprobantes.md) | Proceso mensual, numeración, vencimientos, anulación, recategorización, retroactivos, impresión y código de barras |
| 03 | [ARCA, facturación electrónica e IVA](03-afip-facturacion-electronica-e-iva.md) | WSAA, CAE/CAEA, mapeo a códigos ARCA, padrón, libro IVA |
| 04 | [Mora, intereses y corte](04-mora-intereses-y-corte.md) | Intereses, instancias de mora, corte y reconexión, planes de pago |
| 05 | [Cobranzas, cajas y entes recaudadores](05-cobranzas-cajas-y-entes-recaudadores.md) | Caja, anulaciones, imputación, Red Link, SIRO, débitos, prepaga |
| 06 | [Titulares, servicios, medidores y consumos](06-titulares-servicios-medidores-y-consumos.md) | Altas y bajas, medidores, lecturas, validación de consumos, telemedición |
| 07 | [Técnica, reclamos, GIS y telefonía](07-tecnica-reclamos-gis-y-telefonia.md) | Órdenes de trabajo, reclamos, red, tickets, tarificación telefónica |
| 08 | [Tesorería, contabilidad, compras, stock y sueldos](08-tesoreria-contabilidad-compras-stock-sueldos.md) | Back-office administrativo |
| 09 | [Parámetros y configuración](09-parametros-y-configuracion.md) | Catálogo de 1.536 parámetros `Busca_V2_*`, seguridad, arquitectura |
| 10 | [Integraciones externas](10-integraciones-externas.md) | Portal CoopOnline, agente, mail, SMS, app, entes reguladores |
| 11 | [Específicas de Laguna Larga](11-especificas-laguna-larga.md) | Importador Red Link propio, código de barras SIRO, ramas de código para LAG, consultas para confirmar en la base |
| 12 | [Configuración real de Laguna Larga](12-configuracion-real-laguna-larga.md) | Sigla, entes recaudadores, pasarelas y parámetros leídos de la base demo |
| 13 | [Pasarelas de pago e Interbanking](13-pasarelas-de-pago-e-interbanking.md) | Pagos360, SIRO, MercadoPago, Macro y otras; webhooks, conciliación, Interbanking |

## Cobertura del código

Medida al 4/11/2026, después de la segunda pasada. Un método cuenta como documentado si su nombre aparece en algún documento, ya sea con su regla o en una línea "Métodos sin regla de negocio" (revisado, sin lógica). Es una medida aproximada: un nombre común puede coincidir por casualidad, y un método descrito con otras palabras no se cuenta. Antes de la segunda pasada, Facturación estaba en 40 %, Cobranzas en 48 %, Titulares/Servicios/Consumos en 22 %, Tesorería y Contabilidad en 35 % y el portal en 19 % de métodos.

| Área | Archivos citados | Métodos documentados |
|---|---|---|
| Facturación (cálculo, masiva, archivos, códigos de barra genéricos) | 80/102 (78 %) | 796/1007 (79 %) |
| ARCA (WSAA, WSFEv1, padrones) | 22/128 (17 %) | 44/88 (50 %) |
| Cobranzas, mora y financiación | 39/42 (92 %) | 509/521 (97 %) |
| Titulares, servicios y consumos | 39/74 (52 %) | 464/728 (63 %) |
| Telemedición y app móvil | 39/49 (79 %) | 304/505 (60 %) |
| Técnica, GIS, tickets y actividades | 51/61 (83 %) | 300/358 (83 %) |
| Telefonía | 13/33 (39 %) | 72/238 (30 %) |
| Tesorería y contabilidad | 18/23 (78 %) | 269/289 (93 %) |
| Compras, stock, fabricación y sueldos | 30/31 (96 %) | 339/616 (55 %) |
| Núcleo, configuración, plantillas y tablero | 62/136 (45 %) | 250/980 (25 %) |
| Portal CoopOnline, mails, agente y varios | 25/41 (60 %) | 203/207 (98 %) |
| Formularios de `Configuracion` | 67/311 (21 %) | 56/328 (17 %) |
| `ProcoopNet` (ejecutable) | 9/16 (56 %) | 11/37 (29 %) |
| `ProMod_WebService` (solo clases de servicio) | 26/26 (100 %) | 50/61 (81 %) |
| Entes por cooperativa (`Cobranzas.Entidades.*`) | 375/431 (87 %) | 895/909 (98 %) |
| Códigos de barra por cooperativa | 9/91 (9 %) | 464/464 (100 %) |

## Qué quedó afuera y por qué

**Excluido a propósito:**
- **Interfaces de cobranza y códigos de barras de otras cooperativas.** Solo se describe el patrón común; lo de Laguna Larga está en el documento 11. Su cobertura alta de métodos es engañosa: los nombres coinciden con los del patrón genérico.
- **Clases proxy del WSDL de ARCA** (`WSFEV1`, 107 archivos). Solo se documentan las operaciones y campos que Procoop usa realmente; por eso los archivos citados son 17 %.
- **SDK de MercadoPago, Request/Response de `ProMod_WebService`, Interop de Office, PortableDevice y GoogleEarth.** Son contratos de API o librerías, no reglas.
- **Telefonía fuera de tasación y facturación:** red física, IVR, SMS/WhatsApp, guía e informes de llamadas.

**Pendiente: la segunda pasada se cortó** el 4/11/2026 porque la cuenta de Cursor tiene una factura impaga. Lo que los agentes alcanzaron a escribir quedó guardado. Falta:
- **09 — reglas en formularios de `Configuracion` y `ProcoopNet`, plantillas y tablero** (prioridad B). No llegó a editar el documento. Por eso esas áreas siguen bajas: formularios en 17 %, núcleo en 25 %.
- **02 — facturación masiva:** avanzó de 768 a 926 líneas sin terminar la lista de métodos.
- **04 — validaciones de las pantallas de mora, tasas y planes** en `ProMod_GestionMora` y `ProMod_Cobranzas`. Ya están descompiladas, pero no se revisaron.
- **06 — telemedición y app móvil** método por método. Quedan las reglas por familia de proveedor de la primera pasada.
- **08 y 10:** avanzaron (08 de 639 a 1.074 líneas, 10 de 208 a 493) sin el resumen final de cada agente.
- **Titulares:** informes y exportaciones revisados solo por muestreo (`clsViviendas`, `clsWEB`, `clsCirculares`, `clsEvolucionDeuda`, `clsPadronTitular`).

**Fuera del código:** las funciones `FORMULA_CARGO*` y otros procedimientos almacenados viven en la base de cada cooperativa. Para Laguna Larga hay que leerlos en `PR_LAG_DEMO`.

El código de Procoop es de terceros: estos documentos solo describen reglas y no deben incluir copias del código fuente. No se suben a ningún repositorio.
