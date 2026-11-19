# Casos de prueba de aceptación — M01 PER — Personas, titulares, asociados, cuentas, inmuebles y domicilios

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`M01-PER-personas-titulares-cuentas.md`](../../especificacion/anexos/M01-PER-personas-titulares-cuentas.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 173 CP de requisitos funcionales, 42 CP de escenarios ESC y 18 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del M01 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Personas (M01 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0001 | RF-PER-001; M01 §5.1; PRO-O2-03 | O2 | Núcleo | seguridad | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Registrar personas físicas y jurídicas con datos identificatorios, fiscales y de contacto. | Se crean una persona física y una jurídica; los obligatorios dependen del tipo; el `tenantId` sale del token. |
| CP-PER-0002 | RF-PER-002; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Buscar coincidencias antes de crear una persona (documento, CUIT/CUIL, nombre aproximado, fecha de nacimiento, contacto, domicilio). | El alta muestra candidatos con puntaje; si hay candidatos de puntaje alto, crear exige declarar "no es la misma persona" con motivo. |
| CP-PER-0003 | RF-PER-003; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Una persona por tenant reutilizable para todos sus roles, servicios, cuentas e inmuebles. | Contratar un segundo servicio en otro inmueble reutiliza la misma persona; la ficha muestra ambos. |
| CP-PER-0004 | RF-PER-004; M01 §5.1; PRO-O2-03 | O2 | Núcleo | regla | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Datos de persona física: apellidos, nombres, sexo registral, fecha de nacimiento, estado civil (`EST_CIVIL`), ocupación (`OCUPACIO`), nacionalidad (`PAISES`), fecha de fallecimiento. | Los catálogos son del tenant (T04); la edad se calcula a la fecha consultada. |
| CP-PER-0005 | RF-PER-005; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Datos de persona jurídica: razón social, nombre de fantasía, tipo de organización (sociedad, cooperativa, asociación, municipio, organismo público, otro), fecha de constitución, representantes vía relaciones. | Una municipalidad ficticia con varias cuentas actúa solo por representantes vigentes. |
| CP-PER-0006 | RF-PER-006; M01 §5.1; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Datos laborales de la persona: lugar de trabajo, domicilio y teléfono laboral, fecha y usuario de control. | Se cargan como conjunto de campos extra precargado "Datos laborales". |
| CP-PER-0007 | RF-PER-007; M01 §5.1; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Datos extra configurables y tipados por entidad (persona, titular, cuenta, inmueble, punto de prestación) que reemplazan las tablas `*_EXTRAS`. | El administrador define un campo fecha obligatorio; el alta lo valida; el campo es filtrable y exportable. |
| CP-PER-0008 | RF-PER-008; M01 §5.1; PRO-O2-03 | O2 | Núcleo | regla | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Asociar documentación a la persona y controlar su vencimiento. | Un documento con vencimiento aparece en "por vencer" N días antes y en "vencido" después. |
| CP-PER-0009 | RF-PER-009; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Registrar el fallecimiento con fecha, evidencia, efectos sobre adhesiones y beneficios y tareas pendientes. | Se registra la fecha; se dan de baja adhesiones y beneficios de la persona; se crean tareas de baja del titular, transferencia y cambio de garante en M09; no se corta ningún servicio. |
| CP-PER-0010 | RF-PER-010; M01 §5.1; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Revertir un fallecimiento registrado por error, con aprobación y reversión documentada de sus efectos. | La reversión reactiva las adhesiones dadas de baja por ese evento y deja ambos hechos en la historia. |
| CP-PER-0011 | RF-PER-011; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Estados de la persona: activa, fallecida, fusionada, archivada (anonimizada). | Una persona fusionada no admite operaciones y redirige a la persona que la absorbió. |
| CP-PER-0012 | RF-PER-012; M01 §5.1; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Política "exigir fecha de nacimiento o fecha de alta" en personas. | Con la política activa el alta sin ambas fechas se rechaza con error en línea. |
| CP-PER-0013 | RF-PER-013; M01 §5.1; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Captura asistida del DNI por lector de código de barras o cámara, con separador configurable. | Leer el código del DNI completa apellido, nombres, sexo, número y nacimiento, que el operador confirma. |
| CP-PER-0014 | RF-PER-014; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-H-A / PER-H-B: Personas Hermano A y Hermano B, DNI-A y DNI-B (marcadores) CU-TIT-01, ESC-01 | Datos sensibles (electrodependencia, datos de salud, aptitud de donante) en una colección restringida con permiso propio. | Sin `per.personas.datosSensibles.ver` (antes `per.personas.verSensibles`) la API no devuelve esos datos ni aparecen en exportaciones ni BI. |
| CP-PER-0015 | RF-PER-015; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Mostrar en la ficha los roles de la persona en el tenant: titular, asociado, cliente no asociado, solicitante, adherente, beneficiario, garante, representante, autorizado, propietario, ocupante, profesional, empleado, proveedor. | Una persona garante de otra cuenta y titular de la suya muestra los dos roles con enlaces. |
| CP-PER-0016 | RF-PER-016; M01 §5.1; PRO-O3-04 | O3 | Estándar | regla | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Registrar profesionales (instaladores matriculados) como rol de persona con matrícula, certificado y vencimiento, para que M02/M10 los asignen. | Un profesional con matrícula vencida no se puede asignar a un contrato nuevo. |
| CP-PER-0017 | RF-PER-017; M01 §5.1; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Administración de personas separada de titulares: alta, edición y consulta de personas que no son titulares. | Se puede crear un garante que no es titular. |
### 1.2 Identificación y verificación fiscal (M01 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0018 | RF-PER-018; M01 §5.2; PRO-O2-03 | O2 | Núcleo | integración | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Varias identificaciones por persona (DNI, CUIT, CUIL, CDI, LE, LC, pasaporte, cédula extranjera, otro), una principal, según catálogo de tipos con códigos ARCA, INAES, ENARGAS y SENASA. | Una persona humana tiene DNI principal y CUIL relacionado; el tipo DNI tiene código ARCA 96, CUIL 86 y CUIT 80. |
| CP-PER-0019 | RF-PER-019; M01 §5.2; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Validar formato y dígito verificador de CUIT/CUIL en el momento de la carga. | Un CUIT con dígito incorrecto muestra error en línea; uno correcto queda en estado "dígito válido". |
| CP-PER-0020 | RF-PER-020; M01 §5.2; PRO-O4-04 | O4 | Estándar | integración | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Verificar la CUIT/CUIL contra el padrón de ARCA, guardar la constancia (denominación, estado de la clave, condición frente al IVA, domicilio fiscal, actividades) y el resultado. | Con el servicio disponible se guarda la constancia; si no responde, queda "pendiente de verificación" y el job reintenta. |
| CP-PER-0021 | RF-PER-021; M01 §5.2; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Relacionar DNI y CUIT/CUIL de la misma persona solo cuando la relación está verificada. | Un CUIT cuyo número de documento interno no coincide con el DNI queda como discrepancia y no se relaciona. |
| CP-PER-0022 | RF-PER-022; M01 §5.2; PRO-O2-03 | O2 | Estándar | regla | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Proponer el CUIL calculado a partir de DNI y sexo como identificación "no verificada", sin usarlo fiscalmente hasta verificarlo. | El CUIL propuesto aparece con marca "calculado, sin verificar" y la emisión que exige CUIT no lo acepta. |
| CP-PER-0023 | RF-PER-023; M01 §5.2; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Alertar al confirmar la ficha si la CUIT de la persona no es correcta. | Con la política activa, guardar una ficha con CUIT inválida muestra advertencia o error según el nivel configurado. |
| CP-PER-0024 | RF-PER-024; M01 §5.2; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Exigir CUIT cuando la condición IVA de la cuenta lo requiere, en el momento de habilitar la contratación o la emisión, no en el registro. | Una cuenta Responsable Inscripto sin CUIT verificada no puede activar contratos; un usuario registrado sin CUIT sí puede iniciar solicitudes. |
| CP-PER-0025 | RF-PER-025; M01 §5.2; PRO-O2-03 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Unicidad de identificación (tipo + número) por tenant, con excepciones por política registradas y aprobadas. | Crear una segunda persona con el mismo DNI se rechaza salvo excepción aprobada con motivo. |
| CP-PER-0026 | RF-PER-026; M01 §5.2; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Excepción de identificación (persona sin DNI ni CUIT en supuestos definidos) con documento alternativo, aprobación y sin inventar números. | Un extranjero con pasaporte se registra con pasaporte; el sistema nunca genera un DNI ficticio. |
| CP-PER-0027 | RF-PER-027; M01 §5.2; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Tipo de documento por defecto para personas físicas y jurídicas configurable. | Al elegir persona jurídica el tipo propuesto es CUIT. |
| CP-PER-0028 | RF-PER-028; M01 §5.2; PRO-O2-03 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Historial de verificaciones de cada identificación (fuente, fecha, actor, resultado, evidencia). | La ficha muestra todas las verificaciones con su resultado y quién las hizo. |
| CP-PER-0029 | RF-PER-029; M01 §5.2; PRO-O4-04 | O4 | Estándar | integración | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Revalidación periódica configurable de la condición fiscal contra el padrón de ARCA, con informe de diferencias. | El job mensual lista las cuentas cuya condición IVA difiere de la constancia vigente sin cambiarla automáticamente. |
### 1.3 Contactos, preferencias y consentimientos (M01 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0030 | RF-PER-030; M01 §5.3; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Varios contactos tipados por persona (correo, celular, fijo, WhatsApp, fax), con principal, etiqueta, fuente (backoffice, portal, importación, legado web) y estado de verificación. | Un celular cargado por el socio en el portal queda con fuente "portal" y no pisa el del backoffice. |
| CP-PER-0031 | RF-PER-031; M01 §5.3; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Verificar correo y celular por código de un solo uso cuando lo exija la política o la vía de ingreso. | Si la vía "Portal" exige validar celular, el contacto queda "verificado" solo tras ingresar el código. |
| CP-PER-0032 | RF-PER-032; M01 §5.3; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Política de contactos con niveles no controlar / advertir / exigir, en el alta o siempre, para celular y correo, en personas y cuentas. | Con "exigir correo siempre", modificar una cuenta sin correo se rechaza; con "advertir" se pide confirmación. |
| CP-PER-0033 | RF-PER-033; M01 §5.3; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Normalizar teléfonos a formato E.164 y mostrarlos según formato local; opción de solo dígitos. | "0351 15-555-0000" se guarda normalizado y se muestra formateado. |
| CP-PER-0034 | RF-PER-034; M01 §5.3; PRO-O2-04 | O2 | Estándar | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Regla de selección del destino de avisos por canal (prioridad portal/titular/ambos, uso del celular de la cuenta para facturas por WhatsApp), entregada a T09. | Con prioridad "portal primero", T09 recibe el celular verificado del portal; si no existe, el de la cuenta. |
| CP-PER-0035 | RF-PER-035; M01 §5.3; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Contactos propios de la cuenta (correo y celular para facturas y avisos de esa cuenta), distintos de los de la persona. | Dos cuentas del mismo titular envían la factura a correos distintos. |
| CP-PER-0036 | RF-PER-036; M01 §5.3; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Conservar los contactos cargados desde el portal sin sobrescribirlos con los del backoffice, y viceversa, según política. | Con la política activa, editar el correo de backoffice no borra el correo del portal. |
| CP-PER-0037 | RF-PER-037; M01 §5.3; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Preferencias de comunicación por canal y finalidad (factura electrónica, avisos de deuda y corte, novedades, encuestas, muro). | Un socio que rechaza novedades por WhatsApp no recibe campañas por ese canal, pero sí avisos obligatorios. |
| CP-PER-0038 | RF-PER-038; M01 §5.3; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Contacto directo por WhatsApp y correo desde la ficha, registrado en el centro de comunicaciones. | Enviar un correo desde la ficha deja la comunicación en la pestaña Comunicaciones. |
| CP-PER-0039 | RF-PER-039; M01 §5.3; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Registrar consentimientos con finalidad, base de tratamiento, versión del texto aceptado, canal, fecha y revocación. | Revocar el consentimiento de marketing deja constancia y deshabilita esa finalidad. |
### 1.4 Titulares (M01 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0040 | RF-PER-040; M01 §5.4; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Alta de titular sobre una persona existente o nueva, con número de titular secuencial único sin colisiones concurrentes. | Dos altas simultáneas obtienen números distintos y consecutivos de la secuencia del tenant. |
| CP-PER-0041 | RF-PER-041; M01 §5.4; PRO-O2-04 | O2 | Estándar | migración | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Número de titular manual opcional, controlando unicidad. | Un número manual repetido se rechaza; fuera de una corrida de migración el ingreso manual no está disponible. |
| CP-PER-0042 | RF-PER-042; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Series de numeración del titular (única, o separada por asociados y no asociados). | Con serie única, el número no cambia cuando la persona se asocia o deja de ser asociada. |
| CP-PER-0043 | RF-PER-043; M01 §5.4; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Estados del titular (solicitante, activo, dado de baja), fecha de alta, fecha de baja, causa de baja de catálogo y detalle. | La baja exige causa del catálogo y queda en la historia con fecha efectiva. |
| CP-PER-0044 | RF-PER-044; M01 §5.4; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Mostrar el vínculo de asociado (número de asociado, estado, fecha de ingreso) desde M17, sin gestionar capital ni asamblea. | La ficha muestra "Asociado N° 1234, activo" leído de M17; editarlo abre M17. |
| CP-PER-0045 | RF-PER-045; M01 §5.4; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Dar de baja al titular con controles: servicios activos, capital integrado (consulta a M17), titular sin cuentas, relaciones en otras cuentas; con solicitud de baja imprimible. | Con un contrato activo y la política por defecto, la baja se rechaza con la lista de contratos; la constancia se genera con la plantilla configurada. |
| CP-PER-0046 | RF-PER-046; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Reactivar un titular dado de baja con motivo, aprobación y nueva fecha efectiva. | La reactivación no borra la baja anterior: agrega un período nuevo en la historia. |
| CP-PER-0047 | RF-PER-047; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Conservar el número de titular al dar de baja, cuando así se indique. | El número de un titular dado de baja con "conserva número" no se reasigna. |
| CP-PER-0048 | RF-PER-048; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04 | Política que permite o impide contratos en titulares que no son asociados. | Con la política "impedir", M02 rechaza el alta de contrato para un cliente no asociado con el motivo. |
| CP-PER-0049 | RF-PER-049; M01 §5.4; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Señal "titular dado de baja" disponible para que M05 no facture a titulares de baja según política. | El lote de facturación excluye y reporta los contratos de titulares dados de baja si la política está activa. |
| CP-PER-0050 | RF-PER-050; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Política de alta de titulares como no asociados por defecto (la asociación se tramita en M17). | Con la política activa, un titular nuevo queda "cliente no asociado" hasta que M17 informa la asociación. |
| CP-PER-0051 | RF-PER-051; M01 §5.4; PRO-O6-05 | O6 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Indicador de gestión judicial del titular, informado por M08 (solo lectura en PER). | La ficha muestra la marca y enlaza al expediente de M08. |
| CP-PER-0052 | RF-PER-052; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04 | Garante del titular mediante relación de garantía con vigencia; exigencia según política. | Con "exigir garantía al ingresar titulares", el alta sin garante vigente se rechaza. |
| CP-PER-0053 | RF-PER-053; M01 §5.4; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04 | Indicador "representante en asamblea" leído de M17. | La marca aparece en la ficha cuando M17 la informa. |
| CP-PER-0054 | RF-PER-054; M01 §5.4; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Impresiones desde la ficha: ficha del titular, ficha de cuenta, ficha de adherentes, contrato, fianza de cuenta y de servicio, solicitud de alta/baja, deuda y deuda vencida (datos de M07), detalle de llamadas (datos de M10), consulta de… | Cada impresión usa una plantilla versionada del tenant y genera PDF guardado en T11 cuando corresponde. |
### 1.5 Cuentas (M01 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0055 | RF-PER-055; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Alta de cuenta para un titular con número único, fecha de alta, domicilio postal, condición IVA, contactos y entrega de factura. | La cuenta nueva toma la fecha de hoy como alta y deja el evento "Cuenta creada" en la historia. |
| CP-PER-0056 | RF-PER-056; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Exactamente una cuenta principal por titular con cuentas; cambiar la principal en una sola transacción. | Marcar otra cuenta como principal desmarca la anterior; nunca quedan cero ni dos principales. |
| CP-PER-0057 | RF-PER-057; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Cerrar una cuenta sin contratos vigentes, con motivo; reabrirla con aprobación. El saldo pendiente se informa desde M07 y no impide cerrar la estructura si la política lo permite. | Cerrar una cuenta con contratos activos se rechaza con la lista; una cerrada con saldo sigue visible en cobranza. |
| CP-PER-0058 | RF-PER-058; M01 §5.5; PRO-O2-04 | O2 | Núcleo | integración | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Condición IVA por cuenta (catálogo de M06) con valor propuesto desde el perfil fiscal del titular y advertencia si difiere de la constancia de ARCA. | Sin cuenta, la condición propuesta es Consumidor Final; una cuenta Exento con constancia Responsable Inscripto muestra advertencia. |
| CP-PER-0059 | RF-PER-059; M01 §5.5; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Datos de Ingresos Brutos de la cuenta (situación, número de inscripción, "no resetear", "no cobrar percepción", alícuota determinada), cuyos catálogos y cálculo son de M06. | Una cuenta marcada "no resetear" no cambia en la reasignación masiva de M06. |
| CP-PER-0060 | RF-PER-060; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Domicilio postal de la cuenta, empresa postal de reparto y zona/sector/recorrido de reparto de facturas. | Con "exigir empresa postal", la cuenta sin empresa postal no se guarda; el recorrido de reparto se lista por zona. |
| CP-PER-0061 | RF-PER-061; M01 §5.5; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Distrito y sección de la cuenta, con autocompletado del distrito al ingresar la sección y exigencia configurable en la cuenta principal (excepto titulares no asociados). | Ingresar una sección existente completa su distrito. |
| CP-PER-0062 | RF-PER-062; M01 §5.5; PRO-O5-02 | O5 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Grupo contable de la cuenta (catálogo de M15), exigible por política. | Con la política activa, la cuenta sin grupo contable no se guarda. |
| CP-PER-0063 | RF-PER-063; M01 §5.5; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Atributo "conjunto" de la cuenta, exigible por política. | Se implementa como campo extra precargado hasta confirmar su semántica. |
| CP-PER-0064 | RF-PER-064; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Entrega de factura de la cuenta: factura electrónica (correo, WhatsApp), no enviar papel, marca automática según política y confirmación para desmarcar la factura electrónica. | Desmarcar la factura electrónica de un servicio que lo exige pide confirmación explícita y queda auditado. |
| CP-PER-0065 | RF-PER-065; M01 §5.5; PRO-O5-02 | O5 | Estándar | integración | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Ver y gestionar desde la cuenta la adhesión a débito automático (tarjeta, CBU, titular de la tarjeta, estado en la pasarela, exclusiones por tipo de comprobante), delegando la operación a M07. | La pestaña muestra la adhesión vigente de M07; el alta se ejecuta en M07 y vuelve con estado. |
| CP-PER-0066 | RF-PER-066; M01 §5.5; PRO-O4-15 | O4 | Estándar | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Marca "excluir redondeo" de la cuenta, consumida por M05. | Una cuenta marcada no recibe el ajuste de redondeo en su comprobante. |
| CP-PER-0067 | RF-PER-067; M01 §5.5; PRO-O6-05 | O6 | Estándar | regla | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Marca "no cobrar recargo" de la cuenta con autorización según política; el efecto lo aplica M08/M07. | La marca exige aprobación cuando la política lo indica y figura en la historia. |
| CP-PER-0068 | RF-PER-068; M01 §5.5; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Número de ficha correlativo de la cuenta. | El número sale de una secuencia del tenant, no de MAX+1. |
| CP-PER-0069 | RF-PER-069; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Estructura de la cuenta en árbol: cuenta → grupos de facturación (M05) → contratos (M02) con servicio, identificador de medidor o conexión, estado y categoría; indicador "posee varios grupos". | La ficha de la Municipalidad ficticia muestra Energía (conectado, alumbrado público) y Gas (baja) en su grupo. |
| CP-PER-0070 | RF-PER-070; M01 §5.5; PRO-O2-04 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Orden y presentación de los contratos de la cuenta: por grupo e identificador; mostrar observación del contrato; desagrupar; mostrar por defecto solo contratos activos. | Con "solo activos" por defecto, el filtro puede desactivarse y se recuerda por usuario. |
| CP-PER-0071 | RF-PER-071; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | La cuenta de PER es la unidad estructural; la modalidad de cuenta corriente separada o unificada es política de M07 y nunca mezcla titulares. | Una cuenta unificada del titular A no incorpora contratos de B aunque compartan domicilio. |
| CP-PER-0072 | RF-PER-072; M01 §5.5; PRO-O2-04 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Validaciones del alta de cuenta: domicilio completo, contactos, zona (si se exige), distrito/sección, grupo contable, conjunto, empresa postal y deuda en el domicilio, cada una con su política. | Cada validación fallida indica el campo y la política que la exige. |
### 1.6 Domicilios y geolocalización (M01 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0073 | RF-PER-073; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Domicilio normalizado con el catálogo geográfico (país, provincia, departamento/municipio, localidad, código postal, calle, barrio) más altura o "sin número", piso, departamento, edificio/torre, entrecalles, referencias de acceso y datos… | Se carga un domicilio rural sin altura con referencias y queda válido. |
| CP-PER-0074 | RF-PER-074; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Conservar el texto original y la versión normalizada con su procedencia (fuente, identificador en la fuente, versión del catálogo, fecha). | Re-normalizar no pierde el texto original. |
| CP-PER-0075 | RF-PER-075; M01 §5.6; PRO-O2-05 | O2 | Núcleo | integración | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Domicilios de la persona por rol: real/personal, fiscal (desde ARCA), postal/correspondencia, laboral; con vigencia. | El domicilio fiscal de ARCA convive con el real y el postal sin pisarlos. |
| CP-PER-0076 | RF-PER-076; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Obtener candidatos de ubicación, mostrar el punto en Google Maps y permitir confirmarlo o corregirlo. | El operador ve el candidato y confirma; queda "confirmado" con autor y fecha. |
| CP-PER-0077 | RF-PER-077; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Estado y precisión del punto: confirmado, aproximado, pendiente, para revisar, no disponible; sin mostrar precisión inexistente. | Un punto por centroide de localidad se muestra "aproximado". |
| CP-PER-0078 | RF-PER-078; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Historial de ubicación de cada domicilio (fuente, momento, actor, motivo). | Corregir el punto deja la versión anterior consultable. |
| CP-PER-0079 | RF-PER-079; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Ubicación por coordenadas o referencias cuando no hay coincidencia de calle y altura, con revisión. | Un loteo nuevo sin calle en catálogo se guarda con texto y punto marcado "para revisar". |
| CP-PER-0080 | RF-PER-080; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Ante caída o límite del proveedor, guardar el formulario y dejar pendiente el enriquecimiento geográfico. | Con el geocodificador caído, la cuenta se guarda y el job la completa después. |
| CP-PER-0081 | RF-PER-081; M01 §5.6; PRO-O2-05 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Usar la ubicación del dispositivo solo con permiso y ofreciendo alternativa. | Si el socio niega el permiso, puede marcar el punto en el mapa o escribir referencias. |
| CP-PER-0082 | RF-PER-082; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04 | Controlar acceso al mapa, exportaciones y API de domicilios por tenant, permiso y relación autorizada. | Un usuario sin `per.domicilios.ver` no ve el mapa ni exporta direcciones. |
| CP-PER-0083 | RF-PER-083; M01 §5.6; PRO-O2-05 | O2 | Estándar | funcional | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Formato de impresión del domicilio configurable (con o sin piso, departamento, barrio y código postal). | El tenant elige el formato y la factura lo usa. |
| CP-PER-0084 | RF-PER-084; M01 §5.6; PRO-O2-05 | O2 | Estándar | seguridad | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Solicitar el alta de una calle no encontrada al catálogo de T04 según permiso de carga de calles. | Sin permiso, el operador deja la solicitud y el domicilio queda con texto original. |
| CP-PER-0085 | RF-PER-085; M01 §5.6; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Alternativa accesible al mapa en todos los recorridos (texto, referencias, teclado). | Un recorrido de alta se completa con teclado y sin operar el mapa. |
### 1.7 Inmuebles y puntos de prestación (M01 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0086 | RF-PER-086; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Registrar inmuebles con domicilio, nomenclatura catastral de seis partes configurable (numérica o alfanumérica), partida, chacra, quinta, fracción, parcela y subparcela, y todos los atributos de `PROPIEDA`. | El tenant cambia las etiquetas Cod/Sec/Man/Par/PH/Lote y el formulario las usa. |
| CP-PER-0087 | RF-PER-087; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con INM-PH-001: Inmueble Edificio demo con 8 unidades funcionales CU-PER-10 | Unidades funcionales dentro de un inmueble (propiedad horizontal), con cantidad de departamentos y tipo de edificio. | Un edificio con 8 unidades permite un punto de prestación por unidad. |
| CP-PER-0088 | RF-PER-088; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Relaciones persona–inmueble con vigencia: propietario, copropietario, ocupante, inquilino, poseedor, administrador de consorcio, responsable de pago. | El propietario puede no ser titular de ningún contrato del inmueble. |
| CP-PER-0089 | RF-PER-089; M01 §5.7; PRO-O2-05 | O2 | Estándar | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Uso y estado del inmueble con catálogos del tenant (por ejemplo vivienda, comercio, baldío; habitado, deshabitado, en construcción). | Un inmueble baldío se filtra en el padrón de inmuebles. |
| CP-PER-0090 | RF-PER-090; M01 §5.7; PRO-O2-05 | O2 | Estándar | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Ítems de propiedad con valores (atributos tipados del inmueble). | Se agrega el ítem "superficie de pileta" numérico y se informa en el inmueble. |
| CP-PER-0091 | RF-PER-091; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Buscar inmuebles por nomenclatura (por partes), nomenclatura completa, partida, domicilio y persona, y seleccionarlos desde el alta de contrato. | Buscar por manzana y parcela devuelve los inmuebles coincidentes con igualdad normalizada. |
| CP-PER-0092 | RF-PER-092; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Impedir duplicar la misma parcela catastral y avisar coincidencias parciales. | Dar de alta una nomenclatura ya existente se rechaza y ofrece el inmueble existente. |
| CP-PER-0093 | RF-PER-093; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con DIR-CASA-001: Domicilio Domicilio compartido ficticio CU-TIT-01 | Puntos de prestación: dirección normalizada, inmueble, unidad, ubicación, datos de acceso y referencias; uno o varios contratos, incluso del mismo servicio y de titulares distintos. | En DIR-CASA-001 existen dos contratos de Internet de dos titulares distintos. |
| CP-PER-0094 | RF-PER-094; M01 §5.7; PRO-O2-05 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Consultar contratos de un punto o inmueble respetando privacidad: quien no tiene relación con un contrato ve solo que existe, sin titular ni deuda. | El hermano A no ve en el portal los datos del contrato de B en el mismo domicilio. |
| CP-PER-0095 | RF-PER-095; M01 §5.7; PRO-O7-01 | O7 | Estándar | regla | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Atributos del inmueble para cuotas de obra (frentes, ancho de calle por frente, zonas por frente, longitud y porcentaje de bocacalle, superficie, superficie edificada, coeficientes zonal y de edificación, TBM, metros de alumbrado y cloaca)… | M04 lee frente × ancho de calle del inmueble para calcular la cuota de pavimento. |
| CP-PER-0096 | RF-PER-096; M01 §5.7; PRO-O3-04 | O3 | Estándar | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Precargar un contrato desde un inmueble o una factibilidad, y actualizar el inmueble desde el contrato con permiso. | Elegir el inmueble completa domicilio y catastro del contrato. |
| CP-PER-0097 | RF-PER-097; M01 §5.7; PRO-O7-01 | O7 | Estándar | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Identificador GIS del inmueble y del punto, enlazado con M10. | Desde el punto se abre el elemento de red en M10. |
| CP-PER-0098 | RF-PER-098; M01 §5.7; PRO-O3-04 | O3 | Núcleo | funcional | TEN-001 con SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04 | Mudanza del titular: cierre del contrato en el punto de origen y alta en destino, o traslado técnico por OT, orquestado con M02 y M10, sin trasladar deuda. | La mudanza deja el contrato de origen con su deuda y fecha de cierre, y el de destino con su fecha de activación. |
### 1.8 Relaciones, representaciones y garantías (M01 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0099 | RF-PER-099; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04 | Relaciones persona–persona tipadas (cónyuge, hijo, padre/madre, hermano, conviviente, grupo familiar, discapacitado a cargo, representante legal, apoderado, tutor/curador, miembro de organización) con vigencia y evidencia. | La relación "cónyuge" tiene inicio y fin; terminada, deja de habilitar acciones. |
| CP-PER-0100 | RF-PER-100; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Representaciones y autorizaciones sobre titular, cuenta o contrato, con alcance por acción (consultar, pagar, solicitar gestiones, solicitar baja, firmar conformidad, recibir notificaciones, actualizar datos), vigencia y evidencia. | Un autorizado para "pagar" no puede solicitar la baja. |
| CP-PER-0101 | RF-PER-101; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Garantes y responsables de titular, cuenta o contrato, con vigencia y exigencia según política del servicio y de la cuenta. | Un contrato de un servicio que exige garante no se activa sin garantía vigente. |
| CP-PER-0102 | RF-PER-102; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Verificar y aprobar relaciones según su tipo (doble control para poderes y representación de organizaciones). | Un poder cargado por un operador queda "pendiente" hasta que un supervisor lo verifica. |
| CP-PER-0103 | RF-PER-103; M01 §5.8; PRO-O2-06 | O2 | Núcleo | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Revocación manual y vencimiento automático de relaciones, con aviso previo. | Al vencer, el autorizado pierde acceso a la cuenta desde ese día. |
| CP-PER-0104 | RF-PER-104; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04 | Registrar en cada operación hecha en nombre de un tercero quién actuó, por quién y con qué relación. | La auditoría de un pago hecho por un apoderado guarda actor, representado y relación. |
| CP-PER-0105 | RF-PER-105; M01 §5.8; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Autorizados gestionados por el titular desde el portal, con alcance limitado. | El titular agrega un autorizado para consultar y pagar; los alcances mayores piden validación. |
| CP-PER-0106 | RF-PER-106; M01 §5.8; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con PER-H-A / PER-H-B: Personas Hermano A y Hermano B, DNI-A y DNI-B (marcadores) CU-TIT-01, ESC-01 | Representación de personas jurídicas: la organización actúa solo por representantes vigentes con su alcance. | Si el representante cesa, deja de ver las cuentas de la organización. |
| CP-PER-0107 | RF-PER-107; M01 §5.8; PRO-O5-03 | O5 | Núcleo | funcional | TEN-001 con PER-H-A / PER-H-B: Personas Hermano A y Hermano B, DNI-A y DNI-B (marcadores) CU-TIT-01, ESC-01 | El pago de un tercero se registra en M07 como pagador sin crear relación ni derechos. | El hermano que pagó no obtiene acceso a los contratos del otro. |
| CP-PER-0108 | RF-PER-108; M01 §5.8; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Antes de una baja o transferencia, informar si la persona es adherente, beneficiaria, garante de un contrato conectado, garante de una cuenta o garante de un titular en otra cuenta. | La baja muestra "es garante de la cuenta 1002" antes de confirmar. |
### 1.9 Adherentes y beneficiarios (M01 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0109 | RF-PER-109; M01 §5.9; PRO-O10-04 | O10 | Núcleo | regla | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | **Reemplazado por RF-SOC-011, RF-SOC-014 y RF-SOC-024** (M18, dueño único; HUECO-TRV-01). Texto original: Adherentes y beneficiarios por contrato con persona, vínculo, titular del grupo, fechas de alta y baja, tarifa de adherente (M04)… | Un contrato de sepelio con cuatro adherentes muestra vínculo y vigencia de cada uno. |
| CP-PER-0110 | RF-PER-110; M01 §5.9; PRO-O10-04 | O10 | Núcleo | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | **Reemplazado por RF-SOC-013** (M18, dueño único; HUECO-TRV-01). Texto original: Impedir que una persona sea adherente activa del mismo servicio en dos contratos, salvo política; ofrecer dar de baja la adhesión anterior. | Cargar un adherente ya activo en otro contrato de sepelio informa la cuenta y ofrece la baja anterior. |
| CP-PER-0111 | RF-PER-111; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | **Reemplazado por RF-SOC-015 y RF-SOC-016** (M18, dueño único; HUECO-TRV-01). Texto original: Condiciones del adherente por categoría (rango de edad, ocupaciones y vínculos admitidos) y bajas o cambios de categoría en lote, con… | El proceso lista adherentes fuera de rango, el operador confirma y se generan notificaciones. |
| CP-PER-0112 | RF-PER-112; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | **Reemplazado por RF-SOC-017** (M18, dueño único; HUECO-TRV-01). Texto original: Aviso de adherentes que cumplen la mayoría de edad configurada (21 años por defecto) a un correo configurable. | El job diario avisa los adherentes que cumplen la edad ese día. |
| CP-PER-0113 | RF-PER-113; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04 | **Reemplazado por RF-SOC-019** (M18, dueño único; HUECO-TRV-01). Texto original: Los adherentes y beneficiarios siguen la desconexión y reconexión del contrato, excepto los fallecidos; consulta opcional al reconectar. | Reconectar un contrato no reconecta a un adherente fallecido. |
| CP-PER-0114 | RF-PER-114; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | **Reemplazado por RF-SOC-149** (M18, dueño único; HUECO-TRV-01). Texto original: Importar adherentes desde archivo. | La importación usa ExcelImportWizard con vista previa de errores. |
| CP-PER-0115 | RF-PER-115; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | **Reemplazado por RF-SOC-023** (M18, dueño único; HUECO-TRV-01). Texto original: Consultar la deuda del adherente (cuentas donde es titular o persona de la cuenta) al agregarlo, según política. | Con la política activa, un adherente con deuda propia muestra advertencia. |
| CP-PER-0116 | RF-PER-116; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | **Reemplazado por RF-SOC-012** (M18, dueño único; HUECO-TRV-01). Texto original: Política "no exigir adherente titular". | Con la política desactivada, el contrato exige que el titular figure como adherente. |
| CP-PER-0117 | RF-PER-117; M01 §5.9; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | **Reemplazado por RF-SOC-021** (M18, dueño único; HUECO-TRV-01). Texto original: Ocultar por defecto en la ficha a los adherentes dados de baja por fallecimiento. | Un filtro permite mostrarlos. |
### 1.10 Notas, bloqueos, documentación y adjuntos (M01 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0118 | RF-PER-118; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Notas con fecha, título, texto, autor, destino (persona, titular, cuenta, contrato), categoría y visibilidad (interna, caja, portal). | Una nota de visibilidad "caja" se muestra al cajero al seleccionar la cuenta. |
| CP-PER-0119 | RF-PER-119; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Historial de modificaciones de cada nota y borrado lógico con motivo, conservando la evidencia. | Eliminar una nota la oculta y la conserva con autor, fecha y motivo para auditoría. |
| CP-PER-0120 | RF-PER-120; M01 §5.10; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Notas automáticas del sistema no editables (cuenta creada, alta/desconexión del contrato, OT y transacción, recategorización, modificación especial, transferencia). | La nota "Recategorización" generada por M04 aparece con marca de sistema. |
| CP-PER-0121 | RF-PER-121; M01 §5.10; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Importar notas desde archivo (fecha `dd-mm-yyyy` u otros formatos declarados). | La importación valida la fecha y rechaza filas con cuenta inexistente. |
| CP-PER-0122 | RF-PER-122; M01 §5.10; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Mostrar observaciones de la cuenta en la búsqueda de titulares y la observación del contrato en la grilla. | Con la opción activa, la grilla de búsqueda muestra la última nota destacada. |
| CP-PER-0123 | RF-PER-123; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Bloqueos tipados sobre persona, titular, cuenta o contrato, con efectos explícitos (cobro en caja, pago web, facturación, emisión de deuda en web, baja, transferencia, nuevas contrataciones, reconexión, modificación de datos), causa de… | Un bloqueo "transferencia" impide transferir la cuenta y muestra la causa; el resto de operaciones sigue. |
| CP-PER-0124 | RF-PER-124; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Servicio de consulta de bloqueos vigentes por destino y efecto, que consumen M05, M07, M08, M02 y M19 antes de operar. | La caja consulta "cobro en caja" y recibe el bloqueo con su mensaje. |
| CP-PER-0125 | RF-PER-125; M01 §5.10; PRO-O2-06 | O2 | Núcleo | regla | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Historial de bloqueos (aplicación, levantamiento, vencimiento, autor, motivo). | La ficha lista bloqueos vigentes e históricos. |
| CP-PER-0126 | RF-PER-126; M01 §5.10; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Marca "no facturar" como bloqueo tipado sobre cuenta o contrato, con historial de marca y desmarca e importación desde archivo. | Un contrato marcado "no facturar" queda fuera del lote con el motivo informado. |
| CP-PER-0127 | RF-PER-127; M01 §5.10; PRO-O5-03 | O5 | Estándar | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Bloqueo de pago web y de publicación de comprobantes en el portal, consumido por M19/M07. | Con el bloqueo, el portal muestra la deuda sin botón de pago y con el mensaje configurado. |
| CP-PER-0128 | RF-PER-128; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Adjuntos de persona, titular, cuenta, contrato e inmueble almacenados en T11 con permisos heredados; contador en la ficha. | Un adjunto de la cuenta solo lo ve quien puede ver la cuenta. |
| CP-PER-0129 | RF-PER-129; M01 §5.10; PRO-O2-06 | O2 | Núcleo | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Requisitos documentales por tipo (días de vencimiento, plantilla, tipo, requisito por defecto) y documentación presentada por titular, cuenta o contrato con fecha, vencimiento, presentado sí/no y observaciones. | Un certificado de discapacidad con vigencia de 365 días vence al día 366 si no hay otro vigente. |
| CP-PER-0130 | RF-PER-130; M01 §5.10; PRO-O2-06 | O2 | Estándar | regla | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | Consultas de presentados, no presentados y vencidos con filtros por titular, contrato, fechas, estado del titular y tipo; y acciones tipadas al alta o al vencimiento (por ejemplo, quitar beneficio, crear tarea, aplicar bloqueo). | Al vencer el certificado se ejecuta la acción tipada configurada y queda registrada; un error en una acción no frena las demás. |
| CP-PER-0131 | RF-PER-131; M01 §5.10; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Panel de trámites y gestiones de la cuenta en la ficha (documentación de PER más solicitudes y reclamos de M09). | El panel muestra la documentación vencida y las solicitudes abiertas. |
### 1.11 Transferencias, cambio de titularidad y mudanzas (M01 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0132 | RF-PER-132; M01 §5.11; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Transferir una cuenta completa a otro titular (existente o nuevo) con validaciones (deuda, titular destino de baja, bloqueos) y efectos (contratos, grupos, débitos, IIBB, adherentes). | La cuenta pasa al titular B con fecha efectiva; los comprobantes previos siguen a nombre de A. |
| CP-PER-0133 | RF-PER-133; M01 §5.11; PRO-O4-15 | O4 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Cambio de titularidad de un contrato con fecha efectiva, preservando deuda e historia en el titular anterior; M02 ejecuta sobre el contrato. | Tras el cambio, el período anterior factura a A y el siguiente a B; la deuda de A queda en A. |
| CP-PER-0134 | RF-PER-134; M01 §5.11; PRO-O10-04 | O10 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Iniciar desde la ficha la transferencia de capital entre titulares; la ejecuta M17. | La operación aparece en el registro de transferencias con el resultado de M17. |
| CP-PER-0135 | RF-PER-135; M01 §5.11; PRO-O2-06 | O2 | Núcleo | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Simular los efectos antes de confirmar: deuda que queda en origen, conceptos a cobrar por transferencia (M04), cambios de IIBB, débitos automáticos, adherentes, grupo de facturación, relaciones y bloqueos. | La simulación lista cada efecto; confirmar sin simular no es posible. |
| CP-PER-0136 | RF-PER-136; M01 §5.11; PRO-O2-06 | O2 | Núcleo | integración | TEN-001 con DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06 | Aprobación según política y ejecución idempotente con reversión controlada. | Repetir la ejecución con la misma `Idempotency-Key` no duplica efectos; revertir deja ambos hechos en la historia. |
| CP-PER-0137 | RF-PER-137; M01 §5.11; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Registro de transferencias consultable y reimprimible (constancia con plantilla). | Se reimprime la constancia de una transferencia de hace un año. |
| CP-PER-0138 | RF-PER-138; M01 §5.11; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Crear el titular destino dentro de la transferencia, con opciones de no exigir cuenta principal y de marcar la cuenta transferida como principal. | La cuenta transferida a un titular nuevo queda como su principal. |
| CP-PER-0139 | RF-PER-139; M01 §5.11; PRO-O2-06 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Al quedar el titular origen sin cuentas, proponer su baja (no ejecutarla automáticamente). | La confirmación ofrece "dar de baja al titular origen" como acción separada. |
| CP-PER-0140 | RF-PER-140; M01 §5.11; PRO-O5-03 | O5 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Cambio de pagador o responsable de pago sin cambiar al titular. | El nuevo responsable de pago recibe las facturas por su canal sin acceder a otros contratos. |
| CP-PER-0141 | RF-PER-141; M01 §5.11; PRO-O4-15 | O4 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Transferencia por fallecimiento o sucesión a herederos con evidencia documental. | La transferencia exige adjuntar la documentación configurada para el tipo "sucesión". |
### 1.12 Ficha 360, búsqueda y padrón (M01 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0142 | RF-PER-142; M01 §5.12; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Búsqueda multicriterio de titulares por persona, calle, documento, CUIT, número de titular, rango "entre/y", cuenta, domicilio de servicios, solo cuentas con servicios activos, matrícula (exacta o parcial), medidor, teléfono y correo; con… | Buscar sin criterios no ejecuta la consulta y explica por qué. |
| CP-PER-0143 | RF-PER-143; M01 §5.12; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Grilla de resultados con N° de titular, nombre, documento, NIP (número de asociado), activo, más columnas configurables y vistas guardadas. | El usuario agrega la columna "localidad" y guarda la vista. |
| CP-PER-0144 | RF-PER-144; M01 §5.12; PRO-O2-07 | O2 | Núcleo | seguridad | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Acciones sobre el resultado: Agregar, Modificar, Baja, Consultar, Imprimir y Operación. | Cada acción respeta la capability correspondiente; sin permiso el botón no aparece. |
| CP-PER-0145 | RF-PER-145; M01 §5.12; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Ficha 360 con pestañas Persona, Titular, Cuentas y servicios (árbol), Saldo y movimientos, Facturas, Pagos, Gestiones y trámites, Reclamos, Comunicaciones, Documentos, Notas y bloqueos, Relaciones, Inmuebles, Historia; se abre en solo… | La ficha carga el resumen en menos de 2 s y cada pestaña bajo demanda. |
| CP-PER-0146 | RF-PER-146; M01 §5.12; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Vista simple de la ficha para operadores. | El usuario alterna vista simple y completa. |
| CP-PER-0147 | RF-PER-147; M01 §5.12; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Accesos directos desde la ficha: cuenta corriente, movimientos de capital, factibilidad, orden de trabajo, presupuesto, solicitud de ingreso, fianza, incidentes, cuenta de correo, consumo compartido y alta/baja de servicio (cada uno en su… | Cada acceso abre la pantalla del módulo dueño con el contexto del titular. |
| CP-PER-0148 | RF-PER-148; M01 §5.12; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Padrón de titulares con filtros (estado, fechas de alta, deuda, servicios, facturas, distrito), columnas elegibles, credenciales, filtros guardados y exportación. | El padrón filtrado se exporta a XLSX con las columnas elegidas, registrando la exportación. |
| CP-PER-0149 | RF-PER-149; M01 §5.12; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Informes y etiquetas de titulares, cuentas y servicios para correspondencia. | Las etiquetas usan el domicilio postal vigente con el formato del tenant. |
| CP-PER-0150 | RF-PER-150; M01 §5.12; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07 | Exportaciones con permiso, minimización de campos y registro de quién exportó qué. | Exportar el padrón sin `per.padron.exportar` es rechazado; cada exportación queda auditada. |
### 1.13 Historia, auditoría y datos extra (M01 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0151 | RF-PER-151; M01 §5.13; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Historia con fecha efectiva y fecha de registro de persona, titular, cuenta, domicilio, inmueble, punto de prestación y relaciones, que reemplaza `SUMSOC_HST`/`SERSOC_HST`. | Un cambio de domicilio con vigencia desde el 1 cargado el 15 muestra ambas fechas. |
| CP-PER-0152 | RF-PER-152; M01 §5.13; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Consulta "a una fecha" por fecha efectiva o por fecha de registro, declarando cuál interpreta. | Consultar la cuenta al 31/10 devuelve el domicilio vigente ese día. |
| CP-PER-0153 | RF-PER-153; M01 §5.13; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Auditoría de cada cambio con actor, origen (pantalla, API, job, importación), tenant y motivo (T02). | Cada edición tiene su evento de auditoría. |
| CP-PER-0154 | RF-PER-154; M01 §5.13; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Historial integrado en la ficha (cuenta, contrato, factibilidad, OT, presupuesto) con detalle de cambios. | La línea de tiempo mezcla los eventos de PER con los de M02, M10 y M11 filtrables por tipo. |
### 1.14 Duplicados y fusión (M01 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0155 | RF-PER-155; M01 §5.14; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06 | Detectar posibles duplicados al alta y en un proceso periódico, con puntaje por documento, CUIT/CUIL (incluido DNI extraído del CUIL), nombre fonético, fecha de nacimiento, contacto y domicilio. | Dos personas con igual DNI y apellido similar generan un caso de duplicado. |
| CP-PER-0156 | RF-PER-156; M01 §5.14; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01 | Bandeja de duplicados con decisión registrada: "no es la misma persona" o "es la misma persona". | Descartar un caso evita que vuelva a proponerse salvo nuevo dato. |
| CP-PER-0157 | RF-PER-157; M01 §5.14; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con PER-AUT-001: Persona humana Hija ficticia de PER-001, autorizada `view`/`pay` CU-PER-05 | Fusión solo con acción autorizada y aprobación, reasignando referencias por eventos, dejando la persona absorbida como "fusionada" y permitiendo reversión. | Tras la fusión, la búsqueda del DNI lleva a la persona sobreviviente y la ficha muestra la fusión en la historia. |
| CP-PER-0158 | RF-PER-158; M01 §5.14; PRO-O2-07 | O2 | Núcleo | seguridad | TEN-001 con TEN-002: Tenant Cooperativa Demo B (gas) CU-REG-01 y aislamiento | Nunca fusionar ni mostrar coincidencias entre tenants, ni fusionar por coincidencia de correo o DNI sin acción autorizada. | La detección nunca consulta datos de otro tenant (prueba de aislamiento). |
### 1.15 Privacidad y vínculo usuario–persona (M01 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0159 | RF-PER-159; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Vincular un usuario de acceso (T02) con la persona del tenant mediante verificación, sin conceder acceso por coincidencia de nombre, documento o correo. | Un usuario con el mismo correo que un titular no ve sus cuentas hasta completar la verificación. |
| CP-PER-0160 | RF-PER-160; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069 | Administrar los vínculos usuario–persona (ver, verificar manualmente, revocar) y su alcance de cuentas. | Revocar el vínculo cierra el acceso a esas cuentas en la sesión siguiente y en caché. |
| CP-PER-0161 | RF-PER-161; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01 | "Mis datos" en el portal: ver datos personales, actualizar contactos, domicilio postal y preferencias; los cambios sensibles (identificación, nombre) se solicitan y revisan. | El socio cambia su celular con verificación; un cambio de apellido genera una solicitud. |
| CP-PER-0162 | RF-PER-162; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con INT-H-A-001 / INT-H-B-001: Contratos (M02) Internet, conexiones CON-A/CON-B, equipos MOD-A/MOD-B CU-TIT-01, ESC-01 | En el portal, cada usuario ve solo sus titularidades y las cuentas o contratos de relaciones vigentes, para las acciones concedidas. | Un autorizado para consultar no ve el botón de baja. |
| CP-PER-0163 | RF-PER-163; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Solicitudes de derechos del titular de los datos (acceso, rectificación, actualización, supresión) con plazos, responsable y evidencia. | Una solicitud de acceso genera la exportación de datos personales y se cierra con constancia. |
| CP-PER-0164 | RF-PER-164; M01 §5.15; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Exportación de los datos personales de una persona (derecho de acceso) en formato legible. | La exportación incluye datos, relaciones, consentimientos y contactos, sin datos de terceros. |
| CP-PER-0165 | RF-PER-165; M01 §5.15; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01 | Anonimización o supresión de una persona compatible con la conservación fiscal y contable: los documentos económicos se conservan y los datos no necesarios se anonimizan. | Anonimizar una persona sin obligaciones vigentes conserva sus facturas con la identificación fiscal exigida y borra contactos y preferencias. |
| CP-PER-0166 | RF-PER-166; M01 §5.15; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal | Inventario de datos del módulo por entidad: finalidad, base de tratamiento, sensibilidad, plazo de conservación. | La sección 7 marca la categoría de cada campo personal. |
| CP-PER-0167 | RF-PER-167; M01 §5.15; PRO-O2-07 | O2 | Núcleo | integración | TEN-001 con SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04 | Minimización en API, exportaciones, bot e IA: no enviar datos personales a proveedores de IA sin acuerdo y evaluación previa. | Las API externas devuelven solo los campos del contrato del cliente de API. |
### 1.16 Importación, operaciones especiales y configuración (M01 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-PER-0168 | RF-PER-168; M01 §5.16; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con PER-H-A / PER-H-B: Personas Hermano A y Hermano B, DNI-A y DNI-B (marcadores) CU-TIT-01, ESC-01 | Importación masiva de personas, titulares, cuentas, inmuebles y relaciones con ExcelImportWizard (subir, vista previa con errores, confirmar). | Un archivo con 3 filas inválidas muestra los errores y confirma solo las válidas si el usuario lo elige. |
| CP-PER-0169 | RF-PER-169; M01 §5.16; PRO-O2-07 | O2 | Estándar | funcional | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Operaciones especiales de corrección: cambiar el número visible del titular o de la cuenta, corregir fecha de alta del titular, recuperar titular; con permiso propio, motivo, aprobación y auditoría. | Renumerar cambia solo el número visible; los identificadores internos y referencias no cambian. |
| CP-PER-0170 | RF-PER-170; M01 §5.16; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con INM-001: Inmueble Calle Ejemplo 100, nomenclatura ficticia 01-01-001-001-000-000 CU-04, CU-GEO-01 | Configuración del módulo: políticas (tres niveles), numeración, catálogos, conjuntos de campos extra, formatos de domicilio y nomenclatura, plantillas de impresión. | Cada cambio de configuración se versiona con vigencia (T04). |
| CP-PER-0171 | RF-PER-171; M01 §5.16; PRO-O2-07 | O2 | Núcleo | funcional | TEN-001 con ASO-001: Asociada (M17) Vínculo de asociada de PER-001 CU-03 | Catálogos del módulo administrables por el tenant: tipos de vínculo, causas de baja, causas de bloqueo, tipos de nota, usos y estados de inmueble, ocupaciones, estados civiles, tipos de documento, tipos de relación, tipos de requisito… | Un valor de catálogo en uso no se borra: se desactiva. |
| CP-PER-0172 | RF-PER-172; M01 §5.16; PRO-O2-07 | O2 | Núcleo | integración | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Publicar eventos de dominio de todas sus entidades para que los consuman los demás módulos (sección 12). | Crear una cuenta publica `per.account.created` en la misma transacción (outbox). |
| CP-PER-0173 | RF-PER-173; M01 §5.16; PRO-O2-04 | O2 | Núcleo | regla | TEN-001 con TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04 | Enviar el código de vinculación al contacto verificado del titular (DEC-043, método `otpToRegisteredContact`) a pedido de M19 (RF-POR-179): dada la cuenta o el suministro, M01 resuelve el titular, elige su correo o celular **verificado**… | Con el código correcto dentro de los 10 minutos el vínculo queda `verified` y el titular recibe el aviso; al sexto intento fallido la vinculación se bloquea 15 minutos; una cuenta inexistente recibe la misma respuesta que una existente. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-PER-6001 — AC-PER-01. Alta sin duplicar**

- Cubre: AC-PER-01; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01
- Dado PER-001 existe con DNI
- Cuando Se intenta crear otra persona con el mismo DNI
- Entonces Rechazo `per/duplicate-identifier` con enlace a la existente, salvo excepción aprobada.

**CP-PER-6002 — AC-PER-02. DNI dentro de CUIL**

- Cubre: AC-PER-02; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01
- Dado Persona con CUIL que contiene el DNI
- Cuando Se busca por DNI
- Entonces Aparece como candidata con puntaje 90.

**CP-PER-6003 — AC-PER-03. Dígito verificador**

- Cubre: AC-PER-03; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069
- Dado CUIT con dígito incorrecto
- Cuando Se guarda
- Entonces Error en línea; con dígito correcto queda `checkDigitOk`. Casos de prueba por prefijo 20, 23, 24, 27, 30, 33, 34 y resto 10.

**CP-PER-6004 — AC-PER-04. CUIL calculado**

- Cubre: AC-PER-04; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069
- Dado Persona con DNI y sexo
- Cuando Se crea
- Entonces CUIL propuesto `derivedFrom = calculatedFromDni`, `unverified`; la emisión que exige CUIT lo rechaza.

**CP-PER-6005 — AC-PER-05. Cuenta principal única**

- Cubre: AC-PER-05; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Titular con cuentas C1 (principal) y C2
- Cuando Dos usuarios marcan C2 y C1 como principal simultáneamente
- Entonces Exactamente una queda principal (índice único parcial); la otra solicitud recibe `409`.

**CP-PER-6006 — AC-PER-06. Números concurrentes**

- Cubre: AC-PER-06; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado 50 altas de titular en paralelo
- Cuando Se ejecutan
- Entonces 50 números distintos, sin huecos causados por colisión.

**CP-PER-6007 — AC-PER-07. Varios contratos en un domicilio**

- Cubre: AC-PER-07; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DIR-CASA-001: Domicilio Domicilio compartido ficticio CU-TIT-01
- Dado DIR-CASA-001
- Cuando Se crean INT-H-A-001 e INT-H-B-001
- Entonces Ambos se guardan; no hay error de unicidad.

**CP-PER-6008 — AC-PER-08. Deuda en domicilio**

- Cubre: AC-PER-08; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Otra cuenta con deuda vencida en el mismo catastro
- Cuando Se crea cuenta nueva
- Entonces Advertencia sin datos del deudor para quien no tiene permiso; con política `block` se rechaza con motivo.

**CP-PER-6009 — AC-PER-09. Cambio de titularidad**

- Cubre: AC-PER-09; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04
- Dado Contrato de A con deuda ARS 5.000
- Cuando Se transfiere a B con fecha 01/12
- Entonces La deuda sigue en A; las facturas previas siguen a nombre de A; la siguiente factura sale a B.

**CP-PER-6010 — AC-PER-10. Idempotencia de transferencia**

- Cubre: AC-PER-10; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado Transferencia aprobada
- Cuando Se llama dos veces a API-PER-50 con la misma `Idempotency-Key`
- Entonces Un solo contrato nuevo; la segunda respuesta devuelve el mismo resultado.

**CP-PER-6011 — AC-PER-11. Falla parcial**

- Cubre: AC-PER-11; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04
- Dado M05 rechaza la reasignación de grupo
- Cuando Se ejecuta
- Entonces Se compensa el contrato creado, la transferencia queda `failed` con tarea; no quedan contratos a medias.

**CP-PER-6012 — AC-PER-12. Bloqueo tipado**

- Cubre: AC-PER-12; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07
- Dado Cuenta con bloqueo `transfer`
- Cuando Se intenta transferir
- Entonces Rechazo con causa; cobrar en caja sigue permitido.

**CP-PER-6013 — AC-PER-13. Bloqueo vencido**

- Cubre: AC-PER-13; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: INM-PH-001: Inmueble Edificio demo con 8 unidades funcionales CU-PER-10
- Dado Bloqueo con `validTo` ayer
- Cuando Corre JOB-PER-04
- Entonces Queda `expired` y ya no lo devuelve API-PER-41.

**CP-PER-6014 — AC-PER-14. Documento vencido**

- Cubre: AC-PER-14; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-REP-001: Persona humana Representante legal ficticio de PER-JUR-001 con relación vigente CU-PER-04
- Dado Certificado con 365 días de vigencia presentado hace 366 días, sin otro vigente
- Cuando Corre JOB-PER-04
- Entonces `expired`; se ejecutan las acciones de vencimiento; un error en una acción no frena las otras.

**CP-PER-6015 — AC-PER-15. Fallecimiento**

- Cubre: AC-PER-15; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Titular con adherentes y es garante de otra cuenta
- Cuando Se registra fallecimiento
- Entonces Adhesiones de la persona en baja; tareas creadas; contratos sin cambios; la reconexión no reactiva al adherente fallecido.

**CP-PER-6016 — AC-PER-16. Autorización por acción**

- Cubre: AC-PER-16; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: SUM-AG-001: Contrato (M02) Agua residencial AG-RES, activación propuesta 01-11-2026 CU-04
- Dado Autorizado con `pay`
- Cuando Pide la baja de un contrato
- Entonces `403` con `per/relationship-scope`.

**CP-PER-6017 — AC-PER-17. Relación vencida**

- Cubre: AC-PER-17; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Relación vence hoy
- Cuando Al día siguiente el autorizado entra al portal
- Entonces No ve la cuenta.

**CP-PER-6018 — AC-PER-18. Geocodificador caído**

- Cubre: AC-PER-18; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Proveedor responde 503
- Cuando Se guarda una cuenta
- Entonces Se guarda con `geo.status = pending`; JOB-PER-02 reintenta.

**CP-PER-6019 — AC-PER-19. Calle inexistente**

- Cubre: AC-PER-19; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado Loteo nuevo
- Cuando Se carga el domicilio
- Entonces Texto original conservado, punto `needsReview`, sin calle homónima.

**CP-PER-6020 — AC-PER-20. Historia bitemporal**

- Cubre: AC-PER-20; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado Cambio de domicilio postal con vigencia 01/10 cargado el 15/10
- Cuando Se consulta al 05/10 por fecha efectiva
- Entonces Devuelve el domicilio nuevo; por fecha de registro devuelve el anterior.

**CP-PER-6021 — AC-PER-21. Notas de sistema**

- Cubre: AC-PER-21; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: INM-PH-001: Inmueble Edificio demo con 8 unidades funcionales CU-PER-10
- Dado Nota "Recategorización"
- Cuando Un operador intenta editarla
- Entonces `403`.

**CP-PER-6022 — AC-PER-22. Fusión con doble control**

- Cubre: AC-PER-22; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06
- Dado Caso `confirmedSame` solicitado por U1
- Cuando U1 intenta aprobar
- Entonces Rechazo; U2 aprueba; tras la reversión las referencias vuelven a la persona original.

**CP-PER-6023 — AC-PER-23. Adherente repetido — Reemplazado por el criterio de RF-SOC-013 (M18; HUECO-TRV-01); texto original**

- Cubre: AC-PER-23; RF-SOC-013; M01 §17.1
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01
- Dado Persona adherente activa en un contrato de sepelio
- Cuando Se agrega en otro contrato de sepelio
- Entonces Rechazo informando la cuenta; si PRM-PER-065, se ofrece dar de baja la anterior.

**CP-PER-6024 — AC-PER-24. Renumeración**

- Cubre: AC-PER-24; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Titular 1500
- Cuando Se renumera a 1600
- Entonces Cambia solo `holderNumber`; `_id` y referencias intactas; auditoría con aprobación.

**CP-PER-6025 — AC-PER-25. Importación**

- Cubre: AC-PER-25; M01 §17.1
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: INM-PH-001: Inmueble Edificio demo con 8 unidades funcionales CU-PER-10
- Dado Archivo con 100 filas, 3 inválidas
- Cuando Se importa
- Entonces Vista previa con 3 errores; se confirman 97; informe descargable.

**CP-PER-6026 — AC-PER-30. Pide datos sensibles (API-PER-11)**

- Cubre: AC-PER-30; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal
- Dado Cajero
- Cuando Pide datos sensibles (API-PER-11)
- Entonces `403`; la lectura no se registra como acceso exitoso.

**CP-PER-6027 — AC-PER-31. Pide exportación**

- Cubre: AC-PER-31; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado Usuario sin `per.padron.exportar`
- Cuando Pide exportación
- Entonces `403`.

**CP-PER-6028 — AC-PER-32. Pide la baja**

- Cubre: AC-PER-32; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal
- Dado Atención sin `per.titulares.baja`
- Cuando Pide la baja
- Entonces `403`; el botón no aparece.

**CP-PER-6029 — AC-PER-33. Lista personas**

- Cubre: AC-PER-33; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-H-A / PER-H-B: Personas Hermano A y Hermano B, DNI-A y DNI-B (marcadores) CU-TIT-01, ESC-01
- Dado Técnico de campo
- Cuando Lista personas
- Entonces Solo ve los puntos de sus órdenes asignadas.

**CP-PER-6030 — AC-PER-34. Llama a API-PER-68**

- Cubre: AC-PER-34; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Usuario del portal con mismo correo que un titular, sin vínculo verificado
- Cuando Llama a API-PER-68
- Entonces No recibe la cuenta del titular.

**CP-PER-6031 — AC-PER-35. Intenta vincular con 6 códigos erróneos**

- Cubre: AC-PER-35; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado Usuario del portal
- Cuando Intenta vincular con 6 códigos erróneos
- Entonces Bloqueo temporal (PRM-PER-102); intentos auditados; la respuesta no revela si el documento existe.

**CP-PER-6032 — AC-PER-36. Intenta editar una cuenta**

- Cubre: AC-PER-36; M01 §17.2
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Auditor
- Cuando Intenta editar una cuenta
- Entonces `403`.

**CP-PER-6033 — AC-PER-40. En TEN-002 se busca el DNI X**

- Cubre: AC-PER-40; M01 §17.3
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06
- Dado Persona con DNI X en TEN-001
- Cuando En TEN-002 se busca el DNI X
- Entonces Sin resultados; no se crea caso de duplicado entre tenants.

**CP-PER-6034 — AC-PER-41. Se pide `GET /api/per/titulares/:holderId` de TEN-001**

- Cubre: AC-PER-41; M01 §17.3
- Ola: O2 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de M01 §18.
- Datos de prueba: TEN-002: Tenant Cooperativa Demo B (gas) CU-REG-01 y aislamiento
- Dado Token de TEN-002
- Cuando Se pide `GET /api/per/titulares/:holderId` de TEN-001
- Entonces `404` (no `403`, para no revelar existencia).

**CP-PER-6035 — AC-PER-42. Se ejecuta en prueba**

- Cubre: AC-PER-42; M01 §17.3
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-002: Tenant Cooperativa Demo B (gas) CU-REG-01 y aislamiento
- Dado Consulta de repositorio sin `tenantId`
- Cuando Se ejecuta en prueba
- Entonces El plugin la rechaza.

**CP-PER-6036 — AC-PER-43. Se ejecuta**

- Cubre: AC-PER-43; RN-PER-117; M01 §17.3
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-002: Tenant Cooperativa Demo B (gas) CU-REG-01 y aislamiento
- Dado Copia de configuración de TEN-001 a TEN-003
- Cuando Se ejecuta
- Entonces No se copia ninguna persona, cuenta ni domicilio (RN-PER-117).

**CP-PER-6037 — AC-PER-44. Cambia de tenant en la sesión**

- Cubre: AC-PER-44; M01 §17.3
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-002: Tenant Cooperativa Demo B (gas) CU-REG-01 y aislamiento
- Dado Usuario con pertenencia a dos tenants
- Cuando Cambia de tenant en la sesión
- Entonces Vínculos, cuentas visibles, caché y descargas se recalculan.

**CP-PER-6038 — AC-PER-50. JOB-PER-01**

- Cubre: AC-PER-50; M01 §17.4
- Ola: O2 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01
- Dado ARCA no responde
- Cuando JOB-PER-01
- Entonces 5 reintentos con backoff; luego `pending` y aviso; el alta no queda bloqueada salvo política.

**CP-PER-6039 — AC-PER-51. Falla el broker**

- Cubre: AC-PER-51; M01 §17.4
- Ola: O2 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal
- Dado Evento `per.account.created`
- Cuando Falla el broker
- Entonces El outbox lo reenvía; los consumidores lo procesan una sola vez (deduplicación por `eventId`).

**CP-PER-6040 — AC-PER-52. Llega dos veces**

- Cubre: AC-PER-52; M01 §17.4
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06
- Dado Evento `tec.workOrder.closed` repetido
- Cuando Llega dos veces
- Entonces El traslado del punto se aplica una vez.

**CP-PER-6041 — AC-PER-53. Carga desde ProCoop**

- Cubre: AC-PER-53; M01 §17.4
- Ola: O2 · Prioridad: Núcleo · Tipo: migración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal
- Dado Migración
- Cuando Carga desde ProCoop
- Entonces Conteos por tabla y sumas de control coinciden (sección 19).

**CP-PER-5001 — ESC-01. Pago excedente de un hermano**

- Cubre: ESC-01; RF-PER-107; RN-PER-042, RN-PER-061, RN-PER-079; M01 §17.5
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DIR-CASA-001: Domicilio Domicilio compartido ficticio CU-TIT-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos hermanos con Internet en DIR-CASA-001. A (PER-H-A, INT-H-A-001) debe ARS 13.000 y paga ARS 15.000; B (PER-H-B, INT-H-B-001) tiene deuda propia. Aporte de PER y
- Entonces Las cuentas de A y B son distintas y de titulares distintos (RN-PER-042); PER no ofrece ninguna relación que permita a M07 imputar el excedente de A a B por compartir domicilio (RN-PER-061, RN-PER-079); el pago se imputa por M07: ARS 13.000 a A y ARS 2.000 a favor de A o pendientes de aplicación según la política aprobada; la deuda de B no cambia. Si A quiere pagar la deuda de B, debe hacerlo como pagador explícito de la factura de B (RF-PER-107), lo que no le da acceso a los datos de B.

## 3. Casos por caso de uso (CU)

**CP-PER-8001 — CU-03. Alta de persona y asociada sin duplicar (BASE §3)**

- Cubre: CU-03; RF-PER-001, RF-PER-040, RF-PER-044; RN-PER-001, RN-PER-004, RN-PER-113; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-001: Persona humana Ana Pérez, `ana@example.com`, DNI-DEMO-001 (marcador), estado activa CU-03, CU-04, CU-GEO-01
- Dado persona que solicita asociarse y contratar agua, con datos mínimos. -; actor: administrativo de atención. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) busca coincidencias (API-PER-03); 2) registra a Ana Pérez (PER-001) con contacto y domicilio, adjunta documentación (API-PER-02, T11); 3) crea titular en estado `applicant` (API-PER-14) y M17 registra la relación de asociada ASO-001; queda habilitada para iniciar una solicitud comercial en M09. -
- Entonces PER-001 y ASO-001 creadas sin duplicación; no hay contrato activo. - Excepción: si aparece una persona coincidente, se revisa y se usa el registro existente; no se fusiona automáticamente. - Requisitos: RF-PER-001..003, RF-PER-040, RF-PER-044, RN-PER-001, RN-PER-004, RN-PER-113.

