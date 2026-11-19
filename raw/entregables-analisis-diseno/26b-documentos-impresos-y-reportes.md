# GoodApps Cooperativas

## Parte B — Documentos impresos y catálogo de reportes

**Entregable de Análisis y Diseño Detallado — Artefacto 4.7 (Diseño de reportes y documentos impresos)**

| Dato | Valor |
|---|---|
| Documento | Parte B del entregable de mensajes y documentos impresos: maquetas de documentos impresos con zonas y origen de cada campo (sección 4) y catálogo de reportes con filtros, columnas y destinatario (sección 5) |
| Portada | [`26-mensajes-y-documentos-impresos.md`](26-mensajes-y-documentos-impresos.md) (convenciones C-32 a C-39 de documentos, conteos y observaciones) |
| Parte A | [`26a-catalogo-mensajes-y-plantillas.md`](26a-catalogo-mensajes-y-plantillas.md) (mensajes de sistema y plantillas de comunicación) |
| Artefacto | 4.7 del índice `00-INDICE.md` |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Fuentes | T11 §5.12 a §5.14 y §18.4 a §18.5 (motor de documentos, plantillas semilla, perfiles de firma; DEC-080); T04 RF-CFG-134 a 137 (entidades jurídicas; DEC-064, DEC-087); M05 §5.16 a §5.19 y §7.3, §7.7, §7.8 (comprobante, representación, códigos de pago, talones, distribución); M06 RF-FIS-008, 012, 061, 062, 090, 112 a 116, 161, 167; M07 §7.8, §7.12, §7.29, RF-COB-086 a 090 y 193; M08 RF-MOR-086 a 091; M03 RF-MED-115 a 121; M16 RF-SUE-104 a 106; T09 RF-COM-146; T10 §7.1, §15.1 a §15.4 y §15.7 |

Todos los datos de los ejemplos son ficticios (ver "Datos de ejemplo" en la portada). Los importes de las maquetas son ilustrativos: no reproducen tarifas, alícuotas ni tributos reales.

---

## 4. Documentos impresos

### 4.1 Convenciones de maqueta

Cada documento se dibuja como un bloque de texto en un ancho fijo que representa la hoja (A4 vertical o ticket de 80 mm). Las **zonas** son siempre las mismas y se identifican a la izquierda de la maqueta:

| Zona | Nombre | Contenido | Editable por el tenant |
|---|---|---|---|
| Z1 | Encabezado del emisor | Logo, razón social, nombre de fantasía, domicilio legal y contacto de la **entidad jurídica emisora** (sección 4.2) | Logo por variante de marca de la entidad y contacto (OBS-14) |
| Z2 | Datos fiscales del comprobante | Letra y código ARCA, denominación protegida, punto de venta y número, fecha, CUIT, IIBB, inicio de actividades, condición IVA | No (C-36) |
| Z3 | Receptor | Titular, documento, condición IVA, cuenta, domicilio de servicio y postal | No |
| Z4 | Detalle | Bloques por servicio, lecturas, renglones, imputaciones o conceptos según el documento | Orden de renglones (RF-FAC-136) |
| Z5 | Totales | Subtotales, tributos, total, vencimientos, importe en letras cuando corresponde | No |
| Z6 | Código de barras y QR | Códigos de pago (formato declarativo de M05), QR fiscal (RG 4892) o QR de verificación pública (T11) | No |
| Z7 | Pie legal y mensajes | Leyendas protegidas, CAE y vencimiento, mensajes impresos de T09 (`print_invoice`), página, hash de verificación | Solo mensajes y pie no fiscal |

Notación de origen de campo: `colección.campo (módulo)`, por ejemplo `invoices.fiscal.cae (M05, escrito por M06)`. Los campos que vienen de la entidad jurídica se escriben `legalEntities.campo (T04)` con los nombres de T04 §7.14. Las marcas de agua (BORRADOR, ANULADO, COPIA, SIMULACIÓN, DUPLICADO) se aplican según C-33 y no se repiten en cada maqueta. Cada PDF emitido guarda hash SHA-256, versión de plantilla y versión de diccionario (C-24, C-32).

### 4.2 Encabezado por entidad jurídica

Un tenant puede tener varias entidades jurídicas (DEC-064). El encabezado Z1 y los datos fiscales Z2 se toman **de la entidad del documento**, nunca de un valor general del tenant. Un comprobante, un recibo, un talón y un cupón pertenecen a una sola entidad (RN-FAC-157, DEC-087, RN-COB-156).

| Dato impreso | Origen | LE-01 (ficticio) | LE-02 (ficticio) |
|---|---|---|---|
| Razón social | `legalEntities.legalName` (T04 §7.14) | Cooperativa Demo Villa Ficticia Ltda. | Demo Conectividad Villa Ficticia S.A. |
| Nombre de fantasía | `legalEntities.tradeName` (T04) | Coop Demo | Demo Conecta |
| Matrícula INAES (si corresponde) | `legalEntities.inaesRegistration` (T04) | [dato de la entidad] | — |
| CUIT | `legalEntities.fiscal.cuit` (T04) | 30-00000001-0 | 30-00000002-0 |
| Condición frente al IVA | `legalEntities.fiscal.ivaConditionCode` (T04), texto de la condición desde M06 | IVA Responsable Inscripto | IVA Responsable Inscripto |
| Ingresos Brutos | `legalEntities.fiscal.iibbRegime` e `iibbNumber` (T04) | Local · 900-000001-0 | Local · 900-000002-0 |
| Domicilio legal y fiscal | `legalEntities.address` (T04) | Av. Siempre Viva 100, Villa Ficticia, Córdoba | Av. Siempre Viva 102, Villa Ficticia, Córdoba |
| Inicio de actividades | `legalEntities.fiscal.activityStartDate` (T04) | 01-03-1960 | 15-06-2010 |
| Logo y tipografía del documento | Variante de marca `legalEntities.brandingVariantKey` (T04) → `tenantBrandings.variants[]` (T03 §7.B); sin variante, marca base del tenant (OBS-14) | Marca base "Coop Demo" | Variante `demo-conecta` |
| Contacto | `legalEntities.contact { email, phone }` (T04) | 0351 000-0000 · atencion@coopdemo.ejemplo.test | 0351 000-0002 · soporte@democonecta.ejemplo.test |

La versión de marca usada queda congelada en el documento (T03 RN-UXD-013).

Maqueta del encabezado común (A4):

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA.                            │
   │         Coop Demo                                                        │
   │         Av. Siempre Viva 100 · Villa Ficticia · Córdoba                  │
   │         0351 000-0000 · atencion@coopdemo.ejemplo.test                   │
Z2 ├──────────────────────────────────────┬───┬───────────────────────────────┤
   │ IVA Responsable Inscripto            │ B │ FACTURA                       │
   │ CUIT 30-00000001-0                   │   │ Cód. 006                      │
   │ IIBB 900-000001-0                    │   │ N.º 0002-00001001             │
   │ Inicio de actividades 01-03-1960     │   │ Fecha de emisión 05-11-2026   │
   └──────────────────────────────────────┴───┴───────────────────────────────┘
