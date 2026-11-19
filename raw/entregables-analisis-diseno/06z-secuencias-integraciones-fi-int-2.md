# GoodApps Cooperativas — Diagramas de secuencia de integraciones externas, parte Z

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), fichas FI-INT de T06**

| Campo | Valor |
|---|---|
| Documento | `06z-secuencias-integraciones-fi-int-2.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T06 §12.3 a §12.18 (fichas FI-INT-01 a FI-INT-115) |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada ficha FI-INT de T06 se dibuja con el mismo molde: el módulo dueño encola la operación, T06 la ejecuta con credenciales de la bóveda, idempotencia, circuito y bitácora, y devuelve el resultado o publica un evento de integración. En las fichas entrantes el proveedor inicia el intercambio (webhook o archivo). La nota a la derecha resume "Errores y contingencia" de la ficha. Cuando el dueño es T06 sin otro módulo, el intercambio empieza y termina en T06.

## 2. Integraciones externas (fichas FI-INT de T06)

### SEC-INT-22 — Datos, legado y servicios de plataforma (2)

**Fuente:** T06 §12.17. **Cubre:** FI-INT-102, FI-INT-103, FI-INT-104, FI-INT-105, FI-INT-106.

```mermaid
sequenceDiagram
    autonumber
    participant PT01 as T01 PLA
    participant PT07 as T07 MIG
    participant PT04 as T04 CFG
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Almacenamiento de objetos, SFTP y…
    participant X1 as Servicios del proveedor de ProCoop
    participant X2 as Office interop
    participant X3 as ProCoop 6 / tablas DBF heredadas
    participant X4 as Calendario de feriados nacionales
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-102 Almacenamiento de objetos, SFTP y FTP
    PT01->>INT: Operación por outbox (Continuo.)
    INT->>X0: Almacenamiento compatible S3 con prefijo por tenant y URLs…
    X0-->>INT: Archivos.
    INT-->>PT01: Resultado o evento de integración
    Note right of X0: Reintentos descarga manual.
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-103 Servicios del proveedor de ProCoop (RSS, encuestas,…
    INT->>X1: —
    X1-->>INT: —
    Note right of X1: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-104 Office interop (Excel, Word, Access)
    INT->>X2: —
    X2-->>INT: —
    Note right of X2: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-105 ProCoop 6 / tablas DBF heredadas
    X3->>INT: DBF por importación controlada (FI-INT-96).
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PT07: Históricos.
    Note right of X3: —
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-106 Calendario de feriados nacionales
    X4->>INT: Fuente pública oficial VERIFICAR disponibilidad de API si n…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PT04: Fecha, tipo, jurisdicción.
    Note right of X4: Carga manual auditada.
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-102 Almacenamiento de objetos, SFTP y FTP | T01 (almacenamiento) / T06 (transporte). | Bidireccional. | O0 / Núcleo. | Soportado por ProCoop (`TransferirFTP`, S3 del proveedor). |
| FI-INT-103 Servicios del proveedor de ProCoop (RSS, encuestas, soporte… | — | — | — / Descartado (no aplica a u… | Soportado por ProCoop. |
| FI-INT-104 Office interop (Excel, Word, Access) | — | — | — / Reemplazado por exportaci… | Soportado por ProCoop. |
| FI-INT-105 ProCoop 6 / tablas DBF heredadas | T07. | Entrante (una sola vez). | Según T07 / Extensión. | Soportado por ProCoop; existencia de históricos DBF en LAG… |
| FI-INT-106 Calendario de feriados nacionales | T04 CFG. | Entrante. | O1 / Estándar. | Nuevo. |

### SEC-INT-23 — Integraciones adicionales de la BASE y de las fuentes de ProCoop (1)

**Fuente:** T06 §12.18. **Cubre:** FI-INT-107, FI-INT-108, FI-INT-109, FI-INT-110, FI-INT-111, FI-INT-112.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant PM05 as M05 FAC
    participant PM10 as M10 TEC
    participant PM01 as M01 PER
    participant PT01 as T01 PLA
    participant INT as T06 conectores, cola y bitácora
    participant X0 as Cobranza fuera de oficina y puntos…
    participant X1 as Imprenta y distribución física de…
    participant X2 as Monitoreo de red y equipos ISP
    participant X3 as Registro de electrodependientes
    participant X4 as Exportación integral de datos del…
    participant X5 as Correo provisto a socios
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-107 Cobranza fuera de oficina y puntos de venta remotos…
    PM07->>INT: Operación por outbox (Por cobro sincronización al recuperar c…)
    INT->>X0: PWA de cobrador/punto de venta sobre la API interna, con co…
    X0-->>INT: Lista de cobro, comprobantes a cancelar, cobros (importe, m…
    INT-->>PM07: Resultado o evento de integración
    Note right of X0: Sin conexión ⇒ recibo provisorio numerado por dispositivo y sincroniz…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-108 Imprenta y distribución física de facturas
    PM05->>INT: Operación por outbox (Por ciclo de facturación.)
    INT->>X1: PDF unificado o por ruta y archivo índice (CSV) por layout…
    X1-->>INT: Facturas ya autorizadas, ruta, secuencia, mensaje personali…
    INT-->>PM05: Resultado o evento de integración
    Note right of X1: Archivo rechazado por la imprenta ⇒ regeneración versionada el lote n…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-109 Monitoreo de red y equipos ISP
    X2->>INT: Webhook de alertas del sistema de monitoreo de la cooperati…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM10: Equipo, nodo, severidad, inicio y fin del evento.
    Note right of X2: Sin alertas ⇒ M10 declara el incidente a mano una alerta repetida no…
    end
    rect rgb(245, 245, 245)
    Note over INT,X3: FI-INT-110 Registro de electrodependientes
    X3->>INT: Por ahora carga manual con certificado adjunto (T11) o plan…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM01: Documento, suministro, vigencia y constancia. Es un dato de…
    Note right of X3: Ante duda se mantiene la protección el vencimiento genera aviso, no l…
    end
    rect rgb(245, 245, 245)
    Note over INT,X4: FI-INT-111 Exportación integral de datos del tenant (salida del…
    PT01->>INT: Operación por outbox (Única (salida) o a pedido, con permiso…)
    INT->>X4: Paquete de archivos (JSON/CSV por colección, PDF y adjuntos…
    X4-->>INT: Datos de negocio del tenant. **Se excluyen** los secretos d…
    INT-->>PT01: Resultado o evento de integración
    Note right of X4: Paquete parcial ⇒ reanudación por manifiesto.
    end
    rect rgb(245, 245, 245)
    Note over INT,X5: FI-INT-112 Correo provisto a socios (casillas)
    PM10->>INT: Operación por outbox (Por alta, baja o mora consumo una vez p…)
    INT->>X5: API del panel del hosting de correo de la cooperativa VERIF…
    X5-->>INT: Dirección, plan o cuota, estado. La contraseña la define el…
    INT-->>PM10: Resultado o evento de integración
    Note right of X5: Comando incierto ⇒ consulta de estado antes de reintentar (como FI-IN…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-107 Cobranza fuera de oficina y puntos de venta remotos de prep… | M07 COB (cobranza y rendición); M03 MED (venta de prepago); T06 aporta el canal… | Bidireccional. | O5 / Extensión (cobrador); O7… | Soportado por ProCoop (R-Pos, según BASE [MER1]); uso en LA… |
| FI-INT-108 Imprenta y distribución física de facturas | M05 FAC (lote y orden de impresión); T09 COM (constancia de entrega). | Bidireccional. | O5 / Estándar. | Nuevo (BASE); ProCoop imprime en la cooperativa. |
| FI-INT-109 Monitoreo de red y equipos ISP | M10 TEC (incidentes de zona); M09 CRM (aviso a los afectados). | Entrante. | O10 / Extensión. | Nuevo (BASE; el benchmark lo atribuye a otro proveedor). |
| FI-INT-110 Registro de electrodependientes | M01 PER / M03 (marca del suministro); M08 MOR (bloqueo de corte). | Entrante. | O7 / Estándar (carga manual);… | Nuevo (BASE §87 cita regímenes nacionales y provinciales). |
| FI-INT-111 Exportación integral de datos del tenant (salida del client… | T01 PLA (proceso de salida); T10 BIA (formatos); T06 aporta el transporte. | Saliente. | O11 / Estándar. | Nuevo. |
| FI-INT-112 Correo provisto a socios (casillas) | M10 TEC (servicio); T06 (conector). | Saliente. | O10 / Extensión. | Soportado por ProCoop (`CORREOSINT`, que guarda contraseñas… |

### SEC-INT-24 — Integraciones adicionales de la BASE y de las fuentes de ProCoop (2)

**Fuente:** T06 §12.18. **Cubre:** FI-INT-113, FI-INT-114, FI-INT-115.

```mermaid
sequenceDiagram
    autonumber
    participant PM01 as M01 PER
    participant PM02 as M02 CAT
    participant PM12 as M12 CMP
    participant INT as T06 conectores, cola y bitácora
    participant X0 as GIS externo de la cooperativa y ca…
    participant X1 as Distribuidora de gas de referencia
    participant X2 as Distribuidora de gas
    rect rgb(245, 245, 245)
    Note over INT,X0: FI-INT-113 GIS externo de la cooperativa y catastro de parcelas
    PM01->>INT: Operación por outbox (Carga inicial y actualizaciones.)
    INT->>X0: Importación de parcelas por archivo (SHP, GeoJSON, KML o CS…
    X0-->>INT: Nomenclatura catastral, polígono o centroide, vínculo con e…
    INT-->>PM01: Resultado o evento de integración
    Note right of X0: Parcelas sin coincidencia ⇒ bandeja de revisión nunca se reasigna un…
    end
    rect rgb(245, 245, 245)
    Note over INT,X1: FI-INT-114 Distribuidora de gas de referencia intercambio de fo…
    PM02->>INT: Operación por outbox (Por trámite (alta, ampliación, rehabili…)
    INT->>X1: Sin API pública relevada (a) generación de los formularios…
    X1-->>INT: Número de trámite, datos del suministro e inmueble, matricu…
    INT-->>PM02: Resultado o evento de integración
    Note right of X1: Trámite sin respuesta en el plazo configurado ⇒ alerta al responsable…
    end
    rect rgb(245, 245, 245)
    Note over INT,X2: FI-INT-115 Distribuidora de gas factura de compra de abastecimi…
    X2->>INT: Archivo de la distribuidora (layout en fileLayouts , COL-IN…
    INT->>INT: Verifica firma, deduplica y registra en bitácora
    INT->>PM12: Punto de compra, período, m³ medidos y corregidos, poder ca…
    Note right of X2: Archivo repetido ⇒ sin duplicado (idempotencia de RF-CMP-149) factor…
    end
```

| Ficha | Módulo dueño | Dirección | Ola / prioridad | Estado de la investigación |
|---|---|---|---|---|
| FI-INT-113 GIS externo de la cooperativa y catastro de parcelas | M01 / M03 (inmueble y suministro); M10 (redes, con FI-INT-72). | Bidireccional. | O3 / Extensión. | Soportado por ProCoop (`Import_Parcelas`, GIS por cooperati… |
| FI-INT-114 Distribuidora de gas de referencia: intercambio de formular… | M02 (legajo y documentos del contrato GAS); M10 (factibilidad, inspección y OT… | Bidireccional. | O7 / Extensión (solo tenants… | A relevar con la distribuidora del tenant piloto (formulari… |
| FI-INT-115 Distribuidora de gas: factura de compra de abastecimiento | M12 (comprobante y control); M03 (volumen medido en el punto de compra, API-MED… | Entrante. | O8 / Estándar (solo tenants s… | A relevar con la distribuidora del tenant piloto (layout y… |