**CP-PER-8002 — CU-04. Contrato sobre un inmueble (BASE §4)**

- Cubre: CU-04; RF-PER-086, RF-PER-093; RN-PER-074, RN-PER-100; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado Ana registrada; solicitud de agua con aprobación técnica. -; actor: administrativo comercial. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando 1) selecciona INM-001 (API-PER-31); 2) PER resuelve el punto de prestación (`per.resolveServicePoint`) y M02 crea SUM-AG-001 con Ana como titular en su cuenta principal y plan AG-RES; 3) M02 registra la activación efectiva al confirmarse la instalación. -
- Entonces Contrato activo vinculado a titular, cuenta, punto e inmueble. - Excepción: sin aprobación de instalación el contrato queda pendiente (M02). - Requisitos: RF-PER-086, RF-PER-093, RN-PER-074, RN-PER-100.

**CP-PER-8003 — CU-REG-01. Registro sin suministro (BASE §67)**

- Cubre: CU-REG-01; RF-PER-159; RN-PER-118, RN-PER-119, RN-PER-121; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado actor: persona nueva en la landing del tenant TEN-002. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando se registra (T02, USR-NUEVO-B, nuevo-b@example.com); elige Gas e inicia la solicitud (M09); PER crea la persona con los datos mínimos (PA-PER-11) y titular `applicant` cuando la solicitud lo requiere; si necesita asociarse, M17 lo informa. -
- Entonces Usuario registrado y solicitud en trámite; no se crea cuenta ni contrato hasta que corresponda; el CUIT se pide solo si la emisión lo exige (RN-PER-121). - Requisitos: RF-PER-159, RN-PER-118, RN-PER-119, RN-PER-121.

