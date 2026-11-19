# Fichas de integraciones externas

Versión: 0.1 (borrador para validar)
Fecha: 3/11/2026
Complementa la sección 30 (Módulo 29 — Integraciones externas) de [definicion-funcional-alcance.md](definicion-funcional-alcance.md).

## 0. Cómo leer este documento

Cada ficha describe una integración que el sistema nuevo necesita para reemplazar a Procoop: qué intercambia, por qué medio, cada cuánto, de qué módulos depende y qué falta averiguar.

**Marcas de evidencia:** se usan las mismas del documento de alcance ([P] pantalla, [M] menú, [T] tabla, [I] inferido) más una nueva:

| Marca | Significado |
|---|---|
| **[B]** | Clase o método encontrado en los binarios de producción, sobre todo en `ReglasNegocio.dll` (ver [`binarios/inventarios/ReglasNegocio.md`](binarios/inventarios/ReglasNegocio.md)). Indica que Procoop *soporta* la integración, no que Laguna Larga la *use*. |

**Prioridades:** A, B y C con el mismo significado que en el alcance (A = imprescindible para el paralelo; B = necesaria para el by pass; C = diferible).

**Campos de cada ficha:**
- **Dirección:** saliente (el sistema envía), entrante (el sistema recibe) o bidireccional.
- **Medio:** servicio web (SOAP o REST), archivo (TXT de ancho fijo, CSV, Excel) o dispositivo.
- **Frecuencia:** cuándo se dispara.
- **Depende de:** módulos del alcance que la necesitan o que la alimentan.
- **Pendiente:** lo que hay que confirmar con la cooperativa o con el proveedor.

### Hallazgo principal

Procoop es un producto multi-cooperativa y trae **muchas más integraciones de las que usa una sola cooperativa**. Por ejemplo, la capa de cobranza tiene unos 130 formatos de archivo (bancos, Red Link, SIRO, Banelco, Rapipago, Pago Fácil, tarjetas, QR) y hay 91 formatos de código de barras, uno por cooperativa cliente. En el namespace propio de Laguna Larga (`Cobranzas.Entidades.LAG`) solo aparece un importador de **Red Link**, y en la DEMO los entes configurados son DOCUMENTOS A COBRAR, RED LINK y SIRO [P].

**Consecuencia:** el primer paso es pedirle a la cooperativa la lista de integraciones que *usa hoy*, con un archivo de ejemplo anonimizado de cada una. Sin eso, el riesgo es construir conectores que nadie usa o, peor, olvidar uno que se usa todos los días.

---

## 1. Resumen

| Grupo | Integraciones | Prioridad |
|---|---|---|
| Fiscal nacional (ARCA) | Factura electrónica, padrón de contribuyentes, regímenes informativos, Mis Comprobantes | A (factura y padrón), B (resto) |
| Fiscal provincial | Rentas Córdoba (IIBB, CVP, SIRCAR), otras provincias | A |
| Cobranza por redes | Red Link, SIRO, código de barras en la factura | A |
| Pagos digitales | Pagos360, Mercado Pago, QR interoperable, otros botones | A (los que use la cooperativa) |
| Débito automático | CBU y tarjetas | A |
| Subsidios y tarifa social | Padrones de segmentación (Secretaría de Energía / RASE) | A |
| Reguladores | ERSeP, ENARGAS, ENACOM, Secretaría de Energía | B |
| Federación y terceros | FECESCOR, rendición de tasas de terceros, EPEC | B |
| Lectura de medidores | Lectores portátiles, app de lecturas, telemedición | A o B, según cómo lea la cooperativa |
| Medidores prepagos | Discar, NEXO, CashPower, Boiero y otros | A si la cooperativa vende prepago |
| Bancos y tesorería | Interbanking, extractos, cotizaciones | B |
| Sueldos | Libro de Sueldo Digital, SICOSS, SICORE | B |
| Comunicaciones | E-mail, WhatsApp, SMS, IVR | B |
| Portal, app y API | Portal del socio, app de campo, API para terceros | B |
| Firma digital | Recibos de sueldo, planes de pago | C |
| GIS y mapas | Exportación GIS, KML, parcelas | C |
| Servicios TIC | Centrales telefónicas, MikroTik, Wispro, Radius, OLT | C (solo si presta el servicio) |
| Análisis y contabilidad externa | Power BI, sistema contable externo | C |
| Hardware local | Lectores de tarjeta, lector de billetes, impresoras de ticket, turnero | C |
| Migración | Base SQL Server de Procoop, DBF, Excel | A (una sola vez) |

---

## 2. Fiscal nacional (ARCA)

### 2.1 Factura electrónica — WSAA + WSFEv1

