# Contraste del documento externo "NucleoTransversal-Modelo" con la especificación de GoodApps Cooperativas

| Campo | Valor |
|---|---|
| Documento revisado | `NucleoTransversal-Modelo.md` (1.446 líneas, 17 capítulos, 6-11-2026, autor externo) |
| Contrastado contra | `docs/especificacion/` (maestra, DEC-001 a DEC-092, preguntas abiertas, anexos M01 a M19 y T01 a T12) y `procoop-relevamiento/` (catálogo de 659 tablas, reglas de negocio, fichas de integración) |
| Fecha | 7-11-2026 |
| Estado | Informe de revisión. El 10-11-2026 el solicitante aprobó, de a una, las 11 incorporaciones de prioridad alta (A1 a A11) con la opción recomendada y la corrección de las 11 inconsistencias internas: quedaron registradas como DEC-093 a DEC-104 y PA-FIS-23 a PA-FIS-26, y se aplican en los anexos. Las prioridades media y baja (5.2 y 5.3) no se aplicaron. *Reemplazado (10-11-2026): "Informe de revisión. No modifica la especificación; las incorporaciones requieren aprobación."* |
| Detalle por capítulo | `_trabajo/contraste-01-04.md`, `contraste-05-07.md`, `contraste-08-10.md`, `contraste-11-13-original.md` y `contraste-11-13.md` (dos revisiones independientes de los mismos capítulos), `contraste-14-16.md` |

## 1. Conclusión

El documento es un trabajo serio de relevamiento de ProCoop y la mayoría de sus principios funcionales coinciden con los nuestros: datos en filas y no en columnas, historia con vigencia, identidad única de la persona, numeración sin huecos, separación de funciones, secretos fuera del código. Pero tiene tres problemas de fondo:

1. **Parte de una arquitectura distinta de la nuestra.** Propone una instalación aislada por cooperativa, GestionApps como sistema base y claves foráneas declaradas en una base relacional. Nuestra especificación decidió lo contrario: base única compartida con `tenantId` (DEC-002), stack propio Node/MongoDB (DEC-001) e integridad validada en el dominio. En esos puntos prevalece nuestra especificación.
2. **Está desactualizado respecto de lo nuestro.** Marca como "Sin analizar" medición, mora, stock, técnica, sueldos y canales, que en nuestra especificación tienen anexo completo. De sus 58 definiciones pendientes, 49 ya están respondidas por una DEC, una PA o un requisito.
3. **Describe mal varias cosas de ProCoop.** Hay unos 50 errores de hecho, casi todos menores, pero algunos importantes: la base imponible, la simulación de cuadros, el CESP de la liquidación de servicios públicos, el circuito de firmas de órdenes de pago y las provincias de Ingresos Brutos.

Lo valioso es que, al contrastarlo, aparecen **huecos reales de nuestra especificación**, sobre todo en tres frentes: la decisión de varias entidades jurídicas por cooperativa (DEC-064) quedó incompleta en varias colecciones, hay temas fiscales propios de la cooperativa que no tratamos, y hay detalles de modelo (frentes, zonificación, verificador de integridad) que conviene sumar.

## 2. Resultado por veredicto

Se evaluaron 112 temas (una fila por cada subsección del documento).

| Veredicto | Cantidad |
|---|---|
| Coincide | 47 |
| Coincide parcial (lo tenemos, el documento aporta un detalle) | 44 |
| Contradice una decisión nuestra | 15 |
| Error del documento como veredicto principal | 3 |
| Nuevo útil | 1 |
| Nuevo descartable | 2 |

Además de las filas, cada borrador lista los errores de hecho del documento (unos 50 en total) y los aportes priorizados (unos 40).

## 3. Lo que está bien

El documento acierta, y coincide con nuestra especificación, en:

- **Estructura:** varias empresas (personas jurídicas) por cooperativa con CUIT, condición fiscal y certificados propios (DEC-064); sucursales y puntos de venta; usuario con acceso a varias empresas.
- **Personas:** persona única con roles (socio, cliente, proveedor, empleado); vínculos con vigencia; transferencia de titularidad; alta asistida con control de duplicados; bajas por tipo; datos personales bajo la Ley 25.326 (M01, DEC-076).
- **Domicilios e inmuebles:** domicilio normalizado contra un maestro de calles (DEC-046); inmueble independiente de la cuenta con unidades funcionales; nomenclatura catastral configurable (M01).
- **Tarifas:** cuadros versionados con estados; componentes como filas; coeficientes y series con vigencia; prorrateo; simulación antes de aprobar (M04).
- **Comprobantes:** cabecera común y relaciones entre comprobantes; anulación por nota de crédito; numeración transaccional sin huecos; hasta cuatro vencimientos; CAE con CAEA de contingencia (M05, M06, DEC-018, DEC-035, DEC-038).
- **Impuestos y contabilidad:** IVA por reglas con vigencia; percepciones separadas; padrones y retenciones con vigencia; Convenio Multilateral; plan de cuentas jerárquico con mapeo a plan sectorial; asientos automáticos; ajuste por inflación; presupuesto (M06, M15).
- **Tesorería y seguridad:** libro único de movimientos de fondos (`treasuryMovements`, M14); echeq; órdenes de pago con firmas por monto; conciliación; identidad única con segundo factor; permisos por acción y alcance; pares incompatibles; auditoría con lecturas sensibles; bóveda de secretos (T02, T08, DEC-074).
- **Migración:** unificación del padrón, rechazo de huérfanos con informe, normalización de domicilios y usuarios sin contraseña con invitación de activación (T07, PA-MIG-07).
- **Cifras de ProCoop confirmadas:** 659 tablas en 31 módulos; `SERVICIO` 150 columnas, `PROD_SER` 90, `CATE_SER` 97, `CATTARIF` 44, `COMPROB` 38, `SUMSOC` 72, `SERSOC` 119, `TIPO_FAC` 57, `PROPIEDA` 102; la terna tipo, punto de venta y número en exactamente 53 tablas; 38 tablas de stock, 89 de técnica, redes y telefonía, 56 de sueldos.

## 4. Lo que está mal

### 4.1 Contradicciones con decisiones nuestras (prevalece nuestra especificación)

| Tema | El documento propone | Nuestra especificación | Por qué prevalece lo nuestro |
|---|---|---|---|
| Instalación (DD-08, 2.1, 15) | Una instalación aislada por cooperativa | Base única compartida con `tenantId` (DEC-002) | Es la base del modelo SaaS; la base por cooperativa es la deuda que reemplazamos. |
| Sistema base (DD-01) | GestionApps como base | Stack propio sobre el patrón Connectia (DEC-001, DEC-007) | GestionApps no forma parte de nuestras fuentes. |
| Integridad (13.10) | Claves foráneas declaradas en la base | MongoDB; integridad por módulo dueño, fotos en lo emitido, `$jsonSchema`, control optimista (RN-PLA-044, RN-DAT-003, RN-DAT-007) | El medio no aplica al stack; el objetivo sí (ver aporte de verificador nocturno). |
| Fórmulas (5.6) | Reglas sin fórmulas libres | Reglas declarativas y, si no alcanzan, fórmulas en entorno aislado (RF-TAR-067, RF-TAR-068) | Sin fórmulas no se migran los cargos reales de ProCoop (tasas, subsidios, PIST/VAD en `CARGOS_ADICIONALES.FORMULA_*`). |
| Catálogo (5.2) | Un solo catálogo de ventas y compras con la cuenta en el concepto | Catálogos por dueño y cuentas asignadas por M15 (AGR-002) | El módulo de origen no elige cuentas. |
| Cabecera única (6.3) | Todos los comprobantes en una sola colección | Cabecera compartida como tipo, colecciones por módulo | Respeta la propiedad por módulo (RN-DAT-003). |
| Letra (6.1) | Letra derivada en un tipo genérico | Cada letra es un tipo con su código ARCA, elegido por matriz | ARCA codifica por tipo y letra. |
| Vencimientos (6.5) | Sin tope | De 1 a 4 (RF-FAC-086) | Coincide con ARCA y con la impresión. |
| Numeración (7.2) | Lo no autorizado vuelve a borrador | Número al emitir; si ARCA rechaza, se reenvía el mismo (DEC-035) | Volver a borrador deja huecos o fuerza a renumerar. |
| Imputación (9.3) | Impedir registrar un comprobante sin cuenta | Evento pendiente y bloqueo del cierre (PA-CON-02) | No frena la facturación masiva. |
| Compras (10.1) | Un documento que avanza por estados | Documentos separados vinculados ítem a ítem (M12) | Cada uno tiene dueño y efectos propios (stock, impuestos, asientos). |
| Identidad (12.1) | El usuario es una persona; migrar contraseñas con cambio obligatorio | Identidad global sin vínculo directo a la persona; no se migran contraseñas (PA-MIG-07, RN-MIG-013) | Privacidad entre cooperativas, y las contraseñas de ProCoop usan cifrado reversible. |
| Secretos (DD) | "Fuera de la base" | Cifrados en MongoDB con clave maestra en KMS (DEC-074) | Es una precisión: fuera de las colecciones de negocio. |
| Sesión (2.6) | Elegir la empresa al ingresar | La entidad se resuelve por documento (RF-CFG-137) | Un usuario opera varias entidades sin cambiar de sesión. |