**CP-PER-8004 — CU-TIT-01. Dos hermanos en el mismo domicilio (BASE §83)**

- Cubre: CU-TIT-01; RF-PER-093, RF-PER-094; RN-PER-042, RN-PER-060, RN-PER-061; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DIR-CASA-001: Domicilio Domicilio compartido ficticio CU-TIT-01
- Dado actor: atención; hermanos A (PER-H-A) y B (PER-H-B). -, autenticado en TEN-001 con las capabilities de su rol
- Cuando ambos son titulares con cuentas propias; M02 crea INT-H-A-001 e INT-H-B-001 en dos puntos de prestación de DIR-CASA-001 (o en el mismo punto, sin unicidad); A paga, B queda pendiente; B pide la baja de su conexión. -
- Entonces Estados separados; la baja de B no afecta a A; la cuenta unificada de A no incorpora los servicios de B; A no ve datos de B en el portal. - Requisitos: RF-PER-093, RF-PER-094, RN-PER-042, RN-PER-060, RN-PER-061.

**CP-PER-8005 — CU-GEO-01. Domicilio de prestación georreferenciado (BASE §77)**

- Cubre: CU-GEO-01; RF-PER-073; RN-PER-066; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DIR-DEMO-001: Domicilio Córdoba, localidad demo, Calle Ejemplo 100, estado `pending`, sin coordenadas reales CU-GEO-01
- Dado DIR-DEMO-001, INM-001, estado inicial `pending`. - Requisitos: RF-PER-073..080, RN-PER-066..071.; actor: Ana (portal) u operador. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando selecciona Córdoba y localidad, busca la calle, completa altura y unidad; el sistema muestra la dirección normalizada y un candidato en el mapa; Ana u operador autorizado confirma; el contrato y la visita usan esa dirección; el domicilio fiscal queda separado. - Excepción: calle inexistente en el catálogo (loteo nuevo): se conserva el texto y las referencias, se marca el punto para revisión; no se usa una calle homónima ni coordenadas inventadas. -
- Entonces Se completa «Domicilio de prestación georreferenciado (BASE §77)» sin errores, con los efectos que exigen RF-PER-073, y quedan auditoría y evento del cambio