- **Prioridad:** A. Etapa 1.
- **Dirección:** saliente, con respuesta inmediata.
- **Medio:** servicio web SOAP sobre HTTPS. La autenticación se hace contra WSAA con un certificado X.509 de la cooperativa; WSAA devuelve un ticket de acceso que dura 12 horas.
- **Operaciones que usa Procoop** [B] (`WSFEV1.Service`): `FECAESolicitar`, `FECompUltimoAutorizado`, `FECompConsultar`, `FECAEASolicitar`, `FECAEARegInformativo`, `FECAEASinMovimientoInformar`, y los `FEParamGet*` (tipos de comprobante, IVA, tributos, puntos de venta, condición IVA del receptor, actividades, cotizaciones).
- **Modalidades:** CAE (autorización comprobante por comprobante) y CAEA (código anticipado por quincena, informado después). También CESP [M][T] `CESPAFIP`.
- **Frecuencia:** en cada emisión. La facturación masiva genera unos 12.500 comprobantes por mes [P]; el CAEA se pide por quincena.
- **Evidencia:** [P] alerta "Hay facturas electrónicas pendientes de autorizar!"; [T] `ELECTRONICA_FC`, `ELECTRONICA_IVA`, `ELECTRONICA_TRIB`, `ELECTRONICA_RELCOMP`, `EMPAFIP`; [B] `clsFacturacionElectronica` (`AutorizaFacturas`, `AutorizaFacturasCAEA`, `ConsultarCAE`, `InformarCAEA`, `ConsultarInconsistencias`).
- **Depende de:** Facturación (9), Titulares (3, condición IVA y documento), Tablas fiscales (2).
- **Diseño propuesto:** cola de autorización con reintentos. Antes de cada lote se consulta `FECompUltimoAutorizado` para no duplicar números si un envío anterior quedó a medias. Tablero de pendientes y rechazados con el motivo devuelto por ARCA. Ambientes de homologación y producción separados.
- **Pendiente:** si la masiva usa CAE o CAEA; puntos de venta habilitados (se vieron 0022, 0028 y 0097 [P]); quién custodia el certificado y cuándo vence.

### 2.2 Padrón de contribuyentes — A13 y constancia

- **Prioridad:** A.
- **Dirección:** saliente, consulta.
- **Medio:** servicio web SOAP con el mismo ticket de WSAA.
- **Evidencia:** [B] `WSPA13.PersonaServiceA13` (`getPersona`, `getIdPersonaListByDocumento`) y `WSPN3.ContribuyenteNivel3SelectServiceImplService`; [B] `Impuestos.busca_cuit_afip`, `ValidaCuit`, `GetDatosContribuyente`.
- **Uso:** completar razón social, domicilio fiscal y condición frente al IVA al dar de alta un titular o un proveedor, y obtener el CUIT a partir del DNI.
- **Frecuencia:** a demanda, en altas y modificaciones; opcionalmente una revalidación masiva periódica.
- **Depende de:** Titulares (3), Compras (16).

### 2.3 Regímenes informativos y libros digitales

- **Prioridad:** B. Se pueden seguir generando desde Procoop mientras dure el paralelo.
- **Dirección:** saliente.
- **Medio:** archivos TXT de ancho fijo que se suben al sitio de ARCA (no hay servicio web).
- **Evidencia** [B] `Facturacion.Archivos`:
  - `RG3685` y `RG3685_ITEMS`: régimen de información de compras y ventas (CITI).
  - `RG1361`, `RG3349`, `RG3571`, `CIR7021`: otros regímenes informativos.
  - `PercepcionSICORE`: retenciones y percepciones de ventas, proveedores y sueldos.
  - `clsSIRE`: formularios F2004 y F2005.
  - `RetencionesMunicipales.Exportar_SeguridadSocialArca`.
- **Frecuencia:** mensual, según el vencimiento de cada régimen.
- **Depende de:** Facturación (9), Compras (16), Sueldos (20), Contabilidad (19).
- **Pendiente:** cuáles presenta hoy la cooperativa.

### 2.4 Mis Comprobantes (importación)

- **Prioridad:** B.
- **Dirección:** entrante.
- **Medio:** archivo CSV o Excel descargado de ARCA.
- **Evidencia:** [B] `clsLibroIVAdigital.Importar_ComprobantesAfip`, `Comparar_LibroCompras`, `Comparar_LibroVenta`, `Get_Informe_ComprobantesNoProcoop`.
- **Uso:** cargar los comprobantes recibidos de proveedores y cruzar los libros de IVA con lo que ARCA tiene registrado.
- **Frecuencia:** mensual.
- **Depende de:** Compras (16), Contabilidad (19).

---

## 3. Fiscal provincial

### 3.1 Rentas Córdoba — Ingresos Brutos, CVP y SIRCAR

- **Prioridad:** A. Las percepciones forman parte del importe de la factura, así que sin esto no coinciden las facturas en el paralelo.
- **Dirección:** entrante (padrones) y saliente (declaraciones).
- **Medio:** archivos.
- **Evidencia:**
  - [M][T] Código de Validación Provincial (CVP): `CVPIIBB`, relacionado con `COMPROB` y `PTOVENTA`; [B] `clsFacturasImpresion.Get_CVP`.
  - [T] `IIBB_LUA`; [B] `clsCuentas.GetCondicionIIBB_LUA`, `GetDatosIbBb_Lua`, `RegistrarIi_BB`; validación `clsFacturacionMasiva.ValidarLUA`.
  - [B] `SIRCAR.Exportar_ArchivoPercepciones` y `Exportar_ArchivoRetenciones` (SIRCAR es el sistema de agentes de recaudación de Convenio Multilateral).