### 4.2 Errores de hecho sobre ProCoop (los más relevantes)

- **Base imponible (8.3):** `IMPUESTOS_X_CAT` no define la base; solo selecciona productos para un informe. La base sale de las fórmulas de cargos adicionales, y ProCoop sí calcula impuesto sobre impuesto.
- **Simulación (5.7):** dice que ProCoop no simula cuadros; tiene `SimularFacturasConCuadros` y la función `TotalSimulacionCuadro`.
- **Cuadro aplicado (5.3):** no se guarda en el renglón; `FACTURAS.COD_CUA` está en la cabecera y se completa recién al crear el cuadro siguiente.
- **CESP (7.3, 7.6):** dice que la liquidación de servicios públicos pide CAE o CAEA; en ProCoop se autoriza con CESP (`CESPAFIP`) y no pasa por WSFE.
- **Ingresos Brutos (8.4):** ProCoop no opera en una sola provincia; tiene importadores de Córdoba y ATER y exportadores ARBA, Santa Fe, La Pampa, Río Negro y SIRCAR.
- **Liquidaciones propias (8.8):** ProCoop sí genera Libro IVA, SICORE, SIRE y SIRCAR.
- **Compras (10):** `COMP_COM` es el remito, no la factura, y la orden de compra se maneja sobre `NPEDIDO`.
- **Firmas de órdenes de pago (11.6):** dice que está "bien resuelto"; la firma y entrega masiva no valida permisos ni registra el usuario, y los firmantes impresos salen de un parámetro de texto.
- **Librador (11.5):** `CTASUCE` sí guarda el CUIT del librador.
- **Contraseñas (12.1):** el riesgo es mayor que el que describe: cifrado reversible y contraseñas maestras en el código. De los "siete lugares con credenciales" se verifican cuatro.
- **Transferencias (3.6):** no es algo nuevo: existe `TRANSFER` con transferencia de cuenta, servicio y capital.
- **Tablas mal interpretadas:** `OCUPACIO` son ocupaciones de personas, no del inmueble; `POSTALES` son empresas de reparto, no zonas; `MEDSOC` es el medidor instalado, no el historial (`HIS_MEDSOC`); las áreas son tres tablas (`USERS_AREA`, `TUR_AREAS`, `ACT_AREAS`).
- **Cifras:** las tablas de extensión son unas 18 a 20, no 25; los "módulos 19 a 26" incluyen Informes y dejan fuera Comunicaciones.
- **IVR (13.8):** ProCoop no hace llamadas; exporta archivos para discadores externos.
- **"Sin claves foráneas" (13.10):** no está demostrado y hay indicios en contra.

### 4.3 Afirmaciones normativas sin respaldo (a verificar con el contador o asesor legal)