**CP-PER-8006 — CU-PER-01. Cambio de titularidad por venta del inmueble**

- Cubre: CU-PER-01; RF-PER-133, RF-PER-135, RF-PER-136; RN-PER-100, RN-PER-101, RN-PER-104; M01 §16
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado actor: atención y supervisor. -, autenticado en TEN-001 con las capabilities de su rol
- Cuando el comprador (persona nueva o existente) solicita el servicio; atención abre PAN-PER-14 tipo `ownershipChange` desde el contrato del vendedor; adjunta escritura o boleto; simula (deuda informativa del vendedor, cargos de transferencia, IIBB); supervisor aprueba; se ejecuta: contrato del vendedor `notInForce`, contrato nuevo del comprador con fecha efectiva; relación `owner` del inmueble actualizada. -
- Entonces La deuda y los comprobantes anteriores quedan a nombre del vendedor; el siguiente período factura al comprador. - Excepción: bloqueo `transfer` activo → rechazo con causa; si el comprador asume la deuda, se deriva a convenio en M08. - Requisitos: RF-PER-133, RF-PER-135, RF-PER-136, RN-PER-100, RN-PER-101, RN-PER-104.

**CP-PER-8007 — CU-PER-02. Mudanza del titular**

- Cubre: CU-PER-02; RF-PER-098; RN-PER-063, RN-PER-064; M01 §16
- Ola: O3 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el titular pide el servicio en el nuevo domicilio conservando su cuenta; se crea el punto nuevo; M02 cierra el contrato de origen y activa el de destino (o M10 ejecuta traslado técnico); al cerrar la OT, PER actualiza el punto (RN-PER-064). -
- Entonces Deuda y historia en el contrato de origen; cuenta sin cambios. - Requisitos: RF-PER-098, RN-PER-063, RN-PER-064.

