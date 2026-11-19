# Casos de prueba de aceptación — M03 MED — Medidores, lecturas, consumos, telemedición y prepago

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M03-MED-medicion-consumos.md`](../../especificacion/anexos/M03-MED-medicion-consumos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 129 CP de requisitos funcionales, 37 CP de escenarios ESC y 21 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M03 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Catálogos y medidores (M03 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0001 | RF-MED-001; M03 §5.1; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Administrar marcas de medidor por servicio. | Alta, edición y baja lógica; una marca en uso no se elimina. |
| CP-MED-0002 | RF-MED-002; M03 §5.1; PRO-O7-01 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Administrar tipos/modelos de medidor con servicio, marca, fase (monofásico/trifásico), multitarifa, registros, dígitos por defecto, prepago, telemedido, sistema de telemedición, disponible, "no indicado" y redondeo de prepaga. | No se puede instalar un medidor cuyo tipo no corresponda al servicio del punto. |
| CP-MED-0003 | RF-MED-003; M03 §5.1; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar la ficha del medidor: número, matrícula/serie de fábrica, marca, modelo, tipo, año, clase de exactitud, dígitos, factor multiplicador, HP (cantidad de hilos/fases), indicado, lectura con factor, unidades bonificadas, testigo… | Todo medidor tiene número, tipo, dígitos > 0 y factor ≠ 0; el número es único por tenant, servicio y marca. |
| CP-MED-0004 | RF-MED-004; M03 §5.1; PRO-O7-01 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Definir los registros del medidor (código, magnitud, unidad, dígitos y factor propios, indicado) para medidores multirregistro y multitarifa. | Un medidor de grandes usuarios puede tener registros de activa por franja, reactiva y demanda máxima por banda. |
| CP-MED-0005 | RF-MED-005; M03 §5.1; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Consultar la trayectoria completa del medidor: instalaciones, retiros, lecturas de colocación/retiro, ensayos, precintos, reparaciones (desde M13), fotografías y certificados. | La trayectoria muestra cada punto donde estuvo con fechas efectivas y de registro. |
| CP-MED-0006 | RF-MED-006; M03 §5.1; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Adjuntar fotografías y certificados al medidor, a la instalación y a los ensayos mediante el expediente documental. | Los adjuntos se ven con URL firmada y quedan versionados. |
| CP-MED-0007 | RF-MED-007; RN-MED-021; M03 §5.1; PRO-O7-01 | O7 | Estándar | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Registrar ensayos/contrastes del medidor con fecha, laboratorio o responsable, resultado (aprobado, rechazado, con observaciones), error medido y certificado. | Un medidor con último ensayo rechazado no puede instalarse (RN-MED-021). |
| CP-MED-0008 | RF-MED-008; M03 §5.1; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Registrar precintos (número, tipo, color, posición) colocados, retirados o violados, vinculados a la instalación y a la OT que los registró. | Un número de precinto no puede estar colocado en dos medidores a la vez. |
| CP-MED-0009 | RF-MED-009; M03 §5.1; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Registrar observaciones de medidor codificadas (catálogo) con fecha y autor. | Las observaciones quedan en la ficha y en el historial. |
| CP-MED-0010 | RF-MED-010; M03 §5.1; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Importar medidores en forma masiva por planilla (rango de números de serie o lista) validando duplicados y existencia del ítem serializado en M13. | Las filas duplicadas o inexistentes en stock se rechazan con motivo en el preview. |
| CP-MED-0011 | RF-MED-011; M03 §5.1; PRO-O7-01 | O7 | Núcleo | integración | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Mostrar en la ficha del medidor su estado de activo (disponible, instalado, retirado, en reparación, descartado) sincronizado con M13 y su estado de medición. | Un medidor "en reparación" o "descartado" en M13 no aparece como seleccionable para instalar. |
### 1.2 Puntos de medición, canales e instalaciones (M03 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0012 | RF-MED-012; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Crear el punto de medición al habilitar un servicio contratado medido (M01/M02), con tipo de punto (cliente, testigo, compra/frontera, interno, padre de distribución), ubicación geográfica, datos de acceso y zona/sector/recorrido de… | Un servicio de categoría medida no puede pasar a "conectado" sin punto con medidor instalado, salvo configuración de régimen no medido (BASE §88). Los puntos de compra/frontera exponen el volumen comprado a M12 (RF-MED-129; HUE-ELE-01, HUE-GAS-04); el alta por cambio de régimen llega por EVT-CAT-28 (RF-MED-128). Gas: se crea punto para gas natural y propano por red; el gas envasado no tiene punto ni medidor (DEC-030, DEC-082). |
| CP-MED-0013 | RF-MED-013; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Definir los canales del punto (energía activa entregada, activa recibida, reactiva entregada/recibida, demanda en punta, fuera de punta, en valle, energía por franja pico/resto/valle, volumen de agua, volumen de gas, generación) con… | kWh y kW nunca comparten canal; cada canal tiene unidad obligatoria. |
| CP-MED-0014 | RF-MED-014; M03 §5.2; PRO-O7-01 | O7 | Estándar | regla | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Proponer automáticamente los canales del punto según los conceptos de la categoría tarifaria vigente (grandes usuarios) y pedir confirmación. | Al cambiar la categoría a una de grandes usuarios se proponen los canales faltantes; no se borran canales con lecturas. |
| CP-MED-0015 | RF-MED-015; M03 §5.2; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Ordenar los canales de un punto por concepto facturable para su visualización y carga. | Orden configurable; por defecto, el orden del concepto en M04. |
| CP-MED-0016 | RF-MED-016; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar la instalación de un medidor en un punto con fecha y hora efectivas, lecturas iniciales por registro, factor vigente, mapeo registro → canal, motivo y OT de origen. | La instalación queda activa y el estado del activo pasa a "instalado" vía evento a M13. |
| CP-MED-0017 | RF-MED-017; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar el retiro de un medidor con fecha efectiva, lecturas finales por registro, motivo (cambio, desconexión con retiro, baja, robo, rotura) y OT de origen. | El retiro genera las lecturas finales como lecturas validables y cierra la instalación sin borrarla. |
| CP-MED-0018 | RF-MED-018; RN-MED-090; M03 §5.2; PRO-O7-01 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Ejecutar el cambio de medidor como una operación atómica (retiro + instalación) con continuidad de consumo en el período, aplicando opcionalmente la categoría nueva informada por la OT. | El consumo del período suma ambos tramos (RN-MED-090) y no se superponen instalaciones. |
| CP-MED-0019 | RF-MED-019; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Impedir instalaciones incompatibles o simultáneas: mismo medidor en dos puntos, dos medidores principales en el mismo canal y fecha, tipo de medidor de otro servicio, medidor no bidireccional en punto con generación distribuida, medidor no… | Cada caso se rechaza con un error RFC 9457 con código propio. |
| CP-MED-0020 | RF-MED-020; M03 §5.2; PRO-O7-01 | O7 | Núcleo | integración | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Recibir del cierre de OT (M10) las lecturas de retiro/colocación, precintos, fotos y el medidor nuevo, de manera idempotente y asíncrona. | Reenviar el mismo cierre no duplica instalaciones ni lecturas. |
| CP-MED-0021 | RF-MED-021; M03 §5.2; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Anular una instalación o retiro cargado por error con reversión de sus lecturas y consumos no facturados, y con motivo. | No se puede anular si alguno de sus consumos está facturado; en ese caso se exige ajuste. |
| CP-MED-0022 | RF-MED-022; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar el retiro por desconexión sin borrar el número del medidor ni su historia. | El punto queda sin medidor activo y la ficha conserva la instalación cerrada. |
| CP-MED-0023 | RF-MED-023; M03 §5.2; PRO-O7-01 | O7 | Núcleo | funcional | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Consultar el punto de medición: canales, medidor vigente, historial de instalaciones, ruta, último estado y fecha por canal, último consumo, testigo, GD, prepago y telemetría. | Todos los "últimos valores" se derivan de lecturas validadas, no se editan a mano. |
| CP-MED-0024 | RF-MED-024; M03 §5.2; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar la propiedad del medidor (cooperativa, socio, comunitario) y su efecto en cargos (M04) e inventario (M13). | La propiedad viaja en el contrato de datos a M04. |
| CP-MED-0128 | RF-MED-128; M03 §5.2; PRO-O7-01 | O7 | Estándar | integración | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Reaccionar al cambio de régimen de medición del contrato (`cat.contract.meteringRegimeChanged`, EVT-CAT-28 de M02): a `metered` crea el punto de medición (RF-MED-012) y pide la instalación del medidor con fecha efectiva; a `unmetered`… | Un contrato AG que pasa a `metered` el 01/12/2026 tiene punto creado y orden de instalación; hasta que haya medidor instalado y primera lectura válida no se generan consumos medidos (M02 sigue con cuota fija). Pasar a `unmetered` deja el punto sin medidor activo con lectura final; el mismo evento reenviado no duplica punto ni retiro. |
| CP-MED-0129 | RF-MED-129; M03 §5.2; PRO-O8-02 | O8 | Estándar | regla | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Exponer el volumen comprado por período de los puntos de compra/frontera (RF-MED-012; `meteringPoints.pointType` = `purchase` o `boundary`; RF-MED-100) por servicio (energía, gas), proveedor mayorista, punto y registro (pico, resto, valle… | Para el período 11/2026 la API devuelve, por punto de frontera, kWh por franja y kW de demanda iguales a los del informe de pérdidas; los volúmenes no validados se marcan como tales y no se ocultan. |
### 1.3 Rutas, cronogramas y lotes (M03 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0025 | RF-MED-025; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Administrar rutas de lectura con uno o más servicios, criterio de selección (por zona/sector/recorrido, por calle y rangos de numeración con pares/impares, por rango de cuentas, por polígono en mapa), zonas, categorías opcionales… | La vista previa de la ruta muestra cuántos puntos entran y por qué criterio. |
| CP-MED-0026 | RF-MED-026; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Definir el orden de recorrido: predeterminado, por titular, por calle y número, por zona y recorrido, por última toma del lecturista, o manual en mapa. | El orden se aplica a la descarga y a la impresión. |
| CP-MED-0027 | RF-MED-027; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Renumerar el recorrido de lectura según el orden real de la última toma (por zona y sector, de 5 en 5, desde 0), como propuesta aprobable. | La renumeración no se aplica sin confirmación y queda auditada. |
| CP-MED-0028 | RF-MED-028; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Cronograma: 2026-11: R-01 el 05-11-2026, R-02 el 06-11-2026; ventana de autolectura 02 al 04-11-2026. | Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. | El job crea los lotes en la fecha configurada y avisa si falta asignación. |
| CP-MED-0029 | RF-MED-029; M03 §5.3; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Generar un lote de lectura de una ruta para un período: una tarea por punto y canal leíble con la lectura anterior validada, fecha anterior, consumo anterior, rango esperado, datos de ubicación y datos opcionales configurables. | La generación es idempotente por ruta y período; regenerar solo agrega puntos nuevos. |
| CP-MED-0030 | RF-MED-030; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Bloquear que un punto esté en dos lotes abiertos del mismo período e informar el lote donde está. | El intento de agregarlo se rechaza con el código del lote existente. |
| CP-MED-0031 | RF-MED-031; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Marcar la tarea como "lectura real prioritaria" cuando el último consumo fue estimado. | El lecturista ve la marca y no puede cerrar la tarea con "estimar" sin observación. |
| CP-MED-0032 | RF-MED-032; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. | Una tarea solo tiene un asignado vigente; la reasignación queda en el historial. |
| CP-MED-0033 | RF-MED-033; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Descargar el lote al dispositivo del lecturista (PWA) con versión de cada tarea, o exportarlo a archivo para colectoras de terceros (CSV/Excel, uno por ruta o todos juntos). | La descarga registra versión y momento; la exportación incluye solo los campos habilitados. |
| CP-MED-0034 | RF-MED-034; M03 §5.3; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Supervisar el avance del lote en tiempo casi real: tareas pendientes, leídas, con observación, fuera de rango, con foto, sincronizadas, en conflicto, por lecturista, en lista y en mapa. | El tablero se actualiza tras cada sincronización. |
| CP-MED-0035 | RF-MED-035; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Revisar el lote con filtros: consumo mayor/menor que un valor, con observación, con foto, por lecturista, por fechas, solo fuera de rango, solo estimadas, solo con error. | Los filtros combinan con AND y se pueden guardar como vista. |
| CP-MED-0036 | RF-MED-036; RN-MED-034; M03 §5.3; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Confirmar el lote: convertir las lecturas capturadas válidas en lecturas validadas y consumos calculados, con las verificaciones de continuidad del RN-MED-034, dejando con error las rechazadas. | La confirmación es idempotente y reanudable; un registro rechazado informa su causa. |
| CP-MED-0037 | RF-MED-037; M03 §5.3; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Cerrar el lote cuando no queden tareas pendientes o cuando el supervisor acepte los pendientes como "no leídos" con motivo, generando estimación o relectura según política. | El acta de cierre informa totales leídos, estimados, no leídos y excepciones. |
| CP-MED-0038 | RF-MED-038; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Reabrir un lote cerrado mientras ninguno de sus consumos esté facturado, con motivo y auditoría. | Si hay consumos facturados, la reapertura solo afecta a los no facturados. |
| CP-MED-0039 | RF-MED-039; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Cancelar un lote sin lecturas procesadas; impedir la cancelación si tiene lecturas sin procesar salvo confirmación expresa del supervisor. | La cancelación no borra datos: deja el lote en "cancelado". |
| CP-MED-0040 | RF-MED-040; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Rutas: R-01 — Centro (zona 30), R-02 — Norte (por calle), R-TEL (solo telemedidos). | Conservar el historial de lotes y tareas (lo que hoy es `HISWORK`) para consulta y para ordenar futuras rutas. | Ninguna tarea confirmada se borra; se archiva. |
| CP-MED-0041 | RF-MED-041; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Imprimir la planilla de ruta (orden de recorrido) para lectura en papel y cargar luego por PAN-MED-09. | PDF con datos habilitados y espacio para estado y observación. |
| CP-MED-0042 | RF-MED-042; M03 §5.3; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Registrar horas de trabajo y productividad del lecturista derivadas de la app (inicio/fin de jornada, tareas por hora, distancia) y permitir carga manual. | El informe de productividad suma tareas y horas por lecturista y período. |
### 1.4 Captura de lecturas (M03 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0043 | RF-MED-043; M03 §5.4; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | App de lecturas offline (pwa-campo): ver tareas en orden, verificar suministro y medidor, capturar estado por registro, observación codificada, resultado, foto(s), GPS y hora; guardar localmente sin conexión. | Sin red se puede completar una ruta entera y sincronizar después sin pérdidas. |
| CP-MED-0044 | RF-MED-044; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Advertir en el dispositivo antes de guardar: estado fuera del rango esperado, menor que el anterior, más dígitos que el medidor, consumo cero en servicio conectado; pedir reingreso del valor en los casos fuera de rango. | La advertencia no bloquea el guardado; el reingreso debe coincidir. |
| CP-MED-0045 | RF-MED-045; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Exigir foto cuando el consumo está fuera de rango, cuando la observación lo requiere o cuando el parámetro lo exige para todo el servicio. | No se puede cerrar la tarea sin la foto exigida. |
| CP-MED-0046 | RF-MED-046; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Registrar el motivo de no lectura (inaccesible, medidor roto, perro, sin acceso, domicilio cerrado, medidor no encontrado, otros del catálogo) sin introducir cero. | Una tarea "no leída" nunca genera un consumo 0 real. |
| CP-MED-0047 | RF-MED-047; M03 §5.4; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Sincronizar con `clientMutationId` por lectura y por foto; confirmar recepción por ítem; reintentar automáticamente; nunca duplicar capturas. | Enviar dos veces la misma mutación produce un único registro. |
| CP-MED-0048 | RF-MED-048; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Detectar y resolver conflictos entre dispositivo y servidor: tarea reasignada, lote cancelado, medidor cambiado, lectura anterior modificada, lectura ya cargada por otro medio. Conservar ambas evidencias y asignar responsable de resolución. | Ningún conflicto sobrescribe silenciosamente; queda en PAN-MED-34. |
| CP-MED-0049 | RF-MED-049; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Permitir al lecturista crear novedades que generen OT (medidor roto, conexión directa, pérdida) cuando el parámetro lo habilita. | La novedad viaja como evento a M10 con foto y GPS. |
| CP-MED-0050 | RF-MED-050; M03 §5.4; PRO-O7-02 | O7 | Núcleo | integración | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Permitir al lecturista corregir su propia captura antes de sincronizar y, después, solo como nueva versión con motivo. | La versión anterior queda visible para el supervisor. |
| CP-MED-0051 | RF-MED-051; RN-MED-047; M03 §5.4; PRO-O7-02 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registro manual de lecturas en oficina por cuenta o por servicio: encabezado (fecha, período, servicio, titular, cuenta, observación, marca de consumo estimado), grilla por canal (fecha anterior, lectura anterior, consumo anterior, lectura… | La carga manual aplica las mismas validaciones del RN-MED-047 a 052 y genera lectura con origen "manual". |
| CP-MED-0052 | RF-MED-052; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Registrar un consumo adicional (lectura extra estimada con descripción "Consumo adicional") con motivo y autorización. | El consumo adicional se distingue del regular en la factura (M04) y requiere aprobación. |
| CP-MED-0053 | RF-MED-053; M03 §5.4; PRO-O7-02 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o por cuenta… | Un perfil nuevo se crea sin desarrollo; el preview muestra errores por fila. |
| CP-MED-0054 | RF-MED-054; M03 §5.4; PRO-O7-02 | O7 | Estándar | migración | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Proveer perfiles precargados equivalentes a los formatos de ProCoop: Aguas Cordobesas, CEMDO, Ordóñez, Oncativo, Brinkmann, Oliva, San José, 15 de Mayo, Caucete, Temetra, Nexus, Thinking, Bovetech, Hexing, Rainbow, Huinca, Trelew, Excel… | Cada perfil precargado se prueba con un archivo de ejemplo ficticio. |
| CP-MED-0055 | RF-MED-055; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Importar consumos directos (sin lectura ni ruta) desde archivos de terceros (ej. cloacas ARR, Nexus Electric) con aprobación previa. | Los consumos importados quedan con origen "importación directa" y pasan por validación. |
| CP-MED-0056 | RF-MED-056; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Recibir lecturas de colectoras portátiles conectadas a PC (PSION/Android por cable) por archivo exportado del dispositivo. | El archivo del captor se importa por un perfil; no hay conexión USB directa desde el navegador. |
| CP-MED-0057 | RF-MED-057; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Autolectura del socio desde la app con foto del visor, dentro de una ventana de días configurada por ruta/período, sujeta a validación como cualquier lectura. | Una autolectura sin foto o fuera de ventana se rechaza; dentro de rango puede resolver la tarea de ruta según política. |
| CP-MED-0058 | RF-MED-058; M03 §5.4; PRO-O7-02 | O7 | Estándar | funcional | TEN-001 con Cronograma: 2026-11: R-01 el 05-11-2026, R-02 el 06-11-2026; ventana de autolectura 02 al 04-11-2026. | Avisar al socio la ventana de autolectura y el resultado (aceptada, en revisión, rechazada con motivo). | La notificación se emite por evento y respeta preferencias del socio. |
| CP-MED-0059 | RF-MED-059; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Adjuntar automáticamente las fotos de la lectura al consumo resultante, con metadatos (cuenta, medidor, concepto, fecha-hora, GPS). | Desde el consumo se ven sus fotos sin buscar en otra pantalla. |
| CP-MED-0060 | RF-MED-060; M03 §5.4; PRO-O7-02 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Registrar lecturas de OT (retiro, colocación, verificación, inspección) con origen y OT vinculada. | La lectura de OT se valida igual y queda vinculada a la OT. |
### 1.5 Cálculo, validación y aprobación de consumos (M03 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0061 | RF-MED-061; M03 §5.5; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Calcular el consumo de cada canal entre dos lecturas validadas consecutivas del mismo medidor y registro, aplicando factor, indicado, lectura con factor y vuelta confirmada. | Lectura anterior 1.250 m³ y actual 1.270 m³ con factor 1 dan 20 m³ trazables a ambas lecturas. |
| CP-MED-0062 | RF-MED-062; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Detectar la lectura menor que la anterior y exigir su clasificación explícita: vuelta de medidor, error de captura o cambio de medidor no registrado. | Ninguna vuelta se aplica sin confirmación de un usuario con `med.consumos.aprobar`. |
| CP-MED-0063 | RF-MED-063; RN-TAR-035; M03 §5.5; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Factores de gas: 2026-11 general: presión 1,02, temperatura 0,98, factor calórico 9.300; óptimo 9.300. | Corregir el volumen de gas medido a cantidad facturable con presión, temperatura, factor calórico por período y categoría, coeficiente corrector del servicio y factor calórico óptimo; guardar volumen neto, factores usados y cantidad… | ~~Sin factor para el período se bloquea el consumo con excepción "falta factor de gas".~~ Sin factor para el período, M04 excluye la cuenta con `TAR-E-GAS-FACTOR`; el consumo de M03 queda aprobado con su volumen medido. |
| CP-MED-0064 | RF-MED-064; M03 §5.5; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Validar cada consumo calculado contra reglas configurables: cero en servicio conectado, negativo sin canal de inyección, fuera del rango esperado (promedio móvil, estacionalidad, % por categoría), variación porcentual contra el período… | Cada regla tiene severidad (informativa, revisión, bloqueante) configurable por servicio y categoría. |
| CP-MED-0065 | RF-MED-065; M03 §5.5; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar, derivar a… | Ninguna excepción bloqueante queda sin decisión al cerrar el período; las justificaciones son codificadas (vivienda desocupada, pérdida, estacional, cambio de uso, otra). |
| CP-MED-0066 | RF-MED-066; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Aprobar consumos en forma individual y masiva; aprobar automáticamente los que no tienen excepciones si el parámetro lo permite. | Los consumos aprobados quedan disponibles para M04/M05 con su origen. |
| CP-MED-0067 | RF-MED-067; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Bloquear la liquidación de un servicio con inconsistencias relevantes y informarlo al lote de facturación como "observado" con causa. | M05 recibe la causa y el lote lo muestra; el resto se factura. |
| CP-MED-0068 | RF-MED-068; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Mostrar el origen de cada cantidad liquidada: lecturas usadas (con foto y lecturista), estimación (método y base), división, distribución, ajuste, corrección de gas. | Desde un ítem de factura se navega hasta las lecturas o la estimación que lo originaron. |
| CP-MED-0069 | RF-MED-069; M03 §5.5; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Corregir una lectura o consumo no facturado creando una versión nueva con motivo; la versión anterior queda consultable. | No existe borrado físico de lecturas; la corrección recalcula consumos dependientes. |
| CP-MED-0070 | RF-MED-070; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Impedir modificar o anular un consumo facturado; exigir ajuste (RF-MED-079) que M05 convierte en NC/ND. | El intento devuelve error con el comprobante que lo contiene. |
| CP-MED-0071 | RF-MED-071; M03 §5.5; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Actualizar la categoría asociada a un consumo no facturado cuando la categoría del servicio cambió con fecha efectiva anterior. | Se rechaza si el consumo está facturado. |
| CP-MED-0072 | RF-MED-072; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Consultar los consumos de un servicio: historial por canal (categoría, medidor, fechas y lecturas, días, consumo, período, factura), gráfico, comparación interanual, adjuntos, filtros por fecha y por propiedad; imprimir con o sin gráfico y… | La consulta muestra estimados y reales diferenciados. |
| CP-MED-0073 | RF-MED-073; M03 §5.5; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Detectar servicios conectados sin lectura en el período (medidores sin leer). | El informe lista con 0 a los que no tienen lectura, separado de los leídos con consumo 0. |
### 1.6 Estimaciones y regularización (M03 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0074 | RF-MED-074; M03 §5.6; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Estimar consumos individual o masivamente con método configurable (promedio de los últimos N períodos válidos hasta 12, mismo período del año anterior, promedio de la categoría, consumo mínimo del régimen), con o sin decimales, guardando… | Un servicio sin historia no produce división por cero: usa el siguiente método de la cadena. |
| CP-MED-0075 | RF-MED-075; M03 §5.6; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Exigir motivo y, según parámetro, autorización para cada estimación. | La estimación sin motivo se rechaza; con autorización pendiente no está disponible para liquidar. |
| CP-MED-0076 | RF-MED-076; M03 §5.6; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Estimar dentro del lote de lectura para tareas no leídas, y estimar automáticamente las lecturas con observación que lo indique. | La tarea queda "estimada" con la observación de campo como motivo. |
| CP-MED-0077 | RF-MED-077; M03 §5.6; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Estimar sobre el medidor testigo partiendo de su última lectura. | La estimación del testigo no afecta consumos de los servicios que lo usan hasta su aprobación. |
| CP-MED-0078 | RF-MED-078; M03 §5.6; PRO-O7-03 | O7 | Estándar | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Estimar con propiedad adicional (sumar propiedades) y con opción "agregar días" (fecha estimada = última lectura + 1 mes). | La fecha estimada queda marcada como estimada, no como fecha de lectura real. |
| CP-MED-0079 | RF-MED-079; M03 §5.6; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Regularizar estimaciones al llegar una lectura real: calcular la diferencia entre lo estimado facturado y lo real, y generar un ajuste según la política del servicio (compensación de unidades en la próxima liquidación o refacturación de… | El ajuste muestra períodos estimados, unidades estimadas, unidades reales y diferencia; requiere aprobación. |
| CP-MED-0080 | RF-MED-080; M03 §5.6; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Filtrar la regularización por solo lecturas telemedidas y solo medidor actual. | Los filtros reducen el universo propuesto sin cambiar la fórmula. |
| CP-MED-0081 | RF-MED-081; M03 §5.6; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Limitar la cantidad de estimaciones consecutivas y, al superarla, generar automáticamente una solicitud de inspección o relectura obligatoria. | Al tercer período estimado consecutivo (default) se emite `med.point.inspectionRequested`. |
### 1.7 División, prorrateo, distribución y testigos (M03 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0082 | RF-MED-082; M03 §5.7; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Dividir un consumo que abarca más días que el período en dos o más tramos con los modos: mitades, por días máximos (primer tramo exacto marcado estimado), limitar consumo (descartar el excedente), cambio de medidor (dos medidores en el… | La suma de los tramos es igual al consumo original salvo el modo "limitar", que deja el excedente registrado como no facturable con motivo. |
| CP-MED-0083 | RF-MED-083; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Agrupar consumos de lecturas múltiples del mismo período y canal en un solo consumo liquidable cuando corresponde. | El agrupado conserva la referencia a cada lectura. |
| CP-MED-0084 | RF-MED-084; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. | El preview lista excluidos con su causa (ej. servicio con múltiples medidores). |
| CP-MED-0085 | RF-MED-085; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Distribuir el consumo de un punto padre (medidor general de consorcio o barrio) entre puntos hijos por porcentaje, en partes iguales o combinada con tope por hijo. | Cada hijo recibe un consumo "Redistribución de consumo" y el padre un consumo compensatorio negativo. |
| CP-MED-0086 | RF-MED-086; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Revertir una distribución ejecutada mientras sus consumos no estén facturados. | La reversión anula los consumos de hijos y padre de esa ejecución, identificados por su número de distribución. |
| CP-MED-0087 | RF-MED-087; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Administrar medidores testigo: definición, servicios asociados, exclusión ("no incluir"), lecturas propias y consulta de sus consumos. | El consumo del testigo en un intervalo se entrega a M04 junto con el del servicio. |
| CP-MED-0088 | RF-MED-088; M03 §5.7; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Aplicar el último consumo del testigo a la carga manual de un servicio asociado cuando el operador lo pide. | El consumo así cargado queda con origen "testigo" y es estimado. |
### 1.8 Demanda y transgresiones (M03 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0089 | RF-MED-089; M03 §5.8; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Registrar la demanda contratada por punto y canal de demanda (punta, fuera de punta, valle) con vigencia por período. | Para cada período existe un valor contratado vigente o se usa el último. |
| CP-MED-0090 | RF-MED-090; M03 §5.8; PRO-O7-03 | O7 | Núcleo | funcional | TEN-001 con Telemedición: Sistema DEMO-AMI (genérico REST, sin credenciales reales), mapeo activa T1→`activeImport`. | Registrar la demanda máxima medida por período desde lectura o telemedición. | La demanda se guarda en kW en su canal, nunca en kWh. |
| CP-MED-0091 | RF-MED-091; M03 §5.8; PRO-O7-03 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Detectar transgresiones (demanda registrada > contratada), calcular el % y registrar primera transgresión, demanda declarada y fecha. | % de transgresión = demanda × 100 / contratada − 100. |
| CP-MED-0092 | RF-MED-092; M03 §5.8; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Revisar transgresiones de los últimos 6 períodos (configurable) por fecha de primera o última transgresión, y resetear la demanda declarada a la contratada con aprobación y auditoría. | El reset deja el valor anterior en la auditoría. |
| CP-MED-0093 | RF-MED-093; M03 §5.8; PRO-O7-03 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Emitir aviso al socio y a atención comercial cuando haya transgresión, para gestionar aumento de potencia (M09/M10). | El evento `med.demand.transgressionDetected` llega a M09. |
### 1.9 Energía inyectada y generación distribuida (M03 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0094 | RF-MED-094; M03 §5.9; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Registrar el contrato técnico de generación distribuida: clasificación del usuario-generador, potencia instalada y autorizada, tecnología, equipo/inversor, fecha de conexión, instalador habilitado, régimen y jurisdicción, documentación. | Sin contrato aprobado no se liquida inyección. |
| CP-MED-0095 | RF-MED-095; M03 §5.9; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Exigir medidor bidireccional con canales separados de energía demandada e inyectada (y por franja o potencia cuando corresponda). | No se modela la inyección como factor negativo. |
| CP-MED-0096 | RF-MED-096; M03 §5.9; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Registrar opcionalmente la generación total del equipo (registro del generador). | El canal de generación es informativo; no se liquida. |
| CP-MED-0097 | RF-MED-097; M03 §5.9; PRO-O7-04 | O7 | Núcleo | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Calcular el balance de energía por período: demandada, inyectada, neto, y entregarlo a M04/M05 para la liquidación separada y a M07 para la cuenta de créditos. | El balance se recalcula si cambia una lectura no facturada. Un neto negativo se entrega como tal: M05 lo trata como crédito a futuro según la política del servicio (DEC-036). |
| CP-MED-0098 | RF-MED-098; M03 §5.9; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Vincular el cambio de titular y la baja del contrato de GD con los del suministro. | Al dar de baja el suministro, el contrato GD pasa a "baja" con lectura final de ambos canales. |
| CP-MED-0099 | RF-MED-099; M03 §5.9; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Alertar inyección registrada en un punto sin contrato GD vigente. | Excepción bloqueante para el canal de inyección. |
### 1.10 Medición propia, pérdidas y cambio de clase (M03 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0100 | RF-MED-100; M03 §5.10; PRO-O7-04 | O7 | Estándar | regla | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Registrar puntos de medición propia (compra de energía, frontera, alimentadores, internos) con registros pico, resto, valle, punta, fuera de punta y reactiva, y sus lecturas/consumos por período. | El servicio se indica explícitamente (no se asume energía = servicio 1). |
| CP-MED-0101 | RF-MED-101; M03 §5.10; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13. | Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado… | Las cifras se reconcilian con los consumos facturados del mismo período; con EVT-CMP-16 del período 11/2026 el informe muestra comprado 100.000 kWh, facturado 91.000 kWh y pérdida 9 % (valores ficticios), igual que el balance de M12. |
| CP-MED-0102 | RF-MED-102; M03 §5.10; PRO-O7-04 | O7 | Estándar | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Proponer cambios de clase/categoría por rango de consumo con reglas declarativas y aprobación, sin aplicarlos automáticamente. | La propuesta lista servicios y motivo; M02/M01 aplica el cambio aprobado. |
### 1.11 Telemedición AMI/MDM (M03 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0103 | RF-MED-103; M03 §5.11; PRO-O7-04 | O7 | Núcleo | seguridad | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). | Las credenciales nunca se muestran ni se guardan en texto plano. |
| CP-MED-0104 | RF-MED-104; M03 §5.11; PRO-O7-04 | O7 | Núcleo | regla | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Mapear por sistema, tipo de medidor y categoría qué registros remotos alimentan cada canal (hasta 3 registros por canal con regla "máximo", factor de escala como ÷1000, registro de generador). | Una toma de estado sin mapeo para un canal genera excepción, no un consumo 0. |
| CP-MED-0105 | RF-MED-105; M03 §5.11; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Toma de estado masiva por lote (tareas telemedidas) y puntual por servicio u OT; en puntos multicanal pedir confirmación antes de reemplazar lecturas. | La toma masiva es asíncrona, reanudable y muestra progreso por punto. |
| CP-MED-0106 | RF-MED-106; M03 §5.11; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Importación estándar de lecturas desde AMI/MDM (archivo o API) con origen identificado, sin duplicar lecturas manuales del mismo medidor, registro e instante. | Una lectura repetida del mismo registro e instante se descarta como duplicada informándolo. |
| CP-MED-0107 | RF-MED-107; M03 §5.11; PRO-O7-04 | O7 | Estándar | integración | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Ejecutar operaciones del ciclo del medidor en el sistema remoto: alta, asignación de medidor, retiro, cambio de medidor, cambio de categoría, confirmación de OT, en forma asíncrona tras el hecho en GoodApps. | Si el proveedor falla, la operación queda pendiente con reintentos y no bloquea el cierre de la OT. |
| CP-MED-0108 | RF-MED-108; M03 §5.11; PRO-O7-04 | O7 | Núcleo | integración | TEN-001 con Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW… | Contrato de comandos de corte y reconexión remota: solo a pedido de una orden vigente de M08/M10, con `Idempotency-Key`, resultado confirmado (ejecutado, rechazado, sin respuesta) y evento de resultado. | Un comando repetido con la misma clave no se envía dos veces; sin confirmación el servicio no cambia de estado en M01. |
| CP-MED-0109 | RF-MED-109; M03 §5.11; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Auditar cada llamada a un sistema remoto: operación, medidor, punto, solicitud y respuesta saneadas, duración, resultado y correlación. | La auditoría no contiene secretos y es consultable por punto y por medidor. |
| CP-MED-0110 | RF-MED-110; M03 §5.11; PRO-O7-04 | O7 | Estándar | integración | TEN-001 con Telemedición: Sistema DEMO-AMI (genérico REST, sin credenciales reales), mapeo activa T1→`activeImport`. | Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. | El historial muestra comando, respuesta y usuario/orden de origen. |
| CP-MED-0111 | RF-MED-111; M03 §5.11; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Almacenar curvas de carga (lecturas por intervalo) importadas de AMI/MDM para grandes usuarios y análisis. | Las curvas se guardan en una colección de series temporales separada y no alimentan la liquidación salvo configuración. |
| CP-MED-0112 | RF-MED-112; M03 §5.11; PRO-O7-04 | O7 | Estándar | integración | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Mostrar el estado de cada conector por tenant (activo, degradado, caído, credencial vencida) con la cantidad de operaciones pendientes. | Una caída del conector no marca como erróneos a todos los socios. |
### 1.12 Prepago (M03 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0113 | RF-MED-113; RN-MED-110; M03 §5.12; PRO-O7-04 | O7 | Núcleo | seguridad | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Mantener la cuenta prepaga técnica del punto: sistema prepago, identificador del medidor en el proveedor, modalidad (token/código o carga remota en línea), saldo informado por el proveedor, umbral de saldo bajo. | Un punto prepago no entra en el ciclo pospago de lectura para facturar (RN-MED-110). |
| CP-MED-0114 | RF-MED-114; M03 §5.12; PRO-O7-04 | O7 | Núcleo | funcional | TEN-001 con Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD… | Validar la preventa en el proveedor (medidor habilitado, límite, deuda) antes de que M07 cobre la recarga. | Una preventa rechazada impide el cobro con mensaje del motivo. |
| CP-MED-0115 | RF-MED-115; M03 §5.12; PRO-O7-04 | O7 | Núcleo | seguridad | TEN-001 con Prepago: Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04). | Solicitar el crédito o token al proveedor tras la confirmación del cobro (`cob.payment.confirmed` de la recarga), entregar el token al canal (caja, POS, portal, app) y registrar el estado de la carga. | Un reintento no genera un segundo token; una carga fallida tras cobrar queda en bandeja con opción de reintento o devolución (M07). |
| CP-MED-0116 | RF-MED-116; M03 §5.12; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Consultar el historial de cargas del proveedor y conciliarlo diariamente con las recargas cobradas. | Las diferencias aparecen en un reporte de conciliación con responsable. |
| CP-MED-0117 | RF-MED-117; M03 §5.12; PRO-O7-04 | O7 | Estándar | regla | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Recibir consumos/lecturas de medidores prepagos (cuando el sistema lo permite) para control y para el escalón mensual de la tarifa prepaga (M04). | M04 obtiene el consumo ya facturado en el mes del punto prepago. |
| CP-MED-0118 | RF-MED-118; M03 §5.12; PRO-O7-04 | O7 | Estándar | funcional | TEN-001 con Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas). | Avisar saldo bajo al socio cuando el proveedor informe saldo o cuando la estimación de días restantes caiga bajo el umbral. | El aviso respeta el canal preferido del socio (T09). |
| CP-MED-0119 | RF-MED-119; M03 §5.12; PRO-O7-04 | O7 | Estándar | seguridad | TEN-001 con Prepago: Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04). | Reimprimir/reenviar el comprobante de recarga y el token desde la ficha de consumos. | La reimpresión indica "duplicado" y queda auditada. |
### 1.13 Portal del socio, facturación in situ e informes (M03 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-MED-0120 | RF-MED-120; M03 §5.13; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | "Mis consumos" en la app del socio: historial por servicio y canal, gráfico, comparación interanual, estimados marcados, fotos de la lectura si el tenant lo habilita. | El socio solo ve servicios de cuentas autorizadas. |
| CP-MED-0121 | RF-MED-121; M03 §5.13; PRO-O7-05 | O7 | Estándar | seguridad | TEN-001 con Prepago: Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04). | "Mi prepago" en la app del socio: saldo informado, últimas recargas, tokens, avisos. La compra se hace por M07/M19. | El token se muestra solo al titular o autorizado. |
| CP-MED-0122 | RF-MED-122; M03 §5.13; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Facturación in situ: entregar a M05, en el momento de confirmar la lectura en campo, el consumo aprobado automáticamente cuando el régimen y la cooperativa lo permitan. | Solo para servicios sin excepciones y con aprobación automática habilitada. |
| CP-MED-0123 | RF-MED-123; M03 §5.13; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01… | Informes de consumo: consumos por categoría, agrupados por tramas, control de medidores sin leer, variación porcentual, desvío de días, grandes consumos, consumos con o sin consumo, estimados, medidores indicados, períodos mayores, con… | Cada informe declara fórmula, universo y fecha de corte (sección 15). |
| CP-MED-0124 | RF-MED-124; M03 §5.13; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Tablero de lecturas y consumos: avance de lotes, % leído, % estimado, excepciones abiertas, productividad, telemedición (éxito de toma de estado), prepago (recargas y fallas). | Los totales coinciden con los informes para el mismo corte. |
| CP-MED-0125 | RF-MED-125; M03 §5.13; PRO-O7-05 | O7 | Estándar | regla | TEN-001 con Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa… | Exportar los conjuntos de datos de consumo que M06 necesita para informes a reguladores (por categoría, tramo, período, tipo de fecha: emisión, vencimiento o lectura). | M06 consume el dataset vía servicio; MED no arma la planilla regulatoria. |
| CP-MED-0126 | RF-MED-126; M03 §5.13; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Telemedición: Sistema DEMO-AMI (genérico REST, sin credenciales reales), mapeo activa T1→`activeImport`. | Alertas de patrones de consumo no registrado (caída abrupta sostenida, consumo cero con servicio activo, inversión de giro, manipulación detectada por telemedición, precinto violado) que M10 convierte en inspección. | La alerta nunca genera recupero ni multa; solo `med.point.suspicionRaised`. |
| CP-MED-0127 | RF-MED-127; M03 §5.13; PRO-O7-05 | O7 | Estándar | regla | TEN-001 con Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error. | Exponer a M10 el historial de consumos y lecturas de un punto para el cálculo del recupero según método aprobado. | API de historial con períodos, canales y origen. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-MED-5001 — ESC-MED-01. Instalar un medidor ya instalado en otro punto**

- Cubre: ESC-MED-01; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalar un medidor ya instalado en otro punto
- Entonces 409 con código `med.meter.alreadyInstalled`; sin cambios.

**CP-MED-5002 — ESC-MED-02. Instalar en el mismo punto y canal con instalación activa superpuesta**

- Cubre: ESC-MED-02; RN-MED-018; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Instalar en el mismo punto y canal con instalación activa superpuesta
- Entonces Rechazo (RN-MED-018).

**CP-MED-5003 — ESC-MED-03. Lectura con fecha igual a la última validada**

- Cubre: ESC-MED-03; RN-MED-047; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lectura con fecha igual a la última validada
- Entonces Rechazo (RN-MED-047).

**CP-MED-5004 — ESC-MED-04. Lectura con más dígitos que el medidor**

- Cubre: ESC-MED-04; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lectura con más dígitos que el medidor
- Entonces Rechazo/advertencia según PRM-MED-027.

**CP-MED-5005 — ESC-MED-05. Lectura menor que la anterior**

- Cubre: ESC-MED-05; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lectura menor que la anterior
- Entonces Excepción bloqueante "lectura menor"; sin consumo enorme automático.

**CP-MED-5006 — ESC-MED-06. Medidor inaccesible**

- Cubre: ESC-MED-06; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Medidor inaccesible
- Entonces Tarea "no leído" con motivo; ningún consumo real 0.

**CP-MED-5007 — ESC-MED-07. Doble envío de la misma mutación offline**

- Cubre: ESC-MED-07; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Doble envío de la misma mutación offline
- Entonces Un solo registro; respuesta `duplicate` en el segundo.

**CP-MED-5008 — ESC-MED-08. Sincronizar tarea reasignada**

- Cubre: ESC-MED-08; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Sincronizar tarea reasignada
- Entonces Conflicto con ambas evidencias; nada sobrescrito.

**CP-MED-5009 — ESC-MED-09. Confirmar lote dos veces en paralelo**

- Cubre: ESC-MED-09; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Confirmar lote dos veces en paralelo
- Entonces Uno procesa; el otro recibe 409; resultado idéntico al de una sola ejecución.

**CP-MED-5010 — ESC-MED-10. Confirmar lectura con medidor cambiado desde la generación**

- Cubre: ESC-MED-10; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Confirmar lectura con medidor cambiado desde la generación
- Entonces Registro rechazado con causa.

**CP-MED-5011 — ESC-MED-11. Punto en dos lotes abiertos del período**

- Cubre: ESC-MED-11; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Punto en dos lotes abiertos del período
- Entonces Rechazo al generar el segundo; informa lote existente.

**CP-MED-5012 — ESC-MED-12. Estimar servicio sin historia**

- Cubre: ESC-MED-12; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Estimar servicio sin historia
- Entonces Usa la cadena de respaldo; nunca divide por cero; si nada aplica, excepción "no estimable".

**CP-MED-5013 — ESC-MED-13. Modificar consumo facturado**

- Cubre: ESC-MED-13; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Modificar consumo facturado
- Entonces 409 con referencia al comprobante; solo ajuste.

**CP-MED-5014 — ESC-MED-14. Distribución con suma de porcentajes ≠ 100**

- Cubre: ESC-MED-14; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Distribución con suma de porcentajes ≠ 100
- Entonces Rechazo de configuración.

**CP-MED-5015 — ESC-MED-15. Hijo en dos distribuciones**

- Cubre: ESC-MED-15; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Hijo en dos distribuciones
- Entonces Rechazo.

**CP-MED-5016 — ESC-MED-16. Distribución combinada con padre sobre tope**

- Cubre: ESC-MED-16; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW solar), SUM-ELE-PP-01 (prepago), SUM-GAS-001, CONS-PADRE-01 con 4 hijos.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Distribución combinada con padre sobre tope
- Entonces Excepción; no se distribuye en silencio.

**CP-MED-5017 — ESC-MED-17. Gas sin factor del período**

- Cubre: ESC-MED-17; RN-TAR-035; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Gas sin factor del período
- Entonces ~~Consumo bloqueado "falta factor de gas".~~ Reemplazado por RN-TAR-035 (DEC-085): el consumo queda aprobado con su volumen medido; M04 excluye la cuenta con `TAR-E-GAS-FACTOR`.

**CP-MED-5018 — ESC-MED-18. Inyección sin contrato GD**

- Cubre: ESC-MED-18; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW solar), SUM-ELE-PP-01 (prepago), SUM-GAS-001, CONS-PADRE-01 con 4 hijos.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Inyección sin contrato GD
- Entonces Excepción bloqueante sobre el canal de inyección.

**CP-MED-5019 — ESC-MED-19. Comando de corte sin orden de origen**

- Cubre: ESC-MED-19; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comando de corte sin orden de origen
- Entonces 403/422; no se envía.

**CP-MED-5020 — ESC-MED-20. Comando de corte repetido con la misma `Idempotency-Key`**

- Cubre: ESC-MED-20; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Comando de corte repetido con la misma `Idempotency-Key`
- Entonces Un solo envío al proveedor; misma respuesta.

**CP-MED-5021 — ESC-MED-21. Proveedor caído durante cierre de OT**

- Cubre: ESC-MED-21; relacionados: ESC-SRV-ELE-07; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Proveedor caído durante cierre de OT
- Entonces Con PRM-CAT-041 = `true` (default) la OT no cierra y queda la operación remota pendiente con reintentos, como en ESC-SRV-ELE-07; con `false`, la OT cierra y la operación sigue pendiente (antes "OT cerrada; operación remota pendiente con reintentos", sin distinguir el parámetro); salud del conector "down"; socios no marcados con error.

**CP-MED-5022 — ESC-MED-22. Recarga cobrada con proveedor fallando**

- Cubre: ESC-MED-22; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Prepago: Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recarga cobrada con proveedor fallando
- Entonces Recarga en bandeja; reintento sin segundo token; devolución opcional por M07.

**CP-MED-5023 — ESC-MED-23. Lecturista intenta ver tareas de otro**

- Cubre: ESC-MED-23; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lecturista intenta ver tareas de otro
- Entonces 403 (alcance propios).

**CP-MED-5024 — ESC-MED-24. Usuario del tenant A consulta lecturas del tenant B**

- Cubre: ESC-MED-24; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario del tenant A consulta lecturas del tenant B
- Entonces 404; ninguna consulta sin `tenantId` (plugin).

**CP-MED-5025 — ESC-MED-25. Socio consulta consumos de un servicio no autorizado**

- Cubre: ESC-MED-25; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Socio consulta consumos de un servicio no autorizado
- Entonces 403.

**CP-MED-5026 — ESC-MED-26. Operador sin `med.consumos.aprobar` intenta aprobar**

- Cubre: ESC-MED-26; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Operador sin `med.consumos.aprobar` intenta aprobar
- Entonces 403.

**CP-MED-5027 — ESC-MED-27. Quien creó un ajuste intenta aprobarlo con doble control activo**

- Cubre: ESC-MED-27; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Quien creó un ajuste intenta aprobarlo con doble control activo
- Entonces 403 (T11).

**CP-MED-5028 — ESC-MED-28. Lectura de telemedición duplicada de lectura manual**

- Cubre: ESC-MED-28; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Telemedición: Sistema DEMO-AMI (genérico REST, sin credenciales reales), mapeo activa T1→`activeImport`.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Lectura de telemedición duplicada de lectura manual
- Entonces Una queda `redundant` según prioridad; un solo consumo.

**CP-MED-5029 — ESC-MED-29. Consumo en servicio desconectado**

- Cubre: ESC-MED-29; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Consumo en servicio desconectado
- Entonces Excepción bloqueante por defecto.

**CP-MED-5030 — ESC-MED-30. División con lectura de 45 días en período de 30 (modo días máximos)**

- Cubre: ESC-MED-30; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando División con lectura de 45 días en período de 30 (modo días máximos)
- Entonces Tramo 1 = 30 días estimado; tramo 2 = 15 días; suma = original.

**CP-MED-5031 — ESC-MED-31. Período con fin de mes, año bisiesto y zona horaria**

- Cubre: ESC-MED-31; RN-MED-071; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Puntos: SUM-AG-001 (agua, ruta R-01, zona 30, sector 1, recorrido 250), SUM-ELE-001, SUM-ELE-GC-01 (50 kW contratados), SUM-ELE-GD-01 (contrato GD 5 kW solar), SUM-ELE-PP-01 (prepago), SUM-GAS-001, CONS-PADRE-01 con 4 hijos.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Período con fin de mes, año bisiesto y zona horaria
- Entonces Días calculados según RN-MED-071, reproducibles independientemente del horario del servidor.

**CP-MED-5032 — ESC-MED-32. Reapertura de lote con consumos facturados**

- Cubre: ESC-MED-32; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reapertura de lote con consumos facturados
- Entonces Solo se reabren los no facturados.

**CP-MED-5033 — ESC-MED-33. Conciliación: lecturas validadas = consumos calculados + no leídos + rechazadas por lote**

- Cubre: ESC-MED-33; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación: lecturas validadas = consumos calculados + no leídos + rechazadas por lote
- Entonces Cuadra; el acta lo muestra.

**CP-MED-5034 — ESC-MED-34. Conciliación con M05: consumos `approved` del período = consumos facturados + observados + excluidos con causa**

- Cubre: ESC-MED-34; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conciliación con M05: consumos `approved` del período = consumos facturados + observados + excluidos con causa
- Entonces Cuadra (AGR-015).

**CP-MED-5035 — ESC-MED-35. Autolectura fuera de ventana o sin foto**

- Cubre: ESC-MED-35; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Cronograma: 2026-11: R-01 el 05-11-2026, R-02 el 06-11-2026; ventana de autolectura 02 al 04-11-2026.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Autolectura fuera de ventana o sin foto
- Entonces Rechazo con motivo.

**CP-MED-5036 — ESC-MED-36. Cambio de régimen AG a medido (HUE-AG-03)**

- Cubre: ESC-MED-36; RF-MED-128; M03 §17
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de régimen AG a medido (HUE-AG-03)
- Entonces EVT-CAT-28 `unmetered` → `metered` con fecha 01/12/2026 crea el punto y la orden de instalación; reenviar el evento no duplica; sin medidor instalado no hay consumo medido (RF-MED-128).

**CP-MED-5037 — ESC-MED-37. Volumen comprado para control de factura del mayorista (HUE-ELE-01, HUE-GAS-04)**

- Cubre: ESC-MED-37; RF-MED-129; M03 §17
- Ola: O8 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O8 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Volumen comprado para control de factura del mayorista (HUE-ELE-01, HUE-GAS-04)
- Entonces API-MED-78 del período 11/2026 devuelve por punto de frontera los kWh por franja y kW de demanda del informe de pérdidas, con estado de validación (RF-MED-129).

## 3. Casos por caso de uso (CU)

**CP-MED-8001 — CU-07. Reemplazo de medidor (BASE §7, original)**

- Cubre: CU-07; RF-MED-016; RN-MED-001; M03 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado actor: Encargado técnico (o cierre de OT de M10). - Situación inicial: una orden autoriza reemplazar el medidor de SUM-AG-001; MED-002 está disponible. - Desarrollo: 1) registrar retiro de MED-001 con lectura final 1.270 m³; 2) instalar MED-002 con lectura inicial 0 m³ y fecha efectiva; 3) conservar ambas instalaciones y enviar los registros a control de consumos. -, autenticado en TEN-001 con las capabilities de su…
- Cuando -
- Entonces Trayectoria de los dos equipos conservada y sin superposición; MED-002 pasa de "disponible" a "instalado"; el consumo del período suma el tramo de MED-001 (hasta el retiro) y el de MED-002. - Excepción: si MED-002 ya está instalado en otro suministro, se rechaza la asignación (RN-MED-001) hasta resolver la inconsistencia. - Requisitos: RF-MED-016 a 020; RN-MED-001, 015, 018, 094.

**CP-MED-8002 — CU-08. Lectura en campo sin conexión (BASE §8, original)**

- Cubre: CU-08; RF-MED-043; RN-MED-047, RN-MED-052; M03 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado actor: Lecturista. - Situación inicial: ruta R-01 descargada; MED-001 asociado a SUM-AG-001; lectura anterior 1.250 m³. - Desarrollo: 1) abrir la tarea y verificar suministro y equipo; 2) registrar 1.270 m³, fotografía y observación; guardar localmente sin conexión; 3) sincronizar y confirmar la recepción sin duplicar. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando -
- Entonces Lectura capturada pendiente de validación con operador, momento, GPS y evidencia. - Excepción: si el medidor es inaccesible, se registra el motivo; nunca cero (RN-MED-052). - Requisitos: RF-MED-043 a 048; RN-MED-047 a 054, 125.

**CP-MED-8003 — CU-09. Validación y aprobación de consumo (BASE §9, original)**

- Cubre: CU-09; RN-MED-076; M03 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Lecturas: SUM-AG-001: 1.250 m³ (2026-10), 1.270 m³ (2026-11), estado 12.700 m³ capturado como ejemplo de error.
- Dado actor: Supervisor de consumos. - Situación inicial: lecturas validadas 1.250 m³ y 1.270 m³ del mismo equipo y período. - Desarrollo: 1) calcular 20 m³; 2) revisar continuidad del equipo, fechas y alertas; 3) aprobar para el ciclo 2026-11. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando -
- Entonces Consumo validado de 20 m³ trazable a ambas lecturas, origen "lecturas reales". - Excepción: si aparece 12.700 m³ como estado capturado, la regla de rango crea excepción bloqueante y el caso queda en revisión (RN-MED-076, 078).

**CP-MED-8004 — CU-ESP-ELE. Suministro eléctrico (BASE §87, parte de medición)**

- Cubre: CU-ESP-ELE; RF-MED-013; M03 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Suministro eléctrico (BASE §87, parte de medición)
- Entonces - Definición: el CU-ESP-ELE se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición. Tras la factibilidad (M10), se instala el medidor autorizado y se confirma fecha y lectura inicial; el ciclo toma lecturas de energía (kWh) y, si corresponde, demanda (kW), franjas y reactiva en canales distintos; valida y entrega a M04. Controles: no equiparar kWh con kW (RF-MED-013); estimación solo autorizada.

**CP-MED-8005 — CU-ESP-AG. Agua medida y no medida (BASE §88, parte de medición)**

- Cubre: CU-ESP-AG; RN-MED-027, RN-MED-078; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Agua medida y no medida (BASE §88, parte de medición)
- Entonces - Definición: el CU-ESP-AG se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición. Un cliente de régimen medido con lectura observada queda pendiente hasta validar cantidad real o estimación permitida (RN-MED-078). Un cliente de régimen no medido no tiene punto de medición ni se le exige medidor ficticio (RN-MED-027).

**CP-MED-8006 — CU-ESP-GAS. Gas por red (BASE §89, parte de medición)**

- Cubre: CU-ESP-GAS; RF-MED-063; M03 §16
- Ola: O7 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Factores de gas: 2026-11 general: presión 1,02, temperatura 0,98, factor calórico 9.300; óptimo 9.300.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Gas por red (BASE §89, parte de medición)
- Entonces - Definición: el CU-ESP-GAS se define en M02 §16 (anexo dueño); aquí se detalla solo la parte de medición y se cita esa definición. Tras la habilitación técnica (M10) se coloca/activa el medidor y se registra el inicio; el ciclo conserva volumen leído, factores de corrección (presión, temperatura, factor calórico, coeficiente) y cantidad resultante versionados (RF-MED-063).

**CP-MED-8007 — CU-MER-01. Usuario-generador (MER-001, original)**

- Cubre: CU-MER-01; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Usuario-generador (MER-001, original)
- Entonces Un asociado con paneles solares demanda 300 kWh e inyecta 120 kWh en el mes. MED registra ambos canales del medidor bidireccional, calcula el balance (300 / 120 / neto 180) y lo entrega; M04 valoriza cada uno con su tarifa, M05 liquida en el mismo comprobante y M07 lleva el crédito si el valor inyectado supera lo que paga. Valores ficticios.

**CP-MED-8008 — CU-MED-01. Generar, asignar y confirmar una ruta**

- Cubre: CU-MED-01; RN-MED-035; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Generar, asignar y confirmar una ruta
- Entonces Supervisor genera el lote de R-01 para 2026-11 desde el cronograma; asigna 2 lecturistas por rango de secuencia; los lecturistas descargan; al recibir todo, el supervisor filtra "solo fuera de rango", revisa 3 casos y confirma; 1 tarea queda rechazada porque el medidor cambió desde la generación (RN-MED-035) y se relee con la nueva instalación. Cierre con acta.

**CP-MED-8009 — CU-MED-02. Importación desde colectora de terceros**

- Cubre: CU-MED-02; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Importación desde colectora de terceros
- Entonces Operador sube un archivo con formato de perfil "Rainbow" (columnas 3 y 7); el preview muestra 2 filas sin emparejar (número de medidor no encontrado tras relleno a 10 dígitos) y 1 duplicada con lectura de app; confirma las válidas; continúan por confirmación de lote.

**CP-MED-8010 — CU-MED-03. Medidor inaccesible dos períodos seguidos**

- Cubre: CU-MED-03; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Medidor inaccesible dos períodos seguidos
- Entonces El lecturista registra "domicilio cerrado"; el job estima con promedio de 6 períodos; al período siguiente se repite; al superar el tope (PRM-MED-108 = 2) se emite `med.point.inspectionRequested` y M10 crea una OT de relectura con aviso al socio.

**CP-MED-8011 — CU-MED-04. Regularización de estimados**

- Cubre: CU-MED-04; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Observaciones: Inaccesible (bloquea lectura), Medidor roto (pide OT de cambio), Perro (estimar), Visor ilegible (foto obligatoria), Posible conexión directa (sospecha).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Regularización de estimados
- Entonces Dos períodos estimados de 15 m³ cada uno; la lectura real del tercer período muestra un acumulado que implica 10 m³/mes; el job propone compensar 10 m³ (2 × 15 − 2 × 10) en la próxima liquidación; el supervisor aprueba; M04 aplica "Compensación de 10 m³".

**CP-MED-8012 — CU-MED-05. Vuelta de medidor**

- Cubre: CU-MED-05; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Vuelta de medidor
- Entonces Medidor de 5 dígitos con lectura anterior 99.950 y actual 00.030; se crea excepción "lectura menor"; el analista verifica la foto, confirma vuelta; consumo = (99.999 − 99.950 + 1 + 30) × 1 = 80 unidades.

**CP-MED-8013 — CU-MED-06. Distribución en consorcio**

- Cubre: CU-MED-06; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Distribución en consorcio
- Entonces Medidor general de un consorcio con 4 departamentos en modo "igualada": consumo del padre 101 m³; cada hijo recibe 25,25 m³ salvo el último que absorbe el redondeo; el padre recibe −101 m³ compensatorio; un error de configuración se revierte por `runId` antes de facturar.

**CP-MED-8014 — CU-MED-07. Transgresión de demanda**

- Cubre: CU-MED-07; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Transgresión de demanda
- Entonces Gran usuario con 50 kW contratados registra 62 kW en punta: % = 62 × 100 / 50 − 100 = 24 %; se registra primera transgresión y demanda declarada 62 kW; aviso a atención comercial para aumento de potencia; meses después, con aprobación, se resetea la declarada a 50 kW.

**CP-MED-8015 — CU-MED-08. Toma de estado por telemedición y corte remoto**

- Cubre: CU-MED-08; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Medidores: MED-001 (AGUA-4D, retirado), MED-002 (AGUA-4D, instalado en SUM-AG-001), MED-E-100 (MONO-5D, instalado en SUM-ELE-001), MED-GC-01 (TRI-GC), MED-GD-01 (BIDIR-GD), MED-PP-01 (PREPAGO-TK), MED-G-01 (GAS-5D), MED-T-01…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Toma de estado por telemedición y corte remoto
- Entonces El job de toma de estado consulta 300 medidores de un sistema AMI; 295 responden; 5 quedan con excepción y van a ruta de campo. Días después, M08 ordena un corte por mora: MED envía el comando con `Idempotency-Key`, el proveedor confirma, se emite `med.remoteOperation.succeeded` y M01 cambia el estado del servicio con la fecha confirmada. Un reintento por timeout no genera un segundo corte.

**CP-MED-8016 — CU-MED-09. Recarga prepaga con token**

- Cubre: CU-MED-09; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: seguridad
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M03 §18.
- Datos de prueba: Prepago: Sistema DEMO-TOKEN; recarga ARS 10.000 → 80 kWh (tarifa ficticia de M04).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Recarga prepaga con token
- Entonces Un socio recarga ARS 10.000 en la app: preventa OK; M07 confirma el pago; MED solicita el token; el proveedor no responde (timeout); estado `unknown`, se consulta el estado y se obtiene el token emitido; se entrega por la app y por correo; la conciliación nocturna lo empareja.

**CP-MED-8017 — CU-MED-10. Autolectura del socio**

- Cubre: CU-MED-10; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Cronograma: 2026-11: R-01 el 05-11-2026, R-02 el 06-11-2026; ventana de autolectura 02 al 04-11-2026.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Autolectura del socio
- Entonces Con ventana abierta, el socio envía estado y foto; la lectura queda en rango y se acepta; con política `ifInRange`, la tarea de ruta se marca "resuelta por autolectura" y el lecturista no la visita; al tercer período se exige lectura de campo (PRM-MED-055).

**CP-MED-8018 — CU-MED-11. Conflicto offline**

- Cubre: CU-MED-11; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Marcas: MARCA-DEMO-E (electricidad), MARCA-DEMO-A (agua), MARCA-DEMO-G (gas).
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conflicto offline
- Entonces Un lecturista captura sin red una tarea que el supervisor reasignó; al sincronizar, el servidor acepta la lectura, marca conflicto y lo muestra en PAN-MED-34 con ambas evidencias; el supervisor acepta la lectura del dispositivo y cancela la tarea del otro lecturista.

**CP-MED-8019 — CU-MED-12. Corrección de gas**

- Cubre: CU-MED-12; RN-TAR-035; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Factores de gas: 2026-11 general: presión 1,02, temperatura 0,98, factor calórico 9.300; óptimo 9.300.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Volumen leído 100 m³; factor del período: presión 1,02, temperatura 0,98, factor calórico 9.300; coeficiente 1; óptimo 9.300; volumen corregido = red4(100 × 1,02 × 0,98) = 99,96; cantidad = 99,96 × 9.300 × 1 / 9.300 = 99,96
- Entonces redondeo a 0 decimales = 100. Se guardan neto, factores y resultado. Valores ficticios. > Reemplazado por RN-TAR-035 (DEC-085): este cálculo lo ejecuta M04 al liquidar. M03 solo valida la lectura y entrega a M04 el volumen medido (100 m³) y `meteringPoints.gasCorrectionCoefficient` (1); el ejemplo numérico se conserva como caso de prueba de M04.

**CP-MED-8020 — CU-MED-13. Medición propia y pérdidas**

- Cubre: CU-MED-13; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: regla
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Medición propia: Punto COMPRA-EPEC-01 con lecturas del CU-MED-13.
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Medición propia y pérdidas
- Entonces El responsable carga la lectura del medidor de compra: pico 40.000, resto 50.000, valle 30.000 kWh, reactiva 36.000 kVArh; compra activa 120.000 kWh; cos φ = cos(atan(0,3)) ≈ 0,958; facturado del período 104.400 kWh; pérdida 15.600 kWh = 13 %.

**CP-MED-8021 — CU-MED-14. Cambio de medidor desde OT de M10 con medidor telemedido**

- Cubre: CU-MED-14; M03 §16
- Ola: O7 · Prioridad: Estándar · Tipo: integración
- Precondiciones: ola O7 desplegada; tenant ficticio TEN-001; semillas de M03 §18.
- Datos de prueba: Tipos de medidor: MONO-5D (monofásico, 5 dígitos, factor 1); TRI-GC (trifásico multitarifa: activa T1/T2/T3, reactiva, demanda máx.; factor 40); BIDIR-GD (bidireccional activa import/export); AGUA-4D (4 dígitos, m³); GAS-5D (5 dígitos…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Cambio de medidor desde OT de M10 con medidor telemedido
- Entonces El técnico cierra la OT offline; al sincronizar, M10 publica el cierre; MED ejecuta retiro/instalación, encola `replaceMeter` en el sistema remoto, que falla dos veces y queda en bandeja técnica; la OT ya está cerrada y el consumo del período se calcula con ambos tramos.
