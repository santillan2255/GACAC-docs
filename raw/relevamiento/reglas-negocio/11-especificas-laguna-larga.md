# 11 — Reglas específicas de la Cooperativa Eléctrica de Laguna Larga (LAG)

Reglas de Procoop 10.4.6.722 que aplican **solo** a la cooperativa piloto de GoodApps (Laguna Larga), o que la afectan por cómo está configurada. Se extrajeron del código descompilado (`ReglasNegocio`, `Configuracion`, `ProcoopNet`, `ProMod_WebService`). Complementa la sección 9 del documento [05 — Cobranzas](05-cobranzas-cajas-y-entes-recaudadores.md) y la sección 12 del [02 — Facturación masiva](02-facturacion-masiva-y-comprobantes.md). No repite lo genérico: lo cita.

Convenciones:

- Las rutas son relativas a `binarios/decompilado/ReglasNegocio/`, salvo indicación.
- Las posiciones de los layouts son **base 0** (como `Substring` en el código). Entre paréntesis se da la posición base 1 cuando ayuda.
- Los parámetros se escriben como **V2(n)**: el valor de `Nucleo.Busca_V2_*(n)`, guardado en la tabla `VARIABLE` (catálogo en `CapaNucleo/clsVariables.cs` y en el doc [09](09-parametros-y-configuracion.md)).
- **[VERIFICAR]** marca lo que depende de datos o parámetros de la base de LAG. La sección 5 trae la consulta SQL de solo lectura para cada caso.

---

## Resumen ejecutivo

1. **La sigla con que Procoop identifica a Laguna Larga es casi seguro `"LAG"`** (V2 2264, "Sigla del nombre del cliente", `CapaNucleo/clsVariables.cs:933`). Es la sigla del importador propio (`Importador_Base.cs:550`), de la rama SIRO (`E_SIRO.cs:134`) y de las dos ramas ENARGAS (`clsEnargas.cs:1917`, `clsEnargas2.cs:1402`). Las ramas `"LAGU"` (`PR/RedLink_1.cs:38`) y `"FAL"` (SIRO, E_SIRO, E_Macro, Tarjeta Naranja) **no** aplican a LAG, salvo que V2(2264) tenga otro valor. **[VERIFICAR]**
2. **Solo hay cuatro puntos de código exclusivos de LAG**:
   - el importador de rendición Red Link (`Entidades.LAG/Red_Link.cs`);
   - el "0" que se antepone al convenio para armar el código de barras SIRO en la base de deuda;
   - el identificador de comprobante del archivo CMD de ENARGAS (letra A/B + punto de venta + número);
   - el criterio de "factura migrada" en el archivo Usr de ENARGAS (`USUARIO = COD_SUM` en lugar de `"MIGRA_SP"`).

   Ni `Configuracion`, ni `ProcoopNet`, ni `ProMod_WebService` tienen ramas por sigla (V2 2264 no se lee en esos proyectos) ni literales de LAG.
3. **La rendición Red Link de LAG no lee el comprobante del archivo.** Resuelve la factura por **cuenta + servicio + importe pagado igual a alguno de los 4 totales**, y si no la encuentra prueba con el **código de usuario del sistema anterior** (`FACTURAS.USUARIO`). Esto acarrea riesgos concretos:
   - elige la factura más reciente aunque esté paga;
   - dos pagos del mismo importe en el mismo archivo se marcan como duplicados;
   - una cuenta de 10 dígitos que supere el máximo de `Int32` hace fallar todo el archivo;
   - el movimiento bancario se registra siempre "por caja".
4. **SIRO es, en el código, el único canal donde LAG publica un código de barras propio.** Es el formato "SIRO – Banco Roela" de 56 dígitos (empresa `0447`), con el `ID_FAC` en 8 dígitos y DV1 aplicado dos veces. El importe de cada vencimiento ocupa **7 dígitos**, así que **no admite importes de $100.000,00 o más**: en esos casos la base de deuda SIRO sale sin código de barras. Además, un talón o una notificación en la exportación SIRO de LAG probablemente provoque una excepción. **[VERIFICAR]**
5. **LAG tiene servicio de gas** (ENARGAS) y servicio "GS" en la rendición Red Link. Por ser cooperativa de Córdoba le aplican las exportaciones genéricas a ERSeP (Circular 70/2021, DNU 311/2020, tarifa social 166/296/617, pérdidas). Ninguna tiene rama LAG.
6. Para el piloto hay que confirmar en `PR_LAG_DEMO` unos 15 datos de configuración (sección 5). Los críticos son: V2 2264/518/519, `BANCOS` de RED LINK y SIRO (modelo, convenio, código de barras), el uso de `FACTURAS.USUARIO`, el rango de `SUMSOC.COD_SUM` y la cantidad de facturas de $100.000 o más.

---

## Confirmado en la base demo (documento 12)

La lectura de solo consulta de `PR_LAG_DEMO` ([documento 12](12-configuracion-real-laguna-larga.md)) cierra estas marcas [VERIFICAR] de este documento. Las demás siguen abiertas.

- **Sigla:** el parámetro 2264 vale `LAG`. Aplican la rama SIRO del "0" antepuesto al convenio y las ramas ENARGAS de LAG. No aplican las ramas `"LAGU"` ni `"FAL"`.
- **Red Link:** la rendición usa el importador propio de LAG (`COD_ARC` 264). La deuda se envía con el exportador genérico de 19 dígitos con identificador de 10 (`COD_ARC2` 159, `E_RedLink_19_10`). El convenio es `D67`.
- **SIRO:** la deuda se envía con `E_SIRO` (`COD_ARC2` 140). Por lo tanto **aplica el tope de $99.999,99 por vencimiento** del código de barras de la sección 2. La rendición está configurada con el importador integrado por API (271), pero el parámetro 2807 que activa esa API vale 0 **[VERIFICAR]** cómo rinde hoy.
- **Documentos a cobrar:** no tiene importador ni exportador. Funciona como caja o cartera (caja 300).
- **Pagos parciales en entes:** ningún ente los admite (`PERMITE_ENTREGA` = No). Todos aceptan pagos fuera de término sin tope (`FUETERBAN` = 5).
- **Pago online:** la única pasarela con credenciales es el botón de pago SIRO, usado desde CoopOnline. El 70 % de las solicitudes son recargas de **energía prepaga**, así que el piloto necesita prepago desde el inicio.

Sigue pendiente la cantidad real de facturas de $100.000 o más (consulta 8 de la sección 5).

## 1. Interfaz de cobranza de LAG