**CP-PER-8008 — CU-PER-03. Fallecimiento del titular**

- Cubre: CU-PER-03; RF-PER-010, RF-PER-009, RF-PER-141; RN-PER-014; M01 §16
- Ola: O4 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TEN-001: Tenant Cooperativa Demo de Servicios (Córdoba) Tenant principal
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando un familiar presenta el certificado; supervisor registra fallecimiento (PAN-PER-16); se dan de baja adhesiones y beneficios de la persona; se crean tareas en M09 (sucesión o baja del titular, cambio de garante). -
- Entonces Servicios sin corte; la sucesión se hace como transferencia `succession` con la documentación exigida. - Excepción: registro por error → reversión con aprobación (RF-PER-010). - Requisitos: RF-PER-009, RF-PER-010, RF-PER-141, RN-PER-014.

**CP-PER-8009 — CU-PER-04. Representante de persona jurídica (municipalidad)**

- Cubre: CU-PER-04; RF-PER-005, RF-PER-100, RF-PER-102, RF-PER-106; RN-PER-078, RN-PER-080; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando la Municipalidad Demo (persona jurídica) tiene varias cuentas; se carga la relación `legalRepresentative` del intendente y `attorney` de un empleado con alcance `view`, `requestServices`; supervisor verifica la evidencia (decreto, poder). -
- Entonces El empleado ve y gestiona solo lo concedido; al cesar el mandato se revoca y pierde acceso. - Requisitos: RF-PER-005, RF-PER-100, RF-PER-102, RF-PER-106, RN-PER-078, RN-PER-080.