- **Frecuencia:** padrón mensual (entrante); declaración de percepciones y retenciones mensual o quincenal (saliente).
- **Depende de:** Titulares (3), Facturación (9), Compras (16).
- **Pendiente:** qué significa exactamente LUA en este contexto; formato del padrón vigente; si el CVP se imprime en la factura.

### 3.2 Otras provincias

- **Prioridad:** C para Laguna Larga.
- **Evidencia:** [B] `ImportarIIBB_BsAs`, `ImportarIIBB_RN_012017`, `Exportar_IngresosBrutosArba`, `Exportar_IngresosBrutosLaPampa`, `Exportar_IngresosBrutosSantaFe`, `Get_RetencionesIIBB_RioNegro`.
- **Nota:** solo importan si el producto se ofrece a cooperativas de otras provincias. Conviene diseñar el motor de padrones y percepciones para que cada jurisdicción sea una configuración y no un desarrollo.

---

## 4. Cobranza por redes

Todas las redes funcionan igual: el sistema **publica la deuda** (archivo o servicio), el socio paga en la red y la red **devuelve la rendición** con los pagos. Procoop lo implementa con dos clases base, `Exportador_Base` e `Importador_Base` [B], que validan duplicados, importes, comprobantes anulados o bloqueados y titulares notificados.

### 4.1 Red Link

- **Prioridad:** A. Configurado en la DEMO [P] y con importador propio de Laguna Larga [B] `Cobranzas.Entidades.LAG.Red_Link`.
- **Dirección:** bidireccional.
- **Medio:** archivos de ancho fijo. Procoop tiene más de 20 variantes de formato (`E_RedLink_19_7`, `E_RedLink_19_10`, `E_RedLink_Continuo`, `E_RedLink_Lotes`, etc.) y cada exportación genera además un archivo de control (`Exportar_Control`).
- **Frecuencia:** archivo de deuda después de cada facturación, y actualizaciones diarias en la modalidad "continua"; rendición diaria.
- **Evidencia:** [T] `RED_LINK`, `DEUDARED`, `DEUDARED_TIPO`, `RECHAZOS`.
- **Depende de:** Facturación (9), Cuenta corriente (10), Cobranza (11), Mora (12, reconexión por pago).
- **Pendiente:** qué variante de formato usa Laguna Larga; código de ente; si la entrega es por SFTP o por carga manual; un archivo de deuda y uno de rendición de ejemplo.

### 4.2 SIRO (Banco Roela)

- **Prioridad:** A. Configurado en la DEMO [P].
- **Dirección:** bidireccional.
- **Medio:** archivos (base de deuda y rendición) y también API, con QR estático y dinámico.
- **Evidencia:** [T] `SIRO_BASEDEUDA`; [B] `clsSIRO` (`InformarBase`, `ActualizarBaseDeuda`, `ObtenerPagos_APISIRO`, `Importar_PagosAPI`, `GenerarQrDinamico`, `GenerarQRCaja`); importadores `SIRO`, `SIRO_Extendido`, `Siro_Integrado`, `Siro_Unificado`.
- **Frecuencia:** base de deuda después de cada facturación; pagos por consulta periódica a la API (Procoop usa un temporizador) o rendición diaria.
- **Depende de:** los mismos módulos que Red Link.
- **Pendiente:** si Laguna Larga usa archivo, API o ambos; credenciales de la API.

### 4.3 Código de barras de la factura

- **Prioridad:** A. Sin el código correcto, las redes no pueden cobrar la factura.
- **Dirección:** no es un intercambio sino un formato que imponen las redes; se imprime en la factura.
- **Evidencia:** [B] `Facturacion.CodigoBarra.Clientes` (91 formatos, uno por cooperativa), `CodigoBarra.Genericos` (Banco de Córdoba de 43 a 56 dígitos, Pago Fácil, Credicoop, Banco Nación, formato AFIP) y `Codigo_Base` con 9 algoritmos de dígito verificador.
- **Depende de:** Facturación (9), impresión de la factura.
- **Pendiente:** cuál es el formato de Laguna Larga. La forma más segura de validarlo en el paralelo es comparar el código generado por ambos sistemas para la misma factura.

### 4.4 Otras redes y entes recaudadores

- **Prioridad:** C, salvo que la cooperativa confirme que los usa.
- **Evidencia:** [B] Banelco/PMC (más de 15 variantes), Rapipago, Pago Fácil, CobroExpress, ProvinciaNet, Fiserv, PampaPagos, y bancos (Córdoba, Nación, Provincia, Macro, Comafi, Supervielle, Credicoop, Chubut).
- **Diseño propuesto:** un único motor de conectores donde cada ente se define por configuración (estructura de registros, campos, dígito verificador). Así, sumar una red no requiere un desarrollo nuevo.

---

## 5. Pagos digitales

### 5.1 Pagos360