### 1.1 Importador `Entidades.LAG/Red_Link.cs` (modelo 264)

**Registro.** Es el valor de enum `Importador_Base.Modelos.FAL_RedLink = 264`, con atributo `Sigla = "LAG"`, nombre "Red Link" y formato de archivo `*` (cualquier extensión) (`ReglasNegocio.Cobranzas.Entidades/Importador_Base.cs:550-551`). No tiene `API_SIRO` ni `MostrarAdvertenciaDiferencias`. La sigla del atributo es informativa: `Get_Modelos` lista **todos** los modelos sin filtrar por V2(2264) (`Importador_Base.cs:1072-1097`). Por eso LAG lo usa solo si su ente RED LINK tiene `BANCOS.COD_ARC = 264`. **[VERIFICAR]**

`Get_Estructura` lanza `NotImplementedException` (`Red_Link.cs:12-15`), así que la pantalla de "ver formato" no puede mostrar el layout. El layout que sigue se reconstruyó del código.

**Lectura del archivo.** Archivo de texto de largo fijo con cabecera y pie, separador de fila `"\n"` (`Red_Link.cs:23`).

- `GetFilas` descarta las líneas vacías. Si el archivo trae una sola línea, reintenta partiendo por `\r` o `\n` (`ReglasNegocio.Varios.Generales/clsImportacion.cs:1569-1584`).
- La cabecera se lee con la codificación por defecto de Windows y el detalle con UTF-8 (`clsImportacion.cs:1690-1694`).
- Si las líneas terminan en `\r\n`, el `\r` queda al final de cada línea. No afecta, porque ningún campo llega al final del registro.

**Cabecera** (primera fila, `Red_Link.cs:25-33`):

| Campo | Pos. base 0 | Largo | Regla |
|---|---|---|---|
| (tipo de registro) | 0 | 1 | No se lee |
| Convenio | 1 | 3 | Debe ser igual a `BANCOS.CONVENIO` del ente. Si no, error "El código de ente indicado en el archivo no coincide con el número de convenio de la entidad." |
| Fecha de presentación | 4 | 8 | `yyyyMMdd`. No puede ser posterior a hoy: "La fecha de presentación del archivo no puede ser posterior a la fecha actual" |

Si falla alguna de las dos validaciones, el archivo se rechaza completo y no se procesa ningún registro (`:30-33`).

**Detalle** (todas las filas menos la primera y la última, `Red_Link.cs:35-42`; el recorte de cabecera y pie está en `clsImportacion.cs:1655-1660`):

| Campo | Pos. base 0 (base 1) | Largo | Conversión |
|---|---|---|---|
| (tipo de registro) | 0 (1) | 1 | No se lee |
| IdConcepto | 1 (2) | 3 | Texto. Se convierte a entero para la regla de gas. En el log queda como "canal de cobro" |
| Identificador del usuario (`Cod_Sum`) | 4 (5) | 10 | Texto de 10 dígitos: **8 de cuenta + 2 de servicio** (ver abajo) |
| (sin uso) | 14 (15) | 9 | Resto del identificador de 19 de Red Link. No se lee **[VERIFICAR]** |
| Importe pagado | 23 (24) | 12 | 2 decimales implícitos (centavos) |
| Fecha de cobro | 35 (36) | 8 | `yyyyMMdd` (el código escribe el formato "yyyymmdd", pero el parser toma `mm` como mes) |
| (resto) | 43 (44) en adelante | — | No se lee. En particular, **no se lee el comprobante** que el formato genérico `PR/RedLink.cs:33` toma en (48,10) |

Comparado con la rendición Red Link genérica (`PR/RedLink.cs:27-33`: concepto en 6, importe en 23, fecha en 35, comprobante en 48), LAG comparte las posiciones de importe y fecha, pero lee el concepto en 1 y el identificador en 4. Así que el archivo que recibe LAG tiene otro armado de los primeros 23 caracteres. Hay que confirmarlo con un archivo real. **[VERIFICAR]**

**Pie** (última fila, `Red_Link.cs:129-131`):

- Cantidad = (1,6) − 2, porque el total informado incluye la cabecera y el pie.
- Importe total = (7,16) / 100.

`Validar_CantidadImportada` (`Importador_Base.cs:2177-2191`) y `Validar_ImporteImportado` (`:2193-2209`) comparan esos valores con los registros resueltos. Si no coinciden, agregan una **advertencia** (no un error) al log: "El número de comprobantes obtenidos difiere…" y "El importe de comprobantes obtenidos difiere…".

**Identificación del servicio y la cuenta** (por registro, `Red_Link.cs:49-77`). En prosa:

1. **Servicio** = los dígitos 9 y 10 del identificador (`:52`): 01 = energía (`TIPO = "EN"`), 02 = gas (`"GS"`), 04 = agua (`"AG"`), 05 = servicios (`"SV"`), cualquier otro = sin tipo (`:60-67`). El código 03 no está contemplado: si aparece, no se filtra por tipo, pero la cuenta se recorta igual a 8 dígitos.
2. Se verifica si el identificador completo de 10 dígitos existe como cuenta en `SUMSOC.COD_SUM` (`:56`).
3. **Se interpreta como "cuenta + servicio"** (se recorta la cuenta y se fija el tipo) en dos casos:
   - el servicio no es 00 y el número de 10 dígitos no existe como cuenta;
   - el número **sí** existe, pero el servicio es 02 y el concepto Red Link es 002. Es decir, el concepto 002 fuerza la interpretación de gas aunque haya una cuenta con ese número (`:58`). **[VERIFICAR]** qué significa el concepto 002 en el convenio Red Link de LAG.
4. Recorte de la cuenta (`:68-75`): **7 dígitos si es gas, 8 en el resto.** Gas usa una cuenta de 7 dígitos y 3 dígitos de relleno o servicio.
5. Si no se cumple ninguno de los dos casos (servicio 00, o el número de 10 dígitos existe y no es gas con concepto 002), se usa **el número de 10 dígitos completo como cuenta, sin filtrar por tipo**. Esto sugiere que en la base de LAG hay cuentas cuyo `COD_SUM` es literalmente "cuenta anterior × 100 + servicio". **[VERIFICAR]**

**Búsqueda del comprobante por importe** (`Red_Link.cs:78-126`). Si se determinó un tipo, todas las consultas filtran `FACTURAS.TIPO = tipo` (`:78-81`). El tipo coincide con `TIPO_FAC.COD_TIP`. Orden de búsqueda; se detiene en el primer acierto y arma el comprobante `"41" + ID_FAC`:

| Paso | Criterio | Cita |
|---|---|---|
| a | `COD_SUM` = cuenta, **algún** `TOTAL1..TOTAL4` = importe pagado, `FECHA` (emisión) ≤ fecha de cobro. Se toma la más reciente por `FECHA` | `:82-90` |
| b | Igual, pero con `USUARIO` = cuenta como texto (código de usuario del **sistema anterior**) | `:91-98` |
| c | Solo si el servicio es 02 (gas): se repiten a) y b) con el **identificador original de 10 dígitos** | `:99-118` |
| d | Si nada coincide: comprobante `"00000000000000"` | `:119-126` |

Reglas y consecuencias que no aparecen en el doc 05:

- **No se mira el saldo, ni si la factura está paga, ni el vencimiento.** Si la factura más reciente con ese importe ya está paga, el pago se imputa igual a ella. La validación estándar posterior la marca como "ya pagada" o como anticipo (doc 05, sección 4.6), y la factura vieja realmente impaga queda abierta.
- **Duplicados dentro del archivo.** Si dos pagos del archivo resuelven al mismo comprobante (por ejemplo, dos meses con el mismo importe en una cuenta), `Validar_Duplicados` (`Importador_Base.cs:1224-1270`) agrupa por cuenta, comprobante, cuota y primer vencimiento. Marca "El comprobante se encuentra N veces en el archivo" y **anula la imputación de las repeticiones** (las pone en `null`). Si V2(3200) está activa, la advertencia se agrupa y deja de ser error (`:1230`, `:1259`). En LAG este caso es **esperable** con tarifas planas o cargos fijos repetidos.
- **Desborde de entero.** El identificador se convierte a `Int32` (`:55`, `:56`, `:77`). Un identificador de 10 dígitos mayor a 2.147.483.647 (cuenta de 8 dígitos ≥ 21.474.837) lanza una excepción. El `catch` general (`:135-139`) rechaza **todo el archivo** con "No es posible importar el archivo, verifique que el formato sea correcto". **[VERIFICAR]** el rango de cuentas.
- **Comprobante no encontrado.** `"00000000000000"` empieza con "00", así que `LoadComprobantes_ByComprobante` le permite una sola coincidencia (`maxValue = 1`, `Importador_Base.cs:1197-1198`). La decodificación genérica no lo encuentra y el registro queda en el log como error de comprobante inexistente. No se crea un anticipo automático para la cuenta. El operador lo resuelve a mano.
- **Una conexión por registro** (`Red_Link.cs:51`). En archivos grandes la importación es lenta, aunque no cambia la regla.
- **Interés.** La validación usa `VariablesConsulta` en modo "consulta de deuda". Si `BANCOS.PORC_INTERES` del ente es exactamente 0, fuerza el interés diario en cero (`Importador_Base.cs:1164-1178`). **[VERIFICAR]** el valor en el ente RED LINK de LAG.
- **Registración contable.** `Red_Link` no completa `TipoRegLibro` ni `Fecha_Rendicion` en las cobranzas, a diferencia de SIRO, que los toma de `BANCOS.TIPO_REG` y de la fecha de acreditación (`PR/SIRO.cs:296-302`). En la registración, una cobranza sin `TipoRegLibro` se asienta **"por caja"**: un único movimiento bancario (`RESBAN`) por caja (`ReglasNegocio.Cobranzas/clsRegistracionCobranza.cs:1694-1701`). Por eso, para LAG-Red Link, `BANCOS.TIPO_REG` **no tiene efecto** y la acreditación se registra con la fecha de la caja. **[VERIFICAR]** que la interfaz no lo complete por otro camino.

**Mensajes de error del importador** (además de los genéricos de la sección 4.6 del doc 05):

| Mensaje | Causa |
|---|---|
| "El código de ente indicado en el archivo no coincide con el número de convenio de la entidad." | Cabecera (1,3) ≠ `BANCOS.CONVENIO` |
| "La fecha de presentación del archivo no puede ser posterior a la fecha actual" | Cabecera (4,8) > hoy |
| "No es posible importar el archivo, verifique que el formato sea correcto" | El mapeo devolvió `null` (`:44-48`) o hubo cualquier excepción: línea corta, dígito no numérico, desborde de `Int32` (`:135-139`) |
| Advertencias de cantidad e importe | El pie no coincide con lo resuelto |

### 1.2 Envío de deuda a Red Link

No hay exportador con sigla LAG en `Exportador_Base.Modelos`. El archivo de deuda a Red Link, si Procoop lo genera, sale de un exportador genérico PR10 elegido en `BANCOS.COD_ARC2`. El importador espera un identificador de 10 dígitos (cuenta + servicio). Los genéricos que publican 10 dígitos son `E_RedLink_19_10` y `E_RedLink_19_10_Continuo`, pero **ninguno agrega el código de servicio**. Puede que LAG publique la deuda con otro sistema, o que Red Link mantenga el padrón heredado del sistema anterior. **[VERIFICAR]** con `BANCOS.COD_ARC2` y con un archivo real enviado.

### 1.3 SIRO (Banco Roela) en LAG

**Envío de la base de deuda (`ReglasNegocio.Cobranzas.Entidades.PR/E_SIRO.cs`, modelo 140; `E_SIRO_Ext.cs`, modelo 247).** El layout está en el doc 05, sección 5.2. Lo propio de LAG:

- **Convenio para el código de barras** (`E_SIRO.cs:96`, `:134`): el convenio del ente se normaliza a 10 caracteres (se trunca o se completa con ceros a la izquierda). **Solo si V2(2264) = "LAG"** se le antepone `"0"`, y ese convenio de 11 caracteres va al generador `PR_BancoRoela` (`:135`). El primer carácter, "0", termina siendo el **dígito de tipo de comprobante** del código de barras (sección 2).
- **Consecuencia general:** el generador exige 11 caracteres para facturas (`ReglasNegocio.Facturacion.CodigoBarra.Clientes/PR_BancoRoela.cs:113-117`). Para cualquier otra cooperativa recibe 10 y devuelve vacío. **LAG es la única cooperativa cuya base de deuda SIRO lleva código de barras** en las posiciones del registro destinadas a él.
- **Límite de importe:** si el código generado supera el ancho de 56 (por ejemplo, porque un total es ≥ $100.000,00 o porque entre vencimientos hay más de 99 días), se deja **vacío** sin avisar (`E_SIRO.cs:136-139`). El registro igual se informa, con los importes en 11 dígitos.
- **Talones y notificaciones:** el generador se llama siempre con `x.Comprobante.FACTURA` (`:135`). Cuando el origen es un talón (`TipoOrigen.Talon_*`, `Exportador_Base.cs:814`, `:1024-1104`), `FACTURA` es nulo. Para las demás cooperativas no pasa nada: el convenio de 10 caracteres corta antes. Para LAG, el convenio de 11 pasa la validación e intenta leer `ID_FAC` de un objeto nulo, lo que **probablemente aborta la exportación**, porque el `ForEach` no captura excepciones. **[VERIFICAR]** si LAG exporta talones a SIRO.
- La línea `E_SIRO.cs:26` (y `E_SIRO_Ext.cs:26`) compara la sigla con "LAG" y descarta el resultado: es código muerto.
- El identificador de usuario que se informa a SIRO es la **cuenta actual** (`COD_SUM` en 9 dígitos, `:91`), no el código del sistema anterior.
- El nombre del archivo es V2(2296) + fecha y hora (`:161-163`). En el catálogo, V2(2296) figura como "CUIT de Administrador de Cobranza de Banco Roela" (`clsVariables.cs:504`): el archivo se nombra con ese CUIT.
- Con V2(2807) activa, la base se informa además **por API** y el resultado queda en `SIRO_BASEDEUDA` (`:164-219`). **[VERIFICAR]**