**CP-PER-8010 — CU-PER-05. Autorizado que paga por el titular**

- Cubre: CU-PER-05; RF-PER-104, RF-PER-105, RF-PER-107; RN-PER-079; relacionados: ESC-01; M01 §16
- Ola: O5 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-AUT-001: Persona humana Hija ficticia de PER-001, autorizada `view`/`pay` CU-PER-05
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el titular agrega desde la app a su hija como autorizada con alcance `view` y `pay` (PAN-PER-27); la hija vincula su usuario y paga la factura. -
- Entonces El pago queda en M07 con `onBehalfOf`; la hija no puede pedir la baja; ver ESC-01 para la imputación. - Requisitos: RF-PER-104, RF-PER-105, RF-PER-107, RN-PER-079.

**CP-PER-8011 — CU-PER-06. Duplicado detectado y fusión**

- Cubre: CU-PER-06; RF-PER-155; RN-PER-113, RN-PER-114; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: DUP-001: Caso de duplicado PER-DUP-A y PER-DUP-B (misma persona ficticia cargada dos veces) CU-PER-06
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando JOB-PER-03 detecta dos personas con el mismo DNI (una migrada con CUIL y otra cargada con DNI); el operador confirma "misma persona", elige valores y solicita fusión; otro usuario aprueba; los módulos reasignan referencias. -
- Entonces Persona absorbida `merged`; búsquedas redirigen; reversión posible dentro del plazo. - Requisitos: RF-PER-155..158, RN-PER-113, RN-PER-114.