- **Prioridad:** A, según el alcance.
- **Dirección:** bidireccional.
- **Medio:** API REST. Procoop consulta periódicamente los pagos (`InicializarTimer`, `Importar_PagosAPI`) en lugar de recibir notificaciones.
- **Funciones** [B] `clsPagos360`: solicitudes de pago, QR estático y dinámico, QR para la caja, débito automático por CBU y por tarjeta (`Registrar_DebitoCbu`, `Registrar_DebitoTarjeta`, `Actualizar_EstadosDebitos`), reversiones con comisión, pagos rechazados.
- **Evidencia:** [T] `PAGOS360`, `PAGOS360_ITEMS`, `PAGOS360_PAGOS`, `PAGOS360_EXTRAS`; `FACTURAS` se relaciona con `PAGOS360_ITEMS`.
- **Frecuencia:** en tiempo real (creación de la solicitud) y conciliación periódica.
- **Depende de:** Facturación (9), Cuenta corriente (10), Cobranza (11), Portal (27), WhatsApp (link de pago).
- **Diseño propuesto:** recibir las notificaciones del proveedor (webhooks) y conciliar una vez por día como respaldo.

### 5.2 Mercado Pago, Macro y otros botones

- **Prioridad:** C hasta que la cooperativa confirme cuáles usa.
- **Evidencia:** [B] `MercadoPago.dll` y `clsMercadoPago`; `PlusPagosSecurityKitNetFramework.dll` y `clsMacro` (botón de pago Macro); `clsNaranjaX`, `clsHelipagos`, `clsPagostic`, `clsPayFun`, `clsProntoPago`, `clsProvinciaNet` (lotes de QR), `clsSiPago`.
- **Nota:** todos comparten la misma interfaz en Procoop (`Registrar_Solicitudes`, `Obtener_Pago`, `GetInforme_ComprobantePagarRecargos`). En el sistema nuevo conviene una interfaz única de "pasarela de pago" con un adaptador por proveedor.

---

## 6. Débito automático

- **Prioridad:** A.
- **Dirección:** bidireccional. Se envía el archivo de débitos y se recibe el de novedades y rechazos.
- **Medio:** archivos por banco o por tarjeta.
- **Evidencia:** [P] Importar y Exportar archivos de débitos automáticos, Importar Archivo de Novedades; [T] `DEBITO_EXCLUSION`, `ADHSOC` (adhesiones), carpeta `Debitos`; [B] `DebitoDirecto`, `DebitoMacro`, `BancoNacion_4`, `E_Visa_Debito`, `VisaCredito`, `MasterCard_Debitos`, `TarjetaNaranja`, `clsEntidadesRecaudadoras.Archivo_Novedades_Visa`.
- **Frecuencia:** mensual, alineada con los vencimientos de la factura.
- **Depende de:** Titulares (adhesiones, CBU), Facturación (9), Cuenta corriente (10), Mora (12, los rechazos vuelven a deuda).
- **Pendiente:** qué bancos y tarjetas tiene adheridos la cooperativa y cuántos socios hay en cada uno.

---

## 7. Subsidios y tarifa social

- **Prioridad:** A. La categoría de subsidio cambia el precio de la energía y del gas, así que sin el padrón actualizado las facturas no coinciden en el paralelo. No figura en la sección 30 del alcance.
- **Dirección:** entrante (padrones de beneficiarios) y saliente (rendición de lo bonificado).
- **Medio:** archivos Excel o TXT publicados por la autoridad.
- **Evidencia:** [B] `clsSegmentacion` (`Importar_Energia_RASE`, `Importar_Energia_RASE_NIS`, `ImportarEnergia_493_25`, `ImportarGas_SEF`, `Importar_ZonaFria`, `Recategorizar`); `clsTarifaSocial` (`Export_ERSEP166`, `Export_ERSEP296`, `Export_ERSEP617`, `Export_GasNatural`); `clsCirculares.Exportar_Archivo_RASE`, `GenerarArchivoCompensacionSubsidio`; carpetas `Segmentacion` y `tarifasocial` en el servidor.
- **Frecuencia:** cada vez que la autoridad publica un padrón (típicamente mensual) y antes de cada facturación.
- **Depende de:** Servicios y categorías (4), Tarifas (7), Facturación (9).
- **Pendiente:** formato y canal del padrón vigente para energía y para gas; normativa nacional y provincial aplicable hoy.

---

## 8. Reguladores

### 8.1 ERSeP (Ente Regulador de Servicios Públicos de Córdoba)

- **Prioridad:** B. No figura en la sección 30 del alcance, pero aplica a Laguna Larga por estar en Córdoba.
- **Dirección:** saliente.
- **Medio:** archivos Excel o TXT.
- **Evidencia:** [B] `clsInformes_Consumos.Exportar_Archivo_ERSep`, `clsCirculares.Exportar_Excel_ERSeP_DNUN_311_2020`, `clsInformes_Titulares.ExportarERSEP`.
- **Frecuencia:** según cada resolución, en general mensual o semestral.

### 8.2 ENARGAS

- **Prioridad:** B. Laguna Larga tiene servicio de gas natural [P].
- **Dirección:** saliente.
- **Medio:** paquete de archivos TXT con nombres fijos (usuarios, facturación, conceptos, consumos, morosidad).
- **Evidencia:** [M][T] `ENGAS_CANTMESES`, carpeta `ENARGAS`; [B] `clsEnargas` y `clsEnargas2` (`Get_File_USR`, `Get_File_FDC`, `Get_File_FDD`, `Get_File_CMD`, `Get_File_SICC`, `ExportExcelMorosidad`).
- **Frecuencia:** periódica, según el régimen informativo del ENARGAS.