- IVA 21 % o 27 % según el uso del inmueble para el responsable inscripto.
- Qué norma obliga a usar la liquidación de servicios públicos (el documento cita la RG 3571/2013, que nosotros tratamos como régimen de información), el alcance de la RG 5003 y el efecto de la RG 5866/2026.
- Exención de Ingresos Brutos en Córdoba para cooperativas eléctricas.
- Contribución Especial sobre el Capital Cooperativo.
- Reforma de Ganancias de 2026 para cooperativas.
- Si un recibo puede discriminar el IVA de los intereses (nosotros usamos nota de débito, PA-MOR-04) y si hay tope legal de pago en efectivo.

## 5. Elementos nuevos que conviene incorporar

### 5.1 Prioridad alta

| # | Qué es | Dónde iría | Origen |
|---|---|---|---|
| A1 | **Compatibilidad en la factura agrupada:** no mezclar servicios que exigen liquidación de servicios públicos con servicios de factura común (internet, telefonía, sepelio), salvo conceptos accesorios declarados por el contador. Hoy RN-FAC-040 puede meter internet dentro de una liquidación de servicios públicos. | M05 (RN-FAC-040, RF-FAC-067), M06, PA nueva | 7.4 |
| A2 | **Validación normativa de la liquidación de servicios públicos:** norma, vía de autorización (CESP, CAE o CAEA), RG 5003 y RG 5866/2026. Puede cambiar PA-FIS-02. | M06, PA nueva para el contador | 7.3 |
| A3 | **Obligaciones y exenciones propias de la cooperativa:** exenciones por actividad y jurisdicción con fundamento y vigencia; contribuciones propias (Capital Cooperativo); reforma de Ganancias. | M06 (y M17 para la base de capital), PA nueva | 8.9 |
| A4 | **Completar DEC-064 (varias entidades jurídicas):** `legalEntityId` en `associateMemberships` (para ser socio de la cooperativa y afiliado de la mutual a la vez), en `costCenters`, en el alcance de roles y en la auditoría, y ámbito "entidad jurídica" para parámetros. | M17, M15, T02, T04, T05 | 2.1, 2.5, 12.4 |
| A5 | **Persona única en todos los maestros:** `personId` obligatorio en proveedores (M12), vendedores (M11), choferes y médicos (M18), con alta asistida. Hoy un socio contratista queda en dos fichas. Cambia RN-CMP-001. | M12, M11, M18, M01, PA nueva | 3.1 |
| A6 | **Origen de las sucursales en la migración:** RF-CFG-142 cita una columna que no existe; derivar `branches` de `PTOVENTA.SUC_COM` con revisión manual. | T04, T07 | 2.2 |
| A7 | **Personas sin ningún documento en la migración:** regla explícita (hoy solo se tratan los documentos inválidos). Urgente para LAG. | T07, M01 | 15 |
| A8 | **Verificador nocturno de referencias entre colecciones**, más una sección en T05 que explique cómo garantizamos integridad sin claves foráneas. | T05, T08 | 13.10 |
| A9 | **Fondos de cajas abiertas o sin rendir** en la posición diaria de tesorería. | M14 (RF-TES-145, RF-TES-168) | 11.1 |
| A10 | **Uso del suministro como condición opcional** en la matriz de alícuotas de IVA, sujeta a confirmar la regla del 27 %. | M06 (`vatRateMatrix`) | 4.4, 8.1 |
| A11 | **Ampliar la lista de secretos que la migración suprime** (RN-MIG-013): sumar la clave web de `SOCIOS`, la clave del proveedor de IA guardada en `VARIABLE` y las credenciales de proveedores, profesionales y empleados si aparecen en la base real; verificar que `CUPONTAR` no traiga números de tarjeta (DEC-091). | T07, T08 | 12.1, 11.7 |

### 5.2 Prioridad media