**CP-PER-8012 — CU-PER-07. Bloqueo de cobro en caja**

- Cubre: CU-PER-07; RF-PER-123, RF-PER-124; RN-PER-095, RN-PER-096; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: BLQ-001: Bloqueo Cuenta CTA-1001-01, efecto `cashPayment`, causa "Cheque rechazado (demo)" CU-PER-07
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el supervisor aplica a una cuenta un bloqueo `cashPayment` causa "cheque rechazado" con mensaje para caja; el cajero intenta cobrar. -
- Entonces Con el modo por defecto (PA-PER-16) la caja muestra el mensaje y pide autorización del supervisor; el resto de canales sigue habilitado salvo otros efectos. - Requisitos: RF-PER-123, RF-PER-124, RN-PER-095, RN-PER-096.

**CP-PER-8013 — CU-PER-08. La misma persona en dos cooperativas**

- Cubre: CU-PER-08; RF-PER-158; RN-PER-002, RN-PER-120; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: PER-JUR-001: Persona jurídica Municipalidad Demo, CUIT marcador, tres cuentas (alumbrado público, edificios, agua) CU-PER-04, RF-PER-069
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando una persona es empleada en la cooperativa A y titular en la B; tiene un solo usuario de acceso (T02) con pertenencias a ambos tenants. -
- Entonces Cada tenant tiene su propia persona; no se cruzan datos, coincidencias ni fusiones; al cambiar de tenant en la sesión se recalculan vínculos y cuentas visibles. - Requisitos: RN-PER-002, RN-PER-120, RF-PER-158.