### 8.3 ENACOM

- **Prioridad:** C, solo si la cooperativa presta servicios TIC.
- **Evidencia:** [M] Configuración de Conceptos para informe ENACOM; [B] `ConfiguracionEnacom.Exportar_Excel_ENACOM_DNU_RES_367_2020`, `clsEnacom.CargarArchivo`.

### 8.4 Secretaría de Energía

- **Prioridad:** B.
- **Evidencia:** [B] `clsInformes_Consumos.Get_InformeSecretariaEnergia`, `CompletarInfoUsuariosGeneradores544` (usuarios generadores, energía inyectada).
- **Pendiente:** qué informes presenta hoy la cooperativa.

---

## 9. Federación y terceros

### 9.1 FECESCOR

- **Prioridad:** B.
- **Dirección:** saliente.
- **Medio:** archivos de rendición.
- **Evidencia:** [B] `GetDatosInforme.GenerarArchivosRendicion_FECESCOR`, `clsWEB.ConfigurarFECESCOR`, `clsInformes_Titulares.ExportarFECESCOR`.
- **Pendiente:** qué se rinde (fondos, tasas, datos de usuarios) y con qué frecuencia. Confirmar si Laguna Larga está adherida.

### 9.2 Rendición de tasas de terceros

- **Prioridad:** B. La factura incluye tasas municipales y provinciales (alumbrado público, tasas por decreto) [P]; lo cobrado se rinde a cada organismo.
- **Dirección:** saliente, y entrante cuando el organismo envía el padrón de lo que hay que facturar.
- **Evidencia:** [T] `FACTURAS_TERCEROS`; [B] `clsFacturacionCuotasTerceros` (`Importar_AlumbradoPublico`, `ImportarFacturasGAS`), `clsTerceros`, `clsFacturas_DatosExtras.CargarFacturasTerceros`.
- **Pendiente:** lista de organismos y el formato de cada rendición.

### 9.3 EPEC

- **Prioridad:** B.
- **Uso:** la cooperativa compra la energía a EPEC; la integración serviría para cargar la factura de compra y calcular las pérdidas (energía comprada contra energía vendida).
- **Evidencia:** solo [T] `FACT_EPEC`. No se encontró lógica en `ReglasNegocio.dll`, por lo que puede ser una carga manual o una tabla en desuso.
- **Pendiente:** confirmar si se usa y cómo llega la información (PDF, archivo o portal).

---

## 10. Lectura de medidores

### 10.1 Lectores portátiles y app de lecturas

- **Prioridad:** A si Laguna Larga lee con dispositivos o con la app; B si las lecturas se cargan a mano. Sin lecturas no hay facturación.
- **Dirección:** bidireccional. Se envía la ruta de lectura y se recibe el estado de cada medidor.
- **Medio:**
  - Dispositivos conectados a la PC (protocolo de dispositivos portátiles de Windows), con archivos de ruta. [B] `clsWindowsDevice`, `clsTelemed.Archivo_ExportarPSION`, `Archivo_ImportacionPSION`.
  - App móvil propia que sincroniza con una base MySQL en la nube y sube fotos a Amazon S3. [B] `clsPMovil_Telemed` (`GetImgLecturas`, `EliminarImagenesS3`), `clsPMovil.EnviarRutaACaptor`, `RecibirDatosCaptor`.
  - Excel y CSV. [B] `clsTelemed.Archivo_ImportarExcel`, `clsDetalleRuta.ParsearLineasCSV`.
- **Frecuencia:** mensual por ruta de lectura (zona, sector y recorrido).
- **Depende de:** Medidores (5), Lecturas y consumos (6), Facturación (9).
- **Diseño propuesto:** app de lecturas propia, que funcione sin conexión, con foto, coordenadas y validación de consumo fuera de rango en el momento.

### 10.2 Telemedición (AMI/MDM)

- **Prioridad:** B.
- **Dirección:** entrante (lecturas) y saliente (comandos de corte y reconexión).
- **Medio:** varía por fabricante: REST, SOAP, TCP o acceso directo a la base del proveedor.
- **Evidencia:** [M][T] `TELEMEDICION`, `TELEMED_COMM`, `AUDITORIA_TELEMEDICION`; [B] `Varios.Telemed.Telemedicion`, con conectores para QUO, Kaptor, Silexis, Hexing, Discar y otros. Cada conector expone la misma interfaz: `TomaEstado`, `CorteServicio`, `ReconexionServicio`, `AsignacionMedidor`, `RetiroMedidor`, `CambioCategoria`.
- **Pendiente:** si Laguna Larga tiene medidores telemedidos y de qué marca.

### 10.3 Medidores prepagos

- **Prioridad:** A si la cooperativa vende energía prepaga [M][T].
- **Dirección:** bidireccional. Al cobrar una recarga, el sistema pide el código de crédito al sistema del fabricante; además recibe los consumos.
- **Medio:** según el fabricante.
- **Evidencia:** [B] `CargaCreditoPrepago` en los conectores Discar, NEXO (cuatro variantes: TCP, SQL, Plus y base), CashPower, Boiero, C_Token, Silexis y BATCOM; `clsPrepaga`, `clsTelemediciones.RegistroVentaPrepagaTelemed`; `clsWeb_CoopOnline.AutorizarPrepaga` (recarga desde el portal).
- **Depende de:** Medidores (5), Prepago, Cobranza (11), Portal (27).
- **Pendiente:** marca del sistema prepago de Laguna Larga y si la recarga es online o con token.