```

### 4.3 Inventario de plantillas de documentos

Las 46 plantillas semilla de T11 §18.4 y los 2 documentos que la especificación pide sin plantilla semilla. La columna **Maqueta** indica dónde se dibuja en este entregable; "—" significa que se adopta la plantilla semilla tal como está en T11 (fuera del recorte del piloto o sin requisito de contenido adicional).

| Código | Documento | Dueño | Formato | Ola | Maqueta |
|---|---|---|---|---|---|
| TPL-FAC-01 | Factura de servicios (A, B, C; A4 y ticket) | M05 | PDF/A-2b | O4 | DOC-01, DOC-02 |
| TPL-FAC-02 | Nota de crédito | M05 | PDF/A-2b | O4 | DOC-03 |
| TPL-FAC-03 | Nota de débito | M05 | PDF/A-2b | O4 | DOC-03 |
| TPL-FAC-04 | Talón y cupón de pago | M05 | PDF | O4 | DOC-04, DOC-05 (OBS-07) |
| TPL-FAC-05 | Acta de cierre de ciclo de facturación | M05 | PDF/A-2b | O4 | — |
| TPL-FAC-06 | Factura de venta de bienes y servicios eventuales | M05 / M11 | PDF/A-2b | O4 | — (misma estructura que DOC-01 sin bloques de servicio) |
| TPL-FIS-01 | Certificado de retención | M06 | PDF/A-2b | O4 | DOC-13 |
| TPL-FIS-02 | Constancia de percepción | M06 | PDF/A-2b | O4 | DOC-13 |
| TPL-COB-01 | Recibo de cobro | M07 | PDF/A-2b y ticket | O5 | DOC-06, DOC-07 |
| TPL-COB-02 | Resumen de cuenta | M07 | PDF | O5 | DOC-08 |
| TPL-COB-03 | Constancia de libre deuda | M07 | PDF/A-2b | O5 | DOC-09 (OBS-17) |
| TPL-MOR-01 | Aviso de deuda | M08 | PDF | O5 (OBS-10) | DOC-10 |
| TPL-MOR-02 | Intimación de pago | M08 | PDF/A-2b | O5 (OBS-10) | DOC-11 |
| TPL-MOR-03 | Aviso de suspensión o corte | M08 | PDF/A-2b | O5 (OBS-10) | DOC-12 |
| TPL-MOR-04 | Convenio de pago | M08 | PDF/A-2b | O5 (OBS-10) | — |
| TPL-MOR-05 | Certificado de deuda para gestión judicial | M08 | PDF/A-2b | O5 (OBS-10) | — |
| TPL-CRM-01 | Constancia de reclamo | M09 | PDF | O2 | — |
| TPL-CRM-02 | Constancia de trámite | M09 | PDF | O2 | — |
| TPL-CRM-03 | Constancia de solicitud de baja | M09 | PDF/A-2b | O2 | — |
| TPL-CRM-04 | Acuse de mesa de entradas | M09 | PDF/A-2b | O10 | — |
| TPL-CRM-05 | Circular | M09 | PDF | O2 | — |
| TPL-CAT-01 | Solicitud y contrato de servicio | M02 | PDF/A-2b | O2 | — |
| TPL-CAT-02 | Constancia de alta de servicio | M02 | PDF | O2 | — |
| TPL-CAT-03 | Constancia de baja de servicio | M02 | PDF/A-2b | O2 | — |
| TPL-TEC-01 | Orden de trabajo | M10 | PDF | O3 | DOC-18 |
| TPL-TEC-02 | Acta de conformidad de instalación o reparación | M10 | PDF/A-2b | O3 | DOC-18 |
| TPL-TEC-03 | Contrato de comodato de equipo | M10 / M13 | PDF/A-2b | O3 | — |
| TPL-VEN-01 | Presupuesto | M11 | PDF | O8 | — |
| TPL-VEN-02 | Remito de entrega | M11 | PDF | O8 | — |
| TPL-CMP-01 | Orden de compra | M12 | PDF | O8 | — |
| TPL-CMP-02 | Orden de pago | M12 | PDF/A-2b | O8 | — |
| TPL-STK-01 | Vale de salida y remito interno | M13 | PDF | O3 | — |
| TPL-SUE-01 | Recibo de sueldo | M16 | PDF/A-2b | O9 | DOC-15 |
| TPL-SUE-02 | Certificado de trabajo (art. 80 LCT) | M16 | PDF/A-2b | O9 | — |
| TPL-SUE-03 | Constancia de licencia | M16 | PDF | O9 | — |
| TPL-INS-01 | Certificado de aportes de capital | M17 | PDF/A-2b | O10 | — |
| TPL-INS-02 | Credencial de asociado | M17 | PDF | O10 | — |
| TPL-INS-03 | Convocatoria a asamblea | M17 | PDF/A-2b | O10 | — |
| TPL-INS-04 | Acta de asamblea | M17 | PDF/A-2b | O10 | — |
| TPL-INS-05 | Acta de reunión de consejo | M17 | PDF/A-2b | O10 | — |
| TPL-SOC-01 | Constancia de beneficio o subsidio | M18 | PDF | O10 | — |
| TPL-SOC-02 | Título de derecho de sepultura | M18 | PDF/A-2b | O10 | — |
| TPL-WFL-01 | Índice del expediente digital | T11 | PDF/A-2b | O1 | — |
| TPL-WFL-02 | Carátula de expediente | T11 | PDF/A-2b | O10 | — |
| TPL-WFL-03 | Constancia de firma electrónica (evidencia) | T11 | PDF/A-2b | O1 | — |
| TPL-WFL-04 | Certificado de purga documental | T11 | PDF/A-2b | O1 | — |
| (sin asignar) | Comprobante de recarga prepaga con token | M03 / M07 | PDF y ticket | O7 | DOC-16 (OBS-08) |
| (sin asignar) | Constancia de comunicación | T09 | PDF con hash | O2 | DOC-17 (OBS-08) |

Además, el Libro IVA Ventas (DOC-14) y el libro diario (DOC-19) son **salidas PDF de reportes** (REP-FIS-001/002 y REP-CON-001/002 de T10) y no plantillas de T11.

### 4.4 DOC-01 · Factura de servicios (A4)

| Dato | Valor |
|---|---|
| Plantilla | TPL-FAC-01, variante A4; selección por reglas de `invoiceTemplates.selectionRules` (RF-FAC-134) |
| Dueño / ola | M05 / O4; datos fiscales de M06 |
| Formato | A4 vertical, PDF/A-2b, una hoja por comprobante (más dorso opcional para mensajes de 1.500 caracteres) |
| Ejemplo | Factura B de electricidad de LE-01 a consumidora final, período 10-2026 |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · Coop Demo                │
   │         Av. Siempre Viva 100 · Villa Ficticia · Córdoba · 0351 000-0000  │
Z2 ├──────────────────────────────────────┬───┬───────────────────────────────┤
   │ IVA Responsable Inscripto            │ B │ FACTURA · Cód. 006            │
   │ CUIT 30-00000001-0 · IIBB 900-000001-0│   │ N.º 0002-00001001             │
   │ Inicio de actividades 01-03-1960     │   │ Emisión 05-11-2026            │
   │                                      │   │ Período 01-10-2026 a 31-10-2026│
Z3 ├──────────────────────────────────────┴───┴───────────────────────────────┤
   │ Titular: ANA EJEMPLO            DNI 20.000.001   IVA: Consumidor final   │
   │ Cuenta 000012345 · Suministro 100045 · Categoría: Residencial            │
   │ Domicilio de servicio: Calle Falsa 123, Villa Ficticia                   │
   │ Domicilio postal:      Calle Falsa 123, Villa Ficticia (X0000XXX)        │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ ELECTRICIDAD · Medidor M-900001                                          │
   │ Lectura anterior 01-10-2026: 12.300   Lectura actual 31-10-2026: 12.550  │
   │ Consumo: 250 kWh en 30 días (real)                                       │
   │ ┌ Consumo últimos 12 períodos (kWh) ─────────────────────────────────┐   │
   │ │ ▂▃▃▄▅▆▆▅▄▃▃▄   11-2025 … 10-2026                                   │   │
   │ └────────────────────────────────────────────────────────────────────┘   │
   │ Concepto                              Cantidad    Precio       Importe   │
   │ Cargo fijo                                   1   5.445,00     5.445,00   │
   │ Energía consumida                      250 kWh      72,60    18.150,00   │
   │ [Otros conceptos y tributos del servicio: VERIFICAR, OBS-12]             │
   │                                          Subtotal servicio   23.595,00   │
   │ ────────────────────────────────────────────────────────────────────     │
   │ APORTE DE CAPITAL (no gravado)                                1.500,00   │
   │ [Leyenda configurable PRM-FIS-122]                                       │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ TOTAL                                                  ARS   25.095,00   │
   │ Régimen de Transparencia Fiscal al Consumidor (Ley 27.743)               │
   │   IVA contenido                                        ARS    4.095,00   │
   │ Vencimientos: 1.º 20-11-2026  ARS 25.095,00                              │
   │               2.º 30-11-2026  ARS 25.345,95 (con recargo)                │
   │ Deuda anterior vencida: ARS 0,00 · Próximo vencimiento: 20-12-2026       │
Z6 ├──────────────────────────────────────────────────────────────────────────┤
   │ ║│║║│║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║  [QR de pago]          │
   │ Código de pago SIRO–Banco Roela 56 [VERIFICAR] · prefijo 41    [QR fiscal]│
Z7 ├──────────────────────────────────────────────────────────────────────────┤
   │ CAE 00000000000000 (ficticio) · Vto. CAE 15-11-2026 · CVP: [si aplica]   │
   │ [TEXTO LEGAL PENDIENTE: leyendas obligatorias por letra y servicio,      │
   │  OBS-11 y OBS-12]                                                         │
   │ Mensaje (cuerpo, ≤ 400): Adherite a la factura digital y recibila por    │
   │ correo o WhatsApp el mismo día de la emisión.                            │
   │ Pie (≤ 200): Atención 0351 000-0000 · coopdemo.ejemplo.test   Pág. 1/1   │
   └──────────────────────────────────────────────────────────────────────────┘
```