**CP-PER-8014 — CU-PER-09. CUIT con discrepancia en ARCA**

- Cubre: CU-PER-09; RF-PER-019; RN-PER-008, RN-PER-009; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se carga una CUIT con dígito válido; JOB-PER-01 obtiene una constancia con otra denominación. -
- Entonces Identificación `arcaMismatch`, aviso al operador; la cuenta Responsable Inscripto no puede activar contratos hasta resolver (RN-PER-008, PRM-PER-014). - Requisitos: RF-PER-019..021, RN-PER-009.

**CP-PER-8015 — CU-PER-10. Inmueble en propiedad horizontal**

- Cubre: CU-PER-10; RF-PER-086, RF-PER-087, RF-PER-093; RN-PER-076; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: INM-PH-001: Inmueble Edificio demo con 8 unidades funcionales CU-PER-10
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se da de alta un edificio con 8 unidades funcionales; cada unidad tiene un punto de prestación y su contrato de energía con titulares distintos. -
- Entonces La nomenclatura del edificio es única; las unidades comparten inmueble sin compartir deuda. - Requisitos: RF-PER-086, RF-PER-087, RF-PER-093, RN-PER-076.

**CP-PER-8016 — CU-PER-11. Transferencia de cuenta completa**

- Cubre: CU-PER-11; RF-PER-132, RF-PER-137; RN-PER-102, RN-PER-103; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: USR-NUEVO-B: Usuario (T02) `nuevo-b@example.com`, tenant TEN-002, servicio GAS, estado usuario registrado y solicitud en trámite CU-REG-01
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando un comercio cambia de razón social; la cuenta con tres contratos se transfiere al titular nuevo; se pregunta si conserva capital (M17); el titular origen queda sin cuentas y se propone su baja. -
- Entonces Contratos nuevos en la cuenta destino con fecha efectiva; IIBB advertido; constancia reimprimible. - Requisitos: RF-PER-132, RF-PER-137..139, RN-PER-102, RN-PER-103.

**CP-PER-8017 — CU-PER-12. Baja de titular**

- Cubre: CU-PER-12; RF-PER-045; RN-PER-031; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando se pide la baja; API-PER-17 informa contratos activos, capital, relaciones en otras cuentas; resueltos los impedimentos, se da de baja con causa y se imprime la constancia. - Requisitos: RF-PER-045, RN-PER-031..035.
- Entonces Se completa «Baja de titular» sin errores, con los efectos que exigen RF-PER-045, y quedan auditoría y evento del cambio

**CP-PER-8018 — CU-PER-13. Solicitud de acceso a datos personales**

- Cubre: CU-PER-13; RF-PER-163, RF-PER-164; M01 §16
- Ola: O2 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O2 desplegada; tenant ficticio TEN-001; semillas de M01 §18.
- Datos de prueba: TIT-001: Titular PER-001, número 1001, cuenta principal CTA-1001-01 CU-04
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando el titular pide desde la app "Descargar mis datos"; el responsable de privacidad verifica identidad y resuelve; se genera la exportación sin datos de terceros. - Requisitos: RF-PER-163, RF-PER-164.
- Entonces Se completa «Solicitud de acceso a datos personales» sin errores, con los efectos que exigen RF-PER-163, RF-PER-164, y quedan auditoría y evento del cambio