---

## 11. Bancos y tesorería

### 11.1 Interbanking

- **Prioridad:** B.
- **Dirección:** saliente (archivo de transferencias a proveedores) y entrante (movimientos para conciliar).
- **Medio:** archivos.
- **Evidencia:** [T] `INTERBANKING`, `MOV_INTERBANKING`, `SU_AUDIT_TRA_INTERBANKING`; [B] `clsProveedor.ExportarArchivo_Interbanking`, `clsInterbanking` (`getMovimientosCuentaInterbanking`, `GuardarConciliacion`, `getSaldosCuentasInterbanking`).
- **Frecuencia:** diaria o por lote de pagos.
- **Depende de:** Compras (16), Tesorería (18), Sueldos (20, pago de haberes).

### 11.2 Extractos bancarios

- **Prioridad:** B.
- **Dirección:** entrante.
- **Medio:** archivo del home banking (CSV, Excel o formato del banco).
- **Evidencia:** [B] `clsConciliacion`, `clsCuentas.ImportarMovTesore`.
- **Diseño propuesto:** importación con conciliación asistida, como propone el alcance.

### 11.3 Cotización de monedas

- **Prioridad:** C.
- **Evidencia:** [B] `clsTipMon.GetCotizacion`; `FEParamGetCotizacion` de ARCA.
- **Nota:** se puede tomar directamente de ARCA.

---

## 12. Sueldos

- **Prioridad:** B.
- **Dirección:** saliente (Libro de Sueldo Digital, SICORE) y entrante (importación SICOSS).
- **Medio:** archivos TXT para los sistemas de ARCA.
- **Evidencia:** [M] Libro sueldo digital (deshabilitado en la DEMO); [B] `LibroSueldoDigital` (registros tipo 1 a 5), `clsSueldos.Importar_Sicoss`, `clsImportacionArchivos.ImportarSicossDb`, `PercepcionSICORE.Exportar_Sueldos`; `clsGanancias` (formulario 572).
- **Frecuencia:** mensual.
- **Pendiente:** si la cooperativa liquida sueldos en Procoop o con un estudio externo. Si es externo, alcanza con importar el asiento contable.

---

## 13. Comunicaciones

### 13.1 E-mail

- **Prioridad:** B. Imprescindible si la cooperativa ya envía la factura por mail.
- **Dirección:** saliente.
- **Medio:** SMTP o Amazon SES.
- **Evidencia:** [T] `SENDMAIL`, `PROMAIL`, `AUDIT_MAIL`, `MailTemplates`; [B] `Mails.Manager` (`EnvioMailAmazon`, `UsaAmazonSES`, `EnviarMailsPendientes`), `AWSSDK.SimpleEmail.dll`, `MimeKit.dll`; exportación a la herramienta de e-mail marketing Doppler (`clsGestionMora.ExportarDopler`).
- **Frecuencia:** en cada emisión masiva y en eventos (avisos de mora, órdenes de trabajo).
- **Diseño propuesto:** proveedor transaccional con dominio propio de la cooperativa (SPF, DKIM y DMARC configurados), registro de entrega y rebotes.

### 13.2 WhatsApp

- **Prioridad:** B.
- **Dirección:** saliente (plantillas) y entrante (bot de autogestión).
- **Medio:** API de WhatsApp Business a través del proveedor Trii [B] `TriiTemplateRequest`, `clsServicio_Procoop.EnviarWspTrii`.
- **Plantillas que ya existen** [B] `Telefonia`: confirmación de pago, detalle de comprobantes, link de pago, recarga prepaga, generación de orden de trabajo, cambio de medidor.
- **Bot:** [B] `clsProcoop_Integra_Tecnica.GetCuentasDniBot`, `GetReclamosBot`, `GetCuentaCodigoBot`.
- **Pendiente:** si la cooperativa tiene número de WhatsApp Business verificado y con qué proveedor; plantillas aprobadas por Meta.

### 13.3 SMS

- **Prioridad:** C.
- **Evidencia:** [M] Administración de SMS; [B] `ProMod_SMS.dll`, `clsMensaje.Get_SMSPendientes`, `clsPMovil_Sms` (envío a través de la app móvil y MySQL), `clsProcoop_Integra.EnviarSms`.
- **Pendiente:** proveedor actual de SMS.

### 13.4 IVR y llamadas automáticas

- **Prioridad:** C.
- **Evidencia:** [B] `clsIVR` (archivos para TeleAnouncer, Minerva e IVR de logística).
- **Uso:** avisos de deuda por llamada automática.

---

## 14. Portal, app y API

### 14.1 Portal del socio (CoopOnline)

