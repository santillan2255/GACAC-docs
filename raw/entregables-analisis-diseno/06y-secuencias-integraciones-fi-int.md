# GoodApps Cooperativas — Diagramas de secuencia de integraciones externas, parte Y

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), fichas FI-INT de T06**

| Campo | Valor |
|---|---|
| Documento | `06y-secuencias-integraciones-fi-int.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T06 §12.3 a §12.18 (fichas FI-INT-01 a FI-INT-115) |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada ficha FI-INT de T06 se dibuja con el mismo molde: el módulo dueño encola la operación, T06 la ejecuta con credenciales de la bóveda, idempotencia, circuito y bitácora, y devuelve el resultado o publica un evento de integración. En las fichas entrantes el proveedor inicia el intercambio (webhook o archivo). La nota a la derecha resume "Errores y contingencia" de la ficha. Cuando el dueño es T06 sin otro módulo, el intercambio empieza y termina en T06.

## 2. Integraciones externas (fichas FI-INT de T06)

### SEC-INT-01 — Fiscal nacional — ARCA (1)

**Fuente:** T06 §12.4. **Cubre:** FI-INT-01, FI-INT-02, FI-INT-03, FI-INT-04, FI-INT-05, FI-INT-06.

```mermaid
sequenceDiagram
    autonumber
    participant PM05 as M05 FAC
    participant PM06 as M06 FIS
    participant PM01 as M01 PER
    participant INT as T06 conectores, cola y bitácora
    participant X0 as ARCA WSAA
    participant X1 as ARCA WSFEv1
    participant X2 as ARCA WSFEv1
    participant X3 as ARCA WSFEX
    participant X4 as ARCA Factura de Crédito Electrónic…
    participant X5 as ARCA Padrón A13
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-01 ARCA WSAA (autenticación de servicios web)
    PM05->>INT: Operación por outbox (Bajo demanda, cacheado hasta vencer (RF…)
    INT->>X0: SOAP loginCms loginTicketRequest XML firmado CMS/PKCS 7 con…
    X0-->>INT: CUIT (en el certificado), servicio, uniqueId , ventana de g…
    INT-->>PM05: Resultado o evento de integración
    Note right of X0: Certificado expirado /no autorizado ⇒ conexión blocked_credential , p…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-02 ARCA WSFEv1 autorización CAE
    PM06->>INT: Operación por outbox (En cada emisión individual (caja, venta…)
    INT->>X1: SOAP WSFEv1. Operaciones FECAESolicitar , FECompUltimoAutor…
    X1-->>INT: Por comprobante tipo, punto de venta, número, fecha, concep…
    INT-->>PM06: Resultado o evento de integración
    Note right of X1: Antes de cada lote y ante resultado incierto FECompUltimoAutorizado +…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-03 ARCA WSFEv1 CAEA y CESP
    PM06->>INT: Operación por outbox (Solicitud anticipada por quincena (JOB…)
    INT->>X2: SOAP WSFEv1 FECAEASolicitar , FECAEAConsultar , FECAEARegIn…
    X2-->>INT: Período yyyyMM y orden (1ª/2ª quincena) CAEA, vigencia y fe…
    INT-->>PM06: Resultado o evento de integración
    Note right of X2: Informe rechazado por comprobante ⇒ corrección y reinforme (bandeja)…
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-04 ARCA WSFEX (factura de exportación)
    PM06->>INT: Operación por outbox (Por emisión.)
    INT->>X3: SOAP WSFEX ( FEXAuthorize , FEXGetLast_CMP , FEXGetCMP , FE…
    X3-->>INT: Comprobante E con destino, incoterms, moneda, cotización, p…
    INT-->>PM06: Resultado o evento de integración
    Note right of X3: Igual patrón que FI-INT-02 (último autorizado antes de reintentar). S…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-05 ARCA Factura de Crédito Electrónica MiPyME (WSFECRED)
    PM06->>INT: Operación por outbox (Por emisión FCE y consulta diaria de es…)
    INT->>X4: SOAP wsfecred (consulta de comprobantes, aceptar/rechazar,…
    X4-->>INT: CUIT emisor/receptor, comprobante, estado FCE, CBU informad…
    INT-->>PM06: Resultado o evento de integración
    Note right of X4: Estado no obtenido ⇒ reintento vencimiento de aceptación tácita contr…
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-06 ARCA Padrón A13
    PM01->>INT: Operación por outbox (A demanda en altas/modificaciones reval…)
    INT->>X5: SOAP ws_sr_padron_a13 getPersona , getIdPersonaListByDocume…
    X5-->>INT: Envío CUIT o DNI. Recepción apellido, nombre, razón social,…
    INT-->>PM01: Resultado o evento de integración
    Note right of X5: Sin respuesta ⇒ el formulario se guarda con pendiente de validar fisc…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-01 ARCA WSAA (autenticación de servicios web) | T06 (transversal); consumidores M05, M06, M01, M12, M16. | Saliente con respuesta inmediata. | O4 / Núcleo. | Confirmado en LAG (FE en uso; 727 = espera CAE en caja; 271… |
| FI-INT-02 ARCA WSFEv1: autorización CAE | M06 FIS (contenido fiscal) y M05 FAC (emisión); T06 transporta. | Saliente con respuesta inmediata. | O4 / Núcleo. | Confirmado en LAG (puntos de venta vistos 0022, 0028, 0097;… |
| FI-INT-03 ARCA WSFEv1: CAEA y CESP | M06 FIS; M05 los asigna al emitir. | Saliente. | O4 / Núcleo (si el tenant usa… | Soportado por ProCoop (informe en tandas de 100; "sin movim… |
| FI-INT-04 ARCA WSFEX (factura de exportación) | M06/M11. | Saliente. | O8 / Extensión. | Nuevo (no existe en ProCoop). |
| FI-INT-05 ARCA Factura de Crédito Electrónica MiPyME (WSFECRED) | M06 (emisión FCE vía WSFEv1) y M07/M12 (aceptación/rechazo y cobranza). | Bidireccional (consulta de estados y ac… | O8 / Estándar. | Soportado parcialmente por ProCoop (parámetro 2515: importe… |
| FI-INT-06 ARCA Padrón A13 | M01 PER (alta/modificación de personas), M12 CMP (proveedores). | Saliente (consulta). | O4 / Núcleo (en O2 la persona… | Soportado por ProCoop (proxy existe pero sin llamadas encon… |

### SEC-INT-02 — Fiscal nacional — ARCA (2)

**Fuente:** T06 §12.4. **Cubre:** FI-INT-07, FI-INT-08, FI-INT-09, FI-INT-10, FI-INT-11, FI-INT-12.

```mermaid
sequenceDiagram
    autonumber
    participant PM01 as M01 PER
    participant PM06 as M06 FIS
    participant PM12 as M12 CMP
    participant INT as T06 conectores, cola y bitácora
    participant X0 as ARCA Padrón A5
    participant X1 as ARCA Padrón A4
    participant X2 as ARCA Padrón PUC nivel 3
    participant X3 as Padrón offline de condición tribut…
    participant X4 as ARCA Constatación de comprobantes
    participant X5 as ARCA Mis Comprobantes
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-07 ARCA Padrón A5 (constancia de inscripción)
    PM01->>INT: Operación por outbox (A demanda y revalidación mensual opcion…)
    INT->>X0: SOAP ws_sr_constancia_inscripcion ( getPersona_v2 , dummy ).
    X0-->>INT: CUIT ⇒ datos generales, régimen general (impuestos inscript…
    INT-->>PM01: Resultado o evento de integración
    Note right of X0: Error constancia (datos inconsistentes) se muestra como observación s…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-08 ARCA Padrón A4
    PM01->>INT: Operación por outbox (A demanda.)
    INT->>X1: SOAP ws_sr_padron_a4 ( getPersona ).
    X1-->>INT: CUIT ⇒ datos de persona, impuestos, actividades.
    INT-->>PM01: Resultado o evento de integración
    Note right of X1: Como FI-INT-06.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-09 ARCA Padrón PUC nivel 3 (WSPN3) — legado
    PM01->>INT: Operación por outbox (A demanda.)
    INT->>X2: SOAP padron-puc-ws ( get(cuit, token, sign) ), devuelve un…
    X2-->>INT: CUIT ⇒ cadena de datos del contribuyente.
    INT-->>PM01: Resultado o evento de integración
    Note right of X2: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-10 Padrón offline de condición tributaria (archivo ARCA)
    X3->>INT: Archivo de ancho fijo CUIT (11), razón social (30), IVA en…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: CUIT, denominación, condición IVA, monotributo.
    Note right of X3: Archivo con formato distinto ⇒ failed con detalle se conserva la vers…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-11 ARCA Constatación de comprobantes (WSCDC)
    PM12->>INT: Operación por outbox (Por factura de compra (al cargarla o po…)
    INT->>X4: SOAP wscdc ( ComprobanteConstatar , ComprobantesModalidadCo…
    X4-->>INT: CUIT emisor, tipo, punto de venta, número, fecha, importe,…
    INT-->>PM12: Resultado o evento de integración
    Note right of X4: No constatado ⇒ marca pendiente de constatar no bloquea la carga pero…
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-12 ARCA Mis Comprobantes (importación)
    X5->>INT: CSV/Excel descargado de ARCA (layouts arca.misComprobantes.…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM12: Fecha, tipo, punto de venta, número, CUIT contraparte, deno…
    Note right of X5: Duplicados por clave del comprobante diferencias a informe comprobant…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-07 ARCA Padrón A5 (constancia de inscripción) | M01, M06, M12. | Saliente (consulta). | O4 / Núcleo. | Nuevo (no existe en ProCoop, RN-03 §5). |
| FI-INT-08 ARCA Padrón A4 | M01, M12. | Saliente. | O4 / Extensión. | Nuevo. [VERIFICAR] vigencia del servicio A4 en ARCA; si est… |
| FI-INT-09 ARCA Padrón PUC nivel 3 (WSPN3) — legado | M01. | Saliente. | — / Reemplazado por FI-INT-06… | Soportado por ProCoop (único padrón efectivamente invocado). |
| FI-INT-10 Padrón offline de condición tributaria (archivo ARCA) | M06 (tabla de condición), M01/M12 (cruces). | Entrante. | O4 / Estándar. | Soportado por ProCoop (`EMPAFIP`, `clsImportacionArchivos`,… |
| FI-INT-11 ARCA Constatación de comprobantes (WSCDC) | M12 CMP. | Saliente. | O8 / Estándar. | Nuevo. |
| FI-INT-12 ARCA Mis Comprobantes (importación) | M12 (compras) y M15/M06 (libros IVA). | Entrante. | O8 / Estándar. | Soportado por ProCoop (`clsLibroIVAdigital.Importar_Comprob`… |

### SEC-INT-03 — Fiscal nacional — ARCA (3)

**Fuente:** T06 §12.4. **Cubre:** FI-INT-13, FI-INT-14, FI-INT-15, FI-INT-16, FI-INT-17.

```mermaid
sequenceDiagram
    autonumber
    participant PM06 as M06 FIS
    participant PM16 as M16 SUE
    participant PT04 as T04 CFG
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Libro IVA Digital, CITI
    participant X1 as SICORE
    participant X2 as SIRE
    participant X3 as Libro de Sueldos Digital, SICOSS /…
    participant X4 as Cotización de monedas
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-13 Libro IVA Digital, CITI (RG 3685) y otros regímenes i…
    PM06->>INT: Operación por outbox (Mensual según vencimiento de cada régim…)
    INT->>X0: TXT de ancho fijo por layout versionado arca.lid.ventas , a…
    X0-->>INT: Comprobantes de ventas y compras con importes por alícuota,…
    INT-->>PM06: Resultado o evento de integración
    Note right of X0: Validación previa (totales, alícuotas, formato) estados generado ≠ pr…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-14 SICORE (retenciones y percepciones)
    PM06->>INT: Operación por outbox (Mensual/quincenal según régimen.)
    INT->>X1: TXT de importación SICORE por layout arca.sicore.* .
    X1-->>INT: Comprobante origen, fecha, código de impuesto y régimen, ba…
    INT-->>PM06: Resultado o evento de integración
    Note right of X1: Igual que FI-INT-13 rectificativas como nueva versión vinculada.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-15 SIRE (F2004 / F2005) y seguridad social
    PM06->>INT: Operación por outbox (Según vencimiento.)
    INT->>X2: Archivo de importación SIRE (layouts arca.sire.f2004 , arca…
    X2-->>INT: Retenciones, certificados, sujetos retenidos.
    INT-->>PM06: Resultado o evento de integración
    Note right of X2: Como FI-INT-13.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-16 Libro de Sueldos Digital, SICOSS / F.931 y F.572
    PM16->>INT: Operación por outbox (Mensual SICOSS al cambiar versión.)
    INT->>X3: TXT LSD por layout base Access de SICOSS (lectura MDB en im…
    X3-->>INT: Legajos, conceptos, remuneraciones, aportes y contribucione…
    INT-->>PM16: Resultado o evento de integración
    Note right of X3: Validación de vigencia de tablas con mes de dos dígitos (corrige el b…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-17 Cotización de monedas
    PT04->>INT: Operación por outbox (Diaria y a demanda al emitir en moneda…)
    INT->>X4: FEParamGetCotizacion de WSFEv1 alternativa API pública del…
    X4-->>INT: Moneda ⇒ cotización y fecha.
    INT-->>PT04: Resultado o evento de integración
    Note right of X4: Sin cotización ⇒ carga manual auditada.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-13 Libro IVA Digital, CITI (RG 3685) y otros regímenes informa… | M06 (contenido) / M15. | Saliente. | O8 / Estándar. | Soportado por ProCoop (`Facturacion.Archivos`: `RG3685`, `R`… |
| FI-INT-14 SICORE (retenciones y percepciones) | M06 (régimen de agente de retención/percepción, BASE §61); M12/M16 originan. | Saliente. | O8 / Estándar. | Soportado por ProCoop (`PercepcionSICORE`, `Exportar_Sueldo`… |
| FI-INT-15 SIRE (F2004 / F2005) y seguridad social | M06. | Saliente. | O8 / Estándar. | Soportado por ProCoop (`clsSIRE`). [VERIFICAR] disponibilid… |
| FI-INT-16 Libro de Sueldos Digital, SICOSS / F.931 y F.572 | M16 SUE. | Saliente (LSD, F.931) y entrante (tabla… | O9 / Estándar. | Soportado por ProCoop (`LibroSueldoDigital`, `Importar_Sico`… |
| FI-INT-17 Cotización de monedas | T04 (tabla de cotizaciones) / M06. | Saliente. | O8 / Extensión. | Soportado por ProCoop (`clsTipMon.GetCotizacion`; el método… |

### SEC-INT-04 — Fiscal provincial y municipal

**Fuente:** T06 §12.5. **Cubre:** FI-INT-18, FI-INT-19, FI-INT-20, FI-INT-21, FI-INT-22, FI-INT-23.

```mermaid
sequenceDiagram
    autonumber
    participant PM06 as M06 FIS
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Rentas Córdoba
    participant X1 as Rentas Córdoba
    participant X2 as SIRCAR
    participant X3 as ARBA
    participant X4 as Otras jurisdicciones
    participant X5 as Retenciones y tasas municipales
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-18 Rentas Córdoba padrón de Ingresos Brutos ( LUA )
    X0->>INT: Archivo publicado por la Dirección General de Rentas de Cór…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: CUIT, régimen, alícuota, vigencia.
    Note right of X0: Padrón no publicado/recibido ⇒ alerta file_not_received y se usa el v…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-19 Rentas Córdoba Código de Validación Provincial (CVP)
    X1->>INT: Alta manual con vigencia si el organismo expone servicio, c…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: Punto de venta, comprobante, período, CVP, leyenda.
    Note right of X1: CVP vencido ⇒ alerta antes del ciclo de emisión.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-20 SIRCAR (Convenio Multilateral)
    PM06->>INT: Operación por outbox (Mensual/quincenal.)
    INT->>X2: Archivos de importación SIRCAR ( sircar.percepciones , sirc…
    X2-->>INT: Jurisdicción, CUIT, comprobante, base, alícuota, importe.
    INT-->>PM06: Resultado o evento de integración
    Note right of X2: Igual a FI-INT-13.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-21 ARBA (Buenos Aires)
    X3->>INT: Padrón por archivo ( arba.padron ) DDJJ por archivo ( arba.…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: CUIT, alícuotas, vigencias percepciones/retenciones practic…
    Note right of X3: Como FI-INT-18.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-22 Otras jurisdicciones (Santa Fe, La Pampa, Río Negro y…
    X4->>INT: Layouts por jurisdicción rn.iibb.padron (Río Negro 01/2017)…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: Igual a FI-INT-18/20.
    Note right of X4: Igual a FI-INT-18.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-23 Retenciones y tasas municipales
    PM06->>INT: Operación por outbox (Mensual.)
    INT->>X5: Archivo/planilla por municipio (layout por tenant).
    X5-->>INT: Retenciones por proveedor y período.
    INT-->>PM06: Resultado o evento de integración
    Note right of X5: Generado ≠ presentado.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-18 Rentas Córdoba: padrón de Ingresos Brutos ("LUA") | M06 FIS. | Entrante. | O4 / Núcleo. | Soportado por ProCoop (`IIBB_LUA`, `GetCondicionIIBB_LUA`,… |
| FI-INT-19 Rentas Córdoba: Código de Validación Provincial (CVP) | M06 / M05 (impresión). | Entrante (código otorgado por el organi… | O4 / Núcleo (si la cooperativ… | Soportado por ProCoop (`CVPIIBB`, `Get_CVP`). |
| FI-INT-20 SIRCAR (Convenio Multilateral) | M06. | Saliente. | O8 / Estándar (O4 si la perce… | Soportado por ProCoop (`SIRCAR.Exportar_ArchivoPercepciones`… |
| FI-INT-21 ARBA (Buenos Aires) | M06. | Entrante (padrón) y saliente (DDJJ). | O8 / Extensión (C en la base… | Soportado por ProCoop (`ImportarIIBB_BsAs`, `Exportar_Ingre`… |
| FI-INT-22 Otras jurisdicciones (Santa Fe, La Pampa, Río Negro y demás) | M06. | Entrante y saliente. | O8 / Extensión. | Soportado por ProCoop (`ImportarIIBB_RN_012017`, `Exportar_`… |
| FI-INT-23 Retenciones y tasas municipales | M06. | Saliente. | O8 / Extensión. | Soportado por ProCoop (`RetencionesMunicipales`). |

### SEC-INT-05 — Reguladores, subsidios y terceros (1)

**Fuente:** T06 §12.6. **Cubre:** FI-INT-24, FI-INT-25, FI-INT-26, FI-INT-27, FI-INT-28, FI-INT-29.

```mermaid
sequenceDiagram
    autonumber
    participant PM06 as M06 FIS
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Subsidios y segmentación
    participant X1 as ERSeP
    participant X2 as ENARGAS
    participant X3 as ENACOM
    participant X4 as Secretaría de Energía
    participant X5 as Otros entes provinciales
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-24 Subsidios y segmentación (RASE, Resolución SE 493/25,…
    X0->>INT: Archivos (layouts se.rase.padron , se.493-25 , gas.sef , zo…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: Identificación del suministro/titular, segmento (N1/N2/N3 o…
    Note right of X0: Registros no cruzados ⇒ bandeja de excepciones lote de facturación co…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-25 ERSeP (Córdoba)
    PM06->>INT: Operación por outbox (Mensual/según resolución.)
    INT->>X1: Archivos/planillas por layout ersep.* (resoluciones 166, 29…
    X1-->>INT: Usuarios por categoría, consumos y facturación agregados, b…
    INT-->>PM06: Resultado o evento de integración
    Note right of X1: Generado ≠ presentado plantillas versionadas por resolución.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-26 ENARGAS
    PM06->>INT: Operación por outbox (Según exigencia.)
    INT->>X2: Archivos/planillas por layout enargas.* .
    X2-->>INT: Agregados de usuarios, consumos, reclamos.
    INT-->>PM06: Resultado o evento de integración
    Note right of X2: Generado ≠ presentado.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-27 ENACOM
    PM06->>INT: Operación por outbox (Según exigencia.)
    INT->>X3: Archivos/planillas enacom.* .
    X3-->>INT: Abonados por servicio y localidad, velocidades, reclamos.
    INT-->>PM06: Resultado o evento de integración
    Note right of X3: Generado ≠ presentado.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-28 Secretaría de Energía (CAMMESA y otros informes)
    PM06->>INT: Operación por outbox (Mensual.)
    INT->>X4: Planillas/archivos se.* .
    X4-->>INT: Energía comprada/vendida, usuarios, tarifas.
    INT-->>PM06: Resultado o evento de integración
    Note right of X4: Generado ≠ presentado.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-29 Otros entes provinciales (EPRE, OCEBA y similares)
    PM06->>INT: Operación por outbox (Según ente.)
    INT->>X5: Plantillas configurables por ente (motor de reportes regula…
    X5-->>INT: Según ente.
    INT-->>PM06: Resultado o evento de integración
    Note right of X5: Generado ≠ presentado.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-24 Subsidios y segmentación (RASE, Resolución SE 493/25, gas S… | M06 FIS (padrones de terceros) / M04 TAR (reglas de subsidio) / M05 (aplicación… | Entrante (padrones) y saliente (informe… | O7 / Núcleo (servicios medido… | Soportado por ProCoop (`ImportarExcelResol493_25`, `Importa`… |
| FI-INT-25 ERSeP (Córdoba) | M06 FIS (reguladores); datos de M04/M05; reportes con el motor de T10. | Saliente (informes) y entrante (padrone… | O7 / Estándar. | Soportado por ProCoop (`clsERSeP`, `ERSEP_166`, `TarifaSoci`… |
| FI-INT-26 ENARGAS | M06 FIS (reguladores); reportes con el motor de T10. | Saliente. | O7 / Extensión. | Soportado por ProCoop (`ENARGAS_Informes`). Uso en LAG a co… |
| FI-INT-27 ENACOM | M06 FIS (reguladores); datos de M10 (servicios TIC). | Saliente. | O7 / Extensión. | Soportado por ProCoop (`ENACOM_Informes`). |
| FI-INT-28 Secretaría de Energía (CAMMESA y otros informes) | M06 FIS (reguladores); reportes con el motor de T10. | Bidireccional (archivos). | O7 / Extensión. | Soportado por ProCoop (`SE_Informes`). |
| FI-INT-29 Otros entes provinciales (EPRE, OCEBA y similares) | M06 FIS (reguladores); reportes con el motor de T10. | Saliente. | O7 / Extensión. | Soportado por ProCoop (`OCEBA_Informes`). |

### SEC-INT-06 — Reguladores, subsidios y terceros (2)

**Fuente:** T06 §12.6. **Cubre:** FI-INT-30, FI-INT-31, FI-INT-32, FI-INT-33.

```mermaid
sequenceDiagram
    autonumber
    participant PM17 as M17 INS
    participant PM06 as M06 FIS
    participant PM12 as M12 CMP
    participant INT as T06 conectores, cola y bitácora
    participant X0 as INAES
    participant X1 as FECESCOR
    participant X2 as Tasas y cargos de terceros
    participant X3 as EPEC
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-30 INAES
    PM17->>INT: Operación por outbox (Anual / por evento.)
    INT->>X0: Reportes/planillas exportables presentación humana.
    X0-->>INT: Asociados, capital, asambleas, balances.
    INT-->>PM17: Resultado o evento de integración
    Note right of X0: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-31 FECESCOR (federación de cooperativas)
    PM17->>INT: Operación por outbox (Según convenio.)
    INT->>X1: Archivo/planilla según la federación.
    X1-->>INT: Agregados.
    INT-->>PM17: Resultado o evento de integración
    Note right of X1: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-32 Tasas y cargos de terceros (municipales, bomberos, Ba…
    X2->>INT: Planillas/archivos por tercero (layout por tenant).
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM06: Suministro/titular, concepto, importe, período rendición co…
    Note right of X2: Registros no cruzados a bandeja rendición conciliada antes de pagar.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-33 EPEC (compra de energía / distribuidora provincial)
    X3->>INT: Archivo/planilla del mayorista (layout en fileLayouts , COL…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM12: Puntos de compra o frontera, período, energía activa por ba…
    Note right of X3: Archivo repetido ⇒ sin duplicado (idempotencia de RF-CMP-149) renglón…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-30 INAES | M17 INS. | Saliente. | O10 / Extensión. | Nuevo (no hay conector en ProCoop; BASE lo menciona en soci… |
| FI-INT-31 FECESCOR (federación de cooperativas) | M17 INS. | Saliente. | O10 / Extensión. | Soportado por ProCoop (referencias en informes); uso en LAG… |
| FI-INT-32 Tasas y cargos de terceros (municipales, bomberos, Banco de… | M06 FIS (terceros) / M05 (facturación por cuenta de terceros) / M07 (rendición)… | Entrante (padrón/importes) y saliente (… | O5 / Estándar. | Soportado por ProCoop (conceptos de terceros; `BancoSangre`… |
| FI-INT-33 EPEC (compra de energía / distribuidora provincial) | M12 (RF-CMP-149 a RF-CMP-153) / M03 (medición de frontera y balance energético). | Entrante. | O8 / Núcleo (servicio ELE; al… | Resuelto el significado (CTR-INT-18): factura de compra may… |

### SEC-INT-07 — Redes de cobranza extrabancaria (1)

**Fuente:** T06 §12.7. **Cubre:** FI-INT-34, FI-INT-35, FI-INT-36, FI-INT-37, FI-INT-38, FI-INT-39.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Código de barras y línea de pago
    participant X1 as Red Link
    participant X2 as SIRO
    participant X3 as SIRO API
    participant X4 as Banelco / Pago Mis Cuentas
    participant X5 as Rapipago
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-34 Código de barras y línea de pago
    PM07->>INT: Operación por outbox (Por factura.)
    INT->>X0: Composición por plantilla versionada por convenio (empresa,…
    X0-->>INT: Identificación de la cuenta/factura, importes y vencimiento…
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Dígito verificador inválido ⇒ rechazo en caja cambio de formato de la…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-35 Red Link (LinkPagos)
    PM07->>INT: Operación por outbox (Publicación tras cada facturación y al…)
    INT->>X1: Archivo de publicación ( redlink.publicacion exportador LAG…
    X1-->>INT: Publicación código de pago electrónico, importe, vencimient…
    INT-->>PM07: Resultado o evento de integración
    Note right of X1: Rendición duplicada por hash pago sin factura ⇒ unmatched a bandeja p…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-36 SIRO (Banco Roela) por archivos
    PM07->>INT: Operación por outbox (Publicación tras facturación rendición…)
    INT->>X2: Publicación ( siro.publicacion exportador LAG 140 E_SIRO ,…
    X2-->>INT: Cliente, comprobante, importes y vencimientos rendición con…
    INT-->>PM07: Resultado o evento de integración
    Note right of X2: Igual que FI-INT-35 si falla la API (FI-INT-37), se cae a archivo.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-37 SIRO API (botón de pago, QR y consulta)
    PM07->>INT: Operación por outbox (Por intención polling de respaldo JOB-I…)
    INT->>X3: REST JSON con token por sesión ( /Sesion ), creación de pag…
    X3-->>INT: Referencia de operación, importe, concepto, vencimiento est…
    INT-->>PM07: Resultado o evento de integración
    Note right of X3: Sin respuesta ⇒ uncertain + reconsulta pago confirmado solo tras cons…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-38 Banelco / Pago Mis Cuentas (PMC)
    PM07->>INT: Operación por outbox (Como FI-INT-35.)
    INT->>X4: Archivos pmc.publicacion / pmc.rendicion (directo o vía agr…
    X4-->>INT: Como FI-INT-35.
    INT-->>PM07: Resultado o evento de integración
    Note right of X4: Como FI-INT-35.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-39 Rapipago
    X5->>INT: Archivo rapipago.rendicion .
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM07: Código de barras, fecha, importe.
    Note right of X5: Como FI-INT-35.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-34 Código de barras y línea de pago | M07 COB (formato por convenio) / M05 (impresión). | Interna (generación) + lectura física. | O4 / Núcleo. | Confirmado en LAG (SIRO con "0" antepuesto). |
| FI-INT-35 Red Link (LinkPagos) | M07. | Saliente (publicación) y entrante (rend… | O5 / Núcleo. | Confirmado en LAG. |
| FI-INT-36 SIRO (Banco Roela) por archivos | M07. | Saliente y entrante. | O5 / Núcleo. | Confirmado en LAG (128.776 solicitudes, todas SIRO; ~70 % p… |
| FI-INT-37 SIRO API (botón de pago, QR y consulta) | M07 / M19. | Bidireccional. | O5 / Núcleo. | Soportado por ProCoop (`clsSiro`); uso de API en LAG a conf… |
| FI-INT-38 Banelco / Pago Mis Cuentas (PMC) | M07. | Saliente y entrante. | O5 / Estándar. | Soportado por ProCoop; en LAG llega vía SIRO (no directo). |
| FI-INT-39 Rapipago | M07. | Entrante (y publicación si el convenio… | O5 / Estándar. | Soportado por ProCoop; en LAG vía SIRO. |

### SEC-INT-08 — Redes de cobranza extrabancaria (2)

**Fuente:** T06 §12.7. **Cubre:** FI-INT-40, FI-INT-41, FI-INT-42.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Pago Fácil
    participant X1 as Otros entes recaudadores
    participant X2 as Bancos recaudadores por archivo
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-40 Pago Fácil
    X0->>INT: Archivo pagofacil.rendicion .
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM07: Como FI-INT-39.
    Note right of X0: Como FI-INT-35.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos,…
    X1->>INT: Layout configurable ( fileLayouts ), PA-INT-12.
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM07: Como FI-INT-35.
    Note right of X1: Como FI-INT-35.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-42 Bancos recaudadores por archivo (Banco de Córdoba, Na…
    X2->>INT: Layout por banco.
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM07: Como FI-INT-35.
    Note right of X2: Como FI-INT-35.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-40 Pago Fácil | M07. | Entrante. | O5 / Estándar. | Soportado por ProCoop; en LAG vía SIRO. |
| FI-INT-41 Otros entes recaudadores (Cobro Express, Bapro Pagos, Provi… | M07. | Entrante/saliente. | O5 / Extensión. | Soportado por ProCoop (catálogo de importadores/exportadore… |
| FI-INT-42 Bancos recaudadores por archivo (Banco de Córdoba, Nación,… | M07. | Entrante (y publicación si aplica). | O5 / Estándar. | Soportado por ProCoop (importadores por banco); uso en LAG… |

### SEC-INT-09 — Pasarelas de pago y QR (1)

**Fuente:** T06 §12.8. **Cubre:** FI-INT-43, FI-INT-44, FI-INT-45, FI-INT-46, FI-INT-47, FI-INT-48.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Pagos360
    participant X1 as Mercado Pago
    participant X2 as QR interoperable
    participant X3 as Macro Click de Pago
    participant X4 as NaranjaX
    participant X5 as PayFun
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-43 Pagos360
    PM07->>INT: Operación por outbox (Por intención reporte diario.)
    INT->>X0: REST JSON con API key Bearer payment-request , adhesion , d…
    X0-->>INT: Pagador (nombre, email, documento), concepto, importe, venc…
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Patrón común. Adhesión en pending_to_sign sincronizada por JOB-INT-20.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-44 Mercado Pago
    PM07->>INT: Operación por outbox (Por intención conciliación diaria.)
    INT->>X1: REST JSON OAuth (access token por cuenta del tenant) prefer…
    X1-->>INT: Ítems/concepto, importe, external_reference = operación T06…
    INT-->>PM07: Resultado o evento de integración
    Note right of X1: Patrón común reembolso solo con aprobación.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-45 QR interoperable (Transferencias 3.0)
    PM07->>INT: Operación por outbox (Por cobro.)
    INT->>X2: QR EMVCo generado por el PSP confirmación por webhook + rec…
    X2-->>INT: Importe, referencia, estado.
    INT-->>PM07: Resultado o evento de integración
    Note right of X2: Patrón común polling con tope PRM-INT-023 mientras la pantalla de caj…
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-46 Macro Click de Pago (PlusPagos)
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X3: Formulario firmado/REST según el producto.
    X3-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X3: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-47 NaranjaX (Ranty)
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X4: REST con OAuth client credentials.
    X4-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X4: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-48 PayFun
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X5: REST.
    X5-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X5: Patrón común.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-43 Pagos360 | M07 / M19. | Bidireccional. | O5 / Estándar. | Confirmado no usado en LAG (credenciales vacías). |
| FI-INT-44 Mercado Pago | M07 / M19 / M11 (POS). | Bidireccional. | O5 / Estándar. | Soportado por ProCoop; confirmado no usado en LAG. |
| FI-INT-45 QR interoperable (Transferencias 3.0) | M07 / M11. | Bidireccional. | O5 / Estándar. | Nuevo (ProCoop usa QR de cada pasarela). |
| FI-INT-46 Macro Click de Pago (PlusPagos) | M07 / M19. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG; nombre de producto… |
| FI-INT-47 NaranjaX (Ranty) | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-48 PayFun | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |

### SEC-INT-10 — Pasarelas de pago y QR (2)

**Fuente:** T06 §12.8. **Cubre:** FI-INT-49, FI-INT-50, FI-INT-51, FI-INT-52, FI-INT-53, FI-INT-54.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Pagos TIC
    participant X1 as SiPago
    participant X2 as Helipagos
    participant X3 as ProntoPago
    participant X4 as ProvinciaNet QR
    participant X5 as DEBIN, Pagar y transferencias inme…
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-49 Pagos TIC (PayPerTIC)
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X0: REST.
    X0-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-50 SiPago (Geopagos)
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X1: REST.
    X1-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X1: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-51 Helipagos
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X2: REST.
    X2-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X2: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-52 ProntoPago
    PM07->>INT: Operación por outbox (Por intención.)
    INT->>X3: REST/archivo.
    X3-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X3: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-53 ProvinciaNet QR (Banco Provincia)
    PM07->>INT: Operación por outbox (Por cobro.)
    INT->>X4: REST.
    X4-->>INT: Patrón común.
    INT-->>PM07: Resultado o evento de integración
    Note right of X4: Patrón común.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-54 DEBIN, Pagar y transferencias inmediatas
    PM07->>INT: Operación por outbox (Por solicitud acreditaciones en tiempo…)
    INT->>X5: API del banco/PSP habilitado para DEBIN o CVU recaudador we…
    X5-->>INT: CUIT/CBU/alias del pagador, importe, referencia acreditacio…
    INT-->>PM07: Resultado o evento de integración
    Note right of X5: DEBIN vencido o rechazado ⇒ intención expired/rejected transferencias…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-49 Pagos TIC (PayPerTIC) | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-50 SiPago (Geopagos) | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-51 Helipagos | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-52 ProntoPago | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-53 ProvinciaNet QR (Banco Provincia) | M07. | Bidireccional. | Extensión bajo demanda: se ad… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-54 DEBIN, "Pagar" y transferencias inmediatas | M07 / M14 (cuentas recaudadoras). | Bidireccional. | O5 / Extensión. | A validar: "Pagar" figura en la lista de la tarea sin defin… |

### SEC-INT-11 — Pasarelas de pago y QR (3)

**Fuente:** T06 §12.8. **Cubre:** FI-INT-55.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Cupón offline
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-55 Cupón offline (contingencia de pasarelas)
    PM07->>INT: Operación por outbox (A demanda.)
    INT->>X0: PDF con código de FI-INT-34.
    X0-->>INT: Deuda, vencimientos, código.
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Es la contingencia.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-55 Cupón offline (contingencia de pasarelas) | M07 / M19. | Interna. | O5 / Núcleo. | Soportado por ProCoop (`Offline`). |

### SEC-INT-12 — Débito automático

**Fuente:** T06 §12.9. **Cubre:** FI-INT-56, FI-INT-57.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Débito directo en cuenta
    participant X1 as Débito automático con tarjetas
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-56 Débito directo en cuenta (CBU) por archivo bancario
    PM07->>INT: Operación por outbox (Por ciclo de facturación según calendar…)
    INT->>X0: Layouts por banco/estándar ( debito.cbu. banco ), con cabec…
    X0-->>INT: CBU (enmascarado en la UI), CUIT del titular, identificació…
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Rechazo ⇒ factura sigue impaga y se notifica (T09) rechazos repetidos…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-57 Débito automático con tarjetas (Visa, Mastercard, Cab…
    PM07->>INT: Operación por outbox (Mensual según día de débito (PRM-INT-04…)
    INT->>X1: Archivos por procesadora ( debito.tarjeta.visa , .master ,…
    X1-->>INT: Número de establecimiento, identificador del adherente, imp…
    INT-->>PM07: Resultado o evento de integración
    Note right of X1: Como FI-INT-56. Si el layout exige el PAN completo, el archivo se gen…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-56 Débito directo en cuenta (CBU) por archivo bancario | M07 (lote y aplicación), M01 (adhesión y mandato). | Saliente (presentación) y entrante (res… | O5 / Estándar. | Soportado por ProCoop; uso en LAG a confirmar (CTR-INT-21). |
| FI-INT-57 Débito automático con tarjetas (Visa, Mastercard, Cabal, Na… | M07 / M01. | Saliente y entrante. | O5 / Estándar. | Soportado por ProCoop (guarda números de tarjeta en tabla:… |

### SEC-INT-13 — Bancos

**Fuente:** T06 §12.10. **Cubre:** FI-INT-58, FI-INT-59, FI-INT-60.

```mermaid
sequenceDiagram
    autonumber
    participant PM14 as M14 TES
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Interbanking API
    participant X1 as Interbanking
    participant X2 as Extractos bancarios por archivo
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-58 Interbanking API (saldos y movimientos)
    X0->>INT: REST con OAuth2 client credentials (token de 7200 s cachead…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM14: CUIT de la empresa, cuentas (banco, tipo, número/CBU enmasc…
    Note right of X0: Deduplicación por cuenta + importe + correlativo + fechas (RN-INT-030…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-59 Interbanking archivos de pago a proveedores y sueldos
    PM14->>INT: Operación por outbox (Por orden de pago / liquidación.)
    INT->>X1: Layouts interbanking.pagos y interbanking.sueldos (y por ba…
    X1-->>INT: CBU destino, CUIT, importe, referencia, fecha.
    INT-->>PM14: Resultado o evento de integración
    Note right of X1: El archivo generado no marca el pago como realizado M14 lo confirma a…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-60 Extractos bancarios por archivo
    X2->>INT: Layout por banco ExcelImportWizard.
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM14: Movimientos.
    Note right of X2: Deduplicación igual a FI-INT-58.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-58 Interbanking API (saldos y movimientos) | M14 TES. | Entrante (consulta). | O8 / Estándar. | Soportado por ProCoop (`clsInterbanking`, `RESBAN_MOVINT`);… |
| FI-INT-59 Interbanking: archivos de pago a proveedores y sueldos | M14 (proveedores), M16 (sueldos). | Saliente. | O8 / Estándar. | Soportado por ProCoop; DFA lo menciona como "transferencias… |
| FI-INT-60 Extractos bancarios por archivo | M14. | Entrante. | O5 / Núcleo (DEC-059: extract… | Soportado por ProCoop. |

### SEC-INT-14 — Comunicaciones

**Fuente:** T06 §12.11. **Cubre:** FI-INT-61, FI-INT-62, FI-INT-63, FI-INT-64, FI-INT-65, FI-INT-66.

```mermaid
sequenceDiagram
    autonumber
    participant PT09 as T09 COM
    participant PM09 as M09 CRM
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Email transaccional y masivo
    participant X1 as Doppler
    participant X2 as WhatsApp
    participant X3 as SMS
    participant X4 as Notificaciones push
    participant X5 as IVR / telefonía de atención
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-61 Email transaccional y masivo
    PT09->>INT: Operación por outbox (Continuo masivos en lotes con tasa (PRM…)
    INT->>X0: API del proveedor de plataforma (tipo SES/SendGrid/Postmark…
    X0-->>INT: Remitente del dominio del tenant, destinatario, asunto, cue…
    INT-->>PT09: Resultado o evento de integración
    Note right of X0: Rebote duro ⇒ marca de email inválido en T09 failover a otra conexión…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-62 Doppler (email marketing)
    PT09->>INT: Operación por outbox (—)
    INT->>X1: REST.
    X1-->>INT: Suscriptores y listas.
    INT-->>PT09: Resultado o evento de integración
    Note right of X1: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-63 WhatsApp (Meta Cloud API / BSP Trii)
    PT09->>INT: Operación por outbox (Continuo ritmo por número (PRM-INT-034,…)
    INT->>X2: Meta WhatsApp Cloud API (REST Graph, plantillas, webhooks f…
    X2-->>INT: Número del destinatario, plantilla y variables, medios (PDF…
    INT-->>PT09: Resultado o evento de integración
    Note right of X2: Plantilla rechazada/ventana de 24 h vencida ⇒ error validation caída…
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-64 SMS
    PT09->>INT: Operación por outbox (Continuo.)
    INT->>X3: REST del proveedor elegido (PA-INT-06), lotes (PRM-INT-033).
    X3-->>INT: Número, texto (≤ 160 caracteres o concatenado).
    INT-->>PT09: Resultado o evento de integración
    Note right of X3: Failover a segundo proveedor si está configurado.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-65 Notificaciones push (PWA y app)
    PT09->>INT: Operación por outbox (Continuo.)
    INT->>X4: Web Push (VAPID) y FCM/APNs para apps nativas si existieran.
    X4-->>INT: Token de dispositivo, título, cuerpo, enlace profundo (sin…
    INT-->>PT09: Resultado o evento de integración
    Note right of X4: Token inválido ⇒ baja del dispositivo.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-66 IVR / telefonía de atención
    PM09->>INT: Operación por outbox (Por llamada.)
    INT->>X5: Webhooks/API del proveedor de telefonía en la nube (SIP/CPa…
    X5-->>INT: Número llamante, identificador de cuenta, opciones elegidas…
    INT-->>PM09: Resultado o evento de integración
    Note right of X5: Sin API ⇒ el IVR deriva a operador.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-61 Email transaccional y masivo | T09 COM (contenido); T06 (entrega). | Saliente + webhooks de estado; entrante… | O0–O2 / Núcleo. | Confirmado en LAG (`AUDIT_MAIL`, SES del proveedor comparti… |
| FI-INT-62 Doppler (email marketing) | T09. | Saliente. | — / Reemplazado por FI-INT-61… | Soportado por ProCoop; no usado en LAG. |
| FI-INT-63 WhatsApp (Meta Cloud API / BSP; Trii) | T09 / M09. | Bidireccional. | O2 / Estándar. | Soportado por ProCoop (parámetros 2870–2874, 3105; 2824/305… |
| FI-INT-64 SMS | T09; T02 (códigos OTP). | Saliente + estados. | O2 / Estándar. | Soportado por ProCoop (proveedor local con lotes de 50); CT… |
| FI-INT-65 Notificaciones push (PWA y app) | T09; M19, M10 (app de campo). | Saliente. | O2 / Estándar. | Nuevo (ProCoop usa Firebase para sincronizar, no para push… |
| FI-INT-66 IVR / telefonía de atención | M09 CRM; T09. | Bidireccional (el IVR consulta la API i… | O10 / Extensión. | Soportado por ProCoop (tabla `IVR`); uso en LAG a confirmar. |

### SEC-INT-15 — Identidad, mapas y geografía

**Fuente:** T06 §12.12. **Cubre:** FI-INT-67, FI-INT-68, FI-INT-69, FI-INT-70, FI-INT-71, FI-INT-72.

```mermaid
sequenceDiagram
    autonumber
    participant PT02 as T02 IAM
    participant PT03 as T03 UXD
    participant PM01 as M01 PER
    participant PT04 as T04 CFG
    participant PM10 as M10 TEC
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Google
    participant X1 as CiDi
    participant X2 as Google Maps
    participant X3 as Geocodificación y Places
    participant X4 as Georef
    participant X5 as GIS / KML de redes
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-67 Google (OIDC) para acceso de usuarios y socios
    PT02->>INT: Operación por outbox (Por inicio de sesión.)
    INT->>X0: OpenID Connect con PKCE.
    X0-->>INT: sub , email verificado, nombre.
    INT-->>PT02: Resultado o evento de integración
    Note right of X0: Caída ⇒ login con usuario y clave.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-68 CiDi (Ciudadano Digital Córdoba)
    PT02->>INT: Operación por outbox (Por inicio de sesión.)
    INT->>X1: Integración oficial de CiDi para aplicaciones de terceros V…
    X1-->>INT: CUIL, nombre, nivel de validación, email.
    INT-->>PT02: Resultado o evento de integración
    Note right of X1: Caída ⇒ login alternativo.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-69 Google Maps (mapas y Static Maps)
    PT03->>INT: Operación por outbox (Interactivo.)
    INT->>X2: Maps JavaScript API, Static Maps API.
    X2-->>INT: Coordenadas (sin datos personales en la URL).
    INT-->>PT03: Resultado o evento de integración
    Note right of X2: Sin clave/cuota ⇒ mapa base libre (OpenStreetMap).
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-70 Geocodificación y Places
    PM01->>INT: Operación por outbox (A demanda nunca masivo en migración (la…)
    INT->>X3: Places Autocomplete Geocoding API solo como respaldo habili…
    X3-->>INT: Texto de dirección ⇒ candidatos y componentes coordenadas c…
    INT-->>PM01: Resultado o evento de integración
    Note right of X3: Sin resultado ⇒ ubicación manual en mapa, estado pendiente de georref…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-71 Georef (API de normalización geográfica de Argentina)
    PT04->>INT: Operación por outbox (Carga inicial y actualización periódica…)
    INT->>X4: REST pública del Estado nacional (normalización de direccio…
    X4-->>INT: Nombres y códigos geográficos dirección ⇒ dirección normali…
    INT-->>PT04: Resultado o evento de integración
    Note right of X4: Caché local de tablas sin coincidencia ⇒ respaldo de Google si está h…
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-72 GIS / KML de redes
    PM10->>INT: Operación por outbox (A demanda.)
    INT->>X5: KML, GeoJSON, Shapefile.
    X5-->>INT: Geometrías y atributos técnicos.
    INT-->>PM10: Resultado o evento de integración
    Note right of X5: Validación de geometría y sistema de referencia.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-67 Google (OIDC) para acceso de usuarios y socios | T02 IAM. | Bidireccional (OIDC). | O1 / Estándar. | Nuevo. |
| FI-INT-68 CiDi (Ciudadano Digital Córdoba) | T02 / M19. | Bidireccional. | O1 mecanismo genérico de prov… | Nuevo (pedido de la tarea). |
| FI-INT-69 Google Maps (mapas y Static Maps) | T03 (componente de mapa); consumidores M10, M03, M09, M18. | Saliente. | O3 / Estándar. | Confirmado en LAG (parámetro 2251; clave por defecto hardco… |
| FI-INT-70 Geocodificación y Places | M01 / M03. | Saliente. | O3 / Estándar. | Soportado por ProCoop (solo Google); el reparto con Georef… |
| FI-INT-71 Georef (API de normalización geográfica de Argentina) | T04 (tablas geográficas) / M01 (domicilios). | Saliente. | O1 / Estándar (tablas); O3 /… | Nuevo. |
| FI-INT-72 GIS / KML de redes | M10 TEC (GIS/redes); M03. | Bidireccional (archivos). | O3 / Extensión. | Soportado por ProCoop (exportación KML). |

### SEC-INT-16 — Medición, telemedición y prepago

**Fuente:** T06 §12.13. **Cubre:** FI-INT-73, FI-INT-74, FI-INT-75, FI-INT-76, FI-INT-77, FI-INT-78.

```mermaid
sequenceDiagram
    autonumber
    participant PM03 as M03 MED
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Colectores portátiles de lectura
    participant X1 as PMovil / Captor
    participant X2 as Telemedición AMI / MDM
    participant X3 as Discar
    participant X4 as Medidores prepagos
    participant X5 as Mi Medidor
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-73 Colectores portátiles de lectura (PSION / MTP y simil…
    PM03->>INT: Operación por outbox (Por ciclo de lectura.)
    INT->>X0: Archivos de ruta y de lecturas por layout del equipo ( cole…
    X0-->>INT: Ruta, orden, medidor, lectura anterior, rangos de control l…
    INT-->>PM03: Resultado o evento de integración
    Note right of X0: Lecturas fuera de rango a revisión (regla de M03) archivo duplicado p…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-74 PMovil / Captor (app de campo de ProCoop)
    PM03->>INT: Operación por outbox (—)
    INT->>X1: Sincronización propietaria.
    X1-->>INT: Rutas, lecturas, órdenes.
    INT-->>PM03: Resultado o evento de integración
    Note right of X1: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-75 Telemedición AMI / MDM
    PM03->>INT: Operación por outbox (Lecturas diarias o por intervalo (JOB-I…)
    INT->>X2: Un adaptador por sistema de cabecera REST/SOAP/archivo segú…
    X2-->>INT: Número de medidor, fecha/hora, registros (activa, reactiva,…
    INT-->>PM03: Resultado o evento de integración
    Note right of X2: Comando sin respuesta ⇒ uncertain y consulta de estado antes de reint…
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-76 Discar (medición y gestión remota)
    PM03->>INT: Operación por outbox (Como FI-INT-75.)
    INT->>X3: Adaptador del contrato canónico de FI-INT-75.
    X3-->>INT: Como FI-INT-75.
    INT-->>PM03: Resultado o evento de integración
    Note right of X3: Como FI-INT-75.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-77 Medidores prepagos (generación de tokens)
    PM03->>INT: Operación por outbox (Por recarga (≈ 70 de las solicitudes SI…)
    INT->>X4: Adaptador por sistema de venta (CashPower, C_Token, NEXO, B…
    X4-->>INT: Número de medidor, importe/energía, tarifa respuesta con to…
    INT-->>PM03: Resultado o evento de integración
    Note right of X4: Pago confirmado sin token ⇒ reintento idempotente por número de trans…
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-78 Mi Medidor (Mr. Dims)
    X5->>INT: REST del proveedor.
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM03: Medidor, consumos.
    Note right of X5: Sin datos ⇒ el portal muestra el último consumo facturado.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-73 Colectores portátiles de lectura (PSION / MTP y similares) | M03 MED. | Bidireccional (archivos). | O7 / Estándar (solo si la coo… | Soportado por ProCoop; uso en LAG a confirmar. |
| FI-INT-74 PMovil / Captor (app de campo de ProCoop) | M03 / M10. | Bidireccional. | — / Reemplazado por la PWA de… | Soportado por ProCoop. |
| FI-INT-75 Telemedición AMI / MDM | M03 MED (lecturas); M08 (corte/reconexión decididos); M10 (operación técnica). | Bidireccional. | O7 / Estándar (primer adaptad… | Soportado por ProCoop (`TELEMED_COMM`, `AUDITORIA_TELEMEDIC`… |
| FI-INT-76 Discar (medición y gestión remota) | M03. | Bidireccional. | O7 / Extensión. | Soportado por ProCoop. |
| FI-INT-77 Medidores prepagos (generación de tokens) | M03 (saldo prepago) / M07 (cobro). | Saliente con respuesta inmediata. | O7 / Núcleo (la base relevada… | Confirmado en LAG (uso de prepago); sistema de tokens exact… |
| FI-INT-78 Mi Medidor (Mr. Dims) | M03 / M19. | Entrante. | O7 / Extensión. | Soportado por ProCoop; uso en LAG a confirmar. |

### SEC-INT-17 — Red, aprovisionamiento y telefonía (servicios TIC) (1)

**Fuente:** T06 §12.14. **Cubre:** FI-INT-79, FI-INT-80, FI-INT-81, FI-INT-82, FI-INT-83, FI-INT-84.

```mermaid
sequenceDiagram
    autonumber
    participant PM10 as M10 TEC
    participant INT as T06 conectores, cola y bitácora
    participant X0 as MikroTik
    participant X1 as RADIUS
    participant X2 as SmartOLT
    participant X3 as Wispro
    participant X4 as Otros gestores ISP
    participant X5 as Centrales telefónicas
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-79 MikroTik (RouterOS)
    PM10->>INT: Operación por outbox (Por evento de alta/cambio/suspensión.)
    INT->>X0: API de RouterOS (TLS) o REST (v7).
    X0-->>INT: Usuario PPPoE/IP, plan (velocidad), estado.
    INT-->>PM10: Resultado o evento de integración
    Note right of X0: Resultado incierto ⇒ lectura de estado antes de reintentar (RN-INT-06…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-80 RADIUS
    PM10->>INT: Operación por outbox (Por evento contabilidad diaria.)
    INT->>X1: Base de datos/API del servidor RADIUS (FreeRADIUS u otro) m…
    X1-->>INT: Usuario, plan, estado sesiones y consumo.
    INT-->>PM10: Resultado o evento de integración
    Note right of X1: Como FI-INT-79.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-81 SmartOLT (FTTH)
    PM10->>INT: Operación por outbox (Por evento.)
    INT->>X2: REST con API key.
    X2-->>INT: Serie de ONU, OLT/puerto, perfil, estado y señal.
    INT-->>PM10: Resultado o evento de integración
    Note right of X2: Como FI-INT-79.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-82 Wispro
    PM10->>INT: Operación por outbox (Por evento.)
    INT->>X3: REST.
    X3-->>INT: Cliente, contrato, plan, estado.
    INT-->>PM10: Resultado o evento de integración
    Note right of X3: Como FI-INT-79.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-83 Otros gestores ISP (Ispfull, Sopnet y similares)
    PM10->>INT: Operación por outbox (Por evento.)
    INT->>X4: Adaptador por plataforma sobre el contrato canónico de apro…
    X4-->>INT: Como FI-INT-82.
    INT-->>PM10: Resultado o evento de integración
    Note right of X4: Como FI-INT-79.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-84 Centrales telefónicas (CDR)
    X5->>INT: Archivos CDR por central (layout por marca) vía SFTP/agente…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM10: Origen, destino, fecha/hora, duración, troncal.
    Note right of X5: Archivo faltante ⇒ alerta antes del cierre de facturación duplicados…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-79 MikroTik (RouterOS) | M10 TEC (aprovisionamiento); M08 decide suspensión/reconexión. | Saliente. | O3 / Núcleo (piloto Internet). | Soportado por ProCoop; uso en LAG a confirmar. |
| FI-INT-80 RADIUS | M10. | Saliente (ABM) y entrante (contabilidad… | O3 / Estándar. | Soportado por ProCoop. |
| FI-INT-81 SmartOLT (FTTH) | M10. | Saliente + consulta. | O3 / Estándar. | Soportado por ProCoop. |
| FI-INT-82 Wispro | M10. | Bidireccional. | O3 / Extensión. | Soportado por ProCoop. |
| FI-INT-83 Otros gestores ISP (Ispfull, Sopnet y similares) | M10. | Bidireccional. | O3 / Extensión (bajo demanda). | Soportado por ProCoop. |
| FI-INT-84 Centrales telefónicas (CDR) | M10 (telefonía) / M03 (consumo) / M05 (facturación). | Entrante. | O10 / Extensión (si presta te… | Soportado por ProCoop. |

### SEC-INT-18 — Red, aprovisionamiento y telefonía (servicios TIC) (2)

**Fuente:** T06 §12.14. **Cubre:** FI-INT-85, FI-INT-86, FI-INT-87.

```mermaid
sequenceDiagram
    autonumber
    participant PM10 as M10 TEC
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Telefonía móvil revendida
    participant X1 as TV / sistemas de acceso condicional
    participant X2 as SITSA
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-85 Telefonía móvil revendida (Claro / Personal)
    X0->>INT: Archivo del operador.
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM10: Línea, plan, consumos, importes.
    Note right of X0: Líneas sin titular a bandeja.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-86 TV / sistemas de acceso condicional (CAS) y Sensa
    PM10->>INT: Operación por outbox (Por evento.)
    INT->>X1: API del CAS o del middleware (Sensa como proveedor de TV CT…
    X1-->>INT: Serie de decodificador, paquetes, estado. Detalle en Contra…
    INT-->>PM10: Resultado o evento de integración
    Note right of X1: Como FI-INT-79.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-87 SITSA
    PM10->>INT: Operación por outbox (—)
    INT->>X2: A validar.
    X2-->>INT: A validar.
    INT-->>PM10: Resultado o evento de integración
    Note right of X2: —
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-85 Telefonía móvil revendida (Claro / Personal) | M10 / M05. | Entrante. | O10 / Extensión. | Soportado por ProCoop. |
| FI-INT-86 TV / sistemas de acceso condicional (CAS) y Sensa | M10 / M02 (paquetes). | Saliente. | O10 / Extensión. | Soportado por ProCoop. |
| FI-INT-87 SITSA | M10. | A validar. | O10 / Extensión. | Soportado por ProCoop; [VERIFICAR] qué es SITSA y si LAG lo… |

### SEC-INT-19 — Flota, firma e inteligencia artificial

**Fuente:** T06 §12.15. **Cubre:** FI-INT-88, FI-INT-89, FI-INT-90.

```mermaid
sequenceDiagram
    autonumber
    participant PM18 as M18 SOC
    participant PT11 as T11 WFL
    participant PM09 as M09 CRM
    participant INT as T06 conectores, cola y bitácora
    participant X0 as GPS / AVL de flota
    participant X1 as Firma digital y electrónica
    participant X2 as Proveedores de IA
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-88 GPS / AVL de flota
    X0->>INT: API del proveedor de rastreo (REST/webhook) (JOB-INT-24).
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM18: Patente/equipo, lat/long, velocidad, fecha, eventos (encend…
    Note right of X0: Sin datos ⇒ ubicación declarada por el técnico en la app.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-89 Firma digital y electrónica (Encustody u otro)
    PT11->>INT: Operación por outbox (Por documento.)
    INT->>X1: REST del proveedor documento PDF por URL firmada webhook +…
    X1-->>INT: PDF, firmantes (nombre, email, CUIL), orden de firma result…
    INT-->>PT11: Resultado o evento de integración
    Note right of X1: Sin firma en plazo ⇒ recordatorio y vencimiento contingencia firma ol…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-90 Proveedores de IA (LLM)
    PM09->>INT: Operación por outbox (A demanda, con cuota por tenant.)
    INT->>X2: API HTTPS del proveedor con abstracción multi-proveedor (RF…
    X2-->>INT: Texto o imagen con datos personales redactados cuando no so…
    INT-->>PM09: Resultado o evento de integración
    Note right of X2: Sin IA ⇒ el flujo sigue manual nunca ejecuta acciones sin confirmació…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-88 GPS / AVL de flota | M18 (flota); M10 (despacho de cuadrillas). | Entrante. | O10 / Extensión. | Nuevo (pedido de la tarea). |
| FI-INT-89 Firma digital y electrónica (Encustody u otro) | T11 (expediente documental); consumidores M01, M08, M16, M17. | Bidireccional (envío del documento y we… | O3 / Estándar (firma de la in… | Soportado por ProCoop (Encustody); uso en LAG a confirmar. |
| FI-INT-90 Proveedores de IA (LLM) | T06 (conector); consumidores M09, M12, T10. | Saliente. | O6 / Estándar para clasificar… | Soportado por ProCoop (`AUDIT_IA`); uso en LAG a confirmar. |

### SEC-INT-20 — Hardware local

**Fuente:** T06 §12.16. **Cubre:** FI-INT-91, FI-INT-92, FI-INT-93, FI-INT-94, FI-INT-95.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant PM09 as M09 CRM
    participant PM11 as M11 VEN
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Agente local GoodApps
    participant X1 as Impresoras térmicas y controladore…
    participant X2 as Lectores de tarjeta, validadores d…
    participant X3 as Turnero
    participant X4 as Balanzas, escáneres, lectores de c…
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-91 Agente local GoodApps
    PM07->>INT: Operación por outbox (Continuo.)
    INT->>X0: WebSocket TLS iniciado por el agente comandos firmados con…
    X0-->>INT: Comandos (imprimir, leer, mostrar turno) y resultados inven…
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Agente desconectado ⇒ int.agent.offline , alerta y degradación (PDF p…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-92 Impresoras térmicas y controladores fiscales
    PM07->>INT: Operación por outbox (Por operación.)
    INT->>X1: ESC/POS por agente protocolo del fabricante para controlado…
    X1-->>INT: Contenido del comprobante.
    INT-->>PM07: Resultado o evento de integración
    Note right of X1: Impresora sin papel/apagada ⇒ PDF y reimpresión.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-93 Lectores de tarjeta, validadores de billetes y tótem…
    PM07->>INT: Operación por outbox (Por cobro.)
    INT->>X2: SDK del adquirente/POS integrado por agente el tótem usa la…
    X2-->>INT: Importe, referencia resultado con autorización y últimos 4…
    INT-->>PM07: Resultado o evento de integración
    Note right of X2: Resultado incierto ⇒ consulta al adquirente antes de reintentar.
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-94 Turnero
    PM09->>INT: Operación por outbox (Continuo.)
    INT->>X3: Pantalla web (PWA en modo pantalla) y dispensador de ticket…
    X3-->>INT: Número de turno, motivo, puesto.
    INT-->>PM09: Resultado o evento de integración
    Note right of X3: Sin agente ⇒ turnos solo en pantalla.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-95 Balanzas, escáneres, lectores de código y dispensador…
    X4->>INT: Lectores como teclado (sin integración) balanza y escáner p…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM11: Peso, código, imagen.
    Note right of X4: Carga manual.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-91 Agente local GoodApps | T06; consumidores M07, M09, M11, M03, M10. | Bidireccional por canal saliente desde… | O10 / Estándar (O5 si una suc… | Nuevo; reemplaza el Agente/Integra de ProCoop (RN-10 §12). |
| FI-INT-92 Impresoras térmicas y controladores fiscales | M07 (caja), M11 (POS). | Saliente. | O10 / Estándar. | Soportado por ProCoop. |
| FI-INT-93 Lectores de tarjeta, validadores de billetes y tótem de aut… | M07. | Bidireccional. | O10 / Extensión. | Soportado por ProCoop (tótem con HTML local que pedía datos… |
| FI-INT-94 Turnero | M09 CRM. | Bidireccional. | O10 / Extensión. | Soportado por ProCoop. |
| FI-INT-95 Balanzas, escáneres, lectores de código y dispensadores | M11, M13, T11 (digitalización). | Entrante. | O10 / Extensión. | Soportado por ProCoop. |

### SEC-INT-21 — Datos, legado y servicios de plataforma (1)

**Fuente:** T06 §12.17. **Cubre:** FI-INT-96, FI-INT-97, FI-INT-98, FI-INT-99, FI-INT-100, FI-INT-101.

```mermaid
sequenceDiagram
    autonumber
    participant PT07 as T07 MIG
    participant PT10 as T10 BIA
    participant PM15 as M15 CON
    participant PM19 as M19 POR
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Importación de planillas y archivos
    participant X1 as Migración desde ProCoop
    participant X2 as Power BI y herramientas de análisis
    participant X3 as Sistema contable externo
    participant X4 as API para terceros
    participant X5 as CoopOnline
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-96 Importación de planillas y archivos (Excel, CSV, DBF,…
    X0->>INT: XLSX/CSV DBF y MDB solo en importación controlada en servid…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    Note right of X0: Vista previa con errores por línea, aplicación idempotente.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-97 Migración desde ProCoop
    X1->>INT: Ver T07. T06 aporta externalReferences (RF-INT-078) y la re…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PT07: Ver T07.
    Note right of X1: Ver T07.
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-98 Power BI y herramientas de análisis
    PT10->>INT: Operación por outbox (—)
    INT->>X2: Ver T10 (API de lectura / exportación).
    X2-->>INT: Ver T10.
    INT-->>PT10: Resultado o evento de integración
    Note right of X2: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-99 Sistema contable externo (SISCONT y similares)
    PM15->>INT: Operación por outbox (Mensual/diaria.)
    INT->>X3: Archivo por layout del sistema destino.
    X3-->>INT: Asientos, cuentas, centros de costo.
    INT-->>PM15: Resultado o evento de integración
    Note right of X3: Generado ≠ importado reexportación versionada.
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-100 API para terceros (Integra / WS_KEYS)
    X4->>INT: Ver T10 ( /api/v1/ext/... , token por cliente, alcance, lím…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PT10: Ver T10.
    Note right of X4: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-101 CoopOnline (portal y app sincronizados por Firebase/…
    PM19->>INT: Operación por outbox (—)
    INT->>X5: —
    X5-->>INT: —
    INT-->>PM19: Resultado o evento de integración
    Note right of X5: Redirecciones de links viejos durante la transición (PA-INT-17).
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-96 Importación de planillas y archivos (Excel, CSV, DBF, Acces… | T06 (motor); dueño = módulo destino. | Entrante. | O1 / Núcleo. | Soportado por ProCoop (`clsImportacionArchivos`). |
| FI-INT-97 Migración desde ProCoop | T07 MIG. | Entrante. | O0–O11 / Núcleo. | Ver T07. |
| FI-INT-98 Power BI y herramientas de análisis | T10 BIA. | Saliente. | Ver T10. | Soportado por ProCoop. |
| FI-INT-99 Sistema contable externo (SISCONT y similares) | M15 CON. | Saliente. | O8 / Extensión. | Soportado por ProCoop. |
| FI-INT-100 API para terceros (Integra / WS_KEYS) | T10 BIA. | Entrante. | Ver T10. | Soportado por ProCoop (Integra). |
| FI-INT-101 CoopOnline (portal y app sincronizados por Firebase/MySQL/F… | M19. | — | — / Reemplazado por M19 sobre… | Confirmado en LAG. |