**Rendición SIRO (`PR/SIRO.cs`, modelo 188).** No tiene rama LAG: se aplica el camino genérico.

1. Se descartan los registros con importe 0 (`:80`).
2. Si el dígito de tipo del código de barras (`Otros[4]`) es 5, el comprobante pasa a `"40"` + número de notificación (`:101-107`).
3. Se valida el convenio contra `BANCOS.CONVENIO` (`:119-123`).
4. Los comprobantes que empiezan con 7 son pagos web; los que empiezan con 8 se descartan (`:136-145`).
5. Resolución (`:239-285`):
   - Si el comprobante tiene 15 dígitos (`"41"` + `ID_FAC` en 13, como lo publica `E_SIRO`), se resuelve por la decodificación genérica. Además, `Cod_Sum` se completa con `Otros[5..12]`; en LAG ese valor es el `ID_FAC`, no la cuenta, y solo afecta lo que muestra el log.
   - Si no, se decodifica el código de barras de 56 con `PR_BancoRoela.Get_Facturas` (sección 2.3).
6. Toma `Fecha_Rendicion` de la fecha de acreditación y `TipoRegLibro` de `BANCOS.TIPO_REG`; si está vacío, usa "por comprobante" (`:296-302`).

**Ramas "FAL" que no aplican a LAG** (salvo que V2 2264 = "FAL"):

- `E_SIRO.cs:27-30`: excluye los comprobantes bloqueados (`ID_BLO = 1`).
- `PR/SIRO.cs:47-50`, `:128-131`, `:242-246`, `:340-395`: lee la cuenta en (44,9), acepta comprobantes de 14 dígitos y busca por `NUM_COM` + cuenta + `TOTAL1/TOTAL2`, o por talón.
- `PR/E_Macro.cs:36`: identifica por cuenta en lugar de socio.
- `Entidades.ANI/TarjetaNaranja.cs:30-37` y `:145-155`: comprobante en (77,8) y búsqueda de talones por `IMPORTE1` + cuenta + `NUM_COM`.

El enum del importador LAG se llama `FAL_RedLink`, lo que sugiere que se clonó de una cooperativa "FAL". En la lista de clientes Procoop figura "FALD" (`CapaNucleo/clsClientesProcoop.cs:261`), un cliente distinto.

### 1.4 Rama "LAGU" de la rendición Red Link genérica (`PR/RedLink_1.cs`)

Aplica solo si V2(2264) = "LAGU". Está documentada acá porque es la única otra rama con nombre parecido a "Laguna". **[VERIFICAR]** que LAG no use esa sigla.

- Agrega el período en (2,4) con formato `MMAA`, que se convierte a `MM/20AA` (`:38-41`, `:77`).
- Por registro busca:
  1. una factura con `COD_SUM` = cuenta (9,7), ese `PERIODO` y algún `TOTAL1..4` = importe (sin orden: la primera que devuelve la base);
  2. si no hay, un talón cuya factura tenga esa cuenta y ese período, y algún `IMPORTE1..4` = importe (`:72-83`).
- Resultado: `"41"` + `ID_FAC`, o `"42"` + número de talón. Si no encuentra nada, **conserva el comprobante (48,14) del archivo**, y solo si ese campo está vacío pone `"00000"` (`:84-95`).
- A diferencia de LAG, **usa el período**: elimina la ambigüedad de importes repetidos entre meses.
- El pie se valida contra la cantidad de registros + 2 (`:104`, `:109`).

---

## 2. Código de barras de Laguna Larga

### 2.1 Qué formato usa LAG

- En `CodigoBarra.Clientes` **no hay ninguna clase LAG**.
- El código que el código fuente asocia a LAG es el formato **"SIRO – Banco Roela"** (`TipoCodigo.PR_Banco_Roela = 34`, clase `PR_BancoRoela`, `ReglasNegocio.Facturacion.CodigoBarra/Codigo_Base.cs:112-113`, `:458`). Es el que `E_SIRO` usa para LAG.
- El código de la **factura impresa** depende de la plantilla: `clsFacturasImpresion.GetCodigoBarra(tipoCodigo, convenio, …)` recibe tipo y convenio como argumentos de la plantilla (`ReglasNegocio.Facturacion/clsFacturasImpresion.cs:2715-2728`). Los valores por defecto son V2(2055) (formato) y V2(2255) (convenio) (`Codigo_Base.cs:305-320`). **[VERIFICAR]** qué formato y convenio imprime la factura de LAG, y si también usa un formato Banco de Córdoba, Pago Fácil o el QR SIRO (`TipoCodigo.SIRO_QR = 65`).
- **La lectura en caja** acepta los formatos que figuran en `BANCOS.ID_CODBAR` más V2(2055) (`Codigo_Base.cs:734-746`). **[VERIFICAR]**

### 2.2 Estructura del código SIRO – Banco Roela (56 dígitos)

Generación para factura (`PR_BancoRoela.cs:111-148`). Posiciones base 1:

| Pos. | Largo | Contenido |
|---|---|---|
| 1-4 | 4 | `0447`: código de empresa recaudadora SIRO/Roela, fijo |
| 5 | 1 | **Tipo de comprobante** = primer carácter del convenio recibido. Para facturas de LAG es el **"0"** antepuesto en `E_SIRO`. Notificación = `5` y talón = `9` (fijos en sus variantes) |
| 6-13 | 8 | `ID_FAC` con ceros a la izquierda (notificación: `CNT_NOT`; talón: `NUMERO`) |
| 14-19 | 6 | Primer vencimiento `AAMMDD` (notificación: `VTO_CIR` o, si falta, `FECHA`) |
| 20-26 | 7 | Importe del 1.er vencimiento en centavos (máximo 99.999,99) |
| 27-28 | 2 | Días entre el 1.er y el 2.º vencimiento |
| 29-35 | 7 | Importe del 2.º vencimiento. Si los días son ≤ 0, las posiciones 27-35 van en ceros |
| 36-37 | 2 | Días entre el 2.º y el 3.er vencimiento, o V2(2869) si es distinto de 0 ("días máximo desde el último vencimiento para pagar", `clsVariables.cs:89`) |
| 38-44 | 7 | Importe del 3.er vencimiento. Si los días son ≤ 0, las posiciones 36-44 van en ceros |
| 45-54 | 10 | Convenio: los 10 caracteres siguientes al dígito de tipo (en el talón, el convenio completo de 10) |
| 55 | 1 | DV1 sobre las posiciones 1-54 |
| 56 | 1 | DV1 sobre las posiciones 1-55 |

Variantes:

- **Notificación** (`:150-171`): tipo `5`, sin 2.º ni 3.er vencimiento (18 ceros). Exige un convenio de 11 caracteres.
- **Talón** (`:173-210`): tipo `9`. Exige un convenio de **10** caracteres.

Como un mismo valor de convenio no puede tener 10 y 11 caracteres a la vez, con un único V2(2255) **o** salen las facturas **o** salen los talones. Lo mismo pasa en `BANCOS.CONVENIO`. **[VERIFICAR]** cómo lo resolvió LAG en la plantilla.

**Dígito verificador DV1** (`Codigo_Base.cs:502-519`):

- Pesos 1, 3, 5, 7, 9 y luego el ciclo 3, 5, 7, 9 (el 1 solo se usa en la primera posición).
- Se suman los productos dígito × peso, la suma se divide por 2 (división entera) y el resultado es ese cociente módulo 10.
- Es el algoritmo estándar de Banelco/Pago Fácil y SIRO, aplicado dos veces.

**Importes** (`Get_TextoImporte`, `Codigo_Base.cs:684-689`): se toma el valor absoluto, se redondea a 2 decimales y se expresa en centavos con ceros a la izquierda. **Un importe de 7 dígitos o más (≥ $100.000,00) hace que el código mida más de 56** y quede inválido. En la exportación SIRO ese caso se descarta (ver 1.3). En la impresión no hay control de largo en `PR_BancoRoela`. Lo mismo sucede si entre vencimientos hay más de 99 días. **[VERIFICAR]** la cantidad de facturas de LAG por encima de ese tope.

Los formatos SIRO alternativos sí admiten importes mayores: `PR_BancoRoela_Ext` (empresa `0449`, 59 dígitos, importes de 8) y `PR_SIRO_0448` (empresa `0448`, 59 dígitos, importes de 10) (`Clientes/PR_BancoRoela_Ext.cs:96-173`, `Clientes/PR_SIRO_0448.cs:10-67`). Pero `E_SIRO` y `E_SIRO_Ext` instancian siempre `PR_BancoRoela` (`E_SIRO.cs:84`, `E_SIRO_Ext.cs:84`).

### 2.3 Lectura del código SIRO (caja y rendición)

`PR_BancoRoela.Get_Facturas` (`:12-91`):

1. Exige 56 caracteres y valida **solo el último DV** (DV1 sobre las posiciones 1-55). Si no coincide: "El Código de barras ingresado es invalido" (`:29-34`).
2. Las ramas FOT (`:36-57`) y CON (`:58-67`) no aplican a LAG.
3. Según el tipo:
   - tipo `9`: talón por `TALONFAC.NUMERO` (`:68-76`);
   - tipo `5`: facturas de la notificación vía `COMPNOTI.CNT_NOT` (`:77-87`);
   - cualquier otro (incluido el "0" de LAG): factura por `ID_FAC` y primer vencimiento. Si no aparece, por **`COD_SUM` = número de 8 dígitos, primer vencimiento e importe 1** (`Buscar_Facturas`, `:93-109`). Ese segundo intento es otro camino de imputación por cuenta + importe.

---

## 3. Ramas condicionadas por cooperativa que alcanzan a LAG

Búsquedas hechas en todo `binarios/decompilado`: los literales `"LAG"`, `"LAGU"`, `"FAL"`, `"FALD"`, `"LA"`, `"LL"` y `"Laguna"`/`"LAGUNA"` (sin distinguir mayúsculas), los usos de V2(2264), y los CUIT literales con formato de cooperativa. Los únicos CUIT comparados en el código son los de TORN (`clsComprobanteFactura.cs:87`) y FEDECOBA (`Facturacion.Archivos/FEDECOBA.cs:25`). **No hay ninguna comparación con el CUIT de Laguna Larga.**