- **Prioridad:** B. Pasa a A si los socios ya pagan o descargan la factura desde el portal, porque el servicio no se puede cortar durante el paralelo.
- **Cómo funciona en Procoop:** el portal no lee la base de Procoop. Un proceso (`Agente Procoop.exe`) **sincroniza tablas** con una base MySQL externa (facturas, pagos, consumos, cuentas, débitos, novedades, órdenes) y sube los PDF de las facturas. [B] `clsWEB.SincronizarFacturas`, `SincronizarPagos`, `SincronizarConsumos`, `SincronizarCuentas`, `RegistrarPDFFILE`; `Agente.Clases.clsWeb_CoopOnline` (escucha de cobranzas y recargas prepagas).
- **Evidencia:** [M] Procoop WEB (Requisitos y Trámites, Archivos en la Web, Operaciones); [P] marca "Alta desde CoopOnline"; [B] `Varios.CoopOnline.clsTramitesWEB` (trámites y declaraciones juradas de artefactos).
- **En el sistema nuevo:** el portal es parte del mismo sistema y lee los mismos datos, así que esta sincronización desaparece. La integración real es la **migración de usuarios del portal** (correos, cuentas vinculadas, adhesiones a factura digital) para que los socios no tengan que registrarse de nuevo.

### 14.2 App de campo (técnica y ventas)

- **Prioridad:** B.
- **Cómo funciona en Procoop:** igual que el portal, sincroniza con MySQL. [B] `clsPMovil_Tecnica` (envío y recepción de órdenes de trabajo), `clsPMovil_Venta` (presupuestos y ventas), `clsProcoop_Integra_Tecnica.ConfirmarOrdenTrabajoPmovil`; `FireSharp.dll` sugiere notificaciones o datos en Firebase.
- **En el sistema nuevo:** app propia sobre la API del sistema, sin base intermedia.

### 14.3 API para terceros

- **Prioridad:** B.
- **Dirección:** entrante (terceros consultan o registran datos).
- **Evidencia:** [T] `WS_KEYS`, `WS_USERS`, `WS_USERS_ACCOUNTS`; [B] `ProMod_WebService.dll`, `clsClientes_Externos` (`RegistrarCuenta`, `RegistrarPersona`, `PutCategoria`, `Consultar_Servicio`), `clsProcoop_Integra` (deuda por cuenta, comprobantes adeudados, canales de pago).
- **Pendiente:** qué terceros consumen hoy esta API (municipio, bot, otra cooperativa, sistema de prepago).
- **Diseño propuesto:** API REST documentada con OpenAPI, autenticación por cliente (OAuth2 con credenciales de cliente), permisos por cuenta y auditoría de cada llamada.

---

## 15. Firma digital y electrónica

- **Prioridad:** C.
- **Dirección:** bidireccional con un proveedor de firma.
- **Medio:** API (envío del documento, consulta del estado, descarga del firmado).
- **Evidencia:** [T] `FIRMADIGITAL*`, `FIRMASELECTRONICAS*`, `PPAGOS_FIRMAS`; [B] `Varios.Configuraciones.clsFirmaDigital` (`EnviarParaFirmar`, `ObtenerEstadoFirma`, `ObtenerDocumentosFirmados`, `MarcarRecibosComoFirmados`, `EnviarSmsFirmados`).
- **Uso:** recibos de sueldo, planes de pago con firma del titular y de los garantes, órdenes de pago.
- **Pendiente:** proveedor de firma actual.

---

## 16. GIS y mapas

- **Prioridad:** C.
- **Dirección:** saliente (exportación al GIS de la cooperativa) y entrante (parcelas del catastro).
- **Medio:** archivos con formato propio de cada cooperativa; KML para Google Earth.
- **Evidencia:** [B] `Varios.GIS` (un exportador por cooperativa: `ExportarUsuarios`, `ExportarConsumos`, `ExportarAltasBajas`); `Varios.Generales.GIS` (`Import_Parcelas`, `Show_Map`); `Varios.GoogleEarth` y `SharpKml.Core.dll`; mapas KML de rutas de lectura y de órdenes de trabajo.
- **Pendiente:** si Laguna Larga tiene un GIS propio (por ejemplo QGIS) y qué datos le pasa.

---

## 17. Servicios TIC (telefonía, internet, TV)

- **Prioridad:** C. Solo aplica si la cooperativa presta estos servicios; el alcance ya marca telefonía como un módulo a validar.
- **Evidencia:**
  - Telefonía fija: [B] `Telefonia.clsImportacion` importa los registros de llamadas (CDR) de más de 20 modelos de central (Alcatel, Huawei, Iskratel, Broadsoft, Lucent, NEC, entre otros) para tasarlas.
  - Telefonía móvil: [B] `clsTelefoniaMovil.Importar_ArchivoClaro`, `Importar_ArchivoPersonal`.
  - Internet: [B] conectores MikroTik, Wispro, Radius, Radius_Gretix, SmartOlt e Ispfull para alta, corte, reconexión y cambio de plan; [T] `MIKROTIK`.
  - TV u otros: [B] `Sensa`, `Sopnet`, `clsSitsa` (altas, bajas, contratos y corte).
- **Diseño propuesto:** la misma interfaz de "sistema externo de aprovisionamiento" que la telemedición (alta, corte, reconexión, cambio de categoría), con un adaptador por proveedor.

---

## 18. Análisis y contabilidad externa

### 18.1 Power BI y herramientas de análisis