El 2.º vencimiento es ilustrativo: el recargo sale de la política de M04/M08 y no se calcula aquí.

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Razón social, fantasía, domicilio, logo | `invoices.legalEntityId` → `legalEntities` (T04); logo T03 |
| Z2 | Letra, código ARCA, denominación | `invoices.letter`, `invoices.arcaVoucherCode` (M05); denominación protegida del diccionario `fis.comprobante.*` (T03, C-22) |
| Z2 | Punto de venta y número | `invoices.fullNumber` (M05, numerador por entidad) |
| Z2 | Fecha de emisión; período facturado | `invoices.issueDate`; `invoices.servicePeriodFrom` / `servicePeriodTo` (M05) |
| Z2 | CUIT, IIBB, condición IVA, inicio de actividades | `legalEntities` (T04); perfil fiscal de M06 (RF-FIS-167) |
| Z3 | Titular, documento, condición IVA | `invoices.customer.name`, `taxIdType`, `taxId`, `taxCondition` (M05, copia a la fecha de emisión) |
| Z3 | Cuenta, suministro, categoría | `invoices.customer.accountId` (M01); `serviceBlocks.accountId`, `serviceBlocks.categoryId` (M05/M02) |
| Z3 | Domicilios | `invoices.customer.serviceAddress`, `postalAddress` (histórico a la fecha, RF-FAC-135) |
| Z4 | Bloque por servicio, medidor, lecturas y consumo | `invoices.serviceBlocks[].serviceId`, `meterId`, `readings { previousDate, previousValue, currentDate, currentValue, consumption, unit, days, estimated }` (M05, de M03) |
| Z4 | Gráfico de consumo | `serviceBlocks[].chart.series[]` (12 períodos por defecto, `consumptionChartGroups`) |
| Z4 | Renglones | `invoices.lines[]` `description`, `quantity`, `unit`, `unitPrice`, `total`, ordenados por `printOrderId` (RF-FAC-136); texto de concepto sin descripción: `fac.concepto.desconocido` (OBS-15) |
| Z4 | Subtotal del servicio | `serviceBlocks[].subtotal` |
| Z4 | Aporte de capital | Renglón de clase fiscal "aporte de capital" (M06 RF-FIS-161), sección propia con leyenda PRM-FIS-122 |
| Z5 | Total | `invoices.totals.total` |
| Z5 | IVA contenido (consumidor final) | Cálculo de M06 RF-FIS-062 sobre `invoices.taxes[]` de IVA |
| Z5 | Vencimientos e importes | `invoices.dueDates[] { index, date, total, surcharge }` (hasta 4) |
| Z5 | Deuda anterior y próximo vencimiento | Saldo vencido de M07 a la fecha de emisión; `invoices.nextDueDate` (RF-FAC-135) |
| Z6 | Código de barras de pago | `invoices.paymentCodes[] { formatId, documentPrefix, code }` (formato declarativo `barcodeFormats`, RF-FAC-140 a 147; asignación por recaudador `barcodeAssignments`) |
| Z6 | QR de pago (billetera) | RF-FAC-146 (EMVCo, solo si no hay débito automático y no venció) |
| Z6 | QR fiscal | `invoices.fiscal.qrPayload` (M06 RF-FIS-061, RG 4892, `tipoCodAut` E para CAE, A para CAEA) |
| Z7 | CAE y vencimiento | `invoices.fiscal.cae`, `caeDueDate` (o `caeaId`) |
| Z7 | CVP | M06 RF-FIS-090 por punto de venta y período |
| Z7 | Mensajes impresos | `invoices.printMessages[]` y mensajes `print_invoice` de T09 (PRM-COM-047, P-COM-09) |
| Z7 | Datos de terceros (si hay) | `invoiceExternalData` (M05) en bloque separado (`serviceBlocks.thirdParty`) |

### 4.5 DOC-02 · Factura en ticket de 80 mm

| Dato | Valor |
|---|---|
| Plantilla | TPL-FAC-01, variante ticket (cobro en caja, venta in situ, prepago) |
| Dueño / ola | M05 / O4 |
| Formato | Ticket térmico 80 mm (RF-WFL-175) |

```text
Z1 ┌────────────────────────────────┐
   │ COOPERATIVA DEMO VILLA         │
   │ FICTICIA LTDA.                 │
   │ Av. Siempre Viva 100           │
   │ Villa Ficticia · Córdoba       │
Z2 │ CUIT 30-00000001-0             │
   │ IIBB 900-000001-0              │
   │ IVA Responsable Inscripto      │
   │ Inicio act. 01-03-1960         │
   │ FACTURA B · Cód. 006           │
   │ N.º 0005-00000321              │
   │ 05-11-2026 10:32               │
Z3 │ ANA EJEMPLO · DNI 20.000.001   │
   │ Consumidor final               │
   │ Cuenta 000012345               │
Z4 │ Reconexión del servicio        │
   │   1 x 8.000,00       8.000,00  │
Z5 │ TOTAL ARS            8.000,00  │
   │ IVA contenido        1.388,43  │
Z6 │        [QR fiscal]             │
Z7 │ CAE 00000000000000 (ficticio)  │
   │ Vto. CAE 15-11-2026            │
   │ [TEXTO LEGAL PENDIENTE, OBS-11]│
   └────────────────────────────────┘
```

Campos y origen: los mismos de DOC-01 sin bloques de servicio, lecturas ni gráfico; el punto de venta es el del puesto (`cashRegisters.printerProfile`, M07) y la entidad la del concepto facturado.

### 4.6 DOC-03 · Nota de crédito y nota de débito

| Dato | Valor |
|---|---|
| Plantilla | TPL-FAC-02 (NC) y TPL-FAC-03 (ND) |
| Dueño / ola | M05 / O4 |
| Formato | A4, PDF/A-2b |
| Ejemplo | NC B por bonificación parcial sobre la factura de DOC-01 |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · Coop Demo                │
Z2 ├──────────────────────────────────────┬───┬───────────────────────────────┤
   │ IVA Responsable Inscripto            │ B │ NOTA DE CRÉDITO · Cód. 008    │
   │ CUIT 30-00000001-0 · IIBB 900-000001-0│   │ N.º 0002-00000057             │
   │ Inicio de actividades 01-03-1960     │   │ Emisión 12-11-2026            │
Z3 ├──────────────────────────────────────┴───┴───────────────────────────────┤
   │ ANA EJEMPLO · DNI 20.000.001 · Consumidor final · Cuenta 000012345       │
   │ Comprobante asociado: Factura B 0002-00001001 del 05-11-2026             │
   │ Motivo: Bonificación por interrupción prolongada                         │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Concepto                                                     Importe     │
   │ Bonificación sobre energía consumida (10-2026)               3.000,00    │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ TOTAL                                                  ARS   3.000,00    │
   │ IVA contenido                                          ARS     520,66    │
Z6 │                                                             [QR fiscal]  │
Z7 │ CAE 00000000000000 (ficticio) · Vto. CAE 22-11-2026                      │
   │ [TEXTO LEGAL PENDIENTE, OBS-11]                                          │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z2 | Tipo (NC o ND) | `invoices.voucherClass` = `creditNote` / `debitNote` (M05) |
| Z3 | Comprobante asociado | `invoiceRelations.originInvoiceId` y `relationType` (M05) |
| Z3 | Motivo | `invoiceAnnulmentRequests.reason` o motivo del ajuste (M05) |
| Z4 | Renglones | `invoices.lines[]` de la NC o ND; en ND de intereses, `kind = interest` (origen M08) |
| Z5–Z7 | Totales, QR, CAE | Igual que DOC-01 |

### 4.7 DOC-04 · Talón de pago (documento de pago de M05)

| Dato | Valor |
|---|---|
| Plantilla | TPL-FAC-04 (OBS-07) |
| Dueño / ola | M05 / O4 |
| Formato | A4 (talón sumado) o franja troquelada al pie de la factura |
| Ejemplo | Talón sumado de dos comprobantes de LE-01 (electricidad y gas) de la misma cuenta |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0               │
   │ TALÓN DE PAGO N.º 0000004410 · Cuenta 000012345 · ANA EJEMPLO            │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Comprobante                     Servicio        Importe                  │
   │ Factura B 0002-00001001         Electricidad    25.095,00                │
   │ Factura B 0002-00001002         Gas natural     14.300,00                │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ 1.º vto. 20-11-2026   ARS 39.395,00                                      │
   │ 2.º vto. 30-11-2026   ARS 39.789,00 (con recargo)                        │
   │ Este talón no es un comprobante fiscal.                                  │
Z6 ├──────────────────────────────────────────────────────────────────────────┤
   │ ║│║║│║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║                        │
   │ Código de pago · prefijo 42 (talón) · formato del recaudador             │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Entidad, número de talón, cuenta | `paymentSlips.legalEntityId`, `number`, `accountId` (M05) |
| Z4 | Comprobantes agrupados | `paymentSlips.invoiceIds[]` → `invoices.fullNumber`, `serviceBlocks.serviceId`, `totals.total` |
| Z5 | Vencimientos | `paymentSlips.dueDates[] { index, date, amount }` (suma de comprobantes; los créditos restan, RF-FAC-149) |
| Z5 | Cuota (si es talón-cuota) | `paymentSlips.installmentNo` / `installmentCount` (RF-FAC-150) |
| Z6 | Código | `paymentSlips.paymentCodes[]` con prefijo 42 (RF-FAC-143) |

"Este talón no es un comprobante fiscal" es un texto propuesto; si el talón tiene un solo comprobante se imprime solo la factura (RF-FAC-153).

### 4.8 DOC-05 · Cupón de pago único (M07)

| Dato | Valor |
|---|---|
| Plantilla | TPL-FAC-04 (OBS-07); el emisor es M07 (`paymentCoupons`, RF-FAC-151) |
| Dueño / ola | M07 / O5 |
| Formato | A4 o franja al pie del resumen de cuenta (DOC-08) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ DEMO CONECTIVIDAD VILLA FICTICIA S.A. · CUIT 30-00000002-0               │
   │ CUPÓN DE PAGO N.º 000000781 · Cuenta 000012345 · ANA EJEMPLO             │
   │ Resumen de cuenta N.º 0000002210 al 31-10-2026                           │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Deudas que cancela                         Vencimiento        Importe    │
   │ Factura B 0001-00000980 Internet 09-2026   20-10-2026         9.800,00   │
   │ Factura B 0001-00001010 Internet 10-2026   20-11-2026         9.800,00   │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Pagando hasta 20-11-2026   ARS 19.600,00                                 │
   │ Válido hasta 30-11-2026                                                  │
Z6 ├──────────────────────────────────────────────────────────────────────────┤
   │ ║│║║│║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║│║║│║║│║║║│║        [QR de pago]    │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Entidad (una sola, RN-COB-156), número, cuenta, resumen | `paymentCoupons.legalEntityId`, `couponNo`, `currentAccountId`, `statementId` (M07) |