| # | Archivo:línea | Condición | Qué cambia para LAG |
|---|---|---|---|
| 1 | `ReglasNegocio.Cobranzas.Entidades/Importador_Base.cs:550` | Atributo `Sigla = "LAG"` | Registra el importador 264 (sección 1.1) |
| 2 | `ReglasNegocio.Cobranzas.Entidades.PR/E_SIRO.cs:134` y `E_SIRO_Ext.cs:134` | V2(2264) = "LAG" | Convenio con "0" antepuesto: dígito de tipo y código de barras en la base SIRO (sección 1.3) |
| 3 | `E_SIRO.cs:26` y `E_SIRO_Ext.cs:26` | V2(2264) = "LAG" | Nada: el resultado se descarta (código muerto) |
| 4 | `ReglasNegocio.Facturacion/clsEnargas.cs:1917-1920` (`Get_File_CMD`, protocolo SARI) | `filtros.Sigla = "LAG"` | En el archivo **CMD** (cobranzas de gas), el campo de identificador de comprobante pasa a ser: letra `A` si `FACTURAS.COD_SIT = 1` (situación frente al IVA, presumiblemente Responsable Inscripto) o `B` en otro caso, + punto de venta en 4 dígitos + número en 8. Las demás cooperativas informan `ID_FAC` (BOL, el comprobante) **[VERIFICAR]** el significado de `COD_SIT = 1` |
| 5 | `ReglasNegocio.Facturacion/clsEnargas2.cs:1402`, `:1436`, `:1450`, `:1458` (`Get_File_Usr`, protocolo FCU-DS) | `filtros.Sigla = "LAG"` | Al calcular saldos, deuda vencida y cobranza por usuario, se excluyen las facturas "migradas" con saldo cerrado. Para el resto, migrada = `USUARIO = "MIGRA_SP"`. **Para LAG, migrada = `USUARIO` igual a la propia cuenta (`COD_SUM` como texto).** En la cobranza (`:1458`) se excluyen esas facturas aunque no tengan `FECHASALDO`. Indica que la migración a Procoop cargó en `USUARIO` el código de la cuenta **[VERIFICAR]** |
| 6 | `clsEnargas2.cs:1624-1627` | `filtros.Sigla = "LAG"` | Nada: calcula un texto y no lo usa (código muerto) |
| 7 | `PR/RedLink_1.cs:38`, `:67` | V2(2264) = "LAGU" | No aplica si la sigla es "LAG" (sección 1.4) |
| 8 | `PR/E_SIRO.cs:27`, `PR/SIRO.cs:47`, `:128`, `:242-244`, `PR/E_Macro.cs:36`, `Entidades.ANI/TarjetaNaranja.cs:30`, `:145` | V2(2264) = "FAL" | No aplica si la sigla es "LAG" (sección 1.3) |
| 9 | `CapaNucleo/clsClientesProcoop.cs:262`, `:311` | Lista de clientes de Procoop: CUIT `30-54572894-6` → "LAGU" (código 631) y `33-54580202-9` → "LAGU" (código 694) | `GetCliente` (`:38-60`) busca por CUIT = V2(519) y, si hay más de uno, por nombre contenido en V2(518). El `Cod_Sum` resultante es el número de **cuenta de la cooperativa como cliente de Procoop**. Habilita el login directo (`CapaNucleo/Nucleo.cs:1079-1097`), WhatsApp (`ReglasNegocio.Telefonia/clsWhatsApp.cs:107`), SMS (`clsMensaje.cs:148`), NaranjaX (`ReglasNegocio.Cobranzas/clsNaranjaX.cs:226`), PMovil (`ReglasNegocio.Varios.PMovil/clsPMovil_Tecnica.cs:331`), CoopOnline y otros. Si el CUIT de LAG no está en la lista, varias de esas funciones fallan con una excepción por `Cod_Sum` nulo **[VERIFICAR]** cuál de los dos CUIT, si alguno, es el de Laguna Larga |

`filtros.Sigla` de ENARGAS es una propiedad de los filtros (`clsEnargas.cs:90`) que completa la interfaz (no está en `ReglasNegocio`). Se presume que se carga con V2(2264). **[VERIFICAR]**

No hay ramas por sigla que afecten a LAG en facturación, mora, AFIP, técnica, contabilidad ni sueldos. En todo eso LAG sigue el comportamiento genérico y los parámetros.

---

## 4. Reportes, exportaciones a entes y gas

**Reportes con nombre de LAG.** No hay reportes, plantillas ni nombres de archivo con "LAG" o "Laguna" en el código, ni archivos con ese nombre en `binarios/`. Los formatos de factura y los listados personalizados viven en la base (por ejemplo, la tabla `REPORTES`) o junto al ejecutable, fuera del código descompilado. **[VERIFICAR]**

**Exportaciones de Córdoba que le aplican por jurisdicción** (genéricas, sin rama LAG; el detalle está en los docs 02, 04, 06 y 10):

| Exportación | Dónde | Parámetros clave |
|---|---|---|
| ERSeP – Circular 70/2021 (régimen de ventas) | `ReglasNegocio.Facturacion.Archivos/TipoArchivos.cs:23`, `CIR7021.cs`, invocada desde `clsLibroIVA.cs:2514` | V2(737) código de empresa en ERSeP |
| ERSeP – archivo de consumos | `ReglasNegocio.Consumos/clsInformes_Consumos.cs:1701` (`Exportar_Archivo_ERSep`) | V2(737) |
| ERSeP – informe de pérdidas por servicio | `clsInformes_Consumos.cs:3549` | — |
| ERSeP – informe de servicios (titulares) | `ReglasNegocio.Titulares/clsInformes_Titulares.cs:2623`, `:8617` | — |
| ERSeP – DNU 311/2020 (riesgo de corte) | `ReglasNegocio.Titulares/clsCirculares.cs:2523` | V2(2203), V2(2204) |
| ERSeP – tarifa social 166/16, 296/16 y 617 | `ReglasNegocio.Titulares/clsTarifaSocial.cs:417-425` | — |
| Secretaría de Energía | `clsInformes_Consumos.cs:6289` | — |
| FECESCOR (federación de cooperativas de Córdoba): rendición de facturas de terceros y tarjeta | `ReglasNegocio.Facturacion/clsInformes_Facturacion.cs:1266`; variables 68, 3039, 3096, 3114, 3158 y 3190 | **[VERIFICAR]** si LAG es adherente |

**Gas (ENARGAS).** LAG es la única cooperativa con rama propia en los dos protocolos ENARGAS (filas 4 y 5 de la sección 3), lo que confirma que distribuye gas por redes. Junto con el servicio "GS" del importador Red Link, el piloto tiene que contemplar:

- el servicio de gas, con categorías `CATE_SER.COD_ENGAS` y servicio con `TIP_CAL = 3` (`clsEnargas2.cs:1389`);
- los archivos SARI o FCU-DS según V2(2603);
- las variables 2254-2260, 2728 y 3174 (doc 09).

**[VERIFICAR]** qué protocolo presenta LAG y si el distribuidor es ella misma o un subdistribuidor (V2 2254).

---

## 5. Datos a confirmar en `PR_LAG_DEMO`

Todas las consultas son de **solo lectura** (T-SQL). Los nombres de columnas salen del código; si alguno no existe en la versión de la base, usar `SELECT TOP 5 *` sobre la tabla. **No hay que copiar al relevamiento los valores de credenciales** (usuario y clave SIRO, Pagos360, etc.): para esas variables solo se verifica si están cargadas.

1. **Sigla, razón social y CUIT** (V2 2264, 518, 519) **[VERIFICAR]**: confirmar que 2264 = "LAG" y comparar 519 con los dos CUIT "LAGU" de `clsClientesProcoop`.
   `SELECT COD_VAR, NOM_VAR, TIP_VAR, CARACTER FROM VARIABLE WHERE COD_VAR IN (2264, 518, 519);`