- **Prioridad:** C.
- **Evidencia:** [T] `TABLAS_POWERBI` → `PERFILES_TABLAS`.
- **Diseño propuesto:** API de datos de solo lectura o réplica para BI, como propone el alcance.

### 18.2 Sistema contable externo

- **Prioridad:** C. Sube a B si la Contabilidad del sistema nuevo no está lista para el paralelo (ver la nota de la sección 33 del alcance).
- **Dirección:** saliente (asientos) o entrante (importar asientos de otro sistema).
- **Evidencia:** [T] `SISCONT`; [B] `clsAsiento.ImportarAsientos`, `ImportarAsientosConSeccion`, `clsContabilidad.ExportarArchivos`.

---

## 19. Hardware local

- **Prioridad:** C.
- **Evidencia:** [B] lectores de tarjeta con chip EMV y banda magnética (`clsLectorCRT603`, `clsLectorTarjetas`: 3nStar, PT800), lector de billetes (`clsLectorBilletes`, para cajas de autoservicio), impresora de tickets (`Impresoras.Masung_D347`), escáner (`clsEscaner`), turnero por puerto serie (`clsTurnero.EscucharPuerto`), dispensador de agua (`clsDispenser`).
- **Nota:** un sistema web no puede hablar directamente con estos dispositivos. Si alguno se usa, hace falta un pequeño agente local en la PC de la caja o del turnero. Antes de decidirlo hay que confirmar si la cooperativa usa alguno; el cobro con tarjeta se puede resolver con posnet o QR, sin lector integrado.

---

## 20. Inteligencia artificial

- **Prioridad:** C.
- **Evidencia:** [T] `AUDIT_IA`; [B] `clsChatGPT` (OpenAI), `clsLeerComprobante` (lee facturas de proveedores en PDF con IA y propone la carga), `clsAnalisisNotasTicket`.
- **Nota:** no es imprescindible para el reemplazo, pero la lectura automática de facturas de compra es una función que los usuarios de Procoop ya conocen.

---

## 21. Migración desde Procoop

- **Prioridad:** A. Se ejecuta una vez para el paralelo y otra vez para el by pass.
- **Dirección:** entrante.
- **Fuentes:**
  - Base SQL Server de Procoop (en la DEMO, `PR_LAG_DEMO`). El modelo completo está en [`binarios/CapaDatos-tablas.md`](binarios/CapaDatos-tablas.md).
  - Base MySQL del portal y de la app (usuarios web, adhesiones).
  - Adjuntos y PDF (carpetas del servidor y Amazon S3).
  - Archivos heredados en DBF, Access y Excel [B] `NDbfReader.dll`, `Microsoft.Office.Interop.Access.Dao`, `Importador.exe`.
- **Diseño propuesto:** migración repetible y automatizada, que se pueda correr varias veces durante el paralelo con un informe de diferencias (cantidad de registros, saldos por cuenta, deuda total).
- **Pendiente:** acceso de solo lectura a la base real; política de anonimización para los ambientes de prueba (ver la advertencia del README sobre datos personales).

---

## 22. Infraestructura que reemplaza procesos de Procoop

Varias "integraciones" de Procoop son en realidad tareas programadas que corren en un servicio de Windows de la cooperativa (`clsServicio_Procoop`) [B]: sincronizar el portal, transferir archivos por FTP, procesar archivos de rendición, registrar facturas electrónicas, enviar mails y WhatsApp, hacer copias de seguridad. En un sistema SaaS todo esto pasa a ser responsabilidad de la plataforma:

| En Procoop | En el sistema nuevo |
|---|---|
| Servicio de Windows con tareas programadas | Procesos en segundo plano con colas y reintentos |
| Sincronización con MySQL para portal y app | Portal y app sobre la misma API |
| Transferencia por FTP (`TransferirFTP`, `BorrarAFTP`) | SFTP o API con cada ente, con registro de cada envío |
| Archivos en carpetas del servidor | Almacenamiento de objetos con control de acceso |
| Copias de seguridad hechas por el usuario | Copias automáticas gestionadas por la plataforma |

---

## 23. Lista de pedidos a la cooperativa

Para cerrar las fichas hace falta pedirle a Laguna Larga:

1. La lista de **entes recaudadores, bancos, tarjetas y botones de pago** que usa hoy, con un archivo de deuda y uno de rendición de ejemplo de cada uno, anonimizados.
2. El **formato del código de barras** de la factura y una factura impresa de muestra.
3. Cómo se **leen los medidores** (planilla, colector portátil, app o telemedición) y la marca del sistema de **prepago**, si lo tiene.
4. El **padrón de subsidios** vigente para energía y gas, y cómo lo recibe.
5. Los **regímenes informativos** que presenta (ARCA, Rentas Córdoba, ERSeP, ENARGAS, FECESCOR) y con qué frecuencia.
6. Qué **tasas de terceros** factura y a quién las rinde.
7. Si usa el **portal CoopOnline**, la app móvil, WhatsApp Business y SMS, y con qué proveedores.
8. Quién consume la **API para terceros** de Procoop.
9. Si liquida **sueldos** y lleva la **contabilidad** en Procoop o fuera de él.
10. Si usa algún **dispositivo local** en las cajas (lector de tarjetas, impresora de tickets, turnero).