| Z4 | Deudas incluidas | `paymentCoupons.obligationIds[]` → obligaciones de M07 con documento y vencimiento |
| Z5 | Importes por vencimiento y vigencia | `paymentCoupons.totalsByDue[] { seq, dueDate, amount }`, `validUntil` |
| Z6 | Código y QR | `paymentCoupons.paymentReferenceId` (referencia de pago de M07) |

### 4.9 DOC-06 · Recibo de cobro (A4)

| Dato | Valor |
|---|---|
| Plantilla | TPL-COB-01, variante A4 |
| Dueño / ola | M07 / O5 |
| Formato | A4, PDF/A-2b |
| Ejemplo | Primer recibo de un cobro de ARS 13.000,00 con deuda de dos entidades (RF-COB-193): aquí el recibo de LE-01 por ARS 8.000,00 |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · Coop Demo                │
   │         Av. Siempre Viva 100 · Villa Ficticia · Córdoba                  │
Z2 ├──────────────────────────────────────────────────────────────────────────┤
   │ CUIT 30-00000001-0 · IVA Responsable Inscripto                           │
   │ RECIBO N.º 0003-00004567 [tipo según voucherTypeId, VERIFICAR]           │
   │ Fecha 18-11-2026 · Caja 03 · Operación OP-2026-118822                    │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Recibimos de ANA EJEMPLO · DNI 20.000.001 · Cuenta 000012345             │
   │ la suma de pesos OCHO MIL CON 00/100                                     │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Documento                   Servicio      Saldo previo  Aplicado  Recargo│
   │ Factura B 0002-00001001     Electricidad    25.095,00  8.000,00     0,00 │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ TOTAL RECIBIDO                                         ARS   8.000,00    │
   │ Medios: Efectivo 8.000,00                                                │
   │ Saldo pendiente de la factura: ARS 17.095,00                             │
Z6 ├──────────────────────────────────────────────────────────────────────────┤
   │ [QR de verificación]  Código de verificación: RCB-7Q2M-X9KD (ficticio)   │
Z7 ├──────────────────────────────────────────────────────────────────────────┤
   │ Esta operación incluye además el recibo 0001-00000912 de                 │
   │ Demo Conectividad Villa Ficticia S.A.                                    │
   │ Verificá este recibo en coopdemo.ejemplo.test/verificar                  │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1–Z2 | Entidad emisora y numeración | `receipts.legalEntityId`, `receipts.number { pointOfSale, number, voucherTypeId }` (M07, numerador de M05 por entidad, RF-COB-087) |
| Z2 | Fecha, caja y operación | `receipts.issueDate`, `cashOperations.cashRegisterId`, `cashOperations.operationNo` (M07) |
| Z3 | Pagador e importe en letras | `receipts.holderId` → M01; `receipts.total` con `numberToWords` (T11) |
| Z4 | Imputaciones | `receipts.items[] { document, serviceId, prevOpen, applied, components.surcharge, components.interest }` (recargos separados, RF-COB-086) |
| Z5 | Medios de pago | `receipts.tenderSummary` (de `paymentTenders`) |
| Z6 | QR y código de verificación | `receipts.validationCode` (RF-COB-089; verificación pública de T11 sin datos personales, C-39) |
| Z7 | Recibos hermanos | Otros `receipts` del mismo `cashOperationId` (RN-COB-152); texto propuesto |
| Z7 | Reimpresión | `receipts.reprints[]` → marca DUPLICADO |

### 4.10 DOC-07 · Ticket de operación de caja (80 mm)

| Dato | Valor |
|---|---|
| Plantilla | TPL-COB-01, variante ticket |
| Dueño / ola | M07 / O5 |
| Formato | Ticket térmico 80 mm; un único ticket resumen por operación aunque tenga varios recibos (RF-COB-193) |