2. **Código de barras y SIRO** (V2 2055, 2255, 2869, 2807, 2296, 2818, 3006, 3047, 3144) **[VERIFICAR]**:
   `SELECT COD_VAR, NOM_VAR, TIP_VAR, CARACTER, NUMERICA, LOGICA FROM VARIABLE WHERE COD_VAR IN (2055, 2255, 2869, 2807, 2296, 2818, 3006, 3047, 3144);`
   Credenciales SIRO, solo presencia:
   `SELECT COD_VAR, NOM_VAR, CASE WHEN LEN(ISNULL(CARACTER,'')) > 0 THEN 'cargada' ELSE 'vacía' END AS estado FROM VARIABLE WHERE COD_VAR IN (2492, 2493, 2804, 2805);`
3. **Entes recaudadores** (RED LINK, SIRO, DOCUMENTOS A COBRAR) **[VERIFICAR]**: modelo de rendición (`COD_ARC` = 264 o 188), modelo de envío (`COD_ARC2`), convenio (¿3 dígitos para Red Link? ¿10 para SIRO?), formato de código de barras del ente, interés, forma de asiento.
   `SELECT COD_BAN, DES_BAN, COD_ARC, COD_ARC2, CONVENIO, ID_CODBAR, CONV_CODBAR, DIFERIR, PORC_INTERES, COBVTO1, TIPO_REG, ARC_CONFIG FROM BANCOS ORDER BY COD_BAN;`
4. **Rango de cuentas** (desborde de `Int32` y cuentas "cuenta × 100 + servicio") **[VERIFICAR]**:
   `SELECT MIN(COD_SUM) AS minimo, MAX(COD_SUM) AS maximo, COUNT(*) AS total, SUM(CASE WHEN COD_SUM >= 100000000 THEN 1 ELSE 0 END) AS de_9_o_mas_digitos FROM SUMSOC;`
5. **Uso de `FACTURAS.USUARIO`** (fallback del importador y criterio de migración de ENARGAS) **[VERIFICAR]**:
   `SELECT COUNT(*) AS total, SUM(CASE WHEN USUARIO = CAST(COD_SUM AS varchar(20)) THEN 1 ELSE 0 END) AS usuario_igual_cuenta, SUM(CASE WHEN ISNULL(USUARIO,'') NOT IN ('', CAST(COD_SUM AS varchar(20))) THEN 1 ELSE 0 END) AS usuario_distinto, MAX(CASE WHEN ISNULL(USUARIO,'') NOT IN ('', CAST(COD_SUM AS varchar(20))) THEN FECHA END) AS ultima_fecha_distinto FROM FACTURAS;`
6. **Tipos de factura por servicio** (EN/GS/AG/SV del importador; ¿existe un tipo "03"?) **[VERIFICAR]**:
   `SELECT f.TIPO, COUNT(*) AS cantidad, MIN(f.FECHA) AS desde, MAX(f.FECHA) AS hasta FROM FACTURAS f GROUP BY f.TIPO ORDER BY cantidad DESC;` y `SELECT * FROM TIPO_FAC;`
7. **Importes repetidos por cuenta y tipo** (riesgo de imputación equivocada y de duplicados en el archivo) **[VERIFICAR]**:
   `SELECT COD_SUM, TIPO, TOTAL1, COUNT(*) AS veces FROM FACTURAS WHERE FECHA >= DATEADD(year, -1, GETDATE()) AND ESTADO = '' GROUP BY COD_SUM, TIPO, TOTAL1 HAVING COUNT(*) > 1 ORDER BY veces DESC;`
8. **Facturas que superan el tope del código SIRO de 56** (importe ≥ 100.000 o más de 99 días entre vencimientos) **[VERIFICAR]**:
   `SELECT COUNT(*) AS facturas, SUM(CASE WHEN TOTAL1 >= 100000 OR TOTAL2 >= 100000 OR TOTAL3 >= 100000 THEN 1 ELSE 0 END) AS importe_excedido, SUM(CASE WHEN DATEDIFF(day, VTO1, VTO2) > 99 OR DATEDIFF(day, VTO2, VTO3) > 99 THEN 1 ELSE 0 END) AS dias_excedidos FROM FACTURAS WHERE FECHA >= DATEADD(month, -6, GETDATE());`
9. **Uso real de cada ente** (cuántas cajas y cobranzas por ente en el último año) **[VERIFICAR]**:
   `SELECT p.COD_BAN, b.DES_BAN, COUNT(*) AS cajas, MAX(p.FECHA) AS ultima FROM PLAN_CAJ p LEFT JOIN BANCOS b ON b.COD_BAN = p.COD_BAN WHERE p.FECHA >= DATEADD(year, -1, GETDATE()) GROUP BY p.COD_BAN, b.DES_BAN;`
10. **SIRO por API y pagos web** **[VERIFICAR]**:
    `SELECT TOP 20 Nro_transaccion, Fecha_Envio, Estado, Registros_procesados, Registros_erroneo FROM SIRO_BASEDEUDA ORDER BY Fecha_Envio DESC;` y `SELECT COUNT(*) FROM PAGOS360 WHERE ID_SIRO IS NOT NULL;`
11. **Talones en uso** (riesgo de excepción en `E_SIRO` para LAG) **[VERIFICAR]**:
    `SELECT CUOTA, COUNT(*) AS talones, MAX(FEC_ALTA) AS ultimo FROM TALONFAC GROUP BY CUOTA;`
12. **Situación IVA de las facturas** (letra A/B en el CMD de ENARGAS) **[VERIFICAR]**:
    `SELECT COD_SIT, COUNT(*) FROM FACTURAS GROUP BY COD_SIT;` y cruzarlo con la tabla de situaciones de IVA.
13. **Gas y ENARGAS** (V2 2254-2260, 2603, 2728, 3174 y categorías) **[VERIFICAR]**:
    `SELECT COD_VAR, NOM_VAR, CARACTER, NUMERICA, LOGICA FROM VARIABLE WHERE COD_VAR IN (2254, 2256, 2257, 2258, 2259, 2260, 2603, 2728, 3174);`, `SELECT * FROM SERVICIO WHERE TIP_CAL = 3;` y `SELECT COUNT(*) FROM CATE_SER WHERE COD_ENGAS IS NOT NULL;`
14. **Exportaciones de Córdoba** (V2 737 y FECESCOR) **[VERIFICAR]**:
    `SELECT COD_VAR, NOM_VAR, CARACTER, NUMERICA, LOGICA FROM VARIABLE WHERE COD_VAR IN (737, 2203, 2204, 68, 3039, 3096, 3114, 3158, 3190);`