- **Zonificación por tipo con vigencia** (tributaria, tarifaria, de facturación, postal, técnica) y asignación por inmueble, cuenta o tramo de calle (T04 `zones`, consumida por M01, M03, M04 y M10).
- **Frentes con vigencia** y zona tributaria por frente, para tasas municipales por metro de frente (M01, M04; relevar con la piloto).
- **Efectos explícitos por tipo de comprobante:** deuda o crédito, libro IVA, stock, fondos, contabilización (M05 `voucherTypes`).
- **Preferencia declarativa en tarifas:** justificar cada fórmula y reportar la proporción de reglas con fórmula (M04).
- **Significado de los coeficientes** del cuadro (M04 `categoryCoefficients`).
- **Clase fiscal fotografiada en el renglón** de la factura (M05).
- **Régimen en las percepciones sufridas** de compras (M12).
- **Porcentaje de crédito fiscal computable calculado** por sección (M06 → M15).
- **Sucursal y obra como dimensiones explícitas** del asiento (M15).
- **Catálogo transversal de motivos** por tipo de operación (T04, T11, T02).
- **Códigos externos de organismos con vigencia** (T04).
- **Prioridad por defecto por campo al fusionar personas** (T07, M01).
- **Catálogo de asistentes de alta** (socio, cliente ocasional, proveedor, adherente, empleado) (M01, T03).

### 5.3 Prioridad baja

Tramos de calle con zona y código postal por defecto; detección de edificios en la migración; servicios disponibles del inmueble (agua, cloaca, pavimento); aviso por incoherencia entre uso del inmueble y categoría; costos del cuadro como lista extensible; vista de la cadena documental; vista previa del asiento al registrar la factura de proveedor; base imponible declarativa por lista de conceptos; percepción de IVA en regla propia; límites por medio de pago; jerarquía de áreas de atención.

## 6. Inconsistencias internas de nuestra especificación detectadas

Son correcciones nuestras, independientes del documento externo:

1. T07 mapea `USERS_AREA` a `orgUnits`, colección que no existe.
2. `RESPONSA` tiene dos destinos: M01 la trata como garantes y T07 como técnicos de campo; el catálogo respalda a T07.
3. RF-CFG-142 cita sucursales en `EMPRESAS` y `CAJASJP`, que no tienen esa columna.
4. DEC-064 no llegó a `associateMemberships`, `costCenters` ni al alcance de roles.
5. T07 da 89 columnas para `PROD_SER` y 56 para `TIPO_FAC`; el catálogo dice 90 y 57.
6. El enumerado `tariffServiceSettings.proration.method` de M04 no coincide con los métodos de RN-TAR-049.
7. `numberSequences.authorizationType` de M05 no admite `CESP`, aunque M06 lo usa.
8. `numberSequences.billingGroupId` figura como obligatorio en la tabla y como opcional en la descripción.
9. T07 apunta a una colección `recordLinks` no definida.
10. El IVR se trata distinto en tres anexos: T09 solo exporta contactos a un discador, T06 lo trata como integración opcional en O10 (FI-INT-66 dice además "Soportado por ProCoop" para un IVR que ProCoop no tiene) y T07 lo "reemplaza por canal de voz", que T09 no define. Hay que alinear T09, T06, T07 y M08.
11. El encabezado de M07 dice 14 tablas del §7 del catálogo; son 13.

## 7. Recomendación

1. **No adoptar el documento como fuente.** Sus principios útiles ya están en nuestra especificación y su arquitectura contradice DEC-001 y DEC-002.
2. **Corregir las inconsistencias internas de la sección 6**, que no requieren decisión.
3. **Registrar como DEC o PA las incorporaciones de prioridad alta** (sección 5.1). A1, A2, A3 y A10 necesitan al contador; A4 a A9 y A11 son decisiones de diseño.
4. **Llevar al contador la lista de la sección 4.3.**
5. **Devolver al autor** la lista de errores de la sección 4.2 y los 49 pendientes que ya están respondidos (detalle en `_trabajo/contraste-14-16.md`, sección 16), para que actualice su documento si lo sigue usando.

Los enlaces de la sección 17 del documento apuntan a artefactos externos de claude.ai que no están en el repositorio; no se verificaron.