```text
Z1 ┌────────────────────────────────┐
   │ Coop Demo · Caja 03            │
   │ 18-11-2026 10:41 · Cajero LD   │
   │ Operación OP-2026-118822       │
Z3 │ ANA EJEMPLO · Cta. 000012345   │
Z4 │ Recibo 0003-00004567           │
   │  Coop. Demo V. F. Ltda.        │
   │  Electricidad        8.000,00  │
   │ Recibo 0001-00000912           │
   │  Demo Conectividad S.A.        │
   │  Internet            5.000,00  │
Z5 │ TOTAL ARS           13.000,00  │
   │ Efectivo            10.000,00  │
   │ Tarjeta débito ****4321        │
   │                      3.000,00  │
   │ Vuelto                   0,00  │
Z6 │      [QR de verificación]      │
Z7 │ Gracias por su pago            │
   └────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Caja, fecha y hora, cajero, operación | `cashOperations.cashRegisterId`, `businessDate`, `time`, `sessionId` → usuario, `operationNo` (M07) |
| Z4 | Recibos por entidad | `cashOperations.receiptIds[]` → `receipts` (uno por entidad, RF-COB-193) |
| Z5 | Medios, vuelto | `cashOperations.totalsByMethod[]`, `cashPaid`, `change`; tarjeta enmascarada `paymentTenders.last4` |
| Z6 | QR | `receipts.validationCode` del recibo principal (propuesta: un QR por recibo si hay espacio, [VERIFICAR]) |

Si el tenant lo configura, se imprime la operación de caja en lugar del recibo (RF-COB-090).

### 4.11 DOC-08 · Resumen de cuenta

| Dato | Valor |
|---|---|
| Plantilla | TPL-COB-02 |
| Dueño / ola | M07 / O5; entrega por T09 (OBS-06) |
| Formato | A4, PDF |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  Coop Demo · RESUMEN DE CUENTA N.º 0000002210                     │
   │ Al 31-10-2026 · Período 01-10-2026 a 31-10-2026                          │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ ANA EJEMPLO · Cuenta 000012345 · Calle Falsa 123, Villa Ficticia         │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Documento                    Servicio      Vencimiento  Original  Abierto│
   │ Factura B 0002-00001001      Electricidad  20-11-2026  25.095,00 25.095,00│
   │ Factura B 0001-00000980      Internet      20-10-2026   9.800,00  9.800,00│
   │ Factura B 0001-00001010      Internet      20-11-2026   9.800,00  9.800,00│
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Saldo por servicio: Electricidad 25.095,00 · Internet 19.600,00          │
   │ TOTAL ADEUDADO                                          ARS  44.695,00   │
   │ Pago mínimo                                             ARS   9.800,00   │
   │ Saldo a favor disponible                                ARS       0,00   │
Z6 ├──────────────────────────────────────────────────────────────────────────┤
   │ Cupones de pago (uno por entidad jurídica): ver DOC-05                    │
Z7 │ Este resumen no es un comprobante fiscal.                                 │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Número, corte, período | `accountStatements.number`, `cutoffDate`, `periodFrom`, `periodTo` (M07) |
| Z4 | Líneas | `accountStatements.lines[] { obligationId, serviceId, document, dueDate, originalAmount, openAmount }` |
| Z5 | Totales | `totalsByService[]`, `totalOpen`, `minimumPayment`, `creditAvailable` |
| Z6 | Cupón | `accountStatements.couponId` → DOC-05; como el cupón no mezcla entidades, un resumen con dos entidades necesita un cupón por entidad (texto propuesto, [VERIFICAR] contra `couponId` singular) |

### 4.12 DOC-09 · Constancia de libre deuda

| Dato | Valor |
|---|---|
| Plantilla | TPL-COB-03; firma opcional con SIG-CERT-FISCAL (T11 §18.5) |
| Dueño / ola | M07 / O5 |
| Formato | A4, PDF/A-2b con QR de verificación |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0       │
   │ CONSTANCIA DE LIBRE DEUDA N.º LD-2026-000045                             │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Titular: ANA EJEMPLO · DNI 20.000.001                                    │
   │ Alcance: [cuenta / servicio / entidad jurídica — VERIFICAR, OBS-17]      │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Se deja constancia de que, a la fecha 05-11-2026, la cuenta 000012345    │
   │ no registra deuda vencida [en los servicios: VERIFICAR].                 │
   │ Pagos en proceso: [tratamiento VERIFICAR, OBS-17]                        │
   │ Vigencia: [VERIFICAR, OBS-17]                                            │
Z6 │ [QR de verificación] Código LD-8K3P-T7RW (ficticio)                      │
Z7 │ [Firma: SIG-CERT-FISCAL si el tenant la habilita]                        │
   │ [TEXTO LEGAL PENDIENTE: alcance y efectos de la constancia]              │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Entidad y número | Entidad del alcance (T04); numerador de T11 (RF-WFL numeración gapless) |
| Z3–Z4 | Titular, cuenta, fecha de corte | M01; saldo vencido de M07 a la fecha |
| Z6 | Verificación | Verificación pública de T11 (C-39) |

### 4.13 DOC-10 · Aviso de deuda

| Dato | Valor |
|---|---|
| Plantilla | TPL-MOR-01; modelo de aviso por instancia (RF-MOR-088) |
| Dueño / ola | M08 / O6 (OBS-10) |
| Formato | A4 o carta (`print_letter`), PDF; versión digital por T09 (`mor.notice.reminder`) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · Coop Demo                │
   │ AVISO DE DEUDA N.º AV-2026-003311 · Villa Ficticia, 05-11-2026           │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Sra. ANA EJEMPLO · Calle Falsa 123, Villa Ficticia · Cuenta 000012345    │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Le recordamos que registra el siguiente saldo vencido:                   │
   │ Documento                    Servicio      Vencimiento      Importe      │
   │ Factura B 0002-00000955      Electricidad  20-10-2026     25.095,00      │
   │                              Deuda actualizada al 05-11-2026: 25.346,00   │
   │ Si ya pagó, desestime este aviso.                                        │
   │ [Texto del modelo de aviso de la instancia, RF-MOR-088]                  │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Total a pagar hasta 25-11-2026                          ARS  25.346,00   │
Z6 │ ║│║║│║│║║║│║│║║│║║│║║║│║│║  Código de pago · prefijo 40 (notificación)  │
Z7 │ [Firma del gerente o auditor según el modelo, RF-MOR-088]                │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Número y fecha | Notificación de M08 (instancia de aviso) |
| Z4 | Documentos y deuda actualizada | Detalle por servicio del modelo (RF-MOR-088); deuda de M07/M08 al corte |
| Z5 | Vencimiento del aviso | Plazo de la instancia (M08) |
| Z6 | Código de pago | Prefijo 40 de notificación (RF-FAC-143) |
| Z7 | Firma | Firma configurada en el modelo de aviso (RF-MOR-088) |

Aviso con comprobante de deuda notificada opcional (RF-MOR-086). Cargo de envío solo si está habilitado con fundamento (RF-MOR-087, PA-MOR-12).

### 4.14 DOC-11 · Intimación de pago con preaviso

| Dato | Valor |
|---|---|
| Plantilla | TPL-MOR-02 |
| Dueño / ola | M08 / O6 (OBS-10) |
| Formato | A4, PDF/A-2b; exige constancia de entrega según `evidenceRequired` (RF-MOR-091) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0       │
   │ INTIMACIÓN DE PAGO N.º IN-2026-000127 · Villa Ficticia, 05-11-2026       │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Sra. ANA EJEMPLO · DNI 20.000.001 · Calle Falsa 123, Villa Ficticia      │
   │ Cuenta 000012345 · Suministro 100045                                     │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ [TEXTO LEGAL PENDIENTE: fórmula de intimación, plazo y consecuencias     │
   │  (PA-MOR-06, PA-COM-05, OBS-13)]                                         │
   │ Documento                    Servicio      Vencimiento      Importe      │
   │ Factura B 0002-00000930      Electricidad  20-09-2026     16.135,00      │
   │ Factura B 0002-00000955      Electricidad  20-10-2026     25.095,00      │
   │ Servicios alcanzados: Electricidad                                       │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Deuda actualizada                                       ARS  41.230,00   │
   │ Plazo para regularizar: hasta el 25-11-2026                              │
   │ Fecha prevista de suspensión: no antes del 02-12-2026 [VERIFICAR,        │
   │ ventana PRM-MOR-206 toValidate]                                          │
Z6 │ ║│║║│║│║║║│║│║║│║║│║║║│║│║  Código de pago · prefijo 40                  │
   │ [QR de verificación del documento]                                       │
Z7 │ Constancia de entrega: [canal, fecha, evidencia — completada por T09]    │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z4 | Documentos y servicios incluidos | Modelo de aviso de la instancia de intimación (RF-MOR-088) |
| Z5 | Deuda, plazo, fecha prevista | M08 (instancia y ventana de ejecución, RF-MOR-119, RF-MOR-221) |
| Z7 | Constancia | Estado y evidencia de la comunicación (RF-MOR-091; constancia de T09, DOC-17) |

### 4.15 DOC-12 · Aviso de suspensión o corte

| Dato | Valor |
|---|---|
| Plantilla | TPL-MOR-03 |
| Dueño / ola | M08 / O6 (OBS-10) |
| Formato | A4, PDF/A-2b; puede dejarse en el domicilio por el técnico (evidencia `physical_ack`) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0       │
   │ AVISO DE SUSPENSIÓN DEL SERVICIO N.º SC-2026-000088                      │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Sra. ANA EJEMPLO · Cuenta 000012345 · Suministro 100045 · Medidor M-900001│
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Servicio: Electricidad                                                   │
   │ Suspensión programada desde: 02-12-2026                                  │
   │ Motivo: deuda vencida según intimación IN-2026-000127                    │
   │ [TEXTO LEGAL PENDIENTE: fundamento normativo, derechos del usuario y     │
   │  vías de reclamo (OBS-13)]                                               │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Deuda a regularizar                                     ARS  41.230,00   │
   │ Cómo reactivar: pagá la deuda o acordá un plan; la reconexión se         │
   │ programa al confirmarse el pago.                                         │
Z6 │ ║│║║│║│║║║│║│║║│║║│║║║│║│║  Código de pago · prefijo 40                  │
Z7 │ Entregado por: ______________  Fecha y hora: ____________ [physical_ack] │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z4 | Servicio y fecha | `mor.interruption.scheduled` (EVT-MOR-12, M08) |
| Z4 | Bloqueos | No se emite si hay protección vigente (RF-MOR-111, mensaje MSG-079 de la parte A) |
| Z7 | Acuse físico | Registro de entrega en campo (M10) como evidencia de M08 |

### 4.16 DOC-13 · Certificado de retención y constancia de percepción

| Dato | Valor |
|---|---|
| Plantilla | TPL-FIS-01 (retención) y TPL-FIS-02 (percepción); firma opcional SIG-CERT-FISCAL |
| Dueño / ola | M06 / O4 (las retenciones practicadas a proveedores son O8, REP-FIS-006) |
| Formato | A4, PDF/A-2b |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0       │
   │ Agente de percepción [régimen y n.º de agente: VERIFICAR]                │
Z2 ├──────────────────────────────────────────────────────────────────────────┤
   │ CONSTANCIA DE PERCEPCIÓN N.º 0002-00000210 · Fecha 05-11-2026            │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Sujeto percibido: COMERCIO FICTICIO S.R.L. · CUIT 30-00000009-0          │
   │ Domicilio: Calle Imaginaria 45, Villa Ficticia                           │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Comprobante               Base imponible   Alícuota      Importe         │
   │ Factura A 0002-00000777        50.000,00   [VERIFICAR]   [VERIFICAR]     │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Total percibido                                        ARS [VERIFICAR]   │
Z6 │ [QR de verificación]                                                     │
Z7 │ [TEXTO LEGAL PENDIENTE: contenido exigido por el régimen, OBS-11]        │
   │ [Firma SIG-CERT-FISCAL si el tenant la habilita]                         │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1–Z2 | Agente, número, fecha | Perfil fiscal de la entidad (M06 RF-FIS-167) |
| Z4 | Comprobante, base, alícuota, importe | `invoices.taxes[] { kind = perception, jurisdiction, rate, base, amount }` (M05, calculado por M06) |

Las alícuotas y el contenido obligatorio de cada régimen no se completan: dependen de la tabla normativa de M06.

### 4.17 DOC-14 · Libro IVA Ventas (carátula y detalle)

| Dato | Valor |
|---|---|
| Salida | REP-FIS-001 (detalle) y REP-FIS-002 (carátula) de T10 §15.4, en PDF y planilla |
| Dueño / ola | M06 / O4 (criterio facturado; el resto de criterios y filtros en O8, RF-FIS-112, RF-FIS-114) |
| Formato | A4 apaisado, PDF; un libro por entidad jurídica (RF-FIS-167) |

```text
Z1 ┌─────────────────────────────────────────────────────────────────────────────────────────┐
   │ COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0                              │
   │ LIBRO IVA VENTAS · Período 10-2026 · Criterio: facturado · Fecha de emisión              │
   │ El sistema calcula y prepara; la presentación y responsabilidad son del contribuyente   │
   │ y su contador.                                                                          │
Z4 ├──────────┬─────┬───────────────┬──────────────┬──────────────┬──────┬──────────┬─────────┤
   │ Fecha    │ Tipo│ PV-Número     │ Receptor     │ CUIT/DNI     │ Cond.│ No grav. │ Exento  │
   │          │     │               │              │              │ IVA  │          │         │
   ├──────────┼─────┼───────────────┼──────────────┼──────────────┼──────┼──────────┼─────────┤
   │05-11-2026│ FB  │0002-00001001  │ANA EJEMPLO   │20000001      │ CF   │ 1.500,00 │   0,00  │
   │05-11-2026│ FA  │0002-00000777  │COMERCIO FIC. │30000000090   │ RI   │     0,00 │   0,00  │
   ├──────────┴─────┴───────────────┴──────────────┴──────────────┴──────┴──────────┴─────────┤
   │ (continúa a la derecha) Gravado 21 % · IVA 21 % · Gravado 27 % · IVA 27 % · Percepciones │
   │ · Total                                                                                 │
   │ FB 0002-00001001: 19.500,00 · 4.095,00 · 0,00 · 0,00 · 0,00 · 25.095,00                 │
Z5 ├─────────────────────────────────────────────────────────────────────────────────────────┤
   │ CARÁTULA: totales de débito y crédito, gravado e IVA por condición y alícuota;          │
   │ LQSP aparte (RF-FIS-116). La carátula suma igual que el detalle.                        │
Z7 │ Generado 05-11-2026 10:00 · Hash del archivo · Página 1/N                                │
   └─────────────────────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Leyenda de responsabilidad | M06 RF-FIS-008 (protegida, MSG-065 de la parte A) |
| Z4 | Columnas por comprobante | REP-FIS-001: no gravado, exento, gravado e IVA por alícuota, percepciones, total (T10 §15.4; `invoices.totals`, `invoices.taxes`) |
| Z4 | Aporte de capital | Columna de no gravados (RF-FIS-161) |
| Z5 | Carátula | REP-FIS-002 (RF-FIS-116) |