15. **Plantilla de factura y código de barras impreso** **[VERIFICAR]**: buscar en la tabla de reportes la llamada a `GetCodigoBarra` y sus argumentos (formato y convenio).
    `SELECT TOP 50 * FROM REPORTES;` (identificar la columna que guarda el diseño y filtrar con `LIKE '%GetCodigoBarra%'`).
16. **Otros parámetros que cambian la rendición** (duplicados, bloqueadas) **[VERIFICAR]**:
    `SELECT COD_VAR, NOM_VAR, LOGICA FROM VARIABLE WHERE COD_VAR IN (3200, 3169, 2586, 2596, 2686);`

Nota: `PR_LAG_DEMO` es una base de demostración. Si fue armada desde una copia de producción, los datos de 4 a 12 son representativos; si no, solo la configuración (1-3 y 13-16) es confiable. **[VERIFICAR]**

---

## Implicancias para GoodApps (by-pass y transición)

1. **Mantener un "resolutor LAG" solo durante la transición.** Los archivos Red Link que lleguen después del corte traerán el identificador que Red Link tiene hoy (8 dígitos de cuenta, o 7 si es gas, más 2 de servicio, o el código del sistema anterior). GoodApps tiene que aceptar esa clave y resolverla mejor que Procoop:
   - solo comprobantes **impagos**;
   - desempatar por vencimiento vigente a la fecha de cobro y, si sigue ambiguo, por el más antiguo;
   - si quedan dos candidatos, **no imputar**: dejar el pago a cuenta con aviso;
   - aceptar identificadores sin desborde (enteros de 64 bits o texto).
2. **Tabla de equivalencias de claves.** Migrar `FACTURAS.USUARIO` y las cuentas "cuenta × 100 + servicio" a una tabla de alias (clave externa → cuenta + servicio de GoodApps) es más limpio que repetir la búsqueda por `USUARIO`. Vale lo mismo para el criterio de "factura migrada" de ENARGAS (`USUARIO = COD_SUM`).
3. **Publicar a los entes un identificador autocontenido.** Para Red Link y SIRO conviene publicar un identificador de comprobante (equivalente a "41" + ID). Así la rendición deja de depender del importe. El cambio tiene que coordinarse con Red Link y SIRO, y convivir con el padrón anterior hasta que venzan las facturas emitidas por Procoop.
4. **Código de barras SIRO.** Si LAG sigue con SIRO, GoodApps puede generar el formato `0447` de 56 (tipo, ID, vencimientos, convenio y DV1 doble, sección 2.2) para no reimprimir convenios. Pero **con los importes actuales el formato de 7 dígitos no alcanza**. Hay que acordar con Banco Roela un formato de importe extendido (los `0448` o `0449` que Procoop ya conoce) y, en la transición, leer los tres formatos en caja. GoodApps tiene que validar el largo antes de imprimir; Procoop no lo hace.
5. **Registración bancaria configurable de verdad.** En Procoop, la rendición Red Link de LAG ignora `BANCOS.TIPO_REG` y asienta "por caja". Al pasar a GoodApps conviene acordar con la contaduría de LAG si quieren mantener ese asiento único por caja o pasar a uno por fecha de acreditación, porque cambia la conciliación bancaria del período de transición.
6. **Gas desde el día 1.** Las ramas ENARGAS confirman que LAG factura gas. El piloto necesita el servicio GS con categorías ENARGAS, la exportación CMD con la identificación "A/B + punto de venta + número" que LAG presenta hoy, y la exportación Usr. No se puede postergar como "solo energía".
7. **Funcionalidades atadas a la "cuenta Procoop".** WhatsApp, SMS, login directo y PMovil dependen de que LAG figure en `clsClientesProcoop`. Si durante la transición LAG sigue usando esas funciones de Procoop, no hay que cambiar V2(518) ni V2(519) en la base Procoop.
8. **Quitar la deuda técnica, no replicarla.** No hace falta portar:
   - las ramas muertas (`E_SIRO.cs:26`, `clsEnargas2.cs:1624`);
   - las ramas "FAL" y "LAGU";
   - la excepción por talones en `E_SIRO`.

---

## Dudas abiertas

1. **Sigla real.** ¿V2(2264) vale "LAG" en producción? ¿Alguna vez valió "LAGU" o "FAL"? ¿A qué cooperativas corresponden los dos CUIT "LAGU" de `clsClientesProcoop` (`30-54572894-6`, `33-54580202-9`)? ¿Alguno es Laguna Larga?
2. **Layout real del archivo Red Link de LAG.** ¿Qué hay en las posiciones 0, 14-22 y de la 43 en adelante? ¿El concepto 002 identifica siempre al gas? ¿El código de servicio 03 existe? Pedir dos o tres archivos reales de rendición y uno de envío.
3. **Quién genera la deuda en Red Link.** ¿La envía Procoop (con qué `COD_ARC2`, si ningún genérico agrega el servicio), otro sistema, o Red Link conserva un padrón histórico?
4. **Convenio para el código de barras.** ¿Qué valores tienen V2(2255), `BANCOS.CONVENIO` y `BANCOS.CONV_CODBAR` del ente SIRO? ¿La factura de LAG imprime `PR_Banco_Roela` (56), un formato extendido o el QR SIRO? ¿Cómo imprime talones, si el formato exige un convenio de otro largo?
5. **Importes ≥ $100.000.** ¿LAG notó facturas sin código de barras en SIRO o códigos ilegibles en la factura impresa? ¿Pasó a un formato extendido?
6. **Excepción con talones en SIRO.** ¿LAG exporta talones o notificaciones a SIRO? Si lo hace, ¿falla la exportación?
7. **Migración anterior.** ¿De qué sistema migró LAG a Procoop y cuándo? ¿Sigue llegando dinero identificado con el código anterior (`FACTURAS.USUARIO`)? Define cuánto tiempo hay que mantener el alias en GoodApps.
8. **Catálogo de parámetros.** El doc 05 describe V2(2296) como "nombre del archivo SIRO" y V2(2686) como "incluir talones en la exportación". El catálogo (`clsVariables.cs:504`, `:571`) los llama "CUIT de Administrador de Cobranza de Banco Roela" y "Utilizar el tipo de primer factura al usar concepto de LINK". Conviene que el responsable del doc 05 lo revise.
9. **ERSeP y FECESCOR.** ¿Qué presentaciones a ERSeP hace hoy LAG desde Procoop (Circular 70/2021, consumos, DNU 311, tarifa social)? ¿Es adherente a FECESCOR?
10. **Gas.** ¿LAG es distribuidora o subdistribuidora (V2 2254)? ¿Presenta SARI o FCU-DS? ¿Qué significa `COD_SIT = 1` en su base?