Las alícuotas de las columnas (21 %, 27 %) se muestran como ejemplo de estructura; las columnas reales salen de las alícuotas configuradas en M06.

### 4.18 DOC-15 · Recibo de sueldo

| Dato | Valor |
|---|---|
| Plantilla | TPL-SUE-01; firma del empleador SIG-SUE-EMPLEADOR y del empleado SIG-SUE-EMPLEADO (RF-SUE-105, DEC-078) |
| Dueño / ola | M16 / O9 (OBS-20) |
| Formato | A4, PDF/A-2b con duplicado; nombre de archivo `CUIL_AÑO_MES` (RF-SUE-104) |
| Ejemplo | Laura Demo, período 10-2026 (importes y conceptos ilustrativos, sin alícuotas legales) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ EMPLEADOR: COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0    │
   │ Domicilio: Av. Siempre Viva 100, Villa Ficticia, Córdoba                 │
   │ RECIBO DE HABERES · Período 10-2026 · ORIGINAL                           │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Trabajadora: LAURA DEMO · CUIL 27-00000003-0 · Legajo 0042               │
   │ Categoría: Administrativa B · Calificación: Auxiliar administrativa      │
   │ Fecha de ingreso: 01-03-2019 · Remuneración básica: 850.000,00           │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Concepto                  Cant.  Unidad  Remunerativo  No rem.  Deducción│
   │ Sueldo básico               30   días      850.000,00                    │
   │ Antigüedad                   7   años       42.500,00                    │
   │ Deducción A (ilustrativa)                                     100.000,00 │
   │ Deducción B (ilustrativa)                                      30.000,00 │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ Totales                                892.500,00     0,00   130.000,00  │
   │ NETO A COBRAR                                         ARS   762.500,00   │
   │ Son pesos: SETECIENTOS SESENTA Y DOS MIL QUINIENTOS CON 00/100           │
   │ Último depósito de aportes: período 09-2026 · fecha 09-10-2026 ·         │
   │ banco: Banco Ficticio                                                    │
   │ Lugar y fecha de pago: Villa Ficticia, 05-11-2026                        │
Z6 │ [QR de verificación]                                                     │
Z7 │ Firma del empleador: [SIG-SUE-EMPLEADOR, firma digital]                  │
   │ Firma o conformidad del empleado: [SIG-SUE-EMPLEADO, OTP] · Estado: ____ │
   │ [Admisión del recibo digital: VERIFICAR (M16 §21)]                       │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen (RF-SUE-104) |
|---|---|---|
| Z1 | Empleador, CUIT, domicilio | Entidad jurídica empleadora (T04) |
| Z3 | Trabajador, CUIL, categoría, calificación, ingreso, básico | Legajo de M16 |
| Z4 | Conceptos con cantidad y unidad | Liquidación del período (M16) |
| Z5 | Totales, neto en números y letras | Liquidación (M16); letras con `numberToWords` (T11) |
| Z5 | Constancia del último depósito (período, fecha, banco) | M16 (sin constancia el recibo no se emite, RF-SUE-104) |
| Z5 | Lugar y fecha de pago | Liquidación (M16) |
| Z7 | Firmas y estado | Estado proyectado desde T11 (RF-SUE-105); no conformidad con observación (RF-WFL-202) |

### 4.19 DOC-16 · Comprobante de recarga prepaga con token

| Dato | Valor |
|---|---|
| Plantilla | Sin plantilla semilla (OBS-08) |
| Dueño / ola | M03 (token) y M07 (cobro) / O7 |
| Formato | Ticket 80 mm en caja o POS; PDF en portal y app (RF-MED-115, RF-MED-119) |

```text
Z1 ┌────────────────────────────────┐
   │ Coop Demo · RECARGA PREPAGA    │
   │ 18-11-2026 10:55 · Caja 03     │
Z3 │ ANA EJEMPLO · Cta. 000012345   │
   │ Medidor M-900001               │
Z4 │ Importe recargado  10.000,00   │
   │ Unidades          [VERIFICAR]  │
Z5 │ CÓDIGO PARA EL MEDIDOR         │
   │ 1234 5678 9012 3456 7890       │
   │ Ingresalo en el teclado del    │
   │ medidor.                       │
Z7 │ Comprobante fiscal: [factura   │
   │ de la venta prepaga, VERIFICAR]│
   │ Recibo 0003-00004570           │
   └────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z3 | Titular, cuenta, medidor | M01; medidor de M03 |
| Z4 | Importe | Cobro de M07 (`cob.payment.confirmed` de la recarga) |
| Z5 | Token | Respuesta del proveedor (M03 RF-MED-115); solo al titular o autorizado (RF-MED-121) |
| Z7 | Comprobante fiscal y recibo | `invoices.origin = prepaid` (M05) y `receipts` (M07); la relación entre ambos y este ticket está sin definir (OBS-08) |

La reimpresión lleva la marca DUPLICADO y queda auditada (RF-MED-119).

### 4.20 DOC-17 · Constancia de comunicación

| Dato | Valor |
|---|---|
| Plantilla | Sin plantilla semilla (OBS-08) |
| Dueño / ola | T09 / O2 |
| Formato | A4, PDF con hash; adjuntable al expediente de T11 (RF-COM-146, JOB-COM-17) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  COOPERATIVA DEMO VILLA FICTICIA LTDA.                            │
   │ CONSTANCIA DE COMUNICACIÓN N.º COM-2026-0091820                          │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Destinatario: ANA EJEMPLO · Cuenta 000012345                             │
   │ Contacto usado: correo a***@ejemplo.test                                 │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Tipo: mor.notice.intimation · Plantilla v3 · Finalidad: regulada         │
   │ Referencia: intimación IN-2026-000127                                    │
   │ Estados:                                                                 │
   │   created            05-11-2026 09:00:02                                 │
   │   queued             05-11-2026 09:00:03                                 │
   │   accepted           05-11-2026 09:00:05                                 │
   │   delivered          05-11-2026 09:00:41                                 │
   │ Id del proveedor: [providerMessageId]                                    │
   │ Contenido renderizado: [anexo o hash + plantilla + versión + variables]  │
Z7 ├──────────────────────────────────────────────────────────────────────────┤
   │ Hash SHA-256: [hash] · Generado 05-11-2026 10:15                         │
   │ [QR de verificación]                                                     │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen (RF-COM-146) |
|---|---|---|
| Z3 | Destinatario y contacto usado | `communications` (T09), contacto enmascarado (C-19) |
| Z4 | Tipo, plantilla y versión, finalidad | `communications.communicationTypeId`, versión de `messageTemplateVersions` |
| Z4 | Fechas de cada estado, id del proveedor | Historial de estados (RF-COM-141) y eventos del proveedor |
| Z4 | Contenido | Texto renderizado o hash + plantilla + versión + variables |
| Z7 | Hash | Firma del sistema por hash (RF-COM-146) |

### 4.21 DOC-18 · Orden de trabajo y acta de conformidad

| Dato | Valor |
|---|---|
| Plantilla | TPL-TEC-01 (OT) y TPL-TEC-02 (acta, firma SIG-SIMPLE-CAMPO: trazo en pantalla, geolocalización y huella) |
| Dueño / ola | M10 / O3 |
| Formato | A4, PDF (OT) y PDF/A-2b (acta); el comprobante de OT también se lista como REP-TEC-023 |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ [LOGO]  Coop Demo · ORDEN DE TRABAJO OT-2026-004512                      │
   │ Tipo: Instalación de Internet · Prioridad: normal                        │
Z3 ├──────────────────────────────────────────────────────────────────────────┤
   │ Titular: ANA EJEMPLO · Cuenta 000012345 · Tel. +54 9 351 ***-0001        │
   │ Domicilio: Calle Falsa 123, Villa Ficticia · [mapa]                      │
   │ Visita: 10-11-2026, 9 a 13 h · Cuadrilla C-02 · Técnico: Martín          │
Z4 ├──────────────────────────────────────────────────────────────────────────┤
   │ Tareas: instalar ONU, configurar Wi-Fi, prueba de velocidad              │
   │ Materiales y equipos (vales): ONU serie ONU-000123 (comodato), cable 30 m│
   │ Incidentes: —                                                            │
Z5 ├──────────────────────────────────────────────────────────────────────────┤
   │ ACTA DE CONFORMIDAD                                                      │
   │ Resultado: servicio activo · Prueba: 300/300 Mbps                        │
   │ Conformidad del titular: [firma en pantalla]                             │
   │ Geolocalización y huella del documento: [SIG-SIMPLE-CAMPO]               │
Z7 │ Hash del acta · [QR de verificación]                                     │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z1 | Número, tipo, prioridad | OT de M10 |
| Z3 | Titular, domicilio, visita, cuadrilla | M01, M10 (agenda y recursos) |
| Z4 | Tareas, materiales, vales, incidentes | M10 y M13 (REP-TEC-023: "mapa, vales, incidentes") |
| Z5 | Conformidad y firma | T11 con perfil SIG-SIMPLE-CAMPO |

### 4.22 DOC-19 · Libro diario

| Dato | Valor |
|---|---|
| Salida | REP-CON-001 (libro diario, O5) y REP-CON-002 (libro diario rubricado: folio, rúbrica, transporte, O8) |
| Dueño / ola | M15 / O5 y O8 |
| Formato | A4, PDF; un libro por entidad jurídica (DEC-064) |

```text
Z1 ┌──────────────────────────────────────────────────────────────────────────┐
   │ COOPERATIVA DEMO VILLA FICTICIA LTDA. · CUIT 30-00000001-0               │
   │ LIBRO DIARIO · 01-11-2026 a 30-11-2026          Folio [n.º] · Rúbrica [—] │
Z4 ├──────────┬───────┬───────────────────────────────┬────────────┬───────────┤
   │ Fecha    │Asiento│ Cuenta / Documento de origen  │      Debe  │    Haber  │
   ├──────────┼───────┼───────────────────────────────┼────────────┼───────────┤
   │          │       │ Transporte                    │      0,00  │      0,00 │
   │18-11-2026│  1201 │ Caja                          │  8.000,00  │           │
   │          │       │   Créditos por servicios      │            │  8.000,00 │
   │          │       │   Recibo 0003-00004567        │            │           │
   ├──────────┴───────┴───────────────────────────────┼────────────┼───────────┤
   │ Total / A transportar                            │  8.000,00  │  8.000,00 │
Z7 │ Debe = Haber · Página 1/N                                                │
   └──────────────────────────────────────────────────────────────────────────┘
```

| Zona | Campo impreso | Origen |
|---|---|---|
| Z4 | Asientos con renglones y documento de origen | M15 (REP-CON-001; REP-CON-006 para el detalle por documento) |
| Z1, Z4 | Folio, rúbrica, transporte | REP-CON-002 (M15) |
| Z7 | Control | Debe = haber (T10 §15.4) |

Las cuentas contables del ejemplo son ilustrativas; el plan de cuentas es del tenant (M15).

---

## 5. Catálogo de reportes

### 5.1 Contrato semántico y convenciones

Todo reporte es una `reportDefinition` de T10 (§7.1) y cumple el contrato semántico de T10 §15.1. Para leer el catálogo:

| Elemento | Regla | Fuente |
|---|---|---|
| Parámetros y tipo de fecha | Cada reporte declara sus filtros y qué fecha usa (emisión, vencimiento, cobro, registración, período) | T10 §7.1 (`parameters`, `dateTypes`) |
| Corte | `asOf` (a una fecha), `Rango`, `Snap` (foto actual), `Corrida` o `Lote`, `Período`; se muestra en el encabezado del reporte | T10 §15.4 |
| Salidas | Pantalla, planilla (`xlsx`), `csv` y `pdf` | T10 §7.1 (`outputs`) |
| Alcance de datos | El usuario ve solo su sucursal, zona, servicio, cuadrilla, caja o lo propio, según su rol | T10 §7.1 (`scopeDimensions`) |
| Entidad jurídica | Filtro "entidad jurídica" donde el anexo dueño separa por entidad (libros IVA, contabilidad, recibos); no está entre las `scopeDimensions` (OBS-19). Se marca `‡` | DEC-064, RF-FIS-167 |
| Datos personales | Enmascarados por defecto; ver sin máscara o exportar queda en `reportAccessLogs` | T10 RF-BIA-034 (REP-BIA-002) |
| Estado vacío | `bia.vacio.honesto` (MSG-015 de la parte A) | T03 §10.7.7 |
| Simulación | Reportes de simulación llevan la marca SIMULACIÓN | C-33 |

Destinatarios (roles del tenant según T02): **GER** gerencia y consejo; **FAC** responsable de facturación; **FIS** contador o responsable fiscal; **COB** responsable de cobranzas; **CAJ** cajero; **TES** tesorero; **MOR** responsable de mora; **ATE** responsable de atención; **TEC** responsable técnico o jefe de cuadrilla; **MED** responsable de medición; **COM** comercial; **CON** contador; **RRHH** responsable de personal; **ADM** administrador del tenant.

### 5.2 Tableros por rol del piloto

| Tablero | Destinatario | Contenido | Filtros | Ola |
|---|---|---|---|---|
| DSH-GER | Gerente, consejo, administrador del tenant | KPI de catálogo, facturación, cobranza, mora, medición, atención, técnica, tesorería, contabilidad e institucional; configuraciones pendientes de aprobación; alertas críticas | Período, servicio, sucursal | O2 (crece por ola) |
| DSH-COM | Comercial y atención comercial | KPI-CAT-01 a 06, KPI-POR-01 a 07, KPI-VEN-01/02, embudo REP-CAT-005 | Período, servicio, canal | O2 |
| DSH-ATE | Responsable de atención | KPI-CRM-01 a 12, KPI-COM-03, backlog por área, turnos fallidos | Período, área, canal, servicio | O2 |
| DSH-AREA | Responsables de área | Pendientes: casos sin asignar, turnos fallidos, tareas vencidas, conciliaciones pendientes, reglas sin aprobar | Área | O2 |
| DSH-TEC | Responsable técnico, jefe de cuadrilla | KPI-TEC-01 a 12, mapa de OT por estado (REP-TEC-001), KPI-STK-03/08, KPI-MOR-07 | Período, zona, cuadrilla, servicio | O3 |
| DSH-FAC | Responsable de facturación | KPI-FAC-01 a 06, KPI-TAR-01/02, KPI-FIS-01/02/04, KPI-MED-01/02/03, lotes abiertos (REP-FAC-005) | Período, ciclo, servicio | O4 |
| DSH-COB | Responsable de cobranzas | KPI-COB-01 a 10, cobranza diaria por canal, ranking de canales por comisión (REP-COB-014) | Período, canal, caja, sucursal | O5 |
| DSH-CAJ | Cajero (PWA y admin) | Cobrado de mi caja hoy, operaciones de la sesión, diferencias abiertas (REP-COB-005) | Caja propia | O5 |
| DSH-CON | Contador | KPI-CON-01 a 07, KPI-FIS-03, KPI-CMP-05, conciliaciones pendientes | Ejercicio, período, plan | O5/O8 |
| DSH-MOR | Responsable de mora | KPI-MOR-01 a 08, aging (REP-COB-002), tablero REP-MOR-027, KPI-COB-07 | Período, servicio, zona, categoría | O6 |
| DSH-MED | Responsable de medición | KPI-MED-01 a 06, avance de rutas, excepciones por regla | Período de consumo, ruta, servicio | O7 |
| DSH-RRHH | Responsable de RRHH | KPI-SUE-01 a 06, sin datos individuales sensibles (RN-SUE-093) | Período, empresa, área | O9 |

Fuente: T10 §15.7. Los tableros de plataforma, compras, depósito, tesorería, institucional, servicios sociales, seguridad y datos se adoptan como están en T10.

### 5.3 Catálogo de reportes del piloto

Filtros comunes a todos los reportes (no se repiten en la tabla): rango o fecha de corte según la columna **Corte**, y alcance por rol (`scopeDimensions`). La columna **Columnas** resume el contenido de T10 §15.4; las columnas exactas y su orden se fijan en la `reportDefinition`.

#### 5.3.1 Facturación (M05)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-FAC-001 | Facturación por período | Servicio, concepto, categoría, condición fiscal, entidad jurídica ‡ | Neto, IVA, otros tributos, total, cantidad de comprobantes | FAC, GER, CON | Rango (PRM-FAC-152) | O4 |
| REP-FAC-005 | Cuadre del lote o ciclo | Lote, ciclo | Seleccionados, emitidos, pendientes, excluidos, trasladados (seleccionados = suma del resto) | FAC | Corrida | O4 |
| REP-FAC-006 | Excepciones por motivo y antigüedad | Motivo, responsable, lote | Motivo, responsable, tramo 0–2 / 3–7 / > 7 días, vencidas por SLA | FAC | Snap | O4 |
| REP-FAC-007 | Pendientes de autorización | Punto de venta, estado, entidad jurídica ‡ | Comprobantes `pending`, `queued`, `uncertain`, `rejected` por punto de venta y antigüedad | FAC, FIS | Snap | O4 |
| REP-FAC-008 | Numeración utilizada | Tipo de comprobante, punto de venta, entidad jurídica ‡ | Rangos usados por tipo y punto de venta; huecos (debe ser 0 en electrónicos) | FAC, FIS, auditor | Rango | O4 |
| REP-FAC-010 | NC, ND y anulaciones | Motivo, usuario, aprobador, manual o automática (RF-FAC-132) | Comprobante, motivo, usuario, aprobador, importe, comprobante original | FAC, GER, auditor | Rango | O4 |
| REP-FAC-011 | Entregas de comprobantes | Canal, estado, ruta | Entregas por canal y estado, rebotes, devoluciones de papel por ruta | FAC, ATE | Rango | O4 |
| REP-FAC-012 | Comparación con período anterior | Lote, umbral de variación | Variación % e importe del lote; casos sobre umbral | FAC | Prefacturación | O4 |

#### 5.3.2 Fiscal (M06)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-FIS-001 | Libro IVA Ventas (DOC-14) | Entidad jurídica ‡, criterio (RF-FIS-112), tipo de fecha; en O8 los filtros de RF-FIS-114 (tipo de factura, comprobante, situación IVA, servicio, sucursal, interno o fiscal, solo créditos, localidad, grupo contable, titular activo, facturación mensual o diaria) | Por comprobante: no gravado, exento, gravado e IVA por alícuota, percepciones, total | FIS, CON | Período fiscal | O4 |
| REP-FIS-002 | Carátula del libro IVA | Entidad jurídica ‡, período | Suma por condición y alícuota; LQSP aparte | FIS, CON | Período fiscal | O4 |
| REP-FIS-005 | Percepciones practicadas | Régimen, jurisdicción, entidad jurídica ‡ | Régimen, jurisdicción, cuenta, CUIT, comprobante, base, importe | FIS | Período | O4 |
| REP-FIS-009 | Tablero de autorizaciones | Punto de venta, tipo, estado | Por estado, punto y tipo; tiempo medio; % de rechazo; inciertos | FIS, FAC | Snap / día | O4 |
| REP-FIS-010 | Conciliación ARCA | Corrida, punto de venta | Comprobantes con CAE o importe distinto o inexistente | FIS | Corrida | O4 |
| REP-FIS-015 | Vencimientos de credenciales y autorizaciones | Entidad jurídica ‡, días a vencer | Certificados, CAI, CESP, CAEA, padrones y días a vencer | FIS, ADM | Día | O4 |

#### 5.3.3 Cuenta corriente y cobranza (M07)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-COB-001 | Estado de cuenta del titular | Titular o cuenta, servicio | Movimientos y saldo acumulado; obligaciones abiertas por servicio | ATE, COB, CAJ | asOf | O5 |
| REP-COB-002 | Antigüedad de saldos (aging) | Servicio, zona, categoría, entidad jurídica ‡ | Saldo abierto en 0–30, 31–60, 61–90, 91–180 y > 180 días desde el 1.er vencimiento | COB, MOR, GER | asOf | O5 |
| REP-COB-004 | Cobranza diaria por canal | Canal, medio, servicio, caja, sucursal | Suma de recibos por canal, medio y servicio; recargos e intereses aparte | COB, GER, TES | Rango (cobro) | O5 |
| REP-COB-005 | Planilla de caja / presentación del cajero | Caja, sesión; "excluir importes en cero" | Operaciones de la sesión, totales por medio, diferencias | CAJ, COB | Sesión | O5 |
| REP-COB-006 | Arqueos y diferencias | Caja, cajero | Teórico, declarado, diferencia, aprobador | COB, TES | Rango | O5 |
| REP-COB-007 | Recibos anulados | Caja, cajero, motivo | Recibo, motivo, usuario, autorizante | COB, auditor | Rango | O5 |
| REP-COB-009 | Rendiciones de entes | Ente, fecha de presentación | Leídos, aplicados, advertencias, errores, comisión, neto esperado | COB, TES | Fecha de presentación | O5 |
| REP-COB-010 | Conciliación de cobranzas | Canal, día | Bruto − comisión − IVA − retenciones = neto esperado, contra acreditado | COB, TES, CON | Día y canal | O5 |
| REP-COB-011 | Débito automático | Lote, ente | Presentado, aceptado, rechazado por código; tasa de rechazo | COB | Lote / rango | O5 |
| REP-COB-015 | Saldos a favor | Origen, antigüedad | Saldos abiertos por origen y antigüedad | COB, CON | asOf | O5 |

#### 5.3.4 Mora y financiación (M08)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-MOR-001 | Deuda vencida por antigüedad | Servicio, zona, categoría | Tramos 0–30 a > 365 días desde el 1.er vencimiento; deuda actualizada al corte | MOR, GER | asOf | O6 |
| REP-MOR-003 | Notificaciones pendientes | Instancia, lote, estado de entrega | Notificaciones por instancia, lote y estado | MOR | asOf | O6 |
| REP-MOR-004 | Servicios a cortar | Servicio, zona, fecha del informe | Cuenta, servicio, meses de deuda y días exactos (RN-BIA-057); bloqueados aparte | MOR, TEC | Fecha del informe | O6 |
| REP-MOR-007 | Promesas de pago | Estado, operador | Promesas cumplidas y vencidas | MOR, ATE | Rango | O6 |
| REP-MOR-008 | Resumen de notificaciones | Instancia, canal | Generadas, entregadas con y sin evidencia, pagadas, bajas, cerradas | MOR, GER | Rango | O6 |
| REP-MOR-011 | Casos de interrupción | Tipo, estado, servicio | Casos por tipo y estado; tiempo de solicitud a ejecución | MOR, TEC | Rango | O6 |
| REP-MOR-013 | Bloqueos por protección | Causa, servicio | Casos por causa (electrodependiente, entidad pública, reclamo, pago informado, evidencia, ventana) | MOR, auditor | Rango | O6 |
| REP-MOR-021 | Cartera de convenios | Plan, estado, entidad jurídica ‡ | Vigentes, en atraso, caídos, rehabilitados; tasa de caída | MOR, GER | asOf | O6 |

#### 5.3.5 Atención (M09)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-CRM-001 | Casos abiertos | Estado, área, servicio, prioridad | Conteo de casos no finales | ATE, GER | Snap / fin de día | O2 |
| REP-CRM-003 | Tiempo de resolución | Área, servicio, tipo | Mediana, promedio, p90 | ATE | Rango | O2 |
| REP-CRM-004 | Cumplimiento de SLA | Área, tipo, prioridad | Resueltos sin incumplimiento / resueltos con SLA × 100 | ATE, GER | Rango | O2 |
| REP-CRM-011 | Volumen por canal, servicio, tipo y motivo | Canal, servicio, tipo, motivo | Conteo | ATE, COM | Rango | O2 |
| REP-CRM-013 | Bajas recibidas y constancias en plazo | Servicio, canal | Bajas recibidas; % de constancias emitidas en 24 h o menos | ATE, auditor | Rango | O2 |

#### 5.3.6 Técnica (M10)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-TEC-001 | OT por estado | Estado, tipo, zona, cuadrilla | Conteo por estado; vista mapa y KML/GeoJSON (RF-BIA-020) | TEC, GER | Snap | O3 |
| REP-TEC-003 | Cumplimiento de SLA de OT | Tipo, zona, cuadrilla | Cerradas en término / cerradas | TEC | Rango | O3 |
| REP-TEC-006 | Visitas fallidas por motivo | Motivo, zona, cuadrilla | Conteo por `failureReason` | TEC, ATE | Rango | O3 |
| REP-TEC-016 | Cortes y reconexiones ejecutados | Modo, servicio, zona | Ejecuciones por modo; tiempo de orden a ejecución | TEC, MOR | Rango | O6 |
| REP-TEC-017 | Interrupciones del servicio | Servicio, zona | Cantidad, duración, contratos afectados, críticos | TEC, GER | Rango | O7 |

#### 5.3.7 Medición (M03)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-MED-001 | Porcentaje de lectura del período | Ruta, servicio, cronograma | Puntos con lectura real validada / puntos en rutas × 100 | MED | Cierre del cronograma | O7 |
| REP-MED-003 | Medidores sin leer | Ruta, servicio | Medidores conectados sin lectura del período (listados con 0 y marca) | MED | Snap | O7 |
| REP-MED-006 | Consumos por categoría | Servicio, categoría, canal, tipo de fecha (lectura, emisión, vencimiento) | Suma de cantidad aprobada por categoría y canal | MED, FAC, GER | Rango | O7 |
| REP-MED-010 | Pérdidas | Servicio, zona, período | Compra, facturado, pérdida, %, cos φ; anual de 13 períodos | MED, GER | Período | O7 |
| REP-MED-015 | Recargas prepagas | Día o mes, canal, estado | Cantidad, unidades, importe, fallidas, conciliación | MED, COB | Día / mes | O7 |

#### 5.3.8 Catálogo y contratos (M02)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-CAT-001 | Contratos por estado | Servicio, plan, zona | Conteo por estado canónico y operativo | COM, GER | asOf | O2 |
| REP-CAT-006 | Suspendidos | Servicio, motivo, modo | Suspendidos por motivo, modo y antigüedad | MOR, COM | asOf | O6 |

#### 5.3.9 Contabilidad (M15)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-CON-001 | Libro diario (DOC-19) | Entidad jurídica ‡, rango, tipo de asiento | Asientos con renglones; debe = haber | CON | Rango | O5 |
| REP-CON-003 | Mayor | Entidad jurídica ‡, cuenta | Saldo anterior + debe − haber por movimiento | CON | Rango | O5 |
| REP-CON-015 | Conciliación de auxiliares | Entidad jurídica ‡, auxiliar | Auxiliar − cuenta de control por clave (créditos por servicios = saldo del auxiliar de M07) | CON, COB | asOf | O5 |

#### 5.3.10 Personal y sueldos (M16)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-SUE-005 | Nómina de empleados | Empresa (entidad jurídica ‡), área, categoría | Legajo, CUIL, empresa, categoría, área, antigüedad | RRHH | asOf | O9 |
| REP-SUE-015 | Libro de sueldos (art. 52) | Empresa (entidad jurídica ‡), período | Recibos con conceptos | RRHH, CON | Período | O9 |

#### 5.3.11 Comunicaciones (T09)

| Reporte | Nombre | Filtros | Columnas | Destinatario | Corte | Ola |
|---|---|---|---|---|---|---|
| REP-COM-003 | Métricas de campaña por canal | Campaña, canal | Snapshot, excluidos, enviados, entregados, abiertos, clics, rebotes, quejas, bajas, fallidos, costo | COM, GER | Corrida | O2 |
| REP-COM-006 | Consentimientos y bajas de comunicaciones | Canal, finalidad | Altas, retiros y supresiones por canal | COM, auditor | Rango | O2 |

Resumen de la sección 5.3: **56 reportes** (8 de facturación, 6 fiscales, 10 de cobranza, 8 de mora, 5 de atención, 5 técnicos, 5 de medición, 2 de catálogo, 3 contables, 2 de sueldos y 2 de comunicaciones). El resto del catálogo consolidado de T10 §15.4 se adopta como está en el anexo.
